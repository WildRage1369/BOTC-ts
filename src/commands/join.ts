import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../command";
import fs from 'fs';
import path from 'path';
const lockfile = require('proper-lockfile');

export const Join: Command = {
    name: "join",
    description: "Join the game",
    options: [
        {
            name: "name",
            description: "Your name",
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "pronouns",
            description: "Your pronouns",
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    run: async (_client: Client, interaction: CommandInteraction) => {
        lockfile.lock(path.resolve(__dirname, "./../game_state.json"))
            .then((release: Function) => {
                const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../game_state.json"), "utf-8"));
                json.players = [ ...json.players,
                    {
                        "name": interaction.options.data[0].value,
                        "username": interaction.user.username,
                        "role": "",
                        "alignment": "",
                        "isVoteless": false,
                        "isDead": false,
                        "isDrunk": false,
                        "isPoisoned": false,
                        "pronouns": interaction.options.data[1].value,
                        "location": json.players.length
                    }
                ];
                fs.writeFile(path.resolve(__dirname, "./../game_state.json"), JSON.stringify(json), (err) => {
                    if (err) throw err;
                })
                return release();
            }).catch((err: Error) => {
                interaction.followUp({
                    ephemeral: true,
                    content: "Error: Command failed to run. Please try again."
                });
                throw err;
            });
        await interaction.followUp({
            ephemeral: true,
            content: "Welcome to the game " + interaction.options.data[0].value + "!"
        });
    }
};
