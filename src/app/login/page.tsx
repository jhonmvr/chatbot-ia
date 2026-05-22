'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await login(username, password);
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '2rem',
      }}>
        {/* Logo y título */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            boxShadow: '0 10px 25px -5px rgba(102, 126, 234, 0.4)',
          }}>
            <svg 
              style={{ width: '40px', height: '40px', color: 'white' }}
              fill="none" 
              viewBox="0 0 48 48" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" 
                fill="currentColor"
              />
              <path 
                clipRule="evenodd" 
                d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764Z" 
                fill="currentColor" 
                fillRule="evenodd"
              />
            </svg>
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '0.5rem',
          }}>
            Welcome back
          </h1>
          <p style={{
            color: '#718096',
            fontSize: '0.95rem',
          }}>
            Log in to your Connectly account
          </p>
        </div>

        {/* Card del formulario */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.5rem',
              }}>
                <p style={{ fontSize: '0.875rem', color: '#991b1b' }}>{error}</p>
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <label 
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem',
                }}
                htmlFor="email"
              >
                Email or username
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.75rem',
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#1f2937',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label 
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem',
                }}
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.75rem',
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#1f2937',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    marginRight: '0.5rem',
                    accentColor: '#667eea',
                  }}
                />
                <label 
                  htmlFor="remember-me" 
                  style={{ fontSize: '0.875rem', color: '#4b5563' }}
                >
                  Remember me
                </label>
              </div>
              <a 
                href="#" 
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#667eea',
                  textDecoration: 'none',
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#764ba2'}
                onMouseOut={(e) => e.currentTarget.style.color = '#667eea'}
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '0.9375rem',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                boxShadow: '0 4px 6px -1px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(102, 126, 234, 0.3)';
              }}
            >
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </form>
        </div>

        <p style={{
          marginTop: '2rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#6b7280',
        }}>
          Don't have an account?{' '}
          <a 
            href="#" 
            style={{
              fontWeight: '500',
              color: '#667eea',
              textDecoration: 'none',
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#764ba2'}
            onMouseOut={(e) => e.currentTarget.style.color = '#667eea'}
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}