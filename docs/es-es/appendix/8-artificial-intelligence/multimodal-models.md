# Principios de los modelos multimodales: visión/audio/video
> 💡 **Guía de estudio**：Este capítulo no requiere conocimientos profundos de visión artificial. A través de demostraciones interactivas, entenderás cómo la IA adquirió "ojos". Desvelaremos los principios fundamentales detrás de modelos como GPT-4V, Qwen-VL y otros.

<VlmQuickStartDemo />

## 0. Introducción: Ponerle ojos al cerebro

En [Introducción a los Modelos de Lenguaje Grandes](./llm-principles.md), aprendimos que un LLM es esencialmente un "cerebro" encerrado en una caja negra que solo puede entender el mundo a través del **texto**.

La aparición de los **Modelos de Lenguaje Multimodales (VLM)** equivale a dotar a ese cerebro de un par de **ojos**.

Pero no es fácil. Porque:

- **El cerebro (LLM)** solo entiende **texto** (más precisamente, Token IDs).
- **Los ojos (la cámara)** ven **píxeles** (valores numéricos de color RGB).

La tarea central de un VLM es **traducir la "señal de píxeles" en "señal de texto"**, para que el LLM entienda una imagen con la misma facilidad con la que lee un artículo.

---

## 1. Primer paso: Convertir imágenes en "palabras" (Tokenización Visual)

Imagina que estás describiendo un rompecabezas a un amigo por teléfono. No puedes describirlo todo de golpe; tienes que ir pieza por pieza.
Lo mismo ocurre cuando un ordenador "ve" una imagen.

### 1.1 Troceado (Patchify) — Crear palabras visuales

Sabemos que cuando un Modelo de Lenguaje Grande (LLM) procesa texto, divide las frases en tokens uno por uno. Si quieres que el LLM "lea" imágenes, el método más intuitivo es convertir las imágenes en algo similar a tokens.

Para adaptarnos a esta costumbre del modelo de "leer palabras", necesitamos una técnica que transforme una imagen bidimensional continua en fragmentos discretos. De aquí surge el concepto de **troceado de flujo visual (Patchify)**：dividimos una imagen bidimensional completa, como quien corta tofu, en pequeños bloques cuadrados de cuadrícula fija (llamados Patch).

- **Imagen original** = un artículo completo
- **Bloque de imagen (Patch)** = una palabra del artículo (Token)

En la práctica de ingeniería, normalmente dividimos la imagen en bloques de tamaño fijo (por ejemplo $16 \times 16$ o $14 \times 14$ píxeles) sin superposición. Por ejemplo, una imagen de entrada común de $224 \times 224$ píxeles, después del troceado, se convierte en $14 \times 14 = 196$ bloques de imagen independientes.
Mediante esta operación, la matriz de píxeles bidimensional originalmente continua se segmenta físicamente en 196 "palabras visuales" discretas.

> 🕹️ **Demostración interactiva**：Haz clic en el botón de abajo para experimentar cómo una imagen original es dividida en Patches individuales mediante una cuadrícula regular.

<PatchifyDemo />

### 1.2 Serialización (Flatten) — Formar una frase

Tras el paso anterior de troceado, ahora tenemos una matriz bidimensional de $14 \times 14$. Sin embargo, tanto el Transformer tradicional como los LLM modernos solo aceptan **entradas secuenciales unidimensionales** en su arquitectura subyacente (es decir, una estructura de datos lineal dispuesta de izquierda a derecha).

Para cumplir con las especificaciones de entrada del modelo grande, debemos realizar la **serialización (Flatten) y proyección lineal (Linear Projection)**：
1. **Aplanar (Flatten)**：Unir los bloques de imagen de varias filas extremo con extremo, "aplanando" la matriz bidimensional en un eje largo unidimensional con solo orden secuencial.
2. **Estirar características (Projection)**：Estos 196 bloques todavía son "carne cruda" apilada de píxeles rojos, verdes y azules. Necesitamos usar una pequeña red neuronal (normalmente una capa completamente conectada) para procesar cada bloque, comprimiéndolos y convirtiéndolos respectivamente en un vector de características de longitud fija (por ejemplo, una lista de 768 números).

Tras este paso, una imagen se convierte realmente en una "secuencia de palabras visuales" (Visual Token Sequence).

> 🕹️ **Demostración interactiva**：Observa la animación de abajo para entender cómo un **simple bloque de píxeles (Patch)** experimenta un estiramiento matricial y finalmente se mapea en un **vector** de alta dimensión rico en características.

<LinearProjectionDemo />

---

## 2. Segundo paso: Traducción entre especies (Proyección)

En este momento, aunque la imagen ya ha sido transformada en una secuencia unidimensional continua de "palabras visuales", esta secuencia sigue siendo un galimatías ilegible para el LLM final.

¿Por qué no puede leerla? Porque los **espacios de características son diferentes** (es decir, hablan idiomas distintos).
Lo que el codificador visual (como ViT) extrae son **características de píxeles espaciales** (por ejemplo, solo puede decirte "esto está compuesto por muchas líneas negras curvadas", "aquí hay una gran zona roja"); mientras que lo que el LLM comprende internamente son **características semánticas profundas** (como conceptos de "gato", "árboles", "peligro", etc.).

Entre estos dos sistemas de discurso completamente diferentes, necesitamos construir un puente: nuestro traductor intermodal：el **Projector (Proyector / Adaptador)**.

### 2.1 El papel del traductor (Alineación del Espacio Latente)

La esencia académica del Projector es lograr la **alineación del espacio latente de características (Latent Space Alignment)**. Es como un intérprete simultáneo en la vida real：

- **Entrada (Source)**：Las "características visuales" que ViT produce (enfocadas en geometría, color, patrones de textura y otras representaciones continuas de alta dimensión).
- **Procesamiento (Translation)**：El Projector utiliza una estructura de red neuronal (que pueden ser unas pocas capas simples de transformación lineal, o capas complejas de atención) para encontrar la correspondencia matemática entre los dos idiomas durante este proceso.
- **Salida (Target)**：Produce un "lenguaje LLM" que cumple completamente con el gusto y las expectativas del LLM (tokens de embedding textual equivalentes convertidos a partir de características de imagen, dotando a la imagen de significado conversacional).

A través de esta capa de filtrado de traducción, el modelo grande se sorprenderá al descubrir："¿Eh? ¡Esta cadena de números que me llega no es más que la combinación de palabras descriptivas que suelo leer!"，y así procesará conjuntamente las características visuales y el lenguaje natural con total naturalidad.

<ProjectorDemo />

### 2.2 Diferentes escuelas de traducción

Para hacer que el "proceso de traducción" de alineación de características sea más rápido y preciso, la academia y la industria han desarrollado varios diseños de conexión de hardware muy representativos：

1.  **Escuela de traducción literal (Linear Projection)**：
    - **Método**：Extremadamente simple y directo, usa solo una o varias capas de Perceptrón Multicapa (MLP / capas de proyección lineal) para realizar una transformación matricial matemática directa y transparente.
    - **Características**：**Pérdida de información extremadamente baja, conserva los detalles originales de la imagen**；pero el inconveniente es que introduce los cientos o miles de tokens visuales recién troceados sin filtrar al modelo de lenguaje, lo que provoca una explosión en el coste computacional posterior.
    - **Representantes**：Serie LLaVA.

2.  **Escuela de traducción libre (Q-Former / Resampler)**：
    - **Método**：No transmite tal cual, sino que introduce en medio una "pequeña red exploradora" con capacidad de resumen abstracto. Este agente intermedio primero comprende rápidamente la imagen en su totalidad y destila unas pocas docenas de puntos clave altamente condensados.
    - **Características**：**Información altamente refinada y destilada, pocos tokens, lo que ahorra enormemente la capacidad de cómputo que el LLM necesita para razonar**；el inconveniente es que puede descartar pistas de observación extremadamente sutiles de los bordes de la imagen original durante el proceso de refinamiento.
    - **Representantes**：BLIP-2, Gemini (mecanismo parcialmente similar).

3.  **Escuela ecléctica (C-Abstractor / Pooling)**：
    - **Método**：Mediante pooling convolucional o reorganización de regiones locales, comprime y empaqueta bloques adyacentes de $2 \times 2$ o más píxeles fusionándolos y reorganizándolos en una unidad expresiva completa.
    - **Características**：Comprime razonablemente la longitud máxima de los tokens, pero aún conserva parte de la interdependencia local y espacial.
    - **Representantes**：Qwen-VL-Max.

---

## 3. Tercer paso: Ensamblaje (La Arquitectura)

Con las piezas y los estándares de acoplamiento listos, veamos cómo se completa el equipamiento completo. Los modelos de lenguaje visual multimodal (Vision-Language Model) convencionales siguen básicamente una **arquitectura unificada de "tres segmentos"**.

### 3.1 La estructura corporal de un VLM

<ModelArchitectureComparisonDemo />

Una entidad VLM bajo el paradigma típico funciona mediante la colaboración de las siguientes tres partes principales：

1.  **Los "ojos" perceptores de características (Vision Encoder - Codificador Visual)**：
    - **Función**：Actúa como la primera puerta de entrada de la imagen, encargándose de "ver" la imagen y abstraer características visuales de alta dimensión.
    - **Selección**：La mayoría de los fabricantes no entrenan los ojos desde cero, sino que reutilizan directamente componentes maduros preentrenados en cientos de millones de pares de datos "imagen-texto" (como la torre visual del modelo CLIP de OpenAI, o el modelo SigLIP de Google).
    - *Analogía：Es la región de células fotorreceptoras altamente especializadas de la retina en un organismo biológico.*

2.  **El "nervio óptico" de conversión de señales (Projector - Proyector Modal)**：
    - **Función**：Conecta el codificador y la base del lenguaje, encargándose de la compresión de dimensionalidad de la señal, la conexión y la traducción semántica multimodal.
    - **Selección**：Esta es la **máxima prioridad** en el entrenamiento posterior de todo el sistema multimodal. Su propio número de parámetros no suele ser grande (en comparación con el LLM), pero determina si "texto" e "imagen" pueden entenderse mutuamente.
    - *Analogía：Es como el centro nervioso visual encargado de convertir y transmitir señales eléctricas a la corteza cerebral.*

3.  **El "cerebro" motor cognitivo (LLM Backbone - Base del Modelo de Lenguaje)**：
    - **Función**：Asume el trabajo final de observación, invocación de sentido común, razonamiento lógico profundo y generación de respuestas antropomórficas.
    - **Selección**：Normalmente se utilizan los modelos de lenguaje grandes de código abierto con mayor inteligencia del sector como punto de montaje (como Qwen, Llama 3, Vicuna, etc.).
    - *Analogía：Es el centro de lenguaje y decisión del cerebro dotado de una base de conocimiento mundial, que realiza juicios cognitivos de alto nivel sobre las señales procesadas transmitidas por el nervio óptico.*

---

## 4. Enfoque de aprende a ver (Entrenamiento)

Bien, ahora todas las partes del cuerpo están ensambladas. Pero antes de entrar en servicio, el VLM recién montado se encuentra realmente en un estado de "ceguera y caos" similar al de un recién nacido — porque el nuevo nervio óptico (Projector) es una página en blanco llena de valores numéricos aleatorios sin significado.

Para dotar a este monstruo ensamblado de la capacidad de describir imágenes, la comunidad científica ha resumido un conjunto eficiente de **"Reglas de Entrenamiento en Dos Etapas (Two-Stage Training)"**.

### Etapa uno: Reconocimiento de objetos (Feature Alignment —— Preentrenamiento de reconocimiento)

En esta etapa, la tarea principal es hacer que el Projector aleatorio establezca un mapeo intermodal preliminar. El proceso se parece mucho a enseñar a un bebé a memorizar palabras a la fuerza con "tarjetas cognitivas".

- **Mostrarle (entrada de entrenamiento)**：Grandes lotes (a menudo cientos de millones) de pares imagen-texto minimalistas con un único sujeto prominente (por ejemplo, una foto de un "gato" sobre fondo blanco).
- **Decirle (salida objetivo)**：Etiquetas de vocabulario breves adjuntas ("un gato naranja").
- **Objetivo de optimización**：Forzar al Projector a aprender mediante transformación matricial, haciendo que las características visuales correspondientes de este gato (tras la traducción) se alineen y solapen lo máximo posible con el vector de token de la palabra "gato" en lenguaje natural.
- **Estado de control de parámetros (Freeze Strategy)**：Para evitar dañar la inteligencia del modelo original, en esta etapa los investigadores **congelan (Freeze)** intensamente los miles de millones de parámetros de los "ojos" (ViT) y el "cerebro" (LLM)，**activando únicamente el entrenamiento de los pocos millones de parámetros** del propio "nervio óptico" (Projector).

<FeatureAlignmentDemo />

### Etapa dos: Conversación (Visual Instruction Tuning —— Práctica de diálogo)

Si la primera etapa solo convierte al modelo en una máquina de nombrar objetos, la tarea de la segunda etapa es activar su inteligencia superior, permitiéndole responder verdaderamente a instrucciones complejas que combinan imagen y texto según el contexto.

- **Mostrarle (entrada de entrenamiento)**：Pares de entrenamiento de preguntas y respuestas de alta calidad cuidadosamente diseñados. Por ejemplo, proporcionar una imagen panorámica compleja del tráfico urbano.
- **Pedirle que responda (salida objetivo)**：El usuario pregunta："`<imagen>` ¿El hombre de la bicicleta blanca en la esquina inferior izquierda lleva casco?" El asistente responde："No, no lleva nada en la cabeza, lo cual es un comportamiento muy peligroso en la ciudad."
- **Objetivo de optimización**：Hacer que el modelo grande no solo reciba pistas visuales, sino que también combine sus conocimientos previos de civilización, fusionando completamente la lógica textual con las representaciones multimodales y realizando razonamientos.
- **Estado de control de parámetros (Freeze Strategy)**：En este momento, el nervio óptico ya está básicamente ajustado. En esta fase de ajuste fino, generalmente se continúa congelando una parte de los pesos inferiores del codificador visual, mientras se **descongelan completamente el LLM y el Projector** (o se adopta una configuración LoRA)，realizando un ajuste de retropropagación conjunta global a gran escala.

<VLMInferenceDemo />

---

## 5. Avanzado: Ver con mayor claridad (Trucos Avanzados)

Aunque la arquitectura anterior sustenta el paradigma multimodal inicial, los modelos VLM de primera generación presentaban un defecto fundamental muy frustrante — **miopía (deficiencia visual congénita)**.

Los primeros codificadores visuales ViT, por razones históricas de diseño, solo podían procesar imágenes diminutas de resolución extremadamente baja como $224 \times 224$ o $336 \times 336$. Es como observar el mundo a través de una cámara retro borrosa y de baja calidad de unos pocos cientos de miles de píxeles: los detalles como letreros con texto ligeramente pequeño se convierten en una masa de píxeles borrosos, y por muy inteligente que sea el cerebro, "no se puede hacer ladrillos sin paja".

Para superar esta enfermedad de baja resolución, los fabricantes de modelos punteros (como el equipo de Qwen-VL, LLaVA-NeXT, etc.) han utilizado algunos medios de ingeniería muy ingeniosos：

### 5.1 Mapeo dinámico de alta resolución por troceo (Dynamic High-Resolution Mapping)

Si introducir una imagen grande directamente causa un desbordamiento de memoria de vídeo, y reducirla drásticamente perdería todos los detalles, ¿cómo resolverlo? La solución actual es：la **estrategia de doble perspectiva de "primer plano local + vista aérea global"**.

1. **Visión general**：Primero, la enorme imagen original de alta definición se reduce directamente a $336 \times 336$ y se envía a los ojos para un vistazo general. Esto permite al modelo captar la **estructura de disposición macro general** de la imagen (¿dónde está el cielo? ¿dónde está el suelo?).
2. **Ampliar por troceo**：La imagen original de alta definición se corta en docenas de bloques de primer plano local (Slice) independientes y sin pérdida de $336 \times 336$.
3. **Escaneo individual y reconstrucción espacial**：El motor visual utiliza una lupa para escanear una por una estas docenas de secciones sin pérdida y recopilar detalles de alta definición. Posteriormente, el Projector une semánticamente estos bloques de detalle con el contexto de la vista general inicial, como si de un rompecabezas se tratara.

Esta práctica es comparable a cuando haces una foto panorámica de un periódico con el móvil (para ver la estructura general de la página), y luego acercas el móvil al periódico para tomar sucesivamente docenas de primeros planos de párrafos individuales.

### 5.2 Cambiar por unos ojos naturalmente grandes (Escalado del Codificador Visual)

Otro enfoque que muestra pura estética de fuerza bruta es：ya que los ojos originales tienen defectos genéticos congénitos, fabriquemos desde cero el ojo más extraordinario y asombroso.

Con el excelente modelo de código abierto nacional **InternVL** como representante clásico, este descarta los modelos visuales pequeños comúnmente utilizados y entrena desde cero, consumiendo enormes recursos, un raro codificador visual supergigante de miles de millones de parámetros (como InternViT-6B de 6 mil millones de parámetros) como base frontal.
Con su extrema capacidad de absorción de datos, nace como un "Telescopio Espacial Hubble" que soporta nativamente entradas de alta resolución sin interrupciones. Este diseño reduce enormemente los complejos costes de ingeniería y los riesgos de desalineación de características introducidos por los sistemas de troceo y ensamblaje de imágenes, logrando directamente una percepción visual de alta definición "sin obstáculos".

---

## 6. Resumen

Los Modelos de Lenguaje Multimodales (VLM) no tienen nada de magia. Solo hacen una cosa：

**Traducir el "idioma extranjero" de las imágenes al "idioma nativo" del texto, y luego dárselo de comer al LLM.**

Si entiendes esto, lo entiendes todo sobre los VLM.

---

## 7. Glosario rápido

| Término      | Nombre completo       | Explicación                                                              |
| :----------- | :-------------------- | :----------------------------------------------------------------------- |
| **VLM**      | Vision-Language Model | **Modelo de Lenguaje Multimodal**. Un GPT que puede entender imágenes.   |
| **ViT**      | Vision Transformer    | **Modelo Visual**. Los "ojos" del VLM, encargado de convertir píxeles en vectores. |
| **Patch**    | -                     | **Bloque de imagen**. Los pequeños cuadrados en que se divide una imagen, equivalentes a "palabras visuales". |
| **Projector**| -                     | **Proyector / Traductor**. El puente que conecta los ojos con el cerebro. |
| **Alignment**| -                     | **Alineación**. Hacer que las características visuales y textuales "se entiendan mutuamente" en el mismo espacio. |
