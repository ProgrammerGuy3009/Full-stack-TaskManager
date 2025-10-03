// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import { taskApi } from '@/utils/api';
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { taskApi } from '@/utils/api';
import Navbar from '@/components/Navbar';


interface AnalyticsData {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  highPriorityTasks: number;
  overdueTasks: number;
  completionRate: number;
  tasksByStatus: {
    todo: number;
    inProgress: number;
    completed: number;
  };
  tasksByPriority: {
    low: number;
    medium: number;
    high: number;
  };
  weeklyProgress: Array<{
    day: string;
    completed: number;
    created: number;
  }>;
}

export default function AnalyticsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchAnalytics();
    }
  }, [user, isLoading, router]);

  const fetchAnalytics = async () => {
    try {
      setIsLoadingData(true);
      const response = await taskApi.getTaskStats();
      if (response.success) {
        // Create mock weekly progress data for demonstration
        const weeklyProgress = [
          { day: 'Mon', completed: Math.floor(Math.random() * 5) + 1, created: Math.floor(Math.random() * 3) + 1 },
          { day: 'Tue', completed: Math.floor(Math.random() * 5) + 1, created: Math.floor(Math.random() * 3) + 1 },
          { day: 'Wed', completed: Math.floor(Math.random() * 5) + 1, created: Math.floor(Math.random() * 3) + 1 },
          { day: 'Thu', completed: Math.floor(Math.random() * 5) + 1, created: Math.floor(Math.random() * 3) + 1 },
          { day: 'Fri', completed: Math.floor(Math.random() * 5) + 1, created: Math.floor(Math.random() * 3) + 1 },
          { day: 'Sat', completed: Math.floor(Math.random() * 3) + 1, created: Math.floor(Math.random() * 2) + 1 },
          { day: 'Sun', completed: Math.floor(Math.random() * 3) + 1, created: Math.floor(Math.random() * 2) + 1 }
        ];

        setAnalytics({
          ...response.stats,
          weeklyProgress
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoadingData(false);
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>TaskManager</h1>
              <nav style={{ display: 'flex', gap: '20px' }}>
                <a href="/dashboard" style={{ color: '#666', textDecoration: 'none' }}>Dashboard</a>
                <a href="/tasks" style={{ color: '#666', textDecoration: 'none' }}>Tasks</a>
                <a href="/analytics" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: '500' }}>Analytics</a>
              </nav>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: '#666' }}>Welcome, {user.username}!</span>
            </div>
          </div>
        </div>
      </header> */}
      <Navbar />


      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Analytics</h2>
          <p style={{ color: '#666' }}>Detailed insights into your task management and productivity</p>
        </div>

        {isLoadingData ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          </div>
        ) : analytics ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Overview Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px'
            }}>
              <div className="card" style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>TOTAL TASKS</h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#0066cc', marginBottom: '4px' }}>
                  {analytics.totalTasks}
                </p>
                <p style={{ fontSize: '12px', color: '#666' }}>All time</p>
              </div>

              <div className="card" style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>COMPLETION RATE</h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a', marginBottom: '4px' }}>
                  {analytics.completionRate}%
                </p>
                <p style={{ fontSize: '12px', color: '#16a34a' }}>
                  {analytics.completedTasks} of {analytics.totalTasks}
                </p>
              </div>

              <div className="card" style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>OVERDUE TASKS</h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc2626', marginBottom: '4px' }}>
                  {analytics.overdueTasks}
                </p>
                <p style={{ fontSize: '12px', color: '#dc2626' }}>Need attention</p>
              </div>

              <div className="card" style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>HIGH PRIORITY</h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#d97706', marginBottom: '4px' }}>
                  {analytics.highPriorityTasks}
                </p>
                <p style={{ fontSize: '12px', color: '#d97706' }}>Critical tasks</p>
              </div>
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              
              {/* Task Status Distribution */}
              <div className="card">
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Task Status Distribution</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ color: '#666' }}>To Do</span>
                      <span style={{ fontWeight: '600' }}>{analytics.tasksByStatus.todo}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
                      <div 
                        style={{ 
                          width: `${analytics.totalTasks > 0 ? (analytics.tasksByStatus.todo / analytics.totalTasks) * 100 : 0}%`, 
                          height: '100%', 
                          backgroundColor: '#6b7280', 
                          borderRadius: '4px' 
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ color: '#666' }}>In Progress</span>
                      <span style={{ fontWeight: '600' }}>{analytics.tasksByStatus.inProgress}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
                      <div 
                        style={{ 
                          width: `${analytics.totalTasks > 0 ? (analytics.tasksByStatus.inProgress / analytics.totalTasks) * 100 : 0}%`, 
                          height: '100%', 
                          backgroundColor: '#2563eb', 
                          borderRadius: '4px' 
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ color: '#666' }}>Completed</span>
                      <span style={{ fontWeight: '600' }}>{analytics.tasksByStatus.completed}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
                      <div 
                        style={{ 
                          width: `${analytics.totalTasks > 0 ? (analytics.tasksByStatus.completed / analytics.totalTasks) * 100 : 0}%`, 
                          height: '100%', 
                          backgroundColor: '#16a34a', 
                          borderRadius: '4px' 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Priority Distribution */}
              <div className="card">
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Priority Distribution</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ color: '#666' }}>High Priority</span>
                      <span style={{ fontWeight: '600' }}>{analytics.tasksByPriority.high}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
                      <div 
                        style={{ 
                          width: `${analytics.totalTasks > 0 ? (analytics.tasksByPriority.high / analytics.totalTasks) * 100 : 0}%`, 
                          height: '100%', 
                          backgroundColor: '#dc2626', 
                          borderRadius: '4px' 
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ color: '#666' }}>Medium Priority</span>
                      <span style={{ fontWeight: '600' }}>{analytics.tasksByPriority.medium}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
                      <div 
                        style={{ 
                          width: `${analytics.totalTasks > 0 ? (analytics.tasksByPriority.medium / analytics.totalTasks) * 100 : 0}%`, 
                          height: '100%', 
                          backgroundColor: '#d97706', 
                          borderRadius: '4px' 
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ color: '#666' }}>Low Priority</span>
                      <span style={{ fontWeight: '600' }}>{analytics.tasksByPriority.low}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
                      <div 
                        style={{ 
                          width: `${analytics.totalTasks > 0 ? (analytics.tasksByPriority.low / analytics.totalTasks) * 100 : 0}%`, 
                          height: '100%', 
                          backgroundColor: '#16a34a', 
                          borderRadius: '4px' 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Progress Chart */}
            <div className="card">
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Weekly Activity</h3>
              <div style={{ display: 'flex', alignItems: 'end', gap: '20px', height: '200px', padding: '0 20px' }}>
                {analytics.weeklyProgress.map((day, index) => {
                  const maxValue = Math.max(...analytics.weeklyProgress.map(d => Math.max(d.completed, d.created)));
                  const completedHeight = (day.completed / maxValue) * 150;
                  const createdHeight = (day.created / maxValue) * 150;
                  
                  return (
                    <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'end', gap: '4px', marginBottom: '10px' }}>
                        <div 
                          style={{ 
                            width: '20px', 
                            height: `${completedHeight}px`, 
                            backgroundColor: '#16a34a', 
                            borderRadius: '2px',
                            minHeight: '10px'
                          }}
                          title={`Completed: ${day.completed}`}
                        />
                        <div 
                          style={{ 
                            width: '20px', 
                            height: `${createdHeight}px`, 
                            backgroundColor: '#2563eb', 
                            borderRadius: '2px',
                            minHeight: '10px'
                          }}
                          title={`Created: ${day.created}`}
                        />
                      </div>
                      <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>{day.day}</span>
                    </div>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#16a34a', borderRadius: '2px' }} />
                  <span style={{ fontSize: '12px', color: '#666' }}>Tasks Completed</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#2563eb', borderRadius: '2px' }} />
                  <span style={{ fontSize: '12px', color: '#666' }}>Tasks Created</span>
                </div>
              </div>
            </div>

            {/* Insights Section */}
            <div className="card">
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Productivity Insights</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                
                {/* Completion Rate Insight */}
                <div style={{ padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #e0f2fe' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>📊</span>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Completion Rate</h4>
                  </div>
                  <p style={{ color: '#0369a1', margin: 0, fontSize: '14px' }}>
                    {analytics.completionRate >= 70 
                      ? `Great work! Your ${analytics.completionRate}% completion rate shows excellent task management skills.`
                      : analytics.completionRate >= 50
                      ? `Your ${analytics.completionRate}% completion rate is good. Consider breaking down larger tasks to improve completion.`
                      : `Your ${analytics.completionRate}% completion rate could be improved. Try focusing on fewer tasks at once.`
                    }
                  </p>
                </div>

                {/* Priority Balance */}
                <div style={{ padding: '15px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fed7aa' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>⚡</span>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Priority Balance</h4>
                  </div>
                  <p style={{ color: '#92400e', margin: 0, fontSize: '14px' }}>
                    {analytics.tasksByPriority.high > analytics.totalTasks * 0.4
                      ? 'You have many high-priority tasks. Consider if all are truly urgent.'
                      : 'Good priority balance. You\'re managing task urgency well.'
                    }
                  </p>
                </div>

                {/* Overdue Alert */}
                {analytics.overdueTasks > 0 && (
                  <div style={{ padding: '15px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '20px' }}>⚠️</span>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Overdue Tasks</h4>
                    </div>
                    <p style={{ color: '#991b1b', margin: 0, fontSize: '14px' }}>
                      You have {analytics.overdueTasks} overdue task{analytics.overdueTasks > 1 ? 's' : ''}. 
                      Consider reviewing deadlines and prioritizing these tasks.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#9ca3af', fontSize: '18px' }}>No analytics data available yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
