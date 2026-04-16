package dev.io.ToDo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloWorldController {
@GetMapping("/h")
    String sayhelloworld(){
        return "hello world";
    }
}
