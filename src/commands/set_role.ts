import { CommandInteraction, Client, ApplicationCommandOptionType, AutocompleteInteraction } from "discord.js";
import { Command } from "../command";
import fs from 'fs';
import path from 'path';
const lockfile = require('proper-lockfile');

export const SetRole: Command = {
    name: "setrole",
    description: "Sets a player's role",
    options: [
        {
            name: "player",
            description: "The player to set the role of",
            required: true,
            type: ApplicationCommandOptionType.String,
            autocomplete: true
        },
        {
            name: "role",
            description: "Which role to set",
            required: true,
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
        }
    ],
    run: async (_client: Client, interaction: CommandInteraction) => {
        lockfile.lock(path.resolve(__dirname, "./../game_state.json"))
            .then(async (release: Function) => {
                const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../game_state.json"), "utf-8"));
                var player: any = interaction.options.data[0].value?.toString()
                player = player ? player : interaction.user.username;
                player = json.players.find((p: any) => {return p.username == player});
                player.role = interaction.options.data[1].value;
                fs.writeFile(path.resolve(__dirname, "./../game_state.json"), JSON.stringify(json), (err) => { if (err) throw err; })

                await interaction.followUp({
                    ephemeral: true,
                    content: "Set " + player.name + "'s" + " role to " + interaction.options.data[1].value
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
        const argument = interaction.options.getFocused(true).name;
        var choices: any[] = []
        if (argument == "player") {
            for (const player of state.players) {
                choices = [
                    ...choices,
                    { name: player.name, value: player.username }
                ]
            }
        } else {
            const script_json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../scripts/" + state.script), "utf-8"));
            for (const [index, role] of script_json.entries()) {
                if (index == 25) { break; }
                const role_name = role.id[0].toUpperCase() + role.id.slice(1);
                choices = [
                    ...choices,
                    { name: role_name, value: role.id }
                ]
            }
        }

        var focusedValue = interaction.options.getFocused();
        const filtered = choices.filter(role => role.name.toLowerCase().startsWith(focusedValue))
        await interaction.respond(
            filtered.map(role => ({ name: role.name, value: role.value }))
        )
    }
};
