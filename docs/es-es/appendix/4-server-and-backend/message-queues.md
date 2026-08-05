# Principios de las colas de mensajes y la arquitectura orientada a eventos
::: tip 🎯 Pregunta Central
**Cuando el sistema está fuertemente acoplado y el tráfico aumenta repentinamente, ¿cómo garantizar la estabilidad de la ruta crítica?** Las colas de mensajes son el "amortiguador" y "desacoplador" de los sistemas distribuidos modernos. Este artículo utiliza casos reales (sistema de turnos de restaurante, clasificación de paquetería, sistemas de venta flash) para comprender a fondo la filosofía de diseño y las prácticas de ingeniería de las colas de mensajes.
:::

---

## 1. Motivación de colas de mensajes

### 1.1 Un caso real: la evolución del sistema de pedidos de Taobao

En 2012, el sistema de pedidos de Taobao sufrió una falla grave. A la medianoche del Doble 11, el tráfico llegó en masa y el servicio de pedidos llamaba directamente al servicio de inventario, al servicio de pago, al servicio de logística… toda la cadena colapsó como un efecto dominó.

**La arquitectura de entonces (fuertemente acoplada):**

```
Usuario realiza pedido → Servicio de Pedidos → llamada síncrona a Servicio de Inventario → llamada síncrona a Servicio de Pago → llamada síncrona a Servicio de Logística
                              ↓                    ↓                    ↓
                         Respuesta 200ms      Respuesta 500ms      Respuesta 300ms
```

::: warning ⚠️ Problemas fatales del acoplamiento fuerte

- **Tiempo total de respuesta** = 200 + 500 + 300 = 1000ms (el usuario espera 1 segundo)
- **Si el servicio de inventario falla** → el servicio de pedidos también falla (agotamiento del pool de hilos)
- **Si el servicio de pago se ralentiza** → toda la cadena se frena
- **No se puede escalar horizontalmente** → solo se puede escalar verticalmente (costoso y limitado)
  :::

**Arquitectura mejorada (introduciendo colas de mensajes):**

```
Usuario realiza pedido → Servicio de Pedidos → envía mensaje "Pedido Creado" → responde inmediatamente (50ms)
                                   ↓
                          Cola de Mensajes (Kafka)
                                   ↓
        ┌─────────────┬─────────────┬─────────────┐
        ▼             ▼             ▼             ▼
 Servicio de     Servicio de    Servicio de    Servicio de
  Inventario       Pago         Logística      Notificaciones
  (descuento     (procesamiento  (creación     (envío
   asíncrono)     asíncrono)     asíncrona)    asíncrono)
```

::: tip ✨ Resultados de la mejora

- **Tiempo de respuesta al usuario** = 50ms (experiencia 20 veces mejor)
- **Si el servicio de inventario falla** → el mensaje se almacena en la cola y se procesa cuando se recupere
- **Si el servicio de pago se ralentiza** → no afecta la creación del pedido
- **Se puede escalar horizontalmente** → basta con añadir más instancias consumidoras
  :::

### 1.2 Analogía cotidiana de las colas de mensajes

**Sistema de turnos de un restaurante**

Imagina que vas a un restaurante popular:

- **Sin sistema de turnos**: los clientes deben esperar de pie en la ventanilla, el espacio es limitado, se forman largas colas, el restaurante está bajo mucha presión
- **Con sistema de turnos**: después de pedir te dan un número, puedes sentarte y recoges tu comida cuando llamen tu número

**La cola de mensajes es el "sistema de turnos" del software**:

- **Productor** (la persona que pide) → coloca el mensaje (pedido) en la cola
- **Cola** (el mostrador de turnos) → almacena temporalmente los mensajes
- **Consumidor** (el cocinero) → procesa los mensajes a su propio ritmo

<PeakShavingDemo />

---

## 2. Introducción a cola de mensajes (Definición + tres elementos fundamentales)

### 2.1 Introducción a "cola de mensajes"

::: tip 🤔 Explicación del término
**Cola de Mensajes (Message Queue, MQ)** es un contenedor que almacena mensajes: los productores depositan mensajes y los consumidores los recuperan para procesarlos. Implementa la "comunicación asíncrona" — el emisor no necesita esperar a que el receptor termine de procesar.

**Síncrono vs Asíncrono**:

- **Síncrono**: como una llamada telefónica, la otra persona debe contestar para poder comunicarse
- **Asíncrono**: como enviar un mensaje de WhatsApp, lo envías y la otra persona lo ve cuando tenga tiempo

Es como llamar a un amigo (síncrono) vs enviarle un mensaje (asíncrono).
:::

### 2.2 Los tres elementos fundamentales de las colas de mensajes

#### Elemento uno: Productor (Producer)

**Responsabilidad**: crear y enviar mensajes a la cola.

**Analogía cotidiana**: el productor es como el "remitente", que entrega la carta (mensaje) a la oficina de correos (cola).

::: details Puntos clave de diseño

- **Modo de envío**: envío síncrono (fiable pero bloqueante) vs envío asíncrono (alto rendimiento pero requiere manejo de callbacks)
- **Confirmación de mensaje**: esperar confirmación del Broker (At Least Once) vs disparar y olvidar (At Most Once)
- **Manejo de fallos**: estrategia de reintentos, respaldo en registro local, cola de mensajes muertos (Dead Letter Queue)
  :::

#### Elemento dos: Consumidor (Consumer)

**Responsabilidad**: obtener y procesar mensajes de la cola.

**Analogía cotidiana**: el consumidor es como el "destinatario", que recoge la carta (mensaje) del buzón (cola) y la procesa.

::: details Puntos clave de diseño

- **Modo de consumo**: modo Push (el Broker envía activamente) vs modo Pull (el consumidor obtiene activamente)
- **Confirmación de consumo**: ACK automático (eficiente pero puede perder mensajes) vs ACK manual (fiable pero requiere manejo de timeouts)
- **Control de concurrencia**: consumo secuencial en un solo hilo vs consumo paralelo en múltiples hilos
- **Manejo de fallos**: estrategia de reintentos, cola de mensajes muertos, mecanismo de compensación
  :::

#### Elemento tres: Broker (Agente de Mensajes)

**Responsabilidad**: recibir, almacenar y reenviar mensajes.

**Analogía cotidiana**: el Broker es como la "oficina de correos" o el "centro de distribución de paquetería", encargado de recibir, clasificar y entregar cartas.

::: details Puntos clave de diseño

- **Modelo de almacenamiento**: almacenamiento en memoria (baja latencia) vs almacenamiento en disco (alta fiabilidad)
- **Estrategia de replicación**: replicación maestro-esclavo, sincronización multi-réplica
- **Mecanismo de alta disponibilidad**: despliegue en clúster, conmutación por error automática
- **Escalabilidad**: particionamiento (Partition), fragmentación (Sharding)
  :::

---

## 3. Primer problema central: Enfoque de desacoplar el sistema para evitar que "un cambio afecte a todo"

### 3.1 La tragedia del acoplamiento fuerte: un servicio falla y todo se viene abajo

**Reconstrucción del escenario**: la arquitectura temprana de una plataforma de comercio electrónico

```
El servicio de pedidos llama directamente a los servicios descendentes:
┌─────────────────┐
│ Servicio de     │
│   Pedidos       │
└────────┬────────┘
         │
         ├───────────┬───────────┬───────────┐
         ▼           ▼           ▼           ▼
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│ Servicio   │ │ Servicio   │ │ Servicio   │ │ Servicio   │
│ Inventario │ │   Pago     │ │ Logística  │ │   SMS      │
│   200ms    │ │   500ms    │ │   300ms    │ │   100ms    │
└────────────┘ └────────────┘ └────────────┘ └────────────┘
```

::: tip 📊 Tabla de análisis de puntos débiles
| Punto débil | Manifestación | Consecuencia |
|-------------|---------------|--------------|
| **Fallo en cascada** | El servicio de inventario falla, la llamada síncrona del servicio de pedidos expira | El pool de hilos del servicio de pedidos se agota, no puede procesar nuevas solicitudes |
| **Latencia de respuesta** | Debe esperar la respuesta de todos los servicios descendentes | El usuario espera más de 1 segundo, experiencia pésima |
| **Dificultad para escalar** | Añadir un servicio de puntos requiere modificar el código del servicio de pedidos | Ciclos de publicación más largos, mayor riesgo |
| **Desperdicio de recursos** | El servicio de pedidos debe esperar al servicio de SMS | Las conexiones a la base de datos se mantienen ocupadas durante mucho tiempo |
:::

### 3.2 Solución de desacoplamiento: introducir la cola de mensajes como "capa intermedia"

**Arquitectura después del desacoplamiento:**

```
El servicio de pedidos solo envía mensajes, no le importa quién los consume:

┌─────────────────┐
│ Servicio de     │ ──envía mensaje "Pedido Creado"──┐
│   Pedidos       │                                   │
└─────────────────┘                                   │
                                                      ▼
                                          ┌───────────────────────┐
                                          │    Cola de Mensajes    │
                                          │  (Kafka/RabbitMQ)      │
                                          │   - Almacenamiento     │
                                          │     fiable             │
                                          │   - Múltiples réplicas │
                                          │   - Garantía de orden  │
                                          └───────────┬───────────┘
                                                      │
              ┌───────────────────────────────────────┼───────────────────────────────────────┐
              │                                       │                                       │
              ▼                                       ▼                                       ▼
       ┌──────────────────┐              ┌──────────────────┐              ┌──────────────────┐
       │   Servicio de    │              │   Servicio de    │              │   Servicio de    │
       │   Inventario     │              │     Pago         │              │   Logística      │
       │   Suscrito al    │              │   Suscrito al    │              │   Suscrito al    │
       │   evento pedido  │              │   evento pedido  │              │   evento pedido  │
       └──────────────────┘              └──────────────────┘              └──────────────────┘
```

<DecouplingDemo />

::: tip ✨ Beneficios del desacoplamiento
| Dimensión | Antes del desacoplamiento | Después del desacoplamiento |
|-----------|---------------------------|-----------------------------|
| **Aislamiento de fallos** | Si inventario falla = pedidos falla | Si inventario falla, el mensaje se guarda en la cola y se consume al recuperarse |
| **Tiempo de respuesta** | 1000ms (espera síncrona) | 50ms (responde tras enviar el mensaje) |
| **Escalabilidad** | Añadir un servicio requiere modificar el código de pedidos | Añadir un servicio solo requiere suscribirse a un tema |
| **Complejidad del sistema** | El servicio de pedidos depende fuertemente de los descendentes | El servicio de pedidos solo depende de la cola de mensajes |
:::

### 3.3 La esencia del desacoplamiento: de "llamada directa" a "orientación a eventos"

**Cambio de paradigma mental:**

```
Pensamiento tradicional (imperativo):
"¡El servicio de pedidos ordena al servicio de inventario: descuenta mi stock!"
  ↓ Llamada directa
  ↓ Alto acoplamiento, el llamado debe estar en línea
  ↓ El llamador necesita conocer la interfaz del llamado

Pensamiento orientado a eventos (declarativo):
"El servicio de pedidos declara: el pedido ha sido creado, quien esté interesado que lo procese."
  ↓ Envía evento a la cola de mensajes
  ↓ Desacoplado, el consumidor puede estar fuera de línea
  ↓ El productor no necesita saber de la existencia del consumidor
```

---

## 4. Segundo problema central: Enfoque de recortar picos y rellenar valles para manejar aumentos repentinos de tráfico

### 4.1 Escenario de venta flash: Enfoque de procesar 100K QPS de manera estable

**Reconstrucción del escenario**: evento de venta flash del Doble 11 en una plataforma de comercio electrónico, con un pico estimado de 100K QPS, pero la base de datos solo puede soportar 1000 QPS.

**Consecuencias del impacto directo:**

```
Solicitudes de usuario ──→ Servidor de aplicaciones ──→ Base de datos
     100K/s                      100K/s                      1000/s (límite)
                                                             ↓
                                                        Pool de conexiones agotado
                                                        Timeout de respuesta
                                                        Base de datos colapsa
                                                             ↓
                                                        Efecto avalancha (todos los servicios que dependen de la BD fallan)
```

::: tip 🌊 Explicación del término
**QPS (Queries Per Second)**: consultas por segundo, métrica que mide el rendimiento del sistema.

**100K QPS** significa 100,000 solicitudes por segundo, como si 100,000 personas entraran a una tienda al mismo tiempo.
:::

### 4.2 Solución de recorte de picos y relleno de valles: la cola de mensajes como "embalse"

**Diseño de arquitectura:**

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                    Arquitectura del Sistema de Venta Flash                     │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Primera capa: Capa de Gateway (limitación dura de tráfico)                   │
│  ┌───────────────────────────────────────────────────────────────────────────┐│
│  │  - Limitación por token bucket: 100K/s → 10K/s (descarta el 90% de       ││
│  │    solicitudes)                                                            ││
│  │  - CDN para cachear recursos estáticos (páginas de detalle de producto)   ││
│  │  - CAPTCHA / página de espera (primera capa de recorte de picos)          ││
│  └───────────────────────────────────────────────────────────────────────────┘│
│                                    │                                           │
│                                    ▼                                           │
│  Segunda capa: Capa de Servicio (limitación suave de tráfico)                  │
│  ┌───────────────────────────────────────────────────────────────────────────┐│
│  │  - Limitación Nginx: 10K/s → 5000/s                                       ││
│  │  - Reserva previa de inventario en Redis (operación atómica):             ││
│  │    * Usar scripts Lua para garantizar atomicidad                          ││
│  │    * Si no hay stock, devolver directamente "Agotado"                     ││
│  │  - Generar token de pedido (comprobante de espera en cola)                ││
│  └───────────────────────────────────────────────────────────────────────────┘│
│                                    │                                           │
│                                    ▼                                           │
│  Tercera capa: Capa de Cola de Mensajes (recorte de picos central)             │
│  ┌───────────────────────────────────────────────────────────────────────────┐│
│  │  Kafka/RocketMQ:                                                          ││
│  │  - Escritura por lotes: 5000/s → 1000/s (capacidad de la BD)             ││
│  │  - Persistencia de mensajes: escritura en disco para no perder mensajes   ││
│  │  - Consumo paralelo multi-partición: aumentar el rendimiento              ││
│  │  - Gestión de offset de consumo: soporte para recuperación de fallos      ││
│  │                                                                           ││
│  │  Monitoreo de métricas clave:                                             ││
│  │  - Tasa de producción (Produce Rate)                                      ││
│  │  - Tasa de consumo (Consume Rate)                                         ││
│  │  - Mensajes acumulados (Lag)                                              ││
│  └───────────────────────────────────────────────────────────────────────────┘│
│                                    │                                           │
│                                    ▼                                           │
│  Cuarta capa: Capa de Consumo (procesamiento asíncrono)                        │
│  ┌───────────────────────────────────────────────────────────────────────────┐│
│  │  Consumidor de procesamiento de pedidos (múltiples instancias):           ││
│  │  - Extraer mensajes de Kafka (1000/s, ajustado a la capacidad de la BD)  ││
│  │  - Transacción de BD: crear pedido + descontar inventario                 ││
│  │  - Actualizar estado del pedido a "Creado"                                ││
│  │  - Enviar notificación de pedido creado (email/SMS/push)                  ││
│  │  - Confirmar consumo del mensaje (ACK)                                    ││
│  │                                                                           ││
│  │  Estrategia de escalado de consumidores:                                  ││
│  │  - Cuando Lag > 10000, aumentar automáticamente las instancias consumidoras││
│  │  - Cuando Lag < 1000, reducir instancias consumidoras (ahorrar costes)   ││
│  └───────────────────────────────────────────────────────────────────────────┘│
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

<PeakShavingDemo />

### 4.3 Principio matemático del recorte de picos y relleno de valles

**Efecto de suavizado de tráfico:**

```
Tráfico original (pico agudo):          Tráfico suavizado:

100K/s │    ╱╲                    1000/s │████████████████
       │   ╱  ╲                          │
       │  ╱    ╲                         │
 1000/s│╱        ╲                   0/s │
       └───────────────                 └────────────────
       0s   1s   2s                     0s              20s

Original: pico de 100K/s, duración de 1 segundo
Suavizado: tasa constante de 1000/s, duración de 100 segundos
```

**Fórmula clave:**

```
Longitud de la cola = Tasa del productor × Duración - Tasa del consumidor × Duración
                    = 100,000 × 1 - 1,000 × 1
                    = 99,000 mensajes (acumulación en el pico)

Tiempo para consumir todos los mensajes = Longitud de la cola / Tasa del consumidor
                                        = 99,000 / 1,000
                                        = 99 segundos
```

---

## 5. Tercer problema central: Enfoque de garantizar que los mensajes no se pierdan, no se dupliquen y mantengan el orden

### 5.1 Fiabilidad de mensajes: tres líneas de defensa

Los mensajes pueden perderse en tres etapas: al enviar del productor, al almacenar en el Broker y al procesar del consumidor.

::: warning 🛡️ Tres líneas de defensa
**Línea de defensa 1: Confirmación del productor (Producer ACK)**

- Al enviar un mensaje, esperar la confirmación del Broker de que lo ha recibido
- Si no se recibe confirmación, reintentar o registrar en un log local

**Línea de defensa 2: Persistencia del Broker**

- Los mensajes se escriben en disco, no solo en memoria
- Sincronización multi-réplica para garantizar que no se pierdan datos

**Línea de defensa 3: Confirmación del consumidor (Consumer ACK)**

- Después de procesar el mensaje, confirmar manualmente (ACK)
- Si el procesamiento falla, no confirmar, el Broker reenviará el mensaje
  :::

<ReliabilityDemo />

### 5.2 Enfoque de manejar el consumo duplicado de mensajes

**La duplicación de mensajes puede ocurrir en los siguientes escenarios:**

1. **Reintento del productor**: el productor envía un mensaje pero no recibe ACK, y reintenta enviar el mismo mensaje
2. **Timeout de ACK del consumidor**: el consumidor procesa correctamente pero el ACK expira, el Broker reenvía el mensaje
3. **Inestabilidad de red**: el ACK del consumidor no llega al Broker, el Broker asume que no se ha consumido
4. **Reinicio del consumidor**: el consumidor se reinicia y vuelve a consumir el mismo lote de mensajes

::: tip 💡 Idempotencia
**Idempotencia**: ejecutar la misma operación múltiples veces produce el mismo efecto que ejecutarla una sola vez.

**Idempotencia en la vida cotidiana**:

- **Idempotente**: pulsar el botón del ascensor (pulsarlo 10 veces o 1 vez, el ascensor vendrá igual)
- **No idempotente**: transferencia bancaria (transferir 10 euros, ejecutarlo dos veces transfiere 20 euros)

**Solución técnica**: generar un ID único para cada mensaje y verificar antes de procesar si ya ha sido procesado.
:::

<IdempotenceDemo />

---

## 6. Guía práctica: Enfoque de elegir una cola de mensajes

### 6.1 Comparativa de las cuatro principales colas de mensajes

| Característica     | RabbitMQ          | Kafka             | RocketMQ              | Redis Stream    |
| ------------------ | ----------------- | ----------------- | --------------------- | --------------- |
| **Posicionamiento**| Cola de mensajes tradicional | Log distribuido | Cola de mensajes para e-commerce | Cola ligera     |
| **Rendimiento**    | ~10K/seg          | ~1M/seg           | ~100K/seg             | ~50K/seg        |
| **Latencia**       | Nivel de microsegundos | Nivel de milisegundos | Nivel de milisegundos | Nivel de milisegundos |
| **Fiabilidad**     | Alta (persistencia) | Alta (multi-réplica) | Alta (escritura síncrona en disco) | Media (AOF)     |
| **Reproducción de mensajes** | No soportado | Soportado | Soportado | Soportado |
| **Mensajes transaccionales** | Soportado (débil) | No soportado | Soportado (fuerte) | No soportado |
| **Mensajes retardados** | Soportado | No soportado | Soportado | No soportado |
| **Caso de uso**    | Aplicaciones empresariales tradicionales | Logs, Big Data | E-commerce, finanzas | Aplicaciones a pequeña escala |

::: tip 💡 Recomendaciones de selección
**Árbol de decisión:**

```
Elegir cola de mensajes:
│
├─ ¿Necesitas mensajes transaccionales (transacciones distribuidas)?
│  ├─ Sí → RocketMQ (primera opción) o RabbitMQ
│  └─ No → continuar
│
├─ ¿Necesitas procesar logs masivos / streaming en tiempo real?
│  ├─ Sí → Kafka (primera opción)
│  └─ No → continuar
│
├─ ¿QPS > 10K/seg?
│  ├─ Sí → RocketMQ o Kafka
│  └─ No → continuar
│
├─ ¿Necesitas enrutamiento complejo (como coincidencia de headers)?
│  ├─ Sí → RabbitMQ
│  └─ No → continuar
│
├─ ¿Ya tienes infraestructura Redis?
│  ├─ Sí → Redis Stream (arranque rápido)
│  └─ No → RabbitMQ (funcionalidad completa, curva de aprendizaje moderada)
```

:::

---

## 7. Resumen: principios de diseño de colas de mensajes

### 7.1 Repaso de principios fundamentales

| Principio         | Significado                         | Puntos clave de práctica                                   |
| ----------------- | ----------------------------------- | ---------------------------------------------------------- |
| **Desacoplamiento**| Los servicios no dependen directamente entre sí | Comunicación mediante cola de mensajes, los fallos del consumidor no afectan al productor |
| **Recorte de picos** | Suavizar las fluctuaciones de tráfico | La cola de mensajes actúa como embalse, los consumidores procesan a ritmo constante |
| **Fiabilidad**    | Los mensajes no se pierden          | ACK del productor + Persistencia del Broker + ACK del consumidor |
| **Idempotencia**  | El consumo duplicado no tiene impacto | Garantizar idempotencia a nivel de negocio (clave única, máquina de estados) |
| **Orden**         | Garantía de orden de mensajes       | Orden dentro de una partición única u ordenación en el lado del consumidor |

### 7.2 Lista de verificación de diseño

Antes de introducir una cola de mensajes, hazte las siguientes preguntas:

- [ ] ¿Realmente necesito una cola de mensajes? (para tareas asíncronas simples puede bastar un pool de hilos)
- [ ] ¿Es aceptable la pérdida de mensajes? (determina el nivel de fiabilidad necesario)
- [ ] ¿La duplicación de mensajes afectará al negocio? (determina la inversión en idempotencia)
- [ ] ¿Es importante el orden de los mensajes? (determina la estrategia de particionamiento)
- [ ] ¿Cuál es la capacidad de procesamiento del consumidor? (determina el tamaño de la cola y los umbrales de alerta)
- [ ] ¿Cómo manejar los fallos de consumo? (determina la estrategia de reintentos y mensajes muertos)

---

## 8. Glosario rápido de términos

| Término                | Nombre completo    | Explicación                                                                                       |
| ---------------------- | ------------------ | ------------------------------------------------------------------------------------------------- |
| **MQ**                 | Message Queue      | **Cola de Mensajes**. Middleware para comunicación asíncrona que desacopla productores y consumidores. |
| **Producer**           | -                  | **Productor**. La parte que envía mensajes.                                                       |
| **Consumer**           | -                  | **Consumidor**. La parte que recibe y procesa mensajes.                                           |
| **Broker**             | -                  | **Agente de Mensajes**. El programa servidor que almacena y reenvía mensajes.                     |
| **Topic**              | -                  | **Tema**. Clasificación lógica de mensajes (ej. "orders").                                        |
| **Queue**              | -                  | **Cola**. Contenedor físico que almacena mensajes.                                                |
| **Partition**          | -                  | **Partición**. Concepto de Kafka, un Topic puede dividirse en múltiples Partitions para aumentar la concurrencia. |
| **ACK**                | Acknowledgment     | **Confirmación**. Después de procesar un mensaje, el consumidor confirma al Broker.               |
| **Pub/Sub**            | Publish/Subscribe  | **Publicación/Suscripción**. Un patrón de mensajería donde un mensaje puede ser recibido por múltiples consumidores. |
| **P2P**                | Point-to-Point     | **Punto a Punto**. Un patrón de mensajería donde un mensaje solo puede ser recibido por un consumidor. |
| **DLQ**                | Dead Letter Queue  | **Cola de Mensajes Muertos**. Almacena mensajes que no se pueden consumir.                        |
| **Idempotence**        | -                  | **Idempotencia**. Ejecutar múltiples veces produce el mismo resultado.                            |
| **Throughput**         | -                  | **Rendimiento**. Cantidad de mensajes procesados por unidad de tiempo.                            |
| **Latency**            | -                  | **Latencia**. Diferencia de tiempo entre el envío y la recepción de un mensaje.                  |
| **Persistence**        | -                  | **Persistencia**. Los mensajes se escriben en disco, no solo en memoria.                          |
| **Replication**        | -                  | **Replicación**. Para alta disponibilidad, los mensajes se copian en múltiples nodos.             |
| **Transaction Message**| -                  | **Mensaje Transaccional**. Garantiza la consistencia entre la transacción local y el envío del mensaje. |
| **Backpressure**       | -                  | **Contrapresión**. Cuando el consumidor no puede seguir el ritmo, notifica al productor que reduzca la velocidad. |
| **Offset**             | -                  | **Desplazamiento**. La posición de consumo del consumidor dentro de una partición.                |
| **Rebalance**          | -                  | **Reequilibrio**. Cuando cambian los miembros de un grupo de consumidores, se reasignan las particiones. |
