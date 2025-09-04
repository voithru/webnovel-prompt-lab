import React, { useState, useMemo } from 'react'
import Button from './Button'

// SVG 아이콘 컴포넌트들
const Icons = {
  // 검색 아이콘
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
  ),
  // 플러스 아이콘
  Plus: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
  ),
  // 필터 아이콘
  Filter: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
    </svg>
  ),
  // 화살표 아이콘
  ChevronDown: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  ),
  // 정렬 아이콘
  Sort: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
    </svg>
  ),
  // 정보 아이콘
  Info: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  ),
  // 캘린더 아이콘
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
  ),
  // 휴지통 아이콘
  Trash: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
  // 왼쪽 화살표
  ChevronLeft: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  // 오른쪽 화살표
  ChevronRight: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  )
}

const Table = ({
  title = "Flowbite transactions",
  subtitle = "Manage all your existing transactions or add a new one",
  data = [],
  columns = [],
  searchPlaceholder = "Search for transaction",
  showSearch = true,
  showAddButton = true,
  showFilters = true,
  showActions = true,
  showPagination = true,
  itemsPerPage = 10,
  onSearch,
  onAdd,
  onFilter,
  onAction,
  onDelete,
  onPageChange,
  onSelectionChange
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState([])
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')
  const [hoveredRow, setHoveredRow] = useState(null)
  const [activeRow, setActiveRow] = useState(null)

  // 검색 및 정렬된 데이터 계산
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item => {
      if (!searchTerm) return true
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [data, searchTerm, sortColumn, sortDirection])

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredAndSortedData.slice(startIndex, endIndex)

  // 정렬 처리
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // 검색 처리
  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    setCurrentPage(1)
    if (onSearch) onSearch(value)
  }

  // 페이지 변경 처리
  const handlePageChange = (page) => {
    setCurrentPage(page)
    if (onPageChange) onPageChange(page)
  }

  // 행 선택 처리
  const handleRowSelection = (rowId) => {
    const newSelection = selectedRows.includes(rowId)
      ? selectedRows.filter(id => id !== rowId)
      : [...selectedRows, rowId]
    
    setSelectedRows(newSelection)
    if (onSelectionChange) onSelectionChange(newSelection)
  }

  // 전체 선택 처리
  const handleSelectAll = () => {
    const allIds = currentData.map(row => row.id)
    const newSelection = selectedRows.length === currentData.length ? [] : allIds
    
    setSelectedRows(newSelection)
    if (onSelectionChange) onSelectionChange(newSelection)
  }

  // 상태 배지 스타일
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return {
          backgroundColor: '#d1fae5',
          color: '#059669',
          border: '1px solid #a7f3d0'
        }
      case 'in progress':
        return {
          backgroundColor: '#fffbe6',
          color: '#d97706',
          border: '1px solid #fbbf24'
        }
      case 'failed':
        return {
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          border: '1px solid #fca5a5'
        }
      default:
        return {
          backgroundColor: '#f3f4f6',
          color: '#6b7280',
          border: '1px solid #d1d5db'
        }
    }
  }

  // 기본 컬럼 설정
  const defaultColumns = [
    { key: 'transaction', label: 'Transaction', sortable: false },
    { key: 'dueDate', label: 'Due Date', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false }
  ]

  const tableColumns = columns.length > 0 ? columns : defaultColumns

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* 헤더 섹션 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            margin: '0 0 8px 0'
          }}>
            {title}
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '0'
          }}>
            {subtitle}
          </p>
        </div>
        
        {showAddButton && (
          <Button
            variant="solid"
            style="brand"
            onClick={onAdd}
            customStyle={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <Icons.Plus />
            Add transaction
          </Button>
        )}
      </div>

      {/* 컨트롤 바 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* 검색 바 */}
        {showSearch && (
          <div style={{
            position: 'relative',
            flex: '1',
            maxWidth: '400px'
          }}>
            <div style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }}>
              <Icons.Search />
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearch}
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#f9fafb'
              }}
            />
          </div>
        )}

        {/* 액션 버튼들 */}
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          {showFilters && (
            <Button
              variant="outline"
              style="secondary"
              onClick={onFilter}
              customStyle={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <Icons.Filter />
              Filters
              <Icons.ChevronDown />
            </Button>
          )}
          
          {showActions && (
            <Button
              variant="outline"
              style="secondary"
              onClick={onAction}
              customStyle={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Actions
              <Icons.ChevronDown />
            </Button>
          )}
        </div>
      </div>

      {/* 테이블 */}
      <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          {/* 테이블 헤더 */}
          <thead style={{
            backgroundColor: '#f9fafb'
          }}>
            <tr>
              <th style={{
                padding: '16px',
                textAlign: 'left',
                borderBottom: '1px solid #e5e7eb',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151'
              }}>
                <input
                  type="checkbox"
                  checked={selectedRows.length === currentData.length && currentData.length > 0}
                  onChange={handleSelectAll}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer'
                  }}
                />
              </th>
              {tableColumns.map((column) => (
                <th
                  key={column.key}
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    borderBottom: '1px solid #e5e7eb',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    cursor: column.sortable ? 'pointer' : 'default',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onClick={() => column.sortable && handleSort(column.key)}
                  onMouseEnter={(e) => {
                    if (column.sortable) {
                      e.currentTarget.style.backgroundColor = '#f9fafb'
                      e.currentTarget.style.color = '#1f2937'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (column.sortable) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = '#374151'
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {column.label}
                    {column.key === 'actions' && (
                      <Icons.Info />
                    )}
                    {column.sortable && (
                      <Icons.Sort />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* 테이블 바디 */}
          <tbody>
            {currentData.map((row, index) => {
              const rowId = row.id || index
              const isHovered = hoveredRow === rowId
              const isActive = activeRow === rowId
              const isSelected = selectedRows.includes(rowId)
              
              return (
                <tr
                  key={rowId}
                  style={{
                    backgroundColor: isSelected 
                      ? '#eff6ff' 
                      : isHovered 
                        ? '#f9fafb' 
                        : '#ffffff',
                    borderBottom: '1px solid #f3f4f6',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onMouseEnter={() => setHoveredRow(rowId)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onMouseDown={() => setActiveRow(rowId)}
                  onMouseUp={() => setActiveRow(null)}
                  onClick={() => handleRowSelection(rowId)}
                >
                <td style={{
                  padding: '16px',
                  textAlign: 'left',
                  transition: 'all 0.2s ease-in-out'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id || index)}
                    onChange={() => handleRowSelection(row.id || index)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      transform: isActive ? 'scale(0.95)' : 'scale(1)',
                      transition: 'transform 0.1s ease-in-out'
                    }}
                  />
                </td>
                
                <td style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  color: '#111827'
                }}>
                  {row.transaction}
                </td>
                
                <td style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  color: '#111827'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Icons.Calendar />
                    {row.dueDate}
                  </div>
                </td>
                
                <td style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  color: '#111827',
                  fontWeight: '500'
                }}>
                  {row.amount}
                </td>
                
                <td style={{
                  padding: '16px',
                  textAlign: 'left'
                }}>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease-in-out',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    ...getStatusStyle(row.status)
                  }}>
                    {row.status}
                  </span>
                </td>
                
                <td style={{
                  padding: '16px',
                  textAlign: 'left'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <Button
                      variant="outline"
                      style="secondary"
                      onClick={() => onAction && onAction(row)}
                      customStyle={{
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease-in-out',
                        transform: isHovered ? 'scale(1.02)' : 'scale(1)'
                      }}
                    >
                      Actions
                      <Icons.ChevronDown />
                    </Button>
                    
                    <Button
                      variant="solid"
                      style="danger"
                      onClick={() => onDelete && onDelete(row)}
                      customStyle={{
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease-in-out',
                        transform: isHovered ? 'scale(1.02)' : 'scale(1)'
                      }}
                    >
                      <Icons.Trash />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {showPagination && totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedData.length)} of {filteredAndSortedData.length}
          </div>
          
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <Button
              variant="outline"
              style="secondary"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              customStyle={{
                padding: '8px 12px',
                fontSize: '14px'
              }}
            >
              <Icons.ChevronLeft />
            </Button>
            
            {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "solid" : "outline"}
                  style={currentPage === page ? "brand" : "secondary"}
                  onClick={() => handlePageChange(page)}
                  customStyle={{
                    padding: '8px 12px',
                    fontSize: '14px',
                    minWidth: '40px'
                  }}
                >
                  {page}
                </Button>
              )
            })}
            
            <Button
              variant="outline"
              style="secondary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              customStyle={{
                padding: '8px 12px',
                fontSize: '14px'
              }}
            >
              <Icons.ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Table
