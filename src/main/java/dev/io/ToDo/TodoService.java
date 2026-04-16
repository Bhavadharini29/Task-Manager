package dev.io.ToDo;

import dev.io.ToDo.models.Todo;
import dev.io.ToDo.ToDoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoService {

    @Autowired
    private ToDoRepository toDoRepository;

    public Todo createTodo(Todo data) {
        return toDoRepository.save(data);
    }
    public Todo getTodoById(Long id){
        return toDoRepository.findById(id).orElseThrow(()->new RuntimeException("Todo not found"));
    }

    public List<Todo> gettodos()
    {
        return toDoRepository.findAll();
    }

    public Page<Todo> getAllTodosPages(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return toDoRepository.findAll(pageable);
    }
    public Todo updateTodo(Todo todo) {
        return toDoRepository.save(todo);
    }

    public void deleteTodoById(Long id) {
        toDoRepository.delete(getTodoById(id));
    }

    public void deleteTodo(Todo todo) {
        toDoRepository.delete(todo);
    }


}
