import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import os from 'os'
import fs from 'fs'
import path from 'path'

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
  savePreference: (key: string, value: string) => ipcRenderer.invoke('save-preferences', key, value),

  loadPreferences: () => ipcRenderer.invoke("load-preferences")
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
