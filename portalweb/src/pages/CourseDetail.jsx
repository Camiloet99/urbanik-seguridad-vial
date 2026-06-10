import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import CertificateModal from "@/components/courses/CertificateModal";
import {
  getMyProgress,
  getModuleProgress,
  COURSE_KEY_TO_MODULO,
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
import ChatWidget from "../components/courses/ChatWidget";
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
  const [certModal, setCertModal] = useState(null);
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
    m.set("test-inicial", !!mp.testInitialDone);
    m.set("test-salida", !!mp.testExitDone);
    m.set("califica", !!mp.calificationDone);
    m.set("experiencia", !!isMonedaEarned(progress, modulo));
    m.set("pdf1", !!mp.pdf1Done);
    m.set("pdf2", !!mp.pdf2Done);
    m.set("pdf3", !!mp.pdf3Done);
    m.set("pdf4", !!mp.pdf4Done);
    m.set("quiz1", !!mp.quiz1Done);
    m.set("quiz2", !!mp.quiz2Done);
    m.set("quiz3", !!mp.quiz3Done);
    m.set("quiz4", !!mp.quiz4Done);
    return m;
  }, [mp, progress, modulo]);

  // True when ALL prereqs before test-salida are met
  // Chain: introduccion → test-inicial → (recursos×4 + experiencia) → test-salida
  const canDoTestSalida = useMemo(() => {
    if (!mp) return false;
    return (
      mp.testInitialDone &&
      mp.quiz1Done &&
      mp.quiz2Done &&
      mp.quiz3Done &&
      mp.quiz4Done &&
      experienciaDone
    );
  }, [mp, experienciaDone]);

  // Module certificate: requires the entire chain to be complete
  const moduleCertUnlocked = useMemo(() => {
    if (!mp || !progress || !modulo) return false;
    return (
      mp.testInitialDone &&
      mp.quiz1Done && mp.quiz2Done && mp.quiz3Done && mp.quiz4Done &&
      isMonedaEarned(progress, modulo) &&
      mp.testExitDone &&
      mp.calificationDone
    );
  }, [mp, progress, modulo]);

  // Human-readable list of what's still missing for the certificate
  const certMissingItems = useMemo(() => {
    if (!mp) return [];
    const missing = [];
    if (!mp.testInitialDone) missing.push("el test inicial");
    const quizPending = [mp.quiz1Done, mp.quiz2Done, mp.quiz3Done, mp.quiz4Done].filter(Boolean).length;
    if (quizPending < 4) {
      const n = 4 - quizPending;
      missing.push(`${n} quiz${n > 1 ? "es" : ""} de recursos`);
    }
    if (!isMonedaEarned(progress, modulo)) missing.push("la experiencia 3D");
    if (!mp.testExitDone) missing.push("el test de salida");
    if (!mp.calificationDone) missing.push("el Calificanos");
    return missing;
  }, [mp, progress, modulo]);

  // Locked messages for ActionList rows — only mention what's actually missing
  const lockedItems = useMemo(() => {
    if (!mp) return {};
    const items = {};

    // test-salida: build list of only the missing prereqs
    if (!canDoTestSalida) {
      const missing = [];
      if (!mp.testInitialDone) missing.push("el test inicial");
      const quizPending = [mp.quiz1Done, mp.quiz2Done, mp.quiz3Done, mp.quiz4Done].filter(Boolean).length;
      if (quizPending < 4) {
        const n = 4 - quizPending;
        missing.push(`${n} quiz${n > 1 ? "es" : ""} de recursos`);
      }
      if (!experienciaDone) missing.push("la experiencia 3D");
      items["test-salida"] = missing.length
        ? `Falta completar: ${missing.join(", ")}`
        : "";
    }

    // califica requires test-salida
    if (!mp.testExitDone) {
      items["califica"] = "Completa el test de salida primero";
    }

    return items;
  }, [mp, canDoTestSalida, experienciaDone]);

  const smartCta = useMemo(() => {
    if (courseData?.locked) {
      return { label: "Próximamente", onClick: () => { } };
    }
    if (!mp) {
      return { label: "", onClick: () => { } };
    }
    if (!mp.testInitialDone) {
      return { label: "Test de inicio", onClick: () => navigate(`/test-inicial/${modulo}`) };
    }
    if (!mp.testExitDone && canDoTestSalida) {
      return { label: "Test de salida", onClick: () => navigate(`/test-salida/${modulo}`) };
    }
    if (mp.testExitDone && !mp.calificationDone) {
      return { label: "Calificar módulo", onClick: () => setIsRatingModalOpen(true) };
    }
    return { label: "", onClick: () => { } };
  }, [courseData, mp, modulo, canDoTestSalida, navigate]);

  // Play button -- marks experiencia done in localStorage then navigates
  const handleExperience = () => {
    if (!mp?.testInitialDone || !modulo) return;
    markExperienciaDone(modulo);
    setExperienciaDone(true);
    navigate("/experience", { state: { shareId: courseData.shareId ?? "", modulo } });
  };

  // Open PDF in-portal viewer — backend marks pdfNDone inside PdfVisor on mount
  const openResource = (resourceIndex) => {
    navigate(`/courses/${courseKey}/pdf/${resourceIndex + 1}`);
  };

  if (!courseData) {
    return (
      <div className="min-h-[calc(80vh-80px)] grid place-items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-4">Curso no encontrado</h1>
          <button
            onClick={() => navigate("/courses")}
            className="rounded-xl bg-[#1D4789] hover:brightness-110 text-white font-medium px-6 py-3 transition"
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

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px_320px]">
          <Hero
            title={courseData.title}
            subtitle={courseData.subtitle}
            bgImage={courseData.bgImage}
            ctaLabel={smartCta.label}
            onCtaClick={smartCta.onClick}
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
                "test-inicial": 10,
                "test-salida": 5,
                califica: 5,
                quiz1: 5,
                quiz2: 5,
                quiz3: 5,
                quiz4: 5,
                experiencia: 60,
              }}
            />

            {/* Per-module certificate */}
            <LockedTooltip
              disabled={!moduleCertUnlocked}
              placement="top"
              message={
                !moduleCertUnlocked && certMissingItems.length
                  ? `Falta completar: ${certMissingItems.join(", ")}`
                  : ""
              }
            >
              <button
                disabled={!moduleCertUnlocked}
                onClick={() => {
                  if (!moduleCertUnlocked) return;
                  setCertModal({ type: "modulo", n: modulo });
                }}
                className={[
                  "w-full flex items-center justify-between gap-3",
                  "rounded-2xl px-4 py-3 transition-all duration-300",
                  "focus:outline-none focus-visible:ring-2",
                  moduleCertUnlocked
                    ? [
                      "ring-2 ring-[#1D4789] bg-[#1D4789]/8 text-[#1D4789]",
                      "shadow-[0_0_18px_-6px_rgba(29,71,137,0.45)]",
                      "hover:bg-[#1D4789]/12 hover:shadow-[0_0_22px_-6px_rgba(29,71,137,0.55)]",
                      "focus-visible:ring-[#1D4789] cursor-pointer",
                    ].join(" ")
                    : "ring-1 ring-[#1D4789]/20 bg-white text-[#1a1a1a] cursor-not-allowed shadow-[0_4px_16px_rgba(0,0,0,0.08)]",
                ].join(" ")}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={[
                      "shrink-0 h-9 w-9 rounded-xl flex items-center justify-center ring-1",
                      moduleCertUnlocked
                        ? "ring-[#1D4789] bg-[#1D4789] text-white"
                        : "ring-[#1D4789]/20 bg-white text-[#1D4789] border border-[#1D4789]/30",
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
                    <p className={["text-[13px] truncate", moduleCertUnlocked ? "font-bold" : "font-semibold"].join(" ")}>
                      Certificado Módulo {modulo}
                    </p>
                    <p className={["text-[11px] mt-0.5 truncate", moduleCertUnlocked ? "font-bold" : ""].join(" ")}>
                      {moduleCertUnlocked
                        ? "Listo para descargar"
                        : certMissingItems.length
                          ? `Falta: ${certMissingItems.join(", ")}`
                          : "Módulo incompleto"}
                    </p>
                  </div>
                </div>
                <span
                  className={[
                    "shrink-0 h-7 w-7 rounded-full flex items-center justify-center ring-1 transition",
                    moduleCertUnlocked
                      ? "ring-[#1D4789] bg-[#1D4789] text-white"
                      : "ring-[#1D4789]/20 bg-white text-[#1D4789] border border-[#1D4789]/30",
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
        <div className="rounded-[28px] bg-white border border-[#1D4789]/20 shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_1fr_320px]">

            {/* Experiencia gamificada */}
            <div className="rounded-[22px] border border-[#1D4789]/30 bg-white overflow-hidden">
              <div
                className="relative h-[260px] bg-cover bg-center"
                style={{
                  backgroundImage: modulo
                    ? `url(${new URL(`../assets/courses/modules/module${modulo}.png`, import.meta.url).href})`
                    : undefined,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <LockedTooltip
                    disabled={!experienceCanPlay}
                    message="Completa el test inicial del modulo primero"
                    placement="top"
                  >
                    <button
                      className={[
                        "h-16 w-16 rounded-full bg-[#1D4789] grid place-items-center",
                        "shadow-[0_10px_30px_-12px_rgba(29,71,137,0.8)]",
                        "hover:bg-[#163672] active:scale-[0.98]",
                        "transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                        !experienceCanPlay ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                      ].join(" ")}
                      onClick={handleExperience}
                      disabled={!experienceCanPlay}
                      aria-label="Entrar a la experiencia"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-7 h-7 translate-x-0.5 text-white"
                        aria-hidden="true"
                      >
                        <path d="M6 4.75a.75.75 0 0 1 1.14-.638l12 7.25a.75.75 0 0 1 0 1.276l-12 7.25A.75.75 0 0 1 6 19.25V4.75Z" />
                      </svg>
                    </button>
                  </LockedTooltip>
                </div>
              </div>
              <div className="p-4">
                <p className="text-[#1a1a1a] text-sm">
                  {courseData.locked
                    ? "Este modulo esta en preparacion."
                    : !mp?.testInitialDone
                      ? "Haz el test inicial del modulo para desbloquear la experiencia."
                      : "Al hacer clic, entras a la experiencia gamificada del modulo."}
                </p>
              </div>
            </div>

            {/* Chat con NIA */}
            <ChatWidget locked={courseData.locked} />

            {/* Recursos */}
            <div className="rounded-[22px] border border-[#1D4789] bg-[#EEEEEE] p-5">
              <p className="text-[#1a1a1a] font-medium mb-4">Recursos:</p>

              {/* Lock banner — shown when test inicial is not yet done */}
              {!courseData.locked && !mp?.testInitialDone && (
                <div className="mb-3 flex items-center gap-2 rounded-2xl px-3 py-2 ring-1 ring-[#1D4789]/20 bg-[#1D4789]/5 text-[#1a1a1a]/50 text-xs">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0 opacity-60">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Haz el test inicial para acceder a los recursos
                </div>
              )}

              <div className="space-y-2">
                {courseData.resources?.length ? (
                  courseData.resources.map((r, idx) => {
                    const quizNum = idx + 1;
                    const pdfKey = `pdf${quizNum}Done`;
                    const quizKey = `quiz${quizNum}Done`;
                    const pdfDone = mp?.[pdfKey] ?? false;
                    const quizDone = mp?.[quizKey] ?? false;
                    const quizFailed = localQuizFailed.has(quizNum);
                    // Resources are locked until test inicial is done
                    const resourceLocked = courseData.locked || !mp?.testInitialDone;

                    return (
                      <div
                        key={r.id}
                        className={[
                          "w-full flex items-center gap-2 rounded-full px-4 py-[10px] ring-1 transition-all duration-300",
                          quizDone
                            ? "ring-2 ring-[#1D4789] bg-[#1D4789]/8 text-[#1D4789]"
                            : "ring-1 ring-[#1D4789]/25 bg-white text-[#1a1a1a]",
                          resourceLocked ? "opacity-40" : "",
                        ].join(" ")}
                      >
                        {/* Label — clickable to open PDF */}
                        <button
                          disabled={resourceLocked}
                          onClick={() => openResource(idx)}
                          title={resourceLocked ? "Haz el test inicial primero" : undefined}
                          className={[
                            "flex-1 text-left text-sm truncate transition-colors hover:text-[#1D4789] focus:outline-none cursor-pointer disabled:cursor-not-allowed",
                            quizDone ? "font-bold text-[#1D4789]" : "font-medium",
                          ].join(" ")}
                        >
                          {r.label}
                        </button>

                        {/* Recurso visto — icon circle: grey until opened, green when done. Also opens the PDF. */}
                        <button
                          disabled={resourceLocked}
                          onClick={() => openResource(idx)}
                          title={
                            resourceLocked
                              ? "Haz el test inicial primero"
                              : pdfDone
                                ? "Recurso visto — abrir de nuevo"
                                : "Abrir recurso"
                          }
                          className={[
                            "shrink-0 h-7 w-7 rounded-full flex items-center justify-center ring-1 transition-all duration-300 focus:outline-none",
                            pdfDone
                              ? "ring-[#1D4789] bg-[#1D4789] cursor-pointer hover:bg-[#163672]"
                              : "ring-[#1D4789] bg-white cursor-pointer hover:bg-[#F5F5F6]",
                            resourceLocked ? "cursor-not-allowed opacity-50" : "",
                          ].join(" ")}
                        >
                          <img
                            src={recursoIconSrc}
                            alt=""
                            draggable={false}
                            className="h-4 w-4 object-contain select-none transition-all duration-300"
                            style={!pdfDone ? {
                              filter: "brightness(0) saturate(100%) invert(23%) sepia(72%) saturate(1000%) hue-rotate(200deg) brightness(90%)"
                            } : {}}
                          />
                        </button>

                        {/* Quiz button */}
                        <button
                          disabled={!pdfDone || resourceLocked || quizDone}
                          onClick={() =>
                            !quizDone &&
                            pdfDone &&
                            !resourceLocked &&
                            setQuizModalOpen({ quizNum, resourceLabel: r.label })
                          }
                          title={
                            resourceLocked
                              ? "Haz el test inicial primero"
                              : quizDone
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
                              ? "ring-[#1D4789] bg-[#1D4789] cursor-default"
                              : quizFailed
                                ? "ring-red-500 bg-white cursor-pointer hover:bg-red-50"
                                : pdfDone && !resourceLocked
                                  ? "ring-[#1D4789] bg-white cursor-pointer hover:bg-[#F5F5F6]"
                                  : "ring-[#1D4789]/20 bg-white cursor-not-allowed",
                          ].join(" ")}
                        >
                          <img
                            src={quizIconSrc}
                            alt="Quiz"
                            className="h-[23px] w-[23px] object-contain"
                            draggable={false}
                            style={!quizDone ? {
                              filter: "brightness(0) saturate(100%) invert(23%) sepia(72%) saturate(1000%) hue-rotate(200deg) brightness(90%)"
                            } : {}}
                          />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-[#1a1a1a] text-sm">
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
      <CertificateModal certConfig={certModal} onClose={() => setCertModal(null)} />
      {quizModalOpen && (
        <ResourceQuizModal
          modulo={modulo}
          quizNum={quizModalOpen.quizNum}
          resourceLabel={quizModalOpen.resourceLabel}
          onClose={() => setQuizModalOpen(null)}
          onPassed={() => {
            // Remove from failed set if it was there and refresh progress.
            // Modal closes itself after the user sees the result and clicks Continuar.
            setLocalQuizFailed((prev) => {
              const next = new Set(prev);
              next.delete(quizModalOpen.quizNum);
              return next;
            });
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
