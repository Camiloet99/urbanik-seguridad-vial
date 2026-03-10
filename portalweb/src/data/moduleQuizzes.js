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
    ["el objetivo central del documento", "Mejorar trámites", "Proteger la vida y reducir siniestros viales", "Aumentar el parque automotor", "Regular impuestos vehiculares", "a"],
    ["el principal actor responsable de la seguridad vial", "Solo las autoridades", "Solo los conductores", "Todos los actores viales de forma compartida", "Las empresas de transporte", "a"],
    ["el indicador clave de evaluación del plan", "Ingreso nacional bruto", "Tasa de mortalidad por accidentes de tránsito", "PIB per cápita", "Nivel de urbanización", "a"],
    ["la definición de factor de riesgo vial", "Una infracción de tránsito sin consecuencias", "Una condición o comportamiento que aumenta la probabilidad de un siniestro", "El valor de la multa por exceso de velocidad", "El número de vehículos en circulación", "a"],
    ["el enfoque de la visión cero aplicado a este recurso", "Aceptar un número tolerable de muertes viales", "Reducir costos del seguro vehicular", "Lograr que ninguna muerte o lesión grave sea aceptable en las vías", "Eliminar todos los vehículos privados", "a"],
    ["la jerarquía de usuarios vulnerables en la vía", "Conductores de vehículos pesados primero", "Peatones, ciclistas y motociclistas tienen prioridad", "Los vehículos de carga tienen prelación absoluta", "Todos los usuarios tienen exactamente el mismo nivel de riesgo", "a"],
    ["una medida efectiva de control de velocidad mencionada", "Publicidad en medios de comunicación", "Cámaras de fotodetección y control automático", "Reducir el precio del combustible", "Ampliar los carriles de circulación", "a"],
    ["el rol de la infraestructura en la seguridad vial", "No influye en los accidentes", "Puede diseñarse para minimizar la gravedad de los siniestros", "Solo importa en carreteras rurales", "Es responsabilidad exclusiva del usuario vial", "a"],
    ["el concepto de movilidad segura y sostenible", "Priorizar el vehículo privado sobre todos los modos", "Desplazarse con el menor riesgo e impacto ambiental posible", "Suprimir el transporte público", "Aumentar la velocidad promedio de circulación", "a"],
    ["qué establece el documento respecto a la educación vial", "No es relevante para adultos", "Es un pilar fundamental junto con la ingeniería y la legislación", "Solo debe impartirse en primaria", "No tiene impacto medible en siniestros", "a"],
    ["la tasa de mortalidad vial en Colombia según el documento", "Inferior a todos los países de la región", "Una de las más altas de América Latina y con tendencia a mejorar gradualmente", "Ya dentro de los estándares óptimos de la OMS", "Sin datos disponibles para análisis", "a"],
    ["el concepto de 'calle completa' en planificación vial", "Una vía exclusiva para vehículos motorizados", "Una vía diseñada para todos los modos de transporte con seguridad", "Una autopista de alta capacidad", "Un carril exclusivo para transporte de carga", "a"],
    ["la responsabilidad del sector salud en seguridad vial", "Ninguna; es tema exclusivo de tránsito", "Atención prehospitalaria, rehabilitación y vigilancia epidemiológica de siniestros", "Solo atender lesionados graves en hospitales", "Definir las normas de tránsito", "a"],
    ["qué define el documento sobre el sistema seguro de tránsito", "Un sistema donde los errores humanos son inevitablemente fatales", "Un sistema donde ningún error humano debería resultar en muerte o lesión grave", "Un sistema que elimina al conductor humano", "Un sistema de sanciones más estrictas", "a"],
    ["el mecanismo de coordinación interinstitucional propuesto", "Comités departamentales sin articulación nacional", "Un ente rector nacional con mesas técnicas intersectoriales", "Delegación total a municipios", "Exclusiva responsabilidad de la Policía de Tránsito", "a"],
    ["la fuente de financiación principal para iniciativas de seguridad vial", "Donaciones de empresas privadas únicamente", "Presupuesto nacional, recursos de regalías y aportes del SOAT", "Solo cooperación internacional", "Impuesto a nuevos vehículos eléctricos", "a"],
    ["el indicador de resultado más utilizado en el documento", "Número de vehículos inspeccionados", "Número de fallecidos y heridos graves en siniestros de tránsito", "Cantidad de policías de tránsito capacitados", "Kilómetros de vía construidos anualmente", "a"],
    ["la relación entre velocidad y gravedad de las lesiones según el recurso", "No existe relación comprobada", "A mayor velocidad, exponencialmente mayor probabilidad de muerte o lesion grave", "La velocidad solo afecta en zonas rurales", "Solo importa en motos, no en autos", "a"],
    ["la meta de reducción de siniestros como referencia en el documento", "Mantener la tasa actual sin variación", "Reducir al menos un 50% las muertes viales en el período del plan", "Eliminar el 100% de accidentes en el primer año", "Aumentar las multas para generar ingresos", "a"],
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
      text: "Según el enfoque de Sistema Seguro, ¿cuál afirmación describe mejor su premisa central?",
      options: [
        { id: "a", text: "Los siniestros son inevitables; lo importante es sancionar al responsable." },
        { id: "b", text: "Ninguna muerte o lesión grave en las vías es aceptable; el sistema debe proteger ante el error humano." },
        { id: "c", text: "La seguridad vial depende exclusivamente del comportamiento del conductor." },
        { id: "d", text: "La educación vial reemplaza la necesidad de infraestructura segura." },
      ],
      correct: "b",
    },
    {
      id: "m1q1_02",
      text: "En Sistema Seguro se parte de que el error humano puede ocurrir, pero no debería \"pagarse\" con la vida o la integridad. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q1_03",
      text: "¿Cuál opción expresa el principio de responsabilidad compartida en seguridad vial?",
      options: [
        { id: "a", text: "Solo la autoridad responde, porque es quien controla." },
        { id: "b", text: "Solo quien conduce responde, porque toma las decisiones." },
        { id: "c", text: "Estado, sector privado, sociedad y actores viales tienen corresponsabilidad." },
        { id: "d", text: "La responsabilidad es solo de quien diseña la vía." },
      ],
      correct: "c",
    },
    {
      id: "m1q1_04",
      text: "El PNSV 2022–2031 alinea su meta con el compromiso de reducir muertes y lesiones por siniestros viales en:",
      options: [
        { id: "a", text: "20% para 2026." },
        { id: "b", text: "30% para 2028." },
        { id: "c", text: "Al menos 50% para 2030." },
        { id: "d", text: "70% para 2035." },
      ],
      correct: "c",
    },
    {
      id: "m1q1_05",
      text: "La velocidad es un factor de riesgo clave porque aumenta la energía liberada en un choque y puede agravar las lesiones. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q1_06",
      text: "¿Cuál es la diferencia correcta entre velocidad excesiva y velocidad inadecuada?",
      options: [
        { id: "a", text: "Excesiva: en carretera; inadecuada: en ciudad." },
        { id: "b", text: "Excesiva: por debajo del límite; inadecuada: por encima del límite." },
        { id: "c", text: "Excesiva: por encima del límite; inadecuada: aun dentro del límite, pero insegura por el entorno/condiciones." },
        { id: "d", text: "Son lo mismo: ambas significan superar el límite." },
      ],
      correct: "c",
    },
    {
      id: "m1q1_07",
      text: "Si se conduce dentro del límite legal, siempre se está a una velocidad segura. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "b",
    },
    {
      id: "m1q1_08",
      text: "Una infraestructura vial segura se caracteriza, entre otros aspectos, por ser \"autoexplicativa\":",
      options: [
        { id: "a", text: "Porque obliga a leer un manual antes de usarla." },
        { id: "b", text: "Porque su diseño y elementos guían al usuario para tomar decisiones adecuadas." },
        { id: "c", text: "Porque elimina totalmente el error humano." },
        { id: "d", text: "Porque solo sirve para vehículos de cuatro ruedas." },
      ],
      correct: "b",
    },
    {
      id: "m1q1_09",
      text: "Una vía segura debe considerar especialmente a los actores más vulnerables (peatones y ciclistas) en su diseño y operación. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q1_10",
      text: "¿Cuál opción describe mejor un vehículo seguro según el PNSV?",
      options: [
        { id: "a", text: "El más grande y pesado, porque \"aguanta más\"." },
        { id: "b", text: "El que reduce la probabilidad de lesiones graves o fatales mediante condiciones de seguridad." },
        { id: "c", text: "El que tiene mayor potencia para adelantar rápido." },
        { id: "d", text: "El que solo depende de la habilidad del conductor." },
      ],
      correct: "b",
    },
    {
      id: "m1q1_11",
      text: "En el PNSV se diferencia entre seguridad activa y pasiva. ¿Cuál relación es correcta?",
      options: [
        { id: "a", text: "Activa: reduce lesiones una vez ocurre el choque; Pasiva: evita que ocurra el choque." },
        { id: "b", text: "Activa: ayuda a detectar/controlar para evitar el siniestro; Pasiva: reduce daño si el siniestro ocurre." },
        { id: "c", text: "Activa: es solo cinturón y airbags; Pasiva: es solo frenos." },
        { id: "d", text: "Activa y pasiva significan exactamente lo mismo." },
      ],
      correct: "b",
    },
    {
      id: "m1q1_12",
      text: "Un comportamiento seguro implica autocuidado, respeto por las normas y reconocimiento de la vulnerabilidad de otros actores viales. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q1_13",
      text: "¿Qué enfoque es más coherente con proactividad en seguridad vial?",
      options: [
        { id: "a", text: "Esperar a que ocurran siniestros para intervenir solo el punto donde pasó el último." },
        { id: "b", text: "Identificar riesgos antes del siniestro y actuar preventivamente (infraestructura, control, educación, etc.)." },
        { id: "c", text: "Culpar al usuario y aumentar únicamente las sanciones." },
        { id: "d", text: "Publicar campañas sin intervenir riesgos físicos ni operativos." },
      ],
      correct: "b",
    },
    {
      id: "m1q1_14",
      text: "En el enfoque Sistema Seguro, la gestión debe ser integral, con múltiples capas: si una falla, otras deben seguir protegiendo la vida. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q1_15",
      text: "¿Qué afirmación resume mejor el uso de \"siniestro\" en lugar de \"accidente\"?",
      options: [
        { id: "a", text: "\"Accidente\" implica culpa automática del conductor; \"siniestro\" no." },
        { id: "b", text: "\"Siniestro\" refleja que los hechos pueden prevenirse con gestión del riesgo y un sistema que proteja." },
        { id: "c", text: "\"Siniestro\" solo se usa para choques con víctimas fatales." },
        { id: "d", text: "\"Accidente\" es un término prohibido por la ley." },
      ],
      correct: "b",
    },
    {
      id: "m1q1_16",
      text: "La seguridad vial se logra únicamente con educación, sin necesidad de regulación, control o diseño seguro de infraestructura. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "b",
    },
    {
      id: "m1q1_17",
      text: "¿Cuál opción se relaciona más con cumplimiento de normas como componente de seguridad vial?",
      options: [
        { id: "a", text: "Conocer las normas, tener capacidad institucional para control y aplicar sanciones disuasivas." },
        { id: "b", text: "Solo hacer campañas en redes sociales." },
        { id: "c", text: "Solo señalizar, sin control ni pedagogía." },
        { id: "d", text: "Confiar en que el usuario \"aprende solo\" con la experiencia." },
      ],
      correct: "a",
    },
    {
      id: "m1q1_18",
      text: "En la atención integral a víctimas, el enfoque busca reducir impactos físicos, psicosociales y jurídicos, no solo \"atender la lesión\". (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q1_19",
      text: "¿Cuál es la mejor forma de entender \"Sistema Seguro\" en una frase?",
      options: [
        { id: "a", text: "\"La vía es peligrosa y no se puede hacer nada.\"" },
        { id: "b", text: "\"Si alguien falla, el sistema debe reducir la probabilidad del siniestro y la gravedad del daño.\"" },
        { id: "c", text: "\"La seguridad vial se logra prohibiendo la movilidad.\"" },
        { id: "d", text: "\"Todo se resuelve con más multas.\"" },
      ],
      correct: "b",
    },
    {
      id: "m1q1_20",
      text: "Una política de seguridad vial bien gestionada se apoya en evidencia y datos, y se orienta al seguimiento y evaluación de resultados. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
  ],
};

// ---------------------------------------------------------------------------

const M1_Q2 = {
  title: "Quiz — Manual de Señalización Vial",
  questions: [
    {
      id: "m1q2_01",
      text: "En una situación de conflicto, ¿cuál es el orden de prelación correcto según el Manual?",
      options: [
        { id: "a", text: "Señales horizontales > señales verticales > semáforos > agentes" },
        { id: "b", text: "Semáforos / señales transitorias / órdenes de agentes > señales verticales > señales horizontales" },
        { id: "c", text: "Señales verticales > semáforos > señales transitorias > agentes" },
        { id: "d", text: "Señales horizontales > semáforos > señales verticales > agentes" },
      ],
      correct: "b",
    },
    {
      id: "m1q2_02",
      text: "Las señales verticales tienen prelación sobre las señales horizontales (demarcaciones). (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q2_03",
      text: "¿Cuáles son las 3 categorías principales de señales verticales?",
      options: [
        { id: "a", text: "Preventivas, turísticas y escolares" },
        { id: "b", text: "Reglamentarias, preventivas e informativas" },
        { id: "c", text: "Urbanas, rurales y privadas" },
        { id: "d", text: "Prioridad, dirección y velocidad" },
      ],
      correct: "b",
    },
    {
      id: "m1q2_04",
      text: "Una señal vertical se puede instalar sin autorización si \"ayuda\" a la seguridad vial. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "b",
    },
    {
      id: "m1q2_05",
      text: "¿Cuál NO es un requisito mínimo de una señal de tránsito?",
      options: [
        { id: "a", text: "Debe ser necesaria" },
        { id: "b", text: "Debe ser visible y destacarse" },
        { id: "c", text: "Debe tener publicidad para financiar su mantenimiento" },
        { id: "d", text: "Debe ser creíble e infundir respeto" },
      ],
      correct: "c",
    },
    {
      id: "m1q2_06",
      text: "Una señal debe dar tiempo suficiente al actor vial para reaccionar y maniobrar de forma segura ante la situación señalizada. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q2_07",
      text: "¿Qué pasa cuando una señal queda redundante, deteriorada o rayada y se mantiene en la vía?",
      options: [
        { id: "a", text: "Aumenta la credibilidad y el respeto por la señalización" },
        { id: "b", text: "Genera confusión, baja lectura y puede incentivar vandalismo" },
        { id: "c", text: "Solo afecta la estética, no la seguridad" },
        { id: "d", text: "No tiene efectos si hay otras señales cerca" },
      ],
      correct: "b",
    },
    {
      id: "m1q2_08",
      text: "La uniformidad implica que situaciones similares deben señalizarse de la misma manera. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q2_09",
      text: "Si se instala un símbolo nuevo en una zona, ¿qué debe acompañarlo según el Manual?",
      options: [
        { id: "a", text: "Una placa publicitaria con el patrocinador" },
        { id: "b", text: "Una placa educativa inferior que explique el significado" },
        { id: "c", text: "Una demarcación horizontal obligatoria en todos los casos" },
        { id: "d", text: "Un semáforo adicional" },
      ],
      correct: "b",
    },
    {
      id: "m1q2_10",
      text: "¿Cuánto tiempo máximo debería mantenerse la placa educativa cuando el símbolo es nuevo en la zona?",
      options: [
        { id: "a", text: "6 meses" },
        { id: "b", text: "1 año" },
        { id: "c", text: "3 años" },
        { id: "d", text: "5 años" },
      ],
      correct: "c",
    },
    {
      id: "m1q2_11",
      text: "Está totalmente prohibido instalar mensajes o publicidad en señales y dispositivos de regulación del tránsito. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q2_12",
      text: "¿Cuál combinación de forma y color corresponde de manera general a las señales preventivas?",
      options: [
        { id: "a", text: "Triángulo rojo con fondo blanco" },
        { id: "b", text: "Rombo amarillo (o amarillo verde-fluorescente) con símbolo negro" },
        { id: "c", text: "Círculo azul con símbolo blanco" },
        { id: "d", text: "Rectángulo verde con orla amarilla" },
      ],
      correct: "b",
    },
    {
      id: "m1q2_13",
      text: "¿Cuál afirmación es correcta sobre señales reglamentarias (en general)?",
      options: [
        { id: "a", text: "Siempre son cuadradas y de fondo verde" },
        { id: "b", text: "Principalmente son circulares; colores típicos blanco, rojo y negro (con excepciones puntuales)" },
        { id: "c", text: "Siempre son romboidales amarillas" },
        { id: "d", text: "Son siempre marrones porque informan turismo" },
      ],
      correct: "b",
    },
    {
      id: "m1q2_14",
      text: "Las bermas (pavimentadas o no) pueden usarse para colocar señales permanentes porque hay más espacio. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "b",
    },
    {
      id: "m1q2_15",
      text: "Al retirar una señal vertical (por deterioro o porque ya no es necesaria), ¿qué debe garantizarse?",
      options: [
        { id: "a", text: "Dejar la base y pernos expuestos para futura reinstalación" },
        { id: "b", text: "Nivelar la superficie y eliminar puntas, sobrantes u obstáculos que generen riesgo" },
        { id: "c", text: "Pintar de negro el lugar para que se note" },
        { id: "d", text: "Trasladarla a otro punto sin evaluación" },
      ],
      correct: "b",
    },
    {
      id: "m1q2_16",
      text: "Para evitar confusión y \"contaminación visual\", se debe evitar instalar un número excesivo de señales en un tramo corto. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q2_17",
      text: "¿Cuál opción describe mejor la función de las señales verticales?",
      options: [
        { id: "a", text: "Solo decorar el entorno vial" },
        { id: "b", text: "Reglamentar, advertir e informar para que el usuario actúe de forma segura" },
        { id: "c", text: "Reemplazar por completo la demarcación horizontal" },
        { id: "d", text: "Solo indicar destinos turísticos" },
      ],
      correct: "b",
    },
    {
      id: "m1q2_18",
      text: "¿Qué práctica se recomienda para conservar la visibilidad/retrorreflexión de las señales?",
      options: [
        { id: "a", text: "Limpiarlas con materiales abrasivos para remover todo rápido" },
        { id: "b", text: "Implementar un programa de limpieza con periodicidad no mayor a 6 meses y materiales no abrasivos" },
        { id: "c", text: "Pintarlas con pintura común cada año" },
        { id: "d", text: "No limpiarlas: la lluvia es suficiente" },
      ],
      correct: "b",
    },
    {
      id: "m1q2_19",
      text: "Si por falta de espacio deben instalarse dos señales en un mismo soporte, existe un sistema previsto para ello (sistema dúplex) con reglas de orden y separación. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q2_20",
      text: "En una combinación en soporte dúplex con una señal reglamentaria y una preventiva/informativa para una misma situación, ¿cuál debe ir arriba?",
      options: [
        { id: "a", text: "La reglamentaria siempre arriba" },
        { id: "b", text: "La preventiva o informativa arriba" },
        { id: "c", text: "Da igual el orden" },
        { id: "d", text: "Depende del color del fondo" },
      ],
      correct: "b",
    },
  ],
};

// ---------------------------------------------------------------------------

const M1_Q3 = {
  title: "Quiz — ABC para las víctimas en accidente de tránsito",
  questions: [
    {
      id: "m1q3_01",
      text: "Según el documento, un accidente de tránsito se entiende como:",
      options: [
        { id: "a", text: "Cualquier choque donde haya daños materiales, aunque no haya vehículos en movimiento." },
        { id: "b", text: "Un evento generalmente involuntario, generado al menos por un vehículo en movimiento, que causa daños y afecta la circulación." },
        { id: "c", text: "Un hecho que solo ocurre en carreteras nacionales." },
        { id: "d", text: "Una infracción de tránsito que siempre termina en lesiones." },
      ],
      correct: "b",
    },
    {
      id: "m1q3_02",
      text: "Para que exista accidente de tránsito con víctima, debe estar involucrado al menos un vehículo automotor. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q3_03",
      text: "En el documento, \"víctima\" es:",
      options: [
        { id: "a", text: "Solo la persona que iba conduciendo." },
        { id: "b", text: "Toda persona que sufre daño en su salud como consecuencia de un accidente de tránsito." },
        { id: "c", text: "Solo quien fallece." },
        { id: "d", text: "Solo quien queda con incapacidad permanente." },
      ],
      correct: "b",
    },
    {
      id: "m1q3_04",
      text: "¿Qué define el documento como \"vehículo automotor\"?",
      options: [
        { id: "a", text: "Cualquier medio de transporte, incluso bicicletas y patinetas." },
        { id: "b", text: "Aparato con motor propulsor destinado a circular por el suelo para transporte de personas o bienes (incluye remolques acoplados)." },
        { id: "c", text: "Solo carros particulares." },
        { id: "d", text: "Solo vehículos de transporte público." },
      ],
      correct: "b",
    },
    {
      id: "m1q3_05",
      text: "Las bicicletas requieren SOAT para poder circular. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "b",
    },
    {
      id: "m1q3_06",
      text: "Si ocurre un siniestro donde hay un carro y un ciclista, ¿quién cubre al ciclista según el documento?",
      options: [
        { id: "a", text: "El SOAT de la bicicleta." },
        { id: "b", text: "Ninguna póliza cubre al ciclista." },
        { id: "c", text: "El SOAT del vehículo automotor involucrado." },
        { id: "d", text: "Solo una EPS cubre y el resto lo paga la víctima." },
      ],
      correct: "c",
    },
    {
      id: "m1q3_07",
      text: "Si el siniestro ocurre únicamente entre bicicletas (o bicicleta y objeto fijo), según el documento:",
      options: [
        { id: "a", text: "Siempre cubre el SOAT de cualquier vehículo cercano." },
        { id: "b", text: "No hay cobertura SOAT, porque no hay vehículo automotor involucrado." },
        { id: "c", text: "Cubre automáticamente la ADRES." },
        { id: "d", text: "Cubre la Secretaría de Tránsito." },
      ],
      correct: "b",
    },
    {
      id: "m1q3_08",
      text: "Para recibir atención en salud con cargo al SOAT, no es necesario determinar primero la responsabilidad del siniestro. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q3_09",
      text: "En un siniestro con dos o más vehículos, los servicios de salud de los ocupantes lesionados se cubren así:",
      options: [
        { id: "a", text: "Los paga siempre el SOAT del vehículo \"culpable\"." },
        { id: "b", text: "Los paga el SOAT del vehículo en el que iba cada ocupante lesionado." },
        { id: "c", text: "Los paga la víctima y luego demanda." },
        { id: "d", text: "Los paga el municipio." },
      ],
      correct: "b",
    },
    {
      id: "m1q3_10",
      text: "Para peatones o ciclistas lesionados cuando hay dos o más vehículos involucrados, el cubrimiento estará a cargo de:",
      options: [
        { id: "a", text: "Cualquiera de las aseguradoras de los vehículos." },
        { id: "b", text: "Únicamente el SOAT del vehículo más grande." },
        { id: "c", text: "Solo la ADRES." },
        { id: "d", text: "Solo la EPS." },
      ],
      correct: "a",
    },
    {
      id: "m1q3_11",
      text: "Cuando hay vehículos no asegurados o no identificados involucrados, el cubrimiento estará a cargo de:",
      options: [
        { id: "a", text: "La Fiscalía" },
        { id: "b", text: "La ADRES" },
        { id: "c", text: "El organismo de tránsito" },
        { id: "d", text: "El propietario del vehículo lesionado" },
      ],
      correct: "b",
    },
    {
      id: "m1q3_12",
      text: "El SOAT busca garantizar, entre otros, el traslado de la víctima al centro hospitalario más cercano con capacidad de atención y el pago de atención médica. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q3_13",
      text: "¿Qué NO menciona el documento dentro de las coberturas/propósitos del SOAT?",
      options: [
        { id: "a", text: "Transporte de la víctima al centro hospitalario." },
        { id: "b", text: "Atención médica a lesionados." },
        { id: "c", text: "Indemnización por incapacidad permanente." },
        { id: "d", text: "Reparación total del vehículo siniestrado." },
      ],
      correct: "d",
    },
    {
      id: "m1q3_14",
      text: "El protocolo PAS significa:",
      options: [
        { id: "a", text: "Parar – Acelerar – Salir" },
        { id: "b", text: "Proteger – Avisar – Socorrer" },
        { id: "c", text: "Prevenir – Actuar – Sancionar" },
        { id: "d", text: "Pedir ayuda – Auxiliar – Señalizar" },
      ],
      correct: "b",
    },
    {
      id: "m1q3_15",
      text: "En el PAS, la acción \"Proteger\" implica principalmente:",
      options: [
        { id: "a", text: "Mover a la víctima de inmediato para despejar la vía." },
        { id: "b", text: "Ubicarse en un lugar seguro, evaluar riesgos y señalizar el área para evitar otro siniestro." },
        { id: "c", text: "Llamar a un familiar primero." },
        { id: "d", text: "Discutir con el presunto responsable." },
      ],
      correct: "b",
    },
    {
      id: "m1q3_16",
      text: "Según el documento, para \"Avisar\" se recomienda llamar:",
      options: [
        { id: "a", text: "Solo a la ambulancia privada." },
        { id: "b", text: "En ciudad al NUSE 123 y en carretera al #767, indicando ubicación y siguiendo instrucciones." },
        { id: "c", text: "Únicamente a la policía." },
        { id: "d", text: "Solo al seguro del vehículo." },
      ],
      correct: "b",
    },
    {
      id: "m1q3_17",
      text: "Es posible que una persona no sienta dolor inmediatamente después del siniestro por la adrenalina; por eso debe esperar valoración del personal médico. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q3_18",
      text: "En la escena del siniestro, ¿quién preserva el lugar y recauda elementos que sirven como material probatorio?",
      options: [
        { id: "a", text: "Únicamente los testigos." },
        { id: "b", text: "La autoridad de tránsito." },
        { id: "c", text: "Solo el personal de la ambulancia." },
        { id: "d", text: "La aseguradora del SOAT." },
      ],
      correct: "b",
    },
    {
      id: "m1q3_19",
      text: "¿Qué documento elabora la autoridad de tránsito para describir lo ocurrido y entregar copia a los implicados?",
      options: [
        { id: "a", text: "Comparendo Único Nacional (CUN)" },
        { id: "b", text: "IPAT (Informe Policial de Accidentes de Tránsito)" },
        { id: "c", text: "Historia clínica" },
        { id: "d", text: "Certificado de tradición del vehículo" },
      ],
      correct: "b",
    },
    {
      id: "m1q3_20",
      text: "En caso de lesiones personales, la víctima debe formular querella dentro de:",
      options: [
        { id: "a", text: "15 días siguientes al siniestro" },
        { id: "b", text: "1 mes siguiente al siniestro" },
        { id: "c", text: "6 meses siguientes al siniestro" },
        { id: "d", text: "2 años siguientes al siniestro" },
      ],
      correct: "c",
    },
  ],
};

// ---------------------------------------------------------------------------

const M1_Q4 = {
  title: "Quiz — Ruta de Atención Integral a Víctimas de Siniestros Viales",
  questions: [
    {
      id: "m1q4_01",
      text: "¿Cuál es la primera acción operativa indicada justo después de \"Ocurre un siniestro vial\"?",
      options: [
        { id: "a", text: "Aplicar guías/protocolos de atención médica y psicosocial" },
        { id: "b", text: "Proteger el área del siniestro" },
        { id: "c", text: "Traslado especializado a IPS" },
        { id: "d", text: "Registro del evento" },
      ],
      correct: "b",
    },
    {
      id: "m1q4_02",
      text: "La ruta indica que se debe avisar al Número Único de Seguridad y Emergencias (NUSE) 123 como parte de la respuesta inicial. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q4_03",
      text: "En la ruta, \"Socorrer y atender\" ocurre:",
      options: [
        { id: "a", text: "Antes de proteger el área del siniestro" },
        { id: "b", text: "Después de avisar al 123" },
        { id: "c", text: "Solo si hay fallecidos" },
        { id: "d", text: "Solo si la víctima requiere traslado" },
      ],
      correct: "b",
    },
    {
      id: "m1q4_04",
      text: "La primera pregunta de decisión crítica de la ruta es:",
      options: [
        { id: "a", text: "¿La víctima sobrevive?" },
        { id: "b", text: "¿Hay fallecidos?" },
        { id: "c", text: "¿Hay personas víctimas?" },
        { id: "d", text: "¿Requiere traslado a centro hospitalario?" },
      ],
      correct: "c",
    },
    {
      id: "m1q4_05",
      text: "Si la respuesta a \"¿Hay personas víctimas?\" es NO, la ruta conduce a \"Registro\" y finaliza. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q4_06",
      text: "¿Qué acción se asocia explícitamente con Policía de Tránsito en la ruta?",
      options: [
        { id: "a", text: "Aplicar protocolo de Policía de Tránsito" },
        { id: "b", text: "Aplicar protocolo de Medicina Legal" },
        { id: "c", text: "Brindar APH por personal idóneo" },
        { id: "d", text: "Traslado especializado a IPS" },
      ],
      correct: "a",
    },
    {
      id: "m1q4_07",
      text: "Si hay fallecidos, la ruta indica como paso clave:",
      options: [
        { id: "a", text: "Traslado especializado a IPS" },
        { id: "b", text: "Registro del fallecimiento y de la atención" },
        { id: "c", text: "Registro del evento únicamente" },
        { id: "d", text: "Aplicar protocolos de atención a víctimas en condición de discapacidad" },
      ],
      correct: "b",
    },
    {
      id: "m1q4_08",
      text: "En caso de fallecidos, la ruta contempla la aplicación del protocolo de Medicina Legal. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q4_09",
      text: "Si NO hay fallecidos, el siguiente gran bloque operativo es:",
      options: [
        { id: "a", text: "Brindar atención prehospitalaria (APH) por personal idóneo" },
        { id: "b", text: "Registro del fallecimiento y de la atención" },
        { id: "c", text: "Aplicar protocolo de Medicina Legal" },
        { id: "d", text: "FIN inmediato" },
      ],
      correct: "a",
    },
    {
      id: "m1q4_10",
      text: "¿Qué significa APH en el contexto de la ruta?",
      options: [
        { id: "a", text: "Atención Psicológica Hospitalaria" },
        { id: "b", text: "Atención Prehospitalaria" },
        { id: "c", text: "Apoyo Prioritario Humanitario" },
        { id: "d", text: "Atención Primaria en el Hogar" },
      ],
      correct: "b",
    },
    {
      id: "m1q4_11",
      text: "La ruta indica que el traslado debe dirigirse a las IPS con capacidad más cercana cuando se requiere centro hospitalario. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q4_12",
      text: "Si la víctima NO requiere traslado a centro hospitalario, la ruta orienta a:",
      options: [
        { id: "a", text: "Traslado especializado de la víctima a IPS" },
        { id: "b", text: "Brindar la atención y entregar recomendaciones médicas" },
        { id: "c", text: "Aplicar protocolos de atención a discapacidad" },
        { id: "d", text: "Aplicar protocolo de Medicina Legal" },
      ],
      correct: "b",
    },
    {
      id: "m1q4_13",
      text: "La ruta incluye explícitamente el componente psicosocial dentro de guías/protocolos de atención. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q4_14",
      text: "Si la víctima sobrevive, el siguiente punto de decisión es:",
      options: [
        { id: "a", text: "¿Hay personas víctimas?" },
        { id: "b", text: "¿Queda en condición de discapacidad?" },
        { id: "c", text: "¿Hay fallecidos?" },
        { id: "d", text: "¿Requiere traslado a centro hospitalario?" },
      ],
      correct: "b",
    },
    {
      id: "m1q4_15",
      text: "Si la víctima queda en condición de discapacidad, la ruta indica:",
      options: [
        { id: "a", text: "Aplicar protocolos de atención a víctimas en condición de discapacidad" },
        { id: "b", text: "Aplicar protocolo de Medicina Legal" },
        { id: "c", text: "Aplicar únicamente registro del evento" },
        { id: "d", text: "Finalizar sin protocolos adicionales" },
      ],
      correct: "a",
    },
    {
      id: "m1q4_16",
      text: "El registro aparece en distintos momentos de la ruta (por ejemplo, registro del evento y registro del fallecimiento y de la atención). (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q4_17",
      text: "¿Cuál de estas \"necesidades identificadas\" aparece en el anexo como problema a resolver?",
      options: [
        { id: "a", text: "Exceso de infraestructura vial" },
        { id: "b", text: "Falta de conocimiento en la actuación frente a un siniestro" },
        { id: "c", text: "Exceso de control policial en vía" },
        { id: "d", text: "Demasiada señalización en las vías" },
      ],
      correct: "b",
    },
    {
      id: "m1q4_18",
      text: "¿Qué necesidad identificada se relaciona directamente con el NUSE?",
      options: [
        { id: "a", text: "Debilidad en la implementación del NUSE" },
        { id: "b", text: "Desconocimiento del derecho de acompañamiento psicosocial y jurídico" },
        { id: "c", text: "Desarticulación en el acompañamiento de víctimas" },
        { id: "d", text: "Atención inadecuada a víctimas en condición de discapacidad" },
      ],
      correct: "a",
    },
    {
      id: "m1q4_19",
      text: "El anexo menciona como brecha el desconocimiento del derecho de acompañamiento psicosocial y jurídico. (Verdadero / Falso)",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m1q4_20",
      text: "¿Cuál afirmación resume mejor el propósito de la ruta?",
      options: [
        { id: "a", text: "Definir quién tuvo la culpa antes de atender" },
        { id: "b", text: "Estandarizar decisiones y acciones desde la escena hasta la atención médica, psicosocial, jurídica y registros" },
        { id: "c", text: "Reemplazar el sistema de emergencias 123 por otro canal" },
        { id: "d", text: "Evitar que se haga cualquier registro del siniestro" },
      ],
      correct: "b",
    },
  ],
};

// ======================================================================
// Module 2
// ======================================================================

const M2_Q1 = {
  title: "Quiz — ANEXO TÉCNICO: GUÍA DE URBANISMO TÁCTICO PARA COLOMBIA",
  questions: [
    {
      id: "m2q1_01",
      text: "¿Cuál describe mejor el urbanismo táctico según la guía?",
      options: [
        { id: "a", text: "Una obra civil permanente de alta inversión y ejecución lenta." },
        { id: "b", text: "Una herramienta experimental que usa intervenciones temporales para evaluar transformaciones permanentes del espacio público." },
        { id: "c", text: "Una estrategia exclusiva para carreteras rurales." },
        { id: "d", text: "Un modelo de señalización vertical para cruces peatonales." },
      ],
      correct: "b",
    },
    {
      id: "m2q1_02",
      text: "El urbanismo táctico se caracteriza, entre otros aspectos, por su rápida implementación, enfoque participativo y monitoreo.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q1_03",
      text: "¿Cuál de las siguientes NO corresponde a una característica principal del urbanismo táctico?",
      options: [
        { id: "a", text: "Bajo costo" },
        { id: "b", text: "Implementación transitoria" },
        { id: "c", text: "Enfoque participativo" },
        { id: "d", text: "Exclusividad para proyectos privados cerrados" },
      ],
      correct: "d",
    },
    {
      id: "m2q1_04",
      text: "¿Cuál es el ámbito territorial de aplicación del urbanismo táctico según la guía?",
      options: [
        { id: "a", text: "Exclusivamente rural" },
        { id: "b", text: "Exclusivamente intermunicipal" },
        { id: "c", text: "Urbano" },
        { id: "d", text: "Solo en autopistas nacionales" },
      ],
      correct: "c",
    },
    {
      id: "m2q1_05",
      text: "La guía indica que el urbanismo táctico puede aplicarse en barrios residenciales, centros urbanos y otros espacios de interés general.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q1_06",
      text: "¿Cuál opción refleja mejor la progresión típica de una intervención de urbanismo táctico?",
      options: [
        { id: "a", text: "Intervención permanente → apropiación espontánea → piloto" },
        { id: "b", text: "Apropiación espontánea → piloto temporal → implementación temporal → infraestructura permanente" },
        { id: "c", text: "Obra civil definitiva → socialización → mantenimiento" },
        { id: "d", text: "Diseño final → contratación → cierre" },
      ],
      correct: "b",
    },
    {
      id: "m2q1_07",
      text: "En la progresión del urbanismo táctico, la intervención permanente suele implicar mayor costo y mayor durabilidad.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q1_08",
      text: "¿Qué busca fortalecer la participación comunitaria dentro de un proyecto de urbanismo táctico?",
      options: [
        { id: "a", text: "Que la comunidad solo observe sin intervenir" },
        { id: "b", text: "Que las personas participen en proyectos que transforman su entorno y responden a sus necesidades" },
        { id: "c", text: "Que la financiación sea únicamente nacional" },
        { id: "d", text: "Que se reduzca el uso del espacio público por parte de peatones" },
      ],
      correct: "b",
    },
    {
      id: "m2q1_09",
      text: "¿Cuál de estos beneficios se asocia directamente al urbanismo táctico?",
      options: [
        { id: "a", text: "Aumento obligatorio del flujo vehicular" },
        { id: "b", text: "Priorización de modos motorizados sobre peatones" },
        { id: "c", text: "Mejora de la accesibilidad, transitabilidad y seguridad vial" },
        { id: "d", text: "Eliminación total de la participación ciudadana" },
      ],
      correct: "c",
    },
    {
      id: "m2q1_10",
      text: "La guía reconoce que una dificultad del urbanismo táctico puede ser la resistencia al cambio o la incomprensión de su propósito.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q1_11",
      text: "¿Cuál de los siguientes grupos de elementos corresponde al catálogo de la guía?",
      options: [
        { id: "a", text: "Segregación, mobiliario, reverdecimiento y complementarios" },
        { id: "b", text: "Semáforos, licencias, peajes y puentes" },
        { id: "c", text: "Pavimentos, túneles, viaductos y ciclomotores" },
        { id: "d", text: "Señales reglamentarias, preventivas, informativas y luminosas" },
      ],
      correct: "a",
    },
    {
      id: "m2q1_12",
      text: "¿Cuál elemento pertenece principalmente a la familia de segregación?",
      options: [
        { id: "a", text: "Bancas" },
        { id: "b", text: "Conos" },
        { id: "c", text: "Materas ornamentales únicamente decorativas" },
        { id: "d", text: "Mesas de permanencia" },
      ],
      correct: "b",
    },
    {
      id: "m2q1_13",
      text: "La demarcación artística y la pintura táctica pueden apoyar el cambio de uso y la revitalización del espacio público.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q1_14",
      text: "Un andén emergente es especialmente favorable cuando:",
      options: [
        { id: "a", text: "Ya existe un andén amplio y consolidado" },
        { id: "b", text: "No existe infraestructura peatonal y se requiere una franja exclusiva para caminar" },
        { id: "c", text: "Se busca aumentar la velocidad vehicular" },
        { id: "d", text: "El objetivo principal es ampliar carriles para automóviles" },
      ],
      correct: "b",
    },
    {
      id: "m2q1_15",
      text: "¿Qué diferencia mejor al urbanismo táctico frente a la pacificación del tránsito?",
      options: [
        { id: "a", text: "El urbanismo táctico nunca puede incluir medidas de calmado" },
        { id: "b", text: "La pacificación del tránsito solo aplica en zonas rurales" },
        { id: "c", text: "El urbanismo táctico, además de influir en la movilidad, busca transformar y mejorar el uso del espacio público" },
        { id: "d", text: "No existe ninguna diferencia entre ambos" },
      ],
      correct: "c",
    },
    {
      id: "m2q1_16",
      text: "La iniciativa de una intervención de urbanismo táctico puede surgir tanto desde la comunidad como desde el sector público.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q1_17",
      text: "¿Cuál opción expresa mejor la lógica de escogencia de elementos en un proyecto de urbanismo táctico?",
      options: [
        { id: "a", text: "Elegir siempre todos los elementos posibles" },
        { id: "b", text: "Seleccionar los elementos según el tipo de espacio, recursos disponibles, necesidades del contexto y sostenibilidad" },
        { id: "c", text: "Priorizar lo más costoso para asegurar permanencia" },
        { id: "d", text: "Escoger solo elementos decorativos" },
      ],
      correct: "b",
    },
    {
      id: "m2q1_18",
      text: "¿Cuál de estas aplicaciones del urbanismo táctico se asocia más con entornos escolares y juego?",
      options: [
        { id: "a", text: "Calle lúdica" },
        { id: "b", text: "Paso urbano nacional" },
        { id: "c", text: "Viaducto peatonal" },
        { id: "d", text: "Carril de adelantamiento" },
      ],
      correct: "a",
    },
    {
      id: "m2q1_19",
      text: "El urbanismo táctico puede contribuir al reverdecimiento, la calidad del aire y la adaptación al cambio climático.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q1_20",
      text: "¿Cuál afirmación resume mejor el sentido del urbanismo táctico?",
      options: [
        { id: "a", text: "Esperar una obra definitiva antes de probar cualquier cambio" },
        { id: "b", text: "Experimentar cambios rápidos y medibles para evaluar soluciones más seguras y útiles para la comunidad" },
        { id: "c", text: "Sustituir toda planificación urbana formal" },
        { id: "d", text: "Priorizar el vehículo motorizado sobre el peatón" },
      ],
      correct: "b",
    },
  ],
};

const M2_Q2 = {
  title: "Quiz — ANEXO TÉCNICO: ORIENTACIONES DE SEGURIDAD VIAL PARA LOS PASOS PEATONALES EN COLOMBIA",
  questions: [
    {
      id: "m2q2_01",
      text: "¿Cuál es el objetivo general del documento sobre pasos peatonales?",
      options: [
        { id: "a", text: "Regular el transporte de carga en ciudades" },
        { id: "b", text: "Formular lineamientos técnicos para planear, diseñar y evaluar diversos tipos de pasos peatonales" },
        { id: "c", text: "Sustituir el Código Nacional de Tránsito" },
        { id: "d", text: "Crear nuevas sanciones para peatones" },
      ],
      correct: "b",
    },
    {
      id: "m2q2_02",
      text: "La guía aborda pasos peatonales a nivel, con semáforo y a desnivel.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q2_03",
      text: "Entre 2018 y 2020, los peatones representaron aproximadamente:",
      options: [
        { id: "a", text: "10 % de las víctimas fatales" },
        { id: "b", text: "25 % de las víctimas fatales" },
        { id: "c", text: "40 % de las víctimas fatales" },
        { id: "d", text: "60 % de las víctimas fatales" },
      ],
      correct: "b",
    },
    {
      id: "m2q2_04",
      text: "¿Cuál actor vial fue el más afectado en víctimas fatales entre 2018 y 2020, por encima del peatón?",
      options: [
        { id: "a", text: "Usuario de bicicleta" },
        { id: "b", text: "Usuario de moto" },
        { id: "c", text: "Usuario de transporte de pasajeros" },
        { id: "d", text: "Usuario de vehículo individual" },
      ],
      correct: "b",
    },
    {
      id: "m2q2_05",
      text: "La guía señala que el entorno peatonal debe ser accesible, continuo, directo, seguro y atractivo.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q2_06",
      text: "¿Qué problema reconoce la guía sobre la infraestructura peatonal en Colombia?",
      options: [
        { id: "a", text: "Exceso homogéneo de calidad en todos los territorios" },
        { id: "b", text: "Resultados muy diversos en calidad, diseño y operación" },
        { id: "c", text: "Falta absoluta de normativa" },
        { id: "d", text: "Prohibición de semaforización peatonal" },
      ],
      correct: "b",
    },
    {
      id: "m2q2_07",
      text: "¿Cuál de los siguientes se menciona como factor asociado al riesgo peatonal?",
      options: [
        { id: "a", text: "Exceso de uso de señalización sonora" },
        { id: "b", text: "Desconocimiento de reglas, afán y uso de tecnologías móviles" },
        { id: "c", text: "Exclusivo uso de pasos a desnivel" },
        { id: "d", text: "Bajos flujos peatonales en toda zona urbana" },
      ],
      correct: "b",
    },
    {
      id: "m2q2_08",
      text: "La cebra por sí sola siempre garantiza seguridad, sin importar el contexto de velocidad o visibilidad.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "b",
    },
    {
      id: "m2q2_09",
      text: "Según la guía, una contramedida con evidencia importante de reducción de lesiones peatonales es:",
      options: [
        { id: "a", text: "Eliminar refugios peatonales" },
        { id: "b", text: "Instalar islas de refugio peatonal" },
        { id: "c", text: "Suprimir rampas" },
        { id: "d", text: "Aumentar la longitud del cruce sin protección" },
      ],
      correct: "b",
    },
    {
      id: "m2q2_10",
      text: "En un paso a nivel sin control semafórico, la localización adecuada debe:",
      options: [
        { id: "a", text: "Ignorar las rutas reales de los peatones" },
        { id: "b", text: "Priorizar únicamente la comodidad vehicular" },
        { id: "c", text: "Prestar especial atención a las trayectorias que emplean los peatones" },
        { id: "d", text: "Ubicarse donde menos peatones crucen" },
      ],
      correct: "c",
    },
    {
      id: "m2q2_11",
      text: "La guía indica que los cruces peatonales deben estar libres de obstáculos en su ancho mínimo y hasta 2,20 m de altura.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q2_12",
      text: "¿Qué medida de accesibilidad se exige para superar cambios de nivel en cruces?",
      options: [
        { id: "a", text: "Solo escaleras" },
        { id: "b", text: "Vados, rampas, senderos escalonados, puentes y túneles según el caso" },
        { id: "c", text: "Bordillos más altos" },
        { id: "d", text: "Únicamente pintura en el piso" },
      ],
      correct: "b",
    },
    {
      id: "m2q2_13",
      text: "¿Qué criterio se plantea para cruces escolares?",
      options: [
        { id: "a", text: "Velocidad de 50 km/h constante" },
        { id: "b", text: "Velocidad de 30 km/h en horario de uso del cruce" },
        { id: "c", text: "Eliminación del sendero peatonal" },
        { id: "d", text: "Uso obligatorio de resaltos en todos los casos" },
      ],
      correct: "b",
    },
    {
      id: "m2q2_14",
      text: "En cruces escolares, la leyenda “zona escolar” debe localizarse a 30 metros del cruce.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q2_15",
      text: "Los semáforos para peatones se instalarán generalmente:",
      options: [
        { id: "a", text: "A cualquier altura que prefiera el diseñador" },
        { id: "b", text: "En la acera opuesta, entre 2,05 m y 3 m sobre el nivel de la acera" },
        { id: "c", text: "Solo en la acera de salida del vehículo" },
        { id: "d", text: "Siempre al nivel del piso" },
      ],
      correct: "b",
    },
    {
      id: "m2q2_16",
      text: "¿Cuál afirmación es más correcta sobre los pasos peatonales a desnivel?",
      options: [
        { id: "a", text: "Son siempre la primera medida recomendada" },
        { id: "b", text: "Son una medida de último recurso y requieren garantizar accesibilidad y mantenimiento" },
        { id: "c", text: "No requieren iluminación" },
        { id: "d", text: "Deben obligar al peatón a desviarse considerablemente" },
      ],
      correct: "b",
    },
    {
      id: "m2q2_17",
      text: "La guía recomienda evitar que los peatones deban desviarse para usar un paso a desnivel.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q2_18",
      text: "¿Qué se recomienda respecto a la visibilidad en pasos a desnivel?",
      options: [
        { id: "a", text: "Mantener ángulos ciegos para reducir permanencia" },
        { id: "b", text: "Garantizar que toda la ruta pueda verse y, si es posible, conecte visualmente con algún lugar público" },
        { id: "c", text: "Reducir iluminación nocturna" },
        { id: "d", text: "Ubicar barreras visuales cerradas" },
      ],
      correct: "b",
    },
    {
      id: "m2q2_19",
      text: "¿Cuál afirmación expresa mejor el enfoque del documento?",
      options: [
        { id: "a", text: "Centrar la seguridad peatonal solo en el comportamiento individual" },
        { id: "b", text: "Integrar análisis, planeación, diseño y evaluación de intervenciones peatonales seguras" },
        { id: "c", text: "Reemplazar toda decisión técnica por percepción subjetiva" },
        { id: "d", text: "Priorizar la velocidad del flujo vehicular sobre la vida peatonal" },
      ],
      correct: "b",
    },
    {
      id: "m2q2_20",
      text: "La guía puede actualizarse en la medida en que la ANSV aumente la investigación sobre los viajes a pie.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
  ],
};

const M2_Q3 = {
  title: "Quiz — ANEXO TÉCNICO: LA MUJER EN EL ESPACIO PÚBLICO",
  questions: [
    {
      id: "m2q3_01",
      text: "Según la infografía, ¿cuál es el propósito principal del documento?",
      options: [
        { id: "a", text: "Clasificar tipos de motocicletas" },
        { id: "b", text: "Identificar tipos de acoso sexual y derechos de las víctimas" },
        { id: "c", text: "Reglamentar el transporte público" },
        { id: "d", text: "Definir velocidades máximas urbanas" },
      ],
      correct: "b",
    },
    {
      id: "m2q3_02",
      text: "La infografía señala que el acoso en el espacio y el transporte público es una situación común a nivel nacional.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q3_03",
      text: "¿Cuál de los siguientes ejemplos corresponde a acoso sexual físico?",
      options: [
        { id: "a", text: "Comentarios sexualmente explícitos" },
        { id: "b", text: "Fotos al cuerpo sin consentimiento" },
        { id: "c", text: "Pellizcos, roces deliberados o impedir el paso intencionalmente" },
        { id: "d", text: "Exhibición de imágenes de connotación sexual" },
      ],
      correct: "c",
    },
    {
      id: "m2q3_04",
      text: "¿Cuál de los siguientes ejemplos corresponde a acoso sexual verbal?",
      options: [
        { id: "a", text: "Guiños y persecución" },
        { id: "b", text: "Silbidos, insinuaciones sexuales o insultos basados en estereotipos sexuales" },
        { id: "c", text: "Fotos sin consentimiento" },
        { id: "d", text: "Exhibicionismo" },
      ],
      correct: "b",
    },
    {
      id: "m2q3_05",
      text: "La exhibición de fotos, videos o audios de connotación sexual sin consentimiento se clasifica como acoso sexual no verbal.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q3_06",
      text: "¿Cuál de las siguientes conductas se ubica mejor en acoso no verbal?",
      options: [
        { id: "a", text: "Ladridos o sonidos de besos" },
        { id: "b", text: "Comentarios sobre fantasías eróticas" },
        { id: "c", text: "Exhibicionismo y fotos al cuerpo sin consentimiento" },
        { id: "d", text: "Apretones y tocamientos" },
      ],
      correct: "c",
    },
    {
      id: "m2q3_07",
      text: "Según la infografía, ¿qué derecho tiene la víctima frente a la justicia?",
      options: [
        { id: "a", text: "Renunciar automáticamente al proceso" },
        { id: "b", text: "Acceder a mecanismos de justicia para que los hechos sean investigados y el agresor sea juzgado" },
        { id: "c", text: "Esperar únicamente conciliación privada" },
        { id: "d", text: "Acudir solo a orientación informal" },
      ],
      correct: "b",
    },
    {
      id: "m2q3_08",
      text: "La víctima tiene derecho a recibir asistencia médica, psicológica, psiquiátrica y forense especializada e integral.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q3_09",
      text: "¿Cuál opción describe el derecho a recibir información y orientación?",
      options: [
        { id: "a", text: "Recibir solo información verbal sin soporte" },
        { id: "b", text: "Recibir información clara, completa, veraz y oportuna sobre derechos, servicios y entidades" },
        { id: "c", text: "Recibir información únicamente si hay denuncia penal" },
        { id: "d", text: "Recibir orientación solo de familiares" },
      ],
      correct: "b",
    },
    {
      id: "m2q3_10",
      text: "¿Qué incluyen las medidas de protección mencionadas?",
      options: [
        { id: "a", text: "Únicamente vigilancia policial permanente" },
        { id: "b", text: "Medidas específicas e inmediatas para proteger la vida de la mujer y de sus hijas e hijos" },
        { id: "c", text: "Solo acompañamiento académico" },
        { id: "d", text: "Exclusivamente atención hospitalaria" },
      ],
      correct: "b",
    },
    {
      id: "m2q3_11",
      text: "En casos de violencia sexual, la víctima tiene derecho a dar su consentimiento informado para exámenes médico-legales y escoger el sexo del facultativo para su toma.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q3_12",
      text: "¿Qué derecho de la niñez se menciona expresamente?",
      options: [
        { id: "a", text: "Derecho a no asistir a valoración" },
        { id: "b", text: "Derecho a no ser separado de sus padres contra su voluntad" },
        { id: "c", text: "Derecho a declarar sin acompañamiento" },
        { id: "d", text: "Derecho a no recibir información" },
      ],
      correct: "b",
    },
    {
      id: "m2q3_13",
      text: "¿Cuál línea corresponde a la Policía Nacional según la infografía?",
      options: [
        { id: "a", text: "141" },
        { id: "b", text: "155" },
        { id: "c", text: "123" },
        { id: "d", text: "122" },
      ],
      correct: "c",
    },
    {
      id: "m2q3_14",
      text: "La línea 155 aparece asociada a la Consejería Presidencial para la Equidad de la Mujer.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q3_15",
      text: "¿Cuál línea corresponde al ICBF?",
      options: [
        { id: "a", text: "122" },
        { id: "b", text: "141" },
        { id: "c", text: "123" },
        { id: "d", text: "155" },
      ],
      correct: "b",
    },
    {
      id: "m2q3_16",
      text: "Si una persona enfrenta una situación de violencia y requiere orientación institucional inmediata, ¿cuál acción es más coherente con la infografía?",
      options: [
        { id: "a", text: "Ignorar el hecho si no hubo lesión física" },
        { id: "b", text: "Buscar líneas de atención y activar rutas institucionales" },
        { id: "c", text: "Esperar a que otra persona denuncie" },
        { id: "d", text: "Resolver exclusivamente por redes sociales" },
      ],
      correct: "b",
    },
    {
      id: "m2q3_17",
      text: "El acoso sexual verbal incluye comentarios o insinuaciones sexuales y calificaciones sobre la sexualidad de la persona.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q3_18",
      text: "¿Cuál ejemplo combina adecuadamente tipo de acoso y clasificación?",
      options: [
        { id: "a", text: "Fotos al cuerpo sin consentimiento = verbal" },
        { id: "b", text: "Sonido de besos = físico" },
        { id: "c", text: "Manoseos = físico" },
        { id: "d", text: "Exhibicionismo = verbal" },
      ],
      correct: "c",
    },
    {
      id: "m2q3_19",
      text: "¿Qué idea general transmite la infografía?",
      options: [
        { id: "a", text: "El acoso es un problema menor y sin rutas de respuesta" },
        { id: "b", text: "Existen manifestaciones distintas del acoso y también derechos y canales de atención para las víctimas" },
        { id: "c", text: "Solo se reconoce el acoso físico" },
        { id: "d", text: "La atención depende únicamente de la voluntad del agresor" },
      ],
      correct: "b",
    },
    {
      id: "m2q3_20",
      text: "Reconocer los tipos de acoso ayuda a identificar situaciones de riesgo y activar rutas de atención más oportunamente.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
  ],
};

const M2_Q4 = {
  title: "Quiz — ANEXO TÉCNICO: PRELACIÓN DEL PEATÓN EN LA VÍA",
  questions: [
    {
      id: "m2q4_01",
      text: "¿Qué idea resume mejor la prelación del peatón?",
      options: [
        { id: "a", text: "El peatón debe adaptarse siempre al vehículo" },
        { id: "b", text: "La protección de la vida e integridad del peatón debe orientar el diseño y el comportamiento en la vía" },
        { id: "c", text: "La prioridad depende del tamaño del vehículo" },
        { id: "d", text: "La prelación aplica solo en zonas rurales" },
      ],
      correct: "b",
    },
    {
      id: "m2q4_02",
      text: "La cartilla insiste en que todos somos peatones en algún punto del trayecto.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q4_03",
      text: "¿Por qué se considera al peatón uno de los actores viales más vulnerables?",
      options: [
        { id: "a", text: "Porque siempre incumple la norma" },
        { id: "b", text: "Porque se moviliza con menor velocidad" },
        { id: "c", text: "Porque no cuenta con una protección equivalente a la carrocería de un vehículo" },
        { id: "d", text: "Porque siempre circula en grupo" },
      ],
      correct: "c",
    },
    {
      id: "m2q4_04",
      text: "Según la cartilla, ¿qué deben hacer las entidades gubernamentales?",
      options: [
        { id: "a", text: "Aumentar únicamente comparendos a peatones" },
        { id: "b", text: "Identificar y monitorear tramos con alta incidencia de siniestros con peatones" },
        { id: "c", text: "Suprimir andenes para ordenar cruces" },
        { id: "d", text: "Priorizar solo el flujo vehicular" },
      ],
      correct: "b",
    },
    {
      id: "m2q4_05",
      text: "La infraestructura vial rural y urbana debe tener en cuenta las necesidades y características de todos los usuarios, privilegiando a los más vulnerables.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q4_06",
      text: "¿Qué conducta se pide a los conductores de vehículos?",
      options: [
        { id: "a", text: "Mantener la marcha sin importar el cruce" },
        { id: "b", text: "No exceder los límites de velocidad y dar prioridad a los peatones" },
        { id: "c", text: "Tocar la bocina para que el peatón apure el paso" },
        { id: "d", text: "Usar el cruce únicamente si no hay señalización" },
      ],
      correct: "b",
    },
    {
      id: "m2q4_07",
      text: "¿En qué lugares se resalta especialmente la prioridad del peatón?",
      options: [
        { id: "a", text: "Peajes y glorietas rurales únicamente" },
        { id: "b", text: "Esquinas, cruces, curvas e intersecciones" },
        { id: "c", text: "Zonas de parqueo privado" },
        { id: "d", text: "Túneles vehiculares solamente" },
      ],
      correct: "b",
    },
    {
      id: "m2q4_08",
      text: "La cartilla señala que es más fácil dejar pasar al peatón que exponerlo.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q4_09",
      text: "¿Qué comportamiento se propone para los peatones?",
      options: [
        { id: "a", text: "Cruzar por cualquier punto si no vienen vehículos cerca" },
        { id: "b", text: "Respetar señales, pasos, puentes y semáforos peatonales" },
        { id: "c", text: "Permanecer siempre en la calzada" },
        { id: "d", text: "Ignorar el entorno si el cruce parece corto" },
      ],
      correct: "b",
    },
    {
      id: "m2q4_10",
      text: "¿Cuál es el sentido de la frase “que el afán no se convierta en la excusa”?",
      options: [
        { id: "a", text: "Justificar cruces improvisados" },
        { id: "b", text: "Recordar que la prisa no debe llevar a decisiones inseguras en la vía" },
        { id: "c", text: "Permitir correr entre vehículos" },
        { id: "d", text: "Reducir el uso de pasos seguros" },
      ],
      correct: "b",
    },
    {
      id: "m2q4_11",
      text: "Estar atentos al entorno permite identificar la presencia o ausencia de pasos seguros peatonales.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q4_12",
      text: "Frente al panorama colombiano citado en la cartilla, ¿qué dato se menciona para 2021?",
      options: [
        { id: "a", text: "552 peatones fallecidos" },
        { id: "b", text: "1.552 peatones fallecidos" },
        { id: "c", text: "15.520 peatones fallecidos" },
        { id: "d", text: "725 peatones fallecidos" },
      ],
      correct: "b",
    },
    {
      id: "m2q4_13",
      text: "¿Qué grupo etario aparece como especialmente afectado como peatón?",
      options: [
        { id: "a", text: "Menores de 5 años exclusivamente" },
        { id: "b", text: "Adultos mayores de 70 años" },
        { id: "c", text: "Personas entre 20 y 29 años únicamente" },
        { id: "d", text: "Adolescentes entre 11 y 17 años" },
      ],
      correct: "b",
    },
    {
      id: "m2q4_14",
      text: "La cartilla menciona que, en la mayoría de los fallecimientos de peatones, estuvo involucrado un motociclista.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q4_15",
      text: "¿Cuál mensaje institucional se desprende mejor de la cartilla?",
      options: [
        { id: "a", text: "La protección del peatón depende solo del peatón" },
        { id: "b", text: "Todos los actores pueden contribuir a reducir las cifras de siniestralidad" },
        { id: "c", text: "La prelación elimina la responsabilidad de los conductores" },
        { id: "d", text: "La infraestructura no influye en la seguridad peatonal" },
      ],
      correct: "b",
    },
    {
      id: "m2q4_16",
      text: "¿Qué acción sería más coherente con la prelación del peatón en una intersección?",
      options: [
        { id: "a", text: "Girar rápido antes de que termine el cruce" },
        { id: "b", text: "Ceder el paso y anticipar la presencia del peatón" },
        { id: "c", text: "Invadir la cebra si el semáforo cambia" },
        { id: "d", text: "Acelerar para no detener el flujo" },
      ],
      correct: "b",
    },
    {
      id: "m2q4_17",
      text: "La prelación del peatón no depende únicamente de normas, sino también de decisiones de diseño e infraestructura.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m2q4_18",
      text: "¿Cuál afirmación refleja mejor el deber de las autoridades frente a la prelación peatonal?",
      options: [
        { id: "a", text: "Diseñar para privilegiar únicamente la velocidad vehicular" },
        { id: "b", text: "Garantizar infraestructura que considere las necesidades de usuarios vulnerables" },
        { id: "c", text: "Limitar la movilidad peatonal en cruces urbanos" },
        { id: "d", text: "Trasladar toda la carga de seguridad al peatón" },
      ],
      correct: "b",
    },
    {
      id: "m2q4_19",
      text: "Desde el enfoque de la cartilla, ¿qué relación existe entre velocidad y protección peatonal?",
      options: [
        { id: "a", text: "Ninguna" },
        { id: "b", text: "A mayor velocidad del vehículo, menor necesidad de ceder" },
        { id: "c", text: "Respetar límites de velocidad mejora la capacidad de reacción y reduce la exposición del peatón" },
        { id: "d", text: "La velocidad solo afecta a conductores, no a peatones" },
      ],
      correct: "c",
    },
    {
      id: "m2q4_20",
      text: "La cartilla presenta la prelación del peatón como una responsabilidad compartida entre autoridades, conductores y peatones.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
  ],
};


// ======================================================================
// Module 3
// ======================================================================

const M3_Q1 = {
  title: "Quiz — ANEXO TÉCNICO: MANUAL DE SEÑALIZACIÓN VIAL DE COLOMBIA 2024",
  questions: [
    {
      id: "m3q1_01",
      text: "¿Qué capítulo del Manual de Señalización Vial reúne la señalización específica para peatones, ciclistas y motociclistas?",
      options: [
        { id: "a", text: "Capítulo 2" },
        { id: "b", text: "Capítulo 4" },
        { id: "c", text: "Capítulo 6" },
        { id: "d", text: "Capítulo 9" },
      ],
      correct: "c",
    },
    {
      id: "m3q1_02",
      text: "El Manual de Señalización Vial reconoce expresamente a peatones, ciclistas y motociclistas como usuarios vulnerables.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q1_03",
      text: "¿Qué define mejor una ciclorruta según el manual?",
      options: [
        { id: "a", text: "Una vía mixta compartida sin demarcación" },
        { id: "b", text: "Una vía reservada exclusivamente para bicicletas y segregada físicamente" },
        { id: "c", text: "Un carril exclusivo para motos y bicicletas" },
        { id: "d", text: "Un andén adaptado para cualquier vehículo liviano" },
      ],
      correct: "b",
    },
    {
      id: "m3q1_04",
      text: "¿Qué define mejor una ciclobanda?",
      options: [
        { id: "a", text: "Una vía peatonal con acceso temporal de ciclistas" },
        { id: "b", text: "Una vía exclusiva para bicicletas segregada visualmente mediante demarcación, color u otros dispositivos" },
        { id: "c", text: "Una autopista para bicicletas" },
        { id: "d", text: "Un carril de adelantamiento para ciclistas" },
      ],
      correct: "b",
    },
    {
      id: "m3q1_05",
      text: "El manual indica que la ciclorruta suele ser la opción más segura para el ciclista, al estar separada de peatones y tránsito motorizado.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q1_06",
      text: "¿Cuál de las siguientes corresponde a una vía ciclo-adaptada?",
      options: [
        { id: "a", text: "Ciclorruta bidireccional" },
        { id: "b", text: "Ciclobanda" },
        { id: "c", text: "Banda ciclopreferente" },
        { id: "d", text: "Puente peatonal" },
      ],
      correct: "c",
    },
    {
      id: "m3q1_07",
      text: "¿Cuál de estas opciones NO aparece como estrategia de ciclo-adaptación en el manual?",
      options: [
        { id: "a", text: "Carril ciclopreferente" },
        { id: "b", text: "Carril bus-bici" },
        { id: "c", text: "Circulación a contraflujo" },
        { id: "d", text: "Túnel ciclista obligatorio" },
      ],
      correct: "d",
    },
    {
      id: "m3q1_08",
      text: "Las vías ciclo-adaptadas comparten en alguna medida la calzada con el tránsito motorizado o autorizan el uso de infraestructura peatonal.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q1_09",
      text: "¿Qué señal se menciona específicamente para identificar ciclo-infraestructura?",
      options: [
        { id: "a", text: "SR-30" },
        { id: "b", text: "SRC-06" },
        { id: "c", text: "SI-09" },
        { id: "d", text: "SP-54" },
      ],
      correct: "b",
    },
    {
      id: "m3q1_10",
      text: "En una ciclorruta bidireccional, además de líneas de borde, el manual menciona:",
      options: [
        { id: "a", text: "Línea de eje central continua" },
        { id: "b", text: "Línea de estacionamiento" },
        { id: "c", text: "Línea de no adelantar vehicular" },
        { id: "d", text: "Exclusivamente pictogramas de peatón" },
      ],
      correct: "a",
    },
    {
      id: "m3q1_11",
      text: "El manual señala que la señalización de una ciclorruta debe considerar tanto señalización vertical como horizontal.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q1_12",
      text: "¿Cuál señal reglamentaria menciona el manual como complementaria en ciclo-infraestructura para controlar la velocidad?",
      options: [
        { id: "a", text: "SR-30 Velocidad máxima permitida" },
        { id: "b", text: "SI-11 Prioridad ciclistas" },
        { id: "c", text: "SRC-02 Descender de la bicicleta" },
        { id: "d", text: "SRC-01 Conserve la derecha" },
      ],
      correct: "a",
    },
    {
      id: "m3q1_13",
      text: "En una intersección de ciclo-infraestructura con vía vehicular no semaforizada, el manual recomienda:",
      options: [
        { id: "a", text: "Eliminar toda señalización" },
        { id: "b", text: "Instalar resalto trapezoidal o pompeyano" },
        { id: "c", text: "Permitir prioridad permanente del vehículo" },
        { id: "d", text: "Sustituir la demarcación por conos provisionales" },
      ],
      correct: "b",
    },
    {
      id: "m3q1_14",
      text: "Ante prevalencia del paso peatonal en una intersección de ciclo-infraestructura, puede requerirse la señal de obligatorio descender de la bicicleta.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q1_15",
      text: "¿Cuál señal se menciona para reforzar el comportamiento dentro de la ciclo-infraestructura?",
      options: [
        { id: "a", text: "Pare vehicular exclusivo" },
        { id: "b", text: "Conserve la derecha" },
        { id: "c", text: "Giro obligatorio de buses" },
        { id: "d", text: "Prohibido adelantar peatones" },
      ],
      correct: "b",
    },
    {
      id: "m3q1_16",
      text: "¿Qué característica tienen los semáforos para ciclistas según el manual?",
      options: [
        { id: "a", text: "Dos módulos luminosos" },
        { id: "b", text: "Cuatro módulos luminosos" },
        { id: "c", text: "Tres módulos luminosos" },
        { id: "d", text: "Un único módulo intermitente" },
      ],
      correct: "c",
    },
    {
      id: "m3q1_17",
      text: "Cuando la intersección tiene carriles exclusivos para bicicletas, el control semafórico debe incluir semáforos para ciclistas.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q1_18",
      text: "El semáforo repetidor para ciclistas se puede instalar como:",
      options: [
        { id: "a", text: "Sustituto del semáforo principal vehicular" },
        { id: "b", text: "Elemento complementario que repite exactamente las mismas indicaciones del principal para ciclistas" },
        { id: "c", text: "Señal sonora peatonal" },
        { id: "d", text: "Dispositivo exclusivo nocturno" },
      ],
      correct: "b",
    },
    {
      id: "m3q1_19",
      text: "¿Qué señal informativa aparece en el manual asociada a priorización para ciclistas?",
      options: [
        { id: "a", text: "SI-11A Prioridad vía para ciclistas" },
        { id: "b", text: "SP-40 Ciclista en contravía" },
        { id: "c", text: "SR-50 Zona de parqueo" },
        { id: "d", text: "SRC-10 Fin de vía" },
      ],
      correct: "a",
    },
    {
      id: "m3q1_20",
      text: "El manual actualizado incorpora nuevas señales y pictogramas orientados a la movilidad activa y fortalece parámetros de protección para usuarios vulnerables.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
  ],
};

const M3_Q2 = {
  title: "Quiz — ANEXO TÉCNICO: MANUAL DE SEGURIDAD VIAL PARA CICLISTAS 2024",
  questions: [
    {
      id: "m3q2_01",
      text: "¿Cuál es el propósito central del Manual de Seguridad Vial para Ciclistas?",
      options: [
        { id: "a", text: "Regular la fabricación de bicicletas" },
        { id: "b", text: "Brindar herramientas pedagógicas para promover comportamientos seguros de los ciclistas" },
        { id: "c", text: "Sustituir el Código Nacional de Tránsito" },
        { id: "d", text: "Crear licencias especiales para bicicletas" },
      ],
      correct: "b",
    },
    {
      id: "m3q2_02",
      text: "El manual promueve el autocuidado y la corresponsabilidad entre actores viales.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q2_03",
      text: "El manual está dirigido principalmente a:",
      options: [
        { id: "a", text: "Solo ciclistas profesionales de competencia" },
        { id: "b", text: "Solo autoridades de tránsito" },
        { id: "c", text: "Todas las personas que usan la bicicleta para estudiar, trabajar, hacer deporte, turismo u ocio" },
        { id: "d", text: "Únicamente menores de edad" },
      ],
      correct: "c",
    },
    {
      id: "m3q2_04",
      text: "¿Cómo presenta el manual la condición del ciclista en seguridad vial?",
      options: [
        { id: "a", text: "Como actor vial protegido por carrocería" },
        { id: "b", text: "Como actor vial no vulnerable" },
        { id: "c", text: "Como actor vial vulnerable por carecer de estructura de protección" },
        { id: "d", text: "Como actor con prioridad absoluta frente a todos" },
      ],
      correct: "c",
    },
    {
      id: "m3q2_05",
      text: "El manual puede utilizarse en colegios, universidades, entidades públicas y privadas.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q2_06",
      text: "¿Cuál de estos temas sí aparece en el contenido del manual?",
      options: [
        { id: "a", text: "Conducción segura de la bicicleta" },
        { id: "b", text: "Reparación de motores eléctricos" },
        { id: "c", text: "Navegación marítima urbana" },
        { id: "d", text: "Señalización aérea" },
      ],
      correct: "a",
    },
    {
      id: "m3q2_07",
      text: "¿Cuál es una recomendación normativa destacada en el manual respecto a visibilidad nocturna o baja visibilidad?",
      options: [
        { id: "a", text: "Usar solo ropa oscura" },
        { id: "b", text: "Vestir chaleco o chaqueta reflectiva entre 18:00 y 6:00 o cuando la visibilidad sea escasa" },
        { id: "c", text: "Circular sin luces si la vía está despejada" },
        { id: "d", text: "Reemplazar la luz trasera por timbre" },
      ],
      correct: "b",
    },
    {
      id: "m3q2_08",
      text: "El manual recoge que la no utilización del casco siempre inmoviliza la bicicleta de cualquier ciclista, sin excepción.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "b",
    },
    {
      id: "m3q2_09",
      text: "Según el material normativo citado en el manual, el casco de seguridad aplica de manera expresa para:",
      options: [
        { id: "a", text: "Todos los ciclistas mayores de 18 años en cualquier trayecto" },
        { id: "b", text: "Menores de edad y casos de competencia, entrenamiento y deporte" },
        { id: "c", text: "Solo ciclistas recreativos" },
        { id: "d", text: "Solo usuarios de ciclobanda" },
      ],
      correct: "b",
    },
    {
      id: "m3q2_10",
      text: "¿Cuál conducta está prohibida según el manual al citar normas del tránsito para bicicletas?",
      options: [
        { id: "a", text: "Usar señales manuales" },
        { id: "b", text: "Adelantar por la izquierda" },
        { id: "c", text: "Adelantar por la derecha o entre vehículos que circulan por sus carriles" },
        { id: "d", text: "Utilizar vías permitidas" },
      ],
      correct: "c",
    },
    {
      id: "m3q2_11",
      text: "El manual indica que la bicicleta no debe transitar sobre aceras ni lugares destinados al tránsito de peatones.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q2_12",
      text: "¿Qué debe hacer el ciclista frente a las señales y límites de velocidad?",
      options: [
        { id: "a", text: "Ignorarlos cuando la vía esté vacía" },
        { id: "b", text: "Respetarlos" },
        { id: "c", text: "Aplicarlos solo de noche" },
        { id: "d", text: "Seguirlos únicamente en zonas escolares" },
      ],
      correct: "b",
    },
    {
      id: "m3q2_13",
      text: "¿Qué recomienda el manual sobre sobrepasar otro vehículo?",
      options: [
        { id: "a", text: "Usar siempre el carril libre a la izquierda del vehículo a sobrepasar" },
        { id: "b", text: "Pasar por cualquier lado si hay espacio" },
        { id: "c", text: "Usar el andén" },
        { id: "d", text: "Sobrepasar sin señalizar" },
      ],
      correct: "a",
    },
    {
      id: "m3q2_14",
      text: "El manual enseña que ser visible reduce el riesgo porque permite que otros actores reaccionen, frenen o se detengan.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q2_15",
      text: "¿Qué combinación de elementos favorece la visibilidad del ciclista?",
      options: [
        { id: "a", text: "Luz blanca delantera, luz roja trasera y prendas visibles o reflectivas" },
        { id: "b", text: "Solo casco negro mate" },
        { id: "c", text: "Solo timbre" },
        { id: "d", text: "Únicamente ropa deportiva oscura" },
      ],
      correct: "a",
    },
    {
      id: "m3q2_16",
      text: "¿Qué recomienda el manual respecto a las luces en la noche?",
      options: [
        { id: "a", text: "Apuntarlas a la altura de los ojos de otros actores" },
        { id: "b", text: "No usarlas si hay alumbrado público" },
        { id: "c", text: "Apuntarlas al suelo para no encandilar" },
        { id: "d", text: "Usar solo luz trasera" },
      ],
      correct: "c",
    },
    {
      id: "m3q2_17",
      text: "El manual considera útil que el ciclista use dispositivos sonoros como timbre o incluso silbato para llamar la atención.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q2_18",
      text: "¿Cómo debe ser la relación del ciclista con la infraestructura según el manual?",
      options: [
        { id: "a", text: "Indiferente al tipo de vía" },
        { id: "b", text: "Basada en reconocer los tipos de vías para tomar decisiones seguras" },
        { id: "c", text: "Limitada únicamente a ciclorrutas" },
        { id: "d", text: "Igual a la de un peatón" },
      ],
      correct: "b",
    },
    {
      id: "m3q2_19",
      text: "¿Cuál de estas categorías de vías dentro del perímetro urbano menciona el manual?",
      options: [
        { id: "a", text: "Ciclorrutas y peatonales" },
        { id: "b", text: "Solo autopistas y férreas" },
        { id: "c", text: "Únicamente privadas" },
        { id: "d", text: "Solo vías principales" },
      ],
      correct: "a",
    },
    {
      id: "m3q2_20",
      text: "El manual integra conducción segura, uso de EPP, visibilidad, infraestructura, puntos ciegos y protocolo PAS.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
  ],
};

const M3_Q3 = {
  title: "Quiz — ANEXO TÉCNICO: GUÍA DE PROTECCIÓN A CICLISTAS 2024",
  questions: [
    {
      id: "m3q3_01",
      text: "¿Cómo define la guía a los ciclistas?",
      options: [
        { id: "a", text: "Usuarios ocasionales del andén" },
        { id: "b", text: "Conductores de vehículos no motorizados" },
        { id: "c", text: "Peatones con ruedas" },
        { id: "d", text: "Operadores de vehículos de carga" },
      ],
      correct: "b",
    },
    {
      id: "m3q3_02",
      text: "La guía reconoce que el ciclista puede usar la bicicleta como medio de transporte, trabajo, deporte o recreación.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q3_03",
      text: "¿Qué idea central desarrolla la guía frente a la convivencia vial?",
      options: [
        { id: "a", text: "Que cada actor use espacios separados en todo momento" },
        { id: "b", text: "Que los actores viales conviven constantemente y deben aplicar normas comunes" },
        { id: "c", text: "Que el ciclista siempre tenga prioridad absoluta" },
        { id: "d", text: "Que el vehículo motorizado define las reglas del tramo" },
      ],
      correct: "b",
    },
    {
      id: "m3q3_04",
      text: "¿Qué norma menciona la guía como referencia para derechos y deberes de los actores viales, especialmente peatones y ciclistas?",
      options: [
        { id: "a", text: "Ley 100 de 1993" },
        { id: "b", text: "Ley 1811 de 2016" },
        { id: "c", text: "Ley 769 de 2002 sin modificaciones" },
        { id: "d", text: "Decreto 410 de 1971" },
      ],
      correct: "b",
    },
    {
      id: "m3q3_05",
      text: "La guía indica que los ciclistas tienen derecho a utilizar un carril completo de la vía, como cualquier otro vehículo.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q3_06",
      text: "¿Qué significa en la guía reconocer que peatones y ciclistas “tienen la vía”?",
      options: [
        { id: "a", text: "Que pueden ignorar las normas" },
        { id: "b", text: "Que debe entenderse su mayor vulnerabilidad frente al vehículo motorizado" },
        { id: "c", text: "Que están exentos de señalizar maniobras" },
        { id: "d", text: "Que pueden circular en cualquier sentido" },
      ],
      correct: "b",
    },
    {
      id: "m3q3_07",
      text: "¿Qué distancia de seguridad debe guardarse al adelantar a un ciclista?",
      options: [
        { id: "a", text: "0,5 metros" },
        { id: "b", text: "1 metro" },
        { id: "c", text: "1,5 metros" },
        { id: "d", text: "2,5 metros" },
      ],
      correct: "c",
    },
    {
      id: "m3q3_08",
      text: "La guía vincula la distancia de 1,5 metros con la prevención de lesiones o muerte del ciclista.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q3_09",
      text: "¿Qué mensaje transmite la guía sobre coexistencia entre vía general y ciclo-infraestructura?",
      options: [
        { id: "a", text: "Que el vehículo motorizado puede desconocer la presencia del ciclista" },
        { id: "b", text: "Que la vía debe compartirse incluso cuando en el mismo tramo exista ciclo-infraestructura" },
        { id: "c", text: "Que el ciclista debe abandonar la vía general de forma obligatoria" },
        { id: "d", text: "Que solo la moto puede compartir espacio con el ciclista" },
      ],
      correct: "b",
    },
    {
      id: "m3q3_10",
      text: "¿Cuál afirmación es más coherente con la guía?",
      options: [
        { id: "a", text: "El ciclista es un obstáculo para la movilidad" },
        { id: "b", text: "El ciclista es actor vial con derechos y deberes" },
        { id: "c", text: "El ciclista solo debe usar parques" },
        { id: "d", text: "El ciclista no requiere protección jurídica" },
      ],
      correct: "b",
    },
    {
      id: "m3q3_11",
      text: "La guía insiste en que la convivencia con ciclistas depende también del conocimiento de la norma por parte de los demás actores viales.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q3_12",
      text: "Un conductor que adelanta muy cerca a un ciclista:",
      options: [
        { id: "a", text: "Cumple la norma si no toca la bicicleta" },
        { id: "b", text: "Solo incumple si hay ciclorruta" },
        { id: "c", text: "Desconoce la distancia de vida recomendada por la guía" },
        { id: "d", text: "Tiene prioridad por ir más rápido" },
      ],
      correct: "c",
    },
    {
      id: "m3q3_13",
      text: "¿Cuál conducta refleja mejor el enfoque de protección al ciclista?",
      options: [
        { id: "a", text: "Invadir su trayectoria para obligarlo a orillarse" },
        { id: "b", text: "Mantener distancia lateral suficiente y anticipar su vulnerabilidad" },
        { id: "c", text: "Sobrepasarlo en curvas cerradas" },
        { id: "d", text: "Tocar bocina para que acelere" },
      ],
      correct: "b",
    },
    {
      id: "m3q3_14",
      text: "La guía parte de que el ciclista no es un actor aislado, sino parte del sistema de movilidad.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q3_15",
      text: "¿Qué se deriva de reconocer al ciclista como conductor de vehículo no motorizado?",
      options: [
        { id: "a", text: "Que no debe obedecer normas" },
        { id: "b", text: "Que forma parte activa del tránsito y debe ser respetado como usuario de la vía" },
        { id: "c", text: "Que solo puede circular en eventos recreativos" },
        { id: "d", text: "Que no puede ocupar carril" },
      ],
      correct: "b",
    },
    {
      id: "m3q3_16",
      text: "¿Cuál escenario contradice más directamente la guía?",
      options: [
        { id: "a", text: "Respetar el carril del ciclista" },
        { id: "b", text: "Adelantar con 1,5 metros de distancia" },
        { id: "c", text: "Asumir que el ciclista no tiene derecho a ocupar espacio vial" },
        { id: "d", text: "Compartir la vía con precaución" },
      ],
      correct: "c",
    },
    {
      id: "m3q3_17",
      text: "La guía asocia la protección del ciclista con el deber general de convivencia entre actores viales.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q3_18",
      text: "Desde la guía, ¿qué debería hacer un conductor al encontrarse con un ciclista en una vía sin segregación física?",
      options: [
        { id: "a", text: "Pasar de inmediato por cercanía" },
        { id: "b", text: "Compartir la vía, reconocer su vulnerabilidad y adelantar con distancia segura" },
        { id: "c", text: "Obligar al ciclista a salir de la calzada" },
        { id: "d", text: "Circular sobre la ciclorruta para rebasar" },
      ],
      correct: "b",
    },
    {
      id: "m3q3_19",
      text: "¿Cuál mensaje institucional resume mejor la guía?",
      options: [
        { id: "a", text: "El ciclista solo tiene deberes" },
        { id: "b", text: "El ciclista tiene derecho a transitar y todos deben proteger su integridad en la vía" },
        { id: "c", text: "La bicicleta es un modo secundario sin protección normativa" },
        { id: "d", text: "La convivencia depende solo del ciclista" },
      ],
      correct: "b",
    },
    {
      id: "m3q3_20",
      text: "La guía presenta la protección al ciclista como una obligación práctica de convivencia, no solo como una recomendación moral.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
  ],
};

const M3_Q4 = {
  title: "Quiz — ANEXO TÉCNICO: SEGURIDAD VIAL Y DISCAPACIDAD 2024",
  questions: [
    {
      id: "m3q4_01",
      text: "¿Cuál es uno de los propósitos principales de la publicación Seguridad Vial y Discapacidad?",
      options: [
        { id: "a", text: "Regular la compra de ayudas técnicas" },
        { id: "b", text: "Contribuir a comprender la relación entre seguridad vial y discapacidad" },
        { id: "c", text: "Definir licencias de conducción especiales" },
        { id: "d", text: "Establecer sanciones para peatones" },
      ],
      correct: "b",
    },
    {
      id: "m3q4_02",
      text: "El documento fue elaborado para sensibilizar sobre los impactos humanos de los siniestros viales y la discapacidad.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q4_03",
      text: "¿Qué resalta el documento frente a los siniestros viales?",
      options: [
        { id: "a", text: "Solo sus costos materiales" },
        { id: "b", text: "Solo sus efectos en automotores" },
        { id: "c", text: "Sus efectos físicos, psicológicos, familiares, sociales y económicos" },
        { id: "d", text: "Solo sus implicaciones penales" },
      ],
      correct: "c",
    },
    {
      id: "m3q4_04",
      text: "¿A quiénes busca sensibilizar el documento?",
      options: [
        { id: "a", text: "Solo a médicos" },
        { id: "b", text: "Solo a conductores particulares" },
        { id: "c", text: "A actores viales, líderes, defensores de seguridad vial y responsables de políticas públicas" },
        { id: "d", text: "Solo a personas con licencia profesional" },
      ],
      correct: "c",
    },
    {
      id: "m3q4_05",
      text: "El documento reconoce que la movilidad y la seguridad en el entorno vial deben abordarse también desde la inclusión.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q4_06",
      text: "¿Qué plantea el texto sobre las brechas entre personas con y sin discapacidad?",
      options: [
        { id: "a", text: "Que son inevitables" },
        { id: "b", text: "Que deben reducirse mediante espacios más inclusivos" },
        { id: "c", text: "Que solo importan en salud" },
        { id: "d", text: "Que no son un asunto vial" },
      ],
      correct: "b",
    },
    {
      id: "m3q4_07",
      text: "Según el documento, ¿qué tipo de respuesta se requiere ante la discapacidad derivada de siniestros?",
      options: [
        { id: "a", text: "Exclusivamente médica" },
        { id: "b", text: "Solo policial" },
        { id: "c", text: "Psicológica, social, jurídica y de salud, entre otras" },
        { id: "d", text: "Únicamente económica" },
      ],
      correct: "c",
    },
    {
      id: "m3q4_08",
      text: "El documento sostiene que la seguridad vial es un asunto de todos y depende tanto del Estado como de la ciudadanía.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q4_09",
      text: "¿Qué grupos menciona el documento como actores viales especialmente vulnerables?",
      options: [
        { id: "a", text: "Solo motociclistas" },
        { id: "b", text: "Niños, adultos mayores y personas con discapacidad" },
        { id: "c", text: "Solo peatones" },
        { id: "d", text: "Solo ciclistas recreativos" },
      ],
      correct: "b",
    },
    {
      id: "m3q4_10",
      text: "¿Qué enfoque considera necesario el documento para el tratamiento y rehabilitación de personas afectadas?",
      options: [
        { id: "a", text: "Exclusivamente clínico" },
        { id: "b", text: "Multidimensional" },
        { id: "c", text: "Únicamente sancionatorio" },
        { id: "d", text: "Solo urbanístico" },
      ],
      correct: "b",
    },
    {
      id: "m3q4_11",
      text: "El texto plantea que el impacto de un traumatismo vial va más allá de la lesión física.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q4_12",
      text: "¿Qué factores menciona el documento para diseñar políticas preventivas y respuestas adecuadas?",
      options: [
        { id: "a", text: "Solo velocidad y señalización" },
        { id: "b", text: "Factores personales, psicológicos, barreras del entorno y restricciones de participación" },
        { id: "c", text: "Solo edad y sexo" },
        { id: "d", text: "Exclusivamente costos de atención" },
      ],
      correct: "b",
    },
    {
      id: "m3q4_13",
      text: "¿Qué idea expresa mejor el enfoque de inclusión del documento?",
      options: [
        { id: "a", text: "Adaptarse al entorno existente sin cambios" },
        { id: "b", text: "Crear oportunidades y garantías para una vida digna y autónoma" },
        { id: "c", text: "Limitar desplazamientos por seguridad" },
        { id: "d", text: "Segregar permanentemente a usuarios con discapacidad" },
      ],
      correct: "b",
    },
    {
      id: "m3q4_14",
      text: "El documento cuestiona si sociedad e instituciones están haciendo lo suficiente para prevenir siniestros, reducir lesiones y mitigar impactos.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q4_15",
      text: "En relación con movilidad activa y sostenible, ¿qué lectura aporta este anexo al módulo 3?",
      options: [
        { id: "a", text: "Que basta con promover bicicleta sin considerar accesibilidad" },
        { id: "b", text: "Que una movilidad segura debe ser también inclusiva y considerar barreras del entorno" },
        { id: "c", text: "Que la discapacidad es un tema ajeno a la seguridad vial" },
        { id: "d", text: "Que la infraestructura solo debe pensarse para usuarios estándar" },
      ],
      correct: "b",
    },
    {
      id: "m3q4_16",
      text: "¿Cuál afirmación es más coherente con este documento?",
      options: [
        { id: "a", text: "La discapacidad solo importa después del siniestro" },
        { id: "b", text: "La discapacidad debe considerarse tanto en prevención como en respuesta y accesibilidad" },
        { id: "c", text: "La inclusión es un tema voluntario" },
        { id: "d", text: "Las barreras del entorno son secundarias" },
      ],
      correct: "b",
    },
    {
      id: "m3q4_17",
      text: "El documento plantea que la misma sociedad puede crear o mantener barreras que limiten la inclusión y la autonomía.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m3q4_18",
      text: "En una ciudad que promueve bicicleta y micromovilidad, ¿qué decisión estaría más alineada con este anexo?",
      options: [
        { id: "a", text: "Construir infraestructura sin pensar en usuarios con movilidad reducida" },
        { id: "b", text: "Diseñar entornos más inclusivos, seguros y con menor barrera de acceso" },
        { id: "c", text: "Priorizar únicamente velocidad operacional" },
        { id: "d", text: "Excluir todo criterio de accesibilidad por tratarse de movilidad activa" },
      ],
      correct: "b",
    },
    {
      id: "m3q4_19",
      text: "¿Qué idea institucional resume mejor el texto?",
      options: [
        { id: "a", text: "La discapacidad es solo una consecuencia médica" },
        { id: "b", text: "La seguridad vial y la discapacidad se relacionan con derechos, inclusión, prevención y respuesta integral" },
        { id: "c", text: "La prevención vial no tiene relación con inclusión" },
        { id: "d", text: "El entorno vial no influye en la participación social" },
      ],
      correct: "b",
    },
    {
      id: "m3q4_20",
      text: "Este anexo fortalece el M3 al recordar que una movilidad sostenible y activa también debe ser segura para usuarios vulnerables y accesible en términos sociales y físicos.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
  ],
};


// ======================================================================
// Module 4
// ======================================================================

const M4_Q1 = {
  title: "Quiz — ANEXO TÉCNICO: MANUAL DE SEÑALIZACIÓN VIAL DE COLOMBIA 2024",
  questions: [
    {
      id: "m4q1_01",
      text: "¿En qué capítulo del Manual de Señalización Vial se encuentran las señales y dispositivos específicos para motociclistas?",
      options: [
        { id: "a", text: "Capítulo 3" },
        { id: "b", text: "Capítulo 4" },
        { id: "c", text: "Capítulo 6" },
        { id: "d", text: "Capítulo 8" },
      ],
      correct: "c",
    },
    {
      id: "m4q1_02",
      text: "El manual reconoce a los motociclistas como usuarios vulnerables dentro del sistema vial.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q1_03",
      text: "¿Cuál es una razón por la que el manual considera vulnerables a los motociclistas?",
      options: [
        { id: "a", text: "Porque siempre circulan a mayor velocidad" },
        { id: "b", text: "Porque tienen poca protección frente a colisiones, choques o caídas" },
        { id: "c", text: "Porque solo circulan en vías rurales" },
        { id: "d", text: "Porque no requieren señalización específica" },
      ],
      correct: "b",
    },
    {
      id: "m4q1_04",
      text: "Según el manual, los elementos de señalización enfocados al tránsito de motocicletas deben cumplir requerimientos técnicos de:",
      options: [
        { id: "a", text: "Publicidad exterior y diseño urbano" },
        { id: "b", text: "Capítulos de señales verticales y demarcaciones" },
        { id: "c", text: "Solo semaforización peatonal" },
        { id: "d", text: "Únicamente obras en vía" },
      ],
      correct: "b",
    },
    {
      id: "m4q1_05",
      text: "La señalización para motociclistas debe considerar especificaciones como antideslizancia y retrorreflectividad.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q1_06",
      text: "¿Qué es una motovía según el manual?",
      options: [
        { id: "a", text: "Un andén habilitado para motos" },
        { id: "b", text: "Un espacio de calzada vehicular dedicado al uso exclusivo de motocicletas" },
        { id: "c", text: "Una zona escolar con acceso restringido" },
        { id: "d", text: "Una glorieta especial para transporte pesado" },
      ],
      correct: "b",
    },
    {
      id: "m4q1_07",
      text: "¿Cuál es la principal función de una motovía?",
      options: [
        { id: "a", text: "Aumentar la velocidad máxima de circulación" },
        { id: "b", text: "Organizar el tránsito de motociclistas y disminuir conflictos con otros vehículos motorizados" },
        { id: "c", text: "Reemplazar los semáforos" },
        { id: "d", text: "Eliminar la necesidad de señalización" },
      ],
      correct: "b",
    },
    {
      id: "m4q1_08",
      text: "El manual establece detalladamente el ancho obligatorio y universal de todas las motovías.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "b",
    },
    {
      id: "m4q1_09",
      text: "El manual aclara que la implementación de motovías depende de:",
      options: [
        { id: "a", text: "La decisión espontánea de los conductores" },
        { id: "b", text: "Un estudio técnico y aprobación de la autoridad competente" },
        { id: "c", text: "La preferencia del concesionario de motos" },
        { id: "d", text: "El color de la motocicleta" },
      ],
      correct: "b",
    },
    {
      id: "m4q1_10",
      text: "¿Cuál de las siguientes describe mejor una motovía exclusiva?",
      options: [
        { id: "a", text: "Un carril mixto donde la moto comparte con buses" },
        { id: "b", text: "Una calzada delimitada y dedicada al uso exclusivo de motocicletas, segregada físicamente" },
        { id: "c", text: "Una vía peatonal compartida con motos" },
        { id: "d", text: "Una zona temporal sin señalización" },
      ],
      correct: "b",
    },
    {
      id: "m4q1_11",
      text: "Las motovías inclusivas pueden estar demarcadas dentro de una calzada vehicular y buscan separar la circulación de motocicletas del resto de vehículos automotores.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q1_12",
      text: "¿Qué caracteriza mejor a una motovía inclusiva?",
      options: [
        { id: "a", text: "Solo existe fuera del perímetro urbano" },
        { id: "b", text: "Se ubica siempre en puentes" },
        { id: "c", text: "Puede demarcarse dentro de la calzada, en costados o incluso en la mitad de carriles de uso mixto" },
        { id: "d", text: "Reemplaza toda señal vertical" },
      ],
      correct: "c",
    },
    {
      id: "m4q1_13",
      text: "La necesidad de señalización específica para motociclistas se relaciona, entre otras cosas, con:",
      options: [
        { id: "a", text: "La posibilidad de vender motos sin licencia" },
        { id: "b", text: "La necesidad de comunicar reglas seguras a un actor vulnerable" },
        { id: "c", text: "La eliminación del riesgo por completo" },
        { id: "d", text: "La sustitución del Código Nacional de Tránsito" },
      ],
      correct: "b",
    },
    {
      id: "m4q1_14",
      text: "El manual presenta a la motocicleta como un medio de transporte de uso masivo en Colombia.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q1_15",
      text: "¿Qué dato general incluye el manual sobre el parque automotor registrado en 2024?",
      options: [
        { id: "a", text: "Que las motocicletas representan menos del 20 %" },
        { id: "b", text: "Que las motocicletas representan más del 61 %" },
        { id: "c", text: "Que solo hay motos en ciudades principales" },
        { id: "d", text: "Que las motos no están registradas en el RUNT" },
      ],
      correct: "b",
    },
    {
      id: "m4q1_16",
      text: "¿Cuál afirmación es más coherente con el enfoque del manual para motociclistas?",
      options: [
        { id: "a", text: "Basta con pintar la vía, sin necesidad de criterios técnicos" },
        { id: "b", text: "La señalización debe ayudar a ordenar, orientar y reducir conflictos" },
        { id: "c", text: "La señalización se usa solo en carreteras nacionales" },
        { id: "d", text: "Las motos no requieren tratamientos especiales" },
      ],
      correct: "b",
    },
    {
      id: "m4q1_17",
      text: "El manual asocia las motovías con una mejor gestión del tránsito de motocicletas.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q1_18",
      text: "¿Cuál escenario contradice más el enfoque del manual?",
      options: [
        { id: "a", text: "Implementar señalización clara para motociclistas" },
        { id: "b", text: "Separar flujos cuando exista justificación técnica" },
        { id: "c", text: "Crear espacios para motos sin respaldo técnico ni aprobación de autoridad" },
        { id: "d", text: "Exigir especificaciones de demarcación" },
      ],
      correct: "c",
    },
    {
      id: "m4q1_19",
      text: "¿Qué relación plantea el manual entre señalización y seguridad de motociclistas?",
      options: [
        { id: "a", text: "Ninguna, porque la seguridad depende solo del conductor" },
        { id: "b", text: "La señalización forma parte de la organización vial para reducir conflictos y orientar una circulación más segura" },
        { id: "c", text: "Solo aplica a motos de alto cilindraje" },
        { id: "d", text: "Solo importa en vías rurales" },
      ],
      correct: "b",
    },
    {
      id: "m4q1_20",
      text: "El tratamiento del manual para motociclistas se enmarca en la protección de usuarios vulnerables.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
  ],
};

const M4_Q2 = {
  title: "Quiz — ANEXO TÉCNICO: GUÍA DE PROTECCIÓN AL MOTOCICLISTA",
  questions: [
    {
      id: "m4q2_01",
      text: "¿Cuál es el propósito general de la Guía de Protección al Motociclista?",
      options: [
        { id: "a", text: "Enseñar mecánica avanzada de competición" },
        { id: "b", text: "Acercar a los actores viales a la realidad del usuario de moto y ofrecer medidas preventivas y recomendaciones para la vía" },
        { id: "c", text: "Reemplazar el manual del conductor" },
        { id: "d", text: "Crear una licencia nueva para motociclistas" },
      ],
      correct: "b",
    },
    {
      id: "m4q2_02",
      text: "La guía parte de la idea de corresponsabilidad de todos los actores viales para proteger la vida de quienes usan motocicleta.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q2_03",
      text: "Según la guía, en 2024 los usuarios de motocicleta registraron:",
      options: [
        { id: "a", text: "La menor participación entre víctimas viales" },
        { id: "b", text: "La mayor participación entre víctimas a causa de la siniestralidad vial" },
        { id: "c", text: "Participación exclusiva en vías rurales" },
        { id: "d", text: "Solo lesionados, no fallecidos" },
      ],
      correct: "b",
    },
    {
      id: "m4q2_04",
      text: "La guía señala que, durante 2024, los usuarios de motocicleta representaron aproximadamente:",
      options: [
        { id: "a", text: "22 % del total de víctimas" },
        { id: "b", text: "62 % del total de víctimas" },
        { id: "c", text: "10 % del total de víctimas" },
        { id: "d", text: "80 % del total de víctimas" },
      ],
      correct: "b",
    },
    {
      id: "m4q2_05",
      text: "La guía reconoce que la situación de siniestralidad afecta de manera desproporcionada a actores viales y sociales más vulnerables.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q2_06",
      text: "¿Qué idea desarrolla la guía sobre el perfil social de buena parte de la población motociclista?",
      options: [
        { id: "a", text: "Que corresponde exclusivamente a altos ingresos" },
        { id: "b", text: "Que una proporción importante pertenece a sectores sociales y económicos vulnerables" },
        { id: "c", text: "Que solo usa la moto con fines recreativos" },
        { id: "d", text: "Que no depende de la moto para movilizarse" },
      ],
      correct: "b",
    },
    {
      id: "m4q2_07",
      text: "¿Cuál de estos bloques temáticos sí aparece en la guía?",
      options: [
        { id: "a", text: "Generalidades, factores de riesgo asociados al comportamiento, recomendaciones y decálogo de autocuidado" },
        { id: "b", text: "Náutica, aviación y transporte férreo" },
        { id: "c", text: "Diseño de motores eléctricos" },
        { id: "d", text: "Señalización marítima" },
      ],
      correct: "a",
    },
    {
      id: "m4q2_08",
      text: "La guía incluye factores de riesgo asociados al comportamiento del motociclista.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q2_09",
      text: "¿Cuál opción refleja mejor el enfoque preventivo de la guía?",
      options: [
        { id: "a", text: "Conducir confiando solo en la experiencia" },
        { id: "b", text: "Adoptar prácticas de autocuidado y prevención para reducir el impacto de las lesiones" },
        { id: "c", text: "Priorizar la rapidez sobre la seguridad" },
        { id: "d", text: "Usar la moto sin importar el entorno vial" },
      ],
      correct: "b",
    },
    {
      id: "m4q2_10",
      text: "¿Qué sentido tiene el decálogo de autocuidado para motociclistas?",
      options: [
        { id: "a", text: "Aumentar la velocidad promedio de viaje" },
        { id: "b", text: "Proponer hábitos concretos de protección y comportamiento seguro" },
        { id: "c", text: "Reemplazar la revisión mecánica" },
        { id: "d", text: "Eliminar la necesidad de EPP" },
      ],
      correct: "b",
    },
    {
      id: "m4q2_11",
      text: "La guía entiende la protección del motociclista no solo como asunto individual, sino también como compromiso compartido en la vía.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q2_12",
      text: "¿Cuál afirmación es más coherente con la guía?",
      options: [
        { id: "a", text: "La seguridad depende solo del casco" },
        { id: "b", text: "La seguridad del motociclista exige comportamientos preventivos y armonía con otros actores viales" },
        { id: "c", text: "La moto siempre tiene prioridad" },
        { id: "d", text: "El acompañante no influye en la seguridad" },
      ],
      correct: "b",
    },
    {
      id: "m4q2_13",
      text: "¿Qué relación establece la guía entre siniestros y protección?",
      options: [
        { id: "a", text: "Que el siniestro es inevitable y no se puede reducir su impacto" },
        { id: "b", text: "Que la apropiación de medidas preventivas ayuda a evitar o reducir el impacto de las lesiones" },
        { id: "c", text: "Que la protección solo depende de la autoridad" },
        { id: "d", text: "Que la guía solo sirve para conductores novatos" },
      ],
      correct: "b",
    },
    {
      id: "m4q2_14",
      text: "La guía invita a divulgar y poner en práctica sus recomendaciones en la vida diaria.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q2_15",
      text: "¿Cuál grupo de actores aparece dentro de las recomendaciones de la guía?",
      options: [
        { id: "a", text: "Vehículos de carga y gran dimensión, automóviles livianos, usuarios de motocicleta, ciclistas y peatones" },
        { id: "b", text: "Solo motociclistas" },
        { id: "c", text: "Solo peatones" },
        { id: "d", text: "Solo autoridades de tránsito" },
      ],
      correct: "a",
    },
    {
      id: "m4q2_16",
      text: "¿Qué se desprende del enfoque de recomendaciones hacia distintos actores viales?",
      options: [
        { id: "a", text: "Que la seguridad del motociclista depende únicamente del motociclista" },
        { id: "b", text: "Que la protección al motociclista también exige cambios de comportamiento en otros usuarios de la vía" },
        { id: "c", text: "Que las motos deben circular aisladas" },
        { id: "d", text: "Que los peatones no intervienen en la seguridad vial" },
      ],
      correct: "b",
    },
    {
      id: "m4q2_17",
      text: "La guía presenta a la motocicleta como un medio de movilidad con fuerte presencia en la vida cotidiana de muchas personas.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q2_18",
      text: "¿Cuál idea resume mejor la guía?",
      options: [
        { id: "a", text: "Manejar moto es solo una habilidad técnica" },
        { id: "b", text: "Proteger al motociclista exige prevención, autocuidado y corresponsabilidad vial" },
        { id: "c", text: "El riesgo desaparece con experiencia" },
        { id: "d", text: "La seguridad es un asunto exclusivamente policial" },
      ],
      correct: "b",
    },
    {
      id: "m4q2_19",
      text: "¿Qué opción contradice más el sentido de la guía?",
      options: [
        { id: "a", text: "Reducir riesgos desde el comportamiento" },
        { id: "b", text: "Adoptar prácticas preventivas" },
        { id: "c", text: "Considerar al motociclista como usuario vulnerable" },
        { id: "d", text: "Conducir minimizando la importancia del entorno y de los demás actores" },
      ],
      correct: "d",
    },
    {
      id: "m4q2_20",
      text: "La guía está orientada a salvar vidas y reducir lesiones, no solo a transmitir información.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
  ],
};

const M4_Q3 = {
  title: "Quiz — ANEXO TÉCNICO: MEDIDAS DE ALISTAMIENTO / EPP",
  questions: [
    {
      id: "m4q3_01",
      text: "¿Cuál de los siguientes documentos hace parte de la documentación según la normativa vigente para circular?",
      options: [
        { id: "a", text: "Tarjeta de propiedad de bicicleta" },
        { id: "b", text: "Documento de identidad" },
        { id: "c", text: "Carné estudiantil" },
        { id: "d", text: "Recibo de compra del casco" },
      ],
      correct: "b",
    },
    {
      id: "m4q3_02",
      text: "La licencia de conducción es un documento público personal que autoriza para conducir vehículos y tiene validez en todo el territorio nacional.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q3_03",
      text: "¿Qué documento identifica un vehículo automotor, acredita su propiedad, identifica a su propietario y autoriza su circulación?",
      options: [
        { id: "a", text: "Cédula de ciudadanía" },
        { id: "b", text: "Licencia de tránsito" },
        { id: "c", text: "SOAT" },
        { id: "d", text: "Revisión tecnomecánica" },
      ],
      correct: "b",
    },
    {
      id: "m4q3_04",
      text: "¿Qué documento obligatorio ampara al vehículo con un seguro vigente para transitar?",
      options: [
        { id: "a", text: "Licencia de tránsito" },
        { id: "b", text: "Documento de identidad" },
        { id: "c", text: "SOAT" },
        { id: "d", text: "RUNT impreso" },
      ],
      correct: "c",
    },
    {
      id: "m4q3_05",
      text: "La Ley 2251 permite que el requisito de portar documentos se entienda cumplido si estos pueden validarse en línea ante la autoridad.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q3_06",
      text: "¿Cuál es la multa indicada por no presentar o tener vencida la licencia de conducción?",
      options: [
        { id: "a", text: "30 SMLDV" },
        { id: "b", text: "15 SMLDV" },
        { id: "c", text: "8 SMLDV" },
        { id: "d", text: "2 SMLDV" },
      ],
      correct: "c",
    },
    {
      id: "m4q3_07",
      text: "¿Cuál es la multa indicada por no presentar o tener vencido el SOAT?",
      options: [
        { id: "a", text: "8 SMLDV" },
        { id: "b", text: "30 SMLDV" },
        { id: "c", text: "15 SMLDV" },
        { id: "d", text: "5 SMLDV" },
      ],
      correct: "b",
    },
    {
      id: "m4q3_08",
      text: "La multa indicada por no presentar o tener vencida la revisión tecnomecánica es de 15 SMLDV.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q3_09",
      text: "¿Cuál herramienta es especialmente útil porque muchos componentes de la moto usan tornillería Allen?",
      options: [
        { id: "a", text: "Martillo" },
        { id: "b", text: "Llave Allen o Bristol" },
        { id: "c", text: "Sierra manual" },
        { id: "d", text: "Cinta aislante" },
      ],
      correct: "b",
    },
    {
      id: "m4q3_10",
      text: "¿Qué combinación de destornilladores recomienda el material como básica en el kit?",
      options: [
        { id: "a", text: "Uno plano de 5 mm y uno de cruz o estrella número 2" },
        { id: "b", text: "Dos de pala ancha" },
        { id: "c", text: "Uno industrial y uno eléctrico" },
        { id: "d", text: "Ninguno, no son necesarios" },
      ],
      correct: "a",
    },
    {
      id: "m4q3_11",
      text: "La llave inglesa se destaca por su versatilidad al poder aplicarse sobre distintas medidas de tuerca.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q3_12",
      text: "¿Para qué sirve la llave de bujías dentro del kit básico?",
      options: [
        { id: "a", text: "Para medir la presión de las llantas" },
        { id: "b", text: "Para hacer cambios rápidos de bujía ante fallas específicas" },
        { id: "c", text: "Para ajustar espejos únicamente" },
        { id: "d", text: "Para revisar el SOAT" },
      ],
      correct: "b",
    },
    {
      id: "m4q3_13",
      text: "¿Qué elemento del kit ayuda a reparar temporalmente una llanta sellomatic pinchada?",
      options: [
        { id: "a", text: "Cargador de batería" },
        { id: "b", text: "Espray antipinchazos" },
        { id: "c", text: "Linterna LED" },
        { id: "d", text: "Limpiador de cadena" },
      ],
      correct: "b",
    },
    {
      id: "m4q3_14",
      text: "Si la moto es de transmisión por cadena, llevar un candado o eslabón de cadena puede ayudar a solucionar una contingencia para llegar a un taller.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q3_15",
      text: "¿Qué recomendación general da el material sobre el kit de herramientas?",
      options: [
        { id: "a", text: "Llevarlo solo en viajes largos" },
        { id: "b", text: "Dejarlo en casa si la moto es nueva" },
        { id: "c", text: "Llevarlo siempre a mano como equipo de viaje" },
        { id: "d", text: "Usarlo solo cuando lo exija la autoridad" },
      ],
      correct: "c",
    },
    {
      id: "m4q3_16",
      text: "¿Qué relación plantea el material entre mantenimiento preventivo y uso del kit?",
      options: [
        { id: "a", text: "El mantenimiento preventivo aumenta la necesidad del kit" },
        { id: "b", text: "El mantenimiento preventivo reduce la posibilidad de fallas, aunque sigue siendo recomendable llevar el kit" },
        { id: "c", text: "Son asuntos independientes" },
        { id: "d", text: "El kit reemplaza el mantenimiento" },
      ],
      correct: "b",
    },
    {
      id: "m4q3_17",
      text: "La Organización Panamericana de la Salud citada en el material señala que el uso del casco disminuye el riesgo y la gravedad de los traumatismos, y reduce la probabilidad de muerte.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q3_18",
      text: "¿Cuál de estas prácticas es coherente con el cuidado del casco?",
      options: [
        { id: "a", text: "Ponerlo siempre en el piso" },
        { id: "b", text: "Mantener limpio y desinfectado su interior y exterior" },
        { id: "c", text: "Golpearlo para revisar resistencia" },
        { id: "d", text: "Guardarlo húmedo" },
      ],
      correct: "b",
    },
    {
      id: "m4q3_19",
      text: "¿Qué criterio clave debe verificarse al elegir o revisar el casco?",
      options: [
        { id: "a", text: "Que combine con el color de la moto" },
        { id: "b", text: "Que cumpla con estándares de calidad" },
        { id: "c", text: "Que tenga más peso" },
        { id: "d", text: "Que sea usado" },
      ],
      correct: "b",
    },
    {
      id: "m4q3_20",
      text: "El material vincula el alistamiento documental, el kit básico y el uso adecuado del casco con viajes más seguros y confiables.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
  ],
};

const M4_Q4 = {
  title: "Quiz — ANEXO TÉCNICO: PROTOCOLO DE PRÁCTICAS SEGURAS PARA TRABAJADORES QUE USAN LA MOTOCICLETA COMO HERRAMIENTA DE TRABAJO",
  questions: [
    {
      id: "m4q4_01",
      text: "¿A quién está dirigido principalmente este protocolo?",
      options: [
        { id: "a", text: "Solo a ciclistas recreativos" },
        { id: "b", text: "A trabajadores que usan la motocicleta como herramienta de trabajo" },
        { id: "c", text: "Solo a peatones" },
        { id: "d", text: "Únicamente a conductores de transporte pesado" },
      ],
      correct: "b",
    },
    {
      id: "m4q4_02",
      text: "El protocolo busca proporcionar herramientas de fácil aplicación a empresas, entidades y trabajadores independientes para reducir accidentes laborales que involucran motocicletas.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q4_03",
      text: "Según el protocolo, ¿qué factores convergen en la siniestralidad de motociclistas?",
      options: [
        { id: "a", text: "Solo la infraestructura" },
        { id: "b", text: "Vehículo, infraestructura, velocidades inadecuadas y comportamiento" },
        { id: "c", text: "Solo el clima" },
        { id: "d", text: "Solo la experiencia del conductor" },
      ],
      correct: "b",
    },
    {
      id: "m4q4_04",
      text: "En la investigación citada por el protocolo, aproximadamente ¿qué porcentaje de motociclistas reportó utilizar su vehículo como herramienta de trabajo?",
      options: [
        { id: "a", text: "10,6 %" },
        { id: "b", text: "27,6 %" },
        { id: "c", text: "50,0 %" },
        { id: "d", text: "72,0 %" },
      ],
      correct: "b",
    },
    {
      id: "m4q4_05",
      text: "El protocolo incluye la interacción del SG-SST (Sistema de Gestión de Seguridad y Salud en el Trabajo, en español Sistema de Gestión de Seguridad y Salud en el Trabajo) con la conducción de motocicletas.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q4_06",
      text: "¿Cuál de estos contenidos sí hace parte del protocolo?",
      options: [
        { id: "a", text: "Estándares de seguridad activa de las motocicletas" },
        { id: "b", text: "Navegación aérea" },
        { id: "c", text: "Señalización ferroviaria" },
        { id: "d", text: "Normas de transporte marítimo" },
      ],
      correct: "a",
    },
    {
      id: "m4q4_07",
      text: "¿Qué aspecto destaca el protocolo como fundamental en la selección de conductores de motocicleta en el ámbito laboral?",
      options: [
        { id: "a", text: "El color del vehículo" },
        { id: "b", text: "La evaluación de actitud y aptitud del conductor" },
        { id: "c", text: "La cantidad de viajes realizados" },
        { id: "d", text: "La antigüedad de la moto" },
      ],
      correct: "b",
    },
    {
      id: "m4q4_08",
      text: "El protocolo reconoce la licencia de conducción como un documento que garantiza idoneidad, preparación y capacidad física del conductor.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q4_09",
      text: "¿Qué debe medir una prueba teórica dentro del proceso de selección?",
      options: [
        { id: "a", text: "Solo la fuerza física" },
        { id: "b", text: "El conocimiento sobre factores de conducción, normatividad, estándares en la vía y vehículo" },
        { id: "c", text: "Solo la velocidad de reacción" },
        { id: "d", text: "Exclusivamente maniobras en lluvia" },
      ],
      correct: "b",
    },
    {
      id: "m4q4_10",
      text: "¿Cuál de estos temas mínimos aparece para evaluación teórica?",
      options: [
        { id: "a", text: "Conocimiento básico del Código Nacional de Tránsito referente a motociclistas" },
        { id: "b", text: "Mecánica de aviación" },
        { id: "c", text: "Navegación satelital marítima" },
        { id: "d", text: "Decoración del vehículo" },
      ],
      correct: "a",
    },
    {
      id: "m4q4_11",
      text: "La evaluación teórica debe incluir conocimientos sobre señalización vial, infraestructura, mantenimiento básico, EPP y primeros auxilios.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q4_12",
      text: "¿Cuál de estas actividades corresponde a la fase práctica sugerida por el protocolo?",
      options: [
        { id: "a", text: "Inspección previa de la motocicleta y los EPP" },
        { id: "b", text: "Diseño de mapas urbanos" },
        { id: "c", text: "Cálculo de impuestos vehiculares" },
        { id: "d", text: "Publicidad del servicio de mensajería" },
      ],
      correct: "a",
    },
    {
      id: "m4q4_13",
      text: "¿Qué habilidad práctica menciona el protocolo como importante de evaluar?",
      options: [
        { id: "a", text: "Pintura personalizada del casco" },
        { id: "b", text: "Maniobrabilidad, frenado, proyección de la mirada y evasión de obstáculos" },
        { id: "c", text: "Capacidad de venta del trabajador" },
        { id: "d", text: "Uso de redes sociales durante la jornada" },
      ],
      correct: "b",
    },
    {
      id: "m4q4_14",
      text: "El protocolo incluye la distancia de seguimiento adecuada como criterio de evaluación práctica.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q4_15",
      text: "¿Qué recomendación da el protocolo sobre pausas activas?",
      options: [
        { id: "a", text: "Hacerlas cada 12 horas" },
        { id: "b", text: "Realizarlas cada 4 horas en la jornada laboral" },
        { id: "c", text: "Evitarlas para no perder tiempo" },
        { id: "d", text: "Hacerlas solo en vacaciones" },
      ],
      correct: "b",
    },
    {
      id: "m4q4_16",
      text: "¿Qué duración sugiere el protocolo para las pausas activas?",
      options: [
        { id: "a", text: "1 a 2 minutos" },
        { id: "b", text: "3 a 4 minutos" },
        { id: "c", text: "7 a 10 minutos" },
        { id: "d", text: "25 a 30 minutos" },
      ],
      correct: "c",
    },
    {
      id: "m4q4_17",
      text: "El protocolo recomienda ejercicios de estiramiento antes de iniciar la conducción.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m4q4_18",
      text: "¿Qué orientación da el protocolo sobre el uso del casco y otros EPP?",
      options: [
        { id: "a", text: "Usarlos solo en trayectos largos" },
        { id: "b", text: "Utilizarlos correctamente en todo tipo de trayecto, para conductor y acompañante" },
        { id: "c", text: "Dejarlos a criterio del acompañante" },
        { id: "d", text: "Reemplazarlos por experiencia de conducción" },
      ],
      correct: "b",
    },
    {
      id: "m4q4_19",
      text: "¿Qué criterio es más coherente con el protocolo respecto a la velocidad?",
      options: [
        { id: "a", text: "Circular siempre al límite permitido sin atender el entorno" },
        { id: "b", text: "Conducir a velocidades adecuadas según infraestructura, ambiente, tipo de vía y comportamiento de otros actores" },
        { id: "c", text: "Acelerar para reducir el tiempo de exposición" },
        { id: "d", text: "Mantener la misma velocidad en cualquier condición" },
      ],
      correct: "b",
    },
    {
      id: "m4q4_20",
      text: "El protocolo asocia la seguridad del motociclista trabajador con selección adecuada, formación, revisión preoperacional, EPP, mantenimiento y control institucional.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
  ],
};


// ======================================================================
// Module 5
// ======================================================================

const M5_Q1 = {
  title: "Quiz — ANEXO TÉCNICO: MANUAL DE SEÑALIZACIÓN VIAL DE COLOMBIA 2024",
  questions: [
    {
      id: "m5q1_01",
      text: "¿Cuál es el objetivo general del Manual de Señalización Vial de Colombia?",
      options: [
        { id: "a", text: "Regular únicamente la conducción de motocicletas" },
        { id: "b", text: "Servir como documento técnico integral para diseño, instalación, uso, mantenimiento y control de la señalización vial en el territorio nacional" },
        { id: "c", text: "Sustituir el Código Nacional de Tránsito" },
        { id: "d", text: "Definir únicamente colores para señales turísticas" },
      ],
      correct: "b",
    },
    {
      id: "m5q1_02",
      text: "El manual es obligatorio para autoridades de tránsito y entidades responsables de la infraestructura vial, tanto en vías públicas como en vías privadas abiertas al público.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q1_03",
      text: "¿Cuál de estos capítulos del manual resulta más directamente útil para un conductor de automóvil que debe interpretar el entorno?",
      options: [
        { id: "a", text: "Señales verticales, demarcaciones y semaforización" },
        { id: "b", text: "Solo bibliografía" },
        { id: "c", text: "Solo glosario" },
        { id: "d", text: "Exclusivamente señalización turística" },
      ],
      correct: "a",
    },
    {
      id: "m5q1_04",
      text: "¿Qué busca la señalización vial frente a la conducción segura?",
      options: [
        { id: "a", text: "Decorar la infraestructura" },
        { id: "b", text: "Comunicar al actor vial la forma correcta y segura de circular" },
        { id: "c", text: "Incrementar la velocidad de circulación" },
        { id: "d", text: "Reemplazar la experiencia del conductor" },
      ],
      correct: "b",
    },
    {
      id: "m5q1_05",
      text: "El manual plantea que la señalización contribuye a reducir riesgos, mejorar la fluidez del tránsito y garantizar seguridad y comodidad.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q1_06",
      text: "¿Qué significa que una expresión del manual sea de “exigencia”?",
      options: [
        { id: "a", text: "Que es una recomendación opcional" },
        { id: "b", text: "Que expresa una obligación, prohibición o condición que debe cumplirse" },
        { id: "c", text: "Que depende exclusivamente del criterio del conductor" },
        { id: "d", text: "Que solo aplica de noche" },
      ],
      correct: "b",
    },
    {
      id: "m5q1_07",
      text: "¿Qué significan las expresiones de “recomendación” dentro del manual?",
      options: [
        { id: "a", text: "Son órdenes obligatorias" },
        { id: "b", text: "Son orientaciones técnicas sugeridas, pero no obligatorias" },
        { id: "c", text: "Son sanciones administrativas" },
        { id: "d", text: "Son equivalentes a una infracción" },
      ],
      correct: "b",
    },
    {
      id: "m5q1_08",
      text: "El manual recomienda consultar el glosario para evitar interpretaciones erróneas de los conceptos técnicos.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q1_09",
      text: "Para un conductor de automóvil, ¿qué interpretación es más correcta sobre las demarcaciones horizontales?",
      options: [
        { id: "a", text: "Son decorativas y pueden ignorarse" },
        { id: "b", text: "Hacen parte del lenguaje vial y orientan maniobras, separación de carriles, cruces y restricciones" },
        { id: "c", text: "Solo sirven para ciclistas" },
        { id: "d", text: "Solo son válidas cuando hay policía presente" },
      ],
      correct: "b",
    },
    {
      id: "m5q1_10",
      text: "¿Qué función cumplen las líneas transversales y símbolos en la vía?",
      options: [
        { id: "a", text: "Solo embellecer intersecciones" },
        { id: "b", text: "Complementar la información vial para detenerse, ceder, cruzar o anticipar maniobras" },
        { id: "c", text: "Eliminar la necesidad de señales verticales" },
        { id: "d", text: "Reemplazar los semáforos" },
      ],
      correct: "b",
    },
    {
      id: "m5q1_11",
      text: "El manual reconoce la semaforización como parte de los elementos físicos de control del tránsito.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q1_12",
      text: "¿Cuál es una lectura correcta del enfoque del manual sobre señalización?",
      options: [
        { id: "a", text: "La señalización solo importa en carretera" },
        { id: "b", text: "La señalización debe ser uniforme, justificada, mantenida y comprensible" },
        { id: "c", text: "La señalización puede improvisarse según el municipio" },
        { id: "d", text: "Cada conductor interpreta libremente su significado" },
      ],
      correct: "b",
    },
    {
      id: "m5q1_13",
      text: "¿Qué aspecto debe tener presente un conductor frente a la señalización vertical?",
      options: [
        { id: "a", text: "Que siempre prevalece su intuición" },
        { id: "b", text: "Que las señales reglamentarias, preventivas e informativas transmiten obligaciones, advertencias y orientación" },
        { id: "c", text: "Que solo las preventivas obligan" },
        { id: "d", text: "Que las informativas son irrelevantes para la seguridad" },
      ],
      correct: "b",
    },
    {
      id: "m5q1_14",
      text: "El manual se alinea con el enfoque de Sistema Seguro y fortalece la protección de usuarios vulnerables.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q1_15",
      text: "¿Qué relación establece el manual entre señalización y velocidad?",
      options: [
        { id: "a", text: "Ninguna" },
        { id: "b", text: "La señalización ayuda a orientar el uso adecuado de la infraestructura en términos de conexiones, velocidad y atención a situaciones especiales" },
        { id: "c", text: "La velocidad depende solo del vehículo" },
        { id: "d", text: "Solo aplica a transporte público" },
      ],
      correct: "b",
    },
    {
      id: "m5q1_16",
      text: "¿Cuál conducta sería más coherente con la lectura del entorno que propone el manual?",
      options: [
        { id: "a", text: "Confiar solo en la memoria de la ruta" },
        { id: "b", text: "Integrar señales verticales, demarcación, semáforos y condiciones de la vía para anticipar riesgos" },
        { id: "c", text: "Mirar únicamente el vehículo de adelante" },
        { id: "d", text: "Ignorar cambios en el entorno si se conoce la zona" },
      ],
      correct: "b",
    },
    {
      id: "m5q1_17",
      text: "La justificación técnica es uno de los aspectos clave de la señalización vial señalados por el manual.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q1_18",
      text: "¿Qué contradice más el sentido del manual?",
      options: [
        { id: "a", text: "Mantener señales consistentes y visibles" },
        { id: "b", text: "Instalar señalización uniforme" },
        { id: "c", text: "Usar señalización comercial o publicitaria como si fuera regulatoria" },
        { id: "d", text: "Dar información clara al usuario vial" },
      ],
      correct: "c",
    },
    {
      id: "m5q1_19",
      text: "¿Qué debería hacer un conductor seguro frente a un entorno con señales, demarcaciones y semáforos?",
      options: [
        { id: "a", text: "Interpretarlos como un sistema integrado de información para decidir con anticipación" },
        { id: "b", text: "Atender solo al semáforo" },
        { id: "c", text: "Atender solo a la demarcación" },
        { id: "d", text: "Priorizar su experiencia sobre la norma" },
      ],
      correct: "a",
    },
    {
      id: "m5q1_20",
      text: "Para el M5, del Manual de Señalización Vial interesan especialmente los contenidos que ayudan a leer infraestructura, demarcación, semaforización y control de la velocidad.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
  ],
};

const M5_Q2 = {
  title: "Quiz — ANEXO TÉCNICO: GUÍA DE CONTROL EN VELOCIDAD",
  questions: [
    {
      id: "m5q2_01",
      text: "¿Qué define la ANSV como gestión de la velocidad?",
      options: [
        { id: "a", text: "El aumento continuo de la velocidad promedio" },
        { id: "b", text: "El conjunto de estrategias y medidas para promover conducción a velocidades adecuadas según contexto, entorno, uso y tipo de vía" },
        { id: "c", text: "El control exclusivo con radares" },
        { id: "d", text: "La sanción automática a todos los conductores" },
      ],
      correct: "b",
    },
    {
      id: "m5q2_02",
      text: "La guía señala que el control hace parte de las estrategias de gestión de la velocidad.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q2_03",
      text: "Según la guía, aproximadamente ¿qué porcentaje de las fatalidades con información de causa probable entre 2018 y 2022 estuvo asociado al exceso de velocidad?",
      options: [
        { id: "a", text: "18 %" },
        { id: "b", text: "28 %" },
        { id: "c", text: "38 %" },
        { id: "d", text: "58 %" },
      ],
      correct: "c",
    },
    {
      id: "m5q2_04",
      text: "¿Cómo presenta la guía el exceso de velocidad en Colombia?",
      options: [
        { id: "a", text: "Como una conducta poco frecuente" },
        { id: "b", text: "Como la causa que más infracciones representa para el sistema contravencional" },
        { id: "c", text: "Como una conducta exclusiva de zonas rurales" },
        { id: "d", text: "Como una conducta sin impacto en la gravedad de los siniestros" },
      ],
      correct: "b",
    },
    {
      id: "m5q2_05",
      text: "La OPS reconoce el control como una de las maneras más efectivas para alentar el respeto por los límites de velocidad.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q2_06",
      text: "¿Cuál es el objetivo principal de la guía?",
      options: [
        { id: "a", text: "Enseñar técnicas de competencia automovilística" },
        { id: "b", text: "Fortalecer las actividades de control de velocidad enfocadas en reducir la siniestralidad vial" },
        { id: "c", text: "Sustituir la señalización vial" },
        { id: "d", text: "Eliminar comparendos" },
      ],
      correct: "b",
    },
    {
      id: "m5q2_07",
      text: "¿Qué busca generar un control efectivo en la ciudadanía, según la guía?",
      options: [
        { id: "a", text: "Temor permanente a la autoridad" },
        { id: "b", text: "Percepción de vigilancia constante y comprensión de que exceder la velocidad es ilegal e inaceptable" },
        { id: "c", text: "Rechazo a toda norma de tránsito" },
        { id: "d", text: "Confusión sobre los límites" },
      ],
      correct: "b",
    },
    {
      id: "m5q2_08",
      text: "La guía señala que respetar los límites de velocidad debe reforzarse con procesos de control eficaces.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q2_09",
      text: "¿Cuál de estas fases hace parte del desarrollo de un control manual efectivo?",
      options: [
        { id: "a", text: "Decoración del puesto de control" },
        { id: "b", text: "Recopilación y análisis de información" },
        { id: "c", text: "Publicidad comercial en vía" },
        { id: "d", text: "Modificación libre del límite de velocidad" },
      ],
      correct: "b",
    },
    {
      id: "m5q2_10",
      text: "¿Cuál secuencia refleja mejor el proceso general de control manual planteado por la guía?",
      options: [
        { id: "a", text: "Ejecución, sanción, improvisación" },
        { id: "b", text: "Recopilación, planeación, ejecución, actuaciones posteriores y cobro coactivo" },
        { id: "c", text: "Captura, destrucción de evidencia y cierre" },
        { id: "d", text: "Señalización, recaudo y archivo" },
      ],
      correct: "b",
    },
    {
      id: "m5q2_11",
      text: "La guía incluye una aproximación al control automatizado, además del control manual.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q2_12",
      text: "¿Qué mensaje central transmite la guía sobre la velocidad?",
      options: [
        { id: "a", text: "Llegar rápido es prioridad" },
        { id: "b", text: "La velocidad debe gestionarse para proteger la vida y permitir movilidad eficiente y segura" },
        { id: "c", text: "Los límites son orientativos" },
        { id: "d", text: "La velocidad solo importa en autopistas" },
      ],
      correct: "b",
    },
    {
      id: "m5q2_13",
      text: "¿Qué tipo de conducción promueve la guía?",
      options: [
        { id: "a", text: "Conducción uniforme sin importar el contexto" },
        { id: "b", text: "Conducción a velocidades adecuadas según condiciones del entorno" },
        { id: "c", text: "Conducción centrada solo en la capacidad del vehículo" },
        { id: "d", text: "Conducción al máximo permitido en cualquier caso" },
      ],
      correct: "b",
    },
    {
      id: "m5q2_14",
      text: "La guía entiende el exceso de velocidad como un comportamiento opuesto a los intereses de la comunidad.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q2_15",
      text: "¿Qué relación establece la guía entre control y seguridad vial?",
      options: [
        { id: "a", text: "Son asuntos independientes" },
        { id: "b", text: "El control es una medida óptima para disminuir índices de siniestralidad vial" },
        { id: "c", text: "El control solo sirve para recaudar" },
        { id: "d", text: "El control solo aplica a motociclistas" },
      ],
      correct: "b",
    },
    {
      id: "m5q2_16",
      text: "Un conductor del M5 que aplica esta guía debería:",
      options: [
        { id: "a", text: "Mantener la misma velocidad en cualquier vía" },
        { id: "b", text: "Ajustar la velocidad al entorno, señalización y presencia de otros actores viales" },
        { id: "c", text: "Frenar solo cuando vea autoridad" },
        { id: "d", text: "Guiarse únicamente por el flujo vehicular" },
      ],
      correct: "b",
    },
    {
      id: "m5q2_17",
      text: "La guía reconoce que, pese a la alta cantidad de comparendos por velocidad, el comportamiento ciudadano no mejora automáticamente.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q2_18",
      text: "¿Cuál opción contradice más el enfoque de la guía?",
      options: [
        { id: "a", text: "Planeación del control" },
        { id: "b", text: "Gestión integral de la velocidad" },
        { id: "c", text: "Entender el control como herramienta de protección de la vida" },
        { id: "d", text: "Reducir la discusión de velocidad a simple castigo sin enfoque preventivo" },
      ],
      correct: "d",
    },
    {
      id: "m5q2_19",
      text: "¿Qué debería interpretar un conductor particular frente al control de velocidad?",
      options: [
        { id: "a", text: "Que es una medida ajena a la seguridad" },
        { id: "b", text: "Que es parte del sistema de prevención y cumplimiento normativo" },
        { id: "c", text: "Que solo aplica cuando hay cámaras" },
        { id: "d", text: "Que depende del tipo de marca del vehículo" },
      ],
      correct: "b",
    },
    {
      id: "m5q2_20",
      text: "La guía fortalece el M5 porque relaciona velocidad, control, cumplimiento normativo y reducción del riesgo vial.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
  ],
};

const M5_Q3 = {
  title: "Quiz — ANEXO TÉCNICO: GUÍA PRÁCTICA DE SENSIBILIZACIÓN EN VELOCIDAD",
  questions: [
    {
      id: "m5q3_01",
      text: "¿Cuál es el propósito central de esta guía?",
      options: [
        { id: "a", text: "Definir sanciones por embriaguez" },
        { id: "b", text: "Orientar procesos pedagógicos y de sensibilización sobre velocidad segura" },
        { id: "c", text: "Reemplazar la labor de control operativo" },
        { id: "d", text: "Diseñar carreteras intermunicipales" },
      ],
      correct: "b",
    },
    {
      id: "m5q3_02",
      text: "La guía resalta la importancia de conocer el principal factor de riesgo en las vías: la velocidad.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q3_03",
      text: "Según la guía, en el periodo 2019-2023, ¿cuáles fueron las tres principales hipótesis de causa de fallecidos por siniestros viales en el país?",
      options: [
        { id: "a", text: "Fatiga, clima y huecos" },
        { id: "b", text: "Desobedecer señales, exceso de velocidad y embriaguez" },
        { id: "c", text: "Fallas mecánicas, lluvia y peatones" },
        { id: "d", text: "Distracción, ruido y congestión" },
      ],
      correct: "b",
    },
    {
      id: "m5q3_04",
      text: "¿Qué porcentaje aproximado aparece asociado al exceso de velocidad como hipótesis de causa de fallecidos?",
      options: [
        { id: "a", text: "20 %" },
        { id: "b", text: "30 %" },
        { id: "c", text: "40 %" },
        { id: "d", text: "60 %" },
      ],
      correct: "c",
    },
    {
      id: "m5q3_05",
      text: "La guía ubica la gestión de la velocidad dentro del Enfoque de Sistema Seguro.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q3_06",
      text: "¿Cuál de estos principios sí aparece en la guía al explicar el Sistema Seguro?",
      options: [
        { id: "a", text: "Velocidad sin restricciones" },
        { id: "b", text: "Error humano" },
        { id: "c", text: "Superioridad del conductor experto" },
        { id: "d", text: "Prioridad del flujo sobre la vida" },
      ],
      correct: "b",
    },
    {
      id: "m5q3_07",
      text: "¿Qué significa el principio de vulnerabilidad física del cuerpo humano?",
      options: [
        { id: "a", text: "Que el cuerpo puede resistir cualquier impacto" },
        { id: "b", text: "Que existe una capacidad limitada para tolerar fuerzas de impacto antes de sufrir lesión" },
        { id: "c", text: "Que la seguridad depende solo del casco" },
        { id: "d", text: "Que la vía elimina toda lesión" },
      ],
      correct: "b",
    },
    {
      id: "m5q3_08",
      text: "La guía afirma que la falta de seguridad vial no debe aceptarse como compensación por una movilidad más rápida.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q3_09",
      text: "¿Qué papel cumplen la pedagogía y la comunicación en la gestión de la velocidad?",
      options: [
        { id: "a", text: "Ninguno" },
        { id: "b", text: "Apoyan y complementan las medidas adoptadas sobre velocidad" },
        { id: "c", text: "Reemplazan el control" },
        { id: "d", text: "Eliminan la necesidad de señalización" },
      ],
      correct: "b",
    },
    {
      id: "m5q3_10",
      text: "¿A quién está dirigida principalmente la guía?",
      options: [
        { id: "a", text: "Solo a conductores particulares" },
        { id: "b", text: "A equipos de educación vial, tomadores de decisión y entidades públicas y privadas" },
        { id: "c", text: "Solo a policía de tránsito" },
        { id: "d", text: "Solo a colegios rurales" },
      ],
      correct: "b",
    },
    {
      id: "m5q3_11",
      text: "La guía busca orientar la planeación y desarrollo de sensibilizaciones a actores viales en torno a la conducción a velocidades seguras y adecuadas.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q3_12",
      text: "¿Cuál afirmación resume mejor el enfoque de la guía?",
      options: [
        { id: "a", text: "Sensibilizar es secundario frente a sancionar" },
        { id: "b", text: "Comprender los efectos de la velocidad es un primer paso para gestionarla adecuadamente" },
        { id: "c", text: "La velocidad solo importa para buses" },
        { id: "d", text: "La educación vial no modifica conductas" },
      ],
      correct: "b",
    },
    {
      id: "m5q3_13",
      text: "¿Qué principio del Sistema Seguro resalta que varias personas e instituciones comparten la responsabilidad de evitar lesiones graves y muertes?",
      options: [
        { id: "a", text: "Eficiencia económica" },
        { id: "b", text: "Corresponsabilidad" },
        { id: "c", text: "Libertad de conducción" },
        { id: "d", text: "Prioridad vehicular" },
      ],
      correct: "b",
    },
    {
      id: "m5q3_14",
      text: "La guía promueve un enfoque proactivo, no uno que espere a que ocurran los siniestros para actuar.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q3_15",
      text: "¿Cuál aprendizaje es especialmente útil para el M5?",
      options: [
        { id: "a", text: "Que conducir bien depende solo de habilidad técnica" },
        { id: "b", text: "Que la velocidad debe entenderse como riesgo gestionable desde educación, control y decisiones individuales" },
        { id: "c", text: "Que los límites son variables según confianza" },
        { id: "d", text: "Que basta con conocer el vehículo" },
      ],
      correct: "b",
    },
    {
      id: "m5q3_16",
      text: "Un conductor que adopta esta guía debería:",
      options: [
        { id: "a", text: "Elegir la velocidad según lo que hagan los demás" },
        { id: "b", text: "Comprender el riesgo del exceso de velocidad y ajustar su conducta antes de una sanción o siniestro" },
        { id: "c", text: "Aumentar velocidad en vías conocidas" },
        { id: "d", text: "Considerar que la experiencia neutraliza el riesgo" },
      ],
      correct: "b",
    },
    {
      id: "m5q3_17",
      text: "La guía relaciona la sensibilización con mayor aceptación social de cambios en límites y medidas de gestión de velocidad.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q3_18",
      text: "¿Qué contradice más el sentido de esta guía?",
      options: [
        { id: "a", text: "Comunicar riesgos" },
        { id: "b", text: "Sensibilizar a actores viales" },
        { id: "c", text: "Tratar la velocidad como asunto pedagógico y preventivo" },
        { id: "d", text: "Restarle importancia a la velocidad porque “todo depende del conductor”" },
      ],
      correct: "d",
    },
    {
      id: "m5q3_19",
      text: "¿Qué idea institucional resume mejor este anexo?",
      options: [
        { id: "a", text: "La velocidad es un asunto menor" },
        { id: "b", text: "La gestión segura de la velocidad requiere comprensión, corresponsabilidad y educación" },
        { id: "c", text: "La educación vial reemplaza toda norma" },
        { id: "d", text: "La velocidad solo es problema urbano" },
      ],
      correct: "b",
    },
    {
      id: "m5q3_20",
      text: "Este anexo fortalece el M5 al conectar velocidad segura con percepción del riesgo, toma de decisiones y protección de la vida.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
  ],
};

const M5_Q4 = {
  title: "Quiz — ANEXO TÉCNICO: DISTANCIA DE FRENADO",
  questions: [
    {
      id: "m5q4_01",
      text: "¿Qué es la distancia de reacción?",
      options: [
        { id: "a", text: "La distancia que recorre el vehículo después de apagar el motor" },
        { id: "b", text: "La distancia recorrida desde que el conductor percibe que debe parar hasta que acciona los frenos" },
        { id: "c", text: "La distancia recorrida mientras el vehículo está estacionado" },
        { id: "d", text: "La distancia que se recorre con luces encendidas" },
      ],
      correct: "b",
    },
    {
      id: "m5q4_02",
      text: "La distancia de frenado corresponde al tramo recorrido desde que se accionan los frenos hasta que el vehículo se detiene.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q4_03",
      text: "Según la lámina, si un auto va a 80 km/h y se le cruza un peatón a 45 metros, ¿qué ocurre?",
      options: [
        { id: "a", text: "Siempre se detiene a tiempo" },
        { id: "b", text: "Lo impacta aproximadamente a 66 km/h" },
        { id: "c", text: "Lo impacta a 20 km/h" },
        { id: "d", text: "Solo lo impacta si la vía está mojada" },
      ],
      correct: "b",
    },
    {
      id: "m5q4_04",
      text: "En ese mismo ejemplo de 80 km/h, aproximadamente ¿cuántos metros recorre el vehículo entre que el conductor ve al peatón y acciona los frenos?",
      options: [
        { id: "a", text: "10 metros" },
        { id: "b", text: "20 metros" },
        { id: "c", text: "34 metros" },
        { id: "d", text: "50 metros" },
      ],
      correct: "c",
    },
    {
      id: "m5q4_05",
      text: "En el ejemplo, después de la reacción aún se necesitan 36 metros más para detener totalmente el vehículo.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q4_06",
      text: "¿Qué muestra la lámina al comparar 50, 60, 70 y 80 km/h?",
      options: [
        { id: "a", text: "Que frenar siempre requiere la misma distancia" },
        { id: "b", text: "Que al aumentar la velocidad crece la distancia requerida para detener totalmente el vehículo" },
        { id: "c", text: "Que la reacción no cambia con la velocidad" },
        { id: "d", text: "Que el frenado importa más que la reacción en todos los casos por igual" },
      ],
      correct: "b",
    },
    {
      id: "m5q4_07",
      text: "Según la figura de energía de impacto y velocidad, ¿qué ocurre con la probabilidad de sufrir una lesión mortal a medida que aumenta la velocidad de impacto?",
      options: [
        { id: "a", text: "Disminuye linealmente" },
        { id: "b", text: "Permanece igual" },
        { id: "c", text: "Aumenta significativamente" },
        { id: "d", text: "Solo cambia después de 100 km/h" },
      ],
      correct: "c",
    },
    {
      id: "m5q4_08",
      text: "La gráfica muestra un aumento muy marcado del riesgo de lesión mortal alrededor de velocidades de impacto cercanas a 50 km/h.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q4_09",
      text: "¿Qué enseña el “cono de visión al conducir” de la lámina?",
      options: [
        { id: "a", text: "Que la visibilidad periférica mejora con la velocidad" },
        { id: "b", text: "Que el campo de visión se reduce conforme aumenta la velocidad" },
        { id: "c", text: "Que mirar a mayor velocidad amplía el entorno" },
        { id: "d", text: "Que el campo visual depende solo del tamaño del parabrisas" },
      ],
      correct: "b",
    },
    {
      id: "m5q4_10",
      text: "Según la lámina, ¿qué cono de visión aproximado aparece a 35 km/h?",
      options: [
        { id: "a", text: "18°" },
        { id: "b", text: "30°" },
        { id: "c", text: "70°" },
        { id: "d", text: "104°" },
      ],
      correct: "d",
    },
    {
      id: "m5q4_11",
      text: "A 130 km/h, el cono de visión mostrado es mucho menor que a 65 km/h.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q4_12",
      text: "¿Cuál es una lectura correcta para conducción segura en automóvil?",
      options: [
        { id: "a", text: "Si reacciono rápido, la velocidad deja de importar" },
        { id: "b", text: "La distancia total para detenerse depende tanto de reacción como de frenado" },
        { id: "c", text: "Solo importa la calidad de los frenos" },
        { id: "d", text: "Solo importa la distancia de frenado, no la de reacción" },
      ],
      correct: "b",
    },
    {
      id: "m5q4_13",
      text: "¿Qué relación tiene esta lámina con la gestión de la velocidad?",
      options: [
        { id: "a", text: "Ninguna" },
        { id: "b", text: "Demuestra por qué “unos pocos km/h más” pueden cambiar radicalmente el desenlace de un conflicto vial" },
        { id: "c", text: "Solo sirve para peritajes" },
        { id: "d", text: "Solo aplica a carreteras" },
      ],
      correct: "b",
    },
    {
      id: "m5q4_14",
      text: "El material ayuda a entender que no basta con ver el peligro: también se requiere tiempo y distancia para reaccionar y detenerse.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q4_15",
      text: "¿Qué decisión sería más coherente con este anexo?",
      options: [
        { id: "a", text: "Acercarse más al vehículo de adelante para ganar tiempo" },
        { id: "b", text: "Mantener distancia y moderar velocidad en contextos con posibles cruces peatonales" },
        { id: "c", text: "Confiar en que el ABS elimina la distancia de reacción" },
        { id: "d", text: "Frenar tarde si el carro responde bien" },
      ],
      correct: "b",
    },
    {
      id: "m5q4_16",
      text: "¿Qué contradice más el sentido del anexo?",
      options: [
        { id: "a", text: "Respetar velocidades seguras" },
        { id: "b", text: "Mantener atención al entorno" },
        { id: "c", text: "Asumir que a alta velocidad se puede frenar igual que a baja velocidad" },
        { id: "d", text: "Comprender el riesgo de impacto residual" },
      ],
      correct: "c",
    },
    {
      id: "m5q4_17",
      text: "La lámina muestra que a 50 km/h el vehículo del ejemplo logra frenar a tiempo antes del peatón.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m5q4_18",
      text: "¿Qué lección deja la comparación entre 60, 70 y 80 km/h?",
      options: [
        { id: "a", text: "Que pequeñas diferencias de velocidad pueden producir grandes diferencias en la velocidad del impacto" },
        { id: "b", text: "Que solo importa el tamaño del carro" },
        { id: "c", text: "Que los peatones siempre alcanzan a apartarse" },
        { id: "d", text: "Que el entorno no influye" },
      ],
      correct: "a",
    },
    {
      id: "m5q4_19",
      text: "¿Qué relación tiene el cono de visión con la conducción preventiva?",
      options: [
        { id: "a", text: "A mayor velocidad, más detalles puede percibir el conductor" },
        { id: "b", text: "A mayor velocidad, menos información periférica capta el conductor, lo que dificulta anticipar riesgos" },
        { id: "c", text: "El cono de visión solo importa en motocicleta" },
        { id: "d", text: "La visión no se altera con la velocidad" },
      ],
      correct: "b",
    },
    {
      id: "m5q4_20",
      text: "Este anexo fortalece el M5 porque conecta velocidad, percepción, reacción, frenado e impacto en una lógica clara de prevención.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
  ],
};


// ======================================================================
// Module 6
// ======================================================================

const M6_Q1 = {
  title: "Quiz — ANEXO TÉCNICO: PLAN NACIONAL DE SEGURIDAD VIAL 2022–2031",
  questions: [
    {
      id: "m6q1_01",
      text: "¿Qué enfoque general adopta el PNSV 2022–2031 para abordar la seguridad vial en Colombia?",
      options: [
        { id: "a", text: "Responsabilidad exclusiva del conductor" },
        { id: "b", text: "Sistema Seguro" },
        { id: "c", text: "Liberalización total del tránsito" },
        { id: "d", text: "Control basado solo en sanciones" },
      ],
      correct: "b",
    },
    {
      id: "m6q1_02",
      text: "El PNSV parte de la idea de que ningún fallecimiento o lesión grave en las vías es aceptable.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q1_03",
      text: "¿Cuál de estas áreas de acción del PNSV resulta más directamente aplicable a la operación de un camión rígido C2?",
      options: [
        { id: "a", text: "Velocidades seguras" },
        { id: "b", text: "Vehículos seguros" },
        { id: "c", text: "Infraestructura vial segura" },
        { id: "d", text: "Todas las anteriores" },
      ],
      correct: "d",
    },
    {
      id: "m6q1_04",
      text: "¿Cuál combinación resume mejor los ejes del PNSV más pertinentes para conductores de C2?",
      options: [
        { id: "a", text: "Velocidades seguras, vehículos seguros, infraestructura segura, comportamiento seguro y cumplimiento de normas" },
        { id: "b", text: "Turismo, recaudo y competitividad" },
        { id: "c", text: "Publicidad vial y urbanismo comercial" },
        { id: "d", text: "Solo atención post-siniestro" },
      ],
      correct: "a",
    },
    {
      id: "m6q1_05",
      text: "El PNSV incluye dentro de su estructura un área específica de velocidades seguras.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q1_06",
      text: "Para un vehículo pesado rígido, el eje de “velocidades seguras” implica principalmente:",
      options: [
        { id: "a", text: "Mantener la mayor velocidad posible para reducir tiempos" },
        { id: "b", text: "Ajustar la velocidad a las condiciones de la vía, el entorno y el riesgo" },
        { id: "c", text: "Circular siempre al límite máximo" },
        { id: "d", text: "Depender solo de la potencia del vehículo" },
      ],
      correct: "b",
    },
    {
      id: "m6q1_07",
      text: "El eje de “vehículos seguros” es especialmente importante en C2 porque:",
      options: [
        { id: "a", text: "El tamaño y la masa aumentan las consecuencias de un error o una falla" },
        { id: "b", text: "Los camiones no requieren mantenimiento frecuente" },
        { id: "c", text: "La seguridad depende solo del conductor" },
        { id: "d", text: "Solo aplica a vehículos nuevos de lujo" },
      ],
      correct: "a",
    },
    {
      id: "m6q1_08",
      text: "El PNSV contempla “infraestructura vial segura” como una de sus áreas centrales.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q1_09",
      text: "Desde el PNSV, ¿qué lectura es más correcta para un conductor de C2 frente a la infraestructura?",
      options: [
        { id: "a", text: "La infraestructura no modifica el riesgo" },
        { id: "b", text: "Curvas, pendientes, puntos críticos y características del entorno condicionan la conducción segura" },
        { id: "c", text: "Solo importan los peajes" },
        { id: "d", text: "La vía se interpreta igual para un camión y una bicicleta" },
      ],
      correct: "b",
    },
    {
      id: "m6q1_10",
      text: "¿Qué pretende el área de “comportamiento seguro” en relación con conductores de carga?",
      options: [
        { id: "a", text: "Sustituir la formación técnica" },
        { id: "b", text: "Fortalecer decisiones seguras, autocontrol y reducción de conductas de riesgo" },
        { id: "c", text: "Eliminar la necesidad de normas" },
        { id: "d", text: "Centrar todo en experiencia empírica" },
      ],
      correct: "b",
    },
    {
      id: "m6q1_11",
      text: "El PNSV también incluye el área de “cumplimiento de normas de tránsito en materia de seguridad vial”.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q1_12",
      text: "Para un conductor de C2, el cumplimiento normativo incluye especialmente:",
      options: [
        { id: "a", text: "Desconocer restricciones si no hay control" },
        { id: "b", text: "Respetar límites, señalización, condiciones técnicas y obligaciones documentales" },
        { id: "c", text: "Priorizar tiempos de entrega sobre seguridad" },
        { id: "d", text: "Conducir igual en cualquier contexto" },
      ],
      correct: "b",
    },
    {
      id: "m6q1_13",
      text: "¿Cuál de estos indicadores intermedios del PNSV se relaciona más con conducción segura de camiones?",
      options: [
        { id: "a", text: "Uso de cinturón de seguridad en conductores y acompañantes en silla delantera" },
        { id: "b", text: "Uso de silla de retención infantil" },
        { id: "c", text: "Uso de casco para motociclistas" },
        { id: "d", text: "Cruces peatonales indebidos" },
      ],
      correct: "a",
    },
    {
      id: "m6q1_14",
      text: "El PNSV reconoce el uso del cinturón de seguridad como un indicador relevante de comportamiento seguro.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q1_15",
      text: "¿Qué idea institucional del PNSV se ajusta mejor a la conducción profesional de C2?",
      options: [
        { id: "a", text: "La seguridad vial depende solo del control policial" },
        { id: "b", text: "La seguridad vial exige articulación entre vehículo, vía, velocidad, comportamiento y control" },
        { id: "c", text: "El conductor experto puede compensar cualquier falla" },
        { id: "d", text: "Las normas son secundarias frente a la productividad" },
      ],
      correct: "b",
    },
    {
      id: "m6q1_16",
      text: "¿Qué interpretación es más coherente con el PNSV para el caso de camiones rígidos?",
      options: [
        { id: "a", text: "Un vehículo pesado puede asumir más riesgo porque es más robusto" },
        { id: "b", text: "A mayor masa y tamaño, mayor responsabilidad de conducción preventiva" },
        { id: "c", text: "La seguridad depende solo del fabricante" },
        { id: "d", text: "La distancia de seguimiento es irrelevante" },
      ],
      correct: "b",
    },
    {
      id: "m6q1_17",
      text: "El PNSV articula sus objetivos y acciones bajo una estrategia nacional y una territorial.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q1_18",
      text: "¿Qué contradice más el enfoque del PNSV aplicado a C2?",
      options: [
        { id: "a", text: "Gestionar velocidad según el contexto" },
        { id: "b", text: "Fortalecer condiciones técnicas del vehículo" },
        { id: "c", text: "Asumir que cumplir normas es opcional cuando se tiene experiencia" },
        { id: "d", text: "Mejorar capacidades de control y prevención" },
      ],
      correct: "c",
    },
    {
      id: "m6q1_19",
      text: "¿Cuál aprendizaje clave deja el PNSV para el M6?",
      options: [
        { id: "a", text: "La seguridad de vehículos pesados no puede reducirse a “manejar bien”" },
        { id: "b", text: "Basta con saber maniobrar" },
        { id: "c", text: "Todo depende de la infraestructura" },
        { id: "d", text: "El comportamiento individual no influye" },
      ],
      correct: "a",
    },
    {
      id: "m6q1_20",
      text: "Para el M6, del PNSV conviene tomar solo los temas que ayudan a operar camiones rígidos C2 con criterios de prevención, control y corresponsabilidad.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
  ],
};

const M6_Q2 = {
  title: "Quiz — ANEXO TÉCNICO: MANUAL DE SEÑALIZACIÓN VIAL DE COLOMBIA 2024",
  questions: [
    {
      id: "m6q2_01",
      text: "¿Cuál es el objetivo general del Manual de Señalización Vial de Colombia?",
      options: [
        { id: "a", text: "Regular exclusivamente motocicletas" },
        { id: "b", text: "Servir como documento técnico integral para diseño, instalación, uso, mantenimiento y control de la señalización vial" },
        { id: "c", text: "Sustituir el Código Nacional de Tránsito" },
        { id: "d", text: "Definir solo colores para señales turísticas" },
      ],
      correct: "b",
    },
    {
      id: "m6q2_02",
      text: "El manual es obligatorio para autoridades de tránsito y entidades responsables de la infraestructura vial.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q2_03",
      text: "¿Qué utilidad tiene el manual para un conductor de C2?",
      options: [
        { id: "a", text: "Ninguna, porque es solo para ingenieros" },
        { id: "b", text: "Ayuda a interpretar señales, demarcaciones y semáforos para circular de manera correcta y segura" },
        { id: "c", text: "Solo aplica a ciclorrutas" },
        { id: "d", text: "Solo sirve en zonas urbanas" },
      ],
      correct: "b",
    },
    {
      id: "m6q2_04",
      text: "¿Qué señal reglamentaria aparece en el manual para restringir la circulación de vehículos de carga?",
      options: [
        { id: "a", text: "SR-26" },
        { id: "b", text: "SR-16" },
        { id: "c", text: "SR-08" },
        { id: "d", text: "SR-50" },
      ],
      correct: "b",
    },
    {
      id: "m6q2_05",
      text: "El manual contempla señales de prohibición aplicables a clases específicas de vehículo, incluido el vehículo de carga.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q2_06",
      text: "¿Qué indica la señal SR-26 “NO ADELANTAR”?",
      options: [
        { id: "a", text: "Que solo motos pueden adelantar" },
        { id: "b", text: "Que no debe realizarse la maniobra de adelantamiento en ese tramo" },
        { id: "c", text: "Que se debe acelerar para pasar rápido" },
        { id: "d", text: "Que la vía termina" },
      ],
      correct: "b",
    },
    {
      id: "m6q2_07",
      text: "¿Cuándo debe demarcarse una zona de no adelantar?",
      options: [
        { id: "a", text: "Cuando el conductor crea que es incómodo adelantar" },
        { id: "b", text: "Cuando la distancia de visibilidad de adelantamiento no es suficiente para hacerlo de forma segura" },
        { id: "c", text: "Solo en zona urbana" },
        { id: "d", text: "Únicamente en presencia de semáforo" },
      ],
      correct: "b",
    },
    {
      id: "m6q2_08",
      text: "En vías multicarril unidireccionales, la demarcación de no adelantar puede realizarse con líneas continuas blancas.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q2_09",
      text: "¿Qué le aporta esto al conductor de un C2?",
      options: [
        { id: "a", text: "Saber dónde puede ocupar varios carriles" },
        { id: "b", text: "Reconocer que por tamaño, longitud y tiempo de maniobra debe anticipar mejor el adelantamiento" },
        { id: "c", text: "Entender que la señalización no aplica a vehículos pesados" },
        { id: "d", text: "Justificar cualquier maniobra lenta" },
      ],
      correct: "b",
    },
    {
      id: "m6q2_10",
      text: "¿Qué función cumplen las líneas de borde de calzada?",
      options: [
        { id: "a", text: "Decorar la vía" },
        { id: "b", text: "Delimitar la berma o el separador respecto a los carriles de circulación" },
        { id: "c", text: "Reemplazar señales verticales" },
        { id: "d", text: "Autorizar paradas en cualquier lugar" },
      ],
      correct: "b",
    },
    {
      id: "m6q2_11",
      text: "Para un vehículo pesado, reconocer el borde exterior e interior de la calzada ayuda a controlar mejor la trayectoria y el posicionamiento.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q2_12",
      text: "¿Qué indica la señal SR-10 “PROHIBIDO GIRAR EN U”?",
      options: [
        { id: "a", text: "Que se debe retornar con precaución" },
        { id: "b", text: "Que no puede realizarse el retorno o giro en U" },
        { id: "c", text: "Que solo aplica a buses" },
        { id: "d", text: "Que el giro está permitido si no hay tráfico" },
      ],
      correct: "b",
    },
    {
      id: "m6q2_13",
      text: "¿Por qué esta restricción es especialmente importante en C2?",
      options: [
        { id: "a", text: "Porque el vehículo tiene menor radio de giro y puede generar riesgo o entorpecimiento" },
        { id: "b", text: "Porque el camión siempre puede girar más fácil" },
        { id: "c", text: "Porque solo aplica a motos" },
        { id: "d", text: "Porque el retorno siempre es prioritario" },
      ],
      correct: "a",
    },
    {
      id: "m6q2_14",
      text: "El manual permite adosar placas para precisar a qué clase de vehículo aplica una restricción o en qué horario rige.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q2_15",
      text: "¿Qué relación establece el manual entre señalización y seguridad?",
      options: [
        { id: "a", text: "La señalización es secundaria frente a la experiencia" },
        { id: "b", text: "La señalización comunica cómo circular de forma correcta y segura" },
        { id: "c", text: "La señalización solo sirve para sancionar" },
        { id: "d", text: "La señalización es solo urbana" },
      ],
      correct: "b",
    },
    {
      id: "m6q2_16",
      text: "Para un C2 en intersección semaforizada, ¿qué conducta es más coherente con el manual?",
      options: [
        { id: "a", text: "Guiarse solo por el vehículo de adelante" },
        { id: "b", text: "Integrar semáforos, señales de giro, demarcaciones y restricciones por clase de vehículo" },
        { id: "c", text: "Invadir la intersección si el vehículo es pesado" },
        { id: "d", text: "Girar aunque exista restricción si el radio lo permite" },
      ],
      correct: "b",
    },
    {
      id: "m6q2_17",
      text: "El manual también desarrolla capítulos de señales verticales, demarcaciones y semaforización que son clave para el M6.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q2_18",
      text: "¿Qué contradice más el enfoque del manual aplicado a carga?",
      options: [
        { id: "a", text: "Respetar zonas de no adelantamiento" },
        { id: "b", text: "Ignorar restricciones específicas para vehículos de carga" },
        { id: "c", text: "Leer el entorno como sistema integrado" },
        { id: "d", text: "Anticipar maniobras según señalización" },
      ],
      correct: "b",
    },
    {
      id: "m6q2_19",
      text: "¿Cuál aprendizaje práctico deja este anexo para C2?",
      options: [
        { id: "a", text: "Que la señalización debe leerse como apoyo a la toma de decisiones seguras" },
        { id: "b", text: "Que basta con conocer el destino" },
        { id: "c", text: "Que solo importa la potencia del vehículo" },
        { id: "d", text: "Que el carril se define según costumbre" },
      ],
      correct: "a",
    },
    {
      id: "m6q2_20",
      text: "Para el M6, del Manual de Señalización Vial interesan especialmente las restricciones a carga, zonas de no adelantar, demarcaciones de carril y lectura segura de intersecciones.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
  ],
};

const M6_Q3 = {
  title: "Quiz — ANEXO TÉCNICO: GUÍA DE CONDUCCIÓN SEGURA DE VEHÍCULOS DE CARGA EN VÍAS MULTICARRIL",
  questions: [
    {
      id: "m6q3_01",
      text: "¿A quién está dirigida esta guía?",
      options: [
        { id: "a", text: "A peatones urbanos" },
        { id: "b", text: "A conductores de vehículos de carga" },
        { id: "c", text: "A motociclistas recreativos" },
        { id: "d", text: "A ciclistas deportivos" },
      ],
      correct: "b",
    },
    {
      id: "m6q3_02",
      text: "La guía promueve el conocimiento del vehículo y el mantenimiento adecuado como base de la conducción segura.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q3_03",
      text: "¿Qué recomienda la guía frente a infraestructura nueva tipo multicarril?",
      options: [
        { id: "a", text: "Conducir igual que en cualquier vía conocida" },
        { id: "b", text: "Transitar con mayor precaución y reconocer el entorno, especialmente en los primeros recorridos" },
        { id: "c", text: "Aumentar velocidad para adaptarse" },
        { id: "d", text: "Usar siempre el carril izquierdo" },
      ],
      correct: "b",
    },
    {
      id: "m6q3_04",
      text: "Según la guía, ¿por qué un vehículo de carga responde distinto ante una eventualidad?",
      options: [
        { id: "a", text: "Porque todos frenan igual" },
        { id: "b", text: "Porque influyen sus especificaciones técnicas, operativas y de seguridad, además del diseño vial, topografía y ambiente" },
        { id: "c", text: "Porque solo importa el conductor" },
        { id: "d", text: "Porque todos los multicarriles son iguales" },
      ],
      correct: "b",
    },
    {
      id: "m6q3_05",
      text: "La guía insiste en conocer el vehículo y mantenerlo en condiciones óptimas para maniobrar de forma segura ante un imprevisto.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q3_06",
      text: "Antes de cada viaje, la revisión preventiva debe incluir:",
      options: [
        { id: "a", text: "Solo combustible" },
        { id: "b", text: "Fluidos, llantas, luces, frenos, cinturones, retrovisores, batería, suspensión y señalización, entre otros" },
        { id: "c", text: "Solo carrocería exterior" },
        { id: "d", text: "Solo documentación" },
      ],
      correct: "b",
    },
    {
      id: "m6q3_07",
      text: "¿Cuál triángulo de seguridad destaca la guía?",
      options: [
        { id: "a", text: "Motor, luces y bocina" },
        { id: "b", text: "Frenos, llantas y suspensión" },
        { id: "c", text: "Cabina, carrocería y espejos" },
        { id: "d", text: "Volante, radio y tablero" },
      ],
      correct: "b",
    },
    {
      id: "m6q3_08",
      text: "La guía resalta que cada viaje debe iniciar asegurando que frenos, llantas y suspensión estén en estado óptimo.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q3_09",
      text: "¿Qué recomienda la guía sobre las condiciones de la vía?",
      options: [
        { id: "a", text: "Descubrirlas durante la marcha" },
        { id: "b", text: "Revisarlas con anterioridad para identificar restricciones y particularidades" },
        { id: "c", text: "Suponer que toda vía admite el paso del vehículo" },
        { id: "d", text: "Depender solo del GPS" },
      ],
      correct: "b",
    },
    {
      id: "m6q3_10",
      text: "¿Qué aspecto debe considerar un conductor de carga al revisar la infraestructura previamente?",
      options: [
        { id: "a", text: "Solo el color del pavimento" },
        { id: "b", text: "Restricciones en puentes, túneles, pesos, alturas u otras condiciones que limiten el paso" },
        { id: "c", text: "Solo presencia de restaurantes" },
        { id: "d", text: "Exclusivamente el número de peajes" },
      ],
      correct: "b",
    },
    {
      id: "m6q3_11",
      text: "La guía indica que debe conocerse y respetarse el límite de velocidad por carril.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q3_12",
      text: "¿Qué recomienda la guía sobre el uso de carriles en vías multicarril?",
      options: [
        { id: "a", text: "Permanecer en el izquierdo para mayor visibilidad" },
        { id: "b", text: "Transitar preferentemente por la derecha y usar los otros carriles solo para adelantar" },
        { id: "c", text: "Cambiar constantemente para ganar tiempo" },
        { id: "d", text: "Usar indistintamente cualquier carril" },
      ],
      correct: "b",
    },
    {
      id: "m6q3_13",
      text: "¿Cómo debe realizarse el adelantamiento según la guía?",
      options: [
        { id: "a", text: "Por la derecha si hay espacio" },
        { id: "b", text: "Solo por la izquierda, de forma predecible y segura" },
        { id: "c", text: "Por cualquier lado, según el tráfico" },
        { id: "d", text: "Solo en túneles" },
      ],
      correct: "b",
    },
    {
      id: "m6q3_14",
      text: "La guía advierte que adelantar por la derecha incrementa significativamente el riesgo de colisiones.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q3_15",
      text: "¿Qué debe hacerse una vez finalizada la maniobra de adelantamiento?",
      options: [
        { id: "a", text: "Permanecer en el carril central" },
        { id: "b", text: "Regresar al carril derecho" },
        { id: "c", text: "Frenar de inmediato" },
        { id: "d", text: "Activar luces de emergencia" },
      ],
      correct: "b",
    },
    {
      id: "m6q3_16",
      text: "¿Qué recomienda la guía respecto al cinturón de seguridad?",
      options: [
        { id: "a", text: "Usarlo solo en carretera" },
        { id: "b", text: "Usarlo siempre, por conductor y ocupantes" },
        { id: "c", text: "Usarlo solo con carga pesada" },
        { id: "d", text: "Depende de la distancia del viaje" },
      ],
      correct: "b",
    },
    {
      id: "m6q3_17",
      text: "La guía incluye la recomendación de realizar paradas para descansar.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q3_18",
      text: "¿Qué relación existe entre descanso y conducción segura en C2?",
      options: [
        { id: "a", text: "Ninguna" },
        { id: "b", text: "Las pausas ayudan a reducir fatiga y sostener la atención en trayectos largos" },
        { id: "c", text: "Solo sirven para revisar la carga" },
        { id: "d", text: "Solo importan en viajes nocturnos" },
      ],
      correct: "b",
    },
    {
      id: "m6q3_19",
      text: "¿Cuál idea resume mejor este anexo?",
      options: [
        { id: "a", text: "La seguridad del camión depende solo de la pericia del conductor" },
        { id: "b", text: "La conducción segura en multicarril exige revisión previa, disciplina de carril, velocidad adecuada, descanso y mantenimiento" },
        { id: "c", text: "Los multicarriles eliminan el riesgo" },
        { id: "d", text: "El peso del vehículo justifica excepciones normativas" },
      ],
      correct: "b",
    },
    {
      id: "m6q3_20",
      text: "Este anexo fortalece el M6 porque traduce la conducción profesional de carga en hábitos concretos y verificables.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
  ],
};

const M6_Q4 = {
  title: "Quiz — ANEXO TÉCNICO: GUÍA SOBRE LA IMPORTANCIA DE UNA ADECUADA REVISIÓN TÉCNICO-MECÁNICA Y DE EMISIONES CONTAMINANTES (RTMyEC)",
  questions: [
    {
      id: "m6q4_01",
      text: "¿Qué es la RTMyEC?",
      options: [
        { id: "a", text: "Un permiso temporal de circulación" },
        { id: "b", text: "Una evaluación obligatoria del vehículo respecto a requisitos mecánicos, ambientales y de seguridad" },
        { id: "c", text: "Un curso de conducción defensiva" },
        { id: "d", text: "Un trámite exclusivo de transporte público" },
      ],
      correct: "b",
    },
    {
      id: "m6q4_02",
      text: "La guía señala que la RTMyEC permite verificar que los vehículos cuenten con condiciones mínimas de seguridad.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q4_03",
      text: "¿Por qué existe esta exigencia normativa?",
      options: [
        { id: "a", text: "Para recaudar más dinero" },
        { id: "b", text: "Porque la conducción es una actividad peligrosa y se busca disminuir el riesgo de siniestros viales" },
        { id: "c", text: "Para limitar la movilidad regional" },
        { id: "d", text: "Para obligar a cambiar de vehículo" },
      ],
      correct: "b",
    },
    {
      id: "m6q4_04",
      text: "Además de la seguridad vial, la RTMyEC contribuye a:",
      options: [
        { id: "a", text: "Mejorar el rendimiento deportivo del conductor" },
        { id: "b", text: "La prestación del servicio en condiciones óptimas y al cuidado del medio ambiente" },
        { id: "c", text: "Reducir peajes" },
        { id: "d", text: "Aumentar velocidad de operación" },
      ],
      correct: "b",
    },
    {
      id: "m6q4_05",
      text: "La guía está dirigida también a la ciudadanía y a quienes participan en la cadena logística del transporte.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q4_06",
      text: "¿Qué se verifica en la RTMyEC?",
      options: [
        { id: "a", text: "Solo emisiones" },
        { id: "b", text: "Carrocería y chasis, frenos, suspensión, luces, dirección, motor y transmisión, llantas, entre otros" },
        { id: "c", text: "Solo documentos" },
        { id: "d", text: "Solo estado de pintura" },
      ],
      correct: "b",
    },
    {
      id: "m6q4_07",
      text: "Para un camión rígido C2, ¿por qué es especialmente importante esta revisión?",
      options: [
        { id: "a", text: "Porque puede circular sin importar su estado" },
        { id: "b", text: "Porque por masa y operación requiere asegurar condiciones técnicas mínimas antes de transitar" },
        { id: "c", text: "Porque solo se revisa en viajes largos" },
        { id: "d", text: "Porque reemplaza el mantenimiento preventivo" },
      ],
      correct: "b",
    },
    {
      id: "m6q4_08",
      text: "La RTMyEC se realiza con base en Normas Técnicas Colombianas aplicables.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q4_09",
      text: "¿Quién tiene la obligación de realizar la RTMyEC y obtener su aprobación?",
      options: [
        { id: "a", text: "Solo el taller" },
        { id: "b", text: "El propietario o tenedor del vehículo" },
        { id: "c", text: "Solo la autoridad de tránsito" },
        { id: "d", text: "Solo la empresa transportadora" },
      ],
      correct: "b",
    },
    {
      id: "m6q4_10",
      text: "¿Qué periodicidad indica la guía para vehículos de servicio público?",
      options: [
        { id: "a", text: "Primera revisión al sexto año y luego anual" },
        { id: "b", text: "Primera revisión al cumplir dos años desde la matrícula y luego anual" },
        { id: "c", text: "Solo cuando lo exija la empresa" },
        { id: "d", text: "Cada cinco años" },
      ],
      correct: "b",
    },
    {
      id: "m6q4_11",
      text: "La guía distingue entre revisión mecanizada y otros tipos de inspección según el vehículo.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q4_12",
      text: "¿Qué significa que los resultados de una revisión mecanizada se reporten de forma automática y sistematizada?",
      options: [
        { id: "a", text: "Que el operario puede modificarlos libremente" },
        { id: "b", text: "Que se reduce la manipulación de los resultados" },
        { id: "c", text: "Que el conductor los decide" },
        { id: "d", text: "Que no existe evidencia del proceso" },
      ],
      correct: "b",
    },
    {
      id: "m6q4_13",
      text: "¿Cuál es la lectura correcta para el M6 sobre RTMyEC?",
      options: [
        { id: "a", text: "Es un trámite administrativo sin relación con la seguridad" },
        { id: "b", text: "Es una barrera preventiva frente a fallas mecánicas y riesgos operativos" },
        { id: "c", text: "Solo importa para vehículos livianos" },
        { id: "d", text: "Sustituye la inspección preoperacional diaria" },
      ],
      correct: "b",
    },
    {
      id: "m6q4_14",
      text: "La RTMyEC no reemplaza la responsabilidad cotidiana del conductor de revisar el estado del vehículo antes de operar.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q4_15",
      text: "¿Qué contradice más el sentido de esta guía?",
      options: [
        { id: "a", text: "Entender la RTMyEC como condición mínima de seguridad" },
        { id: "b", text: "Pensar que un vehículo pesado puede operar seguro aunque omita la revisión técnica obligatoria" },
        { id: "c", text: "Relacionar la revisión con prevención" },
        { id: "d", text: "Revisar sistemas críticos del vehículo" },
      ],
      correct: "b",
    },
    {
      id: "m6q4_16",
      text: "¿Qué aprendizaje deja este anexo sobre seguridad en C2?",
      options: [
        { id: "a", text: "Que la condición técnica del vehículo es inseparable de la conducción profesional" },
        { id: "b", text: "Que el conductor no influye si la revisión está vigente" },
        { id: "c", text: "Que la revisión solo sirve para emisiones" },
        { id: "d", text: "Que basta con mirar las llantas" },
      ],
      correct: "a",
    },
    {
      id: "m6q4_17",
      text: "La guía busca facilitar la comprensión y concientización sobre la utilidad de la RTMyEC.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
    {
      id: "m6q4_18",
      text: "¿Cuál combinación representa mejor una visión preventiva?",
      options: [
        { id: "a", text: "RTMyEC vigente + inspección preoperacional + mantenimiento" },
        { id: "b", text: "Solo RTMyEC" },
        { id: "c", text: "Solo experiencia del conductor" },
        { id: "d", text: "Solo revisión visual de la cabina" },
      ],
      correct: "a",
    },
    {
      id: "m6q4_19",
      text: "¿Qué papel cumple este anexo dentro del M6?",
      options: [
        { id: "a", text: "Fortalece el componente de inspección técnica y legalidad operativa del camión rígido" },
        { id: "b", text: "Sustituye la señalización vial" },
        { id: "c", text: "Se enfoca en peatones" },
        { id: "d", text: "Reemplaza la formación en puntos ciegos" },
      ],
      correct: "a",
    },
    {
      id: "m6q4_20",
      text: "Este anexo fortalece el M6 porque conecta seguridad operativa, legalidad y prevención de fallas mecánicas en vehículos pesados.",
      options: [
        { id: "a", text: "Verdadero" },
        { id: "b", text: "Falso" },
      ],
      correct: "a",
    },
  ],
};

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