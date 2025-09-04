import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDesignSystemContext } from '../components/common/DesignSystemProvider'
import { AutoStyledButton, AutoStyledInput, AutoStyledCard } from '../components/common/AutoStyledComponent'
import Button from '../components/common/Button'
import PromptBubble from '../components/common/PromptBubble'
import AppLayout from '../components/layout/AppLayout'
import BottomActionBar from '../components/common/BottomActionBar'
import styles from '../styles/pages/PromptReviewPage.module.css'

const PromptReviewPage = () => {
  const { designTokens } = useDesignSystemContext()
  const location = useLocation()
  const navigate = useNavigate()
  const taskData = location.state || {}
  
  // 상태 관리
  const [activeTab, setActiveTab] = useState('liked') // 'liked' or 'all'
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [prompts, setPrompts] = useState([])
  const [originalText, setOriginalText] = useState('')
  const [baselineTranslation, setBaselineTranslation] = useState('')
  const [commentText, setCommentText] = useState('')
  const [isCommentEditing, setIsCommentEditing] = useState(false)
  const [savedComments, setSavedComments] = useState({})
  const [translationView, setTranslationView] = useState('original') // 'original' or 'baseline'
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
    // 🔒 제출 완료 상태 확인 (읽기 전용 모드 설정)
    const checkReadOnlyMode = () => {
      const currentStatus = localStorage.getItem(`taskProgress_${taskId}`)
      const isCompleted = currentStatus === '제출 완료'
      setIsReadOnlyMode(isCompleted)
      
      if (isCompleted) {
        console.log('🔒 제출 완료된 과제 - 프롬프트 검토 페이지 읽기 전용 모드 활성화')
      }
      
      return isCompleted
    }
    
    checkReadOnlyMode()
    
    let finalData = {}
    
    // 1. location.state가 있으면 먼저 로드 (기본 데이터)
    if (location.state) {
      const { 
        prompts: savedPrompts, 
        originalText: savedOriginalText, 
        baselineTranslation: savedBaselineTranslation,
        savedComments: existingComments 
      } = location.state
      
      finalData = {
        prompts: savedPrompts,
        originalText: savedOriginalText,
        baselineTranslation: savedBaselineTranslation,
        savedComments: existingComments
      }
      console.log('📥 location.state에서 기본 데이터 로드')
    }
    
    // 2. 로컬 스토리지에서 최신 데이터 확인 (최우선)
    if (taskId) {
      const savedData = localStorage.getItem(`promptReview_${taskId}`)
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          console.log('🔄 로컬 스토리지에서 최신 데이터 복원 중...')
          
          // 로컬 스토리지 데이터가 있으면 덮어쓰기 (최우선)
          if (parsedData.prompts) finalData.prompts = parsedData.prompts
          if (parsedData.originalText) finalData.originalText = parsedData.originalText
          if (parsedData.baselineTranslation) finalData.baselineTranslation = parsedData.baselineTranslation
          if (parsedData.savedComments) finalData.savedComments = parsedData.savedComments
          
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
    if (finalData.savedComments) {
      console.log('💬 복원된 코멘트 데이터:', Object.keys(finalData.savedComments).length, '개')
      setSavedComments(finalData.savedComments)
    }
  }, [location.state, taskId])

  // 좋아요 프롬프트만 필터링
  const likedPrompts = prompts.filter(prompt => prompt.isLiked === true)
  const allPrompts = prompts

  // 현재 표시할 프롬프트 목록
  const displayPrompts = activeTab === 'liked' ? likedPrompts : allPrompts

  // 프롬프트 선택 처리
  const handlePromptSelect = (prompt) => {
    setSelectedPrompt(prompt)
    
    if (prompt.isLiked === true) {
      // 좋아요 프롬프트인 경우
      if (savedComments[prompt.id]) {
        // 이미 저장된 코멘트가 있으면 수정 모드가 아닌 상태로 설정
        setCommentText(savedComments[prompt.id])
        setIsCommentEditing(false)
      } else {
        // 저장된 코멘트가 없으면 새로운 코멘트 작성 모드로 설정
        setCommentText('')
        setIsCommentEditing(true) // 처음 작성할 때는 수정 모드로 시작
      }
    } else {
      // 싫어요 프롬프트인 경우
      setCommentText('')
      setIsCommentEditing(false)
    }
  }

  // 좋아요/싫어요 상태 변경 처리
  const handleLikeDislikeChange = (promptId, newIsLiked) => {
    // 🔒 읽기 전용 모드에서는 변경 차단
    if (isReadOnlyMode) {
      alert('🔒 제출 완료된 과제는 수정할 수 없습니다.')
      return
    }
    
    const updatedPrompts = prompts.map(prompt => {
      if (prompt.id === promptId) {
        const updatedPrompt = { ...prompt, isLiked: newIsLiked }
        
        // 좋아요로 변경 시 좋아요 프롬프트 탭으로 이동
        if (newIsLiked && activeTab === 'all') {
          setActiveTab('liked')
        }
        
        // 싫어요로 변경 시 코멘트 삭제 확인
        if (!newIsLiked && savedComments[promptId]) {
          if (window.confirm('이미 작성한 코멘트가 있습니다. 싫어요로 변경하면 코멘트가 삭제됩니다. 계속하시겠습니까?')) {
            const newSavedComments = { ...savedComments }
            delete newSavedComments[promptId]
            setSavedComments(newSavedComments)
          } else {
            return prompt // 변경 취소
          }
        }
        
        return updatedPrompt
      }
      return prompt
    })
    
    setPrompts(updatedPrompts)
    
    // 🔑 기존 제출 대상 항목 데이터 보존하면서 상태 변경 후 즉시 로컬 스토리지에 저장
    let existingFinalSelectionData = {}
    const existingReviewData = localStorage.getItem(`promptReview_${taskId}`)
    if (existingReviewData) {
      try {
        const parsedData = JSON.parse(existingReviewData)
        existingFinalSelectionData = {
          savedQualityEvaluations: parsedData.savedQualityEvaluations || {},
          savedQualityScores: parsedData.savedQualityScores || {},
          bestPromptId: parsedData.bestPromptId || null
        }
      } catch (error) {
        console.error('기존 데이터 파싱 실패:', error)
      }
    }
    
    const saveData = {
      prompts: updatedPrompts,
      originalText,
      baselineTranslation,
      savedComments: newIsLiked ? savedComments : { ...savedComments, [promptId]: undefined },
      totalPromptCount: prompts.length, // 프롬프트 입력 회수 포함
      // 🔑 Best 데이터 보존 (코멘트처럼 안전하게)
      savedQualityEvaluations: existingFinalSelectionData.savedQualityEvaluations || {},
      savedQualityScores: existingFinalSelectionData.savedQualityScores || {},
      bestPromptId: existingFinalSelectionData.bestPromptId || null,
      taskId,
      stepOrder
    }
    localStorage.setItem(`promptReview_${taskId}`, JSON.stringify(saveData))
    console.log('💾 좋아요/싫어요 상태 변경 후 저장 완료 (Best 데이터 보존)')
  }

  // 코멘트 저장 처리
  const handleCommentSave = () => {
    // 🔒 읽기 전용 모드에서는 저장 차단
    if (isReadOnlyMode) {
      alert('🔒 제출 완료된 과제는 수정할 수 없습니다.')
      return
    }
    
    if (selectedPrompt && commentText.trim().length >= 20) {
      const newSavedComments = {
        ...savedComments,
        [selectedPrompt.id]: commentText.trim()
      }
      
      // 상태 업데이트
      setSavedComments(newSavedComments)
      setIsCommentEditing(false)
      
      // 🔑 기존 제출 대상 항목 데이터 보존하면서 코멘트 즉시 저장
      let existingFinalSelectionData = {}
      const existingReviewData = localStorage.getItem(`promptReview_${taskId}`)
      if (existingReviewData) {
        try {
          const parsedData = JSON.parse(existingReviewData)
          existingFinalSelectionData = {
            savedQualityEvaluations: parsedData.savedQualityEvaluations || {},
            savedQualityScores: parsedData.savedQualityScores || {},
            bestPromptId: parsedData.bestPromptId || null
          }
        } catch (error) {
          console.error('기존 데이터 파싱 실패:', error)
        }
      }
      
      // 로컬 스토리지에 즉시 저장 (코멘트 데이터 유지)
      const saveData = {
        prompts,
        originalText,
        baselineTranslation,
        savedComments: newSavedComments, // 업데이트된 코멘트
        totalPromptCount: prompts.length, // 프롬프트 입력 회수 포함
        // 🔑 Best 데이터 보존 (코멘트처럼 안전하게)
        savedQualityEvaluations: existingFinalSelectionData.savedQualityEvaluations || {},
        savedQualityScores: existingFinalSelectionData.savedQualityScores || {},
        bestPromptId: existingFinalSelectionData.bestPromptId || null,
        taskId,
        stepOrder
      }
      localStorage.setItem(`promptReview_${taskId}`, JSON.stringify(saveData))
      console.log('💾 코멘트 저장 완료 및 로컬 스토리지 업데이트 (Best 데이터 보존):', selectedPrompt.id)
    }
  }

  // 코멘트 수정 모드 활성화
  const handleCommentEdit = () => {
    setIsCommentEditing(true)
    // 현재 저장된 코멘트를 텍스트 박스에 표시
    if (selectedPrompt && savedComments[selectedPrompt.id]) {
      setCommentText(savedComments[selectedPrompt.id])
    }
  }

  // 코멘트 수정 취소
  const handleCommentCancel = () => {
    if (isCommentEditing) {
      if (savedComments[selectedPrompt?.id]) {
        // 수정 모드일 때는 저장된 코멘트로 되돌리기
        setCommentText(savedComments[selectedPrompt.id])
        setIsCommentEditing(false)
      } else {
        // 처음 작성 모드일 때는 텍스트 초기화하고 수정 모드 유지
        setCommentText('')
        setIsCommentEditing(true)
      }
    } else {
      // 일반 모드일 때는 코멘트 텍스트 초기화
      setCommentText('')
    }
  }

  // 임시 저장 처리
  const handleTemporarySave = () => {
    // 현재 상태를 로컬 스토리지에 저장
    const saveData = {
      prompts,
      originalText,
      baselineTranslation,
      savedComments,
      totalPromptCount: prompts.length, // 프롬프트 입력 회수 포함
      taskId,
      stepOrder
    }
    localStorage.setItem(`promptReview_${taskId}`, JSON.stringify(saveData))
    
    // 진행 상태를 '진행중'으로 업데이트
    if (prompts.length > 0) {
      localStorage.setItem(`taskProgress_${taskId}`, '진행중')
    }
    
    alert('임시 저장이 완료되었습니다.')
    console.log('💾 임시 저장 완료')
  }

  // 이전 페이지로 이동
  const handlePrevious = () => {
    // 현재 상태를 업데이트해서 로컬 스토리지에 저장 (코멘트, 좋아요/싫어요 상태 반영)
    const updatedData = {
      prompts: prompts.map(prompt => ({
        ...prompt,
        // 프롬프트 검토 페이지에서 변경된 상태 반영
        isLiked: prompt.isLiked,
        comment: savedComments[prompt.id] || null
      })),
      originalText,
      baselineTranslation,
      savedComments, // 코멘트 데이터 포함
      totalPromptCount: prompts.length, // 프롬프트 입력 회수 포함
      taskId,
      stepOrder
    }
    
    localStorage.setItem(`promptReview_${taskId}`, JSON.stringify(updatedData))
    
    // 진행 상태를 '진행중'으로 업데이트
    if (prompts.length > 0) {
      localStorage.setItem(`taskProgress_${taskId}`, '진행중')
    }
    
    console.log('💾 프롬프트 검토 페이지 상태 업데이트 후 저장 완료 (코멘트 포함)')
    
    // 이전 페이지로 이동
    navigate(-1)
  }

  // 다음 페이지로 이동 (최종안 선택 및 평가 작성)
  const handleNext = () => {
    // 모든 좋아요 프롬프트에 코멘트가 작성되었는지 확인
    const hasAllComments = likedPrompts.every(prompt => 
      savedComments[prompt.id] && savedComments[prompt.id].trim().length >= 20
    )
    
    if (!hasAllComments) {
      alert('모든 좋아요 프롬프트에 대해 코멘트를 작성해주세요.')
      return
    }
    
    // 기존 제출 대상 항목 데이터 보존
    let existingFinalSelectionData = {}
    const existingReviewData = localStorage.getItem(`promptReview_${taskId}`)
    if (existingReviewData) {
      try {
        const parsedData = JSON.parse(existingReviewData)
        existingFinalSelectionData = {
          savedQualityEvaluations: parsedData.savedQualityEvaluations || {},
          savedQualityScores: parsedData.savedQualityScores || {},
          bestPromptId: parsedData.bestPromptId || null
        }
        console.log('🔄 프롬프트 검토 페이지: 기존 제출 대상 항목 데이터 보존:', existingFinalSelectionData)
      } catch (error) {
        console.error('기존 제출 대상 항목 데이터 파싱 실패:', error)
      }
    }
    
    // 현재 상태를 로컬 스토리지에 저장 (기존 제출 대상 항목 데이터 보존)
    const saveData = {
      prompts,
      originalText,
      baselineTranslation,
      savedComments, // 코멘트 데이터 포함
      savedQualityEvaluations: existingFinalSelectionData.savedQualityEvaluations || {}, // 기존 데이터 보존
      savedQualityScores: existingFinalSelectionData.savedQualityScores || {}, // 기존 데이터 보존
      bestPromptId: existingFinalSelectionData.bestPromptId || null, // 기존 데이터 보존
      totalPromptCount: prompts.length, // 프롬프트 입력 회수 포함
      taskId,
      stepOrder
    }
    localStorage.setItem(`promptReview_${taskId}`, JSON.stringify(saveData))
    console.log('💾 다음 페이지 이동 전 코멘트 데이터 저장 완료 (제출 대상 항목 데이터 보존)')
    
    // 로컬 스토리지에서 최신 데이터를 다시 가져와서 전달 (데이터 동기화 보장)
    const latestData = localStorage.getItem(`promptReview_${taskId}`)
    let finalData = saveData
    
    if (latestData) {
      try {
        const parsedLatestData = JSON.parse(latestData)
        finalData = {
          ...parsedLatestData,
          taskId,
          stepOrder,
          ...taskData
        }
        console.log('🔄 로컬 스토리지에서 최신 데이터 가져와서 전달:', finalData)
      } catch (error) {
        console.error('최신 데이터 파싱 실패:', error)
      }
    }
    
    // 다음 페이지로 이동 (최신 데이터와 함께)
    navigate('/final-selection-page', {
      state: finalData
    })
  }

  // 코멘트 작성 완료 여부 확인
  const getCommentStatus = (promptId) => {
    const comment = savedComments[promptId]
    if (comment && comment.trim().length >= 20) {
      return { status: 'completed', text: '코멘트 작성 완료' }
    }
    return { status: 'incomplete', text: '코멘트 작성 미완료' }
  }

  return (
    <AppLayout currentPage="프롬프트 검토" variant="withoutHeader">
      <div className={styles.container}>

        {/* 메인 콘텐츠 영역 */}
        <div className={styles.mainContent}>
          {/* 왼쪽 영역 - 프롬프트 목록 */}
          <div className={styles.leftSection}>
            <div style={{ marginBottom: '24px' }}>
              <h2 className={styles.sectionTitle}>
                프롬프트 검토
              </h2>
              
              {/* 탭 버튼들 */}
              <div className={styles.tabs}>
                <button
                  onClick={() => setActiveTab('liked')}
                  className={`${styles.tab} ${activeTab === 'liked' ? styles.active : ''}`}
                >
                  좋아요 프롬프트
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
                >
                  전체 프롬프트
                </button>
              </div>
            </div>

            {/* 프롬프트 목록 */}
            <div className={styles.promptList}>
              {displayPrompts.map((prompt) => {
                const commentStatus = getCommentStatus(prompt.id)
                return (
                  <div
                    key={prompt.id}
                    onClick={() => handlePromptSelect(prompt)}
                    className={`${styles.promptItem} ${selectedPrompt?.id === prompt.id ? styles.selected : ''}`}
                  >
                    {/* 프롬프트 버전과 상태 */}
                    <div className={styles.promptHeader}>
                      {/* 버전 라벨 - PromptBubble과 동일한 스타일 */}
                      <div style={{
                        backgroundColor: prompt.isLiked === true 
                          ? designTokens.colors.primary || '#3b82f6'
                          : designTokens.colors.primary || '#8b5cf6',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: designTokens.typography.fontSize.xs || '12px',
                        fontWeight: designTokens.typography.fontWeight.medium || '500',
                        boxShadow: 'none'
                      }}>
                        {prompt.version || `V${prompt.id}`}
                      </div>
                      
                      {/* 평가 상태 */}
                      {activeTab === 'liked' && (
                        <div className={`${styles.commentStatus} ${commentStatus.status === 'completed' ? styles.completed : styles.incomplete}`}>
                          {commentStatus.text}
                        </div>
                      )}
                    </div>

                    {/* 프롬프트 내용 */}
                    <div className={styles.promptText}>
                      {prompt.text}
                    </div>

                    {/* 좋아요/싫어요 버튼 - PromptBubble에서 그대로 가져온 컴포넌트 */}
                    <div style={{
                      display: 'flex',
                      backgroundColor: designTokens.colors.background.secondary || '#f3f4f6',
                      borderRadius: designTokens.borders.radius.md || '8px',
                      border: `1px solid ${designTokens.colors.border.light}`,
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      zIndex: 10,
                      width: 'fit-content'
                    }}>
                      {/* 좋아요 버튼 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // 🔒 읽기 전용 모드에서는 즉시 차단
                          if (isReadOnlyMode) {
                            alert('🔒 제출 완료된 과제는 수정할 수 없습니다.')
                            return
                          }
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
                          transition: 'all 0.2s ease',
                          color: prompt.isLiked === true ? 'white' : designTokens.colors.text.muted || '#6b7280',
                          borderRadius: '0',
                          outline: 'none',
                          flex: '0 0 auto'
                        }}
                        onMouseEnter={(e) => {
                          // 싫어요가 선택된 상태가 아닐 때만 호버 효과 적용
                          if (prompt.isLiked !== true && prompt.isLiked !== false) {
                            e.target.style.backgroundColor = 'rgba(34, 197, 94, 0.2)'
                            e.target.style.color = designTokens.colors.success || '#22c55e'
                          }
                        }}
                        onMouseLeave={(e) => {
                          // 싫어요가 선택된 상태가 아닐 때만 원래 상태로 복원
                          if (prompt.isLiked !== true && prompt.isLiked !== false) {
                            e.target.style.backgroundColor = 'transparent'
                            e.target.style.color = designTokens.colors.text.muted || '#6b7280'
                          }
                        }}
                        onMouseDown={(e) => {
                          e.target.style.transform = 'scale(0.95)'
                        }}
                        onMouseUp={(e) => {
                          e.target.style.transform = 'scale(1)'
                        }}
                        onFocus={(e) => {
                          e.target.style.outline = `2px solid ${designTokens.colors.success || '#22c55e'}`
                          e.target.style.outlineOffset = '2px'
                        }}
                        onBlur={(e) => {
                          e.target.style.outline = 'none'
                        }}
                      >
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill={prompt.isLiked === true ? 'white' : 'none'} 
                          stroke={prompt.isLiked === true ? 'white' : 'currentColor'} 
                          strokeWidth="2"
                        >
                          <path d="M14 9V5a3 3 0 0 0-6 0v4H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2z" />
                          <path d="M9 12l2 2 4-4" />
                        </svg>
                      </button>

                      {/* 구분선 */}
                      <div style={{
                        width: '1px',
                        backgroundColor: designTokens.colors.border.light,
                        margin: '4px 0'
                      }} />

                      {/* 싫어요 버튼 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // 🔒 읽기 전용 모드에서는 즉시 차단
                          if (isReadOnlyMode) {
                            alert('🔒 제출 완료된 과제는 수정할 수 없습니다.')
                            return
                          }
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
                          transition: 'all 0.2s ease',
                          color: prompt.isLiked === false ? 'white' : designTokens.colors.text.muted || '#6b7280',
                          borderRadius: '0',
                          outline: 'none',
                          flex: '0 0 auto'
                        }}
                        onMouseEnter={(e) => {
                          // 좋아요가 선택된 상태가 아닐 때만 호버 효과 적용
                          if (prompt.isLiked !== false && prompt.isLiked !== true) {
                            e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'
                            e.target.style.color = designTokens.colors.error || '#ef4444'
                          }
                        }}
                        onMouseLeave={(e) => {
                          // 좋아요가 선택된 상태가 아닐 때만 원래 상태로 복원
                          if (prompt.isLiked !== false && prompt.isLiked !== true) {
                            e.target.style.backgroundColor = 'transparent'
                            e.target.style.color = designTokens.colors.text.muted || '#6b7280'
                          }
                        }}
                        onMouseDown={(e) => {
                          e.target.style.transform = 'scale(0.95)'
                        }}
                        onMouseUp={(e) => {
                          e.target.style.transform = 'scale(1)'
                        }}
                        onFocus={(e) => {
                          e.target.style.outline = `2px solid ${designTokens.colors.error || '#ef4444'}`
                          e.target.style.outlineOffset = '2px'
                        }}
                        onBlur={(e) => {
                          e.target.style.outline = 'none'
                        }}
                      >
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill={prompt.isLiked === false ? 'white' : 'none'} 
                          stroke={prompt.isLiked === false ? 'white' : 'currentColor'} 
                          strokeWidth="2"
                        >
                          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                        </svg>
                      </button>
                    </div>

                    {/* 타임스탬프 */}
                    <div className={styles.timestamp}>
                      {(() => {
                        try {
                          // timestamp가 Date 객체인지 문자열인지 확인
                          const dateObj = prompt.timestamp instanceof Date ? prompt.timestamp : new Date(prompt.timestamp)
                          if (isNaN(dateObj.getTime())) {
                            // 유효하지 않은 날짜인 경우 기본값 반환
                            return '2025. 8.8 16:20'
                          }
                          return `${dateObj.toLocaleDateString('ko-KR', {
                            month: 'long',
                            day: 'numeric'
                          })} ${dateObj.toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}`
                        } catch (error) {
                          console.warn('타임스탬프 파싱 오류:', error)
                          return '2025. 8.8 16:20'
                        }
                      })()}
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
              
              {/* 브레드크럼 - 프롬프트 입력 페이지와 동일한 스타일 */}
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
                <span style={{ color: '#1e293b', fontWeight: '600' }}>프롬프트 검토</span>
              </div>
            </div>
            
            {/* 첫 번째 콘텐츠 영역: 기본 번역문, 원문, 프롬프트 결과 번역문을 가로로 배치 */}
            <div style={{ 
              display: 'flex', 
              gap: '16px',
              minWidth: 0, // flexbox에서 스크롤이 제대로 작동하도록
              padding: '16px', // 첫 번째 영역 패딩
              backgroundColor: 'rgba(0, 0, 0, 0.02)', // 구분을 위한 배경색
              borderRadius: '12px', // 둥근 테두리
              border: '1px solid rgba(0, 0, 0, 0.1)', // 테두리
              marginBottom: '24px', // 하단 여백 추가
              flex: '1 1 auto', // 남는 공간을 채우도록 설정
              minHeight: '360px', // 최소 높이 유지
              maxHeight: 'calc(100vh - 200px)' // 최대 높이를 화면에 맞춰 fill
            }}>
              {/* 기본 번역문과 원문을 토글 버튼 그룹으로 */}
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                gap: '16px',
                minWidth: 0, // flexbox에서 스크롤이 제대로 작동하도록
                height: '100%' // 높이를 100%로 설정하여 부모 컨테이너에 맞춤
              }}>
                {/* 토글 버튼 그룹 - 프롬프트 입력 페이지와 동일한 스타일 */}
                <div style={{
                  display: 'flex',
                  backgroundColor: designTokens.colors.background.secondary,
                  borderRadius: designTokens.borders.radius.md,
                  padding: '4px',
                  border: `1px solid ${designTokens.colors.border.light}`,
                  flexShrink: 0 // 축소되지 않도록 고정
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
                  minHeight: 0 // flexbox에서 스크롤이 제대로 작동하도록
                }}>
                  {translationView === 'baseline' ? (
                    // 기본 번역문 표시
                    <div style={{
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: 'var(--text-muted)',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-all'
                    }}>
                      {baselineTranslation || '기본 번역문이 여기에 표시됩니다.'}
                    </div>
                  ) : (
                    // 원문 표시
                    <div style={{
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: 'var(--text-muted)',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-all'
                    }}>
                      {originalText || '원문이 여기에 표시됩니다.'}
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
                height: '100%' // 높이를 100%로 설정하여 부모 컨테이너에 맞춤
              }}>
                {/* 프롬프트 결과 번역문 헤더 - 프롬프트 입력 페이지와 동일한 스타일 */}
                <div style={{
                  display: 'flex',
                  backgroundColor: designTokens.colors.background.primary, // 선택된 상태로 표시
                  borderRadius: designTokens.borders.radius.md,
                  padding: '16px 24px', // 토글 버튼과 동일한 패딩
                  border: `1px solid ${designTokens.colors.border.light}`,
                  flexShrink: 0, // 축소되지 않도록 고정
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{
                    fontSize: designTokens.typography.fontSize.sm,
                    fontWeight: designTokens.typography.fontWeight.medium,
                    color: designTokens.colors.text.primary // 선택된 상태의 텍스트 색상
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
                  minHeight: 0 // flexbox에서 스크롤이 제대로 작동하도록
                }}>
                  <div style={{
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: 'var(--text-muted)',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-all'
                  }}>
                    {selectedPrompt?.result || '프롬프트를 선택하면 번역 결과가 여기에 표시됩니다.'}
                  </div>
                </div>
              </div>
            </div>

            {/* 코멘트 작성 영역 */}
            <div className={styles.commentSection}>
              <h3 className={styles.translationSubtitle}>
                코멘트 작성
              </h3>
              
              {!selectedPrompt ? (
                // 1. 왼쪽의 프롬프트를 하나도 선택하지 않은 기본 상태
                <div className={styles.commentPlaceholder}>
                  <div className={styles.placeholderContent}>
                    <span>왼쪽의 프롬프트를 선택하여 입력을 활성화해 주세요.</span>
                    <div className={styles.helpIcon}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"/>
                        <path d="M7 12h2v2H7zm1-10c-1.7 0-3 1.3-3 3h2c0-.6.4-1 1-1s1 .4 1 1c0 .7-.4 1.3-1 1.5V10H7V6.5c1.2-.3 2-1.4 2-2.5z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                // 2. 좋아요 프롬프트를 선택했으나 텍스트 입력을 아직 않은 상태
                // 3. 싫어요 평가를 받은 프롬프트를 클릭한 상태  
                // 4. 좋아요 프롬프트를 입력하고 저장한 상태
                <div>
                  {/* 코멘트 텍스트 박스 */}
                  <div style={{
                    padding: '16px',
                    backgroundColor: 'white',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    height: '100px',
                    position: 'relative'
                  }}>
                    <textarea
                      className="text-input-common"
                      placeholder={
                        isReadOnlyMode
                          ? "🔒 제출 완료된 과제는 수정할 수 없습니다."
                          : selectedPrompt.isLiked === false 
                            ? "싫어요 평가를 받은 결과물에 대해서는 평가를 작성할 수 없습니다."
                            : (!isCommentEditing && savedComments[selectedPrompt?.id])
                              ? "💾 저장된 코멘트입니다. 수정하려면 '코멘트 수정' 버튼을 클릭하세요."
                              : "코멘트를 입력해주세요..."
                      }
                      value={commentText}
                      onChange={(e) => {
                        // 편집 모드가 아니고 이미 저장된 코멘트가 있으면 입력 차단
                        if (!isReadOnlyMode && (isCommentEditing || !savedComments[selectedPrompt?.id])) {
                          setCommentText(e.target.value)
                        }
                      }}
                      disabled={
                        selectedPrompt.isLiked === false || 
                        (!isCommentEditing && savedComments[selectedPrompt?.id]) || // 편집 모드가 아니고 저장된 코멘트가 있으면 비활성화
                        isReadOnlyMode
                      }
                      style={{
                        width: '100%',
                        height: '100%',
                        fontSize: '14px',
                        padding: '0px', // 마진을 더 작게 조정
                        backgroundColor: (selectedPrompt.isLiked === false || (!isCommentEditing && savedComments[selectedPrompt?.id]) || isReadOnlyMode) ? '#f8f9fa' : 'white',
                        color: (selectedPrompt.isLiked === false || (!isCommentEditing && savedComments[selectedPrompt?.id]) || isReadOnlyMode) ? '#6b7280' : '#111827',
                        cursor: (selectedPrompt.isLiked === false || (!isCommentEditing && savedComments[selectedPrompt?.id]) || isReadOnlyMode) ? 'not-allowed' : 'text',
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                  
                  {/* 안내 문구 */}
                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(0, 0, 0, 0.4)',
                    marginTop: '8px',
                    marginBottom: '16px',
                    textAlign: 'left'
                  }}>
                    * 좋아요 프롬프트는 20자 이상의 코멘트 입력이 필수입니다.
                  </div>
                  
                  {/* 코멘트 액션 버튼들 */}
                  <div className={styles.commentActions}>
                    {selectedPrompt.isLiked === false ? (
                      // 3. 싫어요 프롬프트 - 모든 버튼 비활성화
                      <>
                        <Button
                          variant="secondary"
                          size="small"
                          style="solid"
                          disabled
                        >
                          코멘트 수정
                        </Button>
                        <div className={styles.rightButtons}>
                          <Button
                            variant="secondary"
                            size="small"
                            style="solid"
                            disabled
                          >
                            취소
                          </Button>
                          <Button
                            variant="blue"
                            size="small"
                            style="solid"
                            disabled
                          >
                            저장
                          </Button>
                        </div>
                      </>
                    ) : (
                      // 2. 좋아요 프롬프트 - 항상 모든 버튼 표시, 상태에 따라 활성화/비활성화
                      <>
                        {/* 코멘트 수정 버튼 - 저장된 코멘트가 있고 수정 모드가 아닐 때만 활성화 */}
                        <Button
                          variant={savedComments[selectedPrompt.id] ? "blue" : "secondary"}
                          size="small"
                          style="solid"
                          onClick={savedComments[selectedPrompt.id] && !isReadOnlyMode ? handleCommentEdit : undefined}
                          disabled={!savedComments[selectedPrompt.id] || isCommentEditing || isReadOnlyMode}
                        >
                          코멘트 수정
                        </Button>
                        
                        {/* 취소와 저장 버튼 - 수정 모드일 때만 활성화 */}
                        <div className={styles.rightButtons}>
                          <Button
                            variant="secondary"
                            size="small"
                            style="solid"
                            onClick={!isReadOnlyMode ? handleCommentCancel : undefined}
                            disabled={!isCommentEditing || isReadOnlyMode}
                          >
                            취소
                          </Button>
                          <Button
                            variant="blue"
                            size="small"
                            style="solid"
                            onClick={!isReadOnlyMode ? handleCommentSave : undefined}
                            disabled={!isCommentEditing || commentText.trim().length < 20 || isReadOnlyMode}
                          >
                            저장
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
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
            text: '최종안 선택 및 평가 작성',
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

export default PromptReviewPage
