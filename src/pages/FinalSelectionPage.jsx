import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDesignSystemContext } from '../components/common/DesignSystemProvider'
import { AutoStyledButton, AutoStyledInput, AutoStyledCard } from '../components/common/AutoStyledComponent'
import Button from '../components/common/Button'
import PromptBubble from '../components/common/PromptBubble'
import AppLayout from '../components/layout/AppLayout'
import BottomActionBar from '../components/common/BottomActionBar'
import styles from '../styles/pages/FinalSelectionPage.module.css'

const FinalSelectionPage = () => {
  const { designTokens } = useDesignSystemContext()
  const location = useLocation()
  const navigate = useNavigate()
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
  const [qualityScore, setQualityScore] = useState(null) // 현재 선택된 품질 점수
  const [totalPromptCount, setTotalPromptCount] = useState(0) // 총 프롬프트 입력 회수
  const [translationView, setTranslationView] = useState('original') // 'original' or 'baseline'
  const [bestPromptId, setBestPromptId] = useState(null)
  const [commentView, setCommentView] = useState('quality') // 'quality' or 'saved'
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false) // 제출 완료된 과제의 읽기 전용 모드


  // 과제 정보 (실제 데이터 사용)
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
    
    // 🔒 제출 완료 상태 확인 (읽기 전용 모드 설정)
    const checkReadOnlyMode = () => {
      const currentStatus = localStorage.getItem(`taskProgress_${taskIdToUse}`)
      const isCompleted = currentStatus === '제출 완료'
      setIsReadOnlyMode(isCompleted)
      
      if (isCompleted) {
        console.log('🔒 제출 완료된 과제 - 제출 대상 항목 페이지 읽기 전용 모드 활성화')
      }
      
      return isCompleted
    }
    
    checkReadOnlyMode()

    let finalData = {}
    
    // 1. location.state가 있으면 먼저 로드 (기본 데이터)
    if (location.state) {
      console.log('📥 location.state에서 기본 데이터 로드')
      const { 
        prompts: savedPrompts, 
        originalText: savedOriginalText, 
        baselineTranslation: savedBaselineTranslation,
        savedComments: existingComments,
        savedQualityEvaluations: existingQualityEvaluations,
        savedQualityScores: existingQualityScores,
        bestPromptId: savedBestPromptId,
        totalPromptCount: savedTotalPromptCount,
        taskId: savedTaskId,
        stepOrder: savedStepOrder
      } = location.state
      
      if (savedTaskId) {
        taskIdToUse = savedTaskId
      }
      
      finalData = {
        prompts: savedPrompts,
        originalText: savedOriginalText,
        baselineTranslation: savedBaselineTranslation,
        savedComments: existingComments,
        savedQualityEvaluations: existingQualityEvaluations,
        savedQualityScores: existingQualityScores,
        bestPromptId: savedBestPromptId,
        totalPromptCount: savedTotalPromptCount
      }
    }
    
    // 2. 로컬 스토리지에서 최신 데이터 확인 (최우선)
    if (taskIdToUse) {
      const savedData = localStorage.getItem(`promptReview_${taskIdToUse}`)
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          console.log('🔄 로컬 스토리지에서 최신 데이터 복원 중... taskId:', taskIdToUse)
          
          // 로컬 스토리지 데이터가 있으면 덮어쓰기 (최우선)
          if (parsedData.prompts) finalData.prompts = parsedData.prompts
          if (parsedData.originalText) finalData.originalText = parsedData.originalText
          if (parsedData.baselineTranslation) finalData.baselineTranslation = parsedData.baselineTranslation
          if (parsedData.savedComments) finalData.savedComments = parsedData.savedComments
          if (parsedData.savedQualityEvaluations) finalData.savedQualityEvaluations = parsedData.savedQualityEvaluations
          if (parsedData.savedQualityScores) finalData.savedQualityScores = parsedData.savedQualityScores
          if (parsedData.bestPromptId) finalData.bestPromptId = parsedData.bestPromptId
          if (parsedData.totalPromptCount) finalData.totalPromptCount = parsedData.totalPromptCount
          
          console.log('✅ 로컬 스토리지 데이터 우선 적용 완료')
        } catch (error) {
          console.error('로컬 스토리지 데이터 파싱 실패:', error)
        }
      }
    }
    
    // 3. 최종 데이터 적용
    if (finalData.prompts) setPrompts(finalData.prompts)
    if (finalData.originalText) setOriginalText(finalData.originalText)
    if (finalData.baselineTranslation) setBaselineTranslation(finalData.baselineTranslation)
    // 조건 없이 항상 데이터 처리 (코멘트처럼 안전하게)
    setSavedComments(finalData.savedComments || {})
    console.log('💬 복원된 코멘트 데이터:', Object.keys(finalData.savedComments || {}).length, '개')
    
    setSavedQualityEvaluations(finalData.savedQualityEvaluations || {})
    console.log('📝 복원된 품질 평가 데이터:', Object.keys(finalData.savedQualityEvaluations || {}).length, '개')
    
    setSavedQualityScores(finalData.savedQualityScores || {})
    console.log('⭐ 복원된 품질 점수 데이터:', Object.keys(finalData.savedQualityScores || {}).length, '개')
    
    setBestPromptId(finalData.bestPromptId || null)
    console.log('👑 복원된 Best 프롬프트 ID:', finalData.bestPromptId || null)
    if (finalData.totalPromptCount) {
      console.log('🔢 복원된 총 프롬프트 입력 회수:', finalData.totalPromptCount)
      setTotalPromptCount(finalData.totalPromptCount)
    }
  }, [location.state, taskId])

  // 제출 대상 항목은 좋아요 프롬프트만 표시
  const likedPrompts = prompts.filter(prompt => prompt.isLiked === true)
  const displayPrompts = likedPrompts

  // Best 프롬프트 선택 처리
  const handleBestPromptSelect = (promptId) => {
    // 🔒 읽기 전용 모드에서는 변경 차단
    if (isReadOnlyMode) {
      alert('🔒 제출 완료된 과제는 수정할 수 없습니다.')
      return
    }
    
    console.log('Best 프롬프트 선택:', promptId)
    setBestPromptId(promptId)
    
    // Best 프롬프트 선택 후 즉시 로컬 스토리지에 저장
    const saveData = {
      prompts,
      originalText,
      baselineTranslation,
      savedComments,
      savedQualityEvaluations,
      savedQualityScores,
      bestPromptId: promptId,
      totalPromptCount,
      taskId,
      stepOrder
    }
    localStorage.setItem(`promptReview_${taskId}`, JSON.stringify(saveData))
    console.log('Best 프롬프트 선택 후 로컬 스토리지 저장 완료')
  }

  // 프롬프트 선택 처리
  const handlePromptSelect = (prompt) => {
    setSelectedPrompt(prompt)
    setCommentView('quality') // 항상 품질 평가 작성이 기본
    
    // 품질 평가 작성 탭에서 기존 품질 평가 불러오기
    if (savedQualityEvaluations[prompt.id]) {
      console.log(`프롬프트 ${prompt.id} 품질 평가 불러오기:`, savedQualityEvaluations[prompt.id])
      setCommentText(savedQualityEvaluations[prompt.id])
      setIsCommentEditing(false) // 저장된 내용이 있으면 읽기 모드
      } else {
        setCommentText('')
      setIsCommentEditing(true) // 저장된 내용이 없으면 편집 모드
      }
    
    // 품질 점수도 불러오기
    if (savedQualityScores[prompt.id]) {
      console.log(`프롬프트 ${prompt.id} 품질 점수 불러오기:`, savedQualityScores[prompt.id])
      setQualityScore(savedQualityScores[prompt.id])
    } else {
      setQualityScore(null)
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
      savedQualityScores,
      bestPromptId,
      totalPromptCount,
      taskId,
      stepOrder
    }
    localStorage.setItem(`promptReview_${taskId}`, JSON.stringify(saveData))
  }

  // 코멘트/품질 평가 저장 처리
  const handleCommentSave = () => {
    // 🔒 읽기 전용 모드에서는 저장 차단
    if (isReadOnlyMode) {
      alert('🔒 제출 완료된 과제는 수정할 수 없습니다.')
      return
    }
    
    if (selectedPrompt && commentText.trim().length >= 20 && qualityScore !== null) {
      if (commentView === 'quality') {
        // 품질 평가 작성 탭에서 저장 (평가문 + 점수)
        const newSavedQualityEvaluations = {
          ...savedQualityEvaluations,
          [selectedPrompt.id]: commentText.trim()
        }
        
        const newSavedQualityScores = {
          ...savedQualityScores,
          [selectedPrompt.id]: qualityScore
        }
        
        console.log('품질 평가 저장:', selectedPrompt.id, commentText.trim(), '점수:', qualityScore)
        setSavedQualityEvaluations(newSavedQualityEvaluations)
        setSavedQualityScores(newSavedQualityScores)
        setIsCommentEditing(false)
        
        // 로컬 스토리지에 즉시 저장
        const saveData = {
          prompts,
          originalText,
          baselineTranslation,
          savedComments,
          savedQualityEvaluations: newSavedQualityEvaluations,
          savedQualityScores: newSavedQualityScores,
          bestPromptId,
          totalPromptCount,
          taskId,
          stepOrder
        }
        localStorage.setItem(`promptReview_${taskId}`, JSON.stringify(saveData))
        console.log('💾 품질 평가 저장 후 전체 데이터 로컬 스토리지 저장 완료:', {
          bestPromptId,
          qualityEvaluations: Object.keys(newSavedQualityEvaluations).length,
          qualityScores: Object.keys(newSavedQualityScores).length,
          comments: Object.keys(savedComments).length
        })
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
          savedQualityScores,
          bestPromptId,
          totalPromptCount,
        taskId,
        stepOrder
      }
      localStorage.setItem(`promptReview_${taskId}`, JSON.stringify(saveData))
        console.log('💾 코멘트 저장 후 전체 데이터 로컬 스토리지 저장 완료:', {
          bestPromptId,
          qualityEvaluations: Object.keys(savedQualityEvaluations).length,
          qualityScores: Object.keys(savedQualityScores).length,
          comments: Object.keys(newSavedComments).length
        })
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
          setQualityScore(savedQualityScores[selectedPrompt.id] || null)
        } else {
          // 저장된 품질 평가가 없으면 빈 상태로 만들기
          setCommentText('')
          setQualityScore(null)
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
    const saveData = {
      prompts,
      originalText,
      baselineTranslation,
      savedComments,
      savedQualityEvaluations,
      savedQualityScores,
      bestPromptId,
      totalPromptCount,
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
    // 현재 상태를 완전히 저장 (모든 데이터 보존)
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
      savedQualityScores,
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
    
    console.log('💾 제출 대상 항목 페이지 상태 저장 완료 (promptReview & promptInput):', {
      comments: Object.keys(savedComments).length,
      qualityEvaluations: Object.keys(savedQualityEvaluations).length,
      qualityScores: Object.keys(savedQualityScores).length,
      bestPromptId
    })
    
    navigate(-1)
  }

  // 제출 미리보기로 이동
  const handleNext = () => {
    console.log('🚀 제출 미리보기 버튼 클릭됨')
    console.log('현재 상태:', {
      bestPromptId,
      likedPromptsCount: likedPrompts.length,
      savedComments: Object.keys(savedComments).length,
      savedQualityEvaluations: Object.keys(savedQualityEvaluations).length
    })
    
    // Best 프롬프트가 선택되었는지 확인
    if (!bestPromptId) {
      console.log('❌ Best 프롬프트가 선택되지 않음')
      alert('최고 결과물을 하나 선택해주세요.')
      return
    }
    console.log('✅ Best 프롬프트 선택됨:', bestPromptId)
    
    // 모든 좋아요 프롬프트에 코멘트가 작성되었는지 확인
    const hasAllComments = likedPrompts.every(prompt => 
      savedComments[prompt.id] && savedComments[prompt.id].trim().length >= 20
    )
    
    console.log('코멘트 상태 확인:')
    likedPrompts.forEach(prompt => {
      const comment = savedComments[prompt.id]
      console.log(`- 프롬프트 ${prompt.id}: ${comment ? `${comment.length}글자` : '없음'}`)
    })
    
    if (!hasAllComments) {
      console.log('❌ 모든 프롬프트에 코멘트가 작성되지 않음')
      alert('모든 좋아요 프롬프트에 대해 코멘트를 작성해주세요.')
      return
    }
    console.log('✅ 모든 프롬프트에 코멘트 작성 완료')
    
    // Best 프롬프트에 품질 평가가 작성되었는지 확인
    const qualityEvaluation = savedQualityEvaluations[bestPromptId]
    const qualityScore = savedQualityScores[bestPromptId]
    console.log(`Best 프롬프트(${bestPromptId}) 품질 평가:`, qualityEvaluation ? `${qualityEvaluation.length}글자` : '없음')
    console.log(`Best 프롬프트(${bestPromptId}) 품질 점수:`, qualityScore || '없음')
    
    if (!qualityEvaluation || qualityEvaluation.trim().length < 20) {
      console.log('❌ Best 결과물 품질 평가가 작성되지 않음')
      alert('Best 결과물에 대한 품질 평가를 작성해주세요.')
      return
    }
    
    if (!qualityScore) {
      console.log('❌ Best 결과물 품질 점수가 선택되지 않음')
      alert('Best 결과물에 대한 품질 점수를 선택해주세요.')
      return
    }
    
    console.log('✅ Best 결과물 품질 평가 및 점수 선택 완료')
    
    console.log('🎯 모든 검증 통과! 제출 미리보기 페이지로 이동 중...')
    
    // 제출 미리보기 페이지로 이동
    navigate('/submission-preview', {
      state: {
        prompts,
        originalText,
        baselineTranslation,
        savedComments,
        savedQualityEvaluations,
        savedQualityScores,
        bestPromptId,
        totalPromptCount,
        taskId,
        stepOrder,
        // 🎯 과제 기본 정보 추가
        title,
        episode,
        languagePair,
        projectSeason,
        // 🔍 추가 디버깅 정보
        taskDataKeys: Object.keys(taskData || {}),
        locationStateKeys: Object.keys(location.state || {}),
        ...taskData // 전체 taskData도 함께 전달
      }
    })
    
    console.log('✅ navigate 함수 호출 완료')
  }

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
    <AppLayout currentPage="제출 대상 항목" variant="withoutHeader">
      <div className={styles.container}>
        {/* 메인 콘텐츠 영역 */}
        <div className={styles.mainContent}>
          {/* 왼쪽 영역 - 프롬프트 목록 */}
          <div className={styles.leftSection}>
            <div style={{ marginBottom: '24px' }}>
              <h2 className={styles.sectionTitle}>
                제출 대상 항목
              </h2>
            </div>

            {/* 프롬프트 목록 */}
            <div className={styles.promptList}>
              {displayPrompts.map((prompt, index) => {
                const qualityStatus = getQualityEvaluationStatus(prompt.id)
                return (
                  <div
                    key={prompt.id}
                    onClick={() => handlePromptSelect(prompt)}
                    className={`${styles.promptItem} ${selectedPrompt?.id === prompt.id ? styles.selected : ''}`}
                  >
                    {/* 프롬프트 컨테이너 내부 레이아웃 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      width: '100%'
                    }}>
                      {/* 왼쪽: 라디오 버튼과 왕관 아이콘 */}
                      <div 
                        style={{
                          flexShrink: 0,
                          marginTop: '4px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer'
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!isReadOnlyMode) {
                            handleBestPromptSelect(prompt.id)
                          }
                        }}
                      >
                        <div style={{
                          position: 'relative',
                          display: 'inline-block'
                        }}>
                          <input
                            type="radio"
                            id={`best-${prompt.id}`}
                            name="bestPrompt"
                            value={prompt.id}
                            checked={bestPromptId === prompt.id}
                            onChange={(e) => {
                              e.stopPropagation()
                              const selectedId = isNaN(e.target.value) ? e.target.value : parseInt(e.target.value)
                              handleBestPromptSelect(selectedId)
                            }}
                            style={{
                              width: '18px',
                              height: '18px',
                              cursor: 'pointer',
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                              border: `2px solid ${bestPromptId === prompt.id ? designTokens.colors.primary || '#3b82f6' : designTokens.colors.border.light || '#d1d5db'}`,
                              borderRadius: '50%',
                              backgroundColor: bestPromptId === prompt.id ? designTokens.colors.primary || '#3b82f6' : 'white',
                              transition: 'all 0.2s ease'
                            }}
                          />
                          {/* 선택된 상태일 때 내부 원 표시 */}
                          {bestPromptId === prompt.id && (
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: '8px',
                              height: '8px',
                              backgroundColor: 'white',
                              borderRadius: '50%',
                              pointerEvents: 'none'
                            }} />
                          )}
                        </div>
                        
                        {/* 선택된 상태일 때만 왕관 아이콘 표시 */}
                        <div style={{
                          width: '20px',
                          height: '20px',
                          marginTop: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {bestPromptId !== null && bestPromptId === prompt.id && (
                            <div style={{
                              fontSize: '16px',
                              color: '#f59e0b'
                            }}>
                              👑
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 오른쪽: 프롬프트 내용들 */}
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
                      
                          {qualityStatus && (
                            <div className={`${styles.commentStatus} ${qualityStatus.status === 'completed' ? styles.completed : styles.incomplete}`}>
                              {qualityStatus.text}
                        </div>
                      )}
                    </div>

                        {/* 코멘트 미리보기 */}
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{
                            fontSize: '11px',
                            color: '#9ca3af',
                            fontWeight: '500',
                            marginBottom: '4px'
                          }}>
                            코멘트
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
                            {savedComments[prompt.id] || '코멘트를 작성해주세요.'}
                          </div>
                    </div>

                        {/* 번역문 미리보기 */}
                        <div>
                          <div style={{
                            fontSize: '11px',
                            color: '#9ca3af',
                            fontWeight: '500',
                            marginBottom: '4px'
                          }}>
                            번역문
                          </div>
                          <div style={{
                            fontSize: '13px',
                            lineHeight: '1.4',
                            color: '#374151',
                            display: '-webkit-box',
                            WebkitLineClamp: 5,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {prompt.result || '번역문이 여기에 표시됩니다.'}
                          </div>
                        </div>

                        {/* 좋아요/싫어요 버튼 */}
                    <div style={{
                      display: 'flex',
                      backgroundColor: designTokens.colors.background.secondary || '#f3f4f6',
                      borderRadius: designTokens.borders.radius.md || '8px',
                      border: `1px solid ${designTokens.colors.border.light}`,
                      overflow: 'hidden',
                          width: 'fit-content',
                          marginTop: '24px'
                        }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLikeDislikeChange(prompt.id, true)
                        }}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: prompt.isLiked === true ? designTokens.colors.success || '#22c55e' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                              color: prompt.isLiked === true ? 'white' : designTokens.colors.text.muted || '#6b7280'
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill={prompt.isLiked === true ? 'white' : 'none'} stroke={prompt.isLiked === true ? 'white' : 'currentColor'} strokeWidth="2">
                          <path d="M14 9V5a3 3 0 0 0-6 0v4H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2z" />
                          <path d="M9 12l2 2 4-4" />
                        </svg>
                      </button>

                      <div style={{
                        width: '1px',
                        backgroundColor: designTokens.colors.border.light,
                        margin: '4px 0'
                      }} />

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLikeDislikeChange(prompt.id, false)
                        }}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: prompt.isLiked === false ? designTokens.colors.error || '#ef4444' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                              color: prompt.isLiked === false ? 'white' : designTokens.colors.text.muted || '#6b7280'
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill={prompt.isLiked === false ? 'white' : 'none'} stroke={prompt.isLiked === false ? 'white' : 'currentColor'} strokeWidth="2">
                          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                        </svg>
                      </button>
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
                <span style={{ color: '#1e293b', fontWeight: '600' }}>제출 대상 항목</span>
              </div>
            </div>
            
            {/* 첫 번째 콘텐츠 영역: 기본 번역문, 원문, 프롬프트 결과 번역문을 가로로 배치 */}
            <div style={{ 
              display: 'flex', 
              gap: '16px',
              minWidth: 0,
              padding: '16px',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              marginBottom: '24px',
              flex: '1 1 auto', // 남는 공간을 채우도록 설정
              minHeight: '350px', // 최소 높이 유지
              maxHeight: 'calc(100vh - 200px)' // 최대 높이를 화면에 맞춰 fill
            }}>
              {/* 기본 번역문과 원문을 토글 버튼 그룹으로 */}
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                gap: '16px',
                minWidth: 0,
                height: '100%'
              }}>
                {/* 토글 버튼 그룹 */}
                <div style={{
                  display: 'flex',
                  backgroundColor: designTokens.colors.background.secondary,
                  borderRadius: designTokens.borders.radius.md,
                  padding: '4px',
                  border: `1px solid ${designTokens.colors.border.light}`,
                  flexShrink: 0
                }}>
              <button
                onClick={() => setTranslationView('original')}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  backgroundColor: translationView === 'original' 
                    ? designTokens.colors.background.primary 
                    : 'transparent',
                  color: translationView === 'original' 
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
                onClick={() => setTranslationView('baseline')}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  backgroundColor: translationView === 'baseline' 
                    ? designTokens.colors.background.primary 
                    : 'transparent',
                  color: translationView === 'baseline' 
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
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  overflow: 'auto',
                  minHeight: 0
                }}>
                  {translationView === 'baseline' ? (
                    <div style={{
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: 'var(--text-muted)',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word'
                    }}>
                      {baselineTranslation || '기본 번역문이 여기에 표시됩니다.'}
                    </div>
                  ) : (
                    <div style={{
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: 'var(--text-muted)',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word'
                    }}>
                      {originalText || '원문이 여기에 표시됩니다.'}
                    </div>
                  )}
                </div>
              </div>

              {/* 중앙 패널: 프롬프트 결과 번역문 */}
              <div style={{ 
                flex: 1,
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px',
                minWidth: 0,
                height: '100%'
              }}>
                {/* 프롬프트 결과 번역문 헤더 */}
                <div style={{
                  display: 'flex',
                  backgroundColor: designTokens.colors.background.primary,
                  borderRadius: designTokens.borders.radius.md,
                  padding: '16px 24px',
                  border: `1px solid ${designTokens.colors.border.light}`,
                  flexShrink: 0,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{
                    fontSize: designTokens.typography.fontSize.sm,
                    fontWeight: designTokens.typography.fontWeight.medium,
                    color: designTokens.colors.text.primary
                  }}>
                    프롬프트 결과 번역문
                  </span>
                </div>
                <div style={{ 
                  flex: 1,
                  padding: '16px',
                  backgroundColor: 'white',
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  overflow: 'auto',
                  minHeight: 0
                }}>
                  <div style={{
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: 'var(--text-muted)',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word'
                  }}>
                    {selectedPrompt?.result || '프롬프트를 선택하면 번역 결과가 여기에 표시됩니다.'}
                  </div>
                </div>
              </div>
            </div>

            {/* 번역문 품질 평가 영역 */}
            <div className={styles.commentSection}>
              {!selectedPrompt ? (
                <div>
                  {/* 토글 버튼 그룹 - 비활성화 상태 */}
                  <div style={{
                    display: 'flex',
                    backgroundColor: designTokens.colors.background.secondary,
                    borderRadius: designTokens.borders.radius.md,
                    padding: '4px',
                    border: `1px solid ${designTokens.colors.border.light}`,
                    marginBottom: '16px',
                    opacity: 0.5
                  }}>
                    <button
                      disabled
                      style={{
                        flex: 1,
                        padding: '12px 24px',
                        backgroundColor: designTokens.colors.background.primary,
                        color: designTokens.colors.text.primary,
                        border: 'none',
                        borderRadius: designTokens.borders.radius.sm,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium,
                        cursor: 'not-allowed'
                      }}
                    >
                      Best결과물 품질 평가
                    </button>
                    <button
                      disabled
                      style={{
                        flex: 1,
                        padding: '12px 24px',
                        backgroundColor: 'transparent',
                        color: designTokens.colors.text.muted,
                        border: 'none',
                        borderRadius: designTokens.borders.radius.sm,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium,
                        cursor: 'not-allowed'
                      }}
                    >
                      코멘트
                    </button>
                    </div>

                  {/* 플레이스홀더 영역 */}
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      textAlign: 'center',
                      color: designTokens.colors.text.muted
                    }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '500',
                        marginBottom: '8px'
                      }}>
                        프롬프트를 선택해주세요
                      </div>
                      <div style={{
                        fontSize: '14px'
                      }}>
                        왼쪽의 프롬프트를 선택하여 품질 평가를 작성해 주세요.
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {/* 토글 버튼 그룹 */}
                  <div style={{
                    display: 'flex',
                    backgroundColor: designTokens.colors.background.secondary,
                    borderRadius: designTokens.borders.radius.md,
                    padding: '4px',
                    border: `1px solid ${designTokens.colors.border.light}`,
                    marginBottom: '16px'
                  }}>
                    <button
                      onClick={() => {
                        // 코멘트 편집 중일 때는 탭 전환 막기
                        if (commentView === 'saved' && isCommentEditing) {
                          alert('코멘트 작성을 완료하고 저장한 후 품질 평가 탭으로 이동할 수 있습니다.')
                          return
                        }
                        
                        setCommentView('quality')
                        // 품질 평가 작성 탭으로 전환할 때 기존 품질 평가 불러오기
                        if (selectedPrompt && savedQualityEvaluations[selectedPrompt.id]) {
                          console.log('품질 평가 탭 클릭 - 기존 데이터 로드:', savedQualityEvaluations[selectedPrompt.id])
                          setCommentText(savedQualityEvaluations[selectedPrompt.id])
                          setQualityScore(savedQualityScores[selectedPrompt.id] || null)
                          setIsCommentEditing(false) // 저장된 내용이 있으면 읽기 모드
                        } else {
                          setCommentText('')
                          setQualityScore(null)
                          setIsCommentEditing(true) // 저장된 내용이 없으면 편집 모드
                        }
                      }}
                      disabled={commentView === 'saved' && isCommentEditing} // 코멘트 편집 중일 때 비활성화
                      style={{
                        flex: 1,
                        padding: '12px 24px',
                        backgroundColor: commentView === 'quality' 
                          ? designTokens.colors.background.primary 
                          : 'transparent',
                        color: (commentView === 'saved' && isCommentEditing)
                          ? designTokens.colors.text.muted // 비활성화 시 흐린 색상
                          : commentView === 'quality' 
                            ? designTokens.colors.text.primary 
                            : designTokens.colors.text.muted,
                        border: 'none',
                        borderRadius: designTokens.borders.radius.sm,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium,
                        cursor: (commentView === 'saved' && isCommentEditing)
                          ? 'not-allowed' // 비활성화 시 커서 변경
                          : 'pointer',
                        transition: 'all 0.2s ease',
                        opacity: (commentView === 'saved' && isCommentEditing) ? 0.5 : 1 // 비활성화 시 투명도 조정
                      }}
                    >
                      Best결과물 품질 평가
                    </button>
                    <button
                      onClick={() => {
                        // 품질 평가 편집 중일 때는 탭 전환 막기
                        if (commentView === 'quality' && isCommentEditing) {
                          alert('품질 평가 작성을 완료하고 저장한 후 코멘트 탭으로 이동할 수 있습니다.')
                          return
                        }
                        
                        setCommentView('saved')
                        // 코멘트 탭으로 전환할 때만 저장된 코멘트를 불러옴
                        if (selectedPrompt && savedComments[selectedPrompt.id]) {
                          setCommentText(savedComments[selectedPrompt.id])
                          setIsCommentEditing(false)
                        }
                      }}
                      disabled={commentView === 'quality' && isCommentEditing} // 품질 평가 편집 중일 때 비활성화
                      style={{
                        flex: 1,
                        padding: '12px 24px',
                        backgroundColor: commentView === 'saved' 
                          ? designTokens.colors.background.primary 
                          : 'transparent',
                        color: (commentView === 'quality' && isCommentEditing) 
                          ? designTokens.colors.text.muted // 비활성화 시 흐린 색상
                          : commentView === 'saved' 
                            ? designTokens.colors.text.primary 
                            : designTokens.colors.text.muted,
                        border: 'none',
                        borderRadius: designTokens.borders.radius.sm,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium,
                        cursor: (commentView === 'quality' && isCommentEditing) 
                          ? 'not-allowed' // 비활성화 시 커서 변경
                          : 'pointer',
                        transition: 'all 0.2s ease',
                        opacity: (commentView === 'quality' && isCommentEditing) ? 0.5 : 1 // 비활성화 시 투명도 조정
                      }}
                    >
                      코멘트
                    </button>
                  </div>

                  {commentView === 'quality' ? (
                    /* 결과물 품질 평가 작성 */
                    <div>
                  <div style={{
                    padding: '16px',
                    backgroundColor: 'white',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                        height: '180px',
                    position: 'relative'
                  }}>
                    <textarea
                      className="text-input-common"
                      placeholder={
                            isReadOnlyMode
                              ? "🔒 제출 완료된 과제는 수정할 수 없습니다."
                              : bestPromptId !== selectedPrompt?.id
                                ? "결과물 품질 평가를 작성하시려면 먼저 가장 번역이 잘 된 Best 결과물 1개를 선택해 주세요."
                                : selectedPrompt.isLiked === false 
                                  ? "싫어요 평가를 받은 결과물에 대해서는 평가를 작성할 수 없습니다."
                                  : (!isCommentEditing && savedQualityEvaluations[selectedPrompt?.id])
                                    ? "💾 저장된 평가입니다. 수정하려면 '평가 수정' 버튼을 클릭하세요."
                                    : "선택한 프롬프트의 번역문에 대한 평가를 작성해 주세요."
                      }
                      value={commentText}
                      onChange={(e) => {
                        // 편집 모드가 아니고 이미 저장된 평가가 있으면 입력 차단
                        if (!isReadOnlyMode && (isCommentEditing || !savedQualityEvaluations[selectedPrompt?.id])) {
                          setCommentText(e.target.value)
                        }
                      }}
                      disabled={
                        bestPromptId !== selectedPrompt?.id || 
                        selectedPrompt.isLiked === false || 
                        (!isCommentEditing && savedQualityEvaluations[selectedPrompt?.id]) || // 편집 모드가 아니고 저장된 평가가 있으면 비활성화
                        isReadOnlyMode
                      }
                      style={{
                        width: '100%',
                        height: '100%',
                        fontSize: '14px',
                            padding: '0px',
                                                    backgroundColor: (bestPromptId !== selectedPrompt?.id || selectedPrompt.isLiked === false || (!isCommentEditing && savedQualityEvaluations[selectedPrompt?.id]) || isReadOnlyMode) ? '#f8f9fa' : 'white',
                            color: (bestPromptId !== selectedPrompt?.id || selectedPrompt.isLiked === false || (!isCommentEditing && savedQualityEvaluations[selectedPrompt?.id]) || isReadOnlyMode) ? '#6b7280' : '#111827',
                            cursor: (bestPromptId !== selectedPrompt?.id || selectedPrompt.isLiked === false || (!isCommentEditing && savedQualityEvaluations[selectedPrompt?.id]) || isReadOnlyMode) ? 'not-allowed' : 'text',
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                            fontFamily: 'inherit',
                            lineHeight: '1.5'
                      }}
                    />
                  </div>
                  
                      {/* 번역문 품질 점수 선택 */}
                  <div style={{
                        marginTop: '16px',
                        padding: '16px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        border: '1px solid var(--border-light)'
                      }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '12px'
                        }}>
                          번역문 품질
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: '16px',
                          alignItems: 'center'
                        }}>
                          {[5, 4, 3, 2, 1].map((score) => (
                            <label
                              key={score}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                cursor: (bestPromptId !== selectedPrompt?.id || selectedPrompt.isLiked === false || (!isCommentEditing && savedQualityEvaluations[selectedPrompt?.id]) || isReadOnlyMode) ? 'not-allowed' : 'pointer',
                                opacity: (bestPromptId !== selectedPrompt?.id || selectedPrompt.isLiked === false || (!isCommentEditing && savedQualityEvaluations[selectedPrompt?.id]) || isReadOnlyMode) ? 0.5 : 1
                              }}
                            >
                              <input
                                type="radio"
                                name="qualityScore"
                                value={score}
                                checked={qualityScore === score}
                                onChange={() => !isReadOnlyMode && setQualityScore(score)}
                                disabled={bestPromptId !== selectedPrompt?.id || selectedPrompt.isLiked === false || (!isCommentEditing && savedQualityEvaluations[selectedPrompt?.id]) || isReadOnlyMode}
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  cursor: 'inherit'
                                }}
                              />
                              <span style={{
                                fontSize: '14px',
                                color: '#374151',
                                fontWeight: '500'
                              }}>
                                {score}점
                                {score === 5 ? ' (매우 좋음)' : 
                                 score === 4 ? ' (좋음)' : 
                                 score === 3 ? ' (보통)' : 
                                 score === 2 ? ' (나쁨)' : 
                                 ' (매우 나쁨)'}
                              </span>
                            </label>
                          ))}
                                                </div>
                  </div>
                  
                      {/* 액션 버튼들 */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '16px'
                      }}>
                        {selectedPrompt.isLiked !== false && bestPromptId === selectedPrompt?.id && (
                          <>
                            {/* 평가 수정 버튼 - 항상 표시 */}
                            <div>
                              <div style={{
                                opacity: (!savedQualityEvaluations[selectedPrompt.id] || isCommentEditing) ? 0.5 : 1
                              }}>
                          <Button
                            variant="blue"
                            size="small"
                            style="solid"
                                  onClick={() => setIsCommentEditing(true)}
                                  disabled={!savedQualityEvaluations[selectedPrompt.id] || isCommentEditing}
                          >
                                  평가 수정
                          </Button>
                        </div>
                            </div>

                            {/* 취소/저장 버튼 항상 표시 */}
                            <div style={{ display: 'flex', gap: '12px' }}>
                              <div style={{
                                opacity: (!isCommentEditing || commentText.trim().length < 20 || qualityScore === null) ? 0.5 : 1
                              }}>
                          <Button
                            variant="secondary"
                            size="small"
                            style="solid"
                            onClick={handleCommentCancel}
                                  disabled={!isCommentEditing || commentText.trim().length < 20 || qualityScore === null}
                          >
                            취소
                          </Button>
                              </div>
                              <div style={{
                                opacity: (!isCommentEditing || commentText.trim().length < 20 || qualityScore === null) ? 0.5 : 1
                              }}>
                          <Button
                            variant="blue"
                            size="small"
                            style="solid"
                            onClick={handleCommentSave}
                                  disabled={!isCommentEditing || commentText.trim().length < 20 || qualityScore === null}
                          >
                            저장
                          </Button>
                              </div>
                        </div>
                      </>
                    )}
                  </div>
                    </div>
                  ) : (
                    /* 기존 코멘트 보기 */
                    <div>
                      <div style={{
                        padding: '16px',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid var(--border-light)',
                        borderRadius: '8px',
                        height: '300px',
                        overflow: 'auto'
                      }}>
                        <div style={{
                          fontSize: '14px',
                          lineHeight: '1.6',
                          color: 'var(--text-primary)',
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word'
                        }}>
                          {savedComments[selectedPrompt.id] || '저장된 코멘트가 없습니다.'}
                        </div>
                      </div>
                      

                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 하단 고정 액션 버튼들 */}
        <BottomActionBar
          leftButtons={[
            { text: '이전', variant: 'secondary', size: 'md', onClick: handlePrevious },
            // 🔒 제출 완료된 과제에서는 임시 저장 버튼 숨김
            ...(isReadOnlyMode ? [] : [{ text: '임시 저장', variant: 'secondary', size: 'md', onClick: handleTemporarySave }])
          ]}
          rightButton={{
            text: '제출 미리보기',
            variant: 'blue',
            size: 'medium',
            style: 'solid',
            onClick: handleNext,
            rightIcon: (
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

export default FinalSelectionPage