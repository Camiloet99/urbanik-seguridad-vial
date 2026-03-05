import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/courses/Hero";
import CourseCard, { CardIcons } from "@/components/courses/CourseCard";
import ActionList from "@/components/courses/ActionList";
import ProgressCard from "@/components/courses/ProgressCard";
import { getMyProgress, buildMonedaMap, getModuleProgress, isMonedaEarned, isDiagnosticoDone, getGeneralProgress, syncDiagnosticoFromBackend, isAvatarConfigured, syncAvatarFromBackend } from "@/services/progressService";
import Spinner from "@/components/ui/Spinner";
import LockedTooltip from "@/components/ui/LockedTooltip";

import card2 from "@/assets/courses/card-2.jpg";
import card3 from "@/assets/courses/card-3.jpg";
import card4 from "@/assets/courses/card-4.jpg";
import card5 from "@/assets/courses/card-5.jpg";
import card6 from "@/assets/courses/card-6.jpg";
import { useNavigate } from "react-router-dom";

const MODULE_NAMES = {
  1: "Fundamentos de Seguridad Vial",
  2: "Movilidad y Seguridad Peatonal",
  3: "Movilidad Sostenible y Activa",
  4: "Seguridad Vial para Motociclistas",
  5: "Conducción Segura en Automóviles",
  6: "Vehículos de Carga y Operación Segura",
};

/**
 * UX/UI improvements included:
 * - Skeleton loader for page sections (Hero / Sidebar / Cards) with subtle shimmer
 * - Error state with retry
 * - Smart CTA label depending on user progress
 * - Soft entrance animations and micro-interactions (Framer Motion)
 * - Better accessibility: semantic buttons, keyboard activation, aria labels
 * - Responsive polish + reduced layout shift (reserve space while loading)
 */

function shimmerClass() {
  return "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";
}

export default function Courses() {
  const cardsBase = useMemo(
    () => [
      {
        key: "movilidad-seguridad-peatonal",
        title: "Movilidad y Seguridad Peatonal",
        subtitle: "Módulo 2",
        img: card2,
        ctaBg: "#FFC107",
        ctaIcon: <CardIcons.MdEmojiEmotions />,
      },
      {
        key: "movilidad-sostenible-activa",
        title: "Movilidad Sostenible y Activa",
        subtitle: "Módulo 3",
        img: card3,
        ctaBg: "#8BC34A",
        ctaIcon: <CardIcons.MdAutoAwesome />,
      },
      {
        key: "seguridad-vial-motociclistas",
        title: "Seguridad Vial para Motociclistas",
        subtitle: "Módulo 4",
        img: card4,
        ctaBg: "#9C27B0",
        ctaIcon: <CardIcons.MdArrowForward />,
      },
      {
        key: "conduccion-segura-automoviles",
        title: "Conducción Segura en Automóviles",
        subtitle: "Módulo 5",
        img: card5,
        ctaBg: "#cd6a6a",
        ctaIcon: <CardIcons.MdLock />,
      },
      {
      key: "vehiculos-carga-operacion-segura",
      title: "Vehículos de Carga y Operación Segura",
      subtitle: "Módulo 6",
      img: card6,
      ctaBg: "#6acdb8",
      ctaIcon: <CardIcons.MdArrowForward />,
      },
    ],
    []
  );

  const [progress, setProgress] = useState([]);
  const [rawProgress, setRawProgress] = useState(null);
  // modulo 1 is the global "initial test" gate for the full experience
  const [testFlags, setTestFlags] = useState({ initial: false, exit: false });
  const [diagDone, setDiagDone] = useState(() => isDiagnosticoDone());
  const [avatarDone, setAvatarDone] = useState(() => isAvatarConfigured());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProgress = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const p = await getMyProgress();
      // Map monedas (completions) per course key
      const monedaMap = buildMonedaMap(p);
      const mapped = [
        { key: "movilidad-seguridad-peatonal", completed: monedaMap.get("movilidad-seguridad-peatonal") ?? false },
        { key: "movilidad-sostenible-activa",   completed: monedaMap.get("movilidad-sostenible-activa")   ?? false },
        { key: "seguridad-vial-motociclistas",  completed: monedaMap.get("seguridad-vial-motociclistas")  ?? false },
        { key: "conduccion-segura-automoviles",  completed: monedaMap.get("conduccion-segura-automoviles")  ?? false },
        { key: "vehiculos-carga-operacion-segura", completed: monedaMap.get("vehiculos-carga-operacion-segura") ?? false },
      ];
      setProgress(mapped);
      setRawProgress(p);
      // General module (modulo 0) drives the Courses.jsx ActionList.
      // Backend is the source of truth on a successful fetch.
      // Sync localStorage so it doesn't ghost a stale "done" state.
      const gen = getGeneralProgress(p);
      // Sync avatar done from backend (source of truth)
      syncAvatarFromBackend(!!gen.avatarDone);
      setAvatarDone(!!gen.avatarDone);
      // Sync diagnostic done from backend
      if (gen.testInicialGeneral) {
        // Backend confirmed it — make sure localStorage agrees
        syncDiagnosticoFromBackend(true);
      } else {
        // Backend says not done — clear any stale localStorage flag
        syncDiagnosticoFromBackend(false);
      }
      const inicialDone = gen.testInicialGeneral;
      setDiagDone(inicialDone);
      setTestFlags({ initial: inicialDone, exit: gen.testFinalGeneral });
    } catch (e) {
      console.error("getMyProgress error:", e);
      // Backend unreachable — fall back to localStorage so the UI isn't broken
      const localDone = isDiagnosticoDone();
      const localAvatar = isAvatarConfigured();
      setAvatarDone(localAvatar);
      setDiagDone(localDone);
      setTestFlags({ initial: localDone, exit: false });
      setError("No pudimos cargar tu progreso. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await fetchProgress();
    })();
    return () => {
      mounted = false;
    };
  }, [fetchProgress]);

  const certificateStatus = useMemo(() => {
    const pendingTests = [];
    if (!testFlags.initial) pendingTests.push("test de inicio");
    if (!testFlags.exit)    pendingTests.push("test de salida");

    if (!rawProgress) {
      return { unlocked: false, pendingModules: [1, 2, 3, 4, 5, 6], pendingTests };
    }
    const pending = [];
    for (let n = 1; n <= 6; n++) {
      const m = getModuleProgress(rawProgress, n);
      const hasMedal = isMonedaEarned(rawProgress, n);
      const done =
        m.introduccionDone &&
        m.testInitialDone &&
        m.quiz1Done && m.quiz2Done && m.quiz3Done && m.quiz4Done &&
        hasMedal &&
        m.testExitDone &&
        m.calificationDone;
      if (!done) pending.push(n);
    }
    return {
      unlocked: pending.length === 0 && pendingTests.length === 0,
      pendingModules: pending,
      pendingTests,
    };
  }, [rawProgress, testFlags]);

  const isFirstTime = useMemo(() => {
    const anyMedal = progress.some((p) => p.completed);
    return !testFlags.initial && !anyMedal;
  }, [progress, testFlags]);

  const progressMap = useMemo(() => {
    const map = new Map(progress.map((p) => [p.key, p.completed]));
    map.set("test-inicial", !!testFlags.initial);
    map.set("test-salida", !!testFlags.exit);
    // Module-level completion keys used by ProgressCard weights
    for (let n = 1; n <= 6; n++) {
      const m = getModuleProgress(rawProgress, n);
      const hasMedal = isMonedaEarned(rawProgress, n);
      const done = rawProgress
        ? m.introduccionDone &&
          m.testInitialDone &&
          m.quiz1Done && m.quiz2Done && m.quiz3Done && m.quiz4Done &&
          hasMedal &&
          m.testExitDone &&
          m.calificationDone
        : false;
      map.set(`modulo-${n}`, done);
    }
    return map;
  }, [progress, testFlags, rawProgress]);

  const buildStatusLogoSrc = (index, completed) => {
    const folder = completed ? "complete" : "nocomplete";
    return new URL(
      `../assets/courses/${folder}/logo-${index + 1}.png`,
      import.meta.url
    ).href;
  };

  /**
   * Hero CTA:
   *  - test-inicial NOT done → go do it first
   *  - test-inicial done     → go to the module's own CourseDetail page
   */
  const goSmart = () => {
    if (!avatarDone) {
      navigate("/profile?setup=1");
      return;
    }
    if (!diagDone) {
      navigate("/diagnostico");
      return;
    }
    navigate("/courses/fundamentos-seguridad-vial");
  };

  const goToCourseDetail = (courseKey) => {
    navigate(`/courses/${courseKey}`);
  };

  const smartCtaLabel = useMemo(() => {
    if (!avatarDone) return "Iniciar";
    if (!diagDone) return "Test de riesgo vial";
    return "Ir al Módulo 1";
  }, [avatarDone, diagDone]);

  const allModulesDone = useMemo(
    () => progress.length > 0 && progress.every((p) => p.completed),
    [progress]
  );

  const cards = useMemo(() => {
    return cardsBase.map((c, i) => {
      const isCompleted = progressMap.get(c.key) ?? false;
      const statusLogoSrc = buildStatusLogoSrc(i, isCompleted);
      // Destructure key out so it is never spread into JSX props
      const { key, ...rest } = c;
      return {
        cardKey: key,
        ...rest,
        statusLogoSrc,
        onClick: () => goToCourseDetail(key),
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            goToCourseDetail(key);
          }
        },
        role: "button",
        tabIndex: 0,
        "aria-label": `${c.title} — ${
          isCompleted ? "Completado" : "Pendiente"
        }`,
      };
    });
  }, [cardsBase, progressMap]);

  return (
    <div className="mt-4 sm:mt-6 lg:mt-12 relative min-h-[calc(80vh-80px)] flex flex-col space-y-8 pb-[calc(84px+env(safe-area-inset-bottom))] sm:pb-0">
      {/* Fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950"
      />

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[60vh]"
          >
            <PageSkeleton />
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="min-h-[60vh] grid place-items-center"
          >
            <div className="max-w-md w-full text-center bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
              <p className="text-base text-white/90">{error}</p>
              <button
                onClick={fetchProgress}
                className="mt-4 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/15 transition"
              >
                Reintentar
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="contents"
          >
            {/* Hero / ActionList / ProgressCard */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px_320px]">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Hero
                  title="Fundamentos de Seguridad Vial"
                  subtitle="Módulo 1"
                  ctaLabel={smartCtaLabel}
                  onCtaClick={goSmart}
                  ctaNewRow
                  quickLinks={[
                    { label: "Personalizar avatar 3D", onClick: () => navigate(avatarDone ? "/profile" : "/profile?setup=1") },
                    { label: "Ir a mi perfil",          onClick: () => navigate("/profile") },
                  ]}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ActionList
                  progressMap={progressMap}
                  testInitialDone={testFlags.initial}
                  testExitDone={testFlags.exit}
                  showContacto={true}
                  lockedItems={
                    !avatarDone
                      ? {
                          "test-inicial":  "Personaliza tu avatar 3D primero",
                          "test-salida":   "Personaliza tu avatar 3D primero",
                          "calificacion":  "Personaliza tu avatar 3D primero",
                        }
                      : !allModulesDone
                      ? { "test-salida": "Completa todos los módulos para desbloquear el test de salida" }
                      : {}
                  }
                  onClick={(key) => {
                    if (key === "contacto") {
                      const msg = encodeURIComponent(
                        "Hola, vengo de la plataforma de Seguridad Vial y necesito ayuda."
                      );
                      window.open(`https://wa.me/573507679627?text=${msg}`, "_blank");
                      return;
                    }
                    if (key === "test-inicial") {
                      if (testFlags.initial) return;
                      // Test inicial general = Diagnóstico de Perfil de Riesgo Vial
                      navigate("/diagnostico");
                      return;
                    }
                    if (key === "test-salida") {
                      if (testFlags.exit) return;
                      if (!testFlags.initial) {
                        navigate("/diagnostico");
                        return;
                      }
                      // Test salida general = módulo 0
                      navigate("/test-salida/0");
                      return;
                    }
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="h-full"
              >
                <div className="h-full flex flex-col gap-3">
                  <ProgressCard
                    progressMap={progressMap}
                    className="flex-1"
                    weights={{
                      "test-inicial": 5,
                      "test-salida":  5,
                      "modulo-1":    15,
                      "modulo-2":    15,
                      "modulo-3":    15,
                      "modulo-4":    15,
                      "modulo-5":    15,
                      "modulo-6":    15,
                    }}
                  />

                  {/* Certificate download */}
                  <LockedTooltip
                    disabled={!certificateStatus.unlocked}
                    placement="top"
                    message={(() => {
                      const parts = [];
                      if (certificateStatus.pendingTests.length > 0)
                        parts.push(certificateStatus.pendingTests.join(" y "));
                      if (certificateStatus.pendingModules.length > 0) {
                        const shown = certificateStatus.pendingModules.slice(0, 2).map((n) => MODULE_NAMES[n]).join(", ");
                        const extra = certificateStatus.pendingModules.length > 2
                          ? ` y ${certificateStatus.pendingModules.length - 2} más` : "";
                        parts.push(`Módulos: ${shown}${extra}`);
                      }
                      return parts.length ? `Pendiente — ${parts.join(" · ")}` : "";
                    })()}
                  >
                    <button
                      disabled={!certificateStatus.unlocked}
                      onClick={() => {
                        if (!certificateStatus.unlocked) return;
                        const a = document.createElement("a");
                        a.href = "/documents/certificado-seguridad-vial.pdf";
                        a.download = "certificado-seguridad-vial.pdf";
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                      }}
                      className={[
                        "w-full flex items-center justify-between gap-3",
                        "rounded-2xl px-4 py-3 transition-all duration-300",
                        "focus:outline-none focus-visible:ring-2",
                        certificateStatus.unlocked
                          ? [
                              "bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/15",
                              "ring-2 ring-emerald-400/70 text-emerald-300",
                              "hover:ring-emerald-400 hover:from-emerald-500/25 hover:to-cyan-500/25",
                              "shadow-[0_0_24px_-6px_rgba(52,211,153,0.45)]",
                              "focus-visible:ring-emerald-400 cursor-pointer",
                            ].join(" ")
                          : "ring-1 ring-white/10 bg-white/4 text-white/35 cursor-not-allowed",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={[
                            "shrink-0 h-9 w-9 rounded-xl flex items-center justify-center ring-1",
                            certificateStatus.unlocked
                              ? "ring-emerald-400/50 bg-emerald-400/15 text-emerald-400"
                              : "ring-white/10 bg-white/6 text-white/25",
                          ].join(" ")}
                          aria-hidden="true"
                        >
                          {certificateStatus.unlocked ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                              <path d="M12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                          )}
                        </span>
                        <div className="text-left leading-tight min-w-0">
                          <p className="text-[13px] font-semibold truncate">Certificado 120h</p>
                          <p className="text-[11px] mt-0.5 opacity-60 truncate">
                            {certificateStatus.unlocked
                              ? "Listo para descargar"
                              : (() => {
                                  const mp = certificateStatus.pendingModules.length;
                                  const tp = certificateStatus.pendingTests.length;
                                  const mLabel = mp > 0 ? `${mp} módulo${mp > 1 ? "s" : ""}` : "";
                                  const tLabel = tp > 0 ? `${tp} test${tp > 1 ? "s" : ""}` : "";
                                  return [mLabel, tLabel].filter(Boolean).join(" y ") + " pendiente";
                                })()}
                          </p>
                        </div>
                      </div>
                      <span
                        className={[
                          "shrink-0 h-7 w-7 rounded-full flex items-center justify-center ring-1 transition",
                          certificateStatus.unlocked
                            ? "ring-emerald-400/60 bg-emerald-400/15 text-emerald-400"
                            : "ring-white/10 bg-white/6 text-white/25",
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                          <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>
                  </LockedTooltip>
                </div>
              </motion.div>
            </div>

            {/* Cards */}
            <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
              {cards.map((c, idx) => (
                <motion.div
                  key={c.cardKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * (idx + 1) }}
                  whileHover={avatarDone ? { y: -2 } : {}}
                  whileTap={avatarDone ? { scale: 0.98 } : {}}
                >
                  <LockedTooltip
                    disabled={!avatarDone}
                    message="Personaliza tu avatar 3D primero"
                    placement="top"
                  >
                    <CourseCard {...c} onClick={avatarDone ? c.onClick : undefined} />
                  </LockedTooltip>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>
    </div>
  );
}

/** Skeleton page with reserved layout **/
function PageSkeleton() {
  return (
    <div className="animate-in fade-in duration-200">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px_320px]">
        {/* Hero block */}
        <div
          className={`h-[240px] sm:h-[300px] rounded-2xl bg-white/5 ${shimmerClass()} border border-white/10`}
        />

        {/* ActionList block */}
        <div
          className={`h-[240px] rounded-2xl bg-white/5 ${shimmerClass()} border border-white/10`}
        />

        {/* ProgressCard block */}
        <div
          className={`h-[240px] rounded-2xl bg-white/5 ${shimmerClass()} border border-white/10`}
        />
      </div>

      <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-[280px] rounded-2xl bg-white/5 ${shimmerClass()} border border-white/10`}
          />
        ))}
      </div>

      {/* Accessible fallback spinner for screen readers */}
      <div className="sr-only">
        <Spinner label="Cargando…" />
      </div>
    </div>
  );
}
