import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_SETTINGS = {
  theme: 'light',
  language: 'ko',
  autoSave: true,
  autoSaveInterval: 30, // seconds
  preferredLLMModel: 'gpt-4',
  fontSize: 14,
  fontFamily: 'pretendard',
  editorTheme: 'default',
  notifications: {
    taskComplete: true,
    promptEvaluation: true,
    systemUpdates: false
  },
  privacy: {
    shareUsageData: false,
    improveTranslations: true
  },
  advanced: {
    debugMode: false,
    experimentalFeatures: false
  }
}

const useUserStore = create(
  persist(
    (set, get) => ({
      // State
      settings: DEFAULT_SETTINGS,
      recentTasks: [],
      preferences: {},
      statistics: {
        totalTasksCompleted: 0,
        totalPromptsCreated: 0,
        totalTimeSpent: 0,
        averageRating: 0,
        lastActiveDate: null
      },
      isLoading: false,
      error: null,

      // Actions
      updateSettings: (newSettings) => {
        const currentSettings = get().settings
        set({
          settings: { ...currentSettings, ...newSettings }
        })
        
        // Electron에 설정 저장
        if (window.electronAPI) {
          window.electronAPI.user.saveSettings(get().settings)
            .catch(error => {
              console.error('Save settings error:', error)
              set({ error: '설정 저장에 실패했습니다.' })
            })
        }
      },

      resetSettings: () => {
        set({ settings: DEFAULT_SETTINGS })
        if (window.electronAPI) {
          window.electronAPI.user.saveSettings(DEFAULT_SETTINGS)
        }
      },

      loadSettings: async () => {
        set({ isLoading: true, error: null })
        try {
          if (window.electronAPI) {
            const result = await window.electronAPI.user.getSettings()
            if (result.success) {
              set({
                settings: { ...DEFAULT_SETTINGS, ...result.settings }
              })
            }
          }
        } catch (error) {
          console.error('Load settings error:', error)
          set({ error: '설정을 불러오는데 실패했습니다.' })
        } finally {
          set({ isLoading: false })
        }
      },

      // 최근 작업 관리
      addRecentTask: (task) => {
        const recentTasks = get().recentTasks
        const updatedTasks = [
          {
            id: task.id,
            title: task.title,
            lastAccessed: new Date().toISOString(),
            progress: task.progress || 0,
            status: task.status || 'in_progress'
          },
          ...recentTasks.filter(t => t.id !== task.id)
        ].slice(0, 10) // 최근 10개만 유지
        
        set({ recentTasks: updatedTasks })
      },

      removeRecentTask: (taskId) => {
        const recentTasks = get().recentTasks
        set({
          recentTasks: recentTasks.filter(task => task.id !== taskId)
        })
      },

      clearRecentTasks: () => {
        set({ recentTasks: [] })
      },

      // 사용자 선호도 관리
      setPreference: (key, value) => {
        const preferences = get().preferences
        set({
          preferences: { ...preferences, [key]: value }
        })
      },

      removePreference: (key) => {
        const preferences = get().preferences
        const { [key]: removed, ...rest } = preferences
        set({ preferences: rest })
      },

      // 통계 업데이트
      updateStatistics: (updates) => {
        const currentStats = get().statistics
        set({
          statistics: {
            ...currentStats,
            ...updates,
            lastActiveDate: new Date().toISOString()
          }
        })
      },

      incrementTasksCompleted: () => {
        const stats = get().statistics
        set({
          statistics: {
            ...stats,
            totalTasksCompleted: stats.totalTasksCompleted + 1,
            lastActiveDate: new Date().toISOString()
          }
        })
      },

      incrementPromptsCreated: () => {
        const stats = get().statistics
        set({
          statistics: {
            ...stats,
            totalPromptsCreated: stats.totalPromptsCreated + 1,
            lastActiveDate: new Date().toISOString()
          }
        })
      },

      addTimeSpent: (timeInMinutes) => {
        const stats = get().statistics
        set({
          statistics: {
            ...stats,
            totalTimeSpent: stats.totalTimeSpent + timeInMinutes,
            lastActiveDate: new Date().toISOString()
          }
        })
      },

      // 에러 관리
      setError: (error) => {
        set({ error })
      },

      clearError: () => {
        set({ error: null })
      },

      // 데이터 내보내기/가져오기
      exportUserData: async () => {
        set({ isLoading: true, error: null })
        try {
          if (window.electronAPI) {
            const result = await window.electronAPI.user.exportData('all')
            if (result.success) {
              return result
            } else {
              throw new Error(result.error)
            }
          }
          throw new Error('Electron API를 사용할 수 없습니다.')
        } catch (error) {
          console.error('Export data error:', error)
          set({ error: '데이터 내보내기에 실패했습니다.' })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      importUserData: async (filePath) => {
        set({ isLoading: true, error: null })
        try {
          if (window.electronAPI) {
            const result = await window.electronAPI.user.importData('all')
            if (result.success) {
              // 설정 다시 로드
              await get().loadSettings()
              return result
            } else {
              throw new Error(result.error)
            }
          }
          throw new Error('Electron API를 사용할 수 없습니다.')
        } catch (error) {
          console.error('Import data error:', error)
          set({ error: '데이터 가져오기에 실패했습니다.' })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      // 캐시 관리
      clearCache: async (cacheType = 'all') => {
        try {
          if (window.electronAPI) {
            const result = await window.electronAPI.user.clearCache(cacheType)
            return result
          }
          throw new Error('Electron API를 사용할 수 없습니다.')
        } catch (error) {
          console.error('Clear cache error:', error)
          set({ error: '캐시 삭제에 실패했습니다.' })
          throw error
        }
      },

      // 앱 정보
      getAppInfo: async () => {
        try {
          if (window.electronAPI) {
            const result = await window.electronAPI.user.getAppInfo()
            if (result.success) {
              return result.info
            }
          }
          return null
        } catch (error) {
          console.error('Get app info error:', error)
          return null
        }
      },

      // 전체 데이터 초기화
      clearData: () => {
        set({
          settings: DEFAULT_SETTINGS,
          recentTasks: [],
          preferences: {},
          statistics: {
            totalTasksCompleted: 0,
            totalPromptsCreated: 0,
            totalTimeSpent: 0,
            averageRating: 0,
            lastActiveDate: null
          },
          error: null
        })
      },

      // 테마 관련 유틸리티
      isDarkMode: () => {
        return get().settings.theme === 'dark'
      },

      toggleTheme: () => {
        const currentTheme = get().settings.theme
        const newTheme = currentTheme === 'light' ? 'dark' : 'light'
        get().updateSettings({ theme: newTheme })
      },

      // 자동 저장 관련
      isAutoSaveEnabled: () => {
        return get().settings.autoSave
      },

      getAutoSaveInterval: () => {
        return get().settings.autoSaveInterval * 1000 // Convert to milliseconds
      }
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        settings: state.settings,
        recentTasks: state.recentTasks,
        preferences: state.preferences,
        statistics: state.statistics
      })
    }
  )
)

export { useUserStore, DEFAULT_SETTINGS }
