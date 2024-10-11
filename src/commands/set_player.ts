import { CommandInteraction, Client, ApplicationCommandOptionType, AutocompleteInteraction } from "discord.js";
import { Command } from "../command";
import fs from 'fs';
import path from 'path';
const lockfile = require('proper-lockfile');

export const SetPlayer: Command = {
    name: "setplayer",
    description: "Sets a player's state",
    options: [
        {
            name: "player",
            description: "The player to set the role of",
            required: true,
            type: ApplicationCommandOptionType.String,
            autocomplete: true
        },
        {
            name: "option",
            description: "Which state to change",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: "Dead", value: "isDead" },
                { name: "Drunk", value: "isDrunk" },
                { name: "Poisoned", value: "isPoisoned" },
                { name: "Voteless", value: "isVoteless" },
            ]
        },
        {
            name: "state",
            description: "The state to set",
            required: true,
            type: ApplicationCommandOptionType.Boolean,
        }
    ],
    run: async (_client: Client, interaction: CommandInteraction) => {
        lockfile.lock(path.resolve(__dirname, "./../game_state.json"))
            .then(async (release: Function) => {
                const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../game_state.json"), "utf-8"));

                var player: any = interaction.options.data[0].value?.toString()
                player = player ? player : interaction.user.username; // If no player is specified, use the user's username

                // find and set the player's role and alignment
                player = json.players.find((p: any) => {return p.username == player});
                var option: any = interaction.options.data[1].value
                option = option ? option : interaction.options.data[1].value; // trick to avoid undefined error
                player[option] = interaction.options.data[2].value;


                fs.writeFile(path.resolve(__dirname, "./../game_state.json"), JSON.stringify(json), (err) => { if (err) throw err; })

                const bool = interaction.options.data[2].value
                await interaction.followUp({
                    ephemeral: true,
                    content: "Set " + player.name + " to " + (bool ? " " : "not ") + option.substring(2)
                });
                return release();
            }).catch(async (err: Error) => {
                await interaction.followUp({
                    ephemeral: true,
                    content: "Error: Command failed to run. Please try again."
                });
                throw err;
            });
    },
    autocomplete: async (_client: Client, interaction: AutocompleteInteraction) => {
        const state = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../game_state.json"), "utf-8"));
        var choices: any[] = []
        for (const player of state.players) {
            choices = [
                ...choices,
                { name: player.name, value: player.username }
            ]
        }

        var focusedValue = interaction.options.getFocused();
        const filtered = choices.filter(role => role.name.toLowerCase().startsWith(focusedValue))
        await interaction.respond(
            filtered.map(role => ({ name: role.name, value: role.value }))
        )
    }
};
