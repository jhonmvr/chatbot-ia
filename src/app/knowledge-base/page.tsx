'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useKnowledgeBase } from '../../hooks';
import { Button, Card, Badge, Alert, Input } from '../../components/ui';

interface KnowledgeBase {
  id: string;
  clientId: string;
  name: string;
  description?: string;
}

interface SearchResult {
  query: string;
  results: string[];
  count: number;
}

export default function KnowledgeBasePage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [selectedKB, setSelectedKB] = useState<KnowledgeBase | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [createForm, setCreateForm] = useState({
    clientId: '',
    name: '',
    description: ''
  });
  const [searchForm, setSearchForm] = useState({
    query: '',
    topK: 5
  });
  const [clients, setClients] = useState<any[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId');
  
  const { isAuthenticated, isLoading } = useAuth();
  const { knowledgeBase, isLoading: kbLoading, error, createKnowledgeBase, searchKnowledgeBase } = useKnowledgeBase(selectedKB?.id);
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
    fetchKnowledgeBases();
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

  const fetchKnowledgeBases = async () => {
    try {
      // Simulamos la obtención de Knowledge Bases ya que no hay endpoint específico
      // En una implementación real, necesitarías un endpoint como GET /api/knowledge-base
      const mockKBs: KnowledgeBase[] = [
        {
          id: 'kb-1',
          clientId: clientId || 'client-1',
          name: 'Productos y Servicios',
          description: 'Base de conocimiento sobre nuestros productos principales'
        },
        {
          id: 'kb-2',
          clientId: clientId || 'client-1',
          name: 'FAQ General',
          description: 'Preguntas frecuentes y respuestas comunes'
        },
        {
          id: 'kb-3',
          clientId: clientId || 'client-2',
          name: 'Soporte Técnico',
          description: 'Documentación técnica y guías de solución'
        }
      ];
      
      setKnowledgeBases(mockKBs);
    } catch (err) {
      console.error('Error fetching knowledge bases:', err);
    }
  };

  const handleCreateKB = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createKnowledgeBase(createForm);
    if (result.success) {
      setShowCreateForm(false);
      setCreateForm({ clientId: clientId || '', name: '', description: '' });
      fetchKnowledgeBases();
    } else {
      alert(result.error || 'Error al crear Knowledge Base');
    }
  };

  const handleSearchKB = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedKB) {
      alert('Selecciona un Knowledge Base primero');
      return;
    }
    
    const result = await searchKnowledgeBase(searchForm.query, searchForm.topK);
    if (result.success) {
      setSearchResults(result.data);
    } else {
      alert(result.error || 'Error en la búsqueda');
    }
  };

  const handleViewKB = async (kbId: string) => {
    try {
      const response = await fetch(`/api/knowledge-base/${kbId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const kb = await response.json();
        setSelectedKB(kb);
      } else {
        alert('Error al cargar los detalles del Knowledge Base');
      }
    } catch (err) {
      alert('Error al cargar los detalles del Knowledge Base');
      console.error('Error fetching KB details:', err);
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente desconocido';
  };

  if (isLoading || kbLoading) {
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
          <p style={{ marginTop: '1rem', color: '#4a5568', fontSize: '1.125rem', fontWeight: '500' }}>Cargando Knowledge Base...</p>
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
              <span style={{ fontSize: '1.25rem' }}>🧠</span>
            </div>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#1a202c',
            }}>Knowledge Base</h1>
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
                <span className="text-xl">🧠</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Knowledge Base</h1>
                <p className="text-sm text-white/70">
                  {clientId ? `Bases de conocimiento de ${getClientName(clientId)}` : 'Gestión de bases de conocimiento'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                onClick={() => setShowSearchForm(true)}
                disabled={!selectedKB}
              >
                🔍 Buscar
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowCreateForm(true)}
              >
                + Nueva KB
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="elevated" className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">🧠</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{knowledgeBases.length}</div>
                <div className="text-gray-600 text-sm">Total KB</div>
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">📚</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {new Set(knowledgeBases.map(kb => kb.clientId)).size}
                </div>
                <div className="text-gray-600 text-sm">Clientes</div>
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">🔍</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {searchResults?.count || 0}
                </div>
                <div className="text-gray-600 text-sm">Última Búsqueda</div>
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

        {/* Knowledge Bases List */}
        <Card variant="elevated" className="overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Bases de Conocimiento</h2>
            <p className="text-gray-600 text-sm">
              {clientId 
                ? `Knowledge Bases de ${getClientName(clientId)}`
                : 'Todas las bases de conocimiento del sistema'
              }
            </p>
          </div>
          
          <div className="p-6">
            {knowledgeBases.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🧠</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  No hay Knowledge Bases
                </h3>
                <p className="text-gray-600 mb-6">
                  {clientId 
                    ? 'Este cliente no tiene bases de conocimiento'
                    : 'No hay bases de conocimiento en el sistema'
                  }
                </p>
                <Button
                  variant="primary"
                  onClick={() => setShowCreateForm(true)}
                >
                  Crear Primera KB
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {knowledgeBases.map((kb) => (
                  <Card
                    key={kb.id}
                    variant="outlined"
                    className={`p-6 hover:shadow-md transition-shadow cursor-pointer ${
                      selectedKB?.id === kb.id ? 'ring-2 ring-primary-500' : ''
                    }`}
                    onClick={() => handleViewKB(kb.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6">
                          <span className="text-2xl">🧠</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {kb.name}
                          </h3>
                          <div className="space-y-1">
                            <p className="text-gray-600">
                              <span className="font-medium">Cliente:</span> {getClientName(kb.clientId)}
                            </p>
                            {kb.description && (
                              <p className="text-gray-600">
                                <span className="font-medium">Descripción:</span> {kb.description}
                              </p>
                            )}
                            <p className="text-gray-600">
                              <span className="font-medium">ID:</span> {kb.id}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewKB(kb.id);
                          }}
                        >
                          Ver Detalles
                        </Button>
                        <Link
                          href={`/documents?kbId=${kb.id}`}
                          className="btn-primary text-sm"
                        >
                          Gestionar Documentos
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Search Results */}
        {searchResults && (
          <Card variant="elevated" className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Resultados de Búsqueda</h2>
              <p className="text-gray-600 text-sm">
                Consulta: "{searchResults.query}" • {searchResults.count} resultados
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {searchResults.results.map((result, index) => (
                  <Card key={index} variant="outlined" className="p-4">
                    <div className="flex items-start gap-3">
                      <Badge variant="info" size="sm">
                        {index + 1}
                      </Badge>
                      <p className="text-gray-700">{result}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        )}
      </main>

      {/* Create KB Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card variant="elevated" className="w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Crear Knowledge Base</h2>
              
              <form onSubmit={handleCreateKB} className="space-y-4">
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
                  label="Nombre de la KB"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="Productos y Servicios"
                  required
                />
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    placeholder="Base de conocimiento sobre nuestros productos principales"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                  />
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
                    Crear KB
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* Search Modal */}
      {showSearchForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card variant="elevated" className="w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Buscar en Knowledge Base</h2>
              
              <form onSubmit={handleSearchKB} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Knowledge Base
                  </label>
                  <select
                    value={selectedKB?.id || ''}
                    onChange={(e) => {
                      const kb = knowledgeBases.find(k => k.id === e.target.value);
                      setSelectedKB(kb || null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Seleccionar KB</option>
                    {knowledgeBases.map(kb => (
                      <option key={kb.id} value={kb.id}>
                        {kb.name} ({getClientName(kb.clientId)})
                      </option>
                    ))}
                  </select>
                </div>
                
                <Input
                  label="Consulta de búsqueda"
                  value={searchForm.query}
                  onChange={(e) => setSearchForm({ ...searchForm, query: e.target.value })}
                  placeholder="¿Cuál es el horario de atención?"
                  required
                />
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Número de resultados
                  </label>
                  <select
                    value={searchForm.topK}
                    onChange={(e) => setSearchForm({ ...searchForm, topK: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value={3}>3 resultados</option>
                    <option value={5}>5 resultados</option>
                    <option value={10}>10 resultados</option>
                  </select>
                </div>
                
                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowSearchForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    Buscar
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* KB Details Modal */}
      {selectedKB && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card variant="elevated" className="w-full max-w-lg">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detalles de la KB</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedKB(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedKB.name}
                    </h3>
                    <p className="text-gray-600">{selectedKB.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-1">
                      Cliente
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {getClientName(selectedKB.clientId)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-1">
                      ID
                    </label>
                    <p className="text-gray-900 font-mono text-sm">{selectedKB.id}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      onClick={() => {
                        setSelectedKB(null);
                        setShowSearchForm(true);
                      }}
                      className="flex-1"
                    >
                      Buscar en KB
                    </Button>
                    <Link
                      href={`/documents?kbId=${selectedKB.id}`}
                      className="btn-secondary flex-1 text-center"
                    >
                      Gestionar Documentos
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
