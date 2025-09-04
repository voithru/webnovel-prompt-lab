import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import googleDriveAuthService from '../services/googleDriveAuthService'

const AuthCallbackPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('처리 중...')
  const hasProcessed = useRef(false) // 중복 실행 방지

  useEffect(() => {
    const handleAuthCallback = async () => {
      // 이미 처리했으면 중단
      if (hasProcessed.current) {
        console.log('⏭️ 이미 처리된 콜백, 건너뜀')
        return
      }
      hasProcessed.current = true
      try {
        // URL에서 인증 코드 가져오기
        const authCode = searchParams.get('code')
        const error = searchParams.get('error')

        if (error) {
          console.error('OAuth 인증 오류:', error)
          setStatus('인증이 취소되었습니다.')
          setTimeout(() => {
            navigate('/submission-preview', { replace: true })
          }, 2000)
          return
        }

        if (!authCode) {
          console.error('인증 코드가 없습니다')
          setStatus('인증 코드를 받지 못했습니다.')
          setTimeout(() => {
            navigate('/submission-preview', { replace: true })
          }, 2000)
          return
        }

        console.log('🔑 인증 코드 받음, 토큰 교환 시작')
        setStatus('Google Drive 인증 처리 중...')

        // 인증 코드를 액세스 토큰으로 교환
        const result = await googleDriveAuthService.exchangeCodeForTokens(authCode)

        if (result.success) {
          console.log('✅ Google Drive 인증 완료')
          setStatus('Google Drive 인증이 완료되었습니다!')
          
          // 성공 메시지 표시 후 제출 페이지로 돌아가기
          setTimeout(() => {
            navigate('/submission-preview', { replace: true })
          }, 1500)
        } else {
          console.error('❌ 토큰 교환 실패:', result.error)
          setStatus(`인증 처리 중 오류가 발생했습니다: ${result.error}`)
          setTimeout(() => {
            navigate('/submission-preview', { replace: true })
          }, 3000)
        }

      } catch (error) {
        console.error('❌ 인증 콜백 처리 중 오류:', error)
        setStatus(`인증 처리 중 오류가 발생했습니다: ${error.message}`)
        setTimeout(() => {
          navigate('/submission-preview', { replace: true })
        }, 3000)
      }
    }

    handleAuthCallback()
  }, [searchParams, navigate])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '40px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        
        <h2 style={{
          margin: '0 0 16px',
          color: '#333',
          fontSize: '24px'
        }}>
          Google Drive 인증
        </h2>
        
        <p style={{
          margin: '0',
          color: '#666',
          fontSize: '16px',
          lineHeight: '1.5'
        }}>
          {status}
        </p>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}

export default AuthCallbackPage
