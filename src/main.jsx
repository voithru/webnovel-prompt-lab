import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import '@styles/globals.css'

// 프로덕션 보안 시스템
import devToolsBlocker from './utils/devToolsBlocker'

// 프로덕션 환경에서 개발자 도구 차단 활성화 (devToolsBlocker.js에서 비활성화됨)
if (import.meta.env.PROD) {
  console.log('%c🛡️ 프로덕션 보안 모드 (일시적으로 비활성화)', 'color: orange; font-weight: bold; font-size: 16px;')
  console.log('%c개발자 도구 접근이 허용됩니다 (개발용)', 'color: green; font-weight: bold;')
  
  // devToolsBlocker.init()은 devToolsBlocker.js에서 자체적으로 비활성화됨
  devToolsBlocker.init()
  
  console.log('%c🔓 개발자 도구 접근 허용됨', 'color: green; font-weight: bold;')
}

// Electron API가 사용 가능한지 확인 (개발 모드에서만)
if (import.meta.env.DEV && typeof window !== 'undefined' && window.electronAPI) {
  console.log('Electron API is available')
} else if (import.meta.env.DEV) {
  console.warn('Electron API is not available')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
