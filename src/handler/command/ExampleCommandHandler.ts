import { ExampleCommand } from "../../configuration/command/ExampleCommand"

import { CommandInteraction } from "../../model/interaction/Interaction"
import { CommandInteractionHandler } from "../../model/interaction/InteractionHandler"

// # Test Command Handler

export default class ExampleCommandHandler extends CommandInteractionHandler {

    constructor() {
        super(ExampleCommand)
    }

    public async handle(interaction: CommandInteraction) {
        if (interaction.data.isCommand()) {
            await interaction.respond(interaction.data.subcommandPath ?? "unknown")
        }
    }
}