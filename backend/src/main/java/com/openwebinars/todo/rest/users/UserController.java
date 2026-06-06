package com.openwebinars.todo.rest.users;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/auth/register")
    public ResponseEntity<NewUserResponse> createUser(@RequestBody NewUserCommand cmd) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(NewUserResponse.of(userService.register(cmd)));
    }

}
