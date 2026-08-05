# Panorama del sistema informático: desde el arranque hasta la visita web

::: tip Prólogo
¿Alguna vez te has preguntado qué ocurre exactamente entre el momento en que presionas el botón de encendido de tu ordenador y el instante en que ves una página web en el navegador?

Este proceso es como una **carrera de relevos**: la corriente eléctrica despierta el hardware, el firmware toma el control tras verificar los componentes, cede el testigo al sistema operativo que prepara el entorno, el cual a su vez ejecuta el navegador, y finalmente el navegador viaja a través de la red hasta un servidor remoto para traer la página web. Cada eslabón **depende del éxito del eslabón anterior**; si un solo testigo se cae, los pasos siguientes no pueden continuar.

Comprender esta cadena completa te ayudará a construir una visión integral de los sistemas informáticos, y es un camino obligado para convertirte en ingeniero full-stack.
:::

**¿Qué aprenderás?**

Este artículo sigue el orden real de los acontecimientos y te guía a través de las cinco etapas que van desde presionar el botón de encendido hasta ver la página web:

1. **Arranque del hardware** (sección 1) → Cómo la corriente eléctrica despierta la CPU
2. **Autocomprobación del firmware** (sección 2) → Cómo la BIOS/UEFI verifica el hardware y localiza el dispositivo de arranque
3. **Arranque del sistema operativo** (sección 3) → Cómo se carga el kernel y aparece el escritorio
4. **Inicio del navegador** (sección 4) → Cómo el sistema operativo ejecuta una aplicación
5. **Petición de red** (sección 5) → El viaje completo desde que introduces una URL hasta que la página se renderiza

Cada paso se construye sobre el anterior; ninguno puede faltar.

---

## 1. Presionar el botón de encendido: el despertar del hardware

### 1.1 Arranque de la fuente de alimentación

Cuando presionas el botón de encendido, la **fuente de alimentación (PSU)** comienza a funcionar, convirtiendo la corriente alterna (220 V) en corriente continua (12 V, 5 V, 3,3 V, etc.) para suministrar energía a cada componente de hardware.

```
Botón de encendido → Fuente de alimentación (PSU) → Salida de CC → Alimentación de los componentes de la placa base
```

### 1.2 Activación del chipset de la placa base

Una vez estabilizada la alimentación, el **chipset de la placa base** entra en funcionamiento. Actúa como el "coordinador general" del ordenador, encargado de orquestar todos los componentes de hardware.

### 1.3 Reinicio de la CPU

Al recibir la señal de reset, la CPU pone a cero todos sus registros internos y memorias caché, y comienza a ejecutar instrucciones desde una dirección predefinida. Esta dirección suele apuntar al chip de la **BIOS/UEFI**.

<PowerOnDemo />

---

> **Primer testigo entregado** ⛳ Hasta aquí, el trabajo a nivel de hardware está completo: la fuente de alimentación ha convertido la CA en CC estable, el chipset de la placa base se ha activado y coordina los componentes, y la CPU ha completado el reset, ha vaciado sus registros y está lista para ejecutar su primera instrucción.
>
> Pero ojo: en este momento la CPU es como un "bebé que acaba de abrir los ojos". Sabe ejecutar instrucciones, pero no tiene ni idea del entorno que la rodea: ¿cuánta memoria tiene el ordenador? ¿Funciona la tarjeta gráfica? ¿Dónde está el disco duro? ¿Desde qué dispositivo debe arrancar el sistema operativo? La CPU no puede responder a estas preguntas por sí sola.
>
> Por eso, la primera instrucción que ejecuta la CPU tras el reset es saltar a una **dirección de memoria fija**, que apunta al chip de firmware BIOS/UEFI soldado en la placa base. A partir de este momento, el control pasa del hardware puro al firmware. La misión de la BIOS/UEFI es clara: **comprobar que todo el hardware funciona correctamente, luego encontrar el sistema operativo y arrancarlo**. Este es el segundo testigo de la carrera de relevos.

## 2. BIOS/UEFI: la autocomprobación del hardware

<BiosUefiInteractiveDemo />

---

> **Segundo testigo entregado** ⛳ La BIOS/UEFI ha cumplido sus tres misiones: mediante la POST ha confirmado que la memoria, la tarjeta gráfica, el teclado y demás hardware funcionan correctamente; ha inicializado el modo de funcionamiento de cada componente; y ha localizado el sector de arranque en el disco duro siguiendo el orden de arranque.
>
> Pero el papel de la BIOS/UEFI termina aquí: en esencia es un "médico de revisión + coordinador". Sabe diagnosticar si el hardware está sano y decidir desde qué dispositivo arrancar, pero no sabe gestionar tus archivos, ni ejecutar tus aplicaciones, ni mostrarte un escritorio atractivo. Esas tareas complejas requieren que tome el control un software más potente: el **sistema operativo**.
>
> La entrega del testigo es muy concreta: la BIOS/UEFI lee el código del gestor de arranque almacenado en el primer sector del disco duro (el sector de arranque), lo carga en memoria y hace que la CPU salte a ese código para ejecutarlo. Desde ese instante, el control pasa oficialmente del firmware al gestor de arranque del sistema operativo. El gestor de arranque cargará paso a paso el kernel del sistema operativo, iniciará los servicios del sistema y finalmente mostrará el escritorio que te resulta familiar. Comienza la etapa más compleja de toda esta cadena.

## 3. Arranque del sistema operativo: del kernel al escritorio

<OSBootInteractiveDemo />

---

> **Tercer testigo entregado** ⛳ El sistema operativo se ha iniciado por completo y el escritorio aparece ante tus ojos. Recapitulemos lo que ha hecho esta etapa: el gestor de arranque leyó el kernel desde el disco duro, el kernel tomó el control de la CPU y la memoria, los servicios del sistema se iniciaron uno tras otro (red, audio, centro de seguridad…) y, por último, la interfaz gráfica renderizó el escritorio.
>
> En este momento, el sistema operativo es como un edificio con agua, electricidad y servicios de administración ya operativos: la **gestión de procesos** se encarga de asignar un espacio a cada "inquilino" (programa), la **gestión de memoria** reparte el espacio disponible, el **sistema de archivos** administra los almacenes y la **pila de protocolos de red** se ocupa de las comunicaciones con el exterior. Estos "servicios públicos" son la infraestructura básica sobre la que se ejecutan todas las aplicaciones; sin ellos, ningún programa podría iniciarse.
>
> Ahora quieres navegar por internet, así que haces doble clic en el icono del navegador en el escritorio. Detrás de esta sencilla acción, el sistema operativo realiza una serie de tareas: busca dónde está el archivo ejecutable del navegador en el disco duro, crea un proceso independiente para él, le asigna espacio de memoria, carga el código del programa… Esta es la manifestación directa de la capacidad de "gestión de procesos" del sistema operativo. A continuación, veamos cómo se inicia el navegador.

## 4. Abrir el navegador: el inicio de una aplicación

### 4.1 El proceso de inicio de una aplicación

Cuando haces doble clic en el icono del navegador, el sistema operativo realiza lo siguiente:

1. **Buscar el archivo ejecutable**: según la asociación de archivos, localiza el `.exe` (Windows) o el archivo ejecutable del navegador
2. **Crear un proceso**: crea un nuevo **proceso** para el navegador
3. **Cargar el programa**: carga el código del navegador desde el disco duro a la memoria
4. **Inicializar**: arranca el hilo principal del navegador, el motor de renderizado, el motor de red, etc.

```
Proceso de inicio del navegador:
┌─────────────────────────────────────┐
│  1. Doble clic en el icono          │
│  2. El SO busca el ejecutable       │
│  3. Crea el proceso del navegador   │
│  4. Carga el código en memoria      │
│  5. Inicializa los módulos          │
│     (renderizado, red, JS)          │
│  6. Muestra la ventana del navegador│
└─────────────────────────────────────┘
```

### 4.2 Componentes principales del navegador

Un navegador moderno es un "sistema operativo" complejo formado principalmente por estos componentes:

| Módulo | Función |
|-----|------|
| **Interfaz de usuario** | Barra de direcciones, pestañas, marcadores, etc. |
| **Motor del navegador** | Coordina la UI y el motor de renderizado |
| **Motor de renderizado** | Analiza HTML/CSS y muestra la página web |
| **Motor de JavaScript** | Ejecuta código JavaScript |
| **Módulo de red** | Envía peticiones HTTP |
| **Backend de UI** | Dibuja los componentes básicos de la interfaz |
| **Almacenamiento de datos** | Cookies, LocalStorage, etc. |

<BrowserArchitectureDemo />

---

> **Cuarto testigo entregado** ⛳ El navegador se ha iniciado correctamente. El sistema operativo ha creado un proceso independiente para él, le ha asignado espacio de memoria y los distintos módulos del navegador ya están inicializados: el motor de renderizado está listo para analizar HTML/CSS, el motor de JavaScript preparado para ejecutar scripts y el módulo de red dispuesto para enviar y recibir datos.
>
> Puedes imaginar el navegador en este momento como un coche ya encendido: el motor está en marcha, el panel de instrumentos iluminado y el sistema de navegación listo, pero el coche sigue parado porque el conductor (tú) todavía no le ha dicho "a dónde ir". La ventana del navegador está en blanco y el cursor parpadea en la barra de direcciones, esperando tu entrada.
>
> Cuando escribes `https://www.example.com` en la barra de direcciones y pulsas Enter, comienza un viaje que atraviesa todo internet. El módulo de red del navegador se encarga de esta petición: primero analiza la estructura de la URL, luego traduce el nombre de dominio a una dirección IP mediante DNS, después establece una conexión TCP con el servidor remoto a través de la red, negocia un canal cifrado, envía la petición HTTP, espera la respuesta del servidor y, por último, entrega el código HTML/CSS/JS recibido al motor de renderizado para que lo convierta en la página web que ves. Esta es la etapa con más pasos y la que involucra los protocolos más diversos de toda la cadena de relevos, y también la que más necesita comprender un desarrollador web.

## 5. Visitar una URL: el proceso completo de una petición de red

### 5.1 Visión general de URL

Una **URL (Uniform Resource Locator)** es la dirección de un recurso; igual que una dirección postal en la vida real, sirve para localizar recursos en internet.

```
Estructura de una URL:
┌─────────────────────────────────────────────────────────┐
│  https://  │  www.example.com  │  /path/to/page  │ ?query=1 │
│  Protocolo │      Dominio      │      Ruta       │ Consulta │
└─────────────────────────────────────────────────────────┘
```

- **Protocolo (Protocol)**: el método de acceso (http, https, ftp, etc.)
- **Dominio (Domain)**: la dirección del servidor
- **Ruta (Path)**: la ubicación del recurso en el servidor
- **Consulta (Query)**: parámetros adicionales

### 5.2 El proceso completo al visitar una URL

Cuando visitas `https://www.example.com`, ocurre lo siguiente:

<URLRequestDemo />

#### Primer paso: análisis de la URL

El navegador primero **analiza la URL** y extrae el protocolo, el dominio, la ruta y demás información.

```
Proceso de análisis de la URL:
https://www.example.com/index.html
  ↓
Protocolo: https
Dominio: www.example.com
Ruta: /index.html
```

#### Segundo paso: resolución DNS

Los ordenadores acceden a los servidores a través de la red, pero la red usa **direcciones IP** (como 93.184.216.34) en lugar de nombres de dominio. Por eso es necesario convertir el nombre de dominio en una dirección IP, un proceso llamado **resolución DNS**.

```
Flujo de resolución DNS:
┌─────────────────────────────────────────────────────────┐
│  Caché del navegador → Archivo hosts → Caché DNS local  │
│                    → Servidor DNS                       │
└─────────────────────────────────────────────────────────┘

Proceso real:
1. El navegador comprueba su caché (¿se ha visitado recientemente?)
2. El sistema operativo comprueba la caché DNS
3. Se envía una consulta al servidor DNS
4. El servidor DNS devuelve la dirección IP
```

#### Tercer paso: establecer la conexión TCP

Una vez obtenida la dirección IP, el navegador debe establecer una **conexión TCP** con el servidor. TCP es un protocolo de la capa de transporte que garantiza una transmisión de datos fiable.

```
Apretón de manos de tres vías TCP (Three-Way Handshake):
┌─────────────────────────────────────────────────────────┐
│  Cliente → Servidor: SYN (petición de sincronización)   │
│  Servidor → Cliente: SYN-ACK (confirmación y sinc.)     │
│  Cliente → Servidor: ACK (confirmación)                 │
│                        ↓                                │
│  ¡Conexión establecida!                                 │
└─────────────────────────────────────────────────────────┘
```

Si se trata de **HTTPS**, también es necesario realizar el **handshake TLS/SSL** para establecer un canal cifrado.

#### Cuarto paso: enviar la petición HTTP

Una vez establecida la conexión, el navegador envía una **petición HTTP** al servidor:

```
Formato de petición HTTP:
┌─────────────────────────────────────────────────────────┐
│  GET /index.html HTTP/1.1                              │
│  Host: www.example.com                                 │
│  User-Agent: Mozilla/5.0...                             │
│  Accept: text/html                                     │
│                                                         │
│  (línea en blanco)                                      │
└─────────────────────────────────────────────────────────┘
```

Métodos HTTP más comunes:

| Método | Significado | Uso |
|-----|------|-----|
| **GET** | Obtener un recurso | Navegar por páginas web |
| **POST** | Enviar datos | Iniciar sesión, enviar formularios |
| **PUT** | Subir un recurso | Subida de archivos |
| **DELETE** | Eliminar un recurso | Borrar datos |

#### Quinto paso: el servidor procesa la petición

Cuando el servidor (normalmente un **servidor web** como Nginx o Apache) recibe la petición:

1. **Analiza la petición**: comprende qué quiere el cliente
2. **Procesa la lógica de negocio**: llama al programa backend (Python, Node.js, Java…)
3. **Consulta la base de datos**: obtiene los datos necesarios
4. **Genera la respuesta**: ensambla los datos en formato HTML, JSON, etc.

```
Flujo de procesamiento en el servidor:
┌─────────────────────────────────────────────────────────┐
│  1. El servidor web recibe la petición (Nginx/Apache)  │
│  2. Encuentra el manejador según la ruta               │
│  3. Ejecuta el código backend (API, lógica de negocio) │
│  4. Si es necesario, consulta la base de datos         │
│  5. Ensambla la respuesta (HTML/JSON/CSS/JS)           │
│  6. Devuelve la respuesta HTTP                         │
└─────────────────────────────────────────────────────────┘
```

#### Sexto paso: el servidor devuelve la respuesta HTTP

El servidor devuelve una **respuesta HTTP** que contiene el código de estado, las cabeceras y el cuerpo de la respuesta:

```
Formato de respuesta HTTP:
┌─────────────────────────────────────────────────────────┐
│  HTTP/1.1 200 OK                                       │
│  Content-Type: text/html                               │
│  Content-Length: 1234                                  │
│                                                         │
│  <!DOCTYPE html>                                       │
│  <html>...</html>                                      │
└─────────────────────────────────────────────────────────┘
```

Códigos de estado más comunes:

| Código | Significado |
|-------|------|
| **200** | Éxito |
| **301/302** | Redirección |
| **404** | Recurso no encontrado |
| **500** | Error del servidor |

#### Séptimo paso: el navegador renderiza la página

Una vez recibida la respuesta, el navegador comienza a **renderizar la página**:

<RenderingDemo />

1. **Analizar el HTML**: construir el árbol DOM
2. **Analizar el CSS**: calcular los estilos y construir el árbol de renderizado
3. **Ejecutar JavaScript**: ejecutar el código JS de la página
4. **Pintar la página**: mostrar el contenido en la pantalla

```
Proceso de renderizado del navegador:
┌─────────────────────────────────────────────────────────┐
│  1. Análisis de HTML → Árbol DOM                      │
│  2. Análisis de CSS → Reglas de estilo                │
│  3. DOM + CSS → Árbol de renderizado                  │
│  4. Cálculo de layout → Tamaño y posición de cada      │
│     elemento                                           │
│  5. Pintado → Píxeles mostrados en pantalla           │
│  6. Composición → Fusión de capas para la visualización│
└─────────────────────────────────────────────────────────┘
```

---

> **Último testigo entregado** ⛳ ¡La página web por fin aparece ante tus ojos! Recapitulemos los numerosos pasos de esta última etapa: el navegador analizó la URL y extrajo el protocolo y el dominio; mediante DNS y tras varias consultas en cadena, tradujo el nombre de dominio a una dirección IP; a través del three-way handshake de TCP estableció una conexión fiable con el servidor; luego negoció un canal cifrado mediante el handshake TLS; envió la petición HTTP; el servidor procesó la lógica de negocio, consultó la base de datos, ensambló los datos de respuesta y los devolvió; y finalmente el motor de renderizado del navegador analizó el HTML para construir el árbol DOM, calculó las reglas de estilo a partir del CSS, fusionó ambos en el árbol de renderizado, calculó el layout y pintó píxel a píxel en la pantalla.
>
> Ahora alejemos la perspectiva y contemplemos esta carrera de relevos en su totalidad. Desde el instante en que se presiona el botón de encendido: la corriente despierta el hardware (1.ᵉʳ testigo) → el firmware comprueba los dispositivos y encuentra el disco de arranque (2.º testigo) → el sistema operativo arranca por completo, desde el kernel hasta el escritorio (3.ᵉʳ testigo) → el sistema operativo ejecuta el navegador como una aplicación más (4.º testigo) → la petición de red atraviesa internet, recupera los datos y los renderiza en la página (5.º testigo). Cinco testigos encadenados, cada uno construido sobre los logros del anterior; si falta un solo eslabón, no podrías ver esta página web.
>
> A continuación, veamos un diagrama de flujo completo que encadena estas cinco etapas y muestra de forma visual las dependencias entre ellas.

## 6. Repaso del flujo completo

Encadenemos todo el proceso:

<FullProcessDemo />

```
Flujo completo desde presionar el botón de encendido hasta visitar un sitio web:

┌──────────────────────────────────────────────────────────────────┐
│  1. Presionar el botón de encendido                               │
│     └── Arranque de la fuente → Activación de la placa base      │
│         → Reset de la CPU → Ejecución de la BIOS/UEFI            │
├──────────────────────────────────────────────────────────────────┤
│  2. Arranque de la BIOS/UEFI                                     │
│     └── Autocomprobación del hardware → Búsqueda del dispositivo │
│         de arranque → Lectura del gestor de arranque             │
├──────────────────────────────────────────────────────────────────┤
│  3. Arranque del sistema operativo                               │
│     └── Gestor de arranque → Carga del kernel → Inicio de        │
│         servicios → Visualización del escritorio                 │
├──────────────────────────────────────────────────────────────────┤
│  4. Abrir el navegador                                           │
│     └── Doble clic en el icono → Creación del proceso → Carga    │
│         del programa → Visualización de la ventana               │
├──────────────────────────────────────────────────────────────────┤
│  5. Visitar la URL                                               │
│     └── Análisis de la URL → Resolución DNS → Conexión TCP →    │
│         Petición HTTP → Procesamiento en el servidor →           │
│         Respuesta HTTP → Renderizado en el navegador →           │
│         Visualización de la página web                            │
└──────────────────────────────────────────────────────────────────┘
```

---

> Al observar la cadena completa, descubrirás un patrón interesante: cada etapa resuelve problemas completamente distintos y las áreas técnicas involucradas también son radicalmente diferentes. El 1.ᵉʳ testigo pertenece al ámbito de la **ingeniería electrónica**: conversión de potencia, diseño de circuitos, transmisión de señales. El 2.º testigo corresponde a la **programación de firmware**: manipular directamente el hardware con código de bajo nivel. El 3.ᵉʳ testigo es el mundo de los **sistemas operativos**: planificación de procesos, gestión de memoria, sistemas de archivos; el núcleo temático de las ciencias de la computación. El 4.º testigo implica el **desarrollo de aplicaciones**: cómo diseñar la arquitectura de un software tan complejo como un navegador. El 5.º testigo abarca las **redes de ordenadores** y el **desarrollo frontend**: desde los protocolos de red como DNS, TCP/IP y HTTP, hasta el análisis y renderizado de HTML/CSS/JS.
>
> Esto también explica por qué un "ingeniero full-stack" necesita un amplio abanico de conocimientos: cada línea de código frontend que escribes recorre finalmente toda esta cadena antes de presentarse al usuario. Comprender cada eslabón de la cadena te ayuda a localizar rápidamente los problemas cuando surgen: ¿es un fallo en la capa de red? ¿un problema del servidor? ¿o un problema de renderizado del navegador?
>
> El siguiente mapa de conocimiento organiza estas áreas técnicas y te señala la dirección para tus próximos aprendizajes.

## 7. Mapa de conocimiento

Áreas de conocimiento que abarca este capítulo:

```
Visión general del sistema informático
├── Fundamentos de hardware
│   ├── Fuente de alimentación (PSU)
│   ├── Chipset de la placa base
│   └── CPU
├── BIOS/UEFI
│   ├── POST (Power-On Self-Test)
│   ├── Orden de arranque
│   └── Gestor de arranque
├── Sistema operativo
│   ├── Kernel
│   ├── Servicios del sistema
│   └── Entorno de escritorio
├── Aplicaciones
│   ├── Gestión de procesos
│   └── Carga de programas
└── Comunicación de red
    ├── Resolución DNS
    ├── Protocolo TCP/IP
    ├── Protocolo HTTP
    └── Renderizado del navegador
```

::: tip Seguir aprendiendo
Si quieres profundizar en algún aspecto concreto, puedes continuar con:

- **Del transistor a la CPU**: comprende los fundamentos del hardware informático
- **Sistema operativo (procesos/memoria/sistema de archivos)**: profundiza en los sistemas operativos
- **Redes de ordenadores**: profundiza en los protocolos de red
:::
