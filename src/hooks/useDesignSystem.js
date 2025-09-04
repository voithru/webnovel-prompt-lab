import { useState, useEffect, useCallback } from 'react'
import { 
  colors, 
  spacing, 
  typography, 
  borders, 
  shadows, 
  theme,
  createDesignStyles 
} from '../utils/designSystem'

/**
 * 디자인 시스템을 자동으로 사용할 수 있는 React 훅
 * 스토리북의 디자인 시스템을 프로덕트에서 실시간으로 반영합니다.
 */
export const useDesignSystem = () => {
  const [currentTheme, setCurrentTheme] = useState('light') // 항상 라이트모드로 고정
  const [currentScale, setCurrentScale] = useState('medium')
  const [isInitialized, setIsInitialized] = useState(false)

  // 다크모드 감지 제거 - 항상 라이트모드 유지
  useEffect(() => {
    // 다크모드 클래스가 있다면 제거
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // CSS 변수 변경 감지
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          // CSS 변수가 변경되었을 때 상태 업데이트 (항상 라이트모드)
          setCurrentTheme('light')
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class']
    })

    return () => observer.disconnect()
  }, [])

  // 디자인 시스템 초기화
  useEffect(() => {
    if (!isInitialized) {
      // CSS 변수들이 로드될 때까지 대기
      const checkInitialization = () => {
        const hasDesignTokens = getComputedStyle(document.documentElement)
          .getPropertyValue('--color-primary')
        
        if (hasDesignTokens) {
          setIsInitialized(true)
        } else {
          // 아직 로드되지 않았다면 잠시 후 다시 확인
          setTimeout(checkInitialization, 100)
        }
      }
      
      checkInitialization()
    }
  }, [isInitialized])

  // 테마 토글 제거 - 항상 라이트모드 유지
  const toggleTheme = useCallback(() => {
    // 다크모드로 변경 시도 시 라이트모드로 강제 유지
    setCurrentTheme('light')
    document.documentElement.classList.remove('dark')
  }, [])

  // 스케일 변경
  const setScale = useCallback((scale) => {
    setCurrentScale(scale)
    document.documentElement.style.setProperty('--scale', scale)
  }, [])

  // 현재 디자인 토큰 값들
  const designTokens = {
    colors: {
      primary: colors.primary(),
      secondary: colors.secondary(),
      success: colors.success(),
      warning: colors.warning(),
      error: colors.error(),
      info: colors.info(),
      background: {
        light: colors.background.light(),
        dark: colors.background.dark(),
        primary: colors.background.primary(),
        secondary: colors.background.secondary(),
      },
      text: {
        light: colors.text.light(),
        dark: colors.text.dark(),
        muted: colors.text.muted(),
        primary: colors.text.primary(),
      },
      border: {
        light: colors.border.light(),
        dark: colors.border.dark(),
        primary: colors.border.primary(),
      }
    },
    spacing: {
      xs: spacing.xs(),
      sm: spacing.sm(),
      md: spacing.md(),
      lg: spacing.lg(),
      xl: spacing.xl(),
      xxl: spacing.xxl(),
      dynamic: spacing.dynamic,
    },
    typography: {
      fontFamily: {
        base: typography.fontFamily.base(),
        heading: typography.fontFamily.heading(),
        mono: typography.fontFamily.mono(),
      },
      fontSize: {
        xs: typography.fontSize.xs(),
        sm: typography.fontSize.sm(),
        base: typography.fontSize.base(),
        lg: typography.fontSize.lg(),
        xl: typography.fontSize.xl(),
        '2xl': typography.fontSize['2xl'](),
        '3xl': typography.fontSize['3xl'](),
        '4xl': typography.fontSize['4xl'](),
      },
      fontWeight: {
        light: typography.fontWeight.light(),
        normal: typography.fontWeight.normal(),
        medium: typography.fontWeight.medium(),
        semibold: typography.fontWeight.semibold(),
        bold: typography.fontWeight.bold(),
      },
      lineHeight: {
        tight: typography.lineHeight.tight(),
        normal: typography.lineHeight.normal(),
        relaxed: typography.lineHeight.relaxed(),
      }
    },
    borders: {
      radius: {
        none: borders.radius.none(),
        sm: borders.radius.sm(),
        md: borders.radius.md(),
        lg: borders.radius.lg(),
        xl: borders.radius.xl(),
        full: borders.radius.full(),
      },
      width: {
        none: borders.width.none(),
        thin: borders.width.thin(),
        thick: borders.width.thick(),
        thicker: borders.width.thicker(),
      }
    },
    shadows: {
      none: shadows.none(),
      sm: shadows.sm(),
      md: shadows.md(),
      lg: shadows.lg(),
      xl: shadows.xl(),
      '2xl': shadows['2xl'](),
    }
  }

  // 스타일 생성 함수
  const createStyles = useCallback((customStyles = {}) => {
    return createDesignStyles(customStyles)
  }, [])

  // 인라인 스타일 생성 함수
  const createInlineStyles = useCallback((styleType, variant = 'base') => {
    const styles = createDesignStyles()
    
    switch (styleType) {
      case 'button':
        return styles.button[variant] || styles.button.primary
      case 'input':
        return styles.input[variant] || styles.input.base
      case 'card':
        return styles.card[variant] || styles.card.base
      case 'base':
        return styles.base
      default:
        return {}
    }
  }, [])

  // CSS 변수 직접 설정
  const setCSSVariable = useCallback((variableName, value) => {
    document.documentElement.style.setProperty(variableName, value)
  }, [])

  // CSS 변수 가져오기
  const getCSSVariable = useCallback((variableName, fallback = '') => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName) || fallback
  }, [])

  return {
    // 상태
    currentTheme,
    currentScale,
    isInitialized,
    
    // 디자인 토큰
    designTokens,
    
    // 함수들
    toggleTheme,
    setScale,
    createStyles,
    createInlineStyles,
    setCSSVariable,
    getCSSVariable,
    
    // 유틸리티
    isDark: () => currentTheme === 'dark',
    isLight: () => currentTheme === 'light',
    
    // 실시간 값들 (함수로 호출)
    colors,
    spacing,
    typography,
    borders,
    shadows,
    theme: {
      ...theme,
      current: currentTheme,
      scale: currentScale
    }
  }
}

export default useDesignSystem
