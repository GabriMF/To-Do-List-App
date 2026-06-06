package com.openwebinars.todo.rest.users;

public record NewUserCommand(String username, String email, String password) {
}
