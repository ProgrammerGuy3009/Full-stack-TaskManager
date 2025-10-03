'use client';

import { useState } from 'react';

interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate?: string;
  tags: string[];
  completed: boolean;
  createdAt: string;
}

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
}

export default function TaskList({ tasks, onEdit, onDelete, onToggleComplete }: TaskListProps) {
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'priority' | 'dueDate' | 'title'>('created');
  const [searchTerm, setSearchTerm] = useState('');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return { bg: '#fee2e2', color: '#dc2626', border: '#dc2626' };
      case 'medium': return { bg: '#fef3c7', color: '#d97706', border: '#d97706' };
      case 'low': return { bg: '#dcfce7', color: '#16a34a', border: '#16a34a' };
      default: return { bg: '#f3f4f6', color: '#6b7280', border: '#d1d5db' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { bg: '#dcfce7', color: '#16a34a' };
      case 'in-progress': return { bg: '#dbeafe', color: '#2563eb' };
      case 'todo': return { bg: '#f3f4f6', color: '#6b7280' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'created':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Filters and Search */}
      <div className="card">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks..."
            className="input-field"
            style={{ flex: '1', minWidth: '200px' }}
          />
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="input-field"
            style={{ width: 'auto', minWidth: '120px' }}
          >
            <option value="all">All Tasks</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="input-field"
            style={{ width: 'auto', minWidth: '140px' }}
          >
            <option value="created">Sort by Created</option>
            <option value="priority">Sort by Priority</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>

        {/* Task Count */}
        <div style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
          Showing {sortedTasks.length} of {tasks.length} tasks
        </div>
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {sortedTasks.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#9ca3af', fontSize: '18px', marginBottom: '16px' }}>
              {searchTerm || filter !== 'all' ? 'No tasks match your criteria' : 'No tasks yet'}
            </p>
            {!searchTerm && filter === 'all' && (
              <p style={{ color: '#9ca3af' }}>Create your first task to get started!</p>
            )}
          </div>
        ) : (
          sortedTasks.map((task) => {
            const priorityColor = getPriorityColor(task.priority);
            const statusColor = getStatusColor(task.status);
            const overdue = task.dueDate && isOverdue(task.dueDate);

            return (
              <div
                key={task._id}
                className="card"
                style={{
                  borderLeft: `4px solid ${priorityColor.border}`,
                  backgroundColor: overdue ? '#fef2f2' : 'white'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => onToggleComplete(task._id, e.target.checked)}
                    style={{
                      width: '18px',
                      height: '18px',
                      marginTop: '2px',
                      cursor: 'pointer'
                    }}
                  />

                  {/* Task Content */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      margin: '0 0 8px 0',
                      fontSize: '18px',
                      fontWeight: '600',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? '#9ca3af' : '#111827'
                    }}>
                      {task.title}
                    </h3>

                    {task.description && (
                      <p style={{
                        margin: '0 0 12px 0',
                        color: task.completed ? '#9ca3af' : '#6b7280',
                        lineHeight: '1.5'
                      }}>
                        {task.description}
                      </p>
                    )}

                    {/* Tags */}
                    {task.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                        {task.tags.map((tag, index) => (
                          <span
                            key={index}
                            style={{
                              backgroundColor: '#f3f4f6',
                              color: '#6b7280',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '12px'
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Status and Priority */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{
                        backgroundColor: priorityColor.bg,
                        color: priorityColor.color,
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {task.priority.toUpperCase()} PRIORITY
                      </span>

                      <span style={{
                        backgroundColor: statusColor.bg,
                        color: statusColor.color,
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {task.status.replace('-', ' ').toUpperCase()}
                      </span>

                      {task.dueDate && (
                        <span style={{
                          color: overdue ? '#dc2626' : '#6b7280',
                          fontSize: '12px',
                          fontWeight: overdue ? '600' : 'normal'
                        }}>
                          📅 Due: {formatDate(task.dueDate)}
                          {overdue && ' (OVERDUE)'}
                        </span>
                      )}
                    </div>

                    <div style={{ color: '#9ca3af', fontSize: '12px' }}>
                      Created: {formatDate(task.createdAt)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => onEdit(task)}
                      style={{
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ddd',
                        color: '#333',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this task?')) {
                          onDelete(task._id);
                        }
                      }}
                      style={{
                        backgroundColor: '#fee2e2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
