import React from 'react'
import { useDesignSystemContext } from './DesignSystemProvider'
import Button from './Button'

const ContextInfoModal = ({ isOpen, onClose, contextContent, isLoading }) => {
  const { designTokens } = useDesignSystemContext()

  // 클립보드 복사 기능
  const handleCopyToClipboard = async () => {
    if (!contextContent) {
      alert('⚠️ 복사할 내용이 없습니다.')
      return
    }

    try {
      await navigator.clipboard.writeText(contextContent)
      alert('✅ 맥락 정보가 클립보드에 복사되었습니다!')
    } catch (error) {
      console.error('클립보드 복사 실패:', error)
      // 대안: textarea를 이용한 복사 (구형 브라우저 지원)
      try {
        const textarea = document.createElement('textarea')
        textarea.value = contextContent
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        alert('✅ 맥락 정보가 클립보드에 복사되었습니다!')
      } catch (fallbackError) {
        console.error('대안 복사 방법도 실패:', fallbackError)
        alert('❌ 클립보드 복사에 실패했습니다. 수동으로 복사해주세요.')
      }
    }
  }

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
              맥락 정보
            </h2>
            <p style={{
              fontSize: designTokens.typography.fontSize.sm,
              color: designTokens.colors.text.muted,
              margin: 0,
              marginBottom: '8px'
            }}>
              이 과제의 맥락 분석 정보입니다
            </p>
            {/* 정보 안내 문구 */}
            <div style={{
              fontSize: designTokens.typography.fontSize.xs,
              color: '#059669', // 초록색
              fontWeight: designTokens.typography.fontWeight.medium,
              backgroundColor: 'rgba(5, 150, 105, 0.1)',
              padding: '6px 12px',
              borderRadius: designTokens.borders.radius.md,
              border: '1px solid rgba(5, 150, 105, 0.2)',
              margin: 0
            }}>
              💡 이 정보는 AI 번역 시 자동으로 고려됩니다
            </div>
          </div>
          
          {/* 우측 버튼들 */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            {/* 클립보드 복사 버튼 */}
            {contextContent && !isLoading && (
              <Button
                variant="green"
                size="small"
                style="solid"
                onClick={handleCopyToClipboard}
                title="맥락 정보 전체를 클립보드에 복사"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                복사
              </Button>
            )}
            
            {/* 닫기 버튼 */}
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
              <div>맥락 정보를 불러오는 중...</div>
            </div>
          ) : contextContent ? (
            <div style={{
              fontSize: designTokens.typography.fontSize.sm,
              lineHeight: designTokens.typography.lineHeight.relaxed,
              color: designTokens.colors.text.primary,
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}>
              {(() => {
                console.log('🔍 ContextInfoModal 렌더링 디버깅:', {
                  hasContextContent: !!contextContent,
                  contentLength: contextContent?.length,
                  contentType: typeof contextContent,
                  contentPreview: contextContent?.substring(0, 100) + '...'
                })
                return contextContent
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
              <div style={{ marginBottom: '8px', fontSize: '48px' }}>🔍</div>
              <div style={{ fontWeight: designTokens.typography.fontWeight.medium }}>
                맥락 정보를 찾을 수 없습니다
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
            variant="green"
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

export default ContextInfoModal
