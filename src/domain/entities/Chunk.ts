export interface ChunkEntity {
  id: string;
  docId: string;
  index: number;
  text: string;
  tokens?: number;
}
