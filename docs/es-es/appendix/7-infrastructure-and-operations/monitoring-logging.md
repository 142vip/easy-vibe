# Principios de monitoreo, registros y alertas
> 💡 **Guía de estudio**: Este capítulo no requiere conocimientos de programación. A través de demostraciones interactivas, te guiará por el sistema completo de operaciones. Desde monitoreo y alertas hasta resolución de fallos, desde planificación de capacidad hasta automatización de operaciones, domina todas las habilidades de operación de sistemas en producción.

## 0. Introducción: El lanzamiento es solo el comienzo

Muchos principiantes piensan: "Cuando el código se despliega en producción, el trabajo está terminado."

**¡Gran error!**

El lanzamiento del sistema es solo el **punto de partida del trabajo de operaciones**. Es como comprar un coche nuevo: el mantenimiento, las reparaciones y el repostaje son lo habitual después.

Las operaciones tienen tres objetivos:

1. **Estabilidad (Stability)**: El sistema no se cae, el servicio siempre está disponible
2. **Rendimiento (Performance)**: Respuesta rápida, buena experiencia de usuario
3. **Seguridad (Security)**: Los datos no se filtran, prevenir ataques

---

## 1. Sistema de Monitoreo (Monitoring)

El monitoreo es los "ojos" de las operaciones. Un sistema sin monitoreo es como conducir a ciegas: no sabes cuándo surge un problema.

### 1.1 Los tres niveles de monitoreo

<MonitoringDashboardDemo />

**Monitoreo de infraestructura**: enfocado en los recursos de hardware del servidor

- Uso de CPU
- Uso de memoria
- Espacio en disco e I/O
- Ancho de banda de red

**Monitoreo de aplicación**: enfocado en el estado de ejecución del software

- QPS (consultas por segundo)
- Tiempo de respuesta (latencia)
- Tasa de errores
- Estado de llamadas a servicios dependientes

**Monitoreo de negocio**: enfocado en la salud del negocio

- DAU/MAU (usuarios activos diarios/mensuales)
- Volumen de pedidos
- Tasa de éxito de pagos
- Tasa de retención de usuarios

### 1.2 Stack de herramientas de monitoreo

| Herramienta     | Uso                          | Características                              |
| :-------------- | :--------------------------- | :------------------------------------------- |
| **Prometheus**  | Recolección y almacenamiento de métricas | Base de datos de series temporales, ideal para datos de monitoreo |
| **Grafana**     | Paneles de visualización     | Gráficos y dashboards potentes               |
| **Zabbix**      | Monitoreo integral           | Herramienta veterana, funcionalidad completa |
| **Datadog**     | Plataforma de monitoreo SaaS | Solución todo en uno, de pago                |

**Punto clave**: El monitoreo debe ser estratificado, cubriendo desde la infraestructura hasta el negocio de forma integral, para evitar "puntos ciegos".

---

## 2. Sistema de Alertas (Alerting)

Cuando el monitoreo detecta un problema, es necesario notificar al personal de operaciones a tiempo: esto es **alertar**.

### 2.1 Flujo de alertas

<AlertFlowDemo />

### 2.2 Diseño de niveles de alerta

Una clasificación razonable de alertas evita la "fatiga de alertas":

| Nivel   | Tiempo de respuesta       | Escenario típico                              | Canal de notificación            |
| :------ | :------------------------ | :-------------------------------------------- | :------------------------------- |
| **P0**  | Inmediato (en 5 minutos)  | Caída de servicio principal, fallo en pagos   | Llamada + SMS + DingTalk         |
| **P1**  | En 30 minutos             | Funcionalidad parcial anómala, degradación grave de rendimiento | SMS + DingTalk + correo          |
| **P2**  | Mismo día                 | Uso de recursos elevado, errores esporádicos  | DingTalk + correo                |
| **P3**  | Esta semana               | Problemas no críticos, sugerencias de optimización | Correo                           |

### 2.3 Convergencia y reducción de ruido de alertas

**Punto de dolor**: Un pequeño problema puede desencadenar cientos o miles de alertas, insensibilizando al personal de guardia.

**Soluciones**:

1. **Agrupación de alertas**: Fusionar alertas similares (por ejemplo, múltiples problemas en el mismo servidor se combinan en una sola alerta)
2. **Supresión de alertas**: Si la alerta padre ya se ha disparado, las alertas hijas no se repiten
3. **Reglas de silencio**: Pausar alertas automáticamente durante periodos de mantenimiento
4. **Límite de frecuencia**: No repetir la misma alerta en un intervalo corto de tiempo

**Punto clave**: Las alertas deben ser "pocas pero precisas", cada una debe merecer ser atendida.

---

## 3. Gestión de Registros (Logging)

Los registros son la "caja negra" para investigar problemas.

### 3.1 Niveles de registro

```javascript
console.debug('Información detallada de depuración') // Uso en desarrollo
console.info('Información general') // Registro de flujo normal
console.warn('Información de advertencia') // Problema potencial
console.error('Información de error') // Error que requiere atención
```

### 3.2 Registros estructurados

Registro tradicional (no recomendado):

```
2024-01-15 10:23:45 ERROR User john failed to login, attempts=3, ip=192.168.1.100
```

Registro estructurado (recomendado):

```json
{
  "timestamp": "2024-01-15T10:23:45Z",
  "level": "ERROR",
  "message": "User login failed",
  "user": "john",
  "attempts": 3,
  "ip": "192.168.1.100",
  "service": "auth-service"
}
```

### 3.3 Stack de registros ELK

**ELK = Elasticsearch + Logstash + Kibana**

- **Logstash**: Recolección y filtrado de registros
- **Elasticsearch**: Almacenamiento y búsqueda de registros
- **Kibana**: Consulta y visualización de registros

**Buenas prácticas**:

- ✅ No registrar información sensible (contraseñas, tokens)
- ✅ Registrar obligatoriamente operaciones críticas (inicio de sesión, pagos, cambios de permisos)
- ✅ Los registros deben incluir contexto (ID de usuario, ID de solicitud, marca de tiempo)
- ✅ Limpiar periódicamente los registros caducados para evitar que el disco se llene

---

## 4. Trazado de Solicitudes (Tracing)

En una arquitectura de microservicios, una solicitud puede pasar por una docena de servicios. ¿Cómo rastrear su ruta completa?

**Trace ID y Span ID**

- **Trace ID**: Identificador único de toda la cadena de solicitudes (como un número de seguimiento de paquetería)
- **Span ID**: Identificador de una llamada a un servicio individual (como cada estación de tránsito)

### 4.1 Demostración de trazado distribuido

<TraceVisualizationDemo />

### 4.2 Estándar OpenTelemetry

OpenTelemetry (OTel) es el **estándar de la industria** para el trazado de solicitudes, proporcionando una API y SDK unificados.

```javascript
// Ejemplo: usar OpenTelemetry para registrar un Span
import { trace } from '@opentelemetry/api'

const tracer = trace.getTracer('my-service')

async function processOrder(orderId) {
  // Crear un Span
  const span = tracer.startSpan('processOrder')

  try {
    // Establecer atributos
    span.setAttribute('order.id', orderId)

    // Lógica de negocio...
    await validateOrder(orderId)
    await saveToDatabase(orderId)

    span.setStatus({ code: SpanStatusCode.OK })
  } catch (error) {
    span.recordException(error)
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message })
  } finally {
    span.end() // Finalizar Span
  }
}
```

**Punto clave**: El trazado de solicitudes permite localizar rápidamente cuellos de botella de rendimiento y puntos de fallo, siendo una herramienta imprescindible para microservicios.

---

## 5. Proceso de Resolución de Fallos

Los fallos en producción son inevitables. La clave es **responder rápido y recuperarse rápido**.

### 5.1 Flujo de manejo de incidencias

<IncidentResponseDemo />

### 5.2 Herramientas comunes de diagnóstico

| Herramienta   | Uso                            | Escenario típico                                  |
| :------------ | :----------------------------- | :------------------------------------------------ |
| **tcpdump**   | Captura y análisis de paquetes | Problemas de red, pérdida de paquetes             |
| **strace**    | Trazado de llamadas al sistema | Proceso bloqueado, problemas de permisos de archivos |
| **Arthas**    | Diagnóstico Java               | CPU elevada, fuga de memoria, deadlock            |
| **top/htop**  | Monitoreo de recursos del sistema | Uso elevado de CPU/memoria                     |
| **netstat**   | Visualización de conexiones de red | Puerto ocupado, número anómalo de conexiones  |
| **lsof**      | Ver archivos abiertos          | Archivo en uso, disco lleno                      |

**Ejemplo de Arthas** (herramienta de diagnóstico Java de código abierto de Alibaba):

```bash
# Ver los 5 hilos con mayor uso de CPU
$ top -H -p 12345

# Ver el tiempo de ejecución de un método
$ trace com.example.OrderService createOrder

# Ver campos estáticos de una clase
$ getstatic com.example.Config MAX_CONNECTIONS

# Actualización en caliente de código (sin reiniciar)
$ mc /tmp/Test.java
$ redefine /tmp/Test.class
```

### 5.3 Análisis post-mortem

**¡El post-mortem no es una reunión para buscar culpables!**

El propósito del post-mortem es:

1. Reconstruir la línea de tiempo del fallo
2. Encontrar la causa raíz (Root Cause Analysis)
3. Resumir lecciones aprendidas
4. Establecer medidas de mejora

**Método de los 5 porqués**:

Preguntar "por qué" al menos 5 veces para encontrar la causa raíz:

- ¿Por qué se cayó el servicio?
  - Porque se desbordó la memoria
- ¿Por qué se desbordó la memoria?
  - Porque había demasiados datos en caché
- ¿Por qué había demasiados datos en caché?
  - Porque no se configuró un tiempo de expiración
- ¿Por qué no se configuró un tiempo de expiración?
  - Porque se omitió durante el desarrollo
- **Causa raíz**: Falta de revisión de código y casos de prueba

**Punto clave**: Establecer una cultura blameless, enfocándose en la mejora de procesos en lugar de la responsabilidad personal.

---

## 6. Optimización de Rendimiento

### 6.1 Análisis de cuellos de botella de rendimiento

**Enfoque de optimización de arriba hacia abajo**:

```
Percepción del usuario
  ↓
Optimización del frontend (reducir solicitudes, CDN, carga diferida)
  ↓
Optimización de red (HTTP/2, compresión, conexiones persistentes)
  ↓
Optimización del backend (caché, asincronía, procesamiento por lotes)
  ↓
Optimización de base de datos (índices, optimización de consultas, sharding)
  ↓
Optimización del sistema (parámetros del kernel, ajuste de JVM)
```

### 6.2 Optimización de base de datos

**Optimización de índices**:

```sql
-- Consulta lenta (sin índice)
SELECT * FROM orders WHERE user_id = 12345;

-- Crear un índice lo acelera 100 veces
CREATE INDEX idx_user_id ON orders(user_id);
```

**Optimización de consultas**:

```sql
-- ❌ Evitar SELECT *
SELECT * FROM users WHERE id = 123;

-- ✅ Consultar solo los campos necesarios
SELECT id, name, email FROM users WHERE id = 123;

-- ❌ Evitar demasiados elementos en IN
SELECT * FROM orders WHERE user_id IN (1, 2, 3, ..., 10000);

-- ✅ Usar JOIN o consultas por lotes
SELECT * FROM orders o JOIN user_ids u ON o.user_id = u.id;
```

### 6.3 Optimización de caché

**Arquitectura de caché multinivel**:

```
Caché del navegador (CDN)
  ↓
Caché local (memoria/Guava)
  ↓
Caché distribuida (Redis/Memcached)
  ↓
Base de datos (MySQL/PostgreSQL)
```

**Estrategias de actualización de caché**:

| Estrategia          | Ventajas                  | Desventajas               | Escenario aplicable                  |
| :------------------ | :------------------------ | :------------------------ | :----------------------------------- |
| **Cache-Aside**     | Simple, fiable            | Primera consulta lenta    | Muchas lecturas, pocas escrituras    |
| **Write-Through**   | Buena consistencia de datos | Escritura lenta          | Lectura y escritura equilibradas     |
| **Write-Behind**    | Escritura muy rápida      | Posible pérdida de datos  | Muchas escrituras, pocas lecturas, se tolera inconsistencia temporal |

**Punto clave**: La caché no es una bala de plata. Hay que considerar problemas de consistencia, avalancha, penetración, etc. (consulta el capítulo "Diseño de caché del sistema").

---

## 7. Planificación de Capacidad

### 7.1 Evaluación de capacidad

<CapacityPlanningDemo />

### 7.2 Pruebas de estrés

**Selección de herramientas**:

| Herramienta | Características                     | Escenario aplicable               |
| :---------- | :---------------------------------- | :-------------------------------- |
| **JMeter**  | Potente, visual                     | Pruebas de estrés de API HTTP     |
| **wrk/ab**  | Ligero, línea de comandos           | Pruebas de referencia rápidas     |
| **Locust**  | Scripts en Python, distribuido      | Pruebas de estrés en escenarios complejos |
| **K6**      | Moderno, scripts en JS              | Integración en CI/CD              |

**Ejemplo de wrk**:

```bash
# Instalar wrk
$ brew install wrk  # macOS
$ apt install wrk   # Ubuntu

# Prueba de estrés de API HTTP (10 hilos, 30 segundos)
$ wrk -t10 -c100 -d30s http://example.com/api/users

# Salida:
# Running 30s test @ http://example.com/api/users
# 10 threads and 100 connections
# Thread Stats Avg Stdev Max +/- Stdev
# Latency 45.32ms 12.45ms 120.50ms 87.56%
# Req/Sec 2.12k 123.45 3.45k 89.01%
# 632450 requests in 30.00s, 1.23GB read
# Requests/sec: 21081.67
```

### 7.3 Escalado elástico

**Escalado automático en la era cloud-native**:

```yaml
# Kubernetes HPA (Horizontal Pod Autoscaler)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

**Cuando el uso de CPU supera el 70%, se escalan automáticamente los Pods (máximo 10)**

**Punto clave**: Combinar con predicciones de negocio (como el Black Friday) para escalar con antelación y evitar quedarse corto.

---

## 8. Operaciones de Seguridad

### 8.1 Control de acceso

**Principio de mínimo privilegio**:

- Los desarrolladores solo pueden acceder al entorno de desarrollo
- El personal de operaciones solo puede acceder al entorno de producción, y requiere aprobación
- Las operaciones sensibles en la base de datos requieren doble confirmación

**Bastion Host (Jump Server)**:

Todas las operaciones de administración se realizan a través del bastion host, registrando un historial completo de operaciones.

### 8.2 Copia de seguridad de datos

**Principio de copia de seguridad 3-2-1**:

- **3** copias de los datos (1 original + 2 copias de seguridad)
- **2** tipos diferentes de medios de almacenamiento (disco local + almacenamiento en la nube)
- **1** copia externa (para prevenir desastres en un único punto)

**Estrategias de copia de seguridad**:

| Tipo                   | Frecuencia | Retención | RTO     | RPO      |
| :--------------------- | :--------- | :-------- | :------ | :------- |
| **Copia completa**     | Semanal    | 1 mes     | 4 horas | 24 horas |
| **Copia incremental**  | Diaria     | 1 semana  | 2 horas | 1 hora   |
| **Copia en tiempo real** | Segundos  | 7 días    | Minutos | Segundos |

**RTO (Recovery Time Objective)**: Tiempo objetivo de recuperación (cuánto tiempo máximo puede estar interrumpido el servicio)
**RPO (Recovery Point Objective)**: Punto objetivo de recuperación (cuántos datos se pueden perder como máximo)

### 8.3 Escaneo de vulnerabilidades

**Escaneos periódicos**:

- **Escaneo de código**: SonarQube, ESLint (detección de vulnerabilidades potenciales)
- **Escaneo de dependencias**: npm audit, Snyk (detección de vulnerabilidades en librerías de terceros)
- **Escaneo de contenedores**: Trivy, Clair (detección de vulnerabilidades en imágenes)

```bash
# Ejemplo de npm audit
$ npm audit

found 3 vulnerabilities (1 moderate, 2 high)

Package         Severity  Vulnerable versions
lodash          high      <4.17.21
express         moderate  4.0.0 - 4.18.2

# Reparación automática
$ npm audit fix
```

---

## 9. Operaciones Automatizadas (DevOps)

### 9.1 Pipeline de CI/CD

```yaml
# Ejemplo de .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - npm install
    - npm test
  tags:
    - docker

build:
  stage: build
  script:
    - docker build -t myapp:$CI_COMMIT_SHA .
    - docker push registry.example.com/myapp:$CI_COMMIT_SHA
  only:
    - main

deploy:
  stage: deploy
  script:
    - kubectl set image deployment/myapp myapp=registry.example.com/myapp:$CI_COMMIT_SHA
  environment:
    name: production
  when: manual # Despliegue manual
```

### 9.2 Infraestructura como Código (IaC)

**Ejemplo de Terraform** (gestión de recursos en la nube):

```hcl
# main.tf
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "WebServer"
    Env  = "production"
  }
}

resource "aws_security_group" "web" {
  name = "web-sg"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

**Ventajas**:

- ✅ Control de versiones: toda la configuración en Git
- ✅ Reproducibilidad: entornos consistentes
- ✅ Auditabilidad: historial de cambios claro
- ✅ Reversibilidad: volver rápidamente a una versión anterior

### 9.3 Práctica de GitOps

**GitOps = Git + IaC + Automatización**

Principio fundamental: **El repositorio Git es la única fuente de verdad de la infraestructura**

Flujo de trabajo:

```
1. Modificar archivos de configuración (push a Git)
   ↓
2. Los cambios en el repositorio Git disparan CI/CD
   ↓
3. Ejecución automática de terraform apply/kubectl apply
   ↓
4. La infraestructura se actualiza automáticamente
   ↓
5. El monitoreo compara el estado real con el estado deseado
```

**Herramientas**: ArgoCD, Flux (despliegue en Kubernetes)

---

## 10. Resumen y Buenas Prácticas

Las operaciones son un sistema enorme, pero su núcleo se puede resumir en:

### 10.1 Modelo de madurez de operaciones

| Nivel        | Características                          | Prácticas                                             |
| :----------- | :--------------------------------------- | :---------------------------------------------------- |
| **Inicial**  | Respuesta reactiva, operaciones manuales | Solo se actúa cuando hay problemas, despliegue manual |
| **Medio**    | Automatizado, estandarizado              | CI/CD, monitoreo y alertas, documentación             |
| **Avanzado** | Preventivo, auto-recuperación            | Planificación de capacidad, simulación de fallos, escalado automático |
| **Experto**  | Inteligente, sin intervención humana     | AIOps, Chaos Engineering, Serverless                  |

### 10.2 Un día en la vida de un ingeniero de operaciones

```
09:00 - Revisar alertas nocturnas, confirmar el estado del sistema
10:00 - Gestionar problemas reportados por usuarios
11:00 - Reunión semanal de desarrollo, evaluar riesgos operativos de nuevas soluciones
14:00 - Optimizar consultas lentas, mejorar el rendimiento
15:00 - Revisión de código (Code Review)
16:00 - Redactar documentación de despliegue, actualizar reglas de monitoreo
17:00 - Simulación de fallos (Chaos Engineering)
18:00 - Traspaso de guardia
```

### 10.3 Ruta de aprendizaje

**Fase inicial** (1-3 meses):

- Aprender comandos comunes de Linux
- Comprender el sistema de monitoreo (Prometheus + Grafana)
- Dominar la consulta de registros (ELK)

**Fase intermedia** (3-6 meses):

- Comprender a fondo la tecnología de contenedores (Docker + K8s)
- Dominar una herramienta de diagnóstico (Arthas, tcpdump)
- Practicar pipelines de CI/CD

**Fase avanzada** (6-12 meses):

- Optimización de rendimiento (base de datos, JVM, red)
- Planificación de capacidad y optimización de costes
- Análisis post-mortem y mejora de procesos

**Fase experta** (más de 1 año):

- Diseño de arquitectura (alta disponibilidad, recuperación ante desastres)
- Chaos Engineering (inyección proactiva de fallos)
- AIOps (operaciones inteligentes)

---

## 11. Glosario

| Término          | Nombre completo                    | Explicación                                                              |
| :--------------- | :--------------------------------- | :----------------------------------------------------------------------- |
| **Monitoring**   | -                                  | Monitoreo, observación en tiempo real del estado de ejecución del sistema. |
| **Alerting**     | -                                  | Alertas, notificación al personal correspondiente ante anomalías.        |
| **Logging**      | -                                  | Registro, documentación de eventos durante la ejecución del sistema.     |
| **Tracing**      | -                                  | Trazado, seguimiento de la ruta completa de una solicitud en un sistema distribuido. |
| **QPS**          | Queries Per Second                 | Consultas por segundo, mide el rendimiento del sistema.                  |
| **Latency**      | -                                  | Latencia, tiempo desde que se emite una solicitud hasta que se recibe la respuesta. |
| **RTO**          | Recovery Time Objective            | Tiempo objetivo de recuperación, cuánto tiempo máximo puede estar interrumpido el servicio. |
| **RPO**          | Recovery Point Objective           | Punto objetivo de recuperación, cuántos datos se pueden perder como máximo. |
| **Post-mortem**  | -                                  | Análisis post-mortem, análisis de las causas del fallo y medidas de mejora. |
| **CI/CD**        | Continuous Integration/Delivery    | Integración y entrega continuas, pruebas y despliegue automatizados.     |
| **IaC**          | Infrastructure as Code             | Infraestructura como código, gestión de servidores, redes y otros recursos mediante código. |
| **GitOps**       | -                                  | Operaciones con Git, el repositorio Git es la única fuente de verdad de la infraestructura. |
| **ELK**          | Elasticsearch + Logstash + Kibana  | El trío de recolección, almacenamiento y visualización de registros.     |
| **SLA**          | Service Level Agreement            | Acuerdo de nivel de servicio, disponibilidad comprometida (por ejemplo, 99.9%). |
| **Blameless**    | -                                  | Cultura sin culpables, el post-mortem se enfoca en la mejora de procesos, no en la responsabilidad personal. |

---

## 12. Lecturas adicionales

- **[Diseño de caché del sistema](/zh-cn/appendix/4-server-and-backend/caching)** - Principios, patrones y buenas prácticas de caché
- **[Diseño de colas de mensajes](/zh-cn/appendix/4-server-and-backend/message-queues)** - Recorte de picos, desacoplamiento asíncrono
- **[Principios y práctica de autenticación](/zh-cn/appendix/4-server-and-backend/auth-authorization)** - Autenticación, autorización y refuerzo de seguridad
- **[Historia evolutiva del backend](/zh-cn/appendix/4-server-and-backend/backend-layered-architecture)** - Del monolito a los microservicios y Serverless
- **[Despliegue y lanzamiento](/zh-cn/appendix/7-infrastructure-and-operations/ci-cd)** - El último kilómetro del desarrollo a producción