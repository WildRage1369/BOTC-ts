import { CommandInteraction, Client, EmbedBuilder } from "discord.js";
import { Command } from "../command";
import fs from 'fs';
import path from 'path';

export const ListRoles: Command = {
    name: "listroles",
    description: "Lists all roles in the script",
    run: async (_client: Client, interaction: CommandInteraction) => {

        const script = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../example_game_state.json"), "utf-8")).script;
        const script_json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../scripts/" + script + ".json"), "utf-8"));
        // var content = "";
        var embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Role Descriptions")
        for (const role of script_json) {
            const desc: string = await getRoleDescription(role.id);
            const role_name = role.id[0].toUpperCase() + role.id.slice(1);
            // content += "**" + role_name + ":** " + desc + "\n";
            embed.addFields({
                name: role_name,
                value: desc,
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
    ).then (res => {
        if (!res.ok) { throw new Error(`HTTP error ${res.status}`); }
        return res.json();
    }).then(json => {
        const rExp: RegExp = /\n.*?\n/
        ret = json.parse.wikitext["*"].match(rExp)[0].replace(/\n/, "")
    }).catch(error => {
        console.error("Error:", error);
    })
    if (ret == "") { console.error("RET IS EMPTY") }
    return ret
}
