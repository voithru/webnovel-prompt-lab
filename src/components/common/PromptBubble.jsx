import React, { useState } from 'react'
import { useDesignSystemContext } from './DesignSystemProvider'

const PromptBubble = ({ 
  version, 
  promptText, 
  timestamp,
  status = 'default', // 'default', 'liked', 'disliked', 'selected'
  onLike, 
  onDislike, 
  onCopy, 
  onClick // 프롬프트 버블 클릭 이벤트 추가
}) => {
  const { designTokens } = useDesignSystemContext()
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  // 좋아요/싫어요 상태 변경 핸들러
  const handleLike = () => {
    if (onLike) {
      // 현재 상태가 'liked'면 해제, 아니면 'liked'로 설정하고 'disliked' 해제
      const newStatus = status === 'liked' ? 'default' : 'liked'
      onLike(newStatus)
    }
  }

  const handleDislike = () => {
    if (onDislike) {
      // 현재 상태가 'disliked'면 해제, 아니면 'disliked'로 설정하고 'liked' 해제
      const newStatus = status === 'disliked' ? 'default' : 'disliked'
      onDislike(newStatus)
    }
  }

  // 상태별 스타일 결정
  const getBubbleStyles = () => {
    const baseStyles = {
      backgroundColor: 'white',
      borderColor: designTokens.colors.border.light,
      borderLeft: `4px solid ${designTokens.colors.border.primary}`,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease'
    }

    switch (status) {
      case 'liked':
        return {
          ...baseStyles,
          backgroundColor: 'rgba(34, 197, 94, 0.05)',
          borderColor: 'rgba(34, 197, 94, 0.2)',
          borderLeft: `4px solid ${designTokens.colors.success || '#22c55e'}`,
          boxShadow: '0 2px 8px rgba(34, 197, 94, 0.15)'
        }
      case 'disliked':
        return {
          ...baseStyles,
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          borderColor: 'rgba(239, 68, 68, 0.2)',
          borderLeft: `4px solid ${designTokens.colors.error || '#ef4444'}`,
          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.15)'
        }
      case 'selected':
        return {
          ...baseStyles,
          backgroundColor: 'white',
          borderColor: 'rgba(59, 130, 246, 0.6)',
          borderLeft: `4px solid ${designTokens.colors.primary || '#3b82f6'}`,
          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)',
          transform: 'translateY(-1px)',
          borderWidth: '2px' // 테두리를 더 두껍게
        }
      default:
        return baseStyles
    }
  }

  // 호버 상태 스타일
  const getHoverStyles = () => {
    if (status === 'selected') {
      // 선택된 상태일 때는 더 강한 강조 효과
      return {
        backgroundColor: 'rgba(59, 130, 246, 0.16)',
        borderColor: 'rgba(59, 130, 246, 0.6)',
        boxShadow: '0 6px 20px rgba(59, 130, 246, 0.35)',
        transform: 'translateY(-2px)'
      }
    }
    
    return {
      backgroundColor: status === 'liked' ? 'rgba(34, 197, 94, 0.08)' :
                     status === 'disliked' ? 'rgba(239, 68, 68, 0.08)' :
                     'rgba(59, 130, 246, 0.03)',
      borderColor: status === 'liked' ? 'rgba(34, 197, 94, 0.3)' :
                   status === 'disliked' ? 'rgba(239, 68, 68, 0.3)' :
                   designTokens.colors.primary || '#3b82f6',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      transform: 'translateY(-2px)'
    }
  }

  // 액티브(클릭) 상태 스타일
  const getActiveStyles = () => {
    return {
      transform: 'translateY(0px)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }
  }

  const bubbleStyles = getBubbleStyles()
  const hoverStyles = isHovered ? getHoverStyles() : {}
  const activeStyles = isPressed ? getActiveStyles() : {}

  return (
    <div 
      style={{
        padding: '16px',
        backgroundColor: bubbleStyles.backgroundColor,
        border: `1px solid ${bubbleStyles.borderColor}`,
        borderLeft: bubbleStyles.borderLeft,
        borderRadius: designTokens.borders.radius.lg || '12px',
        position: 'relative',
        marginBottom: '12px',
        cursor: onClick ? 'pointer' : 'default',
        ...bubbleStyles,
        ...hoverStyles,
        ...activeStyles
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {/* 버전 라벨 */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        backgroundColor: status === 'selected' 
          ? designTokens.colors.primary || '#3b82f6'
          : designTokens.colors.primary || '#8b5cf6',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: designTokens.typography.fontSize.xs || '12px',
        fontWeight: designTokens.typography.fontWeight.medium || '500',
        zIndex: 1,
        boxShadow: status === 'selected' 
          ? '0 2px 8px rgba(59, 130, 246, 0.4)'
          : 'none'
      }}>
        {version}
      </div>

      {/* 타임스탬프 - 오른쪽 상단 */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        color: designTokens.colors.text.muted || '#6b7280',
        fontSize: designTokens.typography.fontSize.xs || '12px',
        zIndex: 1
      }}>
        {(() => {
          try {
            // timestamp가 Date 객체인지 문자열인지 확인
            const dateObj = timestamp instanceof Date ? timestamp : new Date(timestamp)
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

      {/* 프롬프트 텍스트 */}
      <div style={{
        fontSize: designTokens.typography.fontSize.sm || '14px',
        color: designTokens.colors.text.primary,
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        lineHeight: '1.5',
        marginTop: '32px', // 버전 라벨과 타임스탬프 공간 확보
        marginBottom: '16px',
        paddingTop: '8px'
      }}>
        {promptText}
      </div>

      {/* 하단 액션 버튼들 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '16px'
      }}>
        {/* 왼쪽: 좋아요/싫어요 버튼 - 하나의 영역에 택1 선택 */}
        <div style={{
          display: 'flex',
          backgroundColor: designTokens.colors.background.secondary || '#f3f4f6',
          borderRadius: designTokens.borders.radius.md || '8px',
          border: `1px solid ${designTokens.colors.border.light}`,
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          position: 'relative',
          zIndex: 10
        }}>
          {/* 좋아요 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleLike()
            }}
            style={{
              padding: '8px 12px',
              backgroundColor: status === 'liked' ? designTokens.colors.success || '#22c55e' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              color: status === 'liked' ? 'white' : designTokens.colors.text.muted || '#6b7280',
              borderRadius: '0',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              // 싫어요가 선택된 상태가 아닐 때만 호버 효과 적용
              if (status !== 'liked' && status !== 'disliked') {
                e.target.style.backgroundColor = 'rgba(34, 197, 94, 0.2)'
                e.target.style.color = designTokens.colors.success || '#22c55e'
              }
            }}
            onMouseLeave={(e) => {
              // 싫어요가 선택된 상태가 아닐 때만 원래 상태로 복원
              if (status !== 'liked' && status !== 'disliked') {
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
              fill={status === 'liked' ? 'white' : 'none'} 
              stroke={status === 'liked' ? 'white' : 'currentColor'} 
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
              handleDislike()
            }}
            style={{
              padding: '8px 12px',
              backgroundColor: status === 'disliked' ? designTokens.colors.error || '#ef4444' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              color: status === 'disliked' ? 'white' : designTokens.colors.text.muted || '#6b7280',
              borderRadius: '0',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              // 좋아요가 선택된 상태가 아닐 때만 호버 효과 적용
              if (status !== 'disliked' && status !== 'liked') {
                e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'
                e.target.style.color = designTokens.colors.error || '#ef4444'
              }
            }}
            onMouseLeave={(e) => {
              // 좋아요가 선택된 상태가 아닐 때만 원래 상태로 복원
              if (status !== 'disliked' && status !== 'liked') {
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
              fill={status === 'disliked' ? 'white' : 'none'} 
              stroke={status === 'disliked' ? 'white' : 'currentColor'} 
              strokeWidth="2"
            >
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
            </svg>
          </button>
        </div>

        {/* 오른쪽: 복사 아이콘 */}
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          {/* 복사 버튼 */}
          <button
            onClick={onCopy}
            style={{
              padding: '8px',
              backgroundColor: 'white',
              border: `1px solid ${designTokens.colors.border.light}`,
              borderRadius: designTokens.borders.radius.md || '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = designTokens.colors.background.secondary || '#f3f4f6'
              e.target.style.borderColor = designTokens.colors.primary || '#3b82f6'
              e.target.style.transform = 'translateY(-1px)'
              e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white'
              e.target.style.borderColor = designTokens.colors.border.light
              e.target.style.transform = 'translateY(0px)'
              e.target.style.boxShadow = 'none'
            }}
            onMouseDown={(e) => {
              e.target.style.transform = 'translateY(0px)'
              e.target.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.1)'
            }}
            onMouseUp={(e) => {
              e.target.style.transform = 'translateY(-1px)'
              e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
            onFocus={(e) => {
              e.target.style.outline = `2px solid ${designTokens.colors.primary || '#3b82f6'}`
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
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PromptBubble
