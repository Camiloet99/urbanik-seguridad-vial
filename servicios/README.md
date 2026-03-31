# IU Digital — Backend (`servicios`)

API REST reactiva construida con **Spring Boot 3 + WebFlux**, base de datos **MySQL** vía R2DBC y autenticación **JWT**.

---

## Tecnologías principales

| Capa | Tecnología |
|---|---|
| Framework | Spring Boot 3.5 (WebFlux / reactor) |
| Persistencia | MySQL 8 · Spring Data R2DBC |
| Seguridad | JWT stateless · Spring Security |
| IA | Google Gemini API (NIA chat) |
| Empaquetado | Maven · Docker |
| Java | 17 |

---

## Estructura del proyecto

```
servicios/
├── src/main/java/com/ui/main/
│   ├── controller/          # Endpoints REST
│   │   ├── AuthController       → /auth/*
│   │   ├── UserController       → /users/*
│   │   ├── ProgressController   → /progress/*
│   │   └── GeminiController     → /gemini/*
│   ├── services/            # Lógica de negocio
│   │   ├── AuthService          → registro, login, reset password
│   │   ├── UserService          → perfil de usuario
│   │   └── ProgressService      → progreso de módulos / medallas
│   ├── repository/          # Interfaces R2DBC + entidades
│   ├── model/dto/           # Request / Response DTOs
│   ├── security/            # Filtros JWT y configuración Spring Security
│   ├── config/              # Beans globales (CORS, etc.)
│   └── IuAuthApplication    # Punto de entrada
├── sql/
│   └── init.sql             # DDL inicial de la base de datos
├── data/
│   └── data.csv             # Datos de carga inicial (opcional)
├── Dockerfile
├── pom.xml
└── .env.example             # Variables de entorno necesarias
```

---

## Variables de entorno

Crea un archivo `.env` en esta carpeta (o configúralas en Docker / CI):

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_NAME` | Nombre de la base de datos | `iu_auth` |
| `DB_USER` | Usuario MySQL | `root` |
| `DB_PASSWORD` | Contraseña MySQL | `secret` |
| `JWT_SECRET` | Clave secreta para firmar JWT (Base64) | *(generar con `openssl rand -base64 64`)* |
| `GEMINI_API_KEY` | API key de Google Gemini | *(desde Google AI Studio)* |

---

## Correr en local

### Con Maven
```bash
cd servicios
./mvnw spring-boot:run
```

### Con Docker Compose (desde la raíz del monorepo)
```bash
docker-compose up --build
```

El servidor queda en `http://localhost:8080`.

---

## Endpoints principales

### Auth — `/auth`
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/auth/signup` | Registro de nuevo usuario |
| `POST` | `/auth/login` | Login → devuelve JWT |
| `POST` | `/auth/verify-identity` | Verificar email + DNI |
| `POST` | `/auth/reset-password` | Cambiar contraseña |

### Usuarios — `/users` *(requiere JWT)*
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/users/me` | Perfil del usuario autenticado |
| `PUT` | `/users/me` | Actualizar perfil |

### Progreso — `/progress` *(requiere JWT)*
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/progress/me` | Progreso general + por módulo |
| `POST` | `/progress/medal` | Registrar medalla obtenida |
| `POST` | `/progress/experience` | Marcar experiencia 3D completada |

### Gemini / NIA — `/gemini` *(requiere JWT)*
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/gemini/chat` | Enviar mensaje a NIA |

---

## Roles de usuario

Existen dos roles: `USER` (por defecto) y `ADMIN`.

- **Por lista de correos predefinidos**: los correos en `ADMIN_EMAILS` dentro de `AuthService.java` reciben rol `ADMIN` automáticamente al registrarse.
- **Por contraseña maestra**: registrarse con la contraseña `ADMIN_MASTER_PASSWORD` también otorga `ADMIN`.

Ver [docs/ADMIN_EMAILS.md](../docs/ADMIN_EMAILS.md) para instrucciones detalladas.

---

## Compilar el JAR

```bash
./mvnw clean package -DskipTests
java -jar target/iudigital-1.0.0.jar
```
