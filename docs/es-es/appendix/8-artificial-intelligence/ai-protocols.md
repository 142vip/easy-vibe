# Principios de protocolos de agentes de IA: MCP y A2A

::: tip Pregunta central
**¿Cómo "conversan" los Agentes de IA con el mundo exterior?** Al igual que Internet necesita el protocolo HTTP, los Agentes de IA también necesitan protocolos de comunicación estandarizados. Este capítulo presenta los dos protocolos de Agent más importantes: MCP y A2A, que resuelven respectivamente los problemas de comunicación entre IA y herramientas, y entre Agent y Agent.
:::

---

## 0. Introducción a protocolo

En el campo de la informática, un **protocolo (Protocol)** es un conjunto de reglas y convenciones estandarizadas que permiten que diferentes sistemas y programas se "comprendan" y "comuniquen" entre sí.

### 0.1 Motivación de protocolos

Imagina una situación: quieres enviar un paquete a un amigo y necesitas escribir la dirección. Si cada persona escribe el formato de dirección de manera diferente, el cartero no podrá entregarlo. El protocolo es el estándar que prescribe "cómo escribir la dirección" — provincia, ciudad, distrito, calle, número de puerta; si se escribe según este formato, cualquiera puede entenderlo.

Las computadoras son igual. Para que dos programas se comuniquen, deben acordar:
- ¿Cuál es el formato de datos? (¿JSON? ¿Binario?)
- ¿Cómo establecer la conexión? (Proceso de handshake)
- ¿Qué hacer en caso de error? (Manejo de errores)

### 0.2 Protocolos comunes en informática

| Protocolo | Función | Usas todos los días |
|------|------|-------------|
| **HTTP** | Protocolo de transmisión web | Navegador abre páginas web |
| **HTTPS** | HTTP cifrado | Banca en línea, páginas de pago |
| **TCP/IP** | Protocolo base de Internet | Todas las comunicaciones de red |
| **DNS** | Protocolo de resolución de nombres de dominio | Convierte `google.com` en dirección IP |
| **SMTP** | Protocolo de envío de correo | Enviar correos |
| **WebSocket** | Comunicación bidireccional en tiempo real | Software de chat, juegos en línea |
| **SSH** | Inicio de sesión remoto seguro | Conectar a servidores |
| **FTP** | Protocolo de transferencia de archivos | Subir/descargar archivos |

Estos protocolos constituyen la piedra angular de Internet. Sin ellos, no podrías navegar por la web, enviar correos ni ver videos.

### 0.3 El valor de los protocolos

El valor central de los protocolos es la **estandarización** y la **interoperabilidad**:

- **Estandarización**: Todos trabajan según el mismo conjunto de reglas, reduciendo costos de comunicación
- **Interoperabilidad**: Sistemas de diferentes fabricantes y diferentes stacks tecnológicos pueden conectarse sin problemas

Por ejemplo, el protocolo HTTP permite que el navegador Chrome acceda a servidores Nginx, y que un crawler en Python extraiga datos de sitios web Java. No es necesario que Chrome y Nginx se "conozcan" mutuamente, solo necesitan cumplir con el protocolo HTTP.

### 0.4 Los Agentes de IA también necesitan protocolos

Para que los Agentes de IA realmente "trabajen", necesitan:
- Llamar a herramientas externas (consultar el clima, enviar correos, operar bases de datos)
- Colaborar con otros Agentes (dividir el trabajo para completar tareas complejas)

Esto requiere protocolos estandarizados que definan "cómo la IA llama a herramientas" y "cómo se comunican los Agentes entre sí". Este es el origen de **MCP** y **A2A**.

---

## 1. Niveles de protocolos de Agent

Antes de profundizar en protocolos específicos, veamos los niveles de comunicación en el ecosistema de Agent:

| Nivel | Protocolo | Problema que resuelve | Analogía |
|------|------|-----------|------|
| **1** | Function Call | Cómo la IA llama funciones locales | El cerebro emite instrucciones |
| **2** | **MCP** | Cómo la IA se conecta a herramientas y fuentes de datos externas | Interfaz USB-C |
| **3** | **A2A** | Cómo los Agent se comunican y colaboran entre sí | WeChat empresarial |

::: tip Explicación línea por línea de esta tabla
**Nivel 1 (Function Call)**: Es la capacidad más básica de los modelos grandes — activar la ejecución de funciones generando datos estructurados (JSON). Es la base de los "protocolos", pero en sí mismo es más una capacidad que un protocolo estándar.

**Nivel 2 (MCP)**: Model Context Protocol, publicado por Anthropic en noviembre de 2024. Estandariza la forma en que la IA se conecta con herramientas y fuentes de datos externas, al igual que USB-C unificó los puertos de carga de diversos dispositivos.

**Nivel 3 (A2A)**: Agent-to-Agent Protocol, publicado por Google en abril de 2025. Permite que diferentes Agentes se descubran, se comuniquen y colaboren mutuamente, al igual que WeChat empresarial permite que los colegas se asignen tareas y chateen.
:::

Este capítulo se centra en los dos protocolos formales de los niveles 2 y 3: MCP y A2A.

---

## 2. MCP (Model Context Protocol)

### 2.1 Información básica del protocolo

| Elemento | Contenido |
|------|------|
| **Nombre completo** | Model Context Protocol |
| **Iniciador** | Anthropic |
| **Fecha de publicación** | 25 de noviembre de 2024 |
| **Documentación oficial** | [modelcontextprotocol.io](https://modelcontextprotocol.io) |
| **Licencia de código abierto** | MIT License |
| **GitHub** | [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol) |

::: tip ¿Por qué se llama "Context Protocol"?
**Context (Contexto)** es clave para que los modelos grandes comprendan las tareas. La idea central de MCP es: **permitir que la IA obtenga dinámicamente la información de contexto que necesita**, en lugar de meter toda la información en el Prompt.

Por ejemplo, cuando la IA necesita leer un archivo, no necesitas copiar y pegar el contenido del archivo, sino que accede directamente al sistema de archivos a través de MCP.
:::

### 2.2 Contexto de publicación

En 2024, con el lanzamiento de Claude 3.5 Sonnet, Anthropic descubrió un problema: **cada herramienta debía integrarse por separado**.

Imagina:
- Quieres que la IA lea un repositorio de GitHub → necesitas escribir código de integración con GitHub
- Quieres que la IA consulte una base de datos → necesitas escribir código de integración con la base de datos
- Quieres que la IA opere el sistema de archivos → necesitas escribir código de integración con el sistema de archivos

Cada integración requiere escribir código similar repetidamente: autenticación, manejo de errores, transformación de datos...

Anthropic escribió en su blog oficial:
> "We're introducing the Model Context Protocol (MCP), an open protocol that standardizes how applications provide context to LLMs."

**Objetivo central**: Permitir que los desarrolladores de herramientas escriban el código una vez, y que todas las aplicaciones de IA compatibles con MCP puedan usarlo.

### 2.3 Introducción a MCP

<McpVisualDemo />

**Tres capacidades centrales**:

| Capacidad | Inglés | Función | Ejemplo |
|------|------|------|------|
| **Herramientas** | Tools | Funciones que la IA puede llamar | Consultar el clima, enviar correos |
| **Recursos** | Resources | Datos que la IA puede leer | Contenido de archivos, registros de base de datos |
| **Prompts** | Prompts | Plantillas de prompt predefinidas | Plantilla de revisión de código, plantilla de escritura |

### 2.4 Implementación interna de MCP

<McpDetailedDemo />

### 2.5 Analogía: Interfaz USB-C

MCP es como la **interfaz USB-C**:

- **Antes**: Cada dispositivo tenía su propio puerto de carga (redondo, plano, magnético...)
- **Ahora**: USB-C unificó la carga y transferencia de datos de todos los dispositivos
- **MCP**: Unificó la forma en que la IA se conecta con todas las herramientas

Los desarrolladores de herramientas solo necesitan implementar un MCP Server una vez, y todas las aplicaciones de IA compatibles con MCP (Claude, Cursor, Windsurf, etc.) podrán usarlo directamente.

### 2.6 Escenarios de aplicación típicos de MCP

| Escenario | Descripción | Ejemplo |
|------|------|------|
| **Operaciones de archivos locales** | Permitir que la IA lea/modifique archivos locales | Leer repositorio de código, analizar archivos de log |
| **Consultas a base de datos** | Permitir que la IA consulte directamente la base de datos | Consultas SQL, análisis de datos |
| **Llamadas a API** | Permitir que la IA llame a servicios de terceros | GitHub API, Slack, correo |
| **Integración de herramientas de desarrollo** | Permitir que la IA use herramientas de desarrollo | Operaciones Git, comandos de terminal |

**Casos de uso reales**:
- **Cursor/Windsurf**: Se conecta al sistema de archivos, Git y terminal a través de MCP
- **Claude Desktop**: Se conecta a software de notas y cliente de correo a través de MCP
- **Scripts de automatización**: Permite que la IA ejecute tareas automatizadas (respaldo, despliegue, sincronización de datos)

---

## 3. A2A (Agent-to-Agent Protocol)

### 3.1 Información básica del protocolo

| Elemento | Contenido |
|------|------|
| **Nombre completo** | Agent-to-Agent Protocol |
| **Iniciador** | Google |
| **Fecha de publicación** | 9 de abril de 2025 |
| **Documentación oficial** | [google.github.io/A2A](https://google.github.io/A2A) |
| **Licencia de código abierto** | Apache 2.0 |
| **GitHub** | [github.com/google/A2A](https://github.com/google/A2A) |

::: tip ¿Por qué Google lo inició?
Google publicó A2A en la conferencia Cloud Next 2025, estrechamente vinculado a su estrategia de IA empresarial.

Google cree que la IA empresarial del futuro no será un solo super Agente, sino **múltiples Agentes especializados colaborando** — algunos responsables de análisis de datos, otros de generación de código, otros de procesamiento de documentos.

Estos Agentes necesitan una forma estandarizada de comunicarse entre sí, y A2A surgió para esto.
:::

### 3.2 Contexto de publicación

MCP resolvió el problema de "cómo la IA se conecta a las herramientas", pero quedaba otro problema: **¿cómo colaboran múltiples Agentes?**

Imagina un escenario:
- El Agente A es el "experto en análisis de requisitos"
- El Agente B es el "experto en generación de código"
- El Agente C es el "experto en pruebas"

El usuario dice: "Ayúdame a desarrollar una funcionalidad de login"

El Agente A analiza los requisitos y necesita asignar la tarea al Agente B; el Agente B termina de escribir el código y necesita que el Agente C lo pruebe. ¿Cómo se comunican entre ellos?

Google escribió en su blog oficial:
> "A2A is an open protocol that enables AI agents to communicate with each other, facilitating collaboration across different frameworks and vendors."

**Objetivo central**: Permitir que Agentes desarrollados por diferentes fabricantes y frameworks colaboren sin problemas.

### 3.3 Introducción a A2A

<A2AVisualDemo />

**Tres conceptos centrales**:

| Concepto | Inglés | Función | Analogía |
|------|------|------|------|
| **Agent Card** | Tarjeta de presentación del Agent | Describe las capacidades del Agent | Gafete de empleado |
| **Task** | Tarea | Unidad de trabajo a ejecutar | Orden de trabajo |
| **Message** | Mensaje | Contenido de comunicación entre Agentes | Registro de chat |

### 3.4 Implementación interna de A2A

<A2ADetailedDemo />

### 3.5 Analogía: WeChat empresarial

A2A es como **WeChat empresarial**:

- **Agent Card**: La tarjeta de presentación de cada persona, mostrando nombre, departamento y responsabilidades
- **Asignar tareas**: @alguien, asignar una tarea
- **Chat de comunicación**: Se puede comunicar en cualquier momento durante la ejecución de la tarea
- **Seguimiento de tareas**: Se puede ver el progreso y estado de la tarea

Los diferentes Agentes son como diferentes colegas, A2A les permite colaborar para completar proyectos complejos.

### 3.6 Escenarios de aplicación típicos de A2A

| Escenario | Descripción | Ejemplo |
|------|------|------|
| **Desarrollo de software** | Múltiples Agentes colaboran en tareas de desarrollo | Análisis de requisitos→Código→Pruebas→Despliegue |
| **Flujos de trabajo empresariales** | Agentes de diferentes departamentos colaboran en procesos de negocio | Agente RRHH + Agente Finanzas + Agente Legal |
| **Servicio al cliente inteligente** | Múltiples Agentes especializados dividen el trabajo | Recepción→Respuesta→Transferencia→Registro |
| **Análisis de datos** | Múltiples Agentes colaboran en análisis de datos | Recopilación→Limpieza→Análisis→Visualización→Informe |

**Casos de uso reales**:
- **Google Agent Space**: Múltiples Agentes dentro de la empresa colaboran procesando documentos, correos y agendas
- **Equipos de desarrollo de software**: Agente de Requisitos → Agente de Código → Agente de Pruebas → Agente de Despliegue
- **Sistemas de servicio al cliente inteligente**: Agente de Recepción → Agente de Respuesta Especializada → Agente de Transferencia Humana

---

## 4. MCP vs A2A: Comparación y relación

### 4.1 Diferencias centrales

| Dimensión | MCP | A2A |
|------|-----|-----|
| **Iniciador** | Anthropic (2024.11) | Google (2025.04) |
| **Posicionamiento** | Conexión entre IA y herramientas | Colaboración entre Agent y Agent |
| **Alcance de comunicación** | Client-Server | Peer-to-Peer |
| **Formato de datos** | JSON-RPC 2.0 | HTTP + JSON |
| **Analogía** | Interfaz USB-C | WeChat empresarial |

### 4.2 Relación entre ambos

MCP y A2A **no compiten, sino que se complementan**:

<ProtocolComparisonDemo />

### 4.3 Enfoque de elegir

| Escenario | Elección |
|------|------|
| Hacer que la IA llame funciones o herramientas locales | Function Call |
| Usar herramientas de terceros (base de datos, API, sistema de archivos) | MCP |
| Construir un sistema de colaboración multi-Agent | A2A |
| Necesitar tanto integración de herramientas como colaboración multi-Agent | MCP + A2A |

---

## 5. Tendencias futuras de los protocolos

### 5.1 Desarrollo del ecosistema

**Ecosistema MCP** (a principios de 2025):
- Servidores proporcionados oficialmente: sistema de archivos, SQLite, Git, PostgreSQL, etc.
- Servidores contribuidos por la comunidad: Slack, Notion, Figma, Stripe, etc.
- Aplicaciones que soportan MCP: Claude Desktop, Cursor, Windsurf, Zed, etc.

**Ecosistema A2A** (recién publicado):
- Los productos de Agent de Google son los primeros en soportarlo
- La comunidad open-source está desarrollando SDKs para varios lenguajes
- Las aplicaciones empresariales están en fase de exploración

### 5.2 Proceso de estandarización

Actualmente, los protocolos de Agent están en una "era de los Estados Combatientes":
- MCP y A2A son los dos más dominantes
- Hay otros protocolos emergentes como ANP, AGP, etc.
- En el futuro podrían fusionarse o unificarse

Analogía con el desarrollo de Internet:
- Primeros años: Coexistencia de varios protocolos de red local
- Más tarde: TCP/IP se convirtió en estándar
- Ahora: Los protocolos de Agent también podrían evolucionar hacia la unificación

---

## 6. Resumen

::: tip Puntos clave
| Protocolo | Comprensión en una frase | Fecha de publicación | Iniciador | Escenario aplicable |
|------|-----------|---------|--------|---------|
| **MCP** | El "USB-C" que conecta la IA con herramientas | 2024.11 | Anthropic | Integración de herramientas, conexión a fuentes de datos |
| **A2A** | El "WeChat empresarial" de la colaboración entre Agent | 2025.04 | Google | Colaboración multi-Agent, delegación de tareas |

**Insights clave**:
1. MCP resuelve el problema de "cómo la IA adquiere capacidades externas"
2. A2A resuelve el problema de "cómo múltiples IA colaboran"
3. Ambos se complementan, y en el futuro podrían usarse de forma conjunta
4. La elección del protocolo debe basarse en el escenario específico, no hay bala de plata
:::

---

## Referencias

1. **Documentación oficial de MCP**: [modelcontextprotocol.io](https://modelcontextprotocol.io)
2. **GitHub de MCP**: [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)
3. **Blog de lanzamiento de Anthropic**: "Introducing the Model Context Protocol" (2024-11-25)
4. **Documentación oficial de A2A**: [google.github.io/A2A](https://google.github.io/A2A)
5. **GitHub de A2A**: [github.com/google/A2A](https://github.com/google/A2A)
6. **Google CloudBlog**: "Announcing the Agent-to-Agent Protocol" (2025-04-09)
