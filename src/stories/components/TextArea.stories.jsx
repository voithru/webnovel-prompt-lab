import React, { useState } from 'react'
import TextArea from '../../components/common/Textarea'

export default {
  title: 'Components/TextArea',
  component: TextArea,
  parameters: {
    docs: {
      description: {
        component: '웹소설 MT 프로덕트에 최적화된 TextArea 컴포넌트입니다. 4가지 variant를 지원하며, 서식 도구 모음, 문자 수 카운터, 전송 버튼 등을 포함합니다.'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'rich-editor', 'comment', 'chat'],
      description: 'TextArea의 스타일 variant'
    },
    label: {
      control: { type: 'text' },
      description: '입력 필드의 레이블'
    },
    placeholder: {
      control: { type: 'text' },
      description: '플레이스홀더 텍스트'
    },
    value: {
      control: { type: 'text' },
      description: '입력 값'
    },
    rows: {
      control: { type: 'number', min: 1, max: 10 },
      description: '텍스트 영역의 행 수'
    },
    maxLength: {
      control: { type: 'number' },
      description: '최대 문자 수'
    },
    showToolbar: {
      control: { type: 'boolean' },
      description: '서식 도구 모음 표시 여부'
    },
    showCounter: {
      control: { type: 'boolean' },
      description: '문자 수 카운터 표시 여부'
    },
    showSendButton: {
      control: { type: 'boolean' },
      description: '전송 버튼 표시 여부'
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
    fullWidth: {
      control: { type: 'boolean' },
      description: '전체 너비 사용 여부'
    }
  }
}

// 기본 TextArea 예시
export const Default = {
  args: {
    variant: 'default',
    label: 'Your message',
    placeholder: 'Write text here...',
    rows: 4,
    maxLength: 8000,
    showCounter: true
  }
}

// 리치 에디터 TextArea
export const RichEditor = {
  args: {
    variant: 'rich-editor',
    placeholder: 'Write an article...',
    rows: 8,
    maxLength: 8000,
    showToolbar: true,
    showSendButton: true
  }
}

// 댓글 입력 TextArea
export const Comment = {
  args: {
    variant: 'comment',
    placeholder: 'Write a comment...',
    rows: 4,
    maxLength: 8000,
    showSendButton: true
  }
}

// 채팅 입력 TextArea
export const Chat = {
  args: {
    variant: 'chat',
    placeholder: 'Your message...',
    rows: 1,
    maxLength: 8000,
    showSendButton: true
  }
}

// 모든 variant를 보여주는 예시
export const AllVariants = () => (
  <div style={{ padding: '20px' }}>
    <h2 style={{ marginBottom: '24px', color: '#111827' }}>TextArea Component - All Variants</h2>
    
    <div style={{ display: 'grid', gap: '32px', maxWidth: '1200px' }}>
      {/* 기본 TextArea */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>Default TextArea</h3>
        <TextArea 
          variant="default"
          label="Your message"
          placeholder="Write text here..."
          rows={4}
          maxLength={8000}
          showCounter={true}
        />
      </div>

      {/* 리치 에디터 */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>Rich Editor</h3>
        <TextArea 
          variant="rich-editor"
          placeholder="Write an article..."
          rows={8}
          maxLength={8000}
          showToolbar={true}
          showSendButton={true}
        />
      </div>

      {/* 댓글 입력 */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>Comment Input</h3>
        <TextArea 
          variant="comment"
          placeholder="Write a comment..."
          rows={4}
          maxLength={8000}
          showSendButton={true}
        />
      </div>

      {/* 채팅 입력 */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>Chat Input</h3>
        <TextArea 
          variant="chat"
          placeholder="Your message..."
          rows={1}
          maxLength={8000}
          showSendButton={true}
        />
      </div>
    </div>
  </div>
)

// 인터랙티브 예시
export const Interactive = () => {
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState([])

  const handleSend = (text) => {
    setMessages(prev => [...prev, { id: Date.now(), text, timestamp: new Date().toLocaleTimeString() }])
    setValue('')
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '24px', color: '#111827' }}>Interactive TextArea</h2>
      
      <div style={{ display: 'grid', gap: '24px', maxWidth: '800px' }}>
        <TextArea 
          variant="chat"
          placeholder="Type your message here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={8000}
          showSendButton={true}
          onSend={handleSend}
        />
        
        {messages.length > 0 && (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ marginBottom: '16px', color: '#111827' }}>Sent Messages</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map(message => (
                <div key={message.id} style={{ 
                  padding: '12px', 
                  backgroundColor: '#f9fafb', 
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb'
                }}>
                  <p style={{ margin: '0 0 4px 0', color: '#111827' }}>{message.text}</p>
                  <small style={{ color: '#6b7280' }}>{message.timestamp}</small>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 웹소설 MT 프로덕트 예시
export const WebNovelMTExample = () => {
  const [translationText, setTranslationText] = useState('')
  const [promptText, setPromptText] = useState('')

  const handleTranslationSubmit = (text) => {
    console.log('Translation submitted:', text)
    // 여기에 번역 제출 로직 추가
  }

  const handlePromptSubmit = (text) => {
    console.log('Prompt submitted:', text)
    // 여기에 프롬프트 제출 로직 추가
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '24px', color: '#111827' }}>웹소설 MT 프로덕트 예시</h2>
      
      <div style={{ display: 'grid', gap: '32px', maxWidth: '1200px' }}>
        {/* 번역 입력 영역 */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: '#111827' }}>번역 입력</h3>
          <TextArea 
            variant="rich-editor"
            placeholder="번역할 원문을 입력하세요..."
            value={translationText}
            onChange={(e) => setTranslationText(e.target.value)}
            rows={6}
            maxLength={8000}
            showToolbar={true}
            showSendButton={true}
            onSend={handleTranslationSubmit}
          />
        </div>

        {/* 프롬프트 입력 영역 */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: '#111827' }}>프롬프트 입력</h3>
          <TextArea 
            variant="comment"
            placeholder="번역 품질을 개선하기 위한 프롬프트를 작성하세요..."
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            rows={4}
            maxLength={8000}
            showSendButton={true}
            onSend={handlePromptSubmit}
          />
        </div>

        {/* 사용법 안내 */}
        <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px' }}>
          <h4 style={{ marginBottom: '12px', color: '#111827' }}>사용법 안내</h4>
          <ul style={{ margin: '0', paddingLeft: '20px', color: '#374151' }}>
            <li><strong>Default:</strong> 기본적인 텍스트 입력 필드</li>
            <li><strong>Rich Editor:</strong> 상단 툴바와 하단 전송 버튼이 있는 에디터</li>
            <li><strong>Comment:</strong> 하단에 전송 버튼과 툴바가 있는 댓글 입력</li>
            <li><strong>Chat:</strong> 좌우 툴바와 중앙 텍스트 영역이 있는 채팅 입력</li>
            <li>모든 variant는 8000자 제한과 문자 카운터를 지원합니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
