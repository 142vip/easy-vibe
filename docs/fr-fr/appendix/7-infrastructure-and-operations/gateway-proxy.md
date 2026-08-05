# Principes : Passerelles API et proxy inverse
::: tip Question centrale
**Dans une architecture Internet à forte concurrence, comment acheminer le trafic de manière sécurisée et efficace vers le bon service ?** Le proxy inverse résout le problème de « comment distribuer le trafic », la passerelle API résout le problème de « comment traiter les requêtes ». Cet article explore en profondeur la philosophie de conception des passerelles à travers des cas réels (réceptionniste, système de sécurité, routage intelligent).
:::

---

## 1. Motivation et justification : une « passerelle »

### 1.1 Partons d'un cas réel : l'évolution de l'architecture d'une plateforme e-commerce

Une plateforme e-commerce a rencontré de graves problèmes d'architecture lors de sa croissance rapide :

**Reconstitution du scénario :**

```
Étape 1 : Services directement exposés
Client → Appelle directement le service utilisateur, le service de commandes, le service de paiement...
         ↓
Problème 1 : Les IP des services sont exposées, risque de sécurité
Problème 2 : Impossible d'unifier l'authentification et la limitation de débit
Problème 3 : L'ajout d'un service nécessite de modifier la configuration du client
```

::: warning Les problèmes fatals de l'exposition directe

- **Risques de sécurité** : toutes les IP de services sont exposées, vulnérables aux attaques
- **Fonctionnalités dupliquées** : chaque service doit implémenter l'authentification, la limitation de débit, la journalisation
- **Évolution difficile** : l'ajout d'un service nécessite de modifier tous les clients
- **Protocoles chaotiques** : certains utilisent HTTP, d'autres gRPC, le client doit s'adapter
  :::

**Architecture améliorée (avec passerelle) :**

```
Client → Passerelle API (Nginx/Kong) → Services internes
         ↓
      Authentification, limitation de débit et routage unifiés
         ↓
      Le client ne connaît que l'adresse de la passerelle
```

::: tip Résultats après amélioration

- **Sécurité** : les vraies IP des services sont masquées, seule la passerelle est exposée
- **Fonctionnalités centralisées** : authentification, limitation de débit, journalisation traités uniformément au niveau de la passerelle
- **Évolution simplifiée** : l'ajout d'un service nécessite uniquement de configurer le routage dans la passerelle
- **Protocole unifié** : HTTP en externe, gRPC possible en interne
  :::

### 1.2 Analogie avec la vie quotidienne : le réceptionniste

Imaginez que vous vous rendez dans une grande entreprise :

- **Sans réceptionniste** : les visiteurs se rendent directement dans chaque département, ne sachant pas où aller, c'est le chaos
- **Avec réceptionniste** : les visiteurs se présentent d'abord à l'accueil, le réceptionniste s'enquiert de leur motif et les dirige vers le bon département

**La passerelle API est le « réceptionniste » du système :**

- **Proxy inverse** : le réceptionniste, qui guide les visiteurs vers le bon département
- **Passerelle API** : un réceptionniste intelligent, qui vérifie aussi l'identité des visiteurs (authentification) et limite le nombre d'accès (limitation de débit)

<ReverseProxyDemo />

---

## 2. Présentation et définition : un proxy inverse

### 2.1 Proxy direct vs proxy inverse

::: tip Explication des termes
**Proxy direct (Forward Proxy)** :

- Déployé côté client
- Accède aux ressources externes au nom du client
- Application typique : VPN, outils de contournement
- Exemple : réseau d'entreprise, vous accédez à Internet via un proxy

**Proxy inverse (Reverse Proxy)** :

- Déployé côté serveur
- Reçoit les requêtes des clients et les transmet aux services internes
- Le client ne connaît que l'existence du proxy, pas les serveurs réels
- Exemples : Nginx, HAProxy
  :::

**Tableau comparatif :**

| Dimension         | Proxy direct                 | Proxy inverse                 |
| ------------ | ------------------------ | ------------------------ |
| **Position de déploiement** | Côté client                 | Côté serveur                 |
| **Service rendu** | Client                   | Serveur                   |
| **Application typique** | VPN, contournement                | Équilibrage de charge, passerelle           |
| **Transparence**   | Le serveur voit l'IP du proxy         | Le client voit l'IP du proxy         |
| **Objectif**     | Masquer le vrai client, accélérer l'accès | Masquer le vrai serveur, équilibrer la charge |

### 2.2 La valeur fondamentale du proxy inverse

::: details Valeur n°1 : équilibrage de charge
Répartir le trafic vers plusieurs serveurs backend pour éviter la surcharge d'un seul point.

```
Client
  ↓
Nginx (proxy inverse)
  ↓
┌─────────┬─────────┬─────────┐
│ Serveur 1 │ Serveur 2 │ Serveur 3 │
└─────────┴─────────┴─────────┘
```

:::

::: details Valeur n°2 : protection de sécurité
Masquer les vraies IP des serveurs, empêcher les attaques directes. Protection de sécurité unifiée au niveau du proxy.

```
Client → Ne voit que l'IP de Nginx
Serveurs réels → Uniquement sur le réseau interne, inaccessibles de l'extérieur
```

:::

::: details Valeur n°3 : terminaison SSL
Gérer le chiffrement/déchiffrement HTTPS au niveau du proxy, les services backend utilisent HTTP, réduisant la charge de calcul côté backend.

```
Client HTTPS → Nginx (chiffrement/déchiffrement) → Service backend HTTP
                   ↑
              Point de terminaison SSL
```

:::

---

## 3. Nginx : pourquoi peut-il supporter des millions de connexions simultanées

### 3.1 Modèle de processus Master-Worker

Nginx adopte une architecture **multi-processus** plutôt que multi-threads :

**Processus Master (superviseur)** :

- Responsable de la lecture et de la validation des fichiers de configuration
- Gestion des processus Worker (démarrage, arrêt, rechargement)
- Ne traite pas les requêtes directement

**Processus Worker (exécutant)** :

- Traitent effectivement les requêtes HTTP
- Chaque Worker est un processus indépendant, isolé des autres
- Le nombre est généralement fixé au nombre de cœurs CPU, pour éviter les surcoûts de changement de contexte

::: tip Avantages

- **Bonne isolation** : un Worker qui plante n'affecte pas les autres Workers
- **Exploitation optimale du multi-cœur** : chaque Worker fonctionne indépendamment
- **Évite la complexité du multi-threading** : pas besoin de gérer les verrous, la concurrence, etc.
  :::

### 3.2 Événementiel + E/S asynchrone non bloquante

C'est le secret fondamental de la haute performance de Nginx :

**Apache traditionnel (modèle multi-processus/threads)** :

- Une connexion = un processus/thread
- Le nombre de connexions simultanées est limité par le nombre de processus/threads du système
- Avec de nombreuses connexions, le coût de changement de contexte est énorme

**Nginx (modèle événementiel)** :

- Utilise epoll (Linux)/kqueue (macOS) et autres mécanismes efficaces de multiplexage d'E/S
- Un seul processus Worker peut gérer simultanément des dizaines de milliers de connexions
- Quand une connexion n'a pas de données, elle n'occupe pas le CPU ; de nouvelles données déclenchent une notification par événement

::: tip Analogie de la vie quotidienne

- **Apache** : dans un restaurant, chaque client a son propre serveur (processus), beaucoup de clients nécessitent beaucoup de serveurs
- **Nginx** : un super serveur qui sert simultanément tous les clients, se rendant auprès de celui qui a besoin de service, plutôt que de rester en permanence auprès d'un seul client
  :::

<NginxArchitectureDemo />

---

## 4. Présentation et définition : une passerelle API

### 4.1 Pourquoi une passerelle API

**Imaginez un système sans passerelle :**

- Le client doit connaître les adresses de plusieurs services (service utilisateur, service de commandes, service de paiement...)
- Chaque service doit implémenter lui-même l'authentification, la limitation de débit, la journalisation
- Les protocoles ne sont pas unifiés : certains en HTTP, d'autres en gRPC
- Lors de la mise à jour d'un service, le client doit aussi être modifié

::: warning Problèmes sans passerelle

- **Client complexe** : nécessite de configurer plusieurs adresses de services
- **Fonctionnalités dupliquées** : chaque service doit implémenter l'authentification, la limitation de débit
- **Protocoles chaotiques** : le client doit s'adapter à plusieurs protocoles
- **Mise à niveau difficile** : la mise à jour d'un service implique aussi la modification du client
  :::

**Avec une passerelle API :**

- Le client ne connaît que l'adresse de la passerelle, qui route vers le bon service
- L'authentification, la limitation de débit et la journalisation sont centralisées au niveau de la passerelle
- La passerelle peut convertir les protocoles, exposant uniformément HTTP en externe
- La mise à jour des services backend nécessite uniquement de modifier la configuration de la passerelle, le client ne perçoit aucun changement

<ApiGatewayDemo />

### 4.2 Fonctionnalités clés de la passerelle API

| Fonctionnalité         | Description                                       | Scénario typique                                         |
| :----------- | :----------------------------------------- | :----------------------------------------------- |
| **Routage et transfert** | Transférer les requêtes vers différents services selon les règles d'URL, de Header, etc. | `/api/users` → Service utilisateur, `/api/orders` → Service de commandes |
| **Équilibrage de charge** | Répartir le trafic entre plusieurs instances d'un même service              | Le service utilisateur a 3 instances, distribution par rotation                   |
| **Authentification et autorisation** | Validation unifiée des JWT, OAuth Token                   | Les utilisateurs non connectés ne peuvent pas accéder à `/api/admin`                   |
| **Limitation de débit et disjoncteur** | Contrôler le plafond de trafic, empêcher la surcharge du service                | Maximum 1000 requêtes par seconde, au-delà retour 429                     |
| **Conversion de protocole** | HTTP en externe, conversion possible vers gRPC en interne                      | Le client utilise HTTP, la passerelle convertit en gRPC pour appeler les services internes              |
| **Publication canari** | Selon les Headers ou les proportions, diriger une partie du trafic vers la nouvelle version        | 5 % des utilisateurs testent la nouvelle version, 95 % restent sur l'ancienne                     |
| **Journalisation et surveillance** | Enregistrement centralisé des journaux de requêtes, pour l'analyse et le dépannage            | Enregistrer la durée, le code de statut et la taille de la réponse de chaque requête             |

---

## 5. Pratique de la passerelle : comment construire une architecture de passerelle complète

### 5.1 Architecture complète

```
┌───────────────────────────────────────────────────────────────────────┐
│                           Client (navigateur/Application)                               │
└───────────────────────────┬─────────────────────────────────────────┘
                                │ HTTPS
                                ▼
┌───────────────────────────────────────────────────────────────────────┐
│                        Couche externe : CDN + WAF                                  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  CDN (Réseau de distribution de contenu)                                        │  │
│  │  - Cache des ressources statiques (images, CSS, JS)                           │  │
│  │  - Accès au plus près, réduction de la latence                                   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  WAF (Pare-feu d'application Web)                                     │  │
│  │  - Protection contre les injections SQL et les attaques XSS                                │  │
│  │  - Blocage des Bots malveillants et des crawlers                                  │  │
│  │  - Protection contre les attaques DDoS de couche applicative                              │  │
│  └───────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────────┐
│                     Couche intermédiaire : Passerelle API (Nginx/Kong)                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Première couche : Terminaison SSL + Protection de sécurité                              │  │
│  │  - HTTPS / TLS 1.3                                        │  │
│  │  - HSTS, en-têtes de réponse de sécurité                                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Deuxième couche : Authentification et autorisation                                      │  │
│  │  - Validation des JWT Token                                         │  │
│  │  - Intégration OAuth 2.0 / SSO                                     │  │
│  │  - Gestion des clés API                                         │  │
│  │  - Vérification des permissions (RBAC)                                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Troisième couche : Contrôle de trafic                                        │  │
│  │  - Limitation de débit - Algorithme à jetons/à fuite                             │  │
│  │  - Disjoncteur - Prévention de la propagation des pannes                                 │  │
│  │  - Dégradation - Solution de secours en cas d'indisponibilité du service                         │  │
│  │  - Publication canari - Répartition du trafic par proportion                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Quatrième couche : Routage et équilibrage de charge                                    │  │
│  │  - Routage par chemin                                    │  │
│  │  - Routage par domaine                           │  │
│  │  - Routage par Header                             │  │
│  │  - Algorithmes d'équilibrage de charge - Rotation/pondéré/connexions minimales/hachage IP)             │  │
│  │  - Intégration de la découverte de services                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Cinquième couche : Conversion de protocole et traitement des données                                 │  │
│  │  - Terminaison SSL - HTTPS ↔ HTTP)                                   │  │
│  │  - Conversion de protocole - HTTP ↔ gRPC / WebSocket)                         │  │
│  │  - Transformation requête/réponse - JSON ↔ XML)                               │  │
│  │  - Compression des données - Gzip / Brotli)                                   │  │
│  │  - Cache - Ressources statiques et réponses API                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────────┐
│                        Couche interne : Cluster de microservices                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │  Service     │ │  Service de  │ │  Service     │ │  Service de  │      │
│  │  utilisateur │ │  commandes   │ │  produits    │ │  paiement    │      │
│  │             │ │             │ │             │ │             │      │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘      │
│         │                │                │                │               │
│         └────────────────┴────────────────┴────────────────┘               │
│                                       │                              │
│                    Découverte de services et centre de configuration (Consul / etcd)                          │
│                    - Enregistrement et découverte de services                                      │
│                    - Contrôles de santé                                              │
│                    - Stockage de configuration KV                                              │
└───────────────────────────────────────────────────────────────────────┘
```

### 5.2 Routage et équilibrage de charge

L'une des responsabilités fondamentales de la passerelle est d'**acheminer les requêtes vers la bonne destination**. Cela implique deux capacités clés : le **routage** (vers quel serveur) et l'**équilibrage de charge** (comment répartir le trafic).

::: details Règles de routage : de l'URL au service
Imaginez un système e-commerce où différentes URL correspondent à différents services :

- `/api/users/*` → Service utilisateur
- `/api/orders/*` → Service de commandes
- `/api/products/*` → Service produits
- `/api/pay/*` → Service de paiement

**Exemple de configuration Nginx :**

```nginx
server {
    listen 80;
    server_name api.example.com;

    # Service utilisateur
    location /api/users/ {
        proxy_pass http://user-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Service de commandes
    location /api/orders/ {
        proxy_pass http://order-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Service produits
    location /api/products/ {
        proxy_pass http://product-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Service de paiement (nécessite un niveau de sécurité plus élevé)
    location /api/pay/ {
        # Restreindre l'accès par IP
        allow 10.0.0.0/8;
        deny all;

        proxy_pass http://payment-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

:::

::: details Équilibrage de charge : comparaison de quatre stratégies
Lorsqu'un même service a plusieurs instances, comment choisir ?

| Stratégie         | Principe                                              | Cas d'utilisation           | Avantages                 | Inconvénients                         |
| :----------- | :------------------------------------------------ | :----------------- | :------------------- | :--------------------------- |
| **Rotation**     | Répartir séquentiellement vers chaque serveur                        | Performances serveur similaires     | Simple et équitable             | Ne tient pas compte de la charge actuelle du serveur         |
| **Rotation pondérée** | Répartir selon les proportions de poids, les serveurs à poids élevé reçoivent plus                   | Performances serveur inégales     | Utilisation optimale des serveurs performants | Nécessite un paramétrage judicieux des poids             |
| **Connexions minimales** | Répartir vers le serveur ayant le moins de connexions actuelles                      | Connexions longues, streaming vidéo | Adaptation dynamique à la charge | Nécessite un comptage en temps réel des connexions           |
| **Hachage IP**   | Calculer un hachage à partir de l'IP client, une même IP est toujours assignée au même serveur | Besoin de persistance de session       | Garantit la cohérence de session       | Une IP à fort trafic crée une pression sur un seul point |

**Exemple de configuration Nginx :**

```nginx
# Rotation pondérée
upstream backend_weighted {
    server 10.0.1.10:8080 weight=3;  # Performances élevées, reçoit plus de trafic
    server 10.0.1.11:8080 weight=2;
    server 10.0.1.12:8080 weight=1;  # Performances faibles, reçoit moins de trafic
}

# Connexions minimales
upstream backend_least_conn {
    least_conn;
    server 10.0.1.10:8080;
    server 10.0.1.11:8080;
    server 10.0.1.12:8080;
}

# Hachage IP (persistance de session)
upstream backend_ip_hash {
    ip_hash;
    server 10.0.1.10:8080;
    server 10.0.1.11:8080;
    server 10.0.1.12:8080;
}
```

:::

<LoadBalancingDemo />

---

## 6. Sécurité de la passerelle : comment garder les portes du système

### 6.1 Authentification et autorisation

**Approche traditionnelle (chaque service fait sa propre authentification) :**

- Le service utilisateur, le service de commandes, le service de paiement... chacun doit valider les JWT
- Code dupliqué, maintenance difficile
- Les secrets sont dispersés entre les services, risque de fuite élevé

**Authentification unifiée via la passerelle :**

- Le client accède à la passerelle en présentant un Token
- La passerelle vérifie la validité du Token (signature, date d'expiration)
- Si la validation réussit, les informations utilisateur (par ex. user_id) sont ajoutées aux en-têtes de la requête et transmises aux services backend
- Les services backend n'ont pas besoin de valider, ils récupèrent directement les informations utilisateur depuis les Headers

::: tip L'idée fondamentale
**Authentification dans la passerelle, autorisation dans les services** :

- **Authentification** : Qui êtes-vous ? (validation du Token, obtention de l'identité de l'utilisateur)
- **Autorisation** : Que pouvez-vous faire ? (jugement des permissions selon le rôle de l'utilisateur)

Tout comme l'accueil d'une entreprise : le réceptionniste vérifie votre identité (pièce d'identité), mais les permissions spécifiques sont déterminées par chaque département.
:::

<AuthMiddlewareDemo />

### 6.2 HTTPS et terminaison SSL

**Pourquoi HTTPS ?**

1. **Sécurité** : empêcher l'interception des données pendant le transit
2. **Conformité** : les navigateurs modernes affichent un avertissement « Non sécurisé » pour les sites HTTP
3. **SEO** : les moteurs de recherche privilégient l'indexation des sites HTTPS

**Solution de terminaison SSL :**

- Configurer HTTPS et les certificats uniquement au niveau de la passerelle
- La passerelle gère la négociation TLS et le chiffrement/déchiffrement
- Entre la passerelle et les services backend, les communications transitent en HTTP en clair (le réseau interne est considéré comme sûr)
- Les services backend se concentrent sur la logique métier, sans avoir à gérer TLS

::: tip Avantages de la terminaison SSL

- **Gestion simplifiée** : certificats configurés uniquement dans la passerelle, pas besoin côté backend
- **Charge réduite** : les services backend n'ont pas à gérer la négociation TLS
- **Mise à jour centralisée** : le renouvellement des certificats se fait uniquement au niveau de la passerelle
  :::

<SslTerminationDemo />

---

## 7. Limitation de débit et disjoncteur : comment empêcher le système d'être submergé par un « déluge de trafic »

### 7.1 Comparaison des algorithmes de limitation de débit

| Algorithme         | Idée fondamentale                  | Trafic en rafale                    | Cas d'utilisation                       | Complexité d'implémentation |
| :----------- | :------------------------ | :-------------------------- | :----------------------------- | :--------- |
| **Seau à jetons**   | Le seau contient des jetons, une requête ne passe que s'il y a un jeton | Autorise un certain niveau de rafale          | Limitation d'API, contrôle de bande passante              | Moyenne       |
| **Seau à fuite**     | Les requêtes entrent dans le seau, sortent à débit constant     | Lissage forcé, les rafales sont mises en mémoire tampon ou rejetées | Scénarios nécessitant un traitement strictement régulier         | Moyenne       |
| **Fenêtre glissante** | Comptage des requêtes dans une fenêtre de temps    | Comptage strict par fenêtre, tout dépassement est rejeté | Comptage précis (par ex. « maximum 100 requêtes en 1 minute ») | Élevée       |

### 7.2 Configuration de limitation de débit Nginx en pratique

```nginx
# Définir les zones de limitation de débit (à placer dans le bloc http)

# 1. Limitation par IP (algorithme à seau percé)
# zone=mylimit:10m - nom de la zone et taille mémoire (10 Mo peut stocker environ 160 000 IP)
# rate=10r/s - 10 requêtes par seconde autorisées
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

# 2. Limitation du nombre de connexions par IP (empêcher une seule IP d'établir trop de connexions)
limit_conn_zone $binary_remote_addr zone=addr:10m;

# 3. Limitation par point de terminaison serveur (sans distinction d'IP, protection globale du backend)
limit_req_zone $server_name zone=server_limit:10m rate=100r/s;

server {
    listen 80;
    server_name api.example.com;

    # Service utilisateur - limitation standard
    location /api/users/ {
        # Appliquer la limitation de débit
        # burst=20 - capacité du seau, autorise 20 requêtes en rafale
        # nodelay - ne pas retarder le traitement des requêtes en rafale (traitement immédiat ou rejet)
        limit_req zone=mylimit burst=20 nodelay;

        # Limiter le nombre de connexions par IP
        limit_conn addr 10;

        proxy_pass http://user-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Service de commandes - limitation plus stricte
    location /api/orders/ {
        # Limitation plus stricte : 5 requêtes par seconde
        limit_req_zone $binary_remote_addr zone=order_limit:10m rate=5r/s;
        limit_req zone=order_limit burst=10 nodelay;

        proxy_pass http://order-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Traitement après limitation de débit
    # Lorsqu'une requête est limitée, retourner 429 Too Many Requests
    error_page 429 /429.html;
    location = /429.html {
        internal;
        return 429 '{"error": "Too Many Requests", "message": "Rate limit exceeded. Please try again later."}';
        add_header Content-Type application/json;
    }
}
```

::: tip Recommandations de stratégie de limitation de débit

- **Interfaces standard** : 10 requêtes par seconde, rafale de 20 autorisée
- **Interfaces critiques** (paiement, commandes) : 5 requêtes par seconde, rafale de 10 autorisée
- **Protection globale** : le total de toutes les requêtes ne doit pas dépasser 100 par seconde
  :::

<RateLimitingDemo />

### 7.3 Disjoncteur : prévenir la propagation des pannes

**Principe de fonctionnement du disjoncteur :**

1. **État fermé** : les requêtes sont transmises normalement, le taux d'erreur est suivi en parallèle
2. **État ouvert** : lorsque le taux d'erreur dépasse le seuil, le disjoncteur s'ouvre, les requêtes sont rejetées immédiatement sans être transmises
3. **État demi-ouvert** : après un certain délai, quelques requêtes sont autorisées à passer à titre de test ; si elles réussissent, le disjoncteur se ferme

::: tip L'idée fondamentale
**Le disjoncteur est comme un fusible électrique** : lorsque le courant est trop fort, le fusible fond automatiquement, protégeant l'ensemble du circuit contre la combustion.

De manière analogue, lorsque le service backend génère un grand nombre d'erreurs, le disjoncteur « déclenche », échouant rapidement pour empêcher la propagation de la panne à l'ensemble du système.
:::

---

## 8. Résumé : la philosophie fondamentale de la conception des passerelles

### 8.1 Rappel des principes fondamentaux

| Principe         | Signification                 | Points de pratique                       |
| ------------ | -------------------- | ------------------------------ |
| **Routage**     | Acheminer les requêtes vers la bonne destination | Routage par chemin, par domaine, par Header |
| **Équilibrage de charge** | Répartir le trafic entre plusieurs serveurs | Rotation, pondéré, connexions minimales, hachage IP   |
| **Sécurité**     | Garder les portes du système         | Authentification/autorisation, HTTPS, WAF           |
| **Limitation de débit**     | Empêcher le déluge de trafic       | Seau à jetons, seau percé, fenêtre glissante         |
| **Disjoncteur**     | Prévenir la propagation des pannes         | Échec rapide, solution de dégradation             |
| **Observabilité**   | Surveillance et dépannage           | Journaux, métriques, traçage distribué |

### 8.2 Recommandations de choix technologiques

::: tip Arbre de décision de sélection

```
Choisir une passerelle :
│
├─ Besoin uniquement de proxy inverse et d'équilibrage de charge ?
│  ├─ Oui → Nginx (choix recommandé)
│  └─ Non → Continuer
│
├─ Besoin d'un écosystème de plugins riche ?
│  ├─ Oui → Kong (basé sur Nginx)
│  └─ Non → Continuer
│
├─ Stack complète Spring Cloud ?
│  ├─ Oui → Spring Cloud Gateway
│  └─ Non → Nginx
```

:::

---

## 9. Glossaire

| Terme         | Anglais                     | Définition                                                                                                               |
| ------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **Proxy inverse** | Reverse Proxy            | Service proxy déployé côté serveur, recevant les requêtes des clients et les transmettant aux services internes. Le client ne connaît que le proxy inverse, pas l'adresse des serveurs réels.         |
| **Proxy direct** | Forward Proxy            | Service proxy déployé côté client, accédant aux ressources externes au nom du client. Le serveur voit l'IP du proxy, pas le vrai client. Application typique : VPN, outils de contournement. |
| **Passerelle API**  | API Gateway              | Couche intermédiaire entre le client et les services backend, fournissant des fonctions de routage, d'authentification, de limitation de débit et de journalisation. C'est la « porte d'entrée unifiée » des architectures microservices.                       |
| **Équilibrage de charge** | Load Balancing           | Répartition des requêtes entre plusieurs serveurs pour éviter la surcharge d'un seul serveur, améliorant la disponibilité et la performance du système.                                               |
| **Terminaison SSL**  | SSL Termination          | Traitement du chiffrement/déchiffrement HTTPS au niveau de la passerelle, les services backend utilisant HTTP, réduisant la charge de calcul côté backend et simplifiant la gestion des certificats.                                         |
| **Limitation de débit**     | Rate Limiting            | Limitation du nombre de requêtes par unité de temps pour empêcher le système d'être submergé par un trafic en rafale. Algorithmes courants : seau à jetons, seau percé, fenêtre glissante.                                 |
| **Disjoncteur**     | Circuit Breaking         | Coupure automatique des appels lorsqu'un service dépendant est en panne, empêchant la propagation de la panne et fournissant une solution de dégradation.                                                    |
| **Persistance de session** | Session Persistence      | Garantit que les requêtes d'un même client sont toujours routées vers le même serveur backend, pour les scénarios nécessitant le maintien de l'état de session.                                        |
| **Contrôle de santé** | Health Check             | Vérification périodique de l'état de santé des services backend, retrait automatique des nœuds défectueux, garantissant que le trafic n'est envoyé qu'aux instances saines.                                       |
| **Publication canari** | Canary Release           | Diriger un faible volume de trafic vers la nouvelle version, valider la stabilité puis augmenter progressivement la proportion, réduisant le risque de publication.                                                       |
| **WAF**      | Web Application Firewall | Pare-feu d'application Web, protégeant contre les injections SQL, XSS, attaques DDoS applicatives et autres menaces de sécurité Web.                                                              |
| **CDN**      | Content Delivery Network | Réseau de distribution de contenu, déployant des nœuds de périphérie dans le monde entier pour accélérer l'accès aux ressources statiques.                                                                 |
