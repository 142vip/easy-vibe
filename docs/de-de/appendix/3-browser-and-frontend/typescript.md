# TypeScript: Typsystem-Grundlagen

::: tip Vorwort
Sie können bereits JavaScript schreiben, sind aber vielleicht auf diese Probleme gestoßen:
- Variablen wurde der falsche Typ zugewiesen, was erst zur Laufzeit auffiel
- Objekteigenschaften wurden falsch geschrieben, was zu stundenlangem Debugging führte
- Funktionen erhielten falsche Parametertypen, was ständige Änderungen erforderte

TypeScript ist ein Werkzeug, das Ihnen hilft, diese Probleme zu erkennen, bevor Ihr Code ausgeführt wird. Nachdem Sie diesen Artikel gelesen haben, werden Sie verstehen, warum TypeScript die Codequalität verbessert, die Kernkonzepte wie Typannotationen, Interfaces und Generics verstehen und AI-generierten Code beim Vibecoding besser nutzen können.
:::

**Was lernen Sie in diesem Artikel?**

| Kapitel | Inhalt | Lernziel |
|-----|------|-----------|
| **Kapitel 1** | Was ist TypeScript | Das Verhältnis zwischen TypeScript und JavaScript verstehen |
| **Kapitel 2** | Grundlegende Typannotationen | Wissen, wie man Variablen Typen zuweist |
| **Kapitel 3** | Objekttypen und Interfaces | Datentypen für Datenstrukturen definieren |
| **Kapitel 4** | Funktionstypen | Funktionsparametern und Rückgabewerten Typen zuweisen |
| **Kapitel 5** | Generics | Wiederverwendbaren, typsicheren Code schreiben |
| **Kapitel 6** | Typinferenz und praktische Tipps | Wissen, wann explizite Annotationen nötig sind |

---

## 1. Was ist TypeScript

::: tip 🤔 Kernfrage
**JavaScript ist doch schon ausreichend, warum brauchen wir noch TypeScript?** Lohnt es sich, eine zusätzliche Syntax zu lernen?
:::

### 1.1 Vom "Laufzeitfehler" zur "Erkennung zur Kompilierzeit"

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🔴 Die Schwachstellen von JavaScript**
- Typfehler werden erst zur Laufzeit entdeckt
- Tippfehler sind schwer zu erkennen
- Refactoring führt leicht zu übersehenen Fehlern
- IDE-Vorschläge sind nicht präzise genug

*Wie ein Texteditor ohne Rechtschreibprüfung*

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**✅ Die Vorteile von TypeScript**
- Fehler werden bereits beim Schreiben des Codes erkannt
- Intelligentere Code-Vorschläge
- Sichereres Refactoring
- Besser wartbarer Code

*Wie ein Editor mit Rechtschreibprüfung und Syntax-Highlighting*

</div>
</div>

**Die Beziehung zwischen beiden auf den Punkt gebracht:**

| Technologie | Analogie | Funktion |
|------|------|------|
| **JavaScript** | Rohmaterial | Direkt ausführbarer Code |
| **TypeScript** | Bauplan + Qualitätsprüfung | Fügt JavaScript Typprüfung hinzu und wird schließlich zu JavaScript kompiliert |

### 1.2 Warum Vibecoding auch TypeScript braucht

::: warning AI-generierter Code kann auch Fehler enthalten
Ein Entwickler ließ eine Benutzerverwaltungsfunktion von einer KI generieren. Der von der KI geschriebene JavaScript-Code lief zwar, hatte aber ein Problem: Das Benutzeralter sollte eine Zahl sein, wurde aber manchmal fälschlicherweise als String zugewiesen.

Infolgedessen wurde bei der Berechnung "ist volljährig" der String "25" als Zeichenkette behandelt, was zu einer fehlerhaften Prüfung führte. Dieser Bug blieb lange verborgen, bis ein Benutzer ein nicht-numerisches Zeichen eingab.

Mit TypeScript hätte dieser Code bereits beim Schreiben einen Fehler gemeldet: `Typ 'string' kann nicht dem Typ 'number' zugewiesen werden`.

**Das ist der Wert von TypeScript — wenn die KI einen falschen Typ verwendet, erkennen Sie es sofort.**
:::

### 1.3 TypeScript sieht in der Praxis so aus

TypeScript ist keine völlig neue Sprache, sondern eine "Obermenge" von JavaScript:

```typescript
// Dies ist gültiges JavaScript und auch gültiges TypeScript
const name = "张三"
const age = 25
function greet(user) {
  return `Hello ${user}`
}

// Dies sind TypeScript-spezifische Typannotationen
const name2: string = "李四"
const age2: number = 30
function greet2(user: string): string {
  return `Hello ${user}`
}
```

**Wichtige Erkenntnisse:**
- Jeder JavaScript-Code ist auch gültiger TypeScript-Code
- TypeScript fügt optionale **Typannotationen** hinzu
- TypeScript wird letztendlich zu JavaScript kompiliert

::: info 💡 Kernbotschaft
TypeScript ändert nicht die Art und Weise, wie Code ausgeführt wird. Es prüft lediglich zur Kompilierzeit, ob die Typen korrekt sind. **Sie können TypeScript schrittweise einführen** — beginnen Sie damit, Schlüsselvariablen Typen zuzuweisen.
:::

---

## 2. Grundlegende Typannotationen

::: tip 🤔 Kernfrage
**Wie teilt man TypeScript mit, welchen Typ eine Variable haben soll?** Wie sieht die Syntax für Typannotationen aus?
:::

### 2.1 Syntax für Typannotationen

Typannotationen werden durch Anhängen von `: Typ` nach dem Variablennamen erstellt:

```typescript
// Syntax: Variablenname: Typ = Wert
const name: string = "张三"
let age: number = 25
let isStudent: boolean = true
```

👇 **Probieren Sie es aus**: Fügen Sie Variablen Typannotationen hinzu

<TypeAnnotationDemo />

::: details 🔍 Warum sind an manchen Stellen keine Typannotationen nötig?
TypeScript kann Typen anhand der Zuweisung automatisch ableiten:

```typescript
// Diese benötigen keine Typannotation, TypeScript kann sie ableiten
const name = "张三"      // abgeleitet als string
const age = 25          // abgeleitet als number
const isActive = true   // abgeleitet als boolean

// Diese Fälle benötigen explizite Annotationen
let data  // ❌ Fehler: Typ kann nicht abgeleitet werden
let data: any  // ✅ Funktioniert, aber die Vorteile der Typprüfung gehen verloren

function add(a, b) {  // ❌ Parametertypen sind unklar
  return a + b
}

function add2(a: number, b: number): number {  // ✅ Typen sind klar
  return a + b
}
```
:::

### 2.2 Grundlegende Typen

TypeScript unterstützt alle grundlegenden Typen von JavaScript:

| Typ | Beschreibung | Beispiel |
|------|------|------|
| `string` | Zeichenkette | `"hello"`, `'你好'` |
| `number` | Zahl (Ganzzahl und Dezimalzahl) | `42`, `3.14` |
| `boolean` | Wahrheitswert | `true`, `false` |
| `null` / `undefined` | Leerer Wert | `null`, `undefined` |
| `array` | Array | `number[]`, `string[]` |
| `object` | Objekt | `{ name: string; age: number }` |

**Zwei Schreibweisen für Array-Typen:**

```typescript
// Schreibweise 1: Typ[] (häufiger verwendet)
const numbers: number[] = [1, 2, 3, 4, 5]
const names: string[] = ["张三", "李四", "王五"]

// Schreibweise 2: Array<Typ>
const numbers2: Array<number> = [1, 2, 3, 4, 5]
const names2: Array<string> = ["张三", "李四", "王五"]
```

**Spezielle Typen:**

```typescript
// any: Beliebieger Typ (mit Vorsicht verwenden, deaktiviert die Typprüfung)
let data: any = 42
data = "jetzt kann es ein String sein"
data = { name: "张三" }  // kann auch ein Objekt sein

// unknown: Typensicheres any
let value: unknown = 42
// if (typeof value === "number") {
//   console.log(value + 10)  // Typ muss zuerst geprüft werden
// }

// void: Kein Rückgabewert
function log(message: string): void {
  console.log(message)
}

// never: Gibt niemals einen Wert zurück
function error(message: string): never {
  throw new Error(message)
}
```

::: info 💡 Erkennungstipps
- `: string` sehen → Dies ist eine Typannotation für den Typ string
- `: number[]` sehen → Dies ist eine Annotation für ein Zahlen-Array
- `: void` sehen → Diese Funktion hat keinen Rückgabewert
:::

---

## 3. Objekttypen und Interfaces

::: tip 🤔 Kernfrage
**Wie definiert man den Typ eines Objekts?** Welchen Typ sollen die Objekteigenschaften haben?
:::

### 3.1 Interface: Die "Form" eines Objekts definieren

Interfaces sind die primäre Methode in TypeScript, um Objekttypen zu definieren:

```typescript
// Ein User-Interface definieren
interface User {
  id: number
  name: string
  email: string
  age?: number  // optionale Eigenschaft
}

// Das Interface verwenden
const user: User = {
  id: 1,
  name: "张三",
  email: "zhangsan@example.com",
  age: 25
}

// age ist optional und kann weggelassen werden
const user2: User = {
  id: 2,
  name: "李四",
  email: "lisi@example.com"
}
```

👇 **Probieren Sie es aus**: Erstellen Sie Objekte, die der Interface-Definition entsprechen

<InterfaceDemo />

::: details 🔍 Weitere Interface-Funktionen
```typescript
// Schreibgeschützte Eigenschaften
interface User {
  readonly id: number  // id kann nach der Erstellung nicht geändert werden
  name: string
}

const user: User = {
  id: 1,
  name: "张三"
}

user.id = 2  // ❌ Fehler: Schreibgeschützte Eigenschaft kann nicht geändert werden
user.name = "李四"  // ✅ Kann geändert werden

// Funktionstypen
interface User {
  name: string
  greet: () => string  // greet ist eine Funktion, die string zurückgibt
}

const user: User = {
  name: "张三",
  greet: () => "Hello"
}

// Interface-Vererbung
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

### 3.2 Typ-Aliase (Type Alias)

Neben Interfaces können Sie auch `type` verwenden, um Typ-Aliase zu definieren:

```typescript
// Typ-Alias
type User = {
  id: number
  name: string
  email: string
}

// Union-Typen
type Status = "pending" | "success" | "error"

const status: Status = "success"  // ✅
// const status2: Status = "failed"  // ❌ Fehler: Nicht im Union-Typ enthalten

// Intersection-Typen (mehrere Typen zusammenführen)
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

**Interface vs. Typ-Alias:**

| Eigenschaft | interface | type |
|------|-----------|------|
| Erweiterung | `extends` | `&` Intersection-Typ |
| Doppelte Deklaration | Werden automatisch zusammengeführt | Führt zu einem Fehler |
| Anwendungsfall | Objektformen, Klassen | Union-Typen, Intersection-Typen, primitive Typ-Aliase |

::: info 💡 Erkennungstipps
- `interface` sehen → Dies definiert einen Objekttyp
- `type` sehen → Dies erstellt einen Typ-Alias
- `?` sehen → Dies ist eine optionale Eigenschaft
- `readonly` sehen → Dies ist eine schreibgeschützte Eigenschaft
:::

---

## 4. Funktionstypen

::: tip 🤔 Kernfrage
**Wie weist man Funktionsparametern und Rückgabewerten Typen zu?**
:::

### 4.1 Parametertypen und Rückgabetypen

```typescript
// Vollständige Funktionstypannotation
function add(a: number, b: number): number {
  return a + b
}

// Pfeilfunktion
const multiply = (a: number, b: number): number => {
  return a * b
}

// Kein Rückgabewert
function log(message: string): void {
  console.log(message)
}

// Mehrere Rückgabetypen (Union-Typ)
function parseInput(input: string): number | string {
  const num = parseFloat(input)
  return isNaN(num) ? input : num
}
```

### 4.2 Optionale Parameter und Standardparameter

```typescript
// Optionale Parameter (mit ? gekennzeichnet)
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name
}

greet("张三")  // "张三"
greet("张三", "先生")  // "先生 张三"

// Standardparameter
function greet2(name: string, title: string = "朋友"): string {
  return `${title} ${name}`
}

greet2("李四")  // "朋友 李四"
greet2("李四", "博士")  // "博士 李四"
```

### 4.3 Funktionstypen als Parameter

```typescript
// Eine Funktion als Parameter akzeptieren
function calculate(
  a: number,
  b: number,
  operation: (x: number, y: number) => number
): number {
  return operation(a, b)
}

calculate(10, 5, (x, y) => x + y)  // 15
calculate(10, 5, (x, y) => x * y)  // 50

// Übersichtlichere Schreibweise: Funktionstyp zuerst definieren
type Operation = (x: number, y: number) => number

function calculate2(
  a: number,
  b: number,
  operation: Operation
): number {
  return operation(a, b)
}
```

::: info 💡 Erkennungstipps
- `(a: number, b: number) => number` sehen → Dies ist ein Funktionstyp, der Parameter und Rückgabewert beschreibt
- `: void` sehen → Die Funktion hat keinen Rückgabewert
- `?` sehen → Der Parameter ist optional
:::

---

## 5. Generics

::: tip 🤔 Kernfrage
**Wie schreibt man Code, der mehrere Typen verarbeiten kann und trotzdem typsicher bleibt?**
:::

### 5.1 Grundkonzept der Generics

Generics erlauben es Ihnen, bei der Definition von Funktionen, Interfaces oder Klassen keinen konkreten Typ festzulegen, sondern diesen erst bei der Verwendung anzugeben:

```typescript
// Generische Funktion: T ist eine Typvariable
function identity<T>(arg: T): T {
  return arg
}

// Bei der Verwendung den Typ explizit angeben
const num1 = identity<number>(42)  // Typ ist number
const str1 = identity<string>("hello")  // Typ ist string

// Typinferenz: TypeScript kann den Typ automatisch ableiten
const num2 = identity(42)  // abgeleitet als number
const str2 = identity("hello")  // abgeleitet als string
```

👇 **Probieren Sie es aus**: Verwenden Sie Generics, um verschiedene Datentypen zu verarbeiten

<GenericDemo />

### 5.2 Generic Constraints

Schränken Sie Generics so ein, dass sie bestimmte Bedingungen erfüllen müssen:

```typescript
// Einschränkung: T muss die Eigenschaft length haben
interface HasLength {
  length: number
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length)
}

logLength("hello")  // ✅ Strings haben length
logLength([1, 2, 3])  // ✅ Arrays haben length
// logLength(42)  // ❌ Zahlen haben keine length-Eigenschaft
```

### 5.3 Generische Interfaces und Klassen

```typescript
// Generisches Interface
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

// Generische Klasse
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
// numberStorage.add("string")  // ❌ Fehler

const stringStorage = new Storage<string>()
stringStorage.add("hello")
// stringStorage.add(1)  // ❌ Fehler
```

::: info 💡 Erkennungstipps
- `<T>` sehen → Dies ist eine generische Typvariable
- `<T extends SomeType>` sehen → Generic-Constraint
- `Array<T>` oder `Promise<T>` sehen → Eingebaute generische Typen
:::

---

## 6. Typinferenz und praktische Tipps

::: tip 🤔 Kernfrage
**Wann sind explizite Typannotationen nötig? Wann kann man sich auf die Inferenz verlassen?**
:::

### 6.1 Typinferenz

TypeScript kann Typen basierend auf dem Kontext automatisch ableiten:

```typescript
// Inferenz bei der Variableninitialisierung
const name = "张三"  // abgeleitet als string
const age = 25  // abgeleitet als number
const isActive = true  // abgeleitet als boolean

// Array-Inferenz
const numbers = [1, 2, 3]  // abgeleitet als number[]
const mixed = [1, "hello", true]  // abgeleitet als (number | string | boolean)[]

// Inferenz des Funktionsrückgabewerts
function add(a: number, b: number) {
  return a + b  // Rückgabewert wird als number abgeleitet
}
```

👇 **Probieren Sie es aus**: Beobachten Sie, wie TypeScript Typen ableitet

<TypeInferenceDemo />

### 6.2 Wann explizite Typannotationen verwenden

::: details Fälle, in denen Typinferenz empfohlen wird
```typescript
// ✅ Empfohlen: Einfache Literalzuweisungen
const count = 0
const name = "张三"
const isActive = true

// ✅ Empfohlen: Funktionsrückgabewerte können abgeleitet werden
function getUserId(user: User) {
  return user.id  // abgeleitet als number
}
```
:::

::: details Fälle, in denen explizite Annotationen empfohlen werden
```typescript
// ✅ Empfohlen: Funktionsparameter (zwingend erforderlich)
function add(a: number, b: number) {
  return a + b
}

// ✅ Empfohlen: Objekteigenschaften mit unklarem Typ
const user: {
  id: number
  name: string
  metadata: Record<string, any>
} = {
  id: 1,
  name: "张三",
  metadata: {}  // könnte als {} abgeleitet werden, muss explizit angegeben werden
}

// ✅ Empfohlen: Komplexe Funktionsrückgabetypen
function getUser(): User | null {
  // ...
  return null
}

// ✅ Empfohlen: Öffentliche API
export function calculateTotal(prices: number[]): number {
  return prices.reduce((sum, price) => sum + price, 0)
}
```
:::

### 6.3 Type Guards

Typen zur Laufzeit prüfen:

```typescript
// typeof Type Guard
function processValue(value: string | number) {
  if (typeof value === "string") {
    // Hier weiß TypeScript, dass value ein string ist
    console.log(value.toUpperCase())
  } else {
    // Hier weiß TypeScript, dass value eine number ist
    console.log(value * 2)
  }
}

// instanceof Type Guard
class Dog {
  bark() {
    console.log("Wuff")
  }
}

class Cat {
  meow() {
    console.log("Miau")
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark()  // TypeScript weiß, dass dies ein Dog ist
  } else {
    animal.meow()  // TypeScript weiß, dass dies eine Cat ist
  }
}

// Benutzerdefinierter Type Guard
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
    // Hier ist value ein User
    console.log(value.name)
  }
}
```

### 6.4 Nützliche Utility-Typen

TypeScript bietet einige eingebaute Utility-Typen:

```typescript
// Partial: Macht alle Eigenschaften optional
interface User {
  id: number
  name: string
  email: string
}

type PartialUser = Partial<User>
// Entspricht: { id?: number; name?: string; email?: string }

// Required: Macht alle Eigenschaften erforderlich
type RequiredUser = Required<PartialUser>
// Entspricht: { id: number; name: string; email: string }

// Pick: Behält nur die angegebenen Eigenschaften
type UserBasicInfo = Pick<User, "id" | "name">
// Entspricht: { id: number; name: string }

// Omit: Schließt die angegebenen Eigenschaften aus
type UserWithoutEmail = Omit<User, "email">
// Entspricht: { id: number; name: string }

// Record: Erstellt einen Objekttyp
type UserRoles = Record<string, boolean>
// Entspricht: { [key: string]: boolean }
```

---

## 7. Praktische Tipps: TypeScript im Vibecoding einsetzen

::: tip 🤔 Kernfrage
**Wie kann man TypeScript bei der KI-gestützten Entwicklung besser nutzen?**
:::

### 7.1 Die KI typsicheren Code generieren lassen

**❌ Schlechter Prompt:**
```
Schreibe mir eine Benutzerverwaltungsfunktion
```

**✅ Guter Prompt:**
```
Schreibe mir eine Benutzerverwaltungsfunktion mit TypeScript.

Die Datenstruktur ist wie folgt definiert:
interface User {
  id: number
  name: string
  email: string
  age: number
}

Es soll implementiert werden:
1. Benutzerliste abrufen: gibt User[] zurück
2. Benutzer erstellen: akzeptiert Partial<User>, gibt User zurück
3. Benutzer aktualisieren: akzeptiert id und Partial<User>, gibt User zurück
4. Benutzer löschen: akzeptiert id, gibt void zurück

Bitte stelle sicher, dass alle Funktionen vollständige Typannotationen haben.
```

### 7.2 TypeScript-Fehlermeldungen verstehen

**Häufige Fehler und ihre Bedeutung:**

| Fehlermeldung | Bedeutung | Lösung |
|---------|------|---------|
| `Type 'X' is not assignable to type 'Y'` | Typ X kann nicht dem Typ Y zugewiesen werden | Prüfen Sie, ob die Typen übereinstimmen, oder führen Sie eine Typumwandlung durch |
| `Property 'X' does not exist on type 'Y'` | Eigenschaft X existiert nicht auf Typ Y | Prüfen Sie die Schreibweise des Eigenschaftsnamens oder definieren Sie die Eigenschaft |
| `Argument of type 'X' is not assignable to parameter of type 'Y'` | Parametertypen stimmen nicht überein | Prüfen Sie die Parametertypen beim Funktionsaufruf |
| `Type 'X' is missing the following properties from type 'Y'` | Typ X fehlen bestimmte Eigenschaften von Typ Y | Ergänzen Sie die fehlenden Eigenschaften |

### 7.3 Schrittweise Einführung von TypeScript

Wenn Sie ein JavaScript-Projekt haben, können Sie schrittweise zu TypeScript migrieren:

1. **Schritt 1: Dateien in `.ts` umbenennen**
   ```bash
   # Von utils.js zu utils.ts
   mv utils.js utils.ts
   ```

2. **Schritt 2: Offensichtliche Typfehler beheben**
   ```typescript
   // Wenn der Fehler lautet: Parameter 'a' implicitly has an 'any' type
   // Typannotation hinzufügen
   function add(a: number, b: number) {
     return a + b
   }
   ```

3. **Schritt 3: Nach und nach Typdefinitionen hinzufügen**
   ```typescript
   // Zuerst mit any schnell beheben
   function processUser(user: any) {
     // ...
   }

   // Später die Typen verfeinern
   interface User {
     id: number
     name: string
   }

   function processUser(user: User) {
     // ...
   }
   ```

4. **Schritt 4: Strengere Typprüfung aktivieren**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,  // Strict-Modus aktivieren
       "noImplicitAny": true,  // Implizites any verbieten
       "strictNullChecks": true  // Strenge Null-Prüfungen
     }
   }
   ```

---

## 8. Was Sie jetzt erkennen können sollten

- `: string` sehen → Dies ist eine Typannotation für den Typ string
- `: number[]` sehen → Dies ist eine Annotation für ein Zahlen-Array
- `interface User` sehen → Dies definiert einen Objekttyp
- `type User =` sehen → Dies ist ein Typ-Alias
- `<T>` sehen → Dies ist ein Generic
- `extends` sehen → Interface-Vererbung oder Generic-Constraint
- `?` sehen → Optionale Eigenschaft
- `readonly` sehen → Schreibgeschützte Eigenschaft
- `|` sehen → Union-Typ
- `&` sehen → Intersection-Typ

**Wenn Sie die "Deep Dive"-Abschnitte jedes Kapitels aufmerksam gelesen haben, beherrschen Sie auch diese Kernkonzepte:**

- **Typannotationen**: TypeScript den Typ einer Variablen explizit mitteilen
- **Interfaces**: Die Struktur und den Typ eines Objekts definieren
- **Generics**: Wiederverwendbaren, typsicheren Code schreiben
- **Typinferenz**: TypeScript leitet Typen automatisch ab
- **Type Guards**: Typen zur Laufzeit prüfen
- **Utility-Typen**: Partial, Required, Pick, Omit und mehr

::: info 💡 So sprechen Sie mit der KI, wenn Sie auf Probleme stoßen
- "Wie sollte die Typannotation für diese Funktion aussehen? Der Parameter ist X, der Rückgabewert ist Y"
- "Definiere mir ein Interface, das diese Datenstruktur beschreibt: ..."
- "Was bedeutet dieser TypeScript-Fehler? Wie kann ich ihn beheben?"
- "Wie füge ich dieser generischen Funktion einen Constraint hinzu, um sicherzustellen, dass T eine bestimmte Eigenschaft hat?"
:::