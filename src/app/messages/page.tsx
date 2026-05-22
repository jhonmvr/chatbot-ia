'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../hooks';
import { Button, Card, Badge, Avatar, Spinner, Alert } from '../../components/ui';

interface Conversation {
  id: string;
  clientId: string;
  contactId: string;
  status: 'OPEN' | 'CLOSED';
  startedAt: string;
  closedAt: string | null;
  messageCount: number;
  messages: Message[];
  clientName?: string;
  contactName?: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface Message {
  id: string;
  direction: 'INBOUND' | 'OUTBOUND';
  content: string;
  createdAt: string;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulamos datos de conversaciones ya que no hay endpoint específico para listar todas
      // En una implementación real, necesitarías un endpoint como GET /api/conversations
      const mockConversations: Conversation[] = [
        {
          id: 'conv-1',
          clientId: 'client-1',
          contactId: 'contact-1',
          status: 'OPEN',
          startedAt: new Date().toISOString(),
          closedAt: null,
          messageCount: 5,
          messages: [],
          clientName: 'Empresa Demo',
          contactName: 'Sarah Johnson',
          lastMessage: 'Hola, tengo una pregunta sobre el producto',
          lastMessageTime: '2 min ago'
        },
        {
          id: 'conv-2',
          clientId: 'client-2',
          contactId: 'contact-2',
          status: 'OPEN',
          startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          closedAt: null,
          messageCount: 3,
          messages: [],
          clientName: 'Empresa Demo',
          contactName: 'David Lee',
          lastMessage: 'Gracias por tu respuesta',
          lastMessageTime: '15 min ago'
        },
        {
          id: 'conv-3',
          clientId: 'client-3',
          contactId: 'contact-3',
          status: 'CLOSED',
          startedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          closedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          messageCount: 8,
          messages: [],
          clientName: 'Empresa Demo',
          contactName: 'Emily Chen',
          lastMessage: 'Perfecto, muchas gracias',
          lastMessageTime: '30 min ago'
        }
      ];
      
      setConversations(mockConversations);
    } catch (err) {
      setError('Error al cargar las conversaciones');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationDetails = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const conversation = await response.json();
        setSelectedConversation(conversation);
      } else {
        setError('Error al cargar los detalles de la conversación');
      }
    } catch (err) {
      setError('Error al cargar los detalles de la conversación');
      console.error('Error fetching conversation details:', err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    try {
      setSendingMessage(true);
      
      // Aquí implementarías el envío del mensaje
      // POST /api/conversations/{id}/messages
      console.log('Sending message:', newMessage);
      
      // Simulamos el envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNewMessage('');
      // Refrescar la conversación
      await fetchConversationDetails(selectedConversation.id);
    } catch (err) {
      setError('Error al enviar el mensaje');
      console.error('Error sending message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const closeConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/close`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        await fetchConversations();
        if (selectedConversation?.id === conversationId) {
          setSelectedConversation(null);
        }
      } else {
        setError('Error al cerrar la conversación');
      }
    } catch (err) {
      setError('Error al cerrar la conversación');
      console.error('Error closing conversation:', err);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} días ago`;
  };

  if (loading || isLoading) {
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
          <p style={{ marginTop: '1rem', color: '#4a5568', fontSize: '1.125rem', fontWeight: '500' }}>Cargando conversaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        padding: '1rem 1.5rem',
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
            <span style={{ fontSize: '1.25rem' }}>📨</span>
          </div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#1a202c',
          }}>Bandeja de Entrada</h1>
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
      </header>
      
      {/* Main Content */}
      <div style={{ display: 'flex', height: 'calc(100vh - 73px)', overflow: 'hidden' }}>
        {/* Sidebar - Lista de conversaciones */}
        <aside className="w-96 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Conversaciones</h2>
              </div>

          <div className="flex-1 overflow-y-auto">
            {error && (
              <div className="p-4">
                <Alert variant="error" title="Error">
                  {error}
                </Alert>
              </div>
            )}
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-start gap-4 ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => fetchConversationDetails(conversation.id)}
                >
                  <div className="relative">
                    <Avatar
                      size="md"
                      fallback={conversation.contactName?.charAt(0) || 'U'}
                    />
                    {/* Badge del canal */}
                    <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-0.5 rounded-full">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">📱</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`font-semibold truncate ${
                        selectedConversation?.id === conversation.id
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {conversation.contactName}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {conversation.lastMessageTime || formatTime(conversation.startedAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {conversation.lastMessage || 'Sin mensajes'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Area - Detalles de conversación */}
        <main className="flex-1 flex flex-col bg-white dark:bg-gray-800/50">
          {selectedConversation ? (
            <>
              {/* Header de conversación */}
              <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar
                      size="md"
                      fallback={selectedConversation.contactName?.charAt(0) || 'U'}
                    />
                    {/* Badge del canal */}
                    <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-0.5 rounded-full">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">📱</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {selectedConversation.contactName}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Online</p>
                  </div>
                </div>
              </header>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {selectedConversation.messages.length > 0 ? (
                  selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-4 ${
                        message.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.direction === 'INBOUND' && (
                        <Avatar
                          size="sm"
                          fallback={selectedConversation.contactName?.charAt(0) || 'U'}
                        />
                      )}
                      <div className={`flex flex-col gap-1 ${
                        message.direction === 'OUTBOUND' ? 'items-end' : 'items-start'
                      }`}>
                        <div className={`rounded-lg p-3 max-w-lg ${
                          message.direction === 'OUTBOUND'
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                      {message.direction === 'OUTBOUND' && (
                        <Avatar
                          size="sm"
                          fallback="T"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">💬</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Sin mensajes aún
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Los mensajes de esta conversación aparecerán aquí
                    </p>
                  </div>
                )}
                            </div>

              {/* Input de mensaje */}
              {selectedConversation.status === 'OPEN' && (
                <footer className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sendingMessage}
                      className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingMessage ? (
                        <Spinner size="sm" />
                      ) : (
                        <svg
                          fill="currentColor"
                          height="20"
                          viewBox="0 0 256 256"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M229.66,28.24a8,8,0,0,0-8.84-1.57l-192,80a8,8,0,0,0,0,14.66l77.41,29,29,77.41a8,8,0,0,0,7.33,7.33,7.91,7.91,0,0,0,2.15,0,8,8,0,0,0,5.18-2.67L231.23,37.08A8,8,0,0,0,229.66,28.24ZM98.42,142.13,44,120.31,216,40Zm69.45,89.45-21.82-58.21L216,40Z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </footer>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <span className="text-6xl">📨</span>
                </div>
                <h3 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Selecciona una conversación
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Elige una conversación de la lista para ver los mensajes
                </p>
              </div>
            </div>
          )}
        </main>
        </div>
    </div>
  );
}