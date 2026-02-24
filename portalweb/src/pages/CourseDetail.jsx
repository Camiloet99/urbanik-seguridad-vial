import { useParams, useNavigate } from "react-router-dom";
<<<<<<< HEAD
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
=======
import { useEffect, useMemo } from "react";
import { getMyProgress } from "@/services/progressService";
import { useState } from "react";

// Definición de cursos con contenido detallado
>>>>>>> origin/master
const COURSE_DATA = {
  "punto-cero-calma": {
    title: "Punto Cero CALMA",
    subtitle: "Donde inicia tu viaje interior",
<<<<<<< HEAD
    bgImage: card1,
    locked: false,
    resources: ["PDF 1", "PDF 2", "PDF 3"],
=======
    description: "Descubre el espacio de tranquilidad y paz mental. Punto Cero CALMA es tu primer paso hacia el autoconocimiento.",
    longDescription: "En este módulo aprenderás técnicas de meditación, respiración consciente y mindfulness. Es el punto de partida para tu transformación interior.",
    color: "#1995F1",
    icon: "🧘",
    modules: [
      { id: 1, title: "Introducción a la Calma", duration: "15 min" },
      { id: 2, title: "Técnicas de Respiración", duration: "20 min" },
      { id: 3, title: "Meditación Guiada", duration: "25 min" },
      { id: 4, title: "Calma en Acción", duration: "30 min" },
    ],
    objectives: [
      "Aprender a encontrar tu espacio de paz",
      "Dominar técnicas de respiración básicas",
      "Practicar meditación consciente",
      "Integrar la calma en tu día a día",
    ],
>>>>>>> origin/master
  },
  "bosque-emociones": {
    title: "Bosque de las Emociones",
    subtitle: "Reconéctate con tu interior",
<<<<<<< HEAD
    bgImage: card2,
    locked: false,
    resources: ["PDF 1", "PDF 2"],
=======
    description: "Explora el bosque de tus emociones y aprende a reconocerlas, entenderlas y gestionarlas.",
    longDescription: "Dentro del bosque encontrarás la naturaleza de tus sentimientos. Aprenderás a navegar por tus emociones con sabiduría y autocompasión.",
    color: "#FFC107",
    icon: "🌳",
    modules: [
      { id: 1, title: "Mapa Emocional", duration: "20 min" },
      { id: 2, title: "Identificar Emociones", duration: "25 min" },
      { id: 3, title: "Expresión Emocional", duration: "30 min" },
      { id: 4, title: "Equilibrio Emocional", duration: "35 min" },
    ],
    objectives: [
      "Identificar tus emociones fundamentales",
      "Entender el origen de tus sentimientos",
      "Desarrollar inteligencia emocional",
      "Crear un equilibrio emocional estable",
    ],
>>>>>>> origin/master
  },
  "jardin-mental": {
    title: "Jardín Mental",
    subtitle: "Siembra tus metas, florece tu mente",
<<<<<<< HEAD
    bgImage: card3,
    locked: false,
    resources: ["PDF 1", "PDF 2", "PDF 3"],
=======
    description: "Cultiva tu mente como si fuera un jardín. Siembra metas significativas y ve cómo florecen.",
    longDescription: "Tu mente es un jardín que requiere cuidado y atención. Aquí aprenderás a cultivar pensamientos positivos, establecer metas claras y cuidar tu bienestar mental.",
    color: "#8BC34A",
    icon: "🌱",
    modules: [
      { id: 1, title: "Preparar el Terreno", duration: "20 min" },
      { id: 2, title: "Sembrar Metas", duration: "25 min" },
      { id: 3, title: "Cultivar Hábitos", duration: "30 min" },
      { id: 4, title: "Cosechar Resultados", duration: "35 min" },
    ],
    objectives: [
      "Definir metas claras y alcanzables",
      "Crear hábitos de crecimiento",
      "Superar creencias limitantes",
      "Lograr tu florecimiento personal",
    ],
>>>>>>> origin/master
  },
  "lago-suenos": {
    title: "Lago de los Sueños",
    subtitle: "El reflejo de tus libertades",
<<<<<<< HEAD
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
=======
    description: "Mira en las aguas del lago y descubre el reflejo de tus libertades más profundas.",
    longDescription: "El lago es un espejo de tu verdadera esencia. En sus aguas tranquilas encontrarás la claridad para vivir con libertad, autenticidad y propósito.",
    color: "#9C27B0",
    icon: "💎",
    modules: [
      { id: 1, title: "Autoconocimiento Profundo", duration: "25 min" },
      { id: 2, title: "Libertad Interior", duration: "30 min" },
      { id: 3, title: "Autenticidad", duration: "30 min" },
      { id: 4, title: "Viviendo tu Propósito", duration: "35 min" },
    ],
    objectives: [
      "Descubrir tu verdadera esencia",
      "Liberar creencias restrictivas",
      "Vivir con autenticidad",
      "Encontrar tu propósito de vida",
    ],
>>>>>>> origin/master
  },
};

export default function CourseDetail() {
  const { courseKey } = useParams();
  const navigate = useNavigate();
<<<<<<< HEAD

  const [progress, setProgress] = useState(null);

  const courseData = useMemo(() => COURSE_DATA[courseKey] || null, [courseKey]);
=======
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const courseData = useMemo(() => {
    return COURSE_DATA[courseKey] || null;
  }, [courseKey]);
>>>>>>> origin/master

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const p = await getMyProgress();
        setProgress(p);
<<<<<<< HEAD
      } catch (err) {
        // si el back no está, no bloqueamos UI
        console.warn("Progress no disponible (backend desconectado).", err);
=======
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setLoading(false);
>>>>>>> origin/master
      }
    };
    fetchProgress();
  }, [courseKey]);

<<<<<<< HEAD
  // Mapa mínimo para ProgressCard/ActionList (sin romper si no hay back)
  const progressMap = useMemo(() => {
    const m = new Map();
    m.set("test-inicial", !!progress?.testInitialDone);
    m.set("test-salida", !!progress?.testExitDone);
    return m;
  }, [progress]);

=======
>>>>>>> origin/master
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
<<<<<<< HEAD
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
=======
    <div className="min-h-[calc(80vh-80px)] pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl mb-8">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `linear-gradient(135deg, ${courseData.color}20 0%, ${courseData.color}05 100%)`,
          }}
        />
        <div className="p-8 sm:p-12">
          <button
            onClick={() => navigate("/courses")}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition"
          >
            ← Volver a Cursos
          </button>

          <div className="flex items-start gap-6">
            <div
              className="text-6xl"
              style={{
                filter: `drop-shadow(0 4px 12px ${courseData.color}40)`,
              }}
            >
              {courseData.icon}
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                {courseData.title}
              </h1>
              <p className="text-xl text-white/80 mb-4">{courseData.subtitle}</p>
              <p className="text-base text-white/70 max-w-2xl">
                {courseData.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Descripción larga */}
          <section className="rounded-2xl bg-white/5 backdrop-blur-md p-6 sm:p-8 ring-1 ring-white/10">
            <h2 className="text-2xl font-semibold text-white mb-4">Sobre este curso</h2>
            <p className="text-white/80 leading-relaxed text-base">
              {courseData.longDescription}
            </p>
          </section>

          {/* Módulos */}
          <section className="rounded-2xl bg-white/5 backdrop-blur-md p-6 sm:p-8 ring-1 ring-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">Módulos del Curso</h2>
            <div className="space-y-3">
              {courseData.modules.map((module, index) => (
                <div
                  key={module.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition cursor-pointer group"
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-full font-semibold text-white"
                    style={{ backgroundColor: courseData.color + "40" }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white group-hover:text-white transition">
                      {module.title}
                    </h3>
                    <p className="text-sm text-white/60">{module.duration}</p>
                  </div>
                  <div className="text-white/40 group-hover:text-white/60 transition">
                    →
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Objetivos */}
          <section className="rounded-2xl bg-white/5 backdrop-blur-md p-6 sm:p-8 ring-1 ring-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">Lo que aprenderás</h2>
            <ul className="space-y-3">
              {courseData.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-3 text-white/80">
                  <div
                    className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: courseData.color }}
                  />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info Card */}
          <div
            className="rounded-2xl p-6 border-2 backdrop-blur-md"
            style={{
              backgroundColor: courseData.color + "10",
              borderColor: courseData.color + "40",
            }}
          >
            <h3 className="font-semibold text-white mb-4">Información del Curso</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-white/60 mb-1">Duración Total</p>
                <p className="text-white font-medium">
                  {courseData.modules.reduce(
                    (acc, m) => acc + parseInt(m.duration),
                    0
                  )}{" "}
                  minutos
                </p>
              </div>
              <div>
                <p className="text-white/60 mb-1">Módulos</p>
                <p className="text-white font-medium">{courseData.modules.length} módulos</p>
              </div>
              <div>
                <p className="text-white/60 mb-1">Nivel</p>
                <p className="text-white font-medium">Principiante a Intermedio</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            style={{
              background: courseData.color,
            }}
            className="w-full rounded-xl text-white font-semibold px-6 py-4 hover:brightness-110 transition shadow-lg"
          >
            Comenzar Curso
          </button>

          {/* Progreso */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-md p-6 ring-1 ring-white/10">
            <h3 className="font-semibold text-white mb-4">Tu Progreso</h3>
            <div className="w-full bg-white/10 rounded-full h-2 mb-3">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: "0%",
                  background: courseData.color,
                }}
              />
            </div>
            <p className="text-sm text-white/60">0% completado</p>
          </div>
        </div>
      </div>
    </div>
  );
}
>>>>>>> origin/master
