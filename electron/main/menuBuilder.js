const { Menu, app, shell } = require('electron')

const menuBuilder = {
  buildMenu(mainWindow) {
    const isMac = process.platform === 'darwin'

    const template = [
      // App Menu (macOS only)
      ...(isMac ? [{
        label: app.getName(),
        submenu: [
          { role: 'about', label: '앱 정보' },
          { type: 'separator' },
          { role: 'services', label: '서비스' },
          { type: 'separator' },
          { role: 'hide', label: '숨기기' },
          { role: 'hideothers', label: '다른 창 숨기기' },
          { role: 'unhide', label: '모두 보이기' },
          { type: 'separator' },
          { role: 'quit', label: '종료' }
        ]
      }] : []),

      // File Menu
      {
        label: '파일',
        submenu: [
          {
            label: '새 프로젝트',
            accelerator: 'CmdOrCtrl+N',
            click: () => {
              mainWindow.webContents.send('menu-new-project')
            }
          },
          {
            label: '프로젝트 열기',
            accelerator: 'CmdOrCtrl+O',
            click: () => {
              mainWindow.webContents.send('menu-open-project')
            }
          },
          { type: 'separator' },
          {
            label: '저장',
            accelerator: 'CmdOrCtrl+S',
            click: () => {
              mainWindow.webContents.send('menu-save')
            }
          },
          { type: 'separator' },
          ...(isMac ? [] : [{ role: 'quit', label: '종료' }])
        ]
      },

      // Edit Menu
      {
        label: '편집',
        submenu: [
          { role: 'undo', label: '실행 취소' },
          { role: 'redo', label: '다시 실행' },
          { type: 'separator' },
          { role: 'cut', label: '잘라내기' },
          { role: 'copy', label: '복사' },
          { role: 'paste', label: '붙여넣기' },
          { role: 'selectall', label: '모두 선택' }
        ]
      },

      // View Menu
      {
        label: '보기',
        submenu: [
          { role: 'reload', label: '새로고침' },
          { role: 'forceReload', label: '강제 새로고침' },
          { role: 'toggleDevTools', label: '개발자 도구' },
          { type: 'separator' },
          { role: 'resetZoom', label: '원래 크기' },
          { role: 'zoomIn', label: '확대' },
          { role: 'zoomOut', label: '축소' },
          { type: 'separator' },
          { role: 'togglefullscreen', label: '전체화면' }
        ]
      },

      // Window Menu
      {
        label: '창',
        submenu: [
          { role: 'minimize', label: '최소화' },
          { role: 'close', label: '닫기' },
          ...(isMac ? [
            { type: 'separator' },
            { role: 'front', label: '모든 창 앞으로' }
          ] : [])
        ]
      },

      // Help Menu
      {
        role: 'help',
        submenu: [
          {
            label: '웹사이트 방문',
            click: async () => {
              await shell.openExternal('https://github.com/your-repo')
            }
          }
        ]
      }
    ]

    return Menu.buildFromTemplate(template)
  }
}

module.exports = { menuBuilder }
