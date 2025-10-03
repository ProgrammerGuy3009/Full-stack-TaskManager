// API Base URL
const API_BASE_URL = 'NEXT_PUBLIC_API_URL';

// Simple fetch wrapper for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authApi = {
  register: async (userData: { username: string; email: string; password: string }) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  login: async (loginData: { email: string; password: string }) => {
    return apiCall('/auth/login', {
      method: 'POST', 
      body: JSON.stringify(loginData)
    });
  },

  verifyToken: async () => {
    return apiCall('/auth/verify');
  },
};

// Enhanced Task API with full CRUD
export const taskApi = {
  // Get all tasks with optional filters
  getTasks: (params?: {
    priority?: string;
    status?: string;
    completed?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    ).toString() : '';
    
    return apiCall(`/tasks${queryString}`);
  },

  // Get single task
  getTask: (id: string) => apiCall(`/tasks/${id}`),
  
  // Create new task
  createTask: (taskData: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    status?: 'todo' | 'in-progress' | 'completed';
    dueDate?: string;
    tags?: string[];
  }) => apiCall('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData)
  }),

  // Update existing task
  updateTask: (id: string, updates: any) => apiCall(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  }),

  // Delete task
  deleteTask: (id: string) => apiCall(`/tasks/${id}`, { 
    method: 'DELETE' 
  }),

  // Get task statistics
  getTaskStats: () => apiCall('/tasks/stats'),

  // Bulk operations
  bulkOperations: (action: 'complete' | 'delete' | 'archive', taskIds: string[]) => 
    apiCall('/tasks/bulk', {
      method: 'POST',
      body: JSON.stringify({ action, taskIds })
    }),
};

// User API
export const userApi = {
  getDashboardData: () => apiCall('/users/dashboard'),
};
// Add this export function
export const exportTasks = (tasks: any[], format: 'csv' | 'json' = 'csv') => {
  if (format === 'csv') {
    const headers = ['Title', 'Description', 'Priority', 'Status', 'Due Date', 'Tags', 'Created', 'Completed'];
    const csvContent = [
      headers.join(','),
      ...tasks.map(task => [
        `"${task.title}"`,
        `"${task.description || ''}"`,
        task.priority,
        task.status,
        task.dueDate || '',
        `"${task.tags.join('; ')}"`,
        new Date(task.createdAt).toLocaleDateString(),
        task.completed ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  } else {
    const jsonContent = JSON.stringify(tasks, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
};
