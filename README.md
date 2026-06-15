# To-Do List App

Aplicación de gestión de tareas basada en una arquitectura frontend estático + backend RESTful con Spring Boot.

## Descripción general

Esta aplicación permite a usuarios autenticados crear, editar, eliminar y listar tareas personales. Cada tarea está asociada a un usuario y puede incluir título, descripción y fecha límite. El backend expone un conjunto de APIs JSON protegidas con autenticación HTTP Basic, mientras que el frontend HTML/JS consume esas APIs desde el navegador.

## Estructura del proyecto

- `backend/`: aplicación Spring Boot usando Java 17 y Spring Boot 3.4.1.
  - `src/main/java`: código fuente del backend.
  - `src/main/resources/application.properties`: configuración de datos y servidor.
  - `pom.xml`: dependencias y plugins Maven.
- `frontend/`: cliente estático con HTML, CSS y JavaScript.
  - `index.html`: interfaz de usuario.
  - `styles.css`: estilos visuales.
  - `app.js`: lógica de login, CRUD de tareas y renderizado.

## Tecnologías principales

- Java 17
- Spring Boot 3.4.1
- Spring Data JPA
- Spring Security
- Springdoc OpenAPI
- MySQL (conector `mysql-connector-j`)
- Lombok
- HTML, CSS y JavaScript puro

## Backend

### Configuración principal

- Puerto: `8080` (puede ser configurado mediante la variable `PORT`).
- Datasource: `jdbc:mysql://localhost:3306/todo_rest_daw`.
- Usuario y contraseña configurables en `backend/src/main/resources/application.properties`.
- `spring.jpa.hibernate.ddl-auto=update` para sincronizar el esquema de la base de datos en desarrollo.
- CORS habilitado globalmente con origen flexible y métodos `GET, POST, PUT, DELETE, OPTIONS, HEAD`.

### Seguridad

- Autenticación HTTP Basic.
- Ruta pública de registro: `POST /auth/register`.
- Rutas OpenAPI/Swagger públicas:
  - `/v3/api-docs/**`
  - `/swagger-ui/**`
  - `/swagger-ui.html`
- Todas las demás rutas requieren autenticación.
- `TaskController` utiliza anotaciones de método para validar propiedad de tareas:
  - `@PostAuthorize` para verificar que la tarea devuelta pertenece al usuario.
  - `@PreAuthorize` con `@ownerCheck.check(...)` para autorizar edición.

### API de tareas

Base URL: `/task/`

- `GET /task/`
  - Devuelve la lista de tareas del usuario autenticado.
- `GET /task/{id}`
  - Devuelve una tarea por su identificador.
- `POST /task/`
  - Crea una nueva tarea para el usuario autenticado.
  - Payload JSON esperado:
    ```json
    {
      "title": "Aprender Spring Boot",
      "description": "Hacer todos los cursos de Spring Boot en Openwebinars.net",
      "deadline": "2025-12-31T23:59:59"
    }
    ```
- `PUT /task/{id}`
  - Edita una tarea existente.
  - Solo el autor de la tarea puede modificarla.
- `DELETE /task/{id}`
  - Elimina una tarea existente.

### Modelo de datos

Entidad `Task` con campos:

- `id`: identificador autogenerado.
- `createdAt`: marca temporal de creación.
- `title`: título de la tarea.
- `description`: descripción completa.
- `deadline`: fecha y hora límite.
- `author`: relación `@ManyToOne` con `User`.

### Registro de usuarios

- `POST /auth/register`
- Controlador `UserController` expone la ruta de registro.
- DTOs `NewUserCommand` y `NewUserResponse` encapsulan la petición y respuesta.

## Frontend

La interfaz es una aplicación estática que consume la API REST.

### Funcionalidades

- Inicio de sesión con usuario y contraseña.
- Persistencia de credenciales en `localStorage` para la sesión actual.
- Carga de tareas del usuario autenticado.
- Creación de nuevas tareas.
- Edición de tareas existentes.
- Eliminación de tareas.
- Clasificación visual de tareas según la fecha límite:
  - `tareaVencida`: vencida.
  - `tareaProxima`: próxima a vencer.
  - `tareaNormal`: periodo normal.
  - `tareaSinFecha`: sin fecha límite.

### Archivos principales

- `frontend/index.html`: estructura de la UI.
- `frontend/styles.css`: estilos y estados de tareas.
- `frontend/app.js`: lógica de autenticación y llamadas fetch.

### Detalles de integración

- El frontend usa el endpoint `http://localhost:8080/task/`.
- Las peticiones usan encabezado `Authorization: Basic ...`.
- El formulario de creación/edición envía JSON con `Content-Type: application/json`.
- El login valida credenciales intentando cargar tareas desde el backend.

## Ejecución local

### Backend

1. Abrir terminal en `backend/`.
2. Ejecutar:
   ```bash
   ./mvnw spring-boot:run
   ```
3. El servidor arrancará en `http://localhost:8080`.

### Frontend

1. Abrir `frontend/index.html` en el navegador.
2. Si el navegador bloquea fetch desde `file://`, servirlo con un servidor estático simple, por ejemplo:
   ```bash
   cd frontend
   python3 -m http.server 5500
   ```
3. Abrir `http://localhost:5500`.

## Ejemplo de registro de usuario

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"pepe","email":"pepe@openwebinars.net","password":"1234"}'
```

## Notas adicionales

- El backend incluye Springdoc OpenAPI para documentación de la API.
- La configuración actual usa MySQL, pero también incluye dependencia H2 para desarrollo rápido si se ajusta `application.properties`.
- La aplicación no usa ningún framework de frontend moderno; está implementada con JavaScript puro.

## Estructura del backend

- `com.openwebinars.todo.rest.controller`: controladores REST.
- `com.openwebinars.todo.rest.service`: lógica de negocio de tareas.
- `com.openwebinars.todo.rest.model`: entidades JPA.
- `com.openwebinars.todo.rest.repos`: repositorios Spring Data.
- `com.openwebinars.todo.rest.security`: configuración de seguridad y CORS.
- `com.openwebinars.todo.rest.users`: control de usuarios y registro.
- `com.openwebinars.todo.rest.dto`: DTOs para comunicación JSON.
- `com.openwebinars.todo.rest.error`: manejadores de errores personalizados.

