// src/services/coursesService.js
import { getMyProgress } from "@/services/progressService";

export async function getExperiencesProgress() {
  const p = await getMyProgress();
  return [
    { key: "fundamentos-seguridad-vial",   completed: !!p.medalla1 },
    { key: "movilidad-seguridad-peatonal",  completed: !!p.medalla2 },
    { key: "movilidad-sostenible-activa",   completed: !!p.medalla3 },
    { key: "seguridad-vial-motociclistas",  completed: !!p.medalla4 },
  ];
}
