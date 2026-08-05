# Principios de renderizado del navegador
::: tip Pregunta central
**Por que algunas paginas web son fluidas como la seda y otras se traban como una presentacion de PowerPoint?** Como convierte el navegador un monton de codigo HTML, CSS y JavaScript en la pagina web que ves? Este capitulo te llevara al "taller" del navegador para comprender su flujo de trabajo y asi escribir paginas web con mejor rendimiento.
:::

**Que aprenderas en este articulo?**

| Capitulo | Contenido | Que podras hacer al terminar |
|-----|------|-----------|
| **Cap. 1** | Por que entender la tuberia de renderizado | Comprender la necesidad de la optimizacion del rendimiento |
| **Cap. 2** | Las cinco etapas de la tuberia de renderizado | Dominar el flujo basico del renderizado del navegador |
| **Cap. 3** | Construccion del arbol DOM y el arbol CSSOM | Entender como se analizan HTML y CSS |
| **Cap. 4** | Construccion del arbol de renderizado | Saber que elementos seran renderizados |
| **Cap. 5** | Diseno y reflow | Evitar activar calculos de diseno costosos |
| **Cap. 6** | Pintura y repaint | Reducir operaciones de pintura innecesarias |
| **Cap. 7** | Composicion y aceleracion GPU | Aprovechar la GPU para mejorar el rendimiento de animaciones |
| **Cap. 8** | Event Loop | Entender el mecanismo de ejecucion de JavaScript |
| **Cap. 9** | Optimizacion del rendimiento en la practica | Dominar tecnicas comunes de optimizacion |

Cada capitulo comienza con "entender los principios", no necesitas saber escribir codigo de optimizacion a mano. Cuando encuentres problemas de rendimiento, vuelve a consultar en cualquier momento.

---

## 1. Motivación de entender la "tuberia de renderizado"

### 1.1 De "que funcione" a "que sea rapido": el camino de evolucion del desarrollo frontend

Cuando empiezas a aprender frontend, solo te preocupa si el codigo "funciona": la pagina se muestra, los botones se pueden clicar, ya es un exito. Pero a medida que el proyecto crece y hay mas usuarios, pronto descubres una realidad cruel: **con la misma funcionalidad, las paginas de algunos son suaves como la seda, mientras que las de otros estan tan trabadas que los usuarios quieren tirar el raton**.

Es como aprender a conducir. El novato solo se preocupa por "si el auto puede moverse", pero el conductor experimentado se preocupa por "cuando cambiar de marcha, cuando frenar, como conducir de forma mas eficiente". El navegador es ese "auto" que conduces; entender sus "habitos de trabajo" te permite conducir rapido y estable.

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**Mentalidad de principiante (solo funcionalidad)**
- Con que la pagina se muestre esta bien
- La lentitud es problema del navegador
- La optimizacion del rendimiento se considera despues

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**Mentalidad avanzada (enfoque en experiencia)**
- La fluidez es el centro de la experiencia del usuario
- Entender el flujo de trabajo del navegador
- Considerar el rendimiento al escribir codigo

</div>
</div>

**Entender la tuberia de renderizado es el paso clave de "que funcione" a "que sea rapido".**

### 1.2 Caso: por que despues de "optimizar" la pagina era mas lenta

::: warning La historia de rendimiento de Xiao Zhang
Xiao Zhang es un ingeniero frontend en una empresa de comercio electronico, responsable de optimizar la pagina de detalles del producto. Esta pagina se trababa horriblemente al mostrar informacion del producto, y los usuarios se quejaban constantemente.

Xiao Zhang penso: "La pagina esta lenta probablemente porque hay demasiados elementos DOM. Primero ocultare todo con `display:none`, modificare y luego lo mostrare, asi el navegador no renderizara repetidamente, no?"

Asi que escribio este codigo:

```javascript
// Lo que creias que era una "optimizacion"
const container = document.getElementById('list')
container.style.display = 'none'  // Primero ocultar, no deberia disparar renderizado, no?

for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'  // Ancho aleatorio
  container.appendChild(item)
}

container.style.display = 'block'  // Finalmente mostrar, renderizar de una vez
```

Despues de probar, la pagina era **mas lenta**! Xiao Zhang estaba confundido: ya habia "optimizado", por que era mas lento?

Despues, el lider frontend reviso el codigo y senalo el problema: **aunque los elementos estaban ocultos, cada modificacion de `style.width` seguia activando el calculo de estilos y el marcado de diseno del navegador, que estaba haciendo una gran cantidad de trabajo inutil en segundo plano**.

La solucion correcta era usar `DocumentFragment` para operaciones masivas en memoria, y luego insertar todo en el DOM de una sola vez, activando solo un renderizado.
:::

::: info Leccion principal
Sin entender el flujo de trabajo del navegador, puedes escribir "codigo de optimizacion" que en realidad empeora el rendimiento. **Entender la tuberia de renderizado te permite saber que operaciones son costosas y cuales son economicas, evitando esforzarte en el lugar equivocado.**
:::

---

## 2. Concepto central: que es la "tuberia de renderizado"

::: tip Que es "renderizado"?
**Renderizado (Rendering)**, en terminos simples, es el proceso por el cual el navegador "dibuja" el codigo en la pagina web que ves.

Puedes imaginarlo como una **imprenta imprimiendo un libro**:
- **HTML** = contenido del manuscrito (texto, imagenes, capitulos)
- **CSS** = requisitos de composicion (tamano de fuente, color, espaciado)
- **JavaScript** = modificaciones dinamicas (el autor cambia el manuscrito, ajusta la composicion)

Cuando el navegador recibe estos "materiales", debe pasar por una serie de "procesos" antes de poder "imprimir" la pagina web que ves. Esta serie de procesos es la **tuberia de renderizado (Rendering Pipeline)**.
:::

Para ayudarte a entender mejor, usaremos una **panaderia** como metafora del proceso de renderizado del navegador.

### 2.1 Entender la tuberia de renderizado con la metafora de la panaderia

Imagina que administras una panaderia que cada dia debe producir diversos panes para los clientes. Los procesos involucrados son sorprendentemente similares al flujo de renderizado del navegador:

| Etapa | Metafora de panaderia | Trabajo real del navegador | Ejemplo concreto |
|------|-------------|--------------|----------|
| **1. Preparar ingredientes** | Organizar la lista de ingredientes (harina, huevos, crema...) | **Construir arbol DOM**: analizar HTML en una estructura de arbol | Escribes `<div><p>Hello</p></div>`, el navegador lo analiza en el arbol `div->p->"Hello"` |
| **2. Preparar recetas** | Organizar las tarjetas de recetas (proporciones de cada pan) | **Construir arbol CSSOM**: analizar CSS en un arbol de reglas | Escribes `.title { color: red }`, el navegador registra "el texto de `.title` es rojo" |
| **3. Hacer el plan** | Segun ingredientes y recetas, decidir que panes hacer hoy | **Construir arbol de renderizado**: combinar DOM y CSSOM, mantener solo elementos visibles | La etiqueta `<script>` no se muestra, por lo que no esta en el arbol de renderizado |
| **4. Colocar en posicion** | Colocar los panes en la vitrina, decidir donde va cada uno | **Diseno (Layout)**: calcular tamano y posicion de cada elemento | Calcular "este div tiene 200px de ancho, 100px de alto, en la posicion (50, 50) de la pantalla" |
| **5. Pintar y decorar** | Pintar los panes con horno, esparcir sesamo, agregar crema | **Pintura (Paint)**: "dibujar" el color, bordes, sombras, etc. de los elementos | Dibujar realmente el "texto rojo" en la pantalla |
| **6. Composicion final** | Superponer todos los panes y arreglarlos de forma bonita | **Composicion (Composite)**: combinar multiples capas en la imagen final | La GPU combina la capa de fondo, la capa de texto y la capa de imagenes en una imagen completa |

::: tip Que puedes ver en la tabla?
Analicemos cada fila de la tabla, entendiendo cada etapa de la tuberia de renderizado:

**Etapas 1-2 (preparacion)**: El navegador primero "entiende" tu codigo. HTML y CSS se analizan por separado porque tienen responsabilidades diferentes: HTML decide "que contenido hay", CSS decide "como se ve".

**Etapa 3 (combinacion)**: Por que "combinar"? Porque no todos los elementos HTML se muestran (como `<head>`, `<script>`), el navegador necesita combinar los "elementos visibles" y "sus estilos" para formar un "plano de construccion".

**Etapas 4-5 (dibujar)**: El diseno es "calcular posiciones", la pintura es "aplicar colores". Los cambios de diseno (como cambiar el ancho) provocan pintura, pero los cambios de pintura (como cambiar el color) no provocan diseno.

**Etapa 6 (composicion)**: La "magia" de los navegadores modernos. El metodo tradicional es "dibujar todo de una vez" (CPU lenta), el metodo moderno es "dibujar por capas + composicion GPU" (rapido), por eso las animaciones con `transform` son mas fluidas que las animaciones con `width`.
:::

### 2.2 Las cinco etapas de la tuberia de renderizado

<RenderingPipelineDemo />

---

## 3. Primera etapa: Construccion de los arboles DOM y CSSOM

### 3.1 Motivación de convertir a "arbol"

::: tip Que es el DOM?
**DOM (Document Object Model, Modelo de Objetos del Documento)**, es una estructura de arbol a la que el navegador convierte el documento HTML, para facilitar que JavaScript manipule los elementos de la pagina.

Puedes imaginarlo como un **arbol genealogico**:
- En la parte superior esta el "ancestro" (`<html>`)
- Debajo estan los "descendientes" (`<body>`, `<head>`)
- Mas abajo estan los "nietos" (`<div>`, `<p>`, `<span>`)

**Por que convertirlo a arbol?** Porque la estructura de arbol facilita la "busqueda" y "modificacion". Por ejemplo, si quieres encontrar "todos los elementos con class `title`", el navegador puede buscar rapidamente en el arbol en lugar de buscar lentamente en un monton de texto desordenado.
:::

Despues de recibir el HTML, el navegador no lo muestra inmediatamente, sino que primero debe "entenderlo". Este proceso se divide en tres pasos:

**Primer paso: Analisis lexico: dividir el codigo en "tokens"**

```html
<div class="container">
  <p>Hello World</p>
</div>
```

El navegador ve este codigo y primero lo "descompone en tokens":
- `<div>` -> "etiqueta de apertura div"
- `class="container"` -> "atributo class, valor container"
- `<p>` -> "etiqueta de apertura p"
- `Hello World` -> "contenido de texto"
- `</p>` -> "etiqueta de cierre p"
- `</div>` -> "etiqueta de cierre div"

**Segundo paso: Analisis sintactico: ensamblar los "tokens" en "nodos"**

El navegador, segun las reglas HTML, ensambla estos "tokens" en "nodos":
- Nodos de elemento: `<div>`, `<p>`
- Nodos de atributo: `class="container"`
- Nodos de texto: `"Hello World"`

**Tercer paso: Construccion del arbol: establecer "relaciones padre-hijo"**

Finalmente, el navegador, segun la relacion de anidamiento de las etiquetas, construye la estructura de arbol:

```
Document (nodo raiz del documento)
└── html
    └── body
        └── div.class = "container"
            └── p
                └── "Hello World"
```

### 3.2 Arbol CSSOM: el "manual de reglas" de estilos

::: tip Que es CSSOM?
**CSSOM (CSS Object Model, Modelo de Objetos CSS)**, es una estructura de arbol a la que el navegador convierte las reglas CSS, usada para calcular el estilo final de cada elemento.

Puedes imaginarlo como una **guia de combinacion de ropa**:
- Las reglas superiores (fuente del body) afectan a las inferiores (todos los elementos hijos)
- Si hay conflictos (por ejemplo, multiples reglas especifican colores diferentes para el mismo elemento), se decide cual usar segun la "prioridad"
- Finalmente se calcula que "ropa" debe llevar cada elemento
:::

El proceso de construccion del CSSOM es similar al del DOM, pero con una diferencia clave: **CSS es "heredado" y "en cascada"**.

::: details Ver proceso de construccion del CSSOM
**CSS original:**
```css
body {
  font-size: 16px;
  color: #333;
}

.container {
  width: 100%;
  color: red;  /* Sobrescribira el color de body */
}

.container p {
  font-weight: bold;
}
```

**Arbol CSSOM construido:**
```
StyleSheet
├── body
│   ├── font-size: 16px
│   └── color: #333
└── .container
    ├── width: 100%
    ├── color: red  (prioridad mas alta, sobrescribe el color de body)
    └── p
        └── font-weight: bold
```
:::

### 3.3 Caso: por que mi CSS "no funciona"

**Error 1: Conflicto de peso de selectores CSS**

::: details Ver errores comunes
```css
/* Tu CSS */
#header { color: red; }      /* selector id, peso 100 */
.title { color: blue; }     /* selector class, peso 10 */

/* HTML */
<div id="header" class="title">De que color es este texto?</div>
```

Creias que era azul, pero es **rojo**. Porque el peso del selector id (100) es mayor que el del selector class (10).
:::

**Error 2: Etiqueta HTML no cerrada, el navegador "repara automaticamente"**

::: details Ver como el navegador repara HTML erroneo
```html
<!-- Tu HTML -->
<div>
  <p>Este es un parrafo de texto
</div>

<!-- Despues de la reparacion del navegador -->
<div>
  <p>Este es un parrafo de texto</p>  <!-- El navegador cierra automaticamente la etiqueta -->
</div>
```

El navegador es muy "tolerante" y reparara automaticamente tus errores. Pero esta tolerancia tiene un costo: el navegador necesita calculos adicionales para adivinar tu intencion, **lo que afecta el rendimiento**.
:::

<DomToRenderTreeDemo />

---

## 4. Segunda etapa: Construccion del arbol de renderizado

### 4.1 Motivación de un "arbol de renderizado

Puedes preguntarte: **"Ya tenemos el arbol DOM y el arbol CSSOM, por que necesitamos construir otro arbol de renderizado? No podemos usar el DOM directamente?"**

La respuesta es: **El arbol DOM contiene demasiada informacion "inutil"**.

Por ejemplo, este HTML:

```html
<html>
<head>
  <title>Titulo de la pagina</title>
  <style>/* Codigo CSS */</style>
  <script>/* Codigo JavaScript */</script>
</head>
<body>
  <div class="container">
    <p>Contenido visible</p>
  </div>
  <div style="display: none">
    <p>Contenido oculto (display:none)</p>
  </div>
</body>
</html>
```

**El arbol DOM incluira todos los elementos**:
- `<head>`, `<title>`, `<style>`, `<script>` (estos no se muestran)
- El div con `display: none` (tampoco se muestra)

Pero el **arbol de renderizado solo incluye los elementos "que se dibujaran en la pantalla"**:
- Elimina `<head>` y sus elementos hijos
- Elimina el div con `display: none`

### 4.2 Reglas de construccion del arbol de renderizado

El navegador sigue un conjunto de reglas al construir el arbol de renderizado:

| Escenario | Forma de procesar | Ejemplo | Impacto en rendimiento |
|------|---------|------|----------|
| `display: none` | **Completamente excluido** del arbol de renderizado | El elemento y sus hijos no son visibles | Reduce la carga de renderizado |
| `visibility: hidden` | **Incluido en el arbol de renderizado**, pero no se dibuja | Oupa espacio, pero es completamente transparente | Aun requiere calculos de diseno |
| `opacity: 0` | **Incluido en el arbol de renderizado**, pero transparente | Interactuable (se puede clicar), pero invisible | Aun requiere calculos de diseno |
| Fuera del viewport | **Incluido en el arbol de renderizado**, no se dibuja temporalmente | Se dibuja al hacer scroll al viewport | Pero sigue en el arbol de renderizado |

::: tip Que puedes ver en la tabla?
**Hallazgo clave**: `display: none` es la unica forma de ocultacion que "realmente ahorra rendimiento", porque el elemento no esta en el arbol de renderizado y el navegador no hara ningun trabajo de diseno ni pintura para el.

Mientras que `visibility: hidden` y `opacity: 0`, aunque son "invisibles", siguen en el arbol de renderizado, y el navegador aun necesita calcular su diseno (ocupan espacio). Si necesitas "ocultar sin afectar el diseno" (por ejemplo, para animaciones de desvanecimiento), usa `opacity`; si necesitas "ocultar completamente sin ocupar espacio", usa `display: none`.
:::

### 4.3 Caso: por que despues de poner display:none, la pagina sigue lenta

::: danger Error comun: pensar que los elementos con display:none "no existen"
Mucha gente piensa que al poner `display: none`, el elemento "desaparece" y que cualquier operacion no afectara el rendimiento. Esto es **falso**!

Aunque los elementos con `display: none` no estan en el arbol de renderizado, cuando modificas sus propiedades mediante JavaScript, el navegador aun necesita:
1. **Recalcular estilos** (emparejar reglas CSS)
2. **Rastrear cambios** (prepararse para una futura visualizacion)

Mira este ejemplo de "optimizacion":
:::

::: details Ver codigo de "optimizacion ineficaz"
```javascript
// Lo que creias que era "optimizacion": ocultar primero, modificar y luego mostrar
const container = document.getElementById('list')
container.style.display = 'none'

// Operaciones masivas en el DOM
for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'  // Cambiar ancho!
  item.textContent = `Item ${i}`
  container.appendChild(item)
}

container.style.display = 'block'

// Problema: cada modificacion de style.width hace que el navegador recalcule estilos,
// incluso si el elemento tiene display:none!
```

**La postura correcta de optimizacion:**
```javascript
// Usar DocumentFragment para operaciones masivas
const container = document.getElementById('list')
const fragment = document.createDocumentFragment()  // Contenedor virtual

// Todas las operaciones se realizan en el fragment en memoria
for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'
  item.textContent = `Item ${i}`
  fragment.appendChild(item)  // No afecta el DOM real
}

// Insertar en el DOM real de una sola vez, activando solo un renderizado
container.appendChild(fragment)
```
:::

---

## 5. Tercera etapa: Diseno y reflow

### 5.1 Introducción a el "diseno"

::: tip Que es el diseno (Layout)?
**Diseno**, tambien llamado **reflujo (Reflow)**, es el proceso por el cual el navegador calcula "en que posicion y cuanto espacio ocupa" cada elemento en el arbol de renderizado.

Puedes imaginarlo como un **disenador de interiores midiendo habitaciones**:
- Primero mide el largo y ancho de cada habitacion
- Decide donde colocar los muebles
- Calcula las coordenadas de cada mueble

**Por que el diseno es "costoso"?** Porque el cambio de un elemento puede afectar a otros. Por ejemplo, si haces mas ancho un div, el div de al lado puede ser empujado hacia abajo, causando que toda la pagina se recalcule.
:::

### 5.2 Las "zonas peligrosas" que activan el reflow

Estas son las operaciones comunes que activan el reflow, **recomendamos guardar y memorizar**:

| Categoria | Propiedad/Operacion | Impacto en rendimiento | Alternativa |
|------|----------|----------|----------|
| **Dimensiones** | `width`, `height`, `min/max-width/height` | Alto | Usar `transform: scale()` en su lugar |
| **Posicion** | `top`, `right`, `bottom`, `left` | Alto | Usar `transform: translate()` en su lugar |
| **Margenes** | `margin`, `padding` | Medio | Usar `transform` o `gap` en su lugar |
| **Bordes** | `border-width` | Medio | Evitar modificaciones frecuentes |
| **Contenido** | Cambios en contenido de texto, carga de imagenes | Medio | Reservar espacio, evitar fluctuaciones de diseno |
| **Fuentes** | `font-size`, `line-height` | Alto | Evitar modificaciones frecuentes |
| **Visualizacion** | Cambio del valor de `display` | Alto | Usar `visibility` o `opacity` en su lugar |
| **Consultas** | `offsetWidth`, `offsetHeight`, etc. | Muy alto | **Lecturas en lote, evitar fluctuaciones de diseno** |

::: tip Que puedes ver en la tabla?
**Hallazgos clave**:
1. **Las propiedades geometricas (ancho, alto, posicion) son las mas costosas**: activan un calculo completo de diseno
2. **Las propiedades de consulta son mas peligrosas que las modificaciones**: leer `offsetWidth` fuerza un **diseno sincrono** (ver seccion 5.4)
3. **transform y opacity son las de mejor rendimiento**: no activan reflow, solo activan composicion
:::

### 5.3 Caso: por que mi animacion se traba como una presentacion

**Error: usar width para animaciones**

::: details Ver codigo de animacion con bajo rendimiento
```css
/* Animacion deficiente: activa reflow */
.box {
  width: 100px;
  transition: width 0.3s;
}

.box:hover {
  width: 200px;  /* Cambiar ancho activara reflow! */
}
```

Cada frame de la animacion activa un reflow, el navegador necesita:
1. Recalcular el ancho
2. Recalcular la posicion (puede afectar otros elementos)
3. Volver a dibujar

**Animacion correcta: usar transform**
```css
/* Animacion correcta: solo activa composicion */
.box {
  width: 100px;
  transform: scaleX(1);
  transition: transform 0.3s;
}

.box:hover {
  transform: scaleX(2);  /* Escalar no activa reflow! */
}
```

`transform` es procesado directamente por la GPU, no activa reflow ni repaint, la animacion es suave como la seda.
:::

### 5.4 El asesino del rendimiento: diseno sincrono forzado

::: danger El problema de rendimiento mas peligroso: fluctuacion de diseno
**Diseno sincrono forzado (Forced Synchronous Layout)**, tambien llamado **fluctuacion de diseno (Layout Thrashing)**, es el problema de rendimiento mas comun y mas grave.

La razon es: **Cuando JavaScript lee propiedades de diseno (como `offsetWidth`), el navegador debe ejecutar inmediatamente el calculo de diseno para devolver un valor preciso.**

Si "alternas lectura y escritura", el navegador entrara en un ciclo vicioso de "diseno -> lectura -> diseno -> lectura".
:::

::: details Ver codigo de fluctuacion de diseno
```javascript
// Muy malo: alternar lectura y escritura, causando fluctuacion de diseno
const elements = document.querySelectorAll('.item')

for (let i = 0; i < elements.length; i++) {
  const height = elements[i].offsetHeight  // Lectura -> fuerza diseno
  elements[i].style.width = (height * 2) + 'px'  // Escritura -> marca necesidad de reflow
  // La lectura del siguiente ciclo forzara el diseno de nuevo... ciclo vicioso!
}

// Si hay 100 elementos, se activaran 100 calculos de diseno!
```

**Postura correcta de optimizacion: separar lectura y escritura**
```javascript
const elements = document.querySelectorAll('.item')

// Paso 1: Lectura en lote (leer todo primero)
const heights = []
for (let i = 0; i < elements.length; i++) {
  heights.push(elements[i].offsetHeight)  // Solo activa un diseno
}

// Paso 2: Escritura en lote (escribir todo despues)
requestAnimationFrame(() => {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.width = (heights[i] * 2) + 'px'  // Solo activa un reflow
  }
})
```
:::

<LayoutReflowDemo />

---

## 6. Cuarta etapa: Pintura y repaint

### 6.1 Introducción a la "pintura"

::: tip Que es la pintura (Paint)?
**Pintura**, es el proceso por el cual el navegador "dibuja" realmente en la pantalla los elementos cuyo diseno ya ha sido calculado.

Puedes imaginarlo como **pintar una habitacion**:
- Etapa de diseno = medir, trazar lineas
- Etapa de pintura = pintar realmente, aplicar papel pintado

**La pintura no es tan costosa como el diseno, pero tampoco es barata.** Las pinturas frecuentes siguen afectando el rendimiento, especialmente con elementos complejos (sombras, gradientes, etc.).
:::

### 6.2 Senales que activan el repaint

A diferencia del reflow, el repaint solo involucra cambios de "apariencia", no cambios de "geometria":

| Categoria | Propiedad | Impacto en rendimiento | Nota |
|------|------|----------|------|
| **Color** | `color`, `background-color` | Bajo | El activador mas comun de repaint |
| **Fondo** | `background-image`, `background-position` | Medio | Las imagenes son mas lentas que los colores solidos |
| **Bordes** | `border-color`, `border-style` | Bajo | Cambiar color/estilo del borde |
| **Texto** | `text-decoration`, `text-shadow` | Medio | Las sombras son mas lentas que el texto plano |
| **Sombra de caja** | `box-shadow` | Alto | Las sombras complejas son lentas |
| **Bordes redondeados** | `border-radius` | Bajo | Cambiar tamano del redondeo |
| **Opacidad** | `opacity` | Excelente | **Especial: no activa repaint, solo activa composicion** |

::: tip Que puedes ver en la tabla?
**Hallazgo clave**: `opacity` es especial! Al igual que `transform`, no activa repaint, sino que activa directamente la etapa de composicion. Por eso las animaciones de desvanecimiento con `opacity` tienen el mejor rendimiento.

Ademas, **las sombras y gradientes son mas costosos que el repaint**, porque requieren calculos de pixeles complejos. Si tu pagina tiene muchos `box-shadow`, considera usar pseudo-elementos o imagenes en su lugar.
:::

### 6.3 Caso: por que mi efecto hover se traba

**Error: usar box-shadow para animacion hover**

::: details Ver efecto hover con bajo rendimiento
```css
/* Efecto hover deficiente: animacion de box-shadow es lenta */
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);  /* La sombra es lenta! */
}
```

`box-shadow` requiere calculo pixel por pixel, y la animacion sera trabada.

**Buenas practicas: usar transform o pseudo-elementos**
```css
/* Efecto hover correcto: usar transform */
.card {
  transform: translateY(0);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-4px);  /* Solo cambiar la sombra en hover, sin animacion */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
```
:::

<PaintLayerDemo />

---

## 7. Quinta etapa: Composicion y aceleracion GPU

### 7.1 Introducción a la "composicion"

::: tip Que es la composicion (Composite)?
**Composicion**, es la "magia" de los navegadores modernos, que divide diferentes partes de la pagina en multiples **capas (Layer)** y luego usa la **GPU (unidad de procesamiento grafico)** para componer la imagen final en paralelo.

Puedes imaginarlo como las **capas de Photoshop**:
- Metodo tradicional = todo dibujado en una capa (CPU en serie, lento)
- Metodo de composicion = dibujar por capas, luego combinar (GPU en paralelo, rapido)

**Por que la composicion es rapida?** Porque la GPU es experta en procesar tareas paralelas como la "composicion de imagenes", siendo decenas de veces mas rapida que la CPU.
:::

### 7.2 elementos se elevan a "capa de composicion"

El navegador eleva automaticamente ciertos elementos a una capa de composicion independiente. Estas son las condiciones de activacion comunes:

| Condicion de activacion | Propiedad/valor CSS | Impacto en rendimiento | Notas |
|---------|-----------|----------|----------|
| **Transformaciones 3D** | `transform: translate3d()`, `rotate3d()` | Excelente | Mejor rendimiento de animacion |
| **Hack de aceleracion por hardware** | `transform: translateZ(0)` | Bueno | Conocido como "forzar aceleracion GPU" |
| **Animacion de opacidad** | Cambios de `opacity` (con animacion) | Excelente | No activa repaint |
| **Posicion fija** | `position: fixed` | Bueno | Evita diseno repetido al hacer scroll |
| **Will-Change** | `will-change: transform, opacity` | Bueno | Crea la capa con anticipacion, cuidado con la memoria |
| **Canvas/WebGL** | `<canvas>`, contenido WebGL | Bueno | Naturalmente en una capa independiente |
| **Video** | `<video>` | Bueno | Capa independiente, previene interferencia |

::: tip Que puedes ver en la tabla?
**Hallazgo clave**: `transform` y `opacity` son las propiedades de animacion con mejor rendimiento, porque no activan reflow ni repaint, sino que activan directamente la composicion. Por eso las guias de optimizacion siempre dicen "usa transform y opacity para animaciones".

Pero ten cuidado: **cada capa de composicion consume memoria GPU**, abusar de `translateZ(0)` puede provocar una explosion de memoria (ver seccion 7.4).
:::

### 7.3 Caso: demasiadas capas de composicion hacen que la pagina sea mas lenta

::: danger La trampa de la sobre-optimizacion
Alguien escucho que "la aceleracion GPU es rapida" y agrego `transform: translateZ(0)` a todos los elementos, resultando en una pagina mas lenta.

**Razon del problema**:
Cada capa de composicion necesita almacenar una "textura" (mapa de bits) en la GPU, ocupando memoria. Si una pagina tiene 100 capas de composicion, la memoria GPU puede colapsar, causando que dispositivos de gama baja se bloqueen o degraden al renderizado por CPU.
:::

::: details Ver codigo de "sobre-optimizacion"
```css
/* Mal: agregar aceleracion GPU a todos los elementos */
.card { transform: translateZ(0); }
.button { transform: translateZ(0); }
.icon { transform: translateZ(0); }
/* ... 100 elementos con esto ... */

/* Resultado: explosion de memoria GPU, pagina congelada */
```

**Enfoque correcto: usar segun necesidad**
```css
/* Estrategia 1: Solo habilitar para elementos que realmente necesitan animacion */
.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);  /* Crea automaticamente una capa de composicion */
}

/* Estrategia 2: Usar will-change para avisar al navegador */
.card {
  will-change: transform;  /* Crear capa con anticipacion */
}

/* Estrategia 3: Eliminar despues de la animacion */
.card:not(:hover) {
  will-change: auto;  /* Liberar memoria GPU */
}
```
:::

<CompositeDemo />

---

## 8. Event Loop: la "capacidad de multiplicarse" de JavaScript

::: tip Que es el Event Loop?
**Event Loop (bucle de eventos)**, es el mecanismo por el cual JavaScript implementa la "asincronia". Como JavaScript es **single-thread** (solo puede hacer una cosa a la vez), pero necesita manejar multiples tareas como clics de usuario, solicitudes de red y temporizadores, necesita un "sistema de programacion" para gestionar estas tareas.

Puedes imaginarlo como un **centro de clasificacion de paqueteria**:
- **Call Stack (pila de llamadas)** = el paquete que se esta procesando actualmente
- **Web APIs** = almacenes de cooperacion externa (temporizadores, solicitudes de red, etc.)
- **Callback Queue (cola de callbacks)** = estante de paquetes pendientes
- **Event Loop (bucle de eventos)** = robot de clasificacion (que verifica constantemente "si se puede procesar la siguiente tarea")
:::

### 8.1 Macrotareas y microtareas

En los primeros tiempos, JavaScript solo tenia una cola de tareas. Pero a medida que la programacion asincrona se volvio mas compleja, el navegador introdujo dos tipos de tareas:

| Tipo | Fuentes comunes | Prioridad | Momento de ejecucion |
|------|---------|--------|----------|
| **Macrotarea** | `setTimeout`/`setInterval`, operaciones I/O, renderizado UI | Baja | Se ejecuta una por ciclo del Event Loop |
| **Microtarea** | `Promise.then`, `MutationObserver` | Alta | Despues de que termina la macrotarea actual, se vacian todas las microtareas inmediatamente |

**"Formula" del orden de ejecucion:**

```
1. Ejecutar la macrotarea actual (por ejemplo, todo el <script>)
2. Ejecutar todas las microtareas generadas durante el proceso (Promise.then, etc.)
   -> Las microtareas pueden generar nuevas microtareas, todas se vacian antes de continuar
3. Si es necesario, realizar renderizado UI (reflow/repaint)
4. Iniciar el siguiente ciclo del Event Loop, ejecutar la siguiente macrotarea
```

### 8.2 Caso: Promise es mas rapido que setTimeout

::: danger Error comun: setTimeout(fn, 0) se ejecuta "inmediatamente"
Mucha gente piensa que `setTimeout(fn, 0)` significa "ejecutar inmediatamente despues de 0 milisegundos". Esto es una comprension **incorrecta**.

En realidad, `setTimeout(fn, 0)` significa: **"esperar al menos 0 milisegundos antes de agregar el callback a la cola de macrotareas"**. Pero necesita esperar a que la pila de llamadas actual se vacie, que la cola de microtareas se vacie, y posiblemente que se complete el renderizado UI antes de poder ejecutarse.
:::

::: details Ver orden de ejecucion
```javascript
console.log('1. Start')

setTimeout(() => {
  console.log('2. setTimeout callback')
}, 0)

Promise.resolve().then(() => {
  console.log('3. Promise.then')
})

console.log('4. End')

// Orden de salida que creias:
// 1. Start
// 4. End
// 2. setTimeout callback  <- setTimeout(0) no es inmediato?
// 3. Promise.then

// Orden de salida real:
// 1. Start
// 4. End
// 3. Promise.then         <- Promise.then se ejecuta antes que setTimeout!
// 2. setTimeout callback
```

**Diagrama del flujo de ejecucion:**
```
Pila de llamadas (Call Stack)          Cola de macrotareas                    Cola de microtareas
                                        [setTimeout callback]                   [Promise.then callback]

1. console.log('1. Start')
   -> Salida: 1. Start

2. setTimeout(fn, 0)
   -> Agregar callback a la cola de macrotareas      <- [setTimeout callback]

3. Promise.resolve().then()
   -> Agregar callback a la cola de microtareas                                  <- [Promise.then callback]

4. console.log('4. End')
   -> Salida: 4. End

5. Pila de llamadas vacia, revisar cola de microtareas
   -> Encontrar callback de Promise.then
   -> Ejecutar: console.log('3. Promise.then')
   -> Salida: 3. Promise.then

6. Cola de microtareas vacia
   -> Posiblemente renderizado UI (si hay cambios)

7. Revisar cola de macrotareas
   -> Encontrar callback de setTimeout
   -> Ejecutar: console.log('2. setTimeout callback')
   -> Salida: 2. setTimeout callback
```
:::

::: tip Leccion principal
**Las microtareas son "mas urgentes" que las macrotareas**. Si deseas que una operacion se ejecute lo antes posible "despues de que termine el bloque de codigo actual, pero antes de la actualizacion UI", usa `Promise.then` o `queueMicrotask`.

`setTimeout(0)` no garantiza ejecucion inmediata; se retrasara al menos hasta que la pila de llamadas actual y la cola de microtareas esten vacias.
:::

<JSEventLoopDemo />

<MacroMicroTaskDemo />

---

## 9. Optimizacion del rendimiento en la practica: haz que tu pagina web "vuele"

Despues de entender el flujo de trabajo de la tuberia de renderizado, veamos como optimizar. Estas son las cinco tecnicas de optimizacion mas practicas.

### 9.1 Regla de oro: evitar el diseno sincrono forzado

**Problema**: alternar lectura y escritura de propiedades de diseno, causando fluctuacion de diseno.

::: details Ver comparacion antes y despues de la optimizacion
```javascript
// Muy malo: alternar lectura y escritura, causando fluctuacion de diseno
for (let i = 0; i < elements.length; i++) {
  const height = elements[i].offsetHeight  // Lectura -> fuerza diseno
  elements[i].style.height = (height * 2) + 'px'  // Escritura -> marca necesidad de reflow
  // La lectura del siguiente ciclo forzara el diseno de nuevo... ciclo vicioso!
}

// Excelente: leer todo primero, luego escribir todo
// Paso 1: Lectura en lote
const heights = []
for (let i = 0; i < elements.length; i++) {
  heights.push(elements[i].offsetHeight)
}

// Paso 2: Escritura en lote
requestAnimationFrame(() => {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.height = (heights[i] * 2) + 'px'
  }
})
```
:::

### 9.2 Usar transform y opacity para animaciones

**Problema**: usar `width`, `height`, `left`, `top` para animaciones activa reflow.

::: details Ver comparacion antes y despues de la optimizacion
```css
/* Animacion deficiente: activa reflow */
.box {
  transition: width 0.3s, left 0.3s;
}
.box.moving {
  width: 200px;
  left: 100px;
}

/* Animacion correcta: solo activa composicion */
.box {
  transition: transform 0.3s;
}
.box.moving {
  transform: translateX(100px) scaleX(2);
}
```
:::

### 9.3 Scroll virtual: resolver listas con grandes volumenes de datos

**Problema**: cuando la lista tiene miles de elementos, la cantidad excesiva de nodos DOM causa problemas de rendimiento.

**Concepto central**: renderizar solo los elementos visibles en el viewport (con un pequeno buffer), la cantidad de nodos DOM es fija e independiente del volumen total de datos.

<RenderingPerformanceDemo />

::: details Ver implementacion de scroll virtual
```vue
<template>
  <div class="virtual-list" @scroll="handleScroll">
    <!-- Elemento de relleno, para mantener la barra de scroll -->
    <div class="phantom" :style="{ height: totalHeight + 'px' }"></div>

    <!-- Elementos de la lista realmente renderizados -->
    <div class="content" :style="{ transform: `translateY(${offsetY}px)` }">
      <div
        v-for="item in visibleItems"
        :key="item.id"
        class="item"
        :style="{ height: itemHeight + 'px' }"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  items: Array,
  itemHeight: { type: Number, default: 50 }
})

const scrollTop = ref(0)
const buffer = 5  // Cantidad de buffer

// Cuantos elementos se pueden mostrar en el area visible
const visibleCount = computed(() => 10)

// Indice de inicio
const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - buffer)
)

// Indice de fin
const endIndex = computed(() =>
  Math.min(props.items.length, startIndex.value + visibleCount.value + buffer * 2)
)

// Datos actualmente visibles
const visibleItems = computed(() =>
  props.items.slice(startIndex.value, endIndex.value)
)

// Altura total
const totalHeight = computed(() => props.items.length * props.itemHeight)

// Desplazamiento
const offsetY = computed(() => startIndex.value * props.itemHeight)

const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop
}
</script>
```
:::

### 9.4 Debounce y throttle: reducir la frecuencia de activacion de eventos

**Problema**: eventos que se activan con frecuencia (como scroll, resize) causan problemas de rendimiento.

::: details Ver implementacion de debounce y throttle
```javascript
// Debounce: ejecucion retrasada, si se activa de nuevo durante el retraso, se reinicia el temporizador
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Throttle: ejecucion en intervalos fijos
function throttle(fn, interval) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

// Ejemplo de uso
window.addEventListener('scroll', debounce(handleScroll, 200))
window.addEventListener('resize', throttle(handleResize, 100))
```
:::

### 9.5 Carga diferida (Lazy Loading): retrasar la carga de recursos no criticos

**Problema**: demasiados recursos cargados en la primera pantalla hacen que la pagina se abra lentamente.

::: details Ver implementacion de carga diferida
```javascript
// Carga diferida de imagenes
const lazyImages = document.querySelectorAll('img[data-src]')

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src  // Cargar la imagen real
      img.removeAttribute('data-src')
      observer.unobserve(img)  // Dejar de observar
    }
  })
})

lazyImages.forEach(img => imageObserver.observe(img))
```
:::

---

## 10. Problemas de rendimiento que ahora deberias poder identificar

Despues de entender la tuberia de renderizado del navegador, deberias poder identificar los siguientes problemas de rendimiento comunes:

| Codigo problematico | Cual es el problema | Como describirselo a la IA |
|---------|---------|-------------|
| `element.style.width = ...` | Modificar el ancho frecuentemente en un bucle | "Esto activara multiples reflows, usa transform o procesamiento en lote" |
| `height = element.offsetHeight` | Leer propiedades de diseno inmediatamente despues de escribir | "Esto es un diseno sincrono forzado, separa las operaciones de lectura y escritura" |
| `element.className = ...` | Modificar class frecuentemente activando recalculo de estilos | "Usa classList.add/remove para reducir el calculo de estilos" |
| Animaciones usando `width`/`left` | Activa reflow y repaint, bajo rendimiento | "Usa transform y opacity para animaciones" |
| Agregar `translateZ(0)` a todos los elementos | Abuso de aceleracion GPU causando explosion de memoria | "Solo habilita aceleracion GPU para elementos que necesitan animacion" |
| 10,000 elementos de lista renderizados | Demasiados nodos DOM causan lentitud | "Implementa scroll virtual, renderiza solo el area visible" |
| Operaciones directas en el DOM dentro del evento scroll | Frecuencia de activacion demasiado alta causando lentitud | "Usa requestAnimationFrame o throttle para optimizar" |
| Animacion hover con `box-shadow` | Calculo de sombras complejas es lento | "Usa transform o pseudo-elementos, evita animar sombras" |

**Si leiste cuidadosamente los "registros de errores" de cada capitulo, tambien dominaste estos conceptos centrales:**

- **Cinco etapas de la tuberia de renderizado**: DOM/CSSOM -> Arbol de renderizado -> Diseno -> Pintura -> Composicion
- **Reflow vs Repaint**: Reflow es el mas costoso (cambios geometricos), Repaint le sigue (cambios de apariencia)
- **Diseno sincrono forzado**: Alternar lectura y escritura causa fluctuacion de diseno, deben separarse
- **Aceleracion GPU**: transform y opacity son procesados por la GPU, con el mejor rendimiento
- **Event Loop**: JavaScript es single-thread, implementa asincronia a traves de colas de tareas

Estos conceptos te ayudaran a localizar rapidamente los cuellos de botella de rendimiento.

::: info Cuando encuentres problemas de rendimiento, dile esto a la IA
- "La animacion se traba, revisa si se esta activando reflow o repaint"
- "El rendimiento del scroll es malo, puede que necesite throttle o requestAnimationFrame"
- "La lista con grandes volumenes de datos se traba, necesito scroll virtual"
- "La modificacion frecuente de estilos causa problemas de rendimiento, optimiza con transform"
:::

---

## 11. Resumen: la esencia de la optimizacion de la tuberia de renderizado

A traves del aprendizaje de este articulo, podemos llegar a las siguientes conclusiones centrales:

**Desde la practica**: no se trata de optimizar mas, sino de optimizar mas "precisamente". Entender la tuberia de renderizado del navegador te permite saber donde esforzarte y donde soltar.

**Desde la perspectiva de costos**:
- La mayor parte del desperdicio de rendimiento proviene de la **alternancia frecuente de lectura y escritura** de propiedades de diseno, que debe resolverse separando lectura y escritura y procesando en lote
- Los efectos de animacion complejos que activan reflow y repaint suelen derivarse del uso de "propiedades incorrectas", que deben resolverse con `transform` y `opacity`
- Para el renderizado de listas con grandes volumenes de datos, simplemente confiar en el DOM virtual ya no es suficiente; debe combinarse con tecnologias como el **scroll virtual**

**El objetivo es: en las condiciones dadas del navegador y el hardware, hacer que cada paso de renderizado tenga un beneficio de rendimiento claro.**

---

## 12. Tabla de terminologia

| Termino en ingles | Traduccion al espanol | Explicacion |
| :--- | :--- | :--- |
| **DOM** | Modelo de Objetos del Documento | Estructura de arbol formada despues de que el navegador analiza el documento HTML; JavaScript puede manipular los elementos de la pagina a traves de la API DOM |
| **CSSOM** | Modelo de Objetos CSS | Estructura de arbol formada despues de que el navegador analiza CSS; se combina con el DOM para calcular los estilos finales |
| **Render Tree** | Arbol de renderizado | Formado por la combinacion del arbol DOM y el arbol CSSOM; solo contiene nodos visibles, usado para los calculos de diseno y pintura posteriores |
| **Layout** | Diseno | Proceso de calculo de la informacion geometrica (posicion, tamano) de cada nodo en el arbol de renderizado; tambien llamado Reflow |
| **Reflow** | Reflujo / Rediseno | Cuando cambian las propiedades geometricas (tamano, posicion, etc.) de un elemento, el navegador necesita recalcular el diseno |
| **Paint** | Pintura | Proceso de dibujar en la pantalla los estilos de los elementos (color, fondo, bordes, etc.) despues del calculo de diseno |
| **Repaint** | Repintado | Cuando cambian las propiedades de apariencia de un elemento (como color, fondo) sin afectar las propiedades geometricas, se activa una actualizacion de pintura |
| **Composite** | Composicion | Proceso de combinar multiples capas pintadas (Layer) en la imagen final de la pantalla, generalmente ejecutado en la GPU |
| **Layer** | Capa / Capa de composicion | Superficie de dibujo independiente creada por el navegador para optimizar el renderizado; puede transformarse y componerse individualmente |
| **Event Loop** | Bucle de eventos | Mecanismo de ejecucion asincrona de JavaScript; responsable de programar la ejecucion de macrotareas y microtareas |
| **Call Stack** | Pila de llamadas | Estructura de datos que registra las funciones de JavaScript que se estan ejecutando actualmente |
| **Macro Task** | Macrotarea | Tipo de tarea con menor prioridad en el Event Loop, como setTimeout, setInterval, operaciones I/O, etc. |
| **Micro Task** | Microtarea | Tipo de tarea con mayor prioridad en el Event Loop, como Promise.then, MutationObserver, etc. |
| **Forced Synchronous Layout** | Diseno sincrono forzado | Problema de rendimiento causado por alternar lectura y escritura de propiedades de diseno en JavaScript, forzando al navegador a ejecutar inmediatamente el calculo de diseno |
| **Layout Thrashing** | Fluctuacion de diseno | Degradacion drastica del rendimiento causada por disenos sincronos forzados frecuentes |
| **Virtual Scrolling** | Scroll virtual | Tecnica que renderiza solo los elementos visibles en el viewport, usada para optimizar el rendimiento de listas con grandes volumenes de datos |
| **RAF** | Request Animation Frame | API proporcionada por el navegador para ejecutar codigo JavaScript relacionado con animaciones antes del siguiente repaint |
