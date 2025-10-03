'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <Link 
              href="/"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '8px', 
                textDecoration: 'none',
                color: '#0066cc',
                fontSize: '24px',
                fontWeight: 'bold'
              }}
            >
              <span style={{ fontSize: '24px' }}>📋</span>
              TaskManager
            </Link>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Sign in to your account</h2>
          <p style={{ color: '#666' }}>
            Or{' '}
            <Link href="/register" style={{ color: '#0066cc', textDecoration: 'none' }}>
              create a new account
            </Link>
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div style={{ 
                backgroundColor: '#fee2e2', 
                border: '1px solid #fecaca', 
                color: '#dc2626', 
                padding: '10px', 
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ 
                width: '100%', 
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting && <div className="loading-spinner"></div>}
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
              <p style={{ color: '#666', marginBottom: '15px' }}>New to TaskManager?</p>
              <Link
                href="/register"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontWeight: '500'
                }}
              >
                Create your account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
