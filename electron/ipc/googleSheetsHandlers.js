const { ipcMain } = require('electron')
const { google } = require('googleapis')

class GoogleSheetsHandler {
  constructor() {
    this.setupHandlers()
  }

  setupHandlers() {
    // Google Sheets 데이터 읽기
    ipcMain.handle('sheets:read-data', async (event, { spreadsheetId, range }) => {
      try {
        // TODO: 인증된 OAuth2 클라이언트 사용
        // const authClient = require('./authHandlers').authHandler.getAuthClient()
        
        const sheets = google.sheets({ version: 'v4' })
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range,
        })

        return {
          success: true,
          data: response.data.values
        }
      } catch (error) {
        console.error('Google Sheets read error:', error)
        return {
          success: false,
          error: error.message
        }
      }
    })

    // Google Sheets 데이터 쓰기
    ipcMain.handle('sheets:write-data', async (event, { spreadsheetId, range, values }) => {
      try {
        const sheets = google.sheets({ version: 'v4' })
        const response = await sheets.spreadsheets.values.update({
          spreadsheetId,
          range,
          valueInputOption: 'RAW',
          resource: {
            values: values
          }
        })

        return {
          success: true,
          updatedCells: response.data.updatedCells
        }
      } catch (error) {
        console.error('Google Sheets write error:', error)
        return {
          success: false,
          error: error.message
        }
      }
    })
  }
}

// 인스턴스 생성 및 핸들러 설정
new GoogleSheetsHandler()
