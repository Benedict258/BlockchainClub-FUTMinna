import { parseWhatsAppMessage, processMessage } from "./bot";

const EMPTY_TWIML = `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;

export async function handleWhatsAppWebhook(
  requestBody: Record<string, string>,
): Promise<{ twiml: string; status: number }> {
  try {
    const msg = parseWhatsAppMessage(requestBody);

    if (msg.from && msg.body) {
      await processMessage(msg);
    }

    return { twiml: EMPTY_TWIML, status: 200 };
  } catch (error: any) {
    console.error("WhatsApp webhook error:", error.message);
    return { twiml: EMPTY_TWIML, status: 200 };
  }
}
