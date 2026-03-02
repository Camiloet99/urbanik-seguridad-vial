import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { COURSE_KEY_TO_MODULO } from "@/services/progressService";

export default function PdfViewer() {
  const { courseKey } = useParams();
  const navigate = useNavigate();

  const modulo = COURSE_KEY_TO_MODULO?.[courseKey];

  const src = useMemo(() => {
    if (!modulo) return null;
    return `/intro/modulo-${modulo}-intro.pdf`; // en public/intro/
  }, [modulo]);

  if (!src) {
    return (
      <div style={{ padding: 24 }}>
        <h2>PDF no encontrado</h2>
        <p>courseKey: {String(courseKey)}</p>
        <p>modulo: {String(modulo)}</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: 12 }}>
        <div style={{ fontWeight: 600 }}>Introducción • Módulo {modulo}</div>
        <button onClick={() => navigate(-1)}>Cerrar</button>
      </div>

      <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: 16 }}>
        <div style={{ width: "75vw", height: "80vh", borderRadius: 16, overflow: "hidden" }}>
          <iframe
            src={src}
            title="Introducción PDF"
            style={{ width: "100%", height: "100%", border: 0 }}
          />
        </div>
      </div>
    </div>
  );
}