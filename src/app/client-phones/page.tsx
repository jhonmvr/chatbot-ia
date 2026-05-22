'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useClientPhones } from '../../hooks';
import { Button, Card, Badge, Alert, Input } from '../../components/ui';

interface ClientPhone {
  id: string;
  clientId: string;
  channel: string;
  e164: string;
  provider: string;
  providerSid: string;
  isActive: boolean;
  isDefault: boolean;
  status: string;
}

export default function ClientPhonesPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<ClientPhone | null>(null);
  const [createForm, setCreateForm] = useState({
    clientId: '',
    channel: 'WHATSAPP',
    e164: '',
    provider: 'META',
    providerSid: '',
    isActive: true,
    isDefault: false
  });
  const [clients, setClients] = useState<any[]>([]);
  
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId');
  
  const { isAuthenticated, isLoading } = useAuth();
  const { phones, isLoading: phonesLoading, error, createPhone, deletePhone } = useClientPhones(clientId || '');
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (clientId) {
      setCreateForm(prev => ({ ...prev, clientId }));
    }
    
    fetchClients();
  }, [isAuthenticated, isLoading, router, clientId]);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const clientsData = await response.json();
        setClients(clientsData);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const handleCreatePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createPhone(createForm);
    if (result.success) {
      setShowCreateForm(false);
      setCreateForm({
        clientId: clientId || '',
        channel: 'WHATSAPP',
        e164: '',
        provider: 'META',
        providerSid: '',
        isActive: true,
        isDefault: false
      });
    } else {
      alert(result.error || 'Error al crear número');
    }
  };

  const handleDeletePhone = async (phoneId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este número? Esta acción no se puede deshacer.')) {
      const result = await deletePhone(phoneId);
      if (!result.success) {
        alert(result.error || 'Error al eliminar número');
      }
    }
  };

  const handleViewPhone = async (phoneId: string) => {
    try {
      const response = await fetch(`/api/client-phones/${phoneId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const phone = await response.json();
        setSelectedPhone(phone);
      } else {
        alert('Error al cargar los detalles del número');
      }
    } catch (err) {
      alert('Error al cargar los detalles del número');
      console.error('Error fetching phone details:', err);
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente desconocido';
  };

  if (isLoading || phonesLoading) {
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
          <p style={{ marginTop: '1rem', color: '#4a5568', fontSize: '1.125rem', fontWeight: '500' }}>Cargando números...</p>
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
              <span style={{ fontSize: '1.25rem' }}>📱</span>
            </div>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#1a202c',
            }}>Números WhatsApp</h1>
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
      
      {/* Header */}
      <header className="enterprise-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="enterprise-logo">
              <div className="enterprise-logo-icon">
                <span className="text-xl">📱</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Números de WhatsApp</h1>
                <p className="text-sm text-white/70">
                  {clientId ? `Números de ${getClientName(clientId)}` : 'Gestión de números de WhatsApp'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="primary"
                onClick={() => setShowCreateForm(true)}
              >
                + Registrar Número
              </Button>
              <Link
                href="/clients"
                className="btn-enterprise-secondary text-white border-white/30 hover:bg-white/10"
              >
                ← Clientes
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card variant="elevated" className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">📱</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{phones.length}</div>
                <div className="text-gray-600 text-sm">Total Números</div>
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">✅</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {phones.filter(p => p.isActive).length}
                </div>
                <div className="text-gray-600 text-sm">Activos</div>
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">⭐</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {phones.filter(p => p.isDefault).length}
                </div>
                <div className="text-gray-600 text-sm">Por Defecto</div>
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">🏢</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {new Set(phones.map(p => p.clientId)).size}
                </div>
                <div className="text-gray-600 text-sm">Clientes</div>
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

        {/* Phones List */}
        <Card variant="elevated" className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Lista de Números</h2>
            <p className="text-gray-600 text-sm">
              {clientId 
                ? `Números de WhatsApp para ${getClientName(clientId)}`
                : 'Todos los números de WhatsApp registrados'
              }
            </p>
          </div>
          
          <div className="p-6">
            {phones.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📱</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  No hay números registrados
                </h3>
                <p className="text-gray-600 mb-6">
                  {clientId 
                    ? 'Este cliente no tiene números de WhatsApp registrados'
                    : 'No hay números de WhatsApp registrados en el sistema'
                  }
                </p>
                <Button
                  variant="primary"
                  onClick={() => setShowCreateForm(true)}
                >
                  Registrar Primer Número
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {phones.map((phone) => (
                  <Card
                    key={phone.id}
                    variant="outlined"
                    className="p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-6">
                          <span className="text-2xl">📱</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {phone.e164}
                          </h3>
                          <div className="space-y-1">
                            <p className="text-gray-600">
                              <span className="font-medium">Cliente:</span> {getClientName(phone.clientId)}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Proveedor:</span> {phone.provider}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Provider SID:</span> {phone.providerSid}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-2">
                          <Badge
                            variant={phone.isActive ? 'success' : 'default'}
                          >
                            {phone.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                          {phone.isDefault && (
                            <Badge variant="info" size="sm">
                              Por Defecto
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewPhone(phone.id)}
                          >
                            Ver Detalles
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeletePhone(phone.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>
      </main>

      {/* Create Phone Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card variant="elevated" className="w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Registrar Nuevo Número</h2>
              
              <form onSubmit={handleCreatePhone} className="space-y-4">
                {!clientId && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Cliente
                    </label>
                    <select
                      value={createForm.clientId}
                      onChange={(e) => setCreateForm({ ...createForm, clientId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">Seleccionar cliente</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.name} ({client.code})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <Input
                  label="Número E164"
                  value={createForm.e164}
                  onChange={(e) => setCreateForm({ ...createForm, e164: e.target.value })}
                  placeholder="+593987654321"
                  required
                />
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Proveedor
                  </label>
                  <select
                    value={createForm.provider}
                    onChange={(e) => setCreateForm({ ...createForm, provider: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="META">Meta (WhatsApp Business)</option>
                    <option value="TWILIO">Twilio</option>
                  </select>
                </div>
                
                <Input
                  label="Provider SID"
                  value={createForm.providerSid}
                  onChange={(e) => setCreateForm({ ...createForm, providerSid: e.target.value })}
                  placeholder="123456789012345"
                  required
                />
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createForm.isActive}
                      onChange={(e) => setCreateForm({ ...createForm, isActive: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Número activo</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createForm.isDefault}
                      onChange={(e) => setCreateForm({ ...createForm, isDefault: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Número por defecto</span>
                  </label>
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
                    Registrar Número
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* Phone Details Modal */}
      {selectedPhone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card variant="elevated" className="w-full max-w-lg">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detalles del Número</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPhone(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedPhone.e164}
                    </h3>
                    <div className="flex gap-2">
                      <Badge
                        variant={selectedPhone.isActive ? 'success' : 'default'}
                      >
                        {selectedPhone.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                      {selectedPhone.isDefault && (
                        <Badge variant="info">Por Defecto</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-1">
                      Cliente
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {getClientName(selectedPhone.clientId)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-1">
                      Canal
                    </label>
                    <p className="text-gray-900 font-semibold">{selectedPhone.channel}</p>
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-1">
                      Proveedor
                    </label>
                    <p className="text-gray-900 font-semibold">{selectedPhone.provider}</p>
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-1">
                      Provider SID
                    </label>
                    <p className="text-gray-900 font-mono text-sm">{selectedPhone.providerSid}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Button
                      variant="danger"
                      onClick={() => {
                        setSelectedPhone(null);
                        handleDeletePhone(selectedPhone.id);
                      }}
                      className="flex-1"
                    >
                      Eliminar Número
                    </Button>
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
