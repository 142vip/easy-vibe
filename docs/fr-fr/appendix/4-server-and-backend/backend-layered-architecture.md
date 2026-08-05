# Principes : Architecture en couches backend

> **Question centrale**: Le code devient de plus en plus désordonné, comment l'organiser pour qu'il reste clair et compréhensible ?

Lorsqu'un projet passe de quelques dizaines de lignes de code à des dizaines de milliers, d'un développement solo à une collaboration multi-équipes, de simples CRUD à une logique métier complexe, la manière d'organiser le code détermine directement la survie du projet. L'architecture en couches n'est ni une démonstration technique ni un dogme à suivre aveuglément, mais une réponse à une contradiction fondamentale du génie logiciel : **la croissance naturelle de la complexité métier** face à **la capacité cognitive limitée de l'être humain**.

---

## 1. Motivation et justification : adopter une architecture en couches

### 1.1 Origine du problème

**Version initiale** (100 lignes de code) :
```java
@PostMapping("/register")
public Result register(@RequestBody User user) {
    // 1. Vérifier si le nom d'utilisateur est déjà pris
    if (userRepository.findByUsername(user.getUsername()) != null) {
        return Result.error("Nom d'utilisateur déjà existant");
    }
    // 2. Chiffrer le mot de passe
    user.setPassword(encrypt(user.getPassword()));
    // 3. Sauvegarder l'utilisateur
    userRepository.save(user);
    // 4. Envoyer un email de bienvenue
    emailService.sendWelcome(user.getEmail());
    // 5. Enregistrer le log
    log.info("User registered: {}", user.getUsername());
    return Result.success();
}
```

**6 mois plus tard** (500 lignes de code) :
- Ajout de la vérification du numéro de téléphone
- Ajout de la vérification d'identité réelle
- Ajout des récompenses de parrainage
- Ajout du contrôle des risques
- ...

Cette méthode fait maintenant 500 lignes, chaque modification est angoissante car :
- Les logiques sont mélangées, modifier une partie peut affecter d'autres fonctionnalités
- Difficile à tester, chaque test nécessite de simuler une requête HTTP complète
- Les nouveaux arrivants ne comprennent rien, car toute la logique est entassée au même endroit

**L'essence du problème** : le code n'a pas de "frontières", toutes les responsabilités sont mélangées.

**L'effet cumulatif de la dette technique** :
- ❌ **Couplage fort** : la logique métier est couplée à l'accès aux données et au protocole HTTP, une modification a des répercussions en cascade
- ❌ **Faible cohésion** : une seule méthode assume plusieurs responsabilités, violant le principe de responsabilité unique
- ❌ **Difficile à tester** : impossible de tester la logique métier isolément, il faut démarrer un conteneur HTTP complet
- ❌ **Difficile à réutiliser** : la logique métier est liée aux requêtes HTTP, impossible de la réutiliser dans des tâches planifiées ou des files de messages
- ❌ **Charge cognitive** : le développeur doit comprendre simultanément les détails de toutes les couches, impossible de se concentrer

### 1.2 Idée centrale des couches

L'architecture en couches consiste à tracer des frontières claires dans le code :

```
┌─────────────────────────────────────┐
│  Réception des requêtes ← Controller │  Responsable uniquement de "prendre la commande"
├─────────────────────────────────────┤
│  Orchestration métier ← Service      │  Responsable uniquement de "cuisiner"
├─────────────────────────────────────┤
│  Accès aux données ← Repository      │  Responsable uniquement de "récupérer les ingrédients"
├─────────────────────────────────────┤
│  Définition métier ← Domain          │  Responsable uniquement du "standard de recette"
└─────────────────────────────────────┘
```

**Principes clés** :
- Chaque couche ne fait que son propre travail
- Les couches communiquent entre elles via des interfaces explicites
- La logique métier est concentrée dans Service et Domain
- La logique d'accès aux données est concentrée dans Repository

**Valeur d'ingénierie de l'architecture en couches** :

1. **Réduire la charge cognitive** : le développeur peut se concentrer sur la responsabilité de la couche courante sans comprendre tous les détails globaux
2. **Améliorer la testabilité** : chaque couche peut être testée unitairement de manière isolée, il suffit de mocker les dépendances
3. **Renforcer la maintenabilité** : lors d'un changement de besoin, la portée des modifications est clairement identifiable, réduisant les risques
4. **Favoriser la réutilisation du code** : la logique métier ne dépend pas du HTTP, elle peut être réutilisée dans des tâches planifiées ou des files de messages
5. **Soutenir la collaboration d'équipe** : différents développeurs peuvent travailler en parallèle sur différentes couches, réduisant les conflits
6. **Prolonger la durée de vie du code** : des frontières claires facilitent le refactoring et l'évolution du code

---

## 2. Explication détaillée de l'architecture en quatre couches

### 2.1 Structure globale

L'essence de l'architecture en couches est la **séparation des préoccupations** (Separation of Concerns) et le **contrôle de la direction des dépendances** :

```
┌─────────────────────────────────────────────────────┐
│  Requête frontend                                    │
└────────────────────┬────────────────────────────────┘
                     │ HTTP Request
                     ▼
┌─────────────────────────────────────────────────────┐
│  Controller (couche contrôleur)                      │
│  - Réception des requêtes, validation des paramètres │
│  - Conversion DTO                                    │
│  - Appel au Service                                  │
│  - Retour de la réponse                              │
└────────────────────┬────────────────────────────────┘
                     │ Appel métier
                     ▼
┌─────────────────────────────────────────────────────┐
│  Service (couche logique métier)                     │
│  - Orchestration de la logique métier                │
│  - Gestion des transactions                          │
│  - Coordination de plusieurs Repository              │
│  - Coordination inter-modules                        │
└────────────────────┬────────────────────────────────┘
                     │ Accès aux données
                     ▼
┌─────────────────────────────────────────────────────┐
│  Repository (couche d'accès aux données)             │
│  - CRUD base de données                              │
│  - Encapsulation des requêtes                        │
│  - Mapping ORM                                       │
└────────────────────┬────────────────────────────────┘
                     │ Objets du domaine
                     ▼
┌─────────────────────────────────────────────────────┐
│  Domain (couche modèle de domaine)                   │
│  - Entités (Entity)                                  │
│  - Objets valeur (Value Object)                      │
│  - Règles métier                                     │
└─────────────────────────────────────────────────────┘
```

**Direction des dépendances** : les dépendances du code doivent pointer vers la direction **plus stable et plus abstraite**
- Controller dépend de l'interface Service (abstraction)
- Service dépend de l'interface Repository (abstraction)
- Toutes les couches dépendent de Domain (cœur métier, le plus stable)
- **Les dépendances inverses sont interdites** (par exemple, Repository qui dépend de Service)

<LayeredArchitectureDemo />

### 2.2 Couche Controller

**Responsabilité** : le "réceptionniste" des requêtes

- Recevoir les requêtes HTTP, analyser les paramètres
- Validation des paramètres (format, obligatoire, etc.)
- Conversion DTO (Request → Param)
- Appeler le Service pour exécuter la logique métier
- Conversion DTO (Result → Response)
- Retourner la réponse HTTP

**Ce qu'il ne faut pas faire** :
- Écrire directement de la logique métier
- Manipuler directement la base de données
- Gérer les transactions

**Philosophie de conception** :
Le Controller est la "façade" du système, il joue le rôle d'adaptateur — adapter le protocole HTTP externe en appel métier interne. Il ne doit contenir aucune décision métier, car les décisions métier sont l'expression de la connaissance du domaine et doivent être découplées du protocole de transport.

**Exemple** :
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

        // 2. Appeler le Service
        User user = userService.createUser(param);

        // 3. Entity → Response DTO
        return UserResponse.from(user);
    }
}
```

**Points clés** :
- Utiliser `@Valid` pour la validation automatique des paramètres
- Utiliser des DTO pour isoler les structures de données frontend et backend
- Ne faire que de la "traduction" et de la "distribution", sans logique métier

<ControllerLayerDemo />

### 2.3 Couche Service

**Responsabilité** : le "cuisinier" métier

- Implémenter la logique métier centrale
- Orchestrer les opérations de plusieurs Repository
- Gérer les frontières de transaction
- Gérer la coordination inter-modules

**Ce qu'il ne faut pas faire** :
- Écrire directement du SQL (déléguer au Repository)
- Gérer ce qui concerne le HTTP
- Renvoyer des entités de base de données au Controller

**Philosophie de conception** :
La couche Service est le support de la logique métier et doit rester pure. Elle ne dépend d'aucun framework ni protocole de transport, ce qui permet de :
- Effectuer des tests unitaires indépendamment de la couche Web
- Réutiliser dans des tâches planifiées ou des consommateurs de files de messages
- Éviter que les changements de pile technologique n'affectent la logique métier

**Exemple** :
```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public User createUser(UserParam param) {
        // 1. Règle métier : vérifier si le nom d'utilisateur est déjà pris
        if (userRepository.existsByUsername(param.getUsername())) {
            throw new UserAlreadyExistsException();
        }

        // 2. Créer l'entité utilisateur
        User user = new User();
        user.setUsername(param.getUsername());
        user.setPassword(param.getPassword());
        user.setEmail(param.getEmail());

        // 3. Sauvegarder dans la base de données
        userRepository.save(user);

        // 4. Envoyer l'email de bienvenue (coordination inter-modules)
        emailService.sendWelcomeEmail(user);

        return user;
    }
}
```

**Points clés** :
- Utiliser @Transactional pour garantir la cohérence transactionnelle
- Lever des exceptions métier, laisser le Controller les gérer de manière unifiée
- Ne pas dépendre des concepts HTTP, peut être réutilisé

<ServiceLayerDemo />

### 2.4 Couche Repository

**Responsabilité** : le "magasinier" des données

- Encapsuler toute la logique d'accès aux données
- Exécuter les opérations CRUD
- Gérer le mapping ORM
- Encapsuler les conditions de requête

**Ce qu'il ne faut pas faire** :
- Écrire de la logique métier
- Gérer les transactions (gérées par la couche Service)
- Dépendre des modules de couche supérieure

**Philosophie de conception** :
Le Repository est une couche d'abstraction de l'accès aux données, il masque les détails de la base de données sous-jacente. La valeur de cette abstraction réside dans :
- La possibilité de changer de base de données en ne modifiant que l'implémentation du Repository, sans toucher à la logique métier
- La facilité de mock pour les tests unitaires
- La gestion centralisée de la logique de requête, évitant la duplication de code

**Exemple** :
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data JPA implémente automatiquement
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

    // Requête complexe personnalisée
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.deleted = false")
    Optional<User> findActiveByEmail(@Param("email") String email);
}
```

**Points clés** :
- Le Repository est une interface, ne contient pas de logique métier
- Utiliser les noms de méthodes pour exprimer l'intention de la requête
- Possibilité d'utiliser @Query pour des requêtes complexes personnalisées

<RepositoryLayerDemo />

### 2.5 Couche Domain

**Responsabilité** : le "standard de recette" métier

- Définir les entités métier (Entity)
- Définir les objets valeur (Value Object)
- Encapsuler les règles métier
- Servir de dépendance commune à toutes les couches

**Caractéristiques importantes** :
- La couche Domain ne dépend d'aucune autre couche
- Toutes les couches dépendent de la couche Domain
- C'est la fondation de l'architecture en couches

**Philosophie de conception** :
La couche Domain est le cœur métier de tout le système, elle exprime la connaissance du domaine et les règles métier. Sa pureté est cruciale :
- Ne pas dépendre du framework signifie que la logique métier n'est pas prisonnière de la pile technologique
- Toutes les couches en dépendent, garantissant l'uniformité des règles métier
- Facilite l'évolution à long terme, la pile technologique peut être remplacée, les règles métier restent relativement stables

**Exemple** :
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

    // ✅ Méthode métier : encapsuler les règles métier
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

**Points clés** :
- L'Entity possède un identifiant unique
- Les règles métier sont encapsulées dans les objets Domain
- La couche Domain est de la logique métier pure, ne dépend pas du framework

<DomainModelDemo />

---

## 3. DTO : le "traducteur" entre les couches

### 3.1 Pourquoi a-t-on besoin des DTO

**Problème** : si on renvoie directement l'entité de base de données au frontend :

```java
// ❌ Erreur : renvoyer directement l'Entity
@Entity
public class User {
    private Long id;
    private String username;
    private String password;        // Information sensible !
    private Boolean isDeleted;      // Champ interne !
}
```

Le frontend recevrait des champs qui ne devraient pas être exposés, créant un risque de sécurité.

**Solution** : utiliser les DTO comme "traducteurs"

```
Base de données Entity → Service Param/Result → Controller Request/Response → Frontend
```

### 3.2 Types de DTO

| Type | Usage | Exemple |
|------|------|------|
| Request DTO | Controller reçoit les paramètres | UserCreateRequest |
| Response DTO | Controller renvoie les données | UserResponse |
| Param DTO | Paramètres de méthode Service | UserParam |
| Result DTO | Résultat renvoyé par Service | UserResult |
| Entity | Mapping base de données | User |

**Principe clé** :
Chaque couche utilise ses propres DTO, ne pas transmettre directement les Entity, les DTO ne contiennent que les champs nécessaires, cela évite d'exposer les détails d'implémentation interne et garantit l'indépendance de chaque couche.

<DtoFlowDemo />

---

## 4. Direction des dépendances : la règle d'or de l'architecture en couches

### 4.1 Principe d'inversion des dépendances

**Mauvaise pratique** :
```
Controller → UserServiceImpl → UserDaoImpl → UserEntity
```

**Bonne pratique** :
```
Controller → UserService(interface) → UserRepository(interface) → UserEntity
```

**Direction des dépendances** :

La direction correcte des dépendances est que toutes les couches dépendent de couches plus abstraites et plus stables. Concrètement, Controller dépend de l'interface Service, Service dépend de l'interface Repository, toutes les couches dépendent de la couche Domain, et la couche Domain ne dépend d'aucune autre couche. Cette direction des dépendances garantit l'indépendance et la testabilité de la logique métier.

Les mauvaises pratiques incluent Service qui dépend directement d'une implémentation concrète de Repository, Controller qui manipule directement la base de données, ou la couche Domain qui dépend d'autres couches, tout cela augmente le couplage et réduit la maintenabilité du système.

### 4.2 Exemple de code

```java
// ✅ Correct : dépendre de l'interface
@Service
public class OrderService {
    private final OrderRepository orderRepository;  // interface
    private final PaymentService paymentService;    // interface
}

// ✅ L'implémentation est injectée automatiquement par Spring
@Repository
public class OrderRepositoryImpl implements OrderRepository {
    // Détails d'implémentation
}
```

<DependencyDirectionDemo />

---

## 5. Cas pratique : système de commande e-commerce

### 5.1 Besoin

Créer une commande :
1. L'utilisateur sélectionne des produits
2. Vérifier le stock
3. Calculer le montant
4. Créer la commande
5. Déduire le stock

### 5.2 Implémentation du code

**Couche Domain** :
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
            throw new IllegalStateException("Seules les commandes en attente de paiement peuvent être annulées");
        }
        this.status = OrderStatus.CANCELLED;
    }
}
```

**Couche Repository** :
```java
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}
```

**Couche Service** :
```java
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final InventoryService inventoryService;

    @Transactional
    public OrderDTO createOrder(OrderParam param) {
        // 1. Valider les produits et déduire le stock
        for (OrderItemParam item : param.getItems()) {
            inventoryService.reserveStock(item.getProductId(), item.getQuantity());
        }

        // 2. Créer la commande
        Order order = new Order();
        order.setUserId(param.getUserId());
        order.calculateTotal();

        // 3. Sauvegarder la commande
        orderRepository.save(order);

        return OrderDTO.from(order);
    }
}
```

**Couche Controller** :
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

## 6. Questions fréquentes

### 6.1 Le Controller peut-il contenir de la logique métier

Le Controller ne doit pas contenir de logique métier, il est seulement responsable de recevoir les requêtes et de renvoyer les réponses. La logique métier doit être encapsulée dans la couche Service, l'avantage étant que le code peut être réutilisé, par exemple des tâches planifiées ou des consommateurs de files de messages peuvent appeler directement le Service sans passer par une requête HTTP. De plus, la logique métier concentrée au même endroit est plus facile à tester et à maintenir, évitant les incohérences dues à une logique dispersée.

### 6.2 Qu'est-ce que le modèle anémique et le modèle riche

Le modèle anémique (Anemic Domain Model) désigne des classes d'entités qui contiennent uniquement des attributs et leurs getters/setters, sans aucune logique métier, toutes les règles métier étant implémentées dans la couche Service. Ce modèle est simple à structurer, facile à comprendre, et c'est l'approche adoptée par la plupart des projets.

Le modèle riche (Rich Domain Model) désigne des classes d'entités qui contiennent non seulement des attributs, mais aussi des méthodes métier liées à l'entité, encapsulant les règles métier à l'intérieur de l'entité. Cette approche est plus conforme à la pensée orientée objet, en gardant les données et le comportement ensemble, ce qui améliore la cohésion du code.

Il est recommandé de choisir le modèle adapté en fonction du contexte technique de l'équipe et de la complexité du projet, mais quel que soit le choix, il faut rester cohérent, et la couche Domain doit au moins contenir des méthodes de comportement métier de base, plutôt que d'être une coquille complètement vide.

### 6.3 Comment gérer les transactions跨多个 Service

Lorsqu'une opération métier doit traverser plusieurs Service, il faut utiliser l'annotation de transaction dans le Service de niveau supérieur, et dans cette méthode appeler séquentiellement les Service de niveau inférieur. Cela garantit que toutes les opérations s'exécutent dans le même contexte transactionnel, soit tout réussit, soit tout échoue, assurant la cohérence des données. Il faut noter que la frontière de transaction doit être aussi petite que possible, ne contenant que les opérations nécessaires, pour éviter de bloquer la base de données trop longtemps et nuire aux performances de concurrence.

---

## 7. Résumé

| Couche | Responsabilité | Mot-clé |
|------|------|--------|
| Controller | Recevoir les requêtes, valider les paramètres, appeler Service, renvoyer la réponse | Réceptionniste |
| Service | Orchestration de la logique métier, gestion des transactions, coordination des Repository | Cuisinier |
| Repository | Accès aux données, mapping ORM, encapsulation des requêtes | Magasinier |
| Domain | Définition des entités, règles métier, objets valeur | Standard de recette |

**Principes fondamentaux** :
1. Chaque couche ne fait que son propre travail
2. Les couches communiquent entre elles via des interfaces
3. La logique métier est concentrée dans Service et Domain
4. La logique d'accès aux données est concentrée dans Repository
5. Utiliser les DTO pour isoler les structures de données de chaque couche

---

## 8. Autres modèles d'architecture

Cet article présente l'**architecture en couches** (Layered Architecture), le modèle d'architecture backend le plus courant et le plus facile à prendre en main. Mais l'architecture backend ne se limite pas à cela, selon le contexte métier, il existe d'autres modèles d'architecture qui méritent d'être connus :

### 8.1 Autres modèles d'architecture courants

| Modèle d'architecture | Scénario applicable | Caractéristiques |
|----------|----------|------|
| **Architecture monolithique** | Petits projets, MVP | Toutes les fonctionnalités dans une seule application, déploiement simple |
| **Architecture microservices** | Systèmes vastes et complexes | Découpage en plusieurs services indépendants, chaque service pouvant être déployé indépendamment |
| **Architecture événementielle** | Haute concurrence, traitement asynchrone | Traitement déclenché par événements, fort découplage |
| **Clean Architecture** | Systèmes métier complexes | Logique métier au centre, dépendances uniquement vers l'intérieur, frameworks à la périphérie |
| **Architecture hexagonale** | Besoin de multiples adaptateurs externes | Isolation du cœur et des systèmes externes via des ports et adaptateurs |
| **Architecture en oignon** | Domain-Driven Design | Couches concentriques, modèle de domaine au centre, infrastructure à la périphérie |

Détaillons-les une par une :

#### Architecture monolithique (Monolithic)

Toutes les fonctionnalités sont empaquetées dans une seule application, partageant la même base de données et le même processus.

```
┌──────────────────────────────┐
│       Application monolithique │
│  ┌────┐ ┌────┐ ┌────┐       │
│  │Util.│ │Cde.│ │Paiem.│ ... │
│  └──┬─┘ └──┬─┘ └──┬─┘       │
│     └──────┼──────┘          │
│        Base de données partagée │
└──────────────────────────────┘
```

- **Avantages** : développement simple, déploiement facile, débogage local aisé
- **Inconvénients** : couplage fort du code, extension difficile, un module défaillant peut faire tomber tout le système
- **Adapté** : projets de démarrage précoces, développement en équipe unique, prototypage rapide

#### Architecture microservices (Microservices)

Découpage du système en plusieurs services indépendants, chaque service possédant ses propres données et logique métier, pouvant être déployé et mis à l'échelle indépendamment.

```
┌────────┐  ┌────────┐  ┌────────┐
│Service  │  │Service  │  │Service  │
│Util.    │  │Cde.     │  │Paiem.   │
│  DB-1  │  │  DB-2  │  │  DB-3  │
└───┬────┘  └───┬────┘  └───┬────┘
    └───────────┼───────────┘
          API Gateway
```

- **Avantages** : déploiement et mise à l'échelle indépendants, pile technologique flexible, isolation des pannes
- **Inconvénients** : communication inter-services complexe, cohérence des données distribuées difficile, nécessite des compétences DevOps matures
- **Adapté** : systèmes vastes et complexes, collaboration multi-équipes, scénarios nécessitant une mise à l'échelle indépendante

#### Architecture événementielle (Event-Driven)

Communication par événements asynchrones, le producteur émet des événements, les consommateurs y répondent, les composants sont fortement découplés.

```
Producteur ──→ [Bus d'événements/File de messages] ──→ Consommateur A
                                                     ──→ Consommateur B
                                                     ──→ Consommateur C
```

- **Avantages** : fort découplage, extension naturelle, adapté au traitement en temps réel
- **Inconvénients** : débogage difficile, l'ordre des événements et l'idempotence nécessitent un traitement supplémentaire
- **Adapté** : analyse de données en temps réel, systèmes IoT, communication asynchrone entre microservices

#### Clean Architecture

Proposée par Robert C. Martin, elle divise le système en quatre couches concentriques, les dépendances ne pouvant pointer que de l'extérieur vers l'intérieur :

```
┌─────────────────────────────────────┐
│  Frameworks & Drivers               │
│  ┌─────────────────────────────┐    │
│  │  Interface Adapters         │    │
│  │  ┌─────────────────────┐    │    │
│  │  │  Use Cases           │    │    │
│  │  │  ┌─────────────┐    │    │    │
│  │  │  │  Entities    │    │    │    │
│  │  │  └─────────────┘    │    │    │
│  │  └─────────────────────┘    │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
    Direction des dépendances : extérieur → intérieur
```

- **Règle fondamentale** : les couches internes ne connaissent pas l'existence des couches externes, la logique métier est totalement indépendante du framework et de la base de données
- **Avantages** : haute testabilité, pile technologique remplaçable, logique métier claire
- **Inconvénients** : coût de développement initial élevé, beaucoup de code de mapping entre couches, risque de sur-ingénierie pour les petits projets
- **Adapté** : systèmes métier complexes, projets nécessitant une maintenance à long terme

<CleanArchitectureDemo />

#### Architecture hexagonale (Hexagonal / Ports & Adapters)

Définit les interfaces d'entrée/sortie du cœur métier via des "ports", et connecte les systèmes externes via des "adaptateurs" :

```
        ┌─────────────┐
  HTTP ──→ Port       │
  CLI  ──→ (port      │  Logique métier   │  (port de    ──→ Base de données
  MQ   ──→ d'entrée)  │      cœur         │   sortie)    ──→ API externe
        └─────────────┘
```

- **Idée centrale** : la logique métier ne dépend d'aucune technologie externe, les systèmes externes se connectent via des adaptateurs
- **Avantages** : les systèmes externes peuvent être remplacés librement, il suffit d'utiliser des adaptateurs mock pour les tests
- **Adapté** : scénarios nécessitant de s'interfacer avec de multiples systèmes externes

#### Architecture en oignon (Onion Architecture)

Similaire à la Clean Architecture, elle met l'accent sur le modèle de domaine au centre et l'infrastructure à la périphérie, les dépendances ne pouvant pointer que vers l'intérieur :

```
┌──────────────────────────────┐
│  Infrastructure              │
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

- **Idée centrale** : le modèle de domaine est le cœur du système, toutes les dépendances pointent vers lui
- **Différence avec la Clean Architecture** : l'architecture en oignon met davantage l'accent sur la couche de services de domaine, la Clean Architecture met davantage l'accent sur la couche de cas d'utilisation
- **Adapté** : projets adoptant le Domain-Driven Design (DDD)

### 8.2 Parcours d'évolution architecturale

Ces architectures ne se remplacent pas mutuellement, elles évoluent progressivement :

```text
Architecture en couches traditionnelle (N-Layered)
  │  Problème : couplage entre couches, difficile de remplacer les dépendances externes
  ▼
Architecture hexagonale (Ports & Adapters)
  │  Amélioration : isoler les systèmes externes avec des ports et adaptateurs
  ▼
Architecture en oignon (Onion)
  │  Amélioration : couches concentriques explicites, modèle de domaine au centre
  ▼
Clean Architecture
  │  Amélioration : règles de dépendance unifiées, quatre couches aux responsabilités claires
  ▼
Choisir l'architecture adaptée aux besoins métier
```

### 8.3 Guide de choix du modèle d'architecture

```text
Utilisateurs < 1k, lignes de code < 5000
    ↓
Architecture monolithique + couches simples
    ↓
Utilisateurs 1k-100k, besoin de collaboration multi-équipes
    ↓
Architecture en couches (présentée dans cet article)
    ↓
Utilisateurs > 100k, complexité métier élevée
    ↓
Architecture microservices / Architecture événementielle
```

Dimensions de choix plus fines :

| Facteur à considérer | Couches simples | Clean/Hexagonale | Microservices |
|----------|---------|----------------|--------|
| Taille de l'équipe | 1-5 personnes | 5-20 personnes | 20+ personnes |
| Complexité métier | Faible | Moyenne à élevée | Élevée |
| Fréquence de déploiement | Faible | Moyenne | Élevée (déploiement indépendant) |
| Diversité de la pile technologique | Unique | Unique | Peut être diversifiée |
| Coût d'exploitation | Faible | Moyen | Élevé |

### 8.4 Lectures recommandées

- **Architecture monolithique** : consultez l'article complémentaire [`backend-project-architecture.md`](./backend-project-architecture.md) pour comprendre l'évolution du script au monolithe
- **Architecture microservices** : consultez [De l'architecture monolithique aux microservices](/zh-cn/appendix/6-architecture-and-system-design/monolith-to-microservices)
- **Clean Architecture** : 《Clean Architecture》de Robert C. Martin — l'ouvrage classique qui propose les règles de dépendance et le modèle à quatre couches concentriques
- **Modèles d'architecture d'entreprise** : 《Patterns of Enterprise Application Architecture》de Martin Fowler — référence incontournable sur l'architecture en couches et l'organisation de la logique de domaine

### 8.5 Comment choisir

**Rappelez-vous ce principe** : **l'architecture est au service du métier, ne faites pas de l'architecture pour l'architecture**.

- Petits projets : architecture simple, mise en ligne rapide pour validation
- Grands projets : envisager des architectures plus complexes, éviter la sur-ingénierie
- La familiarité de l'équipe est également importante, choisissez une solution que tout le monde peut comprendre

---

## 9. Résumé

| Couche | Responsabilité | Mot-clé |
|------|------|--------|
| Controller | Recevoir les requêtes, valider les paramètres, appeler Service, renvoyer la réponse | Réceptionniste |
| Service | Orchestration de la logique métier, gestion des transactions, coordination des Repository | Cuisinier |
| Repository | Accès aux données, mapping ORM, encapsulation des requêtes | Magasinier |
| Domain | Définition des entités, règles métier, objets valeur | Standard de recette |

**Principes fondamentaux** :

Le cœur de l'architecture en couches réside dans une division claire des responsabilités et le contrôle de la direction des dépendances. Chaque couche se concentre uniquement sur sa propre responsabilité, communique avec les couches adjacentes via des interfaces, la logique métier est concentrée dans les couches Service et Domain, la logique d'accès aux données est concentrée dans la couche Repository, et les structures de données de chaque couche sont isolées par des DTO, évitant d'exposer directement les détails d'implémentation interne. Une telle conception rend le système plus facile à comprendre, tester et maintenir, capable de faire face à l'évolution continue du métier.

---

## Références

1. [Catalog of Patterns of Enterprise Application Architecture - Martin Fowler](https://www.martinfowler.com/eaaCatalog/) — Le catalogue des modèles d'architecture d'application d'entreprise de Martin Fowler, référence classique pour l'architecture en couches
2. [Backend Side Architecture Evolution (N-layered, DDD, Hexagon, Onion, Clean Architecture)](https://medium.com/@iamprovidence/backend-side-architecture-evolution-n-layered-ddd-hexagon-onion-clean-architecture-643d72444ce4) — De l'architecture N-couches à la Clean Architecture, comprendre les raisons derrière chaque architecture
3. [Complete Guide to Clean Architecture - GeeksforGeeks](https://www.geeksforgeeks.org/complete-guide-to-clean-architecture/) — Guide complet de la Clean Architecture, détaillant les couches, les règles de dépendance et la séparation des préoccupations
4. [Understanding Hexagonal, Clean, Onion, and Traditional Layered Architectures: A Deep Dive](https://romanglushach.medium.com/understanding-hexagonal-clean-onion-and-traditional-layered-architectures-a-deep-dive-c0f93b8a1b96) — Comparaison approfondie des architectures hexagonale, propre, en oignon et traditionnelle en couches
5. [Building Clean Architectures in Modern Backend Frameworks](https://leapcell.io/blog/building-clean-architectures-in-modern-backend-frameworks) — Guide pratique pour implémenter la Clean Architecture dans les frameworks backend modernes
6. [Backend Architecture Patterns: From Monoliths to Microservices](https://nerdleveltech.com/backend-architecture-patterns-from-monoliths-to-microservices) — Vue d'ensemble des modèles d'architecture backend, du monolithe aux microservices
7. [MVC 三层架构案例详细讲解](https://www.cnblogs.com/TheMagicalRainbowSea/p/17409206.html) — Relation entre MVC et l'architecture trois couches avec cas pratiques, adapté aux lecteurs chinois débutants