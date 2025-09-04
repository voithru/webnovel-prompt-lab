import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import styles from '../styles/pages/HomePage.module.css'

const HomePage = () => {
  return (
    <AppLayout currentPage="홈" variant="withoutHeader">
      <div className={styles.container}>
        <div className={styles.content}>
          {/* 메인 아이콘 */}
          <div className={styles.iconContainer}>
            <div className={styles.mainIcon}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
            </div>
          </div>

          {/* 메인 메시지 */}
          <div className={styles.messageContainer}>
            <h1 className={styles.title}>업데이트 예정</h1>
            <div className={styles.comingSoon}>
              <span className={styles.comingSoonBadge}>Coming Soon</span>
            </div>
          </div>


        </div>
      </div>
    </AppLayout>
  )
}

export default HomePage
