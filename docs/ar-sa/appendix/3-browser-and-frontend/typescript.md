# مبادئ TypeScript

::: tip مقدمة
أنت تعرف بالفعل كيفية كتابة JavaScript، ولكن ربما واجهت هذه المشكلات:
- تعيين نوع خاطئ لمتغير، ولا تكتشفه إلا في وقت التشغيل
- كتابة اسم خاصية الكائن بشكل خاطئ، وتقضي وقتًا طويلاً في تصحيح الأخطاء
- أنواع معاملات الدوال غير صحيحة، مما يضطرك للتعديل مرارًا

TypeScript هي أداة تساعدك في اكتشاف هذه المشكلات قبل تشغيل الكود. بعد قراءة هذا الدليل، ستفهم لماذا يحسن TypeScript جودة الكود، وستتمكن من قراءة التعليقات النوعية (type annotations)، والواجهات (interfaces)، والأدوية العامة (generics) وغيرها من المفاهيم الأساسية، مما يمكنك من الاستفادة بشكل أفضل من الكود المُنشأ بالذكاء الاصطناعي في vibecoding.
:::

**ماذا ستتعلم في هذا المقال؟**

| الفصل | المحتوى | ما ستتمكن من فعله بعد التعلم |
|-----|------|-----------|
| **الفصل 1** | ما هو TypeScript | فهم علاقته بـ JavaScript |
| **الفصل 2** | التعليقات النوعية الأساسية | معرفة كيفية تعليق الأنواع على المتغيرات |
| **الفصل 3** | أنواع الكائنات والواجهات | تعريف أنواع هياكل البيانات |
| **الفصل 4** | أنواع الدوال | تعليق الأنواع على معاملات الدوال وقيم الإرجاع |
| **الفصل 5** | الأدوية العامة (Generics) | كتابة كود آمن نوعيًا وقابل لإعادة الاستخدام |
| **الفصل 6** | استدلال الأنواع والحيل العملية | معرفة متى تحتاج إلى تعليقات نوعية صريحة |

---

## 1. ما هو TypeScript

::: tip 🤔 السؤال الأساسي
**JavaScript كافية بالفعل، فلماذا نحتاج إلى TypeScript؟** هل يستحق تعلم صيغة إضافية العناء؟
:::

### 1.1 من "الخطأ في وقت التشغيل" إلى "الاكتشاف في وقت الترجمة"

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🔴 نقاط ضعف JavaScript**
- أخطاء الأنواع لا تُكتشف إلا في وقت التشغيل
- الأخطاء الإملائية يصعب ملاحظتها
- سهولة نسيان التعديلات أثناء إعادة الهيكلة
- اقتراحات IDE غير دقيقة بما فيه الكفاية

*مثل محرر مستندات بدون تدقيق إملائي*

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**✅ مزايا TypeScript**
- اكتشاف الأخطاء أثناء كتابة الكود
- اقتراحات ذكية أكثر دقة
- إعادة هيكلة أكثر أمانًا
- كود أسهل في الصيانة

*مثل محرر مزود بتدقيق إملائي وتلوين الصيغة*

</div>
</div>

**لفهم العلاقة بينهما في جملة واحدة:**

| التقنية | التشبيه | الدور |
|------|------|------|
| **JavaScript** | المادة الخام | كود يمكن تشغيله مباشرة |
| **TypeScript** | المخطط + فحص الجودة | إضافة فحص الأنواع إلى JavaScript، ثم ترجمتها إلى JavaScript في النهاية |

### 1.2 الدافع وراء يحتاج vibecoding أيضًا إلى TypeScript

::: warning الذكاء الاصطناعي قد يخطئ أيضًا في كتابة الكود
استخدم أحد المطورين الذكاء الاصطناعي لإنشاء وظيفة إدارة مستخدمين. كود JavaScript الذي كتبه الذكاء الاصطناعي كان يعمل، ولكن كانت هناك مشكلة: كان من المفترض أن يكون عمر المستخدم رقمًا، لكنه كان يُسند أحيانًا كنص.

نتيجة لذلك، عند حساب "هل هو بالغ"، كان النص "25" يُعامل كسلسلة نصية، مما أدى إلى فشل التحقق. بقي هذا الخطأ مخفيًا لفترة طويلة، حتى قام أحد المستخدمين بإدخال حرف غير رقمي.

لو تم استخدام TypeScript، لكان هذا الكود قد أظهر خطأً أثناء كتابته: `لا يمكن تعيين النوع "string" للنوع "number"`.

**هذه هي قيمة TypeScript — عندما يخطئ الذكاء الاصطناعي في الأنواع، يمكنك اكتشافه فورًا.**
:::

### 1.3 TypeScript في الواقع هكذا

TypeScript ليست لغة جديدة تمامًا، إنها مجرد "مجموعة شاملة" (superset) من JavaScript:

```typescript
// هذا كود JavaScript صالح، وهو أيضًا كود TypeScript صالح
const name = "张三"
const age = 25
function greet(user) {
  return `Hello ${user}`
}

// هذه هي التعليقات النوعية الخاصة بـ TypeScript
const name2: string = "李四"
const age2: number = 30
function greet2(user: string): string {
  return `Hello ${user}`
}
```

**فهم أساسي:**
- كل كود JavaScript هو كود TypeScript صالح
- TypeScript تضيف **تعليقات نوعية** (type annotations) اختيارية
- TypeScript تُترجم في النهاية إلى JavaScript للتشغيل

::: info 💡 الفكرة الأساسية
TypeScript لا تغير طريقة تشغيل الكود، إنها فقط تساعدك في التحقق من صحة الأنواع أثناء الترجمة. **يمكنك تبني TypeScript تدريجيًا** — ابدأ بإضافة الأنواع إلى المتغيرات الأساسية.
:::

---

## 2. التعليقات النوعية الأساسية

::: tip 🤔 السؤال الأساسي
**كيف تخبر TypeScript بالنوع الذي يجب أن يكون عليه المتغير؟** ما هي صيغة التعليقات النوعية؟
:::

### 2.1 صيغة التعليقات النوعية

التعليق النوعي هو إضافة `: النوع` بعد اسم المتغير:

```typescript
// الصيغة: اسم المتغير: النوع = القيمة
const name: string = "张三"
let age: number = 25
let isStudent: boolean = true
```

👇 **جرب بنفسك**: أضف تعليقات نوعية للمتغيرات

<TypeAnnotationDemo />

::: details 🔍 لماذا لا تحتاج بعض الأماكن إلى تعليقات نوعية؟
يستطيع TypeScript استدلال الأنواع تلقائيًا من القيمة المسندة:

```typescript
// هذه لا تحتاج إلى تعليقات نوعية، TypeScript يستطيع الاستدلال تلقائيًا
const name = "张三"      // يُستدل على أنه string
const age = 25          // يُستدل على أنه number
const isActive = true   // يُستدل على أنه boolean

// هذه الحالات تحتاج إلى تعليقات صريحة
let data  // ❌ خطأ: لا يمكن استدلال النوع
let data: any  // ✅ ممكن، لكنه يفقد ميزة فحص الأنواع

function add(a, b) {  // ❌ أنواع المعاملات غير واضحة
  return a + b
}

function add2(a: number, b: number): number {  // ✅ الأنواع واضحة
  return a + b
}
```
:::

### 2.2 الأنواع الأساسية

تدعم TypeScript جميع الأنواع الأساسية في JavaScript:

| النوع | الوصف | مثال |
|------|------|------|
| `string` | نص | `"hello"`, `'你好'` |
| `number` | رقم (صحيح وعشري) | `42`, `3.14` |
| `boolean` | قيمة منطقية | `true`, `false` |
| `null` / `undefined` | قيمة فارغة | `null`, `undefined` |
| `array` | مصفوفة | `number[]`, `string[]` |
| `object` | كائن | `{ name: string; age: number }` |

**طريقتان لكتابة نوع المصفوفة:**

```typescript
// الطريقة 1: النوع[] (الأكثر استخدامًا)
const numbers: number[] = [1, 2, 3, 4, 5]
const names: string[] = ["张三", "李四", "王五"]

// الطريقة 2: Array<النوع>
const numbers2: Array<number> = [1, 2, 3, 4, 5]
const names2: Array<string> = ["张三", "李四", "王五"]
```

**الأنواع الخاصة:**

```typescript
// any: أي نوع (استخدمه بحذر، فهو يعطل فحص الأنواع)
let data: any = 42
data = "الآن يمكن أن يكون نصًا"
data = { name: "张三" }  // يمكن أن يكون كائنًا أيضًا

// unknown: بديل آمن نوعيًا لـ any
let value: unknown = 42
// if (typeof value === "number") {
//   console.log(value + 10)  // يجب التحقق من النوع أولاً قبل الاستخدام
// }

// void: لا توجد قيمة إرجاع
function log(message: string): void {
  console.log(message)
}

// never: لن تعود أبدًا
function error(message: string): never {
  throw new Error(message)
}
```

::: info 💡 مهارات التعرف
- رؤية `: string` → هذا تعليق نوعي من نوع string
- رؤية `: number[]` → هذا تعليق نوعي لمصفوفة أرقام
- رؤية `: void` → هذه الدالة لا تُرجع قيمة
:::

---

## 3. أنواع الكائنات والواجهات

::: tip 🤔 السؤال الأساسي
**كيف تُعرِّف نوع كائن؟** ما هي أنواع خصائص الكائن؟
:::

### 3.1 الواجهة (Interface): تعريف "شكل" الكائن

الواجهة هي الطريقة الرئيسية لتعريف أنواع الكائنات في TypeScript:

```typescript
// تعريف واجهة User
interface User {
  id: number
  name: string
  email: string
  age?: number  // خاصية اختيارية
}

// استخدام الواجهة
const user: User = {
  id: 1,
  name: "张三",
  email: "zhangsan@example.com",
  age: 25
}

// age اختيارية، يمكن عدم توفيرها
const user2: User = {
  id: 2,
  name: "李四",
  email: "lisi@example.com"
}
```

👇 **جرب بنفسك**: أنشئ كائنًا يطابق تعريف الواجهة

<InterfaceDemo />

::: details 🔍 خصائص أخرى للواجهات
```typescript
// خاصية للقراءة فقط
interface User {
  readonly id: number  // id لا يمكن تعديله بعد الإنشاء
  name: string
}

const user: User = {
  id: 1,
  name: "张三"
}

user.id = 2  // ❌ خطأ: لا يمكن تعديل خاصية للقراءة فقط
user.name = "李四"  // ✅ يمكن التعديل

// نوع الدالة
interface User {
  name: string
  greet: () => string  // greet هي دالة، تُرجع string
}

const user: User = {
  name: "张三",
  greet: () => "Hello"
}

// وراثة الواجهات
interface Admin extends User {
  permissions: string[]
}

const admin: Admin = {
  name: "管理员",
  greet: () => "Hello Admin",
  permissions: ["read", "write", "delete"]
}
```
:::

### 3.2 الأسماء المستعارة للأنواع (Type Alias)

بالإضافة إلى الواجهات، يمكنك استخدام `type` لتعريف أسماء مستعارة للأنواع:

```typescript
// اسم مستعار للنوع
type User = {
  id: number
  name: string
  email: string
}

// نوع الاتحاد (Union Type)
type Status = "pending" | "success" | "error"

const status: Status = "success"  // ✅
// const status2: Status = "failed"  // ❌ خطأ: ليست ضمن نوع الاتحاد

// نوع التقاطع (Intersection Type) — دمج عدة أنواع
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

**الواجهة (interface) مقابل الاسم المستعار (type):**

| الخاصية | interface | type |
|------|-----------|------|
| التوسيع | `extends` | `&` نوع التقاطع |
| التصريح المتكرر | يندمج تلقائيًا | سيُبلغ عن خطأ |
| سيناريوهات الاستخدام | شكل الكائن، الفئات | أنواع الاتحاد، أنواع التقاطع، أسماء مستعارة للأنواع الأساسية |

::: info 💡 مهارات التعرف
- رؤية `interface` → هذا تعريف لنوع كائن
- رؤية `type` → هذا إنشاء اسم مستعار للنوع
- رؤية `?` → هذه خاصية اختيارية
- رؤية `readonly` → هذه خاصية للقراءة فقط
:::

---

## 4. أنواع الدوال

::: tip 🤔 السؤال الأساسي
**كيف تُعرِّف أنواع معاملات الدالة وقيمة الإرجاع؟**
:::

### 4.1 أنواع المعاملات وأنواع قيمة الإرجاع

```typescript
// تعليق نوعي كامل للدالة
function add(a: number, b: number): number {
  return a + b
}

// دالة السهم
const multiply = (a: number, b: number): number => {
  return a * b
}

// بدون قيمة إرجاع
function log(message: string): void {
  console.log(message)
}

// إرجاع أنواع متعددة (نوع الاتحاد)
function parseInput(input: string): number | string {
  const num = parseFloat(input)
  return isNaN(num) ? input : num
}
```

### 4.2 المعاملات الاختيارية والمعاملات الافتراضية

```typescript
// معامل اختياري (معلّم بـ ?)
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name
}

greet("张三")  // "张三"
greet("张三", "先生")  // "先生 张三"

// معامل افتراضي
function greet2(name: string, title: string = "朋友"): string {
  return `${title} ${name}`
}

greet2("李四")  // "朋友 李四"
greet2("李四", "博士")  // "博士 李四"
```

### 4.3 نوع الدالة كمعامل

```typescript
// قبول دالة كمعامل
function calculate(
  a: number,
  b: number,
  operation: (x: number, y: number) => number
): number {
  return operation(a, b)
}

calculate(10, 5, (x, y) => x + y)  // 15
calculate(10, 5, (x, y) => x * y)  // 50

// طريقة أوضح: تعريف نوع الدالة أولاً
type Operation = (x: number, y: number) => number

function calculate2(
  a: number,
  b: number,
  operation: Operation
): number {
  return operation(a, b)
}
```

::: info 💡 مهارات التعرف
- رؤية `(a: number, b: number) => number` → هذا نوع دالة، يصف المعاملات وقيمة الإرجاع
- رؤية `: void` → الدالة لا تُرجع قيمة
- رؤية `?` → المعامل اختياري
:::

---

## 5. الأدوية العامة (Generics)

::: tip 🤔 السؤال الأساسي
**كيف تكتب كودًا يمكنه التعامل مع أنواع متعددة، مع الحفاظ على الأمان النوعي؟**
:::

### 5.1 المفهوم الأساسي للأدوية العامة

تتيح لك الأدوية العامة تعريف الدوال أو الواجهات أو الفئات دون تحديد النوع مسبقًا، بل تحدده عند الاستخدام:

```typescript
// دالة عامة: T هو متغير النوع
function identity<T>(arg: T): T {
  return arg
}

// تحديد النوع صراحة عند الاستخدام
const num1 = identity<number>(42)  // النوع هو number
const str1 = identity<string>("hello")  // النوع هو string

// استدلال النوع: TypeScript يستطيع الاستدلال تلقائيًا
const num2 = identity(42)  // يُستدل على أنه number
const str2 = identity("hello")  // يُستدل على أنه string
```

👇 **جرب بنفسك**: استخدم الأدوية العامة للتعامل مع أنواع مختلفة من البيانات

<GenericDemo />

### 5.2 قيود الأدوية العامة

تقييد الأدوية العامة بحيث يجب أن تستوفي شروطًا معينة:

```typescript
// تقييد T بأن يكون لديه خاصية length
interface HasLength {
  length: number
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length)
}

logLength("hello")  // ✅ النص لديه length
logLength([1, 2, 3])  // ✅ المصفوفة لديها length
// logLength(42)  // ❌ الرقم ليس لديه خاصية length
```

### 5.3 الواجهات والفئات العامة

```typescript
// واجهة عامة
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

// فئة عامة
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
// numberStorage.add("string")  // ❌ خطأ

const stringStorage = new Storage<string>()
stringStorage.add("hello")
// stringStorage.add(1)  // ❌ خطأ
```

::: info 💡 مهارات التعرف
- رؤية `<T>` → هذا متغير نوع عام
- رؤية `<T extends SomeType>` → قيد عام
- رؤية `Array<T>` أو `Promise<T>` → أنواع عامة مدمجة
:::

---

## 6. استدلال الأنواع والحيل العملية

::: tip 🤔 السؤال الأساسي
**متى تحتاج إلى تعليقات نوعية صريحة؟ ومتى يمكنك الاعتماد على الاستدلال؟**
:::

### 6.1 استدلال الأنواع

يستطيع TypeScript استدلال الأنواع تلقائيًا من السياق:

```typescript
// الاستدلال عند تهيئة المتغيرات
const name = "张三"  // يُستدل على أنه string
const age = 25  // يُستدل على أنه number
const isActive = true  // يُستدل على أنه boolean

// استدلال المصفوفات
const numbers = [1, 2, 3]  // يُستدل على أنه number[]
const mixed = [1, "hello", true]  // يُستدل على أنه (number | string | boolean)[]

// استدلال قيمة إرجاع الدالة
function add(a: number, b: number) {
  return a + b  // يُستدل على أن قيمة الإرجاع هي number
}
```

👇 **جرب بنفسك**: لاحظ كيف يستدل TypeScript على الأنواع

<TypeInferenceDemo />

### 6.2 متى تستخدم التعليقات النوعية الصريحة

::: details السيناريوهات الموصى باستخدام استدلال الأنواع فيها
```typescript
// ✅ موصى به: تعيين القيم الحرفية البسيطة
const count = 0
const name = "张三"
const isActive = true

// ✅ موصى به: يمكن استدلال قيمة إرجاع الدالة
function getUserId(user: User) {
  return user.id  // يُستدل على أنه number
}
```
:::

::: details السيناريوهات الموصى باستخدام التعليقات الصريحة فيها
```typescript
// ✅ موصى به: معاملات الدالة (إجباري)
function add(a: number, b: number) {
  return a + b
}

// ✅ موصى به: أنواع خصائص الكائن غير الواضحة
const user: {
  id: number
  name: string
  metadata: Record<string, any>
} = {
  id: 1,
  name: "张三",
  metadata: {}  // قد يُستدل على أنه {}، يحتاج إلى تحديد صريح
}

// ✅ موصى به: نوع إرجاع الدالة المعقد
function getUser(): User | null {
  // ...
  return null
}

// ✅ موصى به: واجهات API العامة
export function calculateTotal(prices: number[]): number {
  return prices.reduce((sum, price) => sum + price, 0)
}
```
:::

### 6.3 حراس الأنواع (Type Guards)

التحقق من النوع في وقت التشغيل:

```typescript
// حارس النوع typeof
function processValue(value: string | number) {
  if (typeof value === "string") {
    // هنا TypeScript يعرف أن value هو string
    console.log(value.toUpperCase())
  } else {
    // هنا TypeScript يعرف أن value هو number
    console.log(value * 2)
  }
}

// حارس النوع instanceof
class Dog {
  bark() {
    console.log("汪汪")
  }
}

class Cat {
  meow() {
    console.log("喵喵")
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark()  // TypeScript يعرف أن هذا Dog
  } else {
    animal.meow()  // TypeScript يعرف أن هذا Cat
  }
}

// حارس نوع مخصص
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
    // هنا value هو User
    console.log(value.name)
  }
}
```

### 6.4 أنواع الأدوات العملية (Utility Types)

توفر TypeScript بعض أنواع الأدوات المدمجة:

```typescript
// Partial: جعل جميع الخصائص اختيارية
interface User {
  id: number
  name: string
  email: string
}

type PartialUser = Partial<User>
// يكافئ: { id?: number; name?: string; email?: string }

// Required: جعل جميع الخصائص إلزامية
type RequiredUser = Required<PartialUser>
// يكافئ: { id: number; name: number; email: string }

// Pick: الاحتفاظ فقط بالخصائص المحددة
type UserBasicInfo = Pick<User, "id" | "name">
// يكافئ: { id: number; name: string }

// Omit: استبعاد الخصائص المحددة
type UserWithoutEmail = Omit<User, "email">
// يكافئ: { id: number; name: string }

// Record: إنشاء نوع كائن
type UserRoles = Record<string, boolean>
// يكافئ: { [key: string]: boolean }
```

---

## 7. حيل عملية: استخدام TypeScript في vibecoding

::: tip 🤔 السؤال الأساسي
**كيف تستفيد بشكل أفضل من TypeScript في التطوير بمساعدة الذكاء الاصطناعي؟**
:::

### 7.1 دع الذكاء الاصطناعي يُنشئ كودًا آمنًا نوعيًا

**❌ تلميح سيئ:**
```
اكتب لي وظيفة إدارة مستخدمين
```

**✅ تلميح جيد:**
```
اكتب لي وظيفة إدارة مستخدمين باستخدام TypeScript.

تعريف هيكل البيانات كالتالي:
interface User {
  id: number
  name: string
  email: string
  age: number
}

يجب التنفيذ:
1. جلب قائمة المستخدمين: إرجاع User[]
2. إنشاء مستخدم: قبول Partial<User>، إرجاع User
3. تحديث مستخدم: قبول id و Partial<User>، إرجاع User
4. حذف مستخدم: قبول id، إرجاع void

تأكد من أن جميع الدوال لديها تعليقات نوعية كاملة.
```

### 7.2 فهم رسائل أخطاء TypeScript

**الأخطاء الشائعة ومعانيها:**

| رسالة الخطأ | المعنى | طريقة الحل |
|---------|------|---------|
| `Type 'X' is not assignable to type 'Y'` | النوع X لا يمكن تعيينه للنوع Y | تحقق من تطابق الأنواع، أو قم بتحويل النوع |
| `Property 'X' does not exist on type 'Y'` | الخاصية X غير موجودة في النوع Y | تحقق من إملاء اسم الخاصية، أو قم بتعريفها |
| `Argument of type 'X' is not assignable to parameter of type 'Y'` | نوع المعامل غير متطابق | تحقق من نوع المعامل عند استدعاء الدالة |
| `Type 'X' is missing the following properties from type 'Y'` | النوع X يفتقد بعض خصائص النوع Y | أكمل الخصائص الناقصة |

### 7.3 التبني التدريجي لـ TypeScript

إذا كان لديك مشروع JavaScript، يمكنك الانتقال تدريجيًا إلى TypeScript:

1. **الخطوة الأولى: إعادة تسمية الملفات إلى `.ts`**
   ```bash
   # من utils.js إلى utils.ts
   mv utils.js utils.ts
   ```

2. **الخطوة الثانية: إصلاح أخطاء الأنواع الواضحة**
   ```typescript
   // إذا كان الخطأ: Parameter 'a' implicitly has an 'any' type
   // أضف تعليقًا نوعيًا
   function add(a: number, b: number) {
     return a + b
   }
   ```

3. **الخطوة الثالثة: إضافة تعريفات الأنواع تدريجيًا**
   ```typescript
   // استخدم any أولاً للإصلاح السريع
   function processUser(user: any) {
     // ...
   }

   // ثم حسّن النوع لاحقًا
   interface User {
     id: number
     name: string
   }

   function processUser(user: User) {
     // ...
   }
   ```

4. **الخطوة الرابعة: تفعيل فحص الأنواع الأكثر صرامة**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,  // تفعيل الوضع الصارم
       "noImplicitAny": true,  // منع any الضمني
       "strictNullChecks": true  // فحص صارم للقيم الفارغة
     }
   }
   ```

---

## 8. ما يجب أن تكون قادرًا على التعرف عليه الآن

- رؤية `: string` → هذا تعليق نوعي من نوع string
- رؤية `: number[]` → هذا تعليق نوعي لمصفوفة أرقام
- رؤية `interface User` → هذا تعريف لنوع كائن
- رؤية `type User =` → هذا اسم مستعار للنوع
- رؤية `<T>` → هذا نوع عام (Generic)
- رؤية `extends` → وراثة واجهة أو قيد عام
- رؤية `?` → خاصية اختيارية
- رؤية `readonly` → خاصية للقراءة فقط
- رؤية `|` → نوع الاتحاد (Union Type)
- رؤية `&` → نوع التقاطع (Intersection Type)

**إذا قرأت جزء "التعمق" في كل فصل باهتمام، فستكون قد أتقنت هذه المفاهيم الأساسية:**

- **التعليقات النوعية**: إخبار TypeScript بوضوح بنوع المتغير
- **الواجهات**: تعريف هيكل الكائن ونوعه
- **الأدوية العامة**: كتابة كود آمن نوعيًا وقابل لإعادة الاستخدام
- **استدلال الأنواع**: استدلال TypeScript التلقائي للأنواع
- **حراس الأنواع**: التحقق من النوع في وقت التشغيل
- **أنواع الأدوات**: Partial و Required و Pick و Omit وغيرها

::: info 💡 عندما تواجه مشكلة، تحدث مع الذكاء الاصطناعي بهذه الطريقة
- "كيف يجب أن أكتب التعليق النوعي لهذه الدالة؟ المعامل هو X، وقيمة الإرجاع هي Y"
- "ساعدني في تعريف واجهة تصف هيكل البيانات هذا: ..."
- "ماذا يعني خطأ TypeScript هذا؟ كيف أصلحه؟"
- "كيف أضيف قيدًا لهذه الدالة العامة للتأكد من أن T يجب أن يحتوي على خاصية معينة؟"
:::