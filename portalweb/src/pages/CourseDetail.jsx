import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  getMyProgress,
  getModuleProgress,
  COURSE_KEY_TO_MODULO,
  submitIntroduccion,
  isExperienciaDone,
  markExperienciaDone,
  isMonedaEarned,
} from "@/services/progressService";
import { COURSE_DATA } from "@/data/courseData";
import recursoIconSrc from "@/assets/recurso.png";
import quizIconSrc from "@/assets/quiz.png";

import Hero from "@/components/courses/Hero";
import ActionList from "@/components/courses/ActionList";
import ProgressCard from "@/components/courses/ProgressCard";
import RatingModal from "@/components/courses/RatingModal";
import LockedTooltip from "@/components/ui/LockedTooltip";
import ChatNia from "@/components/courses/ChatNia";
import ResourceQuizModal from "@/components/courses/ResourceQuizModal";

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
  // Quiz modal: null | { quizNum: 1-4, resourceLabel: string }
  const [quizModalOpen, setQuizModalOpen] = useState(null);
  // Locally-tracked quiz failures (quizNum) so the button turns red on fail
  const [localQuizFailed, setLocalQuizFailed] = useState(() => new Set());

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

  // Map used by ActionList + ProgressCard
  const progressMap = useMemo(() => {
    const m = new Map();
    if (!mp) return m;
    m.set("test-inicial",  !!mp.testInitialDone);
    m.set("test-salida",   !!mp.testExitDone);
    m.set("califica",      !!mp.calificationDone);
    m.set("introduccion",  !!mp.introduccionDone);
    m.set("experiencia",   !!isMonedaEarned(progress, modulo));
    m.set("pdf1",          !!mp.pdf1Done);
    m.set("pdf2",          !!mp.pdf2Done);
    m.set("pdf3",          !!mp.pdf3Done);
    m.set("pdf4",          !!mp.pdf4Done);
    m.set("quiz1",         !!mp.quiz1Done);
    m.set("quiz2",         !!mp.quiz2Done);
    m.set("quiz3",         !!mp.quiz3Done);
    m.set("quiz4",         !!mp.quiz4Done);
    return m;
  }, [mp, progress, modulo]);

  // True when ALL prereqs before test-salida are met
  const canDoTestSalida = useMemo(() => {
    if (!mp) return false;
    return (
      mp.introduccionDone &&
      mp.quiz1Done &&
      mp.quiz2Done &&
      mp.quiz3Done &&
      mp.quiz4Done &&
      mp.testInitialDone &&
      experienciaDone
    );
  }, [mp, experienciaDone]);

  // Module certificate: unlocked when 100% of this module is done
  const moduleCertUnlocked = useMemo(() => {
    if (!mp || !progress || !modulo) return false;
    return (
      mp.testInitialDone && mp.testExitDone && mp.calificationDone &&
      mp.introduccionDone &&
      mp.quiz1Done && mp.quiz2Done && mp.quiz3Done && mp.quiz4Done &&
      isMonedaEarned(progress, modulo)
    );
  }, [mp, progress, modulo]);

  // Locked messages for ActionList rows
  const lockedItems = useMemo(() => {
    if (!mp) return {};
    const items = {};
    if (!mp.introduccionDone) {
      items["test-inicial"] = "Primero ve la introduccion del modulo";
    }
    if (!canDoTestSalida) {
      items["test-salida"] =
        "Completa la introduccion, los 4 quizes de recursos, el test inicial y la experiencia 3D primero";
    }
    if (!mp.testExitDone) {
      items["califica"] = "Completa el test de salida primero";
    }
    return items;
  }, [mp, canDoTestSalida]);

  // Hero CTA -- marks introduccion done on backend then navigates to the intro PDF
  const handleIntroduccion = async () => {
    if (courseData?.locked || !modulo) return;
    try {
      await submitIntroduccion(modulo);
      const p = await getMyProgress();
      setProgress(p);
    } catch (e) {
      console.warn("[handleIntroduccion]", e);
    }
    navigate(`/courses/${courseKey}/intro`);
  };

  // Play button -- marks experiencia done in localStorage then navigates
  const handleExperience = () => {
    if (!mp?.testInitialDone || !modulo) return;
    markExperienciaDone(modulo);
    setExperienciaDone(true);
    navigate("/experience");
  };

  // Open PDF in-portal viewer — backend marks pdfNDone inside PdfVisor on mount
  const openResource = (resourceIndex) => {
    navigate(`/courses/${courseKey}/pdf/${resourceIndex + 1}`);
  };

  if (!courseData) {
    return (
      <div className="min-h-[calc(80vh-80px)] grid place-items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Curso no encontrado</h1>
          <button
            onClick={() => navigate("/courses")}
            className="rounded-xl bg-[#00b5e2] hover:brightness-110 text-white font-medium px-6 py-3 transition"
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

          <div className="h-full flex flex-col gap-3">
            <ProgressCard
              className="flex-1"
              progressMap={progressMap}
              weights={{
                introduccion:    5,
                "test-inicial":  5,
                "test-salida":   5,
                califica:        5,
                quiz1:           5,
                quiz2:           5,
                quiz3:           5,
                quiz4:           5,
                experiencia:    60,
              }}
            />

            {/* Per-module certificate */}
            <LockedTooltip
              disabled={!moduleCertUnlocked}
              placement="top"
              message={
                !moduleCertUnlocked
                  ? "Completa el 100% del módulo para desbloquear el certificado"
                  : ""
              }
            >
              <button
                disabled={!moduleCertUnlocked}
                onClick={() => {
                  if (!moduleCertUnlocked) return;
                  const a = document.createElement("a");
                  a.href = `/documents/certificado-modulo-${modulo}.pdf`;
                  a.download = `certificado-modulo-${modulo}.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                }}
                className={[
                  "w-full flex items-center justify-between gap-3",
                  "rounded-2xl px-4 py-3 transition-all duration-300",
                  "focus:outline-none focus-visible:ring-2",
                  moduleCertUnlocked
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
                      moduleCertUnlocked
                        ? "ring-emerald-400/50 bg-emerald-400/15 text-emerald-400"
                        : "ring-white/10 bg-white/6 text-white/25",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {moduleCertUnlocked ? (
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
                    <p className="text-[13px] font-semibold truncate">
                      Certificado Módulo {modulo}
                    </p>
                    <p className="text-[11px] mt-0.5 opacity-60 truncate">
                      {moduleCertUnlocked ? "Listo para descargar" : "Módulo incompleto"}
                    </p>
                  </div>
                </div>
                <span
                  className={[
                    "shrink-0 h-7 w-7 rounded-full flex items-center justify-center ring-1 transition",
                    moduleCertUnlocked
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
                        "h-16 w-16 rounded-full bg-[#00b5e2] grid place-items-center",
                        "shadow-[0_10px_30px_-12px_rgba(0,181,226,0.8)]",
                        "hover:bg-[#0098bf] active:scale-[0.98]",
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

              <div className="space-y-2">
                {courseData.resources?.length ? (
                  courseData.resources.map((r, idx) => {
                    const quizNum  = idx + 1;
                    const pdfKey   = `pdf${quizNum}Done`;
                    const quizKey  = `quiz${quizNum}Done`;
                    const pdfDone  = mp?.[pdfKey]  ?? false;
                    const quizDone = mp?.[quizKey] ?? false;
                    const quizFailed = localQuizFailed.has(quizNum);

                    return (
                      <div
                        key={r.id}
                        className={[
                          "w-full flex items-center gap-2 rounded-full px-4 py-[10px] ring-1 transition-all duration-300",
                          quizDone
                            ? "ring-2 ring-emerald-400 bg-emerald-400/8 text-emerald-300"
                            : "ring-1 ring-white/20 bg-white/4 text-white/85",
                          courseData.locked ? "opacity-50" : "",
                        ].join(" ")}
                      >
                        {/* Label — clickable to open PDF */}
                        <button
                          disabled={courseData.locked}
                          onClick={() => openResource(idx)}
                          className="flex-1 text-left text-sm font-medium truncate transition-colors hover:text-white focus:outline-none cursor-pointer disabled:cursor-not-allowed"
                        >
                          {r.label}
                        </button>

                        {/* Recurso visto — icon circle: grey until opened, green when done. Also opens the PDF. */}
                        <button
                          disabled={courseData.locked}
                          onClick={() => openResource(idx)}
                          title={pdfDone ? "Recurso visto — abrir de nuevo" : "Abrir recurso"}
                          className={[
                            "shrink-0 h-7 w-7 rounded-full flex items-center justify-center ring-1 transition-all duration-300 focus:outline-none",
                            pdfDone
                              ? "ring-emerald-400 bg-emerald-400/20 cursor-pointer hover:bg-emerald-400/30"
                              : "ring-white/20 bg-white/6 cursor-pointer hover:ring-white/40 hover:bg-white/12",
                            courseData.locked ? "cursor-not-allowed opacity-40" : "",
                          ].join(" ")}
                        >
                          <img
                            src={recursoIconSrc}
                            alt=""
                            draggable={false}
                            className={[
                              "h-4 w-4 object-contain select-none transition-all duration-300",
                              pdfDone ? "" : "grayscale opacity-50",
                            ].join(" ")}
                          />
                        </button>

                        {/* Quiz button */}
                        <button
                          disabled={!pdfDone || courseData.locked || quizDone}
                          onClick={() =>
                            !quizDone &&
                            pdfDone &&
                            setQuizModalOpen({ quizNum, resourceLabel: r.label })
                          }
                          title={
                            quizDone
                              ? "Quiz superado ✅"
                              : quizFailed
                              ? "Quiz fallado — reintenta"
                              : pdfDone
                              ? "Hacer quiz"
                              : "Abre el recurso primero"
                          }
                          className={[
                            "shrink-0 h-7 w-7 rounded-full flex items-center justify-center ring-1 transition-all duration-200",
                            quizDone
                              ? "ring-emerald-400 bg-emerald-400/15 cursor-default"
                              : quizFailed
                              ? "ring-red-400 bg-red-400/10 cursor-pointer hover:bg-red-400/20"
                              : pdfDone
                              ? "ring-white/35 bg-white/8 cursor-pointer hover:ring-[#00b5e2] hover:bg-[#00b5e2]/15"
                              : "ring-white/10 bg-white/3 cursor-not-allowed opacity-40",
                          ].join(" ")}
                        >
                          <img
                            src={quizIconSrc}
                            alt="Quiz"
                            className="h-4 w-4 object-contain"
                            draggable={false}
                          />
                        </button>
                      </div>
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

      {/* Resource quiz modal */}
      {quizModalOpen && (
        <ResourceQuizModal
          modulo={modulo}
          quizNum={quizModalOpen.quizNum}
          resourceLabel={quizModalOpen.resourceLabel}
          onClose={() => setQuizModalOpen(null)}
          onPassed={() => {
            // Remove from failed set if it was there and refresh progress
            setLocalQuizFailed((prev) => {
              const next = new Set(prev);
              next.delete(quizModalOpen.quizNum);
              return next;
            });
            setQuizModalOpen(null);
            fetchProgress();
          }}
          onFailed={() => {
            // Mark this quiz failed locally so the button turns red
            setLocalQuizFailed((prev) => new Set(prev).add(quizModalOpen.quizNum));
          }}
        />
      )}
    </>
  );
}
