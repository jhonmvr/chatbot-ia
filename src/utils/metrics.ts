import { register, collectDefaultMetrics, Counter } from 'prom-client';

// Enable default metrics (CPU, memory, etc.)
collectDefaultMetrics();

// Custom metrics
export const ragRequests = new Counter({
  name: 'rag_requests_total',
  help: 'Total number of RAG chat requests',
  labelNames: ['status'],
});

export const whatsappMessages = new Counter({
  name: 'whatsapp_messages_total',
  help: 'Total number of WhatsApp messages processed',
  labelNames: ['status'],
});

export const errors = new Counter({
  name: 'errors_total',
  help: 'Total number of errors',
  labelNames: ['service'],
});

// Export the register for metrics endpoint
export { register };