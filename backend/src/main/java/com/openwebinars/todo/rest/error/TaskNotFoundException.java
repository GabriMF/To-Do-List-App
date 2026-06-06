package com.openwebinars.todo.rest.error;

public class TaskNotFoundException extends RuntimeException {
    public TaskNotFoundException(String message) {
        super(message);
    }

    public TaskNotFoundException(Long id) {
        super("No hay una tarea con ese ID: %d".formatted(id));
    }

    public TaskNotFoundException() {
        super("No hay tareas con esos requisitos de búsqueda");
    }


}
