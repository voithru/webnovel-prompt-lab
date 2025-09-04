# 🎯 컴포넌트 사용 규칙

## ⚠️ 핵심 원칙
**모든 화면을 구성하는 컴포넌트들은 반드시 스토리북에 있는 컴포넌트를 사용해야 합니다.**

## 🚫 금지 사항
- 하드코딩된 HTML 요소 (`<button>`, `<input>` 등)
- 인라인 스타일로 만든 UI 컴포넌트
- 스토리북에 없는 커스텀 컴포넌트

## ✅ 올바른 사용법
```jsx
// ✅ 스토리북 컴포넌트 사용
import Button from '../components/common/Button'
import Input from '../components/common/Input'

const MyPage = () => (
  <div>
    <Input placeholder="검색어를 입력하세요" />
    <Button variant="solid" style="primary">검색</Button>
  </div>
)
```

## 🔍 컴포넌트 확인 방법
1. `npm run storybook` 실행
2. 왼쪽 사이드바에서 원하는 컴포넌트 찾기
3. Props와 사용법 확인

## 📚 사용 가능한 컴포넌트
- **Button**, **Input**, **TextArea**, **Table**
- **Alert**, **FileUpload**, **Sidebar**
- **Colors**, **Typography**, **Spacing**, **Icons**

## 📖 자세한 가이드라인
[`docs/COMPONENT_USAGE_GUIDELINES.md`](docs/COMPONENT_USAGE_GUIDELINES.md) 참조

---

**이 규칙을 지키지 않으면 PR이 거부될 수 있습니다.**
