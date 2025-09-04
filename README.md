# 웹소설 프롬프트 랩 (WebNovel Prompt Lab)

LLM을 통한 웹소설 MT를 위한 베이스 프롬프트를 만들기 위해, 여러 프롬프트를 실험하고 결과를 취합할 수 있도록 만든 MVP 웹 서비스입니다.

웹소설 번역 품질 향상을 위한 프롬프트 개발 및 평가 플랫폼입니다.

## 📖 프로젝트 개요

링귀스트들이 웹소설 번역의 품질을 높이기 위한 프롬프트를 작성하고 평가할 수 있는 웹 브라우저 서비스입니다. LLM 자동번역과 R&D 팀이 제공하는 번역문을 기반으로 고품질 번역 프롬프트를 개발하고, 연구 목적의 데이터를 수집합니다.

Admin은 스프레드 시트로 관리하고, 배포는 netlify를 사용합니다.

## 🚀 주요 기능

### 5단계 워크플로우
1. **Step 1: 자동번역** - LLM과 설정집을 활용한 자동번역 생성
2. **Step 2: 프롬프트 개선** - R&D 팀 제공 번역문 기반 프롬프트 작성
3. **Step 3: 프롬프트 평가** - 작성한 프롬프트의 좋아요/싫어요 평가
4. **Step 4: 최종 선택** - 최고 품질의 번역문과 프롬프트 선별
5. **Step 5: 연구 리포트** - 상세한 평가 및 연구 보고서 작성

### 핵심 특징
- **Google Sheets 연동**: 스프레드시트 기반 과제 관리
- **로컬 LLM 처리**: 안전한 로컬 환경에서 번역 처리
- **실시간 평가**: 프롬프트 품질 실시간 평가 및 피드백
- **데이터 수집**: 웹훅을 통한 연구 데이터 자동 제출
- **사용자 친화적 UI**: 직관적이고 사용하기 쉬운 인터페이스

## 🛠 기술 스택

- **Frontend**: React 18, Zustand (상태관리), React Router
- **Desktop**: Electron
- **Build Tool**: Vite
- **Styling**: CSS Modules, Custom CSS Properties
- **Development**: Storybook, ESLint
- **APIs**: OpenAI, Google Sheets API
- **Language**: JavaScript (ES2022)

## 🎯 컴포넌트 사용 가이드라인

### ⚠️ 핵심 원칙
**모든 화면을 구성하는 컴포넌트들은 반드시 스토리북에 있는 컴포넌트를 사용해야 합니다.**

### 📚 사용 가능한 컴포넌트
- **UI 컴포넌트**: Button, Input, TextArea, Table, Alert, FileUpload, Sidebar 등
- **디자인 시스템**: Colors, Typography, Spacing, Icons, BorderShadow

### 🔧 사용 방법
```jsx
// ✅ 올바른 예시: 스토리북 컴포넌트 사용
import Button from '../components/common/Button'
import Input from '../components/common/Input'

const MyPage = () => (
  <div>
    <Input placeholder="검색어를 입력하세요" />
    <Button variant="solid" style="primary">검색</Button>
  </div>
)

// ❌ 잘못된 예시: 하드코딩된 컴포넌트
const MyPage = () => (
  <div>
    <button style={{ backgroundColor: '#007bff' }}>검색</button>
  </div>
)
```

### 📋 새 컴포넌트 추가 시
1. 먼저 스토리북에 있는지 확인
2. 없다면 새로 생성하고 스토리북에 추가
3. 기존 컴포넌트와 일관성 유지

**자세한 내용은 [`docs/COMPONENT_USAGE_GUIDELINES.md`](docs/COMPONENT_USAGE_GUIDELINES.md)를 참조하세요.**

## 🎨 자동 디자인 시스템

### ✨ 핵심 특징
**스토리북에서 디자인을 수정하면 프로덕트에 자동으로 반영됩니다!**

- **🔄 실시간 동기화**: 색상, 여백, 타이포그래피 수정 시 즉시 프로덕트 반영
- **🎯 자동 스타일링**: 하드코딩 불필요, 모든 스타일이 디자인 시스템에서 자동 적용
- **🌙 테마 지원**: 라이트/다크 모드 자동 전환 및 시스템 테마 자동 감지
- **📱 반응형 지원**: 스케일 변경 시 자동으로 크기 조정

### 🚀 사용 방법

#### 1. 자동 스타일링 컴포넌트 사용
```jsx
import { 
  AutoStyledButton, 
  AutoStyledInput, 
  AutoStyledCard 
} from '../components/common/AutoStyledComponent'

const MyPage = () => (
  <div>
    <AutoStyledButton variant="primary" size="lg">큰 기본 버튼</AutoStyledButton>
    <AutoStyledInput placeholder="자동 스타일링 입력 필드" />
    <AutoStyledCard elevation="lg">
      <h3>자동 스타일링 카드</h3>
      <p>이 카드는 디자인 시스템을 자동으로 적용합니다.</p>
    </AutoStyledCard>
  </div>
)
```

#### 2. 디자인 토큰 직접 사용
```jsx
import { useDesignSystemContext } from '../components/common/DesignSystemProvider'

const MyComponent = () => {
  const { designTokens } = useDesignSystemContext()
  
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

### 📚 자세한 가이드
**자동 디자인 시스템의 모든 기능은 [`docs/AUTO_DESIGN_SYSTEM_GUIDE.md`](docs/AUTO_DESIGN_SYSTEM_GUIDE.md)를 참조하세요.**

## 📋 시스템 요구사항

- **OS**: Windows 10+, macOS 10.14+, Ubuntu 18.04+
- **Node.js**: 18.0.0 이상
- **RAM**: 4GB 이상 권장
- **Storage**: 500MB 이상 여유 공간

## 🔧 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd webnovel-mt-editor
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.example`을 참고하여 `.env` 파일을 생성하고 필요한 API 키를 설정하세요.

```bash
cp .env.example .env
```

필수 환경 변수:
- `OPENAI_API_KEY`: OpenAI API 키
- `GOOGLE_CLIENT_ID`: Google OAuth2 클라이언트 ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth2 클라이언트 시크릿

### 4. 개발 모드 실행
```bash
# 웹 개발 서버만 실행
npm run dev

# Electron과 함께 실행
npm run electron-dev

# Storybook 실행
npm run storybook
```

### 5. 프로덕션 빌드
```bash
# 웹 빌드
npm run build

# Electron 앱 빌드
npm run electron-build
```

## 📖 사용 방법

### 1. 로그인
- Google 계정으로 로그인
- Google Sheets 접근 권한 허용

### 2. 과제 설정
- 스프레드시트 URL 입력
- 과제 목록 확인 및 선택

### 3. 워크플로우 진행
- Step 1: 자동번역 확인
- Step 2-4: 프롬프트 작성 및 평가
- Step 5: 최종 보고서 작성

### 4. 결과 제출
- 평가 결과 자동 제출
- 연구 리포트 제출

## 🏗 프로젝트 구조

```
webnovel-mt-editor/
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── auth/           # 인증 관련 컴포넌트
│   │   ├── common/         # 공통 컴포넌트 (스토리북 필수)
│   │   ├── layout/         # 레이아웃 컴포넌트
│   │   ├── task/           # 과제 관련 컴포넌트
│   │   ├── prompt/         # 프롬프트 관련 컴포넌트
│   │   ├── evaluation/     # 평가 관련 컴포넌트
│   │   └── report/         # 보고서 관련 컴포넌트
│   ├── pages/              # 페이지 컴포넌트
│   ├── store/              # Zustand 스토어
│   ├── services/           # API 서비스
│   ├── hooks/              # 커스텀 훅
│   ├── utils/              # 유틸리티 (디자인 시스템 포함)
│   └── styles/             # 스타일 파일
├── electron/               # Electron 메인 프로세스
│   ├── main/              # 메인 프로세스 코드
│   ├── ipc/               # IPC 핸들러
│   └── config/            # 설정 파일
├── .storybook/            # Storybook 설정
└── docs/                  # 프로젝트 문서
```

## 🧪 개발 도구

### Storybook
컴포넌트 개발 및 테스트를 위한 Storybook을 제공합니다.

```bash
npm run storybook
```

**중요**: 모든 UI 컴포넌트는 Storybook에서 확인하고 테스트할 수 있어야 합니다.

### 자동 디자인 시스템
- **🎨 실시간 동기화**: 스토리북 변경사항이 프로덕트에 즉시 반영
- **🚀 자동 스타일링**: 디자인 토큰을 자동으로 적용
- **🌙 테마 지원**: 라이트/다크 모드 자동 전환

### 코드 품질
```bash
# 린팅 실행
npm run lint

# 코드 포맷팅 (if configured)
npm run format
```

## 📊 데이터 플로우

```
스프레드시트 → 과제 로드 → 프롬프트 작성 → LLM 처리 → 평가 → 웹훅 제출
```

1. **입력**: Google Sheets에서 과제 데이터 로드
2. **처리**: 로컬 LLM으로 번역 및 프롬프트 처리
3. **출력**: 웹훅을 통해 R&D 팀에 결과 전송

## 🔐 보안

- 모든 인증 토큰은 암호화되어 로컬에 저장
- API 키는 환경 변수로 관리
- 민감한 데이터는 메모리에만 저장

## 🐛 문제 해결

### 일반적인 문제들

1. **Google 인증 실패**
   - API 키 확인
   - OAuth2 설정 점검
   - 브라우저 쿠키 삭제

2. **스프레드시트 접근 불가**
   - 공유 권한 확인
   - URL 형식 점검
   - API 할당량 확인

3. **LLM API 오류**
   - OpenAI API 키 확인
   - API 크레딧 잔액 확인
   - 네트워크 연결 상태 점검

### 로그 확인
```bash
# 개발자 도구에서 콘솔 확인
# 또는 애플리케이션 로그 폴더 확인
~/AppData/Roaming/webnovel-mt-editor/logs/ (Windows)
~/Library/Application Support/webnovel-mt-editor/logs/ (macOS)
~/.config/webnovel-mt-editor/logs/ (Linux)
```

## 📝 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🤝 기여

프로젝트에 기여를 원한다면:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**기여 시 주의사항**: 모든 UI 컴포넌트는 스토리북에 추가되어야 합니다.

## 📞 지원

문제가 발생하거나 질문이 있으시면:

- 이슈 트래커: [GitHub Issues]
- 이메일: [support email]
- 문서: `/docs` 폴더 참조

---

**Made with ❤️ for better web novel translation**
