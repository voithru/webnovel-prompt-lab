import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import AppLayout from '../components/layout/AppLayout'
import { getGoogleSheetsService } from '../services/googleSheetsService'
import styles from '../styles/pages/ProgressPage.module.css'

const ProgressPage = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [seasonData, setSeasonData] = useState([])
  const [error, setError] = useState(null)

  // 시즌별 과제 분류 함수
  const classifyTasksBySeason = (tasks) => {
    const seasons = {
      1: { name: '시즌 1', tasks: [], totalTasks: 48 },
      2: { name: '시즌 2', tasks: [], totalTasks: 48 },
      3: { name: '시즌 3', tasks: [], totalTasks: 48 },
      4: { name: '시즌 4', tasks: [], totalTasks: 48 }
    }

    tasks.forEach(task => {
      // 제목을 기반으로 시즌 분류
      let seasonNumber = 1 // 기본값
      
      if (task.title) {
        const title = task.title.toLowerCase()
        if (title.includes('금릉춘') || title.includes('geumneungchun')) {
          seasonNumber = 1
        } else if (title.includes('season 2') || title.includes('시즌 2')) {
          seasonNumber = 2
        } else if (title.includes('season 3') || title.includes('시즌 3')) {
          seasonNumber = 3
        } else if (title.includes('season 4') || title.includes('시즌 4')) {
          seasonNumber = 4
        }
      }

      if (seasons[seasonNumber]) {
        seasons[seasonNumber].tasks.push({
          ...task,
          seasonNumber
        })
      }
    })

    // 시즌을 1, 2, 3, 4 순서로 정렬하여 반환
    return [1, 2, 3, 4].map(seasonNum => {
      const season = seasons[seasonNum]
      const completedTasks = season.tasks.filter(task => task.status === '완료').length
      const inProgressTasks = season.tasks.filter(task => task.status === '진행중').length
      const availableTasks = season.tasks.length
      const isSeasonOpen = availableTasks > 0

      return {
        ...season,
        completedTasks,
        inProgressTasks,
        availableTasks,
        isSeasonOpen,
        progressPercentage: availableTasks > 0 ? Math.round((completedTasks / availableTasks) * 100) : 0
      }
    })
  }

  // 과제 데이터 로드
  useEffect(() => {
    // 로그인 상태 확인
    if (!isAuthenticated || !user) {
      console.warn('⚠️ 로그인되지 않은 사용자 - 로그인 페이지로 리다이렉트')
      navigate('/login')
      return
    }

    const loadProgressData = async () => {
      try {
        setLoading(true)
        console.log('진행 현황 데이터 로드 시작')

        // 프로젝트 데이터 가져오기
        const googleSheetsService = getGoogleSheetsService()
        const projectData = await googleSheetsService.getProjectData()
        console.log('📋 전체 프로젝트 데이터:', projectData)

        if (!projectData || projectData.length === 0) {
          throw new Error('프로젝트 데이터가 없습니다')
        }

        // 사용자 언어 페어에 맞는 과제만 필터링
        const userLanguagePairs = user?.languagePairs || []
        let filteredTasks = projectData

        if (userLanguagePairs.length > 0) {
          filteredTasks = projectData.filter(project => {
            return userLanguagePairs.some(pair => {
              const projectLanguagePair = `${pair.source_language} → ${pair.target_language}`
              return project.languagePair === projectLanguagePair
            })
          })
        } else {
          console.error('❌ 사용자 언어 페어 정보가 없습니다 - 보안상 과제 표시 불가')
          setError('언어 페어 정보를 찾을 수 없습니다. 관리자에게 문의해주세요.')
          setSeasonData([])
          return
        }

        console.log('🎯 필터링된 과제 데이터:', filteredTasks)

        // 로컬 스토리지에서 진행 상태 확인하여 업데이트
        const tasksWithProgress = filteredTasks.map((project, index) => {
          const taskId = project.id // ⭐ UUID 기반 ID 사용
          
          // 제출 데이터 확인
          const submissionData = localStorage.getItem(`submission_${taskId}`)
          if (submissionData) {
            return { ...project, status: '완료' }
          }

          // 진행 상태 확인
          const localProgress = localStorage.getItem(`taskProgress_${taskId}`)
          if (localProgress) {
            const status = localProgress === '제출 완료' ? '완료' : localProgress
            return { ...project, status }
          }

          // 프롬프트 데이터 확인
          const promptInputData = localStorage.getItem(`promptInput_${taskId}`)
          const promptReviewData = localStorage.getItem(`promptReview_${taskId}`)
          
          if (promptInputData || promptReviewData) {
            try {
              const inputData = promptInputData ? JSON.parse(promptInputData) : null
              const reviewData = promptReviewData ? JSON.parse(promptReviewData) : null
              
              if ((inputData && inputData.prompts && inputData.prompts.length > 0) ||
                  (reviewData && reviewData.prompts && reviewData.prompts.length > 0)) {
                return { ...project, status: '진행중' }
              }
            } catch (error) {
              console.error('프롬프트 데이터 파싱 실패:', error)
            }
          }

          return project
        })

        // 시즌별로 분류
        const seasons = classifyTasksBySeason(tasksWithProgress)
        console.log('🎭 시즌별 분류 결과:', seasons)

        setSeasonData(seasons)
        setError(null)
      } catch (err) {
        console.error('❌ 진행 현황 데이터 로드 실패:', err)
        setError('진행 현황 데이터를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadProgressData()
  }, [isAuthenticated, user, navigate])

  // 로그인하지 않은 사용자는 접근 불가
  if (!isAuthenticated || !user) {
    return null // 리다이렉트 중이므로 아무것도 렌더링하지 않음
  }

  if (loading) {
    return (
      <AppLayout currentPage="진행 현황" variant="withoutHeader">
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <span>진행 현황을 불러오는 중...</span>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout currentPage="진행 현황" variant="withoutHeader">
        <div className={styles.container}>
          <div className={styles.errorState}>
            <span>⚠️ {error}</span>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout currentPage="진행 현황" variant="withoutHeader">
      <div className={styles.container}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            진행 현황
          </h1>
          <p className={styles.subtitle}>시즌별 과제 진행 상황을 확인하세요</p>
        </div>

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <div className={styles.scrollableContent}>
          {/* 전체 진행률 요약 */}
          <div className={styles.overallSummary}>
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>전체 진행 요약</h2>
              <div className={styles.summaryStats}>
                {seasonData.map(season => (
                  <div key={season.name} className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>{season.name}</span>
                    <span className={styles.summaryValue}>
                      {season.completedTasks}/{season.availableTasks}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 시즌별 상세 진행률 - 가로 레이아웃 */}
          <div className={styles.seasonGrid}>
            {seasonData.map((season, index) => (
              <div 
                key={season.name} 
                className={`${styles.seasonCard} ${!season.isSeasonOpen ? styles.disabled : ''}`}
              >
                {/* 시즌 헤더 - 왼쪽 */}
                <div className={styles.seasonHeader}>
                  <h3 className={styles.seasonTitle}>
                    {season.name}
                    {!season.isSeasonOpen && (
                      <span className={styles.comingSoon}>준비중</span>
                    )}
                  </h3>
                  <div className={styles.seasonProgress}>
                    <span className={styles.progressText}>
                      {season.completedTasks}/{season.totalTasks}
                    </span>
                    <span className={styles.progressPercentage}>
                      {season.progressPercentage}%
                    </span>
                  </div>
                </div>

                {/* 진행률 바 - 중앙 */}
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ 
                      width: season.isSeasonOpen ? `${season.progressPercentage}%` : '0%',
                      backgroundColor: season.isSeasonOpen ? 
                        (season.progressPercentage === 100 ? '#10b981' : '#3b82f6') : 
                        '#e5e7eb'
                    }}
                  />
                </div>

                {/* 상세 통계 - 오른쪽 */}
                <div className={styles.seasonStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>작업완료</span>
                    <span className={`${styles.statValue} ${styles.completed}`}>
                      {season.completedTasks}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>진행중</span>
                    <span className={`${styles.statValue} ${styles.inProgress}`}>
                      {season.inProgressTasks}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>작업대기</span>
                    <span className={`${styles.statValue} ${styles.waiting}`}>
                      {season.availableTasks - season.completedTasks - season.inProgressTasks}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>비공개</span>
                    <span className={`${styles.statValue} ${styles.locked}`}>
                      {season.totalTasks - season.availableTasks}
                    </span>
                  </div>
                </div>

                {/* 시즌 상태 표시 - 맨 오른쪽 */}
                <div className={styles.seasonStatus}>
                  {season.isSeasonOpen ? (
                    season.progressPercentage === 100 ? (
                      <span className={styles.statusComplete}>✅ 완료</span>
                    ) : (
                      <span className={styles.statusActive}>📃 진행중</span>
                    )
                  ) : (
                    <span className={styles.statusLocked}>🔒 준비중</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 도움말 */}
          <div className={styles.helpSection}>
            <div className={styles.helpCard}>
              <h3 className={styles.helpTitle}>💡 진행 현황 안내</h3>
              <ul className={styles.helpList}>
                <li>각 시즌당 총 48개의 과제가 있습니다</li>
                <li>아직 오픈되지 않은 과제는 "비공개" 상태로 표시됩니다</li>
                <li>완료된 과제는 다시 수정할 수 없습니다</li>
                <li>진행중인 과제는 "나의 과제" 페이지에서 계속 작업할 수 있습니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default ProgressPage
