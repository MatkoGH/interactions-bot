import { Snowflake } from "..//static/Snowflake"

import Command from "../command/Command"
import Endpoint from "../static/Endpoint"

import CommandManager from "../manager/CommandManager"

// # Client

export default class Client {

    // * Computed

    /** Computed client commands (from CommandManager). */
    public get commands(): Command[] {
        return CommandManager.shared.commands
    }

    /** Get endpoint starting point (from Endpoint). */
    public endpoint(applicationId: Snowflake) {
        return Endpoint.latest.application(applicationId)
    }

    // * Environement
    
    /** Get client request headers. */
    public requestHeaders(secret: string): Record<string, string> {
        return {
            "Authorization": `Bot ${secret}`,
            "Content-Type": "application/json",
        }
    }

    // * Singleton

    private static instance: Client
    private constructor() { }

    /** Shared instance of `Client`. */
    public static get shared(): Client {
        return this.instance || (this.instance = new this())
    }
}
