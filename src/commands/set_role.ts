import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../command";
import fs from 'fs';
import path from 'path';

const script = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../game_state.json"), "utf-8")).script;
const script_json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../scripts/" + script + ".json"), "utf-8"));

var roles: any[] = []
for (const role of script_json) {
    const role_name = role.id[0].toUpperCase() + role.id.slice(1);
    roles = [
        ...roles,
        { name: role_name, value: role.id }
    ]
}

export const SetRole: Command = {
    name: "setrole",
    description: "Sets a player's role",
    options: [
        {
            name: "player",
            description: "The player to set the role of",
            required: true,
            type: ApplicationCommandOptionType.User
        },
        {
            name: "role",
            description: "Which role to set",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: roles
        }
    ],
    run: async (_client: Client, interaction: CommandInteraction) => {
        await interaction.followUp({
            ephemeral: true,
            content: "Set " + interaction.options.data[0].value + "'s" + " role to " + interaction.options.data[1].value
        });
    }
};
