import React, { useMemo } from 'react';
import { useDesignSystemContext } from './DesignSystemProvider';
import { diffLines, diffWords, diffChars } from 'diff';

const TranslationDiffViewer = ({ 
  baselineTranslation, 
  promptResultTranslation, 
  targetLanguage = 'ko' 
}) => {
  const { designTokens } = useDesignSystemContext();
  const [viewMode, setViewMode] = React.useState('words');
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isSyncEnabled, setIsSyncEnabled] = React.useState(true); // 스크롤 동기화 토글
  
  // 동기화 스크롤을 위한 ref
  const leftPanelRef = React.useRef(null);
  const rightPanelRef = React.useRef(null);
  const leftFullscreenRef = React.useRef(null);
  const rightFullscreenRef = React.useRef(null);
  
  // 스크롤 동기화 제어를 위한 ref
  const isScrolling = React.useRef(false);

  // ESC 키로 전체화면 닫기
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  // 동기화 토글이 켜질 때 왼쪽 기준으로 오른쪽 조정
  React.useEffect(() => {
    if (isSyncEnabled && leftPanelRef.current && rightPanelRef.current) {
      syncScroll(leftPanelRef.current, rightPanelRef.current);
    }
    if (isSyncEnabled && leftFullscreenRef.current && rightFullscreenRef.current) {
      syncScroll(leftFullscreenRef.current, rightFullscreenRef.current);
    }
  }, [isSyncEnabled]);


  // 간단한 양방향 동기화 함수
  const syncScroll = (sourceElement, targetElement) => {
    if (!sourceElement || !targetElement || isScrolling.current) return;
    
    const sourceMaxScroll = sourceElement.scrollHeight - sourceElement.clientHeight;
    const targetMaxScroll = targetElement.scrollHeight - targetElement.clientHeight;
    
    if (sourceMaxScroll <= 0 || targetMaxScroll <= 0) return;
    
    const scrollRatio = sourceElement.scrollTop / sourceMaxScroll;
    const targetScrollTop = scrollRatio * targetMaxScroll;
    
    isScrolling.current = true;
    targetElement.scrollTop = targetScrollTop;
    
    // 아주 짧은 시간 후 잠금 해제
    setTimeout(() => {
      isScrolling.current = false;
    }, 10);
  };

  // 양방향 스크롤 핸들러들
  const handleLeftScroll = () => {
    if (!isSyncEnabled) return;
    syncScroll(leftPanelRef.current, rightPanelRef.current);
  };

  const handleRightScroll = () => {
    if (!isSyncEnabled) return;
    syncScroll(rightPanelRef.current, leftPanelRef.current);
  };

  const handleLeftFullscreenScroll = () => {
    if (!isSyncEnabled) return;
    syncScroll(leftFullscreenRef.current, rightFullscreenRef.current);
  };

  const handleRightFullscreenScroll = () => {
    if (!isSyncEnabled) return;
    syncScroll(rightFullscreenRef.current, leftFullscreenRef.current);
  };

  // 언어별 폰트 설정
  const getFontFamily = (lang) => {
    const fonts = {
      'ko': 'Noto Sans KR, -apple-system, system-ui, sans-serif',
      'ja': 'Noto Sans JP, -apple-system, system-ui, sans-serif', 
      'zh': 'Noto Sans SC, -apple-system, system-ui, sans-serif',
      'en': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    };
    return fonts[lang] || fonts['en'];
  };

  // 텍스트 전처리
  const safeBaselineTranslation = baselineTranslation || '';
  const safePromptResultTranslation = promptResultTranslation || '';

  // HTML 이스케이프 함수
  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // 차이점 분석 함수
  const analyzeDifferences = (oldText, newText, mode) => {
    if (!oldText || !newText) return { oldHighlighted: oldText, newHighlighted: newText };
    
    let diffResult;
    switch (mode) {
      case 'lines':
        diffResult = diffLines(oldText, newText);
        break;
      case 'words':
        diffResult = diffWords(oldText, newText);
        break;
      case 'chars':
        diffResult = diffChars(oldText, newText);
        break;
      default:
        diffResult = diffWords(oldText, newText);
    }

    let oldHighlighted = '';
    let newHighlighted = '';

    diffResult.forEach((part) => {
      const value = part.value;
      if (part.removed) {
        oldHighlighted += `<span style="background-color: rgba(239, 68, 68, 0.2); text-decoration: line-through; padding: 2px 4px; border-radius: 3px;">${escapeHtml(value)}</span>`;
      } else if (part.added) {
        newHighlighted += `<span style="background-color: rgba(34, 197, 94, 0.2); padding: 2px 4px; border-radius: 3px;">${escapeHtml(value)}</span>`;
      } else {
        oldHighlighted += escapeHtml(value);
        newHighlighted += escapeHtml(value);
      }
    });

    return { oldHighlighted, newHighlighted };
  };

  // 차이점 분석 결과
  const diffAnalysis = useMemo(() => {
    return analyzeDifferences(safeBaselineTranslation, safePromptResultTranslation, viewMode);
  }, [safeBaselineTranslation, safePromptResultTranslation, viewMode]);

  // 텍스트가 동일한지 확인
  const isIdentical = safeBaselineTranslation === safePromptResultTranslation;

  // 커스텀 Split View 컴포넌트
  const renderCustomSplitView = () => {
    // 동일한 텍스트일 때 특별한 안내 표시
    if (isIdentical && safeBaselineTranslation && safePromptResultTranslation) {
      return (
        <div style={{
          backgroundColor: 'white',
          border: `1px solid ${designTokens.colors.border.light}`,
          borderRadius: designTokens.borders.radius.md,
          overflow: 'hidden'
        }}>
          {/* 헤더 */}
          <div style={{
            display: 'flex',
            backgroundColor: designTokens.colors.background.secondary,
            borderBottom: `1px solid ${designTokens.colors.border.light}`
          }}>
            <div style={{
              width: '100%',
              padding: '12px 16px',
              textAlign: 'center',
              fontWeight: '600',
              color: designTokens.colors.text.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span style={{ 
                fontSize: '16px',
                color: '#10b981'
              }}>✓</span>
              번역문이 동일합니다
            </div>
          </div>
          
          {/* 동일 텍스트 안내 */}
          <div style={{
            padding: '20px',
            backgroundColor: '#f0fdf4',
            textAlign: 'center',
            borderBottom: `1px solid ${designTokens.colors.border.light}`
          }}>
            <div style={{ 
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: designTokens.colors.text.primary
            }}>
              기본 번역문과 프롬프트 결과가 완전히 일치합니다.
            </div>
            <div style={{ 
              fontSize: '12px',
              color: designTokens.colors.text.muted 
            }}>
              프롬프트가 기존 번역과 동일한 결과를 생성했거나, 이미 최적화된 번역일 수 있습니다.
            </div>
          </div>
          
          {/* 실제 텍스트 */}
          <div style={{
            padding: '16px',
            fontFamily: getFontFamily(targetLanguage),
            fontSize: '14px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            wordBreak: 'keep-all',
            backgroundColor: 'white',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {safeBaselineTranslation}
          </div>
        </div>
      );
    }

    return (
      <div style={{
        backgroundColor: 'white',
        border: `1px solid ${designTokens.colors.border.light}`,
        borderRadius: designTokens.borders.radius.md,
        overflow: 'hidden'
      }}>
        {/* 1줄: 데이터 헤더 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 16px',
          backgroundColor: designTokens.colors.background.secondary,
          borderBottom: `1px solid ${designTokens.colors.border.light}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '600px'
          }}>
            <span style={{
              fontWeight: '600',
              color: designTokens.colors.text.primary,
              textAlign: 'center',
              flex: 1
            }}>
              기본 번역문
            </span>
            <span style={{
              fontWeight: '600',
              color: designTokens.colors.text.primary,
              textAlign: 'center',
              flex: 1
            }}>
              프롬프트 결과
            </span>
          </div>
        </div>

        {/* 2줄: 비교 모드 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '8px 16px',
          backgroundColor: designTokens.colors.background.secondary,
          borderBottom: `1px solid ${designTokens.colors.border.light}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              fontSize: '12px', 
              color: designTokens.colors.text.muted,
              fontWeight: designTokens.typography.fontWeight.medium 
            }}>
              비교 모드:
            </span>
            <button
              onClick={() => setViewMode('words')}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: viewMode === 'words' ? designTokens.colors.primary : 'transparent',
                color: viewMode === 'words' ? 'white' : designTokens.colors.text.muted,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              단어별
            </button>
            <button
              onClick={() => setViewMode('lines')}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: viewMode === 'lines' ? designTokens.colors.primary : 'transparent',
                color: viewMode === 'lines' ? 'white' : designTokens.colors.text.muted,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              줄별
            </button>
            <button
              onClick={() => setViewMode('chars')}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: viewMode === 'chars' ? designTokens.colors.primary : 'transparent',
                color: viewMode === 'chars' ? 'white' : designTokens.colors.text.muted,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              글자별
            </button>
          </div>
        </div>

        {/* 3줄: 추가/삭제 범례 및 스크롤 동기화 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          backgroundColor: designTokens.colors.background.secondary,
          borderBottom: `1px solid ${designTokens.colors.border.light}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              textDecoration: 'line-through',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '11px'
            }}>
              삭제됨
            </span>
            <span style={{ 
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '11px'
            }}>
              추가됨
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* 스크롤 동기화 토글 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                fontSize: '12px',
                color: designTokens.colors.text.muted
              }}>
                스크롤 동기화
              </span>
              <button
                onClick={() => setIsSyncEnabled(!isSyncEnabled)}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: isSyncEnabled ? designTokens.colors.primary : '#e5e7eb',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  position: 'absolute',
                  top: '3px',
                  left: isSyncEnabled ? '23px' : '3px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }} />
              </button>
            </div>
            
            <button
              onClick={() => setIsFullscreen(true)}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                border: `1px solid ${designTokens.colors.border.light}`,
                borderRadius: '4px',
                backgroundColor: 'white',
                color: designTokens.colors.text.muted,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              전체화면
            </button>
          </div>
        </div>

        {/* 내용 */}
        <div style={{
          display: 'flex',
          minHeight: '200px'
        }}>
          <div 
            ref={leftPanelRef}
            style={{
              width: '50%',
              padding: '16px',
              borderRight: `1px solid ${designTokens.colors.border.light}`,
              fontFamily: getFontFamily(targetLanguage),
              fontSize: '14px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordBreak: 'keep-all',
              backgroundColor: '#fafbfc',
              overflow: 'auto',
              maxHeight: '600px'
            }}
            onScroll={handleLeftScroll}
            title="양방향 동기화 - 여기서 스크롤해도 오른쪽이 따라움"
            dangerouslySetInnerHTML={{
              __html: diffAnalysis.oldHighlighted || '기본 번역문이 없습니다.'
            }}
          />
          <div 
            ref={rightPanelRef}
            style={{
              width: '50%',
              padding: '16px',
              fontFamily: getFontFamily(targetLanguage),
              fontSize: '14px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordBreak: 'keep-all',
              backgroundColor: '#f8fff9',
              overflow: 'auto',
              maxHeight: '600px'
            }}
            onScroll={handleRightScroll}
            title="양방향 동기화 - 여기서 스크롤해도 왼쪽이 따라움"
            dangerouslySetInnerHTML={{
              __html: diffAnalysis.newHighlighted || '프롬프트 결과가 없습니다.'
            }}
          />
        </div>

      </div>
    );
  };

  return (
    <div>
      {renderCustomSplitView()}

      {/* 전체화면 모달 */}
      {isFullscreen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: designTokens.borders.radius.lg,
            width: '95%',
            height: '90%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* 전체화면 헤더 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              backgroundColor: designTokens.colors.background.secondary,
              borderBottom: `1px solid ${designTokens.colors.border.light}`
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>번역문 비교 - 전체화면</h3>
              <button
                onClick={() => setIsFullscreen(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: designTokens.colors.text.muted,
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                title="전체화면 닫기"
              >
                ×
              </button>
            </div>

            {/* 전체화면 보기 모드 선택 */}
            <div style={{
              padding: '12px 24px',
              backgroundColor: designTokens.colors.background.secondary,
              borderBottom: `1px solid ${designTokens.colors.border.light}`,
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  fontSize: '14px', 
                  color: designTokens.colors.text.muted,
                  fontWeight: designTokens.typography.fontWeight.medium 
                }}>
                  비교 모드:
                </span>
                <button
                  onClick={() => setViewMode('words')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '13px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: viewMode === 'words' ? designTokens.colors.primary : 'transparent',
                    color: viewMode === 'words' ? 'white' : designTokens.colors.text.muted,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  단어별
                </button>
                <button
                  onClick={() => setViewMode('lines')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '13px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: viewMode === 'lines' ? designTokens.colors.primary : 'transparent',
                    color: viewMode === 'lines' ? 'white' : designTokens.colors.text.muted,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  줄별
                </button>
                <button
                  onClick={() => setViewMode('chars')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '13px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: viewMode === 'chars' ? designTokens.colors.primary : 'transparent',
                    color: viewMode === 'chars' ? 'white' : designTokens.colors.text.muted,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  글자별
                </button>
              </div>
              
              {/* 스크롤 동기화 토글 (전체화면) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  fontSize: '12px',
                  color: designTokens.colors.text.muted
                }}>
                  스크롤 동기화
                </span>
                <button
                  onClick={() => setIsSyncEnabled(!isSyncEnabled)}
                  style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: isSyncEnabled ? designTokens.colors.primary : '#e5e7eb',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: '3px',
                    left: isSyncEnabled ? '23px' : '3px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }} />
                </button>
                
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    textDecoration: 'line-through',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontSize: '12px'
                  }}>
                    삭제됨
                  </span>
                  <span style={{ 
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontSize: '12px'
                  }}>
                    추가됨
                  </span>
                </div>
              </div>
            </div>

            {/* 전체화면 내용 */}
            <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
              {isIdentical ? (
                <div style={{
                  backgroundColor: 'white',
                  border: `1px solid ${designTokens.colors.border.light}`,
                  borderRadius: designTokens.borders.radius.md,
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* 동일 텍스트 헤더 */}
                  <div style={{
                    display: 'flex',
                    backgroundColor: designTokens.colors.background.secondary,
                    borderBottom: `1px solid ${designTokens.colors.border.light}`
                  }}>
                    <div style={{
                      width: '100%',
                      padding: '16px 20px',
                      textAlign: 'center',
                      fontWeight: '600',
                      fontSize: '18px',
                      color: designTokens.colors.text.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}>
                      <span style={{ 
                        fontSize: '20px',
                        color: '#10b981'
                      }}>✓</span>
                      번역문이 동일합니다
                    </div>
                  </div>
                  
                  {/* 동일 텍스트 안내 */}
                  <div style={{
                    padding: '32px',
                    backgroundColor: '#f0fdf4',
                    textAlign: 'center',
                    borderBottom: `1px solid ${designTokens.colors.border.light}`
                  }}>
                    <div style={{ 
                      marginBottom: '12px',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: designTokens.colors.text.primary
                    }}>
                      기본 번역문과 프롬프트 결과가 완전히 일치합니다.
                    </div>
                    <div style={{ 
                      fontSize: '16px',
                      color: designTokens.colors.text.muted 
                    }}>
                      프롬프트가 기존 번역과 동일한 결과를 생성했거나, 이미 최적화된 번역일 수 있습니다.
                    </div>
                  </div>
                  
                  {/* 실제 텍스트 (전체화면) */}
                  <div style={{
                    flex: 1,
                    padding: '24px',
                    fontFamily: getFontFamily(targetLanguage),
                    fontSize: '16px',
                    lineHeight: '1.8',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'keep-all',
                    backgroundColor: 'white',
                    overflow: 'auto'
                  }}>
                    {safeBaselineTranslation}
                  </div>
                </div>
              ) : (
                <div style={{
                  backgroundColor: 'white',
                  border: `1px solid ${designTokens.colors.border.light}`,
                  borderRadius: designTokens.borders.radius.md,
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* 전체화면 헤더 */}
                  <div style={{
                    display: 'flex',
                    backgroundColor: designTokens.colors.background.secondary,
                    borderBottom: `1px solid ${designTokens.colors.border.light}`
                  }}>
                    <div style={{
                      width: '50%',
                      padding: '16px 20px',
                      textAlign: 'center',
                      fontWeight: '600',
                      fontSize: '16px',
                      borderRight: `1px solid ${designTokens.colors.border.light}`,
                      color: designTokens.colors.text.primary
                    }}>
                      기본 번역문
                    </div>
                    <div style={{
                      width: '50%',
                      padding: '16px 20px',
                      textAlign: 'center',
                      fontWeight: '600',
                      fontSize: '16px',
                      color: designTokens.colors.text.primary
                    }}>
                      프롬프트 결과
                    </div>
                  </div>

                  {/* 전체화면 내용 */}
                  <div style={{
                    display: 'flex',
                    flex: 1,
                    overflow: 'auto'
                  }}>
                    <div 
                      ref={leftFullscreenRef}
                      style={{
                        width: '50%',
                        padding: '20px',
                        borderRight: `1px solid ${designTokens.colors.border.light}`,
                        fontFamily: getFontFamily(targetLanguage),
                        fontSize: '16px',
                        lineHeight: '1.8',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'keep-all',
                        backgroundColor: '#fafbfc',
                        overflow: 'auto'
                      }}
                      onScroll={handleLeftFullscreenScroll}
                      title="양방향 동기화 - 여기서 스크롤해도 오른쪽이 따라움"
                      dangerouslySetInnerHTML={{
                        __html: diffAnalysis.oldHighlighted || '기본 번역문이 없습니다.'
                      }}
                    />
                    <div 
                      ref={rightFullscreenRef}
                      style={{
                        width: '50%',
                        padding: '20px',
                        fontFamily: getFontFamily(targetLanguage),
                        fontSize: '16px',
                        lineHeight: '1.8',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'keep-all',
                        backgroundColor: '#f8fff9',
                        overflow: 'auto'
                      }}
                      onScroll={handleRightFullscreenScroll}
                      title="양방향 동기화 - 여기서 스크롤해도 왼쪽이 따라움"
                      dangerouslySetInnerHTML={{
                        __html: diffAnalysis.newHighlighted || '프롬프트 결과가 없습니다.'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslationDiffViewer;