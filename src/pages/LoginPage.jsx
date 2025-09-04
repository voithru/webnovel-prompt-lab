import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import emailAuthService from '../services/emailAuthService'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Label from '../components/common/Label'
import Loading from '../components/common/Loading'
import styles from '../styles/pages/LoginPage.module.css'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuthStore()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // 이미 인증된 경우 나의 과제 페이지로 리디렉션
    if (isAuthenticated) {
      navigate('/my-tasks')
      return
    }

    // 기존 로그인 세션 확인
    checkExistingSession()
  }, [isAuthenticated, navigate, login])

  const checkExistingSession = async () => {
    try {
      const currentUser = emailAuthService.getCurrentUser()
      
      if (currentUser && emailAuthService.isAuthenticated()) {
        console.log('🔄 기존 로그인 세션 발견:', currentUser)
        
        // Zustand store에 사용자 정보 저장
        login(currentUser)
        setUser(currentUser)
        
        // 나의 과제 페이지로 리디렉션
        navigate('/my-tasks')
      }
    } catch (error) {
      console.error('기존 세션 확인 실패:', error)
    }
  }

  // 이메일만으로 간단 로그인 (API Key는 시스템이 자동 관리)
  const handleEmailLogin = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError('이메일을 입력해주세요')
      return
    }
    
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    console.log('🔍 이메일 로그인 시도:', email)
    
    try {
      // 이메일 검증 및 바로 로그인
      const loginResult = await emailAuthService.login(email)
      
      if (loginResult.success) {
        console.log('✅ 로그인 성공:', loginResult.user)
        
        // Zustand store에 사용자 정보 저장
        login(loginResult.user)
        setUser(loginResult.user)
        setSuccess('로그인에 성공했습니다!')
        
        // 1초 후 나의 과제 페이지로 리디렉션
        setTimeout(() => {
          navigate('/my-tasks')
        }, 1000)
        
      } else {
        setError(loginResult.error || '등록되지 않은 이메일이거나 잘못된 이메일입니다.')
      }
      
    } catch (error) {
      console.error('❌ 로그인 오류:', error)
      setError(error.message || '로그인 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !error && !success) {
    return (
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <Loading />
          <p>로그인 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <h1 className={styles.title}>웹소설 번역 에디터</h1>
          <p className={styles.subtitle}>이메일로 로그인하세요</p>
        </div>

        <form onSubmit={handleEmailLogin} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <Label htmlFor="email" required>
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              disabled={isLoading}
              required
              autoFocus
            />
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {success && (
            <div className={styles.successMessage}>
              {success}
            </div>
          )}

          <div className={styles.buttonGroup}>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isLoading}
              className={styles.loginButton}
            >
              {isLoading ? (
                <>
                  <Loading size="small" />
                  로그인 중...
                </>
              ) : (
                '로그인'
              )}
            </Button>
          </div>
        </form>

        <div className={styles.helpText}>
          <p>관리자로부터 등록된 이메일로만 로그인할 수 있습니다.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage