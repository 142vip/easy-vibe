# Panorama de modelos de datos: documento/grafo/serie temporal/vector

::: tip 🎯 Pregunta central
**¿Por qué no puedes meter todos los datos en tablas de MySQL?** Cuando tus datos son redes sociales, millones de registros de sensores por segundo, o vectores semánticos que la IA necesita comprender, las tablas relacionales se quedan cortas. Diferentes formas de datos requieren diferentes enfoques de modelado.
:::

---

## 1. Más allá de lo relacional: Motivación de otros modelos de datos

Las bases de datos relacionales (MySQL, PostgreSQL) organizan los datos en "tablas + filas + columnas", adecuadas para datos de negocio con estructura fija y relaciones claras. Pero los datos del mundo real van mucho más allá de esta forma:

| Forma de los datos | Punto débil de lo relacional | Modelo más adecuado |
|---------------------|------------------------------|---------------------|
| Perfiles de usuario (campos variables, estructura anidada) | ALTER TABLE frecuentes, muchas columnas NULL | **Modelo documental** |
| Redes sociales (amigos de amigos de amigos) | El rendimiento de los JOIN de múltiples niveles cae exponencialmente | **Modelo de grafo** |
| Métricas de monitorización (millones de escrituras por segundo) | Cuello de botella de escritura, datos históricos inflados | **Modelo de serie temporal** |
| Búsqueda semántica de IA (contenidos de "significado similar") | No puede expresar similitud semántica | **Modelo vectorial** |

::: info 💡 Punto de vista clave
No se trata de "reemplazar" lo relacional, sino de "complementarlo". El núcleo de la mayoría de los sistemas sigue corriendo en MySQL/PostgreSQL, pero introduciendo modelos de datos especializados para escenarios concretos se pueden lograr mejoras de rendimiento de varios órdenes de magnitud.
:::

---

## 2. Modelo documental (Document)

### 2.1 Introducción a modelo documental

El modelo documental almacena datos como **documentos JSON/BSON**, donde cada registro es un documento autocontenido que puede tener diferentes estructuras de campos.

```json
{
  "_id": "user_1001",
  "name": "张三",
  "tags": ["VIP", "活跃"],
  "address": { "city": "北京", "district": "朝阳区" },
  "orders": [
    { "id": "o1", "amount": 299 },
    { "id": "o2", "amount": 599 }
  ]
}
```

**Características clave:**
- **Sin restricciones de Schema**: no es necesario predefinir la estructura de la tabla, los campos se añaden o eliminan en cualquier momento
- **Estructura anidada**: direcciones y pedidos se anidan directamente en el documento, una sola lectura obtiene todos los datos
- **Escalabilidad horizontal**: naturalmente adecuada para sharding, maneja fácilmente datos masivos

### 2.2 Documental vs Relacional

| Dimensión de comparación | Relacional (MySQL) | Documental (MongoDB) |
|--------------------------|--------------------|-----------------------|
| Estructura de datos | Schema fijo, se modifica con ALTER TABLE | Schema flexible, se añaden campos en cualquier momento |
| Datos anidados | Requiere JOIN de múltiples tablas | Anidados directamente en el documento |
| Relaciones entre registros | JOIN es muy potente | Consultas de relación son más débiles |
| Escenarios adecuados | Datos de negocio con estructura estable | Datos de contenido con estructura variable |

### 2.3 Escenarios típicos

- **CMS (Gestión de contenidos)**: artículos, comentarios y etiquetas con estructuras diversas
- **Perfiles de usuario**: diferentes usuarios tienen diferentes campos de atributos
- **Catálogos de productos**: los teléfonos tienen "tamaño de pantalla", los alimentos tienen "fecha de caducidad", campos completamente diferentes
- **Centro de configuración**: la estructura de configuración de cada servicio no es uniforme

::: warning ⚠️ Error común
"MongoDB no necesita diseñar la estructura de datos" — ¡Falso! El modelo documental también requiere un diseño cuidadoso: los niveles de anidamiento no deben ser demasiado profundos y los subdocumentos que se actualizan con frecuencia deben separarse en colecciones independientes.
:::

---

## 3. Modelo de grafo (Graph)

### 3.1 Introducción a modelo de grafo

El modelo de grafo utiliza **nodos (Node)** y **aristas (Edge)** para representar entidades y sus relaciones. Cada nodo es una entidad, cada arista es una relación, y tanto nodos como aristas pueden llevar propiedades.

```
(张三) --[关注]--> (李四) --[关注]--> (王五)
   |                                    |
   +--------[购买]----> (iPhone) <--[购买]--+
```

### 3.2 La capacidad estrella del modelo de grafo: consultas de múltiples saltos

**Escenario**: encontrar "amigos de amigos de amigos" en una red social

Enfoque relacional (3 niveles de JOIN):
```sql
SELECT DISTINCT f3.name
FROM friends f1
JOIN friends f2 ON f1.friend_id = f2.user_id
JOIN friends f3 ON f2.friend_id = f3.user_id
WHERE f1.user_id = 1001;
```

Enfoque de base de datos de grafo (lenguaje de consulta Cypher):
```cypher
MATCH (me)-[:FOLLOWS*1..3]->(target)
WHERE me.name = '张三'
RETURN DISTINCT target.name
```

En lo relacional, cada salto adicional añade un JOIN y el rendimiento cae exponencialmente. Las bases de datos de grafo recorren las relaciones directamente a través de punteros, y el rendimiento de las consultas de múltiples saltos apenas varía.

### 3.3 Escenarios típicos

- **Redes sociales**: recomendación de amigos, seguimientos en común, propagación de influencia
- **Grafos de conocimiento**: inferencia de relaciones entre entidades ("el estudiante de quién es alumno de quién")
- **Detección de fraude**: descubrir ciclos financieros y redes de cuentas vinculadas
- **Sistemas de recomendación**: recomendaciones basadas en grafos de relaciones usuario-producto-etiqueta

---

## 4. Modelo de serie temporal (Time-Series)

### 4.1 Introducción a modelo de serie temporal

El modelo de serie temporal se organiza en torno a **timestamps**, optimizado específicamente para escenarios de "escritura ordenada por tiempo y consulta por rango temporal".

```
timestamp            device      cpu_usage   memory
2024-01-15 10:00:01  server-01   45%         12.3GB
2024-01-15 10:00:02  server-01   67%         12.5GB
2024-01-15 10:00:03  server-01   92%         14.1GB
```

### 4.2 Motivación para MySQL para datos de serie temporal

| Problema | MySQL | Base de datos de serie temporal (InfluxDB) |
|----------|-------|---------------------------------------------|
| Velocidad de escritura | Decenas de miles/seg | **Millones/seg** |
| Datos históricos | Limpieza manual, tabla creciente | **Política de expiración automática (TTL)** |
| Consultas de agregación | GROUP BY lento | **Reducción de muestreo integrada** (5 seg → promedio de 1 min) |
| Eficiencia de almacenamiento | Almacenamiento genérico, desperdicio de espacio | **Compresión en columnas**, ahorra 90% del espacio |

### 4.3 Escenarios típicos

- **Monitorización de servidores**: CPU, memoria y disco recolectados cada segundo
- **Sensores IoT**: temperatura, humedad y trayectoria GPS
- **Cotizaciones financieras**: datos por segundo de precios de acciones y volúmenes de transacciones
- **Análisis de logs**: agregación temporal de logs de aplicaciones

---

## 5. Modelo vectorial (Vector)

### 5.1 Introducción a modelo vectorial

El modelo vectorial convierte datos no estructurados como texto, imágenes y audio en vectores numéricos de alta dimensión mediante **modelos de Embedding**, y luego calcula la distancia entre vectores para medir la similitud semántica.

```
"好吃的日料" → Embedding → [0.82, 0.15, 0.91, 0.33, ...]
                                    ↓ similitud del coseno
"银座寿司之神"  → [0.80, 0.18, 0.89, ...] → 96% similar
"意大利披萨"    → [0.12, 0.85, 0.20, ...] → 31% similar
```

### 5.2 Búsqueda vectorial vs Búsqueda por palabras clave

| Comparación | Búsqueda por palabras clave (LIKE / Índice de texto completo) | Búsqueda vectorial |
|-------------|---------------------------------------------------------------|--------------------|
| Método de búsqueda | Coincidencia exacta de cadenas | Coincidencia por similitud semántica |
| "好吃的日料" | Solo puede encontrar textos que contengan "日料" | Puede encontrar "寿司", "刺身", "居酒屋" |
| Multilingüismo | Necesita procesarse por separado | Comprensión semántica entre idiomas |
| Multimodalidad | Solo texto | Búsqueda unificada de texto, imágenes y audio |

### 5.3 Escenarios típicos

- **RAG (Generación Aumentada por Recuperación)**: proporcionar fragmentos de conocimiento relevantes a los LLM
- **Búsqueda semántica**: comprender la intención del usuario, no solo las palabras clave
- **Búsqueda de imágenes por imagen**: subir una imagen y encontrar imágenes visualmente similares
- **Sistemas de recomendación**: recomendaciones basadas en similitud semántica de contenido

::: tip 💡 Elección de base de datos vectorial
- **Bases de datos vectoriales independientes**: Pinecone, Milvus, Weaviate — especializadas en búsqueda vectorial, máximo rendimiento
- **Extensiones de bases de datos tradicionales**: pgvector (PostgreSQL), Atlas Vector Search (MongoDB) — reducen la complejidad arquitectónica
- **Bibliotecas vectoriales en memoria**: FAISS, Annoy — adecuadas para escenarios de pequeña escala y baja latencia
:::

---

## 6. Guía de decisión: Enfoque de elegir el modelo de datos

| ¿Cómo son tus datos? | Modelo recomendado | Productos representativos |
|-----------------------|-------------------|---------------------------|
| Estructura fija, relaciones claras (pedidos, usuarios) | Relacional | MySQL, PostgreSQL |
| Estructura flexible, muchos niveles de anidamiento (contenido, configuración) | Documental | MongoDB, DynamoDB |
| Relaciones complejas entre entidades, necesidad de recorrido de múltiples saltos | Grafo | Neo4j, Amazon Neptune |
| Escritura ordenada por tiempo, consulta por rango temporal | Serie temporal | InfluxDB, TimescaleDB |
| Datos no estructurados, búsqueda por similitud semántica | Vectorial | Pinecone, Milvus, pgvector |

::: info 🎯 Consejo práctico
Los sistemas modernos suelen ser **multi-modelo**:
- **Negocio principal** en PostgreSQL (relacional)
- **Logs de comportamiento de usuarios** en InfluxDB (serie temporal)
- **Base de conocimiento de IA** en Milvus + pgvector (vectorial)
- **Motor de recomendación** en Neo4j (grafo)

No busques "una base de datos que resuelva todo", sino que cada tipo de dato encuentre su hogar más adecuado.
:::

<DataModelsDemo />
