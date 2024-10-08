import { CommandInteraction, Client, ApplicationCommandOptionType, AutocompleteInteraction } from "discord.js";
import { Command } from "../command";
import fs from 'fs';
import path from 'path';
const lockfile = require('proper-lockfile');

export const SetScript: Command = {
    name: "setscript",
    description: "Sets the script to a pre-existing script or a new script",
    options: [
        {
            name: "script",
            description: "The script to set to",
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "newscript",
            description: "The new script",
            required: false,
            type: ApplicationCommandOptionType.Attachment
        }
    ],
    run: async (_client: Client, interaction: CommandInteraction) => {
        var content = "Error: Failed to run command"
        lockfile.lock(path.resolve(__dirname, "./../game_state.json"))
        .then(async (release: Function) => {
            const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../game_state.json"), "utf-8"));
            content = "Script set to"
            if (interaction.options.data[0].value == "new") {
                if (!interaction.options.data[1].attachment) {
                    await interaction.followUp({
                        ephemeral: true,
                        content: "Error: No JSON file provided, please try again"
                    });
                    return;
                }
                json.script = interaction.options.data[1].attachment?.name;

                const url = interaction.options.data[1].attachment?.url;
                const new_script = await getAttachment(url ? url : "");

                fs.writeFile(path.resolve(__dirname, "./../scripts/" + json.script), JSON.stringify(new_script), (err) => { if (err) throw err; })

                content += " new script: " + interaction.options.data[1].attachment?.name.replaceAll("_", " ").replaceAll(".json", "");
            } else {
                json.script = interaction.options.data[0].value;
                content += " " + json.script.replaceAll("_", " ").replaceAll(".json", "")
            }
            fs.writeFile(path.resolve(__dirname, "./../game_state.json"), JSON.stringify(json), (err) => {
                if (err) throw err;
            })

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

    },
    autocomplete: async (client: Client, interaction: AutocompleteInteraction) => {
        const files = fs.readdirSync(path.resolve(__dirname, "./../scripts/"));
        var choices: any[] = [
            { name: "New script", value: "new" }
        ]
        for (const file of files) {
            const name = file.replaceAll("_", " ").replaceAll(".json", "");
            choices = [...choices, { name: name, value: file }]
        }

        var focusedValue = interaction.options.getFocused();
        const filtered = choices.filter(choice => choice.name.toLowerCase().startsWith(focusedValue))
        await interaction.respond(
            filtered.map(choice => ({ name: choice.name, value: choice.value }))
        )
    }
};

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
