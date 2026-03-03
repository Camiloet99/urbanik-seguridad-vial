/**
 * moduleTests.js
 *
 * Questions for the initial and exit tests of each module.
 *
 * Shape:
 *   MODULE_TESTS[modulo] = {
 *     title:   string,
 *     initial: Question[],   // pre-test
 *     exit:    Question[],   // post-test
 *   }
 *
 *   Question = {
 *     id:      string,
 *     text:    string,
 *     options: { id: string, text: string }[],
 *     correct: string,   // option id
 *   }
 */

/**
 * moduleTests.js
 *
 * Questions for the initial and exit tests of each module.
 *
 * Shape:
 *   MODULE_TESTS[modulo] = {
 *     title:   string,
 *     initial: Question[],   // pre-test
 *     exit:    Question[],   // post-test
 *   }
 *
 *   Question = {
 *     id:      string,
 *     text:    string,
 *     options: { id: string, text: string }[],
 *     correct: string,   // option id
 *   }
 */

export const MODULE_TESTS = {
  // ─────────────────────────────────────────────────────────────────────────
  // MÓDULO 0 — General (test inicial manejado por RiskProfileTest; exit aquí)
  // ─────────────────────────────────────────────────────────────────────────
  0: {
    title: "Módulo General de Seguridad Vial",
    initial: [
      {
        id: "0i1",
        text: "¿Cuál es el principal objetivo de la seguridad vial?",
        options: [
          { id: "a", text: "Reducir el tráfico vehicular" },
          { id: "b", text: "Prevenir accidentes y proteger la vida de todos los actores viales" },
          { id: "c", text: "Aumentar las multas por infracciones" },
          { id: "d", text: "Regular el transporte público" },
        ],
        correct: "b",
      },
      {
        id: "0i2",
        text: "¿Qué es un 'actor vial'?",
        options: [
          { id: "a", text: "Solo los conductores de vehículos" },
          { id: "b", text: "El personal de la policía de tránsito" },
          { id: "c", text: "Toda persona que participa en el tráfico (peatón, ciclista, conductor, etc.)" },
          { id: "d", text: "Los dueños de vehículos registrados" },
        ],
        correct: "c",
      },
      {
        id: "0i3",
        text: "¿Qué factor es responsable de la mayoría de los accidentes de tránsito?",
        options: [
          { id: "a", text: "Estado de las vías" },
          { id: "b", text: "Condiciones climáticas" },
          { id: "c", text: "Fallas mecánicas" },
          { id: "d", text: "El comportamiento humano" },
        ],
        correct: "d",
      },
      {
        id: "0i4",
        text: "¿Qué significa el 'enfoque de sistema seguro' en seguridad vial?",
        options: [
          { id: "a", text: "Que sólo los conductores deben ser responsables" },
          { id: "b", text: "Que el sistema vial debe estar diseñado para tolerar los errores humanos" },
          { id: "c", text: "Que los errores en la vía son inevitables y aceptables" },
          { id: "d", text: "Que hay que aumentar las sanciones para reducir accidentes" },
        ],
        correct: "b",
      },
      {
        id: "0i5",
        text: "¿Cuál de estas conductas constituye un comportamiento seguro en la vía?",
        options: [
          { id: "a", text: "Usar el teléfono celular al conducir si es urgente" },
          { id: "b", text: "Respetar señales de tránsito y límites de velocidad" },
          { id: "c", text: "Adelantar en curvas cuando hay poca visibilidad" },
          { id: "d", text: "Cruzar semáforos en rojo si no hay carros" },
        ],
        correct: "b",
      },
      {
        id: "0i6",
        text: "¿Cuál es la diferencia entre una vía primaria y una vía secundaria?",
        options: [
          { id: "a", text: "El color de la señalización" },
          { id: "b", text: "La cantidad de carriles disponibles" },
          { id: "c", text: "La conectividad territorial; las primarias unen regiones y las secundarias unen municipios" },
          { id: "d", text: "El material del pavimento" },
        ],
        correct: "c",
      },
      {
        id: "0i7",
        text: "¿Qué indica una señal circular con fondo rojo?",
        options: [
          { id: "a", text: "Información turística" },
          { id: "b", text: "Precaución general" },
          { id: "c", text: "Prohibición o restricción" },
          { id: "d", text: "Zona escolar" },
        ],
        correct: "c",
      },
      {
        id: "0i8",
        text: "¿Qué es la 'distancia de frenado'?",
        options: [
          { id: "a", text: "El espacio entre dos vehículos estacionados" },
          { id: "b", text: "El recorrido que hace un vehículo desde que el conductor acciona los frenos hasta detenerse" },
          { id: "c", text: "La longitud mínima permitida de un vehículo" },
          { id: "d", text: "La distancia entre semáforos" },
        ],
        correct: "b",
      },
    ],
    exit: [
      {
        id: "0e1",
        text: "¿Qué cambios concretos puedes aplicar en tu movilidad diaria para mejorar tu seguridad vial?",
        options: [
          { id: "a", text: "Ninguno, ya tengo buenos hábitos" },
          { id: "b", text: "Reducir el uso de elementos de protección si el trayecto es corto" },
          { id: "c", text: "Planificar rutas seguras, respetar normas y usar elementos de protección siempre" },
          { id: "d", text: "Evitar salir en horas pico como única medida" },
        ],
        correct: "c",
      },
      {
        id: "0e2",
        text: "¿Cómo influyen las emociones en la conducta vial?",
        options: [
          { id: "a", text: "No influyen; conducir es una actividad únicamente física" },
          { id: "b", text: "El estado emocional afecta la atención, el tiempo de reacción y la toma de decisiones" },
          { id: "c", text: "Solo afectan a conductores novatos" },
          { id: "d", text: "influyen positivamente: el enojo aumenta la concentración" },
        ],
        correct: "b",
      },
      {
        id: "0e3",
        text: "¿Cuál de los siguientes hábitos reduce significativamente el riesgo de accidente?",
        options: [
          { id: "a", text: "Conducir rápido para pasar menos tiempo en la vía" },
          { id: "b", text: "Mantener distancia de seguridad y respetar límites de velocidad" },
          { id: "c", text: "Solo conducir en horarios diurnos" },
          { id: "d", text: "Usar bocina frecuentemente para alertar a otros" },
        ],
        correct: "b",
      },
      {
        id: "0e4",
        text: "¿Qué deberías hacer si presencias un accidente de tránsito?",
        options: [
          { id: "a", text: "Grabar el accidente y publicarlo en redes sociales" },
          { id: "b", text: "Seguir tu camino para no obstruir el tráfico" },
          { id: "c", text: "Asegurar la escena, llamar a emergencias y prestar primera ayuda si estás capacitado" },
          { id: "d", text: "Mover a los heridos para alejarlos del peligro inmediatamente" },
        ],
        correct: "c",
      },
      {
        id: "0e5",
        text: "¿Qué representa la 'visión cero' en seguridad vial?",
        options: [
          { id: "a", text: "Eliminar todos los vehículos de combustión interna" },
          { id: "b", text: "La meta de que ningún accidente sea mortal o cause lesiones graves" },
          { id: "c", text: "Prohibir el tránsito nocturno" },
          { id: "d", text: "Reducir el número de vehículos en circulación" },
        ],
        correct: "b",
      },
      {
        id: "0e6",
        text: "¿Por qué es importante el uso del casco en motociclistas?",
        options: [
          { id: "a", text: "Es solo un requisito legal sin impacto real" },
          { id: "b", text: "Protege la cabeza y reduce hasta un 70% el riesgo de muerte en accidente" },
          { id: "c", text: "Mejora la aerodinámica del conductor" },
          { id: "d", text: "Aumenta la visibilidad del motociclista" },
        ],
        correct: "b",
      },
      {
        id: "0e7",
        text: "¿Qué es la 'zona de conflicto vial'?",
        options: [
          { id: "a", text: "Una vía en obras de construcción" },
          { id: "b", text: "Un sector donde se presentan con mayor frecuencia siniestros o puntos críticos de riesgo" },
          { id: "c", text: "Una zona de uso exclusivo para peatones" },
          { id: "d", text: "El carril izquierdo de una autopista" },
        ],
        correct: "b",
      },
      {
        id: "0e8",
        text: "¿Cuál de los siguientes factores NO es un factor de riesgo vial?",
        options: [
          { id: "a", text: "Exceso de velocidad" },
          { id: "b", text: "Usar el cinturón de seguridad" },
          { id: "c", text: "Conducir bajo los efectos del alcohol" },
          { id: "d", text: "Distracción por el uso del celular" },
        ],
        correct: "b",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MÓDULO 1 — Fundamentos de Seguridad Vial
  // Rating scale · no correct answers
  // ─────────────────────────────────────────────────────────────────────────
  1: {
    title: "Fundamentos de Seguridad Vial",
    introInitial:
      "Antes de sumergirte en el Metaverso, queremos saber cómo percibes tu dominio sobre los pilares que protegen la vida en la vía. Este ejercicio no busca respuestas correctas, sino una reflexión honesta sobre tu conocimiento actual. Al finalizar el módulo, compararemos estos resultados para que descubras cuánto has avanzado en tu camino hacia la experticia vial.",
    introExit:
      "¡Felicidades por completar este primer paso en el Metaverso de la Seguridad Vial! Ahora que has explorado los escenarios y superado los retos del módulo, es momento de medir el impacto de lo aprendido en tu percepción técnica y ciudadana. Este ejercicio nos permitirá validar cómo tu visión de la vía se ha transformado y cuánta seguridad has ganado para proteger tu vida y la de los demás.",
    scaleInitial: { minLabel: "No conozco el tema", maxLabel: "Lo conozco perfectamente" },
    scaleExit:    { minLabel: "Sigo con dudas",     maxLabel: "Me siento totalmente capaz" },
    initial: [
      { id: "1i1", type: "rating", category: "Siniestralidad y Ética",  text: "¿Qué tanto sabes sobre la realidad de los accidentes en Antioquia y de qué manera tu ética personal impacta en la seguridad de todos los actores viales?" },
      { id: "1i2", type: "rating", category: "Infraestructura",          text: "¿Cómo calificarías tu dominio sobre el uso del urbanismo táctico y el diseño de las calles como herramientas para obligar a reducir la velocidad?" },
      { id: "1i3", type: "rating", category: "Señalización",             text: "¿Cuál es tu grado de familiaridad con las nuevas reglas y tipos de señales (verticales, semáforos y marcas) que establece el Manual de Señalización 2024?" },
      { id: "1i4", type: "rating", category: "Marco Legal",              text: "¿Qué tanta claridad tienes sobre tus obligaciones en el Código Nacional de Tránsito y la verdadera función social del SOAT y la Tecnicomecánica?" },
      { id: "1i5", type: "rating", category: "Velocidad",                text: "¿Qué tanto conoces acerca de las leyes actuales de límites de velocidad en Colombia y el funcionamiento técnico de las cámaras de fotodetección?" },
      { id: "1i6", type: "rating", category: "Atención a Víctimas",     text: "¿Qué tan preparado te sientes para aplicar el protocolo de emergencia PAS (Proteger, Avisar, Socorrer) y defender tus derechos ante un siniestro?" },
    ],
    exit: [
      { id: "1e1", type: "rating", category: "Siniestralidad y Ética",  text: "¿Cuál es tu nivel de claridad actual sobre cómo tu compromiso ético y tus decisiones personales influyen directamente en la meta de salvar vidas en Antioquia?" },
      { id: "1e2", type: "rating", category: "Infraestructura",          text: "¿Cómo calificarías tu capacidad para reconocer una vía segura y comprender que el diseño urbano está pensado para protegerte incluso ante un error humano?" },
      { id: "1e3", type: "rating", category: "Señalización",             text: "¿Qué tanta seguridad sientes ahora para interpretar la señalización técnica del Manual 2024 y utilizarla como una guía de navegación real y segura?" },
      { id: "1e4", type: "rating", category: "Marco Legal",              text: "¿Qué tanto dominio posees sobre tus derechos y deberes ciudadanos, entendiendo el respaldo real que te brindan el SOAT y la Revisión Técnica?" },
      { id: "1e5", type: "rating", category: "Velocidad",                text: "¿Cuál es tu grado de conciencia sobre el impacto vital de la velocidad y por qué la pacificación del tránsito es la herramienta más potente para evitar siniestros?" },
      { id: "1e6", type: "rating", category: "Atención a Víctimas",     text: "¿Qué tan preparado te consideras para liderar una respuesta inicial correcta bajo el protocolo PAS, protegiendo la vida y garantizando tus derechos legales?" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MÓDULO 2 — Movilidad y Seguridad Peatonal
  // Rating scale · no correct answers
  // ─────────────────────────────────────────────────────────────────────────
  2: {
    title: "Movilidad y Seguridad Peatonal",
    introInitial:
      "Antes de iniciar este módulo, queremos saber cómo percibes tu dominio sobre los pilares que protegen la vida en la vía desde el rol del actor más importante: el peatón. Este ejercicio no busca respuestas correctas, sino una reflexión honesta sobre tu conocimiento actual. Al finalizar el módulo, compararemos estos resultados para que descubras cuánto has avanzado en tu camino hacia una movilidad consciente y segura.",
    introExit:
      "¡Felicidades por completar este paso en el Metaverso de la Seguridad Vial! Ahora que has explorado la ciudad desde la perspectiva peatonal y superado los retos del módulo, es momento de medir el impacto de lo aprendido en tu percepción técnica y ciudadana. Este ejercicio nos permitirá validar cómo tu visión de la vía se ha transformado y cuánta seguridad has ganado para proteger tu integridad física y personal.",
    scaleInitial: { minLabel: "No conozco el tema", maxLabel: "Lo conozco perfectamente" },
    scaleExit:    { minLabel: "Sigo con dudas",     maxLabel: "Me siento totalmente capaz" },
    initial: [
      { id: "2i1", type: "rating", category: "Infraestructura y Urbanismo", text: "¿Qué tanto sabes sobre cómo el diseño de los andenes y las intervenciones de 'urbanismo táctico' crean refugios seguros para ti en las esquinas?" },
      { id: "2i2", type: "rating", category: "Interacción y Visibilidad",   text: "¿Cómo calificarías tu dominio para identificar los puntos ciegos de los vehículos grandes y la importancia de las tecnologías de frenado autónomo?" },
      { id: "2i3", type: "rating", category: "Comportamiento",              text: "¿Cuál es tu grado de familiaridad con el concepto de 'ver y ser visto' y los riesgos reales de usar distractores como el celular mientras caminas?" },
      { id: "2i4", type: "rating", category: "Física del Riesgo",           text: "¿Qué tanta claridad tienes sobre la relación técnica entre la velocidad de impacto de un vehículo y tus probabilidades de supervivencia en un atropello?" },
      { id: "2i5", type: "rating", category: "Derechos y Equidad",          text: "¿Qué tanto conoces acerca de tus derechos de paso según la norma actual y el derecho a una movilidad libre de acoso y violencias en el espacio público?" },
      { id: "2i6", type: "rating", category: "Respuesta ante Siniestros",   text: "¿Qué tan preparado te sientes para actuar como testigo o afectado, garantizando el acceso a la atención médica inmediata y las rutas de denuncia?" },
    ],
    exit: [
      { id: "2e1", type: "rating", category: "Infraestructura y Urbanismo", text: "¿Cuál es tu nivel de claridad actual sobre cómo identificar y utilizar los pasos cebra y andenes accesibles como herramientas de protección vital?" },
      { id: "2e2", type: "rating", category: "Interacción y Visibilidad",   text: "¿Cómo calificarías tu capacidad para anticiparte a los puntos ciegos de buses y camiones para navegar de forma segura por cruces críticos?" },
      { id: "2e3", type: "rating", category: "Comportamiento",              text: "¿Qué tanta seguridad sientes ahora para tomar decisiones en la vía eliminando distractores y asegurando siempre el contacto visual con los conductores?" },
      { id: "2e4", type: "rating", category: "Física del Riesgo",           text: "¿Qué tanto dominio posees sobre por qué los 30 km/h son el límite vital en zonas residenciales para garantizar tu seguridad como peatón?" },
      { id: "2e5", type: "rating", category: "Derechos y Equidad",          text: "¿Cuál es tu grado de conciencia sobre tus derechos de prioridad en la vía y tu capacidad para activar las rutas de apoyo ante situaciones de acoso?" },
      { id: "2e6", type: "rating", category: "Respuesta ante Siniestros",   text: "¿Qué tan preparado te consideras para aplicar el protocolo PAS y liderar una respuesta correcta que proteja la vida y tus derechos legales?" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MÓDULO 3 — Movilidad Sostenible y Activa
  // Rating scale · no correct answers
  // ─────────────────────────────────────────────────────────────────────────
  3: {
    title: "Movilidad Sostenible y Activa",
    introInitial:
      "Antes de sumergirte en el Metaverso, queremos saber cómo percibes tu dominio sobre los pilares que protegen la vida de quienes eligen formas de transporte limpias y eficientes. Este ejercicio no busca respuestas correctas, sino una reflexión honesta sobre tu conocimiento actual. Al finalizar el módulo, compararemos estos resultados para que descubras cuánto has avanzado en tu camino hacia una micromovilidad experta y segura.",
    introExit:
      "¡Felicidades por completar este paso en el Metaverso de la Seguridad Vial! Ahora que has recorrido ciclorrutas técnicas y superado retos de convivencia en el entorno digital, es momento de medir el impacto de lo aprendido. Este ejercicio nos permitirá validar cómo tu visión de la movilidad activa se ha transformado y cuánta seguridad has ganado para liderar el cambio hacia una ciudad más limpia y segura.",
    scaleInitial: { minLabel: "No conozco el tema", maxLabel: "Lo conozco perfectamente" },
    scaleExit:    { minLabel: "Sigo con dudas",     maxLabel: "Me siento totalmente capaz" },
    initial: [
      { id: "3i1", type: "rating", category: "Infraestructura",   text: "¿Qué tanto sabes sobre el diseño de ciclorrutas y cómo el urbanismo táctico se utiliza para crear 'Ciclovías de vida' en entornos urbanos?" },
      { id: "3i2", type: "rating", category: "Vehículos y EPP",   text: "¿Cómo calificarías tu dominio sobre las especificaciones técnicas de bicicletas y patinetas, incluyendo el uso correcto de cascos certificados y reflectivos?" },
      { id: "3i3", type: "rating", category: "Convivencia",        text: "¿Cuál es tu grado de familiaridad con el Manual del Ciclista Urbano, especialmente en la señalización manual de maniobras y el respeto por el peatón?" },
      { id: "3i4", type: "rating", category: "Velocidad",          text: "¿Qué tanta claridad tienes sobre los límites de velocidad para vehículos de movilidad personal (VMP) y cómo el exceso de velocidad afecta tu estabilidad?" },
      { id: "3i5", type: "rating", category: "Normatividad",       text: "¿Qué tanto conoces acerca de tus derechos y deberes bajo la Ley 1811, como el derecho a ocupar el carril completo y las sanciones vigentes?" },
      { id: "3i6", type: "rating", category: "Atención Integral",  text: "¿Qué tan preparado te sientes para brindar primeros auxilios enfocados en traumas comunes por caídas en vehículos ligeros?" },
    ],
    exit: [
      { id: "3e1", type: "rating", category: "Infraestructura",   text: "¿Cómo calificarías tu capacidad para identificar zonas de tránsito calmado y utilizar la infraestructura de movilidad activa para tu máxima protección?" },
      { id: "3e2", type: "rating", category: "Vehículos y EPP",   text: "¿Qué tanta seguridad sientes ahora para realizar el mantenimiento preventivo de tu vehículo y seleccionar el equipo de protección adecuado?" },
      { id: "3e3", type: "rating", category: "Convivencia",        text: "¿Qué tanto dominio posees sobre las técnicas de señalización y la distancia de seguridad de 1.5 metros necesaria para convivir con vehículos motorizados?" },
      { id: "3e4", type: "rating", category: "Velocidad",          text: "¿Cuál es tu grado de conciencia sobre cómo moderar la velocidad en patinetas y bicicletas para garantizar un tiempo de reacción seguro ante imprevistos?" },
      { id: "3e5", type: "rating", category: "Normatividad",       text: "¿Qué tanta claridad tienes ahora sobre el marco legal que protege tu espacio en la vía y las prohibiciones que debes evitar para una movilidad responsable?" },
      { id: "3e6", type: "rating", category: "Atención Integral",  text: "¿Qué tan preparado te consideras para reaccionar ante una caída propia o ajena, aplicando protocolos que aseguren la integridad física del afectado?" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MÓDULO 4 — Seguridad Vial para Motociclistas
  // Rating scale · no correct answers
  // ─────────────────────────────────────────────────────────────────────────
  4: {
    title: "Seguridad Vial para Motociclistas",
    introInitial:
      "Antes de sumergirte en el Metaverso, queremos saber cómo percibes tu dominio sobre los pilares que protegen la vida de quienes conducen motocicleta. Este ejercicio no busca respuestas correctas, sino una reflexión honesta sobre tu conocimiento actual. Al finalizar el módulo, compararemos estos resultados para que descubras cuánto has avanzado en tu camino hacia una conducción experta y preventiva.",
    introExit:
      "¡Felicidades por completar este paso en el Metaverso de la Seguridad Vial! Ahora que has enfrentado los desafíos de la ruta digital y superado los retos del módulo, es momento de medir el impacto de lo aprendido en tu percepción técnica. Este ejercicio nos permitirá validar cómo tu visión del motociclismo se ha transformado y cuánta seguridad has ganado para dominar tu máquina y proteger tu vida.",
    scaleInitial: { minLabel: "No conozco el tema", maxLabel: "Lo conozco perfectamente" },
    scaleExit:    { minLabel: "Sigo con dudas",     maxLabel: "Me siento totalmente capaz" },
    initial: [
      { id: "4i1", type: "rating", category: "Infraestructura",          text: "¿Qué tanto sabes sobre cómo identificar riesgos críticos en la vía (pintura deslizante, huecos) y el propósito de las zonas de parada segura o Moto-boxes?" },
      { id: "4i2", type: "rating", category: "Vehículos y EPP",          text: "¿Cómo calificarías tu dominio para elegir un casco con certificación ECE 22.06 y realizar una revisión técnica preoperacional a tu moto?" },
      { id: "4i3", type: "rating", category: "Conducción Preventiva",    text: "¿Cuál es tu grado de familiaridad con las técnicas de mirada, el posicionamiento correcto en el carril y los peligros reales del zigzagueo?" },
      { id: "4i4", type: "rating", category: "Gestión de la Velocidad",  text: "¿Qué tanta claridad tienes sobre cómo la velocidad excesiva anula tu capacidad de maniobra y afecta la estabilidad física de la motocicleta?" },
      { id: "4i5", type: "rating", category: "Cumplimiento Normativo",   text: "¿Qué tanto conoces acerca de las actualizaciones de la Ley Julián Esteban (Ley 2251 de 2022) y el uso obligatorio de luces y reflectivos?" },
      { id: "4i6", type: "rating", category: "Atención Integral",        text: "¿Qué tan preparado te sientes para actuar ante una caída, conociendo qué acciones evitar para proteger la columna y gestionar el trauma en el sitio?" },
    ],
    exit: [
      { id: "4e1", type: "rating", category: "Infraestructura",          text: "¿Cómo calificarías tu capacidad para anticipar los riesgos del entorno vial y utilizar las zonas de urbanismo táctico para tu protección?" },
      { id: "4e2", type: "rating", category: "Vehículos y EPP",          text: "¿Qué tanta seguridad sientes ahora para seleccionar tu equipo de protección certificado y asegurar el estado mecánico óptimo de tu motocicleta?" },
      { id: "4e3", type: "rating", category: "Conducción Preventiva",    text: "¿Cuál es tu nivel de claridad actual sobre cómo posicionarte en la vía y mantener la distancia de seguridad para evitar conflictos con otros actores?" },
      { id: "4e4", type: "rating", category: "Gestión de la Velocidad",  text: "¿Qué tanto dominio posees sobre las leyes de la física que condicionan tu estabilidad y la importancia de moderar la velocidad para reaccionar a tiempo?" },
      { id: "4e5", type: "rating", category: "Cumplimiento Normativo",   text: "¿Qué tanto conocimiento tienes ahora sobre el marco legal vigente y tus responsabilidades técnicas para circular bajo la normativa colombiana?" },
      { id: "4e6", type: "rating", category: "Atención Integral",        text: "¿Qué tan preparado te consideras para liderar una respuesta inicial correcta ante un siniestro, evitando maniobras peligrosas que comprometan la salud de las víctimas?" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MÓDULO 5 — Conducción Segura en Automóviles
  // Rating scale · no correct answers
  // ─────────────────────────────────────────────────────────────────────────
  5: {
    title: "Conducción Segura en Automóviles",
    introInitial:
      "Antes de sumergirte en el Metaverso, queremos saber cómo percibes tu dominio sobre los pilares que protegen la vida al volante de un automóvil. Este ejercicio no busca respuestas correctas, sino una reflexión honesta sobre tu conocimiento actual. Al finalizar el módulo, compararemos estos resultados para que descubras cuánto has avanzado en tu camino hacia una conducción líder y responsable.",
    introExit:
      "¡Felicidades por completar este paso en el Metaverso de la Seguridad Vial! Ahora que has navegado entornos complejos y superado los retos de percepción al volante, es momento de medir el impacto de lo aprendido. Este ejercicio nos permitirá validar cómo tu visión de la conducción se ha transformado y cuánta seguridad has ganado para garantizar la integridad de todos en la vía.",
    scaleInitial: { minLabel: "No conozco el tema", maxLabel: "Lo conozco perfectamente" },
    scaleExit:    { minLabel: "Sigo con dudas",     maxLabel: "Me siento totalmente capaz" },
    initial: [
      { id: "5i1", type: "rating", category: "Infraestructura",        text: "¿Qué tanto sabes sobre cómo el diseño de la vía y el urbanismo táctico condicionan tu velocidad y facilitan la toma de decisiones seguras?" },
      { id: "5i2", type: "rating", category: "Vehículo y Garantías",   text: "¿Cómo calificarías tu capacidad para realizar una inspección técnica pre-operacional y diferenciar el funcionamiento de la seguridad activa (ABS/ESC) de la pasiva?" },
      { id: "5i3", type: "rating", category: "Percepción del Riesgo",  text: "¿Cuál es tu grado de familiaridad con las técnicas para gestionar la fatiga y mantener una 'distancia de seguridad' que funcione como un espacio de vida?" },
      { id: "5i4", type: "rating", category: "Física del Movimiento",  text: "¿Qué tanta claridad tienes sobre el 'Efecto Túnel' y cómo calcular técnicamente la distancia total que necesita tu carro para detenerse por completo?" },
      { id: "5i5", type: "rating", category: "Normatividad",            text: "¿Qué tanto conoces acerca de las actualizaciones de la Ley 2251 de 2022 y las prioridades de paso que debes respetar frente a peatones y ciclistas?" },
      { id: "5i6", type: "rating", category: "Atención Integral",      text: "¿Qué tan preparado te sientes para aplicar el protocolo PAS y comprender tus responsabilidades civiles y penales tras un siniestro vial?" },
    ],
    exit: [
      { id: "5e1", type: "rating", category: "Infraestructura",        text: "¿Cuál es tu nivel de claridad actual para interpretar la señalización del Manual 2024 y adaptar tu conducción a los entornos de tránsito calmado?" },
      { id: "5e2", type: "rating", category: "Vehículo y Garantías",   text: "¿Qué tanta seguridad sientes ahora para validar el estado de tu vehículo y reconocer el respaldo vital que te brindan el SOAT y la Revisión Técnico-Mecánica?" },
      { id: "5e3", type: "rating", category: "Percepción del Riesgo",  text: "¿Cómo calificarías tu capacidad para identificar peligros anticipadamente y eliminar distractores que comprometen tu reacción al conducir?" },
      { id: "5e4", type: "rating", category: "Física del Movimiento",  text: "¿Qué tanto dominio posees sobre el control de tu visión periférica y la gestión de la velocidad para evitar que la física del movimiento se convierta en un riesgo?" },
      { id: "5e5", type: "rating", category: "Normatividad",            text: "¿Qué tanta claridad tienes ahora sobre los límites vigentes y tu rol como conductor responsable en la convivencia con los actores más vulnerables?" },
      { id: "5e6", type: "rating", category: "Atención Integral",      text: "¿Qué tan preparado te consideras para liderar una respuesta inicial correcta ante una emergencia, protegiendo la vida y actuando bajo el marco legal vigente?" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MÓDULO 6 — Conducción de Vehículos Pesados Rígidos (C2)
  // Rating scale · no correct answers
  // ─────────────────────────────────────────────────────────────────────────
  6: {
    title: "Conducción de Vehículos Pesados Rígidos (C2)",
    introInitial:
      "Antes de sumergirte en el Metaverso, queremos conocer cómo percibes tu dominio sobre los pilares del transporte profesional de carga y pasajeros. Este ejercicio no busca respuestas técnicas correctas, sino una reflexión honesta sobre tu preparación actual para manejar vehículos de grandes dimensiones. Al finalizar el módulo, compararemos estos resultados para que descubras cuánto ha crecido tu criterio profesional.",
    introExit:
      "¡Felicidades por completar este último paso en el Metaverso de la Seguridad Vial! Tras navegar rutas urbanas complejas y gestionar los desafíos de un vehículo pesado, es momento de validar tu progreso. Este ejercicio nos permitirá confirmar cómo tu visión de la conducción profesional se ha transformado y cuánta seguridad has ganado para ser un líder responsable en las vías.",
    scaleInitial: { minLabel: "No conozco el tema", maxLabel: "Lo conozco perfectamente" },
    scaleExit:    { minLabel: "Sigo con dudas",     maxLabel: "Me siento totalmente capaz" },
    initial: [
      { id: "6i1", type: "rating", category: "Infraestructura y Espacio",   text: "¿Qué tanto sabes sobre los radios de giro de vehículos rígidos y cómo utilizar correctamente las zonas de carga o paraderos sin poner en riesgo a los demás?" },
      { id: "6i2", type: "rating", category: "Sistemas de Seguridad",       text: "¿Cómo calificarías tu dominio para inspeccionar frenos de aire y determinar si el estado de las llantas (nuevas o reencauchadas) es seguro para la operación?" },
      { id: "6i3", type: "rating", category: "Visibilidad Crítica",         text: "¿Cuál es tu grado de familiaridad con las 4 zonas de invisibilidad (puntos ciegos) que rodean tu vehículo y que pueden ocultar peatones o ciclistas?" },
      { id: "6i4", type: "rating", category: "Física de la Detención",      text: "¿Qué tanta claridad tienes sobre por qué un vehículo C2 requiere casi el doble de distancia que un automóvil para frenar totalmente a 50 km/h?" },
      { id: "6i5", type: "rating", category: "Gestión Normativa",           text: "¿Qué tanto conoces acerca de la documentación obligatoria para carga o pasajeros y tu rol en el cumplimiento del Plan Estratégico de Seguridad Vial (PESV)?" },
      { id: "6i6", type: "rating", category: "Protocolos de Emergencia",    text: "¿Qué tan preparado te sientes para activar la cadena de socorro y asegurar el área tras un incidente con un vehículo de gran tamaño?" },
    ],
    exit: [
      { id: "6e1", type: "rating", category: "Infraestructura y Espacio",   text: "¿Cuál es tu nivel de claridad actual para realizar maniobras de giro amplias garantizando siempre un espacio vital seguro para los actores más vulnerables?" },
      { id: "6e2", type: "rating", category: "Sistemas de Seguridad",       text: "¿Qué tanta seguridad sientes ahora para realizar una inspección preoperacional técnica que garantice que tu camión o bus es un vehículo seguro?" },
      { id: "6e3", type: "rating", category: "Visibilidad Crítica",         text: "¿Cómo calificarías tu capacidad para gestionar tus puntos ciegos y anticiparte a la presencia de otros actores viales en tus zonas de invisibilidad?" },
      { id: "6e4", type: "rating", category: "Física de la Detención",      text: "¿Qué tanto dominio posees sobre la distancia de seguimiento necesaria para compensar el peso de tu carga y garantizar una detención segura?" },
      { id: "6e5", type: "rating", category: "Gestión Normativa",           text: "¿Qué tanta claridad tienes ahora sobre la importancia legal de tus documentos y tu responsabilidad ética en la prestación del servicio público?" },
      { id: "6e6", type: "rating", category: "Protocolos de Emergencia",    text: "¿Qué tan preparado te consideras para liderar una respuesta inicial como primer respondiente, protegiendo la vida y asegurando la escena del evento?" },
    ],
  },
};

/** Reverse lookup: modulo number → courseKey */
export const MODULO_TO_COURSE_KEY = {
  1: "punto-cero-calma",
  2: "bosque-emociones",
  3: "jardin-mental",
  4: "lago-suenos",
  5: "modulo-5",
  6: "modulo-6",
};
