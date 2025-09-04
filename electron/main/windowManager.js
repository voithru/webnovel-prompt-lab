const { BrowserWindow, screen } = require('electron')
const path = require('path')

const windowManager = {
  createMainWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    
    const win = new BrowserWindow({
      width: Math.min(width * 0.9, 1400),
      height: Math.min(height * 0.9, 900),
      minWidth: 800,
      minHeight: 600,
      center: true,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../preload.js'),
        webSecurity: true,
        allowRunningInsecureContent: false,
        webviewTag: false,
        sandbox: false
      },
      icon: path.join(__dirname, '../../assets/icons/icon.png'),
      titleBarStyle: 'default',
      title: '웹소설 MT 프롬프트 AI'
    })

    // CSP 임시 비활성화 (디버깅용)
    // win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    //   callback({
    //     responseHeaders: {
    //       ...details.responseHeaders,
    //       'Content-Security-Policy': [
    //         "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: http: https:; " +
    //         "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://127.0.0.1:3001 https://ssl.gstatic.com https://accounts.google.com; " +
    //         "style-src 'self' 'unsafe-inline' http://127.0.0.1:3001 https://fonts.googleapis.com; " +
    //         "img-src 'self' data: http: https: http://127.0.0.1:3001 https://ssl.gstatic.com https://accounts.google.com; " +
    //         "font-src 'self' data: http://127.0.0.1:3001 https://fonts.gstatic.com; " +
    //         "connect-src 'self' http: https: http://127.0.0.1:3001 https://accounts.google.com https://oauth2.googleapis.com; " +
    //         "frame-src 'self' http://127.0.0.1:3001 https://accounts.google.com;"
    //       ]
    //     }
    //   })
    // })

    win.once('ready-to-show', () => {
      win.show()
    })

    win.on('closed', () => {
      // 윈도우가 닫힐 때의 정리 작업
    })

    return win
  },

  createChildWindow(parent, options = {}) {
    const defaultOptions = {
      parent: parent,
      modal: true,
      width: 800,
      height: 600,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../preload.js'),
        webSecurity: true,
        allowRunningInsecureContent: false
      }
    }

    const win = new BrowserWindow({ ...defaultOptions, ...options })

    win.once('ready-to-show', () => {
      win.show()
    })

    return win
  }
}

module.exports = { windowManager }
