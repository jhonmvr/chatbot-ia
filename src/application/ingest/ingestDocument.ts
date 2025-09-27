import { EmbeddingPort } from "../../domain/ports/EmbeddingPort";
import { VectorSearchPort } from "../../domain/ports/VectorSearchPort";
import { DocumentRepoPort } from "../../domain/ports/DocumentRepoPort";
import { chunkText } from "../../utils/chunking";
import { normalizeLang } from "../../utils/normalize";

export async function ingestDocument({
  repo,
  embedder,
  vector,
  input,
}: {
  repo: DocumentRepoPort;
  embedder: EmbeddingPort;
  vector: VectorSearchPort;
  input: { sourceUri: string; title?: string; lang?: string; collection?: string; text: string; version?: number };
}) {
  const lang = normalizeLang(input.lang);
  const version = input.version ?? 1;

  const doc = await repo.createDocument({
    sourceUri: input.sourceUri,
    title: input.title,
    lang,
    collection: input.collection,
    embeddingModel: embedder.modelName(),
    version,
  } as any);

  const chunks = chunkText(input.text);
  const vectors = await embedder.embed(chunks);

  await repo.createChunks(chunks.map((t, i) => ({ docId: (doc as any).id, index: i, text: t })) as any);

  await vector.ensureCollection(embedder.dimension());
  await vector.upsert(
    vectors.map((v, i) => ({
      id: `${(doc as any).id}:${i}`,
      vector: v,
      payload: { doc_id: (doc as any).id, index: i, lang, collection: input.collection, title: input.title, text: chunks[i] },
    }))
  );

  return { docId: (doc as any).id, chunks: chunks.length };
}
