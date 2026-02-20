# Implementación del Cuestionario de Perfil de Riesgo Vial - TestInitial.jsx

## Resumen de Cambios

Se ha completamente reimplementado el archivo `TestInitial.jsx` para transformar el antiguo test de estrés psicológico en un **cuestionario de perfil de riesgo vial** que implementa la especificación "Metaverso Seguridad Vial v1.0".

## Características Principales

### 1. **Variables Capturadas**

#### Obligatorias:
- **Actor vial principal**: Peatón, Motociclista, Ciclista, Micromovilidad, Conductor liviano, Conductor pesado

#### Opcionales:
- **Frecuencia de desplazamiento**: Diario, Frecuente, Ocasional
- **Horario de movilidad**: Mañana, Tarde, Noche, Madrugada
- **Experiencia (solo conductores)**: <1 año, 1-3 años, >3 años
- **Hábitos de protección**: Siempre, A veces, Casi nunca

### 2. **Algoritmo de Cálculo del Score**

La función `calculateRiskScore(formData, userAgeRange)` implementa el cálculo según estos puntos:

**Por Edad (del perfil del usuario via `useAuth()`):**
- 16-24: 2 puntos
- 25-34: 1 punto
- 35-59: 0 puntos
- 60+: 2 puntos

**Por Actor Vial:**
- Motociclista: 3 puntos
- Ciclista/Micromovilidad/Conductor pesado: 2 puntos
- Peatón/Conductor liviano: 1 punto

**Ajustes Opcionales:**
- Frecuencia Diario: +2, Frecuente: +1, Ocasional: 0
- Horario Noche/Madrugada: +1, Mañana/Tarde: 0
- Experiencia <1 año: +1, 1-3 años: 0, >3 años: 0
- Protección Siempre: 0, A veces: +1, Casi nunca: +2

### 3. **Perfiles de Riesgo**

Después de calcular el score total, se asigna uno de tres perfiles:

- **BAJO**: Score 0-3 (verde)
- **MEDIO**: Score 4-6 (amarillo)
- **ALTO**: Score ≥7 (rojo)

## Componentes Principales

### `OptionGroup`
Componente reutilizable para seleccionar opciones con botones. Muestra un asterisco rojo si el campo es obligatorio.

### `RiskProfileModal`
Modal que muestra el resultado del cálculo con:
- Perfil de riesgo (BAJO/MEDIO/ALTO) con código de color
- Score total en puntos
- Descripción personalizada según el nivel de riesgo
- Botón para continuar a la siguiente sección

### `ProgressMini`
Indicador circular de progreso (porcentaje de preguntas respondidas).

### `StickyActionBar`
Barra flotante que aparece cuando el botón principal se sale del viewport.

## Integración con el Sistema

### Datos del Usuario
```javascript
const { session } = useAuth();
const user = session?.user;
const ageRange = user?.ageRange || "25-34";
```

Utiliza el hook `useAuth()` para obtener la edad del usuario (de la misma forma que en `Profile.jsx`).

### Persistencia Local
```javascript
localStorage.setItem("risk-profile-form", JSON.stringify(formData));
localStorage.removeItem("risk-profile-form"); // Después de enviar
```

### Envío al Servidor
```javascript
const payload = {
  kind: "risk-profile",
  riskScore: result.score,
  riskProfile: result.profile,
  riskVersion: "1.0",
  responses: formData,
  submittedAt: new Date().toISOString(),
};
await submitInitialTest(payload);
```

## Flujo de Usuario

1. Usuario ve el cuestionario con 5 preguntas
2. Completa la pregunta obligatoria (Actor vial)
3. Opcionalmente completa las otras 4 preguntas
4. Hace clic en "Enviar respuestas"
5. El sistema calcula automáticamente el score
6. Se muestra un modal con el perfil de riesgo
7. Al cerrar el modal, navega a `/experience`

## Ejemplo de Score Calculado

**Caso: Motociclista joven con hábitos de protección ocasionales**
- Edad 16-24: 2 puntos
- Actor vial (Motociclista): 3 puntos
- Frecuencia (Diario): 2 puntos
- Horario (Noche): 1 punto
- Experiencia (<1 año): 1 punto
- Protección (A veces): 1 punto
- **Total: 10 puntos = RIESGO ALTO**

**Caso: Peatón ocasional con buenos hábitos**
- Edad 35-59: 0 puntos
- Actor vial (Peatón): 1 punto
- Frecuencia (Ocasional): 0 puntos
- Protección (Siempre): 0 puntos
- **Total: 1 punto = RIESGO BAJO**

## Validaciones

- Campo obligatorio: Actor vial principal debe estar seleccionado
- Campos opcionales: No bloquean el envío
- Lógica condicional: Experiencia solo aparece para conductores (motociclista, conductor liviano/pesado)

## Estilos

Utiliza Tailwind CSS con:
- Gradientes morados/azules para elementos activos
- Colores verde (bajo), amarillo (medio), rojo (alto) para perfiles
- Transiciones suaves y efectos hover
- Diseño responsive con grid layout

## Próximos Pasos

1. Verificar que el backend recibe correctamente el payload con `kind: "risk-profile"`
2. Guardar el score y perfil en la base de datos del usuario
3. Utilizar el perfil para personalizar rutas y contenidos
4. A/B testing con diferentes umbrales si es necesario
