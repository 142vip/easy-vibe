# 後端專案架構：分層與模組化

::: tip 🎯 核心問题
**從简單的脚本到大型分布式系统，如何為不同規模、不同語言的後端项目選择合適的架構？** 這就像問：從家庭作坊到大型工厂，如何根據產量和工艺設計不同的生產线？好的後端架構應該隨業務成長而演進，同時充分發挥語言特性。
:::

---

## 1. 架構演進：從脚本到系统

### 1.1 按用户量划分架構级別

後端项目的架構應該與業務規模和用户量相匹配：

| 级別 | 用户量 | 并發量 | 典型場景 | 核心關注點 |
|------|--------|--------|----------|------------|
| **入門级** | < 1k | < 100 | 个人项目、MVP、內部工具 | 快速開發、简單部署 |
| **進階级** | 1k-100k | 100-10k | 企業系统、SaaS、中小平台 | 分層架構、代碼規范 |
| **企業级** | > 100k | > 10k | 大型平台、互聯網應用 | 微服務、高可用、性能優化 |

### 1.2 按語言特性選择架構風格

不同編程語言有不同的設計哲學和生態，架構設計應該顺應語言特性：

| 語言 | 設計哲學 | 推荐架構風格 | 代表框架 |
|------|----------|--------------|----------|
| **Node.js** | 事件驅動、非阻塞 I/O | 分層架構 + 异步流程 | Express、NestJS、Fastify |
| **Python** | 简洁優雅、快速開發 | MTV/MVC、分層架構 | Django、Flask、FastAPI |
| **Go** | 简單高效、并發原生 | 简洁分層、微服務 | Gin、Echo、Fiber |
| **Java** | 企業级、強類型 | 嚴格分層、领域驅動 | Spring Boot、Spring Cloud |

::: tip 💡 架構選择原则
1. **不要過度設計**：小项目用简單架構，大项目才需要複雜架構
2. **顺應語言特性**：不要試图在 Python 裡写 Java 風格的代碼
3. **渐進式演進**：從简單開始，隨業務增長逐步優化
4. **团队熟悉度**：選择团队熟悉的架構風格，降低學習成本
:::

---

## 2. 入門级架構（用户量 < 1k）

### 2.1 適用場景

- 个人项目、學習练習
- 創業公司 MVP（最小可行產品）
- 內部工具、管理後台
- 原型验證、概念演示

### 2.2 Node.js - 简洁脚本風格

**特點**：單文件或简單拆分，快速上线

```
my-node-api/
├── src/
│   ├── app.js              # 應用入口
│   ├── routes.js           # 路由定義
│   ├── db.js               # 數據庫連接
│   └── utils.js            # 工具函數
├── .env                    # 環境變量
├── package.json
└── README.md
```

**代碼示例**：

```javascript
// src/app.js
const express = require('express');
const app = express();

app.use(express.json());

// 路由直接写在入口（適合接口很少的情况）
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

**參考開源项目**：
- [expressjs/express](https://github.com/expressjs/express) - 官方示例
- [vercel/micro](https://github.com/vercel/micro) - 微服務風格

### 2.3 Python - 快速原型風格

**特點**：利用 Python 的简洁性，快速實現功能

```
my-python-api/
├── app.py                  # 主應用
├── models.py               # 數據模型
├── config.py               # 配置
├── requirements.txt
└── README.md
```

**代碼示例（Flask）**：

```python
# app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
db = SQLAlchemy(app)

# 模型定義
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

# 路由
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

**參考開源项目**：
- [pallets/flask](https://github.com/pallets/flask) - 官方示例
- [tiangolo/fastapi](https://github.com/tiangolo/fastapi) - 現代异步風格

### 2.4 Go - 简洁標準庫風格

**特點**：利用 Go 的標準庫，最少的依賴

```
my-go-api/
├── main.go                 # 入口
├── handlers.go             # 處理器
├── models.go               # 模型
├── db.go                   # 數據庫
├── go.mod
└── README.md
```

**代碼示例**：

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

**參考開源项目**：
- [golang/go](https://github.com/golang/go) - 標準庫示例
- [go-chi/chi](https://github.com/go-chi/chi) - 輕量级路由

### 2.5 Java - Spring Boot 起步風格

**特點**：利用 Spring Boot 的自動配置，快速启動

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

**代碼示例**：

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

**參考開源项目**：
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) - 官方示例
- [spring-projects/spring-petclinic](https://github.com/spring-projects/spring-petclinic) - 經典示例

---

## 3. 進階级架構（用户量 1k-100k）

### 3.1 適用場景

- 企業管理系统（ERP、CRM、OA）
- SaaS 應用
- 電商平台
- 需要多团队協作的项目

### 3.2 分層架構詳解

進階级项目推荐采用**四層架構**（Controller-Service-Repository-Model）：

```
project/
├── src/
│   ├── controllers/          # 控制層：處理 HTTP 請求
│   ├── services/             # 服務層：業務邏輯
│   ├── repositories/         # 數據層：數據访問
│   ├── models/               # 模型層：數據結構
│   ├── middlewares/          # 中間件
│   ├── utils/                # 工具函數
│   ├── config/               # 配置
│   └── routes/               # 路由定義
├── tests/
├── docs/
└── scripts/
```

### 3.3 Node.js - 企業级分層

**參考開源项目**：
- [nestjs/nest](https://github.com/nestjs/nest) - 企業级 Node.js 框架
- [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices) - Node.js 最佳實踐

```
node-enterprise/
├── src/
│   ├── modules/              # 按功能模塊組织
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   ├── users.module.ts
│   │   │   └── dto/
│   │   ├── orders/
│   │   └── products/
│   ├── common/               # 共享模塊
│   │   ├── filters/          # 异常過滤器
│   │   ├── guards/           # 守卫
│   │   ├── interceptors/     # 拦截器
│   │   └── pipes/            # 管道
│   ├── config/
│   └── main.ts
```

**NestJS 代碼示例**：

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

### 3.4 Python - Django/DRF 風格

**參考開源项目**：
- [django/django](https://github.com/django/django) - 官方项目
- [encode/django-rest-framework](https://github.com/encode/django-rest-framework) - REST 框架
- [cookiecutter/cookiecutter-django](https://github.com/cookiecutter/cookiecutter-django) - 项目模板

```
django-enterprise/
├── apps/
│   ├── users/                # 用户應用
│   │   ├── models.py
│   │   ├── views.py          # API 视图
│   │   ├── serializers.py    # 序列化器
│   │   ├── permissions.py    # 權限
│   │   ├── urls.py
│   │   └── tests/
│   ├── orders/
│   └── products/
├── config/                   # 项目配置
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── utils/                    # 共享工具
├── templates/
├── static/
└── manage.py
```

**Django REST Framework 代碼示例**：

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

### 3.5 Go - 整洁架構風格

**參考開源项目**：
- [gin-gonic/gin](https://github.com/gin-gonic/gin) - Web 框架
- [go-kit/kit](https://github.com/go-kit/kit) - 微服務工具包
- [bxcodec/go-clean-arch](https://github.com/bxcodec/go-clean-arch) - 整洁架構示例

```
go-enterprise/
├── cmd/
│   └── api/                  # 應用入口
│       └── main.go
├── internal/                 # 私有代碼
│   ├── domain/               # 领域層（實體、接口）
│   │   ├── user.go
│   │   └── repository.go
│   ├── usecase/              # 用例層（業務邏輯）
│   │   └── user_usecase.go
│   ├── delivery/             # 傳輸層（HTTP/gRPC）
│   │   └── http/
│   │       └── user_handler.go
│   ├── repository/           # 倉庫層（數據访問）
│   │   └── user_repository.go
│   └── config/
├── pkg/                      # 公共庫
├── migrations/
└── go.mod
```

**整洁架構代碼示例**：

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
    // 業務邏輯：檢查郵箱是否已存在
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

### 3.6 Java - Spring Boot 企業级

**參考開源项目**：
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot)
- [spring-cloud-samples](https://github.com/spring-cloud-samples) - 微服務示例
- [ali-baba/spring-cloud-alibaba](https://github.com/alibaba/spring-cloud-alibaba) - 阿裡微服務

```
spring-enterprise/
├── src/main/java/com/example/
│   ├── application/          # 應用層
│   │   ├── controller/       # 控制器
│   │   ├── dto/              # 數據傳輸對象
│   │   └── assembler/        # 組装器
│   ├── domain/               # 领域層
│   │   ├── entity/           # 實體
│   │   ├── valueobject/      # 值對象
│   │   ├── repository/       # 倉庫接口
│   │   └── service/          # 领域服務
│   ├── infrastructure/       # 基础設施層
│   │   ├── repository/       # 倉庫實現
│   │   ├── config/           # 配置
│   │   └── common/           # 工具類
│   └── Application.java
├── src/main/resources/
│   ├── application.yml
│   └── mapper/
└── src/test/
```

**领域驅動設計（DDD）代碼示例**：

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

    // 领域方法
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

## 4. 企業级架構（用户量 > 100k）

### 4.1 適用場景

- 大型互聯網平台
- 金融交易系统
- 高并發電商系统
- 需要多团队協作的大型项目

### 4.2 微服務架構

当單體應用无法满足需求時，需要考虑微服務架構：

```
microservices-platform/
├── api-gateway/              # API 網關
│   ├── src/
│   └── Dockerfile
├── services/                 # 業務服務
│   ├── user-service/         # 用户服務
│   ├── order-service/        # 订單服務
│   ├── product-service/      # 商品服務
│   └── payment-service/      # 支付服務
├── shared/                   # 共享庫
│   ├── proto/                # Protocol Buffers
│   ├── common-lib/
│   └── event-contracts/
├── infrastructure/           # 基础設施
│   ├── docker-compose.yml
│   ├── kubernetes/
│   └── terraform/
└── docs/
```

### 4.3 各語言微服務框架

| 語言 | 微服務框架 | 服務發現 | 配置中心 | 鏈路追蹤 |
|------|------------|----------|----------|----------|
| **Node.js** | NestJS + gRPC | Consul | etcd | Jaeger |
| **Python** | FastAPI + Nameko | Eureka | Consul | Zipkin |
| **Go** | Go-kit + gRPC | etcd | etcd | OpenTelemetry |
| **Java** | Spring Cloud | Nacos | Nacos | SkyWalking |

### 4.4 代碼庫設計（Monorepo vs Polyrepo）

**Monorepo（單一代碼庫）**：

```
monorepo/
├── services/
│   ├── user-service/         # 独立服務
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── order-service/
│   └── product-service/
├── shared/
│   ├── types/                # 共享類型
│   ├── utils/                # 共享工具
│   └── proto/                # 共享協议
├── packages/
│   ├── eslint-config/        # 共享 ESLint 配置
│   └── ts-config/            # 共享 TS 配置
├── docker-compose.yml
└── package.json              # 根 package.json
```

**優點**：
- 代碼共享方便
- 统一構建和發布
- 重構容易

**缺點**：
- 代碼庫庞大
- 權限管理複雜

**Polyrepo（多代碼庫）**：

每个服務独立倉庫：
- `github.com/company/user-service`
- `github.com/company/order-service`
- `github.com/company/shared-lib`

**優點**：
- 服務独立演進
- 团队自治
- 權限清晰

**缺點**：
- 代碼共享困難
- 版本管理複雜

### 4.5 數據層設計

**數據庫選择策略**：

| 數據類型 | 推荐數據庫 | 適用場景 |
|----------|------------|----------|
| 關系型數據 | PostgreSQL | 用户、订單、商品 |
| 緩存 | Redis | 會话、热點數據 |
| 搜索 | Elasticsearch | 商品搜索、日志 |
| 時序數據 | InfluxDB/TimescaleDB | 監控、指標 |
| 文檔數據 | MongoDB | 日志、配置 |

**數據访問層設計**：

```
data-layer/
├── primary-db/               # 主數據庫
│   ├── master/               # 写庫
│   └── slaves/               # 讀庫
├── cache-layer/              # 緩存層
│   ├── redis-cluster/
│   └── local-cache/
├── search-engine/            # 搜索引擎
│   └── elasticsearch/
└── message-queue/            # 消息队列
    ├── kafka/
    └── rabbitmq/
```

---

## 5. 開源项目架構規范參考

### 5.1 Node.js 生態

**Express.js 官方项目結構**：
```
express-project/
├── bin/                      # 启動脚本
├── public/                   # 静態资源
├── routes/                   # 路由
├── views/                    # 视图
├── app.js                    # 應用配置
└── package.json
```

**NestJS 官方推荐**：
```
nest-project/
├── src/
│   ├── modules/              # 功能模塊
│   ├── common/               # 共享模塊
│   ├── config/
│   └── main.ts
├── test/
└── nest-cli.json
```

### 5.2 Python 生態

**Django 官方项目結構**：
```
django-project/
├── project_name/             # 项目配置
├── apps/                     # 應用目錄
├── templates/
├── static/
├── media/
└── manage.py
```

**FastAPI 项目結構**：
```
fastapi-project/
├── app/
│   ├── api/
│   │   ├── deps.py           # 依賴
│   │   └── v1/
│   │       └── endpoints/
│   ├── core/                 # 核心配置
│   ├── db/                   # 數據庫
│   ├── models/               # 模型
│   ├── schemas/              # Pydantic 模型
│   └── main.py
├── tests/
└── alembic/                  # 遷移
```

### 5.3 Go 生態

**標準项目布局**：
```
go-project/
├── cmd/                      # 應用入口
│   └── app/
│       └── main.go
├── internal/                 # 私有代碼
├── pkg/                      # 公共庫
├── api/                      # API 定義
├── web/                      # 静態资源
├── configs/                  # 配置
├── scripts/                  # 脚本
└── go.mod
```

**參考**：
- [golang-standards/project-layout](https://github.com/golang-standards/project-layout)

### 5.4 Java 生態

**Spring Boot 官方結構**：
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

**阿裡巴巴 Java 開發手册**：
- 分層清晰：controller/service/manager/dao
- 领域模型：DO/DTO/BO/VO 區分
- 包結構：按功能模塊划分

---

## 6. 架構演進路线图

### 6.1 演進示例

```
階段 1：單體應用（入門级）
    ↓ 用户量增長、团队擴大
階段 2：分層架構（進階级）
    ↓ 業務複雜、多团队協作
階段 3：模塊化/微服務（企業级）
    ↓ 高并發、高可用要求
階段 4：云原生架構（平台级）
```

### 架構6.2 時機

| 信号 | 当前级別 | 建议升级 |
|------|----------|----------|
| 代碼文件 > 50 个 | 入門级 | 進階级 |
| 構建時間 > 5 分鐘 | 進階级 | 模塊化 |
| 团队 > 10 人 | 進階级 | 微服務 |
| 日活 > 10 万 | 進階级 | 企業级 |
| 多語言技術栈 | 單體 | 微服務 |

---

## 7. 總結

::: tip 💡 核心思想
**架構服務于業務，不是為架構而架構。**

**按用户量選择**：
- **< 1k**：简單脚本，快速上线
- **1k-100k**：分層架構，代碼規范
- **> 100k**：微服務，高可用設計

**按語言選择**：
- **Node.js**：利用异步特性，適合 I/O 密集型
- **Python**：快速開發，適合數據處理和 AI
- **Go**：高性能，適合云原生和微服務
- **Java**：企業级，適合大型複雜系统

**通用原则**：
1. **渐進式演進**：從简單開始，隨業務增長
2. **约定優于配置**：统一規范，降低沟通成本
3. **自動化測試**：保證重構安全
4. **文檔先行**：架構决策要記錄

**最终目標**：讓代碼像工厂車間一样，无论規模大小，都能高效運轉。
:::

---

## 參考资源

### 開源项目
- [nestjs/nest](https://github.com/nestjs/nest) - Node.js 企業级框架
- [django/django](https://github.com/django/django) - Python Web 框架
- [gin-gonic/gin](https://github.com/gin-gonic/gin) - Go Web 框架
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) - Java 框架

### 架構指南
- [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices) - Node.js 最佳實踐
- [golang-standards/project-layout](https://github.com/golang-standards/project-layout) - Go 项目布局
- [cookiecutter/cookiecutter-django](https://github.com/cookiecutter/cookiecutter-django) - Django 项目模板
- [ali-baba/spring-cloud-alibaba](https://github.com/alibaba/spring-cloud-alibaba) - 阿裡微服務

### 書籍
- 《Clean Architecture》- Robert C. Martin
- 《Building Microservices》- Sam Newman
- 《Designing Data-Intensive Applications》- Martin Kleppmann
