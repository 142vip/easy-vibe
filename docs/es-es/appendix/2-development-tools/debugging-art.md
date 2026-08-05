# Principios y arte de la depuración

::: tip Prólogo
**Has terminado de escribir el código, lo ejecutas y falla; ¿y ahora qué?** Muchos principiantes se atascan en este punto, mirando la pantalla sin saber qué hacer. La depuración (Debug) es una de las habilidades más centrales de la programación, incluso más importante que escribir código. Porque escribir código ocupa solo el 30% del tiempo de desarrollo; el 70% restante se dedica a entender el problema, localizar el error y verificar la corrección.
:::

**¿Qué aprenderás en este artículo?**

Después de completar este capítulo, habrás adquirido:

- **Mentalidad de depuración**: Establecer un método sistemático de localización de problemas, sin "adivinar"
- **Capacidad de lectura de errores**: Entender los mensajes de error y localizar rápidamente el problema en la pila de llamadas
- **Métodos clásicos de depuración**: Dominar la bisección, el pato de goma, la reproducción mínima y otras técnicas clásicas
- **Habilidad con herramientas**: Conocer los escenarios de uso de la depuración con puntos de interrupción, con registros y de red
- **Depuración asistida por IA**: Aprender a usar la IA para acelerar la depuración sin depender de ella

| Capítulo | Contenido | Concepto clave |
|-----|------|---------|
| **Capítulo 1** | Leer los mensajes de error | Tipos de errores, seguimiento de pila |
| **Capítulo 2** | Métodos clásicos de depuración | Bisección, pato de goma, reproducción mínima |
| **Capítulo 3** | Caja de herramientas de depuración | Puntos de interrupción, registros, captura de red |
| **Capítulo 4** | Depuración en la era de la IA | Asistencia IA + juicio humano |
| **Capítulo 5** | Mentalidad y hábitos de depuración | Programación defensiva, registros de depuración |

---

## 0. Vista general: la depuración es un método científico

Depurar no es "tentar la suerte", sino un proceso científico riguroso. La metodología que usan los físicos en sus experimentos se aplica perfectamente a la depuración:

1. **Observar el fenómeno**: ¿Qué problema tiene el programa? ¿Qué error muestra?
2. **Plantear una hipótesis**: ¿Qué causa podría haberlo provocado?
3. **Diseñar un experimento**: ¿Cómo verificar esta hipótesis?
4. **Verificar la conclusión**: Si la hipótesis es correcta, corregir; si no, plantear otra

::: tip Regla de oro de la depuración
- **Primero reproducir, luego corregir**: Un error que no se puede reproducir de forma estable, no sabrás si realmente lo has corregido
- **Cambiar solo una variable a la vez**: Si cambias varias cosas a la vez, no sabrás cuál resolvió el problema
- **Confiar en la evidencia, no en la intuición**: Cuando piensas "no puede ser aquí", suele ser precisamente ahí
- **¿Qué se ha cambiado recientemente?**: El 80% de los errores son introducidos por cambios recientes
:::

---

## 1. Leer los mensajes de error: el error no es tu enemigo, es una pista

El error más común de los principiantes: entrar en pánico al ver un error y cerrarlo o ignorarlo. En realidad, **el mensaje de error es el programa diciéndote dónde está el problema**; es tu mejor amigo.

### 1.1 Los tres grandes tipos de errores

| Tipo | Cuándo aparece | Ejemplo | Gravedad |
|-----|------------|------|---------|
| **Error de sintaxis** | El error aparece antes de ejecutar el código | Falta un paréntesis, palabra clave mal escrita | El más fácil de corregir |
| **Error en tiempo de ejecución** | El código se bloquea al llegar a cierta línea | Acceder a una variable que no existe, división por cero | Dificultad media |
| **Error de lógica** | El código funciona, pero el resultado es incorrecto | Fórmula de cálculo errónea, condición invertida | El más difícil de detectar |

### 1.2 Cómo leer la pila de errores

Tomando JavaScript como ejemplo, un mensaje de error típico:

```
TypeError: Cannot read properties of undefined (reading 'name')
    at getUserName (app.js:15:23)
    at handleClick (app.js:42:10)
    at HTMLButtonElement.<anonymous> (app.js:58:5)
```

**Lee de arriba hacia abajo**:

1. **Primera línea**: Tipo de error + descripción → `TypeError`, intentando leer la propiedad `name` de `undefined`
2. **Segunda línea**: Función y ubicación del error → función `getUserName`, línea 15, columna 23 de `app.js`
3. **Líneas siguientes**: Cadena de llamadas → ¿Quién llamó a esta función? `handleClick` → evento de clic del botón

::: tip Regla mnemotécnica para leer la pila
**Busca la causa de arriba hacia abajo, busca el origen de abajo hacia arriba.** La primera línea te dice "qué error ocurrió", la última te dice "dónde empezó".
:::

### 1.3 Referencia rápida de errores comunes

| Nombre del error | Significado | Causas comunes |
|---------|------|---------|
| `SyntaxError` | Error de sintaxis | Paréntesis sin cerrar, falta una coma |
| `TypeError` | Error de tipo | Operar sobre `undefined`/`null` |
| `ReferenceError` | Error de referencia | Usar una variable no declarada |
| `RangeError` | Error de rango | Índice fuera de límites, recursión demasiado profunda |
| `NetworkError` | Error de red | Fallo en petición API, problemas de CORS |
| `404 Not Found` | Recurso no encontrado | URL incorrecta, archivo eliminado |
| `500 Internal Server Error` | Error interno del servidor | El código del backend ha fallado |

### 1.4 Comparación con errores en Python

La pila de Python se lee en sentido contrario a JavaScript: **de abajo hacia arriba**:

```python
Traceback (most recent call last):
  File "main.py", line 10, in <module>
    result = calculate(data)
  File "main.py", line 5, in calculate
    return data["price"] * data["quantity"]
KeyError: 'quantity'
```

La **última línea** es la causa del error: `KeyError: 'quantity'`, el diccionario no tiene la clave `quantity`.

::: tip Diferentes lenguajes, mismo enfoque
Sea cual sea el lenguaje, los mensajes de error siempre contienen tres informaciones clave: **qué error** (tipo), **dónde** (archivo y línea), **por qué** (descripción). Aprender a extraer estas tres informaciones te permitirá leer los errores de cualquier lenguaje.
:::

---

## 2. Métodos clásicos de depuración: la sabiduría acumulada

Estos métodos no requieren ninguna herramienta, solo tu cerebro. Son la base de todas las técnicas avanzadas de depuración.

### 2.1 Depuración por bisección

**Idea central**: Reducir el alcance del problema a la mitad, y a la mitad otra vez, hasta encontrar la raíz.

**Escenario**: El código es largo y no sabes qué parte falla.

**Pasos**:

1. Añadir un `console.log` (o `print`) en la mitad del código
2. Si el error ocurre antes del punto medio → el problema está en la mitad superior
3. Si el error ocurre después del punto medio → el problema está en la mitad inferior
4. Repetir los pasos anteriores con la mitad donde está el problema

```
100 líneas de código con un error
    ↓ Añadir log en la línea 50
El problema está entre las líneas 50-100
    ↓ Añadir log en la línea 75
El problema está entre las líneas 50-75
    ↓ Añadir log en la línea 62
¡El problema está entre las líneas 60-62!
```

::: tip El poder de la bisección
Con 100 líneas de código, necesitas como máximo 7 iteraciones (log₂100 ≈ 7) para localizar la línea exacta. Con 1000 líneas solo necesitas 10.
:::

### 2.2 Método del pato de goma

**Idea central**: Explicar el problema línea por línea a otra persona (o un pato de goma); mientras lo explicas, descubrirás el error tú mismo.

**¿Por qué funciona?** Porque "escribir código" y "explicar código" usan diferentes áreas del cerebro. Cuando te ves obligado a describir verbalmente cada paso lógico, las suposiciones que "creías correctas" salen a la luz.

**Cómo practicarlo**:

1. Abre el código problemático
2. Explica línea por línea: "¿Qué hace esta línea? ¿Por qué lo hace así?"
3. Cuando digas "Hmm, aquí debería ser... espera", el error suele estar ahí

### 2.3 Reproducción mínima

**Idea central**: Simplificar el problema complejo al mínimo, conservando solo el código indispensable para reproducir el error.

**¿Por qué es importante?**

- En un sistema complejo, el error puede estar "enmascarado" por otro código
- La reproducción mínima elimina factores de ruido y hace el problema evidente
- También facilita pedir ayuda: nadie quiere revisar 500 líneas de código

**Pasos**:

1. Crear un archivo vacío nuevo
2. Copiar solo el código relacionado con el problema
3. Reducir gradualmente hasta que al eliminar cualquier línea el error desaparezca
4. Lo que queda es la raíz del error

### 2.4 Método de reversión (Git Bisect)

**Idea central**: Si el código "antes funcionaba y ahora no", encontrar qué commit introdujo el problema.

```bash
# Herramienta de búsqueda binaria integrada en Git
git bisect start
git bisect bad          # Marcar la versión actual como con error
git bisect good abc123  # Marcar una versión antigua que funcionaba
# Git cambiará automáticamente al commit del medio; pruébalo y dile si es good o bad
# Tras repetir unas veces, encontrarás el commit que introdujo el error
```

::: tip Guía para elegir el método de depuración
| Situación | Método recomendado |
|-----|---------|
| No sé qué parte del código falla | Bisección |
| La lógica parece correcta pero el resultado es erróneo | Pato de goma |
| Error en un sistema complejo | Reproducción mínima |
| "Antes funcionaba y de repente dejó de hacerlo" | Reversión / Git Bisect |
:::

---

## 3. Caja de herramientas de depuración: las herramientas adecuadas duplican la eficiencia

La metodología es la base, pero las buenas herramientas pueden multiplicar la eficiencia de la depuración.

### 3.1 console.log / print: lo más sencillo y práctico

**Escenario**: Verificar rápidamente el valor de variables y confirmar hasta dónde se ejecutó el código.

```javascript
// JavaScript
console.log('Función llamada, los parámetros son:', data)
console.log('Resultado del cálculo:', result)
console.table(arrayData)  // Muestra arrays/objetos en formato tabla
```

```python
# Python
print(f"Valor actual: {value}")
print(f"Tipo: {type(data)}")  # Verificar el tipo de dato
```

**Técnicas avanzadas**:

| Método | Uso |
|-----|------|
| `console.log()` | Salida normal |
| `console.warn()` | Advertencia amarilla, fácil de encontrar entre muchos registros |
| `console.error()` | Error en rojo |
| `console.table()` | Muestra arrays y objetos en tabla |
| `console.time()` / `console.timeEnd()` | Medir el tiempo de ejecución del código |
| `console.trace()` | Imprimir la pila de llamadas |

### 3.2 Depuración con puntos de interrupción: ejecutar línea por línea

**Escenario**: Lógica compleja que requiere seguimiento paso a paso.

**En el navegador (Chrome DevTools)**:

1. Abrir Herramientas de Desarrollador (F12) → panel Sources
2. Encontrar el archivo fuente, hacer clic en el número de línea para establecer un punto de interrupción
3. Activar la operación relevante; el código se pausará en el punto de interrupción
4. Usar los botones de control para ejecutar paso a paso:
   - **Continuar** (F8): Ejecutar hasta el siguiente punto de interrupción
   - **Paso por encima** (F10): Ejecutar la línea actual sin entrar en funciones
   - **Paso hacia dentro** (F11): Entrar dentro de la función
   - **Paso hacia fuera** (Shift+F11): Salir de la función actual

**En VS Code**:

1. Hacer clic a la izquierda del número de línea para establecer un punto de interrupción (punto rojo)
2. Pulsar F5 para iniciar la depuración
3. Ver los valores actuales de todas las variables en el panel "Variables"
4. Añadir expresiones de tu interés en el panel "Vigilancia"

::: tip Puntos de interrupción vs console.log
**console.log** es ideal para verificaciones rápidas; se elimina tras usarlo. Los **puntos de interrupción** son para analizar lógica compleja en profundidad. No se sustituyen mutuamente, se complementan.
:::

### 3.3 Depuración de red: problemas entre frontend y backend

**Escenario**: La página no se muestra correctamente, pero no estás seguro de si el problema viene del frontend o de los datos devueltos por el backend.

**Chrome DevTools → Panel Network**:

| Qué observar | Qué problemas puedes descubrir |
|---------|--------------|
| **Código de estado** | 404 (dirección incorrecta), 500 (servidor caído), 403 (sin permisos) |
| **Parámetros de la petición** | ¿Son correctos los datos enviados por el frontend? |
| **Datos de respuesta** | ¿Es correcto el formato de datos devuelto por el backend? |
| **Tiempo de la petición** | ¿Qué endpoint es demasiado lento y ralentiza la página? |
| **Cabeceras de la petición** | ¿Se incluye el Token? ¿Es correcto el Content-Type? |

**Regla mnemotécnica**: Primero revisa el código de estado, luego los parámetros de la petición, y finalmente los datos de respuesta.

### 3.4 Referencia rápida de herramientas de depuración

| Tipo de problema | Herramienta recomendada |
|---------|---------|
| Valor de variable incorrecto | console.log / Punto de interrupción |
| Orden de ejecución lógica incorrecto | Punto de interrupción |
| Fallo en petición API | Panel Network |
| Estilos de página incorrectos | Panel Elements (inspeccionar CSS) |
| Problemas de rendimiento | Panel Performance / console.time |
| Fuga de memoria | Panel Memory |

---

## 4. Depuración en la era de la IA: que la IA sea tu asistente

Las herramientas de IA (ChatGPT, Claude, Cursor, etc.) pueden acelerar enormemente la depuración, pero necesitas saber cómo usarlas.

### 4.1 En qué es buena la IA

| La IA es buena en | La IA no es buena en |
|--------|----------|
| Explicar el significado de los mensajes de error | Entender tu lógica de negocio |
| Proporcionar soluciones a problemas comunes | Decidir qué solución se adapta mejor a tu proyecto |
| Generar fragmentos de código de depuración | Reproducir errores que solo ocurren en entornos específicos |
| Analizar problemas potenciales en el código | Entender el contexto de sistemas complejos |

### 4.2 La forma correcta de preguntar a la IA

**Pregunta mala**:
> "Mi código da error, échale un vistazo"

**Pregunta buena**:
> "Estoy escribiendo un componente de formulario en React, y al enviar me da el error `TypeError: Cannot read properties of undefined (reading 'email')`. Aquí está el código relacionado: [pegar código]. Ya he confirmado que el formato de datos devuelto por la API es correcto; el problema probablemente está en el procesamiento de datos del frontend."

**Plantilla para preguntar**:

```
1. Qué estoy haciendo: [contexto]
2. Comportamiento esperado: [qué debería pasar]
3. Comportamiento real: [qué está pasando]
4. Mensaje de error: [error completo]
5. Código relacionado: [pegar código]
6. Lo que ya he intentado: [qué he descartado]
```

### 4.3 Las trampas de la depuración con IA

::: warning Tres trampas de la depuración con IA
1. **La IA puede "afirmar con confianza cosas erróneas"**: La solución que da la IA puede parecer razonable pero ser completamente incorrecta. Siempre verifica por tu cuenta.
2. **La IA no conoce tu contexto**: No sabe la estructura de tu proyecto, las versiones de dependencias ni el entorno de ejecución. Necesitas proporcionarle suficiente contexto.
3. **La dependencia excesiva de la IA degrada tu capacidad de depuración**: Si cada error se lo pasas directamente a la IA, nunca aprenderás a depurar por ti mismo. Te sugerimos analizar por tu cuenta durante 5 minutos antes de acudir a la IA.
:::

### 4.4 La combinación ideal: IA + humano

```
Encuentras un error
  ↓
Paso 1: Leer el mensaje de error tú mismo (1 minuto)
  ↓
Paso 2: Plantear una hipótesis (2 minutos)
  ↓
Paso 3: Verificar la hipótesis rápidamente (2 minutos)
  ↓
¿Atascado? → Envía el error + código + tu análisis a la IA
  ↓
La IA da sugerencias → Tú juzgas si son razonables → Verificas
```

---

## 5. Mentalidad y hábitos de depuración: de "apagar incendios" a "prevenir incendios"

La mejor depuración es la que no se necesita. Los buenos hábitos reducen los errores desde la raíz.

### 5.1 Programación defensiva

**Idea central**: Al escribir código, asumir que "todo puede fallar" y anticipar protecciones.

```javascript
// Mal: asumir que data siempre existe
const name = data.user.name

// Bien: escritura defensiva
const name = data?.user?.name ?? 'Usuario desconocido'
```

```python
# Mal: asumir que el archivo siempre se puede abrir
content = open('config.json').read()

# Bien: escritura defensiva
try:
    content = open('config.json').read()
except FileNotFoundError:
    print("El archivo de configuración no existe, usando configuración por defecto")
    content = '{}'
```

### 5.2 Escribir buenos registros (logs)

Los registros son clave para la "depuración post-mortem". En producción no puedes poner puntos de interrupción; solo puedes confiar en los registros.

| Nivel de registro | Uso | Ejemplo |
|---------|------|------|
| **DEBUG** | Información detallada durante el desarrollo | Valores de variables, parámetros de funciones |
| **INFO** | Flujo normal del negocio | "Inicio de sesión exitoso", "Pedido creado" |
| **WARN** | No afecta la funcionalidad pero requiere atención | "Cache miss", "Reintento nº 2" |
| **ERROR** | Ha ocurrido un error que necesita gestión | "Conexión a base de datos fallida", "Timeout de API" |

::: tip Estándar de un buen registro
Un buen registro debería responder: **Cuándo**, **Dónde**, **Qué pasó**, **Cuáles son los datos clave**.
```
[2025-01-15 14:30:22] [ERROR] [OrderService] Error al crear pedido
  ID de usuario: 12345, ID de producto: 67890, Causa: stock insuficiente
```
:::

### 5.3 Lista de comprobación para la depuración

Cuando encuentres un error, sigue este orden:

1. **Leer el mensaje de error**: Tipo de error, archivo, línea
2. **¿Qué se ha cambiado recientemente?**: Usar `git diff` para ver los cambios recientes
3. **¿Se puede reproducir?**: Encontrar pasos de reproducción estables
4. **Reducir el alcance**: Usar bisección o reproducción mínima
5. **Plantear y verificar hipótesis**: Cambiar solo una variable a la vez
6. **Pruebas de regresión tras la corrección**: Asegurar que la corrección no introduce nuevos problemas

### 5.4 Errores comunes de los principiantes

| Trampa | Lo correcto |
|-----|---------|
| Empezar a cambiar código sin leer el error | Leer primero el mensaje de error completo |
| Cambiar varias cosas a la vez | Cambiar solo una cosa, verificar antes de pasar a la siguiente |
| Hacer commit sin probar tras cambiar | Ejecutar tests después de cada cambio |
| Probar solo en tu ordenador | Considerar diferentes entornos (navegadores, sistemas, redes) |
| No limpiar los console.log tras depurar | Eliminar todo el código de depuración antes de hacer commit |
| Reiniciar/reinstalar cuando hay problemas | Entender primero la causa; reiniciar es solo temporal |

---

## 6. Resumen

La depuración es un oficio que requiere práctica deliberada. Repasemos los puntos clave del capítulo:

1. **La depuración es un método científico**: Observar → Hipótesis → Experimento → Verificación, no es suerte
2. **Los mensajes de error son amigos**: Aprender a extraer "qué error, dónde, por qué" de los mensajes
3. **Los métodos clásicos nunca pasan de moda**: Bisección, pato de goma, reproducción mínima son la base de toda depuración
4. **Usa las herramientas adecuadas para cada situación**: console.log para verificación rápida, puntos de interrupción para análisis profundo, Network para investigar APIs
5. **La IA es asistente, no muleta**: Primero analiza tú, luego pide ayuda a la IA, y finalmente verifica tú mismo
6. **Prevenir es mejor que curar**: La programación defensiva y los buenos hábitos de registro reducen los errores desde la raíz

::: tip Recuerda esto
**Cada error es una oportunidad de aprendizaje.** Cada error que corriges desarrolla tu capacidad de "reconocimiento de patrones"; la próxima vez que encuentres un problema similar, localizarás la causa más rápido.
:::

---

## Lecturas adicionales

- [Documentación oficial de Chrome DevTools](https://developer.chrome.com/docs/devtools/) — Guía completa de las herramientas de depuración del navegador
- [Depuración en VS Code](https://code.visualstudio.com/docs/editor/debugging) — Tutorial de depuración con puntos de interrupción en VS Code
- [How to Debug Anything](https://www.debuggingbook.org/) — Metodología sistemática de depuración
