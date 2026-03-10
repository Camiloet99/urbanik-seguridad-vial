/**
 * Static metadata for each course/module.
 *
 * resources[] always has exactly 4 PDFs (pdf1–pdf4).
 */

import card1 from "@/assets/courses/card-1.png";
import card2 from "@/assets/courses/card-2.jpg";
import card3 from "@/assets/courses/card-3.jpg";
import card4 from "@/assets/courses/card-4.jpg";

export const COURSE_DATA = {
  "fundamentos-seguridad-vial": {
    title: "Fundamentos de Seguridad Vial",
    subtitle: "Conoce el sistema vial y tus responsabilidades como actor vial",
    bgImage: card1,
    locked: false,
    shareId: "share-658d10c5-cdbd-4a26-9477-e60f9768a2f2",
    introPdf: "modulo-1/intro.pdf",
    resources: [
      {
        id: "pcc-pdf-1",
        label: "Plan Nacional de Seguridad Vial",
        fileName: "modulo-1/1_Plan_Nacional_Seguridad_Vial_PNSV.pdf",
      },
      {
        id: "pcc-pdf-2",
        label: "Manual de Señalización Vial",
        fileName: "modulo-1/2_Manual_de_Senalizacion_Vial.pdf",
      },
      {
        id: "pcc-pdf-3",
        label: "ABC Víctimas en Accidentes de Tránsito",
        fileName: "modulo-1/3_ABC_Victimas_en_accidentes_de_transito.pdf",
      },
      {
        id: "pcc-pdf-4",
        label: "Ruta de Atención a Víctimas",
        fileName: "modulo-1/4_Ruta_Atencion_Victimas.pdf",
      },
    ],
  },

  "movilidad-seguridad-peatonal": {
    title: "Movilidad y Seguridad Peatonal",
    subtitle: "Protege tu vida y la de los demás en la vía pública",
    bgImage: card2,
    locked: false,
    shareId: "",
    introPdf: "modulo-2/intro.pdf",
    resources: [
      {
        id: "be-pdf-1",
        label: "Guía de Urbanismo Táctico",
        fileName: "modulo-2/1_Guia_de_Urbanismo_Tactico.pdf",
      },
      {
        id: "be-pdf-2",
        label: "Orientaciones Seguridad Vial en Pasos Peatonales",
        fileName: "modulo-2/2_Orientaciones_Seguridad_Vial_Pasos_Peatonales.pdf",
      },
      {
        id: "be-pdf-3",
        label: "La Mujer en el Espacio Público",
        fileName: "modulo-2/3_la_mujer_en_el_espacio_publico.pdf",
      },
      {
        id: "be-pdf-4",
        label: "Prelación del Peatón en la Vía",
        fileName: "modulo-2/4_prelacion_peaton_en_la_via.pdf",
      },
    ],
  },

  "movilidad-sostenible-activa": {
    title: "Movilidad Sostenible y Activa",
    subtitle: "Bicicletas, patinetas y micromovilidad segura",
    bgImage: card3,
    locked: false,
    shareId: "",
    introPdf: "modulo-3/intro.pdf",
    resources: [
      {
        id: "jm-pdf-1",
        label: "Manual de Señalización Vial",
        fileName: "modulo-3/1_Manual_de_Senalizacion_Vial.pdf",
      },
      {
        id: "jm-pdf-2",
        label: "Manual de Seguridad Vial para Ciclistas",
        fileName: "modulo-3/2_Manual_Seguridad_Vial_Ciclista.pdf",
      },
      {
        id: "jm-pdf-3",
        label: "Guía de Protección a Ciclistas",
        fileName: "modulo-3/3_Guia_de_Proteccion_a_Ciclistas.pdf",
      },
      {
        id: "jm-pdf-4",
        label: "Seguridad Vial y Discapacidad",
        fileName: "modulo-3/4_Seguridad_vial_y_discapacidad.pdf",
      },
    ],
  },

  "seguridad-vial-motociclistas": {
    title: "Seguridad Vial para Motociclistas",
    subtitle: "Domina la vía y protege tu vida sobre dos ruedas",
    bgImage: card4,
    locked: false,
    shareId: "",
    introPdf: "modulo-4/intro.pdf",
    resources: [
      {
        id: "ls-pdf-1",
        label: "Manual de Señalización Vial",
        fileName: "modulo-4/1_Manual_de_Senalizacion_Vial.pdf",
      },
      {
        id: "ls-pdf-2",
        label: "Guía de Protección al Motociclista",
        fileName: "modulo-4/2_Guia_de_Proteccion_al_Motociclista.pdf",
      },
      {
        id: "ls-pdf-3",
        label: "Medidas de Alistamiento y EPP",
        fileName: "modulo-4/3_medidas_de_alistamiento_EPP_compressed.pdf",
      },
      {
        id: "ls-pdf-4",
        label: "Protocolo Prácticas Seguras Motociclistas",
        fileName: "modulo-4/4_Protocolo_Practicas_Seguras_Motociclistas.pdf",
      },
    ],
  },

  "conduccion-segura-automoviles": {
    title: "Conducción Segura en Automóviles",
    subtitle: "Conducción segura y primeros auxilios en la vía",
    bgImage: card4,
    locked: false,
    shareId: "",
    introPdf: "modulo-5/intro.pdf",
    resources: [
      {
        id: "m5-pdf-1",
        label: "Manual de Señalización Vial",
        fileName: "modulo-5/1_Manual_de_Senalizacion_Vial.pdf",
      },
      {
        id: "m5-pdf-2",
        label: "Guía de Control en Velocidad",
        fileName: "modulo-5/2_Guia_de_Control_en_Velocidad.pdf",
      },
      {
        id: "m5-pdf-3",
        label: "Guía Práctica de Sensibilización en Velocidad",
        fileName: "modulo-5/3_Guia_Practica_de_Sensibilizacion_en_Velocidad.pdf",
      },
      {
        id: "m5-pdf-4",
        label: "Distancia de Frenado",
        fileName: "modulo-5/4_Distancia_de_Frenado.pdf",
      },
    ],
  },

  "vehiculos-carga-operacion-segura": {
    title: "Vehículos de Carga y Operación Segura",
    subtitle: "Conducción profesional de vehículos pesados rígidos (C2)",
    bgImage: card4,
    locked: false,
    shareId: "",
    introPdf: "modulo-6/intro.pdf",
    resources: [
      {
        id: "m6-pdf-1",
        label: "Plan Nacional de Seguridad Vial",
        fileName: "modulo-6/1_Plan_Nacional_Seguridad_Vial_PNSV.pdf",
      },
      {
        id: "m6-pdf-2",
        label: "Manual de Señalización Vial",
        fileName: "modulo-6/2_Manual_de_Senalizacion_Vial.pdf",
      },
      {
        id: "m6-pdf-3",
        label: "Guía de Conducción Segura en Vías Multicarril",
        fileName: "modulo-6/3_Guia_de_Conduccion_Segura_de_Vehiculos_de_Carga_en_Vias_Multicarril.pdf",
      },
      {
        id: "m6-pdf-4",
        label: "Guía de Revisión Segura",
        fileName: "modulo-6/4_Guia_Revision_Segura.pdf",
      },
    ],
  },
};