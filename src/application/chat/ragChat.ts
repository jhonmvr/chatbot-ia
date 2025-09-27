import { ChatCompletionPort } from "../../domain/ports/ChatCompletionPort";
import { EmbeddingPort } from "../../domain/ports/EmbeddingPort";
import { VectorSearchPort } from "../../domain/ports/VectorSearchPort";

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
  const [q] = await embedder.embed([userQuery]);
  const hits = await vector.search(q, 12, filters);
  const top = hits.slice(0, 6);

  const context = top
    .map((h, i) => `# Chunk ${i + 1} (score=${h.score.toFixed(3)})\n${h.payload?.title ? `Title: ${h.payload.title}\n` : ""}${h.payload?.text ?? ""}`)
    .join("\n\n");

  const system = `Eres un asistente que responde con base en CONTEXTO. Si no hay respuesta, dilo claro.`;
  const prompt = `CONTEXTO\n${context}\n\nPREGUNTA\n${userQuery}\n\nResponde citando fragmentos (Chunk N).`;

  await llm.streamAnswer({ prompt, system, onToken });
}
