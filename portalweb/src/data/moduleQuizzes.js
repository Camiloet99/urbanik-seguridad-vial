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
