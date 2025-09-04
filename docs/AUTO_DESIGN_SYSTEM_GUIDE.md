# 🎨 자동 디자인 시스템 가이드

## 🚀 개요

이 프로젝트는 **스토리북의 디자인 시스템을 자동으로 프로덕트에 적용**하는 시스템을 구축했습니다. 이제 스토리북에서 디자인을 수정하면 프로덕트에 **자동으로 반영**됩니다.

## ✨ 주요 특징

### 🔄 실시간 동기화
- 스토리북에서 색상, 여백, 타이포그래피 수정 시 **즉시 프로덕트 반영**
- CSS 변수를 통한 **자동 스타일 동기화**
- 테마 변경 시 **모든 컴포넌트 자동 업데이트**

### 🎯 자동 스타일링
- **하드코딩 불필요**: 모든 스타일이 디자인 시스템에서 자동 적용
- **일관성 보장**: 모든 컴포넌트가 동일한 디자인 토큰 사용
- **반응형 지원**: 스케일 변경 시 자동으로 크기 조정

### 🌙 테마 지원
- **라이트/다크 모드** 자동 전환
- **시스템 테마** 자동 감지
- **커스텀 테마** 지원

## 🛠 사용 방법

### 1. 기본 사용법

```jsx
import { useDesignSystemContext } from '../components/common/DesignSystemProvider'

const MyComponent = () => {
  const { designTokens, createStyles } = useDesignSystemContext()
  
  return (
    <div style={{
      padding: designTokens.spacing.lg,
      backgroundColor: designTokens.colors.background.primary,
      color: designTokens.colors.text.primary,
      borderRadius: designTokens.borders.radius.md,
      boxShadow: designTokens.shadows.md
    }}>
      자동 스타일링된 컴포넌트
    </div>
  )
}
```

### 2. 자동 스타일링 컴포넌트 사용

```jsx
import { 
  AutoStyledButton, 
  AutoStyledInput, 
  AutoStyledCard 
} from '../components/common/AutoStyledComponent'

const MyPage = () => {
  return (
    <div>
      {/* 자동으로 디자인 시스템 적용 */}
      <AutoStyledButton variant="primary" size="lg">
        큰 기본 버튼
      </AutoStyledButton>
      
      <AutoStyledInput 
        placeholder="자동 스타일링 입력 필드"
        size="md"
      />
      
      <AutoStyledCard elevation="lg">
        <h3>자동 스타일링 카드</h3>
        <p>이 카드는 디자인 시스템을 자동으로 적용합니다.</p>
      </AutoStyledCard>
    </div>
  )
}
```

### 3. 고차 컴포넌트 사용

```jsx
import { withDesignSystem } from '../components/common/DesignSystemProvider'

const MyComponent = ({ designSystem, ...props }) => {
  const { colors, spacing, typography } = designSystem
  
  return (
    <div style={{
      padding: spacing.lg(),
      backgroundColor: colors.background.primary(),
      fontSize: typography.fontSize.lg()
    }}>
      {props.children}
    </div>
  )
}

export default withDesignSystem(MyComponent)
```

## 🎨 디자인 토큰

### 색상 시스템
```jsx
const { colors } = useDesignSystemContext()

// 기본 색상
colors.primary()      // #3b82f6
colors.secondary()    // #64748b
colors.success()      // #10b981
colors.warning()      // #f59e0b
colors.error()        // #ef4444

// 배경 색상
colors.background.light()    // #ffffff
colors.background.dark()     // #0f172a
colors.background.primary()  // #f8fafc

// 텍스트 색상
colors.text.light()   // #1e293b
colors.text.dark()    // #f1f5f9
colors.text.muted()   // #64748b
```

### 여백 시스템
```jsx
const { spacing } = useDesignSystemContext()

spacing.xs()   // 4px
spacing.sm()   // 8px
spacing.md()   // 16px
spacing.lg()   // 24px
spacing.xl()   // 32px
spacing.xxl()  // 48px

// 동적 여백 (스케일에 따라 조정)
spacing.dynamic('md')  // 현재 스케일에 맞는 여백
```

### 타이포그래피 시스템
```jsx
const { typography } = useDesignSystemContext()

// 폰트 크기
typography.fontSize.xs()    // 12px
typography.fontSize.sm()    // 14px
typography.fontSize.base()  // 16px
typography.fontSize.lg()    // 18px
typography.fontSize.xl()    // 20px
typography.fontSize['2xl']() // 24px

// 폰트 굵기
typography.fontWeight.light()    // 300
typography.fontWeight.normal()   // 400
typography.fontWeight.medium()   // 500
typography.fontWeight.semibold() // 600
typography.fontWeight.bold()     // 700
```

### 테두리 및 그림자
```jsx
const { borders, shadows } = useDesignSystemContext()

// 테두리 반경
borders.radius.sm()   // 4px
borders.radius.md()   // 8px
borders.radius.lg()   // 12px
borders.radius.xl()   // 16px

// 그림자
shadows.sm()   // 0 1px 2px 0 rgba(0, 0, 0, 0.05)
shadows.md()   // 0 4px 6px -1px rgba(0, 0, 0, 0.1)
shadows.lg()   // 0 10px 15px -3px rgba(0, 0, 0, 0.1)
```

## 🔧 고급 기능

### 1. 커스텀 스타일 생성

```jsx
const { createStyles } = useDesignSystemContext()

const customStyles = createStyles({
  button: {
    custom: {
      backgroundColor: 'var(--color-custom)',
      border: '2px solid var(--color-primary)',
      borderRadius: 'var(--border-radius-full)',
      padding: 'var(--spacing-xl) var(--spacing-xxl)',
      fontSize: 'var(--font-size-xl)',
      fontWeight: 'var(--font-weight-bold)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    }
  }
})
```

### 2. CSS 변수 직접 설정

```jsx
const { setCSSVariable, getCSSVariable } = useDesignSystemContext()

// 커스텀 색상 추가
setCSSVariable('--color-custom', '#ff6b6b')

// 값 가져오기
const customColor = getCSSVariable('--color-custom', '#ff6b6b')
```

### 3. 테마 전환

```jsx
const { toggleTheme, currentTheme } = useDesignSystemContext()

const ThemeToggle = () => {
  return (
    <button onClick={toggleTheme}>
      현재 테마: {currentTheme}
      {currentTheme === 'light' ? '🌙' : '🌞'}
    </button>
  )
}
```

## 📱 반응형 디자인

### 스케일 시스템
```jsx
const { setScale, currentScale } = useDesignSystemContext()

// 스케일 변경
setScale('small')   // 작은 크기
setScale('medium')  // 중간 크기 (기본값)
setScale('large')   // 큰 크기

// 스케일에 따른 자동 크기 조정
const dynamicSpacing = spacing.dynamic('md') // 현재 스케일에 맞는 여백
```

## 🎯 모범 사례

### ✅ 권장사항

1. **자동 스타일링 컴포넌트 우선 사용**
   ```jsx
   // ✅ 좋음
   <AutoStyledButton variant="primary">클릭</AutoStyledButton>
   
   // ❌ 피하기
   <button style={{ backgroundColor: '#3b82f6' }}>클릭</button>
   ```

2. **디자인 토큰 직접 사용**
   ```jsx
   // ✅ 좋음
   style={{ padding: designTokens.spacing.lg }}
   
   // ❌ 피하기
   style={{ padding: '24px' }}
   ```

3. **테마 자동 감지 활용**
   ```jsx
   // ✅ 좋음
   style={{ 
     backgroundColor: theme.adaptive.background(),
     color: theme.adaptive.text()
   }}
   
   // ❌ 피하기
   style={{ 
     backgroundColor: isDark ? '#0f172a' : '#ffffff'
   }}
   ```

### 🚫 금지 사항

1. **하드코딩된 색상**
2. **고정된 여백 값**
3. **인라인 스타일로 만든 UI 컴포넌트**
4. **디자인 시스템과 무관한 커스텀 스타일**

## 🔍 디버깅

### 1. 디자인 시스템 상태 확인

```jsx
const { designTokens, isInitialized } = useDesignSystemContext()

console.log('디자인 시스템 초기화:', isInitialized)
console.log('현재 디자인 토큰:', designTokens)
```

### 2. CSS 변수 확인

```jsx
const { getCSSVariable } = useDesignSystemContext()

// 브라우저 개발자 도구에서 확인
console.log('Primary 색상:', getCSSVariable('--color-primary'))
console.log('기본 여백:', getCSSVariable('--spacing-md'))
```

### 3. 테마 상태 확인

```jsx
const { currentTheme, isDark, isLight } = useDesignSystemContext()

console.log('현재 테마:', currentTheme)
console.log('다크 모드:', isDark())
console.log('라이트 모드:', isLight())
```

## 📚 예시 프로젝트

### 간단한 카드 컴포넌트

```jsx
import React from 'react'
import { useDesignSystemContext } from '../components/common/DesignSystemProvider'

const SimpleCard = ({ title, content, variant = 'base' }) => {
  const { designTokens, createInlineStyles } = useDesignSystemContext()
  
  const cardStyles = createInlineStyles('card', variant)
  
  return (
    <div style={{
      ...cardStyles,
      padding: designTokens.spacing.lg,
      margin: designTokens.spacing.md,
      border: `1px solid ${designTokens.colors.border.primary}`,
      borderRadius: designTokens.borders.radius.lg,
      backgroundColor: designTokens.colors.background.primary,
      color: designTokens.colors.text.primary,
      boxShadow: designTokens.shadows.md,
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: designTokens.shadows.lg
      }
    }}>
      <h3 style={{
        fontSize: designTokens.typography.fontSize.lg,
        fontWeight: designTokens.typography.fontWeight.semibold,
        marginBottom: designTokens.spacing.md,
        color: designTokens.colors.text.primary
      }}>
        {title}
      </h3>
      
      <p style={{
        fontSize: designTokens.typography.fontSize.base,
        lineHeight: designTokens.typography.lineHeight.normal,
        color: designTokens.colors.text.muted
      }}>
        {content}
      </p>
    </div>
  )
}

export default SimpleCard
```

## 🎉 요약

이 자동 디자인 시스템을 사용하면:

1. **🎨 스토리북에서 디자인 수정 시 프로덕트에 자동 반영**
2. **🔄 실시간 스타일 동기화**
3. **🎯 일관된 디자인 시스템 적용**
4. **🌙 자동 테마 전환**
5. **📱 반응형 디자인 지원**
6. **⚡ 개발 생산성 향상**

이제 화면을 만들 때 디자인 시스템을 매번 설정할 필요가 없고, 스토리북에서 수정하면 프로덕트에 자동으로 적용됩니다!
