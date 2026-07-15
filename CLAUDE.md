# CLAUDE.md — Metaverso en Seguridad Vial (Urbanik / ANSV)

Contexto para agentes de IA y personas que trabajen en este repo. Léelo antes de tocar nada.

---

## 1. Qué es

Plataforma web de **formación en seguridad vial** de la Agencia Nacional de Seguridad Vial (ANSV), marca **Urbanik**. Los usuarios se registran, hacen un test de perfil de riesgo, recorren **6 módulos** (PDFs + quizzes), interactúan con un **metaverso 3D** y con **NIA**, una asistente de IA. Al completar cada módulo obtienen un **certificado** en PDF.

- Idioma del producto y del código/documentación: **español**.
- Producción: **https://vial.urbanik-hub.com**

---

## 2. Arquitectura (producción — Azure PaaS)

Todo corre en Azure PaaS (migrado desde una VM única con docker-compose el 2026-07). Suscripción **UrbanikHub**, resource group **`urbanik-vial-rg`**.

```
Navegador (https://vial.urbanik-hub.com)
   │
   ├── HTML/JS/CSS ............ Azure Static Web Apps  (urbanik-vial-web)
   ├── PDFs (docs/certs) ...... Azure Blob Storage     (urbanikvialassets / contenedor "assets")
   ├── Metaverso 3D ........... Arcware Cloud (pixel streaming, servicio externo)
   │
   └── /auth /users /progress /gemini  ──CORS──▶  Azure Container Apps (backend-vial, Spring WebFlux)
                                                        │
                                                        ├──▶ Azure Database for MySQL Flexible (urbanik-vial-mysql, SSL)
                                                        └──▶ Azure OpenAI (urbanik-vial-openai, deployment "nia")
```

**Claves de diseño:**
- Frontend y backend están **desacoplados**: el frontend llama al backend por **URL absoluta** (`VITE_API_URL`) con **CORS**, no por proxy. (En la VM vieja nginx hacía de proxy; eso ya no existe.)
- El backend es **stateless** (JWT), por eso Container Apps puede **autoescalar** réplicas (1→5) en picos de registro.
- Los **PDFs pesados no van en el Static Web App** (límite 250 MB): van en Blob Storage y el frontend los referencia con `assetUrl()` + `VITE_ASSETS_URL`.

---

## 3. Estructura del repo

```
/
├── servicios/        Backend — Spring Boot 3.5 (Java 17), WebFlux reactivo
│   ├── src/main/java/com/ui/main/
│   │   ├── controller/     AuthController, UserController, ProgressController, GeminiController
│   │   ├── services/       AuthService, UserService, GeminiService (Azure OpenAI), ExternalProgressService
│   │   ├── security/       JwtService, JwtReactiveAuthManager  (JWT reactivo)
│   │   ├── config/         WebCorsConfig, SecurityConfig, ExternalProgressConfig
│   │   ├── repository/     R2DBC repos + entity/
│   │   └── model/dto/
│   ├── src/main/resources/application.yaml
│   ├── data/data.csv       Roster (se hornea en la imagen Docker)
│   └── Dockerfile          Multi-stage (compila en la nube con `az acr build`)
│
├── portalweb/        Frontend — React 18 + Vite + TailwindCSS + framer-motion
│   ├── src/
│   │   ├── pages/          NiaChat, PdfVisor, RiskProfileTest, Profile, Login(AuthGateway)...
│   │   ├── components/     auth/, courses/ (ChatWidget, CertificateModal, ResourceQuizModal)...
│   │   ├── services/       http.js (cliente fetch), niaService.js, progressService.js, authService.js, session.js
│   │   ├── data/           courseData.js (módulos y PDFs), moduleQuizzes.js, moduleTests.js
│   │   └── config/         assets.js (assetUrl → Blob)
│   ├── public/             Estáticos. documents/ y certificates/ se sirven desde Blob en prod
│   └── Dockerfile          (solo para correr local; en prod se usa Static Web Apps)
│
├── db/init.sql       Esquema MySQL (users, user_progress, module_progress)
├── docker-compose.yaml   SOLO para desarrollo local (mysql + backend + frontend)
└── .github/workflows/    azure-swa.yml (frontend CD), azure-backend.yml (backend CD)
```

---

## 4. Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18, Vite, TailwindCSS, framer-motion, react-router-dom, pdf-lib (certificados), react-markdown |
| Metaverso | `@arcware-cloud/pixelstreaming-websdk` (Arcware Cloud, externo) |
| Backend | Spring Boot 3.5, **WebFlux (reactivo)**, Java 17, Spring Security reactivo + JWT, R2DBC |
| DB | MySQL 8.0 (Azure Flexible Server), acceso reactivo vía `r2dbc:pool:mysql` |
| IA | Azure OpenAI (gpt-5-mini) vía proxy en el backend |
| Infra | Static Web Apps, Container Apps, Blob Storage, Container Registry, MySQL Flexible |

---

## 5. Backend — lo que hay que saber

- **Reactivo de verdad**: es WebFlux + Netty con **pocos hilos de event loop**. **NUNCA bloquees el event loop.** Todo lo que sea CPU-intensivo o bloqueante (bcrypt, llamadas HTTP con clientes bloqueantes) debe ir en `Schedulers.boundedElastic()`. Ejemplo real: `AuthService.hashPassword()` mueve bcrypt fuera del event loop; olvidarlo causaba "Failed to fetch" en registros concurrentes.
- **Endpoints**: `/auth/**` (login, signup, verify, reset — público), `/users/**`, `/progress/**`, `/gemini` (chat IA), `/actuator/health`. Todo salvo `/auth/**` y `OPTIONS` requiere **JWT** (header `Authorization: Bearer`).
- **Login por correo o documento**: `AuthService.login()` acepta un *identificador* en el campo `email` del payload; si tiene forma de correo busca por `findByEmailIgnoreCase`, si no lo trata como número de documento y busca por `findByDni`. El contrato JSON no cambió (sigue siendo `{ email, password }`), el `email` solo pasó a admitir también la cédula/TI. El JWT se emite siempre con el correo del usuario. En el frontend, `LoginForm` valida correo **o** 5–15 dígitos (`isEmailOrDocument`).
- **Recuperar contraseña flexible**: `AuthService.resolveRecoveryAccount()` (usado por `verifyIdentity` y `resetPassword`) exige que **al menos uno** de correo/documento coincida con una cuenta (no ambos, por si la persona escribió mal uno). Si ambos coinciden pero apuntan a **cuentas distintas** → `IDENTITY_MISMATCH` (ambiguo, se rechaza). En el frontend el paso 1 solo bloquea si **ninguno** tiene formato válido.
- **CORS**: `WebCorsConfig` lee los orígenes de la env **`APP_CORS_ORIGINS`** (coma-separada). Para permitir un dominio nuevo, actualiza esa env en el Container App — **no** hace falta recompilar.
- **DB**: R2DBC. En Azure exige TLS → la URL usa `sslMode=${DB_SSL_MODE}` (=`REQUIRED` en prod, `DISABLED` en local). El esquema **no** se auto-crea (`spring.sql.init.mode: never`); vive en `db/init.sql`.
- **IA**: `GeminiService` (nombre histórico) hoy llama a **Azure OpenAI** por REST con `WebClient`. Acepta la conversación completa (`messages: [{role, content}]`). Los modelos gpt-5 **rechazan** `temperature`/`max_tokens` custom → el body manda **solo `messages`**.

---

## 6. Frontend — lo que hay que saber

- **Cliente HTTP**: `src/services/http.js`. Todas las llamadas al backend pasan por aquí. Características: base `VITE_API_URL`, timeout por defecto 15s (configurable con `opts.timeoutMs`), **reintentos con backoff solo ante fallos de red/timeout** (nunca ante respuestas HTTP), emite `app:unauthorized` en 401 (→ logout automático en `AuthContext`), y mensajes de error **descriptivos** (para diagnosticar desde un pantallazo).
- **Assets pesados**: usa siempre `assetUrl("/documents/...")` / `assetUrl("/certificates/...")` (de `src/config/assets.js`). En prod resuelven a Blob (`VITE_ASSETS_URL`); en local, a `/public`.
- **NIA**: `src/services/niaService.js` llama al backend (`POST /gemini`) y simula el "escribiendo" troceando la respuesta. **NO** vuelvas a meter la key de IA en el frontend (así se quemó la de Gemini).
- **Quizzes**: `ResourceQuizModal` toma **siempre las primeras `QUESTIONS_PER_QUIZ` preguntas** del quiz (no aleatorias) — requisito del cliente. Hoy `QUESTIONS_PER_QUIZ = 6` (constante en `ResourceQuizModal.jsx`). La aprobación es por **número mínimo de aciertos**, no por porcentaje: `QUIZ_MIN_CORRECT = 4` (en `moduleQuizzes.js`) → se pasa con ≥4 respuestas correctas de las 6.

---

## 7. Desarrollo local

Requisitos: Docker, Node 18+, JDK 17 + Maven (opcional, el Docker compila).

```bash
# Todo el stack local (mysql + backend + frontend)
docker compose up -d --build

# Solo frontend en modo dev (hot reload)
cd portalweb && npm install && npm run dev      # http://localhost:5173

# Solo backend
cd servicios && mvn spring-boot:run             # http://localhost:8080
```

Variables para dev (crea `portalweb/.env` si hace falta):
- `VITE_API_URL=http://localhost:8080`
- `VITE_ASSETS_URL=` (vacío → PDFs desde /public)
- La IA en local requiere las envs `AZURE_OPENAI_*` en el backend (sin ellas, `/gemini` responde 503 "no configurada").

> Nota: en local los PDFs se sirven desde `portalweb/public/documents` y `.../certificates`. En prod esos archivos viven en Blob; el workflow los **quita** del bundle antes de publicar.

---

## 8. Despliegue (CI/CD) — deploy automático en cada merge

**Push/merge a `master` despliega solo.** No hay pasos manuales.

- **`azure-swa.yml`** — se dispara con cambios en `portalweb/**`. Compila con Vite (inyecta `VITE_*` desde secrets), **quita `dist/documents` y `dist/certificates`** del bundle, y publica en Static Web Apps.
- **`azure-backend.yml`** — se dispara con cambios en `servicios/**`. Hace `az acr build` (compila la imagen en la nube) + `az containerapp update` (nueva revisión).

**Secretos del repo** (GitHub → Settings → Secrets): `VITE_API_URL`, `VITE_ASSETS_URL`, `AZURE_STATIC_WEB_APPS_API_TOKEN`, `AZURE_CREDENTIALS` (service principal `urbanik-vial-github-cd`, con rol Contributor **solo** en `urbanik-vial-rg`).

**Deploy manual (si hiciera falta), con `az` logueado:**
```bash
# Backend
az acr build --registry urbanikvialacr --image backend-vial:latest servicios
az containerapp update -n backend-vial -g urbanik-vial-rg --image urbanikvialacr.azurecr.io/backend-vial:latest
# Frontend: preferir el workflow (workflow_dispatch) — el binario local de SWA CLI es inestable en Windows
```

---

## 9. Recursos en Azure (referencia)

RG **`urbanik-vial-rg`**. Región **westus2** (se eligió porque el RP de MySQL daba `InternalServerError` en eastus2/centralus). Azure OpenAI está en eastus2.

| Recurso | Nombre | Notas |
|---------|--------|-------|
| Static Web App | `urbanik-vial-web` | dominio: vial.urbanik-hub.com; host Azure: purple-glacier-05013f91e.7.azurestaticapps.net |
| Container App | `backend-vial` | env `urbanik-vial-env`, 0.5 vCPU, 1–5 réplicas, ingress 8080 |
| MySQL Flexible | `urbanik-vial-mysql` | Burstable B1ms, base `iu_auth`, user `vialadmin`, SSL REQUIRED |
| Container Registry | `urbanikvialacr` | imagen `backend-vial` |
| Storage / Blob | `urbanikvialassets` | contenedor público `assets` (documents/, certificates/) |
| Azure OpenAI | `urbanik-vial-openai` | deployment `nia` = gpt-5-mini |

**Secretos en el Container App** (no en código): `db-password`, `jwt-secret`, `azure-openai-key`. Se referencian con `secretref:` en las env vars.

---

## 10. Convenciones / cosas aprendidas (gotchas)

- **No bloquees el event loop** (ver §5). Es el bug más fácil de introducir en este backend.
- **La key de IA vive solo en el backend.** Nunca en el frontend (`VITE_GEMINI_API_KEY` fue eliminada a propósito).
- **Assets grandes → Blob, no SWA.** El Static Web App tiene límite de 250 MB; PDFs y videos grandes van a Blob vía `assetUrl()`.
- **CORS por env var** (`APP_CORS_ORIGINS`): cambiar dominios no requiere recompilar.
- **Dominio en Static Web Apps** = **CNAME** (no A; SWA no tiene IP fija). Azure valida el CNAME en el momento, así que el registro DNS debe existir antes de correr `az staticwebapp hostname set`.
- **`ml-api`** (que corría en la VM vieja) **no lo usa la app**: el risk score se calcula en el cliente (`RiskProfileTest.jsx`) y se envía al backend. No se migró.
- **PowerShell + `az`**: los `--query` con JMESPath tipo `[?...]` o `length(@)` fallan por el parser de cmd; filtra en PowerShell o usa Bash. El path de `az` es `C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd`.
- El manual `Manual_de_Senalizacion_Vial.pdf` (98 MB) estaba **duplicado 5×**; se dejó **una sola copia** en `documents/shared/` y los 5 módulos apuntan ahí. Optimización pendiente opcional: comprimirlo con pérdida (re-muestrear imágenes).

---

## 11. Tareas comunes

| Quiero… | Cómo |
|---------|------|
| Cambiar el dominio permitido (CORS) | `az containerapp update -n backend-vial -g urbanik-vial-rg --set-env-vars "APP_CORS_ORIGINS=..."` |
| Cambiar el modelo de IA | Crear otro deployment en `urbanik-vial-openai` y actualizar la env `AZURE_OPENAI_DEPLOYMENT` |
| Ver logs del backend | `az containerapp logs show -n backend-vial -g urbanik-vial-rg --follow` |
| Agregar/actualizar un PDF | Subirlo a Blob (`assets/documents/...`) y referenciarlo en `courseData.js` con `assetUrl()` |
| Editar quizzes o módulos | `portalweb/src/data/moduleQuizzes.js` y `courseData.js` |
| Desplegar | Merge a `master` (automático). Para forzar: `workflow_dispatch` en Actions |
