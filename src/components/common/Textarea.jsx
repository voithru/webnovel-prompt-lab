import React, { useState, useRef, useEffect } from 'react'

// SVG 아이콘 컴포넌트들
const Icons = {
  // 파일 첨부 아이콘
  AttachFile: () => (
    <svg width="16" height="16" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinejoin="round" d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6"/>
    </svg>
  ),
  // 위치 설정 아이콘
  Location: () => (
    <svg width="16" height="16" viewBox="0 0 16 20" fill="currentColor">
      <path d="M8 0a7.992 7.992 0 0 0-6.583 12.535 1 1 0 0 0 .12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 0 0 1.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.934.934 0 0 0 .122-.192A8.001 8.001 0 0 0 8 0Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
    </svg>
  ),
  // 이미지 업로드 아이콘
  UploadImage: () => (
    <svg width="16" height="16" viewBox="0 0 16 20" fill="currentColor">
      <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
      <path d="M14.067 0H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.933-2ZM6.709 13.809a1 1 0 1 1-1.418 1.409l-2-2.013a1 1 0 0 1 0-1.412l2-2a1 1 0 1 1 1.414 1.414L5.412 12.5l1.297 1.309Zm6-.6-2 2.013a1 1 0 1 1-1.418-1.409l1.3-1.307-1.295-1.295a1 1 0 1 1 1.414-1.414l2 2a1 1 0 0 1-.001 1.408v.004Z"/>
    </svg>
  ),
  // 코드 포맷 아이콘
  FormatCode: () => (
    <svg width="16" height="16" viewBox="0 0 16 20" fill="currentColor">
      <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z"/>
      <path d="M14.067 0H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.933-2ZM6.709 13.809a1 1 0 1 1-1.418 1.409l-2-2.013a1 1 0 0 1 0-1.412l2-2a1 1 0 1 1 1.414 1.414L5.412 12.5l1.297 1.309Zm6-.6-2 2.013a1 1 0 1 1-1.418-1.409l1.3-1.307-1.295-1.295a1 1 0 1 1 1.414-1.414l2 2a1 1 0 0 1-.001 1.408v.004Z"/>
    </svg>
  ),
  // 이모지 아이콘
  Emoji: () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM13.5 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm3.5 9.5A5.5 5.5 0 0 1 4.6 11h10.81A5.5 5.5 0 0 1 10 15.5Z"/>
    </svg>
  ),
  // 리스트 아이콘
  List: () => (
    <svg width="16" height="16" viewBox="0 0 21 18" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 3h9.563M9.5 9h9.563M9.5 15h9.563M1.5 13a2 2 0 1 1 3.321 1.5L1.5 17h5m-5-15 2-1v6m-2 0h4"/>
    </svg>
  ),
  // 설정 아이콘
  Settings: () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/>
    </svg>
  ),
  // 타임라인 아이콘
  Timeline: () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path d="M18 2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM2 18V7h6.7l.4-.409A4.309 4.309 0 0 1 15.753 7H18v11H2Z"/>
      <path d="M8.139 10.411 5.289 13.3A1 1 0 0 0 5 14v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .7-.288l2.886-2.851-3.447-3.45ZM14 8a2.463 2.463 0 0 0-3.484 0l-.971.983 3.468 3.468.987-.971A2.463 2.463 0 0 0 14 8Z"/>
    </svg>
  ),
  // 다운로드 아이콘
  Download: () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z"/>
      <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
    </svg>
  ),
  // 전체화면 아이콘
  Fullscreen: () => (
    <svg width="16" height="16" viewBox="0 0 19 19" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 1h5m0 0v5m0-5-5 5M1.979 6V1H7m0 16.042H1.979V12M18 12v5.042h-5M13 12l5 5M2 1l5 5m0 6-5 5"/>
    </svg>
  ),
  // 전송 아이콘
  Send: () => (
    <svg width="20" height="20" viewBox="0 0 18 20" fill="currentColor">
      <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
    </svg>
  )
}

const TextArea = ({
  label,
  placeholder = 'Write text here...',
  value = '',
  onChange,
  onSend,
  rows = 4,
  maxLength = 8000,
  variant = 'default', // 'default', 'rich-editor', 'comment', 'chat'
  showToolbar = true,
  showCounter = true,
  showSendButton = true,
  disabled = false,
  readOnly = false,
  required = false,
  helperText,
  error,
  success,
  warning,
  info,
  fullWidth = false
}) => {
  const [text, setText] = useState(value)
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    setText(value)
  }, [value])

  const handleChange = (e) => {
    const newValue = e.target.value
    setText(newValue)
    if (onChange) {
      onChange(e)
    }
  }

  const handleSend = () => {
    if (onSend && text.trim()) {
      onSend(text)
      setText('')
    }
  }

  const characterCount = text.length
  const isOverLimit = maxLength && characterCount > maxLength

  // 기본 TextArea 스타일 - HTML과 동일
  const defaultTextAreaStyle = {
    display: 'block',
    padding: '10px',
    width: '100%',
    fontSize: '14px',
    color: '#111827',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: '1.5'
  }

  // 리치 에디터 스타일 - HTML과 동일
  const richEditorStyle = {
    width: '100%',
    marginBottom: '16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#f9fafb'
  }

  const richEditorToolbarStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px'
  }

  const richEditorTextareaStyle = {
    display: 'block',
    width: '100%',
    padding: '16px',
    fontSize: '14px',
    color: '#1f2937',
    backgroundColor: '#ffffff',
    border: 'none',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: '1.6',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px'
  }

  // 댓글 입력 스타일 - HTML과 동일
  const commentStyle = {
    width: '100%',
    marginBottom: '16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#f9fafb'
  }

  const commentTextareaStyle = {
    width: '100%',
    padding: '16px',
    fontSize: '14px',
    color: '#111827',
    backgroundColor: '#ffffff',
    border: 'none',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px'
  }

  const commentToolbarStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e5e7eb',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px'
  }

  // 채팅 입력 스타일 - HTML과 동일
  const chatStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: '#f9fafb'
  }

  const chatTextareaStyle = {
    display: 'block',
    margin: '0 16px',
    padding: '10px',
    width: '100%',
    fontSize: '14px',
    color: '#111827',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    outline: 'none',
    resize: 'none',
    fontFamily: 'inherit',
    lineHeight: '1.5'
  }

  // 공통 버튼 스타일 - HTML과 동일
  const toolbarButtonStyle = {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px',
    fontSize: '14px',
    color: '#6b7280',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }

  const sendButtonStyle = {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#ffffff',
    backgroundColor: '#2563eb',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  }

  const requiredStyle = {
    color: '#dc2626',
    marginLeft: '4px'
  }

  const helperTextStyle = {
    marginTop: '8px',
    fontSize: '12px',
    color: '#6b7280'
  }

  const characterCounterStyle = {
    fontSize: '12px',
    color: isOverLimit ? '#dc2626' : '#6b7280',
    marginTop: '8px'
  }

  // 기본 TextArea 렌더링
  if (variant === 'default') {
    return (
      <div style={{ marginBottom: '16px' }}>
        {label && (
          <label style={labelStyle}>
            {label}
            {required && <span style={requiredStyle}>*</span>}
          </label>
        )}
        <textarea
          ref={textareaRef}
          style={defaultTextAreaStyle}
          value={text}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
        />
        {showCounter && (
          <div style={characterCounterStyle}>
            {characterCount} / {maxLength}
          </div>
        )}
        {helperText && <div style={helperTextStyle}>{helperText}</div>}
      </div>
    )
  }

  // 리치 에디터 렌더링 - HTML과 동일
  if (variant === 'rich-editor') {
    return (
      <div style={richEditorStyle}>
        {showToolbar && (
          <div style={richEditorToolbarStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button type="button" style={toolbarButtonStyle} title="Attach file">
                <Icons.AttachFile />
              </button>
              <button type="button" style={toolbarButtonStyle} title="Set location">
                <Icons.Location />
              </button>
              <button type="button" style={toolbarButtonStyle} title="Upload image">
                <Icons.UploadImage />
              </button>
              <button type="button" style={toolbarButtonStyle} title="Format code">
                <Icons.FormatCode />
              </button>
              <button type="button" style={toolbarButtonStyle} title="Add emoji">
                <Icons.Emoji />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button type="button" style={toolbarButtonStyle} title="Add list">
                <Icons.List />
              </button>
              <button type="button" style={toolbarButtonStyle} title="Settings">
                <Icons.Settings />
              </button>
              <button type="button" style={toolbarButtonStyle} title="Timeline">
                <Icons.Timeline />
              </button>
              <button type="button" style={toolbarButtonStyle} title="Download">
                <Icons.Download />
              </button>
            </div>
            <button type="button" style={toolbarButtonStyle} title="Full screen">
              <Icons.Fullscreen />
            </button>
          </div>
        )}
        <textarea
          ref={textareaRef}
          style={richEditorTextareaStyle}
          value={text}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
        />
        {showSendButton && (
          <div style={{ padding: '16px', textAlign: 'right' }}>
            <button
              type="button"
              style={sendButtonStyle}
              onClick={handleSend}
              disabled={disabled || readOnly || !text.trim()}
            >
              Publish post
            </button>
          </div>
        )}
      </div>
    )
  }

  // 댓글 입력 렌더링 - HTML과 동일
  if (variant === 'comment') {
    return (
      <div style={commentStyle}>
        <textarea
          ref={textareaRef}
          style={commentTextareaStyle}
          value={text}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
        />
        <div style={commentToolbarStyle}>
          <button
            type="button"
            style={sendButtonStyle}
            onClick={handleSend}
            disabled={disabled || readOnly || !text.trim()}
          >
            Post comment
          </button>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button type="button" style={toolbarButtonStyle} title="Attach file">
              <Icons.AttachFile />
            </button>
            <button type="button" style={toolbarButtonStyle} title="Set location">
              <Icons.Location />
            </button>
            <button type="button" style={toolbarButtonStyle} title="Upload image">
              <Icons.UploadImage />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 채팅 입력 렌더링 - HTML과 동일
  if (variant === 'chat') {
    return (
      <div style={chatStyle}>
        <button type="button" style={toolbarButtonStyle} title="Upload image">
          <Icons.UploadImage />
        </button>
        <button type="button" style={toolbarButtonStyle} title="Add emoji">
          <Icons.Emoji />
        </button>
        <textarea
          ref={textareaRef}
          style={chatTextareaStyle}
          value={text}
          onChange={handleChange}
          placeholder={placeholder}
          rows={1}
          maxLength={maxLength}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
        />
        {showSendButton && (
          <button
            type="button"
            style={{
              ...sendButtonStyle,
              padding: '8px',
              borderRadius: '50%',
              backgroundColor: '#2563eb'
            }}
            onClick={handleSend}
            disabled={disabled || readOnly || !text.trim()}
            title="Send message"
          >
            <Icons.Send />
          </button>
        )}
      </div>
    )
  }

  // 기본 반환
  return null
}

export default TextArea 