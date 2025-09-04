import React from 'react'
import styles from '../../styles/modules/Alert.module.css'
import clsx from 'clsx'
import Button from './Button'

const Alert = ({
  variant = 'info',
  type = 'simple',
  title,
  children,
  onClose,
  showClose = true,
  showNewTag = false,
  showArrow = false,
  buttonText,
  onButtonClick,
  className,
  ...props
}) => {
  const variantClass = styles[variant]
  const typeClass = styles[type]
  
  const renderIcon = () => {
    switch (variant) {
      case 'success':
        return (
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        )
      case 'error':
      case 'warning':
        return (
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 9v2m0 4h.01" />
          </svg>
        )
      case 'info':
      default:
        return (
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        )
    }
  }

  const renderNewTag = () => {
    if (!showNewTag) return null
    return (
      <span className={styles.newTag}>
        New
      </span>
    )
  }

  const renderArrow = () => {
    if (!showArrow) return null
    return (
      <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18l6-6-6-6" />
      </svg>
    )
  }

  const renderButton = () => {
    if (!buttonText) return null
    
    // Map Alert variant to Button variant
    const getButtonVariant = () => {
      switch (variant) {
        case 'success': return 'green'
        case 'error': return 'red'
        case 'warning': return 'orange'
        case 'info': return 'blue'
        case 'neutral': return 'dark'
        default: return 'blue'
      }
    }
    
    return (
      <Button 
        variant={getButtonVariant()}
        size="small"
        style="solid"
        onClick={onButtonClick}
        type="button"
      >
        {buttonText}
        <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 12h8M12 8l4 4-4 4" />
        </svg>
      </Button>
    )
  }

  return (
    <div 
      className={clsx(
        styles.alert,
        variantClass,
        typeClass,
        className
      )}
      {...props}
    >
      <div className={styles.content}>
        {renderIcon()}
        
        <div className={styles.textContent}>
          {renderNewTag()}
          
          <div className={styles.textWrapper}>
            {title && <h4 className={styles.title}>{title}</h4>}
            <p className={styles.message}>{children}</p>
          </div>
          
          {renderArrow()}
        </div>
      </div>
      
      {renderButton()}
      
      {showClose && onClose && (
        <button 
          className={styles.closeButton}
          onClick={onClose}
          type="button"
          aria-label="Close alert"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default Alert
