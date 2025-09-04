import React from 'react'

export default {
  title: 'Design System/Border & Shadow',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '웹소설 MT 프롬프트 AI 애플리케이션의 테두리와 그림자 시스템입니다. 라운드 코너, 테두리 굵기, 박스 섀도우를 정의합니다.'
      }
    }
  }
}

// Border specimen component
const BorderSpecimen = ({ name, value, description, example }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: 'var(--spacing-4)',
    marginBottom: 'var(--spacing-4)',
    padding: 'var(--spacing-4)',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--border-radius-md)',
    border: '1px solid var(--border-primary)'
  }}>
    <div>
      <div style={{
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'var(--font-weight-medium)',
        color: 'var(--text-primary)',
        marginBottom: 'var(--spacing-2)'
      }}>
        {name}
      </div>
      <div style={{
        fontSize: 'var(--font-size-xs)',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-secondary)',
        marginBottom: 'var(--spacing-2)'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-tertiary)'
      }}>
        {description}
      </div>
    </div>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80px'
    }}>
      {example}
    </div>
  </div>
)

// Shadow specimen component
const ShadowSpecimen = ({ name, value, description }) => (
  <div style={{
    marginBottom: 'var(--spacing-4)',
    padding: 'var(--spacing-4)',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--border-radius-md)',
    border: '1px solid var(--border-primary)'
  }}>
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: 'var(--spacing-4)',
      alignItems: 'center'
    }}>
      <div>
        <div style={{
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--spacing-2)'
        }}>
          {name}
        </div>
        <div style={{
          fontSize: 'var(--font-size-xs)',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
          marginBottom: 'var(--spacing-2)',
          wordBreak: 'break-all'
        }}>
          {value}
        </div>
        <div style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-tertiary)'
        }}>
          {description}
        </div>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100px',
        padding: 'var(--spacing-6)'
      }}>
        <div style={{
          width: '80px',
          height: '60px',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--border-radius-md)',
          boxShadow: value,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--text-secondary)'
        }}>
          Sample
        </div>
      </div>
    </div>
  </div>
)

// Border radius
export const BorderRadius = {
  render: () => (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <h2 style={{ 
        color: 'var(--text-primary)', 
        marginBottom: 'var(--spacing-6)',
        fontSize: 'var(--font-size-2xl)'
      }}>
        테두리 반지름 (Border Radius)
      </h2>
      
      <p style={{ 
        color: 'var(--text-secondary)', 
        marginBottom: 'var(--spacing-8)',
        fontSize: 'var(--font-size-base)'
      }}>
        일관된 모서리 스타일을 위한 라운드 코너 시스템입니다.
      </p>
      
      <BorderSpecimen 
        name="None"
        value="0px"
        description="직각 모서리, 기하학적 디자인"
        example={
          <div style={{
            width: '60px',
            height: '40px',
            backgroundColor: 'var(--bg-brand-primary)',
            borderRadius: 'var(--border-radius-none)'
          }}></div>
        }
      />
      
      <BorderSpecimen 
        name="Small"
        value="2px"
        description="미세한 라운딩, 세밀한 요소"
        example={
          <div style={{
            width: '60px',
            height: '40px',
            backgroundColor: 'var(--bg-success)',
            borderRadius: 'var(--border-radius-sm)'
          }}></div>
        }
      />
      
      <BorderSpecimen 
        name="Base"
        value="4px"
        description="기본 라운딩, 일반적인 UI 요소"
        example={
          <div style={{
            width: '60px',
            height: '40px',
            backgroundColor: 'var(--bg-warning)',
            borderRadius: 'var(--border-radius-base)'
          }}></div>
        }
      />
      
      <BorderSpecimen 
        name="Medium"
        value="6px"
        description="적당한 라운딩, 버튼과 입력 필드"
        example={
          <div style={{
            width: '60px',
            height: '40px',
            backgroundColor: 'var(--bg-info)',
            borderRadius: 'var(--border-radius-md)'
          }}></div>
        }
      />
      
      <BorderSpecimen 
        name="Large"
        value="8px"
        description="큰 라운딩, 카드와 패널"
        example={
          <div style={{
            width: '60px',
            height: '40px',
            backgroundColor: 'var(--bg-error)',
            borderRadius: 'var(--border-radius-lg)'
          }}></div>
        }
      />
      
      <BorderSpecimen 
        name="Extra Large"
        value="12px"
        description="매우 큰 라운딩, 특별한 컨테이너"
        example={
          <div style={{
            width: '60px',
            height: '40px',
            backgroundColor: 'var(--bg-brand-primary)',
            borderRadius: 'var(--border-radius-xl)'
          }}></div>
        }
      />
      
      <BorderSpecimen 
        name="2X Large"
        value="16px"
        description="거대한 라운딩, 모달과 큰 컴포넌트"
        example={
          <div style={{
            width: '60px',
            height: '40px',
            backgroundColor: 'var(--bg-success)',
            borderRadius: 'var(--border-radius-2xl)'
          }}></div>
        }
      />
      
      <BorderSpecimen 
        name="3X Large"
        value="24px"
        description="극도로 큰 라운딩, 특수 디자인"
        example={
          <div style={{
            width: '60px',
            height: '40px',
            backgroundColor: 'var(--bg-warning)',
            borderRadius: 'var(--border-radius-3xl)'
          }}></div>
        }
      />
      
      <BorderSpecimen 
        name="Full"
        value="9999px"
        description="완전한 원형, 아바타와 뱃지"
        example={
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'var(--bg-info)',
            borderRadius: 'var(--border-radius-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-inverse)',
            fontSize: 'var(--font-size-sm)'
          }}>
            AI
          </div>
        }
      />
    </div>
  )
}

// Border widths
export const BorderWidths = {
  render: () => (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <h2 style={{ 
        color: 'var(--text-primary)', 
        marginBottom: 'var(--spacing-6)',
        fontSize: 'var(--font-size-2xl)'
      }}>
        테두리 굵기 (Border Width)
      </h2>
      
      <p style={{ 
        color: 'var(--text-secondary)', 
        marginBottom: 'var(--spacing-8)',
        fontSize: 'var(--font-size-base)'
      }}>
        다양한 강도의 테두리를 위한 굵기 시스템입니다.
      </p>
      
      <BorderSpecimen 
        name="None"
        value="0px"
        description="테두리 없음"
        example={
          <div style={{
            width: '60px',
            height: '40px',
            backgroundColor: 'var(--bg-secondary)',
            border: 'var(--border-width-0) solid var(--border-primary)',
            borderRadius: 'var(--border-radius-md)'
          }}></div>
        }
      />
      
      <BorderSpecimen 
        name="Thin"
        value="1px"
        description="기본 테두리, 대부분의 UI 요소"
        example={
          <div style={{
            width: '60px',
            height: '40px',
            backgroundColor: 'var(--bg-primary)',
            border: 'var(--border-width-1) solid var(--border-primary)',
            borderRadius: 'var(--border-radius-md)'
          }}></div>
        }
      />
      
      <BorderSpecimen 
        name="Medium"
        value="2px"
        description="강조된 테두리, 포커스 상태"
        example={
          <div style={{
            width: '60px',
            height: '40px',
            backgroundColor: 'var(--bg-primary)',
            border: 'var(--border-width-2) solid var(--border-focus)',
            borderRadius: 'var(--border-radius-md)'
          }}></div>
        }
      />
      
      <BorderSpecimen 
        name="Thick"
        value="4px"
        description="두꺼운 테두리, 특별한 강조"
        example={
          <div style={{
            width: '60px',
            height: '40px',
            backgroundColor: 'var(--bg-primary)',
            border: 'var(--border-width-4) solid var(--border-success)',
            borderRadius: 'var(--border-radius-md)'
          }}></div>
        }
      />
      
      <BorderSpecimen 
        name="Extra Thick"
        value="8px"
        description="매우 두꺼운 테두리, 디자인 요소"
        example={
          <div style={{
            width: '60px',
            height: '40px',
            backgroundColor: 'var(--bg-primary)',
            border: 'var(--border-width-8) solid var(--border-warning)',
            borderRadius: 'var(--border-radius-md)'
          }}></div>
        }
      />
    </div>
  )
}

// Box shadows
export const BoxShadows = {
  render: () => (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <h2 style={{ 
        color: 'var(--text-primary)', 
        marginBottom: 'var(--spacing-6)',
        fontSize: 'var(--font-size-2xl)'
      }}>
        박스 섀도우 (Box Shadow)
      </h2>
      
      <p style={{ 
        color: 'var(--text-secondary)', 
        marginBottom: 'var(--spacing-8)',
        fontSize: 'var(--font-size-base)'
      }}>
        깊이감과 계층 구조를 표현하는 그림자 시스템입니다.
      </p>
      
      <ShadowSpecimen 
        name="Extra Small"
        value="var(--shadow-xs)"
        description="매우 미세한 그림자, 서브틀한 구분"
      />
      
      <ShadowSpecimen 
        name="Small"
        value="var(--shadow-sm)"
        description="작은 그림자, 버튼과 작은 카드"
      />
      
      <ShadowSpecimen 
        name="Base"
        value="var(--shadow-base)"
        description="기본 그림자, 일반적인 카드와 패널"
      />
      
      <ShadowSpecimen 
        name="Medium"
        value="var(--shadow-md)"
        description="중간 그림자, 드롭다운과 팝오버"
      />
      
      <ShadowSpecimen 
        name="Large"
        value="var(--shadow-lg)"
        description="큰 그림자, 모달과 다이얼로그"
      />
      
      <ShadowSpecimen 
        name="Extra Large"
        value="var(--shadow-xl)"
        description="매우 큰 그림자, 최상위 레이어"
      />
      
      <ShadowSpecimen 
        name="2X Large"
        value="var(--shadow-2xl)"
        description="거대한 그림자, 특별한 강조"
      />
      
      <ShadowSpecimen 
        name="Inner"
        value="var(--shadow-inner)"
        description="안쪽 그림자, 눌린 상태 표현"
      />
      
      <ShadowSpecimen 
        name="Outline"
        value="var(--shadow-outline)"
        description="아웃라인 그림자, 포커스 링"
      />
    </div>
  )
}

// Focus shadows
export const FocusShadows = {
  render: () => (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <h2 style={{ 
        color: 'var(--text-primary)', 
        marginBottom: 'var(--spacing-6)',
        fontSize: 'var(--font-size-2xl)'
      }}>
        포커스 섀도우
      </h2>
      
      <p style={{ 
        color: 'var(--text-secondary)', 
        marginBottom: 'var(--spacing-8)',
        fontSize: 'var(--font-size-base)'
      }}>
        키보드 네비게이션과 접근성을 위한 포커스 상태 그림자입니다.
      </p>
      
      <div style={{ display: 'grid', gap: 'var(--spacing-6)' }}>
        {[
          { name: 'Primary Focus', value: 'var(--shadow-focus-primary)', color: 'var(--bg-brand-primary)' },
          { name: 'Success Focus', value: 'var(--shadow-focus-success)', color: 'var(--bg-success)' },
          { name: 'Warning Focus', value: 'var(--shadow-focus-warning)', color: 'var(--bg-warning)' },
          { name: 'Error Focus', value: 'var(--shadow-focus-error)', color: 'var(--bg-error)' }
        ].map((shadow, index) => (
          <div key={index} style={{
            padding: 'var(--spacing-6)',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--border-radius-lg)',
            border: '1px solid var(--border-primary)'
          }}>
            <h4 style={{
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-4)',
              fontSize: 'var(--font-size-lg)'
            }}>
              {shadow.name}
            </h4>
            
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
              <button style={{
                padding: 'var(--spacing-3) var(--spacing-4)',
                backgroundColor: shadow.color,
                color: 'var(--text-inverse)',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                fontSize: 'var(--font-size-sm)',
                cursor: 'pointer',
                boxShadow: shadow.value
              }}>
                포커스 버튼
              </button>
              
              <input style={{
                padding: 'var(--spacing-3)',
                border: '1px solid var(--border-secondary)',
                borderRadius: 'var(--border-radius-md)',
                fontSize: 'var(--font-size-sm)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                boxShadow: shadow.value,
                width: '200px'
              }} placeholder="포커스 입력 필드" />
            </div>
            
            <div style={{
              marginTop: 'var(--spacing-3)',
              fontSize: 'var(--font-size-xs)',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)'
            }}>
              {shadow.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Practical examples
export const PracticalExamples = {
  render: () => (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <h2 style={{ 
        color: 'var(--text-primary)', 
        marginBottom: 'var(--spacing-6)',
        fontSize: 'var(--font-size-2xl)'
      }}>
        실제 사용 예시
      </h2>
      
      <div style={{ display: 'grid', gap: 'var(--spacing-8)' }}>
        {/* Card with shadow */}
        <div>
          <h3 style={{ 
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-4)',
            fontSize: 'var(--font-size-lg)'
          }}>
            카드 컴포넌트
          </h3>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap' }}>
            {/* Basic card */}
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              padding: 'var(--spacing-6)',
              borderRadius: 'var(--border-radius-lg)',
              border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-sm)',
              maxWidth: '250px'
            }}>
              <h4 style={{ 
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-3)',
                fontSize: 'var(--font-size-lg)'
              }}>
                기본 카드
              </h4>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: 'var(--font-size-sm)',
                lineHeight: 'var(--line-height-normal)'
              }}>
                작은 그림자와 라운드 코너를 사용한 기본적인 카드 스타일입니다.
              </p>
              <div style={{
                marginTop: 'var(--spacing-4)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-mono)'
              }}>
                shadow-sm + border-radius-lg
              </div>
            </div>
            
            {/* Elevated card */}
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              padding: 'var(--spacing-6)',
              borderRadius: 'var(--border-radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              maxWidth: '250px'
            }}>
              <h4 style={{ 
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-3)',
                fontSize: 'var(--font-size-lg)'
              }}>
                부각된 카드
              </h4>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: 'var(--font-size-sm)',
                lineHeight: 'var(--line-height-normal)'
              }}>
                큰 그림자와 더 둥근 코너로 강조된 카드 스타일입니다.
              </p>
              <div style={{
                marginTop: 'var(--spacing-4)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-mono)'
              }}>
                shadow-lg + border-radius-xl
              </div>
            </div>
          </div>
        </div>
        
        {/* Button states */}
        <div>
          <h3 style={{ 
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-4)',
            fontSize: 'var(--font-size-lg)'
          }}>
            버튼 상태
          </h3>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
            <button style={{
              padding: 'var(--spacing-3) var(--spacing-5)',
              backgroundColor: 'var(--bg-brand-primary)',
              color: 'var(--text-inverse)',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              fontSize: 'var(--font-size-sm)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}>
              일반 버튼
            </button>
            
            <button style={{
              padding: 'var(--spacing-3) var(--spacing-5)',
              backgroundColor: 'var(--bg-brand-primary)',
              color: 'var(--text-inverse)',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              fontSize: 'var(--font-size-sm)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-focus-primary)',
              transform: 'translateY(-1px)'
            }}>
              포커스 버튼
            </button>
            
            <button style={{
              padding: 'var(--spacing-3) var(--spacing-5)',
              backgroundColor: 'var(--bg-brand-primary)',
              color: 'var(--text-inverse)',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              fontSize: 'var(--font-size-sm)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-inner)',
              transform: 'translateY(1px)'
            }}>
              눌린 버튼
            </button>
          </div>
        </div>
        
        {/* Modal example */}
        <div>
          <h3 style={{ 
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-4)',
            fontSize: 'var(--font-size-lg)'
          }}>
            모달 컴포넌트
          </h3>
          
          <div style={{
            position: 'relative',
            height: '300px',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--border-radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {/* Mock modal */}
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              padding: 'var(--spacing-8)',
              borderRadius: 'var(--border-radius-2xl)',
              boxShadow: 'var(--shadow-2xl)',
              maxWidth: '400px',
              width: '90%'
            }}>
              <h4 style={{ 
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-4)',
                fontSize: 'var(--font-size-xl)'
              }}>
                프롬프트 삭제 확인
              </h4>
              <p style={{
                color: 'var(--text-secondary)',
                marginBottom: 'var(--spacing-6)',
                fontSize: 'var(--font-size-base)',
                lineHeight: 'var(--line-height-normal)'
              }}>
                선택한 프롬프트를 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
              <div style={{
                display: 'flex',
                gap: 'var(--spacing-3)',
                justifyContent: 'flex-end'
              }}>
                <button style={{
                  padding: 'var(--spacing-3) var(--spacing-4)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  cursor: 'pointer'
                }}>
                  취소
                </button>
                <button style={{
                  padding: 'var(--spacing-3) var(--spacing-4)',
                  backgroundColor: 'var(--bg-error)',
                  color: 'var(--text-inverse)',
                  border: 'none',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  cursor: 'pointer'
                }}>
                  삭제
                </button>
              </div>
              <div style={{
                marginTop: 'var(--spacing-6)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-mono)',
                textAlign: 'center'
              }}>
                shadow-2xl + border-radius-2xl
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Design guidelines
export const DesignGuidelines = {
  render: () => (
    <div style={{ padding: 'var(--spacing-6)', maxWidth: '800px' }}>
      <h2 style={{ 
        color: 'var(--text-primary)', 
        marginBottom: 'var(--spacing-6)',
        fontSize: 'var(--font-size-2xl)'
      }}>
        디자인 가이드라인
      </h2>
      
      <div style={{ display: 'grid', gap: 'var(--spacing-8)' }}>
        <div style={{
          backgroundColor: 'var(--bg-info)',
          padding: 'var(--spacing-6)',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid var(--border-info)'
        }}>
          <h3 style={{ 
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-4)',
            fontSize: 'var(--font-size-lg)'
          }}>
            테두리 반지름 사용법
          </h3>
          <ul style={{ 
            color: 'var(--text-primary)',
            paddingLeft: 'var(--spacing-5)',
            margin: 0
          }}>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              <strong>sm (2px):</strong> 작은 태그, 뱃지, 인디케이터
            </li>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              <strong>base (4px):</strong> 기본 UI 요소, 작은 버튼
            </li>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              <strong>md (6px):</strong> 버튼, 입력 필드, 일반적인 컴포넌트
            </li>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              <strong>lg (8px):</strong> 카드, 패널, 컨테이너
            </li>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              <strong>xl+ (12px+):</strong> 모달, 큰 컨테이너, 특별한 강조
            </li>
            <li>
              <strong>full (9999px):</strong> 아바타, 원형 버튼, 완전한 원
            </li>
          </ul>
        </div>
        
        <div style={{
          backgroundColor: 'var(--bg-success)',
          padding: 'var(--spacing-6)',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid var(--border-success)'
        }}>
          <h3 style={{ 
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-4)',
            fontSize: 'var(--font-size-lg)'
          }}>
            그림자 사용법
          </h3>
          <ul style={{ 
            color: 'var(--text-primary)',
            paddingLeft: 'var(--spacing-5)',
            margin: 0
          }}>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              <strong>xs, sm:</strong> 버튼, 작은 카드, 미묘한 구분
            </li>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              <strong>base, md:</strong> 일반적인 카드, 패널, 드롭다운
            </li>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              <strong>lg, xl:</strong> 모달, 팝오버, 최상위 요소
            </li>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              <strong>inner:</strong> 버튼 클릭, 입력 필드 포커스
            </li>
            <li>
              <strong>focus:</strong> 키보드 접근성, 포커스 상태 표시
            </li>
          </ul>
        </div>
        
        <div style={{
          backgroundColor: 'var(--bg-warning)',
          padding: 'var(--spacing-6)',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid var(--border-warning)'
        }}>
          <h3 style={{ 
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-4)',
            fontSize: 'var(--font-size-lg)'
          }}>
            접근성 고려사항
          </h3>
          <ul style={{ 
            color: 'var(--text-primary)',
            paddingLeft: 'var(--spacing-5)',
            margin: 0
          }}>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              포커스 상태는 항상 명확하게 표시 (그림자 또는 아웃라인)
            </li>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              고대비 모드에서도 충분한 대비율 유지
            </li>
            <li style={{ marginBottom: 'var(--spacing-2)' }}>
              애니메이션 감소 설정 시 그림자 전환 효과 제거
            </li>
            <li>
              터치 디바이스에서 충분한 터치 영역 확보 (최소 44px)
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
