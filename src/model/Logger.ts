import { StatusCode } from "./static/StatusCode"

// # Log Manager

export default class Logger {

    // * Singleton

    private static instance: Logger
    private constructor() { }

    /** Shared instance of `Logger`. */
    public static get shared(): Logger {
        return this.instance || (this.instance = new this())
    }

    // * Method

    /**
     * Log a message to the console.
     * @param content The content of the message.
     * @param configuration The configuration of the message.
     */
    public log(content: string, configuration?: Logger.MessageConfiguration) {
        if (configuration !== undefined) {
            const wrappedMessage = this.ansiWrapped(content, configuration)
            return console.log(wrappedMessage)
        }

        console.log(content)
    }

    /**
     * Join and log multiple messages to the console.
     * @param messages The messages to log.
     */
    public joinedLog(...messages: [string, Logger.MessageConfiguration | undefined][]) {
        const mapped = messages.map(([content, configuration]) => {
            if (configuration !== undefined) {
                return this.ansiWrapped(content, configuration)
            }

            return content
        })

        this.log(mapped.join(""))
    }

    /**
     * Log an error message to the console in a predefined error style.
     * @param errorMessage The error message to log.
     */
    public error(content: string, properties?: Logger.ErrorProperties) {
        const errorConfiguration: Logger.MessageConfiguration = {
            color: [247, 79, 82],
        }

        if (properties !== undefined) {
            const errorCodeConfiguration: Logger.MessageConfiguration = {
                bold: true,
                color: [247, 79, 82],
            }

            const code = properties.code ? `[Error ${properties.code}]: ` : ""
            return this.joinedLog([`${code}`, errorCodeConfiguration], [content, errorConfiguration])
        }
        
        this.log(content, errorConfiguration)
    }

    // * Private

    /**
     * Wrap a message in ANSI escape codes.
     * @param content The content of the message.
     * @param configuration The configuration of the message.
     * @returns The ANSI wrapped message.
     * @private
     */
    private ansiWrapped(content: string, configuration: Logger.MessageConfiguration): string {
        if (!configuration.bold && !configuration.italic && !configuration.color) return content

        const bold = configuration.bold ? "1" : ""
        const italic = configuration.italic ? "3" : ""

        if (configuration.color) {
            const [red, green, blue] = configuration.color
            return `\x1b[${bold}${italic};38;2;${red};${green};${blue}m${content}\x1b[0m`
        }

        return `\x1b[${bold}${italic}${content}\x1b[0m`
    }
}

export module Logger {

    export type MessageColor = [red: number, green: number, blue: number]

    export type Message = string | MessageConfiguration

    export interface MessageConfiguration {

        /** The color of the text. */
        color?: MessageColor

        /** Whether the text should be bold. */
        bold?: boolean

        /** Whether the text should be italicized. */
        italic?: boolean
    }

    export type ErrorProperties = { code?: StatusCode }
}

export { StatusCode }
