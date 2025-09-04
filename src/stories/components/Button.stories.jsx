import React from 'react'
import Button from '../../components/common/Button'

// Arrow icons for demonstration
const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
  </svg>
)

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Figma 디자인 시스템에 따른 Button 컴포넌트입니다. 7가지 색상 테마, 5가지 내용 구성, 4가지 크기/상태, 아이콘 전용 버튼을 지원합니다.'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['blue', 'white', 'green', 'red', 'orange', 'dark', 'brown'],
      description: '버튼의 색상 테마'
    },
    size: {
      control: { type: 'select' },
      options: ['large', 'medium', 'small'],
      description: '버튼의 크기'
    },
    style: {
      control: { type: 'select' },
      options: ['solid', 'outline', 'ghost'],
      description: '버튼의 스타일'
    },
    leftIcon: {
      control: { type: 'boolean' },
      description: '왼쪽 아이콘 표시 여부'
    },
    rightIcon: {
      control: { type: 'boolean' },
      description: '오른쪽 아이콘 표시 여부'
    },
    iconOnly: {
      control: { type: 'boolean' },
      description: '아이콘만 표시하는 버튼 여부'
    },
    disabled: {
      control: { type: 'boolean' },
      description: '비활성화 상태'
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: '전체 너비 사용 여부'
    }
  }
}

// 기본 Button 예시
export const Default = {
  args: {
    variant: 'blue',
    size: 'medium',
    style: 'solid',
    children: 'Button text'
  }
}

// 모든 변형을 보여주는 그리드
export const AllVariants = () => (
  <div style={{ padding: '20px' }}>
    <h2 style={{ marginBottom: '24px', color: '#111827' }}>Button Component - All Variants</h2>
    
    <div style={{ display: 'grid', gap: '24px', maxWidth: '1400px' }}>
      {/* Row 1: Text Only */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '16px' }}>
        <Button variant="blue" size="large" style="solid">Button text</Button>
        <Button variant="white" size="large" style="solid">Button text</Button>
        <Button variant="green" size="large" style="solid">Button text</Button>
        <Button variant="red" size="large" style="solid">Button text</Button>
        <Button variant="orange" size="large" style="solid">Button text</Button>
        <Button variant="dark" size="large" style="solid">Button text</Button>
        <Button variant="brown" size="large" style="solid">Button text</Button>
      </div>

      {/* Row 2: Text + Right Arrow */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '16px' }}>
        <Button variant="blue" size="large" style="solid" rightIcon={<ArrowRight />}>Button text</Button>
        <Button variant="white" size="large" style="solid" rightIcon={<ArrowRight />}>Button text</Button>
        <Button variant="green" size="large" style="solid" rightIcon={<ArrowRight />}>Button text</Button>
        <Button variant="red" size="large" style="solid" rightIcon={<ArrowRight />}>Button text</Button>
        <Button variant="orange" size="large" style="solid" rightIcon={<ArrowRight />}>Button text</Button>
        <Button variant="dark" size="large" style="solid" rightIcon={<ArrowRight />}>Button text</Button>
        <Button variant="brown" size="large" style="solid" rightIcon={<ArrowRight />}>Button text</Button>
      </div>

      {/* Row 3: Left Arrow + Text */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '16px' }}>
        <Button variant="blue" size="large" style="solid" leftIcon={<ArrowLeft />}>Button text</Button>
        <Button variant="white" size="large" style="solid" leftIcon={<ArrowLeft />}>Button text</Button>
        <Button variant="green" size="large" style="solid" leftIcon={<ArrowLeft />}>Button text</Button>
        <Button variant="red" size="large" style="solid" leftIcon={<ArrowLeft />}>Button text</Button>
        <Button variant="orange" size="large" style="solid" leftIcon={<ArrowLeft />}>Button text</Button>
        <Button variant="dark" size="large" style="solid" leftIcon={<ArrowLeft />}>Button text</Button>
        <Button variant="brown" size="large" style="solid" leftIcon={<ArrowLeft />}>Button text</Button>
      </div>

      {/* Row 4: Outline Style */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '16px' }}>
        <Button variant="blue" size="large" style="outline">Button text</Button>
        <Button variant="white" size="large" style="outline">Button text</Button>
        <Button variant="green" size="large" style="outline">Button text</Button>
        <Button variant="red" size="large" style="outline">Button text</Button>
        <Button variant="orange" size="large" style="outline">Button text</Button>
        <Button variant="dark" size="large" style="outline">Button text</Button>
        <Button variant="brown" size="large" style="outline">Button text</Button>
      </div>

      {/* Row 5: Ghost Style */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '16px' }}>
        <Button variant="blue" size="large" style="ghost">Button text</Button>
        <Button variant="white" size="large" style="ghost">Button text</Button>
        <Button variant="green" size="large" style="ghost">Button text</Button>
        <Button variant="red" size="large" style="ghost">Button text</Button>
        <Button variant="orange" size="large" style="ghost">Button text</Button>
        <Button variant="dark" size="large" style="ghost">Button text</Button>
        <Button variant="brown" size="large" style="ghost">Button text</Button>
      </div>
    </div>
  </div>
)

// 크기별 예시
export const Sizes = () => (
  <div style={{ padding: '20px' }}>
    <h2 style={{ marginBottom: '24px', color: '#111827' }}>Button Sizes</h2>
    
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button variant="blue" size="large">Large Button</Button>
      <Button variant="blue" size="medium">Medium Button</Button>
      <Button variant="blue" size="small">Small Button</Button>
    </div>
  </div>
)

// 스타일별 예시
export const Styles = () => (
  <div style={{ padding: '20px' }}>
    <h2 style={{ marginBottom: '24px', color: '#111827' }}>Button Styles</h2>
    
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button variant="blue" style="solid">Solid</Button>
      <Button variant="blue" style="outline">Outline</Button>
      <Button variant="blue" style="ghost">Ghost</Button>
    </div>
  </div>
)

// 아이콘 전용 버튼 예시
export const IconOnly = () => (
  <div style={{ padding: '20px' }}>
    <h2 style={{ marginBottom: '24px', color: '#111827' }}>Icon Only Buttons</h2>
    
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Heart Icon Buttons */}
      <div>
        <h3 style={{ marginBottom: '16px', color: '#374151' }}>Heart Icon</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Button variant="blue" size="large" iconOnly><HeartIcon /></Button>
          <Button variant="blue" size="medium" iconOnly><HeartIcon /></Button>
          <Button variant="blue" size="small" iconOnly><HeartIcon /></Button>
          <Button variant="blue" size="large" style="outline" iconOnly><HeartIcon /></Button>
          <Button variant="blue" size="large" style="ghost" iconOnly><HeartIcon /></Button>
        </div>
      </div>

      {/* Trash Icon Buttons */}
      <div>
        <h3 style={{ marginBottom: '16px', color: '#374151' }}>Trash Icon</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Button variant="red" size="large" iconOnly><TrashIcon /></Button>
          <Button variant="red" size="medium" iconOnly><TrashIcon /></Button>
          <Button variant="red" size="small" iconOnly><TrashIcon /></Button>
          <Button variant="red" size="large" style="outline" iconOnly><TrashIcon /></Button>
          <Button variant="red" size="large" style="ghost" iconOnly><TrashIcon /></Button>
        </div>
      </div>
    </div>
  </div>
)

// 개별 variant 예시들
export const Blue = {
  args: {
    variant: 'blue',
    size: 'medium',
    style: 'solid',
    children: 'Button text'
  }
}

export const White = {
  args: {
    variant: 'white',
    size: 'medium',
    style: 'solid',
    children: 'Button text'
  }
}

export const Green = {
  args: {
    variant: 'green',
    size: 'medium',
    style: 'solid',
    children: 'Button text'
  }
}

export const Red = {
  args: {
    variant: 'red',
    size: 'medium',
    style: 'solid',
    children: 'Button text'
  }
}

export const Orange = {
  args: {
    variant: 'orange',
    size: 'medium',
    style: 'solid',
    children: 'Button text'
  }
}

export const Dark = {
  args: {
    variant: 'dark',
    size: 'medium',
    style: 'solid',
    children: 'Button text'
  }
}

export const Brown = {
  args: {
    variant: 'brown',
    size: 'medium',
    style: 'solid',
    children: 'Button text'
  }
}

// 인터랙티브 예시
export const Interactive = () => {
  const [count, setCount] = React.useState(0)

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '24px', color: '#111827' }}>Interactive Buttons</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button 
            variant="blue" 
            size="medium" 
            onClick={() => setCount(count + 1)}
          >
            Count: {count}
          </Button>
          
          <Button 
            variant="red" 
            size="medium" 
            onClick={() => setCount(0)}
          >
            Reset
          </Button>
        </div>
        
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          위의 버튼들을 클릭하여 인터랙티브 기능을 확인해보세요.
        </p>
      </div>
    </div>
  )
}
