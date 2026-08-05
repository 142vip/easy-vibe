# Introducción al desarrollo full stack: mapa del conocimiento informático en la era de Vibe Coding

::: tip Prefacio
**¿Qué es Vibe Coding?** En pocas palabras, es "escribir código con lenguaje natural": describes lo que quieres en español o inglés, y la IA genera el código por ti. Esto ha cambiado por completo las reglas del desarrollo de software.

Pero hay una pregunta clave: **la IA puede escribir código por ti, pero no puede pensar por ti.** Sigues necesitando saber "qué escribir", "por qué escribirlo así" y "cómo juzgar si es correcto". Este capítulo te ayudará a construir ese marco cognitivo fundamental.
:::

**¿Qué aprenderás en este capítulo?**

Al terminar este capítulo, habrás adquirido:

- **Visión panorámica del sector**: entender qué hacen el frontend, backend, algoritmos de IA y otras áreas
- **Capacidad de selección tecnológica**: tomar decisiones racionales ante la pregunta de "¿qué lenguaje/framework aprender?"
- **Ruta de crecimiento clara**: conocer la evolución de habilidades desde cero hasta un ingeniero con 3–5 años de experiencia
- **Mentalidad Vibe Coding**: comprender qué capacidades se vuelven más importantes en la era del desarrollo asistido por IA

| Capítulo | Contenido | Conceptos clave |
|----------|-----------|-----------------|
| **Capítulo 1** | Panorama del sector informático | Frontend, backend, móvil, IA, operaciones |
| **Capítulo 2** | ¿Qué es el frontend? | La capa de interfaz que el usuario percibe |
| **Capítulo 3** | ¿Qué es el backend? | La lógica del servidor entre bastidores |
| **Capítulo 4** | Mapa de lenguajes de programación | Herramientas para comunicarse con la computadora |
| **Capítulo 5** | Ingeniero fullstack | El todoterreno que domina frontend y backend |
| **Capítulo 6** | Ingeniero de algoritmos de IA | Hacer que las máquinas aprendan a pensar |
| **Capítulo 7** | Ruta de crecimiento | Hoja de ruta desde principiante hasta experto |

---

## 0. Vibe Coding: el nuevo paradigma del desarrollo de software

### 0.1 Visión general de Vibe Coding

Imagina cómo era antes el desarrollo de software:

<VibeCodingFlowDemo />

**Cambio fundamental**: de "cómo escribir código" a "cómo describir requisitos".

### 0.2 Principios de habilidades en la era del Vibe Coding

<DeveloperSkillShiftDemo />

::: tip 💡 Idea clave
La IA puede escribir código por ti, pero hay capacidades que no puede reemplazar:
- **Juicio**: saber si el código generado por la IA es correcto y de calidad
- **Pensamiento arquitectónico**: saber cómo diseñar sistemas y dividir módulos
- **Conocimiento del dominio**: entender la lógica de negocio y saber "qué hay que hacer"
- **Capacidad de depuración**: saber por dónde empezar a investigar cuando algo falla
:::

---

## 1. Panorama del sector informático

Antes de profundizar en cada área, construyamos una visión global.

<ComputerFieldMapDemo />

### 1.1 Analogía: flujo de servicio de restaurante

Imagina un sistema de software como un **restaurante**:

| Área | Rol en el restaurante | Qué hace | Entregables |
|------|-----------------------|----------|-------------|
| **Frontend** | Decoración + menú + camarero | Todo lo que el usuario ve y con lo que interactúa | Páginas web, miniapps, interfaces de app |
| **Backend** | Cocina + almacén | Procesa la lógica de negocio, almacena datos | APIs, bases de datos, programas de servidor |
| **Móvil** | Ventanilla de comida para llevar | Experiencia de aplicación en el teléfono | Apps iOS/Android |
| **IA/Algoritmos** | Departamento de I+D | Hacer el sistema "inteligente" | Modelos de recomendación, reconocimiento de imágenes, diálogo inteligente |
| **Operaciones/DevOps** | Mantenimiento + seguridad | Garantizar el funcionamiento estable del sistema | Scripts de despliegue, sistemas de monitoreo, protección de seguridad |
| **Ingeniería de datos** | Finanzas + analistas | Recopilación, almacenamiento y análisis de datos | Pipelines de datos, informes, dashboards |

### 1.2 Resumen del stack tecnológico por área

No te asustes con estos términos, solo es para que "los conozcas":

| Área | Lenguajes principales | Frameworks/herramientas comunes | Entregables típicos |
|------|-----------------------|--------------------------------|---------------------|
| Frontend | JavaScript, TypeScript | React, Vue, CSS | Páginas web, paneles de administración |
| Backend | Node.js, Go, Java, Python | Express, Gin, Spring | Servicios API |
| Móvil | Swift, Kotlin, Dart | SwiftUI, Jetpack, Flutter | Apps móviles |
| IA/Algoritmos | Python | PyTorch, TensorFlow | Modelos, algoritmos |
| Operaciones | Shell, Python | Docker, Kubernetes | Planes de despliegue |

::: tip 💡 Consejo para principiantes
No intentes aprenderlo todo de una vez. Elige primero una dirección y profundiza, establece tu "base" y luego expande horizontalmente. Ser fullstack no es "saber un poco de todo", sino "tener una fortaleza central y poder manejarte en las demás áreas".
:::

---

## 2. Visión general del frontend

### 2.1 Definición en una frase

**Frontend = la parte que el usuario ve, toca y con la que interactúa directamente.**

Cuando abres una página web:
- La disposición, colores y tipografía → frontend
- Las animaciones al hacer clic en un botón → frontend
- Los formularios y la visualización de datos → frontend
- Cómo se adapta la página a la pantalla del móvil → frontend

### 2.2 El trío del frontend

<FrontendTriadDemo />

**Usando la analogía de "decorar una casa"**:

| Tecnología | Rol en la decoración | Responsabilidad |
|------------|----------------------|-----------------|
| **HTML** | Estructura de la casa | Dónde van las paredes, puertas y cómo se distribuyen las habitaciones |
| **CSS** | Estilo decorativo | De qué color son las paredes, cómo se colocan los muebles, efectos de iluminación |
| **JavaScript** | Domótica | Encender/apagar luces, persianas automáticas, sistema de seguridad |

### 2.3 Principios de frameworks de frontend

Si con HTML/CSS/JS nativo ya se pueden hacer páginas web, ¿por qué aprender frameworks como React o Vue?

<FrontendFrameworkDemo />

**Razón principal**: cuando la página se vuelve compleja (como Taobao o la versión web de WeChat), manipular directamente cada elemento de la página se vuelve muy caótico. Los frameworks te ayudan a "gestionar la complejidad".

### 2.4 Flujo diario de trabajo de un ingeniero frontend

```
9:00  Revisar los diseños y entender qué funcionalidad hay que implementar
10:00 Escribir componentes con React/Vue
12:00 Pausa para comer
14:00 Conectar con el backend via API, depurar la visualización de datos
16:00 Corregir bugs, optimizar el rendimiento de la página
18:00 Revisión de código, discutir soluciones técnicas con el equipo
```

---

## 3. Visión general del backend

### 3.1 Definición en una frase

**Backend = la lógica que el usuario no ve, pero que sostiene el funcionamiento de todo el sistema.**

Cuando compras algo en línea:
- Verificar tu usuario y contraseña → backend
- Comprobar el inventario del producto → backend
- Calcular el precio con descuento → backend
- Generar el pedido y cobrar → backend
- Notificar al almacén para el envío → backend

### 3.2 Responsabilidades principales del backend

<BackendCoreDemo />

**Usando la analogía de la "cocina de un restaurante"**:

| Responsabilidad del backend | Analogía en la cocina | Contenido específico |
|-----------------------------|-----------------------|----------------------|
| **Diseño de API** | Diseño del menú | Definir "qué puede pedir el cliente" y "cómo lo pide" |
| **Lógica de negocio** | Proceso de cocina | Procesar pedidos, calcular precios, verificar permisos |
| **Almacenamiento de datos** | Gestión del almacén | Guardar datos en la base de datos, consultar datos |
| **Optimización de rendimiento** | Eficiencia de la cocina | Caché, procesamiento asíncrono, balanceo de carga |
| **Protección de seguridad** | Seguridad alimentaria | Prevenir inyección SQL, control de permisos |

### 3.3 Principios de selección de lenguajes de backend

| Lenguaje | Características | Escenarios adecuados |
|----------|-----------------|----------------------|
| **Node.js** | Afinidad con frontend, fullstack JavaScript | Proyectos pequeños/medianos, prototipado rápido |
| **Go** | Alto rendimiento, gran concurrencia | Servicios de alta concurrencia, arquitectura de microservicios |
| **Java** | Ecosistema maduro, nivel empresarial | Grandes sistemas empresariales, banca |
| **Python** | Simple, buen ecosistema de IA | Procesamiento de datos, servicios de IA |

::: tip 💡 Consejo para principiantes
Si ya sabes JavaScript (base de frontend), Node.js es la opción más natural para empezar con backend. Un solo lenguaje para escribir tanto frontend como backend.
:::

### 3.4 Flujo diario de trabajo de un ingeniero backend

```
9:00  Revisar la documentación de requisitos de API
10:00 Diseñar la estructura de las tablas de la base de datos
11:00 Escribir el código de los endpoints de la API
14:00 Integración con frontend, corregir problemas de la API
16:00 Optimizar consultas lentas, resolver incidencias en producción
18:00 Revisión de código, redactar documentación técnica
```

---

## 4. Mapa de lenguajes de programación

### 4.1 Visión general de los lenguajes de programación

**Lenguaje de programación = el puente de comunicación entre humanos y computadoras.**

Las computadoras solo entienden ceros y unos, y los humanos estamos acostumbrados al lenguaje natural. El lenguaje de programación es la capa intermedia:
- Los humanos escriben código en un lenguaje de programación (más comprensible que 0/1)
- La computadora traduce el lenguaje de programación a instrucciones de máquina

### 4.2 Clasificación de lenguajes

<ProgrammingLanguageMapDemo />

**Clasificación por modo de ejecución**:

| Tipo | Principio | Lenguajes representativos | Características |
|------|-----------|---------------------------|-----------------|
| **Compilados** | Se traducen primero a código máquina, luego se ejecutan | C, C++, Go, Rust | Ejecución rápida, compilación lenta |
| **Interpretados** | Se traducen y ejecutan simultáneamente | Python, JavaScript, Ruby | Desarrollo rápido, ejecución lenta |
| **Bytecode** | Solución intermedia | Java, Kotlin, C# | Equilibrio entre rendimiento y eficiencia de desarrollo |

**Clasificación por sistema de tipos**:

| Tipo | Características | Lenguajes representativos |
|------|-----------------|---------------------------|
| **Tipado estático** | El tipo de variable se determina al escribir el código | Java, TypeScript, Go |
| **Tipado dinámico** | El tipo de variable se determina en tiempo de ejecución | Python, JavaScript, Ruby |
| **Tipado fuerte** | Verificación estricta de tipos, sin conversión automática | Python, Java |
| **Tipado débil** | Verificación laxa de tipos, conversión automática | JavaScript, PHP |

### 4.3 Principios de selección de lenguajes

<LanguageSelectionDemo />

::: tip 💡 Principio de elección
No existe el "mejor lenguaje", solo el "lenguaje más adecuado para cada escenario". Consejos para principiantes:
1. **Primero aprende uno a fondo**: construye el pensamiento de programación
2. **Luego aprende un segundo, comparando**: comprende las diferencias de diseño entre lenguajes
3. **Aprende según la necesidad**: elige en función de los requisitos del proyecto
:::

---

## 5. Ingeniero fullstack: dominar frontend y backend

### 5.1 Visión general del desarrollo fullstack

**Ingeniero fullstack = ingeniero capaz de completar de forma independiente el desarrollo frontend + backend.**

<FullstackSkillDemo />

### 5.2 Ventajas de ser fullstack

| Ventaja | Descripción |
|---------|-------------|
| **Completar proyectos de forma independiente** | Desde los requisitos hasta la puesta en producción, todo por una persona |
| **Menor coste de comunicación** | Sin fricciones innecesarias entre frontend y backend |
| **Visión técnica amplia** | Comprensión de cómo funciona todo el sistema |
| **Apto para emprender** | Validación rápida de ideas, desarrollo de MVP |

### 5.3 Desafíos de ser fullstack

| Desafío | Descripción |
|---------|-------------|
| **Profundidad vs. amplitud** | Es fácil caer en "saber un poco de todo sin destacar en nada" |
| **Actualización tecnológica rápida** | Tanto frontend como backend evolucionan velozmente |
| **Dispersión de esfuerzo** | Hay que prestar atención a múltiples áreas simultáneamente |

### 5.4 Recomendaciones de crecimiento fullstack

```
Fase 1: Establecer la base
└── Elige una dirección y profundiza (se recomienda empezar por frontend o backend)
└── Alcanza el nivel de completar proyectos de forma independiente

Fase 2: Expansión horizontal
└── Aprende los fundamentos de la otra dirección
└── Capaz de completar proyectos fullstack sencillos

Fase 3: Integración
└── Comprende cómo colaboran frontend y backend
└── Capaz de diseñar una arquitectura técnica completa

Fase 4: Perfeccionamiento continuo
└── Mantén profundidad en un área
└── Mantén un nivel "utilizable" en las demás
```

---

## 6. Ingeniero de algoritmos de IA: hacer que las máquinas aprendan a pensar

### 6.1 Ingeniero de IA vs. desarrollo tradicional

<AIvsTraditionalDemo />

| Dimensión | Desarrollo tradicional | Ingeniero de algoritmos de IA |
|-----------|------------------------|-------------------------------|
| **Tarea principal** | Implementar lógica de negocio determinista | Entrenar modelos, optimizar algoritmos |
| **Forma de pensar** | "Si A entonces ejecutar B" | "Hacer que la máquina aprenda patrones de los datos" |
| **Resultado del código** | Módulos funcionales, sistemas | Modelos, scripts de entrenamiento |
| **Forma de depurar** | Breakpoints, logs | Observar métricas, ajustar hiperparámetros |
| **Criterio de éxito** | Funcionalidad correcta, sin bugs | Precisión y recall que cumplan los objetivos |

### 6.2 Árbol de habilidades del ingeniero de IA

```
Ingeniero de IA (2025)
    │
    ├── Habilidades fundamentales
    │   ├── Python (lenguaje principal)
    │   ├── Procesamiento de datos (Pandas, NumPy)
    │   └── Intuición matemática básica (álgebra lineal, probabilidad y estadística)
    │
    ├── Aplicaciones con grandes modelos (la dirección más demandada)
    │   ├── Prompt Engineering (ingeniería de prompts)
    │   ├── RAG (Generación Aumentada por Recuperación)
    │   ├── AI Agent (agentes inteligentes que permiten a la IA completar tareas autónomamente)
    │   ├── Function Calling / MCP (hacer que la IA invoque herramientas externas)
    │   └── Fine-tuning y despliegue (LoRA, vLLM)
    │
    ├── IA Generativa (GenAI)
    │   ├── Generación de texto (GPT, Claude, Gemini)
    │   ├── Generación de imágenes (Stable Diffusion, Midjourney, FLUX)
    │   ├── Generación de video (Sora, Kling)
    │   └── Multimodal (texto + imagen + audio)
    │
    └── Machine Learning tradicional (sigue siendo importante)
        ├── Aprendizaje supervisado (clasificación, regresión)
        ├── Frameworks de deep learning (PyTorch)
        └── Evaluación y optimización de modelos
```

### 6.3 Un día en la vida de un ingeniero de IA

```
9:00  Revisar los resultados del entrenamiento del modelo, analizar métricas
10:00 Preprocesamiento de datos, limpieza de datos de entrenamiento
12:00 Pausa para comer
14:00 Ajustar la estructura del modelo, probar nuevos enfoques
16:00 Ejecutar experimentos, comparar resultados de distintas estrategias
18:00 Redactar informes de experimentos, discutir próximos pasos con el equipo
```

### 6.4 El ingeniero de IA en la era del Vibe Coding

Impacto del desarrollo asistido por IA en los ingenieros de IA:

| Cambio | Descripción |
|--------|-------------|
| **Generación de código** | La IA puede generar scripts de entrenamiento y código de procesamiento de datos |
| **Lectura de papers** | La IA puede resumir los puntos clave de artículos académicos |
| **Registro de experimentos** | La IA puede ayudar a organizar los resultados experimentales |
| **Lo que no cambia** | La comprensión del problema, el juicio sobre los resultados, el sentido de la dirección |

---

## 7. Ruta de crecimiento: de principiante a experto

### 7.1 Hoja de ruta de crecimiento en 3–5 años

<CareerPathDemo />

### 7.2 Requisitos de competencia por etapa

| Etapa | Duración | Competencias clave | Entregables típicos |
|-------|----------|--------------------|---------------------|
| **Inicial** | 0–1 año | Dominar un lenguaje + herramientas básicas | Completar módulos funcionales simples |
| **Intermedio** | 1–2 años | Familiaridad con un stack tecnológico + ingeniería | Completar proyectos medianos de forma independiente |
| **Avanzado** | 2–3 años | Profundidad en un área + capacidad arquitectónica | Diseñar soluciones de sistema |
| **Senior** | 3–5 años | Profundidad técnica + comprensión del negocio + colaboración en equipo | Liderar proyectos de gran escala |

### 7.3 Estrategia de aprendizaje en la era del Vibe Coding

<LearningStrategyDemo />

::: tip 💡 Recomendación principal
1. **Los fundamentos importan más que las herramientas**: las características del lenguaje, las estructuras de datos y el pensamiento algorítmico son la base
2. **La práctica importa más que la teoría**: construir proyectos es la mejor forma de aprender
3. **Pensar importa más que memorizar**: entender "por qué" es más valioso que recordar "cómo se hace"
4. **La IA es una herramienta, no una muleta**: usa la IA para acelerar el aprendizaje, no para reemplazar el pensamiento
:::

---

## 8. Resumen: competencias clave en la era del Vibe Coding

Repasando este capítulo, hemos construido una comprensión global del sector informático:

1. **División de áreas**: frontend, backend, móvil, IA, operaciones, datos — cada una con su enfoque
2. **Selección tecnológica**: no existe la mejor tecnología, solo la más adecuada para cada escenario
3. **Ruta de crecimiento**: primero profundidad, luego amplitud; establece una base antes de expandir
4. **Era de la IA**: la IA puede escribir código por ti, pero no puede pensar por ti

### Las tres capas de habilidades en la era del Vibe Coding

```
┌─────────────────────────────────────────────────┐
│  Capa 3: Juicio (la IA no puede reemplazarlo)    │
│  - Saber qué es correcto                         │
│  - Saber qué es de calidad                       │
│  - Saber hacia dónde ir                          │
├─────────────────────────────────────────────────┤
│  Capa 2: Pensamiento arquitectónico (IA asistida) │
│  - Capacidad de diseño de sistemas               │
│  - Capacidad de división modular                 │
│  - Capacidad de selección tecnológica            │
├─────────────────────────────────────────────────┤
│  Capa 1: Implementación de código (IA sobresale) │
│  - Escritura de sintaxis                         │
│  - Llamadas a API                                │
│  - Implementación de patrones comunes            │
└─────────────────────────────────────────────────┘
```
