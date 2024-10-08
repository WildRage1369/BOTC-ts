import { CommandInteraction, Client } from "discord.js";
import { Command } from "../command";
import fs from 'fs';
import path from 'path';

export const NewGame: Command = {
    name: "newgame",
    description: "Set up a new game",
    run: async (client: Client, interaction: CommandInteraction) => {
        const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../game_state.json"), "utf-8"));
        json.players = [];
        json.nominations = [];
        json.isDaytime = true;
        fs.writeFile(path.resolve(__dirname, "./../game_state.json"), JSON.stringify(json), (err) => {
            console.error(err);
        })
        // await interaction.followUp({
        //     ephemeral: true,
        //     content
        // });
    }
};
