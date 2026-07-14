// Base para assets estáticos PESADOS (PDFs de módulos y certificados) que se
// sirven desde Azure Blob Storage en producción, no desde el Static Web App
// (que tiene límite de tamaño). En local VITE_ASSETS_URL está vacío y los
// archivos se sirven desde /public como siempre.
const BASE = import.meta.env.VITE_ASSETS_URL ?? "";

export function assetUrl(path) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${clean}`;
}
