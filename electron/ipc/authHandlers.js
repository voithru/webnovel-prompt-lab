const { ipcMain, BrowserWindow } = require('electron')
const { google } = require('googleapis')
const Store = require('electron-store')
const path = require('path')

// Google OAuth2 설정 import
const googleConfig = require('../config/google-oauth.js')

const store = new Store({ name: 'auth-data' })

class AuthHandler {
  constructor() {
    this.setupHandlers()
  }

  setupHandlers() {
    // Google 로그인 초기화 (Authorization Code Flow - 웹 애플리케이션)
    ipcMain.handle('auth:google-login', async (event) => {
      console.log('🔍 IPC: auth:google-login 핸들러 시작 (Authorization Code Flow)')
      
      try {
        console.log('🔑 OAuth2 클라이언트 생성 중...')
        
        // 웹 애플리케이션용 OAuth2 클라이언트
        const oauth2Client = new google.auth.OAuth2(
          googleConfig.clientId,
          googleConfig.clientSecret,
          googleConfig.redirectUri
        )

        console.log('✅ OAuth2 클라이언트 생성 완료')
        console.log('📋 사용된 설정:')
        console.log('   - Client ID:', googleConfig.clientId)
        console.log('   - Client Secret:', googleConfig.clientSecret)
        console.log('   - Scopes:', googleConfig.scopes)

        // 인증 URL 생성 (웹 애플리케이션용)
        console.log('🔧 OAuth URL 생성 시작 (웹 애플리케이션)...')
        console.log('   - response_type: code')
        console.log('   - scope:', googleConfig.scopes)
        console.log('   - redirect_uri:', googleConfig.redirectUri)
        
        const authUrl = oauth2Client.generateAuthUrl({
          response_type: 'code',
          scope: googleConfig.scopes,
          access_type: 'offline',
          prompt: 'consent',
          redirect_uri: googleConfig.redirectUri
        })

        console.log('🌐 인증 URL 생성 완료:', authUrl)
        
        // URL 파싱하여 실제 요청되는 매개변수 확인
        try {
          const urlObj = new URL(authUrl)
          console.log('🔍 URL 파싱 결과:')
          console.log('   - Base URL:', urlObj.origin + urlObj.pathname)
          console.log('   - Client ID:', urlObj.searchParams.get('client_id'))
          console.log('   - Redirect URI:', urlObj.searchParams.get('redirect_uri'))
          console.log('   - Scope:', urlObj.searchParams.get('scope'))
        } catch (error) {
          console.error('❌ URL 파싱 실패:', error)
        }

        // 현재 창에서 Google OAuth 인증 진행 (새 창 없음)
        console.log('🌐 현재 창에서 Google OAuth 인증 진행...')
        
        // 메인 창의 webContents를 사용하여 리디렉션
        const mainWindow = BrowserWindow.getAllWindows().find(win => win.isVisible())
        if (mainWindow) {
          console.log('✅ 메인 창에서 OAuth 인증 시작')
          mainWindow.loadURL(authUrl)
          
          // OAuth 완료 후 리디렉션 처리 (모든 이벤트 감지)
          console.log('🔍 OAuth 완료 감지 이벤트 리스너 등록 시작...')
          
          // will-redirect 이벤트 감지
          mainWindow.webContents.on('will-redirect', async (event, navigationUrl) => {
            console.log('🔄 will-redirect 감지:', navigationUrl)
            await handleOAuthCompletion(navigationUrl)
          })
          
          // did-navigate 이벤트 감지
          mainWindow.webContents.on('did-navigate', async (event, navigationUrl) => {
            console.log('🔄 did-navigate 감지:', navigationUrl)
            await handleOAuthCompletion(navigationUrl)
          })
          
          // did-redirect-navigation 이벤트 감지 (추가)
          mainWindow.webContents.on('did-redirect-navigation', async (event, navigationUrl) => {
            console.log('🔄 did-redirect-navigation 감지:', navigationUrl)
            await handleOAuthCompletion(navigationUrl)
          })
          
          // URL 변경 감지를 위한 폴링 (백업 방법)
          let urlCheckInterval = setInterval(() => {
            const currentURL = mainWindow.webContents.getURL()
            console.log('🔍 현재 URL 체크:', currentURL)
            
            if (currentURL.includes('code=') || currentURL.includes('error=')) {
              console.log('🎯 URL 변경 감지됨 (폴링):', currentURL)
              clearInterval(urlCheckInterval)
              handleOAuthCompletion(currentURL)
            }
          }, 1000) // 1초마다 체크
          
          console.log('✅ OAuth 완료 감지 이벤트 리스너 등록 완료')
          
          // OAuth 완료 처리 함수
          const handleOAuthCompletion = async (navigationUrl) => {
            console.log('🔍 OAuth 완료 처리 시작:', navigationUrl)
            
            // 웹 애플리케이션: 인증 코드가 URL에 포함되어 옴
            if (navigationUrl.includes('code=')) {
              console.log('🎉 OAuth 인증 완료! 인증 코드 추출 중...')
              
              // URL에서 인증 코드 파싱
              const urlParams = new URLSearchParams(navigationUrl.split('?')[1])
              const authCode = urlParams.get('code')
              
              console.log('🔑 추출된 인증 코드:', authCode ? `${authCode.substring(0, 20)}...` : '없음')
              
              if (authCode) {
                try {
                  console.log('🔄 인증 코드로 액세스 토큰 교환 시작...')
                  
                  // 인증 코드로 액세스 토큰 교환
                  const { tokens } = await oauth2Client.getToken(authCode)
                  oauth2Client.setCredentials(tokens)
                  
                  console.log('✅ 액세스 토큰 교환 완료')
                  
                  // 사용자 정보 가져오기
                  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
                  const userInfo = await oauth2.userinfo.get()
                  
                  console.log('👤 사용자 정보:', userInfo.data)
                  
                  // 사용자 정보 저장
                  const userData = {
                    id: userInfo.data.id,
                    email: userInfo.data.email,
                    name: userInfo.data.name,
                    picture: userInfo.data.picture,
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token, // Desktop Application은 refresh token 사용 가능
                    loginTime: new Date().toISOString()
                  }
                  
                  // electron-store에 저장
                  const userStore = new Store({ name: 'user' })
                  userStore.set('user', userData)
                  
                  console.log('💾 사용자 정보 저장 완료')
                  
                  // 메인 프로세스에 로그인 성공 이벤트 전송
                  console.log('📢 auth:login-success 이벤트 전송 시작...')
                  console.log('   - 전송할 데이터:', { success: true, user: { email: userData.email, name: userData.name } })
                  
                  mainWindow.webContents.send('auth:login-success', { 
                    success: true, 
                    user: userData 
                  })
                  console.log('✅ auth:login-success 이벤트 전송 완료')
                  
                  // 잠시 대기 후 리디렉션 (이벤트 처리 시간 확보)
                  setTimeout(() => {
                    console.log('🔄 "내 과제" 페이지로 리디렉션 시작...')
                    mainWindow.loadURL('http://127.0.0.1:3001/my-tasks')
                    console.log('✅ "내 과제" 페이지로 리디렉션 완료')
                  }, 1000)
                } catch (error) {
                  console.error('❌ 토큰 교환 또는 사용자 정보 가져오기 실패:', error)
                  // 실패 시 로그인 페이지로 복원
                  mainWindow.loadURL('http://127.0.0.1:3001')
                }
              }
            }
            
            // OAuth 오류 처리 (error 파라미터가 있는 경우)
            if (navigationUrl.includes('error=')) {
              console.log('❌ OAuth 오류 발생:', navigationUrl)
              
              const urlParams = new URLSearchParams(navigationUrl.split('?')[1])
              const error = urlParams.get('error')
              const errorDescription = urlParams.get('error_description')
              
              console.log('🚨 OAuth 오류 상세:')
              console.log('   - Error:', error)
              console.log('   - Description:', errorDescription)
              
              // 오류 시 로그인 페이지로 복원
              mainWindow.loadURL('http://127.0.0.1:3001')
            }
          }
          
          // OAuth 오류 처리 (페이지 로드 실패)
          mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
            console.log('❌ 페이지 로드 실패:', errorDescription)
            console.log('   - Error Code:', errorCode)
            console.log('   - URL:', validatedURL)
            
            if (errorCode === -6) {
              // 사용자가 취소한 경우
              console.log('🚫 사용자가 OAuth를 취소함')
              mainWindow.loadURL('http://127.0.0.1:3001')
            } else {
              // 기타 오류의 경우 로그인 페이지로 복원
              console.log('⚠️ 기타 오류로 인해 로그인 페이지로 복원')
              mainWindow.loadURL('http://127.0.0.1:3001')
            }
          })
          
          // OAuth 타임아웃 처리 (10초 후 자동 복원)
          setTimeout(() => {
            const currentURL = mainWindow.webContents.getURL()
            if (currentURL.includes('accounts.google.com') && !currentURL.includes('access_token=')) {
              console.log('⏰ OAuth 타임아웃 - 로그인 페이지로 복원')
              mainWindow.loadURL('http://127.0.0.1:3001')
            }
          }, 10000) // 10초
          
          return {
            success: true,
            message: 'Google 로그인 창이 열렸습니다. 로그인을 완료해주세요.'
          }
        } else {
          console.log('❌ 메인 창을 찾을 수 없음')
          return {
            success: false,
            error: '메인 창을 찾을 수 없습니다.'
          }
        }
      } catch (error) {
        console.error('❌ Google 로그인 오류:', error)
        return {
          success: false,
          error: error.message
        }
      }
    })

    // 사용자 정보 가져오기
    ipcMain.handle('auth:get-user', async () => {
      try {
        const user = store.get('user')
        if (!user) {
          return { success: false, error: '사용자 정보가 없습니다.' }
        }

        // 토큰 갱신 확인
        if (user.tokens.expiry_date && Date.now() > user.tokens.expiry_date) {
          // 토큰 갱신 로직
          const refreshedUser = await this.refreshTokens(user)
          return { success: true, user: refreshedUser }
        }

        return { success: true, user: user }
      } catch (error) {
        console.error('Get user error:', error)
        return { success: false, error: error.message }
      }
    })

    // 토큰 갱신
    ipcMain.handle('auth:refresh-token', async () => {
      try {
        const user = store.get('user')
        if (!user || !user.tokens.refresh_token) {
          throw new Error('토큰 갱신을 위한 정보가 없습니다.')
        }

        const refreshedUser = await this.refreshTokens(user)
        return { success: true, user: refreshedUser }
      } catch (error) {
        console.error('Token refresh error:', error)
        return { success: false, error: error.message }
      }
    })

    // 로그아웃
    ipcMain.handle('auth:logout', async () => {
      try {
        store.delete('user')
        store.delete('pendingAuth')
        return { success: true }
      } catch (error) {
        console.error('Logout error:', error)
        return { success: false, error: error.message }
      }
    })
  }

  async refreshTokens(user) {
    try {
      const oauth2Client = new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        'urn:ietf:wg:oauth:2.0:oob'
      )

      oauth2Client.setCredentials({
        refresh_token: user.tokens.refresh_token
      })

      const { credentials } = await oauth2Client.refreshAccessToken()
      
      const refreshedUser = {
        ...user,
        tokens: credentials,
        lastLogin: Date.now()
      }

      store.set('user', refreshedUser)
      return refreshedUser
    } catch (error) {
      console.error('Token refresh failed:', error)
      // 토큰 갱신 실패 시 로그아웃 처리
      store.delete('user')
      throw new Error('토큰 갱신에 실패했습니다. 다시 로그인해주세요.')
    }
  }
}

new AuthHandler()
