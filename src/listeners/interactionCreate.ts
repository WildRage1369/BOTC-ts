import { CommandInteraction, Client, Interaction, AutocompleteInteraction } from "discord.js";
import { Commands } from "../commands";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenuCommand() || interaction.isAutocomplete()){
            if (interaction.isAutocomplete()) {
                await handleAutocomplete(client, interaction);
            } else {
                await handleSlashCommand(client, interaction);
            }
        }
    });
};

const handleSlashCommand = async (client: Client, interaction: CommandInteraction): Promise<void> => {
    const slashCommand = Commands.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        interaction.followUp({ content: "An error has occurred" });
        return;
    }

    await interaction.deferReply();

    slashCommand.run(client, interaction);
    await interaction.client.application.commands.set(Commands)
};

const handleAutocomplete = async (client: Client, interaction: AutocompleteInteraction): Promise<void> => {
    const slashCommand = Commands.find(c => c.name === interaction.commandName);

    if (!slashCommand) { throw new Error("No command found") }
    if (!slashCommand.autocomplete) { throw new Error("No autocomplete function found") }

    slashCommand.autocomplete(client, interaction);
    await interaction.client.application.commands.set(Commands)
};
