# バックエンドプロジェクトアーキテクチャ入門


::: tip 🎯 核心問題
**シンプルなスクリプトから大規模分散システムまで、異なる規模・言語のバックエンドプロジェクトに適したアーキテクチャをどう選ぶか？** これは「家庭工房から大規模工場まで、生産量と工程に応じて生産ラインをどう設計するか」という問いに似ている。優れたバックエンドアーキテクチャは、ビジネスの成長に合わせて進化し、言語の特性を最大限に活かすべきである。
:::

---

## 1. アーキテクチャの進化：スクリプトからシステムへ

### 1.1 ユーザー数によるアーキテクチャレベルの区分

バックエンドプロジェクトのアーキテクチャは、ビジネス規模とユーザー数に応じて選択する必要がある：

| レベル | ユーザー数 | 同時接続数 | 典型的なシナリオ | 主な焦点 |
|------|--------|--------|----------|------------|
| **入門レベル** | < 1k | < 100 | 個人プロジェクト、MVP、内部ツール | 迅速な開発、シンプルなデプロイ |
| **中級レベル** | 1k-100k | 100-10k | エンタープライズシステム、SaaS、中小規模プラットフォーム | レイヤードアーキテクチャ、コード規約 |
| **エンタープライズレベル** | > 100k | > 10k | 大規模プラットフォーム、インターネットアプリケーション | マイクロサービス、高可用性、パフォーマンス最適化 |

### 1.2 言語特性に応じたアーキテクチャスタイルの選択

プログラミング言語によって設計哲学やエコシステムが異なるため、アーキテクチャ設計は言語特性に沿うべきである：

| 言語 | 設計哲学 | 推奨アーキテクチャスタイル | 代表的なフレームワーク |
|------|----------|--------------|----------|
| **Node.js** | イベント駆動、ノンブロッキングI/O | レイヤードアーキテクチャ + 非同期フロー | Express、NestJS、Fastify |
| **Python** | シンプルでエレガント、迅速な開発 | MTV/MVC、レイヤードアーキテクチャ | Django、Flask、FastAPI |
| **Go** | シンプルで効率的、並行処理ネイティブ | シンプルなレイヤード、マイクロサービス | Gin、Echo、Fiber |
| **Java** | エンタープライズ向け、強い型付け | 厳格なレイヤード、ドメイン駆動設計 | Spring Boot、Spring Cloud |

::: tip 💡 アーキテクチャ選択の原則
1. **過剰設計を避ける**：小規模プロジェクトはシンプルなアーキテクチャで十分であり、大規模プロジェクトだけ複雑なアーキテクチャが必要
2. **言語特性に従う**：PythonでJavaスタイルのコードを書こうとしないこと
3. **漸進的な進化**：シンプルなものから始め、ビジネスの成長に合わせて段階的に最適化する
4. **チームの習熟度**：チームが慣れているアーキテクチャスタイルを選び、学習コストを下げる
:::

---

## 2. 入門レベルのアーキテクチャ（ユーザー数 < 1k）

### 2.1 適用シナリオ

- 個人プロジェクト、学習・演習
- スタートアップMVP（Minimum Viable Product）
- 内部ツール、管理画面
- プロトタイプ検証、コンセプトデモ

### 2.2 Node.js - シンプルスクリプトスタイル

**特徴**：単一ファイルまたは簡易分割、迅速なリリース

```
my-node-api/
├── src/
│   ├── app.js              # アプリケーションエントリポイント
│   ├── routes.js           # ルーティング定義
│   ├── db.js               # データベース接続
│   └── utils.js            # ユーティリティ関数
├── .env                    # 環境変数
├── package.json
└── README.md
```

**コード例**：

```javascript
// src/app.js
const express = require('express');
const app = express();

app.use(express.json());

// ルーティングをエントリポイントに直接記述（APIが少ない場合に適する）
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

**参考オープンソースプロジェクト**：
- [expressjs/express](https://github.com/expressjs/express) - 公式サンプル
- [vercel/micro](https://github.com/vercel/micro) - マイクロサービススタイル

### 2.3 Python - ラピッドプロトタイピングスタイル

**特徴**：Pythonのシンプルさを活かし、迅速に機能を実装

```
my-python-api/
├── app.py                  # メインアプリケーション
├── models.py               # データモデル
├── config.py               # 設定
├── requirements.txt
└── README.md
```

**コード例（Flask）**：

```python
# app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
db = SQLAlchemy(app)

# モデル定義
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

# ルーティング
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

**参考オープンソースプロジェクト**：
- [pallets/flask](https://github.com/pallets/flask) - 公式サンプル
- [tiangolo/fastapi](https://github.com/tiangolo/fastapi) - モダン非同期スタイル

### 2.4 Go - シンプル標準ライブラリスタイル

**特徴**：Goの標準ライブラリを活用し、最小限の依存関係

```
my-go-api/
├── main.go                 # エントリポイント
├── handlers.go             # ハンドラ
├── models.go               # モデル
├── db.go                   # データベース
├── go.mod
└── README.md
```

**コード例**：

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

**参考オープンソースプロジェクト**：
- [golang/go](https://github.com/golang/go) - 標準ライブラリサンプル
- [go-chi/chi](https://github.com/go-chi/chi) - 軽量ルーター

### 2.5 Java - Spring Boot スタータースタイル

**特徴**：Spring Bootの自動設定を活用し、迅速に起動

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

**コード例**：

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

**参考オープンソースプロジェクト**：
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) - 公式サンプル
- [spring-projects/spring-petclinic](https://github.com/spring-projects/spring-petclinic) - クラシックなサンプル

---

## 3. 中級レベルのアーキテクチャ（ユーザー数 1k-100k）

### 3.1 適用シナリオ

- エンタープライズ管理システム（ERP、CRM、OA）
- SaaSアプリケーション
- ECプラットフォーム
- 複数チームでの協業が必要なプロジェクト

### 3.2 レイヤードアーキテクチャの詳細

中級レベルのプロジェクトでは、**4層アーキテクチャ**（Controller-Service-Repository-Model）を推奨する：

```
project/
├── src/
│   ├── controllers/          # コントローラ層：HTTPリクエストの処理
│   ├── services/             # サービス層：ビジネスロジック
│   ├── repositories/         # データ層：データアクセス
│   ├── models/               # モデル層：データ構造
│   ├── middlewares/          # ミドルウェア
│   ├── utils/                # ユーティリティ関数
│   ├── config/               # 設定
│   └── routes/               # ルーティング定義
├── tests/
├── docs/
└── scripts/
```

### 3.3 Node.js - エンタープライズレイヤード

**参考オープンソースプロジェクト**：
- [nestjs/nest](https://github.com/nestjs/nest) - エンタープライズ向けNode.jsフレームワーク
- [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices) - Node.jsベストプラクティス

```
node-enterprise/
├── src/
│   ├── modules/              # 機能モジュールごとに整理
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   ├── users.module.ts
│   │   │   └── dto/
│   │   ├── orders/
│   │   └── products/
│   ├── common/               # 共有モジュール
│   │   ├── filters/          # 例外フィルタ
│   │   ├── guards/           # ガード
│   │   ├── interceptors/     # インターセプタ
│   │   └── pipes/            # パイプ
│   ├── config/
│   └── main.ts
```

**NestJSコード例**：

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

### 3.4 Python - Django/DRF スタイル

**参考オープンソースプロジェクト**：
- [django/django](https://github.com/django/django) - 公式プロジェクト
- [encode/django-rest-framework](https://github.com/encode/django-rest-framework) - RESTフレームワーク
- [cookiecutter/cookiecutter-django](https://github.com/cookiecutter/cookiecutter-django) - プロジェクトテンプレート

```
django-enterprise/
├── apps/
│   ├── users/                # ユーザーアプリ
│   │   ├── models.py
│   │   ├── views.py          # APIビュー
│   │   ├── serializers.py    # シリアライザ
│   │   ├── permissions.py    # 権限
│   │   ├── urls.py
│   │   └── tests/
│   ├── orders/
│   └── products/
├── config/                   # プロジェクト設定
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── utils/                    # 共有ユーティリティ
├── templates/
├── static/
└── manage.py
```

**Django REST Framework コード例**：

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

### 3.5 Go - クリーンアーキテクチャスタイル

**参考オープンソースプロジェクト**：
- [gin-gonic/gin](https://github.com/gin-gonic/gin) - Webフレームワーク
- [go-kit/kit](https://github.com/go-kit/kit) - マイクロサービスツールキット
- [bxcodec/go-clean-arch](https://github.com/bxcodec/go-clean-arch) - クリーンアーキテクチャサンプル

```
go-enterprise/
├── cmd/
│   └── api/                  # アプリケーションエントリポイント
│       └── main.go
├── internal/                 # プライベートコード
│   ├── domain/               # ドメイン層（エンティティ、インターフェース）
│   │   ├── user.go
│   │   └── repository.go
│   ├── usecase/              # ユースケース層（ビジネスロジック）
│   │   └── user_usecase.go
│   ├── delivery/             # デリバリー層（HTTP/gRPC）
│   │   └── http/
│   │       └── user_handler.go
│   ├── repository/           # リポジトリ層（データアクセス）
│   │   └── user_repository.go
│   └── config/
├── pkg/                      # 公開ライブラリ
├── migrations/
└── go.mod
```

**クリーンアーキテクチャコード例**：

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
    // ビジネスロジック：メールアドレスの重複チェック
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

### 3.6 Java - Spring Boot エンタープライズ

**参考オープンソースプロジェクト**：
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot)
- [spring-cloud-samples](https://github.com/spring-cloud-samples) - マイクロサービスサンプル
- [ali-baba/spring-cloud-alibaba](https://github.com/alibaba/spring-cloud-alibaba) - Alibabaマイクロサービス

```
spring-enterprise/
├── src/main/java/com/example/
│   ├── application/          # アプリケーション層
│   │   ├── controller/       # コントローラ
│   │   ├── dto/              # データ転送オブジェクト
│   │   └── assembler/        # アセンブラ
│   ├── domain/               # ドメイン層
│   │   ├── entity/           # エンティティ
│   │   ├── valueobject/      # 値オブジェクト
│   │   ├── repository/       # リポジトリインターフェース
│   │   └── service/          # ドメインサービス
│   ├── infrastructure/       # インフラストラクチャ層
│   │   ├── repository/       # リポジトリ実装
│   │   ├── config/           # 設定
│   │   └── common/           # ユーティリティクラス
│   └── Application.java
├── src/main/resources/
│   ├── application.yml
│   └── mapper/
└── src/test/
```

**ドメイン駆動設計（DDD）コード例**：

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

    // ドメインメソッド
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

## 4. エンタープライズレベルのアーキテクチャ（ユーザー数 > 100k）

### 4.1 適用シナリオ

- 大規模インターネットプラットフォーム
- 金融取引システム
- 高同時接続ECシステム
- 複数チームでの協業が必要な大規模プロジェクト

### 4.2 マイクロサービスアーキテクチャ

モノリシックアプリケーションで要件を満たせなくなった場合、マイクロサービスアーキテクチャを検討する必要がある：

```
microservices-platform/
├── api-gateway/              # APIゲートウェイ
│   ├── src/
│   └── Dockerfile
├── services/                 # ビジネスサービス
│   ├── user-service/         # ユーザーサービス
│   ├── order-service/        # 注文サービス
│   ├── product-service/      # 商品サービス
│   └── payment-service/      # 決済サービス
├── shared/                   # 共有ライブラリ
│   ├── proto/                # Protocol Buffers
│   ├── common-lib/
│   └── event-contracts/
├── infrastructure/           # インフラストラクチャ
│   ├── docker-compose.yml
│   ├── kubernetes/
│   └── terraform/
└── docs/
```

### 4.3 言語別マイクロサービスフレームワーク

| 言語 | マイクロサービスフレームワーク | サービスディスカバリ | 設定センター | 分散トレーシング |
|------|------------|----------|----------|----------|
| **Node.js** | NestJS + gRPC | Consul | etcd | Jaeger |
| **Python** | FastAPI + Nameko | Eureka | Consul | Zipkin |
| **Go** | Go-kit + gRPC | etcd | etcd | OpenTelemetry |
| **Java** | Spring Cloud | Nacos | Nacos | SkyWalking |

### 4.4 コードベース設計（Monorepo vs Polyrepo）

**Monorepo（単一コードベース）**：

```
monorepo/
├── services/
│   ├── user-service/         # 独立サービス
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── order-service/
│   └── product-service/
├── shared/
│   ├── types/                # 共有型定義
│   ├── utils/                # 共有ユーティリティ
│   └── proto/                # 共有プロトコル
├── packages/
│   ├── eslint-config/        # 共有ESLint設定
│   └── ts-config/            # 共有TS設定
├── docker-compose.yml
└── package.json              # ルートpackage.json
```

**メリット**：
- コード共有が容易
- 統一されたビルドとリリース
- リファクタリングが容易

**デメリット**：
- コードベースが肥大化
- 権限管理が複雑

**Polyrepo（複数コードベース）**：

各サービスが独立したリポジトリ：
- `github.com/company/user-service`
- `github.com/company/order-service`
- `github.com/company/shared-lib`

**メリット**：
- サービスの独立した進化
- チームの自律性
- 権限が明確

**デメリット**：
- コード共有が困難
- バージョン管理が複雑

### 4.5 データ層の設計

**データベース選択戦略**：

| データタイプ | 推奨データベース | 適用シナリオ |
|----------|------------|----------|
| リレーショナルデータ | PostgreSQL | ユーザー、注文、商品 |
| キャッシュ | Redis | セッション、ホットデータ |
| 検索 | Elasticsearch | 商品検索、ログ |
| 時系列データ | InfluxDB/TimescaleDB | 監視、メトリクス |
| ドキュメントデータ | MongoDB | ログ、設定 |

**データアクセス層の設計**：

```
data-layer/
├── primary-db/               # メインデータベース
│   ├── master/               # 書き込み用DB
│   └── slaves/               # 読み取り用DB
├── cache-layer/              # キャッシュ層
│   ├── redis-cluster/
│   └── local-cache/
├── search-engine/            # 検索エンジン
│   └── elasticsearch/
└── message-queue/            # メッセージキュー
    ├── kafka/
    └── rabbitmq/
```

---

## 5. オープンソースプロジェクトアーキテクチャ規約リファレンス

### 5.1 Node.js エコシステム

**Express.js 公式プロジェクト構造**：
```
express-project/
├── bin/                      # 起動スクリプト
├── public/                   # 静的リソース
├── routes/                   # ルーティング
├── views/                    # ビュー
├── app.js                    # アプリケーション設定
└── package.json
```

**NestJS 公式推奨**：
```
nest-project/
├── src/
│   ├── modules/              # 機能モジュール
│   ├── common/               # 共有モジュール
│   ├── config/
│   └── main.ts
├── test/
└── nest-cli.json
```

### 5.2 Python エコシステム

**Django 公式プロジェクト構造**：
```
django-project/
├── project_name/             # プロジェクト設定
├── apps/                     # アプリケーションディレクトリ
├── templates/
├── static/
├── media/
└── manage.py
```

**FastAPI プロジェクト構造**：
```
fastapi-project/
├── app/
│   ├── api/
│   │   ├── deps.py           # 依存関係
│   │   └── v1/
│   │       └── endpoints/
│   ├── core/                 # コア設定
│   ├── db/                   # データベース
│   ├── models/               # モデル
│   ├── schemas/              # Pydanticモデル
│   └── main.py
├── tests/
└── alembic/                  # マイグレーション
```

### 5.3 Go エコシステム

**標準プロジェクトレイアウト**：
```
go-project/
├── cmd/                      # アプリケーションエントリポイント
│   └── app/
│       └── main.go
├── internal/                 # プライベートコード
├── pkg/                      # 公開ライブラリ
├── api/                      # API定義
├── web/                      # 静的リソース
├── configs/                  # 設定
├── scripts/                  # スクリプト
└── go.mod
```

**参考**：
- [golang-standards/project-layout](https://github.com/golang-standards/project-layout)

### 5.4 Java エコシステム

**Spring Boot 公式構造**：
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

**Alibaba Java開発マニュアル**：
- 明確なレイヤー分離：controller/service/manager/dao
- ドメインモデル：DO/DTO/BO/VOの区別
- パッケージ構造：機能モジュールごとに分割

---

## 6. アーキテクチャ進化ロードマップ

### 6.1 進化の例

```
フェーズ1：モノリシックアプリケーション（入門レベル）
    ↓ ユーザー数増加、チーム拡大
フェーズ2：レイヤードアーキテクチャ（中級レベル）
    ↓ ビジネス複雑化、複数チーム協業
フェーズ3：モジュラー/マイクロサービス（エンタープライズレベル）
    ↓ 高同時接続、高可用性要件
フェーズ4：クラウドネイティブアーキテクチャ（プラットフォームレベル）
```

### 6.2 アーキテクチャの判断基準

| シグナル | 現在のレベル | 推奨アップグレード |
|------|----------|----------|
| コードファイル > 50個 | 入門レベル | 中級レベル |
| ビルド時間 > 5分 | 中級レベル | モジュラー化 |
| チーム > 10人 | 中級レベル | マイクロサービス |
| DAU > 10万 | 中級レベル | エンタープライズレベル |
| 多言語技術スタック | モノリス | マイクロサービス |

---

## 7. まとめ

::: tip 💡 核心思想
**アーキテクチャはビジネスに奉仕するものであり、アーキテクチャのためのアーキテクチャではない。**

**ユーザー数による選択**：
- **< 1k**：シンプルなスクリプト、迅速なリリース
- **1k-100k**：レイヤードアーキテクチャ、コード規約
- **> 100k**：マイクロサービス、高可用性設計

**言語による選択**：
- **Node.js**：非同期特性を活かし、I/O集約型に適する
- **Python**：迅速な開発、データ処理とAIに適する
- **Go**：高性能、クラウドネイティブとマイクロサービスに適する
- **Java**：エンタープライズ向け、大規模複雑システムに適する

**普遍的原則**：
1. **漸進的進化**：シンプルなものから始め、ビジネスの成長に合わせる
2. **設定より規約**：統一された規約で、コミュニケーションコストを削減
3. **自動テスト**：リファクタリングの安全性を保証
4. **ドキュメントファースト**：アーキテクチャの意思決定を記録する

**最終目標**：コードを工場の生産ラインのように、規模に関わらず効率的に稼働させること。
:::

---

## 参考リソース

### オープンソースプロジェクト
- [nestjs/nest](https://github.com/nestjs/nest) - Node.js エンタープライズフレームワーク
- [django/django](https://github.com/django/django) - Python Webフレームワーク
- [gin-gonic/gin](https://github.com/gin-gonic/gin) - Go Webフレームワーク
- [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) - Javaフレームワーク

### アーキテクチャガイド
- [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices) - Node.jsベストプラクティス
- [golang-standards/project-layout](https://github.com/golang-standards/project-layout) - Goプロジェクトレイアウト
- [cookiecutter/cookiecutter-django](https://github.com/cookiecutter/cookiecutter-django) - Djangoプロジェクトテンプレート
- [ali-baba/spring-cloud-alibaba](https://github.com/alibaba/spring-cloud-alibaba) - Alibabaマイクロサービス

### 書籍
- 《Clean Architecture》- Robert C. Martin
- 《Building Microservices》- Sam Newman
- 《Designing Data-Intensive Applications》- Martin Kleppmann