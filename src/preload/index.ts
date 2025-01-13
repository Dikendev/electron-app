import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import os from 'os'
import fs from 'fs'
import path from 'path'

import { IStore } from '../types/store.interface'
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { AvailableCommands } from '../types/automata'
import { TodaySheetTimesResult, WorkingTimesResult } from '../types/automata/automata-result.interface'

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
    const validChannels = ["toMain"]

    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel, func) => {
    console.log('chamou o receive')
    const validChannels = ["fromMain"]

    console.log('channel', channel)
    if (validChannels.includes(channel)) {
      console.log('valido')

      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },

  // mesmo entry point utilizado no renderer, agora posso utilizar na view
  // e vai retornar com o método de two-way
  openFile: () => ipcRenderer.invoke('dialog:openFile'),

  //save the user preference
  savePreference: (key: string, value: string) => ipcRenderer.invoke('save-preferences', key, value),

  //load all the config by user saved on app default src
  loadPreferences: <T>(): Promise<IStore | T> => ipcRenderer.invoke("load-preferences"),
  iniGoogleAuth: (option: AvailableCommands): Promise<GoogleSpreadsheetWorksheet> => ipcRenderer.invoke("init-google-auth", option),
  executeWorkAutomate: (option: AvailableCommands): Promise<void> => ipcRenderer.invoke('execute-work-automate', option),
  executeGetWorkTimes: (): Promise<WorkingTimesResult> => ipcRenderer.invoke('execute-get-work-times'),
  getTodaySheetTimes: (): Promise<TodaySheetTimesResult> => ipcRenderer.invoke('get-today-sheet-values'),
  internetPing: (): Promise<boolean> => ipcRenderer.invoke('internet-ping')
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
