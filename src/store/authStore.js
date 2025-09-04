import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import emailAuthService from '../services/emailAuthService'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: (userData) => {
        set({
          user: userData,
          isAuthenticated: true,
          error: null
        })
      },

      logout: async () => {
        try {
          // Electron API를 통한 로그아웃 처리
          if (window.electronAPI) {
            await window.electronAPI.auth.logout()
          }
          
          set({
            user: null,
            isAuthenticated: false,
            error: null
          })
        } catch (error) {
          console.error('Logout error:', error)
          // 로그아웃은 항상 성공해야 하므로 에러가 있어도 상태는 초기화
          set({
            user: null,
            isAuthenticated: false,
            error: null
          })
        }
      },

      setLoading: (isLoading) => {
        set({ isLoading })
      },

      setError: (error) => {
        set({ error })
      },

      clearError: () => {
        set({ error: null })
      },

      updateUser: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates }
          })
        }
      },

      // 인증 상태 확인 (emailAuthService와 동기화)
      checkAuth: async () => {
        set({ isLoading: true })
        try {
          // emailAuthService에서 현재 사용자 확인
          const currentUser = emailAuthService.getCurrentUser()
          
          if (currentUser && currentUser.email) {
            set({
              user: currentUser,
              isAuthenticated: true,
              error: null
            })
            console.log('✅ AuthStore 인증 상태 동기화 완료:', currentUser.email)
          } else {
            set({
              user: null,
              isAuthenticated: false,
              error: null
            })
            console.log('❌ AuthStore 인증 상태 없음 - 로그아웃 상태')
          }
        } catch (error) {
          console.error('❌ Auth check error:', error)
          set({
            user: null,
            isAuthenticated: false,
            error: error.message || '인증 확인 중 오류가 발생했습니다.'
          })
        } finally {
          set({ isLoading: false })
        }
      },

      // 초기화 시 인증 상태 동기화
      initializeAuth: () => {
        const currentUser = emailAuthService.getCurrentUser()
        
        if (currentUser && currentUser.email) {
          set({
            user: currentUser,
            isAuthenticated: true,
            error: null
          })
          console.log('🔄 AuthStore 초기화: 로그인 상태')
        } else {
          set({
            user: null,
            isAuthenticated: false,
            error: null
          })
          console.log('🔄 AuthStore 초기화: 로그아웃 상태')
        }
      },

      // 토큰 갱신
      refreshToken: async () => {
        try {
          if (window.electronAPI) {
            const result = await window.electronAPI.auth.refreshToken()
            if (result.success) {
              // 사용자 정보 업데이트 (토큰이 갱신됨)
              const userResult = await window.electronAPI.auth.getUser()
              if (userResult.success) {
                set({ user: userResult.user })
              }
              return true
            }
          }
          return false
        } catch (error) {
          console.error('Token refresh error:', error)
          set({ error: '토큰 갱신에 실패했습니다. 다시 로그인해주세요.' })
          return false
        }
      },

      // Google 로그인 처리
      googleLogin: async () => {
        set({ isLoading: true, error: null })
        try {
          if (!window.electronAPI) {
            throw new Error('Electron API를 사용할 수 없습니다.')
          }

          const result = await window.electronAPI.auth.googleLogin()
          if (result.success) {
            return result // 인증 URL 반환
          } else {
            throw new Error(result.error || '구글 로그인 초기화에 실패했습니다.')
          }
        } catch (error) {
          set({ error: error.message })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      // 인증 코드 교환
      exchangeCode: async (authCode) => {
        set({ isLoading: true, error: null })
        try {
          if (!window.electronAPI) {
            throw new Error('Electron API를 사용할 수 없습니다.')
          }

          const result = await window.electronAPI.auth.exchangeCode(authCode)
          if (result.success) {
            set({
              user: result.user,
              isAuthenticated: true,
              error: null
            })
            return result.user
          } else {
            throw new Error(result.error || '인증 코드 처리에 실패했습니다.')
          }
        } catch (error) {
          set({ error: error.message })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      // 실시간 사용자 정보 업데이트 (이메일 로그인용)
      refreshUserInfo: async () => {
        try {
          const result = await emailAuthService.refreshUserInfo()
          
          if (result.success && result.user) {
            // Zustand store에 업데이트된 사용자 정보 반영
            set({
              user: result.user,
              isAuthenticated: true,
              error: null
            })
            
            console.log('✅ AuthStore에 사용자 정보 업데이트 완료')
            return result
          } else if (result.reason === 'user_removed') {
            // 사용자가 비활성화된 경우 로그아웃
            set({
              user: null,
              isAuthenticated: false,
              error: null
            })
            
            console.log('❌ 사용자 비활성화로 인한 AuthStore 로그아웃')
            return result
          }
          
          return result
        } catch (error) {
          console.error('❌ AuthStore 사용자 정보 업데이트 실패:', error)
          set({ error: error.message })
          return { success: false, error: error.message }
        }
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        // 민감한 정보는 persist하지 않음
        isAuthenticated: state.isAuthenticated,
        user: state.user ? {
          id: state.user.id,
          email: state.user.email,
          name: state.user.name,
          picture: state.user.picture,
          apiKey: state.user.apiKey // API 키도 저장
          // tokens는 저장하지 않음 (보안상 이유)
        } : null
      })
    }
  )
)

export { useAuthStore }
