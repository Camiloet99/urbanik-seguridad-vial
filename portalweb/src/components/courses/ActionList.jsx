import React, { useMemo } from "react";
import LockedTooltip from "@/components/ui/LockedTooltip";

export default function ActionList({
  progressMap,
  onClick = () => { },
  testInitialDone = false,
  testExitDone = false,
  showRating = false,
  showContacto = false,
  lockedItems = {},
}) {
  const items = useMemo(
    () => [
      { key: "test-inicial", label: "Nivel de riesgo", sublabel: "Personaliza tu Experiencia" },
      { key: "test-salida", label: "Test de salida", sublabel: "Evalúa tus conocimientos" },
      showContacto
        ? { key: "contacto", label: "Contáctanos", sublabel: "Estamos aquí para ayudarte" }
        : {
          key: showRating ? "califica" : "calificacion",
          label: showRating ? "Califica este módulo" : "Calificación",
        },
    ],
    [showRating, showContacto]
  );

  const resolveSrc = (key, completed) => {
    const isCalifica = key === "calificacion" || key === "califica";
    const iconKey = isCalifica
      ? completed ? "calificacion2" : "calificacion"
      : key === "contacto"
        ? "contacto"
        : key;
    const folder = isCalifica ? "nocomplete" : completed ? "complete" : "nocomplete";
    return new URL(
      `../../assets/courses/${folder}/${iconKey}.png`,
      import.meta.url
    ).href;
  };

  const handleKey = (e, key, isDisabled) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!isDisabled) onClick(key);
    }
  };

  return (
    <div
      className="rounded-[20px] bg-white p-4 border border-[#1D4789]/20 shadow-[0_4px_16px_rgba(0,0,0,0.08)] h-full min-h-[260px]"
      aria-label="Acciones"
    >
      <div className="flex flex-col justify-center gap-8 h-full">
        {items.map(({ key, label, sublabel }) => {
          const lockedMsg = lockedItems[key];

          const isCompleted =
            key === "test-inicial"
              ? !!testInitialDone
              : key === "test-salida"
                ? !!testExitDone
                : progressMap.get(key) ?? false;

          const src = resolveSrc(key, isCompleted);

          const isDisabled =
            !!lockedMsg ||
            (key === "test-inicial" && testInitialDone) ||
            (key === "test-salida" && testExitDone);

          const row = (
            <div
              role="button"
              tabIndex={lockedMsg ? -1 : 0}
              onClick={() => !isDisabled && onClick(key)}
              onKeyDown={(e) => handleKey(e, key, isDisabled)}
              className={[
                "group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl px-1",
                "transition-transform duration-150 ease-out focus-visible:outline-none",
                isDisabled
                  ? "cursor-not-allowed"
                  : "cursor-pointer hover:translate-x-[1px]",
              ].join(" ")}
              aria-label={label}
              aria-disabled={isDisabled ? "true" : "false"}
            >
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => { e.stopPropagation(); if (!isDisabled) onClick(key); }}
                className={[
                  "h-12 w-12 grid place-items-center rounded-xl transition-all duration-200 ease-out",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4789]/50",
                  !isDisabled ? "hover:scale-105 active:scale-95 cursor-pointer" : "",
                  isCompleted
                    ? "bg-[#1D4789] shadow-[0_2px_8px_rgba(29,71,137,0.25)]"
                    : "bg-white border border-[#1D4789]",
                ].join(" ")}
                disabled={!!lockedMsg}
                aria-label={label}
              >
                <img
                  src={src}
                  alt=""
                  className="h-7 w-auto object-contain select-none pointer-events-none transition-all duration-200 ease-out group-hover:translate-y-[-1px]"
                  style={isCompleted ? { filter: "brightness(0) invert(1)" } : {}}
                  draggable={false}
                />
              </button>

              <div className="flex flex-col min-w-0">
                <span className="text-[14px] text-[#1D4789] font-medium leading-tight truncate">
                  {label}
                </span>
                {sublabel && (
                  <span className="text-[12px] text-[#1D4789]/70 leading-tight">
                    {sublabel}
                  </span>
                )}
              </div>

              {isCompleted && !lockedMsg && (
                <span className="inline-flex items-center gap-1 rounded-md px-2 h-6 text-[11px] leading-none text-[#1D4789] ring-1 ring-[#1D4789]/20 bg-[#1D4789]/8">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Hecho
                </span>
              )}
            </div>
          );

          return (
            <div key={key}>
              {lockedMsg ? (
                <LockedTooltip message={lockedMsg}>{row}</LockedTooltip>
              ) : row}
            </div>
          );
        })}
      </div>
    </div>
  );
}
