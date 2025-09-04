import React, { useState } from 'react'
import Table from '../../components/common/Table'

export default {
  title: 'Components/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component: '웹소설 MT 프로덕트에 최적화된 Table 컴포넌트입니다. 검색, 필터링, 정렬, 페이지네이션, 행 선택 등의 기능을 포함합니다.'
      }
    }
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: '테이블 제목'
    },
    subtitle: {
      control: { type: 'text' },
      description: '테이블 부제목'
    },
    searchPlaceholder: {
      control: { type: 'text' },
      description: '검색 입력 필드 플레이스홀더'
    },
    showSearch: {
      control: { type: 'boolean' },
      description: '검색 기능 표시 여부'
    },
    showAddButton: {
      control: { type: 'boolean' },
      description: '추가 버튼 표시 여부'
    },
    showFilters: {
      control: { type: 'boolean' },
      description: '필터 버튼 표시 여부'
    },
    showActions: {
      control: { type: 'boolean' },
      description: '액션 버튼 표시 여부'
    },
    showPagination: {
      control: { type: 'boolean' },
      description: '페이지네이션 표시 여부'
    },
    itemsPerPage: {
      control: { type: 'number', min: 5, max: 50 },
      description: '페이지당 항목 수'
    }
  }
}

// 샘플 데이터
const sampleData = [
  {
    id: 1,
    transaction: 'Payment from Bonnie Green',
    dueDate: '15 Mar 2025',
    amount: '$199',
    status: 'Completed'
  },
  {
    id: 2,
    transaction: 'Payment refund to #00910',
    dueDate: '17 Mar 2025',
    amount: '-$1,768',
    status: 'In progress'
  },
  {
    id: 3,
    transaction: 'Payment failed from #087651',
    dueDate: '10 Apr 2025',
    amount: '$399',
    status: 'Failed'
  },
  {
    id: 4,
    transaction: 'Payment from Jese Leos',
    dueDate: '5 May 2025',
    amount: '$6,554',
    status: 'Completed'
  },
  {
    id: 5,
    transaction: 'Payment from Lana Byrd',
    dueDate: '30 Jan 2025',
    amount: '$9,867',
    status: 'Completed'
  },
  {
    id: 6,
    transaction: 'Wire transfer for Bergside LLC',
    dueDate: '12 Jun 2025',
    amount: '-$3,276',
    status: 'In progress'
  },
  {
    id: 7,
    transaction: 'Payment refund to #06978',
    dueDate: '18 Jul 2025',
    amount: '-$4,756',
    status: 'Failed'
  },
  {
    id: 8,
    transaction: 'Payment to Karen Nelson',
    dueDate: '25 Aug 2025',
    amount: '-$806',
    status: 'In progress'
  },
  {
    id: 9,
    transaction: 'Payment to Alphabet LLC',
    dueDate: '1 Sep 2025',
    amount: '$2,500',
    status: 'Completed'
  },
  {
    id: 10,
    transaction: 'Payment from Microsoft Corp',
    dueDate: '20 Sep 2025',
    amount: '$15,000',
    status: 'Completed'
  }
]

// 기본 Table 예시
export const Default = {
  args: {
    title: 'Flowbite transactions',
    subtitle: 'Manage all your existing transactions or add a new one',
    data: sampleData,
    showSearch: true,
    showAddButton: true,
    showFilters: true,
    showActions: true,
    showPagination: true,
    itemsPerPage: 10
  }
}

// 검색 기능이 없는 Table
export const WithoutSearch = {
  args: {
    title: 'Simple Transactions',
    subtitle: 'Basic transaction table without search functionality',
    data: sampleData.slice(0, 5),
    showSearch: false,
    showAddButton: true,
    showFilters: false,
    showActions: true,
    showPagination: false
  }
}

// 페이지네이션이 없는 Table
export const WithoutPagination = {
  args: {
    title: 'All Transactions',
    subtitle: 'Show all transactions on a single page',
    data: sampleData,
    showSearch: true,
    showAddButton: true,
    showFilters: true,
    showActions: true,
    showPagination: false
  }
}

// 인터랙티브 Table 예시
export const Interactive = () => {
  const [data, setData] = useState(sampleData)
  const [selectedRows, setSelectedRows] = useState([])

  const handleAdd = () => {
    const newTransaction = {
      id: Date.now(),
      transaction: `New transaction #${Date.now()}`,
      dueDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      amount: `$${Math.floor(Math.random() * 1000) + 100}`,
      status: ['Completed', 'In progress', 'Failed'][Math.floor(Math.random() * 3)]
    }
    setData([...data, newTransaction])
  }

  const handleDelete = (row) => {
    setData(data.filter(item => item.id !== row.id))
  }

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm)
  }

  const handleFilter = () => {
    console.log('Filter button clicked')
  }

  const handleAction = (row) => {
    console.log('Action for row:', row)
  }

  const handlePageChange = (page) => {
    console.log('Page changed to:', page)
  }

  const handleSelectionChange = (selectedIds) => {
    setSelectedRows(selectedIds)
    console.log('Selected rows:', selectedIds)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '24px', color: '#111827' }}>Interactive Table Example</h2>
      
      <Table
        title="Interactive Transactions"
        subtitle="This table demonstrates all interactive features"
        data={data}
        showSearch={true}
        showAddButton={true}
        showFilters={true}
        showActions={true}
        showPagination={true}
        itemsPerPage={5}
        onSearch={handleSearch}
        onAdd={handleAdd}
        onFilter={handleFilter}
        onAction={handleAction}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
        onSelectionChange={handleSelectionChange}
      />
      
      {selectedRows.length > 0 && (
        <div style={{ 
          marginTop: '20px', 
          padding: '16px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ marginBottom: '12px', color: '#111827' }}>Selected Rows</h3>
          <p style={{ margin: '0', color: '#6b7280' }}>
            {selectedRows.length} row(s) selected: {selectedRows.join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}

// 웹소설 MT 프로덕트 예시
export const WebNovelMTExample = () => {
  const [translationTasks, setTranslationTasks] = useState([
    {
      id: 1,
      transaction: '번역 작업 #001 - Chapter 1',
      dueDate: '15 Mar 2025',
      amount: '500자',
      status: 'Completed'
    },
    {
      id: 2,
      transaction: '번역 작업 #002 - Chapter 2',
      dueDate: '17 Mar 2025',
      amount: '800자',
      status: 'In progress'
    },
    {
      id: 3,
      transaction: '번역 작업 #003 - Chapter 3',
      dueDate: '10 Apr 2025',
      amount: '1200자',
      status: 'Failed'
    },
    {
      id: 4,
      transaction: '번역 작업 #004 - Chapter 4',
      dueDate: '5 May 2025',
      amount: '650자',
      status: 'Completed'
    },
    {
      id: 5,
      transaction: '번역 작업 #005 - Chapter 5',
      dueDate: '30 Jan 2025',
      amount: '950자',
      status: 'In progress'
    }
  ])

  const handleAddTask = () => {
    const newTask = {
      id: Date.now(),
      transaction: `새 번역 작업 #${Date.now()}`,
      dueDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      amount: `${Math.floor(Math.random() * 1000) + 200}자`,
      status: 'In progress'
    }
    setTranslationTasks([...translationTasks, newTask])
  }

  const handleDeleteTask = (task) => {
    setTranslationTasks(translationTasks.filter(item => item.id !== task.id))
  }

  const handleSearch = (searchTerm) => {
    console.log('번역 작업 검색:', searchTerm)
  }

  const handleFilter = () => {
    console.log('필터 적용')
  }

  const handleAction = (task) => {
    console.log('작업 액션:', task)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '24px', color: '#111827' }}>웹소설 MT 프로덕트 예시</h2>
      
      <Table
        title="번역 작업 관리"
        subtitle="웹소설 번역 작업의 진행 상황을 관리합니다"
        data={translationTasks}
        searchPlaceholder="번역 작업 검색..."
        showSearch={true}
        showAddButton={true}
        showFilters={true}
        showActions={true}
        showPagination={false}
        onSearch={handleSearch}
        onAdd={handleAddTask}
        onFilter={handleFilter}
        onAction={handleAction}
        onDelete={handleDeleteTask}
      />
      
      <div style={{ 
        marginTop: '24px', 
        padding: '16px', 
        backgroundColor: '#f0fdf4', 
        borderRadius: '8px',
        border: '1px solid #bbf7d0'
      }}>
        <h4 style={{ marginBottom: '12px', color: '#166534' }}>사용법 안내</h4>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#166534' }}>
          <li><strong>검색:</strong> 번역 작업 제목으로 검색할 수 있습니다</li>
          <li><strong>필터:</strong> 상태별로 작업을 필터링할 수 있습니다</li>
          <li><strong>액션:</strong> 각 작업에 대한 세부 액션을 수행할 수 있습니다</li>
          <li><strong>삭제:</strong> 완료된 작업을 삭제할 수 있습니다</li>
          <li><strong>상태:</strong> Completed(완료), In progress(진행중), Failed(실패)로 구분됩니다</li>
        </ul>
      </div>
    </div>
  )
}

// 모든 기능을 보여주는 예시
export const AllFeatures = () => (
  <div style={{ padding: '20px' }}>
    <h2 style={{ marginBottom: '24px', color: '#111827' }}>Table Component - All Features</h2>
    
    <div style={{ display: 'grid', gap: '32px', maxWidth: '1400px' }}>
      {/* 기본 기능 */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>기본 기능</h3>
        <Table 
          title="Basic Table"
          subtitle="Search, filter, pagination, and row selection"
          data={sampleData.slice(0, 5)}
          showSearch={true}
          showAddButton={true}
          showFilters={true}
          showActions={true}
          showPagination={true}
          itemsPerPage={3}
        />
      </div>

      {/* 고급 기능 */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>고급 기능</h3>
        <Table 
          title="Advanced Table"
          subtitle="Custom columns, sorting, and advanced interactions"
          data={sampleData}
          columns={[
            { key: 'transaction', label: 'Transaction', sortable: true },
            { key: 'dueDate', label: 'Due Date', sortable: true },
            { key: 'amount', label: 'Amount', sortable: true },
            { key: 'status', label: 'Status', sortable: false },
            { key: 'actions', label: 'Actions', sortable: false }
          ]}
          showSearch={true}
          showAddButton={true}
          showFilters={true}
          showActions={true}
          showPagination={true}
          itemsPerPage={5}
        />
      </div>
    </div>
  </div>
)
