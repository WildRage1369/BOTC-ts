import { CommandInteraction, ChatInputApplicationCommandData, AutocompleteInteraction, Client } from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: CommandInteraction) => void;
    autocomplete?: (client: Client, interaction: AutocompleteInteraction) => void;
}

export async function getRoleType(role: string): Promise<string> {
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


export async function err(interaction: CommandInteraction, error: string) {
            await interaction.followUp({
                ephemeral: true,
                content: "Error: Command failed to run. Please try again. See log for information"
            });
            throw Error(error) 
}
