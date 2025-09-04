import React, { useState } from 'react'
import { useAuthStore } from '@store/authStore'
import { useUserStore } from '@store/userStore'
import Loading from '@components/common/Loading'
import styles from '@styles/components/UserProfile.module.css'
import clsx from 'clsx'

const UserProfile = ({ showDropdown = true, className }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { user, logout } = useAuthStore()
  const { clearData } = useUserStore()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      // Zustand store 데이터 정리
      clearData()
      
      // Electron에서 인증 정보 정리
      const result = await window.electronAPI.auth.logout()
      if (result.success) {
        logout()
      } else {
        // 에러가 있어도 로컬 상태는 정리
        logout()
      }
    } catch (error) {
      console.error('Logout error:', error)
      // 에러가 있어도 로컬 상태는 정리
      logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleExportData = async () => {
    try {
      const result = await window.electronAPI.user.exportData('all')
      if (result.success) {
        // 성공 알림 (toast 등으로 대체 가능)
        alert(`데이터가 성공적으로 내보내졌습니다: ${result.filePath}`)
      } else {
        alert(`데이터 내보내기 실패: ${result.error}`)
      }
    } catch (error) {
      console.error('Export data error:', error)
      alert('데이터 내보내기 중 오류가 발생했습니다.')
    }
    setIsDropdownOpen(false)
  }

  const handleOpenSettings = () => {
    // TODO: 설정 모달이나 페이지 열기
    console.log('Open settings')
    setIsDropdownOpen(false)
  }

  if (isLoggingOut) {
    return (
      <div className={clsx(styles.container, className)}>
        <Loading size="small" message="로그아웃 중..." />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.profileWrapper}>
        <button
          onClick={() => showDropdown && setIsDropdownOpen(!isDropdownOpen)}
          className={clsx(styles.profileButton, {
            [styles.clickable]: showDropdown,
            [styles.active]: isDropdownOpen
          })}
          title={user.name}
        >
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className={styles.avatar}
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          ) : (
            <div className={styles.avatarFallback}>
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.name}</span>
            <span className={styles.userEmail}>{user.email}</span>
          </div>
          
          {showDropdown && (
            <svg
              className={clsx(styles.dropdownIcon, {
                [styles.rotated]: isDropdownOpen
              })}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {showDropdown && isDropdownOpen && (
          <div className={styles.dropdown}>
            <div className={styles.dropdownHeader}>
              <div className={styles.userDetails}>
                <p className={styles.fullName}>{user.name}</p>
                <p className={styles.email}>{user.email}</p>
                {user.loginTime && (
                  <p className={styles.loginTime}>
                    로그인: {new Date(user.loginTime).toLocaleString('ko-KR')}
                  </p>
                )}
              </div>
            </div>
            
            <div className={styles.dropdownDivider} />
            
            <div className={styles.dropdownMenu}>
              <button
                onClick={handleOpenSettings}
                className={styles.menuItem}
              >
                <svg className={styles.menuIcon} width="16" height="16" viewBox="0 0 16 16">
                  <path
                    d="M8 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M14.5 8a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
                설정
              </button>
              
              <button
                onClick={handleExportData}
                className={styles.menuItem}
              >
                <svg className={styles.menuIcon} width="16" height="16" viewBox="0 0 16 16">
                  <path
                    d="M14 10v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4M12 6l-4-4-4 4M8 2v10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
                데이터 내보내기
              </button>
              
              <div className={styles.dropdownDivider} />
              
              <button
                onClick={handleLogout}
                className={clsx(styles.menuItem, styles.dangerItem)}
              >
                <svg className={styles.menuIcon} width="16" height="16" viewBox="0 0 16 16">
                  <path
                    d="M6 14H4a2 2 0 01-2-2V4a2 2 0 012-2h2M12 10l4-4-4-4M16 6H6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
                로그아웃
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay to close dropdown */}
      {showDropdown && isDropdownOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  )
}

export default UserProfile
