/**
 * 사용자 정보 수집 서비스
 * 구글 로그인한 사용자의 정보를 별도 시트에 저장
 */
import { apiLog, authLog, devError, devLog, userError } from '../utils/logger'

// 사용자 정보 수집용 웹훅 URL (user_auth 시트용)
const USER_COLLECTION_WEBHOOK_URL = 'https://dev.n8n.voithrucorp.com/webhook/736cf47e-dab7-4411-b631-bfdff40e6de9'

/**
 * 사용자 정보를 user_auth 시트에 저장
 * @param {Object} userInfo - 사용자 정보
 * @param {string} userInfo.id - 구글 사용자 ID
 * @param {string} userInfo.name - 사용자 이름
 * @param {string} userInfo.email - 이메일 주소
 * @param {string} userInfo.picture - 프로필 사진 URL
 * @param {string} apiKey - 생성된 API 키
 */
export const collectUserInfo = async (userInfo, apiKey = null) => {
  try {
    authLog('사용자 정보 수집 시작', { name: userInfo.name, email: userInfo.email })

    // API 키 생성 (없으면 랜덤 생성)
    const generatedApiKey = apiKey || generateApiKey()

    // user_auth 시트 구조에 맞춘 데이터
    const userData = {
      // 시트 식별자 (user_auth 시트임을 명시)
      sheet_type: 'user_auth',
      
      // user_auth 시트 컬럼 구조
      id: userInfo.id || generateUserId(),
      user_name: userInfo.name || userInfo.email?.split('@')[0] || 'Unknown User',
      api_key: generatedApiKey,
      
      // 추가 메타데이터 (필요시 사용)
      email: userInfo.email,
      picture: userInfo.picture,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString()
    }

    apiLog('사용자 정보 전송', { user_name: userData.user_name, email: userData.email }, 'request')

    // n8n 웹훅으로 사용자 정보 전송
    const response = await fetch(USER_COLLECTION_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })

    if (!response.ok) {
      throw new Error(`사용자 정보 전송 실패: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    authLog('사용자 정보 수집 완료', { success: true, user_name: userData.user_name })

    // 로컬 스토리지에 API 키 저장 (재사용을 위해)
    localStorage.setItem(`user_api_key_${userInfo.id}`, generatedApiKey)
    localStorage.setItem('current_user_api_key', generatedApiKey)

    return {
      success: true,
      apiKey: generatedApiKey,
      userData: userData
    }

  } catch (error) {
    devError('사용자 정보 수집 실패:', error)
    userError('사용자 정보 저장 중 오류가 발생했습니다.')
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 사용자별 API 키 조회
 * @param {string} userId - 구글 사용자 ID
 * @returns {string|null} API 키
 */
export const getUserApiKey = (userId) => {
  if (!userId) return null
  
  // 로컬 스토리지에서 API 키 조회
  const apiKey = localStorage.getItem(`user_api_key_${userId}`)
  return apiKey
}

/**
 * 현재 사용자의 API 키 조회
 * @returns {string|null} API 키
 */
export const getCurrentUserApiKey = () => {
  return localStorage.getItem('current_user_api_key')
}

/**
 * API 키 생성 (랜덤)
 * @returns {string} 생성된 API 키
 */
const generateApiKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `key_${result}`
}

/**
 * 사용자 ID 생성 (구글 ID가 없는 경우)
 * @returns {number} 생성된 사용자 ID
 */
const generateUserId = () => {
  return Date.now() // 타임스탬프 기반 ID
}

/**
 * 로그인 시 사용자 정보 자동 수집
 * @param {Object} userInfo - 구글 로그인 사용자 정보
 */
export const handleUserLogin = async (userInfo) => {
  try {
    // 기존 API 키 확인
    let existingApiKey = getUserApiKey(userInfo.id)
    
    if (!existingApiKey) {
      // 새 사용자 - 정보 수집 및 API 키 생성
      console.log('🆕 새 사용자 감지 - 정보 수집 시작')
      const result = await collectUserInfo(userInfo)
      
      if (result.success) {
        console.log('✅ 새 사용자 정보 수집 완료')
        return result.apiKey
      } else {
        console.warn('⚠️ 사용자 정보 수집 실패, 임시 API 키 생성')
        existingApiKey = generateApiKey()
        localStorage.setItem(`user_api_key_${userInfo.id}`, existingApiKey)
        localStorage.setItem('current_user_api_key', existingApiKey)
      }
    } else {
      // 기존 사용자 - 마지막 로그인 시간 업데이트
      console.log('👋 기존 사용자 로그인 - API 키 재사용')
      localStorage.setItem('current_user_api_key', existingApiKey)
      
      // 선택적: 마지막 로그인 시간 업데이트를 위한 경량 데이터 전송
      try {
        await fetch(USER_COLLECTION_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sheet_type: 'user_login_update',
            user_id: userInfo.id,
            user_name: userInfo.name,
            last_login: new Date().toISOString()
          })
        })
      } catch (updateError) {
        console.warn('로그인 시간 업데이트 실패:', updateError)
      }
    }
    
    return existingApiKey

  } catch (error) {
    console.error('❌ 사용자 로그인 처리 실패:', error)
    // 실패해도 임시 API 키 반환
    const tempApiKey = generateApiKey()
    localStorage.setItem('current_user_api_key', tempApiKey)
    return tempApiKey
  }
}
