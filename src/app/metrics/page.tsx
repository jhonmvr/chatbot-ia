'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../hooks';
import { Button, Card, Badge, Alert } from '../../components/ui';

interface SystemInfo {
  name: string;
  version: string;
  description: string;
  whatsappProvider: string;
  aiProvider: string;
  endpoints: Record<string, string>;
}

interface HealthStatus {
  status: string;
  timestamp: string;
  application: string;
  database?: {
    status: string;
    driver: string;
    version: string;
  };
  services?: {
    whatsapp: {
      provider: string;
      status: string;
    };
    ai: {
      provider: string;
      status: string;
    };
  };
}

export default function MetricsPage() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [fullHealthStatus, setFullHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (isAuthenticated) {
      fetchSystemData();
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch system info
      const infoResponse = await fetch('/api/info', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (infoResponse.ok) {
        const info = await infoResponse.json();
        setSystemInfo(info);
      }
      
      // Fetch basic health
      const healthResponse = await fetch('/api/health', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (healthResponse.ok) {
        const health = await healthResponse.json();
        setHealthStatus(health);
      }
      
      // Fetch full health
      const fullHealthResponse = await fetch('/api/health/full', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (fullHealthResponse.ok) {
        const fullHealth = await fullHealthResponse.json();
        setFullHealthStatus(fullHealth);
      }
      
    } catch (err) {
      setError('Error al cargar los datos del sistema');
      console.error('Error fetching system data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'UP':
      case 'HEALTHY':
      case 'CONFIGURED':
        return 'success';
      case 'DOWN':
      case 'UNHEALTHY':
      case 'ERROR':
        return 'error';
      case 'WARNING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (isLoading || loading) {
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
          <p style={{ marginTop: '1rem', color: '#4a5568', fontSize: '1.125rem', fontWeight: '500' }}>Cargando métricas del sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        padding: '1rem 1.5rem',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ fontSize: '1.25rem' }}>📊</span>
            </div>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#1a202c',
            }}>Métricas y Monitoreo</h1>
          </div>
          <a href="/" style={{
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '600',
            borderRadius: '8px',
            textDecoration: 'none',
            cursor: 'pointer',
          }}>
            ← Dashboard
          </a>
        </div>
      </header>
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="enterprise-logo">
              <div className="enterprise-logo-icon">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Métricas del Sistema</h1>
                <p className="text-sm text-white/70">Monitoreo y estado de la aplicación</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                onClick={fetchSystemData}
              >
                🔄 Actualizar
              </Button>
              <Link
                href="/"
                className="btn-enterprise-secondary text-white border-white/30 hover:bg-white/10"
              >
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {error && (
          <Alert variant="error" title="Error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* System Overview */}
        {systemInfo && (
          <Card variant="elevated" className="mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Información del Sistema</h2>
              <p className="text-gray-600 text-sm">Detalles generales de la aplicación</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-xl">🏷️</span>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{systemInfo.name}</div>
                    <div className="text-gray-600 text-sm">Aplicación</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-xl">📦</span>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{systemInfo.version}</div>
                    <div className="text-gray-600 text-sm">Versión</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{systemInfo.whatsappProvider}</div>
                    <div className="text-gray-600 text-sm">Proveedor WhatsApp</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{systemInfo.aiProvider}</div>
                    <div className="text-gray-600 text-sm">Proveedor IA</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-xl">🔗</span>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{Object.keys(systemInfo.endpoints).length}</div>
                    <div className="text-gray-600 text-sm">Endpoints</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                <p className="text-gray-700">{systemInfo.description}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Health Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Basic Health */}
          {healthStatus && (
            <Card variant="elevated">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Estado Básico</h2>
                <p className="text-gray-600 text-sm">Health check básico del sistema</p>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-xl">💚</span>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">{healthStatus.application}</div>
                      <div className="text-gray-600 text-sm">Aplicación</div>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(healthStatus.status)}>
                    {healthStatus.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className="font-semibold">{healthStatus.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Última verificación:</span>
                    <span className="font-semibold">{formatTimestamp(healthStatus.timestamp)}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Full Health */}
          {fullHealthStatus && (
            <Card variant="elevated">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Estado Detallado</h2>
                <p className="text-gray-600 text-sm">Health check completo con servicios</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {/* Application Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-sm">🏷️</span>
                      </div>
                      <span className="text-gray-700">Aplicación</span>
                    </div>
                    <Badge variant={getStatusColor(fullHealthStatus.status)}>
                      {fullHealthStatus.status}
                    </Badge>
                  </div>
                  
                  {/* Database Status */}
                  {fullHealthStatus.database && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-sm">🗄️</span>
                        </div>
                        <span className="text-gray-700">Base de Datos ({fullHealthStatus.database.driver})</span>
                      </div>
                      <Badge variant={getStatusColor(fullHealthStatus.database.status)}>
                        {fullHealthStatus.database.status}
                      </Badge>
                    </div>
                  )}
                  
                  {/* WhatsApp Service */}
                  {fullHealthStatus.services?.whatsapp && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-sm">📱</span>
                        </div>
                        <span className="text-gray-700">WhatsApp ({fullHealthStatus.services.whatsapp.provider})</span>
                      </div>
                      <Badge variant={getStatusColor(fullHealthStatus.services.whatsapp.status)}>
                        {fullHealthStatus.services.whatsapp.status}
                      </Badge>
                    </div>
                  )}
                  
                  {/* AI Service */}
                  {fullHealthStatus.services?.ai && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-sm">🤖</span>
                        </div>
                        <span className="text-gray-700">IA ({fullHealthStatus.services.ai.provider})</span>
                      </div>
                      <Badge variant={getStatusColor(fullHealthStatus.services.ai.status)}>
                        {fullHealthStatus.services.ai.status}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Última verificación:</span>
                    <span>{formatTimestamp(fullHealthStatus.timestamp)}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Endpoints */}
        {systemInfo && (
          <Card variant="elevated" className="mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Endpoints Disponibles</h2>
              <p className="text-gray-600 text-sm">URLs de los servicios del sistema</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(systemInfo.endpoints).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-sm text-gray-600 font-mono">{value}</div>
                    </div>
                    <Badge variant="info" size="sm">
                      API
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* System Metrics */}
        <Card variant="elevated">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Métricas del Sistema</h2>
            <p className="text-gray-600 text-sm">Estadísticas de rendimiento</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">99.9%</div>
                <div className="text-gray-600 text-sm">Uptime</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">1.2s</div>
                <div className="text-gray-600 text-sm">Tiempo de Respuesta</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💾</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">2.4GB</div>
                <div className="text-gray-600 text-sm">Memoria Usada</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔄</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">45%</div>
                <div className="text-gray-600 text-sm">CPU Usage</div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
