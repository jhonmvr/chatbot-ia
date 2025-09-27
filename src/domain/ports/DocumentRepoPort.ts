import { DocumentEntity } from "../entities/Document";
import { ChunkEntity } from "../entities/Chunk";

export interface DocumentRepoPort {
  createDocument(doc: Omit<DocumentEntity, "id">): Promise<DocumentEntity>;
  createChunks(chunks: Omit<ChunkEntity, "id">[]): Promise<ChunkEntity[]>;
  getChunksByDoc(docId: string): Promise<ChunkEntity[]>;
  getDocument(docId: string): Promise<DocumentEntity | null>;
}
