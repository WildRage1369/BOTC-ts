import { Command } from "./command";
import { Start } from "./commands/start";
import { ListPlayers } from "./commands/list_players";
import { ListRoles } from "./commands/list_roles";
import { SetScript } from "./commands/set_script";
import { Join } from "./commands/join";
import { Leave } from "./commands/leave";
import { SetRole } from "./commands/set_role";
import { SetPlayer } from "./commands/set_player";
import { GenerateCircle } from "./commands/generate_circle";
import { SetBluffs } from "./commands/set_bluffs";
import { AssignRoles } from "./commands/assign_roles";

export const Commands: Command[] = [Start, ListPlayers, ListRoles, SetScript, Join, Leave, SetRole, SetPlayer, GenerateCircle, SetBluffs ,AssignRoles];
