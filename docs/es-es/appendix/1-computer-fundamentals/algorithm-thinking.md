# Introducción a los algoritmos

::: tip Prologo
**Como resolver problemas de manera eficiente?** Quizas te hayas enfrentado a esta duda: el mismo problema, el codigo de alguien se ejecuta en segundos, mientras que el de otra persona sigue girando durante minutos. La diferencia suele estar en el algoritmo. Este capitulo te guia para comprender los conceptos centrales del pensamiento algoritmico.
:::

**Que aprenderas en este articulo?**

Despues de completar este capitulo, obtendras:

- **Capacidad de descomposicion de problemas**: ante problemas complejos, podras pensar en estrategias como divide y venceras, recursion, etc., en lugar de escribir codigo directamente
- **Capacidad de evaluacion de eficiencia**: usar la notacion Big-O para determinar cual de dos soluciones es mas eficiente, en lugar de adivinar por intuicion
- **Pensamiento en complejidad**: estimar el tamano de los datos y los requisitos de tiempo antes de escribir codigo, eligiendo el nivel adecuado de algoritmo
- **Base para aprendizaje futuro**: sentar las bases para estructuras de datos avanzadas, sistemas distribuidos y aprendizaje automatico

| Capitulo | Contenido | Concepto clave |
|-----|------|---------|
| **Capitulo 1** | Busqueda binaria | Divide y venceras, O(log n) |
| **Capitulo 2** | Algoritmos de ordenacion | Burbuja, QuickSort, MergeSort |
| **Capitulo 3** | Analisis de complejidad | Complejidad temporal, complejidad espacial |

---

## 0. Visión general de los algoritmos

Imagina que necesitas buscar una palabra en un diccionario:

- **Metodo 1**: comenzar desde la primera pagina y pasar pagina por pagina (busqueda lineal)
- **Metodo 2**: ubicar por la letra inicial y luego buscar por biparticion (busqueda binaria)

Ambos metodos pueden encontrarla, pero la eficiencia es muy diferente. **Un algoritmo es un metodo para resolver problemas**.

<AlgorithmDemo />

**Indicadores clave de los algoritmos:**

| Indicador | Significado | Por que es importante |
|------|------|-----------|
| **Complejidad temporal** | Tendencia del tiempo de ejecucion al aumentar los datos | Predecir rendimiento con datos a gran escala |
| **Complejidad espacial** | Tendencia del uso de memoria al aumentar los datos | Evaluar el consumo de memoria |
| **Correccion** | Si siempre obtiene resultados correctos | Requisito basico de un algoritmo |

::: tip Interpretacion fila por fila
**Complejidad temporal**: se describe con la notacion Big-O. O(n) significa que si los datos se duplican, el tiempo se duplica; O(n^2) significa que si los datos se duplican, el tiempo se cuadruplica.

**Complejidad espacial**: tambien usa la notacion Big-O. Algunos algoritmos intercambian espacio por tiempo (como las tablas hash), otros intercambian tiempo por espacio (como los algoritmos de compresion).

**Correccion**: un algoritmo debe dar resultados correctos para todas las posibles entradas. Las condiciones de borde (entrada vacia, entrada enorme) son las mas propensas a errores.
:::

---

## 1. Busqueda binaria: eliminar la mitad cada vez

### 1.1 Principio de la busqueda binaria

::: tip Como funciona la busqueda binaria?
**Prerrequisito**: los datos deben estar ordenados

**Proceso**:
1. Encontrar el elemento central
2. Si el elemento central es igual al objetivo, encontrado!
3. Si el objetivo es menor que el elemento central, continuar en la mitad izquierda
4. Si el objetivo es mayor que el elemento central, continuar en la mitad derecha
5. Eliminar la mitad cada vez, hasta encontrar o determinar que no existe

**Complejidad temporal**: O(log n)

**Analogia cotidiana**: el juego de adivinar numeros. Piensa un numero del 1 al 100, cada vez adivinas el central, te digo si es mayor o menor. Con un maximo de 7 intentos puedes acertar (porque 2^7 = 128 > 100).
:::

Prueba aqui abajo:
Esta demostracion muestra como funciona la busqueda binaria. Puedes elegir entre busqueda secuencial o binaria para comparar:

<SearchAlgorithmDemo />

### 1.2 Principios de eficiencia de búsqueda binaria

| Cantidad de datos | Busqueda lineal | Busqueda binaria |
|--------|---------|---------|
| 100 | 100 veces | 7 veces |
| 1,000 | 1,000 veces | 10 veces |
| 1,000,000 | 1,000,000 veces | 20 veces |
| 1,000,000,000 | 1,000,000,000 veces | 30 veces |

::: tip Interpretacion fila por fila
**Primera columna (cantidad de datos)**: cuantos datos se buscan. Se puede ver que la cantidad de datos crece de 100 a 1 billon (un aumento de 10 millones de veces!)

**Segunda columna (busqueda lineal)**: el metodo mas "tonto", comenzando desde el primero y buscando uno por uno. El numero de busquedas es igual a la cantidad de datos; cuantos mas datos, mas busquedas.

**Tercera columna (busqueda binaria)**: el metodo inteligente, eliminando la mitad cada vez. El numero de busquedas solo esta relacionado con el logaritmo de la cantidad de datos; incluso con 1 billon de datos solo necesita 30 veces!

**Conclusion de la comparacion**: cuando la cantidad de datos alcanza 1 millon, la busqueda lineal necesita 1 millon de veces, la busqueda binaria solo necesita 20 veces; una diferencia de 50,000 veces!
:::

::: tip El poder del crecimiento logaritmico
La complejidad temporal de la busqueda binaria es O(log n), lo que significa:

- 1 billon de datos, maximo 30 busquedas
- 1 trillon de datos, maximo 40 busquedas

Este es el poder del crecimiento logaritmico: los datos aumentan 1000 veces, las busquedas solo aumentan 10.
:::

---

## 2. Ordenacion: convertir lo desordenado en ordenado

### 2.1 Algoritmos de ordenacion comunes

| Algoritmo | Complejidad temporal | Caracteristicas | Escenario de uso |
|------|-----------|------|---------|
| **Ordenacion burbuja** | O(n^2) | Simple pero lento | Ensenanza, datos pequenos |
| **Ordenacion por seleccion** | O(n^2) | Simple pero lento | Datos pequenos |
| **Ordenacion por insercion** | O(n^2) | Rapido con datos casi ordenados | Datos pequenos, casi ordenados |
| **QuickSort** | O(n log n) | El mas rapido en la practica | Ordenacion general |
| **MergeSort** | O(n log n) | Ordenacion estable | Escenarios que requieren estabilidad |
| **HeapSort** | O(n log n) | Ordenacion in-place | Escenarios con memoria limitada |

::: tip Interpretacion fila por fila
**Ordenacion burbuja**: el algoritmo de ordenacion mas basico, como las burbujas que suben desde el fondo del agua. Simple y facil de entender, pero el mas lento. Adecuado para aprender el concepto de ordenacion, no para uso practico.

**Ordenacion por seleccion**: cada vez se selecciona el mas pequeno y se coloca al frente. Tambien es simple, pero haga lo que haga con los datos, siempre hace la misma cantidad de comparaciones.

**Ordenacion por insercion**: como organizar las cartas en la mano al jugar poker. Se inserta cada elemento en la parte ya ordenada. Muy eficiente con datos casi ordenados.

**QuickSort**: el mas utilizado en desarrollo real. El mas rapido en promedio, pero en el peor caso (datos ya ordenados) degenera a O(n^2).

**MergeSort**: adopta la idea de "divide y venceras", siempre O(n log n), pero requiere espacio adicional. Adecuado para escenarios que necesitan ordenacion estable.

**HeapSort**: utiliza la estructura de datos heap para ordenar in-place (sin espacio adicional), pero en la practica suele ser mas lento que QuickSort.
:::

### 2.2 Principios de optimización de QuickSort

::: tip Principio de QuickSort
**Idea central**: divide y venceras

1. Seleccionar un elemento "pivote"
2. Colocar los menores que el pivote a la izquierda, los mayores a la derecha
3. Ordenar recursivamente ambas partes
4. Combinar los resultados

**Por que es rapido?**
- Despues de cada division, el pivote esta en su posicion final
- En promedio, cada division elimina aproximadamente la mitad de los elementos
- Complejidad temporal O(n log n)

**Analogia cotidiana**: organizar una estanteria. Sacas un libro, pones los mas delgados a la izquierda y los mas gruesos a la derecha. Luego repites el proceso con cada pila.
:::

Prueba aqui abajo:
Esta demostracion muestra la visualizacion de algoritmos de ordenacion. Puedes generar un array y observar la comparacion entre ordenacion burbuja y QuickSort:

<SortingAlgorithmDemo />

---

## 3. Recursion: llamarse a si mismo

### 3.1 La esencia de la recursion

::: tip Que es la recursion?
**La recursion** es una tecnica de programacion donde una funcion se llama a si misma.

**Dos elementos clave**:
1. **Caso base**: cuando se detiene la recursion?
2. **Paso recursivo**: como descomponer el problema en subproblemas mas pequenos?

**Ejemplo clasico: factorial**
```js
function factorial(n) {
  if (n <= 1) return 1        // Caso base
  return n * factorial(n - 1) // Paso recursivo
}
```

**Analogia cotidiana**: las munecas rusas. Abres una muneca y dentro hay una mas pequena, hasta la mas pequena que ya no se puede abrir.
:::

### 3.2 Recursion vs Iteracion

| Caracteristica | Recursion | Iteracion (bucle) |
|------|------|-------------|
| **Simplicidad del codigo** | Generalmente mas conciso | Puede ser mas complejo |
| **Consumo de memoria** | Mayor (pila de llamadas) | Menor |
| **Rendimiento** | Ligeramente mas lento (sobrecarga de llamadas) | Mas rapido |
| **Escenario de uso** | Recorrido de arboles, divide y venceras | Tareas repetitivas simples |

::: tip Interpretacion fila por fila
**Simplicidad del codigo**: la recursion generalmente solo necesita unas pocas lineas de codigo para expresar logica compleja (como recorrer estructuras de arbol), mientras que con bucles puede necesitar mas variables y anidamiento.

**Consumo de memoria**: la recursion usa la "pila de llamadas" para guardar la informacion de cada nivel, como apilar platos; cada nivel de recursion agrega un plato. Los bucles no necesitan esta sobrecarga.

**Rendimiento**: cada llamada a funcion tiene una sobrecarga (paso de parametros, operaciones de pila, etc.), por lo que la recursion suele ser mas lenta que los bucles.

**Escenario de uso**: la recursion es buena para problemas que son inherentemente recursivos (como arboles de archivos, arboles DOM); los bucles son buenos para operaciones repetitivas simples (como recorrer arrays).
:::

::: warning Trampa de la recursion
**Desbordamiento de pila**: la recursion es tan profunda que se agota el espacio de la pila de llamadas.

**Soluciones**:
- Cambiar a iteracion
- Usar optimizacion de recursion de cola (algunos lenguajes lo soportan)
- Limitar la profundidad de recursion
:::

Prueba aqui abajo:
Esta demostracion muestra el proceso de llamadas recursivas. Observa como la funcion se llama a si misma:

<RecursiveThinkingDemo />

---

## 4. Algoritmo voraz (greedy): elegir lo mejor en cada paso

### 4.1 La idea del algoritmo voraz

::: tip Que es un algoritmo voraz?
**El algoritmo voraz** elige en cada paso la opcion que parece mejor en ese momento, esperando obtener la solucion optima global.

**Condiciones de aplicacion**:
1. **Propiedad de eleccion voraz**: lo optimo local puede llevar a lo optimo global
2. **Subestructura optima**: la solucion optima del problema contiene las soluciones optimas de los subproblemas

**Ejemplo clasico: cambio de monedas**
- Objetivo: usar la menor cantidad de monedas para formar una cantidad
- Estrategia voraz: cada vez elegir la moneda de mayor valor
- Resultado: 67 = 50 + 10 + 5 + 1 + 1 (5 monedas)

**Analogia cotidiana**: al escalar una montana, cada vez eliges el camino mas empinado hacia arriba. Aunque no siempre llegas al pico mas alto, generalmente llegas a una buena posicion.
:::

### 4.2 Limitaciones del algoritmo voraz

::: warning El algoritmo voraz no siempre obtiene la solucion optima
**Contraejemplo: cambio de monedas**

Si las denominaciones son [1, 3, 4] y necesitas formar 6:
- Voraz: 4 + 1 + 1 = 3 monedas
- Optimo: 3 + 3 = 2 monedas

El algoritmo voraz falla aqui!

**Leccion**: el algoritmo voraz es simple y eficiente, pero no siempre obtiene la solucion optima. Antes de usarlo, hay que demostrar que el problema satisface las condiciones voraces.
:::

Prueba aqui abajo:
Esta demostracion muestra el efecto real del algoritmo voraz. Puedes probar diferentes combinaciones de monedas y observar el rendimiento de la estrategia voraz:

<GreedyThinkingDemo />

---

## 5. Paradigmas de diseno de algoritmos

| Paradigma | Idea | Algoritmo tipico | Problema aplicable |
|------|------|---------|---------|
| **Divide y venceras** | Descomponer el problema en subproblemas | QuickSort, MergeSort | Problemas descomponibles |
| **Voraz** | Elegir lo mejor en cada paso | Arbol de expansion minima, codificacion de Huffman | Problemas con propiedad voraz |
| **Programacion dinamica** | Registrar las soluciones de los subproblemas | Problema de la mochila, camino mas corto | Subproblemas superpuestos |
| **Backtracking** | Probar y retroceder si no funciona | Ocho reinas, permutaciones completas | Problemas de busqueda |

::: tip Interpretacion fila por fila
**Divide y venceras**: dividir el problema grande en problemas pequenos, resolverlos por separado y luego combinarlos. Como organizar una casa: primero divides en sala, dormitorio, cocina, limpias cada uno y al final todo esta ordenado.

**Voraz**: cada vez eliges lo mejor actual, sin considerar las consecuencias a largo plazo. Como comer eligiendo primero tu plato favorito; puede no ser la forma optima de comer, pero es rapido.

**Programacion dinamica**: recordar resultados intermedios para evitar calculos repetidos. Como tomar notas: la proxima vez que encuentres el mismo problema, buscas la respuesta directamente sin volver a deducirla.

**Backtracking**: si no funciona, retrocedes y lo intentas de nuevo. Como recorrer un laberinto: si este camino no funciona, vuelves a la ultima interseccion y pruebas otro.
:::

Prueba aqui abajo:
Esta demostracion muestra las caracteristicas y escenarios de aplicacion de diferentes paradigmas de diseno de algoritmos:

<AlgorithmParadigmDemo />

---

## 6. Resumen: Los algoritmos son el arte de resolver problemas

Usemos una analogia para resumir las distintas ideas algoritmicas:

| Idea | Analogia | Punto clave |
|------|------|---------|
| **Busqueda binaria** | Adivinar numeros | Eliminar la mitad cada vez |
| **Ordenacion** | Organizar estanteria | Establecer orden |
| **Recursion** | Munecas rusas | Reducir lo grande a lo pequeno |
| **Voraz** | Escoger camino en la montana | Optimo local |

::: tip Ensenanza central
**La esencia de los algoritmos es el equilibrio entre "eficiencia" y "correccion".**

- Un buen algoritmo puede mejorar la eficiencia del programa en varios ordenes de magnitud
- Pero la optimizacion excesiva puede introducir complejidad
- Primero asegurar la correccion, luego buscar la eficiencia

Comprender el pensamiento algoritmico es mas importante que memorizar algoritmos especificos:
- Divide y venceras: descomponer problemas grandes en pequenos
- Voraz: elegir lo optimo en cada paso
- Programacion dinamica: registrar las soluciones de los subproblemas
- Backtracking: probar y retroceder si no funciona
:::

---

## Lectura adicional

- **Introduction to Algorithms**: el libro de texto clasico para aprender algoritmos sistematicamente
- **LeetCode**: mejorar las habilidades algoritmicas mediante la practica de ejercicios
- **Visualizacion de algoritmos**: comprender intuitivamente el proceso de ejecucion de los algoritmos
- **Algoritmos de competicion**: aprender tecnicas algoritmicas mas avanzadas
