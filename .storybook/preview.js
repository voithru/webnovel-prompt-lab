import React from 'react'
import '../src/styles/globals.css'
import '../src/styles/design-tokens.css'

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    docs: {
      toc: true,
    },
    // 디자인 시스템 토큰을 Controls에서 자동으로 표시
    designToken: {
      defaultTab: 'design-tokens',
      disable: false,
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'auto', title: 'Auto', icon: 'computer' }
        ],
        dynamicTitle: true,
      },
    },
    // 디자인 시스템 크기 조절
    scale: {
      description: 'Design system scale',
      defaultValue: 'medium',
      toolbar: {
        title: 'Scale',
        icon: 'ruler',
        items: [
          { value: 'small', title: 'Small', icon: 'minus' },
          { value: 'medium', title: 'Medium', icon: 'circle' },
          { value: 'large', title: 'Large', icon: 'plus' }
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme
      const scale = context.globals.scale
      
      // CSS 변수로 테마와 스케일 설정
      const cssVars = {
        '--theme': theme,
        '--scale': scale,
      }
      
      // 다크 모드 자동 감지
      const isDarkMode = theme === 'dark' || 
        (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      
      const backgroundColor = isDarkMode ? 'var(--color-background-dark)' : 'var(--color-background-light)'
      const textColor = isDarkMode ? 'var(--color-text-dark)' : 'var(--color-text-light)'
      
      return React.createElement('div', {
        style: {
          padding: 'var(--spacing-large)',
          backgroundColor,
          color: textColor,
          minHeight: '100vh',
          fontFamily: 'var(--font-family-base)',
          fontSize: 'var(--font-size-base)',
          lineHeight: 'var(--line-height-base)',
          ...cssVars
        }
      }, React.createElement(Story))
    }
  ]
}

export default preview
