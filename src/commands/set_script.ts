import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../command";
import fs from 'fs';
import path from 'path';
import interactionCreate from "./../listeners/interactionCreate";
const lockfile = require('proper-lockfile');

const choices = getScripts();

export const SetScript: Command = {
    name: "setscript",
    description: "Sets the script to a pre-existing script or a new script",
    options: [
        {
            name: "script",
            description: "The script to set to",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices
        },
        {
            name: "newscript",
            description: "The new script",
            required: false,
            type: ApplicationCommandOptionType.Attachment
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        var content = "Error: Failed to run command"
        lockfile.lock(path.resolve(__dirname, "./../game_state.json"))
            .then((release: Function) => {
                const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../game_state.json"), "utf-8"));
                content = "Script set to"
                if (interaction.options.data[0].value == "new") {
                    json.script = interaction.options.data[1].attachment?.name;
                    const new_script = interaction.options.data[1].attachment?.toJSON();
                    fs.writeFile(path.resolve(__dirname, "./../scripts/" + json.script), JSON.stringify(new_script), (err) => {
                        if (err) throw err;
                    })
                    content += " new script " + interaction.options.data[1].attachment?.name
                } else {
                    json.script = interaction.options.data[0].value;
                    fs.writeFile(path.resolve(__dirname, "./../game_state.json"), JSON.stringify(json), (err) => {
                        if (err) throw err;
                    })
                    content += " " + interaction.options.data[0].value
                }

                interactionCreate(client);
                interaction.followUp({
                    ephemeral: true,
                    content: content
                });
                return release();
            }).catch((err: Error) => {
                interaction.followUp({
                    ephemeral: true,
                    content: "Error: Command failed to run. Please try again."
                });
                throw err;
            });
        console.log(content)
    }
};

function getScripts(cmd?: Command): any[] {
    const files = fs.readdirSync(path.resolve(__dirname, "./../scripts/"));
    var choices: any[] = [
        { name: "New script", value: "new" }
    ]
    for (const file of files) {
        // file.replaceAll("_", " ").replaceAll(".json", "");
        choices = [...choices, { name: file, value: file }]
    }
    if (cmd) {
        cmd.options = [
            {
                name: "script",
                description: "The script to set to",
                required: true,
                type: ApplicationCommandOptionType.String,
                choices
            },
            {
                name: "newscript",
                description: "The new script",
                required: false,
                type: ApplicationCommandOptionType.Attachment
            }
        ]
    }
    return choices;

}
