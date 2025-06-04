import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import InitAutomata from '../automata';

const mockAddRow = jest.fn();

describe('test', () => {
    async function addRow(sheet: GoogleSpreadsheetWorksheet, row: any) {
        await sheet.addRow(row);
    }

    const mockSheet = {
        addRow: mockAddRow,
    } as unknown as GoogleSpreadsheetWorksheet;

    it('should return true', async () => {
        const row = { name: 'John' };
        await addRow(mockSheet, row);

        const init = new InitAutomata(mockSheet);
        console.log('init', init.todayValues())
    })
})
