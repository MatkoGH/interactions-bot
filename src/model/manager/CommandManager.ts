import { RESTPostAPIApplicationCommandsJSONBody as RawCommand } from "discord-api-types/v10"

import Client from "../client/Client"
import Command from "../command/Command"
import Logger, { StatusCode } from "../Logger"

// # Command Manager

export default class CommandManager {

    /** List of registered commands. */
    private commandList: Command[] = []

    // * Computed

    /** Computed list of registered commands. */
    public get commands(): Command[] {
        return this.commands
    }

    /** Computed list of registered commands formatted raw. */
    private get rawCommands(): RawCommand[] {
        return this.commandList.map(command => command.raw)
    }

    // * Singleton

    private static instance: CommandManager
    private constructor() { }

    /** Shared instance of `CommandManager`. */
    public static get shared(): CommandManager {
        return this.instance || (this.instance = new this())
    }

    // * Method

    /**
     * Register application commands and prepare them for a push to Discord if necessary.
     * @param commands The commands.
     */
    public register(...commands: Command[]) {
        this.commandList.push(...commands)
    }

    /**
     * Push all registered commands to Discord.
     * @param applicationId The identifier of the application you wish to push commands to.
     * @param applicationSecret The secret (token) of the application you wish to push commands to.
     */
    public async push(applicationId: string, applicationSecret: string) {
        const endpointUrl = Client.shared.endpoint(applicationId).commands.url
        
        // Publish commands to Discord
        const response = await fetch(endpointUrl, {
            method: "PUT",
            headers: Client.shared.requestHeaders(applicationSecret),
            body: JSON.stringify(this.rawCommands),
        })

        if (response.status === 200) {
            Logger.shared.log("Successfully pushed commands to Discord.")
        } else {
            Logger.shared.error("Failed to push commands to Discord.", {
                code: StatusCode.Conflict,
            })
        }
    }
}
