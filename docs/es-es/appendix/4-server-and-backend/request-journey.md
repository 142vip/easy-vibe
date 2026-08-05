# Panorama del viaje de una petición

::: tip Prólogo
**Cuando escribes una URL en el navegador y pulsas Enter, ¿qué ocurre exactamente hasta que se muestra la página?** Esta pregunta es un clásico de las entrevistas y, sobre todo, la llave para entender la arquitectura web completa. Comprender esta cadena te permitirá entender cómo colaboran el frontend, el backend, la red y la base de datos.
:::

**¿Qué aprenderás en este artículo?**

Al terminar este capítulo, habrás aprendido:

- **Visión de cadena completa**: entenderás el proceso completo de una petición HTTP desde que se envía hasta que regresa
- **Conocimiento de responsabilidades por capa**: qué hacen DNS, TCP, balanceo de carga, servidor web, servidor de aplicaciones y base de datos
- **Capacidad de localización de problemas**: cuando una petición es lenta o falla, sabrás por qué capa empezar a investigar
- **Ideas de optimización de rendimiento**: cada capa tiene margen de optimización, sabrás dónde están los puntos de mejora

| Capítulo | Contenido | Conceptos clave |
|-----|------|---------|
| **Capítulo 1** | El navegador inicia la petición | Resolución DNS, conexión TCP, petición HTTP |
| **Capítulo 2** | Transmisión por la red | Enrutamiento, CDN, balanceo de carga |
| **Capítulo 3** | Procesamiento en el servidor | Servidor web, lógica de aplicación, consulta a base de datos |
| **Capítulo 4** | Retorno de la respuesta | Serialización, compresión, renderizado |
| **Capítulo 5** | Optimización de cadena completa | Caché, reutilización de conexiones, procesamiento asíncrono |

---

## 0. Panorama general: qué experimenta una petición

Usemos una analogía para entenderlo: haces un pedido de un libro por Internet. Este proceso es sorprendentemente similar a una petición HTTP.

| Fase de la petición | Analogía de comprar un libro | Correspondencia técnica |
|---------|---------|---------|
| Introducir URL | Dices "Quiero ir a tal librería" | El navegador analiza la URL |
| Resolución DNS | Consultas el mapa para encontrar la dirección de la librería | Nombre de dominio → Dirección IP |
| Conexión TCP | Llegas a la puerta de la librería y entras | Three-way handshake para establecer conexión |
| Enviar petición | Le dices al dependiente "Quiero el libro xxx" | Mensaje de petición HTTP |
| Procesamiento del servidor | El dependiente va al almacén, busca el libro, comprueba stock, calcula precio | Lógica de aplicación + consulta a BD |
| Devolver respuesta | El dependiente te entrega el libro | Mensaje de respuesta HTTP |
| Renderizado del navegador | Abres el libro y empiezas a leer | Parseo y renderizado de HTML/CSS/JS |

<RequestJourneyFlow />

---

## 1. El navegador inicia la petición

### 1.1 Análisis de la URL

Cuando introduces `https://api.example.com/books?id=123`, el navegador la descompone en varias partes:

| Parte | Valor | Significado |
|-----|-----|------|
| Protocolo | `https` | Comunicación cifrada |
| Nombre de dominio | `api.example.com` | El "nombre" del servidor |
| Ruta | `/books` | El recurso a acceder |
| Parámetros de consulta | `id=123` | Condiciones adicionales |

### 1.2 Resolución DNS: nombre de dominio → dirección IP

El ordenador no entiende nombres de dominio, solo direcciones IP (como `93.184.216.34`). DNS es la "guía telefónica" de Internet.

```
Caché del navegador → Caché del sistema → Caché del router → DNS del ISP → Servidor raíz de DNS
     ↓ Si hay acierto se usa directamente, si no se sigue buscando
```

::: tip El significado de la caché DNS
Si cada petición tuviera que consultar desde el servidor raíz, Internet colapsaría bajo el peso de las consultas DNS. Por eso cada nivel tiene caché; la mayoría de las peticiones se resuelven en el nivel del navegador o del sistema.
:::

### 1.3 Three-way handshake TCP

Una vez encontrada la dirección IP, el navegador necesita "establecer conexión" con el servidor. TCP usa el three-way handshake para asegurar que ambas partes están listas:

```
Cliente → Servidor: Hola, quiero conectar (SYN)
Servidor → Cliente: De acuerdo, estoy listo (SYN + ACK)
Cliente → Servidor: Recibido, comenzamos comunicación (ACK)
```

Si es HTTPS, se necesita un handshake TLS adicional para negociar el método de cifrado.

### 1.4 Enviar la petición HTTP

Una vez establecida la conexión, el navegador envía el mensaje de petición HTTP:

```http
GET /books?id=123 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbGci...
User-Agent: Chrome/120.0
```

| Componente | Contenido |
|---------|------|
| Línea de petición | Método (GET) + ruta + versión del protocolo |
| Cabeceras de petición | Metainformación: autenticación, formato de datos esperado, etc. |
| Cuerpo de petición | Solo en peticiones POST/PUT, contiene los datos a enviar |

---

## 2. Transmisión por la red: la petición en camino

### 2.1 Enrutamiento

Tras salir de tu ordenador, la petición pasa por múltiples routers, como un paquete que pasa por varios centros de distribución:

```
Tu ordenador → Router doméstico → Red del operador → Red troncal → Centro de datos destino
```

Cada router decide el "siguiente salto" según la dirección IP. Puedes usar el comando `traceroute` para ver por qué nodos pasa la petición.

### 2.2 Aceleración CDN

Si el sitio web de destino usa CDN (Content Delivery Network), la petición puede no necesitar llegar al servidor de origen:

| Escenario | Recorrido |
|-----|------|
| Petición de recursos estáticos (imágenes, CSS, JS) | El nodo edge del CDN responde directamente |
| Petición de datos dinámicos (API) | Atraviesa el CDN, llega al servidor de origen |

La esencia del CDN es "poner el contenido por adelantado en el lugar más cercano al usuario".

### 2.3 Balanceo de carga

Los sitios web grandes no tienen un solo servidor. El balanceador de carga distribuye las peticiones entre múltiples servidores:

```
Petición del usuario → Balanceador de carga → Servidor A (30% del tráfico)
                                            → Servidor B (30% del tráfico)
                                            → Servidor C (40% del tráfico)
```

Estrategias comunes de distribución:

| Estrategia | Principio | Escenario aplicable |
|-----|------|---------|
| Round-robin | Asignación secuencial | Servidores con la misma configuración |
| Round-robin ponderado | Asignación por peso | Servidores con diferente configuración |
| Hash de IP | El mismo usuario siempre al mismo servidor | Necesidad de persistencia de sesión |
| Menos conexiones | Al servidor con menos conexiones activas | Tiempos de procesamiento muy variables |

---

## 3. Procesamiento en el servidor: qué ocurre en la cocina

Cuando la petición llega al servidor, pasa por múltiples capas de procesamiento.

### 3.1 Servidor web (Nginx / Apache)

El primero en recibir la petición suele ser el servidor web, encargado de:

| Responsabilidad | Descripción |
|-----|------|
| Servicio de archivos estáticos | Devolver directamente HTML, CSS, JS, imágenes |
| Proxy inverso | Reenviar peticiones de API a la aplicación backend |
| Terminación SSL | Gestionar el cifrado/descifrado HTTPS |
| Filtrado de peticiones | Bloquear peticiones maliciosas, limitación de tasa |

### 3.2 Procesamiento en el servidor de aplicaciones

El servidor web reenvía la petición al servidor de aplicaciones (Node.js, Spring, Django, etc.). El flujo de procesamiento:

```
Entrada de petición → Cadena de middleware → Coincidencia de ruta → Controlador → Capa de servicio → Capa de acceso a datos
```

Lo que hace el **middleware**:

1. Parsear el cuerpo de la petición (JSON, datos de formulario)
2. Verificar identidad (comprobar Token)
3. Verificar permisos (¿puede este usuario acceder a este endpoint?)
4. Registrar logs (quién, cuándo, qué ha accedido)

### 3.3 Consulta a la base de datos

La mayoría de las peticiones terminan interactuando con la base de datos:

```
Código de aplicación: SELECT * FROM books WHERE id = 123
    ↓
Motor de base de datos: parsear SQL → optimizar consulta → plan de ejecución → leer datos
    ↓
Resultado devuelto: { id: 123, title: "xxx", price: 59.9 }
```

::: tip La base de datos es el cuello de botella más común
La transmisión por red suele ser de milisegundos, la lógica de aplicación también es rápida, pero una consulta a base de datos sin índice puede tardar varios segundos o incluso decenas de segundos. Por eso, una "petición lenta" probablemente se deba a una consulta lenta a la base de datos.
:::

---

## 4. Retorno de la respuesta: el camino de vuelta de los datos

### 4.1 Construcción de la respuesta HTTP

Tras el procesamiento, el servidor construye el mensaje de respuesta:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Encoding: gzip
Cache-Control: max-age=3600

{"id": 123, "title": "xxx", "price": 59.9}
```

| Componente | Contenido |
|---------|------|
| Línea de estado | Versión del protocolo + código de estado (200 éxito, 404 no encontrado, 500 error del servidor) |
| Cabeceras de respuesta | Formato de datos, estrategia de caché, método de compresión, etc. |
| Cuerpo de respuesta | El contenido real de los datos (JSON, HTML, etc.) |

### 4.2 Compresión de datos

El servidor normalmente comprime el cuerpo de la respuesta con gzip o brotli para reducir el volumen de transmisión:

| Algoritmo de compresión | Tasa de compresión | Velocidad |
|---------|--------|------|
| gzip | ~70% | Rápido |
| brotli | ~80% | Más lento pero comprime mejor |

Un JSON de 100KB puede quedar en solo 20-30KB tras la compresión.

### 4.3 Renderizado del navegador

Cuando el navegador recibe la respuesta:

1. **Parsear HTML** → Construir el árbol DOM
2. **Parsear CSS** → Construir el árbol de estilos
3. **Combinar** → Generar el árbol de renderizado
4. **Layout** → Calcular la posición y tamaño de cada elemento
5. **Pintar** → Dibujar los píxeles en la pantalla

<RequestTimeline />

---

## 5. Optimización de cadena completa: cada capa puede ser más rápida

### 5.1 Medidas de optimización por capa

| Capa | Medida de optimización | Efecto |
|-----|---------|------|
| DNS | Preresolución DNS, usar servicios DNS rápidos | Reducir el tiempo de consulta DNS |
| Red | CDN, HTTP/2, reutilización de conexiones | Reducir la latencia de transmisión |
| Servidor | Caché (Redis), procesamiento asíncrono | Reducir el tiempo de procesamiento |
| Base de datos | Índices, optimización de consultas, separación lectura/escritura | Reducir el tiempo de consulta |
| Frontend | Carga perezosa, división de código, compresión de recursos | Reducir el tiempo de renderizado |

### 5.2 Caché: la optimización más efectiva

La caché existe en cada capa de la cadena de petición:

```
Caché del navegador → Caché CDN → Caché del proxy inverso → Caché de aplicación (Redis) → Caché de base de datos
```

::: tip La esencia de la caché
Cambiar espacio por tiempo. Guardar los resultados ya calculados para usarlos directamente la próxima vez, sin necesidad de recalcular. Cada 10% de mejora en la tasa de acierto de caché puede multiplicar el rendimiento del sistema varias veces.
:::

### 5.3 Ideas para investigar cuando una petición falla

| Síntoma | Posible capa del problema | Método de investigación |
|-----|------------|---------|
| Sin respuesta alguna | DNS / Red | ping, nslookup |
| Timeout de conexión | Red / Servidor caído | telnet, curl |
| Respuesta 4xx | Error en la petición del cliente | Comprobar URL, parámetros, Token |
| Respuesta 5xx | Error interno del servidor | Revisar logs del servidor |
| Respuesta muy lenta | Base de datos / Lógica de aplicación | Revisar log de consultas lentas, herramientas APM |

---

## 6. Resumen

El viaje completo de una petición HTTP:

1. **Navegador**: analizar URL → consulta DNS → conexión TCP → enviar petición
2. **Red**: enrutamiento → decisión CDN → distribución por balanceo de carga
3. **Servidor**: recepción por servidor web → procesamiento por middleware → lógica de negocio → consulta a base de datos
4. **Retorno**: construir respuesta → comprimir → transmisión por red → renderizado del navegador

::: tip El valor de entender la cadena completa
Cuando puedas dibujar mentalmente la cadena completa de una petición, podrás localizar rápidamente en qué capa está el problema ante cualquier incidencia. Este es el salto clave de "desarrollador junior" a "capaz de investigar problemas de forma independiente".
:::

---

## Lecturas adicionales

- [Guía de referencia HTTP](https://developer.mozilla.org/es/docs/Web/HTTP) — Documentación HTTP de MDN
- [High Performance Browser Networking](https://hpbn.co/) — Optimización de rendimiento de red en navegadores
- [What happens when...](https://github.com/alex/what-happens-when) — La clásica explicación detallada de "qué ocurre cuando introduces una URL"