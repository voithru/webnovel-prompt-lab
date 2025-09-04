import React from 'react'
import { AutoStyledButton } from './AutoStyledComponent'
import Button from './Button'

const BottomActionBar = ({ 
  leftButtons = [], 
  rightButton = null,
  style = {} 
}) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 'var(--sidebar-width, 288px)',
      right: 0,
      backgroundColor: 'white',
      borderTop: '1px solid var(--border-light)',
      borderLeft: '1px solid var(--border-light)',
      padding: '8px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 900,
      boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
      ...style
    }}>
      {/* 왼쪽 버튼들 */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {leftButtons.map((button, index) => (
          <AutoStyledButton
            key={index}
            variant={button.variant || 'secondary'}
            size={button.size || 'md'}
            onClick={button.onClick}
          >
            {button.text}
          </AutoStyledButton>
        ))}
      </div>

      {/* 오른쪽 버튼 */}
      {rightButton && (
        <Button
          variant={rightButton.variant || 'blue'}
          size={rightButton.size || 'medium'}
          style={rightButton.style || 'solid'}
          onClick={rightButton.onClick}
          rightIcon={rightButton.rightIcon}
        >
          {rightButton.text}
        </Button>
      )}
    </div>
  )
}

export default BottomActionBar
