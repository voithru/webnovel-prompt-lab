import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useWorkflowStore = create(
  persist(
    (set, get) => ({
      // State
      currentTask: null,
      availableTasks: [],
      currentStep: 1,
      progress: {},
      sessionStartTime: null,
      
      // Step-specific data
      autoTranslation: null,
      baseTranslations: [], // R&D 팀 제공 번역문들
      prompts: [], // 사용자가 작성한 프롬프트들
      evaluations: {}, // 프롬프트 평가 결과
      selectedPrompt: null,
      finalReport: null,

      // Actions
      setCurrentTask: (task) => {
        set({ 
          currentTask: task,
          sessionStartTime: new Date().toISOString()
        })
      },

      setAvailableTasks: (tasks) => {
        set({ availableTasks: tasks })
      },

      setCurrentStep: (step) => {
        set({ currentStep: step })
        
        // 스텝 변경 시 진행률 업데이트
        const currentProgress = get().progress
        set({
          progress: {
            ...currentProgress,
            [`step${step}`]: 0
          }
        })
      },

      updateProgress: (stepData) => {
        const currentProgress = get().progress
        set({
          progress: {
            ...currentProgress,
            ...stepData
          }
        })
      },

      // Step 1: 자동 번역 관련
      setAutoTranslation: (translation) => {
        set({ autoTranslation: translation })
      },

      // Step 2-4: R&D 제공 번역문 설정
      setBaseTranslations: (translations) => {
        set({ baseTranslations: translations })
      },

      // 프롬프트 관리
      addPrompt: (prompt) => {
        const prompts = get().prompts
        const newPrompt = {
          id: Date.now().toString(),
          text: prompt.text,
          translation: prompt.translation,
          baseTranslationId: prompt.baseTranslationId,
          createdAt: new Date().toISOString(),
          rating: null,
          comment: null,
          qualityScore: null
        }
        
        set({ prompts: [...prompts, newPrompt] })
        return newPrompt
      },

      updatePrompt: (promptId, updates) => {
        const prompts = get().prompts
        set({
          prompts: prompts.map(prompt =>
            prompt.id === promptId
              ? { ...prompt, ...updates }
              : prompt
          )
        })
      },

      removePrompt: (promptId) => {
        const prompts = get().prompts
        set({
          prompts: prompts.filter(prompt => prompt.id !== promptId)
        })
      },

      // 평가 관리
      setEvaluation: (promptId, evaluation) => {
        const evaluations = get().evaluations
        set({
          evaluations: {
            ...evaluations,
            [promptId]: evaluation
          }
        })
      },

      updateEvaluation: (promptId, updates) => {
        const evaluations = get().evaluations
        set({
          evaluations: {
            ...evaluations,
            [promptId]: {
              ...evaluations[promptId],
              ...updates
            }
          }
        })
      },

      // 최종 선택
      setSelectedPrompt: (promptId) => {
        set({ selectedPrompt: promptId })
      },

      // 최종 리포트
      setFinalReport: (report) => {
        set({ finalReport: report })
      },

      updateFinalReport: (updates) => {
        const currentReport = get().finalReport
        set({
          finalReport: {
            ...currentReport,
            ...updates
          }
        })
      },

      // 유틸리티 메서드들
      getLikedPrompts: () => {
        const { prompts, evaluations } = get()
        return prompts.filter(prompt => 
          evaluations[prompt.id]?.rating === 'like'
        )
      },

      getDislikedPrompts: () => {
        const { prompts, evaluations } = get()
        return prompts.filter(prompt => 
          evaluations[prompt.id]?.rating === 'dislike'
        )
      },

      getPromptById: (promptId) => {
        const prompts = get().prompts
        return prompts.find(prompt => prompt.id === promptId)
      },

      getSessionDuration: () => {
        const startTime = get().sessionStartTime
        if (!startTime) return 0
        return Date.now() - new Date(startTime).getTime()
      },

      // 데이터 저장/불러오기
      saveProgress: async () => {
        const state = get()
        const progressData = {
          taskId: state.currentTask?.id,
          taskTitle: state.currentTask?.title,
          currentStep: state.currentStep,
          progress: state.progress,
          autoTranslation: state.autoTranslation,
          baseTranslations: state.baseTranslations,
          prompts: state.prompts,
          evaluations: state.evaluations,
          selectedPrompt: state.selectedPrompt,
          finalReport: state.finalReport,
          sessionStartTime: state.sessionStartTime
        }

        if (window.electronAPI && state.currentTask?.id) {
          try {
            const result = await window.electronAPI.user.saveProgress(
              state.currentTask.id,
              progressData
            )
            return result.success
          } catch (error) {
            console.error('Save progress error:', error)
            return false
          }
        }
        return false
      },

      loadProgress: async (taskId) => {
        if (window.electronAPI) {
          try {
            const result = await window.electronAPI.user.getProgress(taskId)
            if (result.success && result.data) {
              const data = result.data
              set({
                currentTask: { id: taskId, title: data.taskTitle },
                currentStep: data.currentStep || 1,
                progress: data.progress || {},
                autoTranslation: data.autoTranslation,
                baseTranslations: data.baseTranslations || [],
                prompts: data.prompts || [],
                evaluations: data.evaluations || {},
                selectedPrompt: data.selectedPrompt,
                finalReport: data.finalReport,
                sessionStartTime: data.sessionStartTime
              })
              return true
            }
          } catch (error) {
            console.error('Load progress error:', error)
          }
        }
        return false
      },

      clearProgress: async (taskId) => {
        if (window.electronAPI && taskId) {
          try {
            await window.electronAPI.user.clearProgress(taskId)
          } catch (error) {
            console.error('Clear progress error:', error)
          }
        }
        
        // 로컬 상태 초기화
        set({
          currentTask: null,
          currentStep: 1,
          progress: {},
          autoTranslation: null,
          baseTranslations: [],
          prompts: [],
          evaluations: {},
          selectedPrompt: null,
          finalReport: null,
          sessionStartTime: null
        })
      },

      // 전체 상태 리셋
      reset: () => {
        set({
          currentTask: null,
          availableTasks: [],
          currentStep: 1,
          progress: {},
          sessionStartTime: null,
          autoTranslation: null,
          baseTranslations: [],
          prompts: [],
          evaluations: {},
          selectedPrompt: null,
          finalReport: null
        })
      }
    }),
    {
      name: 'workflow-store',
      partialize: (state) => ({
        // 현재 작업과 진행률만 persist
        currentTask: state.currentTask,
        currentStep: state.currentStep,
        progress: state.progress,
        sessionStartTime: state.sessionStartTime
        // 다른 데이터는 별도로 저장됨
      })
    }
  )
)

export { useWorkflowStore }
