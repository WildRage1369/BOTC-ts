import { CommandInteraction, Client } from "discord.js";
import { Command } from "../command";
import fs from 'fs';
import path from 'path';
const lockfile = require('proper-lockfile');

export const AssignRoles: Command = {
    name: "assignroles",
    description: "Assigns roles to remaining players",
    run: async (_client: Client, interaction: CommandInteraction) => {
        // Lock the game state json
        const release = await lockfile.lock(path.resolve(__dirname, "./../game_state.json"))
        if (!release) {
            await interaction.followUp({
                ephemeral: true,
                content: "Error: Command failed to run. Please try again."
            });
            throw new Error("Command failed to run. Please try again.");
        }
        const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../game_state.json"), "utf-8"));
        const script_json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../scripts/" + json.script), "utf-8"));

        // Get all roles and in play roles
        var roles: string[] = [];
        var roles_in_play: string[] = [];
        for (const player of json.players) {
            roles_in_play.push(player.role)
        }
        for (const role_group of json.bluffs) {
            for (const role of role_group) {
                roles_in_play.push(role)
            }
        }
        for (const role of script_json) {
            if (roles_in_play.includes(role.id) || role == "_meta") { continue; }
            roles.push(role.id)
        }

        // Assign the roles
        var content: string = "";
        for (const player of json.players) {
            if (player.role) { continue; }
            player.role = roles.splice(Math.floor(Math.random() * roles.length), 1)[0];
            content += player.name + ": " + player.role + "\n";
        }

        // write the file and release the lock
        fs.writeFile(path.resolve(__dirname, "./../game_state.json"), JSON.stringify(json), (err) => { if (err) throw err; })
        release();

        if (content == "") { content = "All players have already been assigned roles!"; }
        await interaction.followUp({
            ephemeral: true,
            content
        });
    },
};
