// 사용자별 일일 프롬프트 입력 제한 관리 서비스
class PromptLimitService {
  constructor() {
    this.DAILY_LIMIT = 100 // 하루 최대 프롬프트 입력 개수
    this.STORAGE_KEY = 'daily_prompt_count'
  }

  // 오늘 날짜를 YYYY-MM-DD 형식으로 반환
  getTodayDate() {
    const today = new Date()
    return today.getFullYear() + '-' + 
           String(today.getMonth() + 1).padStart(2, '0') + '-' + 
           String(today.getDate()).padStart(2, '0')
  }

  // 사용자별 오늘의 프롬프트 입력 횟수 가져오기
  getTodayPromptCount(userEmail) {
    if (!userEmail) {
      console.warn('⚠️ 사용자 이메일이 없어 프롬프트 카운트를 확인할 수 없습니다.')
      return 0
    }

    const today = this.getTodayDate()
    const storageKey = `${this.STORAGE_KEY}_${userEmail}_${today}`
    
    try {
      const count = localStorage.getItem(storageKey)
      const result = count ? parseInt(count, 10) : 0
      console.log(`📊 일일 프롬프트 카운트 조회: ${userEmail} - ${result}/${this.DAILY_LIMIT}`)
      return result
    } catch (error) {
      console.error('❌ 프롬프트 카운트 조회 실패:', error)
      return 0
    }
  }

  // 사용자별 오늘의 프롬프트 입력 횟수 증가
  incrementTodayPromptCount(userEmail) {
    if (!userEmail) {
      console.warn('⚠️ 사용자 이메일이 없어 프롬프트 카운트를 증가시킬 수 없습니다.')
      return 0
    }

    const today = this.getTodayDate()
    const storageKey = `${this.STORAGE_KEY}_${userEmail}_${today}`
    
    try {
      const currentCount = this.getTodayPromptCount(userEmail)
      const newCount = currentCount + 1
      localStorage.setItem(storageKey, newCount.toString())
      
      console.log(`📊 프롬프트 카운트 증가: ${userEmail} - ${newCount}/${this.DAILY_LIMIT}`)
      return newCount
    } catch (error) {
      console.error('❌ 프롬프트 카운트 증가 실패:', error)
      return this.getTodayPromptCount(userEmail)
    }
  }

  // 프롬프트 입력 가능 여부 확인
  canSubmitPrompt(userEmail) {
    if (!userEmail) {
      console.warn('⚠️ 사용자 이메일이 없어 프롬프트 제한을 확인할 수 없습니다.')
      return false
    }

    const currentCount = this.getTodayPromptCount(userEmail)
    const canSubmit = currentCount < this.DAILY_LIMIT
    
    console.log(`🔍 프롬프트 입력 제한 확인: ${userEmail} - ${currentCount}/${this.DAILY_LIMIT} (가능: ${canSubmit})`)
    
    return canSubmit
  }

  // 제한 초과 알림 메시지 표시
  showLimitExceededAlert() {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const hoursUntilMidnight = Math.ceil((tomorrow - now) / (1000 * 60 * 60))
    
    alert(
      '⚠️ 일일 프롬프트 입력 제한 초과\n\n' +
      `오늘 프롬프트 입력 횟수가 ${this.DAILY_LIMIT}개를 초과했습니다.\n\n` +
      '다음 중 하나를 선택해주세요:\n' +
      `• 자정 이후 (약 ${hoursUntilMidnight}시간 후) 다시 시도\n` +
      '• 담당자에게 추가 할당량 문의\n\n' +
      '※ 프롬프트 입력 제한은 사용자 계정별로 적용됩니다.'
    )
  }

  // 남은 프롬프트 입력 횟수 반환
  getRemainingPromptCount(userEmail) {
    if (!userEmail) return 0
    
    const currentCount = this.getTodayPromptCount(userEmail)
    return Math.max(0, this.DAILY_LIMIT - currentCount)
  }

  // 프롬프트 입력 전 제한 확인 및 처리
  checkAndHandlePromptLimit(userEmail) {
    if (!this.canSubmitPrompt(userEmail)) {
      this.showLimitExceededAlert()
      return false
    }
    return true
  }

  // 이전 날짜의 카운트 데이터 정리 (선택적)
  cleanupOldCounts(userEmail) {
    if (!userEmail) return

    try {
      const today = this.getTodayDate()
      const keysToRemove = []
      
      // localStorage에서 해당 사용자의 이전 날짜 카운트 찾기
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(`${this.STORAGE_KEY}_${userEmail}_`) && !key.includes(today)) {
          keysToRemove.push(key)
        }
      }
      
      // 이전 날짜 데이터 삭제
      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
      })
      
      if (keysToRemove.length > 0) {
        console.log(`🧹 이전 날짜 프롬프트 카운트 정리: ${keysToRemove.length}개 삭제`)
      }
    } catch (error) {
      console.error('❌ 이전 카운트 정리 실패:', error)
    }
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
const promptLimitService = new PromptLimitService()
export default promptLimitService
