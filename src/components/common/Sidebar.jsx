import React, { useState } from 'react'
import styles from '../../styles/modules/Sidebar.module.css'

// SVG 아이콘 컴포넌트들
const Icons = {
  Home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  ),
  Task: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  ),
  AI: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
      <path d="M12 12h.01" />
    </svg>
  ),
  Prompt: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 9h8" />
      <path d="M8 13h6" />
    </svg>
  ),
  Translation: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 8l6 6 6-6" />
      <path d="M12 2v12" />
      <path d="M2 18h20" />
    </svg>
  ),
  Report: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  ),
  Settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6,9 12,15 18,9" />
    </svg>
  ),
  ChevronUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="18,15 12,9 6,15" />
    </svg>
  ),
  Menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Logout: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

const Sidebar = ({ 
  expanded = true,
  onToggle,
  user = {
    name: 'Guest',
    email: 'guest@example.com',
    avatar: null
  },
  onLogout,
  onNavigate, // 네비게이션 콜백 함수 추가
  currentPage = '' // 현재 페이지 정보 추가
}) => {
  const [expandedItems, setExpandedItems] = useState({
    translation: true,
    ai: false,
    prompt: false,
    report: false
  })
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const toggleItem = (itemKey) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }))
  }

  const toggleUserMenu = () => {
    setUserMenuOpen(prev => !prev)
  }

  const handleLogout = () => {
    setUserMenuOpen(false)
    if (onLogout) {
      onLogout()
    }
  }

    // 네비게이션 핸들러
  const handleNavigation = async (itemId, subItemId = null) => {
if (onNavigate) {
      await onNavigate(itemId, subItemId)
    }
  }

  // 현재 페이지에 따른 활성화 상태 결정
  const isHomeActive = currentPage === '홈'
  const isMyTasksActive = currentPage === '나의 과제'
  const isProgressActive = currentPage === '진행 현황'
  const isSettingsActive = currentPage === '설정'

  const navigationItems = [
    {
      id: 'home',
      label: '홈',
      icon: <Icons.Home />,
      active: isHomeActive,
      hasSubItems: false
    },
    {
      id: 'translation',
      label: 'AI 번역 작업',
      icon: <Icons.Translation />,
      expanded: expandedItems.translation,
      active: isMyTasksActive || isProgressActive, // 하위 메뉴가 활성화되면 상위 메뉴도 활성화
      hasSubItems: true,
      subItems: [
        { id: 'my-tasks', label: '나의 과제', active: isMyTasksActive },
        { id: 'progress', label: '진행 현황', active: isProgressActive }
      ]
    },
    {
      id: 'settings',
      label: '설정',
      icon: <Icons.Settings />,
      active: isSettingsActive,
      hasSubItems: false
    },
    // {
    //   id: 'ai',
    //   label: 'AI 도구',
    //   icon: <Icons.AI />,
    //   expanded: expandedItems.ai,
    //   active: false,
    //   hasSubItems: true,
    //   subItems: [
    //     { id: 'translation-ai', label: '번역 AI' },
    //     { id: 'prompt-ai', label: '프롬프트 AI' },
    //     { id: 'quality-ai', label: '품질 검증 AI' }
    //   ]
    // }, // AI 도구 메뉴 숨김
    // {
    //   id: 'prompt',
    //   label: '프롬프트 관리',
    //   icon: <Icons.Prompt />,
    //   expanded: expandedItems.prompt,
    //   active: false,
    //   hasSubItems: true,
    //   subItems: [
    //     { id: 'prompt-library', label: '프롬프트 라이브러리' },
    //     { id: 'prompt-history', label: '프롬프트 히스토리' },
    //     { id: 'prompt-templates', label: '프롬프트 템플릿' }
    //   ]
    // }, // 프롬프트 관리 메뉴 숨김
    // {
    //   id: 'report',
    //   label: '리포트',
    //   icon: <Icons.Report />,
    //   expanded: expandedItems.report,
    //   active: false,
    //   hasSubItems: true,
    //   subItems: [
    //     { id: 'translation-report', label: '번역 리포트' },
    //     { id: 'quality-report', label: '품질 리포트' }
    //     // { id: 'performance-report', label: '성과 리포트' } // 숨김 처리
    //   ]
    // } // 리포트 메뉴 전체 숨김 처리
  ]

  const bottomItems = [
    // 설정 버튼을 상단 메뉴로 이동하였으므로 하단에서 제거
  ]

  if (!expanded) {
    return (
      <div className={styles.sidebarCollapsed}>
        <div className={styles.headerCollapsed}>
          <button 
            className={styles.toggleButton}
            onClick={onToggle}
            title="사이드바 확장"
          >
            <Icons.Menu />
          </button>
        </div>
        <nav className={styles.navCollapsed}>
          {navigationItems.map(item => (
            <div 
              key={item.id} 
              className={styles.navItemCollapsed}
              onClick={() => handleNavigation(item.id)}
              style={{ cursor: 'pointer' }}
            >
              {item.icon}
              {item.active && <div className={styles.activeIndicator} />}
            </div>
          ))}
        </nav>
      </div>
    )
  }

  return (
    <div className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoText}>웹소설MT</span>
        </div>
        <button 
          className={styles.toggleButton}
          onClick={onToggle}
          title="사이드바 축소"
        >
          <Icons.Menu />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className={styles.navigation}>
        {navigationItems.map(item => (
          <div key={item.id}>
            <div 
              className={`${styles.navItem} ${item.active ? styles.active : ''}`}
              onClick={() => {
                if (item.hasSubItems) {
                  toggleItem(item.id)
                } else {
                  handleNavigation(item.id)
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.navItemContent}>
                {item.icon}
                <span className={styles.label}>{item.label}</span>
              </div>
              {item.hasSubItems && (
                <span className={`${styles.chevron} ${item.expanded ? styles.expanded : ''}`}>
                  {item.expanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                </span>
              )}
            </div>
            
            {/* Sub Items */}
            {item.expanded && item.subItems && (
              <div className={styles.subItems}>
                {item.subItems.map(subItem => (
                  <div 
                    key={subItem.id} 
                    className={`${styles.subItem} ${subItem.active ? styles.active : ''}`}
                    onClick={() => handleNavigation(item.id, subItem.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {subItem.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Navigation - 설정 메뉴를 상단으로 이동하였으므로 제거 */}
      {bottomItems.length > 0 && (
        <div className={styles.bottomNavigation}>
          {bottomItems.map(item => (
            <div 
              key={item.id} 
              className={`${styles.bottomItem} ${item.active ? styles.active : ''}`}
              onClick={() => handleNavigation(item.id)}
              style={{ cursor: 'pointer' }}
            >
              {item.icon}
              <span className={styles.label}>{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* User Profile */}
      <div className={styles.userProfileContainer}>
        <div 
          className={`${styles.userProfile} ${userMenuOpen ? styles.active : ''}`}
          onClick={toggleUserMenu}
        >
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.name}</span>
            <span className={styles.userEmail}>{user.email}</span>
          </div>
          <div className={`${styles.chevron} ${userMenuOpen ? styles.expanded : ''}`}>
            {userMenuOpen ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
          </div>
        </div>
        
        {/* User Dropdown Menu */}
        {userMenuOpen && (
          <div className={styles.userDropdown}>
            <button 
              className={styles.dropdownItem}
              onClick={handleLogout}
            >
              <Icons.Logout />
              <span>로그아웃</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
