const API_URL = 'http://localhost:8080/task/';
const USUARIO = 'gabi';
const PASSWORD = '1234';

const loadTasksButton = document.getElementById('loadTasksButton');
const listaTareas = document.getElementById('lista-tareas');

const inputTitulo = document.getElementById('tituloTarea');
const inputDescripcion = document.getElementById('descripcionTarea');
const inputFechaLimite = document.getElementById('fechaLimiteTarea');
const agregarTareaButton = document.getElementById('agregarTareaButton'); 

//Cargar tareas
loadTasksButton.addEventListener('click', () => {

  loadTasks();
});

async function loadTasks() {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(USUARIO + ':' + PASSWORD)
      }
    });

    const data = await response.json();
    console.log(data);

    // Limpiar la lista antes de agregar nuevas tareas
    listaTareas.innerHTML = '';

    // Agregar cada tarea a la lista
    data.forEach(task => {
      const listItemTitle = document.createElement('li');
      listItemTitle.textContent = task.title;

      const listItemDescription = document.createElement('ul');
      listItemDescription.textContent = "Descripción: " + task.description;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = "Eliminar";

      deleteButton.addEventListener('click', async () => {
        await fetch(API_URL + task.id, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Basic ' + btoa(USUARIO + ':' + PASSWORD)
          }
        });

        //Recargar lista tras eliminar
        loadTasks();
      });

      listaTareas.appendChild(listItemTitle);
      listaTareas.appendChild(listItemDescription);
      listaTareas.appendChild(deleteButton);
    });
  }catch (error) {
    console.error("Error: ",error);
  }
}

//Agregar tareas
agregarTareaButton.addEventListener('click', async () => {
  const nuevaTarea = {
    title: inputTitulo.value,
    description: inputDescripcion.value,
    dueDate: inputFechaLimite.value+":00"
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

    const data = await response.json();
    console.log("Tarea creada: " + data);

    loadTasks(); // Recargar la lista de tareas tras agregar una nueva
  }catch (error) {
    console.error("Error: ",error);
  }
});




