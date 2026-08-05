# Introducción a la ingeniería de contexto
> 💡 **Guía de estudio**: La ingeniería de prompts resuelve "cómo expresar las cosas con claridad", mientras que la ingeniería de contexto resuelve "cómo hacer que el modelo vea la información adecuada en el momento adecuado". Este capítulo gira en torno a una pregunta central: **Dentro de una ventana de contexto limitada, ¿cómo lograr que el modelo te entienda sin arruinarte?**

Antes de empezar, te recomendamos repasar dos conceptos fundamentales:

- **Qué es un Token**: puedes leer la sección «Tokenización y Tokens» en [Introducción a los LLM](./llm-principles.md).
- **Qué es un Prompt**: si aún no estás familiarizado con la estructura básica de System / User / Assistant, consulta primero [Ingeniería de Prompts](./prompt-engineering/).

---

## 0. Introducción: Motivación de olvida de las cosas a medida que avanza la conversación y además se vuelve cada vez más caro

<AgentContextFlow />

Muchas personas se encuentran con situaciones similares al usar modelos de lenguaje a gran escala:

- A mitad de la conversación, el modelo de repente "olvida" condiciones clave mencionadas anteriormente;
- En conversaciones largas, las respuestas se contradicen entre sí y resulta difícil mantener una misma configuración;
- A medida que aumentan los turnos de conversación, la factura sube sin parar, como un taxímetro.

Intuitivamente, pensaríamos: **"Este modelo tiene mala memoria"**.
Pero la mayoría de las veces, el problema no es que el modelo "no sepa recordar", sino que **no hemos diseñado adecuadamente el contexto que puede ver**.

<IntroProblemReasonSolution />

Ante estos desafíos, limitarse a "escribir buenos prompts" ya no es suficiente. Necesitamos un enfoque de ingeniería más sistemático para que, dentro de una ventana y un presupuesto limitados, el modelo siempre reciba la información más crítica. Eso es precisamente lo que la **ingeniería de contexto** intenta resolver.

---

## 1. Introducción a "Ingeniería de Contexto" (Definición + Escenarios)

Primero, una definición operativa breve, y luego veremos algunos escenarios típicos.

> La ingeniería de contexto es un método de ingeniería para construir y gestionar el "entorno informativo" de un LLM, que decide "qué ve el modelo, qué ignora y cuándo lo ve", con el fin de completar tareas de forma estable dentro de una ventana de contexto limitada.

En términos simples, puedes entenderla como tres tareas: organizar la información, controlar la ventana y gestionar los costes.
Los escenarios donde se aplica habitualmente incluyen:

- Agentes conversacionales y robots de atención al cliente
- Asistentes de código / documentación
- Llamadas a herramientas en múltiples rondas y orquestación de flujos largos

A continuación, partiremos de las "lecciones aprendidas a base de sangre y lágrimas" de un equipo real, para ver cómo evolucionaron poco a poco desde "solo saber escribir Prompts" hasta "dominar la ingeniería de contexto".

---

## 2. Empecemos por las "lecciones dolorosas": Los tropiezos del equipo de Manus

El caso de este capítulo proviene de **Manus** (un Agente de IA de propósito general).
A diferencia de una conversación normal, Manus necesita planificar de forma autónoma y llamar a herramientas para completar tareas largas (que implican decenas o incluso cientos de rondas de interacción).

Esto genera un conflicto central:
- **Si no se recuerda nada**: se pierde información crítica y la tarea se interrumpe.
- **Si se recuerda todo**: el coste y la latencia se disparan, e incluso se supera el límite de la ventana.

El equipo de Manus pasó por múltiples reconstrucciones de arquitectura antes de comprender una verdad: **el contexto no se puede limitar a "escribirse", sino que debe "diseñarse".**

### 2.1 Qué nos enseñan las cuatro reconstrucciones

El cofundador de Manus, Ji Yichao, compartió su "historial de tropiezos":

| Fase | Problema encontrado | Idea del momento | Resultado |
| :--- | :--- | :--- | :--- |
| **Primera** | La IA se olvidaba de las cosas al avanzar la conversación | "Escribamos prompts más largos" | Cada vez más largos, cada vez más caros |
| **Segunda** | La información importante siempre quedaba desplazada | "Copiemos varias veces lo importante" | Textos aún más largos, costes aún más altos |
| **Tercera** | La factura era alarmantemente alta | "¿Podemos reutilizar cálculos anteriores?" | Encontraron la forma de reducir el coste de los cálculos repetidos |
| **Cuarta** | No se podían procesar documentos largos | "¿Y si consultamos solo cuando sea necesario?" | Establecieron un esquema de "biblioteca + consulta bajo demanda" |

**Conclusión clave**: **No se trata de recordar más, sino de recordar mejor**.

### 2.2 A qué se parece realmente la "memoria" de la IA

**La memoria RAM tradicional** = **Disco duro**:
- Gran capacidad: puede almacenar grandes cantidades de datos a largo plazo;
- Bajo coste: almacenar durante un año cuesta relativamente poco;
- La velocidad de lectura/escritura es relativamente lenta, buscar información lleva su tiempo.

**El contexto de la IA** = **Una pizarra pequeña**:
- Lectura/escritura rápida: el modelo puede ver todo el contexto directamente en una sola llamada;
- Capacidad limitada: cuando se llena, hay que borrar contenido antiguo;
- Cada token escrito conlleva cálculo y coste adicional.

**La experiencia de Manus**: **La pizarra debe usarse con moderación e inteligencia, no para almacenar una enciclopedia**.

---

## 3. Primer paso: Conocer los costes - A dónde va cada céntimo

### 3.1 Motivación para por los costes

Veamos cómo se gasta el dinero en una conversación típica con IA:

```
💰 Estructura de costes (una conversación):
├─ 70% Releer contenido antiguo ("¿De qué estábamos hablando?")
├─ 20% Procesar contenido nuevo ("¿Qué se dice ahora?")
└─ 10% Generar respuesta ("¿Cómo responder?")
```

**Hallazgo sorprendente**: **¡El 70% del dinero se gasta en hacer que la IA relea lo que ya habías dicho antes!**

### 3.2 Introducción a KV Cache (Reutilización de prefijos)

Antes de hablar de precios, necesitamos entender un concepto técnico clave: **KV Cache (Caché Clave-Valor)**.
No te asustes por el nombre técnico; en realidad es la "tabla de referencia rápida de memoria a corto plazo" de la IA.

- **Sin KV Cache**: La IA tiene que volver a leer, comprender y calcular desde la primera palabra, como si viera el artículo por primera vez cada vez.
- **Con KV Cache**: La IA guarda los resultados de cálculo de las partes ya procesadas (Pre-fill). La próxima vez, si el contenido del principio no ha cambiado, recupera directamente la memoria sin necesidad de recalcular.

Es como:
> Vas a hacer un examen.
> **Caso A**: Cada vez tienes que leer el libro de texto entero desde el principio antes de empezar a responder. (Lento, agotador, caro)
> **Caso B**: Ya te sabes el libro de memoria (Cache), te sientas y respondes directamente. (Rápido, fácil, barato)

En la tabla de tarifas de los proveedores cloud, **"lo ya memorizado" (Cache Hit)** suele ser más de un 90% más barato que **"lo leído por primera vez" (Cache Miss)**.

### 3.3 La diferencia de precio entre "leer por primera vez" y "usar lo memorizado"

Tomando Claude como ejemplo:
- **Leer por primera vez** (sin caché): $3.00 / millón de tokens
- **Usar lo memorizado** (con caché): $0.30 / millón de tokens
- **¡Una diferencia de 10 veces**!

**La práctica de Manus**: Al hacer que la IA "memorice el texto", redujeron su coste de **$0.15 a $0.02**, **¡un ahorro del 87%**!

<ContextWindowVisualizer />

### 3.4 Guía para evitar trampas: No dejes que la marca de tiempo arruine tu "caché"

Muchos desarrolladores tienen la costumbre de poner la "hora actual" en la primera línea del System Prompt, pensando que así son más rigurosos.
**Pero esta es una de las mayores anti-patrones en la ingeniería de contexto.**

Imagina esto: te has memorizado un libro de historia entero (System Prompt), pero la primera línea del libro es "el segundo actual".
Si esa línea cambia cada segundo, todo lo que memorizaste hace un segundo queda invalidado al instante: tendrías que volver a memorizarlo desde el principio.

Este es el punto débil de la **reutilización de prefijos (KV Cache)**: **si el principio cambia, todo lo que viene después debe recalcularse.**

#### Ejemplo incorrecto: poner la información dinámica al principio
```text
System: Ahora son las 2024-01-01 12:00:01. Eres un asistente...
(Un minuto después)
System: Ahora son las 2024-01-01 12:01:01. Eres un asistente...
```
**Consecuencia**: Aunque solo hayan cambiado unos pocos caracteres, al estar al principio, el 99% restante del contenido fijo no puede reutilizar la caché, y cada petición es tan lenta y cara como la primera.

#### Forma correcta: separar lo estático de lo dinámico
```text
System: Eres un asistente... (aquí van miles de caracteres de reglas fijas, base de conocimiento)
User: (Aquí se pasa la hora actual mediante una llamada a herramienta o mensaje del usuario)
```
**Beneficio**: Los miles de caracteres de reglas al principio nunca cambian, la IA solo necesita "memorizarlos" una vez. Las peticiones posteriores usan directamente la memoria, con una velocidad altísima.

👇 **Pruébalo**:
Activa el interruptor de abajo para habilitar la **"aceleración por memorización"**, y luego pulsa "Enviar nueva petición" varias veces.
Observa: cuando el primer bloque de contenido pasa a estar "memorizado", ¿qué le sucede al **tiempo hasta el primer token (TTFT)**?

<KVCacheDemo />

---

## 4. Segundo paso: Ventana deslizante - Cuando la "memoria" se convierte en "coste"

A medida que la conversación se alarga, el primer problema que aparece es: **¿Qué hacer cuando la ventana se llena?**

### 4.1 Motivación de "el primero en entrar, primero en salir" causa problemas

La gestión de memoria más simple es la **ventana deslizante (Sliding Window)**: **lo nuevo entra, lo viejo sale**.
Suena justo, pero en tareas reales es un desastre.

**Recreación de la escena**:
```text
Historial de conversación:
[1] Usuario: Soy Zhang San, responsable del sistema de pagos
[2] Usuario: El proyecto se desarrolla en Go
[3] Usuario: La base de datos es PostgreSQL
...
[20] Usuario: Escríbeme una API
```
**Resultado**: Cuando se llega a la frase 20, la frase 1 "Soy Zhang San" ya ha sido expulsada de la ventana. La IA ha olvidado por completo quién eres y de qué sistema eres responsable.

**La esencia del problema**: Esta estrategia trata por igual la **información importante** (identidad, stack tecnológico) y el **ruido** ("vale", "recibido"), expulsándolos juntos.

### 4.2 "Amnesia del medio" - Por qué la IA nunca ve la información clave

Además de "olvidar rápido", la IA tiene otra peculiaridad: **también "pasa por alto" cosas**.
Los estudios muestran que: **la IA es más sensible al principio y al final, y tiende a ignorar lo que está en medio**. Este es el famoso fenómeno **Lost in the Middle (Perdido en el medio)**.

**Curva de memoria en forma de U**:
```text
Posición: Principio → Medio → Final
Memoria:   Alta     → Baja  → Alta
```

👇 **Pruébalo**:
1. Primero prueba la **"ventana deslizante"**: envía varios mensajes en el cuadro de chat de abajo y observa cómo los mensajes antiguos son "expulsados" sin piedad.
2. Luego mira el efecto **"Perdido en el medio"**: observa, cuando la información clave está escondida en la parte central del texto completo, ¿es la tasa de éxito de recuperación la más baja?

<SlidingWindowDemo />
<LostInMiddleDemo />

**Solución**: Coloca la información clave al **principio** (prompt del sistema) o al **final** (pregunta del usuario).

---

## 5. Tercer paso: Retención selectiva - Cómo "fijar" la información clave

Si "el primero en entrar, primero en salir" no funciona, ¿qué hacemos?
La respuesta de Manus: **establecer un "sistema de clasificación de la información"**.

### 5.1 Motivación de clasificar la información por niveles

En lugar de tratar cada pieza de información por igual, decidimos su permanencia según su importancia:

| Nivel | Tipo de información | Tratamiento | Impacto en coste |
| :--- | :--- | :--- | :--- |
| **VIP** | Configuración del sistema, identidad del usuario | **Conservar siempre** | +15% coste |
| **Importante** | Objetivo de la tarea actual | **Conservar durante la tarea** | +10% coste |
| **Normal** | Historial de conversación normal | **Conservar últimas 5 rondas** | Coste base |
| **Desechable** | Conocimiento recuperable | **Consultar solo cuando se necesite** | -60% coste |

**Idea central**: **Con un 25% de aumento de coste, conservar el 90% de la información clave**.

### 5.2 La estrategia de "clavar con chinchetas"

Puedes imaginar la ventana de contexto como una pizarra:
- **Información VIP**: Sujétala firmemente con chinchetas en la parte superior de la pizarra (System Prompt).
- **Información importante**: Fíjala con imanes en la parte central de la pizarra (Context Injection).
- **Conversación normal**: Escríbela en la mitad inferior de la pizarra, y cuando se llene, borra lo antiguo (Sliding Window).

👇 **Pruébalo**:
Intenta "fijar" un mensaje importante en la demostración de abajo.
Observa: cuando sigas conversando, ¿la información fijada permanece siempre visible, mientras que la no fijada es desplazada?

<SelectiveContextDemo />

---

## 6. Cuarto paso: RAG - Cuando la "memoria" necesita una "biblioteca"

A veces, la cantidad de información que necesitamos procesar es demasiado grande (por ejemplo, cientos de páginas de documentación técnica) y la pizarra simplemente no da abasto. Ahí es cuando necesitamos un cerebro externo: **RAG (Generación Aumentada por Recuperación)**.

### 6.1 Motivación de "pizarra pequeña" no es suficiente

Cuando Manus se enfrentó a documentación técnica de millones de tokens, comparó dos enfoques:

1.  **Carga completa**: Todo el contenido se mete en el contexto de una sola vez.
    *   **Consecuencia**: La pizarra se llena al instante, el procesamiento es lentísimo y, según la teoría del "Perdido en el medio", la IA ni siquiera recuerda lo que está en el medio.
    *   **Coste**: Aproximadamente $50/consulta, con 15 segundos de espera.
2.  **Recuperación bajo demanda (RAG)**: Primero se busca en la biblioteca (base de datos), y solo se copian en la pizarra los fragmentos relevantes.
    *   **Consecuencia**: La pizarra queda despejada, la IA se centra en la información clave.
    *   **Coste**: Aproximadamente $0.5/consulta, con 2 segundos de espera.

**¡Un ahorro del 99% en dinero y del 87% en tiempo!**

### 6.2 Buenas prácticas para "consultar información"

Resumen de la experiencia de Manus:
*   **¿En trozos de qué tamaño dividir cada libro?** Entre 500 y 1000 tokens funciona mejor.
*   **¿Cuántos libros consultar a la vez?** De 3 a 5; más resultan contraproducentes.
*   **¿Con qué nivel de relevancia consultar?** Similitud > 0.7, para evitar "forzar" contenido irrelevante.

👇 **Pruébalo**:
Escribe una pregunta en el cuadro de búsqueda (por ejemplo, "cómo restablecer la contraseña") y observa cómo el sistema encuentra solo los fragmentos más relevantes entre un montón de documentos.

<RAGSimulationDemo />

---

## 7. Quinto paso: Compresión - Cómo escribir más densamente en la "pizarra"

Si toda la información es importante, no se puede eliminar y tampoco quieres consultar en otro sitio, ¿qué se puede hacer?
Solo queda **escribir con letra más pequeña**: eso es la **compresión de contexto**.

### 7.1 Criterios de compresión del contexto
*   El material recuperado es demasiado extenso (> 2000 tokens).
*   El historial de conversación es demasiado verboso (ocupa > 80% del espacio de la pizarra).
*   Se necesita una respuesta rápida y no conviene que la IA lea textos larguísimos.

### 7.2 Los tres niveles de "abreviación"

| Método de compresión | Tasa de compresión | Qué se conserva | Escenario aplicable | Ahorro económico |
| :--- | :--- | :--- | :--- | :--- |
| **Tipo resumen** | 70% | La idea principal | Comprensión rápida | Ahorra 30% |
| **Tipo puntos clave** | 50% | Puntos esenciales | Salida estructurada | Ahorra 50% |
| **Tipo tabla** | 30% | Datos nucleares | Procesamiento por programa | Ahorra 70% |

👇 **Pruébalo**:
Selecciona diferentes estrategias de compresión y observa cómo los textos largos se vuelven más cortos y concisos.

<ContextCompressionDemo />

---

## 8. Integración del sistema: Construir el "Palacio de la Memoria" de la IA

Hasta ahora hemos aprendido, como si montáramos bloques de construcción, diversas estrategias independientes:
*   **KV Cache**: Nos ayuda a ahorrar dinero (Capítulo 3)
*   **Ventana deslizante**: Nos ayuda a liberar espacio (Capítulo 4)
*   **Retención por niveles**: Nos ayuda a conservar lo importante (Capítulo 5)
*   **RAG**: Nos ayuda a usar un cerebro externo (Capítulo 6)

Ahora es el momento de ensamblar estos bloques en un castillo completo: lo llamamos el **"Palacio de la Memoria"** de Manus.

### 8.1 Ensamblar el contexto como quien construye una casa

No trates el contexto como un montón de texto desordenado, míralo como un edificio de varias plantas. Cada planta tiene su función específica y sus propias "reglas de convivencia".

👇 **Pruébalo**:
Haz clic en "Empezar construcción" para ver cómo levantamos este palacio capa por capa.

<MemoryPalaceDemo />

### 8.2 Motivación del diseño arquitectónico

La filosofía de diseño de este palacio busca resolver tres contradicciones fundamentales:

1.  **Cimientos (System Prompt) — Resuelve el problema "caro"**
    *   **Contradicción**: La configuración del sistema (quién eres, cuáles son las reglas) es lo más largo y debe enviarse cada vez.
    *   **Solución**: Colocarla en la capa más baja, aprovechando la tecnología **KV Cache**; mientras no se modifique, la IA puede "recitarla de memoria". En cientos de rondas posteriores, el coste de cálculo de esta parte es prácticamente **0**.

2.  **Pilares (Task Context) — Resuelve el problema del "olvido"**
    *   **Contradicción**: En conversaciones largas, la IA tiende a olvidar el objetivo inicial de la tarea (por ejemplo, "escribir un juego de la serpiente").
    *   **Solución**: Usar la estrategia de **retención por niveles**, "fijando" el objetivo de la tarea en la segunda capa. Sin importar cuántas rondas pasen, esta capa nunca se borra, asegurando que la IA no pierda de vista su propósito.

3.  **Capa superior (Chat & RAG) — Resuelve el problema del "desorden"**
    *   **Contradicción**: Hay tanto conversaciones nuevas como material consultado; si se mezclan, todo se vuelve confuso.
    *   **Solución**:
        *   **Salón (Conversación)**: Gestionado con **ventana deslizante**, conservando solo las últimas 5-10 frases recientes.
        *   **Biblioteca (RAG)**: El material se usa y se descarta, sin ocupar espacio permanente.

### 8.3 Resultados en producción

Cuando el equipo de Manus implementó esta arquitectura en producción, los resultados fueron inmediatos:

*   **Ahorro económico**: Como los cimientos quedan "memorizados", el coste por ronda de conversación se desplomó un **84%**.
*   **Más rápido**: La IA ya no tiene que leer miles de tokens desde cero cada vez; el tiempo medio de respuesta pasó de 8 segundos a **2 segundos**.
*   **Más preciso**: La información clave queda "fijada", así que nunca más se olvida de cuál es su función a mitad de la conversación.

---

## 9. Plantillas prácticas: Copia directamente

Para que entiendas de forma más intuitiva cómo funciona este mecanismo, hemos preparado una **simulación completa del flujo**.

Elige un escenario, haz clic en "Siguiente" y observa cómo, en los pocos segundos que transcurren entre la pregunta del usuario y la respuesta de la IA, el **Palacio de la Memoria** recupera, ensambla y limpia el contexto de forma dinámica.

<MemoryPalaceActionDemo />

### 📝 Diseños listos para usar

Si vas a diseñar un sistema similar a Manus, no te centres solo en cómo escribir el Prompt, sino también en **cómo la arquitectura del sistema orquesta el contexto**.

A continuación se presentan los **planos de diseño del sistema** para dos escenarios clásicos, que incluyen **diseño de prompts** y **lógica de código (pseudocódigo)**.

#### Escenario 1: Agente Ingeniero Full Stack (memoria de larga duración)
> **Desafío central**: El ciclo de la tarea es largo y resulta fácil olvidar los requisitos iniciales y el contexto del proyecto.
> **Estrategia**: Capa System (identidad) + Capa Task (objetivo fijado) + Capa Chat (ventana deslizante).

**1. Prompt del sistema (Capa 1 y 2)**
```markdown
# Capa 1: Configuración de identidad (System Prompt) - Nunca cambia, aprovecha KV Cache
Eres un ingeniero full stack senior, experto en Python y Vue3.
Estilo de código:
- Nombres de variables siguiendo estrictamente PEP8
- La lógica clave debe incluir comentarios
- Priorizar las funciones de utilidad existentes en el proyecto

# Capa 2: Bloqueo de tarea (Task Context) - No se permite borrar durante la tarea
Tarea actual: Refactorizar el módulo de pagos (payment_module)
Restricciones clave:
1. Debe ser compatible con la API antigua v1.0
2. Los scripts de migración de base de datos deben ser idempotentes
3. Fecha límite: este viernes
```

**2. Lógica de ensamblaje de contexto (Pseudocódigo)**
```python
def build_engineer_context(user_input, chat_history, task_info):
    context = []

    # 1. Capa de cimientos: Configuración de identidad (cacheada con KV Cache)
    # Este contenido no cambia en cientos de rondas, el coste de cálculo es casi 0
    context.append(SYSTEM_PROMPT)

    # 2. Capa de pilares: Bloqueo de tarea (Fijado)
    # Sin importar lo larga que sea la conversación, esta parte se inserta siempre después del System
    context.append(f"Tarea actual: {task_info}")

    # 3. Capa de recuperación: Fragmentos de código (RAG)
    # Según la pregunta del usuario, buscar código relevante en la base de código
    relevant_code = search_codebase(user_input)
    if relevant_code:
        context.append(f"Código de referencia:\n{relevant_code}")

    # 4. Capa de interacción: Historial de conversación (Sliding Window)
    # Solo se toman las últimas 10 rondas, para evitar saturar el contexto
    recent_chat = chat_history[-10:]
    context.extend(recent_chat)

    # 5. Entrada más reciente
    context.append(user_input)

    return context
```

#### Escenario 2: Agente de Atención al Cliente (respuestas precisas)
> **Desafío central**: Sensible al coste y no puede permitirse inventar nada bajo ningún concepto.
> **Estrategia**: Capa System (restricciones fuertes) + Capa RAG (inyección dinámica).

**1. Prompt del sistema (Capa 1)**
```markdown
# Capa 1: Configuración de identidad (System Prompt)
Eres un agente profesional de atención al cliente de comercio electrónico.
Principios de respuesta:
1. Tono amable, profesional y conciso
2. **Prohibido terminantemente** inventar hechos; responde solo basándote en el [material de referencia]
3. Si el material no contiene la respuesta, responde directamente "Lo siento mucho, esta consulta necesita ser transferida a un agente humano"
```

**2. Lógica de ensamblaje de contexto (Pseudocódigo)**
```python
def build_support_context(user_input):
    context = []

    # 1. Capa de cimientos: Configuración de identidad
    context.append(SYSTEM_PROMPT)

    # 2. Capa de biblioteca: Recuperación dinámica (RAG)
    # En atención al cliente, RAG es el protagonista; se coloca en el medio
    docs = vector_db.search(user_input, top_k=3)

    context.append("【Inicio del material de referencia】")
    for doc in docs:
        context.append(doc.content)
    context.append("【Fin del material de referencia】")

    # 3. Capa de interacción: Historial muy corto
    # En atención al cliente, normalmente no se necesita memoria muy lejana; conservar las últimas 3 rondas
    context.extend(get_recent_chat(limit=3))

    context.append(user_input)

    return context
```

---

## 10. Glosario de términos

| Término en inglés | Traducción al español | Explicación |
| :--- | :--- | :--- |
| **Context Window** | Ventana de contexto | La longitud máxima de texto que el modelo puede procesar de una sola vez (incluyendo entrada y salida). El contenido que exceda el límite será truncado u olvidado. |
| **Token** | Token | La unidad mínima de texto que procesa un LLM. Generalmente, 1 token equivale aproximadamente a 0.75 palabras en inglés o 0.5 caracteres chinos. La facturación y los límites de ventana se basan en esta unidad. |
| **KV Cache** | Caché KV | Una técnica de aceleración de inferencia que almacena en caché los pares clave-valor de atención ya calculados, evitando el recálculo de prefijos repetidos y reduciendo significativamente la latencia y el coste. |
| **RAG** | Generación Aumentada por Recuperación | Antes de responder una pregunta, se recupera información relevante de una base de conocimiento externa y se proporciona como contexto al modelo, para reducir las alucinaciones y ampliar los límites del conocimiento. |
| **Sliding Window** | Ventana deslizante | La estrategia más básica de gestión de contexto. Mantiene constante el número de tokens dentro de la ventana; cuando entra contenido nuevo, se elimina automáticamente el contenido más antiguo. |
| **Lost in Middle** | Perdido en el medio | Una limitación de los modelos de lenguaje grandes. Los estudios muestran que el modelo recuerda mejor la información del principio y del final de un contexto largo, y tiende a ignorar la información de la parte central. |
| **System Prompt** | Prompt del sistema | La instrucción situada al inicio de la conversación, utilizada para definir la identidad, las normas de comportamiento, el estilo de respuesta y la tarea central del modelo. |
| **Few-shot** | Aprendizaje con pocos ejemplos | Proporcionar en el prompt varios ejemplos de "pregunta-respuesta" para ayudar al modelo a comprender rápidamente el patrón de la tarea y el formato de salida. |
| **Chain of Thought** | Cadena de pensamiento | Guiar al modelo para que primero exponga los pasos de razonamiento antes de dar la respuesta final. Este enfoque mejora significativamente la capacidad del modelo para resolver problemas complejos de lógica y matemáticas. |
| **Hallucination** | Alucinación | Fenómeno en el que el modelo genera con seguridad información que parece razonable pero que en realidad es errónea o inexistente. |
| **Embedding** | Vectorización | Técnica que convierte texto en vectores numéricos de alta dimensión. Los textos semánticamente similares están más cerca en el espacio vectorial, lo que constituye la base de la búsqueda semántica. |
| **Vector DB** | Base de datos vectorial | Base de datos especializada en almacenar y recuperar datos vectoriales. Permite encontrar rápidamente los fragmentos de documento más coincidentes con una consulta mediante búsqueda por similitud. |
| **Temperature** | Temperatura | Hiperparámetro que controla la aleatoriedad de la salida del modelo. Cuanto más alto es el valor (ej. 0.8), más diversa y creativa es la salida; cuanto más bajo (ej. 0.2), más determinista y rigurosa. |
| **TTFT** | Tiempo hasta el primer token | Time to First Token, es decir, el tiempo transcurrido desde que el usuario envía la petición hasta que el modelo emite el primer token. Es un indicador clave de la experiencia de interacción. |

---

## Resumen: La esencia de la ingeniería de contexto

Las cuatro reconstrucciones de Manus nos enseñan que:

**Desde la práctica**: No se trata de recordar más, sino de recordar con más estructura y más selectividad.

**Desde la perspectiva del coste**:
- La mayor parte del desperdicio proviene del recálculo de prefijos fijos, y debe resolverse mediante la estabilidad de prefijos y mecanismos de caché;
- La eliminación accidental de información importante suele deberse a una ventana deslizante que "trata todo por igual", y debe resolverse mediante la clasificación de la información y estrategias de fijación;
- Ante documentos y bases de conocimiento extremadamente largos, no es realista limitarse a aumentar la ventana de contexto; es imprescindible combinar mecanismos de recuperación y compresión.

El objetivo es: dentro de un modelo y un límite de contexto dados, lograr que cada token invertido tenga un propósito bien definido.
