import path from 'path'

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
        '@components': path.resolve(__dirname, '../src/components'),
        '@styles': path.resolve(__dirname, '../src/styles'),
        '@store': path.resolve(__dirname, '../src/store'),
        '@utils': path.resolve(__dirname, '../src/utils'),
        '@hooks': path.resolve(__dirname, '../src/hooks'),
        '@services': path.resolve(__dirname, '../src/services'),
        '@pages': path.resolve(__dirname, '../src/pages')
      }
    }
    
    // CSS 모듈 처리 설정 추가
    if (config.css) {
      config.css.modules = {
        localsConvention: 'camelCase',
        generateScopedName: '[name]__[local]___[hash:base64:5]'
      }
    }
    
    return config
  }
}

export default config
