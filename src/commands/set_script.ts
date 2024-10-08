import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../command";
import fs from 'fs';
import path from 'path';
import interactionCreate from "./../listeners/interactionCreate";

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
        const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../game_state.json"), "utf-8"));
        var content = "Script set to"
        if (interaction.options.data[0].value == "new") {
            json.script = interaction.options.data[1].attachment?.name;
            const new_script = await interaction.options.data[1].attachment?.toJSON();
            fs.writeFile(path.resolve(__dirname, "./../scripts/" + json.script), JSON.stringify(new_script), (err) => {
                console.error(err);
            })
            content += " new script " + interaction.options.data[1].attachment?.name
        } else {
            json.script = interaction.options.data[0].value;
            fs.writeFile(path.resolve(__dirname, "./../game_state.json"), JSON.stringify(json), (err) => {
                console.error(err);
            })
            content += " " + interaction.options.data[0].value
        }

        interactionCreate(client);

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
};

function getScripts(cmd?: Command): any[] {
    const files = fs.readdirSync(path.resolve(__dirname, "./../scripts/"));
    var choices: any[] = [
        {name: "New script", value: "new"}
    ]
    for (const file of files) {
        file.replaceAll("_", " ").replaceAll(".json", "");
        choices = [...choices, {name: file, value: file}]
    }
    if (cmd) { cmd.options = [
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
