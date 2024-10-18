import { CommandInteraction, Client, ApplicationCommandOptionType, AutocompleteInteraction } from "discord.js";
import { Command, Whisper} from "../command";
import fs from 'fs';
import path from 'path';
const lockfile = require('proper-lockfile');

export const WhisperCommand: Command = {
    name: "whisper",
    description: "Whisper a message to a player",
    options: [
        {
            name: "player",
            description: "The player to whisper",
            required: true,
            type: ApplicationCommandOptionType.String,
            autocomplete: true
        },
        {
            name: "message",
            description: "The message to send",
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    // TODO: fetch category id
    run: async (client: Client, interaction: CommandInteraction) => {
        Whisper(client, interaction, interaction.options?.data[0].value?.toString()!, interaction.options.data[1].value?.toString()!)
        interaction.followUp({
            ephemeral: true,
            content: "Message sent!"
        })
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

