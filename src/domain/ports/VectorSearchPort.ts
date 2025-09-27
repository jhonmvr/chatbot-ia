export type VectorFilters = {
  lang?: string;
  collection?: string;
  docIds?: string[];
};

export interface VectorSearchPort {
  upsert(points: Array<{ id: string; vector: number[]; payload: any }>): Promise<void>;
  search(query: number[], k: number, filters?: VectorFilters): Promise<Array<{ id: string; score: number; payload: any }>>;
  ensureCollection(dim: number): Promise<void>;
}
