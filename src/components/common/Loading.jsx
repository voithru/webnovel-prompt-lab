import React from 'react'
import styles from '@styles/modules/Loading.module.css'
import clsx from 'clsx'

const Loading = ({ 
  message = '로딩 중...', 
  size = 'medium', 
  className,
  showSpinner = true,
  centered = true 
}) => {
  return (
    <div className={clsx(
      styles.container,
      styles[size],
      { [styles.centered]: centered },
      className
    )}>
      {showSpinner && (
        <div className={styles.spinner}>
          <div className={styles.spinnerInner} />
        </div>
      )}
      
      {message && (
        <p className={styles.message}>
          {message}
        </p>
      )}
    </div>
  )
}

// 다양한 사이즈 옵션
export const LoadingSpinner = ({ size = 'medium', className }) => (
  <div className={clsx(styles.spinnerOnly, styles[size], className)}>
    <div className={styles.spinner}>
      <div className={styles.spinnerInner} />
    </div>
  </div>
)

// 인라인 로딩 (텍스트와 함께)
export const InlineLoading = ({ message = '로딩 중...', className }) => (
  <span className={clsx(styles.inlineContainer, className)}>
    <LoadingSpinner size="small" />
    <span className={styles.inlineMessage}>{message}</span>
  </span>
)

export default Loading
