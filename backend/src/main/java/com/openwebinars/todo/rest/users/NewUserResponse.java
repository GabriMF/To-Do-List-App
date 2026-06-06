package com.openwebinars.todo.rest.users;

public record NewUserResponse(Long id, String username, String email) {

    public static NewUserResponse of(User user) {
        return new NewUserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );
    }

}
