# Principios de los motores de búsqueda

::: tip Prólogo
**Buscas "vestido rojo" en Taobao y en 0.1 segundos encuentras el resultado más relevante entre miles de millones de productos. ¿Cómo es posible?** Los motores de búsqueda son una de las infraestructuras más esenciales de Internet. Desde Google hasta la búsqueda interna de un e-commerce, su principio fundamental es el mismo: índice invertido + ordenación por relevancia.
:::

**¿Qué aprenderás en este artículo?**

Al terminar este capítulo, habrás aprendido:

- **Índice invertido**: comprenderás la estructura de datos principal de los motores de búsqueda
- **Tokenización**: conocerás los desafíos de la segmentación de texto en chino y las soluciones más comunes
- **Ordenación por relevancia**: dominarás los fundamentos de TF-IDF y BM25
- **Elasticsearch**: entenderás la arquitectura y los casos de uso del motor de búsqueda más popular
- **Optimización de búsqueda**: dominarás funcionalidades prácticas como sinónimos, corrección ortográfica y resaltado

| Capítulo | Contenido | Conceptos clave |
|-----|------|---------|
| **Capítulo 1** | Índice invertido | Índice directo vs índice invertido |
| **Capítulo 2** | Tokenización y análisis | Segmentación de texto en chino, stop words, stemming |
| **Capítulo 3** | Ordenación por relevancia | TF-IDF, BM25 |
| **Capítulo 4** | Elasticsearch | Arquitectura distribuida, shards, réplicas |
| **Capítulo 5** | Optimización de búsqueda | Sinónimos, corrección ortográfica, autocompletado |

---

## 0. Panorama general: Selección de la esencia de la búsqueda

La esencia de la búsqueda es un problema de **recuperación de información (Information Retrieval)**: dado un query, encontrar los documentos más relevantes entre una enorme colección y devolverlos ordenados por relevancia.

Este proceso se divide en dos fases:

- **Fase de indexación (offline)**: procesar todos los documentos por adelantado para construir una estructura de búsqueda eficiente
- **Fase de consulta (online)**: cuando el usuario introduce palabras clave, encontrar rápidamente los documentos coincidentes y ordenarlos

::: tip ¿Por qué no usar LIKE en una base de datos?
`SELECT * FROM products WHERE name LIKE '%vestido rojo%'` parece que puede buscar, pero requiere un **escaneo completo de la tabla**: revisar cada fila una por una. Cuando los datos alcanzan millones de registros, esta consulta se vuelve demasiado lenta para ser utilizable. El índice invertido convierte esta operación O(n) en una búsqueda O(1).
:::

---

## 1. Índice invertido: el "corazón" del motor de búsqueda

Las bases de datos tradicionales usan un **índice directo**: del ID del documento se obtiene su contenido. En cambio, los motores de búsqueda usan un **índice invertido**: de la palabra clave se obtiene la lista de documentos que la contienen.

<InvertedIndexDemo />

| Tipo de índice | Dirección | Modo de búsqueda | Caso de uso |
|---------|------|---------|---------|
| Índice directo | Documento → Contenido | Conoces el ID, buscas el contenido | Consultas por clave primaria en BD |
| Índice invertido | Palabra clave → Lista de documentos | Conoces la palabra clave, buscas el documento | Búsqueda de texto completo |

::: tip Proceso de construcción del índice invertido
1. **Recolección de documentos**: obtener todos los documentos que deben ser indexados
2. **Tokenización**: dividir los documentos en tokens individuales
3. **Construcción del mapeo**: registrar en qué documentos aparece cada token (junto con su posición, frecuencia, etc.)
4. **Almacenamiento persistente**: escribir el índice en disco para permitir búsquedas rápidas
:::

---

## 2. Tokenización y análisis de texto

La tokenización es el primer paso del motor de búsqueda y también el mayor desafío de la búsqueda en chino. En inglés las palabras se separan naturalmente por espacios, pero el chino no tiene delimitadores: "乒乓球拍卖了" puede segmentarse como "ping pong/subasta/terminó" o "ping pong/raqueta/vender/terminó".

| Método de tokenización | Descripción | Ejemplo |
|---------|------|------|
| Tokenización estándar | Segmentación por espacios y puntuación (inglés) | "hello world" → ["hello", "world"] |
| Tokenización china | Segmentación basada en diccionario o modelos | "搜索引擎" → ["搜索", "引擎"] |
| N-gram | Segmentación por ventana deslizante de longitud fija | "搜索" → ["搜索", "索引"] |
| Diccionario personalizado | Añadir vocabulario específico del negocio | "iPhone16ProMax" como un solo término |

::: tip Pipeline de análisis de texto
La tokenización es solo un paso del análisis de texto. El pipeline completo incluye:
1. **Filtrado de caracteres**: eliminar etiquetas HTML y caracteres especiales
2. **Tokenización**: dividir el texto en tokens
3. **Filtrado de stop words**: eliminar palabras frecuentes sin significado como "de", "la", "es"
4. **Expansión de sinónimos**: expandir "móvil" a "móvil, teléfono, celular"
5. **Stemming**: reducir "running" a "run" (en inglés)
:::

---

## 3. Ordenación por relevancia: qué resultado es el más "relevante"

Encontrar los documentos coincidentes es solo el primer paso. Lo más importante es la **ordenación**: colocar los resultados más relevantes al principio.

| Algoritmo | Principio | Características |
|------|------|------|
| TF-IDF | Frecuencia de término (TF) × Frecuencia inversa de documento (IDF) | Algoritmo clásico, simple y efectivo |
| BM25 | Versión mejorada de TF-IDF con normalización por longitud de documento | Algoritmo por defecto de Elasticsearch |
| Búsqueda vectorial | Convierte documentos y consultas en vectores, calcula la similitud coseno | Soporta búsqueda semántica |

::: tip Comprensión intuitiva de TF-IDF
- **TF (frecuencia de término)**: cuantas más veces aparece un término en un documento, más probable es que ese documento sea relevante para ese término
- **IDF (frecuencia inversa de documento)**: cuanto menos documentos contengan un término, mayor es su poder discriminativo
- "de" aparece en todos los documentos (IDF bajo), por lo que buscar "de" no tiene sentido
- "Elasticsearch" solo aparece en pocos documentos (IDF alto), por lo que buscarlo permite una localización precisa
:::

---

## 4. Elasticsearch: el motor de búsqueda más popular

Elasticsearch es actualmente el motor de búsqueda open source más popular, construido sobre Apache Lucene, que ofrece capacidades de búsqueda de texto completo distribuidas mediante una API RESTful.

| Concepto | Descripción |
|------|------|
| Index | Similar a una "tabla" de base de datos, almacena documentos del mismo tipo |
| Document | Un registro, en formato JSON |
| Shard | Fragmento, divide el índice entre múltiples nodos |
| Replica | Réplica, proporciona alta disponibilidad y escalado de lectura |
| Mapping | Definición de tipos de campos, similar al Schema de una base de datos |
| Analyzer | Analizador de texto, define las reglas de tokenización |

::: tip ES vs Base de datos
Elasticsearch no sustituye a la base de datos, sino que actúa como capa de búsqueda complementaria. Arquitectura típica: los datos se escriben en la base de datos → se sincronizan con ES → las consultas de búsqueda van a ES → las consultas de detalle van a la base de datos.
:::

---

## 5. Optimización de búsqueda: haciendo la búsqueda más "inteligente"

| Técnica de optimización | Descripción | Efecto |
|---------|------|------|
| Sinónimos | "móvil" también encuentra "teléfono" | Mejora el recall |
| Corrección ortográfica | "iphoen" se corrige automáticamente a "iphone" | Tolerancia a errores |
| Autocompletado | Al escribir "man" sugiere "manzana" | Mejora la experiencia |
| Resaltado | Las palabras coincidentes se marcan en los resultados | Visualización intuitiva |
| Ajuste de pesos | La coincidencia en el título pesa más que en el contenido | Mejora la precisión |
| Filtrado y agregación | Filtrar por rango de precio, marca | Reduce el alcance |

---

## Resumen

Los motores de búsqueda son una infraestructura esencial para las aplicaciones web. Comprender los tres conceptos fundamentales —índice invertido, tokenización y ordenación por relevancia— es dominar la esencia de los motores de búsqueda.

Puntos clave de este capítulo:

1. **Índice invertido**: el mapeo inverso de palabras clave a documentos, la estructura de datos central del motor de búsqueda
2. **La tokenización es la base**: la segmentación de texto en chino es clave para la calidad de la búsqueda, requiere elegir el tokenizador adecuado
3. **Ordenación BM25**: puntuación de relevancia basada en frecuencia de término y frecuencia de documento, es el algoritmo por defecto de ES
4. **Arquitectura de ES**: shards + réplicas para lograr distribución y alta disponibilidad
5. **Optimización de búsqueda**: sinónimos, corrección ortográfica y autocompletado hacen la búsqueda más inteligente

## Lecturas adicionales

- [Documentación oficial de Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) - La referencia más autorizada de ES
- [Guía definitiva de Elasticsearch](https://www.elastic.co/guide/cn/elasticsearch/guide/current/index.html) - Guía introductoria en chino
- [Apache Lucene](https://lucene.apache.org/) - La biblioteca de motor de búsqueda subyacente de ES
- [MeiliSearch](https://www.meilisearch.com/) - Motor de búsqueda ligero, adecuado para proyectos pequeños y medianos
- [Typesense](https://typesense.org/) - Motor de búsqueda open source en tiempo real