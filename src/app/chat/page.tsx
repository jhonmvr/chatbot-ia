'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useChat } from '../../hooks';
import { Button, Card, Alert, Input, Badge } from '../../components/ui';

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  isUser: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [clients, setClients] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { isAuthenticated, isLoading } = useAuth();
  const { sendMessage, isLoading: chatLoading, error } = useChat();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    fetchClients();
    
    // Agregar mensaje de bienvenida
    setMessages([{
      id: 'welcome',
      content: '¡Hola! Soy el asistente de ChatBot IA. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date().toISOString(),
      isUser: false
    }]);
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      timestamp: new Date().toISOString(),
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsStreaming(true);

    try {
      const stream = await sendMessage(inputMessage, filters);
      
      if (stream) {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = '';
        let messageId = (Date.now() + 1).toString();

        // Agregar mensaje vacío del asistente
        setMessages(prev => [...prev, {
          id: messageId,
          content: '',
          timestamp: new Date().toISOString(),
          isUser: false
        }]);

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          const chunk = decoder.decode(value);
          assistantMessage += chunk;
          
          // Actualizar el mensaje del asistente en tiempo real
          setMessages(prev => prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, content: assistantMessage }
              : msg
          ));
        }
      } else {
        // Fallback si no hay stream
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: 'Lo siento, no pude procesar tu mensaje en este momento. Por favor, inténtalo de nuevo.',
          timestamp: new Date().toISOString(),
          isUser: false
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, inténtalo de nuevo.',
        timestamp: new Date().toISOString(),
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      content: '¡Hola! Soy el asistente de ChatBot IA. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date().toISOString(),
      isUser: false
    }]);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
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
          <p style={{ marginTop: '1rem', color: '#4a5568', fontSize: '1.125rem', fontWeight: '500' }}>Cargando chat...</p>
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
              <span style={{ fontSize: '1.25rem' }}>💬</span>
            </div>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#1a202c',
            }}>Chat con IA</h1>
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
                <span className="text-xl">💬</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Chat con IA</h1>
                <p className="text-sm text-white/70">Interactúa con el sistema RAG avanzado</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                onClick={clearChat}
              >
                🗑️ Limpiar Chat
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
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <Card variant="elevated" className="mb-6">
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Filtros de Búsqueda</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Cliente
                </label>
                <select
                  value={selectedClient}
                  onChange={(e) => {
                    setSelectedClient(e.target.value);
                    setFilters({ ...filters, clientId: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Todos los clientes</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.code})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({});
                    setSelectedClient('');
                  }}
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="error" title="Error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Chat Messages */}
        <Card variant="elevated" className="mb-6">
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isUser
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isStreaming && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse">●</div>
                    <div className="animate-pulse">●</div>
                    <div className="animate-pulse">●</div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </Card>

        {/* Input Area */}
        <Card variant="elevated">
          <div className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje aquí..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  rows={3}
                  disabled={isStreaming}
                />
              </div>
              <div className="flex flex-col justify-end">
                <Button
                  variant="primary"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isStreaming}
                  className="px-6 py-3"
                >
                  {isStreaming ? 'Enviando...' : 'Enviar'}
                </Button>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <p>Presiona Enter para enviar, Shift+Enter para nueva línea</p>
              <div className="flex items-center gap-2">
                {selectedClient && (
                  <Badge variant="info" size="sm">
                    Filtrado por cliente
                  </Badge>
                )}
                <span>{messages.length} mensajes</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Tips */}
        <Card variant="outlined" className="mt-6">
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Consejos para mejores resultados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">Preguntas efectivas:</h4>
                <ul className="space-y-1">
                  <li>• Sé específico en tus preguntas</li>
                  <li>• Usa palabras clave relevantes</li>
                  <li>• Haz preguntas directas</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Ejemplos de consultas:</h4>
                <ul className="space-y-1">
                  <li>• "¿Cuál es el horario de atención?"</li>
                  <li>• "¿Cómo puedo contactar soporte?"</li>
                  <li>• "¿Qué productos tienen disponibles?"</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}