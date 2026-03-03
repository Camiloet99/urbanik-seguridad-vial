import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { COURSE_DATA } from "@/data/courseData";
import { COURSE_KEY_TO_MODULO, submitPdfRead } from "@/services/progressService";

/**
 * In-portal PDF viewer.
 * Route: /courses/:courseKey/pdf/:pdfNum  (pdfNum = 1 | 2 | 3 | 4)
 *
 * – Marks pdf{pdfNum}Done on the backend the moment the viewer opens.
 * – Uses an <object> embed so the browser's native PDF renderer handles zoom/scroll.
 */
export default function PdfVisor() {
  const { courseKey, pdfNum } = useParams();
  const navigate = useNavigate();

  const isIntro = !pdfNum;
  const pdfNumInt = isIntro ? null : parseInt(pdfNum, 10);
  const course = COURSE_DATA[courseKey] ?? null;
  const resource = isIntro
    ? (course?.introPdf ? { label: "Introducción", fileName: course.introPdf } : null)
    : (course?.resources?.[pdfNumInt - 1] ?? null);
  const modulo = COURSE_KEY_TO_MODULO[courseKey] ?? null;

  const markedRef = useRef(false);
  const [loadError, setLoadError] = useState(false);

  // Mark this PDF as read on the backend (once per mount).
  // Intro is already marked by handleIntroduccion in CourseDetail before navigating here.
  useEffect(() => {
    if (isIntro) return;
    if (!modulo || !pdfNumInt || pdfNumInt < 1 || pdfNumInt > 4) return;
    if (markedRef.current) return;
    markedRef.current = true;

    submitPdfRead(modulo, pdfNumInt).catch((err) =>
      console.warn("[PdfVisor] could not mark pdf read:", err)
    );
  }, [isIntro, modulo, pdfNumInt]);

  const pdfSrc = resource ? `/documents/${resource.fileName}` : null;

  if (!course || !resource || !pdfSrc) {
    return (
      <div className="min-h-[calc(80vh-80px)] grid place-items-center">
        <div className="text-center space-y-4">
          <p className="text-white/80 text-lg">Documento no encontrado.</p>
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl bg-[#00b5e2] hover:brightness-110 text-white font-medium px-6 py-3 transition"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4 pt-4 sm:pt-6">
        <button
          onClick={() => navigate(`/courses/${courseKey}`)}
          className="inline-flex items-center gap-2 rounded-xl bg-white/8 hover:bg-white/12 ring-1 ring-white/15 text-white/90 text-sm font-medium px-4 py-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Volver al módulo
        </button>

        <div className="text-right leading-tight">
          <p className="text-white font-semibold text-sm truncate max-w-[220px]">{course.title}</p>
          <p className="text-white/55 text-xs">{resource.label}</p>
        </div>
      </div>

      {/* PDF viewer */}
      <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 bg-black/30 w-full">
        {loadError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-white/70">
            <p>No se pudo mostrar el PDF en este navegador.</p>
            <a
              href={pdfSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-[#00b5e2] hover:brightness-110 text-white text-sm font-medium px-5 py-2 transition"
            >
              Abrir en nueva pestaña
            </a>
          </div>
        ) : (
          <object
            data={`${pdfSrc}#toolbar=1&navpanes=0&view=FitH`}
            type="application/pdf"
            className="w-full"
            style={{ height: "calc(100vh - 160px)", minHeight: "520px" }}
            onError={() => setLoadError(true)}
          >
            {/* Fallback for browsers that block embedded PDFs */}
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-white/70">
              <p>Tu navegador no puede mostrar el PDF interactivamente.</p>
              <a
                href={pdfSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-[#00b5e2] hover:brightness-110 text-white text-sm font-medium px-5 py-2 transition"
              >
                Abrir en nueva pestaña
              </a>
            </div>
          </object>
        )}
      </div>
    </div>
  );
}
