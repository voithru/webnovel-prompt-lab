import React from 'react'
import clsx from 'clsx'
import styles from '../../styles/modules/Helper.module.css'

const Helper = ({
  children,
  variant = 'default',
  size = 'medium',
  icon,
  className,
  ...props
}) => {
  const helperClasses = clsx(
    styles.helper,
    styles[variant],
    styles[size],
    {
      [styles.hasIcon]: icon
    },
    className
  )

  if (!children) return null

  return (
    <div className={helperClasses} {...props}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.text}>{children}</span>
    </div>
  )
}

// Icon components for different states
const InfoIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

const CheckIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20,6 9,17 4,12" />
  </svg>
)

const AlertIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const XIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// Preset helpers with icons
Helper.Info = ({ children, ...props }) => (
  <Helper variant="info" icon={<InfoIcon />} {...props}>
    {children}
  </Helper>
)

Helper.Success = ({ children, ...props }) => (
  <Helper variant="success" icon={<CheckIcon />} {...props}>
    {children}
  </Helper>
)

Helper.Warning = ({ children, ...props }) => (
  <Helper variant="warning" icon={<AlertIcon />} {...props}>
    {children}
  </Helper>
)

Helper.Error = ({ children, ...props }) => (
  <Helper variant="error" icon={<XIcon />} {...props}>
    {children}
  </Helper>
)

export default Helper
