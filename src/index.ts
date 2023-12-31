import { Hono, MiddlewareHandler } from "hono"
import { StatusCode } from "./model/static/StatusCode"

import CommandManager from "./model/manager/CommandManager"
import InteractionManager from "./model/manager/InteractionManager"

import Environment from "./model/Environment"
import Logger from "./model/Logger"

import { TestCommand, TestCommandHandler } from "./configuration/command/TestCommand"

// # Registry

// Register commands
CommandManager.shared.register(
    TestCommand,
)

// Register handlers
InteractionManager.shared.register(
    new TestCommandHandler(),
)

// # Push Commands

if (Environment.shared.shouldPushCommands) {
    await CommandManager.shared.push()
}

// # Server

/** The relative URL path to the interactions handler. */
const PATH: string = "/bun-test"

/** The port to listen on. */
const PORT: number = 3286

/** The middleware to use for the interactions handler. */
const middleware: MiddlewareHandler[] = [
    InteractionManager.shared.verificationMiddleware,
]

/** The Hono server. */
const app = new Hono()
    .post(PATH, ...middleware, async (context) => {
        try {
            return await InteractionManager.shared.handle(context)
        } catch (error) {
            return new Response(`Error with interaction server: ${error}`, { status: StatusCode.InternalServerError })
        }
    })

export default {
    port: PORT,
    fetch: app.fetch,
}

// Log status to console
Logger.shared.joinedLog(
    ["Interactions server listening...", { bold: true, color: [65, 219, 121] }],
    [`\n - PATH: ${PATH}`, { color: [113, 157, 128] }],
    [`\n - PORT: ${PORT}`, { color: [113, 157, 128] }],
)
