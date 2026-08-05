# Introducción a las estructuras de datos

::: tip Prologo
**Programa = Estructura de Datos + Algoritmo.** Ya aprendimos como la CPU ejecuta instrucciones y como el sistema operativo gestiona recursos. Pero el objeto central que procesan los programas son los **datos** -- informacion de usuarios, listas de productos, relaciones sociales... Como se organizan estos datos en memoria determina directamente la velocidad del programa. La respuesta suele estar en la **eleccion de la estructura de datos**.
:::

**Que aprenderas en este articulo?**

- **Intuicion**: ver un requerimiento y pensar automaticamente en que estructura de datos usar
- **Perspectiva de rendimiento**: diagnosticar si el cuello de botella es la estructura o el algoritmo
- **Pensamiento de compromiso**: entender "espacio por tiempo" y "tiempo por espacio"
- **Lectura de codigo**: HashMap, Stack, Queue ya no seran terminos extranos

| Capitulo | Contenido | Concepto clave |
|-----|------|---------|
| **Capitulo 1** | Vision general | Cuatro categorias de estructuras de datos |
| **Capitulo 2** | Estructuras lineales | Arrays, listas enlazadas, pilas, colas |
| **Capitulo 3** | Tablas hash | Funcion hash, manejo de colisiones, busqueda O(1) |
| **Capitulo 4** | Estructuras de arbol | Arboles binarios, sistema de archivos, DOM |
| **Capitulo 5** | Estructuras de grafo | Grafos dirigidos, no dirigidos, algoritmos de recorrido |
| **Capitulo 6** | Comparacion de rendimiento | Complejidad temporal y espacial |
| **Capitulo 7** | Guia de seleccion | Analisis de escenarios, flujo de decision |

---

## 1. Visión general de las estructuras de datos

Imagina que quieres organizar un monton de libros:

- **Amontonados en el suelo**: buscar libro por libro -- almacenamiento primitivo
- **Numerados en estanteria**: ir directamente a la posicion -- **array**
- **Clasificados en armarios**: primero determinar el armario -- **tabla hash**
- **Ordenados en estantes multinivel**: eliminar la mitad cada vez -- **arbol**

**Las estructuras de datos son la "forma de organizar" los datos** -- determinan como se almacenan, buscan y modifican.

<DataStructureOverviewDemo />

Todas las estructuras se clasifican en cuatro categorias:

| Tipo | Relacion | Representantes | Analogia |
|------|---------|---------|---------|
| **Lineal** | Uno a uno | Array, lista, pila, cola | Vagones de tren |
| **Hash** | Clave→Valor | Tabla hash, diccionario | Fichas de biblioteca |
| **Arbol** | Uno a muchos | Arbol binario, B-tree | Arbol genealogico |
| **Grafo** | Muchos a muchos | Grafo dirigido, no dirigido | Mapa de metro |

---

## 2. Estructuras lineales: La organizacion mas basica

<LinearStructuresDemo />

### 2.1 Array vs Lista enlazada

| Dimension | Array | Lista enlazada |
|---------|------|------|
| **Memoria** | Bloque continuo | Dispersa, unida por punteros |
| **Acceder al n-esimo** | Directo, O(1) | Desde el inicio, O(n) |
| **Insertar en medio** | Mover los de atras, O(n) | Cambiar punteros, O(1) |
| **Tamano** | Fijo al crear | Crece dinamicamente |

### 2.2 Pila y Cola

| Estructura | Regla | Analogia | Donde aparece? |
|------|------|------|-----------------|
| **Pila** | LIFO (ultimo en entrar, primero en salir) | Pila de platos | Pila de llamadas, atras del navegador, Ctrl+Z |
| **Cola** | FIFO (primero en entrar, primero en salir) | Fila para comprar | Cola de tareas, cola de mensajes |

---

## 3. Tabla Hash: La busqueda mas rapida

Las busquedas lineales no son suficientemente rapidas. La tabla hash logra **O(1)** directamente.

<HashTableDemo />

### 3.1 Principio

1. Das una **clave** (ej: "apple")
2. La **funcion hash** calcula un numero (ej: `hash("apple") = 3`)
3. Vas directamente a la posicion 3 -- sin recorrer

### 3.2 Colisiones hash

Dos claves pueden producir el mismo indice -- esto es una **colision hash**.

| Solucion | Principio |
|---------|------|
| **Encadenamiento** | Lista enlazada en la misma posicion |
| **Direccion abierta** | Buscar la siguiente posicion vacia |

---

## 4. Estructuras de Arbol: Expresar jerarquias

<TreeStructureDemo />

### 4.1 Arbol binario de busqueda

Regla simple: **menores a la izquierda, mayores a la derecha**. Busqueda O(log n).

### 4.2 Arboles balanceados

| Tipo | Estrategia | Aplicacion |
|------|---------|---------|
| **AVL** | Balance estricto | Busquedas frecuentes |
| **Rojo-Negro** | Balance aproximado | Java TreeMap, Linux kernel |
| **B-tree** | Multi-via balanceado | Indices de bases de datos |

---

## 5. Estructuras de Grafo: Redes de relaciones complejas

<GraphStructureDemo />

| Tipo | Caracteristica | Analogia |
|------|------|------|
| **No dirigido** | A→B igual que B→A | Amigos de WeChat |
| **Dirigido** | A→B no es B→A | Seguidores de Weibo |
| **Ponderado** | Las aristas tienen peso | Carreteras entre ciudades |

---

## 6. Comparacion de rendimiento

<DataStructureDemo />

| Estructura | Acceso | Busqueda | Insercion | Eliminacion |
|---------|------|------|------|------|
| **Array** | O(1) | O(n) | O(n) | O(n) |
| **Lista** | O(n) | O(n) | O(1) | O(1) |
| **Pila/Cola** | O(n) | O(n) | O(1) | O(1) |
| **Tabla Hash** | -- | O(1) | O(1) | O(1) |
| **Arbol BST** | -- | O(log n) | O(log n) | O(log n) |

---

## 7. Guia de seleccion

| Necesidad | Estructura | Razon |
|---------|---------|---------|
| Acceso por posicion | Array | O(1) acceso aleatorio |
| Insercion/eliminacion frecuente | Lista | O(1) sin mover elementos |
| LIFO (deshacer, recursion) | Pila | Semantica LIFO natural |
| FIFO (cola de tareas) | Cola | Semantica FIFO natural |
| Busqueda rapida por clave | Tabla hash | O(1) busqueda promedio |
| Datos ordenados + busqueda rapida | BST | O(log n) y ordenado |
| Relaciones muchos a muchos | Grafo | Expresa conexiones arbitrarias |

::: tip Regla practica
- **80% de los escenarios**: arrays y tablas hash son suficientes
- **Necesitas orden**: considera arboles
- **Relaciones complejas**: considera grafos
- **No estas seguro?** Usa lo mas simple primero
:::

---

## Lectura adicional

| Tema | Recurso |
|------|---------|
| Visualizacion | [VisuAlgo](https://visualgo.net/) |
| Libro introductorio | "Grokking Algorithms" - Aditya Bhargava |
| Profundizacion | "Data Structures and Algorithm Analysis" - Mark Allen Weiss |
| Practica | [LeetCode](https://leetcode.cn/) |

## Proximos pasos

- **[Introducción a los algoritmos](./algorithm-thinking.md)**: Aprender a resolver problemas con algoritmos
- **[Conceptos de lenguajes de programación](./programming-languages.md)**: Como implementan estas estructuras
