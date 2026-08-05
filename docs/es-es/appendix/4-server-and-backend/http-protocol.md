# Principios del protocolo HTTP: lenguaje de comunicación entre frontend y backend

::: tip 🎯 Pregunta clave
**¿Cómo funciona HTTP?** Es como preguntar: ¿cómo dialogan dos personas? Se necesita acordar un idioma, una gramática y unas reglas de conversación. HTTP es el "protocolo de diálogo" entre frontend y backend.
:::

---

## 0. La esencia de HTTP

**HTTP** (HyperText Transfer Protocol) es el protocolo fundamental de comunicación entre frontend y backend.

### 0.1 Una analogía con el diálogo

| Elemento del diálogo | Equivalente HTTP | Descripción |
| :--- | :--- | :--- |
| Idioma | Protocolo HTTP | Un lenguaje que ambas partes entienden |
| Gramática | Formato de petición/respuesta | Cómo "hablar" |
| Flujo | Modelo petición-respuesta | Uno pregunta, el otro responde |
| Finalización | Colgar | Cierre de conexión TCP |

---

## 1. Historia de HTTP

HTTP ha experimentado múltiples actualizaciones importantes desde su nacimiento en 1991.

<HttpProtocolDemo />

### 1.1 Comparación de versiones

| Versión | Año | Mejora principal | Característica típica |
| :--- | :--- | :--- | :--- |
| **HTTP/0.9** | 1991 | Solo soporta GET | Texto plano, solo petición, sin cabeceras de respuesta |
| **HTTP/1.0** | 1996 | Añade POST/HEAD | Una conexión TCP por petición |
| **HTTP/1.1** | 1997 | Conexión persistente | Keep-Alive, múltiples peticiones por conexión |
| **HTTP/2** | 2015 | Multiplexación | Tramas binarias, compresión de cabeceras |
| **HTTP/3** | 2022 | Basado en QUIC | Transporte UDP, resuelve el bloqueo de cabeza de línea |

::: tip 💡 ¿Por qué necesitamos HTTP/2?
Aunque HTTP/1.1 soporta conexiones persistentes, las peticiones deben enviarse en serie (la respuesta de la petición anterior debe llegar antes de enviar la siguiente). HTTP/2 resuelve este problema mediante multiplexación, permitiendo enviar múltiples peticiones simultáneamente.
:::

---

## 2. Estructura de una petición HTTP

### 2.1 Línea de petición

```http
GET /api/users/123 HTTP/1.1
```

Contiene tres partes:
- **Método**: GET, POST, PUT, DELETE, etc.
- **URL**: la ruta del recurso solicitado
- **Versión**: HTTP/1.1 o HTTP/2

### 2.2 Cabeceras de petición

```http
Host: api.example.com
User-Agent: Mozilla/5.0
Accept: application/json
Authorization: Bearer xxx
Content-Type: application/json
Content-Length: 45
```

Cabeceras de petición comunes:
| Cabecera | Descripción | Ejemplo |
| :--- | :--- | :--- |
| **Host** | Dominio del servidor | `api.example.com` |
| **User-Agent** | Información del cliente | `Mozilla/5.0` |
| **Accept** | Tipo de respuesta aceptado | `application/json` |
| **Authorization** | Información de autenticación | `Bearer token` |
| **Content-Type** | Tipo del cuerpo de la petición | `application/json` |

### 2.3 Cuerpo de la petición

```json
{
  "name": "Zhang San",
  "email": "zhangsan@example.com"
}
```

Solo los métodos POST, PUT, PATCH tienen cuerpo de petición.

---

## 3. Estructura de una respuesta HTTP

### 3.1 Línea de estado

```http
HTTP/1.1 200 OK
```

Contiene tres partes:
- **Versión**: HTTP/1.1
- **Código de estado**: 200, 404, 500, etc.
- **Texto de estado**: OK, Not Found, etc.

### 3.2 Cabeceras de respuesta

```http
Content-Type: application/json
Content-Length: 156
Cache-Control: max-age=3600
Set-Cookie: session=xxx; HttpOnly
```

Cabeceras de respuesta comunes:
| Cabecera | Descripción | Ejemplo |
| :--- | :--- | :--- |
| **Content-Type** | Tipo del cuerpo de la respuesta | `application/json` |
| **Content-Length** | Tamaño del cuerpo de la respuesta | `156` |
| **Cache-Control** | Estrategia de caché | `max-age=3600` |
| **Set-Cookie** | Establecer Cookie | `session=xxx` |

### 3.3 Cuerpo de la respuesta

```json
{
  "code": 0,
  "data": {
    "id": 123,
    "name": "Zhang San"
  }
}
```

---

## 4. Métodos HTTP en detalle

| Método | Propósito | Cuerpo | Idempotencia | Seguridad |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | Obtener recurso | No | Sí | Sí |
| **POST** | Crear recurso | Sí | No | No |
| **PUT** | Actualización completa | Sí | Sí | No |
| **PATCH** | Actualización parcial | Sí | No | No |
| **DELETE** | Eliminar recurso | No | Sí | No |
| **HEAD** | Obtener cabeceras | No | Sí | Sí |
| **OPTIONS** | Consultar métodos soportados | No | Sí | Sí |

### 4.1 GET vs POST

| Característica | GET | POST |
| :--- | :--- | :--- |
| **Ubicación de parámetros** | Query params en URL | Cuerpo de la petición |
| **Caché** | Cacheable | No cacheable por defecto |
| **Marcador** | Se puede añadir a marcadores | No |
| **Historial** | Se guarda en el historial del navegador | No se guarda |
| **Longitud de datos** | Limitada (longitud de URL) | Sin límite |
| **Seguridad** | Parámetros visibles en la URL | Parámetros en el cuerpo |

::: tip 💡 ¿Cuándo usar GET/POST?
- **GET**: consultar, obtener datos
- **POST**: crear, enviar datos
- **PUT**: actualización completa (reemplazar todo el recurso)
- **PATCH**: actualización parcial (modificar solo campos específicos)
- **DELETE**: eliminar recurso
:::

---

## 5. Códigos de estado HTTP

### 5.1 Clasificación de códigos de estado

| Clase | Descripción | Códigos típicos |
| :--- | :--- | :--- |
| **2xx** | Éxito | 200 OK, 201 Created, 204 No Content |
| **3xx** | Redirección | 301 Permanente, 302 Temporal, 304 No modificado |
| **4xx** | Error del cliente | 400 Parámetros incorrectos, 401 No autenticado, 404 No encontrado |
| **5xx** | Error del servidor | 500 Error interno, 503 No disponible |

### 5.2 Códigos de estado comunes

| Código | Descripción | Caso de uso |
| :--- | :--- | :--- |
| **200 OK** | Petición exitosa | GET, PUT exitosos |
| **201 Created** | Creación exitosa | POST para crear recurso exitoso |
| **204 No Content** | Sin contenido | DELETE exitoso |
| **301 Moved Permanently** | Redirección permanente | URL cambiada permanentemente |
| **302 Found** | Redirección temporal | URL cambiada temporalmente |
| **304 Not Modified** | No modificado | Caché válida |
| **400 Bad Request** | Parámetros incorrectos | Formato de parámetros de petición incorrecto |
| **401 Unauthorized** | No autenticado | Requiere inicio de sesión |
| **403 Forbidden** | Sin permisos | Autenticado pero sin permisos suficientes |
| **404 Not Found** | No existe | Recurso no existe |
| **500 Internal Server Error** | Error interno | Excepción del servidor |
| **503 Service Unavailable** | No disponible | Servidor en mantenimiento o sobrecargado |

---

## 6. HTTPS: HTTP seguro

### 6.1 HTTP vs HTTPS

| Característica | HTTP | HTTPS |
| :--- | :--- | :--- |
| **Protocolo** | TCP | TCP + SSL/TLS |
| **Puerto** | 80 | 443 |
| **Datos** | Transmisión en texto plano | Transmisión cifrada |
| **Certificado** | No necesario | Requiere certificado SSL |
| **Rendimiento** | Ligeramente más rápido | Ligeramente más lento (overhead del handshake) |
| **SEO** | Sin impacto | Los motores de búsqueda lo priorizan |

### 6.2 Flujo de trabajo de HTTPS

1. **Client Hello**: el cliente envía las suites de cifrado soportadas
2. **Server Hello**: el servidor devuelve el certificado y la suite de cifrado seleccionada
3. **Verificación del certificado**: el cliente verifica la validez del certificado del servidor
4. **Intercambio de claves**: se usa cifrado asimétrico para intercambiar la clave de sesión
5. **Comunicación cifrada**: se usa la clave de sesión para comunicación con cifrado simétrico

::: tip 💡 Ventajas de HTTPS
- **Anti-escuchas**: datos cifrados, terceros no pueden leerlos
- **Anti-manipulación**: verificación de integridad de datos
- **Anti-suplantación**: el certificado SSL verifica la identidad del servidor
:::

---

## 7. Mecanismo de caché HTTP

### 7.1 Cabeceras de caché

| Cabecera | Descripción | Ejemplo |
| :--- | :--- | :--- |
| **Cache-Control** | Estrategia de caché | `max-age=3600` |
| **ETag** | Versión del recurso | `"33a64df551425fcc"` |
| **Last-Modified** | Última modificación | `Wed, 21 Oct 2015 07:28:00 GMT` |

### 7.2 Estrategias de caché

**Caché fuerte**:
```http
Cache-Control: max-age=3600
```
Durante 3600 segundos, el navegador usa directamente la caché sin enviar petición.

**Caché negociada**:
```http
ETag: "33a64df551425fcc"
```
El navegador envía `If-None-Match`, el servidor devuelve 304 (no modificado) o 200 (modificado).

---

## 8. Preguntas frecuentes

### 8.1 La diferencia esencial entre GET y POST

**Mito**: la diferencia entre GET y POST es solo la ubicación de los parámetros.

**Verdad**:
- GET es idempotente, múltiples peticiones producen el mismo resultado
- POST no es idempotente, múltiples peticiones pueden crear múltiples recursos
- GET puede cachearse, POST no por defecto
- GET puede guardarse en marcadores, POST no

### 8.2 Bloqueo de cabeza de línea en HTTP/1.1

**Problema**: aunque HTTP/1.1 soporta conexiones persistentes, las peticiones deben enviarse en serie. Si la respuesta de una petición anterior es lenta, todas las peticiones posteriores deben esperar.

**Soluciones**:
- Multiplexación de HTTP/2
- Domain sharding (múltiples dominios para establecer múltiples conexiones)
- Pool de conexiones (limitar la concurrencia)

### 8.3 Ventajas de HTTP/2

| Característica | HTTP/1.1 | HTTP/2 |
| :--- | :--- | :--- |
| **Formato de transmisión** | Texto | Tramas binarias |
| **Multiplexación** | No soportada | Soportada |
| **Compresión de cabeceras** | No | Algoritmo HPACK |
| **Server push** | No soportado | Soportado |

---

## Tabla rápida de términos

| Término | Inglés | Explicación |
| :--- | :--- | :--- |
| **HTTP** | HyperText Transfer Protocol | Protocolo de transferencia de hipertexto |
| **HTTPS** | HTTP Secure | HTTP + SSL/TLS |
| **TCP** | Transmission Control Protocol | Protocolo de control de transmisión |
| **SSL/TLS** | Secure Sockets Layer | Capa de sockets seguros |
| **Idempotencia** | Idempotent | Múltiples peticiones producen el mismo resultado |
| **Conexión persistente** | Keep-Alive | Una conexión TCP para múltiples peticiones |
| **Multiplexación** | Multiplexing | Enviar múltiples peticiones simultáneamente |
| **Bloqueo de cabeza de línea** | Head-of-Line Blocking | Una petición anterior bloquea las posteriores |