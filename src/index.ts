import { Client, GatewayIntentBits } from "discord.js";
import dotenv from 'dotenv';
import path from 'path';

import interactionCreate from "./listeners/interactionCreate";
import ready from "./listeners/ready";

var token;
const env_config = dotenv.config({ path: path.resolve(__dirname, '../.env') })
if (env_config.parsed) token = env_config.parsed.CLIENT_TOKEN

    console.log("Bot is starting...");
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildModeration,
        ]
    });

    ready(client);
    interactionCreate(client);

    client.login(token);
