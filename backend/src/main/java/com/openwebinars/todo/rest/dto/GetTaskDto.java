package com.openwebinars.todo.rest.dto;

import com.openwebinars.todo.rest.model.Task;
import com.openwebinars.todo.rest.users.NewUserResponse;

import java.time.LocalDateTime;

public record GetTaskDto(
        Long id,
        String title,
        String description,
        LocalDateTime createdAt,
        LocalDateTime deadline,
        NewUserResponse author){

    public static GetTaskDto of(Task t) {
        return new GetTaskDto(
                t.getId(),
                t.getTitle(),
                t.getDescription(),
                t.getCreatedAt(),
                t.getDeadline(),
                NewUserResponse.of(t.getAuthor())
        );
    }

}
