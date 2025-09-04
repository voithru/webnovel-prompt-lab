import React from 'react'
import styles from '../../styles/modules/GoogleLoginButton.module.css'

const TestButton = () => {
  console.log('TestButton - CSS Module Styles:', styles)
  console.log('TestButton - Button Class:', styles.button)
  console.log('TestButton - Primary Class:', styles.primary)

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>CSS 모듈 테스트</h3>
      
      {/* CSS 모듈 클래스 사용 */}
      <button className={`${styles.button} ${styles.primary} ${styles.large}`}>
        CSS 모듈 스타일
      </button>
      
      <br /><br />
      
      {/* 인라인 스타일 사용 */}
      <button style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '16px 32px',
        fontSize: '18px',
        minHeight: '56px',
        border: 'none',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
        color: 'white',
        boxShadow: '0 2px 8px rgba(66, 133, 244, 0.3)',
        cursor: 'pointer'
      }}>
        인라인 스타일
      </button>
      
      <br /><br />
      
      {/* 클래스명 출력 */}
      <div style={{ fontSize: '12px', color: '#666' }}>
        <p>CSS 모듈 클래스명:</p>
        <p>button: {styles.button}</p>
        <p>primary: {styles.primary}</p>
        <p>large: {styles.large}</p>
      </div>
    </div>
  )
}

export default TestButton
