# Principios de organización de computadoras

::: tip Prólogo
**Del transistor a la CPU: ¿cómo se compone un sistema informático completo?** En el capítulo anterior partimos de los transistores para construir sumadores, registros, unidades aritméticas y, finalmente, el núcleo de la CPU. Pero una CPU por sí sola no basta: necesita cooperar con la memoria y los dispositivos de E/S, requiere buses que conecten los distintos componentes y un sistema de instrucciones que la impulse. En este capítulo pasaremos de la perspectiva interna de la CPU a la del sistema informático completo, profundizando en la arquitectura Von Neumann, el sistema de instrucciones, la jerarquía de memoria, los buses y los principios profesionales de E/S.
:::

**¿Qué aprenderás en este artículo?**

Al terminar este capítulo, habrás adquirido:

- **Visión de sistema**: comprenderás cómo colaboran la CPU, la memoria y la E/S, y dejarás de ser un aficionado al hardware aislado
- **Terminología técnica de hardware**: dominarás conceptos fundamentales como ciclo de instrucción, segmentación (pipeline), CPI, tasa de aciertos de caché, entre otros
- **Mentalidad de rendimiento**: entenderás los cuellos de botella en la organización de computadores y las técnicas de optimización
- **Base para estudios posteriores**: sentarás las bases profesionales para sistemas operativos, arquitectura de computadores y desarrollo embebido

| Capítulo | Contenido | Conceptos clave |
|----------|-----------|-----------------|
| **Capítulo 1** | Arquitectura Von Neumann | Programa almacenado, cinco componentes funcionales, ruta de datos |
| **Capítulo 2** | Sistema de instrucciones | Formato de instrucción, modos de direccionamiento, CISC vs RISC |
| **Capítulo 3** | Unidad de control de la CPU | Unidad de control, microoperaciones, ciclo de instrucción |
| **Capítulo 4** | Jerarquía de memoria | Caché, memoria principal, memoria virtual, mecanismo de paginación |
| **Capítulo 5** | Buses y E/S | Arbitraje de bus, DMA, mecanismo de interrupciones |

---

## 0. Visión general: sistema hardware del computador

En el capítulo anterior "Del transistor a la CPU", ya entendimos cómo funciona internamente la CPU: desde la búsqueda (fetch), decodificación, ejecución hasta el write-back. Pero la CPU en sí es solo una unidad de ejecución; para que un computador sea realmente "utilizable", necesita la cooperación de una serie de componentes periféricos.

<CpuArchitectureDemo />

::: tip Descomposición por capas: sistema hardware del computador
- **Primera capa: núcleo de la CPU**
  Responsable de la ejecución de instrucciones, incluye la unidad de control (que emite señales de control) y la unidad aritmética (que ejecuta operaciones aritméticas y lógicas)

- **Segunda capa: banco de registros**
  Unidad de almacenamiento de alta velocidad dentro de la CPU, incluye registros de propósito general y registros especiales (PC, IR, MAR, MDR, etc.)

- **Tercera capa: memoria principal**
  Memoria para almacenar programas y datos, a la que la CPU accede mediante el bus de direcciones y el bus de datos

- **Cuarta capa: dispositivos de E/S**
  Los dispositivos de entrada/salida se conectan al bus del sistema a través de controladores de E/S

- **Quinta capa: bus del sistema**
  Canal de datos que conecta CPU, memoria y E/S, incluyendo bus de direcciones, bus de datos y bus de control
:::

---

## 1. Principios de la arquitectura Von Neumann

### 1.1 Principio de programa almacenado

En 1945, el matemático John von Neumann propuso la revolucionaria arquitectura de **programa almacenado (Stored-program)**. Esta idea sentó las bases del computador moderno.

::: tip Concepto clave
**Programa almacenado**: el programa en sí es un tipo especial de dato y, como cualquier otro dato, se almacena en memoria. La CPU puede leer y ejecutar las instrucciones del programa almacenadas en memoria de la misma forma en que lee y escribe datos.
:::

Esto significa que:
- **Computadores primitivos**: el programa se implementaba mediante cableado fijo; cambiar de programa requería volver a soldar los circuitos
- **Arquitectura Von Neumann**: el programa se almacena en memoria; cambiar de programa solo requiere modificar el contenido de la memoria

### 1.2 Los cinco componentes funcionales

La arquitectura Von Neumann divide el computador en cinco componentes fundamentales:

<RegisterDemo />

| Componente | Inglés | Función | Composición principal |
|------------|--------|--------|-----------------------|
| **Unidad Aritmética** | ALU (Arithmetic Logic Unit) | Ejecuta operaciones aritméticas y lógicas | Sumador, desplazador, comparador |
| **Unidad de Control** | CU (Control Unit) | Dirige y coordina el trabajo de todos los componentes | Registro de instrucción, decodificador, generador de temporización |
| **Memoria** | Memory | Almacena programas y datos | Registro de dirección de memoria (MAR), registro de datos de memoria (MDR) |
| **Dispositivos de entrada** | Input | Entrada de información | Teclado, ratón, escáner |
| **Dispositivos de salida** | Output | Salida de información | Monitor, impresora |

### 1.3 Ruta de datos

La **ruta de datos (Data Path)** es el camino por el que fluyen los datos entre los distintos componentes funcionales. Dentro de la CPU, la ruta de datos conecta:

- El banco de registros
- La unidad aritmético-lógica (ALU)
- El registro de datos de memoria (MDR)

La anchura de la ruta de datos (cuántos bits puede transmitir a la vez) afecta directamente al rendimiento del computador.

### 1.4 El cuello de botella de Von Neumann

La arquitectura Von Neumann tiene un conocido **cuello de botella de rendimiento**:

> La velocidad de transferencia de datos entre la CPU y la memoria es muy inferior a la velocidad de procesamiento de la CPU.

Esto provoca que la CPU a menudo permanezca inactiva "esperando datos". Muchas técnicas de optimización de los computadores modernas giran en torno a este problema:

| Técnica de optimización | Principio |
|-------------------------|-----------|
| **Caché (Cache)** | Colocar almacenamiento de alta velocidad y pequeña capacidad cerca de la CPU |
| **Segmentación de instrucciones (Pipelining)** | Mantener varias instrucciones simultáneamente en distintas etapas |
| **Superescalar** | Emitir múltiples instrucciones en un mismo ciclo de reloj |
| **Paralelismo multinúcleo** | Varios núcleos de CPU comparten las tareas de cómputo |

---

## 2. Sistema de instrucciones: la interfaz entre la CPU y el software

En la sección anterior aprendimos la idea central de la arquitectura Von Neumann: **el programa y los datos se almacenan juntos en memoria**. Pero esto plantea una pregunta clave: ¿qué aspecto tiene exactamente el "programa" almacenado en memoria? ¿Cómo lo interpreta la CPU?

La respuesta es el **sistema de instrucciones (Instruction Set Architecture, ISA)**. Si comparamos la CPU con un servicio, el sistema de instrucciones sería su **documentación de API**: define todos los comandos que la CPU puede entender, el formato de cada comando y el rango de datos sobre los que puede operar. Cada línea de código que escribes acaba siendo traducida por el compilador a una secuencia de llamadas a esta "API".

### 2.1 Flujo de traducción de código a instrucción

Construyamos primero una comprensión global: el código que escribes en el editor y lo que realmente ejecuta la CPU están separados por varias capas de traducción.

<CodeToInstructionDemo />

Esta cadena de traducción es clave para entender el sistema de instrucciones:

| Nivel | Contenido | ¿Quién lo entiende? |
|-------|-----------|---------------------|
| Lenguaje de alto nivel | `int a = 10 + 5;` | Humanos |
| Lenguaje ensamblador | `MOV R1, #10` / `ADD R3, R1, R2` | Humanos (con entrenamiento) |
| Código máquina | `0001 0001 0000 1010` | La CPU |

::: tip ¿Por qué entender esta cadena?
- Cuando ves un error de compilación, sabes que el fallo ocurre en el paso "lenguaje de alto nivel → ensamblador"
- Cuando ves un fallo en tiempo de ejecución, sabes que el problema está en la fase de ejecución de instrucciones de la CPU
- Al entender la optimización de rendimiento, sabes qué optimizaciones aplica el compilador durante el proceso de "traducción"
- Al elegir arquitectura de CPU (x86 vs ARM), sabes que la diferencia radica en que la "API del conjunto de instrucciones" es distinta
:::

### 2.2 Visión general del formato de instrucción

Sabiendo que el código se traduce a instrucciones, la siguiente pregunta es: **¿cuál es la estructura interna de una instrucción?**

Cada instrucción máquina es esencialmente una cadena de dígitos binarios, pero con un formato interno estricto. Las dos partes fundamentales son:

- **Código de operación (Opcode)**: le dice a la CPU «qué hacer»: ¿una suma? ¿un salto? ¿leer de memoria?
- **Operando (Operand)**: le dice a la CPU «sobre quién actuar»: ¿qué registro? ¿qué dirección de memoria? ¿qué constante?

Igual que una frase tiene la estructura «verbo + complemento», una instrucción también tiene la estructura «operación + objeto»:

```
Instrucción:  ADD  R3, R1, R2
              ───  ──────────
              Opcode  Operandos
              (sumar) (R3 = R1 + R2)
```

Según la cantidad de operandos, el formato de instrucción se divide en cuatro tipos, de simple a complejo:

<InstructionFormatDemo />

| Formato | Estructura | Ejemplo | Caso de uso |
|---------|------------|---------|-------------|
| Cero direcciones | Solo opcode | `RET` (retornar) | Computadores de pila, operandos implícitos en la cima de la pila |
| Una dirección | Opcode + 1 dirección | `INC R1` (incrementar R1) | Operaciones con un solo operando |
| Dos direcciones | Opcode + 2 direcciones | `MOV R1, R2` | Más común, transferencia de datos y operaciones |
| Tres direcciones | Opcode + 3 direcciones | `ADD R3, R1, R2` | No destruye los operandos fuente |

::: tip ¿Por qué hay tantos formatos?
Es un **compromiso entre espacio y flexibilidad**. Las instrucciones de cero direcciones son las más cortas (ahorran memoria), pero requieren operaciones de pila adicionales; las de tres direcciones son las más flexibles (no destruyen los datos fuente), pero ocupan más bits. Cada arquitectura de CPU elige una combinación diferente de formatos de instrucción.
:::

### 2.3 Principios de modos de direccionamiento

La instrucción le dice a la CPU «haz una suma», pero ¿dónde están los dos números que hay que sumar? Pueden estar directamente escritos en la instrucción, en un registro o en alguna dirección de memoria. El **modo de direccionamiento** es la regla que le indica a la CPU «dónde buscar los operandos».

Usemos una analogía cotidiana de "encontrar a una persona":

| Modo de direccionamiento | Analogía | Ejemplo de instrucción | Descripción |
|--------------------------|----------|------------------------|-------------|
| **Inmediato** | La persona está justo delante de ti | `MOV R1, #100` | El dato está escrito directamente en la instrucción, lo más rápido |
| **Por registro** | Llamar al colega por la extensión interna | `MOV R1, R2` | El dato está en un registro interno de la CPU, muy rápido |
| **Directo** | Sabes el número de puerta y vas directamente | `MOV R1, [0x1000]` | La instrucción contiene la dirección de memoria |
| **Indirecto** | Preguntar a recepción «¿en qué sala está Zhang San?» | `MOV R1, [R2]` | El registro contiene una dirección; hay que consultar una vez más |
| **Indexado** | Calcular la sala como «edificio 3 + piso 5» | `MOV R1, [R2+10]` | Dirección base + desplazamiento, usado para acceso a arrays |

<AddressingModeDemo />

::: tip ¿Por qué se necesitan tantos modos de direccionamiento?
Cada contexto necesita una estrategia distinta para "encontrar datos":
- **Asignación de constantes** (`x = 100`) → direccionamiento inmediato, el dato está en la propia instrucción
- **Operaciones con variables** (`a + b`) → direccionamiento por registro, los datos ya están cargados en registros
- **Acceso a arrays** (`arr[i]`) → direccionamiento indexado, dirección base + desplazamiento del índice
- **Operaciones con punteros** (`*ptr`) → direccionamiento indirecto, el registro contiene una dirección

Cuando escribes `arr[i]` no piensas en modos de direccionamiento, pero el compilador selecciona automáticamente el más adecuado.
:::

### 2.4 El catálogo de capacidades de la CPU — Clasificación de instrucciones

Ahora que conocemos el formato de instrucción y los modos de direccionamiento, la última pregunta es: **¿qué cosas puede hacer exactamente una CPU?**

Todas las instrucciones se pueden agrupar en seis grandes categorías que cubren todas las operaciones que puede realizar un computador:

| Tipo | Qué hace | Instrucciones representativas | El código que escribes |
|------|----------|-------------------------------|------------------------|
| **Transferencia de datos** | Mover datos | MOV, LOAD, STORE | `let x = y`, paso de parámetros a funciones |
| **Aritméticas** | Sumar, restar, multiplicar, dividir | ADD, SUB, MUL, DIV | `a + b`, `count++` |
| **Lógicas** | Operaciones a nivel de bit | AND, OR, NOT, XOR | `flags & 0xFF`, comprobación de permisos |
| **Desplazamiento** | Desplazar a izquierda o derecha | SHL, SHR | `x << 2` (equivale a multiplicar por 4) |
| **Transferencia de control** | Saltos y llamadas | JMP, CALL, RET | `if`, `for`, llamadas a funciones |
| **Entrada/Salida** | Comunicación con periféricos | IN, OUT | Leer teclado, escribir en pantalla |

::: tip Una idea clave
Todo el código que escribes —sin importar lo compleja que sea la lógica de negocio o lo espectaculares que sean las animaciones de la interfaz— acaba descomponiéndose en combinaciones de estos seis tipos de operaciones básicas. La "inteligencia" de la CPU no reside en hacer cosas complejas, sino en ejecutar estas operaciones simples miles de millones de veces por segundo.
:::

### 2.5 Dos filosofías de diseño: CISC vs RISC

El diseño del sistema de instrucciones presenta un desacuerdo fundamental: **¿debe cada instrucción ser lo más potente posible o lo más simple posible?**

Esta divergencia ha generado dos grandes bandos que influyen directamente en cada dispositivo que usas hoy:

<CISCvsRISCDemo />

Usemos una analogía para entenderlo:
- **CISC es como una navaja suiza**: integra tijeras, abrebotellas, destornillador… muchas funciones, pero cada una no es necesariamente la mejor
- **RISC es como un juego de herramientas profesionales**: cada herramienta hace una sola cosa, pero la hace rápido y bien

::: tip ¿Por qué tu móvil usa ARM y tu ordenador usa x86?
- **x86 (CISC)** ha dominado el mercado de PC y servidores durante 40 años, acumulando un enorme ecosistema de software. Cambiar de arquitectura implicaría recompilar todo el software
- **ARM (RISC)** domina los dispositivos móviles gracias a su bajo consumo. La batería de un móvil es pequeña, cada milivatio cuenta
- **Apple Silicon** ha demostrado que RISC también puede ofrecer alto rendimiento: los chips de la serie M superan a sus rivales x86 tanto en rendimiento como en consumo
- **RISC-V** es una arquitectura RISC de código abierto que está emergiendo rápidamente en IoT, educación y chips de IA
:::

---

> **Resumen**: el sistema de instrucciones es el puente que conecta el software y el hardware. El código que escribes se traduce a instrucciones mediante el compilador; las instrucciones, mediante el opcode y los operandos, le dicen a la CPU qué hacer y sobre quién; los modos de direccionamiento determinan de dónde vienen los datos. Los distintos diseños de conjuntos de instrucciones (CISC/RISC) determinan las características de rendimiento y los escenarios de aplicación de la CPU.
>
> Ahora conocemos la «estructura estática» de las instrucciones: qué aspecto tienen y qué tipos hay. La siguiente pregunta es: **¿cómo ejecuta la CPU estas instrucciones paso a paso?** Ese es el trabajo de la unidad de control.

---

## 3. Principios de la unidad de control

### 3.1 Componentes de la unidad de control

La unidad de control es el "cerebro" de la CPU, encargada de coordinar el trabajo de todos los componentes según lo exigen las instrucciones:

<ControllerDemo />

| Componente | Función |
|------------|---------|
| **Contador de programa (PC)** | Almacena la dirección de la siguiente instrucción |
| **Registro de instrucción (IR)** | Almacena la instrucción que se está ejecutando actualmente |
| **Decodificador de instrucciones** | Analiza el opcode y los operandos de la instrucción |
| **Generador de temporización** | Genera señales de pulso que controlan la temporización de cada componente |
| **Generador de secuencia de microoperaciones** | Produce la serie de señales de control necesarias para ejecutar la instrucción |

<PSWFlagDemo />

### 3.2 Ciclo de instrucción

La CPU necesita pasar por un **ciclo de instrucción** completo para ejecutar una instrucción, que típicamente incluye:

1. **Ciclo de búsqueda (Fetch)**: leer la instrucción de la memoria al IR
2. **Ciclo de decodificación (Decode)**: interpretar el significado de la instrucción
3. **Ciclo de ejecución (Execute)**: realizar la operación
4. **Ciclo de acceso a memoria (Memory Access)**: si se requiere, acceder a la memoria
5. **Ciclo de escritura (Write Back)**: escribir el resultado en el registro o la memoria

### 3.3 Microoperaciones

Una **microoperación** es la operación más básica impulsada por señales de control. Por ejemplo, la fase de "búsqueda (fetch)" se puede descomponer en las siguientes microoperaciones:

| Pulso | Microoperación | Señal de control |
|-------|----------------|------------------|
| T1 | PC → MAR | PCout, MARin |
| T2 | MEM → MDR | MEMout, MDRin |
| T3 | MDR → IR | MDRout, IRin |
| T4 | PC + 1 → PC | PC+1, PCin |

### 3.4 Control cableado vs control microprogramado

| Característica | Control cableado | Control microprogramado |
|----------------|------------------|-------------------------|
| **Implementación** | Circuitos de lógica combinacional | Secuencia de microinstrucciones (firmware) |
| **Velocidad** | Rápido | Algo más lento |
| **Dificultad de diseño** | Compleja | Relativamente sencilla |
| **Flexibilidad** | Escasa (modificar requiere rediseñar el circuito) | Alta (basta con modificar el microprograma) |
| **Aplicación típica** | Procesadores RISC | Primeros procesadores CISC |

---

## 4. Principios de jerarquía de memoria y caché

### 4.1 Estructura jerárquica de la memoria

Los dispositivos de almacenamiento del computador forman una estructura piramidal:

<StorageHierarchyDemo />

| Nivel | Tipo de almacenamiento | Tiempo de acceso | Capacidad típica | Ubicación |
|-------|------------------------|------------------|------------------|-----------|
| **Registros** | SRAM | <1ns | Unos KB | Dentro de la CPU |
| **Caché L1** | SRAM | ~1ns | 32-64KB | Cerca del núcleo de la CPU |
| **Caché L2** | SRAM | ~3-10ns | 256KB-1MB | Dentro del chip de la CPU |
| **Caché L3** | SRAM | ~10-20ns | 2-16MB | Dentro del chip / compartida |
| **Memoria principal (RAM)** | DRAM | ~50-100ns | 8-64GB | En la placa base |
| **SSD** | Flash | ~10-100μs | 256GB-2TB | En la placa base |
| **HDD** | Disco magnético | ~5-10ms | 1-10TB | En la caja del equipo |

::: tip Analogía de las diferencias de velocidad
Si comparamos el acceso de la CPU a la caché L1 con **coger un papel de encima de la mesa**:
- Acceder a la memoria principal → coger el ascensor para ir a comprar papel a la tienda de abajo
- Acceder a un SSD → conducir a otra ciudad para comprar papel
- Acceder a un HDD → volar a otro país para comprar papel

¡La diferencia de velocidad puede alcanzar **millones de veces**!
:::

### 4.2 Principio de la caché

La **caché (Cache)** es un almacenamiento rápido situado entre la CPU y la memoria principal. Su idea central se basa en dos principios de localidad:

::: tip Principios de localidad
- **Localidad temporal**: si un dato acaba de ser accedido, es muy probable que vuelva a ser accedido pronto
- **Localidad espacial**: si un dato es accedido, es muy probable que los datos cercanos a él también lo sean
:::

#### Funcionamiento de la caché

1. **Acierto (Hit)**: el dato que busca la CPU está en la caché, se lee directamente
2. **Fallo (Miss)**: el dato no está en la caché, hay que cargarlo desde la memoria principal

```
Tasa de aciertos = número de aciertos / número total de accesos
Tiempo medio de acceso = tasa de aciertos × tiempo de caché + (1 - tasa de aciertos) × tiempo de memoria
```

<CacheDemo />

### 4.3 Métodos de correspondencia de caché

| Método | Principio | Ventajas | Desventajas |
|--------|-----------|----------|-------------|
| **Correspondencia directa** | Cada bloque de memoria solo puede ir a una posición fija | Simple y rápido | Alta tasa de conflictos |
| **Asociativa por conjuntos** | Cada bloque de memoria puede ir a N posiciones (N vías) | Equilibrio entre velocidad y tasa de aciertos | Implementación compleja |
| **Totalmente asociativa** | Cualquier posición | Menor tasa de conflictos | Difícil de implementar (requiere comparar todas las etiquetas) |

### 4.4 Memoria virtual

La **memoria virtual** es una abstracción importante que proporciona el sistema operativo:

- Cada proceso cree que dispone de un espacio de direcciones virtual completo
- El sistema operativo se encarga de traducir las direcciones virtuales a direcciones físicas
- Las páginas poco usadas se pueden expulsar al disco (espacio de intercambio)

::: tip Analogía de la memoria virtual
Imagina la memoria virtual como la **gestión de habitaciones de un hotel**:
- Tú (el proceso) crees que todo el edificio es tuyo
- En realidad, el hotel (SO) solo te asigna las habitaciones que necesitas en cada momento
- Las habitaciones que no usas se "expulsan" al almacén (disco)
- Las habitaciones que necesitas se pueden "traer" en cualquier momento
:::

---

## 5. Principios de buses y entrada/salida

### 5.1 Bus del sistema

El **bus (Bus)** es el canal de datos que conecta los distintos componentes del computador:

<BusSystemDemo />

| Tipo de bus | Función | Dirección | Anchura típica |
|-------------|---------|-----------|----------------|
| **Bus de direcciones** | Transmite direcciones de memoria | Unidireccional (CPU→memoria) | 32 bits / 64 bits |
| **Bus de datos** | Transmite datos | Bidireccional | 32 bits / 64 bits |
| **Bus de control** | Transmite señales de control | Bidireccional | Varias líneas de señal |

### 5.2 Arbitraje del bus

Cuando varios dispositivos solicitan usar el bus simultáneamente, se necesita un mecanismo de **arbitraje** para decidir quién lo usa primero:

| Método de arbitraje | Descripción |
|---------------------|-------------|
| **Arbitraje centralizado** | Un árbitro central decide de manera unificada |
| **Arbitraje distribuido** | Los dispositivos negocian entre sí |

### 5.3 Métodos de acceso a dispositivos de E/S

| Método | Principio | Ventajas | Desventajas |
|--------|-----------|----------|-------------|
| **Consulta por programa (Polling)** | La CPU sondea cíclicamente el estado de E/S | Simple | Baja utilización de la CPU |
| **Por interrupciones** | El dispositivo de E/S notifica activamente a la CPU al terminar | La CPU puede trabajar en paralelo | La gestión de interrupciones tiene sobrecarga |
| **DMA** | El dispositivo de E/S accede directamente a la memoria | La CPU no participa en absoluto | Requiere un controlador DMA |

<IOMethodDemo />

### 5.4 Principio de DMA

**DMA (Direct Memory Access, acceso directo a memoria)** permite que los dispositivos de E/S intercambien datos directamente con la memoria:

<NetworkOverviewDemo />

- **Sin DMA**: la CPU participa durante toda la transferencia de datos y no puede hacer otra cosa
- **Con DMA**: la CPU indica al controlador DMA "de dónde a dónde transferir, cuánto transferir" y luego ejecuta otras tareas; el DMA notifica a la CPU al terminar

::: tip Analogía de DMA
Es como **pedir comida a domicilio**:
- **Sin DMA**: vas tú mismo al supermercado a comprar, vuelves a casa, lavas, cocinas (participas en todo el proceso)
- **Con DMA**: llamas por teléfono para hacer el pedido, el repartidor lo lleva directamente a la cocina (otro se encarga de todo, tú solo "recibes" al final)
:::

### 5.5 Mecanismo de interrupciones

La **interrupción** es un mecanismo fundamental en los sistemas informáticos:

1. Cuando un dispositivo de E/S completa una operación, envía una **solicitud de interrupción** a la CPU
2. La CPU está ejecutando instrucciones; al terminar la instrucción actual, responde a la interrupción
3. La CPU guarda el estado actual y salta a la rutina de tratamiento de interrupción
4. Una vez procesada, restaura el estado y continúa la ejecución

---

## 6. Optimización del rendimiento de la CPU: segmentación (pipelining)

### 6.1 Segmentación de instrucciones

La **segmentación de instrucciones (pipelining)** es una técnica de paralelismo que maximiza la eficiencia de la CPU:

<PipelineDemo />

#### Principio de funcionamiento de la segmentación

```
Ejecución secuencial (5 instrucciones, 15 ciclos):
Instr. 1: IF→ID→EX→MEM→WB
Instr. 2:            IF→ID→EX→MEM→WB
Instr. 3:                         IF→ID→EX→MEM→WB
...

Ejecución segmentada (5 instrucciones, 9 ciclos):
Instr. 1: IF→ID→EX→MEM→WB
Instr. 2:    IF→ID→EX→MEM→WB
Instr. 3:       IF→ID→EX→MEM→WB
...
```

En condiciones ideales, el CPI (ciclos por instrucción) para N instrucciones ≈ 1

### 6.2 Riesgos de la segmentación (Hazards)

Aunque la segmentación mejora el rendimiento, también introduce problemas de **riesgos (Hazards)**:

| Tipo | Causa | Solución |
|------|-------|----------|
| **Riesgo estructural** | Conflicto de recursos hardware | Añadir hardware / escalonar la ejecución |
| **Riesgo de datos** | Una instrucción posterior necesita el resultado de una anterior | Adelantamiento de datos (forwarding) / burbujas (bubbles) / planificación |
| **Riesgo de control** | Las instrucciones de salto modifican el flujo de ejecución | Ranura de retardo (delay slot) / predicción de saltos |

---

## 7. Resumen: flujo de arranque del computador

Recapitulemos todo el proceso usando la terminología técnica:

> **Al iniciar un programa, el sistema operativo carga el archivo ejecutable del disco a la memoria. La unidad de búsqueda (IF) de la CPU lee la instrucción desde la memoria al registro de instrucción (IR) a través del bus de direcciones. La unidad de control decodifica la instrucción (ID), identifica el tipo de operación y genera las señales de control correspondientes. La unidad de ejecución (EX) realiza las operaciones aritméticas y lógicas; si se necesita acceder a memoria, se hace a través del bus de datos (MEM); finalmente, el resultado se escribe (WB) en el registro o en la memoria. Todo el proceso está impulsado por el reloj, y la secuencia de microoperaciones emitida por la unidad de control coordina el trabajo ordenado de todos los componentes.**

---

## Lecturas complementarias

| Tema | Contenido recomendado para profundizar |
|------|----------------------------------------|
| Arquitectura de computadores | "Computer Organization and Design: The Hardware/Software Interface" - Patterson & Hennessy |
| Microarquitectura de CPU | "Computer Systems: A Programmer's Perspective" - Bryant & O'Hallaron |
| Arquitectura de conjuntos de instrucciones | Manual de arquitectura ARMv8, Manual Intel x64 |
| Principios de caché | Protocolos de coherencia de caché (MESI), políticas de escritura de caché |
| Sistemas operativos | Capítulo siguiente: "Sistemas operativos" |

---

## Siguiente paso

Ahora dominas los principios profesionales de organización de computadores. A continuación puedes seguir aprendiendo:

- **[Sistemas operativos](./operating-systems.md)**: comprende cómo se ejecutan los programas en un sistema operativo y cómo se implementan los procesos, hilos y la gestión de memoria
- **[Codificación, almacenamiento y transmisión de datos](./data-encoding-storage.md)**: profundiza en cómo se representan los datos en el computador
