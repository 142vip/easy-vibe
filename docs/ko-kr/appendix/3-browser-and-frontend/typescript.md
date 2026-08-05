# TypeScript 기초

::: tip 머리말
이미 JavaScript를 작성할 수 있지만, 다음과 같은 문제를 겪어본 적이 있을 것입니다:
- 변수에 잘못된 타입을 할당해서 런타임에야 발견
- 객체 속성 이름을 잘못 써서 한참 디버깅
- 함수 매개변수 타입이 맞지 않아 계속 수정

TypeScript는 코드가 실행되기 전에 이런 문제를 발견해주는 도구입니다. 이 글을 읽고 나면 TypeScript가 왜 코드 품질을 높여주는지 이해하고, 타입 어노테이션, 인터페이스, 제네릭 등 핵심 개념을 파악하여 vibecoding에서 AI가 생성한 코드를 더 잘 활용할 수 있습니다.
:::

**이 글에서 배울 내용**

| 장 | 내용 | 배우고 나면 할 수 있는 것 |
|-----|------|-----------|
| **제 1 장** | TypeScript란 무엇인가 | JavaScript와의 관계를 이해 |
| **제 2 장** | 기본 타입 어노테이션 | 변수에 타입을 표시하는 방법 |
| **제 3 장** | 객체 타입과 인터페이스 | 데이터 구조의 타입 정의 |
| **제 4 장** | 함수 타입 | 함수 매개변수와 반환값에 타입 지정 |
| **제 5 장** | 제네릭 | 재사용 가능한 타입 안전 코드 작성 |
| **제 6 장** | 타입 추론과 실용 팁 | 명시적 어노테이션이 필요한 시점 파악 |

---

## 1. TypeScript란 개요
::: tip 🤔 핵심 질문
**JavaScript만으로도 충분한데 왜 TypeScript가 필요할까요?** 새로운 문법을 배울 가치가 있을까요?
:::

### 1.1 "런타임 오류"에서 "컴파일 타임 발견"으로

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🔴 JavaScript의 문제점**
- 런타임에야 타입 오류 발견
- 오타를 알아채기 어려움
- 리팩토링 시 누락되기 쉬움
- IDE 자동 완성이 부정확

*마치 맞춤법 검사가 없는 문서 편집기 같음*

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**✅ TypeScript의 장점**
- 코드 작성 시점에 오류 발견
- 더 정확한 인텔리센스
- 더 안전한 리팩토링
- 더 유지보수하기 쉬운 코드

*마치 맞춤법 검사와 문법 하이라이트가 있는 편집기 같음*

</div>
</div>

**두 기술의 관계를 한 문장으로 이해하기:**

| 기술 | 비유 | 역할 |
|------|------|------|
| **JavaScript** | 원자재 | 직접 실행 가능한 코드 |
| **TypeScript** | 설계도 + 품질 검사 | JavaScript에 타입 검사를 추가하고, 최종적으로 JavaScript로 컴파일 |

### 1.2 vibecoding에도 TypeScript가 필요한 이유

::: warning AI가 작성한 코드도 오류가 발생할 수 있습니다
한 개발자가 AI로 사용자 관리 기능을 생성했습니다. AI가 작성한 JavaScript 코드는 실행되었지만, 문제가 있었습니다: 사용자 나이는 숫자여야 하는데, 가끔 문자열로 잘못 할당되곤 했습니다.

결과적으로 "성인 여부"를 계산할 때 문자열 "25"가 문자열로 처리되어 판단이 실패했습니다. 이 버그는 어떤 사용자가 숫자가 아닌 문자를 입력할 때까지 오랫동안 숨겨져 있었습니다.

TypeScript를 사용했다면, 이 코드는 작성 시점에 오류를 발생시켰을 것입니다: `'string' 타입은 'number' 타입에 할당할 수 없습니다`.

**이것이 TypeScript의 가치입니다 — AI가 타입을 잘못 작성했을 때, 가장 먼저 발견할 수 있습니다.**
:::

### 1.3 TypeScript는 실제로 이렇습니다

TypeScript는 완전히 새로운 언어가 아니라, JavaScript의 "슈퍼셋"일 뿐입니다:

```typescript
// 이것은 유효한 JavaScript이자 유효한 TypeScript입니다
const name = "张三"
const age = 25
function greet(user) {
  return `Hello ${user}`
}

// 이것은 TypeScript 고유의 타입 어노테이션입니다
const name2: string = "李四"
const age2: number = 30
function greet2(user: string): string {
  return `Hello ${user}`
}
```

**핵심 이해:**
- 모든 JavaScript 코드는 유효한 TypeScript 코드입니다
- TypeScript는 선택적인 **타입 어노테이션**을 추가합니다
- TypeScript는 최종적으로 JavaScript로 컴파일되어 실행됩니다

::: info 💡 핵심 인사이트
TypeScript는 코드의 실행 방식을 바꾸지 않으며, 컴파일 시점에 타입이 올바른지 검사할 뿐입니다. **TypeScript를 점진적으로 도입할 수 있습니다** — 핵심 변수부터 타입을 추가해 보세요.
:::

---

## 2. 기본 타입 어노테이션

::: tip 🤔 핵심 질문
**TypeScript에게 변수가 어떤 타입이어야 하는지 어떻게 알려줄까요?** 타입 어노테이션 문법은 어떻게 될까요?
:::

### 2.1 타입 어노테이션 문법

타입 어노테이션은 변수 이름 뒤에 `: 타입`을 붙이는 것입니다:

```typescript
// 문법: 변수명: 타입 = 값
const name: string = "张三"
let age: number = 25
let isStudent: boolean = true
```

👇 **직접 해보기**: 변수에 타입 어노테이션 추가하기

<TypeAnnotationDemo />

::: details 🔍 왜 어떤 곳에서는 타입 어노테이션이 필요 없을까요?
TypeScript는 할당된 값을 기반으로 자동으로 타입을 추론할 수 있습니다:

```typescript
// 이것들은 타입 어노테이션이 필요 없습니다, TypeScript가 자동 추론
const name = "张三"      // string으로 추론
const age = 25          // number로 추론
const isActive = true   // boolean으로 추론

// 이런 경우에는 명시적 어노테이션이 필요합니다
let data  // ❌ 오류: 타입을 추론할 수 없음
let data: any  // ✅ 가능하지만, 타입 검사의 이점을 잃음

function add(a, b) {  // ❌ 매개변수 타입이 불명확
  return a + b
}

function add2(a: number, b: number): number {  // ✅ 타입이 명확
  return a + b
}
```
:::

### 2.2 기본 타입

TypeScript는 JavaScript의 모든 기본 타입을 지원합니다:

| 타입 | 설명 | 예시 |
|------|------|------|
| `string` | 문자열 | `"hello"`, `'안녕'` |
| `number` | 숫자 (정수 및 소수) | `42`, `3.14` |
| `boolean` | 불리언 | `true`, `false` |
| `null` / `undefined` | 빈 값 | `null`, `undefined` |
| `array` | 배열 | `number[]`, `string[]` |
| `object` | 객체 | `{ name: string; age: number }` |

**배열 타입의 두 가지 표기법:**

```typescript
// 표기법 1: 타입[] (더 자주 사용)
const numbers: number[] = [1, 2, 3, 4, 5]
const names: string[] = ["张三", "李四", "王五"]

// 표기법 2: Array<타입>
const numbers2: Array<number> = [1, 2, 3, 4, 5]
const names2: Array<string> = ["张三", "李四", "王五"]
```

**특수 타입:**

```typescript
// any: 임의 타입 (신중히 사용, 타입 검사를 끄는 것과 같음)
let data: any = 42
data = "이제 문자열 가능"
data = { name: "张三" }  // 객체도 가능

// unknown: 타입 안전한 any
let value: unknown = 42
// if (typeof value === "number") {
//   console.log(value + 10)  // 먼저 타입을 확인해야 사용 가능
// }

// void: 반환값 없음
function log(message: string): void {
  console.log(message)
}

// never: 절대 반환하지 않음
function error(message: string): never {
  throw new Error(message)
}
```

::: info 💡 식별 팁
- `: string` → string 타입 어노테이션
- `: number[]` → 숫자 배열 어노테이션
- `: void` → 반환값이 없는 함수
:::

---

## 3. 객체 타입과 인터페이스

::: tip 🤔 핵심 질문
**객체의 타입을 어떻게 정의할까요?** 객체의 속성은 어떤 타입이어야 할까요?
:::

### 3.1 인터페이스 (Interface): 객체의 "형태" 정의하기

인터페이스는 TypeScript에서 객체 타입을 정의하는 주요 방법입니다:

```typescript
// User 인터페이스 정의
interface User {
  id: number
  name: string
  email: string
  age?: number  // 선택적 속성
}

// 인터페이스 사용
const user: User = {
  id: 1,
  name: "张三",
  email: "zhangsan@example.com",
  age: 25
}

// age는 선택 사항이므로 제공하지 않아도 됨
const user2: User = {
  id: 2,
  name: "李四",
  email: "lisi@example.com"
}
```

👇 **직접 해보기**: 인터페이스 정의에 맞는 객체 생성하기

<InterfaceDemo />

::: details 🔍 인터페이스의 다른 기능들
```typescript
// 읽기 전용 속성
interface User {
  readonly id: number  // id는 생성 후 수정 불가
  name: string
}

const user: User = {
  id: 1,
  name: "张三"
}

user.id = 2  // ❌ 오류: 읽기 전용 속성은 수정할 수 없음
user.name = "李四"  // ✅ 수정 가능

// 함수 타입
interface User {
  name: string
  greet: () => string  // greet은 string을 반환하는 함수
}

const user: User = {
  name: "张三",
  greet: () => "Hello"
}

// 인터페이스 상속
interface Admin extends User {
  permissions: string[]
}

const admin: Admin = {
  name: "관리자",
  greet: () => "Hello Admin",
  permissions: ["read", "write", "delete"]
}
```
:::

### 3.2 타입 별칭 (Type Alias)

인터페이스 외에도 `type`으로 타입 별칭을 정의할 수 있습니다:

```typescript
// 타입 별칭
type User = {
  id: number
  name: string
  email: string
}

// 유니언 타입
type Status = "pending" | "success" | "error"

const status: Status = "success"  // ✅
// const status2: Status = "failed"  // ❌ 오류: 유니언 타입에 없음

// 인터섹션 타입 (여러 타입 병합)
type User = {
  id: number
  name: string
}

type Timestamp = {
  createdAt: Date
  updatedAt: Date
}

type UserWithTimestamp = User & Timestamp

const user: UserWithTimestamp = {
  id: 1,
  name: "张三",
  createdAt: new Date(),
  updatedAt: new Date()
}
```

**인터페이스 vs 타입 별칭:**

| 특성 | interface | type |
|------|-----------|------|
| 확장 | `extends` | `&` 인터섹션 타입 |
| 중복 선언 | 자동 병합 | 오류 발생 |
| 적합한 용도 | 객체 형태, 클래스 | 유니언 타입, 인터섹션 타입, 기본 타입 별칭 |

::: info 💡 식별 팁
- `interface` → 객체 타입 정의
- `type` → 타입 별칭 생성
- `?` → 선택적 속성
- `readonly` → 읽기 전용 속성
:::

---

## 4. 함수 타입

::: tip 🤔 핵심 질문
**함수의 매개변수와 반환값에 어떻게 타입을 지정할까요?**
:::

### 4.1 매개변수 타입과 반환값 타입

```typescript
// 완전한 함수 타입 어노테이션
function add(a: number, b: number): number {
  return a + b
}

// 화살표 함수
const multiply = (a: number, b: number): number => {
  return a * b
}

// 반환값 없음
function log(message: string): void {
  console.log(message)
}

// 여러 타입 반환 (유니언 타입)
function parseInput(input: string): number | string {
  const num = parseFloat(input)
  return isNaN(num) ? input : num
}
```

### 4.2 선택적 매개변수와 기본 매개변수

```typescript
// 선택적 매개변수 (? 표시)
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name
}

greet("张三")  // "张三"
greet("张三", "선생님")  // "선생님 张三"

// 기본 매개변수
function greet2(name: string, title: string = "친구"): string {
  return `${title} ${name}`
}

greet2("李四")  // "친구 李四"
greet2("李四", "박사님")  // "박사님 李四"
```

### 4.3 함수 타입을 매개변수로

```typescript
// 함수를 매개변수로 받기
function calculate(
  a: number,
  b: number,
  operation: (x: number, y: number) => number
): number {
  return operation(a, b)
}

calculate(10, 5, (x, y) => x + y)  // 15
calculate(10, 5, (x, y) => x * y)  // 50

// 더 명확한 표기법: 함수 타입 먼저 정의
type Operation = (x: number, y: number) => number

function calculate2(
  a: number,
  b: number,
  operation: Operation
): number {
  return operation(a, b)
}
```

::: info 💡 식별 팁
- `(a: number, b: number) => number` → 매개변수와 반환값을 설명하는 함수 타입
- `: void` → 반환값이 없는 함수
- `?` → 선택적 매개변수
:::

---

## 5. 제네릭

::: tip 🤔 핵심 질문
**여러 타입을 처리하면서도 타입 안전성을 유지하는 코드를 어떻게 작성할까요?**
:::

### 5.1 제네릭의 기본 개념

제네릭을 사용하면 함수, 인터페이스, 클래스를 정의할 때 구체적인 타입을 미리 지정하지 않고, 사용 시점에 지정할 수 있습니다:

```typescript
// 제네릭 함수: T는 타입 변수
function identity<T>(arg: T): T {
  return arg
}

// 사용 시 명시적으로 타입 지정
const num1 = identity<number>(42)  // 타입은 number
const str1 = identity<string>("hello")  // 타입은 string

// 타입 추론: TypeScript가 자동 추론
const num2 = identity(42)  // number로 추론
const str2 = identity("hello")  // string으로 추론
```

👇 **직접 해보기**: 제네릭으로 다양한 타입의 데이터 처리하기

<GenericDemo />

### 5.2 제네릭 제약

제네릭이 특정 조건을 만족하도록 제한하기:

```typescript
// T가 length 속성을 반드시 가지도록 제약
interface HasLength {
  length: number
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length)
}

logLength("hello")  // ✅ 문자열은 length가 있음
logLength([1, 2, 3])  // ✅ 배열은 length가 있음
// logLength(42)  // ❌ 숫자는 length 속성이 없음
```

### 5.3 제네릭 인터페이스와 클래스

```typescript
// 제네릭 인터페이스
interface Box<T> {
  value: T
  getValue(): T
}

const numberBox: Box<number> = {
  value: 42,
  getValue: () => 42
}

const stringBox: Box<string> = {
  value: "hello",
  getValue: () => "hello"
}

// 제네릭 클래스
class Storage<T> {
  private items: T[] = []

  add(item: T): void {
    this.items.push(item)
  }

  get(index: number): T {
    return this.items[index]
  }
}

const numberStorage = new Storage<number>()
numberStorage.add(1)
numberStorage.add(2)
// numberStorage.add("string")  // ❌ 오류

const stringStorage = new Storage<string>()
stringStorage.add("hello")
// stringStorage.add(1)  // ❌ 오류
```

::: info 💡 식별 팁
- `<T>` → 제네릭 타입 변수
- `<T extends SomeType>` → 제네릭 제약
- `Array<T>` 또는 `Promise<T>` → 내장 제네릭 타입
:::

---

## 6. 타입 추론과 실용 팁

::: tip 🤔 핵심 질문
**언제 명시적 타입 어노테이션이 필요하고, 언제 추론에 의존해도 될까요?**
:::

### 6.1 타입 추론

TypeScript는 컨텍스트에 따라 자동으로 타입을 추론할 수 있습니다:

```typescript
// 변수 초기화 시 추론
const name = "张三"  // string으로 추론
const age = 25  // number로 추론
const isActive = true  // boolean으로 추론

// 배열 추론
const numbers = [1, 2, 3]  // number[]로 추론
const mixed = [1, "hello", true]  // (number | string | boolean)[]로 추론

// 함수 반환값 추론
function add(a: number, b: number) {
  return a + b  // 반환값을 number로 추론
}
```

👇 **직접 해보기**: TypeScript가 타입을 추론하는 방식 관찰하기

<TypeInferenceDemo />

### 6.2 명시적 타입 어노테이션을 사용해야 할 때

::: details 타입 추론을 권장하는 경우
```typescript
// ✅ 권장: 단순한 리터럴 할당
const count = 0
const name = "张三"
const isActive = true

// ✅ 권장: 함수 반환값을 추론할 수 있는 경우
function getUserId(user: User) {
  return user.id  // number로 추론
}
```
:::

::: details 명시적 어노테이션을 권장하는 경우
```typescript
// ✅ 권장: 함수 매개변수 (필수)
function add(a: number, b: number) {
  return a + b
}

// ✅ 권장: 객체 속성 타입이 불명확한 경우
const user: {
  id: number
  name: string
  metadata: Record<string, any>
} = {
  id: 1,
  name: "张三",
  metadata: {}  // {}로 추론될 수 있으므로 명시적 지정 필요
}

// ✅ 권장: 함수 반환 타입이 복잡한 경우
function getUser(): User | null {
  // ...
  return null
}

// ✅ 권장: 공개 API
export function calculateTotal(prices: number[]): number {
  return prices.reduce((sum, price) => sum + price, 0)
}
```
:::

### 6.3 타입 가드

런타임에 타입 검사하기:

```typescript
// typeof 타입 가드
function processValue(value: string | number) {
  if (typeof value === "string") {
    // 여기서 TypeScript는 value가 string임을 앎
    console.log(value.toUpperCase())
  } else {
    // 여기서 TypeScript는 value가 number임을 앎
    console.log(value * 2)
  }
}

// instanceof 타입 가드
class Dog {
  bark() {
    console.log("멍멍")
  }
}

class Cat {
  meow() {
    console.log("야옹")
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark()  // TypeScript는 이것이 Dog임을 앎
  } else {
    animal.meow()  // TypeScript는 이것이 Cat임을 앎
  }
}

// 커스텀 타입 가드
interface User {
  name: string
  email: string
}

function isUser(value: any): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.name === "string" &&
    typeof value.email === "string"
  )
}

function processValue(value: unknown) {
  if (isUser(value)) {
    // 여기서 value는 User
    console.log(value.name)
  }
}
```

### 6.4 실용적인 유틸리티 타입

TypeScript는 몇 가지 내장 유틸리티 타입을 제공합니다:

```typescript
// Partial: 모든 속성을 선택적으로 만듦
interface User {
  id: number
  name: string
  email: string
}

type PartialUser = Partial<User>
// 다음과 동일: { id?: number; name?: string; email?: string }

// Required: 모든 속성을 필수로 만듦
type RequiredUser = Required<PartialUser>
// 다음과 동일: { id: number; name: number; email: string }

// Pick: 지정된 속성만 유지
type UserBasicInfo = Pick<User, "id" | "name">
// 다음과 동일: { id: number; name: string }

// Omit: 지정된 속성 제외
type UserWithoutEmail = Omit<User, "email">
// 다음과 동일: { id: number; name: string }

// Record: 객체 타입 생성
type UserRoles = Record<string, boolean>
// 다음과 동일: { [key: string]: boolean }
```

---

## 7. 실전 팁: vibecoding에서 TypeScript 사용하기

::: tip 🤔 핵심 질문
**AI 지원 개발에서 TypeScript를 어떻게 더 잘 활용할 수 있을까요?**
:::

### 7.1 AI가 타입 안전 코드를 생성하도록 하기

**❌ 좋지 않은 프롬프트:**
```
사용자 관리 기능을 작성해줘
```

**✅ 좋은 프롬프트:**
```
TypeScript를 사용하여 사용자 관리 기능을 작성해줘.

데이터 구조는 다음과 같이 정의:
interface User {
  id: number
  name: string
  email: string
  age: number
}

구현 필요:
1. 사용자 목록 가져오기: User[] 반환
2. 사용자 생성: Partial<User>를 받아 User 반환
3. 사용자 업데이트: id와 Partial<User>를 받아 User 반환
4. 사용자 삭제: id를 받아 void 반환

모든 함수에 완전한 타입 어노테이션이 있는지 확인해줘.
```

### 7.2 TypeScript 오류 메시지 이해하기

**주요 오류와 의미:**

| 오류 메시지 | 의미 | 해결 방법 |
|---------|------|---------|
| `'X' 타입은 'Y' 타입에 할당할 수 없습니다` | X 타입을 Y 타입에 할당할 수 없음 | 타입 일치 여부 확인 또는 타입 변환 |
| `'X' 속성이 'Y' 타입에 존재하지 않습니다` | Y 타입에 X 속성이 없음 | 속성명 철자 확인 또는 해당 속성 정의 |
| `'X' 타입의 인수는 'Y' 타입의 매개변수에 할당할 수 없습니다` | 매개변수 타입 불일치 | 함수 호출 시 매개변수 타입 확인 |
| `'X' 타입에 'Y' 타입의 다음 속성이 없습니다` | X 타입이 Y 타입의 일부 속성을 누락 | 누락된 속성 추가 |

### 7.3 TypeScript 점진적 도입

JavaScript 프로젝트가 있다면, 점진적으로 TypeScript로 마이그레이션할 수 있습니다:

1. **1단계: 파일 확장자를 `.ts`로 변경**
   ```bash
   # utils.js에서 utils.ts로 변경
   mv utils.js utils.ts
   ```

2. **2단계: 명백한 타입 오류 수정**
   ```typescript
   // 'Parameter 'a' implicitly has an 'any' type' 오류가 발생하면
   // 타입 어노테이션 추가
   function add(a: number, b: number) {
     return a + b
   }
   ```

3. **3단계: 점진적으로 타입 정의 추가**
   ```typescript
   // 먼저 any로 빠르게 수정
   function processUser(user: any) {
     // ...
   }

   // 나중에 타입 보완
   interface User {
     id: number
     name: string
   }

   function processUser(user: User) {
     // ...
   }
   ```

4. **4단계: 더 엄격한 타입 검사 활성화**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,  // 엄격 모드 활성화
       "noImplicitAny": true,  // 암시적 any 금지
       "strictNullChecks": true  // 엄격한 null 검사
     }
   }
   ```

---

## 8. 이제 여러분이 식별할 수 있어야 할 코드

- `: string` → string 타입 어노테이션
- `: number[]` → 숫자 배열 어노테이션
- `interface User` → 객체 타입 정의
- `type User =` → 타입 별칭
- `<T>` → 제네릭
- `extends` → 인터페이스 상속 또는 제네릭 제약
- `?` → 선택적 속성
- `readonly` → 읽기 전용 속성
- `|` → 유니언 타입
- `&` → 인터섹션 타입

**각 장의 "심화" 부분을 꼼꼼히 읽었다면, 다음 핵심 개념도 마스터한 것입니다:**

- **타입 어노테이션**: TypeScript에게 변수의 타입을 명시적으로 알려주기
- **인터페이스**: 객체의 구조와 타입 정의하기
- **제네릭**: 재사용 가능한 타입 안전 코드 작성하기
- **타입 추론**: TypeScript가 자동으로 타입 추론하기
- **타입 가드**: 런타임에 타입 검사하기
- **유틸리티 타입**: Partial, Required, Pick, Omit 등

::: info 💡 문제가 생기면 이렇게 AI에게 물어보세요
- "이 함수의 타입 어노테이션은 어떻게 작성해야 하나요? 매개변수는 X이고, 반환값은 Y입니다"
- "이 데이터 구조를 설명하는 인터페이스를 정의해주세요: ..."
- "이 TypeScript 오류는 무슨 뜻인가요? 어떻게 수정하나요?"
- "이 제네릭 함수에 제약을 추가해서 T가 특정 속성을 반드시 가지도록 하려면 어떻게 하나요?"
:::