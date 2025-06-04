import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import os from 'os'
import fs from 'fs'
import path from 'path'

import { IStore } from '../types/store.interface'
import { AvailableCommands } from '../types/automata'
import {
    TodaySheetTimesResult,
    WorkingTimesResult
} from '../types/automata/automata-result.interface'
import { sendMessageToMain } from '../main/handle-message-from-renderer'
import { DepartureTimeResponse, Times } from '../types/automata/departure-time.interface'

// Custom APIs for renderer
const api = {
    os: {
        platform: os.platform(),
        type: os.type(),
        homeDir: os.homedir()
    },
    openDialog: (method, config) => ipcRenderer.invoke('showSaveDialog', method, config),
    dirname: () => ipcRenderer.invoke('get-dirname'),
    fs: fs,
    path: path,

    // not working, find out why
    send: (channel, data) => {
        const validChannels = ['toMain']

        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data)
        }
    },
    receive: (channel, func) => {
        const validChannels = ['fromMain']

        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (_event, ...args) => func(...args))
        }
    },

    // mesmo entry point utilizado no renderer, agora posso utilizar na view
    // e vai retornar com o método de two-way
    openFile: () => ipcRenderer.invoke('dialog:openFile'),

    //save the user preference
    savePreference: (key: string, value: string) =>
        ipcRenderer.invoke('save-preferences', key, value),

    //load all the config by user saved on app default src
    loadPreferences: <T>(): Promise<IStore | T> => ipcRenderer.invoke('load-preferences'),
    executeWorkAutomate: (option: AvailableCommands): Promise<void> =>
        sendMessageToMain('execute-work-automate', option),
    executeGetWorkTimes: (): Promise<WorkingTimesResult> =>
        sendMessageToMain('execute-get-work-times'),
    getTodaySheetTimes: (): Promise<TodaySheetTimesResult> =>
        sendMessageToMain('get-today-sheet-times'),
    internetPing: (): Promise<void> => sendMessageToMain('internet-ping'),
    departureTime: ({
        startWorkingHours,
        startLunch,
        expectedWorkingTimes,
        finishLunch
    }: Times): Promise<DepartureTimeResponse> =>
        sendMessageToMain('departure-time', {
            startWorkingHours,
            startLunch,
            finishLunch,
            expectedWorkingTimes,
        }),
    job: (timeToExecute: string) => ipcRenderer.invoke('job', timeToExecute),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api
}
