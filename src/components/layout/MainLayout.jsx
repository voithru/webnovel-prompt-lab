import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../common/Sidebar'
import MyTasks from '../task/MyTasks'
import { useAuthStore } from '../../store/authStore'
import emailAuthService from '../../services/emailAuthService'
import styles from '../../styles/modules/MainLayout.module.css'

const MainLayout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

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

  return (
    <div className={styles.layout}>
      <Sidebar 
        expanded={sidebarExpanded}
        onToggle={toggleSidebar}
        onLogout={handleLogout}
      />
      <main className={`${styles.mainContent} ${!sidebarExpanded ? styles.sidebarCollapsed : ''}`}>
        <MyTasks />
      </main>
    </div>
  )
}

export default MainLayout
