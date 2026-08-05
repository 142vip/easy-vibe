# Introducción a la evolución de monolito a microservicios

::: tip Prefacio
**Ninguna arquitectura es "la mejor", solo "la más adecuada para la etapa actual".** La transición de monolito a microservicios no es un salto que se hace de una vez, sino un proceso gradual a medida que crecen la escala del negocio y la del equipo. Dividir en microservicios demasiado pronto es tan peligroso como hacerlo demasiado tarde.
:::

**¿Qué aprenderás en este artículo?**

Después de completar este capítulo, podrás:

- **Ruta de evolución**: Comprender las cuatro etapas de monolito a microservicios
- **Momento adecuado para dividir**: Saber cuándo conviene dividir y cuándo no
- **Estrategias de división**: Dominar la metodología de división por dominios de negocio
- **Patrones de comunicación**: Conocer las opciones de comunicación sincrónica y asincrónica entre servicios
- **División de datos**: Entender los desafíos y las soluciones de la división de bases de datos

| Capítulo | Contenido | Concepto clave |
|-----|------|---------|
| **Cap. 1** | Ruta de evolución arquitectónica | Monolito → Monolito modular → SOA → Microservicios |
| **Cap. 2** | Momento y principios de la división | Ley de Conway, autonomía del equipo |
| **Cap. 3** | Estrategias de división | Contextos delimitados de DDD, patrón Strangler Fig |
| **Cap. 4** | Comunicación entre servicios | REST, gRPC, colas de mensajes |
| **Cap. 5** | División de datos | División de bases de datos, sincronización de datos |

---

## 1. Ruta de evolución arquitectónica

La evolución arquitectónica no está impulsada por la tecnología, sino por **la escala organizacional**. Cuando un equipo crece de 5 a 500 personas, la eficiencia de colaboración en una arquitectura monolítica disminuye drásticamente.

| Etapa | Arquitectura | Tamaño del equipo | Características |
|------|------|---------|------|
| Inicio | Aplicación monolítica | 1~10 personas | Todo el código en un proyecto, despliegue simple |
| Crecimiento | Monolito modular | 10~50 personas | Código organizado por módulos, pero se despliega junto |
| Expansión | SOA (Arquitectura orientada a servicios) | 50~200 personas | División en servicios de grano grueso por línea de negocio |
| Escala | Microservicios | 200+ personas | Servicios de grano fino, cada equipo desarrolla y despliega de forma independiente |

<ArchEvolutionDemo />

::: tip Ley de Conway
"Las organizaciones que diseñan sistemas producen arquitecturas que reflejan sus estructuras de comunicación." — Melvin Conway

En pocas palabras: si 3 equipos construyen un sistema, al final habrá 3 servicios. La esencia de la división arquitectónica es la **división organizacional**.

**Ley inversa de Conway**: Dado que la estructura organizacional determina la arquitectura del sistema, si quieres una arquitectura específica, primero ajusta la estructura organizacional en consecuencia. Por ejemplo, si quieres un servicio de pagos independiente, primero forma un equipo de pagos independiente. Muchas empresas fracasan en su división en microservicios no por problemas técnicos, sino porque la organización no se adaptó.
:::

---

## 2. Criterios de conviene dividir en microservicios

No todos los sistemas necesitan microservicios. Dividir demasiado pronto introduce complejidad innecesaria.

| Señal | Descripción | Recomendación |
|------|------|------|
| Conflictos de despliegue frecuentes | Múltiples equipos modifican el mismo repositorio de código con conflictos constantes | Considerar división |
| Un módulo necesita escalado independiente | El módulo de búsqueda necesita 10 veces más recursos que los demás | Considerar división |
| Necesidad de diferenciación del stack tecnológico | El módulo de IA usa Python, el sitio principal usa Java | Considerar división |
| Equipo < 10 personas | El costo de comunicación es bajo, un monolito es suficiente | No dividir |
| El negocio aún está en fase de exploración | Los requisitos cambian rápido, los límites no están claros | No dividir |
| No hay capacidad de DevOps | No hay CI/CD, contenedores ni sistema de monitoreo | No dividir |

---

## 3. Estrategias de división

### 3.1 División por dominio de negocio (Contextos delimitados de DDD)

Los contextos delimitados (Bounded Context) del DDD (Diseño Dirigido por el Dominio) son el mejor principio rector para dividir microservicios. Cada contexto delimitado corresponde a un dominio de negocio independiente, con su propio modelo de datos y reglas de negocio.

**¿Qué es un contexto delimitado?** La misma palabra tiene significados diferentes en distintos dominios de negocio. Por ejemplo, "usuario" en el dominio de usuarios se refiere a la información de registro (nombre, email); en el dominio de pedidos se refiere al comprador (dirección de envío, método de pago); en el dominio de recomendaciones se refiere al perfil de comportamiento (historial de navegación, etiquetas de preferencia). Un contexto delimitado traza un límite dentro del cual la terminología y los modelos tienen un significado claro y unificado.

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Dominio de  │  │  Dominio de  │  │  Dominio de  │
│   usuarios   │  │   pedidos    │  │    pagos     │
│             │  │             │  │             │
│ User        │  │ Order       │  │ Payment     │
│ Profile     │  │ OrderItem   │  │ Refund      │
│ Address     │  │ Cart        │  │ Transaction │
│             │  │             │  │             │
│ Servicio de │  │ Servicio de  │  │ Servicio de │
│  usuarios   │  │   pedidos    │  │    pagos    │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       └──── API calls / comunicación por eventos ────┘
```

| Contexto delimitado | Entidades principales | Servicio correspondiente |
|-----------|---------|---------|
| Dominio de usuarios | User, Profile, Address | Servicio de usuarios |
| Dominio de productos | Product, Category, SKU | Servicio de productos |
| Dominio de pedidos | Order, OrderItem | Servicio de pedidos |
| Dominio de pagos | Payment, Refund | Servicio de pagos |
| Dominio de logística | Shipment, Tracking | Servicio de logística |

### 3.2 Patrón Strangler Fig

No reescribas todo el monolito de una vez; en su lugar, como una higuera estranguladora, reemplaza gradualmente los módulos antiguos con servicios nuevos:

1. Crear un servicio nuevo fuera del monolito
2. A través de una capa de proxy, dirigir parte del tráfico al servicio nuevo
3. Una vez verificado que el servicio nuevo es estable, migrar gradualmente más tráfico
4. Finalmente reemplazar por completo el módulo antiguo

---

## 4. Patrones de comunicación entre servicios

| Método | Protocolo | Características | Escenarios aplicables |
|------|------|------|---------|
| REST | HTTP/JSON | Simple y universal, buen ecosistema | APIs externas, operaciones CRUD |
| gRPC | HTTP/2 + Protobuf | Alto rendimiento, tipado fuerte | Llamadas de alta frecuencia entre servicios internos |
| Cola de mensajes | AMQP/Kafka | Desacoplamiento asíncrono, recorte de picos | Notificaciones de eventos, tareas asíncronas |
| GraphQL | HTTP/JSON | El cliente consulta solo lo que necesita | Capa BFF, aplicaciones móviles |

::: tip Elección entre sincrónico y asíncrono
- **Se necesita el resultado inmediatamente** → Sincrónico (REST/gRPC)
- **No se necesita el resultado inmediatamente** → Asíncrono (cola de mensajes)
- **Un evento dispara múltiples acciones** → Asíncrono (publicar-suscribir)

Regla práctica: usa asíncrono siempre que sea posible. Cuanto más larga sea la cadena de llamadas sincrónicas, más frágil será el sistema.
:::

---

## 5. División de datos: la parte más difícil

Lo más doloroso de la división en microservicios no es la división del código, sino la división de la base de datos. Cada servicio debería tener su propia base de datos, pero esto significa que las consultas entre servicios se vuelven difíciles.

| Desafío | Descripción | Solución |
|------|------|---------|
| JOIN entre servicios | No se puede hacer JOIN directamente entre tablas de dos servicios | Consultas compuestas via API, redundancia de datos |
| Transacciones distribuidas | Las transacciones entre bases de datos no se pueden resolver con transacciones locales | Saga, tabla de mensajes local |
| Consistencia de datos | Los datos de múltiples servicios pueden estar temporalmente inconsistentes | Consistencia eventual, diseño basado en eventos |
| Migración de datos | Desde una base de datos compartida a bases de datos independientes | Transición con doble escritura, herramientas de sincronización |

---

## Resumen

La transición de monolito a microservicios es un proceso gradual, no una revolución de la noche a la mañana.

Repaso de los puntos clave de este capítulo:

1. **Ruta de evolución**: Monolito → Monolito modular → SOA → Microservicios; cada paso tiene un impulsor claro
2. **Momento de la división**: El tamaño del equipo, los conflictos de despliegue y las necesidades de escalado son señales para dividir
3. **Estrategias de división**: Usar contextos delimitados de DDD para guiar la división y el patrón Strangler Fig para la migración gradual
4. **Elección de comunicación**: Usar asíncrono siempre que sea posible; la cadena de llamadas sincrónicas debe ser lo más corta posible
5. **División de datos**: Lo más difícil pero lo más importante; aceptar la consistencia eventual es el cambio de mentalidad clave

## Lecturas complementarias

- [Building Microservices](https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/) - El clásico de microservicios de Sam Newman
- [Monolith to Microservices](https://www.oreilly.com/library/view/monolith-to-microservices/9781492047834/) - Guía de migración gradual
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/) - El clásico de DDD de Eric Evans
- [The Strangler Fig Pattern](https://martinfowler.com/bliki/StranglerFigApplication.html) - Patrón Strangler Fig de Martin Fowler
