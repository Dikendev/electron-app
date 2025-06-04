import { ElectronAPI } from '@electron-toolkit/preload'
import { IStore } from '../main/classes/store'

import { AvailableCommands } from '../types/automata'
import {
    TodaySheetTimesResult,
    WorkingTimesResult
} from '../types/automata/automata-result.interface'
import { DepartureTime, Times } from 'src/types/automata/departure-time.interface'

import fs from 'fs'

declare global {
    interface Window {
        electron: ElectronAPI
        api: {
            os: {
                platform: string
                type: string
                homeDir: string
            }
            openDialog: (method, config) => Promise<any>
            fs: fs
            path: path
            dirname: () => string
            receive: (channel, func) => any
            openFile: () => Promise<string>
            savePreference: (key: string, value: unknown) => void
            loadPreferences: <T>() => Promise<IStore | T>
            executeWorkAutomate: (option: AvailableCommands) => Promise<void>
            executeGetWorkTimes: () => Promise<WorkingTimesResult>
            getTodaySheetTimes: () => Promise<TodaySheetTimesResult>
            internetPing: () => Promise<void>
            departureTime: ({
                startWorkingHours,
                startLunch,
                expectedWorkingTimes,
                finishLunchTime
            }: Times) => Promise<DepartureTime>
            job: (timeToExecute: string) => void
        }
    }
}
