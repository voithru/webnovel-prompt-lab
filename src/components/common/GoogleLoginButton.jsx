import React from 'react'
import styles from '../../styles/modules/GoogleLoginButton.module.css'

const GoogleLoginButton = ({ 
  onClick, 
  disabled = false, 
  loading = false, 
  size = 'medium',
  variant = 'primary',
  className = '',
  children = '구글로 로그인'
}) => {
  const buttonClasses = [
    styles.button,
    styles[size],
    styles[variant],
    disabled && styles.disabled,
    loading && styles.loading,
    className
  ].filter(Boolean).join(' ')

  // 디버깅을 위한 스타일 객체 출력
  console.log('CSS Module Styles:', styles)
  console.log('Button Classes:', buttonClasses)

  // 인라인 스타일을 우선 적용
  const getInlineStyles = () => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      border: 'none',
      borderRadius: '8px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      position: 'relative',
      overflow: 'hidden',
      outline: 'none'
    }

    // 크기별 스타일
    const sizeStyles = {
      small: { padding: '8px 16px', fontSize: '14px', minHeight: '36px' },
      medium: { padding: '12px 24px', fontSize: '16px', minHeight: '48px' },
      large: { padding: '16px 32px', fontSize: '18px', minHeight: '56px' }
    }

    // 변형별 스타일 - 더 강력한 스타일 적용
    const variantStyles = {
      primary: {
        background: 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
        color: 'white',
        boxShadow: '0 2px 8px rgba(66, 133, 244, 0.3)',
        border: 'none'
      },
      secondary: {
        background: 'white',
        color: '#4285f4',
        border: '2px solid #4285f4',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      },
      outline: {
        background: 'transparent',
        color: '#4285f4',
        border: '2px solid #e0e0e0',
        boxShadow: 'none'
      }
    }

    // 호버 효과를 위한 스타일
    const hoverStyles = {
      primary: {
        background: 'linear-gradient(135deg, #3367d6 0%, #2d8f47 100%)',
        boxShadow: '0 4px 12px rgba(66, 133, 244, 0.4)',
        transform: 'translateY(-1px)'
      },
      secondary: {
        background: '#f8f9fa',
        borderColor: '#3367d6',
        color: '#3367d6'
      },
      outline: {
        borderColor: '#4285f4',
        background: 'rgba(66, 133, 244, 0.05)'
      }
    }

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      ':hover': hoverStyles[variant]
    }
  }

  const inlineStyles = getInlineStyles()

  return (
    <button
      className={buttonClasses}
      style={inlineStyles}
      onClick={onClick}
      disabled={disabled || loading}
      type="button"
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          const variant = e.target.getAttribute('data-variant') || 'primary'
          const hoverStyles = {
            primary: {
              background: 'linear-gradient(135deg, #3367d6 0%, #2d8f47 100%)',
              boxShadow: '0 4px 12px rgba(66, 133, 244, 0.4)',
              transform: 'translateY(-1px)'
            },
            secondary: {
              background: '#f8f9fa',
              borderColor: '#3367d6',
              color: '#3367d6'
            },
            outline: {
              borderColor: '#4285f4',
              background: 'rgba(66, 133, 244, 0.05)'
            }
          }
          Object.assign(e.target.style, hoverStyles[variant])
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          const variant = e.target.getAttribute('data-variant') || 'primary'
          const baseStyles = getInlineStyles()
          Object.assign(e.target.style, baseStyles)
        }
      }}
      data-variant={variant}
    >
      {loading ? (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      ) : (
        <>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexShrink: 0 
          }}>
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
          </div>
          <span style={{ 
            whiteSpace: 'nowrap', 
            fontWeight: '600', 
            letterSpacing: '0.025em' 
          }}>
            {children}
          </span>
        </>
      )}
    </button>
  )
}

export default GoogleLoginButton
