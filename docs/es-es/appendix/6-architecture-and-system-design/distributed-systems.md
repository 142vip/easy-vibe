# Principios de los sistemas distribuidos

::: tip Prefacio
**Cuando una máquina no es suficiente, los problemas realmente comienzan.** Los sistemas distribuidos son la piedra angular del internet moderno — desde los mensajes de WeChat hasta las compras en Taobao, detrás hay cientos o miles de máquinas trabajando en coordinación. Pero "distribuido" no es un almuerzo gratis; trae consigo una serie de desafíos que los sistemas de una sola máquina nunca han enfrentado.
:::

**¿Qué aprenderás en este artículo?**

Después de completar este capítulo, podrás:

- **Teorema fundamental**: Comprender el teorema CAP y su impacto en el diseño de sistemas
- **Modelos de consistencia**: Distinguir entre consistencia fuerte, consistencia eventual y consistencia causal
- **Ocho grandes desafíos**: Dominar los problemas centrales que enfrentan los sistemas distribuidos
- **Algoritmos de consenso**: Conocer las ideas básicas de Paxos, Raft y otros algoritmos de consenso distribuido
- **Patrones prácticos**: Familiarizarte con soluciones comunes como 2PC, Saga y CRDT

| Capítulo | Contenido | Concepto clave |
|-----|------|---------|
| **Cap. 1** | Por qué se necesita distribución | Escalabilidad, disponibilidad, distribución geográfica |
| **Cap. 2** | Teorema CAP | Consistencia, disponibilidad, tolerancia a particiones |
| **Cap. 3** | Modelos de consistencia | Consistencia fuerte, eventual, causal |
| **Cap. 4** | Ocho grandes desafíos | Red, relojes, particiones, split-brain, etc. |
| **Cap. 5** | Algoritmos de consenso | Paxos, Raft, ZAB |
| **Cap. 6** | Transacciones distribuidas | 2PC, Saga, TCC |

---

## 0. Visión general: Motivación de sistemas distribuidos

Los sistemas de una sola máquina son simples y confiables, pero tienen tres cuellos de botella insuperables:

| Cuello de botella | Descripción | Solución distribuida |
|------|------|-------------|
| Límite de rendimiento | Una sola máquina tiene límites físicos en CPU, memoria y disco | Escalado horizontal: añadir más máquinas para repartir la carga |
| Punto único de fallo | Si una máquina falla, todo el servicio cae | Réplicas redundantes: múltiples máquinas como respaldo mutuo |
| Latencia geográfica | Los usuarios están distribuidos globalmente, una sola máquina solo puede estar en un lugar | Despliegue multi-región: servir a los usuarios desde la ubicación más cercana |

::: tip El costo de la distribución
Los sistemas distribuidos resuelven los problemas anteriores, pero introducen nueva complejidad: redes no confiables, relojes no sincronizados, fallos parciales, consistencia de datos... Estos son los "desafíos" que discutiremos en este artículo.

**Las ocho falacias de la computación distribuida de Peter Deutsch** nos dicen que las siguientes suposiciones son todas incorrectas en entornos distribuidos:
1. La red es confiable
2. La latencia es cero
3. El ancho de banda es infinito
4. La red es segura
5. La topología no cambia
6. Solo hay un administrador
7. El costo de transporte es cero
8. La red es homogénea
:::

---

## 1. Teorema CAP: el "triángulo imposible" de los sistemas distribuidos

En el año 2000, Eric Brewer propuso la conjetura CAP (posteriormente demostrada como teorema): un sistema distribuido puede satisfacer como máximo dos de las siguientes tres propiedades simultáneamente.

| Propiedad | Significado | Explicación intuitiva |
|------|------|---------|
| **C**onsistency (Consistencia) | Todos los nodos ven los mismos datos en el mismo momento | Consultes el saldo en cualquier cajero automático y el resultado será el mismo |
| **A**vailability (Disponibilidad) | Cada solicitud recibe una respuesta sin errores | El sistema siempre puede responder, nunca dirá "servicio no disponible" |
| **P**artition tolerance (Tolerancia a particiones) | El sistema sigue funcionando cuando hay particiones de red | Incluso si se cortan algunos cables, el sistema sigue operativo |

<CAPTheoremDemo />

### Motivación de solo se pueden elegir dos

En un entorno distribuido, las particiones de red (P) son inevitables — los cables de fibra óptica se cortan, los switches fallan, los centros de datos pierden conectividad. Por lo tanto, P es obligatorio, y la elección real es sopesar entre C y A:

- **Elegir CP**: En caso de partición, rechazar solicitudes inciertas, garantizando la corrección de los datos → adecuado para finanzas, inventario
- **Elegir AP**: En caso de partición, seguir sirviendo, pero los datos pueden estar temporalmente inconsistentes → adecuado para redes sociales, contenido

::: tip CAP no es blanco o negro
En la realidad, los sistemas no son simplemente "CP o AP". Muchos sistemas hacen elecciones diferentes según la operación — por ejemplo, en la misma base de datos, las lecturas pueden ser AP (permitir leer datos antiguos) y las escrituras pueden ser CP (requerir confirmación de la mayoría).
:::

---

## 2. Modelos de consistencia: el "nivel de rigor" en la sincronización de datos

La consistencia no es un interruptor (tenerla o no), sino un espectro. Diferentes modelos de consistencia hacen diferentes compromisos entre "corrección" y "rendimiento".

<ConsistencyModelsDemo />

### Comparación de modelos de consistencia

| Modelo | Garantía | Latencia | Escenarios aplicables |
|------|------|------|---------|
| Consistencia fuerte | Lo que se lee siempre es el último valor escrito | Alta (requiere esperar sincronización) | Transferencias bancarias, deducción de inventario |
| Consistencia eventual | Todas las réplicas eventualmente serán consistentes, pero se pueden leer valores antiguos en el intermedio | Baja (la escritura retorna inmediatamente) | Publicaciones sociales, DNS |
| Consistencia causal | Las operaciones con relación causal garantizan el orden | Media | Respuestas a comentarios, edición colaborativa |
| Consistencia lineal | Todas las operaciones parecen ejecutarse secuencialmente en una sola máquina | La más alta | Bloqueos distribuidos, elección de líder |
| Consistencia de sesión | Dentro de la misma sesión, se garantiza leer las propias escrituras | Baja-Media | Datos personales del usuario |

::: tip Consistencia "leer tus propias escrituras"
La necesidad práctica más común es: cuando un usuario modifica sus propios datos, puede ver la actualización inmediatamente (pero otros usuarios pueden verla más tarde). Esto se llama consistencia "Read Your Own Writes" y es una mejora práctica sobre la consistencia eventual.
:::

---

## 3. Ocho grandes desafíos: el "campo de minas" de los sistemas distribuidos

La complejidad de los sistemas distribuidos no proviene de un solo problema, sino de múltiples problemas entrelazados. Estos son los ocho desafíos más centrales.

<DistributedChallengesDemo />

### Relación entre los desafíos

Estos ocho desafíos no están aislados, están interrelacionados:

- **Red no confiable** → causa **particiones de red** → dispara la **disyuntiva CAP**
- **Relojes no sincronizados** → causa **dificultad en el ordenamiento de eventos** → afecta la **consistencia de datos**
- **Fallos parciales** → pueden causar **split-brain** → requieren **algoritmos de consenso** para resolverse
- **Consistencia de datos** → requiere **transacciones distribuidas** → pero las transacciones a su vez se ven afectadas por la **red no confiable**

::: tip No hay balas de plata
En los sistemas distribuidos no hay soluciones "perfectas", solo compromisos "adecuados". Comprender la esencia de estos desafíos permite tomar las decisiones correctas al diseñar un sistema.
:::

---

## 4. Algoritmos de consenso: cómo hacer que múltiples máquinas "se pongan de acuerdo"

Los algoritmos de consenso son el núcleo de los sistemas distribuidos — el problema que resuelven es: ¿cómo pueden múltiples nodos ponerse de acuerdo sobre un valor, incluso cuando algunos nodos fallan o hay latencia de red?

### 4.1 Paxos

Propuesto por Leslie Lamport en 1990, es el primer algoritmo de consenso demostrado formalmente como correcto.

| Rol | Responsabilidad |
|------|------|
| Proposer (Proponente) | Propone una propuesta (valor) |
| Acceptor (Aceptador) | Vota para aceptar o rechazar la propuesta |
| Learner (Aprendiz) | Aprende el valor finalmente seleccionado |

**Proceso en dos fases**:
1. **Fase Prepare**: El Proposer envía un número de propuesta, el Acceptor se compromete a no aceptar propuestas con números menores
2. **Fase Accept**: El Proposer envía el valor concreto, si la mayoría de Acceptors lo aceptan, la propuesta es aprobada

::: tip El problema de Paxos
Paxos es correcto, pero es notoriamente difícil de entender e implementar. El propio Lamport usó una analogía con un parlamento griego en su artículo, lo cual confundió aún más a la gente.
:::

### 4.2 Raft: nacido para la comprensibilidad

En 2014, Diego Ongaro propuso Raft con el objetivo de crear un "Paxos fácil de entender". Descompone el problema de consenso en tres subproblemas:

| Subproblema | Descripción |
|--------|------|
| Elección de Leader | Se elige un Leader en el clúster, todas las escrituras pasan por el Leader |
| Replicación de logs | El Leader replica el log de operaciones a todos los Followers |
| Seguridad | Garantiza que los logs ya confirmados no sean sobrescritos |

**Flujo central de Raft**:
1. Al iniciar el clúster, todos los nodos son Followers
2. Si un Follower no recibe el heartbeat del Leader dentro del timeout, se convierte en Candidate e inicia una elección
3. El Candidate que obtiene la mayoría de votos se convierte en el nuevo Leader
4. El Leader recibe solicitudes del cliente y replica el log a la mayoría de nodos antes de confirmarlo

### 4.3 Comparación de algoritmos de consenso

| Algoritmo | Año de propuesta | Comprensibilidad | Sistemas que lo usan |
|------|---------|---------|---------|
| Paxos | 1990 | Difícil | Google Chubby |
| Raft | 2014 | Fácil | etcd, Consul, TiKV |
| ZAB | 2011 | Media | ZooKeeper |
| EPaxos | 2013 | Difícil | Principalmente investigación académica |

---

## 5. Transacciones distribuidas: "todo o nada" entre nodos

Las transacciones en bases de datos de una sola máquina logran ACID mediante bloqueos locales y logs. Pero cuando una operación de negocio involucra múltiples servicios/bases de datos, ¿cómo se garantiza la atomicidad?

### 5.1 Commit en dos fases (2PC)

El protocolo de transacciones distribuidas más clásico, dividido en dos fases:

| Fase | Acción del coordinador | Acción del participante |
|------|-----------|-----------|
| Prepare | Pregunta a todos los participantes "¿pueden hacer commit?" | Ejecuta la operación pero no hace commit, responde Yes/No |
| Commit | Si todos son Yes, envía Commit | Hace commit formal; si hay algún No, todos hacen rollback |

**Problemas de 2PC**:
- **Bloqueo**: Si el coordinador falla después del Prepare, los participantes se quedan esperando indefinidamente
- **Punto único de fallo**: El coordinador es un punto único; si falla, toda la transacción queda atascada
- **Bajo rendimiento**: Requiere múltiples viajes de red, los bloqueos se mantienen por mucho tiempo

### 5.2 Patrón Saga

Saga divide una transacción grande en múltiples transacciones locales, cada una con su operación compensatoria correspondiente. Si un paso falla, se ejecutan las compensaciones en orden inverso.

**Ejemplo de Saga para un pedido de e-commerce**:

| Paso | Operación directa | Operación compensatoria |
|------|---------|---------|
| T1 | Crear pedido (pendiente de pago) | Cancelar pedido |
| T2 | Deducir inventario | Restaurar inventario |
| T3 | Deducir saldo | Reembolsar saldo |
| T4 | Confirmar pedido (pagado) | — |

Si T3 (deducir saldo) falla: ejecutar C2 (restaurar inventario) → C1 (cancelar pedido).

**Dos formas de orquestación**:
- **Coreografía (Choreography)**: Cada servicio escucha eventos y decide su siguiente paso por sí mismo. Simple pero difícil de rastrear el estado global
- **Orquestación (Orchestration)**: Un coordinador central controla el flujo. Claro pero el coordinador es un punto único

### 5.3 TCC (Try-Confirm-Cancel)

TCC es una implementación a nivel de negocio de 2PC, dividiendo cada operación en tres fases:

| Fase | Descripción | Ejemplo (deducir inventario) |
|------|------|---------------|
| Try | Reservar recursos, sin ejecutar realmente | Congelar 10 unidades de inventario (inventario disponible -10, inventario congelado +10) |
| Confirm | Confirmar la ejecución, consumir los recursos reservados | Inventario congelado -10 (deducción real) |
| Cancel | Cancelar la reserva, liberar recursos | Inventario congelado -10, inventario disponible +10 (restaurar) |

### 5.4 Comparación de los tres esquemas

| Esquema | Consistencia | Rendimiento | Complejidad | Escenarios aplicables |
|------|--------|------|--------|---------|
| 2PC | Consistencia fuerte | Bajo | Media | Transacciones entre bases de datos a nivel de base de datos |
| Saga | Consistencia eventual | Alto | Alta | Flujos de negocio largos (pedidos, logística) |
| TCC | Consistencia eventual | Medio | La más alta | Escenarios financieros de alta confiabilidad |

::: tip Recomendaciones de selección práctica
- Si puedes usar transacciones de una sola base de datos, no uses transacciones distribuidas
- Para la mayoría de escenarios de negocio, Saga + cola de mensajes es suficiente
- TCC es adecuado para escenarios financieros que requieren consistencia extremadamente alta, pero el costo de desarrollo es muy elevado
- 2PC es adecuado para que los middleware de bases de datos (como ShardingSphere) lo manejen automáticamente
:::

---

## Resumen

Los sistemas distribuidos son la infraestructura del internet moderno, pero su complejidad supera con creces a la de los sistemas de una sola máquina. Comprender estos desafíos no es para "resolverlos" (muchos son fundamentales), sino para tomar las decisiones correctas al diseñar sistemas.

Repaso de los puntos clave de este capítulo:

1. **Teorema CAP**: Las particiones de red son inevitables; la elección real es sopesar entre consistencia y disponibilidad
2. **Modelos de consistencia**: Desde consistencia fuerte hasta consistencia eventual es un espectro; elegir según las necesidades del negocio
3. **Ocho grandes desafíos**: Red no confiable, relojes no sincronizados, particiones de red, split-brain, etc., están interrelacionados
4. **Algoritmos de consenso**: Raft es actualmente el algoritmo de consenso más práctico; etcd/Consul se basan en él
5. **Transacciones distribuidas**: Saga es adecuada para la mayoría de escenarios, TCC para escenarios financieros, 2PC para el nivel de base de datos

## Lecturas complementarias

- [Designing Data-Intensive Applications](https://dataintensive.net/) - El clásico de sistemas distribuidos de Martin Kleppmann
- [The Raft Consensus Algorithm](https://raft.github.io/) - Demostración visual oficial de Raft
- [CAP Twelve Years Later](https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/) - Revisión de CAP por Brewer
- [Jepsen](https://jepsen.io/) - Framework de prueba de corrección para sistemas distribuidos
- [Patrones de sistemas distribuidos](https://martinfowler.com/articles/patterns-of-distributed-systems/) - Colección de patrones distribuidos de Martin Fowler
