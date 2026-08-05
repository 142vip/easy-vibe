# 백엔드 프로젝트 구조 원리

::: tip 🎯 핵심 질문
**간단한 스크립트부터 대규모 분산 시스템까지, 다양한 규모와 언어의 백엔드 프로젝트에 적합한 아키텍처를 어떻게 선택할까요?** 이는 마치 "가내 수공업부터 대형 공장까지, 생산량과 공정에 따라 어떻게 다른 생산 라인을 설계할 것인가?"라고 묻는 것과 같습니다. 좋은 백엔드 아키텍처는 비즈니스 성장에 따라 진화하면서 언어의 특성을 충분히 발휘해야 합니다.
:::

---

## 1. 아키텍처 진화: 스크립트에서 시스템으로

### 1.1 사용자 규모에 따른 아키텍처 레벨 구분

백엔드 프로젝트의 아키텍처는 비즈니스 규모와 사용자 수에 맞게 설계되어야 합니다:

| 레벨 | 사용자 수 | 동시 접속자 | 대표 시나리오 | 핵심 관심사 |
|------|--------|--------|----------|------------|
| **입문** | < 1k | < 100 | 개인 프로젝트, MVP, 내부 도구 | 빠른 개발, 간단한 배포 |
| **중급** | 1k-100k | 100-10k | 기업 시스템, SaaS, 중소 규모 플랫폼 | 계층형 아키텍처, 코드 규칙 |
| **엔터프라이즈** | > 100k | > 10k | 대형 플랫폼, 인터넷 애플리케이션 | 마이크로서비스, 고가용성, 성능 최적화 |

### 1.2 언어 특성에 따른 아키텍처 스타일 선택

프로그래밍 언어마다 설계 철학과 생태계가 다르므로, 아키텍처 설계는 언어 특성에 맞춰야 합니다:

| 언어 | 설계 철학 | 권장 아키텍처 스타일 | 대표 프레임워크 |
|------|----------|--------------|----------|
| **Node.js** | 이벤트 구동, 논블로킹 I/O | 계층형 아키텍처 + 비동기 흐름 | Express, NestJS, Fastify |
| **Python** | 간결하고 우아함, 빠른 개발 | MTV/MVC, 계층형 아키텍처 | Django, Flask, FastAPI |
| **Go** | 단순하고 효율적, 동시성 네이티브 | 간결한 계층 구조, 마이크로서비스 | Gin, Echo, Fiber |
| **Java** | 엔터프라이즈급, 강타입 | 엄격한 계층 구조, 도메인 주도 설계 | Spring Boot, Spring Cloud |

::: tip 💡 아키텍처 선택 원칙
1. **과도한 설계를 피하라**: 작은 프로젝트는 단순한 아키텍처로, 큰 프로젝트에만 복잡한 아키텍처가 필요하다
2. **언어 특성에 맞춰라**: Python에서 Java 스타일의 코드를 작성하려 하지 마라
3. **점진적 진화**: 단순하게 시작하여 비즈니스 성장에 따라 점차 최적화하라
4. **팀 숙련도**: 팀이 익숙한 아키텍처 스타일을 선택하여 학습 비용을 낮춰라
:::

---

## 2. 입문 레벨 아키텍처 (사용자 수 < 1k)

### 2.1 적용 시나리오

- 개인 프로젝트, 학습용 연습
- 스타트업 MVP (최소 기능 제품)
- 내부 도구, 관리자 백오피스
- 프로토타입 검증, 컨셉 데모

### 2.2 Node.js - 간결한 스크립트 스타일

**특징**: 단일 파일 또는 간단한 분할로 빠른 출시

```
my-node-api/
├── src/
│   ├── app.js              # 애플리케이션 진입점
│   ├── routes.js           # 라우트 정의
│   ├── db.js               # 데이터베이스 연결
│   └── utils.js            # 유틸리티 함수
├── .env                    # 환경 변수
├── package.json
└── README.md
```

**코드 예제**:

```javascript
// src/app.js
const express = require('express');
const app = express();

app.use(express.json());

// 라우트를 진입점에 직접 작성 (엔드포인트가 적은 경우에 적합)
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

**참고 오픈소스 프로젝트**:
- [expressjs/express](https://github.com/expressjs/express) - 공식 예제
- [vercel/micro](https://github.com/vercel/micro) - 마이크로서비스 스타일

### 2.3 Python - 빠른 프로토타입 스타일

**특징**: Python의 간결함을 활용하여 기능을 빠르게 구현

```
my-python-api/
├── app.py                  # 메인 애플리케이션
├── models.py               # 데이터 모델
├── config.py               # 설정
├── requirements.txt
└── README.md
```

**코드 예제 (Flask)**:

```python
# app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
db = SQLAlchemy(app)

# 모델 정의
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

# 라우트
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

**참고 오픈소스 프로젝트**:
- [pallets/flask](https://github.com/pallets/flask) - 공식 예제
- [tiangolo/fastapi](https://github.com/tiangolo/fastapi) - 현대적인 비동기 스타일

### 2.4 Go - 간결한 표준 라이브러리 스타일

**특징**: Go의 표준 라이브러리를 활용하여 최소한의 의존성

```
my-go-api/
├── main.go                 # 진입점
├── handlers.go             # 핸들러
├── models.go               # 모델
├── db.go                   # 데이터베이스
├── go.mod
└── README.md
```

**코드 예제**:

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

**참고 오픈소스 프로젝트**:
- [golang/go](https://github.com/golang/go) - 표준 라이브러리 예제
- [go-chi/chi](https://github.com/go-chi/chi) - 경량 라우터

### 2.5 Java - Spring Boot 시작 스타일

**특징**: Spring Boot의 자동 설정을 활용하여 빠르게 시작

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

**코드 예제**:

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

**참고 오픈소스 프로젝트**:
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) - 공식 예제
- [spring-projects/spring-petclinic](https://github.com/spring-projects/spring-petclinic) - 클래식 예제

---

## 3. 중급 레벨 아키텍처 (사용자 수 1k-100k)

### 3.1 적용 시나리오

- 기업 관리 시스템 (ERP, CRM, OA)
- SaaS 애플리케이션
- 이커머스 플랫폼
- 여러 팀이 협업하는 프로젝트

### 3.2 계층형 아키텍처 상세

중급 프로젝트는 **4계층 아키텍처**(Controller-Service-Repository-Model)를 권장합니다:

```
project/
├── src/
│   ├── controllers/          # 제어 계층: HTTP 요청 처리
│   ├── services/             # 서비스 계층: 비즈니스 로직
│   ├── repositories/         # 데이터 계층: 데이터 접근
│   ├── models/               # 모델 계층: 데이터 구조
│   ├── middlewares/          # 미들웨어
│   ├── utils/                # 유틸리티 함수
│   ├── config/               # 설정
│   └── routes/               # 라우트 정의
├── tests/
├── docs/
└── scripts/
```

### 3.3 Node.js - 엔터프라이즈급 계층 구조

**참고 오픈소스 프로젝트**:
- [nestjs/nest](https://github.com/nestjs/nest) - 엔터프라이즈급 Node.js 프레임워크
- [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices) - Node.js 모범 사례

```
node-enterprise/
├── src/
│   ├── modules/              # 기능 모듈별 구성
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   ├── users.module.ts
│   │   │   └── dto/
│   │   ├── orders/
│   │   └── products/
│   ├── common/               # 공유 모듈
│   │   ├── filters/          # 예외 필터
│   │   ├── guards/           # 가드
│   │   ├── interceptors/     # 인터셉터
│   │   └── pipes/            # 파이프
│   ├── config/
│   └── main.ts
```

**NestJS 코드 예제**:

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

### 3.4 Python - Django/DRF 스타일

**참고 오픈소스 프로젝트**:
- [django/django](https://github.com/django/django) - 공식 프로젝트
- [encode/django-rest-framework](https://github.com/encode/django-rest-framework) - REST 프레임워크
- [cookiecutter/cookiecutter-django](https://github.com/cookiecutter/cookiecutter-django) - 프로젝트 템플릿

```
django-enterprise/
├── apps/
│   ├── users/                # 사용자 앱
│   │   ├── models.py
│   │   ├── views.py          # API 뷰
│   │   ├── serializers.py    # 시리얼라이저
│   │   ├── permissions.py    # 권한
│   │   ├── urls.py
│   │   └── tests/
│   ├── orders/
│   └── products/
├── config/                   # 프로젝트 설정
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── utils/                    # 공유 유틸리티
├── templates/
├── static/
└── manage.py
```

**Django REST Framework 코드 예제**:

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

### 3.5 Go - 클린 아키텍처 스타일

**참고 오픈소스 프로젝트**:
- [gin-gonic/gin](https://github.com/gin-gonic/gin) - Web 프레임워크
- [go-kit/kit](https://github.com/go-kit/kit) - 마이크로서비스 툴킷
- [bxcodec/go-clean-arch](https://github.com/bxcodec/go-clean-arch) - 클린 아키텍처 예제

```
go-enterprise/
├── cmd/
│   └── api/                  # 애플리케이션 진입점
│       └── main.go
├── internal/                 # 비공개 코드
│   ├── domain/               # 도메인 계층 (엔티티, 인터페이스)
│   │   ├── user.go
│   │   └── repository.go
│   ├── usecase/              # 유스케이스 계층 (비즈니스 로직)
│   │   └── user_usecase.go
│   ├── delivery/             # 전달 계층 (HTTP/gRPC)
│   │   └── http/
│   │       └── user_handler.go
│   ├── repository/           # 리포지토리 계층 (데이터 접근)
│   │   └── user_repository.go
│   └── config/
├── pkg/                      # 공개 라이브러리
├── migrations/
└── go.mod
```

**클린 아키텍처 코드 예제**:

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
    // 비즈니스 로직: 이메일 중복 확인
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

### 3.6 Java - Spring Boot 엔터프라이즈급

**참고 오픈소스 프로젝트**:
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot)
- [spring-cloud-samples](https://github.com/spring-cloud-samples) - 마이크로서비스 예제
- [ali-baba/spring-cloud-alibaba](https://github.com/alibaba/spring-cloud-alibaba) - 알리바바 마이크로서비스

```
spring-enterprise/
├── src/main/java/com/example/
│   ├── application/          # 애플리케이션 계층
│   │   ├── controller/       # 컨트롤러
│   │   ├── dto/              # 데이터 전송 객체
│   │   └── assembler/        # 어셈블러
│   ├── domain/               # 도메인 계층
│   │   ├── entity/           # 엔티티
│   │   ├── valueobject/      # 값 객체
│   │   ├── repository/       # 리포지토리 인터페이스
│   │   └── service/          # 도메인 서비스
│   ├── infrastructure/       # 인프라스트럭처 계층
│   │   ├── repository/       # 리포지토리 구현
│   │   ├── config/           # 설정
│   │   └── common/           # 유틸리티 클래스
│   └── Application.java
├── src/main/resources/
│   ├── application.yml
│   └── mapper/
└── src/test/
```

**도메인 주도 설계 (DDD) 코드 예제**:

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

    // 도메인 메서드
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

## 4. 엔터프라이즈 레벨 아키텍처 (사용자 수 > 100k)

### 4.1 적용 시나리오

- 대형 인터넷 플랫폼
- 금융 거래 시스템
- 고동시성 이커머스 시스템
- 여러 팀이 협업하는 대규모 프로젝트

### 4.2 마이크로서비스 아키텍처

모놀리식 애플리케이션으로 요구사항을 충족할 수 없을 때는 마이크로서비스 아키텍처를 고려해야 합니다:

```
microservices-platform/
├── api-gateway/              # API 게이트웨이
│   ├── src/
│   └── Dockerfile
├── services/                 # 비즈니스 서비스
│   ├── user-service/         # 사용자 서비스
│   ├── order-service/        # 주문 서비스
│   ├── product-service/      # 상품 서비스
│   └── payment-service/      # 결제 서비스
├── shared/                   # 공유 라이브러리
│   ├── proto/                # Protocol Buffers
│   ├── common-lib/
│   └── event-contracts/
├── infrastructure/           # 인프라스트럭처
│   ├── docker-compose.yml
│   ├── kubernetes/
│   └── terraform/
└── docs/
```

### 4.3 언어별 마이크로서비스 프레임워크

| 언어 | 마이크로서비스 프레임워크 | 서비스 디스커버리 | 설정 센터 | 분산 추적 |
|------|------------|----------|----------|----------|
| **Node.js** | NestJS + gRPC | Consul | etcd | Jaeger |
| **Python** | FastAPI + Nameko | Eureka | Consul | Zipkin |
| **Go** | Go-kit + gRPC | etcd | etcd | OpenTelemetry |
| **Java** | Spring Cloud | Nacos | Nacos | SkyWalking |

### 4.4 코드베이스 설계 (Monorepo vs Polyrepo)

**Monorepo (단일 코드베이스)**:

```
monorepo/
├── services/
│   ├── user-service/         # 독립 서비스
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── order-service/
│   └── product-service/
├── shared/
│   ├── types/                # 공유 타입
│   ├── utils/                # 공유 유틸리티
│   └── proto/                # 공유 프로토콜
├── packages/
│   ├── eslint-config/        # 공유 ESLint 설정
│   └── ts-config/            # 공유 TS 설정
├── docker-compose.yml
└── package.json              # 루트 package.json
```

**장점**:
- 코드 공유가 용이
- 통합 빌드 및 배포
- 리팩토링이 쉬움

**단점**:
- 코드베이스가 방대해짐
- 권한 관리가 복잡

**Polyrepo (다중 코드베이스)**:

각 서비스는 독립된 리포지토리:
- `github.com/company/user-service`
- `github.com/company/order-service`
- `github.com/company/shared-lib`

**장점**:
- 서비스 독립적 진화
- 팀 자율성
- 권한이 명확

**단점**:
- 코드 공유가 어려움
- 버전 관리가 복잡

### 4.5 데이터 계층 설계

**데이터베이스 선택 전략**:

| 데이터 유형 | 권장 데이터베이스 | 적용 시나리오 |
|----------|------------|----------|
| 관계형 데이터 | PostgreSQL | 사용자, 주문, 상품 |
| 캐시 | Redis | 세션, 핫 데이터 |
| 검색 | Elasticsearch | 상품 검색, 로그 |
| 시계열 데이터 | InfluxDB/TimescaleDB | 모니터링, 메트릭 |
| 문서 데이터 | MongoDB | 로그, 설정 |

**데이터 접근 계층 설계**:

```
data-layer/
├── primary-db/               # 주 데이터베이스
│   ├── master/               # 쓰기 전용
│   └── slaves/               # 읽기 전용
├── cache-layer/              # 캐시 계층
│   ├── redis-cluster/
│   └── local-cache/
├── search-engine/            # 검색 엔진
│   └── elasticsearch/
└── message-queue/            # 메시지 큐
    ├── kafka/
    └── rabbitmq/
```

---

## 5. 오픈소스 프로젝트 아키텍처 규범 참고

### 5.1 Node.js 생태계

**Express.js 공식 프로젝트 구조**:
```
express-project/
├── bin/                      # 시작 스크립트
├── public/                   # 정적 리소스
├── routes/                   # 라우트
├── views/                    # 뷰
├── app.js                    # 애플리케이션 설정
└── package.json
```

**NestJS 공식 권장 구조**:
```
nest-project/
├── src/
│   ├── modules/              # 기능 모듈
│   ├── common/               # 공유 모듈
│   ├── config/
│   └── main.ts
├── test/
└── nest-cli.json
```

### 5.2 Python 생태계

**Django 공식 프로젝트 구조**:
```
django-project/
├── project_name/             # 프로젝트 설정
├── apps/                     # 앱 디렉터리
├── templates/
├── static/
├── media/
└── manage.py
```

**FastAPI 프로젝트 구조**:
```
fastapi-project/
├── app/
│   ├── api/
│   │   ├── deps.py           # 의존성
│   │   └── v1/
│   │       └── endpoints/
│   ├── core/                 # 코어 설정
│   ├── db/                   # 데이터베이스
│   ├── models/               # 모델
│   ├── schemas/              # Pydantic 모델
│   └── main.py
├── tests/
└── alembic/                  # 마이그레이션
```

### 5.3 Go 생태계

**표준 프로젝트 레이아웃**:
```
go-project/
├── cmd/                      # 애플리케이션 진입점
│   └── app/
│       └── main.go
├── internal/                 # 비공개 코드
├── pkg/                      # 공개 라이브러리
├── api/                      # API 정의
├── web/                      # 정적 리소스
├── configs/                  # 설정
├── scripts/                  # 스크립트
└── go.mod
```

**참고**:
- [golang-standards/project-layout](https://github.com/golang-standards/project-layout)

### 5.4 Java 생태계

**Spring Boot 공식 구조**:
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

**알리바바 Java 개발 가이드**:
- 명확한 계층 구분: controller/service/manager/dao
- 도메인 모델: DO/DTO/BO/VO 구분
- 패키지 구조: 기능 모듈별로 구분

---

## 6. 아키텍처 진화 로드맵

### 6.1 진화 예시

```
단계 1: 모놀리식 애플리케이션 (입문 레벨)
    ↓ 사용자 증가, 팀 확대
단계 2: 계층형 아키텍처 (중급 레벨)
    ↓ 비즈니스 복잡도 증가, 다중 팀 협업
단계 3: 모듈화/마이크로서비스 (엔터프라이즈 레벨)
    ↓ 고동시성, 고가용성 요구
단계 4: 클라우드 네이티브 아키텍처 (플랫폼 레벨)
```

### 6.2 언제 아키텍처를 업그레이드해야 할까 적용 시점

| 신호 | 현재 레벨 | 권장 업그레이드 |
|------|----------|----------|
| 코드 파일 > 50개 | 입문 | 중급 |
| 빌드 시간 > 5분 | 중급 | 모듈화 |
| 팀 > 10명 | 중급 | 마이크로서비스 |
| 일간 활성 사용자 > 10만 | 중급 | 엔터프라이즈 |
| 다중 언어 기술 스택 | 모놀리식 | 마이크로서비스 |

---

## 7. 정리

::: tip 💡 핵심 사상
**아키텍처는 비즈니스를 위한 것이지, 아키텍처 자체를 위한 것이 아닙니다.**

**사용자 규모에 따른 선택**:
- **< 1k**: 간단한 스크립트, 빠른 출시
- **1k-100k**: 계층형 아키텍처, 코드 규칙
- **> 100k**: 마이크로서비스, 고가용성 설계

**언어에 따른 선택**:
- **Node.js**: 비동기 특성을 활용, I/O 집약적 작업에 적합
- **Python**: 빠른 개발, 데이터 처리와 AI에 적합
- **Go**: 고성능, 클라우드 네이티브와 마이크로서비스에 적합
- **Java**: 엔터프라이즈급, 대규모 복잡한 시스템에 적합

**일반 원칙**:
1. **점진적 진화**: 단순하게 시작하여 비즈니스 성장에 따라 발전
2. **설정보다 관례**: 통일된 규범으로 커뮤니케이션 비용 절감
3. **자동화된 테스트**: 안전한 리팩토링 보장
4. **문서 우선**: 아키텍처 결정 사항을 기록

**궁극적인 목표**: 코드가 마치 공장 작업장처럼, 규모에 관계없이 효율적으로 운영되도록 하는 것.
:::

---

## 참고 자료

### 오픈소스 프로젝트
- [nestjs/nest](https://github.com/nestjs/nest) - Node.js 엔터프라이즈 프레임워크
- [django/django](https://github.com/django/django) - Python Web 프레임워크
- [gin-gonic/gin](https://github.com/gin-gonic/gin) - Go Web 프레임워크
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) - Java 프레임워크

### 아키텍처 가이드
- [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices) - Node.js 모범 사례
- [golang-standards/project-layout](https://github.com/golang-standards/project-layout) - Go 프로젝트 레이아웃
- [cookiecutter/cookiecutter-django](https://github.com/cookiecutter/cookiecutter-django) - Django 프로젝트 템플릿
- [ali-baba/spring-cloud-alibaba](https://github.com/alibaba/spring-cloud-alibaba) - 알리바바 마이크로서비스

### 도서
- 《Clean Architecture》- Robert C. Martin
- 《Building Microservices》- Sam Newman
- 《Designing Data-Intensive Applications》- Martin Kleppmann