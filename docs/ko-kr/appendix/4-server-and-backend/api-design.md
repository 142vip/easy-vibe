# API 설계 원리

::: tip 🎯 핵심 질문
**프론트엔드와 백엔드가 어떻게 효율적으로 대화할 수 있을까?** 이건 마치 이런 질문과 같습니다: 레스토랑의 메뉴를 어떻게 디자인하면 손님이 한눈에 이해할 수 있을까? 웨이터는 어떻게 주문을 받아야 실수가 없을까? 음식 서빙은 어떻게 규범화하면 손님이 만족할까? API 설계가 해결하는 것은 바로 이 "대화 규칙"의 문제입니다.
:::

---

## 0. 먼저 한 가지 질문: 이런 악몽을 겪어본 적이 있나요

**상황 1: 인터페이스 명명이 제멋대로**

```
GET /getUserData
GET /fetchUserInfo
GET /queryUserById
GET /users/query
```

네 개의 인터페이스가 같은 기능을 하지만, 명명 스타일이 완전히 다릅니다. 신규 입사자는 당황: 어느 것을 써야 하죠?

**상황 2: 에러 처리가 제각각**

```json
// 어떤 곳은 HTTP 상태 코드 반환
HTTP/1.1 404 Not Found

// 어떤 곳은 200 + code
HTTP/1.1 200 OK
{ "code": 404, "message": "사용자가 존재하지 않습니다" }

// 어떤 곳은 그냥 예외 발생
HTTP/1.1 200 OK
{ "error": "오류가 발생했습니다" }
```

프론트엔드는 요청이 성공했는지 어떻게 판단해야 할지 모릅니다.

**상황 3: 응답 구조가 천차만별**

```json
// 인터페이스 A
{ "data": { ... } }

// 인터페이스 B
{ "result": { ... } }

// 인터페이스 C
{ "content": { ... } }
```

인터페이스마다 반환 형식이 다 달라서, 프론트엔드는 각 인터페이스별로 개별 처리를 해야 합니다.

---

**좋은 API 설계는 레스토랑의 주문 시스템과 같습니다** -- 메뉴가 명확하고, 프로세스가 규범화되어 있으며, 오류 시 안내가 있습니다.

---

## 1. API란 개요
**API**(Application Programming Interface, 애플리케이션 프로그래밍 인터페이스)는 "프로그램 간의 대화 약속"입니다.

### 1.1 레스토랑으로 비유하기

| 레스토랑 역할 | 해당 개념 | 설명 |
| :--- | :--- | :--- |
| 메뉴 | API 문서 | 어떤 "요리"를 주문할 수 있는지 알려줌 |
| 웨이터 | HTTP 프로토콜 | 표준화된 "대화 방식" |
| 주방 | 서버 | "주문"에 따라 요청 처리 |
| 서빙 | 응답 | 결과를 "손님"에게 반환 |

### 1.2 완전한 API 요청

👇 **직접 해보기**: 아래 버튼을 클릭하여 완전한 API 요청-응답 흐름을 관찰하세요:

<ApiRequestDemo />

---

## 2. API 설계 철학: RPC / REST / GraphQL / gRPC

구체적인 RESTful 설계를 시작하기 전에, 네 가지 주요 API 설계 스타일을 먼저 알아봅시다:

<ApiStyleCompare />

### 2.1 REST vs RESTful: 차이점은 비교
많은 사람들이 이 두 개념을 혼동합니다:

| 개념 | 의미 | 설명 |
| :--- | :--- | :--- |
| **REST** | 아키텍처 스타일 | Roy Fielding이 제안한 설계 이념, 일련의 제약 조건 포함 |
| **RESTful** | REST 스타일을 따르는 | 형용사로, API 설계가 REST 원칙을 따른다는 것을 나타냄 |

**비유**:
- REST는 "미니멀리즘"과 같습니다 -- 하나의 설계 이념
- RESTful API는 "미니멀 스타일의 방"과 같습니다 -- 이 이념을 적용한 구체적인 구현

**REST의 6대 제약 조건**:

| 제약 조건 | 설명 |
| :--- | :--- |
| **클라이언트-서버 분리** | 프론트엔드와 백엔드가 독립적으로 개발되며, 인터페이스가 결합도를 낮춤 |
| **무상태** | 각 요청은 모든 필요한 정보를 포함하며, 서버는 세션 상태를 저장하지 않음 |
| **캐시 가능** | 응답은 캐시 가능 여부를 표시해야 하며, 성능 향상 |
| **통일된 인터페이스** | 표준 HTTP 메서드와 상태 코드 사용 |
| **계층화된 시스템** | 클라이언트는 어떤 계층의 서버에 연결되어 있는지 알 필요가 없음 |
| **온디맨드 코드** (선택) | 서버가 클라이언트 기능을 확장할 수 있음 |

::: tip 💡 REST가 가장 많이 사용되는 이유는?
1. **학습 비용이 낮음**: HTTP 프로토콜 자체가 REST 사상을 구현하고 있음
2. **성숙한 생태계**: 도구, 프레임워크, 문서가 풍부함
3. **범용성이 높음**: 모든 언어, 모든 플랫폼에서 호출 가능
4. **캐시하기 쉬움**: GET 요청은 자연스럽게 캐시 가능, CDN 친화적
:::

---

## 3. RESTful 설계: URL이 말하게 하라

**REST**(Representational State Transfer)는 아키텍처 스타일로, 핵심 사상은:

- 네트워크상의 사물을 "리소스"(Resource)로 추상화
- URL로 리소스를 식별
- HTTP 메서드로 리소스를 조작

### 3.1 창고로 비유하기

| 창고 개념 | REST 대응 | 예시 |
| :--- | :--- | :--- |
| 선반 주소 | URL | `/users`, `/orders` |
| 조작 방식 | HTTP 메서드 | GET(조회), POST(입고) |
| 화물 | 리소스 | 사용자 데이터, 주문 데이터 |

**핵심 원칙**: URL은 명사, 동사가 아닙니다.

### 3.2 URL 설계 규칙

| 규칙 | 잘못된 예시 | 올바른 예시 | 설명 |
| :--- | :--- | :--- | :--- |
| 동사 대신 명사 사용 | `/getUsers` | `/users` | URL은 리소스를 나타내고, HTTP 메서드는 조작을 나타냄 |
| 복수형 사용 | `/user` | `/users` | 복수형 스타일 통일 |
| 소문자 + 하이픈 | `/UserProfiles` | `/user-profiles` | URL은 대소문자 구분 |
| 계층이 너무 깊은 것 피하기 | `/a/b/c/d/e` | `/a/b/c` | 최대 3계층 |
| 필터링은 쿼리 파라미터 사용 | `/products/phone/5000` | `/products?cat=phone` | 필터 조건은 `?` 파라미터 사용 |

::: tip 💡 URL 대소문자 구분
소문자 + 하이픈(-)을 통일해서 사용하는 것이 가장 안전한 방법으로, 대소문자 혼란과 밑줄 스타일 불일치 문제를 피할 수 있습니다.
:::

### 3.3 HTTP 메서드 선택

| 메서드 | 용도 | 멱등성 | 안전성 | 전형적 시나리오 |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | 리소스 조회 | 예 | 예 | 목록 조회, 상세 보기 |
| **POST** | 리소스 생성 | 아니오 | 아니오 | 사용자 추가, 주문 제출 |
| **PUT** | 전체 업데이트 | 예 | 아니오 | 전체 사용자 프로필 교체 |
| **PATCH** | 부분 업데이트 | 아니오 | 아니오 | 닉네임만 수정 |
| **DELETE** | 리소스 삭제 | 예 | 아니오 | 사용자 삭제, 주문 취소 |

::: tip 💡 멱등성이란?
**멱등성**: 여러 번 실행해도 결과가 같음.

- **멱등한 조작** (GET/PUT/DELETE): 10번 클릭해도 1번 클릭한 것과 결과가 같음
- **멱등하지 않은 조작** (POST): 10번 클릭하면 10개의 주문이 생성될 수 있음

**해결 방안**: POST 조작에 고유 ID 검증을 사용하여 중복 처리를 방지.
:::

---

## 4. 상태 코드: 에러가 "말하게" 하라

HTTP 상태 코드는 서버가 클라이언트에게 "무슨 일이 일어났는지" 알려주는 표준 방식입니다.

### 4.1 상태 코드 분류

| 분류 | 의미 | 전형적 상태 코드 |
| :--- | :--- | :--- |
| **2xx** | 성공 | 200 OK, 201 Created, 204 No Content |
| **3xx** | 리다이렉트 | 301 영구 이동, 304 수정되지 않음 |
| **4xx** | 클라이언트 오류 | 400 파라미터 오류, 401 인증되지 않음, 404 존재하지 않음 |
| **5xx** | 서버 오류 | 500 내부 오류, 503 서비스 불가 |

### 4.2 자주 사용하는 상태 코드 데모

👇 **직접 해보기**: 아래 버튼을 클릭하여 일반적인 상태 코드의 의미를 알아보세요:

<StatusCodeDemo />

---

## 5. 에러 처리: 우아하게 "거절"하기

좋은 에러 처리는 클라이언트가 "상태 코드만 보고도 무슨 일인지 알 수 있게" 하는 것이며, 추측하게 만드는 것이 아닙니다.

### 5.1 에러 처리의 "피해야 할 함정"

**함정 1: 모든 에러를 200으로 반환**

```json
// ❌ 잘못된 방법
HTTP/1.1 200 OK
{ "error": "오류가 발생했습니다" }
```

문제: 캐시 계층이 이 "성공" 응답을 캐시하고, 모니터링 시스템이 문제를 발견하지 못함.

**함정 2: 에러 메시지가 너무 모호함**

```json
// ❌ 잘못된 방법
HTTP/1.1 400 Bad Request
{ "message": "파라미터 오류" }
```

문제: 클라이언트는 어느 파라미터가 잘못되었는지, 왜 잘못되었는지 알 수 없음.

**함정 3: 민감한 정보 노출**

```json
// ❌ 위험한 방법
HTTP/1.1 500 Internal Server Error
{ "stack": "at UserService.login...", "sql": "SELECT * FROM..." }
```

위험: 코드 구조와 데이터베이스 쿼리가 노출되며, 공격자가 이 정보를 악용할 수 있음.

### 5.2 올바른 에러 처리 데모

👇 **직접 해보기**: "좋은" 에러 응답과 "나쁜" 에러 응답 설계를 비교해 보세요:

<ErrorHandlingDemo />

---

## 6. 버전 관리: API의 "하위 호환성"

### 6.1 버전 관리 도입 동기
시나리오: 앱에 100만 사용자가 있고, 주문 인터페이스를 수정해야 합니다.

**버전 관리를 하지 않으면**:
- 새 앱이 새 인터페이스 호출 → 정상
- 구 앱이 새 인터페이스 호출 → 필드 누락, 충돌!

**올바른 방법**:
- `/v1/orders` - 구 인터페이스, 구 앱을 계속 서비스
- `/v2/orders` - 새 인터페이스, 새 기능은 여기에

### 6.2 버전 관리 전략

| 전략 | 예시 | 장점 | 단점 |
| :--- | :--- | :--- | :--- |
| **URL 경로** | `/v1/users` | 직관적, 캐시하기 쉬움 | URL이 길어짐 |
| **요청 헤더** | `Accept: vnd.api.v2+json` | URL이 깔끔함 | 디버깅 불편 |
| **쿼리 파라미터** | `/users?version=2` | 간단함 | 표준적이지 않음 |

### 6.3 버전 진화 예시

사용자 인터페이스를 예로 들어, v1에서 v2로의 진화를 보여줍니다:

| 인터페이스 | v1 (구버전) | v2 (신버전) | 변경 설명 |
| :--- | :--- | :--- | :--- |
| **사용자 조회** | `GET /v1/users`<br>반환: `name, email` | `GET /v2/users`<br>반환: `name, email, avatar, phone` | 아바타, 전화번호 필드 추가 |
| **주문 생성** | `POST /v1/orders`<br>수신: `items[]` | `POST /v2/orders`<br>수신: `items[], coupons[]` | 쿠폰 지원 추가 |
| **배치 조작** | 없음 | `POST /v2/orders/batch` | 배치 생성 인터페이스 추가 |

::: tip 💡 버전 관리 모범 사례
- **하위 호환성 유지**: v1 인터페이스는 최소 6-12개월 유지, 클라이언트에 업그레이드 시간 부여
- **문서 동기화 업데이트**: 각 버전마다 독립적인 API 문서 존재
- **폐지 공지**: v1이 언제 종료되는지 미리 알리고, 마이그레이션 안내
- **사용 현황 모니터링**: v1 호출량을 통계하여 안전하게 서비스를 종료할 수 있는지 확인
:::

---

## 7. 응답 구조 설계

응답 구조는 프론트엔드와 백엔드 협업의 "데이터 계약"이며, 통일된 형식은 소통 비용을 크게 줄일 수 있습니다.

<ResponseStructureDemo />

### 7.1 대기업 실천 참고

::: details Google API 설계 가이드
참고 [Google API Design Guide](https://cloud.google.com/apis/design/errors), Google은 모든 API 에러 응답에 `google.rpc.Status` 메시지 구조를 포함하도록 요구합니다:

```json
{
  "error": {
    "code": 429,
    "message": "리소스가 부족합니다. 나중에 다시 시도해 주세요",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.ErrorInfo",
        "reason": "RESOURCE_AVAILABILITY",
        "domain": "compute.googleapis.com",
        "metadata": {
          "zone": "us-east1-a",
          "service": "compute"
        }
      }
    ]
  }
}
```

**핵심 요구사항**:
- 기계가 읽을 수 있는 에러 식별자를 제공하는 `ErrorInfo` 포함 필수
- `message`는 개발자를 위한 것으로, 간결한 언어로 문제와 해결 방법 설명
- `details` 배열에는 `LocalizedMessage`(현지화 메시지), `Help`(도움말 링크) 등 포함 가능
:::

::: details Microsoft REST API 가이드
참고 [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md), Microsoft는 응답의 일관성을 강조합니다:

**에러와 장애의 분류**:
- **에러 (Error)**: 클라이언트가 유효하지 않은 데이터를 전달하여 발생, 4xx 반환, API 가용성에 영향 없음
- **장애 (Fault)**: 서버가 유효한 요청에 올바르게 응답할 수 없음, 5xx 반환, API 가용성에 영향

**응답 헤더 규범**:
- `Date`: 필수 반환, RFC 5322 형식 사용 (GMT 시간대)
- `Content-Type`: 필수 반환
- `ETag`: 낙관적 동시성 제어를 지원하는 리소스는 필수 반환
:::

::: details 알리바바 Java 개발 매뉴얼
참고 [알리바바 Java 개발 매뉴얼](https://developer.aliyun.com/special/tech-java), 알리바바의 API 응답 규범:

**통일 반환 객체**:
```java
public class Result<T> {
    private Integer code;
    private String message;
    private T data;
    private String requestId;
}
```

**에러 코드 구간 설계**:
| 범위 | 유형 | 예시 |
| :--- | :--- | :--- |
| 0 | 성공 | 0 |
| 1xxxx | 파라미터 오류 | 10001 필수 파라미터 누락 |
| 2xxxx | 비즈니스 오류 | 20001 잔액 부족 |
| 3xxxx | 인증 오류 | 30001 로그인되지 않음 |
| 5xxxx | 시스템 오류 | 50001 데이터베이스 예외 |
:::

::: details Stripe API 응답 설계
참고 [Stripe API Documentation](https://docs.stripe.com/api/errors), Stripe의 에러 응답 설계는 매우 정교합니다:

```json
{
  "error": {
    "type": "card_error",
    "code": "card_declined",
    "message": "Your card was declined.",
    "param": "number",
    "decline_code": "insufficient_funds",
    "doc_url": "https://stripe.com/docs/error-codes/card-declined"
  }
}
```

**설계 하이라이트**:
- `type`으로 에러 유형 구분: `api_error`, `card_error`, `invalid_request_error`
- `param`은 구체적으로 어느 파라미터가 잘못되었는지 지적하며, 프론트엔드에서 폼 필드를 직접 찾을 수 있음
- `doc_url`은 문서 링크를 제공하여, 개발자가 자세히 알아볼 수 있음
- `decline_code`는 더 세분화된 에러 원인 제공
:::

::: details JSON:API 사양
참고 [JSON:API Specification](https://jsonapi.org/format/), 업계에서 널리 채택된 JSON API 응답 사양:

```json
{
  "data": {
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "JSON:API 사양 상세 해설"
    },
    "relationships": {
      "author": {
        "data": { "type": "users", "id": "9" }
      }
    }
  },
  "included": [
    {
      "type": "users",
      "id": "9",
      "attributes": {
        "name": "홍길동"
      }
    }
  ]
}
```

**핵심 설계**:
- `data`는 메인 리소스를 포함하며, 반드시 `type`과 `id`가 있어야 함
- `attributes`에 리소스 속성 저장
- `relationships`은 리소스 연관 관계 설명
- `included`는 중복 요청을 피하고, 연관 데이터를 한 번에 반환
:::

::: details GitHub REST API 응답 설계
참고 [GitHub REST API Documentation](https://docs.github.com/en/rest), GitHub의 응답 설계는 개발자 경험을 중시합니다:

**성공 응답**:
```json
{
  "id": 1296269,
  "node_id": "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
  "name": "Hello-World",
  "full_name": "octocat/Hello-World",
  "owner": {
    "login": "octocat",
    "id": 1,
    "avatar_url": "https://github.com/images/error/octocat_happy.gif"
  },
  "private": false,
  "html_url": "https://github.com/octocat/Hello-World"
}
```

**에러 응답**:
```json
{
  "message": "Bad credentials",
  "documentation_url": "https://docs.github.com/rest"
}
```

**설계 하이라이트**:
- 응답에 다양한 URL 형식 포함 (`html_url`, `url`)으로 다양한 시나리오에서 사용 편의
- 에러 응답에 `documentation_url` 포함하여 문서를 가리킴
- `Link` 응답 헤더를 사용한 페이지네이션 네비게이션 구현
:::

::: details Twitter/X API v2 응답 설계
참고 [Twitter API v2 Documentation](https://developer.twitter.com/en/docs/twitter-api), Twitter API v2는 간결한 응답 형식을 채택:

```json
{
  "data": {
    "id": "1460323737035677698",
    "text": "Hello, Twitter!"
  },
  "includes": {
    "users": [
      {
        "id": "2244994945",
        "name": "Twitter Dev",
        "username": "TwitterDev"
      }
    ]
  }
}
```

**설계 하이라이트**:
- `data`는 메인 데이터를 포함하고, `includes`는 연관 데이터를 포함 (JSON:API와 유사)
- 필드 선택 지원: `?tweet.fields=created_at,public_metrics`
- 페이지네이션에 `next_token`과 `previous_token` 사용
:::

### 7.2 모범 사례 요약

위 규범들을 종합하면, 응답 구조 설계는 다음 원칙을 따라야 합니다:

1. **일관성 우선**: 모든 인터페이스가 동일한 응답 구조를 사용하며, 프론트엔드는 요청 계층을 통일하여 캡슐화 가능
2. **기계 가독성**: 에러 코드 + 에러 원인(reason)으로 프로그램이 자동 처리 가능
3. **인간 친화적**: message가 명확하게 설명하며, 해결 제안 포함
4. **추적 가능**: request_id가 요청 전체 링크에 걸쳐 존재하여, 문제 파악 용이
5. **국제화 지원**: details를 통한 현지화 메시지 확장

### 7.3 data 필드 설계 규범

`data`는 응답의 핵심으로, 그 설계는 프론트엔드 개발 효율에 직접적인 영향을 미칩니다.

<DataFieldDesignDemo />

### 7.4 에러 응답 설계 심화

<ErrorResponseDesignDemo />

::: tip 참고 링크
- [Google API Design Guide - Errors](https://cloud.google.com/apis/design/errors)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)
- [알리바바 Java 개발 매뉴얼](https://developer.aliyun.com/special/tech-java)
- [Heroku HTTP API Design Guide](https://github.com/interagent/http-api-design)
- [Stripe API - Errors](https://docs.stripe.com/api/errors)
- [JSON:API Specification](https://jsonapi.org/format/)
:::

---

## 8. 실전: 전자상거래 시스템 API 설계 예시

```
# 사용자 모듈
GET    /v1/users                    # 사용자 목록 조회
POST   /v1/users                    # 새 사용자 생성
GET    /v1/users/{id}               # 사용자 상세 조회
PUT    /v1/users/{id}               # 사용자 전체 업데이트
PATCH  /v1/users/{id}               # 사용자 부분 업데이트
DELETE /v1/users/{id}               # 사용자 삭제

# 주문 모듈
GET    /v1/users/{id}/orders        # 특정 사용자의 주문 조회
POST   /v1/orders                   # 주문 생성
GET    /v1/orders/{id}              # 주문 상세 조회
PATCH  /v1/orders/{id}/status       # 주문 상태 업데이트

# 상품 모듈 (복잡한 필터링은 쿼리 파라미터 사용)
GET    /v1/products?category=phone&price_max=5000&sort=price_desc&page=1
```

---

## 9. AI로 API 설계 보조하기

AI는 규범에 맞는 API 설계를 빠르게 생성하는 데 도움을 줄 수 있습니다. 핵심은 명확한 컨텍스트와 제약 조건을 제공하는 것입니다.

### 9.1 프롬프트 템플릿

```
당신은 숙련된 백엔드 아키텍트로, RESTful API 설계에 정통합니다. API 인터페이스 세트를 설계해 주세요.

## 비즈니스 배경
[비즈니스 시나리오 설명, 예: 전자상거래 시스템, 블로그 플랫폼, 작업 관리 등]

## 기능 요구사항
[필요한 기능 모듈 나열, 예:
- 사용자 관리: 회원가입, 로그인, 개인정보
- 주문 관리: 주문 생성, 주문 조회, 주문 취소
- 상품 관리: 상품 목록, 상품 상세, 검색]

## 설계 요구사항
1. RESTful 규범 준수
2. URL은 명사 복수형 사용, 소문자 + 하이픈
3. HTTP 메서드 올바르게 사용 (GET/POST/PUT/PATCH/DELETE)
4. 통일된 응답 형식: { code, message, data, request_id }
5. 합리적인 상태 코드 사용
6. 버전 관리: URL 경로 방식 (/v1/)

## 출력 형식
다음 형식으로 출력해 주세요:

### 인터페이스 목록
| 메서드 | URL | 설명 | 요청 본문 | 응답 본문 |
|------|-----|------|--------|--------|

### 요청/응답 예시
[핵심 인터페이스의 상세 예시]

### 상태 코드 설명
[사용된 상태 코드 및 의미]
```

### 9.2 실전 예시: 전자상거래 주문 API

**입력 프롬프트**:

```
당신은 숙련된 백엔드 아키텍트로, RESTful API 설계에 정통합니다. 전자상거래 주문 시스템의 API 인터페이스 세트를 설계해 주세요.

## 비즈니스 배경
B2C 전자상거래 플랫폼으로, 사용자가 상품을 탐색하고 주문하여 구매하며, 주문 상태를 조회할 수 있습니다.

## 기능 요구사항
- 주문 모듈: 주문 생성, 주문 목록 조회, 주문 상세 조회, 주문 취소, 주문 결제
- 장바구니 모듈: 상품 추가, 수량 수정, 상품 삭제, 장바구니 조회

## 설계 요구사항
1. RESTful 규범 준수
2. URL은 명사 복수형 사용, 소문자 + 하이픈
3. HTTP 메서드 올바르게 사용
4. 통일된 응답 형식
5. 버전 관리: /v1/
```

**AI 출력 예시**:

| 메서드 | URL | 설명 |
| :--- | :--- | :--- |
| `POST` | `/v1/orders` | 주문 생성 |
| `GET` | `/v1/orders` | 주문 목록 조회 |
| `GET` | `/v1/orders/{id}` | 주문 상세 조회 |
| `PATCH` | `/v1/orders/{id}/status` | 주문 상태 업데이트 (취소/결제) |
| `GET` | `/v1/users/{id}/cart` | 장바구니 조회 |
| `POST` | `/v1/users/{id}/cart/items` | 장바구니에 상품 추가 |
| `PATCH` | `/v1/users/{id}/cart/items/{itemId}` | 장바구니 상품 수량 수정 |
| `DELETE` | `/v1/users/{id}/cart/items/{itemId}` | 장바구니 상품 삭제 |

### 9.3 AI 보조 설계 시 주의사항

| 주의점 | 설명 |
| :--- | :--- |
| **완전한 컨텍스트 제공** | 비즈니스 배경, 사용자 역할, 데이터 관계를 명확히 설명 |
| **제약 조건 명확화** | 명명 규범, 버전 전략, 응답 형식 등을 미리 정의 |
| **반복 최적화** | 첫 번째 출력이 완벽하지 않을 수 있으므로, 세부사항을追问하고 수정 요청 |
| **수동 검토** | AI가 생성한 내용은 비즈니스 요구사항에 부합하는지 수동 확인 필요 |
| **엣지 케이스 보완** | AI에게 에러 처리, 권한 제어, 페이지네이션 등 엣지 케이스를 고려하도록 요청 |

::: tip 💡 追问 기법
- "각 인터페이스의 에러 응답 예시를 보완해 주세요"
- "페이지네이션, 정렬, 필터 파라미터를 고려해 주세요"
- "인터페이스의 권한 제어 설명을 추가해 주세요"
- "RESTful 모범 사례에 부합하는지 확인해 주세요"
:::

---

## 용어 빠른 참조표

| 용어 | 영어 | 설명 |
| :--- | :--- | :--- |
| **API** | Application Programming Interface | 프로그램 간의 대화 약속 |
| **REST** | Representational State Transfer | URL로 리소스를 식별하는 아키텍처 스타일 |
| **리소스** | Resource | REST 아키텍처의 핵심 개념으로, 고유 식별자(URL)를 가짐 |
| **멱등성** | Idempotency | 여러 번 실행해도 결과가 같음 |
| **상태 코드** | Status Code | HTTP 프로토콜에서 정의된 응답 상태 |
| **버전 관리** | Versioning | 새로운 API와 기존 API가 공존하며, 원활한 업그레이드 지원 |
| **요청 본문** | Request Body | POST/PUT/PATCH 요청이 전달하는 데이터 |
| **응답 본문** | Response Body | 서버가 반환하는 데이터 |
| **Header** | Header | 요청/응답의 메타데이터 (예: Content-Type) |
| **인증** | Authentication | "당신이 누구인지" 확인 (로그인, Token) |
| **인가** | Authorization | "당신이 무엇을 할 수 있는지" 확인 (권한) |
