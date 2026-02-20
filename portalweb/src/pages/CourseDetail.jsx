import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { getMyProgress } from "@/services/progressService";
import { useState } from "react";

// Definición de cursos con contenido detallado
const COURSE_DATA = {
  "punto-cero-calma": {
    title: "Punto Cero CALMA",
    subtitle: "Donde inicia tu viaje interior",
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
  },
  "bosque-emociones": {
    title: "Bosque de las Emociones",
    subtitle: "Reconéctate con tu interior",
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
  },
  "jardin-mental": {
    title: "Jardín Mental",
    subtitle: "Siembra tus metas, florece tu mente",
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
  },
  "lago-suenos": {
    title: "Lago de los Sueños",
    subtitle: "El reflejo de tus libertades",
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
  },
};

export default function CourseDetail() {
  const { courseKey } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const courseData = useMemo(() => {
    return COURSE_DATA[courseKey] || null;
  }, [courseKey]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const p = await getMyProgress();
        setProgress(p);
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [courseKey]);

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
