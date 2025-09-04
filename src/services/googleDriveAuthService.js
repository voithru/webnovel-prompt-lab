/**
 * Google Drive OAuth2 인증 서비스
 * Google Drive API 접근을 위한 OAuth2 인증 처리
 */

class GoogleDriveAuthService {
  constructor() {
    // Google OAuth2 설정 (환경변수에서 가져오거나 직접 설정)
    this.clientId = import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID || 'YOUR_GOOGLE_DRIVE_CLIENT_ID'
    this.clientSecret = import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_SECRET || 'YOUR_GOOGLE_DRIVE_CLIENT_SECRET'
    this.redirectUri = `${window.location.origin}/auth/callback`
    this.scope = 'https://www.googleapis.com/auth/drive.file' // 파일 생성/업로드 권한
    
    // OAuth2 엔드포인트
    this.authUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    this.tokenUrl = 'https://oauth2.googleapis.com/token'
    
    console.log('GoogleDriveAuthService 초기화:', {
      clientId: this.clientId ? '설정됨' : '설정안됨',
      redirectUri: this.redirectUri,
      scope: this.scope
    })
  }

  /**
   * Google OAuth2 인증 URL 생성
   * @returns {string} 인증 URL
   */
  getAuthUrl() {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: this.scope,
      access_type: 'offline', // refresh token 받기 위해
      prompt: 'consent' // 매번 동의 화면 표시
    })
    
    return `${this.authUrl}?${params.toString()}`
  }

  /**
   * 인증 코드를 액세스 토큰으로 교환
   * @param {string} authCode - 인증 코드
   * @returns {Promise<Object>} 토큰 정보
   */
  async exchangeCodeForTokens(authCode) {
    try {
      console.log('🔑 인증 코드를 액세스 토큰으로 교환 시작')
      
      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: authCode,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`토큰 교환 실패: ${response.status} - ${errorText}`)
      }

      const tokens = await response.json()
      console.log('✅ 토큰 교환 성공')
      
      // 토큰을 localStorage에 저장
      this.saveTokens(tokens)
      
      return {
        success: true,
        tokens
      }
      
    } catch (error) {
      console.error('❌ 토큰 교환 실패:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 토큰을 localStorage에 저장
   * @param {Object} tokens - 토큰 정보
   */
  saveTokens(tokens) {
    const tokenData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      token_type: tokens.token_type,
      scope: tokens.scope,
      expires_at: Date.now() + (tokens.expires_in * 1000) // 만료 시간 계산
    }
    
    localStorage.setItem('google_drive_tokens', JSON.stringify(tokenData))
    console.log('💾 Google Drive 토큰 저장 완료')
  }

  /**
   * 저장된 토큰 가져오기
   * @returns {Object|null} 토큰 정보
   */
  getStoredTokens() {
    const tokenData = localStorage.getItem('google_drive_tokens')
    if (!tokenData) {
      return null
    }
    
    try {
      return JSON.parse(tokenData)
    } catch (error) {
      console.error('토큰 파싱 오류:', error)
      return null
    }
  }

  /**
   * 액세스 토큰이 유효한지 확인
   * @returns {boolean} 유효성 여부
   */
  isTokenValid() {
    const tokens = this.getStoredTokens()
    if (!tokens) {
      return false
    }
    
    // 만료 시간 확인 (여유시간 5분)
    const isExpired = Date.now() > (tokens.expires_at - 300000)
    return !isExpired
  }

  /**
   * 리프레시 토큰으로 액세스 토큰 갱신
   * @returns {Promise<Object>} 갱신 결과
   */
  async refreshAccessToken() {
    try {
      const tokens = this.getStoredTokens()
      if (!tokens || !tokens.refresh_token) {
        throw new Error('리프레시 토큰이 없습니다')
      }

      console.log('🔄 액세스 토큰 갱신 시작')

      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: tokens.refresh_token,
          grant_type: 'refresh_token'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`토큰 갱신 실패: ${response.status} - ${errorText}`)
      }

      const newTokens = await response.json()
      
      // 기존 리프레시 토큰 유지 (새로 발급되지 않을 수 있음)
      if (!newTokens.refresh_token) {
        newTokens.refresh_token = tokens.refresh_token
      }
      
      this.saveTokens(newTokens)
      console.log('✅ 액세스 토큰 갱신 완료')
      
      return {
        success: true,
        tokens: newTokens
      }
      
    } catch (error) {
      console.error('❌ 토큰 갱신 실패:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 유효한 액세스 토큰 가져오기 (필요시 자동 갱신)
   * @returns {Promise<string|null>} 액세스 토큰
   */
  async getValidAccessToken() {
    if (this.isTokenValid()) {
      const tokens = this.getStoredTokens()
      return tokens.access_token
    }
    
    // 토큰이 만료된 경우 갱신 시도
    const refreshResult = await this.refreshAccessToken()
    if (refreshResult.success) {
      return refreshResult.tokens.access_token
    }
    
    return null
  }

  /**
   * Google Drive 인증 시작
   */
  startAuth() {
    // 기존 토큰 정리 (새로운 인증을 위해)
    this.logout()
    
    console.log('🚀 Google Drive 인증 시작')
    const authUrl = this.getAuthUrl()
    window.location.href = authUrl
  }

  /**
   * 인증 상태 확인
   * @returns {boolean} 인증 여부
   */
  isAuthenticated() {
    return this.isTokenValid()
  }

  /**
   * 로그아웃 (토큰 삭제)
   */
  logout() {
    localStorage.removeItem('google_drive_tokens')
    console.log('🚪 Google Drive 로그아웃 완료')
  }
}

// 싱글톤 인스턴스 생성
const googleDriveAuthService = new GoogleDriveAuthService()

export default googleDriveAuthService
