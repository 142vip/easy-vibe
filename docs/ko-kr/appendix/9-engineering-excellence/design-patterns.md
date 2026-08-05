# 디자인 패턴 입문

::: tip 들어가며
**왜 코드가 항상 "작동은 하지만 지저분"할까요?** 이런 경험이 있을 것입니다: 요구사항이 바뀌면 코드를 대폭 수정해야 하고, 로직을 재사용하려고 하니 다른 코드와 얽혀 있습니다. 디자인 패턴은 선배들이 정리한 "코드 조직 노하우"로, 유연하고 유지보수 가능한 코드를 작성하는 데 도움을 줍니다.

이 장에서는 가장 실용적인 디자인 패턴을 이해합니다. 단순 암기가 아닌 "어떤 상황에 어떤 패턴을 쓸 것인가"를 이해하는 것이 목표입니다.
:::

**이 글에서 무엇을 배울 수 있을까요?**

| 장 | 내용 | 핵심 개념 |
|-----|------|---------|
| **1장** | 디자인 패턴이란 | 패턴의 본질과 분류 |
| **2장** | 생성 패턴 | 객체를 우아하게 생성하는 방법 |
| **3장** | 구조 패턴 | 코드 구조를 조직하는 방법 |
| **4장** | 행위 패턴 | 객체 간 상호작용을 관리하는 방법 |

이 장을 마치면 가장 널리 사용되는 디자인 패턴을 습득하고, 실제 프로젝트에서 적용 가능한 상황을 식별하고 유연하게 활용할 수 있게 됩니다.

---

## 0. 전경도: 디자인 패턴의 본질

요리를 배운다고 상상해 보세요. 매번 처음부터 시행착오를 거칠 수도 있고,经典 레시피를 배울 수도 있습니다 — 레시피는 창의성을 제한하지 않고, 오히려 선배들의 어깨 위에 서게 해줍니다. 디자인 패턴은 프로그래밍 세계의 "经典 레시피"입니다.

::: tip 디자인 패턴의 가치
- **공통 언어**: "여기에 옵저버 패턴을 사용하자"라고 말하면, 팀이 즉시 설계 의도를 이해합니다
- **경험 재사용**: 선배들이 겪었던 시행착오를 직접 겪을 필요가 없습니다
- **유연한 확장**: 좋은 패턴은 변화에 대해 대폭 수정이 아닌 소규모 수정만 필요하게 합니다
:::

아래의 인터랙티브 컴포넌트를 통해 일반적인 디자인 패턴의 분류와 용도를 살펴보세요:

<DesignPatternCatalogDemo />

---

## 1. 생성 패턴: 객체를 우아하게 생성 접근법
### 1.1 싱글턴 패턴 (Singleton)

**상황**: 전역에서 하나의 인스턴스만 필요한 경우, 예: 설정 관리자, 로거, 데이터베이스 연결 풀.

```javascript
class ConfigManager {
  static instance = null

  static getInstance() {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  constructor() {
    this.config = {}
  }
}

// 몇 번을 호출해도 동일한 인스턴스
const a = ConfigManager.getInstance()
const b = ConfigManager.getInstance()
console.log(a === b) // true
```

### 1.2 팩토리 패턴 (Factory)

**상황**: 다양한 조건에 따라 다른 유형의 객체를 생성해야 하며, 호출 측은 구체적인 생성 세부사항을 알 필요가 없는 경우.

```javascript
function createNotification(type, message) {
  switch (type) {
    case 'email':
      return { send: () => console.log(`이메일 전송: ${message}`) }
    case 'sms':
      return { send: () => console.log(`SMS 전송: ${message}`) }
    case 'push':
      return { send: () => console.log(`푸시 알림: ${message}`) }
    default:
      throw new Error(`알 수 없는 알림 유형: ${type}`)
  }
}

// 호출 측은 구체적인 구현을 알 필요 없음
const notification = createNotification('email', '안녕하세요')
notification.send()
```

---

## 2. 구조 패턴: 코드 구조를 조직 접근법
### 2.1 어댑터 패턴 (Adapter)

**상황**: 두 인터페이스가 호환되지 않아 "변환 플러그"가 필요한 경우. 예: 기존 API가 반환하는 데이터 형식과 새 컴포넌트가 기대하는 형식이 일치하지 않을 때.

```javascript
// 기존 API가 반환하는 형식
const oldApi = {
  getUserInfo: () => ({ user_name: '홍길동', user_age: 25 })
}

// 어댑터: 새로운 형식으로 변환
function adaptUser(oldUser) {
  return { name: oldUser.user_name, age: oldUser.user_age }
}

const user = adaptUser(oldApi.getUserInfo())
// { name: '홍길동', age: 25 }
```

### 2.2 데코레이터 패턴 (Decorator)

**상황**: 기존 코드를 수정하지 않고 객체에 새로운 기능을 추가해야 하는 경우. 휴대폰에 케이스를 씌우는 것과 같습니다 — 휴대폰 기능은 변하지 않지만 보호 기능이 추가됩니다.

```javascript
// 기본 로그 함수
function log(message) {
  console.log(message)
}

// 데코레이터: 타임스탬프 추가
function withTimestamp(fn) {
  return (message) => fn(`[${new Date().toISOString()}] ${message}`)
}

// 데코레이터: 로그 레벨 추가
function withLevel(fn, level) {
  return (message) => fn(`[${level}] ${message}`)
}

const enhancedLog = withTimestamp(withLevel(log, 'INFO'))
enhancedLog('서비스 시작 성공')
// [2025-01-15T10:30:00.000Z] [INFO] 서비스 시작 성공
```

---

## 3. 행위 패턴: 객체 간 상호작용을 관리 접근법
### 3.1 옵저버 패턴 (Observer)

**상황**: 하나의 객체 상태가 변할 때 다른 객체들에 자동으로 알림을 보내야 하는 경우. 예: 사용자가 주문한 후 이메일 발송, 재고 차감, 로그 기록을 동시에 수행해야 할 때.

```javascript
class EventEmitter {
  constructor() {
    this.listeners = {}
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(callback)
  }

  emit(event, data) {
    (this.listeners[event] || []).forEach(cb => cb(data))
  }
}

const bus = new EventEmitter()
bus.on('order:created', (order) => console.log('확인 이메일 발송', order.id))
bus.on('order:created', (order) => console.log('재고 차감', order.id))
bus.emit('order:created', { id: 'ORD-001' })
```

### 3.2 전략 패턴 (Strategy)

**상황**: 동일한 작업에 여러 알고리즘/전략이 있고, 런타임에 전환해야 하는 경우. 예: 다양한 정렬 방식, 다양한 가격 계산 규칙.

```javascript
const pricingStrategies = {
  normal: (price) => price,
  vip: (price) => price * 0.8,
  svip: (price) => price * 0.6
}

function calculatePrice(price, memberLevel) {
  const strategy = pricingStrategies[memberLevel] || pricingStrategies.normal
  return strategy(price)
}

calculatePrice(100, 'vip')  // 80
calculatePrice(100, 'svip') // 60
```

아래의 인터랙티브 컴포넌트를 통해 다양한 디자인 패턴의 실행 효과를 직접 체험해 보세요:

<PatternPlaygroundDemo />

---

## 4. 디자인 패턴을선택 접근법

| 문제 상황 | 추천 패턴 | 핵심 아이디어 |
|-------------|---------|---------|
| 전역에서 하나의 인스턴스만 필요 | 싱글턴 | 인스턴스 수 제어 |
| 조건에 따라 다른 객체 생성 | 팩토리 | 생성 로직 캡슐화 |
| 인터페이스가 호환되지 않아 변환 필요 | 어댑터 | 변환 레이어로 래핑 |
| 동적으로 기능 추가 | 데코레이터 | 레이어별 래핑으로 강화 |
| 상태 변화 시 여러 곳에 알림 필요 | 옵저버 | 발행-구독으로 결합 해제 |
| 여러 알고리즘을 런타임에 전환 | 전략 | 알고리즘을 객체로 캡슐화 |

::: tip 핵심 원칙
디자인 패턴이 많을수록 좋은 것은 아닙니다. **과도한 설계**는 **설계 부족**만큼이나 좋지 않습니다. 정말로 유연성이 필요한 곳에서만 패턴을 사용하고, 간단한 문제는 간단한 해결책으로 푸세요. KISS 원칙을 기억하세요: Keep It Simple, Stupid.
:::

---

## 5. AI 활용: 대형 언어 모델로 디자인 패턴 학습 및 적용

대형 언어 모델은 코드에서 디자인 패턴을 적용하기 적합한 상황을 식별하고, 구체적인 리팩터링 방안을 제시하는 데 도움을 줄 수 있습니다.

### 5.1 적용 가능한 패턴 식별

> **프롬프트**:
> ```
> 다음 코드를 분석하여 디자인 패턴으로 개선할 수 있는 부분이 있는지 판단해 주세요.
> 있다면 다음을 설명해 주세요:
> 1. 현재 코드의 문제점
> 2. 추천하는 디자인 패턴
> 3. 리팩터링 후의 코드 예시
> 4. 이 패턴이 이 상황에 적합한 이유
>
> [코드를 여기에 붙여넣으세요]
> ```

### 5.2 구체적인 시나리오로 패턴 학습

> **프롬프트**:
> ```
> "배달 주문 시스템"이라는 실제 시나리오를 사용하여 다음 디자인 패턴의 응용을 시연해 주세요:
> - 팩토리 패턴: 다양한 유형의 주문 생성
> - 옵저버 패턴: 주문 상태 변화 알림
> - 전략 패턴: 다양한 배달비 계산 규칙
>
> JavaScript 코드 예시를 사용하고, 각 패턴에 대해 패턴을 사용하지 않았을 때의 문제를 먼저 보여주고
> 패턴을 적용한 후의 개선을 보여주세요.
> ```

### 5.3 과도한 설계인지 판단

> **프롬프트**:
> ```
> 다음 코드를 검토하여 과도한 설계 문제가 있는지 판단해 주세요.
> 불필요한 추상화, 사용되지 않는 디자인 패턴 또는 조기 최적화가 있는지 확인해 주세요.
> 있다면 KISS 원칙에 따라 어떻게 단순화할 수 있는지 제안해 주세요.
>
> [코드를 여기에 붙여넣으세요]
> ```

::: tip AI 사용 제안
AI에게 익숙한 비즈니스 시나리오로 디자인 패턴을 설명해 달라고 하면, 추상적인 UML 다이어그램을 보는 것보다 훨씬 효과적입니다. 하지만 기억하세요: AI는 더 복잡한 방안을 추천하는 경향이 있으므로, 정말 필요한지 직접 판단해야 합니다.
:::

---

## 6. 요약

1. **생성 패턴**: "객체를 어떻게 생성할 것인가"의 문제를 해결하여 생성 과정을 더 유연하게 만듭니다
2. **구조 패턴**: "코드를 어떻게 조직할 것인가"의 문제를 해결하여 구조를 더 명확하게 만듭니다
3. **행위 패턴**: "객체 간에 어떻게 상호작용할 것인가"의 문제를 해결하여 협력을 더 느슨하게 결합합니다
4. **유연한 활용**: 실제 시나리오에 따라 선택하고, 패턴을 쓰기 위해 패턴을 쓰지 마세요

::: tip 핵심 성찰
디자인 패턴의 본질은 **변화를 관리하는 것**입니다. 좋은 설계는 변하는 부분은 쉽게 수정할 수 있게 하고, 변하지 않는 부분은 안정적으로 유지합니다. 코드를 작성할 때 스스로에게 물어보세요: "요구사항이 바뀌면 몇 곳을 수정해야 하나?" — 대답이 "많은 곳"이라면, 디자인 패턴의 도움이 필요할 수 있습니다.
:::

---

## 추가 읽기

- **고전 서적**: GoF의 《디자인 패턴: 재사용 가능한 객체 지향 소프트웨어의 기초》는 디자인 패턴의 원조입니다.
- **현대적 관점**: JavaScript에서는 언어 특성(클로저, 고차 함수)으로 인해 많은 패턴이 더 간결해집니다.
- **실용 제안**: 먼저 문제를 이해하고, 그 다음에 패턴을 고려하세요. 망치를 들고 못을 찾지 마세요.
- **심화 학습**: SOLID 원칙을 이해하세요. 디자인 패턴의 배경에 있는 지도 원칙입니다.
