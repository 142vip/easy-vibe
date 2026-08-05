# Principios del entorno de ejecución de JavaScript

::: tip Prefacio
Ya has aprendido la sintaxis básica de JavaScript, pero ¿alguna vez te has preguntado:
- ¿Dónde se ejecuta realmente el código?
- ¿Por qué el mismo código se comporta de manera diferente en el navegador y en Node.js?
- ¿Por qué a veces el código se "congela" y otras veces parece ejecutarse "en paralelo"?

Este artículo te guiará a través del entorno de ejecución de JavaScript, incluyendo el bucle de eventos, la pila de llamadas, la gestión de memoria y más. Al terminar de leer, entenderás por qué el código se ejecuta en un orden determinado, podrás localizar rápidamente bugs relacionados con operaciones asíncronas, optimizar el rendimiento del código y evitar fugas de memoria.
:::

**¿Qué aprenderás en este artículo?**

| Capítulo | Contenido | ¿Qué podrás hacer después? |
|----------|-----------|----------------------------|
| **Capítulo 1** | Visión general del entorno de ejecución | Entender dónde se ejecuta el código JavaScript |
| **Capítulo 2** | Entorno de ejecución del navegador | Conocer las Web APIs que ofrece el navegador |
| **Capítulo 3** | Entorno de ejecución de Node.js | Comprender el entorno JavaScript del lado del servidor |
| **Capítulo 4** | Bucle de eventos en profundidad | Dominar el orden de ejecución de macrotareas y microtareas |
| **Capítulo 5** | Pila de llamadas y memoria | Entender el proceso de ejecución del código y la gestión de memoria |
| **Capítulo 6** | Técnicas prácticas | Optimizar el rendimiento y depurar fugas de memoria |

---

## 1. Visión General del Entorno de Ejecución

::: tip 🤔 Pregunta clave
**¿Qué es el "entorno de ejecución"?** JavaScript es solo un lenguaje, ¿por qué el mismo código se comporta de manera diferente en distintos entornos?
:::

### 1.1 Qué es el entorno de ejecución

**Entorno de ejecución = Motor de JavaScript + APIs proporcionadas por el entorno**

Si comparamos JavaScript con un "lenguaje de programación", el entorno de ejecución sería el "sistema operativo": determina lo que tu código puede y no puede hacer.

```
┌─────────────────────────────────────┐
│            Código JavaScript         │
├─────────────────────────────────────┤
│      Motor de JavaScript (V8)       │  ← Analiza y ejecuta el código
├─────────────────────────────────────┤
│   Entorno de ejecución              │
│   (Navegador / Node.js)             │  ← Proporciona capacidades adicionales
└─────────────────────────────────────┘
```

**Una analogía: JavaScript es el "idioma", el entorno de ejecución es la "ciudad"**

- La sintaxis de JavaScript (el idioma) es la misma en todas partes
- Pero las instalaciones que ofrece cada ciudad son diferentes:
  - Navegador = tiene DOM, window, fetch (como una ciudad con centros comerciales y bibliotecas)
  - Node.js = tiene fs, http, path (como una ciudad con fábricas y autopistas)

### 1.2 Los dos principales entornos de ejecución

| Característica | Navegador | Node.js |
|---------------|-----------|---------|
| **Uso principal** | Interacción web, interfaz de usuario | Aplicaciones del lado del servidor, herramientas CLI |
| **Objeto global** | `window` | `global` |
| **API DOM** | ✅ Soportada | ❌ No soportada |
| **Sistema de archivos** | ❌ Limitado | ✅ Soporte completo |
| **Sistema de módulos** | ES Modules | CommonJS + ES Modules |
| **Temporizadores** | `setTimeout`, `setInterval` | `setTimeout`, `setInterval` |
| **Peticiones de red** | `fetch`, `XMLHttpRequest` | Módulos `http`, `https` |

👇 **Pruébalo tú mismo**: Compara las diferencias entre el entorno del navegador y Node.js

<RuntimeEnvironmentDemo />

::: info 💡 Idea clave
El entorno de ejecución determina qué APIs puedes usar. Las APIs DOM disponibles en el navegador no funcionan en Node.js; las APIs de archivos disponibles en Node.js tampoco funcionan en el navegador. Por eso algunos códigos necesitan "detección de entorno".
:::

---

## 2. Entorno de Ejecución del Navegador

::: tip 🤔 Pregunta clave
**¿Qué capacidades ofrece el navegador para que JavaScript manipule páginas web?**
:::

### 2.1 Composición del entorno de ejecución del navegador

```
┌─────────────────────────────────────────────┐
│            Motor de JavaScript               │
│            (V8 / SpiderMonkey)               │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│              Web APIs                        │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐     │
│  │   DOM   │ │   BOM    │ │ Network  │     │
│  │Manipular │ │Controlar │ │Peticiones│     │
│  │  la web  │ │navegador │ │  de red  │     │
│  └─────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           Bucle de eventos (Event Loop)      │
│  Coordina la ejecución de código, eventos    │
│  y la programación de tareas                 │
└─────────────────────────────────────────────┘
```

### 2.2 Las tres categorías de Web APIs

**1. API DOM - Manipular el contenido de la página web**

```javascript
// Buscar un elemento
const title = document.querySelector('h1')

// Modificar el contenido
title.textContent = 'Nuevo título'

// Añadir estilos
title.style.color = 'red'
```

**2. API BOM - Controlar el navegador**

```javascript
// Navegar a otra página
window.location.href = 'https://example.com'

// Almacenamiento del navegador
localStorage.setItem('key', 'value')

// Historial del navegador
history.back()
```

**3. API Network - Peticiones de red**

```javascript
// Enviar una petición HTTP
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
```

### 2.3 Mecanismo de eventos propio del navegador

Una de las características más potentes del entorno de ejecución del navegador es estar "dirigido por eventos": el código no necesita ejecutarse continuamente, sino que se ejecuta cuando el usuario interactúa.

```javascript
button.addEventListener('click', () => {
  console.log('Se ha hecho clic en el botón')
})
```

**Tipos de eventos comunes:**

| Tipo de evento | Cuándo se dispara | Escenario real |
|---------------|-------------------|----------------|
| `click` | Clic del ratón | Interacción con botones |
| `input` | Cambio en el contenido del campo de entrada | Búsqueda en tiempo real |
| `scroll` | Desplazamiento de la página | Carga diferida (lazy loading) |
| `load` | Recurso completamente cargado | Inicialización de datos |
| `error` | Cuando ocurre un error | Manejo de errores |

---

## 3. Entorno de Ejecución de Node.js

::: tip 🤔 Pregunta clave
**¿Qué permite que JavaScript se ejecute en el lado del servidor?**
:::

### 3.1 Composición de Node.js

```
┌─────────────────────────────────────────────┐
│            Motor de JavaScript               │
│                 (V8)                         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           Módulos integrados de Node.js      │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐     │
│  │   fs    │ │   http   │ │   path   │     │
│  │Operac.  │ │Servidor  │ │Manejo de │     │
│  │archivos │ │   web    │ │  rutas   │     │
│  └─────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│          Biblioteca libuv (bucle de eventos) │
│      Soporte de E/S asíncrona multiplataforma│
└─────────────────────────────────────────────┘
```

### 3.2 Capacidades exclusivas de Node.js

**1. Operaciones del sistema de archivos**

```javascript
const fs = require('fs')

// Leer un archivo
fs.readFile('./data.txt', 'utf8', (err, data) => {
  if (err) throw err
  console.log(data)
})

// Escribir en un archivo
fs.writeFile('./output.txt', 'Hello', (err) => {
  if (err) throw err
  console.log('Escritura exitosa')
})
```

**2. Servidor HTTP**

```javascript
const http = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end('<h1>Hello World</h1>')
})

server.listen(3000)
```

**3. Sistema de módulos**

```javascript
// CommonJS (por defecto en Node.js)
const fs = require('fs')
module.exports = { myFunction }

// ES Modules (forma moderna)
import fs from 'fs'
export { myFunction }
```

### 3.3 Comparativa: Navegador vs Node.js

| Característica | Navegador | Node.js |
|---------------|-----------|---------|
| **Archivo de entrada** | Archivo HTML | Archivo JavaScript |
| **Objeto global** | `window`, `document` | `global`, `process` |
| **Carga de módulos** | Etiqueta `<script>` | `require()` / `import` |
| **Seguridad** | Entorno aislado (sandbox), restringido | Puede acceder a recursos del sistema |
| **Uso** | Interfaz de usuario | Servicios backend, herramientas |

---

## 4. Bucle de Eventos en Profundidad

::: tip 🤔 Pregunta clave
**JavaScript es de un solo hilo, ¿cómo logra no bloquearse?**
:::

### 4.1 Qué es el bucle de eventos

**Bucle de eventos = El "centro de programación de tareas" de JavaScript**

JavaScript es de un solo hilo, solo puede hacer una cosa a la vez. Pero el bucle de eventos hace que parezca capaz de hacer "muchas cosas a la vez".

**Mecanismo central:**

1. **Ejecutar código síncrono** (pila de llamadas)
2. **Procesar tareas asíncronas** (cola de tareas)
3. **Esperar nuevas tareas** (ciclo continuo)

```
Pila de llamadas                  Cola de tareas
┌─────────────┐                  ┌──────────┐
│   Tarea 1   │                  │Macrotarea 1│
│   Tarea 2   │ ←──────────────── │Macrotarea 2│
│   Tarea 3   │  Al terminar una │Macrotarea 3│
└─────────────┘  se toma la      └──────────┘
      ↓           siguiente            ↑
      └────────────────────────────────┘
         El bucle de eventos comprueba constantemente
```

### 4.2 Macrotareas vs Microtareas

¡Este es el concepto que más fácilmente se confunde en entrevistas y en el desarrollo real!

**Macrotareas (Macrotask):**
- `setTimeout`, `setInterval`
- Operaciones de E/S
- Renderizado de la UI

**Microtareas (Microtask):**
- `Promise.then`
- `MutationObserver`
- `queueMicrotask`

**Orden de ejecución: Código síncrono → Microtareas → Macrotareas**

👇 **Pruébalo tú mismo**: Observa el orden de ejecución de macrotareas y microtareas

<TaskQueueDemo />

### 4.3 Pregunta clásica de entrevista

```javascript
console.log('1')

setTimeout(() => console.log('2'), 0)

Promise.resolve().then(() => console.log('3'))

console.log('4')

// Salida: 1, 4, 3, 2
```

**¿Por qué este orden?**

1. Ejecutar código síncrono: `console.log('1')`, `console.log('4')` → salida 1, 4
2. Revisar la cola de microtareas: `Promise.then` → salida 3
3. Revisar la cola de macrotareas: `setTimeout` → salida 2

::: info 💡 Consejo práctico
- Si quieres que el código se ejecute lo antes posible, usa microtareas (`Promise.then`)
- Si quieres retrasar la ejecución, usa macrotareas (`setTimeout`)
- Nunca mezcles demasiadas operaciones asíncronas, o caerás en el "infierno de callbacks"
:::

---

## 5. Pila de Llamadas y Memoria

::: tip 🤔 Pregunta clave
**¿Cómo se ejecuta el código? ¿Dónde se almacenan las variables? ¿Cuándo se recolectan?**
:::

### 5.1 Pila de llamadas: la "huella" de la ejecución de funciones

**Pila de llamadas = El "bloc de notas" que registra las llamadas a funciones**

Cada vez que se llama a una función, se añade un nuevo registro en la pila; cuando la función termina de ejecutarse, el registro se elimina.

```javascript
function a() {
  b()
}

function b() {
  c()
}

function c() {
  console.log('Ejecución completada')
}

a()
```

**Cambios en la pila de llamadas:**

```
Paso 1: se llama a a()
┌─────────┐
│    a    │
└─────────┘

Paso 2: a() llama a b()
┌─────────┐
│    b    │
│    a    │
└─────────┘

Paso 3: b() llama a c()
┌─────────┐
│    c    │
│    b    │
│    a    │
└─────────┘

Paso 4: c() termina, se desapilan en orden
┌─────────┐
│    b    │
│    a    │
└─────────┘
```

👇 **Pruébalo tú mismo**: Observa los cambios en la pila de llamadas

<CallStackDemo />

### 5.2 Gestión de memoria: a dónde va la basura

JavaScript tiene un mecanismo de "recolección de basura" automático: no necesitas liberar memoria manualmente, el motor lo hace por ti.

**Principio de la recolección de basura: algoritmo de marcado y barrido**

1. **Fase de marcado**: Comenzando desde la "raíz", encuentra todas las variables accesibles
2. **Fase de barrido**: Las variables no marcadas son "basura" y se recolectan

```javascript
// Ejemplo de recolección de basura
let obj1 = { name: 'Objeto 1' }
let obj2 = { name: 'Objeto 2' }

// obj1 se reasigna, el objeto original pierde su referencia
obj1 = null  // El { name: 'Objeto 1' } original será recolectado

// obj2 todavía está en uso, no será recolectado
console.log(obj2.name)
```

👇 **Pruébalo tú mismo**: Observa el proceso de recolección de basura

<GarbageCollectionDemo />

### 5.3 Fugas de memoria: las consecuencias de olvidar limpiar

**Fuga de memoria = Memoria que debería liberarse pero no se libera, acumulándose cada vez más**

Causas comunes:

**1. Demasiadas variables globales**

```javascript
// ❌ Error: las variables globales no se recolectan
globalCache = []

function addItem(item) {
  globalCache.push(item)
}
```

**2. Listeners de eventos no eliminados**

```javascript
// ❌ Error: el listener no se ha eliminado
button.addEventListener('click', handleClick)

// ✅ Correcto: eliminar el listener cuando ya no se necesita
button.removeEventListener('click', handleClick)
```

**3. Closures que referencian objetos grandes**

```javascript
// ❌ Error: el closure sigue referenciando un objeto grande, no se recolectará
function createHandler() {
  const bigData = new Array(1000000).fill('data')
  return function() {
    console.log('Procesando')
  }
}

const handler = createHandler()  // bigData permanece en memoria
```

👇 **Pruébalo tú mismo**: Observa cómo ocurren las fugas de memoria

<MemoryLeakDemo />

::: info 💡 Consejo práctico
- **Revisa periódicamente**: Abre DevTools del navegador → Memory → Take Heap Snapshot para ver el uso de memoria
- **Evita variables globales**: Usa `const` y `let` siempre que sea posible, no uses `var`
- **Limpia a tiempo**: Elimina los listeners de eventos y temporizadores cuando ya no los necesites
- **Referencias débiles**: Usa `WeakMap` y `WeakSet` para almacenar referencias a objetos
:::

---

## 6. Técnicas Prácticas

::: tip 🤔 Pregunta clave
**¿Cómo escribir código JavaScript de alto rendimiento? ¿Cómo depurar cuando surgen problemas?**
:::

### 6.1 Técnicas de optimización de rendimiento

**1. Reducir reflows y repaints**

```javascript
// ❌ Error: cada iteración del bucle dispara un reflow
for (let i = 0; i < 1000; i++) {
  element.style.top = i + 'px'
}

// ✅ Correcto: modificar en lote
element.style.transform = `translateY(${position}px)`
```

**2. Usar delegación de eventos**

```javascript
// ❌ Error: añadir un listener a cada botón
buttons.forEach(btn => {
  btn.addEventListener('click', handleClick)
})

// ✅ Correcto: añadir un solo listener al elemento padre
container.addEventListener('click', (e) => {
  if (e.target.matches('.button')) {
    handleClick(e)
  }
})
```

**3. Debounce y throttle**

```javascript
// Debounce: ejecutar después de que el usuario deje de escribir
function debounce(fn, delay) {
  let timer
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Throttle: limitar la frecuencia de ejecución
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

### 6.2 Técnicas de depuración

**1. Usar DevTools para ver la pila de llamadas**

```javascript
function a() {
  b()
}

function b() {
  c()
}

function c() {
  debugger  // Pausa aquí para ver la pila de llamadas
}

a()
```

**2. Usar `console.trace()` para rastrear la ruta de ejecución**

```javascript
function trackExecution() {
  console.trace('Ruta de ejecución')
  // Mostrará la pila de llamadas completa
}
```

**3. Usar Performance para analizar el rendimiento**

```javascript
performance.mark('start')

// Ejecutar algún código
for (let i = 0; i < 10000; i++) {
  // ...
}

performance.mark('end')
performance.measure('Rendimiento del bucle', 'start', 'end')

const measure = performance.getEntriesByName('Rendimiento del bucle')[0]
console.log(`Tiempo de ejecución: ${measure.duration}ms`)
```

### 6.3 Consulta rápida de problemas comunes

| Problema | Causa posible | Solución |
|----------|--------------|----------|
| **Alto uso de memoria** | Fuga de memoria, demasiada caché | Revisar variables globales, eliminar listeners |
| **Página congelada** | Tareas largas bloquean el hilo principal | Dividir tareas, usar Web Workers |
| **Eventos no se disparan** | Listener no vinculado, elemento no existe | Verificar el momento de carga del DOM |
| **Orden asíncrono incorrecto** | Mezcla de macrotareas y microtareas | Unificar con Promise o async/await |
| **Temporizadores imprecisos** | Hilo principal bloqueado | Usar Web Workers o requestAnimationFrame |

---

## Resumen

Ahora deberías ser capaz de entender:

- **Entorno de ejecución = Motor + APIs del entorno**, diferentes entornos ofrecen diferentes capacidades
- El **bucle de eventos** coordina el orden de ejecución de código síncrono, microtareas y macrotareas
- La **pila de llamadas** registra el proceso de ejecución de funciones, el **desbordamiento de pila** ocurre por recursión demasiado profunda
- La **recolección de basura** limpia automáticamente las variables no utilizadas, pero hay que prestar atención a las **fugas de memoria**
- La clave de la **optimización de rendimiento** es reducir reflows/repaints y usar la asincronía de forma adecuada

::: info 💡 Cuando tengas problemas, pregúntale a la IA así
- "Esta función se ejecuta demasiado lento, ayúdame a ver cómo optimizar el rendimiento"
- "El uso de memoria no para de subir, podría ser una fuga de memoria, ayúdame a revisarlo"
- "El orden de las operaciones asíncronas es incorrecto, debería ser primero A y luego B, pero ahora A y B empiezan casi al mismo tiempo"
- "El listener de eventos no se dispara, comprueba si el elemento ya está cargado en el DOM"
:::