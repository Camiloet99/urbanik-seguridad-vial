import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getCourseProgress, getMyProgress, COURSE_KEY_TO_MODULO } from "@/services/progressService";

import Hero from "@/components/courses/Hero";
import ActionList from "@/components/courses/ActionList";
import ProgressCard from "@/components/courses/ProgressCard";
import RatingModal from "@/components/courses/RatingModal";

import card1 from "@/assets/courses/card-1.png";
import card2 from "@/assets/courses/card-2.jpg";
import card3 from "@/assets/courses/card-3.jpg";
import card4 from "@/assets/courses/card-4.jpg";
import ChatNia from "@/components/courses/ChatNia";
import partner1 from "@/assets/partner-1-white.png";
import partner2 from "@/assets/partner-2-white.png";

/**
 * Ruta actual: /courses/:courseKey
 * Esta vista queda "como Figma": SOLO top + bloque inferior (sin secciones extra).
 */
const COURSE_DATA = {
  "punto-cero-calma": {
    title: "Fundamentos de Seguridad Vial",
    subtitle: "Módulo 1",
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
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const courseData = useMemo(() => COURSE_DATA[courseKey] || null, [courseKey]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const p = await getMyProgress();
        setProgress(p);
      } catch (err) {
        console.warn("Progress no disponible (backend desconectado).", err);
      }
    };
    fetchProgress();
  }, [courseKey]);

  // Per-module progress for this specific course
  const moduleProgress = useMemo(
    () => getCourseProgress(progress, courseKey),
    [progress, courseKey]
  );

  const progressMap = useMemo(() => {
    const m = new Map();
    m.set("test-inicial",  moduleProgress.testInitialDone);
    m.set("test-salida",   moduleProgress.testExitDone);
    m.set("calificacion",  moduleProgress.calificationDone);
    return m;
  }, [moduleProgress]);

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
    <>
      <div className="mt-4 sm:mt-6 lg:mt-12 relative min-h-[calc(80vh-80px)] flex flex-col space-y-8 pb-[calc(84px+env(safe-area-inset-bottom))] sm:pb-0">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950"
      />

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
          calificationDone={progressMap.get("calificacion")}
          showRating={true}
          onClick={(key) => {
            const modulo = COURSE_KEY_TO_MODULO[courseKey];
            if (key === "califica") {
              setIsRatingModalOpen(true);
              return;
            }
            if (key === "test-inicial") {
              navigate(`/test-inicial/${modulo}`);
              return;
            }
            if (key === "test-salida") {
              navigate(`/test-salida/${modulo}`);
              return;
            }
            if (key === "calificacion") {
              navigate(`/calificacion/${modulo}`);
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

          {/* Chat con NIA */}
          <ChatNia locked={courseData.locked} />

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
<button
  type="button"
  className="rounded-full bg-[#5FA9FF] px-6 py-3 text-white font-semibold"
  onClick={() => navigate(`/courses/${courseKey}/rating`)}
>
  Probar pantalla de calificación
</button>
              
            </div>

          
          </div>
        </div>
      </div>

      
      </div>

      <RatingModal
        isOpen={isRatingModalOpen}
        courseKey={courseKey}
        courseTitle={courseData?.title}
        onClose={() => setIsRatingModalOpen(false)}
      />
    </>
  );
}
