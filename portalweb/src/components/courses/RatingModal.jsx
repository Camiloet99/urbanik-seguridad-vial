import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const RATINGS = [
  { value: 1, emoji: "😢", label: "Muy malo" },
  { value: 2, emoji: "😕", label: "Malo" },
  { value: 3, emoji: "😐", label: "Normal" },
  { value: 4, emoji: "🙂", label: "Bien" },
  { value: 5, emoji: "😄", label: "Excelente" },
];

export default function RatingModal({ isOpen, courseKey, courseTitle, onClose }) {
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

  const handleSubmit = () => {
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
    console.log("Usuario:", ratingData.userName);
    console.log("Email:", ratingData.userEmail);
    console.log("Calificación:", ratingData.rating);
    console.log("Módulo:", ratingData.moduleKey);

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-all duration-300"
      style={{ backgroundColor: visible ? "rgba(0,0,0,0.60)" : "rgba(0,0,0,0)" }}
      onClick={onClose}
    >
      <div
        className="rounded-3xl p-10 ring-1 ring-white/10 shadow-2xl w-full max-w-lg mx-4
                   transition-all duration-300 flex flex-col gap-7"
        style={{
          backgroundColor: "#36393e",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.95) translateY(20px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Título */}
        <h2 className="text-center text-lg font-semibold text-white/90 leading-snug">
          ¿Cómo calificarías el módulo de{" "}
          <span className="text-white font-bold">{courseTitle ?? courseKey}</span>?
        </h2>

        {/* Contenedor interior de emojis */}
        <div
          className="rounded-2xl p-5 ring-1 ring-white/10 flex justify-between items-center"
          style={{ backgroundColor: "#2b2e33" }}
        >
          {RATINGS.map(({ value, emoji, label }) => {
            const isSelected = selected === value;
            return (
              <button
                key={value}
                onClick={() => setSelected(value)}
                title={label}
                aria-label={`Calificar como ${label}`}
                className={`text-4xl rounded-xl p-2 transition-all duration-200 ease-out
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                           ${isSelected
                             ? "scale-125 drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]"
                             : "opacity-50 hover:opacity-100 hover:scale-110"
                           }`}
              >
                {emoji}
              </button>
            );
          })}
        </div>

        {/* Labels extremos */}
        <div className="flex justify-between px-1 -mt-3">
          <span className="text-sm text-white/60">Muy malo</span>
          <span className="text-sm text-white/60">Muy bueno</span>
        </div>

        {/* Botón enviar */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!selected}
            className={`px-12 py-2 rounded-full text-sm font-medium border transition-all duration-200
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C9FFF]/60
                       ${selected
                         ? "border-[#6C9FFF] text-[#6C9FFF] hover:bg-[#6C9FFF]/10 active:scale-95"
                         : "border-white/20 text-white/30 cursor-not-allowed"
                       }`}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
