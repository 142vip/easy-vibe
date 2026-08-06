# 後端分層架構：分層責任邊界

> **核心問题**: 代碼越写越亂,怎么組织才能清晰易懂?

当项目從几十行代碼擴展到數万行,從單人開發到多人協作,從简單CRUD到複雜業務邏輯時,代碼組织方式直接决定了项目的生死。分層架構不是為了炫技或遵循教條,而是為了解决軟件工程中的一个根本性矛盾:**業務複雜度的自然增長**與**人類認知能力的有限性**之間的衝突。

---

## 1. 分層架構的動機

### 1.1 問题的根源

**初期版本**(100行代碼):
```java
@PostMapping("/register")
public Result register(@RequestBody User user) {
    // 1. 檢查用户名是否重複
    if (userRepository.findByUsername(user.getUsername()) != null) {
        return Result.error("用户名已存在");
    }
    // 2. 加密密碼
    user.setPassword(encrypt(user.getPassword()));
    // 3. 保存用户
    userRepository.save(user);
    // 4. 發送欢迎郵件
    emailService.sendWelcome(user.getEmail());
    // 5. 記錄日志
    log.info("User registered: {}", user.getUsername());
    return Result.success();
}
```

**6个月後**(500行代碼):
- 新增了手機号验證
- 新增了實名認證
- 新增了邀請奖勵
- 新增了風控檢查
- ...

現在這个方法有500行,每次修改都提心吊胆,因為:
- 邏輯混在一起,改一處可能影響其他功能
- 難以測試,每次測試都要模擬完整的HTTP請求
- 新人看不懂,因為所有邏輯都堆在一起

**問题的本质**:代碼没有"邊界",所有职责都混在一起。

**技術债的累积效應**:
- ❌ **高耦合**:業務邏輯與數據访問、HTTP協议耦合,修改牵一發而動全身
- ❌ **低內聚**:一个方法承擔了多个职责,违反單一职责原则
- ❌ **難測試**:无法独立測試業務邏輯,必须启動完整HTTP容器
- ❌ **難複用**:業務邏輯绑定在HTTP請求中,定時任務、消息队列无法複用
- ❌ **認知负荷**:開發者需要同時理解所有層次的细節,无法聚焦

### 1.2 分層的核心思想

分層架構就是给代碼划清邊界:

```
┌─────────────────────────────────────┐
│  接收請求 ← Controller              │  只负责"接單"
├─────────────────────────────────────┤
│  業務編排 ← Service                 │  只负责"做菜"
├─────────────────────────────────────┤
│  數據存取 ← Repository              │  只负责"取食材"
├─────────────────────────────────────┤
│  業務定義 ← Domain                  │  只负责"菜谱標準"
└─────────────────────────────────────┘
```

**關鍵原则**:
- 每一層只做自己的事
- 層與層之間通過明确的接口通信
- 業務邏輯集中在 Service 和 Domain
- 數據访問邏輯集中在 Repository

**分層架構的工程价值**:

1. **降低認知负荷**:開發者可以專注于当前層的职责,无需理解全局细節
2. **提高可測試性**:每層可以独立單元測試,Mock依賴即可
3. **增強可維護性**:需求變更時,定位修改范围明确,降低風險
4. **促進代碼複用**:業務邏輯不依賴HTTP,可在定時任務、消息队列中複用
5. **支持团队協作**:不同開發者可以并行開發不同層,减少衝突
6. **延長代碼寿命**:清晰的邊界讓代碼更容易重構和演進

---

## 2. 四層架構詳解

### 2.1 整體結構

分層架構的本质是**關注點分離**(Separation of Concerns)和**依賴方向控制**:

```
┌─────────────────────────────────────────────────────┐
│  前端請求                                            │
└────────────────────┬────────────────────────────────┘
                     │ HTTP Request
                     ▼
┌─────────────────────────────────────────────────────┐
│  Controller (控制器層)                               │
│  - 接收請求、參數校验                                 │
│  - DTO 轉换                                          │
│  - 調用 Service                                      │
│  - 返回響應                                          │
└────────────────────┬────────────────────────────────┘
                     │ 業務調用
                     ▼
┌─────────────────────────────────────────────────────┐
│  Service (業務邏輯層)                                │
│  - 業務邏輯編排                                      │
│  - 事務管理                                          │
│  - 協調多个 Repository                               │
│  - 跨模塊協調                                        │
└────────────────────┬────────────────────────────────┘
                     │ 數據访問
                     ▼
┌─────────────────────────────────────────────────────┐
│  Repository (數據访問層)                             │
│  - 數據庫 CRUD                                       │
│  - 查询封装                                          │
│  - ORM 映射                                          │
└────────────────────┬────────────────────────────────┘
                     │ 领域對象
                     ▼
┌─────────────────────────────────────────────────────┐
│  Domain (领域模型層)                                 │
│  - 實體 (Entity)                                     │
│  - 值對象 (Value Object)                             │
│  - 業務規则                                          │
└─────────────────────────────────────────────────────┘
```

**依賴方向**:代碼依賴必须指向**更穩定、更抽象**的方向
- Controller 依賴 Service 接口(抽象)
- Service 依賴 Repository 接口(抽象)
- 所有層都依賴 Domain(業務核心,最穩定)
- **不允许反向依賴**(如 Repository 依賴 Service)

<LayeredArchitectureDemo />

### 2.2 Controller 層

**职责**:請求的"接待员"

- 接收 HTTP 請求,解析參數
- 參數校验(格式、必填等)
- DTO 轉换(Request → Param)
- 調用 Service 執行業務
- DTO 轉换(Result → Response)
- 返回 HTTP 響應

**不該做的事**:
- 直接写業務邏輯
- 直接操作數據庫
- 處理事務

**設計哲學**:
Controller 是系统的"門面",承擔適配器职责——将外部HTTP協议適配為內部業務調用。它不應該包含任何業務决策,因為業務决策是领域知識的體現,應該與傳輸協议解耦。

**示例**:
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

        // 2. 調用 Service
        User user = userService.createUser(param);

        // 3. Entity → Response DTO
        return UserResponse.from(user);
    }
}
```

**關鍵點**:
- 用 `@Valid` 自動校验參數
- 用 DTO 隔離前後端數據結構
- 只做"翻译"和"調度",不包含業務邏輯

<ControllerLayerDemo />

### 2.3 Service 層

**职责**:業務的"厨师"

- 實現核心業務邏輯
- 編排多个 Repository 的操作
- 管理事務邊界
- 處理跨模塊協調

**不該做的事**:
- 直接写 SQL(交给 Repository)
- 處理 HTTP 相關的事情
- 返回數據庫實體给 Controller

**設計哲學**:
Service 層是業務邏輯的載體,應該保持纯粹性。它不依賴任何框架或傳輸協议,這样可以:
- 独立于Web層進行單元測試
- 在定時任務、消息队列消費者中複用
- 避免技術栈變更影響業務邏輯

**示例**:
```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public User createUser(UserParam param) {
        // 1. 業務規则:檢查用户名是否重複
        if (userRepository.existsByUsername(param.getUsername())) {
            throw new UserAlreadyExistsException();
        }

        // 2. 創建用户實體
        User user = new User();
        user.setUsername(param.getUsername());
        user.setPassword(param.getPassword());
        user.setEmail(param.getEmail());

        // 3. 保存到數據庫
        userRepository.save(user);

        // 4. 發送欢迎郵件(跨模塊協調)
        emailService.sendWelcomeEmail(user);

        return user;
    }
}
```

**關鍵點**:
- 用Transactional保證事務一致性
- 抛出業務异常,讓Controller统一處理
- 不依賴HTTP概念,可以複用

<ServiceLayerDemo />

### 2.4 Repository 層

**职责**:數據的"倉管员"

- 封装所有數據访問邏輯
- 執行CRUD操作
- 處理ORM映射
- 封装查询條件

**不該做的事**:
- 写業務邏輯
- 處理事務(Service層管理)
- 依賴上層模塊

**設計哲學**:
Repository 是數據访問的抽象層,它隱藏了底層數據庫的细節。這種抽象的价值在于:
- 切换數據庫時只需修改Repository實現,業務邏輯无需變動
- 便于Mock進行單元測試
- 查询邏輯集中管理,避免重複代碼

**示例**:
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data JPA 自動實現
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

    // 自定義複雜查询
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.deleted = false")
    Optional<User> findActiveByEmail(@Param("email") String email);
}
```

**關鍵點**:
- Repository是接口,不包含業務邏輯
- 用方法名表達查询意图
- 可以用Query自定義複雜查询

<RepositoryLayerDemo />

### 2.5 Domain 層

**职责**:業務的"菜谱標準"

- 定義業務實體(Entity)
- 定義值對象(Value Object)
- 封装業務規则
- 作為所有層的共同依賴

**重要特性**:
- Domain層不依賴任何其他層
- 所有層都依賴Domain層
- 是分層架構的基础

**設計哲學**:
Domain層是整个系统的業務核心,它表達了领域知識和業務規则。它的纯粹性至關重要:
- 不依賴框架意味着業務邏輯不被技術栈绑架
- 所有層都依賴它,保證了業務規则的统一性
- 便于長期演進,技術栈可以替换,業務規则相對穩定

**示例**:
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

    // ✅ 業務方法:封装業務規则
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

**關鍵點**:
- Entity 有唯一標識
- 業務規则封装在 Domain 對象中
- Domain 層是纯粹的業務邏輯,不依賴框架

<DomainModelDemo />

---

## 3. DTO:層與層之間的"翻译官"

### 3.1 DTO 的動機

**問题**:如果直接把數據庫實體返回给前端:

```java
// ❌ 錯误:直接返回 Entity
@Entity
public class User {
    private Long id;
    private String username;
    private String password;        // 敏感信息!
    private Boolean isDeleted;      // 內部字段!
}
```

前端會收到不該暴露的字段,存在安全風險。

**解决方案**:用 DTO 做"翻译"

```
數據庫 Entity → Service Param/Result → Controller Request/Response → 前端
```

### 3.2 DTO 的類型

| 類型 | 用途 | 示例 |
|------|------|------|
| Request DTO | Controller 接收參數 | UserCreateRequest |
| Response DTO | Controller 返回數據 | UserResponse |
| Param DTO | Service 方法參數 | UserParam |
| Result DTO | Service 返回結果 | UserResult |
| Entity | 數據庫映射 | User |

**關鍵原则**:
每層使用自己的 DTO,不要直接傳遞 Entity,DTO 只包含必要的字段,這样可以避免暴露內部實現细節,保證各層的独立性。

<DtoFlowDemo />

---

## 4. 依賴方向:分層架構的鐵律

### 4.1 依賴倒置原则

**錯误的做法**:
```
Controller → UserServiceImpl → UserDaoImpl → UserEntity
```

**正确做法**:
```
Controller → UserService(接口) → UserRepository(接口) → UserEntity
```

**依賴方向**:

正确的依賴方向是所有層都依賴更抽象、更穩定的層。具體來說,Controller 依賴 Service 接口,Service 依賴 Repository 接口,所有層都依賴 Domain 層,而 Domain 層不依賴任何其他層。這種依賴方向确保了業務邏輯的独立性和可測試性。

錯误的做法包括 Service 直接依賴 Repository 實現類,Controller 直接操作數據庫,或者 Domain 層依賴其他層,這些都會導致耦合度升高,降低系统的可維護性。

### 4.2 代碼示例

```java
// ✅ 正确:依賴接口
@Service
public class OrderService {
    private final OrderRepository orderRepository;  // 接口
    private final PaymentService paymentService;    // 接口
}

// ✅ 實現類通過 Spring 自動注入
@Repository
public class OrderRepositoryImpl implements OrderRepository {
    // 實現细節
}
```

<DependencyDirectionDemo />

---

## 5. 實戰案例:電商订單系统

### 5.1 需求

創建订單:
1. 用户選择商品
2. 檢查庫存
3. 計算金额
4. 創建订單
5. 扣减庫存

### 5.2 代碼實現

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
            throw new IllegalStateException("只有待支付订單可以取消");
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
        // 1. 验證商品并扣减庫存
        for (OrderItemParam item : param.getItems()) {
            inventoryService.reserveStock(item.getProductId(), item.getQuantity());
        }

        // 2. 創建订單
        Order order = new Order();
        order.setUserId(param.getUserId());
        order.calculateTotal();

        // 3. 保存订單
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

## 6. 常见問题

### 6.1 Controller的写業務邏輯吗合規性判定

Controller 不應該写業務邏輯,它只负责接收請求和返回響應。業務邏輯應該封装在 Service 層,這样做的好處是代碼可以被複用,例如定時任務或消息队列消費者可以直接調用 Service,而不需要通過 HTTP 請求。同時,業務邏輯集中在一个地方,更容易測試和維護,避免了邏輯分散導致的不一致問题。

### 6.2 贫血模型和充血模型概述

贫血模型是指實體類只包含属性和對應的 getter/setter 方法,不包含任何業務邏輯,所有的業務規则都放在 Service 層中實現。這種模型結構简單,易于理解,是大多數项目采用的方式。

充血模型是指實體類不僅包含属性,還包含與該實體相關的業務方法,将業務規则封装在實體內部。這種方式更符合面向對象的設計思想,讓數據和行為在一起,提高了代碼的內聚性。

建议根據团队的技術背景和项目複雜度選择合適的模型,但无论選择哪種,都應該保持一致性,并且 Domain 層至少應該包含基本的業務行為方法,而不是完全的空壳。

### 6.3 處理跨多个 Service 的事務的方法

当一个業務操作需要跨越多个 Service 時,應該在上層的 Service 中使用事務注解,在這个方法中依次調用多个下層的 Service。這样可以确保所有操作在同一个事務上下文中執行,要么全部成功要么全部失敗,保證數據的一致性。需要注意的是,事務邊界應該尽可能小,只包含必要的操作,避免長時間持有數據庫鎖影響并發性能。

---

## 7. 總結

| 層级 | 职责 | 關鍵词 |
|------|------|--------|
| Controller | 接收請求、參數校验、調用 Service、返回響應 | 接待员 |
| Service | 業務邏輯編排、事務管理、協調 Repository | 厨师 |
| Repository | 數據访問、ORM 映射、查询封装 | 倉管员 |
| Domain | 實體定義、業務規则、值對象 | 菜谱標準 |

**���心原则**:
1. 每層只做自己的事
2. 層與層之間通過接口通信
3. 業務邏輯集中在 Service 和 Domain
4. 數據访問邏輯集中在 Repository
5. 用 DTO 隔離各層數據結構
---

## 8. 更多架構模式

本文介绍的是**分層架構**(Layered Architecture),這是最常见、最易上手的後端架構模式。但後端架構遠不止這一種,根據業務場景不同,還有其他值得了解的架構模式:

### 8.1 其他常见架構模式

| 架構模式 | 適用場景 | 特點 |
|----------|----------|------|
| **單體架構** | 小型项目、MVP | 所有功能在一个應用中,部署简單 |
| **微服務架構** | 大型複雜系统 | 拆分為多个独立服務,每个服務可独立部署 |
| **事件驅動架構** | 高并發、异步處理 | 通過事件触發處理流程,解耦度高 |
| **整洁架構** | 複雜業務系统 | 業務邏輯居中,依賴只能向內,框架在最外層 |
| **六邊形架構** | 需要多種外部適配 | 通過端口和適配器隔離核心與外部系统 |
| **洋葱架構** | 领域驅動設計 | 同心圆分層,领域模型在最內層,基础設施在最外層 |

下面逐一展開介绍:

#### 單體架構 (Monolithic)

所有功能打包在一个應用中,共享同一个數據庫和進程。

```
┌──────────────────────────────┐
│         單體應用              │
│  ┌────┐ ┌────┐ ┌────┐       │
│  │用户│ │订單│ │支付│ ...    │
│  └──┬─┘ └──┬─┘ └──┬─┘       │
│     └──────┼──────┘          │
│         共享數據庫            │
└──────────────────────────────┘
```

- **優點**: 開發简單、部署方便、本地調試容易
- **缺點**: 代碼耦合度高,擴展困難,一个模塊出問题可能拖垮整个系统
- **適用**: 早期創業项目、單团队開發、快速原型验證

#### 微服務架構 (Microservices)

将系统拆分為多个独立服務,每个服務擁有自己的數據和業務邏輯,可独立部署和擴展。

```
┌────────┐  ┌────────┐  ┌────────┐
│用户服務 │  │订單服務 │  │支付服務 │
│  DB-1  │  │  DB-2  │  │  DB-3  │
└───┬────┘  └───┬────┘  └───┬────┘
    └───────────┼───────────┘
          API Gateway
```

- **優點**: 独立部署和擴展、技術栈灵活、故障隔離
- **缺點**: 服務間通信複雜、分布式數據一致性難、需要成熟的 DevOps 能力
- **適用**: 大型複雜系统、多团队協作、需要独立擴展的場景

#### 事件驅動架構 (Event-Driven)

通過异步事件進行通信,生產者發出事件,消費者響應事件,組件之間高度解耦。

```
生產者 ──→ [事件總线/消息队列] ──→ 消費者A
                               ──→ 消費者B
                               ──→ 消費者C
```

- **優點**: 高度解耦、天然支持擴展、適合實時處理
- **缺點**: 調試困難、事件顺序和幂等性需要额外處理
- **適用**: 實時數據分析、IoT 系统、微服務間异步通信

#### 整洁架構 (Clean Architecture)

Robert C. Martin 提出,将系统分為四个同心圆層,依賴只能從外向內指向:

```
┌─────────────────────────────────────┐
│  Frameworks & Drivers (框架和驅動)   │
│  ┌─────────────────────────────┐    │
│  │  Interface Adapters (適配器) │    │
│  │  ┌─────────────────────┐    │    │
│  │  │  Use Cases (用例)    │    │    │
│  │  │  ┌─────────────┐    │    │    │
│  │  │  │  Entities    │    │    │    │
│  │  │  │  (實體/领域)  │    │    │    │
│  │  │  └─────────────┘    │    │    │
│  │  └─────────────────────┘    │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
         依賴方向: 外 → 內
```

- **核心規则**: 內層不知道外層的存在,業務邏輯完全独立于框架和數據庫
- **優點**: 高可測試性、技術栈可替换、業務邏輯清晰
- **缺點**: 初期開發成本高、層間映射代碼多、小项目容易過度設計
- **適用**: 複雜業務系统、需要長期維護的项目

<CleanArchitectureDemo />

#### 六邊形架構 (Hexagonal / Ports & Adapters)

通過"端口"定義核心業務的輸入輸出接口,通過"適配器"連接外部系统:

```
        ┌─────────────┐
  HTTP ──→ Port      │
  CLI  ──→ (入端口)   │  核心業務邏輯  │  (出端口) ──→ 數據庫
  MQ   ──→           │               │  Port    ──→ 外部API
        └─────────────┘
```

- **核心思想**: 業務邏輯不依賴任何外部技術,外部系统通過適配器接入
- **優點**: 外部系统可隨意替换、測試時用 Mock 適配器即可
- **適用**: 需要對接多種外部系统的場景

#### 洋葱架構 (Onion Architecture)

與整洁架構類似,強調领域模型在最內層,基础設施在最外層,依賴只能向內:

```
┌──────────────────────────────┐
│  Infrastructure (基础設施)    │
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

- **核心思想**: 领域模型是系统的核心,所有依賴都指向它
- **與整洁架構的區別**: 洋葱架構更強調领域服務層,整洁架構更強調用例層
- **適用**: 采用领域驅動設計(DDD)的项目

### 8.2 架構演進路线

這些架構不是互相替代的關系,而是逐步演進的:

```text
傳统分層架構 (N-Layered)
  │  問题: 層間耦合、難以替换外部依賴
  ▼
六邊形架構 (Ports & Adapters)
  │  改進: 用端口和適配器隔離外部系统
  ▼
洋葱架構 (Onion)
  │  改進: 明确同心圆分層,领域模型居中
  ▼
整洁架構 (Clean Architecture)
  │  改進: 统一依賴規则,明确四層职责
  ▼
根據業務需要選择合適的架構
```

### 8.3 架構模式選择指南

```text
用户量 < 1k, 代碼量 < 5000 行
    ↓
單體架構 + 简單分層
    ↓
用户量 1k-100k, 需要多团队協作
    ↓
分層架構 (本文介绍)
    ↓
用户量 > 100k, 業務複雜度高
    ↓
微服務架構 / 事件驅動架構
```

更细化的選择維度:

| 考虑因素 | 简單分層 | 整洁/六邊形架構 | 微服務 |
|----------|---------|----------------|--------|
| 团队規模 | 1-5 人 | 5-20 人 | 20+ 人 |
| 業務複雜度 | 低 | 中高 | 高 |
| 部署频率 | 低 | 中 | 高(独立部署) |
| 技術栈多样性 | 單一 | 單一 | 可多样 |
| 運維成本 | 低 | 中 | 高 |

### 8.4 推荐阅讀

- **單體架構**: 查看本文的姐妹篇 [`backend-project-architecture.md`](./backend-project-architecture.md),了解從脚本到單體的演進
- **微服務架構**: 查看 [單體到微服務演進導論](/zh-cn/appendix/6-architecture-and-system-design/monolith-to-microservices)
- **整洁架構**: Robert C. Martin 的《Clean Architecture》— 提出依賴規则和四層同心圆模型的經典著作
- **企業架構模式**: Martin Fowler 的《Patterns of Enterprise Application Architecture》— 分層架構、领域邏輯組织的權威參考

### 8.5 選择的方法

**記住這个原则**: **架構服務于業務,不是為架構而架構**。

- 小项目用简單架構,快速上线验證
- 大项目再考虑複雜架構,避免過度設計
- 团队熟悉度也很重要,選择大家都能理解的方案

---

## 9. 總結

| 層级 | 职责 | 關鍵词 |
|------|------|--------|
| Controller | 接收請求、參數校验、調用 Service、返回響應 | 接待员 |
| Service | 業務邏輯編排、事務管理、協調 Repository | 厨师 |
| Repository | 數據访問、ORM 映射、查询封装 | 倉管员 |
| Domain | 實體定義、業務規则、值對象 | 菜谱標準 |

**核心原则**:

分層架構的核心在于明确的职责划分和依賴方向控制。每一層只關注自己的职责,通過接口與相邻層通信,業務邏輯集中在 Service 和 Domain 層,數據访問邏輯集中在 Repository 層,各層之間通過 DTO 隔離數據結構,避免直接暴露內部實現。這样的設計讓系统更易于理解、測試和維護,能够應對業務的持續演進。

---

## 參考资料

1. [Catalog of Patterns of Enterprise Application Architecture - Martin Fowler](https://www.martinfowler.com/eaaCatalog/) — Martin Fowler 的企業應用架構模式目錄，分層架構的經典參考
2. [Backend Side Architecture Evolution (N-layered, DDD, Hexagon, Onion, Clean Architecture)](https://medium.com/@iamprovidence/backend-side-architecture-evolution-n-layered-ddd-hexagon-onion-clean-architecture-643d72444ce4) — 從 N 層架構到整洁架構的演進歷程，理解每種架構诞生的原因
3. [Complete Guide to Clean Architecture - GeeksforGeeks](https://www.geeksforgeeks.org/complete-guide-to-clean-architecture/) — 整洁架構完整指南，詳解分層、依賴規则與關注點分離
4. [Understanding Hexagonal, Clean, Onion, and Traditional Layered Architectures: A Deep Dive](https://romanglushach.medium.com/understanding-hexagonal-clean-onion-and-traditional-layered-architectures-a-deep-dive-c0f93b8a1b96) — 六邊形、整洁、洋葱與傳统分層架構的深度對比
5. [Building Clean Architectures in Modern Backend Frameworks](https://leapcell.io/blog/building-clean-architectures-in-modern-backend-frameworks) — 在現代後端框架中實踐整洁架構的實戰指南
6. [Backend Architecture Patterns: From Monoliths to Microservices](https://nerdleveltech.com/backend-architecture-patterns-from-monoliths-to-microservices) — 從單體到微服務的後端架構模式全景概览
7. [MVC 三層架構案例詳细讲解](https://www.cnblogs.com/TheMagicalRainbowSea/p/17409206.html) — MVC 與三層架構的關系及實戰案例，適合中文讀者入門