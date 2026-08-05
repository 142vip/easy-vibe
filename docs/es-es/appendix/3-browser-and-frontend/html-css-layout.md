# Fundamentos de maquetación HTML/CSS
::: tip 🎯 Pregunta central
**¿Cómo se crean las páginas web? ¿Por qué algunas solo tienen texto y otras funcionan como aplicaciones interactivas?** Esta pregunta nos lleva a los tres pilares del desarrollo web, permitiéndote entender la estructura detrás de cada página web.
:::

---

## 1. Introducción a HTML, CSS y JavaScript

### 1.1 De páginas web estáticas a aplicaciones dinámicas

Imagina un **póster** que ves en la calle. Solo puedes mirarlo, no puedes interactuar — el póster no cambiará su contenido porque lo mires, ni mostrará más información porque hagas clic en alguna parte.

Las primeras páginas web eran así, como "pósters electrónicos": solo se podían ver, no modificar, con contenido fijo.

Pero las páginas web modernas son completamente diferentes. Funcionan como **aplicaciones de escritorio**:

- Puedes hacer clic, arrastrar, escribir, subir archivos
- La página cambia en tiempo real según tus acciones
- Pueden realizar tareas complejas como un software (por ejemplo, edición de video en línea)

**La razón principal de esta transformación son los tres pilares de la tecnología web: HTML + CSS + JavaScript**.

### 1.2 Una analogía: construir una casa

| Tecnología      | 🏠 Analogía de la casa               | Función real                    | Ejemplo concreto                                  |
| --------------- | ------------------------------------ | ------------------------------- | ------------------------------------------------- |
| **HTML**        | **Estructura y materiales** de la casa | Define el contenido y la jerarquía de la página | Esto es una pared, esto es una ventana, esto es una habitación |
| **CSS**         | **Decoración y apariencia** de la casa | Controla el estilo y la maquetación | Pared pintada de azul, ventana al este, suelo de baldosas |
| **JavaScript**  | **Sistema eléctrico e inteligente** de la casa | Aporta interactividad y lógica | Pulsar el interruptor enciende la luz, abrir la puerta despliega las cortinas |

::: tip 💡 La relación entre los tres

**HTML → CSS**: Primero se construye la casa, luego se decora. HTML es la base, CSS es el embellecimiento.

**HTML + CSS → JavaScript**: Primero la casa y la decoración, luego se instala el sistema inteligente. JavaScript hace que una página "muerta" cobre "vida".

**Idea central**: Cada uno tiene su función, todos son indispensables. Una página solo con HTML es fea, una página solo con HTML+CSS no puede interactuar, solo con los tres completos se puede crear una "aplicación web" como la versión web de WeChat o Taobao.
:::

### 1.3 Pruébalo tú mismo

👇 La siguiente demostración muestra cómo colaboran HTML/CSS/JavaScript:

<WebTechTriad />

---

## 2. HTML: el esqueleto de la página web

### 2.1 Motivación de HTML

Antes de que existiera HTML, el contenido en Internet era solo **texto plano**. Como el texto que estás leyendo ahora, sin formato, sin jerarquía, sin enlaces.

¿Cuál es el problema del texto plano?

- ❌ **No puede expresar jerarquía**: no se distingue qué es un título, qué es el cuerpo, qué es una nota
- ❌ **Las máquinas no lo entienden**: los motores de búsqueda y los lectores de pantalla (para personas ciegas) no pueden comprender el contenido
- ❌ **No hay interacción**: sin enlaces, sin botones, sin campos de entrada

**HTML (HyperText Markup Language)** nació para resolver este problema. Utiliza "etiquetas" (tags) para marcar el significado del contenido, permitiendo que el navegador sepa "qué es esto".

### 2.2 Qué aspecto tiene el código HTML

La unidad básica de HTML es la "etiqueta" (tag). Las etiquetas se envuelven con corchetes angulares `< >` y aparecen en pares:

```html
<h1>Esto es un título</h1>
<p>Esto es un párrafo</p>
<a href="url">Esto es un enlace</a>
```

**Conceptos clave**:

| Concepto | Explicación | Ejemplo |
|----------|-------------|---------|
| **Etiqueta** | Marca envuelta en corchetes angulares | `<h1>`, `</h1>` |
| **Elemento** | Etiqueta + contenido completo | `<h1>Título</h1>` |
| **Atributo** | Información adicional en la etiqueta | `href="url"`, `class="card"` |
| **Anidamiento** | Etiqueta dentro de otra etiqueta | `<div><p>Texto</p></div>` |

### 2.3 Enfoque de entender el código HTML

::: tip 🎯 Lectura obligatoria para principiantes: método para leer código

Muchos principiantes se marea al ver un montón de `<xxx>`. En realidad, leer código HTML tiene un **método fijo**:

**Paso 1: Encuentra la "capa más externa"**

```html
<div class="card">        ← Esto es un contenedor, contiene el contenido
  <h2>Título</h2>
  <p>Texto descriptivo</p>
</div>
```

**Paso 2: Mira el nombre de la etiqueta y adivina su significado**

| Etiqueta | Para recordar | Qué contiene |
|----------|---------------|--------------|
| `<div>` | Caja grande | Cualquier contenido, para agrupar |
| `<span>` | Caja pequeña | Fragmentos de texto, para marcar |
| `<p>` | Párrafo | Un bloque de texto |
| `<h1>`-`<h6>` | Título | Texto de título, cuanto menor el número, más importante |
| `<a>` | Ancla/enlace | Contenido cliqueable que redirige |
| `<img>` | Imagen | No contiene contenido, usa src para apuntar a la imagen |
| `<button>` | Botón | Texto/icono cliqueable |
| `<input>` | Campo de entrada | No contiene contenido, lugar donde el usuario ingresa datos |

**Paso 3: Mira class e id**

```html
<div class="user-card" id="user-123">
```

- `class="user-card"` → El "tipo" de este elemento, CSS puede seleccionarlo en lote
- `id="user-123"` → El "DNI" de este elemento, identificador único

**Paso 4: La indentación indica jerarquía**

```html
<body>
  <header>           ← La indentación indica que header es hijo de body
    <nav>            ← nav es hijo de header
      <a>Inicio</a>  ← a es hijo de nav
    </nav>
  </header>
</body>
```
:::

### 2.4 Referencia rápida de etiquetas HTML comunes

**Etiquetas estructurales** (definen el esqueleto de la página):

```html
<h1>Esto es un título de nivel 1</h1>
<h2>Esto es un título de nivel 2</h2>
<p>Esto es un párrafo</p>
<div>Esto es un contenedor (para agrupar)</div>
<span>Esto es un contenedor en línea (para marcar texto)</span>
```

**Enlaces y multimedia** (enriquecen la página):

```html
<a href="https://example.com">Haz clic aquí para ir</a>
<img src="photo.jpg" alt="Descripción de la foto" />
<video src="movie.mp4" controls></video>
```

**Formularios** (recopilan entrada del usuario):

```html
<form>
  <input type="text" placeholder="Ingresa tu usuario" />
  <input type="password" placeholder="Ingresa tu contraseña" />
  <button type="submit">Iniciar sesión</button>
</form>
```

**Etiquetas semánticas** (añadidas en HTML5, hacen el significado de la página más claro):

```html
<header>Cabecera de la página</header>
<nav>Barra de navegación</nav>
<main>Área de contenido principal</main>
<article>Un artículo</article>
<aside>Barra lateral</aside>
<footer>Pie de página</footer>
```

::: tip 💡 ¿Por qué usar etiquetas semánticas?

`<div class="header">` y `<header>` parecen tener el mismo efecto, ¿por qué usar el segundo?

1. **SEO amigable**: los motores de búsqueda entienden mejor la estructura de la página
2. **Accesibilidad**: los lectores de pantalla pueden localizar rápidamente áreas como "navegación" o "contenido principal"
3. **Legibilidad del código**: al ver `<header>` sabes de inmediato que es la cabecera

**¿Cuándo usar div?** Cuando no hay una etiqueta semántica adecuada. Por ejemplo, un contenedor puramente decorativo.
:::

### 2.5 Enfoque de recordar tantas etiquetas HTML

::: tip 🎯 Duda de principiantes

"Hay más de cien etiquetas HTML, ¿cómo se pueden memorizar?"

**La respuesta es: no necesitas memorizarlas todas.** En el desarrollo real, el 90% de los casos solo usan unas 20 etiquetas.
:::

#### Memorización por categorías de uso

**1. Estructura de página (dibujar el esqueleto)**

| Etiqueta | Nemotecnia | Uso |
|----------|------------|-----|
| `<header>` | Cabeza | Cabecera de la página o sección |
| `<nav>` | Navegación | Área de enlaces de navegación |
| `<main>` | Principal | Contenido principal de la página (solo uno por página) |
| `<article>` | Artículo | Bloque de contenido independiente (tiene sentido por sí solo) |
| `<section>` | Sección | Agrupación de contenido con un tema |
| `<aside>` | Al lado | Barra lateral, contenido complementario |
| `<footer>` | Pie | Pie de página o sección |

**Método de memorización**: Imagina un periódico — tiene cabecera (header), índice (nav), contenido principal (main/article), columna (aside), pie (footer).

**2. Marcado de contenido (decir qué es cada cosa)**

| Etiqueta | Nemotecnia | Uso |
|----------|------------|-----|
| `<h1>`-`<h6>` | Título 1-6 | Jerarquía de títulos, h1 es el más grande e importante |
| `<p>` | Párrafo | Un bloque de texto |
| `<ul>`/`<ol>`/`<li>` | Lista desordenada/ordenada/elemento | Listas |
| `<a>` | Ancla | Enlace, para navegar |
| `<img>` | Imagen | Imagen |
| `<video>`/`<audio>` | Video/Audio | Multimedia |
| `<strong>`/`<em>` | Énfasis/énfasis cursivo | Énfasis semántico |

**Método de memorización**: `<a>` es la abreviatura de anchor (ancla), imagina un barco anclado en un lugar, un enlace te "ancla" a otra página.

**3. Formularios e interacción (recopilar entrada del usuario)**

| Etiqueta | Nemotecnia | Uso |
|----------|------------|-----|
| `<form>` | Formulario | Contenedor de formulario |
| `<input>` | Entrada | Varios tipos de campos de entrada (el tipo lo determina el atributo type) |
| `<textarea>` | Área de texto | Entrada de texto multilínea |
| `<select>`/`<option>` | Seleccionar/Opción | Selección desplegable |
| `<button>` | Botón | Botón |
| `<label>` | Etiqueta | Texto descriptivo del campo de entrada |

**Método de memorización**: El atributo `type` de `<input>` determina su apariencia:
- `type="text"` → Campo de texto
- `type="password"` → Campo de contraseña
- `type="email"` → Campo de correo electrónico
- `type="checkbox"` → Casilla de verificación
- `type="radio"` → Botón de opción

**4. Contenedores (para agrupar)**

| Etiqueta | Nemotecnia | Uso |
|----------|------------|-----|
| `<div>` | Caja grande | Contenedor de bloque, ocupa toda una línea |
| `<span>` | Caja pequeña | Contenedor en línea, solo ocupa el ancho del contenido |

**Método de memorización**: div = division (división), span = span (tramo). div se usa para dividir áreas grandes, span para marcar fragmentos de texto.

#### ¿Qué hacer cuando encuentras una etiqueta que no conoces?

**Método 1: Adivina la palabra en inglés**

Muchas etiquetas son abreviaturas de palabras en inglés:
- `<abbr>` = abbreviation (abreviatura)
- `<blockquote>` = block quote (cita en bloque)
- `<caption>` = caption (título/descripción)
- `<figcaption>` = figure caption (descripción de figura)

**Método 2: Consulta MDN**

[Referencia de elementos HTML de MDN](https://developer.mozilla.org/es/docs/Web/HTML/Element) tiene explicaciones detalladas de todas las etiquetas.

**Método 3: Pregunta a la IA**

> "¿Qué significa la etiqueta `<dl>` en HTML? ¿Cuándo se usa?"

#### No memorices las etiquetas a propósito

**El flujo de trabajo real es así**:

1. Sabes que necesitas un "contenedor" → escribes `<div>`
2. Luego descubres que es una "zona de navegación" → lo cambias a `<nav>`
3. Luego descubres que es un "artículo independiente" → lo cambias a `<article>`

**Primero escribe, luego optimiza la semántica**. Las etiquetas se pueden cambiar en cualquier momento, no te obsesiones al principio con cuál usar.

---

## 3. CSS: la piel de la página web

### 3.1 Motivación de CSS

Imagina que te mudas a una **casa en obra gris**: tiene paredes, ventanas, puertas, se puede vivir, pero:

- Las paredes son de cemento gris, no es bonito
- Los enchufes e interruptores están puestos al azar, no es estético
- No hay muebles, la vida es incómoda

Una página web solo con HTML es así: tiene contenido, tiene estructura, pero es **fea**, **desordenada** y **poco amigable**.

CSS (Cascading Style Sheets) es el "equipo de decoración" de la página web. No cambia la estructura HTML (no tira paredes, no cambia puertas), solo se encarga de:

- 🎨 **Pintar paredes**: cambiar colores, fondos
- 🖼️ **Colgar cuadros**: añadir bordes, sombras, esquinas redondeadas
- 🪑 **Colocar muebles**: ajustar maquetación, espaciado, alineación

### 3.2 Qué aspecto tiene el código CSS

El código CSS tiene un formato fijo:

```css
selector {
  propiedad: valor;
  propiedad: valor;
}
```

**Tres formas de escribirlo**:

```html
<!-- Forma 1: Estilo en línea (para pruebas temporales) -->
<div style="color: red;">Texto rojo</div>

<!-- Forma 2: Estilo interno (escrito en el archivo HTML) -->
<style>
  .red-text { color: red; }
</style>

<!-- Forma 3: Estilo externo (archivo CSS independiente, recomendado) -->
<link rel="stylesheet" href="styles.css" />
```

### 3.3 Enfoque de entender el código CSS

::: tip 🎯 Lectura obligatoria para principiantes: método para leer CSS

**Paso 1: Mira el selector — "¿a quién se decora?"**

| Selector | Escritura | Significado |
|----------|-----------|-------------|
| Selector de etiqueta | `p { }` | Todas las etiquetas `<p>` |
| Selector de clase | `.card { }` | Todos los elementos con `class="card"` |
| Selector de ID | `#header { }` | El único elemento con `id="header"` |
| Selector descendiente | `.card h2 { }` | Todos los `<h2>` dentro de `.card` |
| Selector combinado | `.card, .box { }` | Selecciona tanto `.card` como `.box` |

**Paso 2: Mira la propiedad — "¿qué se decora?"**

| Categoría de propiedad | Propiedades comunes | Función |
|------------------------|---------------------|---------|
| Texto | `color`, `font-size`, `font-weight` | Color, tamaño, grosor |
| Fondo | `background`, `background-color` | Color de fondo, imagen de fondo |
| Borde | `border`, `border-radius` | Línea de borde, esquinas redondeadas |
| Espaciado | `margin`, `padding` | Margen exterior, margen interior |
| Maquetación | `display`, `flex`, `grid` | Modo de disposición |

**Paso 3: Mira el valor — "¿cómo se decora?"**

```css
.card {
  width: 300px;        /* Ancho fijo */
  padding: 16px;       /* Relleno interior de 16 píxeles */
  border-radius: 8px;  /* Esquinas redondeadas de 8 píxeles */
  background: #fff;    /* Fondo blanco */
}
```

**Unidades comunes**:
- `px`: píxeles, tamaño fijo
- `%`: porcentaje, relativo al elemento padre
- `rem`: relativo al tamaño de fuente del elemento raíz
- `vw/vh`: relativo al ancho/alto del viewport
:::

### 3.4 Prioridad de selectores

Si un elemento es seleccionado por varios selectores a la vez, ¿quién manda?

```html
<p class="highlight" id="special">¿De qué color es este texto?</p>
```

```css
p { color: red; }             /* Prioridad: 1 */
.highlight { color: yellow; } /* Prioridad: 10 */
#special { color: blue; }     /* Prioridad: 100 */
```

**Respuesta**: Azul. El selector de ID tiene la prioridad más alta, luego el de clase, y el de etiqueta la más baja.

**El estilo en línea** (escrito en el atributo style) tiene prioridad 1000, ¡la más alta!

### 3.5 El modelo de caja: Motivación de coincide el ancho

::: tip 🎯 Escenario real

Estás haciendo una página web y necesitas que tres tarjetas se muestren una al lado de la otra, cada una de 300px de ancho, con un contenedor de 900px de ancho total. Escribiste:

```css
.card { width: 300px; }
```

Resultado: **¡la tercera tarjeta se cae a la siguiente línea!**

**¿Por qué?** Porque `width: 300px` es solo el ancho del contenido, olvidaste contar el padding y el border. Si la tarjeta tiene `padding: 20px` y `border: 1px`, el ancho real es 342px, ¡tres tarjetas suman 1026px, excediendo el contenedor!
:::

Cada elemento HTML en CSS se considera una "caja" compuesta por cuatro capas. Imagina que estás **empaquetando un envío**: el contenido es el producto, el padding es el plástico de burbujas, el border es la caja de cartón, y el margin es el espacio entre cajas.

👇 **Pruébalo tú mismo**: arrastra los controles deslizantes para ajustar el tamaño de cada capa y observa cómo cambia el modelo de caja:

<CssBoxModel />

**Solución**:

```css
.box {
  box-sizing: border-box;  /* Haz que width incluya padding y border */
  width: 200px;
  padding: 10px;
  border: 5px;
}
```

Así, `width: 200px` es el ancho final, y el padding y border se "comprimen" dentro.

### 3.6 Flexbox: Enfoque de elementos se alineen automáticamente

Flexbox es la forma de maquetación más utilizada en CSS moderno. Permite que los elementos se alineen automáticamente, como los libros en una estantería que se alinean solos.

👇 **Pruébalo tú mismo**: cambia la dirección, la alineación y observa cómo se organizan las cajas:

<CssFlexbox />

**Conceptos principales de Flex**:

| Propiedad | Función | Valores comunes |
|-----------|---------|-----------------|
| `display: flex` | Activar maquetación Flex | - |
| `flex-direction` | Dirección del eje principal | `row` (horizontal), `column` (vertical) |
| `justify-content` | Alineación en el eje principal | `flex-start`, `center`, `space-between` |
| `align-items` | Alineación en el eje transversal | `stretch`, `center`, `flex-start` |
| `flex-wrap` | Si se permite salto de línea | `nowrap`, `wrap` |
| `gap` | Espacio entre elementos | `10px`, `1rem` |

### 3.7 Preprocesadores CSS: SCSS/SASS y LESS

::: tip 🎯 Escenario real

Escribiste un proyecto con un archivo CSS de 2000 líneas. Luego necesitas cambiar el color del tema y descubres:

- El color principal `#3b82f6` aparece 50 veces
- Cambiar un color requiere buscar y reemplazar globalmente, con riesgo de omitir alguno
- Los selectores como `.nav .nav-list .nav-item .nav-link` son largos y difíciles de mantener

**Los preprocesadores CSS** existen para resolver estos problemas. Permiten que CSS también "programe": con variables, anidamiento y reutilización de código.
:::

#### 3.7.1 ¿Qué es un preprocesador CSS?

**Explicado en lenguaje sencillo**: Un preprocesador es un "CSS más inteligente". Escribes estilos con una sintaxis más potente, y luego él los **compila** a CSS normal que el navegador puede reconocer.

**¿Por qué usarlo?**

| Problema | CSS nativo | Preprocesador |
|----------|------------|---------------|
| Colores repetidos | Copiar y pegar por todas partes | Definir variable, un cambio se aplica globalmente |
| Selectores con mucha profundidad | Escribir una cadena larga | Sintaxis de anidamiento, jerarquía clara de un vistazo |
| Estilos iguales repetidos | Copiar y pegar | Mixins, reutilización como funciones |

#### 3.7.2 Comparación de los tres principales preprocesadores

| Característica | CSS nativo | **SCSS/SASS** | **LESS** |
|----------------|------------|---------------|----------|
| **Escritura de variables** | `--primary` | `$primary` | `@primary` |
| **Sintaxis de anidamiento** | ❌ No soportado | ✅ Soportado | ✅ Soportado |
| **Mixins (reutilizar código)** | ❌ No soportado | ✅ `@mixin` | ✅ `.mixin()` |
| **Dificultad de aprendizaje** | Simple | Media | Media |
| **Popularidad** | - | ⭐⭐⭐ La más popular | ⭐⭐ Bastante popular |

**Memorización simple**:
- **SCSS**: usa el símbolo `$`, lo usa Bootstrap 5, mejor ecosistema
- **LESS**: usa el símbolo `@`, consistente con `@media` de CSS, fácil de empezar

#### 3.7.3 Ejemplos comparativos de funciones principales

##### 1. Variables: un cambio, efecto global

**Escenario**: El color del tema `#3b82f6` se usa en 20 lugares y hay que cambiarlo a rojo.

<Tabs>
<TabItem label="CSS nativo">

```css
/* Hay que cambiar 20 lugares, fácil olvidar alguno */
.button { background: #3b82f6; }
.link { color: #3b82f6; }
.border { border-color: #3b82f6; }
```

</TabItem>
<TabItem label="SCSS">

```scss
$primary: #3b82f6;

.button { background: $primary; }
.link { color: $primary; }
.border { border-color: $primary; }
/* Cambiar $primary una sola vez es suficiente */
```

</TabItem>
<TabItem label="LESS">

```less
@primary: #3b82f6;

.button { background: @primary; }
.link { color: @primary; }
.border { border-color: @primary; }
/* Cambiar @primary una sola vez es suficiente */
```

</TabItem>
</Tabs>

##### 2. Anidamiento: jerarquía clara de un vistazo

**Escenario**: La barra de navegación tiene múltiples niveles de estructura.

<Tabs>
<TabItem label="CSS nativo">

```css
/* Escrito como una cadena larga, difícil ver la jerarquía */
.navbar .nav-list .nav-item .nav-link { }
.navbar .nav-list .nav-item .nav-link:hover { }
```

</TabItem>
<TabItem label="SCSS">

```scss
.navbar {
  .nav-list {
    .nav-item {
      .nav-link {
        &:hover { }  /* & representa el selector padre */
      }
    }
  }
}
```

</TabItem>
<TabItem label="LESS">

```less
.navbar {
  .nav-list {
    .nav-item {
      .nav-link {
        &:hover { }
      }
    }
  }
}
```

</TabItem>
</Tabs>

##### 3. Mixins: reutilizar fragmentos de código

**Escenario**: Varios botones necesitan el estilo de "centrado".

<Tabs>
<TabItem label="CSS nativo">

```css
/* Copiar y pegar 3 veces */
.btn-primary {
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-secondary {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

</TabItem>
<TabItem label="SCSS">

```scss
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-primary { @include center; }
.btn-secondary { @include center; }
```

</TabItem>
<TabItem label="LESS">

```less
.center() {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-primary { .center(); }
.btn-secondary { .center(); }
```

</TabItem>
</Tabs>

#### 3.7.4 ¿Cómo elegir?

| Situación | Recomendación |
|-----------|---------------|
| Estás empezando, proyecto pequeño | **CSS nativo** (primero domina las bases) |
| El proyecto usa Bootstrap 5 | **SCSS** (el código fuente de Bootstrap es SCSS) |
| El equipo está familiarizado con el símbolo `@` | **LESS** (consistente con `@media` de CSS) |
| Necesitas lógica compleja (bucles, condicionales) | **SCSS** (funcionalidad más potente) |

#### 3.7.5 Uso en proyectos

**Proyecto Vite (el más simple)**:

```bash
# Instalar sass
npm install -D sass

# Usar directamente archivos .scss o .less
```

::: tip 💡 Consejos para principiantes

1. **Primero aprende bien CSS nativo**: los preprocesadores son solo "azúcar sintáctico", sin entender CSS base solo te liarás más
2. **No fuerces su uso en proyectos pequeños**: si el CSS no llega a 200 líneas, escribirlo directamente es más simple
3. **Empieza con SCSS**: la sintaxis es casi igual a CSS, solo añade variables con `$`
4. **No anides demasiado**: más de 3 niveles dificulta el mantenimiento del código
:::

#### 3.7.6 Comparación de organización de archivos según el stack tecnológico

**El mismo proyecto, con diferentes stacks tecnológicos, ¿cómo cambia la estructura de archivos?**

<Tabs>
<TabItem label="HTML + CSS nativo">

```
my-website/
├── index.html              # Estructura de la página
├── about.html
├── css/
│   ├── reset.css           # Estilos de reinicio
│   ├── layout.css          # Estilos de maquetación
│   ├── components.css      # Estilos de componentes
│   └── style.css           # Estilo principal (puede tener miles de líneas)
├── js/
│   └── main.js
└── images/
    └── logo.png
```

**Características**:
- CSS concentrado en uno o varios archivos
- Cambiar estilos requiere alternar entre archivos HTML y CSS
- Los estilos pueden entrar en conflicto fácilmente

</TabItem>
<TabItem label="Vue + CSS nativo">

```
src/
├── components/             # Carpeta de componentes
│   ├── Button/
│   │   ├── Button.vue      # Plantilla + estilos + lógica
│   │   └── Button.test.js
│   ├── Header/
│   │   └── Header.vue
│   └── Footer/
│       └── Footer.vue
├── views/                  # Carpeta de páginas
│   ├── Home.vue
│   └── About.vue
├── App.vue                 # Componente raíz
└── main.js                 # Archivo de entrada
```

**Estructura interna de Button.vue**:
```vue
<template>
  <button class="btn">Haz clic</button>
</template>

<script>
export default { name: 'Button' }
</script>

<style scoped>              <!-- scoped: los estilos solo afectan a este componente -->
.btn { background: #3b82f6; }
</style>
```

</TabItem>
<TabItem label="Vue + SCSS">

```
src/
├── assets/
│   └── styles/
│       ├── _variables.scss     # Variables: colores, espaciado, etc.
│       ├── _mixins.scss        # Mixins: bloques de código reutilizables
│       ├── _functions.scss     # Funciones: cálculos de color, etc.
│       └── global.scss         # Punto de entrada de estilos globales
├── components/
│   ├── Button/
│   │   └── Button.vue          # En el componente se importan variables con @import
│   └── Card/
│       └── Card.vue
├── views/
│   ├── Home.vue
│   └── About.vue
├── App.vue
└── main.js
```

**_variables.scss**:
```scss
$primary: #3b82f6;
$secondary: #64748b;
$spacing-sm: 8px;
$spacing-md: 16px;
```

**Button.vue**:
```vue
<style scoped lang="scss">
@import '@/assets/styles/variables';

.btn {
  background: $primary;      // Usar variable
  padding: $spacing-md;
}
</style>
```

</TabItem>
<TabItem label="Vue + Tailwind CSS">

```
src/
├── components/
│   ├── Button.vue          # No necesita bloque style
│   ├── Card.vue
│   └── Header.vue
├── views/
│   ├── Home.vue
│   └── About.vue
├── App.vue
└── main.js

# Archivos de configuración (directorio raíz)
tailwind.config.js          # Configuración del tema
tailwind.css                # Punto de entrada de estilos base
```

**Button.vue** (sin bloque style):
```vue
<template>
  <button class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
    Haz clic
  </button>
</template>
```

**Características**:
- No hay archivos de estilo separados
- Las clases son los estilos (`bg-blue-500` = fondo azul)
- La configuración se concentra en `tailwind.config.js`

</TabItem>
</Tabs>

**Resumen de diferencias principales**:

| Stack tecnológico | Ubicación de archivos de estilo | Gestión de temas | Reutilización de código |
|-------------------|--------------------------------|------------------|--------------------------|
| HTML+CSS nativo | Centralizada en carpeta `css/` | Buscar y reemplazar | Copiar y pegar |
| Vue + CSS | Distribuida en componentes `.vue` | Buscar y reemplazar | Copiar y pegar |
| Vue + SCSS | En componentes + archivos comunes `styles/` | Gestión unificada con variables | Reutilización con mixins |
| Vue + Tailwind | Ninguna (en nombres de clase) | `tailwind.config.js` | Combinación de clases |

### 3.8 Enfoque de recordar tantas propiedades CSS

::: tip 🎯 Duda de principiantes

"Hay cientos de propiedades CSS, ¿cómo se pueden memorizar?"

**La respuesta es: clasifícalas por uso, memoriza las propiedades principales, para el resto consulta cuando las necesites.**
:::

#### Memorización por categorías de uso

**1. Tipografía (cómo se ve el texto)**

| Propiedad | Nemotecnia | Valores comunes |
|-----------|------------|-----------------|
| `color` | Color | `red`, `#fff`, `rgb(0,0,0)` |
| `font-size` | Tamaño de fuente | `16px`, `1rem`, `1.5em` |
| `font-weight` | Grosor de fuente | `normal`, `bold`, `100`-`900` |
| `font-family` | Familia de fuente | `"Microsoft YaHei"`, `sans-serif` |
| `line-height` | Altura de línea | `1.5`, `24px` |
| `text-align` | Alineación de texto | `left`, `center`, `right` |
| `text-decoration` | Decoración de texto | `none`, `underline`, `line-through` |

**Método de memorización**: Imagina que estás formateando texto en Word — cambiar color, cambiar tamaño, negrita, cambiar fuente, ajustar interlineado, alinear, añadir subrayado.

**2. Modelo de caja (cuánto espacio ocupa un elemento)**

| Propiedad | Nemotecnia | Valores comunes |
|-----------|------------|-----------------|
| `width`/`height` | Ancho/Alto | `100px`, `50%`, `100vw` |
| `padding` | Relleno interior | `10px`, `10px 20px` |
| `margin` | Margen exterior | `10px`, `auto` (para centrar) |
| `border` | Borde | `1px solid #ccc` |
| `border-radius` | Radio de borde | `4px`, `50%` (círculo) |
| `box-sizing` | Modelo de caja | `border-box` (recomendado) |

**Método de memorización**: padding es el margen "interior" (distancia del contenido al borde), margin es el margen "exterior" (distancia del borde a otros elementos).

**Reglas de abreviación**:
```css
/* Cuatro valores: arriba derecha abajo izquierda (sentido horario) */
padding: 10px 20px 15px 25px;

/* Dos valores: arriba-abajo izquierda-derecha */
padding: 10px 20px;

/* Un valor: las cuatro direcciones iguales */
padding: 10px;
```

**3. Fondos y bordes (aspecto del elemento)**

| Propiedad | Nemotecnia | Valores comunes |
|-----------|------------|-----------------|
| `background` | Fondo | `#fff`, `url(bg.jpg)`, `linear-gradient(...)` |
| `background-color` | Color de fondo | `#fff`, `rgba(0,0,0,0.5)` |
| `background-image` | Imagen de fondo | `url(photo.jpg)` |
| `background-size` | Tamaño de fondo | `cover`, `contain`, `100%` |
| `background-position` | Posición de fondo | `center`, `top left` |
| `box-shadow` | Sombra de caja | `0 2px 10px rgba(0,0,0,0.1)` |
| `opacity` | Opacidad | `0`-`1` (0 completamente transparente) |

**Método de memorización**: `background` es una abreviatura, permite establecer múltiples valores a la vez:
```css
background: #fff url(bg.jpg) no-repeat center/cover;
/*          color   imagen    sin repetición posición/tamaño */
```

**4. Maquetación (cómo se organizan los elementos)**

| Propiedad | Nemotecnia | Valores comunes |
|-----------|------------|-----------------|
| `display` | Modo de visualización | `block`, `inline`, `flex`, `grid`, `none` |
| `position` | Posicionamiento | `static`, `relative`, `absolute`, `fixed`, `sticky` |
| `top`/`right`/`bottom`/`left` | Cuatro direcciones | `10px`, `50%` (usar con position) |
| `z-index` | Nivel de capa | Cuanto mayor el número, más arriba |
| `float` | Flotante | `left`, `right` (método antiguo, no recomendado) |
| `overflow` | Manejo de desbordamiento | `visible`, `hidden`, `scroll`, `auto` |

**Método de memorización de position**:
- `static`: predeterminado, flujo normal
- `relative`: desplazado respecto a su posición original
- `absolute`: posicionado respecto al ancestro posicionado más cercano
- `fixed`: posicionado respecto al viewport (no se mueve al hacer scroll)
- `sticky`: se fija al llegar a cierta posición durante el scroll

**5. Maquetación Flexbox (herramienta mágica de maquetación unidimensional)**

| Propiedad | Nemotecnia | Función |
|-----------|------------|---------|
| `display: flex` | Activar Flex | El contenedor se convierte en contenedor Flex |
| `flex-direction` | Dirección | `row` (horizontal), `column` (vertical) |
| `justify-content` | Alineación en eje principal | Cómo se distribuyen los elementos en el eje principal |
| `align-items` | Alineación en eje transversal | Cómo se alinean los elementos en el eje transversal |
| `flex-wrap` | Salto de línea | `nowrap`, `wrap` |
| `gap` | Espacio | Espacio entre elementos |
| `flex` | Flexibilidad | Proporción de estiramiento del elemento hijo |

**Método de memorización**:
- `justify` = justificar/alinear → alineación en eje principal
- `align` = alinear → alineación en eje transversal

**6. Animaciones y transiciones (cómo se mueven los elementos)**

| Propiedad | Nemotecnia | Valores comunes |
|-----------|------------|-----------------|
| `transition` | Transición | `all 0.3s ease` |
| `transform` | Transformación | `translate(10px)`, `rotate(45deg)`, `scale(1.1)` |
| `animation` | Animación | `fadeIn 1s ease forwards` |

**Reglas de abreviación**:
```css
/* transition: propiedad duración función-de-aceleración retardo */
transition: all 0.3s ease 0s;

/* transform puede combinar múltiples transformaciones */
transform: translateX(10px) rotate(45deg) scale(1.1);
```

#### ¿Qué hacer cuando encuentras una propiedad que no conoces?

**Método 1: Adivina la palabra en inglés**

Muchas propiedades son palabras en inglés o abreviaturas:
- `margin` = margen
- `padding` = relleno
- `border` = borde
- `visibility` = visibilidad
- `cursor` = cursor

**Método 2: Asociación por escenario**

Cuando quieras lograr cierto efecto, piensa en "palabras clave":

| Quiero... | Posibles propiedades |
|-----------|---------------------|
| Cambiar color | `color`, `background-color`, `border-color` |
| Cambiar tamaño | `width`, `height`, `font-size` |
| Cambiar posición | `margin`, `position`, `top/left` |
| Cambiar espaciado | `padding`, `margin`, `gap` |
| Ocultar elemento | `display: none`, `visibility: hidden`, `opacity: 0` |
| Centrar | `margin: auto`, `text-align: center`, `justify-content: center` |
| Añadir esquinas redondeadas | `border-radius` |
| Añadir sombra | `box-shadow`, `text-shadow` |
| Añadir animación | `transition`, `animation` |

**Método 3: Consulta MDN o pregunta a la IA**

[Referencia de propiedades CSS de MDN](https://developer.mozilla.org/es/docs/Web/CSS/Reference) tiene explicaciones detalladas de todas las propiedades.

> "¿Cómo hacer que el texto se muestre en una sola línea y el exceso se muestre con puntos suspensivos en CSS?"

**Método 4: "Aprender robando" con las herramientas de desarrollo**

Cuando veas un efecto que te guste en una página web:
1. Clic derecho → "Inspeccionar"
2. Selecciona el elemento, mira el panel Styles
3. Copia directamente las propiedades CSS

#### No memorices las propiedades a propósito

**El flujo de trabajo real es así**:

1. Sabes que quieres "centrar" → buscas "CSS centrar"
2. Copias el código, ajustas los valores
3. Con la práctica lo memorizas

**Ruta de aprendizaje recomendada**:

1. **Primero domina el modelo de caja**: `width`, `height`, `padding`, `margin`, `border`
2. **Luego domina Flexbox**: `display: flex`, `justify-content`, `align-items`
3. **Después domina el posicionamiento**: `position`, `top/left`, `z-index`
4. **Por último aprende animaciones**: `transition`, `transform`, `animation`

Para otras propiedades, consulta cuando las necesites, con la práctica las memorizarás naturalmente.

---

## 4. JavaScript: el cerebro de la página web

### 4.1 Motivación de JavaScript

Una página web solo con HTML + CSS es como un **maniquí en un escaparate**:

- ✅ Se ve bonito (CSS)
- ✅ La estructura es clara (HTML)
- ❌ Pero si le hablas, no responde
- ❌ Si pulsas un botón, no pasa nada

**JavaScript** convierte la página web de "maniquí" a "persona real":

- ✅ Al hacer clic en un botón, aparece un aviso
- ✅ Al escribir texto, se verifica el formato en tiempo real
- ✅ Al hacer scroll, se carga más contenido
- ✅ Al enviar un formulario, se muestra "Enviando..."

### 4.2 Qué aspecto tiene el código JavaScript

**Capacidad 1: Recordar datos** (variables)

```javascript
let userName = 'Zhang San'
let isLoggedIn = true
let cartCount = 5
```

**Capacidad 2: Realizar tareas repetitivas** (funciones)

```javascript
function sayHello(name) {
  return 'Hola, ' + name + '!'
}

console.log(sayHello('Zhang San'))  // Salida: Hola, Zhang San!
```

**Capacidad 3: Responder a eventos** (escucha de eventos)

```javascript
button.addEventListener('click', function() {
  alert('¡Se ha hecho clic en el botón!')
})
```

**Capacidad 4: Modificar la página** (manipulación del DOM)

```javascript
document.getElementById('title').textContent = 'Nuevo título'
document.getElementById('box').style.background = 'red'
```

### 4.3 Enfoque de entender el código JavaScript

::: tip 🎯 Lectura obligatoria para principiantes: método para leer código JS

**Paso 1: Busca variables — "¿qué se ha recordado?"**

```javascript
const API_URL = 'https://api.example.com'  // Constante, no cambia
let count = 0                                // Variable, puede cambiar
const user = { name: 'Zhang San', age: 25 }  // Objeto, múltiples datos
const items = ['Manzana', 'Plátano', 'Naranja'] // Array, lista de datos
```

**Paso 2: Busca funciones — "¿qué se puede hacer?"**

```javascript
// El nombre de la función suele indicar su propósito
function handleClick() { }      // Manejar clic
function fetchData() { }        // Obtener datos
function validateForm() { }     // Validar formulario
```

**Paso 3: Busca eventos — "¿cuándo se activa?"**

```javascript
button.addEventListener('click', handleClick)     // Al hacer clic
input.addEventListener('input', validateForm)     // Al escribir
window.addEventListener('scroll', loadMore)       // Al hacer scroll
```

**Paso 4: Busca manipulación del DOM — "¿qué se ha modificado?"**

```javascript
element.textContent = 'Nuevo contenido'     // Cambiar texto
element.classList.add('active')             // Añadir clase de estilo
element.style.display = 'none'              // Ocultar elemento
parent.appendChild(child)                   // Añadir elemento
```
:::

### 4.4 DOM: Enfoque de manipula JavaScript la página

Cuando el navegador lee el código HTML, no lo trata como un montón de cadenas de texto, sino que dibuja un "árbol" en la memoria:

```
Document (documento)
    ↓
<html>
    ├─<head>
    │   └─<title>Mi página web</title>
    └─<body>
        ├─<h1>Bienvenido</h1>
        └─<div class="card">
            ├─<img src="photo.jpg">
            └─<p>Un texto</p>
```

Este árbol se llama **árbol DOM**. Cada etiqueta HTML es un "nodo" en este árbol.

**¿Cómo encontrar nodos?**

```javascript
// Por ID (el más rápido, único)
const element = document.getElementById('header')

// Por selector (el más usado)
const element = document.querySelector('.card h2')    // Encontrar el primero
const elements = document.querySelectorAll('button')  // Encontrar todos

// Por relación
element.parentNode           // Encontrar nodo padre
element.children             // Encontrar nodos hijos
element.nextElementSibling   // Encontrar el siguiente hermano
```

**Advertencia de rendimiento**: Manipular el DOM es muy **costoso**. Cada vez que modificas el DOM, el navegador debe recalcular la maquetación y redibujar.

```javascript
// ❌ Ineficiente: bucle 1000 veces, cada vez manipula el DOM
for (let i = 0; i < 1000; i++) {
  document.body.appendChild(createDiv())
}

// ✅ Eficiente: primero ensamblar, insertar de una vez
const fragment = document.createDocumentFragment()
for (let i = 0; i < 1000; i++) {
  fragment.appendChild(createDiv())
}
document.body.appendChild(fragment)
```

Precisamente por esto nacieron frameworks modernos como **Vue / React**: juegan con un "DOM virtual" en memoria, calculan la modificación mínima y solo al final tocan el DOM real.

👇 **Pruébalo tú mismo**: métodos básicos de manipulación del DOM:

<DomManipulator />

### 4.5 ECMAScript: la evolución de versiones de JavaScript

**ECMAScript** es el "manual de estándares" de JavaScript. Los fabricantes de navegadores implementan los motores de JavaScript siguiendo este estándar.

#### ¿Por qué existen números de versión?

JavaScript no es estático. Cada año se añaden nuevas funciones y se corrigen problemas. El número de versión te dice "qué funciones soporta este navegador".

#### Resumen de versiones importantes

| Versión | Año | Características principales | Qué problema resuelve |
|---------|-----|----------------------------|----------------------|
| **ES5** | 2009 | Modo estricto, `forEach`/`map`/`filter` | Estandarizar el lenguaje, añadir métodos de array |
| **ES6/ES2015** | 2015 | `let/const`, funciones flecha, `class`, `Promise`, módulos | La mayor actualización, punto de partida del JS moderno |
| **ES2016** | 2016 | `includes()`, `**` exponenciación | Actualización menor |
| **ES2017** | 2017 | `async/await`, `Object.entries()` | Código asíncrono más legible |
| **ES2018** | 2018 | Operador spread `...`, `Promise.finally()` | Mejoras en objetos y asincronía |
| **ES2020** | 2020 | Encadenamiento opcional `?.`, coalescencia nula `??`, `BigInt` | Acceso seguro a propiedades anidadas |
| **ES2021** | 2021 | `replaceAll()`, asignación lógica `??=` | Mejoras en cadenas y asignación |
| **ES2022** | 2022 | `await` en nivel superior, `.at()` | Carga asíncrona de módulos más conveniente |

#### Sintaxis nueva más usada de ES6+

**1. `let` y `const` en lugar de `var`**

```javascript
// ❌ Forma antigua: var tiene elevación (hoisting), propenso a bugs
var name = 'Zhang San'
if (true) {
  var name = 'Li Si'  // Sobrescribe el name externo
}
console.log(name)  // 'Li Si', no es el resultado esperado

// ✅ Forma nueva: let tiene ámbito de bloque
let name = 'Zhang San'
if (true) {
  let name = 'Li Si'  // Solo válido dentro de este if
}
console.log(name)  // 'Zhang San', coincide con lo esperado

// ✅ const: no se puede reasignar después de declarar
const PI = 3.14159
PI = 3  // ¡Error! Previene modificaciones accidentales
```

**2. Funciones flecha: escritura de funciones más concisa**

```javascript
// ❌ Forma antigua
const add = function(a, b) {
  return a + b
}

// ✅ Forma nueva
const add = (a, b) => a + b

// El this de las funciones flecha se vincula al ámbito externo
const obj = {
  name: 'Zhang San',
  // ❌ Función normal: this apunta al invocador
  oldWay: function() {
    setTimeout(function() {
      console.log(this.name)  // undefined
    }, 100)
  },
  // ✅ Función flecha: this hereda de obj
  newWay: function() {
    setTimeout(() => {
      console.log(this.name)  // 'Zhang San'
    }, 100)
  }
}
```

**3. Desestructuración: extraer datos de objetos/arrays**

```javascript
// Desestructuración de objetos
const user = { name: 'Zhang San', age: 25, city: 'Beijing' }
const { name, age } = user  // Extracción directa
console.log(name)  // 'Zhang San'

// Desestructuración de arrays
const colors = ['red', 'green', 'blue']
const [first, second] = colors
console.log(first)  // 'red'

// Desestructuración en parámetros de función
function greet({ name, age }) {
  console.log(`${name} tiene ${age} años`)
}
greet(user)  // 'Zhang San tiene 25 años'
```

**4. Plantillas de cadena: concatenación sin dolor**

```javascript
// ❌ Forma antigua: montón de comillas y signos más
const msg = 'El usuario ' + name + ' tiene ' + age + ' años'

// ✅ Forma nueva: backticks + ${}
const msg = `El usuario ${name} tiene ${age} años`

// También soporta múltiples líneas
const html = `
  <div class="card">
    <h2>${name}</h2>
    <p>Edad: ${age}</p>
  </div>
`
```

**5. `async/await`: código asíncrono que se lee como síncrono**

```javascript
// ❌ Callback hell (infierno de callbacks)
fetchUser(function(user) {
  fetchOrders(user.id, function(orders) {
    fetchDetails(orders[0].id, function(details) {
      console.log(details)
    })
  })
})

// ✅ async/await
async function getUserData() {
  const user = await fetchUser()
  const orders = await fetchOrders(user.id)
  const details = await fetchDetails(orders[0].id)
  console.log(details)
}
```

**6. Encadenamiento opcional `?.` y coalescencia nula `??`**

```javascript
const user = {
  name: 'Zhang San',
  address: {
    city: 'Beijing'
  }
}

// ❌ Forma antigua: comprobaciones anidadas
const street = user && user.address && user.address.street
const streetName = street !== undefined ? street : 'Desconocido'

// ✅ Forma nueva: encadenamiento opcional + coalescencia nula
const streetName = user?.address?.street ?? 'Desconocido'
```

::: tip 💡 ¿Cómo saber qué características soporta un navegador?

1. **Consulta tablas de compatibilidad**: [caniuse.com](https://caniuse.com/) introduce el nombre de la característica
2. **Usa herramientas de compilación**: Babel puede convertir la sintaxis nueva a código soportado por navegadores antiguos
3. **Mira tu público objetivo**: si solo necesitas soportar navegadores modernos, la mayoría de características ES6+ se pueden usar directamente
:::

### 4.6 TypeScript: añadir restricciones de tipo a JavaScript

#### ¿Por qué necesitamos TypeScript?

**Escenario 1: Tipos de parámetros de función inciertos**

```javascript
// JavaScript
function calculateTotal(price, quantity) {
  return price * quantity
}

calculateTotal(100, 5)      // 500 ✅
calculateTotal('100', 5)    // '1005' ❌ Concatenación de cadena, no multiplicación
calculateTotal(100, '5')    // 500 ✅ Pero es por suerte
```

JavaScript no te avisa si el tipo del parámetro es incorrecto, solo lo descubres en tiempo de ejecución.

**Escenario 2: Error de ortografía en propiedades de objeto**

```javascript
// JavaScript
const user = {
  name: 'Zhang San',
  age: 25
}

console.log(user.nmae)  // undefined, error de ortografía pero no se notifica
```

**TypeScript resuelve estos problemas**:

```typescript
// TypeScript
interface User {
  name: string
  age: number
}

function greet(user: User) {
  console.log(`Hola, ${user.name}`)
  console.log(user.nmae)  // ❌ Error en compilación: la propiedad 'nmae' no existe
}

greet({ name: 'Zhang San', age: 25 })        // ✅
greet({ name: 'Zhang San', age: '25' })      // ❌ Error en compilación: age debe ser number
greet({ name: 'Zhang San' })                 // ❌ Error en compilación: falta age
```

#### Conceptos principales de TypeScript

**1. Tipos básicos**

```typescript
let name: string = 'Zhang San'
let age: number = 25
let isActive: boolean = true
let anyValue: any = 'Puede ser cualquier tipo'  // No recomendado, pierde el sentido de la comprobación de tipos
```

**2. Interfaces (Interface): definir estructura de objetos**

```typescript
interface Product {
  id: number
  name: string
  price: number
  discount?: number  // Propiedad opcional
  readonly createdAt: Date  // Propiedad de solo lectura
}

const product: Product = {
  id: 1,
  name: 'iPhone 15',
  price: 6999,
  createdAt: new Date()
}
```

**3. Alias de tipo (Type)**

```typescript
type ID = string | number  // Tipo unión
type Status = 'pending' | 'approved' | 'rejected'  // Tipo literal

function updateStatus(id: ID, status: Status) {
  // ...
}

updateStatus(1, 'approved')      // ✅
updateStatus('abc', 'pending')   // ✅
updateStatus(1, 'processing')    // ❌ 'processing' no es un Status válido
```

**4. Genéricos: tipos reutilizables**

```typescript
// Sin genéricos: escribir una función para cada tipo
function getFirstNumber(arr: number[]): number {
  return arr[0]
}
function getFirstString(arr: string[]): string {
  return arr[0]
}

// Con genéricos: una función para todos
function getFirst<T>(arr: T[]): T {
  return arr[0]
}

getFirst([1, 2, 3])        // Devuelve number
getFirst(['a', 'b', 'c'])  // Devuelve string
```

#### Comparación TypeScript vs JavaScript

| Característica | JavaScript | TypeScript |
|----------------|------------|------------|
| Comprobación de tipos | Errores solo en tiempo de ejecución | Errores detectados en compilación |
| Soporte IDE | Sugerencias básicas | Autocompletado inteligente, refactorización, ir a definición |
| Curva de aprendizaje | Simple | Requiere aprender el sistema de tipos |
| Escenarios aplicables | Proyectos pequeños, prototipos | Proyectos grandes, trabajo en equipo |
| Modo de ejecución | El navegador lo ejecuta directamente | Necesita compilarse a JavaScript |

#### TypeScript en el desarrollo real

```typescript
// Definición de tipo para respuesta de API
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface User {
  id: number
  name: string
  email: string
}

// Petición API con tipos
async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// Al usarlo, el IDE sugiere todas las propiedades
fetchUser(1).then(res => {
  console.log(res.data.name)   // ✅ El IDE autocompleta
  console.log(res.data.nmae)   // ❌ Error en compilación
})
```

::: tip 💡 Consejos para principiantes

1. **Primero aprende bien JavaScript**: TypeScript es un superconjunto de JS, aprender TS sin saber JS será muy doloroso
2. **No fuerces TS en proyectos pequeños**: las definiciones de tipo aumentan la cantidad de código, en proyectos simples se vuelve más complejo
3. **Transiciona desde JSDoc**: escribe comentarios `/** @type {User} */` en archivos JS para experimentar las sugerencias de tipo
4. **Usar `any` es un parche, no una solución**: cuando encuentres problemas de tipo, primero intenta resolverlos, no uses `any` directamente
:::

### 4.7 Cadena de herramientas de desarrollo JavaScript moderna

::: tip 🎯 ¿Por qué necesitamos una cadena de herramientas?

El navegador solo entiende HTML/CSS/JS. Pero en el desarrollo moderno, usamos:

- **TypeScript**: el navegador no lo entiende, necesita compilarse a JS
- **SCSS/Less**: el navegador no lo entiende, necesita compilarse a CSS
- **Modularización**: `import/export` necesita empaquetarse en un solo archivo
- **Sintaxis nueva**: ES6+ necesita transpilarse a código soportado por navegadores antiguos

La cadena de herramientas convierte el "código de desarrollo" en "código que el navegador puede ejecutar".
:::

**Herramientas principales**:

| Herramienta | Función | Analogía |
|-------------|---------|----------|
| **Node.js** | Entorno de ejecución de JavaScript | Permite que JS se ejecute fuera del navegador |
| **npm/yarn/pnpm** | Gestor de paquetes | Descargar bibliotecas de código escritas por otros |
| **Vite/Webpack** | Herramienta de construcción | Empaqueta el código fuente en código ejecutable por el navegador |
| **Babel** | Compilador | Convierte sintaxis nueva a sintaxis antigua |
| **ESLint** | Verificador de código | Detecta problemas de código e inconsistencias de estilo |

**Un flujo de desarrollo típico**:

```bash
# 1. Inicializar proyecto
npm create vite@latest my-app -- --template vue-ts

# 2. Instalar dependencias
cd my-app
npm install

# 3. Modo desarrollo (recarga en caliente)
npm run dev

# 4. Construir versión de producción
npm run build
```

---

## 5. La relación de colaboración entre los tres

### 5.1 Comparación de responsabilidades

| Rol | De qué se encarga | Qué no hace | Ejemplo típico |
|-----|-------------------|-------------|----------------|
| **HTML** | Define estructura y semántica | No se encarga de estilos/interacción | `<section><h1>Título</h1></section>` |
| **CSS** | Controla apariencia y maquetación | No se encarga de lógica/datos | `.card { background: white; }` |
| **JavaScript** | Maneja interacción y lógica | No se encarga de definir estructura | `button.onclick = () => alert()` |

### 5.2 Un ejemplo completo de colaboración

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* CSS: hace que la tarjeta se vea bien */
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      max-width: 300px;
    }
    .card button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <!-- HTML: define la estructura de la tarjeta -->
  <div class="card">
    <h2 id="title">Haz clic en el botón</h2>
    <button id="btn">Haz clic</button>
  </div>

  <script>
    // JavaScript: hace que el botón sea cliqueable
    const btn = document.getElementById('btn')
    const title = document.getElementById('title')

    btn.addEventListener('click', function() {
      title.textContent = '¡Clic hecho!'
      alert('El título ha cambiado')
    })
  </script>
</body>
</html>
```

---

## 6. Qué hacer cuando encuentras código que no conoces

### 6.1 Pregunta a la IA

> "¿Qué significa la etiqueta `<aside>` en HTML? ¿Cuándo se usa?"
>
> "¿Qué efecto tiene `position: sticky` en CSS?"

### 6.2 Consulta MDN

[MDN Web Docs](https://developer.mozilla.org/) es la documentación más autorizada de tecnologías web. Cuando encuentres una etiqueta, propiedad o método que no conozcas, simplemente búscalo.

### 6.3 Herramientas de desarrollo del navegador

1. Clic derecho en un elemento de la página → "Inspeccionar"
2. En el panel **Elements** ves la estructura HTML
3. En el panel **Styles** ves los estilos CSS
4. En el panel **Console** puedes ejecutar código JS

### 6.4 Referencia rápida de propiedades CSS comunes

| Si ves esto | Significa |
|-------------|-----------|
| `display: flex` | Activar maquetación flexible |
| `position: absolute` | Posicionamiento absoluto |
| `z-index: 100` | Nivel de capa, número mayor = más arriba |
| `overflow: hidden` | Ocultar contenido que desborda |
| `cursor: pointer` | El cursor se convierte en mano |
| `transition: all 0.3s` | Efecto de transición animada |
| `box-sizing: border-box` | Hace que width incluya padding y border |

---

## 7. Glosario rápido

| Término | Inglés | Explicación sencilla |
|---------|--------|---------------------|
| **HTML** | HyperText Markup Language | Lenguaje de marcado de hipertexto, describe la estructura web con etiquetas |
| **CSS** | Cascading Style Sheets | Hojas de estilo en cascada, controla colores, maquetación, animaciones |
| **JavaScript** | JavaScript | Lenguaje de programación de la web, responsable de interacción y lógica |
| **DOM** | Document Object Model | Modelo de objetos del documento, representa la página como un árbol de objetos |
| **Flexbox** | Flexible Box Layout | Un esquema de maquetación unidimensional, fácil de alinear y distribuir |
| **Modelo de caja** | CSS Box Model | Las capas concéntricas del elemento desde el contenido hasta el margen exterior |
| **SCSS** | Sassy CSS | Preprocesador CSS, soporta variables, anidamiento, mixins |
| **TypeScript** | TypeScript | Superconjunto de JavaScript, añade un sistema de tipos |
| **ES6** | ECMAScript 2015 | Una versión importante de JavaScript, añadió mucha sintaxis nueva |
| **Semántica** | Semantic HTML | Usar etiquetas con significado (como header) en lugar de div |
| **Responsive** | Responsive Design | Diseño que se adapta automáticamente a diferentes tamaños de pantalla |

---

## Resumen

Ahora ya sabes: **HTML define el esqueleto, CSS se encarga de la apariencia, JavaScript le da alma**.

Estos tres son los pilares del desarrollo web. Al entenderlos, podrás:

- Leer el código fuente de cualquier página web (clic derecho → "Ver código fuente de la página")
- Modificar páginas web de otros (DevTools del navegador → Elements)
- Empezar a aprender frameworks frontend (Vue/React), todos ellos se basan en estos tres

**Próximos pasos sugeridos**:

- Si quieres crear páginas web rápidamente, puedes aprender **Vue** o **React**
- Si quieres profundizar en CSS, puedes aprender maquetación con **Flexbox** y **Grid**
- Si quieres mejorar la calidad del código, puedes aprender **TypeScript**