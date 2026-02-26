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
  // MÓDULO 1 — Fundamentos de la Seguridad Vial
  // ─────────────────────────────────────────────────────────────────────────
  1: {
    title: "Fundamentos de la Seguridad Vial",
    initial: [
      {
        id: "1i1",
        text: "¿Qué comprende el concepto de \"seguridad vial\"?",
        options: [
          { id: "a", text: "Solo el cumplimiento de los semáforos" },
          { id: "b", text: "Conjunto de medidas para prevenir accidentes y proteger la vida en las vías" },
          { id: "c", text: "La velocidad máxima permitida por la ley" },
          { id: "d", text: "El diseño técnico de carreteras y puentes" },
        ],
        correct: "b",
      },
      {
        id: "1i2",
        text: "¿Cuál es el principal factor causal de los accidentes de tránsito?",
        options: [
          { id: "a", text: "Estado deteriorado de las vías" },
          { id: "b", text: "Condiciones climáticas adversas" },
          { id: "c", text: "El comportamiento humano" },
          { id: "d", text: "Fallas mecánicas del vehículo" },
        ],
        correct: "c",
      },
      {
        id: "1i3",
        text: "¿Qué indica una señal de tránsito de fondo rojo?",
        options: [
          { id: "a", text: "Solo aplica de noche" },
          { id: "b", text: "Información turística" },
          { id: "c", text: "Prohibición u obligación" },
          { id: "d", text: "Precaución general" },
        ],
        correct: "c",
      },
      {
        id: "1i4",
        text: "¿A quiénes considera el tránsito como \"usuarios vulnerables\"?",
        options: [
          { id: "a", text: "Solo a menores de 12 años" },
          { id: "b", text: "Conductores de vehículos pesados" },
          { id: "c", text: "Peatones, ciclistas y motociclistas" },
          { id: "d", text: "Conductores de vehículos pequeños" },
        ],
        correct: "c",
      },
      {
        id: "1i5",
        text: "¿Qué es la \"distancia de seguridad\" entre vehículos en movimiento?",
        options: [
          { id: "a", text: "Siempre 5 metros fijos" },
          { id: "b", text: "El espacio necesario para frenar ante un imprevisto sin colisionar" },
          { id: "c", text: "La mitad del largo del vehículo delantero" },
          { id: "d", text: "Solo aplica en autopistas" },
        ],
        correct: "b",
      },
      {
        id: "1i6",
        text: "¿Cómo afecta el alcohol a quien conduce?",
        options: [
          { id: "a", text: "Mejora la concentración en dosis bajas" },
          { id: "b", text: "Solo afecta la visión nocturna" },
          { id: "c", text: "Disminuye el tiempo de reacción y altera el juicio" },
          { id: "d", text: "Solo es peligroso combinado con medicamentos" },
        ],
        correct: "c",
      },
      {
        id: "1i7",
        text: '¿Qué es un "punto ciego" para el conductor?',
        options: [
          { id: "a", text: "Una zona sin iluminación en la vía" },
          { id: "b", text: "Zona no visible desde los espejos o la posición normal del conductor" },
          { id: "c", text: "Un cruce peligroso sin señalización" },
          { id: "d", text: "El área directamente frente al vehículo" },
        ],
        correct: "b",
      },
      {
        id: "1i8",
        text: "¿Cuál es el propósito principal de la Ley 769 (Código Nacional de Tránsito)?",
        options: [
          { id: "a", text: "Regular solo el transporte de carga pesada" },
          { id: "b", text: "Regular la circulación de peatones, vehículos y animales en vías públicas" },
          { id: "c", text: "Establecer tarifas de parqueo en ciudades" },
          { id: "d", text: "Organizar el tránsito solo en zonas urbanas" },
        ],
        correct: "b",
      },
    ],
    exit: [
      {
        id: "1e1",
        text: "¿Cuáles son los tres factores del sistema vial más relacionados con los accidentes?",
        options: [
          { id: "a", text: "Temperatura, lluvia y niebla" },
          { id: "b", text: "Factor humano, vehículo e infraestructura vial" },
          { id: "c", text: "Velocidad, señalización y tipo de combustible" },
          { id: "d", text: "Edad del conductor, modelo del vehículo y hora del día" },
        ],
        correct: "b",
      },
      {
        id: "1e2",
        text: 'Según el enfoque "Visión Cero", ¿cuál es el objetivo?',
        options: [
          { id: "a", text: "Reducir el tráfico en un 50 %" },
          { id: "b", text: "Que ninguna muerte ni lesión grave sea aceptable en el tránsito" },
          { id: "c", text: "Eliminar vehículos de combustión interna" },
          { id: "d", text: "Construir más carreteras y autopistas" },
        ],
        correct: "b",
      },
      {
        id: "1e3",
        text: "¿Qué indica una línea amarilla continua en el centro de la calzada?",
        options: [
          { id: "a", text: "Se puede adelantar con precaución" },
          { id: "b", text: "Velocidad máxima de 60 km/h" },
          { id: "c", text: "Prohibido adelantar en ese tramo" },
          { id: "d", text: "Zona de parqueo permitido" },
        ],
        correct: "c",
      },
      {
        id: "1e4",
        text: "¿Qué medida reduce más la mortalidad en accidentes de tránsito?",
        options: [
          { id: "a", text: "Conducir solo durante el día" },
          { id: "b", text: "Usar cinturón de seguridad y casco homologado" },
          { id: "c", text: "Evitar las autopistas de alta velocidad" },
          { id: "d", text: "Circular solo en zonas de 30 km/h" },
        ],
        correct: "b",
      },
      {
        id: "1e5",
        text: "La fatiga al conducir...",
        options: [
          { id: "a", text: "Solo ocurre en viajes de más de cinco horas" },
          { id: "b", text: "No es peligrosa si se consume cafeína" },
          { id: "c", text: "Puede afectar el tiempo de reacción tanto como el alcohol" },
          { id: "d", text: "Solo afecta a conductores mayores de cincuenta años" },
        ],
        correct: "c",
      },
      {
        id: "1e6",
        text: "El uso del teléfono celular mientras se conduce...",
        options: [
          { id: "a", text: "Es aceptable mientras el vehículo está detenido en un semáforo" },
          { id: "b", text: "Solo es peligroso a velocidades superiores a 80 km/h" },
          { id: "c", text: "Multiplica el riesgo de accidente hasta cuatro veces" },
          { id: "d", text: "No afecta si se usa en modo manos libres" },
        ],
        correct: "c",
      },
      {
        id: "1e7",
        text: "¿Qué debe hacer un conductor al presenciar un accidente de tránsito?",
        options: [
          { id: "a", text: "Continuar para no generar congestión" },
          { id: "b", text: "Llamar a emergencias (123) y señalizar el área antes de actuar" },
          { id: "c", text: "Prestar ayuda de inmediato sin avisar a las autoridades" },
          { id: "d", text: "Esperar a que otros actúen primero" },
        ],
        correct: "b",
      },
      {
        id: "1e8",
        text: "¿Cuál de estas intervenciones es más efectiva para reducir accidentes en intersecciones?",
        options: [
          { id: "a", text: "Instalar cámaras de vigilancia" },
          { id: "b", text: "Implementar glorietas y semáforos con fases peatonales" },
          { id: "c", text: "Reducir el número de vehículos en circulación" },
          { id: "d", text: "Pintar las vías con colores llamativos" },
        ],
        correct: "b",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MÓDULO 2 — Movilidad y Seguridad Peatonal
  // ─────────────────────────────────────────────────────────────────────────
  2: {
    title: "Movilidad y Seguridad Peatonal",
    initial: [
      {
        id: "2i1",
        text: "¿Qué debe hacer un peatón antes de cruzar una vía?",
        options: [
          { id: "a", text: "Cruzar corriendo para reducir el tiempo de exposición" },
          { id: "b", text: "Mirar a ambos lados, asegurarse de que los vehículos paren y cruzar por la cebra" },
          { id: "c", text: "Cruzar cuando no vea ningún vehículo cercano" },
          { id: "d", text: "Esperar exactamente 30 segundos" },
        ],
        correct: "b",
      },
      {
        id: "2i2",
        text: "¿Cuál es la función principal del paso de cebra (paso peatonal) en la vía?",
        options: [
          { id: "a", text: "Delimitar el carril para buses" },
          { id: "b", text: "Indicar a los conductores donde deben estacionarse" },
          { id: "c", text: "Garantizar prioridad al peatón para cruzar la vía" },
          { id: "d", text: "Servir de referencia de velocidad" },
        ],
        correct: "c",
      },
      {
        id: "2i3",
        text: "¿Qué peligro representa caminar por la vía con auriculares a alto volumen?",
        options: [
          { id: "a", text: "Ninguno, si se camina por el andén" },
          { id: "b", text: "Reduce la capacidad de escuchar señales de alerta del entorno" },
          { id: "c", text: "Solo afecta la salud auditiva, no la seguridad" },
          { id: "d", text: "Es peligroso únicamente de noche" },
        ],
        correct: "b",
      },
      {
        id: "2i4",
        text: "¿Por qué se aconseja llevar ropa o accesorios reflectivos al caminar de noche?",
        options: [
          { id: "a", text: "Por moda o tendencia deportiva" },
          { id: "b", text: "Porque los conductores pueden ver al peatón desde mayor distancia" },
          { id: "c", text: "Para evitar el frío nocturno" },
          { id: "d", text: "Señala que el peatón es un ciclista" },
        ],
        correct: "b",
      },
      {
        id: "2i5",
        text: "En una vía sin andén, ¿por qué lado de la calzada debe caminar el peatón?",
        options: [
          { id: "a", text: "Por el lado derecho, en el mismo sentido del tráfico" },
          { id: "b", text: "Por el lado izquierdo, de frente al tráfico" },
          { id: "c", text: "Por el centro de la vía" },
          { id: "d", text: "Por cualquier lado, girando cada cierto tiempo" },
        ],
        correct: "b",
      },
      {
        id: "2i6",
        text: "¿Qué obligación tiene el conductor al encontrar a un peatón cruzando por la cebra?",
        options: [
          { id: "a", text: "Bocinar para que el peatón se apresure" },
          { id: "b", text: "Disminuir la velocidad y ceder el paso al peatón" },
          { id: "c", text: "Solo ceder el paso si hay semáforo" },
          { id: "d", text: "Continuar si el peatón no llegó aún al carril del vehículo" },
        ],
        correct: "b",
      },
      {
        id: "2i7",
        text: "¿Qué factor incrementa el riesgo de atropellamiento en zonas escolares?",
        options: [
          { id: "a", text: "Exceso de señalización" },
          { id: "b", text: "Alta velocidad vehicular y poca vigilancia en horario escolar" },
          { id: "c", text: "Presencia de semáforos peatonales" },
          { id: "d", text: "Vías con doble calzada" },
        ],
        correct: "b",
      },
      {
        id: "2i8",
        text: "¿Qué es un 'corredor seguro' o 'camino escolar seguro'?",
        options: [
          { id: "a", text: "Una autopista exclusiva para buses escolares" },
          { id: "b", text: "Ruta planificada con medidas especiales de seguridad para que niños lleguen al colegio" },
          { id: "c", text: "Un carril bidireccional en zonas residenciales" },
          { id: "d", text: "Un paso a desnivel exclusivo para peatones" },
        ],
        correct: "b",
      },
    ],
    exit: [
      {
        id: "2e1",
        text: "¿Cuáles son las tres principales causas de atropellamiento de peatones en Colombia?",
        options: [
          { id: "a", text: "Lluvia, neblina y fallas de alumbrado" },
          { id: "b", text: "Exceso de velocidad, imprudencia peatonal y conducción distraída" },
          { id: "c", text: "Falta de paso de cebras, vías sin andén y exceso de transporte público" },
          { id: "d", text: "Conductores jóvenes, vías estrechas y ausencia de semáforos" },
        ],
        correct: "b",
      },
      {
        id: "2e2",
        text: "Los 'calmantes de tráfico' (resaltos, chicanas) en zonas residenciales buscan principalmente...",
        options: [
          { id: "a", text: "Aumentar la recaudación de multas" },
          { id: "b", text: "Reducir la velocidad vehicular y mejorar la seguridad peatonal" },
          { id: "c", text: "Delimitar espacios de parqueo" },
          { id: "d", text: "Indicar inicio de zona comercial" },
        ],
        correct: "b",
      },
      {
        id: "2e3",
        text: "¿Qué diferencia al 'peatón vulnerable' del peatón general en términos de seguridad vial?",
        options: [
          { id: "a", text: "El peatón vulnerable usa siempre el celular" },
          { id: "b", text: "Son niños, adultos mayores o personas con discapacidad que necesitan mayor protección" },
          { id: "c", text: "Es quien cruza la calle sin usar la cebra" },
          { id: "d", text: "Es el peatón que no usa reflectivos" },
        ],
        correct: "b",
      },
      {
        id: "2e4",
        text: "¿Por qué se dice que el peatón debe 'hacer contacto visual' con el conductor antes de cruzar?",
        options: [
          { id: "a", text: "Para indicarle al conductor cuánto tarda en cruzar" },
          { id: "b", text: "Para verificar que el conductor lo ha visto y reducirá la velocidad" },
          { id: "c", text: "Porque es un requisito legal obligatorio" },
          { id: "d", text: "Solo aplica en vías de alta velocidad" },
        ],
        correct: "b",
      },
      {
        id: "2e5",
        text: "¿Qué implica la 'jerarquía de usuarios de la vía' en movilidad urbana?",
        options: [
          { id: "a", text: "Los vehículos pesados tienen siempre preferencia" },
          { id: "b", text: "Los usuarios más vulnerables (peatones y ciclistas) tienen prioridad de protección" },
          { id: "c", text: "Los conductores privados tienen más derechos que el transporte público" },
          { id: "d", text: "La prioridad la define el semáforo exclusivamente" },
        ],
        correct: "b",
      },
      {
        id: "2e6",
        text: "Una persona que cruza la vía fuera del paso peatonal o pone en riesgo al tráfico...",
        options: [
          { id: "a", text: "Actúa conforme a la ley si no hay cebra cercana" },
          { id: "b", text: "Comete una infracción de tránsito y asume mayor responsabilidad en caso de accidente" },
          { id: "c", text: "Tiene la misma protección legal que al usar la cebra" },
          { id: "d", text: "Solo es infracción si hay agentes de tránsito presentes" },
        ],
        correct: "b",
      },
      {
        id: "2e7",
        text: "¿Cuál es la velocidad máxima recomendada en zonas peatonales compartidas (zona 30)?",
        options: [
          { id: "a", text: "50 km/h" },
          { id: "b", text: "60 km/h" },
          { id: "c", text: "30 km/h" },
          { id: "d", text: "20 km/h solo de noche" },
        ],
        correct: "c",
      },
      {
        id: "2e8",
        text: "¿Cómo contribuye la 'infraestructura amigable al peatón' a la seguridad vial?",
        options: [
          { id: "a", text: "Reduce el número de vehículos en circulación" },
          { id: "b", text: "Crea andenes amplios, rampas y cruces seguros que separan físicamente a peatones y vehículos" },
          { id: "c", text: "Obliga a los conductores a estacionarse fuera de la ciudad" },
          { id: "d", text: "Solo beneficia a personas con discapacidad" },
        ],
        correct: "b",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MÓDULO 3 — Movilidad Sostenible y Activa
  // ─────────────────────────────────────────────────────────────────────────
  3: {
    title: "Movilidad Sostenible y Activa",
    initial: [
      {
        id: "3i1",
        text: "¿Qué se entiende por 'movilidad sostenible'?",
        options: [
          { id: "a", text: "Usar solo vehículos eléctricos" },
          { id: "b", text: "Sistemas de transporte que satisfacen necesidades actuales sin comprometer las de generaciones futuras" },
          { id: "c", text: "Reducir los viajes al mínimo posible" },
          { id: "d", text: "El uso exclusivo de transporte público masivo" },
        ],
        correct: "b",
      },
      {
        id: "3i2",
        text: "¿Cuál es uno de los principales beneficios del ciclismo urbano frente al automóvil?",
        options: [
          { id: "a", text: "Es más rápido en cualquier distancia" },
          { id: "b", text: "Reduce emisiones de CO₂ y congestión vehicular" },
          { id: "c", text: "No requiere ningún equipamiento de seguridad" },
          { id: "d", text: "Tiene prioridad legal absoluta en todas las vías" },
        ],
        correct: "b",
      },
      {
        id: "3i3",
        text: "¿Qué equipo de protección es obligatorio para el ciclista según el Código de Tránsito colombiano?",
        options: [
          { id: "a", text: "Chaleco reflectivo y guantes" },
          { id: "b", text: "Casco homologado" },
          { id: "c", text: "Rodilleras y coderas" },
          { id: "d", text: "Zapatos cerrados y casco" },
        ],
        correct: "b",
      },
      {
        id: "3i4",
        text: "¿Dónde debe transitar preferentemente un ciclista en una vía urbana?",
        options: [
          { id: "a", text: "Por el andén para mayor seguridad" },
          { id: "b", text: "Por la ciclovía o carril bici cuando existe; de lo contrario, por el extremo derecho de la calzada" },
          { id: "c", text: "Por el carril central" },
          { id: "d", text: "Por cualquier carril disponible" },
        ],
        correct: "b",
      },
      {
        id: "3i5",
        text: "¿Cuál de estas opciones representa transporte 'activo'?",
        options: [
          { id: "a", text: "Usar el carro eléctrico personal" },
          { id: "b", text: "Tomar el metro o el bus" },
          { id: "c", text: "Caminar o ir en bicicleta" },
          { id: "d", text: "Usar patineta eléctrica a motor" },
        ],
        correct: "c",
      },
      {
        id: "3i6",
        text: "¿Por qué es importante la señalización con el brazo para los ciclistas?",
        options: [
          { id: "a", text: "Es solo una costumbre deportiva sin valor legal" },
          { id: "b", text: "Indica a otros usuarios de la vía la dirección que tomará el ciclista" },
          { id: "c", text: "Solo aplica en ciclovías privadas" },
          { id: "d", text: "Evita que el ciclista pierda el equilibrio" },
        ],
        correct: "b",
      },
      {
        id: "3i7",
        text: "¿Qué es el 'efecto invernadero' relacionado con el transporte?",
        options: [
          { id: "a", text: "El calentamiento interior de los vehículos en verano" },
          { id: "b", text: "La acumulación de gases (CO₂, NOₓ) de los vehículos que retienen calor en la atmósfera" },
          { id: "c", text: "El diseño de vías con vegetación para reducir el calor" },
          { id: "d", text: "Un tipo de freno especial para vehículos ecológicos" },
        ],
        correct: "b",
      },
      {
        id: "3i8",
        text: "¿Cuál es una ventaja del sistema BRT (Bus Rapid Transit) frente al bus convencional?",
        options: [
          { id: "a", text: "No necesita conductor" },
          { id: "b", text: "Usa carriles exclusivos, mayor frecuencia y menor tiempo de viaje" },
          { id: "c", text: "Funciona solo de noche" },
          { id: "d", text: "No produce emisiones de CO₂" },
        ],
        correct: "b",
      },
    ],
    exit: [
      {
        id: "3e1",
        text: "¿Cómo contribuye la intermodalidad al transporte sostenible?",
        options: [
          { id: "a", text: "Elimina la necesidad de caminar en las ciudades" },
          { id: "b", text: "Permite combinar distintos modos de transporte reduciendo el uso del automóvil privado" },
          { id: "c", text: "Aumenta la cantidad de vehículos en circulación" },
          { id: "d", text: "Solo aplica en ciudades con metro" },
        ],
        correct: "b",
      },
      {
        id: "3e2",
        text: "Un ciclista que circula de noche sin luces...",
        options: [
          { id: "a", text: "Es una infracción solo si supera 20 km/h" },
          { id: "b", text: "Comete una infracción y aumenta exponencialmente el riesgo de accidente" },
          { id: "c", text: "Tiene la misma visibilidad que un vehículo" },
          { id: "d", text: "Solo debe llevar chaleco reflectivo" },
        ],
        correct: "b",
      },
      {
        id: "3e3",
        text: "¿Qué es el 'doorzone' o 'zona de puerta' para los ciclistas?",
        options: [
          { id: "a", text: "Un carril especial cerca de edificios" },
          { id: "b", text: "El espacio peligroso junto a vehículos estacionados donde puede abrirse una puerta de repente" },
          { id: "c", text: "La zona de ingreso a estacionamientos de bicicletas" },
          { id: "d", text: "El radio de giro de una ciclovía" },
        ],
        correct: "b",
      },
      {
        id: "3e4",
        text: "¿Qué ventajas ofrece la 'cicloinfraestructura' (ciclovías, bicicarriles) en las ciudades?",
        options: [
          { id: "a", text: "Aumenta el tráfico vehicular al reducir carriles para autos" },
          { id: "b", text: "Separa a los ciclistas del tráfico motorizado, reduciendo choques y fomentando el uso de la bici" },
          { id: "c", text: "Solo beneficia a ciclistas profesionales" },
          { id: "d", text: "Genera mayores costos sin beneficios medibles" },
        ],
        correct: "b",
      },
      {
        id: "3e5",
        text: "¿Qué es la 'huella de carbono' del transporte?",
        options: [
          { id: "a", text: "El daño físico que los vehículos pesados causan al pavimento" },
          { id: "b", text: "La cantidad total de gases de efecto invernadero generados por los desplazamientos de una persona" },
          { id: "c", text: "La mancha que deja el escape del motor en la vía" },
          { id: "d", text: "Un impuesto sobre el uso del vehículo particular" },
        ],
        correct: "b",
      },
      {
        id: "3e6",
        text: "¿Por qué deben los conductores mantener al menos 1 metro de distancia lateral al adelantar a un ciclista?",
        options: [
          { id: "a", text: "Para cumplir un requisito estético del carril" },
          { id: "b", text: "Porque el flujo de aire del vehículo puede desestabilizar al ciclista y provocar un accidente" },
          { id: "c", text: "Solo si el ciclista lleva pasajero" },
          { id: "d", text: "Es una recomendación sin respaldo legal" },
        ],
        correct: "b",
      },
      {
        id: "3e7",
        text: "¿Cuál es el principal obstáculo para aumentar el uso de la bicicleta en Colombia?",
        options: [
          { id: "a", text: "Los colombianos no saben montar en bicicleta" },
          { id: "b", text: "Falta de infraestructura segura, inseguridad ciudadana y cultura vial poco favorable al ciclista" },
          { id: "c", text: "El clima lluvioso permanente en todo el país" },
          { id: "d", text: "La prohibición de bicicletas en vías urbanas" },
        ],
        correct: "b",
      },
      {
        id: "3e8",
        text: "¿Qué diferencia al patinete o scooter eléctrico de un vehículo de motor según la ley colombiana?",
        options: [
          { id: "a", text: "Puede circular por autopistas sin restricción" },
          { id: "b", text: "Se clasifica como micromovilidad y tiene restricciones de velocidad y zonas de circulación" },
          { id: "c", text: "No requiere ningún tipo de protección" },
          { id: "d", text: "Solo puede usarse en propiedades privadas" },
        ],
        correct: "b",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MÓDULO 4 — Seguridad Vial para Motociclistas
  // ─────────────────────────────────────────────────────────────────────────
  4: {
    title: "Seguridad Vial para Motociclistas",
    initial: [
      {
        id: "4i1",
        text: "¿Por qué los motociclistas tienen mayor riesgo en el tránsito comparado con los ocupantes de automóvil?",
        options: [
          { id: "a", text: "Porque suelen conducir más rápido" },
          { id: "b", text: "Porque carecen de estructura protectora alrededor y son menos visibles" },
          { id: "c", text: "Porque no tienen seguro obligatorio" },
          { id: "d", text: "Porque sus frenos son menos eficientes" },
        ],
        correct: "b",
      },
      {
        id: "4i2",
        text: "¿Cuál es la función principal del casco homologado para el motociclista?",
        options: [
          { id: "a", text: "Reducir la resistencia al viento para mayor velocidad" },
          { id: "b", text: "Proteger el cráneo y el cerebro en caso de impacto" },
          { id: "c", text: "Es obligatorio solo en carreteras, no en ciudad" },
          { id: "d", text: "Mejorar la visibilidad del conductor" },
        ],
        correct: "b",
      },
      {
        id: "4i3",
        text: "¿Qué es el 'zigzagueo' entre vehículos y cuál es su riesgo?",
        options: [
          { id: "a", text: "Una técnica de frenado de emergencia; es segura" },
          { id: "b", text: "Maniobra de adelantamiento entre carriles; aumenta el riesgo de colisión por puntos ciegos" },
          { id: "c", text: "El movimiento lateral normal de la moto en curvas" },
          { id: "d", text: "Una forma legal de adelantar en trancones" },
        ],
        correct: "b",
      },
      {
        id: "4i4",
        text: "¿Qué equipo de protección adicional se recomienda al motociclista además del casco?",
        options: [
          { id: "a", text: "Solo guantes gruesos de invierno" },
          { id: "b", text: "Chaqueta reforzada, guantes, botas y pantalón con protecciones" },
          { id: "c", text: "Solo chaleco reflectivo" },
          { id: "d", text: "Lentes de sol oscuros homologados" },
        ],
        correct: "b",
      },
      {
        id: "4i5",
        text: "¿Por qué se aconseja que el motociclista evite los puntos ciegos de los vehículos grandes?",
        options: [
          { id: "a", text: "Para aprovechar el corriente de aire y ahorrar combustible" },
          { id: "b", text: "Porque los conductores de esos vehículos no pueden ver la moto en esas zonas" },
          { id: "c", text: "Para no generar turbulencia en el tráfico" },
          { id: "d", text: "Solo aplica en autopistas" },
        ],
        correct: "b",
      },
      {
        id: "4i6",
        text: "Al tomar una curva en moto, el motociclista debe...",
        options: [
          { id: "a", text: "Acelerar al inicio de la curva para mayor estabilidad" },
          { id: "b", text: "Reducir la velocidad antes de la curva y mantenerla o acelerar suavemente al salir" },
          { id: "c", text: "Frenar bruscamente dentro de la curva" },
          { id: "d", text: "Inclinar el manillar al máximo hacia el interior" },
        ],
        correct: "b",
      },
      {
        id: "4i7",
        text: "¿Qué velocidad máxima permite la ley colombiana para motocicletas en zonas urbanas?",
        options: [
          { id: "a", text: "60 km/h" },
          { id: "b", text: "80 km/h" },
          { id: "c", text: "50 km/h" },
          { id: "d", text: "Depende del departamento" },
        ],
        correct: "a",
      },
      {
        id: "4i8",
        text: "¿Qué riesgo implica conducir una moto bajo los efectos del alcohol?",
        options: [
          { id: "a", text: "Solo afecta la coordinación al estacionar" },
          { id: "b", text: "Reduce el tiempo de reacción y el equilibrio, aumentando drásticamente el riesgo de caída o colisión" },
          { id: "c", text: "Solo es peligroso a velocidades superiores a 60 km/h" },
          { id: "d", text: "Mejora la confianza y no afecta la seguridad a dosis bajas" },
        ],
        correct: "b",
      },
    ],
    exit: [
      {
        id: "4e1",
        text: "¿Por qué se recomienda que el motociclista use ropa de colores llamativos o chalecos reflectivos?",
        options: [
          { id: "a", text: "Por reglamento deportivo de competencia" },
          { id: "b", text: "Para aumentar su visibilidad ante otros conductores y reducir el riesgo de colisión" },
          { id: "c", text: "Para diferenciarlos de los ciclistas" },
          { id: "d", text: "Solo necesario en carreteras, no en ciudad" },
        ],
        correct: "b",
      },
      {
        id: "4e2",
        text: "¿Cuál es la técnica correcta de frenado de emergencia en motocicleta?",
        options: [
          { id: "a", text: "Aplicar solo el freno trasero a fondo" },
          { id: "b", text: "Aplicar ambos frenos (delantero y trasero) progresivamente para evitar bloquear las ruedas" },
          { id: "c", text: "Soltar el acelerador y esperar que la moto desacelere sola" },
          { id: "d", text: "Aplicar solo el freno delantero a fondo" },
        ],
        correct: "b",
      },
      {
        id: "4e3",
        text: "'Ver y ser visto' es un principio clave para el motociclista. ¿Qué implica prácticamente?",
        options: [
          { id: "a", text: "Usar espejuelos oscuros para ver mejor" },
          { id: "b", text: "Posicionarse en la vía donde sea visible para otros conductores y escanear el entorno constantemente" },
          { id: "c", text: "Encender la bocina cada 30 segundos" },
          { id: "d", text: "Llevar siempre un pasajero" },
        ],
        correct: "b",
      },
      {
        id: "4e4",
        text: "¿Qué es el 'contravolante' y cuándo se aplica en una moto?",
        options: [
          { id: "a", text: "Girar el manillar en sentido contrario al destino para iniciar un giro a alta velocidad" },
          { id: "b", text: "Una técnica de frenado de emergencia" },
          { id: "c", text: "La posición de las manos al estacionar" },
          { id: "d", text: "Un tipo de manillar para motos de pista" },
        ],
        correct: "a",
      },
      {
        id: "4e5",
        text: "¿Qué consecuencias tiene el uso de un casco no homologado en caso de accidente?",
        options: [
          { id: "a", text: "Ninguna, todos los cascos ofrecen igual protección" },
          { id: "b", text: "Menor protección en impacto, mayor riesgo de lesión grave y puede invalidar la póliza de seguro" },
          { id: "c", text: "Solo genera una multa menor de tránsito" },
          { id: "d", text: "Es peligroso solo si el accidente ocurre a más de 80 km/h" },
        ],
        correct: "b",
      },
      {
        id: "4e6",
        text: "¿Por qué debe el motociclista revisar la presión de los neumáticos regularmente?",
        options: [
          { id: "a", text: "Para mejorar el consumo de combustible únicamente" },
          { id: "b", text: "Porque una presión incorrecta afecta la estabilidad, el manejo y la distancia de frenado" },
          { id: "c", text: "Solo importa en viajes de más de 100 km" },
          { id: "d", text: "Solo afecta al neumático trasero" },
        ],
        correct: "b",
      },
      {
        id: "4e7",
        text: "Un motociclista que adelanta en doble línea continua...",
        options: [
          { id: "a", text: "Puede hacerlo si la vía está despejada" },
          { id: "b", text: "Comete una infracción grave y aumenta el riesgo de colisión frontal" },
          { id: "c", text: "Solo es infracción en carreteras nacionales" },
          { id: "d", text: "Tiene autorización si está en emergencia" },
        ],
        correct: "b",
      },
      {
        id: "4e8",
        text: "¿Cuál es la distancia de frenado estimada de una moto a 80 km/h en condición seca (sin ABS)?",
        options: [
          { id: "a", text: "Aproximadamente 10 metros" },
          { id: "b", text: "Aproximadamente 40–50 metros" },
          { id: "c", text: "Igual que un automóvil moderno" },
          { id: "d", text: "Depende solo del modelo de la moto" },
        ],
        correct: "b",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MÓDULO 5 — Conducción Segura en Automóviles
  // ─────────────────────────────────────────────────────────────────────────
  5: {
    title: "Conducción Segura en Automóviles",
    initial: [
      {
        id: "5i1",
        text: "¿Qué es la 'posición de conducción segura' en un automóvil?",
        options: [
          { id: "a", text: "Reclinarse lo máximo posible para mayor comodidad" },
          { id: "b", text: "Espalda erguida, brazos ligeramente flexionados, pies alcanzando los pedales sin esfuerzo" },
          { id: "c", text: "Sentarse muy cerca del volante para reaccionar mejor" },
          { id: "d", text: "Inclinar el asiento hacia adelante a 90 grados" },
        ],
        correct: "b",
      },
      {
        id: "5i2",
        text: "¿Cuándo debe usarse el cinturón de seguridad dentro del vehículo?",
        options: [
          { id: "a", text: "Solo en viajes de más de 30 km" },
          { id: "b", text: "Siempre, incluso en trayectos cortos, tanto conductor como pasajeros" },
          { id: "c", text: "Solo el conductor, no los pasajeros traseros" },
          { id: "d", text: "Solo en autopistas" },
        ],
        correct: "b",
      },
      {
        id: "5i3",
        text: "¿Qué significa la señal de tránsito de un triángulo con exclamación ('!')?",
        options: [
          { id: "a", text: "Prohibición de adelantar" },
          { id: "b", text: "Advertencia de peligro general próximo" },
          { id: "c", text: "Zona de recreación" },
          { id: "d", text: "Fin de zona urbana" },
        ],
        correct: "b",
      },
      {
        id: "5i4",
        text: "¿Cuál es la velocidad máxima en carreteras primarias de Colombia para vehículos livianos?",
        options: [
          { id: "a", text: "80 km/h" },
          { id: "b", text: "100 km/h" },
          { id: "c", text: "120 km/h" },
          { id: "d", text: "Depende del tipo de vía y señalización" },
        ],
        correct: "c",
      },
      {
        id: "5i5",
        text: "¿Para qué sirve el sistema ABS (Antilock Braking System) en un automóvil?",
        options: [
          { id: "a", text: "Reducir el consumo de combustible en frenadas" },
          { id: "b", text: "Evitar que las ruedas se bloqueen durante el frenado, manteniendo el control de dirección" },
          { id: "c", text: "Aumentar la potencia del motor al frenar" },
          { id: "d", text: "Solo funciona en superficies mojadas" },
        ],
        correct: "b",
      },
      {
        id: "5i6",
        text: "¿Qué se debe verificar antes de realizar un largo viaje en automóvil?",
        options: [
          { id: "a", text: "Solo el nivel de combustible" },
          { id: "b", text: "Combustible, frenos, neumáticos, luces y fluidos del motor" },
          { id: "c", text: "Solo la presión de las ruedas" },
          { id: "d", text: "El funcionamiento del aire acondicionado" },
        ],
        correct: "b",
      },
      {
        id: "5i7",
        text: "¿Qué efecto tiene conducir con neumáticos desgastados (sin dibujo)?",
        options: [
          { id: "a", text: "Mejora la tracción en vías secas" },
          { id: "b", text: "Aumenta la distancia de frenado y el riesgo de aquaplaning en vía mojada" },
          { id: "c", text: "Solo afecta en terrenos de tierra" },
          { id: "d", text: "No tiene efecto significativo a menos de 80 km/h" },
        ],
        correct: "b",
      },
      {
        id: "5i8",
        text: "¿Cuál es la regla general para usar las luces altas (largas) en conducción nocturna?",
        options: [
          { id: "a", text: "Usarlas siempre para ver mejor" },
          { id: "b", text: "Usarlas en vías oscuras sin tráfico contrario ni vehículos delante; bajarlas al ver otro vehículo" },
          { id: "c", text: "Solo se usan en lluvia intensa" },
          { id: "d", text: "No están permitidas en vías urbanas" },
        ],
        correct: "b",
      },
    ],
    exit: [
      {
        id: "5e1",
        text: "¿Qué es el 'aquaplaning' y cómo se debe actuar si ocurre?",
        options: [
          { id: "a", text: "Recalentamiento del motor; detenerse en la berma" },
          { id: "b", text: "Pérdida de contacto de las ruedas con el pavimento por exceso de agua; soltar el acelerador suavemente y no frenar bruscamente" },
          { id: "c", text: "Un fallo del ABS; pisar el freno a fondo" },
          { id: "d", text: "Vibración del volante por desequilibrio de ruedas" },
        ],
        correct: "b",
      },
      {
        id: "5e2",
        text: "¿Qué implica la 'conducción defensiva'?",
        options: [
          { id: "a", text: "Conducir lentamente en todo momento" },
          { id: "b", text: "Anticipar posibles peligros, respetar las normas y mantener margen de seguridad para evitar accidentes" },
          { id: "c", text: "Evitar autopistas y vías rápidas" },
          { id: "d", text: "Ceder siempre el paso independientemente de la señalización" },
        ],
        correct: "b",
      },
      {
        id: "5e3",
        text: "¿Cómo afecta la carga excesiva en el maletero a la conducción del vehículo?",
        options: [
          { id: "a", text: "Mejora la adherencia en curvas" },
          { id: "b", text: "Altera la estabilidad, aumenta la distancia de frenado y puede dañar la dirección" },
          { id: "c", text: "Solo afecta en subidas y bajadas pronunciadas" },
          { id: "d", text: "No tiene ningún efecto si el vehículo es 4×4" },
        ],
        correct: "b",
      },
      {
        id: "5e4",
        text: "¿Cuál es la distancia de seguridad recomendada con el vehículo de adelante a 100 km/h?",
        options: [
          { id: "a", text: "Al menos 30 metros" },
          { id: "b", text: "Al menos 50–80 metros (equivalente a 2‑3 segundos de reacción)" },
          { id: "c", text: "10 metros es suficiente" },
          { id: "d", text: "Un largo de vehículo por cada 10 km/h de velocidad" },
        ],
        correct: "b",
      },
      {
        id: "5e5",
        text: "Un conductor que sospecha sentir sueño durante el viaje debe...",
        options: [
          { id: "a", text: "Bajar la ventanilla y continuar conduciendo" },
          { id: "b", text: "Detenerse en un lugar seguro y descansar al menos 20 minutos" },
          { id: "c", text: "Tomar café y continuar sin parar" },
          { id: "d", text: "Poner música alta para mantenerse despierto" },
        ],
        correct: "b",
      },
      {
        id: "5e6",
        text: "¿Cuál es la consecuencia de no sujetar correctamente la silla de bebé en el automóvil?",
        options: [
          { id: "a", text: "Solo es una multa administrativa sin consecuencias físicas" },
          { id: "b", text: "En caso de accidente, el niño puede salir proyectado causando lesiones graves o la muerte" },
          { id: "c", text: "No tiene consecuencias si el niño lleva cinturón" },
          { id: "d", text: "Solo aplica en viajes de más de 50 km" },
        ],
        correct: "b",
      },
      {
        id: "5e7",
        text: "¿Cuándo es correcto usar la bocina en Colombia según el Código de Tránsito?",
        options: [
          { id: "a", text: "Para indicar que se va a adelantar siempre" },
          { id: "b", text: "Solo en situaciones de peligro inminente para alertar a otros usuarios" },
          { id: "c", text: "Al llegar a intersecciones sin semáforo" },
          { id: "d", text: "Para saludar a conocidos en la vía" },
        ],
        correct: "b",
      },
      {
        id: "5e8",
        text: "¿Qué deben hacer los ocupantes de un vehículo detenido en la berma por avería?",
        options: [
          { id: "a", text: "Permanecer dentro del vehículo con las luces de emergencia apagadas" },
          { id: "b", text: "Salir por el lado seguro, alejarse de la calzada, encender los triángulos reflectivos y llamar auxilio" },
          { id: "c", text: "Dejar el vehículo y caminar por la berma hasta el próximo peaje" },
          { id: "d", text: "Esperar dentro sin señalizar para no alertar a ladrones" },
        ],
        correct: "b",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MÓDULO 6 — Conducción de Vehículos Pesados
  // ─────────────────────────────────────────────────────────────────────────
  6: {
    title: "Conducción de Vehículos Pesados",
    initial: [
      {
        id: "6i1",
        text: "¿Cuál es la principal diferencia de seguridad entre conducir un vehículo pesado y uno liviano?",
        options: [
          { id: "a", text: "Los pesados tienen mejor sistema de frenos" },
          { id: "b", text: "Mayor masa implica mayor distancia de frenado, radios de giro amplios y puntos ciegos más grandes" },
          { id: "c", text: "Los conductores de pesados no necesitan licencia especial" },
          { id: "d", text: "Son más seguros porque van más despacio" },
        ],
        correct: "b",
      },
      {
        id: "6i2",
        text: "¿Qué licencia de conducción se requiere en Colombia para operar un camión de carga de más de 3 toneladas?",
        options: [
          { id: "a", text: "Categoría B2" },
          { id: "b", text: "Categoría C2" },
          { id: "c", text: "Categoría C3" },
          { id: "d", text: "Categoría A2" },
        ],
        correct: "c",
      },
      {
        id: "6i3",
        text: "¿Qué son los 'puntos ciegos' (blind spots) en un camión grande?",
        options: [
          { id: "a", text: "Zonas de la vía sin señalización" },
          { id: "b", text: "Áreas alrededor del camión donde el conductor no puede ver otros vehículos" },
          { id: "c", text: "Las luces traseras inoperantes" },
          { id: "d", text: "Las secciones de la carretera con poca iluminación" },
        ],
        correct: "b",
      },
      {
        id: "6i4",
        text: "¿Por qué los frenos de un camión cargado necesitan mayor distancia para detener el vehículo?",
        options: [
          { id: "a", text: "Porque los frenos de camión son menos potentes" },
          { id: "b", text: "Porque la maior masa genera mayor inercia, requiriendo más fuerza y distancia para frenarlo" },
          { id: "c", text: "Porque los camiones no tienen ABS" },
          { id: "d", text: "Porque la velocidad mínima de los camiones es mayor" },
        ],
        correct: "b",
      },
      {
        id: "6i5",
        text: "¿Qué reglamentación regula el peso máximo de carga en camiones en Colombia?",
        options: [
          { id: "a", text: "Decreto 1609" },
          { id: "b", text: "Resolución 4100 del Ministerio de Transporte" },
          { id: "c", text: "Código Nacional de Tránsito (Ley 769)" },
          { id: "d", text: "Resolución 777 del Ministerio de Salud" },
        ],
        correct: "b",
      },
      {
        id: "6i6",
        text: "¿Qué es el principio de 'barrido' o 'off-tracking' en los camiones con remolque?",
        options: [
          { id: "a", text: "Una técnica de limpieza del parabrisas" },
          { id: "b", text: "El recorrido distinto de las ruedas traseras del remolque respecto a las delanteras al girar" },
          { id: "c", text: "El movimiento del camión en terrenos irregulares" },
          { id: "d", text: "Un sistema de seguridad para el cargamento" },
        ],
        correct: "b",
      },
      {
        id: "6i7",
        text: "¿Qué riesgos implica la falta de revisión del sistema de frenos antes de iniciar la ruta?",
        options: [
          { id: "a", text: "Solo genera gasto adicional en mantenimiento" },
          { id: "b", text: "Puede provocar fallas de freno en ruta, causando accidentes graves con múltiples víctimas" },
          { id: "c", text: "Aumenta el consumo de combustible únicamente" },
          { id: "d", text: "Solo es relevante para viajes de más de 500 km" },
        ],
        correct: "b",
      },
      {
        id: "6i8",
        text: "¿Por qué los conductores de vehículos pesados deben respetar las restricciones de circulación horaria en ciudades?",
        options: [
          { id: "a", text: "Para pagar menos peajes" },
          { id: "b", text: "Para reducir la congestión, proteger la infraestructura vial y mejorar la convivencia urbana" },
          { id: "c", text: "Solo para evitar multas de tránsito" },
          { id: "d", text: "Porque sus motores no funcionan bien en horas pico" },
        ],
        correct: "b",
      },
    ],
    exit: [
      {
        id: "6e1",
        text: "¿Qué es el 'efecto acordeón' en una caravana de vehículos pesados?",
        options: [
          { id: "a", text: "Un sistema de unión entre cabezote y remolque" },
          { id: "b", text: "Las variaciones de velocidad que se amplifican hacia la parte trasera de la caravana, aumentando el riesgo de colisión" },
          { id: "c", text: "La oscilación lateral del remolque a alta velocidad" },
          { id: "d", text: "El sonido de los frenos neumáticos" },
        ],
        correct: "b",
      },
      {
        id: "6e2",
        text: "¿Cómo se debe actuar ante el fenómeno de 'aleteo del remolque' (trailer swaying)?",
        options: [
          { id: "a", text: "Acelerar para estabilizar el remolque" },
          { id: "b", text: "Reducir gradualmente la velocidad sin frenar bruscamente, mantener manos firmes en el volante" },
          { id: "c", text: "Frenar a fondo y girar el volante" },
          { id: "d", text: "Activar el freno de mano" },
        ],
        correct: "b",
      },
      {
        id: "6e3",
        text: "¿Cuáles son los factores más críticos en la prevención de accidentes en el transporte de carga?",
        options: [
          { id: "a", text: "Color del vehículo y tipo de cargamento" },
          { id: "b", text: "Mantenimiento del vehículo, aseguramiento de la carga, descanso del conductor y respeto de límites" },
          { id: "c", text: "Experiencia del conductor por encima de todo" },
          { id: "d", text: "La marca del camión y año de fabricación" },
        ],
        correct: "b",
      },
      {
        id: "6e4",
        text: "¿Qué implica el 'aseguramiento de carga' reglamentario?",
        options: [
          { id: "a", text: "Contratar un seguro de mercancías antes del viaje" },
          { id: "b", text: "Usar elementos de sujeción (correas, cadenas) que impidan que la carga se desplace o caiga durante el transporte" },
          { id: "c", text: "Cubrir la carga con una lona únicamente" },
          { id: "d", text: "Solo aplica para carga peligrosa o inflamable" },
        ],
        correct: "b",
      },
      {
        id: "6e5",
        text: "¿Cuántas horas continuas puede conducir un conductor de camión de larga distancia en Colombia antes de tomar descanso?",
        options: [
          { id: "a", text: "12 horas continuas" },
          { id: "b", text: "5 horas; pausa mínima de 30 minutos (Resolución 315)" },
          { id: "c", text: "8 horas máximo sin pausa" },
          { id: "d", text: "Hasta que el conductor se sienta cansado" },
        ],
        correct: "b",
      },
      {
        id: "6e6",
        text: "¿Qué diferencia el transporte de mercancías peligrosas del transporte convencional?",
        options: [
          { id: "a", text: "Solo requiere un seguro adicional" },
          { id: "b", text: "Exige señalización especial (rombos NFPA), capacitación específica, rutas autorizadas y plan de emergencia" },
          { id: "c", text: "Puede realizarse con la licencia C2 estándar" },
          { id: "d", text: "Solo aplica para sustancias explosivas" },
        ],
        correct: "b",
      },
      {
        id: "6e7",
        text: "¿Cómo se debe gestionar correctamente los frenos de un camión cargado al bajar una pendiente larga?",
        options: [
          { id: "a", text: "Pisar el freno continuamente para mantener la velocidad constante" },
          { id: "b", text: "Usar el freno motor o retardador y aplicar el freno de servicio intervalos cortos para evitar sobrecalentamiento" },
          { id: "c", text: "Poner el vehículo en punto muerto para ahorrar combustible" },
          { id: "d", text: "Solo usar el freno de mano de emergencia" },
        ],
        correct: "b",
      },
      {
        id: "6e8",
        text: "¿Qué significa la señal de rombo naranja con código UN en un vehículo de carga?",
        options: [
          { id: "a", text: "El vehículo transporta carga sobredimensionada" },
          { id: "b", text: "Identifica el tipo de mercancía peligrosa y el número ONU del producto transportado" },
          { id: "c", text: "Indica que el camión es de una empresa multinacional" },
          { id: "d", text: "Avisa que el vehículo tiene frenos deficientes" },
        ],
        correct: "b",
      },
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
