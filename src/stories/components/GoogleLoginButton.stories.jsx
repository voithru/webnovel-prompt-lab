import React, { useState } from 'react'
import GoogleLoginButton from '../../components/common/GoogleLoginButton'

export default {
  title: 'Components/Common/GoogleLoginButton',
  component: GoogleLoginButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Google 로그인을 위한 버튼 컴포넌트입니다. 다양한 크기와 스타일을 지원합니다.'
      }
    }
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: '버튼의 크기를 설정합니다.'
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline'],
      description: '버튼의 스타일 변형을 설정합니다.'
    },
    disabled: {
      control: { type: 'boolean' },
      description: '버튼을 비활성화합니다.'
    },
    loading: {
      control: { type: 'boolean' },
      description: '로딩 상태를 표시합니다.'
    },
    children: {
      control: { type: 'text' },
      description: '버튼에 표시될 텍스트입니다.'
    },
    onClick: {
      action: 'clicked',
      description: '버튼 클릭 시 호출되는 함수입니다.'
    }
  }
}

// 기본 스토리
export const Default = {
  args: {
    size: 'medium',
    variant: 'primary',
    children: '구글로 로그인'
  }
}

// 다양한 크기 스토리
export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      <GoogleLoginButton size="small">작은 버튼</GoogleLoginButton>
      <GoogleLoginButton size="medium">중간 버튼</GoogleLoginButton>
      <GoogleLoginButton size="large">큰 버튼</GoogleLoginButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '버튼의 세 가지 크기 변형을 보여줍니다: small, medium, large'
      }
    }
  }
}

// 다양한 스타일 변형 스토리
export const Variants = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      <GoogleLoginButton variant="primary">Primary 스타일</GoogleLoginButton>
      <GoogleLoginButton variant="secondary">Secondary 스타일</GoogleLoginButton>
      <GoogleLoginButton variant="outline">Outline 스타일</GoogleLoginButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '버튼의 세 가지 스타일 변형을 보여줍니다: primary, secondary, outline'
      }
    }
  }
}

// 상태별 스토리
export const States = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      <GoogleLoginButton>기본 상태</GoogleLoginButton>
      <GoogleLoginButton disabled>비활성화</GoogleLoginButton>
      <GoogleLoginButton loading>로딩 중</GoogleLoginButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '버튼의 다양한 상태를 보여줍니다: 기본, 비활성화, 로딩'
      }
    }
  }
}

// 인터랙티브 스토리
export const Interactive = {
  render: () => {
    const [loading, setLoading] = useState(false)
    
    const handleClick = () => {
      setLoading(true)
      // 3초 후 로딩 상태 해제
      setTimeout(() => setLoading(false), 3000)
    }
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <GoogleLoginButton 
          onClick={handleClick} 
          loading={loading}
          disabled={loading}
        >
          {loading ? '로그인 중...' : '클릭해보세요'}
        </GoogleLoginButton>
        <p style={{ fontSize: '14px', color: '#666' }}>
          버튼을 클릭하면 3초간 로딩 상태가 됩니다.
        </p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '실제 클릭 동작과 로딩 상태를 체험할 수 있는 인터랙티브 예제입니다.'
      }
    }
  }
}

// 실제 사용 예시
export const RealWorldExample = {
  render: () => (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      padding: '40px', 
      borderRadius: '16px',
      minWidth: '400px',
      textAlign: 'center'
    }}>
      <h2 style={{ color: 'white', marginBottom: '24px' }}>웹소설 MT 프롬프트 AI</h2>
      <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>
        서비스를 이용하려면 구글 계정으로 로그인해주세요.
      </p>
      <GoogleLoginButton size="large" variant="primary">
        구글로 로그인
      </GoogleLoginButton>
      <p style={{ 
        fontSize: '12px', 
        color: 'rgba(255,255,255,0.6)', 
        marginTop: '16px',
        lineHeight: '1.4'
      }}>
        로그인하면 개인정보처리방침과 서비스 약관에 동의하는 것으로 간주됩니다.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '실제 로그인 페이지에서 사용되는 모습을 보여주는 예시입니다.'
      }
    }
  }
}

// CSS 모듈 문제 해결 테스트
export const CSSModuleTest = {
  render: () => (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3 style={{ marginBottom: '20px', color: '#333' }}>CSS 모듈 테스트</h3>
      
      {/* 인라인 스타일로 직접 테스트 */}
      <button style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '16px 32px',
        fontSize: '18px',
        minHeight: '56px',
        border: 'none',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
        color: 'white',
        boxShadow: '0 2px 8px rgba(66, 133, 244, 0.3)',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}>
        <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
        </svg>
        인라인 스타일 테스트
      </button>
      
      <p style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
        위 버튼이 제대로 표시되면 인라인 스타일은 작동합니다.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'CSS 모듈 문제를 진단하기 위한 테스트입니다. 인라인 스타일이 제대로 작동하는지 확인할 수 있습니다.'
      }
    }
  }
}
