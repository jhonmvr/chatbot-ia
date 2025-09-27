import { ChatCompletionPort } from "../../domain/ports/ChatCompletionPort";
import { EmbeddingPort } from "../../domain/ports/EmbeddingPort";
import { VectorSearchPort } from "../../domain/ports/VectorSearchPort";
import logger from "../../utils/logger";
import { ragRequests, errors } from "../../utils/metrics";
import { redactPII } from "../../utils/pii";

export async function ragChat({
  llm,
  embedder,
  vector,
  userQuery,
  filters,
  onToken,
}: {
  llm: ChatCompletionPort;
  embedder: EmbeddingPort;
  vector: VectorSearchPort;
  userQuery: string;
  filters?: { lang?: string; collection?: string };
  onToken: (t: string) => void;
}) {
  try {
    logger.info('Starting RAG chat', { userQuery, filters });
    const redactedQuery = redactPII(userQuery);
    const [q] = await embedder.embed([redactedQuery]);
    const hits = await vector.search(q, 12, filters);
    const top = hits.slice(0, 6);
    logger.info('Vector search completed', { hitCount: hits.length, topCount: top.length });

    const context = top
      .map((h, i) => `# Chunk ${i + 1} (score=${h.score.toFixed(3)})\n${h.payload?.title ? `Title: ${h.payload.title}\n` : ""}${h.payload?.text ?? ""}`)
      .join("\n\n");
    const redactedContext = redactPII(context);

    const system = `Eres un asistente que responde con base en CONTEXTO. Si no hay respuesta, dilo claro.`;
    const prompt = `CONTEXTO\n${redactedContext}\n\nPREGUNTA\n${redactedQuery}\n\nResponde citando fragmentos (Chunk N).`;

    await llm.streamAnswer({ prompt, system, onToken });
    logger.info('RAG response streamed successfully');
    ragRequests.inc({ status: 'success' });
  } catch (error) {
    errors.inc({ service: 'rag' });
    logger.error('Error in RAG chat', { error: error instanceof Error ? error.message : String(error), userQuery });
    throw error;
  }
}
