import React, { useState } from 'react'
import Alert from './Alert'
import styles from '../../styles/modules/AlertDemo.module.css'

const AlertDemo = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, variant: 'success', message: 'Success message', visible: true },
    { id: 2, variant: 'error', message: 'Error message', visible: true },
    { id: 3, variant: 'warning', message: 'Warning message', visible: true },
    { id: 4, variant: 'info', message: 'Info message', visible: true },
    { id: 5, variant: 'neutral', message: 'Neutral message', visible: true }
  ])

  const handleClose = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, visible: false } : alert
    ))
  }

  const resetAlerts = () => {
    setAlerts(alerts.map(alert => ({ ...alert, visible: true })))
  }

  const addAlert = (variant) => {
    const newAlert = {
      id: Date.now(),
      variant,
      message: `New ${variant} alert added!`,
      visible: true
    }
    setAlerts([...alerts, newAlert])
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Alert Component Demo</h1>
        <p className={styles.description}>
          다양한 Alert 컴포넌트의 사용 예시를 확인할 수 있습니다.
        </p>
      </div>

      <div className={styles.controls}>
        <button 
          onClick={resetAlerts}
          className={styles.resetButton}
        >
          모든 Alert 초기화
        </button>
        
        <div className={styles.addButtons}>
          <span className={styles.addLabel}>새 Alert 추가:</span>
          <button 
            onClick={() => addAlert('success')}
            className={`${styles.addButton} ${styles.success}`}
          >
            Success
          </button>
          <button 
            onClick={() => addAlert('error')}
            className={`${styles.addButton} ${styles.error}`}
          >
            Error
          </button>
          <button 
            onClick={() => addAlert('warning')}
            className={`${styles.addButton} ${styles.warning}`}
          >
            Warning
          </button>
          <button 
            onClick={() => addAlert('info')}
            className={`${styles.addButton} ${styles.info}`}
          >
            Info
          </button>
          <button 
            onClick={() => addAlert('neutral')}
            className={`${styles.addButton} ${styles.neutral}`}
          >
            Neutral
          </button>
        </div>
      </div>

      <div className={styles.examples}>
        <div className={styles.exampleSection}>
          <h2 className={styles.sectionTitle}>기본 Alert 예시</h2>
          <div className={styles.alertGrid}>
            <Alert variant="success" showClose={true} onClose={() => {}}>
              Great job! You've acknowledged this significant alert message.
            </Alert>
            <Alert variant="error" showClose={true} onClose={() => {}}>
              Great job! You've acknowledged this significant alert message.
            </Alert>
            <Alert variant="warning" showClose={true} onClose={() => {}}>
              Great job! You've acknowledged this significant alert message.
            </Alert>
            <Alert variant="info" showClose={true} onClose={() => {}}>
              Great job! You've acknowledged this significant alert message.
            </Alert>
            <Alert variant="neutral" showClose={true} onClose={() => {}}>
              Great job! You've acknowledged this significant alert message.
            </Alert>
          </div>
        </div>

        <div className={styles.exampleSection}>
          <h2 className={styles.sectionTitle}>상세 Alert 예시</h2>
          <div className={styles.alertGrid}>
            <Alert 
              variant="success" 
              type="detailed"
              title="Alert heading"
              buttonText="Learn more"
              onButtonClick={() => {}}
              showClose={true}
              onClose={() => {}}
            >
              Great job! You've acknowledged this significant alert message. We're adding extra text to illustrate how longer notifications are displayed.
            </Alert>
            <Alert 
              variant="error" 
              type="detailed"
              title="Alert heading"
              buttonText="Learn more"
              onButtonClick={() => {}}
              showClose={true}
              onClose={() => {}}
            >
              Great job! You've acknowledged this significant alert message. We're adding extra text to illustrate how longer notifications are displayed.
            </Alert>
          </div>
        </div>

        <div className={styles.exampleSection}>
          <h2 className={styles.sectionTitle}>특수 기능 Alert 예시</h2>
          <div className={styles.alertGrid}>
            <Alert variant="success" showNewTag={true} showArrow={true}>
              Great job! You've acknowledged this significant alert message.
            </Alert>
            <Alert variant="info" showNewTag={true} showArrow={true}>
              Great job! You've acknowledged this significant alert message.
            </Alert>
          </div>
        </div>

        <div className={styles.exampleSection}>
          <h2 className={styles.sectionTitle}>동적 Alert 관리</h2>
          <div className={styles.dynamicAlerts}>
            {alerts.map(alert => 
              alert.visible && (
                <Alert
                  key={alert.id}
                  variant={alert.variant}
                  showClose={true}
                  onClose={() => handleClose(alert.id)}
                >
                  {alert.message}
                </Alert>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertDemo
