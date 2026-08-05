# Introducción a la línea de comandos y scripts de Shell
> 💡 **Guía de aprendizaje**: Este capítulo está diseñado para ofrecer a los lectores sin conocimientos previos una comprensión sistemática de cómo funciona la terminal. No necesitas tener formación en informática; a través de demostraciones interactivas, analizaremos el funcionamiento de la terminal de forma gradual.

## 0. Inicio rápido: Enfoque para abrir la terminal

Antes de empezar a aprender, primero tienes que encontrarla. La terminal viene "de fábrica" en todos los sistemas operativos; no necesitas instalar ningún software para usarla.

::: info 🖥️ Cómo abrirla en diferentes sistemas

** macOS (Mac)**

1.  Pulsa `Command (⌘) + Space` para abrir la búsqueda Spotlight.
2.  Escribe `Terminal`.
3.  Pulsa Enter y verás una ventana con fondo blanco y texto negro (o fondo negro con texto blanco).

**🪟 Windows**

- **Método 1 (CMD)**: Pulsa `Win + R`, escribe `cmd` y pulsa Enter. Es la línea de comandos más antigua.
- **Método 2 (PowerShell)**: Pulsa `Win + R`, escribe `powershell` y pulsa Enter. Es una terminal más moderna y potente.
- _Recomendación: Para operaciones cotidianas sencillas sirve cualquiera; para entornos de desarrollo se recomienda PowerShell o instalar WSL (Windows Subsystem for Linux)._

**🐧 Linux**

- Normalmente el atajo es `Ctrl + Alt + T`.
- O busca `Terminal` en el menú de aplicaciones.

:::

### 0.1 Práctica: Probemos primero (Hands-on Lab)

La práctica hace al maestro. Antes de entrar en la teoría aburrida, vamos a experimentar la sensación de "escribir comandos".

> 💡 **Consejo**: Por seguridad y comodidad, te recomendamos practicar en el **simulador web** que aparece abajo. Si te sientes seguro, también puedes abrir la terminal real de tu ordenador siguiendo las instrucciones del capítulo 0 y seguir los pasos (el resultado es el mismo).

En este ejercicio aprenderás a:

1.  **Ver archivos**: Usar `ls` o `dir` para ver qué hay en el directorio actual.
2.  **Crear y entrar**: Usar `mkdir` para crear una nueva carpeta y `cd` para entrar en ella como si fuera un portal.
3.  **Crear archivos**: Usar un comando para crear rápidamente un archivo nuevo.
4.  **Instalar software**: Experimentar la satisfacción de instalar una librería de Python o software del sistema con una sola línea.
5.  **Eliminar y limpiar**: Aprender a borrar archivos que ya no necesitas (¡úsalos con cuidado!).
6.  **Pedir ayuda a la IA**: ¡Esto es lo más importante! Cuando olvides un comando, aprende a preguntar a la IA: "¿Cómo se borra un archivo en Mac?", y te dará la respuesta directamente.

_Selecciona abajo el sistema operativo que sueles usar y sigue las instrucciones para empezar:_

<TerminalHandsOn />

### 0.2 Motivación de dejar el ratón (Why CLI)

Puede que te preguntes: _"Si las interfaces gráficas (GUI) son tan fáciles de usar y basta con hacer clic, ¿por qué molestarse en escribir comandos complicados en una ventana con fondo negro?"_

No es para "parecer un geek", sino porque en situaciones específicas, **el lenguaje (comandos) es más potente que los gestos (ratón)**.

#### 1. El ratón no puede expresar fácilmente "lotes" ni "lógica"

- **GUI (ratón)**: Ideal para "hacer clic en lo que ves". Si quieres eliminar una foto, clic derecho y borrar es rápido. Pero si quieres "eliminar todas las fotos tomadas en 2023, de más de 5 MB y en formato PNG", el ratón no puede hacerlo; probablemente necesites filtrar manualmente durante mucho tiempo.
- **CLI (comandos)**: Ideal para "describir lo que quieres hacer". El requisito anterior se resuelve con una sola línea de comando; el ordenador buscará automáticamente los archivos que cumplan las condiciones y los procesará, aunque haya 10 000.

#### 2. Los comandos se pueden grabar y reutilizar

- **GUI**: Configuras un entorno haciendo clic en decenas de menús. Cuando cambias de ordenador, tienes que volver a hacerlo de memoria, y es fácil olvidar pasos.
- **CLI**: Puedes escribir todos los comandos en un archivo (script). La próxima vez solo tienes que ejecutar ese archivo y el ordenador reproducirá tus operaciones con **cero errores**. Esta es la base de la "automatización".

#### 3. La única opción para el control remoto

- **GUI**: Transmitir imágenes es como ver un vídeo en alta definición; necesita una conexión muy rápida. Si la red va un poco lenta, el ratón se atasca y es imposible operar.
- **CLI**: Solo transmite texto puro, unas pocas decenas de caracteres. Incluso si estás en una zona con muy mala señal, podrás controlar con fluidez un servidor en un centro de datos al otro lado del mundo.

**En resumen**: La GUI es ideal para **explorar** (navegar por la web, ver imágenes); la CLI es ideal para **producir** (desarrollo, operaciones, procesamiento por lotes). Como desarrolladores, usamos la terminal porque es **más precisa, más controlable y más eficiente**.

## 1. Definición de conceptos: Introducción a terminal (Definition)

_Las terminales se ven distintas en cada sistema operativo y los comandos también son diferentes. Haz clic en los botones de abajo para alternar y observa cómo macOS, Windows y Linux usan comandos distintos (como `dir` vs `ls`) para hacer lo mismo:_

<TerminalOSDemo />

Antes de que se popularizaran las interfaces gráficas de usuario (GUI), la terminal era la principal forma de interacción entre los humanos y los ordenadores. Incluso hoy, sigue siendo la herramienta más precisa y eficiente con la que los desarrolladores controlan el ordenador.

<TerminalDefinition />

En esencia, la terminal es un **entorno de entrada/salida de flujo de caracteres**:

- **Entrada**: Envía instrucciones (señales de caracteres) a través del teclado.
- **Salida**: Muestra retroalimentación en texto a través de una cuadrícula en pantalla.

No procesa gráficos complejos, imágenes ni vídeos, sino que se centra en la **interacción de información textual**.

## 2. Arquitectura central: el arte de la separación (The Big Picture)

Antes de profundizar, piensa en esto: **¿La ventana de la terminal realmente entiende lo que le dices?**

En realidad, la terminal es como un **monitor que solo transmite mensajes**. Cuando escribes el comando `date`, la terminal no sabe que significa "ver la fecha"; simplemente empaqueta esas 4 letras y se las envía al verdadero jefe entre bastidores: el **Shell**.

El Shell es el "cerebro" que entiende lo que dices y da instrucciones al ordenador para que trabaje.

Para entender cómo colaboran, veamos estos tres "trabajadores" con roles bien definidos. La mejor analogía para entender su relación es la de un **navegador** y un **servidor web**.

### 2.1 Distribución de roles

- **🖥️ Terminal —— Como el "navegador"**
  - **Responsabilidad**: Solo se encarga de la **entrada** (transmitir tus pulsaciones de tecla al otro lado) y la **visualización** (dibujar en pantalla los caracteres que recibe de vuelta).
  - **Característica**: No tiene **ninguna inteligencia** propia; no sabe qué es `ls` o `cd`. Es como Chrome: tanto si visitas Baidu como Google, solo renderiza la página.
  - _Terminales comunes_: CMD/PowerShell de Windows, Terminal.app de macOS, la terminal integrada de VS Code.

- **🧠 Shell —— Como el "servidor web"**
  - **Responsabilidad**: Es el cerebro con lógica. Se ejecuta en segundo plano; **recibe** la cadena de comandos que le envías, **analiza** su significado y luego **da instrucciones** al sistema operativo.
  - **Característica**: Es invisible e intocable; solo se comunica con el exterior mediante flujos de texto.
  - _Shells comunes_: Bash, Zsh, Fish, PowerShell.

- **⚙️ Kernel —— El "administrador" entre bastidores**
  - **Responsabilidad**: El núcleo del sistema operativo; es el único que puede controlar directamente el hardware (leer/escribir discos, asignar memoria, controlar la CPU).
  - **Relación**: El Shell es el "secretario" del kernel, traduciéndole tu lenguaje humano.

### 2.2 Motivación de separados (Reemplazabilidad)

Como la **capa de visualización** (terminal) y la **capa de lógica** (Shell) están completamente separadas, se pueden combinar libremente:

- **Cambiar la "piel"**: En macOS puedes usar Terminal, descargar iTerm2 o usar la terminal de VS Code. Tienen distinto aspecto, pero se conectan al mismo Shell (zsh), así que los comandos son idénticos.
- **Cambiar el "cerebro"**: En la misma ventana de terminal puedes cambiar de bash a zsh, o entrar en el entorno interactivo de Python. La terminal no cambia, pero la lógica que procesa los comandos sí.

### 2.3 Flujo de interacción: la tecla que desaparece

Puede que pienses: _"Cuando pulso 'a' en el teclado, la terminal dibuja una 'a' en la pantalla."_
**¡Incorrecto!** El proceso real es el siguiente (esto se llama **eco o Echo**):

1.  **Pulsar 'a'**: La señal del teclado llega a la terminal.
2.  **Enviar la señal**: La terminal envía el código de 'a' al Shell.
3.  **Procesamiento del Shell**: El Shell recibe 'a', ve que no hay problema y envía de vuelta la 'a' tal cual a la terminal.
4.  **Mostrar el carácter**: La terminal recibe la 'a' devuelta por el Shell y solo entonces la dibuja en pantalla.

> 💡 **Experimento**: Algunos comandos (como al escribir una contraseña) desactivan la función de eco del Shell. En ese caso pulsas teclas, la terminal las envía al Shell, pero este **no devuelve nada**, así que la pantalla permanece en blanco. Esto es para proteger la privacidad.

**Resumen del proceso en una frase**:
Escribes en la terminal ➡️ la señal va al Shell ➡️ el Shell la devuelve tal cual (ves los caracteres) y los interpreta ➡️ el Shell da instrucciones al kernel para que actúe.

_La siguiente demostración muestra este proceso; observa el "muro" entre el Shell y el kernel, y cómo los caracteres van y vienen:_

<ArchitectureDemo />

## 3. Modelo visual: el sistema de cuadrícula (The Grid System)

A diferencia de las interfaces gráficas modernas que usan "píxeles", la base de visualización de la terminal es una **cuadrícula de caracteres (Character Grid)**.
La pantalla de la terminal se divide en filas y columnas; cada casilla se llama **celda (Cell)**.

### 3.1 Composición de una celda

Cada celda es la unidad mínima de visualización de la terminal y contiene dos tipos de información clave:

1.  **Glifo (Glyph)**: El texto que se muestra realmente (como `A`, `ñ`, `$`).
2.  **Atributos (Attributes)**: El estilo del carácter (como color de primer plano, color de fondo, negrita, subrayado).

Cuando arrastras la ventana de la terminal para cambiar su tamaño, lo que estás cambiando en esencia es el número de **filas (Rows)** y **columnas (Columns)** de esta cuadrícula.

_Prueba a operar en el área interactiva de abajo y observa cómo la cuadrícula contiene los caracteres:_

<TerminalGrid />

### 3.2 Inspección de estilos

La terminal no puede mostrar imágenes; todas las "interfaces" se crean combinando colores y estilos de caracteres.

_Haz clic en las celdas de abajo para ver los atributos de estilo que hay detrás de cada casilla:_

<CellInspector />

## 4. Protocolo de comunicación: secuencias de escape (Escape Sequences)

Puede que te preguntes: si la terminal solo transmite texto, ¿cómo se logran los caracteres de colores, el movimiento del cursor o el borrado de pantalla?

La respuesta son las **secuencias de escape (Escape Sequences)**.
Son una cadena de instrucciones de caracteres especiales (normalmente empiezan con el carácter `ESC`). Cuando la terminal recibe estos caracteres, **no los muestra en pantalla**, sino que los interpreta como **instrucciones de control**.

Por ejemplo:

- El carácter normal `A` → dibuja una A en pantalla.
- La secuencia `\033[31m` → **instrucción**: cambiar el color del texto siguiente a rojo.
- La secuencia `\033[2J` → **instrucción**: borrar la pantalla.

Es como si acordaras con un amigo: si hablo normalmente, lo apuntas; si levanto la mano izquierda (equivalente a `ESC`), lo que viene después es una orden, no contenido.

_Haz clic en el botón "Reproducir" de abajo y observa cómo la terminal procesa el flujo de caracteres uno por uno e identifica las instrucciones ocultas:_

<EscapeParserDemo />

_El siguiente componente muestra más tipos de secuencias de escape y sus efectos de renderizado:_

<EscapeSequences />

## 5. Mecanismo de entrada: flujo de bytes (Input as Byte Stream)

El proceso de entrada suele malinterpretarse. Cuando pulsas una tecla, la terminal no "dibuja" directamente el carácter en pantalla, sino que realiza una **transmisión codificada**.

1.  **Captura de la tecla**: La terminal captura tu pulsación física.
2.  **Conversión de codificación**: Convierte la tecla en una **secuencia de bytes** específica.
    - Pulsar `a` → envía el byte `a`.
    - Pulsar `flecha arriba` → envía la secuencia `^[[A`.
3.  **Envío**: Envía el flujo de bytes al Shell o al programa en ejecución.

**Punto clave**: Todas las teclas (incluidas las teclas de función y los clics del ratón) son **datos de bytes** a nivel de transmisión.

_Prueba a pulsar teclas abajo y observa cómo tu entrada se convierte en datos de bajo nivel:_

<InputVisualizer />

## 6. Modos de ejecución: máquina de escribir vs videoconsola (Cooked vs. Raw Mode)

La terminal tiene dos personalidades completamente distintas. Si entiendes esto, comprenderás por qué **escribir comandos** y **jugar al Snake** en la terminal son experiencias totalmente diferentes.

- **Modo procesado (Cooked Mode) —— Como una máquina de escribir**
  - Es el modo predeterminado.
  - **Comportamiento**: Los caracteres que escribes son **retenidos temporalmente** por la terminal hasta que pulsas Enter.
  - **Ventaja**: Te da la oportunidad de corregir. ¿Te equivocaste? Pulsa Retroceso (Backspace) para borrar y reescribir; el programa nunca sabrá que te equivocaste.
  - _Escenario: escribir comandos habitualmente (como `ls`, `cd`)._

- **Modo crudo (Raw Mode) —— Como un mando de videojuegos**
  - Es el modo "avanzado".
  - **Comportamiento**: Cada tecla que pulsas (incluidas las flechas y combinaciones con Ctrl) se envía **instantáneamente** al programa, sin búfer.
  - **Ventaja**: El programa puede responder a tus acciones en tiempo real.
  - _Escenario: juegos de terminal (como el Snake), usar el editor Vim (un editor que se maneja solo con teclado)._

_Haz clic en los botones de abajo para alternar entre modos y experimentar la diferencia de tacto entre "escribir una carta" y "jugar un videojuego":_

<CookedRawDemo />

## 7. Control de procesos: señales (Signals)

En la terminal, pulsar `Ctrl+C` normalmente detiene un programa. Esto no se logra enviando un carácter, sino activando una **señal (Signal)**.

Las señales son un mecanismo de notificación a nivel del sistema operativo que informa al programa de que ha ocurrido un evento específico.

- **Ctrl+C** → envía `SIGINT` (Interrupt): notifica al programa "por favor, interrumpe la operación actual".
- **Ctrl+Z** → envía `SIGTSTP` (Suspend): notifica al programa "por favor, suspende y pasa a segundo plano".

Este mecanismo omite el canal estándar de entrada de datos, asegurando que el usuario mantenga el control incluso cuando el programa se bloquea.

<SignalsDemo />

## 8. Aplicaciones avanzadas: interfaz a pantalla completa y búferes (Buffers & TUI)

¿Has notado que cuando usas `vim` para editar un archivo o `htop` para ver el estado del sistema, ocupan toda la pantalla? Y cuando los cierras, la pantalla vuelve instantáneamente a su estado anterior, con el historial de comandos intacto.

Esto se debe a que la terminal tiene dos "lienzos" que van alternando:

- **Búfer principal (Primary Buffer)**: Como un **bloc de borrador**.
  - Escribes una línea, el sistema responde otra.
  - Cuando se llena, pasas la página (scroll); lo escrito antes sigue ahí.
  - _Uso: escribir comandos habitualmente._

- **Búfer alternativo (Alternate Buffer)**: Como una **pizarra**.
  - El programa limpia la pizarra y dibuja en ella (pantalla completa).
  - Pase lo que pase, no afecta a tu bloc de borrador sobre la mesa.
  - Cuando sales del programa, es como si retiraras la pizarra y volvieras a tener el bloc de borrador delante.
  - _Uso: Vim, Nano, juegos y otros programas a pantalla completa._

_Haz clic en el botón de abajo para experimentar cómo se alternan instantáneamente el "bloc de borrador" y la "pizarra":_

<BufferSwitchDemo />

---

## 9. Resumen (Summary)

La terminal no es una caja negra misteriosa; es una interfaz estandarizada de interacción textual.

- **Visualización**: Basada en cuadrículas y caracteres.
- **Control**: Basado en secuencias de escape.
- **Interacción**: Basada en flujos de entrada/salida y señales.

Al entender estos principios subyacentes, ya no solo memorizarás comandos, sino que realmente comprenderás la lógica que hay detrás de cada pulsación de tecla.

## Apéndice: Glosario de términos (Vocabulary)

| Término              | Inglés                   | Explicación                                               |
| :---------------- | :--------------------- | :------------------------------------------------- |
| **Terminal**          | Terminal               | Programa de ventana responsable de la visualización y la entrada (frontend).                 |
| **Shell**         | Shell                  | Programa responsable de analizar comandos y ejecutar la lógica (backend).             |
| **CLI**           | Command Line Interface | Interfaz de línea de comandos, un método de interacción basado en texto.               |
| **TUI**           | Text User Interface    | Interfaz de usuario textual, se refiere a una pseudo-interfaz gráfica construida con caracteres en la terminal. |
| **Secuencia de escape**      | Escape Sequence        | Instrucciones de caracteres especiales utilizadas para controlar el cursor, los colores, etc., de la terminal.         |
| **Entrada/Salida estándar** | Stdin/Stdout           | Canales estándar por los que los programas reciben y emiten datos.                 |

## Referencias (Reference)

- [How Terminals Work](https://how-terminals-work.vercel.app/): La estructura y las demostraciones de este artículo están profundamente inspiradas en este proyecto. Si deseas profundizar en los detalles de implementación técnica, te recomendamos encarecidamente que leas el tutorial original.
