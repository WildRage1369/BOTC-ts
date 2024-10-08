import { Command } from "./command";
import { Start } from "./commands/start";
import { ListPlayers } from "./commands/list_players";
import { ListRoles } from "./commands/list_roles";
import { SetScript } from "./commands/set_script";
import { Join } from "./commands/join";
import { Leave } from "./commands/leave";

export const Commands: Command[] = [Start, ListPlayers, ListRoles, SetScript, Join, Leave];
