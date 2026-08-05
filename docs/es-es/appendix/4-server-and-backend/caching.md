# Principios y estrategias de caché
::: tip 🎯 Pregunta central
**¿Por qué algunos sitios web cargan en solo 50 milisegundos, mientras que otros tardan 5 segundos?** Es como preguntar: ¿por qué sacar un libro de la mochila toma 1 segundo, pero ir a buscarlo a la biblioteca toma 10 minutos? La respuesta es: la caché. Este capítulo te llevará a comprender a fondo los principios básicos, los patrones de diseño y las técnicas prácticas de la caché, para que el rendimiento de tu sistema mejore 100 veces.
:::

---

## 1. Motivación de caché

### 1.1 De "consultar siempre" a "recordar los datos frecuentes"

En los primeros días de la informática, los programadores consultaban el disco duro o la base de datos cada vez que necesitaban datos. Es como si tuvieras que buscar la fórmula en el libro cada vez que haces un problema de matemáticas: aunque es preciso, la eficiencia es muy baja. A medida que los sistemas crecían, este enfoque de "consultar siempre" empezó a mostrar problemas graves: la CPU de la base de datos se disparaba al 95%, el tiempo de respuesta pasaba de 100 milisegundos a 8 segundos y, finalmente, todo el sistema colapsaba.

Es como un estudiante que cada día tiene que correr desde el dormitorio hasta la biblioteca para consultar materiales, 50 veces al día, hasta quedar agotado en el camino. La solución es simple: llevar un manual de fórmulas comunes en la mochila y consultarlo directamente cuando sea necesario, sin tener que ir a la biblioteca cada vez. La caché es el "manual de fórmulas" del sistema informático: almacena los datos frecuentes en un lugar de acceso rápido, para que el sistema no tenga que ir a la "biblioteca" (la base de datos) cada vez.

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🐌 Sin caché**
- Cada solicitud consulta la base de datos
- Uso de CPU de la base de datos: 95%
- Tiempo de respuesta: 5-8 segundos
- El sistema es propenso a fallos

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 Con caché**
- El 95% de las solicitudes se responden directamente
- Uso de CPU de la base de datos: < 20%
- Tiempo de respuesta: 50 milisegundos
- El sistema funciona de forma estable

</div>
</div>

**Este es el problema central que la "caché" resuelve: al almacenar copias de los datos frecuentes, se reduce el acceso al almacenamiento lento (base de datos), haciendo que el sistema sea más rápido y estable.**

<CachePerformanceComparisonDemo />

### 1.2 Una historia real de tropiezos: por qué la caché es un salvavidas

Puede que pienses: "Mi sistema funciona bien ahora, ¿por qué debería diseñar la caché por adelantado?" Déjame contarte una historia real para que entiendas por qué la caché no es una "opción", sino una "necesidad".

::: warning El desastre de la base de datos de Aqiang
Aqiang es un ingeniero full-stack en una startup que creó una aplicación social. Al principio, con pocos usuarios (unos cientos), el sistema funcionaba bien y Aqiang pensaba que no necesitaba caché, que consultar directamente la base de datos era suficiente.

Medio año después, los usuarios crecieron a 100 000. Un día, una celebridad publicó algo en la aplicación y, de repente, 100 000 usuarios accedieron simultáneamente. La base de datos colapsó: CPU al 100%, el tiempo de respuesta pasó de 100 ms a 30 segundos y, finalmente, toda la aplicación se cayó, perdiendo una gran cantidad de usuarios.

En el análisis posterior: si hubiera habido una capa de caché simple (como Redis) para almacenar las publicaciones populares, la presión sobre la base de datos se habría reducido al menos un 95% y el sistema habría soportado perfectamente esa avalancha de tráfico.

Aqiang aprendió una lección: **la caché no es un adorno, es un salvavidas para sistemas de alta concurrencia. No usar caché es como conducir sin cinturón de seguridad: no pasa nada en condiciones normales, pero cuando hay un accidente, ya es demasiado tarde.**
:::

::: info 💡 Lección clave
El valor de la caché no es solo "ser más rápido", sino sobre todo "proteger". Protege la base de datos de ser aplastada y protege al sistema para que siga funcionando de forma estable bajo alto tráfico. Cuando diseñes tu sistema, no esperes a que ocurra un problema para pensar en la caché; incorpórala desde el principio como parte fundamental de la arquitectura.
:::

---

## 2. Conceptos básicos: Introducción a caché

::: tip 🤔 ¿Qué es exactamente la caché?
En pocas palabras, **la caché es un espacio de almacenamiento para copias de datos**. Es como tener una nota adhesiva en tu escritorio con los números de teléfono más usados, para no tener que buscar en la agenda del móvil cada vez.

**Tres puntos clave**:
1. **Copia**: los datos en caché son una copia de los datos originales (base de datos), no son los datos principales
2. **Acceso rápido**: la caché suele estar en memoria, cuya velocidad de lectura es 100 000 veces más rápida que el disco duro
3. **Capacidad limitada**: el espacio de caché es limitado, solo puede almacenar los datos más utilizados

Así que, **la caché intercambia espacio por tiempo**: sacrifica algo de espacio en memoria a cambio de una velocidad de acceso a los datos extremadamente rápida.
:::

Antes de profundizar en tecnologías específicas, necesitamos aclarar algunos conceptos básicos. Para ayudarte a entenderlos, usaremos la analogía de la "mochila del estudiante" para explicar el sistema de caché.

### 2.1 Entender los conceptos básicos de la caché con la "analogía de la mochila"

Imagina que eres un estudiante que necesita consultar diversos materiales cada día. Este proceso es sorprendentemente similar a un sistema de caché:

| Concepto | 🎒 Analogía de la mochila | Significado técnico | Ejemplo real |
|------|-----------|----------|----------|
| **Acierto de caché (Cache Hit)** | La fórmula que buscas está en la nota adhesiva | Los datos solicitados se encuentran en la caché | Consultar información de usuario, está en Redis, se devuelve directamente |
| **Fallo de caché (Cache Miss)** | No está en la nota adhesiva, hay que buscar en el libro | Los datos solicitados no están en la caché | Consultar información de usuario, no está en Redis, hay que consultar la base de datos |
| **Tasa de aciertos (Hit Ratio)** | De 100 consultas de fórmulas, 95 están en la nota adhesiva | Proporción de aciertos de caché | Tasa de aciertos del 95% significa que el 95% de las solicitudes no necesitan consultar la base de datos |
| **TTL (Time To Live)** | La nota adhesiva dice "romper después de 3 días" | Tiempo de expiración de la caché | Configurar la caché de información de usuario para que expire automáticamente después de 30 minutos |
| **Desalojo (Eviction)** | La mochila está llena, se tira la nota adhesiva más antigua | Eliminar datos antiguos cuando la caché está llena | La memoria de Redis está llena, se eliminan automáticamente los datos menos usados |

### 2.2 Acierto de caché vs. Fallo de caché

La diferencia de rendimiento entre un acierto y un fallo de caché es enorme. Veamos los datos concretos:

| Tipo de operación | Tiempo de respuesta | Velocidad relativa | Escenario adecuado |
|---------|---------|----------|----------|
| **Caché L1 de CPU** | ~0.5 nanosegundos | Extremadamente rápido (referencia) | Operaciones internas de la CPU |
| **Lectura de memoria** | ~100 nanosegundos | 200 veces más rápido | Caché local (como Caffeine) |
| **Consulta Redis** | ~1 milisegundo | 2 millones de veces más lento | Caché distribuida |
| **Consulta MySQL** | ~10 milisegundos | 20 millones de veces más lento | Consulta a base de datos en disco |

::: tip 📊 ¿Qué puedes ver en esta tabla?
**La diferencia de rendimiento es impactante**: ¡las operaciones en memoria son 100 000 veces más rápidas que las consultas a MySQL! Es como la diferencia entre sacar un libro del escritorio (1 segundo) e ir a buscarlo a la biblioteca (100 000 segundos, unas 28 horas).

**Escalera de rendimiento de tres niveles**:
1. **Caché local (memoria)**: la más rápida, pero de poca capacidad, ideal para datos muy frecuentes
2. **Caché Redis**: velocidad media, gran capacidad, ideal para escenarios distribuidos
3. **Base de datos**: la más lenta, pero capacidad ilimitada, es la fuente definitiva de los datos

**Lección práctica**: tu sistema debería devolver más del 95% de las solicitudes desde la capa de caché, y solo menos del 5% debería necesitar consultar la base de datos. Así, la presión sobre la base de datos es baja y el rendimiento general del sistema mejora drásticamente.
:::

::: details 🔍 Veamos el código real de un "acierto de caché" y un "fallo de caché"
Comparemos estas dos situaciones con código:

```javascript
// Escenario: consultar información de usuario

// ===== Acierto de caché (Cache Hit) =====
// 1. Primero consultar la caché Redis
const userFromCache = await redis.get('user:123')
if (userFromCache) {
  // ¡Acierto! Devolver directamente, tarda aproximadamente 1 milisegundo
  return JSON.parse(userFromCache)
}

// ===== Fallo de caché (Cache Miss) =====
// 2. No está en caché, consultar la base de datos
const userFromDB = await db.query('SELECT * FROM users WHERE id = 123')
// ¡Fallo! Hay que consultar la base de datos, tarda unos 10 milisegundos, 10 veces más lento

// 3. Después de consultar, escribir en caché para que la próxima vez acierte
await redis.set('user:123', JSON.stringify(userFromDB), 'EX', 1800)
return userFromDB
```

**Puntos clave**:
- Acierto de caché: se devuelve en 1 milisegundo, experiencia de usuario excelente
- Fallo de caché: se devuelve en 10 milisegundos, experiencia de usuario algo peor
- **El valor de la caché**: convertir los fallos en aciertos, mejorando el rendimiento 10 veces
:::

### 2.3 El ciclo de vida de la caché

Una entrada de caché, desde su creación hasta su destrucción, pasa por un ciclo de vida completo. Entender este proceso es crucial para diseñar un sistema de caché.

**Cuatro fases**:

**Fase uno: Escritura (Write)**
- **Escritura activa**: al iniciar el sistema, cargar previamente los datos más frecuentes en la caché (precalentamiento de caché)
- **Carga diferida (Lazy Loading)**: cargar desde la base de datos y escribir en caché en el primer acceso (la más común)

**Fase dos: Acierto/Fallo (Hit/Miss)**
- Cada solicitud consulta primero la caché
- Si acierta, devuelve directamente; si falla, consulta la base de datos

**Fase tres: Expiración (Expiration)**
- **TTL (Time To Live)**: establece el tiempo de vida de la caché (por ejemplo, 30 minutos)
- Al expirar, la caché se invalida automáticamente y la próxima vez necesita recargarse

**Fase cuatro: Desalojo (Eviction)**
- El espacio de caché es limitado; cuando se llena, hay que eliminar datos antiguos
- Estrategias comunes de desalojo:
  - **LRU (Least Recently Used)**: elimina los datos que no se han usado durante más tiempo (la más común)
  - **LFU (Least Frequently Used)**: elimina los datos con menor frecuencia de acceso
  - **FIFO (First In First Out)**: elimina los datos escritos primero

👇 **Mira cómo funciona**:
La siguiente demostración muestra el ciclo de vida de la caché. Haz clic en "Nueva caché" y observa cómo la caché pasa por las fases de escritura, acierto, expiración y desalojo:

<CacheLifecycleDemo />

---

## 3. La evolución de la caché: de local a distribuida

::: tip 🤔 ¿Por qué necesitamos diferentes tipos de caché?
Es como cuando estudias y pones materiales en diferentes lugares: en el escritorio lo más usado (notas adhesivas), en la mochila lo frecuente (cuaderno) y en la biblioteca todos los materiales (depósito de libros).

**El sistema de caché es igual**:
- **Caché local (escritorio)**: la más rápida, poca capacidad, para datos súper frecuentes
- **Caché distribuida (taquilla pública)**: bastante rápida, gran capacidad, para datos frecuentes
- **Base de datos (biblioteca)**: la más lenta, capacidad ilimitada, para todos los datos

**¿Por qué usar capas?** Porque cada nivel tiene diferente rendimiento y costo; combinarlos adecuadamente es la clave para obtener el mejor resultado.
:::

Después de tantos conceptos, veamos un caso real: cómo un sistema de comercio electrónico pasó de "sin caché" a una "arquitectura de caché multinivel". Con este caso, entenderás de forma más intuitiva la importancia del diseño de caché.

### 3.1 Fase uno: la era sin caché — la base de datos a pelo

**Contexto**: al principio, el sistema tenía pocos usuarios (unos cientos) y todas las solicitudes iban directamente a la base de datos, sin ninguna capa de caché.

**Stack tecnológico**:
- Base de datos: MySQL
- Sin caché: ni Redis ni caché local

**Arquitectura del sistema**:
```
Solicitud del usuario → Servidor de aplicaciones → Base de datos MySQL
```

**Características de esta fase**:
- ✅ **Ventajas**: arquitectura simple, desarrollo rápido
- ❌ **Desventajas**: alta presión sobre la base de datos, bajo rendimiento, colapsa con unos miles de usuarios

::: details Ver el código de entonces y los problemas encontrados
**Ejemplo de código** (consultar la base de datos cada vez):

```javascript
// Obtener detalles del producto — consultar la base de datos cada vez
async function getProduct(productId) {
  // Consultar directamente la base de datos, sin ninguna caché
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )
  return product
}
```

**Problemas encontrados**:
1. **CPU de la base de datos disparada**: cada solicitud consultaba la base de datos, CPU al 80%+
2. **Respuesta lenta**: las consultas complejas tardaban 50-100 milisegundos, mala experiencia de usuario
3. **Baja capacidad de concurrencia**: el QPS (consultas por segundo) máximo de la base de datos era solo 2000, más allá colapsaba
4. **Problema de productos populares**: las páginas de productos populares se consultaban con frecuencia, la base de datos se convertía en el cuello de botella

**Soluciones temporales de entonces**:
- Comprar servidores más caros (más CPU, memoria) — costo alto, efecto limitado
- Separación de lectura y escritura en la base de datos — alivia la presión de lectura, pero la de escritura persiste
- Optimización SQL — mejora un 20-30%, pero no resuelve el problema de fondo
:::

Este modo "a pelo" funcionaba con menos de 1000 usuarios, pero cuando crecieron a 10 000 o 100 000, la base de datos empezó a fallar con frecuencia y el equipo necesitaba urgentemente introducir la caché.

### 3.2 Fase dos: introducción de Redis — rendimiento 10 veces mejor

**Contexto**: los usuarios crecieron a 10 000, la base de datos no daba más y el equipo decidió introducir Redis como capa de caché.

**Stack tecnológico**:
- Base de datos: MySQL
- Caché: Redis (instancia única)

**Arquitectura del sistema**:
```
Solicitud del usuario → Servidor de aplicaciones → Caché Redis (si falla, consulta) → Base de datos MySQL
```

**Características de esta fase**:
- ✅ **Ventajas**: rendimiento 10 veces mejor, presión de la base de datos reducida un 90%
- ❌ **Desventajas**: Redis es un punto único de fallo, posible inconsistencia entre caché y base de datos

::: details Ver el código de implementación de la caché Redis
**Ejemplo de código** (añadir caché Redis):

```javascript
// Obtener detalles del producto — primero Redis, si no, base de datos
async function getProduct(productId) {
  // 1. Primero consultar la caché Redis
  const cacheKey = `product:${productId}`
  const cached = await redis.get(cacheKey)

  if (cached) {
    // ¡Acierto de caché! Devolver directamente, aproximadamente 1 milisegundo
    return JSON.parse(cached)
  }

  // 2. Fallo de caché, consultar la base de datos
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // 3. Después de consultar, escribir en Redis con expiración de 30 minutos
  await redis.setex(
    cacheKey,
    1800,  // 30 minutos = 1800 segundos
    JSON.stringify(product)
  )

  return product
}
```

**Comparativa de mejora de rendimiento**:

| Escenario | Sin caché | Con caché Redis | Mejora |
|------|-------|--------------|---------|
| Consulta de producto normal | 50ms | 5ms (con acierto de caché) | **10 veces** |
| Consulta de producto popular | 80ms | 1ms (tasa de acierto 95%) | **80 veces** |
| QPS de la base de datos | 2000 (a plena carga) | 200 (90% interceptado por caché) | **Presión de BD reducida 10 veces** |
| Concurrencia máxima del sistema | 2000 usuarios | 20000 usuarios | **10 veces** |

**Mejoras obtenidas**:
1. **Velocidad de respuesta**: con acierto de caché, el tiempo de respuesta bajó de 50ms a 1-5ms
2. **Capacidad de concurrencia**: el sistema pasó de soportar 2000 a 20000 usuarios
3. **Presión de la base de datos**: el 90% de las solicitudes fueron interceptadas por Redis, la CPU de la BD bajó del 80% al 20%
4. **Experiencia de usuario**: la velocidad de carga de páginas mejoró notablemente, disminuyeron las quejas

**Nuevos desafíos**:
1. **Problema de consistencia de caché**: el precio del producto cambió, la base de datos se actualizó, pero la caché seguía con el valor antiguo
2. **Penetración de caché**: alguien consulta maliciosamente IDs de productos inexistentes (como id=-1), cada vez atraviesa hasta la base de datos
3. **Avalancha de caché**: tras reiniciar el sistema, todas las cachés expiran simultáneamente y una avalancha de solicitudes golpea la base de datos
4. **Punto único de fallo de Redis**: si Redis se cae, todas las solicitudes van directas a la base de datos y el sistema puede colapsar

**Soluciones**:
- **Consistencia de caché**: al actualizar la base de datos, eliminar la caché sincrónicamente
- **Penetración de caché**: cachear también los datos inexistentes en Redis (con valor vacío y TTL corto, como 5 minutos)
- **Avalancha de caché**: añadir un valor aleatorio al tiempo de expiración para evitar expiraciones simultáneas
:::

Tras introducir Redis, el rendimiento del sistema mejoró drásticamente, pero surgieron nuevos problemas. El equipo empezó a investigar cómo resolver estos problemas relacionados con la caché.

### 3.3 Fase tres: arquitectura de caché multinivel — rendimiento 5 veces mejor

**Contexto**: los usuarios crecieron a 100 000 e incluso la caché Redis empezó a ser un cuello de botella (el QPS máximo de una instancia única de Redis es de unos 100 000). El equipo decidió introducir la caché multinivel.

**Stack tecnológico**:
- Caché L1: caché local de aplicación (Caffeine)
- Caché L2: clúster Redis
- Base de datos: clúster MySQL maestro-esclavo

**Arquitectura del sistema**:
```
Solicitud del usuario → Caché CDN (recursos estáticos) → Servidor de aplicaciones
                                                             ↓
                                      L1: Caché local (Caffeine) → fallo → L2: Redis → fallo → MySQL
```

**Características de esta fase**:
- ✅ **Ventajas**: rendimiento extremo (caché local solo 0.1 milisegundos), alta disponibilidad (si Redis falla, los datos frecuentes no se ven afectados)
- ❌ **Desventajas**: arquitectura compleja, difícil garantizar la consistencia entre múltiples niveles de caché

::: details Ver el código de implementación de caché multinivel
**Ejemplo de código** (caché local + Redis en dos niveles):

```javascript
// Usar caché local Caffeine
const caffeine = require('caffeine')
const localCache = new caffeine.Cache({
  max: 1000,              // máximo 1000 entradas
  ttl: 30,                // expiración de 30 segundos
})

// Obtener detalles del producto — caché de dos niveles
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // L1: primero consultar la caché local (la más rápida, ~0.1 milisegundos)
  const localCached = localCache.get(cacheKey)
  if (localCached) {
    console.log('Acierto L1')
    return localCached
  }

  // L2: fallo en caché local, consultar Redis (bastante rápida, ~1 milisegundo)
  const redisCached = await redis.get(cacheKey)
  if (redisCached) {
    console.log('Acierto L2, rellenando L1')
    const product = JSON.parse(redisCached)
    // Rellenar la caché local
    localCache.set(cacheKey, product)
    return product
  }

  // L3: fallo también en Redis, consultar la base de datos (la más lenta, ~10 milisegundos)
  console.log('Acierto L3, rellenando L2 y L1')
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // Rellenar Redis (expiración de 30 minutos)
  await redis.setex(cacheKey, 1800, JSON.stringify(product))
  // Rellenar caché local
  localCache.set(cacheKey, product)

  return product
}
```

**Comparativa de rendimiento de caché multinivel**:

| Nivel de caché | Tiempo de respuesta | Tasa de aciertos | Datos adecuados |
|---------|---------|--------|--------------|
| **L1: Caché local** | ~0.1 milisegundos | 70% (súper frecuentes) | Productos populares, configuración del sistema, sesiones de usuario |
| **L2: Caché Redis** | ~1 milisegundo | 25% (frecuentes) | La mayoría de datos de productos, agregaciones de comentarios |
| **L3: Base de datos** | ~10 milisegundos | 5% (datos fríos) | Todos los datos de productos |

**Mejora global del rendimiento**:
- **Tiempo medio de respuesta**: 5ms (fase dos) → 1ms (fase tres), **5 veces mejor**
- **Concurrencia máxima del sistema**: 20 000 usuarios (fase dos) → 100 000 usuarios (fase tres), **5 veces mejor**
- **QPS de la base de datos**: 200 (fase dos) → 50 (fase tres), **4 veces menos presión**

**Nuevos problemas resueltos en esta fase**:
1. **Consistencia de caché local**: las cachés locales de múltiples instancias de aplicación pueden ser inconsistentes (la instancia A cachea el precio antiguo, la instancia B el nuevo)
   - **Solución**: establecer un TTL corto para la caché local (30 segundos) para reducir la ventana de inconsistencia
2. **Precalentamiento de caché**: tras reiniciar el sistema, la caché local está vacía y muchas solicitudes atraviesan hasta Redis
   - **Solución**: al iniciar el sistema, cargar activamente los datos frecuentes en la caché local
:::

La arquitectura de caché multinivel se usa ampliamente en grandes empresas de internet (como Taobao, JD.com) y puede soportar millones de QPS.

### 3.4 Panorama completo de la evolución de la arquitectura de caché

| Fase | Arquitectura | Tiempo de respuesta | Concurrencia máxima | Cambio clave |
|------|------|---------|---------|---------|
| **Fase uno: Sin caché** | App → BD | 50ms | 2000 usuarios | BD a pelo, bajo rendimiento |
| **Fase dos: Caché de un nivel** | App → Redis → BD | 5ms | 20000 usuarios | Se introduce Redis, rendimiento 10x |
| **Fase tres: Caché multinivel** | App → Caché local → Redis → BD | 1ms | 100000 usuarios | Caché local + Redis, rendimiento 5x más |

::: tip 📊 ¿Qué puedes ver en esta tabla?
**Fase uno → Fase dos**: un salto cualitativo. Tras introducir Redis, el rendimiento mejora 10 veces y la presión de la base de datos se reduce un 90%. Este es el paso clave de "funciona" a "es suficiente".

**Fase dos → Fase tres**: optimización extrema. Tras introducir la caché local, el rendimiento mejora otras 5 veces. Este es el paso de "es suficiente" a "es excelente", adecuado para escenarios de tráfico masivo.

**Recomendaciones prácticas**:
- **Usuarios < 10 000**: la fase uno (sin caché) es suficiente, pero se recomienda introducir Redis (fase dos)
- **Usuarios 10 000 - 100 000**: la fase dos (caché Redis) es la mejor opción
- **Usuarios > 100 000**: considera la fase tres (caché multinivel), pero ten en cuenta la complejidad de la consistencia

**En resumen**: la evolución de la arquitectura de caché no es solo "añadir más capas de caché", sino **elegir la arquitectura adecuada según la escala de tráfico**: el sobrediseño añade complejidad, y el infradiseño provoca cuellos de botella de rendimiento.
:::

---

## 4. Los tres problemas clásicos de la caché: penetración, rotura y avalancha

En la práctica, la caché introduce tres tipos de problemas clásicos. Si no los conoces, tu sistema podría colapsar repentinamente en algún momento. Usemos analogías cotidianas para entenderlos.

### 4.1 Penetración de caché: consultar datos que no existen

**Definición del problema**: consultar un **dato que no existe** (como id=-1), que no está en la caché (porque nunca se almacenó) ni en la base de datos, lo que hace que cada solicitud atraviese directamente hasta la base de datos.

::: tip 🤔 Entendiendo la penetración de caché con la analogía de "buscar un libro"
Imagina que buscas un libro en la biblioteca y le preguntas al bibliotecario: "¿Tenéis 'El libro inexistente'?"

**Flujo normal**:
- El bibliotecario consulta el catálogo: "No tenemos ese libro"
- Te vas

**Escenario de penetración de caché**:
- La 1ª vez que preguntas, el bibliotecario consulta la base de datos: "No", y te lo dice
- La 2ª vez que preguntas, el bibliotecario vuelve a consultar la base de datos: "No"
- La 100ª vez que preguntas, el bibliotecario sigue consultando la base de datos: "No"

**Problema**: el bibliotecario (base de datos) está agotado de tanto consultar, aunque la respuesta siempre sea "No".

**Solución**: el bibliotecario recuerda que "'El libro inexistente' no existe" y la próxima vez dice directamente "No" sin consultar la base de datos. Esto es **cachear objetos vacíos**.
:::

**Escenarios reales**:
- Atacantes maliciosos construyen muchos IDs inexistentes para hacer consultas (como id=-1, id=999999999)
- Crawlers que recorren rutas de recursos inexistentes (como /api/products/invalid-id)
- Errores de lógica de negocio que provocan consultas de datos inválidos

**Solución 1: Cachear objetos vacíos**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // 1. Primero consultar la caché
  const cached = await redis.get(cacheKey)
  if (cached !== null) {
    // Atención: cached podría ser la cadena "null"
    if (cached === 'null') {
      // La caché contiene un "objeto vacío", significa que no existe en la BD
      return null
    }
    return JSON.parse(cached)
  }

  // 2. Consultar la base de datos
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // 3. Incluso si no existe en la BD, cachear "null" con TTL corto (5 minutos)
  if (!product) {
    await redis.setex(cacheKey, 300, 'null')
    return null
  }

  // 4. Datos encontrados, cachear normalmente
  await redis.setex(cacheKey, 1800, JSON.stringify(product))
  return product
}
```

**Solución 2: Filtro de Bloom (Bloom Filter)**

El filtro de Bloom es una herramienta para "determinar rápidamente si un dato existe", como un "súper índice":

::: tip 📖 ¿Qué es un filtro de Bloom?
Imagina que tienes una "caja negra mágica":
- Le preguntas: "¿Existe el producto con ID 123?"
- Te dice: "**Seguro que no existe**" → entonces realmente no existe, no hace falta consultar la BD
- Te dice: "**Puede que exista**" → entonces hay que consultar la BD para confirmar

**Características**:
- **Nunca omite un negativo**: si dice que no existe, es seguro que no existe
- **Puede tener falsos positivos**: si dice que puede existir, a veces realmente no existe (probabilidad baja, configurable)

**Valor**: el filtro de Bloom puede interceptar el 99% de las solicitudes de datos "inexistentes" antes de llegar a la caché, protegiendo la base de datos.
:::

```javascript
// Usar filtro de Bloom
const { BloomFilter } = require('bloom-filters')

// Inicializar filtro de Bloom (asumiendo un máximo de 1 millón de IDs de producto)
const bloomFilter = new BloomFilter(1000000, 0.01)  // tasa de falsos positivos: 1%

// Al iniciar el sistema, añadir todos los IDs de producto al filtro de Bloom
async function initBloomFilter() {
  const allIds = await db.query('SELECT id FROM products')
  allIds.forEach(row => {
    bloomFilter.add(row.id)
  })
}

// Antes de consultar un producto, usar el filtro de Bloom para decidir
async function getProduct(productId) {
  // 1. Primero comprobar con el filtro de Bloom
  if (!bloomFilter.has(productId)) {
    // Seguro que no existe, devolver null directamente sin consultar la BD
    console.log('Filtro de Bloom intercepta: el producto no existe')
    return null
  }

  // 2. El filtro de Bloom dice "puede existir", consultar la caché
  const cached = await redis.get(`product:${productId}`)
  if (cached) {
    return JSON.parse(cached)
  }

  // 3. Fallo de caché, consultar la base de datos
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  if (!product) {
    // Falso positivo del filtro de Bloom (probabilidad muy baja), realmente no existe
    await redis.setex(`product:${productId}`, 300, 'null')
    return null
  }

  // 4. Datos encontrados, escribir en caché
  await redis.setex(`product:${productId}`, 1800, JSON.stringify(product))
  return product
}
```

### 4.2 Rotura de caché: caducidad de datos frecuentes

**Definición del problema**: un **dato muy frecuente** (como un producto popular, una noticia de tendencia) expira en la caché (el TTL vence) y, en ese momento, muchas solicitudes concurrentes llegan simultáneamente y todas van a consultar la base de datos, provocando un pico de presión.

::: tip 🤔 Entendiendo la rotura de caché con la analogía de "pelearse por un libro"
Imagina que en la biblioteca hay un ejemplar de "Harry Potter", súper popular, y 100 personas quieren tomarlo prestado.

**Situación normal**:
- La biblioteca pone "Harry Potter" en el "mostrador de préstamos" (caché)
- La gente lo coge directamente del mostrador, sin necesidad de ir a la estantería

**Escenario de rotura de caché**:
- El "Harry Potter" del mostrador vence (se devuelve a la estantería)
- 100 personas vienen a la vez a por él, descubren que no está en el mostrador
- Las 100 personas van corriendo a la estantería (base de datos)
- El encargado de la estantería (base de datos) queda desbordado

**Problema**: no es un "libro que no existe", sino un "libro súper popular" que desaparece repentinamente de la caché, provocando que una avalancha de solicitudes golpee la base de datos.
:::

**Escenarios reales**:
- El trending topic de Weibo expira y decenas de miles de personas acceden a la vez
- La caché de una noticia de cotilleo de una celebridad caduca y los fans acceden desesperadamente
- Los datos de inventario expiran justo cuando empieza una venta flash

**Solución 1: Bloqueo mutex (Mutex Lock)**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // 1. Primero consultar la caché
  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  // 2. Fallo de caché, obtener el bloqueo distribuido
  const lockKey = `lock:${productId}`
  const lock = await redis.set(lockKey, '1', 'NX', 'EX', 10)  // bloqueo de 10 segundos

  if (lock === 'OK') {
    // 3. Bloqueo obtenido, consultar la base de datos
    console.log('Bloqueo obtenido, consultando la base de datos')
    const product = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    )

    // 4. Escribir en caché
    await redis.setex(cacheKey, 1800, JSON.stringify(product))

    // 5. Liberar el bloqueo
    await redis.del(lockKey)
    return product
  } else {
    // 6. No se obtuvo el bloqueo, esperar 50ms y reintentar
    console.log('Bloqueo no obtenido, esperando para reintentar')
    await new Promise(resolve => setTimeout(resolve, 50))
    return getProduct(productId)  // reintento recursivo
  }
}
```

**Solución 2: Expiración lógica (Logical Expiration)**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // 1. Consultar la caché
  const cached = await redis.get(cacheKey)
  if (cached) {
    const data = JSON.parse(cached)

    // 2. Comprobar el tiempo de expiración lógica
    if (Date.now() < data.expireTime) {
      // No ha expirado, devolver directamente
      return data.product
    } else {
      // 3. Expirado lógicamente, reconstruir caché asíncronamente y devolver datos antiguos
      console.log('Expirado lógicamente, reconstruyendo caché asíncronamente')
      rebuildCacheAsync(productId)  // reconstrucción asíncrona
      return data.product  // devolver datos antiguos
    }
  }

  // 4. La caché no existe (primera carga), consultar la BD sincrónicamente
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // 5. Escribir en caché (incluyendo el tiempo de expiración lógica)
  const cacheData = {
    product: product,
    expireTime: Date.now() + 30 * 60 * 1000  // expiración lógica en 30 minutos
  }
  await redis.set(cacheKey, JSON.stringify(cacheData))

  return product
}

// Reconstrucción asíncrona de caché
async function rebuildCacheAsync(productId) {
  const lockKey = `rebuild:${productId}`
  const lock = await redis.set(lockKey, '1', 'NX', 'EX', 10)

  if (lock === 'OK') {
    console.log('Inicio de reconstrucción asíncrona de caché')
    const product = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    )

    const cacheData = {
      product: product,
      expireTime: Date.now() + 30 * 60 * 1000
    }
    await redis.set(`product:${productId}`, JSON.stringify(cacheData))
    await redis.del(lockKey)
    console.log('Reconstrucción asíncrona de caché completada')
  }
}
```

### 4.3 Avalancha de caché: caducidad masiva de datos simultánea

**Definición del problema**: una gran cantidad de datos en caché **expiran todos al mismo tiempo** (o Redis se cae), provocando que todas las solicitudes atraviesen simultáneamente hasta la base de datos y la aplasten instantáneamente.

::: tip 🤔 Entendiendo la avalancha de caché con la analogía de "devolución masiva de libros"
Imagina que el "mostrador de préstamos" (caché) de la biblioteca tiene 1000 libros.

**Situación normal**:
- Las fechas de devolución de estos libros están distribuidas: unos vencen hoy, otros mañana, otros pasado mañana
- Cada día solo vencen unas decenas de libros, el encargado (base de datos) puede gestionarlo fácilmente

**Escenario de avalancha de caché**:
- Tras reiniciar el sistema, el encargado configura los 1000 libros con "vencimiento en 30 días"
- 30 días después, los 1000 libros vencen simultáneamente
- 1000 personas vienen a la vez a por libros, descubren que el mostrador está vacío
- Las 1000 personas van corriendo a la estantería
- El encargado de la estantería (base de datos) queda instantáneamente desbordado

**Problema**: no es el problema de un solo libro, sino la **caducidad masiva de datos simultánea** que provoca un pico instantáneo de presión en la base de datos.
:::

**Escenarios reales**:
- Tras reiniciar el sistema, todas las cachés se reconstruyen desde cero con el mismo TTL (por ejemplo, 30 minutos)
- Una tarea programada refresca las cachés en lote con el mismo tiempo de expiración
- El servicio de caché (Redis) se cae o hay una partición de red

**Solución 1: TTL aleatorio**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // Clave: añadir un valor aleatorio (±5 minutos) al TTL base (30 minutos)
  const baseTTL = 1800  // 30 minutos
  const randomOffset = Math.floor(Math.random() * 600) - 300  // -5 a +5 minutos
  const finalTTL = baseTTL + randomOffset

  console.log(`TTL de caché: ${finalTTL} segundos (${Math.floor(finalTTL / 60)} minutos)`)
  await redis.setex(cacheKey, finalTTL, JSON.stringify(product))

  return product
}
```

**Solución 2: Precalentamiento de caché (Cache Preheating)**

```javascript
// Al iniciar el sistema, cargar activamente los datos frecuentes en caché
async function cacheWarmup() {
  console.log('Iniciando precalentamiento de caché...')

  // 1. Consultar los 1000 productos más populares (ordenados por visitas)
  const hotProducts = await db.query(`
    SELECT * FROM products
    ORDER BY view_count DESC
    LIMIT 1000
  `)

  // 2. Escribir en lote en Redis
  for (const product of hotProducts) {
    const cacheKey = `product:${product.id}`
    const ttl = 1800 + Math.floor(Math.random() * 600)  // 30 minutos ± 5 minutos
    await redis.setex(cacheKey, ttl, JSON.stringify(product))
  }

  console.log(`Precalentamiento de caché completado, ${hotProducts.length} productos populares cargados`)
}

// Ejecutar al iniciar la aplicación
cacheWarmup()
```

**Solución 3: Circuit Breaker (disyuntor)**

```javascript
// Usar un disyuntor para proteger la base de datos
const CircuitBreaker = require('opossum')

// Configurar el disyuntor
const dbQueryBreaker = new CircuitBreaker(
  async (productId) => {
    return await db.query('SELECT * FROM products WHERE id = ?', [productId])
  },
  {
    timeout: 3000,  // timeout de 3 segundos
    errorThresholdPercentage: 50,  // abrir el circuito si la tasa de error supera el 50%
    resetTimeout: 30000  // intentar recuperar después de 30 segundos
  }
)

// Manejo de degradación tras la apertura del circuito
dbQueryBreaker.fallback(() => {
  console.log('Circuito de BD abierto, devolviendo datos degradados')
  return {
    id: productId,
    name: 'Servicio ocupado, inténtalo de nuevo más tarde',
    status: 'degraded'
  }
})

async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  // Consultar la base de datos a través del disyuntor
  const product = await dbQueryBreaker.fire(productId)

  if (product.status === 'degraded') {
    return product  // devolver datos degradados
  }

  await redis.setex(cacheKey, 1800, JSON.stringify(product))
  return product
}
```

👇 **Mira cómo funciona**:
La siguiente demostración compara los escenarios y soluciones de los tres problemas: penetración, rotura y avalancha de caché:

<CacheProblemsDemo />

---

## 5. Estrategias de consistencia de caché: cómo mantener sincronizadas la caché y la base de datos

La esencia de la caché es ser una copia de los datos, y entre la copia y los datos originales (base de datos) siempre existe una ventana de tiempo de inconsistencia. Cómo controlar esta ventana es el desafío central del diseño de caché.

### 5.1 Motivación de caché y la base de datos pueden estar inconsistentes

::: tip 🤔 Entendiendo la inconsistencia con la analogía de "la nota adhesiva y el libro"
Imagina que tienes una nota adhesiva con: "Teléfono de Xiao Ming: 123456", que es una copia de tu agenda (base de datos).

**Escenario de inconsistencia**:
- Actualizas la agenda, cambiando el teléfono de Xiao Ming a "7654321"
- Pero olvidas actualizar la nota adhesiva
- La próxima vez que buscas el teléfono, miras la nota adhesiva y sigue el antiguo "123456"

**Problema**: la nota adhesiva (caché) y la agenda (base de datos) están inconsistentes.

**Causa**: se actualizaron los datos originales, pero no se sincronizó la copia. En los sistemas informáticos, esto ocurre porque "actualizar la base de datos" y "actualizar la caché" son dos operaciones independientes con una ventana de tiempo entre ellas, que puede ser alterada por otras operaciones.
:::

**Escenario real de concurrencia**:

| Tiempo | Hilo A (actualiza edad del usuario) | Hilo B (consulta usuario) | Base de datos | Caché |
|------|---------------------|------------------|--------|------|
| T1 | Empieza a actualizar BD | - | age=20 | age=20 |
| T2 | BD actualizada a age=25 | Consulta caché, acierta age=20 | age=25 | age=20 ❌ |
| T3 | Elimina caché | - | age=25 | - |
| T4 | - | - | age=25 | Carga desde BD age=25 ✅ |

**Problema**: en el momento T2, el hilo B leyó el valor antiguo 20 de la caché, mientras que la base de datos ya tenía 25. Esto es la **inconsistencia de caché**.

### 5.2 Mejor práctica: primero actualizar la base de datos, luego eliminar la caché

::: tip 🤔 ¿Por qué "eliminar" en lugar de "actualizar" la caché?
Puede que pienses: ¿por qué no "actualizar la caché" directamente en lugar de "eliminar la caché"?

**Problemas de actualizar la caché**:
- En actualizaciones concurrentes, el hilo A podría actualizar la caché primero y el hilo B actualizar la base de datos después sin que la caché se actualice
- El costo de actualizar la caché puede ser alto (por ejemplo, si requiere agregar datos de varias tablas)
- Si los datos se eliminan después de actualizarlos, el esfuerzo ha sido en vano

**Ventajas de eliminar la caché**:
- En la siguiente consulta, se carga automáticamente el dato más reciente desde la base de datos (carga diferida)
- Se evitan los datos sucios causados por actualizaciones concurrentes
- Simple y fiable, es la mejor práctica de la industria
:::

**Flujo estándar**:

```javascript
// Actualizar información del producto
async function updateProduct(productId, updateData) {
  // 1. Primero actualizar la base de datos
  await db.query(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [updateData.name, updateData.price, productId]
  )

  // 2. Luego eliminar la caché (¡no actualizarla!)
  await redis.del(`product:${productId}`)

  // 3. En la siguiente consulta, fallo de caché, se carga automáticamente el dato más reciente
  console.log('Actualización completada, caché eliminada')
}
```

::: details Ver por qué "primero actualizar BD, luego eliminar caché" es la mejor opción
Comparativa de tres estrategias de actualización:

**Estrategia 1: Primero actualizar caché, luego BD** ❌ No recomendada
```javascript
// Problema: si la actualización de BD falla, la caché tiene el valor nuevo y la BD el antiguo, inconsistencia
await redis.set('product:1', newProduct)  // caché actualizada correctamente
await db.query('UPDATE products SET ...')  // ¡actualización de BD fallida!
// Resultado: caché con valor nuevo, BD con valor antiguo, ¡inconsistencia permanente!
```

**Estrategia 2: Primero eliminar caché, luego actualizar BD** ❌ No recomendada
```javascript
// Problema: entre la eliminación y la actualización, otro hilo consulta y carga el dato antiguo en caché
await redis.del('product:1')  // caché eliminada
// En este momento, el hilo B consulta, ve que no hay caché, consulta BD (aún valor antiguo), escribe en caché
await db.query('UPDATE products SET ...')  // actualizar BD
// Resultado: caché con valor antiguo, BD con valor nuevo, ¡inconsistencia!
```

**Estrategia 3: Primero actualizar BD, luego eliminar caché** ✅ Recomendada
```javascript
// Ventaja: la actualización de BD adquiere un bloqueo de fila, otros hilos deben esperar, evitando datos sucios
await db.query('UPDATE products SET ...')  // actualizar BD (adquiere bloqueo de fila)
await redis.del('product:1')  // eliminar caché
// Incluso si falla la eliminación de caché, solo significa que la siguiente consulta irá a origen,
// sin causar datos sucios persistentes
```

**¿Por qué la estrategia 3 es la mejor?**
1. **Protección del bloqueo de BD**: la operación de actualización adquiere un bloqueo de fila, otras operaciones de lectura/escritura deben esperar
2. **Impacto bajo si falla la eliminación**: incluso si falla la eliminación de caché, solo implica que la siguiente lectura irá a origen, sin causar datos sucios
3. **Simple y fiable**: no requiere lógica compleja adicional
:::

### 5.3 Doble eliminación diferida: garantía de consistencia en escenarios extremos

**Escenario**: en situaciones de alta concurrencia, incluso con "primero actualizar BD, luego eliminar caché", existe una probabilidad muy pequeña de inconsistencia. La doble eliminación diferida, mediante dos eliminaciones, maximiza la garantía de consistencia.

**Flujo**:
```
1. Eliminar caché
2. Actualizar base de datos
3. Esperar un tiempo (por ejemplo, 500ms)
4. Eliminar caché de nuevo
```

```javascript
async function updateProduct(productId, updateData) {
  const cacheKey = `product:${productId}`

  // 1. Primera eliminación de caché
  await redis.del(cacheKey)

  // 2. Actualizar base de datos
  await db.query(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [updateData.name, updateData.price, productId]
  )

  // 3. Esperar 500ms (para que las consultas de otros hilos se completen)
  await new Promise(resolve => setTimeout(resolve, 500))

  // 4. Segunda eliminación de caché (elimina datos antiguos que otros hilos puedan haber cargado)
  await redis.del(cacheKey)

  console.log('Doble eliminación diferida completada, datos sincronizados')
}
```

**Comparativa de las tres estrategias de consistencia**:

| Estrategia | Nivel de consistencia | Impacto en rendimiento | Complejidad | Escenario aplicable |
|------|-----------|---------|--------|---------|
| **Primero actualizar BD, luego eliminar caché** | Consistencia eventual (ventana < 100ms) | Bajo | Baja | La mayoría de escenarios, recomendada por defecto |
| **Doble eliminación diferida** | Consistencia eventual fuerte (ventana < 10ms) | Medio (retraso 500ms) | Media | Escenarios con altos requisitos de consistencia (finanzas, inventario) |
| **Primero eliminar caché, luego actualizar BD** | Débil (ventana grande de inconsistencia) | Bajo | Baja | ❌ No recomendada, propensa a inconsistencias |

👇 **Mira cómo funciona**:
La siguiente demostración compara el efecto de las tres estrategias de consistencia. Haz clic en "Actualizar datos" y observa cómo cambia la consistencia entre caché y base de datos:

<CacheConsistencyDemo />

---

## 6. Práctica: construir un sistema de caché completo

Después de tanta teoría, veamos un caso real: cómo diseñar un sistema de caché completo para la página de detalle de producto de un comercio electrónico.

### 6.1 Análisis del escenario de negocio

**Requisito**: los usuarios visitan la página de detalle de producto, que necesita mostrar información básica del producto, precio, inventario, valoraciones, etc.

**Características**:
- **Muchas lecturas, pocas escrituras**: 100 consultas por cada actualización (ratio lectura/escritura 100:1)
- **Concentración de datos frecuentes**: el 20% de los productos generan el 80% del tráfico
- **Datos complejos**: información básica + precio + inventario + agregación de valoraciones
- **Requisitos de consistencia**: precio e inventario requieren consistencia fuerte; el resto, consistencia eventual

**Indicadores de rendimiento**:
- P99 de tiempo de respuesta < 100ms (el 99% de las solicitudes responden en menos de 100ms)
- QPS pico de la base de datos < 5000
- Tasa de aciertos de caché > 95%

### 6.2 Diseño de arquitectura

**Arquitectura de caché multinivel**:

```
Solicitud del usuario
  ↓
Caché CDN (recursos estáticos: imágenes, CSS, JS)
  ↓ fallo
Caché local Nginx (agregación de información básica del producto)
  ↓ fallo
Servidor de aplicaciones
  ↓
  ├─ L1: Caché local (Caffeine, productos populares)
  │   ↓ fallo
  ├─ L2: Caché Redis (todos los datos de productos)
  │   ↓ fallo
  └─ L3: Base de datos MySQL (todos los datos)
```

### 6.3 Implementación del código central

**Implementación completa de caché multinivel (versión simplificada)**:

```javascript
const caffeine = require('caffeine')

// L1: Caché local (expiración de 30 segundos)
const localCache = new caffeine.Cache({
  max: 1000,
  ttl: 30,
})

// Obtener detalles del producto (caché multinivel)
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // L1: Caché local (~0.1 milisegundos)
  const localCached = localCache.get(cacheKey)
  if (localCached) {
    console.log('Acierto L1')
    return localCached
  }

  // L2: Caché Redis (~1 milisegundo)
  const redisCached = await redis.get(cacheKey)
  if (redisCached) {
    console.log('Acierto L2, rellenando L1')
    const product = JSON.parse(redisCached)
    localCache.set(cacheKey, product)
    return product
  }

  // L3: Base de datos (~10 milisegundos, con bloqueo distribuido anti-rotura)
  const lockKey = `lock:${productId}`
  const lock = await redis.set(lockKey, '1', 'NX', 'EX', 10)

  if (lock === 'OK') {
    console.log('Acierto L3, consultando base de datos')
    const product = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    )

    if (product) {
      // Escribir en Redis (30 minutos + TTL aleatorio)
      const ttl = 1800 + Math.floor(Math.random() * 600) - 300
      await redis.setex(cacheKey, ttl, JSON.stringify(product))
      // Rellenar caché local
      localCache.set(cacheKey, product)
    }

    await redis.del(lockKey)
    return product
  } else {
    // Bloqueo no obtenido, esperar y reintentar
    await new Promise(resolve => setTimeout(resolve, 50))
    return getProduct(productId)
  }
}

// Actualizar información del producto (primero BD, luego eliminar caché)
async function updateProduct(productId, updateData) {
  const cacheKey = `product:${productId}`

  // 1. Actualizar base de datos
  await db.query(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [updateData.name, updateData.price, productId]
  )

  // 2. Eliminar caché local
  localCache.del(cacheKey)

  // 3. Eliminar caché Redis
  await redis.del(cacheKey)

  console.log('Actualización completada, cachés eliminadas')
}
```

👇 **Mira cómo funciona**:
La siguiente demostración muestra el flujo de trabajo completo de un sistema de caché multinivel. Haz clic en "Consultar producto" y observa cómo la solicitud fluye a través de los distintos niveles de caché:

<EcommerceCacheArchitectureDemo />

---

## 7. Resumen y ruta de aprendizaje

### 7.1 Repaso de conocimientos clave

| Conocimiento | Explicación en una frase | Problema que resuelve | Puntos prácticos |
|--------|-----------|-----------|----------|
| **Acierto de caché** | Los datos se encuentran en la caché | Rendimiento 10-100 veces mejor | Tasa de aciertos objetivo > 95% |
| **Penetración de caché** | Consultar datos inexistentes, cada vez va a la BD | La BD es derribada por consultas maliciosas | Filtro de Bloom + cachear objetos vacíos |
| **Rotura de caché** | Dato frecuente expira, avalancha de solicitudes a la BD | Pico instantáneo de presión en la BD | Bloqueo mutex + expiración lógica |
| **Avalancha de caché** | Gran cantidad de datos expiran simultáneamente | La BD es aplastada | TTL aleatorio + precalentamiento de caché |
| **Caché multinivel** | Caché local + Redis + BD | Optimización extrema del rendimiento | L1 caché local 70% aciertos, L2 Redis 25% aciertos |
| **Consistencia de caché** | Sincronización entre caché y BD | Precisión de los datos | Primero actualizar BD, luego eliminar caché |
| **Doble eliminación diferida** | Eliminar caché antes y después de actualizar | Consistencia en escenarios extremos | Esperar 500ms antes de la segunda eliminación |

### 7.2 Ruta de aprendizaje recomendada

**Fase 1: Entender los principios (1-2 días)**
- Dominar la esencia de la caché (copia de datos, intercambiar espacio por tiempo)
- Entender la tasa de aciertos, TTL, desalojo y otros conceptos básicos
- Conocer las diferencias de rendimiento entre distintos medios de almacenamiento (memoria vs. disco)

**Fase 2: Dominar lo básico (2-3 días)**
- Aprender a usar Redis como caché (comandos SET, GET, SETEX)
- Implementar la lógica simple de lectura/escritura con caché (primero caché, si falla, BD)
- Entender por qué "al actualizar se elimina la caché en lugar de actualizarla"

**Fase 3: Resolver problemas clásicos (1 semana)**
- Resolver la penetración de caché: implementar filtro de Bloom o cachear objetos vacíos
- Resolver la rotura de caché: implementar bloqueo mutex o expiración lógica
- Resolver la avalancha de caché: implementar TTL aleatorio y precalentamiento de caché

**Fase 4: Caché multinivel (1-2 semanas)**
- Introducir caché local (Caffeine/Guava)
- Diseñar una arquitectura de dos niveles: caché local + Redis
- Manejar los problemas de consistencia en caché multinivel

**Fase 5: Práctica en producción (continuo)**
- Diseñar un sistema de caché completo para la página de detalle de producto
- Implementar monitorización (tasa de aciertos de caché, tiempo de respuesta)
- Realizar pruebas de carga y ajustes de rendimiento

::: info 💡 Para terminar
La caché es la piedra angular de los sistemas de alta concurrencia. Desde la página de detalle de producto de Taobao hasta los trending topics de Weibo, desde el feed de WeChat hasta el flujo de videos de Douyin, detrás de todo sistema de alto rendimiento hay una arquitectura de caché cuidadosamente diseñada.

Entender la caché no es solo aprender una tecnología, sino comprender la filosofía arquitectónica de **intercambiar espacio por tiempo y usar copias para proteger los datos principales**. Cuando realmente domines la caché, el rendimiento de tu sistema pasará de "funciona" a "es bueno" y, finalmente, a "es excelente".

Espero que este artículo te ayude a construir una comprensión completa del sistema de caché. Cuando te enfrentes a problemas de rendimiento en proyectos reales, puedas pensar: "¿Se puede resolver esto con caché?"
:::