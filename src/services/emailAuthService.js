/**
 * 이메일 기반 인증 서비스
 * Google Sheets의 user_auth 시트에서 등록된 이메일을 확인하여 로그인 처리
 */

// Google Sheets API 설정
const SPREADSHEET_ID = '1oAE0bz_-HYCwmp7ve5tu0z3m7g0mRTNWG2XuJVxy1qU'
const API_KEY = 'AIzaSyDQQhafsQHZIOkPdSnneRV_u3QuT3lHFBs'
const USER_AUTH_SHEET = 'user_auth'

class EmailAuthService {
  constructor() {
    console.log('EmailAuthService 초기화')
  }

  /**
   * Google Sheets에서 등록된 사용자 목록을 가져옵니다
   */
  async getRegisteredUsers() {
    try {
      console.log('📋 등록된 사용자 목록 조회 시작')
      
      const range = `${USER_AUTH_SHEET}!A1:D1000` // A~D 컬럼, 최대 1000행
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`
      
      console.log('🌐 Google Sheets API 호출:', url)
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Google Sheets API 오류: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('📊 API 응답 데이터:', data)
      
      if (!data.values || data.values.length === 0) {
        console.log('⚠️ 등록된 사용자가 없습니다')
        return []
      }
      
      // 첫 번째 행은 헤더이므로 제외
      const headers = data.values[0]
      const rows = data.values.slice(1)
      
      console.log('📋 헤더:', headers)
      console.log('📊 데이터 행 수:', rows.length)
      
      // 사용자 데이터 파싱
      const users = rows
        .filter(row => row.length >= 2 && row[1]) // B열(user_name)이 있는 행만
        .map((row, index) => ({
          id: row[0] || (index + 1), // A열 또는 자동 ID
          email: row[1] || '', // B열: user_name (이메일)
          source_language: row[2] || '', // C열: source_language
          target_language: row[3] || '', // D열: target_language
          rowIndex: index + 2 // 실제 시트의 행 번호 (헤더 + 0-based index)
        }))
      
      console.log('✅ 파싱된 사용자 목록:', users)
      return users
      
    } catch (error) {
      console.error('❌ 등록된 사용자 조회 실패:', error)
      throw error
    }
  }

  /**
   * 이메일이 등록된 사용자인지 확인합니다
   * @param {string} email - 확인할 이메일 주소
   * @returns {Promise<Object|null>} 사용자 정보 또는 null
   */
  async validateUser(email) {
    try {
      console.log('🔍 사용자 인증 시작:', email)
      
      if (!email || !email.trim()) {
        throw new Error('이메일을 입력해주세요')
      }
      
      // 이메일 형식 기본 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('올바른 이메일 형식을 입력해주세요')
      }
      
      const registeredUsers = await this.getRegisteredUsers()
      
      // 대소문자 구분 없이 이메일 비교
      const normalizedEmail = email.toLowerCase().trim()
      
      // 한 이메일의 모든 언어 페어 찾기
      const userLanguagePairs = registeredUsers.filter(u => 
        u.email.toLowerCase().trim() === normalizedEmail
      )
      
      const user = userLanguagePairs[0] // 기본 사용자 정보
      
      if (user && userLanguagePairs.length > 0) {
        console.log('✅ 등록된 사용자 발견:', user)
        console.log(`🌍 언어 페어 ${userLanguagePairs.length}개 발견:`, 
          userLanguagePairs.map(u => `${u.source_language} → ${u.target_language}`)
        )
        
        return {
          ...user,
          email: normalizedEmail,
          isAuthenticated: true,
          loginTime: new Date().toISOString(),
          // 모든 언어 페어 정보 추가
          languagePairs: userLanguagePairs.map(u => ({
            source_language: u.source_language,
            target_language: u.target_language
          }))
        }
      } else {
        console.log('❌ 등록되지 않은 사용자:', normalizedEmail)
        console.log('📋 등록된 이메일 목록:', registeredUsers.map(u => u.email))
        return null
      }
      
    } catch (error) {
      console.error('❌ 사용자 인증 실패:', error)
      throw error
    }
  }

  /**
   * 이메일 검증만 수행 (API Key 없이)
   * @param {string} email - 사용자 이메일
   * @returns {Promise<Object|null>} 검증된 사용자 정보 또는 null
   */
  async validateUser(email) {
    try {
      if (!email) {
        return null
      }
      
      console.log('🔍 이메일 검증 시작:', email)
      
      const registeredUsers = await this.getRegisteredUsers()
      const normalizedEmail = email.toLowerCase().trim()
      
      // 등록된 사용자 중에서 해당 이메일 찾기
      const matchingUsers = registeredUsers.filter(u => 
        u.email.toLowerCase().trim() === normalizedEmail
      )
      
      if (matchingUsers.length === 0) {
        console.log('❌ 등록되지 않은 사용자:', normalizedEmail)
        return null
      }
      
      // 언어 페어 정보 수집
      const userLanguagePairs = matchingUsers.map(u => ({
        source_language: u.source_language,
        target_language: u.target_language
      }))
      
      console.log('✅ 이메일 검증 성공:', normalizedEmail, '언어 페어:', userLanguagePairs)
      
      return {
        email: normalizedEmail,
        source_language: matchingUsers[0].source_language,
        target_language: matchingUsers[0].target_language,
        languagePairs: userLanguagePairs,
        validatedAt: new Date().toISOString()
      }
      
    } catch (error) {
      console.error('❌ 이메일 검증 실패:', error)
      return null
    }
  }

  /**
   * 사용자 로그인 처리
   * @param {string} email - 로그인할 이메일
   * @returns {Promise<Object>} 로그인 결과
   */
  async login(email) {
    try {
      console.log('🔐 이메일 로그인 시도:', email)
      
      const user = await this.validateUser(email)
      
      if (!user) {
        throw new Error('등록되지 않은 이메일입니다. 관리자에게 문의해주세요.')
      }
      
      // 로컬 스토리지에 사용자 정보 저장
      const userSession = {
        ...user,
        sessionId: `session_${Date.now()}`,
        loginTime: new Date().toISOString()
      }
      
      localStorage.setItem('user_session', JSON.stringify(userSession))
      localStorage.setItem('user_email', user.email)
      localStorage.setItem('is_authenticated', 'true')
      
      console.log('✅ 로그인 성공:', userSession)
      
      return {
        success: true,
        user: userSession,
        message: '로그인에 성공했습니다'
      }
      
    } catch (error) {
      console.error('❌ 로그인 실패:', error)
      return {
        success: false,
        error: error.message,
        user: null
      }
    }
  }

  /**
   * 사용자 로그아웃 처리
   */
  async logout() {
    try {
      console.log('🚪 로그아웃 처리')
      
      // 로컬 스토리지에서 사용자 정보 제거
      localStorage.removeItem('user_session')
      localStorage.removeItem('user_email')
      localStorage.removeItem('is_authenticated')
      
      console.log('✅ 로그아웃 완료')
      
      return {
        success: true,
        message: '로그아웃되었습니다'
      }
      
    } catch (error) {
      console.error('❌ 로그아웃 실패:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 현재 로그인된 사용자 정보 확인
   */
  getCurrentUser() {
    try {
      const userSession = localStorage.getItem('user_session')
      const isAuthenticated = localStorage.getItem('is_authenticated') === 'true'
      
      if (!userSession || !isAuthenticated) {
        return null
      }
      
      const user = JSON.parse(userSession)
      // 과도한 로깅 제거 - 디버깅 필요시에만 활성화
      // console.log('👤 현재 사용자:', user)
      
      return user
      
    } catch (error) {
      console.error('❌ 현재 사용자 확인 실패:', error)
      return null
    }
  }

  /**
   * 인증 상태 확인
   */
  isAuthenticated() {
    const user = this.getCurrentUser()
    return !!user
  }

  /**
   * 사용자 정보를 실시간으로 재검증합니다
   * PM이 user_auth 시트를 수정한 경우 즉시 반영
   */
  async refreshUserInfo() {
    try {
      const currentUser = this.getCurrentUser()
      
      if (!currentUser || !currentUser.email) {
        console.log('🔄 로그인된 사용자가 없어 새로고침을 건너뛴니다')
        return { success: false, reason: 'no_user' }
      }
      
      console.log('🔄 사용자 정보 실시간 재검증 시작:', currentUser.email)
      
      // 최신 사용자 데이터를 서버에서 가져오기
      const updatedUser = await this.validateUser(currentUser.email)
      
      if (!updatedUser) {
        console.log('❌ 사용자가 user_auth 시트에서 제거되었거나 비활성화되었습니다')
        
        // 로그아웃 처리
        await this.logout()
        
        return {
          success: false,
          reason: 'user_removed',
          message: '계정이 비활성화되었습니다. 다시 로그인해주세요.'
        }
      }
      
      // 언어 페어가 변경되었는지 확인
      const languageChanged = (
        currentUser.source_language !== updatedUser.source_language ||
        currentUser.target_language !== updatedUser.target_language
      )
      
      if (languageChanged) {
        console.log('🌍 언어 페어 변경 감지:')
        console.log('  - 이전:', `${currentUser.source_language} → ${currentUser.target_language}`)
        console.log('  - 변경:', `${updatedUser.source_language} → ${updatedUser.target_language}`)
      }
      
      // 로컬 스토리지에 업데이트된 사용자 정보 저장
      const updatedUserSession = {
        ...updatedUser,
        sessionId: currentUser.sessionId,
        loginTime: currentUser.loginTime,
        lastRefresh: new Date().toISOString()
      }
      
      localStorage.setItem('user_session', JSON.stringify(updatedUserSession))
      
      console.log('✅ 사용자 정보 실시간 업데이트 완료')
      
      return {
        success: true,
        user: updatedUserSession,
        languageChanged,
        changes: {
          source_language: {
            old: currentUser.source_language,
            new: updatedUser.source_language
          },
          target_language: {
            old: currentUser.target_language,
            new: updatedUser.target_language
          }
        }
      }
      
    } catch (error) {
      console.error('❌ 사용자 정보 실시간 업데이트 실패:', error)
      return {
        success: false,
        reason: 'refresh_error',
        error: error.message
      }
    }
  }

  /**
   * 사용자 권한 변경 사항을 실시간으로 감지합니다
   */
  async checkUserPermissions() {
    const refreshResult = await this.refreshUserInfo()
    
    if (!refreshResult.success) {
      return refreshResult
    }
    
    // 언어 페어가 변경된 경우 추가 처리
    if (refreshResult.languageChanged) {
      return {
        ...refreshResult,
        requiresTaskRefresh: true,
        message: '담당 언어 페어가 변경되었습니다. 과제 목록을 업데이트합니다.'
      }
    }
    
    return refreshResult
  }
}

// 싱글톤 인스턴스 생성
const emailAuthService = new EmailAuthService()

export default emailAuthService
