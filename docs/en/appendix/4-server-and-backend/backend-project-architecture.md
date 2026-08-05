# An Introduction to Backend Project Architecture

::: tip 🎯 Core Question
**From simple scripts to large distributed systems, how do you choose the right architecture for backend projects of different scales and languages?** It's like asking: from a home workshop to a large factory, how do you design different production lines based on output and processes? Good backend architecture should evolve with business growth while fully leveraging language characteristics.
:::

---

## 1. Architecture Evolution: From Script to System

### 1.1 Architecture Levels by User Count

Backend project architecture should match business scale and user volume:

| Level | Users | Concurrency | Typical Scenario | Key Focus |
|------|--------|--------|----------|------------|
| **Entry** | < 1k | < 100 | Personal projects, MVP, internal tools | Rapid development, simple deployment |
| **Intermediate** | 1k-100k | 100-10k | Enterprise systems, SaaS, mid-size platforms | Layered architecture, coding standards |
| **Enterprise** | > 100k | > 10k | Large platforms, internet applications | Microservices, high availability, performance optimization |

### 1.2 Choosing Architectural Style by Language Characteristics

Different programming languages have different design philosophies and ecosystems — architecture design should align with language characteristics:

| Language | Design Philosophy | Recommended Architecture | Representative Frameworks |
|------|----------|--------------|----------|
| **Node.js** | Event-driven, non-blocking I/O | Layered architecture + async flows | Express, NestJS, Fastify |
| **Python** | Simple and elegant, rapid development | MTV/MVC, layered architecture | Django, Flask, FastAPI |
| **Go** | Simple and efficient, native concurrency | Clean layering, microservices | Gin, Echo, Fiber |
| **Java** | Enterprise-grade, strong typing | Strict layering, domain-driven | Spring Boot, Spring Cloud |

::: tip 💡 Architecture Selection Principles
1. **Don't over-engineer**: Small projects use simple architectures; large projects need complex architectures
2. **Follow language characteristics**: Don't try to write Java-style code in Python
3. **Progressive evolution**: Start simple, optimize gradually as the business grows
4. **Team familiarity**: Choose architecture styles your team is familiar with to reduce learning costs
:::

---

## 2. Entry-Level Architecture (Users < 1k)

### 2.1 Applicable Scenarios

- Personal projects, learning exercises
- Startup MVP (Minimum Viable Product)
- Internal tools, admin dashboards
- Prototype validation, proof of concept

### 2.2 Node.js — Simple Scripting Style

**Characteristics**: Single file or simple split, quick to launch

```
my-node-api/
├── src/
│   ├── app.js              # Application entry point
│   ├── routes.js           # Route definitions
│   ├── db.js               # Database connection
│   └── utils.js            # Utility functions
├── .env                    # Environment variables
├── package.json
└── README.md
```

**Code Example**:

```javascript
// src/app.js
const express = require('express');
const app = express();

app.use(express.json());

// Routes written directly in the entry point (suitable when there are very few endpoints)
app.get('/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users');
  res.json(users);
});

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const result = await db.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email]
  );
  res.status(201).json({ id: result.insertId });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**Reference Open Source Projects**:
- [expressjs/express](https://github.com/expressjs/express) — Official examples
- [vercel/micro](https://github.com/vercel/micro) — Microservice style

### 2.3 Python — Rapid Prototyping Style

**Characteristics**: Leverage Python's simplicity for fast feature implementation

```
my-python-api/
├── app.py                  # Main application
├── models.py               # Data models
├── config.py               # Configuration
├── requirements.txt
└── README.md
```

**Code Example (Flask)**:

```python
# app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
db = SQLAlchemy(app)

# Model definitions
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

# Routes
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{'id': u.id, 'name': u.name, 'email': u.email} for u in users])

@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    user = User(name=data['name'], email=data['email'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'id': user.id}), 201

if __name__ == '__main__':
    app.run(debug=True)
```

**Reference Open Source Projects**:
- [pallets/flask](https://github.com/pallets/flask) — Official examples
- [tiangolo/fastapi](https://github.com/tiangolo/fastapi) — Modern async style

### 2.4 Go — Clean Standard Library Style

**Characteristics**: Leverage Go's standard library with minimal dependencies

```
my-go-api/
├── main.go                 # Entry point
├── handlers.go             # Handlers
├── models.go               # Models
├── db.go                   # Database
├── go.mod
└── README.md
```

**Code Example**:

```go
// main.go
package main

import (
    "database/sql"
    "encoding/json"
    "log"
    "net/http"
    _ "github.com/mattn/go-sqlite3"
)

type User struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

var db *sql.DB

func main() {
    var err error
    db, err = sql.Open("sqlite3", "./app.db")
    if err != nil {
        log.Fatal(err)
    }

    http.HandleFunc("/users", usersHandler)
    log.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}

func usersHandler(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case http.MethodGet:
        getUsers(w, r)
    case http.MethodPost:
        createUser(w, r)
    }
}

func getUsers(w http.ResponseWriter, r *http.Request) {
    rows, _ := db.Query("SELECT id, name, email FROM users")
    defer rows.Close()

    var users []User
    for rows.Next() {
        var u User
        rows.Scan(&u.ID, &u.Name, &u.Email)
        users = append(users, u)
    }

    json.NewEncoder(w).Encode(users)
}
```

**Reference Open Source Projects**:
- [golang/go](https://github.com/golang/go) — Standard library examples
- [go-chi/chi](https://github.com/go-chi/chi) — Lightweight router

### 2.5 Java — Spring Boot Starter Style

**Characteristics**: Leverage Spring Boot's auto-configuration for quick startup

```
my-spring-app/
├── src/main/java/com/example/
│   ├── controller/
│   │   └── UserController.java
│   ├── model/
│   │   └── User.java
│   ├── repository/
│   │   └── UserRepository.java
│   └── Application.java
├── src/main/resources/
│   └── application.yml
├── pom.xml
└── README.md
```

**Code Example**:

```java
// Application.java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// User.java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    // getters and setters
}

// UserRepository.java
public interface UserRepository extends JpaRepository<User, Long> {
}

// UserController.java
@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }
}
```

**Reference Open Source Projects**:
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) — Official examples
- [spring-projects/spring-petclinic](https://github.com/spring-projects/spring-petclinic) — Classic example

---

## 3. Intermediate Architecture (Users 1k–100k)

### 3.1 Applicable Scenarios

- Enterprise management systems (ERP, CRM, OA)
- SaaS applications
- E-commerce platforms
- Projects requiring multi-team collaboration

### 3.2 Layered Architecture Explained

Intermediate projects are recommended to adopt a **four-layer architecture** (Controller-Service-Repository-Model):

```
project/
├── src/
│   ├── controllers/          # Controller layer: handles HTTP requests
│   ├── services/             # Service layer: business logic
│   ├── repositories/         # Repository layer: data access
│   ├── models/               # Model layer: data structures
│   ├── middlewares/          # Middleware
│   ├── utils/                # Utility functions
│   ├── config/               # Configuration
│   └── routes/               # Route definitions
├── tests/
├── docs/
└── scripts/
```

### 3.3 Node.js — Enterprise Layered

**Reference Open Source Projects**:
- [nestjs/nest](https://github.com/nestjs/nest) — Enterprise Node.js framework
- [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices) — Node.js best practices

```
node-enterprise/
├── src/
│   ├── modules/              # Organized by feature modules
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   ├── users.module.ts
│   │   │   └── dto/
│   │   ├── orders/
│   │   └── products/
│   ├── common/               # Shared modules
│   │   ├── filters/          # Exception filters
│   │   ├── guards/           # Guards
│   │   ├── interceptors/     # Interceptors
│   │   └── pipes/            # Pipes
│   ├── config/
│   └── main.ts
```

**NestJS Code Example**:

```typescript
// users/users.controller.ts
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll(query);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}

// users/users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(query: QueryUserDto) {
    const [data, total] = await this.usersRepository.findAndCount({
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return { data, total };
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }
}
```

### 3.4 Python — Django/DRF Style

**Reference Open Source Projects**:
- [django/django](https://github.com/django/django) — Official project
- [encode/django-rest-framework](https://github.com/encode/django-rest-framework) — REST framework
- [cookiecutter/cookiecutter-django](https://github.com/cookiecutter/cookiecutter-django) — Project template

```
django-enterprise/
├── apps/
│   ├── users/                # Users app
│   │   ├── models.py
│   │   ├── views.py          # API views
│   │   ├── serializers.py    # Serializers
│   │   ├── permissions.py    # Permissions
│   │   ├── urls.py
│   │   └── tests/
│   ├── orders/
│   └── products/
├── config/                   # Project configuration
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── utils/                    # Shared utilities
├── templates/
├── static/
└── manage.py
```

**Django REST Framework Code Example**:

```python
# users/models.py
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.URLField(blank=True)

# users/serializers.py
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'avatar']

# users/views.py
from rest_framework import viewsets, permissions
from rest_framework.decorators import action

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

# users/urls.py
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = router.urls
```

### 3.5 Go — Clean Architecture Style

**Reference Open Source Projects**:
- [gin-gonic/gin](https://github.com/gin-gonic/gin) — Web framework
- [go-kit/kit](https://github.com/go-kit/kit) — Microservices toolkit
- [bxcodec/go-clean-arch](https://github.com/bxcodec/go-clean-arch) — Clean architecture example

```
go-enterprise/
├── cmd/
│   └── api/                  # Application entry point
│       └── main.go
├── internal/                 # Private code
│   ├── domain/               # Domain layer (entities, interfaces)
│   │   ├── user.go
│   │   └── repository.go
│   ├── usecase/              # Use case layer (business logic)
│   │   └── user_usecase.go
│   ├── delivery/             # Delivery layer (HTTP/gRPC)
│   │   └── http/
│   │       └── user_handler.go
│   ├── repository/           # Repository layer (data access)
│   │   └── user_repository.go
│   └── config/
├── pkg/                      # Public libraries
├── migrations/
└── go.mod
```

**Clean Architecture Code Example**:

```go
// domain/user.go
type User struct {
    ID        int64     `json:"id"`
    Username  string    `json:"username"`
    Email     string    `json:"email"`
    CreatedAt time.Time `json:"created_at"`
}

// domain/repository.go
type UserRepository interface {
    GetByID(ctx context.Context, id int64) (*User, error)
    GetByEmail(ctx context.Context, email string) (*User, error)
    Create(ctx context.Context, user *User) error
    Update(ctx context.Context, user *User) error
}

// usecase/user_usecase.go
type UserUsecase struct {
    userRepo UserRepository
}

func (u *UserUsecase) GetByID(ctx context.Context, id int64) (*User, error) {
    return u.userRepo.GetByID(ctx, id)
}

func (u *UserUsecase) Create(ctx context.Context, user *User) error {
    // Business logic: check if email already exists
    existing, _ := u.userRepo.GetByEmail(ctx, user.Email)
    if existing != nil {
        return errors.New("email already exists")
    }
    return u.userRepo.Create(ctx, user)
}

// delivery/http/user_handler.go
type UserHandler struct {
    UserUsecase *usecase.UserUsecase
}

func (h *UserHandler) GetUser(c *gin.Context) {
    id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
    user, err := h.UserUsecase.GetByID(c.Request.Context(), id)
    if err != nil {
        c.JSON(404, gin.H{"error": "user not found"})
        return
    }
    c.JSON(200, user)
}
```

### 3.6 Java — Spring Boot Enterprise

**Reference Open Source Projects**:
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot)
- [spring-cloud-samples](https://github.com/spring-cloud-samples) — Microservice examples
- [ali-baba/spring-cloud-alibaba](https://github.com/alibaba/spring-cloud-alibaba) — Alibaba microservices

```
spring-enterprise/
├── src/main/java/com/example/
│   ├── application/          # Application layer
│   │   ├── controller/       # Controllers
│   │   ├── dto/              # Data transfer objects
│   │   └── assembler/        # Assemblers
│   ├── domain/               # Domain layer
│   │   ├── entity/           # Entities
│   │   ├── valueobject/      # Value objects
│   │   ├── repository/       # Repository interfaces
│   │   └── service/          # Domain services
│   ├── infrastructure/       # Infrastructure layer
│   │   ├── repository/       # Repository implementations
│   │   ├── config/           # Configuration
│   │   └── common/           # Utility classes
│   └── Application.java
├── src/main/resources/
│   ├── application.yml
│   └── mapper/
└── src/test/
```

**Domain-Driven Design (DDD) Code Example**:

```java
// domain/entity/User.java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Embedded
    private UserStatus status;

    // Domain methods
    public void deactivate() {
        this.status = UserStatus.INACTIVE;
    }

    public boolean isActive() {
        return this.status == UserStatus.ACTIVE;
    }
}

// domain/repository/UserRepository.java
public interface UserRepository {
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    User save(User user);
    void delete(User user);
}

// application/controller/UserController.java
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserAssembler userAssembler;

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(userAssembler.toDTO(user));
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody @Valid CreateUserRequest request) {
        User user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userAssembler.toDTO(user));
    }
}

// infrastructure/repository/UserRepositoryImpl.java
@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {
    private final UserJpaRepository jpaRepository;

    @Override
    public Optional<User> findById(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public User save(User user) {
        return jpaRepository.save(user);
    }
}
```

---

## 4. Enterprise Architecture (Users > 100k)

### 4.1 Applicable Scenarios

- Large internet platforms
- Financial trading systems
- High-concurrency e-commerce systems
- Large projects requiring multi-team collaboration

### 4.2 Microservices Architecture

When a monolithic application can no longer meet requirements, consider a microservices architecture:

```
microservices-platform/
├── api-gateway/              # API Gateway
│   ├── src/
│   └── Dockerfile
├── services/                 # Business services
│   ├── user-service/         # User service
│   ├── order-service/        # Order service
│   ├── product-service/      # Product service
│   └── payment-service/      # Payment service
├── shared/                   # Shared libraries
│   ├── proto/                # Protocol Buffers
│   ├── common-lib/
│   └── event-contracts/
├── infrastructure/           # Infrastructure
│   ├── docker-compose.yml
│   ├── kubernetes/
│   └── terraform/
└── docs/
```

### 4.3 Microservices Frameworks by Language

| Language | Microservices Framework | Service Discovery | Config Center | Distributed Tracing |
|------|------------|----------|----------|----------|
| **Node.js** | NestJS + gRPC | Consul | etcd | Jaeger |
| **Python** | FastAPI + Nameko | Eureka | Consul | Zipkin |
| **Go** | Go-kit + gRPC | etcd | etcd | OpenTelemetry |
| **Java** | Spring Cloud | Nacos | Nacos | SkyWalking |

### 4.4 Codebase Design (Monorepo vs Polyrepo)

**Monorepo (Single Repository)**:

```
monorepo/
├── services/
│   ├── user-service/         # Independent service
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── order-service/
│   └── product-service/
├── shared/
│   ├── types/                # Shared types
│   ├── utils/                # Shared utilities
│   └── proto/                # Shared protocols
├── packages/
│   ├── eslint-config/        # Shared ESLint config
│   └── ts-config/            # Shared TS config
├── docker-compose.yml
└── package.json              # Root package.json
```

**Advantages**:
- Easy code sharing
- Unified build and release
- Easy refactoring

**Disadvantages**:
- Large codebase
- Complex permission management

**Polyrepo (Multiple Repositories)**:

Each service has its own repository:
- `github.com/company/user-service`
- `github.com/company/order-service`
- `github.com/company/shared-lib`

**Advantages**:
- Services evolve independently
- Team autonomy
- Clear permissions

**Disadvantages**:
- Difficult code sharing
- Complex version management

### 4.5 Data Layer Design

**Database Selection Strategy**:

| Data Type | Recommended Database | Use Case |
|----------|------------|----------|
| Relational data | PostgreSQL | Users, orders, products |
| Cache | Redis | Sessions, hot data |
| Search | Elasticsearch | Product search, logs |
| Time-series data | InfluxDB/TimescaleDB | Monitoring, metrics |
| Document data | MongoDB | Logs, configuration |

**Data Access Layer Design**:

```
data-layer/
├── primary-db/               # Primary database
│   ├── master/               # Write database
│   └── slaves/               # Read replicas
├── cache-layer/              # Cache layer
│   ├── redis-cluster/
│   └── local-cache/
├── search-engine/            # Search engine
│   └── elasticsearch/
└── message-queue/            # Message queue
    ├── kafka/
    └── rabbitmq/
```

---

## 5. Open Source Project Architecture References

### 5.1 Node.js Ecosystem

**Express.js Official Project Structure**:
```
express-project/
├── bin/                      # Startup scripts
├── public/                   # Static assets
├── routes/                   # Routes
├── views/                    # Views
├── app.js                    # Application configuration
└── package.json
```

**NestJS Official Recommendation**:
```
nest-project/
├── src/
│   ├── modules/              # Feature modules
│   ├── common/               # Shared modules
│   ├── config/
│   └── main.ts
├── test/
└── nest-cli.json
```

### 5.2 Python Ecosystem

**Django Official Project Structure**:
```
django-project/
├── project_name/             # Project configuration
├── apps/                     # Apps directory
├── templates/
├── static/
├── media/
└── manage.py
```

**FastAPI Project Structure**:
```
fastapi-project/
├── app/
│   ├── api/
│   │   ├── deps.py           # Dependencies
│   │   └── v1/
│   │       └── endpoints/
│   ├── core/                 # Core configuration
│   ├── db/                   # Database
│   ├── models/               # Models
│   ├── schemas/              # Pydantic models
│   └── main.py
├── tests/
└── alembic/                  # Migrations
```

### 5.3 Go Ecosystem

**Standard Project Layout**:
```
go-project/
├── cmd/                      # Application entry points
│   └── app/
│       └── main.go
├── internal/                 # Private code
├── pkg/                      # Public libraries
├── api/                      # API definitions
├── web/                      # Static assets
├── configs/                  # Configuration
├── scripts/                  # Scripts
└── go.mod
```

**Reference**:
- [golang-standards/project-layout](https://github.com/golang-standards/project-layout)

### 5.4 Java Ecosystem

**Spring Boot Official Structure**:
```
spring-boot-project/
├── src/main/java/com/example/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   ├── dto/
│   ├── config/
│   └── Application.java
├── src/main/resources/
│   ├── static/
│   ├── templates/
│   └── application.yml
└── src/test/
```

**Alibaba Java Development Manual**:
- Clear layering: controller/service/manager/dao
- Domain models: distinguish DO/DTO/BO/VO
- Package structure: organized by feature modules

---

## 6. Architecture Evolution Roadmap

### 6.1 Evolution Example

```
Phase 1: Monolithic Application (Entry Level)
    ↓ User growth, team expansion
Phase 2: Layered Architecture (Intermediate Level)
    ↓ Business complexity, multi-team collaboration
Phase 3: Modular/Microservices (Enterprise Level)
    ↓ High concurrency, high availability requirements
Phase 4: Cloud-Native Architecture (Platform Level)
```

### 6.2 Criteria for to Upgrade Architecture

| Signal | Current Level | Recommended Upgrade |
|------|----------|----------|
| Code files > 50 | Entry | Intermediate |
| Build time > 5 minutes | Intermediate | Modular |
| Team > 10 people | Intermediate | Microservices |
| DAU > 100k | Intermediate | Enterprise |
| Multi-language tech stack | Monolith | Microservices |

---

## 7. Summary

::: tip 💡 Core Ideas
**Architecture serves the business, not architecture for architecture's sake.**

**Choose by user count**:
- **< 1k**: Simple scripts, quick to launch
- **1k–100k**: Layered architecture, coding standards
- **> 100k**: Microservices, high-availability design

**Choose by language**:
- **Node.js**: Leverage async characteristics, suitable for I/O-intensive workloads
- **Python**: Rapid development, suitable for data processing and AI
- **Go**: High performance, suitable for cloud-native and microservices
- **Java**: Enterprise-grade, suitable for large complex systems

**Universal principles**:
1. **Progressive evolution**: Start simple, grow with the business
2. **Convention over configuration**: Unified standards reduce communication costs
3. **Automated testing**: Ensure safe refactoring
4. **Documentation first**: Record architectural decisions

**The ultimate goal**: Make your code run as efficiently as a factory floor, regardless of scale.
:::

---

## Reference Resources

### Open Source Projects
- [nestjs/nest](https://github.com/nestjs/nest) — Node.js enterprise framework
- [django/django](https://github.com/django/django) — Python web framework
- [gin-gonic/gin](https://github.com/gin-gonic/gin) — Go web framework
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) — Java framework

### Architecture Guides
- [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices) — Node.js best practices
- [golang-standards/project-layout](https://github.com/golang-standards/project-layout) — Go project layout
- [cookiecutter/cookiecutter-django](https://github.com/cookiecutter/cookiecutter-django) — Django project template
- [ali-baba/spring-cloud-alibaba](https://github.com/alibaba/spring-cloud-alibaba) — Alibaba microservices

### Books
- *Clean Architecture* — Robert C. Martin
- *Building Microservices* — Sam Newman
- *Designing Data-Intensive Applications* — Martin Kleppmann