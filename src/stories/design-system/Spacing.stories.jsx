import React from 'react'

export default {
  title: 'Design System/Spacing',
  parameters: {
    docs: {
      description: {
        component: '애플리케이션의 간격 시스템입니다.'
      }
    }
  }
}

// 기본 간격 스토리
export const SpacingScale = () => (
  <div style={{ padding: '20px' }}>
    <h2>Spacing Scale</h2>
    <p style={{ color: '#6b7280', marginBottom: '24px' }}>
      모든 간격은 4px의 기본 단위를 기준으로 합니다.
    </p>
    
    <div style={{ display: 'grid', gap: '16px' }}>
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px' }}>4px (--spacing-1)</h3>
        <div style={{ 
          width: 'var(--spacing-1)', 
          height: 'var(--spacing-1)', 
          backgroundColor: '#3b82f6',
          borderRadius: '2px'
        }}></div>
        <code style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', display: 'block' }}>--spacing-1</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px' }}>8px (--spacing-2)</h3>
        <div style={{ 
          width: 'var(--spacing-2)', 
          height: 'var(--spacing-2)', 
          backgroundColor: '#3b82f6',
          borderRadius: '4px'
        }}></div>
        <code style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', display: 'block' }}>--spacing-2</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px' }}>12px (--spacing-3)</h3>
        <div style={{ 
          width: 'var(--spacing-3)', 
          height: 'var(--spacing-3)', 
          backgroundColor: '#3b82f6',
          borderRadius: '6px'
        }}></div>
        <code style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', display: 'block' }}>--spacing-3</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px' }}>16px (--spacing-4)</h3>
        <div style={{ 
          width: 'var(--spacing-4)', 
          height: 'var(--spacing-4)', 
          backgroundColor: '#3b82f6',
          borderRadius: '8px'
        }}></div>
        <code style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', display: 'block' }}>--spacing-4</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px' }}>20px (--spacing-5)</h3>
        <div style={{ 
          width: 'var(--spacing-5)', 
          height: 'var(--spacing-5)', 
          backgroundColor: '#3b82f6',
          borderRadius: '10px'
        }}></div>
        <code style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', display: 'block' }}>--spacing-5</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px' }}>24px (--spacing-6)</h3>
        <div style={{ 
          width: 'var(--spacing-6)', 
          height: 'var(--spacing-6)', 
          backgroundColor: '#3b82f6',
          borderRadius: '12px'
        }}></div>
        <code style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', display: 'block' }}>--spacing-6</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px' }}>32px (--spacing-8)</h3>
        <div style={{ 
          width: 'var(--spacing-8)', 
          height: 'var(--spacing-8)', 
          backgroundColor: '#3b82f6',
          borderRadius: '16px'
        }}></div>
        <code style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', display: 'block' }}>--spacing-8</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px' }}>40px (--spacing-10)</h3>
        <div style={{ 
          width: 'var(--spacing-10)', 
          height: 'var(--spacing-10)', 
          backgroundColor: '#3b82f6',
          borderRadius: '20px'
        }}></div>
        <code style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', display: 'block' }}>--spacing-10</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px' }}>48px (--spacing-12)</h3>
        <div style={{ 
          width: 'var(--spacing-12)', 
          height: 'var(--spacing-12)', 
          backgroundColor: '#3b82f6',
          borderRadius: '24px'
        }}></div>
        <code style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', display: 'block' }}>--spacing-12</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px' }}>64px (--spacing-16)</h3>
        <div style={{ 
          width: 'var(--spacing-16)', 
          height: 'var(--spacing-16)', 
          backgroundColor: '#3b82f6',
          borderRadius: '32px'
        }}></div>
        <code style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', display: 'block' }}>--spacing-16</code>
      </div>
    </div>
  </div>
)

export const SpacingUsage = () => (
  <div style={{ padding: '20px' }}>
    <h2>Spacing Usage Examples</h2>
    
    <div style={{ display: 'grid', gap: '24px', marginTop: '16px' }}>
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px' }}>Padding Examples</h3>
        <div style={{ 
          padding: 'var(--spacing-4)', 
          backgroundColor: '#f3f4f6', 
          border: '1px solid #d1d5db',
          borderRadius: '8px'
        }}>
          <p style={{ margin: '0', color: '#374151' }}>
            This element has padding: var(--spacing-4) (16px)
          </p>
        </div>
        
        <div style={{ 
          padding: 'var(--spacing-6)', 
          backgroundColor: '#e5e7eb', 
          border: '1px solid #9ca3af',
          borderRadius: '8px',
          marginTop: '16px'
        }}>
          <p style={{ margin: '0', color: '#374151' }}>
            This element has padding: var(--spacing-6) (24px)
          </p>
        </div>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px' }}>Margin Examples</h3>
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#f3f4f6', 
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          marginBottom: 'var(--spacing-4)'
        }}>
          <p style={{ margin: '0', color: '#374151' }}>
            This element has margin-bottom: var(--spacing-4) (16px)
          </p>
        </div>
        
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#e5e7eb', 
          border: '1px solid #9ca3af',
          borderRadius: '8px'
        }}>
          <p style={{ margin: '0', color: '#374151' }}>
            This element has no bottom margin
          </p>
        </div>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px' }}>Gap Examples</h3>
        <div style={{ 
          display: 'grid', 
          gap: 'var(--spacing-4)', 
          gridTemplateColumns: 'repeat(3, 1fr)'
        }}>
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#f3f4f6', 
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0', color: '#374151' }}>Item 1</p>
          </div>
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#f3f4f6', 
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0', color: '#374151' }}>Item 2</p>
          </div>
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#f3f4f6', 
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0', color: '#374151' }}>Item 3</p>
          </div>
        </div>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '16px', textAlign: 'center' }}>
          Grid gap: var(--spacing-4) (16px)
        </p>
      </div>
    </div>
  </div>
)

export const ComponentSpacing = () => (
  <div style={{ padding: '20px' }}>
    <h2>Component Spacing Guidelines</h2>
    
    <div style={{ display: 'grid', gap: '24px', marginTop: '16px' }}>
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px' }}>Button Spacing</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button style={{ 
            padding: 'var(--spacing-3) var(--spacing-4)', 
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            Small Button
          </button>
          <button style={{ 
            padding: 'var(--spacing-4) var(--spacing-6)', 
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            Medium Button
          </button>
          <button style={{ 
            padding: 'var(--spacing-5) var(--spacing-8)', 
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '18px',
            cursor: 'pointer'
          }}>
            Large Button
          </button>
        </div>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '16px' }}>
          Buttons use consistent padding: Small (12px/16px), Medium (16px/24px), Large (20px/32px)
        </p>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px' }}>Card Spacing</h3>
        <div style={{ 
          padding: 'var(--spacing-6)', 
          backgroundColor: '#ffffff', 
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          maxWidth: '400px'
        }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#111827' }}>Card Title</h4>
          <p style={{ 
            margin: '0 0 24px 0', 
            color: '#6b7280',
            lineHeight: '1.5'
          }}>
            This card demonstrates proper spacing with padding: var(--spacing-6) (24px) and 
            margin-bottom: var(--spacing-6) (24px) for the title.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ 
              padding: '8px 16px', 
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              Action
            </button>
            <button style={{ 
              padding: '8px 16px', 
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px' }}>Form Spacing</h3>
        <div style={{ maxWidth: '400px' }}>
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-2)', 
              color: '#374151',
              fontWeight: '500'
            }}>
              Email Address
            </label>
            <input 
              type="email" 
              placeholder="Enter your email"
              style={{ 
                width: '100%',
                padding: 'var(--spacing-3)',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-2)', 
              color: '#374151',
              fontWeight: '500'
            }}>
              Password
            </label>
            <input 
              type="password" 
              placeholder="Enter your password"
              style={{ 
                width: '100%',
                padding: 'var(--spacing-3)',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <button style={{ 
            width: '100%',
            padding: 'var(--spacing-4)', 
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            Sign In
          </button>
        </div>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '16px' }}>
          Form elements use consistent spacing: Label margin-bottom: 8px, Input padding: 12px, 
          Group margin-bottom: 16px, Button padding: 16px
        </p>
      </div>
    </div>
  </div>
)

export const ResponsiveSpacing = () => (
  <div style={{ padding: '20px' }}>
    <h2>Responsive Spacing</h2>
    
    <div style={{ display: 'grid', gap: '24px', marginTop: '16px' }}>
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px' }}>Mobile vs Desktop</h3>
        <div style={{ 
          padding: 'var(--spacing-4)', 
          backgroundColor: '#f3f4f6', 
          border: '1px solid #d1d5db',
          borderRadius: '8px'
        }}>
          <p style={{ margin: '0 0 16px 0', color: '#374151' }}>
            <strong>Mobile:</strong> Use smaller spacing (--spacing-2, --spacing-3, --spacing-4)
          </p>
          <p style={{ margin: '0 0 16px 0', color: '#374151' }}>
            <strong>Tablet:</strong> Use medium spacing (--spacing-4, --spacing-5, --spacing-6)
          </p>
          <p style={{ margin: '0', color: '#374151' }}>
            <strong>Desktop:</strong> Use larger spacing (--spacing-6, --spacing-8, --spacing-10)
          </p>
        </div>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '16px' }}>Spacing Scale Reference</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
          gap: '16px',
          fontSize: '12px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '4px', 
              height: '4px', 
              backgroundColor: '#3b82f6',
              margin: '0 auto 8px auto',
              borderRadius: '2px'
            }}></div>
            <strong>4px</strong><br />
            --spacing-1
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: '#3b82f6',
              margin: '0 auto 8px auto',
              borderRadius: '4px'
            }}></div>
            <strong>8px</strong><br />
            --spacing-2
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: '#3b82f6',
              margin: '0 auto 8px auto',
              borderRadius: '6px'
            }}></div>
            <strong>12px</strong><br />
            --spacing-3
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: '#3b82f6',
              margin: '0 auto 8px auto',
              borderRadius: '8px'
            }}></div>
            <strong>16px</strong><br />
            --spacing-4
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: '#3b82f6',
              margin: '0 auto 8px auto',
              borderRadius: '10px'
            }}></div>
            <strong>20px</strong><br />
            --spacing-5
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '24px', 
              height: '24px', 
              backgroundColor: '#3b82f6',
              margin: '0 auto 8px auto',
              borderRadius: '12px'
            }}></div>
            <strong>24px</strong><br />
            --spacing-6
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              backgroundColor: '#3b82f6',
              margin: '0 auto 8px auto',
              borderRadius: '16px'
            }}></div>
            <strong>32px</strong><br />
            --spacing-8
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: '#3b82f6',
              margin: '0 auto 8px auto',
              borderRadius: '20px'
            }}></div>
            <strong>40px</strong><br />
            --spacing-10
          </div>
        </div>
      </div>
    </div>
  </div>
)
