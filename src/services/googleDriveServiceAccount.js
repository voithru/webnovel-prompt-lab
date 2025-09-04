/**
 * Google Drive Service Account 기반 업로드 서비스
 * 사용자 인증 없이 서비스 계정으로 중앙 집중 업로드
 */

class GoogleDriveServiceAccount {
  constructor() {
    // 서비스 계정 설정
    this.serviceAccount = {
      type: "service_account",
      project_id: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_PROJECT_ID,
      private_key_id: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
      private_key: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      client_id: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL)}`
    }
    
    this.folderId = '1Gm9_tB649B-OfofFcUPCcXqAvXbUdbQG' // 대상 폴더 ID
    this.apiBaseUrl = 'https://www.googleapis.com/drive/v3'
    this.uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files'
    this.scope = 'https://www.googleapis.com/auth/drive.file'
    
    console.log('🔧 Google Drive Service Account 초기화:', {
      projectId: this.serviceAccount.project_id || '설정안됨',
      clientEmail: this.serviceAccount.client_email || '설정안됨',
      folderId: this.folderId
    })
  }

  /**
   * JWT 토큰 생성 (서비스 계정 인증용)
   * @returns {string} JWT 토큰
   */
  async generateJWT() {
    try {
      const header = {
        alg: 'RS256',
        typ: 'JWT'
      }

      const now = Math.floor(Date.now() / 1000)
      const payload = {
        iss: this.serviceAccount.client_email,
        scope: this.scope,
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600, // 1시간 후 만료
        iat: now
      }

      // JWT 생성을 위한 간단한 구현
      const base64UrlEncode = (obj) => {
        return btoa(JSON.stringify(obj))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '')
      }

      const headerEncoded = base64UrlEncode(header)
      const payloadEncoded = base64UrlEncode(payload)
      const signatureInput = `${headerEncoded}.${payloadEncoded}`

      // 실제 운영에서는 crypto 라이브러리 사용 필요
      // 여기서는 Google Apps Script API를 통한 우회 방법 사용
      console.log('🔑 JWT 토큰 생성 중...')
      
      return `${signatureInput}.signature-placeholder`
    } catch (error) {
      console.error('❌ JWT 토큰 생성 실패:', error)
      throw error
    }
  }

  /**
   * 서비스 계정으로 액세스 토큰 획득
   * @returns {Promise<string>} 액세스 토큰
   */
  async getAccessToken() {
    try {
      console.log('🔐 서비스 계정 액세스 토큰 요청 중...')
      
      // Google Apps Script 기반 토큰 서버 사용 (보안상 권장)
      const tokenServerUrl = import.meta.env.VITE_GOOGLE_TOKEN_SERVER_URL
      
      if (!tokenServerUrl) {
        throw new Error('토큰 서버 URL이 설정되지 않았습니다.')
      }

      const response = await fetch(tokenServerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_account: this.serviceAccount,
          scope: this.scope
        })
      })

      if (!response.ok) {
        throw new Error(`토큰 서버 오류: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ 서비스 계정 액세스 토큰 획득 성공')
      
      return data.access_token
    } catch (error) {
      console.error('❌ 서비스 계정 토큰 획득 실패:', error)
      throw error
    }
  }

  /**
   * JSON 데이터를 Google Drive에 업로드 (서비스 계정 사용)
   * @param {Object} jsonData - 업로드할 JSON 데이터
   * @param {string} fileName - 파일명
   * @returns {Promise<Object>} 업로드 결과
   */
  async uploadJsonFile(jsonData, fileName) {
    try {
      console.log('🚀 Google Drive 서비스 계정 업로드 시작:', fileName)
      
      // 서비스 계정으로 액세스 토큰 획득
      const accessToken = await this.getAccessToken()
      
      // JSON 데이터를 Blob으로 변환
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
      
      // Google Drive API 호출 (서비스 계정 액세스 토큰 사용)
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
        throw new Error(`Google Drive API 에러: ${response.status} - ${errorText}`)
      }
      
      const result = await response.json()
      console.log('✅ Google Drive 서비스 계정 업로드 성공:', result)
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
        message: `파일이 Google Drive에 성공적으로 업로드되었습니다. (서비스 계정 사용)`
      }
      
    } catch (error) {
      console.error('❌ Google Drive 서비스 계정 업로드 실패:', error)
      return {
        success: false,
        error: error.message,
        message: `Google Drive 업로드 실패: ${error.message}`
      }
    }
  }
}

// 싱글톤 인스턴스 생성
const googleDriveServiceAccount = new GoogleDriveServiceAccount()

export default googleDriveServiceAccount
