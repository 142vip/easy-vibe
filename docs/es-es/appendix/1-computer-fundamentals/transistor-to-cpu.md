# Fundamentos de circuitos digitales: desde los transistores hasta la CPU

::: tip Prologo
**Como "piensa" la computadora?** Probablemente sabes que la CPU es el "cerebro" del ordenador, pero como funciona realmente? Como pasa de metal y plastico a un dispositivo inteligente capaz de ejecutar programas y procesar datos? Este capitulo te lleva desde los transistores mas basicos hasta entender los principios de construccion de la CPU.
:::

**Que aprenderas en este articulo?**

- **Comprension de terminos**: "frecuencia de CPU", "multinucleo", "set de instrucciones" ya no seran misterios
- **Perspectiva de ejecucion de codigo**: ver como una linea de codigo pasa por fetch, decode, execute, writeback
- **Pensamiento en capas de abstraccion**: entender como cada capa sirve a la superior

| Capitulo | Contenido | Concepto clave |
|-----|------|---------|
| **Capitulo 1** | Transistores | Interruptores del mundo digital |
| **Capitulo 2** | Puertas logicas | Implementacion fisica de la logica booleana |
| **Capitulo 3** | Unidades funcionales | Sumadores, registros, multiplexores |
| **Capitulo 4** | Nucleo CPU | Fetch, decode, execute, writeback |

---

## 0. Vision general: De la arena a la inteligencia

La capacidad de "pensamiento" de las computadoras modernas proviene de algo muy simple: **el interruptor**.

Cuando la corriente pasa por un interruptor, esto representa "1"; cuando no pasa, "0". Si tenemos miles de millones de estos interruptores, y podemos hacer que **la salida de uno controle a otro**, podemos construir redes logicas increiblemente complejas.

La clave para entender los sistemas computacionales es la **abstraccion**. Desde la arena hasta la inteligencia, hay cuatro niveles:

::: tip Desglose por capas
- **Capa 1: Transistores (miles de millones)** -- El "interruptor" mas basico. MOSFET: aplicar voltaje a la puerta permite el flujo entre fuente y drenaje
- **Capa 2: Puertas logicas (miles de millones)** -- Transistores conectados forman AND, OR, NOT, XOR -- matematicas booleanas en circuitos
- **Capa 3: Unidades funcionales (cientos)** -- Combinacion de puertas logicas: sumadores, multiplexores, registros
- **Capa 4: Nucleo CPU (1-128 nucleos)** -- Centro de comando: fetch, decode, execute, writeback
:::

---

## 1. Transistores: Interruptores del mundo digital

<TransistorDemo />

### 1.1 Visión general de los transistores

Un **transistor** es un dispositivo semiconductor que podemos abstraer como un "interruptor" perfecto:
- **Fuente (Source)** y **Drenaje (Drain)**: como los dos extremos de una tuberia
- **Puerta (Gate)**: la valvula que controla el flujo

La diferencia clave: no controlamos con la mano, sino con **voltaje**. Cuando un interruptor puede ser controlado por la senal electrica de otro interruptor, cruzamos el abismo de la "intervencion humana" a la "computacion automatica".

### 1.2 Principios de representación binaria

- **Alto voltaje (ej: 3.3V)** = logico **1** (True)
- **Bajo voltaje (cercano 0V)** = logico **0** (False)

### 1.3 Evolucion del numero de transistores

| Ano | Procesador | Transistores | Proceso |
| ---- | ---------- | ------------ | ------- |
| 1971 | Intel 4004 | 2,300 | 10um |
| 1993 | Intel Pentium | 3.1M | 800nm |
| 2006 | Core 2 Duo | 291M | 65nm |
| 2020 | Apple M1 | 16B | 5nm |
| 2023 | Apple M3 Max | 92B | 3nm |

---

## 2. Puertas logicas: Calcular con interruptores

<LogicGateDemo />

### 2.1 Puertas basicas

- **AND**: Todas las entradas deben ser 1 para que la salida sea 1. Como dos llaves en serie.
- **OR**: Si una entrada es 1, la salida es 1. Como llaves en paralelo.
- **NOT**: Invierte la entrada. 1 se convierte en 0, 0 en 1.
- **XOR**: La salida es 1 cuando las entradas son diferentes. "Detector de diferencia".

### 2.2 Sumar con puertas logicas

Un XOR (para la suma) + un AND (para el acarreo) = **semisumador (Half Adder)**.

<HalfAdderDemo />

El semisumador solo acepta dos entradas. Para sumas multinumero necesitamos el **sumador completo (Full Adder)** que acepta tres entradas (A, B, y el acarreo anterior).

<FullAdderDemo />

Encadenando multiples sumadores completos obtenemos sumas de multiples bits:

<AdderChainDemo />

<CompleteAdderDemo />

---

## 3. Unidades funcionales: Combinacion de puertas logicas

| Modulo | Mision | Analogia |
| ------ | ------ | -------- |
| **Sumador** | Motor aritmetico | Abaco incansable |
| **Multiplexor (MUX)** | Control de flujo de datos | Desvio de ferrocarril |
| **Decodificador** | Traducir instrucciones binarias | Descifrador de claves |
| **Flip-Flop** | Registrar estado | Sube y baja que mantiene posicion |

<FunctionalUnitDemo />

### 3.1 Registros: Almacenamiento de datos

<RegisterDemo />

La memoria se crea mediante **retroalimentacion**: la salida vuelve a la entrada, creando un ciclo cerrado que mantiene el estado. Cuando 32 o 64 flip-flops se alinean bajo la misma senal de reloj, obtenemos un **registro**.

<FlipFlopDemo />

---

## 4. Arquitectura CPU: De unidades funcionales al procesador

### 4.1 Componentes principales

- **ALU (Unidad Aritmetica Logica)**: ejecuta operaciones
- **Banco de registros**: almacenamiento temporal ultra-rapido
- **Bus interno**: transporte de datos entre modulos
- **Unidad de control**: lee instrucciones, genera senales de control

<MinCpuDemo />

### 4.2 Principios de ejecución de instrucciones de la CPU

1. **Fetch**: Leer la instruccion de memoria
2. **Decode**: Analizar que operacion realizar
3. **Execute**: Realizar la operacion en la ALU
4. **Write Back**: Escribir el resultado en registro o memoria

<CpuArchitectureDemo />

::: tip Pipeline: Buscando la maxima eficiencia
En lugar de esperar a que una instruccion complete las 4 etapas antes de comenzar la siguiente, el **pipeline** permite superponerlas: mientras la instruccion A se ejecuta, la B se decodifica y la C se busca.
:::

---

## 5. Resumen: A traves de las capas de abstraccion

1. **Fisica macro**: Arena (dioxido de silicio)
2. **Fisica micro**: Miles de millones de transistores
3. **Algebra digital**: Puertas logicas AND/OR/NOT
4. **Modulos microarquitectonicos**: Unidades funcionales
5. **Arquitectura compleja**: CPU
6. **Reino de aplicaciones**: Software e Internet

::: tip Reflexion final
**El llamado poder de computo no es mas que una enorme cantidad de interruptores reorganizandose en un espacio cerrado; al compas del reloj, completan calculos complejos en esta pequena oblea de silicio.**

"Cantidad conduce a salto cualitativo" -- esta frase se verifica continuamente en la arquitectura de computadoras.
:::

---

## Lectura adicional

- **Libro clasico**: "Computer Organization and Design" - Patterson & Hennessy
- **Simulacion logica digital**: Construir un sumador de 8 bits
- **Arquitectura avanzada**: Cache multinivel, ejecucion fuera de orden, GPU
- **Lenguaje ensamblador**: Entender como el codigo de alto nivel se convierte en instrucciones maquina
