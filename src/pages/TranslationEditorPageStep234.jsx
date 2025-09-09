import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDesignSystemContext } from '../components/common/DesignSystemProvider'
import { AutoStyledButton, AutoStyledInput, AutoStyledCard } from '../components/common/AutoStyledComponent'
import { useAuthStore } from '../store/authStore'
import Button from '../components/common/Button'
import PromptBubble from '../components/common/PromptBubble'
import AppLayout from '../components/layout/AppLayout'
import BottomActionBar from '../components/common/BottomActionBar'
import PromptGuideModal from '../components/common/PromptGuideModal'
import ContextInfoModal from '../components/common/ContextInfoModal'
import TranslationDiffViewer from '../components/common/TranslationDiffViewer'

import styles from '../styles/pages/TranslationEditorPage.module.css'
import { getGoogleSheetsService } from '../services/googleSheetsService'
import promptLimitService from '../services/promptLimitService'

// CSS 애니메이션 스타일 추가
const spinAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const TranslationEditorPage = () => {
  const { designTokens } = useDesignSystemContext()
  const { user } = useAuthStore() // 사용자 정보 가져오기
  const location = useLocation()
  const navigate = useNavigate()
  const taskData = location.state || {}
  const [activeTab, setActiveTab] = useState('original') // 'original' or 'translation'
  const [prompts, setPrompts] = useState([]) // 프롬프트 버블들을 저장
  const [promptInput, setPromptInput] = useState('') // 하단 프롬프트 입력 필드
  const [promptCounter, setPromptCounter] = useState(1) // 버전 번호 카운터
  const [totalPromptCount, setTotalPromptCount] = useState(0) // 총 프롬프트 실행 횟수 (과금용)
  const [dailyPromptCount, setDailyPromptCount] = useState(0) // 일일 전체 프롬프트 카운트
  const [promptResult, setPromptResult] = useState('') // 프롬프트 결과 번역문
  const [lastPromptTime, setLastPromptTime] = useState(0) // 마지막 프롬프트 입력 시간
  const [promptHistory, setPromptHistory] = useState([]) // 프롬프트 이력 (결과 포함)
  const [savedComments, setSavedComments] = useState({}) // 저장된 코멘트들
  const [reviewDataCache, setReviewDataCache] = useState({}) // 제출 대상 항목 데이터 캐시
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false) // 제출 완료된 과제의 읽기 전용 모드
  
  // Step 1 관련 state
  const [originalText, setOriginalText] = useState('') // 원문 텍스트
  const [translatedText, setTranslatedText] = useState('') // 번역된 텍스트
  const [isLoading, setIsLoading] = useState(false) // 로딩 상태
  const [promptLoading, setPromptLoading] = useState(false) // 프롬프트 결과 로딩 상태
  const [step1Data, setStep1Data] = useState(null) // Step 1 데이터
  const [taskDetail, setTaskDetail] = useState(null) // 과제 상세 정보
  const [lastEnterKeyTime, setLastEnterKeyTime] = useState(0) // 마지막 Enter 키 입력 시간 (디바운싱용)

  // 일일 프롬프트 카운트 초기화
  useEffect(() => {
    if (user?.email) {
      const currentCount = promptLimitService.getTodayPromptCount(user.email)
      setDailyPromptCount(currentCount)
      console.log('📊 Step 2,3,4 일일 프롬프트 카운트 초기화:', currentCount)
    }
  }, [user?.email])
  const [baselineTranslationGenerated, setBaselineTranslationGenerated] = useState(false) // Step 1 기본 번역문 생성 완료 여부

  // 프롬프트 가이드 모달 관련 state
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false)
  const [guideContent, setGuideContent] = useState('')
  const [isGuideLoading, setIsGuideLoading] = useState(false)
  const [hasGuidePrompt, setHasGuidePrompt] = useState(false)
  
  // 맥락 정보 모달 관련 state
  const [isContextModalOpen, setIsContextModalOpen] = useState(false)
  const [contextContent, setContextContent] = useState('')
  const [isContextLoading, setIsContextLoading] = useState(false)
  
  // 프롬프트 결과 번역문 표시 모드: 'result' 또는 'diff'
  const [promptResultMode, setPromptResultMode] = useState('result')

  // 과제 정보 (실제 데이터 사용)
  const {
    title,
    episode,
    languagePair = '출발어 도착어',
    status = '진행중',
    projectSeason = '시즌 1',
    priority = '보통',
    settings = '설정집 정보가 없습니다.',
    originalUrl = '',
    translationUrl = '',
    taskId,
    stepOrder
  } = taskData

  // 컴포넌트 언마운트 시 현재 상태 저장
  useEffect(() => {
    return () => {
      // 페이지를 벗어날 때 현재 입력 중인 프롬프트 저장
      if (!isReadOnlyMode && taskId) {
        console.log('🔄 Step 2,3,4 페이지 언마운트 - 현재 상태 강제 저장')
        clearTimeout(window.autoSaveTimeout)
        
        // 🚨 빈 데이터 저장 방지: 의미있는 데이터가 있을 때만 저장
        const hasDataToSave = prompts.length > 0 || originalText || translatedText || Object.keys(savedComments).length > 0
        
        if (hasDataToSave) {
          try {
            const saveData = {
              prompts,
              originalText,
              baselineTranslation: translatedText,
              savedComments,
              totalPromptCount,
              currentPromptInput: promptInput, // 현재 입력 중인 프롬프트도 저장
              promptResult, // 프롬프트 결과 번역문도 저장
              taskId,
              stepOrder,
              taskData,
              timestamp: new Date().toISOString()
            }
            localStorage.setItem(`promptInput_${taskId}`, JSON.stringify(saveData))
            console.log('💾 Step 2,3,4 언마운트 시 자동 저장 완료 - promptInput 포함:', promptInput.length, '글자')
          } catch (error) {
            console.error('⚠️ Step 2,3,4 언마운트 시 자동 저장 실패:', error)
          }
        } else {
          console.log('⚠️ Step 2,3,4 빈 데이터 저장 방지 - 언마운트 시 저장 건너뛰기')
        }
      }
    }
  }, []) // 의존성 배열을 비워서 마운트/언마운트 시에만 실행

  // 컴포넌트 마운트 시 과제 상세 정보 로드
  useEffect(() => {
    // 🔒 제출 완료 상태 확인 (읽기 전용 모드 설정)
    const checkReadOnlyMode = () => {
      const currentStatus = localStorage.getItem(`taskProgress_${taskId}`)
      const isCompleted = currentStatus === '제출 완료'
      setIsReadOnlyMode(isCompleted)
      
      if (isCompleted) {
        console.log('🔒 제출 완료된 과제 - 읽기 전용 모드 활성화')
        
        // 🔄 제출된 데이터가 있는데 promptInput 데이터가 없으면 복원
        const submissionData = localStorage.getItem(`submission_${taskId}`)
        const promptInputData = localStorage.getItem(`promptInput_${taskId}`)
        const promptReviewData = localStorage.getItem(`promptReview_${taskId}`)
        
        if (submissionData && !promptInputData) {
          console.log('🔄 제출된 데이터 발견 - promptInput 데이터 복원 시작')
          try {
            const parsedSubmission = JSON.parse(submissionData)
            let parsedReview = null
            
            // promptReview 데이터가 있으면 우선 사용 (더 완전한 데이터)
            if (promptReviewData) {
              parsedReview = JSON.parse(promptReviewData)
              console.log('🔍 promptReview 데이터도 발견 - 우선 사용')
            }
            
            console.log('🔍 데이터 구조 확인:', {
              submissionPrompts: parsedSubmission.prompts?.length || 0,
              reviewPrompts: parsedReview?.prompts?.length || 0,
              submissionKeys: Object.keys(parsedSubmission),
              reviewKeys: parsedReview ? Object.keys(parsedReview) : []
            })
            
            // 데이터 소스 결정
            let sourceData = parsedSubmission // 기본값
            
            if (parsedReview && parsedReview.prompts && parsedReview.prompts.length > 0) {
              console.log('✅ promptReview 데이터 사용 (우선)')
              sourceData = parsedReview
            } else if (parsedSubmission.prompts && parsedSubmission.prompts.length > 0) {
              console.log('✅ submission 데이터 사용 (새 형식)')
              sourceData = parsedSubmission
            } else if (parsedSubmission.response_raw) {
              console.log('🔄 구 형식 submission 데이터 감지 - response_raw에서 복원')
              // 구 형식: response_raw에서 실제 데이터 추출
              try {
                const responseData = JSON.parse(parsedSubmission.response_raw)
                
                // allLikedPrompts 또는 allPrompts 중 사용 가능한 것 선택
                const promptsArray = responseData.allLikedPrompts || responseData.allPrompts || []
                
                sourceData = {
                  prompts: promptsArray,
                  originalText: responseData.originalText || parsedSubmission.original_text || '',
                  baselineTranslation: responseData.baselineTranslation || parsedSubmission.baseline_translation || '',
                  savedComments: {},
                  savedQualityEvaluations: {},
                  savedQualityScores: {},
                  bestPromptId: responseData.bestPromptId || null,
                  totalPromptCount: responseData.totalPromptCount || responseData.totalPrompts || parsedSubmission.experiment_count || 0
                }
                
                // 코멘트 및 평가 데이터 복원
                if (promptsArray && promptsArray.length > 0) {
                  promptsArray.forEach(prompt => {
                    if (prompt.comment) sourceData.savedComments[prompt.id] = prompt.comment
                    if (prompt.qualityEvaluation) sourceData.savedQualityEvaluations[prompt.id] = prompt.qualityEvaluation
                    if (prompt.qualityScore) sourceData.savedQualityScores[prompt.id] = prompt.qualityScore
                  })
                }
                
                console.log('✅ 구 형식 데이터 변환 완료:', sourceData.prompts?.length || 0, '개 프롬프트')
              } catch (parseError) {
                console.error('❌ response_raw 파싱 실패:', parseError)
                sourceData = parsedSubmission // fallback
              }
            } else {
              console.log('⚠️ 사용 가능한 프롬프트 데이터 없음 - 기본 구조 사용')
            }
            
            // submission 데이터를 promptInput 형식으로 복원
            const restoredData = {
              prompts: sourceData.prompts || [],
              originalText: sourceData.originalText || '',
              baselineTranslation: sourceData.baselineTranslation || '',
              savedComments: sourceData.savedComments || {},
              totalPromptCount: sourceData.totalPromptCount || 0,
              currentPromptInput: sourceData.currentPromptInput || '', // 입력 중이던 프롬프트 복원
              timestamp: new Date().toISOString()
            }
            
            localStorage.setItem(`promptInput_${taskId}`, JSON.stringify(restoredData))
            console.log('✅ 제출된 데이터를 promptInput으로 복원 완료:', restoredData.prompts?.length || 0, '개 프롬프트')
            console.log('🔍 복원된 프롬프트 데이터 샘플:', restoredData.prompts?.slice(0, 1))
            
            // promptReview 데이터도 복원 (이미 있으면 건너뛰기)
            if (!promptReviewData && (sourceData.savedComments || sourceData.savedQualityEvaluations || sourceData.bestPromptId)) {
              const reviewData = {
                prompts: sourceData.prompts || [],
                originalText: sourceData.originalText || '',
                baselineTranslation: sourceData.baselineTranslation || '',
                savedComments: sourceData.savedComments || {},
                savedQualityEvaluations: sourceData.savedQualityEvaluations || {},
                savedQualityScores: sourceData.savedQualityScores || {},
                bestPromptId: sourceData.bestPromptId || null,
                totalPromptCount: sourceData.totalPromptCount || 0,
                timestamp: new Date().toISOString()
              }
              
              localStorage.setItem(`promptReview_${taskId}`, JSON.stringify(reviewData))
              console.log('✅ 제출된 데이터를 promptReview로도 복원 완료')
            } else if (promptReviewData) {
              console.log('✅ promptReview 데이터 이미 존재 - 건너뛰기')
            }
            
          } catch (error) {
            console.error('❌ 제출된 데이터 복원 실패:', error)
          }
        }
      }
      
      return isCompleted
    }
    
    // 로컬 스토리지에서 저장된 데이터 확인
    if (taskId) {
      const isReadOnly = checkReadOnlyMode()
      // 먼저 실제 AI 실행 횟수를 계산 (과금 정확성을 위해)
      let actualPromptCount = 0
      
      // promptInput 데이터에서 프롬프트 개수 확인
      const promptInputData = localStorage.getItem(`promptInput_${taskId}`)
      if (promptInputData) {
        try {
          const parsedInputData = JSON.parse(promptInputData)
          if (parsedInputData.prompts && Array.isArray(parsedInputData.prompts)) {
            actualPromptCount += parsedInputData.prompts.length
          }
        } catch (e) {
          console.warn('promptInput 데이터 파싱 실패:', e)
        }
      }
      
      // promptReview 데이터에서도 프롬프트 개수 확인 (삭제된 것들 포함)
      const promptReviewData = localStorage.getItem(`promptReview_${taskId}`)
      if (promptReviewData) {
        try {
          const parsedReviewData = JSON.parse(promptReviewData)
          if (parsedReviewData.prompts && Array.isArray(parsedReviewData.prompts)) {
            // promptReview에만 있는 추가 프롬프트들 확인
            const reviewPromptIds = parsedReviewData.prompts.map(p => p.id)
            const inputPromptIds = promptInputData ? JSON.parse(promptInputData).prompts?.map(p => p.id) || [] : []
            const uniqueReviewPrompts = parsedReviewData.prompts.filter(p => !inputPromptIds.includes(p.id))
            actualPromptCount += uniqueReviewPrompts.length
            console.log('🔍 promptReview에서 추가 프롬프트 발견:', uniqueReviewPrompts.length, '개')
          }
        } catch (e) {
          console.warn('promptReview 데이터 파싱 실패:', e)
        }
      }
      
      console.log('📊 실제 AI 실행 횟수 계산 완료:', actualPromptCount, '회')
      
      const savedData = localStorage.getItem(`promptInput_${taskId}`)
      const reviewData = localStorage.getItem(`promptReview_${taskId}`) // 제출 대상 항목 데이터도 로드
      
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          console.log('🔄 저장된 데이터 발견 - 전체 상태 복원 중...')
          
          // promptReview 데이터에서 제출 대상 항목 데이터 가져오기
          let reviewParsedData = {}
          if (reviewData) {
            try {
              reviewParsedData = JSON.parse(reviewData)
              console.log('🔄 제출 대상 항목 데이터도 함께 로드:', {
                hasQualityEvaluations: !!reviewParsedData.savedQualityEvaluations,
                hasQualityScores: !!reviewParsedData.savedQualityScores,
                hasBestPromptId: !!reviewParsedData.bestPromptId
              })
            } catch (e) {
              console.warn('promptReview 데이터 파싱 실패:', e)
            }
          }
          
          // 저장된 모든 상태를 그대로 복원
          if (parsedData.prompts) {
            setPrompts(parsedData.prompts)
            setPromptHistory(parsedData.prompts)
            setPromptCounter(parsedData.prompts.length + 1)
            console.log('✅ 프롬프트 데이터 복원 완료:', parsedData.prompts.length, '개')
          }
          
          // 총 프롬프트 실행 횟수 복원 (과금용 - 삭제되지 않는 누적 카운트)
          if (parsedData.totalPromptCount !== undefined) {
            // 저장된 값과 실제 계산값 중 더 큰 값 사용 (데이터 무결성)
            const finalCount = Math.max(parsedData.totalPromptCount, actualPromptCount)
            setTotalPromptCount(finalCount)
            console.log('✅ 총 프롬프트 실행 횟수 복원 완료:', finalCount, '회 (저장값:', parsedData.totalPromptCount, ', 계산값:', actualPromptCount, ')')
          } else {
            // 기존 데이터에 totalPromptCount가 없으면 실제 계산된 값으로 초기화
            setTotalPromptCount(actualPromptCount)
            console.log('✅ 총 프롬프트 실행 횟수 초기화:', actualPromptCount, '회 (실제 AI 사용 횟수 기준)')
          }
          
          if (parsedData.originalText) {
            setOriginalText(parsedData.originalText)
            console.log('✅ 원문 데이터 복원 완료')
          }
          
          if (parsedData.baselineTranslation) {
            setTranslatedText(parsedData.baselineTranslation)
            setBaselineTranslationGenerated(true)
            console.log('✅ 기본 번역문 데이터 복원 완료')
          }
          
          // 입력 중이던 프롬프트 복원
          if (parsedData.currentPromptInput) {
            setPromptInput(parsedData.currentPromptInput)
            console.log('✅ 입력 중이던 프롬프트 복원 완료:', parsedData.currentPromptInput.length, '글자')
          }
          
          // 프롬프트 결과 복원 (선택된 프롬프트의 번역 결과)
          if (parsedData.promptResult) {
            setPromptResult(parsedData.promptResult)
            console.log('✅ 프롬프트 결과 복원 완료:', parsedData.promptResult.length, '글자')
          }
          
          // 코멘트 데이터 복원 (promptInput과 promptReview 데이터 병합)
          const mergedComments = {
            ...(parsedData.savedComments || {}),
            ...(reviewParsedData.savedComments || {})
          }
          setSavedComments(mergedComments)
          console.log('✅ 코멘트 데이터 복원 완료:', Object.keys(mergedComments).length, '개')
          
          // Best 데이터도 코멘트처럼 병합 로딩 (promptInput과 promptReview 데이터 병합)
          const mergedQualityEvaluations = {
            ...(parsedData.savedQualityEvaluations || {}),
            ...(reviewParsedData.savedQualityEvaluations || {})
          }
          const mergedQualityScores = {
            ...(parsedData.savedQualityScores || {}),
            ...(reviewParsedData.savedQualityScores || {})
          }
          const finalBestPromptId = reviewParsedData.bestPromptId || parsedData.bestPromptId || null
          
          console.log('✅ Best 데이터 병합 복원 완료:', {
            qualityEvaluations: Object.keys(mergedQualityEvaluations).length,
            qualityScores: Object.keys(mergedQualityScores).length,
            bestPromptId: finalBestPromptId
          })
          
          // 병합된 Best 데이터를 캐시에 저장 (항상 실행)
          setReviewDataCache({
            savedQualityEvaluations: mergedQualityEvaluations,
            savedQualityScores: mergedQualityScores,
            bestPromptId: finalBestPromptId,
            originalText: reviewParsedData.originalText || parsedData.originalText || '',
            baselineTranslation: reviewParsedData.baselineTranslation || parsedData.baselineTranslation || '',
            totalPromptCount: reviewParsedData.totalPromptCount || parsedData.totalPromptCount || 0
          })
          
          if (parsedData.taskData) {
            setTaskDetail(parsedData.taskData)
            console.log('✅ 과제 데이터 복원 완료')
          }
          
          // 🔒 제출 완료된 과제는 상태 변경 방지
          const currentStatus = localStorage.getItem(`taskProgress_${taskId}`)
          if (parsedData.prompts && parsedData.prompts.length > 0 && currentStatus !== '제출 완료') {
            localStorage.setItem(`taskProgress_${taskId}`, '진행중')
            console.log('✅ 진행 상태를 "진행중"으로 업데이트')
          } else if (currentStatus === '제출 완료') {
            console.log('🔒 제출 완료된 과제 - 상태 변경 차단')
          }
          
          // 🚨 데이터 손실 방지: 저장된 데이터는 유지 (삭제하지 않음)
          console.log('✅ 전체 상태 복원 완료, 로컬 스토리지 유지됨')
          
          // 저장된 데이터가 있으면 기존 로직 실행하지 않음
          return
        } catch (error) {
          console.error('저장된 데이터 복원 실패:', error)
          // 에러 발생 시도 기본 AI 사용 횟수는 설정
          if (actualPromptCount > 0) {
            setTotalPromptCount(actualPromptCount)
            console.log('⚠️ 에러 발생 시 AI 사용 횟수 보정:', actualPromptCount, '회')
          }
        }
      }
      
      // 저장된 데이터가 없어도 실제 프롬프트 횟수는 설정
      if (actualPromptCount > 0) {
        setTotalPromptCount(actualPromptCount)
        console.log('✅ 저장된 데이터 없음 - 실제 AI 사용 횟수로 초기화:', actualPromptCount, '회')
      }
    }
    
    const loadTaskDetail = async () => {
      if (taskId) {
        try {
          setIsLoading(true)
          const googleSheetsService = getGoogleSheetsService()
          const detail = await googleSheetsService.getProjectDetail(taskId)
          setTaskDetail(detail)
          console.log('✅ 과제 상세 정보 로드 완료:', detail.title)
          
          // 최신 가이드 프롬프트 정보 업데이트
          console.log('🔄 최신 가이드 프롬프트 정보 업데이트:', {
            guidePromptUrl: detail.guidePromptUrl,
            pathGuidePrompt: detail.pathGuidePrompt
          })
          
          // 가이드 프롬프트 URL 확인
          console.log('🔍 가이드 프롬프트 URL 디버깅:', {
            guidePromptUrl: detail.guidePromptUrl,
            pathGuidePrompt: detail.pathGuidePrompt,
            hasGuidePromptUrl: !!(detail.guidePromptUrl && detail.guidePromptUrl !== '#N/A'),
            hasPathGuidePrompt: !!(detail.pathGuidePrompt && detail.pathGuidePrompt !== '#N/A')
          })
          
          if (detail.guidePromptUrl && detail.guidePromptUrl !== '#N/A') {
            setHasGuidePrompt(true)
            console.log('📋 가이드 프롬프트 URL 확인됨:', detail.guidePromptUrl)
          } else if (detail.pathGuidePrompt && detail.pathGuidePrompt !== '#N/A') {
            setHasGuidePrompt(true)
            console.log('📋 가이드 프롬프트 경로 확인됨:', detail.pathGuidePrompt)
          } else {
            console.log('⚠️ 가이드 프롬프트가 없습니다')
          }
          
          // URL에서 실제 텍스트 가져오기 (이미 복원된 데이터가 있으면 덮어쓰지 않음)
          // 원문 텍스트 처리: 한번 로딩된 후에는 고정값으로 사용
          console.log('🔍 Step 2,3,4 원문 로딩 디버깅:', {
            hasOriginalText: !!originalText,
            detailSourceText: detail.sourceText,
            sourceTextType: typeof detail.sourceText,
            sourceTextLength: detail.sourceText?.length || 0
          })
          
          if (!originalText) {
            // localStorage에서 캐시된 원문 먼저 확인
            const cachedOriginalText = localStorage.getItem(`cachedOriginalText_${taskId}`)
            if (cachedOriginalText) {
              setOriginalText(cachedOriginalText)
              console.log('✅ 캐시된 원문 데이터 사용 (재로딩 방지):', cachedOriginalText.length, '글자')
            } else if (detail.sourceText) {
              // getProjectDetail에서 이미 URL을 처리하여 텍스트를 가져왔음
              setOriginalText(detail.sourceText)
              localStorage.setItem(`cachedOriginalText_${taskId}`, detail.sourceText)
              console.log('📖 Google Sheets에서 원문 로드 완료 및 캐시 저장:', detail.sourceText.length, '글자')
            }
          } else {
            console.log('✅ 복원된 원문 데이터 보존 (Google Sheets 덮어쓰기 방지):', originalText.length, '글자')
          }
          
          // Step 2,3,4 기본 번역문: 한번 로딩된 후에는 고정값으로 사용
          console.log('🔍 Step 2,3,4 기본 번역문 로딩 디버깅:', {
            hasTranslatedText: !!translatedText,
            detailBaselineText: detail.baselineTranslationText,
            baselineTextType: typeof detail.baselineTranslationText,
            baselineTextLength: detail.baselineTranslationText?.length || 0
          })
          
          if (!translatedText) {
            // localStorage에서 캐시된 번역문 먼저 확인
            const cachedTranslatedText = localStorage.getItem(`cachedTranslatedText_${taskId}`)
            if (cachedTranslatedText) {
              setTranslatedText(cachedTranslatedText)
              setBaselineTranslationGenerated(true)
              console.log('✅ 캐시된 번역문 데이터 사용 (재로딩 방지):', cachedTranslatedText.length, '글자')
            } else if (detail.baselineTranslationText) {
              // getProjectDetail에서 이미 URL을 처리하여 텍스트를 가져왔음
              setTranslatedText(detail.baselineTranslationText)
              localStorage.setItem(`cachedTranslatedText_${taskId}`, detail.baselineTranslationText)
              setBaselineTranslationGenerated(true)
              console.log('📖 Google Sheets에서 기본 번역문 로드 완료 및 캐시 저장:', detail.baselineTranslationText.length, '글자')
            }
          } else {
            console.log('✅ 복원된 기본 번역문 데이터 보존 (Google Sheets 덮어쓰기 방지):', translatedText.length, '글자')
            setBaselineTranslationGenerated(true) // 복원된 데이터도 완료 표시
          }
          
        } catch (error) {
          console.error('과제 상세 정보 로드 실패:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }
    
    // 항상 Google Sheets에서 최신 가이드 프롬프트 URL을 로드
    loadTaskDetail()
  }, [taskId])
  
  // 설정집과 가이드 프롬프트를 캐시에서 복원 (taskDetail 업데이트)
  React.useEffect(() => {
    if (taskDetail && taskId) {
      const cachedSettings = localStorage.getItem(`cached_settings_${taskId}`)
      const cachedGuide = localStorage.getItem(`cached_guide_${taskId}`)
      const cachedBasecamp = localStorage.getItem(`cached_basecamp_${taskId}`)
      const cachedContext = localStorage.getItem(`cached_context_${taskId}`)
      
      if (cachedSettings && (!taskDetail.settingsText || taskDetail.settingsText.length < 100)) {
        console.log('📦 Step 2,3,4: 캐시에서 설정집 복원:', cachedSettings.length, '글자')
        setTaskDetail(prev => ({
          ...prev,
          settingsText: cachedSettings
        }))
      }
      
      if (cachedContext && (!taskDetail.contextAnalysisText || taskDetail.contextAnalysisText.length < 100)) {
        console.log('📦 Step 2,3,4: 캐시에서 맥락 분석 복원:', cachedContext.length, '글자')
        setTaskDetail(prev => ({
          ...prev,
          contextAnalysisText: cachedContext
        }))
      }
      
      // 베이스캠프 프롬프트 캐시 복원 (우선순위)
      if (cachedBasecamp && (!taskDetail.basecampPromptText || taskDetail.basecampPromptText.length < 100)) {
        console.log('📦 Step 2,3,4: 캐시에서 베이스캠프 프롬프트 복원:', cachedBasecamp.length, '글자')
        setTaskDetail(prev => ({
          ...prev,
          basecampPromptText: cachedBasecamp
        }))
      }
      // 가이드 프롬프트 캐시 복원 (차순위)
      else if (cachedGuide && (!taskDetail.guidePromptText || taskDetail.guidePromptText.length < 100)) {
        console.log('📦 Step 2,3,4: 캐시에서 가이드 프롬프트 복원:', cachedGuide.length, '글자')
        setTaskDetail(prev => ({
          ...prev,
          guidePromptText: cachedGuide
        }))
      }
    }
  }, [taskDetail, taskId])

  // 🚨 무한 리렌더링 방지를 위한 디버깅 (비활성화)
  // useEffect(() => {
  //   console.log('🔍 TranslationEditorPageStep234 리렌더링 감지:', {
  //     taskId,
  //     stepOrder,
  //     baselineTranslationGenerated,
  //     timestamp: new Date().toISOString()
  //   })
  // })

  // 커스텀 confirm 대화상자 표시
  const showCustomConfirm = (message) => {
    return new Promise((resolve) => {
      const result = window.confirm(message)
      resolve(result)
    })
  }

  // 프롬프트 가이드 모달 열기
  const handleOpenGuideModal = async () => {
    console.log('🔄 Step 2,3,4: 프롬프트 가이드 모달 열기 시작', { taskId, taskDetailExists: !!taskDetail })
    
    let currentTaskDetail = taskDetail
    
    // taskDetail이 없거나 베이스캠프 프롬프트 정보가 없는 경우에만 로드
    if (!currentTaskDetail || currentTaskDetail.pathBasecampPrompt === undefined) {
      console.log('🔄 Step 2,3,4: taskDetail 또는 베이스캠프 정보가 없어서 로드 시작...', { 
        hasTaskDetail: !!currentTaskDetail, 
        hasBasecampPrompt: currentTaskDetail?.pathBasecampPrompt !== undefined,
        taskId 
      })
      try {
        const googleSheetsService = getGoogleSheetsService()
        console.log('🔍 Step 2,3,4: getProjectDetail 호출 중...', taskId)
        const detail = await googleSheetsService.getProjectDetail(taskId)
        console.log('🔍 Step 2,3,4: getProjectDetail 응답:', detail)
        
        if (detail) {
          setTaskDetail(detail)
          currentTaskDetail = detail
          console.log('✅ Step 2,3,4: 과제 상세 정보 로드 완료:', detail.title)
        } else {
          console.error('❌ Step 2,3,4: getProjectDetail이 null 반환')
        }
      } catch (error) {
        console.error('❌ Step 2,3,4: 과제 상세 정보 로드 실패:', error)
        alert('⚠️ 과제 정보를 불러올 수 없습니다. 페이지를 새로고침 후 다시 시도해주세요.')
        return
      }
    } else {
      console.log('✅ Step 2,3,4: 기존 taskDetail 사용 (베이스캠프 정보 포함)', {
        title: currentTaskDetail.title,
        hasBasecampPrompt: !!currentTaskDetail.pathBasecampPrompt
      })
    }
    
    // L열(베이스캠프 프롬프트) 우선, 없으면 K열(가이드 프롬프트) 사용
    const basecampUrl = currentTaskDetail?.pathBasecampPrompt
    const guideUrl = basecampUrl && basecampUrl !== '#N/A' && basecampUrl !== '' 
      ? basecampUrl 
      : currentTaskDetail?.pathGuidePrompt
    
    // 🚨 디버깅: 상세한 정보 로그
    console.log('🔍 Step 2,3,4 프롬프트 가이드 모달 디버깅:', {
      현재과제ID: taskId,
      현재과제제목: currentTaskDetail?.title,
      현재과제스텝: currentTaskDetail?.step,
      L열베이스캠프: currentTaskDetail?.pathBasecampPrompt,
      K열가이드: currentTaskDetail?.pathGuidePrompt,
      최종사용URL: guideUrl,
      프롬프트출처: basecampUrl && basecampUrl !== '#N/A' && basecampUrl !== '' ? 'basecamp' : 'guide',
      rawBasecampUrl: basecampUrl,
      taskDetail: currentTaskDetail,
      taskDetailExists: !!taskDetail,
      currentTaskDetailExists: !!currentTaskDetail
    })
    
    console.log('🔍 Step 2,3,4 프롬프트 가이드 모달 열기 시도:', {
      guideUrl,
      taskDetail: currentTaskDetail ? { 
        title: currentTaskDetail.title, 
        guidePromptUrl: currentTaskDetail.guidePromptUrl,
        pathGuidePrompt: currentTaskDetail.pathGuidePrompt 
      } : null,
      hasGuidePrompt
    })
    
    if (!currentTaskDetail) {
      console.error('❌ taskDetail이 로드되지 않았습니다 (Step 2,3,4)')
      alert('⚠️ 과제 정보를 먼저 로드해주세요. 페이지를 새로고침 후 다시 시도해주세요.')
      return
    }
    
    // 🔍 URL 검증 상세 디버깅
    console.log('🔍 URL 검증 상세:', {
      guideUrl: guideUrl,
      guideUrlType: typeof guideUrl,
      guideUrlLength: guideUrl?.length,
      isEmpty: !guideUrl,
      isNA: guideUrl === '#N/A',
      startsWithHttp: guideUrl?.startsWith('http://'),
      startsWithHttps: guideUrl?.startsWith('https://'),
      isValidUrl: guideUrl && guideUrl !== '#N/A' && (guideUrl.startsWith('http://') || guideUrl.startsWith('https://'))
    })
    
    if (!guideUrl || guideUrl === '#N/A' || guideUrl === '' || (!guideUrl.startsWith('http://') && !guideUrl.startsWith('https://'))) {
      console.log('⚠️ Step 2,3,4: 가이드 프롬프트 URL이 없거나 유효하지 않습니다:', guideUrl)
      console.log('🔍 Step 2,3,4: 사용 가능한 과제 데이터:', {
        id: currentTaskDetail.id,
        title: currentTaskDetail.title,
        step: currentTaskDetail.step,
        pathGuidePrompt: currentTaskDetail.pathGuidePrompt,
        guidePromptUrl: currentTaskDetail.guidePromptUrl,
        allKeys: Object.keys(currentTaskDetail)
      })
      alert('⚠️ 이 과제에는 프롬프트 작성 예시가 제공되지 않았습니다.')
      return
    }

    setIsGuideModalOpen(true)
    setIsGuideLoading(true)
    
    try {
      console.log('📋 가이드 프롬프트 텍스트 로드 시작...', guideUrl)
      const googleSheetsService = getGoogleSheetsService()
      const content = await googleSheetsService.getTextFromUrl(guideUrl)
      
      if (content) {
        setGuideContent(content)
        
        // 베이스캠프 프롬프트인지 가이드 프롬프트인지 구분하여 캐시 저장
        // guideUrl에 베이스캠프 URL이 들어가 있는지 확인
        const isBasecampPrompt = guideUrl === basecampUrl && basecampUrl && basecampUrl !== '#N/A' && basecampUrl !== ''
        
        if (isBasecampPrompt) {
          localStorage.setItem(`cached_basecamp_${taskId}`, content)
          console.log('✅ Step 2,3,4: 베이스캠프 프롬프트 캐시 저장:', content.length, '글자')
        } else {
          localStorage.setItem(`cached_guide_${taskId}`, content)
          console.log('✅ Step 2,3,4: 가이드 프롬프트 캐시 저장:', content.length, '글자')
        }
        
        console.log('✅ 가이드 프롬프트 텍스트 로드 완료:', content.length, '글자')
      } else {
        setGuideContent('')
        console.log('⚠️ 가이드 프롬프트 텍스트를 가져올 수 없습니다')
      }
    } catch (error) {
      console.error('❌ 가이드 프롬프트 텍스트 로드 실패:', error)
      setGuideContent('')
    } finally {
      setIsGuideLoading(false)
    }
  }

  // 프롬프트 가이드 모달 닫기
  const handleCloseGuideModal = () => {
    setIsGuideModalOpen(false)
    setGuideContent('')
  }

  // 맥락 정보 모달 열기
  const handleOpenContextModal = async () => {
    setIsContextModalOpen(true)
    setIsContextLoading(true)

    try {
      // taskDetail에서 맥락 정보 가져오기
      let contextAnalysisText = taskDetail?.contextAnalysisText

      // taskDetail에 없으면 캐시에서 가져오기
      if (!contextAnalysisText) {
        contextAnalysisText = localStorage.getItem(`cached_context_${taskId}`)
      }

      // 여전히 없으면 taskDetail 새로 로드 시도
      if (!contextAnalysisText && taskId) {
        console.log('🔍 Step 2,3,4: 맥락 정보 없음, taskDetail 새로 로드 시도')
        const googleSheetsService = getGoogleSheetsService()
        const detail = await googleSheetsService.getProjectDetail(taskId)
        
        if (detail?.contextAnalysisText) {
          contextAnalysisText = detail.contextAnalysisText
          // 캐시에 저장
          localStorage.setItem(`cached_context_${taskId}`, detail.contextAnalysisText)
          console.log('✅ Step 2,3,4: 맥락 정보 새로 로드 완료:', contextAnalysisText.length, '글자')
        }
      }

      if (contextAnalysisText) {
        setContextContent(contextAnalysisText)
        console.log('✅ Step 2,3,4: 맥락 정보 모달 표시:', contextAnalysisText.length, '글자')
      } else {
        setContextContent('')
        console.warn('⚠️ Step 2,3,4: 맥락 정보를 찾을 수 없습니다')
      }
    } catch (error) {
      console.error('❌ Step 2,3,4: 맥락 정보 로드 실패:', error)
      setContextContent('')
    } finally {
      setIsContextLoading(false)
    }
  }

  // 맥락 정보 모달 닫기
  const handleCloseContextModal = () => {
    setIsContextModalOpen(false)
    setContextContent('')
  }

  // 자동 저장 함수 (프롬프트 입력 시 호출)
  const autoSavePromptData = () => {
    if (isReadOnlyMode || !taskId) return
    
    // 🚨 빈 데이터 저장 방지: 의미있는 데이터가 있을 때만 저장
    const hasDataToSave = prompts.length > 0 || originalText || translatedText || Object.keys(savedComments).length > 0
    
    if (!hasDataToSave) {
      console.log('⚠️ 빈 데이터 저장 방지 - 자동 저장 건너뛰기')
      return
    }
    
    try {
      const saveData = {
        prompts,
        originalText,
        baselineTranslation: translatedText,
        savedComments,
        totalPromptCount,
        currentPromptInput: promptInput, // 현재 입력 중인 프롬프트도 저장
        promptResult, // 프롬프트 결과 (번역문)
        taskId,
        stepOrder,
        taskData,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem(`promptInput_${taskId}`, JSON.stringify(saveData))
      console.log('💾 자동 저장 완료 - promptInput 및 promptResult 포함:', promptInput.length, '글자, 결과:', promptResult?.length || 0, '글자, 데이터 유효성:', hasDataToSave)
    } catch (error) {
      console.error('⚠️ 자동 저장 실패:', error)
    }
  }

  // 임시 저장 처리
  const handleTemporarySave = () => {
    // 🔒 읽기 전용 모드에서는 저장 차단
    if (isReadOnlyMode) {
      alert('🔒 제출 완료된 과제는 수정할 수 없습니다.')
      return
    }
    
    const saveData = {
      prompts,
      originalText,
      baselineTranslation: translatedText,
      savedComments,
      totalPromptCount, // 총 프롬프트 실행 횟수 추가
      currentPromptInput: promptInput, // 현재 입력 중인 프롬프트도 저장
      promptResult, // 프롬프트 결과 (번역문)
      taskId,
      stepOrder,
      taskData
    }
    localStorage.setItem(`promptInput_${taskId}`, JSON.stringify(saveData))
    
    // 🔒 제출 완료된 과제는 상태 변경 방지
    if (prompts.length > 0) {
      const currentStatus = localStorage.getItem(`taskProgress_${taskId}`)
      if (currentStatus !== '제출 완료') {
        localStorage.setItem(`taskProgress_${taskId}`, '진행중')
        console.log('✅ 임시 저장 - 진행 상태를 "진행중"으로 업데이트')
      } else {
        console.log('🔒 제출 완료된 과제 - 임시 저장 시 상태 변경 차단')
      }
    }
    
    alert('임시 저장이 완료되었습니다.')
    console.log('💾 임시 저장 완료')
  }

  // 사이드바 네비게이션을 위한 전역 함수 노출
  useEffect(() => {
    window.saveCurrentWork = async () => {
      console.log('🔄 사이드바 네비게이션 - 현재 작업 저장 시작 (Step 2,3,4)')
      handleTemporarySave()
      return Promise.resolve()
    }

    return () => {
      // 컴포넌트 언마운트 시 전역 함수 제거
      delete window.saveCurrentWork
    }
  }, [prompts, originalText, translatedText, savedComments, totalPromptCount, isReadOnlyMode])

  // 나가기 버튼 클릭 시 저장 확인 후 나의 과제 페이지로 이동
  const handleExit = async () => {
    // 🔒 읽기 전용 모드에서는 저장 확인 없이 바로 나가기
    if (isReadOnlyMode) {
      console.log('🔒 읽기 전용 모드 - 저장 확인 없이 바로 나가기')
      navigate('/my-tasks')
      return
    }
    
    // 임시 저장된 데이터가 있는지 확인
    const savedData = localStorage.getItem(`promptInput_${taskId}`)
    const hasSavedData = savedData !== null
    
    // 임시 저장된 데이터와 현재 데이터를 비교해서 실제로 변경사항이 있는지 확인
    let hasChanges = false
    if (hasSavedData) {
      try {
        const parsedData = JSON.parse(savedData)
        hasChanges = JSON.stringify(parsedData.prompts) !== JSON.stringify(prompts) ||
                    parsedData.originalText !== originalText ||
                    parsedData.baselineTranslation !== translatedText ||
                    JSON.stringify(parsedData.savedComments) !== JSON.stringify(savedComments)
      } catch (error) {
        console.error('저장된 데이터 비교 실패:', error)
        hasChanges = true // 에러 발생 시 안전하게 변경사항이 있다고 가정
      }
    } else {
      // 임시 저장된 데이터가 없고 현재 작업이 있는 경우
      hasChanges = prompts.length > 0 || originalText || translatedText
    }
    
    // 변경사항이 있을 때만 alert 표시
    if (hasChanges) {
      let message = '과제를 저장하고 나가시겠습니까?\n\n[확인] 저장\n[취소] 미저장·초기화'
      
      const shouldSave = await showCustomConfirm(message)
      
      if (shouldSave) {
        // 🔑 최신 제출 대상 항목 데이터 우선 사용 (reviewDataCache -> localStorage 순서)
        let existingFinalSelectionData = {}
        
        // 1. reviewDataCache에서 최신 데이터 우선 사용
        if (reviewDataCache && (reviewDataCache.savedQualityEvaluations || reviewDataCache.savedQualityScores || reviewDataCache.bestPromptId)) {
          existingFinalSelectionData = {
            savedComments: reviewDataCache.savedComments || {},
            savedQualityEvaluations: reviewDataCache.savedQualityEvaluations || {},
            savedQualityScores: reviewDataCache.savedQualityScores || {},
            bestPromptId: reviewDataCache.bestPromptId || null
          }
          console.log('🔑 나가기 시 캐시된 최신 제출 대상 항목 데이터 사용:', existingFinalSelectionData)
        } else {
          // 2. 캐시가 없으면 localStorage에서 읽기
          const existingReviewData = localStorage.getItem(`promptReview_${taskId}`)
          if (existingReviewData) {
            try {
              const parsedData = JSON.parse(existingReviewData)
              existingFinalSelectionData = {
                savedComments: parsedData.savedComments || {}, // 🔑 기존 코멘트도 보존
                savedQualityEvaluations: parsedData.savedQualityEvaluations || {},
                savedQualityScores: parsedData.savedQualityScores || {},
                bestPromptId: parsedData.bestPromptId || null
              }
              console.log('🔄 나가기 시 localStorage 제출 대상 항목 데이터 보존:', existingFinalSelectionData)
            } catch (error) {
              console.error('기존 데이터 파싱 실패:', error)
            }
          }
        }
        
        // 코멘트 데이터 병합 (현재 페이지 + 기존 페이지)
        const mergedComments = {
          ...existingFinalSelectionData.savedComments, // 기존 코멘트
          ...savedComments // 현재 페이지 코멘트 (덮어쓰기)
        }
        
        // 저장 후 진행 상태 업데이트 (기존 데이터 보존)
        const saveData = {
          prompts,
          originalText,
          baselineTranslation: translatedText,
          savedComments: mergedComments, // 병합된 코멘트 저장
          totalPromptCount, // 총 프롬프트 실행 횟수 추가
          currentPromptInput: promptInput, // 현재 입력 중인 프롬프트
          promptResult, // 프롬프트 결과 (번역문)
          savedQualityEvaluations: existingFinalSelectionData.savedQualityEvaluations || {},
          savedQualityScores: existingFinalSelectionData.savedQualityScores || {},
          bestPromptId: existingFinalSelectionData.bestPromptId || null,
          taskId,
          stepOrder,
          taskData
        }
        
        // promptInput과 promptReview 둘 다에 저장 (데이터 동기화)
        localStorage.setItem(`promptInput_${taskId}`, JSON.stringify(saveData))
        localStorage.setItem(`promptReview_${taskId}`, JSON.stringify(saveData))
        
        // 🔒 제출 완료된 과제는 상태 변경 방지
        const currentStatus = localStorage.getItem(`taskProgress_${taskId}`)
        if (currentStatus !== '제출 완료') {
          localStorage.setItem(`taskProgress_${taskId}`, '진행중')
          console.log('✅ 진행 상태를 "진행중"으로 업데이트')
        } else {
          console.log('🔒 제출 완료된 과제 - 상태 변경 차단')
        }
        
        console.log('💾 나가기 전 저장 완료')
      } else {
        // 취소 시 임시 저장된 데이터는 보존하고, 현재 작업만 초기화
        if (hasSavedData) {
          console.log('🔄 취소 시 임시 저장된 데이터 보존, 현재 작업 초기화')
          // 현재 작업 상태를 임시 저장된 데이터로 복원
          try {
            const parsedData = JSON.parse(savedData)
            setPrompts(parsedData.prompts || [])
            setOriginalText(parsedData.originalText || '')
            setTranslatedText(parsedData.baselineTranslation || '')
            setSavedComments(parsedData.savedComments || {})
            setPromptHistory(parsedData.prompts || [])
            setPromptCounter(parsedData.prompts ? parsedData.prompts.length + 1 : 1)
            
            // 복원된 데이터를 다시 로컬 스토리지에 저장하여 임시 저장 상태 유지
            const restoredData = {
              prompts: parsedData.prompts || [],
              originalText: parsedData.originalText || '',
              baselineTranslation: parsedData.baselineTranslation || '',
              savedComments: parsedData.savedComments || {},
              totalPromptCount: parsedData.totalPromptCount || 0, // 총 프롬프트 실행 횟수 추가
              taskId,
              stepOrder,
              taskData
            }
            localStorage.setItem(`promptInput_${taskId}`, JSON.stringify(restoredData))
            console.log('💾 임시 저장된 데이터 복원 후 로컬 스토리지에 재저장 완료')
          } catch (error) {
            console.error('임시 저장된 데이터 복원 실패:', error)
          }
        }
      }
    }
    
    navigate('/my-tasks')
  }

  // 좋아요 결과물 코멘트 작성 버튼 클릭 시
  const handleSubmit = () => {
    // 🛡️ 강력한 데이터 보호: 페이지 이동 직전 다중 저장
    console.log('🛡️ Step 2,3,4 페이지 이동 직전 - 강력한 데이터 보호 실행')
    clearTimeout(window.autoSaveTimeout) // 기존 타이머 정리
    
    // 1차 저장: 기존 자동 저장
    autoSavePromptData()
    
    // 2차 저장: 강제 저장 (빈 데이터 체크 없이)
    const forcesSaveData = {
      prompts,
      originalText,
      baselineTranslation: translatedText,
      savedComments,
      totalPromptCount,
      currentPromptInput: promptInput,
      promptResult,
      taskId,
      stepOrder,
      taskData,
      timestamp: new Date().toISOString(),
      forceSave: true // 강제 저장 플래그
    }
    localStorage.setItem(`promptInput_${taskId}`, JSON.stringify(forcesSaveData))
    localStorage.setItem(`emergency_backup_${taskId}`, JSON.stringify(forcesSaveData))
    console.log('🛡️ Step 2,3,4 강제 저장 및 긴급 백업 완료:', prompts.length, '개 프롬프트')
    
    // 모든 프롬프트에 좋아요/싫어요가 선택되었는지 확인
    const hasUnratedPrompts = prompts.some(prompt => prompt.isLiked === undefined)
    
    if (hasUnratedPrompts) {
      alert('모든 프롬프트에 대해 좋아요/싫어요를 선택해주세요.')
      return
    }
    
    // 캐시된 제출 대상 항목 데이터 사용 (이미 useEffect에서 로드됨)
    const existingFinalSelectionData = {
      savedComments: savedComments || {}, // 현재 페이지의 코멘트 사용
      savedQualityEvaluations: reviewDataCache.savedQualityEvaluations || {},
      savedQualityScores: reviewDataCache.savedQualityScores || {},
      bestPromptId: reviewDataCache.bestPromptId || null,
      originalText: originalText || '',
      baselineTranslation: translatedText || '',
      totalPromptCount: totalPromptCount || 0
    }
    
    console.log('🔄 캐시된 제출 대상 항목 데이터 사용:', {
      hasQualityEvaluations: !!existingFinalSelectionData.savedQualityEvaluations && Object.keys(existingFinalSelectionData.savedQualityEvaluations).length > 0,
      hasQualityScores: !!existingFinalSelectionData.savedQualityScores && Object.keys(existingFinalSelectionData.savedQualityScores).length > 0,
      bestPromptId: existingFinalSelectionData.bestPromptId,
      qualityEvaluationsCount: Object.keys(existingFinalSelectionData.savedQualityEvaluations).length,
      qualityScoresCount: Object.keys(existingFinalSelectionData.savedQualityScores).length
    })
    
    // 코멘트 데이터 병합 (현재 페이지 + 기존 페이지)
    const mergedComments = {
      ...existingFinalSelectionData.savedComments, // 기존 코멘트
      ...savedComments // 현재 페이지 코멘트 (덮어쓰기)
    }
    
    // 현재 페이지의 모든 상태를 로컬 스토리지에 저장 (기존 데이터 보존)
    const saveData = {
      prompts,
      originalText,
      baselineTranslation: translatedText,
      savedComments: mergedComments, // 병합된 코멘트 저장
      totalPromptCount, // 총 프롬프트 실행 횟수 추가
      savedQualityEvaluations: existingFinalSelectionData.savedQualityEvaluations || {},
      savedQualityScores: existingFinalSelectionData.savedQualityScores || {},
      bestPromptId: existingFinalSelectionData.bestPromptId || null,
      taskId,
      stepOrder,
      taskData
    }
    
    // promptInput과 promptReview 둘 다에 저장 (데이터 동기화)
    localStorage.setItem(`promptInput_${taskId}`, JSON.stringify(saveData))
    localStorage.setItem(`promptReview_${taskId}`, JSON.stringify(saveData))
    console.log('💾 프롬프트 입력 페이지 전체 상태 저장 완료 (제출 대상 항목 데이터 보존)')
    console.log('🔍 저장된 데이터 상세:', {
      hasSavedComments: !!saveData.savedComments,
      savedCommentsKeys: saveData.savedComments ? Object.keys(saveData.savedComments) : [],
      hasSavedQualityEvaluations: !!saveData.savedQualityEvaluations,
      savedQualityEvaluationsKeys: saveData.savedQualityEvaluations ? Object.keys(saveData.savedQualityEvaluations) : [],
      hasSavedQualityScores: !!saveData.savedQualityScores,
      savedQualityScoresKeys: saveData.savedQualityScores ? Object.keys(saveData.savedQualityScores) : [],
      bestPromptId: saveData.bestPromptId
    })
    
    // PromptReviewPage로 이동
    navigate('/prompt-review', {
      state: {
        prompts, // prompts를 직접 전달
        originalText,
        baselineTranslation: translatedText,
        savedComments: mergedComments, // 병합된 코멘트 전달
        savedQualityEvaluations: existingFinalSelectionData.savedQualityEvaluations || {}, // 품질 평가 데이터 전달
        savedQualityScores: existingFinalSelectionData.savedQualityScores || {}, // 품질 점수 데이터 전달
        bestPromptId: existingFinalSelectionData.bestPromptId || null, // Best 프롬프트 ID 전달
        totalPromptCount, // 총 프롬프트 입력 회수 전달
        taskId,
        stepOrder,
        ...taskData
      }
    })
  }

  // 프롬프트 입력 처리
  const handlePromptSubmit = async (e) => {
    console.log('🔍 프롬프트 입력 이벤트 발생:', e.key, e.type)
    
    // 중복 실행 방지: 이미 처리 중이면 무시
    if (promptLoading) {
      console.log('⚠️ 이미 프롬프트 처리 중 - 중복 실행 방지')
      return
    }
    
    if (e.key === 'Enter' && promptInput.trim()) {
      e.preventDefault()
      
      // 디바운싱: 500ms 내에 중복 Enter 키 입력 방지
      const now = Date.now()
      if (now - lastEnterKeyTime < 500) {
        console.log('⚠️ Enter 키 디바운싱 - 중복 입력 방지')
        return
      }
      setLastEnterKeyTime(now)
      
      console.log('✅ Enter 키 + 프롬프트 텍스트 감지됨')
      
      // 🔒 읽기 전용 모드에서는 프롬프트 입력 차단
      if (isReadOnlyMode) {
        alert('🔒 제출 완료된 과제는 수정할 수 없습니다.')
        return
      }
      
      // 즉시 promptLoading 상태 설정하여 중복 실행 방지
      setPromptLoading(true)
      
      try {
        // 첫 번째 프롬프트 전송 시에만 URL 텍스트 내용 새로고침 (Step 2,3,4: 원문, 기본 번역문만)
        if (prompts.length === 0) {
          console.log('🔄 Step 2,3,4: 첫 번째 프롬프트 전송 - URL 텍스트 내용 새로고침 시작...')
          
          // 중복 새로고침 방지: 이미 새로고침 중이면 건너뛰기
          const refreshKey = `url_refresh_${taskId}`
          if (localStorage.getItem(refreshKey)) {
            console.log('⚠️ 이미 URL 새로고침 중 - 중복 실행 방지')
          } else {
            try {
              localStorage.setItem(refreshKey, 'true') // 새로고침 시작 플래그
              
              const googleSheetsService = getGoogleSheetsService()
              const detail = await googleSheetsService.getProjectDetail(taskId)
              
              // 원문 새로고침 (getProjectDetail에서 이미 텍스트 추출됨)
              if (detail.sourceText && detail.sourceText !== originalText) {
                console.log('📖 Step 2,3,4: 원문 텍스트 새로고침:', detail.sourceText.length, '글자')
                setOriginalText(detail.sourceText)
                localStorage.setItem(`cachedOriginalText_${taskId}`, detail.sourceText)
              }
              
              // 기본 번역문 새로고침 (getProjectDetail에서 이미 텍스트 추출됨)
              if (detail.baselineTranslationText && detail.baselineTranslationText !== translatedText) {
                console.log('📝 Step 2,3,4: 기본 번역문 새로고침:', detail.baselineTranslationText.length, '글자')
                setTranslatedText(detail.baselineTranslationText)
                localStorage.setItem(`cachedTranslatedText_${taskId}`, detail.baselineTranslationText)
              }
              
              // Step 2,3,4에서도 설정집과 기본 프롬프트 캐시 저장
              if (detail.settingsText) {
                console.log('⚙️ Step 2,3,4: 설정집 새로고침:', detail.settingsText.length, '글자')
                localStorage.setItem(`cached_settings_${taskId}`, detail.settingsText)
              }
              if (detail.contextAnalysisText) {
                console.log('🔍 Step 2,3,4: 맥락 분석 새로고침:', detail.contextAnalysisText.length, '글자')
                localStorage.setItem(`cached_context_${taskId}`, detail.contextAnalysisText)
              }
              
              // 베이스캠프 프롬프트 우선 저장, 없으면 가이드 프롬프트 저장
              if (detail.basecampPromptText) {
                console.log('📋 Step 2,3,4: 베이스캠프 프롬프트 새로고침:', detail.basecampPromptText.length, '글자')
                localStorage.setItem(`cached_basecamp_${taskId}`, detail.basecampPromptText)
              } else if (detail.guidePromptText) {
                console.log('📋 Step 2,3,4: 가이드 프롬프트 새로고침:', detail.guidePromptText.length, '글자')
                localStorage.setItem(`cached_guide_${taskId}`, detail.guidePromptText)
              }
              
              console.log('✅ Step 2,3,4: 첫 번째 프롬프트 전송 - URL 텍스트 내용 새로고침 완료')
            } catch (error) {
              console.error('❌ Step 2,3,4: 첫 번째 프롬프트 전송 - URL 텍스트 내용 새로고침 실패:', error)
            } finally {
              localStorage.removeItem(refreshKey) // 새로고침 완료 플래그 제거
            }
          }
        } else {
          console.log('🔒 Step 2,3,4: 이미 프롬프트가 전송된 과제 - URL 텍스트 내용 고정됨')
        }
        
        // 📊 일일 프롬프트 입력 제한 확인
        const userEmail = user?.email
        if (!promptLimitService.checkAndHandlePromptLimit(userEmail)) {
          console.log('⚠️ 일일 프롬프트 입력 제한 초과로 중단')
          return
        }

        // ⏱️ 프롬프트 재전송 3분 제한 확인
        const currentTime = Date.now()
        const threeMinutesMs = 3 * 60 * 1000 // 3분 = 180,000ms
        const timeSinceLastPrompt = currentTime - lastPromptTime
        
        if (lastPromptTime > 0 && timeSinceLastPrompt < threeMinutesMs) {
          const remainingTime = Math.ceil((threeMinutesMs - timeSinceLastPrompt) / 1000)
          const minutes = Math.floor(remainingTime / 60)
          const seconds = remainingTime % 60
          
          alert(
            '이전 프롬프트 전송 후 3분이 지나야 재전송이 가능합니다.\n' +
            `남은 시간: ${minutes}분 ${seconds}초\n\n` +
            '잠시 후 다시 시도해주세요.'
          )

        
          console.log(`⏱️ Step 2,3,4 프롬프트 3분 제한: ${remainingTime}초 남음`)
          return
        }

        // 🚫 100개 프롬프트 제한 확인
        if (prompts.length >= 100) {
          alert('⚠️ 과제당 최대 100개의 프롬프트만 입력 가능합니다.\n\n추가 프롬프트가 필요하시면 담당자에게 문의해주세요.\n\n현재 생성된 프롬프트로 좋아요/싫어요 평가를 완료하고 다음 단계로 진행해주세요.')
          return
        }
        
        const promptTime = Date.now()
        const timeSinceLastPromptSubmit = promptTime - lastPromptTime
        const threeMinutesInMs = 3 * 60 * 1000 // 3분을 밀리초로
        
        // 3분 쿨다운 체크
        if (timeSinceLastPromptSubmit < threeMinutesInMs && lastPromptTime !== 0) {
          const remainingTime = Math.ceil((threeMinutesInMs - timeSinceLastPromptSubmit) / 1000 / 60)
          alert(`프롬프트 입력은 3분마다 가능합니다. ${remainingTime}분 후에 다시 시도해주세요.`)
          return
        }
        
        const promptText = promptInput.trim()
        
        // 프롬프트 결과 번역문에 로딩 표시
        setPromptResult('AI가 프롬프트를 처리하고 있습니다...')
        
        // 입력한 프롬프트 내용의 버블을 바로 생성
        const newPrompt = {
          id: Date.now(),
          text: promptText,
          timestamp: new Date(),
          version: `V${promptCounter}`,
          status: 'default',
          isLiked: undefined, // 좋아요/싫어요 상태 초기화
          result: null // 아직 결과가 없음
        }
        
        // 프롬프트 이력에 즉시 추가 (결과 없이)
        setPromptHistory(prev => [...prev, newPrompt])
        setPrompts(prev => {
          const updatedPrompts = [...prev, newPrompt]
          
          // 프롬프트 추가 후 즉시 자동 저장 (비동기로 처리)
          setTimeout(() => {
            // 🚨 빈 데이터 저장 방지
            const hasDataToSave = updatedPrompts.length > 0 || originalText || translatedText || Object.keys(savedComments).length > 0
            
            if (hasDataToSave) {
              try {
                const saveData = {
                  prompts: updatedPrompts,
                  originalText,
                  baselineTranslation: translatedText,
                  savedComments,
                  totalPromptCount: totalPromptCount + 1, // 새 프롬프트 추가로 카운트 증가
                  currentPromptInput: '', // 프롬프트 생성 후 입력 필드 초기화
                  taskId,
                  stepOrder,
                  taskData,
                  timestamp: new Date().toISOString()
                }
                localStorage.setItem(`promptInput_${taskId}`, JSON.stringify(saveData))
                console.log('💾 Step 2,3,4 프롬프트 생성 후 즉시 자동 저장 완료:', updatedPrompts.length, '개')
              } catch (error) {
                console.error('⚠️ Step 2,3,4 프롬프트 생성 후 자동 저장 실패:', error)
              }
            } else {
              console.log('⚠️ Step 2,3,4 빈 데이터 저장 방지 - 프롬프트 생성 후 저장 건너뛰기')
            }
          }, 100) // 100ms 후 저장 (상태 업데이트 완료 대기)
          
          return updatedPrompts
        })
        
        // 🔒 제출 완료된 과제는 상태 변경 방지
        const currentStatus = localStorage.getItem(`taskProgress_${taskId}`)
        if (currentStatus !== '제출 완료') {
          localStorage.setItem(`taskProgress_${taskId}`, '진행중')
          console.log('✅ 프롬프트 입력 - 진행 상태를 "진행중"으로 업데이트')
        } else {
          console.log('🔒 제출 완료된 과제 - 프롬프트 입력 시 상태 변경 차단')
        }
        
        // 프롬프트 입력 필드 초기화 (AI 처리 시작 직후)
        setPromptInput('')
        
        // 새로운 프롬프트 버블이 보이도록 자동 스크롤
        setTimeout(() => {
          const promptContainer = document.querySelector('[data-testid="prompt-container"]') || 
                                  document.querySelector('.prompt-container') ||
                                  document.querySelector('[style*="display: flex"][style*="flexDirection: column"]')
          if (promptContainer) {
            promptContainer.scrollTop = promptContainer.scrollHeight
          }
        }, 100)
        
        // Step 2,3,4: Gemini LLM을 사용하여 기본 번역문을 기반으로 프롬프트 적용
        const googleSheetsService = getGoogleSheetsService()
        const geminiService = googleSheetsService.getGeminiService()
        
        console.log('🔑 Gemini API 키 확인 중...')
        
        // 원문과 기본 번역문을 함께 고려한 프롬프트 구성
        const sourceLanguage = taskDetail?.sourceLanguage || languagePair?.split('→')[0]?.trim() || '원본 언어'
        const targetLanguage = taskDetail?.targetLanguage || languagePair?.split('→')[1]?.trim() || '타겟 언어'
        
        // 원문과 기본 번역문을 결합한 컨텍스트 구성
        const combinedContext = `## 원문 (${sourceLanguage}):\n${originalText}\n\n## 기본 번역문 (${targetLanguage}):\n${translatedText}`
        
        console.log(`📊 Step 2,3,4: 원문 + 기본 번역문 컨텍스트 처리`);
        console.log(`📖 원문 길이: ${originalText.length}자`);
        console.log(`📝 기본 번역문 길이: ${translatedText.length}자`);
        console.log(`📋 결합 컨텍스트 길이: ${combinedContext.length}자`);
        
        // 설정집 정보 가져오기 (taskDetail 우선, 캐시 fallback)
        const settingsText = taskDetail?.settingsText || 
                            localStorage.getItem(`cached_settings_${taskId}`) || 
                            ''
        
        // 맥락 분석 정보 가져오기 (taskDetail 우선, 캐시 fallback)
        const contextAnalysisText = taskDetail?.contextAnalysisText || 
                                  localStorage.getItem(`cached_context_${taskId}`) || 
                                  ''
        
        console.log('📊 Step 2,3,4 설정집 및 맥락 분석 정보 확인:', {
          taskDetailSettings: taskDetail?.settingsText?.length || 0,
          cachedSettings: localStorage.getItem(`cached_settings_${taskId}`)?.length || 0,
          finalSettings: settingsText.length,
          taskDetailContext: taskDetail?.contextAnalysisText?.length || 0,
          cachedContext: localStorage.getItem(`cached_context_${taskId}`)?.length || 0,
          finalContext: contextAnalysisText.length
        })
        
        // 원문과 기본 번역문을 모두 고려한 프롬프트 결과 생성
        const result = await geminiService.translateWithGemini(
          combinedContext, // 원문 + 기본 번역문 결합 컨텍스트
          targetLanguage, // 타겟 언어
          settingsText, // 설정집 (캐시 fallback 포함)
          '', // guidePrompt - 사용하지 않음
          promptText, // userPrompt - 사용자의 순수한 프롬프트만 사용
          user?.email, // 사용자 이메일
          contextAnalysisText // ⭐ 새로 추가: 맥락 분석 JSON 텍스트
        )
        
        console.log(`🎉 전체 번역 완료: ${result.length}자`);
        
        // 기존 프롬프트 객체에 결과 추가
        const updatedPrompt = {
          ...newPrompt,
          result: result
        }
        
        // 프롬프트 이력 업데이트 (결과 포함)
        setPromptHistory(prev => prev.map(p => 
          p.id === newPrompt.id ? updatedPrompt : p
        ))
        setPrompts(prev => {
          const updatedPrompts = prev.map(p => 
            p.id === newPrompt.id ? { ...updatedPrompt, isLiked: p.isLiked } : p
          )
          
          // 프롬프트 결과 완료 후 즉시 자동 저장 (비동기로 처리)
          setTimeout(() => {
            // 🚨 빈 데이터 저장 방지
            const hasDataToSave = updatedPrompts.length > 0 || originalText || translatedText || Object.keys(savedComments).length > 0
            
            if (hasDataToSave) {
              try {
                const saveData = {
                  prompts: updatedPrompts,
                  originalText,
                  baselineTranslation: translatedText,
                  savedComments,
                  totalPromptCount,
                  currentPromptInput: '', // 프롬프트 완료 후 입력 필드 초기화
                  promptResult: result, // 프롬프트 결과 번역문도 저장
                  taskId,
                  stepOrder,
                  taskData,
                  timestamp: new Date().toISOString()
                }
                localStorage.setItem(`promptInput_${taskId}`, JSON.stringify(saveData))
                console.log('💾 Step 2,3,4 프롬프트 결과 완료 후 즉시 자동 저장 완료:', updatedPrompts.length, '개')
              } catch (error) {
                console.error('⚠️ Step 2,3,4 프롬프트 결과 완료 후 자동 저장 실패:', error)
              }
            } else {
              console.log('⚠️ Step 2,3,4 빈 데이터 저장 방지 - 프롬프트 결과 완료 후 저장 건너뛰기')
            }
          }, 100) // 100ms 후 저장 (상태 업데이트 완료 대기)
          
          return updatedPrompts
        })
        
        // 프롬프트 결과 번역문에 표시
        setPromptResult(result)
        
        // 시간 및 카운터 업데이트
        setLastPromptTime(promptTime)
        setPromptCounter(prev => prev + 1)
        setTotalPromptCount(prev => prev + 1) // 총 프롬프트 실행 횟수 증가 (과금용)
        
        // 📊 일일 프롬프트 입력 카운트 증가
        const newDailyCount = promptLimitService.incrementTodayPromptCount(userEmail)
        setDailyPromptCount(newDailyCount)
        
      } catch (error) {
        console.error('AI 번역 실패:', error)
        
        // 🎯 사용자 친화적인 에러 메시지 생성
        let userFriendlyMessage = ''
        if (error.message.includes('이메일이 제공되지 않았습니다')) {
          userFriendlyMessage = '로그인 정보에 문제가 있습니다. 다시 로그인해주세요.'
        } else if (error.message.includes('API 키가 등록되지 않았습니다')) {
          userFriendlyMessage = 'API 키가 등록되지 않았습니다. 관리자에게 문의하여 API 키를 등록해주세요.'
        } else if (error.message.includes('API 키 조회 중 오류')) {
          userFriendlyMessage = 'API 키 조회 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          userFriendlyMessage = '번역 서비스 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.'
        } else if (error.message.includes('network') || error.message.includes('연결')) {
          userFriendlyMessage = '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.'
        } else {
          userFriendlyMessage = '번역 처리 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        }
        
        alert(`⚠️ ${userFriendlyMessage}`)
        
        // 에러 발생 시 프롬프트 결과 번역문 초기화
        setPromptResult('')
      } finally {
        setPromptLoading(false)
      }
    }
  }



  // 프롬프트 좋아요 처리
  const handleLikePrompt = (promptId) => {
    setPrompts(prompts.map(p => 
      p.id === promptId 
        ? { ...p, status: p.status === 'liked' ? 'default' : 'liked', isLiked: p.status === 'liked' ? undefined : true }
        : p
    ))
  }

  // 프롬프트 싫어요 처리
  const handleDislikePrompt = (promptId) => {
    const targetPrompt = prompts.find(p => p.id === promptId)
    
    // 좋아요 → 싫어요로 변경하는 경우, 코멘트가 있으면 삭제 확인
    if (targetPrompt && targetPrompt.status === 'liked' && targetPrompt.comment) {
      const confirmed = window.confirm('싫어요로 변경시 저장된 코멘트가 삭제됩니다. 변경하시겠습니까?')
      if (!confirmed) {
        return // 사용자가 취소한 경우
      }
      console.log('⚠️ 좋아요 → 싫어요 변경 시 코멘트 삭제됨:', promptId)
    }
    
    setPrompts(prompts.map(p => 
      p.id === promptId 
        ? { 
            ...p, 
            status: p.status === 'disliked' ? 'default' : 'disliked', 
            isLiked: p.status === 'disliked' ? undefined : false,
            comment: p.status === 'disliked' ? p.comment : null // 좋아요 → 싫어요 변경 시 코멘트 삭제
          }
        : p
    ))
  }

  // 프롬프트 복사 처리
  const handleCopyPrompt = (promptText) => {
    navigator.clipboard.writeText(promptText)
    // TODO: 복사 완료 알림 표시
  }
  
  // 프롬프트 이력 클릭 시 해당 결과 표시
  const handlePromptHistoryClick = (promptId) => {
    console.log('🔍 프롬프트 이력 클릭:', promptId)
    
    // prompts 배열에서 해당 프롬프트 찾기
    const selectedPrompt = prompts.find(p => p.id === promptId)
    
    if (selectedPrompt && selectedPrompt.result) {
      console.log('✅ 프롬프트 결과 찾음, 길이:', selectedPrompt.result.length)
      console.log('📝 프롬프트 텍스트:', selectedPrompt.text)
      console.log('📊 결과 미리보기:', selectedPrompt.result.substring(0, 100) + '...')
      
      // 프롬프트 결과 번역문에 표시
      setPromptResult(selectedPrompt.result)
      
      // 선택된 프롬프트만 'selected' 상태로 변경하고, 나머지는 원래 상태로 복원
      // liked나 disliked 상태는 유지하면서 selected 상태만 추가/해제
      setPrompts(prev => prev.map(p => ({
        ...p,
        status: p.id === promptId ? 
                // 현재 프롬프트: liked/disliked 상태 유지하면서 selected 추가
                (p.status === 'liked' || p.status === 'disliked') ? p.status : 'selected'
                : 
                // 다른 프롬프트: selected 상태만 해제, liked/disliked는 유지
                p.status === 'selected' ? 
                  (p.status === 'liked' ? 'liked' : p.status === 'disliked' ? 'disliked' : 'default')
                  : p.status
      })))
      
      console.log('✅ 프롬프트 결과 번역문 업데이트 완료')
    } else {
      console.warn('⚠️ 프롬프트 결과를 찾을 수 없음:', promptId)
      console.log('📊 현재 prompts 배열:', prompts)
      console.log('📊 현재 promptHistory array:', promptHistory)
    }
  }

  // Step 1 실행: 구글 스프레드시트에서 데이터 가져와서 원문과 번역 생성
  const executeStep1 = async () => {
    try {
      setIsLoading(true)
      
      // TODO: 실제 스프레드시트 ID와 범위 설정
      const spreadsheetId = 'your-spreadsheet-id' // 실제 스프레드시트 ID로 변경 필요
      const range = 'Sheet1!A:B' // A열: 원본 웹소설 링크, B열: 설정집 링크
      
      // 스프레드시트에서 데이터 가져오기
      const sheetData = await googleSheetsService.getSheetData(spreadsheetId, range)
      
      if (sheetData && sheetData.length > 1) {
        const webNovelUrl = sheetData[1][0] // 첫 번째 행은 헤더, 두 번째 행부터 데이터
        const settingsUrl = sheetData[1][1]
        
        // 웹소설 원문 가져오기
        const originalContent = await googleSheetsService.getWebNovelContent(webNovelUrl)
        setOriginalText(originalContent)
        
        // AI 번역 생성
        const translation = await googleSheetsService.generateTranslation(originalContent, settingsUrl)
        setTranslatedText(translation)
        
        // Step 1 데이터 저장
        setStep1Data({
          webNovelUrl,
          settingsUrl,
          originalContent,
          translation
        })
        
        console.log('Step 1 완료:', { webNovelUrl, settingsUrl })
      } else {
        throw new Error('스프레드시트에서 데이터를 찾을 수 없습니다.')
      }
    } catch (error) {
      console.error('Step 1 실행 실패:', error)
      
      // 🎯 사용자 친화적인 에러 메시지 생성
      let userFriendlyMessage = ''
      if (error.message.includes('데이터를 찾을 수 없습니다') || error.message.includes('없음')) {
        userFriendlyMessage = '과제 정보를 불러올 수 없습니다. 관리자에게 문의하거나 다른 과제를 선택해주세요.'
      } else if (error.message.includes('권한') || error.message.includes('접근')) {
        userFriendlyMessage = '과제 접근 권한이 없습니다. 관리자에게 문의해주세요.'
      } else if (error.message.includes('네트워크') || error.message.includes('연결')) {
        userFriendlyMessage = '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인 후 페이지를 새로고침해주세요.'
      } else {
        userFriendlyMessage = '과제를 불러오는 중 문제가 발생했습니다. 페이지를 새로고침하여 다시 시도해주세요.'
      }
      
      // 에러 처리: 사용자에게 알림
      alert(`⚠️ ${userFriendlyMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Step 1 데이터 초기화
  const resetStep1 = () => {
    setOriginalText('')
    setTranslatedText('')
    setStep1Data(null)
    setBaselineTranslationGenerated(false) // 기본 번역문 생성 상태도 초기화
  }

  return (
    <AppLayout currentPage="프롬프트 입력" variant="withoutHeader">
      <style>{spinAnimation}</style> {/* CSS 애니메이션 스타일 적용 */}
      <div style={{ 
        padding: '0', 
        minWidth: '1400px',
        minHeight: '600px',
        maxWidth: '100%',
        maxHeight: 'calc(100vh - 80px - 48px)',
        width: '100%',
        height: 'calc(100vh - 80px - 48px)',
        margin: '0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* 상단 네비게이션 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          marginBottom: '24px',
          padding: '24px 24px 0 24px', // 상단과 좌우 패딩만 유지
          fontSize: designTokens.typography.fontSize.sm,
          color: designTokens.colors.text.muted
        }}>
          <span>나의 과제</span>
          <span style={{ color: designTokens.colors.border.primary }}>&gt;</span>
          <span style={{ 
            color: designTokens.colors.text.primary, 
            fontWeight: designTokens.typography.fontWeight.medium 
          }}>
            프롬프트 입력
          </span>
        </div>

        {/* 과제 정보 바 */}
        <div style={{
          display: 'flex',
          gap: '16px', // 콘텐츠 영역과 동일한 간격
          marginBottom: '32px',
          padding: '0 24px', // 좌우 패딩을 24px로 통일
          alignItems: 'center'
        }}>
          {/* 첫 번째 콘텐츠 영역과 동일한 넓이의 왼쪽 영역 */}
          <div style={{
            flex: 2, // 첫 번째 콘텐츠 영역과 동일한 비율
            display: 'flex',
            gap: '12px',
            flexWrap: 'nowrap',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '8px 16px',
              backgroundColor: designTokens.colors.primary,
              color: 'white',
              borderRadius: designTokens.borders.radius.full,
              fontSize: designTokens.typography.fontSize.sm,
              fontWeight: designTokens.typography.fontWeight.medium,
              flexShrink: 0
            }}>
              과제 시즌 1
            </div>
            <div style={{
              padding: '8px 16px',
              backgroundColor: designTokens.colors.background.secondary,
              color: designTokens.colors.text.muted,
              borderRadius: designTokens.borders.radius.full,
              fontSize: designTokens.typography.fontSize.sm,
              border: `1px solid ${designTokens.colors.border.light}`,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {title} - EP {episode}
            </div>
            <div style={{
              padding: '8px 16px',
              backgroundColor: designTokens.colors.background.secondary,
              color: designTokens.colors.text.muted,
              borderRadius: designTokens.borders.radius.full,
              fontSize: designTokens.typography.fontSize.sm,
              border: `1px solid ${designTokens.colors.border.light}`,
              flexShrink: 0
            }}>
              {stepOrder ? `Step ${stepOrder}` : 'Step 1'}
            </div>
            <div style={{
              padding: '8px 16px',
              backgroundColor: designTokens.colors.background.secondary,
              color: designTokens.colors.text.muted,
              borderRadius: designTokens.borders.radius.full,
              fontSize: designTokens.typography.fontSize.sm,
              border: `1px solid ${designTokens.colors.border.light}`,
              flexShrink: 0
            }}>
              {languagePair}
            </div>
          </div>

          {/* 맥락 정보 및 프롬프트 가이드 버튼들 */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            {/* 맥락 정보 버튼 */}
            <Button
              variant="green"
              size="small"
              style="solid"
              onClick={handleOpenContextModal}
            >
              ℹ️ 맥락 정보
            </Button>
            
            {/* 프롬프트 가이드 버튼 */}
            <Button
              variant="white"
              size="small"
              style="solid"
              onClick={handleOpenGuideModal}
            >
              📝 프롬프트 작성 예시
            </Button>
          </div>
        </div>
        
        {/* 메인 콘텐츠 영역 - 세로 2분할 */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', // 헤더 영역과 동일한 간격
          flex: 1,
          minHeight: 0, // flexbox에서 스크롤이 제대로 작동하도록
          padding: '0 24px', // 좌우 패딩을 24px로 통일
          height: 'calc(100vh - 80px - 8px)', // 화면 높이 제한으로 전체 스크롤 방지
          overflow: 'hidden' // 전체 스크롤 방지
        }}>
          {/* 첫 번째 콘텐츠 영역: 기본 번역문, 원문, 프롬프트 결과 번역문을 가로로 배치 */}
          <div style={{ 
            flex: 2, // 2/3 비율
            display: 'flex', 
            gap: '16px',
            minWidth: 0, // flexbox에서 스크롤이 제대로 작동하도록
            padding: '16px', // 첫 번째 영역 패딩
            backgroundColor: 'rgba(0, 0, 0, 0.02)', // 구분을 위한 배경색
            borderRadius: '12px', // 둥근 테두리
            border: '1px solid rgba(0, 0, 0, 0.1)' // 테두리
          }}>
            {/* 기본 번역문과 원문을 토글 버튼 그룹으로 */}
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              gap: '16px',
              minWidth: 0, // flexbox에서 스크롤이 제대로 작동하도록
              height: '100%' // 전체 높이 사용
            }}>
              {/* 토글 버튼 그룹 */}
              <div style={{
                display: 'flex',
                backgroundColor: designTokens.colors.background.secondary,
                borderRadius: designTokens.borders.radius.md,
                padding: '4px',
                border: `1px solid ${designTokens.colors.border.light}`,
                flexShrink: 0 // 축소되지 않도록 고정
              }}>
                <button
                  onClick={() => setActiveTab('original')}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    backgroundColor: activeTab === 'original' 
                      ? designTokens.colors.background.primary 
                      : 'transparent',
                    color: activeTab === 'original' 
                      ? designTokens.colors.text.primary 
                      : designTokens.colors.text.muted,
                    border: 'none',
                    borderRadius: designTokens.borders.radius.sm,
                    fontSize: designTokens.typography.fontSize.sm,
                    fontWeight: designTokens.typography.fontWeight.medium,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  원문
                </button>
                <button
                  onClick={() => setActiveTab('translation')}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    backgroundColor: activeTab === 'translation' 
                      ? designTokens.colors.background.primary 
                      : 'transparent',
                    color: activeTab === 'translation' 
                      ? designTokens.colors.text.primary 
                      : designTokens.colors.text.muted,
                    border: 'none',
                    borderRadius: designTokens.borders.radius.sm,
                    fontSize: designTokens.typography.fontSize.sm,
                    fontWeight: designTokens.typography.fontWeight.medium,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  기본 번역문
                </button>
              </div>

              {/* 토글에 따른 텍스트 영역 */}
              <div style={{ 
                flex: 1,
                padding: '16px',
                backgroundColor: 'white',
                border: `1px solid ${designTokens.colors.border.light}`,
                borderRadius: designTokens.borders.radius.md,
                overflow: 'auto',
                minHeight: 0 // flexbox에서 스크롤이 제대로 작동하도록
              }}>
                {activeTab === 'translation' ? (
                  // 기본 번역문 표시
                  <div style={{
                    fontSize: designTokens.typography.fontSize.sm,
                    lineHeight: designTokens.typography.lineHeight.normal,
                    color: designTokens.colors.text.muted,
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-all'
                  }}>
                    {isLoading && !translatedText ? (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        gap: '16px',
                        color: designTokens.colors.text.muted
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          border: `3px solid ${designTokens.colors.border.light}`,
                          borderTop: `3px solid ${designTokens.colors.primary}`,
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                            기본 번역문 로딩 중...
                          </div>
                          <div style={{ fontSize: '12px' }}>
                            기본 번역문을 가져오고 있습니다
                          </div>
                        </div>
                      </div>
                    ) : translatedText ? (
                      translatedText
                    ) : (
                      '기본 번역문이 여기에 표시됩니다.'
                    )}
                  </div>
                ) : (
                  // 원문 표시
                  <div style={{
                    fontSize: designTokens.typography.fontSize.sm,
                    lineHeight: designTokens.typography.lineHeight.normal,
                    color: designTokens.colors.text.muted,
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-all'
                  }}>
                    {isLoading && !originalText ? (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        gap: '16px',
                        color: designTokens.colors.text.muted
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          border: `3px solid ${designTokens.colors.border.light}`,
                          borderTop: `3px solid ${designTokens.colors.primary}`,
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                            원문 텍스트 로딩 중...
                          </div>
                          <div style={{ fontSize: '12px' }}>
                            원문을 가져오고 있습니다
                          </div>
                        </div>
                      </div>
                    ) : originalText ? (
                      originalText
                    ) : (
                      '원문이 여기에 표시됩니다.'
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 중앙 패널: 프롬프트 결과 번역문 - 왼쪽과 동일한 너비 */}
            <div style={{ 
              flex: 1, // flex: 1로 변경하여 왼쪽과 동일한 너비
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              minWidth: 0, // flexbox에서 스크롤이 제대로 작동하도록
              height: '100%' // 전체 높이 사용
            }}>
              {/* 프롬프트 결과 번역문 토글 버튼 그룹 */}
              <div style={{
                display: 'flex',
                backgroundColor: designTokens.colors.background.secondary,
                borderRadius: designTokens.borders.radius.md,
                padding: '4px',
                border: `1px solid ${designTokens.colors.border.light}`,
                flexShrink: 0 // 축소되지 않도록 고정
              }}>
                <button
                  onClick={() => setPromptResultMode('result')}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    backgroundColor: promptResultMode === 'result' 
                      ? designTokens.colors.background.primary 
                      : 'transparent',
                    color: promptResultMode === 'result' 
                      ? designTokens.colors.text.primary 
                      : designTokens.colors.text.muted,
                    border: 'none',
                    borderRadius: designTokens.borders.radius.sm,
                    fontSize: designTokens.typography.fontSize.sm,
                    fontWeight: designTokens.typography.fontWeight.medium,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  프롬프트 결과 번역문
                </button>
                <button
                  onClick={() => setPromptResultMode('diff')}
                  disabled={!translatedText || !promptResult} // 기본 번역문과 프롬프트 결과가 모두 있을 때만 활성화
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    backgroundColor: promptResultMode === 'diff' 
                      ? designTokens.colors.background.primary 
                      : 'transparent',
                    color: (!translatedText || !promptResult) 
                      ? designTokens.colors.text.disabled
                      : promptResultMode === 'diff' 
                      ? designTokens.colors.text.primary 
                      : designTokens.colors.text.muted,
                    border: 'none',
                    borderRadius: designTokens.borders.radius.sm,
                    fontSize: designTokens.typography.fontSize.sm,
                    fontWeight: designTokens.typography.fontWeight.medium,
                    cursor: (!translatedText || !promptResult) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: (!translatedText || !promptResult) ? 0.5 : 1
                  }}
                >
                  번역문 비교
                </button>
              </div>
              {/* 토글에 따른 컨텐츠 영역 */}
              <div style={{ 
                flex: 1,
                minHeight: 0 // flexbox에서 스크롤이 제대로 작동하도록
              }}>
                {promptResultMode === 'diff' ? (
                  // Diff 비교 모드
                  <div style={{ height: '100%', overflow: 'auto' }}>
                    <TranslationDiffViewer
                      baselineTranslation={translatedText}
                      promptResultTranslation={promptResult}
                      targetLanguage={taskDetail?.targetLanguage || languagePair?.split('→')[1]?.trim()?.toLowerCase() || 'ko'}
                    />
                  </div>
                ) : (
                  // 프롬프트 결과 번역문 모드
                  <div style={{ 
                    height: '100%',
                    padding: '16px',
                    backgroundColor: isReadOnlyMode ? designTokens.colors.background.secondary : 'white',
                    border: `1px solid ${designTokens.colors.border.light}`,
                    borderRadius: designTokens.borders.radius.md,
                    overflow: 'auto'
                  }}>
                    <div style={{
                      fontSize: designTokens.typography.fontSize.sm,
                      lineHeight: designTokens.typography.lineHeight.normal,
                      color: promptResult ? designTokens.colors.text.primary : designTokens.colors.text.muted,
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-all'
                    }}>
                      {promptLoading ? (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          gap: '16px',
                          color: designTokens.colors.text.muted
                        }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            border: `3px solid ${designTokens.colors.border.light}`,
                            borderTop: `3px solid ${designTokens.colors.primary}`,
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }} />
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                              프롬프트 결과 로딩 중...
                            </div>
                            <div style={{ fontSize: '12px' }}>
                              프롬프트 결과를 생성하고 있습니다
                            </div>
                          </div>
                        </div>
                      ) : promptResult ? (
                        promptResult
                      ) : isReadOnlyMode ? (
                        '🔒 제출 완료된 과제입니다. 오른쪽 프롬프트를 선택하여 번역 결과를 확인하세요.'
                      ) : (
                        '프롬프트를 입력하고 전송하면 번역 결과가 여기에 표시됩니다.'
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 두 번째 콘텐츠 영역: 프롬프트 입력 - 별도 분할 영역 */}
          <div style={{ 
            flex: 1, // 1/3 비율
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            minWidth: 0, // flexbox에서 스크롤이 제대로 작동하도록
            height: '100%', // 전체 높이 사용
            backgroundColor: 'white', // 흰색 배경으로 변경
            padding: '16px', // 1번 콘텐츠 영역과 동일한 패딩
            borderRadius: '12px', // 1번 콘텐츠 영역과 동일한 둥근 테두리
            border: '1px solid rgba(0, 0, 0, 0.1)', // 1번 콘텐츠 영역과 동일한 테두리
            position: 'relative' // 위치 설정
          }}>
            {/* 프롬프트 입력 헤더 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              flexShrink: 0 // 축소되지 않도록 고정
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
              <span style={{
                fontSize: designTokens.typography.fontSize.sm,
                fontWeight: designTokens.typography.fontWeight.medium,
                color: designTokens.colors.text.primary
              }}>
                프롬프트 입력
              </span>
              </div>
              {/* 프롬프트 카운트 표시 */}
              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                <div style={{
                  fontSize: '11px',
                  color: designTokens.colors.text.muted || '#9ca3af',
                  backgroundColor: 'rgba(243, 244, 246, 0.6)',
                  padding: '2px 6px',
                  borderRadius: '8px',
                  opacity: 0.8
                }}>
                  현재 프롬프트 입력: {totalPromptCount}회
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#dc3545',
                  backgroundColor: 'rgba(220, 53, 69, 0.1)',
                  padding: '2px 6px',
                  borderRadius: '8px',
                  fontWeight: '500'
                }}>
                  일일 프롬프트 입력: {dailyPromptCount}회
                </div>
              </div>
            </div>

            {/* 프롬프트 버블 표시 영역 - 세로로 전체 공간 채움 */}
            <div 
              data-testid="prompt-container"
              style={{
                flex: 1, // 남은 공간을 모두 차지
                padding: '16px',
                backgroundColor: 'white',
                border: `1px solid ${designTokens.colors.border.light}`,
                borderRadius: designTokens.borders.radius.md,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0, // flexbox에서 스크롤이 제대로 작동하도록
                overflow: 'auto', // 스크롤 가능하도록
                height: '100%' // 높이를 100%로 설정하여 공간을 꽉 채움
              }}
            >
              {prompts.length === 0 ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: designTokens.colors.text.muted,
                  fontSize: designTokens.typography.fontSize.sm
                }}>
                  프롬프트를 입력해 주세요.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                  {prompts.map((prompt) => (
                    <PromptBubble
                      key={prompt.id}
                      version={prompt.version}
                      promptText={prompt.text}
                      timestamp={prompt.timestamp}
                      status={prompt.status}
                      isReadOnly={isReadOnlyMode}
                      onLike={(newStatus) => {
                        if (isReadOnlyMode) {
                          alert('🔒 제출 완료된 과제는 수정할 수 없습니다.')
                          return
                        }
                        const updatedPrompts = prompts.map(p => 
                          p.id === prompt.id 
                            ? { ...p, status: newStatus, isLiked: newStatus === 'liked' ? true : undefined }
                            : p
                        )
                        setPrompts(updatedPrompts)
                        
                        // 좋아요 상태 변경 후 즉시 자동 저장
                        setTimeout(() => {
                          // 🚨 빈 데이터 저장 방지
                          const hasDataToSave = updatedPrompts.length > 0 || originalText || translatedText || Object.keys(savedComments).length > 0
                          
                          if (hasDataToSave) {
                            try {
                              const saveData = {
                                prompts: updatedPrompts,
                                originalText,
                                baselineTranslation: translatedText,
                                savedComments,
                                totalPromptCount,
                                currentPromptInput: promptInput,
                                promptResult,
                                taskId,
                                stepOrder,
                                taskData,
                                timestamp: new Date().toISOString()
                              }
                              localStorage.setItem(`promptInput_${taskId}`, JSON.stringify(saveData))
                              console.log('💾 Step 2,3,4 좋아요 상태 변경 후 자동 저장 완료')
                            } catch (error) {
                              console.error('⚠️ Step 2,3,4 좋아요 상태 변경 후 자동 저장 실패:', error)
                            }
                          } else {
                            console.log('⚠️ Step 2,3,4 빈 데이터 저장 방지 - 좋아요 상태 변경 후 저장 건너뛰기')
                          }
                        }, 100)
                      }}
                      onDislike={(newStatus) => {
                        if (isReadOnlyMode) {
                          alert('🔒 제출 완료된 과제는 수정할 수 없습니다.')
                          return
                        }
                        // 좋아요 → 싫어요로 변경하는 경우, 코멘트가 있으면 삭제 확인
                        if (prompt.status === 'liked' && newStatus === 'disliked' && prompt.comment) {
                          const confirmed = window.confirm('싫어요로 변경시 저장된 코멘트가 삭제됩니다. 변경하시겠습니까?')
                          if (!confirmed) {
                            return // 사용자가 취소한 경우
                          }
                          console.log('⚠️ PromptBubble에서 좋아요 → 싫어요 변경 시 코멘트 삭제됨:', prompt.id)
                        }
                        
                        const updatedPrompts = prompts.map(p => 
                          p.id === prompt.id 
                            ? { 
                                ...p, 
                                status: newStatus, 
                                isLiked: newStatus === 'disliked' ? false : undefined,
                                comment: newStatus === 'disliked' ? null : p.comment // 싫어요로 변경 시 코멘트 삭제
                              }
                            : p
                        )
                        setPrompts(updatedPrompts)
                        
                        // 싫어요 상태 변경 후 즉시 자동 저장
                        setTimeout(() => {
                          // 🚨 빈 데이터 저장 방지
                          const hasDataToSave = updatedPrompts.length > 0 || originalText || translatedText || Object.keys(savedComments).length > 0
                          
                          if (hasDataToSave) {
                            try {
                              const saveData = {
                                prompts: updatedPrompts,
                                originalText,
                                baselineTranslation: translatedText,
                                savedComments,
                                totalPromptCount,
                                currentPromptInput: promptInput,
                                promptResult,
                                taskId,
                                stepOrder,
                                taskData,
                                timestamp: new Date().toISOString()
                              }
                              localStorage.setItem(`promptInput_${taskId}`, JSON.stringify(saveData))
                              console.log('💾 Step 2,3,4 싫어요 상태 변경 후 자동 저장 완료')
                            } catch (error) {
                              console.error('⚠️ Step 2,3,4 싫어요 상태 변경 후 자동 저장 실패:', error)
                            }
                          } else {
                            console.log('⚠️ Step 2,3,4 빈 데이터 저장 방지 - 싫어요 상태 변경 후 저장 건너뛰기')
                          }
                        }, 100)
                      }}
                      onCopy={() => handleCopyPrompt(prompt.text)}
                      onClick={() => handlePromptHistoryClick(prompt.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 기본 번역문 교정 프롬프트 입력 필드 */}
            <div style={{ flexShrink: 0 }}> {/* 축소되지 않도록 고정 */}
              <div style={{
                padding: '16px',
                backgroundColor: 'white',
                border: `1px solid ${designTokens.colors.border.light}`,
                borderRadius: designTokens.borders.radius.md,
                height: '120px', // 높이를 늘려서 공간을 더 활용
                position: 'relative' // 입력 버튼 위치 기준
              }}>
                <textarea
                  className="text-input-common"
                  placeholder={
                    isReadOnlyMode 
                      ? "🔒 제출 완료된 과제는 수정할 수 없습니다." 
                      : promptLoading 
                        ? "AI가 처리 중입니다..." 
                        : "기본 번역문 교정을 위한 프롬프트를 입력해 주세요."
                  }
                  value={promptInput}
                  onChange={(e) => {
                    if (!isReadOnlyMode) {
                      setPromptInput(e.target.value)
                      // 프롬프트 입력 시 자동 저장 (디바운싱 적용)
                      clearTimeout(window.autoSaveTimeout)
                      window.autoSaveTimeout = setTimeout(() => {
                        autoSavePromptData()
                      }, 1000) // 1초 후 자동 저장
                    }
                  }}
                  onKeyDown={!isReadOnlyMode ? handlePromptSubmit : undefined}
                  disabled={promptLoading || isReadOnlyMode}
                  style={{
                    width: '100%',
                    height: '100%',
                    fontSize: designTokens.typography.fontSize.sm,
                    paddingRight: '32px', // 입력 버튼 공간을 더 줄여서 더 많은 텍스트 입력 가능
                    paddingBottom: '40px', // 하단 스크롤 영역이 버튼에 가리지 않도록
                    backgroundColor: isReadOnlyMode || promptLoading ? designTokens.colors.background.secondary : 'white',
                    color: isReadOnlyMode || promptLoading ? designTokens.colors.text.muted : designTokens.colors.text.primary,
                    cursor: isReadOnlyMode || promptLoading ? 'not-allowed' : 'text'
                  }}
                />
                
                {/* 입력 버튼 - 오른쪽 하단에 더 붙여서 배치 */}
                <button
                  onClick={(e) => {
                    if (!isReadOnlyMode && !promptLoading) {
                      const fakeEvent = { key: 'Enter', preventDefault: () => {} }
                      handlePromptSubmit(fakeEvent)
                    }
                  }}
                  disabled={promptLoading || !promptInput.trim() || isReadOnlyMode}
                  style={{
                    position: 'absolute',
                    bottom: '8px', // 더 아래쪽으로
                    right: '8px', // 더 오른쪽으로
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: promptLoading || !promptInput.trim() || isReadOnlyMode
                      ? designTokens.colors.background.secondary 
                      : designTokens.colors.primary,
                    border: 'none',
                    cursor: promptLoading || !promptInput.trim() || isReadOnlyMode ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!promptLoading && promptInput.trim()) {
                      e.target.style.backgroundColor = designTokens.colors.primaryDark || '#1e40af'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!promptLoading && promptInput.trim()) {
                      e.target.style.backgroundColor = designTokens.colors.primary
                    }
                  }}
                >
                  {promptLoading ? (
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: `2px solid transparent`,
                      borderTop: `2px solid white`,
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 고정 액션 버튼들 */}
        <BottomActionBar
          leftButtons={[
            { text: '나가기', variant: 'secondary', size: 'md', onClick: handleExit },
            { 
              text: '임시 저장', 
              variant: 'secondary', 
              size: 'md', 
              onClick: handleTemporarySave,
              disabled: isReadOnlyMode
            }
          ]}
          rightButton={{
            text: isReadOnlyMode ? '제출 내용 확인하기' : '좋아요 결과물 코멘트 작성',
            variant: 'blue',
            size: 'medium',
            style: 'solid',
            onClick: handleSubmit,
            rightIcon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )
          }}
        />

        {/* 프롬프트 가이드 모달 */}
        <PromptGuideModal
          isOpen={isGuideModalOpen}
          onClose={handleCloseGuideModal}
          guideContent={guideContent}
          isLoading={isGuideLoading}
        />

        {/* 맥락 정보 모달 */}
        <ContextInfoModal
          isOpen={isContextModalOpen}
          onClose={handleCloseContextModal}
          contextContent={contextContent}
          isLoading={isContextLoading}
        />

      </div>
    </AppLayout>
  )
}

export default TranslationEditorPage
