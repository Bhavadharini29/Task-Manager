# ToDo Application - Complete Project Flow & Architecture

## 📋 Project Overview

A **Spring Boot REST API application** for managing Todo tasks with PostgreSQL database, JPA/Hibernate ORM, and basic Spring Security authentication. Built with Maven and designed with a 3-layer architecture (Controller → Service → Repository).

**Tech Stack Version:** Spring Boot 3.3.2 | Java 21 | PostgreSQL

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    REST API Clients                         │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              CONTROLLER LAYER                               │
│  (HTTP Requests → Business Logic)                           │
│  - ToDoController.java (REST Endpoints)                     │
│  - HelloWorldController.java (Health Check)                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│            SERVICE LAYER                                    │
│  (Business Logic & Transactions)                            │
│  - TodoService.java (CRUD Operations)                       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│         DATA ACCESS LAYER (JPA)                             │
│  (Database Queries)                                         │
│  - ToDoRepository.java (Data Access Object)                │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│            PostgreSQL Database                              │
│  - todo table (Todo entity)                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Technology Stack & Dependencies

| Component | Version | Purpose |
|-----------|---------|---------|
| **Spring Boot** | 3.3.2 | Framework |
| **Java** | 21 | Language |
| **PostgreSQL** | Latest | Database |
| **Spring Data JPA** | 3.3.2 | ORM Abstraction |
| **Hibernate** | Built-in | ORM Implementation |
| **Spring Security** | 3.3.2 | Authentication & Authorization |
| **Lombok** | 1.18.42 | Boilerplate Reduction |
| **SpringDoc OpenAPI** | 2.6.0 | Swagger/API Documentation |
| **Validation** | 3.3.2 | Bean Validation |
| **Spring DevTools** | 3.3.2 | Development Utilities |

### Key Dependencies in pom.xml:

```xml
<!-- Web & REST Support -->
spring-boot-starter-web

<!-- Database & ORM -->
spring-boot-starter-data-jpa
postgresql

<!-- Security -->
spring-boot-starter-security

<!-- Code Generation & Documentation -->
lombok
springdoc-openapi-starter-webmvc-ui

<!-- Validation & Testing -->
spring-boot-starter-validation
spring-boot-starter-test
```

---

## 🗄️ Database Layer

### PostgreSQL Connection Configuration

**File:** `application.properties`

```properties
# Database Connection
spring.datasource.url=jdbc:postgresql://localhost:5432/todo
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.username=postgres
spring.datasource.password=1234

# JPA/Hibernate Configuration
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update          # Auto-create/update tables
spring.jpa.properties.hibernate.format_sql=true

# Security Defaults
spring.security.user.name=admin
spring.security.user.password=1234
```

### Entity Model

**File:** `models/Todo.java`

```java
@Entity
@Data
public class Todo {
    @Id
    @GeneratedValue
    Long id;              // Primary Key (Auto-generated)

    @NotNull
    @NotBlank
    String title;         // Todo title

    @NotNull
    @NotBlank
    String description;   // Todo description

    Boolean isCompleted;  // Completion status
}
```

**Database Table Structure:**

```sql
CREATE TABLE todo (
    id BIGSERIAL PRIMARY KEY,           -- Auto-generated ID
    title VARCHAR(255) NOT NULL,        -- Todo title
    description VARCHAR(255) NOT NULL, -- Todo description
    is_completed BOOLEAN               -- Completion flag
);
```

---

## 🔐 Security Configuration

**File:** `SecurityConfig.java`

```java
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)  // Disable CSRF
            .authorizeHttpRequests(auth -> auth
                .anyRequest().authenticated()        // All requests require auth
            )
            .httpBasic(Customizer.withDefaults());  // Enable HTTP Basic Auth
        return http.build();
    }
}
```

### Security Features:

- ✅ **HTTP Basic Authentication** - Username/Password
- ✅ **CSRF Protection Disabled** - For API convenience
- ✅ **All Endpoints Protected** - Requires HTTP Basic Auth
- ✅ **Default Credentials:**
  - Username: `admin`
  - Password: `1234`

### How Security Works:

1. Client sends HTTP request with `Authorization: Basic base64(admin:1234)`
2. Spring Security intercepts request
3. Credentials validated against default user
4. If valid → Request proceeds
5. If invalid → 401 Unauthorized response

---

## 🛣️ API Endpoints

**Base URL:** `http://localhost:8080`

### 1. Health Check Routes

#### ✓ Simple Health Check
```
GET /h
Returns: "hello world"
Auth: Not required (currently protected)
```

#### ✓ Root Todo Check
```
GET /api/v1/todo/
Returns: "Todo"
Auth: Required
```

---

### 2. Todo CRUD Operations

#### ✓ Create Todo
```
POST /api/v1/todo/create
Content-Type: application/json
Auth: Required (admin/1234)

Request Body:
{
  "title": "Complete Spring Boot",
  "description": "Learn Spring Boot fundamentals",
  "isCompleted": false
}

Response (201 Created):
{
  "id": 1,
  "title": "Complete Spring Boot",
  "description": "Learn Spring Boot fundamentals",
  "isCompleted": false
}
```

#### ✓ Get All Todos
```
GET /api/v1/todo
Auth: Required

Response (200 OK):
[
  {
    "id": 1,
    "title": "Complete Spring Boot",
    "description": "Learn Spring Boot fundamentals",
    "isCompleted": false
  },
  ...
]
```

#### ✓ Get Single Todo by ID
```
GET /api/v1/todo/{id}
Example: GET /api/v1/todo/1
Auth: Required

Response (200 OK):
{
  "id": 1,
  "title": "Complete Spring Boot",
  "description": "Learn Spring Boot fundamentals",
  "isCompleted": false
}

Error Response (404 Not Found):
Status: 404
(No body)
```

#### ✓ Get Todos with Pagination
```
GET /api/v1/todo/page?page=0&size=10
Auth: Required

Query Parameters:
- page: Page number (0-indexed)
- size: Number of items per page

Response (200 OK):
{
  "content": [
    { id: 1, title: "...", description: "...", isCompleted: false },
    ...
  ],
  "pageable": { "pageNumber": 0, "pageSize": 10, ... },
  "totalElements": 5,
  "totalPages": 1
}
```

#### ✓ Get Todo by Query Parameters
```
GET /api/v1/todo/by-param?todoid=1&val=test
Auth: Required

Response (200 OK):
"the id is 1test"
```

#### ✓ Update Todo
```
PUT /api/v1/todo
Content-Type: application/json
Auth: Required

Request Body (must include ID):
{
  "id": 1,
  "title": "Updated Title",
  "description": "Updated description",
  "isCompleted": true
}

Response (200 OK):
{
  "id": 1,
  "title": "Updated Title",
  "description": "Updated description",
  "isCompleted": true
}
```

#### ✓ Delete Todo
```
DELETE /api/v1/todo/{id}
Example: DELETE /api/v1/todo/1
Auth: Required

Response: 204 No Content
```

---

## 📊 Data Flow Diagrams

### Create Todo Operation Flow

```
1. Client Request
   ├─ POST /api/v1/todo/create
   ├─ Headers: Authorization: Basic admin:1234
   └─ Body: { title, description, isCompleted }

2. Security Filter
   ├─ Validates HTTP Basic Auth
   ├─ Authenticates against default user
   └─ Proceeds if valid

3. ToDoController.createUser()
   ├─ Receives @RequestBody Todo
   ├─ Calls todoService.createTodo(todo)
   └─ Returns ResponseEntity with 201 CREATED

4. TodoService.createTodo()
   ├─ Receives Todo object
   ├─ Validates constraints (@NotNull, @NotBlank)
   └─ Calls toDoRepository.save(todo)

5. ToDoRepository.save()
   ├─ JPA converts to SQL INSERT
   ├─ Hibernate generates INSERT statement
   └─ PostgreSQL executes and returns generated ID

6. Response Back to Client
   └─ Returns Todo object with generated ID
```

### Retrieve Todo by ID Flow

```
1. Client Request
   ├─ GET /api/v1/todo/1
   └─ Headers: Authorization: Basic admin:1234

2. Security Validation ✓

3. ToDoController.getTodoById(long id)
   ├─ Calls todoService.getTodoById(1)
   ├─ Try-Catch handles exceptions
   └─ Returns ResponseEntity<Todo>

4. TodoService.getTodoById(Long id)
   ├─ Calls toDoRepository.findById(1)
   ├─ Optional<Todo> returned
   ├─ If present → Returns Todo
   └─ If absent → Throws RuntimeException("Todo not found")

5. Controller Exception Handling
   ├─ Catches RuntimeException
   ├─ Logs error with @Slf4j
   └─ Returns 404 NOT_FOUND

6. Response to Client
   ├─ Success: 200 OK + Todo JSON
   └─ Failure: 404 NOT_FOUND (empty)
```

### Update Todo Flow

```
1. Client Request
   ├─ PUT /api/v1/todo
   ├─ Body: { id: 1, title: "New", description: "...", isCompleted: true }
   └─ Headers: Authorization: Basic admin:1234

2. Security Validation ✓

3. ToDoController.updateTodoById(@RequestBody Todo)
   ├─ Calls todoService.updateTodo(todo)
   └─ Returns ResponseEntity with 200 OK

4. TodoService.updateTodo(Todo)
   ├─ Calls toDoRepository.save(todo)
   ├─ JPA detects ID exists
   └─ Generates UPDATE statement instead of INSERT

5. Database Update
   ├─ UPDATE todo SET title='...', description='...', is_completed=true
   │  WHERE id=1
   └─ Returns updated Todo object

6. Response to Client
   └─ 200 OK + Updated Todo JSON
```

---

## 📝 Component Breakdown

### 1. **ToDoApplication.java** (Entry Point)

```java
@SpringBootApplication
public class ToDoApplication {
    public static void main(String[] args) {
        SpringApplication.run(ToDoApplication.class, args);
    }
}
```

**Purpose:**
- Application bootstrap class
- Enables auto-configuration
- Starts embedded Tomcat server on port 8080
- Component scanning from this package downward

---

### 2. **ToDoRepository.java** (Data Access Layer)

```java
@Repository
public interface ToDoRepository extends JpaRepository<Todo, Long> {
}
```

**What it does:**
- Extends JpaRepository for CRUD operations
- Generic parameters: `<Todo, Long>` → Entity type and ID type
- Spring automatically creates implementation at runtime
- Provides methods: `save()`, `findById()`, `findAll()`, `delete()`, etc.

**Available Methods (inherited from JpaRepository):**
```java
save(Todo)                      // Insert or Update
findById(Long)                  // Returns Optional<Todo>
findAll()                       // Returns List<Todo>
findAll(Pageable)               // Returns Page<Todo>
delete(Todo)                    // Delete by object
deleteById(Long)                // Delete by ID
count()                         // Total records
exists(Long)                    // Check if exists
```

---

### 3. **TodoService.java** (Business Logic Layer)

```java
@Service
public class TodoService {
    @Autowired
    private ToDoRepository toDoRepository;

    // Business logic methods...
}
```

**Responsibilities:**
- Contains business logic
- Orchestrates data operations
- Transaction management
- Exception handling
- Data validation

**Methods Explained:**

| Method | Purpose | Returns |
|--------|---------|---------|
| `createTodo(Todo)` | Saves new todo | Saved Todo with ID |
| `getTodoById(Long)` | Retrieves single todo | Todo object |
| `gettodos()` | Fetches all todos | List<Todo> |
| `getAllTodosPages(page, size)` | Paginated retrieval | Page<Todo> |
| `updateTodo(Todo)` | Updates existing todo | Updated Todo |
| `deleteTodoById(Long)` | Deletes by ID | void |

---

### 4. **ToDoController.java** (HTTP Request Handler)

```java
@RestController
@RequestMapping("/api/v1/todo")
@Slf4j
public class ToDoController {
    @Autowired
    private TodoService todoService;
    // Endpoint mappings...
}
```

**Annotations Explained:**
- `@RestController` - Marks as RESTful controller (returns JSON)
- `@RequestMapping("/api/v1/todo")` - Base path for all endpoints
- `@Slf4j` - Lombok logger for logging
- `@Autowired` - Dependency injection of TodoService

**Key Endpoints:**

| Method | Path | HTTP Verb | Action |
|--------|------|-----------|--------|
| `createUser()` | `/create` | POST | Create |
| `gettodos()` | `/` | GET | List all |
| `getTodoById()` | `/{id}` | GET | Get by ID |
| `getTodosPaged()` | `/page` | GET | Paginated list |
| `updateTodoById()` | `/` | PUT | Update |
| `deleteTodoById()` | `/{id}` | DELETE | Delete |

---

### 5. **SecurityConfig.java** (Authentication)

```java
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
            .httpBasic(Customizer.withDefaults());
        return http.build();
    }
}
```

**Configuration Explained:**
- `@Configuration` - Spring bean configuration class
- `@Bean` - Creates SecurityFilterChain bean
- `.csrf().disable()` - Disables Cross-Site Request Forgery (ok for APIs)
- `.authorizeHttpRequests()` - Authorization rules
- `.anyRequest().authenticated()` - All paths require authentication
- `.httpBasic()` - Enables HTTP Basic Auth scheme

**Authentication Flow:**
```
Client → Authorization Header → Spring Security Filter
         ↓
    Validate Credentials Against UserDetailsService
         ↓
    Load Default User (admin/1234)
         ↓
    Match & Authenticate
         ↓
    Grant Access or 401 Unauthorized
```

---

### 6. **HelloWorldController.java** (Test Endpoint)

```java
@RestController
public class HelloWorldController {
    @GetMapping("/h")
    String sayhelloworld(){
        return "hello world";
    }
}
```

**Purpose:** Simple health check endpoint to verify application is running

---

## 🔄 Request Lifecycle

```
┌───────────────────────────────────────────────────────────────┐
│ 1. HTTP Request Arrives at Application                        │
│    POST /api/v1/todo/create                                   │
│    Authorization: Basic YWRtaW46MTIzNA==                       │
│    Body: { title, description, isCompleted }                  │
└─────────────────────┬─────────────────────────────────────────┘
                      │
┌─────────────────────▼─────────────────────────────────────────┐
│ 2. DispatcherServlet Routes Request                           │
│    • Identifies controller & method                           │
│    • Extracts RequestBody                                     │
└─────────────────────┬─────────────────────────────────────────┘
                      │
┌─────────────────────▼─────────────────────────────────────────┐
│ 3. Security Filter Chain Executes                             │
│    • Extracts Authorization header                            │
│    • Decodes Base64 credentials                               │
│    • Queries UserDetailsService                               │
│    • Validates credentials                                    │
│    • Sets SecurityContext if valid                            │
└─────────────────────┬─────────────────────────────────────────┘
                      │
                      ├─── Invalid? → Return 401 Unauthorized
                      │
┌─────────────────────▼─────────────────────────────────────────┐
│ 4. ToDoController.createUser() Invoked                        │
│    • @RequestBody Todo auto-mapped from JSON                  │
│    • Calls todoService.createTodo(todo)                       │
└─────────────────────┬─────────────────────────────────────────┘
                      │
┌─────────────────────▼─────────────────────────────────────────┐
│ 5. TodoService.createTodo() Executes                          │
│    • Validates business logic                                 │
│    • Calls toDoRepository.save(todo)                          │
│    • Manages transaction                                      │
└─────────────────────┬─────────────────────────────────────────┘
                      │
┌─────────────────────▼─────────────────────────────────────────┐
│ 6. JPA/Hibernate Generates SQL                                │
│    INSERT INTO todo (title, description, is_completed)       │
│    VALUES ('...', '...', false)                               │
└─────────────────────┬─────────────────────────────────────────┘
                      │
┌─────────────────────▼─────────────────────────────────────────┐
│ 7. PostgreSQL Database Executes                               │
│    • Inserts row                                              │
│    • Generates ID (SEQUENCE/SERIAL)                           │
│    • Returns inserted record                                  │
└─────────────────────┬─────────────────────────────────────────┘
                      │
┌─────────────────────▼─────────────────────────────────────────┐
│ 8. Response Marshalling                                       │
│    • Todo entity → JSON serialization                         │
│    • Includes generated ID                                    │
│    • Sets HTTP status 201 CREATED                             │
│    • Sends HTTP response                                      │
└─────────────────────┬─────────────────────────────────────────┘
                      │
┌─────────────────────▼─────────────────────────────────────────┐
│ 9. Response Returned to Client                                │
│    HTTP 201 Created                                           │
│    {                                                          │
│      "id": 1,                                                 │
│      "title": "...",                                          │
│      "description": "...",                                    │
│      "isCompleted": false                                     │
│    }                                                          │
└───────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Design Patterns Used

### 1. **MVC/REST Architecture**
- Separation of concerns
- Controllers handle HTTP
- Services handle logic
- Repositories handle data

### 2. **Dependency Injection (@Autowired)**
- TodoService injected into Controller
- ToDoRepository injected into Service
- Loose coupling, easy testing

### 3. **Spring Bean Management**
- `@Repository`, `@Service`, `@RestController`, `@Configuration`
- Automatic lifecycle management
- Singleton pattern by default

### 4. **JPA Entity Mapping**
- `@Entity` marks POJO as database entity
- `@Id` & `@GeneratedValue` for auto-incrementing PK
- Hibernate handles SQL generation

### 5. **Exception Handling**
- Try-catch in Controller
- Logging with @Slf4j
- Graceful error responses

---

## 📊 Database Relationships

Currently the system has a **simple schema** with one table:

```
┌─────────────────────────────────────────┐
│            TODO TABLE                   │
├─────────────────────────────────────────┤
│ id (BIGSERIAL PK)                       │
│ title (VARCHAR NOT NULL)                │
│ description (VARCHAR NOT NULL)          │
│ is_completed (BOOLEAN)                  │
└─────────────────────────────────────────┘
```

**No relationships currently:** Single-entity model

---

## 🔍 Current State Analysis

### ✅ What's Implemented:
- Basic CRUD operations
- PostgreSQL integration
- HTTP Basic Authentication
- Pagination support
- Logging with Lombok
- Validation constraints
- API documentation setup (Swagger)
- Transaction management (implicit)

### ⚠️ Areas for Improvement:

1. **Security**
   - Hardcoded credentials in properties
   - No JWT or OAuth2 support
   - No role-based access control (RBAC)
   - All endpoints require same auth
   - Consider: JWT tokens, OAuth2, user registration

2. **Database**
   - No user entity to track who owns todos
   - No timestamps (created_at, updated_at)
   - Single table design is limiting
   - Consider: User management, soft deletes, auditing

3. **API**
   - Mixed endpoint naming conventions
   - Some unused/incomplete endpoints
   - GET /get returns string (inconsistent)
   - No API versioning header support
   - Consider: Consistent naming, versioning

4. **Error Handling**
   - Basic exception handling
   - No global exception handler
   - No custom error responses
   - Consider: @ControllerAdvice, detailed error messages

5. **Testing**
   - No unit tests implemented
   - No integration tests
   - Consider: JUnit 5, Mockito, TestContainers

6. **Documentation**
   - Basic Swagger setup (not fully configured)
   - No README or API documentation
   - Consider: Swagger annotations, API docs

7. **Performance**
   - No caching
   - N+1 query potential
   - No request/response validation at boundary
   - Consider: Spring Cache, Query optimization, DTOs

---

## 🚀 Running the Application

### Prerequisites:
```bash
# Install Java 21
# Install PostgreSQL
# Create database
psql -U postgres -c "CREATE DATABASE todo;"
```

### Start Application:
```bash
cd /path/to/ToDo
mvn spring-boot:run
```

### Test Endpoints:
```bash
# Using curl with Basic Auth
curl -u admin:1234 http://localhost:8080/api/v1/todo

# Create todo
curl -u admin:1234 -X POST http://localhost:8080/api/v1/todo/create \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test todo","isCompleted":false}'
```

### Access Swagger UI:
```
http://localhost:8080/swagger-ui.html
```

---

## 📚 Project File Structure

```
ToDo/
├── pom.xml                          # Maven dependencies & build config
├── src/
│   ├── main/
│   │   ├── java/dev/io/ToDo/
│   │   │   ├── ToDoApplication.java          # Entry point
│   │   │   ├── ToDoController.java           # REST endpoints
│   │   │   ├── TodoService.java              # Business logic
│   │   │   ├── ToDoRepository.java           # Data access
│   │   │   ├── SecurityConfig.java           # Security setup
│   │   │   ├── HelloWorldController.java     # Test endpoint
│   │   │   └── models/
│   │   │       └── Todo.java                 # Entity model
│   │   └── resources/
│   │       └── application.properties        # Config & credentials
│   └── test/
│       └── java/dev/io/ToDo/
│           └── ToDoApplicationTests.java     # Test class
└── target/                          # Compiled output (Maven)
```

---

## 🎓 Interview Talking Points

### Q: What's the architecture of this application?
**A:** It follows a **3-layer architecture pattern:**
- **Controller Layer** - Handles HTTP requests and responses
- **Service Layer** - Contains business logic and validation
- **Repository Layer** - Manages database operations using JPA

### Q: How does the data flow from client to database?
**A:** HTTP Request → Security Filter (auth) → Controller → Service → Repository → JPA/Hibernate → SQL → PostgreSQL → Response

### Q: What database are you using?
**A:** PostgreSQL. The application uses Spring Data JPA with Hibernate as ORM for database abstraction.

### Q: How is security implemented?
**A:** HTTP Basic Authentication. All endpoints are protected. Credentials are provided in the Authorization header, validated against the default user (admin/1234).

### Q: What are the main endpoints?
**A:** CRUD operations on todos - Create, Read (by ID, all, paginated), Update, and Delete at `/api/v1/todo` base path.

### Q: What improvements would you make?
**A:**
1. Implement JWT authentication instead of Basic Auth
2. Add user management - each todo should belong to a user
3. Add timestamps (created_at, updated_at)
4. Implement global exception handling
5. Add comprehensive unit and integration tests
6. Add request/response DTOs for better API design
7. Implement pagination correctly (currently basic)
8. Add audit logging
9. Implement caching for frequently accessed data
10. Add validation error responses with detailed messages

---

## 🔐 Security Considerations

**Current Setup:**
- ✅ CSRF disabled (acceptable for stateless API)
- ✅ Authentication required for all endpoints
- ❌ Credentials hardcoded in properties
- ❌ No role-based access control
- ❌ No token expiration
- ❌ HTTP Basic Auth less ideal for production

**Recommendations:**
1. Move credentials to environment variables
2. Implement JWT token-based authentication
3. Add OAuth2 for third-party integration
4. Implement role-based access control
5. Use HTTPS in production
6. Add rate limiting
7. Implement input validation and sanitization

---

## 📞 Summary

This is a **foundational Spring Boot REST API** for a Todo management system with:
- ✅ PostgreSQL backend
- ✅ JPA/Hibernate ORM
- ✅ Basic Spring Security authentication
- ✅ RESTful API design
- ⚠️ Room for security improvements
- ⚠️ Missing advanced features like user management
- ⚠️ Limited error handling and testing

The project demonstrates **core Spring Boot concepts** and is suitable for learning purposes. For production, significant security enhancements and feature additions would be needed.
