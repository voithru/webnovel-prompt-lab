# 컴포넌트 사용 가이드라인

## 🎯 핵심 원칙

**모든 화면을 구성하는 컴포넌트들은 반드시 스토리북에 있는 컴포넌트를 사용해야 합니다.**

## 📚 사용 가능한 스토리북 컴포넌트

### 🧩 UI 컴포넌트
- **Button** - 모든 버튼 요소
- **Input** - 텍스트 입력 필드
- **TextArea** - 긴 텍스트 입력
- **Table** - 데이터 테이블
- **Alert** - 알림 메시지
- **AlertDemo** - 알림 데모
- **FileUpload** - 파일 업로드
- **GoogleLoginButton** - 구글 로그인 버튼
- **Sidebar** - 네비게이션 사이드바

### 🎨 디자인 시스템
- **Colors** - 색상 팔레트
- **Typography** - 타이포그래피
- **Spacing** - 여백 시스템
- **Icons** - 아이콘 라이브러리
- **BorderShadow** - 테두리 및 그림자

## 🔧 컴포넌트 사용 방법

### 1. 기존 컴포넌트 사용
```jsx
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Table from '../components/common/Table'

const MyPage = () => {
  return (
    <div>
      <Input placeholder="검색어를 입력하세요" />
      <Button variant="solid" style="primary">
        검색
      </Button>
      <Table data={data} columns={columns} />
    </div>
  )
}
```

### 2. 새 컴포넌트가 필요한 경우
1. **먼저 스토리북에 있는지 확인**
2. **없다면 새로 생성하고 스토리북에 추가**
3. **기존 컴포넌트와 일관성 유지**

## 📋 컴포넌트 추가 시 체크리스트

### ✅ 필수 항목
- [ ] `src/components/common/` 폴더에 컴포넌트 생성
- [ ] `src/styles/modules/` 폴더에 CSS 모듈 생성
- [ ] `src/stories/components/` 폴더에 스토리 파일 생성
- [ ] 다양한 상태와 변형을 스토리에 포함
- [ ] Props 문서화 및 타입 정의

### 🎨 디자인 가이드라인
- [ ] 기존 색상 팔레트 사용 (`src/styles/design-tokens.css`)
- [ ] 일관된 여백 시스템 적용
- [ ] 반응형 디자인 고려
- [ ] 다크 모드 지원

## 🚫 금지 사항

### ❌ 하드코딩된 컴포넌트
```jsx
// ❌ 잘못된 예시
const MyPage = () => {
  return (
    <div>
      <button style={{ 
        backgroundColor: '#007bff', 
        color: 'white',
        padding: '10px 20px'
      }}>
        클릭
      </button>
    </div>
  )
}
```

### ✅ 올바른 예시
```jsx
// ✅ 올바른 예시
import Button from '../components/common/Button'

const MyPage = () => {
  return (
    <div>
      <Button variant="solid" style="primary">
        클릭
      </Button>
    </div>
  )
}
```

## 🔍 컴포넌트 검색 방법

### 1. 스토리북 실행
```bash
npm run storybook
```

### 2. 컴포넌트 탐색
- 왼쪽 사이드바에서 원하는 컴포넌트 찾기
- 다양한 상태와 변형 확인
- Props와 사용법 학습

### 3. 코드 확인
- 스토리 파일에서 실제 사용법 확인
- 컴포넌트 소스 코드 참조

## 📝 예시: 새 페이지 생성

```jsx
import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Alert from '../components/common/Alert'

const NewPage = () => {
  return (
    <AppLayout currentPage="새 페이지">
      <h1>새 페이지</h1>
      
      <Alert variant="info" title="안내">
        이 페이지는 스토리북 컴포넌트만 사용합니다.
      </Alert>
      
      <div style={{ marginBottom: '20px' }}>
        <Input 
          placeholder="이름을 입력하세요"
          label="이름"
        />
      </div>
      
      <Button variant="solid" style="primary">
        저장
      </Button>
    </AppLayout>
  )
}

export default NewPage
```

## 🎯 요약

1. **모든 UI 요소는 스토리북 컴포넌트 사용**
2. **새 컴포넌트 필요 시 스토리북에 먼저 추가**
3. **일관된 디자인 시스템 유지**
4. **하드코딩 금지, 재사용 가능한 컴포넌트 사용**

이 가이드라인을 따라 개발하면 일관성 있고 유지보수가 용이한 애플리케이션을 만들 수 있습니다.
