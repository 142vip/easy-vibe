# JavaScript 런타임 원리

::: tip 서문
여러분은 이미 JavaScript의 기본 문법을 배웠지만, 다음을 생각해 본 적이 있나요?
- 코드는 대체 어디서 실행될까요?
- 왜 같은 코드가 브라우저와 Node.js에서 다르게 동작할까요?
- 왜 코드가 가끔 "멈추고", 때로는 "병렬로" 실행될 수 있을까요?

이 글은 JavaScript의 런타임 환경, 이벤트 루프, 콜 스택, 메모리 관리 등을 심층적으로 다룹니다. 이 글을 읽고 나면 코드가 특정 순서로 실행되는 이유를 이해하고, 비동기 관련 버그를 빠르게 찾아내며, 코드 성능을 최적화하고 메모리 누수를 방지할 수 있게 됩니다.
:::

**이 글에서 배울 내용**

| 장 | 내용 | 배운 후 할 수 있는 것 |
|-----|------|----------------------|
| **1장** | 런타임 개요 | JavaScript 코드가 어디서 실행되는지 이해 |
| **2장** | 브라우저 런타임 | 브라우저가 제공하는 Web API 파악 |
| **3장** | Node.js 런타임 | 서버 측 JavaScript 환경 이해 |
| **4장** | 이벤트 루프 심화 | 매크로 태스크와 마이크로 태스크의 실행 순서 파악 |
| **5장** | 콜 스택과 메모리 | 코드 실행 과정과 메모리 관리 이해 |
| **6장** | 실전 팁 | 성능 최적화, 메모리 누수 디버깅 |

---

## 1. 런타임 개요

::: tip 🤔 핵심 문제
**"런타임"이란 무엇인가요?** JavaScript는 단순한 언어일 뿐인데, 왜 같은 코드가 다른 환경에서 다르게 동작할까요?
:::

### 1.1 런타임이란

**런타임 = JavaScript 엔진 + 환경에서 제공하는 API**

JavaScript를 "프로그래밍 언어"에 비유한다면, 런타임은 "운영 체제"와 같습니다 — 코드가 무엇을 할 수 있고 무엇을 할 수 없는지를 결정합니다.

```
┌─────────────────────────────────────┐
│         JavaScript 코드             │
├─────────────────────────────────────┤
│      JavaScript 엔진 (V8)           │  ← 코드 파싱 및 실행 담당
├─────────────────────────────────────┤
│      런타임 환경 (브라우저/Node.js)     │  ← 추가 기능 제공
└─────────────────────────────────────┘
```

**비유: JavaScript는 "표준어", 런타임은 "도시"**

- JavaScript 문법(표준어)은 어디서나 같습니다
- 하지만 다른 도시가 제공하는 시설이 다릅니다:
  - 브라우저 = DOM, window, fetch 보유 (도시에 쇼핑몰, 도서관이 있는 것과 같음)
  - Node.js = fs, http, path 보유 (도시에 공장, 고속도로가 있는 것과 같음)

### 1.2 두 가지 주류 런타임

| 특징 | 브라우저 | Node.js |
|------|---------|---------|
| **주요 용도** | 웹페이지 인터랙션, 사용자 인터페이스 | 서버 측 애플리케이션, 명령줄 도구 |
| **전역 객체** | `window` | `global` |
| **DOM API** | ✅ 지원 | ❌ 미지원 |
| **파일 시스템** | ❌ 제한적 | ✅ 완전 지원 |
| **모듈 시스템** | ES Modules | CommonJS + ES Modules |
| **타이머** | `setTimeout`, `setInterval` | `setTimeout`, `setInterval` |
| **네트워크 요청** | `fetch`, `XMLHttpRequest` | `http`, `https` 모듈 |

👇 **직접 해보기**: 브라우저와 Node.js의 환경 차이 비교

<RuntimeEnvironmentDemo />

::: info 💡 핵심 시사점
런타임이 사용할 수 있는 API를 결정합니다. 브라우저에서 사용할 수 있는 DOM API는 Node.js에서 사용할 수 없고, Node.js에서 사용할 수 있는 파일 API는 브라우저에서 사용할 수 없습니다. 이것이 일부 코드에 "환경 판단"이 필요한 이유입니다.
:::

---

## 2. 브라우저 런타임

::: tip 🤔 핵심 문제
**브라우저는 JavaScript가 웹페이지를 조작할 수 있도록 어떤 기능을 제공할까요?**
:::

### 2.1 브라우저 런타임의 구성

```
┌─────────────────────────────────────────────┐
│            JavaScript 엔진                  │
│            (V8 / SpiderMonkey)              │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│              Web APIs                        │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐     │
│  │   DOM   │ │   BOM    │ │ Network  │     │
│  │ 웹페이지 │ │ 브라우저  │ │ 네트워크  │     │
│  │ 조작    │ │ 조작     │ │ 요청     │     │
│  └─────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           이벤트 루프 (Event Loop)            │
│     코드 실행, 이벤트 처리, 작업 스케줄링 조정  │
└─────────────────────────────────────────────┘
```

### 2.2 Web APIs의 세 가지 범주

**1. DOM API - 웹페이지 콘텐츠 조작**

```javascript
// 요소 찾기
const title = document.querySelector('h1')

// 내용 수정
title.textContent = '새 제목'

// 스타일 추가
title.style.color = 'red'
```

**2. BOM API - 브라우저 조작**

```javascript
// 페이지 이동
window.location.href = 'https://example.com'

// 브라우저 저장소
localStorage.setItem('key', 'value')

// 브라우저 기록
history.back()
```

**3. Network API - 네트워크 요청**

```javascript
// HTTP 요청 보내기
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
```

### 2.3 브라우저 특유의 이벤트 메커니즘

브라우저 런타임의 가장 강력한 기능 중 하나는 "이벤트 구동"입니다 — 코드가 계속 실행되는 것이 아니라 사용자 조작을 기다렸다가 실행됩니다.

```javascript
button.addEventListener('click', () => {
  console.log('버튼이 클릭되었습니다')
})
```

**일반적인 이벤트 유형:**

| 이벤트 유형 | 발생 시점 | 실제 시나리오 |
|------------|----------|-------------|
| `click` | 마우스 클릭 | 버튼 인터랙션 |
| `input` | 입력란 내용 변화 | 실시간 검색 |
| `scroll` | 페이지 스크롤 | 지연 로딩 |
| `load` | 리소스 로딩 완료 | 데이터 초기화 |
| `error` | 오류 발생 | 오류 처리 |

---

## 3. Node.js 런타임

::: tip 🤔 핵심 문제
**JavaScript가 서버 측에서 실행될 수 있는 것은 무엇 덕분일까요?**
:::

### 3.1 Node.js의 구성

```
┌─────────────────────────────────────────────┐
│            JavaScript 엔진                  │
│                 (V8)                        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           Node.js 내장 모듈                  │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐     │
│  │   fs    │ │   http   │ │   path   │     │
│  │ 파일 작업 │ │ 웹 서버   │ │ 경로 처리  │     │
│  └─────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│          libuv 이벤트 루프 라이브러리           │
│      크로스 플랫폼 비동기 I/O 지원              │
└─────────────────────────────────────────────┘
```

### 3.2 Node.js 특유의 기능

**1. 파일 시스템 조작**

```javascript
const fs = require('fs')

// 파일 읽기
fs.readFile('./data.txt', 'utf8', (err, data) => {
  if (err) throw err
  console.log(data)
})

// 파일 쓰기
fs.writeFile('./output.txt', 'Hello', (err) => {
  if (err) throw err
  console.log('쓰기 성공')
})
```

**2. HTTP 서버**

```javascript
const http = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end('<h1>Hello World</h1>')
})

server.listen(3000)
```

**3. 모듈 시스템**

```javascript
// CommonJS (Node.js 기본값)
const fs = require('fs')
module.exports = { myFunction }

// ES Modules (현대적 방식)
import fs from 'fs'
export { myFunction }
```

### 3.3 브라우저 vs Node.js 비교

| 특징 | 브라우저 | Node.js |
|------|---------|---------|
| **진입 파일** | HTML 파일 | JavaScript 파일 |
| **전역 객체** | `window`, `document` | `global`, `process` |
| **모듈 로딩** | `<script>` 태그 | `require()` / `import` |
| **보안** | 샌드박스 환경, 제한적 | 시스템 리소스 접근 가능 |
| **용도** | 사용자 인터페이스 | 백엔드 서비스, 도구 |

---

## 4. 이벤트 루프 심화

::: tip 🤔 핵심 문제
**JavaScript는 싱글 스레드인데, 어떻게 "블로킹 없이" 동작할 수 있을까요?**
:::

### 4.1 이벤트 루프란

**이벤트 루프 = JavaScript의 "작업 스케줄링 센터"**

JavaScript는 싱글 스레드이므로 한 번에 하나의 작업만 수행할 수 있습니다. 하지만 이벤트 루프 덕분에 "동시에" 여러 작업을 수행하는 것처럼 보입니다.

**핵심 메커니즘:**

1. **동기 코드 실행** (콜 스택)
2. **비동기 작업 처리** (태스크 큐)
3. **새 작업 대기** (반복)

```
콜 스택                    태스크 큐
┌─────────┐              ┌──────────┐
│ 작업 1  │              │ 매크로 1  │
│ 작업 2  │ ←────────────  │ 매크로 2  │
│ 작업 3  │   하나 완료 후  │ 매크로 3  │
└─────────┘   다음 것 꺼내기 └──────────┘
      ↓                        ↑
      └────────────────────────┘
         이벤트 루프가 계속 확인
```

### 4.2 매크로 태스크 vs 마이크로 태스크

이것은 면접과 실무에서 가장 혼동하기 쉬운 개념입니다!

**매크로 태스크 (Macrotask):**
- `setTimeout`, `setInterval`
- I/O 작업
- UI 렌더링

**마이크로 태스크 (Microtask):**
- `Promise.then`
- `MutationObserver`
- `queueMicrotask`

**실행 순서: 동기 코드 → 마이크로 태스크 → 매크로 태스크**

👇 **직접 해보기**: 매크로 태스크와 마이크로 태스크의 실행 순서 관찰

<TaskQueueDemo />

### 4.3 고전적인 면접 문제

```javascript
console.log('1')

setTimeout(() => console.log('2'), 0)

Promise.resolve().then(() => console.log('3'))

console.log('4')

// 출력: 1, 4, 3, 2
```

**왜 이 순서일까요?**

1. 동기 코드 실행: `console.log('1')`, `console.log('4')` → 1, 4 출력
2. 마이크로 태스크 큐 확인: `Promise.then` → 3 출력
3. 매크로 태스크 큐 확인: `setTimeout` → 2 출력

::: info 💡 실전 팁
- 코드를 최대한 빨리 실행하려면 마이크로 태스크 (`Promise.then`) 사용
- 실행을 지연하려면 매크로 태스크 (`setTimeout`) 사용
- 너무 많은 비동기 작업을 섞어 쓰지 마세요. "콜백 지옥"에 빠질 수 있습니다
:::

---

## 5. 콜 스택과 메모리

::: tip 🤔 핵심 문제
**코드는 어떻게 실행될까요? 변수는 어디에 저장될까요? 언제 회수될까요?**
:::

### 5.1 콜 스택: 함수 실행의 "발자국"

**콜 스택 = 함수 호출을 기록하는 "노트"**

함수를 호출할 때마다 스택에 새로운 레코드가 추가되고, 함수 실행이 완료되면 레코드가 제거됩니다.

```javascript
function a() {
  b()
}

function b() {
  c()
}

function c() {
  console.log('실행 완료')
}

a()
```

**콜 스택의 변화:**

```
단계 1: a() 호출
┌─────────┐
│    a    │
└─────────┘

단계 2: a()가 b() 호출
┌─────────┐
│    b    │
│    a    │
└─────────┘

단계 3: b()가 c() 호출
┌─────────┐
│    c    │
│    b    │
│    a    │
└─────────┘

단계 4: c() 실행 완료, 순차적으로 팝
┌─────────┐
│    b    │
│    a    │
└─────────┘
```

👇 **직접 해보기**: 콜 스택의 변화 관찰

<CallStackDemo />

### 5.2 메모리 관리: 쓰레기는 어디로 갈까

JavaScript에는 "자동 가비지 컬렉션" 메커니즘이 있습니다 — 수동으로 메모리를 해제할 필요가 없으며, 엔진이 알아서 처리합니다.

**가비지 컬렉션의 원리: Mark-and-Sweep 알고리즘**

1. **마킹 단계**: "루트"에서 시작하여 접근 가능한 모든 변수를 찾음
2. **스윕 단계**: 표시되지 않은 변수는 "가비지"로 판단되어 회수됨

```javascript
// 가비지 컬렉션 예시
let obj1 = { name: '객체1' }
let obj2 = { name: '객체2' }

// obj1이 재할당되면, 기존 객체는 참조를 잃음
obj1 = null  // 기존 { name: '객체1' }은 회수됨

// obj2는 여전히 사용 중이므로 회수되지 않음
console.log(obj2.name)
```

👇 **직접 해보기**: 가비지 컬렉션 과정 관찰

<GarbageCollectionDemo />

### 5.3 메모리 누수: 정리를 잊은 결과

**메모리 누수 = 해제해야 할 메모리가 해제되지 않고 계속 쌓이는 현상**

일반적인 원인:

**1. 전역 변수가 너무 많음**

```javascript
// ❌ 오류: 전역 변수는 회수되지 않음
globalCache = []

function addItem(item) {
  globalCache.push(item)
}
```

**2. 이벤트 리스너 제거하지 않음**

```javascript
// ❌ 오류: 리스너를 제거하지 않음
button.addEventListener('click', handleClick)

// ✅ 올바름: 필요 없을 때 리스너 제거
button.removeEventListener('click', handleClick)
```

**3. 클로저가 큰 객체를 참조**

```javascript
// ❌ 오류: 클로저가 큰 객체를 계속 참조하여 회수되지 않음
function createHandler() {
  const bigData = new Array(1000000).fill('data')
  return function() {
    console.log('처리 중')
  }
}

const handler = createHandler()  // bigData가 메모리에 계속 존재
```

👇 **직접 해보기**: 메모리 누수가 어떻게 발생하는지 관찰

<MemoryLeakDemo />

::: info 💡 실전 팁
- **정기 점검**: 브라우저 DevTools → Memory → Take Heap Snapshot 열어서 메모리 점유 확인
- **전역 변수 피하기**: `var` 대신 `const`와 `let` 사용
- **즉시 정리**: 이벤트 리스너, 타이머 사용 후 반드시 제거
- **약한 참조**: `WeakMap`과 `WeakSet`으로 객체 참조 저장
:::

---

## 6. 실전 팁

::: tip 🤔 핵심 문제
**고성능 JavaScript 코드를 어떻게 작성할까요? 문제가 발생하면 어떻게 디버깅할까요?**
:::

### 6.1 성능 최적화 팁

**1. 리플로우/리페인트 줄이기**

```javascript
// ❌ 오류: 매 반복마다 리플로우 발생
for (let i = 0; i < 1000; i++) {
  element.style.top = i + 'px'
}

// ✅ 올바름: 일괄 수정
element.style.transform = `translateY(${position}px)`
```

**2. 이벤트 위임 사용**

```javascript
// ❌ 오류: 각 버튼에 리스너 추가
buttons.forEach(btn => {
  btn.addEventListener('click', handleClick)
})

// ✅ 올바름: 부모 요소에 하나의 리스너만 추가
container.addEventListener('click', (e) => {
  if (e.target.matches('.button')) {
    handleClick(e)
  }
})
```

**3. 디바운스와 스로틀**

```javascript
// 디바운스: 사용자가 입력을 멈춘 후 실행
function debounce(fn, delay) {
  let timer
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// 스로틀: 실행 빈도 제한
function throttle(fn, delay) {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}
```

### 6.2 디버깅 팁

**1. DevTools로 콜 스택 확인**

```javascript
function a() {
  b()
}

function b() {
  c()
}

function c() {
  debugger  // 여기서 일시 정지, 콜 스택 확인
}

a()
```

**2. `console.trace()`로 실행 경로 추적**

```javascript
function trackExecution() {
  console.trace('실행 경로')
  // 전체 콜 스택 출력
}
```

**3. Performance로 성능 분석**

```javascript
performance.mark('start')

// 일부 코드 실행
for (let i = 0; i < 10000; i++) {
  // ...
}

performance.mark('end')
performance.measure('루프 성능', 'start', 'end')

const measure = performance.getEntriesByName('루프 성능')[0]
console.log(`실행 시간: ${measure.duration}ms`)
```

### 6.3 일반적인 문제 빠른 참조

| 문제 | 가능한 원인 | 해결 방법 |
|------|-----------|----------|
| **메모리 점유율 높음** | 메모리 누수, 캐시 과다 | 전역 변수 확인, 리스너 제거 |
| **페이지 버벅거림** | 긴 작업이 메인 스레드 차단 | 작업 분할, Web Workers 사용 |
| **이벤트 미발생** | 리스너 미바인딩, 요소 미존재 | DOM 로딩 시점 확인 |
| **비동기 순서 오류** | 매크로 태스크와 마이크로 태스크 혼용 | Promise 또는 async/await으로 통일 |
| **타이머 부정확** | 메인 스레드 차단 | Web Workers 또는 requestAnimationFrame 사용 |

---

## 요약

이제 다음을 이해할 수 있어야 합니다:

- **런타임 = 엔진 + 환경 API**, 다른 런타임은 다른 기능을 제공
- **이벤트 루프**가 동기 코드, 마이크로 태스크, 매크로 태스크의 실행 순서를 조정
- **콜 스택**이 함수 실행 과정을 기록하며, **스택 오버플로우**는 재귀가 너무 깊어서 발생
- **가비지 컬렉션**이 사용하지 않는 변수를 자동으로 정리하지만, **메모리 누수**에 주의
- **성능 최적화**의 핵심은 리플로우/리페인트 줄이기, 비동기 적절히 활용

::: info 💡 문제 발생 시 AI에게 이렇게 말하세요
- "이 함수 실행이 너무 느린데, 성능 최적화 방법을 확인해 주세요"
- "메모리 점유율이 계속 증가하고 있어요, 메모리 누수일 수 있으니 확인해 주세요"
- "비동기 작업 순서가 잘못되었습니다. A를 먼저 하고 B를 해야 하는데, 지금은 A와 B가 거의 동시에 시작됩니다"
- "이벤트 리스너가 트리거되지 않습니다. 요소가 DOM에 이미 로드되었는지 확인해 주세요"
:::
