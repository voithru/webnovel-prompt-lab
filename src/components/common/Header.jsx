import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useWorkflowStore } from '@store/workflowStore'
import UserProfile from '@components/auth/UserProfile'
import ProgressBar from './ProgressBar'
import styles from '@styles/components/Header.module.css'
import clsx from 'clsx'

const STEP_INFO = {
  '/step1': { title: 'Step 1: 자동 번역', step: 1, total: 5 },
  '/step2': { title: 'Step 2: 프롬프트 개선', step: 2, total: 5 },
  '/step3': { title: 'Step 3: 프롬프트 평가', step: 3, total: 5 },
  '/step4': { title: 'Step 4: 최종 선택', step: 4, total: 5 },
  '/step5': { title: 'Step 5: 연구 리포트', step: 5, total: 5 },
}

const Header = ({ className }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentTask, progress } = useWorkflowStore()
  
  // 현재 경로에서 스텝 정보 추출
  const currentPath = location.pathname.split('/')[1] ? '/' + location.pathname.split('/')[1] : '/step1'
  const currentStepInfo = STEP_INFO[currentPath] || STEP_INFO['/step1']
  
  const handleLogoClick = () => {
    navigate('/step1')
  }

  const handleStepNavigation = (step) => {
    if (step === 1) {
      navigate('/step1')
    } else if (currentTask?.id) {
      navigate(`/step${step}/${currentTask.id}`)
    }
  }

  return (
    <header className={clsx(styles.header, className)}>
      <div className={styles.container}>
        {/* Logo and Title */}
        <div className={styles.leftSection}>
          <button
            onClick={handleLogoClick}
            className={styles.logoButton}
            title="홈으로 이동"
          >
            <div className={styles.logo}>
              <span className={styles.logoIcon}>📚</span>
              <span className={styles.logoText}>웹소설 MT</span>
            </div>
          </button>

          {/* Current Step Info */}
          <div className={styles.stepInfo}>
            <h1 className={styles.stepTitle}>
              {currentStepInfo.title}
            </h1>
            {currentTask && (
              <p className={styles.taskInfo}>
                과제: {currentTask.title || currentTask.id}
              </p>
            )}
          </div>
        </div>

        {/* Progress and Navigation */}
        <div className={styles.centerSection}>
          <div className={styles.progressSection}>
            <ProgressBar
              currentStep={currentStepInfo.step}
              totalSteps={currentStepInfo.total}
              progress={progress}
            />
            
            {/* Step Navigation */}
            <div className={styles.stepNavigation}>
              {[1, 2, 3, 4, 5].map((step) => {
                const isActive = step === currentStepInfo.step
                const isCompleted = step < currentStepInfo.step
                const isClickable = step === 1 || (currentTask?.id && step <= currentStepInfo.step + 1)
                
                return (
                  <button
                    key={step}
                    onClick={() => isClickable && handleStepNavigation(step)}
                    className={clsx(styles.stepButton, {
                      [styles.active]: isActive,
                      [styles.completed]: isCompleted,
                      [styles.clickable]: isClickable
                    })}
                    disabled={!isClickable}
                    title={`Step ${step}로 이동`}
                  >
                    {step}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className={styles.rightSection}>
          {/* Additional Actions */}
          <div className={styles.actions}>
            <button
              className={styles.actionButton}
              title="도움말"
              onClick={() => {
                // TODO: 도움말 모달 열기
                console.log('Open help')
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="10"
                  cy="15"
                  r="1"
                  fill="currentColor"
                />
                <path
                  d="M8 8c0-1.1.9-2 2-2s2 .9 2 2c0 .8-.4 1.3-.8 1.6-.5.4-.7.6-.7 1.4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Task Status Indicator */}
            {currentTask && (
              <div
                className={clsx(styles.statusIndicator, {
                  [styles.inProgress]: currentTask.status === 'in_progress',
                  [styles.completed]: currentTask.status === 'completed',
                  [styles.pending]: currentTask.status === 'pending'
                })}
                title={`과제 상태: ${currentTask.status}`}
              >
                <div className={styles.statusDot} />
              </div>
            )}
          </div>

          {/* User Profile */}
          <UserProfile />
        </div>
      </div>
    </header>
  )
}

export default Header
