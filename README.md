# BOTC-ts
Blood on the Clocktower Discord bot made using TypeScript and Discord.js

## Installation
1. Create a Discord application
   1. Under **Installation** add the **bot** scope to guild install with **Administrator** permissions
   2. Under **Installation** Disable **User Install**
   3. Take note of the application's **Application ID** and the bot's **Token**
3. Clone the project using git
4. Use Yarn to install dependencies with `yarn install`
5. Create a .env file in the root directory and add `CLIENT_TOKEN=[BOT_TOKEN]`, replacing `[BOT_TOKEN]` with your bot's token
6. Add the bot to a server with the link `https://discord.com/oauth2/authorize?client_id=[APPLICATION_ID]`, replacing `[APPLICATION_ID]` with your application's ID
```
git clone https://github.com/WildRage1369/BOTC-ts/
cd BOTC-ts
yarn install
```

## Usage
Run the bot by running `yarn start` in the root directory
