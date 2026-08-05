# Fundamentos de gráficos y animación: Canvas y sus compañeros

::: tip 🎯 Pregunta central

Antes, las páginas web solo podían mostrar texto e imágenes secos. Pero si quieres hacer un juego de romper ladrillos, efectos dinámicos espectaculares, o informes de datos que se puedan arrastrar libremente, solo con `<div>` no es suficiente en absoluto. Esa es la razón por la que nació **Canvas (lienzo)**.

Esta guía te llevará desde dibujar la primera línea, subiendo de nivel derrotando monstruos, hasta escribir con tus propias manos un motor de partículas que funcione fluidamente a 60 FPS en el navegador.

:::

---

## 1. Introducción a Canvas

Si las páginas web antiguas se ensamblaban con **bloques de construcción Lego** (etiquetas HTML), entonces la etiqueta `<canvas>` de HTML5 te lanza una **enorme hoja digital en blanco**, te entrega un **pincel** controlado por código, y el resto depende de tu creatividad.

Aquí no hay estructura de etiquetas para lo que dibujes. Lo que pintas con el pincel, una vez aplicado se convierte en pura **"pintura de píxeles"**.

### 1.1 Canvas vs SVG: dos tipos de artistas con filosofías diferentes

En el mundo del dibujo frontend, Canvas tiene un rival natural llamado **SVG**. Representan dos conceptos de dibujo completamente distintos:

- **Canvas (tablero de mapa de bits):**
  - **Principio**: Es como pintar de verdad sobre papel, unas pocas pinceladas se convierten en una mancha de pintura (píxeles).
  - **Ventaja**: La computadora solo "esparce pintura" sobre la pantalla, el rendimiento despega. Puede dibujar miles de partículas parpadeantes simultáneamente.
  - **Desventaja**: Una vez dibujado no puedes deshacer individualmente (no puedes seleccionar a través de nodos DOM), y al ampliar se pixela y se ve borroso.
- **SVG (ensamblaje de gráficos vectoriales):**
  - **Principio**: Es como hacer una presentación PPT. Dibujas un círculo, genera una etiqueta independiente con una "entidad circular" colocada en el lienzo.
  - **Ventaja**: No importa si amplías 100 veces o 100.000 veces, siempre se ve extremadamente nítido. Cada forma es un nodo DOM independiente, puedes cambiar su color o vincular eventos de clic con CSS y JS en cualquier momento.
  - **Desventaja**: Si intentas poner decenas de miles de objetos volando, el pesado árbol DOM y el motor de diseño bloquearán el navegador.

**🎮 Resumen simple: para juegos dinámicos y efectos de partículas espectaculares usa Canvas; para logotipos precisos y pequeños gráficos interactivos usa SVG.**

---

## 2. Primer trazo: comprendiendo el sistema de coordenadas contraintuitivo

### 2.1 Motivación de la inversión de coordenadas

Cuando te dispones a dibujar, primero debes entender que la regla de Canvas está al revés. En el sistema de coordenadas tradicional de la clase de matemáticas, el punto de origen cero está en el centro, y cuanto más arriba, mayor es el valor. Pero en el campo de la visualización en pantalla de computadora, en casi todos los dispositivos el "punto de origen (0, 0)" se fija en la **esquina superior izquierda** de la pantalla. Hacia la derecha el eje X aumenta sin problema, pero **hacia abajo, el eje Y aumenta.**

**Principios centrales del sistema de coordenadas de Canvas:**
- **Unidad nativa:** Píxeles (px), correspondencia 1:1 con los píxeles físicos de la pantalla.
- **Eje X:** Dirección positiva hacia la derecha, desde `0` hasta `canvas.width`.
- **Eje Y:** Dirección positiva hacia abajo, desde `0` hasta `canvas.height`.

👇 Arrastra el punto pequeño abajo y siente intuitivamente el origen y la dirección de las coordenadas en los gráficos por computadora:

<CoordinateSystemDemo />

### 2.3 Darle condimentos a tu pincel mágico

Con el sistema de coordenadas, podemos invocar el pincel (llamado `Context` en el código, o abreviado `ctx`). Al igual que pintar con una paleta real, el diseño de la API de Canvas sigue perfectamente los tres pasos de la pintura física:

1. **Mezclar color (State)**: Establecer el color de relleno con `fillStyle`, el color de trazo con `strokeStyle`.
2. **Construir forma (Path)**: Idear si vas a dibujar una línea (`lineTo`), un círculo (`arc`), o un rectángulo (`rect`).
3. **Pincelada mínima (Render)**: Decidir si rellenas el interior (`fill()`) o delineas el contorno (`stroke()`).

Como Canvas es un lienzo de mapa de bits puro, "una vez pintado no hay marcha atrás", una vez que dibujas, se seca inmediatamente convirtiéndose en píxeles, y no se puede deshacer como objeto independiente.

👇 Prueba a seleccionar diferentes formas y colores en la siguiente demostración, y observa cómo el código subyacente ejecuta estos "tres pasos":

<CanvasBasicsDemo />

---

## 3. Libro de animación con páginas: cómo hacer que la imagen se mueva extremadamente fluida

Como Canvas una vez relleno se convierte en píxeles permanentes, ¿cómo se hacen los personajes corriendo por toda la pantalla en los juegos HTML5?

La respuesta es **"engañar a tus ojos"**. Es exactamente el mismo principio que un libro de animación o una película:

1. **Borrar la pizarra (Clear)**: Usar `clearRect()` para borrar implacablemente todo el contenido del lienzo.
2. **Calcular nueva posición (Update)**: Hacer que la coordenada X del personaje avance secretamente 2 píxeles.
3. **Volver a dibujar (Render)**: Dibujar el personaje otra vez en la nueva posición.
4. **Bucle infinito (Loop)**: Combinar con el metrónomo extremadamente preciso integrado en el navegador `requestAnimationFrame`. Se repetirán estas tres acciones a la tasa de refresco de la pantalla (normalmente 60 veces por segundo, es decir, 60 FPS).

Como el ojo humano tiene "persistencia de visión", en las 60 veces por segundo de [borrar -> actualizar -> redibujar], no solo no ves una pizarra parpadeante, sino una animación tan fluida como la seda.

👇 Ajusta la velocidad de reproducción en la demostración de abajo y observa cómo el desplazamiento de cada fotograma se concatena en un movimiento fluido:

<AnimationLoopDemo />

---

## 4. El ciego tocando al elefante: Enfoque de interacción con clics en Canvas

Porque el lienzo de Canvas es para el navegador solo una "tela de pintura" sin estructura alguna. Supongamos que dibujas un monstruo con `arc()` en el lienzo; cuando quieres implementar "hacer clic en el monstruo para quitarle vida", **no puedes en absoluto** usar el tradicional `document.getElementById` para obtener este monstruo. Porque en la estructura HTML, solo existe la rígida etiqueta `<canvas>` de 600 píxeles de ancho.

Este es el problema más clásico de la programación gráfica: **Detección de colisiones (Collision Detection) y delegación de eventos**.

Como el navegador solo sabe que tu ratón hizo clic en la coordenada de pantalla `(x, y)` del Canvas, necesitas calcular tú mismo con la geometría de la escuela secundaria:
- **Para círculos**: Calcular la distancia desde el `punto de clic del ratón` al `centro del círculo` usando el teorema de Pitágoras; si la distancia es menor que el radio, entonces fue "alcanzado".
- **Para rectángulos**: Verificar si la `x` del clic está dentro de los límites izquierdo y derecho del rectángulo, y simultáneamente si la `y` está dentro de los límites superior e inferior.

No importa cuántos elementos haya en tu lienzo, los eventos de desplazamiento o clic siempre se vinculan al único contenedor Canvas, esta es la "delegación de eventos" definitiva.

👇 Intenta usar el ratón (clic, arrastre, desplazamiento) o teclado (teclas de flecha) abajo, y experimenta esta lógica de interacción de bajo nivel de "calcular distancias manualmente":

<EventHandlingDemo />

---

## 5. Liberar el poder de cálculo: sistemas de partículas y magia visual

Llegado a este punto, cuando fusionamos "sistema de coordenadas", "bucle de animación" y "color y forma", y multiplicamos su cantidad a cientos de miles de pequeños fragmentos, dominarás el arma definitiva para detonar visualmente: **Sistema de partículas (Particle System)**.

Su idea central es extremadamente brutal pero efectiva:
1. Crear un array enorme, lleno con cientos de "objetos de partícula" independientes.
2. Cada objeto tiene su propio ciclo de vida (`life`), aceleración (`vx/vy`), amortiguación gravitacional (`gravity`).
3. Cada vez que `requestAnimationFrame` se dispara, iterar y actualizar estos cientos de partículas, renderizar, y luego limpiar silenciosamente las partículas "muertas" (vida agotada/caídas fuera de la pantalla).

Tu navegador puede convertirse en un instante en una fábrica de fuegos artificiales, nieve y explosiones.

👇 Haz clic en diferentes efectos, ajusta la gravedad y el número de partículas, y observa cómo las fórmulas matemáticas y físicas más simples presentan una visión grupal compleja:

<ParticleSystemDemo />

---

## 6. Proteger la gloria de los FPS: Enfoque de enfrentar la fiebre de la CPU

Hacer que miles de objetos se calculen y redibujen 60 veces en un segundo consume mucho rendimiento. Si lo haces sin método, el ventilador de tu computadora pronto despegará.

Aquí están las "técnicas de protección" que los verdaderos maestros de motores usan para rescatar la tasa de fotogramas:

1. **Borrado parcial de pizarra (rectángulo sucio Dirty Rect):**
   Un personaje corriendo en una amplia pradera, ¡no debes hacer `clearRect` de toda la pradera en cada fotograma! Solo limpia y redibuja el pequeño bloque por donde pasa el personaje con un "borrador pequeño", y el rendimiento se dispara exponencialmente.

2. **Magia del doble de fondo (Canvas fuera de pantalla):**
   Si el fondo es un cielo estrellado con varias montañas complejas y hermosas, renderizarlo en tiempo real cada vez es una tontería. Normalmente construimos en secreto un `<canvas>` invisible en la memoria, lo pintamos exquisitamente una vez. En cada refresco de fotograma posterior, solo necesitamos pegar esta "película estática" compuesta directamente a través de `drawImage()`, evitando una cantidad masiva de cálculos base.

3. **Lavar pinceles por lotes (Batching):**
   Cambiar de rojo a azul en la paleta es costoso a nivel bajo. Si el lienzo tiene 1000 círculos rojos y 1000 círculos azules dispersos alternativamente. El método más rápido es: preparar primero la pintura roja, iterar y dibujar todos los círculos rojos, luego cambiar a pintura azul y dibujar todos los círculos azules. Esta es la famosa idea de renderizado por lotes (Batch Rendering).

👇 Sube el número de objetos a más de 3000, mira cómo la página cae en el abismo del lag, luego activa secuencialmente los interruptores de "técnicas de optimización" en la esquina inferior derecha, y presencia el rescate real de la tasa de fotogramas:

<PerformanceDemo />

---

## 7. Resumen de términos profesionales

| Término | Explicación en lenguaje llano |
| --- | --- |
| **Canvas** | Lienzo 2D proporcionado por HTML5. Dibuja extremadamente rápido, pero una vez dibujado se convierte en píxeles de pintura, no soporta manipulación del contenido a través de DOM. |
| **SVG** | Gráficos vectoriales. Al ampliar nunca se ven borrosos, y cada figura es un elemento de etiqueta independiente, al que se pueden vincular fácilmente varios estilos CSS e interacciones. |
| **Context (ctx)** | El "pincel mágico 2D" que solicitas, usado para mezclar colores, definir formas y dibujar varios efectos especiales. |
| **requestAnimationFrame** | El metrónomo divino integrado en el navegador, ejecutará callbacks estrictamente según la tasa de refresco del monitor, es la opción insustituible para hacer animaciones fluidas. |
| **FPS (Frame Rate)** | Tasa de fotogramas. 60 FPS significa que en un segundo el navegador borró el lienzo 60 veces sin interrupciones y redibujó 60 imágenes nuevas. |
| **Rectángulo sucio (Dirty Rect)** | Borrar y redibujar con precisión solo en la pequeña zona donde se produjo el cambio, preservando así fuertemente el rendimiento. |
| **Canvas fuera de pantalla** | Un "lienzo oculto" escondido en la memoria. Dibujar de antemano escenas extremadamente complejas pero estáticas, y luego usarlo como textura muerta reutilizable. |

> Desde un simple segmento de línea, hasta un magnífico motor de sistema de partículas; todos los efectos especiales que parecen magia no son más que 60 ciclos por segundo de cálculo de coordenadas y redibujo.
