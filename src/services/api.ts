// Servicios de API para el frontend
// Estos servicios se comunican con el backend a través del proxy de Next.js

import type {
  ApiResponse,
  Client,
  KnowledgeBase,
  Conversation,
  Message,
  ClientPhone,
  LoginResponse,
  CreateClientRequest,
  CreateClientPhoneRequest,
  CreateKnowledgeBaseRequest,
  SearchRequest,
  SearchResponse,
  IngestRequest,
  IngestResponse,
  ChatRequest,
  SystemInfo,
  HealthStatus,
  FullHealthStatus,
} from '../types';

class ApiService {
  private baseUrl = '/api';
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Autenticación
  async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  // Clientes
  async getClients(): Promise<ApiResponse<Client[]>> {
    return this.request('/clients');
  }

  async getClient(id: string): Promise<ApiResponse<Client>> {
    return this.request(`/clients/${id}`);
  }

  async getClientByCode(code: string): Promise<ApiResponse<Client>> {
    return this.request(`/clients/by-code/${code}`);
  }

  async createClient(client: CreateClientRequest): Promise<ApiResponse<Client>> {
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  }

  // Números de WhatsApp
  async getClientPhones(clientId: string): Promise<ApiResponse<ClientPhone[]>> {
    return this.request(`/client-phones/client/${clientId}`);
  }

  async getClientPhone(id: string): Promise<ApiResponse<ClientPhone>> {
    return this.request(`/client-phones/${id}`);
  }

  async createClientPhone(phone: CreateClientPhoneRequest): Promise<ApiResponse<ClientPhone>> {
    return this.request('/client-phones', {
      method: 'POST',
      body: JSON.stringify(phone),
    });
  }

  async deleteClientPhone(id: string): Promise<ApiResponse<void>> {
    return this.request(`/client-phones/${id}`, {
      method: 'DELETE',
    });
  }

  async lookupByProviderSid(providerSid: string, provider: string = 'META'): Promise<ApiResponse<{ client: Client; phone: ClientPhone }>> {
    return this.request(`/client-phones/lookup?providerSid=${providerSid}&provider=${provider}`);
  }

  // Knowledge Base
  async getKnowledgeBase(id: string): Promise<ApiResponse<KnowledgeBase>> {
    return this.request(`/knowledge-base/${id}`);
  }

  async createKnowledgeBase(kb: CreateKnowledgeBaseRequest): Promise<ApiResponse<KnowledgeBase>> {
    return this.request('/knowledge-base', {
      method: 'POST',
      body: JSON.stringify(kb),
    });
  }

  async searchKnowledgeBase(kbId: string, query: string, topK: number = 5): Promise<ApiResponse<SearchResponse>> {
    return this.request(`/knowledge-base/${kbId}/search`, {
      method: 'POST',
      body: JSON.stringify({ query, topK }),
    });
  }

  async ingestDocuments(kbId: string, documents: IngestRequest['documents']): Promise<ApiResponse<IngestResponse>> {
    return this.request(`/knowledge-base/${kbId}/ingest`, {
      method: 'POST',
      body: JSON.stringify({ documents }),
    });
  }

  // Conversaciones
  async getConversation(id: string): Promise<ApiResponse<Conversation>> {
    return this.request(`/conversations/${id}`);
  }

  async closeConversation(id: string): Promise<ApiResponse<void>> {
    return this.request(`/conversations/${id}/close`, {
      method: 'POST',
    });
  }

  // Chat
  async sendMessage(query: string, filters?: any): Promise<ReadableStream<Uint8Array> | null> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ query, filters }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.body;
    } catch (error) {
      console.error('Chat request failed:', error);
      return null;
    }
  }

  // Sistema
  async getInfo(): Promise<ApiResponse<SystemInfo>> {
    return this.request('/info');
  }

  async getHealth(): Promise<ApiResponse<HealthStatus>> {
    return this.request('/health');
  }

  async getHealthFull(): Promise<ApiResponse<FullHealthStatus>> {
    return this.request('/health/full');
  }
}

export const apiService = new ApiService();
