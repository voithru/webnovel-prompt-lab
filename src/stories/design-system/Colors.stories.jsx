import React from 'react'

export default {
  title: 'Design System/Colors',
  parameters: {
    docs: {
      description: {
        component: '웹소설 MT 프롬프트 AI 애플리케이션의 완전한 색상 시스템을 보여줍니다. 모든 Border colors, Background colors, Text colors를 포함합니다.'
      }
    }
  }
}

// Border Colors - Complete
export const BorderColors = () => (
  <div style={{ padding: '20px' }}>
    <h2>Border Colors</h2>
    <p style={{ color: '#6b7280', marginBottom: '24px' }}>
      다양한 UI 레이어에서 강한 대비와 시각적 명확성을 보장하기 위한 border 색상 변수들입니다.
    </p>
    
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* High Contrast Borders */}
      <div>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>High Contrast Borders</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-dark)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-dark</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>카드, 입력, 버튼, 아이콘 모양용 고대비 테두리</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#4b5563 (gray-600)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-dark-subtle)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-dark-subtle</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>고대비 테두리 (더 미묘한 버전)</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#1f2937 (gray-800)</code>
          </div>
        </div>
      </div>

      {/* Buffer Borders */}
      <div>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>Buffer Borders</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-buffer)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-buffer</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>배경과 같은 색상의 테두리 (타임라인 아이콘 등)</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#ffffff (white)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-buffer-medium)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-buffer-medium</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>배경과 같은 색상의 테두리 (중간 강도)</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#ffffff (white)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-buffer-strong)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-buffer-strong</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>배경과 같은 색상의 테두리 (강한 강도)</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#ffffff (white)</code>
          </div>
        </div>
      </div>

      {/* Subtle Borders */}
      <div>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>Subtle Borders</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-muted)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-muted</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>아바타 그룹, 텍스트 구분자용 매우 미묘한 구분선</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#f9fafb (gray-50)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-light-subtle)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-light-subtle</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>제목, 섹션, 목록 항목용 매우 미묘한 구분선</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#f3f4f6 (gray-100)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-light)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-light</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>제목, 섹션, 목록 항목용 미묘한 구분선</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#f3f4f6 (gray-100)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-light-medium)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-light-medium</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>제목, 섹션, 목록 항목용 중간 강도 구분선</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#f3f4f6 (gray-100)</code>
          </div>
        </div>
      </div>

      {/* Base Borders */}
      <div>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>Base Borders (Most Commonly Used)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-base-soft)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-base-soft</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>카드, 버튼, 아바타, 아이콘 모양, 입력, 타임라인에 가장 많이 사용 (부드러운 버전)</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#e5e7eb (gray-200)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-base)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-base</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>카드, 버튼, 아바타, 아이콘 모양, 입력, 타임라인에 가장 많이 사용</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#e5e7eb (gray-200)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-base-medium)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-base-medium</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>카드, 버튼, 아바타, 아이콘 모양, 입력, 타임라인에 가장 많이 사용 (중간 강도)</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#e5e7eb (gray-200)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-base-strong)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-base-strong</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>카드, 버튼, 아바타, 아이콘 모양, 입력, 타임라인에 가장 많이 사용 (강한 강도)</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#e5e7eb (gray-200)</code>
          </div>
        </div>
      </div>

      {/* Status Borders */}
      <div>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>Status Borders</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-success-subtle)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-success-subtle</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>긍정적 피드백, 성공 상태, 확인 메시지용 (부드러운 버전)</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#a7f3d0 (emerald-200)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-success)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-success</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>긍정적 피드백, 성공 상태, 확인 메시지용</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#047857 (emerald-700)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-danger-subtle)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-danger-subtle</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>부정적 피드백, 오류 상태, 중요한 경고용 (부드러운 버전)</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#fecdd3 (rose-200)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-danger)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-danger</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>부정적 피드백, 오류 상태, 중요한 경고용</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#be123c (rose-700)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-warning-subtle)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-warning-subtle</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>주의, 잠재적 문제, 비중요한 우려사항용 (부드러운 버전)</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#fed7aa (orange-200)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-warning)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-warning</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>주의, 잠재적 문제, 비중요한 우려사항용</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#ea580c (orange-600)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-brand-subtle)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-brand-subtle</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>브랜드 정체성, 정보 메시지용 (부드러운 버전)</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#bfdbfe (blue-200)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-brand-light)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-brand-light</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>브랜드 정체성, 정보 메시지용 (밝은 버전)</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#2563eb (blue-600)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-brand)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-brand</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>브랜드 정체성, 정보 메시지용</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#1d4ed8 (blue-700)</code>
          </div>
        </div>
      </div>

      {/* Categorical Borders */}
      <div>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>Categorical Borders</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-purple)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-purple</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>차트, 그래프, 대시보드의 범주형 데이터 표현용</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#a855f7 (purple-500)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--border-orange)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--border-orange</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>차트, 그래프, 대시보드의 범주형 데이터 표현용</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#fb923c (orange-400)</code>
          </div>
        </div>
      </div>
         </div>
   </div>
 )

// Background Colors - Complete
export const BackgroundColors = () => (
  <div style={{ padding: '20px' }}>
    <h2>Background Colors</h2>
    <p style={{ color: '#6b7280', marginBottom: '24px' }}>
      다양한 UI 레이어에서 강한 대비와 시각적 명확성을 보장하기 위한 배경색 변수들입니다.
    </p>
    
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Primary & Neutral Grays */}
      <div>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>Primary & Neutral Grays</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-white)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-white</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>순수한 흰색</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#ffffff (white)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-primary-soft)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-primary-soft</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>흰색과 거의 구분되지 않는 매우 밝은 회색</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#ffffff (white)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-primary)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-primary</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>모든 레이아웃과 컴포넌트에 사용되는 흰색 주요 배경</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#ffffff (white)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-primary-medium)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-primary-medium</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>primary보다 약간 더 어두운 밝은 회색</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#ffffff (white)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-primary-strong)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-primary-strong</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>primary보다 더 어두운 밝은 회색이지만 여전히 명확한 배경 음영</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#ffffff (white)</code>
          </div>
        </div>
      </div>

      {/* Secondary Colors */}
      <div>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>Secondary Colors (Gray-50)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-secondary-soft)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-secondary-soft</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>흰색 또는 밝은 배경에서 시각적 명확성과 대비를 위한 UI 요소</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#f9fafb (gray-50)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-secondary</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>흰색 또는 밝은 배경에서 시각적 명확성과 대비를 위한 UI 요소</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#f9fafb (gray-50)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-secondary-medium)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-secondary-medium</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>흰색 또는 밝은 배경에서 시각적 명확성과 대비를 위한 UI 요소</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#f9fafb (gray-50)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-secondary-strong)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-secondary-strong</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>흰색 또는 밝은 배경에서 시각적 명확성과 대비를 위한 UI 요소</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#f9fafb (gray-50)</code>
          </div>
        </div>
      </div>

      {/* Tertiary Colors */}
      <div>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>Tertiary Colors (Gray-100)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-tertiary-soft)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-tertiary-soft</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>흰색 배경에 대한 향상된 시각적 대비를 위한 토글, 체크박스, 입력 필드</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#f3f4f6 (gray-100)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-tertiary)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-tertiary</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>흰색 배경에 대한 향상된 시각적 대비를 위한 토글, 체크박스, 입력 필드</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#f3f4f6 (gray-100)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-tertiary-medium)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-tertiary-medium</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>흰색 배경에 대한 향상된 시각적 대비를 위한 토글, 체크박스, 입력 필드</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#f3f4f6 (gray-100)</code>
          </div>
        </div>
      </div>

      {/* Quaternary Colors */}
      <div>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>Quaternary Colors (Gray-200)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-quaternary)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-quaternary</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>흰색 배경에 대한 향상된 시각적 대비를 위한 진행률 표시줄, 슬라이더 컨트롤</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#e5e7eb (gray-200)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-quaternary-medium)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-quaternary-medium</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>흰색 배경에 대한 향상된 시각적 대비를 위한 진행률 표시줄, 슬라이더 컨트롤</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#e5e7eb (gray-200)</code>
          </div>
        </div>
      </div>

      {/* Gray */}
      <div>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>Gray (Gray-300)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-gray)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-gray</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>흰색 배경에 대한 향상된 시각적 대비를 위한 패턴 또는 기타 그래픽 요소</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#d1d5db (gray-300)</code>
          </div>
        </div>
      </div>

      {/* Brand Blues */}
      <div>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>Brand Blues</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-brand-softer)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-brand-softer</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>브랜드 정체성, 정보 메시지를 위한 알림, 배지, 배너</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#eff6ff (blue-50)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-brand-soft)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-brand-soft</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>브랜드 정체성, 정보 메시지를 위한 알림, 배지, 배너</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#dbeafe (blue-100)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-brand-medium)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-brand-medium</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>브랜드 정체성, 정보 메시지를 위한 알림, 배지, 배너</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#bfdbfe (blue-200)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-brand)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-brand</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>브랜드 정체성을 보여주는 버튼, 아이콘, 기타 컴포넌트</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#1d4ed8 (blue-700)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-brand-strong)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-brand-strong</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>브랜드 정체성을 보여주는 버튼, 아이콘, 기타 컴포넌트</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#1e40af (blue-800)</code>
          </div>
        </div>
      </div>

      {/* Status Colors */}
      <div>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>Status Colors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-success-soft)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-success-soft</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>긍정적 피드백, 성공 상태, 확인 메시지를 위한 알림, 배지, 배너</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#ecfdf5 (emerald-50)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-success-medium)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-success-medium</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>긍정적 피드백, 성공 상태, 확인 메시지를 위한 알림, 배지, 배너</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#d1fae5 (emerald-100)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-success)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-success</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>긍정적 피드백, 성공 상태, 확인 메시지를 위한 브랜드 요소</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#047857 (emerald-700)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-success-strong)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-success-strong</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>긍정적 피드백, 성공 상태, 확인 메시지를 위한 브랜드 요소</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#065f46 (emerald-800)</code>
          </div>
        </div>
      </div>

      {/* More Status Colors */}
      <div>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>More Status Colors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-danger-soft)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-danger-soft</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>부정적 피드백, 오류 상태, 중요한 경고를 위한 알림, 배지, 배너</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#fef2f2 (rose-50)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-danger-medium)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-danger-medium</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>부정적 피드백, 오류 상태, 중요한 경고를 위한 알림, 배지, 배너</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#fecdd3 (rose-100)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-danger)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-danger</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>부정적 피드백, 오류 상태, 중요한 경고를 위한 브랜드 요소</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#be123c (rose-700)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-danger-strong)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-danger-strong</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>부정적 피드백, 오류 상태, 중요한 경고를 위한 브랜드 요소</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#9f1239 (rose-800)</code>
          </div>
        </div>
      </div>

      {/* Warning Colors */}
      <div>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>Warning Colors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-warning-soft)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-warning-soft</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>주의, 잠재적 문제, 비중요한 우려사항을 위한 알림, 배지, 배너</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#fffbeb (orange-50)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-warning-medium)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-warning-medium</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>주의, 잠재적 문제, 비중요한 우려사항을 위한 알림, 배지, 배너</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#fed7aa (orange-100)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-warning)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-warning</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>주의, 잠재적 문제, 비중요한 우려사항을 위한 브랜드 요소</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#f97316 (orange-500)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-warning-strong)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-warning-strong</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>주의, 잠재적 문제, 비중요한 우려사항을 위한 브랜드 요소</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#c2410c (orange-700)</code>
          </div>
        </div>
      </div>

      {/* Utility & Categorical Colors */}
      <div>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>Utility & Categorical Colors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-dark-strong)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-dark-strong</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>버튼, 아이콘 모양 등에 사용되는 요소로 라이트와 다크 모드 모두에서 일관된 어두운 색상 유지</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#111827 (gray-900)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-dark)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-dark</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>버튼, 아이콘 모양 등에 사용되는 요소로 라이트와 다크 모드 모두에서 일관된 어두운 색상 유지</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#1f2937 (gray-800)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-disabled)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-disabled</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>비상호작용, 낮은 우선순위, 읽기 전용 요소 스타일링용 (비활성화된 버튼, 입력 필드 등)</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#f3f4f6 (gray-100)</code>
          </div>
        </div>
      </div>

      {/* Categorical Data Colors */}
      <div>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>Categorical Data Colors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-purple)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-purple</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>차트, 그래프, 대시보드의 범주형 데이터 표현용</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#a855f7 (purple-500)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-sky)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-sky</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>차트, 그래프, 대시보드의 범주형 데이터 표현용</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#0ea5e9 (sky-500)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-teal)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-teal</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>차트, 그래프, 대시보드의 범주형 데이터 표현용</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#0d9488 (teal-600)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-pink)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-pink</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>차트, 그래프, 대시보드의 범주형 데이터 표현용</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#db2777 (pink-600)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-cyan)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-cyan</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>차트, 그래프, 대시보드의 범주형 데이터 표현용</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#06b6d4 (cyan-500)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-fuchsia)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-fuchsia</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>차트, 그래프, 대시보드의 범주형 데이터 표현용</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#c026d3 (fuchsia-600)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-indigo)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-indigo</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>차트, 그래프, 대시보드의 범주형 데이터 표현용</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#4f46e5 (indigo-600)</code>
          </div>
          
          <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ 
              width: '60px', 
              height: '40px', 
              backgroundColor: 'var(--bg-orange)', 
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e5e7eb'
            }}></div>
            <strong>--bg-orange</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>차트, 그래프, 대시보드의 범주형 데이터 표현용</p>
            <code style={{ fontSize: '12px', color: '#9ca3af' }}>#fb923c (orange-400)</code>
          </div>
        </div>
      </div>
    </div>
  </div>
) 
