import { Subprocess, spawn } from 'bun'

// # Interaction Manager

export default class ScreenManager {

    private process: Subprocess<'pipe', 'pipe', 'pipe'> | null

    // * Singleton

    private static instance: ScreenManager
    private constructor() {
        this.process = null
    }

    /** Shared instance of `ScreenManager`. */
    public static get shared(): ScreenManager {
        return this.instance || (this.instance = new this())
    }

    // * Method

    /**
     * Connect to a screen with the provided name.
     * @param screenName The name of the screen to connect to.
     */
    public async connect(screenName: string) {
        // create a new subprocess that connects to a provided screen name
        this.process = spawn(['screen', '-x', screenName], {
            stdin: 'pipe',
            stderr: 'pipe',
        })

        const res = await new Response(this.process.stderr).text()
        console.log(res)
    }

    /**
     * Disconnect from the active screen, if possible.
     * @throws If no screen is connected.
     */
    public disconnect() {
        if (this.process === null) return

        // kill the child process
        this.process.kill()
        this.process = null
    }

    /**
     * Run a command on the connected screen.
     * @throws If no screen is connected.
     * @param command The command to run.
     */
    public run(command: string) {
        // if there is no screen connected, throw an error
        if (this.process === null) {
            throw new Error('Screen is not connected.')
        }

        // write to the stdin
        this.process.stdin.write(command + '\r\n')
    }
}