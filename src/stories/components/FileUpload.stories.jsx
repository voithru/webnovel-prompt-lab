import React, { useState } from 'react'
import FileUpload from '../../components/common/FileUpload'

export default {
  title: 'Components/FileUpload',
  component: FileUpload,
  parameters: {
    docs: {
      description: {
        component: '웹소설 MT 프로덕트에 최적화된 FileUpload 컴포넌트입니다. 기본 파일 선택과 드래그 앤 드롭 두 가지 유형을 지원합니다.'
      }
    }
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: '업로드 필드의 레이블'
    },
    variant: {
      control: { type: 'select' },
      options: ['basic', 'dragAndDrop'],
      description: '업로드 유형 (기본 파일 선택 또는 드래그 앤 드롭)'
    },
    accept: {
      control: { type: 'text' },
      description: '허용되는 파일 형식 (예: .jpg,.png,.pdf)'
    },
    maxFileSize: {
      control: { type: 'number' },
      description: '최대 파일 크기 (MB)'
    },
    maxDimensions: {
      control: { type: 'text' },
      description: '최대 이미지 크기 (예: 800×400px)'
    },
    multiple: {
      control: { type: 'boolean' },
      description: '다중 파일 선택 허용 여부'
    },
    disabled: {
      control: { type: 'boolean' },
      description: '비활성화 상태'
    },
    required: {
      control: { type: 'boolean' },
      description: '필수 필드 여부'
    },
    helperText: {
      control: { type: 'text' },
      description: '도움말 텍스트'
    },
    error: {
      control: { type: 'text' },
      description: '오류 메시지'
    },
    success: {
      control: { type: 'text' },
      description: '성공 메시지'
    },
    warning: {
      control: { type: 'text' },
      description: '경고 메시지'
    },
    info: {
      control: { type: 'text' },
      description: '정보 메시지'
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: '전체 너비 사용 여부'
    }
  }
}

// 기본 FileUpload 예시 (드래그 앤 드롭)
export const Default = {
  args: {
    label: 'Upload file',
    variant: 'dragAndDrop',
    accept: '.svg,.png,.jpg,.gif',
    maxFileSize: 30,
    maxDimensions: '800×400px',
    required: true
  }
}

// 기본 파일 선택 유형
export const BasicFileSelect = {
  args: {
    label: 'Upload file',
    variant: 'basic',
    accept: '.svg,.png,.jpg,.gif',
    maxFileSize: 30,
    maxDimensions: '800×400px',
    required: true
  }
}

// 다중 파일 업로드
export const MultipleFiles = {
  args: {
    label: 'Upload files',
    variant: 'dragAndDrop',
    accept: '.svg,.png,.jpg,.gif',
    maxFileSize: 30,
    maxDimensions: '800×400px',
    multiple: true,
    required: true
  }
}

// 이미지 파일 전용
export const ImageOnly = {
  args: {
    label: 'Upload image',
    variant: 'dragAndDrop',
    accept: '.jpg,.jpeg,.png,.gif,.webp',
    maxFileSize: 10,
    maxDimensions: '1920×1080px',
    helperText: 'High quality images recommended'
  }
}

// 문서 파일 전용
export const DocumentOnly = {
  args: {
    label: 'Upload document',
    variant: 'basic',
    accept: '.pdf,.doc,.docx,.txt',
    maxFileSize: 50,
    helperText: 'PDF, Word, or text files accepted'
  }
}

// 모든 상태를 보여주는 그리드
export const AllStates = () => (
  <div style={{ padding: '20px' }}>
    <h2 style={{ marginBottom: '24px', color: '#111827' }}>FileUpload Component - All States</h2>
    
    <div style={{ display: 'grid', gap: '24px', maxWidth: '1200px' }}>
      {/* Row 1: Basic States */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <FileUpload 
          label="Default upload"
          variant="dragAndDrop"
          accept=".jpg,.png,.pdf"
          maxFileSize={30}
        />
        <FileUpload 
          label="With helper text"
          variant="dragAndDrop"
          accept=".jpg,.png,.pdf"
          maxFileSize={30}
          helperText="Upload your files here"
        />
        <FileUpload 
          label="Required field"
          variant="dragAndDrop"
          accept=".jpg,.png,.pdf"
          maxFileSize={30}
          required
        />
      </div>

      {/* Row 2: Status States */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <FileUpload 
          label="Success state"
          variant="dragAndDrop"
          accept=".jpg,.png,.pdf"
          maxFileSize={30}
          success="File uploaded successfully"
        />
        <FileUpload 
          label="Error state"
          variant="dragAndDrop"
          accept=".jpg,.png,.pdf"
          maxFileSize={30}
          error="File upload failed"
        />
        <FileUpload 
          label="Warning state"
          variant="dragAndDrop"
          accept=".jpg,.png,.pdf"
          maxFileSize={30}
          warning="File size is close to limit"
        />
      </div>

      {/* Row 3: Info and Disabled States */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <FileUpload 
          label="Info state"
          variant="dragAndDrop"
          accept=".jpg,.png,.pdf"
          maxFileSize={30}
          info="Additional upload information"
        />
        <FileUpload 
          label="Disabled state"
          variant="dragAndDrop"
          accept=".jpg,.png,.pdf"
          maxFileSize={30}
          disabled
        />
        <FileUpload 
          label="Basic variant"
          variant="basic"
          accept=".jpg,.png,.pdf"
          maxFileSize={30}
        />
      </div>

      {/* Row 4: Different File Types */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <FileUpload 
          label="Images only"
          variant="dragAndDrop"
          accept=".jpg,.jpeg,.png,.gif,.webp"
          maxFileSize={20}
          maxDimensions="1920×1080px"
        />
        <FileUpload 
          label="Documents only"
          variant="basic"
          accept=".pdf,.doc,.docx,.txt"
          maxFileSize={50}
        />
        <FileUpload 
          label="All files"
          variant="dragAndDrop"
          maxFileSize={100}
        />
      </div>
    </div>
  </div>
)

// 인터랙티브 예시
export const Interactive = () => {
  const [uploadedFiles, setUploadedFiles] = useState([])

  const handleFileChange = (files) => {
    if (Array.isArray(files)) {
      setUploadedFiles(files)
    } else {
      setUploadedFiles([files])
    }
  }

  const handleDrop = (files) => {
    console.log('Files dropped:', files)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '24px', color: '#111827' }}>Interactive FileUpload</h2>
      
      <div style={{ display: 'grid', gap: '24px', maxWidth: '800px' }}>
        <FileUpload 
          label="Upload your files"
          variant="dragAndDrop"
          accept=".jpg,.png,.pdf,.doc,.docx"
          maxFileSize={50}
          multiple={true}
          onChange={handleFileChange}
          onDrop={handleDrop}
          helperText="Drag and drop files here or click browse"
        />
        
        {uploadedFiles.length > 0 && (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ marginBottom: '16px', color: '#111827' }}>Uploaded Files</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {uploadedFiles.map((file, index) => (
                <div key={index} style={{ 
                  padding: '12px', 
                  backgroundColor: '#f9fafb', 
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#111827', fontWeight: '500' }}>
                      {file.name}
                    </p>
                    <small style={{ color: '#6b7280' }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </small>
                  </div>
                  <button
                    onClick={() => {
                      const newFiles = uploadedFiles.filter((_, i) => i !== index)
                      setUploadedFiles(newFiles)
                    }}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 웹소설 MT 프로덕트 예시
export const WebNovelMTExample = () => {
  const [sourceFiles, setSourceFiles] = useState([])
  const [referenceFiles, setReferenceFiles] = useState([])

  const handleSourceUpload = (files) => {
    setSourceFiles(Array.isArray(files) ? files : [files])
  }

  const handleReferenceUpload = (files) => {
    setReferenceFiles(Array.isArray(files) ? files : [files])
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '24px', color: '#111827' }}>웹소설 MT 프로덕트 예시</h2>
      
      <div style={{ display: 'grid', gap: '32px', maxWidth: '1200px' }}>
        {/* 원문 파일 업로드 */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: '#111827' }}>원문 파일 업로드</h3>
          <FileUpload 
            label="원문 파일"
            variant="dragAndDrop"
            accept=".txt,.doc,.docx,.pdf"
            maxFileSize={50}
            multiple={false}
            onChange={handleSourceUpload}
            helperText="번역할 원문이 포함된 파일을 업로드하세요"
            required
          />
          
          {sourceFiles.length > 0 && (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px' }}>
              <p style={{ margin: '0', color: '#0369a1', fontSize: '14px' }}>
                ✅ {sourceFiles[0].name} 파일이 업로드되었습니다
              </p>
            </div>
          )}
        </div>

        {/* 참고 자료 업로드 */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: '#111827' }}>참고 자료 업로드</h3>
          <FileUpload 
            label="참고 자료"
            variant="basic"
            accept=".txt,.doc,.docx,.pdf,.jpg,.png"
            maxFileSize={100}
            multiple={true}
            onChange={handleReferenceUpload}
            helperText="번역 품질 향상을 위한 참고 자료를 업로드하세요 (선택사항)"
          />
          
          {referenceFiles.length > 0 && (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px' }}>
              <p style={{ margin: '0', color: '#0369a1', fontSize: '14px' }}>
                ✅ {referenceFiles.length}개의 참고 자료가 업로드되었습니다
              </p>
            </div>
          )}
        </div>

        {/* 설정 파일 업로드 */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: '#111827' }}>설정 파일 업로드</h3>
          <FileUpload 
            label="번역 설정"
            variant="basic"
            accept=".json,.yaml,.yml,.xml"
            maxFileSize={10}
            multiple={false}
            helperText="번역 품질 설정을 위한 설정 파일을 업로드하세요 (선택사항)"
          />
        </div>

        {/* 사용법 안내 */}
        <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px' }}>
          <h4 style={{ marginBottom: '12px', color: '#111827' }}>파일 업로드 안내</h4>
          <ul style={{ margin: '0', paddingLeft: '20px', color: '#374151' }}>
            <li>원문 파일은 필수로 업로드해야 합니다</li>
            <li>참고 자료는 번역 품질 향상에 도움이 됩니다</li>
            <li>설정 파일로 번역 스타일을 커스터마이징할 수 있습니다</li>
            <li>드래그 앤 드롭으로 쉽게 파일을 업로드할 수 있습니다</li>
            <li>파일 크기와 형식 제한을 확인해주세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
