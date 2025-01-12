import { CellNotFoundError } from "../../main/automata/errors/cell-not-found-error";
import { MonthInvalidError } from "../../main/automata/errors/month-invalid-error";
import { SheetCellContentFilled, WorkingTimes } from "./sheet-data.interface";

type WorkingTimesResult = CellNotFoundError | MonthInvalidError | WorkingTimes

type TodaySheetTimesResult = CellNotFoundError | MonthInvalidError | SheetCellContentFilled

export type { WorkingTimesResult, TodaySheetTimesResult }