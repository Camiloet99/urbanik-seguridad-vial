# 🎯 Sistema de Cursos Dinámicos - Guía Visual

## Comparación: Antes vs Después

### ❌ ANTES (Flujo antiguo)
```
┌─────────────────────────────────────┐
│     Página de Cursos                │
│  ┌─────────┐  ┌─────────┐          │
│  │ Card 1  │  │ Card 2  │ ...      │
│  └─────────┘  └─────────┘          │
│      ↓ Click en Card               │
│    goSmart()                        │
│    ├─ ¿Test inicial?               │
│    ├─ ¿Medallas?                   │
│    └─ ¿Todo completo?              │
│      ↓                              │
│    /test-inicial O /experience O    │
│    /test-salida                     │
└─────────────────────────────────────┘
```

### ✅ DESPUÉS (Flujo nuevo)
```
┌─────────────────────────────────────┐
│     Página de Cursos                │
│  ┌─────────────────────────────┐   │
│  │ 1. Punto Cero CALMA    │ 🧘  │   │
│  │    Click ↓                  │   │
│  │    navigate("/courses/      │   │
│  │    punto-cero-calma")       │   │
│  └─────────────────────────────┘   │
│            ↓                        │
│  ┌─────────────────────────────┐   │
│  │ CourseDetail.jsx            │   │
│  │                             │   │
│  │ Route: /courses/            │   │
│  │        punto-cero-calma     │   │
│  │                             │   │
│  │ Mostraría:                  │   │
│  │ - Header: "Punto Cero CALMA"│   │
│  │ - 4 módulos                 │   │
│  │ - Objetivos                 │   │
│  │ - Barra de progreso         │   │
│  │                             │   │
│  │ Botón "Comenzar Curso"      │   │
│  │ Botón "Volver a Cursos"     │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## Ejemplo: Click en Card "Punto Cero CALMA"

### Paso a Paso

```
1. Usuario está en /courses

2. Usuario ve 4 cards:
   ┌─────────────────┐  ┌─────────────────┐
   │  Punto Cero 🧘  │  │  Bosque 🌳      │
   │  CALMA          │  │  EMOCIONES      │
   └─────────────────┘  └─────────────────┘
   ┌─────────────────┐  ┌─────────────────┐
   │  Jardín 🌱      │  │  Lago 💎        │
   │  MENTAL         │  │  SUEÑOS         │
   └─────────────────┘  └─────────────────┘

3. Usuario hace click en Card 1 (Punto Cero CALMA)

4. Se ejecuta:
   goToCourseDetail("punto-cero-calma")
   ↓
   navigate("/courses/punto-cero-calma")

5. React Router cambia URL a:
   http://localhost:5173/courses/punto-cero-calma

6. Se monta CourseDetail con:
   courseKey = "punto-cero-calma"

7. CourseDetail busca en COURSE_DATA:
   courseData = COURSE_DATA["punto-cero-calma"]
   ↓
   {
     title: "Punto Cero CALMA",
     color: "#1995F1",
     icon: "🧘",
     modules: [
       { id: 1, title: "Introducción a la Calma", duration: "15 min" },
       { id: 2, title: "Técnicas de Respiración", duration: "20 min" },
       { id: 3, title: "Meditación Guiada", duration: "25 min" },
       { id: 4, title: "Calma en Acción", duration: "30 min" }
     ],
     objectives: [...]
   }

8. Página renderiza:

   ┌──────────────────────────────────────────────┐
   │ ← Volver a Cursos                            │
   │                                              │
   │ 🧘                                           │
   │ Punto Cero CALMA                             │
   │ Donde inicia tu viaje interior               │
   │ Descubre el espacio de tranquilidad...       │
   └──────────────────────────────────────────────┘
   
   ┌──────────────────────────────────────┐  ┌────────────┐
   │ Sobre este curso                     │  │ Info Card  │
   │ En este módulo aprenderás...         │  │ Duración:  │
   │                                      │  │ 90 min     │
   ├──────────────────────────────────────┤  │            │
   │ Módulos del Curso                    │  │ Módulos: 4 │
   │ 1 Introducción a la Calma      15min │  │            │
   │ 2 Técnicas de Respiración      20min │  │ Nivel:     │
   │ 3 Meditación Guiada            25min │  │ Principiante
   │ 4 Calma en Acción              30min │  │            │
   │                                      │  ├────────────┤
   ├──────────────────────────────────────┤  │ Comenzar   │
   │ Lo que aprenderás                    │  │ Curso ▶    │
   │ • Aprender a encontrar tu espacio... │  ├────────────┤
   │ • Dominar técnicas de respiración... │  │ Tu Progreso│
   │ • Practicar meditación consciente... │  │ ████░░░░░░ │
   │ • Integrar la calma en tu día a día..│  │ 0% complet │
   │                                      │  └────────────┘
   └──────────────────────────────────────┘

9. Usuario puede:
   - Ver todos los módulos
   - Leer objetivos
   - Ver progreso
   - Click "Volver a Cursos" → /courses
   - Click "Comenzar Curso" → /experience (o lógica personalizada)
```

---

## Estructura de URLs

```
http://localhost:5173/courses
                      ├── punto-cero-calma
                      ├── bosque-emociones
                      ├── jardin-mental
                      └── lago-suenos
```

### Mapeo de URLs a Componentes

| URL | Component | courseKey |
|-----|-----------|-----------|
| `/courses` | `Courses.jsx` | - |
| `/courses/punto-cero-calma` | `CourseDetail.jsx` | "punto-cero-calma" |
| `/courses/bosque-emociones` | `CourseDetail.jsx` | "bosque-emociones" |
| `/courses/jardin-mental` | `CourseDetail.jsx` | "jardin-mental" |
| `/courses/lago-suenos` | `CourseDetail.jsx` | "lago-suenos" |
| `/courses/invalido` | Error Page | - |

---

## Datos por Curso

### Punto Cero CALMA (Azul #1995F1)
```
Icon: 🧘
Modules: 4 (90 min total)
  1. Introducción a la Calma (15 min)
  2. Técnicas de Respiración (20 min)
  3. Meditación Guiada (25 min)
  4. Calma en Acción (30 min)

Objectives:
  • Aprender a encontrar tu espacio de paz
  • Dominar técnicas de respiración básicas
  • Practicar meditación consciente
  • Integrar la calma en tu día a día
```

### Bosque de las Emociones (Amarillo #FFC107)
```
Icon: 🌳
Modules: 4 (110 min total)
  1. Mapa Emocional (20 min)
  2. Identificar Emociones (25 min)
  3. Expresión Emocional (30 min)
  4. Equilibrio Emocional (35 min)

Objectives:
  • Identificar tus emociones fundamentales
  • Entender el origen de tus sentimientos
  • Desarrollar inteligencia emocional
  • Crear un equilibrio emocional estable
```

### Jardín Mental (Verde #8BC34A)
```
Icon: 🌱
Modules: 4 (110 min total)
  1. Preparar el Terreno (20 min)
  2. Sembrar Metas (25 min)
  3. Cultivar Hábitos (30 min)
  4. Cosechar Resultados (35 min)

Objectives:
  • Definir metas claras y alcanzables
  • Crear hábitos de crecimiento
  • Superar creencias limitantes
  • Lograr tu florecimiento personal
```

### Lago de los Sueños (Púrpura #9C27B0)
```
Icon: 💎
Modules: 4 (120 min total)
  1. Autoconocimiento Profundo (25 min)
  2. Libertad Interior (30 min)
  3. Autenticidad (30 min)
  4. Viviendo tu Propósito (35 min)

Objectives:
  • Descubrir tu verdadera esencia
  • Liberar creencias restrictivas
  • Vivir con autenticidad
  • Encontrar tu propósito de vida
```

---

## Cambios en el Código

### App.jsx - Agregada ruta dinámica
```jsx
// ANTES
{ path: "/courses", element: <Courses /> }

// DESPUÉS
{ path: "/courses", element: <Courses /> }
{ path: "/courses/:courseKey", element: <CourseDetail /> }
```

### Courses.jsx - Nueva función de navegación
```jsx
// NUEVA FUNCIÓN
const goToCourseDetail = (courseKey) => {
  navigate(`/courses/${courseKey}`);
};

// ANTES (en cards)
onClick: goSmart

// DESPUÉS (en cards)
onClick: () => goToCourseDetail(c.key)
```

### CourseDetail.jsx - Nuevo archivo
```jsx
// Recibe el parámetro de URL
const { courseKey } = useParams();

// Busca los datos del curso
const courseData = COURSE_DATA[courseKey];

// Renderiza contenido específico
```

---

## Flujo de Componentes

```
App.jsx
  ├── Router configurado
  │   ├── /courses → Courses.jsx
  │   ├── /courses/:courseKey → CourseDetail.jsx
  │   ├── /test-inicial → TestInitial.jsx
  │   ├── /experience → Experience.jsx
  │   └── ...
  │
  └── User en /courses
      │
      ├─ Click en Card
      │   │
      │   └─ goToCourseDetail("punto-cero-calma")
      │       │
      │       └─ navigate("/courses/punto-cero-calma")
      │           │
      │           └─ React Router carga CourseDetail.jsx
      │               │
      │               └─ useParams() extrae courseKey
      │                   │
      │                   └─ COURSE_DATA[courseKey] obtiene datos
      │                       │
      │                       └─ Renderiza componente con datos
      │
      ├─ Volver a Cursos
      │   └─ navigate("/courses")
      │
      └─ Comenzar Curso
          └─ navigate("/experience") o custom logic
```

---

## Puntos Clave

✅ **URLs amigables**: `/courses/punto-cero-calma` en lugar de ID numérico
✅ **Componente reutilizable**: CourseDetail funciona para todos los cursos
✅ **Datos centralizados**: Todo en un objeto `COURSE_DATA`
✅ **Fácil de extender**: Agregar nuevo curso = agregar entrada a COURSE_DATA
✅ **Navegación clara**: Botones de vuelta y acciones principales
✅ **Responsive**: Diseño adaptable a cualquier pantalla
✅ **Accesibilidad**: Semántica HTML y ARIA labels

---

## Testing Visual

### Caso 1: Click en Card
```
Courses Page
  ↓ Click "Punto Cero CALMA"
CourseDetail Page con datos del curso
  ↓
URL: /courses/punto-cero-calma
Header: 🧘 Punto Cero CALMA
Color: Azul #1995F1
Módulos: 4 (15, 20, 25, 30 min)
```

### Caso 2: URL Directa
```
Dirección: /courses/bosque-emociones
CourseDetail Page carga correctamente
Header: 🌳 Bosque de las Emociones
Color: Amarillo #FFC107
Módulos: 4 (20, 25, 30, 35 min)
```

### Caso 3: Curso Inválido
```
Dirección: /courses/curso-inexistente
Mensaje: "Curso no encontrado"
Botón: "Volver a Cursos" funciona
```

---

**¡Sistema listo para usar! 🚀**
