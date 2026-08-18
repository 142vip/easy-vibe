# Disenar un sitio web con Agent de diseno y programacion

## Resumen del capitulo

Este capitulo mostrara como el diseno y el desarrollo pueden colaborar perfectamente a traves de la IA. Tu asumiras el rol de product manager, dirigiendo al "Agent de diseno" para completar el diseno del logotipo, el esquema de colores y el layout de la pagina, y luego coordinando con el "Agent de programacion" para convertir los bocetos visuales en codigo ejecutable. Desde la concepcion creativa hasta la publicacion del sitio web, experimenta el flujo de desarrollo potenciado por IA de principio a fin, convirtiendo a una sola persona en todo un equipo.

---

# 1. Guia de inicio

## 1. Introduccion al tutorial

Vamos a usar un Agent de diseno de IA y un Agent de codificacion para construir un sitio web completo desde cero.

- **Agent de diseno**: responsable de crear el logotipo, el layout de la pagina web, el esquema de colores y otros elementos visuales
- **Agent de codificacion**: segun los requisitos y layout que definas en los prompts, escribe el codigo real como HTML/CSS/JS, construyendo un sitio web funcional

## 2. Agent de diseno vs Agent de codificacion

- **Agent de diseno**: IA que genera imagenes, mockups de pagina o estilos de diseno basandose en los prompts que le proporcionas.
- Mastergo
- Lovart
- Figma MCP
- **Agent de codificacion**: IA que escribe el codigo real (HTML/CSS/JS, etc.) basandose en las funcionalidades y layout que solicitas en tus prompts.
- Z.AI
- Trae
- Cursor
- Lovable

---

# 2. Crear un logotipo con el Agent de diseno

## 1. Elementos clave a considerar al disenar un logotipo

El logotipo es uno de los elementos clave que determinan la primera impresion de tu sitio web. Para obtener resultados satisfactorios del Agent de diseno de IA, necesitas describir claramente en tu prompt que tipo de logotipo deseas.

1. **Nombre de marca / texto**

- El texto que debe aparecer en el logotipo (por ejemplo: titulo del sitio web, nombre de la marca, etc.).

2. **Estilo (estado de animo / atmosfera)**

- La sensacion o atmosfera general que el logotipo debe transmitir.
- _Ejemplos: minimalista, mono, limpio, moderno, retro, futurista, etc._

3. **Esquema de colores** (opcional)

- Es preferible que los colores del logotipo coincidan con el tono general del sitio web.
- Puedes especificar codigos hexadecimales concretos o tonos generales (frios, calidos, etc.).
- _Ejemplos: **`#171721`** (negro), **`#FF7130`** (naranja)._

4. **Forma (figura / estructura)**

- Define si el logotipo necesita una forma o composicion especifica.
- _Ejemplos: texto dentro de un circulo, combinacion de icono + texto, logotipo centrado en un icono, etc._

5. **Icono / elemento simbolico** (opcional)

- Graficos o simbolos que deseas que aparezcan en el logotipo.
- _Ejemplos: icono de libro, simbolo de rayo, graficos relacionados con IA, formas geometricas abstractas, etc._

## 2. Escribir prompts para el diseno del logotipo

**Ejemplo de prompt**

```
"Por favor disename un logotipo de estilo minimalista. El nombre de la marca es 'My First Website'.
Usa negro (#171721) y naranja (#FF7130), y coloca el texto dentro de un circulo."
```

```
"Por favor disena un logotipo con el nombre de marca 'AIID'.
El estilo general debe ser futurista, limpio y simple, con azul y blanco como colores principales.
Combina un grafico abstracto que simbolice la IA con el texto, y exportalo como PNG con fondo transparente."
```

## 3. Solicitar el diseno al Agent

- Introduce el prompt anterior -> compara los multiples disenos generados por el Agent.

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image1.webp)![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image2.webp)

## 4. Confirmar el logotipo final

- Selecciona tu version favorita entre los borradores y descargala.

---

# 3. Planificar la estructura de tu sitio web

## 1. Conocer las secciones basicas

Antes de empezar realmente a crear el sitio web, es muy importante planificar que menus (secciones) incluir. El diseno de los menus depende de lo que quieras que vean los visitantes y que acciones deseas que realicen.
Generalmente, un sitio web esta compuesto por secciones basicas como **Home / About / Contact**.

## 2. Dibujar primero un esquema de estructura (opcional)

Puedes escribir primero un esquema simple de la estructura de menus basandote en los objetivos del sitio web.

### Menus basicos

1. **Home**
   1. La pagina principal que los visitantes ven al entrar al sitio web
   2. Suele incluir el logotipo, un area visual principal y un lema o introduccion breve
2. **About**
   1. Presenta quien eres, o el proposito del proyecto / servicio
   2. Portafolio personal: presentacion + breve curriculum
   3. Sitio web de servicios: vision, objetivos y funcionalidades principales
3. **Contact**
   1. Informacion de contacto, como correo electronico, numero de telefono, enlaces a redes sociales, etc.
   2. Tambien puedes anadir un formulario de contacto simple

### Menus opcionales

4. **Services / Projects**
   1. Muestra los servicios que ofreces, o tus proyectos / portafolio
   2. Generalmente presentados en formato de lista o tarjetas

5. **Gallery**
   1. Para mostrar imagenes, fotos o trabajos de diseno

6. **Blog / News**
   1. Para publicar articulos, actualizaciones o diarios

7. **FAQ**
   1. Recopila las preguntas frecuentes de los visitantes con sus respuestas

## 3. Elegir un esquema de colores (opcional)

Si ya tienes un logotipo, o quieres disenar el sitio web con una combinacion de colores especifica, puedes incluir directamente en tu prompt los codigos de color que deseas usar.

**Ejemplo:** `#171721, #872B97, #FF7130, #FF3C68`

Incluso si no se te ocurre un esquema de colores en este momento, puedes encontrar inspiracion a traves de sitios web de colores o buscando palabras clave.

- **Sitios web de referencia de colores**
  - https://colorhunt.co/
  - https://coolors.co/

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image3.webp)![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image4.webp)

- **Buscar esquemas de colores en Google por palabras clave**

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image5.webp)

## 4. Escribir el prompt para el diseno del sitio web

**Ejemplo de prompt**

```
"Por favor disena un sitio web de una sola pagina compuesto por las secciones Home, About y Contact.
Usa los colores #171721, #FF7130 y #FF3C68.
El estilo general debe ser moderno y limpio."
```

---

# 4. Disenar el sitio web con el Agent de diseno

## 1. Introducir el prompt -> generar el diseno

- Escribe en el prompt la estructura que has planificado y los colores que has seleccionado.

**Ejemplo de prompt en Mastergo**

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image6.webp)![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image7.webp)

## 2. Revisar el diseno y sugerir cambios

Puedes proporcionar retroalimentacion al Agent segun tus necesidades, por ejemplo:

- "Es demasiado recargado, simplifica el estilo general."
- "Cambia la fuente."
- "Ajusta la combinacion de colores."
- "Elimina esta seccion de aqui."

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image8.webp)

## 3. Confirmar el diseno final

Cuando hayas realizado multiples rondas de modificaciones al diseno y estes satisfecho, puedes convertir este diseno en codigo, para que el Agent de codificacion pueda entenderlo y continuar trabajando.

La forma de convertir el diseno a codigo varia segun la plataforma, pero generalmente se hace instalando y usando ciertos plugins dentro de la plataforma de diseno.

**Ejemplo con Mastergo**

1. Abre el [sitio de plugins de Mastergo](https://mastergo.com/community/plugin) y busca **seal**.

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image9.webp)

2. Vuelve a la pagina de diseno y haz clic en el **icono de cubo (plugin)**.

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image10.png)

3. Selecciona el area de diseno que deseas convertir a codigo y haz clic en el boton **Generate** para generar el codigo.

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image11.webp)

---

# 5. Construir el sitio web con el Agent de codificacion

## 1. Entender los conceptos basicos de HTML/CSS/JS

Un sitio web esta esencialmente compuesto por tres lenguajes:

- **HTML (HyperText Markup Language)** -> Estructura (esqueleto)
- **CSS (Cascading Style Sheets)** -> Estilos (apariencia)
- **JavaScript (JS)** -> Funcionalidad (interaccion)

Estos tres trabajan juntos para formar la pagina web completa que vemos.

1. **HTML (Estructura)**

- Define "que se muestra" en la pagina
- Se usa para colocar elementos como texto, imagenes, botones, enlaces, etc.
- Es como los **muros y el armazon** de un edificio

**Ejemplo**

```html
<h1>Hola!</h1>
<p>Este es mi primer sitio web.</p>
<a href="contact.html">Contacto</a>
```

2. **CSS (Estilos)**

- Decide "como se muestra el contenido"
- Controla el tamano del texto, colores, espaciado, fondo, forma de los botones, etc.
- Le da a HTML su "ropa" y estilo visual

**Ejemplo**

```css
h1 {
  color: #FF7130;   /* Color del texto */
  font-size: 36px;  /* Tamano de fuente */
  text-align: center; /* Alineacion centrada */
}

body {
  background-color: #171721; /* Color de fondo */
  color: white; /* Color de texto predeterminado */
}
```

3. **JavaScript (JS) (Funcionalidad)**

- Permite que la pagina web interactue con el usuario
- Puede implementar efectos dinamicos como clics de botones, menus desplegables, carruseles de imagenes, envio de formularios, etc.
- Si HTML/CSS son el esqueleto y la apariencia estaticos, entonces JS es el **cerebro** que hace que la pagina web "cobrara vida"

**Ejemplo**

```javascript
function showAlert() {
  alert("Se ha hecho clic en el boton!");
}
```

```html
<button onclick="showAlert()">Haz clic en mi</button>
```

## 2. Dejar que el Agent de codificacion genere el codigo

**Ejemplo de prompt**

```
"Por favor escribe HTML y CSS para un sitio web de una sola pagina con las secciones Home, About y Contact.
Usa los colores #171721, #FF7130, #FF3C68.
Fondo negro y texto blanco."
```

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image12.webp)

## 3. Ejecutar el sitio web

Cuando se ha generado el codigo borrador, el Agent generalmente inicia automaticamente el proyecto y muestra la pagina del sitio web generada.

Si has reiniciado el Agent o la pagina del sitio web no aparece, puedes introducir un prompt como este:

```
"Please activate the project"
```

Para que el Agent reinicie el proyecto y abra la pagina de vista previa, facilitandote ver el efecto actual.

## 4. Realizar modificaciones simples

Puedes seguir ajustando el borrador mediante lenguaje natural, por ejemplo:

- "Haz el boton mas grande."
- "La fuente mas gruesa."

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image13.png)![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image14.png)

## 5. Modificar el contenido del texto del sitio web

El sitio web de la version inicial generada por el Agent generalmente incluye algo de texto de marcador de posicion generado automaticamente. Para que se acerque mas a tu escenario real, puedes preparar el contenido real de antemano y luego pedirle al Agent que lo reemplace.

**Ejemplo de aplicacion**: actualizar la pagina About del sitio web AIID

1. Primero escribe el contenido que deseas mostrar en la pagina About. Para facilitar la comprension del Agent, puedes guardar el contenido en formato Markdown.

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image15.webp)

2. Luego dile al Agent en la conversacion que aplique el contenido del archivo a la pagina especificada.

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image16.png)

3. Revisa la version actualizada despues de aplicar el contenido.

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image17.webp)

## 6. Insertar imagenes

Si deseas anadir imagenes especificas (por ejemplo, logotipo, imagen de fondo, etc.), primero sube las imagenes a la carpeta del proyecto y luego indica en el prompt en que posicion de la pagina deseas usarlas.

- **Ejemplo:**

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image18.png)![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image19.png)![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image20.png)

- **Resultado:**

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image21.webp)

---

# 6. Integrar diseno y codigo

## 1. Integrar los archivos de diseno con el codigo del sitio web (opcional)

Cuando hayas descargado los archivos de codigo del Agent de diseno, puedes moverlos al directorio del proyecto actual y luego pedirle al Agent de codificacion que te ayude a fusionar este codigo de diseno con el proyecto existente.

- **Ejemplo:**

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image22.webp)

- **Resultado:**

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image23.webp)
---
title: 'Construir un sitio con agentes de diseno y programacion'
description: 'Del concepto al lanzamiento: coordina un agente de diseno para el visual y un agente de codigo para convertirlo en un sitio funcionando con un flujo reutilizable.'
---
