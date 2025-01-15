import { Commands } from "src/types/command.interface";

const COMMANDS_SHORT_CUTS: Commands = [
    {
        command: 'INICIO_EXP',
        name: 'Início expediente',
        code: {
            win: "shift + espaço + e",
            mac: "command + e"
        }
    },
    {
        command: 'INICIO_ALM',
        name: 'Início almoço',
        code: {
            win: "shift + espaço + a",
            mac: "command + a"
        }
    },
    {
        command: 'FIM_ALM',
        name: 'Fim almoço',
        code: {
            win: "shift + espaço + b",
            mac: "command + b"
        }
    },
    {
        command: 'FIM_EXP',
        name: 'Fim expediente',
        code: {
            win: "shift + espaço + f",
            mac: "command + c"
        }
    }
]

export default COMMANDS_SHORT_CUTS