import { GoogleSpreadsheetCell } from 'google-spreadsheet'
import DateUtils from '../utils/date-utils'
import { SheetData } from '../../../types/automata'

class CellManager {
    static isCellValid = (foundCell: Partial<SheetData>): boolean => {
        const cells = Object.keys(foundCell)

        for (const cell of cells) {
            const keyData = cell as keyof typeof foundCell
            const cellValue = foundCell[keyData]
            if (cellValue == -1) return false
        }
        return true
    }

    static isCellDateEqualsTodayDate = (cell: GoogleSpreadsheetCell): boolean => {
        const today = DateUtils.formatDateWithDayAndMonth()
        return cell && cell.formattedValue === today
    }
}

export default CellManager
