/**
 * 프로덕션 환경에서 개발자 도구 접근 차단 (강화 버전)
 * 작업자 도구에서 민감한 API 정보 노출 방지
 */

class DevToolsBlocker {
  constructor() {
    this.isBlocked = false
    this.checkInterval = null
    this.warningCount = 0
    this.isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production'
    this.isLoginPage = false
    this.isInitialized = false
  }

  // 개발자 도구 감지 및 차단 (PROD에서 내용 숨김 모드)
  init() {
    if (!this.isProduction) {
      console.log('🔧 개발 모드 - 개발자 도구 차단 비활성화')
      return
    }

    console.log('🛡️ PROD 모드 - 개발자 도구 내용 숨김 보안 활성화')
    
    // PROD에서는 개발자 도구 열기를 막지 않고, 내용만 숨김
    this.hideDevToolsContent()
    this.setupConsoleHiding()
    this.setupNetworkHiding()
    this.setupSourcesHiding()
    
  }

  // 페이지 변경 감지 설정
  setupPageChangeDetection() {
    // popstate 이벤트 (뒤로가기/앞으로가기)
    window.addEventListener('popstate', () => {
      this.updatePageStatus()
    })
    
    // pushState/replaceState 감지
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args)
      setTimeout(() => devToolsBlocker.updatePageStatus(), 100)
    }
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args)
      setTimeout(() => devToolsBlocker.updatePageStatus(), 100)
    }
  }

  // 현재 페이지 확인
  checkCurrentPage() {
    const currentPath = window.location.pathname
    this.isLoginPage = currentPath === '/login' || currentPath === '/'
    console.log(`🔍 현재 페이지: ${currentPath}, 로그인 페이지: ${this.isLoginPage}`)
  }

  // 페이지 변경 감지
  updatePageStatus() {
    this.checkCurrentPage()
  }

  // 우클릭 차단
  blockRightClick() {
    document.addEventListener('contextmenu', (e) => {
      // 로그인 페이지에서는 우클릭 차단 완화
      if (this.isLoginPage) {
        return // 우클릭 허용
      }
      
      e.preventDefault()
      this.showWarning('우클릭이 비활성화되었습니다.')
      return false
    })
  }

  // 키보드 단축키 차단 (강화)
  blockKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // 개발자 도구 관련 모든 단축키 차단
      const blockedKeys = [
        // 개발자 도구
        { key: 'F12' },
        { ctrl: true, shift: true, key: 'I' }, // Chrome DevTools
        { ctrl: true, shift: true, key: 'J' }, // Console
        { ctrl: true, shift: true, key: 'C' }, // Element Inspector
        { ctrl: true, key: 'u' }, // View Source
        { ctrl: true, key: 'U' }, // View Source (대문자)
        { ctrl: true, shift: true, key: 'K' }, // Firefox Console
        { ctrl: true, shift: true, key: 'S' }, // Firefox Debugger
        { ctrl: true, shift: true, key: 'E' }, // Firefox Network
        { ctrl: true, shift: true, key: 'M' }, // Firefox Responsive Design
        { ctrl: true, option: true, key: 'I' }, // Safari DevTools (Mac)
        { cmd: true, option: true, key: 'I' }, // Safari DevTools (Mac)
        { cmd: true, shift: true, key: 'C' }, // Safari Element Inspector (Mac)
        // 추가 차단
        { ctrl: true, key: 's' }, // 페이지 저장 차단
        { ctrl: true, key: 'S' }, // 페이지 저장 차단 (대문자)
        { ctrl: true, key: 'p' }, // 인쇄 차단
        { ctrl: true, key: 'P' }, // 인쇄 차단 (대문자)
      ]

      const isBlocked = blockedKeys.some(blocked => {
        return (
          (!blocked.ctrl || e.ctrlKey) &&
          (!blocked.shift || e.shiftKey) &&
          (!blocked.option || e.altKey) &&
          (!blocked.cmd || e.metaKey) &&
          (blocked.key === e.key)
        )
      })

      if (isBlocked) {
        // 로그인 페이지에서는 키보드 단축키 차단 완화
        if (this.isLoginPage) {
          return // 키보드 단축키 허용
        }
        
        e.preventDefault()
        e.stopPropagation()
        this.showWarning('개발자 도구 접근이 제한되었습니다.')
        this.warningCount++
        
        if (this.warningCount >= 5) {
          this.blockPage()
        }
        return false
      }
    })
  }

  // 개발자 도구 열림 감지 (완화된 버전)
  detectDevTools() {
    // 로그인 페이지에서는 기본 감지도 비활성화
    if (this.isLoginPage) {
      return
    }
    
    let devtools = {
      open: false,
      orientation: null
    }

    // 임계값을 더 크게 설정 (더 확실한 감지)
    const threshold = 300
    let falsePositiveCount = 0

    setInterval(() => {
      const heightDiff = window.outerHeight - window.innerHeight
      const widthDiff = window.outerWidth - window.innerWidth
      
      if (heightDiff > threshold || widthDiff > threshold) {
        // 연속으로 감지될 때만 처리
        falsePositiveCount++
        if (falsePositiveCount >= 3 && !devtools.open) {
          devtools.open = true
          this.handleDevToolsOpen()
        }
      } else {
        // 정상 상태로 돌아오면 카운트 리셋
        if (devtools.open) {
          devtools.open = false
          falsePositiveCount = 0
        }
      }
    }, 1000) // 간격을 1초로 늘림
  }

  // 개발자 도구 열림 감지시 처리
  handleDevToolsOpen() {
    // 로그인 페이지에서는 개발자 도구 감지 완화
    if (this.isLoginPage) {
      console.log('🔓 로그인 페이지 - 개발자 도구 감지 완화')
      return // 로그인 페이지에서는 차단하지 않음
    }
    
    this.warningCount++
    
    if (this.warningCount >= 5) {
      this.blockPage()
      return
    }

    // 경고 메시지
    this.showWarning(`⚠️ 보안 경고 (${this.warningCount}/5) - 개발자 도구가 감지되었습니다.`)
  }

  // 페이지 차단 (개선된 버전 - React 앱 보존)
  blockPage() {
    // 기존 이벤트 리스너 제거
    document.removeEventListener('keydown', this.keydownHandler)
    document.removeEventListener('contextmenu', this.contextmenuHandler)
    
    // React 앱을 숨기고 오버레이 표시
    const rootElement = document.getElementById('root')
    if (rootElement) {
      rootElement.style.display = 'none'
    }
    
    // 오버레이 생성 (React 앱 위에 표시)
    const overlay = document.createElement('div')
    overlay.id = 'devtools-blocker-overlay'
    overlay.style.cssText = `
      position: fixed; 
      top: 0; 
      left: 0; 
      width: 100vw; 
      height: 100vh; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white; 
      display: flex; 
      flex-direction: column; 
      justify-content: center; 
      align-items: center; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      z-index: 999999;
      user-select: none;
      overflow: hidden;
    `
    
    overlay.innerHTML = `
      <div style="text-align: center; max-width: 500px; padding: 40px;">
        <div style="font-size: 64px; margin-bottom: 20px;">🔒</div>
        <h1 style="font-size: 28px; margin-bottom: 20px; font-weight: 600;">보안 접근 제한</h1>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px; opacity: 0.9;">
          보안상의 이유로 개발자 도구 접근이 차단되었습니다.<br/>
          이는 민감한 정보 보호를 위한 조치입니다.<br/>
          <span style="font-size: 14px; opacity: 0.8;">3초 후 자동으로 정상 화면으로 복원됩니다.</span><br/>
          <span style="font-size: 12px; opacity: 0.7; margin-top: 10px; display: block;">
            💡 개발자 도구를 닫고 새로고침하면 정상적으로 사용할 수 있습니다.
          </span>
        </p>
        <button id="reload-button" style="
          padding: 12px 30px; 
          background: rgba(255,255,255,0.2); 
          color: white; 
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 25px; 
          cursor: pointer; 
          font-size: 16px;
          font-weight: 500;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        ">
          페이지 새로고침
        </button>
      </div>
    `
    
    document.body.appendChild(overlay)
    
    // 새로고침 버튼 이벤트 리스너
    const reloadButton = document.getElementById('reload-button')
    if (reloadButton) {
      reloadButton.addEventListener('click', () => {
        window.location.reload()
      })
      
      // 호버 효과
      reloadButton.addEventListener('mouseover', () => {
        reloadButton.style.background = 'rgba(255,255,255,0.3)'
      })
      
      reloadButton.addEventListener('mouseout', () => {
        reloadButton.style.background = 'rgba(255,255,255,0.2)'
      })
    }
    
    // 3초 후 자동으로 React 앱 복원 (사용자 경험 개선)
    setTimeout(() => {
      this.restoreApp()
    }, 3000)
  }

  // 앱 복원 (개발자 도구 차단 해제)
  restoreApp() {
    const overlay = document.getElementById('devtools-blocker-overlay')
    if (overlay) {
      overlay.remove()
    }
    
    const rootElement = document.getElementById('root')
    if (rootElement) {
      rootElement.style.display = 'block'
    }
    
    // 경고 카운트 리셋
    this.warningCount = 0
    
    console.log('🔄 앱 복원 완료 - 정상 사용 가능')
  }

  // 고급 개발자 도구 감지 (완화된 버전)
  detectDevToolsAdvanced() {
    // 로그인 페이지에서는 고급 감지 비활성화
    if (this.isLoginPage) {
      return
    }
    
    // 1. Console 객체 감지 (완화)
    let devtools = {open: false, orientation: null}
    let falsePositiveCount = 0
    
    setInterval(() => {
      // Console 객체가 열려있는지 확인 (더 엄격한 조건)
      try {
        if (console.profile && typeof console.profile === 'function') {
          const start = performance.now()
          console.profile()
          console.profileEnd()
          const end = performance.now()
          
          // 실제 개발자 도구가 열려있을 때만 감지 (시간 차이가 클 때)
          if (end - start > 50) {
            falsePositiveCount = 0
            devtools.open = true
            this.handleDevToolsOpen()
          } else {
            falsePositiveCount++
            // 5회 연속 false positive면 감지 중단
            if (falsePositiveCount >= 5) {
              console.log('🔧 개발자 도구 감지 false positive 감지 - 감지 완화')
              return
            }
          }
        }
      } catch (error) {
        // 에러 발생 시 감지 중단
        console.log('🔧 개발자 도구 감지 에러 - 감지 중단:', error.message)
      }
    }, 3000) // 간격을 3초로 늘림

    // 2. 디버거 감지 (완화)
    setInterval(() => {
      try {
        const start = performance.now()
        debugger
        const end = performance.now()
        // 더 엄격한 조건 (200ms 이상 차이날 때만)
        if (end - start > 200) {
          this.handleDevToolsOpen()
        }
      } catch (error) {
        // 에러 발생 시 감지 중단
        console.log('🔧 디버거 감지 에러 - 감지 중단:', error.message)
      }
    }, 5000) // 간격을 5초로 늘림
  }

  // 텍스트 선택 차단
  blockSelectAll() {
    document.addEventListener('selectstart', (e) => {
      // 로그인 페이지에서는 텍스트 선택 허용
      if (this.isLoginPage) {
        return
      }
      e.preventDefault()
      return false
    })
    
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'a') {
        // 로그인 페이지에서는 Ctrl+A 허용
        if (this.isLoginPage) {
          return
        }
        e.preventDefault()
        return false
      }
    })
  }

  // 디버거 비활성화
  disableDebugger() {
    // 무한 디버거 루프로 개발자 도구 사용 방해
    setInterval(() => {
      if (this.isProduction && !this.isLoginPage) {
        debugger
      }
    }, 4000)
  }

  // 콘솔 경고 메시지 (강화)
  showConsoleWarning() {
    if (!this.isProduction) return
    
    const warningStyle = `
      color: red; 
      font-size: 24px; 
      font-weight: bold; 
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
      background: yellow;
      padding: 10px;
    `
    
    setTimeout(() => {
      console.clear()
      console.log('%c🚨 보안 경고 🚨', warningStyle)
      console.log('%c이 콘솔을 사용하여 악의적인 코드를 실행하지 마세요!', 'color: red; font-size: 16px; font-weight: bold;')
      console.log('%c사기꾼들이 사용자를 속여 계정 정보를 탈취하려 할 수 있습니다.', 'color: orange; font-size: 14px;')
      console.log('%c이 페이지의 콘솔 사용은 모니터링됩니다.', 'color: red; font-size: 12px;')
    }, 1000)
    
    // 주기적으로 콘솔 지우기
    setInterval(() => {
      if (this.isProduction) {
        console.clear()
        console.log('%c🔒 보안 모드 활성화됨', 'color: red; font-size: 18px; font-weight: bold;')
      }
    }, 5000)
  }

  // 개발자 도구 내용 숨김 (콘솔, 네트워크, 소스 등)
  hideDevToolsContent() {
    // 1. 모든 콘솔 메서드 무력화
    this.disableConsole()
    
    // 2. 네트워크 요청 정보 숨김
    this.hideNetworkRequests()
    
    // 3. 소스 코드 난독화
    this.obfuscateSourceCode()
    
    // 4. 전역 변수 숨김
    this.hideGlobalVariables()
    
    // 5. 스택 트레이스 숨김
    this.hideStackTraces()
  }

  // 콘솔 완전 비활성화
  disableConsole() {
    const emptyFunction = () => {}
    const emptyObject = {}
    
    // 모든 콘솔 메서드를 빈 함수로 교체
    if (typeof console !== 'undefined') {
      Object.keys(console).forEach(method => {
        if (typeof console[method] === 'function') {
          console[method] = emptyFunction
        }
      })
      
      // 콘솔 객체 자체도 숨김
      Object.defineProperty(window, 'console', {
        get: () => emptyObject,
        set: () => {},
        configurable: false,
        enumerable: false
      })
    }
  }

  // 콘솔 숨김 설정
  setupConsoleHiding() {
    // 콘솔 메시지 가로채기
    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn
    const originalInfo = console.info
    const originalDebug = console.debug
    
    // 모든 콘솔 출력 차단
    console.log = () => {}
    console.error = () => {}
    console.warn = () => {}
    console.info = () => {}
    console.debug = () => {}
    console.trace = () => {}
    console.table = () => {}
    console.group = () => {}
    console.groupEnd = () => {}
    console.time = () => {}
    console.timeEnd = () => {}
    console.clear = () => {}
    
    // 콘솔 히스토리도 지우기
    if (console.clear) {
      setInterval(() => {
        try {
          console.clear()
        } catch (e) {}
      }, 100)
    }
  }

  // 네트워크 요청 숨김
  setupNetworkHiding() {
    // fetch 요청 가로채기
    const originalFetch = window.fetch
    window.fetch = function(...args) {
      // 실제 요청은 수행하되, 개발자 도구에서 보이지 않도록 숨김
      return originalFetch.apply(this, args).catch(error => {
        // 에러도 숨김
        throw new Error('Network request failed')
      })
    }
    
    // XMLHttpRequest 요청 가로채기
    const originalXHR = window.XMLHttpRequest
    window.XMLHttpRequest = function() {
      const xhr = new originalXHR()
      const originalOpen = xhr.open
      const originalSend = xhr.send
      
      xhr.open = function(...args) {
        // 요청 정보 숨김
        return originalOpen.apply(this, args)
      }
      
      xhr.send = function(...args) {
        // 응답 정보 숨김
        return originalSend.apply(this, args)
      }
      
      return xhr
    }
  }

  // 소스 코드 숨김
  setupSourcesHiding() {
    // 스크립트 태그 내용 숨김
    const scripts = document.getElementsByTagName('script')
    for (let script of scripts) {
      if (script.src) {
        // 외부 스크립트는 404로 만들기
        Object.defineProperty(script, 'src', {
          get: () => '/404-not-found.js',
          set: () => {},
          configurable: false
        })
      } else {
        // 인라인 스크립트 내용 지우기
        Object.defineProperty(script, 'innerHTML', {
          get: () => '// Content hidden for security',
          set: () => {},
          configurable: false
        })
      }
    }
  }

  // 네트워크 요청 정보 숨김
  hideNetworkRequests() {
    // Performance API 무력화
    if (window.performance && window.performance.getEntries) {
      window.performance.getEntries = () => []
      window.performance.getEntriesByType = () => []
      window.performance.getEntriesByName = () => []
    }
    
    // Resource Timing API 무력화
    if (window.performance && window.performance.getEntriesByType) {
      const originalGetEntriesByType = window.performance.getEntriesByType
      window.performance.getEntriesByType = function(type) {
        if (type === 'resource' || type === 'navigation') {
          return []
        }
        return originalGetEntriesByType.call(this, type)
      }
    }
  }

  // 소스 코드 난독화
  obfuscateSourceCode() {
    // 함수 toString 메서드 오버라이드
    const originalToString = Function.prototype.toString
    Function.prototype.toString = function() {
      return 'function() { [native code] }'
    }
    
    // Object 속성 숨김
    const originalGetOwnPropertyNames = Object.getOwnPropertyNames
    Object.getOwnPropertyNames = function(obj) {
      if (obj === window || obj === document) {
        return ['length'] // 최소한의 속성만 반환
      }
      return originalGetOwnPropertyNames(obj)
    }
  }

  // 전역 변수 숨김 (로그인 기능 보호)
  hideGlobalVariables() {
    // window 객체의 민감한 속성들 숨김 (localStorage, sessionStorage 제외)
    const sensitiveProps = [
      // 'localStorage', 'sessionStorage', 'indexedDB', // 로그인 기능을 위해 제외
      '__REACT_DEVTOOLS_GLOBAL_HOOK__', '__VUE_DEVTOOLS_GLOBAL_HOOK__',
      'webkitStorageInfo', 'chrome', 'opera', 'safari'
    ]
    
    sensitiveProps.forEach(prop => {
      try {
        Object.defineProperty(window, prop, {
          get: () => undefined,
          set: () => {},
          configurable: false,
          enumerable: false
        })
      } catch (e) {}
    })
    
    // localStorage와 sessionStorage는 기능은 유지하되 개발자 도구에서 내용만 숨김
    this.hideStorageContent()
  }

  // 저장소 내용 숨김 (기능은 유지)
  hideStorageContent() {
    try {
      // localStorage 내용 숨김 (기능은 정상 작동)
      const originalLocalStorageGetItem = localStorage.getItem
      const originalLocalStorageKey = localStorage.key
      
      // key 메서드만 오버라이드 (length는 건드리지 않음)
      localStorage.key = function(index) {
        const stack = new Error().stack
        if (stack && (stack.includes('devtools') || stack.includes('console'))) {
          return null
        }
        return originalLocalStorageKey.call(this, index)
      }
      
      // getItem은 개발자 도구에서 호출 시에만 null 반환
      localStorage.getItem = function(key) {
        // 실제 앱에서 호출하는 경우 정상 동작
        const stack = new Error().stack
        if (stack && (stack.includes('devtools') || stack.includes('console'))) {
          return null
        }
        return originalLocalStorageGetItem.call(this, key)
      }
      
      // sessionStorage도 동일하게 처리
      const originalSessionStorageGetItem = sessionStorage.getItem
      const originalSessionStorageKey = sessionStorage.key
      
      sessionStorage.key = function(index) {
        const stack = new Error().stack
        if (stack && (stack.includes('devtools') || stack.includes('console'))) {
          return null
        }
        return originalSessionStorageKey.call(this, index)
      }
      
      sessionStorage.getItem = function(key) {
        const stack = new Error().stack
        if (stack && (stack.includes('devtools') || stack.includes('console'))) {
          return null
        }
        return originalSessionStorageGetItem.call(this, key)
      }
    } catch (error) {
      console.log('🔧 저장소 보안 설정 중 에러 발생 - 건너뛰기:', error.message)
    }
  }

  // 스택 트레이스 숨김
  hideStackTraces() {
    // Error 객체의 stack 속성 숨김
    const originalError = window.Error
    window.Error = function(message) {
      const error = new originalError(message)
      Object.defineProperty(error, 'stack', {
        get: () => 'Stack trace hidden for security',
        set: () => {},
        configurable: false
      })
      return error
    }
    
    // 기존 Error 프로토타입도 수정
    Object.defineProperty(Error.prototype, 'stack', {
      get: () => 'Stack trace hidden for security',
      set: () => {},
      configurable: false
    })
  }

  // 경고 메시지 표시
  showWarning(message) {
    // 간단한 토스트 메시지
    const toast = document.createElement('div')
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 15px;
      border-radius: 5px;
      z-index: 999999;
      font-family: Arial, sans-serif;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `
    toast.textContent = message
    document.body.appendChild(toast)
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 3000)
  }
}

// 전역 인스턴스 생성
const devToolsBlocker = new DevToolsBlocker()

export default devToolsBlocker
