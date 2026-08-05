# Introducción a la resolución de incidentes y respuesta ante emergencias

::: tip Prefacio
**A las tres de la mañana, tu teléfono vibra sin parar: el servicio en producción está caído por completo. ¿Qué haces?** Para cualquier equipo de Internet, los incidentes no son una cuestión de "si van a ocurrir", sino de "cuándo van a ocurrir". Los equipos excelentes no son los que nunca tienen incidentes, sino los que pueden responder rápidamente, recuperarse eficientemente y aprender de la experiencia para no repetir los mismos errores.
:::

**¿Qué aprenderás en este artículo?**

Después de completar este capítulo, obtendrás:

- **Conciencia de clasificación**: dominar los estándares de clasificación de severidad de incidentes P0~P4
- **Proceso de respuesta**: comprender la línea de tiempo completa de respuesta a incidentes, desde la detección hasta la recuperación
- **Colaboración organizativa**: conocer la división de roles y los mecanismos de colaboración en el sistema de mando de incidentes
- **Sistema de alertas**: dominar las estrategias de escalación de alertas para garantizar que los problemas críticos no se pasen por alto
- **Metodología de postmortem**: aprender a usar los "Cinco Por Qués" para descubrir la causa raíz y escribir informes de postmortem valiosos

| Capítulo | Contenido | Concepto clave |
|-----|------|---------|
| **Capítulo 1** | Clasificación de severidad | P0~P4, evaluación del alcance del impacto |
| **Capítulo 2** | Línea de tiempo de respuesta | Detección → Respuesta → Recuperación → Postmortem |
| **Capítulo 3** | Sistema de mando | IC, Oficial de comunicaciones, Líder técnico |
| **Capítulo 4** | Escalación de alertas | Alertas por niveles, escalación progresiva |
| **Capítulo 5** | Postmortem | Los Cinco Por Qués, cultura sin culpabilidad |

---

## 0. Panorama general: los incidentes son los mejores maestros

Netflix tiene una herramienta famosa llamada Chaos Monkey que elimina aleatoriamente servidores en el entorno de producción. Suena loco, pero la lógica detrás es clara: **mejor que los incidentes te encuentren a que provoques incidentes intencionalmente para entrenar la capacidad de respuesta del equipo**.

La respuesta ante emergencias no se basa en la improvisación, sino en un sistema basado en **procesos, roles y herramientas**. Así como los bomberos no se organizan cuando ocurre el incendio: entrenan, practican y mantienen su equipo de forma continua.

::: tip Los cuatro elementos centrales de la respuesta ante emergencias
- **Detección rápida**: un sistema completo de monitoreo y alertas que garantice que los problemas se detecten antes de que los usuarios los perciban
- **Colaboración eficiente**: una clara división de roles y mecanismos de comunicación para evitar trabajo duplicado en medio del caos
- **Recuperación rápida**: priorizar la restauración del servicio sobre la búsqueda de la causa raíz. Primero detener el sangrado, luego curar la herida
- **Mejora continua**: cada incidente es una oportunidad de aprendizaje; mejorar constantemente los sistemas y procesos mediante postmortems
:::

---

## 1. Clasificación de severidad: no todos los incidentes requieren "movilizar a todos"

Un botón con color incorrecto y un sistema de pagos completamente paralizado claramente no son del mismo nivel. La **clasificación de incidentes** tiene como objetivo que el equipo responda con la intensidad adecuada a cada nivel de problema, sin sobrereaccionar y desperdiciar recursos, ni subestimar el problema y amplificar las pérdidas.

<SeverityLevelDemo />

| Nivel | Nombre | Alcance del impacto | Requisito de respuesta | Ejemplo |
|------|------|---------|---------|------|
| P0 | Fatal | Negocio central completamente no disponible | Respuesta inmediata, todo el personal en standby | Sistema de pagos caído, fuga de datos |
| P1 | Grave | Funcionalidad central gravemente afectada | Respuesta en 15 minutos | Tasa de fallo de login > 50%, timeouts generalizados de API |
| P2 | Importante | Funcionalidad parcial anormal | Respuesta en 1 hora | Resultados de búsqueda incorrectos, errores 500 en algunas páginas |
| P3 | Normal | Funcionalidad no central anormal | Tratar durante horario laboral | Fallo en carga de avatares, retraso en notificaciones no críticas |
| P4 | Menor | Problema de experiencia | Programar en el sprint | Desalineación de UI, error en texto |

::: tip Principios clave de la clasificación
- **Número de usuarios afectados**: un P2 que afecta al 100% de los usuarios puede ser más urgente que un P1 que afecta al 1%
- **Pérdida de negocio**: los problemas que afectan directamente a los ingresos (pagos, pedidos) tienen mayor prioridad
- **Degradación posible**: si existe una solución temporal que mitigue el impacto, la severidad puede reducirse
- **Ajuste dinámico**: a medida que avanza la investigación, el nivel puede subir o bajar
:::

---

## 2. Línea de tiempo de respuesta: el proceso completo desde la detección hasta el postmortem

La respuesta a un incidente es como una carrera de relevos, donde cada etapa tiene objetivos y puntos de entrega claros. Una línea de tiempo clara permite al equipo mantener el orden en medio del caos.

<IncidentTimelineDemo />

::: tip Las cinco etapas de la respuesta a incidentes
1. **Detección (Detection)**: descubrir anomalías a través de alertas de monitoreo, retroalimentación de usuarios o inspecciones internas. Objetivo: detectar lo antes posible, reducir MTTD (tiempo medio de detección).
2. **Respuesta (Response)**: confirmar el incidente, evaluar la severidad, reunir al equipo de respuesta y establecer canales de comunicación. Objetivo: organizar rápidamente una fuerza de respuesta efectiva.
3. **Mitigación (Mitigation)**: tomar medidas temporales para restaurar el servicio, como revertir el despliegue, cambiar a nodos de respaldo, limitar tráfico o degradar funcionalidad. Objetivo: detener el sangrado primero, restaurar la experiencia del usuario.
4. **Resolución (Resolution)**: encontrar la causa raíz y corregirla permanentemente. Objetivo: eliminar el problema subyacente, prevenir recurrencias.
5. **Postmortem (Postmortem)**: revisar todo el proceso, analizar la causa raíz y definir medidas de mejora. Objetivo: aprender del incidente, hacer que el sistema sea más robusto.
:::

| Métrica | Significado | Dirección de optimización |
|------|------|---------|
| MTTD | Tiempo medio de detección | Mejorar cobertura de monitoreo, reducir umbrales de alertas |
| MTTR | Tiempo medio de recuperación | Automatizar recuperación, practicar planes de contingencia |
| MTBF | Tiempo medio entre fallos | Mejorar fiabilidad del sistema, eliminar puntos únicos de fallo |

---

## 3. Sistema de mando: quién dirige esta "incidente"

En incidentes grandes, lo que más se teme no son los problemas técnicos, sino el **caos**: más de una docena de personas investigando simultáneamente, sin que nadie sepa qué están haciendo los demás, con información crítica fragmentada en varios grupos de chat. El Sistema de Mando de Incidentes (Incident Command System) existe para resolver este problema.

<IncidentCommandDemo />

::: tip Los tres roles centrales
1. **Comandante de Incidentes (Incident Commander, IC)**: el responsable general de toda la respuesta al incidente. Toma decisiones, coordina recursos y controla el ritmo. El IC no tiene que ser la persona más fuerte técnicamente, pero debe ser la más calmada y con mayor visión global.
2. **Oficial de Comunicaciones (Communication Lead)**: responsable de la comunicación externa: actualizar la página de estado, notificar a los clientes, informar a la dirección. Permite que el IC y el equipo técnico se concentren en resolver el problema sin interrupciones por tareas de comunicación.
3. **Líder Técnico (Tech Lead)**: responsable de la investigación y reparación a nivel técnico. Organiza al personal técnico en tareas coordinadas, e informa al IC sobre el progreso y las soluciones.
:::

---

## 4. Escalación de alertas: garantizar que los problemas críticos no se pasen por alto

El sistema de alertas es los "ojos" de la respuesta ante incidentes. Pero muy pocas alertas provocan falsos negativos, y demasiadas causan "fatiga de alertas": cuando se reciben cientos de alertas al día, la realmente importante se pierde fácilmente. La **estrategia de escalación de alertas** es la clave para resolver este problema.

<AlertEscalationDemo />

::: tip El mecanismo de tres niveles de escalación de alertas
1. **Respuesta de primer nivel (L1)**: cuando se activa una alerta, primero se notifica al ingeniero de guardia. Si no se confirma en 15 minutos, se escala automáticamente.
2. **Escalación de segundo nivel (L2)**: se notifica al líder del equipo y a los expertos en el área relevante. Si no se mitiga en 30 minutos, se continúa escalando.
3. **Escalación de tercer nivel (L3)**: se notifica al director técnico y a la dirección, se activa la respuesta de emergencia completa.
:::

| Nivel de alerta | Método de notificación | Plazo de respuesta | Condición de escalación |
|---------|---------|---------|---------|
| Warning | Mensaje IM | Tratar durante horario laboral | Persiste 30 minutos sin recuperación |
| Critical | Teléfono + IM | Confirmación en 15 minutos | No confirmada o no mitigada |
| Fatal | Llamada masiva + SMS | Respuesta en 5 minutos | Escalación automática a la dirección |

---

## 5. Postmortem: aprender de los incidentes

Después de la recuperación, el paso más importante es el **postmortem**. El postmortem no es para culpar a nadie, sino para encontrar oportunidades de mejora sistémica. Google, Meta y otras empresas practican la cultura del "postmortem sin culpabilidad", enfocándose en "por qué el sistema permitió que ocurriera este error" y no en "quién cometió este error".

<PostmortemDemo />

::: tip Método de análisis de los "Cinco Por Qués"
Partiendo del síntoma superficial, preguntar "por qué" sucesivamente hasta encontrar la causa raíz:
1. **¿Por qué se cayó el servicio?** → Se agotó el pool de conexiones a la base de datos
2. **¿Por qué se agotó el pool?** → Consultas lentas retenían conexiones sin liberarlas
3. **¿Por qué había consultas lentas?** → Faltaban índices, se realizaba escaneo completo de tabla
4. **¿Por qué faltaban índices?** → No hubo revisión de DBA cuando se desplegó la nueva tabla
5. **¿Por qué no hubo revisión?** → No existe un proceso obligatorio de revisión de SQL

La causa raíz no es "alguien olvidó añadir un índice", sino "falta un proceso de revisión de SQL". Solo reparando la causa raíz se puede prevenir la recurrencia.
:::

---

## Resumen

La resolución de incidentes y la respuesta ante emergencias son capacidades esenciales para todo equipo técnico. No dependen del heroísmo individual, sino de procesos sistematizados, una clara división de roles y una mejora continua mediante postmortems.

Repaso de los puntos clave de este capítulo:

1. **Respuesta clasificada**: la clasificación P0~P4 garantiza la intensidad de respuesta adecuada para cada nivel de problema
2. **Línea de tiempo clara**: Detección → Respuesta → Mitigación → Resolución → Postmortem, cada etapa tiene objetivos claros
3. **Sistema de mando**: IC + Oficial de comunicaciones + Líder técnico, trabajo coordinado para evitar el caos
4. **Escalación de alertas**: alertas por niveles + escalación automática para garantizar que los problemas críticos no se pasen por alto
5. **Postmortem sin culpabilidad**: usar los "Cinco Por Qués" para descubrir la causa raíz, enfocándose en la mejora del sistema, no en culpar a individuos

## Lecturas complementarias

- [Google SRE Book - Incident Response](https://sre.google/sre-book/managing-incidents/) - Prácticas de gestión de incidentes de Google
- [PagerDuty Incident Response Guide](https://response.pagerduty.com/) - Guía de respuesta ante emergencias de código abierto de PagerDuty
- [Atlassian Incident Management](https://www.atlassian.com/incident-management) - Mejores prácticas de gestión de incidentes de Atlassian
- [Learning from Incidents](https://www.learningfromincidents.io/) - Recursos comunitarios para aprender de incidentes
- [Chaos Engineering (O'Reilly)](https://www.oreilly.com/library/view/chaos-engineering/9781492043850/) - Principios y práctica de la ingeniería del caos
