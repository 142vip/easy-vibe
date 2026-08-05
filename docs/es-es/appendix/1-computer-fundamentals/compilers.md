# Principios de compilación

::: tip Prologo
**Cuando presionas el boton "ejecutar", como se convierte el codigo en el resultado en pantalla?** Cada linea de codigo que escribes, la computadora en realidad "no la entiende" -- solo reconoce 0 y 1. El compilador es el "traductor" que convierte el lenguaje humano en lenguaje maquina. Comprender los principios de compilacion te permite entender de donde vienen los mensajes de error, por que algunos lenguajes son rapidos y otros lentos, y la logica subyacente de la optimizacion de codigo.
:::

**Que aprenderas en este articulo?**

Despues de completar este capitulo, obtendras:

- **Vision global**: dominar la canalizacion completa de compilacion desde el codigo fuente hasta el programa ejecutable
- **Analisis lexico**: entender como el compilador divide el codigo en Tokens
- **Analisis sintactico**: entender la construccion del AST (Arbol de Sintaxis Abstracta)
- **Visualizacion de AST**: ver intuitivamente la estructura de arbol del codigo
- **Analisis semantico y optimizacion**: entender los principios de la verificacion de tipos y la optimizacion de codigo
- **Practica de tecnicas de optimizacion**: dominar tecnicas centrales como plegamiento de constantes, eliminacion de codigo muerto
- **Modelo de ejecucion**: distinguir entre compilacion, interpretacion y JIT

| Capitulo | Contenido | Concepto clave |
|-----|------|---------|
| **Capitulo 1** | Que es un compilador | Analogia del traductor, canalizacion de compilacion |
| **Capitulo 2** | Analisis lexico | Token, reglas lexicas |
| **Capitulo 3** | Analisis sintactico | AST, arbol de sintaxis, precedencia |
| **Capitulo 4** | Visualizacion de AST | Arbol de sintaxis interactivo, tipos de nodos |
| **Capitulo 5** | Analisis semantico y optimizacion | Verificacion de tipos, plegamiento de constantes, eliminacion de codigo muerto |
| **Capitulo 6** | Practica de tecnicas de optimizacion | Inline de funciones, extraccion de invariantes de bucle, propagacion de constantes |
| **Capitulo 7** | Compilado vs Interpretado vs JIT | Comparacion de tres modelos de ejecucion |

---

## 0. Vision general: El "viaje de traduccion" del codigo

Imagina que eres un traductor y debes traducir una novela china al ingles. No traduciras palabra por palabra literalmente, sino que:

1. **Identificar palabras** -- dividir las oraciones en palabras (analisis lexico)
2. **Entender la sintaxis** -- juzgar si la estructura de la oracion es correcta (analisis sintactico)
3. **Entender la semantica** -- asegurar que el significado sea coherente y sin contradicciones (analisis semantico)
4. **Pulir y optimizar** -- hacer la traduccion mas natural y fluida (optimizacion de codigo)
5. **Producir la traduccion** -- escribir la version final en ingles (generacion de codigo)

El compilador hace exactamente lo mismo, excepto que traduce lenguajes de programacion.

<CompilerAnalogyDemo />

---

## 1. La canalizacion de seis pasos del compilador

El trabajo del compilador se puede dividir en seis etapas, como una linea de produccion de fabrica, donde cada etapa entrega su resultado a la siguiente.

<CompilerDemo />

::: tip Canalizacion de compilacion
1. **Analisis lexico (Lexical Analysis)**: dividir el codigo fuente en Tokens (palabras)
2. **Analisis sintactico (Syntax Analysis)**: organizar los Tokens en un arbol de sintaxis (AST)
3. **Analisis semantico (Semantic Analysis)**: verificar si los tipos son correctos, si las variables estan declaradas
4. **Generacion de codigo intermedio (IR Generation)**: generar una representacion intermedia independiente de la plataforma
5. **Optimizacion de codigo (Optimization)**: hacer el codigo intermedio mas eficiente
6. **Generacion de codigo (Code Generation)**: generar codigo maquina para la plataforma destino
:::

| Etapa | Entrada | Salida | Analogia |
|------|------|------|------|
| Analisis lexico | Flujo de caracteres del codigo fuente | Flujo de Tokens | Dividir oraciones en palabras |
| Analisis sintactico | Flujo de Tokens | AST (arbol de sintaxis) | Analizar la estructura de la oracion |
| Analisis semantico | AST | AST con tipos | Verificar si el significado es coherente |
| Codigo intermedio | AST con tipos | IR | Escribir el primer borrador |
| Optimizacion de codigo | IR | IR optimizado | Pulir y recortar |
| Generacion de codigo | IR optimizado | Codigo maquina | Producir la version final |

---

## 2. Analisis lexico: dividir el codigo en "palabras"

El analisis lexico es el primer paso de la compilacion. El compilador escanea cada caracter del codigo fuente de izquierda a derecha, agrupandolos en **Tokens (unidades lexicas)** significativas.

<LexerTokenDemo />

Al igual que cuando lees una oracion en ingles, tu cerebro agrupa automaticamente las letras en palabras, el analizador lexico agrupa caracteres en Tokens:

```
Codigo fuente: let x = 10 + 5;

Flujo de Tokens:
[let]   → Palabra clave (palabra reservada del lenguaje)
[x]     → Identificador (nombre de variable)
[=]     → Operador (asignacion)
[10]    → Literal numerico
[+]     → Operador (suma)
[5]     → Literal numerico
[;]     → Separador (fin de instruccion)
```

::: tip Los cinco tipos de Token
- **Palabras clave**: palabras especiales reservadas por el lenguaje, como `let`, `if`, `return`, `function`
- **Identificadores**: nombres definidos por el programador, como nombres de variables, nombres de funciones
- **Literales**: valores escritos directamente en el codigo, como numeros `42`, cadenas `"hello"`
- **Operadores**: simbolos que ejecutan operaciones, como `+`, `-`, `=`, `===`
- **Separadores**: simbolos que separan la estructura del codigo, como `;`, `,`, `(`, `)`
:::

---

## 3. Analisis sintactico: construir el arbol de sintaxis (AST)

El analisis lexico divide el codigo en Tokens, pero estos son solo "palabras" aisladas. La tarea del analisis sintactico es organizar estos Tokens segun las reglas gramaticales en un **Arbol de Sintaxis Abstracta (Abstract Syntax Tree, AST)** -- que refleja la estructura del codigo y la precedencia de las operaciones.

```
Expresion: 1 + 2 * 3

Arbol de sintaxis:        Por que asi?
       +       Porque la precedencia de *
      / \      es mayor que +, entonces
     1   *     2 * 3 se combina primero
        / \    como un subarbol
       2   3
```

::: tip La importancia del AST
El AST es la "estructura de datos central" del compilador; el analisis semantico, la optimizacion y la generacion de codigo posteriores se basan en el. Las herramientas de desarrollo modernas tambien usan extensivamente el AST:
- **ESLint**: analiza el codigo como AST, verifica si viola reglas
- **Prettier**: analiza como AST y luego reformatea la salida
- **Babel**: analiza AST → transforma → genera codigo compatible
- **Refactorizacion en IDE**: renombrado seguro de variables, extraccion de funciones basada en AST
:::

| Estructura sintactica | Secuencia de Tokens | Nodo AST |
|---------|-----------|---------|
| Declaracion de variable | `let` `x` `=` `10` | VariableDeclaration → Identifier + Literal |
| Llamada a funcion | `add` `(` `1` `,` `2` `)` | CallExpression → Identifier + Arguments |
| Condicional | `if` `(` `a` `>` `b` `)` | IfStatement → BinaryExpression + Block |

---

## 4. Visualizacion de AST: ver el "esqueleto" del codigo

Arriba describimos la estructura del AST con texto, pero "ver" es mas intuitivo que "leer". El componente interactivo a continuacion te permite seleccionar diferentes expresiones y observar en tiempo real como se ven sus arboles de sintaxis.

<ASTVisualizerDemo />

A traves de la visualizacion descubriras que las reglas centrales del AST son realmente simples:

| Estructura del codigo | Nodo raiz del AST | Nodos hijos |
|---------|-----------|-------|
| `1 + 2 * 3` | BinaryExpression (+) | Izq: NumericLiteral(1), Der: BinaryExpression(*) |
| `let x = 10` | VariableDeclaration | VariableDeclarator → Identifier(x) + NumericLiteral(10) |
| `add(a, b)` | CallExpression | Identifier(add) + Arguments(a, b) |

::: tip Aplicaciones del AST en el desarrollo diario
Puede que no hayas escrito un compilador directamente, pero usas herramientas basadas en AST todos los dias:
- **ESLint / Prettier**: analizan el codigo como AST, verifican reglas o reformatean
- **Babel / SWC**: analizan AST → transforman sintaxis → generan codigo compatible
- **Refactorizacion en IDE**: renombrado seguro, extraccion de funciones basada en AST
- **Tree-shaking**: analiza import/export en el AST, elimina codigo no utilizado
:::

---

## 5. Analisis semantico y optimizacion de codigo

El analisis sintactico asegura que el codigo sea "estructuralmente correcto", pero eso no significa que su "significado sea correcto". El analisis semantico verifica que el significado del codigo sea valido, y la optimizacion de codigo hace que el programa se ejecute mas rapido.

<CompilationPracticeDemo />

### 5.1 Análisis semántico: verificación de tipos y significado

| Contenido de verificacion | Ejemplo | Resultado |
|---------|------|------|
| Verificacion de tipos | `int x = "hello"` | Tipos incompatibles |
| Verificacion de ambito | Usar variable no declarada `y` | La variable no existe |
| Inferencia de tipos | `1 + 2.0` | Inferir resultado como float |
| Verificacion de parametros | `add(1, 2, 3)` pero la funcion solo acepta 2 parametros | Cantidad de parametros no coincide |

::: tip Los errores que has visto provienen en su mayoria del analisis semantico
- `TypeError: Cannot read properties of undefined` -- verificacion de tipos
- `ReferenceError: x is not defined` -- verificacion de ambito
- `Expected 2 arguments, but got 3` -- verificacion de parametros
:::

### 4.2 Optimizacion de codigo: hacer que el programa sea mas rapido

Antes de generar el codigo final, el compilador realiza diversas optimizaciones en el codigo intermedio. Estas optimizaciones son transparentes para el programador, pero pueden mejorar significativamente el rendimiento.

| Tecnica de optimizacion | Antes | Despues | Principio |
|---------|-------|-------|------|
| Plegamiento de constantes | `x = 10 + 5` | `x = 15` | Calcular el resultado en tiempo de compilacion |
| Eliminacion de codigo muerto | `if (false) { ... }` | Eliminar directamente | Codigo que nunca se ejecutara |
| Propagacion de constantes | `x = 15; y = x * 2` | `y = 30` | Reemplazar directamente con valores conocidos |
| Extraccion de invariantes de bucle | Calcular repetidamente `len = arr.length` dentro del bucle | Mover fuera del bucle | Evitar calculos repetidos |

---

## 6. Practica de tecnicas de optimizacion: como el compilador hace el codigo mas rapido

Arriba mencionamos los nombres de varias tecnicas de optimizacion, ahora veamos en detalle como lo hace el compilador. El componente interactivo a continuacion muestra las 5 optimizaciones de compilador mas comunes; puedes comparar intuitivamente las diferencias antes y despues de la optimizacion.

<CodeOptimizationDemo />

Los compiladores modernos y motores JIT (como V8, GCC, LLVM) aplican automaticamente decenas de optimizaciones. Como desarrollador, no necesitas hacerlas manualmente, pero entenderlas te ayuda a:

- **Escribir codigo mas facil de optimizar**: por ejemplo, usar `const` en lugar de `let`, el compilador puede hacer plegamiento de constantes mas facilmente
- **Entender las diferencias de rendimiento**: por que las funciones pequenas son mas rapidas que las grandes? Porque el compilador puede hacer inline de ellas
- **Evitar la "desoptimizacion"**: ciertos patrones de escritura impiden la optimizacion del compilador, como `eval()` y `with`

| Tecnica de optimizacion | Condicion de activacion | Impacto en rendimiento | Que puede hacer el desarrollador |
|---------|---------|---------|-------------|
| Plegamiento de constantes | Expresiones con todas constantes | Eliminar calculo en tiempo de ejecucion | Usar mas declaraciones const |
| Eliminacion de codigo muerto | Codigo inalcanzable o resultado no utilizado | Reducir tamano del codigo | Limpiar codigo no utilizado oportunamente |
| Extraccion de invariantes de bucle | Calculo invariante dentro del bucle | Reducir calculos repetidos | La extraccion manual tambien es un buen habito |
| Inline de funciones | Funciones pequenas llamadas frecuentemente | Eliminar overhead de llamadas | Mantener funciones pequenas y enfocadas |
| Propagacion de constantes | Valor de variable determinable en compilacion | Toda la cadena de calculo se elimina | Usar constantes en lugar de numeros magicos |

---

## 7. Compilado vs Interpretado vs JIT

Despues de escribir el codigo, hay tres "formas de traduccion" para ejecutarlo. Estas tres formas tienen ventajas y desventajas, y determinan directamente las caracteristicas de rendimiento y los escenarios de uso del lenguaje.

<CompileVsInterpretDemo />

| Dimension | Compilado | Interpretado | JIT (Compilacion en tiempo real) |
|------|-------|-------|------------|
| Proceso | Compilar todo a codigo maquina primero, luego ejecutar | Leer y ejecutar linea por linea, traducir al vuelo | Interpretar primero, luego compilar el codigo caliente |
| Velocidad de ejecucion | La mas rapida | La mas lenta | Media (codigo caliente cercano al compilado) |
| Velocidad de inicio | Lenta (necesita compilacion) | Rapida (ejecucion directa) | Media (necesita calentamiento) |
| Multiplataforma | Necesita recompilar | Naturalmente multiplataforma | Multiplataforma |
| Lenguajes representativos | C, Rust, Go | Python, Ruby | JavaScript (V8), Java |

::: tip Por que JavaScript es tan rapido?
El compilador JIT del motor V8 monitorea que codigo se ejecuta con frecuencia (codigo caliente) y luego lo compila en codigo maquina altamente optimizado. Asi que aunque JavaScript es un "lenguaje interpretado", en V8 su rendimiento puede acercarse al de los lenguajes compilados. Esta es tambien la base que permite que Node.js funcione en el lado del servidor.
:::

---

## Resumen

Los principios de compilacion no son un conocimiento que solo los desarrolladores de compiladores necesitan conocer. Comprender el proceso de compilacion te ayuda a entender mejor los mensajes de error, elegir el lenguaje adecuado y escribir codigo mas eficiente.

Repaso de los puntos clave de este capitulo:

1. **El compilador es un traductor**: convierte codigo legible por humanos en instrucciones ejecutables por maquinas
2. **Canalizacion de seis pasos**: analisis lexico → analisis sintactico → analisis semantico → codigo intermedio → optimizacion → generacion de codigo
3. **El analisis lexico divide en Tokens**: divide el flujo de caracteres en unidades significativas como palabras clave, identificadores, operadores
4. **El analisis sintactico construye el AST**: organiza los Tokens en una estructura de arbol segun las reglas gramaticales, reflejando la precedencia de operaciones
5. **El analisis semantico asegura la correccion**: verificacion de tipos, verificacion de ambito; la mayoria de los errores que has visto provienen de aqui
6. **El compilador optimiza automaticamente**: tecnicas como plegamiento de constantes, eliminacion de codigo muerto, inline de funciones hacen que el codigo se acelere automaticamente
7. **Tres modelos de ejecucion**: compilado el mas rapido, interpretado el mas flexible, JIT combina ambos

## Lectura adicional

- [AST Explorer](https://astexplorer.net/) - Ver en linea la estructura AST del codigo
- [Crafting Interpreters](https://craftinginterpreters.com/) - Implementar un lenguaje de programacion desde cero (libro en linea gratuito)
- [The Super Tiny Compiler](https://github.com/jamiebuilds/the-super-tiny-compiler) - Un compilador mini implementado en JavaScript
- [V8 Blog](https://v8.dev/blog) - Blog de tecnologia de compilacion JIT del motor V8
- [Sitio oficial de LLVM](https://llvm.org/) - La infraestructura de compilador mas popular
