import { AvailableCommands } from "./automata"

interface Platforms {
    win: string,
    mac: string
}

interface Command {
    command: AvailableCommands,
    name: string,
    code: Platforms
}

type Commands = Command[]

export type {
    Platforms,
    Command,
    Commands
}