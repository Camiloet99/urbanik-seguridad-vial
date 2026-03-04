/**
 * moduleQuizzes.js
 *
 * 20 multiple-choice questions per resource (pdf1–pdf4) per module (1–6).
 * Each question has 4 options and exactly one correct answer.
 *
 * Shape:
 *   MODULE_QUIZZES[modulo][quizNum] = {
 *     title:     string,
 *     questions: Question[],   // always 20
 *   }
 *
 *   Question = {
 *     id:      string,
 *     text:    string,
 *     options: { id: string, text: string }[],
 *     correct: string,
 *   }
 *
 * NOTE: Questions marked ⚠️ PLACEHOLDER should be replaced with real content.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Generates 20 generic placeholder road-safety questions for a quiz slot. */
function ph(modulo, quiz, title) {
  const topics = [
    ["el concepto principal de este recurso", "a", "b", "c", "d", "b"],
    ["el objetivo central del documento", "Mejorar trámites", "Proteger la vida y reducir siniestros viales", "Aumentar el parque automotor", "Regular impuestos vehiculares", "b"],
    ["el principal actor responsable de la seguridad vial", "Solo las autoridades", "Solo los conductores", "Todos los actores viales de forma compartida", "Las empresas de transporte", "c"],
    ["el indicador clave de evaluación del plan", "Ingreso nacional bruto", "Tasa de mortalidad por accidentes de tránsito", "PIB per cápita", "Nivel de urbanización", "b"],
    ["la definición de factor de riesgo vial", "Una infracción de tránsito sin consecuencias", "Una condición o comportamiento que aumenta la probabilidad de un siniestro", "El valor de la multa por exceso de velocidad", "El número de vehículos en circulación", "b"],
    ["el enfoque de la visión cero aplicado a este recurso", "Aceptar un número tolerable de muertes viales", "Reducir costos del seguro vehicular", "Lograr que ninguna muerte o lesión grave sea aceptable en las vías", "Eliminar todos los vehículos privados", "c"],
    ["la jerarquía de usuarios vulnerables en la vía", "Conductores de vehículos pesados primero", "Peatones, ciclistas y motociclistas tienen prioridad", "Los vehículos de carga tienen prelación absoluta", "Todos los usuarios tienen exactamente el mismo nivel de riesgo", "b"],
    ["una medida efectiva de control de velocidad mencionada", "Publicidad en medios de comunicación", "Cámaras de fotodetección y control automático", "Reducir el precio del combustible", "Ampliar los carriles de circulación", "b"],
    ["el rol de la infraestructura en la seguridad vial", "No influye en los accidentes", "Puede diseñarse para minimizar la gravedad de los siniestros", "Solo importa en carreteras rurales", "Es responsabilidad exclusiva del usuario vial", "b"],
    ["el concepto de movilidad segura y sostenible", "Priorizar el vehículo privado sobre todos los modos", "Desplazarse con el menor riesgo e impacto ambiental posible", "Suprimir el transporte público", "Aumentar la velocidad promedio de circulación", "b"],
    ["qué establece el documento respecto a la educación vial", "No es relevante para adultos", "Es un pilar fundamental junto con la ingeniería y la legislación", "Solo debe impartirse en primaria", "No tiene impacto medible en siniestros", "b"],
    ["la tasa de mortalidad vial en Colombia según el documento", "Inferior a todos los países de la región", "Una de las más altas de América Latina y con tendencia a mejorar gradualmente", "Ya dentro de los estándares óptimos de la OMS", "Sin datos disponibles para análisis", "b"],
    ["el concepto de 'calle completa' en planificación vial", "Una vía exclusiva para vehículos motorizados", "Una vía diseñada para todos los modos de transporte con seguridad", "Una autopista de alta capacidad", "Un carril exclusivo para transporte de carga", "b"],
    ["la responsabilidad del sector salud en seguridad vial", "Ninguna; es tema exclusivo de tránsito", "Atención prehospitalaria, rehabilitación y vigilancia epidemiológica de siniestros", "Solo atender lesionados graves en hospitales", "Definir las normas de tránsito", "b"],
    ["qué define el documento sobre el sistema seguro de tránsito", "Un sistema donde los errores humanos son inevitablemente fatales", "Un sistema donde ningún error humano debería resultar en muerte o lesión grave", "Un sistema que elimina al conductor humano", "Un sistema de sanciones más estrictas", "b"],
    ["el mecanismo de coordinación interinstitucional propuesto", "Comités departamentales sin articulación nacional", "Un ente rector nacional con mesas técnicas intersectoriales", "Delegación total a municipios", "Exclusiva responsabilidad de la Policía de Tránsito", "b"],
    ["la fuente de financiación principal para iniciativas de seguridad vial", "Donaciones de empresas privadas únicamente", "Presupuesto nacional, recursos de regalías y aportes del SOAT", "Solo cooperación internacional", "Impuesto a nuevos vehículos eléctricos", "b"],
    ["el indicador de resultado más utilizado en el documento", "Número de vehículos inspeccionados", "Número de fallecidos y heridos graves en siniestros de tránsito", "Cantidad de policías de tránsito capacitados", "Kilómetros de vía construidos anualmente", "b"],
    ["la relación entre velocidad y gravedad de las lesiones según el recurso", "No existe relación comprobada", "A mayor velocidad, exponencialmente mayor probabilidad de muerte o lesion grave", "La velocidad solo afecta en zonas rurales", "Solo importa en motos, no en autos", "b"],
    ["la meta de reducción de siniestros como referencia en el documento", "Mantener la tasa actual sin variación", "Reducir al menos un 50% las muertes viales en el período del plan", "Eliminar el 100% de accidentes en el primer año", "Aumentar las multas para generar ingresos", "b"],
  ];

  return {
    title,
    questions: topics.map(([stem, a, b, c, d, correct], i) => ({
      id: `m${modulo}q${quiz}_${i + 1}`,
      text: `⚠️ PLACEHOLDER ${i + 1} — ¿Cuál es la afirmación correcta sobre ${stem}? (Módulo ${modulo} · Recurso ${quiz})`,
      options: [
        { id: "a", text: a },
        { id: "b", text: b },
        { id: "c", text: c },
        { id: "d", text: d },
      ],
      correct,
    })),
  };
}

// ---------------------------------------------------------------------------
// Module 1 — Fundamentos de Seguridad Vial
// ---------------------------------------------------------------------------

const M1_Q1 = {
  title: "Quiz — Plan Nacional de Seguridad Vial",
  questions: [
    {
      id: "m1q1_01",
      text: "¿Cuál es el principal objetivo del Plan Nacional de Seguridad Vial (PNSV)?",
      options: [
        { id: "a", text: "Incrementar el número de vehículos en circulación" },
        { id: "b", text: "Reducir la accidentalidad y las muertes en las vías colombianas" },
        { id: "c", text: "Aumentar los ingresos por multas de tránsito" },
        { id: "d", text: "Construir más kilómetros de carretera" },
      ],
      correct: "b",
    },
    {
      id: "m1q1_02",
      text: "¿Cuántos pilares estratégicos contempla el PNSV?",
      options: [
        { id: "a", text: "3 pilares" },
        { id: "b", text: "7 pilares" },
        { id: "c", text: "5 pilares" },
        { id: "d", text: "10 pilares" },
      ],
      correct: "c",
    },
    {
      id: "m1q1_03",
      text: "¿Qué organismo lidera la implementación del PNSV en Colombia?",
      options: [
        { id: "a", text: "Ministerio de Hacienda" },
        { id: "b", text: "Ministerio de Transporte" },
        { id: "c", text: "Ministerio de Educación" },
        { id: "d", text: "Policía Nacional" },
      ],
      correct: "b",
    },
    {
      id: "m1q1_04",
      text: "¿Cuál es la principal causa de mortalidad vial según el PNSV?",
      options: [
        { id: "a", text: "Fallas mecánicas" },
        { id: "b", text: "Señalización deficiente" },
        { id: "c", text: "El comportamiento humano" },
        { id: "d", text: "Condiciones climáticas adversas" },
      ],
      correct: "c",
    },
    {
      id: "m1q1_05",
      text: "Según el PNSV, ¿qué usuarios de la vía son los más vulnerables?",
      options: [
        { id: "a", text: "Conductores de vehículos particulares" },
        { id: "b", text: "Peatones, ciclistas y motociclistas" },
        { id: "c", text: "Conductores de buses" },
        { id: "d", text: "Pasajeros de transporte aéreo" },
      ],
      correct: "b",
    },
    {
      id: "m1q1_06",
      text: "¿Cuál es la meta de reducción de muertes establecida en el PNSV?",
      options: [
        { id: "a", text: "10% en 10 años" },
        { id: "b", text: "100% en 2 años" },
        { id: "c", text: "50% respecto al año base en el período del plan" },
        { id: "d", text: "30% en 20 años" },
      ],
      correct: "c",
    },
    {
      id: "m1q1_07",
      text: "¿Cuál de los siguientes es un pilar del PNSV?",
      options: [
        { id: "a", text: "Gestión del parque automotor" },
        { id: "b", text: "Gestión de la velocidad" },
        { id: "c", text: "Aumento de peajes" },
        { id: "d", text: "Reducción de impuestos vehiculares" },
      ],
      correct: "b",
    },
    {
      id: "m1q1_08",
      text: "¿Qué enfoque filosófico promueve el PNSV respecto a las muertes viales?",
      options: [
        { id: "a", text: "Visión Cien (tolerancia cero a los accidentes)" },
        { id: "b", text: "Visión Cero (ninguna muerte es aceptable)" },
        { id: "c", text: "Visión Moderada (algunas muertes son inevitables)" },
        { id: "d", text: "Visión Pragmática (reducir costos del SOAT)" },
      ],
      correct: "b",
    },
    {
      id: "m1q1_09",
      text: "¿Con qué instrumento internacional está alineado el PNSV?",
      options: [
        { id: "a", text: "Protocolo de Kioto" },
        { id: "b", text: "Acuerdos de Basilea" },
        { id: "c", text: "Decenio de Acción para la Seguridad Vial de Naciones Unidas" },
        { id: "d", text: "Tratado de Libre Comercio con la UE" },
      ],
      correct: "c",
    },
    {
      id: "m1q1_10",
      text: "¿Qué incluye el pilar de 'Atención y rehabilitación de víctimas' del PNSV?",
      options: [
        { id: "a", text: "Multas más altas para conductores infractores" },
        { id: "b", text: "Cursos de manejo defensivo obligatorios" },
        { id: "c", text: "Atención prehospitalaria oportuna y rehabilitación integral" },
        { id: "d", text: "Reducción de velocidad máxima en autopistas" },
      ],
      correct: "c",
    },
    {
      id: "m1q1_11",
      text: "¿Qué papel tiene la educación vial dentro del PNSV?",
      options: [
        { id: "a", text: "Es opcional y no tiene impacto medible" },
        { id: "b", text: "Es un pilar fundamental para cambiar comportamientos" },
        { id: "c", text: "Solo aplica para conductores profesionales" },
        { id: "d", text: "Se limita a campañas publicitarias esporádicas" },
      ],
      correct: "b",
    },
    {
      id: "m1q1_12",
      text: "¿Cuál es la relación entre velocidad excesiva y accidentalidad según el PNSV?",
      options: [
        { id: "a", text: "No existe relación comprobada" },
        { id: "b", text: "A mayor velocidad, mayor probabilidad y gravedad de los siniestros" },
        { id: "c", text: "La velocidad solo importa en motocicletas" },
        { id: "d", text: "Solo afecta en horas nocturnas" },
      ],
      correct: "b",
    },
    {
      id: "m1q1_13",
      text: "¿Qué relevancia tiene el uso del cinturón de seguridad según el plan?",
      options: [
        { id: "a", text: "Es opcional para pasajeros en la parte trasera" },
        { id: "b", text: "Solo es obligatorio en carretera, no en ciudad" },
        { id: "c", text: "Reduce significativamente la mortalidad en colisiones" },
        { id: "d", text: "No tiene impacto en lesiones graves" },
      ],
      correct: "c",
    },
    {
      id: "m1q1_14",
      text: "¿Cuál es el rol de las entidades territoriales (municipios/departamentos) en el PNSV?",
      options: [
        { id: "a", text: "No tienen responsabilidad directa" },
        { id: "b", text: "Implementar estrategias locales articuladas con el plan nacional" },
        { id: "c", text: "Únicamente financiar obras de infraestructura" },
        { id: "d", text: "Contratar condutores internacionales" },
      ],
      correct: "b",
    },
    {
      id: "m1q1_15",
      text: "¿Qué establece el PNSV sobre el alcohol y la conducción?",
      options: [
        { id: "a", text: "Es permitido hasta un nivel de 0.8 g/L en sangre" },
        { id: "b", text: "El alcohol multiplica el riesgo de siniestro y está restringido legalmente" },
        { id: "c", text: "Solo es peligroso en conductores menores de 25 años" },
        { id: "d", text: "No tiene relación con la accidentalidad nocturna" },
      ],
      correct: "b",
    },
    {
      id: "m1q1_16",
      text: "Según el PNSV, ¿qué es un 'sistema seguro'?",
      options: [
        { id: "a", text: "Un sistema que elimina todos los vehículos" },
        { id: "b", text: "Un sistema donde el error humano puede ocurrir pero no debe causar muertes" },
        { id: "c", text: "Un sistema solo de transporte público" },
        { id: "d", text: "Un sistema gestionado por la Policía de Tránsito" },
      ],
      correct: "b",
    },
    {
      id: "m1q1_17",
      text: "¿Qué importancia tiene el mantenimiento vial según el PNSV?",
      options: [
        { id: "a", text: "No influye en la seguridad de los usuarios" },
        { id: "b", text: "Una infraestructura segura reduce la probabilidad y gravedad de siniestros" },
        { id: "c", text: "Solo es relevante en zonas rurales" },
        { id: "d", text: "Es responsabilidad exclusiva de los constructores privados" },
      ],
      correct: "b",
    },
    {
      id: "m1q1_18",
      text: "¿Cuál es la función de los sistemas de información y estadísticas en el PNSV?",
      options: [
        { id: "a", text: "Multar automáticamente a los conductores" },
        { id: "b", text: "Permitir el análisis de causas y la toma de decisiones basada en evidencia" },
        { id: "c", text: "Registrar solo los accidentes mortales" },
        { id: "d", text: "Gestionar el pago de seguros vehiculares" },
      ],
      correct: "b",
    },
    {
      id: "m1q1_19",
      text: "¿Qué rol tienen las empresas privadas según el PNSV?",
      options: [
        { id: "a", text: "Ninguno; la seguridad vial es responsabilidad exclusiva del Estado" },
        { id: "b", text: "Corresponsables mediante flotas seguras, capacitación y cultura vial corporativa" },
        { id: "c", text: "Solo participan financiando campañas publicitarias" },
        { id: "d", text: "Actúan como fiscalizadores del cumplimiento vial" },
      ],
      correct: "b",
    },
    {
      id: "m1q1_20",
      text: "¿Cuál es la visión de largo plazo del PNSV en Colombia?",
      options: [
        { id: "a", text: "Aumentar la flota vehicular al doble" },
        { id: "b", text: "Ser el país con más kilómetros de autopista en Latinoamérica" },
        { id: "c", text: "Lograr un sistema de movilidad que proteja la vida de todos los actores viales" },
        { id: "d", text: "Eliminar las motocicletas de las vías urbanas" },
      ],
      correct: "c",
    },
  ],
};

const M1_Q2 = ph(1, 2, "Quiz — Manual de Señalización Vial");
const M1_Q3 = ph(1, 3, "Quiz — ABC Víctimas en Accidentes de Tránsito");
const M1_Q4 = ph(1, 4, "Quiz — Ruta de Atención a Víctimas");

// ---------------------------------------------------------------------------
// Module 2 — Movilidad y Seguridad Peatonal
// ---------------------------------------------------------------------------
const M2_Q1 = ph(2, 1, "Quiz — Recurso 1 · Seguridad Peatonal");
const M2_Q2 = ph(2, 2, "Quiz — Recurso 2 · Seguridad Peatonal");
const M2_Q3 = ph(2, 3, "Quiz — Recurso 3 · Seguridad Peatonal");
const M2_Q4 = ph(2, 4, "Quiz — Recurso 4 · Seguridad Peatonal");

// ---------------------------------------------------------------------------
// Module 3 — Movilidad Sostenible y Activa
// ---------------------------------------------------------------------------
const M3_Q1 = ph(3, 1, "Quiz — Recurso 1 · Movilidad Sostenible");
const M3_Q2 = ph(3, 2, "Quiz — Recurso 2 · Movilidad Sostenible");
const M3_Q3 = ph(3, 3, "Quiz — Recurso 3 · Movilidad Sostenible");
const M3_Q4 = ph(3, 4, "Quiz — Recurso 4 · Movilidad Sostenible");

// ---------------------------------------------------------------------------
// Module 4 — Seguridad Vial para Motociclistas
// ---------------------------------------------------------------------------
const M4_Q1 = ph(4, 1, "Quiz — Recurso 1 · Motociclistas");
const M4_Q2 = ph(4, 2, "Quiz — Recurso 2 · Motociclistas");
const M4_Q3 = ph(4, 3, "Quiz — Recurso 3 · Motociclistas");
const M4_Q4 = ph(4, 4, "Quiz — Recurso 4 · Motociclistas");

// ---------------------------------------------------------------------------
// Module 5 — Conducción Segura con Automóviles
// ---------------------------------------------------------------------------
const M5_Q1 = ph(5, 1, "Quiz — Recurso 1 · Conducción Segura");
const M5_Q2 = ph(5, 2, "Quiz — Recurso 2 · Conducción Segura");
const M5_Q3 = ph(5, 3, "Quiz — Recurso 3 · Conducción Segura");
const M5_Q4 = ph(5, 4, "Quiz — Recurso 4 · Conducción Segura");

// ---------------------------------------------------------------------------
// Module 6 — Vehículos de Carga y Operación Segura
// ---------------------------------------------------------------------------
const M6_Q1 = ph(6, 1, "Quiz — Recurso 1 · Vehículos de Carga");
const M6_Q2 = ph(6, 2, "Quiz — Recurso 2 · Vehículos de Carga");
const M6_Q3 = ph(6, 3, "Quiz — Recurso 3 · Vehículos de Carga");
const M6_Q4 = ph(6, 4, "Quiz — Recurso 4 · Vehículos de Carga");

// ---------------------------------------------------------------------------
// Exported map
// ---------------------------------------------------------------------------

/**
 * MODULE_QUIZZES[modulo][quizNum] → { title, questions }
 * modulo : 1–6
 * quizNum: 1–4 (matches pdf1–pdf4)
 */
export const MODULE_QUIZZES = {
  1: { 1: M1_Q1, 2: M1_Q2, 3: M1_Q3, 4: M1_Q4 },
  2: { 1: M2_Q1, 2: M2_Q2, 3: M2_Q3, 4: M2_Q4 },
  3: { 1: M3_Q1, 2: M3_Q2, 3: M3_Q3, 4: M3_Q4 },
  4: { 1: M4_Q1, 2: M4_Q2, 3: M4_Q3, 4: M4_Q4 },
  5: { 1: M5_Q1, 2: M5_Q2, 3: M5_Q3, 4: M5_Q4 },
  6: { 1: M6_Q1, 2: M6_Q2, 3: M6_Q3, 4: M6_Q4 },
};

/** Pass threshold: the user must answer at least this fraction correctly. */
export const QUIZ_PASS_THRESHOLD = 0.8;
