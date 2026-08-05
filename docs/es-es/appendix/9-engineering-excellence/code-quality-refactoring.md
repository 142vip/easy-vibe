# Introducción a la calidad del código y la refactorización

::: tip Prefacio
**¿Basta con que el código funcione?** Probablemente has escrito código que cumple su función, pero dos semanas después ni tú mismo lo entiendes. O alguien del equipo se fue y dejó un código que "solo Dios y él podían entender".

Este capítulo te ayudará a entender qué es el buen código, cómo identificar el mal código y cómo mejorarlo de forma segura.
:::

**¿Qué aprenderás en este artículo?**

| Capítulo | Contenido | Concepto clave |
|-----|------|---------|
| **Capítulo 1** | Malos olores del código | Identificar problemas comunes |
| **Capítulo 2** | Técnicas de refactorización | Mejorar el código de forma segura |
| **Capítulo 3** | Revisión de código | Garantía de calidad en la colaboración del equipo |
| **Capítulo 4** | Métricas de calidad | Medir la salud del código con datos |

Al finalizar este capítulo, dominarás los métodos para identificar problemas en el código, refactorizar de forma segura y mejorar continuamente la calidad del código mediante la colaboración en equipo.

---

## 0. Panorama general: El ciclo de vida del código

En el desarrollo de software hay un hecho que a menudo se pasa por alto: **el código se lee muchas más veces de las que se escribe**.

Un fragmento de código, desde su creación hasta su retiro, recorre aproximadamente este camino:

::: tip La vida del código
- **Fase de escritura**: El desarrollador escribe la primera versión, la funcionalidad funciona, las pruebas pasan.
- **Fase de revisión**: Los miembros del equipo leen el código y sugieren mejoras.
- **Fase de mantenimiento**: Corregir bugs, agregar funcionalidades, adaptar a nuevos requisitos — esta fase ocupa más del 80% del ciclo de vida del código.
- **Fase de refactorización**: Cuando el código se vuelve difícil de mantener, es necesario mejorar su estructura interna sin cambiar su comportamiento externo.
- **Fase de retiro**: La tecnología evoluciona y el código antiguo es reemplazado por nuevas soluciones.
:::

Martin Fowler dijo en su libro *Refactoring*: **"Cualquier imbécil puede escribir código que un ordenador entienda. Solo los buenos programadores pueden escribir código que los humanos entiendan."**

---

## 1. Malos olores del código: Identificar problemas comunes

### 1.1 Introducción a malos olores del código

El concepto de "Code Smell" (mal olor del código) fue propuesto por Kent Beck. Se refiere a características del código que **aunque no son bugs, sugieren problemas de diseño más profundos**. Es como cuando hay un olor raro en una habitación — no te enfermará inmediatamente, pero indica que algo necesita limpieza.

A través del siguiente componente interactivo, identifica los malos olores de código más comunes:

<CodeSmellDemo />

### 1.2 Lista de malos olores comunes

| Mal olor | Síntoma | Peligro |
|-------|------|------|
| **Funciones demasiado largas** | Funciones de más de 50 líneas | Difíciles de entender, probar y reutilizar |
| **Números mágicos** | Escribir directamente `86400000` en el código | Significado poco claro, fácil de omitir al modificar |
| **Código duplicado** | Lógica similar aparece en múltiples lugares | Al modificar, hay que sincronizar varios sitios, fácil de olvidar |
| **Anidamiento excesivo** | Más de 3 niveles de if/for | La lógica es como un laberinto, difícil de seguir |
| **Lista de parámetros demasiado larga** | Más de 4 parámetros en una función | Difícil de llamar, fácil de pasar en orden incorrecto |
| **Clase todopoderosa (God Class)** | Una clase/módulo hace demasiadas cosas | Responsabilidades poco claras, un cambio afecta a todo |

::: tip Insight clave
Los malos olores no son "errores", son "señales". Te indican que el diseño aquí podría necesitar mejoras. No todos los malos olores necesitan ser corregidos inmediatamente, pero necesitas la capacidad de identificarlos.
:::

---

## 2. Técnicas de refactorización: Mejorar el código de forma segura

### 2.1 Introducción a refactorización

La refactorización (Refactoring) tiene una definición muy precisa: **mejorar la estructura interna del código sin cambiar su comportamiento externo.**

La palabra clave es "sin cambiar el comportamiento externo". Refactorizar no es reescribir, no es agregar funcionalidades, no es corregir bugs. Es como "ordenar y organizar" el interior del código.

A través del siguiente componente, compara los cambios antes y después de varias técnicas de refactorización comunes:

<RefactoringDemo />

### 2.2 Técnicas de refactorización más utilizadas

**Extraer función (Extract Function)**

Esta es la técnica de refactorización más utilizada. Cuando un fragmento de código puede resumirse con un nombre significativo, debería extraerse como una función.

```javascript
// Antes de refactorizar
function printReport(data) {
  // Calcular el total
  let total = 0
  for (const item of data.items) {
    total += item.price * item.qty
  }
  // Imprimir...
}

// Después de refactorizar
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0)
}

function printReport(data) {
  const total = calculateTotal(data.items)
  // Imprimir...
}
```

**Renombrar (Rename)**

Un buen nombre es la documentación más barata y efectiva. Cuando necesitas escribir un comentario para explicar el significado de una variable o función, significa que su nombre no es lo suficientemente bueno.

```javascript
// Antes de refactorizar
const d = new Date() - startTime  // Tiempo transcurrido
const arr = users.filter(u => u.a) // Usuarios activos

// Después de refactorizar
const elapsedMs = new Date() - startTime
const activeUsers = users.filter(user => user.isActive)
```

**Reemplazar condicionales anidados con cláusulas guardián (Replace Nested Conditional with Guard Clauses)**

```javascript
// Antes de refactorizar
function getPayAmount(employee) {
  if (employee.isSeparated) {
    return { amount: 0 }
  } else {
    if (employee.isRetired) {
      return { amount: employee.pension }
    } else {
      return { amount: employee.salary }
    }
  }
}

// Después de refactorizar
function getPayAmount(employee) {
  if (employee.isSeparated) return { amount: 0 }
  if (employee.isRetired) return { amount: employee.pension }
  return { amount: employee.salary }
}
```

::: tip Red de seguridad de la refactorización
El mayor riesgo de la refactorización es "introducir bugs mientras se modifica". Por eso, el requisito previo para refactorizar es **tener cobertura de pruebas**. Después de cada pequeño paso de refactorización, ejecuta las pruebas para asegurarte de que el comportamiento no ha cambiado. Si el código no tiene pruebas, primero añade pruebas y luego refactoriza.
:::

---

## 3. Revisión de código: Garantía de calidad en la colaboración del equipo

### 3.1 Motivación de necesaria la revisión de código

La revisión de código (Code Review) es uno de los métodos más efectivos de garantía de calidad en un equipo. Su valor no reside solo en encontrar bugs, sino también en:

- **Compartir conocimiento**: Los miembros del equipo conocen el código de los demás, reduciendo el "factor autobús" (si alguien es atropellado por un autobús, ¿puede continuar el proyecto?)
- **Unificar el estilo**: A través de las revisiones, se forma gradualmente la convención de codificación del equipo
- **Detectar problemas de diseño temprano**: Lo que es más difícil de corregir que un bug es una mala decisión arquitectónica
- **Aprender mutuamente**: Ver el código de otros es un atajo para mejorar las habilidades de programación

### 3.2 Qué revisar

| Dimensión | Puntos de atención |
|------|--------|
| **Corrección** | ¿La lógica es correcta? ¿Se manejan las condiciones límite? |
| **Legibilidad** | ¿Los nombres son claros? ¿La estructura es fácil de entender? |
| **Seguridad** | ¿Hay riesgo de inyección? ¿Se exponen datos sensibles? |
| **Rendimiento** | ¿Hay problemas de rendimiento evidentes? ¿Consultas N+1? |
| **Pruebas** | ¿Hay pruebas correspondientes? ¿Cubren los caminos críticos? |

### 3.3 Etiqueta de la revisión

Una buena revisión de código es **una discusión sobre el código, no una crítica personal**:

- Usa "nosotros" en lugar de "tú": ~~"Escribiste mal aquí"~~ → "Aquí podríamos considerar usar una cláusula guardián"
- Pregunta en lugar de ordenar: ~~"Cámbialo a const"~~ → "¿Esta variable se reasigna después? Si no, usar const es más seguro"
- Da razones: no digas solo "está mal", di "por qué está mal" y "cómo mejorarlo"

---

## 4. Métricas de calidad del código

### 4.1 Complejidad ciclomática

La complejidad ciclomática (Cyclomatic Complexity) mide la cantidad de rutas independientes en el código. Cada `if`, `for`, `case`, `&&`, `||` aumenta la complejidad.

| Complejidad | Evaluación | Recomendación |
|--------|------|------|
| 1-10 | Simple | Fácil de entender y probar |
| 11-20 | Media | Considerar dividir |
| 21-50 | Compleja | Debe refactorizarse |
| 50+ | Inmanejable | Refactorización urgente |

### 4.2 Cobertura de código

La cobertura de código mide qué proporción del código es ejecutada por las pruebas. Métricas comunes:

- **Cobertura de líneas**: Proporción de líneas de código ejecutadas sobre el total
- **Cobertura de ramas**: Proporción de ramas condicionales ejecutadas sobre el total

::: tip La trampa de la cobertura
Una cobertura del 80% no significa que la calidad del código sea buena. La cobertura solo te dice "qué código no ha sido probado", no puede decirte "si las pruebas tienen sentido". Una prueba que solo afirma `expect(true).toBe(true)` puede aumentar la cobertura, pero no tiene ningún valor.
:::

### 4.3 Herramientas prácticas

| Herramienta | Uso |
|------|------|
| **ESLint** | Análisis estático para JavaScript/TypeScript |
| **Prettier** | Formateo de código, estilo unificado |
| **SonarQube** | Plataforma integral de calidad de código |
| **Husky** | Git hooks, comprobaciones automáticas antes de los commits |

---

## 5. Impulso de IA: Mejorar la calidad del código con modelos de lenguaje

Los modelos de lenguaje ya son muy prácticos en el ámbito de la calidad del código. Pueden actuar como tu "revisor de código disponible 24 horas al día".

### 5.1 Identificar malos olores del código

> **Prompt**:
> ```
> Revisa el siguiente código e identifica los malos olores (Code Smells), incluyendo pero no limitado a:
> funciones demasiado largas, números mágicos, código duplicado, anidamiento excesivo, listas de parámetros demasiado largas.
> Para cada problema, indica la ubicación específica, la descripción del problema y sugerencias de mejora.
>
> [Pega tu código]
> ```

### 5.2 Refactorización automática

> **Prompt**:
> ```
> Refactoriza el siguiente código con estos requisitos:
> 1. No cambiar el comportamiento externo
> 2. Usar técnicas como extraer función y reemplazar anidamiento con cláusulas guardián
> 3. Mejorar los nombres, eliminar números mágicos
> 4. Explicar la razón de cada paso de refactorización
>
> [Pega tu código]
> ```

### 5.3 Simular una revisión de código

> **Prompt**:
> ```
> Revisa este código desde la perspectiva de un desarrollador senior, dando retroalimentación en las siguientes dimensiones:
> - Corrección: ¿Hay bugs en la lógica? ¿Se manejan las condiciones límite?
> - Legibilidad: ¿Los nombres son claros? ¿La estructura es fácil de entender?
> - Rendimiento: ¿Hay problemas de rendimiento evidentes?
> - Seguridad: ¿Hay riesgo de inyección o fuga de datos?
> Usa un tono de "sugerencia" en lugar de "orden", y proporciona planes de mejora.
>
> [Pega tu código]
> ```

::: tip Consejos de uso de IA
Las sugerencias de refactorización de la IA necesitan que tú mismo las verifiques — ejecuta las pruebas para confirmar que el comportamiento no ha cambiado. Trata a la IA como un "compañero que hace sugerencias", no como una "autoridad a la que confiar incondicionalmente".
:::

---

## 6. Resumen

En este recorrido, desde la identificación de problemas hasta su resolución, hemos construido un sistema completo de mejora de la calidad del código:

1. **Identificar**: Aprender a detectar los malos olores del código y saber dónde se necesita mejorar
2. **Refactorizar**: Dominar técnicas de refactorización seguras, mejorando en pequeños pasos bajo la protección de pruebas
3. **Colaborar**: A través de la revisión de código, hacer que el equipo custodie conjuntamente la calidad del código
4. **Medir**: Usar métricas objetivas para rastrear la salud del código

::: tip Reflexión final
La calidad del código no es un trabajo puntual, sino un hábito continuo. Es como mantener una habitación limpia — no esperar a que sea un desastre para limpiar a fondo, sino ordenar un poco cada día. La **Regla del Boy Scout** lo dice bien: al irte, deja el código un poco más limpio de lo que lo encontraste.
:::

---

## Lecturas adicionales

- **Libro clásico**: *Refactoring: Improving the Design of Existing Code* de Martin Fowler es la biblia de este campo.
- **Código limpio**: *Clean Code* de Robert C. Martin ofrece numerosos principios de codificación prácticos.
- **Herramientas prácticas**: Intenta configurar ESLint + Prettier + Husky en tu proyecto para experimentar la garantía automatizada de calidad del código.
- **Revisión de código**: Las guías de Code Review de Google son el estándar de la industria y vale la pena estudiarlas.
