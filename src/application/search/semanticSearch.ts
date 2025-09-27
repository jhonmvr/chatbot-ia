import { EmbeddingPort } from "../../domain/ports/EmbeddingPort";
import { VectorSearchPort } from "../../domain/ports/VectorSearchPort";

export async function semanticSearch({
  embedder,
  vector,
  query,
  k = 8,
  filters,
}: {
  embedder: EmbeddingPort;
  vector: VectorSearchPort;
  query: string;
  k?: number;
  filters?: { lang?: string; collection?: string };
}) {
  const [q] = await embedder.embed([query]);
  return await vector.search(q, k, filters);
}
