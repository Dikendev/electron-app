type TodaysRow = number

type ExistOrNot = string | null

interface SheetCellContentFilled {
    startWorkingHours: ExistOrNot,
    startLunch: ExistOrNot,
    finishLunch: ExistOrNot,
    finishWorkingHours: ExistOrNot
}

interface SheetDataCellContent {
    startTime1ndCol: number
    finishTime1ndCol: number
    startTime2ndCol: number
    finishTime2ndCol: number
}

type SheetDataCol = SheetDataCellContent

interface SheetData extends SheetDataCol {
    coopSheet: string
    todaysRow: TodaysRow
    fistRow: number
    totalWorkingHours: string
    daysCol: number
    workingTimesCol: number
}

interface WorkingTimes {
    workingTimeTotal: string
}

interface UpdateAll {
    updateId: (id: string) => void
    updateClientEmail: (clientEmail: string) => void;
    updatePrivateKey: (privateKey: string) => void;
    checkOnUpdate: () => Promise<void>
}

export type {
    ExistOrNot,
    SheetData,
    SheetCellContentFilled,
    WorkingTimes,
    UpdateAll
}
