import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import Loading from '@components/common/Loading'
import styles from '@styles/modules/ProtectedRoute.module.css'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading message="인증 상태를 확인하고 있습니다..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
