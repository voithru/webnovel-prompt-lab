/**
 * Google Drive API 서비스 (OAuth2 인증 사용)
 * JSON 파일을 Google Drive 폴더에 업로드
 */

import googleDriveAuthService from './googleDriveAuthService.js'

class GoogleDriveService {
  constructor() {
    // 원래 지정된 폴더에 업로드
    this.folderId = '1Gm9_tB649B-OfofFcUPCcXqAvXbUdbQG' // 원래 폴더 ID
    this.apiBaseUrl = 'https://www.googleapis.com/drive/v3'
    this.uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files'
  }

  /**
   * JSON 데이터를 Google Drive 폴더에 업로드 (OAuth2 인증 사용)
   * @param {Object} jsonData - 업로드할 JSON 데이터
   * @param {string} fileName - 파일명
   * @returns {Promise<Object>} 업로드 결과
   */
  async uploadJsonFile(jsonData, fileName) {
    try {
      console.log('🚀 Google Drive OAuth2 업로드 시작:', fileName)
      
      // 인증 상태 확인
      if (!googleDriveAuthService.isAuthenticated()) {
        console.log('❌ Google Drive 인증이 필요합니다')
        return {
          success: false,
          error: 'Authentication required',
          message: 'Google Drive 인증이 필요합니다. 인증 후 다시 시도해주세요.',
          needsAuth: true
        }
      }
      
      // 유효한 액세스 토큰 가져오기
      const accessToken = await googleDriveAuthService.getValidAccessToken()
      if (!accessToken) {
        console.log('❌ 유효한 액세스 토큰을 가져올 수 없습니다')
        return {
          success: false,
          error: 'Invalid access token',
          message: 'Google Drive 인증이 만료되었습니다. 다시 인증해주세요.',
          needsAuth: true
        }
      }
      
      // JSON 데이터를 문자열로 변환
      const jsonString = JSON.stringify(jsonData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      
      // FormData 생성
      const formData = new FormData()
      
      // 메타데이터 설정
      const metadata = {
        name: fileName,
        parents: [this.folderId], // 지정된 폴더에 업로드
        mimeType: 'application/json'
      }
      
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
      formData.append('file', blob)
      
      // Google Drive API 호출 (OAuth2 액세스 토큰 사용)
      const response = await fetch(`${this.uploadUrl}?uploadType=multipart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Google Drive API 에러:', response.status, errorText)
        
        // 인증 오류인 경우
        if (response.status === 401) {
          return {
            success: false,
            error: 'Authentication expired',
            message: 'Google Drive 인증이 만료되었습니다. 다시 인증해주세요.',
            needsAuth: true
          }
        }
        
        throw new Error(`Google Drive API 에러: ${response.status} - ${errorText}`)
      }
      
      const result = await response.json()
      console.log('✅ Google Drive OAuth2 업로드 성공:', result)
      console.log('📋 업로드된 파일 상세 정보:')
      console.log('  - 파일 ID:', result.id)
      console.log('  - 파일명:', result.name)
      console.log('  - 부모 폴더:', result.parents)
      console.log('  - 생성 시간:', result.createdTime)
      console.log('  - MIME 타입:', result.mimeType)
      console.log('  - 웹 링크:', `https://drive.google.com/file/d/${result.id}/view`)
      
      return {
        success: true,
        fileId: result.id,
        fileName: result.name,
        webViewLink: `https://drive.google.com/file/d/${result.id}/view`,
        parentFolders: result.parents,
        createdTime: result.createdTime,
        message: `파일이 Google Drive에 성공적으로 업로드되었습니다.`
      }
      
    } catch (error) {
      console.error('❌ Google Drive 업로드 실패:', error)
      return {
        success: false,
        error: error.message,
        message: `Google Drive 업로드 실패: ${error.message}`
      }
    }
  }

  /**
   * 폴더 정보 확인 (디버깅용)
   * @returns {Promise<Object>} 폴더 정보
   */
  async getFolderInfo() {
    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${this.folderId}?key=${this.apiKey}`)
      
      if (!response.ok) {
        throw new Error(`API 에러: ${response.status}`)
      }
      
      const folderInfo = await response.json()
      console.log('📁 폴더 정보:', folderInfo)
      
      return {
        success: true,
        folderInfo
      }
      
    } catch (error) {
      console.error('❌ 폴더 정보 조회 실패:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// 싱글톤 인스턴스 생성
const googleDriveService = new GoogleDriveService()

export default googleDriveService
