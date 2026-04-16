package dev.io.ToDo;

import dev.io.ToDo.models.Todo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.StreamingHttpOutputMessage;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/todo")
@Slf4j
public class ToDoController {
@Autowired


private TodoService todoService;
    @PostMapping("/create")
    ResponseEntity <Todo> createUser(@RequestBody Todo todo){
        return new ResponseEntity<>(todoService.createTodo(todo), HttpStatus.CREATED);
    }
    @GetMapping("/{id}")
    ResponseEntity<Todo> getTodoById(@PathVariable long id){
        try{
            Todo createdtodo = todoService.getTodoById(id);
            return new ResponseEntity<>(createdtodo, HttpStatus.OK);
        }
        catch(RuntimeException exception){
            log.info("error");
            log.warn("warn");
log.error("error ",exception)  ;
return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/by-param")
    String getTodoByparam(@RequestParam(name="todoid") long id ,@RequestParam("val") String last ) {
        return "the id is "+id + last;
    }
    @GetMapping
    ResponseEntity<List<Todo>> gettodos(){
        return new ResponseEntity<List<Todo>>(todoService.gettodos(),HttpStatus.OK);
    }
    @PutMapping
    ResponseEntity<Todo> updateTodoById(@RequestBody Todo todo) {
        return new ResponseEntity<>(todoService.updateTodo(todo), HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    void deleteTodoById(@PathVariable long id) {
        todoService.deleteTodoById(id);
    }
    //PATH VARIABLE


}



//@GetMapping("/todoos")
//String gettodoos(){
//    todoService.printservice();
//    return "gettodoos";
//}

    // @GetMapping("/")
    // String Todo(){
    //     return "Todo";
    // }
    // @GetMapping("/get")
    // String getTodo(){
    //     return "getTodo";
    // }

      // @GetMapping("/page")
    // ResponseEntity<Page<Todo>> getTodosPaged(@RequestParam int page, @RequestParam int size) {
    //     return new ResponseEntity<>(todoService.getAllTodosPages(page, size), HttpStatus.OK);
    // }