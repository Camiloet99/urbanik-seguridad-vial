import { http } from "@/services/http";

// NIA ahora habla con el BACKEND (que a su vez llama a Azure OpenAI con la key
// oculta como secreto). Antes esto usaba el SDK de Gemini con la API key
// incrustada en el navegador, que quedó expuesta y fue suspendida por Google.
//
// Se conserva la misma interfaz (getChatSession + sendMessageStream) para no
// tocar NiaChat.jsx ni ChatWidget.jsx.

// Timeout amplio para la IA (puede tardar en respuestas largas) y sin reintentos
// (reintentar una generación lenta no aporta).
const AI_OPTS = { timeoutMs: 60_000, retries: 0 };
const MAX_TURNS = 16; // system + últimos N turnos, para acotar tokens/costo

export async function getChatSession(history = []) {
  return { messages: Array.isArray(history) ? [...history] : [] };
}

// Mapea el historial local al formato de mensajes de OpenAI.
function toApiMessages(messages) {
  const system = messages.filter((m) => m.role === "system").slice(0, 1);
  const convo = messages.filter((m) => m.role !== "system").slice(-MAX_TURNS);
  return [...system, ...convo].map((m) => ({
    role: m.role === "model" ? "assistant" : m.role,
    content: m.content ?? "",
  }));
}

/**
 * Envía la conversación al backend y entrega la respuesta. El backend responde
 * completa; simulamos el efecto de "escribiendo" entregándola por trozos, para
 * conservar la misma UX que el streaming anterior.
 */
export async function* sendMessageStream(chatSession, _userText, signal) {
  const messages = toApiMessages(chatSession?.messages ?? []);
  const res = await http.post("/gemini", { messages }, AI_OPTS);
  const text = (res && res.response) || "";

  const parts = text.match(/\S+\s*/g) ?? (text ? [text] : []);
  for (const part of parts) {
    if (signal?.aborted) return;
    yield part;
    await new Promise((r) => setTimeout(r, 15));
  }
}
