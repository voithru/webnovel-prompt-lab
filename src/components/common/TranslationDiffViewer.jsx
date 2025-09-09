import React, { useMemo } from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { useDesignSystemContext } from './DesignSystemProvider';

const TranslationDiffViewer = ({ 
  baselineTranslation, 
  promptResultTranslation, 
  targetLanguage = 'ko' 
}) => {
  const { designTokens } = useDesignSystemContext();

  // 언어별 폰트 설정
  const getFontFamily = (lang) => {
    const fonts = {
      'ko': 'Noto Sans KR, -apple-system, system-ui, sans-serif',
      'ja': 'Noto Sans JP, -apple-system, system-ui, sans-serif', 
      'zh': 'Noto Sans SC, -apple-system, system-ui, sans-serif',
      'zh-cn': 'Noto Sans SC, -apple-system, system-ui, sans-serif',
      'zh-tw': 'Noto Sans TC, -apple-system, system-ui, sans-serif',
      'en': '-apple-system, system-ui, sans-serif'
    };
    return fonts[lang] || fonts['en'];
  };

  // 커스텀 diff 스타일
  const diffStyles = useMemo(() => ({
    diffContainer: {
      fontFamily: getFontFamily(targetLanguage),
      fontSize: designTokens.typography.fontSize.sm,
      lineHeight: designTokens.typography.lineHeight.normal,
      border: 'none',
      borderRadius: designTokens.borders.radius.md
    },
    diffRemoved: {
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      color: designTokens.colors.text.primary,
      textDecoration: 'line-through',
      padding: '1px 3px',
      borderRadius: '3px',
      border: '1px solid rgba(239, 68, 68, 0.3)'
    },
    diffAdded: {
      backgroundColor: 'rgba(34, 197, 94, 0.15)',
      color: designTokens.colors.text.primary,
      padding: '1px 3px',
      borderRadius: '3px',
      border: '1px solid rgba(34, 197, 94, 0.3)'
    },
    line: {
      padding: '4px 8px',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
      wordBreak: targetLanguage === 'ko' ? 'keep-all' : 
                 (targetLanguage === 'zh' || targetLanguage === 'zh-cn' || targetLanguage === 'zh-tw') ? 'break-all' : 
                 'break-word'
    },
    marker: {
      display: 'none' // 줄 번호 숨김
    },
    content: {
      width: '100%'
    }
  }), [targetLanguage, designTokens]);

  // 빈 값 처리
  const safeBaselineTranslation = baselineTranslation || '기본 번역문이 없습니다.';
  const safePromptResultTranslation = promptResultTranslation || '프롬프트 결과가 없습니다.';

  // 에러 처리를 위한 렌더링
  try {
    return (
      <div style={{
        backgroundColor: 'white',
        border: `1px solid ${designTokens.colors.border.light}`,
        borderRadius: designTokens.borders.radius.md,
        overflow: 'hidden'
      }}>
        <ReactDiffViewer
          oldValue={safeBaselineTranslation}
          newValue={safePromptResultTranslation}
          splitView={false}
          hideLineNumbers={true}
          styles={diffStyles}
        />
        
        {/* diff 범례 */}
        <div style={{
          padding: '8px 16px',
          backgroundColor: designTokens.colors.background.secondary,
          borderTop: `1px solid ${designTokens.colors.border.light}`,
          display: 'flex',
          gap: '16px',
          fontSize: '12px',
          color: designTokens.colors.text.muted
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '2px'
            }}></div>
            <span>삭제된 텍스트</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '2px'
            }}></div>
            <span>추가된 텍스트</span>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ReactDiffViewer 렌더링 에러:', error);
    return (
      <div style={{
        backgroundColor: 'white',
        border: `1px solid ${designTokens.colors.border.light}`,
        borderRadius: designTokens.borders.radius.md,
        padding: '16px'
      }}>
        <div style={{ 
          color: designTokens.colors.text.muted,
          textAlign: 'center',
          padding: '20px'
        }}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
            Diff 비교를 표시할 수 없습니다
          </div>
          <div style={{ fontSize: '14px' }}>
            페이지를 새로고침하거나 다른 브라우저를 사용해보세요.
          </div>
        </div>
      </div>
    );
  }
};

export default TranslationDiffViewer;
