# Principios de los frameworks web
::: tip 🎯 Pregunta central
**El código está escrito, pero ¿cómo hacer que personas de todo el mundo puedan acceder a él?** Es como preguntarse: ¿quieres abrir un pequeño puesto callejero o gestionar una cadena internacional de restaurantes? La elección de la arquitectura backend determina a cuántos clientes puede atender tu "restaurante".
:::

---

## 1. Motivación de entender la evolución de la arquitectura

Imagina que estás planeando un viaje largo. Puedes elegir entre ir en bicicleta, conducir un coche, tomar el tren de alta velocidad o volar en avión. Cada medio tiene su escenario ideal: la bicicleta es adecuada para distancias cortas cuando quieres hacer ejercicio, mientras que el avión es ideal para viajes largos que cruzan continentes.

**La elección de la arquitectura backend sigue el mismo principio.**

Desde el nacimiento de Internet hasta hoy, la arquitectura backend ha experimentado múltiples transformaciones importantes. Cada transformación no buscaba "seguir la moda", sino resolver problemas específicos del momento:

| Década | Problema central                               | Evolución arquitectónica       |
| ------ | ---------------------------------------------- | ------------------------------ |
| 1990s  | Cómo poner un sitio web en funcionamiento      | Servidores físicos             |
| 2000s  | Cómo mantener el código cada vez más desordenado | Arquitectura monolítica + MVC  |
| 2010s  | Cómo escalar y colaborar con sistemas enormes  | Microservicios + Contenedores  |
| 2020s  | Cómo reducir costes operativos y complejidad   | Serverless + Cloud Native      |

::: tip 📊 ¿Qué puedes observar en esta tabla?
Interpretemos esta tabla fila por fila:

**1990s → 2000s**: De "con que funcione basta" a "necesita mantenimiento". Los sitios web pasaron de páginas estáticas a aplicaciones dinámicas, el volumen de código se disparó y se necesitaban mejores formas de organización.

**2000s → 2010s**: De "una sola máquina" a "distribuido". El número de usuarios explotó, un solo servidor ya no podía soportar la carga, era necesario dividir el sistema y escalar horizontalmente.

**2010s → 2020s**: De "gestionar tu propia infraestructura" a "servicios en la nube". Los contenedores y microservicios, aunque potentes, tenían costes operativos demasiado altos; Serverless permite a los desarrolladores centrarse solo en la lógica de negocio.

**Conclusión clave**: La evolución arquitectónica no es un juego de selección de tecnología, sino un proceso de **resolver problemas reales**. Cada etapa tiene sus escenarios adecuados, no existe "la mejor arquitectura", solo "la arquitectura más adecuada".
:::

**El significado de entender la evolución arquitectónica:**

1. **Evitar reinventar la rueda**: Muchos conceptos "nuevos" ya tenían prototipos hace décadas, conocer la historia te permite subirte a hombros de gigantes
2. **Tomar decisiones tecnológicas acertadas**: No existe la mejor arquitectura, solo la más adecuada para la etapa actual
3. **Comprender las compensaciones detrás de la tecnología**: Cada evolución arquitectónica implica equilibrar **eficiencia de desarrollo**, **rendimiento del sistema** y **complejidad operativa**
4. **Anticipar tendencias tecnológicas**: La historia siempre rima, entender los patrones de evolución pasados ayuda a captar la dirección futura

<EvolutionIntroDemo />

---

## 2. La era de los servidores físicos (1990s)

### 2.1 Introducción a servidor físico

En los inicios de Internet, el backend era simplemente un **servidor físico** (un ordenador real) colocado en una sala de servidores.

::: tip 💡 Explicación sencilla
Un **servidor físico** es como tu ordenador de escritorio en casa, pero:

- Funciona 24/7 sin apagarse
- Está ubicado en un centro de datos especializado (con aire acondicionado, UPS, sistema contra incendios)
- Tiene un ancho de banda de red más rápido (fibra óptica empresarial)
- Posee una dirección IP pública fija (accesible desde cualquier parte del mundo)

Es como comparar tu casa con un restaurante: en casa solo cocinas de vez en cuando, mientras que un restaurante es una cocina profesional, abierta todo el día, con equipamiento más especializado.
:::

### 2.2 Características principales

- **Despliegue en una sola máquina**: Todas las aplicaciones se ejecutan en un único servidor físico
- **Operación manual**: Requiere instalación física, cableado y configuración del sistema
- **Escalado vertical**: Cuando el rendimiento no es suficiente, solo queda comprar una máquina más potente

::: details 🔧 Escalado vertical vs. escalado horizontal
**Escalado vertical** (Scale Up): Mejorar la configuración de un solo servidor (más CPU, más memoria, discos más rápidos).

**Escalado horizontal** (Scale Out): Añadir más servidores para que trabajen juntos.

**Analogía**:

- Escalado vertical: Convertir un pequeño restaurante en uno grande, con una decoración más lujosa, pero con un solo chef
- Escalado horizontal: Abrir una cadena de franquicias, cada local no es muy grande, pero tienes 100 sucursales

**Ventajas y desventajas**:

- El escalado vertical es simple, pero tiene un límite (los servidores de gama alta son muy caros y tienen restricciones)
- El escalado horizontal es teóricamente ilimitado, pero requiere resolver problemas de consistencia de datos
:::

### 2.3 Puntos débiles

- **Lento**: Cada cambio de código requería subirlo manualmente y luego reiniciar el servidor
- **Caro**: La ampliación solo podía hacerse comprando máquinas más grandes (escalado vertical)
- **Difícil de escalar**: Una sola máquina soportaba todas las peticiones; cuando la CPU estaba al máximo, las solicitudes hacían cola

<PhysicalServerDemo />

### 2.4 Ventajas y desventajas de la era de servidores físicos

| Dimensión          | Evaluación                                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| **Ventajas**       | Control total del hardware, rendimiento predecible; sin sobrecarga de virtualización; aislamiento físico de datos, alta seguridad |
| **Desventajas**    | Ciclo de adquisición largo (semanas); alta inversión inicial (CapEx); baja utilización de recursos; difícil ampliación |
| **Casos de uso**   | Sistemas financieros centrales, sistemas gubernamentales clasificados, escenarios con requisitos estrictos de soberanía de datos |

::: tip 💡 CapEx vs OpEx
**CapEx** (Capital Expenditure): Gasto de capital, inversión única elevada para comprar hardware.

**OpEx** (Operating Expenditure): Gasto operativo, pago por uso (como los servidores en la nube).

**Analogía**:

- CapEx: Comprar una casa, pagar cientos de miles de una vez, y luego solo pagar gastos mensuales de comunidad
- OpEx: Alquilar una casa, pagar el alquiler mensual, sin necesidad de desembolsar una gran suma de golpe

**Lección de la era cloud**: Serverless y los servicios en la nube permiten a más empresas pasar de CapEx a OpEx, reduciendo la barrera de entrada para emprender.
:::

---

## 3. La era de la arquitectura monolítica (2000s)

### 3.1 Introducción a arquitectura monolítica

Con la aparición de frameworks (Rails / Django / Spring), se empezó a meter toda la funcionalidad en una sola aplicación.

::: tip 💡 Explicación sencilla
La **arquitectura monolítica** (Monolith) es como un gran centro comercial:

- La sección de ropa, la de alimentación y la de electrodomésticos están todas en el mismo edificio
- Todos los empleados trabajan en un único sistema de gestión
- Si se corta la luz en todo el edificio, todas las secciones dejan de funcionar

En contraste, los microservicios son como una calle comercial: cada tienda opera de forma independiente, y el cierre de una no afecta a las demás.
:::

<MonolithDemo />

### 3.2 Características principales

- **Código base único**: Todos los módulos funcionales están en el mismo proyecto
- **Base de datos compartida**: Todos los módulos comparten la misma base de datos
- **Despliegue unificado**: Toda la aplicación se empaqueta y despliega como una sola unidad

### 3.3 Ventajas

- **Desarrollo simple**: Un solo proyecto cubre todas las funcionalidades
- **Despliegue fácil**: Basta con subir un paquete grande al servidor
- **Depuración sencilla**: Al iniciar localmente puedes depurar todas las funcionalidades

### 3.4 Punto débil: El efecto avalancha

Imagina que el chef encargado de "cortar verduras" se corta un dedo accidentalmente (un bug en el código), y toda la cocina tiene que parar para atender la herida, dejando a todos los clientes sin poder comer.

Este es el mayor riesgo de la arquitectura monolítica: **aislamiento deficiente**.

::: details 🚨 Un caso real de efecto avalancha
Una empresa de e-commerce durante el Día del Soltero (11.11):

- El servicio de pedidos lanzó una excepción porque el precio de un producto se calculó incorrectamente
- La excepción no se capturó correctamente, agotando el pool de hilos
- Todas las solicitudes posteriores (incluyendo navegación de productos, búsqueda, inicio de sesión) quedaron bloqueadas
- Todo el sitio web colapsó por completo durante 1 hora

**Si hubieran usado microservicios**:

- El servicio de pedidos habría caído, pero la navegación de productos, búsqueda e inicio de sesión seguirían funcionando
- Los usuarios al menos podrían seguir navegando por los productos, minimizando las pérdidas
:::

### 3.5 Ventajas, desventajas y casos de uso de la arquitectura monolítica

| Dimensión              | Evaluación                                                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ventajas**           | Desarrollo simple, sin necesidad de considerar complejidades distribuidas; depuración fácil, se puede depurar toda la funcionalidad con un inicio local; despliegue simple, un solo paquete lo ejecuta todo; gestión de transacciones sencilla, ACID garantizado con una base de datos local |
| **Desventajas**        | Alto acoplamiento de código, el código se hincha con el crecimiento del negocio; stack tecnológico único, difícil de actualizar parcialmente; escalado difícil, solo se puede escalar todo el conjunto; aislamiento de fallos deficiente, un fallo en un módulo afecta a todo el sistema; baja eficiencia de colaboración en equipo, muchas personas modificando el mismo código |
| **Casos de uso**       | Validación de MVP en startups, equipos pequeños (<10 personas), negocio relativamente simple, escenarios donde la velocidad de entrega prima sobre la escalabilidad |
| **Casos no adecuados** | Equipos grandes con desarrollo paralelo, necesidad de publicar diferentes módulos con frecuencia, escenarios donde ciertos módulos necesitan escalado independiente |

::: tip 🎯 Consejo para principiantes
Si estás aprendiendo desarrollo backend, **se recomienda encarecidamente empezar con la arquitectura monolítica**:

1. **Aprende a caminar primero**: Comprende HTTP, bases de datos y la arquitectura MVC básica
2. **Luego piensa en correr**: Cuando el proyecto realmente enfrente problemas de escalabilidad, entonces considera los microservicios
3. **Evita el sobre-diseño**: Muchas empresas tienen "microservicios" que en realidad son "monolitos distribuidos", aún más difíciles de mantener

**Ruta de aprendizaje**:

- Fase 1: Escribe una aplicación monolítica completa con Spring Boot / Django / Rails
- Fase 2: Cuando encuentres cuellos de botella de rendimiento, intenta extraer 1-2 servicios
- Fase 3: Cuando el equipo supere las 50 personas y el sistema sea realmente complejo, entonces migra completamente a microservicios
:::

### 3.6 Stack tecnológico de la arquitectura monolítica

| Lenguaje/Framework              | Características                                  | Empresas representativas       |
| ------------------------------- | ------------------------------------------------ | ------------------------------ |
| **Java + Spring**               | Primera opción para desarrollo empresarial, ecosistema completo | Alibaba, JD.com                |
| **PHP + Laravel/ThinkPHP**      | Desarrollo rápido, adecuado para proyectos pequeños y medianos | Facebook (inicios), Weibo      |
| **Python + Django/Flask**       | Alta eficiencia de desarrollo, ideal para prototipado rápido | Instagram, Pinterest           |
| **Ruby on Rails**               | Convención sobre configuración, favorito de startups | GitHub, Twitter (inicios)      |
| **Node.js + Express**           | Lenguaje unificado frontend/backend, escenarios intensivos en I/O | Netflix, Uber                  |

---

## 4. Contenedores y microservicios (2010s)

### 4.1 Motivación de microservicios

Los puntos débiles de la arquitectura monolítica estallaron en la década de 2010:

- **Código demasiado grande**: Un proyecto con millones de líneas de código, un nuevo empleado tardaba un mes en entenderlo
- **Despliegue demasiado lento**: Una build podía tardar 30 minutos, cada publicación requería extremo cuidado
- **Colaboración demasiado difícil**: 100 desarrolladores modificando el mismo proyecto, conflictos de código a diario
- **Escalado demasiado caro**: Solo necesitabas escalar el "servicio de chat", pero tenías que replicar toda la aplicación

**La idea central de los microservicios**: Dividir una gran aplicación en múltiples servicios pequeños, donde cada servicio:

- Se desarrolla y despliega de forma independiente
- Tiene su propia base de datos
- Se comunica mediante APIs

<ContainerDockerDemo />

::: tip 💡 ¿Qué es Docker?
**Docker** es como un "contenedor de carga":

- Cada contenedor tiene carga independiente (código + dependencias + entorno de ejecución)
- Sin importar a dónde se transporte (a qué servidor), al abrir el contenedor todo funciona directamente
- No hay que preocuparse por "esta máquina no tiene Python 3.9" o "esa máquina le falta cierta biblioteca"

**Analogía**:

- Sin Docker: Cada vez que te mudas, tienes que cargar muebles, electrodomésticos y ropa pieza por pieza en el camión, y al llegar a la nueva casa, colocarlos uno por uno
- Con Docker: Todo se empaqueta en un contenedor, el camión lo transporta directamente, y al llegar a la nueva casa, se descarga y está listo para usar

**Valor central**: "Construye una vez, ejecuta en cualquier lugar".
:::

### 4.2 Línea de tiempo del stack tecnológico

<TechStackTimelineDemo />

### 4.3 Arquitectura de microservicios

Para resolver los problemas del monolito, dividimos la gran cocina en muchas cocinas pequeñas (servicios):

- Un servicio dedicado a los usuarios
- Un servicio dedicado a los pedidos
- Un servicio dedicado a los pagos

<MicroservicesDemo />

### 4.4 Orquestación con Kubernetes

Cuando el número de contenedores alcanza cientos o miles, se necesita un "sistema de gestión portuaria":

- **Kubernetes (K8s)**: Se encarga de asignar los contenedores a las máquinas adecuadas (planificación, escalado, actualizaciones continuas)
- **Service Mesh**: Se encarga de las reglas de tráfico entre servicios (circuit breaker, limitación de tasa, reintentos, observabilidad)

<KubernetesDemo />

::: tip 💡 ¿Qué es la "orquestación"?
La **orquestación** (Orchestration) se refiere al sistema que gestiona automáticamente grandes cantidades de contenedores.

**Analogía**:

- Sin K8s: Gestionas manualmente 100 contenedores, si uno falla lo reinicias manualmente, si uno recibe más tráfico añades máquinas manualmente
- Con K8s: Le dices "quiero que este servicio tenga siempre 10 instancias ejecutándose", y automáticamente:
  - Asigna el contenedor al servidor con más recursos disponibles
  - Si un contenedor falla, lo reinicia automáticamente
  - Si el tráfico aumenta, escala automáticamente a 20 instancias
  - Al actualizar el código, realiza despliegue continuo (detiene 1 instancia antigua, inicia 1 nueva, reemplaza una por una)

**Punto clave**: Los microservicios no son solo "dividir y ya está", la verdadera dificultad radica en la **gobernanza y operaciones**.
:::

### 4.5 Ventajas y desventajas de los microservicios y contenedores

| Dimensión              | Evaluación                                                                                                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ventajas**           | Servicios desplegables independientemente, stacks tecnológicos heterogéneos; aislamiento de fallos, la caída de un servicio no afecta al conjunto; escalado bajo demanda, los servicios críticos se escalan individualmente; colaboración en equipo amigable, diferentes equipos gestionan diferentes servicios; código base más pequeño, fácil de entender y mantener |
| **Desventajas**        | Alta complejidad distribuida (latencia de red, transacciones distribuidas, descubrimiento de servicios); alto coste operativo, se necesita un equipo DevOps especializado; depuración difícil, los problemas pueden requerir rastreo entre múltiples servicios; difícil garantizar la consistencia de datos; infraestructura de despliegue y monitorización compleja |
| **Casos de uso**       | Equipos grandes (>50 personas), negocio complejo que requiere evolución independiente de módulos, ciertos módulos necesitan escalado independiente, necesidad de stacks multilingüe, sistemas con altos requisitos de disponibilidad |
| **Casos no adecuados** | Equipos pequeños, negocio simple, tráfico bajo y estable, sin equipo de operaciones profesional |

::: details ⚠️ Trampas de los microservicios
**Trampa 1: Monolito distribuido**

Dividiste en 10 microservicios, pero están fuertemente acoplados entre sí:

- El servicio A llama al servicio B, B llama a C, y C vuelve a llamar a A
- Para cambiar una funcionalidad, hay que modificar 5 servicios a la vez
- Al desplegar, deben desplegarse en orden secuencial, o el sistema falla

**Esto es peor que un monolito**: tienes la complejidad del monolito sin disfrutar de los beneficios del despliegue independiente de los microservicios.

**Trampa 2: Sobre-división**

Convertir una funcionalidad de solo 100 líneas de código en un servicio independiente:

- 10 servicios, cada uno con solo 100 líneas de código
- La sobrecarga de comunicación entre servicios (serialización/deserialización de red) es más pesada que la lógica de negocio real
- Coste operativo explosivo: hay que desplegar, monitorizar y recopilar logs de 10 servicios

**Enfoque correcto**: Divide desde la perspectiva de cohesión funcional, un microservicio debe ser una capacidad de negocio completa (como "servicio de pedidos", no "servicio de creación de pedidos" y "servicio de consulta de pedidos").
:::

### 4.6 Stack tecnológico de microservicios

| Categoría                  | Tecnología/Herramienta              | Función                                  |
| -------------------------- | ----------------------------------- | ---------------------------------------- |
| **Contenedores**           | Docker, containerd                  | Empaquetado y aislamiento de aplicaciones |
| **Orquestación**           | Kubernetes, Docker Swarm            | Gestión de contenedores y autoescalado   |
| **Descubrimiento de servicios** | Consul, etcd, ZooKeeper         | Registro y descubrimiento de servicios   |
| **API Gateway**            | Kong, Zuul, Envoy                   | Entrada unificada, enrutamiento, limitación de tasa |
| **Centro de configuración** | Apollo, Nacos, Spring Cloud Config | Gestión centralizada de configuración    |
| **Monitorización y alertas** | Prometheus, Grafana, ELK          | Monitorización de métricas y análisis de logs |
| **Trazado distribuido**    | Jaeger, Zipkin, SkyWalking          | Rastreo de solicitudes distribuidas      |
| **Service Mesh**           | Istio, Linkerd                      | Gobernanza de tráfico y seguridad        |

---

## 5. La era Serverless y Cloud Native (2020s+)

### 5.1 Motivación de Serverless

Aunque los microservicios son buenos, mantener docenas de pequeñas cocinas sigue siendo agotador. Tienes que preocuparte por:

- ¿Es la cocina suficientemente grande? (escalado del servidor)
- ¿Qué pasa si hay un corte de luz? (alta disponibilidad)
- ¿Cómo gestionar tantos contenedores? (coste operativo)

<ServerlessDemo />

::: tip 💡 Serverless no significa "sin servidores"
**Serverless** significa que "no necesitas gestionar servidores", no que realmente no haya servidores.

**Analogía**:

- **Era de servidores físicos**: Compras el terreno, construyes el local, lo decoras, contratas chefs, compras ingredientes... todo por tu cuenta
- **Era de servidores cloud**: Alquilas un restaurante ya decorado, pero contratas a tus propios chefs y gestionas la operación
- **Era Serverless**: Solo necesitas diseñar el menú, en la nube hay cocinas compartidas con chefs profesionales, haces el pedido y ellos cocinan, pagas por uso

**Cambio fundamental**:

- Antes: Comprar servidor → configurar entorno → desplegar código → monitorizar → escalar → mantener
- Ahora: Escribir código → subir → pagar por uso

**Es como el delivery de comida**: No necesitas una cocina, solo diseñar el menú, alguien cocina por ti.
:::

### 5.2 Introducción a Serverless

**Serverless = FaaS + BaaS**

**FaaS** (Function as a Service, función como servicio):

- Solo escribes funciones (como "enviar correo de bienvenida al registrar un usuario")
- El proveedor cloud se encarga de ejecutar la función, con autoescalado
- Ejemplos representativos: AWS Lambda, Alibaba Cloud Function Compute

**BaaS** (Backend as a Service, backend como servicio):

- Inicio de sesión → Auth0 / Supabase Auth
- Pagos → Stripe
- Base de datos → Supabase / Firebase / DynamoDB
- Mensajería → Kafka / SQS

::: tip 🎯 Casos de uso de Serverless
**Mejores escenarios**:

1. **Tráfico fluctuante**: Una app de comida a domicilio, con mucho tráfico al mediodía y casi nadie a medianoche. Serverless asigna automáticamente 1000 máquinas al mediodía y reduce a 0 durante la noche
2. **Orientado a eventos**: "Cuando un usuario sube una imagen, comprimirla automáticamente"
3. **Validación rápida**: Equipos pequeños, MVP, proyectos de hackathon

**Escenarios no adecuados**:

1. **Tareas de larga duración**: Transcripción de video (puede ejecutarse 1 hora, el tiempo máximo de ejecución de una función suele ser de 15 minutos)
2. **Aplicaciones que requieren baja latencia**: Trading de alta frecuencia (la latencia de arranque en frío puede ser de decenas de milisegundos a varios segundos)
3. **Necesidad de control fino de bajo nivel**: Ajustes del kernel del sistema operativo, acceso directo a GPU
:::

### 5.3 Ventajas y desventajas de Serverless y Cloud Native

| Dimensión              | Evaluación                                                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ventajas**           | Cero coste operativo, los desarrolladores solo se centran en el código de negocio; autoescalado, respuesta perfecta a picos de tráfico; pago por uso, coste cercano a cero sin tráfico; despliegue rápido, disponible globalmente en minutos; alta disponibilidad integrada, los servicios cloud gestionan la conmutación por error automáticamente |
| **Desventajas**        | Latencia de arranque en frío (cientos de milisegundos a varios segundos); límite de tiempo de ejecución (normalmente 5-15 minutos); depuración difícil, difícil simular completamente el entorno cloud localmente; riesgo de dependencia del proveedor; no apto para tareas de larga duración o intensivas en cómputo; el coste puede superar al de soluciones tradicionales con tráfico alto y continuo |
| **Casos de uso**       | Procesamiento orientado a eventos (procesamiento de imágenes, notificaciones); aplicaciones con tráfico fluctuante (páginas de eventos, promociones); prototipado rápido y validación de MVP; APIs de baja frecuencia o tareas en segundo plano; equipos pequeños sin equipo de operaciones dedicado |
| **Casos no adecuados** | Aplicaciones que requieren baja latencia continua; tareas de cómputo de larga duración; escenarios sensibles al arranque en frío (trading de alta frecuencia); escenarios que requieren control fino de la infraestructura subyacente |

::: details 💰 Comparativa de costes: ¿Cuándo es Serverless más caro?
**Escenario 1: Acceso de baja frecuencia**

- Servidor tradicional: $20/mes (con o sin visitas)
- Serverless: 1 millón de solicitudes × $0.0002/solicitud = $20 (solo pagas cuando hay tráfico)
- **Conclusión**: En escenarios de baja frecuencia, Serverless es más económico

**Escenario 2: Acceso de alta frecuencia continua**

- Servidor tradicional: $20/mes
- Serverless: 100 millones de solicitudes × $0.0002/solicitud = $20,000
- **Conclusión**: En escenarios de alta frecuencia continua, el servidor tradicional es más económico

**Escenario 3: Tráfico fluctuante**

- Servidor tradicional: Para soportar los picos, necesitas un servidor de $100/mes (con utilización de recursos de solo el 10% en horas valle)
- Serverless: $20 en picos, casi $0 en horas valle
- **Conclusión**: En escenarios de tráfico fluctuante, Serverless ahorra costes

**Lección**: No adoptes Serverless a ciegas, haz un cálculo de costes basado en las características reales de tu tráfico.
:::

### 5.4 Stack tecnológico y plataformas Serverless

| Categoría                 | Tecnología/Plataforma        | Características                                    |
| ------------------------- | ---------------------------- | -------------------------------------------------- |
| **Plataformas FaaS**      | AWS Lambda                   | El primer servicio FaaS, ecosistema más maduro     |
|                           | Azure Functions              | Alta integración con Microsoft Cloud, amigable con .NET |
|                           | Google Cloud Functions       | Integración profunda con servicios GCP             |
|                           | Alibaba Cloud Function Compute | Ecosistema doméstico chino completo, optimización de arranque en frío |
|                           | Tencent Cloud Cloud Functions | Integración con el ecosistema WeChat              |
|                           | Vercel/Netlify Functions     | Amigable para desarrolladores frontend, despliegue en edge |
| **Servicios BaaS**        | Firebase                     | Solución backend móvil de Google                   |
|                           | Supabase                     | Alternativa open source a Firebase con PostgreSQL  |
|                           | AWS Amplify                  | Plataforma de desarrollo de aplicaciones web y móviles de AWS |
| **Herramientas de despliegue** | Serverless Framework     | Despliegue multi-cloud, comunidad activa           |
|                           | Terraform                    | Infraestructura como código                        |
|                           | Pulumi                       | Definir infraestructura con lenguajes de programación |

---

## 6. Comparativa de etapas arquitectónicas y guía de selección

### 6.1 Comparativa completa de la evolución arquitectónica

<ArchitectureComparisonDemo />

| Dimensión                    | Servidores físicos        | Arquitectura monolítica | Microservicios + Contenedores | Serverless           |
| ---------------------------- | ------------------------- | ----------------------- | ----------------------------- | -------------------- |
| **Tamaño del equipo**        | 1-5 personas              | 5-50 personas           | 50-500 personas               | 1-20 personas        |
| **Complejidad de despliegue** | Muy alta                  | Baja                    | Muy alta                      | Muy baja             |
| **Coste operativo**          | Alto                      | Medio                   | Muy alto                      | Bajo                 |
| **Escalabilidad**            | Mala                      | Escalado vertical limitado | Escalado horizontal excelente | Autoescalado         |
| **Flexibilidad del stack**   | Ninguna                   | Único                   | Diversificado                 | Limitado             |
| **Arranque en frío**         | No                        | No                      | Tiempo de inicio del contenedor | Con latencia         |
| **Casos de uso**             | Sistemas legacy, requisitos especiales de cumplimiento | Startups, negocio simple | Grandes empresas de Internet, negocio complejo | Validación rápida, orientado a eventos |

### 6.2 Árbol de decisión para selección tecnológica

```
Inicio de selección
    │
    ├─ ¿El equipo tiene personal de operaciones especializado?
    │   ├─ Sí → Considerar microservicios o servidores físicos
    │   └─ No → Continuar evaluando
    │
    ├─ ¿Necesitas lanzar rápidamente para validar una idea?
    │   ├─ Sí → Serverless o monolito
    │   └─ No → Continuar evaluando
    │
    ├─ ¿Tamaño del equipo > 50 personas?
    │   ├─ Sí → Considerar microservicios
    │   └─ No → Continuar evaluando
    │
    ├─ ¿El tráfico tiene picos y valles evidentes?
    │   ├─ Sí → Serverless
    │   └─ No → Arquitectura monolítica (recomendado para startups)
    │
    └─ ¿Requisitos especiales (cumplimiento, sistemas legacy)?
        └─ Sí → Servidores físicos
```

::: tip 🎯 Consejos de selección para principiantes
**Si eres desarrollador o un equipo pequeño:**

1. **Fase 0 (Aprendizaje)**: Ejecuta una aplicación monolítica en local, comprende HTTP, bases de datos y arquitectura básica
2. **Fase 1 (MVP)**: Despliega la aplicación monolítica en un servidor cloud (como Alibaba Cloud ECS, AWS EC2)
3. **Fase 2 (Crecimiento)**: Cuando el equipo supere las 10 personas y el negocio se vuelva complejo, considera extraer 1-2 microservicios
4. **Fase 3 (Madurez)**: Cuando el equipo supere las 50 personas y el tráfico alcance millones, migra completamente a microservicios

**Principio clave**: No empieces con microservicios desde el principio, eso es "optimización prematura". Deja que la arquitectura evolucione con el crecimiento del negocio.
:::

### 6.3 Arquitectura recomendada según el escenario

#### Escenario 1: Desarrollador independiente / proyecto secundario

- **Arquitectura recomendada**: Serverless (Vercel/Netlify) o aplicación monolítica
- **Razón**: Coste operativo casi nulo, pago por uso, despliegue rápido
- **Stack de ejemplo**: Next.js + Vercel + Supabase

#### Escenario 2: Startup validando MVP

- **Arquitectura recomendada**: Arquitectura monolítica + servidor cloud
- **Razón**: Velocidad de desarrollo rápida, el equipo puede centrarse en la lógica de negocio en lugar de la infraestructura
- **Stack de ejemplo**: Spring Boot / Django / Rails + RDS + ECS

#### Escenario 3: Empresa en crecimiento (equipo de 10-50 personas)

- **Arquitectura recomendada**: Monolito modular o microservicios ligeros
- **Razón**: Empiezan a aparecer problemas de acoplamiento de código, pero aún no se necesita la complejidad completa de los microservicios
- **Stack de ejemplo**: Spring Cloud / Go Micro + Kubernetes

#### Escenario 4: Gran empresa de Internet

- **Arquitectura recomendada**: Microservicios + Service Mesh + arquitectura de plataforma central
- **Razón**: Equipo grande, negocio complejo, necesidad de ritmo de publicación independiente y stacks tecnológicos variados
- **Stack de ejemplo**: Framework RPC propio + Istio + plataforma PaaS propia

#### Escenario 5: Aplicación orientada a eventos / tráfico fluctuante

- **Arquitectura recomendada**: Serverless + bus de eventos
- **Razón**: Grandes fluctuaciones de tráfico, necesidad de optimización de costes extrema y autoescalado
- **Stack de ejemplo**: AWS Lambda + API Gateway + EventBridge

---

## 7. Resumen y ruta de aprendizaje

### 7.1 Puntos clave

La evolución de la arquitectura backend consiste esencialmente en **sumar** y **restar**:

| Era              | Arquitectura | Lo que hace el desarrollador       | Lo que hace operaciones              |
| :--------------- | :----------- | :--------------------------------- | :----------------------------------- |
| **Era física**   | Máquina única | Escribir scripts, despliegue manual | Mantener sala de servidores y hardware |
| **Era monolítica** | Un solo bloque | Escribir toda la lógica de negocio | Mantener unos pocos servidores grandes |
| **Era de microservicios** | Dividido | Centrarse en un solo negocio       | Mantener clúster K8s (¡muy cansado!)  |
| **Serverless**   | Funciones    | Solo escribir funciones principales | Tomar té (el proveedor cloud se encarga de todo) |

**Ideas clave**:

- La evolución arquitectónica no es "la nueva tecnología reemplaza a la antigua", sino un **cambio en los escenarios de aplicación**
- No hay bala de plata, cada arquitectura tiene sus límites de aplicación
- Al elegir arquitectura hay que considerar: tamaño del equipo, complejidad del negocio, características del tráfico, capacidad operativa

### 7.2 Recomendaciones de ruta de aprendizaje

Según tu etapa profesional, se recomiendan las siguientes rutas de aprendizaje:

#### Fase 1: Construir bases sólidas (0-1 año)

**Objetivo**: Comprender los conceptos fundamentales del backend, ser capaz de desarrollar aplicaciones monolíticas de forma independiente

- Dominar un lenguaje backend (Java/Python/Go, elige uno)
- Aprender el protocolo HTTP y diseño de APIs RESTful
- Dominar bases de datos relacionales (MySQL/PostgreSQL)
- Comprender los fundamentos del caching (Redis)
- Aprender Git y comandos básicos de Linux
- **Proyecto práctico**: Completar una aplicación CRUD con arquitectura monolítica (como un sistema de blog, lista de tareas)

#### Fase 2: Ampliar capacidades (1-3 años)

**Objetivo**: Comprender sistemas distribuidos, ser capaz de participar en el desarrollo de microservicios

- Estudiar en profundidad la arquitectura de microservicios y estrategias de división
- Dominar los fundamentos de Docker y Kubernetes
- Aprender colas de mensajes (Kafka/RabbitMQ)
- Comprender transacciones distribuidas y consistencia
- Dominar monitorización y logs (Prometheus/ELK)
- **Proyecto práctico**: Dividir una aplicación monolítica en 3-5 microservicios, desplegar con Docker

#### Fase 3: Profundización especializada (3-5 años)

**Objetivo**: Ser capaz de diseñar sistemas a gran escala, tener capacidad de selección tecnológica

- Comprender en profundidad la arquitectura Cloud Native (Service Mesh, Serverless)
- Dominar planificación de capacidad y optimización de rendimiento
- Conocer arquitecturas multi-activas y diseño de recuperación ante desastres
- Aprender DDD (Domain-Driven Design)
- Cultivar el juicio técnico y el pensamiento arquitectónico
- **Proyecto práctico**: Diseñar una arquitectura de sistema que soporte millones de usuarios, incluyendo alta disponibilidad y escalado elástico

### 7.3 Recursos recomendados para aprendizaje continuo

**Libros**:

- "Designing Data-Intensive Applications" (DDIA) - Lectura obligatoria sobre sistemas distribuidos
- "Cloud Native Patterns"
- "Building Microservices"
- "Domain-Driven Design"

**Recursos en línea**:

- Documentación oficial de arquitectura de AWS/Azure/Alibaba Cloud
- Documentación de proyectos CNCF (Cloud Native Computing Foundation)
- Blogs técnicos de grandes empresas (Netflix Tech Blog, blog técnico de Alibaba, etc.)

---

## 8. Glosario rápido

| Término            | Nombre completo                       | Explicación                                                                 |
| :----------------- | :------------------------------------ | :-------------------------------------------------------------------------- |
| **Backend**        | -                                     | Sistema del lado del servidor, responsable de la lógica de negocio, almacenamiento de datos e interfaces externas |
| **CGI**            | Common Gateway Interface              | Tecnología web dinámica temprana, procesa solicitudes mediante scripts y devuelve resultados |
| **Monolith**       | -                                     | Arquitectura monolítica, empaqueta toda la lógica de negocio en una sola aplicación |
| **Microservices**  | -                                     | Arquitectura de microservicios, divide el negocio en múltiples servicios independientes |
| **Container**      | -                                     | Tecnología de contenedores, empaqueta la aplicación y sus dependencias en una unidad portable |
| **K8s**            | Kubernetes                            | Plataforma de orquestación de contenedores, para planificar, escalar y gobernar contenedores |
| **Service Mesh**   | -                                     | Malla de servicios, responsable de la gobernanza de comunicación, observabilidad y seguridad entre microservicios |
| **Serverless**     | -                                     | Computación sin servidor, los desarrolladores solo escriben funciones, la plataforma las ejecuta y escala automáticamente |
| **BaaS**           | Backend as a Service                  | Servicios cloud de backend listos para usar (autenticación, base de datos, pagos, etc.) |
| **CI/CD**          | Continuous Integration / Delivery     | Integración y entrega continua, flujo automatizado de pruebas y despliegue |
| **Observability**  | -                                     | Observabilidad, uso de logs/métricas/trazas para comprender el estado de ejecución del sistema |