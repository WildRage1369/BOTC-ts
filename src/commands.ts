import { Command } from "./command";
import { Start } from "./commands/start";
import { ListPlayers } from "./commands/list_players";
import { ListRoles } from "./commands/list_roles";

export const Commands: Command[] = [Start, ListPlayers, ListRoles];
