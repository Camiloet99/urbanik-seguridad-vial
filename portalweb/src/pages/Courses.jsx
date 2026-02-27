import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/courses/Hero";
import CourseCard, { CardIcons } from "@/components/courses/CourseCard";
import ActionList from "@/components/courses/ActionList";
import ProgressCard from "@/components/courses/ProgressCard";
import { getMyProgress, buildMonedaMap, getModuleProgress, isDiagnosticoDone, getGeneralProgress, syncDiagnosticoFromBackend } from "@/services/progressService";
import Spinner from "@/components/ui/Spinner";

import card2 from "@/assets/courses/card-2.jpg";
import card3 from "@/assets/courses/card-3.jpg";
import card4 from "@/assets/courses/card-4.jpg";
import card5 from "@/assets/courses/card-5.jpg";
import card6 from "@/assets/courses/card-6.jpg";
import { useNavigate } from "react-router-dom";

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
      /**{
        key: "punto-cero-calma",
        title: "Módulo 1",
        subtitle: "Donde inicia tu viaje interior",
        img: card1,
        ctaBg: "#1995F1",
        ctaIcon: <CardIcons.MdShare />,
      },*/
      {
        key: "bosque-emociones",
        title: "Módulo 2",
        subtitle: "Movilidad y Seguridad Peatonal",
        img: card2,
        ctaBg: "#FFC107",
        ctaIcon: <CardIcons.MdEmojiEmotions />,
      },
      {
        key: "jardin-mental",
        title: "Módulo 3",
        subtitle: "Movilidad Sostenible",
        img: card3,
        ctaBg: "#8BC34A",
        ctaIcon: <CardIcons.MdAutoAwesome />,
      },
      {
        key: "lago-suenos",
        title: "Módulo 4",
        subtitle: "Seguridad Vial para Motociclistas",
        img: card4,
        ctaBg: "#9C27B0",
        ctaIcon: <CardIcons.MdArrowForward />,
      },
    {
      key: "modulo-5",
      title: "Módulo 5",
      subtitle: "Conducción Segura y Primeros Auxilios",
      img: card5,
      ctaBg: "#cd6a6a",
      CardIcons: <CardIcons.MdLock />,
    },
    {
      key: "modulo-6",
      title: "Módulo 6",
      subtitle: "Vehículos de Carga y Operación Segura",
      img: card6,
      ctaBg: "#6acdb8",
      CardIcons: <CardIcons.MdLock />,
    }
    ],
    []
  );

  const [progress, setProgress] = useState([]);
  // modulo 1 is the global "initial test" gate for the full experience
  const [testFlags, setTestFlags] = useState({ initial: false, exit: false });
  const [diagDone, setDiagDone] = useState(() => isDiagnosticoDone());
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
        { key: "bosque-emociones", completed: monedaMap.get("bosque-emociones") ?? false },
        { key: "jardin-mental",    completed: monedaMap.get("jardin-mental")    ?? false },
        { key: "lago-suenos",      completed: monedaMap.get("lago-suenos")      ?? false },
        { key: "modulo-5",         completed: monedaMap.get("modulo-5")         ?? false },
        { key: "modulo-6",         completed: monedaMap.get("modulo-6")         ?? false },
      ];
      setProgress(mapped);
      // General module (modulo 0) drives the Courses.jsx ActionList.
      // Backend is the source of truth on a successful fetch.
      // Sync localStorage so it doesn't ghost a stale "done" state.
      const gen = getGeneralProgress(p);
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

  const isFirstTime = useMemo(() => {
    const anyMedal = progress.some((p) => p.completed);
    return !testFlags.initial && !anyMedal;
  }, [progress, testFlags]);

  const progressMap = useMemo(() => {
    const map = new Map(progress.map((p) => [p.key, p.completed]));
    map.set("test-inicial", !!testFlags.initial);
    map.set("test-salida", !!testFlags.exit);
    return map;
  }, [progress, testFlags]);

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
    if (!diagDone) {
      navigate("/diagnostico");
      return;
    }
    if (!testFlags.initial) {
      navigate("/test-inicial/1");
      return;
    }
    navigate("/courses/punto-cero-calma");
  };

  const goToCourseDetail = (courseKey) => {
    navigate(`/courses/${courseKey}`);
  };

  const smartCtaLabel = useMemo(() => {
    if (!diagDone) return "Hacer diagnóstico inicial";
    if (!testFlags.initial) return "Hacer test inicial";
    return "Ir al módulo";
  }, [testFlags, diagDone]);

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
                  quickLinks={[
                    { label: "Personaliza tu avatar 3d", onClick: () => navigate("/profile") },
                    { label: "Ir a mi perfil",           onClick: () => navigate("/profile") },
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
                  onClick={(key) => {
                    if (key === "contacto") {
                      window.open("mailto:soporte@tu-dominio.com", "_blank");
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
              >
                <ProgressCard progressMap={progressMap} />
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
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CourseCard {...c} />
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
