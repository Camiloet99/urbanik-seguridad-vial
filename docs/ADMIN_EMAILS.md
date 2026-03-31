# Gestión de correos administradores predefinidos

Cuando un correo de esta lista se registra en la plataforma, recibe el rol **ADMIN** automáticamente, sin importar la contraseña que elija.

---

## Dónde se configura

**Archivo:** `servicios/src/main/java/com/ui/main/services/AuthService.java`

Busca el bloque:

```java
private static final Set<String> ADMIN_EMAILS = Set.of(
    "coordinadorparticipacion@gmail.com"
    // Agrega más correos aquí, por ejemplo:
    // "otro@ejemplo.com"
);
```

---

## Cómo añadir un correo admin

1. Abre `AuthService.java`.
2. Agrega el correo dentro del `Set.of(...)`, separado por coma:

```java
private static final Set<String> ADMIN_EMAILS = Set.of(
    "coordinadorparticipacion@gmail.com",
    "nuevoadmin@ejemplo.com"
);
```

3. Guarda el archivo.
4. Recompila y despliega el backend:
   ```bash
   ./mvnw clean package -DskipTests
   # o con Docker:
   docker-compose up --build servicios
   ```

> **Nota:** Los correos se comparan en minúsculas, así que `Admin@Ejemplo.com` y `admin@ejemplo.com` se tratan igual.

---

## Cómo eliminar un correo admin

Simplemente borra la línea del correo dentro del `Set.of(...)` y recompila.

---

## Usuarios ya registrados

Este mecanismo solo aplica **en el momento del registro**. Si un usuario ya existe en la base de datos con rol `USER` y quieres convertirlo en admin, debes actualizar su campo `role` directamente en la BD:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'correo@ejemplo.com';
```

---

## Contraseña maestra (método alternativo)

Como respaldo, cualquier persona que se registre usando la contraseña maestra definida en `ADMIN_MASTER_PASSWORD` también recibirá rol `ADMIN`. Cambiar o rotar esa contraseña es otra vía para controlar el acceso administrativo.
