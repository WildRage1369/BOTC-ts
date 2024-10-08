import { CommandInteraction, Client, ApplicationCommandOptionType, AutocompleteInteraction } from "discord.js";
import { Command } from "../command";
import fs from 'fs';
import path from 'path';


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
        await interaction.followUp({
            ephemeral: true,
            content: "Set " + interaction.options.data[0].value + "'s" + " role to " + interaction.options.data[1].value
        });
        // await client.application?.commands.set(Commands);
    },
    autocomplete: async (_client: Client, interaction: AutocompleteInteraction) => {

        const script = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../game_state.json"), "utf-8")).script;
        const script_json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../scripts/" + script), "utf-8"));

        var roles: any[] = []
        for (const [index, role] of script_json.entries()) {
            if (index == 25) { break; }
            const role_name = role.id[0].toUpperCase() + role.id.slice(1);
            roles = [
                ...roles,
                { name: role_name, value: role.id }
            ]
        }
		var focusedValue = interaction.options.getFocused();
        const filtered = roles.filter(role => role.name.toLowerCase().startsWith(focusedValue))
        await interaction.respond(
            filtered.map(role => ({ name: role.name, value: role.value }))
        )
    }
};
