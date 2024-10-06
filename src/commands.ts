import { Command } from "./command";
import { Hello } from "./commands/hello";
import { Start } from "./commands/start";

export const Commands: Command[] = [Hello, Start];
