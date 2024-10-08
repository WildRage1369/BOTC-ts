import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../command";
import { Commands } from "../commands"
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
            .then(async (release: Function) => {
                const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../game_state.json"), "utf-8"));
                content = "Script set to"
                if (interaction.options.data[0].value == "new") {
                    json.script = interaction.options.data[1].attachment?.name;
                    const url = interaction.options.data[1].attachment?.url ;
                    const new_script = await getAttachment(url ? url : "");
                    fs.writeFile(path.resolve(__dirname, "./../scripts/" + json.script), JSON.stringify(new_script), (err) => {
                        if (err) throw err;
                    })
                    content += " new script " + interaction.options.data[1].attachment?.name
                } else {
                    json.script = interaction.options.data[0].value;
                    fs.writeFile(path.resolve(__dirname, "./../game_state.json"), JSON.stringify(json), (err) => {
                        if (err) throw err;
                    })

                    content += " " + json.script.replaceAll("_", " ").replaceAll(".json", "")
                }

                await interaction.followUp({
                    ephemeral: true,
                    content: content
                });
                return release();
            }).catch(async (err: Error) => {
                await interaction.followUp({
                    ephemeral: true,
                    content: "Error: Command failed to run. Please try again."
                });
                throw err;
            });

        await client.application?.commands.set(Commands);
    }
};

function getScripts(cmd?: Command): any[] {
    const files = fs.readdirSync(path.resolve(__dirname, "./../scripts/"));
    var choices: any[] = [
        { name: "New script", value: "new" }
    ]
    for (const file of files) {
        const name = file.replaceAll("_", " ").replaceAll(".json", "");
        choices = [...choices, { name: name, value: file }]
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

async function getAttachment(url: string): Promise<string> {
    var ret = ""
    await fetch(
        url,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            }
        }
    ).then(res => {
        if (!res.ok) { throw new Error(`HTTP error ${res.status}`); }
        return res.json();
    }).then(json => {
        ret = json
    }).catch(error => {
        console.error("Error:", error);
    })
    return ret;
}
