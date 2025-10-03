'use client';

import { useState } from 'react';

interface SearchFilters {
  searchTerm: string;
  priority: string;
  status: string;
  dateRange: string;
  tags: string[];
  sortBy: string;
  sortOrder: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onExport: () => void;
  taskCount: number;
}

export default function AdvancedSearch({ onSearch, onExport, taskCount }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    priority: '',
    status: '',
    dateRange: '',
    tags: [],
    sortBy: 'created',
    sortOrder: 'desc'
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      searchTerm: '',
      priority: '',
      status: '',
      dateRange: '',
      tags: [],
      sortBy: 'created',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  return (
    <div className="card">
      {/* Basic Search */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: showAdvanced ? '20px' : '0' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            placeholder="Search tasks, descriptions, or tags..."
            className="input-field"
            style={{ paddingLeft: '40px' }}
          />
          <span style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#9ca3af',
            fontSize: '16px'
          }}>
            🔍
          </span>
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            backgroundColor: showAdvanced ? '#0066cc' : '#f3f4f6',
            color: showAdvanced ? 'white' : '#374151',
            border: '1px solid ' + (showAdvanced ? '#0066cc' : '#d1d5db'),
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          🔧 {showAdvanced ? 'Simple' : 'Advanced'}
        </button>

        <button
          onClick={onExport}
          style={{
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          📥 Export
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div style={{ 
          borderTop: '1px solid #e5e7eb', 
          paddingTop: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500', color: '#666' }}>
              PRIORITY
            </label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="input-field"
              style={{ fontSize: '14px' }}
            >
              <option value="">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500', color: '#666' }}>
              STATUS
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input-field"
              style={{ fontSize: '14px' }}
            >
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500', color: '#666' }}>
              CREATED
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="input-field"
              style={{ fontSize: '14px' }}
            >
              <option value="">Any Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500', color: '#666' }}>
              SORT BY
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="input-field"
                style={{ fontSize: '14px', flex: 1 }}
              >
                <option value="created">Created Date</option>
                <option value="updated">Last Updated</option>
                <option value="priority">Priority</option>
                <option value="dueDate">Due Date</option>
                <option value="title">Title</option>
              </select>
              <button
                onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                style={{
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
                title={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary & Clear */}
      <div style={{ 
        marginTop: '15px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        fontSize: '14px',
        color: '#666'
      }}>
        <span>
          Showing {taskCount} task{taskCount !== 1 ? 's' : ''}
          {(filters.searchTerm || filters.priority || filters.status || filters.dateRange) && 
            <span style={{ color: '#0066cc', fontWeight: '500' }}> (filtered)</span>
          }
        </span>
        
        {(filters.searchTerm || filters.priority || filters.status || filters.dateRange) && (
          <button
            onClick={clearFilters}
            style={{
              backgroundColor: 'transparent',
              color: '#0066cc',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'underline'
            }}
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
