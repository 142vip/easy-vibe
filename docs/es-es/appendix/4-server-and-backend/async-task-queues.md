# Principios de las colas de tareas asíncronas

::: tip Prólogo
**El usuario hace clic en "Exportar informe" y se queda mirando una animación de carga durante 30 segundos. ¿Es esto razonable?** Cuando una operación tarda varios segundos o incluso minutos en completarse, hacer esperar al usuario claramente no es una buena experiencia. Las colas de tareas asíncronas son el patrón arquitectónico clave para resolver este problema: enviar las operaciones costosas a procesarse en segundo plano y dar una respuesta inmediata al usuario.
:::

**¿Qué aprenderás en este artículo?**

Al terminar este capítulo, habrás aprendido:

- **Comparación síncrono vs asíncrono**: entenderás por qué ciertas operaciones deben ser asíncronas y la mejora en la experiencia de usuario que aporta
- **Modelo productor-consumidor**: dominarás la idea central y el flujo de trabajo del patrón Producer-Consumer
- **Mecanismo de pool de workers**: conocerás cómo las tareas se distribuyen a múltiples workers para procesamiento paralelo
- **Garantías de fiabilidad**: dominarás mecanismos como reintentos, idempotencia y colas de mensajes fallidos (DLQ)
- **Capacidad de selección tecnológica**: conocerás las características y casos de uso de los principales frameworks de tareas asíncronas

| Capítulo | Contenido | Conceptos clave |
|-----|------|---------|
| **Capítulo 1** | Por qué necesitas asincronía | Bloqueo síncrono vs no bloqueo asíncrono |
| **Capítulo 2** | Modelo productor-consumidor | Producer, Queue, Consumer |
| **Capítulo 3** | Pool de workers | Procesamiento concurrente, distribución de tareas |
| **Capítulo 4** | Garantías de fiabilidad | Estrategia de reintentos, idempotencia, DLQ |
| **Capítulo 5** | Selección de framework | Celery, Sidekiq, Bull, RQ |

---

## 0. Panorama general: Motivación para esperar al usuario

Imagina que vas a un restaurante a pedir comida. Un buen restaurante te da un número de ticket inmediatamente después de hacer el pedido, luego puedes buscar mesa, usar el móvil, y recoger la comida cuando esté lista. No te hacen quedarte de pie en la barra mirando al chef preparar todo el plato.

En las aplicaciones web hay muchas operaciones similares a "preparar un plato":

- **Enviar correos/SMS**: llamar a APIs de terceros, puede tardar varios segundos
- **Generar informes/PDFs**: gran cantidad de cálculos, puede tardar decenas de segundos
- **Procesamiento de imágenes/vídeos**: compresión, transcodificación, marcas de agua, puede tardar minutos
- **Sincronización de datos**: sincronización entre sistemas, tiempo indeterminado

::: tip La idea central de las tareas asíncronas
Extraer las operaciones costosas del flujo principal de "petición-respuesta" y procesarlas en colas en segundo plano. El usuario envía la petición y recibe inmediatamente una respuesta de "recibido, en proceso". Cuando termine, se le notifica el resultado mediante notificación, polling o WebSocket.
:::

---

## 1. Síncrono vs asíncrono: la historia de un pedido

Cuando un usuario realiza un pedido, el backend necesita hacer muchas cosas: descontar inventario, crear el registro del pedido, enviar correo de confirmación, actualizar el sistema de recomendaciones, registrar el log de auditoría...

En modo síncrono, estas operaciones se ejecutan secuencialmente y el usuario debe esperar a que todas terminen para ver el resultado. En modo asíncrono, solo se completan las operaciones esenciales (descontar inventario, crear pedido) y el resto se envía a la cola para procesamiento en segundo plano.

<AsyncTaskFlowDemo />

| Dimensión | Procesamiento síncrono | Procesamiento asíncrono |
|---------|---------|---------|
| Tiempo de espera del usuario | Tiempo total de todas las operaciones | Solo el tiempo de las operaciones esenciales |
| Rendimiento del sistema | Bajo (hilos bloqueados) | Alto (hilos liberados rápidamente) |
| Impacto de fallos | Un fallo no esencial provoca fallo total | Un fallo no esencial no afecta al flujo principal |
| Complejidad de implementación | Simple | Requiere infraestructura de colas adicional |
| Consistencia de datos | Consistencia fuerte | Consistencia eventual |

::: tip ¿Cuándo usar asincronía?
Tres criterios: **larga duración** (más de 1-2 segundos), **no esencial** (el fallo no debe afectar al flujo principal), **diferible** (no necesita resultado inmediato). Si cumple al menos dos, deberías considerar la asincronía.
:::

---

## 2. Modelo productor-consumidor: la "cadena de montaje" de tareas

El núcleo de las colas de tareas asíncronas es el clásico **patrón productor-consumidor (Producer-Consumer Pattern)**. Este patrón tiene tres roles:

- **Productor (Producer)**: quien genera las tareas, normalmente el servidor web al procesar peticiones de usuario
- **Cola (Queue)**: buffer que almacena las tareas pendientes, normalmente implementado con Redis, RabbitMQ, etc.
- **Consumidor (Consumer/Worker)**: proceso que extrae tareas de la cola y las ejecuta

<TaskWorkerDemo />

::: tip Los tres valores de la cola
1. **Desacoplamiento**: el productor no necesita saber quién procesa la tarea, el consumidor no necesita saber de dónde viene
2. **Aplanamiento de picos**: ante ráfagas de tráfico, las tareas se acumulan en la cola y los consumidores procesan a su ritmo
3. **Fiabilidad**: las tareas se persisten en la cola, no se pierden aunque el consumidor falle
:::

| Componente | Responsabilidad | Implementaciones comunes |
|------|------|---------|
| Middleware de mensajería | Almacenar y reenviar mensajes de tareas | Redis, RabbitMQ, Kafka |
| Serializador | Serializar/deserializar parámetros de tareas | JSON, MessagePack, Pickle |
| Planificador | Gestionar tareas programadas y diferidas | Cron, APScheduler, node-cron |
| Almacén de resultados | Guardar resultados de ejecución de tareas | Redis, base de datos, S3 |

---

## 3. Garantías de fiabilidad: las tareas no pueden "perderse" ni "duplicarse"

En un entorno distribuido, problemas como latencia de red, reinicios de servicio o recursos insuficientes pueden ocurrir en cualquier momento. El sistema de tareas asíncronas debe tener mecanismos completos de garantía de fiabilidad.

Los dos problemas más críticos: **pérdida de tareas** (el consumidor falla a mitad del procesamiento) y **ejecución duplicada** (la tarea se entrega dos veces).

<TaskRetryDemo />

::: tip Las tres claves de la fiabilidad
1. **Mecanismo ACK**: el consumidor envía confirmación (ACK) solo después de procesar la tarea; las tareas no confirmadas se reentregan
2. **Estrategia de reintentos**: si una tarea falla, se reintenta según una estrategia; el backoff exponencial + jitter es la mejor práctica
3. **Diseño de idempotencia**: ejecutar la misma tarea varias veces produce el mismo efecto que ejecutarla una vez, se implementa mediante desduplicación por ID único
:::

| Mecanismo | Problema que resuelve | Implementación |
|------|-----------|---------|
| ACK | Pérdida de tareas | Confirmación manual tras procesar; si expira sin confirmar, se reentrega |
| Cola de mensajes fallidos (DLQ) | "Mensajes tóxicos" que fallan repetidamente | Tras superar el límite de reintentos, se mueven a DLQ para intervención manual |
| Idempotencia | Ejecución duplicada | Desduplicación por ID único de tarea, restricción unique en BD |
| Cola con prioridad | Inanición de tareas | Las tareas de alta prioridad se procesan primero, evitando bloqueos por tareas de baja prioridad |
| Control de timeout | Tareas bloqueadas | Establecer tiempo máximo de ejecución; si se supera, se termina automáticamente y se reintenta |

---

## 4. Selección de framework: elige la herramienta adecuada

Cada ecosistema de lenguaje tiene diferentes frameworks de tareas asíncronas, con distintos enfoques en funcionalidad, rendimiento y facilidad de uso. Al elegir un framework, primero considera tu stack tecnológico y luego decide según la escala y necesidades del proyecto.

<AsyncComparisonDemo />

::: tip Recomendaciones de selección
- **Proyectos Python**: medianos/grandes usa Celery, pequeños usa RQ
- **Proyectos Node.js**: primera opción BullMQ (sucesor de Bull)
- **Proyectos Ruby**: Sidekiq es prácticamente la única opción
- **Proyectos Java**: ecosistema Spring usa Spring Batch, alto rendimiento usa Kafka Streams
- **Proyectos Go**: Asynq (basado en Redis) o Machinery

Si tu proyecto ya usa Redis, las soluciones basadas en Redis (Celery+Redis, BullMQ, Sidekiq) son la forma más sencilla de empezar.
:::

---

## Resumen

Las colas de tareas asíncronas son una infraestructura indispensable en la arquitectura backend. Permiten que el sistema maneje operaciones costosas de forma elegante, mejorando la experiencia de usuario y aumentando el rendimiento del sistema.

Puntos clave de este capítulo:

1. **Criterios para la asincronía**: larga duración, no esencial, diferible; si cumple dos, debe ser asíncrono
2. **Modelo productor-consumidor**: Producer → Queue → Consumer, tres roles desacoplados que colaboran
3. **Pool de workers**: múltiples workers consumiendo en paralelo para aumentar la capacidad de procesamiento
4. **Garantías de fiabilidad**: ACK + estrategia de reintentos + idempotencia, los tres son indispensables
5. **Selección de framework**: elige según el stack tecnológico y la escala del proyecto, Redis es el middleware de mensajería más común

## Lecturas adicionales

- [Documentación oficial de Celery](https://docs.celeryq.dev/) - La cola de tareas distribuidas más popular de Python
- [Documentación de BullMQ](https://docs.bullmq.io/) - Cola de tareas de alto rendimiento para Node.js
- [Wiki de Sidekiq](https://github.com/sidekiq/sidekiq/wiki) - Referencia en procesamiento de tareas del ecosistema Ruby
- [Tutoriales de RabbitMQ](https://www.rabbitmq.com/tutorials) - Tutoriales introductorios de middleware de mensajería
- [Buenas prácticas de tareas asíncronas](https://brandur.org/job-drain) - Patrones de diseño y trampas de las colas de tareas