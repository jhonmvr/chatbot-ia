import { embedMany } from "ai";
import OpenAI from "openai";
import { EmbeddingPort } from "../../domain/ports/EmbeddingPort";

const MODEL = process.env.EMBEDDING_MODEL || "text-embedding-3-large";

export class VercelAIEmbedding implements EmbeddingPort {
  private client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  modelName() { return MODEL; }
  dimension() { return Number(process.env.EMBEDDING_DIM || 3072); }

  async embed(texts: string[]): Promise<number[][]> {
    const { embeddings } = await embedMany({
      model: MODEL,
      input: texts,
      client: this.client,
    });
    return embeddings.map(norm);
  }
}

function norm(v: number[]): number[] {
  const l2 = Math.sqrt(v.reduce((a, b) => a + b * b, 0)) || 1;
  return v.map((x) => x / l2);
}
