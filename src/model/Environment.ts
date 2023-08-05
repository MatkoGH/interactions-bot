export default class Environment {

    // * Singleton

    private static instance: Environment
    private constructor() { }

    /** Shared instance of `Environment`. */
    public static get shared(): Environment {
        return this.instance || (this.instance = new this())
    }

    // * Method

    /**
     * Check if an flag was passed in argv.
     * @param name The flag name to look for.
     * @param aliases The shortened aliases of the argument.
     * @returns Whether the argument was passed.
     */
    public hasArgument(name: string, ...aliases: string[]): boolean {
        return process.argv.slice(2).includes(`--${name}`) || aliases.some(alias => process.argv.slice(2).includes(`-${alias}`))
    }

    /**
     * Whether the push commands flag was passed in argv.
     * @returns Whether the push commands flag was passed.
     */
    public get shouldPushCommands(): boolean {
        return this.hasArgument("push-commands", "p", "pc")
    }
}
