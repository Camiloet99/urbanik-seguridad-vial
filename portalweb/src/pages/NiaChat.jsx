// src/pages/NiaChat.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { getChatSession, sendMessageStream } from "@/services/niaService";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** -------- CONFIG -------- */
const LS_KEY = "nia-chat-history-v1";

// Pasa tus assets acá (puedes importarlos si prefieres):
const HERO_VIDEO_SRC = "/videos/nia-video.mp4"; // ej: "/videos/nia-loop.mp4" (deja vacío para usar imagen)
const HERO_POSTER_IMG = "/images/nia-avatar.jpg"; // imagen fallback / poster



const SYSTEM_PROMPT = `Eres NIA, la Asistente Virtual de Aprendizaje del programa de formación en Seguridad Vial de la ANSV (Agencia Nacional de Seguridad Vial).

# Tu propósito
Acompañas a los participantes del programa en su proceso de aprendizaje sobre seguridad vial, movilidad responsable y normativa de tránsito en Colombia. Orientas con calidez, claridad y precisión, resolviendo dudas sobre los módulos, las normas y los contenidos del curso.

# Módulos del programa
El programa está compuesto por 6 módulos:
1. **Fundamentos de Seguridad Vial** — Sistema vial, actores y responsabilidades.
2. **Movilidad y Seguridad Peatonal** — Derechos y deberes del peatón.
3. **Movilidad Sostenible y Activa** — Ciclistas, movilidad limpia y compartida.
4. **Seguridad Vial para Motociclistas** — Normas, riesgos y buenas prácticas en moto.
5. **Conducción Segura en Automóviles** — Técnicas, normas y responsabilidad al volante.
6. **Vehículos de Carga y Operación Segura** — Normativa y operación de vehículos pesados.

# Evaluaciones
- **Test Inicial:** mide el conocimiento previo al iniciar el módulo.
- **Test de Salida:** evalúa el aprendizaje al finalizar el módulo.
Orientas al usuario sobre cuándo y cómo realizarlos.

# Alcance
Aclara amablemente que:
- Este programa es formativo y no reemplaza la asesoría jurídica ni legal especializada.
- Para trámites oficiales de tránsito, el usuario debe acudir a los canales de la ANSV o el organismo de tránsito correspondiente.

# Tu tono y estilo
- Claro, cercano, profesional y pedagógico.
- Usas ejemplos prácticos del contexto vial colombiano.
- Invitas a reflexionar sobre la responsabilidad en la vía.
- Eres una guía de aprendizaje, no un sistema jurídico.

# Qué puedes hacer
- Explicar conceptos de normativa vial colombiana.
- Resolver dudas sobre los módulos y su contenido.
- Orientar sobre el avance, los tests y los recursos del programa.
- Aclarar señales de tránsito, límites de velocidad, documentos obligatorios y sanciones.
- Guiar hacia soporte técnico cuando sea necesario.

# Soporte Técnico
Si alguien tiene problemas para ingresar o usar la plataforma:
1. Revisar la **Guía rápida / Manual de Usuario**.
2. Si persiste, contactar a ➤ **admin@urbanik-hub.com**

Sé NIA: una guía serena, clara y confiable en el camino hacia una movilidad más segura.`;

const SUGGESTIONS = [
  "¿Cuándo es obligatorio ceder el paso a un peatón en un cruce?",
  "¿Qué sanción aplica por no respetar un paso peatonal o una cebra?",
  "¿Cuál es la diferencia entre señales reglamentarias, preventivas, informativas y transitorias?",
  "¿Qué significa una línea continua vs. una línea discontinua en la vía?",
  "¿Cuál es el límite de velocidad permitido en zona escolar y en zona urbana?",
  "¿Qué documentos son obligatorios para conducir un vehículo en Colombia?",
  "¿En qué casos un ciclista debe ir por la calzada y cuándo por ciclorruta?",
  "Tengo problemas para ingresar, ¿qué puedo hacer?",
  "¿Qué debe hacer un conductor en un siniestro vial según la norma (pasos básicos)?",
  "¿Qué cubre el SOAT en un siniestro y cómo se activa la atención?",
  "¿Cuándo un agente de tránsito puede inmovilizar un vehículo y por qué razones?",

];


/** -------- PAGE -------- */
export default function NiaChat() {
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem(LS_KEY);
    const base = stored ? JSON.parse(stored) : [];
    if (!base.find((m) => m.role === "system")) {
      base.unshift({ role: "system", content: SYSTEM_PROMPT });
    }
    return base;
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [thinking, setThinking] = useState(false);

  const listRef = useRef(null);
  const abortRef = useRef(null);
  const chatRef = useRef(null);
  const hasHistory = messages.some((m) => m.role !== "system");

  useEffect(() => {
    (async () => {
      chatRef.current = await getChatSession(messages);
    })();
  }, []);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
    localStorage.setItem(LS_KEY, JSON.stringify(messages));
  }, [messages]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading]
  );

  const handleSuggestion = (text) => {
    setInput(text);
    setTimeout(() => handleSend(), 0);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    setInput("");
    setErrorMsg("");
    setLoading(true);
    setThinking(true);

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);

    const chatSession = await getChatSession(next);

    const newAssistant = { role: "model", content: "" };
    setMessages((prev) => [...prev, newAssistant]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      for await (const delta of sendMessageStream(
        chatSession,
        text,
        controller.signal
      )) {
        setMessages((prev) => {
          const cloned = [...prev];
          const lastIdx = cloned.length - 1;
          cloned[lastIdx] = {
            ...cloned[lastIdx],
            content: (cloned[lastIdx].content || "") + delta,
          };
          return cloned;
        });
      }
    } catch (err) {
      if (controller.signal.aborted) {
        setErrorMsg("Respuesta detenida.");
      } else {
        const msg =
          err?.status === 429
            ? "Límite de cuota/sesiones alcanzado. Intenta más tarde."
            : err?.message || "Error al generar respuesta.";
        setErrorMsg(msg);
        setMessages((prev) => {
          const cloned = [...prev];
          const last = cloned[cloned.length - 1];
          if (last?.role === "model" && !last.content) {
            cloned[cloned.length - 1] = {
              role: "model",
              content: "[Hubo un error generando la respuesta]",
            };
          }
          return cloned;
        });
      }
    } finally {
      setThinking(false);
      setLoading(false);
      abortRef.current = null;
      chatRef.current = await getChatSession([
        ...next,
        ...messages.slice(next.length),
      ]);
    }
  };

  const stop = () => abortRef.current?.abort();

  const clearChat = () => {
    abortRef.current?.abort();
    const base = [{ role: "system", content: SYSTEM_PROMPT }];
    setMessages(base);
    setInput("");
    setErrorMsg("");
    chatRef.current = getChatSession(base);
    localStorage.setItem(LS_KEY, JSON.stringify(base));
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)]">
      {/* BG — mismo lenguaje visual del sitio */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[#0b1220]"
      />
      {/* halos azules/lilas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 mix-blend-screen opacity-70"
        style={{
          background:
            "radial-gradient(1000px 600px at 85% -10%, rgba(56,189,248,.18), transparent 60%), radial-gradient(1100px 700px at 0% 0%, rgba(129,140,248,.15), transparent 60%)",
        }}
      />
      {/* sutil grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* HEADER fino */}
      <header className="sticky top-0 z-20 ">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2">
            {thinking ? (
              <button
                onClick={stop}
                className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-1.5 text-xs text-rose-100 hover:bg-rose-400/20"
              >
                Detener
              </button>
            ) : null}
            <button
              onClick={clearChat}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/90 hover:bg-white/10"
            >
              Limpiar
            </button>
          </div>
        </div>
      </header>

      {/* HERO — avatar/video circular centrado */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="relative mx-auto -mt-2 mb-6 flex w-full items-center justify-center">
          <div className="relative">
            {/* halo grande */}
            <div className="absolute -inset-8 rounded-full bg-sky-400/10 blur-3xl" />
            {/* anillo grande */}
            <div className="relative h-42 w-42 overflow-hidden rounded-full ring-1 ring-white/20 shadow-[0_0_0_8px_rgba(2,6,23,0.7)]">
              {HERO_VIDEO_SRC ? (
                <video
                  src={HERO_VIDEO_SRC}
                  poster={HERO_POSTER_IMG}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={HERO_POSTER_IMG}
                  alt="NIA"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* WRAPPER contenido */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Tarjeta marco del chat (match con tu “frame”) */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-0.5">
          <div className="rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent p-4 sm:p-6">
            {/* Sugerencias vacías */}
            {messages.filter((m) => m.role !== "system").length === 0 ? (
              <div className="mx-auto mt-2 w-full max-w-3xl">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="mb-3 text-sm font-medium text-white/80">
                    Prueba con:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestion(s)}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Mensajes */}
            <main
              ref={listRef}
              className={[
                "overflow-y-auto space-y-4 pr-1 transition-[height] duration-300 ease-out",
                hasHistory
                  ? "h-[52vh] sm:h-[58vh]" // cuando ya hay conversación: más alto
                  : "h-[12vh] sm:h-[16vh]", // vacío: compacto
              ].join(" ")}
            >
              {messages
                .filter((m) => m.role !== "system")
                .map((m, i) => (
                  <MessageBubble key={i} role={m.role} content={m.content} />
                ))}

              {thinking ? <TypingIndicator /> : null}

              {errorMsg ? (
                <div className="mx-auto w-fit rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-100">
                  {errorMsg}
                </div>
              ) : null}
            </main>

            {/* Composer */}
            <div className="mt-4">
              <div className="mx-auto w-full max-w-3xl">
                <div className="flex items-end gap-2 rounded-2xl border border-white/15 bg-white/[0.06] p-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        canSend && handleSend();
                      }
                    }}
                    rows={1}
                    placeholder="Escribe tu mensaje…"
                    className="min-h-[44px] max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-white placeholder-white/40 outline-none"
                  />

                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={!canSend}
                      onClick={handleSend}
                      className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-400 disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <SpinnerDot />
                          Enviando…
                        </>
                      ) : (
                        <>
                          <SendIcon />
                          Enviar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER sticky leve (opcional; ya hay marco) */}
      <div className="h-3" />
    </div>
  );
}

/* -------------------- UI SUBCOMPONENTES -------------------- */

function MessageBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "flex max-w-[92%] sm:max-w-[80%] items-start gap-3",
          isUser ? "flex-row-reverse" : "flex-row",
        ].join(" ")}
      >
        <Avatar isUser={isUser} />
        <div
          className={[
            "rounded-2xl border px-4 py-3 text-[15px] leading-relaxed shadow-sm",
            isUser
              ? "bg-[linear-gradient(180deg,rgba(14,165,233,0.28),rgba(14,165,233,0.20))] border-sky-400/30 text-sky-50"
              : "bg-white/[0.06] border-white/10 text-white/90",
          ].join(" ")}
        >
          <RichText text={content} />
        </div>
      </div>
    </div>
  );
}

function Avatar({ isUser }) {
  return isUser ? (
    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-500 text-white text-sm font-semibold">
      Tú
    </div>
  ) : (
    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-500/80 text-white text-sm font-semibold">
      N
    </div>
  );
}

/** Indicador “escribiendo…” */
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="ml-11 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white/80">
        <span className="inline-flex items-center gap-2">
          NIA está escribiendo
          <Dots />
        </span>
      </div>
    </div>
  );
}

function Dots() {
  return (
    <span className="inline-flex">
      <span className="mx-0.5 h-1.5 w-1.5 animate-bounce rounded-full bg-white/70 [animation-delay:0ms]" />
      <span className="mx-0.5 h-1.5 w-1.5 animate-bounce rounded-full bg-white/70 [animation-delay:120ms]" />
      <span className="mx-0.5 h-1.5 w-1.5 animate-bounce rounded-full bg-white/70 [animation-delay:240ms]" />
    </span>
  );
}

/** Render bonito de backticks y links */
function RichText({ text }) {
  if (!text) return null;

  return (
    <div className="prose prose-invert prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-base font-semibold mb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-sm font-semibold mb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-sm font-semibold mb-1" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-2 last:mb-0 whitespace-pre-wrap" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />
          ),
          li: ({ node, ...props }) => <li {...props} />,
          strong: ({ node, ...props }) => (
            <strong className="font-semibold" {...props} />
          ),
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          code: ({ node, inline, ...props }) =>
            inline ? (
              <code
                className="rounded bg-black/40 px-1.5 py-0.5 text-[0.9em]"
                {...props}
              />
            ) : (
              <code
                className="block rounded bg-black/40 px-3 py-2 text-[0.9em] overflow-x-auto"
                {...props}
              />
            ),
          a: ({ node, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noreferrer"
              className="text-sky-300 underline decoration-sky-300/50 underline-offset-2 hover:text-sky-200"
            />
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

/* -------------------- ICONOS -------------------- */
function NiaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-sky-300">
      <path
        d="M4 12a8 8 0 1116 0 8 8 0 01-16 0Zm4.5 0a3.5 3.5 0 107 0 3.5 3.5 0 00-7 0Z"
        fill="currentColor"
        opacity="0.35"
      />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="text-white">
      <path d="M3 11l17-8-8 17-1-7-8-2z" fill="currentColor" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="text-white/70">
      <path
        d="M16.5 6.5l-7.8 7.8a3 3 0 104.2 4.2l8-8a5 5 0 10-7.1-7.1l-9.2 9.2"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpinnerDot() {
  return (
    <span className="relative inline-block h-3 w-3">
      <span className="absolute inset-0 animate-ping rounded-full bg-white/80 opacity-75"></span>
      <span className="relative inline-block h-3 w-3 rounded-full bg-white"></span>
    </span>
  );
}
