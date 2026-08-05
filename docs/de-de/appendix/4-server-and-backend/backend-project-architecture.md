# Backend-Projektarchitektur: Grundlagen

::: tip 🎯 Kernfrage
**Von einfachen Skripten bis hin zu großen verteilten Systemen – wie wählt man die richtige Architektur für Backend-Projekte unterschiedlicher Größe und Sprache?** Es ist vergleichbar mit der Frage: Wie gestaltet man verschiedene Produktionslinien – von der Familienwerkstatt bis zur großen Fabrik – je nach Produktionsvolumen und Fertigungsprozess? Eine gute Backend-Architektur sollte mit dem Geschäftswachstum evolvieren und gleichzeitig die Sprachmerkmale voll ausschöpfen.
:::

---

## 1. Architekturentwicklung: Vom Skript zum System

### 1.1 Architekturebenen nach Nutzerzahl

Die Architektur eines Backend-Projekts sollte zur Geschäftsgröße und Nutzerzahl passen:

| Ebene | Nutzerzahl | Gleichzeitigkeit | Typische Szenarien | Kernfokus |
|------|--------|--------|----------|------------|
| **Einsteiger** | < 1k | < 100 | Persönliche Projekte, MVP, interne Tools | Schnelle Entwicklung, einfache Bereitstellung |
| **Fortgeschritten** | 1k-100k | 100-10k | Unternehmenssysteme, SaaS, mittlere Plattformen | Schichtenarchitektur, Code-Standards |
| **Enterprise** | > 100k | > 10k | Große Plattformen, Internetanwendungen | Microservices, Hochverfügbarkeit, Performance-Optimierung |

### 1.2 Architekturstil nach Sprachmerkmalen wählen

Verschiedene Programmiersprachen haben unterschiedliche Designphilosophien und Ökosysteme – das Architekturdesign sollte den Sprachmerkmalen folgen:

| Sprache | Designphilosophie | Empfohlener Architekturstil | Repräsentative Frameworks |
|------|----------|--------------|----------|
| **Node.js** | Ereignisgesteuert, nicht-blockierende I/O | Schichtenarchitektur + asynchrone Abläufe | Express, NestJS, Fastify |
| **Python** | Einfach und elegant, schnelle Entwicklung | MTV/MVC, Schichtenarchitektur | Django, Flask, FastAPI |
| **Go** | Einfach und effizient, native Nebenläufigkeit | Schlanke Schichten, Microservices | Gin, Echo, Fiber |
| **Java** | Enterprise, starke Typisierung | Strikte Schichten, Domain-Driven Design | Spring Boot, Spring Cloud |

::: tip 💡 Prinzipien der Architekturauswahl
1. **Nicht überdesignen**: Kleine Projekte nutzen einfache Architekturen, große Projekte benötigen komplexe Architekturen
2. **Den Sprachmerkmalen folgen**: Versuche nicht, Java-artigen Code in Python zu schreiben
3. **Schrittweise Evolution**: Beginne einfach und optimiere schrittweise mit dem Geschäftswachstum
4. **Team-Vertrautheit**: Wähle einen Architekturstil, den das Team kennt, um die Lernkurve zu senken
:::

---

## 2. Einsteiger-Architektur (Nutzer < 1k)

### 2.1 Anwendbare Szenarien

- Persönliche Projekte, Lernübungen
- Startup MVP (Minimum Viable Product)
- Interne Tools, Admin-Backends
- Prototyp-Validierung, Konzept-Demos

### 2.2 Node.js – Schlanker Skript-Stil

**Merkmale**: Einzeldatei oder einfache Aufteilung, schnelle Bereitstellung

```
my-node-api/
├── src/
│   ├── app.js              # Anwendungseinstieg
│   ├── routes.js           # Routen-Definitionen
│   ├── db.js               # Datenbankverbindung
│   └── utils.js            # Hilfsfunktionen
├── .env                    # Umgebungsvariablen
├── package.json
└── README.md
```

**Codebeispiel**:

```javascript
// src/app.js
const express = require('express');
const app = express();

app.use(express.json());

// Routen direkt im Einstiegspunkt (geeignet für wenige Endpunkte)
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

**Referenz-Open-Source-Projekte**:
- [expressjs/express](https://github.com/expressjs/express) - Offizielle Beispiele
- [vercel/micro](https://github.com/vercel/micro) - Microservice-Stil

### 2.3 Python – Rapid-Prototyping-Stil

**Merkmale**: Nutzt die Einfachheit von Python für schnelle Funktionsumsetzung

```
my-python-api/
├── app.py                  # Hauptanwendung
├── models.py               # Datenmodelle
├── config.py               # Konfiguration
├── requirements.txt
└── README.md
```

**Codebeispiel (Flask)**:

```python
# app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
db = SQLAlchemy(app)

# Modelldefinition
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

# Routen
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

**Referenz-Open-Source-Projekte**:
- [pallets/flask](https://github.com/pallets/flask) - Offizielle Beispiele
- [tiangolo/fastapi](https://github.com/tiangolo/fastapi) - Moderner asynchroner Stil

### 2.4 Go – Schlanker Standardbibliothek-Stil

**Merkmale**: Nutzt Gos Standardbibliothek mit minimalen Abhängigkeiten

```
my-go-api/
├── main.go                 # Einstiegspunkt
├── handlers.go             # Handler
├── models.go               # Modelle
├── db.go                   # Datenbank
├── go.mod
└── README.md
```

**Codebeispiel**:

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

**Referenz-Open-Source-Projekte**:
- [golang/go](https://github.com/golang/go) - Standardbibliothek-Beispiele
- [go-chi/chi](https://github.com/go-chi/chi) - Leichtgewichtiges Routing

### 2.5 Java – Spring Boot Einstiegs-Stil

**Merkmale**: Nutzt Spring Boots Autokonfiguration für schnellen Start

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

**Codebeispiel**:

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

**Referenz-Open-Source-Projekte**:
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) - Offizielle Beispiele
- [spring-projects/spring-petclinic](https://github.com/spring-projects/spring-petclinic) - Klassisches Beispiel

---

## 3. Fortgeschrittene Architektur (Nutzer 1k-100k)

### 3.1 Anwendbare Szenarien

- Unternehmensverwaltungssysteme (ERP, CRM, OA)
- SaaS-Anwendungen
- E-Commerce-Plattformen
- Projekte, die teamübergreifende Zusammenarbeit erfordern

### 3.2 Schichtenarchitektur im Detail

Für fortgeschrittene Projekte wird eine **Vier-Schichten-Architektur** empfohlen (Controller-Service-Repository-Model):

```
project/
├── src/
│   ├── controllers/          # Controller-Schicht: HTTP-Anfragen bearbeiten
│   ├── services/             # Service-Schicht: Geschäftslogik
│   ├── repositories/         # Daten-Schicht: Datenzugriff
│   ├── models/               # Modell-Schicht: Datenstrukturen
│   ├── middlewares/          # Middleware
│   ├── utils/                # Hilfsfunktionen
│   ├── config/               # Konfiguration
│   └── routes/               # Routen-Definitionen
├── tests/
├── docs/
└── scripts/
```

### 3.3 Node.js – Enterprise-Schichten

**Referenz-Open-Source-Projekte**:
- [nestjs/nest](https://github.com/nestjs/nest) - Enterprise Node.js Framework
- [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices) - Node.js Best Practices

```
node-enterprise/
├── src/
│   ├── modules/              # Nach Funktionsmodulen organisiert
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   ├── users.module.ts
│   │   │   └── dto/
│   │   ├── orders/
│   │   └── products/
│   ├── common/               # Gemeinsame Module
│   │   ├── filters/          # Exception-Filter
│   │   ├── guards/           # Guards
│   │   ├── interceptors/     # Interceptors
│   │   └── pipes/            # Pipes
│   ├── config/
│   └── main.ts
```

**NestJS Codebeispiel**:

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

### 3.4 Python – Django/DRF-Stil

**Referenz-Open-Source-Projekte**:
- [django/django](https://github.com/django/django) - Offizielles Projekt
- [encode/django-rest-framework](https://github.com/encode/django-rest-framework) - REST Framework
- [cookiecutter/cookiecutter-django](https://github.com/cookiecutter/cookiecutter-django) - Projektvorlage

```
django-enterprise/
├── apps/
│   ├── users/                # Benutzer-App
│   │   ├── models.py
│   │   ├── views.py          # API-Views
│   │   ├── serializers.py    # Serialisierer
│   │   ├── permissions.py    # Berechtigungen
│   │   ├── urls.py
│   │   └── tests/
│   ├── orders/
│   └── products/
├── config/                   # Projektkonfiguration
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── utils/                    # Gemeinsame Werkzeuge
├── templates/
├── static/
└── manage.py
```

**Django REST Framework Codebeispiel**:

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

### 3.5 Go – Clean-Architecture-Stil

**Referenz-Open-Source-Projekte**:
- [gin-gonic/gin](https://github.com/gin-gonic/gin) - Web-Framework
- [go-kit/kit](https://github.com/go-kit/kit) - Microservices-Toolkit
- [bxcodec/go-clean-arch](https://github.com/bxcodec/go-clean-arch) - Clean-Architecture-Beispiel

```
go-enterprise/
├── cmd/
│   └── api/                  # Anwendungseinstieg
│       └── main.go
├── internal/                 # Privater Code
│   ├── domain/               # Domain-Schicht (Entitäten, Schnittstellen)
│   │   ├── user.go
│   │   └── repository.go
│   ├── usecase/              # Use-Case-Schicht (Geschäftslogik)
│   │   └── user_usecase.go
│   ├── delivery/             # Delivery-Schicht (HTTP/gRPC)
│   │   └── http/
│   │       └── user_handler.go
│   ├── repository/           # Repository-Schicht (Datenzugriff)
│   │   └── user_repository.go
│   └── config/
├── pkg/                      # Öffentliche Bibliotheken
├── migrations/
└── go.mod
```

**Clean-Architecture Codebeispiel**:

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
    // Geschäftslogik: Prüfen, ob die E-Mail bereits existiert
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

### 3.6 Java – Spring Boot Enterprise

**Referenz-Open-Source-Projekte**:
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot)
- [spring-cloud-samples](https://github.com/spring-cloud-samples) - Microservices-Beispiele
- [ali-baba/spring-cloud-alibaba](https://github.com/alibaba/spring-cloud-alibaba) - Alibaba Microservices

```
spring-enterprise/
├── src/main/java/com/example/
│   ├── application/          # Anwendungsschicht
│   │   ├── controller/       # Controller
│   │   ├── dto/              # Datenübertragungsobjekte
│   │   └── assembler/        # Assembler
│   ├── domain/               # Domain-Schicht
│   │   ├── entity/           # Entitäten
│   │   ├── valueobject/      # Wertobjekte
│   │   ├── repository/       # Repository-Schnittstellen
│   │   └── service/          # Domain-Services
│   ├── infrastructure/       # Infrastruktur-Schicht
│   │   ├── repository/       # Repository-Implementierungen
│   │   ├── config/           # Konfiguration
│   │   └── common/           # Hilfsklassen
│   └── Application.java
├── src/main/resources/
│   ├── application.yml
│   └── mapper/
└── src/test/
```

**Domain-Driven Design (DDD) Codebeispiel**:

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

    // Domain-Methoden
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

## 4. Enterprise-Architektur (Nutzer > 100k)

### 4.1 Anwendbare Szenarien

- Große Internetplattformen
- Finanztransaktionssysteme
- Hochlast-E-Commerce-Systeme
- Große Projekte, die teamübergreifende Zusammenarbeit erfordern

### 4.2 Microservices-Architektur

Wenn eine monolithische Anwendung den Anforderungen nicht mehr genügt, ist eine Microservices-Architektur zu erwägen:

```
microservices-platform/
├── api-gateway/              # API-Gateway
│   ├── src/
│   └── Dockerfile
├── services/                 # Geschäftsservices
│   ├── user-service/         # Benutzerservice
│   ├── order-service/        # Bestellservice
│   ├── product-service/      # Produktservice
│   └── payment-service/      # Zahlungsservice
├── shared/                   # Gemeinsame Bibliotheken
│   ├── proto/                # Protocol Buffers
│   ├── common-lib/
│   └── event-contracts/
├── infrastructure/           # Infrastruktur
│   ├── docker-compose.yml
│   ├── kubernetes/
│   └── terraform/
└── docs/
```

### 4.3 Microservices-Frameworks nach Sprache

| Sprache | Microservices-Framework | Service Discovery | Config Center | Distributed Tracing |
|------|------------|----------|----------|----------|
| **Node.js** | NestJS + gRPC | Consul | etcd | Jaeger |
| **Python** | FastAPI + Nameko | Eureka | Consul | Zipkin |
| **Go** | Go-kit + gRPC | etcd | etcd | OpenTelemetry |
| **Java** | Spring Cloud | Nacos | Nacos | SkyWalking |

### 4.4 Codebase-Design (Monorepo vs Polyrepo)

**Monorepo (Einzelne Codebasis)**:

```
monorepo/
├── services/
│   ├── user-service/         # Eigenständiger Service
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── order-service/
│   └── product-service/
├── shared/
│   ├── types/                # Gemeinsame Typen
│   ├── utils/                # Gemeinsame Werkzeuge
│   └── proto/                # Gemeinsame Protokolle
├── packages/
│   ├── eslint-config/        # Gemeinsame ESLint-Konfiguration
│   └── ts-config/            # Gemeinsame TS-Konfiguration
├── docker-compose.yml
└── package.json              # Root package.json
```

**Vorteile**:
- Einfache Code-Wiederverwendung
- Einheitlicher Build und Release
- Einfaches Refactoring

**Nachteile**:
- Große Codebasis
- Komplexe Berechtigungsverwaltung

**Polyrepo (Mehrere Codebasen)**:

Jeder Service in einem eigenen Repository:
- `github.com/company/user-service`
- `github.com/company/order-service`
- `github.com/company/shared-lib`

**Vorteile**:
- Unabhängige Service-Evolution
- Team-Autonomie
- Klare Berechtigungen

**Nachteile**:
- Schwierige Code-Wiederverwendung
- Komplexe Versionsverwaltung

### 4.5 Datenebenen-Design

**Strategie zur Datenbankauswahl**:

| Datentyp | Empfohlene Datenbank | Anwendungsszenario |
|----------|------------|----------|
| Relationale Daten | PostgreSQL | Benutzer, Bestellungen, Produkte |
| Caching | Redis | Sitzungen, Hot Data |
| Suche | Elasticsearch | Produktsuche, Logs |
| Zeitreihendaten | InfluxDB/TimescaleDB | Monitoring, Metriken |
| Dokumentdaten | MongoDB | Logs, Konfiguration |

**Datenzugriffsschicht-Design**:

```
data-layer/
├── primary-db/               # Primäre Datenbank
│   ├── master/               # Schreibinstanz
│   └── slaves/               # Leseinstanzen
├── cache-layer/              # Cache-Schicht
│   ├── redis-cluster/
│   └── local-cache/
├── search-engine/            # Suchmaschine
│   └── elasticsearch/
└── message-queue/            # Nachrichtenwarteschlange
    ├── kafka/
    └── rabbitmq/
```

---

## 5. Open-Source-Projektarchitektur-Standards

### 5.1 Node.js-Ökosystem

**Offizielle Express.js-Projektstruktur**:
```
express-project/
├── bin/                      # Startskripte
├── public/                   # Statische Ressourcen
├── routes/                   # Routen
├── views/                    # Views
├── app.js                    # Anwendungskonfiguration
└── package.json
```

**Offizielle NestJS-Empfehlung**:
```
nest-project/
├── src/
│   ├── modules/              # Funktionsmodule
│   ├── common/               # Gemeinsame Module
│   ├── config/
│   └── main.ts
├── test/
└── nest-cli.json
```

### 5.2 Python-Ökosystem

**Offizielle Django-Projektstruktur**:
```
django-project/
├── project_name/             # Projektkonfiguration
├── apps/                     # App-Verzeichnis
├── templates/
├── static/
├── media/
└── manage.py
```

**FastAPI-Projektstruktur**:
```
fastapi-project/
├── app/
│   ├── api/
│   │   ├── deps.py           # Abhängigkeiten
│   │   └── v1/
│   │       └── endpoints/
│   ├── core/                 # Kernkonfiguration
│   ├── db/                   # Datenbank
│   ├── models/               # Modelle
│   ├── schemas/              # Pydantic-Modelle
│   └── main.py
├── tests/
└── alembic/                  # Migrationen
```

### 5.3 Go-Ökosystem

**Standard-Projektlayout**:
```
go-project/
├── cmd/                      # Anwendungseinstieg
│   └── app/
│       └── main.go
├── internal/                 # Privater Code
├── pkg/                      # Öffentliche Bibliotheken
├── api/                      # API-Definitionen
├── web/                      # Statische Ressourcen
├── configs/                  # Konfiguration
├── scripts/                  # Skripte
└── go.mod
```

**Referenz**:
- [golang-standards/project-layout](https://github.com/golang-standards/project-layout)

### 5.4 Java-Ökosystem

**Offizielle Spring Boot-Struktur**:
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

**Alibaba Java-Entwicklungshandbuch**:
- Klare Schichtung: controller/service/manager/dao
- Domain-Modelle: DO/DTO/BO/VO-Unterscheidung
- Paketstruktur: Nach Funktionsmodulen gegliedert

---

## 6. Architektur-Evolutions-Roadmap

### 6.1 Evolutionsbeispiel

```
Phase 1: Monolithische Anwendung (Einsteiger)
    ↓ Wachsende Nutzerzahlen, größeres Team
Phase 2: Schichtenarchitektur (Fortgeschritten)
    ↓ Komplexere Geschäftslogik, teamübergreifende Zusammenarbeit
Phase 3: Modularisierung/Microservices (Enterprise)
    ↓ Hohe Parallelität, Hochverfügbarkeitsanforderungen
Phase 4: Cloud-native Architektur (Plattform-Ebene)
```

### 6.2 Wann die Architektur upgraden

| Signal | Aktuelle Ebene | Empfohlenes Upgrade |
|------|----------|----------|
| Code-Dateien > 50 | Einsteiger | Fortgeschritten |
| Build-Zeit > 5 Minuten | Fortgeschritten | Modularisierung |
| Team > 10 Personen | Fortgeschritten | Microservices |
| DAU > 100k | Fortgeschritten | Enterprise |
| Mehrsprachiger Tech-Stack | Monolith | Microservices |

---

## 7. Zusammenfassung

::: tip 💡 Kerngedanke
**Architektur dient dem Geschäft, nicht Architektur um der Architektur willen.**

**Nach Nutzerzahl wählen**:
- **< 1k**: Einfache Skripte, schnelle Bereitstellung
- **1k-100k**: Schichtenarchitektur, Code-Standards
- **> 100k**: Microservices, Hochverfügbarkeitsdesign

**Nach Sprache wählen**:
- **Node.js**: Asynchrone Eigenschaften nutzen, geeignet für I/O-intensive Aufgaben
- **Python**: Schnelle Entwicklung, geeignet für Datenverarbeitung und KI
- **Go**: Hohe Performance, geeignet für Cloud-native und Microservices
- **Java**: Enterprise, geeignet für große komplexe Systeme

**Allgemeine Prinzipien**:
1. **Schrittweise Evolution**: Beginne einfach und wachse mit dem Geschäft
2. **Konvention vor Konfiguration**: Einheitliche Standards senken Kommunikationskosten
3. **Automatisierte Tests**: Gewährleisten sicheres Refactoring
4. **Dokumentation zuerst**: Architekturentscheidungen dokumentieren

**Das ultimative Ziel**: Den Code wie eine Fabrikhalle zum Laufen bringen – effizient, egal in welcher Größenordnung.
:::

---

## Referenzressourcen

### Open-Source-Projekte
- [nestjs/nest](https://github.com/nestjs/nest) - Node.js Enterprise-Framework
- [django/django](https://github.com/django/django) - Python Web-Framework
- [gin-gonic/gin](https://github.com/gin-gonic/gin) - Go Web-Framework
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) - Java-Framework

### Architekturleitfäden
- [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices) - Node.js Best Practices
- [golang-standards/project-layout](https://github.com/golang-standards/project-layout) - Go-Projektlayout
- [cookiecutter/cookiecutter-django](https://github.com/cookiecutter/cookiecutter-django) - Django-Projektvorlage
- [ali-baba/spring-cloud-alibaba](https://github.com/alibaba/spring-cloud-alibaba) - Alibaba Microservices

### Bücher
- 《Clean Architecture》- Robert C. Martin
- 《Building Microservices》- Sam Newman
- 《Designing Data-Intensive Applications》- Martin Kleppmann