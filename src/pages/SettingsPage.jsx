import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@store/authStore'
import { useDesignSystemContext } from '../components/common/DesignSystemProvider'
import emailAuthService from '../services/emailAuthService'
import { getGoogleSheetsService } from '../services/googleSheetsService'
import AppLayout from '../components/layout/AppLayout'
import styles from '../styles/pages/SettingsPage.module.css'

const SettingsPage = () => {
  const { designTokens } = useDesignSystemContext()
  const { user } = useAuthStore()
  const [currentUserInfo, setCurrentUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cacheClearing, setCacheClearing] = useState(false)
  const [cacheClearMessage, setCacheClearMessage] = useState('')
  const [showDangerZone, setShowDangerZone] = useState(false)
  const [fullResetClearing, setFullResetClearing] = useState(false)
  const [fullResetMessage, setFullResetMessage] = useState('')
  const [showCacheManagement, setShowCacheManagement] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(false)
  const [showAccountInfo, setShowAccountInfo] = useState(false)
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)

  // 컴포넌트 마운트 시 최신 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        console.log('🔍 설정 페이지: 사용자 정보 가져오기 시작')
        const userInfo = emailAuthService.getCurrentUser()
        console.log('📋 emailAuthService.getCurrentUser() 결과:', userInfo)
        console.log('📋 AuthStore user 정보:', user)
        
        if (userInfo) {
          console.log('✅ emailAuthService에서 사용자 정보 사용')
          console.log('🌐 언어 페어:', userInfo.languagePairs)
          setCurrentUserInfo(userInfo)
        } else {
          // 폴백: AuthStore의 사용자 정보 사용
          console.log('⚠️ AuthStore 사용자 정보로 폴백')
          console.log('🌐 AuthStore 언어 페어:', user?.languagePairs)
          setCurrentUserInfo(user)
        }
      } catch (error) {
        console.error('❌ 사용자 정보 가져오기 실패:', error)
        setCurrentUserInfo(user)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [user])

  // 모든 과제 리셋 (제출 완료 과제만 보호)
  const handleClearAllTasksCache = async () => {
    const confirmed = window.confirm(
      '⚠️ 일부 과제를 리셋하시겠습니까? 이 작업은 되돌릴 수 없습니다.\n\n' +
      '• 제출 완료 과제를 제외한 나머지(진행중, 대기) 상태의 과제는 모두 리셋됩니다\n' +
      '• 진행 중인 과제의 프롬프트, 코멘트 등 입력 데이터가 모두 삭제됩니다\n' +
      '• 로드한 텍스트는 다시 로드됩니다'
    )
    
    
    if (!confirmed) return
    
    setCacheClearing(true)
    setCacheClearMessage('')
    
    try {
      const googleSheetsService = getGoogleSheetsService()
      const result = await googleSheetsService.clearAllTasksCache()
      
      if (result.success) {
        setCacheClearMessage(`✅ ${result.message}\n\n "나의 과제" 페이지로 이동하여 과제를 다시 클릭하면 최신 내용이 로드됩니다.`)
        console.log('✅ 모든 과제 리셋 성공:', result)
      } else {
        setCacheClearMessage(`❌ ${result.message}`)
        console.error('❌ 모든 과제 리셋 실패:', result)
      }
    } catch (error) {
      setCacheClearMessage('❌ 과제 리셋 중 오류가 발생했습니다.')
      console.error('❌ 과제 리셋 오류:', error)
    } finally {
      setCacheClearing(false)
    }
  }

  // 전체 리셋 (제출 완료 과제까지 모든 과제 리셋)
  const handleFullReset = async () => {
    const confirmed = window.confirm(
      '⚠️ 모든 과제를 리셋하시겠습니까? 이 작업은 되돌릴 수 없습니다.\n\n' +
      '• 제출 완료 과제를 포함한 모든 과제가 리셋됩니다\n' +
      '• 모든 프롬프트, 코멘트, 평가 데이터가 삭제됩니다\n' +
      '• 모든 텍스트 내용이 다시 로드됩니다\n' +
      '• 삭제된 데이터는 복구할 수 없습니다'
    )    
    
    if (!confirmed) return
    
    // 추가 확인
    const doubleConfirmed = window.confirm(
      '정말로 모든 과제를 리셋하시겠습니까?\n' +
      '제출 완료된 과제까지 모든 데이터가 삭제됩니다.'
    )
    
    if (!doubleConfirmed) return
    
    setFullResetClearing(true)
    setFullResetMessage('')
    
    try {
      const googleSheetsService = getGoogleSheetsService()
      const result = await googleSheetsService.clearAllTasksCache(true) // true = 제출 완료 과제도 리셋
      
      if (result.success) {
        setFullResetMessage(`✅ ${result.message}\n\n📝 모든 과제가 리셋되었습니다. "나의 과제" 페이지로 이동하여 과제를 다시 클릭하면 최신 내용이 로드됩니다.`)
        console.log('✅ 전체 리셋 성공:', result)
      } else {
        setFullResetMessage(`❌ ${result.message}`)
        console.error('❌ 전체 리셋 실패:', result)
      }
    } catch (error) {
      setFullResetMessage('❌ 전체 리셋 중 오류가 발생했습니다.')
      console.error('❌ 전체 리셋 오류:', error)
    } finally {
      setFullResetClearing(false)
    }
  }

  // 표시할 사용자 정보 결정
  const displayUser = currentUserInfo || user

  return (
    <AppLayout currentPage="설정" variant="withoutHeader">
      <div className={styles.container}>
        <div className={styles.content}>
          {/* 헤더 */}
          <div className={styles.header}>
            <h1 className={styles.title}>설정</h1>
            <p className={styles.subtitle}>계정 정보 및 언어 설정</p>
          </div>

          {/* 현재 계정 정보 - 아코디언 형식 */}
          <div className={styles.currentSettings}>
            <div className={styles.settingCard}>
              <button
                className={styles.accordionToggle}
                onClick={() => setShowAccountInfo(!showAccountInfo)}
              >
                <div className={styles.accordionHeader}>
                  <h2 className={styles.cardTitle}>계정 및 언어 정보</h2>
                  <span className={styles.accordionArrow}>
                    {showAccountInfo ? '▲' : '▼'}
                  </span>
                </div>
              </button>
              
              {showAccountInfo && (
                <div className={styles.accordionContent}>
                  {loading ? (
                    <div className={styles.loadingState}>
                      <span>사용자 정보를 불러오는 중...</span>
                    </div>
                  ) : (
                    <>
                      <div className={styles.settingItem}>
                        <div className={styles.settingLabel}>
                          이메일
                        </div>
                        <div className={styles.settingValue}>
                          {displayUser?.email || '로그인되지 않음'}
                        </div>
                      </div>

                      <div className={styles.settingItem}>
                        <div className={styles.settingLabel}>
                          할당된 언어 페어
                        </div>
                        <div className={styles.settingValue}>
                          {displayUser?.languagePairs?.length > 0 ? (
                            <div className={styles.languagePairs}>
                              {displayUser.languagePairs.map((pair, index) => (
                                <span key={index} className={styles.languagePair}>
                                  {pair.source_language} → {pair.target_language}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className={styles.noData}>할당된 언어 페어가 없습니다</span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 설정 변경 문의 - 아코디언 형식 */}
          <div className={styles.contactInfo}>
            <div className={styles.settingCard}>
              <button
                className={styles.accordionToggle}
                onClick={() => setShowContactInfo(!showContactInfo)}
              >
                <div className={styles.accordionHeader}>
                  <h2 className={styles.cardTitle}>설정 변경</h2>
                  <span className={styles.accordionArrow}>
                    {showContactInfo ? '▲' : '▼'}
                  </span>
                </div>
              </button>
              
              {showContactInfo && (
                <div className={styles.accordionContent}>
                  <p className={styles.cardDescription}>
                    이메일 주소나 언어 페어 변경을 원하시는 경우 아래 담당자에게 문의해주세요.
                  </p>

                  <div className={styles.contactDetails}>
                    <div className={styles.contactItem}>
                      <span className={styles.contactLabel}>담당자:</span>
                      <span className={styles.contactValue}>프로젝트 매니저 (PM)</span>
                    </div>
                    
                    <div className={styles.contactItem}>
                      <span className={styles.contactLabel}>문의 방법:</span>
                      <span className={styles.contactValue}>
                        사내 메신저 또는 이메일로 연락
                      </span>
                    </div>

                    <div className={styles.contactItem}>
                      <span className={styles.contactLabel}>처리 시간:</span>
                      <span className={styles.contactValue}>
                        영업일 기준 1-2일 소요
                      </span>
                    </div>
                  </div>

                  <div className={styles.noteBox}>
                    <div className={styles.noteHeader}>
                      <span className={styles.noteIcon}>💡</span>
                      <span className={styles.noteTitle}>안내사항</span>
                    </div>
                    <ul className={styles.noteList}>
                      <li>언어 페어 변경 시 기존 진행 중인 과제는 유지됩니다</li>
                      <li>이메일 변경 시 기존 작업 이력이 새 계정으로 이전되지 않습니다</li>
                      <li>변경 완료 후 다시 로그인해주세요</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 캐시 관리 - 아코디언 형식 */}
          <div className={styles.cacheSettings}>
            <div className={styles.settingCard}>
              <button
                className={styles.accordionToggle}
                onClick={() => setShowCacheManagement(!showCacheManagement)}
              >
                <div className={styles.accordionHeader}>
                  <h2 className={styles.cardTitle}>캐시 관리</h2>
                  <span className={styles.accordionArrow}>
                    {showCacheManagement ? '▲' : '▼'}
                  </span>
                </div>
              </button>
              
              {showCacheManagement && (
                <div className={styles.accordionContent}>
                  <p className={styles.cardDescription}>
                    과제 정보가 업데이트 되었을 경우, 캐시를 삭제하여 최신 내용을 반영 해 주세요.
                  </p>

                  <div className={styles.cacheHelp}>
                    <h4>언제 사용하나요?</h4>
                    <ul>
                      <li>과제 정보를 업데이트한 경우</li>
                      <li>새로고침을 해도 예전 Step 정보가 나오는 경우</li>
                      <li>모든 과제의 최신 내용을 확인하고 싶은 경우</li>
                      <li>진행중인 과제를 처음부터 다시 시작하고 싶은 경우</li>
                    </ul>
                  </div>
                  
                  <div className={styles.cacheActions}>
                    {/* 제출 완료 과제만 보호하는 버튼 */}
                    <div className={styles.cacheButtonGroup}>
                      <button
                        onClick={handleClearAllTasksCache}
                        disabled={cacheClearing || fullResetClearing}
                        className={styles.cacheButton}
                      >
                        {cacheClearing && <div className={styles.spinner}></div>}
                        {cacheClearing ? '과제 리셋 중...' : '일부 과제 리셋'}
                      </button>
                      <p className={styles.buttonDescription}>
                        제출 완료된 과제는 보호하고, 나머지 과제의 캐시를 삭제합니다.
                      </p>
                    </div>

                    {/* 전체 캐시 삭제 버튼 - 경고 강화 */}
                    <div className={styles.cacheButtonGroup}>
                      <button
                        onClick={handleFullReset}
                        disabled={cacheClearing || fullResetClearing}
                        className={styles.cacheButton}
                      >
                        {fullResetClearing && <div className={styles.spinner}></div>}
                        {fullResetClearing ? '전체 과제 리셋 중...' : '전체 과제 리셋'}
                      </button>
                      <p className={styles.buttonDescription} style={{color: '#dc3545'}}>
                        ⚠️ <strong>주의:</strong> 제출 완료된 과제까지 모든 데이터가 삭제됩니다.
                      </p>
                    </div>
                    
                    {(cacheClearMessage || fullResetMessage) && (
                      <div className={`${styles.cacheMessage} ${(cacheClearMessage || fullResetMessage).includes('✅') ? styles.success : styles.error}`}>
                        {cacheClearMessage || fullResetMessage}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 기타 문의사항 - 아코디언 형식 */}
          <div className={styles.additionalInfo}>
            <div className={styles.settingCard}>
              <button
                className={styles.accordionToggle}
                onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
              >
                <div className={styles.accordionHeader}>
                  <h2 className={styles.cardTitle}>기타 문의</h2>
                  <span className={styles.accordionArrow}>
                    {showAdditionalInfo ? '▲' : '▼'}
                  </span>
                </div>
              </button>
              
              {showAdditionalInfo && (
                <div className={styles.accordionContent}>
                  <p className={styles.cardDescription}>
                    시스템 사용 중 문제가 발생하거나 기능 개선 요청이 있으시면 언제든지 담당자에게 문의해주세요.
                  </p>
                </div>
              )}
            </div>
          </div>


        </div>
      </div>
    </AppLayout>
  )
}

export default SettingsPage
