'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function IngestPage() {
  const [form, setForm] = useState({
    sourceUri: '',
    title: '',
    lang: '',
    collection: '',
    text: '',
    version: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert('Documento procesado exitosamente');
        setForm({
          sourceUri: '',
          title: '',
          lang: '',
          collection: '',
          text: '',
          version: '',
        });
      } else {
        alert('Error al procesar el documento');
      }
    } catch (error) {
      alert('Error al procesar el documento');
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">📤</span>
              </div>
              <h1 className="text-4xl font-bold text-white">Ingesta de Contenido</h1>
            </div>
            <Link 
              href="/" 
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-105"
            >
              ← Volver al Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-white/5 px-8 py-6 border-b border-white/20">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📤</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Subir Nuevo Documento</h2>
              <p className="text-white/70">Procesa y almacena documentos para el sistema RAG</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-3 text-lg">
                    URI de Origen
                  </label>
                  <input
                    type="text"
                    name="sourceUri"
                    value={form.sourceUri}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="https://ejemplo.com/documento.pdf"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-3 text-lg">
                    Título del Documento
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="Mi Documento Importante"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-3 text-lg">
                    Idioma
                  </label>
                  <input
                    type="text"
                    name="lang"
                    value={form.lang}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="es"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-3 text-lg">
                    Colección
                  </label>
                  <input
                    type="text"
                    name="collection"
                    value={form.collection}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="documentos-generales"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-3 text-lg">
                    Versión
                  </label>
                  <input
                    type="text"
                    name="version"
                    value={form.version}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="1.0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-3 text-lg">
                  Contenido del Documento
                </label>
                <textarea
                  name="text"
                  value={form.text}
                  onChange={handleChange}
                  rows={12}
                  className="w-full px-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm resize-none"
                  placeholder="Pega aquí el contenido de tu documento..."
                  required
                />
              </div>

              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-12 py-4 text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Procesando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">📤</span>
                      Procesar Documento
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}