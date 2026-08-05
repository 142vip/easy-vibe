# Principios de puerta de enlace y proxy inverso
::: tip 🎯 Pregunta Central
**En una arquitectura de internet de alta concurrencia, ¿cómo enrutar el tráfico de forma segura y eficiente al servicio correcto?** El proxy inverso resuelve "cómo distribuir el tráfico", y el API Gateway resuelve "cómo procesar las solicitudes". Este artículo utiliza casos reales (recepcionista, sistema de seguridad, enrutamiento inteligente) para comprender a fondo la filosofía de diseño y la práctica de ingeniería de los gateways.
:::

---

## 1. Motivación de un "Gateway

### 1.1 Un caso real: la evolución de la arquitectura de un e-commerce

Una plataforma de e-commerce encontró graves problemas de arquitectura durante su rápido crecimiento:

**Escenario:**

```
Fase 1: Exposición directa de servicios
Cliente → Llama directamente al servicio de usuarios, servicio de pedidos, servicio de pagos...
         ↓
Problema 1: Las IPs de los servicios quedan expuestas, riesgo de seguridad
Problema 2: No se puede unificar autenticación ni limitación de tasa
Problema 3: Añadir nuevos servicios requiere modificar la configuración del cliente
```

::: warning ⚠️ Problemas fatales de la exposición directa

- **Riesgo de seguridad**: Todas las IPs de los servicios expuestas, vulnerables a ataques
- **Funcionalidad duplicada**: Cada servicio debe implementar autenticación, limitación de tasa y logs
- **Difícil de escalar**: Añadir un nuevo servicio requiere modificar todos los clientes
- **Protocolos inconsistentes**: Algunos usan HTTP, otros gRPC, los clientes deben adaptarse a todos
  :::

**Arquitectura mejorada (con Gateway):**

```
Cliente → API Gateway (Nginx/Kong) → Servicios internos
         ↓
      Autenticación, limitación de tasa y enrutamiento unificados
         ↓
      El cliente solo conoce la dirección del gateway
```

::: tip ✨ Beneficios tras la mejora

- **Seguridad**: Las IPs reales de los servicios quedan ocultas, solo el gateway está expuesto
- **Funcionalidad consolidada**: Autenticación, limitación de tasa y logs se manejan de forma unificada en el gateway
- **Fácil de escalar**: Añadir un nuevo servicio solo requiere configurar el enrutamiento en el gateway
- **Protocolo unificado**: HTTP hacia el exterior, gRPC posible en el interior
  :::

### 1.2 Analogía cotidiana del Gateway

**Recepcionista**

Imagina que visitas una gran empresa:

- **Sin recepcionista**: Los visitantes buscan directamente cada departamento, no saben dónde ir, la empresa es un caos
- **Con recepcionista**: Los visitantes pasan primero por recepción, el recepcionista pregunta el motivo y los guía al departamento correspondiente

**El API Gateway es el "recepcionista" del sistema**:

- **Proxy inverso**: Recepcionista, guía a los visitantes al departamento correcto
- **API Gateway**: Recepcionista inteligente, también verifica la identidad del visitante (autenticación) y limita el número de visitantes (limitación de tasa)

<ReverseProxyDemo />

---

## 2. Introducción a Proxy Inverso

### 2.1 Proxy Directo vs Proxy Inverso

::: tip 🤔 Explicación de términos
**Proxy Directo (Forward Proxy)**:

- Desplegado en el lado del cliente
- Accede a recursos externos en nombre del cliente
- Aplicaciones típicas: VPN, herramientas para saltar el firewall
- Ejemplo: En la red de la empresa, accedes a internet a través de un proxy

**Proxy Inverso (Reverse Proxy)**:

- Desplegado en el lado del servidor
- Recibe solicitudes de los clientes y las reenvía a los servicios internos
- El cliente solo conoce el proxy, no los servidores reales
- Ejemplos: Nginx, HAProxy
  :::

**Tabla comparativa:**

| Dimensión            | Proxy Directo                       | Proxy Inverso                       |
| -------------------- | ----------------------------------- | ----------------------------------- |
| **Ubicación**        | Lado del cliente                    | Lado del servidor                   |
| **A quién sirve**    | Al cliente                          | Al servidor                         |
| **Aplicación típica**| VPN, saltar restricciones           | Balanceo de carga, Gateway          |
| **Transparencia**    | El servidor ve la IP del proxy      | El cliente ve la IP del proxy       |
| **Propósito**        | Ocultar el cliente real, acelerar acceso | Ocultar el servidor real, balanceo de carga |

### 2.2 Valor central del Proxy Inverso

::: details Valor 1: Balanceo de carga
Distribuye el tráfico entre múltiples servidores backend para evitar la sobrecarga de un solo punto.

```
Cliente
  ↓
Nginx (Proxy Inverso)
  ↓
┌───────────┬───────────┬───────────┐
│ Servidor 1│ Servidor 2│ Servidor 3│
└───────────┴───────────┴───────────┘
```

:::

::: details Valor 2: Protección de seguridad
Oculta las IPs reales de los servidores, previniendo ataques directos. La protección de seguridad se unifica en la capa del proxy.

```
Cliente → Solo ve la IP de Nginx
Servidores reales → Solo en la red interna, inaccesibles desde el exterior
```

:::

::: details Valor 3: Terminación SSL
El cifrado/descifrado HTTPS se maneja en la capa del proxy, los servicios backend usan HTTP, reduciendo la sobrecarga de cómputo en el backend.

```
Cliente HTTPS → Nginx (cifrado/descifrado) → Servicio backend HTTP
                       ↑
              Punto de terminación SSL
```

:::

---

## 3. Nginx: Enfoque de maneja millones de conexiones concurrentes

### 3.1 Modelo de procesos Master-Worker

Nginx utiliza una arquitectura **multiproceso**, no multihilo:

**Proceso Master (Administrador)**:

- Responsable de leer y validar archivos de configuración
- Gestiona los procesos Worker (iniciar, detener, recargar)
- No procesa solicitudes concretas

**Procesos Worker (Trabajadores)**:

- Procesan las solicitudes HTTP
- Cada Worker es un proceso independiente, aislado de los demás
- La cantidad suele configurarse igual al número de núcleos de CPU, para evitar sobrecarga por cambio de contexto

::: tip 💡 Ventajas

- **Buen aislamiento**: Si un Worker falla, no afecta a los demás
- **Aprovechamiento multinúcleo**: Cada Worker se ejecuta de forma independiente
- **Evita la complejidad del multihilo**: No hay que manejar bloqueos, condiciones de carrera, etc.
  :::

### 3.2 Event-driven + E/S asíncrona no bloqueante

Este es el secreto central del alto rendimiento de Nginx:

**Apache tradicional (modelo multiproceso/multihilo)**:

- Una conexión = Un proceso/hilo
- La concurrencia está limitada por el número de procesos/hilos del sistema
- Con muchas conexiones, la sobrecarga por cambio de contexto es enorme

**Nginx (modelo event-driven)**:

- Usa mecanismos eficientes de multiplexación de E/S como epoll (Linux) / kqueue (macOS)
- Un proceso Worker puede manejar decenas de miles de conexiones simultáneamente
- Cuando una conexión no tiene datos, no consume CPU; cuando hay datos nuevos, se despierta mediante notificación de eventos

::: tip Analogía cotidiana

- **Apache**: Un restaurante donde cada cliente tiene un camarero dedicado (proceso); con muchos clientes se necesitan muchos camareros
- **Nginx**: Un supercamarero que atiende a todos los clientes simultáneamente, va a quien necesita servicio en lugar de quedarse parado junto a un solo cliente
  :::

<NginxArchitectureDemo />

---

## 4. Introducción a API Gateway

### 4.1 Motivación de un API Gateway

**Imagina un sistema sin gateway:**

- El cliente necesita conocer las direcciones de múltiples servicios (usuarios, pedidos, pagos...)
- Cada servicio debe implementar su propia autenticación, limitación de tasa y logs
- Los protocolos no están unificados, algunos usan HTTP, otros gRPC
- Al actualizar un servicio, el cliente también debe modificarse

::: warning ⚠️ Problemas sin un gateway

- **Cliente complejo**: Necesita configurar múltiples direcciones de servicio
- **Funcionalidad duplicada**: Cada servicio debe implementar autenticación y limitación de tasa
- **Protocolos inconsistentes**: El cliente debe adaptarse a múltiples protocolos
- **Actualizaciones difíciles**: Al actualizar un servicio, el cliente también debe cambiar
  :::

**Con un API Gateway:**

- El cliente solo necesita conocer la dirección del gateway; el gateway enruta al servicio correcto
- Las lógicas transversales como autenticación, limitación de tasa y logs se manejan de forma unificada en el gateway
- El gateway puede hacer conversión de protocolos, exponiendo HTTP uniformemente hacia el exterior
- Al actualizar un servicio backend, solo se cambia la configuración del gateway, el cliente no lo percibe

<ApiGatewayDemo />

### 4.2 Funciones principales del API Gateway

| Función                  | Descripción                                                            | Escenario típico                                              |
| :----------------------- | :--------------------------------------------------------------------- | :------------------------------------------------------------ |
| **Enrutamiento**         | Reenvía solicitudes a diferentes servicios según reglas de URL, Header | `/api/users` → Servicio de usuarios, `/api/orders` → Pedidos  |
| **Balanceo de carga**    | Distribuye el tráfico cuando un servicio tiene múltiples instancias     | Servicio de usuarios con 3 instancias, round-robin             |
| **Autenticación**        | Verifica JWT, OAuth Token de forma unificada                           | Usuarios no autenticados no pueden acceder a `/api/admin`     |
| **Limitación y fusible** | Controla el límite de tráfico para evitar colapsar servicios           | Máximo 1000 solicitudes/segundo, exceso devuelve 429           |
| **Conversión de protocolo**| HTTP hacia el exterior, gRPC posible en el interior                  | El cliente usa HTTP, el gateway convierte a gRPC internamente  |
| **Canary release**       | Desvía parte del tráfico a la nueva versión según Header o porcentaje   | 5% de usuarios prueba la nueva versión, 95% usa la anterior    |
| **Logs y monitoreo**     | Registra logs de solicitudes de forma unificada para análisis          | Registra duración, código de estado y tamaño de cada solicitud |

---

## 5. Gateway en la práctica: Enfoque para construir una arquitectura de gateway completa

### 5.1 Diagrama de arquitectura completo

```
┌───────────────────────────────────────────────────────────────────────┐
│                           Cliente (Navegador/APP)                         │
└───────────────────────────┬─────────────────────────────────────────┘
                                │ HTTPS
                                ▼
┌───────────────────────────────────────────────────────────────────────┐
│                        Capa externa: CDN + WAF                            │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  CDN (Content Delivery Network)                              │  │
│  │  - Caché de recursos estáticos (imágenes, CSS, JS)           │  │
│  │  - Acceso cercano, reduce latencia                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  WAF (Web Application Firewall)                               │  │
│  │  - Protección contra inyección SQL, ataques XSS               │  │
│  │  - Bloqueo de bots maliciosos y crawlers                      │  │
│  │  - Protección contra ataques CC                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────────┐
│                     Capa intermedia: API Gateway (Nginx/Kong)             │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Nivel 1: Terminación SSL + Protección de seguridad           │  │
│  │  - HTTPS / TLS 1.3                                            │  │
│  │  - HSTS, cabeceras de seguridad                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Nivel 2: Autenticación y autorización                        │  │
│  │  - Verificación de JWT Token                                  │  │
│  │  - Integración OAuth 2.0 / SSO                                │  │
│  │  - Gestión de API Key                                         │  │
│  │  - Verificación de permisos (RBAC)                            │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Nivel 3: Control de tráfico                                  │  │
│  │  - Limitación de tasa - Algoritmos Token Bucket/Leaky Bucket  │  │
│  │  - Circuit Breaker - Previene propagación de fallos           │  │
│  │  - Degradación - Plan de respaldo cuando el servicio falla     │  │
│  │  - Canary Release - Distribución de tráfico por porcentaje     │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Nivel 4: Enrutamiento y balanceo de carga                    │  │
│  │  - Path-based Routing                                         │  │
│  │  - Host-based Routing                                         │  │
│  │  - Header-based Routing                                       │  │
│  │  - Algoritmos de balanceo - Round-robin/Ponderado/Least Conn/IP Hash │
│  │  - Integración con Service Discovery                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Nivel 5: Conversión de protocolos y procesamiento de datos   │  │
│  │  - Terminación SSL - HTTPS ↔ HTTP                             │  │
│  │  - Conversión de protocolo - HTTP ↔ gRPC / WebSocket          │  │
│  │  - Transformación de solicitud/respuesta - JSON ↔ XML         │  │
│  │  - Compresión de datos - Gzip / Brotli                        │  │
│  │  - Caché - Recursos estáticos y respuestas API                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────────┐
│                    Capa interna: Clúster de microservicios                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │  Usuarios   │ │   Pedidos   │ │  Productos  │ │    Pagos    │      │
│  │  User Svc   │ │  Order Svc  │ │ Product Svc │ │ Payment Svc │      │
│  │             │ │             │ │             │ │             │      │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘      │
│         │                │                │                │               │
│         └────────────────┴────────────────┴────────────────┘               │
│                                       │                              │
│              Centro de descubrimiento y configuración (etcd)            │
│                    - Registro y descubrimiento de servicios              │
│                    - Health checks                                      │
│                    - Almacenamiento de configuración KV                  │
└───────────────────────────────────────────────────────────────────────┘
```

### 5.2 Enrutamiento y balanceo de carga

Una de las responsabilidades centrales del gateway es **enviar la solicitud al lugar correcto**. Esto implica dos capacidades clave: **enrutamiento** (a qué servidor) y **balanceo de carga** (cómo distribuir el tráfico).

::: details Reglas de enrutamiento: De la URL al servicio
Imagina un sistema de e-commerce, diferentes URLs corresponden a diferentes servicios:

- `/api/users/*` → Servicio de usuarios
- `/api/orders/*` → Servicio de pedidos
- `/api/products/*` → Servicio de productos
- `/api/pay/*` → Servicio de pagos

**Ejemplo de configuración de Nginx:**

```nginx
server {
    listen 80;
    server_name api.example.com;

    # Servicio de usuarios
    location /api/users/ {
        proxy_pass http://user-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Servicio de pedidos
    location /api/orders/ {
        proxy_pass http://order-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Servicio de productos
    location /api/products/ {
        proxy_pass http://product-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Servicio de pagos (requiere mayor nivel de seguridad)
    location /api/pay/ {
        # Restringir acceso por IP
        allow 10.0.0.0/8;
        deny all;

        proxy_pass http://payment-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

:::

::: details Balanceo de carga: Comparación de cuatro estrategias
Cuando un mismo servicio tiene múltiples instancias, ¿cómo elegir?

| Estrategia           | Principio                                                    | Escenario                     | Ventajas                       | Desventajas                           |
| :------------------- | :----------------------------------------------------------- | :---------------------------- | :----------------------------- | :------------------------------------ |
| **Round-Robin**      | Asigna secuencialmente a cada servidor                       | Servidores de rendimiento similar | Simple y justo                 | No considera la carga actual          |
| **Round-Robin Ponderado** | Asigna por peso, más peso = más tráfico                 | Servidores de rendimiento desigual | Aprovecha servidores potentes  | Requiere configurar pesos adecuadamente |
| **Least Connections**| Asigna al servidor con menos conexiones activas              | Conexiones largas, streaming  | Se adapta dinámicamente        | Requiere estadísticas en tiempo real  |
| **IP Hash**          | Hash de la IP del cliente, misma IP siempre al mismo servidor| Necesidad de sesión persistente| Garantiza consistencia de sesión| Una IP con mucho tráfico causa presión |

**Ejemplo de configuración de Nginx:**

```nginx
# Round-Robin ponderado
upstream backend_weighted {
    server 10.0.1.10:8080 weight=3;  # Mayor rendimiento, más tráfico
    server 10.0.1.11:8080 weight=2;
    server 10.0.1.12:8080 weight=1;  # Menor rendimiento, menos tráfico
}

# Least Connections
upstream backend_least_conn {
    least_conn;
    server 10.0.1.10:8080;
    server 10.0.1.11:8080;
    server 10.0.1.12:8080;
}

# IP Hash (persistencia de sesión)
upstream backend_ip_hash {
    ip_hash;
    server 10.0.1.10:8080;
    server 10.0.1.11:8080;
    server 10.0.1.12:8080;
}
```

:::

<LoadBalancingDemo />

---

## 6. Seguridad del Gateway: Enfoque de proteger la puerta del sistema

### 6.1 Autenticación y autorización

**Enfoque tradicional (cada servicio se autentica por separado):**

- Servicio de usuarios, pedidos, pagos... cada uno debe verificar JWT
- Código duplicado, difícil de mantener
- Secrets distribuidos en cada servicio, alto riesgo de filtración

**Autenticación unificada en el gateway:**

- El cliente accede al gateway con un Token
- El gateway verifica la validez del Token (firma, tiempo de expiración)
- Tras la verificación, añade la información del usuario (como user_id) a las cabeceras y reenvía al servicio backend
- El servicio backend no necesita verificar, obtiene la información del usuario directamente del Header

::: tip 💡 Idea central
**Autenticación en el gateway, autorización en el servicio**:

- **Autenticación**: ¿Quién eres? (Verificar Token, obtener identidad del usuario)
- **Autorización**: ¿Qué puedes hacer? (Determinar permisos según el rol del usuario)

Como el recepcionista de una empresa: autentica tu identidad (DNI), pero los permisos específicos los determina cada departamento.
:::

<AuthMiddlewareDemo />

### 6.2 HTTPS y terminación SSL

**¿Por qué necesitamos HTTPS?**

1. **Seguridad**: Evita que los datos sean interceptados durante la transmisión
2. **Cumplimiento**: Los navegadores modernos muestran advertencias de "No seguro" en sitios HTTP
3. **SEO**: Los motores de búsqueda priorizan los sitios HTTPS

**Solución de terminación SSL:**

- Solo se configura HTTPS y certificados en la capa del gateway
- El gateway maneja el handshake TLS y el cifrado/descifrado
- Entre el gateway y los servicios backend se usa HTTP en texto plano (la red interna es confiable)
- Los servicios backend se centran en la lógica de negocio, sin necesidad de manejar TLS

::: tip 💡 Ventajas de la terminación SSL

- **Gestión simplificada**: Los certificados solo se configuran en el gateway, no en el backend
- **Menor sobrecarga**: Los servicios backend no necesitan procesar el handshake TLS
- **Actualización unificada**: La renovación de certificados solo se hace en el gateway
  :::

<SslTerminationDemo />

---

## 7. Limitación de tasa y Circuit Breaker: Enfoque de evitar que el sistema colapse por una "inundación de tráfico"

### 7.1 Comparación de algoritmos de limitación de tasa

| Algoritmo            | Idea central                                          | Tráfico en ráfaga                    | Escenario                           | Complejidad |
| :------------------- | :---------------------------------------------------- | :----------------------------------- | :---------------------------------- | :---------- |
| **Token Bucket**     | Cubo con tokens, se necesita un token para pasar       | Permite ciertas ráfagas              | Limitación de API, control de ancho de banda | Media       |
| **Leaky Bucket**     | Las solicitudes entran al cubo, salen a velocidad fija | Forzado a suavizar, ráfagas se encolan o rechazan | Escenarios que requieren procesamiento estrictamente uniforme | Media       |
| **Sliding Window**   | Cuenta solicitudes dentro de la ventana de tiempo      | Conteo estricto por ventana, exceso rechazado | Estadísticas precisas (ej. "máx. 100 por minuto") | Alta        |

### 7.2 Configuración práctica de limitación de tasa en Nginx

```nginx
# Definir zonas de limitación (en el bloque http)

# 1. Limitación por IP (algoritmo Leaky Bucket)
# zone=mylimit:10m - Nombre de zona y tamaño de memoria (10MB ≈ 160K IPs)
# rate=10r/s - 10 solicitudes por segundo
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

# 2. Límite de conexiones por IP (evita que una sola IP abra demasiadas conexiones)
limit_conn_zone $binary_remote_addr zone=addr:10m;

# 3. Limitación por endpoint de servidor (sin distinguir IP, protege el backend globalmente)
limit_req_zone $server_name zone=server_limit:10m rate=100r/s;

server {
    listen 80;
    server_name api.example.com;

    # Servicio de usuarios - Limitación normal
    location /api/users/ {
        # Aplicar limitación
        # burst=20 - Capacidad del cubo, permite 20 solicitudes en ráfaga
        # nodelay - Sin retraso en ráfagas (procesar o rechazar inmediatamente)
        limit_req zone=mylimit burst=20 nodelay;

        # Limitar conexiones por IP
        limit_conn addr 10;

        proxy_pass http://user-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Servicio de pedidos - Limitación más estricta
    location /api/orders/ {
        # Limitación más estricta: 5 solicitudes por segundo
        limit_req_zone $binary_remote_addr zone=order_limit:10m rate=5r/s;
        limit_req zone=order_limit burst=10 nodelay;

        proxy_pass http://order-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Manejo tras limitación
    # Cuando se rechaza una solicitud, devolver 429 Too Many Requests
    error_page 429 /429.html;
    location = /429.html {
        internal;
        return 429 '{"error": "Too Many Requests", "message": "Rate limit exceeded. Please try again later."}';
        add_header Content-Type application/json;
    }
}
```

::: tip 💡 Recomendaciones de estrategia de limitación

- **APIs normales**: 10 solicitudes/segundo, permitir ráfagas de 20
- **APIs críticas** (pagos, pedidos): 5 solicitudes/segundo, permitir ráfagas de 10
- **Protección global**: Total de solicitudes no superior a 100 por segundo
  :::

<RateLimitingDemo />

### 7.3 Circuit Breaker: Prevenir la propagación de fallos

**Cómo funciona el Circuit Breaker:**

1. **Estado cerrado**: Reenvía solicitudes normalmente, registrando la tasa de errores
2. **Estado abierto**: Cuando la tasa de errores supera el umbral, el circuito se abre, devuelve error directamente sin reenviar
3. **Estado semiabierto**: Tras un tiempo, permite unas pocas solicitudes de prueba; si tienen éxito, cierra el circuito

::: tip 💡 Idea central
**El Circuit Breaker es como un fusible eléctrico**: Cuando la corriente es excesiva, el fusible se funde automáticamente, protegiendo todo el circuito.

De forma similar, cuando un servicio backend tiene muchos errores, el Circuit Breaker "salta", fallando rápido y evitando que el fallo se propague a todo el sistema.
:::

---

## 8. Resumen: Pensamiento central del diseño de gateways

### 8.1 Repaso de principios fundamentales

| Principio              | Significado                                | Puntos prácticos                                  |
| ---------------------- | ------------------------------------------ | ------------------------------------------------- |
| **Enrutamiento**       | Enviar la solicitud al lugar correcto      | Path-based, Host-based, Header-based routing      |
| **Balanceo de carga**  | Distribuir tráfico entre múltiples servidores | Round-robin, ponderado, least connections, IP hash |
| **Seguridad**          | Proteger la puerta del sistema             | Autenticación, HTTPS, WAF                          |
| **Limitación de tasa** | Evitar colapso por tráfico                 | Token Bucket, Leaky Bucket, Sliding Window         |
| **Circuit Breaker**    | Prevenir propagación de fallos             | Fallo rápido, plan de degradación                  |
| **Observabilidad**     | Monitoreo y diagnóstico                    | Logs, métricas, trazabilidad distribuida           |

### 8.2 Recomendaciones de selección tecnológica

::: tip 💡 Árbol de decisión

```
Elegir gateway:
│
├─ ¿Solo necesitas proxy inverso y balanceo de carga?
│  ├─ Sí → Nginx (primera opción)
│  └─ No → Continuar
│
├─ ¿Necesitas un ecosistema rico de plugins?
│  ├─ Sí → Kong (basado en Nginx)
│  └─ No → Continuar
│
├─ ¿Usas el ecosistema Spring Cloud?
│  ├─ Sí → Spring Cloud Gateway
│  └─ No → Nginx
```

:::

---

## 9. Glosario rápido

| Término                   | Inglés                   | Explicación                                                                                                                                        |
| ------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Proxy Inverso**         | Reverse Proxy            | Servicio proxy desplegado en el lado del servidor que recibe solicitudes de clientes y las reenvía a servicios internos. El cliente solo conoce el proxy inverso, no la dirección real del servidor. |
| **Proxy Directo**         | Forward Proxy            | Servicio proxy desplegado en el lado del cliente que accede a recursos externos en su nombre. El servidor ve la IP del proxy, no la del cliente real. Aplicaciones típicas: VPN, herramientas para saltar restricciones. |
| **API Gateway**           | API Gateway              | Capa intermedia entre el cliente y los servicios backend que proporciona enrutamiento, autenticación, limitación de tasa, logs, etc. Es la "puerta unificada" de la arquitectura de microservicios. |
| **Balanceo de carga**     | Load Balancing           | Distribuye las solicitudes entre múltiples servidores para evitar la sobrecarga de un solo servidor, mejorando la disponibilidad y el rendimiento del sistema. |
| **Terminación SSL**       | SSL Termination          | Maneja el cifrado/descifrado HTTPS en la capa del gateway; los servicios backend usan HTTP, reduciendo la sobrecarga de cómputo y simplificando la gestión de certificados. |
| **Limitación de tasa**    | Rate Limiting            | Limita el número de solicitudes por unidad de tiempo para evitar que el sistema colapse por tráfico repentino. Algoritmos comunes: Token Bucket, Leaky Bucket, Sliding Window. |
| **Circuit Breaker**       | Circuit Breaking         | Cuando un servicio dependiente falla, corta automáticamente las llamadas para evitar la propagación del fallo y proporciona un plan de degradación. |
| **Persistencia de sesión**| Session Persistence      | Asegura que las solicitudes del mismo cliente siempre se enruten al mismo servidor backend, necesario para escenarios que requieren mantener estado de sesión. |
| **Health Check**          | Health Check             | Verifica periódicamente el estado de salud de los servicios backend, eliminando automáticamente los nodos fallidos para garantizar que el tráfico solo llegue a instancias sanas. |
| **Canary Release**        | Canary Release           | Dirige una pequeña porción de tráfico a la nueva versión; tras validar la estabilidad, se aumenta gradualmente el porcentaje, reduciendo el riesgo de despliegue. |
| **WAF**                   | Web Application Firewall | Firewall de aplicaciones web que protege contra inyección SQL, XSS, ataques CC y otras amenazas de seguridad web. |
| **CDN**                   | Content Delivery Network | Red de distribución de contenido que despliega nodos edge globalmente para acelerar el acceso a recursos estáticos. |