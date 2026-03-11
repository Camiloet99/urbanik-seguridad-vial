// src/services/coursesService.js
import { getMyProgress, isMonedaEarned, COURSE_KEY_TO_MODULO } from "@/services/progressService";

export async function getExperiencesProgress() {
  const p = await getMyProgress();
  return Object.entries(COURSE_KEY_TO_MODULO).map(([key, modulo]) => ({
    key,
    completed: isMonedaEarned(p, modulo),
  }));
}
