import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { DesignSystemProvider } from './components/common/DesignSystemProvider'
import { useAuthStore } from './store/authStore'
import emailAuthService from './services/emailAuthService'
import LoginPage from './pages/LoginPage'
import MyTasksPage from './pages/MyTasksPage'
import TranslationEditorPage from './pages/TranslationEditorPage'
import TranslationEditorPageStep234 from './pages/TranslationEditorPageStep234'
import PromptReviewPage from './pages/PromptReviewPage'
import FinalSelectionPage from './pages/FinalSelectionPage'
import SubmissionPreviewPage from './pages/SubmissionPreviewPage'
import SettingsPage from './pages/SettingsPage'
import ProgressPage from './pages/ProgressPage'
import HomePage from './pages/HomePage'
import AuthCallbackPage from './pages/AuthCallbackPage'

function App() {
  const { isAuthenticated, refreshUserInfo, initializeAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  
  // 앱 초기화 시 인증 상태 동기화
  useEffect(() => {
    console.log('🚀 앱 초기화 - 인증 상태 동기화 시작')
    initializeAuth()
  }, [initializeAuth])
  
  // 다크모드 클래스 강제 제거 - 항상 라이트모드 유지
  useEffect(() => {
    // 다크모드 클래스가 있다면 제거
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark')
    }
    
    // 시스템 다크모드 설정 무시하고 라이트모드 강제 적용
    document.documentElement.style.colorScheme = 'light'
  }, [])
  
  // 로그인 시에만 사용자 정보 확인 (과도한 폴링 제거)
  useEffect(() => {
    // 중복 호출 방지를 위한 플래그
    let hasChecked = false
    
    if (isAuthenticated && location.pathname !== '/login' && !hasChecked) {
      hasChecked = true
      
      // 로그인 후 최초 1회만 사용자 정보 확인
      const checkInitialUserInfo = async () => {
        try {
          console.log('🔍 로그인 후 사용자 정보 최신 상태 확인 (1회)')
          const result = await emailAuthService.refreshUserInfo()
          
          if (!result.success && result.reason === 'user_removed') {
            alert('계정이 비활성화되었습니다. 다시 로그인해주세요.')
            navigate('/login')
            return
          }
          
          if (result.success && result.user) {
            // 🚨 무한 루프 방지: refreshUserInfo 호출 제거
            console.log('✅ 로그인 후 사용자 정보 확인 완료')
          }
          
        } catch (error) {
          console.error('❌ 로그인 후 사용자 정보 확인 실패:', error)
        }
      }
      
      // 딜레이를 두어 중복 호출 방지
      const timeoutId = setTimeout(checkInitialUserInfo, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [isAuthenticated, location.pathname, navigate])
  
  // 보호된 라우트 컴포넌트
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />
  }

  return (
    <DesignSystemProvider>
      <div>
        <Routes>
          {/* 로그인 페이지 */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* OAuth 콜백 페이지 (인증 불필요) */}
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          
          {/* 기본 화면: 로그인 상태에 따라 다른 페이지로 */}
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
          } />
          
          {/* 보호된 라우트들 */}
          <Route path="/home" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          
          <Route path="/my-tasks" element={
            <ProtectedRoute>
              <MyTasksPage />
            </ProtectedRoute>
          } />
          
          <Route path="/translation-editor" element={
            <ProtectedRoute>
              <TranslationEditorPage />
            </ProtectedRoute>
          } />
          
          <Route path="/translation-editor-step234" element={
            <ProtectedRoute>
              <TranslationEditorPageStep234 />
            </ProtectedRoute>
          } />
          
          <Route path="/prompt-review" element={
            <ProtectedRoute>
              <PromptReviewPage />
            </ProtectedRoute>
          } />
          
          <Route path="/final-selection-page" element={
            <ProtectedRoute>
              <FinalSelectionPage />
            </ProtectedRoute>
          } />
          
          <Route path="/submission-preview" element={
            <ProtectedRoute>
              <SubmissionPreviewPage />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/progress" element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          } />
          
          {/* 기본 리디렉션 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </DesignSystemProvider>
  )
}

export default App
