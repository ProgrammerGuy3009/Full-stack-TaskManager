'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Tasks', href: '/tasks', icon: '✅' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
    { name: 'Profile', href: '/profile', icon: '👤' },
  ];

  if (!user) return null;

  return (
    <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
          
          {/* Logo & Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            {/* <div 
              onClick={() => router.push('/dashboard')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            > */}
            <div 
              onClick={() => router.push('/')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >

              <span style={{ fontSize: '24px' }}>📋</span>
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                margin: 0, 
                color: '#0066cc',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                TaskManager
              </h1>
            </div>
            
            <nav style={{ display: 'flex', gap: '24px' }}>
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: isActive ? '#0066cc' : '#666',
                      textDecoration: 'none',
                      fontWeight: isActive ? '600' : '500',
                      fontSize: '16px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: isActive ? '#f0f9ff' : 'transparent',
                      border: isActive ? '1px solid #e0f2fe' : '1px solid transparent',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                        e.currentTarget.style.borderColor = '#f3f4f6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>{item.icon}</span>
                    {item.name}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* User Info & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            
            {/* User Greeting */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                backgroundColor: '#0066cc', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p style={{ 
                  margin: 0, 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#333',
                  lineHeight: '1.2'
                }}>
                  Welcome back
                </p>
                <p style={{ 
                  margin: 0, 
                  fontSize: '13px', 
                  color: '#666',
                  lineHeight: '1.2'
                }}>
                  {user.username}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
                e.currentTarget.style.borderColor = '#9ca3af';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              <span style={{ fontSize: '16px' }}>🚪</span>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
