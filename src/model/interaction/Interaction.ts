import {
    APIApplicationCommandAutocompleteInteraction,
    APIApplicationCommandInteraction,
    APIGuildMember,
    APIInteraction,
    APIInteractionResponse,
    APIInteractionResponseCallbackData,
    APIMessage,
    APIMessageComponentInteraction,
    APIModalInteractionResponseCallbackData,
    APIModalSubmitInteraction,
    APIPartialChannel,
    APIUser,
    InteractionResponseType,
    InteractionType,
    MessageFlags,
} from "discord-api-types/v10"

import { Snowflake } from "../static/Snowflake"

import {
    CommandInteractionData,
    ComponentInteractionData,
    ChatInputCommandInteractionData,
    ModalSubmissionData,
} from "./InteractionData"

import Client from "../client/Client"
import Endpoint from "../static/Endpoint"
import Logger, { StatusCode } from "../Logger"

import { Choice } from "../command/CommandOption"
import Environment from "../Environment"

// # Interaction

export default class Interaction {

    /** The interaction's Snowflake identifier. */
    public readonly id: Snowflake

    /** The interaction's token. */
    public readonly token: string

    /** The type of interaction. */
    public readonly type: InteractionType

    /** The application's Snowflake identifier. */
    public readonly applicationId: Snowflake

    /** Bitwise set of permissions the application has within the channel from which the interaction was invoked. */
    public readonly applicationPermissions: string

    /** The identifier of the guild from which the interaction was invoked, if any. */
    public readonly guildId?: Snowflake

    /** The identifier of the channel from which the interaction was invoked, if any. */
    public readonly channel?: APIPartialChannel

    /** The member who invoked the interaction, if sent from a guild. */
    public readonly member?: APIGuildMember

    /** The user who invoked the interaction, if sent from DMs. */
    public readonly user?: APIUser

    /** The selected locale of the invoking user. */
    public readonly locale?: string

    /** Read-only property; always `1`. */
    private readonly version: number

    /** The environment variables. */
    // protected readonly env: any

    // * Computed

    /** The user that invoked the interaction. */
    public get sender(): APIUser {
        return this.member?.user ?? this.user!
    }

    // * Initializer

    /**
     * Create a new interaction instance.
     * @param raw The raw interaction provided by the API.
     */
    public constructor(raw: APIInteraction, env?: any) {
        this.id = raw.id
        this.token = raw.token
        this.type = raw.type

        this.applicationId = raw.application_id
        this.applicationPermissions = raw.application_id

        this.guildId = raw.guild_id

        this.channel = raw.channel
        this.member = raw.member
        this.user = raw.user

        this.version = raw.version

        // this.env = env
    }

    /**
     * Create a new interaction instance and immediately convert it to its respective type
     * @param raw The raw interaction provided by the API.
     */
    public static init(raw: APIInteraction, env?: any): Interaction {
        switch (raw.type) {
            case InteractionType.ApplicationCommandAutocomplete:
                return new AutocompleteInteraction(raw, env)
            case InteractionType.ApplicationCommand:
                return new CommandInteraction(raw, env)
            case InteractionType.MessageComponent:
                return new ComponentInteraction(raw, env)
            case InteractionType.ModalSubmit:
                return new ModalSubmissionInteraction(raw, env)
            case InteractionType.Ping:
                return new PingInteraction(raw, env)
            default:
                console.error("Invalid interaction type.")
                return new Interaction(raw, env)
        }
    }

    // * Transformer

    /** Whether the interaction was invoked by an autocomplete request. */
    public isAutocompleteRequest(): this is AutocompleteInteraction {
        return this.type === InteractionType.ApplicationCommandAutocomplete
    }

    /** Whether the interaction was invoked by a command. */
    public isCommand(): this is CommandInteraction {
        return this.type === InteractionType.ApplicationCommand
    }

    /** Whether the interaction was invoked by a message component. */
    public isComponent(): this is ComponentInteraction {
        return this.type === InteractionType.MessageComponent
    }

    /** Whether the interaction was invoked by a modal submission. */
    public isModalSubmission(): this is ModalSubmissionInteraction {
        return this.type === InteractionType.ModalSubmit
    }

    /** Whether the interaction is a ping. */
    public isPing(): this is PingInteraction {
        return this.type === InteractionType.Ping
    }

    // * Responder

    /**
     * Respond to the interaction.
     * @param endpointUrl The endpoint URL to respond to.
     * @param responseData The data to respond to the interaction with.
     */
    protected async sendTo(endpointUrl: URL, responseData: APIInteractionResponse) {
        const { secret } = Environment.shared.application

        const response = await fetch(endpointUrl, {
            method: "POST",
            headers: Client.shared.requestHeaders(secret),
            body: JSON.stringify(responseData),
        })

        // Log any errors
        if (response.status !== StatusCode.NoContent) {
            Logger.shared.error("Failed to respond to interaction.", {
                code: response.status,
            })
        }
    }
}

export type ResponseData = Omit<APIInteractionResponseCallbackData, "flags">

// # Respondable Interaction

export abstract class RespondableInteraction extends Interaction {

    // * Method

    /**
     * Defer a response to the interaction.
     * @param ephemeral Whether the response should be ephemeral. Defaults to `false`.
     */
    public async defer(ephemeral: boolean = false): Promise<void> {
        const endpointUrl = Endpoint.latest.interaction(this.id, this.token).callback.url
        const responseData: APIInteractionResponse = {
            type: InteractionResponseType.DeferredChannelMessageWithSource,
            data: {
                flags: ephemeral ? MessageFlags.Ephemeral : undefined,
            },
        }

        // Respond to the interaction
        await this.sendTo(endpointUrl, responseData)
    }

    /**
     * Edit the original response to the interaction.
     * @param data The data to edit the original response with.
     * @param ephemeral Whether the response should be ephemeral. Defaults to `false`.
     */
    public async editResponse(data: ResponseData, ephemeral: boolean = false): Promise<void> {
        const endpointUrl = Endpoint.latest.webhook(this.applicationId, this.token).messages.original.url
        const responseData: APIInteractionResponse = {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                ...data,
                flags: ephemeral ? MessageFlags.Ephemeral : undefined,
            },
        }

        // Edit the response of the interaction
        await this.sendTo(endpointUrl, responseData)
    }

    /**
     * Respond to the interaction.
     * @param data The data to respond to the interaction with.
     * @param ephemeral Whether the response should be ephemeral. Defaults to `false`.
     */
    public async respond(data: string | ResponseData, ephemeral: boolean = false): Promise<void> {
        const endpointUrl = Endpoint.latest.interaction(this.id, this.token).callback.url
        const responseData: APIInteractionResponse = {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: typeof data === "string" ? {
                content: data, 
                flags: ephemeral ? MessageFlags.Ephemeral : undefined,
            } : {
                ...data,
                flags: ephemeral ? MessageFlags.Ephemeral : undefined,
            },
        }

        // Respond to the interaction
        await this.sendTo(endpointUrl, responseData)
    }
}

// # Modal-able Interaction

export class ModalableInteraction extends RespondableInteraction {

    // * Method

    /**
     * Show a modal to the user.
     * @param data The data to show within the modal.
     */
    public async showModal(data: APIModalInteractionResponseCallbackData): Promise<void> {
        const endpointUrl = Endpoint.latest.interaction(this.id, this.token).callback.url
        const responseData: APIInteractionResponse = {
            type: InteractionResponseType.Modal,
            data,
        }

        // Respond to the interaction
        await this.sendTo(endpointUrl, responseData)
    }
}

// # Autocomplete Request

export class AutocompleteInteraction extends Interaction {

    /** The data provided by the interaction. */
    public readonly data: ChatInputCommandInteractionData

    // * Computed

    /** Computed identifier of the command. */
    public get commandId(): string {
        return this.data.id
    }

    /** Computed name of the command. */
    public get commandName(): string {
        return this.data.name
    }

    // * Initializer

    public constructor(raw: APIApplicationCommandAutocompleteInteraction, env: any) {
        super(raw, env)
        this.data = new ChatInputCommandInteractionData(raw.data)
    }

    // * Method

    /**
     * Respond to the autocomplete request with choices.
     * @param choices The choices to respond to the autocomplete request with.
     */
    public async respondWith(choices: Choice[]): Promise<void> {
        const endpointUrl = Endpoint.latest.interaction(this.id, this.token).callback.url
        const responseData: APIInteractionResponse = {
            type: InteractionResponseType.ApplicationCommandAutocompleteResult,
            data: {
                choices,
            },
        }

        // Respond to the interaction
        await this.sendTo(endpointUrl, responseData)
    }
}

// # Command

export class CommandInteraction extends ModalableInteraction {
    
    /** The data provided by the interaction. */
    public readonly data: CommandInteractionData

    // * Computed

    /** Computed identifier of the command. */
    public get commandId(): string {
        return this.data.id
    }

    /** Computed name of the command. */
    public get commandName(): string {
        return this.data.name
    }

    // * Initializer

    public constructor(raw: APIApplicationCommandInteraction, env: any) {
        super(raw, env)
        this.data = CommandInteractionData.init(raw.data)
    }
}

// # Message Component

export class ComponentInteraction extends ModalableInteraction {

    /** The message the interaction was attached to. */
    public readonly message?: APIMessage

    /** The data provided by the interaction. */
    public readonly data: ComponentInteractionData

    // * Computed

    /** Computed identifier of the component. */
    public get customId(): string {
        return this.data.customId
    }

    // * Initializer

    public constructor(raw: APIMessageComponentInteraction, env: any) {
        super(raw, env)

        this.message = raw.message
        this.data = ComponentInteractionData.init(raw.data)
    }

    // * Method

    /**
     * Acknowledge the interaction and update the message the component is attached to later.
     */
    public async deferUpdateOriginalMessage(): Promise<void> {
        const endpointUrl = Endpoint.latest.interaction(this.id, this.token).callback.url
        const responseData: APIInteractionResponse = {
            type: InteractionResponseType.DeferredMessageUpdate,
        }

        // Respond to the interaction
        await this.sendTo(endpointUrl, responseData)
    }

    /**
     * Update the message the component is attached to.
     * @param data The data to update the message with.
     */
    public async updateOriginalMessage(data: ResponseData): Promise<void> {
        const endpointUrl = Endpoint.latest.interaction(this.id, this.token).callback.url
        const responseData: APIInteractionResponse = {
            type: InteractionResponseType.UpdateMessage,
            data,
        }

        // Respond to the interaction
        await this.sendTo(endpointUrl, responseData)
    }
}

// # Modal Submission

export class ModalSubmissionInteraction extends RespondableInteraction {

    /** The data provided by the interaction. */
    public readonly data: ModalSubmissionData

    // * Computed

    /** Computed identifier of the modal. */
    public get customId(): string {
        return this.data.customId
    }

    // * Initializer

    public constructor(raw: APIModalSubmitInteraction, env: any) {
        super(raw, env)
        this.data = new ModalSubmissionData(raw.data)
    }
}

// # Ping Interaction

export class PingInteraction extends Interaction {

    // * Computed

    /** Computed ping acknowledge data. */
    public get acknowledgeData(): string {
        return JSON.stringify({
            type: InteractionResponseType.Pong,
        })
    }

    // * Initializer

    public constructor(raw: APIInteraction, env: any) {
        super(raw, env)
    }
}
