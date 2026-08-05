# Principios de JavaScript

::: tip Prefacio
Ya has aprendido HTML y CSS y puedes crear páginas web atractivas. Pero probablemente te habrás dado cuenta: los botones no reaccionan al hacer clic, los formularios no se envían, la página web parece una imagen "estática".

Por eso necesitamos JavaScript: hace que las páginas web "cobren vida". Hacer clic en un botón despliega un menú, escribir texto activa una búsqueda en tiempo real, desplazarse carga más contenido… Todos estos efectos interactivos dependen de JavaScript.

En el vibecoding, la IA escribirá la mayor parte del código por ti. Pero al menos tienes que poder entender qué hace el código, porque si la IA se equivoca, no podrás detectarlo. Al terminar esta lectura, podrás:

- Entender qué hace el código generado por la IA
- Detectar dónde hay problemas en el código
- Decirle a la IA con claridad cómo corregirlo
:::

**¿Qué aprenderás en este artículo?**

| Capítulo | Contenido | ¿Qué podrás hacer después? |
|-----|------|-----------|
| **Capítulo 1** | ¿Qué es JavaScript? | Entender su papel en una página web |
| **Capítulo 2** | Datos y variables | Saber cómo un programa almacena y usa información |
| **Capítulo 3** | Funciones y lógica | Entender las condiciones, bucles y lógica de reutilización del código |
| **Capítulo 4** | DOM y eventos | Saber cómo el código controla la página y responde a las acciones del usuario |
| **Capítulo 5** | Técnicas prácticas | Cómo leer el código de la IA y cómo describir errores |

Cada capítulo empieza desde "saber reconocer el código", no necesitas escribirlo manualmente. Si encuentras código que no entiendes, vuelve aquí para consultarlo cuando quieras.

---

## 1. Introducción a JavaScript

::: tip 🤔 Pregunta clave
**¿Por qué una página web necesita JavaScript?** HTML y CSS ya permiten que una página tenga contenido y estilo, ¿por qué aprender otro lenguaje?
:::

### 1.1 De la "página web estática" a la "aplicación dinámica"

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📄 Página web sin JavaScript**
- Contenido fijo, sin interactividad
- Los botones no responden al hacer clic
- Los formularios no se pueden enviar
- La página no se actualiza automáticamente

*Como un póster de papel: solo se puede mirar*

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 Página web con JavaScript**
- Al hacer clic se despliega un menú
- Búsqueda en tiempo real al escribir
- Carga automática de contenido al desplazarse
- Los datos se actualizan y muestran en tiempo real

*Como una aplicación de verdad*

</div>
</div>

**La relación entre los tres, en una frase:**

| Tecnología | Analogía | Función |
|------|------|------|
| **HTML** | Esqueleto | Define la estructura y el contenido de la página |
| **CSS** | Piel | Define la apariencia y el estilo de la página |
| **JavaScript** | Músculos y sistema nervioso | Hace que la página responda, interactúe y piense |

### 1.2 Motivación de el vibecoding también necesitas entender JavaScript

::: warning Errores típicos de quien empieza con JS
Un desarrollador que acababa de empezar con JavaScript usó IA para crear una app de "contador": hacer clic en un botón suma 1 al número. El código generado por la IA funcionaba correctamente.

Pero quiso cambiarlo a "sumar 2 al hacer clic" y le dijo a la IA: "Haz que cada clic sume 2." La IA modificó el código, pero el número seguía sumando solo 1.

Le preguntó a la IA por qué no funcionaba, y la IA le dio una explicación larga, pero él no entendía qué significaba `count = count + 1` en el código, ni si la IA había modificado esa parte. Solo podía repetir "sumar 2 no funciona", y la IA generó varias versiones más: una ponía el valor inicial a 2, otra sumaba 2 en un sitio completamente irrelevante.

Finalmente leyó el concepto de "variables" del capítulo 2 y entendió que `count = count + 1` significa sumar 1 al valor de count y guardarlo de nuevo. Entonces le dijo a la IA: "Cambia `count + 1` por `count + 2`."

Lo corrigió a la primera.

**Por eso necesitas entender JavaScript: no para escribir código manualmente, sino para que cuando la IA no lo corrija bien, puedas ver de un vistazo dónde está el problema y señalarlo con precisión en una sola frase.**
:::

### 1.3 Un primer vistazo: código real generado por IA

Antes de profundizar, veamos un fragmento de código real generado por IA. No te preocupes si no lo entiendes, solo quédate con una idea general; luego explicaremos cada parte.

**Escenario**: crear una función de "cambiar el color de fondo al hacer clic en un botón"

```javascript
// Definir un conjunto de colores
const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']
let currentIndex = 0

// Encontrar el botón en la página
const button = document.querySelector('#changeBtn')

// Añadir un evento de clic al botón
button.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % colors.length
  document.body.style.backgroundColor = colors[currentIndex]
})
```

**¿Qué hace este código?**

| Código | Función | Capítulo correspondiente |
|------|------|----------|
| `const colors = [...]` | Define un conjunto de datos de colores | Capítulo 2: Arrays |
| `let currentIndex = 0` | Registra qué color se está mostrando | Capítulo 2: Variables |
| `document.querySelector(...)` | Encuentra el botón en la página | Capítulo 4: Búsqueda en el DOM |
| `button.addEventListener(...)` | Añade un evento de clic al botón | Capítulo 4: Escucha de eventos |
| `() => {...}` | Define el código que se ejecutará al hacer clic | Capítulo 3: Funciones flecha |

::: info 💡 Idea clave
No necesitas entender cada línea de código ahora mismo. Solo recuerda: **el código JavaScript es una serie de instrucciones que le dicen al navegador "cuando el usuario haga algo, esto es lo que debe ocurrir".**
:::

---

## 2. Datos: variables y tipos de datos

::: tip 🤔 Pregunta clave
**¿Cómo "recuerda" las cosas un programa?** El contenido que introduce el usuario, los datos obtenidos del servidor, los resultados intermedios de los cálculos… ¿dónde se almacena toda esta información?
:::

### 2.1 Variables: poner nombre a los datos

**Una variable es como una caja con etiqueta**: puedes meter datos dentro y luego recuperarlos usando la etiqueta.

```javascript
const name = "张三"   // El nombre no cambiará, usa const
let age = 25          // La edad puede cambiar, usa let
```

**¿Por qué distinguir entre const y let?**

Imagina: tu número de identidad (const) nunca cambiará en tu vida, pero tu edad (let) cambia cada año. JavaScript te permite usar distintas palabras clave para expresar esta intención de "cambia o no cambia".

| Palabra clave | ¿Se puede modificar? | Cuándo usarla | Ejemplo |
|--------|---------|----------|------|
| `const` | ❌ No | Datos que no cambian | Número de identidad, configuración, lista de colores |
| `let` | ✅ Sí | Datos que cambian | Contador, opción seleccionada, entrada del usuario |

::: details 🔍 Veamos un ejemplo concreto
```javascript
// Con const: estos valores no cambian
const PI = 3.14159
const MAX_USERS = 100
const APP_NAME = "TodoList"

// Con let: estos valores cambian
let count = 0
count = 1  // ✅ Se puede modificar

count = count + 1  // ✅ Se puede calcular a partir del valor original

// ¿Qué pasa si usas const?
const fixedCount = 0
fixedCount = 1  // ❌ ¡Error! const no permite reasignación
```
:::

👇 **Pruébalo**: modifica el código de abajo para ver la diferencia entre const y let

<VariableBoxDemo />

### 2.2 Tipos de datos: las distintas "cosas" en JavaScript

JavaScript clasifica los datos en varios tipos. Los tres más usados son:

| Tipo | Descripción | Ejemplo | Caso práctico |
|------|------|------|----------|
| `string` (cadena) | Contenido de texto | `"hello"`, `'你好'` | Nombre de usuario, descripción de producto, mensajes |
| `number` (número) | Valor numérico | `42`, `3.14` | Precio, cantidad, puntuación |
| `boolean` (booleano) | Sí/No | `true`, `false` | Si ha iniciado sesión, si está completado, si es visible |

**También hay dos valores especiales que conviene conocer:**

- `undefined` → la variable se ha declarado pero aún no tiene valor
- `null` → vacío intencionado (significa "aquí no hay valor")

::: details 🔍 Template strings: concatenar texto de forma más cómoda
En el código generado por IA verás a menudo cadenas entre acentos graves (`` ` ``) que contienen `${...}`:

```javascript
const name = "张三"
const age = 25

// Forma tradicional (engorrosa)
const message = "Me llamo " + name + ", tengo " + age + " años"

// Template string (más limpio)
const message = `Me llamo ${name}, tengo ${age} años`
// Resultado: "Me llamo 张三, tengo 25 años"
```

**Cómo reconocerlo**: si ves acentos graves y `${}`, es que se está insertando una variable dentro del texto.
:::

### 2.3 Objetos y arrays: organizar los datos

**Objeto = un conjunto de propiedades con nombre** (como una ficha personal)

```javascript
const user = {
  name: "张三",
  age: 25,
  isVIP: true
}

// Usa el punto para acceder a las propiedades
console.log(user.name)    // "张三"
console.log(user.age)     // 25
```

**Array = un conjunto de datos ordenados** (como una lista)

```javascript
const colors = ['rojo', 'verde', 'azul']

// Se accede por índice (empieza en 0)
console.log(colors[0])  // "rojo"
console.log(colors[1])  // "verde"
```

**Estructuras anidadas: objetos dentro de arrays, arrays dentro de objetos**

Esta es la estructura de datos más común en el código generado por IA:

```javascript
const todos = [
  { id: 1, text: "Aprender JavaScript", done: false },
  { id: 2, text: "Hacer proyecto", done: true },
  { id: 3, text: "Escribir documentación", done: false }
]

// Acceso: primero el elemento 0 del array, luego su propiedad text
console.log(todos[0].text)  // "Aprender JavaScript"
```

::: info 💡 Trucos para reconocer
- Ves `{}` → es un objeto, contiene pares `nombre: valor`
- Ves `[]` → es un array, contiene valores ordenados secuencialmente
- Ves `data[0].name` → primero toma el elemento 0 del array, luego su propiedad name
:::

### 2.4 Valor vs referencia: una trampa frecuente

¡Este es uno de los problemas más comunes para principiantes!

**Asignar tipos primitivos (string, number, boolean) = copiar un valor completamente nuevo:**

```javascript
let a = 10
let b = a      // b obtiene una copia de a
b = 20
console.log(a) // 10 (a no se ve afectado)
```

**Asignar objetos y arrays = copiar la "dirección" (apuntan al mismo sitio):**

```javascript
let user1 = { name: "张三" }
let user2 = user1      // user2 apunta al mismo objeto
user2.name = "李四"     // modificar user2 afecta a user1
console.log(user1.name) // "李四" (¡user1 también cambió!)
```

**¿Por qué crear copias?**

En React/Vue, modificar datos directamente impide que la interfaz se actualice. Por eso en el código de IA verás a menudo `[...array]` o `{...obj}`: está creando una copia para evitar afectar al original.

```javascript
// Usar el operador spread para crear una copia
const arr1 = [1, 2, 3]
const arr2 = [...arr1]     // Crea un nuevo array
arr2.push(4)
console.log(arr1)          // [1, 2, 3] (no se ve afectado)
console.log(arr2)          // [1, 2, 3, 4]
```

👇 **Pruébalo**: observa cómo cambian los datos originales al modificar una copia

<ReferenceDemo />

### 2.5 Desestructuración y spread: atajos del JavaScript moderno

Estas dos sintaxis aparecen por todas partes en el código de IA; si no las conoces, no podrás leer el código.

**Desestructuración (destructuring): extraer datos rápidamente de un objeto o array**

```javascript
const user = { name: "张三", age: 25, city: "北京" }

// Forma tradicional (engorrosa)
const name = user.name
const age = user.age

// Con desestructuración (más limpio)
const { name, age } = user
// Mismo efecto, pero en una sola línea
```

**Operador spread: copiar y extender datos**

```javascript
// Copiar un array y añadir nuevos elementos
const arr1 = [1, 2, 3]
const arr2 = [...arr1, 4, 5]  // [1, 2, 3, 4, 5]

// Copiar un objeto y añadir nuevas propiedades
const user1 = { name: "张三", age: 25 }
const user2 = { ...user1, city: "北京" }
// { name: "张三", age: 25, city: "北京" }
```

::: info 💡 Trucos para reconocer
- Ves `const { name, age } = person` → extrae name y age del objeto person
- Ves `...array` o `...obj` → despliega o extiende el array u objeto
- No necesitas saber escribirlo, pero sí debes poder leerlo
:::

---

## 3. Lógica: funciones y control de flujo

::: tip 🤔 Pregunta clave
**¿Cómo "toma decisiones" y "repite tareas" el código?** Un programa necesita ejecutar distintas operaciones según condiciones y también repetir ciertas tareas: ¿cómo se expresa esa lógica?
:::

### 3.1 Condicionales: si… entonces… si no…

**if/else: la estructura condicional más básica**

```javascript
const age = 18

if (age >= 18) {
  console.log("Mayor de edad")
} else {
  console.log("Menor de edad")
}
```

**Operador ternario: un if/else abreviado**

```javascript
// Forma completa (4 líneas)
let message
if (age >= 18) {
  message = "Mayor de edad"
} else {
  message = "Menor de edad"
}

// Operador ternario (1 línea)
const message = age >= 18 ? "Mayor de edad" : "Menor de edad"
// Formato: condición ? valor_si_verdadero : valor_si_falso
```

**Cortocircuito &&: frecuente en código React**

```javascript
// Solo muestra el panel de usuario si isLoggedIn es true
isLoggedIn && <UserPanel />

// Equivale a
if (isLoggedIn) {
  return <UserPanel />
}
```

::: info 💡 Trucos para reconocer
- Ves `? :` → es el operador ternario, un if/else abreviado
- Ves `&&` → lo de después solo se ejecuta si lo de antes es true
:::

### 3.2 Funciones: empaquetar operaciones

**Función = la receta de un plato**

- Definir una función = escribir la receta
- Invocar una función = cocinar siguiendo la receta
- Parámetros = ingredientes
- Valor de retorno = plato terminado

```javascript
// Definir la función (escribir la receta)
function greet(name) {
  return "Hello " + name
}

// Invocar la función (cocinar según la receta)
console.log(greet("张三"))  // "Hello 张三"
console.log(greet("李四"))  // "Hello 李四"
```

**Tres formas de escribirla, para reconocerlas al instante:**

```javascript
// 1. Declaración function (forma tradicional)
function greet(name) {
  return "Hello " + name
}

// 2. Función flecha (la más usada en código de IA)
const greet = (name) => {
  return "Hello " + name
}

// 3. Función flecha abreviada (cuando solo tiene una línea)
const greet = (name) => "Hello " + name
```

👇 **Pruébalo**: introduce distintos nombres y observa cómo funciona la función

<FunctionMachineDemo />

::: info 💡 Trucos para reconocer
- Ves `function` o `=>` → es una función
- Ves `fn()` → se está invocando esa función
- Ves `() => {}` → función flecha, la forma predominante en JS moderno
:::

### 3.3 Métodos de array: herramientas para procesar listas

En React/Vue, casi cada renderizado de lista usa estos métodos.

```javascript
const todos = [
  { id: 1, text: "Estudiar", done: false },
  { id: 2, text: "Trabajar", done: true }
]

// .map(): transforma cada elemento del array en otra cosa
const texts = todos.map(todo => todo.text)
// ["Estudiar", "Trabajar"]

// .filter(): filtra los elementos que cumplen una condición
const unfinished = todos.filter(todo => !todo.done)
// [{ id: 1, text: "Estudiar", done: false }]

// .find(): encuentra el primer elemento que cumple la condición
const found = todos.find(todo => todo.id === 1)
// { id: 1, text: "Estudiar", done: false }
```

::: info 💡 Trucos para reconocer
- Ves `.map()` → transforma un array, devuelve un nuevo array
- Ves `.filter()` → filtra un array
- Ves `items.map(item => <li>{item.name}</li>)` → convierte cada dato en una etiqueta de lista
:::

### 3.4 Ámbito (scope): el "rango de visibilidad" de las variables

**Usando la analogía de las "habitaciones":**

- Las variables dentro de una función son como objetos dentro de una habitación: no se ven desde fuera
- Pero quien está en la habitación sí puede ver lo que hay en el pasillo (ámbito exterior)

```javascript
const global = "variable global"  // Lo que hay en el pasillo

function room() {
  const local = "lo que hay en la habitación"  // Lo que hay en la habitación
  console.log(global)  // ✅ Puede ver el pasillo
}

console.log(local)  // ❌ ¡Error! Desde fuera no se ve lo de la habitación
```

**Intuición clave:** dónde está escrito el código determina qué variables puede ver.

👇 **Pruébalo**: haz clic en distintos ámbitos para ver qué variables son accesibles

<ScopeDemo />

### 3.5 Clausuras (closures): una función "recuerda" el entorno donde nació

**No lo tomes como un concepto aislado; entiéndelo desde un caso concreto:**

```javascript
function setupCounter() {
  let count = 0  // Esta variable está dentro de la función

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

**Intuición clave:** cuando una función se crea, "recuerda" las variables que la rodeaban, incluso después de que la función externa haya terminado de ejecutarse.

👇 **Pruébalo**: observa cómo las clausuras permiten a una función "recordar" un estado

<ClosureDemo />

### 3.6 this: quién invoca la función

**Sin entrar en reglas complejas de binding, solo los casos más comunes:**

**Caso 1: dentro del método de un objeto, this apunta a ese objeto**

```javascript
const user = {
  name: "张三",
  sayHi() {
    console.log("Hola, soy " + this.name)  // this apunta a user
  }
}
user.sayHi()  // "Hola, soy 张三"
```

**Caso 2: en un event listener, this apunta al elemento que dispara el evento**

```javascript
button.addEventListener('click', function() {
  console.log(this)  // this apunta al elemento button
})

// Pero las funciones flecha no cambian this
button.addEventListener('click', () => {
  console.log(this)  // this apunta al this del ámbito exterior
})
```

::: info 💡 ¿Qué hacer si hay un problema?
Si en el código de IA aparece un bug relacionado con this (como `Cannot read property of undefined`), dile a la IA: "El this de este método no apunta correctamente, cámbialo a función flecha o usa bind"
:::

---

## 4. Interacción: DOM, eventos y asincronía

::: tip 🤔 Pregunta clave
**¿Cómo interactúa JavaScript con la página web?** ¿Cómo encuentra los elementos de la página? ¿Cómo responde a los clics y la entrada del usuario? ¿Cómo obtiene datos del servidor?
:::

### 4.1 DOM: la página web vista por JavaScript

A los ojos de JavaScript, la página web es un "árbol" donde cada etiqueta HTML es un "nodo".

```html
<html>
  <body>
    <h1>Título</h1>
    <p>Párrafo</p>
    <ul>
      <li>Elemento 1</li>
      <li>Elemento 2</li>
    </ul>
  </body>
</html>
```

**JS manipula la página = encuentra el nodo + modifica el nodo + crea/elimina el nodo**

👇 **Pruébalo**: haz clic en los nodos para ver cómo se organiza el árbol DOM

<DOMTreeDemo />

### 4.2 Buscar y modificar elementos

**Buscar elementos:**

```javascript
// Buscar por selector CSS (lo más habitual)
const title = document.querySelector('h1')      // Busca el primer h1
const button = document.querySelector('#btn')   // Busca el elemento con id="btn"
const items = document.querySelectorAll('.item') // Busca todos los elementos con class="item"
```

**Modificar elementos:**

```javascript
// Cambiar texto
title.textContent = "Nuevo título"

// Cambiar estilo
element.style.color = "red"
element.style.fontSize = "20px"

// Cambiar clases CSS
element.classList.add('active')      // Añadir clase
element.classList.remove('hidden')   // Quitar clase
element.classList.toggle('open')     // Alternar clase (la quita si está, la añade si no)
```

::: info 💡 Trucos para reconocer
- Ves `document.querySelector` → está buscando un elemento de la página
- Ves `.textContent` → está cambiando texto
- Ves `.style.xxx` → está cambiando estilos
- Ves `.classList.add/remove/toggle` → está cambiando clases CSS
:::

### 4.3 Eventos: cuando el usuario hace algo…

**addEventListener: añadir un escuchador de eventos a un elemento**

```javascript
button.addEventListener('click', () => {
  console.log("Se ha hecho clic en el botón")
})
```

**Eventos comunes:**

| Evento | Cuándo se dispara | Caso práctico |
|------|---------|----------|
| `click` | Al hacer clic | Clic en botón, navegación por enlace |
| `input` | Al cambiar el contenido del campo | Búsqueda en tiempo real, validación de formulario |
| `submit` | Al enviar el formulario | Inicio de sesión, registro, envío de datos |
| `scroll` | Al desplazar la página | Carga diferida, volver arriba |

**Objeto de evento: obtener más información**

```javascript
input.addEventListener('input', (e) => {
  console.log(e.target.value)  // Obtener el valor del campo
  e.preventDefault()            // Prevenir el comportamiento por defecto (p.ej. recargar tras enviar formulario)
})
```

::: info 💡 Aplicación práctica
Cuando quieras añadir una funcionalidad a un botón, básicamente le estás diciendo a la IA: "Añade un evento de clic a este botón y, al hacer clic, ejecuta tal operación"
:::

### 4.4 Asincronía: por qué algunas operaciones no se completan al instante

**Analogía del restaurante:**

Después de pedir, no te quedas esperando en la puerta de la cocina; puedes hacer otras cosas mientras tanto, y cuando el plato esté listo, el camarero te lo trae.

**El caso más común: obtener datos del servidor**

```javascript
// Forma síncrona (bloquea la página, no la uses)
const data = fetch('/api/data')  // ❌ Esto bloquearía la página

// Forma asíncrona (correcta)
async function loadData() {
  try {
    const response = await fetch('/api/data')
    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.error('Ha ocurrido un error:', error)
  }
}
```

**La sintaxis async/await:**

- `async` → marca que esta función contiene operaciones asíncronas
- `await` → espera a que esta operación termine (pero sin bloquear la página)
- `try/catch` → maneja los posibles errores

👇 **Pruébalo**: observa el orden de ejecución de las operaciones asíncronas

<AsyncRestaurantDemo />

::: info 💡 Trucos para reconocer
- Ves `async/await` → está esperando una operación que tarda tiempo
- Ves `fetch()` → está obteniendo datos del servidor
- Ves `try/catch` → está manejando posibles errores
:::

### 4.5 Bucle de eventos: cómo funciona realmente JavaScript

**Sin usar términos como "microtareas/macrotareas", entendámoslo con un modelo simple:**

**JS es un "puesto de trabajo unipersonal"**: solo hace una cosa a la vez, pero tiene un "tablón de notas pendientes" (cola de tareas).

Cuando encuentra una operación que requiere espera (petición de red, temporizador), JS no se queda esperando tontamente, sino que pone un papelito con "lo que hay que hacer cuando termine" en el tablón y sigue ejecutando lo demás. Solo cuando termina lo actual, mira el tablón.

```javascript
console.log("1")

setTimeout(() => console.log("2"), 0)  // Incluso con 0 segundos, se pospone

console.log("3")

// Salida: 1, 3, 2 (¡no 1, 2, 3!)
```

**¿Por qué?**
1. Ejecuta `console.log("1")` → imprime 1
2. Encuentra `setTimeout` → pone el callback en el tablón, sigue adelante
3. Ejecuta `console.log("3")` → imprime 3
4. El código actual ha terminado, mira el tablón
5. Ejecuta el callback de `setTimeout` → imprime 2

👇 **Pruébalo**: observa el orden de ejecución del código

<JSEventLoopDemo />

::: info 💡 ¿Qué hacer si hay un problema?
Si en el código de IA la página se renderiza antes de que lleguen los datos, dile a la IA: "Los datos aún no han terminado de cargar y ya se está renderizando; hay que añadir un estado de loading y renderizar solo cuando lleguen los datos"
:::

### 4.6 Módulos: import y export

Casi todas las primeras líneas del código React/Vue generado por IA son `import`.

**import = traer funcionalidad desde otro archivo**

```javascript
// Importar una función desde un archivo de utilidades
import { formatDate } from './utils'

// Importar desde un paquete de terceros
import React from 'react'
import { useState } from 'react'
```

**export = exponer funcionalidad para que otros la usen**

```javascript
// utils.js
export function formatDate(date) {
  // ...
}

// O exportación por defecto
export default function formatDate(date) {
  // ...
}
```

**Paquete npm = herramientas escritas por otros, se instalan y se usan**

```javascript
// Instalar paquete: npm install lodash
// Usar paquete
import _ from 'lodash'
```

::: info 💡 Trucos para reconocer
- Ves `import` → está trayendo funcionalidad de otro archivo
- Ves `export` → está exponiendo funcionalidad para que otros la usen
- Ves `from 'react'` → está importando del paquete React
- Ves `from './utils'` → está importando de un archivo local
:::

---

## 5. Práctica: leer código, entender errores y describir con precisión

::: tip 🤔 Pregunta clave
**Has aprendido toda esta sintaxis, pero ¿cómo la aplicas cuando recibes código de IA?** ¿Cómo leer código rápidamente? ¿Qué hacer ante un error? ¿Cómo conseguir que la IA corrija el código con precisión?
:::

### 5.1 Cómo leer el código generado por IA

**Método de cuatro pasos:**

| Paso | Qué mirar | Ejemplo |
|------|--------|------|
| **Paso 1: Estructura general** | ¿Cuántas funciones hay? ¿Qué hace cada una? | `loadData()` carga datos, `renderList()` renderiza la lista |
| **Paso 2: Punto de entrada** | ¿Dónde empieza la ejecución? | `addEventListener('click', ...)` comienza al hacer clic |
| **Paso 3: Seguir el flujo de datos** | ¿De dónde vienen los datos? ¿A dónde van? | Obtener de la API → procesar → renderizar en la página |
| **Paso 4: Lógica de detalle** | ¿Qué hace cada función en concreto? | Bucles, condiciones, cálculos |

**Una "demostración de lectura" completa con el ejemplo del capítulo 1:**

```javascript
// Paso 1: estructura general
// - Un array de colores
// - Una variable para registrar el índice actual
// - Un evento de clic en un botón

// Paso 2: punto de entrada
// button.addEventListener('click', ...) → se ejecuta al hacer clic en el botón

// Paso 3: flujo de datos
// colors (array de colores) → currentIndex (índice actual) → backgroundColor (color de fondo)

// Paso 4: lógica de detalle
// currentIndex = (currentIndex + 1) % colors.length
// Esta fórmula significa: suma 1 cada vez, pero sin salirse del array (cíclico)
```

### 5.2 Guía rápida de errores comunes

| Error | Explicación sencilla | Cómo decírselo a la IA |
|------|-----------|-------------|
| `TypeError: Cannot read properties of undefined` | Intentas acceder a una propiedad de algo que no existe | "Error en la línea X, tal variable es undefined, revisa su asignación" |
| `ReferenceError: xxx is not defined` | Estás usando una variable que no se ha declarado | "La variable xxx no está definida, ¿puede que tenga un error tipográfico o falte importarla?" |
| `TypeError: xxx is not a function` | Estás invocando como función algo que no lo es | "xxx no es una función, comprueba su tipo y origen" |
| `SyntaxError: Unexpected token` | Error de sintaxis (paréntesis sin cerrar, falta una coma, etc.) | "Error de sintaxis en la línea X, revisa paréntesis y puntuación" |
| `CORS error` | El navegador bloquea una petición entre dominios | "Error de CORS, hay que configurar el intercambio de recursos entre dominios" |
| `404 Not Found` | El recurso solicitado no existe | "La API devuelve 404, comprueba si la URL del endpoint es correcta" |

### 5.3 Cómo describir problemas con precisión

La diferencia entre un principiante y un desarrollador experimentado a menudo se reduce a la **precisión al describir problemas**.

| ❌ Mala descripción | ✅ Buena descripción |
|-----------|-----------|
| "El código tiene un bug" | "Al hacer clic en eliminar, se borra el último elemento en vez del actual" |
| "El estilo está mal" | "El título debería estar centrado, pero está alineado a la izquierda" |
| "No se ven los datos" | "La petición fetch devuelve datos (se ven en la consola), pero la página no se rerenderiza" |
| "Añade una función" | "Añade un cuadro de búsqueda en la página de lista de usuarios que filtre en tiempo real por el campo name con coincidencia parcial" |
| "Al hacer clic no pasa nada" | "Al hacer clic en el botón, la consola muestra 'Cannot read property of undefined', error en la línea X" |

**Un ejercicio práctico:**

```javascript
// Código con bug
function deleteTodo(index) {
  todos.splice(index, 1)  // Siempre borra el último elemento
}

// Síntoma: da igual qué botón de eliminar pulses, siempre se borra el último
```

**❌ Mala descripción:** "La función de eliminar tiene un bug"

**✅ Buena descripción:** "Al hacer clic en eliminar, se borra el último elemento en vez del actual. El código usa splice(index, 1), pero el índice probablemente no es correcto. Hay que cambiar para que elimine usando el id único de cada elemento."

### 5.4 Lo que ahora deberías poder reconocer en el código

- Ves `const/let` → sabes si la variable se puede reasignar o no
- Ves `{}` → objeto / Ves `[]` → array
- Ves `{...obj}` o `[...arr]` → está creando una copia
- Ves `function` o `=>` → ha definido una operación reusable
- Ves `if/else` o `? :` → el código está evaluando una condición
- Ves `.map()` / `.filter()` → está transformando o filtrando un array
- Ves `document.querySelector` → está buscando un elemento de la página
- Ves `addEventListener` → está escuchando una acción del usuario
- Ves `async/await` → está esperando una operación que tarda tiempo
- Ves `import/export` → está importando o exportando un módulo
- Ves un error → puedes entenderlo a grandes rasgos y describírselo con precisión a la IA

**Si leíste con atención las partes de "profundización" de cada capítulo, también dominas estos conceptos clave:**

- **Valor vs referencia**: los tipos primitivos copian el valor, los objetos/arrays copian la dirección
- **Ámbito y clausuras**: una función puede "recordar" las variables que la rodeaban al ser creada
- **La esencia de this**: depende de quién invoca la función, no de dónde está escrita
- **Bucle de eventos**: JS es de un solo hilo y usa la cola de tareas para no bloquearse

Estos conceptos te ayudarán a localizar problemas más rápido.

::: info 💡 Cuando tengas un problema, díselo así a la IA
- "Error en la línea X: XXX, ayúdame a ver qué pasa"
- "La lógica de esta función es XXX, pero el resultado no es correcto, debería ser XXX"
- "Quiero modificar la función XXX, el requisito concreto es XXX"
:::