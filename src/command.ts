import { ChannelType, PermissionFlagsBits, CommandInteraction, ChatInputApplicationCommandData, AutocompleteInteraction, Client } from "discord.js";

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

export async function Whisper(client: Client, interaction: CommandInteraction, user: string, content: string) {
            // fetch all information required and parse it
        const user_id = client.users.cache.find(u => u.tag === user)?.id!
        user = user?.replaceAll(".", "")
        const everyone_id: string = interaction.guild?.roles.everyone.id!
        if (!user || !user_id || !everyone_id) { Err(interaction, "User not found"); return; }

        // fetch channel or create channel if it doesn't exist
        var channel = await interaction.guild?.channels.cache.find(c => c.name === user)?.fetch()
        if (!channel || channel.type !== ChannelType.GuildText) {
            channel = await interaction.guild?.channels.create({
                parent: "1296906137148456990", // the dm category id, hardcoded for now
                name: user,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: user_id,
                        allow: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: everyone_id,
                        deny: [PermissionFlagsBits.ViewChannel]
                    }
                ]
            })
            if (!channel) { Err(interaction, "Channel creation failed"); return;}
        }
        await channel.send({
            content
        });

}

export async function Err(interaction: CommandInteraction, error: string) {
            await interaction.followUp({
                ephemeral: true,
                content: "Error: Command failed to run. Please try again. See log for information"
            });
            throw Error(error) 
}
