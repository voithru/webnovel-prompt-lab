import React from 'react'

export default {
  title: 'Design System/Typography',
  parameters: {
    docs: {
      description: {
        component: '애플리케이션의 타이포그래피 시스템입니다.'
      }
    }
  }
}

// 기본 타이포그래피 스토리
export const FontFamily = () => (
  <div style={{ padding: '20px' }}>
    <h2>Font Family</h2>
    <div style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ fontFamily: 'var(--font-sans)', marginBottom: '8px' }}>Inter (Sans-serif)</h3>
        <p style={{ fontFamily: 'var(--font-sans)', margin: '0', color: '#6b7280' }}>
          The quick brown fox jumps over the lazy dog
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--font-sans</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>JetBrains Mono (Monospace)</h3>
        <p style={{ fontFamily: 'var(--font-mono)', margin: '0', color: '#6b7280' }}>
          The quick brown fox jumps over the lazy dog
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--font-mono</code>
      </div>
    </div>
  </div>
)

export const FontSizes = () => (
  <div style={{ padding: '20px' }}>
    <h2>Font Sizes</h2>
    <div style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h1 style={{ fontSize: 'var(--text-4xl)', margin: '0 0 8px 0', fontWeight: 'var(--font-bold)' }}>
          Heading 1 (4xl)
        </h1>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--text-4xl (36px)</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h2 style={{ fontSize: 'var(--text-3xl)', margin: '0 0 8px 0', fontWeight: 'var(--font-semibold)' }}>
          Heading 2 (3xl)
        </h2>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--text-3xl (30px)</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ fontSize: 'var(--text-2xl)', margin: '0 0 8px 0', fontWeight: 'var(--font-semibold)' }}>
          Heading 3 (2xl)
        </h3>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--text-2xl (24px)</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h4 style={{ fontSize: 'var(--text-xl)', margin: '0 0 8px 0', fontWeight: 'var(--font-semibold)' }}>
          Heading 4 (xl)
        </h4>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--text-xl (20px)</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h5 style={{ fontSize: 'var(--text-lg)', margin: '0 0 8px 0', fontWeight: 'var(--font-semibold)' }}>
          Heading 5 (lg)
        </h5>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--text-lg (18px)</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <p style={{ fontSize: 'var(--text-base)', margin: '0 0 8px 0' }}>
          Body text (base)
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--text-base (16px)</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <p style={{ fontSize: 'var(--text-sm)', margin: '0 0 8px 0' }}>
          Small text (sm)
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--text-sm (14px)</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <p style={{ fontSize: 'var(--text-xs)', margin: '0 0 8px 0' }}>
          Extra small text (xs)
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--text-xs (12px)</code>
      </div>
    </div>
  </div>
)

export const FontWeights = () => (
  <div style={{ padding: '20px' }}>
    <h2>Font Weights</h2>
    <div style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-thin)', margin: '0 0 8px 0' }}>
          Thin (100)
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--font-thin</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-light)', margin: '0 0 8px 0' }}>
          Light (300)
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--font-light</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-normal)', margin: '0 0 8px 0' }}>
          Normal (400)
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--font-normal</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-medium)', margin: '0 0 8px 0' }}>
          Medium (500)
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--font-medium</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', margin: '0 0 8px 0' }}>
          Semibold (600)
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--font-semibold</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', margin: '0 0 8px 0' }}>
          Bold (700)
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--font-bold</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-extrabold)', margin: '0 0 8px 0' }}>
          Extrabold (800)
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--font-extrabold</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-black)', margin: '0 0 8px 0' }}>
          Black (900)
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--font-black</code>
      </div>
    </div>
  </div>
)

export const LineHeights = () => (
  <div style={{ padding: '20px' }}>
    <h2>Line Heights</h2>
    <div style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <p style={{ 
          fontSize: 'var(--text-base)', 
          lineHeight: 'var(--leading-none)', 
          margin: '0 0 8px 0',
          border: '1px solid #e5e7eb',
          padding: '8px'
        }}>
          This text has no line height (leading-none). It will be very compact with minimal spacing between lines.
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--leading-none (1)</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <p style={{ 
          fontSize: 'var(--text-base)', 
          lineHeight: 'var(--leading-tight)', 
          margin: '0 0 8px 0',
          border: '1px solid #e5e7eb',
          padding: '8px'
        }}>
          This text has tight line height (leading-tight). It provides minimal but readable spacing between lines.
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--leading-tight (1.25)</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <p style={{ 
          fontSize: 'var(--text-base)', 
          lineHeight: 'var(--leading-snug)', 
          margin: '0 0 8px 0',
          border: '1px solid #e5e7eb',
          padding: '8px'
        }}>
          This text has snug line height (leading-snug). It provides comfortable spacing for reading.
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--leading-snug (1.375)</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <p style={{ 
          fontSize: 'var(--text-base)', 
          lineHeight: 'var(--leading-normal)', 
          margin: '0 0 8px 0',
          border: '1px solid #e5e7eb',
          padding: '8px'
        }}>
          This text has normal line height (leading-normal). It provides standard spacing that's easy to read.
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--leading-normal (1.5)</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <p style={{ 
          fontSize: 'var(--text-base)', 
          lineHeight: 'var(--leading-relaxed)', 
          margin: '0 0 8px 0',
          border: '1px solid #e5e7eb',
          padding: '8px'
        }}>
          This text has relaxed line height (leading-relaxed). It provides generous spacing for comfortable reading.
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--leading-relaxed (1.625)</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <p style={{ 
          fontSize: 'var(--text-base)', 
          lineHeight: 'var(--leading-loose)', 
          margin: '0 0 8px 0',
          border: '1px solid #e5e7eb',
          padding: '8px'
        }}>
          This text has loose line height (leading-loose). It provides very generous spacing for easy reading.
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--leading-loose (2)</code>
      </div>
    </div>
  </div>
)

export const TextColors = () => (
  <div style={{ padding: '20px' }}>
    <h2>Text Colors</h2>
    <div style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ color: 'var(--fg-primary)', marginBottom: '8px' }}>Primary Text</h3>
        <p style={{ color: 'var(--fg-primary)', margin: '0' }}>
          This is primary text color used for main content and headings.
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--fg-primary</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ color: 'var(--fg-secondary)', marginBottom: '8px' }}>Secondary Text</h3>
        <p style={{ color: 'var(--fg-secondary)', margin: '0' }}>
          This is secondary text color used for supporting content and descriptions.
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--fg-secondary</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ color: 'var(--fg-tertiary)', marginBottom: '8px' }}>Tertiary Text</h3>
        <p style={{ color: 'var(--fg-tertiary)', margin: '0' }}>
          This is tertiary text color used for less important information.
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--fg-tertiary</code>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ color: 'var(--fg-disabled)', marginBottom: '8px' }}>Disabled Text</h3>
        <p style={{ color: 'var(--fg-disabled)', margin: '0' }}>
          This is disabled text color used for inactive or unavailable content.
        </p>
        <code style={{ fontSize: '12px', color: '#9ca3af' }}>--fg-disabled</code>
      </div>
    </div>
  </div>
)

export const TypographyScale = () => (
  <div style={{ padding: '20px' }}>
    <h2>Typography Scale</h2>
    <div style={{ display: 'grid', gap: '24px', marginTop: '16px' }}>
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h1 style={{ 
          fontSize: 'var(--text-4xl)', 
          fontWeight: 'var(--font-bold)', 
          lineHeight: 'var(--leading-tight)',
          margin: '0 0 16px 0',
          color: 'var(--fg-primary)'
        }}>
          Display Heading
        </h1>
        <p style={{ 
          fontSize: 'var(--text-lg)', 
          color: 'var(--fg-secondary)',
          margin: '0',
          lineHeight: 'var(--leading-relaxed)'
        }}>
          This is a large display heading with supporting text that demonstrates the typography scale.
        </p>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h2 style={{ 
          fontSize: 'var(--text-2xl)', 
          fontWeight: 'var(--font-semibold)', 
          lineHeight: 'var(--leading-tight)',
          margin: '0 0 12px 0',
          color: 'var(--fg-primary)'
        }}>
          Section Heading
        </h2>
        <p style={{ 
          fontSize: 'var(--text-base)', 
          color: 'var(--fg-secondary)',
          margin: '0',
          lineHeight: 'var(--leading-normal)'
        }}>
          This is a section heading with body text that shows the relationship between different text sizes.
        </p>
      </div>
      
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ 
          fontSize: 'var(--text-lg)', 
          fontWeight: 'var(--font-semibold)', 
          lineHeight: 'var(--leading-tight)',
          margin: '0 0 8px 0',
          color: 'var(--fg-primary)'
        }}>
          Subsection Heading
        </h3>
        <p style={{ 
          fontSize: 'var(--text-sm)', 
          color: 'var(--fg-secondary)',
          margin: '0',
          lineHeight: 'var(--leading-normal)'
        }}>
          This is a subsection heading with smaller text that demonstrates the hierarchy.
        </p>
      </div>
    </div>
  </div>
)
