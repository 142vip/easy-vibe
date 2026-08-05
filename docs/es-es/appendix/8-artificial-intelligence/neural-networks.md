# Fundamentos de redes neuronales y aprendizaje profundo

::: tip Prefacio
**Las redes neuronales son el motor de la revolución de la IA.** Desde la comprensión del lenguaje de ChatGPT hasta el reconocimiento de imágenes en la conducción autónoma, las redes neuronales están detrás de todo. No es magia, sino un elegante marco matemático que "aprende" la relación entre entradas y salidas a partir de grandes volúmenes de datos. Comprender sus principios básicos te ayudará a usar y depurar mejor las herramientas de IA.
:::

**¿Qué aprenderás en este artículo?**

Al terminar este capítulo, obtendrás:

- **Conceptos clave**: comprender los principios básicos de las neuronas, capas, propagación hacia adelante y retropropagación
- **Tipos de redes**: conocer las características y escenarios de uso de arquitecturas principales como CNN, RNN y Transformer
- **Proceso de entrenamiento**: entender cómo un modelo "aprende" a partir de los datos
- **Técnicas esenciales**: dominar conceptos prácticos como sobreajuste, tasa de aprendizaje y regularización
- **Evolución histórica**: conocer el recorrido desde el perceptrón hasta los grandes modelos de lenguaje

| Capítulo | Contenido | Conceptos clave |
|----------|-----------|-----------------|
| **Capítulo 1** | De la neurona a la red | Perceptrón, función de activación, propagación hacia adelante |
| **Capítulo 2** | Cómo aprende la red | Función de pérdida, descenso de gradiente, retropropagación |
| **Capítulo 3** | Arquitecturas principales | CNN, RNN, Transformer |
| **Capítulo 4** | El arte del entrenamiento | Sobreajuste, regularización, ajuste de hiperparámetros |
| **Capítulo 5** | Historia y fronteras | Del perceptrón a GPT |

---

## 1. De la neurona a la red

### La neurona individual

La unidad más pequeña de una red neuronal es la **neurona** (Neuron). Simula el funcionamiento de una neurona biológica: recibe múltiples señales de entrada, calcula una suma ponderada y produce una salida mediante una función de activación.

```
Entrada x1 ──→ ×w1 ──┐
Entrada x2 ──→ ×w2 ──┼──→ Σ(suma ponderada) + b(sesgo) ──→ f(función de activación) ──→ Salida
Entrada x3 ──→ ×w3 ──┘
```

Expresión matemática: **y = f(w₁x₁ + w₂x₂ + w₃x₃ + b)**

<NeuronDemo />

### Función de activación: Motivación de no linealidad

Sin una función de activación, por muchas capas de neuronas que se apilen, el resultado siempre equivale a una transformación lineal (multiplicación de matrices). La función de activación introduce **no linealidad**, permitiendo que la red aprenda patrones complejos.

| Función de activación | Fórmula | Características | Uso común |
|-----------------------|---------|-----------------|-----------|
| ReLU | max(0, x) | Simple, eficiente, entrenamiento rápido | Opción por defecto para capas ocultas |
| Sigmoid | 1/(1+e⁻ˣ) | Salida entre 0 y 1 | Capa de salida para clasificación binaria |
| Tanh | (eˣ-e⁻ˣ)/(eˣ+e⁻ˣ) | Salida entre -1 y 1 | Común en RNN |
| Softmax | eˣᵢ/Σeˣⱼ | Salida como distribución de probabilidad | Capa de salida para clasificación múltiple |

### De la neurona a la red

Organizando múltiples neuronas en **capas** y conectando varias capas en serie, se construye una red neuronal:

```
Capa de entrada        Capa oculta 1       Capa oculta 2       Capa de salida
(características)    (extrae rasgos       (extrae rasgos       (resultado de
                      de bajo nivel)       de alto nivel)       predicción)

 x1 ──→  [○ ○ ○ ○] ──→ [○ ○ ○] ──→  [○ ○]
 x2 ──→  [○ ○ ○ ○] ──→ [○ ○ ○] ──→  gato/perro
 x3 ──→  [○ ○ ○ ○] ──→ [○ ○ ○]
```

| Concepto | Descripción |
|----------|-------------|
| Capa de entrada | Recibe los datos originales (píxeles de imagen, vectores de texto, etc.) |
| Capa oculta | Capa de procesamiento intermedio; cuantas más capas, más "profunda" es la red (el "profundo" del aprendizaje profundo) |
| Capa de salida | Genera la predicción final (probabilidad de clase, valor de regresión, etc.) |
| Propagación hacia adelante | Proceso por el cual los datos fluyen desde la capa de entrada hasta la de salida |

::: tip ¿Por qué se llama aprendizaje "profundo"?
El aprendizaje automático tradicional suele tener solo 1 o 2 capas. Cuando el número de capas ocultas aumenta a decenas o incluso cientos, se denomina aprendizaje "profundo". Las redes más profundas pueden aprender características más abstractas: la primera capa aprende bordes, la segunda texturas, la tercera partes de objetos, y las capas más profundas aprenden "esto es un gato".
:::

---

## 2. Cómo aprende la red

El "aprendizaje" de una red neuronal es esencialmente un **problema de optimización**: encontrar un conjunto de pesos (w) y sesgos (b) que hagan que las predicciones de la red se aproximen lo más posible a la respuesta real.

### Los tres pasos del entrenamiento

```
1. Propagación hacia adelante: introducir datos, obtener predicciones
2. Cálculo de la pérdida: usar la función de pérdida para medir la diferencia entre predicción y valor real
3. Retropropagación: según la pérdida, calcular el gradiente de cada peso y actualizarlo
   ↓
Repetir los pasos anteriores hasta que la pérdida sea suficientemente pequeña
```

### Función de pérdida: medir "cuán equivocada está"

La función de pérdida (Loss Function) cuantifica la diferencia entre los valores predichos y los reales. El objetivo del entrenamiento es minimizar la pérdida.

| Función de pérdida | Fórmula resumida | Escenario de uso |
|--------------------|------------------|------------------|
| MSE (Error cuadrático medio) | Media del cuadrado de la diferencia entre valor predicho y real | Problemas de regresión |
| Cross-Entropy (Entropía cruzada) | -Σ y·log(ŷ) | Problemas de clasificación |
| Binary Cross-Entropy | Versión binaria de la entropía cruzada | Problemas de clasificación binaria |

### Descenso de gradiente: encontrar el punto más bajo

Imagina que estás en una montaña con los ojos vendados y necesitas llegar al punto más bajo. Lo único que puedes hacer es **palpar la pendiente bajo tus pies y dar un paso cuesta abajo**. Esto es el descenso de gradiente.

```
Valor de pérdida
  ↑
  │    ╱╲
  │   ╱  ╲      ← Posición actual
  │  ╱    ╲    ↙ Descender en dirección del gradiente
  │ ╱      ╲╱   ← Mínimo local
  │╱            ╲╱  ← Mínimo global
  └──────────────→ Valor del peso
```

| Concepto | Descripción |
|----------|-------------|
| Gradiente | Derivada parcial de la función de pérdida respecto a cada peso; indica "en qué dirección ajustar para reducir la pérdida" |
| Tasa de aprendizaje | Cuánto avanzar en cada paso. Demasiado grande saltará el mínimo; demasiado pequeña convergerá muy lento |
| Tamaño de lote | Cuántas muestras usar para calcular el gradiente en cada paso. El conjunto completo es lento, una sola muestra es inestable; el mini-lote (mini-batch) es el punto intermedio |

### Retropropagación: el triunfo de la regla de la cadena

La retropropagación (Backpropagation) es un algoritmo eficiente para calcular gradientes. Utiliza la **regla de la cadena** del cálculo, comenzando desde la capa de salida y retrocediendo capa por capa para calcular la contribución de cada peso a la pérdida.

```
Propagación hacia adelante: Entrada → Capa oculta 1 → Capa oculta 2 → Salida → Pérdida
Retropropagación: Pérdida → Salida → Capa oculta 2 → Capa oculta 1 → Actualizar todos los pesos
```

::: tip Intuición sobre la retropropagación
Imagina la red neuronal como una línea de montaje. El producto (predicción) tiene un defecto (pérdida alta) y necesitas revisar desde la última etapa hacia atrás, verificando cuánto contribuyó cada etapa (cada capa de pesos) al problema final, y luego ajustar según esa contribución. Las que más contribuyen se ajustan más; las que menos, menos.
:::

---

## 3. Arquitecturas principales de redes

Cada tipo de dato necesita una arquitectura de red diferente. Elegir la arquitectura correcta es la mitad del trabajo.

<NetworkLayersDemo />

### 3.1 CNN (Red Neuronal Convolucional)

La CNN es la reina del procesamiento de imágenes. Su idea central: deslizar pequeños núcleos de convolución sobre la imagen para extraer características locales.

```
Imagen de entrada → [Capa convolucional → Activación → Pooling] × N → Capa totalmente conectada → Salida
     28×28              Extraer bordes/texturas/formas                  Resultado de clasificación
```

| Característica | Descripción |
|----------------|-------------|
| Conexión local | Cada neurona solo observa una pequeña región, no toda la imagen |
| Parámetros compartidos | El mismo núcleo de convolución se reutiliza en toda la imagen, reduciendo drásticamente los parámetros |
| Invarianza a la traslación | Reconoce un gato tanto si está a la izquierda como a la derecha de la imagen |
| Características jerárquicas | Las capas superficiales aprenden bordes; las profundas, semántica |

Modelos representativos: LeNet, AlexNet, VGG, ResNet, EfficientNet

### 3.2 RNN (Red Neuronal Recurrente)

La RNN está diseñada para **datos secuenciales**. Su estado oculto se transmite al siguiente paso temporal, dotando a la red de capacidad de "memoria".

```
Paso temporal t1   Paso temporal t2   Paso temporal t3
    "Yo"  ──→       "amo"   ──→      "gatos"
     ↓                ↓                ↓
    [h1]  ──→       [h2]   ──→       [h3] ──→  Salida
     ↑                ↑                ↑
 El estado oculto se transmite entre pasos temporales (memoria)
```

| Variante | Problema que resuelve | Mecanismo clave |
|----------|-----------------------|-----------------|
| RNN original | Modelado básico de secuencias | Conexión recurrente simple |
| LSTM | Desvanecimiento de gradiente en secuencias largas | Puerta de olvido, puerta de entrada, puerta de salida |
| GRU | Demasiados parámetros en LSTM | Simplificado a puerta de reinicio y puerta de actualización |
| RNN bidireccional | Solo puede ver el pasado | Procesa simultáneamente hacia adelante y hacia atrás |

::: tip El mecanismo de compuertas de LSTM
La genialidad de LSTM reside en sus tres "puertas": la **puerta de olvido** decide qué recuerdos antiguos descartar, la **puerta de entrada** decide qué nueva información almacenar, y la **puerta de salida** decide qué contenido emitir. Es como cuando lees un libro: recuerdas selectivamente las tramas importantes y olvidas los detalles irrelevantes.
:::

### 3.3 Transformer: la atención lo es todo

En 2017, Google publicó el artículo "Attention Is All You Need", proponiendo el Transformer, que cambió radicalmente el campo de la IA. Sustituyó la estructura recurrente por el **mecanismo de autoatención** y es la base de grandes modelos como GPT, BERT y Claude.

```
Secuencia de entrada → Embedding + Codificación posicional → [Atención multicabeza → Red feed-forward] × N → Salida
                                                                   ↑
                                                      Cada palabra puede "ver" todas las demás
```

| Ventaja | Descripción |
|---------|-------------|
| Cómputo paralelo | A diferencia de la RNN que debe procesar paso a paso, el Transformer procesa toda la secuencia en paralelo |
| Dependencias de largo alcance | Establece conexiones directas entre dos posiciones cualesquiera, sin límite de distancia |
| Escalabilidad | Cuanto más grande el modelo y más datos, mejores resultados (Scaling Law) |

**Intuición de la autoatención**: al leer la frase "El gato se sentó en la alfombra porque **él** estaba cansado", "él" necesita atender a "gato" para entender el significado. La autoatención permite al modelo aprender este tipo de asociación, calculando una "puntuación de relevancia" para cada par de palabras en la secuencia.

<NetworkArchitectureDemo />

## 4. El arte del entrenamiento

Tener una buena arquitectura no es suficiente; hay muchas "trampas" que evitar durante el entrenamiento.

### 4.1 Sobreajuste vs. subajuste

| Problema | Síntoma | Causa | Solución |
|----------|---------|-------|----------|
| Sobreajuste | Buen rendimiento en entrenamiento, malo en prueba | Modelo demasiado complejo, "memoriza respuestas" en vez de aprender patrones | Regularización, Dropout, aumento de datos, parada temprana |
| Subajuste | Mal rendimiento tanto en entrenamiento como en prueba | Modelo demasiado simple, no puede aprender los patrones | Aumentar capacidad del modelo, entrenar más tiempo, mejores características |

```
Error
  ↑
  │ ╲  Error de entrenamiento      Error de prueba  ╱
  │  ╲                                              ╱
  │   ╲─────────────────╱
  │   Subajuste ← Punto óptimo → Sobreajuste
  └──────────────────────────→ Complejidad del modelo
```

### 4.2 Hiperparámetros clave

Los hiperparámetros son aquellos que deben configurarse manualmente antes del entrenamiento (no los aprende el modelo por sí mismo):

| Hiperparámetro | Función | Rango común | Consejo de ajuste |
|----------------|---------|-------------|-------------------|
| Tasa de aprendizaje | Magnitud de actualización por paso | 1e-5 ~ 1e-1 | El hiperparámetro más importante; suele empezar desde 1e-3 |
| Tamaño de lote | Cuántas muestras usar por paso de entrenamiento | 16 ~ 512 | Más grande = más estable, pero requiere más memoria de GPU |
| Épocas (Epoch) | Veces que se recorre todo el conjunto de datos | 10 ~ 100+ | Combinar con parada temprana: detenerse cuando la validación no mejore |
| Optimizador | Estrategia de actualización del gradiente | Adam, SGD | Adam es la opción por defecto; SGD+momentum para ajuste fino |

### 4.3 Técnicas de regularización

Métodos habituales para prevenir el sobreajuste:

| Técnica | Principio | Modo de uso |
|---------|-----------|-------------|
| Dropout | Desactiva aleatoriamente algunas neuronas durante el entrenamiento | Típicamente p=0.1~0.5 |
| Decaimiento de pesos | Añade una penalización por magnitud de pesos en la función de pérdida | Regularización L2, λ=1e-4 |
| Aumento de datos | Aplica transformaciones aleatorias a los datos de entrenamiento (volteo, recorte, rotación) | Imprescindible en tareas de imagen |
| Parada temprana | Detiene el entrenamiento cuando la pérdida de validación deja de disminuir | patience=5~10 |
| Batch Normalization | Normaliza la distribución de entrada de cada capa | Acelera la convergencia, con ligero efecto regularizador |

::: tip Reglas empíricas de entrenamiento
1. Primero ejecuta todo el proceso con un conjunto pequeño de datos para confirmar que no hay bugs en el código
2. Empieza haciendo ajuste fino de un modelo preentrenado existente, en lugar de entrenar desde cero
3. La tasa de aprendizaje es el hiperparámetro que más vale la pena ajustar
4. Si la pérdida de entrenamiento no disminuye, revisa primero los datos y el código, y solo después cuestiona el modelo
:::

---

## 5. Historia y fronteras

El desarrollo de las redes neuronales ha pasado por varios "inviernos" y "renacimientos"; cada avance surgió de una innovación técnica clave.

| Año | Hito | Avance clave |
|-----|------|--------------|
| 1958 | Perceptrón (Perceptron) | El primer modelo de red neuronal, solo capaz de resolver problemas lineales |
| 1986 | Algoritmo de retropropagación | Hizo posible el entrenamiento de redes multicapa |
| 1998 | LeNet (CNN) | Las redes convolucionales triunfaron en el reconocimiento de dígitos manuscritos |
| 2012 | AlexNet | Las CNN profundas arrasaron en ImageNet frente a métodos tradicionales; explosión del aprendizaje profundo |
| 2014 | GAN (Red Generativa Antagónica) | Dos redes compitiendo entre sí, capaces de generar imágenes realistas |
| 2017 | Transformer | "Attention Is All You Need", el mecanismo de atención reemplaza a las RNN |
| 2018 | BERT | Paradigma de preentrenamiento + ajuste fino, avance general en NLP |
| 2020 | GPT-3 | 175 mil millones de parámetros, demostrando las capacidades emergentes de los grandes modelos |
| 2022 | ChatGPT | Técnica de alineación RLHF, la IA llega al gran público |
| 2023+ | Modelos grandes multimodales | GPT-4V, Claude, etc., capaces de entender texto e imágenes simultáneamente |

### Tendencias actuales

| Dirección | Descripción |
|-----------|-------------|
| Grandes modelos (LLM) | Parámetros desde cientos de millones hasta billones, emergen capacidades de razonamiento y programación |
| Multimodalidad | Un mismo modelo procesa texto, imágenes, audio y video |
| Ajuste fino eficiente | Técnicas como LoRA y QLoRA permiten a desarrolladores comunes ajustar grandes modelos |
| Agentes de IA | Los grandes modelos usan herramientas, planifican tareas y completan objetivos complejos de forma autónoma |
| Destilación de modelos pequeños | Usar el conocimiento de modelos grandes para entrenar modelos pequeños que se ejecuten en dispositivos |

::: tip Reflexión para desarrolladores
No necesitas entrenar redes neuronales desde cero. El desarrollo moderno de IA consiste más en **llamar a APIs** (como las de OpenAI o Claude) o **ajustar modelos preentrenados** (por ejemplo, con Hugging Face). Pero entender los principios fundamentales te ayudará a elegir mejor los modelos, diseñar prompts y diagnosticar problemas.
:::

---

## Resumen

| Concepto clave | Resumen en una frase |
|----------------|----------------------|
| Neurona | Suma ponderada + función de activación; la unidad mínima de cómputo de la red |
| Propagación hacia adelante | Los datos fluyen desde la entrada hasta la salida, generando una predicción |
| Retropropagación | Partiendo de la pérdida, se calculan gradientes capa por capa y se actualizan los pesos |
| CNN | Núcleos de convolución extraen características locales; primera opción para procesamiento de imágenes |
| RNN/LSTM | Conexiones recurrentes que mantienen memoria; para procesar datos secuenciales |
| Transformer | Autoatención con procesamiento paralelo; arquitectura base de los grandes modelos |
| Sobreajuste | El modelo "memoriza respuestas"; se previene con regularización, Dropout, etc. |
| Aprendizaje por transferencia | Subirse a hombros de gigantes: usar modelos preentrenados y ajustarlos para nuevos problemas |

---

## Lecturas recomendadas

- [3Blue1Brown - Serie de videos sobre redes neuronales](https://www.3blue1brown.com/topics/neural-networks) — La explicación visual más intuitiva
- [Stanford CS231n](http://cs231n.stanford.edu/) — El curso clásico sobre redes neuronales convolucionales
- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) — Arquitectura Transformer explicada visualmente
- [Neural Networks and Deep Learning](http://neuralnetworksanddeeplearning.com/) — Libro de texto gratuito en línea
- [Curso de Hugging Face](https://huggingface.co/learn) — Práctica hands-on con Transformers y grandes modelos
