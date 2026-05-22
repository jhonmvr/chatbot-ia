'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../hooks';

const getGradientColors = (colorClass: string) => {
  const colorMap: Record<string, string> = {
    'from-blue-400 to-blue-600': '#60a5fa, #2563eb',
    'from-green-400 to-green-600': '#4ade80, #16a34a',
    'from-purple-400 to-purple-600': '#c084fc, #9333ea',
    'from-orange-400 to-orange-600': '#fb923c, #ea580c',
    'from-red-400 to-red-600': '#f87171, #dc2626',
    'from-teal-400 to-teal-600': '#2dd4bf, #0d9488',
    'from-indigo-400 to-indigo-600': '#818cf8, #4f46e5',
    'from-pink-400 to-pink-600': '#f472b6, #db2777',
  };
  return colorMap[colorClass] || '#667eea, #764ba2';
};

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isClient || isLoading) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '4px solid #667eea',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto',
          }}></div>
          <p style={{ marginTop: '1rem', color: '#4a5568', fontSize: '1.125rem', fontWeight: '500' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: 'Bandeja de Entrada',
      description: 'Gestiona conversaciones de WhatsApp',
      icon: '📨',
      href: '/messages',
      color: 'from-blue-400 to-blue-600'
    },
    {
      title: 'Gestión de Clientes',
      description: 'Administra clientes del sistema',
      icon: '👥',
      href: '/clients',
      color: 'from-green-400 to-green-600'
    },
    {
      title: 'Números WhatsApp',
      description: 'Registra números de WhatsApp Business',
      icon: '📱',
      href: '/client-phones',
      color: 'from-purple-400 to-purple-600'
    },
    {
      title: 'Knowledge Base',
      description: 'Gestiona bases de conocimiento',
      icon: '🧠',
      href: '/knowledge-base',
      color: 'from-orange-400 to-orange-600'
    },
    {
      title: 'Ingesta de Documentos',
      description: 'Agrega documentos a las KB',
      icon: '📤',
      href: '/documents/ingest',
      color: 'from-red-400 to-red-600'
    },
    {
      title: 'Chat con IA',
      description: 'Interactúa con el sistema RAG',
      icon: '💬',
      href: '/chat',
      color: 'from-teal-400 to-teal-600'
    },
    {
      title: 'Métricas del Sistema',
      description: 'Monitoreo y estado del sistema',
      icon: '📊',
      href: '/metrics',
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      title: 'Gestión de Usuarios',
      description: 'Administra usuarios del sistema',
      icon: '👤',
      href: '/users',
      color: 'from-pink-400 to-pink-600'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: '1.5rem' }}>🤖</span>
              </div>
              <div>
                <h1 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1a202c',
                }}>ChatBot IA Frontend</h1>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#718096',
                }}>Panel de Control del Sistema</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(102, 126, 234, 0.3)';
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '3rem 1.5rem',
      }}>
        {/* Welcome Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '1rem',
          }}>
            ¡Bienvenido al Dashboard!
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#4a5568',
            maxWidth: '768px',
            margin: '0 auto',
          }}>
            Gestiona tu sistema de chatbot con inteligencia artificial integrado con WhatsApp Business.
            Accede a todas las funcionalidades desde este panel central.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}>
          {dashboardCards.map((card, index) => (
            <Link key={index} href={card.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  height: '100%',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: `linear-gradient(135deg, ${getGradientColors(card.color)})`,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}>
                  <span style={{ fontSize: '2rem' }}>{card.icon}</span>
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: '#1a202c',
                  marginBottom: '0.5rem',
                }}>
                  {card.title}
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#718096',
                }}>
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
