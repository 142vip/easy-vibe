# Introducción al ajuste fino y despliegue de modelos

::: tip Prólogo
**Los grandes modelos son muy potentes, pero no entienden tu negocio.** GPT-4 puede escribir poesía y programar, pero no conoce la terminología de productos de tu empresa ni las normas profesionales de tu sector. El fine-tuning es el proceso de hacer que un modelo general "aprenda" tu conocimiento especializado: es como dar formación inicial a un erudito generalista para convertirlo en un experto en tu dominio.
:::

**¿Qué aprenderás en este artículo?**

Al terminar este capítulo, habrás aprendido:

- **Conocimiento del proceso**: dominarás el pipeline completo de fine-tuning, desde la preparación de datos hasta la puesta en producción del modelo
- **Ingeniería de datos**: conocerás los requisitos de formato y los estándares de calidad de los datos de fine-tuning
- **Fine-tuning eficiente**: entenderás el principio y las ventajas de técnicas de fine-tuning eficiente en parámetros como LoRA
- **Compresión de modelos**: dominarás cómo las técnicas de cuantización permiten ejecutar grandes modelos en hardware de consumo
- **Prácticas de despliegue**: conocerás las arquitecturas principales de servicio de modelos y las estrategias de selección

| Capítulo | Contenido | Conceptos clave |
|-----|------|---------|
| **Capítulo 1** | Pipeline de fine-tuning | Datos → Entrenamiento → Evaluación → Despliegue |
| **Capítulo 2** | Datos de entrenamiento | Formato de datos, control de calidad |
| **Capítulo 3** | Fine-tuning con LoRA | Adaptación de bajo rango, eficiencia de parámetros |
| **Capítulo 4** | Cuantización de modelos | FP16, INT8, INT4 |
| **Capítulo 5** | Despliegue de modelos | Servicio de inferencia, API gateway |

---

## 0. Panorama general: Motivación de fine-tuning

El entrenamiento de los grandes modelos de lenguaje se divide en dos fases: **preentrenamiento** y **fine-tuning**. El preentrenamiento consiste en aprender capacidades lingüísticas sobre enormes cantidades de datos generales; el fine-tuning consiste en aprender capacidades especializadas sobre datos de tareas específicas.

Usando una analogía: el preentrenamiento es como ir a la universidad: aprender conocimientos generales, saber un poco de todo; el fine-tuning es como la formación de incorporación: aprender habilidades profesionales para un puesto concreto.

::: tip ¿Cuándo necesitas fine-tuning?
- **Formato de salida específico**: necesitas que el modelo siempre produzca salida en un formato JSON fijo
- **Conocimiento de dominio especializado**: terminología y normas profesionales en campos como medicina, derecho o finanzas
- **Transferencia de estilo de lenguaje**: hacer que el modelo responda con un tono o estilo específico (como el guion de atención al cliente)
- **Soporte para idiomas minoritarios**: mejorar el rendimiento del modelo en un idioma específico
- **Optimización de costes**: sustituir llamadas a modelos grandes por modelos pequeños fine-tuneados, reduciendo el coste de inferencia
:::

---

## 1. Pipeline de fine-tuning: el viaje completo desde los datos hasta la producción

El fine-tuning no es "tirar los datos al modelo y ya está". Es un proceso de ingeniería riguroso donde cada fase afecta al resultado final.

<FinetuningPipelineDemo />

::: tip Las cinco fases del fine-tuning
1. **Preparación de datos**: recopilar, limpiar y etiquetar datos de entrenamiento. Es la fase que más tiempo consume y la más crítica.
2. **Selección del modelo**: elegir el modelo base adecuado, como Llama 3, Qwen, Mistral.
3. **Configuración del entrenamiento**: establecer hiperparámetros como learning rate, batch size, número de epochs.
4. **Ejecución del entrenamiento**: ejecutar el entrenamiento en GPU, monitorizar la curva de loss y las métricas de evaluación.
5. **Evaluación y puesta en producción**: evaluar el rendimiento en el conjunto de prueba y, si es satisfactorio, desplegar como servicio API.
:::

| Fase | Acciones clave | Trampas comunes |
|------|---------|---------|
| Preparación de datos | Limpiar, desduplicar, formatear | Datos de mala calidad hacen que el modelo "aprenda mal" |
| Selección del modelo | Evaluar la capacidad del modelo base | Modelo demasiado grande no se puede entrenar, demasiado pequeño da malos resultados |
| Configuración del entrenamiento | Ajustar hiperparámetros | Learning rate demasiado alto causa olvido catastrófico |
| Ejecución del entrenamiento | Monitorizar loss y métricas | Sobreajuste, entrenamiento que no converge |
| Evaluación y puesta en producción | A/B testing, despliegue gradual | Fuga del conjunto de prueba causa evaluación inflada |

---

## 2. Datos de entrenamiento: el techo del rendimiento del fine-tuning

En fine-tuning hay un dicho clásico: **"Garbage in, garbage out"**. La calidad de los datos de entrenamiento determina directamente el límite superior del rendimiento del fine-tuning. 100 ejemplos de alta calidad suelen dar mejores resultados que 10.000 ejemplos de baja calidad.

<TrainingDataDemo />

::: tip Tres formatos comunes de datos de fine-tuning
1. **Formato de instrucción (Instruction)**: el formato más usado, contiene tres campos: instruction (instrucción), input (entrada), output (salida esperada). Adecuado para entrenar modelos que sigan instrucciones.
2. **Formato de conversación (Chat)**: formato de diálogo multi-turno, contiene una lista de mensajes con roles system, user, assistant. Adecuado para entrenar chatbots.
3. **Formato de completado (Completion)**: pares simples prompt-completion, adecuados para generación de texto y completado de código.
:::

| Dimensión de calidad | Descripción | Método de verificación |
|------------|------|---------|
| Exactitud | Las respuestas deben ser correctas | Revisión manual, verificación por expertos |
| Consistencia | Estilo de respuesta consistente para preguntas similares | Muestreo y comparación |
| Diversidad | Cubrir suficientes escenarios y variantes | Estadísticas de distribución de tipos de preguntas |
| Desduplicación | Evitar que muestras duplicadas causen sobreajuste | Desduplicación textual, desduplicación semántica |
| Cantidad de datos | Normalmente 500~5000 ejemplos de alta calidad son suficientes | Empezar con pocos, aumentar gradualmente |

---

## 3. LoRA: conseguir el 90% del rendimiento con el 1% de los parámetros

El fine-tuning completo (Full Fine-tuning) requiere actualizar todos los parámetros del modelo. Para un modelo de 70B parámetros, esto significa cientos de GB de VRAM y una enorme cantidad de computación en GPU. Para la mayoría de los equipos, esto no es viable.

LoRA (Low-Rank Adaptation) ofrece una solución elegante: **congelar los parámetros originales del modelo y entrenar solo un pequeño conjunto de matrices de bajo rango añadidas**. Estas matrices suelen tener solo un 0.1%~1% de los parámetros del modelo original, pero pueden alcanzar un rendimiento cercano al fine-tuning completo.

<LoRADemo />

::: tip La idea central de LoRA
La matriz de pesos W del modelo original es una matriz enorme (por ejemplo, 4096x4096). LoRA no modifica W directamente, sino que añade un "bypass": W' = W + BA, donde B y A son dos matrices pequeñas (por ejemplo, 4096x8 y 8x4096). Durante el entrenamiento solo se actualizan B y A, la W original permanece inalterada.
- **Rango (Rank)**: cuanto mayor es el valor r, mayor es la capacidad expresiva, pero también más parámetros. Normalmente r=8~64 es suficiente.
- **Despliegue fusionado**: tras el entrenamiento, se puede fusionar BA de vuelta en W, sin sobrecarga adicional en inferencia.
:::

| Método de fine-tuning | Parámetros entrenables | Requisito de VRAM | Velocidad de entrenamiento | Rendimiento |
|---------|-----------|---------|---------|------|
| Fine-tuning completo | 100% | Muy alto | Lento | El mejor |
| LoRA | 0.1%~1% | Bajo | Rápido | Cercano al completo |
| QLoRA | 0.1%~1% | Más bajo | Medio | Ligeramente inferior a LoRA |
| Prompt Tuning | < 0.01% | Muy bajo | Muy rápido | Limitado |

---

## 4. Cuantización de modelos: adelgazar los grandes modelos

Un modelo de 70B parámetros, almacenado en FP32 (32 bits de punto flotante), necesita 280 GB de VRAM: sin varias GPUs de gama alta es imposible ejecutarlo. La cuantización (Quantization) reduce la precisión numérica para comprimir el tamaño del modelo, permitiendo que los grandes modelos se ejecuten en hardware de consumo.

<ModelQuantizationDemo />

::: tip El compromiso central de la cuantización
La cuantización es esencialmente un compromiso de **precisión por espacio**. FP32 → FP16 casi no tiene pérdida, INT8 tiene una pérdida leve, INT4 tiene una pérdida notable pero generalmente aceptable. La clave es encontrar el punto de equilibrio óptimo para tu escenario.
- **FP16 (media precisión)**: tamaño reducido a la mitad, calidad casi sin pérdida. Es la opción por defecto para entrenamiento e inferencia.
- **INT8 (8 bits enteros)**: tamaño reducido otra mitad, pérdida de calidad muy pequeña. Adecuado para la mayoría de escenarios de inferencia.
- **INT4 (4 bits enteros)**: tamaño solo 1/8 de FP32, cierta pérdida de calidad. Adecuado para escenarios con recursos limitados.
:::

| Precisión | Bytes por parámetro | Tamaño modelo 70B | Pérdida de calidad | Escenario aplicable |
|------|-----------|-------------|---------|---------|
| FP32 | 4 bytes | ~280 GB | Ninguna | Referencia de entrenamiento |
| FP16 | 2 bytes | ~140 GB | Casi ninguna | Entrenamiento e inferencia estándar |
| INT8 | 1 byte | ~70 GB | Muy pequeña | Inferencia en producción |
| INT4 | 0.5 bytes | ~35 GB | Aceptable | Dispositivos edge, despliegue local |

---

## 5. Despliegue de modelos: del laboratorio a producción

El modelo está entrenado, cuantizado y comprimido. El último paso es desplegarlo como un servicio accesible. El despliegue de modelos no es solo "poner el modelo en marcha", implica problemas de ingeniería como concurrencia, balanceo de carga y control de costes.

<ModelServingDemo />

::: tip Tres soluciones principales de despliegue
1. **Proveedores de API**: usar directamente las APIs de OpenAI, Anthropic y otros proveedores. Cero operaciones, pago por token. Adecuado para validación rápida y uso a pequeña/mediana escala.
2. **Servicio de inferencia autoalojado**: usar frameworks como vLLM, TGI en tus propios servidores con GPU. Costes controlables, datos no salen del dominio. Adecuado para escenarios con requisitos de privacidad o llamadas a gran escala.
3. **Inferencia serverless**: usar plataformas como AWS SageMaker, Replicate, pago por petición, autoescalado. Adecuado para escenarios con tráfico muy variable.
:::

| Solución de despliegue | Modelo de costes | Latencia | Complejidad operativa | Escenario aplicable |
|---------|---------|------|-----------|---------|
| Proveedor de API | Facturación por token | Media | Cero | Prototipado rápido, escala pequeña/media |
| vLLM autodesplegado | Alquiler de GPU | Baja | Alta | Gran escala, sensible a privacidad |
| Serverless | Facturación por petición | Arranque en frío alto | Baja | Tráfico muy variable |
| Despliegue edge | Inversión única en hardware | Muy baja | Media | Escenarios offline, IoT |

---

## Resumen

El fine-tuning y despliegue de modelos es el eslabón clave para convertir un gran modelo de "herramienta general" en "asistente especializado". Desde la preparación de datos hasta la puesta en producción, cada paso requiere mentalidad y práctica de ingeniería.

Puntos clave de este capítulo:

1. **El fine-tuning es formación inicial**: hacer que un modelo general aprenda el conocimiento y los patrones de comportamiento de un dominio específico
2. **La calidad de los datos determina el techo**: 100 ejemplos de alta calidad superan a 10.000 de baja calidad
3. **LoRA es el rey de la eficiencia**: con menos del 1% de los parámetros se logra un rendimiento cercano al fine-tuning completo
4. **La cuantización es el arma de despliegue**: la cuantización INT4 hace posible ejecutar un modelo de 70B en una sola tarjeta
5. **La solución de despliegue depende del contexto**: validación rápida con API, gran escala con autodespliegue, tráfico variable con serverless

## Lecturas adicionales

- [Documentación de Hugging Face PEFT](https://huggingface.co/docs/peft) - Documentación oficial de la biblioteca de fine-tuning eficiente en parámetros
- [Documentación de vLLM](https://docs.vllm.ai/) - Motor de inferencia LLM de alto rendimiento
- [Unsloth](https://github.com/unslothai/unsloth) - Framework de fine-tuning LoRA con aceleración 2x
- [Especificación del formato GGUF](https://github.com/ggerganov/ggml/blob/master/docs/gguf.md) - Formato de modelo cuantizado usado por llama.cpp
- [Guía de Fine-tuning de OpenAI](https://platform.openai.com/docs/guides/fine-tuning) - Guía oficial de fine-tuning de OpenAI