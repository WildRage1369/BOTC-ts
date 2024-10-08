import { CommandInteraction, Client, EmbedBuilder, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../command";
import fs from 'fs';
import path from 'path';

export const ListRoles: Command = {
    name: "listroles",
    description: "Lists all roles in the script",
    options: [{
        name: "roletype",
        description: "Which role type to view (Optional)",
        required: false,
        type: ApplicationCommandOptionType.String,
        choices: [
            { name: "Townsfolk", value: "Townsfolk" },
            { name: "Outsider", value: "Outsider" },
            { name: "Minion", value: "Minion" },
            { name: "Demon", value: "Demon" },
            { name: "Traveller", value: "Traveller" },
            { name: "Fabled", value: "Fabled" },
        ]
    }],
    run: async (_client: Client, interaction: CommandInteraction) => {

        const script = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../game_state.json"), "utf-8")).script;
        const script_json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../scripts/" + script), "utf-8"));
        var embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Role Descriptions")

        for (const role of script_json) {
            const role_type: string = await getRoleType(role.id)
            if (interaction.options.data[0]?.value && role_type != interaction.options.data[0].value) { continue; }

            const desc: string = await getRoleDescription(role.id);
            const role_name = role.id[0].toUpperCase() + role.id.slice(1);

            var name: string = role_name
            if (interaction.options.data[0]?.value){
                embed.setTitle(role_type + " Description(s)")
            } else {
                name += " (" + role_type + ")"
            }
            embed.addFields({
                name: name,
                value: desc + "\n\u200B",
            })
        }

        await interaction.followUp({
            ephemeral: true,
            embeds: [embed],
        });
    }
};

async function getRoleDescription(role: string): Promise<string> {
    var ret: string = ""
    await fetch(
        "https://wiki.bloodontheclocktower.com/api.php?action=parse&format=json&page=" + role + "&prop=wikitext&section=1&disablelimitreport=1&disableeditsection=1&disabletoc=1",
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
        const rExp: RegExp = /\n.*?\n/
        ret = json.parse.wikitext["*"].match(rExp)[0].replace(/\n"/, "").replace(/"\n/, "")
    }).catch(error => {
        console.error("Error:", error);
    })
    if (ret == "") { console.error("RET IS EMPTY") }
    return ret
}

async function getRoleType(role: string): Promise<string> {
    var role_type: string = ""
    await fetch(
        "https://wiki.bloodontheclocktower.com/api.php?action=parse&format=json&page=" + role + "&prop=headhtml&disablelimitreport=1&disableeditsection=1&disabletoc=1",
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
        if (/Townsfolk/.test(json.parse.headhtml["*"])) { role_type = "Townsfolk" }
        else if (/Outsider/.test(json.parse.headhtml["*"])) { role_type = "Outsider" }
        else if (/Minion/.test(json.parse.headhtml["*"])) { role_type = "Minion" }
        else if (/Demon/.test(json.parse.headhtml["*"])) { role_type = "Demon" }
        else if (/Traveller/.test(json.parse.headhtml["*"])) { role_type = "Traveller" }
        else if (/Fabled/.test(json.parse.headhtml["*"])) { role_type = "Fabled" }
    }).catch(error => {
        console.error("Error:", error);
    })
    if (role_type == "") { console.error("RET IS EMPTY") }
    return role_type
}
