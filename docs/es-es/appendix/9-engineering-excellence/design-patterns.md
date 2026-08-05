# Fundamentos de patrones de diseño

::: tip Prefacio
**¿Por qué tu código siempre "funciona pero es un desastre"?** Probablemente te has encontrado con esta situación: cuando cambian los requisitos, hay que modificar el código en muchos sitios; quieres reutilizar una lógica, pero descubres que está entrelazada con otro código. Los patrones de diseño son las "fórmulas de organización del código" resumidas por los expertos, que te ayudan a escribir código flexible y mantenible.

Este capítulo te ayudará a entender los patrones de diseño más prácticos, no para memorizarlos, sino para comprender "qué patrón usar en cada situación".
:::

**¿Qué aprenderás en este artículo?**

| Capítulo | Contenido | Concepto clave |
|-----|------|---------|
| **Capítulo 1** | Qué son los patrones de diseño | La esencia y clasificación de los patrones |
| **Capítulo 2** | Patrones creacionales | Cómo crear objetos elegantemente |
| **Capítulo 3** | Patrones estructurales | Cómo organizar la estructura del código |
| **Capítulo 4** | Patrones de comportamiento | Cómo gestionar la interacción entre objetos |

Al finalizar este capítulo, dominarás los patrones de diseño más utilizados y podrás identificar los escenarios apropiados y aplicarlos con flexibilidad en proyectos reales.

---

## 0. Panorama general: La esencia de los patrones de diseño

Imagina que estás aprendiendo a cocinar. Puedes empezar desde cero cada vez, o puedes aprender recetas clásicas — las recetas no limitan tu creatividad, sino que te permiten apoyarte en la experiencia de los que vinieron antes. Los patrones de diseño son las "recetas clásicas" del mundo de la programación.

::: tip El valor de los patrones de diseño
- **Lenguaje común**: Decir "aquí usamos el patrón Observer" y el equipo entiende inmediatamente tu intención de diseño
- **Reutilización de experiencia**: No necesitas cometer los mismos errores que otros ya cometieron
- **Extensibilidad flexible**: Un buen patrón permite que el código se adapte a los cambios con pequeñas modificaciones, no con grandes reescrituras
:::

A través del siguiente componente interactivo, explora la clasificación y los usos de los patrones de diseño más comunes:

<DesignPatternCatalogDemo />

---

## 1. Patrones creacionales: Cómo crear objetos elegantemente

### 1.1 Patrón Singleton

**Escenario**: Solo se necesita una instancia global, como un gestor de configuración, un registrador de logs o un pool de conexiones a base de datos.

```javascript
class ConfigManager {
  static instance = null

  static getInstance() {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  constructor() {
    this.config = {}
  }
}

// No importa cuántas veces se llame, siempre es la misma instancia
const a = ConfigManager.getInstance()
const b = ConfigManager.getInstance()
console.log(a === b) // true
```

### 1.2 Patrón Factory (Fábrica)

**Escenario**: Crear diferentes tipos de objetos según distintas condiciones, sin que el llamador necesite conocer los detalles de creación.

```javascript
function createNotification(type, message) {
  switch (type) {
    case 'email':
      return { send: () => console.log(`Enviar email: ${message}`) }
    case 'sms':
      return { send: () => console.log(`Enviar SMS: ${message}`) }
    case 'push':
      return { send: () => console.log(`Enviar notificación push: ${message}`) }
    default:
      throw new Error(`Tipo de notificación desconocido: ${type}`)
  }
}

// El llamador no se preocupa por la implementación concreta
const notification = createNotification('email', 'Hola')
notification.send()
```

---

## 2. Patrones estructurales: Cómo organizar la estructura del código

### 2.1 Patrón Adapter (Adaptador)

**Escenario**: Dos interfaces incompatibles necesitan un "adaptador". Por ejemplo, el formato de datos que devuelve una API antigua no coincide con el formato que espera un nuevo componente.

```javascript
// Formato devuelto por la API antigua
const oldApi = {
  getUserInfo: () => ({ user_name: 'Zhang San', user_age: 25 })
}

// Adaptador: convertir al nuevo formato
function adaptUser(oldUser) {
  return { name: oldUser.user_name, age: oldUser.user_age }
}

const user = adaptUser(oldApi.getUserInfo())
// { name: 'Zhang San', age: 25 }
```

### 2.2 Patrón Decorator (Decorador)

**Escenario**: Añadir nueva funcionalidad a un objeto sin modificar el código original. Como ponerle una funda al teléfono — las funciones del teléfono no cambian, pero gana protección.

```javascript
// Función de log básica
function log(message) {
  console.log(message)
}

// Decoración: añadir marca de tiempo
function withTimestamp(fn) {
  return (message) => fn(`[${new Date().toISOString()}] ${message}`)
}

// Decoración: añadir nivel de log
function withLevel(fn, level) {
  return (message) => fn(`[${level}] ${message}`)
}

const enhancedLog = withTimestamp(withLevel(log, 'INFO'))
enhancedLog('Servicio iniciado correctamente')
// [2025-01-15T10:30:00.000Z] [INFO] Servicio iniciado correctamente
```

---

## 3. Patrones de comportamiento: Cómo gestionar la interacción entre objetos

### 3.1 Patrón Observer (Observador)

**Escenario**: Cuando el estado de un objeto cambia, es necesario notificar automáticamente a otros objetos. Por ejemplo, cuando un usuario hace un pedido, se necesita enviar un email, descontar del inventario y registrar un log simultáneamente.

```javascript
class EventEmitter {
  constructor() {
    this.listeners = {}
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(callback)
  }

  emit(event, data) {
    (this.listeners[event] || []).forEach(cb => cb(data))
  }
}

const bus = new EventEmitter()
bus.on('order:created', (order) => console.log('Enviar email de confirmación', order.id))
bus.on('order:created', (order) => console.log('Descontar inventario', order.id))
bus.emit('order:created', { id: 'ORD-001' })
```

### 3.2 Patrón Strategy (Estrategia)

**Escenario**: Una misma operación tiene múltiples algoritmos/estrategias y necesitan cambiarse en tiempo de ejecución. Por ejemplo, diferentes métodos de ordenación o diferentes reglas de cálculo de precios.

```javascript
const pricingStrategies = {
  normal: (price) => price,
  vip: (price) => price * 0.8,
  svip: (price) => price * 0.6
}

function calculatePrice(price, memberLevel) {
  const strategy = pricingStrategies[memberLevel] || pricingStrategies.normal
  return strategy(price)
}

calculatePrice(100, 'vip')  // 80
calculatePrice(100, 'svip') // 60
```

A través del siguiente componente interactivo, experimenta con los efectos de diferentes patrones de diseño:

<PatternPlaygroundDemo />

---

## 4. Enfoque de elegir un patrón de diseño

| El problema que encuentras | Patrón recomendado | Idea central |
|-------------|---------|---------|
| Solo una instancia global | Singleton | Controlar el número de instancias |
| Crear diferentes objetos según condiciones | Factory | Encapsular la lógica de creación |
| Interfaces incompatibles que necesitan conversión | Adapter | Envolver con una capa de conversión |
| Añadir funcionalidad dinámicamente | Decorator | Envolver capa por capa |
| Cambios de estado que notifican a múltiples partes | Observer | Desacoplar publicación-suscripción |
| Múltiples algoritmos intercambiables en tiempo de ejecución | Strategy | Encapsular algoritmos como objetos |

::: tip Principio clave
Los patrones de diseño no son cuanto más, mejor. **El diseño excesivo** es tan malo como **la ausencia de diseño**. Usa patrones solo donde realmente se necesita flexibilidad, y soluciones simples para problemas simples. Recuerda el principio KISS: Keep It Simple, Stupid.
:::

---

## 5. Impulso de IA: Aprender y aplicar patrones de diseño con modelos de lenguaje

Los modelos de lenguaje pueden ayudarte a identificar escenarios en tu código donde se podrían aplicar patrones de diseño y ofrecer propuestas concretas de refactorización.

### 5.1 Identificar patrones aplicables

> **Prompt**:
> ```
> Analiza el siguiente código y determina si hay lugares donde se podrían aplicar patrones de diseño para mejorar.
> Si los hay, indica:
> 1. El problema actual del código
> 2. Qué patrón de diseño se recomienda
> 3. Un ejemplo de código refactorizado
> 4. Por qué este patrón es adecuado para este escenario
>
> [Pega tu código]
> ```

### 5.2 Aprender patrones con escenarios concretos

> **Prompt**:
> ```
> Usando un escenario real de "sistema de pedidos de comida a domicilio", demuestra la aplicación de los siguientes patrones de diseño:
> - Patrón Factory: crear diferentes tipos de pedidos
> - Patrón Observer: notificación de cambios de estado del pedido
> - Patrón Strategy: diferentes reglas de cálculo de gastos de envío
>
> Usa ejemplos de código JavaScript, mostrando primero el problema sin el patrón
> y luego la mejora con el patrón aplicado.
> ```

### 5.3 Evaluar si hay diseño excesivo

> **Prompt**:
> ```
> Revisa el siguiente código y determina si hay problemas de diseño excesivo.
> ¿Hay abstracciones innecesarias, patrones de diseño no utilizados u optimizaciones prematuras?
> Si los hay, sugiere cómo simplificar siguiendo el principio KISS.
>
> [Pega tu código]
> ```

::: tip Consejos de uso de IA
Pide a la IA que te explique los patrones de diseño usando escenarios de negocio que te resulten familiares — es mucho más efectivo que ver diagramas UML abstractos. Pero recuerda: la IA puede tender a recomendar soluciones más complejas; necesitas juzgar tú mismo si realmente las necesitas.
:::

---

## 6. Resumen

1. **Patrones creacionales**: Resuelven el problema de "cómo crear objetos", haciendo el proceso de creación más flexible
2. **Patrones estructurales**: Resuelven el problema de "cómo organizar el código", haciendo la estructura más clara
3. **Patrones de comportamiento**: Resuelven el problema de "cómo interactúan los objetos", haciendo la colaboración más débilmente acoplada
4. **Aplicación flexible**: Elige según el escenario real, no uses patrones solo por usar patrones

::: tip Reflexión final
La esencia de los patrones de diseño es **gestionar el cambio**. Un buen diseño permite que las partes que cambian se modifiquen fácilmente, mientras las partes estables permanecen intactas. Cuando escribas código, pregúntate: "Si cambian los requisitos, ¿cuántos sitios necesito modificar?" — si la respuesta es "muchos sitios", quizás necesites un patrón de diseño para ayudar.
:::

---

## Lecturas adicionales

- **Libro clásico**: *Design Patterns: Elements of Reusable Object-Oriented Software* de GoF (Gang of Four) es la obra fundacional de los patrones de diseño.
- **Perspectiva moderna**: En JavaScript, muchos patrones se vuelven más concisos gracias a las características del lenguaje (closures, funciones de orden superior).
- **Consejos prácticos**: Primero entiende el problema, luego considera el patrón. No busques clavos porque tienes un martillo.
- **Aprendizaje avanzado**: Conoce los principios SOLID, que son la filosofía detrás de los patrones de diseño.
