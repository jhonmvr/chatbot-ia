import { WhatsAppClient } from "../../infrastructure/whatsapp/WhatsAppClient";
import { ragChat } from "../chat/ragChat";
import { VercelAIEmbedding } from "../../infrastructure/embeddings/VercelAIEmbedding";
import { QdrantVectorSearch } from "../../infrastructure/vector/QdrantVectorSearch";
import { VercelAIChat } from "../../infrastructure/llm/VercelAIChat";

export async function handleIncomingMessage({ from, text }: { from: string; text: string }) {
  const wa = new WhatsAppClient({ token: process.env.WHATSAPP_TOKEN!, phoneNumberId: process.env.WHATSAPP_PHONE_ID! });
  const embedder = new VercelAIEmbedding();
  const vector = new QdrantVectorSearch(embedder.dimension());
  const llm = new VercelAIChat();

  let answer = "";
  await ragChat({ llm, embedder, vector, userQuery: text, onToken: (t) => (answer += t) });

  await wa.sendText(from, answer || "No encontré información suficiente para responder.");
}
