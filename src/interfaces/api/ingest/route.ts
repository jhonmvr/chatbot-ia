import { NextRequest, NextResponse } from "next/server";
import { PgvectorDocumentRepo } from "../../../infrastructure/db/PgvectorDocumentRepo";
import { VercelAIEmbedding } from "../../../infrastructure/embeddings/VercelAIEmbedding";
import { QdrantVectorSearch } from "../../../infrastructure/vector/QdrantVectorSearch";
import { ingestDocument } from "../../../application/ingest/ingestDocument";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sourceUri, title, lang, collection, text, version } = body;

  const repo = new PgvectorDocumentRepo();
  const embedder = new VercelAIEmbedding();
  const vector = new QdrantVectorSearch(embedder.dimension());

  const result = await ingestDocument({ repo, embedder, vector, input: { sourceUri, title, lang, collection, text, version } });
  return NextResponse.json(result);
}
