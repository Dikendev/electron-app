import { app, shell, BrowserWindow, ipcMain, Tray, Menu, MenuItem, globalShortcut, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
  import os from 'os'
  import fs from 'fs'
import path from 'path'


function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
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
    if (input.control && input.key.toLowerCase() === 'i') {
      console.log('Pressed Ctrl+I')
      event.preventDefault()
    }

    if (input.control && input.key.toLowerCase() === 'u') {
      console.log('Pressed Ctrl+U')
      event.preventDefault()
    }
  })

  
  ipcMain.on("toMain", (event, args) => {
    const homeDir = os.homedir()
    const pathUrl = path.join(homeDir, 'Desktop')
    const responseData = { success: true, data: 'Sample Data' };
    mainWindow.webContents.send("fromMain", responseData)

    // fs.readFile(pathUrl, (error, data) => {
      
    // })
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  
  let iconPath: string | null = null
  
  if (process.platform !== 'win32') {
    iconPath = join(__dirname, '../../resources/icon.png');
  } else {
    iconPath = join(__dirname, '../../resources/windows.ico');
  }

  // Global shortcuts. Even if the app is not focus the shortcut works. in this case need to show a popup message
  // showing the status of the requisition.

  //Today is better to listen to keyboard shortcuts when the window have focus
  
  // globalShortcut.register('Alt+CommandOrControl+I', () => {
  //   console.log('Electron loves global shortcuts!')
  // })

  const tray: Tray= new Tray(iconPath)

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Inicio expediente',submenu: [{
      role: 'help', 
      accelerator: process.platform === 'darwin' 
        ? 'Alt+Cmd+I' 
        : 'Alt+Shift+I',
      click: () => {console.log('Electron rocks!')}
    }]},
    { label: 'Inicio almoço' },
    { label: 'Fim almoço' },
    { label: 'Fim expediente'},
    { label: 'Sair electron', click: () => app.quit()},
  ])

  if (process.platform !== 'win32') {
    contextMenu.items[1].checked = false
    // Call this again for Linux because we modified the context menu
  }

  tray.setToolTip('This is my application.')
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

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
