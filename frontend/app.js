const API_URL = 'http://localhost:8080/task/';

const loadTasksButton = document.getElementById('loadTasksButton');
const bodyTablaTareas = document.getElementById('bodyTablaTareas');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const taskCounter = document.getElementById('taskCounter');
const noTasksMessage = document.getElementById('noTasksMessage');

const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const statusMessage = document.getElementById('statusMessage');
const loadingIndicator = document.getElementById('loadingIndicator');

const inputTitulo = document.getElementById('tituloTarea');
const inputDescripcion = document.getElementById('descripcionTarea');
const inputFechaLimite = document.getElementById('fechaLimiteTarea');
const agregarTareaButton = document.getElementById('agregarTareaButton');
const formErrors = document.getElementById('formErrors');

let allTasks = [];
let authHeader = null;
let isRequestInProgress = false;

//Cargar tareas
loadTasksButton.addEventListener('click', () => {
  if (!authHeader) {
    showStatus('Introduce usuario y contraseña para ver tus tareas.', 'warning');
    return;
  }
  loadTasks();
});

loginButton.addEventListener('click', () => loginUser());
logoutButton.addEventListener('click', () => logoutUser());
searchInput.addEventListener('input', () => renderTasks());
sortSelect.addEventListener('change', () => renderTasks());
inputTitulo.addEventListener('input', updateFormState);
inputDescripcion.addEventListener('input', updateFormState);
inputFechaLimite.addEventListener('input', updateFormState);
window.addEventListener('load', initializeAuth);

async function loadTasks() {
  if (!authHeader) {
    showStatus('Introduce usuario y contraseña para ver tus tareas.', 'warning');
    return;
  }

  const result = await sendRequest(API_URL, { method: 'GET' });
  if (result.status === 401) {
    return;
  }

  if (result.status === 404) {
    allTasks = [];
    renderTasks();
    showStatus('No hay tareas para este usuario.', 'info');
    return;
  }

  if (result.data) {
    allTasks = result.data;
    renderTasks();
    showStatus('Tareas cargadas correctamente.', 'success');
  }
}

function initializeAuth() {
  const saved = getStoredCredentials();
  if (saved) {
    setAuthHeader(saved.username, saved.password);
    loginUsername.value = saved.username;
    loginPassword.value = saved.password;
    updateAuthUI(true);
    loadTasks();
  } else {
    updateAuthUI(false);
  }
}

function getStoredCredentials() {
  const username = localStorage.getItem('todo_username');
  const password = localStorage.getItem('todo_password');
  if (username && password) {
    return { username, password };
  }
  return null;
}

function saveCredentials(username, password) {
  localStorage.setItem('todo_username', username);
  localStorage.setItem('todo_password', password);
}

function clearStoredCredentials() {
  localStorage.removeItem('todo_username');
  localStorage.removeItem('todo_password');
}

function setAuthHeader(username, password) {
  authHeader = 'Basic ' + btoa(`${username}:${password}`);
}

function clearAuth() {
  authHeader = null;
}

function updateAuthUI(isLoggedIn) {
  if (isLoggedIn) {
    loginUsername.disabled = true;
    loginPassword.disabled = true;
    loginButton.classList.add('hidden');
    logoutButton.classList.remove('hidden');
    loadTasksButton.disabled = false;
    agregarTareaButton.disabled = !validateForm().isValid;
  } else {
    loginUsername.disabled = false;
    loginPassword.disabled = false;
    loginButton.classList.remove('hidden');
    logoutButton.classList.add('hidden');
    loadTasksButton.disabled = false;
    agregarTareaButton.disabled = true;
    allTasks = [];
    renderTasks();
  }
}

function setBusy(busy) {
  isRequestInProgress = busy;
  const controls = document.querySelectorAll('button, input, select');
  controls.forEach(el => {
    if (el.id !== 'loadingIndicator') {
      el.disabled = busy;
    }
  });
  loadingIndicator.classList.toggle('hidden', !busy);
  if (!busy) {
    updateAuthUI(!!authHeader);
  }
}

function showStatus(message, type = 'info') {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  statusMessage.classList.remove('hidden');
}

function hideStatus() {
  statusMessage.textContent = '';
  statusMessage.className = 'status-message hidden';
}

async function sendRequest(url, options = {}) {
  if (isRequestInProgress) {
    return { error: 'request_in_progress' };
  }

  if (!authHeader) {
    showStatus('No hay credenciales válidas. Inicia sesión primero.', 'error');
    return { error: 'no_auth' };
  }

  setBusy(true);
  hideStatus();

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        'Authorization': authHeader,
      }
    });

    if (response.status === 401) {
      showStatus('No autorizado. Revisa usuario y contraseña.', 'error');
      clearAuth();
      clearStoredCredentials();
      updateAuthUI(false);
      return { status: 401 };
    }

    if (response.status === 404) {
      if (url === API_URL && options.method === 'GET') {
        return { status: 404 };
      }
      showStatus('Recurso no encontrado.', 'warning');
      return { status: 404 };
    }

    if (response.status >= 500) {
      showStatus('Error del servidor. Intenta de nuevo más tarde.', 'error');
      return { status: response.status };
    }

    if (response.ok) {
      if (response.status === 204) {
        return { status: 204 };
      }
      const data = await response.json();
      return { status: response.status, data };
    }

    const text = await response.text();
    showStatus(`Error en la petición: ${response.status}. ${text}`, 'error');
    return { status: response.status, error: text };
  } catch (error) {
    console.error('Error en la petición:', error);
    showStatus('Error de red. Comprueba tu conexión.', 'error');
    return { error: 'network' };
  } finally {
    setBusy(false);
  }
}

async function loginUser() {
  const username = loginUsername.value.trim();
  const password = loginPassword.value;

  if (!username || !password) {
    showStatus('Introduce usuario y contraseña.', 'warning');
    return;
  }

  setAuthHeader(username, password);
  const result = await sendRequest(API_URL, { method: 'GET' });
  if (result.status === 401) {
    return;
  }

  saveCredentials(username, password);
  updateAuthUI(true);
  if (result.status === 404) {
    showStatus('Inicio de sesión correcto. No hay tareas para este usuario.', 'success');
    allTasks = [];
    renderTasks();
    return;
  }

  if (result.data) {
    allTasks = result.data;
    renderTasks();
    showStatus('Inicio de sesión correcto y tareas cargadas.', 'success');
  }
}

function logoutUser() {
  clearAuth();
  clearStoredCredentials();
  updateAuthUI(false);
  hideStatus();
  showStatus('Sesión cerrada.', 'info');
}

function isValidDateFormat(value) {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
  return regex.test(value);
}

function validateForm() {
  const errors = [];
  const title = inputTitulo.value.trim();
  const description = inputDescripcion.value.trim();
  const deadlineValue = inputFechaLimite.value.trim();

  if (!title) {
    errors.push('El título no puede estar vacío.');
  }
  if (!description) {
    errors.push('La descripción no puede estar vacía.');
  }

  if (deadlineValue) {
    if (!isValidDateFormat(deadlineValue)) {
      errors.push('La fecha límite debe tener el formato correcto yyyy-MM-ddTHH:mm.');
    } else {
      const deadlineDate = new Date(deadlineValue);
      const now = new Date();
      if (isNaN(deadlineDate.getTime())) {
        errors.push('La fecha límite no es válida.');
      } else if (deadlineDate < now) {
        errors.push('La fecha límite no puede ser anterior a la fecha actual.');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function showFormErrors(errors) {
  if (errors.length === 0) {
    formErrors.classList.add('hidden');
    formErrors.innerHTML = '';
    return;
  }

  formErrors.classList.remove('hidden');
  formErrors.innerHTML = `<ul>${errors.map(error => `<li>${error}</li>`).join('')}</ul>`;
}

function updateFormState() {
  const validation = validateForm();
  agregarTareaButton.disabled = !validation.isValid;
  showFormErrors(validation.errors);
  return validation.isValid;
}

function renderTasks() {
  // Filtrar por búsqueda
  const query = searchInput.value.trim().toLowerCase();
  let filtered = allTasks.filter(t => (t.title || '').toLowerCase().includes(query));

  // Ordenar según selección
  if (sortSelect.value === 'asc' || sortSelect.value === 'desc') {
    filtered.sort((a,b) => {
      const ad = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const bd = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      if (ad === bd) return 0;
      const cmp = ad - bd;
      return sortSelect.value === 'asc' ? cmp : -cmp;
    });
  }

  // Actualizar contador
  taskCounter.textContent = `Mostrando ${filtered.length} de ${allTasks.length} tareas`;

  // Mostrar mensaje si no hay tareas
  const table = document.getElementById('tablaTareas');
  if (filtered.length === 0) {
    table.classList.add('hidden');
    noTasksMessage.classList.remove('hidden');
    bodyTablaTareas.innerHTML = '';
    return;
  } else {
    table.classList.remove('hidden');
    noTasksMessage.classList.add('hidden');
  }

  // Limpiar la tabla
  bodyTablaTareas.innerHTML = '';

  // Agregar cada tarea a la tabla
  filtered.forEach(task => {
    const row = document.createElement('tr');

    // Computar estado por fecha
    const now = Date.now();
    let statusClass = '';
    if (task.deadline) {
      const dl = new Date(task.deadline).getTime();
      if (dl < now) statusClass = 'overdue';
      else if (dl - now <= 48*3600*1000) statusClass = 'upcoming';
    } else {
      statusClass = 'no-deadline';
    }
    if (statusClass) row.classList.add(statusClass);

    // Celda de título
    const celdaTitulo = document.createElement('td');
    celdaTitulo.textContent = task.title;

    // Celda de descripción + detalles ocultos
    const celdaDescripcion = document.createElement('td');
    celdaDescripcion.textContent = task.description || '-';
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'task-details hidden';
    const created = task.createdAt ? new Date(task.createdAt).toLocaleString() : '-';
    const author = task.author && task.author.username ? task.author.username : '-';
    detailsDiv.textContent = `Creada: ${created} · Autor: ${author}`;
    celdaDescripcion.appendChild(detailsDiv);

    // Celda de fecha límite
    const celdaFechaLimite = document.createElement('td');
    if (task.deadline) {
      const date = new Date(task.deadline);
      celdaFechaLimite.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } else {
      celdaFechaLimite.textContent = '-';
    }

    // Celda de acciones
    const celdaBotones = document.createElement('td');

    const detailsButton = document.createElement('button');
    detailsButton.textContent = 'Mostrar';
    detailsButton.addEventListener('click', () => {
      const hidden = detailsDiv.classList.toggle('hidden');
      detailsButton.textContent = hidden ? 'Mostrar' : 'Ocultar';
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Eliminar";
    deleteButton.addEventListener('click', async () => {
      if (!confirm(`¿Seguro que deseas eliminar la tarea "${task.title}"?`)) {
        return;
      }
      const result = await sendRequest(API_URL + task.id, { method: 'DELETE' });
      if (result.status === 204) {
        showStatus('Tarea eliminada correctamente.', 'success');
        loadTasks();
      }
    });

    celdaBotones.appendChild(detailsButton);
    celdaBotones.appendChild(deleteButton);

    // Agregar celdas a la fila
    row.appendChild(celdaTitulo);
    row.appendChild(celdaDescripcion);
    row.appendChild(celdaFechaLimite);
    row.appendChild(celdaBotones);

    // Agregar fila a la tabla
    bodyTablaTareas.appendChild(row);
  });
}

//Agregar tareas
agregarTareaButton.addEventListener('click', async () => {
  const valid = updateFormState();
  if (!valid) {
    return;
  }

  const nuevaTarea = {
    title: inputTitulo.value.trim(),
    description: inputDescripcion.value.trim(),
  };

  // Añadir deadline solo si el usuario lo ha proporcionado
  if (inputFechaLimite.value) {
    let dl = inputFechaLimite.value;
    // datetime-local normalmente devuelve "yyyy-MM-ddTHH:mm" (sin segundos)
    if (dl.length === 16) dl = dl + ':00';
    nuevaTarea.deadline = dl;
  }

  try {
    const result = await sendRequest(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevaTarea)
    });

    if (result.status === 201) {
      showStatus('Tarea creada correctamente.', 'success');
      inputTitulo.value = '';
      inputDescripcion.value = '';
      inputFechaLimite.value = '';
      updateFormState();
      loadTasks();
    }
  }catch (error) {
    console.error("Error: ",error);
  }
});




