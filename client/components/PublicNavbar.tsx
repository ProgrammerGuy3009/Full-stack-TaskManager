'use client';

import Link from 'next/link';

export default function PublicNavbar() {
  return (
    <header style={{ 
      backgroundColor: 'white', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
          
          {/* Logo */}
          <Link 
            href="/"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              textDecoration: 'none',
              color: '#0066cc'
            }}
          >
            <span style={{ fontSize: '24px' }}>📋</span>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              margin: 0,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              TaskManager
            </h1>
          </Link>

          {/* Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link
              href="/login"
              style={{
                color: '#666',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '16px',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Sign In
            </Link>
            
            <Link
              href="/register"
              style={{
                backgroundColor: '#0066cc',
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '16px',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0052a3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0066cc';
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
