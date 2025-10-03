// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import { taskApi } from '@/utils/api';
// import TaskModal from '@/components/TaskModal';
// import TaskList from '@/components/TaskList';
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { taskApi } from '@/utils/api';
import TaskModal from '@/components/TaskModal';
import TaskList from '@/components/TaskList';
import Navbar from '@/components/Navbar';

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

export default function TasksPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchTasks();
    }
  }, [user, isLoading, router]);

  const fetchTasks = async () => {
    try {
      setIsLoadingTasks(true);
      const response = await taskApi.getTasks();
      if (response.success) {
        setTasks(response.tasks || []);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, '_id' | 'createdAt'>) => {
    try {
      const response = await taskApi.createTask(taskData);
      if (response.success) {
        await fetchTasks(); // Refresh the list
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  const handleEditTask = async (taskData: Task) => {
    try {
      const response = await taskApi.updateTask(taskData._id, taskData);
      if (response.success) {
        await fetchTasks(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await taskApi.deleteTask(taskId);
      if (response.success) {
        await fetchTasks(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
        const updateData = { 
        completed: completed,  // Explicitly set as boolean
        status: completed ? ('completed' as const) : ('todo' as const)  // TypeScript const assertions
        };
        
        const response = await taskApi.updateTask(taskId, updateData);
        if (response.success) {
        await fetchTasks(); // Refresh the list
        }
    } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task. Please try again.');
        }
    };


  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleModalSubmit = async (taskData: any) => {
    if (editingTask) {
      await handleEditTask({ ...taskData, _id: editingTask._id });
    } else {
      await handleCreateTask(taskData);
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      {/* <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>TaskManager</h1>
              <nav style={{ display: 'flex', gap: '20px' }}>
                <a href="/dashboard" style={{ color: '#666', textDecoration: 'none' }}>Dashboard</a>
                <a href="/tasks" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: '500' }}>Tasks</a>
              </nav>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: '#666' }}>Welcome, {user?.username}!</span>
              <button 
                onClick={() => router.push('/dashboard')}
                style={{
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </header> */}
        <Navbar />


      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>My Tasks</h2>
            <p style={{ color: '#666' }}>Manage and track your tasks</p>
          </div>
          <button
            onClick={openCreateModal}
            className="btn-primary"
            style={{ padding: '12px 24px', fontSize: '16px' }}
          >
            + Create New Task
          </button>
        </div>

        {/* Loading State */}
        {isLoadingTasks ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
          />
        )}
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        task={editingTask}
      />
    </div>
  );
}
