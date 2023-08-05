import { InteractionType } from "discord-api-types/v10";

import Interaction, {
    AutocompleteInteraction, 
    CommandInteraction, 
    ComponentInteraction, 
    ModalSubmissionInteraction
} from "./Interaction";

import Command from "../command/Command";

// # Interaction Handler

export default abstract class InteractionHandler<I extends Interaction> {

    public abstract readonly type: InteractionType

    // * Method

    public abstract handle(interaction: I): Promise<void>

    // * Transformer

    /** Whether the handler is an autocomplete request handler. */
    public isAutocompleteRequestHandler(): this is AutocompleteRequestInteractionHandler {
        return this.type === InteractionType.ApplicationCommandAutocomplete
    }

    /** Whether the handler is a command handler. */
    public isCommandHandler(): this is CommandInteractionHandler {
        return this.type === InteractionType.ApplicationCommand
    }

    /** Whether the handler is a component handler. */
    public isComponentHandler(): this is ComponentInteractionHandler {
        return this.type === InteractionType.MessageComponent
    }

    /** Whether the handler is a modal submission handler. */
    public isModalSubmissionHandler(): this is ModalSubmissionInteractionHandler {
        return this.type === InteractionType.ModalSubmit
    }
}

export type AnyInteractionHandler = InteractionHandler<Interaction>

// # Autocomplete Interaction Handler

export abstract class AutocompleteRequestInteractionHandler extends InteractionHandler<AutocompleteInteraction> {

    public readonly type: InteractionType = InteractionType.ApplicationCommandAutocomplete

    /** The name of the command to handle autocompletes for. */
    public readonly commandName: string

    // * Initializer

    /**
     * Create a new autocomplete interaction handler.
     * @param commandName The name of the command to handle autocompletes for.
     */
    public constructor(commandName: string) {
        super()
        this.commandName = commandName
    }
}

// # Command Interaction Handler

export abstract class CommandInteractionHandler extends InteractionHandler<CommandInteraction> {

    public readonly type: InteractionType = InteractionType.ApplicationCommand

    /** The command to handle. */
    public readonly command: Command

    // * Initializer

    /**
     * Create a new command interaction handler.
     * @param command The command to handle.
     */
    public constructor(command: Command) {
        super()
        this.command = command
    }
}

// # Component Interaction Handler

export abstract class ComponentInteractionHandler extends InteractionHandler<ComponentInteraction> {

    public readonly type: InteractionType = InteractionType.MessageComponent

    /** The identifier of the component to handle. */
    public readonly customId: string

    // * Initializer

    /**
     * Create a new component interaction handler.
     * @param customId The identifier of the component to handle.
     */
    public constructor(customId: string) {
        super()
        this.customId = customId
    }
}

// # Modal Submission Interaction Handler

export abstract class ModalSubmissionInteractionHandler extends InteractionHandler<ModalSubmissionInteraction> {

    public readonly type: InteractionType = InteractionType.ModalSubmit

    /** The identifier of the modal to handle. */
    public readonly customId: string

    // * Initializer

    /**
     * Create a new modal submission interaction handler.
     * @param customId The identifier of the modal to handle.
     */
    public constructor(customId: string) {
        super()
        this.customId = customId
    }
}
