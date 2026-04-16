package dev.io.ToDo.models;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;
import jakarta.validation.constraints.NotBlank;

@Entity
@Data
public class Todo {

    @Id
    @GeneratedValue
    Long id;
    @NotNull
    @NotBlank
    @Schema(name = "title", example = "Complete Spring Boot")

    String title;
    @NotNull
    @NotBlank
    String description;

    Boolean isCompleted;

}
