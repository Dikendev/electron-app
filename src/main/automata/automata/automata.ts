import { GoogleSpreadsheetCell, GoogleSpreadsheetWorksheet } from "google-spreadsheet"
import { CellNotFoundError } from "../errors/cell-not-found-error"
import DateUtils from "../utils/date-utils"
import { AVAILABLE_OPTIONS } from "../constants/available-options.constant"
import { MonthInvalidError } from "../errors/month-invalid-error"
import { AvailableCommands, KeyOption, SheetData, } from "../../../types/automata"
import SheetDataEnum from "../../../types/automata/sheet-data.enum"
import CellManager from "./cell-validation"
import CellData from "./cell-data"
import ValidationManager from "./validations"
import { TodaySheetTimesResult, WorkingTimesResult } from "../../../types/automata/automata-result.interface"

class InitAutomata {
    private sheet: GoogleSpreadsheetWorksheet

    constructor(sheet: GoogleSpreadsheetWorksheet) {
        this.sheet = sheet
    }

    execute = async (option: AvailableCommands): Promise<TodaySheetTimesResult> => {
        if (!ValidationManager.isMonthValid(this.sheet.title)) return new MonthInvalidError()

        await this.sheet.loadCells()

        let foundCell = this.searchForSheetTitles()

        const { daysCol, startTime1ndCol, finishTime1ndCol, startTime2ndCol, finishTime2ndCol } = foundCell

        const cellValidation = CellManager.isCellValid(
            {
                daysCol,
                startTime1ndCol,
                finishTime1ndCol,
                startTime2ndCol,
                finishTime2ndCol
            }
        )

        if (!cellValidation) return new CellNotFoundError()

        const hourAndMinutes = DateUtils.getActualHourAndTime()
        const dayCell = this.sheet.getCell(0, foundCell.daysCol)

        for (let row = foundCell.fistRow; row < this.sheet.rowCount; row++) {
            const cell = this.sheet.getCell(row, dayCell.columnIndex)

            if (CellManager.isCellDateEqualsTodayDate(cell)) {
                console.log('Valores da planilha hoje')

                const cellValues = CellData.cellValues(this.sheet, row, foundCell)

                console.log(JSON.stringify(cellValues, null, 2))
                console.log(`Dia: ${cell.formattedValue}`)

                this.updateFoundCellRow(foundCell, row)
                this.updateCell(option, row, foundCell, hourAndMinutes)

                await this.sheet.saveUpdatedCells()
                const totalWorkingHours = this.cellRangeWorkingHours(foundCell)

                this.updateTotalWorkingHours(foundCell, totalWorkingHours)

                console.log(`Updated using command ${option}`)
                console.log(JSON.stringify(foundCell, null, 2))
                console.log(`${AVAILABLE_OPTIONS[option]} = ${hourAndMinutes} adicionado com sucesso`)

                console.log('Valores depois do update')
                console.log(JSON.stringify(CellData.todayValues(this.sheet, foundCell), null, 2))
            }
        }
        return CellData.todayValues(this.sheet, foundCell)
    }

    todayValues = async (): Promise<TodaySheetTimesResult> => {
        if (!ValidationManager.isMonthValid(this.sheet.title)) return new MonthInvalidError()

        await this.sheet.loadCells()

        let foundCell = this.searchForSheetTitles()

        const { daysCol, startTime1ndCol, finishTime1ndCol, startTime2ndCol, finishTime2ndCol } = foundCell

        const cellValidation = CellManager.isCellValid(
            {
                daysCol,
                startTime1ndCol,
                finishTime1ndCol,
                startTime2ndCol,
                finishTime2ndCol
            }
        )

        if (!cellValidation) return new CellNotFoundError()

        const dayCell = this.sheet.getCell(0, foundCell.daysCol)

        for (let row = foundCell.fistRow; row < this.sheet.rowCount; row++) {
            const cell = this.sheet.getCell(row, dayCell.columnIndex)

            if (CellManager.isCellDateEqualsTodayDate(cell)) {
                return CellData.cellValues(this.sheet, row, foundCell)
            }
        }
        return CellData.todayValues(this.sheet, foundCell)
    }

    executeWorkingHours = async (): Promise<WorkingTimesResult> => {
        if (!ValidationManager.isMonthValid(this.sheet.title)) return new MonthInvalidError()

        await this.sheet.loadCells()

        let foundCell = this.searchForSheetTitles()

        const { daysCol, startTime1ndCol, finishTime1ndCol, startTime2ndCol, finishTime2ndCol } = foundCell
        const cellValidation = CellManager.isCellValid(
            {
                daysCol,
                startTime1ndCol,
                finishTime1ndCol,
                startTime2ndCol,
                finishTime2ndCol
            }
        )

        if (!cellValidation) return new CellNotFoundError()

        const dayCell = this.sheet.getCell(0, foundCell.daysCol)

        for (let row = foundCell.fistRow; row < this.sheet.rowCount; row++) {
            const cell = this.sheet.getCell(row, dayCell.columnIndex)

            if (CellManager.isCellDateEqualsTodayDate(cell)) {
                return {
                    workingTimeTotal: this.cellRangeWorkingHours(foundCell).join(':')
                }
            }
        }

        return {
            workingTimeTotal: ""
        }
    }

    private updateFoundCellRow = (foundCell: SheetData, row: number): void => {
        foundCell.todaysRow = row
    }

    private updateCell = (
        option: AvailableCommands,
        row: number,
        foundCell: SheetData,
        validHourAndMinutes: string
    ): void => {
        const targetCell = this.targetCellFind(option, row, foundCell)
        targetCell.value = DateUtils.stringTimeAsNumber(validHourAndMinutes)
        targetCell.numberFormat = { type: 'DATE_TIME', pattern: 'h:mm' }
        targetCell.textDirection = 'RIGHT_TO_LEFT'
    }

    private targetCellFind = (
        option: AvailableCommands,
        todaysCelIndex: number,
        foundCell: SheetData
    ): GoogleSpreadsheetCell => {
        switch (option) {
            case 'INICIO_EXP': {
                return this.sheet.getCell(todaysCelIndex, foundCell.startTime1ndCol)
            }
            case 'INICIO_ALM': {
                return this.sheet.getCell(todaysCelIndex, foundCell.finishTime1ndCol)
            }
            case 'FIM_ALM': {
                return this.sheet.getCell(todaysCelIndex, foundCell.startTime2ndCol)
            }
            case 'FIM_EXP': {
                return this.sheet.getCell(todaysCelIndex, foundCell.finishTime2ndCol)
            }
        }
    }

    private searchForSheetTitles = (): SheetData => {
        let foundCell = this.initSheetData()

        for (let row = 0; row < this.sheet.rowCount; row++) {
            for (let col = 0; col < this.sheet.columnCount; col++) {
                this.handleNewCellValues(foundCell, row, col)
            }
        }

        return foundCell
    }

    private handleNewCellValues = (
        foundCell: SheetData,
        row: number,
        col: number
    ): void => {
        const cell = this.sheet.getCell(row, col)
        const colValue = cell.columnIndex

        if (cell.value === SheetDataEnum.DAYS) {
            foundCell.fistRow = row + 1
            this.setRowAndColValues(foundCell, colValue, 'daysCol')
        }

        if (cell.value === SheetDataEnum.WORKING_HOURS) this.setRowAndColValues(foundCell, colValue, 'workingTimesCol')
        if (cell.value === SheetDataEnum.WORKING_HOUR_START) this.setRowAndColValues(foundCell, colValue, 'startTime1ndCol', 'startTime2ndCol')
        if (cell.value === SheetDataEnum.WORKING_HOUR_FINISH) this.setRowAndColValues(foundCell, colValue, 'finishTime1ndCol', 'finishTime2ndCol')
    }

    private setRowAndColValues = (
        foundCell: SheetData,
        colValue: number,
        targetCell: KeyOption,
        secondTargetCell?: KeyOption
    ): void => {
        if (foundCell[targetCell] === -1) {
            foundCell[targetCell] = colValue
            return
        }

        const secondTargetCellExist = secondTargetCell && foundCell[secondTargetCell]

        if (secondTargetCellExist && secondTargetCellExist === -1) {
            foundCell[secondTargetCell] = colValue
        }
    }

    private cellRangeWorkingHours = (foundCell: SheetData): string[] => {
        const sum = new Date()
        sum.setHours(0, 0, 0, 0)

        const result: string[][] = []

        for (let row = foundCell.fistRow; row < this.sheet.rowCount; row++) {
            const dayCell = this.sheet.getCell(0, foundCell.daysCol)
            const cell = this.sheet.getCell(row, dayCell.columnIndex)

            if (!cell.formattedValue) {
                break
            } else {
                const startWorkingHours = this.sheet.getCell(row, foundCell.workingTimesCol)

                if (startWorkingHours.formattedValue) {
                    const hours = startWorkingHours.formattedValue.split(":")
                    result.push(hours)
                }
            }
        }

        const totalSeconds = this.sunAllTimes(result)
        return this.secondsToTime(totalSeconds);
    }

    private updateTotalWorkingHours = (foundCell: SheetData, totalTime: string[]) => {
        foundCell.totalWorkingHours = totalTime.join(':')
    }

    private sunAllTimes = (result: string[][]) => {
        return result.reduce((sum, time) => sum + this.timeToSeconds([time[0], time[1]]), 0);
    }

    // Function to convert time array to total seconds
    private timeToSeconds = ([hh, mm]: [string, string]) => {
        return parseInt(hh, 10) * 3600 + parseInt(mm, 10) * 60;
    };

    // Function to convert total seconds to hh:mm format
    private secondsToTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        return [hours.toString().padStart(2, '0'), minutes.toString().padStart(2, '0')];
    };

    private initSheetData = (): SheetData => {
        return {
            coopSheet: 'sheet',
            todaysRow: -1,
            fistRow: -1,
            totalWorkingHours: "",
            daysCol: -1,
            workingTimesCol: -1,
            startTime1ndCol: -1,
            finishTime1ndCol: -1,
            startTime2ndCol: -1,
            finishTime2ndCol: -1
        }
    }
}

export default InitAutomata