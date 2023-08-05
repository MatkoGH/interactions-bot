import {
    ApplicationCommandOptionType as OptionType,
    ChannelType,
    APIApplicationCommandOption,
    APIApplicationCommandSubcommandOption,
    APIApplicationCommandSubcommandGroupOption,
    APIApplicationCommandStringOption,
    APIApplicationCommandIntegerOption,
    APIApplicationCommandBooleanOption,
    APIApplicationCommandUserOption,
    APIApplicationCommandChannelOption,
    APIApplicationCommandRoleOption,
    APIApplicationCommandMentionableOption,
    APIApplicationCommandNumberOption,
    APIApplicationCommandAttachmentOption,
} from "discord-api-types/v10"

// # Option

export type Option =
    | SubcommandOption
    | SubcommandGroupOption
    | StringOption
    | IntegerOption
    | BooleanOption
    | UserOption
    | ChannelOption
    | RoleOption
    | MentionableOption
    | NumberOption
    | AttachmentOption

// * Base

export interface OptionBase<Type extends OptionType> {

    /** The type of option. */
    type: Type

    /** The name of the option. */
    name: string

    /** The description of the option. */
    description: string
}

// * Autocomplete/choices Wrapper

export type AutocompleteOrChoices<Base extends OptionBase<OptionType>, ChoiceType extends Choice> =
    | (Base & {
          /** Optional choices user can pick from. */
          choices?: undefined

          /** Whether the text can be auto-completed. */
          hasAutocomplete?: boolean
      })
    | (Base & {
          /** Optional choices user can pick from. */
          choices?: ChoiceType[]

          /** Whether the text can be auto-completed. */
          hasAutocomplete?: false
      })

// * Non-subcommand Type

export type NonSubcommandOption = Exclude<Option, SubcommandOption | SubcommandGroupOption>

// * Requireable Extension

export type Requireable = {

    /** Whether the option is required. */
    isRequired?: boolean
}

// # Subcommand

export type SubcommandOption = OptionBase<OptionType.Subcommand> & {

    /** Nested `NonSubcommandOption`s. */
    options?: NonSubcommandOption[]
}

export type SubcommandGroupOption = OptionBase<OptionType.SubcommandGroup> & {

    /** Nested `SubcommandOption`s. */
    options: SubcommandOption[]
}

// # String

export type StringOption = AutocompleteOrChoices<OptionBase<OptionType.String>, Choice<string>> & Requireable & {

    /** The minimum length. */
    minLength?: number

    /** The maximum length. */
    maxLength?: number
}

// # Integer

export type IntegerOption = AutocompleteOrChoices<OptionBase<OptionType.Integer>, Choice<number>> & Requireable & {

    /** Whether the option is required. */
    isRequired?: boolean

    /** The minimum value. */
    minValue?: number

    /** The maximum value. */
    maxValue?: number
}

// # Boolean

export type BooleanOption = OptionBase<OptionType.Boolean> & Requireable

// # User

export type UserOption = OptionBase<OptionType.User> & Requireable

// # Channel

export type ChannelOption = OptionBase<OptionType.Channel> & Requireable & {

    /** The allowed channel types. */
    channelTypes?: ChannelType[]
}

// # Role

export type RoleOption = OptionBase<OptionType.Role> & Requireable

// # Mentionable

export type MentionableOption = OptionBase<OptionType.Mentionable> & Requireable

// # Number

export type NumberOption = AutocompleteOrChoices<OptionBase<OptionType.Number>, Choice<number>> & Requireable & {

    /** The minimum value. */
    minValue?: number

    /** The maximum value. */
    maxValue?: number
}

// # Attachment

export type AttachmentOption = OptionBase<OptionType.Attachment> & Requireable

// # Choice

export interface Choice<ValueType extends string | number = string | number> {

    /** The displayed name of the choice. */
    name: string

    /** The value of the choice (a `string`, `integer`, or `double`). */
    value: ValueType
}

// # Transformer

export const toRaw = (option: Option): APIApplicationCommandOption => {
    const common = {
        type: option.type,
        name: option.name,
        description: option.description,
    }

    switch (option.type) {
        case OptionType.Subcommand:
        case OptionType.SubcommandGroup:
            return {
                ...common,
                options: option.options?.map(toRaw),
            } as APIApplicationCommandSubcommandOption | APIApplicationCommandSubcommandGroupOption
        case OptionType.String:
            return {
                ...common,
                choices: option.choices,
                hasAutocomplete: option.hasAutocomplete,
                minLength: option.minLength,
                maxLength: option.maxLength,
                required: option.isRequired,
            } as APIApplicationCommandStringOption
        case OptionType.Integer:
        case OptionType.Number:
            return {
                ...common,
                choices: option.choices,
                hasAutocomplete: option.hasAutocomplete,
                minValue: option.minValue,
                maxValue: option.maxValue,
                required: option.isRequired,
            } as APIApplicationCommandIntegerOption | APIApplicationCommandNumberOption
        case OptionType.Boolean:
        case OptionType.User:
        case OptionType.Role:
        case OptionType.Mentionable:
        case OptionType.Attachment:
            return {
                ...common,
                required: option.isRequired,
            } as APIApplicationCommandBooleanOption | APIApplicationCommandUserOption | APIApplicationCommandRoleOption | APIApplicationCommandMentionableOption | APIApplicationCommandAttachmentOption
        case OptionType.Channel:
            return {
                ...common,
                channelTypes: option.channelTypes,
                required: option.isRequired,
            } as APIApplicationCommandChannelOption
    }
}
