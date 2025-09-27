import { NextRequest } from "next/server";
import { VercelAIEmbedding } from "../../../infrastructure/embeddings/VercelAIEmbedding";
import { QdrantVectorSearch } from "../../../infrastructure/vector/QdrantVectorSearch";
import { VercelAIChat } from "../../../infrastructure/llm/VercelAIChat";
import { ragChat } from "../../../application/chat/ragChat";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { query, filters } = await req.json();
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start: async (controller) => {
      try {
        const embedder = new VercelAIEmbedding();
        const vector = new QdrantVectorSearch(embedder.dimension());
        const llm = new VercelAIChat();
        await ragChat({
          llm,
          embedder,
          vector,
          userQuery: query,
          filters,
          onToken: (t) => controller.enqueue(encoder.encode(t)),
        });
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });
  return new Response(stream);
}
