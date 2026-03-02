/**
 * Static metadata for each course/module.
 *
 * resources[] always has exactly 4 PDFs (pdf1–pdf4).
 * All four currently point to the same file; replace fileName on each
 * entry once you have the real documents.
 */

import card1 from "@/assets/courses/card-1.png";
import card2 from "@/assets/courses/card-2.jpg";
import card3 from "@/assets/courses/card-3.jpg";
import card4 from "@/assets/courses/card-4.jpg";

export const COURSE_DATA = {
  "punto-cero-calma": {
    title: "Punto Cero CALMA",
    subtitle: "Donde inicia tu viaje interior",
    bgImage: card1,
    locked: false,
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
  "bosque-emociones": {
    title: "Bosque de las Emociones",
    subtitle: "Reconectate con tu interior",
    bgImage: card2,
    locked: false,
    resources: [
      { id: "be-pdf-1", label: "Documento 1", fileName: "seguridad-vial.pdf" },
      { id: "be-pdf-2", label: "Documento 2", fileName: "seguridad-vial.pdf" },
      { id: "be-pdf-3", label: "Documento 3", fileName: "seguridad-vial.pdf" },
      { id: "be-pdf-4", label: "Documento 4", fileName: "seguridad-vial.pdf" },
    ],
  },
  "jardin-mental": {
    title: "Jardin Mental",
    subtitle: "Siembra tus metas, florece tu mente",
    bgImage: card3,
    locked: false,
    resources: [
      { id: "jm-pdf-1", label: "Documento 1", fileName: "seguridad-vial.pdf" },
      { id: "jm-pdf-2", label: "Documento 2", fileName: "seguridad-vial.pdf" },
      { id: "jm-pdf-3", label: "Documento 3", fileName: "seguridad-vial.pdf" },
      { id: "jm-pdf-4", label: "Documento 4", fileName: "seguridad-vial.pdf" },
    ],
  },
  "lago-suenos": {
    title: "Lago de los Suenos",
    subtitle: "El reflejo de tus libertades",
    bgImage: card4,
    locked: false,
    resources: [
      { id: "ls-pdf-1", label: "Documento 1", fileName: "seguridad-vial.pdf" },
      { id: "ls-pdf-2", label: "Documento 2", fileName: "seguridad-vial.pdf" },
      { id: "ls-pdf-3", label: "Documento 3", fileName: "seguridad-vial.pdf" },
      { id: "ls-pdf-4", label: "Documento 4", fileName: "seguridad-vial.pdf" },
    ],
  },
  "modulo-5": {
    title: "Modulo 5",
    subtitle: "Conduccion Segura y Primeros Auxilios",
    bgImage: card4,
    locked: false,
    resources: [
      { id: "m5-pdf-1", label: "Documento 1", fileName: "seguridad-vial.pdf" },
      { id: "m5-pdf-2", label: "Documento 2", fileName: "seguridad-vial.pdf" },
      { id: "m5-pdf-3", label: "Documento 3", fileName: "seguridad-vial.pdf" },
      { id: "m5-pdf-4", label: "Documento 4", fileName: "seguridad-vial.pdf" },
    ],
  },
  "modulo-6": {
    title: "Modulo 6",
    subtitle: "Vehiculos de Carga y Operacion Segura",
    bgImage: card4,
    locked: false,
    resources: [
      { id: "m6-pdf-1", label: "Documento 1", fileName: "seguridad-vial.pdf" },
      { id: "m6-pdf-2", label: "Documento 2", fileName: "seguridad-vial.pdf" },
      { id: "m6-pdf-3", label: "Documento 3", fileName: "seguridad-vial.pdf" },
      { id: "m6-pdf-4", label: "Documento 4", fileName: "seguridad-vial.pdf" },
    ],
  },
};
