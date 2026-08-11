---
title: 'Clonar desde una captura: tu primer ejercicio de imitación'
description: 'Sigue al profesor paso a paso y convierte una captura de producto en una página o minijuego que se pueda abrir y usar.'
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'

const duration = 'Aproximadamente <strong>2 horas</strong>'
</script>

# Clonar desde una captura: tu primer ejercicio de imitación

En la lección anterior pedimos a la IA que escribiera un programa a partir de una frase. Esta vez partiremos de algo más fácil de observar: <strong>elige una captura que te guste y pide a la IA que construya a partir de ella.</strong>

Es parecido a montar un modelo mirando una foto. No hace falta describir de antemano cada color, espacio y posición; la propia captura ya transmite buena parte de esa información.

<div style="text-align: center;">
<div style="display: inline-block; padding: 8px 20px; border-radius: 8px; border: 1px dashed #FFB6C1; background: linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 100%); margin: 12px 0;">
  <span style="font-size: 15px; font-weight: 500; color: #666;">Primero imita; después conviértelo poco a poco en tu propio trabajo 🧱</span>
</div>
</div>

## Para qué sirve esta lección

<ChapterIntroduction :duration="duration" :tags="['Clonar capturas', 'Programar con IA', 'Práctica inicial']" coreOutput="Un proyecto pequeño" expectedOutput="Una página o un minijuego que se abra y responda a una acción">

Empezaremos con una captura de un producto real y haremos un pequeño proyecto que funcione en el navegador. Puedes elegir la portada de un producto, un panel de datos o un juego sencillo.

Aquí practicaremos una sola cosa: <strong>encontrar una captura que te guste, entregársela a la IA y explicar con tus propias palabras qué quieres construir.</strong>

No necesitas saber programar ni preparar un documento de requisitos. Deja que la IA haga la primera versión, mira el resultado y explica qué parte quieres cambiar.

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Elegir imagen', description: 'Busca una pantalla que te guste' },
      { title: 'Dársela a la IA', description: 'Arrástrala al chat' },
      { title: 'Pedirlo en una frase', description: 'Pide que la construya' },
      { title: 'Seguir mejorando', description: 'Corrige una diferencia cada vez' }
    ]" />
  </ClientOnly>
</div>

## 1. Elige qué tipo de trabajo quieres hacer

Antes de abrir la herramienta, decide qué pequeño resultado quieres conseguir hoy.

No buscamos un producto completo con todas sus funciones, sino <strong>una pantalla que se abra, se entienda y tenga una interacción sencilla</strong>. Un alcance pequeño ayuda a que el primer intento salga bien.

Puedes elegir uno de estos tres tipos:

- <strong>Portada de producto:</strong> título, introducción, imagen y botón.
- <strong>Panel SaaS:</strong> barra lateral, tarjetas de datos y gráficos.
- <strong>Juego sencillo:</strong> movimiento, clic o un objetivo pequeño.

Antes de guardar la referencia, comprueba tres cosas:

1. ¿Se entiende el contenido principal con una sola captura?
2. ¿Hay algo de esa pantalla que de verdad te guste?
3. Cuando termines, ¿podrás reconocer rápidamente si el resultado se parece?

Si te gustan el título grande y los colores de una portada, captura su primera pantalla. Si te atrae el mundo de bloques de un juego, guarda una imagen donde se vea con claridad.

::: tip ¿Cuánto puede parecerse?
Cuanto más se acerque el resultado, más atención habrás prestado a los detalles y mejor sabrás explicar diferencias a la IA. Coloca al final la referencia y tu versión una junto a otra: ¿se parecen un 50 %, un 70 % o un 90 %?
:::

::: tip Haz una sola pantalla
No empieces con inicio de sesión, pagos, chat, panel de administración y aplicación móvil. Este ejercicio consiste en reproducir la pantalla que tienes delante.
:::

## 2. Sigue al profesor para construir una página

Primero observa el proceso completo. Cuando lo entiendas, repítelo con tu propia captura.

El profesor creó una carpeta vacía y la abrió en Trae. El proyecto se llamó `trae-screenshot-demo`; al principio no contenía página ni código.

### 2.1 Entrega la imagen de referencia a Trae

La referencia procede de una página de muestra de Framer. En ella se distinguen el título grande, la navegación, el paisaje morado y los pequeños controles.

![Captura de la página colocada en Trae](../../../zh-cn/stage-1/clone-your-favorite-app/images/framer-official-interface.jpg)

_Fuente de la captura: [Framer Website Builder](https://www.framer.com/solutions/website-builder/)_

Después de arrastrar la imagen al chat de Trae, el profesor escribió una petición muy corta:

```text
Crea una página web parecida a esta imagen. Ábrela para que pueda verla cuando esté lista.
```

La imagen indica a Trae el aspecto aproximado; la frase aclara que debe convertirla en una página web.

Tras enviarla, espera a que Trae cree los archivos. No mandes varias peticiones nuevas antes de que termine la primera.

### 2.2 Mira la primera versión

Trae creó `index.html`, `styles.css` y `script.js`, y después abrió la página en el navegador. Esta animación muestra el resultado obtenido en clase:

![Página Wishlabs generada y ejecutada desde la captura](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-wishlabs.gif)

Todavía no estudies el código. Mira la página y compárala con la referencia:

- Se conserva el ambiente de cielo y montañas moradas.
- El título grande sigue ocupando el centro.
- Hay navegación arriba y una fila de controles abajo.
- Texto, botones e imágenes forman una primera pantalla completa.

No es una copia exacta, pero conserva la estructura y el ambiente más visibles. Para una primera versión es suficiente.

### 2.3 La primera versión solo tiene que verse

No borres todo porque la fuente o la posición de un botón sea algo distinta. Primero confirma que la página abre y después elige el problema más claro.

Si el título es demasiado pequeño, di:

```text
Haz más grande el título del centro.
```

Vuelve a abrir la página. Si se acerca más a lo que querías, el cambio ha servido.

::: tip Puedes hablar con normalidad
Estás construyendo algo con Trae, no haciendo un examen de prompts. Describe lo que ves con tus palabras habituales.
:::

## 3. Hazlo ahora con tu propia imagen

Abre Trae, crea una carpeta vacía y ábrela en el editor. Un nombre sencillo como `my-first-page` es suficiente.

Después sigue estos pasos:

1. Busca una captura de una web o un juego que te guste.
2. Pulsa el botón de imagen junto al chat y elige la captura.
3. Comprueba que la imagen aparece en el mensaje.
4. Escribe una petición corta y envíala.

```text
Crea una página web parecida a esta imagen.
Ábrela para que pueda verla cuando esté lista.
```

En este primer ejercicio no necesitas indicar framework, carpetas ni nombres de archivo. Deja que Trae los elija.

Si solo quieres el estilo, pero no el nombre y el texto originales, añade:

```text
Usa el estilo de esta imagen, pero cambia el nombre y el contenido.
```

Espera a que termine. Si pide permiso para crear archivos o ejecutar el proyecto, acéptalo. Si la página no se abre sola, di:

```text
Inicia este proyecto. Quiero ver el resultado.
```

Cuando aparezca, dedica diez segundos a comprobar que abre, que contiene lo principal y que el botón más importante responde. No empieces cambiando cinco cosas a la vez.

## 4. El mismo método sirve para otros productos

Trabajar desde una captura no se limita a portadas. Para comprobarlo, el profesor creó otros dos proyectos vacíos: un panel de datos y un juego de bloques.

### Ejemplo 1: un panel SaaS

Los productos SaaS suelen mostrar proyectos, ventas o usuarios en paneles. En esta captura de Linear, la navegación está a la izquierda y el contenido a la derecha.

![Interfaz oficial del panel de Linear](../../../zh-cn/stage-1/clone-your-favorite-app/images/linear-official-dashboard.png)

_Referencia de clase: [Linear Dashboards](https://linear.app/docs/dashboards)_

El profesor colocó la imagen en Trae y escribió:

```text
Crea un panel de datos parecido a este.
Por ahora usa datos de ejemplo.
```

Trae produjo una barra lateral, tarjetas y gráficos. Esta es la página ejecutándose en el navegador:

![Panel generado y ejecutado desde la captura](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-linear-dashboard.gif)

Los números aún no son datos reales de una empresa, y no pasa nada. En este ejercicio primero se construye la estructura; las etiquetas y cifras se cambian cuando la página ya es estable.

### Ejemplo 2: un juego de bloques

Si una web corriente no te interesa, usa una captura de un juego. El profesor eligió una imagen del mundo de bloques de Minecraft.

![Interfaz de Minecraft en modo creativo](../../../zh-cn/stage-1/clone-your-favorite-app/images/minecraft-official-creative-mode.png)

_Referencia de clase: [ejemplo de Minecraft en Microsoft Learn](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/108)_

La petición siguió siendo breve:

```text
Crea un juego de bloques parecido a este.
El personaje debe moverse y colocar bloques.
```

Trae creó un juego para navegador en el que el personaje puede moverse y colocar o retirar bloques:

![Juego de bloques 2D generado y ejecutado desde la captura](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-block-game.gif)

Este resultado es un juego <strong>2D visto de lado</strong>. El personaje se mueve sobre un plano y no existe profundidad hacia delante o hacia atrás. Como la petición solo decía “juego de bloques”, Trae eligió la interpretación más sencilla.

Abre la página, pulsa las flechas y haz clic en la escena. Si el personaje se mueve y puedes colocar bloques, la primera versión 2D ya funciona.

### Haz otra versión en 3D

Si quieres una vista en primera persona más cercana a Minecraft, incluye “3D” en la petición. El profesor abrió otro proyecto vacío, añadió la misma captura y escribió:

```text
Crea un juego de bloques 3D parecido a este.
Quiero caminar, girar la cámara y colocar bloques.
```

Esta vez Trae creó un mundo de bloques realmente tridimensional:

![Juego de bloques 3D generado y ejecutado desde la captura](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-3d-block-game.gif)

Después de pulsar “Start Game”, usa `WASD` para caminar y el ratón para girar. El botón izquierdo retira un bloque, el derecho coloca uno y las teclas numéricas cambian el tipo de bloque.

Ni 2D ni 3D es siempre mejor. 2D resulta más sencillo para un primer juego. Si caminar hacia delante y atrás dentro del mundo es esencial para tu idea, pide claramente una versión 3D.

::: tip Hazlo diferente
La referencia es solo un punto de partida. Cambia color, tema, texto, imágenes o interacción para convertir poco a poco el resultado en tu propio trabajo.
:::

## 5. ¿Qué hago si la primera versión no queda bien?

Es normal que la primera versión se vea distinta o tenga algún botón sin respuesta. Casi ningún proyecto termina con una sola frase. Mira, cambia un poco y vuelve a mirar.

Un error habitual al empezar es meter todos los problemas en un mensaje. Si cambian demasiadas cosas a la vez, no sabrás qué modificación produjo el resultado.

Usa una regla sencilla: <strong>elige en cada ronda el problema más claro.</strong>

### La página se ve mal

Si una tarjeta es demasiado alta:

```text
La tarjeta de arriba es demasiado alta. Hazla más baja.
```

Si la imagen principal es pequeña:

```text
La imagen del centro es demasiado pequeña. Hazla más grande.
```

Si el fondo es muy oscuro:

```text
El fondo es demasiado oscuro. Usa un color más claro.
```

### La página no funciona como debería

Si un botón no hace nada:

```text
Este botón no responde cuando lo pulso. Arréglalo.
```

Si el personaje no se mueve:

```text
Las flechas no hacen nada. Arregla el movimiento.
```

### No sé explicar el problema

Haz una captura del resultado actual y di:

```text
Este es el resultado actual. Compáralo con la referencia y corrige la diferencia más grande.
```

No necesitas conocer términos como “margen” o “diseño adaptable”. “Está demasiado lleno”, “el texto cuesta leerlo” o “en el móvil se ve desordenado” ya son descripciones útiles. Corrige un problema y continúa con el siguiente.

## 6. Comprobación en clase

No mires solo una imagen fija. Abre el resultado y pulsa o juega tú mismo.

Comprueba cuatro cosas:

- <strong>Se abre:</strong> al actualizar no aparece una página en blanco ni un error.
- <strong>Se entiende:</strong> otra persona distingue si es una portada, un panel o un juego.
- <strong>Responde:</strong> el botón principal o los controles básicos funcionan.
- <strong>Sigue siendo legible:</strong> al estrechar la ventana, texto e imágenes no se solapan.

Si algo falla, explica a Trae exactamente lo que has visto y pide que corrija solo ese punto. Cuando las cuatro comprobaciones pasen, el ejercicio está terminado.

::: tip Termina un trabajo pequeño
Inicio de sesión, pagos, grupos y multijugador no forman parte de esta clase. Una pequeña página terminada vale más que diez comienzos sin acabar.
:::

## 📚 Tarea

<StageAssignmentCard title="Crea tu propia página desde una captura">

  <p>Elige la imagen de una web o un juego que te guste, dásela a la IA y reproduce una sola pantalla.</p>

  <ol>
    <li>Conserva la captura de referencia.</li>
    <li>Genera la página y mejora una parte que no te guste.</li>
    <li>Guarda una captura del resultado corregido.</li>
  </ol>

  <p>Al presentarlo, coloca la referencia y tu trabajo juntos y explica el cambio que pediste.</p>
</StageAssignmentCard>

## Lo que debes recordar

No empezamos por el código, sino por una captura. El ejercicio completo tiene cuatro pasos:

1. Haz o guarda una captura.
2. Entrégasela a la IA.
3. Explica el trabajo en una frase.
4. Corrige una diferencia visible cada vez.

La imagen explica a la IA cómo debe verse el producto. Tus palabras explican qué debe hacer. Cuando aparezca la primera versión, pulsar, observar y hacer capturas te ayudará a describir el siguiente cambio.

Un prompt no tiene que parecer un manual técnico. Pide una cosa sencilla, consigue que el trabajo funcione y continúa la conversación con lo que tienes delante. Construir un proyecto empezará a sentirse mucho más cercano.
