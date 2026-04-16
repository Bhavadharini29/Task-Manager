package dev.io.ToDo;

import dev.io.ToDo.models.Todo;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
//CRUD=create read update delete


@Repository


public interface ToDoRepository extends JpaRepository<Todo, Long> {

}