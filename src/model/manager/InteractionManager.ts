import { APIInteraction } from "discord-api-types/v10"

import { Context, Next } from "hono"
import nacl from "tweetnacl"

import Interaction from "../interaction/Interaction"
import Logger, { StatusCode } from "../Logger"

import { AnyInteractionHandler } from "../interaction/InteractionHandler"

import { concatUint8Arrays, valueToUint8Array } from "../../util/Uint18Array"

// # Interaction Manager

export default class InteractionManager {

    /** Array of registed interaction handlers. */
    private handlers: AnyInteractionHandler[] = []

    // * Singleton

    private static instance: InteractionManager
    private constructor() { }

    /** Shared instance of `InteractionManager`. */
    public static get shared(): InteractionManager {
        return this.instance || (this.instance = new this())
    }

    // * Method

    /**
     * Register an interaction handler.
     * @param handler The handler to register.
     */
    public register(handler?: AnyInteractionHandler) {
        if (handler !== undefined) this.handlers.push(handler)
    }

    private handlerFor(interaction: Interaction): AnyInteractionHandler {
        const handler = this.handlers.find(handler => {
            if (interaction.isAutocompleteRequest() && handler.isAutocompleteRequestHandler())
                return interaction.commandName === handler.commandName

            if (interaction.isCommand() && handler.isCommandHandler())
                return interaction.commandName === handler.command.name

            if (interaction.isComponent() && handler.isComponentHandler())
                return interaction.customId === handler.customId

            if (interaction.isModalSubmission() && handler.isModalSubmissionHandler())
                return interaction.customId === handler.customId

            return false
        })

        if (handler === undefined)
            throw new Error(`Could not find a handler for the interaction (id: ${interaction.id}; type: ${interaction.type}).`)

        return handler
    }

    // * Server Method

    /**
     * Handle an incoming interaction request.
     * @param context The context of the request provided by Hono.
     * @returns The response to the request.
     */
    public async handle(context: Context): Promise<Response> {
        const raw = context.get("parsed_body") as APIInteraction
        const interaction = Interaction.init(raw, context.env)

        // Acknowledge a ping interaction
        if (interaction.isPing()) {
            // Respond with [200] OK
            return new Response(interaction.acknowledgeData, { status: StatusCode.OK })
        }

        try {
            // Get a handler to handle the interaction if possible
            const handler = this.handlerFor(interaction)
            await handler.handle(interaction)

            // Respond with [200] OK
            return new Response("Interaction received.", { status: StatusCode.OK })
        } catch (error) {
            Logger.shared.error(String(error), {
                code: StatusCode.BadRequest,
            })

            // Respond with [404] Not Found
            return new Response(null, { status: StatusCode.NotFound })
        }
    }

    /**
     * Verifies the interaction request signature.
     * @param context The context of the request provided by Hono.
     */
    public async verificationMiddleware(context: Context, next: Next) {
        const publicKey = context.env.APPLICATION_PUBLIC_KEY

        const rawBody = context.req.raw.body

        if (rawBody === null) {
            return new Response("Invalid request signature.", { status: StatusCode.NotImplemented })
        }

        // Get the necessary headers and body
        const signature = context.req.header("X-Signature-Ed25519") as string
        const timestamp = context.req.header("X-Signature-Timestamp") as string

        const body = await context.req.text()

        const timestampData = valueToUint8Array(timestamp)
        const bodyData = valueToUint8Array(body)
        const message = concatUint8Arrays(timestampData, bodyData)

        const signatureData = valueToUint8Array(signature, "hex")
        const publicKeyData = valueToUint8Array(publicKey, "hex")

        // Verify the request signature
        const isVerified = nacl.sign.detached.verify(
            message, signatureData, publicKeyData
        )

        // If the signature is invalid, return a 401 response
        if (!isVerified) {
            return new Response("Invalid request signature.", { status: StatusCode.Unauthorized })
        }

        context.set("parsed_body", JSON.parse(body))
        await next()
    }
}
