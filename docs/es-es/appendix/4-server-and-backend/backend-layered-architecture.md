# Principios de la arquitectura en capas del backend

> **Pregunta central**: El código se vuelve cada vez más desordenado, ¿cómo organizarlo para que sea claro y comprensible?

Cuando un proyecto pasa de docenas de líneas de código a decenas de miles, de un solo desarrollador a colaboración en equipo, de un simple CRUD a lógica de negocio compleja, la forma de organizar el código determina directamente la viabilidad del proyecto. La arquitectura en capas no es para presumir ni seguir dogmas, sino para resolver un conflicto fundamental en la ingeniería de software: **el crecimiento natural de la complejidad del negocio** frente a **la capacidad cognitiva limitada del ser humano**.

---

## 1. Motivación de capas

### 1.1 La raíz del problema

**Versión inicial** (100 líneas de código):
```java
@PostMapping("/register")
public Result register(@RequestBody User user) {
    // 1. Verificar si el nombre de usuario está duplicado
    if (userRepository.findByUsername(user.getUsername()) != null) {
        return Result.error("El nombre de usuario ya existe");
    }
    // 2. Encriptar contraseña
    user.setPassword(encrypt(user.getPassword()));
    // 3. Guardar usuario
    userRepository.save(user);
    // 4. Enviar correo de bienvenida
    emailService.sendWelcome(user.getEmail());
    // 5. Registrar log
    log.info("Usuario registrado: {}", user.getUsername());
    return Result.success();
}
```

**6 meses después** (500 líneas de código):
- Se añadió validación de número de teléfono
- Se añadió verificación de identidad real
- Se añadieron recompensas por invitación
- Se añadió control de riesgos
- ...

Ahora este método tiene 500 líneas, y cada modificación da miedo, porque:
- La lógica está mezclada, cambiar una parte puede afectar otras funcionalidades
- Es difícil de probar, cada prueba requiere simular una solicitud HTTP completa
- Los nuevos no entienden nada, porque toda la lógica está amontonada

**La esencia del problema**: el código no tiene "fronteras", todas las responsabilidades están mezcladas.

**El efecto acumulativo de la deuda técnica**:
- ❌ **Alto acoplamiento**: la lógica de negocio está acoplada al acceso a datos y al protocolo HTTP, un cambio arrastra todo lo demás
- ❌ **Baja cohesión**: un solo método asume múltiples responsabilidades, violando el principio de responsabilidad única
- ❌ **Difícil de probar**: no se puede probar la lógica de negocio de forma aislada, hay que levantar un contenedor HTTP completo
- ❌ **Difícil de reutilizar**: la lógica de negocio está atada a las peticiones HTTP, no se puede reutilizar en tareas programadas o colas de mensajes
- ❌ **Carga cognitiva**: el desarrollador necesita entender simultáneamente los detalles de todas las capas, sin poder enfocarse

### 1.2 La idea central de las capas

La arquitectura en capas consiste en trazar fronteras claras en el código:

```
┌─────────────────────────────────────┐
│  Recibir peticiones ← Controller    │  Solo "tomar el pedido"
├─────────────────────────────────────┤
│  Orquestación de negocio ← Service  │  Solo "cocinar"
├─────────────────────────────────────┤
│  Acceso a datos ← Repository        │  Solo "conseguir ingredientes"
├─────────────────────────────────────┤
│  Definición de negocio ← Domain     │  Solo "estándar de recetas"
└─────────────────────────────────────┘
```

**Principios clave**:
- Cada capa solo hace lo suyo
- Las capas se comunican mediante interfaces bien definidas
- La lógica de negocio se concentra en Service y Domain
- La lógica de acceso a datos se concentra en Repository

**Valor de ingeniería de la arquitectura en capas**:

1. **Reduce la carga cognitiva**: el desarrollador puede enfocarse en la responsabilidad de la capa actual, sin necesidad de entender todos los detalles globales
2. **Mejora la testeabilidad**: cada capa se puede probar unitariamente de forma independiente, solo hace falta mockear las dependencias
3. **Aumenta la mantenibilidad**: cuando cambian los requisitos, el alcance de la modificación está claro, reduciendo el riesgo
4. **Fomenta la reutilización de código**: la lógica de negocio no depende de HTTP, se puede reutilizar en tareas programadas y colas de mensajes
5. **Facilita la colaboración en equipo**: diferentes desarrolladores pueden trabajar en paralelo en distintas capas, reduciendo conflictos
6. **Prolonga la vida del código**: las fronteras claras facilitan la refactorización y evolución del código

---

## 2. Las cuatro capas en detalle

### 2.1 Estructura general

La esencia de la arquitectura en capas es la **separación de responsabilidades** (Separation of Concerns) y el **control de la dirección de dependencias**:

```
┌─────────────────────────────────────────────────────┐
│  Petición del frontend                               │
└────────────────────┬────────────────────────────────┘
                     │ HTTP Request
                     ▼
┌─────────────────────────────────────────────────────┐
│  Controller (capa de controlador)                    │
│  - Recibir peticiones, validar parámetros            │
│  - Conversión de DTO                                │
│  - Llamar a Service                                  │
│  - Devolver respuesta                                │
└────────────────────┬────────────────────────────────┘
                     │ Llamada de negocio
                     ▼
┌─────────────────────────────────────────────────────┐
│  Service (capa de lógica de negocio)                 │
│  - Orquestación de lógica de negocio                 │
│  - Gestión de transacciones                          │
│  - Coordinar múltiples Repository                    │
│  - Coordinación entre módulos                        │
└────────────────────┬────────────────────────────────┘
                     │ Acceso a datos
                     ▼
┌─────────────────────────────────────────────────────┐
│  Repository (capa de acceso a datos)                 │
│  - CRUD de base de datos                             │
│  - Encapsulación de consultas                        │
│  - Mapeo ORM                                         │
└────────────────────┬────────────────────────────────┘
                     │ Objetos de dominio
                     ▼
┌─────────────────────────────────────────────────────┐
│  Domain (capa de modelo de dominio)                  │
│  - Entidades (Entity)                                │
│  - Objetos de valor (Value Object)                   │
│  - Reglas de negocio                                 │
└─────────────────────────────────────────────────────┘
```

**Dirección de dependencias**: las dependencias del código deben apuntar hacia lo **más estable y más abstracto**
- Controller depende de la interfaz de Service (abstracción)
- Service depende de la interfaz de Repository (abstracción)
- Todas las capas dependen de Domain (núcleo del negocio, lo más estable)
- **No se permiten dependencias inversas** (por ejemplo, Repository dependiendo de Service)

<LayeredArchitectureDemo />

### 2.2 Capa Controller

**Responsabilidad**: el "recepcionista" de las peticiones

- Recibir peticiones HTTP, parsear parámetros
- Validar parámetros (formato, obligatoriedad, etc.)
- Conversión de DTO (Request → Param)
- Llamar a Service para ejecutar la lógica de negocio
- Conversión de DTO (Result → Response)
- Devolver respuesta HTTP

**Lo que no debe hacer**:
- Escribir lógica de negocio directamente
- Operar directamente sobre la base de datos
- Gestionar transacciones

**Filosofía de diseño**:
El Controller es la "fachada" del sistema, asumiendo el rol de adaptador: adapta el protocolo HTTP externo a llamadas internas de negocio. No debe contener ninguna decisión de negocio, porque las decisiones de negocio son manifestaciones del conocimiento del dominio y deben estar desacopladas del protocolo de transporte.

**Ejemplo**:
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

        // 2. Llamar a Service
        User user = userService.createUser(param);

        // 3. Entity → Response DTO
        return UserResponse.from(user);
    }
}
```

**Puntos clave**:
- Usar `@Valid` para validar parámetros automáticamente
- Usar DTO para aislar las estructuras de datos entre frontend y backend
- Solo hacer "traducción" y "despacho", sin contener lógica de negocio

<ControllerLayerDemo />

### 2.3 Capa Service

**Responsabilidad**: el "cocinero" del negocio

- Implementar la lógica de negocio central
- Orquestar operaciones de múltiples Repository
- Gestionar los límites de las transacciones
- Manejar la coordinación entre módulos

**Lo que no debe hacer**:
- Escribir SQL directamente (eso es para Repository)
- Manejar asuntos relacionados con HTTP
- Devolver entidades de base de datos al Controller

**Filosofía de diseño**:
La capa Service es el portador de la lógica de negocio y debe mantenerse pura. No depende de ningún framework ni protocolo de transporte, lo que permite:
- Realizar pruebas unitarias independientes de la capa web
- Reutilizarse en tareas programadas y consumidores de colas de mensajes
- Evitar que los cambios de stack tecnológico afecten la lógica de negocio

**Ejemplo**:
```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public User createUser(UserParam param) {
        // 1. Regla de negocio: verificar si el nombre de usuario está duplicado
        if (userRepository.existsByUsername(param.getUsername())) {
            throw new UserAlreadyExistsException();
        }

        // 2. Crear entidad de usuario
        User user = new User();
        user.setUsername(param.getUsername());
        user.setPassword(param.getPassword());
        user.setEmail(param.getEmail());

        // 3. Guardar en base de datos
        userRepository.save(user);

        // 4. Enviar correo de bienvenida (coordinación entre módulos)
        emailService.sendWelcomeEmail(user);

        return user;
    }
}
```

**Puntos clave**:
- Usar @Transactional para garantizar la consistencia de la transacción
- Lanzar excepciones de negocio para que el Controller las maneje de forma unificada
- No depender de conceptos HTTP, se puede reutilizar

<ServiceLayerDemo />

### 2.4 Capa Repository

**Responsabilidad**: el "almacenista" de los datos

- Encapsular toda la lógica de acceso a datos
- Ejecutar operaciones CRUD
- Manejar el mapeo ORM
- Encapsular condiciones de consulta

**Lo que no debe hacer**:
- Escribir lógica de negocio
- Gestionar transacciones (lo maneja la capa Service)
- Depender de módulos superiores

**Filosofía de diseño**:
Repository es la capa de abstracción de acceso a datos, que oculta los detalles de la base de datos subyacente. El valor de esta abstracción radica en:
- Al cambiar de base de datos solo se modifica la implementación del Repository, sin tocar la lógica de negocio
- Facilita el mockeo para pruebas unitarias
- La lógica de consulta se gestiona de forma centralizada, evitando código duplicado

**Ejemplo**:
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data JPA implementa automáticamente
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

    // Consulta compleja personalizada
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.deleted = false")
    Optional<User> findActiveByEmail(@Param("email") String email);
}
```

**Puntos clave**:
- Repository es una interfaz, no contiene lógica de negocio
- Usar nombres de método para expresar la intención de la consulta
- Se puede usar @Query para consultas complejas personalizadas

<RepositoryLayerDemo />

### 2.5 Capa Domain

**Responsabilidad**: el "estándar de recetas" del negocio

- Definir entidades de negocio (Entity)
- Definir objetos de valor (Value Object)
- Encapsular reglas de negocio
- Servir como dependencia común de todas las capas

**Características importantes**:
- La capa Domain no depende de ninguna otra capa
- Todas las capas dependen de la capa Domain
- Es la base de la arquitectura en capas

**Filosofía de diseño**:
La capa Domain es el núcleo de negocio de todo el sistema, expresa el conocimiento del dominio y las reglas de negocio. Su pureza es crucial:
- No depender de frameworks significa que la lógica de negocio no está secuestrada por el stack tecnológico
- Todas las capas dependen de ella, garantizando la uniformidad de las reglas de negocio
- Facilita la evolución a largo plazo: el stack tecnológico puede reemplazarse, las reglas de negocio son relativamente estables

**Ejemplo**:
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

    // ✅ Método de negocio: encapsula reglas de negocio
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

**Puntos clave**:
- Entity tiene un identificador único
- Las reglas de negocio se encapsulan en los objetos Domain
- La capa Domain es lógica de negocio pura, no depende del framework

<DomainModelDemo />

---

## 3. DTO: el "traductor" entre capas

### 3.1 Motivación de DTO

**Problema**: si devolvemos directamente la entidad de base de datos al frontend:

```java
// ❌ Incorrecto: devolver Entity directamente
@Entity
public class User {
    private Long id;
    private String username;
    private String password;        // ¡Información sensible!
    private Boolean isDeleted;      // ¡Campo interno!
}
```

El frontend recibiría campos que no deberían exponerse, con riesgos de seguridad.

**Solución**: usar DTO como "traductor"

```
Entity de BD → Service Param/Result → Controller Request/Response → Frontend
```

### 3.2 Tipos de DTO

| Tipo | Uso | Ejemplo |
|------|------|------|
| Request DTO | Controller recibe parámetros | UserCreateRequest |
| Response DTO | Controller devuelve datos | UserResponse |
| Param DTO | Parámetros del método Service | UserParam |
| Result DTO | Service devuelve resultados | UserResult |
| Entity | Mapeo de base de datos | User |

**Principio clave**:
Cada capa usa su propio DTO, no se debe pasar Entity directamente. Los DTO solo contienen los campos necesarios, lo que evita exponer detalles de implementación interna y garantiza la independencia de cada capa.

<DtoFlowDemo />

---

## 4. Dirección de dependencias: la regla de oro de la arquitectura en capas

### 4.1 Principio de inversión de dependencias

**Enfoque incorrecto**:
```
Controller → UserServiceImpl → UserDaoImpl → UserEntity
```

**Enfoque correcto**:
```
Controller → UserService(interfaz) → UserRepository(interfaz) → UserEntity
```

**Dirección de dependencias**:

La dirección correcta de dependencias es que todas las capas dependan de capas más abstractas y estables. Concretamente, Controller depende de la interfaz de Service, Service depende de la interfaz de Repository, todas las capas dependen de la capa Domain, y la capa Domain no depende de ninguna otra capa. Esta dirección de dependencias garantiza la independencia y la testeabilidad de la lógica de negocio.

Los enfoques incorrectos incluyen que Service dependa directamente de la implementación concreta de Repository, que Controller opere directamente sobre la base de datos, o que la capa Domain dependa de otras capas. Todo esto aumenta el acoplamiento y reduce la mantenibilidad del sistema.

### 4.2 Ejemplo de código

```java
// ✅ Correcto: depender de interfaces
@Service
public class OrderService {
    private final OrderRepository orderRepository;  // interfaz
    private final PaymentService paymentService;    // interfaz
}

// ✅ La implementación se inyecta automáticamente con Spring
@Repository
public class OrderRepositoryImpl implements OrderRepository {
    // Detalles de implementación
}
```

<DependencyDirectionDemo />

---

## 5. Caso práctico: sistema de pedidos de e-commerce

### 5.1 Requisitos

Crear un pedido:
1. El usuario selecciona productos
2. Verificar inventario
3. Calcular importe
4. Crear pedido
5. Descontar inventario

### 5.2 Implementación del código

**Capa Domain**:
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
            throw new IllegalStateException("Solo los pedidos pendientes de pago pueden cancelarse");
        }
        this.status = OrderStatus.CANCELLED;
    }
}
```

**Capa Repository**:
```java
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}
```

**Capa Service**:
```java
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final InventoryService inventoryService;

    @Transactional
    public OrderDTO createOrder(OrderParam param) {
        // 1. Validar productos y descontar inventario
        for (OrderItemParam item : param.getItems()) {
            inventoryService.reserveStock(item.getProductId(), item.getQuantity());
        }

        // 2. Crear pedido
        Order order = new Order();
        order.setUserId(param.getUserId());
        order.calculateTotal();

        // 3. Guardar pedido
        orderRepository.save(order);

        return OrderDTO.from(order);
    }
}
```

**Capa Controller**:
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

## 6. Preguntas frecuentes

### 6.1 Puede el Controller contener lógica de negocio

El Controller no debe contener lógica de negocio, solo debe encargarse de recibir peticiones y devolver respuestas. La lógica de negocio debe estar encapsulada en la capa Service, lo que permite que el código sea reutilizable: por ejemplo, las tareas programadas o los consumidores de colas de mensajes pueden llamar directamente al Service sin necesidad de pasar por HTTP. Además, tener la lógica de negocio concentrada en un solo lugar facilita las pruebas y el mantenimiento, evitando inconsistencias por lógica dispersa.

### 6.2 Introducción a modelo anémico y el modelo rico

El modelo anémico (Anemic Domain Model) es aquel donde las clases de entidad solo contienen atributos y sus correspondientes getters/setters, sin ninguna lógica de negocio; todas las reglas de negocio se implementan en la capa Service. Este modelo tiene una estructura simple, es fácil de entender y es el enfoque adoptado por la mayoría de los proyectos.

El modelo rico (Rich Domain Model) es aquel donde las clases de entidad no solo contienen atributos, sino también métodos de negocio relacionados con la entidad, encapsulando las reglas de negocio dentro de la propia entidad. Este enfoque se ajusta más al diseño orientado a objetos, manteniendo datos y comportamiento juntos y aumentando la cohesión del código.

Se recomienda elegir el modelo adecuado según el nivel técnico del equipo y la complejidad del proyecto, pero independientemente de la elección, se debe mantener la consistencia. La capa Domain debería al menos contener métodos básicos de comportamiento de negocio, en lugar de ser un cascarón completamente vacío.

### 6.3 Enfoque de manejar transacciones que abarcan múltiples Service

Cuando una operación de negocio necesita abarcar múltiples Service, se debe usar la anotación de transacción en el Service de nivel superior, y dentro de ese método llamar secuencialmente a los Service de nivel inferior. Esto garantiza que todas las operaciones se ejecuten en el mismo contexto transaccional: o todas tienen éxito o todas fallan, asegurando la consistencia de los datos. Hay que tener en cuenta que los límites de la transacción deben ser lo más pequeños posible, incluyendo solo las operaciones necesarias, para evitar mantener bloqueos de base de datos durante mucho tiempo y afectar el rendimiento de concurrencia.

---

## 7. Resumen

| Capa | Responsabilidad | Palabra clave |
|------|------|--------|
| Controller | Recibir peticiones, validar parámetros, llamar a Service, devolver respuesta | Recepcionista |
| Service | Orquestación de lógica de negocio, gestión de transacciones, coordinar Repository | Cocinero |
| Repository | Acceso a datos, mapeo ORM, encapsulación de consultas | Almacenista |
| Domain | Definición de entidades, reglas de negocio, objetos de valor | Estándar de recetas |

**Principios fundamentales**:
1. Cada capa solo hace lo suyo
2. Las capas se comunican mediante interfaces
3. La lógica de negocio se concentra en Service y Domain
4. La lógica de acceso a datos se concentra en Repository
5. Usar DTO para aislar las estructuras de datos entre capas
---

## 8. Más patrones arquitectónicos

Este artículo presenta la **arquitectura en capas** (Layered Architecture), el patrón de arquitectura backend más común y fácil de adoptar. Pero la arquitectura backend no se limita a este patrón; según el escenario de negocio, existen otros patrones que vale la pena conocer:

### 8.1 Otros patrones arquitectónicos comunes

| Patrón arquitectónico | Escenario aplicable | Características |
|----------|----------|------|
| **Arquitectura monolítica** | Proyectos pequeños, MVP | Todas las funcionalidades en una sola aplicación, despliegue simple |
| **Arquitectura de microservicios** | Sistemas grandes y complejos | Dividido en múltiples servicios independientes, cada uno desplegable por separado |
| **Arquitectura dirigida por eventos** | Alta concurrencia, procesamiento asíncrono | El flujo de procesamiento se activa por eventos, alto desacoplamiento |
| **Arquitectura limpia** | Sistemas de negocio complejos | La lógica de negocio en el centro, las dependencias solo hacia adentro, el framework en la capa más externa |
| **Arquitectura hexagonal** | Necesidad de múltiples adaptadores externos | Aísla el núcleo de los sistemas externos mediante puertos y adaptadores |
| **Arquitectura de cebolla** | Diseño guiado por el dominio | Capas concéntricas, el modelo de dominio en el centro, la infraestructura en el exterior |

A continuación se detalla cada uno:

#### Arquitectura monolítica (Monolithic)

Todas las funcionalidades se empaquetan en una sola aplicación, compartiendo la misma base de datos y proceso.

```
┌──────────────────────────────┐
│         Aplicación monolítica │
│  ┌────┐ ┌────┐ ┌────┐       │
│  │Usuario│ │Pedido│ │Pago│ ... │
│  └──┬─┘ └──┬─┘ └──┬─┘       │
│     └──────┼──────┘          │
│         BD compartida         │
└──────────────────────────────┘
```

- **Ventajas**: desarrollo simple, despliegue sencillo, depuración local fácil
- **Desventajas**: alto acoplamiento del código, difícil de escalar, un fallo en un módulo puede tumbar todo el sistema
- **Aplicable**: proyectos startup tempranos, desarrollo con un solo equipo, validación rápida de prototipos

#### Arquitectura de microservicios (Microservices)

Divide el sistema en múltiples servicios independientes, cada uno con sus propios datos y lógica de negocio, desplegables y escalables de forma independiente.

```
┌────────┐  ┌────────┐  ┌────────┐
│Servicio │  │Servicio │  │Servicio │
│Usuario  │  │Pedido   │  │Pago     │
│  DB-1  │  │  DB-2  │  │  DB-3  │
└───┬────┘  └───┬────┘  └───┬────┘
    └───────────┼───────────┘
          API Gateway
```

- **Ventajas**: despliegue y escalado independientes, flexibilidad de stack tecnológico, aislamiento de fallos
- **Desventajas**: comunicación entre servicios compleja, consistencia de datos distribuidos difícil, requiere capacidad DevOps madura
- **Aplicable**: sistemas grandes y complejos, colaboración entre múltiples equipos, escenarios que requieren escalado independiente

#### Arquitectura dirigida por eventos (Event-Driven)

Comunicación mediante eventos asíncronos: los productores emiten eventos y los consumidores responden a ellos, con alto desacoplamiento entre componentes.

```
Productor ──→ [Bus de eventos/Cola de mensajes] ──→ Consumidor A
                                                   ──→ Consumidor B
                                                   ──→ Consumidor C
```

- **Ventajas**: alto desacoplamiento, escalabilidad natural, adecuado para procesamiento en tiempo real
- **Desventajas**: depuración difícil, el orden de eventos y la idempotencia requieren tratamiento adicional
- **Aplicable**: análisis de datos en tiempo real, sistemas IoT, comunicación asíncrona entre microservicios

#### Arquitectura limpia (Clean Architecture)

Propuesta por Robert C. Martin, divide el sistema en cuatro capas concéntricas, donde las dependencias solo pueden apuntar de afuera hacia adentro:

```
┌─────────────────────────────────────┐
│  Frameworks & Drivers               │
│  ┌─────────────────────────────┐    │
│  │  Interface Adapters          │    │
│  │  ┌─────────────────────┐    │    │
│  │  │  Use Cases           │    │    │
│  │  │  ┌─────────────┐    │    │    │
│  │  │  │  Entities    │    │    │    │
│  │  │  │  (dominio)   │    │    │    │
│  │  │  └─────────────┘    │    │    │
│  │  └─────────────────────┘    │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
         Dirección de dependencias: exterior → interior
```

- **Regla fundamental**: las capas internas no conocen la existencia de las externas, la lógica de negocio es completamente independiente del framework y la base de datos
- **Ventajas**: alta testeabilidad, stack tecnológico reemplazable, lógica de negocio clara
- **Desventajas**: alto coste inicial de desarrollo, mucho código de mapeo entre capas, riesgo de sobre-ingeniería en proyectos pequeños
- **Aplicable**: sistemas de negocio complejos, proyectos que requieren mantenimiento a largo plazo

<CleanArchitectureDemo />

#### Arquitectura hexagonal (Hexagonal / Ports & Adapters)

Define las interfaces de entrada/salida del núcleo de negocio mediante "puertos", y conecta los sistemas externos mediante "adaptadores":

```
        ┌─────────────┐
  HTTP ──→ Puerto     │
  CLI  ──→ (entrada)  │  Lógica de negocio  │  (salida) ──→ Base de datos
  MQ   ──→            │      central        │  Puerto   ──→ API externa
        └─────────────┘
```

- **Idea central**: la lógica de negocio no depende de ninguna tecnología externa, los sistemas externos se conectan mediante adaptadores
- **Ventajas**: los sistemas externos se pueden reemplazar libremente, para pruebas basta con usar adaptadores Mock
- **Aplicable**: escenarios que necesitan integrarse con múltiples sistemas externos

#### Arquitectura de cebolla (Onion Architecture)

Similar a la arquitectura limpia, enfatiza que el modelo de dominio está en la capa más interna y la infraestructura en la más externa, con dependencias solo hacia adentro:

```
┌──────────────────────────────┐
│  Infraestructura              │
│  ┌────────────────────────┐  │
│  │  Servicios de aplicación│  │
│  │  ┌──────────────────┐  │  │
│  │  │ Servicios de dominio│  │  │
│  │  │  ┌────────────┐   │  │  │
│  │  │  │Modelo de   │   │  │  │
│  │  │  │dominio     │   │  │  │
│  │  │  └────────────┘   │  │  │
│  │  └──────────────────┘  │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

- **Idea central**: el modelo de dominio es el núcleo del sistema, todas las dependencias apuntan hacia él
- **Diferencia con la arquitectura limpia**: la arquitectura de cebolla enfatiza más la capa de servicios de dominio, la arquitectura limpia enfatiza más la capa de casos de uso
- **Aplicable**: proyectos que adoptan Diseño Guiado por el Dominio (DDD)

### 8.2 Ruta de evolución arquitectónica

Estos patrones no se sustituyen entre sí, sino que evolucionan gradualmente:

```text
Arquitectura en capas tradicional (N-Layered)
  │  Problema: acoplamiento entre capas, difícil reemplazar dependencias externas
  ▼
Arquitectura hexagonal (Ports & Adapters)
  │  Mejora: aísla sistemas externos con puertos y adaptadores
  ▼
Arquitectura de cebolla (Onion)
  │  Mejora: capas concéntricas explícitas, modelo de dominio en el centro
  ▼
Arquitectura limpia (Clean Architecture)
  │  Mejora: reglas de dependencia unificadas, cuatro capas con responsabilidades claras
  ▼
Elegir la arquitectura adecuada según las necesidades del negocio
```

### 8.3 Guía de selección de patrones arquitectónicos

```text
Usuarios < 1k, líneas de código < 5000
    ↓
Arquitectura monolítica + capas simples
    ↓
Usuarios 1k-100k, necesidad de colaboración entre equipos
    ↓
Arquitectura en capas (la presentada en este artículo)
    ↓
Usuarios > 100k, alta complejidad de negocio
    ↓
Arquitectura de microservicios / Arquitectura dirigida por eventos
```

Dimensiones de selección más detalladas:

| Factor a considerar | Capas simples | Arquitectura limpia/hexagonal | Microservicios |
|----------|---------|----------------|--------|
| Tamaño del equipo | 1-5 personas | 5-20 personas | 20+ personas |
| Complejidad del negocio | Baja | Media-alta | Alta |
| Frecuencia de despliegue | Baja | Media | Alta (despliegue independiente) |
| Diversidad de stack tecnológico | Único | Único | Puede ser diverso |
| Coste de operaciones | Bajo | Medio | Alto |

### 8.4 Lecturas recomendadas

- **Arquitectura monolítica**: consulta el artículo complementario [`backend-project-architecture.md`](./backend-project-architecture.md), para entender la evolución de script a monolito
- **Arquitectura de microservicios**: consulta [De monolito a microservicios](/zh-cn/appendix/6-architecture-and-system-design/monolith-to-microservices)
- **Arquitectura limpia**: "Clean Architecture" de Robert C. Martin — obra clásica que propone las reglas de dependencia y el modelo de cuatro capas concéntricas
- **Patrones de arquitectura empresarial**: "Patterns of Enterprise Application Architecture" de Martin Fowler — referencia autorizada sobre arquitectura en capas y organización de lógica de dominio

### 8.5 Enfoque de elegir

**Recuerda este principio**: **la arquitectura sirve al negocio, no se hace arquitectura por la arquitectura misma**.

- Proyectos pequeños: arquitectura simple, lanzamiento rápido para validar
- Proyectos grandes: considerar arquitecturas más complejas, evitar el sobre-diseño
- La familiaridad del equipo también es importante: elegir soluciones que todos puedan entender

---

## 9. Resumen

| Capa | Responsabilidad | Palabra clave |
|------|------|--------|
| Controller | Recibir peticiones, validar parámetros, llamar a Service, devolver respuesta | Recepcionista |
| Service | Orquestación de lógica de negocio, gestión de transacciones, coordinar Repository | Cocinero |
| Repository | Acceso a datos, mapeo ORM, encapsulación de consultas | Almacenista |
| Domain | Definición de entidades, reglas de negocio, objetos de valor | Estándar de recetas |

**Principios fundamentales**:

El núcleo de la arquitectura en capas radica en una división clara de responsabilidades y el control de la dirección de dependencias. Cada capa se enfoca solo en su propia responsabilidad, se comunica con las capas adyacentes mediante interfaces, la lógica de negocio se concentra en las capas Service y Domain, la lógica de acceso a datos se concentra en la capa Repository, y las estructuras de datos entre capas se aíslan mediante DTO, evitando exponer directamente los detalles de implementación interna. Este diseño hace que el sistema sea más fácil de entender, probar y mantener, capaz de afrontar la evolución continua del negocio.

---

## Referencias

1. [Catalog of Patterns of Enterprise Application Architecture - Martin Fowler](https://www.martinfowler.com/eaaCatalog/) — Catálogo de patrones de arquitectura de aplicaciones empresariales de Martin Fowler, referencia clásica de arquitectura en capas
2. [Backend Side Architecture Evolution (N-layered, DDD, Hexagon, Onion, Clean Architecture)](https://medium.com/@iamprovidence/backend-side-architecture-evolution-n-layered-ddd-hexagon-onion-clean-architecture-643d72444ce4) — De la arquitectura en N capas a la arquitectura limpia, entendiendo el origen de cada patrón
3. [Complete Guide to Clean Architecture - GeeksforGeeks](https://www.geeksforgeeks.org/complete-guide-to-clean-architecture/) — Guía completa de arquitectura limpia, explicando capas, reglas de dependencia y separación de responsabilidades
4. [Understanding Hexagonal, Clean, Onion, and Traditional Layered Architectures: A Deep Dive](https://romanglushach.medium.com/understanding-hexagonal-clean-onion-and-traditional-layered-architectures-a-deep-dive-c0f93b8a1b96) — Comparativa profunda entre arquitecturas hexagonal, limpia, de cebolla y en capas tradicional
5. [Building Clean Architectures in Modern Backend Frameworks](https://leapcell.io/blog/building-clean-architectures-in-modern-backend-frameworks) — Guía práctica para implementar arquitectura limpia en frameworks backend modernos
6. [Backend Architecture Patterns: From Monoliths to Microservices](https://nerdleveltech.com/backend-architecture-patterns-from-monoliths-to-microservices) — Panorama completo de patrones de arquitectura backend, del monolito a los microservicios
7. [Explicación detallada de un caso de arquitectura MVC de tres capas](https://www.cnblogs.com/TheMagicalRainbowSea/p/17409206.html) — Relación entre MVC y arquitectura de tres capas con casos prácticos, adecuado para lectores de habla china
