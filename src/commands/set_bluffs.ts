import { CommandInteraction, Client, ApplicationCommandOptionType, AutocompleteInteraction } from "discord.js";
import { Command, getRoleType } from "../command";
import fs from 'fs';
import path from 'path';
const lockfile = require('proper-lockfile');

export const SetBluffs: Command = {
    name: "setbluffs",
    description: "Sets the game's bluffs",
    options: [
        {
            name: "bluff1",
            description: "The first bluff",
            required: true,
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
        },
        {
            name: "bluff2",
            description: "The second bluff",
            required: true,
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
        },
        {
            name: "bluff3",
            description: "The third bluff",
            required: true,
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
        }
    ],
    run: async (_client: Client, interaction: CommandInteraction) => {
        lockfile.lock(path.resolve(__dirname, "./../game_state.json"))
        .then(async (release: Function) => {
            const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../game_state.json"), "utf-8"));

            json.bluffs = [
                ... json.bluffs,
                [
                    interaction.options.data[0].value?.toString(),
                    interaction.options.data[1].value?.toString(),
                    interaction.options.data[2].value?.toString(),
                ]
            ]

            fs.writeFile(path.resolve(__dirname, "./../game_state.json"), JSON.stringify(json), (err) => { if (err) throw err; })

            await interaction.followUp({
                ephemeral: true,
                content: "Set bluffs to " + json.bluffs[json.bluffs.length-1].join(", ")
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
        const script_json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../scripts/" + state.script), "utf-8"));
        for (const [index, role] of script_json.entries()) {
            if (index == 25) { break; }
            const role_name = role.id[0].toUpperCase() + role.id.slice(1);
            choices = [
                ...choices,
                { name: role_name, value: role.id }
            ]
        }

        var focusedValue = interaction.options.getFocused();
        const filtered = choices.filter(role => role.name.toLowerCase().startsWith(focusedValue))
        await interaction.respond(
            filtered.map(role => ({ name: role.name, value: role.value }))
        )
    }
};
