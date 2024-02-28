import { Snowflake } from "./Snowflake"

// # Endpoints

export class Endpoint {

    /** The version of the Discord API to use. */
    public readonly version: Endpoint.Version

    /** The current URL path. */
    private currentPath: string = ""

    // * Computed

    /** The base URL pointing to Discord's API. */
    public get baseURL() {
        return new URL(`https://discord.com/api/${this.version}/`) as URL
    }

    /** The full URL of the endpoint. */
    public get url() {
        const path = this.currentPath.startsWith("/") 
            ? this.currentPath.slice(1) 
            : this.currentPath

        return new URL(path, this.baseURL) as URL
    }

    // * Initializer

    private constructor(configuration: Endpoint.Configuration = defaults) {
        this.version = configuration.version
    }

    /** The latest version of the endpoint. */
    public static get latest(): Endpoint.Latest {
        return new Endpoint()
    }

    // * Paths

    /**
     * .../__applications__/__{applicationId}__
     * @param applicationId The identifier of an application.
     */
    public application(applicationId: Snowflake): Endpoint.Application {
        this.currentPath += `/applications/${applicationId}`
        return this
    }

    /**
     * ../__interactions__/__{interactionId}__/__{interactionToken}__
     * @param interactionId The identifier of an interaction.
     * @param interactionToken The token of an interaction.
     */
    public interaction(interactionId: Snowflake, interactionToken: string): Endpoint.Interaction {
        this.currentPath += `/interactions/${interactionId}/${interactionToken}`
        return this
    }

    /**
     * .../__webhooks__/__{applicationId}__/__{interactionToken}__
     * - `POST`: Create a followup message for an interaction.
     * @param applicationId The identifier of an application.
     * @param interactionToken The token of an interaction.
     */
    public webhook(applicationId: Snowflake, interactionToken: string): Endpoint.Webhook {
        this.currentPath += `/webhooks/${applicationId}/${interactionToken}`
        return this
    }

    // /applications/{applicationId}

    /**
     * .../applications/{applicationId}/__guilds__/__{guildId}__
     * - _No request methods._
     */
    public guild(id: Snowflake): Endpoint.Guild {
        this.currentPath += `/guilds/${id}`
        return this
    }

    // /applications/{applicationId}
    // /applications/{applicationId}/guilds/{guildId}

    /** 
     * .../applications/{applicationId}/__commands__
     * - `GET`: Fetch all of the global/guild commands.
     * - `POST`: Create a new global/guild command.
     * - `PUT`: Bulk overwrite all global/guild commands.
     */
    public get commands(): Endpoint.Commands {
        this.currentPath += "/commands"
        return this
    }

    /** 
     * .../applications/{applicationId}/__commands__/__{commandId}__
     * - `GET`: Fetch a global/guild command.
     * - `PATCH`: Edit a global/guild command.
     * - `DELETE`: Delete a global/guild command.
     * @param id The identifier of a command.
    */
    public command(id: Snowflake): Endpoint.Command {
        this.currentPath += `/commands/${id}`
        return this
    }

    // /applications/{applicationId}/commands
    // /applications/{applicationId}/commands/{commandId}

    /**
     * .../applications/{applicationId}/commands/__permissions__
     * - `GET`: Fetches permissions for all commands.
     * - `PUT`: Batch edit permissions for all commands.
     */
    public get permissions(): Endpoint.Base {
        this.currentPath += "/permissions"
        return this
    }

    // /interactions/{interactionId}/{interactionToken}

    /**
     * .../interactions/{interactionId}/{interactionToken}/__callback__
     * - `POST`: Create a response to an interaction.
     */
    public get callback(): Endpoint.Base {
        this.currentPath += "/callback"
        return this
    }

    // /webhooks/{applicationId}/{interactionToken}

    /**
     * .../webhooks/{applicationId}/{interactionToken}/__messages__
     * _No request methods._
     */
    public get messages(): Endpoint.Messages {
        this.currentPath += "/messages"
        return this
    }

    // /webhooks/{applicationId}/{interactionToken}/messages

    /**
     * .../webhooks/{applicationId}/{interactionToken}/messages/__@original__
     * - `GET`: Fetch the original message that was responded to by the interaction.
     * - `PATCH`: Edit the original message that was responded to by the interaction.
     * - `DELETE`: Delete the original message that was responded to by the interaction.
     */
    public get original(): Endpoint.Base {
        this.currentPath += "/@original"
        return this
    }

    /**
     * .../webhooks/{applicationId}/{interactionToken}/messages/__{messageId}__
     * - `GET`: Fetch a message that was created by the interaction.
     * - `PATCH`: Edit a message that was created by the interaction.
     * - `DELETE`: Delete a message that was created by the interaction.
     * @param id The identifier of a message.
     */
    public message(id: Snowflake): Endpoint.Base {
        this.currentPath += `/messages/${id}`
        return this
    }
}

const defaults: Endpoint.Configuration = {
    version: "v10",
}

export module Endpoint {

    // * Configuration

    export interface Configuration {
        version: Version
    }

    // * Version

    export type Version = "v6" | "v8" | "v9" | "v10"

    // * Picks

    export type Base = Pick<Endpoint, "version" | "url">
    export type Latest = Base & Pick<Endpoint, "application" | "interaction" | "webhook">

    // /applications/{applicationId}

    export type Application = Base & Pick<Endpoint, "command" | "commands" | "guild">

    // /applications/{applicationId}/guilds/{guildId}

    export type Guild = Base & Pick<Endpoint, "command" | "commands">

    // /applications/{applicationId}/commands
    // /applications/{applicationId}/commands/{commandId}
    // /applications/{applicationId}/guilds/{guildId}/commands
    // /applications/{applicationId}/guilds/{guildId}/commands/{commandId}

    export type Commands = Base & Pick<Endpoint, "permissions">
    export type Command = Commands

    // /interactions/{interactionId}/{interactionToken}

    export type Interaction = Base & Pick<Endpoint, "callback">

    // /webhooks/{applicationId}/{interactionToken}

    export type Webhook = Base & Pick<Endpoint, "messages">

    // /webhooks/{applicationId}/{interactionToken}/messages

    export type Messages = Base & Pick<Endpoint, "original" | "message">
}

export default Endpoint
