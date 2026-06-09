import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { submitTest } from "@/services/progressService";

const RATINGS = [
  { value: 1, emoji: "😢", label: "Muy malo" },
  { value: 2, emoji: "😕", label: "Malo" },
  { value: 3, emoji: "😐", label: "Normal" },
  { value: 4, emoji: "🙂", label: "Bien" },
  { value: 5, emoji: "😄", label: "Excelente" },
];

export default function RatingModal({ isOpen, courseKey, courseTitle, modulo, onClose }) {
  const { session } = useAuth();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setSelected(null);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!mounted) return null;

  const handleSubmit = async () => {
    if (!selected) return;

    const ratingData = {
      userId: session?.user?.id || "unknown",
      userName: session?.user?.name || "unknown",
      userEmail: session?.user?.email || "unknown",
      rating: selected,
      moduleKey: courseKey,
      timestamp: new Date().toISOString(),
    };

    console.log("📊 CALIFICACIÓN ENVIADA:", ratingData);

    // Persist calificationDone on backend
    if (modulo) {
      try {
        await submitTest(modulo, "calificacion");
      } catch (e) {
        console.warn("[RatingModal] backend sync failed:", e);
      }
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-all duration-300"
      style={{ backgroundColor: visible ? "rgba(17,24,39,0.38)" : "rgba(17,24,39,0)" }}
      onClick={onClose}
    >
      <div
        className="rounded-3xl border border-[#1D4789]/20 p-10 shadow-[0_24px_70px_rgba(29,71,137,0.18)] w-full max-w-lg mx-4
                   transition-all duration-300 flex flex-col gap-7"
        style={{
          backgroundColor: "#FFFFFF",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.95) translateY(20px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Título */}
        <h2 className="text-center text-lg font-semibold text-[#1a1a1a] leading-snug">
          ¿Cómo calificarías el módulo de{" "}
          <span className="text-[#1D4789] font-bold">{courseTitle ?? courseKey}</span>?
        </h2>

        {/* Contenedor interior de emojis */}
        <div
          className="rounded-2xl border border-[#1D4789]/20 bg-[#EEEEEE] p-5 flex justify-between items-center"
        >
          {RATINGS.map(({ value, emoji, label }) => {
            const isSelected = selected === value;
            return (
              <button
                key={value}
                onClick={() => setSelected(value)}
                title={label}
                aria-label={`Calificar como ${label}`}
                className={`text-4xl rounded-xl border p-2 transition-all duration-200 ease-out
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4789]/45
                           ${isSelected
                             ? "scale-125 border-[#1D4789] bg-white shadow-[0_8px_24px_rgba(29,71,137,0.22)]"
                             : "border-transparent opacity-60 hover:opacity-100 hover:scale-110 hover:bg-white hover:border-[#1D4789]/25"
                           }`}
              >
                {emoji}
              </button>
            );
          })}
        </div>

        {/* Labels extremos */}
        <div className="flex justify-between px-1 -mt-3">
          <span className="text-sm text-[#1a1a1a]/60">Muy malo</span>
          <span className="text-sm text-[#1a1a1a]/60">Muy bueno</span>
        </div>

        {/* Botón enviar */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!selected}
            className={`px-12 py-2 rounded-full text-sm font-medium border transition-all duration-200
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4789]/45
                       ${selected
                         ? "border-[#1D4789] bg-[#1D4789] text-white hover:bg-[#163672] active:scale-95"
                         : "border-[#1D4789]/20 text-[#1a1a1a]/35 cursor-not-allowed"
                       }`}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
