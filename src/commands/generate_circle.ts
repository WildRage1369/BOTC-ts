import { CommandInteraction, Client } from "discord.js";
import { Command } from "../command";
import { createCanvas, loadImage } from "canvas";
import fs from 'fs';
import path from 'path';
const lockfile = require('proper-lockfile');

var base_cache: any = {};
var pfp_cache: any = {};
export const GenerateCircle: Command = {
    name: "generatecicle",
    description: "Generates a circle of players",
    run: async (client: Client, interaction: CommandInteraction) => {
        const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../game_state.json"), "utf-8"));
        const num_players = json.players.length;

        const canvas = createCanvas(2000, 2000);
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "white"
        ctx.font = '50px "Times New Roman"';
        ctx.textAlign = "center";

        const token_size = 540 * (5 / num_players);
        const radius = 1200.0 * (num_players / 60) + 500;
        const token_border = 0.039 * token_size

        // first check if the canvas has already been created
        if (base_cache[num_players]) {
            ctx = base_cache[num_players]
        } else {
            const token = await loadImage(path.resolve(__dirname, "../images/token.png"));

            for (const [index] of json.players.entries()) {
                // calculates the position of the token
                const seg = {
                    x: 1000 + (radius * (Math.cos(-1.5707 + (index * ((360 / num_players) * (Math.PI / 180)))))) - (token_size / 2),
                    y: 1000 + (radius * (Math.sin(-1.5707 + (index * ((360 / num_players) * (Math.PI / 180)))))) - (token_size / 2)
                }

                // Draw the token and name of the player
                ctx.drawImage(token, seg.x, seg.y, token_size, token_size);
            }
        }

        // next draw the player pfps and names
        for (const [index, player] of json.players.entries()) {
            const seg = {
                x: 1000 + (radius * (Math.cos(-1.5707 + (index * ((360 / num_players) * (Math.PI / 180)))))) - (token_size / 2),
                y: 1000 + (radius * (Math.sin(-1.5707 + (index * ((360 / num_players) * (Math.PI / 180)))))) - (token_size / 2)
            }
            ctx.fillText(player.name, seg.x + token_size / 2, seg.y + token_size + 40, token_size);

            // save options of context to later restore to "un-clip" canvas
            ctx.save()
            var avatar;
            // check if the pfp has already been loaded
            if(pfp_cache[player.username]) {
            } else {
                const usr = await client.guilds.cache.at(0)?.members.fetch({ query: player.username, limit: 1 })
                if (!usr) throw new Error("No user found");
                var url = usr.at(0)?.displayAvatarURL({ extension: "jpg", forceStatic: true, size: 128 })
                if (!url) throw new Error("No avatar found");
                pfp_cache[player.username] = await loadImage(url)
            }
            avatar = pfp_cache[player.username]
            // clip the avatar to the token and draw it
            ctx.beginPath()
            ctx.arc(seg.x + token_size / 2, seg.y + token_size / 2, token_size / 2 - token_border, 0, 2 * Math.PI);
            ctx.clip()
            ctx.drawImage(avatar, seg.x, seg.y, token_size, token_size);
            ctx.restore()
        }
        var buffer: any[] = [];
        buffer[0] = canvas.toBuffer("image/png");
        fs.writeFileSync(path.resolve(__dirname, "./image.png"), buffer[0]);
        if (!buffer) {
            throw new Error("Error generating circle");
        }

        await interaction.followUp({
            files: buffer,
            content: "Generated circle"
        });
    }
};
