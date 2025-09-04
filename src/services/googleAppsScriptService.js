/**
 * Google Apps Script 서비스
 * Google Apps Script를 통해 Google Drive에 JSON 파일 업로드
 */

class GoogleAppsScriptService {
  constructor() {
    // Google Apps Script Web App URL (배포 후 받게 될 URL)
    this.webAppUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec' // 실제 배포 후 URL로 변경 필요
    this.folderId = '1Gm9_tB649B-OfofFcUPCcXqAvXbUdbQG' // 제공된 폴더 ID
  }

  /**
   * JSON 데이터를 Google Drive 폴더에 업로드 (Google Apps Script 경유)
   * @param {Object} jsonData - 업로드할 JSON 데이터
   * @param {string} fileName - 파일명
   * @returns {Promise<Object>} 업로드 결과
   */
  async uploadJsonFile(jsonData, fileName) {
    try {
      console.log('🚀 Google Apps Script 경유 업로드 시작:', fileName)
      
      // JSON 데이터를 문자열로 변환
      const jsonString = JSON.stringify(jsonData, null, 2)
      
      // Google Apps Script로 전송할 데이터
      const requestData = {
        action: 'uploadFile',
        folderId: this.folderId,
        fileName: fileName,
        fileContent: jsonString,
        mimeType: 'application/json'
      }
      
      // Google Apps Script Web App 호출
      const response = await fetch(this.webAppUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Google Apps Script 에러:', response.status, errorText)
        throw new Error(`Google Apps Script 에러: ${response.status} - ${errorText}`)
      }
      
      const result = await response.json()
      console.log('✅ Google Apps Script 업로드 성공:', result)
      
      return {
        success: true,
        fileId: result.fileId,
        fileName: result.fileName,
        webViewLink: `https://drive.google.com/file/d/${result.fileId}/view`,
        message: `파일이 Google Drive에 성공적으로 업로드되었습니다.`
      }
      
    } catch (error) {
      console.error('❌ Google Apps Script 업로드 실패:', error)
      return {
        success: false,
        error: error.message,
        message: `Google Drive 업로드 실패: ${error.message}`
      }
    }
  }
}

// 싱글톤 인스턴스 생성
const googleAppsScriptService = new GoogleAppsScriptService()

export default googleAppsScriptService
