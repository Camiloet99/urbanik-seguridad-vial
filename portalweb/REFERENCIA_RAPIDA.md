# Referencia Rápida: TestInitial - Cuestionario de Riesgo Vial

## Archivos Modificados
- ✅ `src/pages/TestInitial.jsx` - Completamente reescrito

## Documentación
- 📄 `IMPLEMENTACION_RISK_PROFILE.md` - Detalle técnico completo
- 📊 `GUIA_VISUAL_RISK_PROFILE.md` - Ejemplos y flujos visuales

---

## ¿Qué hace ahora TestInitial?

Anterior: Cuestionario de estrés psicológico (DASS-21)
**Actual: Cuestionario de perfil de riesgo vial según especificación v1.0**

---

## Campos del Formulario

| Campo | Obligatorio | Opciones |
|-------|------------|----------|
| **Actor Vial** | ✅ SÍ | Peatón, Motociclista, Ciclista, Micromovilidad, Conductor Liviano, Conductor Pesado |
| **Frecuencia** | ❌ No | Diario, Frecuente, Ocasional |
| **Horario** | ❌ No | Mañana, Tarde, Noche, Madrugada |
| **Experiencia** | ❌ No | <1 año, 1-3 años, >3 años (Solo aparece si es conductor) |
| **Protección** | ❌ No | Siempre, A veces, Casi nunca |

---

## Sistema de Puntos (Score)

### Edad (del perfil del usuario)
- 16-24: **2 pts**
- 25-34: **1 pt**
- 35-59: **0 pts**
- 60+: **2 pts**

### Actor Vial
- Motociclista: **3 pts**
- Ciclista: **2 pts**
- Micromovilidad: **2 pts**
- Conductor Pesado: **2 pts**
- Peatón: **1 pt**
- Conductor Liviano: **1 pt**

### Frecuencia (Opcional)
- Diario: **2 pts**
- Frecuente: **1 pt**
- Ocasional: **0 pts**

### Horario (Opcional)
- Noche: **1 pt**
- Madrugada: **1 pt**
- Mañana: **0 pts**
- Tarde: **0 pts**

### Experiencia (Opcional, solo conductores)
- <1 año: **1 pt**
- 1-3 años: **0 pts**
- >3 años: **0 pts**

### Protección (Opcional)
- Siempre: **0 pts**
- A veces: **1 pt**
- Casi nunca: **2 pts**

---

## Cálculo del Perfil

```
Score Total = Edad + Actor Vial + [Frecuencia] + [Horario] + [Experiencia] + [Protección]

Resultado:
  0-3   → 🟢 RIESGO BAJO
  4-6   → 🟡 RIESGO MEDIO
  ≥7    → 🔴 RIESGO ALTO
```

---

## Integración con el Usuario

```javascript
import { useAuth } from "@/context/AuthContext";

const { session } = useAuth();
const user = session?.user;
const ageRange = user?.ageRange; // Esperado: "16-24", "25-34", etc.
```

---

## Datos Enviados al Backend

```javascript
{
  kind: "risk-profile",
  riskScore: 10,
  riskProfile: "ALTO",
  riskVersion: "1.0",
  responses: {
    actorVial: "motociclista",
    frequency: "diario",
    schedule: "noche",
    experience: "menos_1",
    protection: "aveces"
  },
  submittedAt: "2026-02-20T10:30:00.000Z"
}
```

---

## Flujo de Usuario

1. **Carga la página** → Formulario con 5 preguntas
2. **Selecciona Actor Vial** → Campo obligatorio
3. **Completa opcionales** → Preguntas 2-5 (opcional)
4. **Hace clic en "Enviar"** → Botón se activa solo si Actor Vial está seleccionado
5. **Sistema calcula score** → Usando edad del usuario + respuestas
6. **Modal muestra resultado** → Con perfil (BAJO/MEDIO/ALTO) y descripción
7. **Continúa a /experience** → Al cerrar el modal

---

## Lógica Especial: Experiencia Condicional

La pregunta 4 (Experiencia) **solo aparece** si el usuario selecciona:
- Motociclista ✅
- Conductor Liviano ✅
- Conductor Pesado ✅

**No aparece** para:
- Peatón ❌
- Ciclista ❌
- Micromovilidad ❌

---

## LocalStorage

**Clave**: `risk-profile-form`

**Se almacena**: Cada cambio del formulario
**Se limpia**: Después de enviar exitosamente

```javascript
// Guardar
localStorage.setItem("risk-profile-form", JSON.stringify(formData));

// Cargar
const saved = localStorage.getItem("risk-profile-form");

// Limpiar
localStorage.removeItem("risk-profile-form");
```

---

## Validaciones

✅ **Obligatorio**: Actor vial principal
✅ **Mensaje de error**: Si no está seleccionado
✅ **Botón deshabilitado**: Hasta completar campo obligatorio
❌ **No bloquea**: Si faltan campos opcionales

---

## Estilos / Clases

- **Botones seleccionados**: `bg-[#5944F9]` (púrpura)
- **Botones no seleccionados**: `bg-white/5` (gris claro)
- **Perfil BAJO**: `bg-green-500/20` (verde)
- **Perfil MEDIO**: `bg-yellow-500/20` (amarillo)
- **Perfil ALTO**: `bg-red-500/20` (rojo)

---

## Debugging

**¿El usuario no ve la experiencia?**
→ Verifica que `formData.actorVial` esté en la lista: `["motociclista", "conductor_liviano", "conductor_pesado"]`

**¿El score no calcula correctamente?**
→ Revisa la función `calculateRiskScore()` y los valores de `userAgeRange`

**¿El modal no aparece?**
→ Verifica que `showModal` state esté en `true` en `handleSubmit()`

**¿No se envía al servidor?**
→ Verifica que `submitInitialTest()` esté importada correctamente desde `testsService`

---

## Ejemplos de Scores

| Caso | Edad | Actor | Frecuencia | Horario | Experiencia | Protección | TOTAL | Perfil |
|------|------|-------|-----------|---------|-------------|-----------|-------|--------|
| Motociclista Riesgoso | 22 | 3 | 2 | 1 | 1 | 1 | **10** | 🔴 ALTO |
| Conductor Experimen. | 38 | 2 | 1 | 0 | 0 | 0 | **3** | 🟢 BAJO |
| Peatón Ocasional | 40 | 1 | 0 | 0 | - | 0 | **1** | 🟢 BAJO |
| Ciclista Diario | 28 | 2 | 2 | 1 | - | 2 | **7** | 🔴 ALTO |
| Conductor Nuevo | 20 | 1 | 1 | 0 | 1 | 1 | **4** | 🟡 MEDIO |

---

## TODO Backend

- [ ] Guardar `risk_score` en tabla usuarios
- [ ] Guardar `risk_profile` en tabla usuarios
- [ ] Guardar `risk_version` para trazabilidad
- [ ] Guardar `responses` JSON completo
- [ ] Crear endpoint para obtener perfil del usuario
- [ ] Usar perfil para personalizar rutas/contenidos
- [ ] Dashboard de analítica por perfil de riesgo

---

## Próximas Mejoras

- [ ] A/B Testing con diferentes umbrales
- [ ] Análisis por regiones/municipios
- [ ] Trending de riesgo por temporada
- [ ] Recomendaciones personalizadas por perfil
- [ ] Integración con módulos educativos específicos
