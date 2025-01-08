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
      receive: (channel, func) => any
    }
  }
}
