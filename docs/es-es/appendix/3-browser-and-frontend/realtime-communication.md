# Principios de comunicación en tiempo real: Polling/SSE/WebSocket

::: tip Lectura central
**¿Cómo logra el navegador la actualización de datos en tiempo real?**
El protocolo HTTP tradicional se basa en el modelo "petición-respuesta", donde el cliente debe iniciar activamente una petición para que el servidor pueda devolver datos. Si necesitamos implementar escenarios en tiempo real como salas de chat o cotizaciones bursátiles, este modelo enfrenta desafíos.

Este capítulo presentará las tres principales tecnologías frontend para la comunicación de datos en tiempo real: sondeo corto (Polling), eventos enviados por el servidor (SSE) y WebSocket full-duplex, explorando sus principios y escenarios de aplicación.
:::

---

## 1. Las limitaciones del HTTP tradicional

El protocolo HTTP fue diseñado originalmente para la recuperación de documentos, y tiene las características de ser **sin estado (Stateless)** y de **inicio unidireccional por el cliente**:
1. El cliente inicia una petición HTTP.
2. El servidor procesa la petición y devuelve una respuesta.
3. Una vez completada la tarea, la conexión suele liberar la petición lógica correspondiente (aunque HTTP/1.1 soporta reutilización de conexiones persistentes, el modelo petición-respuesta a nivel de negocio no ha cambiado).

En este modo, el servidor no puede notificar activamente al cliente que está esperando sobre los cambios de estado. Para obtener los datos más recientes, es necesario buscar otras soluciones arquitectónicas.

---

## 2. Sondeo corto (Polling)

La solución más directa es el **sondeo corto**. Es decir, el cliente utiliza un temporizador (como `setInterval`), y cada intervalo fijo de tiempo, envía automáticamente una petición HTTP al servidor para preguntar si han llegado nuevos datos.

<PollingDemo />

**Características técnicas y limitaciones:**
- **Ventaja**: El mecanismo de implementación es extremadamente simple, dependiendo completamente del protocolo HTTP estándar y la tecnología AJAX/Fetch.
- **Desventaja**: Puede generar una enorme sobrecarga de red y desperdicio de recursos. La mayor parte del tiempo, la respuesta del servidor puede ser "sin datos nuevos". Independientemente de si hay datos o no, cada petición debe llevar encabezados HTTP completos (Headers, Cookies, etc.), lo que en escenarios de alta concurrencia provoca que los recursos de red sean ocupados por un gran número de consultas sin sentido.

---

## 3. Eventos enviados por el servidor (Server-Sent Events)

Para reducir la sobrecarga de establecer conexiones HTTP con frecuencia, **Server-Sent Events (SSE)** proporciona una arquitectura de transmisión de datos unidireccional ligera.

SSE se basa en el protocolo HTTP. Después de que el cliente inicia una petición HTTP que contiene un encabezado especial (`Accept: text/event-stream`), el servidor mantiene la conexión TCP subyacente abierta al devolver la respuesta. Posteriormente, el servidor puede enviar continuamente datos en formato de texto al cliente a través de este canal persistente.

<SSEDemo />

**Características técnicas y limitaciones:**
- **Ventaja**: Conexión persistente, baja sobrecarga de red; el navegador soporta nativamente el mecanismo de reconexión automática ante desconexión; muy adecuado para la transmisión **unidireccional** de datos en flujo desde el servidor al cliente (por ejemplo, la salida carácter por carácter de texto de modelos de lenguaje grande, notificaciones de transacciones en tiempo real).
- **Desventaja**: El canal de comunicación es unidireccional. Si el cliente necesita enviar instrucciones de control o nuevos datos al servidor, debe establecer por separado una petición HTTP normal.

---

## 4. WebSocket: Protocolo de comunicación full-duplex

Cuando los escenarios de aplicación involucran interacción bidireccional de alta frecuencia (como juegos de acción multijugador en línea, edición colaborativa de documentos de precisión), necesitamos una tecnología que pueda reducir la sobrecarga de comunicación y lograr verdadera comunicación full-duplex — **WebSocket**.

WebSocket es un protocolo de comunicación de red independiente. Utiliza ingeniosamente el protocolo HTTP para completar la conexión inicial:
1. **Fase de handshake**: El cliente envía una petición HTTP especial, declarando que desea actualizar a un nuevo protocolo (con el encabezado `Upgrade: websocket`).
2. **Transformación de la conexión**: Si el servidor soporta y acepta el protocolo, responde con el código de estado `101 Switching Protocols`.
3. **Libertad total**: En este momento, la misión de la especificación HTTP termina, y la conexión TCP subyacente se transfiere al protocolo WebSocket. A partir de entonces, el cliente y el servidor disfrutan de derechos de comunicación full-duplex (Full-Duplex) iguales, pudiendo enviar y recibir tramas de datos en formato minimalista en cualquier momento.

<WebSocketDemo />

**Características técnicas y limitaciones:**
- **Ventanta**: Soporta comunicación bidireccional en tiempo real verdadera; la información de encabezado de las tramas de datos es extremadamente pequeña, con baja latencia de comunicación y alta eficiencia de rendimiento; soporta transmisión nativa de datos binarios (ArrayBuffer).
- **Desventaja**: La arquitectura y la complejidad de desarrollo son mayores; debido al mantenimiento de conexiones persistentes de larga duración, impone requisitos de ingeniería más estrictos sobre la arquitectura del servidor, las estrategias de balanceo de carga y el diseño de monitoreo de latidos.

---

## 5. Resumen: Comparación de selección tecnológica

| Dimensión | Sondeo corto (Polling) | Eventos enviados por el servidor (SSE) | WebSocket |
| :--- | :--- | :--- | :--- |
| **Dirección de comunicación** | El cliente sondea activamente para obtener datos (unidireccional) | El servidor envía datos activamente de forma continua (unidireccional) | El cliente y el servidor tienen derechos iguales de envío y recepción (full-duplex bidireccional) |
| **Protocolo subyacente** | HTTP estándar | HTTP estándar | Protocolo WebSocket independiente (basado en TCP) |
| **Sobrecarga de datos** | Extremadamente alta (incluye encabezados HTTP completos) | Relativamente baja | Extremadamente baja (encabezados de tramas de datos minimalistas) |
| **Escenarios de aplicación típicos** | Verificación periódica del estado de finalización de tareas asíncronas en segundo plano | Salida de flujo unidireccional de diálogo de modelos de lenguaje grande, notificaciones de noticias o del sistema | Señalización de audio/video en tiempo real, juegos multijugador en línea, pizarras y edición colaborativa |

En la ingeniería práctica, los desarrolladores deben basarse en los requisitos específicos del escenario de negocio respecto a la capacidad en tiempo real y la frecuencia de interacción bidireccional, equilibrando la complejidad de mantenimiento del sistema y la eficiencia de comunicación, para elegir la pila tecnológica más adecuada.
