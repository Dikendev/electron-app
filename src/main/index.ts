import { app, shell, BrowserWindow, ipcMain, Tray, Menu, dialog } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { join } from 'path'
import { HandleFiles, IconHandle, Store, TrayManager } from './classes'
import { UserPreferences } from '../types/user-preferences'
import { IStore } from '../types/store.interface'
import GoogleSheetAuth from './automata/automata/google-sheet-auth'
import InitAutomata from './automata/automata/automata'
import { AvailableCommands } from '../types/automata'
import { TodaySheetTimesResult, WorkingTimesResult } from '../types/automata/automata-result.interface'
import axios from 'axios'
import { handleMessageFromRenderer } from './handle-message-from-renderer'

const userConfig = new Store(app)

let mainWindow: BrowserWindow

async function createWindow(): Promise<void> {
    const windowBounds = await userConfig.loadConfig<UserPreferences>()

    let windowConfig: {
        width: number, height: number
    } = windowBounds.defaultConfig.windowBounds

    if ('windowBounds' in windowBounds) {
        windowConfig = windowBounds.windowBounds
    }

    mainWindow = new BrowserWindow({
        width: windowConfig.width,
        height: windowConfig.height,
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
app.whenReady().then(async () => {
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

    tray.setToolTip('Registrar horários cooperativa')
    tray.setContextMenu(contextMenu)
    // this is not working don't figure why
    tray.on("right-click", () => {
        console.log('right-click')
    })
    
    tray.on("click", () => {
        mainWindow.isVisible() ? mainWindow.minimize() : mainWindow.show()
    })
        
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
    ipcMain.handle('save-preferences', (event, key, value): void => {
        const configLocal = userConfig.loadConfig<UserPreferences>()
        configLocal[key] = value
        userConfig.saveConfig(configLocal)
    })

    ipcMain.handle('load-preferences', <T>(event): Promise<IStore | T> => {
        return userConfig.loadConfig<T>()
    })

    handleMessageFromRenderer('execute-work-automate', (
        event,
        option: AvailableCommands
    ): Promise<void> => executeWorkAutomate(option))

    handleMessageFromRenderer('execute-get-work-times', (
        event,
    ): Promise<WorkingTimesResult> => executeGetWorkTimes())

    handleMessageFromRenderer('get-today-sheet-times', (event): Promise<TodaySheetTimesResult> => getTodaySheetValues())

    handleMessageFromRenderer('internet-ping', (event): Promise<void> => internetPing())

    await createWindow()

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

async function internetPing(): Promise<void> {
    const google = "https://www.google.com.br"
    await axios.get(google)
}

async function getTodaySheetValues(): Promise<TodaySheetTimesResult> {
    const automata = await initAuth()
    return automata.todayValues()
}

async function executeWorkAutomate(option: AvailableCommands): Promise<void> {
    const automata = await initAuth()
    await automata.execute(option)
}

async function executeGetWorkTimes(): Promise<WorkingTimesResult> {
    const automata = await initAuth()
    return automata.executeWorkingHours()
}

async function initAuth(): Promise<InitAutomata> {
    const windowBounds = await userConfig.loadConfig<UserPreferences>()
    console.log('windowBounds', windowBounds)

    let credentials: UserPreferences['credentials'] = {
        id: "",
        privateKey: "",
        clientEmail: ""
    }

    if ('credentials' in windowBounds) {
        credentials = windowBounds.credentials
    }

    const googleSheetAuthCredentials = new GoogleSheetAuth({
        id: credentials.id,
        clientEmail: credentials.clientEmail,
        privateKey: credentials.privateKey.replace(/\\n/g, '\n'),
    })

    const sheet = await googleSheetAuthCredentials.loadSheet()
    return new InitAutomata(sheet)
}