import React, { useState } from 'react'
import Input from '../../components/common/Input'

// Icons for demonstration
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <circle cx="12" cy="16" r="1" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </svg>
)

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

export default {
  title: 'Components/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component: 'Figma 디자인 시스템에 따른 Input 컴포넌트입니다. 다양한 입력 타입, 아이콘, 애드온, 버튼, 상태 등을 지원합니다.'
      }
    }
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: '입력 필드의 타입'
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'filled', 'outlined'],
      description: '입력 필드의 스타일 변형'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: '입력 필드의 크기'
    },
    label: {
      control: { type: 'text' },
      description: '입력 필드의 레이블'
    },
    placeholder: {
      control: { type: 'text' },
      description: '플레이스홀더 텍스트'
    },
    disabled: {
      control: { type: 'boolean' },
      description: '비활성화 상태'
    },
    readOnly: {
      control: { type: 'boolean' },
      description: '읽기 전용 상태'
    },
    required: {
      control: { type: 'boolean' },
      description: '필수 필드 여부'
    },
    helperText: {
      control: { type: 'text' },
      description: '도움말 텍스트'
    },
    error: {
      control: { type: 'text' },
      description: '오류 메시지'
    },
    success: {
      control: { type: 'text' },
      description: '성공 메시지'
    },
    warning: {
      control: { type: 'text' },
      description: '경고 메시지'
    },
    info: {
      control: { type: 'text' },
      description: '정보 메시지'
    },
    clearable: {
      control: { type: 'boolean' },
      description: '지우기 버튼 표시 여부'
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: '전체 너비 사용 여부'
    },
    multiline: {
      control: { type: 'boolean' },
      description: '여러 줄 입력 여부'
    }
  }
}

// 기본 Input 예시
export const Default = {
  args: {
    type: 'text',
    size: 'medium',
    label: 'First name',
    placeholder: 'Enter your first name',
    helperText: 'Helper text'
  }
}

// 모든 상태를 보여주는 그리드
export const AllStates = () => (
  <div style={{ padding: '20px' }}>
    <h2 style={{ marginBottom: '24px', color: '#111827' }}>Input Component - All States</h2>
    
    <div style={{ display: 'grid', gap: '24px', maxWidth: '1200px' }}>
      {/* Row 1: Basic States */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        <Input 
          label="Default input"
          placeholder="Enter your name"
        />
        <Input 
          label="Focused input"
          placeholder="Enter your name"
          helperText="Helper text"
        />
        <Input 
          label="Disabled input"
          placeholder="Enter your name"
          disabled
        />
        <Input 
          label="Read-only input"
          placeholder="Enter your name"
          readOnly
          value="John Doe"
        />
        <Input 
          label="Required input"
          placeholder="Enter your name"
          required
        />
      </div>

      {/* Row 2: Status States */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        <Input 
          label="Success input"
          placeholder="Enter your name"
          success="Input is valid"
        />
        <Input 
          label="Error input"
          placeholder="Enter your name"
          error="This field is required"
        />
        <Input 
          label="Warning input"
          placeholder="Enter your name"
          warning="Please check your input"
        />
        <Input 
          label="Info input"
          placeholder="Enter your name"
          info="Additional information"
        />
        <Input 
          label="Clearable input"
          placeholder="Enter your name"
          clearable
          value="John Doe"
          onClear={() => {}}
        />
      </div>

      {/* Row 3: Icon States */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        <Input 
          label="With left icon"
          placeholder="Enter your name"
          leftIcon={<UserIcon />}
        />
        <Input 
          label="With right icon"
          placeholder="Enter your email"
          rightIcon={<MailIcon />}
        />
        <Input 
          label="With both icons"
          placeholder="Enter your website"
          leftIcon={<GlobeIcon />}
          rightIcon={<SearchIcon />}
        />
        <Input 
          label="Password input"
          type="password"
          placeholder="Enter your password"
          leftIcon={<LockIcon />}
          rightIcon={<EyeIcon />}
        />
        <Input 
          label="Phone input"
          type="tel"
          placeholder="Enter your phone"
          leftIcon={<PhoneIcon />}
        />
      </div>

      {/* Row 4: Addon States */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        <Input 
          label="With left addon"
          placeholder="username"
          leftAddon="@"
        />
        <Input 
          label="With right addon"
          placeholder="0.00"
          rightAddon="USD"
        />
        <Input 
          label="With both addons"
          placeholder="100"
          leftAddon="$"
          rightAddon=".00"
        />
        <Input 
          label="URL input"
          placeholder="example.com"
          leftAddon="https://"
        />
        <Input 
          label="Email domain"
          placeholder="username"
          rightAddon="@company.com"
        />
      </div>

      {/* Row 5: Button States */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        <Input 
          label="With left button"
          placeholder="Enter text"
          leftButton={{
            text: "Browse",
            onClick: () => {},
            icon: <FileIcon />
          }}
        />
        <Input 
          label="With right button"
          placeholder="Enter your email"
          rightButton={{
            text: "Subscribe",
            onClick: () => {}
          }}
        />
        <Input 
          label="Search input"
          type="search"
          placeholder="Search..."
          rightButton={{
            text: "Search",
            onClick: () => {},
            icon: <SearchIcon />
          }}
        />
        <Input 
          label="Password toggle"
          type="password"
          placeholder="Enter password"
          rightButton={{
            text: "Show",
            onClick: () => {},
            icon: <EyeIcon />
          }}
        />
        <Input 
          label="File input"
          placeholder="No file chosen"
          rightButton={{
            text: "Choose File",
            onClick: () => {}
          }}
        />
      </div>

      {/* Row 6: Dropdown States */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        <Input 
          label="With left dropdown"
          placeholder="Enter text"
          leftDropdown={{
            text: "US (+1)",
            onClick: () => {},
            icon: "🇺🇸"
          }}
        />
        <Input 
          label="With right dropdown"
          placeholder="Select category"
          rightDropdown={{
            text: "All Categories",
            onClick: () => {}
          }}
        />
        <Input 
          label="Country input"
          placeholder="Enter city"
          leftDropdown={{
            text: "USA",
            onClick: () => {},
            icon: "🇺🇸"
          }}
        />
        <Input 
          label="Language input"
          placeholder="Enter text"
          leftDropdown={{
            text: "EN",
            onClick: () => {}
          }}
        />
        <Input 
          label="Currency input"
          placeholder="0.00"
          leftDropdown={{
            text: "USD",
            onClick: () => {}
          }}
        />
      </div>
    </div>
  </div>
)

// 크기별 예시
export const Sizes = () => (
  <div style={{ padding: '20px' }}>
    <h2 style={{ marginBottom: '24px', color: '#111827' }}>Input Sizes</h2>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <Input 
        label="Small input"
        size="small"
        placeholder="Small placeholder"
      />
      <Input 
        label="Medium input"
        size="medium"
        placeholder="Medium placeholder"
      />
      <Input 
        label="Large input"
        size="large"
        placeholder="Large placeholder"
      />
    </div>
  </div>
)

// 텍스트 영역 예시
export const Textarea = () => (
  <div style={{ padding: '20px' }}>
    <h2 style={{ marginBottom: '24px', color: '#111827' }}>Textarea Input</h2>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
      <Input 
        label="Your message"
        placeholder="Write your message here..."
        multiline
        rows={4}
        helperText="Maximum 500 characters"
      />
      <Input 
        label="Description"
        placeholder="Enter description..."
        multiline
        rows={6}
        fullWidth
      />
    </div>
  </div>
)

// 검색 입력 예시
export const SearchInput = () => (
  <div style={{ padding: '20px' }}>
    <h2 style={{ marginBottom: '24px', color: '#111827' }}>Search Input Examples</h2>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
      <Input 
        label="Basic search"
        type="search"
        placeholder="Search..."
        rightButton={{
          text: "Search",
          onClick: () => {}
        }}
      />
      <Input 
        label="Search with category"
        type="search"
        placeholder="Search products..."
        leftDropdown={{
          text: "All Categories",
          onClick: () => {}
        }}
        rightButton={{
          text: "Search",
          onClick: () => {},
          icon: <SearchIcon />
        }}
      />
      <Input 
        label="Advanced search"
        type="search"
        placeholder="Search with filters..."
        leftIcon={<SearchIcon />}
        rightButton={{
          text: "Advanced",
          onClick: () => {}
        }}
      />
    </div>
  </div>
)

// 폼 예시
export const FormExample = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '24px', color: '#111827' }}>Form Example</h2>
      
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input 
              label="First name"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
            />
            <Input 
              label="Last name"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              required
            />
          </div>
          
          <Input 
            label="Email address"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            leftIcon={<MailIcon />}
            required
            helperText="We'll never share your email"
          />
          
          <Input 
            label="Phone number"
            type="tel"
            placeholder="Enter your phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            leftIcon={<PhoneIcon />}
            leftDropdown={{
              text: "+1",
              onClick: () => {}
            }}
          />
          
          <Input 
            label="Message"
            placeholder="Write your message here..."
            multiline
            rows={4}
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            helperText="Maximum 1000 characters"
          />
          
          <button 
            type="submit"
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Submit Form
          </button>
        </div>
      </form>
    </div>
  )
}

// 인터랙티브 예시
export const Interactive = () => {
  const [value, setValue] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '24px', color: '#111827' }}>Interactive Input</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
        <Input 
          label="Clearable input"
          placeholder="Type something..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          clearable
          onClear={() => setValue('')}
        />
        
        <Input 
          label="Password with toggle"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter password"
          leftIcon={<LockIcon />}
          rightButton={{
            text: showPassword ? "Hide" : "Show",
            onClick: () => setShowPassword(!showPassword),
            icon: showPassword ? <EyeOffIcon /> : <EyeIcon />
          }}
        />
        
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          위의 입력 필드들을 조작하여 인터랙티브 기능을 확인해보세요.
        </p>
      </div>
    </div>
  )
}
