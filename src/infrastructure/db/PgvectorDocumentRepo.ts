import { prisma } from "./prismaClient";
import { DocumentRepoPort } from "../../domain/ports/DocumentRepoPort";
import { DocumentEntity } from "../../domain/entities/Document";
import { ChunkEntity } from "../../domain/entities/Chunk";

export class PgvectorDocumentRepo implements DocumentRepoPort {
  async createDocument(doc: Omit<DocumentEntity, "id">): Promise<DocumentEntity> {
    const created = await prisma.document.create({ data: doc as any });
    return created as any;
  }
  async createChunks(chunks: Omit<ChunkEntity, "id">[]): Promise<ChunkEntity[]> {
    const created = await prisma.$transaction(
      chunks.map((c) => prisma.chunk.create({ data: c as any }))
    );
    return created as any;
  }
  async getChunksByDoc(docId: string): Promise<ChunkEntity[]> {
    return (await prisma.chunk.findMany({ where: { docId }, orderBy: { index: "asc" } })) as any;
  }
  async getDocument(docId: string): Promise<DocumentEntity | null> {
    return (await prisma.document.findUnique({ where: { id: docId } })) as any;
  }
}
