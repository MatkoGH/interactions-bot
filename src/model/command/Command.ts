import { 
    ApplicationCommandType as CommandType,
    RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10"

import { Option, toRaw as toRawOption } from "./CommandOption"

// # Command

export default class Command {

    /** The name of the command. */
    public name: string

    /** The description of the `CHAT_INPUT` command. */
    public description: string

    /** The type of command. */
    public type: CommandType
    
    /** The parameters for the command. */
    public options?: Option[]

    /** The set of permissions represented as a bit set. */
    public defaultMemberPermissions: string | null

    /** Whether the command is available to use in direct messages with the app. */
    public isDMAllowed?: boolean

    /** Whether the command is age-restricted. */
    public isNSFW?: boolean

    // * Computed

    /** The command represented raw. */
    public get raw(): RESTPostAPIApplicationCommandsJSONBody {
        return toRaw(this)
    }

    // * Initializer

    /**
     * Create a new command.
     * @param name The name of the command.
     * @param description The description of the `CHAT_INPUT` command.
     */
    constructor(name: string, description: string = "", type: CommandType = CommandType.ChatInput) {
        this.name = name
        this.description = description

        this.type = type
        this.defaultMemberPermissions = null
    }

    // * Method

    /**
     * Add an option to the command.
     * @param option The option to add.
     */
    public addOption(option: Option): this {
        if (!this.options) this.options = []
        this.options.push(option)
        return this
    }

    /**
     * Add options to the command.
     * @param options The options to add.
     */
    public addOptions(...option: Option[]): this {
        option.forEach(option => this.addOption(option))
        return this
    }

    /**
     * Set the default member permissions of the command.
     * @param permissions The permissions represented as a bit set.
     */
    public setDefaultMemberPermissions(permissions: string): this {
        this.defaultMemberPermissions = permissions
        return this
    }

    /**
     * Set whether the command can be used in direct messages.
     * @param value The boolean to set.
     */
    public setIsDMAllowed(value: boolean): this {
        this.isDMAllowed = value
        return this
    }

    /**
     * Set whether the command is age-restricted.
     * @param value The boolean to set.
     */
    public setIsNSFW(value: boolean): this {
        this.isNSFW = value
        return this
    }
}

// # Transformer

export const toRaw = (command: Command): RESTPostAPIApplicationCommandsJSONBody => {
    return {
        name: command.name,
        description: command.description,
        type: command.type,
        options: command.options?.map(toRawOption),
        default_member_permissions: command.defaultMemberPermissions,
        dm_permission: command.isDMAllowed,
        nsfw: command.isNSFW,
    }
}

// # Exports

export {
    ApplicationCommandType as CommandType, 
    ApplicationCommandOptionType as OptionType,
} from "discord-api-types/v10"
