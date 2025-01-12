type TodaysRow = number

type existOrNot = string | null

interface SheetCellContentFilled {
    startWorkingHours: existOrNot,
    startLunch: existOrNot,
    finishLunch: existOrNot,
    finishWorkingHours: existOrNot
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

export type { SheetData, SheetCellContentFilled, WorkingTimes }
