import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { DesignSystemProvider } from '../../components/common/DesignSystemProvider'
import TranslationEditorPage from '../../pages/TranslationEditorPage'

export default {
  title: 'Pages/Translation Editor',
  component: TranslationEditorPage,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <DesignSystemProvider>
          <Story />
        </DesignSystemProvider>
      </BrowserRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
번역 에디터 페이지입니다. 이 페이지는 다음과 같은 기능을 제공합니다:

## 주요 기능
- 📝 **원문과 번역문 비교**: 토글 버튼으로 원문과 기본 번역문을 전환하여 볼 수 있습니다
- ✍️ **프롬프트 입력**: 번역 개선을 위한 프롬프트를 입력할 수 있습니다
- 🎯 **과제 정보 표시**: 선택한 과제의 상세 정보를 확인할 수 있습니다
- 💾 **작업 저장**: 임시 저장 및 최종 제출 기능을 제공합니다

## 레이아웃
- **왼쪽**: 사이드 메뉴 (네비게이션)
- **중앙**: 원문/번역문 토글 및 텍스트 영역
- **오른쪽**: 프롬프트 입력 영역
- **하단**: 액션 버튼들 (나가기, 임시 저장, 제출)

## 사용법
1. 나의 과제 페이지에서 원하는 과제 행을 클릭합니다
2. 번역 에디터 페이지로 이동합니다
3. 원문과 번역문을 비교하여 프롬프트를 작성합니다
4. 작업을 저장하거나 제출합니다
        `
      }
    }
  }
}

// 기본 스토리
export const Default = {
  args: {}
}

// 과제 정보가 있는 상태
export const WithTaskData = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '과제 정보가 전달된 상태의 번역 에디터 페이지입니다.'
      }
    }
  }
}

// 다크 모드
export const DarkMode = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '다크 모드에서의 번역 에디터 페이지입니다.'
      }
    }
  }
}

// 반응형 레이아웃
export const ResponsiveLayout = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '다양한 화면 크기에서의 반응형 레이아웃을 보여줍니다.'
      }
    }
  }
}
