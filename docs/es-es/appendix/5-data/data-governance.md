# Introducción a la gobernanza de datos

::: tip Prólogo
**¿Alguna vez te has encontrado en esta situación: los números de los informes no coinciden con el negocio real, la información de un mismo usuario es diferente en dos sistemas, o los resultados del análisis no son fiables debido a datos sucios?** La gobernanza de datos es el método sistemático para resolver estos problemas. En la era de las "decisiones basadas en datos", la calidad de los datos determina directamente la calidad de las decisiones: basura entra, basura sale (Garbage In, Garbage Out).
:::

**¿Qué aprenderás en este artículo?**

Después de completar este capítulo, obtendrás:

- **Dimensiones de calidad de datos**: comprender las seis dimensiones de calidad: integridad, exactitud, consistencia, etc.
- **Sistema de gobernanza de datos**: conocer el marco de gobernanza desde la organización, los procesos y la tecnología
- **Linaje de datos**: dominar el seguimiento de extremo a extremo desde el origen hasta el consumo
- **Gestión de metadatos**: comprender la importancia de "los datos que describen los datos"
- **Arquitectura de capas de datos**: dominar el modelo de capas del almacén de datos ODS → DWD → DWS → ADS
- **Capacidad práctica**: saber cómo implementar la gobernanza de datos en proyectos

| Capítulo | Contenido | Conceptos clave |
|----------|-----------|-----------------|
| **Capítulo 1** | Dimensiones de calidad de datos | Integridad, exactitud, consistencia, actualidad |
| **Capítulo 2** | Marco de gobernanza de datos | Organización, procesos, tecnología, cultura |
| **Capítulo 3** | Seguimiento del linaje de datos | Análisis de impacto, resolución de problemas, auditoría de cumplimiento |
| **Capítulo 4** | Gestión de metadatos | Metadatos técnicos, metadatos de negocio, metadatos operativos |
| **Capítulo 5** | Arquitectura de capas de datos | ODS, DWD, DWS, ADS |
| **Capítulo 6** | Herramientas y prácticas de gobernanza | Great Expectations, dbt, DataHub |

---

## 0. Panorama general: Motivación: gobernanza de datos

La gobernanza de datos no es un problema técnico, sino un **problema de gestión**. Responde a la pregunta central: **¿quién es responsable de los datos? ¿Cuáles son los estándares de los datos? ¿Cómo garantizar que los datos sean continuamente fiables?**

Imagina una empresa con 100 tablas de datos, cada una mantenida por equipos distintos, sin convenciones de nomenclatura unificadas, sin diccionario de datos, sin controles de calidad. El resultado: para un mismo indicador como "usuarios activos mensuales", el departamento de marketing calcula 5 millones y el de producto calcula 3 millones — porque las definiciones son diferentes.

::: tip Los cuatro pilares de la gobernanza de datos
1. **Organización**: definir claramente los roles y responsabilidades del Data Owner y del Data Steward
2. **Procesos**: establecer procesos estándar para la incorporación, modificación y retirada de datos
3. **Tecnología**: desplegar herramientas de monitorización de calidad, gestión de metadatos y seguimiento de linaje
4. **Cultura**: lograr que toda la empresa reconozca que "los datos son un activo", no "un subproducto"
:::

---

## 1. Las seis dimensiones de la calidad de los datos

La calidad de los datos no es un concepto difuso, sino que puede medirse desde seis dimensiones concretas. Cada dimensión tiene una definición clara y métodos de detección.

<DataQualityDemo />

| Dimensión | Definición | Método de detección | Problemas comunes |
|-----------|------------|---------------------|-------------------|
| Integridad | ¿Faltan datos? | Verificación de tasa de valores nulos | Campos obligatorios vacíos, datos asociados faltantes |
| Exactitud | ¿Son correctos los datos? | Validación por reglas, verificación por muestreo | Importes negativos, fechas no válidas |
| Consistencia | ¿Los datos de múltiples fuentes coinciden? | Comparación entre sistemas | Nombre de usuario diferente en CRM y sistema de pedidos |
| Actualidad | ¿Están los datos actualizados? | Verificación de fecha de actualización | Datos de inventario rezagados, precios no sincronizados |
| Unicidad | ¿Existen registros duplicados? | Verificación de duplicados | Un mismo usuario registrado dos veces |
| Validez | ¿Cumplen con las reglas de formato? | Validación por expresiones regulares/rangos | Formato de correo electrónico incorrecto, edad negativa |

::: tip La regla 1-10-100 de la calidad de datos
- **1 euro**: validar en el punto de entrada, prevenir la entrada de datos sucios
- **10 euros**: limpiar los datos sucios existentes en el almacén de datos
- **100 euros**: pérdidas por decisiones erróneas causadas por datos sucios

Cuanto antes se detecten y corrijan los problemas de calidad, menor será el coste.
:::

---

## 2. Marco de gobernanza de datos: Gestión de ciclo de vida completo

La gobernanza de datos no es un proyecto puntual, sino un proceso continuo que abarca todo el ciclo de vida de los datos. Desde la generación hasta la destrucción, cada etapa necesita normas claras y responsables.

<DataGovernanceFrameworkDemo />

| Etapa | Producto principal | Rol clave |
|-------|--------------------|-----------|
| Definición de estándares | Diccionario de datos, convenciones de nomenclatura, estándares de clasificación | Arquitecto de datos |
| Incorporación de datos | Normas de integración, reglas de validación, registro de linaje | Ingeniero de datos |
| Almacenamiento y gestión | Modelo de capas, matriz de permisos, políticas de ciclo de vida | DBA / Ingeniero de plataforma |
| Uso y consumo | Catálogo de datos, reglas de anonimización, informes de calidad | Analista de datos / Unidad de negocio |
| Archivo y destrucción | Políticas de archivo, registros de eliminación, logs de auditoría | Equipo de seguridad y cumplimiento |

## 2. Marco de gobernanza de datos

La gobernanza de datos no se resuelve comprando una herramienta; necesita un marco completo que la sustente. El marco de referencia más utilizado en la industria es DAMA-DMBOK (Data Management Body of Knowledge).

| Área de gobernanza | Contenido principal | Producto clave |
|--------------------|---------------------|----------------|
| Arquitectura de datos | Definir modelos de datos, flujos de datos y estrategia de almacenamiento | Diagrama de arquitectura de datos, diagrama ER |
| Estándares de datos | Convenciones de nomenclatura unificadas, codificación, definición de indicadores | Diccionario de datos, biblioteca de indicadores |
| Calidad de datos | Establecer reglas de calidad, alertas de monitorización y procesos de reparación | Informes de calidad, panel SLA |
| Seguridad de datos | Clasificación por niveles, control de acceso, anonimización y cifrado | Políticas de seguridad, logs de auditoría |
| Gestión de datos maestros | Unificar el "registro dorado" de entidades centrales como clientes y productos | Centro de datos maestros |
| Ciclo de vida de datos | Gestionar todo el proceso desde la creación hasta el archivo y la destrucción | Políticas de retención, reglas de archivo |

::: tip Modelo de madurez de la gobernanza de datos
- **Nivel 1 - Inicial**: sin estándares unificados, cada equipo trabaja por su cuenta
- **Nivel 2 - Repetible**: hay documentación de normas básica, pero la aplicación es inconsistente
- **Nivel 3 - Definido**: existen procesos y herramientas de gobernanza unificados, la mayoría de los equipos los cumplen
- **Nivel 4 - Gestionado**: hay indicadores de calidad cuantificables y monitorización automatizada
- **Nivel 5 - Optimizado**: mejora continua, la gobernanza de datos se integra en el flujo de desarrollo diario
:::

---

## 3. Linaje de datos: De dónde vienen y a dónde van

El linaje de datos (Data Lineage) registra la ruta completa de transformación de los datos desde su origen hasta su consumo final. Es como el "árbol genealógico" de los datos, que te permite rastrear el origen y destino de cualquier dato.

<DataLineageDemo />

El linaje de datos tiene tres aplicaciones principales en el trabajo real:

| Escenario | Problema | ¿Cómo ayuda el linaje? |
|-----------|----------|------------------------|
| Análisis de impacto | Si modifico un campo de la tabla de usuarios, ¿qué informes descendentes se verán afectados? | Rastrear todas las dependencias aguas abajo |
| Análisis de causa raíz | El informe de GMV de hoy tiene datos anómalos, ¿en qué paso está el problema? | Retroceder cada环节 aguas arriba |
| Auditoría de cumplimiento | ¿Por qué sistemas ha pasado el número de teléfono del usuario? ¿Se ha anonimizado en todos? | Rastrear el flujo completo de campos sensibles |

::: tip Dos métodos de recopilación de linaje
- **Recopilación activa**: analizar sentencias SQL y configuraciones ETL para extraer automáticamente relaciones de linaje a nivel de tabla y campo
- **Recopilación pasiva**: interceptar los planes de ejecución de motores de consultas (como Hive, Spark) mediante Hooks, registrando el linaje en tiempo real

Herramientas líderes como Apache Atlas, DataHub y OpenLineage soportan la recopilación automatizada de linaje.
:::

---

## 4. Gestión de metadatos: "Los datos que describen los datos"

Los metadatos (Metadata) son datos sobre los datos. Si los datos son el contenido de un libro, los metadatos son su índice, autor, fecha de publicación y número ISBN. Sin metadatos, los datos son simplemente un conjunto de números y cadenas incomprensibles.

| Tipo de metadatos | Descripción | Ejemplo |
|-------------------|-------------|---------|
| Metadatos técnicos | Información de almacenamiento físico de los datos | Nombre de tabla, tipo de campo, método de partición, ubicación de almacenamiento |
| Metadatos de negocio | Significado de negocio de los datos | Nombre en chino del campo, definición de negocio, criterio de cálculo |
| Metadatos operativos | Estado de ejecución de los datos | Tiempo de ejecución ETL, volumen de datos, frecuencia de actualización |

::: tip Importancia del diccionario de datos
El diccionario de datos es el producto más básico de la gestión de metadatos. Un buen diccionario de datos debería incluir:
- **Nombre del campo**: nombre en inglés y nombre en chino
- **Tipo de dato**: VARCHAR(50), INT, DATETIME, etc.
- **Definición de negocio**: ¿Qué representa este campo? ¿Cómo se calcula?
- **Rango de valores**: ¿Cuáles son los valores válidos? ¿Se permiten valores nulos?
- **Responsable**: ¿Quién mantiene este campo? ¿A quién acudir si hay problemas?

Sin diccionario de datos, un recién incorporado puede tardar una semana en entender una tabla; con diccionario de datos, le basta con 10 minutos.
:::

---

## 5. Arquitectura de capas de datos: ODS → DWD → DWS → ADS

Un almacén de datos no consiste en apilar todos los datos juntos, sino en organizarlos en **capas según el grado de procesamiento**. Cada capa tiene responsabilidades claras, las capas superiores dependen de las inferiores y se refina progresivamente desde los datos brutos hasta los datos utilizables por el negocio.

| Capa | Nombre completo | Responsabilidad | Características de los datos |
|------|----------------|-----------------|------------------------------|
| ODS | Capa de datos operacionales | Sincronizar la base de datos de negocio tal cual | Los más brutos, sin procesar |
| DWD | Capa de datos detallados | Limpiar, estandarizar y desduplicar | Registros detallados limpios |
| DWS | Capa de datos resumidos | Agregar por tema (día/semana/mes) | Indicadores agregados precalculados |
| ADS | Capa de datos de aplicación | Orientada a informes/interfaces específicos | Datos de resultados directamente utilizables |

::: tip ¿Por qué dividir en capas?
- **Reutilización**: la capa DWD se limpia una vez y todas las capas superiores la comparten, evitando limpiezas duplicadas
- **Desacoplamiento**: los cambios en la estructura de tablas de la base de datos de negocio solo afectan la capa ODS, sin impactar los informes
- **Rendimiento**: la capa DWS preagrega datos, las consultas de informes leen directamente, sin necesidad de cálculo en tiempo real
- **Trazabilidad**: cada capa se conserva, y en caso de problemas se puede investigar capa por capa
:::

---

## 6. Herramientas y prácticas de gobernanza

| Herramienta | Posicionamiento | Capacidad principal | Escenario de uso |
|-------------|----------------|--------------------|------------------|
| Great Expectations | Calidad de datos | Reglas de validación declarativas, informes de calidad automáticos | Pipelines de datos Python |
| dbt | Transformación de datos | Desarrollo modelado en SQL, pruebas integradas y generación de documentación | Modelado de almacén de datos |
| DataHub | Gestión de metadatos | Catálogo de datos, seguimiento de linaje, descubrimiento de datos | Gobernanza de datos empresarial |
| Apache Atlas | Gestión de metadatos | Seguimiento de linaje del ecosistema Hadoop | Plataformas de Big Data |
| OpenMetadata | Gestión de metadatos | Catálogo de datos de código abierto, soporte para múltiples fuentes | Equipos pequeños y medianos |
| Amundsen | Descubrimiento de datos | Plataforma de descubrimiento de datos basada en búsqueda | Democratización de datos |

::: tip Ruta de gobernanza desde cero
Si tu equipo aún no tiene gobernanza de datos, se recomienda avanzar en este orden:
1. **Crear primero un diccionario de datos**: documentar las tablas existentes y el significado de sus campos (aunque sea en Excel)
2. **Añadir controles de calidad**: incorporar validaciones básicas de nulos y rangos en los pipelines de datos críticos
3. **Unificar las definiciones de indicadores**: estandarizar los criterios de cálculo de indicadores clave como "DAU", "MAU", "GMV"
4. **Introducir herramientas**: cuando el coste de gestión manual sea demasiado alto, incorporar herramientas como DataHub o dbt
5. **Establecer procesos**: los cambios de datos deben pasar por revisión, y los problemas de calidad deben tener SLA y alertas
:::

---

## Resumen

La gobernanza de datos es la ingeniería sistemática que transforma los datos de "utilizables" a "excelentes, fiables y rastreables". No es un proyecto puntual, sino un proceso de operación continua.

Repaso de los puntos clave de este capítulo:

1. **Seis dimensiones de calidad**: integridad, exactitud, consistencia, actualidad, unicidad y validez
2. **Cuatro pilares de la gobernanza**: organización, procesos, tecnología y cultura son indispensables
3. **Linaje de datos**: rastrear el origen y destino de los datos, respaldando el análisis de impacto y la resolución de problemas
4. **Gestión de metadatos**: el diccionario de datos es el producto de gobernanza más básico y más importante
5. **Arquitectura de capas**: ODS → DWD → DWS → ADS, refinando progresivamente el valor de los datos
6. **Implementación gradual**: empezar con el diccionario de datos e ir incorporando herramientas y procesos

## Lecturas adicionales

- [DAMA-DMBOK](https://www.dama.org/cpages/body-of-knowledge) - Cuerpo de conocimiento de gestión de datos, la "biblia" de la gobernanza de datos
- [DataHub](https://datahubproject.io/) - Plataforma de gestión de metadatos de código abierto de LinkedIn
- [Great Expectations](https://greatexpectations.io/) - Framework de calidad de datos en Python
- [dbt](https://www.getdbt.com/) - Herramienta de transformación de datos con pruebas y documentación integradas
- [Apache Atlas](https://atlas.apache.org/) - Framework de gobernanza de metadatos del ecosistema Hadoop
- [The Data Warehouse Toolkit](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/) - Clásico de modelado de almacenes de datos de Kimball
