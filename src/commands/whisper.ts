import { CommandInteraction, Client, ApplicationCommandOptionType, AutocompleteInteraction, ChannelType, PermissionFlagsBits } from "discord.js";
import { Command, err} from "../command";
import fs from 'fs';
import path from 'path';
const lockfile = require('proper-lockfile');

export const Whisper: Command = {
    name: "whisper",
    description: "Whisper a message to a player",
    options: [
        {
            name: "player",
            description: "The player to whisper",
            required: true,
            type: ApplicationCommandOptionType.String,
            autocomplete: true
        },
        {
            name: "message",
            description: "The message to send",
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    // TODO: fetch category id
    run: async (client: Client, interaction: CommandInteraction) => {
        // fetch all information required and parse it
        var user = interaction.options.data[0].value?.toString()!
        const user_id = client.users.cache.find(u => u.tag === user)?.id!
        user = user?.replaceAll(".", "")
        const everyone_id: string = interaction.guild?.roles.everyone.id!
        if (!user || !user_id || !everyone_id) { err(interaction, "User not found"); return; }

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
            if (!channel) { err(interaction, "Channel creation failed"); return;}
        }
        var content = interaction.options.data[1].value?.toString()
        await channel.send({
            content
        });
        interaction.followUp({
            ephemeral: true,
            content: "Message sent!"
        })
    },
    autocomplete: async (_client: Client, interaction: AutocompleteInteraction) => {
        const state = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../game_state.json"), "utf-8"));
        var choices: any[] = []
        for (const player of state.players) {
            choices = [
                ...choices,
                { name: player.name, value: player.username }
            ]
        }

        var focusedValue = interaction.options.getFocused();
        const filtered = choices.filter(role => role.name.toLowerCase().startsWith(focusedValue))
        await interaction.respond(
            filtered.map(role => ({ name: role.name, value: role.value }))
        )
    }

};

