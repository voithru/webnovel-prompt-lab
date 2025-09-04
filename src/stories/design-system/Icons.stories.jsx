import React from 'react'

export default {
  title: 'Design System/Icons',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '웹소설 MT 프롬프트 AI 애플리케이션의 아이콘 시스템입니다. 일관된 시각적 언어와 의미 체계를 제공합니다.'
      }
    }
  }
}

// Icon library - SVG components based on Figma design
const IconLibrary = {
  // Navigation & Actions
  Dashboard: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  
  Project: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  ),
  
  Prompt: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2v6h6" />
      <line x1="9" y1="15" x2="15" y2="15" />
      <line x1="12" y1="18" x2="12" y2="12" />
    </svg>
  ),
  
  Evaluate: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  
  Report: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  
  Settings: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),

  // Common Actions
  Plus: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  
  Edit: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  
  Delete: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <polyline points="3,6 5,6 21,6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  
  Save: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17,21 17,13 7,13 17,21" />
      <polyline points="7,3 7,8 15,8" />
    </svg>
  ),
  
  Copy: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  
  Download: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7,10 12,15 17,10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),

  // UI Elements
  Search: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  ),
  
  Filter: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  
  Sort: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M3 6h18" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  ),
  
  Menu: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  
  Close: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),

  // Status & Feedback
  Check: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  ),
  
  Alert: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  
  Info: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  
  Error: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),

  // User & Auth
  User: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  
  Login: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10,17 15,12 10,7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  ),
  
  Logout: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),

  // Communication
  Mail: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  
  MessageSquare: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),

  // Navigation
  ArrowLeft: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12,19 5,12 12,5" />
    </svg>
  ),
  
  ArrowRight: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12,5 19,12 12,19" />
    </svg>
  ),
  
  ArrowUp: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5,12 12,5 19,12" />
    </svg>
  ),
  
  ArrowDown: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="5,12 12,19 19,12" />
    </svg>
  ),

  // Media & Files
  Upload: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17,8 12,3 7,8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  
  File: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  ),

  // Interface Controls
  Eye: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  
  EyeOff: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),

  // Special - Application Specific
  AI: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  
  Translate: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M5 8l6 6" />
      <path d="M4 14l6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="M22 22l-5-10-5 10" />
      <path d="M14 18h6" />
    </svg>
  ),
  
  Brain: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  )
}

// Icon specimen component
const IconSpecimen = ({ name, category, description, usage, Icon }) => (
  <div style={{
    padding: 'var(--spacing-4)',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-base)',
    textAlign: 'center'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 'var(--spacing-3)',
      padding: 'var(--spacing-3)',
      backgroundColor: 'var(--bg-primary)',
      borderRadius: 'var(--radius-md)'
    }}>
      <Icon size={32} color="var(--fg-primary)" />
    </div>
    
    <div style={{
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-medium)',
      color: 'var(--fg-primary)',
      marginBottom: 'var(--spacing-1)'
    }}>
      {name}
    </div>
    
    <div style={{
      fontSize: 'var(--text-xs)',
      color: 'var(--fg-tertiary)',
      marginBottom: 'var(--spacing-2)'
    }}>
      {category}
    </div>
    
    {description && (
      <div style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--fg-secondary)',
        marginBottom: 'var(--spacing-2)',
        lineHeight: 'var(--leading-normal)'
      }}>
        {description}
      </div>
    )}
    
    {usage && (
      <div style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--fg-tertiary)',
        fontStyle: 'italic'
      }}>
        사용: {usage}
      </div>
    )}
  </div>
)

// Navigation icons
export const NavigationIcons = {
  render: () => (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <h2 style={{ 
        color: 'var(--fg-primary)', 
        marginBottom: 'var(--spacing-6)',
        fontSize: 'var(--text-2xl)'
      }}>
        네비게이션 아이콘
      </h2>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 'var(--spacing-4)'
      }}>
        <IconSpecimen 
          name="Dashboard" 
          category="Navigation"
          description="대시보드 메인 페이지"
          usage="사이드바, 네비게이션"
          Icon={IconLibrary.Dashboard} 
        />
        <IconSpecimen 
          name="Project" 
          category="Navigation"
          description="프로젝트 관리"
          usage="프로젝트 목록, 메뉴"
          Icon={IconLibrary.Project} 
        />
        <IconSpecimen 
          name="Prompt" 
          category="Navigation"
          description="프롬프트 작성 및 관리"
          usage="프롬프트 섹션"
          Icon={IconLibrary.Prompt} 
        />
        <IconSpecimen 
          name="Evaluate" 
          category="Navigation"
          description="평가 및 리뷰"
          usage="평가 섹션"
          Icon={IconLibrary.Evaluate} 
        />
        <IconSpecimen 
          name="Report" 
          category="Navigation"
          description="리포트 및 분석"
          usage="리포트 섹션"
          Icon={IconLibrary.Report} 
        />
        <IconSpecimen 
          name="Settings" 
          category="Navigation"
          description="설정 및 환경설정"
          usage="설정 메뉴"
          Icon={IconLibrary.Settings} 
        />
      </div>
    </div>
  )
}

// Action icons
export const ActionIcons = {
  render: () => (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <h2 style={{ 
        color: 'var(--fg-primary)', 
        marginBottom: 'var(--spacing-6)',
        fontSize: 'var(--text-2xl)'
      }}>
        액션 아이콘
      </h2>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 'var(--spacing-4)'
      }}>
        <IconSpecimen 
          name="Plus" 
          category="Action"
          description="추가, 생성"
          usage="새 항목 추가"
          Icon={IconLibrary.Plus} 
        />
        <IconSpecimen 
          name="Edit" 
          category="Action"
          description="편집, 수정"
          usage="편집 버튼"
          Icon={IconLibrary.Edit} 
        />
        <IconSpecimen 
          name="Delete" 
          category="Action"
          description="삭제, 제거"
          usage="삭제 버튼"
          Icon={IconLibrary.Delete} 
        />
        <IconSpecimen 
          name="Save" 
          category="Action"
          description="저장"
          usage="저장 버튼"
          Icon={IconLibrary.Save} 
        />
        <IconSpecimen 
          name="Copy" 
          category="Action"
          description="복사"
          usage="복사 버튼"
          Icon={IconLibrary.Copy} 
        />
        <IconSpecimen 
          name="Download" 
          category="Action"
          description="다운로드"
          usage="다운로드 버튼"
          Icon={IconLibrary.Download} 
        />
      </div>
    </div>
  )
}

// UI control icons
export const UIControlIcons = {
  render: () => (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <h2 style={{ 
        color: 'var(--fg-primary)', 
        marginBottom: 'var(--spacing-6)',
        fontSize: 'var(--text-2xl)'
      }}>
        UI 컨트롤 아이콘
      </h2>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 'var(--spacing-4)'
      }}>
        <IconSpecimen 
          name="Search" 
          category="UI Control"
          description="검색"
          usage="검색 입력 필드"
          Icon={IconLibrary.Search} 
        />
        <IconSpecimen 
          name="Filter" 
          category="UI Control"
          description="필터링"
          usage="필터 버튼"
          Icon={IconLibrary.Filter} 
        />
        <IconSpecimen 
          name="Sort" 
          category="UI Control"
          description="정렬"
          usage="정렬 버튼"
          Icon={IconLibrary.Sort} 
        />
        <IconSpecimen 
          name="Menu" 
          category="UI Control"
          description="메뉴 열기"
          usage="햄버거 메뉴"
          Icon={IconLibrary.Menu} 
        />
        <IconSpecimen 
          name="Close" 
          category="UI Control"
          description="닫기"
          usage="모달, 팝업 닫기"
          Icon={IconLibrary.Close} 
        />
        <IconSpecimen 
          name="Eye" 
          category="UI Control"
          description="보기, 표시"
          usage="비밀번호 표시"
          Icon={IconLibrary.Eye} 
        />
      </div>
    </div>
  )
}

// Status icons
export const StatusIcons = {
  render: () => (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <h2 style={{ 
        color: 'var(--fg-primary)', 
        marginBottom: 'var(--spacing-6)',
        fontSize: 'var(--text-2xl)'
      }}>
        상태 아이콘
      </h2>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 'var(--spacing-4)'
      }}>
        <IconSpecimen 
          name="Check" 
          category="Status"
          description="성공, 완료"
          usage="성공 메시지"
          Icon={IconLibrary.Check} 
        />
        <IconSpecimen 
          name="Alert" 
          category="Status"
          description="경고"
          usage="경고 메시지"
          Icon={IconLibrary.Alert} 
        />
        <IconSpecimen 
          name="Info" 
          category="Status"
          description="정보"
          usage="정보 메시지"
          Icon={IconLibrary.Info} 
        />
        <IconSpecimen 
          name="Error" 
          category="Status"
          description="오류"
          usage="에러 메시지"
          Icon={IconLibrary.Error} 
        />
      </div>
    </div>
  )
}

// Application specific icons
export const ApplicationIcons = {
  render: () => (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <h2 style={{ 
        color: 'var(--fg-primary)', 
        marginBottom: 'var(--spacing-6)',
        fontSize: 'var(--text-2xl)'
      }}>
        애플리케이션 전용 아이콘
      </h2>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 'var(--spacing-4)'
      }}>
        <IconSpecimen 
          name="AI" 
          category="Application"
          description="AI 기능"
          usage="AI 관련 섹션"
          Icon={IconLibrary.AI} 
        />
        <IconSpecimen 
          name="Translate" 
          category="Application"
          description="번역 기능"
          usage="번역 관련 기능"
          Icon={IconLibrary.Translate} 
        />
        <IconSpecimen 
          name="Brain" 
          category="Application"
          description="지능형 분석"
          usage="고급 분석 기능"
          Icon={IconLibrary.Brain} 
        />
      </div>
    </div>
  )
}

// Icon sizes
export const IconSizes = {
  render: () => (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <h2 style={{ 
        color: 'var(--fg-primary)', 
        marginBottom: 'var(--spacing-6)',
        fontSize: 'var(--text-2xl)'
      }}>
        아이콘 크기 시스템
      </h2>
      
      <div style={{ display: 'grid', gap: 'var(--spacing-6)' }}>
        {[
          { size: 16, name: 'Small', usage: '텍스트 인라인, 작은 버튼' },
          { size: 20, name: 'Medium', usage: '일반 버튼, 입력 필드' },
          { size: 24, name: 'Large (Default)', usage: '기본 크기, 대부분의 UI' },
          { size: 32, name: 'Extra Large', usage: '큰 버튼, 카드 헤더' },
          { size: 48, name: '2X Large', usage: '임팩트 있는 섹션' },
          { size: 64, name: '3X Large', usage: '히어로 섹션, 빈 상태' }
        ].map((sizeInfo, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-6)',
            padding: 'var(--spacing-4)',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-base)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)'
            }}>
              <IconLibrary.Dashboard size={sizeInfo.size} color="var(--fg-primary)" />
            </div>
            
            <div>
              <div style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-medium)',
                color: 'var(--fg-primary)',
                marginBottom: 'var(--spacing-1)'
              }}>
                {sizeInfo.name}
              </div>
              <div style={{
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--fg-secondary)',
                marginBottom: 'var(--spacing-2)'
              }}>
                {sizeInfo.size}px
              </div>
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--fg-tertiary)'
              }}>
                {sizeInfo.usage}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Semantic colors
export const SemanticColors = {
  render: () => (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <h2 style={{ 
        color: 'var(--fg-primary)', 
        marginBottom: 'var(--spacing-6)',
        fontSize: 'var(--text-2xl)'
      }}>
        시맨틱 색상 적용
      </h2>
      
      <p style={{
        color: 'var(--fg-secondary)',
        marginBottom: 'var(--spacing-8)',
        fontSize: 'var(--text-base)'
      }}>
        아이콘에 의미에 따른 색상을 적용한 예시입니다.
      </p>
      
      <div style={{ display: 'grid', gap: 'var(--spacing-6)' }}>
        {[
          { 
            category: 'Success',
            color: 'var(--fg-success)',
            icons: [
              { name: 'Check', Icon: IconLibrary.Check, usage: '작업 완료' },
              { name: 'Save', Icon: IconLibrary.Save, usage: '저장 성공' }
            ]
          },
          { 
            category: 'Warning',
            color: 'var(--fg-warning)',
            icons: [
              { name: 'Alert', Icon: IconLibrary.Alert, usage: '주의 필요' },
              { name: 'Edit', Icon: IconLibrary.Edit, usage: '수정 필요' }
            ]
          },
          { 
            category: 'Error',
            color: 'var(--fg-error)',
            icons: [
              { name: 'Error', Icon: IconLibrary.Error, usage: '오류 발생' },
              { name: 'Delete', Icon: IconLibrary.Delete, usage: '삭제 위험' }
            ]
          },
          { 
            category: 'Info',
            color: 'var(--fg-info)',
            icons: [
              { name: 'Info', Icon: IconLibrary.Info, usage: '정보 제공' },
              { name: 'AI', Icon: IconLibrary.AI, usage: 'AI 기능' }
            ]
          }
        ].map((colorGroup, index) => (
          <div key={index} style={{
            padding: 'var(--spacing-6)',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-base)'
          }}>
            <h3 style={{
              color: 'var(--fg-primary)',
              marginBottom: 'var(--spacing-4)',
              fontSize: 'var(--text-lg)'
            }}>
              {colorGroup.category} 아이콘
            </h3>
            
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-6)',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              {colorGroup.icons.map((iconInfo, iconIndex) => (
                <div key={iconIndex} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-3)',
                  padding: 'var(--spacing-3)',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-base)'
                }}>
                  <iconInfo.Icon size={24} color={colorGroup.color} />
                  <div>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-medium)',
                      color: 'var(--fg-primary)'
                    }}>
                      {iconInfo.name}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--fg-tertiary)'
                    }}>
                      {iconInfo.usage}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Usage guidelines
export const UsageGuidelines = {
  render: () => (
    <div style={{ padding: 'var(--spacing-6)', maxWidth: '800px' }}>
      <h2 style={{ 
        color: 'var(--fg-primary)', 
        marginBottom: 'var(--spacing-6)',
        fontSize: 'var(--text-2xl)'
      }}>
        아이콘 사용 가이드라인
      </h2>
      
      <div style={{ display: 'grid', gap: 'var(--spacing-8)' }}>
        <div style={{
          backgroundColor: 'var(--bg-info)',
          padding: 'var(--spacing-6)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-info)'
        }}>
          <h3 style={{ 
            color: 'var(--fg-primary)',
            marginBottom: 'var(--spacing-4)',
            fontSize: 'var(--text-lg)'
          }}>
            크기 선택 가이드
          </h3>
          <ul style={{ 
            color: 'var(--fg-primary)',
            paddingLeft: 'var(--spacing-5)',
            margin: 0
          }}>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              <strong>16px:</strong> 인라인 텍스트, 작은 버튼 내부
            </li>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              <strong>20px:</strong> 입력 필드, 중간 버튼
            </li>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              <strong>24px:</strong> 기본 크기, 대부분의 UI 요소
            </li>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              <strong>32px+:</strong> 강조가 필요한 영역, 카드 헤더
            </li>
          </ul>
        </div>
        
        <div style={{
          backgroundColor: 'var(--bg-success)',
          padding: 'var(--spacing-6)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-success)'
        }}>
          <h3 style={{ 
            color: 'var(--fg-primary)',
            marginBottom: 'var(--spacing-4)',
            fontSize: 'var(--text-lg)'
          }}>
            색상 적용 원칙
          </h3>
          <ul style={{ 
            color: 'var(--fg-primary)',
            paddingLeft: 'var(--spacing-5)',
            margin: 0
          }}>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              기본적으로 <code>currentColor</code> 사용하여 텍스트 색상과 일치
            </li>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              시맨틱 의미가 있을 때만 특정 색상 적용
            </li>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              호버 상태에서 색상 변화로 상호작용성 표현
            </li>
            <li>
              다크 모드에서 자동으로 색상이 조정되도록 CSS 변수 사용
            </li>
          </ul>
        </div>
        
        <div style={{
          backgroundColor: 'var(--bg-warning)',
          padding: 'var(--spacing-6)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-warning)'
        }}>
          <h3 style={{ 
            color: 'var(--fg-primary)',
            marginBottom: 'var(--spacing-4)',
            fontSize: 'var(--text-lg)'
          }}>
            접근성 고려사항
          </h3>
          <ul style={{ 
            color: 'var(--fg-primary)',
            paddingLeft: 'var(--spacing-5)',
            margin: 0
          }}>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              아이콘만으로 의미를 전달하지 않고 텍스트 라벨 함께 제공
            </li>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              스크린 리더를 위한 적절한 ARIA 라벨 설정
            </li>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              최소 44px 터치 영역 확보 (모바일 접근성)
            </li>
            <li>
              고대비 모드에서도 명확하게 구분되는 색상 사용
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Figma Design System Icons
export const FigmaDesignIcons = {
  render: () => (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <h2 style={{ 
        color: 'var(--fg-primary)', 
        marginBottom: 'var(--spacing-6)',
        fontSize: 'var(--text-2xl)'
      }}>
        피그마 디자인 시스템 아이콘
      </h2>
      
      <p style={{
        color: 'var(--fg-secondary)',
        marginBottom: 'var(--spacing-6)',
        fontSize: 'var(--text-base)'
      }}>
        피그마 디자인 시스템에서 정의된 아이콘들의 사용법과 가이드라인입니다.
      </p>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 'var(--spacing-4)'
      }}>
        <IconSpecimen 
          name="Like" 
          category="Feedback"
          description="좋아요, 추천"
          usage="평가 시스템"
          Icon={IconLibrary.Check} 
        />
        <IconSpecimen 
          name="Dislike" 
          category="Feedback"
          description="싫어요, 비추천"
          usage="평가 시스템"
          Icon={IconLibrary.Close} 
        />
        <IconSpecimen 
          name="Comment" 
          category="Communication"
          description="댓글, 코멘트"
          usage="의견 작성"
          Icon={IconLibrary.MessageSquare} 
        />
        <IconSpecimen 
          name="Share" 
          category="Action"
          description="공유"
          usage="결과 공유"
          Icon={IconLibrary.Copy} 
        />
        <IconSpecimen 
          name="Export" 
          category="Action"
          description="내보내기"
          usage="결과 다운로드"
          Icon={IconLibrary.Download} 
        />
        <IconSpecimen 
          name="Import" 
          category="Action"
          description="가져오기"
          usage="데이터 업로드"
          Icon={IconLibrary.Upload} 
        />
      </div>
    </div>
  )
}
