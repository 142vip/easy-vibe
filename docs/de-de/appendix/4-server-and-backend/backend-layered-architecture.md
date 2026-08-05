# Backend-Schichtenarchitektur: Strukturprinzipien

> **Kernfrage**: Wie organisiert man Code, damit er klar und verständlich bleibt, statt immer chaotischer zu werden?

Wenn ein Projekt von einigen Dutzend auf Zehntausende Codezeilen wächst, von der Einzelentwicklung zur Teamarbeit übergeht und von einfachem CRUD zu komplexer Geschäftslogik wird, entscheidet die Art der Codeorganisation über Erfolg oder Scheitern des Projekts. Die Schichtenarchitektur dient nicht der Selbstdarstellung oder dem Befolgen von Dogmen, sondern der Lösung eines grundlegenden Konflikts der Softwareentwicklung: **das natürliche Wachstum der Geschäftskomplexität** gegenüber der **Begrenztheit menschlicher kognitiver Fähigkeiten**.

---

## 1. Warum braucht man Schichten

### 1.1 Die Wurzel des Problems

**Frühe Version** (100 Codezeilen):
```java
@PostMapping("/register")
public Result register(@RequestBody User user) {
    // 1. Prüfen, ob der Benutzername bereits existiert
    if (userRepository.findByUsername(user.getUsername()) != null) {
        return Result.error("Benutzername bereits vergeben");
    }
    // 2. Passwort verschlüsseln
    user.setPassword(encrypt(user.getPassword()));
    // 3. Benutzer speichern
    userRepository.save(user);
    // 4. Willkommens-E-Mail senden
    emailService.sendWelcome(user.getEmail());
    // 5. Log-Eintrag schreiben
    log.info("User registered: {}", user.getUsername());
    return Result.success();
}
```

**6 Monate später** (500 Codezeilen):
- Handynummer-Verifikation hinzugefügt
- Identitätsverifikation hinzugefügt
- Einladungsprämien hinzugefügt
- Risikoprüfung hinzugefügt
- ...

Nun hat diese Methode 500 Zeilen und jede Änderung macht Angst, weil:
- Die Logik ist vermischt — eine Änderung kann andere Funktionen beeinträchtigen
- Testen ist schwierig — jeder Test erfordert eine vollständige HTTP-Anfrage
- Neue Entwickler verstehen nichts, weil die gesamte Logik unstrukturiert zusammenliegt

**Der Kern des Problems**: Der Code hat keine „Grenzen", alle Verantwortlichkeiten sind durcheinandergeraten.

**Die kumulative Wirkung technischer Schulden**:
- ❌ **Hohe Kopplung**: Geschäftslogik ist mit Datenzugriff und HTTP-Protokoll gekoppelt — eine Änderung zieht viele Folgen nach sich
- ❌ **Geringe Kohäsion**: Eine Methode trägt mehrere Verantwortlichkeiten und verstößt gegen das Single-Responsibility-Prinzip
- ❌ **Schwer testbar**: Geschäftslogik kann nicht isoliert getestet werden — der gesamte HTTP-Container muss gestartet werden
- ❌ **Schwer wiederverwendbar**: Geschäftslogik ist an HTTP-Anfragen gebunden — zeitgesteuerte Aufgaben und Message Queues können sie nicht nutzen
- ❌ **Kognitive Belastung**: Entwickler müssen alle Details aller Schichten gleichzeitig verstehen, ohne sich fokussieren zu können

### 1.2 Der Kerngedanke der Schichten

Die Schichtenarchitektur zieht klare Grenzen im Code:

```
┌─────────────────────────────────────┐
│  Anfragen empfangen ← Controller    │  Nur für „Bestellungsannahme"
├─────────────────────────────────────┤
│  Geschäftsprozesse ← Service        │  Nur fürs „Kochen"
├─────────────────────────────────────┤
│  Datenzugriff ← Repository          │  Nur für „Zutaten holen"
├─────────────────────────────────────┤
│  Fachliche Definition ← Domain      │  Nur fürs „Rezept"
└─────────────────────────────────────┘
```

**Kernprinzipien**:
- Jede Schicht macht nur ihre eigene Aufgabe
- Kommunikation zwischen den Schichten erfolgt über klar definierte Schnittstellen
- Geschäftslogik konzentriert sich in Service und Domain
- Datenzugriffslogik konzentriert sich im Repository

**Der technische Wert der Schichtenarchitektur**:

1. **Reduzierte kognitive Belastung**: Entwickler können sich auf die Verantwortlichkeit der aktuellen Schicht konzentrieren, ohne alle Details verstehen zu müssen
2. **Verbesserte Testbarkeit**: Jede Schicht kann unabhängig mit Unit-Tests getestet werden — Abhängigkeiten werden gemockt
3. **Erhöhte Wartbarkeit**: Bei Anforderungsänderungen ist der Änderungsbereich klar abgegrenzt, was das Risiko reduziert
4. **Förderung der Wiederverwendung**: Geschäftslogik hängt nicht von HTTP ab und kann in zeitgesteuerten Aufgaben und Message Queues wiederverwendet werden
5. **Unterstützung der Teamarbeit**: Verschiedene Entwickler können parallel an verschiedenen Schichten arbeiten, mit weniger Konflikten
6. **Längere Code-Lebensdauer**: Klare Grenzen erleichtern Refactoring und Evolution des Codes

---

## 2. Die Vier-Schichten-Architektur im Detail

### 2.1 Gesamtstruktur

Das Wesen der Schichtenarchitektur ist die **Trennung von Belangen** (Separation of Concerns) und die **Kontrolle der Abhängigkeitsrichtung**:

```
┌─────────────────────────────────────────────────────┐
│  Frontend-Anfrage                                    │
└────────────────────┬────────────────────────────────┘
                     │ HTTP Request
                     ▼
┌─────────────────────────────────────────────────────┐
│  Controller (Controller-Schicht)                     │
│  - Anfragen empfangen, Parameter validieren          │
│  - DTO-Konvertierung                                 │
│  - Service aufrufen                                  │
│  - Antwort zurückgeben                               │
└────────────────────┬────────────────────────────────┘
                     │ Geschäftsaufruf
                     ▼
┌─────────────────────────────────────────────────────┐
│  Service (Geschäftslogik-Schicht)                    │
│  - Orchestrierung der Geschäftslogik                 │
│  - Transaktionsmanagement                            │
│  - Koordination mehrerer Repositories                │
│  - Modulübergreifende Koordination                   │
└────────────────────┬────────────────────────────────┘
                     │ Datenzugriff
                     ▼
┌─────────────────────────────────────────────────────┐
│  Repository (Datenzugriffs-Schicht)                  │
│  - Datenbank-CRUD                                    │
│  - Abfrage-Kapselung                                 │
│  - ORM-Mapping                                       │
└────────────────────┬────────────────────────────────┘
                     │ Domänenobjekte
                     ▼
┌─────────────────────────────────────────────────────┐
│  Domain (Domänenmodell-Schicht)                      │
│  - Entitäten (Entity)                                │
│  - Wertobjekte (Value Object)                        │
│  - Geschäftsregeln                                   │
└─────────────────────────────────────────────────────┘
```

**Abhängigkeitsrichtung**: Code-Abhängigkeiten müssen in Richtung **stabilerer, abstrakterer** Schichten zeigen
- Controller hängt vom Service-Interface ab (Abstraktion)
- Service hängt vom Repository-Interface ab (Abstraktion)
- Alle Schichten hängen von Domain ab (Geschäftskern, am stabilsten)
- **Rückwärtsabhängigkeiten sind nicht erlaubt** (z. B. Repository hängt von Service ab)

<LayeredArchitectureDemo />

### 2.2 Controller-Schicht

**Verantwortlichkeit**: Der „Empfangschef" der Anfragen

- HTTP-Anfragen empfangen, Parameter parsen
- Parameter validieren (Format, Pflichtfelder usw.)
- DTO-Konvertierung (Request → Param)
- Service zur Ausführung der Geschäftslogik aufrufen
- DTO-Konvertierung (Result → Response)
- HTTP-Antwort zurückgeben

**Was sie nicht tun sollte**:
- Direkt Geschäftslogik schreiben
- Direkt auf die Datenbank zugreifen
- Transaktionen verwalten

**Design-Philosophie**:
Der Controller ist die „Fassade" des Systems und übernimmt die Adapter-Rolle — er passt das externe HTTP-Protokoll an interne Geschäftsaufrufe an. Er sollte keine Geschäftsentscheidungen enthalten, da diese Fachwissen darstellen und vom Transportprotokoll entkoppelt sein sollten.

**Beispiel**:
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

        // 2. Service aufrufen
        User user = userService.createUser(param);

        // 3. Entity → Response DTO
        return UserResponse.from(user);
    }
}
```

**Kernpunkte**:
- `@Valid` zur automatischen Parameter-Validierung nutzen
- DTOs zur Trennung von Frontend- und Backend-Datenstrukturen verwenden
- Nur „Übersetzen" und „Vermitteln" — keine Geschäftslogik

<ControllerLayerDemo />

### 2.3 Service-Schicht

**Verantwortlichkeit**: Der „Koch" der Geschäftslogik

- Kern-Geschäftslogik implementieren
- Operationen mehrerer Repositories orchestrieren
- Transaktionsgrenzen verwalten
- Modulübergreifende Koordination

**Was sie nicht tun sollte**:
- Direkt SQL schreiben (das macht das Repository)
- HTTP-bezogene Dinge verarbeiten
- Datenbank-Entitäten an den Controller zurückgeben

**Design-Philosophie**:
Die Service-Schicht ist der Träger der Geschäftslogik und sollte rein bleiben. Sie hängt von keinem Framework oder Transportprotokoll ab. Das ermöglicht:
- Unit-Tests unabhängig von der Web-Schicht
- Wiederverwendung in zeitgesteuerten Aufgaben und Message-Queue-Consumern
- Vermeidung, dass Technologiewechsel die Geschäftslogik beeinträchtigen

**Beispiel**:
```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public User createUser(UserParam param) {
        // 1. Geschäftsregel: Prüfen, ob Benutzername bereits existiert
        if (userRepository.existsByUsername(param.getUsername())) {
            throw new UserAlreadyExistsException();
        }

        // 2. Benutzer-Entität erstellen
        User user = new User();
        user.setUsername(param.getUsername());
        user.setPassword(param.getPassword());
        user.setEmail(param.getEmail());

        // 3. In der Datenbank speichern
        userRepository.save(user);

        // 4. Willkommens-E-Mail senden (modulübergreifende Koordination)
        emailService.sendWelcomeEmail(user);

        return user;
    }
}
```

**Kernpunkte**:
- `@Transactional` für transaktionale Konsistenz nutzen
- Geschäftsausnahmen werfen, die der Controller einheitlich behandelt
- Keine Abhängigkeit von HTTP-Konzepten — dadurch wiederverwendbar

<ServiceLayerDemo />

### 2.4 Repository-Schicht

**Verantwortlichkeit**: Der „Lagerverwalter" der Daten

- Alle Datenzugriffslogik kapseln
- CRUD-Operationen ausführen
- ORM-Mapping verarbeiten
- Abfragebedingungen kapseln

**Was sie nicht tun sollte**:
- Geschäftslogik schreiben
- Transaktionen verwalten (das macht die Service-Schicht)
- Von oberen Schichten abhängen

**Design-Philosophie**:
Das Repository ist eine Abstraktionsschicht für den Datenzugriff, die die Details der zugrunde liegenden Datenbank verbirgt. Der Wert dieser Abstraktion liegt darin:
- Beim Datenbankwechsel muss nur die Repository-Implementierung geändert werden — die Geschäftslogik bleibt unverändert
- Einfaches Mocking für Unit-Tests
- Abfragelogik wird zentral verwaltet, um Code-Duplizierung zu vermeiden

**Beispiel**:
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data JPA implementiert automatisch
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

    // Benutzerdefinierte komplexe Abfrage
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.deleted = false")
    Optional<User> findActiveByEmail(@Param("email") String email);
}
```

**Kernpunkte**:
- Repository ist ein Interface und enthält keine Geschäftslogik
- Methodennamen drücken die Abfrageabsicht aus
- `@Query` für benutzerdefinierte komplexe Abfragen

<RepositoryLayerDemo />

### 2.5 Domain-Schicht

**Verantwortlichkeit**: Das „Rezept" der Geschäftslogik

- Geschäftsentitäten (Entity) definieren
- Wertobjekte (Value Object) definieren
- Geschäftsregeln kapseln
- Als gemeinsame Abhängigkeit aller Schichten dienen

**Wichtige Eigenschaften**:
- Die Domain-Schicht hängt von keiner anderen Schicht ab
- Alle Schichten hängen von der Domain-Schicht ab
- Sie ist die Grundlage der Schichtenarchitektur

**Design-Philosophie**:
Die Domain-Schicht ist der Geschäftskern des gesamten Systems und drückt Fachwissen und Geschäftsregeln aus. Ihre Reinheit ist entscheidend:
- Keine Abhängigkeit von Frameworks bedeutet, dass die Geschäftslogik nicht von der Technologie gekapert wird
- Alle Schichten hängen von ihr ab, was die Einheitlichkeit der Geschäftsregeln sicherstellt
- Langfristige Evolution wird erleichtert — der Technologie-Stack kann ausgetauscht werden, die Geschäftsregeln sind relativ stabil

**Beispiel**:
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

    // ✅ Geschäftsmethode: Geschäftsregel kapseln
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

**Kernpunkte**:
- Entity hat eine eindeutige Identität
- Geschäftsregeln sind in Domain-Objekten gekapselt
- Die Domain-Schicht ist reine Geschäftslogik ohne Framework-Abhängigkeit

<DomainModelDemo />

---

## 3. DTO: Der „Übersetzer" zwischen den Schichten

### 3.1 Warum braucht man DTOs

**Das Problem**: Wenn Datenbank-Entitäten direkt an das Frontend zurückgegeben werden:

```java
// ❌ Falsch: Entity direkt zurückgeben
@Entity
public class User {
    private Long id;
    private String username;
    private String password;        // Sensible Informationen!
    private Boolean isDeleted;      // Internes Feld!
}
```

Das Frontend würde Felder erhalten, die nicht offengelegt werden sollten — ein Sicherheitsrisiko.

**Die Lösung**: DTOs als „Übersetzer" verwenden

```
Datenbank-Entity → Service Param/Result → Controller Request/Response → Frontend
```

### 3.2 DTO-Typen

| Typ | Verwendung | Beispiel |
|------|------|------|
| Request DTO | Controller empfängt Parameter | UserCreateRequest |
| Response DTO | Controller gibt Daten zurück | UserResponse |
| Param DTO | Service-Methodenparameter | UserParam |
| Result DTO | Service-Rückgabeergebnis | UserResult |
| Entity | Datenbank-Mapping | User |

**Kernprinzipien**:
Jede Schicht verwendet ihre eigenen DTOs — Entitäten werden nicht direkt weitergereicht. DTOs enthalten nur die notwendigen Felder. Dadurch wird vermieden, interne Implementierungsdetails offenzulegen, und die Unabhängigkeit der Schichten bleibt gewahrt.

<DtoFlowDemo />

---

## 4. Abhängigkeitsrichtung: Das eiserne Gesetz der Schichtenarchitektur

### 4.1 Das Dependency-Inversion-Prinzip

**Falscher Ansatz**:
```
Controller → UserServiceImpl → UserDaoImpl → UserEntity
```

**Richtiger Ansatz**:
```
Controller → UserService(Interface) → UserRepository(Interface) → UserEntity
```

**Abhängigkeitsrichtung**:

Die korrekte Abhängigkeitsrichtung ist, dass alle Schichten von abstrakteren, stabileren Schichten abhängen. Konkret: Controller hängt vom Service-Interface ab, Service vom Repository-Interface, und alle Schichten hängen von der Domain-Schicht ab — die Domain-Schicht selbst hängt von keiner anderen Schicht ab. Diese Abhängigkeitsrichtung stellt die Unabhängigkeit und Testbarkeit der Geschäftslogik sicher.

Zu den falschen Ansätzen gehören: Service hängt direkt von einer Repository-Implementierungsklasse ab, Controller greift direkt auf die Datenbank zu, oder die Domain-Schicht hängt von anderen Schichten ab. All dies erhöht die Kopplung und verringert die Wartbarkeit des Systems.

### 4.2 Code-Beispiel

```java
// ✅ Richtig: Von Interfaces abhängen
@Service
public class OrderService {
    private final OrderRepository orderRepository;  // Interface
    private final PaymentService paymentService;    // Interface
}

// ✅ Implementierungsklasse wird von Spring automatisch injiziert
@Repository
public class OrderRepositoryImpl implements OrderRepository {
    // Implementierungsdetails
}
```

<DependencyDirectionDemo />

---

## 5. Praxisbeispiel: E-Commerce-Bestellsystem

### 5.1 Anforderung

Bestellung anlegen:
1. Benutzer wählt Produkte aus
2. Lagerbestand prüfen
3. Betrag berechnen
4. Bestellung anlegen
5. Lagerbestand abbuchen

### 5.2 Code-Implementierung

**Domain-Schicht**:
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
            throw new IllegalStateException("Nur Bestellungen mit ausstehender Zahlung können storniert werden");
        }
        this.status = OrderStatus.CANCELLED;
    }
}
```

**Repository-Schicht**:
```java
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}
```

**Service-Schicht**:
```java
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final InventoryService inventoryService;

    @Transactional
    public OrderDTO createOrder(OrderParam param) {
        // 1. Produkte validieren und Lagerbestand abbuchen
        for (OrderItemParam item : param.getItems()) {
            inventoryService.reserveStock(item.getProductId(), item.getQuantity());
        }

        // 2. Bestellung anlegen
        Order order = new Order();
        order.setUserId(param.getUserId());
        order.calculateTotal();

        // 3. Bestellung speichern
        orderRepository.save(order);

        return OrderDTO.from(order);
    }
}
```

**Controller-Schicht**:
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

## 6. Häufige Fragen

### 6.1 Darf der Controller Geschäftslogik enthalten

Der Controller sollte keine Geschäftslogik enthalten — er ist nur für das Empfangen von Anfragen und das Zurückgeben von Antworten zuständig. Geschäftslogik sollte in der Service-Schicht gekapselt sein. Der Vorteil: Der Code kann wiederverwendet werden — z. B. können zeitgesteuerte Aufgaben oder Message-Queue-Consumer den Service direkt aufrufen, ohne eine HTTP-Anfrage zu benötigen. Zudem ist die Geschäftslogik an einem Ort konzentriert und damit leichter zu testen und zu warten, was Inkonsistenzen durch verstreute Logik vermeidet.

### 6.2 Was sind das „Anemic Domain Model" und das „Rich Domain Model"

Das Anemic Domain Model bedeutet, dass Entitätsklassen nur Attribute und deren Getter/Setter-Methoden enthalten, aber keine Geschäftslogik. Alle Geschäftsregeln werden in der Service-Schicht implementiert. Dieses Modell ist einfach strukturiert, leicht verständlich und wird in den meisten Projekten verwendet.

Das Rich Domain Model bedeutet, dass Entitätsklassen nicht nur Attribute, sondern auch die zur Entität gehörenden Geschäftsmethoden enthalten und Geschäftsregeln innerhalb der Entität kapseln. Dieser Ansatz entspricht stärker dem objektorientierten Design: Daten und Verhalten gehören zusammen, was die Kohäsion des Codes erhöht.

Es wird empfohlen, das Modell basierend auf dem technischen Hintergrund des Teams und der Projektkomplexität zu wählen. Unabhängig von der Wahl sollte Konsistenz gewahrt bleiben und die Domain-Schicht sollte zumindest grundlegende Geschäftsverhaltensmethoden enthalten, statt eine vollständig leere Hülle zu sein.

### 6.3 Wie behandelt man Transaktionen über mehrere Services hinweg

Wenn eine Geschäftsoperation mehrere Services umfasst, sollte die Transaktionsannotation in der übergeordneten Service-Methode verwendet werden, die nacheinander die untergeordneten Services aufruft. So wird sichergestellt, dass alle Operationen im selben Transaktionskontext ausgeführt werden — entweder alle erfolgreich oder alle fehlgeschlagen — und die Datenkonsistenz gewahrt bleibt. Wichtig: Die Transaktionsgrenze sollte so klein wie möglich sein und nur die notwendigen Operationen enthalten, um zu vermeiden, dass lange gehaltene Datenbanksperren die Parallelverarbeitung beeinträchtigen.

---

## 7. Zusammenfassung

| Schicht | Verantwortlichkeit | Schlüsselwort |
|------|------|--------|
| Controller | Anfragen empfangen, Parameter validieren, Service aufrufen, Antwort zurückgeben | Empfangschef |
| Service | Geschäftslogik orchestrieren, Transaktionsmanagement, Repository koordinieren | Koch |
| Repository | Datenzugriff, ORM-Mapping, Abfrage-Kapselung | Lagerverwalter |
| Domain | Entitätsdefinition, Geschäftsregeln, Wertobjekte | Rezept |

**Kernprinzipien**:
1. Jede Schicht macht nur ihre eigene Aufgabe
2. Kommunikation zwischen den Schichten über Interfaces
3. Geschäftslogik konzentriert sich in Service und Domain
4. Datenzugriffslogik konzentriert sich im Repository
5. DTOs zur Trennung der Datenstrukturen zwischen den Schichten

---

## 8. Weitere Architekturmuster

Dieser Artikel beschreibt die **Schichtenarchitektur** (Layered Architecture), das häufigste und am einfachsten zugängliche Backend-Architekturmuster. Doch die Backend-Architektur beschränkt sich nicht darauf — je nach Geschäftsszenario gibt es weitere erwähnenswerte Muster:

### 8.1 Weitere gängige Architekturmuster

| Architekturmuster | Geeignete Szenarien | Merkmale |
|----------|----------|------|
| **Monolithische Architektur** | Kleine Projekte, MVP | Alle Funktionen in einer Anwendung, einfaches Deployment |
| **Microservices-Architektur** | Große, komplexe Systeme | Aufteilung in mehrere unabhängige Dienste, jeder einzeln deploybar |
| **Ereignisgesteuerte Architektur** | Hohe Parallelität, asynchrone Verarbeitung | Verarbeitungsabläufe durch Ereignisse ausgelöst, hohe Entkopplung |
| **Clean Architecture** | Komplexe Geschäftssysteme | Geschäftslogik im Zentrum, Abhängigkeiten nur nach innen, Framework in der äußersten Schicht |
| **Hexagonale Architektur** | Viele externe Adapter erforderlich | Kern und externe Systeme durch Ports und Adapter getrennt |
| **Onion Architecture** | Domain-Driven Design | Konzentrische Kreise — Domain-Modell innen, Infrastruktur außen |

Im Folgenden werden sie einzeln vorgestellt:

#### Monolithische Architektur (Monolithic)

Alle Funktionen in einer Anwendung gebündelt, mit gemeinsamer Datenbank und gemeinsamem Prozess.

```
┌──────────────────────────────┐
│         Monolithische App     │
│  ┌────┐ ┌────┐ ┌────┐       │
│  │Benutzer│ │Bestell.│ │Zahlung│ ... │
│  └──┬─┘ └──┬─┘ └──┬─┘       │
│     └──────┼──────┘          │
│        Gemeinsame DB          │
└──────────────────────────────┘
```

- **Vorteile**: Einfache Entwicklung, bequemes Deployment, einfaches lokales Debugging
- **Nachteile**: Hohe Code-Kopplung, schwierige Skalierung, ein Modulfehler kann das gesamte System lahmlegen
- **Geeignet für**: Frühe Startup-Projekte, Einzelteam-Entwicklung, schnelle Prototyp-Validierung

#### Microservices-Architektur (Microservices)

Das System wird in mehrere unabhängige Dienste aufgeteilt, jeder mit eigenen Daten und eigener Geschäftslogik, unabhängig deploybar und skalierbar.

```
┌────────┐  ┌────────┐  ┌────────┐
│Benutzer- │  │Bestell.- │  │Zahlungs-│
│dienst  │  │dienst   │  │dienst   │
│  DB-1  │  │  DB-2  │  │  DB-3  │
└───┬────┘  └───┬────┘  └───┬────┘
    └───────────┼───────────┘
          API Gateway
```

- **Vorteile**: Unabhängiges Deployment und Skalierung, flexible Technologie-Stacks, Fehlerisolierung
- **Nachteile**: Komplexe Dienst-zu-Dienst-Kommunikation, schwierige Konsistenz verteilter Daten, erfordert ausgereifte DevOps-Fähigkeiten
- **Geeignet für**: Große, komplexe Systeme, Multi-Team-Zusammenarbeit, Szenarien mit unabhängigem Skalierungsbedarf

#### Ereignisgesteuerte Architektur (Event-Driven)

Kommunikation über asynchrone Ereignisse: Produzenten senden Ereignisse, Konsumenten reagieren darauf — Komponenten sind stark entkoppelt.

```
Produzent ──→ [Event Bus/Message Queue] ──→ Konsument A
                                          ──→ Konsument B
                                          ──→ Konsument C
```

- **Vorteile**: Starke Entkopplung, natürliche Skalierbarkeit, geeignet für Echtzeitverarbeitung
- **Nachteile**: Schwieriges Debugging, Ereignisreihenfolge und Idempotenz erfordern zusätzliche Behandlung
- **Geeignet für**: Echtzeit-Datenanalyse, IoT-Systeme, asynchrone Kommunikation zwischen Microservices

#### Clean Architecture

Von Robert C. Martin vorgeschlagen — das System wird in vier konzentrische Kreise unterteilt, Abhängigkeiten dürfen nur von außen nach innen zeigen:

```
┌─────────────────────────────────────┐
│  Frameworks & Drivers                │
│  ┌─────────────────────────────┐    │
│  │  Interface Adapters          │    │
│  │  ┌─────────────────────┐    │    │
│  │  │  Use Cases           │    │    │
│  │  │  ┌─────────────┐    │    │    │
│  │  │  │  Entities    │    │    │    │
│  │  │  │  (Domäne)    │    │    │    │
│  │  │  └─────────────┘    │    │    │
│  │  └─────────────────────┘    │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
      Abhängigkeitsrichtung: außen → innen
```

- **Kernregel**: Innere Schichten kennen die äußeren nicht — Geschäftslogik ist vollständig unabhängig von Framework und Datenbank
- **Vorteile**: Hohe Testbarkeit, austauschbarer Technologie-Stack, klare Geschäftslogik
- **Nachteile**: Höhere anfängliche Entwicklungskosten, viel Boilerplate-Mapping-Code, Over-Engineering bei kleinen Projekten
- **Geeignet für**: Komplexe Geschäftssysteme, Projekte mit langfristigem Wartungsbedarf

<CleanArchitectureDemo />

#### Hexagonale Architektur (Hexagonal / Ports & Adapters)

„Ports" definieren die Ein-/Ausgabeschnittstellen der Kern-Geschäftslogik, „Adapter" verbinden externe Systeme:

```
        ┌─────────────┐
  HTTP ──→ Port       │
  CLI  ──→ (Eingang)   │  Kern-Geschäftslogik  │  (Ausgang) ──→ Datenbank
  MQ   ──→            │                        │  Port      ──→ Externe API
        └─────────────┘
```

- **Kerngedanke**: Geschäftslogik hängt von keiner externen Technologie ab — externe Systeme werden über Adapter angeschlossen
- **Vorteile**: Externe Systeme können beliebig ausgetauscht werden, Tests mit Mock-Adaptern
- **Geeignet für**: Szenarien mit vielen verschiedenen externen Systemen

#### Onion Architecture

Ähnlich wie Clean Architecture, betont das Domain-Modell als innerste Schicht und Infrastruktur als äußerste — Abhängigkeiten nur nach innen:

```
┌──────────────────────────────┐
│  Infrastruktur                │
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

- **Kerngedanke**: Das Domain-Modell ist der Kern des Systems, alle Abhängigkeiten zeigen darauf
- **Unterschied zur Clean Architecture**: Onion Architecture betont die Domain-Service-Schicht stärker, Clean Architecture die Use-Case-Schicht
- **Geeignet für**: Projekte mit Domain-Driven Design (DDD)

### 8.2 Architektur-Evolutionspfad

Diese Architekturen ersetzen einander nicht, sondern entwickeln sich schrittweise:

```text
Traditionelle Schichtenarchitektur (N-Layered)
  │  Problem: Kopplung zwischen Schichten, externe Abhängigkeiten schwer austauschbar
  ▼
Hexagonale Architektur (Ports & Adapters)
  │  Verbesserung: Ports und Adapter isolieren externe Systeme
  ▼
Onion Architecture
  │  Verbesserung: Klare konzentrische Schichten, Domain-Modell im Zentrum
  ▼
Clean Architecture
  │  Verbesserung: Einheitliche Abhängigkeitsregeln, klare Vier-Schichten-Verantwortlichkeiten
  ▼
Architektur nach Geschäftsbedarf wählen
```

### 8.3 Leitfaden zur Architekturmuster-Wahl

```text
Nutzer < 1.000, Code < 5.000 Zeilen
    ↓
Monolith + einfache Schichten
    ↓
Nutzer 1.000–100.000, Multi-Team-Zusammenarbeit nötig
    ↓
Schichtenarchitektur (in diesem Artikel beschrieben)
    ↓
Nutzer > 100.000, hohe Geschäftskomplexität
    ↓
Microservices / Ereignisgesteuerte Architektur
```

Detailliertere Auswahlkriterien:

| Kriterium | Einfache Schichten | Clean/Hexagonale Architektur | Microservices |
|----------|---------|----------------|--------|
| Teamgröße | 1–5 Personen | 5–20 Personen | 20+ Personen |
| Geschäftskomplexität | Niedrig | Mittel–hoch | Hoch |
| Deployment-Frequenz | Niedrig | Mittel | Hoch (unabhängig) |
| Technologie-Stack-Vielfalt | Einheitlich | Einheitlich | Vielfältig möglich |
| Betriebskosten | Niedrig | Mittel | Hoch |

### 8.4 Literaturempfehlungen

- **Monolithische Architektur**: Siehe den Schwesterartikel [`backend-project-architecture.md`](./backend-project-architecture.md) zur Evolution vom Skript zum Monolith
- **Microservices-Architektur**: Siehe [Vom Monolith zu Microservices](/zh-cn/appendix/6-architecture-and-system-design/monolith-to-microservices)
- **Clean Architecture**: Robert C. Martins „Clean Architecture" — das klassische Werk zu Abhängigkeitsregeln und dem Vier-Kreise-Modell
- **Unternehmensarchitekturmuster**: Martin Fowlers „Patterns of Enterprise Application Architecture" — die maßgebliche Referenz zu Schichtenarchitektur und Organisation von Domänenlogik

### 8.5 Wie wählt man aus

**Merke dir dieses Prinzip**: **Architektur dient dem Geschäft, nicht umgekehrt**.

- Kleine Projekte: einfache Architektur, schnell online gehen und validieren
- Große Projekte: komplexere Architektur in Betracht ziehen, aber Over-Engineering vermeiden
- Team-Vertrautheit ist ebenfalls wichtig — wähle einen Ansatz, den alle verstehen

---

## 9. Zusammenfassung

| Schicht | Verantwortlichkeit | Schlüsselwort |
|------|------|--------|
| Controller | Anfragen empfangen, Parameter validieren, Service aufrufen, Antwort zurückgeben | Empfangschef |
| Service | Geschäftslogik orchestrieren, Transaktionsmanagement, Repository koordinieren | Koch |
| Repository | Datenzugriff, ORM-Mapping, Abfrage-Kapselung | Lagerverwalter |
| Domain | Entitätsdefinition, Geschäftsregeln, Wertobjekte | Rezept |

**Kernprinzipien**:

Der Kern der Schichtenarchitektur liegt in der klaren Verantwortungsabgrenzung und der Kontrolle der Abhängigkeitsrichtung. Jede Schicht konzentriert sich nur auf ihre eigene Verantwortung, kommuniziert über Interfaces mit benachbarten Schichten, Geschäftslogik ist in Service und Domain konzentriert, Datenzugriffslogik im Repository, und DTOs trennen die Datenstrukturen zwischen den Schichten, um interne Implementierungsdetails nicht offenzulegen. Dieses Design macht das System verständlicher, testbarer und wartbarer und befähigt es, der kontinuierlichen Evolution des Geschäfts standzuhalten.

---

## Referenzen

1. [Catalog of Patterns of Enterprise Application Architecture - Martin Fowler](https://www.martinfowler.com/eaaCatalog/) — Martin Fowlers Katalog von Unternehmensanwendungsarchitekturmustern, die klassische Referenz zur Schichtenarchitektur
2. [Backend Side Architecture Evolution (N-layered, DDD, Hexagon, Onion, Clean Architecture)](https://medium.com/@iamprovidence/backend-side-architecture-evolution-n-layered-ddd-hexagon-onion-clean-architecture-643d72444ce4) — Die Evolution von N-Schichten-Architektur zur Clean Architecture, verstehen, warum jedes Muster entstand
3. [Complete Guide to Clean Architecture - GeeksforGeeks](https://www.geeksforgeeks.org/complete-guide-to-clean-architecture/) — Vollständiger Leitfaden zur Clean Architecture mit Schichten, Abhängigkeitsregeln und Separation of Concerns
4. [Understanding Hexagonal, Clean, Onion, and Traditional Layered Architectures: A Deep Dive](https://romanglushach.medium.com/understanding-hexagonal-clean-onion-and-traditional-layered-architectures-a-deep-dive-c0f93b8a1b96) — Tiefgehender Vergleich von hexagonaler, Clean-, Onion- und traditioneller Schichtenarchitektur
5. [Building Clean Architectures in Modern Backend Frameworks](https://leapcell.io/blog/building-clean-architectures-in-modern-backend-frameworks) — Praxisleitfaden zur Umsetzung von Clean Architecture in modernen Backend-Frameworks
6. [Backend Architecture Patterns: From Monoliths to Microservices](https://nerdleveltech.com/backend-architecture-patterns-from-monoliths-to-microservices) — Panoramaüberblick über Backend-Architekturmuster vom Monolith bis zu Microservices
7. [Ausführliche Erläuterung eines MVC-Drei-Schichten-Architekturbeispiels](https://www.cnblogs.com/TheMagicalRainbowSea/p/17409206.html) — Die Beziehung zwischen MVC und Drei-Schichten-Architektur mit Praxisbeispielen, geeignet für chinesischsprachige Leser als Einstieg
