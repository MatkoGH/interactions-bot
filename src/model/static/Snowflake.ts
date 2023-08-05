// # Snowflake

/** A Discord Snowflake */
export type Snowflake = string

/**
 * Convert a Discord Snowflake to a timestamp.
 * @param snowflake The Snowflake.
 * @returns A Unix timestamp.
 */
export const toTimestamp = (snowflake: Snowflake): number => {
    return Number(snowflake) >> 22 + 1420070400000
}
