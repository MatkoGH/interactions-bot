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

    /** Computed endpoint starting point (from Endpoint). */
    public get endpoint() {
        return Endpoint.latest.application(this.applicationId)
    }

    // * Environement

    /** @env Computed client application identifier. */
    public get applicationId(): Snowflake {
        return process.env.APPLICATION_ID!
    }

    /** @env Computed client application secret. */
    public get applicationSecret(): string {
        return process.env.APPLICATION_SECRET!
    }

    /** @env Computed client request headers. */
    public get requestHeaders(): Record<string, string> {
        return {
            "Authorization": `Bot ${this.applicationSecret}`,
            "Content-Type": "application/json",
        }
    }

    /** @env Computed client public key. */
    public get publicKey(): string {
        return process.env.APPLICATION_PUBLIC_KEY!
    }

    // * Singleton

    private static instance: Client
    private constructor() { }

    /** Shared instance of `Client`. */
    public static get shared(): Client {
        return this.instance || (this.instance = new this())
    }

    // * Method
}
