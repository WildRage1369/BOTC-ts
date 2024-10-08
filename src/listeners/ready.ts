import { Client } from "discord.js";
import { Commands } from "../commands";

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }
        await client.application.commands.set(Commands);
        console.log(`${client.user.username} is online with commands:`);
        console.table(Commands, ["name", "description", "options"]);
    });
};
//https://discord.com/api/oauth2/authorize?client_id={CLIENT_ID}&permissions={PERMISSIONS}&scope={SCOPE}
