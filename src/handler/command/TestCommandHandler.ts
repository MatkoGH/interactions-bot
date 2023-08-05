import { TestCommand } from "../../configuration/command/TestCommand"

import { CommandInteraction } from "../../model/interaction/Interaction"
import { CommandInteractionHandler } from "../../model/interaction/InteractionHandler"

// # Test Command Handler

export default class TestCommandHandler extends CommandInteractionHandler {

    constructor() {
        super(TestCommand)
    }

    public async handle(interaction: CommandInteraction) {
        await interaction.respond({
            content: "Success!"
        })
    }
}