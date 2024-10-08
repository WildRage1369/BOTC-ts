import { CommandInteraction, Client } from "discord.js";
import { Command } from "../command";
import fs from 'fs';
import path from 'path';
const lockfile = require('proper-lockfile');

export const Leave: Command = {
    name: "leave",
    description: "Leave the game",
    run: async (_client: Client, interaction: CommandInteraction) => {
        lockfile.lock(path.resolve(__dirname, "./../game_state.json"))
            .then((release: Function) => {
                const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../game_state.json"), "utf-8"));
                var new_players: any[] = [];
                for (const player of json.players) {
                    if (player.username == interaction.user.username) { continue; }
                    new_players = [...new_players, player];
                }
                json.players = new_players;
                fs.writeFile(path.resolve(__dirname, "./../game_state.json"), JSON.stringify(json), (err) => {
                    if (err) throw err;
                })
                interaction.followUp({
                    ephemeral: true,
                    content: "Goodbye " + interaction.user.username + "!"
                });
                return release();
            }).catch((err: Error) => {
                interaction.followUp({
                    ephemeral: true,
                    content: "Error: Command failed to run. Please try again."
                });
                throw err;
            });
    }
};
