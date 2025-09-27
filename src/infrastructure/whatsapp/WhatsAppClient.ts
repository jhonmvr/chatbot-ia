const GRAPH_URL = "https://graph.facebook.com/v19.0";

export class WhatsAppClient {
  constructor(private cfg: { token: string; phoneNumberId: string; }) {}

  async sendText(to: string, body: string) {
    const url = `${GRAPH_URL}/${this.cfg.phoneNumberId}/messages`;
    const r = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.cfg.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    });
    if (!r.ok) throw new Error(await r.text());
  }
}
