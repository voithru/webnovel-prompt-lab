import React from 'react'
import TestButton from '../../components/common/TestButton'

export default {
  title: 'Components/Common/TestButton',
  component: TestButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'CSS 모듈이 제대로 작동하는지 테스트하기 위한 컴포넌트입니다.'
      }
    }
  }
}

export const Default = {
  render: () => <TestButton />
}
