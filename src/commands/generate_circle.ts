import { CommandInteraction, Client } from "discord.js";
import { Command } from "../command";
import { createCanvas, loadImage } from "canvas";
import fs from 'fs';
import path from 'path';
const lockfile = require('proper-lockfile');

export const GenerateCircle: Command = {
    name: "generatecicle",
    description: "Generates a circle of players",
    run: async (_client: Client, interaction: CommandInteraction) => {
        const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./../game_state.json"), "utf-8"));
        const num_players = json.players.length;

        const canvas = createCanvas(2000, 2000);
        const ctx = canvas.getContext("2d");
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white"
        ctx.font = '50px "Times New Roman"';
        ctx.textAlign = "center";
        try {

            // draw the background
            // const background = await loadImage(path.resolve(__dirname,"../images/botc.png"))
            // ctx.drawImage(background, 0, 0);

            // draw the players
            const token = await loadImage(path.resolve(__dirname, "../images/token.png"));

            const token_size = 540 * (5 / num_players);
            const radius = 1200.0 * (num_players / 60) + 500;
            for (const [index, player] of json.players.entries()) {
                // calculates the position of the token
                const seg = {
                    x: 1000 + (radius * (Math.cos(-1.5707 + (index * ( (360 / num_players)*(Math.PI/180) ) )) ) ) - (token_size / 2),
                    y: 1000 + (radius * (Math.sin(-1.5707 + (index * ( (360 / num_players)*(Math.PI/180) ) )) ) ) - (token_size / 2)
                }

                ctx.drawImage(token, seg.x, seg.y, token_size, token_size);
                ctx.fillText(player.name, seg.x + token_size / 2, seg.y + token_size + 30, token_size);
            }

            var buffer: any[] = [];
            buffer[0] = canvas.toBuffer("image/png");
            fs.writeFileSync(path.resolve(__dirname, "./image.png"), buffer[0]);
        } catch (error) {
            throw error;
        }
        if (!buffer) {
            throw new Error("Error generating circle");
        }

        await interaction.followUp({
            files: buffer,
            content: "Generated circle"
        });
    }
};
