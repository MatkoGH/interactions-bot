# Discord Interactions Bot
A Discord bot base framework that supports interactions.

## Installation

### Step 1.
Run ```git clone https://github.com/MatkoGH/interactions-bot``` in the command line, then use ```cd interactions-bot``` to navigate to the bot directory.

### Step 2.
Run ```bun install``` to install dependencies.

### Step 3.
Use ```cp .env.example .env && rm .env.example``` to create a new `.env` environment variables file. Navigate to [your applications](https://discord.com/developers/applications) in the [Discord Developer Portal](https://discord.com/developers/docs) and copy the application's ID, public key, and bot token into the new `.env` file.

### Step 4.
Use ```bun start``` to run the bot and start the HTTP interactions server!
- You can customize the port and path in the `index.ts` file.
