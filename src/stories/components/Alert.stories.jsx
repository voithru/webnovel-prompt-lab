import React from 'react'
import Alert from '../../components/common/Alert'

export default {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    docs: {
      description: {
        component: 'Figma 디자인 시스템에 따른 Alert 컴포넌트입니다. 5가지 색상 테마와 4가지 구성 타입을 지원합니다.'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['success', 'error', 'warning', 'info', 'neutral'],
      description: 'Alert의 색상 테마'
    },
    type: {
      control: { type: 'select' },
      options: ['simple', 'detailed'],
      description: 'Alert의 구성 타입'
    },
    title: {
      control: { type: 'text' },
      description: 'Alert의 제목 (detailed 타입에서만 표시)'
    },
    children: {
      control: { type: 'text' },
      description: 'Alert의 메시지 내용'
    },
    showClose: {
      control: { type: 'boolean' },
      description: '닫기 버튼 표시 여부'
    },
    showNewTag: {
      control: { type: 'boolean' },
      description: '"New" 태그 표시 여부'
    },
    showArrow: {
      control: { type: 'boolean' },
      description: '화살표 아이콘 표시 여부'
    },
    buttonText: {
      control: { type: 'text' },
      description: '버튼 텍스트 (detailed 타입에서만 표시)'
    }
  }
}

// 기본 Alert 예시
export const Default = {
  args: {
    variant: 'info',
    type: 'simple',
    children: 'Great job! You\'ve acknowledged this significant alert message.',
    showClose: true
  }
}

// 모든 변형을 보여주는 그리드
export const AllVariants = () => (
  <div style={{ padding: '20px' }}>
    <h2 style={{ marginBottom: '24px', color: '#111827' }}>Alert Component - All Variants</h2>
    
    <div style={{ display: 'grid', gap: '16px', maxWidth: '1200px' }}>
      {/* Row 1: Simple with Close */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        <Alert variant="success" showClose={true} onClose={() => {}}>
          Great job! You've acknowledged this significant alert message.
        </Alert>
        <Alert variant="error" showClose={true} onClose={() => {}}>
          Great job! You've acknowledged this significant alert message.
        </Alert>
        <Alert variant="warning" showClose={true} onClose={() => {}}>
          Great job! You've acknowledged this significant alert message.
        </Alert>
        <Alert variant="info" showClose={true} onClose={() => {}}>
          Great job! You've acknowledged this significant alert message.
        </Alert>
        <Alert variant="neutral" showClose={true} onClose={() => {}}>
          Great job! You've acknowledged this significant alert message.
        </Alert>
      </div>

      {/* Row 2: Detailed with Heading & Button */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        <Alert 
          variant="success" 
          type="detailed"
          title="Alert heading"
          buttonText="Learn more"
          onButtonClick={() => {}}
          showClose={true}
          onClose={() => {}}
        >
          Great job! You've acknowledged this significant alert message. We're adding extra text to illustrate how longer notifications are displayed. By doing this, you can see how text wrapping and spacing are managed.
        </Alert>
        <Alert 
          variant="error" 
          type="detailed"
          title="Alert heading"
          buttonText="Learn more"
          onButtonClick={() => {}}
          showClose={true}
          onClose={() => {}}
        >
          Great job! You've acknowledged this significant alert message. We're adding extra text to illustrate how longer notifications are displayed. By doing this, you can see how text wrapping and spacing are managed.
        </Alert>
        <Alert 
          variant="warning" 
          type="detailed"
          title="Alert heading"
          buttonText="Learn more"
          onButtonClick={() => {}}
          showClose={true}
          onClose={() => {}}
        >
          Great job! You've acknowledged this significant alert message. We're adding extra text to illustrate how longer notifications are displayed. By doing this, you can see how text wrapping and spacing are managed.
        </Alert>
        <Alert 
          variant="info" 
          type="detailed"
          title="Alert heading"
          buttonText="Learn more"
          onButtonClick={() => {}}
          showClose={true}
          onClose={() => {}}
        >
          Great job! You've acknowledged this significant alert message. We're adding extra text to illustrate how longer notifications are displayed. By doing this, you can see how text wrapping and spacing are managed.
        </Alert>
        <Alert 
          variant="neutral" 
          type="detailed"
          title="Alert heading"
          buttonText="Learn more"
          onButtonClick={() => {}}
          showClose={true}
          onClose={() => {}}
        >
          Great job! You've acknowledged this significant alert message. We're adding extra text to illustrate how longer notifications are displayed. By doing this, you can see how text wrapping and spacing are managed.
        </Alert>
      </div>

      {/* Row 3: With "New" Tag & Arrow */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        <Alert variant="success" showNewTag={true} showArrow={true}>
          Great job! You've acknowledged this significant alert message.
        </Alert>
        <Alert variant="error" showNewTag={true} showArrow={true}>
          Great job! You've acknowledged this significant alert message.
        </Alert>
        <Alert variant="warning" showNewTag={true} showArrow={true}>
          Great job! You've acknowledged this significant alert message.
        </Alert>
        <Alert variant="info" showNewTag={true} showArrow={true}>
          Great job! You've acknowledged this significant alert message.
        </Alert>
        <Alert variant="neutral" showNewTag={true} showArrow={true}>
          Great job! You've acknowledged this significant alert message.
        </Alert>
      </div>

      {/* Row 4: Simple without Close */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        <Alert variant="success">
          Great job! You've acknowledged this significant alert message.
        </Alert>
        <Alert variant="error">
          Great job! You've acknowledged this significant alert message.
        </Alert>
        <Alert variant="warning">
          Great job! You've acknowledged this significant alert message.
        </Alert>
        <Alert variant="info">
          Great job! You've acknowledged this significant alert message.
        </Alert>
        <Alert variant="neutral">
          Great job! You've acknowledged this significant alert message.
        </Alert>
      </div>
    </div>
  </div>
)

// 개별 변형 예시들
export const Success = {
  args: {
    variant: 'success',
    children: 'Great job! You\'ve acknowledged this significant alert message.',
    showClose: true
  }
}

export const Error = {
  args: {
    variant: 'error',
    children: 'Great job! You\'ve acknowledged this significant alert message.',
    showClose: true
  }
}

export const Warning = {
  args: {
    variant: 'warning',
    children: 'Great job! You\'ve acknowledged this significant alert message.',
    showClose: true
  }
}

export const Info = {
  args: {
    variant: 'info',
    children: 'Great job! You\'ve acknowledged this significant alert message.',
    showClose: true
  }
}

export const Neutral = {
  args: {
    variant: 'neutral',
    children: 'Great job! You\'ve acknowledged this significant alert message.',
    showClose: true
  }
}

// 상세한 Alert 예시
export const Detailed = {
  args: {
    variant: 'info',
    type: 'detailed',
    title: 'Alert heading',
    children: 'Great job! You\'ve acknowledged this significant alert message. We\'re adding extra text to illustrate how longer notifications are displayed. By doing this, you can see how text wrapping and spacing are managed.',
    buttonText: 'Learn more',
    onButtonClick: () => {},
    showClose: true
  }
}

// "New" 태그와 화살표가 있는 예시
export const WithNewTagAndArrow = {
  args: {
    variant: 'success',
    children: 'Great job! You\'ve acknowledged this significant alert message.',
    showNewTag: true,
    showArrow: true
  }
}

// 인터랙티브 예시
export const Interactive = () => {
  const [alerts, setAlerts] = React.useState([
    { id: 1, variant: 'success', message: 'Success message', visible: true },
    { id: 2, variant: 'error', message: 'Error message', visible: true },
    { id: 3, variant: 'warning', message: 'Warning message', visible: true }
  ])

  const handleClose = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, visible: false } : alert
    ))
  }

  const resetAlerts = () => {
    setAlerts(alerts.map(alert => ({ ...alert, visible: true })))
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={resetAlerts}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Reset All Alerts
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {alerts.map(alert => 
          alert.visible && (
            <Alert
              key={alert.id}
              variant={alert.variant}
              showClose={true}
              onClose={() => handleClose(alert.id)}
            >
              {alert.message}
            </Alert>
          )
        )}
      </div>
    </div>
  )
}
