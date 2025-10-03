'use client';
import TaskModal from "@/components/TaskModal";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { taskApi, userApi } from '@/utils/api';
import Navbar from '@/components/Navbar';

interface Task {
  _id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  createdAt: string;
}

interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  highPriorityTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, isLoading, router]);

  const fetchDashboardData = async () => {
    try {
      setIsLoadingData(true);
      const [dashboardResponse, statsResponse] = await Promise.all([
        userApi.getDashboardData(),
        taskApi.getTaskStats(),
      ]);

      if (dashboardResponse.success) {
        setRecentTasks(dashboardResponse.data.recentTasks || []);
      }

      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // const handleLogout = () => {
  //   logout();
  //   router.push('/login');
  // };
  const [showTaskModal, setShowTaskModal] = useState(false);
  // const handleCreateTask = async (data) => {
  const handleCreateTask = async (data: { title: string; priority: 'low' | 'medium' | 'high'; status: 'todo' | 'in-progress' | 'completed' }) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setShowTaskModal(false);
        fetchDashboardData(); // refresh tasks without reloading
      } else {
        alert("Failed to create task!");
      }
    } catch (err) {
      if (err instanceof Error) {
        alert("Network error: " + err.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  if (isLoading || !user) {
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
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>TaskManager</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: '#666' }}>Welcome, {user.username}!</span>
              <button 
                onClick={handleLogout}
                style={{
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header> */}
      <Navbar />


      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Dashboard Header */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Dashboard</h2>
          <p style={{ color: '#666' }}>Overview of your tasks and productivity</p>
        </div>

        {isLoadingData ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            {stats && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '20px', 
                marginBottom: '40px' 
              }}>
                <div className="card" style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '16px', color: '#666', marginBottom: '8px' }}>Total Tasks</h3>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#0066cc' }}>{stats.totalTasks}</p>
                </div>

                <div className="card" style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '16px', color: '#666', marginBottom: '8px' }}>Completed</h3>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>{stats.completedTasks}</p>
                  <p style={{ fontSize: '14px', color: '#16a34a' }}>{stats.completionRate}% completion rate</p>
                </div>

                <div className="card" style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '16px', color: '#666', marginBottom: '8px' }}>Pending</h3>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#d97706' }}>{stats.pendingTasks}</p>
                </div>

                <div className="card" style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '16px', color: '#666', marginBottom: '8px' }}>High Priority</h3>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>{stats.highPriorityTasks}</p>
                </div>
              </div>
            )}

            {/* Recent Tasks */}
            <div className="card">
              <div style={{ borderBottom: '1px solid #e5e7eb', padding: '0 0 20px 0' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600' }}>Recent Tasks</h3>
              </div>
              <div style={{ padding: '20px 0 0 0' }}>
                {recentTasks.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {recentTasks.map((task) => (
                      <div 
                        key={task._id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          padding: '15px', 
                          backgroundColor: '#f9fafb', 
                          borderRadius: '8px',
                          border: `3px solid ${
                            task.priority === 'high' ? '#dc2626' : 
                            task.priority === 'medium' ? '#d97706' : '#16a34a'
                          }`
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h4 style={{ 
                            fontWeight: '500',
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: task.completed ? '#9ca3af' : '#111827'
                          }}>
                            {task.title}
                          </h4>
                          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                            <span style={{ 
                              fontSize: '12px', 
                              padding: '2px 8px', 
                              borderRadius: '12px',
                              backgroundColor: task.priority === 'high' ? '#fee2e2' : 
                                               task.priority === 'medium' ? '#fef3c7' : '#dcfce7',
                              color: task.priority === 'high' ? '#dc2626' : 
                                     task.priority === 'medium' ? '#d97706' : '#16a34a'
                            }}>
                              {task.priority}
                            </span>
                            <span style={{ 
                              fontSize: '12px', 
                              padding: '2px 8px', 
                              borderRadius: '12px',
                              backgroundColor: task.completed ? '#dcfce7' : '#e5e7eb',
                              color: task.completed ? '#16a34a' : '#6b7280'
                            }}>
                              {task.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#9ca3af', marginBottom: '15px' }}>No tasks yet. Create your first task!</p>
                    {/* <button
                      onClick={() => alert('Task creation feature coming soon!')}
                      className="btn-primary"
                    >
                      Create Task
                    </button> */}
                    <button onClick={() => setShowTaskModal(true)} className="btn-primary">
                      Create Task
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={handleCreateTask}
        task={null}
      />
    </div>
  );
}
