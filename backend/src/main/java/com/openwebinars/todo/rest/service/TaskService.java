package com.openwebinars.todo.rest.service;

import com.openwebinars.todo.rest.dto.EditTaskDto;
import com.openwebinars.todo.rest.error.TaskNotFoundException;
import com.openwebinars.todo.rest.model.Task;
import com.openwebinars.todo.rest.repos.TaskRepository;
import com.openwebinars.todo.rest.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public List<Task> findAll() {
        List<Task> result = taskRepository.findAll();

        if (result.isEmpty())
            throw new TaskNotFoundException();


        return result;
    }

    public List<Task> findByAuthor(User author) {
        List<Task> result = taskRepository.findByAuthor(author);

        if (result.isEmpty())
            throw new TaskNotFoundException();

        return result;
    }

    public Task findById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(()-> new TaskNotFoundException(id));
    }

    public Task save(EditTaskDto cmd, User author) {
        return taskRepository.save(
                Task.builder()
                        .title(cmd.title())
                        .description(cmd.description())
                        .deadline(cmd.deadline())
                        .author(author)
                        .build()
        );
    }

    public Task edit(EditTaskDto cmd, Long id) {
        return taskRepository.findById(id)
                .map(t -> {
                    t.setTitle(cmd.title());
                    t.setDescription(cmd.description());
                    t.setDeadline(cmd.deadline());
                    return taskRepository.save(t);
                })
                .orElseThrow(()-> new TaskNotFoundException(id));
    }


    public void delete(Long id) {
        taskRepository.deleteById(id);
    }


}
