import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  getMyProgress,
  getModuleProgress,
  COURSE_KEY_TO_MODULO,
  submitIntroduccion,
  submitPdfRead,
  isExperienciaDone,
  markExperienciaDone,
  isMonedaEarned,
} from "@/services/progressService";

import Hero from "@/components/courses/Hero";
import ActionList from "@/components/courses/ActionList";
import ProgressCard from "@/components/courses/ProgressCard";
import RatingModal from "@/components/courses/RatingModal";
import LockedTooltip from "@/components/ui/LockedTooltip";

import card1 from "@/assets/courses/card-1.png";
import card2 from "@/assets/courses/card-2.jpg";
import card3 from "@/assets/courses/card-3.jpg";
import card4 from "@/assets/courses/card-4.jpg";
import ChatNia from "@/components/courses/ChatNia";

const COURSE_DATA = {
  "punto-cero-calma": {
    title: "Punto Cero CALMA",
    subtitle: "Donde inicia tu viaje interior",
    bgImage: card1,
    locked: false,
    resources: [
      { id: "pcc-pdf-1", label: "PDF 1", fileName: "seguridad-vial.pdf" },
      { id: "pcc-pdf-2", label: "PDF 2", fileName: "seguridad-vial.pdf" },
      { id: "pcc-pdf-3", label: "PDF 3", fileName: "seguridad-vial.pdf" },
    ],
  },
  "bosque-emociones": {
    title: "Bosque de las Emociones",
    subtitle: "Reconectate con tu interior",
    bgImage: card2,
    locked: false,
    resources: [
      { id: "be-pdf-1", label: "PDF 1", fileName: "seguridad-vial.pdf" },
      { id: "be-pdf-2", label: "PDF 2", fileName: "seguridad-vial.pdf" },
    ],
  },
  "jardin-mental": {
    title: "Jardin Mental",
    subtitle: "Siembra tus metas, florece tu mente",
    bgImage: card3,
    locked: false,
    resources: [
      { id: "jm-pdf-1", label: "PDF 1", fileName: "seguridad-vial.pdf" },
      { id: "jm-pdf-2", label: "PDF 2", fileName: "seguridad-vial.pdf" },
      { id: "jm-pdf-3", label: "PDF 3", fileName: "seguridad-vial.pdf" },
    ],
  },
  "lago-suenos": {
    title: "Lago de los Suenos",
    subtitle: "El reflejo de tus libertades",
    bgImage: card4,
    locked: false,
    resources: [
      { id: "ls-pdf-1", label: "PDF 1", fileName: "seguridad-vial.pdf" },
      { id: "ls-pdf-2", label: "PDF 2", fileName: "seguridad-vial.pdf" },
    ],
  },
  "modulo-5": {
    title: "Modulo 5",
    subtitle: "Conduccion Segura y Primeros Auxilios",
    bgImage: card4,
    locked: false,
    resources: [
      { id: "m5-pdf-1", label: "PDF 1", fileName: "seguridad-vial.pdf" },
      { id: "m5-pdf-2", label: "PDF 2", fileName: "seguridad-vial.pdf" },
    ],
  },
  "modulo-6": {
    title: "Modulo 6",
    subtitle: "Vehiculos de Carga y Operacion Segura",
    bgImage: card4,
    locked: false,
    resources: [
      { id: "m6-pdf-1", label: "PDF 1", fileName: "seguridad-vial.pdf" },
    ],
  },
};

export default function CourseDetail() {
  const { courseKey } = useParams();
  const navigate = useNavigate();

  const courseData = useMemo(() => COURSE_DATA[courseKey] || null, [courseKey]);
  const modulo = useMemo(() => COURSE_KEY_TO_MODULO[courseKey] ?? null, [courseKey]);

  const [progress, setProgress] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [experienciaDone, setExperienciaDone] = useState(
    () => (modulo ? isExperienciaDone(modulo) : false)
  );

  const fetchProgress = async () => {
    try {
      const p = await getMyProgress();
      setProgress(p);
    } catch (err) {
      console.warn("Progress no disponible (backend desconectado).", err);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [courseKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Full module-progress object with all flags
  const mp = useMemo(
    () => (modulo ? getModuleProgress(progress, modulo) : null),
    [progress, modulo]
  );

  // True when introduccion + all pdfs for this module have been seen
  const allResourcesDone = useMemo(() => {
    if (!mp || !courseData) return false;
    const n = courseData.resources?.length ?? 0;
    return (
      mp.introduccionDone &&
      (n >= 1 ? mp.pdf1Done : true) &&
      (n >= 2 ? mp.pdf2Done : true) &&
      (n >= 3 ? mp.pdf3Done : true) &&
      (n >= 4 ? mp.pdf4Done : true)
    );
  }, [mp, courseData]);

  // Map used by ActionList + ProgressCard
  const progressMap = useMemo(() => {
    const m = new Map();
    if (!mp) return m;
    m.set("test-inicial",  !!mp.testInitialDone);
    m.set("test-salida",   !!mp.testExitDone);
    m.set("califica",      !!mp.calificationDone);
    m.set("introduccion",  !!mp.introduccionDone);
    m.set("experiencia",   !!isMonedaEarned(progress, modulo));
    return m;
  }, [mp, progress, modulo]);

  // Locked messages for ActionList rows
  const lockedItems = useMemo(() => {
    if (!mp) return {};
    const items = {};
    if (!mp.introduccionDone) {
      items["test-inicial"] = "Primero ve la introduccion del modulo";
    }
    if (!experienciaDone) {
      items["test-salida"] = "Completa la experiencia gamificada primero";
    }
    if (!allResourcesDone) {
      items["califica"] = "Ve todos los recursos del modulo primero";
    }
    return items;
  }, [mp, experienciaDone, allResourcesDone]);

  // Hero CTA -- marks introduccion done on backend then navigates
  const handleIntroduccion = async () => {
    if (courseData?.locked || !modulo) return;
    try {
      await submitIntroduccion(modulo);
      const p = await getMyProgress();
      setProgress(p);
    } catch (e) {
      console.warn("[handleIntroduccion]", e);
    }
    navigate("/introduccion");
  };

  // Play button -- marks experiencia done in localStorage then navigates
  const handleExperience = () => {
    if (!mp?.testInitialDone || !modulo) return;
    markExperienciaDone(modulo);
    setExperienciaDone(true);
    navigate("/experience");
  };

  // PDF download -- marks specific pdf read on backend
  const downloadResource = async (resource, resourceIndex) => {
    if (modulo) {
      try {
        await submitPdfRead(modulo, resourceIndex + 1);
        const p = await getMyProgress();
        setProgress(p);
      } catch (err) {
        console.warn("No se pudo notificar al backend, igual se descargara.", err);
      }
    }
    const a = document.createElement("a");
    a.href = `/documents/${resource.fileName}`;
    a.download = resource.fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

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

  const experienceCanPlay = !!mp?.testInitialDone && !courseData.locked;

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
            ctaLabel={courseData.locked ? "Proximamente" : "Introduccion"}
            onCtaClick={handleIntroduccion}
          />

          <ActionList
            progressMap={progressMap}
            testInitialDone={mp?.testInitialDone}
            testExitDone={mp?.testExitDone}
            showRating={true}
            lockedItems={lockedItems}
            onClick={(key) => {
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
            }}
          />

          <ProgressCard
            progressMap={progressMap}
            weights={{
              introduccion: 10,
              "test-inicial": 15,
              "test-salida": 15,
              experiencia: 60,
            }}
          />
        </div>

        {/* Bloque inferior: Experiencia + Chat + Recursos */}
        <div className="rounded-[28px] bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_1fr_320px]">

            {/* Experiencia gamificada */}
            <div className="rounded-[22px] ring-1 ring-white/10 bg-white/5 overflow-hidden">
              <div className="relative h-[260px]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <LockedTooltip
                    disabled={!experienceCanPlay}
                    message="Completa el test inicial del modulo primero"
                    placement="top"
                  >
                    <button
                      className={[
                        "h-16 w-16 rounded-full bg-[#6C4CFF] grid place-items-center",
                        "shadow-[0_10px_30px_-12px_rgba(108,76,255,1)]",
                        "hover:bg-[#5944F9] active:scale-[0.98]",
                        "transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                        !experienceCanPlay ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                      ].join(" ")}
                      onClick={handleExperience}
                      disabled={!experienceCanPlay}
                      aria-label="Entrar a la experiencia"
                    >
                      &#9654;
                    </button>
                  </LockedTooltip>
                </div>
              </div>
              <div className="p-4">
                <p className="text-white/85 text-sm">
                  {courseData.locked
                    ? "Este modulo esta en preparacion."
                    : !mp?.testInitialDone
                    ? "Haz el test inicial del modulo para desbloquear la experiencia."
                    : "Al hacer clic, entras a la experiencia gamificada del modulo."}
                </p>
              </div>
            </div>

            {/* Chat con NIA */}
            <ChatNia locked={courseData.locked} />

            {/* Recursos */}
            <div className="rounded-[22px] ring-1 ring-white/10 bg-white/5 p-5">
              <p className="text-white font-medium mb-4">Recursos:</p>

              {/* Boton de introduccion */}
              <button
                className={[
                  "w-full flex items-center justify-between rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3",
                  "text-white/90 text-sm hover:bg-white/10 transition mb-2",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                  courseData.locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                ].join(" ")}
                onClick={handleIntroduccion}
                disabled={courseData.locked}
              >
                <span className="flex items-center gap-2">
                  Introduccion
                  {mp?.introduccionDone && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-emerald-400" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="opacity-60">&#9654;</span>
              </button>

              {/* PDFs */}
              <div className="space-y-2">
                {courseData.resources?.length ? (
                  courseData.resources.map((r, idx) => {
                    const pdfKey = `pdf${idx + 1}Done`;
                    const pdfDone = mp?.[pdfKey] ?? false;
                    return (
                      <button
                        key={r.id}
                        className={[
                          "w-full flex items-center justify-between rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3",
                          "text-white/90 text-sm hover:bg-white/10 transition",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                          courseData.locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                        ].join(" ")}
                        onClick={() => downloadResource(r, idx)}
                        disabled={courseData.locked}
                      >
                        <span className="flex items-center gap-2">
                          {r.label}
                          {pdfDone && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-emerald-400" aria-hidden="true">
                              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className="opacity-80">&#11015;</span>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-white/60 text-sm">
                    {courseData.locked ? "Recursos disponibles proximamente." : "No hay recursos aun."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <RatingModal
        isOpen={isRatingModalOpen}
        courseKey={courseKey}
        courseTitle={courseData?.title}
        modulo={modulo}
        onClose={() => {
          setIsRatingModalOpen(false);
          fetchProgress();
        }}
      />
    </>
  );
}
