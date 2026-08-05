# Principios de TypeScript

::: tip Prefacio
Ya sabes escribir JavaScript, pero probablemente te has encontrado con estos problemas:
- Asignar un tipo incorrecto a una variable y solo descubrirlo en tiempo de ejecución
- Escribir mal el nombre de una propiedad de un objeto y pasar horas depurando
- Tipos de parámetros de función incorrectos, haciendo cambios una y otra vez

TypeScript es una herramienta que te ayuda a encontrar estos problemas antes de que el código se ejecute. Después de leer este artículo, entenderás por qué TypeScript puede mejorar la calidad del código, comprenderás conceptos fundamentales como anotaciones de tipo, interfaces y genéricos, y podrás aprovechar mejor el código generado por IA en vibecoding.
:::

**¿Qué aprenderás en este artículo?**

| Capítulo | Contenido | Qué podrás hacer después |
|----------|-----------|--------------------------|
| **Capítulo 1** | Qué es TypeScript | Entender su relación con JavaScript |
| **Capítulo 2** | Anotaciones de tipo básicas | Saber cómo anotar tipos en variables |
| **Capítulo 3** | Tipos de objeto e interfaces | Definir tipos para estructuras de datos |
| **Capítulo 4** | Tipos de función | Anotar tipos en parámetros y valores de retorno |
| **Capítulo 5** | Genéricos | Escribir código reutilizable con seguridad de tipos |
| **Capítulo 6** | Inferencia de tipos y consejos prácticos | Saber cuándo necesitas anotaciones explícitas |

---

## 1. Qué es TypeScript

::: tip 🤔 Pregunta clave
**JavaScript ya es suficiente, ¿por qué necesitamos TypeScript?** ¿Vale la pena aprender una sintaxis adicional?
:::

### 1.1 De "errores en tiempo de ejecución" a "detección en tiempo de compilación"

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🔴 Puntos débiles de JavaScript**
- Los errores de tipo solo se descubren en tiempo de ejecución
- Los errores tipográficos son difíciles de detectar
- Es fácil pasar cosas por alto al refactorizar
- Las sugerencias del IDE no son lo suficientemente precisas

*Como un editor de documentos sin corrector ortográfico*

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**✅ Ventajas de TypeScript**
- Los errores se detectan al escribir el código
- Sugerencias inteligentes más precisas
- Refactorización más segura
- Código más fácil de mantener

*Como un editor con corrector ortográfico y resaltado de sintaxis*

</div>
</div>

**Para entender la relación entre ambos en una frase:**

| Tecnología | Analogía | Función |
|------------|----------|---------|
| **JavaScript** | Material en bruto | Código que se puede ejecutar directamente |
| **TypeScript** | Plano + control de calidad | Añade verificación de tipos a JavaScript, y finalmente se compila a JavaScript |

### 1.2 Motivación de vibecoding también necesita TypeScript

::: warning La IA también puede escribir código con errores
Un desarrollador usó IA para generar una funcionalidad de gestión de usuarios. El código JavaScript que la IA escribió funcionaba, pero había un problema: la edad del usuario debía ser un número, pero a veces se asignaba erróneamente como una cadena de texto.

Como resultado, al calcular "si es mayor de edad", la cadena "25" se trataba como texto, lo que provocaba un fallo en la validación. Este bug permaneció oculto durante mucho tiempo, hasta que un usuario introdujo un carácter no numérico y lo expuso.

Si se hubiera usado TypeScript, este código habría mostrado un error al escribirlo: `No se puede asignar el tipo "string" al tipo "number"`.

**Este es el valor de TypeScript — cuando la IA escribe un tipo incorrecto, puedes detectarlo de inmediato.**
:::

### 1.3 TypeScript en la práctica es así

TypeScript no es un lenguaje completamente nuevo, es solo un "superconjunto" de JavaScript:

```typescript
// Esto es JavaScript válido, y también TypeScript válido
const name = "张三"
const age = 25
function greet(user) {
  return `Hello ${user}`
}

// Estas son anotaciones de tipo propias de TypeScript
const name2: string = "李四"
const age2: number = 30
function greet2(user: string): string {
  return `Hello ${user}`
}
```

**Comprensión clave:**
- Todo el código JavaScript es código TypeScript válido
- TypeScript añade **anotaciones de tipo** opcionales
- TypeScript finalmente se compila a JavaScript para su ejecución

::: info 💡 Inspiración clave
TypeScript no cambia la forma en que se ejecuta el código, solo verifica si los tipos son correctos en tiempo de compilación. **Puedes adoptar TypeScript gradualmente** — empezando por añadir tipos a las variables clave.
:::

---

## 2. Anotaciones de tipo básicas

::: tip 🤔 Pregunta clave
**¿Cómo le digo a TypeScript qué tipo debe tener una variable?** ¿Cuál es la sintaxis de las anotaciones de tipo?
:::

### 2.1 Sintaxis de anotaciones de tipo

Una anotación de tipo consiste en añadir `: tipo` después del nombre de la variable:

```typescript
// Sintaxis: nombreVariable: tipo = valor
const name: string = "张三"
let age: number = 25
let isStudent: boolean = true
```

👇 **Pruébalo tú mismo**: añade anotaciones de tipo a las variables

<TypeAnnotationDemo />

::: details 🔍 ¿Por qué en algunos lugares no se necesitan anotaciones de tipo?
TypeScript puede inferir automáticamente el tipo según la asignación:

```typescript
// Estos no necesitan anotación de tipo, TypeScript puede inferirlos
const name = "张三"      // inferido como string
const age = 25          // inferido como number
const isActive = true   // inferido como boolean

// Estos casos necesitan anotación explícita
let data  // ❌ Error: no se puede inferir el tipo
let data: any  // ✅ Funciona, pero pierde las ventajas de la verificación de tipos

function add(a, b) {  // ❌ Tipos de parámetros no claros
  return a + b
}

function add2(a: number, b: number): number {  // ✅ Tipos claros
  return a + b
}
```
:::

### 2.2 Tipos básicos

TypeScript admite todos los tipos básicos de JavaScript:

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `string` | Cadena de texto | `"hello"`, `'你好'` |
| `number` | Número (enteros y decimales) | `42`, `3.14` |
| `boolean` | Valor booleano | `true`, `false` |
| `null` / `undefined` | Valor nulo | `null`, `undefined` |
| `array` | Array | `number[]`, `string[]` |
| `object` | Objeto | `{ name: string; age: number }` |

**Dos formas de escribir tipos de array:**

```typescript
// Forma 1: tipo[] (más común)
const numbers: number[] = [1, 2, 3, 4, 5]
const names: string[] = ["张三", "李四", "王五"]

// Forma 2: Array<tipo>
const numbers2: Array<number> = [1, 2, 3, 4, 5]
const names2: Array<string> = ["张三", "李四", "王五"]
```

**Tipos especiales:**

```typescript
// any: cualquier tipo (usar con precaución, equivale a desactivar la verificación de tipos)
let data: any = 42
data = "ahora puede ser una cadena"
data = { name: "张三" }  // también puede ser un objeto

// unknown: any con seguridad de tipos
let value: unknown = 42
// if (typeof value === "number") {
//   console.log(value + 10)  // necesita verificar el tipo antes de usar
// }

// void: sin valor de retorno
function log(message: string): void {
  console.log(message)
}

// never: nunca retorna
function error(message: string): never {
  throw new Error(message)
}
```

::: info 💡 Consejos de reconocimiento
- Ves `: string` → es una anotación de tipo string
- Ves `: number[]` → es una anotación de array de números
- Ves `: void` → esta función no tiene valor de retorno
:::

---

## 3. Tipos de objeto e interfaces

::: tip 🤔 Pregunta clave
**¿Cómo defino el tipo de un objeto?** ¿Qué tipo deben tener sus propiedades?
:::

### 3.1 Interface: definir la "forma" de un objeto

Las interfaces son la forma principal de definir tipos de objeto en TypeScript:

```typescript
// Definir una interfaz User
interface User {
  id: number
  name: string
  email: string
  age?: number  // propiedad opcional
}

// Usar la interfaz
const user: User = {
  id: 1,
  name: "张三",
  email: "zhangsan@example.com",
  age: 25
}

// age es opcional, se puede omitir
const user2: User = {
  id: 2,
  name: "李四",
  email: "lisi@example.com"
}
```

👇 **Pruébalo tú mismo**: crea objetos que cumplan con la definición de la interfaz

<InterfaceDemo />

::: details 🔍 Otras características de las interfaces
```typescript
// Propiedades de solo lectura
interface User {
  readonly id: number  // id no se puede modificar después de crear
  name: string
}

const user: User = {
  id: 1,
  name: "张三"
}

user.id = 2  // ❌ Error: no se puede modificar una propiedad de solo lectura
user.name = "李四"  // ✅ Se puede modificar

// Tipo de función
interface User {
  name: string
  greet: () => string  // greet es una función que devuelve string
}

const user: User = {
  name: "张三",
  greet: () => "Hello"
}

// Herencia de interfaces
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

### 3.2 Alias de tipo (Type Alias)

Además de las interfaces, se puede usar `type` para definir alias de tipo:

```typescript
// Alias de tipo
type User = {
  id: number
  name: string
  email: string
}

// Tipos de unión
type Status = "pending" | "success" | "error"

const status: Status = "success"  // ✅
// const status2: Status = "failed"  // ❌ Error: no está en el tipo de unión

// Tipos de intersección (combinar múltiples tipos)
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

**Interface vs Type Alias:**

| Característica | interface | type |
|----------------|-----------|------|
| Extensión | `extends` | `&` tipo de intersección |
| Declaración duplicada | Se fusiona automáticamente | Produce error |
| Casos de uso | Forma de objetos, clases | Tipos de unión, intersección, alias de tipos básicos |

::: info 💡 Consejos de reconocimiento
- Ves `interface` → es una definición de tipo de objeto
- Ves `type` → es un alias de tipo
- Ves `?` → es una propiedad opcional
- Ves `readonly` → es una propiedad de solo lectura
:::

---

## 4. Tipos de función

::: tip 🤔 Pregunta clave
**¿Cómo anoto los tipos de los parámetros y el valor de retorno de una función?**
:::

### 4.1 Tipos de parámetros y tipo de retorno

```typescript
// Anotación completa de tipos de función
function add(a: number, b: number): number {
  return a + b
}

// Función flecha
const multiply = (a: number, b: number): number => {
  return a * b
}

// Sin valor de retorno
function log(message: string): void {
  console.log(message)
}

// Devolver múltiples tipos (tipo de unión)
function parseInput(input: string): number | string {
  const num = parseFloat(input)
  return isNaN(num) ? input : num
}
```

### 4.2 Parámetros opcionales y parámetros por defecto

```typescript
// Parámetro opcional (marcado con ?)
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name
}

greet("张三")  // "张三"
greet("张三", "先生")  // "先生 张三"

// Parámetro por defecto
function greet2(name: string, title: string = "朋友"): string {
  return `${title} ${name}`
}

greet2("李四")  // "朋友 李四"
greet2("李四", "博士")  // "博士 李四"
```

### 4.3 Tipo de función como parámetro

```typescript
// Aceptar una función como parámetro
function calculate(
  a: number,
  b: number,
  operation: (x: number, y: number) => number
): number {
  return operation(a, b)
}

calculate(10, 5, (x, y) => x + y)  // 15
calculate(10, 5, (x, y) => x * y)  // 50

// Forma más clara: definir primero el tipo de función
type Operation = (x: number, y: number) => number

function calculate2(
  a: number,
  b: number,
  operation: Operation
): number {
  return operation(a, b)
}
```

::: info 💡 Consejos de reconocimiento
- Ves `(a: number, b: number) => number` → es un tipo de función, describe parámetros y valor de retorno
- Ves `: void` → la función no tiene valor de retorno
- Ves `?` → el parámetro es opcional
:::

---

## 5. Genéricos

::: tip 🤔 Pregunta clave
**¿Cómo escribo código que pueda manejar múltiples tipos pero manteniendo la seguridad de tipos?**
:::

### 5.1 Concepto básico de genéricos

Los genéricos te permiten definir funciones, interfaces o clases sin especificar un tipo concreto de antemano, sino especificándolo en el momento de uso:

```typescript
// Función genérica: T es la variable de tipo
function identity<T>(arg: T): T {
  return arg
}

// Especificar el tipo al usar
const num1 = identity<number>(42)  // el tipo es number
const str1 = identity<string>("hello")  // el tipo es string

// Inferencia de tipos: TypeScript puede inferir automáticamente
const num2 = identity(42)  // inferido como number
const str2 = identity("hello")  // inferido como string
```

👇 **Pruébalo tú mismo**: usa genéricos para manejar diferentes tipos de datos

<GenericDemo />

### 5.2 Restricciones de genéricos

Limitar que el genérico cumpla ciertas condiciones:

```typescript
// Restringir T para que tenga la propiedad length
interface HasLength {
  length: number
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length)
}

logLength("hello")  // ✅ las cadenas tienen length
logLength([1, 2, 3])  // ✅ los arrays tienen length
// logLength(42)  // ❌ los números no tienen la propiedad length
```

### 5.3 Interfaces y clases genéricas

```typescript
// Interfaz genérica
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

// Clase genérica
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

::: info 💡 Consejos de reconocimiento
- Ves `<T>` → es una variable de tipo genérico
- Ves `<T extends SomeType>` → restricción de genérico
- Ves `Array<T>` o `Promise<T>` → tipos genéricos incorporados
:::

---

## 6. Inferencia de tipos y consejos prácticos

::: tip 🤔 Pregunta clave
**¿Cuándo necesito anotaciones de tipo explícitas? ¿Cuándo puedo confiar en la inferencia?**
:::

### 6.1 Inferencia de tipos

TypeScript puede inferir automáticamente los tipos según el contexto:

```typescript
// Inferencia al inicializar variables
const name = "张三"  // inferido como string
const age = 25  // inferido como number
const isActive = true  // inferido como boolean

// Inferencia de arrays
const numbers = [1, 2, 3]  // inferido como number[]
const mixed = [1, "hello", true]  // inferido como (number | string | boolean)[]

// Inferencia de valor de retorno de función
function add(a: number, b: number) {
  return a + b  // valor de retorno inferido como number
}
```

👇 **Pruébalo tú mismo**: observa cómo TypeScript infiere los tipos

<TypeInferenceDemo />

### 6.2 Cuándo usar anotaciones de tipo explícitas

::: details Casos recomendados para usar inferencia de tipos
```typescript
// ✅ Recomendado: asignaciones literales simples
const count = 0
const name = "张三"
const isActive = true

// ✅ Recomendado: el valor de retorno de la función se puede inferir
function getUserId(user: User) {
  return user.id  // inferido como number
}
```
:::

::: details Casos recomendados para usar anotaciones explícitas
```typescript
// ✅ Recomendado: parámetros de función (obligatorio)
function add(a: number, b: number) {
  return a + b
}

// ✅ Recomendado: tipo de propiedad de objeto no claro
const user: {
  id: number
  name: string
  metadata: Record<string, any>
} = {
  id: 1,
  name: "张三",
  metadata: {}  // podría inferirse como {}, necesita especificación explícita
}

// ✅ Recomendado: tipo de retorno de función complejo
function getUser(): User | null {
  // ...
  return null
}

// ✅ Recomendado: API pública
export function calculateTotal(prices: number[]): number {
  return prices.reduce((sum, price) => sum + price, 0)
}
```
:::

### 6.3 Guardas de tipo

Verificar tipos en tiempo de ejecución:

```typescript
// Guarda de tipo typeof
function processValue(value: string | number) {
  if (typeof value === "string") {
    // Aquí TypeScript sabe que value es string
    console.log(value.toUpperCase())
  } else {
    // Aquí TypeScript sabe que value es number
    console.log(value * 2)
  }
}

// Guarda de tipo instanceof
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
    animal.bark()  // TypeScript sabe que es Dog
  } else {
    animal.meow()  // TypeScript sabe que es Cat
  }
}

// Guarda de tipo personalizada
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
    // Aquí value es User
    console.log(value.name)
  }
}
```

### 6.4 Tipos de utilidad prácticos

TypeScript proporciona algunos tipos de utilidad incorporados:

```typescript
// Partial: convierte todas las propiedades en opcionales
interface User {
  id: number
  name: string
  email: string
}

type PartialUser = Partial<User>
// Equivalente a: { id?: number; name?: string; email?: string }

// Required: convierte todas las propiedades en obligatorias
type RequiredUser = Required<PartialUser>
// Equivalente a: { id: number; name: number; email: string }

// Pick: conserva solo las propiedades especificadas
type UserBasicInfo = Pick<User, "id" | "name">
// Equivalente a: { id: number; name: string }

// Omit: excluye las propiedades especificadas
type UserWithoutEmail = Omit<User, "email">
// Equivalente a: { id: number; name: string }

// Record: crea un tipo de objeto
type UserRoles = Record<string, boolean>
// Equivalente a: { [key: string]: boolean }
```

---

## 7. Consejos prácticos: usar TypeScript en vibecoding

::: tip 🤔 Pregunta clave
**¿Cómo aprovechar mejor TypeScript en el desarrollo asistido por IA?**
:::

### 7.1 Haz que la IA genere código con seguridad de tipos

**❌ Mal prompt:**
```
Ayúdame a escribir una función de gestión de usuarios
```

**✅ Buen prompt:**
```
Ayúdame a escribir una función de gestión de usuarios, usando TypeScript.

La estructura de datos se define así:
interface User {
  id: number
  name: string
  email: string
  age: number
}

Necesito implementar:
1. Obtener lista de usuarios: devuelve User[]
2. Crear usuario: acepta Partial<User>, devuelve User
3. Actualizar usuario: acepta id y Partial<User>, devuelve User
4. Eliminar usuario: acepta id, devuelve void

Asegúrate de que todas las funciones tengan anotaciones de tipo completas.
```

### 7.2 Entender los mensajes de error de TypeScript

**Errores comunes y su significado:**

| Mensaje de error | Significado | Solución |
|------------------|-------------|----------|
| `Type 'X' is not assignable to type 'Y'` | El tipo X no se puede asignar al tipo Y | Verifica si los tipos coinciden o haz una conversión de tipo |
| `Property 'X' does not exist on type 'Y'` | La propiedad X no existe en el tipo Y | Revisa la ortografía del nombre de la propiedad o defínela |
| `Argument of type 'X' is not assignable to parameter of type 'Y'` | El tipo del argumento no coincide | Verifica los tipos de los parámetros al llamar a la función |
| `Type 'X' is missing the following properties from type 'Y'` | El tipo X carece de ciertas propiedades del tipo Y | Completa las propiedades faltantes |

### 7.3 Adopción gradual de TypeScript

Si tienes un proyecto JavaScript, puedes migrar gradualmente a TypeScript:

1. **Paso 1: renombrar los archivos a `.ts`**
   ```bash
   # De utils.js a utils.ts
   mv utils.js utils.ts
   ```

2. **Paso 2: corregir los errores de tipo obvios**
   ```typescript
   // Si aparece el error: Parameter 'a' implicitly has an 'any' type
   // Añade anotación de tipo
   function add(a: number, b: number) {
     return a + b
   }
   ```

3. **Paso 3: añadir definiciones de tipo gradualmente**
   ```typescript
   // Primero usa any para una solución rápida
   function processUser(user: any) {
     // ...
   }

   // Luego perfecciona los tipos
   interface User {
     id: number
     name: string
   }

   function processUser(user: User) {
     // ...
   }
   ```

4. **Paso 4: habilitar una verificación de tipos más estricta**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,  // Habilitar modo estricto
       "noImplicitAny": true,  // Prohibir any implícito
       "strictNullChecks": true  // Verificación estricta de valores nulos
     }
   }
   ```

---

## 8. Código que ahora deberías poder reconocer

- Ves `: string` → es una anotación de tipo string
- Ves `: number[]` → es una anotación de array de números
- Ves `interface User` → es una definición de tipo de objeto
- Ves `type User =` → es un alias de tipo
- Ves `<T>` → es un genérico
- Ves `extends` → herencia de interfaz o restricción de genérico
- Ves `?` → propiedad opcional
- Ves `readonly` → propiedad de solo lectura
- Ves `|` → tipo de unión
- Ves `&` → tipo de intersección

**Si leíste atentamente la sección "en profundidad" de cada capítulo, también dominas estos conceptos fundamentales:**

- **Anotaciones de tipo**: indicar explícitamente a TypeScript el tipo de una variable
- **Interfaces**: definir la estructura y tipos de un objeto
- **Genéricos**: escribir código reutilizable con seguridad de tipos
- **Inferencia de tipos**: TypeScript infiere automáticamente los tipos
- **Guardas de tipo**: verificar tipos en tiempo de ejecución
- **Tipos de utilidad**: Partial, Required, Pick, Omit, etc.

::: info 💡 Cuando tengas problemas, díselo a la IA así
- "¿Cómo debería escribir la anotación de tipo para esta función? El parámetro es X, el valor de retorno es Y"
- "Ayúdame a definir una interfaz que describa esta estructura de datos: ..."
- "¿Qué significa este error de TypeScript? ¿Cómo lo soluciono?"
- "¿Cómo añado una restricción a esta función genérica para asegurar que T debe tener cierta propiedad?"
:::