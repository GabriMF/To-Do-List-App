const API_URL = 'http://localhost:8080/task/';

let USUARIO = "";
let PASSWORD = "";

// Elementos login
const loginContainer = document.getElementById('login-container');
const loginUser = document.getElementById('loginUser');
const loginPass = document.getElementById('loginPass');
const loginButton = document.getElementById('loginButton');

const logoutButton = document.getElementById('logoutButton');
const app = document.getElementById('app');


// Elementos DOM
const loadTasksButton = document.getElementById('loadTasksButton');
const listaTareas = document.getElementById('lista-tareas');
const form = document.getElementById('form-tarea');

const inputTitulo = document.getElementById('tituloTarea');
const inputDescripcion = document.getElementById('descripcionTarea');
const inputFecha = document.getElementById('fechaLimiteTarea');

const mensaje = document.getElementById('mensaje');


// ====================
// Lógica Login
// ====================
loginButton.addEventListener('click', async () => {

    const usuario = loginUser.value.trim();
    const password = loginPass.value.trim();

    mensaje.textContent = "";

    // Validación básica
    if (!usuario || !password) {
        mensaje.textContent = "Introduce usuario y contraseña";
        return;
    }

    try {
        //Validacion contra API
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa(usuario + ':' + password)
            }
        });

        if (response.status === 401) {
            mensaje.textContent = "Usuario o contraseña incorrectos";
            return;
        }

        if (!response.ok) {
            throw new Error("Error HTTP: " + response.status);
        }

        // Guardar usuario y contraseña en variables globales y localStorage
        USUARIO = usuario;
        PASSWORD = password;

        localStorage.setItem("usuario", USUARIO);
        localStorage.setItem("password", PASSWORD);

        iniciarApp();

    } catch (error) {
        mensaje.textContent = "Error al conectar con el servidor";
        console.error(error);
    }
});


function iniciarApp() {
    loginContainer.style.display = "none";
    logoutButton.style.display = "block";
    app.style.display = "block";
    userName.style.display = "block";
    userName.textContent = "Bienvenido, " + USUARIO;
}


// ====================
// Lógica Logout
// ====================

logoutButton.addEventListener('click', () => {

    localStorage.removeItem("usuario");
    localStorage.removeItem("password");
    location.reload();
});

// ====================
// CARGAR TAREAS
// ====================

loadTasksButton.addEventListener('click', cargarTareas);

// Función para determinar el estado de la tarea
function obtenerEstadoTarea(deadline) {
    const ahora = new Date();
    const deadlineDate = new Date(deadline);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);

    if (deadlineDate < ahora) {
        return 'tareaVencida'; // Rojo: vencida
    } else if (deadlineDate < mañana) {
        return 'tareaProxima'; // Naranja: vence hoy
    } else {
        return 'tareaNormal'; // Verde: normal
    }
}

async function cargarTareas() {
    mensaje.textContent = "";

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa(USUARIO + ':' + PASSWORD)
            }
        });

        if (!response.ok) {
            throw new Error("Error HTTP: " + response.status);
        }

        const data = await response.json();

        // Limpiar lista
        listaTareas.innerHTML = "";

        // Si no hay tareas
        if (data.length === 0) {
            listaTareas.innerHTML = "<p>No hay tareas</p>";
            return;
        }

        // Pintar tareas correctamente
        data.forEach(task => {

            const li = document.createElement('li');

            // Aplicar clase de color según estado
            li.classList.add(obtenerEstadoTarea(task.deadline));

            li.innerHTML = `
                <div class="contenidoTarea">
                    <div class="tituloTarea">${task.title}</div>
                    <div class="descripcionTarea">${task.description}</div>
                    <br/>
                    <div class="fechaLimiteTarea">${new Date(task.deadline).toLocaleString()}</div>
                </div>
            `;

            // Botón eliminar
            const deleteButton = document.createElement('button');
            deleteButton.textContent = "Eliminar";

            deleteButton.addEventListener('click', async () => {
                await eliminarTarea(task.id);
            });

            li.appendChild(deleteButton);
            listaTareas.appendChild(li);
        });

    } catch (error) {
        mensaje.textContent = "Error al cargar tareas";
        console.error(error);
    }
}


// ====================
// CREAR TAREA
// ====================

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    mensaje.textContent = "";

    // VALIDACIÓN
    if (!inputTitulo.value || !inputDescripcion.value || !inputFecha.value) {
        mensaje.textContent = "Todos los campos son obligatorios";
        return;
    }

    const nuevaTarea = {
        title: inputTitulo.value,
        description: inputDescripcion.value,
        deadline: inputFecha.value + ":00"
    };

    try {

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(USUARIO + ':' + PASSWORD)
            },
            body: JSON.stringify(nuevaTarea)
        });

        if (!response.ok) {
            throw new Error("Error HTTP: " + response.status);
        }

        const data = await response.json();

        console.log("Tarea creada:", data);

        // Limpiar formulario
        form.reset();

        // Recargar lista automáticamente
        cargarTareas();

    } catch (error) {
        mensaje.textContent = "Error al crear tarea";
        console.error(error);
    }
});


// ====================
// ELIMINAR TAREA
// ====================

async function eliminarTarea(id) {
    try {

        const response = await fetch(API_URL + id, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Basic ' + btoa(USUARIO + ':' + PASSWORD)
            }
        });

        if (!response.ok) {
            throw new Error("Error HTTP: " + response.status);
        }

        // Recargar lista
        cargarTareas();

    } catch (error) {
        mensaje.textContent = "Error al eliminar tarea";
        console.error(error);
    }
}

// ======================================
// Auto Login (Guardado en localStorage)
// ======================================
window.addEventListener('DOMContentLoaded', () => {

    const userGuardado = localStorage.getItem("usuario");
    const passGuardado = localStorage.getItem("password");

    if (userGuardado && passGuardado) {
        USUARIO = userGuardado;
        PASSWORD = passGuardado;
        iniciarApp();
    }
});

//Nombre de usuario para Header
const userName = document.getElementById("userName");