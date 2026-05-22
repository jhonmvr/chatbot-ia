// Tipos TypeScript para el frontend
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: string;
}

export interface Client {
  id: string;
  code: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface KnowledgeBase {
  id: string;
  clientId: string;
  name: string;
  description?: string;
}

export interface Conversation {
  id: string;
  clientId: string;
  contactId: string;
  status: 'OPEN' | 'CLOSED';
  startedAt: string;
  closedAt?: string;
  messageCount: number;
  messages: Message[];
}

export interface Message {
  id: string;
  direction: 'INBOUND' | 'OUTBOUND';
  content: string;
  createdAt: string;
}

export interface ClientPhone {
  id: string;
  clientId: string;
  channel: 'WHATSAPP';
  e164: string;
  provider: 'META';
  providerSid: string;
  status: 'ACTIVE' | 'INACTIVE';
  isActive: boolean;
  isDefault: boolean;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  consent: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface CreateClientRequest {
  code: string;
  name: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface CreateClientPhoneRequest {
  clientId: string;
  channel: 'WHATSAPP';
  e164: string;
  provider: 'META';
  providerSid: string;
  isActive?: boolean;
  isDefault?: boolean;
}

export interface CreateKnowledgeBaseRequest {
  clientId: string;
  name: string;
  description?: string;
}

export interface SearchRequest {
  query: string;
  topK?: number;
}

export interface SearchResponse {
  results: string[];
  count: number;
}

export interface IngestDocument {
  content: string;
  source?: string;
  category?: string;
}

export interface IngestRequest {
  documents: IngestDocument[];
}

export interface IngestResponse {
  count: number;
}

export interface ChatRequest {
  query: string;
  filters?: any;
}

export interface SystemInfo {
  name: string;
  version: string;
  description: string;
  whatsappProvider: string;
  aiProvider: string;
  endpoints: {
    webhook: string;
    webhookMeta: string;
    conversations: string;
    knowledgeBase: string;
    health: string;
  };
}

export interface HealthStatus {
  status: 'UP' | 'DOWN';
  timestamp: string;
  application: string;
}

export interface FullHealthStatus extends HealthStatus {
  database: {
    status: 'UP' | 'DOWN';
    driver: string;
    version: string;
  };
  services: {
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
