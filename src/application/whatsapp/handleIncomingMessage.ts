import { WhatsAppClient } from "../../infrastructure/whatsapp/WhatsAppClient";
import { ragChat } from "../chat/ragChat";
import { VercelAIEmbedding } from "../../infrastructure/embeddings/VercelAIEmbedding";
import { QdrantVectorSearch } from "../../infrastructure/vector/QdrantVectorSearch";
import { VercelAIChat } from "../../infrastructure/llm/VercelAIChat";
import logger from "../../utils/logger";
import { whatsappMessages, errors } from "../../utils/metrics";

export async function handleIncomingMessage({ from, text }: { from: string; text: string }) {
  try {
    logger.info('Incoming WhatsApp message', { from, textLength: text.length });
    const wa = new WhatsAppClient({ token: process.env.WHATSAPP_TOKEN!, phoneNumberId: process.env.WHATSAPP_PHONE_ID! });
    const embedder = new VercelAIEmbedding();
    const vector = new QdrantVectorSearch(embedder.dimension());
    const llm = new VercelAIChat();

    let answer = "";
    await ragChat({ llm, embedder, vector, userQuery: text, onToken: (t) => (answer += t) });

    await wa.sendText(from, answer || "No encontré información suficiente para responder.");
    logger.info('WhatsApp response sent', { from, answerLength: answer.length });
    whatsappMessages.inc({ status: 'success' });
  } catch (error) {
    errors.inc({ service: 'whatsapp' });
    logger.error('Error handling WhatsApp message', { error: error instanceof Error ? error.message : String(error), from });
    throw error;
  }
}
