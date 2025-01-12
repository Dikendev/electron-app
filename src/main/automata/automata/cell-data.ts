import { GoogleSpreadsheetWorksheet } from "google-spreadsheet"
import CellManager from "./cell-validation"
import { SheetCellContentFilled, SheetData } from "../../../types/automata"

class CellData {
    static todayValues(
        sheet: GoogleSpreadsheetWorksheet,
        foundCell: SheetData
    ): SheetCellContentFilled {
        const { daysCol } = foundCell
        const { rowIndex, columnIndex } = sheet.getCell(0, daysCol)

        for (let row = rowIndex; row < sheet.rowCount; row++) {
            const cell = sheet.getCell(row, columnIndex)

            if (CellManager.isCellDateEqualsTodayDate(cell)) {
                return this.cellValues(sheet, row, foundCell)
            }
        }

        return {
            startWorkingHours: null,
            startLunch: null,
            finishLunch: null,
            finishWorkingHours: null
        }
    }

    static cellValues(
        sheet: GoogleSpreadsheetWorksheet,
        row: number,
        foundCell: SheetData
    ): SheetCellContentFilled {
        const { startTime1ndCol, finishTime1ndCol, startTime2ndCol, finishTime2ndCol } = foundCell
        return {
            startWorkingHours: sheet.getCell(row, startTime1ndCol).formattedValue,
            startLunch: sheet.getCell(row, finishTime1ndCol).formattedValue,
            finishLunch: sheet.getCell(row, startTime2ndCol).formattedValue,
            finishWorkingHours: sheet.getCell(row, finishTime2ndCol).formattedValue
        }
    }
}

export default CellData
