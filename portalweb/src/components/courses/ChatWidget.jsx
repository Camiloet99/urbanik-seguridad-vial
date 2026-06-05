// portalweb/src/components/courses/ChatWidget.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { getChatSession, sendMessageStream } from "@/services/niaService";

const SYSTEM_PROMPT = `Eres NIA, asistente de aprendizaje del módulo de Seguridad Vial. 
Ayudas a los estudiantes con preguntas sobre el contenido del módulo, normas de tránsito, 
seguridad vial en Colombia y orientación sobre la plataforma. 
Sé conciso, claro y amigable. Responde en español.`;

const LS_KEY = "nia-chat-module-v1";
const HERO_VIDEO_SRC = "/videos/nia-video.mp4";
const HERO_POSTER_IMG = "/images/nia-avatar.jpg";

export default function ChatWidget({ locked = false }) {
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      const base = stored ? JSON.parse(stored) : [];
      if (!base.find((m) => m.role === "system")) {
        base.unshift({ role: "system", content: SYSTEM_PROMPT });
      }
      return base;
    } catch {
      return [{ role: "system", content: SYSTEM_PROMPT }];
    }
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const listRef = useRef(null);
  const abortRef = useRef(null);

  const visibleMessages = useMemo(
    () => messages.filter((m) => m.role !== "system"),
    [messages]
  );

  const hasMessages = visibleMessages.length > 0;

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const canSend = input.trim().length > 0 && !loading && !locked;

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading || locked) return;

    setInput("");
    setLoading(true);
    setThinking(true);

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);

    const chatSession = await getChatSession(next);
    setMessages((prev) => [...prev, { role: "model", content: "" }]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      for await (const delta of sendMessageStream(chatSession, text, controller.signal)) {
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
      if (!controller.signal.aborted) {
        setMessages((prev) => {
          const cloned = [...prev];
          const last = cloned[cloned.length - 1];
          if (last?.role === "model" && !last.content) {
            cloned[cloned.length - 1] = {
              role: "model",
              content: "Ocurrió un error. Intenta de nuevo.",
            };
          }
          return cloned;
        });
      }
    } finally {
      setThinking(false);
      setLoading(false);
      abortRef.current = null;
    }
  };

  const clearChat = () => {
    abortRef.current?.abort();
    const base = [{ role: "system", content: SYSTEM_PROMPT }];
    setMessages(base);
    setInput("");
    try { localStorage.setItem(LS_KEY, JSON.stringify(base)); } catch {}
  };

  return (
    <div className="rounded-[28px] bg-[#EEEEEE] border border-[#1D4789] p-5 flex flex-col h-full min-h-[320px]">
      {/* Header con video de NIA */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar con video */}
          <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-[#1D4789]/40 shrink-0">
            <video
              src={HERO_VIDEO_SRC}
              poster={HERO_POSTER_IMG}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />

          </div>
          <div>
            <p className="text-[#1a1a1a] font-medium text-sm leading-tight">Pregúntale a NIA</p>
            <p className="text-[#1a1a1a] text-xs">Asistente del módulo</p>
          </div>
        </div>

        {hasMessages && (
          <button
            onClick={clearChat}
            className="text-[#1a1a1a] hover:text-[#1D4789] transition text-xs px-2 py-1 rounded-lg hover:bg-[#1D4789]/5"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Messages area */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4"
        style={{ maxHeight: "220px", minHeight: "100px" }}
      >
        {!hasMessages ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#1a1a1a] text-sm text-center leading-relaxed">
              {locked
                ? "El chat estará disponible cuando se habilite el módulo."
                : "Haz una pregunta sobre el módulo…"}
            </p>
          </div>
        ) : (
          <>
            {visibleMessages.map((msg, i) => (
              <MiniMessage key={i} role={msg.role} content={msg.content} />
            ))}
            {thinking && <TypingDots />}
          </>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 rounded-[18px] bg-white ring-1 ring-[#1D4789]/25 px-3 py-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              canSend && handleSend();
            }
          }}
          className="flex-1 min-w-0 bg-transparent text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a] focus:outline-none"
          placeholder={locked ? "Módulo bloqueado" : "Escribe tu pregunta…"}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold
                     bg-[#1D4789] hover:bg-[#163672] active:scale-[0.97] transition
                     text-white shadow-sm
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60
                     disabled:cursor-not-allowed"
        >
          {loading ? <SpinnerDot /> : "Enviar"}
        </button>
      </div>
    </div>
  );
}

function MiniMessage({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed",
          isUser
            ? "bg-[#1D4789]/20 border border-[#1D4789]/25 text-[#1a1a1a] rounded-tr-sm"
            : "bg-white border border-[#1D4789]/15 text-[#1a1a1a] rounded-tl-sm",
        ].join(" ")}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-[#1a1a1a]/10 rounded-2xl rounded-tl-sm px-3 py-2">
        <span className="inline-flex items-center gap-1">
          {[0, 120, 240].map((delay) => (
            <span
              key={delay}
              className="h-1.5 w-1.5 rounded-full bg-[#1D4789]/70 animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

function SpinnerDot() {
  return (
    <span className="relative inline-block h-3 w-3">
      <span className="absolute inset-0 animate-ping rounded-full bg-white/80 opacity-75" />
      <span className="relative inline-block h-3 w-3 rounded-full bg-white" />
    </span>
  );
}