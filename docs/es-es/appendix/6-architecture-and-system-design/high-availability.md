# Principios de alta disponibilidad y recuperación ante desastres

::: tip Prefacio
**Un sistema caído 1 minuto puede significar pérdidas de cientos de miles.** La alta disponibilidad (High Availability) se refiere a la capacidad de un sistema para seguir prestando servicios ante situaciones anómalas como fallos de hardware, bugs de software o problemas de red. La recuperación ante desastres (Disaster Recovery) es la capacidad del sistema para restaurar sus servicios cuando ocurre un desastre de mayor envergadura.
:::

**¿Qué aprenderás en este artículo?**

Después de completar este capítulo, podrás:

- **Medición de disponibilidad**: Comprender el significado de "cuántos nueves" y los tiempos de inactividad correspondientes
- **Failover**: Dominar las arquitecturas de alta disponibilidad como activo-standby, activo-activo y multi-site
- **Estrategias de recuperación ante desastres**: Conocer los conceptos de RPO y RTO y sus métodos de diseño
- **Detección de fallos**: Entender mecanismos de detección como heartbeat, sondas y circuit breaker
- **Ingeniería del caos**: Aprender a inyectar fallos proactivamente para verificar la resiliencia del sistema

| Capítulo | Contenido | Concepto clave |
|-----|------|---------|
| **Cap. 1** | Medición de disponibilidad | SLA, cuántos nueves, tiempo de inactividad |
| **Cap. 2** | Arquitectura de failover | Activo-standby, activo-activo, multi-AZ, multi-región activo-activo |
| **Cap. 3** | Diseño de recuperación ante desastres | RPO, RTO, estrategias de respaldo |
| **Cap. 4** | Detección y recuperación de fallos | Heartbeat, circuit breaker, auto-escalado |
| **Cap. 5** | Ingeniería del caos | Inyección de fallos, verificación de resiliencia |

---

## 1. Medición de disponibilidad: qué significan los "nueves"

La disponibilidad se mide habitualmente en "nueves", con la fórmula:

**Disponibilidad = Tiempo de funcionamiento / Tiempo total × 100%**

Por ejemplo, si en un mes (30 días = 43200 minutos) el sistema estuvo caído 43 minutos, la disponibilidad es (43200 - 43) / 43200 ≈ 99.9%. Cada nueve adicional reduce el tiempo de inactividad permitido en un orden de magnitud, y la dificultad y el costo de implementación crecen exponencialmente.

| Nivel de disponibilidad | Porcentaje | Inactividad mensual permitida | Inactividad anual permitida | Requisito típico |
|-----------|--------|------------|------------|---------|
| 2 nueves | 99% | 7.3 horas | 3.65 días | Herramientas internas |
| 3 nueves | 99.9% | 43 minutos | 8.76 horas | Sistemas de negocio normales |
| 4 nueves | 99.99% | 4.3 minutos | 52.6 minutos | E-commerce, SaaS |
| 5 nueves | 99.999% | 26 segundos | 5.26 minutos | Finanzas, pagos |

<AvailabilityCalculatorDemo />

::: tip ¿Qué es un SLA?
**SLA (Service Level Agreement, Acuerdo de Nivel de Servicio)** es el compromiso formal entre el proveedor de servicios y el cliente. Por ejemplo, AWS S3 garantiza una disponibilidad del 99.99%; si no la cumple, reembolsará proporcionalmente. Un SLA no es solo un indicador técnico, sino un contrato comercial — violar el SLA significa perder dinero.
:::

::: tip El abismo entre 3 nueves y 4 nueves
3 nueves (99.9%) significa que se permite una inactividad mensual de 43 minutos — un solo despliegue con problemas y un rollback ya consumen todo el margen.
4 nueves (99.99%) significa que solo se permiten 4 minutos de inactividad mensual — esto requiere un sistema completo de alta disponibilidad con failover automático, despliegues rolling y health checks.
:::

---

## 2. Arquitectura de failover

El failover es el mecanismo central de la alta disponibilidad: cuando el nodo principal falla, se cambia automáticamente al nodo de respaldo para continuar prestando el servicio.

### Modo activo-standby (Active-Standby)

La arquitectura de alta disponibilidad más común. El nodo principal procesa todas las solicitudes, mientras el nodo standby sincroniza datos en tiempo real pero no procesa solicitudes. Si el nodo principal falla, el nodo standby toma el control automáticamente.

```
Estado normal:
  Cliente → Nodo principal (procesa solicitudes)
            Nodo standby (sincroniza datos, en espera)

Failover:
  Cliente → Nodo standby (toma el control como nuevo principal)
            Nodo principal original (fallido, esperando reparación)
```

El problema crítico es el **split-brain**: durante una partición de red, tanto el nodo principal como el standby creen que el otro ha fallado, y ambos sirven solicitudes simultáneamente, provocando inconsistencia de datos. La solución es introducir un **nodo de quórum** — al menos 3 nodos que votan para decidir quién es el nodo principal.

### Multi-AZ (Múltiples zonas de disponibilidad)

Se despliega el servicio en múltiples centros de datos (zonas de disponibilidad) dentro de la misma región. Si un solo centro de datos pierde energía o conectividad, el servicio general no se ve afectado. Las zonas de disponibilidad de los proveedores cloud suelen estar conectadas por enlaces dedicados de baja latencia (< 2 ms).

### Multi-región activo-activo

Se desplieban réplicas completas del servicio en diferentes ciudades o incluso países, y cada sitio puede procesar solicitudes de forma independiente. Este es el nivel más alto de arquitectura de alta disponibilidad, pero también el más complejo — el desafío central es la latencia y la consistencia de la **sincronización de datos entre regiones**.

<FailoverStrategyDemo />

| Arquitectura | Nivel de disponibilidad | Costo | Complejidad | Escenarios aplicables |
|------|-----------|------|--------|---------|
| Servidor único | 99%~99.9% | Bajo | Baja | Desarrollo/pruebas, herramientas internas |
| Activo-standby | 99.9%~99.99% | Medio | Media | Sistemas de negocio de pequeña y mediana escala |
| Multi-AZ | 99.99% | Alto | Alta | E-commerce, plataformas SaaS |
| Multi-región activo-activo | 99.999% | Muy alto | Muy alta | Finanzas, grandes empresas de internet |

---

## 3. Diseño de recuperación ante desastres: RPO y RTO

El diseño de recuperación ante desastres se articula en torno a dos indicadores clave:

| Indicador | Significado de las siglas | Descripción | Ejemplo |
|------|------|------|------|
| RPO | Recovery Point Objective | Cuántos datos se puede tolerar perder | RPO=0 significa que no se puede perder ningún dato |
| RTO | Recovery Time Objective | Cuánto tiempo de inactividad se puede tolerar | RTO=5 min significa que se debe recuperar en 5 minutos |

### Relación entre estrategias de respaldo y RPO

| Método de respaldo | RPO | Costo | Descripción |
|---------|-----|------|------|
| Respaldo completo diario | 24 horas | Bajo | Se puede perder hasta un día de datos |
| Respaldo incremental en tiempo real | A nivel de minutos | Medio | Sincronización continua via binlog/WAL |
| Replicación sincrónica | 0 | Alto | Las escrituras deben esperar confirmación de la réplica |

::: tip No todos los datos necesitan RPO=0
Si se pierde la foto de perfil de un usuario, puede subirla de nuevo (RPO=24h es suficiente), pero un registro de pago no se puede perder bajo ninguna circunstancia (RPO=0). La estrategia de respaldo debe decidirse según el valor de negocio de los datos, no aplicar la misma regla para todo.
:::

---

## 4. Detección y recuperación de fallos

### 4.1 Mecanismos de detección de fallos

| Mecanismo | Principio | Velocidad de detección | Escenarios aplicables |
|------|------|---------|---------|
| Detección de heartbeat | Envío periódico de paquetes heartbeat, el timeout indica fallo | A nivel de segundos | Detección de nodos vivos |
| Health check | Sondas HTTP/TCP para verificar el estado del servicio | A nivel de segundos | Detección de backends en balanceadores de carga |
| Sonda de negocio | Simulación de solicitudes reales para verificar la lógica de negocio | De segundos a minutos | Monitoreo de disponibilidad end-to-end |

**Principio de funcionamiento del heartbeat**: El nodo A envía periódicamente (por ejemplo, cada 5 segundos) una señal de "sigo vivo" al monitor. Si no se reciben N heartbeats consecutivos (por ejemplo, 3), se determina que el nodo A ha fallado. Los parámetros clave son el **intervalo de heartbeat** y el **umbral de timeout** — un intervalo demasiado corto aumenta la sobrecarga de red, y uno demasiado largo retrasa la detección de fallos.

**Tres niveles de health check**:
- **Sonda de vitalidad (Liveness)**: ¿El proceso sigue en ejecución? Si no, reiniciarlo
- **Sonda de preparación (Readiness)**: ¿El servicio puede aceptar solicitudes? Si no, retirarlo del balanceador de carga
- **Sonda de inicio (Startup)**: ¿El servicio ha terminado de iniciar? Si no, esperar, sin interpretarlo como un fallo

### 4.2 Mecanismos de recuperación automática

| Mecanismo | Descripción | Herramientas típicas |
|------|------|---------|
| Reinicio automático | Levantar el proceso automáticamente tras un crash | systemd, PM2, K8s |
| Auto-escalado | Añadir instancias automáticamente cuando aumenta la carga | K8s HPA, Auto Scaling de proveedores cloud |
| Circuit breaker y degradación | Fallo rápido cuando el servicio downstream falla, previene fallos en cascada | Hystrix, Sentinel, Resilience4j |
| Limitación de tasa | Rechazar directamente las solicitudes que exceden la capacidad | Nginx limit_req, limitación en gateway |

**Detalle del patrón Circuit Breaker**:

El circuit breaker se inspira en los fusibles de los circuitos eléctricos — cuando la corriente es excesiva, se desconecta automáticamente para proteger todo el circuito de quemarse. En microservicios, cuando un servicio downstream falla, el circuit breaker se "abre", haciendo que las solicitudes fallen rápidamente en lugar de esperar inútilmente un timeout.

```
Tres estados del circuit breaker:

  Cerrado (normal) ──→ tasa de fallos supera umbral ──→ Abierto (disparado)
       ↑                                    │
       │                              espera tiempo de enfriamiento
       │                                    ↓
       └── solicitud de prueba exitosa ←── Semi-abierto (sondeo)
```

- **Estado cerrado**: Reenvía las solicitudes normalmente mientras contabiliza la tasa de fallos
- **Estado abierto**: Todas las solicitudes retornan error inmediatamente (fallo rápido), sin llamar al downstream
- **Estado semi-abierto**: Tras el tiempo de enfriamiento, se deja pasar un pequeño número de solicitudes de prueba. Si tienen éxito, vuelve al estado cerrado; si fallan, permanece abierto

La **degradación (Fallback)** es la estrategia complementaria del circuit breaker: cuando el circuit breaker se dispara, en lugar de mostrar un error directamente, se retorna un resultado "de respaldo". Por ejemplo, si el servicio de recomendaciones está caído, se retorna una lista de productos populares; si la carga de la foto de perfil del usuario falla, se muestra una imagen predeterminada.

---

## 5. Ingeniería del caos: buscar problemas proactivamente

La filosofía central de la ingeniería del caos es: **en lugar de esperar a que ocurran los fallos, es mejor provocarlos activamente**, verificando la resiliencia del sistema en un entorno controlado.

| Herramienta | Creador | Capacidad principal |
|------|--------|---------|
| Chaos Monkey | Netflix | Terminación aleatoria de instancias en producción |
| Chaos Mesh | PingCAP | Inyección de fallos en entornos K8s |
| Litmus | CNCF | Framework de ingeniería del caos nativo para la nube |
| ChaosBlade | Alibaba | Herramienta de inyección de fallos multi-escenario |

::: tip Pasos para implementar ingeniería del caos
1. **Definir el estado estable**: Especificar las métricas de funcionamiento normal del sistema (por ejemplo, latencia P99 < 200ms)
2. **Plantear una hipótesis**: Si un nodo falla, el sistema debería recuperarse automáticamente en 30 segundos
3. **Inyectar el fallo**: Provocar el fallo de forma controlada (primero en el entorno de pruebas, luego en producción)
4. **Observar los resultados**: ¿El sistema se recuperó como se esperaba? ¿Hubo fallos en cascada?
5. **Corregir debilidades**: Mejorar la arquitectura y los procesos tras descubrir problemas
:::

---

## Resumen

La alta disponibilidad no es una funcionalidad, sino una capacidad arquitectónica. Requiere garantías en cada etapa: diseño, desarrollo, despliegue y operaciones.

Repaso de los puntos clave de este capítulo:

1. **Cuántos nueves**: Cada nueve adicional reduce el tiempo de inactividad en un orden de magnitud, y el costo y la complejidad crecen exponencialmente
2. **Failover**: Desde activo-standby hasta multi-región activo-activo, elegir la arquitectura adecuada según las necesidades del negocio
3. **RPO y RTO**: Diseñar estrategias de respaldo y recuperación según el valor de los datos y la tolerancia del negocio
4. **Automatización**: La detección de fallos, el reinicio automático y el circuit breaker son la infraestructura de la alta disponibilidad
5. **Ingeniería del caos**: Provocar fallos activamente para verificar la resiliencia del sistema en un entorno controlado

## Lecturas complementarias

- [Site Reliability Engineering](https://sre.google/sre-book/table-of-contents/) - El clásico de Google SRE
- [Chaos Monkey](https://netflix.github.io/chaosmonkey/) - Herramienta de ingeniería del caos de Netflix
- [Release It!](https://pragprog.com/titles/mnee2/release-it-second-edition/) - Patrones de diseño para entornos de producción
- [Chaos Mesh](https://chaos-mesh.org/) - Plataforma de ingeniería del caos para K8s
