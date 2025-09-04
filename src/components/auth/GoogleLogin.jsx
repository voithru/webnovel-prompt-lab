import React, { useState } from 'react'
import { useAuthStore } from '@store/authStore'
import Loading from '@components/common/Loading'
import GoogleLoginButton from '@components/common/GoogleLoginButton'
import { handleUserLogin } from '@services/userCollectionService'
import styles from '@styles/modules/GoogleLogin.module.css'
import clsx from 'clsx'

const GoogleLogin = ({ onSuccess, onError, className }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [authCode, setAuthCode] = useState('')
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [authUrl, setAuthUrl] = useState('')
  const { login } = useAuthStore()

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const result = await window.electronAPI.auth.googleLogin()
      
      if (result.success) {
        setAuthUrl(result.authUrl)
        setShowCodeInput(true)
        
        // 브라우저에서 URL 열기
        if (result.authUrl) {
          await window.electronAPI.system.openExternal(result.authUrl)
        }
      } else {
        throw new Error(result.error || '로그인 초기화에 실패했습니다.')
      }
    } catch (error) {
      console.error('Google login error:', error)
      onError?.(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeSubmit = async (e) => {
    e.preventDefault()
    if (!authCode.trim()) {
      onError?.('인증 코드를 입력해주세요.')
      return
    }

    setIsLoading(true)
    try {
      const result = await window.electronAPI.auth['exchange-code'](authCode.trim())
      
      if (result.success) {
        console.log('🎉 구글 로그인 성공:', result.user)
        
        // 🔄 사용자 정보 자동 수집 (API 키 생성 포함)
        const apiKey = await handleUserLogin(result.user)
        console.log('🔑 사용자 API 키 설정 완료:', apiKey)
        
        // 사용자 정보에 API 키 추가
        const userWithApiKey = {
          ...result.user,
          apiKey: apiKey
        }
        
        // Zustand store에 사용자 정보 저장
        login(userWithApiKey)
        onSuccess?.(userWithApiKey)
      } else {
        throw new Error(result.error || '인증 코드 처리에 실패했습니다.')
      }
    } catch (error) {
      console.error('Code exchange error:', error)
      onError?.(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const resetLogin = () => {
    setShowCodeInput(false)
    setAuthCode('')
    setAuthUrl('')
  }

  if (isLoading) {
    return (
      <div className={clsx(styles.container, className)}>
        <Loading message={showCodeInput ? '인증 처리 중...' : '구글 로그인 준비 중...'} />
      </div>
    )
  }

  if (showCodeInput) {
    return (
      <div className={clsx(styles.container, className)}>
        <div className={styles.codeInputCard}>
          <h3 className={styles.title}>구글 인증 완료</h3>
          <p className={styles.instructions}>
            브라우저에서 구글 로그인을 완료한 후, 받은 인증 코드를 아래에 입력해주세요.
          </p>
          
          <form onSubmit={handleCodeSubmit} className={styles.codeForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="authCode" className={styles.label}>
                인증 코드
              </label>
              <input
                id="authCode"
                type="text"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                placeholder="여기에 인증 코드를 붙여넣어주세요"
                className={styles.codeInput}
                autoFocus
              />
            </div>
            
            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={resetLogin}
                className={clsx(styles.button, styles.secondaryButton)}
                disabled={isLoading}
              >
                다시 시도
              </button>
              <button
                type="submit"
                className={clsx(styles.button, styles.primaryButton)}
                disabled={isLoading || !authCode.trim()}
              >
                로그인 완료
              </button>
            </div>
          </form>
          
          <div className={styles.helpText}>
            <p>브라우저가 열리지 않았다면 아래 링크를 클릭하세요:</p>
            <button
              type="button"
              onClick={() => window.electronAPI.system.openExternal(authUrl)}
              className={styles.linkButton}
            >
              구글 로그인 페이지 열기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.loginCard}>
        <div className={styles.logoContainer}>
          <img 
            src="/assets/icons/google.svg" 
            alt="Google" 
            className={styles.googleLogo}
            onError={(e) => {
              // 이미지 로드 실패 시 텍스트로 대체
              e.target.style.display = 'none'
            }}
          />
        </div>
        
        <h2 className={styles.title}>구글 계정으로 로그인</h2>
        <p className={styles.description}>
          웹소설 MT 프롬프트 AI를 사용하려면 구글 계정으로 로그인해주세요.
          <br />
          Google Sheets 접근 권한이 필요합니다.
        </p>
        
        <GoogleLoginButton
          onClick={handleGoogleLogin}
          disabled={isLoading}
          loading={isLoading}
          size="large"
          variant="primary"
        >
          구글로 로그인
        </GoogleLoginButton>
        
        <div className={styles.privacy}>
          <p>
            로그인하면 
            <button className={styles.linkButton}>개인정보처리방침</button>과
            <button className={styles.linkButton}>서비스 약관</button>에 
            동의하는 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}

export default GoogleLogin
