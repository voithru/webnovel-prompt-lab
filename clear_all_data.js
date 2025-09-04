/**
 * 모든 과제 데이터 초기화 스크립트
 * 브라우저 개발자 도구 콘솔에서 실행하세요
 */

console.log('🧹 모든 과제 데이터 초기화 시작...')

// 1. 현재 localStorage의 모든 키 확인
console.log('📋 현재 저장된 데이터:')
Object.keys(localStorage).forEach(key => {
  console.log(`- ${key}: ${localStorage.getItem(key)?.substring(0, 50)}...`)
})

// 2. 과제 관련 모든 데이터 삭제
const keysToDelete = []
Object.keys(localStorage).forEach(key => {
  if (
    key.includes('promptInput_') ||
    key.includes('promptReview_') ||
    key.includes('submission_') ||
    key.includes('taskProgress_') ||
    key.includes('baseline_translation_') ||
    key.includes('baseline_llm_called_') ||
    key.includes('user_api_key_') ||
    key === 'current_user_api_key'
  ) {
    keysToDelete.push(key)
  }
})

console.log(`🗑️ 삭제할 키 ${keysToDelete.length}개:`)
keysToDelete.forEach(key => {
  console.log(`- ${key}`)
  localStorage.removeItem(key)
})

console.log('✅ 모든 과제 데이터 초기화 완료!')
console.log('🔄 페이지를 새로고침하면 깨끗한 상태로 시작됩니다.')

// 3. 초기화 후 상태 확인
console.log('📊 초기화 후 남은 데이터:')
const remainingKeys = Object.keys(localStorage).filter(key => 
  !key.includes('auth-store') && // 로그인 정보는 유지
  !key.includes('design-system') // 디자인 시스템 설정은 유지
)
if (remainingKeys.length === 0) {
  console.log('✨ 완전히 깨끗합니다!')
} else {
  remainingKeys.forEach(key => {
    console.log(`- ${key}`)
  })
}
