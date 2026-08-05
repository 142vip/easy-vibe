# Principios de serialización: la traducción de datos

::: tip 🎯 Pregunta clave
**¿Cómo se transmiten los datos por la red?** Es como preguntar: ¿cómo hacer que lo que dice una persona lo entienda otra? La serialización resuelve el problema de la "traducción de datos": convertir los objetos en memoria a un formato que pueda transmitirse.
:::

---

## La necesidad de serializar datos

Durante la interacción entre frontend y backend, los datos necesitan pasar por múltiples "transformaciones" para viajar del servidor al cliente.

**Escenario 1: los datos que recibe el frontend "han cambiado"**

```javascript
// El backend envía
Date birth = new Date(1990, 5, 15)

// El frontend recibe
{ "birth": "1990-06-15T00:00:00Z" }  // ¡Es un string!
```

El frontend quiere usar `.getFullYear()`, pero da error: porque no es un objeto Date, es un string.

**Escenario 2: caracteres chinos ilegibles**

```json
// Esperado
{ "name": "张三" }

// Recibido realmente
{ "name": "å¼ ä¸" }
```

Problemas de codificación de caracteres causan que el texto en chino se vuelva ilegible.

**Escenario 3: cuello de botella de rendimiento**

```json
// Una respuesta que contiene una lista de 10000 productos
{
  "products": [
    { "id": 1, "name": "...", "description": "...", ... },
    // ... 9999 más
  ]
}
// Tamaño: 5.2 MB, tiempo de transmisión: 3.5 segundos
```

La redundancia del formato JSON hace que el paquete de datos sea demasiado grande, afectando gravemente al rendimiento.

---

**La serialización es como una "traducción"**: convertir los objetos en memoria a un formato transmisible, y el receptor lo "traduce" de vuelta.

---

## 1. Introducción a serialización/deserialización

**Serialización** (Serialization) es el proceso de convertir un objeto a un formato transmisible.

**Deserialización** (Deserialization) es el proceso de restaurar el formato transmitido de vuelta a un objeto.

### 1.1 Analogía con enviar un artefacto de compilación

| Enviar un paquete | Serialización | Descripción |
| :--- | :--- | :--- |
| Empaquetar el artículo | Serialización | Meter el artículo en una caja y poner la etiqueta |
| Transporte | Transmisión por red | El camión de mensajería lo lleva al destino |
| Desempaquetar | Deserialización | El destinatario abre la caja y saca el artículo |

### 1.2 Motivación de serialización

| Motivo | Descripción | Ejemplo |
| :--- | :--- | :--- |
| **Transmisión por red** | La red solo puede transmitir flujos de bytes | Llamadas API, comunicación RPC |
| **Almacenamiento persistente** | El disco solo puede almacenar bytes | Guardar objetos en archivos, bases de datos |
| **Multi-lenguaje** | Diferentes lenguajes tienen diferentes estructuras de datos | Objeto Java → Diccionario Python |
| **Caché distribuida** | Redis/Memcached almacenan bytes | Cachear información de usuario |

---

## 2. Formatos comunes de serialización

👇 **Pruébalo**: haz clic en el botón de abajo para observar el proceso de serialización en diferentes lenguajes:

<SerializationDemo />

### 2.1 JSON: el más universal

**Ventajas**:
- Buena legibilidad, fácil de depurar
- Todos los lenguajes lo soportan
- El navegador lo soporta de forma nativa (`JSON.parse` / `JSON.stringify`)

**Desventajas**:
- Tamaño grande (muchas marcas `{}` `""`)
- No soporta tipos de datos ricos (Date, Map, Set se convierten en strings)

**Escenarios aplicables**:
- APIs públicas
- Comunicación frontend-backend
- Archivos de configuración

### 2.2 XML: el antiguo estándar

```xml
<?xml version="1.0" encoding="UTF-8"?>
<user>
  <id>123</id>
  <name>张三</name>
  <email>zhangsan@example.com</email>
  <age>28</age>
</user>
```

**Ventajas**:
- Estructura clara, soporta comentarios
- Soporta estructuras anidadas complejas
- Tiene validación mediante Schema (XSD)

**Desventajas**:
- Tamaño grande, parseo lento
- Etiquetas redundantes (`<open></close>`)

**Escenarios aplicables**:
- Archivos de configuración (Spring, MyBatis)
- Protocolo SOAP
- Intercambio de datos complejos

### 2.3 Protobuf: el más eficiente

```protobuf
// user.proto
syntax = "proto3";
message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
  int32 age = 4;
}
```

**Ventajas**:
- Tamaño pequeño (30-50% menor que JSON)
- Alta velocidad (parseo 5-10 veces más rápido)
- Compatibilidad hacia atrás (nuevos campos no afectan a versiones antiguas)

**Desventajas**:
- No legible (formato binario)
- Requiere archivo .proto para definir la estructura
- No soporta tipos dinámicos

**Escenarios aplicables**:
- Comunicación interna entre microservicios
- Escenarios de alto rendimiento (juegos, comunicación en tiempo real)
- Apps móviles (ahorro de datos)

### 2.4 MessagePack: equilibrio entre legibilidad y rendimiento

```json
// MessagePack es la versión binaria de JSON
// Para los mismos datos, MessagePack es aproximadamente un 30% más pequeño que JSON
```

**Ventajas**:
- Más pequeño y más rápido que JSON
- Mantiene el modelo de datos de JSON
- Soporta todos los tipos de JSON

**Desventajas**:
- No legible
- No tan eficiente como Protobuf

**Escenarios aplicables**:
- Cuando se necesita rendimiento pero no se quiere usar Protobuf
- Caché Redis
- Mensajes WebSocket

---

## 3. Comparación de serialización por lenguaje

| Lenguaje | Biblioteca JSON | Biblioteca Protobuf | Biblioteca XML |
| :--- | :--- | :--- | :--- |
| **JavaScript** | `JSON.stringify()` | `protobuf.js` | `fast-xml-parser` |
| **Python** | `json.dumps()` | `protobuf` | `xmltodict` |
| **Java** | `Jackson` / `Gson` | `protobuf-java` | `JAXB` |
| **Go** | `encoding/json` | `proto` | `encoding/xml` |
| **C++** | `nlohmann/json` | `protobuf` | `tinyxml2` |
| **C#** | `System.Text.Json` | `Google.Protobuf` | `System.Xml` |

::: tip 💡 Recomendaciones de elección
- **Comunicación frontend-backend**: JSON (fácil de depurar)
- **Comunicación interna entre microservicios**: Protobuf (mejor rendimiento)
- **Archivos de configuración**: JSON o YAML
- **Integración con sistemas legacy**: XML (puede que no haya otra opción)
:::

---

## 4. Comparación de rendimiento

### 4.1 Comparación de tamaño (ejemplo con objeto usuario)

| Formato | Tamaño | Relativo a JSON |
| :--- | :--- | :--- |
| JSON | 68 bytes | 100% |
| XML | 142 bytes | 209% |
| Protobuf | 38 bytes | 56% |
| MessagePack | 52 bytes | 76% |

### 4.2 Comparación de velocidad (serializar 10000 veces)

| Formato | Tiempo | Relativo a JSON |
| :--- | :--- | :--- |
| JSON | 45 ms | 100% |
| XML | 120 ms | 267% |
| Protobuf | 8 ms | 18% |
| MessagePack | 28 ms | 62% |

::: tip 💡 Conclusiones de las pruebas de rendimiento
- **Protobuf es el más rápido**: ideal para escenarios de alto rendimiento
- **MessagePack es el segundo**: aproximadamente un 40% más rápido que JSON
- **JSON es el más lento**: pero suficiente para la mayoría de escenarios
:::

---

## 5. Problemas comunes

### 5.1 Problema de serialización de fechas

**Problema**: los objetos Date se convierten en strings tras la serialización

```javascript
// Antes de serializar
const date = new Date('2024-01-01')

// Después de serializar
JSON.stringify(date)  // "2024-01-01T00:00:00.000Z"
```

**Solución**:
```javascript
// Opción 1: convertir a timestamp
{ createdAt: date.getTime() }  // 1704067200000

// Opción 2: convertir a string ISO
{ createdAt: date.toISOString() }  // "2024-01-01T00:00:00.000Z"

// Opción 3: serialización personalizada
JSON.stringify(obj, (key, value) => {
  if (value instanceof Date) {
    return { __type: 'Date', value: value.toISOString() }
  }
  return value
})
```

### 5.2 Problema de referencia circular

**Problema**: las referencias circulares en objetos causan error

```javascript
const obj = { name: 'test' }
obj.self = obj
JSON.stringify(obj)  // TypeError: Converting circular structure to JSON
```

**Solución**:
```javascript
// Opción 1: filtrar referencias circulares
const seen = new WeakSet()
JSON.stringify(obj, (key, value) => {
  if (typeof value === 'object' && value !== null) {
    if (seen.has(value)) return
    seen.add(value)
  }
  return value
})

// Opción 2: usar la biblioteca flatted
import { parse, stringify } from 'flatted'
stringify(obj)  // maneja referencias circulares automáticamente
```

### 5.3 Problema de caracteres chinos ilegibles

**Problema**: el texto en chino se vuelve ilegible tras la serialización

**Causa**:
- Codificación de caracteres inconsistente (UTF-8 vs GBK)
- Marca BOM

**Solución**:
```python
# Python: asegurar el uso de UTF-8
import json
json.dumps(data, ensure_ascii=False)  # no escapar caracteres chinos
```

```javascript
// Node.js: establecer cabecera de respuesta
res.setHeader('Content-Type', 'application/json; charset=utf-8')
```

---

## 6. Práctica: esquema de serialización para un sistema e-commerce

### 6.1 Análisis de escenarios

| Escenario | Formato elegido | Motivo |
| :--- | :--- | :--- |
| **App → API backend** | JSON | Fácil de depurar, unificado entre frontend y backend |
| **Backend → Backend RPC** | Protobuf | Mejor rendimiento, ahorro de ancho de banda |
| **Caché en Redis** | MessagePack | Más pequeño que JSON, puede serializar objetos complejos |
| **Registro de logs** | JSON | Fácil de parsear por herramientas de análisis de logs |

### 6.2 Ejemplos de código

```javascript
// Respuesta API (JSON)
app.get('/api/products/:id', async (req, res) => {
  const product = await db.getProduct(req.params.id)
  res.json({
    code: 0,
    data: product
  })
})

// Comunicación entre microservicios (Protobuf)
// product.proto
syntax = "proto3";
message Product {
  int32 id = 1;
  string name = 2;
  int32 price = 3;
}

// Servidor
const proto = require('./product.proto')
const message = proto.Product.create(product)
const buffer = proto.Product.encode(message).finish()

// Cliente
const decoded = proto.Product.decode(buffer)

// Caché Redis (MessagePack)
const msgpack = require('msgpack-lite')
await redis.set(
  `product:${id}`,
  msgpack.encode(product)
)
const cached = msgpack.decode(await redis.get(`product:${id}`))
```

---

## 7. Usar IA para elegir el esquema de serialización

La IA puede ayudarte a elegir el formato de serialización adecuado según el escenario.

### 7.1 Plantilla de prompt

```
Eres un arquitecto de sistemas senior experto en tecnologías de serialización de datos. Ayúdame a elegir el esquema de serialización adecuado.

## Escenario de negocio
[Describe tu escenario, por ejemplo: app e-commerce, backend de juegos, microservicios, etc.]

## Requisitos técnicos
[Enumera las restricciones, por ejemplo:
- Frontend y backend separados (Vue + Node.js)
- Requisitos de alto rendimiento (QPS > 10000)
- Sensible al tráfico (app móvil, necesita ahorrar datos)
- Necesita soporte multi-lenguaje (Java + Python + Go)]

## Características de los datos
[Describe las características de los datos, por ejemplo:
- Gran volumen de datos (respuesta única > 1MB)
- Estructura compleja (múltiples niveles de anidamiento)
- Contiene tipos especiales como fechas, datos binarios]

## Formato de salida
Por favor, responde en el siguiente formato:
1. Esquema recomendado (JSON/Protobuf/MessagePack/XML)
2. Justificación
3. Comparación de rendimiento (tamaño y velocidad estimados)
4. Ejemplo de código
```

### 7.2 Ejemplo práctico

**Prompt de entrada**:

```
Eres un arquitecto de sistemas senior. Nuestra app e-commerce necesita optimizar el rendimiento de la interfaz de lista de productos.

## Escenario de negocio
- Interfaz de lista de productos de una app e-commerce
- Cada respuesta devuelve 100 productos
- Cada producto contiene 20 campos: id, name, price, image, description, etc.
- Actualmente usamos JSON, la respuesta pesa unos 200KB y tarda 800ms

## Requisitos técnicos
- El frontend es Vue.js
- El backend es Node.js + microservicios Go
- Necesitamos equilibrar rendimiento y eficiencia de desarrollo

## Objetivo de optimización
- Reducir el tiempo de respuesta a menos de 300ms
- Reducir el tamaño del paquete de datos en un 30%
```

**Respuesta de la IA**:

```
Esquema recomendado: solución híbrida

1. **Capa API**: seguir usando JSON (amigable para el frontend)
2. **Comunicación entre microservicios**: migrar a Protobuf (mejora de rendimiento)
3. **Datos estáticos**: activar compresión gzip

### Justificación
- JSON es lo más amigable para el frontend, no requiere parseo adicional
- Los microservicios backend con Protobuf pueden reducir el volumen de datos en un 40%
- La compresión gzip es muy efectiva en texto (JSON puede comprimirse un 70%)

### Comparación de rendimiento
| Esquema | Tamaño | Tiempo |
|------|------|------|
| Actual (JSON) | 200 KB | 800 ms |
| + gzip | 60 KB | 350 ms |
| + Protobuf | 50 KB | 280 ms |

### Ejemplo de código
[Código de implementación concreto...]
```

---

## Tabla rápida de términos

| Término | Inglés | Explicación |
| :--- | :--- | :--- |
| **Serialización** | Serialization | Objeto → Flujo de bytes |
| **Deserialización** | Deserialization | Flujo de bytes → Objeto |
| **JSON** | JavaScript Object Notation | El formato de texto más usado |
| **XML** | Extensible Markup Language | Lenguaje de marcado, antiguo estándar |
| **Protobuf** | Protocol Buffers | Formato eficiente open source de Google |
| **MessagePack** | - | Versión binaria de JSON |
| **Codificación** | Encoding | Carácter → Byte |
| **Decodificación** | Decoding | Byte → Carácter |