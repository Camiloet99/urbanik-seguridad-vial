// portalweb/src/components/courses/ChatNia.jsx
export default function ChatNia({ locked = false }) {
  return (
    <div className="rounded-[28px] bg-[#EEEEEE] border border-[#1D4789] p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-[#1D4789]/10 ring-2 ring-[#1D4789]/30" />
        <div>
          <p className="text-[#1a1a1a] font-medium">Pregúntale a NIA </p>
          <p className="text-[#1a1a1a] text-xs">Asistente del módulo</p>
        </div>
      </div>

      {/* Caja de mensaje / placeholder */}
      <div className="mt-4 rounded-[18px] bg-white ring-1 ring-[#1D4789]/20 p-4 text-sm min-h-[120px]"
        style={{ color: "#1a1a1a" }}>
        Haz una pregunta sobre el módulo...
      </div>

      {/* Input + botón */}
      <div className={`mt-4 flex items-center gap-3 rounded-[22px] bg-white ring-1 ring-[#1D4789]/25 px-3 py-2 ${locked ? "pointer-events-none" : ""}`}>
        <input
          className="flex-1 bg-transparent text-sm focus:outline-none"
          style={{ color: "#1a1a1a" }}
          placeholder="Escribe tu pregunta..."
        />

        <button
          type="button"
          className="rounded-full px-5 py-2 text-sm font-semibold
                     bg-[#1D4789] hover:bg-[#163672] active:scale-[0.98] transition
                     text-white shadow-sm
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4789]/60"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}