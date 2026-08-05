# Principes : Conception d'API et protocole frontend-backend

::: tip Question centrale
**Comment le frontend et le backend dialoguent-ils efficacement ?** C'est comme demander : comment concevoir le menu d'un restaurant pour que les clients comprennent du premier coup ? Comment le serveur note les commandes sans se tromper ? Comment servir les plats de manière à satisfaire les clients ? La conception d'API résout le problème des "règles de dialogue".
:::

---

## 0. Posez-vous d'abord une question : avez-vous déjà vécu ces cauchemars

**Scénario 1 : noms d'interface au petit bonheur**

```
GET /getUserData
GET /fetchUserInfo
GET /queryUserById
GET /users/query
```

Quatre interfaces, même fonctionnalité, styles de nommage totalement différents. Le nouvel arrivant est perplexe : laquelle utiliser ?

**Scénario 2 : gestion des erreurs en tout genre**

```json
// Certains renvoient le code d'état HTTP
HTTP/1.1 404 Not Found

// D'autres renvoient 200 + code
HTTP/1.1 200 OK
{ "code": 404, "message": "Utilisateur introuvable" }

// D'autres lèvent directement une exception
HTTP/1.1 200 OK
{ "error": "Une erreur s'est produite" }
```

Le frontend ne sait pas comment déterminer si la requête a réussi.

**Scénario 3 : structures de réponse toutes différentes**

```json
// Interface A
{ "data": { ... } }

// Interface B
{ "result": { ... } }

// Interface C
{ "content": { ... } }
```

Chaque interface a un format de retour différent, le frontend doit traiter chaque interface individuellement.

---

**Une bonne conception d'API, c'est comme le système de commande d'un restaurant** — menu clair, processus normalisé, messages d'erreur explicites.

---

## 1. Présentation et définition : une API

Une **API** (Application Programming Interface, interface de programmation d'application) est un "contrat de dialogue entre programmes".

### 1.1 Analogie avec un restaurant

| Rôle au restaurant | Concept correspondant | Explication |
| :--- | :--- | :--- |
| Menu | Documentation API | Indique quels "plats" sont disponibles |
| Serveur | Protocole HTTP | Un "mode de dialogue" standardisé |
| Cuisine | Côté serveur | Traite les requêtes selon les "commandes" |
| Service à table | Réponse | Retourne le résultat au "client" |

### 1.2 Une requête API complète

**Essayez par vous-même** : cliquez sur le bouton ci-dessous pour observer un flux complet de requête-réponse API :

<ApiRequestDemo />

---

## 2. Philosophie de conception d'API : RPC / REST / GraphQL / gRPC

Avant d'entrer dans le détail du design RESTful, découvrons les quatre styles de conception d'API les plus courants :

<ApiStyleCompare />

### 2.1 REST vs RESTful : quelle différence

Beaucoup confondent ces deux concepts :

| Concept | Signification | Explication |
| :--- | :--- | :--- |
| **REST** | Un style d'architecture | Concept de conception proposé par Roy Fielding, incluant un ensemble de contraintes |
| **RESTful** | Conforme au style REST | Adjectif, indiquant que la conception d'API suit les principes REST |

**Analogie** :
- REST est comme le "minimalisme" — un concept de design
- Une API RESTful est comme une "pièce au style minimaliste" — une implémentation concrète de ce concept

**Les six contraintes de REST** :

| Contrainte | Explication |
| :--- | :--- |
| **Séparation client-serveur** | Développement indépendant du frontend et du backend, interfaces découplées |
| **Sans état** | Chaque requête contient toutes les informations nécessaires, le serveur ne conserve pas d'état de session |
| **Cacheable** | Les réponses doivent indiquer si elles sont cacheables, pour améliorer les performances |
| **Interface uniforme** | Utiliser les méthodes et codes d'état HTTP standard |
| **Système en couches** | Le client n'a pas besoin de savoir à quelle couche de serveur il se connecte |
| **Code à la demande** (optionnel) | Le serveur peut étendre les fonctionnalités du client |

::: tip Pourquoi REST est-il le plus utilisé ?
1. **Faible coût d'apprentissage** : le protocole HTTP lui-même incarne la philosophie REST
2. **Écosystème mature** : outils, frameworks et documentation abondants
3. **Grande polyvalence** : tout langage, toute plateforme peut appeler
4. **Facile à mettre en cache** : les requêtes GET sont naturellement cacheables, compatibles CDN
:::

---

## 3. Conception RESTful : faire communication les URL

**REST** (Representational State Transfer) est un style d'architecture dont l'idée centrale est :

- Abstraire les éléments du réseau en "ressources" (Resource)
- Utiliser les URL pour identifier les ressources
- Utiliser les méthodes HTTP pour manipuler les ressources

### 3.1 Analogie avec un entrepôt

| Concept d'entrepôt | Correspondance REST | Exemple |
| :--- | :--- | :--- |
| Adresse de l'étagère | URL | `/users`, `/orders` |
| Mode d'opération | Méthode HTTP | GET (consulter), POST (ajouter) |
| Marchandise | Ressource | Données utilisateur, données de commande |

**Principe clé** : les URL sont des noms, pas des verbes.

### 3.2 Règles de conception des URL

| Règle | Exemple incorrect | Exemple correct | Explication |
| :--- | :--- | :--- | :--- |
| Utiliser des noms, pas des verbes | `/getUsers` | `/users` | L'URL représente la ressource, la méthode HTTP représente l'opération |
| Utiliser le pluriel | `/user` | `/users` | Standardiser au pluriel |
| Minuscules + tirets | `/UserProfiles` | `/user-profiles` | Les URL sont sensibles à la casse |
| Éviter une profondeur excessive | `/a/b/c/d/e` | `/a/b/c` | Maximum 3 niveaux |
| Filtrer avec des paramètres de requête | `/products/phone/5000` | `/products?cat=phone` | Les critères de filtrage utilisent les paramètres `?` |

::: tip Les URL sont sensibles à la casse
L'utilisation uniforme de minuscules + tirets (-) est la pratique la plus sûre, évitant la confusion majuscules/minuscules et l'incohérence des styles de soulignement.
:::

### 3.3 Choix de la méthode HTTP

| Méthode | Usage | Idempotence | Sécurité | Scénario typique |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | Récupérer une ressource | Oui | Oui | Liste de résultats, afficher les détails |
| **POST** | Créer une ressource | Non | Non | Ajouter un utilisateur, soumettre une commande |
| **PUT** | Mise à jour complète | Oui | Non | Remplacer le profil utilisateur complet |
| **PATCH** | Mise à jour partielle | Non | Non | Modifier uniquement le pseudo |
| **DELETE** | Supprimer une ressource | Oui | Non | Supprimer un utilisateur, annuler une commande |

::: tip Qu'est-ce que l'idempotence ?
**Idempotence** : l'exécution multiple produit le même résultat.

- **Opérations idempotentes** (GET/PUT/DELETE) : cliquer 10 fois ou 1 fois, le résultat est identique
- **Opérations non idempotentes** (POST) : cliquer 10 fois peut créer 10 commandes

**Solution** : utiliser un identifiant unique pour les opérations POST afin d'éviter le traitement en double.
:::

---

## 4. Codes d'état : faire "communication" les erreurs

Les codes d'état HTTP sont le moyen standard par lequel le serveur indique au client "ce qui s'est passé".

### 4.1 Catégories de codes d'état

| Catégorie | Signification | Codes typiques |
| :--- | :--- | :--- |
| **2xx** | Succès | 200 OK, 201 Created, 204 No Content |
| **3xx** | Redirection | 301 déplacé de façon permanente, 304 non modifié |
| **4xx** | Erreur client | 400 paramètre incorrect, 401 non authentifié, 404 inexistant |
| **5xx** | Erreur serveur | 500 erreur interne, 503 service indisponible |

### 4.2 Démonstration des codes d'état courants

**Essayez par vous-même** : cliquez sur le bouton ci-dessous pour comprendre la signification des codes d'état courants :

<StatusCodeDemo />

---

## 5. Gestion des erreurs : "refuser" avec élégance

Une bonne gestion des erreurs permet au client de "comprendre rien qu'en regardant le code d'état", sans avoir à deviner.

### 5.1 Guide des pièges à éviter dans la gestion des erreurs

**Piège 1 : toutes les erreurs renvoient 200**

```json
// Mauvaise pratique
HTTP/1.1 200 OK
{ "error": "Une erreur s'est produite" }
```

Problème : la couche de cache mettra en cache cette réponse "réussie", et le système de monitoring ne détectera pas le problème.

**Piège 2 : message d'erreur trop vague**

```json
// Mauvaise pratique
HTTP/1.1 400 Bad Request
{ "message": "Erreur de paramètre" }
```

Problème : le client ne sait pas quel paramètre est incorrect ni pourquoi.

**Piège 3 : exposer des informations sensibles**

```json
// Pratique dangereuse
HTTP/1.1 500 Internal Server Error
{ "stack": "at UserService.login...", "sql": "SELECT * FROM..." }
```

Dangereux : cela expose la structure du code et les requêtes SQL, que des attaquants pourraient exploiter.

### 5.2 Démonstration d'une gestion correcte des erreurs

**Essayez par vous-même** : comparez des réponses d'erreur "bien" et "mal" conçues :

<ErrorHandlingDemo />

---

## 6. Contrôle de version : la "rétrocompatibilité" des API

### 6.1 Pourquoi le contrôle de version

Scénario : votre application a 1 million d'utilisateurs, vous devez modifier l'interface de commandes.

**Sans contrôle de version** :
- La nouvelle app appelle la nouvelle interface -> OK
- L'ancienne app appelle la nouvelle interface -> champs manquants, crash !

**La bonne approche** :
- `/v1/orders` - ancienne interface, continue à servir l'ancienne app
- `/v2/orders` - nouvelle interface, les nouvelles fonctionnalités sont ici

### 6.2 Stratégies de contrôle de version

| Stratégie | Exemple | Avantage | Inconvénient |
| :--- | :--- | :--- | :--- |
| **Chemin URL** | `/v1/users` | Intuitif, facile à mettre en cache | URL plus longue |
| **En-tête de requête** | `Accept: vnd.api.v2+json` | URL propre | Difficile à déboguer |
| **Paramètre de requête** | `/users?version=2` | Simple | Peu standardisé |

### 6.3 Exemple d'évolution de version

Prenons l'interface utilisateur pour illustrer l'évolution de v1 à v2 :

| Interface | v1 (ancienne version) | v2 (nouvelle version) | Description du changement |
| :--- | :--- | :--- | :--- |
| **Obtenir un utilisateur** | `GET /v1/users`<br>Retour : `name, email` | `GET /v2/users`<br>Retour : `name, email, avatar, phone` | Ajout des champs avatar et téléphone |
| **Créer une commande** | `POST /v1/orders`<br>Accepte : `items[]` | `POST /v2/orders`<br>Accepte : `items[], coupons[]` | Ajout du support des coupons |
| **Opérations par lot** | Aucune | `POST /v2/orders/batch` | Nouvelle interface de création par lot |

::: tip Meilleures pratiques de contrôle de version
- **Maintenir la rétrocompatibilité** : l'interface v1 doit être maintenue au moins 6 à 12 mois, pour laisser le temps aux clients de migrer
- **Documentation synchronisée** : chaque version dispose de sa propre documentation API
- **Annonce de dépréciation** : notifier à l'avance quand v1 sera retirée, guider la migration
- **Suivi de l'utilisation** : compter les appels v1, confirmer qu'il est sûr de retirer le service avant de le faire
:::

---

## 7. Conception de la structure de réponse

La structure de réponse est le "contrat de données" de la collaboration frontend-backend. Un format unifié réduit considérablement les coûts de communication.

<ResponseStructureDemo />

### 7.1 Références aux pratiques des grands acteurs

::: details Guide de conception d'API Google
Référence : [Google API Design Guide](https://cloud.google.com/apis/design/errors). Google exige que toutes les réponses d'erreur d'API contiennent la structure de message `google.rpc.Status` :

```json
{
  "error": {
    "code": 429,
    "message": "Ressources insuffisantes, veuillez réessayer plus tard",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.ErrorInfo",
        "reason": "RESOURCE_AVAILABILITY",
        "domain": "compute.googleapis.com",
        "metadata": {
          "zone": "us-east1-a",
          "service": "compute"
        }
      }
    ]
  }
}
```

**Exigences clés** :
- Doit inclure `ErrorInfo` fournissant un identifiant d'erreur lisible par machine
- `message` destiné aux développeurs, décrivant le problème et la solution en langage clair
- Le tableau `details` peut contenir `LocalizedMessage` (message localisé), `Help` (lien d'aide), etc.
:::

::: details Guide Microsoft REST API
Référence : [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md). Microsoft met l'accent sur la cohérence des réponses :

**Classification erreurs vs défauts** :
- **Erreur (Error)** : le client a envoyé des données invalides, retour 4xx, n'affecte pas la disponibilité de l'API
- **Défaut (Fault)** : le serveur ne peut pas répondre correctement à une requête valide, retour 5xx, affecte la disponibilité de l'API

**Spécification des en-têtes de réponse** :
- `Date` : obligatoire, format RFC 5322 (fuseau GMT)
- `Content-Type` : obligatoire
- `ETag` : obligatoire pour les ressources supportant le contrôle de concurrence optimiste
:::

::: details Manuel de développement Java Alibaba
Référence : [Manuel de développement Java Alibaba](https://developer.aliyun.com/special/tech-java). Alibaba spécifie les réponses API :

**Objet de retour unifié** :
```java
public class Result<T> {
    private Integer code;
    private String message;
    private T data;
    private String requestId;
}
```

**Conception par segments de codes d'erreur** :
| Plage | Type | Exemple |
| :--- | :--- | :--- |
| 0 | Succès | 0 |
| 1xxxx | Erreur de paramètre | 10001 Paramètre obligatoire manquant |
| 2xxxx | Erreur métier | 20001 Solde insuffisant |
| 3xxxx | Erreur d'authentification | 30001 Non connecté |
| 5xxxx | Erreur système | 50001 Anomalie de base de données |
:::

::: details Conception de réponse API Stripe
Référence : [Documentation API Stripe](https://docs.stripe.com/api/errors). La conception des réponses d'erreur de Stripe est très raffinée :

```json
{
  "error": {
    "type": "card_error",
    "code": "card_declined",
    "message": "Your card was declined.",
    "param": "number",
    "decline_code": "insufficient_funds",
    "doc_url": "https://stripe.com/docs/error-codes/card-declined"
  }
}
```

**Points forts de la conception** :
- `type` distingue les types d'erreur : `api_error`, `card_error`, `invalid_request_error`
- `param` indique quel paramètre exact est en erreur, le frontend peut cibler directement le champ de formulaire
- `doc_url` fournit un lien vers la documentation pour approfondir
- `decline_code` offre une raison d'erreur plus fine
:::

::: details Spécification JSON:API
Référence : [Spécification JSON:API](https://jsonapi.org/format/), une spécification de réponse JSON API largement adoptée dans l'industrie :

```json
{
  "data": {
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "Spécification JSON:API expliquée"
    },
    "relationships": {
      "author": {
        "data": { "type": "users", "id": "9" }
      }
    }
  },
  "included": [
    {
      "type": "users",
      "id": "9",
      "attributes": {
        "name": "Zhang San"
      }
    }
  ]
}
```

**Conception clé** :
- `data` contient la ressource principale, doit avoir `type` et `id`
- `attributes` stocke les propriétés de la ressource
- `relationships` décrit les associations de ressources
- `included` évite les requêtes redondantes, retournant les données associées en une seule fois
:::

::: details Conception de réponse API REST GitHub
Référence : [Documentation API REST GitHub](https://docs.github.com/en/rest). La conception des réponses de GitHub privilégie l'expérience développeur :

**Réponse de succès** :
```json
{
  "id": 1296269,
  "node_id": "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
  "name": "Hello-World",
  "full_name": "octocat/Hello-World",
  "owner": {
    "login": "octocat",
    "id": 1,
    "avatar_url": "https://github.com/images/error/octocat_happy.gif"
  },
  "private": false,
  "html_url": "https://github.com/octocat/Hello-World"
}
```

**Réponse d'erreur** :
```json
{
  "message": "Bad credentials",
  "documentation_url": "https://docs.github.com/rest"
}
```

**Points forts** :
- La réponse contient plusieurs formats d'URL (`html_url`, `url`) pour différents usages
- Les réponses d'erreur incluent une `documentation_url` pointant vers la documentation
- Utilise l'en-tête de réponse `Link` pour la navigation par pagination
:::

::: details Conception de réponse API Twitter/X v2
Référence : [Documentation Twitter API v2](https://developer.twitter.com/en/docs/twitter-api). Twitter API v2 adopte un format de réponse épuré :

```json
{
  "data": {
    "id": "1460323737035677698",
    "text": "Hello, Twitter!"
  },
  "includes": {
    "users": [
      {
        "id": "2244994945",
        "name": "Twitter Dev",
        "username": "TwitterDev"
      }
    ]
  }
}
```

**Points forts** :
- `data` contient les données principales, `includes` contient les données associées (similaire à JSON:API)
- Supporte la sélection de champs : `?tweet.fields=created_at,public_metrics`
- La pagination utilise `next_token` et `previous_token`
:::

### 7.2 Résumé des meilleures pratiques

En synthétisant les spécifications ci-dessus, la conception de la structure de réponse doit suivre ces principes :

1. **Cohérence d'abord** : toutes les interfaces utilisent la même structure de réponse, le frontend peut encapsuler uniformément la couche de requêtes
2. **Lisible par machine** : code d'erreur + raison (reason) permettant au programme de traiter automatiquement
3. **Ami humain** : message descriptif clair, incluant des suggestions de résolution
4. **Traçable** : request_id traverse toute la chaîne de la requête, facilitant le diagnostic
5. **Support i18n** : étendre via details pour des messages localisés

### 7.3 Spécification de conception du champ data

`data` est le cœur de la réponse, sa conception impacte directement la productivité du développement frontend.

<DataFieldDesignDemo />

### 7.4 Conception avancée des réponses d'erreur

<ErrorResponseDesignDemo />

::: tip Liens de référence
- [Google API Design Guide - Errors](https://cloud.google.com/apis/design/errors)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)
- [Manuel de développement Java Alibaba](https://developer.aliyun.com/special/tech-java)
- [Heroku HTTP API Design Guide](https://github.com/interagent/http-api-design)
- [Stripe API - Errors](https://docs.stripe.com/api/errors)
- [JSON:API Specification](https://jsonapi.org/format/)
:::

---

## 8. Pratique : exemple de conception d'API pour un système e-commerce

```
# Module utilisateur
GET    /v1/users                    # Liste des utilisateurs
POST   /v1/users                    # Créer un utilisateur
GET    /v1/users/{id}               # Détails d'un utilisateur
PUT    /v1/users/{id}               # Mise à jour complète
PATCH  /v1/users/{id}               # Mise à jour partielle
DELETE /v1/users/{id}               # Supprimer un utilisateur

# Module de commandes
GET    /v1/users/{id}/orders        # Commandes d'un utilisateur
POST   /v1/orders                   # Créer une commande
GET    /v1/orders/{id}              # Détails d'une commande
PATCH  /v1/orders/{id}/status       # Mettre à jour le statut

# Module produits (filtrage complexe via paramètres de requête)
GET    /v1/products?category=phone&price_max=5000&sort=price_desc&page=1
```

---

## 9. Utiliser l'IA pour concevoir des API

L'IA peut vous aider à générer rapidement des conceptions d'API conformes aux normes. La clé réside dans la fourniture d'un contexte et de contraintes clairs.

### 9.1 Modèle de prompt

```
Vous êtes un architecte backend expérimenté, spécialiste de la conception d'API RESTful. Aidez-moi à concevoir un ensemble d'interfaces API.

## Contexte métier
[Décrivez votre scénario, par ex. : système e-commerce, plateforme de blog, gestion de tâches, etc.]

## Besoins fonctionnels
[Listez les modules nécessaires, par ex. :
- Gestion utilisateurs : inscription, connexion, profil
- Gestion commandes : création, consultation, annulation
- Gestion produits : liste, détails, recherche]

## Exigences de conception
1. Suivre les spécifications RESTful
2. URL en noms au pluriel, minuscules + tirets
3. Utilisation correcte des méthodes HTTP (GET/POST/PUT/PATCH/DELETE)
4. Format de réponse unifié : { code, message, data, request_id }
5. Utilisation raisonnée des codes d'état
6. Contrôle de version : chemin URL (/v1/)

## Format de sortie
Veuillez produire dans le format suivant :

### Liste des interfaces
| Méthode | URL | Description | Corps de requête | Corps de réponse |
|------|-----|------|--------|--------|

### Exemples requête/réponse
[Exemples détaillés des interfaces clés]

### Codes d'état
[Codes utilisés et leur signification]
```

### 9.2 Exemple pratique : API de commandes e-commerce

**Prompt en entrée :**

```
Vous êtes un architecte backend expérimenté, spécialiste de la conception d'API RESTful. Aidez-moi à concevoir un ensemble d'interfaces API pour un système de commandes e-commerce.

## Contexte métier
Plateforme e-commerce B2C, les utilisateurs peuvent parcourir les produits, passer commande et consulter le statut de leurs commandes.

## Besoins fonctionnels
- Module commandes : créer une commande, liste des commandes, détails d'une commande, annuler, payer
- Module panier : ajouter un produit, modifier la quantité, supprimer un produit, consulter le panier

## Exigences de conception
1. Suivre les spécifications RESTful
2. URL en noms au pluriel, minuscules + tirets
3. Utilisation correcte des méthodes HTTP
4. Format de réponse unifié
5. Contrôle de version : /v1/
```

**Exemple de sortie IA :**

| Méthode | URL | Description |
| :--- | :--- | :--- |
| `POST` | `/v1/orders` | Créer une commande |
| `GET` | `/v1/orders` | Liste des commandes |
| `GET` | `/v1/orders/{id}` | Détails d'une commande |
| `PATCH` | `/v1/orders/{id}/status` | Mettre à jour le statut (annuler/payer) |
| `GET` | `/v1/users/{id}/cart` | Obtenir le panier |
| `POST` | `/v1/users/{id}/cart/items` | Ajouter un produit au panier |
| `PATCH` | `/v1/users/{id}/cart/items/{itemId}` | Modifier la quantité dans le panier |
| `DELETE` | `/v1/users/{id}/cart/items/{itemId}` | Supprimer un produit du panier |

### 9.3 Points d'attention pour la conception assistée par l'IA

| Point d'attention | Explication |
| :--- | :--- |
| **Fournir un contexte complet** | Contexte métier, rôles utilisateur, relations entre données doivent être clairs |
| **Définir les contraintes explicitement** | Conventions de nommage, stratégie de version, format de réponse à préciser en amont |
| **Itérer et affiner** | La première sortie peut être imparfaite, poser des questions de suivi, demander des modifications |
| **Revue humaine** | Le contenu généré par l'IA doit être vérifié pour pertinence métier |
| **Compléter les cas limites** | Demander à l'IA de considérer la gestion des erreurs, le contrôle d'accès, la pagination, etc. |

::: tip Techniques de suivi
- "Veuillez ajouter des exemples de réponse d'erreur pour chaque interface"
- "Veuillez prendre en compte les paramètres de pagination, tri et filtrage"
- "Veuillez ajouter les explications de contrôle d'accès des interfaces"
- "Veuillez vérifier la conformité aux meilleures pratiques RESTful"
:::

---

## Glossaire

| Terme | Anglais | Explication |
| :--- | :--- | :--- |
| **API** | Application Programming Interface | Contrat de dialogue entre programmes |
| **REST** | Representational State Transfer | Style d'architecture, identification des ressources par URL |
| **Ressource** | Resource | Concept central de REST, avec un identifiant unique (URL) |
| **Idempotence** | Idempotency | L'exécution multiple produit le même résultat |
| **Code d'état** | Status Code | État de réponse défini par le protocole HTTP |
| **Contrôle de version** | Versioning | Permettre la coexistence des anciennes et nouvelles API, montée en charge fluide |
| **Corps de requête** | Request Body | Données portées par les requêtes POST/PUT/PATCH |
| **Corps de réponse** | Response Body | Données retournées par le serveur |
| **En-tête** | Header | Métadonnées de la requête/réponse (ex. Content-Type) |
| **Authentification** | Authentication | Vérifier "qui vous êtes" (login, Token) |
| **Autorisation** | Authorization | Vérifier "ce que vous pouvez faire" (permissions) |
