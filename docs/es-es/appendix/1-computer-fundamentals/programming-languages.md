# Conceptos de lenguajes de programación: paradigmas, evolución y selección

::: tip Prologo
Por que hay tantos lenguajes de programacion? Cual deberia aprender? Este capitulo te lleva desde la "evolucion de los lenguajes" hasta los "paradigmas de programacion" hasta "como elegir", construyendo una comprension completa del panorama de los lenguajes de programacion. **Conclusion anticipada: no existe el mejor lenguaje, solo el mas adecuado para cada escenario.**
:::

**Que aprenderas en este articulo?**

Despues de completar este capitulo, obtendras:

- **Capacidad de seleccion racional**: al enfrentar "que lenguaje aprender", poder juzgar segun las necesidades del proyecto
- **Profundidad en paradigmas**: entender que "orientacion a objetos" y "programacion funcional" son formas de pensar diferentes
- **Perspectiva historica**: ver mas de 70 anos de evolucion -- de escribir 0 y 1 a codigo generado por lenguaje natural
- **Base para aprendizaje futuro**: fundamentos para disenar lenguajes y tomar decisiones tecnologicas

| Capitulo | Contenido | Concepto clave |
|-----|------|---------|
| **Capitulo 1** | Evolucion de lenguajes | De lenguaje maquina a lenguaje de alto nivel |
| **Capitulo 2** | Paradigmas de programacion | Imperativo, orientado a objetos, funcional |
| **Capitulo 3** | Eleccion de lenguaje | Metodo de seleccion basado en escenarios |

---

## 0. Principios de comunicación entre humanos y computadoras

Imagina que necesitas comunicarte con un robot que solo entiende binario:

- **Escribir 0 y 1 directamente** -- Lo mas primitivo, eficiencia extremadamente baja (lenguaje maquina)
- **Usar mnemotecnicos** -- `MOV AX, 1` es mucho mas reconocible que `10110000 00000001` (lenguaje ensamblador)
- **Usar lenguaje cercano al natural** -- `int sum = 1 + 2;` los humanos pueden leerlo directamente (lenguaje de alto nivel)

**Los lenguajes de programacion son el puente entre humanos y computadoras**, evolucionando durante mas de 70 anos hacia algo "mas cercano al pensamiento humano".

---

## 1. Evolucion de los lenguajes de programacion

Explora la evolucion de los lenguajes de programacion desde los anos 1940 hasta hoy:

<LanguageMapDemo />

::: tip Resumen en una frase
La tendencia evolutiva de los lenguajes: **cada vez mas cercanos al pensamiento humano, mas seguros, mas eficientes**.
:::

---

## 2. Paradigmas de programacion: Formas de pensar

Los paradigmas de programacion no son caracteristicas de lenguajes, sino **formas de pensar** -- como la escritura tiene poesia, novelas y ensayos.

### 2.1 Imperativo -- "Decir a la computadora paso a paso como hacerlo"

```c
int sum = 0;
for (int i = 0; i < n; i++) {
    sum += arr[i];
}
```

### 2.2 Orientado a objetos -- "Encapsular datos y comportamiento en objetos"

```python
class Dog:
    def __init__(self, name):
        self.name = name
    def bark(self):
        print(f"{self.name} says woof!")
```

### 2.3 Funcional -- "Componer con funciones puras, sin modificar estado"

```haskell
sum = foldl (+) 0
-- La misma entrada siempre produce la misma salida
```

### 2.4 Declarativo -- "Solo decir que hacer, no como"

```sql
SELECT name FROM users WHERE active = true
-- La base de datos decide como buscar mas rapido
```

::: tip En el desarrollo real
Los lenguajes modernos son en su mayoria **multiparadigma**. Python soporta tanto orientacion a objetos como programacion funcional; JavaScript igual. No te obsesiones con "cual paradigma es mejor", elige el mas adecuado segun el problema.
:::

---

## 3. Sistema de tipos: Reglas de transito de los datos

| | Fuertemente tipado | Debilmente tipado |
|---|---|---|
| **Estatico** | Java, Rust, TypeScript -- Lo mas seguro | C, C++ -- Eficiente pero cuidado |
| **Dinamico** | Python, Ruby -- Flexible y seguro | JavaScript, PHP -- Flexible pero propenso a errores |

**Pregunta clave**: `"1" + 1` igual a que?
- **JavaScript (debil)**: `"11"` -- Te lo convirtio silenciosamente
- **Python (fuerte)**: `TypeError` -- Te hace pensar

Profundiza en sistemas de tipos -> [Introducción a los sistemas de tipos](./type-systems) | [Principios de compilación](./compilers)

---

## 4. Compilado vs Interpretado

| | Compilado | Interpretado | JIT |
|---|---|---|---|
| **Proceso** | Traducir todo primero, luego ejecutar | Leer y ejecutar linea por linea | Interpretar primero, compilar lo caliente |
| **Velocidad** | Mas rapido | Mas lento | Medio |
| **Depuracion** | Esperar compilacion | Retroalimentacion inmediata | Inmediata + optimizacion |
| **Representantes** | C, Rust, Go | Python, Ruby | Java, JavaScript |

---

## 5. Como elegir un lenguaje de programacion?

### Seleccion por escenario

| Escenario | Lenguaje recomendado | Razon |
|---|---|---|
| **Frontend Web** | JavaScript, TypeScript | El navegador solo entiende JS |
| **Backend Web** | Go, Java, Python, Node.js | Ecosistema maduro |
| **Desarrollo movil** | Swift (iOS), Kotlin (Android) | Recomendacion oficial |
| **IA / Datos** | Python | PyTorch, Pandas estan en Python |
| **Programacion de sistemas** | C, Rust | Control directo del hardware |
| **Cloud native** | Go, Rust | Docker/K8s estan escritos en Go |

### Ruta de aprendizaje recomendada

1. **Python** -- Sintaxis mas simple, puerta de entrada en la era de la IA
2. **JavaScript** -- Esencial para desarrollo Web, frontend y backend
3. **TypeScript** -- Agregar sistema de tipos a JS, experimentar tipado estatico
4. **Go o Rust** -- Entender lenguajes compilados y conceptos de bajo nivel

---

## 6. Resumen

::: tip Puntos clave
1. **Evolucion de lenguajes**: del lenguaje maquina al de alto nivel, cada vez mas cercano al pensamiento humano
2. **Paradigmas**: imperativo, orientado a objetos, funcional, declarativo -- cada uno con sus escenarios
3. **Sistema de tipos**: estatico/dinamico, fuerte/debil -- afecta seguridad y flexibilidad
4. **Modo de ejecucion**: compilado rapido, interpretado flexible, JIT equilibra ambos
5. **No hay bala de plata**: elegir segun el escenario, no buscar "el mejor lenguaje"
:::

**Proximos pasos**:
- [Principios de compilación](./compilers) - Entender el proceso de compilacion
- [Introducción a los sistemas de tipos](./type-systems) - Entender la seguridad de tipos
- [Introducción a las estructuras de datos](./data-structures) - Entender la organizacion de datos
- [Introducción a los algoritmos](./algorithm-thinking) - Aprender metodos de resolucion
