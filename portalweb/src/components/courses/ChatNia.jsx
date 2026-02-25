// portalweb/src/components/courses/ChatNia.jsx
export default function ChatNia({ locked = false }) {
  return (
    <div className="rounded-[28px] bg-white/[0.06] ring-1 ring-white/20 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-white/10 ring-2 ring-white/30" />
        <div>
          <p className="text-white font-medium">Pregúntale a NIA</p>
          <p className="text-white/70 text-xs">Asistente del módulo</p>
        </div>
      </div>

      {/* Caja de mensaje / placeholder */}
      <div className="mt-4 rounded-[18px] bg-white/[0.03] ring-1 ring-white/20 p-4 text-white/70 text-sm min-h-[120px]">
        Aquí irá el chat embebido (luego conectamos el componente real).
      </div>

      {/* Input + botón */}
      <div className="mt-4 flex items-center gap-3 rounded-[22px] bg-white/[0.03] ring-1 ring-white/20 px-3 py-2">
        <input
          className="flex-1 bg-transparent text-sm text-white/90 placeholder:text-white/50 focus:outline-none"
          placeholder="Chat Nia"
          disabled={locked}
        />

        <button
          className="rounded-full px-5 py-2 text-sm font-semibold
                     bg-[#5FA9FF] hover:bg-[#4E9BFF] active:scale-[0.98] transition
                     text-white shadow-sm
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60
                     disabled:opacity-50"
          disabled={locked}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}