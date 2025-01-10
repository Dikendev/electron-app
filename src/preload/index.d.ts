import { ElectronAPI } from '@electron-toolkit/preload'
import fs from 'fs'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      os: {
        platform: string
        type: string
        homeDir: string
      },
      openDialog: (method, config) => Promise<any>,
      fs: fs,
      path: path,
      dirname: () => string,
      receive: (channel, func) => any,

      // Preciso informar usando ts
      openFile: () => Promise<string>,
      savePreference: (key: string, value: unknown) => void,
      loadPreferences: () => any
    }
  }
}
