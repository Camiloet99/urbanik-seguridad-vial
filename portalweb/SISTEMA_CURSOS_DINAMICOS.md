# 📚 Sistema de Cursos Dinámicos - Guía de Implementación

## Cambios Realizados

### 1. **Nuevo Componente: `CourseDetail.jsx`**
   - Página reutilizable para mostrar detalles de un curso
   - Ubicación: `src/pages/CourseDetail.jsx`
   - Recibe el `courseKey` como parámetro de URL

### 2. **Nueva Ruta: `/courses/:courseKey`**
   - Agregada a `src/App.jsx`
   - Ejemplo: `/courses/punto-cero-calma`

### 3. **Cambios en `Courses.jsx`**
   - Las cards ahora navegan a `/courses/:courseKey` en lugar de usar `goSmart`
   - Se mantiene la función `goSmart` para ActionList y botón del Hero

---

## Estructura de Datos

### Course Keys Disponibles
```javascript
"punto-cero-calma"      // Punto Cero CALMA
"bosque-emociones"      // Bosque de las Emociones
"jardin-mental"         // Jardín Mental
"lago-suenos"           // Lago de los Sueños
```

### Estructura de Datos de Cada Curso
```javascript
{
  title: "Nombre del Curso",
  subtitle: "Subtítulo descriptivo",
  description: "Descripción corta",
  longDescription: "Descripción larga y detallada",
  color: "#HexColor",           // Color de tema
  icon: "emoji",                // Emoji para el icono
  modules: [                    // Array de módulos
    {
      id: 1,
      title: "Nombre del Módulo",
      duration: "15 min"
    }
  ],
  objectives: [                 // Array de objetivos de aprendizaje
    "Objetivo 1",
    "Objetivo 2"
  ]
}
```

---

## Flujos de Navegación

### Flujo Anterior (Sin cambios)
```
Courses Page
    ↓
[Click Card/Hero CTA/ActionList]
    ↓
goSmart() verifica:
  ├─ ¿No hizo test inicial? → /test-inicial
  ├─ ¿Falta medallas? → /experience
  └─ ¿Completó todo? → /test-salida
```

### Flujo Nuevo
```
Courses Page (Click en Card)
    ↓
goToCourseDetail(courseKey)
    ↓
navigate(/courses/:courseKey)
    ↓
CourseDetail Page
    ├─ Muestra contenido específico del curso
    ├─ "Comenzar Curso" → Redirige a Experience
    └─ "Volver a Cursos" → navigate(/courses)
```

---

## Cómo Agregar Nuevos Cursos

### Paso 1: Agregar datos en `COURSE_DATA`

```javascript
// En CourseDetail.jsx
const COURSE_DATA = {
  "mi-nuevo-curso": {
    title: "Mi Nuevo Curso",
    subtitle: "Subtítulo aquí",
    description: "Descripción corta",
    longDescription: "Descripción larga...",
    color: "#FF5733",          // Color HEX
    icon: "🎯",                // Emoji
    modules: [
      { id: 1, title: "Módulo 1", duration: "20 min" },
      { id: 2, title: "Módulo 2", duration: "25 min" },
    ],
    objectives: [
      "Objetivo 1",
      "Objetivo 2",
    ],
  },
  // ... otros cursos
};
```

### Paso 2: Agregar Card en `Courses.jsx`

```javascript
// En cardsBase del componente Courses
{
  key: "mi-nuevo-curso",
  title: "Mi Nuevo Curso",
  subtitle: "Subtítulo aquí",
  img: cardImage,              // Importar imagen
  ctaBg: "#FF5733",            // Color del botón
  ctaIcon: <CardIcons.MdIcon />, // Icono React
}
```

### Paso 3: Listo ✅
   - La ruta `/courses/mi-nuevo-curso` funcionará automáticamente
   - El componente `CourseDetail` manejará la visualización

---

## Componentes de CourseDetail

### 1. **Header con Icono**
   - Muestra el emoji/icono del curso
   - Botón "Volver a Cursos"
   - Título, subtítulo y descripción

### 2. **Sección: Sobre este curso**
   - Descripción larga y detallada

### 3. **Sección: Módulos del Curso**
   - Lista de módulos con número, título y duración
   - Efecto hover interactivo
   - Diseño tipo acordeón

### 4. **Sección: Lo que aprenderás**
   - Lista de objetivos de aprendizaje
   - Viñetas de color temático

### 5. **Sidebar: Información del Curso**
   - Duración total calculada
   - Cantidad de módulos
   - Nivel de dificultad

### 6. **Sidebar: CTA Button**
   - Botón "Comenzar Curso"
   - Color temático del curso

### 7. **Sidebar: Progreso**
   - Barra de progreso
   - Porcentaje completado

---

## Estilos y Colores

Cada curso tiene su propio color temático:

```javascript
"punto-cero-calma":    "#1995F1" (Azul)
"bosque-emociones":    "#FFC107" (Amarillo)
"jardin-mental":       "#8BC34A" (Verde)
"lago-suenos":         "#9C27B0" (Púrpura)
```

El color se usa en:
- Fondo degradado del header
- Números de módulos
- Indicador de progreso
- Botón "Comenzar Curso"
- Viñetas de objetivos
- Sombra del icono

---

## Ejemplo de URL

```
http://localhost:5173/courses/punto-cero-calma
http://localhost:5173/courses/bosque-emociones
http://localhost:5173/courses/jardin-mental
http://localhost:5173/courses/lago-suenos
```

---

## Funcionalidades Implementadas

✅ Ruta dinámica con parámetro `:courseKey`
✅ Componente reutilizable para todos los cursos
✅ Datos estructurados en objeto `COURSE_DATA`
✅ Contenido específico por curso
✅ Navegación de vuelta a `/courses`
✅ CTA "Comenzar Curso" (placeholder para lógica futura)
✅ Sidebar con información del curso
✅ Barra de progreso
✅ Responsive design
✅ Efecto hover en módulos
✅ Manejo de curso no encontrado

---

## Mejoras Futuras

- [ ] Integrar con `getMyProgress()` para mostrar progreso real
- [ ] Implementar lógica de "Comenzar Curso" para abrir módulos
- [ ] Agregar navegación entre módulos
- [ ] Guardar progreso de módulos individuales
- [ ] Agregar videos/contenido multimedia
- [ ] Sistema de badges/medallas por módulo
- [ ] Comentarios/foro por curso
- [ ] Quiz/evaluaciones por módulo

---

## Testing

### Test 1: Navegar a un Curso Válido
```
1. Click en card "Punto Cero CALMA"
2. URL debe cambiar a /courses/punto-cero-calma
3. Contenido debe mostrar datos de ese curso
4. Debe mostrar 4 módulos
5. Botón "Volver" debe funcionar
```

### Test 2: URL Directa
```
1. Visita http://localhost:5173/courses/jardin-mental
2. Debe cargar el contenido correcto
3. Color temático debe ser verde
```

### Test 3: Curso No Encontrado
```
1. Visita http://localhost:5173/courses/curso-inexistente
2. Debe mostrar "Curso no encontrado"
3. Botón para volver a /courses debe funcionar
```

### Test 4: Responsividad
```
1. Desktop: Layout de 3 columnas
2. Tablet: Ajuste de grid
3. Mobile: Sidebar se posiciona debajo
```

---

## Estructura de Archivos

```
src/
├── pages/
│   ├── Courses.jsx              (Actualizado: add goToCourseDetail)
│   ├── CourseDetail.jsx         (NUEVO: componente detalle)
│   └── ...
├── App.jsx                       (Actualizado: add ruta :courseKey)
└── ...
```

---

## Notas Importantes

1. **`goSmart` aún se usa** en ActionList y botón del Hero
2. **Las cards ahora** redirigen a `/courses/:courseKey`
3. **CourseDetail es stateless** pero puede fetchear progreso
4. **El `courseKey` debe coincidir** con la clave en `COURSE_DATA`
5. **Los emojis pueden cambiarse** fácilmente en `COURSE_DATA`

---

## Debugging

Si una ruta no funciona:
```javascript
// Verifica que courseKey existe en COURSE_DATA
console.log(COURSE_DATA["punto-cero-calma"]); // debe devolver objeto

// Verifica que parámetro se recibe correctamente
const { courseKey } = useParams();
console.log("courseKey:", courseKey);
```

---

**Estado**: ✅ **Implementado y Listo para Usar**
