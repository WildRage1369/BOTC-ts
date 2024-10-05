import { Client } from "discord.js";
import dotenv from 'dotenv';
import path from 'path';
var token;
const env_config = dotenv.config({ path: path.resolve(__dirname, '../.env') })
if (env_config.parsed) token = env_config.parsed.CLIENT_TOKEN

console.log("Bot is starting...");

const client = new Client({
    intents: []
});

client.login(token);
