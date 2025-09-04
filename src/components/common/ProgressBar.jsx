import React from 'react'
import styles from '@styles/components/ProgressBar.module.css'
import clsx from 'clsx'

const ProgressBar = ({ 
  currentStep, 
  totalSteps, 
  progress = {}, 
  className,
  showLabels = false,
  size = 'medium'
}) => {
  const calculateOverallProgress = () => {
    if (!currentStep || !totalSteps) return 0
    
    // 기본적으로는 현재 단계 기준으로 계산
    const baseProgress = ((currentStep - 1) / totalSteps) * 100
    
    // 현재 단계 내에서의 진행률이 있다면 추가
    const currentStepProgress = progress[`step${currentStep}`] || 0
    const stepContribution = (currentStepProgress / 100) * (1 / totalSteps) * 100
    
    return Math.min(100, baseProgress + stepContribution)
  }

  const overallProgress = calculateOverallProgress()

  const getStepStatus = (stepNumber) => {
    if (stepNumber < currentStep) return 'completed'
    if (stepNumber === currentStep) return 'current'
    return 'pending'
  }

  const getStepProgress = (stepNumber) => {
    if (stepNumber < currentStep) return 100
    if (stepNumber === currentStep) return progress[`step${stepNumber}`] || 0
    return 0
  }

  return (
    <div className={clsx(styles.container, styles[size], className)}>
      {/* Overall Progress Bar */}
      <div className={styles.overallProgress}>
        <div className={styles.progressTrack}>
          <div 
            className={styles.progressFill}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        
        {showLabels && (
          <div className={styles.progressLabel}>
            {Math.round(overallProgress)}% 완료
          </div>
        )}
      </div>

      {/* Step Indicators */}
      <div className={styles.stepIndicators}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1
          const status = getStepStatus(stepNumber)
          const stepProgress = getStepProgress(stepNumber)
          
          return (
            <div
              key={stepNumber}
              className={clsx(styles.stepIndicator, styles[status])}
              title={`Step ${stepNumber}: ${status}`}
            >
              <div className={styles.stepCircle}>
                <div className={styles.stepNumber}>
                  {status === 'completed' ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6L4.5 8L9.5 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                
                {status === 'current' && stepProgress > 0 && (
                  <div className={styles.stepProgressRing}>
                    <svg
                      className={styles.progressRing}
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                    >
                      <circle
                        className={styles.progressRingBackground}
                        cx="16"
                        cy="16"
                        r="14"
                        strokeWidth="2"
                      />
                      <circle
                        className={styles.progressRingProgress}
                        cx="16"
                        cy="16"
                        r="14"
                        strokeWidth="2"
                        strokeDasharray={87.96} // 2 * π * 14 = 87.96
                        strokeDashoffset={87.96 - (87.96 * stepProgress) / 100}
                      />
                    </svg>
                  </div>
                )}
              </div>
              
              {showLabels && (
                <div className={styles.stepLabel}>
                  Step {stepNumber}
                </div>
              )}
              
              {/* Connection Line */}
              {stepNumber < totalSteps && (
                <div
                  className={clsx(styles.connectionLine, {
                    [styles.completed]: stepNumber < currentStep
                  })}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Detailed Progress Info */}
      {size === 'large' && (
        <div className={styles.detailedInfo}>
          <div className={styles.currentStepInfo}>
            <span className={styles.currentStepLabel}>
              현재 단계: Step {currentStep}
            </span>
            {progress[`step${currentStep}`] !== undefined && (
              <span className={styles.currentStepProgress}>
                ({progress[`step${currentStep}`]}% 완료)
              </span>
            )}
          </div>
          
          {progress.timeRemaining && (
            <div className={styles.timeInfo}>
              예상 남은 시간: {progress.timeRemaining}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// 간단한 프로그레스 바 변형
export const SimpleProgressBar = ({ 
  value, 
  max = 100, 
  className, 
  showValue = false,
  color = 'primary'
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  return (
    <div className={clsx(styles.simpleContainer, className)}>
      <div className={clsx(styles.simpleTrack, styles[color])}>
        <div 
          className={styles.simpleFill}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <span className={styles.simpleValue}>
          {value} / {max}
        </span>
      )}
    </div>
  )
}

// 원형 프로그레스 변형
export const CircularProgress = ({ 
  value, 
  max = 100, 
  size = 60, 
  strokeWidth = 4,
  className,
  showValue = true
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  
  return (
    <div className={clsx(styles.circularContainer, className)} style={{ width: size, height: size }}>
      <svg
        className={styles.circularSvg}
        width={size}
        height={size}
      >
        <circle
          className={styles.circularBackground}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className={styles.circularProgress}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      {showValue && (
        <div className={styles.circularValue}>
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  )
}

export default ProgressBar
