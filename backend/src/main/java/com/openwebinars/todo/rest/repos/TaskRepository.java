package com.openwebinars.todo.rest.repos;

import com.openwebinars.todo.rest.model.Task;
import com.openwebinars.todo.rest.users.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAuthor(User author);

}
