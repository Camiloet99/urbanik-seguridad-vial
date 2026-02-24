# Guía de Prueba: Cuestionario de Perfil de Riesgo Vial

## 1. Preparación del Entorno

```bash
# Navega al directorio del proyecto
cd c:\Users\camil\Documents\iu\portalweb

# Verifica que el archivo fue actualizado
dir src\pages\TestInitial.jsx

# Inicia el servidor de desarrollo
npm run dev
```

## 2. Acceso a la Página

- URL: `http://localhost:5173/test-initial` (o el puerto que uses)
- Asegúrate de estar logueado (la página usa `useAuth()`)
- El usuario debe tener `ageRange` definido en su perfil

## 3. Casos de Prueba

### ✅ Caso 1: Motociclista Joven (Riesgo Alto Esperado)

**Setup:**
- Usuario de 20 años (rango 16-24)
- Estés logueado

**Pasos:**
1. Selecciona "Motociclista" (pregunta 1) ✓ Campo obligatorio
2. Selecciona "Diario" (pregunta 2)
3. Selecciona "Noche" (pregunta 3)
4. Verifica que APARECE pregunta 4 (Experiencia)
5. Selecciona "<1 año" (pregunta 4)
6. Selecciona "A veces" (pregunta 5)
7. Haz clic en "Enviar respuestas"

**Score Esperado:**
```
Edad 16-24:    2 pts
Motociclista:  3 pts
Diario:        2 pts
Noche:         1 pts
<1 año:        1 pts
A veces:       1 pts
────────────────────
TOTAL: 10 pts → 🔴 RIESGO ALTO
```

**Verificar:**
- ✅ Modal aparece con "Riesgo Alto" (rojo)
- ✅ Score muestra 10 puntos
- ✅ Descripción habla de reforzar seguridad
- ✅ Botón "Continuar a Actividades" navega a /experience

---

### ✅ Caso 2: Peatón Adulto (Riesgo Bajo Esperado)

**Setup:**
- Usuario de 45 años (rango 35-59)
- Estés logueado

**Pasos:**
1. Selecciona "Peatón" (pregunta 1)
2. Selecciona "Ocasional" (pregunta 2)
3. Selecciona "Mañana" (pregunta 3)
4. Verifica que NO APARECE pregunta 4 (Experiencia)
5. Selecciona "Siempre" (pregunta 5)
6. Haz clic en "Enviar respuestas"

**Score Esperado:**
```
Edad 35-59:    0 pts
Peatón:        1 pts
Ocasional:     0 pts
Mañana:        0 pts
Siempre:       0 pts
────────────────────
TOTAL: 1 pt → 🟢 RIESGO BAJO
```

**Verificar:**
- ✅ Modal aparece con "Riesgo Bajo" (verde)
- ✅ Score muestra 1 punto
- ✅ Pregunta 4 está completamente oculta
- ✅ Navegación funciona

---

### ✅ Caso 3: Conductor Liviano (Riesgo Medio Esperado)

**Setup:**
- Usuario de 30 años (rango 25-34)
- Estés logueado

**Pasos:**
1. Selecciona "Conductor vehículo liviano" (pregunta 1)
2. Selecciona "Frecuente" (pregunta 2)
3. Selecciona "Tarde" (pregunta 3)
4. Verifica que APARECE pregunta 4 (Experiencia)
5. Selecciona "1 a 3 años" (pregunta 4)
6. Selecciona "Casi nunca" (pregunta 5)
7. Haz clic en "Enviar respuestas"

**Score Esperado:**
```
Edad 25-34:    1 pts
Conductor L:   1 pts
Frecuente:     1 pts
Tarde:         0 pts
1-3 años:      0 pts
Casi nunca:    2 pts
────────────────────
TOTAL: 5 pts → 🟡 RIESGO MEDIO
```

**Verificar:**
- ✅ Modal aparece con "Riesgo Medio" (amarillo)
- ✅ Score muestra 5 puntos
- ✅ Pregunta 4 aparece (es conductor)

---

### ✅ Caso 4: Validación del Campo Obligatorio

**Pasos:**
1. No selecciones nada en pregunta 1
2. Intenta hacer clic en "Enviar respuestas"

**Verificar:**
- ✅ Botón está deshabilitado (gris)
- ✅ Mensaje de error: "Por favor completa el campo obligatorio..."
- ✅ Modal NO aparece
- ✅ No se envía nada al servidor

---

### ✅ Caso 5: Progreso y LocalStorage

**Pasos:**
1. Selecciona algunas opciones (pero no todas las obligatorias)
2. Recarga la página (F5)

**Verificar:**
- ✅ Las opciones seleccionadas se recuperan del localStorage
- ✅ El porcentaje de progreso se restaura
- ✅ LocalStorage usa clave `risk-profile-form`

**Verificar en DevTools:**
```javascript
// En la consola del navegador
console.log(JSON.parse(localStorage.getItem("risk-profile-form")));

// Debe mostrar algo como:
{
  "actorVial": "motociclista",
  "frequency": "diario",
  "schedule": "noche",
  "experience": "menos_1",
  "protection": "aveces"
}
```

---

### ✅ Caso 6: Barra Sticky Inferior

**Pasos:**
1. Abre la página y desplázate hacia abajo
2. Cuando el botón "Enviar respuestas" del aside desaparece del viewport
3. Una barra flotante debe aparecer en la parte inferior

**Verificar:**
- ✅ Barra aparece cuando btn principal se sale de pantalla
- ✅ Barra contiene porcentaje de progreso
- ✅ Barra tiene botón "Enviar respuestas" funcional
- ✅ Barra desaparece cuando btn principal es visible

---

## 4. Verificación del Backend

### Payload Esperado

Cuando envías el formulario, debería enviarse algo como:

```json
{
  "kind": "risk-profile",
  "riskScore": 10,
  "riskProfile": "ALTO",
  "riskVersion": "1.0",
  "responses": {
    "actorVial": "motociclista",
    "frequency": "diario",
    "schedule": "noche",
    "experience": "menos_1",
    "protection": "aveces"
  },
  "submittedAt": "2026-02-20T10:30:45.123Z"
}
```

**Para verificar:**

1. Abre DevTools → Network tab
2. Busca la solicitud POST a `/test-initial` o donde esté el endpoint
3. Inspecciona el payload en "Request Body"
4. Verifica que tiene los campos esperados

---

## 5. Pruebas de Responsividad

### Mobile (375px)
- [ ] Los botones se apilan correctamente
- [ ] El modal se ve bien en pantalla pequeña
- [ ] La barra sticky no se superpone con contenido

### Tablet (768px)
- [ ] El grid layout se reorganiza
- [ ] Los inputs tienen tamaño adecuado

### Desktop (1200px+)
- [ ] Dos columnas (formulario + progreso)
- [ ] Comportamiento como está diseñado

---

## 6. Pruebas de Accesibilidad

```javascript
// En la consola del navegador, verifica:
document.querySelectorAll('button[type="button"]').length // Debe existir

// Todos los botones deben ser accesibles con TAB
```

---

## 7. Checklist Final

- [ ] Archivo compilado sin errores
- [ ] Página carga sin problemas
- [ ] useAuth() funciona (usuario logueado)
- [ ] Todas las 5 preguntas son visibles
- [ ] Campo obligatorio funciona
- [ ] Lógica condicional (Experiencia) funciona
- [ ] Score se calcula correctamente
- [ ] Modal muestra resultado correcto
- [ ] LocalStorage guarda/restaura datos
- [ ] Barra sticky aparece al desplazarse
- [ ] Navegación a /experience funciona
- [ ] Backend recibe payload correcto
- [ ] Responsive en mobile/tablet/desktop
- [ ] Sin console errors o warnings

---

## 8. Logs Útiles

Para debugging, verifica estos logs en consola:

```javascript
// Score calculado
console.log("Score:", result.score, "Profile:", result.profile);

// Datos del usuario
console.log("Age range:", user?.ageRange);

// Datos del formulario
console.log("Form data:", formData);

// Payload enviado
console.log("Payload:", payload);
```

---

## 9. Problemas Comunes

### ❌ "useAuth is not defined"
**Solución:** Verifica que esté importado al principio del archivo
```javascript
import { useAuth } from "@/context/AuthContext";
```

### ❌ "Score es NaN"
**Solución:** Verifica que `user?.ageRange` tiene un valor válido (ej: "25-34")

### ❌ "Las preguntas no aparecen"
**Solución:** Verifica que el usuario está logueado y que session existe

### ❌ "Modal no aparece"
**Solución:** Verifica que `showModal` state está true y renderizando correctamente

### ❌ "Botón deshabilitado siempre"
**Solución:** Verifica que `formData.actorVial !== null` cuando haces clic

---

## 10. Performance

- [ ] Página carga en < 1 segundo
- [ ] Interacciones son instantáneas (< 100ms)
- [ ] No hay lag al desplazarse
- [ ] Modal aparece sin delay

---

## Notas

- El sistema usa `version: "1.0"` para trazabilidad futura
- Los scores se pueden ajustar después de una prueba piloto (A/B testing)
- La edad viene del perfil del usuario, no del formulario
- Todos los valores de points están configurables en las constantes al inicio
