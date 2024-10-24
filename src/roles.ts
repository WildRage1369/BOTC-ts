import fs from 'fs';
import path from 'path';
import { Err, Whisper } from "./command"

const role_map: any = {
    "undertaker": undertaker,
}
var script: any;
var game_state: any;
var mtimes: any = {
    "script": "",
    "game_state": 0,
};

export async function doRole(client: any, interaction: any, user: string, role: string) {
    const stats = fs.statSync(path.resolve(__dirname, "./game_state.json"))
    if (!stats) { Err(interaction, "Error: Game state file not found."); return; }
    if (stats.mtime != mtimes.game_state) {
        game_state = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./game_state.json"), "utf-8"));
        if (game_state.script != script) {
            mtimes.script = game_state.script;
            script = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./scripts/"+game_state.script), "utf-8"));
        }
    }
    role_map[role](client, interaction, user);
}

function undertaker(client: any, interaction: any, user: string) {
    var dead_nom: any = null;
    for (const nom of game_state.nominations) {
        // check condition of if nomination passed (current night, enough votes, not a tie)
        if(nom.night != game_state.night) { continue; }
        if(nom.votesNeeded > nom.votes.length) { continue; }
        if (dead_nom && dead_nom.votes.length == nom.votes.length) { dead_nom = null }
        else if (dead_nom && dead_nom.votes.length > nom.votes.length) { continue; }
        dead_nom = nom;
    }
    if (!dead_nom) {return;}
    const dead_char = game_state.players.find((char: any) => {return char.name == dead_nom.nominee});
    Whisper(client, interaction, user, "Today, the " + dead_char.role + " died by execution.")
    return;

}

