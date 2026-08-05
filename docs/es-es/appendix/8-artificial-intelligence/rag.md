# Principios de RAG: generación aumentada por recuperación

::: tip Prólogo
**¿Por qué ChatGPT a veces "alucina" con tanta seguridad?** El conocimiento de los grandes modelos de lenguaje proviene de sus datos de entrenamiento, pero estos datos tienen una fecha de corte y no incluyen los documentos internos de tu empresa. RAG (Retrieval-Augmented Generation, Generación Aumentada por Recuperación) es la tecnología clave para resolver este problema: permite que la IA "consulte fuentes" antes de responder.
:::

**¿Qué aprenderás en este artículo?**

Al terminar este capítulo, habrás aprendido:

- **Comprensión de conceptos fundamentales**: entenderás qué es RAG, por qué es necesario y cómo resuelve el problema de las "alucinaciones" de los grandes modelos
- **Conocimiento del flujo completo**: dominarás el proceso end-to-end desde la carga de documentos, chunking, vectorización hasta la recuperación y generación
- **Capacidad de selección tecnológica**: conocerás las ventajas y desventajas de diferentes estrategias de chunking y métodos de recuperación, pudiendo elegir según el escenario
- **Visión de evolución arquitectónica**: entenderás la evolución de RAG desde Naive hasta Advanced y Modular
- **Capacidad de decisión práctica**: sabrás cuándo usar RAG y cuándo usar fine-tuning

| Capítulo | Contenido | Conceptos clave |
|-----|------|---------|
| **Capítulo 1** | Flujo básico de RAG | Tres fases: indexación, recuperación, generación |
| **Capítulo 2** | Estrategias de chunking de texto | Chunking fijo, semántico, recursivo |
| **Capítulo 3** | Técnicas de recuperación | Recuperación vectorial, por palabras clave, híbrida |
| **Capítulo 4** | Evolución de la arquitectura | Naive RAG → Advanced RAG → Modular RAG |
| **Capítulo 5** | RAG vs Fine-tuning | Comparación de escenarios aplicables |

---

## 0. Panorama general: Motivación de grandes modelos necesitan "consultar fuentes"

Imagina que eres un profesor erudito que ha leído innumerables libros. Pero si alguien te pregunta "¿cuáles fueron las ventas de la empresa ayer?", seguro que no puedes responder, porque esa información no está en los libros que has leído.

Los grandes modelos de lenguaje enfrentan el mismo dilema:

- **Conocimiento con fecha de corte**: los datos de entrenamiento de GPT-4 tienen una fecha límite, no sabe lo que ocurrió después
- **Falta de conocimiento privado**: los documentos internos, manuales de producto y datos de clientes de tu empresa, el modelo nunca los ha visto
- **Tendencia a alucinar**: cuando el modelo no está seguro de la respuesta, tiende a "inventar" una respuesta que parezca razonable

::: tip La idea central de RAG
La solución de RAG es muy intuitiva: **antes de dejar que el modelo responda, ayúdalo a encontrar materiales de referencia relevantes**. Es como un examen a libro abierto: no necesitas recordar todo el conocimiento, solo necesitas saber dónde y cómo encontrarlo.

RAG = Recuperación (Retrieval) + Aumento (Augmented) + Generación (Generation)
:::

---

## 1. Flujo básico de RAG: indexación, recuperación, generación

El flujo de trabajo de RAG se divide en dos fases: **indexación offline** y **consulta online**.

La fase offline es como el trabajo de catalogación de una biblioteca: clasificar, numerar y colocar todos los libros en estanterías para facilitar su búsqueda posterior. La fase online es el proceso de un lector que viene a la biblioteca a consultar materiales: encontrar libros relevantes según la pregunta y luego sintetizar la información para dar una respuesta.

<RAGPipelineDemo />

::: tip Las tres fases principales
1. **Fase de indexación (Indexing)**: cargar, limpiar y dividir los documentos originales en chunks, luego convertirlos en vectores mediante un modelo de embedding y almacenarlos en una base de datos vectorial. Es un trabajo preparatorio único.
2. **Fase de recuperación (Retrieval)**: cuando el usuario hace una pregunta, esta también se convierte en vector y se buscan los fragmentos de documento más similares en la base de datos vectorial.
3. **Fase de generación (Generation)**: los fragmentos de documento recuperados y la pregunta del usuario se combinan en un Prompt que se envía al LLM para generar la respuesta final.
:::

| Fase | Entrada | Salida | Tecnología clave |
|------|------|------|---------|
| Indexación | Documentos originales | Base de datos vectorial | Chunking de texto, modelo de embedding |
| Recuperación | Pregunta del usuario | Top-K fragmentos de documento | Similitud vectorial, reranking |
| Generación | Pregunta + contexto | Respuesta final | Ingeniería de prompts, LLM |

---

## 2. Chunking de texto: meter un elefante en la nevera

El chunking de texto es el aspecto más infravalorado de RAG, pero el que más impacto tiene en los resultados. ¿Por qué es necesario dividir? Porque la ventana de contexto de los grandes modelos es limitada, no podemos meter un libro entero. Y lo más importante: **la calidad del chunking determina directamente la calidad de la recuperación**.

Imagina que buscas un concepto específico en un libro de la biblioteca. Si el libro entero es un solo "chunk", aunque lo recuperes no sirve de nada: todavía tienes que hojear todo el libro. Pero si está dividido por capítulos o incluso párrafos, puedes localizar con precisión lo que necesitas.

<ChunkingStrategyDemo />

::: tip Elección de la estrategia de chunking
- **Chunking de tamaño fijo**: dividir por número de caracteres o tokens, simple pero puede cortar el significado
- **Chunking recursivo**: dividir primero por párrafos, si el párrafo es muy largo dividir por frases, mantiene la integridad semántica
- **Chunking semántico**: usar el modelo de embedding para detectar fronteras semánticas, dividir donde haya cambios bruscos de similitud
- **Chunking por estructura del documento**: aprovechar títulos Markdown, etiquetas HTML y otra información estructural

No existe una estrategia de chunking "mejor" universal, solo la más adecuada para tus datos. Se recomienda empezar con chunking recursivo, tamaño de chunk de 200-500 tokens, solapamiento del 10-20%.
:::

---

## 3. Técnicas de recuperación: Enfoque para encontrar el contenido más relevante

Una vez completado el chunking, la siguiente pregunta clave es: **el usuario hace una pregunta, ¿cómo encontrar los fragmentos más relevantes entre miles de documentos?**

Es como buscar un libro en una biblioteca enorme. Puedes buscar por palabras clave del título (recuperación por palabras clave), o describir lo que quieres para que el bibliotecario te ayude a encontrarlo (recuperación semántica). La mejor opción es combinar ambos (recuperación híbrida).

<RetrievalDemo />

| Método de recuperación | Principio | Ventajas | Desventajas |
|---------|------|------|------|
| Por palabras clave (BM25) | Basado en frecuencia de término y frecuencia inversa de documento | Coincidencia exacta, rápido | No entiende semántica, falla con sinónimos |
| Vectorial | Basado en similitud coseno de vectores de embedding | Entiende semántica, soporta coincidencia difusa | Insensible a nombres propios |
| Híbrida | Fusiona resultados de palabras clave y vectoriales | Equilibra precisión y semántica | Requiere ajustar pesos, mayor complejidad |

::: tip Reranking
Después de recuperar los documentos candidatos, normalmente se necesita un paso de "reranking". La recuperación inicial busca recall (no omitir nada relevante), el reranking busca precisión (colocar lo más relevante al principio). Los modelos de reranking más comunes son Cohere Rerank, BGE Reranker, etc., que usan cross-encoders para puntuar finamente los pares query-document.
:::

---

## 4. Evolución de la arquitectura: de lo simple a lo inteligente

La tecnología RAG ha experimentado tres generaciones de evolución en apenas dos años, cada una resolviendo los puntos débiles de la anterior.

<RAGArchitectureDemo />

::: tip Comparación de las tres generaciones de RAG
- **Naive RAG (2023)**: el flujo más básico "indexar → recuperar → generar", implementación simple pero resultados limitados. Problemas: calidad de recuperación inestable, no maneja consultas complejas, tiende a introducir contexto ruidoso.
- **Advanced RAG (2024)**: añade sobre Naive RAG optimizaciones como reescritura de consultas, recuperación híbrida, reranking, compresión de contexto, mejorando significativamente la precisión de recuperación y la calidad de generación.
- **Modular RAG (2025)**: descompone RAG en módulos intercambiables, soportando capacidades avanzadas como enrutamiento, recuperación adaptativa y auto-reflexión. Puede seleccionar dinámicamente el flujo de procesamiento óptimo según el tipo de consulta.
:::

---

## 5. RAG vs Fine-tuning: Selección de elegir

Cuando quieres que un gran modelo domine conocimiento de un dominio específico, normalmente hay dos caminos: RAG y fine-tuning. No son mutuamente excluyentes, sino complementarios.

Usando una analogía: **el fine-tuning es como enviar a un estudiante a clases particulares**, interiorizando el conocimiento en el cerebro; **RAG es como darle al estudiante libros de referencia**, que puede consultar durante el examen. Cada método tiene sus ventajas, la clave está en tus necesidades específicas.

<RAGvsFineTuningDemo />

| Dimensión | RAG | Fine-tuning |
|------|-----|------|
| Actualización de conocimiento | En tiempo real, solo hay que actualizar documentos | Requiere reentrenamiento |
| Coste | Bajo (no requiere GPU para entrenar) | Alto (requiere recursos de entrenamiento) |
| Explicabilidad | Alta (se puede rastrear la fuente) | Baja (conocimiento internalizado en los pesos) |
| Escenarios aplicables | QA sobre base de conocimiento, recuperación documental | Transferencia de estilo, optimización para tareas específicas |
| Control de alucinaciones | Bueno (tiene referencias) | Regular (aún puede alucinar) |

::: tip Recomendación práctica
En la mayoría de los escenarios, **prueba primero RAG**. Las ventajas de RAG: no requiere entrenamiento, el conocimiento se actualiza en tiempo real, las respuestas tienen fuentes rastreables. Solo cuando necesites cambiar el "patrón de comportamiento" del modelo (como formato de salida, estilo de lenguaje, modo de razonamiento), considera el fine-tuning. La solución más potente suele ser la combinación de **RAG + fine-tuning**.
:::

---

## Resumen

RAG es una de las tecnologías más prácticas para hacer que los grandes modelos "aterricen" en aplicaciones reales. Su valor principal: hacer que las respuestas del modelo sean verificables, que el conocimiento se actualice en tiempo real y que las alucinaciones se puedan controlar eficazmente.

Puntos clave de este capítulo:

1. **El problema central que resuelve RAG**: conocimiento desactualizado del modelo, falta de datos privados, tendencia a alucinar
2. **Flujo de tres fases**: indexación (preparación offline) → recuperación (búsqueda online) → generación (respuesta sintetizada)
3. **El chunking es la base**: la calidad del chunking determina directamente la calidad de la recuperación, elegir la estrategia adecuada es crucial
4. **La recuperación es clave**: recuperación híbrida + reranking es actualmente la combinación más efectiva
5. **La arquitectura evoluciona**: de Naive RAG a Modular RAG, el sistema es cada vez más inteligente y flexible
6. **RAG y fine-tuning son complementarios**: en la mayoría de casos prueba primero RAG, cuando necesites cambiar el comportamiento del modelo considera el fine-tuning

## Lecturas adicionales

- [Tutorial de RAG de LangChain](https://python.langchain.com/docs/tutorials/rag/) - Guía práctica del framework RAG más popular
- [Documentación de LlamaIndex](https://docs.llamaindex.ai/) - Framework especializado en RAG con ricos conectores de datos
- [Paper de RAG Survey](https://arxiv.org/abs/2312.10997) - Revisión completa de tecnologías RAG
- [Estrategias de Chunking](https://www.pinecone.io/learn/chunking-strategies/) - Explicación detallada de estrategias de chunking por Pinecone
- [Comparación de bases de datos vectoriales](https://superlinked.com/vector-db-comparison) - Comparativa funcional de las principales bases de datos vectoriales