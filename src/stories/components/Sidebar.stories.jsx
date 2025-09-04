import React from 'react'
import Sidebar from '../../components/common/Sidebar'

export default {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    docs: {
      description: {
        component: 'Flowbite 스타일의 사이드바 컴포넌트입니다. 네비게이션, 사용자 프로필, 알림 박스를 포함합니다.'
      }
    }
  }
}

// 기본 사이드바 (확장된 상태)
export const Default = () => (
  <div style={{ height: '100vh', display: 'flex' }}>
    <Sidebar expanded={true} />
    <div style={{ flex: 1, padding: '20px', backgroundColor: '#f9fafb' }}>
      <h2>메인 콘텐츠 영역</h2>
      <p>사이드바가 왼쪽에 표시됩니다.</p>
    </div>
  </div>
)

// 축소된 사이드바
export const Collapsed = () => (
  <div style={{ height: '100vh', display: 'flex' }}>
    <Sidebar expanded={false} />
    <div style={{ flex: 1, padding: '20px', backgroundColor: '#f9fafb' }}>
      <h2>축소된 사이드바</h2>
      <p>사이드바가 축소되어 아이콘만 표시됩니다.</p>
    </div>
  </div>
)
