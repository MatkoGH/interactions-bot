import Command from "../../model/command/Command"
import TestCommandHandler from "../../handler/command/TestCommandHandler"

// # Test Command

export const TestCommand = new Command("test", "Test command.")
    .setIsDMAllowed(true)

export { TestCommandHandler }
