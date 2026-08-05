# Fundamentos del depurador del navegador (DevTools)

::: tip 💡 Función principal
Las herramientas de desarrollo del navegador (DevTools) son la "máquina de rayos X" y la "mesa de operaciones" del desarrollo frontend. Te permiten ver a través de la estructura de la página (HTML), su apariencia (CSS) y su sistema nervioso (JavaScript), y te permiten modificarlos y depurarlos en tiempo real.
:::

## 1. Introducción a DevTools

**DevTools** es un conjunto de herramientas web integradas en los navegadores modernos (Chrome, Edge, Firefox, Safari, etc.). Para los desarrolladores, está más cerca de la "verdad" que el editor de código, porque **muestra cómo se ejecuta realmente el código en el navegador**.

**¿Cómo abrir DevTools?**

- **Atajo de teclado**: `F12` o `Ctrl + Shift + I` (Mac: `Cmd + Option + I`)
- **Ratón**: Haz **clic derecho** en cualquier elemento de la página y selecciona **"Inspeccionar (Inspect)"**.
- **Menú**: Menú en la esquina superior derecha del navegador -> Más herramientas -> Herramientas de desarrollo.

---

## 2. Demostración interactiva: simulador de DevTools

Para que te familiarices rápidamente, hemos creado un panel de DevTools simulado que reproduce la interfaz de depuración de Chrome.
**Prueba a hacer clic en el botón "▶ Iniciar recorrido automático" y sigue el cursor para conocer las funciones de cada área.**

<ClientOnly>
  <BrowserDevToolsDemo />
</ClientOnly>

### 2.1 Demostración avanzada: modificación en vivo (Live Edit)

Una de las funciones más potentes de DevTools es la **modificación en tiempo real**. La siguiente demo contiene una "página web virtual" (arriba) y un "DevTools" (abajo).

**Intenta lo siguiente**:

1.  En el panel Elements de abajo, haz clic en el elemento `h1` o `button` del árbol DOM.
2.  En el panel Styles de la derecha, modifica los valores de las propiedades en `element.style` (por ejemplo, cambia `color` a `red`).
3.  Observa cómo la página web virtual de arriba **cambia en tiempo real**.

<ClientOnly>
  <BrowserDevToolsLiveDemo />
</ClientOnly>

### 2.2 Desafío práctico: modificar el texto de una página real

Ahora que ya dominas la modificación de estilos, vamos a algo más emocionante: **¡modificar directamente la página que estás viendo ahora!**

1.  **Abre las DevTools reales**: Pulsa `F12` (o haz clic derecho en esta línea de texto -> selecciona "Inspeccionar").
2.  **Localiza el elemento**: En el panel Elements, verás una línea de código resaltada; ese es exactamente el texto en el que acabas de hacer clic.
3.  **Modifica el contenido**: **Haz doble clic** en la parte del texto en negro de esa línea de código, cámbialo por "**¡Soy un hacker!**" y pulsa Enter.
4.  **Comprueba el resultado**: ¡Mira! ¿Ha cambiado el texto de la página?

::: info 🤔 ¿Por qué desaparece al refrescar?
Puede que descubras que al refrescar la página, todos los cambios desaparecen y la página vuelve a su estado original.

Esto se debe a que los cambios de DevTools solo ocurren en la **memoria local de tu navegador**.

- Cuando visitas una página web, el navegador descarga el código HTML desde un **servidor remoto** y lo renderiza localmente.
- Solo estás modificando la **copia local**, sin permisos para modificar el **código fuente** en el servidor.
- Por eso, cada vez que refrescas, el navegador vuelve a obtener el código original (sin modificar) del servidor, y todo vuelve a la normalidad.
  :::

---

## 3. Explicación detallada de los paneles principales

### 3.1 Elements (Panel de elementos)

<ClientOnly>
  <DevToolsElementsDemo />
</ClientOnly>

**Función**: Ver y editar en tiempo real el HTML y CSS de la página.

- **Lado izquierdo (Árbol DOM)**: Muestra la estructura HTML de la página. Puedes hacer doble clic en etiquetas o texto para modificarlos, e incluso arrastrar nodos para cambiar su posición.
- **Lado derecho (Styles)**: Muestra los estilos CSS del elemento seleccionado. Puedes marcar/desmarcar estilos para ver los cambios, o modificar valores directamente (como colores, márgenes).
- **Escenarios de uso**:
  - "¿Por qué este botón no está alineado?" -> Inspeccionar los estilos CSS.
  - "Quiero probar si este título se ve mejor en rojo" -> Modificar directamente `color: red` en Styles.

### 3.2 Console (Panel de consola)

<ClientOnly>
  <DevToolsConsoleDemo />
</ClientOnly>

**Función**: Ver mensajes de registro y ejecutar código JavaScript.

- **Salida de registros**: Los mensajes de `console.log()`, las advertencias (amarillo) y los errores (rojo) durante la ejecución de la página se muestran aquí.
- **Entorno interactivo**: Puedes escribir cualquier código JS aquí y ejecutarlo inmediatamente. Por ejemplo, escribir `alert('Hello')` mostrará una alerta, y `document.body.style.background = 'red'` cambiará el fondo a rojo.
- **Escenarios de uso**:
  - "¿Por qué no pasa nada al hacer clic en el botón?" -> Comprobar si hay mensajes de error en rojo.
  - "Verificar el valor de retorno de una función JS" -> Ejecutarla directamente en la consola.

### 3.3 Network (Panel de red)

<ClientOnly>
  <DevToolsNetworkDemo />
</ClientOnly>

**Función**: Monitorear todas las solicitudes de red.

- **Vista de lista**: Muestra todos los recursos cargados (HTML, CSS, JS, imágenes, solicitudes de API).
- **Detalles interactivos**: Haz clic en cualquier fila de solicitud y se deslizará un panel de detalles a la derecha:
  - **Headers (Cabeceras)**: Ver las cabeceras de solicitud y respuesta (como `Content-Type`).
  - **Response (Respuesta)**: Ver los datos sin procesar devueltos por el servidor (JSON, código HTML, etc.).
  - **Preview (Vista previa)**: Previsualizar el contenido de la respuesta en un formato más legible.
- **Indicadores clave**:
  - **Status**: Código de estado (200 éxito, 404 no encontrado, 500 error del servidor).
  - **Type**: Tipo de recurso (fetch/xhr indica solicitud de API).
  - **Time**: Tiempo de carga.
- **Escenarios de uso**:
  - "¿La API está caída?" -> Ver si la solicitud muestra un 500 en rojo.
  - "¿Por qué la página tarda tanto en cargar?" -> Buscar qué imagen o archivo tarda más.

### 3.4 Sources (Panel de código fuente)

<ClientOnly>
  <DevToolsSourcesDemo />
</ClientOnly>

**Función**: Ver el código fuente y depurar JavaScript.

- **Depuración con puntos de interrupción**: Haz clic en el número de línea para establecer un "punto de interrupción (Breakpoint)". Cuando el código llega a esa línea, se **pausa**, permitiéndote ver los valores actuales de las variables y ejecutar el código paso a paso.
- **Escenarios de uso**:
  - "¿Dónde está el error en la lógica del código?" -> Establece un punto de interrupción, observa el código ejecutarse línea por línea, y verifica si los valores de las variables son los esperados.

### 3.5 Application (Panel de aplicación)

<ClientOnly>
  <DevToolsApplicationDemo />
</ClientOnly>

**Función**: Ver y gestionar el almacenamiento del navegador.

- **Storage**:
  - **Local Storage**: Datos de almacenamiento persistente.
  - **Session Storage**: Almacenamiento a nivel de sesión (se elimina al cerrar la pestaña).
  - **Cookies**: Pequeños datos de texto usados para autenticación, etc.
- **Escenarios de uso**:
  - "Borrar el estado de inicio de sesión" -> Eliminar las Cookies o el token en Local Storage.
  - "Ver los datos en caché" -> Inspeccionar qué hay almacenado en Local Storage.

---

## 4. Consejos prácticos

1.  **Depuración en modo móvil**: Haz clic en el "icono del teléfono" 📱 en la esquina superior izquierda de DevTools para simular el tamaño de pantalla de diferentes modelos de teléfono (iPhone, Pixel, etc.) y probar la respuesta de la página.
2.  **Forzar estados**: En el panel Elements, haz clic derecho en un elemento, selecciona `Force state` -> `:hover`, para forzar que el elemento mantenga su estado de hover, facilitando la depuración de los estilos al pasar el ratón.
3.  **Captura de pantalla de un nodo**: Selecciona un nodo en el panel Elements, pulsa `Ctrl + Shift + P` (Mac: `Cmd + Shift + P`) para abrir el menú de comandos, escribe `screenshot`, selecciona `Capture node screenshot`, y podrás guardar una captura de pantalla de ese nodo DOM como imagen.

::: warning ⚠️ Nota
Todas las modificaciones en DevTools (HTML, CSS, JS) son **temporales** y solo afectan a la página actual del navegador. Al refrescar la página, se perderán todos los cambios. Para que sean permanentes, debes modificar tus archivos de código fuente.
:::
