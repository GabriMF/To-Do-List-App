package com.openwebinars.todo.rest.controller;

import com.openwebinars.todo.rest.dto.EditTaskDto;
import com.openwebinars.todo.rest.dto.GetTaskDto;
import com.openwebinars.todo.rest.service.TaskService;
import com.openwebinars.todo.rest.users.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task/")
@RequiredArgsConstructor
@SecurityRequirement(name = "basicAuth")
public class TaskController {

    private final TaskService taskService;

    @Operation(
            summary = "Obtener todas las tareas del usuario",
            description = "Permite obtener todas las tareas de un usuario"
    )
    @ApiResponse(description = "Listado de tareas del usuario",
            responseCode = "200",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = GetTaskDto.class)),
                    examples = {
                            @ExampleObject("""
                                    [
                                        {
                                             "id": 1,
                                             "title": "Comprar alimentos",
                                             "description": "Hacer una lista de compras para el supermercado.",
                                             "createdAt": "2025-01-13T16:12:11.295172",
                                             "deadline": "2025-01-20T16:12:11.295172",
                                             "author": {
                                                 "id": 1,
                                                 "username": "pepe",
                                                 "email": "pepe@openwebinars.net"
                                             }
                                         },
                                         {
                                             "id": 51,
                                             "title": "Pagar facturas",
                                             "description": "Pagar la factura de electricidad antes de la fecha límite.",
                                             "createdAt": "2025-01-13T16:12:11.296628",
                                             "deadline": "2025-01-15T16:12:11.296628",
                                             "author": {
                                                   "id": 1,
                                                   "username": "pepe",
                                                   "email": "pepe@openwebinars.net"
                                             }
                                         }
                                    ]
                                """)
                    }
            )
    )
    @GetMapping
    public List<GetTaskDto> getAll(@AuthenticationPrincipal User author) {
        //return taskService.findAll()
        return taskService.findByAuthor(author)
                .stream()
                .map(GetTaskDto::of)
                .toList();
    }

    @Operation(
            summary = "Obtener una tarea concreta",
            description = "Permite obtener la una tarea concreta si se le proporciona un id"
    )
    @ApiResponse(description = "Información detallada de una tarea",
            responseCode = "200",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = GetTaskDto.class),
                    examples = {
                            @ExampleObject("""
                                    {
                                             "id": 1,
                                             "title": "Comprar alimentos",
                                             "description": "Hacer una lista de compras para el supermercado.",
                                             "createdAt": "2025-01-13T16:12:11.295172",
                                             "deadline": "2025-01-20T16:12:11.295172",
                                             "author": {
                                                 "id": 1,
                                                 "username": "pepe",
                                                 "email": "pepe@openwebinars.net"
                                             }
                                         }
                                """)
                    }
            )
    )
    @PostAuthorize("returnObject.author.username == authentication.principal.username")
    @GetMapping("/{id}")
    public GetTaskDto getById(@PathVariable Long id) {
        return GetTaskDto.of(taskService.findById(id));

    }

    @Operation(
            summary = "Crear una tarea",
            description = "Permite crear una tarea asociada al usuario autenticado"
    )
    @ApiResponse(description = "Tarea recién creada",
            responseCode = "201",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = GetTaskDto.class),
                    examples = {
                            @ExampleObject("""
                                    {
                                             "id": 1,
                                             "title": "Comprar alimentos",
                                             "description": "Hacer una lista de compras para el supermercado.",
                                             "createdAt": "2025-01-13T16:12:11.295172",
                                             "deadline": "2025-01-20T16:12:11.295172",
                                             "author": {
                                                 "id": 1,
                                                 "username": "pepe",
                                                 "email": "pepe@openwebinars.net"
                                             }
                                         }
                                """)
                    }
            )
    )
    @PostMapping
    public ResponseEntity<GetTaskDto> create(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Tarea a crear", required = true,
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = EditTaskDto.class),
                            examples = @ExampleObject("""
                                    {
                                         "title": "Aprender Spring Boot",
                                         "description": "Hacer todos los cursos de Spring Boot en Openwebinars.net",
                                         "deadline": "2025-12-31T23:59:59"
                                     }
                                """)
                    )
            )
            @RequestBody EditTaskDto cmd,
            @AuthenticationPrincipal User author) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                GetTaskDto.of(taskService.save(cmd, author))
        );
    }


    @Operation(
            summary = "Editar una tarea",
            description = "Permite editar una tarea asociada al usuario autenticado si se proporciona su ID"
    )
    @ApiResponse(description = "Tarea editada",
            responseCode = "200",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = GetTaskDto.class),
                    examples = {
                            @ExampleObject("""
                                    {
                                             "id": 1,
                                             "title": "Comprar alimentos",
                                             "description": "Hacer una lista de compras para el supermercado.",
                                             "createdAt": "2025-01-13T16:12:11.295172",
                                             "deadline": "2025-01-20T16:12:11.295172",
                                             "author": {
                                                 "id": 1,
                                                 "username": "pepe",
                                                 "email": "pepe@openwebinars.net"
                                             }
                                         }
                                """)
                    }
            )
    )
    @PreAuthorize("""
            @ownerCheck.check(#id, authentication.principal.getId())
            """)
    @PutMapping("/{id}")
    public GetTaskDto edit(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos a editar en la tarea", required = true,
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = EditTaskDto.class),
                            examples = @ExampleObject("""
                                    {
                                         "title": "Aprender Spring Boot",
                                         "description": "Hacer todos los cursos de Spring Boot en Openwebinars.net",
                                         "deadline": "2025-12-31T23:59:59"
                                     }
                                """)
                    )
            )
            @RequestBody EditTaskDto cmd,
            @PathVariable Long id) {
        return GetTaskDto.of(taskService.edit(cmd, id));
    }

    @Operation(
            summary = "Eliminar una tarea",
            description = "Permite eliminar una tarea asociada al usuario autenticado si se proporciona su ID"
    )
    @ApiResponse(description = "Respuesta correcta de tarea eliminada",
            responseCode = "204",
            content = @Content(schema = @Schema(implementation = Void.class)))
    @PreAuthorize("""
            @ownerCheck.check(#id, authentication.principal.getId())
            """)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }



}
