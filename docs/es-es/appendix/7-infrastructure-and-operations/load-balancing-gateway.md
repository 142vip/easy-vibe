# Principios de balanceo de carga y puerta de enlace
::: tip 🎯 Pregunta central
**Cuando un solo servidor no puede con la carga, ¿cómo distribuimos el tráfico de forma "inteligente" entre múltiples instancias?** El balanceo de carga es el "distribuidor" de los sistemas distribuidos modernos. Este artículo utiliza casos reales (caja de una tienda de té, clasificación de paquetería, control de tráfico) para comprender en profundidad la filosofía de diseño y la práctica de ingeniería del balanceo de carga.
:::

---

## 1. Motivación de balanceo de carga

### 1.1 Empecemos con un caso real: la evolución de la arquitectura de un sitio web

Una startup experimentó graves problemas de rendimiento durante su rápido crecimiento de usuarios:

**Reconstrucción del escenario:**

```
Fase 1: Un solo servidor
Usuario → Servidor (1 núcleo, 2 GB)
       ↓
  1,000 usuarios activos diarios → Hora pico: 1,000 visitas simultáneas
       ↓
Problema: CPU al 100%, respuesta lenta, caídas frecuentes
```

::: warning ⚠️ Problemas fatales de un solo servidor

- **Cuello de botella de rendimiento**: CPU al 100%, tiempo de respuesta > 5 segundos
- **Punto único de fallo**: Si el servidor se cae, todo el sitio web queda inaccesible
- **Escalabilidad limitada**: Solo se puede escalar verticalmente (añadir CPU, RAM), costoso y con límites
  :::

**Arquitectura mejorada (con balanceo de carga):**

```
Fase 2: Múltiples servidores + balanceo de carga
Usuario → Balanceador de carga (Nginx)
       ↓
     ├→ Servidor 1 (1 núcleo, 2 GB)
     ├→ Servidor 2 (1 núcleo, 2 GB)
     └→ Servidor 3 (1 núcleo, 2 GB)
```

::: tip ✨ Resultados de la mejora

- **Mejora de rendimiento**: 3 servidores procesando en paralelo, tiempo de respuesta < 1 segundo
- **Alta disponibilidad**: Si un servidor falla, los demás siguen sirviendo
- **Escalado horizontal**: ¿Necesitas más rendimiento? Solo añade más servidores
  :::

### 1.2 Una analogía cotidiana del balanceo de carga

**La caja de una tienda de té**

Imagina que abres una tienda de té de moda:

- **1 caja registradora**: Los clientes hacen cola, los que esperan se impacientan, malas reseñas
- **3 cajas registradoras**: El personal asigna clientes a diferentes cajas, la eficiencia se triplica

**El balanceador de carga es el "asignador de cajas"**:

- **Usuarios** (clientes) → Solicitan servicio
- **Balanceador de carga** (asignador) → Distribuye las solicitudes a diferentes servidores
- **Servidores** (cajas registradoras) → Procesan las solicitudes

<LoadBalancerTypesDemo />

---

## 2. Introducción a balanceo de carga

### 2.1 Balanceo de carga de capa 4 (L4): Solo mira el número de puerta

**Opera en la capa de transporte (TCP/UDP)**, como un mensajero que solo mira el **número de puerta (dirección IP + puerto)**, sin importarle lo que haya dentro.

**Características:**

- **Velocidad extrema**: Solo hace reenvío simple de direcciones, sin analizar el contenido de los paquetes
- **Casos de uso**: Conexiones a bases de datos, caché Redis, servidores de juegos con conexiones persistentes
- **Productos representativos**: LVS (Linux Virtual Server), AWS NLB, Azure Load Balancer

::: details Principio de funcionamiento

```
Solicitud del cliente → Balanceador L4 → Servidor backend
              ↓
         Solo mira IP + Puerto
              ↓
         Reenvío rápido (sin desempaquetar contenido)
```

:::

### 2.2 Balanceo de carga de capa 7 (L7): Inspecciona el contenido del artefacto de compilación

**Opera en la capa de aplicación (HTTP/HTTPS)**, como un mensajero que no solo mira el número de puerta, sino que también **abre el paquete para inspeccionar el contenido** y decide cómo entregarlo según lo que encuentra.

**Características:**

- **Enrutamiento inteligente**: Puede enrutar según ruta URL, cabeceras HTTP, Cookies, etc.
- **Funciones avanzadas**: Descarga SSL, caché de contenido, compresión, WAF de seguridad
- **Casos de uso**: Aplicaciones web, API Gateway, arquitectura de microservicios
- **Productos representativos**: Nginx, HAProxy, AWS ALB, Envoy

::: details Principio de funcionamiento

```
Solicitud del cliente → Balanceador L7 → Analiza contenido HTTP
              ↓
         Inspecciona URL, Header, Cookie
              ↓
         Enrutamiento inteligente a un servidor específico
```

:::

### 2.3 Comparativa L4 vs L7

| Dimensión                    | Balanceo de carga L4        | Balanceo de carga L7                 |
| :--------------------------- | :-------------------------- | :----------------------------------- |
| **Capa de operación**        | Transporte (TCP/UDP)        | Aplicación (HTTP/HTTPS)              |
| **Criterio de decisión**     | Dirección IP + Puerto       | URL, Header, Cookie, Body            |
| **Velocidad de procesamiento** | Extremadamente rápido (kernel) | Rápido (análisis en espacio de usuario) |
| **Riqueza de funciones**     | Reenvío básico              | Descarga SSL, caché, compresión, WAF |
| **Escenarios típicos**       | BD, juegos, conexiones largas | Apps web, API Gateway, microservicios |
| **Productos representativos** | LVS, AWS NLB               | Nginx, HAProxy, AWS ALB              |

---

## 3. Problema central #1: Enfoque de evitar que un servidor "estropeado" siga recibiendo tráfico

### 3.1 Health Check: No dejes que un servidor "enfermo" lastre el sistema

Imagina que una de tus cajas registradoras se estropea de repente, pero el asignador no lo sabe y sigue enviando clientes allí. El resultado: la cola se hace cada vez más larga y los clientes se quejan amargamente.

**El Health Check es el "centinela" que previene esta situación**. Examina periódicamente cada servidor, retira inmediatamente de la cola a los que están "enfermos" y los vuelve a incorporar cuando se "recuperan".

<!-- <HealthCheckDemo /> -->

### 3.2 Health Check activo vs Health Check pasivo

**Health Check activo (Active Health Check)**: El balanceador "toca la puerta" proactivamente preguntando al servidor "¿sigues ahí?"

- Envía sondas periódicas (ej. HTTP /health, TCP ping)
- Si el tiempo de respuesta expira o devuelve un código de error, se considera no saludable
- **Ventaja**: Resultados precisos y fiables
- **Desventaja**: Genera tráfico adicional de sondeo

**Health Check pasivo (Passive Health Check)**: El balanceador "observa" la respuesta del tráfico real de negocio

- Estadísticas de tiempo de respuesta y tasa de error de las solicitudes reales
- Varios fallos consecutivos marcan el servidor como no saludable
- **Ventaja**: No genera tráfico adicional
- **Desventaja**: Necesita suficiente volumen de tráfico para emitir un juicio

::: details Tabla de umbrales
| Indicador | Umbral saludable | Umbral no saludable | Descripción |
|:---|:---|:---|:---|
| **Código de estado HTTP** | 200-399 | 400+ o timeout | 4xx/5xx se consideran fallos |
| **Conexión TCP** | Establecida con éxito | Timeout de conexión | Verifica si el puerto es accesible |
| **Tiempo de respuesta** | < 500 ms | > 2000 ms | El timeout suele fijarse en 2-5 segundos |
| **Fallos consecutivos** | - | 3 veces | Evita falsos positivos por fluctuaciones puntuales |
| **Intervalo de verificación** | - | 5 s | Demasiado frecuente aumenta la carga |

::: tip 💡 Error común: Umbrales demasiado "sensibles"
Un equipo configuró el umbral de tiempo de respuesta del health check en 100 ms, cuando el tiempo medio de respuesta de su aplicación oscilaba entre 80 y 120 ms. El resultado fue que los servidores se marcaban frecuentemente como "no saludables", provocando que el tráfico saltara constantemente entre servidores sanos y enfermos, y la disponibilidad general del sistema empeoró.

**La práctica correcta**: El umbral debe establecerse en **2-3 veces el tiempo de respuesta P99**, dejando suficiente margen para las fluctuaciones normales.
:::

---

## 4. Problema central #2: Enfoque de asegurar que un "cliente habitual" siempre sea atendido por el mismo "instancia backend"

### 4.1 Persistencia de sesión: Que el "cliente habitual" siempre vaya al mismo "instancia backend"

Imagina que eres un cliente habitual de la tienda de té. Cada vez te atiende el mismo empleado, que ya conoce tus preferencias (mitad de azúcar, sin hielo) y te sirve rápido y con atención. Pero si cada vez te toca alguien nuevo, tienes que repetir las mismas preferencias una y otra vez, y la eficiencia se desploma.

**La persistencia de sesión (Session Persistence / Sticky Session)** resuelve este problema: asegura que las solicitudes del mismo usuario siempre se enruten al mismo servidor backend.

<SessionPersistenceDemo />

### 4.2 Comparativa de tres mecanismos de persistencia de sesión

| Mecanismo        | Principio                                      | Ventajas                                   | Desventajas                                | Casos de uso                      |
| :--------------- | :--------------------------------------------- | :----------------------------------------- | :----------------------------------------- | :-------------------------------- |
| **Inserción de Cookie** | El LB inserta una Cookie en la respuesta; las siguientes solicitudes la incluyen | No se ve afectado por cambios de IP, aplica desde la primera solicitud | El cliente debe soportar Cookies; pueden estar deshabilitadas | Carrito de e-commerce, estado de login |
| **Hash de IP**   | Calcula un hash de la IP del cliente y lo asigna a un servidor específico | Sin dependencia del cliente, sin estado    | Cambios de IP pierden la sesión; distribución no uniforme | Entornos sin Cookies, WebSocket |
| **Tabla de sesiones sticky** | El LB mantiene una tabla de mapeo sesión → servidor | Soporta replicación de sesión y failover   | Consume memoria del LB; necesita sincronización adicional | Escenarios con requisitos estrictos de alta disponibilidad |

::: tip 💡 Recomendaciones de uso

- **Inserción de Cookie**: Recomendación prioritaria, buena compatibilidad
- **Hash de IP**: Solo para escenarios especiales como WebSocket
- **Tabla de sesiones sticky**: Complementa las Cookies, proporciona capacidad de failover
  :::

---

## 5. Problema central #3: Enfoque de lograr despliegues sin tiempo de inactividad

### 5.1 Despliegue Blue-Green: Publicación sin downtime con "un solo clic"

**Idea central**: Mantener simultáneamente dos entornos de producción completamente idénticos (entorno azul y entorno verde), pero solo uno sirve tráfico externo.

<BlueGreenDeploymentDemo />

**Flujo de trabajo:**

1. **Estado inicial**: Entorno azul ejecutando v1.0 (producción), entorno verde en espera.
2. **Desplegar nueva versión**: Desplegar v1.1 en el entorno verde y ejecutar pruebas de humo internas.
3. **Cambiar el tráfico**: Apuntar el balanceador de carga al entorno verde; el tráfico cambia instantáneamente a v1.1.
4. **Monitorizar y observar**: Observar el estado de ejecución del entorno verde, confirmar que no hay anomalías.
5. **Conservar la versión antigua**: Mantener el entorno azul con v1.0 durante un tiempo (ej. 24 horas) como seguro para rollback rápido.

::: tip ✨ Análisis de ventajas y desventajas
| Ventajas | Desventajas |
|:---|:---|
| ✅ Cero downtime, el cambio se completa en milisegundos | ❌ Alto coste de recursos, mantener dos entornos simultáneamente |
| ✅ Rollback rápido: al detectar problemas, se vuelve inmediatamente al entorno original | ❌ Cambios en el esquema de BD requieren tratamiento especial de compatibilidad |
| ✅ El nuevo entorno se puede probar completamente antes de recibir tráfico | ❌ No apto para servicios con estado (ej. conexiones largas WebSocket) |

:::

### 5.2 Canary Release: Estrategia de lanzamiento gradual "paso a paso"

El nombre "Canary Release" proviene históricamente del "canario en la mina de carbón": los mineros llevaban un canario al pozo; si el canario mostraba anomalías, significaba que había una fuga de gas tóxico y los mineros evacuaban de inmediato. En el despliegue de software, el canary release consiste en exponer primero a un pequeño porcentaje de usuarios a la nueva versión, observar que no haya problemas y luego ampliar gradualmente el alcance.

<CanaryReleaseDemo />

**Idea central:**

1. **Tráfico reducido primero**: Derivar inicialmente el 1% del tráfico a los servidores de la nueva versión.
2. **Observar indicadores**: Monitorizar continuamente tasa de error, latencia e indicadores clave de negocio.
3. **Ampliación progresiva**: Si todo es normal, aumentar gradualmente la proporción al 5%, 10%, 25%, 50%, 100%.
4. **Rollback rápido**: Ante cualquier anomalía, redirigir inmediatamente todo el tráfico a la versión anterior.

::: tip 💡 Ventajas del Canary Release
| Ventaja | Descripción |
|:---|:---|
| 🎯 **Riesgo controlado** | Incluso si la nueva versión tiene un bug grave, solo afecta a un pequeño número de usuarios |
| 📊 **Validación real** | Se valida en el entorno de producción real, más fiable que el entorno de pruebas |
| 🚀 **Iteración rápida** | El equipo puede publicar nuevas funcionalidades con más frecuencia y confianza |
| 💰 **Eficiente en recursos** | No requiere dos entornos completos como el despliegue blue-green |

:::

---

## 6. Problema central #4: Enfoque de sistema "respire" por sí mismo

### 6.1 Auto Scaling: Que el sistema sea tan flexible como la planificación de turnos de un restaurante

Imagina que tienes un restaurante:

- **Hora punta del almuerzo**: Necesitas 10 camareros, pero a las 3 de la tarde solo necesitas 2
- Si siempre mantienes 10\*\*: El coste de personal se dispara
- Si siempre tienes solo 2: En hora punta los clientes no pueden esperar y se van todos

**El Auto Scaling** hace que el sistema sea como un restaurante con "turnos flexibles": añade servidores automáticamente cuando hay mucha demanda y los reduce cuando hay poca.

<AutoScalingDemo />

### 6.2 Selección de indicadores para el escalado

La pregunta central del auto scaling es: **¿Cuándo hay que añadir máquinas? ¿Cuándo hay que quitarlas?**

Indicadores comunes de decisión:

| Indicador               | Umbral de scale-out | Umbral de scale-in | Escenario aplicable            |
| :---------------------- | :------------------ | :----------------- | :----------------------------- |
| **Uso de CPU**          | > 70%               | < 30%              | Aplicaciones intensivas en CPU |
| **Uso de memoria**      | > 75%               | < 40%              | Aplicaciones intensivas en memoria |
| **QPS (consultas/seg)** | > 1000/s            | < 400/s            | API Gateway, servicios web     |
| **Número de conexiones** | > 5000              | < 1000             | Bases de datos, colas de mensajes |
| **Indicadores de negocio personalizados** | Según el negocio | Según el negocio | Escenarios de negocio específicos |

::: tip 💡 Trampas y soluciones del auto scaling

**Trampa 1: El escalado reacciona demasiado lento, el pico de tráfico ya ha tumbado el sistema**

Durante una gran promoción de e-commerce, se configuró CPU > 80% para disparar el scale-out, pero la recolección de métricas tenía 1 minuto de retraso y las nuevas instancias tardaban 3 minutos en arrancar. El tráfico llegó tan rápido que el escalado no se completó a tiempo y los servidores ya estaban caídos.

**Solución:**

- **Escalado anticipado**: Predecir picos de tráfico basándose en datos históricos y comenzar el escalado 30 minutos antes
- **Umbrales multinivel**: 60% aviso (precalentar nuevas instancias), 70% escalado formal, 80% escalado de emergencia
- **Escalado rápido**: Usar despliegue con contenedores, nuevas instancias en 30 segundos (vs. 3-5 minutos en máquinas virtuales)

**Trampa 2: Escalado demasiado agresivo, costes disparados**

Una startup configuró una política de auto scaling agresiva: CPU > 50% disparaba scale-out. El resultado fue que una fluctuación normal de negocio disparó el escalado, y el número de servidores pasó de 5 a 30. La factura de la nube a fin de mes hizo llorar al CTO.

**Solución:**

- **Establecer un cooldown de escalado**: Después de un scale-out, esperar al menos 5 minutos antes de otro
- **Establecer un número máximo de instancias**: max = instancias actuales × 2, para evitar crecimiento ilimitado
- **Distinguir picos puntuales de tendencias**: Solo escalar si se supera el umbral durante 3 períodos consecutivos, evitando disparos por picos aislados

**Trampa 3: El scale-in es demasiado rápido, las máquinas recién añadidas se eliminan enseguida**

Un equipo configuró scale-in con CPU < 30%. Tras un scale-out, el tráfico aún se estaba asimilando y la CPU bajó momentáneamente al 25%, disparando el scale-in. Justo después de reducir, la CPU volvió a subir al 80%, disparando otro scale-out: el sistema entró en oscilación "scale-out → scale-in → scale-out".

**Solución:**

- **Scale-in más conservador**: Umbral de scale-out al 70%, umbral de scale-in al 25%, con suficiente margen entre ambos
- **Cooldown de scale-in más largo**: Después de un scale-out, esperar al menos 10 minutos antes de poder hacer scale-in
- **Scale-in gradual**: Reducir solo 1 instancia cada vez, observar y luego decidir si continuar
  :::

---

## 7. Guía práctica: Enfoque de elegir un balanceador de carga

### 7.1 Comparativa de balanceadores de carga principales

| Característica        | Nginx                               | HAProxy                  | Envoy              | Balanceadores cloud    |
| --------------------- | ----------------------------------- | ------------------------ | ------------------ | ---------------------- |
| **Posicionamiento**   | Proxy inverso / balanceador de alto rendimiento | Balanceador open source | Proxy cloud-native | Balanceador gestionado |
| **Rendimiento**       | Muy alto (C, event-driven)          | Alto (event-driven)      | Alto (C++/Rust)    | Muy alto               |
| **Funcionalidad**     | Balanceo básico, archivos estáticos, caché | Algoritmos de balanceo ricos | Enrutamiento avanzado, observabilidad | Funcionalidad completa |
| **Configuración**     | Archivo de configuración (nginx.conf) | Archivo de configuración (haproxy.cfg) | API / Archivo de configuración | Consola UI     |
| **Extensibilidad**    | Módulos C / scripts Lua             | Scripts Lua              | WASM / Filter      | Plugins                |
| **Casos de uso**      | Recursos estáticos, balanceo L7, terminación SSL | Balanceo L7, alta disponibilidad | Service Mesh, multi-cloud | Implementación rápida |

::: tip 💡 Recomendaciones de selección
**Árbol de decisión:**

```
Elegir un balanceador de carga:
│
├─ ¿Solo necesitas balanceo de carga L4 básico?
│  ├─ Sí → LVS (open source gratuito) o NLB del proveedor cloud
│  └─ No → Continuar
│
├─ ¿Necesitas Service Mesh, despliegue multi-cloud?
│  ├─ Sí → Envoy
│  └─ No → Continuar
│
├─ ¿Necesitas configuración y plugins extremadamente complejos?
│  ├─ Sí → HAProxy
│  └─ No → Continuar
│
├─ ¿Necesitas alto rendimiento + configuración sencilla?
│  ├─ Sí → Nginx (primera opción)
│  └─ Continuar
│
├─ ¿Prefieres operación gestionada?
│  ├─ Sí → Balanceador del proveedor cloud (AWS ALB, Alibaba SLB)
│  └─ Nginx auto-gestionado
```

:::

---

## 8. Resumen: Principios fundamentales del balanceo de carga

### 8.1 Repaso de los principios básicos

| Principio    | Significado                                  | Puntos clave de implementación                                        |
| ------------ | -------------------------------------------- | --------------------------------------------------------------------- |
| **Capas**    | L4 maneja "clasificación de paquetes" (rápido pero simple) | L4 para BD, juegos; L7 para Web, API                                |
| **Redundancia** | El punto único de fallo es el enemigo de la arquitectura | Mejorar disponibilidad con múltiples instancias y despliegue multi-región |
| **Progresividad** | No hagas "corte radical" al publicar nuevas versiones | Blue-green para cero downtime; Canary para riesgo controlado          |
| **Elasticidad** | El sistema debe "respirar" como un organismo vivo | Escalar automáticamente cuando hay demanda, reducir cuando está tranquilo |

### 8.2 Checklist de diseño

Antes de introducir balanceo de carga, hazte estas preguntas:

- [ ] ¿Realmente necesito balanceo de carga? (¿Es realmente insuficiente el rendimiento de una sola máquina?)
- [ ] ¿Elegir L4 o L7? (Según el escenario de negocio)
- [ ] ¿Cómo manejar la persistencia de sesión? (Cookie, Hash de IP, Tabla de sesiones)
- [ ] ¿Cómo implementar health checks? (Activo, pasivo, configuración de umbrales)
- [ ] ¿Cómo lograr cero downtime? (Blue-green deployment, Canary)
- [ ] ¿Cómo implementar elasticidad? (Indicadores de escalado, cooldown, número máximo de instancias)

---

## 9. Glosario rápido

| Término                      | Inglés                                    | Explicación                                                                       |
| ---------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------- |
| **Balanceador de carga**     | Load Balancer                             | Dispositivo o software que distribuye tráfico entre múltiples servidores backend  |
| **Balanceo de carga L4**     | L4 Load Balancing                         | Balanceo de carga basado en la capa de transporte (TCP/UDP)                       |
| **Balanceo de carga L7**     | L7 Load Balancing                         | Balanceo de carga basado en la capa de aplicación (HTTP/HTTPS)                    |
| **Health Check**             | Health Check                              | Mecanismo de verificación periódica del estado de salud de los servidores backend |
| **Persistencia de sesión**   | Session Persistence                       | Asegura que las solicitudes de un mismo usuario siempre vayan al mismo servidor   |
| **Sesión pegajosa**          | Sticky Session                            | Otro nombre, equivalente a Session Persistence                                    |
| **Despliegue Blue-Green**    | Blue-Green Deployment                     | Estrategia de publicación sin downtime alternando dos entornos                    |
| **Canary Release**           | Canary Release                            | Estrategia de publicación gradual validando primero con poco tráfico              |
| **Auto Scaling**             | Auto Scaling                              | Añadir o reducir servidores automáticamente según la carga                        |
| **Escalado horizontal**      | Horizontal Scaling                        | Aumentar el número de servidores para incrementar la capacidad de procesamiento   |
| **Escalado vertical**        | Vertical Scaling                          | Mejorar la configuración de una sola máquina (CPU, RAM) para más capacidad        |
| **Multi-Región**             | Multi-Region                              | Desplegar servicios en múltiples regiones geográficas                             |
| **Active-Active**            | Active-Active                             | Múltiples regiones sirviendo tráfico simultáneamente                              |
| **Active-Standby**           | Active-Standby                            | Solo una región sirve tráfico, las demás en espera                                |
| **Replicación de datos**     | Data Replication                          | Mecanismo de replicación de datos entre regiones                                  |
| **RTO**                      | Recovery Time Objective (RTO)             | Objetivo de tiempo de recuperación: cuánto tiempo máximo para restaurar el servicio tras un fallo |
| **RPO**                      | Recovery Point Objective (RPO)            | Objetivo de punto de recuperación: cantidad de datos que se puede permitir perder tras un fallo |
