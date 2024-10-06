import { CommandInteraction, Client } from "discord.js";
import { Command } from "../command";
import fs from 'fs';
import path from 'path';

export const Start: Command = {
    name: "start",
    description: "Starts the game",
    run: async (client: Client, interaction: CommandInteraction) => {
        const file: string = fs.readFileSync(path.resolve(__dirname, "./../example_game_state.json"), "utf-8");
        const json = JSON.parse(file)
        const content = json.storyteller;

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
};
