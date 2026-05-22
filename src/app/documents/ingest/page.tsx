'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useKnowledgeBase } from '../../../hooks';
import { Button, Card, Badge, Alert, Input } from '../../../components/ui';

interface IngestDocument {
  content: string;
  source?: string;
  category?: string;
}

export default function DocumentIngestPage() {
  const [documents, setDocuments] = useState<IngestDocument[]>([]);
  const [currentDocument, setCurrentDocument] = useState<IngestDocument>({
    content: '',
    source: '',
    category: ''
  });
  const [selectedKB, setSelectedKB] = useState<any>(null);
  const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestResult, setIngestResult] = useState<any>(null);
  
  const searchParams = useSearchParams();
  const kbId = searchParams.get('kbId');
  
  const { isAuthenticated, isLoading } = useAuth();
  const { ingestDocuments, isLoading: kbLoading, error } = useKnowledgeBase(kbId || '');
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (kbId) {
      fetchKnowledgeBaseDetails(kbId);
    }
    
    fetchKnowledgeBases();
  }, [isAuthenticated, isLoading, router, kbId]);

  const fetchKnowledgeBases = async () => {
    try {
      // Simulamos la obtención de Knowledge Bases
      const mockKBs = [
        { id: 'kb-1', name: 'Productos y Servicios', clientId: 'client-1' },
        { id: 'kb-2', name: 'FAQ General', clientId: 'client-1' },
        { id: 'kb-3', name: 'Soporte Técnico', clientId: 'client-2' }
      ];
      setKnowledgeBases(mockKBs);
    } catch (err) {
      console.error('Error fetching knowledge bases:', err);
    }
  };

  const fetchKnowledgeBaseDetails = async (kbId: string) => {
    try {
      const response = await fetch(`/api/knowledge-base/${kbId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const kb = await response.json();
        setSelectedKB(kb);
      }
    } catch (err) {
      console.error('Error fetching KB details:', err);
    }
  };

  const addDocument = () => {
    if (currentDocument.content.trim()) {
      setDocuments([...documents, { ...currentDocument }]);
      setCurrentDocument({ content: '', source: '', category: '' });
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const ingestAllDocuments = async () => {
    if (documents.length === 0) {
      alert('Agrega al menos un documento para ingestar');
      return;
    }

    if (!kbId) {
      alert('Selecciona un Knowledge Base');
      return;
    }

    try {
      setIsIngesting(true);
      const result = await ingestDocuments(documents);
      
      if (result.success) {
        setIngestResult(result.data);
        setDocuments([]);
        alert(`Documentos ingestados exitosamente: ${result.data.count} documentos`);
      } else {
        alert(result.error || 'Error al ingestar documentos');
      }
    } catch (err) {
      alert('Error al ingestar documentos');
      console.error('Error ingesting documents:', err);
    } finally {
      setIsIngesting(false);
    }
  };

  const clearAll = () => {
    setDocuments([]);
    setIngestResult(null);
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
          <p style={{ marginTop: '1rem', color: '#4a5568', fontSize: '1.125rem', fontWeight: '500' }}>Cargando...</p>
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
              <span style={{ fontSize: '1.25rem' }}>📤</span>
            </div>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#1a202c',
            }}>Ingesta de Documentos</h1>
          </div>
          <a href="/knowledge-base" style={{
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '600',
            borderRadius: '8px',
            textDecoration: 'none',
            cursor: 'pointer',
          }}>
            ← Knowledge Base
          </a>
        </div>
      </header>
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="enterprise-logo">
              <div className="enterprise-logo-icon">
                <span className="text-xl">📤</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Ingesta de Documentos</h1>
                <p className="text-sm text-white/70">
                  {selectedKB ? `Ingestar documentos en: ${selectedKB.name}` : 'Agrega documentos a las bases de conocimiento'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/knowledge-base"
                className="btn-enterprise-secondary text-white border-white/30 hover:bg-white/10"
              >
                ← Knowledge Base
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
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">📄</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{documents.length}</div>
                <div className="text-gray-600 text-sm">Documentos Listos</div>
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
                  {ingestResult?.count || 0}
                </div>
                <div className="text-gray-600 text-sm">Última Ingesta</div>
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">🧠</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{knowledgeBases.length}</div>
                <div className="text-gray-600 text-sm">Knowledge Bases</div>
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {documents.reduce((acc, doc) => acc + doc.content.length, 0)}
                </div>
                <div className="text-gray-600 text-sm">Caracteres</div>
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

        {/* Knowledge Base Selection */}
        {!kbId && (
          <Card variant="elevated" className="mb-8">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Seleccionar Knowledge Base</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {knowledgeBases.map((kb) => (
                  <Card
                    key={kb.id}
                    variant="outlined"
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/documents/ingest?kbId=${kb.id}`)}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-xl">🧠</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{kb.name}</h3>
                        <p className="text-gray-600 text-sm">ID: {kb.id}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Document Form */}
        <Card variant="elevated" className="mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Agregar Documento</h2>
            <p className="text-gray-600 text-sm">Agrega contenido a la base de conocimiento</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Contenido del Documento *
                </label>
                <textarea
                  value={currentDocument.content}
                  onChange={(e) => setCurrentDocument({ ...currentDocument, content: e.target.value })}
                  placeholder="Escribe el contenido del documento aquí..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={6}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Fuente (opcional)"
                  value={currentDocument.source || ''}
                  onChange={(e) => setCurrentDocument({ ...currentDocument, source: e.target.value })}
                  placeholder="Manual de Usuario, FAQ, etc."
                />
                
                <Input
                  label="Categoría (opcional)"
                  value={currentDocument.category || ''}
                  onChange={(e) => setCurrentDocument({ ...currentDocument, category: e.target.value })}
                  placeholder="productos, soporte, ventas, etc."
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  onClick={addDocument}
                  disabled={!currentDocument.content.trim()}
                >
                  + Agregar Documento
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Documents List */}
        {documents.length > 0 && (
          <Card variant="elevated" className="mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Documentos Listos para Ingestar</h2>
                  <p className="text-gray-600 text-sm">{documents.length} documentos preparados</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={clearAll}
                  >
                    Limpiar Todo
                  </Button>
                  <Button
                    variant="primary"
                    onClick={ingestAllDocuments}
                    disabled={isIngesting}
                  >
                    {isIngesting ? 'Ingestando...' : 'Ingestar Todos'}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <Card key={index} variant="outlined" className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="info" size="sm">
                            {index + 1}
                          </Badge>
                          {doc.source && (
                            <Badge variant="secondary" size="sm">
                              {doc.source}
                            </Badge>
                          )}
                          {doc.category && (
                            <Badge variant="default" size="sm">
                              {doc.category}
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-700 line-clamp-3">
                          {doc.content}
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                          {doc.content.length} caracteres
                        </p>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeDocument(index)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Ingest Result */}
        {ingestResult && (
          <Card variant="elevated">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Resultado de la Ingesta</h2>
              <p className="text-gray-600 text-sm">Documentos procesados exitosamente</p>
            </div>
            
            <div className="p-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-6">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Ingesta Completada
                  </h3>
                  <p className="text-gray-600">
                    {ingestResult.message} • {ingestResult.count} documentos procesados
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card variant="outlined" className="mt-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Instrucciones</h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-3">
                <span className="text-primary-500 font-bold">1.</span>
                <p>Escribe el contenido del documento en el área de texto</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary-500 font-bold">2.</span>
                <p>Opcionalmente agrega una fuente y categoría para mejor organización</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary-500 font-bold">3.</span>
                <p>Haz clic en "Agregar Documento" para añadirlo a la lista</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary-500 font-bold">4.</span>
                <p>Repite el proceso para agregar más documentos</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary-500 font-bold">5.</span>
                <p>Haz clic en "Ingestar Todos" para procesar todos los documentos</p>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
