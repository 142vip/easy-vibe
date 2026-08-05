# Introducción al diseño de aplicaciones nativas de IA

::: tip Prólogo
**¿Por qué algunos productos de IA impresionan mientras que otros son solo un "wrapper de ChatGPT"?** La diferencia no está en la potencia del modelo utilizado, sino en si el producto se ha diseñado desde cero en torno a las características de la IA. Las aplicaciones nativas de IA no consisten en "añadir un chat" a una aplicación tradicional, sino en repensar por completo la interacción del usuario, la arquitectura del sistema y la lógica del producto con un nuevo paradigma.
:::

**¿Qué aprenderás en este artículo?**

Al terminar este capítulo, habrás aprendido:

- **Conciencia del paradigma**: entenderás las diferencias esenciales entre las aplicaciones nativas de IA y las aplicaciones tradicionales
- **Principios de diseño**: dominarás los principios fundamentales del diseño de productos nativos de IA
- **Ingeniería de prompts**: conocerás cómo diseñar prompts de alta calidad para potenciar las capacidades de la IA
- **Patrones de interacción**: reconocerás los nuevos paradigmas de interacción de usuario en la era de la IA
- **Pensamiento arquitectónico**: entenderás el flujo de procesamiento de peticiones y la arquitectura del sistema de las aplicaciones de IA

| Capítulo | Contenido | Conceptos clave |
|-----|------|---------|
| **Capítulo 1** | Comparación de arquitecturas | Aplicación tradicional vs aplicación nativa de IA |
| **Capítulo 2** | Principios de diseño | Mentalidad AI-First, diseño para la incertidumbre |
| **Capítulo 3** | Ingeniería de prompts | System prompt, diseño de plantillas |
| **Capítulo 4** | Patrones de interacción | Streaming, multimodal, Agent |
| **Capítulo 5** | Flujo de peticiones | Ciclo de vida completo de una aplicación de IA |

---

## 0. Panorama general: de "añadir IA" a "IA nativa"

En los últimos años, la trayectoria de muchos productos hacia la IA ha sido así: tienes una aplicación existente y en algún rincón añades un botón de "Asistente IA". Esto es como poner un motor a un carruaje: funciona, pero está muy lejos de diseñar un coche desde cero.

**Las aplicaciones nativas de IA** representan una mentalidad de producto completamente nueva: desde la primera línea de código, la IA se diseña como capacidad central, no como una funcionalidad añadida a posteriori.

::: tip Aplicación tradicional vs aplicación nativa de IA
- **Aplicación tradicional**: acción del usuario → lógica determinista → resultado determinista. Cada vez que haces clic en "Enviar pedido", el flujo es exactamente igual.
- **Aplicación nativa de IA**: intención del usuario → comprensión de la IA → resultado probabilístico. La misma pregunta puede tener respuestas ligeramente diferentes cada vez.
- **Transformación central**: de "escribir reglas" a "describir intenciones", de lo "determinista" a lo "probabilístico", de la "interfaz de operación" a la "interfaz de conversación".
:::

---

## 1. Comparación de arquitecturas: dos mundos completamente diferentes

La arquitectura de las aplicaciones tradicionales sigue el modelo "petición-respuesta": el usuario hace clic en un botón, el backend ejecuta lógica determinista y devuelve un resultado determinista. Todo el proceso es predecible, testeable y reproducible.

Las aplicaciones nativas de IA introducen un nuevo actor: el **gran modelo de lenguaje**. Actúa como una "capa intermedia inteligente" que recibe entradas en lenguaje natural y produce salidas en lenguaje natural. Esto supone un cambio arquitectónico fundamental.

<AINativeArchDemo />

| Dimensión | Aplicación tradicional | Aplicación nativa de IA |
|------|---------|------------|
| Modo de entrada | Formularios, botones, desplegables | Lenguaje natural, imágenes, voz |
| Lógica de procesamiento | if-else, motores de reglas | Razonamiento LLM, dirigido por prompts |
| Características de salida | Determinista, reproducible | Probabilística, puede variar cada vez |
| Latencia | Milisegundos | Segundos (requiere streaming) |
| Gestión de errores | Códigos de error explícitos | Alucinaciones, rechazo de respuesta, respuestas fuera de contexto |
| Modelo de costes | Recursos de computación fijos | Facturación por token, costes muy variables |

::: tip Las tres fases de evolución arquitectónica
1. **Mejorada con IA**: incorporar funcionalidades de IA en aplicaciones existentes (autocompletado, recomendaciones inteligentes)
2. **Colaborativa con IA**: la IA como modo de interacción principal, pero con UI tradicional como respaldo (Notion AI, GitHub Copilot)
3. **Nativa de IA**: todo el producto se construye alrededor de la IA, sin IA el producto no tendría sentido (ChatGPT, Cursor, Midjourney)
:::

---

## 2. Principios de diseño: la "constitución" del producto nativo de IA

Diseñar aplicaciones nativas de IA no puede copiar las ideas de diseño de software tradicional. La naturaleza probabilística, la latencia y la imprevisibilidad de la IA exigen establecer un conjunto completamente nuevo de principios de diseño.

<AIDesignPrincipleDemo />

::: tip Cinco principios fundamentales de diseño
1. **Aceptar la incertidumbre**: la salida de la IA no es 100% fiable, el diseño del producto debe contemplar que "la IA puede equivocarse". Proporcionar mecanismos de edición, reintento y feedback para que el usuario siempre tenga el control.
2. **Confianza progresiva**: no dejar que la IA tome decisiones de alto riesgo desde el principio. Establecer primero la confianza del usuario en escenarios de bajo riesgo, luego ampliar gradualmente la autonomía de la IA.
3. **Transparencia y explicabilidad**: que el usuario sepa qué está haciendo la IA y por qué. Mostrar el proceso de razonamiento, citar fuentes, indicar el nivel de confianza.
4. **Colaboración humano-IA**: la IA no sustituye a las personas, las potencia. El mejor diseño es que la IA haga el borrador y la persona haga la revisión final.
5. **Degradación elegante**: cuando el servicio de IA no está disponible o los resultados no son ideales, el producto sigue siendo utilizable. Siempre tener un Plan B.
:::

---

## 3. Ingeniería de prompts: el "lenguaje de programación" de las aplicaciones de IA

En las aplicaciones tradicionales, usas código para decirle al ordenador qué hacer. En las aplicaciones nativas de IA, usas prompts para decirle al modelo qué hacer. **El prompt es el lenguaje de programación de la era de la IA**: bien escrito, la IA impresiona; mal escrito, la IA desvaría.

<PromptDesignDemo />

::: tip La estructura de cuatro capas del diseño de prompts
1. **System Prompt**: define el rol de la IA, los límites de sus capacidades y las normas de comportamiento. Es una instrucción de nivel "constitución", invisible para el usuario pero siempre activa.
2. **Inyección de contexto (Context)**: documentos relevantes recuperados mediante RAG, historial del usuario, etc., que proporcionan a la IA la información de fondo necesaria para responder.
3. **Entrada del usuario (User Message)**: la pregunta o instrucción real del usuario.
4. **Restricción de formato de salida (Format)**: especifica el formato de salida de la IA (JSON, Markdown, plantilla específica) para asegurar que el resultado pueda ser procesado por el programa.
:::

| Técnica de prompt | Descripción | Efecto |
|------------|------|------|
| Asignación de rol | "Eres un ingeniero frontend senior" | Mejora la calidad de respuesta en dominios específicos |
| Ejemplos few-shot | Proporcionar 2-3 ejemplos de entrada/salida | Ayuda al modelo a entender el formato y estilo esperado |
| Cadena de pensamiento (CoT) | "Piensa paso a paso" | Mejora la precisión en razonamientos complejos |
| Restricción de salida | "Responde en formato JSON" | Asegura que la salida sea procesable por el programa |
| Instrucción negativa | "No inventes información incierta" | Reduce alucinaciones e información errónea |

---

## 4. Patrones de interacción: la experiencia de usuario en la era de la IA

Las aplicaciones nativas de IA han generado una serie de patrones de interacción completamente nuevos. La interacción en aplicaciones tradicionales es "clic-esperar-ver", mientras que en aplicaciones de IA se parece más a "dialogar-observar-ajustar".

<AIUXPatternDemo />

::: tip Cuatro patrones de interacción fundamentales
1. **Streaming**: el contenido generado por la IA se muestra carácter a carácter, en lugar de esperar a que todo esté generado. Esto reduce drásticamente el tiempo de espera percibido por el usuario y le permite juzgar durante la generación si la dirección es correcta.
2. **Conversación multi-turno (Multi-turn)**: mediante memoria de contexto se logra un diálogo continuo, el usuario puede refinar gradualmente sus necesidades. El desafío clave es la gestión de la ventana de contexto y la compresión del historial de conversación.
3. **Interacción multimodal (Multimodal)**: soporta múltiples modos de entrada como texto, imágenes, voz y archivos; la IA también puede producir múltiples formatos como imágenes, código y tablas.
4. **Modo Agent (Agentic)**: la IA no solo responde preguntas, sino que planifica y ejecuta autónomamente tareas de múltiples pasos. El usuario da un objetivo, la IA descompone los pasos por sí misma y los completa uno a uno.
:::

---

## 5. Flujo de peticiones: el ciclo de vida completo de una llamada a la IA

Cuando un usuario envía un mensaje en una aplicación de IA, ¿qué ocurre detrás? Entender este flujo completo es la base para construir aplicaciones de IA fiables.

<AIAppFlowDemo />

::: tip Las seis fases del procesamiento de peticiones
1. **Preprocesamiento de entrada**: validar la entrada del usuario, revisión de seguridad de contenido, desensibilización de información sensible
2. **Ensamblaje de contexto**: concatenar el system prompt, recuperar documentos relevantes (RAG), cargar el historial de conversación
3. **Llamada al modelo**: enviar el prompt ensamblado a la API del LLM, iniciar respuesta en streaming
4. **Postprocesamiento de salida**: formatear la salida, filtrar seguridad de contenido, extraer datos estructurados
5. **Caché de resultados**: cachear resultados para preguntas frecuentes, reduciendo costes y latencia
6. **Monitorización y registro**: registrar uso de tokens, tiempo de respuesta, feedback del usuario para optimización continua
:::

| Fase | Consideraciones clave | Problemas comunes |
|------|---------|---------|
| Preprocesamiento de entrada | Protección contra inyección de prompts, límite de longitud | Prompt injection, jailbreak |
| Ensamblaje de contexto | Presupuesto de tokens, prioridad de información | Desbordamiento de contexto, información clave truncada |
| Llamada al modelo | Gestión de timeouts, estrategia de reintentos, transmisión en streaming | Rate limiting de API, timeout de red |
| Postprocesamiento de salida | Validación de formato, detección de alucinaciones | Formato de salida no coincide con lo esperado |
| Estrategia de caché | Caché semántica vs caché exacta | Baja tasa de acierto de caché |
| Monitorización y alertas | Monitorización de costes, evaluación de calidad | Coste de tokens fuera de control |

---

## Resumen

El diseño de aplicaciones nativas de IA no consiste en superponer funcionalidades de IA sobre aplicaciones tradicionales, sino en reconstruir completamente desde las dimensiones de arquitectura, interacción y prácticas de ingeniería.

Puntos clave de este capítulo:

1. **Transformación arquitectónica**: de lógica determinista a razonamiento probabilístico, las aplicaciones nativas de IA requieren una mentalidad arquitectónica completamente nueva
2. **Principios de diseño**: aceptar la incertidumbre, confianza progresiva, transparencia y explicabilidad, colaboración humano-IA, degradación elegante
3. **El prompt es el núcleo**: la ingeniería de prompts es el "lenguaje de programación" de las aplicaciones de IA, determina directamente la calidad del producto
4. **Innovación en interacción**: streaming, conversación multi-turno, multimodal, modo Agent redefinen la experiencia de usuario
5. **Pensamiento de cadena completa**: desde el preprocesamiento de entrada hasta la monitorización y alertas, cada eslabón debe diseñarse específicamente para las características de la IA

## Lecturas adicionales

- [Google PAIR Guidelines](https://pair.withgoogle.com/) - Guía de diseño de IA para interacción humano-máquina de Google
- [Guía de Prompt Engineering de OpenAI](https://platform.openai.com/docs/guides/prompt-engineering) - Buenas prácticas oficiales de ingeniería de prompts
- [Prompt Engineering de Anthropic](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering) - Guía de diseño de prompts para Claude
- [Nielsen Norman Group: AI UX](https://www.nngroup.com/topic/artificial-intelligence/) - Investigación de experiencia de usuario con IA
- [Building LLM Applications](https://www.oreilly.com/library/view/building-llm-powered/9781835462317/) - Guía práctica para construir aplicaciones con LLM