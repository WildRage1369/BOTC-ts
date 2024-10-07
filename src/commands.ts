import { Command } from "./command";
import { Hello } from "./commands/hello";
import { Start } from "./commands/start";
import { ListPlayers } from "./commands/list_players";
import { ListRoles } from "./commands/list_roles";

export const Commands: Command[] = [Hello, Start, ListPlayers, ListRoles];
