# 백엔드 계층형 아키텍처 전체상

> **핵심 질문**: 코드가 점점 지저분해지는데, 어떻게 구성해야 명확하고 이해하기 쉬울까?

프로젝트가 수십 줄에서 수만 줄로, 혼자 개발에서 여러 사람이 협업하는 방식으로, 단순한 CRUD에서 복잡한 비즈니스 로직으로 확장될 때, 코드 구성 방식은 프로젝트의 성패를 직접적으로 결정한다. 계층형 아키텍처는 기술 과시나 교조적 규칙을 따르기 위한 것이 아니라, 소프트웨어 엔지니어링의 근본적인 모순을 해결하기 위한 것이다. 바로 **비즈니스 복잡도의 자연스러운 증가**와 **인간 인지 능력의 한계** 사이의 충돌이다.

---

## 1. 계층화가 필요한 이유

### 1.1 문제의 근원

**초기 버전**(100줄 코드):
```java
@PostMapping("/register")
public Result register(@RequestBody User user) {
    // 1. 사용자명 중복 확인
    if (userRepository.findByUsername(user.getUsername()) != null) {
        return Result.error("사용자명이 이미 존재합니다");
    }
    // 2. 비밀번호 암호화
    user.setPassword(encrypt(user.getPassword()));
    // 3. 사용자 저장
    userRepository.save(user);
    // 4. 환영 이메일 전송
    emailService.sendWelcome(user.getEmail());
    // 5. 로그 기록
    log.info("User registered: {}", user.getUsername());
    return Result.success();
}
```

**6개월 후**(500줄 코드):
- 휴대폰 번호 인증 추가
- 실명 인증 추가
- 초대 보상 추가
- 리스크 관리 검사 추가
- ...

이제 이 메서드는 500줄에 달하며, 수정할 때마다 불안해진다:
- 로직이 뒤섞여 있어 한 곳을 수정하면 다른 기능에 영향을 줄 수 있다
- 테스트가 어렵고, 매번 완전한 HTTP 요청을 시뮬레이션해야 한다
- 새로 합류한 사람은 이해할 수 없다. 모든 로직이 한데 쌓여 있기 때문이다

**문제의 본질**: 코드에 "경계"가 없고, 모든 책임이 뒤섞여 있다.

**기술 부채의 누적 효과**:
- ❌ **높은 결합도**: 비즈니스 로직이 데이터 접근, HTTP 프로토콜과 결합되어 있어 작은 수정이 전체에 영향을 미친다
- ❌ **낮은 응집도**: 하나의 메서드가 여러 책임을 지고 있어 단일 책임 원칙을 위반한다
- ❌ **테스트 어려움**: 비즈니스 로직을 독립적으로 테스트할 수 없고, 완전한 HTTP 컨테이너를 실행해야 한다
- ❌ **재사용 어려움**: 비즈니스 로직이 HTTP 요청에 바인딩되어 있어, 스케줄 작업이나 메시지 큐에서 재사용할 수 없다
- ❌ **인지 부하**: 개발자가 모든 계층의 세부 사항을 동시에 이해해야 하며, 집중할 수 없다

### 1.2 계층화의 핵심 사상

계층형 아키텍처는 코드에 명확한 경계를 긋는 것이다:

```
┌─────────────────────────────────────┐
│  요청 수신 ← Controller             │  "주문 접수"만 담당
├─────────────────────────────────────┤
│  비즈니스 오케스트레이션 ← Service   │  "요리"만 담당
├─────────────────────────────────────┤
│  데이터 접근 ← Repository           │  "재료 가져오기"만 담당
├─────────────────────────────────────┤
│  비즈니스 정의 ← Domain             │  "레시피 표준"만 담당
└─────────────────────────────────────┘
```

**핵심 원칙**:
- 각 계층은 자신의 일만 한다
- 계층 간에는 명확한 인터페이스를 통해 통신한다
- 비즈니스 로직은 Service와 Domain에 집중된다
- 데이터 접근 로직은 Repository에 집중된다

**계층형 아키텍처의 엔지니어링 가치**:

1. **인지 부하 감소**: 개발자가 현재 계층의 책임에 집중할 수 있으며, 전체 세부 사항을 이해할 필요가 없다
2. **테스트 용이성 향상**: 각 계층을 독립적으로 단위 테스트할 수 있으며, 의존성만 Mock하면 된다
3. **유지보수성 향상**: 요구사항 변경 시 수정 범위를 명확히 파악할 수 있어 위험을 줄일 수 있다
4. **코드 재사용 촉진**: 비즈니스 로직이 HTTP에 의존하지 않아, 스케줄 작업이나 메시지 큐에서 재사용할 수 있다
5. **팀 협업 지원**: 여러 개발자가 서로 다른 계층을 병렬로 개발할 수 있어 충돌을 줄일 수 있다
6. **코드 수명 연장**: 명확한 경계 덕분에 코드를 더 쉽게 리팩터링하고 발전시킬 수 있다

---

## 2. 4계층 아키텍처 상세

### 2.1 전체 구조

계층형 아키텍처의 본질은 **관심사 분리**(Separation of Concerns)와 **의존성 방향 제어**다:

```
┌─────────────────────────────────────────────────────┐
│  프론트엔드 요청                                      │
└────────────────────┬────────────────────────────────┘
                     │ HTTP Request
                     ▼
┌─────────────────────────────────────────────────────┐
│  Controller (컨트롤러 계층)                           │
│  - 요청 수신, 파라미터 유효성 검사                     │
│  - DTO 변환                                          │
│  - Service 호출                                      │
│  - 응답 반환                                         │
└────────────────────┬────────────────────────────────┘
                     │ 비즈니스 호출
                     ▼
┌─────────────────────────────────────────────────────┐
│  Service (비즈니스 로직 계층)                         │
│  - 비즈니스 로직 오케스트레이션                        │
│  - 트랜잭션 관리                                      │
│  - 여러 Repository 조정                              │
│  - 크로스 모듈 조정                                   │
└────────────────────┬────────────────────────────────┘
                     │ 데이터 접근
                     ▼
┌─────────────────────────────────────────────────────┐
│  Repository (데이터 접근 계층)                        │
│  - 데이터베이스 CRUD                                   │
│  - 쿼리 캡슐화                                        │
│  - ORM 매핑                                          │
└────────────────────┬────────────────────────────────┘
                     │ 도메인 객체
                     ▼
┌─────────────────────────────────────────────────────┐
│  Domain (도메인 모델 계층)                            │
│  - 엔티티 (Entity)                                    │
│  - 값 객체 (Value Object)                             │
│  - 비즈니스 규칙                                      │
└─────────────────────────────────────────────────────┘
```

**의존성 방향**: 코드 의존성은 반드시 **더 안정적이고, 더 추상적인** 방향을 가리켜야 한다
- Controller는 Service 인터페이스(추상)에 의존
- Service는 Repository 인터페이스(추상)에 의존
- 모든 계층은 Domain(비즈니스 핵심, 가장 안정적)에 의존
- **역방향 의존성은 허용되지 않음**(예: Repository가 Service에 의존)

<LayeredArchitectureDemo />

### 2.2 Controller 계층

**책임**: 요청의 "접수 담당자"

- HTTP 요청 수신, 파라미터 파싱
- 파라미터 유효성 검사(형식, 필수 등)
- DTO 변환(Request → Param)
- Service 호출하여 비즈니스 실행
- DTO 변환(Result → Response)
- HTTP 응답 반환

**하지 말아야 할 일**:
- 비즈니스 로직 직접 작성
- 데이터베이스 직접 조작
- 트랜잭션 처리

**설계 철학**:
Controller는 시스템의 "프런트 데스크"로서 어댑터 역할을 담당한다 — 외부 HTTP 프로토콜을 내부 비즈니스 호출로 변환한다. 비즈니스 결정은 도메인 지식의 표현이며 전송 프로토콜과 분리되어야 하므로, Controller는 어떤 비즈니스 결정도 포함해서는 안 된다.

**예제**:
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

        // 2. Service 호출
        User user = userService.createUser(param);

        // 3. Entity → Response DTO
        return UserResponse.from(user);
    }
}
```

**핵심 포인트**:
- `@Valid`로 파라미터 자동 검증
- DTO로 프론트엔드/백엔드 데이터 구조 분리
- "번역"과 "스케줄링"만 수행하고, 비즈니스 로직은 포함하지 않음

<ControllerLayerDemo />

### 2.3 Service 계층

**책임**: 비즈니스의 "요리사"

- 핵심 비즈니스 로직 구현
- 여러 Repository 작업 오케스트레이션
- 트랜잭션 경계 관리
- 크로스 모듈 조정 처리

**하지 말아야 할 일**:
- SQL 직접 작성(Repository에 위임)
- HTTP 관련 처리
- 데이터베이스 엔티티를 Controller에 반환

**설계 철학**:
Service 계층은 비즈니스 로직의 전달체로서 순수성을 유지해야 한다. 어떤 프레임워크나 전송 프로토콜에도 의존하지 않아야 한다:
- 웹 계층과 독립적으로 단위 테스트 가능
- 스케줄 작업, 메시지 큐 컨슈머에서 재사용 가능
- 기술 스택 변경이 비즈니스 로직에 영향을 미치지 않음

**예제**:
```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public User createUser(UserParam param) {
        // 1. 비즈니스 규칙: 사용자명 중복 확인
        if (userRepository.existsByUsername(param.getUsername())) {
            throw new UserAlreadyExistsException();
        }

        // 2. 사용자 엔티티 생성
        User user = new User();
        user.setUsername(param.getUsername());
        user.setPassword(param.getPassword());
        user.setEmail(param.getEmail());

        // 3. 데이터베이스에 저장
        userRepository.save(user);

        // 4. 환영 이메일 전송 (크로스 모듈 조정)
        emailService.sendWelcomeEmail(user);

        return user;
    }
}
```

**핵심 포인트**:
- @Transactional로 트랜잭션 일관성 보장
- 비즈니스 예외를 던져 Controller가 통합 처리
- HTTP 개념에 의존하지 않아 재사용 가능

<ServiceLayerDemo />

### 2.4 Repository 계층

**책임**: 데이터의 "창고 관리자"

- 모든 데이터 접근 로직 캡슐화
- CRUD 작업 실행
- ORM 매핑 처리
- 쿼리 조건 캡슐화

**하지 말아야 할 일**:
- 비즈니스 로직 작성
- 트랜잭션 처리(Service 계층에서 관리)
- 상위 계층 모듈에 의존

**설계 철학**:
Repository는 데이터 접근의 추상화 계층으로, 하부 데이터베이스의 세부 사항을 숨긴다. 이 추상화의 가치는:
- 데이터베이스 교체 시 Repository 구현만 수정하면 되고, 비즈니스 로직은 변경할 필요가 없다
- Mock을 통한 단위 테스트가 용이하다
- 쿼리 로직을 중앙에서 관리하여 중복 코드를 방지한다

**예제**:
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data JPA 자동 구현
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

    // 커스텀 복합 쿼리
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.deleted = false")
    Optional<User> findActiveByEmail(@Param("email") String email);
}
```

**핵심 포인트**:
- Repository는 인터페이스이며, 비즈니스 로직을 포함하지 않는다
- 메서드명으로 쿼리 의도를 표현한다
- @Query로 커스텀 복합 쿼리를 작성할 수 있다

<RepositoryLayerDemo />

### 2.5 Domain 계층

**책임**: 비즈니스의 "레시피 표준"

- 비즈니스 엔티티(Entity) 정의
- 값 객체(Value Object) 정의
- 비즈니스 규칙 캡슐화
- 모든 계층의 공통 의존성 역할

**중요한 특성**:
- Domain 계층은 다른 어떤 계층에도 의존하지 않는다
- 모든 계층이 Domain 계층에 의존한다
- 계층형 아키텍처의 기반이다

**설계 철학**:
Domain 계층은 전체 시스템의 비즈니스 핵심으로, 도메인 지식과 비즈니스 규칙을 표현한다. 그 순수성은 매우 중요하다:
- 프레임워크에 의존하지 않으므로 비즈니스 로직이 기술 스택에 종속되지 않는다
- 모든 계층이 이에 의존하므로 비즈니스 규칙의 통일성을 보장한다
- 장기적인 진화에 유리하며, 기술 스택은 교체할 수 있지만 비즈니스 규칙은 상대적으로 안정적이다

**예제**:
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

    // ✅ 비즈니스 메서드: 비즈니스 규칙 캡슐화
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

**핵심 포인트**:
- Entity는 고유 식별자를 가진다
- 비즈니스 규칙은 Domain 객체에 캡슐화된다
- Domain 계층은 순수한 비즈니스 로직이며, 프레임워크에 의존하지 않는다

<DomainModelDemo />

---

## 3. DTO: 계층 간의 "통역사"

### 3.1 DTO가 필요한 이유

**문제**: 데이터베이스 엔티티를 프론트엔드에 직접 반환하면:

```java
// ❌ 잘못된 방식: Entity 직접 반환
@Entity
public class User {
    private Long id;
    private String username;
    private String password;        // 민감한 정보!
    private Boolean isDeleted;      // 내부 필드!
}
```

프론트엔드가 노출되어서는 안 되는 필드를 받게 되어 보안 위험이 발생한다.

**해결책**: DTO를 "통역사"로 사용

```
데이터베이스 Entity → Service Param/Result → Controller Request/Response → 프론트엔드
```

### 3.2 DTO의 유형

| 유형 | 용도 | 예시 |
|------|------|------|
| Request DTO | Controller 파라미터 수신 | UserCreateRequest |
| Response DTO | Controller 데이터 반환 | UserResponse |
| Param DTO | Service 메서드 파라미터 | UserParam |
| Result DTO | Service 결과 반환 | UserResult |
| Entity | 데이터베이스 매핑 | User |

**핵심 원칙**:
각 계층은 자신의 DTO를 사용하고, Entity를 직접 전달하지 않으며, DTO는 필요한 필드만 포함한다. 이를 통해 내부 구현 세부 사항의 노출을 방지하고 각 계층의 독립성을 보장한다.

<DtoFlowDemo />

---

## 4. 의존성 방향: 계층형 아키텍처의 철칙

### 4.1 의존성 역전 원칙

**잘못된 방식**:
```
Controller → UserServiceImpl → UserDaoImpl → UserEntity
```

**올바른 방식**:
```
Controller → UserService(인터페이스) → UserRepository(인터페이스) → UserEntity
```

**의존성 방향**:

올바른 의존성 방향은 모든 계층이 더 추상적이고 더 안정적인 계층에 의존하는 것이다. 구체적으로, Controller는 Service 인터페이스에 의존하고, Service는 Repository 인터페이스에 의존하며, 모든 계층은 Domain 계층에 의존하고, Domain 계층은 다른 어떤 계층에도 의존하지 않는다. 이러한 의존성 방향은 비즈니스 로직의 독립성과 테스트 가능성을 보장한다.

잘못된 방식으로는 Service가 Repository 구현 클래스에 직접 의존하거나, Controller가 데이터베이스를 직접 조작하거나, Domain 계층이 다른 계층에 의존하는 경우가 있다. 이들은 모두 결합도를 높이고 시스템의 유지보수성을 저하시킨다.

### 4.2 코드 예제

```java
// ✅ 올바른 방식: 인터페이스에 의존
@Service
public class OrderService {
    private final OrderRepository orderRepository;  // 인터페이스
    private final PaymentService paymentService;    // 인터페이스
}

// ✅ 구현 클래스는 Spring을 통해 자동 주입
@Repository
public class OrderRepositoryImpl implements OrderRepository {
    // 구현 세부 사항
}
```

<DependencyDirectionDemo />

---

## 5. 실전 사례: 전자상거래 주문 시스템

### 5.1 요구사항

주문 생성:
1. 사용자가 상품 선택
2. 재고 확인
3. 금액 계산
4. 주문 생성
5. 재고 차감

### 5.2 코드 구현

**Domain 계층**:
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
            throw new IllegalStateException("결제 대기 중인 주문만 취소할 수 있습니다");
        }
        this.status = OrderStatus.CANCELLED;
    }
}
```

**Repository 계층**:
```java
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}
```

**Service 계층**:
```java
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final InventoryService inventoryService;

    @Transactional
    public OrderDTO createOrder(OrderParam param) {
        // 1. 상품 검증 및 재고 차감
        for (OrderItemParam item : param.getItems()) {
            inventoryService.reserveStock(item.getProductId(), item.getQuantity());
        }

        // 2. 주문 생성
        Order order = new Order();
        order.setUserId(param.getUserId());
        order.calculateTotal();

        // 3. 주문 저장
        orderRepository.save(order);

        return OrderDTO.from(order);
    }
}
```

**Controller 계층**:
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

## 6. 자주 묻는 질문

### 6.1 Controller에서 비즈니스 로직을 작성해도 되나요

Controller는 비즈니스 로직을 작성해서는 안 되며, 요청 수신과 응답 반환만 담당한다. 비즈니스 로직은 Service 계층에 캡슐화해야 한다. 이렇게 하면 코드를 재사용할 수 있다는 장점이 있다. 예를 들어 스케줄 작업이나 메시지 큐 컨슈머가 HTTP 요청을 거치지 않고 Service를 직접 호출할 수 있다. 또한 비즈니스 로직이 한곳에 집중되어 있어 테스트와 유지보수가 더 쉬우며, 로직이 분산되어 발생하는 불일치 문제를 방지할 수 있다.

### 6.2 빈약한 도메인 모델과 풍부한 도메인 모델이 개요
빈약한 도메인 모델(Anemic Domain Model)은 엔티티 클래스가 속성과 해당 getter/setter 메서드만 포함하고, 비즈니스 로직은 포함하지 않으며, 모든 비즈니스 규칙을 Service 계층에서 구현하는 방식이다. 이 모델은 구조가 단순하고 이해하기 쉬워 대부분의 프로젝트에서 채택하는 방식이다.

풍부한 도메인 모델(Rich Domain Model)은 엔티티 클래스가 속성뿐만 아니라 해당 엔티티와 관련된 비즈니스 메서드도 포함하여, 비즈니스 규칙을 엔티티 내부에 캡슐화하는 방식이다. 이 방식은 객체 지향 설계 사상에 더 부합하며, 데이터와 동작이 함께 있어 코드의 응집도를 높인다.

팀의 기술 배경과 프로젝트 복잡도에 따라 적절한 모델을 선택하는 것이 좋다. 어떤 모델을 선택하든 일관성을 유지해야 하며, Domain 계층은 최소한 기본적인 비즈니스 동작 메서드를 포함해야 한다. 완전한 빈 껍데기가 되어서는 안 된다.

### 6.3 여러 Service에 걸친 트랜잭션은 처리 접근법
비즈니스 작업이 여러 Service에 걸쳐야 하는 경우, 상위 Service에서 트랜잭션 어노테이션을 사용하고, 이 메서드 내에서 여러 하위 Service를 순차적으로 호출해야 한다. 이렇게 하면 모든 작업이 동일한 트랜잭션 컨텍스트에서 실행되어, 모두 성공하거나 모두 실패하는 것을 보장하여 데이터 일관성을 유지할 수 있다. 트랜잭션 경계는 가능한 한 작게 유지하고, 필요한 작업만 포함해야 하며, 데이터베이스 락을 오래 점유하여 동시성 성능에 영향을 주지 않도록 주의해야 한다.

---

## 7. 요약

| 계층 | 책임 | 키워드 |
|------|------|--------|
| Controller | 요청 수신, 파라미터 유효성 검사, Service 호출, 응답 반환 | 접수 담당자 |
| Service | 비즈니스 로직 오케스트레이션, 트랜잭션 관리, Repository 조정 | 요리사 |
| Repository | 데이터 접근, ORM 매핑, 쿼리 캡슐화 | 창고 관리자 |
| Domain | 엔티티 정의, 비즈니스 규칙, 값 객체 | 레시피 표준 |

**핵심 원칙**:
1. 각 계층은 자신의 일만 한다
2. 계층 간에는 인터페이스를 통해 통신한다
3. 비즈니스 로직은 Service와 Domain에 집중된다
4. 데이터 접근 로직은 Repository에 집중된다
5. DTO로 각 계층의 데이터 구조를 분리한다
---

## 8. 더 많은 아키텍처 패턴

본 문서에서 소개한 것은 **계층형 아키텍처**(Layered Architecture)로, 가장 일반적이고 접근하기 쉬운 백엔드 아키텍처 패턴이다. 하지만 백엔드 아키텍처는 이 외에도 많으며, 비즈니스 시나리오에 따라 알아둘 가치가 있는 다른 아키텍처 패턴들이 있다:

### 8.1 기타 일반적인 아키텍처 패턴

| 아키텍처 패턴 | 적용 시나리오 | 특징 |
|----------|----------|------|
| **모놀리식 아키텍처** | 소규모 프로젝트, MVP | 모든 기능이 하나의 애플리케이션에 포함, 배포 간단 |
| **마이크로서비스 아키텍처** | 대규모 복잡한 시스템 | 여러 독립 서비스로 분할, 각 서비스 독립 배포 가능 |
| **이벤트 주도 아키텍처** | 높은 동시성, 비동기 처리 | 이벤트를 통해 처리 흐름 트리거, 높은 결합 분리도 |
| **클린 아키텍처** | 복잡한 비즈니스 시스템 | 비즈니스 로직이 중심, 의존성은 안쪽으로만, 프레임워크는 최외곽 |
| **헥사고날 아키텍처** | 다양한 외부 어댑터 필요 | 포트와 어댑터를 통해 핵심과 외부 시스템 분리 |
| **어니언 아키텍처** | 도메인 주도 설계 | 동심원 계층, 도메인 모델이 가장 안쪽, 인프라가 가장 바깥쪽 |

아래에서 하나씩 살펴본다:

#### 모놀리식 아키텍처 (Monolithic)

모든 기능이 하나의 애플리케이션에 패키징되며, 동일한 데이터베이스와 프로세스를 공유한다.

```
┌──────────────────────────────┐
│         모놀리식 앱           │
│  ┌────┐ ┌────┐ ┌────┐       │
│  │사용자│ │주문│ │결제│ ...   │
│  └──┬─┘ └──┬─┘ └──┬─┘       │
│     └──────┼──────┘          │
│         공유 데이터베이스      │
└──────────────────────────────┘
```

- **장점**: 개발 간단, 배포 편리, 로컬 디버깅 용이
- **단점**: 코드 결합도 높음, 확장 어려움, 한 모듈 문제가 전체 시스템에 영향
- **적용**: 초기 스타트업 프로젝트, 단일 팀 개발, 빠른 프로토타입 검증

#### 마이크로서비스 아키텍처 (Microservices)

시스템을 여러 독립 서비스로 분할하며, 각 서비스는 자체 데이터와 비즈니스 로직을 보유하고 독립적으로 배포 및 확장 가능하다.

```
┌────────┐  ┌────────┐  ┌────────┐
│사용자 서비스│ │주문 서비스│ │결제 서비스│
│  DB-1  │  │  DB-2  │  │  DB-3  │
└───┬────┘  └───┬────┘  └───┬────┘
    └───────────┼───────────┘
          API Gateway
```

- **장점**: 독립 배포 및 확장, 기술 스택 유연, 장애 격리
- **단점**: 서비스 간 통신 복잡, 분산 데이터 일관성 어려움, 성숙한 DevOps 역량 필요
- **적용**: 대규모 복잡 시스템, 다중 팀 협업, 독립 확장이 필요한 시나리오

#### 이벤트 주도 아키텍처 (Event-Driven)

비동기 이벤트를 통해 통신하며, 생산자가 이벤트를 발행하고 소비자가 이벤트에 응답하며, 컴포넌트 간에 높은 결합 분리도를 가진다.

```
생산자 ──→ [이벤트 버스/메시지 큐] ──→ 소비자A
                                  ──→ 소비자B
                                  ──→ 소비자C
```

- **장점**: 높은 결합 분리도, 자연스러운 확장 지원, 실시간 처리에 적합
- **단점**: 디버깅 어려움, 이벤트 순서와 멱등성에 대한 추가 처리 필요
- **적용**: 실시간 데이터 분석, IoT 시스템, 마이크로서비스 간 비동기 통신

#### 클린 아키텍처 (Clean Architecture)

Robert C. Martin이 제안, 시스템을 네 개의 동심원 계층으로 나누며, 의존성은 바깥쪽에서 안쪽으로만 향할 수 있다:

```
┌─────────────────────────────────────┐
│  Frameworks & Drivers (프레임워크와 드라이버) │
│  ┌─────────────────────────────┐    │
│  │  Interface Adapters (어댑터) │    │
│  │  ┌─────────────────────┐    │    │
│  │  │  Use Cases (유스케이스)│    │    │
│  │  │  ┌─────────────┐    │    │    │
│  │  │  │  Entities    │    │    │    │
│  │  │  │  (엔티티/도메인)│    │    │    │
│  │  │  └─────────────┘    │    │    │
│  │  └─────────────────────┘    │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
         의존성 방향: 외부 → 내부
```

- **핵심 규칙**: 내부 계층은 외부 계층의 존재를 알지 못하며, 비즈니스 로직은 프레임워크와 데이터베이스로부터 완전히 독립적
- **장점**: 높은 테스트 가능성, 기술 스택 교체 가능, 비즈니스 로직 명확
- **단점**: 초기 개발 비용 높음, 계층 간 매핑 코드 많음, 작은 프로젝트에서는 과도한 설계 우려
- **적용**: 복잡한 비즈니스 시스템, 장기 유지보수가 필요한 프로젝트

<CleanArchitectureDemo />

#### 헥사고날 아키텍처 (Hexagonal / Ports & Adapters)

"포트"를 통해 핵심 비즈니스의 입출력 인터페이스를 정의하고, "어댑터"를 통해 외부 시스템과 연결한다:

```
        ┌─────────────┐
  HTTP ──→ Port      │
  CLI  ──→ (입력 포트) │  핵심 비즈니스 로직  │  (출력 포트) ──→ 데이터베이스
  MQ   ──→           │                      │  Port    ──→ 외부 API
        └─────────────┘
```

- **핵심 사상**: 비즈니스 로직은 어떤 외부 기술에도 의존하지 않으며, 외부 시스템은 어댑터를 통해 연결된다
- **장점**: 외부 시스템을 자유롭게 교체 가능, 테스트 시 Mock 어댑터만 사용하면 됨
- **적용**: 다양한 외부 시스템과 연동이 필요한 시나리오

#### 어니언 아키텍처 (Onion Architecture)

클린 아키텍처와 유사하며, 도메인 모델이 가장 안쪽에, 인프라가 가장 바깥쪽에 위치하며, 의존성은 안쪽으로만 향한다:

```
┌──────────────────────────────┐
│  Infrastructure (인프라)      │
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

- **핵심 사상**: 도메인 모델이 시스템의 핵심이며, 모든 의존성은 이를 향한다
- **클린 아키텍처와의 차이점**: 어니언 아키텍처는 도메인 서비스 계층을 더 강조하고, 클린 아키텍처는 유스케이스 계층을 더 강조한다
- **적용**: 도메인 주도 설계(DDD)를 채택한 프로젝트

### 8.2 아키텍처 진화 경로

이 아키텍처들은 서로를 대체하는 관계가 아니라, 점진적으로 진화하는 관계다:

```text
전통적인 계층형 아키텍처 (N-Layered)
  │  문제: 계층 간 결합, 외부 의존성 교체 어려움
  ▼
헥사고날 아키텍처 (Ports & Adapters)
  │  개선: 포트와 어댑터로 외부 시스템 분리
  ▼
어니언 아키텍처 (Onion)
  │  개선: 동심원 계층 명확화, 도메인 모델 중심
  ▼
클린 아키텍처 (Clean Architecture)
  │  개선: 의존성 규칙 통일, 네 계층 책임 명확화
  ▼
비즈니스 필요에 따라 적절한 아키텍처 선택
```

### 8.3 아키텍처 패턴 선택 가이드

```text
사용자 수 < 1k, 코드량 < 5000줄
    ↓
모놀리식 아키텍처 + 단순 계층화
    ↓
사용자 수 1k-100k, 다중 팀 협업 필요
    ↓
계층형 아키텍처 (본 문서에서 소개)
    ↓
사용자 수 > 100k, 비즈니스 복잡도 높음
    ↓
마이크로서비스 아키텍처 / 이벤트 주도 아키텍처
```

더 세분화된 선택 기준:

| 고려 요소 | 단순 계층화 | 클린/헥사고날 아키텍처 | 마이크로서비스 |
|----------|---------|----------------|--------|
| 팀 규모 | 1-5명 | 5-20명 | 20명 이상 |
| 비즈니스 복잡도 | 낮음 | 중간~높음 | 높음 |
| 배포 빈도 | 낮음 | 중간 | 높음(독립 배포) |
| 기술 스택 다양성 | 단일 | 단일 | 다양 가능 |
| 운영 비용 | 낮음 | 중간 | 높음 |

### 8.4 추천 자료

- **모놀리식 아키텍처**: 본 문서의 자매편 [`backend-project-architecture.md`](./backend-project-architecture.md)을 참조하여, 스크립트에서 모놀리스로의 진화를 이해하세요
- **마이크로서비스 아키텍처**: [모놀리스에서 마이크로서비스로의 진화](/zh-cn/appendix/6-architecture-and-system-design/monolith-to-microservices) 참조
- **클린 아키텍처**: Robert C. Martin의 《Clean Architecture》— 의존성 규칙과 네 개의 동심원 모델을 제안한 고전
- **엔터프라이즈 아키텍처 패턴**: Martin Fowler의 《Patterns of Enterprise Application Architecture》— 계층형 아키텍처, 도메인 로직 구성의 권위 있는 참고서

### 8.5 선택 접근법

**이 원칙을 기억하세요**: **아키텍처는 비즈니스를 위해 존재하며, 아키텍처를 위한 아키텍처가 되어서는 안 된다**.

- 작은 프로젝트는 단순한 아키텍처로 빠르게 출시하여 검증한다
- 큰 프로젝트는 복잡한 아키텍처를 고려하되, 과도한 설계를 피한다
- 팀의 숙련도도 중요하므로, 모두가 이해할 수 있는 방안을 선택한다

---

## 9. 요약

| 계층 | 책임 | 키워드 |
|------|------|--------|
| Controller | 요청 수신, 파라미터 유효성 검사, Service 호출, 응답 반환 | 접수 담당자 |
| Service | 비즈니스 로직 오케스트레이션, 트랜잭션 관리, Repository 조정 | 요리사 |
| Repository | 데이터 접근, ORM 매핑, 쿼리 캡슐화 | 창고 관리자 |
| Domain | 엔티티 정의, 비즈니스 규칙, 값 객체 | 레시피 표준 |

**핵심 원칙**:

계층형 아키텍처의 핵심은 명확한 책임 분리와 의존성 방향 제어에 있다. 각 계층은 자신의 책임에만 집중하고, 인터페이스를 통해 인접 계층과 통신하며, 비즈니스 로직은 Service와 Domain 계층에 집중되고, 데이터 접근 로직은 Repository 계층에 집중되며, 각 계층 간에는 DTO를 통해 데이터 구조를 분리하여 내부 구현을 직접 노출하지 않는다. 이러한 설계는 시스템을 더 이해하기 쉽고, 테스트하기 쉽고, 유지보수하기 쉽게 만들어, 비즈니스의 지속적인 진화에 대응할 수 있게 한다.

---

## 참고 자료

1. [Catalog of Patterns of Enterprise Application Architecture - Martin Fowler](https://www.martinfowler.com/eaaCatalog/) — Martin Fowler의 엔터프라이즈 애플리케이션 아키텍처 패턴 카탈로그, 계층형 아키텍처의 고전적 참고 자료
2. [Backend Side Architecture Evolution (N-layered, DDD, Hexagon, Onion, Clean Architecture)](https://medium.com/@iamprovidence/backend-side-architecture-evolution-n-layered-ddd-hexagon-onion-clean-architecture-643d72444ce4) — N계층 아키텍처에서 클린 아키텍처까지의 진화 과정, 각 아키텍처가 탄생한 이유 이해
3. [Complete Guide to Clean Architecture - GeeksforGeeks](https://www.geeksforgeeks.org/complete-guide-to-clean-architecture/) — 클린 아키텍처 완전 가이드, 계층화, 의존성 규칙 및 관심사 분리 상세 해설
4. [Understanding Hexagonal, Clean, Onion, and Traditional Layered Architectures: A Deep Dive](https://romanglushach.medium.com/understanding-hexagonal-clean-onion-and-traditional-layered-architectures-a-deep-dive-c0f93b8a1b96) — 헥사고날, 클린, 어니언, 전통적 계층형 아키텍처의 심층 비교
5. [Building Clean Architectures in Modern Backend Frameworks](https://leapcell.io/blog/building-clean-architectures-in-modern-backend-frameworks) — 현대 백엔드 프레임워크에서 클린 아키텍처를 실천하는 실전 가이드
6. [Backend Architecture Patterns: From Monoliths to Microservices](https://nerdleveltech.com/backend-architecture-patterns-from-monoliths-to-microservices) — 모놀리스에서 마이크로서비스까지 백엔드 아키텍처 패턴의 전체 개요
7. [MVC 3계층 아키텍처 사례 상세 해설](https://www.cnblogs.com/TheMagicalRainbowSea/p/17409206.html) — MVC와 3계층 아키텍처의 관계 및 실전 사례, 중국어 독자 입문에 적합