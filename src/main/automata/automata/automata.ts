import { GoogleSpreadsheetCell, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { CellNotFoundError } from '../errors/cell-not-found-error'

import StringUtils from '../utils/string-utils'
import DateUtils from '../utils/date-utils'

import CellManager from './cell-validation'
import CellData from './cell-data'

import {
    TodaySheetTimesResult,
    WorkingTimesResult
} from '../../../types/automata/automata-result.interface'
import SheetDataEnum from '../../../types/automata/sheet-data.enum'
import { AvailableCommands, KeyOption, SheetData } from '../../../types/automata'

class InitAutomata {
    private sheet: GoogleSpreadsheetWorksheet

    constructor(sheet: GoogleSpreadsheetWorksheet) {
        this.sheet = sheet;
    }

    execute = async (option: AvailableCommands): Promise<TodaySheetTimesResult> => {
        // if (!ValidationManager.isMonthValid(this.sheet.title)) return new MonthInvalidError()

        await this.sheet.loadCells();

        const foundCell = this.searchForSheetTitles();

        const {
            daysCol,
            startTime1ndCol,
            finishTime1ndCol,
            startTime2ndCol,
            finishTime2ndCol
        } = foundCell;

        const cellValidation = CellManager.isCellValid({
            daysCol,
            startTime1ndCol,
            finishTime1ndCol,
            startTime2ndCol,
            finishTime2ndCol
        });

        if (!cellValidation) return new CellNotFoundError();

        const hourAndMinutes = DateUtils.getActualHourAndTime();
        const dayCell = this.sheet.getCell(0, foundCell.daysCol);

        for (let row = foundCell.fistRow; row < this.sheet.rowCount; row++) {
            const cell = this.sheet.getCell(row, dayCell.columnIndex)

            if (CellManager.isCellDateEqualsTodayDate(cell)) {
                this.updateFoundCellRow(foundCell, row)
                this.updateCell(option, row, foundCell, hourAndMinutes)

                await this.sheet.saveUpdatedCells()
                const totalWorkingHours = this.cellRangeWorkingHours(foundCell)

                foundCell.totalWorkingHours = totalWorkingHours
            }
        }
        return CellData.todayValues(this.sheet, foundCell)
    }

    todayValues = async (): Promise<TodaySheetTimesResult> => {
        // if (!ValidationManager.isMonthValid(this.sheet.title)) return new MonthInvalidError()

        await this.sheet.loadCells()

        const foundCell = this.searchForSheetTitles()

        const { daysCol, startTime1ndCol, finishTime1ndCol, startTime2ndCol, finishTime2ndCol } =
            foundCell

        const cellValidation = CellManager.isCellValid({
            daysCol,
            startTime1ndCol,
            finishTime1ndCol,
            startTime2ndCol,
            finishTime2ndCol
        })

        if (!cellValidation) return new CellNotFoundError()

        for (let row = foundCell.fistRow; row < this.sheet.rowCount; row++) {
            const cell = this.sheet.getCell(row, daysCol)

            if (CellManager.isCellDateEqualsTodayDate(cell)) {
                return CellData.cellValues(this.sheet, row, foundCell)
            }
        }
        return CellData.todayValues(this.sheet, foundCell)
    }

    executeWorkingHours = async (): Promise<WorkingTimesResult> => {

        await this.sheet.loadCells()

        const foundCell = this.searchForSheetTitles()

        const {
            daysCol,
            startTime1ndCol,
            finishTime1ndCol,
            startTime2ndCol,
            finishTime2ndCol
        } = foundCell;

        const cellValidation = CellManager.isCellValid({
            daysCol,
            startTime1ndCol,
            finishTime1ndCol,
            startTime2ndCol,
            finishTime2ndCol
        })

        if (!cellValidation) throw new CellNotFoundError()

        for (let row = foundCell.fistRow; row < this.sheet.rowCount; row++) {
            const cell = this.sheet.getCell(row, daysCol)

            if (CellManager.isCellDateEqualsTodayDate(cell)) {
                return {
                    workingTimeTotal: this.cellRangeWorkingHours(foundCell)
                }
            }
        }

        if (foundCell.todaysRow === -1) throw new CellNotFoundError()

        return {
            workingTimeTotal: ''
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
        const foundCell = this.initSheetData()

        for (let row = 0; row < this.sheet.rowCount; row++) {
            for (let col = 0; col < this.sheet.columnCount; col++) {
                this.handleNewCellValues(foundCell, row, col)
            }
        }

        return foundCell
    }

    private handleNewCellValues = (foundCell: SheetData, row: number, col: number): void => {
        const cell = this.sheet.getCell(row, col)
        const colValue = cell.columnIndex
        const cellValue = cell.value
        if (typeof cellValue === 'string') {
            const normalizeWord = StringUtils.normalizeWord(cellValue).toUpperCase()

            switch (normalizeWord) {
                case SheetDataEnum.DAYS: {
                    foundCell.fistRow = row + 1
                    this.setRowAndColValues(foundCell, colValue, 'daysCol')
                    break
                }
                case SheetDataEnum.WORKING_HOURS: {
                    this.setRowAndColValues(foundCell, colValue, 'workingTimesCol')
                    break
                }
                case SheetDataEnum.WORKING_HOUR_START: {
                    this.setRowAndColValues(
                        foundCell,
                        colValue,
                        'startTime1ndCol',
                        'startTime2ndCol'
                    )
                    break
                }
                case SheetDataEnum.WORKING_HOUR_FINISH: {
                    this.setRowAndColValues(
                        foundCell,
                        colValue,
                        'finishTime1ndCol',
                        'finishTime2ndCol'
                    )
                    break
                }
            }
        }
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

    private cellRangeWorkingHours = (foundCell: SheetData): string => {
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
                    const hours = startWorkingHours.formattedValue.split(':')
                    result.push(hours)
                }
            }
        }

        const totalSeconds = this.sunAllTimes(result)
        return DateUtils.secondsToTime(totalSeconds)
    }

    private sunAllTimes = (result: string[][]): number => {
        return result.reduce((sum, time) => sum + DateUtils.timeToSeconds([time[0], time[1]]), 0)
    }

    private initSheetData = (): SheetData => {
        return {
            coopSheet: 'sheet',
            todaysRow: -1,
            fistRow: -1,
            totalWorkingHours: '',
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
