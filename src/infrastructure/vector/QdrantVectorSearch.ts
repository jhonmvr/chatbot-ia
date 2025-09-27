import { VectorSearchPort, VectorFilters } from "../../domain/ports/VectorSearchPort";
import { qdrant, COLLECTION } from "./qdrantClient";

export class QdrantVectorSearch implements VectorSearchPort {
  constructor(private dim: number) {}

  async ensureCollection(dim: number): Promise<void> {
    try {
      await qdrant.getCollection(COLLECTION);
    } catch {
      await qdrant.createCollection(COLLECTION, {
        vectors: { size: dim, distance: "Cosine" },
        hnsw_config: { m: 16, ef_construct: 200 },
      });
    }
  }

  async upsert(points: Array<{ id: string; vector: number[]; payload: any }>): Promise<void> {
    await qdrant.upsert(COLLECTION, {
      points: points.map((p) => ({ id: p.id, vector: p.vector, payload: p.payload })),
    });
  }

  async search(query: number[], k: number, filters?: VectorFilters) {
    const must: any[] = [];
    if (filters?.lang) must.push({ key: "lang", match: { value: filters.lang } });
    if (filters?.collection) must.push({ key: "collection", match: { value: filters.collection } });
    if (filters?.docIds?.length) must.push({ key: "doc_id", match: { any: filters.docIds } });

    const res = await qdrant.search(COLLECTION, {
      vector: query,
      limit: k,
      filter: must.length ? { must } : undefined,
      params: { hnsw_ef: 256 },
    });
    return res as Array<{ id: string; score: number; payload: any }>;
  }
}
