import { ExampleCommand } from "../../configuration/command/ExampleCommand"

import { ChatInputCommandInteraction } from "../../model/interaction/Interaction"
import { CommandInteractionHandler } from "../../model/interaction/InteractionHandler"

// # Test Command Handler

export default class ExampleCommandHandler extends CommandInteractionHandler {

    constructor() {
        super(ExampleCommand)
    }

    public async handle(interaction: ChatInputCommandInteraction) {
        await interaction.respond('Success!', true)
    }
}