import { useEffect, useMemo, useRef, useState } from "react";
import { ArcwareInit } from "@arcware-cloud/pixelstreaming-websdk";
import { useAuth } from "@/context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { MdHome, MdScreenRotation } from "react-icons/md";
import { submitMedal } from "@/services/progressService";
import { MODULO_TO_COURSE_KEY } from "@/data/moduleTests";

export default function Experience() {
  const { session, loadingAuth } = useAuth();
  const user = session?.user;

  const studentId = useMemo(
    () => (user?.dni ? String(user.dni) : null),
    [user?.dni]
  );
  const avatarId = useMemo(
    () =>
      typeof user?.avatarId === "number" ? String(user.avatarId) : null,
    [user?.avatarId]
  );

  const location = useLocation();
  const navigate = useNavigate();
  const shareId = location.state?.shareId ?? "";
  const moduloFromState = location.state?.modulo ?? null;
  const containerRef = useRef(null);
  const [shouldBlockPortrait, setShouldBlockPortrait] = useState(false);

  const appRef = useRef(null);
  const streamRef = useRef(null);
  const initedRef = useRef(false);

  const emittedOnStreamRef = useRef(false);
  const emittedAfter1sRef = useRef(false);
  const emittedOnVideoRef = useRef(false);

  const videoElRef = useRef(null);
  const videoObserverRef = useRef(null);
  const xrButtonObserverRef = useRef(null);
  const after1sTimerRef = useRef(null);

  const hardRedirectHome = () => {
    try {
      streamRef.current?.onStreamingStateChange?.(() => {});
      streamRef.current?.disconnect?.();
      streamRef.current?.stop?.();
      appRef.current?.destroy?.();
    } catch (_) {}
    try {
      if (containerRef.current) containerRef.current.innerHTML = "";
    } catch (_) {}
    window.location.replace("/");
  };

  const emitPair = (tag) => {
    try {
      const app = appRef.current;
      if (!app?.emitUIInteraction || !studentId || !avatarId) return;
      setTimeout(() => {
        app.emitUIInteraction({ cedula: studentId });
        app.emitUIInteraction({ id_avatar: avatarId });
        //if (moduloFromState != null) app.emitUIInteraction({ nivel: moduloFromState });
      }, 1000);
      setTimeout(() => {
        app.emitUIInteraction({ cedula: studentId });
      }, 2000);
    } catch (e) {
      console.error("[Arcware] emit error:", e);
    }
  };

  const attachVideoListenersOnce = () => {
    const root = appRef.current?.rootElement;
    if (!root) return;

    const tryBind = (video) => {
      if (!video || emittedOnVideoRef.current) return;
      videoElRef.current = video;

      const onPlayable = () => {
        if (!emittedOnVideoRef.current) {
          emittedOnVideoRef.current = true;
          emitPair("video-playing");
        }
      };

      // Algunos navegadores disparan antes 'canplay', otros 'playing'
      video.addEventListener("playing", onPlayable, { once: true });
      video.addEventListener("canplay", onPlayable, { once: true });

      // Si ya está listo cuando llegamos
      if (
        (video.readyState ?? 0) >= 3 || // HAVE_FUTURE_DATA
        (!video.paused && !video.ended)
      ) {
        onPlayable();
      }
    };

    // 1) Intento directo
    const existing = root.querySelector("video");
    if (existing) {
      tryBind(existing);
      return;
    }

    // 2) Observar hasta que aparezca el <video>
    const mo = new MutationObserver(() => {
      const v = root.querySelector("video");
      if (v) {
        tryBind(v);
        if (videoObserverRef.current) {
          videoObserverRef.current.disconnect();
          videoObserverRef.current = null;
        }
      }
    });
    mo.observe(root, { childList: true, subtree: true });
    videoObserverRef.current = mo;
  };

  const removeXRButton = () => {
    const root = containerRef.current;
    if (!root) return;
    root.querySelectorAll("#xrBtn").forEach((button) => button.remove());
  };

  // === Arcware init ===
  useEffect(() => {
    if (loadingAuth || !studentId || !avatarId) return;

    if (!initedRef.current) {
      try {
        const { Application, PixelStreaming } = ArcwareInit(
          { shareId },
          {
            initialSettings: {
              StartVideoMuted: false,
              AutoConnect: true,
              AutoPlayVideo: true,
              AutoPlayAudio: true,
              XRControllerInput: false,
            },
            settings: {
              infoButton: true,
              micButton: true,
              audioButton: true,
              fullscreenButton: true,
              settingsButton: true,
              connectionStrengthIcon: true,
            },
          }
        );

        if (containerRef.current && Application?.rootElement) {
          containerRef.current.innerHTML = "";
          containerRef.current.appendChild(Application.rootElement);
        }

        appRef.current = Application;
        streamRef.current = PixelStreaming;
        initedRef.current = true;

        // Emisiones controladas al entrar en ON
        PixelStreaming.onStreamingStateChange((isOn) => {
          if (!isOn) return;

          // 1) Apenas entra en ON
          if (!emittedOnStreamRef.current) {
            emittedOnStreamRef.current = true;
            emitPair("stream-on");
          }

          // 2) Al 1 segundo
          if (!emittedAfter1sRef.current) {
            emittedAfter1sRef.current = true;
            after1sTimerRef.current = setTimeout(() => {
              emitPair("after-1s");
            }, 500);
          }

          // 3) Cuando el video está reproduciendo/visible
          if (!emittedOnVideoRef.current) {
            attachVideoListenersOnce();
          }
        });

        Application.getApplicationResponse?.((resp) => {
          console.log("[UE ApplicationResponse]", resp);

          // El mensaje de UE llega como string JSON o ya parseado.
          // Formato esperado: { "mensaje": "Hola desde Unreal", "estado": "medalla1" }
          try {
            const data = typeof resp === "string" ? JSON.parse(resp) : resp;
            const match = data?.estado && String(data.estado).match(/^medalla(\d+)$/i);
            if (match) {
              const numero = parseInt(match[1], 10);
              console.log(`[Medal] medalla ${numero} obtenida — guardando en BD...`);
              submitMedal(numero)
                .catch((e) =>
                  console.warn(`[Medal] medalla ${numero} no se pudo guardar:`, e)
                )
                .finally(() => {
                  const targetModulo = moduloFromState ?? numero;
                  const courseKey = MODULO_TO_COURSE_KEY[targetModulo];
                  window.location.replace(courseKey ? `/courses/${courseKey}` : "/courses");
                });
            }
          } catch (e) {
            console.warn("[UE] fallo parseando respuesta:", e);
          }
        });
      } catch (e) {
        console.error("[Arcware] init error:", e);
      }
      return;
    }

    // Si ya estaba inicializado y vuelve a ON (reconexión), aplican los mismos guards
    if (streamRef.current) {
      streamRef.current.onStreamingStateChange((isOn) => {
        if (!isOn) return;

        if (!emittedOnStreamRef.current) {
          emittedOnStreamRef.current = true;
          emitPair("stream-on(re)");
        }
        if (!emittedAfter1sRef.current) {
          emittedAfter1sRef.current = true;
          after1sTimerRef.current = setTimeout(() => {
            emitPair("after-1s(re)");
          }, 1000);
        }
        if (!emittedOnVideoRef.current) {
          attachVideoListenersOnce();
        }
      });
    }
  }, [loadingAuth, studentId, avatarId, shareId]);

  // Reset de flags si cambian IDs (poco común, pero seguro)
  useEffect(() => {
    emittedOnStreamRef.current = false;
    emittedAfter1sRef.current = false;
    emittedOnVideoRef.current = false;
  }, [studentId, avatarId]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" || e.key.toLowerCase() === "h") {
        hardRedirectHome();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const updateOrientationGate = () => {
      const isTouchDevice =
        window.matchMedia?.("(pointer: coarse)")?.matches ||
        navigator.maxTouchPoints > 0;
      const isTabletOrPhone = window.innerWidth <= 1180 || window.innerHeight <= 820;
      const isPortrait = window.matchMedia?.("(orientation: portrait)")?.matches ||
        window.innerHeight > window.innerWidth;

      setShouldBlockPortrait(Boolean(isTouchDevice && isTabletOrPhone && isPortrait));
    };

    updateOrientationGate();
    window.addEventListener("resize", updateOrientationGate);
    window.addEventListener("orientationchange", updateOrientationGate);

    const portraitQuery = window.matchMedia?.("(orientation: portrait)");
    portraitQuery?.addEventListener?.("change", updateOrientationGate);

    return () => {
      window.removeEventListener("resize", updateOrientationGate);
      window.removeEventListener("orientationchange", updateOrientationGate);
      portraitQuery?.removeEventListener?.("change", updateOrientationGate);
    };
  }, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    removeXRButton();

    const observer = new MutationObserver(() => {
      removeXRButton();
    });
    observer.observe(root, { childList: true, subtree: true });
    xrButtonObserverRef.current = observer;

    return () => {
      observer.disconnect();
      xrButtonObserverRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (after1sTimerRef.current) clearTimeout(after1sTimerRef.current);
      if (xrButtonObserverRef.current) {
        xrButtonObserverRef.current.disconnect();
        xrButtonObserverRef.current = null;
      }
      if (videoObserverRef.current) {
        videoObserverRef.current.disconnect();
        videoObserverRef.current = null;
      }
      const v = videoElRef.current;
      if (v) {
        try {
          v.removeEventListener("playing", () => {});
          v.removeEventListener("canplay", () => {});
        } catch {}
      }
    };
  }, []);

  return (
    <section className="h-[100svh] w-screen overflow-hidden xl:h-auto xl:w-full xl:overflow-x-hidden">
      <div className="h-full w-full xl:mx-auto xl:max-w-[1600px]">
        <div className="relative h-full w-full bg-black overflow-hidden xl:h-[90vh] xl:rounded-2xl xl:shadow-2xl">
          <div ref={containerRef} className="absolute inset-0 w-full h-full" />

          {shouldBlockPortrait && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Gira tu pantalla"
              className="absolute inset-0 z-[70] grid place-items-center bg-black px-6 text-white"
            >
              <div className="flex max-w-sm flex-col items-center text-center">
                <div className="relative mb-8 grid h-40 w-40 place-items-center">
                  <MdScreenRotation className="absolute inset-0 h-full w-full text-white animate-pulse" />
                  <div className="absolute h-20 w-12 rounded-[10px] border-[5px] border-white bg-black" />
                </div>

                <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
                  Gira tu pantalla
                </h2>
                <p className="mt-3 text-sm font-medium text-white/70 sm:text-base">
                  Esta experiencia funciona en horizontal.
                </p>

                <button
                  type="button"
                  onClick={hardRedirectHome}
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <MdHome className="text-lg" />
                  Volver al inicio
                </button>
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 top-0 z-50 p-3 sm:p-4">
            <div className="flex">
              <button
                type="button"
                aria-label="Volver al inicio"
                onClick={hardRedirectHome}
                className={[
                  "pointer-events-auto inline-flex items-center gap-2",
                  "rounded-full px-4 py-2 sm:px-5 sm:py-2.5 font-medium",
                  "bg-[#0B0B11]/65 backdrop-blur-md ring-1 ring-white/15",
                  "text-white hover:bg-[#0B0B11]/80 transition",
                  "shadow-[0_10px_24px_rgba(0,0,0,.35)]",
                ].join(" ")}
              >
                <MdHome className="text-lg sm:text-xl opacity-90" />
                <span className="text-sm sm:text-base">Volver al inicio</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
