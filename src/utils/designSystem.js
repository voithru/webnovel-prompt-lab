/**
 * 디자인 시스템 유틸리티
 * 스토리북의 디자인 시스템을 프로덕트에서 자동으로 사용할 수 있도록 합니다.
 */

// CSS 변수에서 디자인 토큰 가져오기
const getCSSVariable = (variableName, fallback = '') => {
  if (typeof window === 'undefined') return fallback
  return getComputedStyle(document.documentElement).getPropertyValue(variableName) || fallback
}

// 색상 시스템
export const colors = {
  // 기본 색상
  primary: () => getCSSVariable('--color-primary', '#3b82f6'),
  secondary: () => getCSSVariable('--color-secondary', '#64748b'),
  success: () => getCSSVariable('--color-success', '#10b981'),
  warning: () => getCSSVariable('--color-warning', '#f59e0b'),
  error: () => getCSSVariable('--color-error', '#ef4444'),
  info: () => getCSSVariable('--color-info', '#06b6d4'),
  
  // 배경 색상
  background: {
    light: () => getCSSVariable('--color-background-light', '#ffffff'),
    dark: () => getCSSVariable('--color-background-dark', '#0f172a'),
    primary: () => getCSSVariable('--color-background-primary', '#f8fafc'),
    secondary: () => getCSSVariable('--color-background-secondary', '#f1f5f9'),
  },
  
  // 텍스트 색상
  text: {
    light: () => getCSSVariable('--color-text-light', '#1e293b'),
    dark: () => getCSSVariable('--color-text-dark', '#f1f5f9'),
    muted: () => getCSSVariable('--color-text-muted', '#64748b'),
    primary: () => getCSSVariable('--color-text-primary', '#1e293b'),
  },
  
  // 테두리 색상
  border: {
    light: () => getCSSVariable('--color-border-light', '#e2e8f0'),
    dark: () => getCSSVariable('--color-border-dark', '#334155'),
    primary: () => getCSSVariable('--color-border-primary', '#cbd5e1'),
  }
}

// 여백 시스템
export const spacing = {
  xs: () => getCSSVariable('--spacing-xs', '4px'),
  sm: () => getCSSVariable('--spacing-sm', '8px'),
  md: () => getCSSVariable('--spacing-md', '16px'),
  lg: () => getCSSVariable('--spacing-lg', '24px'),
  xl: () => getCSSVariable('--spacing-xl', '32px'),
  xxl: () => getCSSVariable('--spacing-xxl', '48px'),
  
  // 동적 여백 (스케일에 따라 조정)
  dynamic: (baseSize = 'md') => {
    const scale = getCSSVariable('--scale', 'medium')
    const baseSpacing = {
      small: { xs: '2px', sm: '4px', md: '8px', lg: '16px', xl: '24px', xxl: '32px' },
      medium: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },
      large: { xs: '8px', sm: '16px', md: '24px', lg: '32px', xl: '48px', xxl: '64px' }
    }
    return baseSpacing[scale]?.[baseSize] || baseSpacing.medium[baseSize]
  }
}

// 타이포그래피 시스템
export const typography = {
  fontFamily: {
    base: () => getCSSVariable('--font-family-base', 'system-ui, -apple-system, sans-serif'),
    heading: () => getCSSVariable('--font-family-heading', 'system-ui, -apple-system, sans-serif'),
    mono: () => getCSSVariable('--font-family-mono', 'ui-monospace, monospace'),
  },
  
  fontSize: {
    xs: () => getCSSVariable('--font-size-xs', '12px'),
    sm: () => getCSSVariable('--font-size-sm', '14px'),
    base: () => getCSSVariable('--font-size-base', '16px'),
    lg: () => getCSSVariable('--font-size-lg', '18px'),
    xl: () => getCSSVariable('--font-size-xl', '20px'),
    '2xl': () => getCSSVariable('--font-size-2xl', '24px'),
    '3xl': () => getCSSVariable('--font-size-3xl', '30px'),
    '4xl': () => getCSSVariable('--font-size-4xl', '36px'),
  },
  
  fontWeight: {
    light: () => getCSSVariable('--font-weight-light', '300'),
    normal: () => getCSSVariable('--font-weight-normal', '400'),
    medium: () => getCSSVariable('--font-weight-medium', '500'),
    semibold: () => getCSSVariable('--font-weight-semibold', '600'),
    bold: () => getCSSVariable('--font-weight-bold', '700'),
  },
  
  lineHeight: {
    tight: () => getCSSVariable('--line-height-tight', '1.25'),
    normal: () => getCSSVariable('--line-height-normal', '1.5'),
    relaxed: () => getCSSVariable('--line-height-relaxed', '1.75'),
  }
}

// 테두리 및 그림자 시스템
export const borders = {
  radius: {
    none: () => getCSSVariable('--border-radius-none', '0'),
    sm: () => getCSSVariable('--border-radius-sm', '4px'),
    md: () => getCSSVariable('--border-radius-md', '8px'),
    lg: () => getCSSVariable('--border-radius-lg', '12px'),
    xl: () => getCSSVariable('--border-radius-xl', '16px'),
    full: () => getCSSVariable('--border-radius-full', '9999px'),
  },
  
  width: {
    none: () => getCSSVariable('--border-width-none', '0'),
    thin: () => getCSSVariable('--border-width-thin', '1px'),
    thick: () => getCSSVariable('--border-width-thick', '2px'),
    thicker: () => getCSSVariable('--border-width-thicker', '4px'),
  }
}

export const shadows = {
  none: () => getCSSVariable('--shadow-none', 'none'),
  sm: () => getCSSVariable('--shadow-sm', '0 1px 2px 0 rgba(0, 0, 0, 0.05)'),
  md: () => getCSSVariable('--shadow-md', '0 4px 6px -1px rgba(0, 0, 0, 0.1)'),
  lg: () => getCSSVariable('--shadow-lg', '0 10px 15px -3px rgba(0, 0, 0, 0.1)'),
  xl: () => getCSSVariable('--shadow-xl', '0 20px 25px -5px rgba(0, 0, 0, 0.1)'),
  '2xl': () => getCSSVariable('--shadow-2xl', '0 25px 50px -12px rgba(0, 0, 0, 0.25)'),
}

// 테마 감지 - 항상 라이트모드로 고정
export const theme = {
  isDark: () => false, // 항상 false 반환
  
  isLight: () => true, // 항상 true 반환
  
  // 현재 테마에 따른 색상 자동 선택 - 항상 라이트모드 색상 사용
  adaptive: {
    background: () => colors.background.light(),
    text: () => colors.text.light(),
    border: () => colors.border.light(),
  }
}

// 디자인 시스템 스타일 객체 생성
export const createDesignStyles = (customStyles = {}) => {
  return {
    // 기본 스타일
    base: {
      fontFamily: typography.fontFamily.base(),
      fontSize: typography.fontSize.base(),
      lineHeight: typography.lineHeight.normal(),
      color: theme.adaptive.text(),
      backgroundColor: theme.adaptive.background(),
    },
    
    // 버튼 스타일
    button: {
      primary: {
        backgroundColor: colors.primary(),
        color: '#ffffff',
        padding: `${spacing.md()} ${spacing.lg()}`,
        borderRadius: borders.radius.md(),
        border: 'none',
        fontSize: typography.fontSize.sm(),
        fontWeight: typography.fontWeight.medium(),
        boxShadow: shadows.sm(),
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: shadows.md(),
          transform: 'translateY(-1px)',
        }
      },
      secondary: {
        backgroundColor: 'transparent',
        color: colors.primary(),
        padding: `${spacing.md()} ${spacing.lg()}`,
        borderRadius: borders.radius.md(),
        border: `${borders.width.thin()} solid ${colors.primary()}`,
        fontSize: typography.fontSize.sm(),
        fontWeight: typography.fontWeight.medium(),
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: colors.primary(),
          color: '#ffffff',
        }
      }
    },
    
    // 입력 필드 스타일
    input: {
      base: {
        padding: spacing.md(),
        border: `${borders.width.thin()} solid ${theme.adaptive.border()}`,
        borderRadius: borders.radius.md(),
        fontSize: typography.fontSize.base(),
        backgroundColor: theme.adaptive.background(),
        color: theme.adaptive.text(),
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        '&:focus': {
          outline: 'none',
          borderColor: colors.primary(),
          boxShadow: `0 0 0 3px ${colors.primary()}20`,
        }
      }
    },
    
    // 카드 스타일
    card: {
      base: {
        backgroundColor: theme.adaptive.background(),
        border: `${borders.width.thin()} solid ${theme.adaptive.border()}`,
        borderRadius: borders.radius.lg(),
        padding: spacing.lg(),
        boxShadow: shadows.sm(),
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': {
          boxShadow: shadows.md(),
          transform: 'translateY(-2px)',
        }
      }
    },
    
    // 사용자 정의 스타일 병합
    ...customStyles
  }
}

// 디자인 시스템 초기화
export const initializeDesignSystem = () => {
  if (typeof window === 'undefined') return
  
  // CSS 변수가 없으면 기본값 설정
  const root = document.documentElement
  
  // 색상 변수 설정
  if (!getCSSVariable('--color-primary')) {
    root.style.setProperty('--color-primary', '#3b82f6')
    root.style.setProperty('--color-secondary', '#64748b')
    root.style.setProperty('--color-success', '#10b981')
    root.style.setProperty('--color-warning', '#f59e0b')
    root.style.setProperty('--color-error', '#ef4444')
    root.style.setProperty('--color-info', '#06b6d4')
  }
  
  // 여백 변수 설정
  if (!getCSSVariable('--spacing-xs')) {
    root.style.setProperty('--spacing-xs', '4px')
    root.style.setProperty('--spacing-sm', '8px')
    root.style.setProperty('--spacing-md', '16px')
    root.style.setProperty('--spacing-lg', '24px')
    root.style.setProperty('--spacing-xl', '32px')
    root.style.setProperty('--spacing-xxl', '48px')
  }
  
  // 타이포그래피 변수 설정
  if (!getCSSVariable('--font-size-base')) {
    root.style.setProperty('--font-size-base', '16px')
    root.style.setProperty('--font-size-sm', '14px')
    root.style.setProperty('--font-size-lg', '18px')
    root.style.setProperty('--font-size-xl', '20px')
    root.style.setProperty('--font-size-2xl', '24px')
  }
  
  // 테마 자동 감지 제거 - 항상 라이트모드 유지
  // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  // if (prefersDark) {
  //   root.classList.add('dark')
  // }
  
  // 다크모드 클래스가 있다면 제거
  if (root.classList.contains('dark')) {
    root.classList.remove('dark')
  }
}

// 자동 초기화
if (typeof window !== 'undefined') {
  initializeDesignSystem()
}

export default {
  colors,
  spacing,
  typography,
  borders,
  shadows,
  theme,
  createDesignStyles,
  initializeDesignSystem
}
