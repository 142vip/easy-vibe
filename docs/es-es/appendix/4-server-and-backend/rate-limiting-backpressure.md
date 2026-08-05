# Principios de limitación de tasa y control de contrapresión

::: tip Prólogo
**El Double Eleven a medianoche, cientos de millones de usuarios accediendo simultáneamente -- ¿pueden los servidores soportarlo?** Todo sistema tiene un límite de capacidad de procesamiento. Cuando el volumen de solicitudes supera la capacidad de carga del sistema, sin control, el resultado es que nadie puede usarlo. La limitación de tasa y el backpressure son las dos líneas de defensa que protegen al sistema de ser "aplastado".
:::

**¿Qué aprenderás en este artículo?**

Después de completar este capítulo, habrás adquirido:

- **Necesidad de la limitación de tasa**: comprender por qué es necesario rechazar activamente algunas solicitudes para proteger el sistema
- **Algoritmos de limitación**: dominar los principios y diferencias de los tres algoritmos centrales: cubo de tokens, cubo con fugas y ventana deslizante
- **Mecanismo de backpressure**: comprender las estrategias de procesamiento cuando la velocidad aguas arriba supera a la aguas abajo
- **Limitación multicapa**: conocer la arquitectura de limitación multicapa desde el cliente hasta la pasarela y el servicio
- **Capacidad práctica**: saber qué estrategia de limitación elegir en cada escenario

| Capítulo | Contenido | Concepto central |
|-----|------|---------|
| **Cap. 1** | Por qué se necesita la limitación | Efecto avalancha, protección de servicios |
| **Cap. 2** | Algoritmos de limitación | Cubo de tokens, cubo con fugas, ventana deslizante |
| **Cap. 3** | Control de backpressure | Buffer, estrategia de descarte, escalado elástico |
| **Cap. 4** | Arquitectura de limitación multicapa | Cliente, pasarela, servidor |
| **Cap. 5** | Práctica y selección | Nginx, Redis, Sentinel |

---

## 0. Panorama: Motivación de "rechazar" usuarios

Parece contradictorio -- ¿no deberíamos servir bien a cada usuario? Pero la realidad es: **si no se rechazan algunas solicitudes, todas las solicitudes fallarán**.

Imagina un restaurante para 100 personas donde de repente entran 1000. Sin limitación, el resultado no es que las 1000 personas puedan comer, sino que la cocina colapsa y los camareros se paralizan, nadie puede comer. La solución correcta es hacer cola y limitar en la entrada, dejando entrar a 100 personas primero, mientras las demás esperan.

::: tip Objetivo central de la limitación
- **Proteger el sistema**: evitar que la sobrecarga cause la indisponibilidad total del servicio
- **Asignación justa**: garantizar que las solicitudes aceptadas se procesen normalmente
- **Degradación elegante**: las solicitudes limitadas reciben un código de estado 429 claro, en lugar de un timeout o error 500
:::

---

## 1. Algoritmos de limitación: tres soluciones clásicas

El problema central de la limitación es: **¿cuántas solicitudes se permiten pasar como máximo en una unidad de tiempo?** Los diferentes algoritmos tienen diferentes compensaciones en precisión, manejo de tráfico burst y complejidad de implementación.

<RateLimitAlgorithmDemo />

| Algoritmo | Principio | Tráfico burst | Precisión | Complejidad |
|------|------|---------|--------|-----------|
| Cubo de tokens | Tasa fija de emisión de tokens, las solicitudes consumen tokens | Permitido (si hay tokens en el cubo) | Alta | Media |
| Cubo con fugas | Las solicitudes se encolan, procesamiento a tasa fija | No permitido (completamente suavizado) | Alta | Media |
| Ventana deslizante | Cuenta solicitudes dentro de la ventana | Parcialmente permitido | Bastante alta | Baja |
| Ventana fija | Cuenta por ventana de tiempo | Puede haber burst en los bordes | Baja | La más baja |

::: tip ¿Qué algoritmo elegir?
- **Limitación de API**: el cubo de tokens es el más usado, permite tráfico burst razonable
- **Modelado de tráfico**: el cubo con fugas es adecuado para escenarios que requieren tasa de salida constante
- **Conteo simple**: la ventana deslizante es fácil de implementar, adecuada para la mayoría de aplicaciones web
:::

---

## 2. Control de backpressure: cuando aguas arriba es más rápido que aguas abajo

La limitación resuelve el problema de "demasiadas solicitudes externas", mientras que **backpressure** resuelve el problema de "velocidad inadecuada entre componentes internos".

Cuando el productor genera datos más rápido de lo que el consumidor puede procesarlos, el buffer intermedio se expande continuamente, eventualmente causando desbordamiento de memoria o pérdida de datos. El mecanismo de backpressure permite al consumidor "notificar en reversa" al productor para que reduzca la velocidad.

<BackpressureDemo />

::: tip Cuatro estrategias de backpressure
1. **Descartar (Drop)**: cuando el buffer está lleno, descartar datos nuevos o antiguos, adecuado para escenarios de alta demanda de tiempo real pero que toleran pérdida
2. **Bloquear (Block)**: pausar el productor, esperar a que el consumidor termine antes de continuar, adecuado para escenarios donde los datos no pueden perderse
3. **Muestrear (Sample)**: procesar solo algunos datos, adecuado para flujos de datos de alta frecuencia
4. **Escalado elástico (Scale)**: aumentar dinámicamente el número de consumidores, adecuado para entornos cloud-native
:::

---

## 3. Arquitectura de limitación multicapa

En entornos de producción, la limitación no es suficiente en un solo punto, sino que se necesita **protección multicapa**, donde cada capa resuelve problemas de diferente granularidad.

| Capa | Ubicación | Granularidad | Herramienta |
|------|------|---------|------|
| Cliente | Frontend/App | Anti-rebote de botones, throttle de solicitudes | lodash.throttle, debounce |
| CDN/WAF | Nodo edge | Nivel de IP, nivel geográfico | Cloudflare Rate Limiting |
| API Gateway | Pasarela de entrada | Nivel de ruta, nivel de usuario | Nginx limit_req, Kong |
| Servidor | Dentro de la aplicación | Nivel de endpoint, nivel de recurso | Sentinel, Resilience4j |
| Base de datos | Capa de almacenamiento | Conexiones, QPS | Configuración de pool de conexiones, fusión de consultas lentas |

::: tip Especificación HTTP para limitación
Las solicitudes limitadas deben devolver el código de estado `429 Too Many Requests`, e incluir en los headers de respuesta:
- `Retry-After`: cuánto tiempo esperar antes de reintentar (segundos o fecha)
- `X-RateLimit-Limit`: límite de tasa
- `X-RateLimit-Remaining`: cuota restante
- `X-RateLimit-Reset`: hora de restablecimiento de cuota
:::

---

## 4. Selección práctica

| Escenario | Solución recomendada | Descripción |
|------|---------|------|
| Limitación de entrada Nginx | `limit_req_zone` | Basado en cubo con fugas, configuración simple |
| Limitación distribuida | Redis + script Lua | Cubo de tokens o ventana deslizante, conteo compartido entre instancias |
| Microservicios Java | Sentinel / Resilience4j | Soporta fusión, degradación, limitación de puntos calientes |
| API Node.js | express-rate-limit | Simple de usar, soporta almacenamiento Redis |
| Servicio Go | golang.org/x/time/rate | Implementación de cubo de tokens de la biblioteca estándar |

---

## Resumen

La limitación de tasa y el backpressure son dos líneas de defensa clave para proteger la estabilidad del sistema. La limitación controla la velocidad de entrada del tráfico externo, el backpressure coordina la velocidad de procesamiento de los componentes internos.

Repaso de los puntos clave del capítulo:

1. **Necesidad de la limitación**: si no se rechazan algunas solicitudes, todas fallarán
2. **Tres algoritmos centrales**: cubo de tokens (permite burst), cubo con fugas (completamente suavizado), ventana deslizante (simple y preciso)
3. **Mecanismo de backpressure**: descartar, bloquear, muestrear, escalar -- cuatro estrategias
4. **Protección multicapa**: desde el cliente hasta la base de datos, cada capa resuelve problemas de diferente granularidad
5. **Especificación 429**: devolver código de estado estándar e headers de limitación cuando se limita

## Lecturas adicionales

- [Práctica de limitación de Stripe](https://stripe.com/blog/rate-limiters) - Diseño de limitación en sistemas de pago
- [Documentación de Nginx limit_req](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html) - Módulo de limitación de Nginx
- [Alibaba Sentinel](https://sentinelguard.io/) - Componente de control de tráfico para servicios distribuidos
- [Resilience4j](https://resilience4j.readme.io/) - Biblioteca de tolerancia a fallos ligera para Java
- [Explicación del algoritmo Token Bucket](https://en.wikipedia.org/wiki/Token_bucket) - Principios matemáticos del algoritmo de cubo de tokens
