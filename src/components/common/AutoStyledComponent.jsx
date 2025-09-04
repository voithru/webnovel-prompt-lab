import React from 'react'
import { useDesignSystemContext } from './DesignSystemProvider'

/**
 * 디자인 시스템을 자동으로 적용하는 예시 컴포넌트
 * 이 컴포넌트는 스토리북에서 수정하면 프로덕트에 자동으로 반영됩니다.
 */
export const AutoStyledComponent = ({ 
  children, 
  variant = 'base',
  className = '',
  style = {},
  ...props 
}) => {
  const { designTokens, createInlineStyles } = useDesignSystemContext()

  // 디자인 시스템에서 자동으로 스타일 생성
  const autoStyles = createInlineStyles(variant, 'base')
  
  // 컴포넌트별 스타일 적용
  const componentStyle = {
    ...autoStyles,
    ...style,
    // 디자인 토큰을 직접 사용
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borders.radius.md,
    boxShadow: designTokens.shadows.sm,
    transition: 'all 0.2s ease',
  }

  return (
    <div
      className={`auto-styled-component ${className}`}
      style={componentStyle}
      data-variant={variant}
      data-theme={designTokens.theme?.current || 'light'}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * 자동 스타일링된 버튼 컴포넌트
 */
export const AutoStyledButton = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  ...props 
}) => {
  const { designTokens, createInlineStyles } = useDesignSystemContext()

  const buttonStyles = createInlineStyles('button', variant)
  
  // 크기별 스타일 조정
  const sizeStyles = {
    sm: {
      padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
      fontSize: designTokens.typography.fontSize.sm,
    },
    md: {
      padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
      fontSize: designTokens.typography.fontSize.base,
    },
    lg: {
      padding: `${designTokens.spacing.lg} ${designTokens.spacing.xl}`,
      fontSize: designTokens.typography.fontSize.lg,
    }
  }

  const finalStyle = {
    ...buttonStyles,
    ...sizeStyles[size],
    borderRadius: designTokens.borders.radius.md,
    fontWeight: designTokens.typography.fontWeight.medium,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s ease',
  }

  return (
    <button
      style={finalStyle}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * 자동 스타일링된 입력 필드 컴포넌트
 */
export const AutoStyledInput = ({ 
  placeholder = '',
  type = 'text',
  size = 'md',
  ...props 
}) => {
  const { designTokens, createInlineStyles } = useDesignSystemContext()

  const inputStyles = createInlineStyles('input', 'base')
  
  // 크기별 스타일 조정
  const sizeStyles = {
    sm: {
      padding: designTokens.spacing.sm,
      fontSize: designTokens.typography.fontSize.sm,
    },
    md: {
      padding: designTokens.spacing.md,
      fontSize: designTokens.typography.fontSize.base,
    },
    lg: {
      padding: designTokens.spacing.lg,
      fontSize: designTokens.typography.fontSize.lg,
    }
  }

  const finalStyle = {
    ...inputStyles,
    ...sizeStyles[size],
    border: `${designTokens.borders.width.thin} solid ${designTokens.colors.border.primary}`,
    borderRadius: designTokens.borders.radius.md,
    backgroundColor: designTokens.colors.background.primary,
    color: designTokens.colors.text.primary,
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  }

  return (
    <input
      type={type}
      placeholder={placeholder}
      style={finalStyle}
      data-size={size}
      {...props}
    />
  )
}

/**
 * 자동 스타일링된 카드 컴포넌트
 */
export const AutoStyledCard = ({ 
  children, 
  variant = 'base',
  elevation = 'md',
  ...props 
}) => {
  const { designTokens, createInlineStyles } = useDesignSystemContext()

  const cardStyles = createInlineStyles('card', variant)
  
  // 그림자 레벨별 스타일
  const elevationStyles = {
    none: { boxShadow: designTokens.shadows.none },
    sm: { boxShadow: designTokens.shadows.sm },
    md: { boxShadow: designTokens.shadows.md },
    lg: { boxShadow: designTokens.shadows.lg },
    xl: { boxShadow: designTokens.shadows.xl },
  }

  const finalStyle = {
    ...cardStyles,
    ...elevationStyles[elevation],
    backgroundColor: designTokens.colors.background.primary,
    border: `${designTokens.borders.width.thin} solid ${designTokens.colors.border.primary}`,
    borderRadius: designTokens.borders.radius.lg,
    padding: designTokens.spacing.lg,
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  }

  return (
    <div
      style={finalStyle}
      data-variant={variant}
      data-elevation={elevation}
      {...props}
    >
      {children}
    </div>
  )
}

export default AutoStyledComponent
