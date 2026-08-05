# Principles of TypeScript

::: tip Preface
You already know JavaScript, but you may have encountered these problems:
- Assigning the wrong type to a variable, only discovering it at runtime
- Misspelling an object property name and spending ages debugging
- Function parameter types being wrong, leading to constant rewrites

TypeScript is the tool that helps you catch these issues before your code runs. After reading this, you'll understand why TypeScript improves code quality, how to read type annotations, interfaces, generics, and other core concepts, and how to better leverage AI-generated code in vibecoding.
:::

**What will this article teach you?**

| Chapter | Content | What you'll be able to do |
|---------|---------|---------------------------|
| **Chapter 1** | What TypeScript is | Understand its relationship with JavaScript |
| **Chapter 2** | Basic type annotations | Know how to annotate types for variables |
| **Chapter 3** | Object types and interfaces | Define types for data structures |
| **Chapter 4** | Function types | Annotate types for function parameters and return values |
| **Chapter 5** | Generics | Write reusable, type-safe code |
| **Chapter 6** | Type inference and practical tips | Know when explicit annotations are needed |

---

## 1. What Is TypeScript

::: tip 🤔 Core Question
**JavaScript already works — why do we need TypeScript?** Is learning an extra syntax worth it?
:::

### 1.1 From "Runtime Errors" to "Compile-Time Discovery"

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🔴 JavaScript's Pain Points**
- Type errors only caught at runtime
- Typos are hard to spot
- Refactoring is error-prone
- IDE hints are not accurate enough

*Like a document editor without spell check*

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**✅ TypeScript's Advantages**
- Errors found while writing code
- Smarter, more accurate IntelliSense
- Safer refactoring
- Easier code maintenance

*Like an editor with spell check and syntax highlighting*

</div>
</div>

**Understand their relationship in one sentence:**

| Technology | Analogy | Role |
|------------|---------|------|
| **JavaScript** | Raw material | Code that can run directly |
| **TypeScript** | Blueprint + quality check | Adds type checking to JavaScript, then compiles to JavaScript |

### 1.2 Motivation for Vibecodinging Need TypeScript Too

::: warning AI-Generated Code Can Also Have Bugs
A developer used AI to generate a user management feature. The AI-written JavaScript code ran, but there was a problem: the user's age was supposed to be a number, but sometimes it was mistakenly assigned as a string.

As a result, when checking "is the user an adult," the string "25" was treated as a string, causing the check to fail. This bug was hidden for a long time until a user entered a non-numeric character and it surfaced.

With TypeScript, this code would have errored at write time: `Type 'string' is not assignable to type 'number'`.

**This is the value of TypeScript — when AI gets a type wrong, you can catch it immediately.**
:::

### 1.3 TypeScript Actually Looks Like This

TypeScript is not a brand-new language; it's simply a "superset" of JavaScript:

```typescript
// This is valid JavaScript, and also valid TypeScript
const name = "Zhang San"
const age = 25
function greet(user) {
  return `Hello ${user}`
}

// This is TypeScript-specific type annotation
const name2: string = "Li Si"
const age2: number = 30
function greet2(user: string): string {
  return `Hello ${user}`
}
```

**Key takeaways:**
- All JavaScript code is valid TypeScript code
- TypeScript adds optional **type annotations**
- TypeScript ultimately compiles to JavaScript for execution

::: info 💡 Core Insight
TypeScript doesn't change how your code runs; it just checks that types are correct at compile time. **You can adopt TypeScript incrementally** — start by adding types to critical variables.
:::

---

## 2. Basic Type Annotations

::: tip 🤔 Core Question
**How do you tell TypeScript what type a variable should be?** What is the syntax for type annotations?
:::

### 2.1 Type Annotation Syntax

A type annotation is simply adding `: type` after the variable name:

```typescript
// Syntax: variableName: type = value
const name: string = "Zhang San"
let age: number = 25
let isStudent: boolean = true
```

👇 **Try it yourself**: Add type annotations to variables

<TypeAnnotationDemo />

::: details 🔍 Why don't some places need type annotations?
TypeScript can automatically infer types based on assignment:

```typescript
// These don't need type annotations — TypeScript can infer them
const name = "Zhang San"      // inferred as string
const age = 25                // inferred as number
const isActive = true         // inferred as boolean

// These cases need explicit annotations
let data  // ❌ Error: cannot infer type
let data: any  // ✅ Works, but loses the benefit of type checking

function add(a, b) {  // ❌ Parameter types are unclear
  return a + b
}

function add2(a: number, b: number): number {  // ✅ Types are explicit
  return a + b
}
```
:::

### 2.2 Basic Types

TypeScript supports all of JavaScript's basic types:

| Type | Description | Example |
|------|-------------|---------|
| `string` | String | `"hello"`, `'你好'` |
| `number` | Number (integers and decimals) | `42`, `3.14` |
| `boolean` | Boolean | `true`, `false` |
| `null` / `undefined` | Null value | `null`, `undefined` |
| `array` | Array | `number[]`, `string[]` |
| `object` | Object | `{ name: string; age: number }` |

**Two ways to write array types:**

```typescript
// Method 1: type[] (more common)
const numbers: number[] = [1, 2, 3, 4, 5]
const names: string[] = ["Zhang San", "Li Si", "Wang Wu"]

// Method 2: Array<type>
const numbers2: Array<number> = [1, 2, 3, 4, 5]
const names2: Array<string> = ["Zhang San", "Li Si", "Wang Wu"]
```

**Special types:**

```typescript
// any: any type (use sparingly — effectively disables type checking)
let data: any = 42
data = "now it can be a string"
data = { name: "Zhang San" }  // can also be an object

// unknown: type-safe any
let value: unknown = 42
// if (typeof value === "number") {
//   console.log(value + 10)  // must check type first before using
// }

// void: no return value
function log(message: string): void {
  console.log(message)
}

// never: never returns
function error(message: string): never {
  throw new Error(message)
}
```

::: info 💡 Recognition Tips
- See `: string` → this is a string type annotation
- See `: number[]` → this is a number array annotation
- See `: void` → this function has no return value
:::

---

## 3. Object Types and Interfaces

::: tip 🤔 Core Question
**How do you define the type of an object?** What types should the object's properties be?
:::

### 3.1 Interface: Defining an Object's "Shape"

Interfaces are the primary way to define object types in TypeScript:

```typescript
// Define a User interface
interface User {
  id: number
  name: string
  email: string
  age?: number  // optional property
}

// Use the interface
const user: User = {
  id: 1,
  name: "Zhang San",
  email: "zhangsan@example.com",
  age: 25
}

// age is optional, so it can be omitted
const user2: User = {
  id: 2,
  name: "Li Si",
  email: "lisi@example.com"
}
```

👇 **Try it yourself**: Create objects that conform to an interface definition

<InterfaceDemo />

::: details 🔍 Other Interface Features
```typescript
// Readonly properties
interface User {
  readonly id: number  // id cannot be modified after creation
  name: string
}

const user: User = {
  id: 1,
  name: "Zhang San"
}

user.id = 2  // ❌ Error: cannot modify a readonly property
user.name = "Li Si"  // ✅ Can modify

// Function types
interface User {
  name: string
  greet: () => string  // greet is a function that returns string
}

const user: User = {
  name: "Zhang San",
  greet: () => "Hello"
}

// Interface inheritance
interface Admin extends User {
  permissions: string[]
}

const admin: Admin = {
  name: "Admin",
  greet: () => "Hello Admin",
  permissions: ["read", "write", "delete"]
}
```
:::

### 3.2 Type Alias

Besides interfaces, you can also use `type` to define type aliases:

```typescript
// Type alias
type User = {
  id: number
  name: string
  email: string
}

// Union types
type Status = "pending" | "success" | "error"

const status: Status = "success"  // ✅
// const status2: Status = "failed"  // ❌ Error: not in the union type

// Intersection types (merge multiple types)
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
  name: "Zhang San",
  createdAt: new Date(),
  updatedAt: new Date()
}
```

**Interface vs Type Alias:**

| Feature | interface | type |
|---------|-----------|------|
| Extension | `extends` | `&` intersection |
| Duplicate declaration | Auto-merges | Errors |
| Use cases | Object shapes, classes | Union types, intersection types, primitive type aliases |

::: info 💡 Recognition Tips
- See `interface` → defining an object type
- See `type` → creating a type alias
- See `?` → optional property
- See `readonly` → readonly property
:::

---

## 4. Function Types

::: tip 🤔 Core Question
**How do you annotate types for function parameters and return values?**
:::

### 4.1 Parameter Types and Return Types

```typescript
// Complete function type annotation
function add(a: number, b: number): number {
  return a + b
}

// Arrow function
const multiply = (a: number, b: number): number => {
  return a * b
}

// No return value
function log(message: string): void {
  console.log(message)
}

// Returning multiple types (union type)
function parseInput(input: string): number | string {
  const num = parseFloat(input)
  return isNaN(num) ? input : num
}
```

### 4.2 Optional and Default Parameters

```typescript
// Optional parameter (marked with ?)
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name
}

greet("Zhang San")  // "Zhang San"
greet("Zhang San", "Mr.")  // "Mr. Zhang San"

// Default parameter
function greet2(name: string, title: string = "friend"): string {
  return `${title} ${name}`
}

greet2("Li Si")  // "friend Li Si"
greet2("Li Si", "Dr.")  // "Dr. Li Si"
```

### 4.3 Function Types as Parameters

```typescript
// Accepting a function as a parameter
function calculate(
  a: number,
  b: number,
  operation: (x: number, y: number) => number
): number {
  return operation(a, b)
}

calculate(10, 5, (x, y) => x + y)  // 15
calculate(10, 5, (x, y) => x * y)  // 50

// Cleaner approach: define the function type first
type Operation = (x: number, y: number) => number

function calculate2(
  a: number,
  b: number,
  operation: Operation
): number {
  return operation(a, b)
}
```

::: info 💡 Recognition Tips
- See `(a: number, b: number) => number` → this is a function type, describing parameters and return value
- See `: void` → the function has no return value
- See `?` → the parameter is optional
:::

---

## 5. Generics

::: tip 🤔 Core Question
**How do you write code that handles multiple types while staying type-safe?**
:::

### 5.1 Basic Concepts of Generics

Generics let you define functions, interfaces, or classes without specifying concrete types upfront — you specify them at usage time:

```typescript
// Generic function: T is a type variable
function identity<T>(arg: T): T {
  return arg
}

// Explicitly specify the type at usage
const num1 = identity<number>(42)  // type is number
const str1 = identity<string>("hello")  // type is string

// Type inference: TypeScript can infer automatically
const num2 = identity(42)  // inferred as number
const str2 = identity("hello")  // inferred as string
```

👇 **Try it yourself**: Use generics to handle different types of data

<GenericDemo />

### 5.2 Generic Constraints

Restrict generics to meet certain conditions:

```typescript
// Constrain T to have a length property
interface HasLength {
  length: number
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length)
}

logLength("hello")  // ✅ strings have length
logLength([1, 2, 3])  // ✅ arrays have length
// logLength(42)  // ❌ numbers don't have a length property
```

### 5.3 Generic Interfaces and Classes

```typescript
// Generic interface
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

// Generic class
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
// numberStorage.add("string")  // ❌ Error

const stringStorage = new Storage<string>()
stringStorage.add("hello")
// stringStorage.add(1)  // ❌ Error
```

::: info 💡 Recognition Tips
- See `<T>` → this is a generic type variable
- See `<T extends SomeType>` → generic constraint
- See `Array<T>` or `Promise<T>` → built-in generic types
:::

---

## 6. Type Inference and Practical Tips

::: tip 🤔 Core Question
**When do you need explicit type annotations? When can you rely on inference?**
:::

### 6.1 Type Inference

TypeScript can automatically infer types from context:

```typescript
// Inference during variable initialization
const name = "Zhang San"  // inferred as string
const age = 25  // inferred as number
const isActive = true  // inferred as boolean

// Array inference
const numbers = [1, 2, 3]  // inferred as number[]
const mixed = [1, "hello", true]  // inferred as (number | string | boolean)[]

// Function return value inference
function add(a: number, b: number) {
  return a + b  // return value inferred as number
}
```

👇 **Try it yourself**: Observe how TypeScript infers types

<TypeInferenceDemo />

### 6.2 When to Use Explicit Type Annotations

::: details Scenarios where type inference is recommended
```typescript
// ✅ Recommended: simple literal assignments
const count = 0
const name = "Zhang San"
const isActive = true

// ✅ Recommended: function return values that can be inferred
function getUserId(user: User) {
  return user.id  // inferred as number
}
```
:::

::: details Scenarios where explicit annotations are recommended
```typescript
// ✅ Recommended: function parameters (required)
function add(a: number, b: number) {
  return a + b
}

// ✅ Recommended: object property types are unclear
const user: {
  id: number
  name: string
  metadata: Record<string, any>
} = {
  id: 1,
  name: "Zhang San",
  metadata: {}  // might be inferred as {}, needs explicit specification
}

// ✅ Recommended: complex function return types
function getUser(): User | null {
  // ...
  return null
}

// ✅ Recommended: public APIs
export function calculateTotal(prices: number[]): number {
  return prices.reduce((sum, price) => sum + price, 0)
}
```
:::

### 6.3 Type Guards

Check types at runtime:

```typescript
// typeof type guard
function processValue(value: string | number) {
  if (typeof value === "string") {
    // TypeScript knows value is string here
    console.log(value.toUpperCase())
  } else {
    // TypeScript knows value is number here
    console.log(value * 2)
  }
}

// instanceof type guard
class Dog {
  bark() {
    console.log("Woof")
  }
}

class Cat {
  meow() {
    console.log("Meow")
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark()  // TypeScript knows this is Dog
  } else {
    animal.meow()  // TypeScript knows this is Cat
  }
}

// Custom type guard
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
    // value is User here
    console.log(value.name)
  }
}
```

### 6.4 Utility Types

TypeScript provides some built-in utility types:

```typescript
// Partial: make all properties optional
interface User {
  id: number
  name: string
  email: string
}

type PartialUser = Partial<User>
// Equivalent to: { id?: number; name?: string; email?: string }

// Required: make all properties required
type RequiredUser = Required<PartialUser>
// Equivalent to: { id: number; name: string; email: string }

// Pick: keep only specified properties
type UserBasicInfo = Pick<User, "id" | "name">
// Equivalent to: { id: number; name: string }

// Omit: exclude specified properties
type UserWithoutEmail = Omit<User, "email">
// Equivalent to: { id: number; name: string }

// Record: create an object type
type UserRoles = Record<string, boolean>
// Equivalent to: { [key: string]: boolean }
```

---

## 7. Practical Tips: Using TypeScript in Vibecoding

::: tip 🤔 Core Question
**How can you better leverage TypeScript in AI-assisted development?**
:::

### 7.1 Getting AI to Generate Type-Safe Code

**❌ Bad prompt:**
```
Write a user management feature for me
```

**✅ Good prompt:**
```
Write a user management feature for me, using TypeScript.

The data structure is defined as follows:
interface User {
  id: number
  name: string
  email: string
  age: number
}

I need to implement:
1. Get user list: returns User[]
2. Create user: accepts Partial<User>, returns User
3. Update user: accepts id and Partial<User>, returns User
4. Delete user: accepts id, returns void

Please ensure all functions have complete type annotations.
```

### 7.2 Understanding TypeScript Error Messages

**Common errors and their meanings:**

| Error Message | Meaning | Solution |
|---------------|---------|----------|
| `Type 'X' is not assignable to type 'Y'` | Type X cannot be assigned to type Y | Check if types match, or perform type conversion |
| `Property 'X' does not exist on type 'Y'` | Property X does not exist on type Y | Check property name spelling, or define the property |
| `Argument of type 'X' is not assignable to parameter of type 'Y'` | Parameter type mismatch | Check the argument types when calling the function |
| `Type 'X' is missing the following properties from type 'Y'` | Type X is missing certain properties from type Y | Add the missing properties |

### 7.3 Incrementally Adopting TypeScript

If you have a JavaScript project, you can gradually migrate to TypeScript:

1. **Step 1: Rename files to `.ts`**
   ```bash
   # From utils.js to utils.ts
   mv utils.js utils.ts
   ```

2. **Step 2: Fix obvious type errors**
   ```typescript
   // If you get: Parameter 'a' implicitly has an 'any' type
   // Add type annotations
   function add(a: number, b: number) {
     return a + b
   }
   ```

3. **Step 3: Gradually add type definitions**
   ```typescript
   // First use any for a quick fix
   function processUser(user: any) {
     // ...
   }

   // Later refine the types
   interface User {
     id: number
     name: string
   }

   function processUser(user: User) {
     // ...
   }
   ```

4. **Step 4: Enable stricter type checking**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,  // Enable strict mode
       "noImplicitAny": true,  // Disallow implicit any
       "strictNullChecks": true  // Strict null checks
     }
   }
   ```

---

## 8. What You Should Now Be Able to Recognize

- See `: string` → this is a string type annotation
- See `: number[]` → this is a number array annotation
- See `interface User` → this defines an object type
- See `type User =` → this is a type alias
- See `<T>` → this is a generic
- See `extends` → interface inheritance or generic constraint
- See `?` → optional property
- See `readonly` → readonly property
- See `|` → union type
- See `&` → intersection type

**If you read the "deep dive" section of each chapter carefully, you've also mastered these core concepts:**

- **Type annotations**: Explicitly tell TypeScript the type of a variable
- **Interfaces**: Define the structure and types of objects
- **Generics**: Write reusable, type-safe code
- **Type inference**: TypeScript automatically infers types
- **Type guards**: Check types at runtime
- **Utility types**: Partial, Required, Pick, Omit, and more

::: info 💡 When you run into problems, talk to AI like this:
- "How should I write the type annotation for this function? The parameter is X, the return value is Y"
- "Help me define an interface that describes this data structure: ..."
- "What does this TypeScript error mean? How do I fix it?"
- "How do I add a constraint to this generic function to ensure T must have a certain property?"
:::