# 직렬화 원리

::: tip 🎯 핵심 질문
**데이터는 어떻게 네트워크를 통해 전송될까?** 마치 한 사람의 말을 다른 사람이 어떻게 이해할 수 있는지 묻는 것과 같습니다. 직렬화는 바로 "데이터 번역" 문제를 해결합니다——메모리 속 객체를 전송 가능한 형식으로 번역하는 것입니다.
:::

---

## 직렬화 데이터의 필요성

프론트엔드와 백엔드가 상호작용하는 과정에서 데이터는 여러 번 "변형"을 거쳐야 서버에서 클라이언트로 전달됩니다.

**시나리오 1: 프론트엔드가 받은 데이터가 "변했다"**

```javascript
// 백엔드 전송
Date birth = new Date(1990, 5, 15)

// 프론트엔드 수신
{ "birth": "1990-06-15T00:00:00Z" }  // 문자열이다!
```

프론트엔드에서 `.getFullYear()`를 사용하려 했더니 오류가 발생했습니다——왜냐하면 이것은 Date 객체가 아니라 문자열이기 때문입니다.

**시나리오 2: 한글 깨짐**

```json
// 기대
{ "name": "홍길동" }

// 실제 수신
{ "name": "í ™ê¸¸ë ™" }
```

문자 인코딩 문제로 한글이 깨져서 표시됩니다.

**시나리오 3: 성능 병목**

```json
// 10,000개 상품 리스트를 포함한 응답
{
  "products": [
    { "id": 1, "name": "...", "description": "...", ... },
    // ... 9999 more
  ]
}
// 크기: 5.2 MB, 전송 시간: 3.5초
```

JSON 형식의 중복성으로 인해 데이터 패킷이 너무 커져 성능에 심각한 영향을 미칩니다.

---

**직렬화는 마치 "번역"과 같습니다**——메모리 객체를 전송 가능한 형식으로 "번역"하고, 수신 측에서 다시 "번역"하여 되돌립니다.

---

## 1. 직렬화/역직렬화 개요
**직렬화**(Serialization)는 객체를 전송 가능한 형식으로 변환하는 과정입니다.

**역직렬화**(Deserialization)는 전송 형식을 다시 객체로 복원하는 과정입니다.

### 1.1 빌드 산출물 발송에 비유하기

| 택배 발송 | 직렬화 | 설명 |
| :--- | :--- | :--- |
| 물품 포장 | 직렬화 | 물건을 상자에 넣고 라벨 부착 |
| 운송 | 네트워크 전송 | 택배 차량이 목적지까지 운송 |
| 포장 해체 및 물품 꺼내기 | 역직렬화 | 수령인이 상자를 열고 물건을 꺼냄 |

### 1.2 직렬화 도입 동기
| 이유 | 설명 | 예시 |
| :--- | :--- | :--- |
| **네트워크 전송** | 네트워크는 바이트 스트림만 전송 가능 | API 호출, RPC 통신 |
| **영속적 저장** | 디스크는 바이트만 저장 가능 | 객체를 파일, 데이터베이스에 저장 |
| **크로스 언어** | 각 언어의 데이터 구조가 다름 | Java 객체 → Python 사전 |
| **분산 캐시** | Redis/Memcached는 바이트 저장 | 사용자 정보 캐싱 |

---

## 2. 일반적인 직렬화 형식

👇 **직접 사용해 보세요**: 아래 버튼을 클릭하여 다양한 언어의 직렬화 과정을 관찰하세요:

<SerializationDemo />

### 2.1 JSON: 가장 범용적

**장점**:
- 가독성 우수, 디버깅 편리
- 모든 언어 지원
- 브라우저 네이티브 지원(`JSON.parse` / `JSON.stringify`)

**단점**:
- 용량이 큼(`{}` `""` 마크가 많음)
- 풍부한 데이터 타입 미지원(Date, Map, Set은 문자열로 변환됨)

**적용 시나리오**:
- 공개 API
- 프론트엔드-백엔드 통신
- 설정 파일

### 2.2 XML: 한때 주류였던

```xml
<?xml version="1.0" encoding="UTF-8"?>
<user>
  <id>123</id>
  <name>홍길동</name>
  <email>hong@example.com</email>
  <age>28</age>
</user>
```

**장점**:
- 구조가 명확하고 주석 지원
- 복잡한 중첩 구조 지원
- Schema 검증(XSD) 가능

**단점**:
- 용량이 크고 파싱이 느림
- 태그 중복(`<open></close>`)

**적용 시나리오**:
- 설정 파일(Spring, MyBatis)
- SOAP 프로토콜
- 복잡한 데이터 교환

### 2.3 Protobuf: 가장 효율적

```protobuf
// user.proto
syntax = "proto3";
message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
  int32 age = 4;
}
```

**장점**:
- 용량이 작음(JSON보다 30-50% 작음)
- 속도가 빠름(파싱 속도 5-10배 빠름)
- 하위 호환성(새 필드 추가가 이전 버전에 영향 없음)

**단점**:
- 읽을 수 없음(바이너리 형식)
- .proto 파일 정의 필요
- 동적 타입 미지원

**적용 시나리오**:
- 마이크로서비스 내부 통신
- 고성능 시나리오(게임, 실시간 통신)
- 모바일 앱(트래픽 절약)

### 2.4 MessagePack: 가독성과 성능 모두 고려

```json
// MessagePack은 JSON의 바이너리 버전
// 동일 데이터, MessagePack이 JSON보다 약 30% 작음
```

**장점**:
- JSON보다 작고 빠름
- JSON의 데이터 모델 유지
- 모든 JSON 타입 지원

**단점**:
- 읽을 수 없음
- Protobuf만큼 효율적이지 않음

**적용 시나리오**:
- 성능이 필요하지만 Protobuf를 사용하고 싶지 않을 때
- Redis 캐시
- WebSocket 메시지

---

## 3. 각 언어별 직렬화 방식 비교

| 언어 | JSON 라이브러리 | Protobuf 라이브러리 | XML 라이브러리 |
| :--- | :--- | :--- | :--- |
| **JavaScript** | `JSON.stringify()` | `protobuf.js` | `fast-xml-parser` |
| **Python** | `json.dumps()` | `protobuf` | `xmltodict` |
| **Java** | `Jackson` / `Gson` | `protobuf-java` | `JAXB` |
| **Go** | `encoding/json` | `proto` | `encoding/xml` |
| **C++** | `nlohmann/json` | `protobuf` | `tinyxml2` |
| **C#** | `System.Text.Json` | `Google.Protobuf` | `System.Xml` |

::: tip 💡 선택 제안
- **프론트엔드-백엔드 통신**: JSON(디버깅 편리)
- **마이크로서비스 내부**: Protobuf(성능 최적)
- **설정 파일**: JSON 또는 YAML
- **레거시 시스템 연동**: XML(선택의 여지가 없을 수 있음)
:::

---

## 4. 성능 비교

### 4.1 크기 비교(사용자 객체 예시)

| 형식 | 크기 | JSON 대비 |
| :--- | :--- | :--- |
| JSON | 68 bytes | 100% |
| XML | 142 bytes | 209% |
| Protobuf | 38 bytes | 56% |
| MessagePack | 52 bytes | 76% |

### 4.2 속도 비교(10,000회 직렬화)

| 형식 | 소요 시간 | JSON 대비 |
| :--- | :--- | :--- |
| JSON | 45 ms | 100% |
| XML | 120 ms | 267% |
| Protobuf | 8 ms | 18% |
| MessagePack | 28 ms | 62% |

::: tip 💡 성능 테스트 결론
- **Protobuf가 가장 빠름**: 고성능 시나리오에 적합
- **MessagePack이 그 다음**: JSON보다 약 40% 빠름
- **JSON이 가장 느림**: 하지만 대부분의 시나리오에서 충분
:::

---

## 5. 자주 발생하는 문제

### 5.1 날짜 직렬화 문제

**문제**: Date 객체 직렬화 후 문자열로 변환됨

```javascript
// 직렬화 전
const date = new Date('2024-01-01')

// 직렬화 후
JSON.stringify(date)  // "2024-01-01T00:00:00.000Z"
```

**해결책**:
```javascript
// 방안 1: 타임스탬프로 변환
{ createdAt: date.getTime() }  // 1704067200000

// 방안 2: ISO 문자열로 변환
{ createdAt: date.toISOString() }  // "2024-01-01T00:00:00.000Z"

// 방안 3: 커스텀 직렬화
JSON.stringify(obj, (key, value) => {
  if (value instanceof Date) {
    return { __type: 'Date', value: value.toISOString() }
  }
  return value
})
```

### 5.2 순환 참조 문제

**문제**: 객체 순환 참조 시 오류 발생

```javascript
const obj = { name: 'test' }
obj.self = obj
JSON.stringify(obj)  // TypeError: Converting circular structure to JSON
```

**해결책**:
```javascript
// 방안 1: 순환 참조 필터링
const seen = new WeakSet()
JSON.stringify(obj, (key, value) => {
  if (typeof value === 'object' && value !== null) {
    if (seen.has(value)) return
    seen.add(value)
  }
  return value
})

// 방안 2: flatted 라이브러리 사용
import { parse, stringify } from 'flatted'
stringify(obj)  // 순환 참조 자동 처리
```

### 5.3 한글 깨빌드 산출물 문제

**문제**: 한글 직렬화 후 깨짐

**원인**:
- 문자 인코딩 불일치(UTF-8 vs EUC-KR)
- BOM 마크

**해결책**:
```python
# Python UTF-8 사용 보장
import json
json.dumps(data, ensure_ascii=False)  # 한글 이스케이프 안 함
```

```javascript
// Node.js 응답 헤더 설정
res.setHeader('Content-Type', 'application/json; charset=utf-8')
```

---

## 6. 실전: 전자상거래 시스템 직렬화 방안

### 6.1 시나리오 분석

| 시나리오 | 형식 선택 | 이유 |
| :--- | :--- | :--- |
| **App → 백엔드 API** | JSON | 디버깅 편리, 프론트엔드-백엔드 통일 |
| **백엔드 → 백엔드 RPC** | Protobuf | 성능 최적, 트래픽 절약 |
| **Redis에 캐싱** | MessagePack | JSON보다 작고 복잡한 객체 직렬화 가능 |
| **로그 기록** | JSON | 로그 분석 도구 파싱 용이 |

### 6.2 코드 예시

```javascript
// API 응답(JSON)
app.get('/api/products/:id', async (req, res) => {
  const product = await db.getProduct(req.params.id)
  res.json({
    code: 0,
    data: product
  })
})

// 마이크로서비스 통신(Protobuf)
// product.proto
syntax = "proto3";
message Product {
  int32 id = 1;
  string name = 2;
  int32 price = 3;
}

// 서버 측
const proto = require('./product.proto')
const message = proto.Product.create(product)
const buffer = proto.Product.encode(message).finish()

// 클라이언트 측
const decoded = proto.Product.decode(buffer)

// Redis 캐시(MessagePack)
const msgpack = require('msgpack-lite')
await redis.set(
  `product:${id}`,
  msgpack.encode(product)
)
const cached = msgpack.decode(await redis.get(`product:${id}`))
```

---

## 7. AI를 활용한 직렬화 방안 선택

AI는 시나리오에 따라 적절한 직렬화 형식을 선택하는 데 도움을 줄 수 있습니다.

### 7.1 프롬프트 템플릿

```
당신은 시니어 시스템 아키텍트로서 데이터 직렬화 기술에 정통합니다. 적절한 직렬화 방안을 선택해 주세요.

## 비즈니스 시나리오
[시나리오 설명, 예: 전자상거래 앱, 게임 백엔드, 마이크로서비스 등]

## 기술 요구사항
[제약 조건 나열, 예:
- 프론트엔드-백엔드 분리(Vue + Node.js)
- 높은 성능 요구(QPS > 10000)
- 트래픽 민감(모바일, 트래픽 절약 필요)
- 크로스 언어 필요(Java + Python + Go)]

## 데이터 특징
[데이터 특징 설명, 예:
- 데이터 양이 큼(단일 응답 > 1MB)
- 구조가 복잡(다층 중첩)
- 날짜, 바이너리 데이터 등 특수 타입 포함]

## 출력 형식
다음 형식으로 출력:
1. 추천 방안(JSON/Protobuf/MessagePack/XML)
2. 이유
3. 성능 비교(예상 크기와 속도)
4. 코드 예시
```

### 7.2 실전 예시

**입력 프롬프트**:

```
당신은 시니어 시스템 아키텍트입니다. 우리 전자상거래 앱의 상품 리스트 API 성능을 최적화해야 합니다.

## 비즈니스 시나리오
- 전자상거래 앱의 상품 리스트 API
- 단일 응답에 100개 상품 반환
- 각 상품은 id, name, price, image, description 등 20개 필드 포함
- 현재 JSON 사용, 응답 크기 약 200KB, 소요 시간 800ms

## 기술 요구사항
- 프론트엔드는 Vue.js
- 백엔드는 Node.js + Go 마이크로서비스
- 성능과 개발 효율성 모두 고려 필요

## 최적화 목표
- 응답 시간 300ms 이내로 단축
- 데이터 패킷 크기 30% 감소
```

**AI 출력**:

```
추천 방안: 하이브리드 방안

1. **API 계층**: JSON 계속 사용(프론트엔드 친화적)
2. **마이크로서비스 통신**: Protobuf로 전환(성능 향상)
3. **정적 데이터**: gzip 압축 활성화

### 이유
- JSON은 프론트엔드에 가장 친화적이며 추가 파싱 불필요
- 백엔드 마이크로서비스에 Protobuf 사용 시 데이터 양 40% 감소
- gzip 압축은 텍스트에 효과 뚜렷(JSON 70% 압축 가능)

### 성능 비교
| 방안 | 크기 | 소요 시간 |
|------|------|------|
| 현재(JSON) | 200 KB | 800 ms |
| + gzip | 60 KB | 350 ms |
| + Protobuf | 50 KB | 280 ms |

### 코드 예시
[구체적 구현 코드...]
```

---

## 용어 빠른 참조

| 용어 | 영어 | 설명 |
| :--- | :--- | :--- |
| **직렬화** | Serialization | 객체 → 바이트 스트림 |
| **역직렬화** | Deserialization | 바이트 스트림 → 객체 |
| **JSON** | JavaScript Object Notation | 가장 널리 사용되는 텍스트 형식 |
| **XML** | Extensible Markup Language | 마크업 언어, 과거 주류 |
| **Protobuf** | Protocol Buffers | Google 오픈소스 고효율 형식 |
| **MessagePack** | - | JSON의 바이너리 버전 |
| **인코딩** | Encoding | 문자 → 바이트 |
| **디코딩** | Decoding | 바이트 → 문자 |