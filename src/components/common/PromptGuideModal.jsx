import React from 'react'
import { useDesignSystemContext } from './DesignSystemProvider'
import Button from './Button'

const PromptGuideModal = ({ isOpen, onClose, guideContent, isLoading }) => {
  const { designTokens } = useDesignSystemContext()

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000 // 모달과 dim - 하단 버튼(900)보다 위
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: designTokens.borders.radius.lg,
        padding: '32px',
        maxWidth: '800px',
        maxHeight: '80vh',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* 헤더 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: `1px solid ${designTokens.colors.border.light}`
        }}>
          <div>
            <h2 style={{
              fontSize: designTokens.typography.fontSize.xl,
              fontWeight: designTokens.typography.fontWeight.semibold,
              color: designTokens.colors.text.primary,
              margin: 0,
              marginBottom: '4px'
            }}>
              프롬프트 작성 예시
            </h2>
            <p style={{
              fontSize: designTokens.typography.fontSize.sm,
              color: designTokens.colors.text.muted,
              margin: 0,
              marginBottom: '8px'
            }}>
              아래 예시를 참고하여 효과적인 프롬프트를 작성해보세요
            </p>
            {/* 100회 제한 안내 문구 */}
            <div style={{
              fontSize: designTokens.typography.fontSize.xs,
              color: '#dc2626', // 빨간색
              fontWeight: designTokens.typography.fontWeight.semibold,
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              padding: '6px 12px',
              borderRadius: designTokens.borders.radius.md,
              border: '1px solid rgba(220, 38, 38, 0.2)',
              margin: 0
            }}>
              ⚠️ 과제당 최대 100개의 프롬프트만 입력 가능합니다
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: designTokens.colors.text.muted,
              padding: '4px',
              borderRadius: designTokens.borders.radius.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = designTokens.colors.background.secondary
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
            }}
          >
            ×
          </button>
        </div>

        {/* 콘텐츠 */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
          backgroundColor: designTokens.colors.background.secondary,
          borderRadius: designTokens.borders.radius.md,
          border: `1px solid ${designTokens.colors.border.light}`
        }}>
          {isLoading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
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
              <div>프롬프트 가이드를 불러오는 중...</div>
            </div>
          ) : guideContent ? (
            <div style={{
              fontSize: designTokens.typography.fontSize.sm,
              lineHeight: designTokens.typography.lineHeight.relaxed,
              color: designTokens.colors.text.primary,
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}>
              {(() => {
                console.log('🔍 PromptGuideModal 렌더링 디버깅:', {
                  hasGuideContent: !!guideContent,
                  contentLength: guideContent?.length,
                  contentType: typeof guideContent,
                  contentPreview: guideContent?.substring(0, 100) + '...'
                })
                return guideContent
              })()}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              color: designTokens.colors.text.muted,
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: '8px', fontSize: '48px' }}>📝</div>
              <div style={{ fontWeight: designTokens.typography.fontWeight.medium }}>
                프롬프트 가이드를 찾을 수 없습니다
              </div>
              <div style={{ fontSize: designTokens.typography.fontSize.xs, marginTop: '4px' }}>
                관리자에게 문의해주세요
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: `1px solid ${designTokens.colors.border.light}`
        }}>
          <Button
            variant="blue"
            size="small"
            onClick={onClose}
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PromptGuideModal
