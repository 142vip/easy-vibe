# レイヤードアーキテクチャ：Controller・Service・Repository


> **核心問題**: コードが複雑化するにつれて、どう整理すれば明確で理解しやすくなるのか？

プロジェクトが数十行のコードから数万行に拡大し、単独開発から複数人での協業に、単純なCRUDから複雑なビジネスロジックへと進化するにつれて、コードの組織化方法がプロジェクトの成否を直接左右します。レイヤードアーキテクチャは技巧を誇示したり教条に従うためではなく、ソフトウェア工学における根本的な矛盾——**ビジネスの複雑さの自然な増大**と**人間の認知能力の限界**との衝突——を解決するためのものです。

---

## 1. レイヤー化の動機

### 1.1 問題の根源

**初期バージョン**(100行のコード):
```java
@PostMapping("/register")
public Result register(@RequestBody User user) {
    // 1. ユーザー名の重複チェック
    if (userRepository.findByUsername(user.getUsername()) != null) {
        return Result.error("ユーザー名は既に存在します");
    }
    // 2. パスワードの暗号化
    user.setPassword(encrypt(user.getPassword()));
    // 3. ユーザーの保存
    userRepository.save(user);
    // 4. ウェルカムメールの送信
    emailService.sendWelcome(user.getEmail());
    // 5. ログの記録
    log.info("User registered: {}", user.getUsername());
    return Result.success();
}
```

**6ヶ月後**(500行のコード):
- 電話番号認証の追加
- 実名認証の追加
- 招待報酬の追加
- リスク管理チェックの追加
- ...

今やこのメソッドは500行に膨れ上がり、毎回の修正が不安で仕方ありません。なぜなら:
- ロジックが混在しており、一箇所の変更が他の機能に影響を与える可能性がある
- テストが困難で、毎回完全なHTTPリクエストをシミュレートする必要がある
- 新人には理解できず、すべてのロジックが一箇所に詰め込まれている

**問題の本質**: コードに「境界」がなく、すべての責務が混在している。

**技術的負債の累積効果**:
- ❌ **高結合**: ビジネスロジックがデータアクセスやHTTPプロトコルと結合し、一箇所の変更が全体に波及する
- ❌ **低凝集**: 一つのメソッドが複数の責務を担い、単一責任原則に違反している
- ❌ **テスト困難**: ビジネスロジックを独立してテストできず、完全なHTTPコンテナを起動する必要がある
- ❌ **再利用困難**: ビジネスロジックがHTTPリクエストにバインドされており、バッチジョブやメッセージキューで再利用できない
- ❌ **認知的負荷**: 開発者はすべての層の詳細を同時に理解する必要があり、集中できない

### 1.2 レイヤー化の核心思想

レイヤードアーキテクチャとは、コードに明確な境界を引くことです:

```
┌─────────────────────────────────────┐
│  リクエスト受信 ← Controller         │  注文を受けるだけ
├─────────────────────────────────────┤
│  ビジネス編成 ← Service              │  料理を作るだけ
├─────────────────────────────────────┤
│  データアクセス ← Repository         │  食材を取るだけ
├─────────────────────────────────────┤
│  ビジネス定義 ← Domain               │  レシピの基準だけ
└─────────────────────────────────────┘
```

**重要な原則**:
- 各層は自分の仕事だけを行う
- 層と層の間は明確なインターフェースを通じて通信する
- ビジネスロジックは Service と Domain に集中させる
- データアクセスロジックは Repository に集中させる

**レイヤードアーキテクチャの工学的価値**:

1. **認知的負荷の低減**: 開発者は現在の層の責務に集中でき、全体の詳細を理解する必要がない
2. **テスト容易性の向上**: 各層を独立して単体テストでき、依存はMockすればよい
3. **保守性の向上**: 要件変更時に修正範囲の特定が明確で、リスクが低減する
4. **コード再利用の促進**: ビジネスロジックがHTTPに依存せず、バッチジョブやメッセージキューで再利用できる
5. **チーム協業の支援**: 異なる開発者が異なる層を並行して開発でき、コンフリクトが減少する
6. **コード寿命の延長**: 明確な境界により、コードのリファクタリングと進化が容易になる

---

## 2. 四層アーキテクチャ詳解

### 2.1 全体構造

レイヤードアーキテクチャの本質は**関心の分離**(Separation of Concerns)と**依存方向の制御**です:

```
┌─────────────────────────────────────────────────────┐
│  フロントエンドリクエスト                              │
└────────────────────┬────────────────────────────────┘
                     │ HTTP Request
                     ▼
┌─────────────────────────────────────────────────────┐
│  Controller (コントローラー層)                        │
│  - リクエスト受信、パラメータ検証                      │
│  - DTO 変換                                           │
│  - Service 呼び出し                                    │
│  - レスポンス返却                                      │
└────────────────────┬────────────────────────────────┘
                     │ ビジネス呼び出し
                     ▼
┌─────────────────────────────────────────────────────┐
│  Service (ビジネスロジック層)                         │
│  - ビジネスロジック編成                               │
│  - トランザクション管理                               │
│  - 複数 Repository の調整                              │
│  - モジュール間調整                                    │
└────────────────────┬────────────────────────────────┘
                     │ データアクセス
                     ▼
┌─────────────────────────────────────────────────────┐
│  Repository (データアクセス層)                         │
│  - データベース CRUD                                    │
│  - クエリカプセル化                                     │
│  - ORM マッピング                                       │
└────────────────────┬────────────────────────────────┘
                     │ ドメインオブジェクト
                     ▼
┌─────────────────────────────────────────────────────┐
│  Domain (ドメインモデル層)                             │
│  - エンティティ (Entity)                                │
│  - 値オブジェクト (Value Object)                        │
│  - ビジネスルール                                       │
└─────────────────────────────────────────────────────┘
```

**依存方向**: コードの依存は**より安定し、より抽象的な**方向を指さなければならない
- Controller は Service インターフェース(抽象)に依存する
- Service は Repository インターフェース(抽象)に依存する
- すべての層は Domain(ビジネスの中核、最も安定)に依存する
- **逆方向の依存は許されない**(例: Repository が Service に依存する)

<LayeredArchitectureDemo />

### 2.2 Controller 層

**責務**: リクエストの「受付係」

- HTTP リクエストの受信、パラメータの解析
- パラメータ検証(形式、必須項目など)
- DTO 変換(Request → Param)
- Service を呼び出してビジネスを実行
- DTO 変換(Result → Response)
- HTTP レスポンスの返却

**やってはいけないこと**:
- ビジネスロジックを直接書く
- データベースを直接操作する
- トランザクションを処理する

**設計哲学**:
Controller はシステムの「ファサード」であり、アダプターの責務を担います——外部のHTTPプロトコルを内部のビジネス呼び出しに適応させます。ビジネス上の意思決定を含んではなりません。ビジネス上の意思決定はドメイン知識の具現化であり、伝送プロトコルから切り離されるべきだからです。

**例**:
```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @PostMapping
    public UserResponse createUser(
            @RequestBody @Valid UserRequest request) {

        // 1. Request DTO → Param DTO
        UserParam param = UserParam.builder()
                .username(request.getUsername())
                .password(encrypt(request.getPassword()))
                .email(request.getEmail())
                .build();

        // 2. Service 呼び出し
        User user = userService.createUser(param);

        // 3. Entity → Response DTO
        return UserResponse.from(user);
    }
}
```

**ポイント**:
- `@Valid` でパラメータを自動検証する
- DTO でフロントエンドとバックエンドのデータ構造を分離する
- 「翻訳」と「スケジューリング」だけを行い、ビジネスロジックを含まない

<ControllerLayerDemo />

### 2.3 Service 層

**責務**: ビジネスの「シェフ」

- コアビジネスロジックの実装
- 複数の Repository 操作の編成
- トランザクション境界の管理
- モジュール間調整の処理

**やってはいけないこと**:
- SQL を直接書く(Repository に任せる)
- HTTP 関連の処理をする
- データベースエンティティを Controller に返す

**設計哲学**:
Service 層はビジネスロジックの担い手であり、純粋性を保つべきです。いかなるフレームワークや伝送プロトコルにも依存しません。これにより:
- Web層から独立して単体テストが可能
- バッチジョブやメッセージキューコンシューマーで再利用可能
- 技術スタックの変更がビジネスロジックに影響を与えない

**例**:
```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public User createUser(UserParam param) {
        // 1. ビジネスルール: ユーザー名の重複チェック
        if (userRepository.existsByUsername(param.getUsername())) {
            throw new UserAlreadyExistsException();
        }

        // 2. ユーザーエンティティの作成
        User user = new User();
        user.setUsername(param.getUsername());
        user.setPassword(param.getPassword());
        user.setEmail(param.getEmail());

        // 3. データベースに保存
        userRepository.save(user);

        // 4. ウェルカムメールの送信(モジュール間調整)
        emailService.sendWelcomeEmail(user);

        return user;
    }
}
```

**ポイント**:
- @Transactional でトランザクションの一貫性を保証する
- ビジネス例外をスローし、Controller で統一的に処理する
- HTTP の概念に依存せず、再利用可能

<ServiceLayerDemo />

### 2.4 Repository 層

**責務**: データの「倉庫管理者」

- すべてのデータアクセスロジックのカプセル化
- CRUD 操作の実行
- ORM マッピングの処理
- クエリ条件のカプセル化

**やってはいけないこと**:
- ビジネスロジックを書く
- トランザクションを処理する(Service 層が管理)
- 上位層のモジュールに依存する

**設計哲学**:
Repository はデータアクセスの抽象層であり、基盤となるデータベースの詳細を隠蔽します。この抽象化の価値は:
- データベースを切り替える際に Repository の実装だけを修正すればよく、ビジネスロジックは変更不要
- Mock による単体テストが容易
- クエリロジックを一元的に管理し、重複コードを回避

**例**:
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data JPA による自動実装
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

    // カスタム複雑クエリ
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.deleted = false")
    Optional<User> findActiveByEmail(@Param("email") String email);
}
```

**ポイント**:
- Repository はインターフェースであり、ビジネスロジックを含まない
- メソッド名でクエリの意図を表現する
- @Query で複雑なクエリをカスタマイズできる

<RepositoryLayerDemo />

### 2.5 Domain 層

**責務**: ビジネスの「レシピの基準」

- ビジネスエンティティ(Entity)の定義
- 値オブジェクト(Value Object)の定義
- ビジネスルールのカプセル化
- すべての層の共通依存として機能

**重要な特性**:
- Domain 層は他のどの層にも依存しない
- すべての層が Domain 層に依存する
- レイヤードアーキテクチャの基盤である

**設計哲学**:
Domain 層はシステム全体のビジネスコアであり、ドメイン知識とビジネスルールを表現します。その純粋性は極めて重要です:
- フレームワークに依存しないことで、ビジネスロジックが技術スタックに束縛されない
- すべての層がこれに依存することで、ビジネスルールの統一性が保証される
- 長期的な進化が容易で、技術スタックは交換可能だが、ビジネスルールは比較的安定している

**例**:
```java
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    // ✅ ビジネスメソッド: ビジネスルールのカプセル化
    public boolean isPasswordCorrect(String rawPassword) {
        return BCrypt.checkpw(rawPassword, this.password);
    }

    public void changePassword(String oldPassword, String newPassword) {
        if (!isPasswordCorrect(oldPassword)) {
            throw new IncorrectPasswordException();
        }
        this.password = BCrypt.hashpw(newPassword);
    }
}
```

**ポイント**:
- Entity は一意の識別子を持つ
- ビジネスルールは Domain オブジェクトにカプセル化される
- Domain 層は純粋なビジネスロジックであり、フレームワークに依存しない

<DomainModelDemo />

---

## 3. DTO: 層と層の間の「翻訳者」

### 3.1 DTOの動機

**問題**: データベースエンティティをそのままフロントエンドに返すと:

```java
// ❌ 誤り: Entity を直接返す
@Entity
public class User {
    private Long id;
    private String username;
    private String password;        // 機密情報!
    private Boolean isDeleted;      // 内部フィールド!
}
```

フロントエンドが公開すべきでないフィールドを受け取ってしまい、セキュリティリスクがあります。

**解決策**: DTO で「翻訳」する

```
データベース Entity → Service Param/Result → Controller Request/Response → フロントエンド
```

### 3.2 DTO の種類

| 種類 | 用途 | 例 |
|------|------|------|
| Request DTO | Controller がパラメータを受信 | UserCreateRequest |
| Response DTO | Controller がデータを返却 | UserResponse |
| Param DTO | Service メソッドのパラメータ | UserParam |
| Result DTO | Service の戻り値 | UserResult |
| Entity | データベースマッピング | User |

**重要な原則**:
各層は独自の DTO を使用し、Entity を直接渡さないこと。DTO は必要なフィールドのみを含めること。これにより内部実装の詳細の露出を防ぎ、各層の独立性を保証できます。

<DtoFlowDemo />

---

## 4. 依存方向: レイヤードアーキテクチャの鉄則

### 4.1 依存関係逆転の原則

**誤った方法**:
```
Controller → UserServiceImpl → UserDaoImpl → UserEntity
```

**正しい方法**:
```
Controller → UserService(インターフェース) → UserRepository(インターフェース) → UserEntity
```

**依存方向**:

正しい依存方向とは、すべての層がより抽象的でより安定した層に依存することです。具体的には、Controller は Service インターフェースに依存し、Service は Repository インターフェースに依存し、すべての層は Domain 層に依存し、Domain 層は他のどの層にも依存しません。この依存方向がビジネスロジックの独立性とテスト容易性を保証します。

誤った方法としては、Service が Repository の実装クラスに直接依存する、Controller がデータベースを直接操作する、Domain 層が他の層に依存するなどがあり、これらはいずれも結合度を高め、システムの保守性を低下させます。

### 4.2 コード例

```java
// ✅ 正しい: インターフェースに依存
@Service
public class OrderService {
    private final OrderRepository orderRepository;  // インターフェース
    private final PaymentService paymentService;    // インターフェース
}

// ✅ 実装クラスは Spring によって自動注入
@Repository
public class OrderRepositoryImpl implements OrderRepository {
    // 実装の詳細
}
```

<DependencyDirectionDemo />

---

## 5. 実践ケース: EC注文システム

### 5.1 要件

注文作成:
1. ユーザーが商品を選択
2. 在庫を確認
3. 金額を計算
4. 注文を作成
5. 在庫を減算

### 5.2 コード実装

**Domain 層**:
```java
@Entity
public class Order {
    @Id
    private Long id;
    private Long userId;
    private List<OrderItem> items;
    private Money totalAmount;
    private OrderStatus status;

    public void calculateTotal() {
        Money total = Money.zero();
        for (OrderItem item : items) {
            total = total.add(item.getSubTotal());
        }
        this.totalAmount = total;
    }

    public void cancel() {
        if (this.status != OrderStatus.PENDING_PAYMENT) {
            throw new IllegalStateException("支払待ちの注文のみキャンセル可能です");
        }
        this.status = OrderStatus.CANCELLED;
    }
}
```

**Repository 層**:
```java
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}
```

**Service 層**:
```java
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final InventoryService inventoryService;

    @Transactional
    public OrderDTO createOrder(OrderParam param) {
        // 1. 商品を検証し在庫を確保
        for (OrderItemParam item : param.getItems()) {
            inventoryService.reserveStock(item.getProductId(), item.getQuantity());
        }

        // 2. 注文を作成
        Order order = new Order();
        order.setUserId(param.getUserId());
        order.calculateTotal();

        // 3. 注文を保存
        orderRepository.save(order);

        return OrderDTO.from(order);
    }
}
```

**Controller 層**:
```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public OrderResponse createOrder(@RequestBody @Valid OrderRequest request) {
        OrderParam param = OrderParam.builder()
                .userId(request.getUserId())
                .items(request.getItems())
                .build();

        OrderDTO order = orderService.createOrder(param);

        return OrderResponse.from(order);
    }
}
```

---

## 6. よくある質問

### 6.1 Controller でビジネスロジックを書いてもよいですか

Controller でビジネスロジックを書くべきではありません。Controller はリクエストの受信とレスポンスの返却のみを担当します。ビジネスロジックは Service 層にカプセル化すべきです。これにより、コードが再利用可能になります。例えば、バッチジョブやメッセージキューコンシューマーが HTTP リクエストを経由せずに直接 Service を呼び出せます。同時に、ビジネスロジックが一箇所に集中することで、テストと保守が容易になり、ロジックの分散による不整合の問題を回避できます。

### 6.2 貧血モデルと充血モデルとは何ですか

貧血モデルとは、エンティティクラスが属性とそれに対応する getter/setter メソッドのみを含み、ビジネスロジックを一切含まず、すべてのビジネスルールを Service 層で実装する方式です。このモデルは構造がシンプルで理解しやすく、ほとんどのプロジェクトで採用されている方式です。

充血モデルとは、エンティティクラスが属性だけでなく、そのエンティティに関連するビジネスメソッドも含み、ビジネスルールをエンティティ内部にカプセル化する方式です。この方式はオブジェクト指向の設計思想により適合しており、データと振る舞いを一緒にすることでコードの凝集性を高めます。

チームの技術的背景とプロジェクトの複雑さに応じて適切なモデルを選択することをお勧めしますが、どちらを選ぶにしても一貫性を保つべきであり、少なくとも Domain 層には基本的なビジネス振る舞いメソッドを含めるべきで、完全な空殻にすべきではありません。

### 6.3 複数の Service にまたがるトランザクションはどう処理しますか

一つのビジネス操作が複数の Service にまたがる場合、上位の Service でトランザクションアノテーションを使用し、そのメソッド内で複数の下位 Service を順次呼び出すべきです。これにより、すべての操作が同じトランザクションコンテキストで実行され、すべて成功するかすべて失敗するかのいずれかとなり、データの一貫性が保証されます。注意すべき点として、トランザクション境界は可能な限り小さくし、必要な操作のみを含めることで、データベースロックの長時間保持による並行性能への影響を避けるべきです。

---

## 7. まとめ

| 層 | 責務 | キーワード |
|------|------|--------|
| Controller | リクエスト受信、パラメータ検証、Service 呼び出し、レスポンス返却 | 受付係 |
| Service | ビジネスロジック編成、トランザクション管理、Repository 調整 | シェフ |
| Repository | データアクセス、ORM マッピング、クエリカプセル化 | 倉庫管理者 |
| Domain | エンティティ定義、ビジネスルール、値オブジェクト | レシピの基準 |

**核心原則**:
1. 各層は自分の仕事だけを行う
2. 層と層の間はインターフェースを通じて通信する
3. ビジネスロジックは Service と Domain に集中させる
4. データアクセスロジックは Repository に集中させる
5. DTO で各層のデータ構造を分離する
---

## 8. その他のアーキテクチャパターン

本記事で紹介するのは**レイヤードアーキテクチャ**(Layered Architecture)であり、最も一般的で習得しやすいバックエンドアーキテクチャパターンです。しかし、バックエンドアーキテクチャはこれだけではありません。ビジネスシナリオに応じて、他にも知っておく価値のあるアーキテクチャパターンがあります:

### 8.1 その他の一般的なアーキテクチャパターン

| アーキテクチャパターン | 適用シーン | 特徴 |
|----------|----------|------|
| **モノリシックアーキテクチャ** | 小規模プロジェクト、MVP | すべての機能が一つのアプリケーション内にあり、デプロイが簡単 |
| **マイクロサービスアーキテクチャ** | 大規模複雑システム | 複数の独立したサービスに分割され、各サービスが独立してデプロイ可能 |
| **イベント駆動アーキテクチャ** | 高並列、非同期処理 | イベントを通じて処理フローをトリガーし、疎結合度が高い |
| **クリーンアーキテクチャ** | 複雑なビジネスシステム | ビジネスロジックが中心、依存は内向きのみ、フレームワークは最外層 |
| **ヘキサゴナルアーキテクチャ** | 複数の外部アダプターが必要 | ポートとアダプターを通じてコアと外部システムを分離 |
| **オニオンアーキテクチャ** | ドメイン駆動設計 | 同心円状のレイヤー、ドメインモデルが最内層、インフラストラクチャが最外層 |

以下、一つずつ展開して紹介します:

#### モノリシックアーキテクチャ (Monolithic)

すべての機能を一つのアプリケーションにパッケージ化し、同じデータベースとプロセスを共有します。

```
┌──────────────────────────────┐
│       モノリシックアプリ       │
│  ┌────┐ ┌────┐ ┌────┐       │
│  │ユーザ│ │注文│ │支払│ ...   │
│  └──┬─┘ └──┬─┘ └──┬─┘       │
│     └──────┼──────┘          │
│        共有データベース        │
└──────────────────────────────┘
```

- **利点**: 開発が簡単、デプロイが容易、ローカルデバッグがしやすい
- **欠点**: コードの結合度が高く、拡張が困難、一つのモジュールの問題がシステム全体をダウンさせる可能性がある
- **適用**: 初期のスタートアッププロジェクト、単一チーム開発、迅速なプロトタイプ検証

#### マイクロサービスアーキテクチャ (Microservices)

システムを複数の独立したサービスに分割し、各サービスが独自のデータとビジネスロジックを持ち、独立してデプロイ・拡張可能です。

```
┌────────┐  ┌────────┐  ┌────────┐
│ユーザSVC│  │注文SVC │  │支払SVC │
│  DB-1  │  │  DB-2  │  │  DB-3  │
└───┬────┘  └───┬────┘  └───┬────┘
    └───────────┼───────────┘
          API Gateway
```

- **利点**: 独立したデプロイと拡張、柔軟な技術スタック、障害の分離
- **欠点**: サービス間通信が複雑、分散データの一貫性が困難、成熟した DevOps 能力が必要
- **適用**: 大規模複雑システム、複数チーム協業、独立した拡張が必要なシーン

#### イベント駆動アーキテクチャ (Event-Driven)

非同期イベントを通じて通信し、プロデューサーがイベントを発行し、コンシューマーがイベントに応答します。コンポーネント間は高度に疎結合です。

```
プロデューサー ──→ [イベントバス/メッセージキュー] ──→ コンシューマーA
                                              ──→ コンシューマーB
                                              ──→ コンシューマーC
```

- **利点**: 高度な疎結合、自然な拡張サポート、リアルタイム処理に適している
- **欠点**: デバッグが困難、イベントの順序と冪等性に追加の処理が必要
- **適用**: リアルタイムデータ分析、IoT システム、マイクロサービス間の非同期通信

#### クリーンアーキテクチャ (Clean Architecture)

Robert C. Martin が提唱し、システムを四つの同心円層に分割し、依存は外から内へのみ可能です:

```
┌─────────────────────────────────────┐
│  Frameworks & Drivers (フレームワークとドライバ) │
│  ┌─────────────────────────────┐    │
│  │  Interface Adapters (アダプター) │    │
│  │  ┌─────────────────────┐    │    │
│  │  │  Use Cases (ユースケース) │    │    │
│  │  │  ┌─────────────┐    │    │    │
│  │  │  │  Entities    │    │    │    │
│  │  │  │  (エンティティ/ドメイン) │    │    │    │
│  │  │  └─────────────┘    │    │    │
│  │  └─────────────────────┘    │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
         依存方向: 外 → 内
```

- **核心ルール**: 内層は外層の存在を知らず、ビジネスロジックはフレームワークやデータベースから完全に独立
- **利点**: 高いテスト容易性、技術スタックの交換可能性、ビジネスロジックの明確さ
- **欠点**: 初期開発コストが高い、層間のマッピングコードが多い、小規模プロジェクトでは過剰設計になりやすい
- **適用**: 複雑なビジネスシステム、長期的な保守が必要なプロジェクト

<CleanArchitectureDemo />

#### ヘキサゴナルアーキテクチャ (Hexagonal / Ports & Adapters)

「ポート」を通じてコアビジネスの入出力インターフェースを定義し、「アダプター」を通じて外部システムと接続します:

```
        ┌─────────────┐
  HTTP ──→ Port      │
  CLI  ──→ (入力ポート) │  コアビジネスロジック  │  (出力ポート) ──→ データベース
  MQ   ──→           │                      │  Port    ──→ 外部API
        └─────────────┘
```

- **核心思想**: ビジネスロジックはいかなる外部技術にも依存せず、外部システムはアダプターを通じて接続される
- **利点**: 外部システムを自由に交換可能、テスト時は Mock アダプターで済む
- **適用**: 複数の外部システムと連携する必要があるシーン

#### オニオンアーキテクチャ (Onion Architecture)

クリーンアーキテクチャと類似しており、ドメインモデルが最内層、インフラストラクチャが最外層で、依存は内向きのみです:

```
┌──────────────────────────────┐
│  Infrastructure (インフラ)     │
│  ┌────────────────────────┐  │
│  │  Application Services  │  │
│  │  ┌──────────────────┐  │  │
│  │  │  Domain Services  │  │  │
│  │  │  ┌────────────┐   │  │  │
│  │  │  │Domain Model│   │  │  │
│  │  │  └────────────┘   │  │  │
│  │  └──────────────────┘  │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

- **核心思想**: ドメインモデルがシステムの核心であり、すべての依存がそれを指す
- **クリーンアーキテクチャとの違い**: オニオンアーキテクチャはドメインサービス層をより重視し、クリーンアーキテクチャはユースケース層をより重視する
- **適用**: ドメイン駆動設計(DDD)を採用するプロジェクト

### 8.2 アーキテクチャ進化の道筋

これらのアーキテクチャは相互に代替する関係ではなく、段階的に進化していくものです:

```text
従来のレイヤードアーキテクチャ (N-Layered)
  │  問題: 層間の結合、外部依存の交換が困難
  ▼
ヘキサゴナルアーキテクチャ (Ports & Adapters)
  │  改善: ポートとアダプターで外部システムを分離
  ▼
オニオンアーキテクチャ (Onion)
  │  改善: 同心円状のレイヤー分けを明確化、ドメインモデルを中心に
  ▼
クリーンアーキテクチャ (Clean Architecture)
  │  改善: 依存ルールを統一、四層の責務を明確化
  ▼
ビジネスニーズに応じて適切なアーキテクチャを選択
```

### 8.3 アーキテクチャパターン選択ガイド

```text
ユーザー数 < 1k, コード量 < 5000 行
    ↓
モノリシックアーキテクチャ + シンプルなレイヤー化
    ↓
ユーザー数 1k-100k, 複数チーム協業が必要
    ↓
レイヤードアーキテクチャ (本記事で紹介)
    ↓
ユーザー数 > 100k, ビジネス複雑度が高い
    ↓
マイクロサービスアーキテクチャ / イベント駆動アーキテクチャ
```

より詳細な選択軸:

| 考慮要素 | シンプルレイヤー | クリーン/ヘキサゴナル | マイクロサービス |
|----------|---------|----------------|--------|
| チーム規模 | 1-5 人 | 5-20 人 | 20+ 人 |
| ビジネス複雑度 | 低 | 中高 | 高 |
| デプロイ頻度 | 低 | 中 | 高(独立デプロイ) |
| 技術スタック多様性 | 単一 | 単一 | 多様可 |
| 運用コスト | 低 | 中 | 高 |

### 8.4 推奨文献

- **モノリシックアーキテクチャ**: 本記事の姉妹編 [`backend-project-architecture.md`](./backend-project-architecture.md) を参照し、スクリプトからモノリスへの進化を理解する
- **マイクロサービスアーキテクチャ**: [アーキテクチャ進化：モノリスからマイクロサービスへ](/zh-cn/appendix/6-architecture-and-system-design/monolith-to-microservices) を参照
- **クリーンアーキテクチャ**: Robert C. Martin の《Clean Architecture》— 依存ルールと四層同心円モデルを提唱した古典的名著
- **エンタープライズアーキテクチャパターン**: Martin Fowler の《Patterns of Enterprise Application Architecture》— レイヤードアーキテクチャ、ドメインロジック組織化の権威ある参考書

### 8.5 どのように選ぶか

**この原則を覚えておいてください**: **アーキテクチャはビジネスに奉仕するものであり、アーキテクチャのためのアーキテクチャではありません**。

- 小規模プロジェクトはシンプルなアーキテクチャで、迅速にリリースして検証する
- 大規模プロジェクトになってから複雑なアーキテクチャを検討し、過剰設計を避ける
- チームの習熟度も重要で、全員が理解できる方案を選ぶ

---

## 9. まとめ

| 層 | 責務 | キーワード |
|------|------|--------|
| Controller | リクエスト受信、パラメータ検証、Service 呼び出し、レスポンス返却 | 受付係 |
| Service | ビジネスロジック編成、トランザクション管理、Repository 調整 | シェフ |
| Repository | データアクセス、ORM マッピング、クエリカプセル化 | 倉庫管理者 |
| Domain | エンティティ定義、ビジネスルール、値オブジェクト | レシピの基準 |

**核心原則**:

レイヤードアーキテクチャの核心は、明確な責務分担と依存方向の制御にあります。各層は自分の責務だけに集中し、インターフェースを通じて隣接する層と通信します。ビジネスロジックは Service と Domain 層に集中させ、データアクセスロジックは Repository 層に集中させ、各層の間は DTO でデータ構造を分離し、内部実装の直接露出を避けます。このような設計により、システムは理解しやすく、テストしやすく、保守しやすくなり、ビジネスの継続的な進化に対応できます。

---

## 参考資料

1. [Catalog of Patterns of Enterprise Application Architecture - Martin Fowler](https://www.martinfowler.com/eaaCatalog/) — Martin Fowler のエンタープライズアプリケーションアーキテクチャパターンカタログ、レイヤードアーキテクチャの古典的参考書
2. [Backend Side Architecture Evolution (N-layered, DDD, Hexagon, Onion, Clean Architecture)](https://medium.com/@iamprovidence/backend-side-architecture-evolution-n-layered-ddd-hexagon-onion-clean-architecture-643d72444ce4) — N層アーキテクチャからクリーンアーキテクチャへの進化の過程、各アーキテクチャが生まれた理由を理解する
3. [Complete Guide to Clean Architecture - GeeksforGeeks](https://www.geeksforgeeks.org/complete-guide-to-clean-architecture/) — クリーンアーキテクチャ完全ガイド、レイヤー分け・依存ルール・関心の分離を詳解
4. [Understanding Hexagonal, Clean, Onion, and Traditional Layered Architectures: A Deep Dive](https://romanglushach.medium.com/understanding-hexagonal-clean-onion-and-traditional-layered-architectures-a-deep-dive-c0f93b8a1b96) — ヘキサゴナル、クリーン、オニオン、従来のレイヤードアーキテクチャの詳細比較
5. [Building Clean Architectures in Modern Backend Frameworks](https://leapcell.io/blog/building-clean-architectures-in-modern-backend-frameworks) — モダンバックエンドフレームワークでクリーンアーキテクチャを実践するためのガイド
6. [Backend Architecture Patterns: From Monoliths to Microservices](https://nerdleveltech.com/backend-architecture-patterns-from-monoliths-to-microservices) — モノリスからマイクロサービスまでのバックエンドアーキテクチャパターン全景
7. [MVC 三層アーキテクチャケース詳細解説](https://www.cnblogs.com/TheMagicalRainbowSea/p/17409206.html) — MVC と三層アーキテクチャの関係および実践ケース、中国語読者の入門に適している