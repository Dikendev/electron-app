import { AvailableCommands } from "./automata"
import { ExistOrNot } from "./automata/sheet-data.interface"

export interface SheetViewData {
    startWorkingHours: SheetCellContentFilledValue,
    startLunch: SheetCellContentFilledValue,
    finishLunch: SheetCellContentFilledValue,
    finishWorkingHours: SheetCellContentFilledValue
}

export interface SheetCellContentFilledValueShortCut {
    win: string;
    mac: string;
    linux: string;
}

export interface SheetCellContentFilledValue {
    action: AvailableCommands
    description: string
    value: ExistOrNot
    shortcut: SheetCellContentFilledValueShortCut;
}
