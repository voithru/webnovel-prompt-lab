/**
 * 개발자 도구 차단 방식의 로깅 유틸리티
 * 개발 모드에서만 로그를 출력하고, 프로덕션에서는 개발자 도구 자체를 차단
 */

// 환경 변수 확인 (Vite 환경변수 사용)
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development'
const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production'

/**
 * 개발 모드에서만 console.log 출력
 * @param {...any} args - 로그 인자들
 */
export const devLog = (...args) => {
  if (isDevelopment) {
    console.log(...args)
  }
}

/**
 * 개발 모드에서만 console.warn 출력
 * @param {...any} args - 경고 인자들
 */
export const devWarn = (...args) => {
  if (isDevelopment) {
    console.warn(...args)
  }
}

/**
 * 개발 모드에서만 console.error 출력
 * @param {...any} args - 에러 인자들
 */
export const devError = (...args) => {
  if (isDevelopment) {
    console.error(...args)
  }
}

/**
 * API 관련 로그 (개발 모드에서만)
 * @param {string} endpoint - API 엔드포인트
 * @param {any} data - 요청/응답 데이터
 * @param {string} type - 로그 타입 (request/response/error)
 */
export const apiLog = (endpoint, data, type = 'info') => {
  if (isDevelopment) {
    const timestamp = new Date().toISOString()
    console.log(`[API ${type.toUpperCase()}] ${timestamp} - ${endpoint}:`, data)
  }
}

/**
 * 프롬프트 관련 로그 (개발 모드에서만)
 * @param {string} message - 로그 메시지
 * @param {any} promptData - 프롬프트 데이터
 */
export const promptLog = (message, promptData) => {
  if (isDevelopment) {
    console.log(`[PROMPT] ${message}:`, promptData)
  }
}

/**
 * 인증 관련 로그 (개발 모드에서만)
 * @param {string} message - 로그 메시지
 * @param {any} authData - 인증 데이터 (민감정보 제외)
 */
export const authLog = (message, authData) => {
  if (isDevelopment) {
    console.log(`[AUTH] ${message}:`, authData)
  }
}

/**
 * 데이터베이스/스토리지 관련 로그 (개발 모드에서만)
 * @param {string} message - 로그 메시지
 * @param {any} data - 데이터
 */
export const storageLog = (message, data) => {
  if (isDevelopment) {
    console.log(`[STORAGE] ${message}:`, data)
  }
}

/**
 * 항상 출력되는 중요한 로그 (사용자에게 필요한 정보)
 * @param {...any} args - 로그 인자들
 */
export const userLog = (...args) => {
  console.log(...args)
}

/**
 * 항상 출력되는 중요한 에러 (사용자에게 필요한 에러)
 * @param {...any} args - 에러 인자들
 */
export const userError = (...args) => {
  console.error(...args)
}

// 환경 정보 출력
if (isDevelopment) {
  console.log('🔧 개발 모드로 실행 중 - 모든 로그가 출력됩니다.')
} else {
  console.log('🚀 프로덕션 모드로 실행 중 - 개발자 도구가 차단됩니다.')
}

// 개별 export 추가
export { isDevelopment, isProduction }

// 기본 export
export default {
  devLog,
  devWarn,
  devError,
  apiLog,
  promptLog,
  authLog,
  storageLog,
  userLog,
  userError,
  isDevelopment,
  isProduction
}
