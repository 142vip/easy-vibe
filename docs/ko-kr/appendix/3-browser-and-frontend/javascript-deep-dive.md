# JavaScript 심층 원리

::: tip 머리말
HTML과 CSS를 배워서 보기 좋은 웹페이지를 만들 수 있게 되었습니다. 하지만 이런 경험을 해보셨을 겁니다: 버튼을 클릭해도 반응이 없고, 폼을 작성해도 제출이 안 되며, 웹페이지가 마치 "정적인" 그림처럼 느껴집니다.

이것이 바로 JavaScript가 필요한 이유입니다. JavaScript는 웹페이지를 "살아 움직이게" 만듭니다. 버튼을 클릭하면 메뉴가 나타나고, 텍스트를 입력하면 실시간 검색이 되고, 페이지를 스크롤하면 더 많은 콘텐츠가 로드됩니다… 이러한 인터랙티브 효과는 모두 JavaScript 덕분입니다.

vibecoding에서는 AI가 대부분의 코드를 작성해 줍니다. 하지만 최소한 코드가 무엇을 하는지 이해할 수는 있어야 합니다. 그렇지 않으면 AI가 잘못 작성한 코드를 발견하지 못할 테니까요. 이 글을 읽고 나면 다음을 할 수 있게 됩니다:

- AI가 작성한 코드가 무엇을 하는지 이해하기
- 코드의 어디에 문제가 있는지 파악하기
- 명확한 표현으로 AI에게 어떻게 수정할지 전달하기
:::

**이 글에서 무엇을 배우나요?**

| 장 | 내용 | 배우고 나면 할 수 있는 것 |
|-----|------|-----------|
| **제1장** | JavaScript란 무엇인가 | 웹페이지에서 어떤 역할을 하는지 이해하기 |
| **제2장** | 데이터와 변수 | 프로그램이 어떻게 데이터를 저장하고 사용하는지 알기 |
| **제3장** | 함수와 로직 | 코드의 판단, 반복, 재사용 로직 이해하기 |
| **제4장** | DOM과 이벤트 | 코드가 어떻게 웹페이지를 제어하고 사용자 동작에 응답하는지 알기 |
| **제5장** | 실전 팁 | AI 코드를 읽는 방법, 오류가 발생했을 때 어떻게 말할지 |

각 장은 "코드를 식별하는 것"부터 시작하며, 직접 작성할 필요는 없습니다. 이해되지 않는 코드가 있으면 언제든지 다시 찾아보세요.

---

## 1. JavaScript란 개요
::: tip 🤔 핵심 질문
**왜 웹페이지에 JavaScript가 필요할까요?** HTML과 CSS로 이미 웹페이지에 콘텐츠와 스타일을 적용할 수 있는데, 왜 새로운 언어를 배워야 할까요?
:::

### 1.1 "정적 웹페이지"에서 "동적 애플리케이션"으로

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📄 JavaScript가 없는 웹페이지**
- 콘텐츠가 고정되어 있고 인터랙션이 불가능
- 버튼을 클릭해도 반응 없음
- 폼을 작성해도 제출 불가
- 페이지가 자동으로 업데이트되지 않음

*마치 종이 포스터처럼, 보기만 할 수 있음*

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 JavaScript가 있는 웹페이지**
- 버튼 클릭 시 메뉴 팝업
- 텍스트 입력 시 실시간 검색
- 스크롤 시 자동 콘텐츠 로드
- 데이터 실시간 업데이트 표시

*마치 진짜 애플리케이션처럼*

</div>
</div>

**세 기술의 관계를 한 문장으로 이해하기:**

| 기술 | 비유 | 역할 |
|------|------|------|
| **HTML** | 뼈대 | 웹페이지의 구조와 콘텐츠 정의 |
| **CSS** | 피부 | 웹페이지의 외관과 스타일 정의 |
| **JavaScript** | 근육과 신경계 | 웹페이지가 응답하고, 인터랙션하고, 사고할 수 있게 함 |

### 1.2 왜 vibecoding에도 JavaScript 이해 도입 동기
::: warning JavaScript를 막 배운 개발자의 실수담
JavaScript를 막 배운 한 개발자가 AI로 "카운터" 앱을 만들었습니다: 버튼을 클릭하면 숫자가 1씩 증가하는 앱이었죠. AI가 생성한 코드는 정상적으로 작동했습니다.

그런데 "클릭할 때마다 2씩 증가"하도록 바꾸고 싶어서 AI에게 "클릭할 때마다 2를 더해줘"라고 말했습니다. AI가 코드를 수정했지만, 숫자는 여전히 1만 증가했습니다.

그는 AI에게 왜 효과가 없는지 물었고, AI가 설명을 해줬지만 코드의 `count = count + 1`이 무엇을 의미하는지 이해하지 못했고, AI가 정말 그 부분을 수정했는지도 알 수 없었습니다. 계속 "2를 더하는 게 안 돼"라고만 말할 수밖에 없었고, AI는 여러 버전을 수정했지만 어떤 것은 초기값을 2로 바꾸고, 어떤 것은 전혀 관련 없는 곳에 2를 추가했습니다.

결국 그는 제2장의 "변수" 개념을 읽고 나서 `count = count + 1`이 count의 값을 1 증가시켜 다시 저장하는 것임을 이해했습니다. 그리고 AI에게 이렇게 말했습니다: "`count + 1`을 `count + 2`로 바꿔줘."

한 번에 수정이 완료되었습니다.

**이것이 JavaScript를 이해해야 하는 이유입니다 — 직접 코드를 작성하기 위해서가 아니라, AI가 제대로 수정하지 못했을 때 문제를 한눈에 알아보고 핵심을 정확히 짚어 말할 수 있기 위해서입니다.**
:::

### 1.3 미리 보기: 실제 AI 코드 한 조각

깊이 배우기 전에, AI가 생성한 실제 코드를 먼저 살펴보겠습니다. 이해하지 못해도 걱정하지 마세요. 전체적인 느낌만 가져가면 됩니다. 각 부분은 뒤에서 하나씩 설명할 예정입니다.

**시나리오**: "버튼 클릭으로 배경색 전환" 기능 만들기

```javascript
// 색상 배열 정의
const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']
let currentIndex = 0

// 페이지에서 버튼 찾기
const button = document.querySelector('#changeBtn')

// 버튼에 클릭 이벤트 추가
button.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % colors.length
  document.body.style.backgroundColor = colors[currentIndex]
})
```

**이 코드는 무엇을 하고 있나요?**

| 코드 | 역할 | 해당 장 |
|------|------|----------|
| `const colors = [...]` | 색상 데이터 배열 정의 | 제2장: 배열 |
| `let currentIndex = 0` | 현재 몇 번째 색상인지 기록 | 제2장: 변수 |
| `document.querySelector(...)` | 페이지에서 버튼 찾기 | 제4장: DOM 탐색 |
| `button.addEventListener(...)` | 버튼에 클릭 이벤트 추가 | 제4장: 이벤트 리스닝 |
| `() => {...}` | 클릭 후 실행할 코드 정의 | 제3장: 화살표 함수 |

::: info 💡 핵심 통찰
지금 모든 코드 줄을 이해할 필요는 없습니다. 이것만 기억하세요: **JavaScript 코드는 "사용자가 어떤 행동을 할 때, 무엇이 일어나야 하는지"를 브라우저에게 알려주는 일련의 명령어입니다.**
:::

---

## 2. 데이터편: 변수와 데이터 타입

::: tip 🤔 핵심 질문
**프로그램은 어떻게 데이터를 "기억"할까요?** 사용자가 입력한 내용, 서버에서 가져온 데이터, 계산 과정의 중간 결과 — 이 모든 정보는 어디에 저장될까요?
:::

### 2.1 변수: 데이터에 이름 붙이기

**변수는 라벨이 붙은 상자와 같습니다** — 데이터를 넣어두고, 나중에 라벨로 꺼내 쓸 수 있습니다.

```javascript
const name = "홍길동"   // 이름은 변하지 않으므로 const
let age = 25            // 나이는 변할 수 있으므로 let
```

**왜 const와 let을 구분해야 할까요?**

생각해 보세요: 주민등록번호(const)는 평생 변하지 않지만, 나이(let)는 매년 변합니다. JavaScript는 이런 "변함과 변하지 않음"의 의도를 표현하기 위해 서로 다른 키워드를 제공합니다.

| 키워드 | 수정 가능 여부 | 사용 상황 | 예시 |
|--------|---------|----------|------|
| `const` | ❌ 불가능 | 값이 변하지 않는 데이터 | 주민번호, 설정 항목, 색상 목록 |
| `let` | ✅ 가능 | 값이 변하는 데이터 | 카운터, 현재 선택된 옵션, 사용자 입력 |

::: details 🔍 구체적인 예시 보기
```javascript
// const 사용: 이 값들은 변하지 않음
const PI = 3.14159
const MAX_USERS = 100
const APP_NAME = "TodoList"

// let 사용: 이 값들은 변할 수 있음
let count = 0
count = 1  // ✅ 수정 가능

count = count + 1  // ✅ 기존 값을 기반으로 계산 가능

// const를 사용하면 어떻게 될까?
const fixedCount = 0
fixedCount = 1  // ❌ 오류! const는 재할당할 수 없음
```
:::

👇 **직접 해보기**: 아래 코드를 수정하여 const와 let의 차이를 확인해보세요

<VariableBoxDemo />

### 2.2 데이터 타입: JavaScript에 존재하는 여러 종류의 "데이터"

JavaScript는 데이터를 여러 타입으로 분류합니다. 가장 자주 사용되는 세 가지는 다음과 같습니다:

| 타입 | 설명 | 예시 | 실제 사용 상황 |
|------|------|------|----------|
| `string` (문자열) | 텍스트 콘텐츠 | `"hello"`, `'안녕'` | 사용자 이름, 상품 설명, 안내 메시지 |
| `number` (숫자) | 수치 | `42`, `3.14` | 가격, 수량, 평점 |
| `boolean` (불리언) | 참/거짓 | `true`, `false` | 로그인 여부, 완료 여부, 표시 여부 |

**알아두어야 할 두 가지 특수값:**

- `undefined` → 변수가 선언되었지만 아직 값이 할당되지 않음
- `null` → 의도적으로 비워둠 ("여기에 값이 없음"을 나타냄)

::: details 🔍 템플릿 문자열: 더 편리하게 텍스트 연결하기
AI 코드에서 백틱(`` ` ``)으로 감싸고 `${...}`이 포함된 문자열을 자주 보게 될 것입니다:

```javascript
const name = "홍길동"
const age = 25

// 전통적인 방식 (번거로움)
const message = "저는 " + name + "이고, 올해 " + age + "살입니다"

// 템플릿 문자열 (간결함)
const message = `저는 ${name}이고, 올해 ${age}살입니다`
// 결과: "저는 홍길동이고, 올해 25살입니다"
```

**식별 포인트**: 백틱과 `${}`을 보면 변수를 텍스트에 삽입하고 있다는 뜻입니다.
:::

### 2.3 객체와 배열: 데이터를 체계적으로 정리하기

**객체 = 이름이 있는 속성들의 집합** (개인 정보 표와 같음)

```javascript
const user = {
  name: "홍길동",
  age: 25,
  isVIP: true
}

// 점 표기법으로 속성 접근
console.log(user.name)    // "홍길동"
console.log(user.age)     // 25
```

**배열 = 순서가 있는 데이터 집합** (목록과 같음)

```javascript
const colors = ['빨강', '초록', '파랑']

// 인덱스로 접근 (0부터 시작)
console.log(colors[0])  // "빨강"
console.log(colors[1])  // "초록"
```

**중첩 구조: 객체 안에 배열, 배열 안에 객체**

이것은 AI 코드에서 가장 흔히 볼 수 있는 데이터 구조입니다:

```javascript
const todos = [
  { id: 1, text: "JavaScript 배우기", done: false },
  { id: 2, text: "프로젝트 진행", done: true },
  { id: 3, text: "문서 작성", done: false }
]

// 접근: 먼저 배열의 0번째 항목을 가져온 후, 그 text 속성을 가져옴
console.log(todos[0].text)  // "JavaScript 배우기"
```

::: info 💡 식별 팁
- `{}`를 보면 → 이것은 객체, 안에는 `이름: 값` 쌍이 있음
- `[]`를 보면 → 이것은 배열, 안에는 순서대로 정렬된 값들이 있음
- `data[0].name`을 보면 → 먼저 배열의 0번째 항목을 가져온 후, 그 name 속성을 가져옴
:::

### 2.4 값과 참조: 쉽게 빠지는 함정

이것은 초보자가 가장 자주 마주치는 문제 중 하나입니다!

**기본 타입(string, number, boolean) 할당 = 완전히 새로운 데이터 복사:**

```javascript
let a = 10
let b = a      // b는 a의 복사본을 가짐
b = 20
console.log(a) // 10 (a는 영향을 받지 않음)
```

**객체와 배열 할당 = "주소"를 복사 (같은 대상을 가리킴):**

```javascript
let user1 = { name: "홍길동" }
let user2 = user1      // user2는 같은 객체를 가리킴
user2.name = "김철수"   // user2를 수정하면 user1도 영향을 받음
console.log(user1.name) // "김철수" (user1도 바뀌었다!)
```

**왜 복사본을 만들어야 할까?**

React/Vue에서는 데이터를 직접 수정하면 UI가 업데이트되지 않습니다. 그래서 AI 코드에서 `[...array]`나 `{...obj}`를 자주 보게 됩니다 — 서로 영향을 주지 않도록 복사본을 만드는 것입니다.

```javascript
// 전개 연산자로 복사본 생성
const arr1 = [1, 2, 3]
const arr2 = [...arr1]     // 새 배열 생성
arr2.push(4)
console.log(arr1)          // [1, 2, 3] (영향 없음)
console.log(arr2)          // [1, 2, 3, 4]
```

👇 **직접 해보기**: 복사본을 수정할 때 원본 데이터의 변화를 관찰해보세요

<ReferenceDemo />

### 2.5 구조 분해와 전개: 현대 JavaScript의 빠른 작성법

이 두 문법은 AI 코드 어디에나 등장하므로, 모르면 코드를 읽을 수 없습니다.

**구조 분해 할당: 객체나 배열에서 빠르게 데이터 추출하기**

```javascript
const user = { name: "홍길동", age: 25, city: "서울" }

// 전통적인 방식 (번거로움)
const name = user.name
const age = user.age

// 구조 분해 방식 (간결함)
const { name, age } = user
// 효과는 같지만, 한 줄로 해결
```

**전개 연산자: 복사하면서 확장하기**

```javascript
// 배열 복사 후 새 요소 추가
const arr1 = [1, 2, 3]
const arr2 = [...arr1, 4, 5]  // [1, 2, 3, 4, 5]

// 객체 복사 후 새 속성 추가
const user1 = { name: "홍길동", age: 25 }
const user2 = { ...user1, city: "서울" }
// { name: "홍길동", age: 25, city: "서울" }
```

::: info 💡 식별 팁
- `const { name, age } = person`을 보면 → person 객체에서 name과 age를 추출
- `...array` 또는 `...obj`를 보면 → 배열이나 객체를 펼쳐서 평탄화
- 직접 작성할 수 있을 필요는 없지만, 반드시 읽을 수는 있어야 함
:::

---

## 3. 로직편: 함수와 흐름 제어

::: tip 🤔 핵심 질문
**코드는 어떻게 "판단"하고 "반복 작업"을 할까요?** 프로그램은 조건에 따라 다른 작업을 실행해야 하고, 특정 작업을 반복해야 할 때도 있습니다 — 이런 로직은 어떻게 표현할까요?
:::

### 3.1 조건문: 만약...하면...그렇지 않으면...

**if/else: 가장 기본적인 조건 판단**

```javascript
const age = 18

if (age >= 18) {
  console.log("성인")
} else {
  console.log("미성년자")
}
```

**삼항 연산자: 축약된 if/else**

```javascript
// 전체 작성 (4줄)
let message
if (age >= 18) {
  message = "성인"
} else {
  message = "미성년자"
}

// 삼항 연산자 (1줄)
const message = age >= 18 ? "성인" : "미성년자"
// 형식: 조건 ? 조건이 참일 때의 값 : 조건이 거짓일 때의 값
```

**&& 단축 평가: React 코드에서 자주 보임**

```javascript
// isLoggedIn이 true일 때만 사용자 패널 표시
isLoggedIn && <UserPanel />

// 다음과 동일
if (isLoggedIn) {
  return <UserPanel />
}
```

::: info 💡 식별 팁
- `? :`을 보면 → 삼항 연산자, 축약된 if/else
- `&&`를 보면 → 앞이 true일 때만 뒤를 실행
:::

### 3.2 함수: 작업을 패키지로 묶기

**함수 = 요리 레시피**

- 함수 정의 = 레시피 작성
- 함수 호출 = 레시피대로 요리하기
- 매개변수 = 재료
- 반환값 = 완성된 요리

```javascript
// 함수 정의 (레시피 작성)
function greet(name) {
  return "Hello " + name
}

// 함수 호출 (레시피대로 요리)
console.log(greet("홍길동"))  // "Hello 홍길동"
console.log(greet("김철수"))  // "Hello 김철수"
```

**세 가지 작성법, 한눈에 식별하기:**

```javascript
// 1. function 선언 (전통적인 방식)
function greet(name) {
  return "Hello " + name
}

// 2. 화살표 함수 (AI 코드에서 가장 많이 사용)
const greet = (name) => {
  return "Hello " + name
}

// 3. 화살표 함수 축약 (한 줄일 때)
const greet = (name) => "Hello " + name
```

👇 **직접 해보기**: 다른 이름을 입력하여 함수가 어떻게 작동하는지 확인해보세요

<FunctionMachineDemo />

::: info 💡 식별 팁
- `function` 또는 `=>`을 보면 → 이것은 함수
- `fn()`을 보면 → 이 함수를 호출 중
- `() => {}`를 보면 → 화살표 함수, 현대 JS의 주류 작성 방식
:::

### 3.3 배열 메서드: 리스트 처리를 위한 강력한 도구

React/Vue에서는 거의 모든 리스트 렌더링에 이 메서드들이 사용됩니다.

```javascript
const todos = [
  { id: 1, text: "공부", done: false },
  { id: 2, text: "업무", done: true }
]

// .map(): 배열의 각 항목을 다른 것으로 변환
const texts = todos.map(todo => todo.text)
// ["공부", "업무"]

// .filter(): 조건에 맞는 항목만 걸러내기
const unfinished = todos.filter(todo => !todo.done)
// [{ id: 1, text: "공부", done: false }]

// .find(): 조건에 맞는 첫 번째 항목 찾기
const found = todos.find(todo => todo.id === 1)
// { id: 1, text: "공부", done: false }
```

::: info 💡 식별 팁
- `.map()`을 보면 → 배열을 변환하여 새 배열 반환
- `.filter()`를 보면 → 배열 필터링
- `items.map(item => <li>{item.name}</li>)`을 보면 → 각 데이터 항목을 리스트 태그로 변환
:::

### 3.4 스코프: 변수의 "가시 범위"

**"방" 비유로 이해하기:**

- 함수 내부의 변수는 방 안의 물건과 같아서, 밖에서는 보이지 않습니다
- 하지만 방 안에 있는 사람은 복도(외부 스코프)의 물건을 볼 수 있습니다

```javascript
const global = "전역 변수"  // 복도에 있는 물건

function room() {
  const local = "방 안의 물건"  // 방 안의 물건
  console.log(global)  // ✅ 복도가 보임
}

console.log(local)  // ❌ 오류! 밖에서는 방 안의 물건이 보이지 않음
```

**핵심 직관:** 코드가 어디에 작성되었는지에 따라, 어떤 변수에 접근할 수 있는지가 결정됩니다.

👇 **직접 해보기**: 다양한 스코프를 클릭하여 어떤 변수에 접근할 수 있는지 확인해보세요

<ScopeDemo />

### 3.5 클로저: 함수가 자신이 탄생한 환경을 "기억"한다

**독립된 개념으로 생각하지 말고, 구체적인 상황에서 이해하세요:**

```javascript
function setupCounter() {
  let count = 0  // 이 변수는 함수 내부에 있음

  return {
    add: () => { count++; return count },
    getCount: () => count
  }
}

const counter = setupCounter()
console.log(counter.add())      // 1
console.log(counter.add())      // 2
console.log(counter.getCount()) // 2
```

**핵심 직관:** 함수는 생성될 때 주변 변수를 "기억"하며, 외부 함수가 이미 실행을 마쳤더라도 그 변수에 계속 접근할 수 있습니다.

👇 **직접 해보기**: 클로저가 어떻게 함수가 상태를 "기억"하게 하는지 관찰해보세요

<ClosureDemo />

### 3.6 this: 함수가 누구에 의해 호출되었는가

**복잡한 바인딩 규칙은 다루지 않고, 가장 흔한 시나리오만 설명합니다:**

**시나리오 1: 객체의 메서드 안에서, this는 그 객체를 가리킵니다**

```javascript
const user = {
  name: "홍길동",
  sayHi() {
    console.log("안녕하세요, 저는 " + this.name)  // this는 user를 가리킴
  }
}
user.sayHi()  // "안녕하세요, 저는 홍길동"
```

**시나리오 2: 이벤트 리스너 안에서, this는 이벤트를 발생시킨 요소를 가리킵니다**

```javascript
button.addEventListener('click', function() {
  console.log(this)  // this는 button 요소를 가리킴
})

// 하지만 화살표 함수는 this를 변경하지 않음
button.addEventListener('click', () => {
  console.log(this)  // this는 외부의 this를 가리킴
})
```

::: info 💡 문제가 생기면 어떻게 해야 할까?
AI 코드에서 this 관련 버그가 발생하면(예: `Cannot read property of undefined`), AI에게 이렇게 말하세요: "이 메서드의 this가 잘못 가리키고 있어요. 화살표 함수로 바꾸거나 bind를 사용해 주세요"
:::

---

## 4. 인터랙션편: DOM, 이벤트와 비동기

::: tip 🤔 핵심 질문
**JavaScript는 어떻게 웹페이지와 "상호작용"할까요?** 페이지의 요소를 어떻게 찾을까요? 사용자의 클릭, 입력에 어떻게 응답할까요? 서버에서 데이터를 어떻게 가져올까요?
:::

### 4.1 DOM: JavaScript가 바라보는 웹페이지

웹페이지는 JavaScript의 눈에 하나의 "트리"로 보입니다. 각 HTML 태그는 트리 위의 "노드"입니다.

```html
<html>
  <body>
    <h1>제목</h1>
    <p>단락</p>
    <ul>
      <li>항목1</li>
      <li>항목2</li>
    </ul>
  </body>
</html>
```

**JS로 웹페이지 조작하기 = 노드 찾기 + 노드 수정하기 + 노드 생성/삭제하기**

👇 **직접 해보기**: 노드를 클릭하여 DOM 트리가 어떻게 구성되어 있는지 확인해보세요

<DOMTreeDemo />

### 4.2 요소 찾기와 수정하기

**요소 찾기:**

```javascript
// CSS 선택자로 찾기 (가장 자주 사용)
const title = document.querySelector('h1')      // 첫 번째 h1 찾기
const button = document.querySelector('#btn')   // id="btn"인 요소 찾기
const items = document.querySelectorAll('.item') // class="item"인 모든 요소 찾기
```

**요소 수정하기:**

```javascript
// 텍스트 변경
title.textContent = "새 제목"

// 스타일 변경
element.style.color = "red"
element.style.fontSize = "20px"

// CSS 클래스 변경
element.classList.add('active')      // 클래스 추가
element.classList.remove('hidden')   // 클래스 제거
element.classList.toggle('open')     // 클래스 토글 (있으면 제거, 없으면 추가)
```

::: info 💡 식별 팁
- `document.querySelector`를 보면 → 웹페이지 요소를 찾는 중
- `.textContent`를 보면 → 텍스트 변경
- `.style.xxx`를 보면 → 스타일 변경
- `.classList.add/remove/toggle`을 보면 → CSS 클래스 변경
:::

### 4.3 이벤트: 사용자가 어떤 동작을 했을 때...

**addEventListener: 요소에 이벤트 리스너 추가하기**

```javascript
button.addEventListener('click', () => {
  console.log("버튼이 클릭되었습니다")
})
```

**주요 이벤트:**

| 이벤트 | 발생 시점 | 실제 사용 상황 |
|------|---------|----------|
| `click` | 클릭 | 버튼 클릭, 링크 이동 |
| `input` | 입력창 내용 변경 | 실시간 검색, 폼 유효성 검사 |
| `submit` | 폼 제출 | 로그인, 회원가입, 데이터 제출 |
| `scroll` | 페이지 스크롤 | 지연 로딩, 맨 위로 이동 |

**이벤트 객체: 더 많은 정보 얻기**

```javascript
input.addEventListener('input', (e) => {
  console.log(e.target.value)  // 입력창의 값 가져오기
  e.preventDefault()            // 기본 동작 막기 (예: 폼 제출 후 페이지 새로고침)
})
```

::: info 💡 실제 응용
버튼에 기능을 추가하고 싶다면, 본질적으로 AI에게 이렇게 말하는 것입니다: "이 버튼에 클릭 이벤트를 추가하고, 클릭하면 어떤 작업을 실행해 주세요"
:::

### 4.4 비동기: 왜 어떤 작업은 즉시 완료되지 않을까

**레스토랑 비유:**

주문한 후 주방 앞에서 서서 기다릴 필요 없이, 다른 일을 먼저 할 수 있습니다. 음식이 준비되면 웨이터가 가져다 줍니다.

**가장 흔한 시나리오: 서버에서 데이터 가져오기**

```javascript
// 동기 방식 (페이지가 멈추므로 사용 금지)
const data = fetch('/api/data')  // ❌ 이렇게 작성하면 멈춤

// 비동기 방식 (올바름)
async function loadData() {
  try {
    const response = await fetch('/api/data')
    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.error('오류 발생:', error)
  }
}
```

**async/await 문법:**

- `async` → 이 함수 안에 비동기 작업이 있음을 표시
- `await` → 이 작업이 완료될 때까지 기다림 (하지만 페이지가 멈추지는 않음)
- `try/catch` → 발생 가능한 오류 처리

👇 **직접 해보기**: 비동기 작업의 실행 순서를 관찰해보세요

<AsyncRestaurantDemo />

::: info 💡 식별 팁
- `async/await`을 보면 → 시간이 걸리는 작업을 기다리는 중
- `fetch()`를 보면 → 서버에서 데이터를 가져오는 중
- `try/catch`를 보면 → 발생 가능한 오류를 처리하는 중
:::

### 4.5 이벤트 루프: JavaScript는 실제로 어떻게 작동할까

**"마이크로태스크/매크로태스크"라는 용어 대신, 간단한 모델로 이해하세요:**

**JS는 "1인 작업대"입니다**, 한 번에 한 가지 일만 하지만, "할 일 메모판"(태스크 큐)이 있습니다.

기다려야 하는 작업(네트워크 요청, 타이머)을 만나면, JS는 멍하니 기다리지 않고 "기다린 후에 할 일"을 메모판에 붙여두고 계속 아래로 실행합니다. 현재 할 일이 끝나면 그제야 메모판을 확인합니다.

```javascript
console.log("1")

setTimeout(() => console.log("2"), 0)  // 0초라도 지연됨

console.log("3")

// 출력: 1, 3, 2 (1, 2, 3이 아니다!)
```

**왜 그럴까?**
1. `console.log("1")` 실행 → 1 출력
2. `setTimeout`을 만남 → 콜백을 메모판에 붙이고 계속 진행
3. `console.log("3")` 실행 → 3 출력
4. 현재 코드 실행 완료, 메모판 확인
5. `setTimeout`의 콜백 실행 → 2 출력

👇 **직접 해보기**: 코드의 실행 순서를 관찰해보세요

<JSEventLoopDemo />

::: info 💡 문제가 생기면 어떻게 해야 할까?
AI 코드에서 데이터를 가져오기도 전에 페이지가 렌더링된다면, AI에게 이렇게 말하세요: "데이터가 아직 로드되지 않았는데 렌더링이 시작됐어요. loading 상태를 추가해서 데이터가 도착한 후에 렌더링하도록 해 주세요"
:::

### 4.6 모듈: import와 export

AI가 생성한 React/Vue 코드의 첫 줄은 거의 항상 `import`입니다.

**import = 다른 파일에서 기능 가져오기**

```javascript
// 유틸 파일에서 함수 가져오기
import { formatDate } from './utils'

// 서드파티 패키지에서 가져오기
import React from 'react'
import { useState } from 'react'
```

**export = 기능을 외부에 노출하여 다른 곳에서 사용할 수 있게 하기**

```javascript
// utils.js
export function formatDate(date) {
  // ...
}

// 또는 기본 내보내기
export default function formatDate(date) {
  // ...
}
```

**npm 패키지 = 다른 사람이 작성한 도구, 설치하면 사용 가능**

```javascript
// 패키지 설치: npm install lodash
// 패키지 사용
import _ from 'lodash'
```

::: info 💡 식별 팁
- `import`를 보면 → 다른 파일에서 기능을 가져오는 중
- `export`를 보면 → 기능을 외부에 노출하는 중
- `from 'react'`를 보면 → React 패키지에서 가져오는 중
- `from './utils'`를 보면 → 로컬 파일에서 가져오는 중
:::

---

## 5. 실전편: 코드 읽기, 오류 이해하기, 정확하게 설명하기

::: tip 🤔 핵심 질문
**앞에서 많은 문법을 배웠는데, 실제로 AI 코드를 받았을 때 어떻게 활용할까요?** 코드를 빠르게 읽는 방법은? 오류가 발생하면 어떻게 할까? AI에게 정확하게 코드 수정을 요청하는 방법은?
:::

### 5.1 AI 코드를 받은 후 읽는 방법

**4단계 방법:**

| 단계 | 무엇을 볼까 | 예시 |
|------|--------|------|
| **1단계: 전체 구조 파악** | 몇 개의 함수가 있는가? 각각 무엇을 하는가? | `loadData()` 데이터 로드, `renderList()` 리스트 렌더링 |
| **2단계: 진입점 찾기** | 프로그램이 어디서 실행을 시작하는가? | `addEventListener('click', ...)` 클릭 시 시작 |
| **3단계: 데이터 흐름 추적** | 데이터가 어디서 와서 어디로 가는가? | API에서 가져오기 → 파싱 → 페이지에 렌더링 |
| **4단계: 세부 로직 확인** | 구체적인 함수 내에서 어떻게 처리하는가? | 반복문, 조건문, 계산 |

**제1장의 코드 예시로 완전한 "읽기 데모"를 해보겠습니다:**

```javascript
// 1단계: 전체 구조
// - 색상 배열 하나
// - 현재 인덱스를 기록하는 변수 하나
// - 버튼의 클릭 이벤트 하나

// 2단계: 진입점
// button.addEventListener('click', ...) → 버튼 클릭 시 실행

// 3단계: 데이터 흐름
// colors (색상 배열) → currentIndex (현재 인덱스) → backgroundColor (배경색)

// 4단계: 세부 로직
// currentIndex = (currentIndex + 1) % colors.length
// 이 공식의 의미: 매번 +1, 하지만 배열 길이를 넘지 않음 (순환)
```

### 5.2 자주 발생하는 오류 빠른 참조

| 오류 | 쉬운 설명 | AI에게 어떻게 말할까 |
|------|-----------|-------------|
| `TypeError: Cannot read properties of undefined` | 존재하지 않는 것에서 값을 가져오려고 함 | "X번째 줄에서 오류 발생,某某 변수가 undefined입니다. 할당 로직을 확인해 주세요" |
| `ReferenceError: xxx is not defined` | 선언되지 않은 변수명을 사용함 | "변수 xxx가 정의되지 않았습니다. 철자가 틀렸거나 import를 잊은 건 아닌지 확인해 주세요" |
| `TypeError: xxx is not a function` | 함수가 아닌 것을 함수로 호출함 | "xxx는 함수가 아닙니다. 타입과 출처를 확인해 주세요" |
| `SyntaxError: Unexpected token` | 문법 오류 (괄호 불일치, 쉼표 누락 등) | "X번째 줄에 문법 오류가 있습니다. 괄호와 구두점을 확인해 주세요" |
| `CORS error` | 브라우저가 교차 출처 요청을 차단함 | "CORS 오류가 발생했습니다. 교차 출처 리소스 공유 설정이 필요합니다" |
| `404 Not Found` | 요청한 리소스가 존재하지 않음 | "API가 404를 반환합니다. 인터페이스 주소가 올바른지 확인해 주세요" |

### 5.3 문제를 정확하게 설명 접근법
초보자와 숙련된 개발자의 차이는 종종 **문제 설명의 정확도**에서 드러납니다.

| ❌ 나쁜 설명 | ✅ 좋은 설명 |
|-----------|-----------|
| "코드에 버그가 있어요" | "삭제 버튼을 클릭하면 현재 항목이 아니라 마지막 항목이 삭제됩니다" |
| "스타일이 이상해요" | "제목이 가운데 정렬되어야 하는데 지금은 왼쪽 정렬입니다" |
| "데이터가 표시되지 않아요" | "fetch 요청이 데이터를 반환했고(콘솔에서 확인됨), 하지만 페이지가 다시 렌더링되지 않습니다" |
| "기능 하나 추가해 주세요" | "사용자 목록 페이지에 검색창을 추가하고, 입력 시 name 필드 기준으로 실시간으로 리스트를 퍼지 매칭 필터링해 주세요" |
| "클릭해도 반응이 없어요" | "버튼 클릭 시 콘솔에 'Cannot read property of undefined' 오류가 발생하고, 오류는 X번째 줄입니다" |

**실전 연습:**

```javascript
// 버그가 있는 코드
function deleteTodo(index) {
  todos.splice(index, 1)  // 항상 마지막 항목을 삭제함
}

// 오류 현상: 어떤 삭제 버튼을 눌러도 항상 마지막 항목이 삭제됨
```

**❌ 나쁜 설명:** "삭제 기능에 버그가 있어요"

**✅ 좋은 설명:** "삭제 버튼을 클릭하면 현재 항목이 아니라 마지막 항목이 삭제됩니다. 코드에서 splice(index, 1)을 사용하고 있는데, index가 올바르지 않은 것 같습니다. 각 할 일의 고유 id로 매칭하여 삭제하도록 변경해야 합니다."

### 5.4 이제 여러분이 식별할 수 있어야 하는 코드

- `const/let`을 보면 → 변수를 재할당할 수 있는지 알 수 있음
- `{}`를 보면 → 객체 / `[]`를 보면 → 배열
- `{...obj}` 또는 `[...arr]`을 보면 → 복사본을 생성 중
- `function` 또는 `=>`을 보면 → 재사용 가능한 작업을 정의함
- `if/else` 또는 `? :`를 보면 → 코드가 판단을 수행 중
- `.map()` / `.filter()`를 보면 → 배열을 변환하거나 필터링 중
- `document.querySelector`를 보면 → 웹페이지 요소를 찾는 중
- `addEventListener`를 보면 → 사용자 동작을 감지 중
- `async/await`을 보면 → 시간이 걸리는 작업을 기다리는 중
- `import/export`를 보면 → 모듈을 가져오거나 내보내는 중
- 오류가 발생하면 → 대략적인 의미를 이해하고 AI에게 정확하게 설명할 수 있음

**각 장의 "심층" 부분을 진지하게 읽었다면, 다음 핵심 개념도 마스터한 것입니다:**

- **값 vs 참조**: 기본 타입은 값을 복사하고, 객체/배열은 주소를 복사함
- **스코프와 클로저**: 함수는 자신이 탄생할 때 주변에 있던 변수를 "기억"할 수 있음
- **this의 본질**: 함수가 어디에 작성되었는지가 아니라 누가 호출했는지에 따라 결정됨
- **이벤트 루프**: JS는 싱글 스레드이며, 태스크 큐를 통해 "논블로킹"을 실현함

이 개념들은 문제를 더 빨리 찾는 데 도움이 될 것입니다.

::: info 💡 문제가 생기면 AI에게 이렇게 말하세요
- "X번째 줄에서 XXX 오류가 발생했어요. 무엇이 문제인지 봐주세요"
- "이 함수의 로직은 XXX인데, 결과가 맞지 않아요. XXX이어야 합니다"
- "XXX 기능을 수정하고 싶어요. 구체적인 요구사항은 XXX입니다"
:::