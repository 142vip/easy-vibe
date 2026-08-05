# Principios de los frameworks frontend

> 💡 **Guía de aprendizaje**: Este artículo responderá una pregunta fundamental — **¿Qué hacen exactamente los frameworks frontend (Vue, React, Svelte, etc.)?** Si solo has aprendido HTML, CSS y un poco de JavaScript, no hay problema, empezaremos desde cero.

Antes de comenzar, confirma que conoces estos dos conceptos básicos. Si no estás seguro, puedes consultar los capítulos correspondientes:

- **HTML**: El esqueleto de la página web, define qué elementos hay en la página (títulos, párrafos, botones, imágenes...). Consulta [Diseño HTML y CSS](./html-css-layout.md).
- **JavaScript**: El lenguaje de programación que hace que las páginas web "cobren vida", puede modificar el contenido de la página y responder a las acciones del usuario. Consulta [Guía profunda de JavaScript](./javascript-deep-dive.md).

También hay un concepto que aparecerá frecuentemente más adelante, aquí hacemos una explicación completa.

### Introducción a DOM

DOM significa Document Object Model, en chino "Modelo de Objetos del Documento".

Cuando abres una página web en el navegador, lo primero que hace el navegador es leer el código HTML. Después de leerlo, el navegador no toma directamente el texto HTML para mostrar la página, sino que primero **convierte el código HTML en una estructura de árbol**, almacenada en la memoria. Este árbol se llama árbol DOM.

Cada nodo (Node) del árbol corresponde a una etiqueta en el HTML. La relación de anidamiento entre etiquetas se convierte en la relación de nodo padre e hijo en el árbol DOM.

👇 **Pruébalo**:
Pasa el ratón sobre el código HTML a la izquierda, y el nodo correspondiente en el árbol DOM a la derecha se resaltará. Y viceversa. Cada línea de etiqueta HTML corresponde a un nodo en el árbol DOM.

<WhatIsDomDemo />

**¿Por qué entender el DOM?** Porque la forma en que JavaScript modifica la página es operando este árbol DOM — añadir nodos, eliminar nodos, modificar el contenido de los nodos. Y el trabajo central que hacen los frameworks frontend es ayudarte a automatizar estas operaciones DOM. Mencionaremos el DOM repetidamente más adelante; entenderlo es la base para comprender los principios de los frameworks.

---

## 0. Introducción: Introducción a "framework frontend"

Primero expliquemos la palabra "framework". En programación, un **Framework** es un conjunto de código y reglas ya escritos, que estipula cómo debe organizarse y ejecutarse tu código. Tú escribes código siguiendo su manera, y él te ayuda a manejar una gran cantidad de trabajo subyacente repetitivo y tedioso.

Un **framework frontend** es un framework especializado en ayudarte a **construir interfaces web**. Los más comunes actualmente son Vue, React, Svelte y Angular.

¿Qué problemas te ayudan a resolver exactamente? Estas tres tarjetas resumen la lógica central:

<FrameworkMotivationDemo />

A continuación, desplegaremos paso a paso, comenzando desde la pregunta más básica.

---

## 1. Pregunta central: Los datos cambian, qué pasa con la interfaz

### 1.1 Primero aclaremos qué son "datos" e "interfaz"

En cualquier aplicación web, hay dos cosas que coexisten:

- **Datos (Data / State)**: Información almacenada internamente por el programa. Por ejemplo "el carrito tiene 3 productos", "el nombre de usuario es Zhang San", "la pestaña 2 está seleccionada actualmente". Estos datos se almacenan en variables de JavaScript, el usuario no puede verlos.
- **Interfaz (UI)**: Lo que el usuario ve en la pantalla. Por ejemplo, la página muestra "Carrito(3)", muestra "Bienvenido, Zhang San", la pestaña 2 está resaltada. Estos son los efectos visuales presentados por los elementos HTML.

**Hay una correspondencia entre datos e interfaz**: si los datos son "3 productos", la interfaz debería mostrar "3". Si los datos cambian a "4 productos", la interfaz también debería cambiar a "4".

La pregunta es: **¿Quién se encarga de este proceso de "seguir el cambio"?**

👇 **Haz clic y prueba**:
Haz clic en el botón "Añadir producto", observa atentamente: los datos (izquierda) ya han cambiado, pero la interfaz (derecha) no se ha actualizado — se han "desconectado". Luego haz clic en "Sincronizar interfaz" para repararlo manualmente.

<DataUIGapDemo />

### 1.2 Motivación de variable JS cambia, la interfaz no cambia automáticamente

Este es el punto que más confunde a los principiantes, vamos a explicar el principio subyacente paso a paso.

En JavaScript, una variable es simplemente un espacio de memoria para almacenar datos. Cuando ejecutas `count = count + 1`, lo que hace el motor de JavaScript es muy simple: cambiar el valor de count en esa posición de memoria de 3 a 4. **Después de hacer esto, se acabó, no pasará nada más.**

Y el contenido mostrado en la página (por ejemplo el nodo DOM `<span>3</span>`) se almacena en un espacio de memoria completamente diferente. El motor de JavaScript, al modificar la variable, no sabe en absoluto que hay un nodo DOM en la página mostrando el valor de esa variable, ni hay ningún mecanismo que lo verifique.

Así que la causa esencial es: **Las variables de JavaScript y los nodos DOM son dos bloques de memoria independientes, no hay ningún mecanismo de vinculación automática entre ellos.** Modificar una variable solo cambia la memoria donde está la variable, la memoria donde está el nodo DOM no se ve afectada en absoluto.

```javascript
let count = 3

// Hay un nodo DOM en la página mostrando el valor de count:
// <span id="counter">3</span>

count = 4
// ¿Qué hizo el motor de JavaScript?
//   → Cambió el valor de la variable count en memoria de 3 a 4
//   → Fin. Nada más.
// Lo que se muestra en el <span> sigue siendo "3"
```

Si quieres que lo que se muestra en la página también cambie a "4", debes **escribir código adicional**, encontrar manualmente ese nodo DOM y modificar su contenido:

```javascript
count = 4  // Paso 1: cambiar la variable

// Paso 2: Debes escribir tú mismo — encontrar el nodo DOM y cambiar su texto al nuevo valor
document.getElementById('counter').textContent = count
```

Si hay 5 lugares en la página mostrando el valor de count (cantidad del carrito, lista de productos, precio total, subtotal, mensaje de estado), necesitas escribir 5 fragmentos de código así. **Si olvidas alguno, ese lugar seguirá mostrando el valor antiguo, y el usuario verá información incorrecta.**

### 1.3 Introducción a framework Dos pasos para establecer la conexión automática

El framework logra la sincronización automática gracias a **dos pasos coordinados** — ambos indispensables.

**Primer paso: "Registrar" en la plantilla qué lugares deben mostrar esta variable**

En la plantilla HTML del framework, usas una sintaxis como `{{ count }}` para marcar "aquí se debe mostrar el valor de count":

```html
<!-- Plantilla Vue -->
<span>Carrito: {{ count }} productos</span>    <!-- Posición A: quiero mostrar count -->
<span>Total: ¥{{ count * 99 }}</span>   <!-- Posición B: también uso count -->
<span>{{ count > 5 ? 'Demasiados' : 'Normal' }}</span>  <!-- Posición C: también uso count -->
```

Cuando el framework renderiza la página por primera vez, registra esta "relación de registro": **las posiciones A, B y C dependen de count**.

**Segundo paso: El framework vigila la variable, si cambia consulta el registro y actualiza automáticamente**

El framework usa el `Proxy` integrado en JavaScript para "envolver" tu variable, convirtiéndola en una "variable vigilada". Cuando modificas esta variable, Proxy hace silenciosamente algo extra mientras asigna el valor: notifica al framework "count ha cambiado". Tras recibir la notificación, el framework consulta el registro del primer paso y actualiza las tres posiciones A, B y C.

```
JS nativo:
  Escribes HTML → <span id="counter">3</span> (sin conexión alguna con la variable)
  Cambias la variable → count = 4 → Fin, la interfaz no reacciona en absoluto
  Añades manualmente → document.getElementById('counter').textContent = 4 → La interfaz se actualiza

Framework Vue:
  Escribes plantilla → <span>{{ count }}</span> (El framework recuerta: aquí depende de count)
  Cambias la variable → count = 4 → Proxy intercepta → Notifica al framework → El framework consulta el registro → Actualiza automáticamente A/B/C
```

Por eso "solo el framework puede sincronizar automáticamente" — en el HTML nativo no hay ninguna conexión entre un `<span>` y una variable JS. La sintaxis de plantilla del framework (`{{ }}`) es la clave que establece esta conexión. Cuando escribes `{{ count }}`, el framework sabe que aquí debe mostrar count; el framework puede encontrar y actualizar este lugar con precisión cuando count cambia.

👇 **Haz clic y prueba**:
Primero selecciona "JavaScript nativo", haz clic en "Ejecutar" y observa — la variable cambió pero la interfaz no se movió, tienes que sincronizar cada posición manualmente paso a paso. Luego cambia a "Usar framework", haz clic en "Ejecutar" igualmente — la variable cambia, el framework completa automáticamente todos los pasos, la interfaz sigue inmediatamente.

<WhyNoAutoSyncDemo />

### 1.4 Comparación: sincronización manual vs sincronización automática

Después de entender el principio, veamos la diferencia entre sincronización manual y automática en un escenario algo más complejo.

👇 **Haz clic y prueba**:
A la izquierda está el método de "sincronización manual" sin framework — cada área de visualización requiere que hagas clic en el botón "Sincronizar" por separado para actualizarla. A la derecha está el método de "sincronización automática" con framework — solo tienes que hacer clic en "Añadir producto", todas las áreas se actualizan automáticamente. Intenta no sincronizar intencionalmente un área a la izquierda y mira qué sucede.

<ManualVsAutoSyncDemo />

**Esta es la razón fundamental de la existencia de los frameworks frontend: añadir a las variables JavaScript la capacidad de "notificar automáticamente la actualización de la interfaz al ser modificadas", eliminando los errores que conlleva la sincronización manual.**

---

## 2. La idea central del framework: Describir la interfaz con datos

### 2.1 La diferencia entre dos formas de escribir

Entendido el valor de la "sincronización automática", veamos cómo la implementa el framework.

En la era sin frameworks (como con jQuery), el código se escribía así — diciéndole al navegador paso a paso qué hacer:

```javascript
// Paso 1: Encontrar el elemento con id counter en la página
var element = document.getElementById('counter')
// Paso 2: Cambiar el contenido de texto de este elemento al nuevo valor
element.textContent = '4'
// Paso 3: Encontrar otro elemento y cambiarlo también
document.getElementById('total').textContent = '¥396'
// Paso 4: Si la cantidad es mayor que 5, también cambiar el mensaje de estado...
```

Esta forma se llama **Imperativa** — estás "ordenando" al navegador ejecutar operaciones paso a paso.

Con un framework, el código se convierte en esto — solo describes "cómo debería verse la interfaz":

```html
<!-- No me importa cómo se actualiza este valor en la página -->
<!-- Solo digo: aquí debería mostrarse el valor de count -->
<span>{{ count }}</span>
<span>Total: ¥{{ count * 99 }}</span>
<span v-if="count > 5">¡Demasiados productos!</span>
```

Esta forma se llama **Declarativa** — estás "declarando" el estado final de la interfaz, y el framework se encarga de cómo llegar a ese estado.

### 2.2 La fórmula central: UI = f(State)

Todos los frameworks frontend modernos — ya sea Vue, React o Svelte — siguen la misma idea central, que puede expresarse con una fórmula:

> **UI = f(State)**

Esta fórmula significa:

- **State (Estado)**: Los datos de tu aplicación. Son esas variables de JavaScript: cuántos productos hay en el carrito, si el usuario ha iniciado sesión, en qué página estamos...
- **f (Función)**: El mecanismo de renderizado del framework. Sabe cómo convertir datos en interfaz.
- **UI (Interfaz)**: El resultado final que el usuario ve en la pantalla.

**Significado**: Dado un conjunto de datos (State), tras el procesamiento del framework (f), se puede obtener deterministamente la interfaz correspondiente (UI). Los datos cambian, la interfaz cambia con ellos. Los desarrolladores solo necesitan preocuparse por los datos, no por cómo se actualiza la interfaz.

👇 **Haz clic y prueba**:
Modifica los datos (State) a la izquierda, observa cómo la interfaz (UI) a la derecha cambia automáticamente. Esta es la manifestación intuitiva de `UI = f(State)`.

<DeclarativeFormulaDemo />

### 2.3 Motivación de declarativa es mejor que la imperativa

La ventaja del enfoque declarativo:

| Dimensión | Imperativa (sin framework) | Declarativa (con framework) |
| :--- | :--- | :--- |
| **Cantidad de código** | Cada actualización requiere escribir código de operación específico | Solo escribes la plantilla una vez, el framework se encarga automáticamente |
| **Probabilidad de errores** | Fácil olvidar actualizar algún lugar | El framework garantiza que todos los lugares se actualicen |
| **Legibilidad** | El código está lleno de operaciones DOM mezcladas | El código describe claramente la estructura de la interfaz |
| **Coste de mantenimiento** | Modificar una función requiere cambiar muchos lugares | Solo modifica la lógica de datos, la interfaz sigue automáticamente |

En pocas palabras: lo declarativo te permite concentrar tu energía en la "lógica de negocio" (cómo cambian los datos), sin preocuparte por "cómo actualizar la interfaz", algo repetitivo y propenso a errores.

---

## 3. Sistema reactivo: Enfoque de sabe el framework que los datos han cambiado

### 3.1 Introducción a "reactividad"

Antes dijimos "los datos cambian, la interfaz se actualiza automáticamente". Pero hay un problema técnico: **JavaScript en sí no tiene la capacidad de "notificar automáticamente a otros cuando una variable es modificada"**.

Escribes `count = 4`, JavaScript solo cambia el valor de `count` de 3 a 4, no notifica automáticamente a nadie. El framework necesita un mecanismo para "descubrir" que has modificado los datos.

**Reactividad (Reactivity)** es el nombre general de este mecanismo: cuando los datos cambian, el sistema puede percibir automáticamente el cambio y ejecutar las operaciones de actualización correspondientes.

### 3.2 Tres formas diferentes de implementación

Diferentes frameworks adoptan diferentes soluciones técnicas para implementar la reactividad. Esta es también la diferencia más fundamental entre Vue, React y Svelte.

**Forma 1: Intercepción por Proxy (enfoque de Vue)**

Vue usa el mecanismo `Proxy` integrado en JavaScript. `Proxy` puede ejecutar automáticamente un código que especifiques cuando lees o modificas una propiedad de un objeto.

Vue envuelve tu objeto de datos con `Proxy`. Cuando ejecutas `count = 4`, `Proxy` intercepta esta operación de escritura y notifica a Vue: "el valor de count ha cambiado", luego Vue va a actualizar todas las partes de la interfaz que usan `count`.

Como desarrollador no necesitas hacer nada extra — simplemente asignas el valor, Vue lo percibe automáticamente.

**Forma 2: Llamada explícita (enfoque de React)**

React no usa `Proxy`. Te requiere modificar los datos a través de una función especializada:

```javascript
// Forma de React
const [count, setCount] = useState(0)

// No puedes escribir directamente count = 4 (React no lo percibiría)
// Debes llamar a setCount:
setCount(4)
```

Solo cuando llamas a `setCount()`, React sabe que los datos han cambiado y actualizará la interfaz. Si escribes directamente `count = 4`, React no lo sabe en absoluto y la interfaz no se actualizará.

Esta forma es más "explícita" — cada cambio de datos lo notificas activamente al framework, no habrá actualizaciones inesperadas.

**Forma 3: Análisis del compilador (enfoque de Svelte)**

Svelte adoptó una ruta completamente diferente. Tiene un compilador (Compiler), que antes de que tu código se ejecute, analiza tu código fuente.

Cuando el compilador ve que escribiste una asignación como `count += 1`, inserta automáticamente después de esa línea un código que "notifica la actualización de la interfaz". Es decir, en tiempo de ejecución, la acción de "notificar" ya ha sido dispuesta por el compilador de antemano.

Tu código parece una asignación JavaScript normal, pero el código compilado incluye la lógica de actualización de la interfaz.

👇 **Haz clic y prueba**:
Selecciona diferentes pestañas de framework, haz clic en "Modificar datos", observa qué pasos experimenta cada framework "debajo del capó" para completar la detección de cambios de datos y la actualización de la interfaz.

<ReactivityMechanismDemo />

### 2.3 Comparación de los tres enfoques

| Dimensión | Vue (Proxy) | React (Llamada explícita) | Svelte (Compilador) |
| :--- | :--- | :--- | :--- |
| **Escritura del desarrollador** | Asignación directa `count = 4` | Debe usar `setCount(4)` | Asignación directa `count = 4` |
| **Momento de detectar cambios** | Intercepción automática en tiempo de ejecución | Notificación activa del desarrollador | Código de notificación insertado en tiempo de compilación |
| **Sobrecarga de rendimiento en ejecución** | Proxy tiene pequeña sobrecarga de intercepción | La programación de setState tiene pequeña sobrecarga | Casi sin sobrecarga adicional |
| **Dificultad de depuración** | Media | Flujo de datos claro, más fácil | Necesita entender el código compilado |
| **Escenario adecuado** | Buscar eficiencia de desarrollo y escritura natural | Buscar flujo de datos predecible | Buscar máximo rendimiento en ejecución |

Los tres enfoques no son absolutamente mejores o peores. Vue se escribe de forma más natural, React tiene el flujo de datos más controlable, y Svelte tiene el mejor rendimiento en ejecución. La elección depende de los requisitos específicos del proyecto.

---

## 4. Componentes: Dividir la interfaz en piezas pequeñas reutilizables

### 4.1 Motivación de dividir

Una página web completa puede tener barra de navegación, barra lateral, área de contenido, cuadro de búsqueda, avatar de usuario, diversos botones... Si todo el código está en un archivo, este archivo será muy largo y muy difícil de mantener.

Un **Componente** es dividir la interfaz en piezas pequeñas independientes, cada una gestionando sus propios datos, su propia interfaz y su propia lógica.

Por ejemplo, una página de comercio electrónico se puede dividir en estos componentes:

- Componente `NavBar`: responsable de la barra de navegación superior
- Componente `SearchBox`: responsable del cuadro de búsqueda
- Componente `ProductCard`: responsable de una tarjeta de producto
- Componente `ShoppingCart`: responsable del carrito de compras

Cada componente es independiente. `ProductCard` no necesita saber qué código hay en `NavBar`, solo necesita ocuparse de sí mismo.

### 4.2 Tres ventajas de los componentes

**Ventaja 1: Reutilización.** Una vez escrito un componente `ProductCard`, puedes usarlo 100 veces en la página — cada vez pasando diferentes datos de producto, renderizará una tarjeta diferente. No necesitas copiar y pegar 100 veces el código HTML.

**Ventaja 2: Encapsulación.** Los datos y la lógica interna del componente son independientes. Modificar el código del componente `SearchBox` no afectará al componente `ProductCard`. En el trabajo en equipo, diferentes personas pueden desarrollar componentes diferentes simultáneamente sin interferir entre sí.

**Ventaja 3: Mantenibilidad.** Cuando algo falla en una función, puedes localizar directamente el componente correspondiente para repararlo, sin necesidad de buscar en un archivo enorme de miles de líneas.

👇 **Haz clic y prueba**:
Haz clic en los nombres de componentes a la izquierda para ver su área correspondiente en la página. Observa: el mismo componente `ProductCard` se reutiliza múltiples veces, mostrando datos diferentes cada vez.

<ComponentTreeDemo />

### 4.3 Enfoque de ve un componente en el código

Tomando Vue como ejemplo, un componente es un archivo `.vue` que contiene tres partes:

```html
<!-- ProductCard.vue -->
<template>
  <!-- Aquí va la estructura HTML — la "apariencia" del componente -->
  <div class="card">
    <h3>{{ name }}</h3>
    <p>Precio: ¥{{ price }}</p>
    <button @click="addToCart">Añadir al carrito</button>
  </div>
</template>

<script setup>
// Aquí va la lógica JavaScript — el "comportamiento" del componente
const props = defineProps(['name', 'price'])

function addToCart() {
  // Lógica para "añadir al carrito"
}
</script>

<style scoped>
/* Aquí van los estilos CSS — los "estilos" del componente */
.card {
  border: 1px solid #ccc;
  padding: 16px;
}
</style>
```

Al usar este componente, es como usar una etiqueta HTML personalizada:

```html
<!-- Usando el componente ProductCard en otro lugar -->
<ProductCard name="Auriculares inalámbricos" price="299" />
<ProductCard name="Teclado mecánico" price="599" />
<ProductCard name="Monitor" price="1999" />
```

Tres líneas de código renderizan tres tarjetas de productos diferentes.

---

## 5. El coste de las operaciones DOM: Motivación de framework se esfuerza tanto

### 5.1 Introducción a operación DOM

Mencionamos antes el DOM — la estructura de árbol generada por el navegador al analizar HTML. Una **operación DOM** es usar JavaScript para modificar los nodos de este árbol. Por ejemplo, cambiar un texto, añadir un elemento, eliminar un elemento, modificar un estilo.

Estas operaciones en sí no son complicadas, pero después de ejecutar una operación DOM, el navegador necesita hacer mucho trabajo adicional para que la pantalla se actualice:

1. **Recalcular estilos**: ¿Han cambiado los estilos CSS de este nodo y sus hijos?
2. **Reorganizar el layout (Layout / Reflow)**: Recalcular la posición y tamaño de todos los elementos en la página. Porque el cambio de un elemento puede afectar la posición de otros.
3. **Repintar (Paint)**: Dibujar el contenido calculado en la pantalla.

Cada uno de estos pasos tiene un coste computacional. Si tu código dispara operaciones DOM con frecuencia, el navegador repetirá estos pasos una y otra vez, y la página se volverá lenta.

👇 **Haz clic y prueba**:
Observa la comparación de tiempo entre operar el DOM directamente y hacerlo por lotes. Cuando aumenta el número de modificaciones, el tiempo de "operar uno por uno" se dispara.

<DomOperationCostDemo />

### 5.2 Enfoque de resuelve esto el framework

Ya que operar el DOM directamente es caro, el framework busca **reducir el número de operaciones DOM**. Concretamente, hay dos estrategias:

**Estrategia 1: DOM Virtual + Comparación de diferencias (enfoque de Vue y React)**

El DOM Virtual (Virtual DOM) es un objeto JavaScript cuya estructura corresponde uno a uno con el árbol DOM real, pero solo existe en la memoria y no dispara el layout y dibujo del navegador.

Cuando los datos cambian, el flujo del framework es:

1. Crear un "nuevo árbol DOM virtual" con objetos JavaScript, describiendo cómo debería verse la interfaz tras el cambio de datos
2. Comparar este nuevo árbol con el antiguo (este proceso se llama **Diff**, comparación de diferencias), averiguando qué nodos han cambiado
3. Aplicar solo las partes realmente cambiadas al DOM real (este proceso se llama **Patch**, aplicar parches)

De este modo, independientemente de cómo cambien los datos, las operaciones sobre el DOM real siempre son mínimas.

👇 **Haz clic y prueba**:
Haz clic en "Modificar datos", observa cómo el DOM virtual compara los árboles nuevo y antiguo, encontrando los nodos cambiados. Observa el "DOM real" a la derecha — solo las partes realmente cambiadas parpadean.

<VirtualDomDiffDemo />

**Estrategia 2: Localización precisa en tiempo de compilación (enfoque de Svelte)**

Svelte no usa DOM Virtual. Su compilador analiza al escribir el código: "Cuando `count` cambie, necesita actualizarse el elemento `<span>` de la línea 3". En tiempo de ejecución, localiza directamente ese elemento para actualizarlo, sin necesidad de comparar árboles nuevo y antiguo.

Este enfoque omite el paso Diff, teóricamente con mejor rendimiento. Pero depende de la capacidad de análisis del compilador — el compilador debe ser lo suficientemente inteligente para identificar correctamente todos los lugares que necesitan actualización.

---

## 6. Tiempo de ejecución vs Tiempo de compilación: El compromiso central del diseño de frameworks

### 6.1 Dos fases

El código frontend pasa por dos fases desde que lo escribes hasta que finalmente se ejecuta en el navegador:

- **Tiempo de compilación (Compile-time / Build-time)**: Tu código fuente es procesado por herramientas de construcción (como Vite, Webpack), convertido en código que el navegador puede ejecutar directamente. Este proceso ocurre en tu computadora, antes de que el usuario abra la página.
- **Tiempo de ejecución (Runtime)**: El código convertido se ejecuta en el navegador del usuario. La lógica central del framework (como el Diff del DOM virtual, el seguimiento reactivo) funciona en esta fase.

### 6.2 Distribución del trabajo entre ambas fases

Diferentes frameworks distribuyen diferente cantidad de trabajo entre estas dos fases, lo que determina sus características de rendimiento y tamaño del paquete:

- **React**: La mayor parte del trabajo se completa en tiempo de ejecución. La creación del DOM virtual, Diff y Patch ocurren en el navegador. La ventaja es la alta flexibilidad; el inconveniente es que hay que enviar al navegador todo el código de runtime del framework (aprox. 40KB).
- **Vue**: Enfoque mixto. Las plantillas se optimizan en tiempo de compilación (el compilador marca qué nodos son estáticos y no cambiarán), pero la actualización final de la interfaz se realiza a través del DOM virtual en runtime. El código de runtime es de aprox. 30KB.
- **Svelte**: La mayor parte del trabajo se completa en tiempo de compilación. El compilador analiza tu código y genera directamente instrucciones de actualización DOM precisas. En runtime casi no hay código del framework — el paquete final contiene solo tu propio código de negocio. El tamaño del paquete es el menor.

👇 **Haz clic y prueba**:
Haz clic en las diferentes pestañas de framework, mira su posición en el espectro "Runtime ↔ Compile-time", y los compromisos de cada uno en tamaño del paquete, rendimiento en ejecución y experiencia de desarrollo.

<FrameworkSpectrumDemo />

### 6.3 Tendencia de la industria

La dirección de desarrollo de los frameworks en los últimos años es clara: **trasladar cada vez más trabajo del runtime al compile-time**. Porque la computación en tiempo de compilación no consume los recursos del dispositivo del usuario ni afecta la velocidad de carga de la página.

- **Vue** está desarrollando Vapor Mode, que puede omitir el DOM virtual y generar código de operaciones DOM directamente en tiempo de compilación
- **React** ha lanzado React Compiler, que optimiza automáticamente el comportamiento de re-renderizado de componentes en tiempo de compilación
- **Svelte 5** ha introducido el sistema Runes, mejorando aún más la capacidad de análisis en tiempo de compilación

---

## 7. Resumen

Repasemos los puntos clave de este artículo:

**El problema fundamental que resuelven los frameworks frontend**: Cuando los datos de la aplicación cambian, actualizar la interfaz de forma automática, eficiente y fiable, sin que el desarrollador necesite operar el DOM manualmente.

**La idea central que comparten**: UI = f(State) — la interfaz es una función de los datos, el desarrollador solo se ocupa de cómo cambian los datos, y el framework se encarga de reflejar esos cambios en la interfaz.

**Sus diferencias técnicas clave**:

| Punto técnico | Significado |
| :--- | :--- |
| **Sistema reactivo** | Cómo detecta el framework los cambios de datos. Vue usa intercección Proxy, React usa setState explícito, Svelte usa análisis del compilador. |
| **DOM Virtual** | Vue y React usan un objeto JavaScript para simular el árbol DOM, encontrando la actualización mínima comparando árboles nuevo y antiguo (Diff), reduciendo las operaciones reales sobre el DOM. |
| **Componentización** | Dividir la interfaz en piezas pequeñas independientes y reutilizables, cada componente gestiona sus propios datos e interfaz. |
| **Optimización en tiempo de compilación** | Analizar y optimizar anticipadamente en la fase de construcción del código, reduciendo la computación en tiempo de ejecución. Svelte es el que ha llegado más lejos en este aspecto. |

**En una frase**: El trabajo esencial de los frameworks frontend es — asumir el proceso de sincronización de "datos a interfaz", para que los desarrolladores solo necesiten pensar en la lógica de datos y no tengan que operar la interfaz manualmente.

---

## Tabla de correspondencia de términos

| Término en inglés | Correspondencia en chino | Explicación |
| :--- | :--- | :--- |
| **Framework** | Marco de trabajo | Un conjunto de código y reglas preescritos, que proporciona a los desarrolladores la estructura base y funciones comunes de una aplicación. |
| **DOM** | Modelo de Objetos del Documento | Estructura de datos en árbol generada por el navegador al analizar HTML; JavaScript opera la página modificándola. |
| **Virtual DOM** | DOM Virtual | Simular el árbol DOM con objetos JavaScript, usar el algoritmo Diff para encontrar la ruta de actualización mínima, reduciendo las operaciones reales sobre el DOM. |
| **State** | Estado | Los datos de la aplicación, como información del usuario, contenido del carrito, estado actual de la página, etc. |
| **Reactivity** | Reactividad | Cuando los datos cambian, el sistema puede percibirlo automáticamente y ejecutar las operaciones de actualización de interfaz correspondientes. |
| **Proxy** | Proxy | Mecanismo integrado de JavaScript que permite interceptar operaciones de lectura y escritura sobre un objeto. Vue 3 lo usa para implementar la reactividad. |
| **Component** | Componente | Un fragmento de código de interfaz independiente y reutilizable, que contiene su propia estructura HTML, lógica JavaScript y estilos CSS. |
| **Declarative** | Declarativo | Una forma de programación: describes "qué resultado final quieres", el framework decide cómo implementarlo. |
| **Imperative** | Imperativo | Una forma de programación: dices paso a paso al programa "cómo hacerlo exactamente". |
| **Diff** | Comparación de diferencias | Comparar árboles DOM virtual nuevo y antiguo para averiguar qué nodos han cambiado. |
| **Patch** | Aplicar parche | Aplicar los cambios encontrados por Diff al DOM real. |
| **Compile-time** | Tiempo de compilación | El período en que el código se procesa en la fase de construcción, antes de que el usuario abra la página. |
| **Runtime** | Tiempo de ejecución | El período en que el código se ejecuta en el navegador del usuario. |
| **Compiler** | Compilador | Un programa que convierte código fuente en otra forma de código. El compilador de Svelte convierte archivos `.svelte` en JavaScript eficiente. |
