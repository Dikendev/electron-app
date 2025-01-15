import { AvailableCommands } from "./automata"
import { ExistOrNot } from "./automata/sheet-data.interface"

interface SheetViewData
 {
    startWorkingHours: SheetCellContentFilledValue,
    startLunch: SheetCellContentFilledValue,
    finishLunch: SheetCellContentFilledValue,
    finishWorkingHours: SheetCellContentFilledValue
}

interface SheetCellContentFilledValue {
    action: AvailableCommands
    description: string
    value: ExistOrNot
}

export type {
    SheetViewData,
    SheetCellContentFilledValue
}