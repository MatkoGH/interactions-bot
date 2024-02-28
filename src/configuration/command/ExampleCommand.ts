import Command from "../../model/command/Command"
import ExampleCommandHandler from "../../handler/command/ExampleCommandHandler"

// # Test Command

export const ExampleCommand = new Command("test", "Test command.")
    .setIsDMAllowed(true)

export { ExampleCommandHandler }
