# Principes : Protocole HTTP et communication Web

::: tip Question centrale
**Comment fonctionne HTTP ?** C'est comme demander : comment deux personnes dialoguent-elles ? Il faut convenir d'une langue, d'une syntaxe, de règles de conversation. HTTP est le "protocole de dialogue" entre le frontend et le backend.
:::

---

## 0. L'essence d'HTTP

**HTTP** (HyperText Transfer Protocol, protocole de transfert hypertexte) est le protocole fondamental de la communication entre le frontend et le backend.

### 0.1 Analogie avec une conversation

| Élément de conversation | Correspondance HTTP | Explication |
| :--- | :--- | :--- |
| Langue | Protocole HTTP | Un langage compréhensible par les deux parties |
| Syntaxe | Format requête/réponse | Comment "parler" |
| Flux | Modèle requête-réponse | Une question, une réponse |
| Fin | Raccrocher | Fermeture de la connexion TCP |

---

## 1. L'évolution d'HTTP

Depuis sa création en 1991, HTTP a connu plusieurs évolutions majeures.

<HttpProtocolDemo />

### 1.1 Comparaison des versions

| Version | Année | Amélioration clé | Caractéristique typique |
| :--- | :--- | :--- | :--- |
| **HTTP/0.9** | 1991 | Supporte uniquement GET | Texte brut, requêtes uniquement, pas d'en-tête de réponse |
| **HTTP/1.0** | 1996 | Ajout de POST/HEAD | Une connexion TCP par requête |
| **HTTP/1.1** | 1997 | Connexions persistantes | Keep-Alive, plusieurs requêtes sur une connexion |
| **HTTP/2** | 2015 | Multiplexage | Trames binaires, compression des en-têtes |
| **HTTP/3** | 2022 | Basé sur QUIC | Transport UDP, résout le blocage en tête de ligne |

::: tip Pourquoi HTTP/2 ?
HTTP/1.1 supporte les connexions persistantes, mais les requêtes doivent être envoyées séquentiellement (la réponse à la requête précédente doit être reçue avant d'envoyer la suivante). HTTP/2 résout ce problème par le multiplexage, permettant l'envoi simultané de plusieurs requêtes.
:::

---

## 2. Structure d'une requête HTTP

### 2.1 La ligne de requête

```http
GET /api/users/123 HTTP/1.1
```

Comprend trois parties :
- **Méthode** : GET, POST, PUT, DELETE, etc.
- **URL** : Chemin de la ressource demandée
- **Version** : HTTP/1.1 ou HTTP/2

### 2.2 Les en-têtes de requête

```http
Host: api.example.com
User-Agent: Mozilla/5.0
Accept: application/json
Authorization: Bearer xxx
Content-Type: application/json
Content-Length: 45
```

En-têtes courants :
| En-tête | Description | Exemple |
| :--- | :--- | :--- |
| **Host** | Nom de domaine du serveur | `api.example.com` |
| **User-Agent** | Informations sur le client | `Mozilla/5.0` |
| **Accept** | Type de réponse accepté | `application/json` |
| **Authorization** | Informations d'authentification | `Bearer token` |
| **Content-Type** | Type du corps de la requête | `application/json` |

### 2.3 Le corps de la requête

```json
{
  "name": "Zhang San",
  "email": "zhangsan@example.com"
}
```

Seules les méthodes POST, PUT, PATCH, etc. possèdent un corps de requête.

---

## 3. Structure d'une réponse HTTP

### 3.1 La ligne d'état

```http
HTTP/1.1 200 OK
```

Comprend trois parties :
- **Version** : HTTP/1.1
- **Code d'état** : 200, 404, 500, etc.
- **Texte d'état** : OK, Not Found, etc.

### 3.2 Les en-têtes de réponse

```http
Content-Type: application/json
Content-Length: 156
Cache-Control: max-age=3600
Set-Cookie: session=xxx; HttpOnly
```

En-têtes de réponse courants :
| En-tête | Description | Exemple |
| :--- | :--- | :--- |
| **Content-Type** | Type du corps de réponse | `application/json` |
| **Content-Length** | Taille du corps de réponse | `156` |
| **Cache-Control** | Stratégie de cache | `max-age=3600` |
| **Set-Cookie** | Définition d'un Cookie | `session=xxx` |

### 3.3 Le corps de la réponse

```json
{
  "code": 0,
  "data": {
    "id": 123,
    "name": "Zhang San"
  }
}
```

---

## 4. Méthodes HTTP en détail

| Méthode | Usage | Corps de requête | Idempotence | Sécurité |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | Récupérer une ressource | Non | Oui | Oui |
| **POST** | Créer une ressource | Oui | Non | Non |
| **PUT** | Mise à jour complète | Oui | Oui | Non |
| **PATCH** | Mise à jour partielle | Oui | Non | Non |
| **DELETE** | Supprimer une ressource | Non | Oui | Non |
| **HEAD** | Récupérer les en-têtes | Non | Oui | Oui |
| **OPTIONS** | Interroger les méthodes supportées | Non | Oui | Oui |

### 4.1 GET vs POST

| Caractéristique | GET | POST |
| :--- | :--- | :--- |
| **Position des paramètres** | Paramètres dans l'URL | Corps de la requête |
| **Cache** | Peut être mis en cache | Non mis en cache par défaut |
| **Favoris** | Peut être ajouté aux favoris | Non |
| **Historique** | Conservé dans l'historique du navigateur | Non conservé |
| **Longueur des données** | Limitée (longueur de l'URL) | Illimitée |
| **Sécurité** | Paramètres visibles dans l'URL | Paramètres dans le corps de la requête |

::: tip Quand utiliser GET/POST ?
- **GET** : interroger, récupérer des données
- **POST** : créer, soumettre des données
- **PUT** : mise à jour complète (remplacer toute la ressource)
- **PATCH** : mise à jour partielle (modifier uniquement les champs spécifiés)
- **DELETE** : supprimer une ressource
:::

---

## 5. Codes d'état HTTP

### 5.1 Catégories de codes d'état

| Catégorie | Description | Codes typiques |
| :--- | :--- | :--- |
| **2xx** | Succès | 200 OK, 201 Created, 204 No Content |
| **3xx** | Redirection | 301 permanent, 302 temporaire, 304 non modifié |
| **4xx** | Erreur client | 400 paramètre incorrect, 401 non authentifié, 404 inexistant |
| **5xx** | Erreur serveur | 500 erreur interne, 503 indisponible |

### 5.2 Codes d'état courants

| Code d'état | Signification | Scénario d'utilisation |
| :--- | :--- | :--- |
| **200 OK** | Requête réussie | Requête GET, PUT réussie |
| **201 Created** | Création réussie | Création de ressource via POST réussie |
| **204 No Content** | Pas de contenu | Suppression via DELETE réussie |
| **301 Moved Permanently** | Redirection permanente | Changement d'URL permanent |
| **302 Found** | Redirection temporaire | Changement d'URL temporaire |
| **304 Not Modified** | Non modifié | Cache valide |
| **400 Bad Request** | Paramètre incorrect | Format des paramètres de requête incorrect |
| **401 Unauthorized** | Non authentifié | Connexion requise |
| **403 Forbidden** | Accès interdit | Connecté mais droits insuffisants |
| **404 Not Found** | Inexistant | Ressource inexistante |
| **500 Internal Server Error** | Erreur interne | Anomalie du serveur |
| **503 Service Unavailable** | Indisponible | Serveur en maintenance ou surchargé |

---

## 6. HTTPS : un HTTP sécurisé

### 6.1 HTTP vs HTTPS

| Caractéristique | HTTP | HTTPS |
| :--- | :--- | :--- |
| **Protocole** | TCP | TCP + SSL/TLS |
| **Port** | 80 | 443 |
| **Données** | Transfert en clair | Transfert chiffré |
| **Certificat** | Non requis | Certificat SSL requis |
| **Performance** | Légèrement plus rapide | Légèrement plus lent (overhead de handshake) |
| **SEO** | Sans impact | Priorisé par les moteurs de recherche |

### 6.2 Fonctionnement de HTTPS

1. **Client Hello** : le client envoie les suites de chiffrement supportées
2. **Server Hello** : le serveur retourne le certificat et la suite de chiffrement sélectionnée
3. **Vérification du certificat** : le client vérifie la validité du certificat du serveur
4. **Échange de clés** : utilisation du chiffrement asymétrique pour échanger la clé de session
5. **Communication chiffrée** : utilisation de la clé de session pour la communication symétrique

::: tip Avantages de HTTPS
- **Protection contre l'écoute** : données chiffrées, les tiers ne peuvent pas les lire
- **Protection contre la modification** : vérification de l'intégrité des données
- **Protection contre l'usurpation** : le certificat SSL vérifie l'identité du serveur
:::

---

## 7. Mécanisme de cache HTTP

### 7.1 En-têtes de cache

| En-tête | Description | Exemple |
| :--- | :--- | :--- |
| **Cache-Control** | Stratégie de cache | `max-age=3600` |
| **ETag** | Version de la ressource | `"33a64df551425fcc"` |
| **Last-Modified** | Dernière modification | `Wed, 21 Oct 2015 07:28:00 GMT` |

### 7.2 Stratégies de cache

**Cache fort** :
```http
Cache-Control: max-age=3600
```
Pendant 3600 secondes, le navigateur utilise directement le cache, sans envoyer de requête.

**Cache négocié** :
```http
ETag: "33a64df551425fcc"
```
Le navigateur envoie `If-None-Match`, le serveur retourne 304 (non modifié) ou 200 (modifié).

---

## 8. Questions fréquentes

### 8.1 La vraie différence entre GET et POST

**Idée reçue** : la différence entre GET et POST se résume à la position des paramètres.

**La réalité** :
- GET est idempotent, plusieurs requêtes donnent le même résultat
- POST n'est pas idempotent, plusieurs requêtes peuvent créer plusieurs ressources
- GET peut être mis en cache, POST ne l'est pas par défaut
- GET peut être sauvegardé en favori, POST ne le peut pas

### 8.2 Le blocage en tête de ligne d'HTTP/1.1

**Problème** : HTTP/1.1 supporte les connexions persistantes, mais les requêtes doivent être envoyées séquentiellement. Si la réponse à une requête est lente, toutes les requêtes suivantes doivent attendre.

**Solutions** :
- Multiplexage HTTP/2
- Fragmentation de domaine (établir plusieurs connexions via plusieurs noms de domaine)
- Pool de connexions (limiter le nombre de connexions concurrentes)

### 8.3 Les avantages d'HTTP/2

| Caractéristique | HTTP/1.1 | HTTP/2 |
| :--- | :--- | :--- |
| **Format de transfert** | Texte | Trames binaires |
| **Multiplexage** | Non supporté | Supporté |
| **Compression des en-têtes** | Aucune | Algorithme HPACK |
| **Push serveur** | Non supporté | Supporté |

---

## Glossaire

| Terme | Anglais | Explication |
| :--- | :--- | :--- |
| **HTTP** | HyperText Transfer Protocol | Protocole de transfert hypertexte |
| **HTTPS** | HTTP Secure | HTTP + SSL/TLS |
| **TCP** | Transmission Control Protocol | Protocole de contrôle de transmission |
| **SSL/TLS** | Secure Sockets Layer | Couche de sockets sécurisés |
| **Idempotence** | Idempotent | Plusieurs requêtes donnent le même résultat |
| **Connexion persistante** | Keep-Alive | Une connexion TCP pour plusieurs requêtes |
| **Multiplexage** | Multiplexing | Envoi simultané de plusieurs requêtes |
| **Blocage en tête de ligne** | Head-of-Line Blocking | Les requêtes précédentes bloquent les suivantes |
