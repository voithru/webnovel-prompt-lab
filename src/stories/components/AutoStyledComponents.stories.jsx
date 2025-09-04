import React from 'react'
import { DesignSystemProvider } from '../../components/common/DesignSystemProvider'
import { 
  AutoStyledComponent, 
  AutoStyledButton, 
  AutoStyledInput, 
  AutoStyledCard 
} from '../../components/common/AutoStyledComponent'

export default {
  title: 'Design System/Auto Styled Components',
  component: AutoStyledComponent,
  decorators: [
    (Story) => (
      <DesignSystemProvider>
        <Story />
      </DesignSystemProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
이 컴포넌트들은 스토리북의 디자인 시스템을 자동으로 적용합니다.
스토리북에서 디자인을 수정하면 프로덕트에 자동으로 반영됩니다.

## 주요 특징
- 🎨 **자동 스타일링**: 디자인 토큰을 자동으로 적용
- 🔄 **실시간 동기화**: 스토리북 변경사항이 프로덕트에 즉시 반영
- 🎯 **일관성**: 모든 컴포넌트가 동일한 디자인 시스템 사용
- 🌙 **테마 지원**: 라이트/다크 모드 자동 전환
        `
      }
    }
  }
}

// 기본 컴포넌트 스토리
export const Default = {
  args: {
    children: '자동 스타일링된 컴포넌트',
    variant: 'base'
  }
}

export const WithCustomStyle = {
  args: {
    children: '사용자 정의 스타일이 적용된 컴포넌트',
    style: {
      backgroundColor: 'var(--color-success)',
      color: 'white',
      textAlign: 'center'
    }
  }
}

// 버튼 컴포넌트 스토리
export const Button = {
  render: (args) => <AutoStyledButton {...args} />,
  args: {
    children: '자동 스타일링 버튼',
    variant: 'primary',
    size: 'md'
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
      description: '버튼 스타일 변형'
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: '버튼 크기'
    }
  }
}

export const ButtonVariants = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <AutoStyledButton variant="primary" size="sm">Small Primary</AutoStyledButton>
      <AutoStyledButton variant="primary" size="md">Medium Primary</AutoStyledButton>
      <AutoStyledButton variant="primary" size="lg">Large Primary</AutoStyledButton>
      <AutoStyledButton variant="secondary" size="sm">Small Secondary</AutoStyledButton>
      <AutoStyledButton variant="secondary" size="md">Medium Secondary</AutoStyledButton>
      <AutoStyledButton variant="secondary" size="lg">Large Secondary</AutoStyledButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 크기와 스타일의 버튼들을 보여줍니다.'
      }
    }
  }
}

// 입력 필드 컴포넌트 스토리
export const Input = {
  render: (args) => <AutoStyledInput {...args} />,
  args: {
    placeholder: '자동 스타일링 입력 필드',
    type: 'text',
    size: 'md'
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number'],
      description: '입력 필드 타입'
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: '입력 필드 크기'
    }
  }
}

export const InputVariants = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px' }}>
      <AutoStyledInput placeholder="Small Input" size="sm" />
      <AutoStyledInput placeholder="Medium Input" size="md" />
      <AutoStyledInput placeholder="Large Input" size="lg" />
      <AutoStyledInput placeholder="Email Input" type="email" />
      <AutoStyledInput placeholder="Password Input" type="password" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 크기와 타입의 입력 필드들을 보여줍니다.'
      }
    }
  }
}

// 카드 컴포넌트 스토리
export const Card = {
  render: (args) => (
    <AutoStyledCard {...args}>
      <h3>카드 제목</h3>
      <p>이것은 자동 스타일링된 카드 컴포넌트입니다. 디자인 시스템의 색상, 여백, 그림자 등을 자동으로 적용합니다.</p>
    </AutoStyledCard>
  ),
  args: {
    variant: 'base',
    elevation: 'md'
  },
  argTypes: {
    elevation: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: '카드 그림자 레벨'
    }
  }
}

export const CardVariants = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
      <AutoStyledCard elevation="none">
        <h4>No Shadow</h4>
        <p>그림자가 없는 카드입니다.</p>
      </AutoStyledCard>
      
      <AutoStyledCard elevation="sm">
        <h4>Small Shadow</h4>
        <p>작은 그림자가 있는 카드입니다.</p>
      </AutoStyledCard>
      
      <AutoStyledCard elevation="md">
        <h4>Medium Shadow</h4>
        <p>중간 그림자가 있는 카드입니다.</p>
      </AutoStyledCard>
      
      <AutoStyledCard elevation="lg">
        <h4>Large Shadow</h4>
        <p>큰 그림자가 있는 카드입니다.</p>
      </AutoStyledCard>
      
      <AutoStyledCard elevation="xl">
        <h4>Extra Large Shadow</h4>
        <p>매우 큰 그림자가 있는 카드입니다.</p>
      </AutoStyledCard>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 그림자 레벨의 카드들을 보여줍니다.'
      }
    }
  }
}

// 통합 예시
export const IntegratedExample = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '800px' }}>
      <h2>통합 예시</h2>
      <p>이 페이지는 모든 자동 스타일링 컴포넌트를 사용하여 구성되었습니다.</p>
      
      <div style={{ marginTop: '24px' }}>
        <h3>입력 폼</h3>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <AutoStyledInput placeholder="이름" size="md" />
          <AutoStyledInput placeholder="이메일" type="email" size="md" />
        </div>
        <AutoStyledButton variant="primary" size="md">제출</AutoStyledButton>
      </div>
      
      <div style={{ marginTop: '32px' }}>
        <h3>카드 그리드</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <AutoStyledCard elevation="sm">
            <h4>정보 카드</h4>
            <p>중요한 정보를 표시합니다.</p>
          </AutoStyledCard>
          
          <AutoStyledCard elevation="md">
            <h4>알림 카드</h4>
            <p>사용자에게 알림을 표시합니다.</p>
          </AutoStyledCard>
          
          <AutoStyledCard elevation="lg">
            <h4>강조 카드</h4>
            <p>특별히 강조하고 싶은 내용입니다.</p>
          </AutoStyledCard>
        </div>
      </div>
      
      <div style={{ marginTop: '32px' }}>
        <h3>액션 버튼들</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <AutoStyledButton variant="primary" size="sm">저장</AutoStyledButton>
          <AutoStyledButton variant="secondary" size="sm">취소</AutoStyledButton>
          <AutoStyledButton variant="primary" size="md">편집</AutoStyledButton>
          <AutoStyledButton variant="secondary" size="md">삭제</AutoStyledButton>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 자동 스타일링 컴포넌트를 함께 사용한 통합 예시입니다.'
      }
    }
  }
}

// 테마 전환 데모
export const ThemeToggle = {
  render: () => {
    const [isDark, setIsDark] = React.useState(false)
    
    const toggleTheme = () => {
      setIsDark(!isDark)
      document.documentElement.classList.toggle('dark')
    }
    
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <AutoStyledButton onClick={toggleTheme}>
            {isDark ? '🌞 라이트 모드로 전환' : '🌙 다크 모드로 전환'}
          </AutoStyledButton>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          <AutoStyledCard elevation="md">
            <h4>테마 전환 카드</h4>
            <p>현재 테마: {isDark ? '다크' : '라이트'}</p>
            <p>이 카드의 스타일이 테마에 따라 자동으로 변경됩니다.</p>
          </AutoStyledCard>
          
          <AutoStyledInput 
            placeholder="테마 전환 입력 필드" 
            style={{ width: '100%' }}
          />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '테마 전환 시 컴포넌트들이 자동으로 스타일을 변경하는 것을 보여줍니다.'
      }
    }
  }
}
