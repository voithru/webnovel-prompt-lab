import { create } from 'zustand'

const useTaskStore = create((set, get) => ({
  // State
  tasks: [],
  currentSpreadsheetUrl: '',
  isLoading: false,
  error: null,
  lastSyncTime: null,

  // Actions
  setTasks: (tasks) => {
    set({ 
      tasks,
      lastSyncTime: new Date().toISOString()
    })
  },

  setCurrentSpreadsheetUrl: (url) => {
    set({ currentSpreadsheetUrl: url })
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

  // 스프레드시트에서 과제 불러오기
  loadTasksFromSpreadsheet: async (spreadsheetUrl) => {
    set({ isLoading: true, error: null })
    
    try {
      if (!window.electronAPI) {
        throw new Error('Electron API를 사용할 수 없습니다.')
      }

      // 먼저 스프레드시트 유효성 검사
      const validationResult = await window.electronAPI.sheets.validate(spreadsheetUrl)
      if (!validationResult.success) {
        throw new Error(validationResult.error)
      }

      // 과제 데이터 로드
      const result = await window.electronAPI.sheets.loadTasks(spreadsheetUrl)
      if (!result.success) {
        throw new Error(result.error)
      }

      // 과제 데이터 가공 및 검증
      const processedTasks = result.tasks.map(task => ({
        id: task.id || task.task_id,
        title: task.title || task.task_title || `과제 ${task.id}`,
        originalText: task.original_text || task.originalText || '',
        worldbuildingSettings: task.worldbuilding_settings || task.worldbuildingSettings || {},
        metadata: task.metadata || {},
        status: task.status || 'pending',
        assignedTo: task.assigned_to || task.assignedTo || '',
        priority: task.priority || 'normal',
        difficulty: task.difficulty || 'medium',
        estimatedTime: task.estimated_time || task.estimatedTime || 30,
        tags: task.tags ? (Array.isArray(task.tags) ? task.tags : task.tags.split(',').map(t => t.trim())) : [],
        createdAt: task.created_at || task.createdAt || new Date().toISOString(),
        updatedAt: task.updated_at || task.updatedAt || new Date().toISOString(),
        // R&D 팀 제공 번역문들
        baseTranslations: [
          {
            id: 'rd_translation_1',
            text: task.rd_translation_1 || '',
            source: 'R&D Team - Version 1',
            quality: task.rd_quality_1 || 'medium',
            notes: task.rd_notes_1 || ''
          },
          {
            id: 'rd_translation_2',
            text: task.rd_translation_2 || '',
            source: 'R&D Team - Version 2',
            quality: task.rd_quality_2 || 'medium',
            notes: task.rd_notes_2 || ''
          },
          {
            id: 'rd_translation_3',
            text: task.rd_translation_3 || '',
            source: 'R&D Team - Version 3',
            quality: task.rd_quality_3 || 'medium',
            notes: task.rd_notes_3 || ''
          }
        ].filter(translation => translation.text) // 빈 번역문 제거
      }))

      // 유효한 과제만 필터링 (필수 필드가 있는지 확인)
      const validTasks = processedTasks.filter(task => 
        task.id && task.originalText && task.baseTranslations.length > 0
      )

      set({
        tasks: validTasks,
        currentSpreadsheetUrl: spreadsheetUrl,
        lastSyncTime: new Date().toISOString(),
        error: null
      })

      return {
        success: true,
        tasks: validTasks,
        totalCount: validTasks.length,
        spreadsheetInfo: validationResult.spreadsheet
      }

    } catch (error) {
      console.error('Load tasks error:', error)
      const errorMessage = error.message || '과제를 불러오는데 실패했습니다.'
      set({ error: errorMessage })
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      set({ isLoading: false })
    }
  },

  // 특정 과제의 상세 데이터 가져오기
  loadTaskDetails: async (taskId) => {
    set({ isLoading: true, error: null })
    
    try {
      if (!window.electronAPI) {
        throw new Error('Electron API를 사용할 수 없습니다.')
      }

      const spreadsheetUrl = get().currentSpreadsheetUrl
      if (!spreadsheetUrl) {
        throw new Error('스프레드시트 URL이 설정되지 않았습니다.')
      }

      const result = await window.electronAPI.sheets.getTaskData(taskId, spreadsheetUrl)
      if (!result.success) {
        throw new Error(result.error)
      }

      return {
        success: true,
        taskData: result.taskData
      }

    } catch (error) {
      console.error('Load task details error:', error)
      const errorMessage = error.message || '과제 세부사항을 불러오는데 실패했습니다.'
      set({ error: errorMessage })
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      set({ isLoading: false })
    }
  },

  // 과제 상태 업데이트
  updateTaskStatus: async (taskId, status) => {
    try {
      if (!window.electronAPI) {
        throw new Error('Electron API를 사용할 수 없습니다.')
      }

      const spreadsheetUrl = get().currentSpreadsheetUrl
      if (!spreadsheetUrl) {
        throw new Error('스프레드시트 URL이 설정되지 않았습니다.')
      }

      const result = await window.electronAPI.sheets.updateTaskStatus(taskId, status, spreadsheetUrl)
      if (!result.success) {
        throw new Error(result.error)
      }

      // 로컬 상태 업데이트
      const tasks = get().tasks
      set({
        tasks: tasks.map(task =>
          task.id === taskId
            ? { ...task, status, updatedAt: new Date().toISOString() }
            : task
        )
      })

      return { success: true }

    } catch (error) {
      console.error('Update task status error:', error)
      set({ error: error.message || '과제 상태 업데이트에 실패했습니다.' })
      return {
        success: false,
        error: error.message
      }
    }
  },

  // 과제 필터링 및 검색
  getFilteredTasks: (filters = {}) => {
    const tasks = get().tasks
    let filteredTasks = [...tasks]

    // 상태별 필터링
    if (filters.status && filters.status !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status)
    }

    // 난이도별 필터링
    if (filters.difficulty && filters.difficulty !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.difficulty === filters.difficulty)
    }

    // 우선순위별 필터링
    if (filters.priority && filters.priority !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === filters.priority)
    }

    // 담당자별 필터링
    if (filters.assignedTo) {
      filteredTasks = filteredTasks.filter(task => 
        task.assignedTo.toLowerCase().includes(filters.assignedTo.toLowerCase())
      )
    }

    // 텍스트 검색
    if (filters.searchText) {
      const searchText = filters.searchText.toLowerCase()
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchText) ||
        task.originalText.toLowerCase().includes(searchText) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchText))
      )
    }

    // 태그 필터링
    if (filters.tags && filters.tags.length > 0) {
      filteredTasks = filteredTasks.filter(task =>
        filters.tags.some(tag => task.tags.includes(tag))
      )
    }

    // 정렬
    if (filters.sortBy) {
      filteredTasks.sort((a, b) => {
        const direction = filters.sortOrder === 'desc' ? -1 : 1
        
        switch (filters.sortBy) {
          case 'title':
            return direction * a.title.localeCompare(b.title)
          case 'priority':
            const priorityOrder = { high: 3, normal: 2, low: 1 }
            return direction * (priorityOrder[a.priority] - priorityOrder[b.priority])
          case 'difficulty':
            const difficultyOrder = { hard: 3, medium: 2, easy: 1 }
            return direction * (difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
          case 'createdAt':
            return direction * (new Date(a.createdAt) - new Date(b.createdAt))
          case 'updatedAt':
            return direction * (new Date(a.updatedAt) - new Date(b.updatedAt))
          case 'estimatedTime':
            return direction * (a.estimatedTime - b.estimatedTime)
          default:
            return 0
        }
      })
    }

    return filteredTasks
  },

  // 통계 데이터 계산
  getTaskStatistics: () => {
    const tasks = get().tasks
    
    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      cancelled: tasks.filter(t => t.status === 'cancelled').length,
      
      byDifficulty: {
        easy: tasks.filter(t => t.difficulty === 'easy').length,
        medium: tasks.filter(t => t.difficulty === 'medium').length,
        hard: tasks.filter(t => t.difficulty === 'hard').length
      },
      
      byPriority: {
        low: tasks.filter(t => t.priority === 'low').length,
        normal: tasks.filter(t => t.priority === 'normal').length,
        high: tasks.filter(t => t.priority === 'high').length
      },

      totalEstimatedTime: tasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0),
      averageEstimatedTime: tasks.length > 0 
        ? tasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0) / tasks.length 
        : 0
    }

    return stats
  },

  // 과제 ID로 과제 찾기
  getTaskById: (taskId) => {
    const tasks = get().tasks
    return tasks.find(task => task.id === taskId)
  },

  // 모든 고유 태그 가져오기
  getAllTags: () => {
    const tasks = get().tasks
    const allTags = tasks.flatMap(task => task.tags)
    return [...new Set(allTags)].sort()
  },

  // 스프레드시트 동기화
  syncWithSpreadsheet: async () => {
    const currentUrl = get().currentSpreadsheetUrl
    if (!currentUrl) {
      set({ error: '동기화할 스프레드시트가 설정되지 않았습니다.' })
      return { success: false, error: '동기화할 스프레드시트가 설정되지 않았습니다.' }
    }

    return await get().loadTasksFromSpreadsheet(currentUrl)
  },

  // 데이터 초기화
  reset: () => {
    set({
      tasks: [],
      currentSpreadsheetUrl: '',
      error: null,
      lastSyncTime: null
    })
  }
}))

export { useTaskStore }
