# Introducción a las API: comprensión del diálogo entre programas desde cero

::: tip 🎯 Pregunta clave
**¿Qué es una API?** Es como preguntar: ¿cómo se diseña el menú de un restaurante para que el cliente lo entienda de un vistazo? ¿Cómo toma nota el camarero sin equivocarse? Las API resuelven el problema de "cómo dialogan los programas entre sí". Desde el primer día que escribes código estás usando APIs, aunque quizás no te hayas dado cuenta.
:::

---

## 0. Tres confusiones comunes de los principiantes

**Confusión 1: ¿Es la API algo muy avanzado?**

Mucha gente, al oír "API", piensa que es un concepto que solo entienden los ingenieros senior. Pero en realidad ya has usado APIs:

```python
len("hello")        # Esto es una API que proporciona Python
open("file.txt")    # Esto también es una API
requests.get(url)   # Esto también es una API
```

**Confusión 2: ¿Qué diferencia hay entre una Web API y una API normal?**

| Tipo | A quién llama | Medio de comunicación | Escenario típico |
| :--- | :--- | :--- | :--- |
| **API de función** | Código local | Llamada a función | `len()`, `open()` |
| **API del sistema operativo** | Sistema operativo | Llamada al sistema | Leer/escribir archivos, crear procesos |
| **Web API** | Servidor remoto | Petición HTTP | Llamar a un modelo de IA, obtener el clima |

**Confusión 3: ¿Debo usar HTTP o SDK?**

```python
# Método HTTP: gestionas todos los detalles tú mismo
import requests
response = requests.post(
    "https://api.deepseek.com/v1/chat/completions",
    headers={"Authorization": "Bearer sk-xxx"},
    json={"model": "deepseek-chat", "messages": [...]}
)
result = response.json()["choices"][0]["message"]["content"]

# Método SDK: el asistente gestiona todo por ti
from openai import OpenAI
client = OpenAI(api_key="sk-xxx")
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[...]
)
result = response.choices[0].message.content
```

---

## 1. La esencia de una API: enchufe y toma de corriente

**API** (Application Programming Interface, Interfaz de Programación de Aplicaciones) es "el acuerdo de diálogo entre programas".

### 1.1 Analogía con los electrodomésticos

| Concepto | Analogía con electrodomésticos | Equivalente API |
| :--- | :--- | :--- |
| **Interfaz** | Forma del enchufe | Firma de la función / URL |
| **Entrada** | Corriente eléctrica | Parámetros de la función / Cuerpo de la petición |
| **Salida** | El electrodoméstico funciona | Valor de retorno / Cuerpo de la respuesta |

### 1.2 Comparación de los tres tipos de API

<ApiTypesComparison />

### 1.3 Diferencia entre API de función y API HTTP

Muchos principiantes se confunden: ¿cuál es exactamente la diferencia entre una API de función y una API HTTP? ¿Cómo distinguirlas al leer la documentación?

<ApiFunctionVsHttp />

### 1.4 Cómo leer distintos tipos de documentación de API

Al enfrentarse a diferentes tipos de documentación de API, los puntos de atención varían:

<DocumentTypesComparison />

---

## 2. Una llamada API completa

👇 **Pruébalo**: haz clic en el botón de abajo y observa el flujo completo de una petición-respuesta API:

<ApiRequestDemo />

### 2.1 Las cuatro fases de una llamada API

| Fase | Qué ocurre | Analogía con electrodomésticos |
| :--- | :--- | :--- |
| **Petición** | El cliente envía una petición al servidor | Pulsar el interruptor |
| **Transmisión** | La petición viaja por la red hasta el servidor | La corriente fluye por el cable |
| **Procesamiento** | El servidor procesa la petición y devuelve datos | El electrodoméstico empieza a funcionar |
| **Respuesta** | El cliente recibe y procesa el resultado | La bombilla se enciende |

### 2.2 Analogía con el restaurante

| Rol en el restaurante | Equivalente API | Descripción |
| :--- | :--- | :--- |
| **Menú** | Documentación de la API | Te dice qué "platos" puedes pedir |
| **Camarero** | Protocolo HTTP | "Forma de dialogar" estandarizada |
| **Cocina** | Servidor | Procesa la petición según el "pedido" |
| **Servir el plato** | Respuesta | Devuelve el resultado al "cliente" |

---

## 3. Métodos HTTP: estás "preguntando" o "haciendo"

Al llamar a una Web API, necesitas decirle al servidor qué quieres hacer. De ahí nacen los métodos HTTP.

### 3.1 Entenderlos pidiendo en un restaurante

| Escenario | ¿Qué dirías en la vida real? | Método HTTP correspondiente |
| :--- | :--- | :--- |
| Quieres saber qué platos hay hoy | "Camarero, ¿me enseña el menú?" | **GET** - solo "preguntar", sin modificar datos |
| Quieres pedir un plato | "Póngame un pollo kung pao" | **POST** - "hacer" algo, crear datos |
| Quieres cambiar un plato | "Cambie el pollo kung pao por cerdo agridulce" | **PUT** - reemplazar datos |
| Quieres modificar un plato | "El pollo kung pao sin cacahuetes" | **PATCH** - modificación parcial |
| Ya no lo quieres | "Déjelo, quite ese plato" | **DELETE** - eliminar datos |

<HttpMethodsDemo />

::: warning Sobre la idempotencia
**Idempotencia**: ¿ejecutar varias veces produce el mismo resultado?

- **Operaciones idempotentes** (GET/PUT/DELETE): pedir 10 veces y 1 vez produce el mismo resultado
- **Operaciones no idempotentes** (POST): pedir 10 veces puede crear 10 pedidos

**Solución**: en operaciones POST, validar con un ID único para evitar procesamiento duplicado.
:::

### 3.2 Tabla rápida de métodos HTTP

| Método | Propósito | Idempotencia | Seguridad | Escenario típico |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | Obtener recurso | Sí | Sí | Consultar lista, ver detalle |
| **POST** | Crear recurso | No | No | Añadir usuario, enviar pedido |
| **PUT** | Actualización completa | Sí | No | Reemplazar todo el perfil de usuario |
| **PATCH** | Actualización parcial | No | No | Modificar solo el apodo |
| **DELETE** | Eliminar recurso | Sí | No | Eliminar usuario, cancelar pedido |

---

## 4. Códigos de estado HTTP: qué te está diciendo el servidor

Cuando el servidor responde, primero devuelve un código de estado que indica si la petición tuvo éxito.

### 4.1 Clasificación de códigos de estado

<StatusCodeCategories />

### 4.2 Códigos de estado comunes en detalle

| Código | Significado | Escenario típico | Acción del cliente |
| :--- | :--- | :--- | :--- |
| **200 OK** | Éxito | La petición se procesó correctamente | Mostrar datos |
| **201 Created** | Creación exitosa | Petición POST creó el recurso correctamente | Redirigir al nuevo recurso |
| **400 Bad Request** | Formato de petición incorrecto | Faltan parámetros o formato incorrecto | Revisar parámetros |
| **401 Unauthorized** | No autenticado | No se proporcionó una API Key válida | Guiar al usuario para iniciar sesión |
| **403 Forbidden** | Sin permisos | La API Key no tiene permiso para acceder al recurso | Mostrar aviso de permisos insuficientes |
| **404 Not Found** | No existe | La dirección o el recurso solicitado no existe | Comprobar la URL |
| **429 Too Many Requests** | Demasiadas peticiones | Se superó el límite de tasa | Reintentar más tarde |
| **500 Internal Server Error** | Error del servidor | Problema en el lado del servidor | Avisar al usuario que reintente más tarde |

👇 **Pruébalo**: haz clic en el botón de abajo para entender el significado de los códigos de estado comunes:

<StatusCodeDemo />

---

## 5. HTTP vs SDK: ir tú mismo o que te lo gestione un asistente

### 5.1 Comparación de los dos métodos de llamada

| | 🏃 **HTTP API** | 🤵 **SDK** |
| :--- | :--- | :--- |
| **Analogía** | Ir tú mismo | Asistente que lo gestiona todo |
| **Ventajas** | ✓ Funciona con todos los lenguajes<br>✓ Control total de los detalles de la petición<br>✓ Sin dependencias adicionales | ✓ Código conciso y legible<br>✓ Gestiona la autenticación automáticamente<br>✓ Reintentos de error integrados |
| **Desventajas** | ✗ Necesitas gestionar todos los detalles<br>✗ Código extenso y propenso a errores | ✗ Necesita instalar dependencias<br>✗ Puede haber problemas de versión |
| **Ejemplo de código** | `requests.post(url, json=..., headers={...})` | `client.chat.completions.create(...)` |

### 5.2 Enfoque de elegir

| Escenario | Recomendación | Motivo |
| :--- | :--- | :--- |
| **Desarrollo rápido** | SDK | Gestiona automáticamente autenticación, errores, reintentos |
| **Aprender los fundamentos** | HTTP | Entender los mecanismos subyacentes |
| **Lenguaje no soportado** | HTTP | Cualquier lenguaje puede usarlo |
| **Necesidad de personalización** | HTTP | Control flexible de cada detalle |

::: tip 💡 Recomendación
**Usa SDK siempre que puedas**, deja las complicaciones a la biblioteca y el tiempo para ti.
:::

---

## 6. Enfoque de leer la documentación de una API

La documentación de una API es como una combinación de manual de instrucciones y menú. No necesitas leerla de principio a fin, solo aprender a "consultar el diccionario".

### 6.1 Lista de comprobación para leer documentación

Al abrir cualquier documentación de API (como OpenAI o DeepSeek), solo necesitas buscar estas cosas:

<ApiDocumentDemo />

| Elemento | Descripción | Ejemplo |
| :--- | :--- | :--- |
| **Base URL** | La dirección raíz de la API | `https://api.deepseek.com` |
| **Authentication** | Cómo demostrar tu identidad | `Authorization: Bearer sk-xxx` |
| **Endpoints** | Lista de interfaces concretas | `/v1/chat/completions` |
| **Parameters** | Parámetros obligatorios/opcionales | `model` (obligatorio), `temperature` (opcional) |
| **Response** | Estructura de datos devueltos | `{"choices": [...]}` |

### 6.2 Pasos para leer la documentación

1. **Encuentra la Base URL** - es el prefijo de todas las peticiones
2. **Entiende el método de autenticación** - ¿la API Key va en el Header o en el Query?
3. **Encuentra el Endpoint necesario** - la interfaz concreta que vas a llamar
4. **Revisa los parámetros de la petición** - ¿cuáles son obligatorios? ¿cuáles opcionales?
5. **Comprende el formato de respuesta** - ¿cómo están organizados los datos?

---

## 7. Ejercicio práctico: simular una llamada API

De nada sirve la teoría sin práctica. Aquí hay una API simulada donde puedes poner cualquier parámetro y modificar la dirección para ver qué ocurre.

<ApiPlayground />

Intenta provocar estos escenarios:
- ✅ **Petición exitosa**: introduce el Endpoint y la API Key correctos
- ❌ **Error 401**: no pongas la API Key, observa cómo el servidor te rechaza
- ❌ **Error 404**: introduce una dirección que no existe

---

## 8. Resumen

::: info Puntos clave
1. **Una API es un altavoz**, que transmite tus palabras a otro fragmento de código o a un servidor remoto
2. **Ya has usado APIs antes**, desde `len()` hasta `open()` son APIs
3. **Las Web APIs son superpoderes**, te permiten llamar a superordenadores a miles de kilómetros
4. **El SDK es un buen asistente**, si puedes usar SDK no vayas tú mismo
5. **Al leer la documentación busca tres cosas**: dirección, autenticación, parámetros
:::

En la era de la programación con IA, solo necesitas recordar estos conceptos fundamentales. Los detalles restantes los gestionarán el IDE y el asistente de IA por ti.

---

## Tabla rápida de términos

| Término | Nombre completo | Explicación |
| :--- | :--- | :--- |
| **API** | Application Programming Interface | Interfaz de programación de aplicaciones, define cómo interactúan los programas entre sí |
| **Web API** | - | API basada en el protocolo HTTP, para comunicación en red |
| **Endpoint** | - | Punto final, la dirección concreta de la API |
| **HTTP** | HyperText Transfer Protocol | Protocolo de comunicación usado por las Web APIs |
| **GET** | - | Método para obtener recursos |
| **POST** | - | Método para enviar datos |
| **SDK** | Software Development Kit | Kit de desarrollo de software, encapsula las llamadas API de bajo nivel |
| **URL** | Uniform Resource Locator | Dirección de red de la API |
| **JSON** | JavaScript Object Notation | Formato de datos más común |
| **Authentication** | - | Proceso de verificación de identidad |
| **Status Code** | - | Código de estado en la respuesta HTTP |
| **Request** | - | Petición |
| **Response** | - | Respuesta |
| **Header** | - | Cabecera HTTP, contiene metainformación |
| **Payload** | - | Datos reales de la petición o respuesta |
| **Rate Limit** | - | Límite de tasa |
| **Idempotent** | - | Idempotente, ejecutar varias veces produce el mismo resultado |
| **REST** | Representational State Transfer | Un estilo de arquitectura de API |
| **RPC** | Remote Procedure Call | Llamada a procedimiento remoto |
| **GraphQL** | - | Un lenguaje de consulta para APIs |
| **gRPC** | - | Framework RPC de alto rendimiento desarrollado por Google |