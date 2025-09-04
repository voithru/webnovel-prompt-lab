import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../common/Sidebar'
import { useAuthStore } from '../../store/authStore'
import emailAuthService from '../../services/emailAuthService'
import styles from '../../styles/layout/AppLayout.module.css'

const AppLayout = ({ children, currentPage = 'home', variant = 'withHeader' }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  
  // 로그인된 사용자 정보 가져오기
  const getCurrentUserInfo = () => {
    const currentUser = emailAuthService.getCurrentUser()
    if (currentUser && currentUser.email) {
      return {
        name: currentUser.email.split('@')[0], // 이메일의 @ 앞부분을 이름으로 사용
        email: currentUser.email,
        avatar: null
      }
    }
    
    // 폴백: AuthStore의 사용자 정보 사용
    if (user && user.email) {
      return {
        name: user.email.split('@')[0],
        email: user.email,
        avatar: null
      }
    }
    
    // 기본값
    return {
      name: 'Guest',
      email: 'guest@example.com',
      avatar: null
    }
  }
  
  const userInfo = getCurrentUserInfo()

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      console.log('🚪 로그아웃 시작')
      
      // 로컬 스토리지 정리
      emailAuthService.logout()
      
      // Zustand store 정리
      logout()
      
      console.log('✅ 로그아웃 완료')
      
      // 로그인 페이지로 리디렉션
      navigate('/login')
      
    } catch (error) {
      console.error('❌ 로그아웃 중 오류:', error)
      // 오류가 발생해도 로그인 페이지로 이동
      navigate('/login')
    }
  }

  // 네비게이션 핸들러 (진행 중인 작업 저장 후 이동)
  const handleNavigation = async (itemId, subItemId) => {
    console.log('🧭 네비게이션 요청:', { itemId, subItemId })

    try {
      // 현재 페이지에서 진행 중인 작업이 있는지 확인
      const currentPath = window.location.pathname
      const isEditingTask = currentPath.includes('/translation-editor')
      const isSubmissionPreview = currentPath.includes('/submission-preview')

      // 제출 미리보기 페이지인 경우 제출 상태 확인
      if (isSubmissionPreview) {
        // URL에서 taskId 추출
        const urlParams = new URLSearchParams(window.location.search)
        const taskId = urlParams.get('taskId')
        
        if (taskId) {
          const taskStatus = localStorage.getItem(`taskProgress_${taskId}`)
          const submissionData = localStorage.getItem(`submission_${taskId}`)
          
          // 이미 제출 완료된 경우에는 알림 없이 바로 이동
          if (taskStatus === '제출 완료' || submissionData) {
            console.log('✅ 제출 완료된 과제 - 알림 없이 바로 이동')
            // 바로 네비게이션 실행으로 넘어감
          } else {
            // 아직 제출되지 않은 경우에만 알림 표시
            const shouldSave = window.confirm('현재 진행 중인 작업이 있습니다.\n\n작업을 임시 저장하고 이동하시겠습니까?')
            
            if (!shouldSave) {
              console.log('❌ 사용자가 이동 취소')
              return
            }
          }
        }
      } else if (isEditingTask) {
        // 번역 에디터 페이지인 경우 기존 로직 유지
        const shouldSave = window.confirm('현재 진행 중인 작업이 있습니다.\n\n작업을 임시 저장하고 이동하시겠습니까?')
        
        if (shouldSave) {
          console.log('💾 진행 중인 작업 임시 저장 중...')
          
          // 현재 페이지의 임시 저장 함수 호출
          if (window.saveCurrentWork && typeof window.saveCurrentWork === 'function') {
            await window.saveCurrentWork()
            console.log('✅ 작업 임시 저장 완료')
          } else {
            console.log('⚠️ 임시 저장 함수를 찾을 수 없음')
          }
        } else {
          console.log('❌ 사용자가 이동 취소')
          return
        }
      }

      // 네비게이션 실행
      if (itemId === 'home') {
        console.log('🏠 홈 페이지로 이동')
        navigate('/home')
      } else if (itemId === 'translation' && subItemId === 'my-tasks') {
        console.log('📋 나의 과제 페이지로 이동')
        navigate('/my-tasks')
      } else if (itemId === 'translation' && subItemId === 'progress') {
        console.log('📊 진행 현황 페이지로 이동')
        navigate('/progress')
      } else if (itemId === 'settings') {
        console.log('⚙️ 설정 페이지로 이동')
        navigate('/settings')
      } else {
        console.log(`🔍 알 수 없는 네비게이션: ${itemId}/${subItemId}`)
      }

    } catch (error) {
      console.error('❌ 네비게이션 중 오류:', error)
      // 오류가 발생해도 이동 시도
      if (itemId === 'home') {
        navigate('/home')
      } else if (itemId === 'translation' && subItemId === 'my-tasks') {
        navigate('/my-tasks')
      } else if (itemId === 'translation' && subItemId === 'progress') {
        navigate('/progress')
      } else if (itemId === 'settings') {
        navigate('/settings')
      }
    }
  }

  // 사이드바 너비를 CSS 변수로 설정
  const sidebarWidth = sidebarExpanded ? 288 : 80 // 축소 시 80px, 확장 시 288px

  return (
    <div 
      className={styles.appContainer}
      style={{
        '--sidebar-width': `${sidebarWidth}px`
      }}
    >
      {/* 상단 고정 헤더 - 현재 사용하지 않음 (주석 처리) */}
      {/* {variant === 'withHeader' && (
        <header className={styles.topHeader}>
          <div className={styles.headerContent}>
            <div className={styles.breadcrumbs}>
              <span>웹소설MT 프롬프트AI</span>
              <span className={styles.separator}>/</span>
              <span className={styles.currentPage}>{currentPage}</span>
            </div>
            
            <div className={styles.userSection}>
              <button className={styles.notificationButton}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <div className={styles.userProfile}>
                <div className={styles.userAvatar}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className={styles.userName}>{userInfo.name}</span>
              </div>
            </div>
          </div>
        </header>
      )} */}

      <div className={styles.mainLayout}>
        {/* 왼쪽 사이드바 */}
        <Sidebar 
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded(!sidebarExpanded)}
          user={userInfo}
          onLogout={handleLogout}
          onNavigate={handleNavigation}
          currentPage={currentPage}
        />
        {/* 사이드바 디버깅용 주석 */}

        {/* 메인 콘텐츠 영역 - 헤더 없는 상태로 기본 설정 */}
        <main className={`${styles.mainContent} ${styles.mainContentWithoutHeader}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout
