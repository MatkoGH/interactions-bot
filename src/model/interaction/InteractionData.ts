import {
    APIApplicationCommandInteractionData,
    APIApplicationCommandInteractionDataOption,
    APIChatInputApplicationCommandInteractionData,
    APIContextMenuInteractionData,
    APIInteractionDataResolved,
    APIMessageApplicationCommandInteractionDataResolved,
    APIMessageButtonInteractionData,
    APIMessageComponentInteractionData,
    APIMessageSelectMenuInteractionData,
    APIModalSubmission,
    APIUserInteractionDataResolved,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ComponentType,
    ModalSubmitActionRowComponent,
} from "discord-api-types/v10"

import { Snowflake } from "../static/Snowflake"

// # Command Data

export class CommandInteractionData {

    /** The identifier of the invoked command. */
    public readonly id: Snowflake

    /** The name of the invoked command. */
    public readonly name: string

    /** The type of the invoked command. */
    public readonly type: ApplicationCommandType

    /** Converted users, roles, channels, and attachments. */
    public readonly resolved?:
        | APIInteractionDataResolved
        | APIUserInteractionDataResolved
        | APIMessageApplicationCommandInteractionDataResolved

    // * Initializer

    /**
     * Create a new interaction data instance.
     * @param raw The raw interaction data provided by the API.
     */
    public constructor(raw: APIApplicationCommandInteractionData) {
        this.id = raw.id
        this.name = raw.name
        this.type = raw.type
        this.resolved = raw.resolved
    }

    /**
     * Create a new interaction data instance and immediately convert it to its respective type.
     * @param raw The raw interaction data provided by the API.
     */
    public static init(
        raw: APIApplicationCommandInteractionData,
    ): CommandInteractionData {
        switch (raw.type) {
            case ApplicationCommandType.ChatInput:
                return new ChatInputCommandInteractionData(raw)
            case ApplicationCommandType.User:
                return new ContextMenuCommandInteractionData(raw)
            default:
                console.error("Invalid interaction type.")
                return new CommandInteractionData(raw)
        }
    }

    // * Transformer

    /** Whether the interaction is a chat input-invoked command. */
    public isCommand(): this is ChatInputCommandInteractionData {
        return this.type === ApplicationCommandType.ChatInput
    }

    /** Whether the interaction is a context menu-invoked command. */
    public isContextMenu(): this is ContextMenuCommandInteractionData {
        return (
            this.type === ApplicationCommandType.User ||
            this.type === ApplicationCommandType.Message
        )
    }
}

// # Chat Input Command Data

export class ChatInputCommandInteractionData extends CommandInteractionData {

    /** The parameters and values from the user. */
    public readonly options?: APIApplicationCommandInteractionDataOption[]

    /** The guild Snowflake identifier the command is registered to, if any. */
    public readonly guildId?: Snowflake

    // * Initializer

    public constructor(raw: APIChatInputApplicationCommandInteractionData) {
        super(raw)
        this.guildId = raw.guild_id
        this.options = raw.options
    }

    // * Computed

    /** 
     * The subcommand path.
     *  - `[group]/[subcommand]` (group and subcommand are present)
     *  - `[subcommand]` (only subcommand is present)
     *  - `undefined` (otherwise)
     */
    public get subcommandPath(): string | undefined {
        const group = this.options?.find(opt => opt.type === ApplicationCommandOptionType.SubcommandGroup)
        const subcommand = this.options?.find(opt => opt.type === ApplicationCommandOptionType.Subcommand)

        // Return undefined if no subcommand is present
        if (!subcommand) return undefined

        // Return the subcommand path
        return `${group ? group?.name + "/" : ""}${subcommand.name}`
    }
}

// # Context Menu Command Data

export class ContextMenuCommandInteractionData extends CommandInteractionData {

    /** The target user or message. */
    public readonly targetId: Snowflake

    // * Initializer

    public constructor(raw: APIContextMenuInteractionData) {
        super(raw)
        this.targetId = raw.target_id!
    }
}

// # Message Component Data

export class ComponentInteractionData {

    /** The identifier of the invoked component. */
    public readonly customId: string

    /** The type of the invoked component. */
    public readonly type: ComponentType

    // * Initializer

    /**
     * Create a new component interaction data instance.
     * @param raw The raw interaction data provided by the API.
     */
    public constructor(raw: APIMessageComponentInteractionData) {
        this.customId = raw.custom_id
        this.type = raw.component_type
    }

    /**
     * Create a new component interaction data instance and immediately convert it to its respective type.
     * @param raw The raw interaction data provided by the API.
     */
    public static init(
        raw: APIMessageComponentInteractionData,
    ): ComponentInteractionData {
        switch (raw.component_type) {
            case ComponentType.Button:
                return new ButtonComponentInteractionData(raw)
            case ComponentType.StringSelect:
            case ComponentType.UserSelect:
            case ComponentType.RoleSelect:
            case ComponentType.MentionableSelect:
            case ComponentType.ChannelSelect:
                return new SelectMenuComponentInteractionData(raw)
            default:
                console.error("Invalid component type.")
                return new ComponentInteractionData(raw)
        }
    }

    // * Transformer

    /** Whether the interaction is a button. */
    public isButton(): this is ButtonComponentInteractionData {
        return this.type === ComponentType.Button
    }

    /** Whether the interaction is a select menu. */
    public isSelectMenu(): this is SelectMenuComponentInteractionData {
        return (
            this.type === ComponentType.StringSelect ||
            this.type === ComponentType.UserSelect ||
            this.type === ComponentType.RoleSelect ||
            this.type === ComponentType.MentionableSelect ||
            this.type === ComponentType.ChannelSelect
        )
    }
}

// # Button Component Data

export class ButtonComponentInteractionData extends ComponentInteractionData {

    // * Initializer

    /**
     * Create a new button interaction data instance.
     * @param raw The raw interaction data provided by the API.
     */
    public constructor(raw: APIMessageButtonInteractionData) {
        super(raw)
    }
}

// # Select Menu Component Data

export class SelectMenuComponentInteractionData extends ComponentInteractionData {

    /** The values selected by the user. */
    public readonly values: string[]

    // * Initializer

    /**
     * Create a new select menu interaction data instance.
     * @param raw The raw interaction data provided by the API.
     */
    public constructor(raw: APIMessageSelectMenuInteractionData) {
        super(raw)
        this.values = raw.values!
    }
}

// # Modal Submission Data

export class ModalSubmissionData {

    /** The identifier of the invoked component. */
    public readonly customId: string

    /** The values submitted by the user. */
    public readonly components: ModalSubmitActionRowComponent[]

    // * Initializer

    /**
     * Create a new modal submission data instance.
     * @param raw The raw interaction data provided by the API.
     */
    public constructor(raw: APIModalSubmission) {
        this.customId = raw.custom_id
        this.components = raw.components
    }
}
