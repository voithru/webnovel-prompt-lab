import React, { createContext, useContext, useEffect } from 'react'
import { initializeDesignSystem } from '../../utils/designSystem'
import useDesignSystem from '../../hooks/useDesignSystem'

// 디자인 시스템 컨텍스트
const DesignSystemContext = createContext()

/**
 * 디자인 시스템 프로바이더
 * 스토리북의 디자인 시스템을 모든 하위 컴포넌트에서 자동으로 사용할 수 있도록 합니다.
 */
export const DesignSystemProvider = ({ children }) => {
  const designSystem = useDesignSystem()

  // 디자인 시스템 초기화
  useEffect(() => {
    initializeDesignSystem()
    
    // 다크모드 클래스가 있다면 제거
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // CSS 변수 변경 감지 및 동기화
  useEffect(() => {
    const syncWithStorybook = () => {
      // 스토리북에서 변경된 CSS 변수들을 감지하고 동기화
      const root = document.documentElement
      const computedStyle = getComputedStyle(root)
      
      // 주요 디자인 토큰들 동기화
      const designTokens = [
        '--color-primary',
        '--color-secondary',
        '--color-success',
        '--color-warning',
        '--color-error',
        '--color-info',
        '--spacing-xs',
        '--spacing-sm',
        '--spacing-md',
        '--spacing-lg',
        '--spacing-xl',
        '--spacing-xxl',
        '--font-size-xs',
        '--font-size-sm',
        '--font-size-base',
        '--font-size-lg',
        '--font-size-xl',
        '--font-size-2xl',
        '--border-radius-sm',
        '--border-radius-md',
        '--border-radius-lg',
        '--shadow-sm',
        '--shadow-md',
        '--shadow-lg'
      ]

      designTokens.forEach(token => {
        const value = computedStyle.getPropertyValue(token)
        if (value) {
          root.style.setProperty(token, value)
        }
      })
    }

    // 초기 동기화
    syncWithStorybook()

    // MutationObserver로 CSS 변수 변경 감지
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          syncWithStorybook()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    })

    return () => observer.disconnect()
  }, [])

  return (
    <DesignSystemContext.Provider value={designSystem}>
      {children}
    </DesignSystemContext.Provider>
  )
}

/**
 * 디자인 시스템 훅 사용을 위한 커스텀 훅
 */
export const useDesignSystemContext = () => {
  const context = useContext(DesignSystemContext)
  if (!context) {
    throw new Error('useDesignSystemContext must be used within a DesignSystemProvider')
  }
  return context
}

/**
 * 디자인 시스템을 자동으로 적용하는 고차 컴포넌트
 */
export const withDesignSystem = (WrappedComponent) => {
  const WithDesignSystem = (props) => {
    const designSystem = useDesignSystem()
    
    return (
      <WrappedComponent 
        {...props} 
        designSystem={designSystem}
      />
    )
  }

  WithDesignSystem.displayName = `withDesignSystem(${WrappedComponent.displayName || WrappedComponent.name})`
  
  return WithDesignSystem
}

/**
 * 디자인 시스템 스타일을 자동으로 적용하는 컴포넌트
 */
export const DesignSystemWrapper = ({ children, className = '', style = {} }) => {
  const { designTokens, currentTheme } = useDesignSystem()

  const wrapperStyle = {
    // 기본 디자인 시스템 스타일
    fontFamily: designTokens.typography.fontFamily.base,
    fontSize: designTokens.typography.fontSize.base,
    lineHeight: designTokens.typography.lineHeight.normal,
    color: designTokens.colors.text.primary,
    backgroundColor: designTokens.colors.background.primary,
    
    // 사용자 정의 스타일
    ...style
  }

  return (
    <div 
      className={`design-system-wrapper ${className}`}
      style={wrapperStyle}
      data-theme={currentTheme}
    >
      {children}
    </div>
  )
}

export default DesignSystemProvider
