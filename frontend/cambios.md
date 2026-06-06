# Cambios realizados

Resumen de las modificaciones realizadas para mejorar la UI y funcionalidad del frontend.

## Archivos modificados

- `index.html`
  - Añadido enlace a `styles.css`.
  - Añadidos controles de interfaz: campo de búsqueda (`#searchInput`), selector de orden (`#sortSelect`) y contador de tareas (`#taskCounter`).
  - Añadido párrafo `#noTasksMessage` para mostrar cuando no hay tareas.
  - Añadido contenedor de errores `#formErrors` y botón `Agregar Tarea` inicializado como deshabilitado.

- `app.js`
  - Reorganizada la carga y renderizado de tareas: ahora `loadTasks()` obtiene datos y `renderTasks()` se encarga de filtrar, ordenar y pintar.
  - Añadido almacenamiento temporal `allTasks` para evitar múltiples fetch innecesarios durante filtrado/orden.
  - Implementado filtrado por título (buscador), orden por fecha (`asc` / `desc`).
  - Añadido contador que muestra "Mostrando X de Y tareas".
  - Implementadas tres clases de estado para filas: `overdue` (vencida), `upcoming` (próxima a vencer, <48h) y `no-deadline` (sin fecha límite).
  - Añadido botón `Mostrar` / `Ocultar` para ver información adicional de cada tarea (creada, autor).
  - Añadida validación en el formulario: título obligatorio, descripción obligatoria, formato de fecha correcto y fecha límite no anterior a la fecha actual.
  - Añadido despliegue de errores en el DOM con el contenedor `#formErrors`.
  - Añadido bloqueo del botón `Agregar Tarea` cuando el formulario no es válido.
  - Ajustado el envío de nuevas tareas para enviar la propiedad `deadline` sólo si el usuario la introduce.
  - Añadida gestión de autenticación mediante usuario/contraseña para la API Basic Auth.
  - Añadida persistencia de usuario en `localStorage` para recordar sesión.
  - Añadido inicio/cierre de sesión y control de interfaz de autenticación.
  - Añadidos indicadores de carga (`loadingIndicator`) y mensajes informativos de estado (`statusMessage`).
  - Añadida gestión de errores HTTP: 401, 404 y 500.
  - Evitado múltiples peticiones simultáneas deshabilitando controles durante la petición.
  - Añadida confirmación antes de eliminar una tarea.

## Archivos añadidos

- `styles.css` — Contiene estilos generales y clases para los estados de las tareas (`.overdue`, `.upcoming`, `.no-deadline`), utilidades como `.hidden`, estilos para mensajes de error del formulario y estilos para botones deshabilitados.

## Qué hace y por qué

- Separar la lógica de renderizado en `renderTasks()` mejora mantenimiento y permite aplicar filtros/orden sin volver a solicitar los datos al servidor cada vez.
- Clasificar tareas según su fecha facilita identificar rápidamente tareas urgentes o vencidas.
- El buscador y el orden ayudan a navegar listas largas sin tocar el backend.
- Mostrar/ocultar detalles mantiene la tabla compacta y permite inspeccionar información cuando se necesita.
- El contador y el mensaje `No hay tareas` aportan feedback claro al usuario sobre el estado de la lista.
- Añadir login/logout con usuario y contraseña permite a cada usuario cargar solo sus propias tareas.
- Usar `localStorage` para recordar las credenciales mejora la experiencia de sesión del usuario.
- Incluir indicadores de carga y mensajes en el DOM mejora la comunicación asíncrona durante las peticiones.
- Gestionar estados HTTP 401, 404 y 500 asegura respuestas claras en caso de error y evita dudas al usuario.
- Deshabilitar controles durante peticiones evita envíos simultáneos y mantiene la aplicación estable.
- Confirmar la eliminación de tareas protege al usuario de borrados accidentales.
- Añadido login/logout para que cada usuario pueda ver sus propias tareas. Aún se necesita soporte backend adicional para gestión completa de perfiles de administrador y creación de usuarios por admin.

## Siguientes pasos recomendados

- Añadir validaciones y mensajes de error en el formulario de creación (título obligatorio, formato de fecha).
- Añadir paginación o lazy-loading para listas muy largas.
- Añadir tests E2E o unitarios para `renderTasks()`.
