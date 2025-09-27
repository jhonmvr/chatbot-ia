import { streamText } from "ai";
import OpenAI from "openai";
import { ChatCompletionPort } from "../../domain/ports/ChatCompletionPort";

const CHAT_MODEL = process.env.CHAT_MODEL || "gpt-4o-mini";

export class VercelAIChat implements ChatCompletionPort {
  private client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  async streamAnswer({ prompt, system, onToken }: { prompt: string; system?: string; onToken: (t: string) => void; }) {
    const result = await streamText({
      model: CHAT_MODEL,
      messages: [
        ...(system ? [{ role: "system", content: system as string }] : []),
        { role: "user", content: prompt },
      ],
      client: this.client,
    });
    for await (const delta of result.textStream) onToken(delta);
  }
}
