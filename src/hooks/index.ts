// Hooks personalizados para el frontend
import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type {
  Client,
  KnowledgeBase,
  Conversation,
  ClientPhone,
  CreateClientRequest,
  CreateClientPhoneRequest,
  CreateKnowledgeBaseRequest,
  IngestDocument,
} from '../types';

// Hook para autenticación
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      apiService.setToken(token);
      setIsAuthenticated(true);
      setUser({ token });
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.login(username, password);
      if (response.status === 'success' && response.data?.token) {
        apiService.setToken(response.data.token);
        setIsAuthenticated(true);
        setUser({ token: response.data.token });
        return { success: true };
      }
      return { success: false, error: response.error || 'Error de autenticación' };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiService.clearToken();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
  };
}

// Hook para clientes
export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getClients();
      if (response.status === 'success' && response.data) {
        setClients(response.data);
      } else {
        setError(response.error || 'Error al cargar clientes');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createClient = useCallback(async (clientData: CreateClientRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.createClient(clientData);
      if (response.status === 'success' && response.data) {
        setClients(prev => [...prev, response.data!]);
        return { success: true };
      }
      return { success: false, error: response.error || 'Error al crear cliente' };
    } catch (err) {
      return { success: false, error: 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    isLoading,
    error,
    fetchClients,
    createClient,
  };
}

// Hook para números de WhatsApp
export function useClientPhones(clientId?: string) {
  const [phones, setPhones] = useState<ClientPhone[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPhones = useCallback(async () => {
    if (!clientId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getClientPhones(clientId);
      if (response.status === 'success' && response.data) {
        setPhones(response.data);
      } else {
        setError(response.error || 'Error al cargar números');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  const createPhone = useCallback(async (phoneData: CreateClientPhoneRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.createClientPhone(phoneData);
      if (response.status === 'success' && response.data) {
        setPhones(prev => [...prev, response.data!]);
        return { success: true };
      }
      return { success: false, error: response.error || 'Error al crear número' };
    } catch (err) {
      return { success: false, error: 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePhone = useCallback(async (phoneId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.deleteClientPhone(phoneId);
      if (response.status === 'success') {
        setPhones(prev => prev.filter(p => p.id !== phoneId));
        return { success: true };
      }
      return { success: false, error: response.error || 'Error al eliminar número' };
    } catch (err) {
      return { success: false, error: 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhones();
  }, [fetchPhones]);

  return {
    phones,
    isLoading,
    error,
    fetchPhones,
    createPhone,
    deletePhone,
  };
}

// Hook para Knowledge Base
export function useKnowledgeBase(kbId?: string) {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKnowledgeBase = useCallback(async () => {
    if (!kbId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getKnowledgeBase(kbId);
      if (response.status === 'success' && response.data) {
        setKnowledgeBase(response.data);
      } else {
        setError(response.error || 'Error al cargar Knowledge Base');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  }, [kbId]);

  const createKnowledgeBase = useCallback(async (kbData: CreateKnowledgeBaseRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.createKnowledgeBase(kbData);
      if (response.status === 'success' && response.data) {
        setKnowledgeBase(response.data);
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error || 'Error al crear Knowledge Base' };
    } catch (err) {
      return { success: false, error: 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchKnowledgeBase = useCallback(async (query: string, topK: number = 5) => {
    if (!kbId) return { success: false, error: 'KB ID requerido' };
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.searchKnowledgeBase(kbId, query, topK);
      if (response.status === 'success' && response.data) {
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error || 'Error en la búsqueda' };
    } catch (err) {
      return { success: false, error: 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  }, [kbId]);

  const ingestDocuments = useCallback(async (documents: IngestDocument[]) => {
    if (!kbId) return { success: false, error: 'KB ID requerido' };
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.ingestDocuments(kbId, documents);
      if (response.status === 'success' && response.data) {
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error || 'Error al ingestar documentos' };
    } catch (err) {
      return { success: false, error: 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  }, [kbId]);

  useEffect(() => {
    fetchKnowledgeBase();
  }, [fetchKnowledgeBase]);

  return {
    knowledgeBase,
    isLoading,
    error,
    fetchKnowledgeBase,
    createKnowledgeBase,
    searchKnowledgeBase,
    ingestDocuments,
  };
}

// Hook para conversaciones
export function useConversation(conversationId?: string) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversation = useCallback(async () => {
    if (!conversationId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getConversation(conversationId);
      if (response.status === 'success' && response.data) {
        setConversation(response.data);
      } else {
        setError(response.error || 'Error al cargar conversación');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  const closeConversation = useCallback(async () => {
    if (!conversationId) return { success: false, error: 'ID de conversación requerido' };
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.closeConversation(conversationId);
      if (response.status === 'success') {
        setConversation(prev => prev ? { ...prev, status: 'CLOSED', closedAt: new Date().toISOString() } : null);
        return { success: true };
      }
      return { success: false, error: response.error || 'Error al cerrar conversación' };
    } catch (err) {
      return { success: false, error: 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  return {
    conversation,
    isLoading,
    error,
    fetchConversation,
    closeConversation,
  };
}

// Hook para chat
export function useChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (query: string, filters?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const stream = await apiService.sendMessage(query, filters);
      if (stream) {
        return { success: true, stream };
      }
      return { success: false, error: 'Error al enviar mensaje' };
    } catch (err) {
      return { success: false, error: 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    sendMessage,
  };
}
