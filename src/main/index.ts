import { app, shell, BrowserWindow, ipcMain, Tray, Menu, dialog } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { join } from 'path'
import { HandleFiles, IconHandle, Store, TrayManager } from './classes'

export interface UserPreferences {
    configPath: string,
    defaultConfig: {
        windowBounds: {
            width: number, height: number
        }
    },
    windowBounds: {
        width: number, height: number
    }
}

const userConfig = new Store(app)

function createWindow(): void {
    const { width, height } = userConfig.loadConfig().windowBounds



    const mainWindow = new BrowserWindow({
        width,
        height,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.on('resize', () => {
        const { width, height } = mainWindow.getBounds()

        const updatedConfig = {
            ...userConfig, windowBounds: {
                width, height
            }
        }

        userConfig.saveConfig(updatedConfig)
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }

    mainWindow.webContents.on('before-input-event', (event, input) => {
        // add all the shortcuts here.
        // and see how to call the api calls and change the app variables.

        // call all my api calls and return the result to the view to handle the changes.
        if (input.control && input.key.toLowerCase() === 'i') {
            console.log('Pressed Ctrl+I')
            event.preventDefault()
        }

        if (input.control && input.key.toLowerCase() === 'u') {
            console.log('Pressed Ctrl+U')
            event.preventDefault()
        }
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    const filesManager = new HandleFiles(dialog)

    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    const iconPath = IconHandle.icon(process)

    // Today is better to listen to keyboard shortcuts when the window have focus
    // globalShortcut.register('Alt+CommandOrControl+I', () => {
    //   console.log('Electron loves global shortcuts!')
    // })

    const tray: Tray = new Tray(iconPath)

    const contextMenu = Menu.buildFromTemplate(TrayManager.trayIconsInfo(app))

    tray.setToolTip('Registrar horário')
    tray.setContextMenu(contextMenu)

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    // IPC test
    ipcMain.on('ping', () => console.log('pong'))

    ipcMain.handle('showSaveDialog', (event, method, params) => {
        return dialog[method](params)
    })

    ipcMain.handle('get-dirname', () => __dirname)

    ipcMain.handle('dialog:openFile', filesManager.openFile)

    // Save user preference
    ipcMain.handle('save-preferences', (event, key, value) => {
        // parar para entender isso aqi
        const configLocal = userConfig.loadConfig()
        configLocal[key] = value
        userConfig.saveConfig(configLocal)
    })

    ipcMain.handle('load-preferences', (event): UserPreferences => {
        return userConfig.loadConfig()
    })

    createWindow()

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.

        // how to do this on macOs?
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// We can quit with with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})