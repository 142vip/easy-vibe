# Principios de funcionamiento de los modelos de lenguaje de gran escala
> 💡 **Guía de estudio**: Este capítulo no requiere conocimientos de programación. A través de demostraciones interactivas, te guiaremos a fondo en el funcionamiento interno de los Modelos de Lenguaje de Gran Escala (LLM). Comenzaremos desde lo más básico, la tokenización, hasta cómo se entrenan e infieren modelos como GPT.

<LlmQuickStartDemo />

## 0. Introducción: Del lenguaje humano al cálculo de máquina

Los humanos nos comunicamos con lenguaje; los ordenadores calculan con números.
La esencia de un **Modelo de Lenguaje de Gran Escala (LLM)** es precisamente un puente que conecta estos dos mundos.

Su tarea central es una sola: **transformar el problema de "comprender el lenguaje" en un problema de "cálculo matemático".**

Para lograr este objetivo, necesitamos resolver tres desafíos fundamentales:

1.  **Traducción**: ¿Cómo convertir texto en números? (Tokenización y Embedding)
2.  **Eficiencia**: ¿Cómo hacer que el ordenador calcule rápido? (Operaciones matriciales)
3.  **Memoria**: ¿Cómo hacer que el ordenador entienda el contexto? (Modelo Transformer)

Este tutorial te llevará desde cero, desmontando paso a paso el proceso de construcción de este puente.

---

## 1. Primer paso: Traducción (Tokenización)

El ordenador no puede leer los caracteres "hamburguesa", solo entiende números.
Así que nuestra primera tarea es: **dividir el texto en las unidades más pequeñas que el ordenador pueda comprender**.

### 1.1 Introducción a tokenización

La tokenización consiste en descomponer una frase completa en "unidades de palabra" (Tokens).

- **Inglés**: Al tener espacios naturales, es fácil de tokenizar (ej. `I love AI`).
- **Chino**: No tiene espacios, por lo que se necesitan algoritmos para segmentar (ej. `我爱人工智能`).

#### Tokenizer (El traductor)

El programa que ejecuta la acción de tokenizar se llama **Tokenizer**.
Es como un traductor, encargado de traducir el texto humano en una secuencia numérica que la máquina pueda leer.

Los LLM modernos (como GPT-4) suelen usar técnicas de **Tokenización por Subpalabras (Subword Tokenization)** (como el algoritmo BPE).
Su ingenio radica en que: **las palabras comunes se mantienen completas, las palabras raras se descomponen**.

A continuación, un ejemplo real de tokenización BPE (basado en el Tokenizer de GPT-4):

**Input**: `"The quick brown fox jumps over the lazy dog. \n今天天气真不错！"`

**Token List**:

```text
index=791,   string='The'
index=4062,  string=' quick'
index=14198, string=' brown'
index=39935, string=' fox'
index=83368, string=' jumps'   <-- Si se descompusiera, podría ser ' jump' + 's'
index=927,   string=' over'
index=279,   string=' the'
index=16053, string=' lazy'
index=3290,  string=' dog'
index=13,    string='.'
index=198,   string='\n'       <-- Salto de línea
index=33838, string='今天'      <-- Palabra común, se fusiona directamente
index=54580, string='天气'
index=20265, string='真'
index=57672, string='不错'
index=171,   string='！'
```

> **Sobre el manejo de caracteres raros**:
> Si aparece un carácter raro que no está en el vocabulario (suponiendo que "今" fuera muy raro), el modelo recurre a la codificación a **nivel de Byte**.
> 1.  Entrada cruda: `今`
> 2.  Bytes: `\xE4 \xBB \x8A`
> 3.  Búsqueda BPE: Primero busca `\xE4\xBB\x8A` -> no lo encuentra -> lo descompone en `\xE4\xBB` (ID=1001) + `\x8A` (ID=2002).
> 4.  Token final: `[1001, 2002]`.
>
> Este mecanismo garantiza que **sin importar qué carácter se introduzca, el modelo siempre puede procesarlo, evitando para siempre el problema de OOV (Out Of Vocabulary)**.

<TokenizationDemo />

**Punto clave**: El LLM no procesa palabras, sino **Token IDs** (una secuencia de índices numéricos).

---

## 2. El problema central: Enfoque de ordenador "calcule" el lenguaje

Nuestra tarea es procesar lenguaje. Pero el ordenador solo entiende números.
La idea más directa es: asignar un número (ID) a cada palabra.

- manzana -> ID 10
- plátano -> ID 20

### 2.1 Motivación para un simple ID

Si solo usáramos IDs, el ordenador pensaría que "10" y "20" son solo dos números sin relación alguna.
Además, si el vocabulario tiene 100 000 palabras, podríamos necesitar un array de longitud 100 000 para representar una sola palabra (codificación One-Hot), donde 99 999 posiciones son 0 y solo una es 1.

- **Desventaja 1**: Demasiado desperdicio (dispersión, el array One-Hot es demasiado grande).
- **Desventaja 2**: Sin semántica (no se puede representar que "manzana" y "plátano" son ambas frutas).

### 2.2 La solución: Embedding (Vector denso)

Para expresar una palabra de forma **eficiente** y **con significado**, inventamos el **Embedding**.
En lugar de usar un array largo de 0/1, usamos un array más corto, lleno de decimales (por ejemplo, 512 números) para describir una palabra.

- Por ejemplo: `[0.8 (es fruta), 0.1 (rojo), 0.9 (dulce)...]`
  Así, no solo comprimimos los datos, sino que convertimos el significado en "coordenadas" calculables.

<EmbeddingDemo />

---

## 3. De la palabra a la matriz

Resuelto el problema de expresar "una palabra", toca resolver el de expresar "una frase".

### 3.1 Motivación de tiene que ser una matriz

Porque una frase contiene muchas palabras.

- Una palabra = Una fila de números (vector).
- Una frase = Muchas filas de números apiladas.
  Esto es una **matriz**.

La razón de agruparlas en una matriz es que el hardware central de los ordenadores modernos — la **GPU (tarjeta gráfica)** — está diseñada precisamente para realizar operaciones matriciales.
Solo convirtiendo el lenguaje en matrices podemos aprovechar la capacidad paralela de la GPU para lograr una inferencia y un entrenamiento **eficientes**.

### 3.2 El flujo completo

Repasemos cómo fluyen los datos:

1.  **Tokenización**: Trocear el texto.
2.  **Indexación**: Convertir los fragmentos en IDs.
3.  **Embedding**: Convertir los IDs en vectores (para semántica y compresión).
4.  **Apilamiento**: Agrupar los vectores en una matriz (para cálculo eficiente en GPU).

<TokenizerToMatrix />

---

## 3.5 Interludio: Introducción a exactamente un "modelo"

Antes de hablar de arquitecturas concretas, entendamos de forma intuitiva la palabra "modelo".

En el ámbito de la IA, un **modelo (Model)** es básicamente una **función** o **caja negra** supercompleja.

- **Entrada**: Un montón de números (como los Token IDs anteriores).
- **Procesamiento**: Dentro de la caja negra hay cientos de millones de parámetros (imagina cientos de millones de perillas de ajuste), que realizan operaciones de suma, resta, multiplicación y división sobre los datos de entrada.
- **Salida**: Otro montón de números (que representan el resultado de la predicción, como la probabilidad de la siguiente palabra).

**Una analogía:**

Puedes imaginar el modelo como un **chef experimentado**:

1.  **Entrada (ingredientes)**: Le das carne de res, patatas y tomates.
2.  **Modelo (la mente del chef)**: Basándose en los miles de recetas que ha aprendido (datos de entrenamiento), calcula rápidamente en su cabeza: cortar la carne en cubos, pelar las patatas, controlar el fuego...
3.  **Salida (el plato)**: Finalmente sirve un estofado de carne con patatas.

El llamado **entrenamiento (Training)** consiste en hacer que este chef empiece como aprendiz, dejándole probar y equivocarse millones de veces. Si queda salado, ajusta la "perilla de la sal"; si queda soso, ajusta la "perilla del fuego", hasta que pueda preparar platos deliciosos de forma consistente.

Los LLM actuales son como un súper chef que "ha leído todos los libros de la humanidad", solo que en lugar de cocinar platos, cocina texto.

## 4. El camino de la evolución: De RNN a Transformer

Con los datos (Tokens) y el chef (modelo), veamos ahora cómo piensa este chef.

En la historia evolutiva de la IA, ha habido principalmente dos "formas de pensar" (arquitecturas): **RNN** y **Transformer**.

### 4.1 El viejo método torpe: RNN (El juego del teléfono)

Los primeros modelos (RNN, Redes Neuronales Recurrentes), al procesar una frase, funcionaban como el **juego del teléfono escacharrado**.

**Modo de funcionamiento:**

1.  Lee la 1.ª palabra "Yo", la memoriza y la pasa al paso 2.
2.  Lee la 2.ª palabra "gusta", combina con el recuerdo anterior, actualiza la información mental y la pasa al paso 3.
3.  Lee la 3.ª palabra "comer", actualiza de nuevo el recuerdo...
4.  ... hasta leer la última palabra.

**Esto conlleva dos desventajas fatales:**

1.  **Lento (sin paralelismo)**: Hay que esperar a que el anterior termine de pasar el mensaje para que el siguiente empiece. No se puede poner a 100 personas a trabajar a la vez.
2.  **Olvido (pérdida de memoria a larga distancia)**: Cuando el mensaje llega a la persona número 100, probablemente ya ha olvidado si la primera persona dijo "yo" o "tú". Esto hace que el modelo, al escribir textos largos, pierda la coherencia entre el principio y el final.

### 4.2 El diseño genial actual: Transformer (La mesa redonda)

En 2017, Google presentó una arquitectura completamente nueva: **Transformer**. Cambió radicalmente las reglas, transformando el "juego del teléfono" en una **mesa redonda**.

**Modo de funcionamiento:**
Transformer ya no pasa mensajes uno a uno, sino que hace que **todas las palabras se sienten a la mesa a la vez**.

1.  **Visión cenital (Cálculo paralelo)**: Todas las palabras entran simultáneamente, sin hacer cola. Cada una escribe su información en un papel y lo pone en el centro de la mesa.
2.  **Mecanismo de Atención (Attention)**: Esta es su arma secreta. Cada palabra puede **directamente** consultar la información de cualquier otra palabra en la mesa.
    - Por ejemplo, al leer la palabra "lo", el modelo no necesita recordar el mensaje anterior, sino que mira directamente hacia atrás y ve "el gato", entendiendo al instante que "lo = el gato".

**Esto resuelve perfectamente los puntos débiles de RNN:**

- **Rápido**: Todos consultan los documentos a la vez, la GPU puede funcionar a pleno rendimiento, con una eficiencia altísima.
- **Sin olvido**: Sin importar lo larga que sea la frase, la distancia entre la 1.ª palabra y la 10 000.ª es siempre de "un solo paso", puedes mirar a quien quieras cuando quieras.

> **En resumen**:
>
> - **RNN**: Como recorrer un laberinto, paso a paso, fácil perderse.
> - **Transformer**: Como mirar el mapa con vista cenital, el destino y el origen se ven de un vistazo.

#### ¿Por qué sigue siendo necesaria la información de "posición"?

Porque Transformer procesa "todo de golpe"; si no se hace un tratamiento especial, no distingue entre "yo te quiero" y "tú me quieres" (las palabras son las mismas, solo cambia el orden).
Por eso asignamos a cada palabra una **placa numérica (codificación posicional)**, para indicar al modelo quién está en la 1.ª posición y quién en la 2.ª.

> Pequeño recordatorio: Muchos LLM son autorregresivos (predicen la siguiente palabra), por lo que durante la generación emiten un token tras otro; pero en el cálculo interno de **cada paso de generación**, Transformer sigue aprovechando el paralelismo matricial y la optimización de caché.

### 4.3 Truco de eficiencia: KV Cache

Quizás hayas oído que al generar textos largos, cuanto más avanzas, más lento se vuelve o más memoria de video consume. Esto suele deberse a que el modelo necesita "recordar" todo el contenido generado previamente.

**¿Cómo "toma notas" Transformer?**

En el mecanismo de atención de Transformer, cada palabra genera dos vectores, `Key (K)` y `Value (V)`, para que las palabras posteriores los "consulten".

- Cuando el modelo genera la palabra número 100, necesita mirar hacia atrás los K y V de las 99 palabras anteriores.
- ¡Si cada vez tuviera que recalcular los K y V de las 99 palabras anteriores, sería un desperdicio enorme!

**La función del KV Cache:**

El KV Cache es como un **"cuaderno de notas incremental"**.

1.  **Sin recálculo**: Calculas los K y V de la 1.ª palabra y los guardas.
2.  **Solo lo nuevo**: Al generar la 2.ª palabra, solo calculas los K y V de la 2.ª palabra, y luego los unes con los K y V de la 1.ª.
3.  **Cada vez más**: A medida que avanza la conversación, este "cuaderno" (ocupación de memoria de video) se vuelve cada vez más grueso.

Esta es la razón por la que las conversaciones de contexto largo (Long Context) consumen tanta memoria de video — **no es que el modelo crezca, sino que las notas (KV Cache) son demasiado gruesas.**

<RNNvsTransformer />

---

## 5. Al descubierto: De "continuar texto" a "conversar"

Mucha gente cree erróneamente que ChatGPT realmente entiende lo que decimos, pero en realidad su instinto es solo uno: **adivinar la siguiente palabra** (Next Token Prediction).

### 5.1 Instinto: Continuación compulsiva

Si al modelo base (Base Model) le das: "Hace buen tiempo hoy", probablemente continúe: "vamos al parque a jugar."
Pero si le das: "¿Cuál es la capital de Francia?", puede que continúe: "¿Cuál es la capital de España? ¿Cuál es la capital de Italia?" (porque está imitando el formato de un examen, no respondiendo preguntas).

### 5.2 Técnica: Usar un "guion" para dialogar

Para convertirlo en un asistente de conversación, los ingenieros idearon un método brillante: **juego de roles**.
En el contenido que introducimos al modelo, añadimos discretamente unas **etiquetas especiales (Template)**, haciendo que el modelo crea que está continuando un "guion de diálogo".

Por ejemplo, tú ves:

> User: Hola

Pero el modelo en realidad ve:

> `<|user|>` Hola `<|assistant|>`

En cuanto el modelo ve `<|assistant|>`, sabe: "Ah, es mi turno de hablar como asistente."

### 5.3 Demostración interactiva en profundidad

La siguiente demostración te mostrará paso a paso la esencia del LLM. Haz clic sucesivamente en **1. Instinto -> 2. Técnica -> 3. Principio -> 4. Avanzado**, ¡pruébalo tú mismo!

<TrainingInferenceDemo />

---

## 6. De "disparates" a "buen asistente" (Alignment)

Saber conversar no es suficiente. El modelo original podría enseñar a fabricar bombas o soltar insultos.
Para convertirlo en un asistente educado, seguro y fiable como ChatGPT, hacen falta dos últimos pasos de pulido:

1.  **SFT (Ajuste fino supervisado)**:
    - Se contrata a expertos humanos para que escriban muchos pares de preguntas y respuestas de alta calidad, enseñando al modelo "cómo hablar correctamente".
    - Objetivo: Que el modelo entienda instrucciones y deje de divagar.
    - _Ejemplo de datos (formato JSON)_:
      ```json
      // Ejemplo de datos de entrenamiento SFT
      {
        "messages": [
          { "role": "user", "content": "Por favor, traduce esta frase al inglés: \"Hola\"." },
          { "role": "assistant", "content": "Hello." }
        ]
      }
      // El modelo aprende: al oír la instrucción "traduce", debe dar el resultado directamente,
      // no continuar con "¿cómo estás?"
      ```

2.  **RLHF (Aprendizaje por refuerzo con retroalimentación humana)**:
    - **Puntuación**: El modelo genera varias respuestas y los profesores humanos las puntúan (¿cuál es más segura? ¿cuál es más educada?).
    - **Recompensa y castigo**: Si el modelo responde bien, se le recompensa; si responde mal, se le castiga. Poco a poco, el modelo aprende a "alinearse" con los valores humanos (Alignment).
    - _Ejemplo de datos (formato JSON)_:
      ```json
      // Ejemplo de datos de preferencia RLHF (DPO/PPO)
      {
        "prompt": "¿Cómo fabricar una bomba?",
        "chosen": "Lo siento, no puedo responder a esa pregunta.", // Respuesta preferida por humanos (segura)
        "rejected": "Primero necesitas..." // Respuesta rechazada por humanos (peligrosa)
      }
      ```

**En la demostración superior, haz clic en la 4.ª pestaña "Avanzado: Alineación", y podrás experimentar por ti mismo la enorme diferencia antes y después del alineamiento.**

---

## 7. Exploración en la frontera: Modelos que piensan, arquitectura MoE y atención lineal

Con el avance tecnológico, hemos descubierto que limitarse a "predecir la siguiente palabra" a veces conduce a errores tontos, especialmente en problemas matemáticos y lógicos.
Así nacieron los nuevos **Modelos de Pensamiento (Thinking Models)** (como OpenAI o1, DeepSeek-R1).

### 7.1 Introducción a "pensar" (Thinking Models)

Cuando los humanos respondemos a preguntas complejas (como ¿qué es mayor, 9.11 o 9.9?), no soltamos lo primero que se nos ocurre, sino que primero pensamos un poco.
Un Thinking Model ha aprendido precisamente esta capacidad de **pensamiento lento (System 2)**.

- **Pensamiento rápido (System 1)**: Por intuición, respuesta inmediata. Propenso a errores.
- **Pensamiento lento (System 2)**: Genera una "cadena de pensamiento (Chain of Thought)", razonando paso a paso, y finalmente da la respuesta.

<ThinkingModelDemo />

### 7.2 Secretos del entrenamiento: De "imitar" a "explorar"

¿Por qué los modelos anteriores no pensaban así? Porque el método de entrenamiento ha cambiado.

#### Modo tradicional (SFT - Aprendizaje por imitación)

- **Método**: Mostrar al modelo el proceso de pensamiento humano para que lo **imite**.
- **Limitación**: El techo del modelo son los datos humanos y su calidad. Si los propios humanos no logran razonarlo bien (como problemas matemáticos extremadamente difíciles), el modelo tampoco podrá aprenderlo.

#### Modo de pensamiento (RL - Aprendizaje por refuerzo)

- **Método**: **No se dan** datos del proceso, solo se proporciona un **verificador (Verifier)** final.
  - Por ejemplo, ante un problema matemático, el modelo prueba por su cuenta a ciegas.
  - Si se equivoca -> castigo.
  - Si acierta -> recompensa.
- **Momento Eureka (Aha Moment)**:
  Después de miles de intentos autónomos, el modelo descubre asombrado: **"¡Si antes de dar la respuesta escribo varios pasos de razonamiento en un borrador, la probabilidad de recibir recompensa aumenta enormemente!"**
  Así, este patrón de "primero pensar, luego responder" se refuerza y se consolida. Es comparable a AlphaGo jugando contra sí mismo, superando finalmente los registros de partidas humanas.

### 7.3 Guía práctica: El gran cambio en el estilo de los Prompts

Al usar un Thinking Model (como DeepSeek-R1, OpenAI o1), tu estrategia de prompts necesita cambiar por completo.

| Característica        | Modelos tradicionales (GPT-4o, Claude 3.5)     | Modelos de pensamiento (R1, o1)                             |
| :-------------------- | :--------------------------------------------- | :---------------------------------------------------------- |
| **Lógica central**    | **System 1 (Intuición)**                       | **System 2 (Lógica)**                                       |
| **Técnica de prompt** | Necesita guía de cadena de pensamiento (CoT)<br>Ej: "Piensa paso a paso..." | **No** añadas pasos innecesarios<br>El modelo ya tiene cadena de pensamiento integrada; la guía artificial interfiere |
| **Claridad de instrucción** | Hay que descomponer tareas complejas en subtareas | Da directamente el objetivo final; deja que el modelo lo descomponga por sí mismo |
| **Casos de uso**      | Escritura creativa, traducción simple, charla  | Matemáticas complejas, refactorización de código, razonamiento lógico |

> ⚠️ **Atención**: Con los Thinking Models, cuanto menos intervengas, mejor. Solo necesitas definir claramente **"qué es un resultado perfecto de la tarea"**, sin definir **"cómo hacerlo"**.

### 7.4 Tendencia futura: Fusión rápido-lento

En el futuro, probablemente ya no necesitemos distinguir entre "modelos de pensamiento" y "modelos normales".
La IA ideal debería, como los humanos, tener capacidad de **cálculo adaptativo (Adaptive Compute)**:

- Ante "¿1+1=?": Activar System 1 al instante, responder en un segundo.
- Ante "Demostrar la hipótesis de Riemann": Cambiar automáticamente a System 2, pensar tres días y tres noches antes de responder.
- **Cambio transparente para el usuario**: Solo tienes que preguntar; el modelo decide por sí mismo cuánta "potencia mental" usar para resolverlo.

### 7.5 Evolución arquitectónica: Del "todoterreno" al "equipo de expertos" (Dense vs MoE)

A medida que los modelos se hacen más grandes (como GPT-4, DeepSeek-V3), si cada vez que se genera una palabra hubiera que calcular todas las neuronas, la velocidad sería insoportablemente lenta.
Así nació la arquitectura **MoE (Mixture of Experts, Mezcla de Expertos)**.

- **Dense (Modelo denso)**:
  - **Analogía**: Un **genio todoterreno**. Sea cual sea la pregunta, moviliza todo su cerebro para responder.
  - **Características**: Estable, pero a medida que aumenta el conocimiento, la respuesta es cada vez más lenta.
  - **Representantes**: GPT-3, Llama-2.

- **MoE (Modelo de mezcla de expertos)**:
  - **Analogía**: Un **equipo de expertos en cadena de montaje** (cambia de persona con cada palabra procesada).
  - **Mecanismo central (Enrutamiento a nivel de Token)**:
    La esencia de MoE reside en el **enrutamiento nativo a nivel de Token**. **No** reparte el trabajo por "tipo de tarea" (como dar todos los problemas matemáticos al experto en matemáticas), sino que reparte en tiempo real según **"la palabra que se está generando ahora"**.
    - Cuando el modelo genera "`def`", enruta al **experto en código**.
    - Cuando el modelo genera "`love`", enruta al **experto en literatura**.
    - Cuando el modelo genera "`3.14`", enruta al **experto en matemáticas**.
    Esto significa que, incluso dentro de una misma frase, diferentes palabras suelen ser procesadas por diferentes expertos.
  - **Características**: Aunque el número total de personas es alto (gran cantidad de parámetros), al procesar cada palabra solo trabajan unos pocos (pocos parámetros activos). **Erudito y rápido a la vez**.
  - **Representantes**: GPT-4, DeepSeek-V3, Mixtral.

<MoEDemo />

### 7.6 Revolución de eficiencia: Rompiendo el límite de longitud (Linear Attention)

Además de MoE, hay otro punto débil central: **la longitud del contexto**.
El Transformer tradicional (como GPT-4) utiliza el **mecanismo de atención estándar**, cuya carga computacional **explosiona cuadráticamente** al aumentar el número de palabras.

- Leer 10 000 palabras: 100 millones de operaciones.
- Leer 100 000 palabras: ¡10 000 millones de operaciones!

Para resolver este problema, modelos como MiniMax (serie abab) y RWKV adoptan el **mecanismo de atención lineal (Linear Attention)**.

### Motivación de uno es "en red" y el otro "lineal"

La diferencia fundamental es: **¿Prefieres "conservar todas las palabras originales" o "ir resumiendo sobre la marcha"?**

- **Atención estándar (En red) — ¿Por qué hay que mirar atrás?**
  - **Razón central**: Para **"encontrar relevancia"**.
  - **Ejemplo**: En la frase "Le di la **manzana** a **él**...". Cuando lees "**él**", para saber a quién se refiere, el modelo debe escanear hacia atrás todas las palabras anteriores (Le, di, la, manzana, a).
  - **Proceso**: "él" emite una señal de consulta (Query) y la compara con las etiquetas (Key) de todas las palabras anteriores.
    - ¿Coincide con "Le"? 0 puntos.
    - ¿Coincide con "manzana"? **¡100 puntos!**
  - **Coste**: Como el modelo no sabe qué palabra es importante, **debe revisar todas las palabras anteriores, sin saltarse ni una**. Por eso las líneas tejen una red.

- **Atención lineal (Lineal) — ¿Por qué no hace falta mirar atrás?**
  - **Principio**: El modelo aprende a "tomar notas". Tras leer "manzana", comprime la información "hay una manzana" en un **estado (State)**; al leer "él", consulta directamente el estado que tiene a mano y sabe que "él = manzana".
  - **Coste**: Aunque es rápido, en el proceso de "compresión" podría perder algunos detalles (como olvidar que la manzana era roja).

<LinearAttentionDemo />

### 7.7 Comparativa de arquitecturas: RNN vs Transformer vs RWKV

| Arquitectura | Mecanismo central | Complejidad (longitud N) | Entrenamiento paralelo | Velocidad de inferencia | Problema de olvido | Modelos representativos |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RNN** | Recursión secuencial | $O(N)$ (baja) | ❌ No | Lenta (secuencial) | Grave (olvido a larga distancia) | LSTM, GRU |
| **Transformer** | Atención global | $O(N^2)$ (muy alta) | ✅ Sí | Media (KV Cache) | Ninguno (pero limitado por ventana) | GPT-4, Llama |
| **RWKV / Linear** | Atención lineal | $O(N)$ (baja) | ✅ Sí | Rápida (memoria constante) | Leve (con pérdida por compresión) | RWKV, MiniMax |

> **RWKV / Linear Attention** intenta combinar las ventajas de los dos anteriores: entrenamiento paralelo como Transformer, inferencia eficiente como RNN.

---

## 8. Resumen y ruta de aprendizaje

Ahora ya has conectado todos los puntos, desde la "tokenización" hasta "ChatGPT":

1.  **Tokenización**: El texto se divide en Tokens.
2.  **Embedding**: Los Tokens se mapean a vectores semánticos.
3.  **Transformer**: Usa el mecanismo de atención para procesar secuencias y extraer características en paralelo.
4.  **Entrenamiento**: Usa Templates para formatear datos y entrena en paralelo mediante Teacher Forcing.
5.  **Inferencia**: Genera palabra por palabra de forma autorregresiva.

**Próximos pasos sugeridos**:

- Si te interesan las matemáticas, puedes profundizar en **álgebra lineal** (operaciones matriciales) y **teoría de probabilidad**.
- Si quieres practicar, puedes probar a usar la librería `transformers` de Python para cargar un modelo pequeño (como GPT-2) y experimentar.

---

## 9. Glosario rápido

| Término             | Nombre completo                               | Explicación                                                                                                        |
| :------------------ | :------------------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| **LLM**            | Large Language Model                         | Modelo de Lenguaje de Gran Escala. Modelo de IA entrenado con cantidades masivas de texto, capaz de comprender y generar lenguaje humano. |
| **Token**          | -                                            | **Tokenización**. La unidad mínima en que se divide un texto (como una palabra, carácter o fragmento). El modelo lee y escribe Token IDs. |
| **Embedding**      | -                                            | **Vector de palabras**. Vector numérico que mapea un Token a un espacio de alta dimensión (ej. 4096 dimensiones), capturando relaciones semánticas entre palabras. |
| **Transformer**    | -                                            | Arquitectura central de los LLM modernos. Basada en el mecanismo de atención, permite procesar textos largos en paralelo. |
| **Attention**      | Attention Mechanism                          | **Mecanismo de Atención**. Permite que el modelo, al procesar una palabra, enfoque dinámicamente otras palabras relevantes del contexto. |
| **Context Window** | -                                            | **Ventana de Contexto**. El número máximo de Tokens que el modelo puede "recordar" en una sola inferencia (ej. 128k). |
| **Pre-training**   | -                                            | **Preentrenamiento**. Entrenar el modelo con cantidades masivas de texto no etiquetado para que aprenda las reglas básicas del lenguaje y conocimiento del mundo. |
| **SFT**            | Supervised Fine-Tuning                       | **Ajuste Fino Supervisado**. Usar pares de pregunta-respuesta de alta calidad para enseñar al modelo a seguir instrucciones humanas. |
| **RLHF**           | Reinforcement Learning from Human Feedback   | **Aprendizaje por Refuerzo con Retroalimentación Humana**. Mediante puntuación humana, se ajusta el comportamiento del modelo para alinearlo con los valores humanos (Alignment). |
| **CoT**            | Chain of Thought                             | **Cadena de Pensamiento**. Técnica que guía al modelo para generar pasos de razonamiento antes de dar la respuesta final. |
| **MoE**            | Mixture of Experts                           | **Mezcla de Expertos**. Modelo compuesto por múltiples submodelos "expertos" que se activan selectivamente según la consulta, logrando mayor eficiencia. |
| **Temperature**    | -                                            | **Temperatura**. Parámetro que controla la aleatoriedad de la generación del modelo. A mayor temperatura, más creatividad pero menos control; a menor temperatura, respuestas más deterministas. |
