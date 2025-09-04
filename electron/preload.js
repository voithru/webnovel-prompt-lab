const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Auth related
  auth: {
    googleLogin: () => ipcRenderer.invoke('auth:google-login'),
    logout: () => ipcRenderer.invoke('auth:logout'),
    getUser: () => ipcRenderer.invoke('auth:get-user'),
    refreshToken: () => ipcRenderer.invoke('auth:refresh-token')
  },

  // Google Sheets related  
  sheets: {
    loadTasks: (spreadsheetUrl) => ipcRenderer.invoke('sheets:load-tasks', spreadsheetUrl),
    getTaskData: (taskId) => ipcRenderer.invoke('sheets:get-task-data', taskId),
    validateSpreadsheet: (url) => ipcRenderer.invoke('sheets:validate', url)
  },

  // LLM related
  llm: {
    generateTranslation: (text, settings, prompt) => 
      ipcRenderer.invoke('llm:generate-translation', text, settings, prompt),
    improveTranslation: (originalText, translation, prompt) =>
      ipcRenderer.invoke('llm:improve-translation', originalText, translation, prompt),
    validatePrompt: (prompt) => ipcRenderer.invoke('llm:validate-prompt', prompt),
    getModels: () => ipcRenderer.invoke('llm:get-models')
  },

  // Webhook related
  webhook: {
    submitResults: (data) => ipcRenderer.invoke('webhook:submit-results', data),
    submitFinalReport: (data) => ipcRenderer.invoke('webhook:submit-final-report', data),
    testConnection: (url) => ipcRenderer.invoke('webhook:test-connection', url)
  },

  // User data management
  user: {
    saveProgress: (data) => ipcRenderer.invoke('user:save-progress', data),
    getProgress: (taskId) => ipcRenderer.invoke('user:get-progress', taskId),
    clearProgress: (taskId) => ipcRenderer.invoke('user:clear-progress', taskId),
    exportData: () => ipcRenderer.invoke('user:export-data')
  },

  // File operations
  file: {
    openDialog: (options) => ipcRenderer.invoke('file:open-dialog', options),
    saveDialog: (options) => ipcRenderer.invoke('file:save-dialog', options),
    readFile: (filePath) => ipcRenderer.invoke('file:read', filePath),
    writeFile: (filePath, data) => ipcRenderer.invoke('file:write', filePath, data)
  },

  // System
  system: {
    getVersion: () => ipcRenderer.invoke('system:get-version'),
    getPlatform: () => process.platform,
    openExternal: (url) => ipcRenderer.invoke('system:open-external', url),
    showItemInFolder: (path) => ipcRenderer.invoke('system:show-item-in-folder', path)
  },

  // HTTP 요청 (CORS 우회용)
  fetchUrl: (url) => ipcRenderer.invoke('http:fetch-url', url),

  // Event listeners
  on: (channel, callback) => {
    // 허용된 채널만 수신
    const validChannels = [
      'main-process-message',
      'menu-new-project',
      'menu-open-project', 
      'menu-save',
      'task-progress-update',
      'llm-response-stream',
      'auth:login-success',
      'auth:login-error'
    ]
    
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, callback)
    }
  },

  removeListener: (channel, callback) => {
    ipcRenderer.removeListener(channel, callback)
  }
})
