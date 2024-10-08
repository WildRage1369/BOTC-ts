import { CommandInteraction, Client } from "discord.js";
import { Command } from "../command";
import fs from 'fs';
import path from 'path';

export const Start: Command = {
    name: "start",
    description: "Starts the game",
    run: async (_client: Client, interaction: CommandInteraction) => {
        const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../game_state.json"), "utf-8"));
        const content = json.storyteller;

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
};
