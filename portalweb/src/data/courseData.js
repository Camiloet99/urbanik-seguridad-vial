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
  "fundamentos-seguridad-vial": {
    title: "Fundamentos de Seguridad Vial",
    subtitle: "Conoce el sistema vial y tus responsabilidades como actor vial",
    bgImage: card1,
    locked: false,
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
    introPdf: "modulo-2/intro.pdf",
    resources: [
      { id: "be-pdf-1", label: "Documento 1", fileName: "seguridad-vial.pdf" },
      { id: "be-pdf-2", label: "Documento 2", fileName: "seguridad-vial.pdf" },
      { id: "be-pdf-3", label: "Documento 3", fileName: "seguridad-vial.pdf" },
      { id: "be-pdf-4", label: "Documento 4", fileName: "seguridad-vial.pdf" },
    ],
  },
  "movilidad-sostenible-activa": {
    title: "Movilidad Sostenible y Activa",
    subtitle: "Bicicletas, patinetas y micromovilidad segura",
    bgImage: card3,
    locked: false,
    introPdf: "modulo-3/intro.pdf",
    resources: [
      { id: "jm-pdf-1", label: "Documento 1", fileName: "seguridad-vial.pdf" },
      { id: "jm-pdf-2", label: "Documento 2", fileName: "seguridad-vial.pdf" },
      { id: "jm-pdf-3", label: "Documento 3", fileName: "seguridad-vial.pdf" },
      { id: "jm-pdf-4", label: "Documento 4", fileName: "seguridad-vial.pdf" },
    ],
  },
  "seguridad-vial-motociclistas": {
    title: "Seguridad Vial para Motociclistas",
    subtitle: "Domina la vía y protege tu vida sobre dos ruedas",
    bgImage: card4,
    locked: false,
    introPdf: "modulo-4/intro.pdf",
    resources: [
      { id: "ls-pdf-1", label: "Documento 1", fileName: "seguridad-vial.pdf" },
      { id: "ls-pdf-2", label: "Documento 2", fileName: "seguridad-vial.pdf" },
      { id: "ls-pdf-3", label: "Documento 3", fileName: "seguridad-vial.pdf" },
      { id: "ls-pdf-4", label: "Documento 4", fileName: "seguridad-vial.pdf" },
    ],
  },
  "conduccion-segura-automoviles": {
    title: "Conducción Segura en Automóviles",
    subtitle: "Conducción segura y primeros auxilios en la vía",
    bgImage: card4,
    locked: false,
    introPdf: "modulo-5/intro.pdf",
    resources: [
      { id: "m5-pdf-1", label: "Documento 1", fileName: "seguridad-vial.pdf" },
      { id: "m5-pdf-2", label: "Documento 2", fileName: "seguridad-vial.pdf" },
      { id: "m5-pdf-3", label: "Documento 3", fileName: "seguridad-vial.pdf" },
      { id: "m5-pdf-4", label: "Documento 4", fileName: "seguridad-vial.pdf" },
    ],
  },
  "vehiculos-carga-operacion-segura": {
    title: "Vehículos de Carga y Operación Segura",
    subtitle: "Conducción profesional de vehículos pesados rígidos (C2)",
    bgImage: card4,
    locked: false,
    introPdf: "modulo-6/intro.pdf",
    resources: [
      { id: "m6-pdf-1", label: "Documento 1", fileName: "seguridad-vial.pdf" },
      { id: "m6-pdf-2", label: "Documento 2", fileName: "seguridad-vial.pdf" },
      { id: "m6-pdf-3", label: "Documento 3", fileName: "seguridad-vial.pdf" },
      { id: "m6-pdf-4", label: "Documento 4", fileName: "seguridad-vial.pdf" },
    ],
  },
};
