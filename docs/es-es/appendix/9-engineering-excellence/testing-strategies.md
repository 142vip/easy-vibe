# Introducción a las estrategias de testing

::: tip Prefacio
**¿Tu código está realmente "sin problemas"?** Cada vez que modificas código y haces clic manualmente para ver si algo se rompe — este enfoque funciona cuando el proyecto es pequeño, pero cuando el código crece a decenas de miles de líneas y el equipo se expande a más de diez personas, "probar haciendo clic" es un desastre.

Este capítulo te ayudará a entender las estrategias fundamentales del testing de software, desde la pirámide de tests hasta TDD, construyendo un pensamiento sistemático de garantía de calidad.
:::

**¿Qué aprenderás en este artículo?**

| Capítulo | Contenido | Concepto clave |
|-----|------|---------|
| **Capítulo 1** | Pirámide de tests | Niveles y proporciones del testing |
| **Capítulo 2** | Práctica de tests unitarios | Cómo escribir un buen test |
| **Capítulo 3** | Desarrollo guiado por tests (TDD) | El ciclo Rojo-Verde-Refactorizar |
| **Capítulo 4** | Elección de estrategia de testing | Soluciones para diferentes escenarios |

Al finalizar este capítulo, entenderás cómo elegir la estrategia de testing adecuada para tu proyecto, escribir tests valiosos y mejorar la calidad del diseño de código mediante TDD.

---

## 0. Panorama general: Motivación de pruebas automatizadas

Imagina que eres un ingeniero de edificación. Cada vez que modificas los planos, no subes personalmente a cada piso para verificar la estructura — dependes de un **sistema de detección automatizado**. Las pruebas de software son el "sistema de detección estructural" del mundo del código.

::: tip El valor de las pruebas automatizadas
- **Protección contra regresiones**: Al modificar la funcionalidad A, se detecta automáticamente si B, C y D se ven afectadas
- **Confianza para refactorizar**: Con cobertura de tests, refactorizar da más tranquilidad
- **Documentación viva**: Los buenos tests son el mejor manual de uso
- **Retroalimentación rápida**: Saber en segundos si el código es correcto, en lugar de descubrir problemas después del despliegue
:::

---

## 1. Pirámide de tests: Niveles y proporciones del testing

### 1.1 La pirámide de tres niveles

La pirámide de tests propuesta por Mike Cohn es el modelo clásico de estrategia de testing. Nos dice que **los diferentes tipos de pruebas deben tener diferentes proporciones**.

A través del siguiente componente interactivo, haz clic en cada nivel de la pirámide para conocer las características de cada tipo de test:

<TestPyramidDemo />

### 1.2 Motivación de tiene forma de pirámide

La forma piramidal refleja un equilibrio fundamental: **la compensación entre velocidad y fidelidad**.

- **Nivel inferior (tests unitarios)**: Extremadamente rápidos, la mayor cantidad, menor coste, pero solo verifican piezas individuales
- **Nivel medio (tests de integración)**: Velocidad moderada, cantidad moderada, verifican la colaboración entre piezas
- **Nivel superior (tests E2E)**: Los más cercanos al usuario real, pero lentos, costosos de mantener y propensos a fallar por problemas de entorno

> **Antipatrón: El cono de helado** — Si tu proyecto tiene más tests E2E que unitarios, tienes un "cono de helado" invertido. Esto significa que tu suite de tests es lenta, falla con frecuencia y es muy costosa de mantener.

---

## 2. Práctica de tests unitarios

### 2.1 Introducción a test unitario sea bueno

Los buenos tests unitarios siguen el principio **FIRST**:

| Principio | Significado | Explicación |
|------|------|------|
| **F**ast | Rápido | Se completa en milisegundos; los desarrolladores están dispuestos a ejecutarlos frecuentemente |
| **I**ndependent | Independiente | Los tests no dependen entre sí; se pueden ejecutar individualmente |
| **R**epeatable | Repetible | El resultado es consistente en cualquier entorno |
| **S**elf-validating | Autovalidable | El resultado es claramente pasado/fallido, sin necesidad de juicio humano |
| **T**imely | Oportuno | Se escriben al mismo tiempo que el código (o antes) |

### 2.2 Estructura del test: El patrón AAA

Cada test debería tener una estructura clara de tres partes:

```javascript
test('debería calcular correctamente el precio con impuestos', () => {
  // Arrange (Preparar) — Configurar datos de prueba
  const price = 100
  const taxRate = 0.13

  // Act (Ejecutar) — Llamar a la función bajo prueba
  const result = calculateTotalWithTax(price, taxRate)

  // Assert (Verificar) — Comprobar el resultado
  expect(result).toBe(113)
})
```

### 2.3 Qué testear Qué no testear

**Lo que sí se debe testear:**
- Lógica de negocio central (cálculos de precios, verificación de permisos, transformación de datos)
- Condiciones límite (valores nulos, cero, números negativos, números muy grandes)
- Rutas de manejo de errores

**Lo que no se necesita testear:**
- La implementación interna de librerías de terceros
- Getters/setters simples
- Funcionalidades propias del framework (como el sistema reactivo de Vue)

---

## 3. TDD: Desarrollo guiado por tests

### 3.1 El ciclo Rojo-Verde-Refactorizar

El núcleo de TDD (Test-Driven Development) es un ciclo simple: **escribir el test primero, luego la implementación, y finalmente refactorizar**.

A través del siguiente componente interactivo, experimenta el ciclo completo de TDD:

<TDDCycleDemo />

### 3.2 Las tres reglas de TDD

1. **No escribas código de producción excepto para hacer pasar un test que falla**
2. **Escribe solo el código de test suficiente para que falle** (tampoco compilar cuenta como fallo)
3. **Escribe solo el código de producción suficiente para hacer pasar el test**

### 3.3 El verdadero valor de TDD

El valor de TDD no reside solo en "escribir tests primero", sino en que **te obliga a pensar en el diseño de interfaces**. Cuando escribes el test primero, estás pensando desde la perspectiva del "usuario": ¿qué parámetros debería recibir esta función? ¿Qué resultado debería devolver? Esto naturalmente conduce a un mejor diseño de API.

::: tip TDD no es una bala de plata
TDD es adecuado para código con lógica densa (algoritmos, reglas de negocio, transformación de datos), pero para layouts de UI, prototipos exploratorios y otros escenarios, forzar TDD puede ralentizar el desarrollo. La clave es entender su filosofía y aplicarla con flexibilidad.
:::

---

## 4. Elección de estrategia de testing

### 4.1 Enfoque de testing según tipo de proyecto

| Tipo de proyecto | Enfoque de testing | Proporción recomendada |
|----------|----------|----------|
| **Librería/SDK** | Principalmente tests unitarios | 90% unitarios + 10% integración |
| **Servicio API** | Principalmente tests de integración | 30% unitarios + 60% integración + 10% E2E |
| **Aplicación Web** | Distribución equilibrada | 50% unitarios + 30% integración + 20% E2E |
| **MVP/Prototipo** | E2E en rutas críticas | Pocos tests esenciales |

### 4.2 Herramientas de testing comunes

| Herramienta | Tipo | Caso de uso |
|------|------|----------|
| **Vitest** | Unitarios/Integración | Primera opción para proyectos Vite, compatible con la API de Jest |
| **Jest** | Unitarios/Integración | La más popular en el ecosistema Node.js |
| **Playwright** | E2E | Multi-navegador, de Microsoft |
| **Cypress** | E2E | Buena experiencia de desarrollo, fácil depuración |
| **Testing Library** | Tests de componentes | Probar componentes UI desde la perspectiva del usuario |

---

## 5. Impulso de IA: Mejorar la eficiencia del testing con modelos de lenguaje

Las capacidades de los modelos de lenguaje en el ámbito del testing ya son muy potentes — pueden ayudarte a generar casos de test, descubrir condiciones límite e incluso escribir código de test completo.

### 5.1 Generar tests unitarios

> **Prompt**:
> ```
> Escribe tests unitarios para la siguiente función usando el framework Vitest. Requisitos:
> 1. Seguir el patrón AAA (Arrange-Act-Assert)
> 2. Cubrir el camino normal, condiciones límite y caminos de error
> 3. Cada caso de test debe tener una descripción clara
>
> [Pega el código de tu función]
> ```

### 5.2 Descubrir condiciones límite

> **Prompt**:
> ```
> Analiza la siguiente función y lista todas las posibles condiciones límite y escenarios de entrada extrema,
> incluyendo: valores nulos, cero, números negativos, números muy grandes, caracteres especiales, situaciones de concurrencia, etc.
> Para cada escenario, describe el comportamiento esperado y los posibles riesgos.
>
> [Pega el código de tu función]
> ```

### 5.3 Generar tests a partir de requisitos (asistencia TDD)

> **Prompt**:
> ```
> Quiero implementar un módulo de carrito de compras con los siguientes requisitos:
> - Añadir productos, eliminar productos, modificar cantidades
> - Calcular automáticamente el total (incluyendo descuentos)
> - Mostrar error cuando no hay stock suficiente
>
> Siguiendo el enfoque TDD, escribe primero los casos de test (sin implementación),
> usando Vitest, cubriendo todos los escenarios principales.
> ```

::: tip Consejos de uso de IA
Verifica que las aserciones de los tests generados por IA sean significativas — evita tests inútiles como `expect(true).toBe(true)`. Un buen test debería fallar realmente cuando el código tiene errores.
:::

---

## 6. Resumen

1. **Pirámide de tests**: Muchos en la base, pocos en la cima, equilibrando velocidad y fidelidad
2. **Tests unitarios**: Seguir el principio FIRST y el patrón AAA, testear la lógica central
3. **TDD**: Ciclo Rojo-Verde-Refactorizar, usar los tests para guiar el diseño
4. **Elección de estrategia**: Según el tipo y fase del proyecto, elegir la proporción adecuada de tests

::: tip Reflexión final
Los tests no son una carga, sino un **acelerador**. A corto plazo, escribir tests ciertamente requiere más tiempo; a largo plazo, ahorra incontables horas de verificación manual, investigación de bugs de regresión y correcciones urgentes a medianoche. Los buenos tests te dan la confianza de decir: **"Modifica con confianza, los tests nos dirán si algo falla."**
:::

---

## Lecturas adicionales

- **Libro clásico**: *Test-Driven Development* de Kent Beck es la obra fundacional de TDD.
- **Guía práctica**: Intenta escribir tests para un proyecto pequeño con Vitest, experimentando el flujo de testing desde cero.
- **Patrones de testing**: Conoce la diferencia entre Mock, Stub y Spy y sus escenarios de uso.
- **Integración continua**: Integra los tests en tu pipeline CI/CD para que se ejecuten automáticamente con cada commit.
