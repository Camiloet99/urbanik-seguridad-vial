import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getMyProgress } from "@/services/progressService";

import Hero from "@/components/courses/Hero";
import ActionList from "@/components/courses/ActionList";
import ProgressCard from "@/components/courses/ProgressCard";

import card1 from "@/assets/courses/card-1.png";
import card2 from "@/assets/courses/card-2.jpg";
import card3 from "@/assets/courses/card-3.jpg";
import card4 from "@/assets/courses/card-4.jpg";

import partner1 from "@/assets/partner-1-white.png";
import partner2 from "@/assets/partner-2-white.png";

/**
 * Ruta actual: /courses/:courseKey
 * Esta vista queda "como Figma": SOLO top + bloque inferior (sin secciones extra).
 */
const COURSE_DATA = {
  "punto-cero-calma": {
    title: "Punto Cero CALMA",
    subtitle: "Donde inicia tu viaje interior",
    bgImage: card1,
    locked: false,
    resources: ["PDF 1", "PDF 2", "PDF 3"],
  },
  "bosque-emociones": {
    title: "Bosque de las Emociones",
    subtitle: "Reconéctate con tu interior",
    bgImage: card2,
    locked: false,
    resources: ["PDF 1", "PDF 2"],
  },
  "jardin-mental": {
    title: "Jardín Mental",
    subtitle: "Siembra tus metas, florece tu mente",
    bgImage: card3,
    locked: false,
    resources: ["PDF 1", "PDF 2", "PDF 3"],
  },
  "lago-suenos": {
    title: "Lago de los Sueños",
    subtitle: "El reflejo de tus libertades",
    bgImage: card4,
    locked: false,
    resources: ["PDF 1", "PDF 2"],
  },

  "modulo-5": {
    title: "Módulo 5",
    subtitle: "Rutas y Denuncia Efectiva",
    bgImage: card4, // usa una existente para no romper imports
    locked: false,  // cámbialo a true si quieres bloquearlo
    resources: ["PDF 1", "PDF 2"],
  },
  "modulo-6": {
    title: "Módulo 6",
    subtitle: "Rutas y Denuncia Efectiva",
    bgImage: card4,
    locked: false,
    resources: ["PDF 1"],
  },
};

export default function CourseDetail() {
  const { courseKey } = useParams();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(null);

  const courseData = useMemo(() => COURSE_DATA[courseKey] || null, [courseKey]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const p = await getMyProgress();
        setProgress(p);
      } catch (err) {
        // si el back no está, no bloqueamos UI
        console.warn("Progress no disponible (backend desconectado).", err);
      }
    };
    fetchProgress();
  }, [courseKey]);

  // Mapa mínimo para ProgressCard/ActionList (sin romper si no hay back)
  const progressMap = useMemo(() => {
    const m = new Map();
    m.set("test-inicial", !!progress?.testInitialDone);
    m.set("test-salida", !!progress?.testExitDone);
    return m;
  }, [progress]);

  if (!courseData) {
    return (
      <div className="min-h-[calc(80vh-80px)] grid place-items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Curso no encontrado</h1>
          <button
            onClick={() => navigate("/courses")}
            className="rounded-xl bg-[#5944F9] hover:brightness-110 text-white font-medium px-6 py-3 transition"
          >
            Volver a Cursos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 sm:mt-6 lg:mt-12 relative min-h-[calc(80vh-80px)] flex flex-col space-y-8 pb-[calc(84px+env(safe-area-inset-bottom))] sm:pb-0">
      {/* Fondo i*/}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950"
      />

      {/* TOP: Banner + Acciones + Progreso */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px_320px]">
        <Hero
          title={courseData.title}
          subtitle={courseData.subtitle}
          bgImage={courseData.bgImage}
          ctaLabel={courseData.locked ? "Próximamente" : "Cursosar módulo"}
          onCtaClick={() => {
            if (courseData.locked) return;
            navigate("/experience");
          }}
        />

        <ActionList
          progressMap={progressMap}
          testInitialDone={progressMap.get("test-inicial")}
          testExitDone={progressMap.get("test-salida")}
          onClick={(key) => {
            if (key === "califica") {
              window.open("");
              return;
            }
            if (key === "test-inicial") {
              navigate("/test-inicial");
              return;
            }
            if (key === "test-salida") {
              navigate("/test-salida");
              return;
            }
          }}
        />

        <ProgressCard progressMap={progressMap} />
      </div>

      {/* BLOQUE INFERIOR (Figma): Experiencia + Chat + Recursos */}
      <div className="rounded-[28px] bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_1fr_320px]">
          {/* Entrada a experiencia (preview tipo video) */}
          <div className="rounded-[22px] ring-1 ring-white/10 bg-white/5 overflow-hidden">
            <div className="relative h-[260px]">
              
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  className="h-16 w-16 rounded-full bg-[#6C4CFF] grid place-items-center
                             shadow-[0_10px_30px_-12px_rgba(108,76,255,1)]
                             hover:bg-[#5944F9] active:scale-[0.98]
                             transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:opacity-60"
                  onClick={() => navigate("/experience")}
                  disabled={courseData.locked}
                  aria-label="Entrar a la experiencia"
                >
                  ▶
                </button>
              </div>
            </div>

            <div className="p-4">
              <p className="text-white/85 text-sm">
                {courseData.locked
                  ? "Este módulo está en preparación."
                  : "Al hacer clic, entras a la experiencia gamificada del módulo."}
              </p>
            </div>
          </div>

          {/* Chat NIA (placeholder) */}
          <div className="rounded-[22px] ring-1 ring-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-white/10 ring-1 ring-white/15" />
              <div>
                <p className="text-white font-medium">Pregúntale a NIA</p>
                <p className="text-white/70 text-xs">Asistente del módulo</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-white/5 ring-1 ring-white/10 p-3 text-white/70 text-sm min-h-[140px]">
              Aquí irá el chat embebido (luego conectamos el componente real).
            </div>

            <div className="mt-3 flex gap-3">
              <input
                className="flex-1 rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                placeholder="Escribe tu pregunta…"
                disabled={courseData.locked}
              />
              <button
                className="rounded-xl bg-[#6C4CFF] px-4 py-2 text-sm font-medium
                           hover:bg-[#5944F9] active:scale-[0.98] transition
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:opacity-50"
                disabled={courseData.locked}
              >
                Enviar
              </button>
            </div>
          </div>

          {/* Recursos */}
          <div className="rounded-[22px] ring-1 ring-white/10 bg-white/5 p-5">
            <p className="text-white font-medium">Recursos:</p>

            <div className="mt-4 space-y-3">
              {courseData.resources?.length ? (
                courseData.resources.map((r) => (
                  <button
                    key={r}
                    className="w-full flex items-center justify-between rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-white/90 text-sm
                               hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    onClick={() => alert(`${r} (pendiente)`)}
                  >
                    <span>{r}</span>
                    <span className="opacity-80">⬇</span>
                  </button>
                ))
              ) : (
                <div className="text-white/60 text-sm">
                  {courseData.locked ? "Recursos disponibles próximamente." : "No hay recursos aún."}
                </div>
              )}
            </div>

          
          </div>
        </div>
      </div>

      
    </div>
  );
}
