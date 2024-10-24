import { CommandInteraction, Client } from "discord.js";
import { Command } from "../command";
import { doRole } from "../roles"

export const Start: Command = {
    name: "start",
    description: "Starts the game",
    run: async (_client: Client, interaction: CommandInteraction) => {
        doRole(_client, interaction, interaction.user.username, "undertaker")

        await interaction.followUp({
            ephemeral: true,
            content: "The game has started!"
        });
    }
};
