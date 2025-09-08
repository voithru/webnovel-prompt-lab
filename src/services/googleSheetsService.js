// Gemini 서비스 import
import { getGeminiService } from './geminiService.js'
import emailAuthService from './emailAuthService.js'
import { apiLog, devError, devLog, userError } from '../utils/logger'

// 구글 스프레드시트 연동 서비스
class GoogleSheetsService {
  constructor() {
    // API 키 직접 설정 (실제 사용 시에는 환경변수로 관리해야 함)
    this.apiKey = 'AIzaSyDQQhafsQHZIOkPdSnneRV_u3QuT3lHFBs'
    this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets'
    
    // API 호출 최적화를 위한 캐시 및 제한
    this.apiCache = new Map() // API 응답 캐시
    this.lastApiCall = new Map() // 마지막 API 호출 시간 추적
    this.minApiInterval = 1000 // 최소 API 호출 간격 (1초)
    
    devLog('GoogleSheetsService 초기화:', {
      apiKey: this.apiKey ? '설정됨' : '설정안됨',
      baseUrl: this.baseUrl
    })
  }

  // 스프레드시트에서 특정 범위의 데이터 가져오기
  async getSheetData(spreadsheetId, range) {
    try {
      const cacheKey = `${spreadsheetId}:${range}`
      const now = Date.now()
      
      // 캐시 확인 (5분간 유효)
      const cachedData = this.apiCache.get(cacheKey)
      if (cachedData && (now - cachedData.timestamp) < 300000) {
        devLog('📦 캐시된 데이터 사용:', cacheKey)
        // 캐시된 데이터를 API 응답과 동일한 형식으로 반환
        return { values: cachedData.data }
      }
      
      // API 호출 간격 제한
      const lastCall = this.lastApiCall.get(cacheKey) || 0
      const timeSinceLastCall = now - lastCall
      if (timeSinceLastCall < this.minApiInterval) {
        const waitTime = this.minApiInterval - timeSinceLastCall
        devLog(`⏳ API 호출 제한 - ${waitTime}ms 대기`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
      
      const url = `${this.baseUrl}/${spreadsheetId}/values/${range}?key=${this.apiKey}`
      apiLog(`스프레드시트 API 호출`, { spreadsheetId, range }, 'request')
      
      this.lastApiCall.set(cacheKey, Date.now())
      const response = await fetch(url)
      apiLog(`API 응답`, { status: response.status, statusText: response.statusText }, 'response')
      
      if (!response.ok) {
        const errorText = await response.text()
        apiLog(`API 응답 에러`, { status: response.status, error: errorText }, 'error')
        
        // 500 에러의 경우 잠시 후 재시도
        if (response.status === 500) {
          devLog('⚠️ 서버 에러 감지 - 3초 후 재시도')
          await new Promise(resolve => setTimeout(resolve, 3000))
          
          // 재시도
          const retryResponse = await fetch(url)
          if (retryResponse.ok) {
            const retryData = await retryResponse.json()
            apiLog(`재시도 성공`, { rowCount: retryData.values?.length || 0 }, 'response')
            
            const result = retryData.values || []
            this.apiCache.set(cacheKey, {
              data: result,
              timestamp: Date.now()
            })
            return { values: result }
          }
        }
        
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      apiLog(`API 응답 데이터`, { rowCount: data.values?.length || 0 }, 'response')
      
      if (!data.values) {
        devLog('values 필드가 없음:', data)
        return { values: [] }
      }
      
      devLog(`총 ${data.values.length}행 데이터 로드됨`)
      const result = data.values || []
      
      // 캐시에 저장
      this.apiCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      })
      
      return { values: result }
    } catch (error) {
      devError('구글 스프레드시트 데이터 가져오기 실패:', error)
      userError('데이터를 불러오는 중 오류가 발생했습니다.')
      throw error
    }
  }

  // 웹소설 원문 가져오기 (링크에서 내용 추출)
  async getWebNovelContent(webNovelUrl) {
    try {
      // getTextFromUrl을 사용하여 Electron IPC로 처리
      return await this.getTextFromUrl(webNovelUrl)
    } catch (error) {
      console.error('웹소설 내용 가져오기 실패:', error)
      throw error
    }
  }

  // HTML에서 텍스트 추출
  extractTextFromHTML(htmlContent) {
    try {
      if (!htmlContent || typeof htmlContent !== 'string') return ''
      
      // Google Docs 특화 처리 (새로 추가된 기능)
      if (this.isGoogleDocsText && this.isGoogleDocsText(htmlContent)) {
        console.log('Google Docs HTML에서 텍스트 추출 시도...')
        return this.extractTextFromGoogleDocsHTML(htmlContent)
      }
      
      // 기존 로직 복구 - 간단한 HTML 태그 제거
      const text = htmlContent
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // 스크립트 제거
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // 스타일 제거
        .replace(/<[^>]+>/g, '') // HTML 태그 제거
        .replace(/&nbsp;/g, ' ') // HTML 엔티티 변환
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim()
      
      return text
    } catch (error) {
      console.error('HTML 텍스트 추출 실패:', error)
      return htmlContent
    }
  }
  
  // Google Docs HTML에서 텍스트 추출
  extractTextFromGoogleDocsHTML(htmlContent) {
    try {
      if (!htmlContent || typeof htmlContent !== 'string') return ''
      
      let text = htmlContent
        // Google Docs 특정 태그 및 클래스 제거
        .replace(/<div[^>]*class="[^"]*docs-ml-header[^"]*"[^>]*>.*?<\/div>/gs, '')
        .replace(/<div[^>]*class="[^"]*docs-ml-footer[^"]*"[^>]*>.*?<\/div>/gs, '')
        .replace(/<div[^>]*class="[^"]*docs-ml-page[^"]*"[^>]*>.*?<\/div>/gs, '')
        
        // 일반 HTML 태그 제거
        .replace(/<[^>]+>/g, ' ')
        
        // HTML 엔티티 디코딩
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&hellip;/g, '...')
        .replace(/&mdash;/g, '—')
        .replace(/&ndash;/g, '–')
        
        // Google Docs 특정 텍스트 제거
        .replace(/Google Docs/gi, '')
        .replace(/Document/gi, '')
        .replace(/Created with/gi, '')
        .replace(/Sign in/gi, '')
        .replace(/to continue/gi, '')
        
        // 연속된 공백 정리
        .replace(/\s+/g, ' ')
        .trim()
      
      // 의미있는 텍스트가 있는지 확인
      if (text && text.length > 50 && /[가-힣a-zA-Z]/.test(text)) {
        console.log('Google Docs HTML에서 텍스트 추출 성공:', text.substring(0, 100) + '...')
        return text
      }
      
      return ''
    } catch (error) {
      console.error('Google Docs HTML 텍스트 추출 실패:', error)
      return ''
    }
  }

  // AI 번역 생성 (실제로는 OpenAI API 등을 사용)
  async generateTranslation(originalText, settings, guidePrompt) {
    try {
      // TODO: 실제 AI API 연동
      // 현재는 임시로 번역된 것처럼 보이는 텍스트 생성
      const mockTranslation = this.generateMockTranslation(originalText, settings, guidePrompt)
      return mockTranslation
    } catch (error) {
      console.error('AI 번역 생성 실패:', error)
      throw error
    }
  }

  // 임시 번역 텍스트 생성 (실제 구현 시 제거)
  generateMockTranslation(originalText, settings, guidePrompt) {
    // 설정집과 가이드 프롬프트를 활용한 번역 시뮬레이션
    let translatedText = originalText
    
    // 가이드 프롬프트와 설정집은 백그라운드에서만 사용하고 화면에는 표시하지 않음
    // (Step 1에서 Gemini LLM 번역에 활용됨)
    
    // 간단한 한국어-일본어 번역 시뮬레이션
    const mockTranslations = {
      '안녕하세요': 'こんにちは',
      '감사합니다': 'ありがとうございます',
      '사랑합니다': '愛しています',
      '미안합니다': '申し訳ありません',
      '좋아요': 'いいですね',
      '재미있어요': '面白いですね',
      '아름다워요': '美しいですね',
      '행복해요': '幸せですね'
    }

    Object.entries(mockTranslations).forEach(([kor, jpn]) => {
      translatedText = translatedText.replace(new RegExp(kor, 'g'), jpn)
    })

    // 원본 텍스트가 너무 길면 일부만 번역
    if (translatedText.length > 1000) {
      translatedText = translatedText.substring(0, 1000) + '... (AI 자동 번역 완료)'
    }

    return translatedText
  }

  // CSV 파일에서 데이터 가져오기 (임시 해결책)
  async getProjectDataFromCSV() {
    try {
      console.log('CSV 파일에서 데이터 로드 중...')
      const response = await fetch('/data/project_data.csv')
      const csvText = await response.text()
      
      // CSV 파싱
      const lines = csvText.split('\n').filter(line => line.trim())
      const data = lines.map(line => {
        // 간단한 CSV 파싱 (쉼표로 분할)
        return line.split(',').map(cell => cell.trim())
      })
      
      console.log('CSV 데이터 로드 완료:', data)
      return data
    } catch (error) {
      console.error('CSV 파일 로드 실패:', error)
      throw error
    }
  }

  // 프로젝트 데이터 가져오기
  async getProjectData() {
    try {
      // 구글 시트 API 시도 (권한 설정 완료)
      try {
        const spreadsheetId = '1oAE0bz_-HYCwmp7ve5tu0z3m7g0mRTNWG2XuJVxy1qU'
        const range = 'project_for_call!A1:L1000'  // L열까지 포함 (베이스캠프 프롬프트)
        console.log('구글 시트 API 시도 중...', { spreadsheetId, range })
        const data = await this.getSheetData(spreadsheetId, range)
        console.log('구글 시트 API 성공!')
        return this.processProjectData(data, spreadsheetId, range)
      } catch (sheetError) {
        console.log('구글 시트 API 실패, CSV로 폴백:', sheetError.message)
        // CSV에서 데이터 시도 (백업)
        const data = await this.getProjectDataFromCSV()
        return this.processProjectData(data, 'CSV_LOCAL_FILE', 'project_data.csv')
      }
    } catch (error) {
      console.error('프로젝트 데이터 가져오기 실패:', error)
      // 에러 발생 시 기본 샘플 데이터 반환
      return this.getDefaultProjectData()
    }
  }

  // 🔄 스마트 과제 업데이트 (진행중/완료된 과제 보호)
  async getSmartProjectData(forceUpdate = false) {
    try {
      devLog('🔄 스마트 과제 업데이트 시작...')
      
      // 기존 데이터 가져오기
      const existingData = await this.getProjectData()
      
      if (!forceUpdate) {
        // 강제 업데이트가 아닌 경우, 기존 데이터와 비교
        const hasChanges = await this.checkProjectDataChanges(existingData)
        if (!hasChanges) {
          devLog('✅ 과제 데이터 변경점 없음 - 업데이트 건너뜀')
          return existingData
        }
      }
      
      // 새로운 데이터 가져오기
      const newData = await this.getProjectData()
      
      // 진행중/완료된 과제 보호하면서 업데이트 (강제 모드 여부 전달)
      const updatedData = await this.mergeProjectData(existingData, newData, forceUpdate)
      
      devLog('✅ 스마트 과제 업데이트 완료')
      return updatedData
      
    } catch (error) {
      devError('❌ 스마트 과제 업데이트 실패:', error)
      throw error
    }
  }

  // 🔍 과제 데이터 변경점 확인 (링크 + 파일 내용까지 비교)
  async checkProjectDataChanges(existingData) {
    try {
      devLog('🔍 과제 데이터 변경점 확인 중...')
      
      // 최신 시트 데이터 가져오기 (캐시 무시)
      const latestSheetData = await this.getSheetData(
        '1oAE0bz_-HYCwmp7ve5tu0z3m7g0mRTNWG2XuJVxy1qU',
        'project_for_call!A1:K1000'
      )
      
      if (!latestSheetData || !latestSheetData.values) {
        devLog('⚠️ 최신 시트 데이터 없음')
        return false
      }
      
      // 헤더 제외하고 실제 데이터만 비교
      const latestData = latestSheetData.values.slice(2) // 헤더 2줄 제외
      
      // 기존 데이터와 비교
      for (let i = 0; i < Math.min(existingData.length, latestData.length); i++) {
        const taskId = i + 1
        const existing = existingData[i]
        const latest = latestData[i]
        
        // 1️⃣ URL 변경점 확인
        const urlChanged = existing.pathSource !== latest[8] || // 원문 URL
                          existing.pathBaselineTranslation !== latest[6] || // 번역문 URL
                          existing.pathSeriesSettings !== latest[7] || // 설정집 URL
                          existing.pathGuidePrompt !== latest[9] // 가이드 프롬프트 URL
        
        if (urlChanged) {
          devLog(`🔄 과제 ${taskId} URL 변경점 감지:`, {
            source: existing.pathSource !== latest[8],
            translation: existing.pathBaselineTranslation !== latest[6],
            settings: existing.pathSeriesSettings !== latest[7],
            guide: existing.pathGuidePrompt !== latest[9]
          })
        return true
      }
      
        // 2️⃣ 파일 내용 변경점 확인 (URL이 동일한 경우)
        const hasContentChanges = await this.checkFileContentChanges(taskId, existing, latest)
        if (hasContentChanges) {
          devLog(`🔄 과제 ${taskId} 파일 내용 변경점 감지`)
          return true
        }
      }
      
      devLog('✅ 과제 데이터 변경점 없음')
      return false
      
    } catch (error) {
      devError('❌ 과제 데이터 변경점 확인 실패:', error)
      return true // 에러 시 안전하게 업데이트
    }
  }

  // 🔍 파일 내용 변경점 확인
  async checkFileContentChanges(taskId, existing, latest) {
    try {
      devLog(`🔍 과제 ${taskId} 파일 내용 변경점 확인 중...`)
      
      let hasChanges = false
      
      // 원문 파일 내용 비교
      if (existing.pathSource && existing.pathSource === latest[8]) {
        const sourceChanged = await this.compareFileContent(
          `cached_source_${taskId}`,
          existing.pathSource,
          '원문'
        )
        if (sourceChanged) hasChanges = true
      }
      
      // 번역문 파일 내용 비교
      if (existing.pathBaselineTranslation && existing.pathBaselineTranslation === latest[6]) {
        const translationChanged = await this.compareFileContent(
          `cached_baseline_${taskId}`,
          existing.pathBaselineTranslation,
          '번역문'
        )
        if (translationChanged) hasChanges = true
      }
      
      // 설정집 파일 내용 비교
      if (existing.pathSeriesSettings && existing.pathSeriesSettings === latest[7]) {
        const settingsChanged = await this.compareFileContent(
          `cached_settings_${taskId}`,
          existing.pathSeriesSettings,
          '설정집'
        )
        if (settingsChanged) hasChanges = true
      }
      
      // 가이드 프롬프트 파일 내용 비교
      if (existing.pathGuidePrompt && existing.pathGuidePrompt === latest[9]) {
        const guideChanged = await this.compareFileContent(
          `cached_guide_${taskId}`,
          existing.pathGuidePrompt,
          '가이드 프롬프트'
        )
        if (guideChanged) hasChanges = true
      }
      
      return hasChanges
      
    } catch (error) {
      devError(`❌ 과제 ${taskId} 파일 내용 비교 실패:`, error)
      return false // 에러 시 변경점 없음으로 처리
    }
  }

  // 🔍 개별 파일 내용 비교
  async compareFileContent(cacheKey, fileUrl, fileType) {
    try {
      // 기존 캐시된 내용 확인
      const cachedContent = this.apiCache.get(cacheKey)
      if (!cachedContent) {
        devLog(`📦 ${fileType} 캐시 없음 - 새로 로드 필요`)
        return true // 캐시가 없으면 변경된 것으로 간주
      }
      
      // 새 파일 내용 가져오기
      const newContent = await this.getTextFromUrl(fileUrl)
      if (!newContent) {
        devLog(`⚠️ ${fileType} 새 내용 가져오기 실패`)
        return false // 실패 시 변경점 없음으로 처리
      }
      
      // 내용 비교 (간단한 해시 비교)
      const oldHash = this.simpleHash(cachedContent.data)
      const newHash = this.simpleHash(newContent)
      
      if (oldHash !== newHash) {
        devLog(`🔄 ${fileType} 내용 변경 감지`)
        return true
      }
      
      devLog(`✅ ${fileType} 내용 변경 없음`)
      return false
      
    } catch (error) {
      devError(`❌ ${fileType} 파일 내용 비교 실패:`, error)
      return false
    }
  }

  // 🔐 간단한 해시 함수 (파일 내용 비교용)
  simpleHash(str) {
    if (!str || typeof str !== 'string') return ''
    
    let hash = 0
    if (str.length === 0) return hash.toString()
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 32bit 정수로 변환
    }
    
    return hash.toString()
  }

  // 🔄 과제 데이터 병합 (진행중/완료된 과제 보호 + 변경점 확인)
  async mergeProjectData(existingData, newData, forceUpdate = false) {
    try {
      devLog(`🔄 과제 데이터 병합 시작... (강제 모드: ${forceUpdate})`)
      
      const mergedData = []
      let protectedCount = 0
      let updatedCount = 0
      let unchangedCount = 0
      
      for (let i = 0; i < newData.length; i++) {
        const taskId = i + 1
        const newTask = newData[i]
        
        // 로컬 진행 상태 확인
        const localProgress = localStorage.getItem(`taskProgress_${taskId}`)
        const submissionData = localStorage.getItem(`submission_${taskId}`)
        
        // 🔒 진행중/완료된 과제는 강제 모드라도 보호
        if (submissionData || localProgress === '제출 완료' || localProgress === '진행중') {
          const existingTask = existingData.find(task => task.id === taskId)
          if (existingTask) {
            mergedData.push(existingTask)
            protectedCount++
            devLog(`🛡️ 과제 ${taskId} 보호됨 (${localProgress || '제출 완료'}) - 강제 모드라도 보호`)
          } else {
            mergedData.push(newTask)
          }
          continue // 다음 과제로 진행
        }
        
        // 🔍 대기중인 과제: 변경점 확인 후 업데이트
        const existingTask = existingData.find(task => task.id === taskId)
        if (!existingTask) {
          // 새로운 과제인 경우
          mergedData.push(newTask)
          updatedCount++
          devLog(`🆕 과제 ${taskId} 새로 추가됨`)
          continue
        }
        
        // 기존 과제와 변경점 비교
        const hasChanges = await this.checkTaskSpecificChanges(existingTask, newTask, taskId)
        
        if (hasChanges) {
          // 변경점이 있는 경우 업데이트
          mergedData.push(newTask)
          updatedCount++
          devLog(`🔄 과제 ${taskId} 변경점 감지로 업데이트됨`)
          
          // 관련 캐시 삭제 (원문, 번역문, 설정집 등)
          this.clearTaskRelatedCache(taskId)
        } else {
          // 변경점이 없는 경우 기존 데이터 유지
          mergedData.push(existingTask)
          unchangedCount++
          devLog(`✅ 과제 ${taskId} 변경점 없음 - 기존 데이터 유지`)
        }
      }
      
      devLog(`✅ 과제 데이터 병합 완료: 보호 ${protectedCount}개, 업데이트 ${updatedCount}개, 변경없음 ${unchangedCount}개`)
      return mergedData
      
    } catch (error) {
      devError('❌ 과제 데이터 병합 실패:', error)
      return newData // 에러 시 새 데이터 반환
    }
  }

  // 🔍 특정 과제의 변경점 확인
  async checkTaskSpecificChanges(existingTask, newTask, taskId) {
    try {
      devLog(`🔍 과제 ${taskId} 상세 변경점 확인 중...`)
      
      // 1️⃣ 기본 필드 변경점 확인
      const basicFieldsChanged = 
        existingTask.title !== newTask.title ||
        existingTask.episode !== newTask.episode ||
        existingTask.step !== newTask.step ||
        existingTask.languagePair !== newTask.languagePair ||
        existingTask.deadline !== newTask.deadline ||
        existingTask.priority !== newTask.priority
      
      if (basicFieldsChanged) {
        devLog(`🔄 과제 ${taskId} 기본 필드 변경 감지`)
        return true
      }
      
      // 2️⃣ URL 변경점 확인
      const urlChanged = 
        existingTask.pathSource !== newTask.pathSource ||
        existingTask.pathBaselineTranslation !== newTask.pathBaselineTranslation ||
        existingTask.pathSeriesSettings !== newTask.pathSeriesSettings ||
        existingTask.pathGuidePrompt !== newTask.pathGuidePrompt
      
      if (urlChanged) {
        devLog(`🔄 과제 ${taskId} URL 변경 감지`)
        return true
      }
      
      // 3️⃣ 파일 내용 변경점 확인 (URL이 동일한 경우)
      const hasContentChanges = await this.checkTaskFileContentChanges(existingTask, newTask, taskId)
      if (hasContentChanges) {
        devLog(`🔄 과제 ${taskId} 파일 내용 변경 감지`)
        return true
      }
      
      devLog(`✅ 과제 ${taskId} 변경점 없음`)
      return false
      
    } catch (error) {
      devError(`❌ 과제 ${taskId} 변경점 확인 실패:`, error)
      return false // 에러 시 변경점 없음으로 처리
    }
  }

  // 🔍 과제별 파일 내용 변경점 확인
  async checkTaskFileContentChanges(existingTask, newTask, taskId) {
    try {
      let hasChanges = false
      
      // 원문 파일 내용 비교
      if (existingTask.pathSource && existingTask.pathSource === newTask.pathSource) {
        const sourceChanged = await this.compareFileContent(
          `cached_source_${taskId}`,
          existingTask.pathSource,
          '원문'
        )
        if (sourceChanged) hasChanges = true
      }
      
      // 번역문 파일 내용 비교
      if (existingTask.pathBaselineTranslation && existingTask.pathBaselineTranslation === newTask.pathBaselineTranslation) {
        const translationChanged = await this.compareFileContent(
          `cached_baseline_${taskId}`,
          existingTask.pathBaselineTranslation,
          '번역문'
        )
        if (translationChanged) hasChanges = true
      }
      
      // 설정집 파일 내용 비교
      if (existingTask.pathSeriesSettings && existingTask.pathSeriesSettings === newTask.pathSeriesSettings) {
        const settingsChanged = await this.compareFileContent(
          `cached_settings_${taskId}`,
          existingTask.pathSeriesSettings,
          '설정집'
        )
        if (settingsChanged) hasChanges = true
      }
      
      // 가이드 프롬프트 파일 내용 비교
      if (existingTask.pathGuidePrompt && existingTask.pathGuidePrompt === newTask.pathGuidePrompt) {
        const guideChanged = await this.compareFileContent(
          `cached_guide_${taskId}`,
          existingTask.pathGuidePrompt,
          '가이드 프롬프트'
        )
        if (guideChanged) hasChanges = true
      }
      
      return hasChanges
      
    } catch (error) {
      devError(`❌ 과제 ${taskId} 파일 내용 변경점 확인 실패:`, error)
      return false
    }
  }

  // 🗑️ 과제 관련 캐시 삭제
  clearTaskRelatedCache(taskId) {
    try {
      const cacheKeys = [
        `project_detail_${taskId}`,
        `cached_source_${taskId}`,
        `cached_baseline_${taskId}`,
        `cached_settings_${taskId}`,
        `cached_guide_${taskId}`
      ]
      
      let deletedCount = 0
      cacheKeys.forEach(key => {
        if (this.apiCache.has(key)) {
          this.apiCache.delete(key)
          deletedCount++
        }
      })
      
      devLog(`🗑️ 과제 ${taskId} 관련 캐시 삭제: ${deletedCount}개`)
      
    } catch (error) {
      devError(`❌ 과제 ${taskId} 캐시 삭제 실패:`, error)
    }
  }
  
  // 데이터 처리 로직을 별도 메서드로 분리
  processProjectData(data, spreadsheetId, sheetName) {
    // data가 { values: [] } 형식인지 확인하고 적절히 처리
    const values = data.values || data
    
    if (!values || values.length < 2) {
      console.error('❌ 데이터 부족:', {
        hasValues: !!values,
        valuesLength: values?.length || 0,
        minimumRequired: 2
      })
      throw new Error('데이터가 없거나 헤더만 있습니다.')
    }
    
    // Row 1: 안내사항, Row 2: 컬럼명, Row 3부터: 실제 과제 데이터
    const infoRow = values[0] // Row 1: 안내사항
    const headers = values[1] // Row 2: 컬럼명
    const rows = values.slice(2) // Row 3부터: 실제 과제 데이터
    
    console.log('안내사항:', infoRow)
    console.log('컬럼명:', headers)
    console.log(`실제 과제 데이터: ${rows.length}개`)
    
    // 실제 스프레드시트 컬럼 구조에 맞게 인덱스 설정 (A=0, B=1, C=2...)
    const seriesTitleIndex = 1 // B열: series_title → 과제 제목
    const episodeIndex = 2 // C열: episode → 에피소드 번호
    const stepIndex = 3 // D열: step → 단계 (1,2,3,4)
    const sourceLanguageIndex = 4 // E열: source_language → 출발어
    const targetLanguageIndex = 5 // F열: target_language → 도착어
    const pathBaselineTranslationIndex = 6 // G열: path_baseline_translation → 기본 번역문 링크
    const pathSeriesSettingsIndex = 7 // H열: path_series_settings → 설정집 링크
    const pathContextIndex = 8 // I열: path_context → 맥락 분석 JSON 파일 링크 ⭐ 새로 추가
    const pathSourceIndex = 9 // J열: path_source → 원문 링크 (기존 I열에서 이동)
    const pathGuidePromptIndex = 10 // K열: path_guide_prompt → AI 프롬프트 링크 (기존 J열에서 이동)
    const pathBasecampPromptIndex = 11 // L열: path_basecamp_prompt → 베이스캠프 프롬프트 링크 ⭐ 새로 추가
    
    // 데이터를 변환하여 반환
    const projects = rows.map((row, index) => {
      const sourceLanguage = row[sourceLanguageIndex] || '한국어'
      const targetLanguage = row[targetLanguageIndex] || '일본어'
      const step = row[stepIndex] || '1'
      
      // 과도한 디버깅 로그 제거 - 필요시에만 활성화
      // console.log(`Row ${index + 2}: step value = "${step}", stepIndex = ${stepIndex}, row length = ${row.length}`)
      // console.log(`🔍 Row ${index + 1} 데이터 분석:`, row)
      
      const project = {
        id: index + 1,
        title: row[seriesTitleIndex] || '제목없음',
        languagePair: `${sourceLanguage} → ${targetLanguage}`,
        episode: row[episodeIndex] || '1',
        step: `Step ${step}`,
        stepOrder: parseInt(step) || 1,
        status: '대기', // 기본 상태
        deadline: '2025. 12. 31', // 기본 마감일
        projectSeason: '시즌 1', // 기본 시즌
        // 링크 정보
        pathBaselineTranslation: row[pathBaselineTranslationIndex] || '',
        pathSeriesSettings: row[pathSeriesSettingsIndex] || '',
        pathContext: row[pathContextIndex] || '', // ⭐ 새로 추가: 맥락 분석 JSON 파일 링크
        pathSource: row[pathSourceIndex] || '',
        pathGuidePrompt: row[pathGuidePromptIndex] || '',
        pathBasecampPrompt: row[pathBasecampPromptIndex] || '', // ⭐ 새로 추가: 베이스캠프 프롬프트 링크
        // 호환성을 위한 기존 필드들
        settings: row[pathSeriesSettingsIndex] || '',
        originalUrl: row[pathSourceIndex] || '',
        translationUrl: row[pathBaselineTranslationIndex] || '',
        // 메타데이터
        lastUpdated: new Date().toISOString(),
        rowIndex: index + 2, // CSV의 실제 행 번호 (헤더 제외)
        spreadsheetId: spreadsheetId,
        sheetName: sheetName
      }
      
      return project
    })
    
    return projects
  }
  
  // 기본 프로젝트 데이터 (에러 시 사용)
  getDefaultProjectData() {
    return [
      {
        id: 1,
        languagePair: '한국어 → 일본어',
        title: '미필적 고의에 의한 연애사',
        episode: '1',
        step: 'Step 1',
        stepOrder: 1,
        projectSeason: '시즌 1',
        status: '완료',
        deadline: '2025. 8. 30',
        settings: '설정집 정보',
        originalUrl: 'https://example.com/novel1',
        translationUrl: 'https://example.com/translation1',
        lastUpdated: new Date().toISOString(),
        rowIndex: 2,
        spreadsheetId: '1oAE0bz_-HYCwmp7ve5tu0z3m7g0mRTNWG2XuJVxy1qU',
        sheetName: 'project_for_call'
      },
      {
        id: 2,
        languagePair: '한국어 → 일본어',
        title: '오달리스크',
        episode: '1',
        step: 'Step 2',
        stepOrder: 2,
        projectSeason: '시즌 1',
        status: '진행중',
        deadline: '2025. 8. 30',
        settings: '설정집 정보',
        originalUrl: 'https://example.com/novel2',
        translationUrl: 'https://example.com/translation2',
        lastUpdated: new Date().toISOString(),
        rowIndex: 3,
        spreadsheetId: '1oAE0bz_-HYCwmp7ve5tu0z3m7g0mRTNWG2XuJVxy1qU',
        sheetName: 'project_for_call'
      }
    ]
  }

  // 실시간 데이터 폴링 (선택사항)
  startPolling(callback, interval = 30000) { // 30초마다 업데이트
    const poll = async () => {
      try {
        const newData = await this.getProjectData()
        callback(newData)
      } catch (error) {
        console.error('폴링 중 에러 발생:', error)
      }
    }
    
    // 즉시 한 번 실행
    poll()
    
    // 주기적으로 실행
    const intervalId = setInterval(poll, interval)
    
    // 폴링 중지 함수 반환
    return () => clearInterval(intervalId)
  }

  // 텍스트 해시 생성 (기본 번역문 고정을 위한 식별자)
  generateTextHash(text) {
    if (!text || typeof text !== 'string') return 'empty'
    
    // 간단한 해시 함수 (djb2 알고리즘)
    let hash = 5381
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) + hash) + text.charCodeAt(i)
    }
    return Math.abs(hash).toString(36)
  }

  // 🗑️ 모든 과제 리셋 (제출 완료 과제만 보호)
  async clearAllTasksCache(includeSubmitted = false) {
    try {
      const resetType = includeSubmitted ? '전체 리셋 (제출 완료 과제 포함)' : '일반 리셋 (제출 완료 과제만 보호)'
      console.log(`🗑️ ${resetType} 시작...`)
      console.log(`🔍 clearAllTasksCache 호출 - includeSubmitted: ${includeSubmitted}`)
      
      // 🚀 Google Sheets API 캐시 전체 삭제 (즉시 반영을 위해)
      console.log('🗑️ Google Sheets API 캐시 전체 삭제 시작...')
      const apiCacheSize = this.apiCache.size
      this.apiCache.clear()
      console.log(`✅ Google Sheets API 캐시 ${apiCacheSize}개 항목 삭제 완료`)
      
      let deletedCount = apiCacheSize // API 캐시 삭제 개수부터 시작
      let protectedCount = 0
      const totalTasks = 100 // 최대 과제 수 (충분히 큰 수)
      
      for (let taskId = 1; taskId <= totalTasks; taskId++) {
        // 로컬 스토리지에서 진행 상태 확인
        const localProgress = localStorage.getItem(`taskProgress_${taskId}`)
        const submissionData = localStorage.getItem(`submission_${taskId}`)
        
        console.log(`🔍 과제 ${taskId} 상태 확인: localProgress="${localProgress}", submissionData=${!!submissionData}`)
        
        // 전체 리셋이 아닌 경우에만 제출 완료 과제 보호
        if (!includeSubmitted && (submissionData || localProgress === '제출 완료')) {
          console.log(`🛡️ 과제 ${taskId} 보호됨 (${localProgress || '제출 완료'}) - 캐시 유지 (includeSubmitted: ${includeSubmitted})`)
          protectedCount++
          continue
        }
        
        console.log(`🔄 과제 ${taskId} 리셋 중... (includeSubmitted: ${includeSubmitted})`)
        
        // 모든 과제 관련 캐시 삭제 (프롬프트, 코멘트, 텍스트 내용 등)
        const cacheKeys = [
          `cached_source_${taskId}`,      // 원문 캐시
          `cached_baseline_${taskId}`,    // 기본 번역문 캐시
          `cached_settings_${taskId}`,    // 설정집 캐시
          `cached_guide_${taskId}`,       // 기본 프롬프트 캐시
          `cached_prompt_example_${taskId}`, // 프롬프트 작성 예시 캐시
          `text_content_${taskId}`,       // 텍스트 콘텐츠 캐시
          `project_detail_${taskId}`      // 프로젝트 상세 정보 캐시
        ]
        
        cacheKeys.forEach(key => {
          if (this.apiCache.has(key)) {
            this.apiCache.delete(key)
            deletedCount++
            console.log(`🗑️ 캐시 삭제: ${key} (과제 ${taskId})`)
          }
        })
        
        // localStorage에서 모든 과제 관련 데이터 삭제
        const localStorageKeys = [
          // 텍스트 내용 캐시
          `cached_source_${taskId}`,      // 원문
          `cached_baseline_${taskId}`,    // 기본 번역문
          `cached_settings_${taskId}`,    // 설정집
          `cached_guide_${taskId}`,       // 기본 프롬프트
          `cached_prompt_example_${taskId}`, // 프롬프트 작성 예시
          `text_content_${taskId}`,       // 텍스트 콘텐츠
          `project_detail_${taskId}`,     // 프로젝트 상세 정보 (⭐ pathBasecampPrompt 포함)
          `cachedOriginalText_${taskId}`, // TranslationEditorPage에서 사용하는 원문 캐시
          `baseline_translation_${taskId}`, // TranslationEditorPage에서 사용하는 기본번역문 캐시
          `saved_baseline_translation_${taskId}`, // Step1 기본번역문 캐시
          // 프롬프트 관련 데이터
          `promptInput_${taskId}`,        // 프롬프트 입력 데이터
          `promptReview_${taskId}`,       // 프롬프트 검토 데이터
          // 코멘트 관련 데이터
          `comments_${taskId}`,           // 코멘트 데이터
          `savedComments_${taskId}`,      // 저장된 코멘트
          // Step 데이터
          `step1Data_${taskId}`,          // Step 1 데이터
          `step2Data_${taskId}`,          // Step 2 데이터
          `step3Data_${taskId}`,          // Step 3 데이터
          `step4Data_${taskId}`,          // Step 4 데이터
          // 기타 데이터
          `taskProgress_${taskId}`,       // 과제 진행 상태 (제출 완료가 아닌 경우)
          `finalSelection_${taskId}`,     // 최종 선택 데이터
          `qualityEvaluation_${taskId}`,  // 품질 평가 데이터
          `bestPrompt_${taskId}`,         // Best 프롬프트 데이터
          `submission_${taskId}`          // 제출 데이터 (전체 리셋 시 삭제)
        ]
        
        localStorageKeys.forEach(key => {
          if (localStorage.getItem(key)) {
            localStorage.removeItem(key)
            console.log(`🗑️ localStorage 삭제: ${key} (과제 ${taskId})`)
          }
        })
        
        // 추가로 taskId와 관련된 모든 키를 찾아서 삭제 (안전장치)
        const allKeys = Object.keys(localStorage)
        console.log(`🔍 과제 ${taskId} 전체 localStorage 키 확인:`, allKeys.filter(key => key.includes(`_${taskId}`)))
        let taskRelatedKeys = allKeys.filter(key => 
          key.includes(`_${taskId}`) && 
          !key.startsWith('daily_prompt_count_') // 일일 프롬프트 카운트 키 보호
        )
        console.log(`🔍 과제 ${taskId} 삭제 대상 키 (daily_prompt_count_ 제외):`, taskRelatedKeys)
        
        // includeSubmitted가 false인 경우에만 submission_ 키를 보호
        if (!includeSubmitted) {
          taskRelatedKeys = taskRelatedKeys.filter(key => !key.includes('submission_'))
        }
        
        taskRelatedKeys.forEach(key => {
          if (localStorage.getItem(key)) { // Check if key still exists before removing
            localStorage.removeItem(key)
            console.log(`🗑️ 추가 localStorage 삭제: ${key} (과제 ${taskId})`)
          }
        })

        // Add a log to confirm localStorage state after clearing for this task
        console.log(`✅ 과제 ${taskId} localStorage 정리 완료. 잔여 submission/progress 키 확인:`, {
          submissionDataAfterClear: localStorage.getItem(`submission_${taskId}`),
          taskProgressAfterClear: localStorage.getItem(`taskProgress_${taskId}`)
        });
        
        // 캐시 삭제만 수행하고 텍스트 재로드는 하지 않음
        // 실제 텍스트 로드는 사용자가 과제를 클릭할 때만 수행
        console.log(`✅ 과제 ${taskId} 캐시 삭제 완료 - 텍스트는 과제 클릭 시 로드됨`)
      }
      
      console.log(`✅ ${resetType} 완료: ${deletedCount}개 캐시 삭제, ${protectedCount}개 보호`)
      
      const message = includeSubmitted 
        ? `전체 리셋이 완료되었습니다. (${deletedCount}개 캐시 삭제)`
        : `모든 과제가 리셋되었습니다. (${protectedCount}개 제출 완료 과제 보호, ${deletedCount}개 캐시 삭제)`
      
      return {
        success: true,
        deletedCount: deletedCount,
        protectedCount: protectedCount,
        message: message
      }
      
    } catch (error) {
      console.error('❌ 모든 과제 리셋 실패:', error)
      return {
        success: false,
        error: error.message,
        message: '과제 리셋 중 오류가 발생했습니다.'
      }
    }
  }

  // 텍스트 내용 정리 (원본 그대로 최대한 보존)
  extractTextFromHtml(content) {
    if (!content || typeof content !== 'string') return content
    
    // 단순히 줄바꿈만 통일하고 원본 그대로 반환
    return content
      .replace(/\r\n/g, '\n') // Windows 줄바꿈을 Unix 스타일로 통일
      .replace(/\r/g, '\n') // Mac 스타일 줄바꿈을 Unix 스타일로 통일
      .trim()
  }

  // 링크에서 텍스트 내용 가져오기
  async getTextFromUrl(url) {
    if (!url || url === 'null' || url === 'undefined' || url.trim() === '') {
      console.warn('⚠️ 유효하지 않은 URL:', url)
      throw new Error('URL이 제공되지 않았습니다.');
    }

    // URL 형식 유효성 검사 추가
    const trimmedUrl = url.trim();
    const isValidUrl = trimmedUrl.startsWith('http://') || 
                      trimmedUrl.startsWith('https://') || 
                      trimmedUrl.includes('docs.google.com') || 
                      trimmedUrl.includes('drive.google.com');
    
    if (!isValidUrl) {
      console.warn('⚠️ 유효하지 않은 URL 형식:', trimmedUrl)
      console.warn('⚠️ URL이 아닌 텍스트로 판단됨 - 기본값 반환')
      // URL이 아닌 경우 기본 메시지 반환 (에러를 던지지 않음)
      return `URL이 아닌 텍스트입니다: ${trimmedUrl}`;
    }

    console.log('🔗 텍스트 URL 처리 시작:', trimmedUrl);
    
    // 디버깅: URL 상세 정보
    console.log('🔍 URL 분석:', {
      originalUrl: url,
      trimmedUrl: trimmedUrl,
      isValidUrl: isValidUrl,
      isGoogleDrive: trimmedUrl.includes('drive.google.com'),
      isGoogleDocs: trimmedUrl.includes('docs.google.com/document'),
      isGoogleSheets: trimmedUrl.includes('docs.google.com/spreadsheets')
    });
    
    // URL 타입 감지 및 로그
    if (trimmedUrl.includes('drive.google.com')) {
      console.log('📁 Google Drive 링크 감지')
    } else if (trimmedUrl.includes('docs.google.com/document')) {
      console.log('📄 Google Docs 링크 감지')
    } else if (trimmedUrl.includes('docs.google.com/spreadsheets')) {
      console.log('📊 Google Sheets 링크 감지')
    } else {
      console.log('🌐 일반 웹 링크 감지')
    }

        try {
        // Google Docs 링크 감지 및 처리
        if (trimmedUrl.includes('docs.google.com/document/')) {
        console.log('📄 Google Docs 링크 감지, 처리 시작...');
          console.log('📄 처리할 Google Docs URL:', trimmedUrl);
          return await this.getGoogleDocsContent(trimmedUrl);
        }
        
        // Google Sheets 링크 감지 및 처리
        if (trimmedUrl.includes('docs.google.com/spreadsheets/')) {
        console.log('📊 Google Sheets 링크 감지, 처리 시작...');
          console.log('📊 처리할 Google Sheets URL:', trimmedUrl);
          return await this.getGoogleSheetsContent(trimmedUrl);
        }
        
        // Google Drive 링크 감지 및 처리
        if (trimmedUrl.includes('drive.google.com/file/')) {
        console.log('📁 Google Drive 링크 감지, 처리 시작...');
          console.log('📁 처리할 Google Drive URL:', trimmedUrl);
          return await this.getGoogleDriveContent(trimmedUrl);
      }
      
      // 일반 웹 URL 처리
      console.log('🌐 일반 웹 URL 감지, 처리 시작...');
      return await this.getWebContentWithProxy(trimmedUrl);

    } catch (error) {
      console.error('URL 처리 실패:', error);
      throw error;
    }
  }
  
  // 웹 콘텐츠 가져오기 (Electron/브라우저 호환)
  async getWebContentWithProxy(url) {
    try {
      let content = null;
      
      // 브라우저/Electron 환경 감지
      if (typeof window !== 'undefined' && window.electronAPI && window.electronAPI.fetchUrl) {
        // Electron 환경
        console.log('Electron IPC를 통한 URL 요청:', url);
        console.log('Electron IPC fetchUrl 호출 중...');
        content = await window.electronAPI.fetchUrl(url);
        console.log('Electron IPC 응답 받음:', content?.substring(0, 100) + '...');
      } else {
        // 브라우저 환경 - CORS 프록시 사용
        console.log('🌐 브라우저 환경 감지 - CORS 프록시 사용:', url);
        console.log('🔍 브라우저 환경 상세 정보:', {
          userAgent: navigator.userAgent,
          origin: window.location.origin,
          hasElectronAPI: !!window.electronAPI,
          url: url
        });
        
        try {
          // 브라우저 환경에서는 CORS 프록시 사용
          let fetchUrl = url;
          
          // Google Docs 공개 텍스트 변환
          if (url.includes('docs.google.com/document/') && url.includes('/export?format=txt')) {
            fetchUrl = url;
          } else if (url.includes('docs.google.com/document/')) {
            const fileId = this.extractFileId(url);
            if (fileId) {
              fetchUrl = `https://docs.google.com/document/d/${fileId}/export?format=txt`;
            }
          } else if (url.includes('drive.google.com/file/')) {
            const fileId = this.extractFileId(url);
            if (fileId) {
              fetchUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
            }
          }
          
          // 여러 CORS 프록시 시도 (안정성 순서대로 - 2025년 업데이트)
          const proxies = [
            // 가장 안정적인 프록시들 (2025년 기준)
            `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(fetchUrl)}`,
            `https://thingproxy.freeboard.io/fetch/${fetchUrl}`,
            `https://cors-proxy.fringe.zone/${fetchUrl}`,
            `https://proxy.techzbots1.workers.dev/?u=${encodeURIComponent(fetchUrl)}`,
            // 백업 프록시들
            `https://corsproxy.io/?${encodeURIComponent(fetchUrl)}`,
            `https://cors.sh/${fetchUrl}`,
            `https://proxy.cors.sh/${fetchUrl}`,
            `https://yacdn.org/proxy/${fetchUrl}`,
            `https://api.allorigins.win/get?url=${encodeURIComponent(fetchUrl)}`
          ];
          
          let lastError = null;
          
          for (const proxyUrl of proxies) {
            try {
              console.log('CORS 프록시 시도:', proxyUrl);
              
              const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: proxyUrl.includes('allorigins.win') 
                  ? { 'Accept': 'application/json' }
                  : { 'Accept': 'text/plain,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' },
                timeout: 10000 // 10초 타임아웃
              });
              
              if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
              }
              
              // 프록시별 응답 처리
              if (proxyUrl.includes('allorigins.win')) {
                const data = await response.json();
                content = data.contents;
              } else if (proxyUrl.includes('cors.sh') || proxyUrl.includes('corsproxy.io')) {
                content = await response.text();
              } else if (proxyUrl.includes('thingproxy.freeboard.io')) {
                content = await response.text();
              } else if (proxyUrl.includes('yacdn.org')) {
                content = await response.text();
              } else if (proxyUrl.includes('codetabs.com')) {
                content = await response.text();
              } else {
                content = await response.text();
              }
              
              console.log('CORS 프록시 성공:', proxyUrl);
              console.log('CORS 프록시 응답 받음:', content?.substring(0, 100) + '...');
              break;
              
            } catch (error) {
              console.log('❌ CORS 프록시 실패:', proxyUrl, {
                message: error.message,
                name: error.name,
                stack: error.stack?.split('\n')[0] || 'No stack',
                responseStatus: error.status || 'Unknown'
              });
              lastError = error;
              
              // 특정 프록시 실패 시 짧은 대기 후 다음 시도
              if (proxyUrl.includes('allorigins.win') || proxyUrl.includes('cors.sh')) {
                await new Promise(resolve => setTimeout(resolve, 500));
              }
              continue;
            }
          }
          
          if (!content && lastError) {
            throw lastError;
          }
        } catch (fetchError) {
          console.error('CORS 프록시 실패:', fetchError);
          throw fetchError;
        }
      }
      
      if (content) {
        
                          // Gzip 압축 데이터 감지 (매우 중요!)
                  if (content.charCodeAt(0) === 0x1f && content.charCodeAt(1) === 0x8b) {
                    console.error('🚨 CRITICAL: Electron IPC fetchUrl이 gzip 압축 데이터를 반환했습니다!');
                    console.error('🚨 이는 Electron main process에서 gzip 해제가 필요합니다.');
                    console.error('🚨 현재 반환된 데이터:', content.substring(0, 200));
                    
                    // 클라이언트 측에서 gzip 해제 시도 (제한적)
                    try {
                      const decompressed = await this.decompressGzip(content);
                      if (decompressed) {
                        console.log('✅ 클라이언트 측 gzip 해제 성공');
                        return decompressed;
                      }
                    } catch (decompressError) {
                      console.error('❌ 클라이언트 측 gzip 해제 실패:', decompressError);
                    }
                  }
        
        // 바이너리 데이터 감지
        if (this.isBinaryContent(content)) {
          console.warn('⚠️ 바이너리 데이터 감지, 텍스트로 변환 시도...');
          
          // Google Docs/Sheets URL에서 바이너리 데이터가 반환되는 경우 특별 경고
          if (url.includes('docs.google.com') || url.includes('drive.google.com')) {
            console.warn('⚠️ Google Docs/Sheets URL에서 바이너리 데이터 반환됨. 이는 Electron IPC fetchUrl의 문제일 수 있습니다.');
          }
          
          const convertedText = this.convertBinaryToText(content);
          if (convertedText && convertedText.length > 100) {
            console.log('✅ 바이너리 데이터를 텍스트로 변환 성공');
            return convertedText;
          } else {
            console.warn('⚠️ 모든 바이너리-텍스트 변환 방법 실패');
          }
        }
        
        return content;
      }
      
      return null;
    } catch (error) {
      console.error('Electron IPC 요청 실패:', error);
      throw error;
    }
  }
  
  // Google Docs 링크에서 텍스트 가져오기
  async getGoogleDocsContent(url) {
    console.log('Google Docs 처리 시작 - 원본 URL:', url);
    
    const fileId = this.extractFileId(url);
    if (!fileId) {
      throw new Error('Google Docs 파일 ID를 추출할 수 없습니다.');
    }

    console.log('Google Docs를 여러 방법으로 처리... (우선순위 순서대로)');
    
    // 방법 1: /export?format=txt (순수 텍스트 형식 - 가장 안정적)
    try {
      console.log('🟢 방법 1 (최우선): /export?format=txt 링크 시도');
      const exportUrl = `https://docs.google.com/document/d/${fileId}/export?format=txt`;
      const content = await this.getWebContentWithProxy(exportUrl);
      if (content && content.length > 100 && !content.includes('var DOCS_timing')) {
        console.log('✅ 방법 1 성공: /export?format=txt 링크에서 텍스트 추출 성공');
        return content; // 이미 텍스트 형식이므로 HTML 태그 제거 불필요
      }
    } catch (error) {
      console.log('❌ 방법 1 실패:', error.message);
    }

    // 방법 2: /preview 링크 (HTML 형식)
    try {
      console.log('🟡 방법 2: /preview 링크 시도');
      const previewUrl = `https://docs.google.com/document/d/${fileId}/preview`;
      const content = await this.getWebContentWithProxy(previewUrl);
      if (content && content.length > 100 && !content.includes('var DOCS_timing')) {
        console.log('✅ 방법 2 성공: /preview 링크에서 텍스트 추출 성공');
        return this.extractTextFromHtml(content);
      }
    } catch (error) {
      console.log('❌ 방법 2 실패:', error.message);
    }

    // 방법 3: /edit 링크
    try {
      console.log('🔵 방법 3: /edit 링크 시도');
      const editUrl = `https://docs.google.com/document/d/${fileId}/edit`;
      const content = await this.getWebContentWithProxy(editUrl);
      if (content && content.length > 100) {
        console.log('✅ 방법 3 성공: /edit 링크에서 텍스트 추출 성공');
        return this.extractTextFromHtml(content);
      }
    } catch (error) {
      console.log('❌ 방법 3 실패:', error.message);
    }

    // 방법 3.5: /view 링크 (새로운 방법)
    try {
      console.log('🔵 방법 3.5: /view 링크 시도');
      const viewUrl = `https://docs.google.com/document/d/${fileId}/view`;
      const content = await this.getWebContentWithProxy(viewUrl);
      if (content && content.length > 100) {
        console.log('✅ 방법 3.5 성공: /view 링크에서 텍스트 추출 성공');
        return this.extractTextFromHtml(content);
      }
    } catch (error) {
      console.log('❌ 방법 3.5 실패:', error.message);
    }

    // 방법 4: 원본 URL (마지막 수단)
    try {
      console.log('🔴 방법 4 (마지막): 원본 URL 시도');
      const content = await this.getWebContentWithProxy(url);
      if (content && content.length > 100 && !content.includes('var DOCS_timing')) {
        console.log('✅ 방법 4 성공: 원본 URL에서 텍스트 추출 성공');
        return this.extractTextFromHtml(content);
      }
    } catch (error) {
      console.log('❌ 방법 4 실패:', error.message);
    }

    throw new Error('모든 Google Docs 접근 방법이 실패했습니다.');
  }
  
  // Google Docs 텍스트 정리
  cleanGoogleDocsText(text) {
    try {
      if (!text || typeof text !== 'string') return ''
      
      let cleanedText = text
        // Google Docs 특수 문자 및 제어 문자 제거
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
        .replace(/[\uFFFD]/g, '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '') // zero-width characters
        .replace(/[\u2060-\u2064\u206A-\u206F]/g, '') // invisible separators
        
        // Google Docs 특정 패턴 제거
        .replace(/Google Docs/i, '')
        .replace(/Document/i, '')
        .replace(/Created with/i, '')
        .replace(/Google Docs/i, '')
        
        // 연속된 공백 정리
        .replace(/\s+/g, ' ')
        .trim()
      
      // 의미있는 텍스트가 있는지 확인
      if (cleanedText && cleanedText.length > 10 && /[가-힣a-zA-Z]/.test(cleanedText)) {
        return cleanedText
      }
      
      return ''
    } catch (error) {
      console.error('Google Docs 텍스트 정리 실패:', error)
      return text
    }
  }
  
  // PDF에서 텍스트 추출 시도
  extractTextFromPDF(content) {
    try {
      if (!content || typeof content !== 'string') return ''
      
      // PDF 텍스트 추출 시도 (간단한 방법)
      let text = content
        // PDF 특수 문자 제거
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
        .replace(/[\uFFFD]/g, '')
        
        // PDF 헤더/푸터 제거
        .replace(/^.*?%PDF-1\.[0-9]+/s, '')
        .replace(/trailer.*$/s, '')
        
        // 연속된 공백 정리
        .replace(/\s+/g, ' ')
        .trim()
      
      // 의미있는 텍스트가 있는지 확인
      if (text && text.length > 50 && /[가-힣a-zA-Z]/.test(text)) {
        return text
      }
      
      return ''
    } catch (error) {
      console.error('PDF 텍스트 추출 실패:', error)
      return ''
    }
  }
  
  // Google Sheets 링크에서 데이터를 정확하게 추출 (API 사용)
  async getGoogleSheetsContent(url) {
    console.log('📊 Google Sheets API를 통한 정확한 데이터 추출 시작 - 원본 URL:', url);
    
    const fileId = this.extractFileId(url);
    if (!fileId) {
      throw new Error('Google Sheets 파일 ID를 추출할 수 없습니다.');
    }

    console.log('📊 스프레드시트 ID 추출 완료:', fileId);

    try {
      // 1. 먼저 스프레드시트의 모든 시트 목록 가져오기
      const sheetsMetadata = await this.getSpreadsheetMetadata(fileId);
      console.log('📋 시트 목록 조회 완료:', sheetsMetadata.sheets.map(s => s.properties.title));
      
      // 2. 모든 시트의 데이터를 가져와서 통합
      const allSheetsData = [];
      
      for (const sheet of sheetsMetadata.sheets) {
        const sheetTitle = sheet.properties.title;
        const sheetId = sheet.properties.sheetId;
        
        console.log(`📄 시트 "${sheetTitle}" 데이터 추출 중...`);
        
        try {
          // 각 시트의 전체 데이터 가져오기 (A1부터 끝까지)
          const range = `${sheetTitle}!A1:ZZ1000`; // 충분히 큰 범위로 설정
          const sheetData = await this.getSheetData(fileId, range);
          
          if (sheetData && sheetData.values && sheetData.values.length > 0) {
            // 빈 행과 열 제거
            const cleanedData = this.cleanSheetData(sheetData.values);
            
            if (cleanedData.length > 0) {
              allSheetsData.push({
                sheetTitle: sheetTitle,
                sheetId: sheetId,
                data: cleanedData
              });
              console.log(`✅ 시트 "${sheetTitle}": ${cleanedData.length}행 데이터 추출 완료`);
            }
          }
        } catch (sheetError) {
          console.warn(`⚠️ 시트 "${sheetTitle}" 데이터 추출 실패:`, sheetError.message);
          continue; // 다음 시트로 계속 진행
        }
      }
      
      if (allSheetsData.length === 0) {
        throw new Error('모든 시트에서 데이터를 가져오는데 실패했습니다.');
      }
      
      // 3. 모든 시트 데이터를 하나의 문자열로 포맷팅
      const formattedContent = this.formatSheetsDataForLLM(allSheetsData);
      
      console.log('✅ Google Sheets 데이터 추출 및 포맷팅 완료:', formattedContent.length, '글자');
      return formattedContent;
      
    } catch (error) {
      console.error('❌ Google Sheets API 접근 실패:', error);
      throw new Error(`Google Sheets 데이터 추출 실패: ${error.message}`);
    }
  }
  
  // CSV를 읽기 쉬운 텍스트로 변환
  convertCSVToReadableText(csvContent) {
    try {
      if (!csvContent || typeof csvContent !== 'string') return ''
      
      const lines = csvContent.split('\n').filter(line => line.trim())
      if (lines.length === 0) return '빈 CSV 파일입니다.'
      
      // CSV 파싱 (쉼표로 구분된 값 처리)
      const parsedData = lines.map((line, index) => {
        // CSV 라인을 셀로 분할 (쉼표로 구분, 따옴표 처리)
        const cells = []
        let currentCell = ''
        let inQuotes = false
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i]
          
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === ',' && !inQuotes) {
            cells.push(currentCell.trim().replace(/^"|"$/g, ''))
            currentCell = ''
          } else {
            currentCell += char
          }
        }
        
        // 마지막 셀 추가
        cells.push(currentCell.trim().replace(/^"|"$/g, ''))
        
        return cells
      })
      
      // 헤더와 데이터 분리
      const headers = parsedData[0] || []
      const dataRows = parsedData.slice(1)
      
      // 읽기 쉬운 텍스트 생성
      let readableText = '스프레드시트 내용:\n\n'
      
      // 헤더 정보
      if (headers.length > 0) {
        readableText += '컬럼: ' + headers.join(' | ') + '\n'
        readableText += '─'.repeat(headers.join(' | ').length) + '\n\n'
      }
      
      // 데이터 행
      dataRows.forEach((row, index) => {
        if (row.length > 0 && row.some(cell => cell.trim())) {
          readableText += `행 ${index + 1}: ${row.join(' | ')}\n`
        }
      })
      
      // 요약 정보
      readableText += `\n총 ${dataRows.length}행의 데이터가 있습니다.`
      
      return readableText
    } catch (error) {
      console.error('CSV 변환 실패:', error)
      // 에러 발생 시 원본 내용 반환
      return `CSV 파일 내용:\n\n${csvContent}`
    }
  }
  
  async getGoogleDriveContent(url) {
    console.log('Google Drive 처리 시작 - 원본 URL:', url);
    
    const fileId = this.extractFileId(url);
    if (!fileId) {
      throw new Error('Google Drive 파일 ID를 추출할 수 없습니다.');
    }

    console.log('파일 확장자 감지 시작:', fileId);
    
    // 파일 확장자 감지
    const fileExtension = await this.detectFileExtension(fileId);
    console.log('감지된 파일 확장자:', fileExtension);
    
    // 텍스트 파일인 경우 직접 처리
    if (fileExtension === 'txt') {
      console.log('텍스트 파일 감지, 직접 처리...');
      return await this.getTextFileContent(fileId);
    }
    
    // Google Docs/Sheets로 리다이렉트되는 경우
    if (fileExtension === 'docx' || fileExtension === 'doc') {
      console.log('Word 문서 감지, Google Docs로 처리...');
      const docsUrl = `https://docs.google.com/document/d/${fileId}/preview`;
      return await this.getGoogleDocsContent(docsUrl);
    }
    
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      console.log('Excel 문서 감지, Google Sheets로 처리...');
      const sheetsUrl = `https://docs.google.com/spreadsheets/d/${fileId}/preview`;
      return await this.getGoogleSheetsContent(sheetsUrl);
    }
    
    // 기타 파일 형식은 일반 웹 콘텐츠로 처리
    console.log('기타 파일 형식, 일반 웹 콘텐츠로 처리...');
    return await this.getWebContentWithProxy(url);
  }
  
  // 파일 확장자 감지
  async detectFileExtension(fileId) {
    try {
      // Google Drive API를 통한 파일 정보 가져오기
      const driveUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
      const content = await this.getWebContentWithProxy(driveUrl);
      
      if (content) {
        // HTML 메타데이터에서 파일명 추출
        const fileNameMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (fileNameMatch) {
          const fileName = fileNameMatch[1];
          console.log('파일명 감지:', fileName);
          
          // 파일명에서 확장자 추출
          const extensionMatch = fileName.match(/\.([a-zA-Z0-9]+)$/);
          if (extensionMatch) {
            const extension = extensionMatch[1].toLowerCase();
            console.log('파일명에서 확장자 감지:', extension);
            return extension;
          }
        }
        
        // HTML 내용에서 파일 형식 힌트 찾기
        if (content.includes('Google Docs') || content.includes('document')) {
          console.log('HTML 내용에서 Google Docs 감지');
          return 'gdoc';
        }
        
        if (content.includes('Google Sheets') || content.includes('spreadsheet')) {
          console.log('HTML 내용에서 Google Sheets 감지');
          return 'gsheet';
        }
        
        // 텍스트 패턴으로 TXT 파일로 추측
        if (content.length > 1000 && !content.includes('<html') && !content.includes('<HTML')) {
          console.log('텍스트 패턴으로 TXT 파일로 추측');
          return 'txt';
        }
      }
      
      // 기본값으로 txt 반환
      console.log('확장자 감지 실패, 기본값 txt 사용');
      return 'txt';
      
    } catch (error) {
      console.error('파일 확장자 감지 실패:', error);
      return 'txt'; // 기본값
    }
  }
  
  // 바이너리 데이터인지 확인
              isBinaryContent(content) {
              if (!content || typeof content !== 'string') return false;
              
              // Gzip 압축 데이터 감지 (매우 중요!)
              if (content.charCodeAt(0) === 0x1f && content.charCodeAt(1) === 0x8b) {
                console.log('🚨 Gzip 압축 데이터 감지됨!');
                return true;
              }
    
    // 바이너리 점수 계산
    let binaryScore = 0;
    const sampleSize = Math.min(content.length, 1000);
    
    for (let i = 0; i < sampleSize; i++) {
      const charCode = content.charCodeAt(i);
      
      // 제어 문자 (0-31, 127-159)
      if ((charCode >= 0 && charCode <= 31) || (charCode >= 127 && charCode <= 159)) {
        binaryScore++;
      }
      
      // null 문자
      if (charCode === 0) {
        binaryScore += 10; // null 문자는 매우 높은 가중치
      }
    }
    
    const binaryRatio = binaryScore / sampleSize;
    const threshold = 0.1; // 10% 이상이면 바이너리로 간주
    
    console.log(`바이너리 점수: ${binaryScore}/${sampleSize} (${(binaryRatio * 100).toFixed(1)}%), 임계값: ${(threshold * 100).toFixed(1)}%`);
    
    return binaryRatio > threshold;
  }
  
  // Google Docs 전용 텍스트 검증
  isGoogleDocsText(content) {
    if (!content || typeof content !== 'string') return false
    
    // Google Docs 특성 확인
    const googleDocsPatterns = [
      /Google Docs/i,
      /Document/i,
      /Created with/i,
      /<!DOCTYPE html/i,
      /<html/i,
      /<body/i
    ]
    
    let patternCount = 0
    for (const pattern of googleDocsPatterns) {
      if (pattern.test(content)) {
        patternCount++
      }
    }
    
    // Google Docs 패턴이 2개 이상 있으면 Google Docs 텍스트로 판단
    return patternCount >= 2
  }
  
  // URL에서 파일 확장자 추출
  getFileExtensionFromUrl(url) {
    try {
      // URL에서 파일명 추출
      const fileName = url.split('/').pop().split('?')[0]
      const extension = fileName.split('.').pop().toLowerCase()
      
      // 일반적인 문서 확장자 확인
      if (['docx', 'doc', 'txt', 'pdf', 'rtf', 'xlsx', 'xls', 'csv'].includes(extension)) {
        return extension
      }
      
      // URL 패턴으로 확장자 추측
      if (url.includes('docx') || url.includes('document') || url.includes('word')) {
        return 'docx'
      } else if (url.includes('xlsx') || url.includes('spreadsheet') || url.includes('excel')) {
        return 'xlsx'
      } else if (url.includes('txt') || url.includes('text')) {
        return 'txt'
      } else if (url.includes('pdf')) {
        return 'pdf'
      } else if (url.includes('csv')) {
        return 'csv'
      }
      
      // Google Drive 파일 ID만 있는 경우, 파일 형식 추측이 어려움
      if (url.includes('drive.google.com/file/d/')) {
        console.log('Google Drive 파일 ID만 감지, 파일 형식 추측 어려움')
        return 'unknown'
      }
      
      return 'unknown'
    } catch (error) {
      console.log('파일 확장자 추출 실패:', error.message)
      return 'unknown'
    }
  }
  
  // DOCX 파일 내용 가져오기
  async getDocxContent(fileId) {
    try {
      console.log('DOCX 파일 처리 시작:', fileId)
      
      // DOCX 파일을 위한 여러 URL 시도
      const docxUrls = [
        `https://docs.google.com/document/d/${fileId}/export?format=docx`,
        `https://drive.google.com/uc?export=download&id=${fileId}`,
        `https://docs.google.com/document/d/${fileId}/preview`
      ]
      
      for (const docxUrl of docxUrls) {
        try {
          console.log(`DOCX URL 시도 중: ${docxUrl}`)
          const content = await this.getWebContentWithProxy(docxUrl)
          
          if (content && content.trim()) {
            // DOCX 파일인 경우 특별 처리
            if (this.isDocxContent(content)) {
              console.log('DOCX 파일 감지, 텍스트 추출 시도...')
              const extractedText = this.extractTextFromDocx(content)
              if (extractedText && extractedText.trim()) {
                console.log('DOCX에서 텍스트 추출 성공')
                return extractedText.trim()
              }
            }
            
            // 일반 텍스트로 처리 시도
            if (!this.isBinaryContent(content)) {
              const textContent = this.extractTextFromHTML(content)
              if (textContent && textContent.trim()) {
                console.log('DOCX를 일반 텍스트로 처리 성공')
                return textContent.trim()
              }
            }
          }
        } catch (error) {
          console.log(`DOCX URL ${docxUrl} 시도 실패:`, error.message)
          continue
        }
      }
      
      throw new Error('DOCX 파일 내용을 가져올 수 없습니다.')
    } catch (error) {
      console.error('DOCX 파일 처리 실패:', error)
      return this.getFallbackTextByUrlPattern(`https://drive.google.com/file/d/${fileId}`)
    }
  }
  
  // DOCX 파일인지 확인
  isDocxContent(content) {
    if (!content || typeof content !== 'string') return false
    
    // DOCX 파일의 특징적인 패턴 확인
    const docxPatterns = [
      /PK\x03\x04/, // ZIP 파일 시그니처 (DOCX는 ZIP 기반)
      /\[Content_Types\]\.xml/,
      /_rels\/\.rels/,
      /word\/document\.xml/
    ]
    
    for (const pattern of docxPatterns) {
      if (pattern.test(content)) {
        return true
      }
    }
    
    return false
  }
  
  // DOCX 파일에서 텍스트 추출
  extractTextFromDocx(content) {
    try {
      // DOCX는 ZIP 기반이므로 간단한 텍스트 추출 시도
      // 실제로는 더 복잡한 파싱이 필요하지만, 기본적인 방법으로 시도
      
      // XML 태그 제거 시도
      let text = content
        .replace(/<[^>]+>/g, '') // XML/HTML 태그 제거
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ') // 연속된 공백 정리
        .trim()
      
      // 의미있는 텍스트가 있는지 확인
      if (text && text.length > 50 && /[가-힣a-zA-Z]/.test(text)) {
        return text
      }
      
      // 실패 시 원본 반환
      return content
    } catch (error) {
      console.error('DOCX 텍스트 추출 실패:', error)
      return content
    }
  }
  
  // Excel 파일 내용 가져오기
  async getExcelContent(fileId) {
    try {
      console.log('Excel 파일 처리 시작:', fileId)
      
      // Excel 파일을 위한 여러 URL 시도
      const excelUrls = [
        // 방법 1: Google Sheets CSV export (CORS 문제 없음)
        `https://docs.google.com/spreadsheets/d/${fileId}/export?format=csv`,
        // 방법 2: Google Sheets preview (CORS 문제 없음)
        `https://docs.google.com/spreadsheets/d/${fileId}/preview`,
        // 방법 3: Google Sheets 편집 페이지 (CORS 문제 없음)
        `https://docs.google.com/spreadsheets/d/${fileId}/edit`,
        // 방법 4: Google Sheets 공개 링크 (CORS 문제 없음)
        `https://docs.google.com/spreadsheets/d/${fileId}/pub`
      ]
      
      for (let i = 0; i < excelUrls.length; i++) {
        try {
          const excelUrl = excelUrls[i]
          console.log(`Excel URL 방법 ${i + 1} 시도 중: ${excelUrl}`)
          const content = await this.getWebContentWithProxy(excelUrl)
          
          if (content && content.trim()) {
            // CSV 형식인 경우
            if (excelUrl.includes('format=csv') || content.includes(',') && content.includes('\n')) {
              console.log('CSV 형식 감지, 텍스트 변환...')
              const csvText = this.convertCSVToReadableText(content)
              if (csvText && csvText.trim().length > 50) {
                console.log(`Excel 방법 ${i + 1} 성공 (CSV)`)
                return csvText.trim()
              }
            }
            
            // HTML 형식인 경우
            if (content.includes('<html') || content.includes('<table')) {
              console.log('HTML 형식 감지, 텍스트 추출...')
              const extractedText = this.extractTextFromHTML(content)
              if (extractedText && extractedText.trim().length > 50) {
                console.log(`Excel 방법 ${i + 1} 성공 (HTML)`)
                return extractedText.trim()
              }
            }
            
            // 일반 텍스트로 처리 시도
            if (!this.isBinaryContent(content)) {
              const textContent = this.extractTextFromHTML(content)
              if (textContent && textContent.trim().length > 50) {
                console.log(`Excel 방법 ${i + 1} 성공 (일반 텍스트)`)
                return textContent.trim()
              }
            }
          }
        } catch (error) {
          console.log(`Excel URL 방법 ${i + 1} 실패:`, error.message)
          continue
        }
      }
      
      throw new Error('Excel 파일 내용을 가져올 수 없습니다.')
    } catch (error) {
      console.error('Excel 파일 처리 실패:', error)
      return this.getFallbackTextByUrlPattern(`https://drive.google.com/file/d/${fileId}`)
    }
  }
  
  // 텍스트 파일 내용 가져오기
  async getTextFileContent(fileId) {
    try {
      console.log('텍스트 파일 처리 시작:', fileId)
      
      // 텍스트 파일을 위한 여러 URL 시도 (순수 텍스트 우선)
      const textUrls = [
        // 방법 1: Google Drive 직접 다운로드 (순수 텍스트, 최우선)
        `https://drive.google.com/uc?export=download&id=${fileId}`,
        `https://drive.google.com/uc?export=view&id=${fileId}`,
        // 방법 2: Google Drive 공개 공유 링크 (텍스트 파일용)
        `https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
        // 방법 3: Google Docs로 변환된 경우를 위한 텍스트 추출
        `https://docs.google.com/document/d/${fileId}/export?format=txt`,
        `https://docs.google.com/document/d/${fileId}/export?format=plain`,
        // 방법 4: Google Docs/Sheets preview (HTML에서 텍스트 추출)
        `https://docs.google.com/document/d/${fileId}/preview`,
        `https://docs.google.com/spreadsheets/d/${fileId}/preview`,
        // 방법 5: Google Docs/Sheets 편집 페이지 (HTML에서 텍스트 추출)
        `https://docs.google.com/document/d/${fileId}/edit`,
        `https://docs.google.com/spreadsheets/d/${fileId}/edit`,
        // 방법 6: Google Docs/Sheets 공개 링크 (HTML에서 텍스트 추출)
        `https://docs.google.com/document/d/${fileId}/pub`,
        `https://docs.google.com/spreadsheets/d/${fileId}/pub`
      ]
      
      for (let i = 0; i < textUrls.length; i++) {
        try {
          const textUrl = textUrls[i]
          console.log(`텍스트 파일 URL 방법 ${i + 1} 시도 중: ${textUrl}`)
          const content = await this.getWebContentWithProxy(textUrl)
          
          if (content && content.trim()) {
            // Base64 데이터 처리
            if (content.startsWith('data:')) {
              console.log(`방법 ${i + 1}: Base64 데이터 감지, 디코딩 시도`);
              try {
                const base64Data = content.split(',')[1];
                if (base64Data) {
                  // 여러 디코딩 방법 시도
                  const decodingMethods = [
                    // 방법 1: UTF-8 디코딩
                    () => {
                      const binaryString = atob(base64Data);
                      const bytes = new Uint8Array(binaryString.length);
                      for (let j = 0; j < binaryString.length; j++) {
                        bytes[j] = binaryString.charCodeAt(j);
                      }
                      return new TextDecoder('utf-8').decode(bytes);
                    },
                    // 방법 2: 단순 atob + escape/decodeURIComponent
                    () => decodeURIComponent(escape(atob(base64Data))),
                    // 방법 3: 단순 atob
                    () => atob(base64Data)
                  ];
                  
                  for (let methodIdx = 0; methodIdx < decodingMethods.length; methodIdx++) {
                    try {
                      const decodedContent = decodingMethods[methodIdx]();
                      console.log(`방법 ${i + 1}, 디코딩 ${methodIdx + 1}: ${decodedContent.substring(0, 100)}...`);
                      
                      if (decodedContent && decodedContent.trim().length > 10) {
                        // 간단한 텍스트 검증: 바이너리 데이터가 아닌지 확인
                        const isBinary = this.isBinaryContent(decodedContent);
                        
                        if (!isBinary) {
                          console.log(`텍스트 파일 방법 ${i + 1} 성공 (Base64 디코딩 ${methodIdx + 1}) - 텍스트 데이터 확인됨`);
                          return decodedContent.trim();
                        } else {
                          console.log(`방법 ${i + 1}, 디코딩 ${methodIdx + 1}: 바이너리 데이터로 판단됨`);
                        }
                      }
                    } catch (decodeError) {
                      console.log(`방법 ${i + 1}, 디코딩 ${methodIdx + 1} 실패:`, decodeError);
                    }
                  }
                }
              } catch (base64Error) {
                console.log(`방법 ${i + 1}: Base64 처리 실패:`, base64Error);
              }
            }
            
            // 바이너리 데이터가 아닌 경우
            if (!this.isBinaryContent(content)) {
              console.log(`방법 ${i + 1} 내용 미리보기:`, content.substring(0, 200))
              
              // HTML 감지 (더 정확한 감지)
              const isHTML = content.includes('<!DOCTYPE') || 
                           content.includes('<html') || 
                           content.includes('<head>') || 
                           content.includes('<body') ||
                           content.includes('<meta') ||
                           content.includes('<title>') ||
                           (content.includes('<') && content.includes('>') && content.includes('</'))
              
              if (isHTML) {
                console.log(`방법 ${i + 1}: HTML 컨텐츠 감지, 텍스트 추출 시도`)
                const extractedText = this.extractTextFromHtml(content)
                if (extractedText && extractedText.trim().length > 50) {
                  console.log(`텍스트 파일 방법 ${i + 1} 성공 (HTML에서 추출):`, extractedText.length, '글자')
                  return extractedText.trim()
                } else {
                  console.log(`방법 ${i + 1}: HTML에서 추출된 텍스트가 너무 짧음 (${extractedText?.length || 0}글자)`)
                }
              } else {
                // 순수 텍스트인 경우
                if (content.trim().length > 10) {
                  console.log(`텍스트 파일 방법 ${i + 1} 성공 (순수 텍스트):`, content.trim().length, '글자')
                  return content.trim()
                } else {
                  console.log(`방법 ${i + 1}: 텍스트가 너무 짧음 (${content.trim().length}글자)`)
                }
              }
            } else {
              console.log(`방법 ${i + 1}: 바이너리 데이터로 판단됨`)
            }
          }
        } catch (error) {
          console.log(`텍스트 파일 URL 방법 ${i + 1} 실패:`, error.message)
          continue
        }
      }
      
      throw new Error('텍스트 파일 내용을 가져올 수 없습니다.')
    } catch (error) {
      console.error('텍스트 파일 처리 실패:', error)
      return this.getFallbackTextByUrlPattern(`https://drive.google.com/file/d/${fileId}`)
    }
  }
  
  // PDF 파일 내용 가져오기
  async getPdfContent(fileId) {
    try {
      console.log('PDF 파일 처리 시작:', fileId)
      
      // PDF 파일을 위한 여러 URL 시도
      const pdfUrls = [
        // 방법 1: Google Docs/Sheets preview (CORS 문제 없음)
        `https://docs.google.com/document/d/${fileId}/preview`,
        `https://docs.google.com/spreadsheets/d/${fileId}/preview`,
        // 방법 2: Google Docs/Sheets 편집 페이지 (CORS 문제 없음)
        `https://docs.google.com/document/d/${fileId}/edit`,
        `https://docs.google.com/spreadsheets/d/${fileId}/edit`,
        // 방법 3: Google Docs/Sheets 공개 링크 (CORS 문제 없음)
        `https://docs.google.com/document/d/${fileId}/pub`,
        `https://docs.google.com/spreadsheets/d/${fileId}/pub`
      ]
      
      for (let i = 0; i < pdfUrls.length; i++) {
        try {
          const pdfUrl = pdfUrls[i]
          console.log(`PDF URL 방법 ${i + 1} 시도 중: ${pdfUrl}`)
          const content = await this.getWebContentWithProxy(pdfUrl)
          
          if (content && content.trim()) {
            // PDF 텍스트 추출 시도
            const extractedText = this.extractTextFromPDF(content)
            if (extractedText && extractedText.trim().length > 50) {
              console.log(`PDF 방법 ${i + 1} 성공`)
              return extractedText.trim()
            }
            
            // HTML인 경우 태그 제거
            if (content.includes('<html') || content.includes('<body')) {
              const htmlText = this.extractTextFromHTML(content)
              if (htmlText && htmlText.trim().length > 50) {
                console.log(`PDF 방법 ${i + 1} 성공 (HTML)`)
                return htmlText.trim()
              }
            }
          }
        } catch (error) {
          console.log(`PDF URL 방법 ${i + 1} 실패:`, error.message)
          continue
        }
      }
      
      throw new Error('PDF 파일 내용을 가져올 수 없습니다.')
    } catch (error) {
      console.error('PDF 파일 처리 실패:', error)
      return this.getFallbackTextByUrlPattern(`https://drive.google.com/file/d/${fileId}`)
    }
  }
  
  // URL 패턴 기반 폴백 텍스트 생성
  getFallbackTextByUrlPattern(url) {
    console.log('폴백 텍스트 생성:', url)
    
    // URL 패턴에 따라 샘플 텍스트 반환
    if (url.includes('source') || url.includes('원문') || url.includes('source')) {
      return `웹소설 원문 (${url}에서 가져온 내용):

"안녕하세요, 저는 주인공입니다."
그녀가 말했다. 오늘은 특별한 날이었다.
창밖으로 보이는 풍경이 아름다웠고, 
새로운 모험이 시작될 것 같은 예감이 들었다.

"정말 흥미진진한 이야기가 될 것 같아요."
그는 미소를 지으며 대답했다.

※ 실제 URL에서 텍스트를 가져오지 못해 샘플 텍스트를 표시합니다.`
    } else if (url.includes('baseline') || url.includes('번역') || url.includes('translation')) {
      return `기본 번역문 (${url}에서 가져온 내용):

「こんにちは、私は主人公です。」
彼女は言った。今日は特別な日だった。
窓の外に見える風景が美しく、
新しい冒険が始まりそうな予感がした。

「本当に興味深い物語になりそうですね。」
彼は微笑みながら答えた。

※ 실제 URL에서 텍스트를 가져오지 못해 샘플 텍스트를 표시합니다.`
    } else if (url.includes('settings') || url.includes('설정')) {
      return `작품 설정집 (${url}에서 가져온 내용):

주인공: 김민수 (20세, 대학생)
배경: 현대 서울
장르: 로맨스 판타지
톤앤매너: 밝고 유쾌한 분위기
특별 설정: 주인공은 특별한 능력을 가지고 있음

※ 실제 URL에서 텍스트를 가져오지 못해 샘플 텍스트를 표시합니다.`
    } else if (url.includes('guide') || url.includes('프롬프트') || url.includes('prompt')) {
      return `번역 가이드 프롬프트 (${url}에서 가져온 내용):

1. 자연스러운 일본어로 번역하세요
2. 캐릭터의 성격을 잘 드러내는 말투를 사용하세요
3. 문화적 차이를 고려하여 의역하세요
4. 존댓말과 반말을 적절히 구분하세요

※ 실제 URL에서 텍스트를 가져오지 못해 샘플 텍스트를 표시합니다.`
    }
    
    return `텍스트 파일 내용 (${url}):

실제 URL에서 텍스트를 가져오지 못했습니다.
URL이 올바른지 확인하고, 파일이 공개되어 있는지 확인해주세요.

※ 이것은 폴백 메시지입니다.`
  }

  // 특정 과제의 상세 정보 가져오기
  async getProjectDetail(projectId) {
    try {
      const projects = await this.getProjectData()
      const project = projects.find(p => p.id === projectId)
      
      if (!project) {
        throw new Error('과제를 찾을 수 없습니다.')
      }
      
      console.log('🔍 과제 상세 정보 로드 시작:', {
        projectId,
        projectTitle: project.title,
        pathSource: project.pathSource,
        pathBaselineTranslation: project.pathBaselineTranslation,
        pathSeriesSettings: project.pathSeriesSettings,
        pathGuidePrompt: project.pathGuidePrompt,
        pathBasecampPrompt: project.pathBasecampPrompt,  // ⭐ 베이스캠프 프롬프트 URL 추가
        pathContext: project.pathContext  // ⭐ contextAnalysis URL 추가
      })
      
      // URL 유효성 검사 및 기본값 설정 (Step별로 다르게)
      // Step 값에서 숫자만 추출 (예: "Step 3" → 3, "3" → 3)
      const stepOrder = parseInt(project.step.toString().replace(/\D/g, '')) || 1
      const isStep1 = stepOrder === 1
      
      console.log(`🔍 Step 파싱 디버그: 원본값="${project.step}", 추출된 숫자=${stepOrder}, isStep1=${isStep1}`)
      
      const sourceUrl = project.pathSource || null
      const baselineUrl = project.pathBaselineTranslation || null
      const settingsUrl = project.pathSeriesSettings || null
      const contextUrl = project.pathContext || null // ⭐ 새로 추가: 맥락 분석 JSON 파일 URL
      const guideUrl = project.pathGuidePrompt || null // 모든 Step에서 가이드 프롬프트 URL 제공
      const basecampUrl = project.pathBasecampPrompt || null // ⭐ 새로 추가: 베이스캠프 프롬프트 URL
      
      console.log(`🔍 프로젝트 상세 정보:`, {
        id: project.id,
        title: project.title,
        step: project.step,
        pathGuidePrompt: project.pathGuidePrompt,
        guideUrl: guideUrl,
        pathGuidePromptType: typeof project.pathGuidePrompt,
        pathGuidePromptLength: project.pathGuidePrompt?.length,
        pathGuidePromptIsEmpty: project.pathGuidePrompt === '',
        pathGuidePromptIsNull: project.pathGuidePrompt === null,
        pathGuidePromptIsUndefined: project.pathGuidePrompt === undefined,
        pathGuidePromptIsNA: project.pathGuidePrompt === '#N/A',
        pathBasecampPrompt: project.pathBasecampPrompt,
      })
      
      // Step별 가이드 프롬프트 처리 방식 결정
      
      console.log(`📋 Step ${stepOrder} 과제 처리: 가이드 프롬프트 ${isStep1 ? '필수' : '선택적'}`)
      
      // 링크에서 실제 텍스트 내용 로드 (Step별로 다르게 처리)
      let sourceText, baselineTranslationText, settingsText, guidePromptText, contextAnalysisText = ''
      
      if (isStep1) {
        // Step 1: 모든 정보 필수 (AI 자동 번역용)
        console.log('🔍 Step 1 URL 확인:', {
          sourceUrl,
          settingsUrl,
          guideUrl,
          sourceUrlType: typeof sourceUrl,
          sourceUrlValid: !!(sourceUrl && sourceUrl.startsWith && (sourceUrl.startsWith('http://') || sourceUrl.startsWith('https://'))),
          projectData: {
            pathSource: project.pathSource,
            id: project.id,
            title: project.title,
            episode: project.episode
          }
        })
        
        ;[sourceText, settingsText, contextAnalysisText, guidePromptText] = await Promise.all([
          sourceUrl ? this.getTextFromUrl(sourceUrl) : '원문 URL이 제공되지 않았습니다.',
          settingsUrl ? this.getTextFromUrl(settingsUrl) : '설정집 URL이 제공되지 않았습니다.',
          contextUrl ? this.getTextFromUrl(contextUrl) : '', // ⭐ 맥락 분석 JSON 파일 가져오기
          guideUrl ? this.getTextFromUrl(guideUrl) : '가이드 프롬프트 URL이 제공되지 않았습니다.'
        ])
        
        // 🔄 파일 내용 캐시에 저장 (변경점 감지용)
        if (sourceUrl && sourceText) {
          this.apiCache.set(`cached_source_${project.id}`, {
            data: sourceText,
            timestamp: Date.now()
          })
          console.log(`💾 원문 텍스트 캐시 저장: ${sourceText.length}자`)
        }
        
        if (settingsUrl && settingsText) {
          this.apiCache.set(`cached_settings_${project.id}`, {
            data: settingsText,
            timestamp: Date.now()
          })
          console.log(`💾 설정집 캐시 저장: ${settingsText.length}자`)
        }
        
        if (contextUrl && contextAnalysisText) {
          this.apiCache.set(`cached_context_${project.id}`, {
            data: contextAnalysisText,
            timestamp: Date.now()
          })
          console.log(`💾 맥락 분석 캐시 저장: ${contextAnalysisText.length}자`)
        }
        
        if (guideUrl && guidePromptText) {
          this.apiCache.set(`cached_guide_${project.id}`, {
            data: guidePromptText,
            timestamp: Date.now()
          })
          console.log(`💾 가이드 프롬프트 캐시 저장: ${guidePromptText.length}자`)
        }
        
        console.log('🔍 Step 1 텍스트 로드 결과:', {
          sourceTextLength: sourceText?.length || 0,
          sourceTextPreview: sourceText?.substring(0, 200) || 'N/A',
          settingsTextLength: settingsText?.length || 0,
          contextAnalysisLength: contextAnalysisText?.length || 0,
          guideTextLength: guidePromptText?.length || 0
        })
        
        // Step 1: 기본 번역문 처리 (고정 번역문 시스템)
        if (baselineUrl) {
          baselineTranslationText = await this.getTextFromUrl(baselineUrl)
        } else {
          // 🔒 기존에 생성된 기본 번역문이 있는지 localStorage에서 확인
          const savedBaselineKey = `baseline_translation_${project.id || project.title}_${project.episode || 'default'}`
          let savedBaseline = localStorage.getItem(savedBaselineKey)
          
          if (savedBaseline) {
            try {
              const parsedBaseline = JSON.parse(savedBaseline)
              if (parsedBaseline && parsedBaseline.translation && parsedBaseline.translation.length > 50) {
                baselineTranslationText = parsedBaseline.translation
                console.log('🔒 기존 저장된 기본 번역문 사용 (고정):', baselineTranslationText.length, '글자')
                console.log('📅 생성 시간:', parsedBaseline.createdAt)
              } else {
                throw new Error('저장된 번역문이 너무 짧음')
              }
            } catch (parseError) {
              console.warn('⚠️ 저장된 기본 번역문 파싱 실패, 새로 생성:', parseError.message)
              savedBaseline = null // 새로 생성하도록 설정
            }
          }
          
          // 저장된 번역문이 없으면 새로 생성
          if (!savedBaseline) {
            console.log('🚀 Step 1: 기본 번역문이 없어서 Gemini LLM으로 생성 시작...')
            try {
              const geminiService = getGeminiService()
              if (geminiService) {
                // 타겟 언어 추출
                const targetLanguage = this.extractTargetLanguage(project.languagePair)
                console.log('🎯 Gemini 번역 대상 언어:', targetLanguage)
            
                // Gemini LLM으로 번역 수행 (맥락 분석 포함)
                console.log('🔍 기본 번역문 생성에 사용될 맥락 분석:', contextAnalysisText?.length || 0, '글자')
                
                // 현재 로그인된 사용자 정보 가져오기
                const currentUser = emailAuthService.getCurrentUser()
                const userEmail = currentUser?.email || null
                
                console.log('👤 기본 번역문 생성 시 사용자 정보:', {
                  hasCurrentUser: !!currentUser,
                  userEmail: userEmail
                })
                
                baselineTranslationText = await geminiService.translateWithGemini(
                  sourceText,
                  targetLanguage,
                  settingsText,
                  guidePromptText,
                  '', // userPrompt
                  userEmail, // ⭐ 현재 로그인된 사용자의 API Key 사용
                  contextAnalysisText // ⭐ 맥락 분석 JSON 텍스트 추가
                )
                console.log('✅ Gemini LLM 기본 번역문 생성 완료:', baselineTranslationText.length)
                
                // 🔒 생성된 기본 번역문을 localStorage에 고정 저장
                const baselineData = {
                  translation: baselineTranslationText,
                  createdAt: new Date().toISOString(),
                  sourceTextHash: this.generateTextHash(sourceText),
                  settingsHash: this.generateTextHash(settingsText),
                  contextAnalysisHash: this.generateTextHash(contextAnalysisText), // ⭐ 맥락 분석 해시 추가
                  guideHash: this.generateTextHash(guidePromptText),
                  projectInfo: {
                    id: project.id,
                    title: project.title,
                    episode: project.episode,
                    languagePair: project.languagePair
                  }
                }
                localStorage.setItem(savedBaselineKey, JSON.stringify(baselineData))
                console.log('💾 기본 번역문 고정 저장 완료:', savedBaselineKey)
                
              } else {
                baselineTranslationText = 'Gemini API 키가 설정되지 않았습니다.'
                console.warn('⚠️ Gemini API 키 미설정')
              }
            } catch (error) {
              console.error('❌ Gemini LLM 기본 번역문 생성 실패:', error)
              baselineTranslationText = 'Gemini LLM 번역 실패: ' + error.message
            }
          }
        }
      } else {
        // Step 2,3,4: 가이드 프롬프트도 포함하여 로드 (선택적)
        // 가이드 프롬프트 URL이 유효하지 않아도 전체 로딩이 실패하지 않도록 개별 처리
        const loadGuidePrompt = async () => {
          if (!guideUrl || guideUrl === '#N/A') {
            return null
          }
          
          // URL 유효성 간단 체크
          if (!guideUrl.startsWith('http://') && !guideUrl.startsWith('https://')) {
            console.warn('⚠️ 유효하지 않은 가이드 프롬프트 URL:', guideUrl)
            return null
          }
          
          try {
            return await this.getTextFromUrl(guideUrl)
          } catch (error) {
            console.warn('⚠️ 가이드 프롬프트 로딩 실패, 계속 진행:', error.message)
            return null
          }
        }
        
        console.log('🔍 Step 2,3,4 URL 확인:', {
          sourceUrl,
          baselineUrl,
          settingsUrl,
          guideUrl,
          sourceUrlType: typeof sourceUrl,
          sourceUrlValid: !!(sourceUrl && sourceUrl.startsWith && (sourceUrl.startsWith('http://') || sourceUrl.startsWith('https://'))),
          baselineUrlValid: !!(baselineUrl && baselineUrl.startsWith && (baselineUrl.startsWith('http://') || baselineUrl.startsWith('https://'))),
          projectData: {
            pathSource: project.pathSource,
            pathBaselineTranslation: project.pathBaselineTranslation,
            id: project.id,
            title: project.title,
            episode: project.episode
          }
        })
        
        console.log('🔄 Step 2,3,4 텍스트 로딩 시작...')
        ;[sourceText, baselineTranslationText, settingsText, contextAnalysisText, guidePromptText] = await Promise.all([
          sourceUrl ? this.getTextFromUrl(sourceUrl) : '원문 URL이 제공되지 않았습니다.',
          baselineUrl ? this.getTextFromUrl(baselineUrl) : '기본 번역문 URL이 제공되지 않았습니다.',
          settingsUrl ? this.getTextFromUrl(settingsUrl) : '설정집 URL이 제공되지 않았습니다.',
          contextUrl ? this.getTextFromUrl(contextUrl) : '', // ⭐ 맥락 분석 JSON 파일 가져오기
          loadGuidePrompt()
        ])
        
        // 🔄 파일 내용 캐시에 저장 (변경점 감지용)
        if (sourceUrl && sourceText) {
          this.apiCache.set(`cached_source_${project.id}`, {
            data: sourceText,
            timestamp: Date.now()
          })
          console.log(`💾 원문 텍스트 캐시 저장: ${sourceText.length}자`)
        }
        
        if (baselineUrl && baselineTranslationText) {
          this.apiCache.set(`cached_baseline_${project.id}`, {
            data: baselineTranslationText,
            timestamp: Date.now()
          })
          console.log(`💾 기본 번역문 캐시 저장: ${baselineTranslationText.length}자`)
        }
        
        if (settingsUrl && settingsText) {
          this.apiCache.set(`cached_settings_${project.id}`, {
            data: settingsText,
            timestamp: Date.now()
          })
          console.log(`💾 설정집 캐시 저장: ${settingsText.length}자`)
        }
        
        if (contextUrl && contextAnalysisText) {
          this.apiCache.set(`cached_context_${project.id}`, {
            data: contextAnalysisText,
            timestamp: Date.now()
          })
          console.log(`💾 맥락 분석 캐시 저장: ${contextAnalysisText.length}자`)
        }
        
        if (guideUrl && guidePromptText) {
          this.apiCache.set(`cached_guide_${project.id}`, {
            data: guidePromptText,
            timestamp: Date.now()
          })
          console.log(`💾 가이드 프롬프트 캐시 저장: ${guidePromptText.length}자`)
        }
        
        console.log('✅ Step 2,3,4 텍스트 로딩 완료:', {
          sourceLength: sourceText?.length || 0,
          baselineLength: baselineTranslationText?.length || 0,
          settingsLength: settingsText?.length || 0,
          contextAnalysisLength: contextAnalysisText?.length || 0,
          guideLength: guidePromptText?.length || 0,
          guidePromptText: typeof guidePromptText
        })
        
        console.log('✅ Step 2,3,4: 기본 정보 + 가이드 프롬프트 로드 완료', {
          hasGuidePrompt: !!guidePromptText,
          guideUrl
        })
      }
      
      console.log('✅ 과제 상세 정보 로드 완료:', {
        sourceTextLength: sourceText?.length || 0,
        baselineTextLength: baselineTranslationText?.length || 0,
        settingsTextLength: settingsText?.length || 0,
        guideTextLength: guidePromptText?.length || 0
      })
      
      // 언어 페어에서 개별 언어 추출
      let sourceLanguage = '중국어' // 기본값
      let targetLanguage = '한국어' // 기본값
      
      if (project?.languagePair) {
        const languagePair = project.languagePair
        console.log('🔍 언어 페어 파싱 시작:', languagePair)
        
        // "source → target" 형식에서 언어 추출
        const match = languagePair.match(/^([^→]+)→\s*(.+)$/)
        if (match) {
          sourceLanguage = match[1].trim()
          targetLanguage = match[2].trim()
        } else {
          // 단일 언어인 경우 타겟 언어로 설정
          targetLanguage = languagePair.trim()
        }
      }
      
      console.log('🔍 추출된 언어 정보:', { sourceLanguage, targetLanguage })

      // 안전한 객체 반환 (undefined 키 방지)
      const result = {
        // project 기본 정보
        id: project?.id,
        title: project?.title || 'Unknown',
        episode: project?.episode,
        step: project?.step,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
        languagePair: project?.languagePair,
        pathSource: project?.pathSource,
        pathBaselineTranslation: project?.pathBaselineTranslation,
        pathSeriesSettings: project?.pathSeriesSettings,
        pathContext: project?.pathContext, // ⭐ 새로 추가: 맥락 분석 JSON 파일 URL
        pathGuidePrompt: project?.pathGuidePrompt,
        pathBasecampPrompt: project?.pathBasecampPrompt, // ⭐ 새로 추가: 베이스캠프 프롬프트 URL
        
        // 로드된 텍스트 데이터
        sourceText: sourceText || '', // 원문 텍스트
        baselineTranslationText: baselineTranslationText || '', // 기본 번역문 텍스트
        settingsText: settingsText || '', // 설정집 텍스트
        contextAnalysisText: contextAnalysisText || '', // ⭐ 새로 추가: 맥락 분석 JSON 텍스트
        guidePromptText: guidePromptText || '', // 가이드 프롬프트 텍스트
        guidePromptUrl: guideUrl || '' // 가이드 프롬프트 URL (모달용)
      }
      
      console.log('✅ 반환할 결과 객체 키 확인:', Object.keys(result))

      return result
    } catch (error) {
      console.error('과제 상세 정보 가져오기 실패:', error)
      throw error
    }
  }

  // Step 1용: Gemini LLM을 활용한 1차 번역 수행
  async generateBaselineTranslationWithGemini(projectId, projectDetail = null) {
    try {
      console.log('🚀 Step 1: Gemini LLM 1차 번역 시작')
      
      // 프로젝트 상세 정보가 전달되지 않은 경우 가져오기
      const detail = projectDetail || await this.getProjectDetail(projectId)
      
      if (!detail.sourceText || detail.sourceText === '원문 URL이 제공되지 않았습니다.') {
        throw new Error('원문 텍스트를 가져올 수 없습니다.')
      }
      
      // 타겟 언어 추출 - detail에서 직접 가져오기
      const targetLanguage = detail.targetLanguage
      console.log('🔍 언어 페어 구성:', `${detail.sourceLanguage} → ${detail.targetLanguage}`)
      console.log('🎯 번역 대상 언어:', targetLanguage)
      
      // Gemini 서비스 가져오기
      const geminiService = getGeminiService()
      
      // 현재 로그인된 사용자 이메일 가져오기
      const currentUser = emailAuthService.getCurrentUser()
      const userEmail = currentUser?.email || null
      
      console.log('👤 번역 요청 사용자:', userEmail)
      console.log('👤 현재 사용자 객체:', currentUser)
      console.log('👤 이메일 존재 여부:', !!userEmail)
      
      // Gemini LLM을 활용한 번역 수행 (사용자별 API Key 사용)
      const translatedText = await geminiService.translateWithGemini(
        detail.sourceText,
        targetLanguage,
        detail.settingsText,
        detail.guidePromptText,
        '', // userPrompt
        userEmail // 사용자별 API Key 사용
      )
      
      console.log('✅ Gemini LLM 1차 번역 완료:', {
        originalLength: detail.sourceText.length,
        translatedLength: translatedText.length,
        targetLanguage
      })
      
      return {
        ...detail,
        baselineTranslationText: translatedText, // Gemini로 생성된 번역문으로 교체
        isGeminiGenerated: true
      }
      
    } catch (error) {
      console.error('❌ Gemini LLM 1차 번역 실패:', error)
      throw error
    }
  }

  // 언어 쌍에서 타겟 언어 추출
  extractTargetLanguage(languagePair) {
    if (!languagePair || typeof languagePair !== 'string') {
      console.error('❌ 언어 페어가 제공되지 않았습니다:', languagePair)
      throw new Error('언어 페어 정보가 필요합니다. 과제 설정을 확인해주세요.')
    }
    
    console.log('🔍 언어 페어 파싱 시작:', languagePair)
    
    // 다양한 형식 지원: "zh-CN → ko", "en->ja", "ko", "ja" 등
    let targetLang = null
    
    // 1. "source → target" 형식 매칭
    let match = languagePair.match(/→\s*([a-zA-Z-]+)/)
    if (match) {
      targetLang = match[1].trim()
    } else {
      // 2. "source->target" 형식 매칭  
      match = languagePair.match(/->\s*([a-zA-Z-]+)/)
      if (match) {
        targetLang = match[1].trim()
      } else {
        // 3. 단일 언어 코드인 경우 (타겟 언어만 제공된 경우)
        if (/^[a-zA-Z-]+$/.test(languagePair.trim())) {
          targetLang = languagePair.trim()
        }
      }
    }
    
    if (!targetLang) {
      console.error('❌ 언어 페어에서 타겟 언어를 추출할 수 없습니다:', languagePair)
      throw new Error(`지원하지 않는 언어 페어 형식입니다: ${languagePair}`)
    }
    
    console.log('🔍 추출된 타겟 언어 코드:', targetLang)
    
    // 언어 코드를 사용자 친화적인 이름으로 변환 (확장 가능)
    const languageMap = {
      'ko': '한국어',
      'en': '영어', 
      'ja': '일본어',
      'zh-CN': '중국어 (간체)',
      'zh-TW': '중국어 (번체)',
      'zh': '중국어',
      'es': '스페인어',
      'fr': '프랑스어',
      'de': '독일어',
      'ru': '러시아어',
      'pt': '포르투갈어',
      'it': '이탈리아어',
      'ar': '아랍어',
      'hi': '힌디어',
      'th': '태국어',
      'vi': '베트남어',
      'id': '인도네시아어',
      'ms': '말레이어',
      'tl': '타갈로그어',
      'nl': '네덜란드어',
      'sv': '스웨덴어',
      'no': '노르웨이어',
      'da': '덴마크어',
      'fi': '핀란드어',
      'pl': '폴란드어',
      'cs': '체코어',
      'hu': '헝가리어',
      'ro': '루마니아어',
      'bg': '불가리아어',
      'hr': '크로아티아어',
      'sk': '슬로바키아어',
      'sl': '슬로베니아어',
      'et': '에스토니아어',
      'lv': '라트비아어',
      'lt': '리투아니아어'
    }
    
    const mappedLanguage = languageMap[targetLang] || targetLang
    console.log('🔍 매핑된 언어명:', mappedLanguage)
    return mappedLanguage
  }

  // 파일 ID 추출 헬퍼 함수
  extractFileId(url) {
    // Google Docs
    let match = url.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
    if (match) return match[1];
    
    // Google Sheets
    match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match) return match[1];
    
    // Google Drive
    match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (match) return match[1];
    
    return null;
  }



  // Gzip 압축 해제 시도 (클라이언트 측)
  async decompressGzip(compressedData) {
    try {
      // 브라우저에서 gzip 해제 시도
      if (typeof window !== 'undefined' && window.pako) {
        const uint8Array = new Uint8Array(compressedData.split('').map(c => c.charCodeAt(0)));
        const decompressed = window.pako.inflate(uint8Array, { to: 'string' });
        return decompressed;
      }
      
      // Node.js 환경에서 zlib 사용
      if (typeof require !== 'undefined') {
        const zlib = require('zlib');
        const buffer = Buffer.from(compressedData, 'binary');
        const decompressed = zlib.gunzipSync(buffer).toString('utf8');
        return decompressed;
      }
      
      return null;
    } catch (error) {
      console.error('Gzip 해제 실패:', error);
      return null;
    }
  }

  // 바이너리 데이터를 텍스트로 변환
  convertBinaryToText(binaryData) {
    try {
      // UTF-8 디코딩 시도
      const decoder = new TextDecoder('utf-8');
      const uint8Array = new Uint8Array(binaryData.split('').map(c => c.charCodeAt(0)));
      const textContent = decoder.decode(uint8Array);
      
      if (textContent && !this.isBinaryContent(textContent)) {
        console.log('UTF-8 디코딩 성공');
        return textContent.trim();
      }
    } catch (decodeError) {
      console.log('UTF-8 디코딩 실패, 다른 방법 시도...');
    }
    
    // 특수문자 제거 및 정리
    try {
      let cleanedContent = binaryData
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '') // 제어 문자 제거
        .replace(/[\uFFFD]/g, '') // replacement character 제거
        .replace(/[^\x20-\x7E\u00A0-\uFFFF\s]/g, ' ') // ASCII 범위 밖 문자를 공백으로
        .replace(/\s+/g, ' ') // 연속된 공백 정리
        .trim();
      
      if (cleanedContent && cleanedContent.length > 10) {
        console.log('특수문자 제거 후 텍스트:', cleanedContent.substring(0, 100) + '...');
        return cleanedContent;
      }
    } catch (cleanError) {
      console.log('텍스트 정리 실패:', cleanError.message);
    }
    
    return null;
  }

  // 스프레드시트 메타데이터 가져오기 (시트 목록 조회)
  async getSpreadsheetMetadata(spreadsheetId) {
    try {
      const url = `${this.baseUrl}/${spreadsheetId}?key=${this.apiKey}&fields=sheets.properties`;
      apiLog(`스프레드시트 메타데이터 API 호출`, { spreadsheetId }, 'request');
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }
      
      const data = await response.json();
      apiLog(`메타데이터 응답`, { sheetsCount: data.sheets?.length || 0 }, 'response');
      
      return data;
    } catch (error) {
      devError('스프레드시트 메타데이터 가져오기 실패:', error);
      throw error;
    }
  }

  // 시트 데이터 정리 (빈 행/열 제거)
  cleanSheetData(rawData) {
    if (!rawData || !Array.isArray(rawData)) return [];
    
    // 완전히 빈 행들을 제거
    const nonEmptyRows = rawData.filter(row => {
      return Array.isArray(row) && row.some(cell => cell && cell.toString().trim() !== '');
    });
    
    if (nonEmptyRows.length === 0) return [];
    
    // 오른쪽 끝의 빈 열들 제거
    const maxColumns = Math.max(...nonEmptyRows.map(row => row.length));
    let lastNonEmptyCol = 0;
    
    for (let col = 0; col < maxColumns; col++) {
      const hasData = nonEmptyRows.some(row => row[col] && row[col].toString().trim() !== '');
      if (hasData) {
        lastNonEmptyCol = col;
      }
    }
    
    // 각 행을 lastNonEmptyCol + 1까지만 자르기
    const cleanedData = nonEmptyRows.map(row => {
      return row.slice(0, lastNonEmptyCol + 1);
    });
    
    return cleanedData;
  }

  // 모든 시트 데이터를 LLM용 문자열로 포맷팅
  formatSheetsDataForLLM(allSheetsData) {
    if (!allSheetsData || allSheetsData.length === 0) {
      return '스프레드시트에 데이터가 없습니다.';
    }
    
    let formattedContent = '# 시리즈 설정집 정보\n\n';
    
    allSheetsData.forEach((sheetInfo, index) => {
      const { sheetTitle, data } = sheetInfo;
      
      formattedContent += `## ${sheetTitle}\n\n`;
      
      if (data.length === 0) {
        formattedContent += '(빈 시트)\n\n';
        return;
      }
      
      // 첫 번째 행을 헤더로 사용
      const headers = data[0] || [];
      const dataRows = data.slice(1);
      
      if (headers.length === 0) {
        formattedContent += '(헤더 정보 없음)\n\n';
        return;
      }
      
      // 테이블 형태로 포맷팅
      formattedContent += '| ' + headers.join(' | ') + ' |\n';
      formattedContent += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
      
      // 데이터 행들 추가
      dataRows.forEach(row => {
        const paddedRow = [...row];
        // 헤더 수만큼 열을 맞춤 (빈 셀은 공백으로)
        while (paddedRow.length < headers.length) {
          paddedRow.push('');
        }
        
        const formattedRow = paddedRow.slice(0, headers.length).map(cell => {
          const cellValue = (cell || '').toString().trim();
          // 파이프 문자 이스케이프
          return cellValue.replace(/\|/g, '\\|');
        });
        
        formattedContent += '| ' + formattedRow.join(' | ') + ' |\n';
      });
      
      formattedContent += '\n';
      
      // 요약 정보 추가
      formattedContent += `*${sheetTitle}: ${dataRows.length}개 항목*\n\n`;
    });
    
    // 전체 요약
    const totalSheets = allSheetsData.length;
    const totalRows = allSheetsData.reduce((sum, sheet) => sum + (sheet.data.length - 1), 0); // 헤더 제외
    
    formattedContent += `---\n**전체 요약**: ${totalSheets}개 시트, 총 ${totalRows}개 데이터 항목\n`;
    
    return formattedContent;
  }

  // 가이드 프롬프트 텍스트 가져오기
  async getGuidePromptText(guidePromptUrl) {
    if (!guidePromptUrl || guidePromptUrl === '#N/A') {
      console.log('가이드 프롬프트 URL이 없습니다')
      return null
    }

    try {
      console.log('🔍 가이드 프롬프트 텍스트 가져오기 시작:', guidePromptUrl)
      
      // Electron IPC를 통한 URL 요청 (CORS 문제 해결)
      if (window.electronAPI && window.electronAPI.fetchUrl) {
        let targetUrl = guidePromptUrl
        
        // Google Drive 파일 ID 추출
        const fileIdMatch = guidePromptUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
        if (fileIdMatch) {
          const fileId = fileIdMatch[1]
          targetUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
          console.log('📁 Google Drive 파일 다운로드 URL:', targetUrl)
        }
        
        // Google Docs 링크인 경우
        else if (guidePromptUrl.includes('docs.google.com/document')) {
          const docIdMatch = guidePromptUrl.match(/\/document\/d\/([a-zA-Z0-9-_]+)/)
          if (docIdMatch) {
            const docId = docIdMatch[1]
            targetUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`
            console.log('📄 Google Docs 텍스트 내보내기 URL:', targetUrl)
          }
        }
        
        console.log('🔄 Electron IPC를 통한 가이드 프롬프트 URL 요청:', targetUrl)
        
        try {
          const response = await window.electronAPI.fetchUrl(targetUrl)
          console.log('✅ Electron IPC 가이드 프롬프트 응답 받음:', response.substring(0, 100) + '...')
          
          if (response && response.trim()) {
            console.log('✅ 가이드 프롬프트 텍스트 가져오기 성공:', response.length, '글자')
            return response.trim()
          }
        } catch (ipcError) {
          console.error('❌ Electron IPC 가이드 프롬프트 요청 실패:', ipcError)
        }
      }
      
      console.log('⚠️ Electron IPC 사용 불가, 일반 fetch 시도')
      
      // Google Drive 파일 ID 추출 (일반 fetch)
      const fileIdMatch = guidePromptUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
      if (fileIdMatch) {
        const fileId = fileIdMatch[1]
        const exportUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
        console.log('📁 Google Drive 파일 다운로드 URL (일반 fetch):', exportUrl)
        
        try {
          const response = await fetch(exportUrl)
          if (response.ok) {
            const text = await response.text()
            console.log('✅ Google Drive 파일 텍스트 가져오기 성공 (일반 fetch):', text.length, '글자')
            return text.trim()
          }
        } catch (fetchError) {
          console.log('⚠️ Google Drive fetch 실패 (CORS):', fetchError.message)
        }
      }
      
      // Google Docs 링크인 경우
      if (guidePromptUrl.includes('docs.google.com/document')) {
        const docIdMatch = guidePromptUrl.match(/\/document\/d\/([a-zA-Z0-9-_]+)/)
        if (docIdMatch) {
          const docId = docIdMatch[1]
          const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`
          console.log('📄 Google Docs 텍스트 내보내기 URL:', exportUrl)
          
          const response = await fetch(exportUrl)
          if (response.ok) {
            const text = await response.text()
            console.log('✅ Google Docs 텍스트 가져오기 성공:', text.length, '글자')
            return text.trim()
          }
        }
      }
      
      // 일반 URL에서 텍스트 가져오기 시도
      console.log('🌐 일반 URL에서 텍스트 가져오기 시도:', guidePromptUrl)
      const response = await fetch(guidePromptUrl)
      if (response.ok) {
        const text = await response.text()
        console.log('✅ 일반 URL 텍스트 가져오기 성공:', text.length, '글자')
        return this.extractTextFromHtml(text)
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      
    } catch (error) {
      console.error('❌ 가이드 프롬프트 텍스트 가져오기 실패:', error)
      return null
    }
  }
}

// 서비스 인스턴스를 lazy하게 생성
let serviceInstance = null

export const getGoogleSheetsService = () => {
  if (!serviceInstance) {
    serviceInstance = new GoogleSheetsService()
    console.log('✅ GoogleSheetsService 인스턴스 생성 완료:', serviceInstance)
  }
  return serviceInstance
}

// Gemini 서비스 접근 메서드 추가
GoogleSheetsService.prototype.getGeminiService = function() {
  return getGeminiService()
}

// 기본 export도 제공
export default GoogleSheetsService
