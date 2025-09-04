const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path')
const { windowManager } = require('./windowManager.js')
const { menuBuilder } = require('./menuBuilder.js')
require('../ipc/authHandlers.js')
require('../ipc/googleSheetsHandlers.js')
require('../ipc/llmHandlers.js')
require('../ipc/webhookHandlers.js')
require('../ipc/userHandlers.js')
require('../ipc/systemHandlers.js')

// HTTP 핸들러 추가 (CORS 우회용)
const HttpHandlers = require('../ipc/httpHandlers.js')
new HttpHandlers()

// IPC 핸들러 등록 상태 확인
console.log('🔍 IPC 핸들러 등록 상태 확인:')
console.log('📱 auth:google-login 등록됨:', ipcMain.listenerCount('auth:google-login') > 0)
console.log('📱 auth:logout 등록됨:', ipcMain.listenerCount('auth:logout') > 0)
console.log('📱 auth:get-user 등록됨:', ipcMain.listenerCount('auth:get-user') > 0)
console.log('📱 system:get-version 등록됨:', ipcMain.listenerCount('system:get-version') > 0)

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../..')
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public')

let win

function createWindow() {
  win = windowManager.createMainWindow()
  
  // Set up menu
  const menu = menuBuilder.buildMenu(win)
  Menu.setApplicationMenu(menu)

  console.log('🔍 환경 변수 확인:')
  console.log('📦 app.isPackaged:', app.isPackaged)
  console.log('🌐 VITE_DEV_SERVER_URL:', process.env.VITE_DEV_SERVER_URL)
  console.log('📁 DIST:', process.env.DIST)

  if (!app.isPackaged && process.env.VITE_DEV_SERVER_URL) {
    console.log('🚀 Vite 개발 서버에 연결 중:', process.env.VITE_DEV_SERVER_URL)
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else if (!app.isPackaged) {
    // 환경 변수가 없으면 하드코딩된 URL 사용
    const devServerUrl = 'http://127.0.0.1:3001'
    console.log('🚀 하드코딩된 Vite 서버에 연결 중:', devServerUrl)
    win.loadURL(devServerUrl)
    win.webContents.openDevTools()
  } else {
    console.log('📁 빌드된 파일 로드 중:', path.join(process.env.DIST, 'index.html'))
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's main process code.
// You can also put them in separate files and require them here.
