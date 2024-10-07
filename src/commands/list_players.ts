import { CommandInteraction, Client } from "discord.js";
import { Command } from "../command";
import fs from 'fs';
import path from 'path';

export const ListPlayers: Command = {
    name: "listplayers",
    description: "Lists all players",
    run: async (client: Client, interaction: CommandInteraction) => {

        const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../example_game_state.json"), "utf-8"));

        var content = "";
        for (const player of json.players) {
            content += `\n${player.name}: ${player.username} (${player.pronouns})`;
            if (player.isDead) {
                content += " [dead]";
            }
        }

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
};
