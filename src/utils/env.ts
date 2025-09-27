export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
  EMBEDDING_MODEL: process.env.EMBEDDING_MODEL || "text-embedding-3-large",
  EMBEDDING_DIM: Number(process.env.EMBEDDING_DIM || 3072),
  QDRANT_URL: process.env.QDRANT_URL || "http://localhost:6333",
  QDRANT_API_KEY: process.env.QDRANT_API_KEY,
  QDRANT_COLLECTION: process.env.QDRANT_COLLECTION || "rag_chunks",
  CHAT_MODEL: process.env.CHAT_MODEL || "gpt-4o-mini",
  WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN!,
  WHATSAPP_PHONE_ID: process.env.WHATSAPP_PHONE_ID!,
  META_APP_SECRET: process.env.META_APP_SECRET!,
};
