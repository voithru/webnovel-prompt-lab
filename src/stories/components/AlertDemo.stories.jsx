import React from 'react'
import AlertDemo from '../../components/common/AlertDemo'

export default {
  title: 'Components/AlertDemo',
  component: AlertDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Alert 컴포넌트의 다양한 사용 예시를 보여주는 인터랙티브 데모 페이지입니다. 다양한 variant의 Alert를 추가하고 관리할 수 있습니다.'
      }
    }
  }
}

export const Default = {
  render: () => <AlertDemo />
}

export const WithCustomTitle = {
  render: () => (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <h1 style={{ 
        color: 'var(--fg-primary)', 
        textAlign: 'center',
        marginBottom: 'var(--spacing-6)',
        fontSize: 'var(--text-3xl)'
      }}>
        커스텀 제목이 있는 Alert 데모
      </h1>
      <AlertDemo />
    </div>
  )
}
