/**
 * Converts different types to Uint8Array.
 * @param value - Value to convert. Strings are parsed as hex.
 * @param format - Format of value. Valid options: 'hex'. Defaults to utf-8.
 * @returns Value in Uint8Array form.
 */
export function valueToUint8Array(value: Uint8Array | ArrayBuffer | Buffer | string, format?: string): Uint8Array {
    if (value == null) {
        return new Uint8Array()
    }

    if (typeof value === 'string') {
        if (format === 'hex') {
            const matches = value.match(/.{1,2}/g)

            if (matches == null) {
            throw new Error('Value is not a valid hex string')
            }

            const hexVal = matches.map((byte: string) => parseInt(byte, 16))
            return new Uint8Array(hexVal)
        } else {
            return new TextEncoder().encode(value)
        }
    }

    try {
        if (Buffer.isBuffer(value)) {
            return new Uint8Array(value)
        }
    } catch (ex) {
        // Runtime doesn't have Buffer
    }

    if (value instanceof ArrayBuffer) {
        return new Uint8Array(value)
    }

    if (value instanceof Uint8Array) {
        return value
    }

    throw new Error('Unrecognized value type, must be one of: string, Buffer, ArrayBuffer, Uint8Array')
}
  
/**
 * Merge multiple arrays.
 * @param arrays - The arrays to concatenate arrays
 * @returns Concatenated arrays
 */
export function concatUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
    const length = arrays.reduce((previous, current) => previous + current.length, 0)
    if (arrays.length === 0) return new Uint8Array() 
    
    const firstArr = arrays.shift()!
    const merged = new Uint8Array(length)
    merged.set(firstArr)
    
    let offset = firstArr.length
    for (const arr of arrays) {
        merged.set(arr, offset)
        offset += arr.length
    }

    return merged
}
