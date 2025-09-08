import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { getCurrentUserApiKey } from '@services/userCollectionService'
import { getGoogleSheetsService } from '@services/googleSheetsService'
import { useDesignSystemContext } from '../components/common/DesignSystemProvider'
import { AutoStyledButton, AutoStyledInput, AutoStyledCard } from '../components/common/AutoStyledComponent'
import Button from '../components/common/Button'
import PromptBubble from '../components/common/PromptBubble'
import AppLayout from '../components/layout/AppLayout'
import BottomActionBar from '../components/common/BottomActionBar'
import styles from '../styles/pages/SubmissionPreviewPage.module.css'


const SubmissionPreviewPage = () => {
  const { designTokens } = useDesignSystemContext()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuthStore() // 구글 로그인 사용자 정보
  const taskData = location.state || {}
  
  // 상태 관리
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [prompts, setPrompts] = useState([])
  const [originalText, setOriginalText] = useState('')
  const [baselineTranslation, setBaselineTranslation] = useState('')
  const [commentText, setCommentText] = useState('')
  const [isCommentEditing, setIsCommentEditing] = useState(false)
  const [savedComments, setSavedComments] = useState({})
  const [savedQualityEvaluations, setSavedQualityEvaluations] = useState({}) // 품질 평가 별도 저장
  const [savedQualityScores, setSavedQualityScores] = useState({}) // 품질 점수 별도 저장
  const [totalPromptCount, setTotalPromptCount] = useState(0) // 총 프롬프트 입력 회수
  const [translationView, setTranslationView] = useState('original') // 'original' or 'baseline'
  const [bestPromptId, setBestPromptId] = useState(null)
  const [commentView, setCommentView] = useState('quality') // 'quality' or 'saved'
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false) // 제출 완료된 과제의 읽기 전용 모드
  const [isSubmitting, setIsSubmitting] = useState(false) // 제출 중 상태
  const [taskDetail, setTaskDetail] = useState(null) // 🎯 Google Sheets에서 가져온 과제 상세 정보


  // 과제 정보
  const {
    title,
    episode,
    languagePair,
    projectSeason,
    taskId,
    stepOrder
  } = taskData

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    let taskIdToUse = taskId

    // location.state에서 taskId 추출
    if (location.state?.taskId) {
      taskIdToUse = location.state.taskId
    }
    
    // 🔒 Google Drive 인증 후 백업 데이터 복원 확인
    const checkAndRestoreBackup = () => {
      const backupKey = `submission_backup_${taskIdToUse}`
      const backupData = localStorage.getItem(backupKey)
      
      if (backupData) {
        try {
          const { submissionData, taskData: backupTaskData, timestamp } = JSON.parse(backupData)
          const timeDiff = Date.now() - timestamp
          
          // 백업이 10분 이내인 경우만 복원 (인증 플로우 중인 것으로 간주)
          if (timeDiff < 10 * 60 * 1000) {
            console.log('🔄 Google Drive 인증 후 제출 데이터 복원 중...')
            
            // 백업 데이터로 상태 복원
            if (submissionData) {
              console.log('📋 백업된 제출 데이터 복원:', submissionData)
              
              // 백업 데이터 삭제 (한 번만 사용)
              localStorage.removeItem(backupKey)
              
              // 즉시 Google Drive 업로드 재시도
              setTimeout(() => {
                handleNext(true, submissionData, backupTaskData)
              }, 1000)
              
              return true
            }
          } else {
            // 오래된 백업 데이터 삭제
            localStorage.removeItem(backupKey)
          }
        } catch (error) {
          console.error('❌ 백업 데이터 복원 실패:', error)
          localStorage.removeItem(backupKey)
        }
      }
      
      return false
    }
    
    // 백업 복원 시도
    const wasRestored = checkAndRestoreBackup()
    if (wasRestored) {
      return // 백업 복원된 경우 일반 로드 건너뛰기
    }

    // 🎯 Google Sheets에서 과제 상세 정보 로드 (프롬프트 정보 포함)
    const loadTaskDetail = async () => {
      if (taskIdToUse) {
        try {
          console.log('📡 제출 미리보기 - 과제 상세 정보 로드 시작:', taskIdToUse)
          const googleSheetsService = getGoogleSheetsService()
          const detail = await googleSheetsService.getProjectDetail(taskIdToUse)
          
          if (detail) {
            setTaskDetail(detail)
            console.log('✅ 제출 미리보기 - 과제 상세 정보 로드 완료:', {
              title: detail.title,
              pathGuidePrompt: detail.pathGuidePrompt ? detail.pathGuidePrompt.substring(0, 50) + '...' : 'null',
              pathBasecampPrompt: detail.pathBasecampPrompt ? detail.pathBasecampPrompt.substring(0, 50) + '...' : 'null'
            })
          }
        } catch (error) {
          console.error('❌ 제출 미리보기 - 과제 상세 정보 로드 실패:', error)
        }
      }
    }
    
    // 과제 상세 정보 로드 실행
    loadTaskDetail()
    
    // 🔒 제출 완료 상태 확인
    const checkReadOnlyMode = () => {
      const currentStatus = localStorage.getItem(`taskProgress_${taskIdToUse}`)
      const isCompleted = currentStatus === '제출 완료'
      setIsReadOnlyMode(isCompleted)
      
      if (isCompleted) {

      }
      
      return isCompleted
    }
    
    const isReadOnly = checkReadOnlyMode()
    
    // 항상 로컬 스토리지에서 최신 데이터 로드 (location.state는 무시)
    if (taskIdToUse) {
      const savedData = localStorage.getItem(`promptReview_${taskIdToUse}`)
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)

          
          // 모든 데이터를 로컬 스토리지에서 로드
          if (parsedData.prompts) {

            setPrompts(parsedData.prompts)
          }
          if (parsedData.originalText) setOriginalText(parsedData.originalText)
          if (parsedData.baselineTranslation) setBaselineTranslation(parsedData.baselineTranslation)
          if (parsedData.savedComments) {

            setSavedComments(parsedData.savedComments)
          }
                        if (parsedData.savedQualityEvaluations) {

                setSavedQualityEvaluations(parsedData.savedQualityEvaluations)
              }
              if (parsedData.savedQualityScores) {

                setSavedQualityScores(parsedData.savedQualityScores)
              }
              if (parsedData.totalPromptCount) {

                setTotalPromptCount(parsedData.totalPromptCount)
              }
          if (parsedData.bestPromptId) {

            setBestPromptId(parsedData.bestPromptId)
          }
          

        } catch (error) {
          console.error('로컬 스토리지 데이터 파싱 실패:', error)
        }
      } else {

      }
    } else {

    }
  }, [])

  // 제출 대상 항목은 좋아요 프롬프트만 표시
  const likedPrompts = prompts.filter(prompt => prompt.isLiked === true)
  const displayPrompts = likedPrompts

  // Best 프롬프트 선택 처리
  const handleBestPromptSelect = (promptId) => {

    setBestPromptId(promptId)
    
    // Best 프롬프트 선택 후 즉시 로컬 스토리지에 저장
    const saveData = {
      prompts,
      originalText,
      baselineTranslation,
      savedComments,
      savedQualityEvaluations,
      bestPromptId: promptId,
      taskId,
      stepOrder
    }
    localStorage.setItem(`promptReview_${taskId}`, JSON.stringify(saveData))

  }

  // 프롬프트 선택 처리
  const handlePromptSelect = (prompt) => {
    setSelectedPrompt(prompt)
    setCommentView('quality') // 항상 품질 평가 작성이 기본
    
    // 품질 평가 작성 탭에서 기존 품질 평가 불러오기
    if (savedQualityEvaluations[prompt.id]) {

      setCommentText(savedQualityEvaluations[prompt.id])
      setIsCommentEditing(false) // 저장된 내용이 있으면 읽기 모드
    } else {
      setCommentText('')
      setIsCommentEditing(true) // 저장된 내용이 없으면 편집 모드
    }
  }

  // 좋아요/싫어요 상태 변경 처리
  const handleLikeDislikeChange = (promptId, newIsLiked) => {
    const updatedPrompts = prompts.map(prompt => {
      if (prompt.id === promptId) {
        const updatedPrompt = { ...prompt, isLiked: newIsLiked }
        
        if (!newIsLiked && savedComments[promptId]) {
          if (window.confirm('이미 작성한 코멘트가 있습니다. 싫어요로 변경하면 코멘트가 삭제됩니다. 계속하시겠습니까?')) {
            const newSavedComments = { ...savedComments }
            delete newSavedComments[promptId]
            setSavedComments(newSavedComments)
          } else {
            return prompt
          }
        }
        
        return updatedPrompt
      }
      return prompt
    })
    
    setPrompts(updatedPrompts)
    
    // 상태 변경 후 즉시 로컬 스토리지에 저장
    const saveData = {
      prompts: updatedPrompts,
      originalText,
      baselineTranslation,
      savedComments: newIsLiked ? savedComments : { ...savedComments, [promptId]: undefined },
      savedQualityEvaluations,
      bestPromptId,
      taskId,
      stepOrder
    }
    localStorage.setItem(`promptReview_${taskId}`, JSON.stringify(saveData))
  }

  // 코멘트/품질 평가 저장 처리
  const handleCommentSave = () => {
    if (selectedPrompt && commentText.trim().length >= 20) {
      if (commentView === 'quality') {
        // 품질 평가 작성 탭에서 저장
        const newSavedQualityEvaluations = {
          ...savedQualityEvaluations,
          [selectedPrompt.id]: commentText.trim()
        }
        

        setSavedQualityEvaluations(newSavedQualityEvaluations)
        setIsCommentEditing(false)
        
        // 로컬 스토리지에 즉시 저장
        const saveData = {
          prompts,
          originalText,
          baselineTranslation,
          savedComments,
          savedQualityEvaluations: newSavedQualityEvaluations,
          bestPromptId,
          taskId,
          stepOrder
        }
        localStorage.setItem(`promptReview_${taskId}`, JSON.stringify(saveData))
      } else {
        // 코멘트 탭에서 저장 (기존 로직)
        const newSavedComments = {
          ...savedComments,
          [selectedPrompt.id]: commentText.trim()
        }
        
        setSavedComments(newSavedComments)
        setIsCommentEditing(false)
        
        // 로컬 스토리지에 즉시 저장
        const saveData = {
          prompts,
          originalText,
          baselineTranslation,
          savedComments: newSavedComments,
          savedQualityEvaluations,
          bestPromptId,
          taskId,
          stepOrder
        }
        localStorage.setItem(`promptReview_${taskId}`, JSON.stringify(saveData))
      }
    }
  }

  // 코멘트 수정 모드 활성화
  const handleCommentEdit = () => {
    setIsCommentEditing(true)
    if (selectedPrompt && savedComments[selectedPrompt.id]) {
      setCommentText(savedComments[selectedPrompt.id])
    }
  }

  // 코멘트 수정 취소
  const handleCommentCancel = () => {
    if (isCommentEditing) {
      if (commentView === 'quality') {
        // 품질 평가 탭에서 취소
        if (selectedPrompt && savedQualityEvaluations[selectedPrompt.id]) {
          // 저장된 품질 평가가 있으면 원래 내용으로 복원하고 편집 모드 종료
          setCommentText(savedQualityEvaluations[selectedPrompt.id])
        } else {
          // 저장된 품질 평가가 없으면 빈 상태로 만들기
          setCommentText('')
        }
        setIsCommentEditing(false)
      } else {
        // 코멘트 탭에서 취소 (기존 로직)
        if (savedComments[selectedPrompt?.id]) {
          setCommentText(savedComments[selectedPrompt.id])
          setIsCommentEditing(false)
        } else {
          setCommentText('')
          setIsCommentEditing(true)
        }
      }
    } else {
      setCommentText('')
    }
  }

  // 임시 저장 처리
  const handleTemporarySave = () => {
    // 🔒 읽기 전용 모드이거나 이미 제출 완료된 과제는 저장 차단
    const taskStatus = localStorage.getItem(`taskProgress_${taskId}`)
    const submissionData = localStorage.getItem(`submission_${taskId}`)
    
    if (isReadOnlyMode || taskStatus === '제출 완료' || submissionData) {
      console.log('🔒 제출 완료된 과제 - 임시 저장 차단')
      return
    }
    
    const saveData = {
      prompts,
      originalText,
      baselineTranslation,
      savedComments,
      savedQualityEvaluations,
      bestPromptId,
      taskId,
      stepOrder
    }
    localStorage.setItem(`promptReview_${taskId}`, JSON.stringify(saveData))
    
    if (prompts.length > 0) {
      localStorage.setItem(`taskProgress_${taskId}`, '진행중')
    }
    
    alert('임시 저장이 완료되었습니다.')
  }

  // 이전 페이지로 이동
  const handlePrevious = () => {
    const updatedData = {
      prompts: prompts.map(prompt => ({
        ...prompt,
        isLiked: prompt.isLiked,
        comment: savedComments[prompt.id] || null
      })),
      originalText,
      baselineTranslation,
      savedComments,
      savedQualityEvaluations,
      savedQualityScores, // 품질 점수 포함
      bestPromptId, // Best 프롬프트 ID 포함
      totalPromptCount,
      taskId,
      stepOrder
    }
    
    // promptReview 키에 저장 (데이터 통합)
    localStorage.setItem(`promptReview_${taskId}`, JSON.stringify(updatedData))
    
    // promptInput 키에도 동일한 데이터 저장 (데이터 동기화)
    localStorage.setItem(`promptInput_${taskId}`, JSON.stringify(updatedData))
    
    if (prompts.length > 0) {
      localStorage.setItem(`taskProgress_${taskId}`, '진행중')
    }
    

    
    navigate(-1)
  }

  // n8n 웹훅으로 데이터 전송
  const sendToWebhook = async (data) => {
    const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://dev.n8n.voithrucorp.com/webhook/736cf47e-dab7-4411-b631-bfdff40e6de9'
    
    console.log('🚀 웹훅 전송 시작:', WEBHOOK_URL)
    console.log('📦 전송 데이터 크기:', JSON.stringify(data).length, '자')
    
    try {
      // 웹훅으로 데이터 전송
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      console.log('📨 웹훅 응답 상태:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ 웹훅 오류 내용:', errorText)
        throw new Error(`웹훅 전송 실패: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const result = await response.json()
      console.log('✅ 웹훅 전송 성공:', result)
      return { success: true, data: result }
      
    } catch (error) {
      console.error('❌ 웹훅 전송 오류:', error)
      return { success: false, error: error.message }
    }
  }

  // 최종 제출 처리
  const handleNext = async (skipConfirm = false, backupSubmissionData = null, backupTaskData = null) => {
    console.log('🎯 최종 제출 버튼 클릭!')
    
    // 🛡️ 1단계: 제출 중 상태 체크 (클라이언트 측 방지)
    if (isSubmitting) {
      console.log('⚠️ 이미 제출 중입니다. 중복 제출을 차단합니다.')
      alert('이미 제출 중입니다. 잠시만 기다려주세요.')
      return
    }
    
    // 🛡️ 2단계: 로컬스토리지 중복 체크
    const submissionKey = `submitted_${user?.email || 'unknown'}_${taskId}`
    if (localStorage.getItem(submissionKey) && !skipConfirm) {
      console.log('⚠️ 이미 제출된 과제입니다. 중복 제출을 차단합니다.')
      alert('이미 제출된 과제입니다.')
      return
    }
    
    // 백업 데이터 복원이 아닌 경우에만 제출 확인
    if (!skipConfirm && !window.confirm('최종 제출하시겠습니까? 제출 후에는 수정할 수 없습니다.')) {
      console.log('❌ 사용자가 제출 취소')
      return
    }
    
    console.log('✅ 사용자가 제출 확인')
    
    // 🛡️ 제출 중 상태 활성화
    setIsSubmitting(true)
    
    // 로딩 상태 표시
    const submitButton = document.querySelector('[data-submit-button]')
    if (submitButton) {
      submitButton.disabled = true
      submitButton.textContent = '제출 중...'
    }
    
    try {
      // 🔍 제출 직전 최신 데이터 재로드

      const latestData = localStorage.getItem(`promptReview_${taskId}`)
      let parsedData = null
      if (latestData) {
        parsedData = JSON.parse(latestData)




        
        // 최신 데이터로 업데이트
        if (parsedData.savedQualityEvaluations) {
          Object.assign(savedQualityEvaluations, parsedData.savedQualityEvaluations)
          setSavedQualityEvaluations(prev => ({...prev, ...parsedData.savedQualityEvaluations}))
        }
        if (parsedData.savedQualityScores) {
          Object.assign(savedQualityScores, parsedData.savedQualityScores)
          setSavedQualityScores(prev => ({...prev, ...parsedData.savedQualityScores}))
        }
        if (parsedData.bestPromptId) {
          setBestPromptId(parsedData.bestPromptId)
        }
      }
      
      // 제출 데이터 정리 (최신 데이터 직접 사용)
      const currentBestPromptId = parsedData?.bestPromptId || bestPromptId
      const currentQualityEvaluations = parsedData?.savedQualityEvaluations || savedQualityEvaluations
      const currentQualityScores = parsedData?.savedQualityScores || savedQualityScores
      
      // 데이터 검증
      console.log('🔍 데이터 검증 시작')
      console.log('currentBestPromptId:', currentBestPromptId)
      console.log('likedPrompts 개수:', likedPrompts.length)
      
      if (!currentBestPromptId) {
        console.error('❌ Best 프롬프트 ID 없음')
        alert('⚠️ Best 프롬프트를 선택해주세요.')
        return
      }
      
      const bestPrompt = likedPrompts.find(p => p.id === currentBestPromptId)
      console.log('bestPrompt 찾기 결과:', bestPrompt ? 'Found' : 'Not Found')
      
      if (!bestPrompt) {
        console.error('❌ Best 프롬프트를 찾을 수 없음')
        alert('⚠️ Best 프롬프트를 찾을 수 없습니다. 다시 선택해주세요.')
        return
      }
      
      // 필수 데이터 검증
      if (likedPrompts.length === 0) {
        console.error('❌ 좋아요 프롬프트 없음')
        alert('⚠️ 좋아요로 표시된 프롬프트가 없습니다.')
        return
      }
      
      console.log('✅ 데이터 검증 통과!')
      
      const bestEvaluation = currentQualityEvaluations[currentBestPromptId] || ''
      const bestScore = currentQualityScores[currentBestPromptId] || null
      
      console.log('bestEvaluation 길이:', bestEvaluation.length)
      console.log('bestScore:', bestScore)
      
      if (!bestEvaluation || bestEvaluation.trim().length < 20) {
        const confirmed = window.confirm('⚠️ Best 프롬프트의 품질 평가가 작성되지 않았거나 너무 짧습니다.\n\n그대로 제출하시겠습니까?')
        if (!confirmed) return
      }
      
      // 제출 데이터 구성
      console.log('🛠️ 제출 데이터 구성 시작')
      const timestamp = Date.now()
      
      // Google Sheets 헤더 순서대로 정리된 데이터 구조
      const submissionData = {
        // 1. id: Google Sheets에서 자동 생성 (비워둔)
        // id: 비워두어 Google Sheets에서 자동 처리되도록 함,
        
        // 2. response_raw: 모든 제출 데이터를 하나의 JSON으로 묶은 파일
        response_raw: JSON.stringify({
          // 과제 기본 정보
          taskId: taskId,
          taskUuid: taskId,
          stepOrder: stepOrder,
          submittedAt: new Date().toISOString(),
          
          // 과제 상세 정보
          title: (() => {
            const sources = [
              title,
              taskData?.title,
              taskData?.seriesTitle,
              taskData?.series_title,
              location.state?.title,
              location.state?.seriesTitle,
              location.state?.series_title,
              parsedData?.title,
              parsedData?.seriesTitle,
              parsedData?.series_title
            ]
            return sources.find(t => t && t.trim() && t !== '제목없음') || '제목없음'
          })(),
          episode: (() => {
            const parsed = parseInt(episode)
            return !isNaN(parsed) ? parsed : 1  // 0도 유효한 값으로 처리
          })(),
          languagePair: languagePair || '',
          projectSeason: projectSeason || '',
          
          // 원문 및 기본 번역문
          originalText: originalText || '',
          baselineTranslation: baselineTranslation || '',
          
          // 기본 제공 프롬프트
          guidePrompt: taskData?.guidePrompt || '',
          
          // Best 프롬프트 상세 정보
          bestPromptId: currentBestPromptId,
          bestPromptText: bestPrompt?.text || '',
          bestPromptResult: bestPrompt?.result || '',
          bestComment: savedComments[currentBestPromptId] || '',
          bestQualityEvaluation: bestEvaluation || '',
          bestQualityScore: bestScore || 0,
          
          // 모든 좋아요 프롬프트 정보
          totalLikedPrompts: likedPrompts.length,
          totalPromptCount: parseInt(totalPromptCount) || 0,
          allLikedPrompts: likedPrompts.map(prompt => ({
            id: prompt.id,
            text: prompt.text || '',
            result: prompt.result || '',
            comment: savedComments[prompt.id] || '',
            qualityEvaluation: savedQualityEvaluations[prompt.id] || '',
            qualityScore: savedQualityScores[prompt.id] || null,
            isBest: prompt.id === currentBestPromptId,
            isLiked: true,
            timestamp: prompt.timestamp || new Date().toISOString()
          })),
          
          // 통계 정보
          statistics: {
            totalPromptsWithComments: Object.keys(savedComments).filter(id => savedComments[id]?.trim()).length,
            totalQualityEvaluations: Object.keys(savedQualityEvaluations).filter(id => savedQualityEvaluations[id]?.trim()).length,
            averageQualityScore: Object.values(savedQualityScores).length > 0 ? 
              (Object.values(savedQualityScores).reduce((sum, score) => sum + (score || 0), 0) / Object.values(savedQualityScores).length).toFixed(2) : 0
          },
          
          // 메타데이터
          metadata: {
            appVersion: '1.0.0',
            submissionMethod: 'web_interface',
            browserInfo: navigator.userAgent,
            timestamp: timestamp
          }
        }),
        
        // 3. series_title: 웹소설 제목 (여러 소스에서 확인)
        series_title: (() => {
          // 여러 소스에서 제목 찾기
          const sources = [
            title,
            taskData?.title,
            taskData?.seriesTitle,
            taskData?.series_title,
            location.state?.title,
            location.state?.seriesTitle,
            location.state?.series_title,
            // localStorage에서도 찾아보기
            parsedData?.title,
            parsedData?.seriesTitle,
            parsedData?.series_title
          ]
          
          const foundTitle = sources.find(t => t && t.trim() && t !== '제목없음' && t !== '제목 없음')

          
          return (foundTitle || '제목없음').substring(0, 100)
        })(),
        
        // 4. episode: 에피소드 숫자
        episode: (() => {
          const parsed = parseInt(episode)
          return !isNaN(parsed) ? parsed : 1  // 0도 유효한 값으로 처리
        })(),
        
        // 5. step: 스텝 숫자
        step: parseInt(stepOrder) || 1,
        
        // 6. source_language: 출발 언어
        source_language: (() => {
          const sources = [
            languagePair?.split(' → ')[0],
            taskData?.languagePair?.split(' → ')[0],
            location.state?.languagePair?.split(' → ')[0]
          ]
          const found = sources.find(s => s && s.trim() && s !== 'unknown')
          return found || 'unknown'
        })(),
        
        // 7. target_language: 도착 언어
        target_language: (() => {
          const sources = [
            languagePair?.split(' → ')[1],
            taskData?.languagePair?.split(' → ')[1],
            location.state?.languagePair?.split(' → ')[1]
          ]
          const found = sources.find(s => s && s.trim() && s !== 'unknown')
          return found || 'unknown'
        })(),
        
        // 8. base_prompt: 기본 제공 프롬프트
        base_prompt: (() => {
          // 🎯 1단계: localStorage에서 캐시된 텍스트 확인
          const cachedGuidePrompt = localStorage.getItem(`cached_guide_${taskId}`)
          const cachedBasecampPrompt = localStorage.getItem(`cached_basecamp_${taskId}`)
          
          // 2단계: 캐시된 베이스캠프 프롬프트가 있는 경우
          if (cachedBasecampPrompt && cachedBasecampPrompt.trim() !== '') {
            console.log('✅ 캐시된 베이스캠프 프롬프트 사용')
            return cachedBasecampPrompt
          }
          // 3단계: 캐시된 가이드 프롬프트가 있는 경우
          else if (cachedGuidePrompt && cachedGuidePrompt.trim() !== '') {
            console.log('✅ 캐시된 가이드 프롬프트 사용')
            return cachedGuidePrompt
          }
          // 4단계: taskDetail에서 베이스캠프 프롬프트 텍스트 확인
          else if (taskDetail?.basecampPromptText && taskDetail.basecampPromptText.trim() !== '') {
            console.log('✅ taskDetail의 베이스캠프 프롬프트 텍스트 사용')
            return taskDetail.basecampPromptText
          }
          // 5단계: taskDetail에서 가이드 프롬프트 텍스트 확인
          else if (taskDetail?.guidePromptText && taskDetail.guidePromptText.trim() !== '') {
            console.log('✅ taskDetail의 가이드 프롬프트 텍스트 사용')
            return taskDetail.guidePromptText
          }
          // 6단계: 프롬프트 데이터가 없는 경우
          else {
            console.log('❌ 프롬프트 데이터 없음')
            console.log('🔍 디버깅 정보:', {
              taskDetailExists: !!taskDetail,
              hasGuidePromptText: !!taskDetail?.guidePromptText,
              hasBasecampPromptText: !!taskDetail?.basecampPromptText,
              cachedGuideExists: !!cachedGuidePrompt,
              cachedBasecampExists: !!cachedBasecampPrompt
            })
            return '프롬프트 데이터 없음'
          }
        })(),
        
        // 9. user_name: 사용자 이메일
        user_name: (() => {
          const userEmail = user?.email || localStorage.getItem('current_user_email')
          const userName = user?.name || localStorage.getItem('current_user_name')
          return userEmail || userName || 'unknown_user'
        })(),
        
        // 10. submit_prompt: Best 프롬프트 내용
        submit_prompt: bestPrompt?.text || '프롬프트 내용 없음',
        
        // 11. score: Best 결과물 평가 점수
        score: parseInt(bestScore) || 0,
        
        // 12. comments: Best 결과물 코멘트와 평가문 (구분하여 표시)
        comments: (() => {
          const comment = savedComments[currentBestPromptId] || ''
          const evaluation = bestEvaluation || ''
          
          // 두 정보를 명확히 구분하여 표시
          let result = ''
          
          if (comment.trim()) {
            result += `코멘트:\n${comment.trim()}`
          }
          
          if (evaluation.trim()) {
            if (result) result += '\n\n' // 코멘트가 있으면 두 줄 간격
            result += `Best 결과물 품질 평가:\n${evaluation.trim()}`
          }
          
          // 아무 정보도 없는 경우
          if (!result) {
            result = '(코멘트 및 품질 평가 없음)'
          }
          
          return result
        })(),
        
        // 13. create_date_time: 과제 제출 일시
        create_date_time: new Date().toLocaleString('ko-KR'),
        
        // 14. experiment_count: 프롬프트 입력 회수
        experiment_count: parseInt(totalPromptCount) || parseInt(taskData?.totalPromptCount) || parseInt(location.state?.totalPromptCount) || parseInt(parsedData?.totalPromptCount) || prompts?.length || 0,
        
        // 15. task_uuid: 과제 고유 식별자 (UUID)
        task_uuid: taskId,
        
        // n8n 라우팅용 필드
        sheet_type: 'submission'
      }
      
      console.log('📦 제출 데이터 구성 완료')
      console.log('데이터 크기:', JSON.stringify(submissionData).length, '자')
      console.log('📊 전송되는 데이터 구조:')
      console.log('- id: 비워둠 (Google Sheets 자동 생성)')
      console.log('- series_title:', submissionData.series_title)
      console.log('- episode:', submissionData.episode)
      console.log('- step:', submissionData.step)
      console.log('- source_language:', submissionData.source_language)
      console.log('- target_language:', submissionData.target_language)
      console.log('- base_prompt:', submissionData.base_prompt?.substring(0, 50) + '...')
      console.log('- user_name:', submissionData.user_name)
      console.log('- submit_prompt:', submissionData.submit_prompt?.substring(0, 50) + '...')
      console.log('- score:', submissionData.score)
      console.log('- comments (개선된 형식):', submissionData.comments?.substring(0, 100) + '...')
      console.log('- create_date_time:', submissionData.create_date_time)
      console.log('- experiment_count:', submissionData.experiment_count)
      console.log('- task_uuid:', submissionData.task_uuid)
      
      // JSON 파일 업로드 및 다운로드 제거됨
      
      // n8n 웹훅으로 데이터 전송
      console.log('🚀 웹훅 전송 준비 완료, sendToWebhook 호출 시작')
      const webhookResult = await sendToWebhook(submissionData)
      
      if (webhookResult.success) {
        // 🛡️ 제출 성공 시 중복 체크 기록 저장
        localStorage.setItem(submissionKey, JSON.stringify({
          submittedAt: new Date().toISOString(),
          taskId,
          userEmail: user?.email || 'unknown'
        }))
        
        // 웹훅 전송 성공
        // 로컬 스토리지에 제출 데이터 저장 (복원용 완전한 데이터)
        const submissionForStorage = {
          // 기본 과제 정보
          taskId,
          stepOrder,
          submittedAt: new Date().toISOString(),
          
          // 프롬프트 데이터 (복원용)
          prompts: likedPrompts || [],
          
          // 원문 및 기본 번역문
          originalText: originalText || '',
          baselineTranslation: baselineTranslation || '',
          
          // 코멘트 및 평가 데이터
          savedComments: savedComments || {},
          savedQualityEvaluations: savedQualityEvaluations || {},
          savedQualityScores: savedQualityScores || {},
          bestPromptId: currentBestPromptId || null,
          totalPromptCount: parseInt(totalPromptCount) || 0,
          
          // 웹훅 전송 데이터 (참고용)
          webhookData: submissionData
        }
        
        localStorage.setItem(`submission_${taskId}`, JSON.stringify(submissionForStorage))
        
        // 작업 상태를 '제출 완료'로 업데이트
        localStorage.setItem(`taskProgress_${taskId}`, '제출 완료')
        
        // 임시 데이터는 제출 후에도 보관 (읽기 전용 모드에서 필요)
        
        alert('✅ 제출이 완료되었습니다!\n결과물 데이터가 전송되었습니다.')
        
        // 나의 과제 페이지로 이동
        navigate('/my-tasks')
        
      } else {
        // 웹훅 전송 실패 처리
        // 사용자에게 오류 알림 및 선택 제공
        const retryChoice = window.confirm(
          `❌ 서버 전송에 실패했습니다.\n\n오류: ${webhookResult.error}\n\n[확인]: 다시 시도\n[취소]: 로컬에만 저장하고 나중에 재시도`
        )
        
        if (retryChoice) {
          // 다시 시도
          return handleNext()
        } else {
          // 로컬에만 저장 (복원용 완전한 데이터)
          const submissionForStorage = {
            // 기본 과제 정보
            taskId,
            stepOrder,
            submittedAt: new Date().toISOString(),
            
            // 프롬프트 데이터 (복원용)
            prompts: likedPrompts || [],
            
            // 원문 및 기본 번역문
            originalText: originalText || '',
            baselineTranslation: baselineTranslation || '',
            
            // 코멘트 및 평가 데이터
            savedComments: savedComments || {},
            savedQualityEvaluations: savedQualityEvaluations || {},
            savedQualityScores: savedQualityScores || {},
            bestPromptId: currentBestPromptId || null,
            totalPromptCount: parseInt(totalPromptCount) || 0,
            
            // 웹훅 전송 데이터 (참고용)
            webhookData: submissionData
          }
          
          localStorage.setItem(`submission_${taskId}`, JSON.stringify(submissionForStorage))
          localStorage.setItem(`taskProgress_${taskId}`, '제출 대기') // 재시도 가능 상태
          
          alert('⚠️ 로컬에 저장되었습니다.\n나중에 다시 제출해주세요.')
          navigate('/my-tasks')
        }
      }
      
    } catch (error) {

      // 🎯 사용자 친화적인 에러 메시지 생성
      let userFriendlyMessage = ''
      if (error.message.includes('네트워크') || error.message.includes('연결')) {
        userFriendlyMessage = '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인 후 다시 시도해주세요.'
      } else if (error.message.includes('서버') || error.message.includes('500')) {
        userFriendlyMessage = '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
      } else if (error.message.includes('권한') || error.message.includes('403')) {
        userFriendlyMessage = '제출 권한이 없습니다. 관리자에게 문의해주세요.'
      } else {
        userFriendlyMessage = '제출 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
      }
      
      alert(`⚠️ ${userFriendlyMessage}`)
      
    } finally {
      // 🛡️ 제출 중 상태 해제 (성공/실패 관계없이)
      setIsSubmitting(false)
      
      // 로딩 상태 해제
      const submitButton = document.querySelector('[data-submit-button]')
      if (submitButton) {
        submitButton.disabled = false
        submitButton.textContent = '최종 제출'
      }
    }
  }

  // 사이드바 네비게이션을 위한 전역 함수 노출
  useEffect(() => {
    window.saveCurrentWork = async () => {
      console.log('🔄 사이드바 네비게이션 - 제출 미리보기 페이지에서 작업 저장 시작')
      handleTemporarySave()
      return Promise.resolve()
    }

    return () => {
      // 컴포넌트 언마운트 시 전역 함수 제거
      delete window.saveCurrentWork
    }
  }, [prompts, originalText, baselineTranslation, savedComments, savedQualityEvaluations, bestPromptId, isReadOnlyMode])

  // 품질 평가 상태 확인 (Best 선택된 프롬프트만)
  const getQualityEvaluationStatus = (promptId) => {
    // Best로 선택되지 않은 프롬프트는 상태 표시 안함
    if (bestPromptId !== promptId) {
      return null
    }
    
    // Best로 선택된 프롬프트의 품질 평가 작성 여부 확인 (품질 평가만 확인)
    const qualityEvaluation = savedQualityEvaluations[promptId]
    if (qualityEvaluation && qualityEvaluation.trim().length >= 20) {
      return { status: 'completed', text: 'Best결과물 품질 평가 완료' }
    }
    return { status: 'incomplete', text: 'Best결과물 품질 평가 미완료' }
  }

  return (
    <AppLayout currentPage="제출 미리보기" variant="withoutHeader">
      <div className={styles.container}>
        {/* 메인 콘텐츠 영역 */}
        <div className={styles.mainContent}>
          {/* 왼쪽 영역 - 프롬프트 목록 */}
          <div className={styles.leftSection}>
            <div style={{ marginBottom: '24px' }}>
              <h2 className={styles.sectionTitle}>
                제출 미리보기
              </h2>
            </div>

            {/* 프롬프트 목록 */}
            <div className={styles.promptList}>
              {/* Best 프롬프트를 항상 최상위에 고정 */}
              {displayPrompts
                .sort((a, b) => {
                  if (a.id === bestPromptId) return -1;
                  if (b.id === bestPromptId) return 1;
                  return 0;
                })
                .map((prompt, index) => {
                const qualityStatus = getQualityEvaluationStatus(prompt.id)
                return (
                  <div
                    key={prompt.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedPrompt(prompt)}
                    className={`${styles.promptItem} ${selectedPrompt?.id === prompt.id ? styles.selected : ''}`}
                  >
                    {/* 프롬프트 컨테이너 내부 레이아웃 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      width: '100%'
                    }}>
                      {/* 프롬프트 내용들 */}
                      <div style={{
                        flex: 1,
                        minWidth: 0
                      }}>
                        {/* 프롬프트 버전과 상태 */}
                        <div className={styles.promptHeader}>
                          <div style={{
                            backgroundColor: prompt.isLiked === true 
                              ? designTokens.colors.primary || '#3b82f6'
                              : designTokens.colors.primary || '#8b5cf6',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: designTokens.typography.fontSize.xs || '12px',
                            fontWeight: designTokens.typography.fontWeight.medium || '500'
                          }}>
                            {prompt.version || `V${prompt.id}`}
                          </div>
                          
                          {bestPromptId !== null && bestPromptId === prompt.id && (
                            <div style={{
                              fontSize: '20px',
                              color: '#f59e0b'
                            }}>
                              👑
                            </div>
                          )}
                        </div>

                        {/* 평가문/코멘트 미리보기 */}
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{
                            fontSize: '11px',
                            color: '#9ca3af',
                            fontWeight: '500',
                            marginBottom: '4px'
                          }}>
                            {prompt.id === bestPromptId ? '평가문' : '코멘트'}
                          </div>
                          <div style={{
                            fontSize: '13px',
                            lineHeight: '1.4',
                            color: '#374151',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {prompt.id === bestPromptId && savedQualityEvaluations[prompt.id] 
                              ? savedQualityEvaluations[prompt.id]
                              : savedComments[prompt.id] || (prompt.id === bestPromptId ? '평가문을 작성해주세요.' : '코멘트를 작성해주세요.')}
                          </div>
                        </div>





                        {/* 타임스탬프 */}
                        <div className={styles.timestamp}>
                          {(() => {
                            try {
                              const dateObj = prompt.timestamp instanceof Date ? prompt.timestamp : new Date(prompt.timestamp)
                              if (isNaN(dateObj.getTime())) {
                                return '2025. 1.15 16:20'
                              }
                              return `${dateObj.toLocaleDateString('ko-KR', {
                                month: 'long',
                                day: 'numeric'
                              })} ${dateObj.toLocaleTimeString('ko-KR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}`
                            } catch (error) {
                              return '2025. 1.15 16:20'
                            }
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 오른쪽 영역 - 번역문 및 코멘트 */}
          <div className={styles.rightSection}>
            {/* 과제 정보 라벨과 브레드크럼 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              padding: '0 16px'
            }}>
              {/* 과제 정보 라벨들 */}
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'nowrap',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '8px 16px',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  borderRadius: '9999px',
                  fontSize: '14px',
                  fontWeight: '500',
                  flexShrink: 0
                }}>
                  {projectSeason || '과제 시즌 1'}
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
                  {title || '과제 제목'} - EP {episode || '01'}
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
                  {languagePair || '한국어 → 일본어'}
                </div>
              </div>
              
              {/* 브레드크럼 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#64748b'
              }}>
                <span style={{ color: '#64748b' }}>나의 과제</span>
                <span style={{ color: '#cbd5e1' }}>/</span>
                <span style={{ color: '#64748b' }}>프롬프트 입력</span>
                <span style={{ color: '#cbd5e1' }}>/</span>
                <span style={{ color: '#1e293b', fontWeight: '600' }}>제출 미리보기</span>
              </div>
            </div>
            
            {/* 선택된 프롬프트 상세 내용 */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '16px',
              padding: '16px',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              marginBottom: '24px',
              height: '850px',
              overflow: 'auto'
            }}>
              {!selectedPrompt ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#6b7280',
                  fontSize: '16px'
                }}>
                  프롬프트를 선택하여 상세 내용을 확인하세요.
                </div>
              ) : (
                <>
                  {/* Best 프롬프트인 경우 평가문 표시 */}
                  {selectedPrompt.id === bestPromptId && savedQualityEvaluations[selectedPrompt.id] && (
                    <div style={{
                      padding: '16px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span>Best 번역문 평가</span>
                        <span style={{ fontSize: '16px' }}>👑</span>
                      </div>
                      <div style={{
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#6b7280',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        marginBottom: '12px'
                      }}>
                        {savedQualityEvaluations[selectedPrompt.id]}
                      </div>
                      
                      {/* 품질 점수 표시 */}
                      {savedQualityScores[selectedPrompt.id] && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#374151'
                          }}>
                            품질 점수:
                          </span>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#1f2937'
                          }}>
                            {savedQualityScores[selectedPrompt.id]}점
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 코멘트 표시 */}
                  {savedComments[selectedPrompt.id] && (
                    <div style={{
                      padding: '16px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '12px'
                      }}>
                        코멘트
                      </div>
                      <div style={{
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#6b7280',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word'
                      }}>
                        {savedComments[selectedPrompt.id]}
                      </div>
                    </div>
                  )}

                  {/* 작성한 프롬프트 내용 */}
                  <div style={{
                    padding: '16px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '12px'
                    }}>
                      프롬프트
                    </div>
                    <div style={{
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: '#6b7280',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }}>
                      {selectedPrompt.text || '프롬프트 내용이 여기에 표시됩니다.'}
                    </div>
                  </div>

                  {/* 번역 결과물 */}
                  <div style={{
                    padding: '16px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '12px'
                    }}>
                      번역 결과물
                    </div>
                    <div style={{
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: '#6b7280',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }}>
                      {selectedPrompt.result || '번역 결과가 여기에 표시됩니다.'}
                    </div>
                  </div>
                </>
              )}
            </div>


          </div>
        </div>
        
        {/* 하단 고정 액션 버튼들 */}
        <BottomActionBar
          leftButtons={[
            { text: '이전', variant: 'secondary', size: 'md', onClick: handlePrevious }
          ]}
          rightButton={{
            text: isReadOnlyMode ? '나가기' : (isSubmitting ? '제출 중...' : '최종 제출'),
            variant: isReadOnlyMode ? 'secondary' : 'blue',
            size: 'medium',
            style: 'solid',
            onClick: isReadOnlyMode ? (() => navigate('/my-tasks')) : handleNext,
            disabled: isSubmitting, // 제출 중일 때 버튼 비활성화
            'data-submit-button': !isReadOnlyMode, // 제출 모드일 때만 로딩 상태 제어
            rightIcon: isReadOnlyMode ? (
              // 나가기 아이콘
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            ) : (
              // 제출 아이콘
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )
          }}
        />
      </div>
    </AppLayout>
  )
}

export default SubmissionPreviewPage