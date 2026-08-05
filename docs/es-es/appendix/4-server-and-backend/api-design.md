# Principios de diseño de API: protocolo de comunicación entre frontend y backend

::: tip 🎯 Pregunta central
**¿Cómo pueden comunicarse eficientemente el frontend y el backend?** Es como preguntar: ¿cómo diseñar el menú de un restaurante para que los clientes lo entiendan de un vistazo? ¿Cómo anotan los camareros los pedidos sin errores? ¿Cómo se sirven los platos de forma estandarizada para que los clientes queden satisfechos? El diseño de API resuelve precisamente el problema de las "reglas de diálogo".
:::

---

## 0. Primero, preguntémonos: has vivido alguna de estas pesadillas

**Escenario 1: Nombres de endpoints arbitrarios**

```
GET /getUserData
GET /fetchUserInfo
GET /queryUserById
GET /users/query
```

Cuatro endpoints, misma funcionalidad, estilos de nomenclatura completamente diferentes. Un recién llegado se queda perplejo: ¿cuál debo usar?

**Escenario 2: Manejo de errores inconsistente**

```json
// Algunos devuelven código de estado HTTP
HTTP/1.1 404 Not Found

// Otros devuelven 200 + código
HTTP/1.1 200 OK
{ "code": 404, "message": "Usuario no encontrado" }

// Otros lanzan una excepción directamente
HTTP/1.1 200 OK
{ "error": "Ha ocurrido un error" }
```

El frontend no sabe cómo determinar si la solicitud fue exitosa.

**Escenario 3: Estructuras de respuesta dispares**

```json
// Endpoint A
{ "data": { ... } }

// Endpoint B
{ "result": { ... } }

// Endpoint C
{ "content": { ... } }
```

Cada endpoint devuelve un formato diferente, obligando al frontend a manejar cada uno por separado.

---

**Un buen diseño de API es como un sistema de pedidos de un restaurante**: menú claro, proceso estandarizado, mensajes de error informativos.

---

## 1. Introducción a API

**API** (Application Programming Interface, Interfaz de Programación de Aplicaciones) es el "contrato de diálogo" entre programas.

### 1.1 Analogía con un restaurante

| Rol en el restaurante | Concepto correspondiente | Descripción |
| :--- | :--- | :--- |
| Menú | Documentación de la API | Te indica qué "platos" puedes pedir |
| Camarero | Protocolo HTTP | La "forma de diálogo" estandarizada |
| Cocina | Servidor | Procesa las solicitudes según el "pedido" |
| Servir el plato | Respuesta | Devuelve el resultado al "cliente" |

### 1.2 Una solicitud API completa

👇 **Pruébalo tú mismo**: haz clic en el botón de abajo para observar el flujo completo de solicitud-respuesta de una API:

<ApiRequestDemo />

---

## 2. Filosofía de diseño de API: RPC / REST / GraphQL / gRPC

Antes de adentrarnos en el diseño RESTful, conozcamos los cuatro estilos principales de diseño de API:

<ApiStyleCompare />

### 2.1 REST vs RESTful: Selección de diferencia

Mucha gente confunde estos dos conceptos:

| Concepto | Significado | Descripción |
| :--- | :--- | :--- |
| **REST** | Un estilo arquitectónico | Una filosofía de diseño propuesta por Roy Fielding, compuesta por un conjunto de restricciones |
| **RESTful** | Conforme al estilo REST | Adjetivo que indica que el diseño de la API sigue los principios REST |

**Analogía**:
- REST es como el "minimalismo": una filosofía de diseño
- Una API RESTful es como "una habitación de estilo minimalista": una implementación concreta de esa filosofía

**Las seis restricciones de REST**:

| Restricción | Descripción |
| :--- | :--- |
| **Separación cliente-servidor** | Frontend y backend se desarrollan de forma independiente, interfaces desacopladas |
| **Sin estado (Stateless)** | Cada solicitud contiene toda la información necesaria, el servidor no guarda estado de sesión |
| **Cacheable** | Las respuestas deben indicar si son cacheables, para mejorar el rendimiento |
| **Interfaz uniforme** | Uso de métodos HTTP y códigos de estado estándar |
| **Sistema en capas** | El cliente no necesita saber a qué capa del servidor se está conectando |
| **Código bajo demanda** (opcional) | El servidor puede extender la funcionalidad del cliente |

::: tip 💡 ¿Por qué REST es el más utilizado?
1. **Curva de aprendizaje baja**: el protocolo HTTP en sí mismo refleja los principios REST
2. **Ecosistema maduro**: herramientas, frameworks y documentación abundantes
3. **Gran interoperabilidad**: cualquier lenguaje y plataforma puede consumirlo
4. **Fácil de cachear**: las solicitudes GET son naturalmente cacheables, amigables con CDN
:::

---

## 3. Diseño RESTful: que las URL hablen por sí solas

**REST** (Representational State Transfer) es un estilo arquitectónico cuya idea central es:

- Abstraer las entidades de la red como "recursos" (Resource)
- Usar URLs para identificar recursos
- Usar métodos HTTP para operar sobre recursos

### 3.1 Analogía con un almacén

| Concepto del almacén | Equivalente REST | Ejemplo |
| :--- | :--- | :--- |
| Dirección de estantería | URL | `/users`, `/orders` |
| Forma de operar | Método HTTP | GET (consultar), POST (ingresar) |
| Mercancía | Recurso | Datos de usuario, datos de pedido |

**Principio clave**: la URL es un sustantivo, no un verbo.

### 3.2 Reglas de diseño de URL

| Regla | Ejemplo incorrecto | Ejemplo correcto | Descripción |
| :--- | :--- | :--- | :--- |
| Usar sustantivos, no verbos | `/getUsers` | `/users` | La URL representa el recurso, el método HTTP la operación |
| Usar plural | `/user` | `/users` | Estilo uniforme en plural |
| Minúsculas + guiones | `/UserProfiles` | `/user-profiles` | Las URLs distinguen mayúsculas de minúsculas |
| Evitar anidamiento excesivo | `/a/b/c/d/e` | `/a/b/c` | Máximo 3 niveles |
| Filtros con query params | `/products/phone/5000` | `/products?cat=phone` | Usar parámetros `?` para filtros |

::: tip 💡 Distinción de mayúsculas/minúsculas en URLs
Usar uniformemente minúsculas + guiones (-) es la práctica más segura, evitando confusiones de mayúsculas/minúsculas e inconsistencias con guiones bajos.
:::

### 3.3 Selección de métodos HTTP

| Método | Propósito | Idempotencia | Seguridad | Caso típico |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | Obtener recurso | Sí | Sí | Consultar lista, ver detalle |
| **POST** | Crear recurso | No | No | Crear usuario, enviar pedido |
| **PUT** | Actualización completa | Sí | No | Reemplazar perfil completo |
| **PATCH** | Actualización parcial | No | No | Modificar solo el apodo |
| **DELETE** | Eliminar recurso | Sí | No | Eliminar usuario, cancelar pedido |

::: tip 💡 ¿Qué es la idempotencia?
**Idempotencia**: ejecutar la misma operación varias veces produce el mismo resultado.

- **Operaciones idempotentes** (GET/PUT/DELETE): hacer clic 10 veces da el mismo resultado que 1 vez
- **Operaciones no idempotentes** (POST): hacer clic 10 veces podría crear 10 pedidos

**Solución**: usar un ID único para validar las operaciones POST y evitar procesamiento duplicado.
:::

---

## 4. Códigos de estado: que los errores "hablen"

Los códigos de estado HTTP son la forma estándar en que el servidor le dice al cliente "qué ha pasado".

### 4.1 Clasificación de códigos de estado

| Clase | Significado | Códigos típicos |
| :--- | :--- | :--- |
| **2xx** | Éxito | 200 OK, 201 Created, 204 No Content |
| **3xx** | Redirección | 301 Movido permanentemente, 304 No modificado |
| **4xx** | Error del cliente | 400 Parámetro inválido, 401 No autenticado, 404 No encontrado |
| **5xx** | Error del servidor | 500 Error interno, 503 Servicio no disponible |

### 4.2 Demostración de códigos de estado comunes

👇 **Pruébalo tú mismo**: haz clic en el botón de abajo para entender el significado de los códigos de estado más comunes:

<StatusCodeDemo />

---

## 5. Manejo de errores: "rechazar" con elegancia

Un buen manejo de errores permite al cliente "saber qué pasa con solo ver el código de estado", en lugar de tener que adivinarlo.

### 5.1 Guía para evitar trampas en el manejo de errores

**Trampa 1: Devolver 200 para todos los errores**

```json
// ❌ Mala práctica
HTTP/1.1 200 OK
{ "error": "Ha ocurrido un error" }
```

Problema: la capa de caché almacenará esta respuesta "exitosa" y el sistema de monitoreo no detectará el problema.

**Trampa 2: Mensajes de error demasiado genéricos**

```json
// ❌ Mala práctica
HTTP/1.1 400 Bad Request
{ "message": "Error de parámetro" }
```

Problema: el cliente no sabe qué parámetro falló ni por qué.

**Trampa 3: Exponer información sensible**

```json
// ❌ Práctica peligrosa
HTTP/1.1 500 Internal Server Error
{ "stack": "at UserService.login...", "sql": "SELECT * FROM..." }
```

Peligro: expone la estructura del código y las consultas a la base de datos, información que los atacantes pueden explotar.

### 5.2 Demostración de manejo de errores correcto

👇 **Pruébalo tú mismo**: compara un diseño de respuesta de error "bueno" con uno "malo":

<ErrorHandlingDemo />

---

## 6. Versionado: compatibilidad hacia atrás de la API

### 6.1 Motivación de versionar

Escenario: tu aplicación tiene 1 millón de usuarios y necesitas modificar el endpoint de pedidos.

**Si no versionas**:
- La nueva app llama al nuevo endpoint → funciona
- La app antigua llama al nuevo endpoint → ¡faltan campos, se rompe!

**El enfoque correcto**:
- `/v1/orders` - endpoint antiguo, sigue sirviendo a la app antigua
- `/v2/orders` - endpoint nuevo, con las nuevas funcionalidades

### 6.2 Estrategias de versionado

| Estrategia | Ejemplo | Ventajas | Desventajas |
| :--- | :--- | :--- | :--- |
| **Ruta URL** | `/v1/users` | Intuitivo, fácil de cachear | URL más larga |
| **Cabecera de solicitud** | `Accept: vnd.api.v2+json` | URL limpia | Difícil de depurar |
| **Parámetro de consulta** | `/users?version=2` | Simple | Poco estándar |

### 6.3 Ejemplo de evolución de versiones

Tomando el endpoint de usuarios como ejemplo, mostramos la evolución de v1 a v2:

| Endpoint | v1 (antigua) | v2 (nueva) | Cambio |
| :--- | :--- | :--- | :--- |
| **Obtener usuario** | `GET /v1/users`<br>Devuelve: `name, email` | `GET /v2/users`<br>Devuelve: `name, email, avatar, phone` | Nuevos campos: avatar, teléfono |
| **Crear pedido** | `POST /v1/orders`<br>Recibe: `items[]` | `POST /v2/orders`<br>Recibe: `items[], coupons[]` | Nuevo soporte para cupones |
| **Operación batch** | No disponible | `POST /v2/orders/batch` | Nuevo endpoint de creación batch |

::: tip 💡 Buenas prácticas de versionado
- **Mantener compatibilidad hacia atrás**: mantener el endpoint v1 al menos de 6 a 12 meses, dando tiempo a los clientes para migrar
- **Documentación sincronizada**: cada versión tiene su propia documentación de API
- **Aviso de deprecación**: notificar con antelación cuándo se retirará v1, guiando la migración
- **Monitorear el uso**: registrar el volumen de llamadas a v1, confirmar que es seguro retirarlo antes de detener el servicio
:::

---

## 7. Diseño de la estructura de respuesta

La estructura de respuesta es el "contrato de datos" entre frontend y backend; un formato unificado reduce drásticamente los costes de comunicación.

<ResponseStructureDemo />

### 7.1 Referencias de prácticas en grandes empresas

::: details Google API Design Guide
Consulta la [Google API Design Guide](https://cloud.google.com/apis/design/errors): Google exige que todas las respuestas de error de API incluyan la estructura de mensaje `google.rpc.Status`:

```json
{
  "error": {
    "code": 429,
    "message": "Recursos insuficientes, por favor reintente más tarde",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.ErrorInfo",
        "reason": "RESOURCE_AVAILABILITY",
        "domain": "compute.googleapis.com",
        "metadata": {
          "zone": "us-east1-a",
          "service": "compute"
        }
      }
    ]
  }
}
```

**Requisitos clave**:
- Debe incluir `ErrorInfo` con un identificador de error legible por máquina
- `message` está orientado al desarrollador, describiendo el problema y la solución en lenguaje conciso
- El array `details` puede contener `LocalizedMessage` (mensaje localizado), `Help` (enlace de ayuda), etc.
:::

::: details Microsoft REST API Guidelines
Consulta las [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md): Microsoft enfatiza la consistencia en las respuestas:

**Clasificación de errores y fallos**:
- **Error**: causado por datos inválidos del cliente, devuelve 4xx, no afecta la disponibilidad de la API
- **Fallo (Fault)**: el servidor no puede responder correctamente a una solicitud válida, devuelve 5xx, afecta la disponibilidad de la API

**Especificación de cabeceras de respuesta**:
- `Date`: debe devolverse, en formato RFC 5322 (zona horaria GMT)
- `Content-Type`: debe devolverse
- `ETag`: debe devolverse para recursos que soporten control de concurrencia optimista
:::

::: details Manual de desarrollo Java de Alibaba
Consulta el [Manual de desarrollo Java de Alibaba](https://developer.aliyun.com/special/tech-java): Alibaba establece las siguientes normas para respuestas de API:

**Objeto de retorno unificado**:
```java
public class Result<T> {
    private Integer code;
    private String message;
    private T data;
    private String requestId;
}
```

**Diseño segmentado de códigos de error**:
| Rango | Tipo | Ejemplo |
| :--- | :--- | :--- |
| 0 | Éxito | 0 |
| 1xxxx | Error de parámetro | 10001 Falta parámetro obligatorio |
| 2xxxx | Error de negocio | 20001 Saldo insuficiente |
| 3xxxx | Error de autenticación | 30001 No has iniciado sesión |
| 5xxxx | Error de sistema | 50001 Error de base de datos |
:::

::: details Diseño de respuesta de Stripe API
Consulta la [Stripe API Documentation](https://docs.stripe.com/api/errors): el diseño de respuesta de error de Stripe es muy refinado:

```json
{
  "error": {
    "type": "card_error",
    "code": "card_declined",
    "message": "Your card was declined.",
    "param": "number",
    "decline_code": "insufficient_funds",
    "doc_url": "https://stripe.com/docs/error-codes/card-declined"
  }
}
```

**Aspectos destacados del diseño**:
- `type` distingue el tipo de error: `api_error`, `card_error`, `invalid_request_error`
- `param` señala qué parámetro concreto falló, permitiendo al frontend localizar directamente el campo del formulario
- `doc_url` proporciona un enlace a la documentación para que el desarrollador profundice
- `decline_code` ofrece un motivo de error más detallado
:::

::: details Especificación JSON:API
Consulta la [JSON:API Specification](https://jsonapi.org/format/), una especificación de respuesta JSON para APIs ampliamente adoptada en la industria:

```json
{
  "data": {
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "Explicación detallada de la especificación JSON:API"
    },
    "relationships": {
      "author": {
        "data": { "type": "users", "id": "9" }
      }
    }
  },
  "included": [
    {
      "type": "users",
      "id": "9",
      "attributes": {
        "name": "Zhang San"
      }
    }
  ]
}
```

**Diseño central**:
- `data` contiene el recurso principal, debe tener `type` e `id`
- `attributes` almacena las propiedades del recurso
- `relationships` describe las asociaciones del recurso
- `included` evita solicitudes repetidas, devolviendo datos relacionados en una sola respuesta
:::

::: details Diseño de respuesta de GitHub REST API
Consulta la [GitHub REST API Documentation](https://docs.github.com/en/rest): el diseño de respuesta de GitHub se centra en la experiencia del desarrollador:

**Respuesta exitosa**:
```json
{
  "id": 1296269,
  "node_id": "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
  "name": "Hello-World",
  "full_name": "octocat/Hello-World",
  "owner": {
    "login": "octocat",
    "id": 1,
    "avatar_url": "https://github.com/images/error/octocat_happy.gif"
  },
  "private": false,
  "html_url": "https://github.com/octocat/Hello-World"
}
```

**Respuesta de error**:
```json
{
  "message": "Bad credentials",
  "documentation_url": "https://docs.github.com/rest"
}
```

**Aspectos destacados del diseño**:
- La respuesta incluye múltiples formatos de URL (`html_url`, `url`) para diferentes escenarios
- La respuesta de error incluye `documentation_url` apuntando a la documentación
- Usa la cabecera `Link` para implementar navegación de paginación
:::

::: details Diseño de respuesta de Twitter/X API v2
Consulta la [Twitter API v2 Documentation](https://developer.twitter.com/en/docs/twitter-api): Twitter API v2 adopta un formato de respuesta conciso:

```json
{
  "data": {
    "id": "1460323737035677698",
    "text": "Hello, Twitter!"
  },
  "includes": {
    "users": [
      {
        "id": "2244994945",
        "name": "Twitter Dev",
        "username": "TwitterDev"
      }
    ]
  }
}
```

**Aspectos destacados del diseño**:
- `data` contiene los datos principales, `includes` contiene los datos relacionados (similar a JSON:API)
- Soporta selección de campos: `?tweet.fields=created_at,public_metrics`
- La paginación usa `next_token` y `previous_token`
:::

### 7.2 Resumen de buenas prácticas

A partir de las especificaciones anteriores, el diseño de la estructura de respuesta debe seguir estos principios:

1. **La consistencia primero**: todos los endpoints usan la misma estructura de respuesta, permitiendo al frontend unificar la capa de solicitudes
2. **Legible por máquina**: código de error + motivo (reason) para que el programa pueda manejarlo automáticamente
3. **Amigable para humanos**: el mensaje describe claramente el problema e incluye sugerencias de solución
4. **Trazable**: request_id recorre todo el flujo de la solicitud, facilitando la localización de problemas
5. **Soporte de internacionalización**: extender mensajes localizados mediante `details`

### 7.3 Especificación de diseño del campo data

`data` es el núcleo de la respuesta y su diseño afecta directamente la eficiencia del desarrollo frontend.

<DataFieldDesignDemo />

### 7.4 Diseño avanzado de respuesta de error

<ErrorResponseDesignDemo />

::: tip Enlaces de referencia
- [Google API Design Guide - Errors](https://cloud.google.com/apis/design/errors)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)
- [Manual de desarrollo Java de Alibaba](https://developer.aliyun.com/special/tech-java)
- [Heroku HTTP API Design Guide](https://github.com/interagent/http-api-design)
- [Stripe API - Errors](https://docs.stripe.com/api/errors)
- [JSON:API Specification](https://jsonapi.org/format/)
:::

---

## 8. Práctica: ejemplo de diseño de API para un sistema de e-commerce

```
# Módulo de usuarios
GET    /v1/users                    # Obtener lista de usuarios
POST   /v1/users                    # Crear nuevo usuario
GET    /v1/users/{id}               # Obtener detalle de usuario
PUT    /v1/users/{id}               # Actualización completa de usuario
PATCH  /v1/users/{id}               # Actualización parcial de usuario
DELETE /v1/users/{id}               # Eliminar usuario

# Módulo de pedidos
GET    /v1/users/{id}/orders        # Obtener pedidos de un usuario
POST   /v1/orders                   # Crear pedido
GET    /v1/orders/{id}              # Obtener detalle de pedido
PATCH  /v1/orders/{id}/status       # Actualizar estado del pedido

# Módulo de productos (filtros complejos con query params)
GET    /v1/products?category=phone&price_max=5000&sort=price_desc&page=1
```

---

## 9. Diseñar APIs con ayuda de IA

La IA puede ayudarte a generar rápidamente APIs que cumplan con las especificaciones. La clave está en proporcionar un contexto claro y restricciones precisas.

### 9.1 Plantilla de prompt

```
Eres un arquitecto backend senior experto en diseño de APIs RESTful. Por favor, ayúdame a diseñar un conjunto de endpoints de API.

## Contexto de negocio
[Describe tu escenario de negocio, por ejemplo: sistema de e-commerce, plataforma de blogs, gestión de tareas, etc.]

## Requisitos funcionales
[Enumera los módulos funcionales necesarios, por ejemplo:
- Gestión de usuarios: registro, inicio de sesión, perfil personal
- Gestión de pedidos: crear pedido, consultar pedidos, cancelar pedido
- Gestión de productos: listado de productos, detalle de producto, búsqueda]

## Requisitos de diseño
1. Seguir la especificación RESTful
2. URLs con sustantivos en plural, minúsculas + guiones
3. Usar correctamente los métodos HTTP (GET/POST/PUT/PATCH/DELETE)
4. Formato de respuesta unificado: { code, message, data, request_id }
5. Uso adecuado de códigos de estado
6. Versionado: mediante ruta URL (/v1/)

## Formato de salida
Por favor, muestra la salida en el siguiente formato:

### Lista de endpoints
| Método | URL | Descripción | Cuerpo de solicitud | Cuerpo de respuesta |
|--------|-----|-------------|---------------------|---------------------|

### Ejemplos de solicitud/respuesta
[Ejemplos detallados de los endpoints clave]

### Descripción de códigos de estado
[Códigos de estado utilizados y su significado]
```

### 9.2 Ejemplo práctico: API de pedidos de e-commerce

**Prompt de entrada:**

```
Eres un arquitecto backend senior experto en diseño de APIs RESTful. Por favor, ayúdame a diseñar un conjunto de endpoints de API para un sistema de pedidos de e-commerce.

## Contexto de negocio
Una plataforma de e-commerce B2C donde los usuarios pueden navegar productos, realizar pedidos y consultar el estado de los mismos.

## Requisitos funcionales
- Módulo de pedidos: crear pedido, consultar lista de pedidos, consultar detalle de pedido, cancelar pedido, pagar pedido
- Módulo de carrito: añadir producto, modificar cantidad, eliminar producto, ver carrito

## Requisitos de diseño
1. Seguir la especificación RESTful
2. URLs con sustantivos en plural, minúsculas + guiones
3. Usar correctamente los métodos HTTP
4. Formato de respuesta unificado
5. Versionado: /v1/
```

**Salida de ejemplo de la IA:**

| Método | URL | Descripción |
| :--- | :--- | :--- |
| `POST` | `/v1/orders` | Crear pedido |
| `GET` | `/v1/orders` | Consultar lista de pedidos |
| `GET` | `/v1/orders/{id}` | Consultar detalle de pedido |
| `PATCH` | `/v1/orders/{id}/status` | Actualizar estado del pedido (cancelar/pagar) |
| `GET` | `/v1/users/{id}/cart` | Obtener carrito |
| `POST` | `/v1/users/{id}/cart/items` | Añadir producto al carrito |
| `PATCH` | `/v1/users/{id}/cart/items/{itemId}` | Modificar cantidad de producto en el carrito |
| `DELETE` | `/v1/users/{id}/cart/items/{itemId}` | Eliminar producto del carrito |

### 9.3 Consideraciones para el diseño asistido por IA

| Punto a considerar | Descripción |
| :--- | :--- |
| **Proporcionar contexto completo** | Describe claramente el contexto de negocio, roles de usuario y relaciones de datos |
| **Definir restricciones claras** | Define de antemano las convenciones de nomenclatura, estrategia de versionado, formato de respuesta, etc. |
| **Iterar y optimizar** | La primera salida puede no ser perfecta; pregunta por detalles y solicita modificaciones |
| **Revisión humana** | El contenido generado por IA debe ser revisado manualmente para verificar que cumple con los requisitos de negocio |
| **Complementar casos límite** | Pide a la IA que considere manejo de errores, control de permisos, paginación y otros casos límite |

::: tip 💡 Técnicas para seguir preguntando
- "Por favor, añade ejemplos de respuesta de error para cada endpoint"
- "Por favor, considera parámetros de paginación, ordenación y filtrado"
- "Por favor, añade descripciones de control de permisos para los endpoints"
- "Por favor, verifica si cumple con las mejores prácticas RESTful"
:::

---

## Tabla de referencia rápida de términos

| Término | Inglés | Explicación |
| :--- | :--- | :--- |
| **API** | Application Programming Interface | Contrato de diálogo entre programas |
| **REST** | Representational State Transfer | Un estilo arquitectónico que identifica recursos mediante URLs |
| **Recurso** | Resource | Concepto central de la arquitectura REST, con identificador único (URL) |
| **Idempotencia** | Idempotency | Ejecutar varias veces produce el mismo resultado |
| **Código de estado** | Status Code | Estado de respuesta definido por el protocolo HTTP |
| **Versionado** | Versioning | Permite que APIs antiguas y nuevas coexistan, facilitando actualizaciones progresivas |
| **Cuerpo de solicitud** | Request Body | Datos enviados en solicitudes POST/PUT/PATCH |
| **Cuerpo de respuesta** | Response Body | Datos devueltos por el servidor |
| **Cabecera** | Header | Metadatos de la solicitud/respuesta (como Content-Type) |
| **Autenticación** | Authentication | Verificar "quién eres" (inicio de sesión, Token) |
| **Autorización** | Authorization | Verificar "qué puedes hacer" (permisos) |