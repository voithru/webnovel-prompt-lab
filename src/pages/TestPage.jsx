import React from 'react'

const TestPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontSize: '24px',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div>
        <h1>🎉 테스트 페이지가 로드되었습니다!</h1>
        <p>React 앱이 정상적으로 작동하고 있습니다.</p>
        <div style={{
          marginTop: '20px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)'
        }}>
          <p>현재 시간: {new Date().toLocaleString('ko-KR')}</p>
          <p>User Agent: {navigator.userAgent}</p>
        </div>
      </div>
    </div>
  )
}

export default TestPage
