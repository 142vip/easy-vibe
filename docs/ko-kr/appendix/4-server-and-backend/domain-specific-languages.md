# DSL 기초

::: tip 서문
실제 사례에서 엔지니어 Armin은 새로운 회사에서 AI를 활용해 약 4만 줄의 코드(Go + YAML + Pulumi + SDK 글루 코드)로 구성된 인프라 서비스를 구축했으며, 이 중 90% 이상이 AI에 의해 생성되었습니다. 이 사례에는 YAML, Pulumi, HCL, Lua, SDK 글루 코드 등 초보자에게 익숙하지 않은 용어들이 등장합니다. 이들은 Python도 JavaScript도 아니지만, 백엔드 프로젝트 어디에나 존재합니다. 이 글에서는 통합된 관점——**도메인 특화 언어(DSL)**——에서 이러한 기술들을 체계적으로 소개합니다.
:::

**이 글의 학습 목표**

백엔드 개발에서는 범용 프로그래밍 언어(Python, Go, Java 등)로 작성된 비즈니스 로직 외에도 **용도와 문법이 각기 다르지만 모두 범용 프로그래밍 언어에 속하지 않는** 파일과 코드가 대량으로 존재합니다. 이들은 공통된 상위 개념인 **DSL(Domain-Specific Language, 도메인 특화 언어)**을 가집니다.

이 글을 모두 읽은 후에는 다음을 할 수 있게 됩니다:

- DSL과 범용 프로그래밍 언어(GPL)의 본질적인 차이 이해
- DSL 분류 체계 숙지: 데이터 직렬화 형식, 임베디드 스크립트 언어, 인프라 정의 언어
- XML, JSON, YAML, TOML, CSV, Protobuf 등 데이터 형식의 적용 시나리오 구분
- Lua 등 임베디드 스크립트 언어의 설계 목적 이해
- Terraform(HCL)과 Pulumi의 원리 및 차이점 설명
- OpenAPI 명세와 SDK 자동 생성의 작동 방식 이해
- 어떤 유형의 코드가 AI 생성에 적합한지 판단

| 장 | 주제 | 핵심 개념 |
|-----|------|---------|
| **제1장** | DSL 총론 | DSL vs GPL의 정의, 분류 체계와 전체 그림 |
| **제2장** | 데이터 직렬화 형식 | XML, JSON, YAML, TOML, CSV, Protobuf 등 |
| **제3장** | 임베디드 스크립트 언어 | Lua 등 언어의 설계 철학과 대표적인 응용 |
| **제4장** | 코드형 인프라 | Terraform(HCL), Pulumi의 원리와 비교 |
| **제5장** | 글루 코드와 SDK 생성 | OpenAPI 명세와 클라이언트 코드 자동 생성 |
| **제6장** | AI와 DSL의 관계 | AI가 DSL 코드 생성에 특히 능한 이유 |

---

## 1. DSL 총론: 범용 언어 너머의 또 다른 세계

### 1.1 DSL이 개요
**DSL(Domain-Specific Language, 도메인 특화 언어)**은 특정 도메인이나 특정 작업을 위해 설계된 언어입니다. 이와 대비되는 것은 **GPL(General-Purpose Language, 범용 프로그래밍 언어)**로, Python, Java, Go, C++ 등 임의의 계산 문제를 해결할 수 있도록 설계된 언어들입니다.

두 개념의 핵심적인 차이:

| 차원 | GPL(범용 프로그래밍 언어) | DSL(도메인 특화 언어) |
|------|-------------------|-------------------|
| **설계 목표** | 임의의 계산 문제 해결 | 특정 도메인의 문제 해결 |
| **표현 범위** | 튜링 완전, 이론적으로 무엇이든 계산 가능 | 일반적으로 의도적으로 표현 범위 제한 |
| **학습 비용** | 높음, 완전한 언어 체계 이해 필요 | 낮음, 해당 도메인의 개념만 이해하면 됨 |
| **대표 사례** | Python, Java, Go, C++, JavaScript | SQL, HTML/CSS, 정규 표현식, YAML, HCL |

사실 여러분은 이미 오래전부터 DSL을 사용해 왔습니다:

- **SQL**은 데이터베이스 조회 도메인의 DSL입니다——`SELECT * FROM users WHERE age > 18`로 데이터를 조회하며, Python으로 순회 로직을 직접 작성하지 않습니다
- **HTML/CSS**는 웹 페이지 구조와 스타일 도메인의 DSL입니다——태그와 속성으로 페이지를 기술하며, C++로 픽셀을 조작하지 않습니다
- **정규 표현식**은 텍스트 패턴 매칭 도메인의 DSL입니다——`\d{3}-\d{4}`로 전화번호를 매칭하며, 문자 비교 루프를 직접 작성하지 않습니다

### 1.2 DSL의 분류

DSL은 "튜링 완전성을 갖추었는가"에 따라 크게 두 가지로 나눌 수 있습니다:

**외부 DSL(External DSL)**

독립적인 문법과 파서를 가지며, 어떤 범용 프로그래밍 언어에도 종속되지 않습니다. 사용자가 작성한 코드는 전용 인터프리터나 컴파일러에 의해 처리됩니다.

- 순수 데이터 기술형: JSON, YAML, XML, TOML, CSV, Protobuf(어떤 로직도 포함하지 않음)
- 조회/조작형: SQL, GraphQL, 정규 표현식(제한된 논리 능력)
- 도메인 모델링형: HCL(Terraform), Dockerfile, Nginx 설정 문법(특정 도메인의 상태를 선언적으로 기술)

**내부 DSL(Internal DSL / Embedded DSL)**

특정 범용 프로그래밍 언어 내부에 기생하며, 호스트 언어의 문법을 활용해 도메인 전용 표현 방식을 구축합니다. 코드 자체는 유효한 호스트 언어 코드이지만, 마치 전용 언어처럼 읽힙니다.

- Pulumi(TypeScript/Python/Go로 작성하지만 API가 선언적 설정처럼 설계됨)
- Ruby on Rails의 라우트 정의(`get '/users', to: 'users#index'`, 유효한 Ruby 코드이지만 설정처럼 읽힘)
- 테스트 프레임워크의 단언 문법(`expect(value).toBe(42)`, 유효한 JavaScript이지만 자연어처럼 읽힘)

### 1.3 백엔드 프로젝트에서의 DSL 전체 그림

전형적인 백엔드 프로젝트에서는 다음과 같은 종류의 DSL을 만나게 됩니다:

```
백엔드 프로젝트에서의 DSL
├── 데이터 직렬화 형식(데이터 구조 기술)
│   ├── 텍스트 형식: JSON, YAML, XML, TOML, CSV, INI
│   └── 바이너리 형식: Protobuf, MessagePack, Avro, BSON
├── 임베디드 스크립트 언어(프로그래밍 가능한 설정 계층)
│   ├── Lua(게임 엔진, Nginx, Redis)
│   ├── GDScript(Godot 엔진)
│   └── Jsonnet(설정 템플릿 생성)
├── 인프라 및 운영 DSL(시스템 상태를 선언적으로 기술)
│   ├── HCL(Terraform)
│   ├── Dockerfile / Docker Compose YAML
│   └── Nginx / Apache 설정 문법
└── 인터페이스 기술 언어(API 계약 기술)
    ├── OpenAPI / Swagger
    ├── Protocol Buffers(.proto 파일)
    └── GraphQL Schema
```

이 전체 그림을 이해하면, 이후 장에서 각 갈래를 하나씩 펼쳐 나가겠습니다.

---

## 2. 데이터 직렬화 형식: 텍스트로 구조화된 데이터 기술하기

### 2.1 데이터 직렬화 개요
**직렬화(Serialization)**는 메모리 내의 데이터 구조(객체, 딕셔너리, 배열 등)를 저장하거나 전송할 수 있는 텍스트/바이트 스트림으로 변환하는 과정을 말합니다. 반대로 텍스트/바이트 스트림에서 메모리 내 데이터 구조로 복원하는 것을 **역직렬화(Deserialization)**라고 합니다.

데이터 직렬화 형식은 DSL 중 가장 기초적인 유형입니다——순수 데이터 기술형 외부 DSL에 속하며, 어떤 논리 능력도 갖추지 않고 "값이 무엇인지"를 정적으로 기술하는 역할만 합니다.

### 2.2 이러한 형식 도입 동기
여러분이 백엔드 서비스를 개발했고, 데이터베이스 주소가 `localhost:5432`라고 가정해 봅시다. 이 주소를 소스 코드에 하드코딩하면 로컬 개발 환경에서는 문제가 없지만, 프로덕션 환경에 배포할 때 데이터베이스 주소가 `db.prod.company.com:5432`로 바뀌면 소스 코드를 수정하고 다시 컴파일해야 합니다.

엔지니어링 실무에서의 일반적인 접근 방식은: **변경 가능한 매개변수를 코드에서 분리하여 독립된 설정 파일에 저장하는 것입니다.** 프로그램은 시작 시 설정 파일을 읽고, 그 안의 값에 따라 동작을 결정합니다.

설정 외에도 데이터 직렬화 형식은 시스템 간 데이터 교환(API 요청/응답), 데이터 영속화 저장, 언어 간 통신 등의 시나리오에서 널리 사용됩니다.

### 2.3 사람이 읽을 수 있는 텍스트 형식

다음은 엔지니어링에서 가장 흔히 볼 수 있는 텍스트 직렬화 형식으로, 역사적 순서로 소개합니다.

**INI**

가장 초기의 설정 형식으로, Windows 시스템에서 유래했습니다. 구조가 단순하며 섹션(section)과 키-값 쌍으로 구성됩니다:

```ini
[database]
host = localhost
port = 5432

[server]
debug = true
```

장점은 가독성이 높다는 점입니다. 한계는 중첩 구조와 배열 타입을 지원하지 않아 복잡한 설정을 표현할 수 없다는 점입니다. 현재는 주로 레거시 시스템과 일부 Linux 설정(`php.ini`, `my.cnf` 등)에서 찾아볼 수 있습니다.

**CSV**

**CSV(Comma-Separated Values, 쉼표로 구분된 값)**는 가장 단순한 테이블 데이터 형식입니다:

```csv
name,age,city
Alice,30,Beijing
Bob,25,Shanghai
```

각 행은 하나의 레코드이며, 필드는 쉼표로 구분됩니다. CSV는 데이터 가져오기/내보내기, 스프레드시트 교환, 데이터 분석 파이프라인에서 널리 사용됩니다. 한계는 평평한 2차원 테이블만 표현할 수 있고 중첩 구조를 지원하지 않으며, 타입 정보가 없다는 점입니다(모든 값은 문자열).

**XML**

**XML(eXtensible Markup Language, 확장 가능 마크업 언어)**은 1998년에 탄생하여 한때 데이터 교환의 주류 표준이었습니다:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<config>
  <database>
    <host>localhost</host>
    <port>5432</port>
  </database>
  <server>
    <debug>true</debug>
    <allowed_origins>
      <origin>https://example.com</origin>
      <origin>https://app.example.com</origin>
    </allowed_origins>
  </server>
</config>
```

XML의 표현력은 매우 강력하며, 중첩, 속성, 네임스페이스, Schema 검증 등 고급 기능을 지원합니다. 하지만 문법이 장황하여——대량의 열고 닫는 태그로 인해 신호 대 잡음비가 낮고, 수동 작성 및 읽기 경험이 좋지 않습니다.

XML은 다음 분야에서 여전히 널리 사용됩니다:
- Java 생태계(Maven의 `pom.xml`, Spring 설정, Android 레이아웃 파일)
- 엔터프라이즈 웹 서비스(SOAP 프로토콜)
- 오피스 문서 형식(`.docx`, `.xlsx`는 본질적으로 ZIP으로 압축된 XML 파일 모음)
- RSS/Atom 피드, SVG 벡터 그래픽

**JSON**

**JSON(JavaScript Object Notation)**은 2001년에 탄생하여, 그 간결함 덕분에 XML을 빠르게 대체하며 Web API 데이터 교환의 사실상 표준이 되었습니다:

```json
{
  "database": {
    "host": "localhost",
    "port": 5432
  },
  "server": {
    "debug": true
  }
}
```

장점은 구조가 명확하고, 거의 모든 프로그래밍 언어가 네이티브 파싱을 지원한다는 점입니다. 주요 단점은 **주석을 지원하지 않으며**, 대량의 중괄호와 따옴표로 인해 수동 작성 시 오류가 발생하기 쉽다는 점입니다. JSON은 또한 프론트엔드 프로젝트 설정의 표준 형식이기도 합니다(`package.json`, `tsconfig.json`).

**YAML**

**YAML(YAML Ain't Markup Language)**은 역시 2001년에 탄생하여, 현재 백엔드 및 DevOps 영역에서 가장 널리 사용되는 설정 형식입니다. Docker Compose, Kubernetes, GitHub Actions 등 도구들이 모두 YAML을 채택하고 있습니다:

```yaml
# 데이터베이스 설정
database:
  host: localhost
  port: 5432

# 서버 설정
server:
  debug: true
  allowed_origins:
    - https://example.com
    - https://app.example.com
```

장점은 주석을 지원하고, 문법이 간결하며, 복잡한 중첩 구조를 표현할 수 있다는 점입니다. 단점은 **들여쓰기에 의존하여 계층 관계를 나타내므로**, 들여쓰기 오류가 파싱 실패로 이어진다는 점입니다. 이는 초보자가 가장 자주 겪는 문제입니다.

> 보충: YAML의 전체 이름 "YAML Ain't Markup Language"는 재귀 약어입니다.

**TOML**

**TOML(Tom's Obvious Minimal Language)**은 2013년에 탄생하여, Rust의 패키지 관리자 Cargo와 Python의 `pyproject.toml`에 채택되었습니다:

```toml
[database]
host = "localhost"
port = 5432

[server]
debug = true
allowed_origins = [
  "https://example.com",
  "https://app.example.com"
]
```

TOML은 INI의 간결함과 YAML의 표현력을 동시에 추구하면서, 들여쓰기 민감도로 인한 문제를 피하고자 합니다.

### 2.4 바이너리 직렬화 형식

위에서 설명한 형식들은 모두 사람이 읽을 수 있는 텍스트입니다. 성능과 크기에 더 높은 요구사항이 있는 시나리오에서는 **바이너리 직렬화 형식**이라는 또 다른 부류가 존재합니다——가독성을 희생하는 대신 더 작은 크기와 더 빠른 파싱 속도를 얻습니다.

| 형식 | 개발 주체 | 특징 | 대표적인 사용 시나리오 |
|------|-------|------|------------|
| **Protocol Buffers (Protobuf)** | Google | 사전 정의된 `.proto` Schema 파일 필요, 강타입, 매우 작은 크기 | gRPC 통신, Google 내부 서비스, 고성능 마이크로서비스 |
| **MessagePack** | 커뮤니티 | JSON과 유사한 바이너리 버전, Schema 불필요 | Redis 내부 인코딩, 언어 간 고성능 통신 |
| **Avro** | Apache | Schema 진화 지원, 빅데이터 시나리오에 적합 | Hadoop / Kafka 생태계의 데이터 직렬화 |
| **BSON** | MongoDB | JSON의 바이너리 확장, 더 많은 데이터 타입 지원 | MongoDB 데이터베이스 내부 저장 형식 |

Protocol Buffers를 예로 들면, 먼저 Schema를 정의해야 합니다:

```protobuf
// user.proto
syntax = "proto3";

message User {
  string name = 1;
  int32 age = 2;
  string email = 3;
}
```

그런 다음 컴파일러(`protoc`)를 통해 각 언어의 직렬화/역직렬화 코드를 자동 생성합니다. 이러한 "먼저 Schema를 정의하고, 그다음 코드를 생성하는" 패턴은 뒤에서 소개할 OpenAPI SDK 생성 방식과 동일한 사고방식입니다.

### 2.5 전체 비교

| 형식 | 유형 | 탄생 연대 | 가독성 | 주석 지원 | 대표적인 사용 시나리오 |
|------|------|---------|--------|---------|------------|
| **INI** | 텍스트 | 1980s | 높음 | ✅ | 시스템 설정, 레거시 프로젝트 |
| **CSV** | 텍스트 | 1972 | 높음 | ❌ | 데이터 가져오기/내보내기, 테이블 교환 |
| **XML** | 텍스트 | 1998 | 중간 | ✅ | Java 생태계, 엔터프라이즈 웹 서비스, 문서 형식 |
| **JSON** | 텍스트 | 2001 | 높음 | ❌ | Web API 데이터 교환, 프론트엔드 설정 |
| **YAML** | 텍스트 | 2001 | 높음 | ✅ | Docker, K8s, CI/CD, 백엔드 서비스 설정 |
| **TOML** | 텍스트 | 2013 | 높음 | ✅ | Rust / Python 프로젝트 설정 |
| **Protobuf** | 바이너리 | 2008 | 없음 | — | gRPC, 고성능 마이크로서비스 통신 |
| **MessagePack** | 바이너리 | 2008 | 없음 | — | 고성능 언어 간 통신 |
| **Avro** | 바이너리 | 2009 | 없음 | — | Hadoop / Kafka 빅데이터 파이프라인 |
| **BSON** | 바이너리 | 2009 | 없음 | — | MongoDB 내부 저장 |

**요점**: 이 모든 형식의 본질적인 기능은 동일합니다——**구조화된 데이터를 저장 및 전송 가능한 형태로 변환하는 것**입니다. 텍스트 형식은 인간의 가독성과 편집 용이성을 우선시하고, 바이너리 형식은 파싱 성능과 전송 크기를 우선시합니다. 어떤 형식을 선택할지는 구체적인 시나리오의 요구사항 트레이드오프에 따라 결정됩니다.


---

## 3. 임베디드 스크립트 언어: 프로그래밍 가능한 설정 계층

### 3.1 개념 정의

Python, JavaScript, Go 등의 언어는 범용 프로그래밍 언어(General-Purpose Language)로, 독립적으로 실행되어 완전한 애플리케이션을 구축할 수 있습니다.

이와 달리, **다른 호스트 프로그램에 내장되어 실행되도록 특별히 설계된** 언어 부류가 있습니다. 이들은 호스트 프로그램에 프로그래밍 가능한 확장 능력을 제공합니다. 이러한 언어를 **임베디드 스크립트 언어(Embedded Scripting Language)**라고 합니다.

이들이 해결하는 핵심 문제는: **정적 설정 파일(YAML/JSON)의 표현력이 부족하여 조건 판단, 루프 등의 로직을 도입해야 할 때, 호스트 프로그램의 소스 코드를 수정하지 않고 동적 동작을 구현하는 방법**입니다.

### 3.2 Lua: 가장 대표적인 임베디드 스크립트 언어

Lua(포르투갈어로 "달"이라는 뜻)는 매우 가벼운 스크립트 언어로, 전체 인터프리터를 컴파일해도 불과 수백 KB에 불과합니다. 설계 목표는 독립 실행이 아니라 임베딩 가능한 확장 계층으로서의 역할입니다.

Lua의 대표적인 응용 시나리오:

- **게임 엔진**: 《월드 오브 워크래프트》의 애드온 시스템, 《Roblox》의 게임 스크립트는 모두 Lua를 사용합니다. 게임 엔진은 C/C++로 핵심 렌더링과 물리 계산을 구현하고, 레벨 로직, NPC 대화 등 자주 변경되는 부분은 Lua 스크립트에 맡깁니다. 이렇게 하면 기획자가 게임 콘텐츠를 수정할 때 엔진을 다시 컴파일할 필요가 없습니다.

- **웹 서버**: OpenResty는 Lua를 Nginx 내부에 내장하여, 운영자가 Lua 스크립트로 요청 필터링, 속도 제한, 인증 등의 로직을 구현할 수 있게 합니다. Nginx의 C 소스 코드를 수정할 필요가 없습니다.

- **데이터베이스**: Redis는 Lua 스크립트를 서버 측으로 전송하여 실행하는 것을 지원하며, 원자성이 보장되어야 하는 복합 연산(예: "먼저 읽고 나중에 쓰기")을 구현하는 데 사용됩니다.

다음은 Nginx(OpenResty)에 내장된 Lua 스크립트 예제입니다:

```lua
-- 기능: /api/secret 경로에 대해 token 인증 수행
local uri = ngx.var.uri
local token = ngx.req.get_headers()["Authorization"]

if uri == "/api/secret" and token ~= "Bearer my-secret-token" then
    ngx.status = 403
    ngx.say("Access denied")
    return ngx.exit(403)
end
```

### 3.3 기타 임베디드 스크립트 언어

| 언어 | 호스트 환경 | 대표적인 용도 |
|------|---------|---------|
| **Lua** | 게임 엔진, Nginx(OpenResty), Redis | 게임 로직, 게이트웨이 정책, 캐시 연산 |
| **VimScript / Lua** | Vim / Neovim 편집기 | 편집기 플러그인 개발 |
| **Emacs Lisp** | Emacs 편집기 | 편집기 동작 커스터마이징 |
| **GDScript** | Godot 게임 엔진 | 게임 로직 스크립트 |
| **Jsonnet** | Kubernetes 생태계 / 설정 생성 도구 | 대량의 유사한 JSON/YAML 설정을 템플릿화하여 생성 |

**요점**: 임베디드 스크립트 언어는 DSL 분류에서 **내부 DSL과 외부 DSL의 경계 지대**에 속합니다——이들은 독립된 언어(자체 문법과 인터프리터를 가짐)이지만, 설계 목표는 독립적인 애플리케이션 구축이 아닌 호스트 프로그램에 내장되어 실행되는 것입니다. 이들은 "정적 설정 파일"(순수 데이터 기술형 DSL)과 "범용 프로그래밍 언어"(GPL) 사이의 공백을 메웁니다: 설정이 로직(조건 판단, 루프, 함수 호출)을 표현해야 할 때, 가벼운 스크립트 언어를 내장하는 것이 엔지니어링상의 표준 솔루션입니다.


---

## 4. 코드형 인프라(Infrastructure as Code)

### 4.1 "인프라"란 개요
백엔드 엔지니어링에서 "인프라"(Infrastructure)는 애플리케이션 실행이 의존하는 하위 계층 리소스를 의미합니다:

- 컴퓨팅 리소스: 서버(가상 머신 또는 컨테이너)
- 데이터 저장소: 데이터베이스 인스턴스, 객체 스토리지 버킷
- 네트워크: 방화벽 규칙, 로드 밸런서, DNS 설정
- 미들웨어: 메시지 큐, 캐시 클러스터

클라우드 컴퓨팅 시대에 이러한 리소스들은 클라우드 서비스 제공자(AWS, 알리바바 클라우드, 텐센트 클라우드 등)의 콘솔을 통해 그래픽 인터페이스로 생성 및 관리됩니다.

### 4.2 수동 관리의 한계

콘솔을 통한 수동 조작은 소규모 프로젝트에서는 가능하지만, 프로젝트 규모가 커짐에 따라 다음과 같은 문제가 드러납니다:

1. **반복 불가능**: 조작 단계가 기록되지 않아 동일한 환경을 정확히 재현할 수 없음
2. **감사 불가능**: "누가 언제 어떤 설정을 변경했는지" 추적할 수 없음
3. **협업 불가능**: 조작 과정을 버전 관리에 포함할 수 없고, 코드 리뷰를 할 수 없음
4. **오류 발생 쉬움**: 수동 조작은 프로덕션 환경에서 오조작 위험이 있음

**코드형 인프라(Infrastructure as Code, 약칭 IaC)**의 핵심 아이디어는: **코드로 인프라 리소스를 선언적으로 정의하여, 버전 관리, 자동화된 실행 및 반복 가능한 배포 능력을 갖추게 하는 것입니다.**

### 4.3 Terraform

Terraform은 현재 가장 널리 사용되는 IaC 도구로, HashiCorp 사에서 개발했습니다. 전용 **HCL(HashiCorp Configuration Language)** 언어를 사용합니다.

Terraform은 **선언적** 패러다임을 채택합니다: 사용자가 원하는 최종 상태를 기술하면, Terraform이 현재 상태에서 목표 상태로 가기 위해 필요한 작업을 자동으로 계산합니다.

```hcl
# 클라우드 서버 정의
resource "aws_instance" "my_server" {
  ami           = "ami-0c55b159cbfafe1f0"  # 운영체제 이미지
  instance_type = "t3.micro"               # 인스턴스 사양

  tags = {
    Name = "my-first-server"
  }
}

# PostgreSQL 데이터베이스 인스턴스 정의
resource "aws_db_instance" "my_database" {
  engine         = "postgres"
  instance_class = "db.t3.micro"
  username       = "admin"
  password       = "please-use-secrets-manager"
}
```

실행 흐름:

```bash
terraform plan    # 실행될 변경 사항 미리보기
terraform apply   # 확인 후 실행, 클라우드 플랫폼에 리소스 자동 생성
```

### 4.4 Pulumi

Pulumi는 또 다른 사고방식을 제공합니다: **전용 HCL 문법을 배우는 대신 범용 프로그래밍 언어(TypeScript, Python, Go 등)를 직접 사용하여 인프라를 정의**하는 것입니다.

동일한 서버 정의를 Pulumi + TypeScript로 표현하면 다음과 같습니다:

```typescript
import * as aws from "@pulumi/aws";

const server = new aws.ec2.Instance("my-server", {
    ami: "ami-0c55b159cbfafe1f0",
    instanceType: "t3.micro",
    tags: { Name: "my-first-server" },
});

const bucket = new aws.s3.Bucket("my-bucket", {
    acl: "private",
});

export const serverIp = server.publicIp;
```

범용 프로그래밍 언어를 사용하므로, 개발자는 루프, 조건 판단, 함수 추상화 등 언어 기능을 활용하여 복잡한 인프라 로직을 처리할 수 있습니다.

### 4.5 Terraform과 Pulumi의 비교

| 차원 | Terraform | Pulumi |
|------|-----------|--------|
| **언어** | HCL(전용 언어) | TypeScript / Python / Go 등 범용 언어 |
| **학습 비용** | HCL 문법을 배워야 함 | 이미 숙달된 프로그래밍 언어 사용, 학습 비용 낮음 |
| **커뮤니티 생태계** | 매우 성숙, 거의 모든 클라우드 서비스 제공자 커버 | 빠르게 성장 중이나 Terraform보다 규모가 작음 |
| **적용 시나리오** | 운영 팀 주도의 표준화된 인프라 관리 | 개발자 주도의 프로젝트, 복잡한 로직이 필요한 시나리오 |
| **AI 코드 생성 적합도** | 높음(패턴이 고정적) | 매우 높음(본질적으로 범용 프로그래밍 언어 코드) |

**요점**: IaC 도구에서 HCL은 전형적인 외부 DSL입니다——독립된 문법과 파서를 가지며, 인프라 상태를 선언적으로 기술하기 위해 특별히 설계되었습니다. 반면 Pulumi는 내부 DSL 전략을 채택합니다——범용 프로그래밍 언어의 문법으로 도메인 특화 개념을 표현합니다. 두 도구의 목표는 동일하지만(인프라 관리를 수동 조작에서 코드 기반으로 전환), 경로가 다릅니다(전용 언어 vs 범용 언어). 코드는 Git 버전 관리에 포함시키고, 팀 리뷰를 거치며, 자동화된 실행과 롤백이 가능합니다.


---

## 5. 글루 코드와 SDK 자동 생성

### 5.1 글루 코드란 개요
소프트웨어 엔지니어링에서 **글루 코드(Glue Code)**는 그 자체로는 비즈니스 로직을 포함하지 않고, 오직 두 시스템이나 모듈을 연결하는 데만 사용되는 코드를 말합니다.

대표적인 글루 코드에는 다음이 포함됩니다:

- 프론트엔드가 백엔드 API를 호출할 때 작성하는 HTTP 요청 코드(URL 조합, 요청 헤더 설정, 응답 파싱)
- 백엔드 서비스 A가 서비스 B의 인터페이스를 호출할 때 작성하는 HTTP 클라이언트 코드
- 서로 다른 프로그래밍 언어 간의 인터페이스 어댑터 코드

이런 코드의 특징은: **매우 반복적이고, 패턴이 고정되어 있지만, 생략할 수 없다는 점입니다.**

### 5.2 OpenAPI 명세와 코드 자동 생성

글루 코드가 높은 패턴화 특성을 가지므로, 엔지니어링 업계의 해결책은: **먼저 표준 형식으로 API 인터페이스를 기술하고, 그다음 도구로 클라이언트 코드를 자동 생성하는 것입니다.**

**OpenAPI 명세**(이전 명칭 Swagger)는 REST API를 기술하는 업계 표준입니다. YAML 또는 JSON 형식을 사용하여 API의 경로, 매개변수, 요청 본문 및 응답 구조를 정밀하게 정의합니다:

```yaml
openapi: 3.0.0
info:
  title: 메일 서비스 API
  version: 1.0.0

paths:
  /emails:
    post:
      summary: 메일 발송
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                to:
                  type: string
                  example: "user@example.com"
                subject:
                  type: string
                body:
                  type: string
      responses:
        '200':
          description: 발송 성공
```

이 명세 파일을 기반으로 `openapi-generator` 등의 도구를 사용하여 여러 언어의 클라이언트 SDK를 자동 생성할 수 있습니다:

- **Python**: `client.emails.send(to="user@example.com", subject="Hi", body="Hello")`
- **TypeScript**: `client.emails.send({ to: "user@example.com", subject: "Hi", body: "Hello" })`
- **Go**: `client.Emails.Send(ctx, &SendEmailRequest{To: "user@example.com", ...})`

생성된 SDK는 HTTP 요청의 모든 세부 사항을 캡슐화하므로, 호출자는 URL 경로, 요청 메서드, 직렬화 형식 등의 하위 구현을 신경 쓸 필요가 없습니다.

### 5.3 Armin의 사례 다시 이해하기

이 글의 시작 부분에 나온 사례로 돌아가면, 이제 각 구성 요소를 정확히 이해할 수 있습니다:

| 구성 요소 | 성격 | 설명 |
|---------|------|------|
| **Go** | 비즈니스 로직 코드 | 메일 송수신 서비스의 핵심 기능 구현 |
| **YAML** | 설정 파일 | 서비스 설정, CI/CD 파이프라인 정의, OpenAPI 명세 파일 |
| **Pulumi** | 인프라 코드 | Go/TypeScript로 클라우드 리소스(서버, 데이터베이스, 네트워크) 정의 |
| **SDK 글루 코드** | 자동 생성된 클라이언트 라이브러리 | OpenAPI 명세에서 자동 생성된 Python 및 TypeScript SDK |

이 중 YAML 설정, Pulumi 리소스 정의, SDK 글루 코드 이 세 가지는 모두 높은 패턴화와 명확한 명세 제약을 가진 코드에 속하며, 이는 AI 코드 생성 능력이 가장 강력한 영역입니다. 따라서 "4만 줄 코드 중 90%가 AI에 의해 생성되었다"는 것은 합리적인 수치입니다.


---

## 6. AI와 DSL의 관계

### 6.1 AI 코드 생성의 적합성 분석

| 특성 차원 | AI 생성에 적합 | AI 생성에 부적합 |
|---------|-------------|---------------|
| **패턴화 정도** | 매우 반복적, 고정된 템플릿 존재 | 창의적 설계 필요, 선례 없음 |
| **명세 제약** | 명확한 schema 또는 문법 명세 존재 | 요구사항이 모호하고 경계가 불명확 |
| **컨텍스트 의존성** | 국소적으로 자체 완결, 단일 정의가 전역 이해에 의존하지 않음 | 전체 시스템의 아키텍처 의도 이해 필요 |
| **검증 가능성** | 도구로 자동 검증 가능(예: `terraform validate`) | 설계의 합리성을 사람의 판단에만 의존 |

이 글에서 소개한 네 가지 기술——설정 파일, 임베디드 스크립트, IaC 코드, SDK 글루 코드——는 모두 왼쪽 열의 특성을 갖습니다. 이것이 AI가 이 영역들에서 비즈니스 로직 코드보다 현저히 뛰어난 코드 생성 효과를 보이는 이유를 설명합니다.

### 6.2 평가 프레임워크

어떤 코드가 AI 생성에 적합한지 판단할 때, 다음 세 가지 기준을 참고할 수 있습니다:

1. **현존하는 명세나 schema가 있는가?** —— 있다면 AI 친화적
2. **대량으로 반복되는 패턴에 속하는가?** —— 그렇다면 AI 친화적
3. **생성 결과를 도구로 자동 검증할 수 있는가?** —— 가능하다면 AI 친화적

세 가지를 모두 충족하는 코드(예: OpenAPI 명세에서 SDK 생성, Terraform으로 동형 리소스 일괄 정의)는 AI 생성에 크게 의존할 수 있습니다. 세 가지 모두 충족하지 않는 코드(예: 새로운 분산 합의 프로토콜 설계)는 여전히 엔지니어가 직접 완성해야 합니다.

---

## 7. 용어집

| 용어 | 전체 명칭 / 한국어 | 정의 |
|------|------------|------|
| **DSL** | Domain-Specific Language / 도메인 특화 언어 | 특정 도메인을 위해 설계된 언어, 범용 프로그래밍 언어와 대비됨 |
| **GPL** | General-Purpose Language / 범용 프로그래밍 언어 | 임의의 계산 문제를 해결할 수 있는 프로그래밍 언어, Python, Java, Go 등 |
| **외부 DSL** | External DSL | 독립된 문법과 파서를 가진 도메인 특화 언어, SQL, HCL, YAML 등 |
| **내부 DSL** | Internal DSL / Embedded DSL | 범용 프로그래밍 언어 내부에 기생하며 호스트 문법을 활용해 구축된 도메인 전용 표현, Pulumi 등 |
| **데이터 직렬화** | Data Serialization | 메모리 내 데이터 구조를 저장 또는 전송 가능한 형식으로 변환하는 과정 |
| **INI** | Initialization | 가장 초기의 키-값 쌍 설정 형식, Windows 시스템에서 유래 |
| **CSV** | Comma-Separated Values / 쉼표로 구분된 값 | 쉼표로 필드를 구분하는 순수 텍스트 테이블 형식 |
| **XML** | eXtensible Markup Language / 확장 가능 마크업 언어 | 태그 기반의 텍스트 데이터 형식, 표현력이 강하지만 문법이 장황함 |
| **JSON** | JavaScript Object Notation | 키-값 쌍 기반의 경량 데이터 교환 형식, Web API의 사실상 표준 |
| **YAML** | YAML Ain't Markup Language | 들여쓰기 기반의 설정 파일 형식, 백엔드 및 DevOps 영역에서 널리 사용 |
| **TOML** | Tom's Obvious Minimal Language | 명시적 문법의 설정 형식, Rust 및 Python 생태계에서 자주 사용 |
| **Protobuf** | Protocol Buffers | Google이 개발한 바이너리 직렬화 형식, Schema 사전 정의 필요, 작은 크기와 빠른 속도 |
| **MessagePack** | — | JSON과 유사한 바이너리 직렬화 형식, Schema 불필요 |
| **Lua** | — | 경량 임베디드 스크립트 언어, 게임 엔진, 웹 서버 및 데이터베이스 확장에 자주 사용 |
| **IaC** | Infrastructure as Code / 코드형 인프라 | 코드로 클라우드 컴퓨팅 리소스를 정의하고 관리하는 엔지니어링 실천법 |
| **Terraform** | — | HashiCorp가 개발한 IaC 도구, HCL 선언적 언어 사용 |
| **HCL** | HashiCorp Configuration Language | Terraform이 사용하는 전용 설정 언어 |
| **Pulumi** | — | 범용 프로그래밍 언어를 지원하는 IaC 도구 |
| **OpenAPI** | — | REST API 인터페이스를 기술하는 업계 표준 명세(이전 명칭 Swagger) |
| **SDK** | Software Development Kit / 소프트웨어 개발 키트 | API 호출 세부 사항을 캡슐화한 클라이언트 라이브러리 |
| **글루 코드** | Glue Code | 비즈니스 로직을 포함하지 않고 오직 두 시스템을 연결하는 어댑터 코드 |

---

## 정리

백엔드 엔지니어링에는 대량의 비즈니스 로직이 아닌 코드가 존재합니다. 이들은 공통된 상위 개념인 **DSL(도메인 특화 언어)**——특정 도메인을 위해 설계된, 범용 프로그래밍 언어와 대비되는 언어——를 가집니다.

이 글에서 소개한 DSL은 네 가지 범주로 분류할 수 있습니다:

1. **데이터 직렬화 형식**(XML / JSON / YAML / TOML / CSV / Protobuf 등) —— 순수 데이터 기술형 외부 DSL, 구조화된 데이터를 저장 및 전송 가능한 형태로 변환
2. **임베디드 스크립트 언어**(Lua 등) —— 설정과 범용 언어 사이에 위치, 호스트 프로그램에 프로그래밍 가능한 확장 능력 제공
3. **인프라 정의 언어**(HCL / Dockerfile 등) —— 선언적 외부 DSL, 시스템의 원하는 상태를 기술; Pulumi는 내부 DSL 방식으로 동일한 목표를 달성
4. **인터페이스 기술 언어와 글루 코드 생성**(OpenAPI / .proto) —— 명세 기술을 통해 시스템 간 연결 코드를 자동 생성

DSL이라는 분류 프레임워크를 이해하면, 백엔드 프로젝트에서 마주치는 각종 "코드 같지 않은 코드" 앞에서 그 성격을 빠르게 식별할 수 있습니다: 그것이 어떤 DSL 범주에 속하는지, 어떤 도메인의 문제를 해결하는지, 왜 범용 프로그래밍 언어로 작성하지 않는지.

또한 DSL 코드는 높은 패턴화, 명세 주도, 자동 검증 가능이라는 특징을 가지므로, 현재 AI 코드 생성 기술이 가장 효과적으로 적용되는 영역이기도 합니다.