# Principios de la infraestructura como código

::: tip Prefacio
**¿Alguna vez has vivido esta pesadilla: el servidor de producción se cae y nadie recuerda cómo se configuró originalmente?** Iniciar sesión manualmente en el servidor, escribir comandos de memoria, rezar para no equivocarse — este es el día a día de las operaciones tradicionales. La Infraestructura como Código (Infrastructure as Code, IaC) ha cambiado todo esto radicalmente: usar código para definir y gestionar la infraestructura, haciendo que la configuración de servidores sea controlable por versiones, reproducible y auditable, igual que el software.
:::

**¿Qué aprenderás en este artículo?**

Después de completar este capítulo, obtendrás:

- **Conceptos centrales**: entender qué es IaC y por qué es la piedra angular de las operaciones modernas
- **Conocimiento del flujo de trabajo**: dominar las cuatro fases del flujo de Terraform: Write → Plan → Apply → Destroy
- **Selección de herramientas**: conocer las ventajas y desventajas de herramientas principales como Terraform, Pulumi, CloudFormation
- **Conciencia de riesgos**: entender los peligros de la deriva de configuración y los métodos de detección
- **Mejores prácticas**: dominar los métodos de gestión ingenieril de proyectos IaC

| Capítulo | Contenido | Concepto clave |
|-----|------|---------|
| **Capítulo 1** | Concepto de IaC | Operaciones manuales vs gestión mediante código |
| **Capítulo 2** | Flujo de trabajo de Terraform | Write → Plan → Apply |
| **Capítulo 3** | Comparación de herramientas | Terraform, Pulumi, CDK |
| **Capítulo 4** | Deriva de configuración | Detección, prevención, reparación |
| **Capítulo 5** | Mejores prácticas | Modularización, gestión de estado, CI/CD |

---

## 0. Panorama general: Motivación de infraestructura también necesita "código fuente"

Imagina que eres un chef. Si cocinas cada plato a ojo, hoy una cucharada de sal, mañana dos, el sabor nunca será consistente. Pero si escribes la receta, con la cantidad exacta de cada ingrediente en gramos, cualquiera podrá reproducir el mismo sabor.

La gestión de infraestructura enfrenta el mismo problema. La configuración de un servidor puede involucrar sistema operativo, reglas de red, grupos de seguridad, volúmenes de almacenamiento, variables de entorno y docenas de parámetros más. La configuración manual no solo es propensa a errores, sino que es **irreproducible, inauditable e irreversible**.

::: tip El valor central de IaC
- **Reproducible**: el mismo código, sin importar cuántas veces se ejecute, produce el mismo resultado (idempotencia)
- **Controlable por versiones**: los cambios de infraestructura se gestionan con Git, quién cambió qué y por qué queda claro de un vistazo
- **Auditable**: todos los cambios quedan registrados, cumpliendo con los requisitos de cumplimiento
- **Automatizable**: despliegue automático a través de pipelines de CI/CD, eliminando el riesgo de operaciones manuales
- **Colaborativo**: los miembros del equipo revisan los cambios de infraestructura mediante Pull Requests, igual que revisan código
:::

---

## 1. Concepto de IaC: de "clics manuales" a "declaraciones en código"

El modo de trabajo de las operaciones tradicionales es: iniciar sesión en la consola de la plataforma en la nube, hacer clic manualmente para crear servidores, configurar redes y establecer grupos de seguridad. Este enfoque funciona cuando se gestionan unos pocos servidores, pero cuando la escala crece a decenas o cientos, se convierte en una pesadilla.

La idea central de IaC es: **usar código declarativo para describir el estado deseado de tu infraestructura y dejar que las herramientas lo implementen automáticamente**. No necesitas decirle a la herramienta "primero crea una VPC, luego una subred, luego un grupo de seguridad" (imperativo), solo necesitas decir "quiero un entorno de red así" (declarativo), y la herramienta calculará automáticamente los pasos necesarios.

<IaCConceptDemo />

| Dimensión | Operaciones manuales | Infraestructura como Código |
|------|---------|--------------|
| Modo de operación | Iniciar sesión en la consola y hacer clic | Escribir archivos de código |
| Reproducibilidad | Depende de documentación y memoria | El código es la documentación, 100% reproducible |
| Seguimiento de cambios | Sin registro o registro incompleto | Control de versiones Git, historial completo |
| Modo de colaboración | Comunicación verbal, transferencia de documentos | Revisión mediante Pull Requests |
| Capacidad de rollback | Operación inversa manual | git revert + aplicar de nuevo |
| Consistencia | Grandes diferencias entre entornos | Desarrollo/pruebas/producción completamente idénticos |

::: tip Declarativo vs Imperativo
- **Declarativo (Declarative)**: describe "qué quiero", la herramienta calcula automáticamente "cómo hacerlo". Terraform y CloudFormation usan este enfoque. Ventaja: buena idempotencia. Desventaja: flexibilidad limitada.
- **Imperativo (Imperative)**: describe "cómo hacerlo", ejecutando paso a paso. Ansible y los scripts Shell usan este enfoque. Ventaja: flexibilidad. Desventaja: difícil garantizar idempotencia.
- **Híbrido**: Pulumi y AWS CDK se escriben en lenguajes de programación generales, combinando la gestión de estado declarativa con la flexibilidad imperativa.
:::

---

## 2. Flujo de trabajo de Terraform: Write → Plan → Apply

Terraform es la herramienta IaC más popular actualmente, desarrollada por HashiCorp. Su flujo de trabajo es claro e intuitivo, dividido en cuatro fases, como el proceso de desarrollo de software "codificar → revisar → desplegar → limpiar".

<TerraformWorkflowDemo />

::: tip Flujo de trabajo en cuatro fases
1. **Write (Escribir)**: escribir archivos de definición de infraestructura (.tf) en HCL (HashiCorp Configuration Language). Declarar los recursos que necesitas: servidores, bases de datos, redes, etc.
2. **Plan (Planificar)**: ejecutar `terraform plan`. Terraform compara el estado actual con el estado deseado y genera un "plan de ejecución" que te dice qué recursos pretende crear, modificar o eliminar. Esta es la red de seguridad que te permite confirmar los cambios antes de ejecutarlos realmente.
3. **Apply (Ejecutar)**: una vez confirmado que el plan es correcto, ejecutar `terraform apply`. Terraform crea o modifica los recursos según el plan. Al completarse, el estado actual se guarda en el archivo de estado (terraform.tfstate).
4. **Destroy (Destruir)**: cuando ya no se necesita, ejecutar `terraform destroy` para limpiar todos los recursos y evitar costes innecesarios.
:::

| Comando | Función | ¿Modifica la infraestructura? | Caso de uso |
|------|------|----------------|---------|
| `terraform init` | Inicializar el proyecto, descargar Provider | No | Primera vez o al añadir un nuevo Provider |
| `terraform plan` | Previsualizar cambios, generar plan de ejecución | No | Debe ejecutarse antes de cada cambio |
| `terraform apply` | Ejecutar cambios, crear/modificar recursos | Sí | Ejecutar después de confirmar el plan |
| `terraform destroy` | Destruir todos los recursos | Sí | Limpiar entorno de pruebas, retirar servicios |
| `terraform state` | Ver/gestionar archivo de estado | Depende de la operación | Migración de estado, importación de recursos |

---

## 3. Comparación de herramientas: elegir la herramienta IaC adecuada

El campo de IaC tiene múltiples herramientas, cada una con sus fortalezas. Al elegir una herramienta, hay que considerar la pila tecnológica del equipo, la plataforma en la nube y la escala del proyecto. No existe la "mejor" herramienta, solo la más adecuada para tu escenario.

<IaCToolComparisonDemo />

| Herramienta | Lenguaje | Soporte de nube | Curva de aprendizaje | Caso de uso |
|------|------|-----------|---------|---------|
| Terraform | HCL | Multi-nube (AWS/Azure/GCP) | Media | Entornos multi-nube, colaboración en equipo |
| Pulumi | Python/TS/Go | Multi-nube | Baja (lenguajes de programación familiares) | Amigable para desarrolladores, lógica compleja |
| AWS CloudFormation | JSON/YAML | Solo AWS | Media | Entorno exclusivamente AWS |
| AWS CDK | Python/TS/Java | Solo AWS | Baja | AWS + preferencia por lenguajes de programación |
| Ansible | YAML | Multi-nube + bare metal | Baja | Gestión de configuración, entornos híbridos |

::: tip ¿Cómo elegir?
- **Equipos emergentes / Nube única**: CloudFormation (AWS) o la herramienta nativa de la plataforma en la nube correspondiente, mejor integración con el ecosistema
- **Multi-nube / Equipos medianos/grandes**: Terraform, la comunidad más grande, más Providers disponibles, más fácil de contratar
- **Equipos liderados por desarrolladores**: Pulumi o CDK, escribir infraestructura en lenguajes de programación familiares, buen soporte IDE
- **Necesidad de gestión de configuración**: Ansible, excelente para configuración interna de servidores (instalar software, modificar archivos de configuración)
:::

---

## 4. Deriva de configuración: una bomba de relojería silenciosa

La deriva de configuración (Configuration Drift) es el enemigo más insidioso en la práctica de IaC. Se refiere a **la desviación gradual entre el estado real de la infraestructura y el estado definido en el código**.

¿Cómo se produce esta desviación? Alguien, para "arreglar rápidamente" un problema en producción, inicia sesión directamente en la consola y modifica manualmente las reglas del grupo de seguridad; alguien, para depurar, aumenta temporalmente la configuración de un servidor pero olvida revertirla. Estos "pequeños cambios" se acumulan con el tiempo, provocando una desconexión grave entre el código y el entorno real.

<ConfigDriftDemo />

::: tip Los peligros de la deriva de configuración
1. **Irreproducible**: el entorno descrito en el código no coincide con el entorno real, aparecen problemas al crear nuevos entornos
2. **Fallo de rollback**: se cree que revertir a la versión anterior restaurará todo, pero el entorno real ya ha sido modificado manualmente
3. **Riesgos de seguridad**: puertos abiertos manualmente, permisos relajados pueden ser olvidados, convirtiéndose en puntos de entrada para ataques
4. **Auditoría ineficaz**: las auditorías de cumplimiento se basan en el código, pero el código no refleja el estado real
:::

| Medida preventiva | Descripción |
|---------|------|
| Prohibir cambios manuales | Restringir permisos de operación en la consola mediante políticas IAM |
| Detección periódica de deriva | Ejecutar `terraform plan` periódicamente para verificar diferencias |
| Reparación automática | Detectada la deriva, ejecutar automáticamente apply para restaurar la consistencia |
| Auditoría de cambios | Habilitar CloudTrail y otros logs de auditoría para rastrear el origen de todos los cambios |

---

## 5. Mejores prácticas: hacer que el proyecto IaC evolucione de forma sostenible

El código IaC, al igual que el código de aplicación, necesita buenas prácticas de ingeniería para garantizar su mantenibilidad. A medida que crece la escala de la infraestructura, el código IaC sin metodología se convierte en otra forma de "deuda técnica".

<IaCBestPracticeDemo />

::: tip Las seis mejores prácticas principales
1. **Modularización**: abstraer la infraestructura reutilizable en módulos (como módulo VPC, módulo de base de datos), evitando copiar y pegar. Como escribir funciones: definir una vez, llamar múltiples veces.
2. **Aislamiento de entornos**: desarrollo, pruebas y producción usan archivos de estado y variables independientes, aislados mediante workspaces o estructura de directorios.
3. **Gestión de estado remoto**: almacenar el archivo de estado (tfstate) en un backend remoto (S3 + DynamoDB), soportando colaboración en equipo y bloqueo de estado, evitando conflictos de concurrencia.
4. **Gestión de información sensible**: contraseñas, claves y otra información sensible no debe escribirse en el código; usar Vault, AWS Secrets Manager y otras herramientas.
5. **Integración CI/CD**: integrar `terraform plan` en el proceso de PR, y ejecutar `apply` automáticamente a través del pipeline, eliminando operaciones manuales locales.
6. **Revisión de código**: los cambios de infraestructura necesitan Code Review igual que el código de aplicación, especialmente los cambios que involucran grupos de seguridad y políticas IAM.
:::

---

## Resumen

La Infraestructura como Código es la piedra angular de las operaciones cloud-native modernas. Transforma "operaciones manuales indescriptibles" en "código controlable por versiones", llevando la gestión de infraestructura de ser un "arte" a ser una "ingeniería".

Repaso de los puntos clave de este capítulo:

1. **La esencia de IaC**: declarar en código el estado deseado de la infraestructura, dejar que las herramientas lo implementen automáticamente
2. **Flujo de trabajo de Terraform**: tres pasos Write → Plan → Apply, Plan es la red de seguridad
3. **Selección de herramientas**: multi-nube elige Terraform, nube única elige herramientas nativas, equipos de desarrolladores eligen Pulumi
4. **Deriva de configuración**: el riesgo más insidioso, necesita protección doble mediante procesos y herramientas
5. **Gestión ingenieril**: modularización, aislamiento de entornos, estado remoto, integración CI/CD — todo indispensable

## Lecturas complementarias

- [Tutorial oficial de Terraform](https://developer.hashicorp.com/terraform/tutorials) - Aprende Terraform desde cero
- [Documentación de Pulumi](https://www.pulumi.com/docs/) - Escribe infraestructura con lenguajes de programación
- [AWS CDK Workshop](https://cdkworkshop.com/) - Tutorial práctico de AWS CDK
- [Infrastructure as Code (O'Reilly)](https://www.oreilly.com/library/view/infrastructure-as-code/9781098114664/) - El libro clásico en el campo de IaC
- [Spacelift Blog](https://spacelift.io/blog) - Mejores prácticas de IaC y tendencias de la industria
