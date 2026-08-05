# Introducción al seguimiento de datos

::: tip 🎯 El problema que resuelve este capítulo
**¿Cómo sabemos lo que hacen los usuarios dentro de nuestra aplicación?**

Imagina que abres una tienda de bubble tea física. Puedes situarte tras el mostrador y observar a cada cliente: ¿cuánto tiempo miraron el menú antes de entrar? ¿Qué bebida pidieron? ¿Se marcharon sin pedir tras dudarlo?

Pero si tu "tienda" es una aplicación móvil o un sitio web, no puedes observar directamente las acciones de los usuarios. En ese caso necesitas un medio técnico para "insertar" puntos de registro en lugares clave de la aplicación, que registren automáticamente cada acción del usuario. Esto es el **seguimiento de datos (Event Tracking)**.

El término "seguimiento" suena muy técnico, pero su lógica central es simple: **en cada lugar donde el usuario pueda actuar, colocar un "registrador" que anote lo que hizo.**

Este capítulo explica el proceso en cuatro pasos:

1. **Elegir un esquema de recopilación** — decidir dónde colocar los registradores y cómo
2. **Diseñar el formato de datos** — decidir qué información debe contener cada registro
3. **Transmisión y caché** — llevar los registros del teléfono del usuario al servidor de forma segura
4. **Limpieza y almacenamiento** — organizar los datos, eliminar duplicados y errores, y guardarlos en la base de datos
:::

---

## Plan de recopilación de datos

**Objetivo**: Decidir qué método utilizar para registrar las acciones de los usuarios.

Por ejemplo: el jefe de producto quiere saber "cuántos usuarios hicieron clic en el botón de compra". Para responder a esto, los desarrolladores necesitan añadir lógica de registro en el código del "botón de compra" — cada vez que un usuario haga clic en ese botón, se registrará automáticamente una entrada.

Pero hay una elección: ¿ponemos registradores **solo en los lugares importantes** (por ejemplo, solo registrar "compra" y "registro"), o **en todos lados** (registrar cada clic, deslizamiento y permanencia del usuario)?

Diferentes elecciones corresponden a diferentes esquemas de seguimiento.

<DataTrackingDemo tab="methods" />

**💡 Los tres métodos principales de seguimiento**

En la industria se utilizan comúnmente tres esquemas de seguimiento, cada uno con ventajas e inconvenientes:

**Método 1: Seguimiento por código (Code Tracking) — Registro manual y preciso**

El desarrollador especifica manualmente en el código: cuando el usuario realiza una acción, registrar un dato.

Por analogía: es como asignar a una persona en la caja de la tienda de bubble tea para que registre exclusivamente "quién compró qué y cuánto gastó". La información registrada es muy detallada y precisa.

- *Ventaja*: puede registrar información de negocio muy detallada, como qué cupón usó el usuario o cuál era su saldo
- *Coste*: cada nuevo punto de registro requiere que el desarrollador escriba código, haga pruebas y publique una nueva versión — un proceso largo

**Método 2: Seguimiento visual (Visual Tracking) — Selección mediante clic**

No requiere escribir código. El sistema proporciona una herramienta visual donde el personal de operaciones puede "seleccionar" directamente en la interfaz de la aplicación los botones o áreas que desea monitorizar, y el sistema comienza a registrar automáticamente.

Por analogía: es como en la imagen de vigilancia de la tienda, seleccionar con el ratón el "área de la caja", y el sistema empieza a contar automáticamente el tráfico en esa zona.

- *Ventaja*: no requiere la participación de desarrolladores; el personal de operaciones puede configurarlo por sí mismo, con alta eficiencia
- *Coste*: solo puede registrar operaciones de interfaz como "qué pulsó el usuario", sin poder registrar datos de negocio profundos como "el importe del pedido"

**Método 3: Seguimiento automático (Auto Tracking) — Registrar todo automáticamente**

Se integra un SDK (un "paquete de herramientas") en la aplicación que registra automáticamente todas las acciones del usuario: cada clic, cada deslizamiento, cuánto tiempo permaneció en cada página.

Por analogía: es como instalar cámaras en cada rincón de la tienda, registrando cada movimiento de los clientes.

- *Ventaja*: no se pierde ninguna acción; la cobertura es la más completa
- *Coste*: el volumen de datos es enorme, con mucha información inútil (como deslizamientos inconscientes del usuario); filtrar y limpiar requiere mucho esfuerzo

**Resumen de este paso**: una vez elegido el método de seguimiento, nuestra aplicación ya tiene la capacidad de "registrar las acciones del usuario".

**Pero surge un nuevo problema**: aunque los registradores pueden capturar las acciones del usuario, si cada registrador registra en un formato diferente (por ejemplo, algunos escriben "ID de usuario", otros "userID", otros no lo registran), no será posible analizar de forma unificada. Por eso, el siguiente paso es establecer un formato de registro unificado.

---

## Especificación de formato de datos

**Prerrequisito**: ya hemos elegido un método de seguimiento (por ejemplo, seguimiento por código) y la aplicación ya puede capturar las acciones del usuario.

**Objetivo de este paso**: establecer una "plantilla de registro" unificada para que todos los registros de seguimiento mantengan un formato consistente.

**¿Por qué se necesita un formato unificado?** Imagina que en la tienda de bubble tea hay tres empleados registrando las ventas simultáneamente: uno escribe "Xiaoming compró bubble tea 15 yuanes", otro escribe "15, té, bubble", y el tercero escribe "una taza de bubble tea". Al final del mes, al consolidar, estos formatos completamente diferentes hacen que la compilación sea muy dolorosa. Por eso necesitamos una "hoja de registro" unificada que especifique qué campos debe rellenar cada entrada.

<DataTrackingDemo tab="model" />

**💡 Principio central: La plantilla 4W1H**

Sin importar qué acción se registre, cada dato debe responder a cinco preguntas (conocidas como 4W1H):

**Who — ¿Quién lo hizo?**

Necesitamos saber qué usuario generó este registro.

- Si el usuario ha iniciado sesión, se usa su ID de cuenta (por ejemplo, `user_id: "zhangsan123"`)
- Si no ha iniciado sesión, se usa el identificador único del dispositivo (por ejemplo, el número de serie del teléfono), para al menos distinguir que "estas acciones provienen del mismo teléfono"

**When — ¿Cuándo lo hizo?**

Registrar la hora exacta de la acción, con precisión de milisegundos.

Hay un detalle aquí: si tu aplicación tiene usuarios en el extranjero, las 3 de la tarde hora de Pekín y las 3 de la tarde hora de Nueva York difieren en 13 horas. Para evitar confusiones, todas las horas se convierten a UTC (tiempo universal coordinado).

**Where & How — ¿En qué entorno lo hizo?**

Esta parte registra el entorno de dispositivo y red del usuario al realizar la acción, y se denomina **atributos comunes**. Se llaman "comunes" porque, independientemente de la acción, esta información se adjunta automáticamente. Por ejemplo:

- Modelo de dispositivo: iPhone 15 / Xiaomi 14
- Tipo de red: WiFi / 5G / 4G
- Versión de la App: v1.2.3
- Sistema operativo: iOS 18 / Android 15

El valor de esta información radica en que, si se detecta un bug que solo aparece en un modelo específico, los atributos comunes ayudan a localizar el problema rápidamente.

**What — ¿Qué hizo exactamente?**

Esta parte registra los detalles de negocio específicos de la acción, denominados **atributos personalizados**. Diferentes acciones requieren registrar información diferente. Por ejemplo:

- El usuario pulsa "Añadir al carrito": se registran el nombre del producto, el precio y la cantidad
- El usuario completa un pago: se registran el importe del pedido, el método de pago y el código del cupón

**Resumen de este paso**: a través de la plantilla 4W1H, convertimos cada acción del usuario en un registro de datos con formato unificado. En la implementación técnica, este registro se almacena normalmente en formato JSON (JSON es un formato de datos universal; el componente interactivo de arriba muestra su aspecto).

**Pero surge otro nuevo problema**: el formato de datos está unificado, pero si el número de usuarios es grande (por ejemplo, durante una promoción, se pueden generar decenas de miles de registros por segundo), el teléfono del usuario no puede enviar cada registro inmediatamente — eso consumiría batería y datos móviles, y el servidor no lo soportaría. Por eso, el siguiente paso es diseñar un método de transmisión más inteligente.

---

## Mecanismo de transmisión y caché

**Prerrequisito**: cada acción del usuario ha sido registrada como datos JSON con formato unificado.

**Objetivo de este paso**: transmitir estos datos desde el teléfono (o navegador) del usuario al servidor de forma fiable, incluso en condiciones de red deficientes, sin perder datos.

**¿Por qué no enviarlos directamente?** Si cada registro se envía inmediatamente como una petición de red, es como ir a correos por cada carta que escribes — muy ineficiente. Un enfoque más razonable es acumular un lote de cartas y enviarlas de una vez.

<DataTrackingDemo tab="pipeline" />

**💡 Principio central: Las tres garantías de la transmisión de datos**

Los datos, desde el teléfono del usuario hasta el servidor, deben pasar por tres mecanismos de garantía para asegurar que sean eficientes y no se pierdan:

**Primera garantía: Acumular un lote antes de enviar (agregación por lotes)**

El SDK (el paquete de herramientas de seguimiento) no envía un registro cada vez que se genera, sino que primero lo almacena temporalmente en la memoria del teléfono. Cuando acumula una cierta cantidad (por ejemplo, 30 registros) o transcurre un tiempo determinado (por ejemplo, 5 segundos), empaqueta ese lote y lo envía todo de una vez.

Es como enviar un paquete: no vas a la oficina de correos cada vez que compras algo, sino que acumulas varias compras y las envías juntas, ahorrando tiempo y esfuerzo. Para el teléfono, esto reduce el número de peticiones de red, ahorrando batería y datos móviles.

**Segunda garantía: No perder datos sin red (almacenamiento local)**

En un ascensor o un túnel de metro, el teléfono a menudo no tiene señal de red. Si los datos solo están en la memoria, al cerrar la aplicación se perderían.

Por eso el SDK guarda los datos pendientes en el almacenamiento local del teléfono (similar a guardar las cartas en un cajón primero). Cuando se restaura la red, los envía automáticamente. Así, incluso si el usuario se queda brevemente sin conexión, los datos no se pierden.

**Tercera garantía: Que el servidor no colapse (cola de mensajes)**

Una vez que los datos llegan al servidor, no se escriben directamente en la base de datos. ¿Por qué? Porque durante los picos de promociones, pueden llegar decenas de miles de datos por segundo, y la base de datos colapsaría si procesara ese volumen directamente.

La solución es añadir un "búfer" intermedio, técnicamente llamado **cola de mensajes** (una herramienta común es Kafka). Su función es como el sistema de turnos de un restaurante: en horas punta, los clientes (datos) esperan en cola, y la cocina (base de datos) procesa a su ritmo, sin verse desbordada por los pedidos simultáneos.

**Resumen de este paso**: con las tres garantías de "acumular un lote antes de enviar → almacenamiento local sin red → búfer de cola de mensajes", los datos han llegado de forma segura al servidor.

**Pero aún hay un problema**: como los datos se reenvían automáticamente al reconectarse, un mismo registro puede haberse enviado dos veces. Si no se procesa antes de almacenar, los datos se duplicarán (por ejemplo, un pedido de 100 euros contado como dos, inflando las ventas). Por eso, el siguiente paso es "limpiar" los datos.

---

## Proceso de limpieza y almacenamiento

**Prerrequisito**: los datos han llegado de forma segura al servidor a través del pipeline de transmisión.

**Objetivo de este paso**: antes de almacenar los datos en la base de datos, realizarles un "chequeo" — eliminar duplicados, corregir los que tengan formato incorrecto, y asegurar que los datos finales almacenados estén limpios y sean precisos.

**¿Por qué se necesita limpieza?** Igual que al recibir una caja de paquetes necesitas revisar: ¿hay envíos duplicados? ¿alguno equivocado? ¿hay paquetes dañados? Los datos también necesitan inspección y organización antes de almacenarse.

Este proceso se denomina técnicamente **ETL**, acrónimo de tres palabras en inglés:
- **E**xtract (Extraer): sacar los datos de la cola de mensajes
- **T**ransform (Transformar): verificar y corregir el formato de los datos
- **L**oad (Cargar): escribir los datos limpios en la base de datos

<DataTrackingDemo tab="overview" />

**💡 Principio central: Las dos acciones clave de la limpieza de datos**

**Acción 1: Desduplicación — Eliminar registros duplicados**

Como se mencionó antes, el SDK reenvía datos automáticamente al reconectarse, lo que puede hacer que el mismo registro se envíe varias veces. ¿Cómo identificar los duplicados?

El método es simple: al empaquetar los datos en el cliente, asignar a cada registro un identificador único global (llamado `dedup_id`, similar al número de seguimiento de un paquete). Antes de almacenar, el servidor comprueba si este ID ya existe — si ya existe, el registro es un duplicado y se descarta.

**Acción 2: Verificación y unificación de formato — Corregir registros irregulares**

La aplicación se actualiza continuamente, y el código de seguimiento de diferentes versiones puede tener ligeras diferencias. Por ejemplo:

- La versión antigua nombra el campo ID de usuario como `userId`, la nueva lo cambió a `user_id`
- Algunos registros tienen timestamps claramente erróneos (por ejemplo, muestran 1970)
- Algunos campos tienen valores irreconocibles

En este paso, el sistema aplica reglas de transformación: unifica los nombres de campos inconsistentes, descarta los registros con timestamps anómalos y marca los valores irreconocibles como `unknown`.

**Resumen de este paso**: tras la desduplicación y verificación de formato, los datos se escriben de forma limpia y unificada en el **data warehouse** (una base de datos especializada en almacenar y analizar grandes volúmenes de datos, como ClickHouse o Hive). Los analistas pueden consultar directamente estos datos con SQL para obtener resultados fiables.

---

## Repaso del proceso completo

A continuación se resume el proceso de cuatro pasos del seguimiento de datos, desde la recopilación hasta el almacenamiento:

| Paso | Qué se hizo | Qué se obtuvo | Qué problema queda |
|------|-------------|---------------|-------------------|
| **1. Elegir esquema de recopilación** | Decidir cómo registrar las acciones del usuario | La aplicación tiene capacidad de registro | Los datos de cada registrador no tienen formato uniforme |
| **2. Diseñar el formato de datos** | Unificar el formato con la plantilla 4W1H | Cada registro es un JSON estándar | Con muchos usuarios, enviar uno a uno no es viable |
| **3. Transmisión y caché** | Enviar por lotes, almacenar localmente sin red, buffer con cola | Los datos llegan de forma segura al servidor | Los reintentos pueden causar duplicados |
| **4. Limpieza y almacenamiento** | Desduplicar, verificar y unificar formato | ✅ Datos limpios almacenados en el data warehouse | — |

---

## Conclusión

Cuando un usuario pulsa un botón en la aplicación, en la superficie es solo una acción instantánea. Pero tras bambalinas, una cadena completa de datos ya ha comenzado a funcionar:

1. El código de seguimiento captura ese clic y genera un registro estándar según la plantilla 4W1H
2. El registro se almacena temporalmente en el teléfono localmente, y cuando se acumula un lote se envía al servidor
3. El servidor lo recibe de forma estable a través de la cola de mensajes, y luego lo pasa por desduplicación y verificación de formato
4. Finalmente, un dato limpio y preciso se escribe en el data warehouse

Este es el proceso completo del seguimiento de datos. Transforma las acciones de los usuarios, dispersas e invisibles, en datos estructurados que se pueden consultar y analizar. Los gerentes de producto pueden saber qué funciones gustan y dónde se pierden usuarios; el personal de operaciones puede evaluar la efectividad de las campañas; los desarrolladores pueden identificar en qué versión aparecen los problemas.

Este sistema de "recopilación → modelado → transmisión → limpieza" es la infraestructura básica para la toma de decisiones basada en datos.
