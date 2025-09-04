/**
 * Gemini API Key 자동 등록 서비스
 * 사용자별로 최초 1회만 API Key를 Google Sheets에 등록
 */

// Google Sheets API 설정
const SPREADSHEET_ID = '1oAE0bz_-HYCwmp7ve5tu0z3m7g0mRTNWG2XuJVxy1qU'
const API_KEY = 'AIzaSyDQQhafsQHZIOkPdSnneRV_u3QuT3lHFBs'
const USER_KEY_SHEET = 'user_key'

class ApiKeyService {
  constructor() {
    console.log('ApiKeyService 초기화')
  }

  /**
   * Google Sheets에서 기존 사용자 API Key 목록 확인
   */
  async getExistingUserKeys() {
    try {
      console.log('📋 기존 사용자 API Key 목록 조회 시작')
      console.log('📋 시트 설정:', {
        spreadsheetId: SPREADSHEET_ID,
        sheetName: USER_KEY_SHEET,
        apiKey: API_KEY ? '설정됨' : '설정안됨'
      })
      
      const range = `${USER_KEY_SHEET}!A1:C1000` // A~C 컬럼, 최대 1000행
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`
      
      console.log('🌐 Google Sheets API 호출:', url)
      
      const response = await fetch(url)
      
      if (!response.ok) {
        console.error('❌ Google Sheets API 오류:', {
          status: response.status,
          statusText: response.statusText,
          url: url
        })
        throw new Error(`Google Sheets API 오류: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('📊 API 응답 데이터:', data)
      
      if (!data.values || data.values.length === 0) {
        console.log('⚠️ 등록된 사용자 API Key가 없습니다')
        return []
      }
      
      // 첫 번째 행은 헤더이므로 제외
      const headers = data.values[0]
      const rows = data.values.slice(1)
      
      console.log('📋 헤더:', headers)
      console.log('📊 데이터 행 수:', rows.length)
      
      // 사용자 API Key 데이터 파싱
      const userKeys = rows
        .filter(row => row.length >= 2 && row[1]) // B열(user_name)이 있는 행만
        .map((row, index) => ({
          id: row[0] || '', // A열: id (비워둘 수 있음)
          email: row[1] || '', // B열: user_name (이메일)
          apiKey: row[2] || '', // C열: api_key
          rowIndex: index + 2 // 실제 시트의 행 번호 (헤더 + 0-based index)
        }))
      
      console.log('✅ 파싱된 사용자 API Key 목록:', userKeys.length, '개')
      return userKeys
      
    } catch (error) {
      console.error('❌ 기존 사용자 API Key 조회 실패:', error)
      return []
    }
  }

  /**
   * 특정 사용자의 API Key가 이미 등록되어 있는지 확인
   * @param {string} email - 사용자 이메일
   * @returns {Promise<boolean>} 등록 여부
   */
  async isUserApiKeyRegistered(email) {
    try {
      if (!email) {
        return false
      }
      
      const existingKeys = await this.getExistingUserKeys()
      const normalizedEmail = email.toLowerCase().trim()
      
      const isRegistered = existingKeys.some(user => 
        user.email.toLowerCase().trim() === normalizedEmail
      )
      
      console.log(`🔍 사용자 ${email} API Key 등록 여부:`, isRegistered)
      return isRegistered
      
    } catch (error) {
      console.error('❌ 사용자 API Key 등록 여부 확인 실패:', error)
      return false
    }
  }

  /**
   * 사용자의 Gemini API Key를 생성합니다
   * @param {string} email - 사용자 이메일
   * @returns {string} 생성된 API Key
   */
  generateGeminiApiKey(email) {
    // 실제 환경에서는 보안이 강화된 API Key 생성 로직 사용
    // 현재는 데모용으로 간단한 형태로 생성
    const timestamp = Date.now()
    const emailHash = btoa(email).replace(/[+/=]/g, '').substring(0, 8)
    const randomSuffix = Math.random().toString(36).substring(2, 10)
    
    const apiKey = `AIzaSy${emailHash}${randomSuffix}${timestamp.toString(36)}`
    
    console.log(`🔑 ${email}용 Gemini API Key 생성:`, apiKey.substring(0, 20) + '...')
    return apiKey
  }

  /**
   * n8n 웹훅을 통해 사용자 API Key를 Google Sheets에 등록
   * @param {string} email - 사용자 이메일
   * @param {string} apiKey - Gemini API Key
   * @returns {Promise<Object>} 등록 결과
   */
  async registerUserApiKey(email, apiKey) {
    try {
      console.log('📤 사용자 API Key 등록 시작:', email)
      
      // n8n 웹훅 URL (API Key 등록용)
      const WEBHOOK_URL = 'https://dev.n8n.voithrucorp.com/webhook/api-key-registration' // 실제 웹훅 URL로 변경 필요
      
      const registrationData = {
        // A열: id는 비워둠 (Google Sheets에서 자동 생성)
        user_name: email, // B열: 사용자 이메일
        api_key: apiKey, // C열: Gemini API Key
        registered_at: new Date().toISOString(),
        sheet_type: 'user_key'
      }
      
      console.log('📋 등록 데이터:', registrationData)
      
      // 개발 단계에서는 실제 웹훅 호출 대신 로그만 출력
      console.log('📤 API Key 등록 데이터 (n8n 웹훅으로 전송 예정):')
      console.log('- 사용자 이메일:', registrationData.user_name)
      console.log('- API Key:', registrationData.api_key.substring(0, 20) + '...')
      console.log('- 등록 시간:', registrationData.registered_at)
      
      // TODO: 실제 배포 시 아래 코드 주석 해제
      /*
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
      })
      
      if (!response.ok) {
        throw new Error(`웹훅 전송 실패: ${response.status} ${response.statusText}`)
      }
      
      const result = await response.json()
      console.log('✅ API Key 등록 성공:', result)
      */
      
      // 개발 단계에서는 성공 응답 시뮤레이션
      const result = { message: 'API Key registered successfully (dev mode)' }
      console.log('✅ API Key 등록 성공 (개발 모드):', result)
      
      return {
        success: true,
        message: 'API Key가 성공적으로 등록되었습니다',
        data: registrationData
      }
      
    } catch (error) {
      console.error('❌ API Key 등록 실패:', error)
      
      return {
        success: false,
        error: error.message,
        message: 'API Key 등록 중 오류가 발생했습니다'
      }
    }
  }

  /**
   * 사용자 로그인 시 API Key 자동 등록 처리
   * @param {Object} user - 사용자 정보
   * @returns {Promise<string>} 사용자의 API Key
   */
  async handleUserApiKey(user) {
    try {
      if (!user || !user.email) {
        console.warn('⚠️ 사용자 정보가 없어 API Key 처리를 건너뜁니다')
        return null
      }
      
      console.log('🔑 사용자 API Key 처리 시작:', user.email)
      
      // 1. 기존 등록 여부 확인
      const isRegistered = await this.isUserApiKeyRegistered(user.email)
      
      if (isRegistered) {
        console.log('✅ 이미 등록된 사용자 - API Key 등록 건너뜀')
        // 기존 사용자의 경우 API Key를 새로 생성하지 않고 기존 것 사용
        return 'existing_api_key'
      }
      
      // 2. 새 사용자의 경우 API Key 생성 및 등록
      console.log('🆕 신규 사용자 - API Key 생성 및 등록 시작')
      
      const newApiKey = this.generateGeminiApiKey(user.email)
      const registrationResult = await this.registerUserApiKey(user.email, newApiKey)
      
      if (registrationResult.success) {
        console.log('✅ 신규 사용자 API Key 등록 완료')
        return newApiKey
      } else {
        console.error('❌ API Key 등록 실패:', registrationResult.error)
        return null
      }
      
    } catch (error) {
      console.error('❌ 사용자 API Key 처리 중 오류:', error)
      return null
    }
  }

  /**
   * 사용자의 API Key 조회
   * @param {string} email - 사용자 이메일
   * @returns {Promise<string|null>} 사용자의 API Key 또는 null
   */
  async getUserApiKey(email) {
    try {
      if (!email) {
        console.log('⚠️ 이메일이 제공되지 않음')
        return null
      }
      
      console.log('🔍 사용자 API Key 조회 시작:', email)
      
      const existingKeys = await this.getExistingUserKeys()
      console.log('📊 조회된 사용자 키 수:', existingKeys.length)
      
      const normalizedEmail = email.toLowerCase().trim()
      console.log('🔍 정규화된 이메일:', normalizedEmail)
      
      const userKey = existingKeys.find(user => 
        user.email.toLowerCase().trim() === normalizedEmail
      )
      
      if (userKey && userKey.apiKey) {
        console.log('✅ 사용자 API Key 발견:', email, '키 길이:', userKey.apiKey.length)
        return userKey.apiKey
      } else {
        console.log('⚠️ 사용자 API Key 없음:', email)
        console.log('📋 등록된 사용자 목록:', existingKeys.map(u => u.email))
        return null
      }
      
    } catch (error) {
      console.error('❌ 사용자 API Key 조회 실패:', error)
      console.error('❌ 오류 상세:', {
        message: error.message,
        stack: error.stack,
        email: email
      })
      return null
    }
  }

  /**
   * 사용자 통계 정보 조회
   * @returns {Promise<Object>} 통계 정보
   */
  async getUserKeyStats() {
    try {
      const userKeys = await this.getExistingUserKeys()
      
      return {
        totalUsers: userKeys.length,
        registeredEmails: userKeys.map(user => user.email),
        lastUpdated: new Date().toISOString()
      }
      
    } catch (error) {
      console.error('❌ 사용자 API Key 통계 조회 실패:', error)
      return {
        totalUsers: 0,
        registeredEmails: [],
        lastUpdated: new Date().toISOString()
      }
    }
  }
}

// 싱글톤 인스턴스 생성
const apiKeyService = new ApiKeyService()

// 싱글톤 인스턴스 반환 함수
export const getApiKeyService = () => apiKeyService

export default apiKeyService
