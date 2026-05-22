'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useClients } from '../../hooks';
import { Button, Card, Badge, Alert, Input } from '../../components/ui';

interface Client {
  id: string;
  code: string;
  name: string;
  status: string;
}

export default function ClientsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [createForm, setCreateForm] = useState({
    code: '',
    name: '',
    status: 'ACTIVE'
  });
  const { isAuthenticated, isLoading } = useAuth();
  const { clients, isLoading: clientsLoading, error, createClient } = useClients();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, isLoading, router]);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createClient(createForm);
    if (result.success) {
      setShowCreateForm(false);
      setCreateForm({ code: '', name: '', status: 'ACTIVE' });
    } else {
      alert(result.error || 'Error al crear cliente');
    }
  };

  const handleViewClient = async (clientId: string) => {
    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const client = await response.json();
        setSelectedClient(client);
      } else {
        alert('Error al cargar los detalles del cliente');
      }
    } catch (err) {
      alert('Error al cargar los detalles del cliente');
      console.error('Error fetching client details:', err);
    }
  };

  if (isLoading || clientsLoading) {
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
          <p style={{ marginTop: '1rem', color: '#4a5568', fontSize: '1.125rem', fontWeight: '500' }}>Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      {/* Header */}
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
              <span style={{ fontSize: '1.25rem' }}>👥</span>
            </div>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#1a202c',
            }}>Gestión de Clientes</h1>
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
      {/* Original Content Below */}
      <header className="enterprise-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="enterprise-logo">
              <div className="enterprise-logo-icon">
                <span className="text-xl">👥</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Gestión de Clientes</h1>
                <p className="text-sm text-white/70">Administra los clientes del sistema</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="primary"
                onClick={() => setShowCreateForm(true)}
              >
                + Nuevo Cliente
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="elevated" className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">👥</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{clients.length}</div>
                <div className="text-gray-600 text-sm">Total Clientes</div>
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">✅</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {clients.filter(c => c.status === 'ACTIVE').length}
                </div>
                <div className="text-gray-600 text-sm">Clientes Activos</div>
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">⏸️</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {clients.filter(c => c.status === 'INACTIVE').length}
                </div>
                <div className="text-gray-600 text-sm">Clientes Inactivos</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="error" title="Error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Clients List */}
        <Card variant="elevated" className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Lista de Clientes</h2>
            <p className="text-gray-600 text-sm">Gestiona todos los clientes del sistema</p>
          </div>
          
          <div className="p-6">
            {clients.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">👥</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  No hay clientes registrados
                </h3>
                <p className="text-gray-600 mb-6">
                  Crea el primer cliente usando el botón de arriba
                </p>
                <Button
                  variant="primary"
                  onClick={() => setShowCreateForm(true)}
                >
                  Crear Primer Cliente
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {clients.map((client) => (
                  <Card
                    key={client.id}
                    variant="outlined"
                    className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleViewClient(client.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6">
                          <span className="text-2xl text-white font-bold">
                            {client.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {client.name}
                          </h3>
                          <div className="space-y-1">
                            <p className="text-gray-600">
                              <span className="font-medium">Código:</span> {client.code}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">ID:</span> {client.id}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={client.status === 'ACTIVE' ? 'success' : 'default'}
                        >
                          {client.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewClient(client.id);
                          }}
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>
      </main>

      {/* Create Client Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card variant="elevated" className="w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Crear Nuevo Cliente</h2>
              
              <form onSubmit={handleCreateClient} className="space-y-4">
                <Input
                  label="Código del Cliente"
                  value={createForm.code}
                  onChange={(e) => setCreateForm({ ...createForm, code: e.target.value })}
                  placeholder="CLI-001"
                  required
                />
                
                <Input
                  label="Nombre del Cliente"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="Empresa Demo S.A."
                  required
                />
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Estado
                  </label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="ACTIVE">Activo</option>
                    <option value="INACTIVE">Inactivo</option>
                  </select>
                </div>
                
                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    Crear Cliente
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* Client Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card variant="elevated" className="w-full max-w-lg">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detalles del Cliente</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedClient(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-2xl text-white font-bold">
                      {selectedClient.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedClient.name}
                    </h3>
                    <Badge
                      variant={selectedClient.status === 'ACTIVE' ? 'success' : 'default'}
                    >
                      {selectedClient.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-1">
                      Código
                    </label>
                    <p className="text-gray-900 font-semibold">{selectedClient.code}</p>
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-1">
                      ID
                    </label>
                    <p className="text-gray-900 font-mono text-sm">{selectedClient.id}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Link
                      href={`/client-phones?clientId=${selectedClient.id}`}
                      className="btn-primary flex-1 text-center"
                    >
                      Ver Números WhatsApp
                    </Link>
                    <Link
                      href={`/knowledge-base?clientId=${selectedClient.id}`}
                      className="btn-secondary flex-1 text-center"
                    >
                      Ver Knowledge Base
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
