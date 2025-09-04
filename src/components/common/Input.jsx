import React from 'react'
import styles from '../../styles/modules/Input.module.css'
import clsx from 'clsx'

const Input = ({
  type = 'text',
  variant = 'default',
  size = 'medium',
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  readOnly = false,
  required = false,
  helperText,
  error,
  success,
  warning,
  info,
  leftIcon,
  rightIcon,
  leftAddon,
  rightAddon,
  leftButton,
  rightButton,
  leftDropdown,
  rightDropdown,
  clearable = false,
  onClear,
  className,
  fullWidth = false,
  multiline = false,
  rows = 3,
  ...props
}) => {
  const getStatusClass = () => {
    if (error) return styles.error
    if (success) return styles.success
    if (warning) return styles.warning
    if (info) return styles.info
    return ''
  }

  const getStatusIcon = () => {
    if (error) {
      return (
        <svg className={styles.statusIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-6 6M9 9l6 6" />
        </svg>
      )
    }
    if (success) {
      return (
        <svg className={styles.statusIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      )
    }
    if (warning) {
      return (
        <svg className={styles.statusIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      )
    }
    if (info) {
      return (
        <svg className={styles.statusIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      )
    }
    return null
  }

  const renderIcon = (icon, position) => {
    if (!icon) return null
    
    const iconClass = clsx(
      styles.icon,
      styles[`icon${position}`]
    )
    
    return (
      <span className={iconClass}>
        {icon}
      </span>
    )
  }

  const renderAddon = (addon, position) => {
    if (!addon) return null
    
    const addonClass = clsx(
      styles.addon,
      styles[`addon${position}`]
    )
    
    return (
      <span className={addonClass}>
        {addon}
      </span>
    )
  }

  const renderButton = (button, position) => {
    if (!button) return null
    
    const buttonClass = clsx(
      styles.inputButton,
      styles[`inputButton${position}`]
    )
    
    return (
      <button 
        type="button" 
        className={buttonClass}
        onClick={button.onClick}
        disabled={disabled}
      >
        {button.icon && <span className={styles.buttonIcon}>{button.icon}</span>}
        {button.text}
      </button>
    )
  }

  const renderDropdown = (dropdown, position) => {
    if (!dropdown) return null
    
    const dropdownClass = clsx(
      styles.dropdown,
      styles[`dropdown${position}`]
    )
    
    return (
      <button 
        type="button" 
        className={dropdownClass}
        onClick={dropdown.onClick}
        disabled={disabled}
      >
        {dropdown.icon && <span className={styles.dropdownIcon}>{dropdown.icon}</span>}
        {dropdown.text}
        <svg className={styles.chevronIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    )
  }

  const renderClearButton = () => {
    if (!clearable || !value) return null
    
    return (
      <button 
        type="button"
        className={styles.clearButton}
        onClick={onClear}
        aria-label="Clear input"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    )
  }

  const renderInput = () => {
    const inputClasses = clsx(
      styles.input,
      styles[size],
      getStatusClass(),
      {
        [styles.disabled]: disabled,
        [styles.readOnly]: readOnly,
        [styles.fullWidth]: fullWidth,
        [styles.hasLeftIcon]: leftIcon,
        [styles.hasRightIcon]: rightIcon,
        [styles.hasLeftAddon]: leftAddon,
        [styles.hasRightAddon]: rightAddon,
        [styles.hasLeftButton]: leftButton,
        [styles.hasRightButton]: rightButton,
        [styles.hasLeftDropdown]: leftDropdown,
        [styles.hasRightDropdown]: rightDropdown
      }
    )

    if (multiline) {
      return (
        <textarea
          className={inputClasses}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          rows={rows}
          {...props}
        />
      )
    }

    return (
      <input
        type={type}
        className={inputClasses}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        {...props}
      />
    )
  }

  return (
    <div className={clsx(styles.container, className)}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
          {info && (
            <span className={styles.infoIcon} title={info}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </span>
          )}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        {renderDropdown(leftDropdown, 'Left')}
        {renderAddon(leftAddon, 'Left')}
        {renderButton(leftButton, 'Left')}
        {renderIcon(leftIcon, 'Left')}
        
        {renderInput()}
        
        {renderIcon(rightIcon, 'Right')}
        {renderButton(rightButton, 'Right')}
        {renderAddon(rightAddon, 'Right')}
        {renderDropdown(rightDropdown, 'Right')}
        {renderClearButton()}
        {getStatusIcon()}
      </div>
      
      {(helperText || error || success || warning || info) && (
        <div className={clsx(styles.helperText, getStatusClass())}>
          {helperText || error || success || warning || info}
        </div>
      )}
    </div>
  )
}

export default Input
