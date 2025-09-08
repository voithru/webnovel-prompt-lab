import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/pages/MyTasks.module.css'
import AppLayout from '../components/layout/AppLayout'
import { getGoogleSheetsService } from '../services/googleSheetsService'
import { useAuthStore } from '../store/authStore'
import emailAuthService from '../services/emailAuthService'
import { devLog, devError, userError, authLog } from '../utils/logger'

// SVG 아이콘 컴포넌트들
const Icons = {
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
  ),
  Filter: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
    </svg>
  ),
  Sort: () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
    </svg>
  )
}

const MyTasksPage = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTasks, setSelectedTasks] = useState([])
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')

  // 구글 스프레드시트에서 데이터를 가져오기 위한 상태
  const [tasks, setTasks] = useState([])
  const [allTasks, setAllTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [userLanguagePair, setUserLanguagePair] = useState(null)
  const [nextScheduledUpdate, setNextScheduledUpdate] = useState(null)

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10) // 페이지당 10개 항목
  
  // 필터 상태
  const [activeFilter, setActiveFilter] = useState('전체')
  
  // 정렬 상태
  const [sortBy, setSortBy] = useState('')

  // 컴포넌트 마운트 시 인증 확인 및 데이터 로드
  useEffect(() => {
    // 로그인 상태 확인
    if (!isAuthenticated) {
      console.warn('⚠️ 로그인되지 않은 사용자 - 로그인 페이지로 리다이렉트')
      navigate('/login')
      return
    }
    
    loadUserLanguagePair()
    loadProjectData()
  }, [isAuthenticated, navigate])

  // 컴포넌트 마운트 시 데이터 로드 (중복 방지) - 제거됨
  
  // 사용자의 언어 페어 정보 로드 (다중 언어 페어 지원)
  const loadUserLanguagePair = async () => {
    try {
      const currentUser = emailAuthService.getCurrentUser()
      
      if (currentUser && currentUser.languagePairs && currentUser.languagePairs.length > 0) {
        // 다중 언어 페어 처리
        const langPairs = currentUser.languagePairs.map(lp => ({
          source: lp.source_language,
          target: lp.target_language,
          display: `${lp.source_language} → ${lp.target_language}`
        }))
        
        const langPairInfo = {
          pairs: langPairs,
          display: langPairs.length === 1 
            ? langPairs[0].display
            : `${langPairs.length}개 언어 페어`,
          count: langPairs.length
        }
        
        setUserLanguagePair(langPairInfo)
        // 과도한 로깅 제거 - 필요시에만 활성화
        // console.log(`🌍 사용자 언어 페어 (${langPairs.length}개):`, langPairs.map(lp => lp.display))
        
      } else if (currentUser && currentUser.source_language && currentUser.target_language) {
        // 레거시: 단일 언어 페어 처리 (하위 호환성)
        const langPair = {
          pairs: [{
            source: currentUser.source_language,
            target: currentUser.target_language,
            display: `${currentUser.source_language} → ${currentUser.target_language}`
          }],
          display: `${currentUser.source_language} → ${currentUser.target_language}`,
          count: 1
        }
        setUserLanguagePair(langPair)
        console.log('🌍 사용자 언어 페어 (레거시):', langPair.display)
        
      } else {
        console.warn('⚠️ 사용자 언어 페어 정보가 없습니다')
      }
    } catch (error) {
      console.error('❌ 사용자 언어 페어 로드 실패:', error)
    }
  }

  // 프로젝트 데이터 로드
  const loadProjectData = async (isBackgroundUpdate = false, forceUpdate = false) => {
    try {
      if (!isBackgroundUpdate) {
        setLoading(true)
      } else {
        setIsUpdating(true)
      }
      
      const googleSheetsService = getGoogleSheetsService()
      
      // 🔄 스마트 업데이트 사용 (진행중/완료된 과제 보호)
      let projectData
      if (forceUpdate) {
        console.log('🔄 강제 업데이트 모드 - 변경점 확인 후 선택적 업데이트 (진행중/완료된 과제는 보호)')
        projectData = await googleSheetsService.getSmartProjectData(true)
      } else {
        console.log('🔄 스마트 업데이트 모드 - 변경점 확인 후 선택적 업데이트')
        projectData = await googleSheetsService.getSmartProjectData(false)
      }
      
      // 사용자의 다중 언어 페어에 따라 과제 필터링
      const currentUser = emailAuthService.getCurrentUser()
      let filteredProjectData = projectData
      
      if (currentUser) {
        let userLanguagePairs = []
        
        // 다중 언어 페어 지원
        if (currentUser.languagePairs && currentUser.languagePairs.length > 0) {
          userLanguagePairs = currentUser.languagePairs
        } else if (currentUser.source_language && currentUser.target_language) {
          // 레거시: 단일 언어 페어
          userLanguagePairs = [{
            source_language: currentUser.source_language,
            target_language: currentUser.target_language
          }]
        }
        
        if (userLanguagePairs.length > 0) {
          filteredProjectData = projectData.filter(project => {
            if (!project.languagePair) return false
            
            const [source, target] = project.languagePair.split(' → ').map(lang => lang.trim())
            
            // 사용자의 언어 페어 중 하나라도 매치되면 포함
            return userLanguagePairs.some(langPair => 
              langPair.source_language === source && langPair.target_language === target
            )
          })
          
          const langPairDisplays = userLanguagePairs.map(lp => `${lp.source_language} → ${lp.target_language}`)
          // 과도한 로깅 제거 - 필요시에만 활성화
          // console.log(`🌍 언어 페어 필터링 (${userLanguagePairs.length}개):`, langPairDisplays)
          // console.log(`📊 전체 과제: ${projectData.length}개, 필터링된 과제: ${filteredProjectData.length}개`)
        } else {
          console.warn('⚠️ 사용자 언어 페어 정보가 없습니다')
          setError('언어 페어 정보를 찾을 수 없습니다. 관리자에게 문의해주세요.')
          setTasks([])
          setAllTasks([])
          return
        }
      } else {
        console.error('❌ 로그인된 사용자가 없습니다 - 보안상 과제 표시 불가')
        setError('로그인이 필요합니다.')
        setTasks([])
        setAllTasks([])
        navigate('/login')
        return
      }
      
      // 스프레드시트에서 가져온 데이터를 사용하되, 로컬 스토리지의 진행 상태로 덮어쓰기
      const allTasks = filteredProjectData.map((project, index) => {
        const taskId = project.id // ⭐ UUID 기반 ID 사용
        
        // 로컬 스토리지에서 진행 상태 확인
        const localProgress = localStorage.getItem(`taskProgress_${taskId}`)
        
        // 실제 저장된 프롬프트 데이터가 있는지 확인
        let actualStatus = project.status // 기본값은 스프레드시트 상태
        
        // 🔥 submission 데이터가 있으면 무조건 최우선 처리
        const submissionData = localStorage.getItem(`submission_${taskId}`)
        
        if (submissionData) {
          actualStatus = '완료'
          localStorage.setItem(`taskProgress_${taskId}`, '제출 완료')
        } else if (localProgress) {
          // 명시적으로 저장된 진행 상태가 있으면 사용 (데이터 재확인 안함)
          // '제출 완료' → '완료'로 매핑
          actualStatus = localProgress === '제출 완료' ? '완료' : localProgress
        } else {
          // 진행 상태가 없을 때만 실제 프롬프트 데이터 확인
          const promptInputData = localStorage.getItem(`promptInput_${taskId}`)
          const promptReviewData = localStorage.getItem(`promptReview_${taskId}`)
          
          if (promptInputData || promptReviewData) {
            try {
              const inputData = promptInputData ? JSON.parse(promptInputData) : null
              const reviewData = promptReviewData ? JSON.parse(promptReviewData) : null
              
              // 프롬프트가 하나라도 있으면 진행중
              if ((inputData && inputData.prompts && inputData.prompts.length > 0) ||
                  (reviewData && reviewData.prompts && reviewData.prompts.length > 0)) {
                actualStatus = '진행중'
                localStorage.setItem(`taskProgress_${taskId}`, '진행중')
              }
              // 프롬프트 데이터는 있지만 비어있으면 '대기' 상태 유지
            } catch (error) {
              console.error('프롬프트 데이터 파싱 실패:', error)
            }
          }
          // 저장된 데이터가 아예 없으면 스프레드시트 상태 그대로 사용 (대기)
        }
        
        // 과도한 상태 로그 제거 - 필요시에만 활성화
        // console.log(`과제 ${taskId}: 스프레드시트=${project.status}, 로컬진행상태=${localProgress}, 실제=${actualStatus}`)
        
        return {
          ...project,
          id: taskId,
          status: actualStatus,
          action: actualStatus === '진행중' ? '이어서 작업 →' : null
        }
      })
      
      setAllTasks(projectData) // 전체 과제 데이터 저장
      setTasks(allTasks) // 필터링된 과제 데이터 저장
      setError(null)
      setLastUpdated(new Date())
    } catch (err) {
      devError('프로젝트 데이터 로드 실패:', err)
      if (!isBackgroundUpdate) {
        setError('데이터를 불러오는데 실패했습니다. 새로고침 버튼을 눌러 다시 시도해주세요.')
        // 에러 시 빈 배열로 설정 - 더 명확한 에러 상태
        setTasks([])
        setAllTasks([])
      }
    } finally {
      setLoading(false)
      setIsUpdating(false)
    }
  }

  // 예약 업데이트 시스템 (오전 10시, 오후 19시)
  useEffect(() => {
    const scheduleNextUpdate = () => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      // 오늘 오전 10시, 오후 19시 설정
      const morning = new Date(today.getTime() + 10 * 60 * 60 * 1000) // 10:00
      const evening = new Date(today.getTime() + 19 * 60 * 60 * 1000) // 19:00
      
      let nextUpdate
      
      if (now < morning) {
        // 아직 오전 10시 전이면 오늘 오전 10시로 설정
        nextUpdate = morning
      } else if (now < evening) {
        // 오전 10시는 지났지만 오후 19시 전이면 오늘 오후 19시로 설정
        nextUpdate = evening
      } else {
        // 오늘 두 시간 모두 지났으면 내일 오전 10시로 설정
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
        nextUpdate = new Date(tomorrow.getTime() + 10 * 60 * 60 * 1000)
      }
      
      const timeUntilUpdate = nextUpdate.getTime() - now.getTime()
      
      // 과도한 예약 업데이트 로그 제거 - 필요시에만 활성화
      // console.log(`🕰️ 다음 예약 업데이트: ${nextUpdate.toLocaleString('ko-KR')}`)
      // console.log(`⏰ 대기 시간: ${Math.round(timeUntilUpdate / 1000 / 60)}분`)
      
      // UI에 다음 업데이트 시간 표시
      setNextScheduledUpdate(nextUpdate)
      
      return setTimeout(() => {
        console.log('📅 예약 업데이트 실행!')
        // 🔄 자동 업데이트는 스마트 모드 사용 (진행중/완료된 과제 보호)
        loadProjectData(true, false)
        
        // 다음 업데이트 예약
        const nextTimeoutId = scheduleNextUpdate()
        return nextTimeoutId
      }, timeUntilUpdate)
    }
    
    // 초기 예약 설정
    const timeoutId = scheduleNextUpdate()
    
    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])
  
  // 수동 사용자 권한 확인 (필요 시에만 호출)
  const checkUserPermissions = async () => {
    try {
      console.log('🔄 수동 사용자 권한 확인 시작')
      const result = await emailAuthService.checkUserPermissions()
      
      if (!result.success) {
        if (result.reason === 'user_removed') {
          alert(result.message || '계정이 비활성화되었습니다. 다시 로그인해주세요.')
          window.location.href = '/login'
          return
        }
        console.log('⚠️ 사용자 권한 확인 실패:', result.reason)
        return
      }
      
      if (result.requiresTaskRefresh) {
        console.log('🌍 언어 페어 변경 감지!')
        
        const shouldRefresh = window.confirm(
          `${result.message}\n\n"확인"을 클릭하면 과제 목록을 새로고침합니다.`
        )
        
        if (shouldRefresh) {
          await loadUserLanguagePair()
          await loadProjectData()
          console.log('✅ 과제 목록 업데이트 완료')
        }
      } else {
        console.log('✅ 사용자 권한 변경 없음')
      }
      
    } catch (error) {
      console.error('❌ 사용자 권한 확인 오류:', error)
      alert('사용자 권한 확인 중 오류가 발생했습니다.')
    }
  }

  // 필터 핸들러
  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType)
    setCurrentPage(1) // 필터 변경 시 첫 페이지로 이동
  }

  // 상태별 필터링
  const getFilteredTasksByStatus = (tasks) => {
    switch (activeFilter) {
      case '완료':
        return tasks.filter(task => task.status === '완료')
      case '진행중':
        return tasks.filter(task => task.status === '진행중')
      case '대기':
        return tasks.filter(task => task.status === '미시작' || task.status === '대기')
      default: // '전체'
        return tasks
    }
  }

  // 검색 및 상태 필터링
  const filteredTasks = getFilteredTasksByStatus(tasks).filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 검색어 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // 정렬 처리
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // 정렬 핸들러 (드롭다운용)
  const handleSortChange = (e) => {
    const value = e.target.value
    setSortBy(value)
    setCurrentPage(1) // 정렬 변경 시 첫 페이지로 이동
  }

  // 정렬된 데이터 (드롭다운과 테이블 헤더 클릭 모두 지원)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let sortKey = sortBy || sortColumn
    if (!sortKey) return 0
    
    let aVal = a[sortKey]
    let bVal = b[sortKey]
    
    // 특별한 정렬 처리
    if (sortKey === 'episode') {
      aVal = parseInt(aVal) || 0
      bVal = parseInt(bVal) || 0
    }
    
    if (sortKey === 'step' || sortKey === '번역순서순') {
      sortKey = 'stepOrder'
      aVal = a.stepOrder || 0
      bVal = b.stepOrder || 0
    }
    
    if (sortKey === '제목순') {
      sortKey = 'title'
      aVal = a.title || ''
      bVal = b.title || ''
    }
    
    if (sortKey === '에피소드순') {
      sortKey = 'episode'
      aVal = parseInt(a.episode) || 0
      bVal = parseInt(b.episode) || 0
    }
    
    if (sortKey === '마감일순') {
      sortKey = 'deadline'
      aVal = a.deadline || ''
      bVal = b.deadline || ''
    }
    
    // 드롭다운 정렬은 기본적으로 오름차순, 테이블 헤더는 sortDirection 사용
    const direction = sortBy ? 'asc' : sortDirection
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTasks = sortedTasks.slice(startIndex, endIndex)

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  // 체크박스 처리
  const handleSelectAll = () => {
    if (selectedTasks.length === sortedTasks.length) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(sortedTasks.map(task => task.id))
    }
  }

  const handleSelectTask = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  // 행 클릭 시 번역 에디터 페이지로 이동
  const handleRowClick = (task) => {
    // Step 1은 기존 페이지, Step 2,3,4는 새로운 페이지로 이동
    const route = task.stepOrder === 1 ? '/translation-editor' : '/translation-editor-step234'
    
    navigate(route, { 
      state: { 
        taskId: task.id,
        title: task.title,
        episode: task.episode,
        languagePair: task.languagePair,
        status: task.status,
        step: task.step,
        stepOrder: task.stepOrder,
        deadline: task.deadline,
        settings: task.settings, // 설정집 정보
        originalUrl: task.originalUrl, // 원본 URL
        projectSeason: task.projectSeason,
        priority: task.priority,
        translationUrl: task.translationUrl
      }
    })
  }

  // 상태 표시 텍스트 매핑
  const getStatusDisplayText = (status) => {
    switch (status) {
      case '완료':
        return '제출 완료'
      case '진행중':
        return '진행중'
      case '대기':
        return '대기'
      default:
        return status
    }
  }

  // 상태별 스타일
  const getStatusStyle = (status) => {
    switch (status) {
      case '완료':
        return { backgroundColor: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd' }
      case '진행중':
        return { backgroundColor: '#fef3c7', color: '#d97706', border: '1px solid #fbbf24' }
      case '대기':
        return { backgroundColor: '#f3f4f6', color: '#6b7280', border: '1px solid #d1d5db' }
      default:
        return { backgroundColor: '#f3f4f6', color: '#6b7280', border: '1px solid #d1d5db' }
    }
  }

  // 로그인하지 않은 사용자는 접근 불가
  if (!isAuthenticated) {
    return null // 리다이렉트 중이므로 아무것도 렌더링하지 않음
  }

  return (
    <AppLayout currentPage="나의 과제" variant="withHeader">
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>나의 과제</h1>
        {userLanguagePair && (
          <div className={styles.languagePairInfo}>
            <span className={styles.languagePairLabel}>담당 언어:</span>
            <div className={styles.languagePairValue}>
              {userLanguagePair.count === 1 
                ? (
                  <span className={styles.languagePairItem}>
                    {userLanguagePair.display}
                  </span>
                )
                : (
                  <div className={styles.languagePairDetails}>
                    {userLanguagePair.pairs?.map((pair, index) => (
                      <span key={index} className={styles.languagePairItem}>
                        {pair.display}
                      </span>
                    ))}
                  </div>
                )
              }
            </div>
          </div>
        )}
      </div>
      
      {/* 에러 상태만 표시 */}
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      {/* 검색바 */}
      <div className={styles.searchBar}>
        <div className={styles.searchIcon}>
          <Icons.Search />
        </div>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="검색어를 입력해 주세요."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 필터 및 정렬 */}
      <div className={styles.filtersSection}>
        <div className={styles.leftFilters}>
          <button 
            className={`${styles.filterButton} ${activeFilter === '전체' ? styles.active : ''}`}
            onClick={() => handleFilterChange('전체')}
          >
            전체
          </button>
          <button 
            className={`${styles.filterButton} ${activeFilter === '완료' ? styles.active : ''}`}
            onClick={() => handleFilterChange('완료')}
          >
            완료
          </button>
          <button 
            className={`${styles.filterButton} ${activeFilter === '진행중' ? styles.active : ''}`}
            onClick={() => handleFilterChange('진행중')}
          >
            진행중
          </button>
          <button 
            className={`${styles.filterButton} ${activeFilter === '대기' ? styles.active : ''}`}
            onClick={() => handleFilterChange('대기')}
          >
            대기
          </button>
          
          {/* 총 과제 개수 표시 (필터 옆) */}
          <div className={styles.taskCountFilter}>
            총 과제: {tasks.length}개
          </div>
        </div>
        
        <div className={styles.rightFilters}>
          {/* 업데이트 시간 표시 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            fontSize: '12px',
            color: '#9ca3af',
            opacity: 0.7,
            marginRight: '16px'
          }}>
            {isUpdating ? (
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                style={{ 
                  animation: 'spin 1s linear infinite'
                }}
              >
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span>
                {lastUpdated 
                  ? `${lastUpdated.toLocaleTimeString('ko-KR', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit'
                    })} 업데이트`
                  : '업데이트 중...'
                }
              </span>
              
              {/* 다음 예약 업데이트 시간 표시 */}
              {nextScheduledUpdate && (
                <span style={{ fontSize: '10px', opacity: 0.7, marginTop: '1px' }}>
                  다음 자동 업데이트: {nextScheduledUpdate.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              )}
            </div>
          </div>
          
          {/* 새로고침 버튼 (우클릭으로 강제 모드 선택 가능) */}
          <button
            onClick={async () => {
              console.log('🔄 새로고침 시작')
              
              // 1. 사용자 권한 먼저 확인
              await checkUserPermissions()
              
              // 2. 과제 데이터 새로고침 (기본: 스마트 모드)
              await loadProjectData(false, false)
              
              console.log('✅ 새로고침 완료 (스마트 모드)')
            }}
            onContextMenu={async (e) => {
              e.preventDefault() // 기본 우클릭 메뉴 방지
              
              if (window.confirm('⚠️ 강제 새로고침을 실행하시겠습니까?\n\n이 작업은 진행중인 과제의 데이터도 새로 로드합니다.')) {
                console.log('🔄 강제 새로고침 시작')
                
                // 1. 사용자 권한 먼저 확인
                await checkUserPermissions()
                
                // 2. 과제 데이터 강제 새로고침
                await loadProjectData(false, true)
                
                console.log('✅ 강제 새로고침 완료')
              }
            }}
            className={styles.refreshButton}
            title="좌클릭: 스마트 새로고침 (진행중/완료된 과제 보호)\n우클릭: 강제 새로고침 (모든 데이터 새로 로드)"
            disabled={loading || isUpdating}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{ 
                animation: (loading || isUpdating) ? 'spin 1s linear infinite' : 'none'
              }}
            >
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            새로고침
          </button>

          <select 
            className={styles.sortSelect} 
            value={sortBy} 
            onChange={handleSortChange}
          >
            <option value="">정렬</option>
            <option value="제목순">제목순</option>
            <option value="에피소드순">에피소드순</option>
            <option value="번역순서순">번역순서순</option>
            <option value="마감일순">마감일순</option>
          </select>
        </div>
      </div>

        {/* 테이블 */}
        <div className={styles.tableContainer} style={{
          flex: 1,
          overflow: 'auto',
          minHeight: 0
        }}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selectedTasks.length === sortedTasks.length && sortedTasks.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th onClick={() => handleSort('languagePair')}>
                <div className={styles.sortableHeader}>
                  언어 페어
                  <Icons.Sort />
                </div>
              </th>
              <th onClick={() => handleSort('title')}>
                <div className={styles.sortableHeader}>
                  Title
                  <Icons.Sort />
                </div>
              </th>
              <th onClick={() => handleSort('episode')}>
                <div className={styles.sortableHeader}>
                  EP
                  <Icons.Sort />
                </div>
              </th>
              <th onClick={() => handleSort('step')}>
                <div className={styles.sortableHeader}>
                  번역 순서
                  <Icons.Sort />
                </div>
              </th>
              <th onClick={() => handleSort('projectSeason')}>
                <div className={styles.sortableHeader}>
                  시즌
                  <Icons.Sort />
                </div>
              </th>
              <th onClick={() => handleSort('status')}>
                <div className={styles.sortableHeader}>
                  번역 진행 상태
                  <Icons.Sort />
                </div>
              </th>
              <th onClick={() => handleSort('deadline')}>
                <div className={styles.sortableHeader}>
                  마감일
                  <Icons.Sort />
                </div>
              </th>
              <th>액션</th>
            </tr>
          </thead>
          
          <tbody>
            {currentTasks.length > 0 ? (
              currentTasks.map((task) => (
                <tr 
                  key={task.id} 
                  className={`${styles.tableRow} ${selectedTasks.includes(task.id) ? styles.selectedRow : ''}`}
                  onClick={() => handleRowClick(task)}
                >
                  <td className={styles.tableCell}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => handleSelectTask(task.id)}
                    />
                  </td>
                  
                  <td className={styles.tableCell}>
                    <div className={styles.languagePair}>
                      {task.languagePair}
                    </div>
                  </td>
                  
                  <td className={styles.tableCell}>
                    <div className={styles.title}>{task.title}</div>
                  </td>
                  
                  <td className={styles.tableCell}>
                    <div className={styles.episode}>{task.episode}</div>
                  </td>
                  
                  <td className={styles.tableCell}>
                    <div className={styles.step}>{task.step}</div>
                  </td>
                  
                  <td className={styles.tableCell}>
                    <div className={styles.season}>{task.projectSeason}</div>
                  </td>
                  
                  <td className={styles.tableCell}>
                    <span 
                      className={`${styles.status} ${styles[task.status]}`}
                      style={getStatusStyle(task.status)}
                    >
                      {getStatusDisplayText(task.status)}
                    </span>
                  </td>
                  
                  <td className={styles.tableCell}>
                    <div className={styles.deadline}>{task.deadline}</div>
                  </td>
                  
                  <td className={styles.tableCell}>
                    {task.action && (
                      <div className={styles.action}>
                        {task.action}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className={styles.emptyState}>
                  {loading ? (
                    <div className={styles.loadingState}>
                      <div className={styles.spinner}></div>
                      <span>과제를 불러오는 중...</span>
                    </div>
                  ) : error ? (
                    <div className={styles.errorState}>
                      <span>⚠️ 과제를 불러올 수 없습니다</span>
                      <p>네트워크 연결을 확인하고 새로고침 버튼을 눌러주세요.</p>
                    </div>
                  ) : (
                    <div className={styles.noDataState}>
                      <span>진행중인 과제가 없습니다</span>
                      <p>작업을 진행중인 과제가 있으면 여기에 표시됩니다.</p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 - 10개 이상일 때만 표시 */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={styles.paginationButton} 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            이전
          </button>
          
          {getPageNumbers().map(page => (
            <button 
              key={page}
              className={`${styles.paginationButton} ${currentPage === page ? styles.active : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          
          <button 
            className={styles.paginationButton}
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            다음
          </button>
        </div>
      )}
      </div>
    </AppLayout>
  )
}

export default MyTasksPage
