import React from 'react'
import styles from '../../styles/modules/Button.module.css'
import clsx from 'clsx'

const Button = ({
  variant = 'blue',
  size = 'medium',
  style = 'solid',
  children,
  leftIcon,
  rightIcon,
  iconOnly,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className,
  ...props
}) => {
  const variantClass = styles[variant]
  const sizeClass = styles[size]
  const styleClass = styles[style]
  
  const buttonClasses = clsx(
    styles.button,
    variantClass,
    sizeClass,
    styleClass,
    {
      [styles.iconOnly]: iconOnly,
      [styles.fullWidth]: fullWidth,
      [styles.disabled]: disabled
    },
    className
  )

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

  const renderContent = () => {
    if (iconOnly) {
      return (
        <span className={styles.iconOnlyContent}>
          {leftIcon || rightIcon || children}
        </span>
      )
    }

    return (
      <>
        {renderIcon(leftIcon, 'Left')}
        <span className={styles.text}>{children}</span>
        {renderIcon(rightIcon, 'Right')}
      </>
    )
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {renderContent()}
    </button>
  )
}

export default Button
