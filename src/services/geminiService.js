// Gemini LLM 번역 서비스
import { getApiKeyService } from './apiKeyService.js'

class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent'
    
    if (!this.apiKey) {
      console.warn('⚠️ Gemini API 키가 설정되지 않았습니다. 환경 변수 VITE_GEMINI_API_KEY를 확인해주세요.')
    }
    
    console.log('GeminiService 초기화:', {
      apiKey: this.apiKey ? '설정됨' : '설정안됨',
      baseUrl: this.baseUrl
    })
  }

  // Gemini LLM을 활용한 1차 번역 수행
  async translateWithGemini(sourceText, targetLanguage, seriesSettings, guidePrompt, userPrompt = '', userEmail = null) {
    try {
      // 사용자별 API Key 사용
      let apiKeyToUse = this.apiKey // 기본 API Key
      
      if (userEmail) {
        console.log('🔑 사용자별 API Key 조회 시도:', userEmail)
        try {
          const apiKeyService = getApiKeyService()
          const userApiKey = await apiKeyService.getUserApiKey(userEmail)
          if (userApiKey) {
            apiKeyToUse = userApiKey
            console.log('✅ 사용자 API Key 사용:', userEmail)
          } else {
            console.log('⚠️ 사용자 API Key 없음, 시스템 기본 Key 사용')
          }
        } catch (error) {
          console.error('❌ API Key 조회 실패:', error)
          console.log('⚠️ 시스템 기본 Key로 fallback')
        }
      }
      
      if (!apiKeyToUse) {
        const errorMsg = 'Gemini API 키가 설정되지 않았습니다. 시스템 관리자에게 문의해주세요.'
        console.error('❌', errorMsg)
        console.error('❌ API Key 상태:', {
          systemApiKey: this.apiKey ? '설정됨' : '설정안됨',
          userEmail: userEmail,
          userApiKeyFound: userEmail ? '조회 시도됨' : '이메일 없음'
        })
        throw new Error(errorMsg)
      }

      if (!sourceText || sourceText.trim() === '') {
        throw new Error('원문 텍스트가 제공되지 않았습니다.')
      }

      console.log('🚀 Gemini LLM 1차 번역 시작:', {
        sourceTextLength: sourceText.length,
        targetLanguage,
        hasSettings: !!seriesSettings,
        hasGuidePrompt: !!guidePrompt
      })

      // 번역을 위한 프롬프트 구성
      const translationPrompt = this.buildTranslationPrompt(
        sourceText, 
        targetLanguage, 
        seriesSettings, 
        guidePrompt,
        userPrompt
      )

      console.log('📝 번역 프롬프트 구성 완료, Gemini API 호출 중...')

      // Gemini API 호출
      const response = await fetch(`${this.baseUrl}?key=${apiKeyToUse}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: translationPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.3, // 일관성 있는 번역을 위해 낮은 temperature
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192, // 충분한 번역 길이
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('❌ Gemini API 오류:', response.status, errorData)
        throw new Error(`Gemini API 오류: ${response.status} - ${errorData}`)
      }

      const data = await response.json()
      
      // 🔍 Gemini API Raw Response 로깅 (토큰 사용량 포함)
      console.log('📊 Gemini API Raw Response:', {
        candidates: data.candidates?.length || 0,
        usageMetadata: data.usageMetadata || 'No usage metadata',
        fullResponse: data
      })
      
      // 📈 토큰 사용량 상세 로깅
      if (data.usageMetadata) {
        const usage = data.usageMetadata
        console.log('🎯 토큰 사용량 분석:', {
          promptTokenCount: usage.promptTokenCount || 0,      // 입력 토큰 수
          candidatesTokenCount: usage.candidatesTokenCount || 0, // 출력 토큰 수  
          totalTokenCount: usage.totalTokenCount || 0,        // 총 토큰 수
          inputText: `${sourceText.length}자`,
          promptLength: `${this.buildTranslationPrompt(sourceText, targetLanguage, seriesSettings, guidePrompt, userPrompt).length}자`
        })
        
        // 🚨 토큰 제한 경고 (Gemini-1.5-flash 기준)
        const MAX_INPUT_TOKENS = 1048576  // 약 100만 토큰
        const MAX_OUTPUT_TOKENS = 8192    // 설정된 최대 출력 토큰
        
        if (usage.promptTokenCount > MAX_INPUT_TOKENS * 0.8) {
          console.warn('⚠️ 입력 토큰이 제한에 근접:', {
            current: usage.promptTokenCount,
            limit: MAX_INPUT_TOKENS,
            percentage: `${((usage.promptTokenCount / MAX_INPUT_TOKENS) * 100).toFixed(1)}%`
          })
        }
        
        if (usage.candidatesTokenCount > MAX_OUTPUT_TOKENS * 0.8) {
          console.warn('⚠️ 출력 토큰이 제한에 근접:', {
            current: usage.candidatesTokenCount,
            limit: MAX_OUTPUT_TOKENS,
            percentage: `${((usage.candidatesTokenCount / MAX_OUTPUT_TOKENS) * 100).toFixed(1)}%`
          })
        }
      } else {
        console.warn('⚠️ 토큰 사용량 정보가 응답에 포함되지 않았습니다.')
      }
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('❌ Gemini API 응답 형식 오류:', data)
        throw new Error('Gemini API 응답 형식이 올바르지 않습니다.')
      }

      const translatedText = data.candidates[0].content.parts[0].text
      
      console.log('✅ Gemini LLM 번역 완료:', {
        originalLength: sourceText.length,
        translatedLength: translatedText.length,
        targetLanguage,
        tokenEfficiency: data.usageMetadata ? {
          inputTokens: data.usageMetadata.promptTokenCount,
          outputTokens: data.usageMetadata.candidatesTokenCount,
          totalTokens: data.usageMetadata.totalTokenCount,
          charactersPerInputToken: (sourceText.length / (data.usageMetadata.promptTokenCount || 1)).toFixed(2),
          charactersPerOutputToken: (translatedText.length / (data.usageMetadata.candidatesTokenCount || 1)).toFixed(2)
        } : '토큰 정보 없음'
      })

      return translatedText.trim()

    } catch (error) {
      console.error('❌ Gemini LLM 번역 실패:', error)
      
      // 사용자 친화적인 에러 메시지 제공
      if (error.message.includes('API 키')) {
        throw new Error('API Key에 문제가 있습니다. 시스템 관리자에게 문의해주세요.')
      } else if (error.message.includes('quota')) {
        throw new Error('API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.')
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.')
      } else {
        throw new Error(`번역 처리 중 오류가 발생했습니다: ${error.message}`)
      }
    }
  }

  // 번역을 위한 프롬프트 구성
  buildTranslationPrompt(sourceText, targetLanguage, seriesSettings, guidePrompt, userPrompt = '') {
    let prompt = `당신은 전문 번역가입니다. 다음 지침에 따라 원문을 ${targetLanguage}로 번역해주세요.

# 기본 지침
1. 반드시 ${targetLanguage}로만 번역해주세요.
2. 다른 언어로 답변하지 마세요.
3. 번역 결과만 제공하고 추가 설명은 하지 마세요.
4. '기본 번역문'이 제공될 경우, '번역 가이드'에 따라 기본 번역문을 기초로 확장해주세요.
5. '기본 번역문'이 제공되지 않을 경우, '번역 가이드'에 따라 원문을 기반으로 번역해주세요.

## 시리즈 설정 정보:
${seriesSettings ? seriesSettings : '설정 정보가 제공되지 않았습니다.'}

## 텍스트 내용:
${sourceText}

# 번역 가이드
${userPrompt ? `## 사용자 프롬프트:
  ${userPrompt}` : `## 가이드 프롬프트:
  ${guidePrompt ? guidePrompt : '가이드 프롬프트가 제공되지 않았습니다.'}`}
`

    console.log('🔍 구성된 번역 프롬프트 미리보기:', {
      targetLanguage,
      hasUserPrompt: !!userPrompt,
      hasGuidePrompt: !!guidePrompt,
      promptLength: prompt.length
    })

    return prompt
  }

  // API 키 설정
  setApiKey(apiKey) {
    this.apiKey = apiKey
    console.log('✅ Gemini API 키가 설정되었습니다.')
  }

  // API 키 상태 확인
  isApiKeySet() {
    return !!this.apiKey
  }
}

// 서비스 인스턴스를 lazy하게 생성
let serviceInstance = null

export const getGeminiService = () => {
  if (!serviceInstance) {
    serviceInstance = new GeminiService()
    console.log('✅ GeminiService 인스턴스 생성 완료:', serviceInstance)
  }
  return serviceInstance
}

// 기본 export도 제공
export default GeminiService
