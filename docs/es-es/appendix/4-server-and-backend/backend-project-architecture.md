# Introducción a la arquitectura de proyectos backend

::: tip 🎯 Pregunta Central
**Desde scripts simples hasta grandes sistemas distribuidos, ¿cómo elegir la arquitectura adecuada para proyectos backend de diferentes escalas y lenguajes?** Es como preguntar: desde un pequeño taller hasta una gran fábrica, ¿cómo diseñar diferentes líneas de producción según el volumen y el proceso? Una buena arquitectura backend debe evolucionar con el crecimiento del negocio, aprovechando al mismo tiempo las características del lenguaje.
:::

---

## 1. Evolución de la Arquitectura: Del Script al Sistema

### 1.1 Niveles de Arquitectura según el Número de Usuarios

La arquitectura del proyecto backend debe coincidir con la escala del negocio y el volumen de usuarios:

| Nivel | Usuarios | Concurrencia | Escenario Típico | Enfoque Principal |
|------|--------|--------|----------|------------|
| **Básico** | < 1k | < 100 | Proyectos personales, MVP, herramientas internas | Desarrollo rápido, despliegue simple |
| **Intermedio** | 1k-100k | 100-10k | Sistemas empresariales, SaaS, plataformas medianas | Arquitectura en capas, estándares de código |
| **Empresarial** | > 100k | > 10k | Grandes plataformas, aplicaciones de internet | Microservicios, alta disponibilidad, optimización de rendimiento |

### 1.2 Elección del Estilo Arquitectónico según las Características del Lenguaje

Cada lenguaje de programación tiene su propia filosofía de diseño y ecosistema. El diseño de la arquitectura debe adaptarse a las características del lenguaje:

| Lenguaje | Filosofía de Diseño | Estilo Arquitectónico Recomendado | Frameworks Representativos |
|------|----------|--------------|----------|
| **Node.js** | Orientado a eventos, E/S no bloqueante | Arquitectura en capas + flujo asíncrono | Express, NestJS, Fastify |
| **Python** | Simplicidad y elegancia, desarrollo rápido | MTV/MVC, arquitectura en capas | Django, Flask, FastAPI |
| **Go** | Simple y eficiente, concurrencia nativa | Capas simples, microservicios | Gin, Echo, Fiber |
| **Java** | Nivel empresarial, tipado fuerte | Capas estrictas, diseño guiado por dominio | Spring Boot, Spring Cloud |

::: tip 💡 Principios de Elección de Arquitectura
1. **No sobrediseñar**: los proyectos pequeños usan arquitecturas simples, los grandes necesitan arquitecturas complejas
2. **Adaptarse a las características del lenguaje**: no intentes escribir código con estilo Java en Python
3. **Evolución progresiva**: comienza simple y optimiza gradualmente con el crecimiento del negocio
4. **Familiaridad del equipo**: elige un estilo arquitectónico que el equipo conozca para reducir el costo de aprendizaje
:::

---

## 2. Arquitectura de Nivel Básico (Usuarios < 1k)

### 2.1 Escenarios Aplicables

- Proyectos personales, ejercicios de aprendizaje
- MVP de startups (Producto Mínimo Viable)
- Herramientas internas, paneles de administración
- Validación de prototipos, demostraciones de concepto

### 2.2 Node.js - Estilo de Script Simple

**Características**: Archivo único o división simple, puesta en marcha rápida

```
my-node-api/
├── src/
│   ├── app.js              # Punto de entrada de la aplicación
│   ├── routes.js           # Definición de rutas
│   ├── db.js               # Conexión a base de datos
│   └── utils.js            # Funciones de utilidad
├── .env                    # Variables de entorno
├── package.json
└── README.md
```

**Ejemplo de código**:

```javascript
// src/app.js
const express = require('express');
const app = express();

app.use(express.json());

// Rutas escritas directamente en el punto de entrada (para pocos endpoints)
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

**Proyectos open source de referencia**:
- [expressjs/express](https://github.com/expressjs/express) - Ejemplos oficiales
- [vercel/micro](https://github.com/vercel/micro) - Estilo de microservicios

### 2.3 Python - Estilo de Prototipado Rápido

**Características**: Aprovecha la simplicidad de Python para implementar funcionalidades rápidamente

```
my-python-api/
├── app.py                  # Aplicación principal
├── models.py               # Modelos de datos
├── config.py               # Configuración
├── requirements.txt
└── README.md
```

**Ejemplo de código (Flask)**:

```python
# app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
db = SQLAlchemy(app)

# Definición del modelo
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

# Rutas
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

**Proyectos open source de referencia**:
- [pallets/flask](https://github.com/pallets/flask) - Ejemplos oficiales
- [tiangolo/fastapi](https://github.com/tiangolo/fastapi) - Estilo asíncrono moderno

### 2.4 Go - Estilo de Biblioteca Estándar Simple

**Características**: Aprovecha la biblioteca estándar de Go, con mínimas dependencias

```
my-go-api/
├── main.go                 # Punto de entrada
├── handlers.go             # Manejadores
├── models.go               # Modelos
├── db.go                   # Base de datos
├── go.mod
└── README.md
```

**Ejemplo de código**:

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

**Proyectos open source de referencia**:
- [golang/go](https://github.com/golang/go) - Ejemplos de la biblioteca estándar
- [go-chi/chi](https://github.com/go-chi/chi) - Enrutador ligero

### 2.5 Java - Estilo de Inicio con Spring Boot

**Características**: Aprovecha la configuración automática de Spring Boot para un inicio rápido

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

**Ejemplo de código**:

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

**Proyectos open source de referencia**:
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) - Ejemplos oficiales
- [spring-projects/spring-petclinic](https://github.com/spring-projects/spring-petclinic) - Ejemplo clásico

---

## 3. Arquitectura de Nivel Intermedio (Usuarios 1k-100k)

### 3.1 Escenarios Aplicables

- Sistemas de gestión empresarial (ERP, CRM, OA)
- Aplicaciones SaaS
- Plataformas de comercio electrónico
- Proyectos que requieren colaboración entre múltiples equipos

### 3.2 Explicación Detallada de la Arquitectura en Capas

Para proyectos de nivel intermedio se recomienda una **arquitectura de cuatro capas** (Controller-Service-Repository-Model):

```
project/
├── src/
│   ├── controllers/          # Capa de control: maneja las peticiones HTTP
│   ├── services/             # Capa de servicio: lógica de negocio
│   ├── repositories/         # Capa de datos: acceso a datos
│   ├── models/               # Capa de modelo: estructuras de datos
│   ├── middlewares/          # Middleware
│   ├── utils/                # Funciones de utilidad
│   ├── config/               # Configuración
│   └── routes/               # Definición de rutas
├── tests/
├── docs/
└── scripts/
```

### 3.3 Node.js - Capas de Nivel Empresarial

**Proyectos open source de referencia**:
- [nestjs/nest](https://github.com/nestjs/nest) - Framework Node.js de nivel empresarial
- [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices) - Mejores prácticas de Node.js

```
node-enterprise/
├── src/
│   ├── modules/              # Organizado por módulos funcionales
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   ├── users.module.ts
│   │   │   └── dto/
│   │   ├── orders/
│   │   └── products/
│   ├── common/               # Módulos compartidos
│   │   ├── filters/          # Filtros de excepción
│   │   ├── guards/           # Guards
│   │   ├── interceptors/     # Interceptores
│   │   └── pipes/            # Pipes
│   ├── config/
│   └── main.ts
```

**Ejemplo de código NestJS**:

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

### 3.4 Python - Estilo Django/DRF

**Proyectos open source de referencia**:
- [django/django](https://github.com/django/django) - Proyecto oficial
- [encode/django-rest-framework](https://github.com/encode/django-rest-framework) - Framework REST
- [cookiecutter/cookiecutter-django](https://github.com/cookiecutter/cookiecutter-django) - Plantilla de proyecto

```
django-enterprise/
├── apps/
│   ├── users/                # Aplicación de usuarios
│   │   ├── models.py
│   │   ├── views.py          # Vistas API
│   │   ├── serializers.py    # Serializadores
│   │   ├── permissions.py    # Permisos
│   │   ├── urls.py
│   │   └── tests/
│   ├── orders/
│   └── products/
├── config/                   # Configuración del proyecto
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── utils/                    # Utilidades compartidas
├── templates/
├── static/
└── manage.py
```

**Ejemplo de código Django REST Framework**:

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

### 3.5 Go - Estilo de Arquitectura Limpia

**Proyectos open source de referencia**:
- [gin-gonic/gin](https://github.com/gin-gonic/gin) - Framework Web
- [go-kit/kit](https://github.com/go-kit/kit) - Kit de herramientas para microservicios
- [bxcodec/go-clean-arch](https://github.com/bxcodec/go-clean-arch) - Ejemplo de arquitectura limpia

```
go-enterprise/
├── cmd/
│   └── api/                  # Punto de entrada de la aplicación
│       └── main.go
├── internal/                 # Código privado
│   ├── domain/               # Capa de dominio (entidades, interfaces)
│   │   ├── user.go
│   │   └── repository.go
│   ├── usecase/              # Capa de casos de uso (lógica de negocio)
│   │   └── user_usecase.go
│   ├── delivery/             # Capa de entrega (HTTP/gRPC)
│   │   └── http/
│   │       └── user_handler.go
│   ├── repository/           # Capa de repositorio (acceso a datos)
│   │   └── user_repository.go
│   └── config/
├── pkg/                      # Biblioteca pública
├── migrations/
└── go.mod
```

**Ejemplo de código de Arquitectura Limpia**:

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
    // Lógica de negocio: verificar si el email ya existe
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

### 3.6 Java - Spring Boot de Nivel Empresarial

**Proyectos open source de referencia**:
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot)
- [spring-cloud-samples](https://github.com/spring-cloud-samples) - Ejemplos de microservicios
- [ali-baba/spring-cloud-alibaba](https://github.com/alibaba/spring-cloud-alibaba) - Microservicios de Alibaba

```
spring-enterprise/
├── src/main/java/com/example/
│   ├── application/          # Capa de aplicación
│   │   ├── controller/       # Controladores
│   │   ├── dto/              # Objetos de transferencia de datos
│   │   └── assembler/        # Ensambladores
│   ├── domain/               # Capa de dominio
│   │   ├── entity/           # Entidades
│   │   ├── valueobject/      # Objetos de valor
│   │   ├── repository/       # Interfaces de repositorio
│   │   └── service/          # Servicios de dominio
│   ├── infrastructure/       # Capa de infraestructura
│   │   ├── repository/       # Implementaciones de repositorio
│   │   ├── config/           # Configuración
│   │   └── common/           # Clases de utilidad
│   └── Application.java
├── src/main/resources/
│   ├── application.yml
│   └── mapper/
└── src/test/
```

**Ejemplo de código de Diseño Guiado por Dominio (DDD)**:

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

    // Métodos de dominio
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

## 4. Arquitectura de Nivel Empresarial (Usuarios > 100k)

### 4.1 Escenarios Aplicables

- Grandes plataformas de internet
- Sistemas de comercio financiero
- Sistemas de comercio electrónico de alta concurrencia
- Grandes proyectos que requieren colaboración entre múltiples equipos

### 4.2 Arquitectura de Microservicios

Cuando una aplicación monolítica ya no satisface las necesidades, se debe considerar la arquitectura de microservicios:

```
microservices-platform/
├── api-gateway/              # API Gateway
│   ├── src/
│   └── Dockerfile
├── services/                 # Servicios de negocio
│   ├── user-service/         # Servicio de usuarios
│   ├── order-service/        # Servicio de pedidos
│   ├── product-service/      # Servicio de productos
│   └── payment-service/      # Servicio de pagos
├── shared/                   # Biblioteca compartida
│   ├── proto/                # Protocol Buffers
│   ├── common-lib/
│   └── event-contracts/
├── infrastructure/           # Infraestructura
│   ├── docker-compose.yml
│   ├── kubernetes/
│   └── terraform/
└── docs/
```

### 4.3 Frameworks de Microservicios por Lenguaje

| Lenguaje | Framework de Microservicios | Descubrimiento de Servicios | Centro de Configuración | Trazabilidad |
|------|------------|----------|----------|----------|
| **Node.js** | NestJS + gRPC | Consul | etcd | Jaeger |
| **Python** | FastAPI + Nameko | Eureka | Consul | Zipkin |
| **Go** | Go-kit + gRPC | etcd | etcd | OpenTelemetry |
| **Java** | Spring Cloud | Nacos | Nacos | SkyWalking |

### 4.4 Diseño de Repositorios de Código (Monorepo vs Polyrepo)

**Monorepo (Repositorio único)**:

```
monorepo/
├── services/
│   ├── user-service/         # Servicio independiente
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── order-service/
│   └── product-service/
├── shared/
│   ├── types/                # Tipos compartidos
│   ├── utils/                # Utilidades compartidas
│   └── proto/                # Protocolos compartidos
├── packages/
│   ├── eslint-config/        # Configuración ESLint compartida
│   └── ts-config/            # Configuración TS compartida
├── docker-compose.yml
└── package.json              # package.json raíz
```

**Ventajas**:
- Compartir código fácilmente
- Construcción y publicación unificadas
- Refactorización sencilla

**Desventajas**:
- Repositorio de código muy grande
- Gestión de permisos compleja

**Polyrepo (Múltiples repositorios)**:

Cada servicio tiene su propio repositorio:
- `github.com/company/user-service`
- `github.com/company/order-service`
- `github.com/company/shared-lib`

**Ventajas**:
- Evolución independiente de los servicios
- Autonomía de equipos
- Permisos claros

**Desventajas**:
- Compartir código es difícil
- Gestión de versiones compleja

### 4.5 Diseño de la Capa de Datos

**Estrategia de Selección de Base de Datos**:

| Tipo de Dato | Base de Datos Recomendada | Escenario Aplicable |
|----------|------------|----------|
| Datos relacionales | PostgreSQL | Usuarios, pedidos, productos |
| Caché | Redis | Sesiones, datos calientes |
| Búsqueda | Elasticsearch | Búsqueda de productos, logs |
| Datos de series temporales | InfluxDB/TimescaleDB | Monitoreo, métricas |
| Datos de documentos | MongoDB | Logs, configuración |

**Diseño de la Capa de Acceso a Datos**:

```
data-layer/
├── primary-db/               # Base de datos principal
│   ├── master/               # Base de datos de escritura
│   └── slaves/               # Bases de datos de lectura
├── cache-layer/              # Capa de caché
│   ├── redis-cluster/
│   └── local-cache/
├── search-engine/            # Motor de búsqueda
│   └── elasticsearch/
└── message-queue/            # Cola de mensajes
    ├── kafka/
    └── rabbitmq/
```

---

## 5. Referencia de Estándares de Arquitectura de Proyectos Open Source

### 5.1 Ecosistema Node.js

**Estructura oficial de proyecto Express.js**:
```
express-project/
├── bin/                      # Scripts de inicio
├── public/                   # Recursos estáticos
├── routes/                   # Rutas
├── views/                    # Vistas
├── app.js                    # Configuración de la aplicación
└── package.json
```

**Recomendación oficial de NestJS**:
```
nest-project/
├── src/
│   ├── modules/              # Módulos funcionales
│   ├── common/               # Módulos compartidos
│   ├── config/
│   └── main.ts
├── test/
└── nest-cli.json
```

### 5.2 Ecosistema Python

**Estructura oficial de proyecto Django**:
```
django-project/
├── project_name/             # Configuración del proyecto
├── apps/                     # Directorio de aplicaciones
├── templates/
├── static/
├── media/
└── manage.py
```

**Estructura de proyecto FastAPI**:
```
fastapi-project/
├── app/
│   ├── api/
│   │   ├── deps.py           # Dependencias
│   │   └── v1/
│   │       └── endpoints/
│   ├── core/                 # Configuración central
│   ├── db/                   # Base de datos
│   ├── models/               # Modelos
│   ├── schemas/              # Modelos Pydantic
│   └── main.py
├── tests/
└── alembic/                  # Migraciones
```

### 5.3 Ecosistema Go

**Diseño de proyecto estándar**:
```
go-project/
├── cmd/                      # Punto de entrada de la aplicación
│   └── app/
│       └── main.go
├── internal/                 # Código privado
├── pkg/                      # Biblioteca pública
├── api/                      # Definiciones de API
├── web/                      # Recursos estáticos
├── configs/                  # Configuración
├── scripts/                  # Scripts
└── go.mod
```

**Referencia**:
- [golang-standards/project-layout](https://github.com/golang-standards/project-layout)

### 5.4 Ecosistema Java

**Estructura oficial de Spring Boot**:
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

**Manual de Desarrollo Java de Alibaba**:
- Capas claras: controller/service/manager/dao
- Modelos de dominio: distinción entre DO/DTO/BO/VO
- Estructura de paquetes: organizada por módulos funcionales

---

## 6. Hoja de Ruta de Evolución Arquitectónica

### 6.1 Ejemplo de Evolución

```
Fase 1: Aplicación monolítica (Nivel Básico)
    ↓ Crecimiento de usuarios, expansión del equipo
Fase 2: Arquitectura en capas (Nivel Intermedio)
    ↓ Complejidad del negocio, colaboración entre equipos
Fase 3: Modularización/Microservicios (Nivel Empresarial)
    ↓ Alta concurrencia, requisitos de alta disponibilidad
Fase 4: Arquitectura Cloud Native (Nivel Plataforma)
```

### 6.2 Criterios de Actualizar la Arquitectura

| Señal | Nivel Actual | Actualización Recomendada |
|------|----------|----------|
| Más de 50 archivos de código | Básico | Intermedio |
| Tiempo de compilación > 5 minutos | Intermedio | Modularizado |
| Equipo > 10 personas | Intermedio | Microservicios |
| Usuarios activos diarios > 100k | Intermedio | Empresarial |
| Stack tecnológico multilingüe | Monolítico | Microservicios |

---

## 7. Resumen

::: tip 💡 Idea Central
**La arquitectura sirve al negocio, no se hace arquitectura por la arquitectura misma.**

**Elegir según el número de usuarios**:
- **< 1k**: Scripts simples, puesta en marcha rápida
- **1k-100k**: Arquitectura en capas, estándares de código
- **> 100k**: Microservicios, diseño de alta disponibilidad

**Elegir según el lenguaje**:
- **Node.js**: Aprovecha las características asíncronas, adecuado para operaciones intensivas de E/S
- **Python**: Desarrollo rápido, adecuado para procesamiento de datos e IA
- **Go**: Alto rendimiento, adecuado para cloud native y microservicios
- **Java**: Nivel empresarial, adecuado para sistemas grandes y complejos

**Principios universales**:
1. **Evolución progresiva**: Comienza simple y crece con el negocio
2. **Convención sobre configuración**: Estándares unificados para reducir costos de comunicación
3. **Pruebas automatizadas**: Garantizan la seguridad de las refactorizaciones
4. **Documentación primero**: Las decisiones arquitectónicas deben documentarse

**Objetivo final**: Hacer que el código funcione como una línea de producción en una fábrica, eficientemente sin importar la escala.
:::

---

## Recursos de Referencia

### Proyectos Open Source
- [nestjs/nest](https://github.com/nestjs/nest) - Framework Node.js de nivel empresarial
- [django/django](https://github.com/django/django) - Framework Web Python
- [gin-gonic/gin](https://github.com/gin-gonic/gin) - Framework Web Go
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) - Framework Java

### Guías de Arquitectura
- [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices) - Mejores prácticas de Node.js
- [golang-standards/project-layout](https://github.com/golang-standards/project-layout) - Diseño de proyectos Go
- [cookiecutter/cookiecutter-django](https://github.com/cookiecutter/cookiecutter-django) - Plantilla de proyecto Django
- [ali-baba/spring-cloud-alibaba](https://github.com/alibaba/spring-cloud-alibaba) - Microservicios de Alibaba

### Libros
- 《Clean Architecture》- Robert C. Martin
- 《Building Microservices》- Sam Newman
- 《Designing Data-Intensive Applications》- Martin Kleppmann