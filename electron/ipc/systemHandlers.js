const { ipcMain, shell } = require('electron')

class SystemHandler {
  constructor() {
    this.setupHandlers()
  }

  setupHandlers() {
    // 외부 브라우저에서 URL 열기
    ipcMain.handle('system:open-external', async (event, url) => {
      try {
        await shell.openExternal(url)
        return { success: true }
      } catch (error) {
        console.error('Failed to open external URL:', error)
        return { success: false, error: error.message }
      }
    })

    // 시스템 버전 정보
    ipcMain.handle('system:get-version', async () => {
      try {
        const { app } = require('electron')
        return { 
          success: true, 
          version: app.getVersion(),
          name: app.getName()
        }
      } catch (error) {
        console.error('Failed to get version:', error)
        return { success: false, error: error.message }
      }
    })

    // 플랫폼 정보
    ipcMain.handle('system:get-platform', async () => {
      try {
        return { 
          success: true, 
          platform: process.platform,
          arch: process.arch
        }
      } catch (error) {
        console.error('Failed to get platform info:', error)
        return { success: false, error: error.message }
      }
    })

    // 폴더에서 항목 표시
    ipcMain.handle('system:show-item-in-folder', async (event, path) => {
      try {
        const { shell } = require('electron')
        shell.showItemInFolder(path)
        return { success: true }
      } catch (error) {
        console.error('Failed to show item in folder:', error)
        return { success: false, error: error.message }
      }
    })
  }
}

new SystemHandler()
