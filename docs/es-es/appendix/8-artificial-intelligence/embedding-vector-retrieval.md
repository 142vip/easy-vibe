# Principios de Embedding y búsqueda vectorial

::: tip Prólogo
**¿Cómo entiende un ordenador que "el gato y el perro se parecen, pero no se parecen a un coche"?** Para los humanos es sentido común, pero para un ordenador "gato", "perro" y "coche" no son más que tres cadenas de texto sin relación alguna. La tecnología de Embedding es la clave para resolver este problema: convierte el texto en vectores numéricos, permitiendo que el ordenador también entienda la "cercanía y lejanía" semántica.
:::

**¿Qué aprenderás en este artículo?**

Al terminar este capítulo, habrás aprendido:

- **Comprensión intuitiva**: entenderás qué es el Embedding y por qué los vectores de "gato" y "perro" están cerca
- **Cálculo de similitud**: dominarás medidas fundamentales como la similitud coseno y la distancia euclidiana
- **Principios de indexación**: entenderás cómo las bases de datos vectoriales realizan búsquedas en milisegundos entre millones de datos
- **Selección tecnológica**: conocerás las características y escenarios aplicables de las principales bases de datos vectoriales
- **Flujo end-to-end**: dominarás el pipeline completo desde texto hasta vector y búsqueda

| Capítulo | Contenido | Conceptos clave |
|-----|------|---------|
| **Capítulo 1** | Concepto de Embedding | Espacio semántico, representación vectorial |
| **Capítulo 2** | Cálculo de similitud | Similitud coseno, distancia euclidiana |
| **Capítulo 3** | Índices vectoriales | Búsqueda exhaustiva vs ANN |
| **Capítulo 4** | Bases de datos vectoriales | Pinecone, Milvus, Chroma |
| **Capítulo 5** | Pipeline end-to-end | Texto → Vector → Almacenamiento → Consulta |

---

## 0. Panorama general: el puente entre texto y números

En el mundo del procesamiento del lenguaje natural, existe un desafío fundamental: **los ordenadores solo entienden números, no texto**.

El enfoque inicial era asignar un número a cada palabra (codificación One-Hot), por ejemplo "gato"=001, "perro"=010, "coche"=100. Pero esto tiene un problema fatal: **todas las palabras están a la misma distancia entre sí**. La distancia de "gato" a "perro" es exactamente igual que la de "gato" a "coche", lo cual claramente no coincide con nuestra intuición.

La revolución del Embedding consiste en que asigna cada palabra a un **espacio vectorial denso de baja dimensión**, donde las palabras semánticamente cercanas se agrupan naturalmente. En este espacio, "gato" y "perro" están muy cerca, mientras que "coche" está lejos: el ordenador finalmente puede "entender" la semántica.

::: tip El salto de One-Hot a Embedding
- **One-Hot**: dimensión = tamaño del vocabulario (potencialmente decenas de miles), cada vector tiene un solo 1 y el resto son 0, disperso y sin semántica
- **Embedding**: dimensión típicamente 768~1536, cada número tiene significado, denso y rico en información semántica
- **Avance clave**: Word2Vec (2013) demostró que "el significado de una palabra puede definirse por su contexto", inaugurando la era del Embedding
:::

---

## 1. Concepto de Embedding: convertir texto en coordenadas

La idea central del Embedding se resume en una frase: **usar un conjunto de números (un vector) para representar el significado de una palabra o frase**.

Imagina un sistema de coordenadas bidimensional. Colocamos "gato" en (0.2, 0.7), "perro" en (0.3, 0.6) y "coche" en (0.9, 0.1). Verás que las coordenadas de "gato" y "perro" están muy cerca, mientras que "coche" está lejos de ambos. Esta es la intuición del Embedding: **la similitud semántica se convierte en distancia espacial**.

<EmbeddingConceptDemo />

::: tip Las tres propiedades clave del Embedding
1. **Agrupación semántica**: las palabras con significado similar se agrupan automáticamente (animales en un grupo, alimentos en otro, tecnología en otro)
2. **Relaciones analógicas**: las operaciones vectoriales pueden expresar relaciones semánticas, ejemplo clásico: rey - hombre + mujer ≈ reina
3. **Significado de las dimensiones**: cada dimensión codifica implícitamente algún rasgo semántico (como "es animal", "tamaño", "polaridad emocional", etc.)
:::

| Método de codificación | Dimensión | Información semántica | Aplicación típica |
|---------|------|---------|---------|
| One-Hot | Tamaño del vocabulario (~50000) | Ninguna | NLP tradicional |
| Word2Vec | 100~300 | Semántica a nivel de palabra | Similitud de palabras, razonamiento analógico |
| BERT Embedding | 768 | Semántica contextual | Comprensión de frases, QA |
| OpenAI text-embedding-3 | 1536~3072 | Semántica profunda | RAG, búsqueda semántica |

---

## 2. Cálculo de similitud: Enfoque de "cerca" están los vectores

Con la representación vectorial, la siguiente pregunta natural es: **¿cómo medir cuán similares son dos vectores?** Es como medir en un mapa cómo de cerca están dos ciudades: puedes medir la distancia en línea recta o ver si apuntan en la misma dirección.

<VectorSimilarityDemo />

::: tip Dos medidas fundamentales
- **Similitud coseno (Cosine Similarity)**: mide si la **dirección** de dos vectores coincide, rango [-1, 1]. 1 significa dirección idéntica, 0 significa ortogonal (sin relación), -1 significa completamente opuesta. Es la opción preferida para comparación semántica de texto, porque no se ve afectada por la longitud del vector.
- **Distancia euclidiana (Euclidean Distance)**: mide la **distancia en línea recta** entre los extremos de dos vectores, rango [0, ∞). 0 significa completamente superpuestos, cuanto mayor el valor menos similares. Adecuada para escenarios donde importa la "magnitud absoluta".
:::

| Métrica | Intuición de la fórmula | Rango | Escenario aplicable |
|---------|---------|------|---------|
| Similitud coseno | Mira la dirección, ignora la longitud | [-1, 1] | Búsqueda semántica de texto, sistemas de recomendación |
| Distancia euclidiana | Mira la distancia en línea recta | [0, ∞) | Características de imágenes, análisis de clustering |
| Producto escalar | Dirección × longitud | (-∞, +∞) | Cálculo rápido para vectores normalizados |
| Distancia Manhattan | Distancia recorrida por los ejes | [0, ∞) | Vectores dispersos de alta dimensión |

---

## 3. Índices vectoriales: Enfoque de buscar en milisegundos entre millones de vectores

Supón que tienes 1 millón de documentos, cada uno convertido en un vector de 1536 dimensiones. Un usuario hace una pregunta y necesitas encontrar los 10 más similares. El método más directo es calcular la similitud uno por uno, pero eso significa hacer 1 millón de operaciones vectoriales de 1536 dimensiones: demasiado lento.

Este es el problema que resuelven los **índices vectoriales**: **cambiar espacio por tiempo, construyendo estructuras de índice mediante preprocesamiento para reducir la velocidad de búsqueda de O(n) a aproximadamente O(log n)**.

<VectorIndexDemo />

::: tip Búsqueda exhaustiva vs Búsqueda aproximada del vecino más cercano (ANN)
- **Búsqueda exhaustiva (Flat)**: comparar uno por uno, 100% preciso pero lento. Adecuado para conjuntos de datos pequeños (< 100K).
- **IVF (Índice de archivo invertido)**: primero divide el espacio vectorial en varias regiones (clustering), durante la consulta solo busca en las regiones más cercanas. Es como dividir una biblioteca por temas y solo buscar en las secciones relevantes.
- **HNSW (Grafo pequeño mundo navegable jerárquico)**: construye una estructura de grafo multicapa, navegando de granularidad gruesa a fina. Es como mirar primero el mapamundi para ubicar el país, luego el mapa provincial y finalmente el mapa de calles.
- **PQ (Cuantización de producto)**: comprime vectores de alta dimensión en códigos cortos, sacrificando un poco de precisión por un gran ahorro de memoria. Adecuado para conjuntos de datos muy grandes.
:::

| Tipo de índice | Velocidad de construcción | Velocidad de consulta | Recall | Uso de memoria | Escala aplicable |
|---------|---------|---------|-------|---------|---------|
| Flat (exhaustivo) | No requiere | Lento | 100% | Alto | < 100K |
| IVF | Medio | Rápido | 95%+ | Medio | 100K~10M |
| HNSW | Lento | Muy rápido | 99%+ | Alto | 100K~10M |
| PQ | Medio | Rápido | 90%+ | Muy bajo | > 10M |
| IVF-PQ | Medio | Rápido | 92%+ | Bajo | > 100M |

---

## 4. Bases de datos vectoriales: motores de almacenamiento diseñados para vectores

Con los vectores y los algoritmos de índice, necesitas un lugar para almacenarlos y gestionarlos. Las bases de datos tradicionales (MySQL, PostgreSQL) manejan bien datos estructurados, pero no pueden con las búsquedas de similitud en vectores de alta dimensión. Las **bases de datos vectoriales** están diseñadas específicamente para este escenario.

<VectorDatabaseDemo />

::: tip Capacidades fundamentales de las bases de datos vectoriales
1. **Almacenamiento eficiente**: formato de almacenamiento optimizado para vectores de punto flotante de alta dimensión
2. **Búsqueda ANN**: múltiples algoritmos de índice de vecino más cercano aproximado integrados (HNSW, IVF, etc.)
3. **Filtrado por metadatos**: permite filtrar por etiquetas, tiempo, etc. mientras se realiza la búsqueda vectorial
4. **Actualización en tiempo real**: permite añadir, modificar y eliminar vectores dinámicamente sin reconstruir todo el índice
5. **Escalado horizontal**: arquitectura distribuida que soporta miles de millones de vectores
:::

| Base de datos | Tipo | Características | Escenario aplicable |
|-------|------|------|---------|
| Pinecone | Servicio cloud totalmente gestionado | Cero operaciones, listo para usar | Prototipado rápido, producción pequeña/mediana |
| Milvus | Open source distribuido | Alto rendimiento, escalable | Entornos de producción a gran escala |
| Chroma | Open source ligero | Integrable, API sencilla | Desarrollo local, proyectos pequeños |
| Weaviate | Open source cloud native | Vectorización integrada, GraphQL | Escenarios que necesitan vectorización automática |
| Qdrant | Open source alto rendimiento | Implementado en Rust, filtrado potente | Escenarios que necesitan filtrado complejo |
| pgvector | Extensión de PostgreSQL | Reutiliza infraestructura PG existente | Equipos que ya usan PostgreSQL |

---

## 5. Pipeline end-to-end: el flujo completo desde texto hasta búsqueda

Una vez comprendidos todos los componentes, vamos a conectarlos para ver cómo funciona un sistema completo de búsqueda vectorial.

Todo el flujo se divide en dos líneas: **escritura offline** (convertir documentos en vectores y almacenarlos) y **consulta online** (convertir la pregunta en vector para buscar).

<EmbeddingPipelineDemo />

::: tip Flujo de escritura offline
1. **Carga de documentos**: leer texto original de diversas fuentes (PDF, páginas web, bases de datos)
2. **Preprocesamiento de texto**: limpiar, eliminar ruido, normalizar (quitar etiquetas HTML, caracteres especiales, etc.)
3. **Chunking de texto**: dividir el texto largo en fragmentos de tamaño adecuado según la estrategia (200~500 tokens)
4. **Vectorización**: llamar al modelo de embedding (como OpenAI text-embedding-3-small) para convertir cada fragmento en vector
5. **Almacenar en la base de datos vectorial**: escribir el vector junto con el texto original y los metadatos en la base de datos
:::

::: tip Flujo de consulta online
1. **Recibir consulta**: el usuario introduce una pregunta en lenguaje natural
2. **Vectorizar la consulta**: usar el mismo modelo de embedding para convertir la pregunta en vector
3. **Búsqueda de similitud**: buscar los Top-K fragmentos de documento más similares en la base de datos vectorial
4. **Postprocesamiento**: reranking, desduplicación, filtrado por metadatos
5. **Devolver resultados**: devolver los fragmentos de documento más relevantes al llamante (o pasarlos al LLM para generar la respuesta)
:::

| Paso | Elección clave | Recomendación |
|------|---------|---------|
| Modelo de embedding | Precisión vs coste vs velocidad | OpenAI text-embedding-3-small (mejor relación calidad-precio) |
| Estrategia de chunking | Granularidad vs integridad semántica | Chunking recursivo, 200~500 tokens |
| Base de datos vectorial | Escala vs coste operativo | Proyectos pequeños: Chroma, producción: Pinecone/Milvus |
| Métrica de similitud | Semántica vs precisión | Similitud coseno (preferida para texto) |
| Valor Top-K | Recall vs ruido | Recuperar primero 20, después de reranking tomar Top 5 |

---

## Resumen

El Embedding y la búsqueda vectorial son el puente que conecta el "lenguaje humano" con la "comprensión de la máquina", y constituyen la infraestructura de aplicaciones de IA como RAG, búsqueda semántica y sistemas de recomendación.

Puntos clave de este capítulo:

1. **La esencia del Embedding**: mapear texto a un espacio vectorial de alta dimensión, convirtiendo la similitud semántica en distancia espacial
2. **Métricas de similitud**: la similitud coseno se centra en la dirección (ideal para texto), la distancia euclidiana en la distancia absoluta
3. **El índice es la clave del rendimiento**: HNSW e IVF reducen la búsqueda entre millones de vectores a milisegundos
4. **Selección de base de datos vectorial**: proyectos pequeños con Chroma/pgvector, entornos de producción con Pinecone/Milvus
5. **Pensamiento end-to-end**: desde la carga del documento hasta la búsqueda final, cada decisión afecta al resultado final

## Lecturas adicionales

- [Documentación de OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings) - Guía oficial de uso de modelos de embedding
- [Pinecone Learning Center](https://www.pinecone.io/learn/) - Tutoriales sistemáticos sobre bases de datos vectoriales y búsqueda
- [Wiki de FAISS](https://github.com/facebookresearch/faiss/wiki) - Documentación de la biblioteca de búsqueda vectorial open source de Facebook
- [Paper original de Word2Vec](https://arxiv.org/abs/1301.3781) - El trabajo pionero que inauguró la era del Embedding
- [Ranking MTEB](https://huggingface.co/spaces/mteb/leaderboard) - Ranking comparativo de rendimiento de modelos de embedding