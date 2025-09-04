import React, { useState, useRef, useCallback } from 'react'
import styles from '../../styles/modules/FileUpload.module.css'
import clsx from 'clsx'
import Button from './Button'

const FileUpload = ({
  label,
  variant = 'dragAndDrop', // 'basic' | 'dragAndDrop'
  accept,
  maxFileSize = 30, // MB
  maxDimensions = '800×400px',
  multiple = false,
  value = null,
  onChange,
  onDrop,
  disabled = false,
  required = false,
  helperText,
  error,
  success,
  warning,
  info,
  className,
  fullWidth = false,
  ...props
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState(value || [])
  const fileInputRef = useRef(null)
  const dropZoneRef = useRef(null)

  const getStatusClass = () => {
    if (error) return styles.error
    if (success) return styles.success
    if (warning) return styles.warning
    if (info) return styles.info
    return ''
  }

  const getStatusIcon = () => {
    if (error) {
      return (
        <svg className={styles.statusIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-6 6M9 9l6 6" />
        </svg>
      )
    }
    if (success) {
      return (
        <svg className={styles.statusIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      )
    }
    if (warning) {
      return (
        <svg className={styles.statusIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      )
    }
    if (info) {
      return (
        <svg className={styles.statusIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      )
    }
    return null
  }

  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const newFiles = multiple ? [...selectedFiles, ...fileArray] : fileArray
    
    setSelectedFiles(newFiles)
    
    if (onChange) {
      onChange(multiple ? newFiles : newFiles[0])
    }
  }

  const handleInputChange = (e) => {
    handleFileSelect(e.target.files)
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    handleFileSelect(files)
    
    if (onDrop) {
      onDrop(files)
    }
  }, [onDrop])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    
    if (onChange) {
      onChange(multiple ? newFiles : newFiles[0] || null)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getAcceptedFormats = () => {
    if (!accept) return 'All files'
    
    if (typeof accept === 'string') {
      return accept.split(',').map(format => format.trim().toUpperCase()).join(', ')
    }
    
    if (Array.isArray(accept)) {
      return accept.map(format => format.toUpperCase()).join(', ')
    }
    
    return 'All files'
  }

  const renderBasicUpload = () => (
    <div className={styles.basicUpload}>
      <div className={styles.fileInputWrapper}>
        <button
          type="button"
          className={styles.chooseButton}
          onClick={handleBrowseClick}
          disabled={disabled}
        >
          Choose files
        </button>
        <span className={styles.fileStatus}>
          {selectedFiles.length > 0 
            ? `${selectedFiles.length} file(s) selected`
            : 'No file chosen'
          }
        </span>
      </div>
      
      {selectedFiles.length > 0 && (
        <div className={styles.fileList}>
          {selectedFiles.map((file, index) => (
            <div key={index} className={styles.fileItem}>
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeFile(index)}
                disabled={disabled}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderDragAndDrop = () => (
    <div
      ref={dropZoneRef}
      className={clsx(
        styles.dropZone,
        {
          [styles.dragOver]: isDragOver,
          [styles.disabled]: disabled
        }
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className={styles.uploadIcon}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7,10 12,15 17,10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </div>
      
      <div className={styles.uploadText}>
        <p className={styles.mainText}>Click to upload or drag and drop</p>
        <p className={styles.subText}>Max. File Size: {maxFileSize}MB</p>
      </div>
      
      <Button
        variant="solid"
        size="medium"
        onClick={handleBrowseClick}
        disabled={disabled}
        leftIcon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        }
      >
        Browse file
      </Button>
    </div>
  )

  return (
    <div className={clsx(styles.container, className)}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
          {info && (
            <span className={styles.infoIcon} title={info}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </span>
          )}
        </label>
      )}
      
      <div className={clsx(styles.uploadWrapper, getStatusClass())}>
        {variant === 'basic' ? renderBasicUpload() : renderDragAndDrop()}
        {getStatusIcon()}
      </div>
      
      {(helperText || error || success || warning || info) && (
        <div className={clsx(styles.helperText, getStatusClass())}>
          {helperText || error || success || warning || info}
        </div>
      )}
      
      <div className={styles.fileInfo}>
        <p className={styles.acceptedFormats}>
          {getAcceptedFormats()}
          {maxDimensions && ` (MAX. ${maxDimensions})`}
        </p>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        className={styles.hiddenInput}
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        disabled={disabled}
        {...props}
      />
    </div>
  )
}

export default FileUpload
