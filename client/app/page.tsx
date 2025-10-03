'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';

export default function HomePage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>TaskManager</h1>
            <div style={{ display: 'flex', gap: '15px' }}>
              <Link
                href="/login"
                style={{ 
                  color: '#666', 
                  textDecoration: 'none', 
                  fontWeight: '500',
                  padding: '8px 16px'
                }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="btn-primary"
                style={{
                  backgroundColor: '#0066cc',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontWeight: '500'
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header> */}
      <PublicNavbar />

      {/* Hero Section */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
          Manage Your Tasks
          <br />
          <span style={{ color: '#0066cc' }}>Effortlessly</span>
        </h1>
        <p style={{ fontSize: '20px', color: '#666', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Stay organized, boost productivity, and never miss a deadline with our 
          comprehensive task management solution.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/register"
            className="btn-primary"
            style={{
              backgroundColor: '#0066cc',
              color: 'white',
              textDecoration: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              fontWeight: '500',
              fontSize: '16px'
            }}
          >
            Start Free Trial
          </Link>
          <Link
            href="/login"
            style={{
              backgroundColor: '#f0f0f0',
              color: '#333',
              textDecoration: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              fontWeight: '500',
              fontSize: '16px'
            }}
          >
            Sign In
          </Link>
        </div>

        {/* Features Section */}
        <div style={{ marginTop: '80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div className="card">
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>Task Organization</h3>
            <p style={{ color: '#666' }}>
              Create, organize, and prioritize your tasks with our intuitive interface.
            </p>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>Progress Tracking</h3>
            <p style={{ color: '#666' }}>
              Monitor your productivity with detailed analytics and progress reports.
            </p>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>Secure & Private</h3>
            <p style={{ color: '#666' }}>
              Your data is protected with enterprise-grade security.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
