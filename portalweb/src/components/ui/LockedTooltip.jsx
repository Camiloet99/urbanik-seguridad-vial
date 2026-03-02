/**
 * LockedTooltip
 *
 * Wraps any element and shows a beautifully styled floating tooltip on hover
 * when something is locked / disabled. Use as a wrapper — the children are
 * rendered normally but pointer-events on the wrapper capture focus/hover.
 *
 * Usage:
 *   <LockedTooltip message="Completa todos los módulos primero">
 *     <button disabled>Test de salida</button>
 *   </LockedTooltip>
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdLock } from "react-icons/md";

export default function LockedTooltip({
  children,
  message = "No disponible aún",
  /** Where to anchor the tooltip relative to the wrapped element */
  placement = "top", // "top" | "bottom"
  disabled = true,   // set to false to render children normally without tooltip
}) {
  const [visible, setVisible] = useState(false);

  if (!disabled) return <>{children}</>;

  const isTop = placement !== "bottom";

  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {/* Slightly dim the locked child */}
      <div className="opacity-50 pointer-events-none select-none">
        {children}
      </div>

      {/* Invisible overlay to capture mouse events */}
      <div className="absolute inset-0 cursor-not-allowed" aria-hidden />

      <AnimatePresence>
        {visible && (
          <motion.div
            key="tooltip"
            initial={{ opacity: 0, y: isTop ? 6 : -6, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isTop ? 6 : -6, scale: 0.94 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className={[
              "absolute z-50 left-1/2 -translate-x-1/2 pointer-events-none",
              isTop ? "bottom-[calc(100%+10px)]" : "top-[calc(100%+10px)]",
            ].join(" ")}
          >
            {/* Tooltip card */}
            <div
              className="flex items-start gap-2.5 rounded-[14px]
                         bg-[#16181f]/96 ring-1 ring-white/12 backdrop-blur-xl
                         px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.5)]
                         w-max max-w-[220px]"
            >
              {/* Amber lock icon with glow */}
              <span className="flex-shrink-0 mt-[1px] h-6 w-6 rounded-full bg-amber-400/15 grid place-items-center
                               shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                <MdLock className="text-amber-400 text-sm" />
              </span>

              <span className="text-white/85 text-xs font-medium leading-snug">
                {message}
              </span>
            </div>

            {/* Arrow */}
            {isTop ? (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0
                              border-l-[7px] border-r-[7px] border-t-[7px]
                              border-l-transparent border-r-transparent border-t-[#16181f]/96" />
            ) : (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0
                              border-l-[7px] border-r-[7px] border-b-[7px]
                              border-l-transparent border-r-transparent border-b-[#16181f]/96" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
