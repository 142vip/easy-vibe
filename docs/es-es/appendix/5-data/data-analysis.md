# Principios de análisis de datos

::: tip 🎯 Pregunta central
**¿Cómo extraer de datos dispersos la "certeza" capaz de guiar el negocio?**
En los productos de Internet, cada segundo se generan enormes volúmenes de registros de comportamiento de usuarios. Observar únicamente los totales (como las visitas totales) suele ocultar la verdad. Este capítulo te guiará de lo básico a lo avanzado, desde los indicadores estadísticos fundamentales hasta los modelos de análisis de negocio de alto nivel, para que domines la lógica subyacente del análisis de datos.
:::

---

## 0. Visión general: La esencia del análisis de datos

> Mucha gente cree que echar un vistazo a un informe ya es análisis de datos. Si no entiendes la lógica de transformación entre "datos, información e insights", quedarás atrapado en la avalancha de detalles numéricos. El propósito de esta sección es ayudarte a construir una visión global y comprender que el objetivo final del análisis de datos no es "informar", sino "decidir".

El análisis de datos no es un simple "resumen de informes", sino un proceso de **reducción de dimensionalidad de la información** y **extracción de características**.

- **Datos en bruto (Raw Data)**: son registros dispersos y desordenados (por ejemplo: el usuario A hizo clic en el botón B a las 10:01).
- **Información (Information)**: son datos procesados (por ejemplo: hoy el 30% de los usuarios hizo clic en el botón B).
- **Insight (Insight)**: es descubrir las pautas detrás de los datos (por ejemplo: la tasa de clics del botón B es mucho mayor en dispositivos móviles que en PC, lo que indica que los usuarios móviles dependen más de esta función).

Nuestro objetivo es construir un marco de análisis sistemático que impulse el crecimiento del negocio a través del ciclo "observar → desglosar → localizar → decidir".

---

## 1. Estadística descriptiva: Cómo resumir el panorama general en una frase

> Cuando tienes 100.000 filas de datos ante ti, no puedes revisarlas una por una. Necesitas la capacidad de "comprimir la información", usando un número mínimo de indicadores para capturar con precisión el pulso de los datos. Si no conoces las trampas estadísticas de la media y la mediana, serás engañado por valores extremos al analizar el rendimiento del negocio (como el gasto promedio por usuario), llegando a conclusiones absurdas.

Cuando un conjunto de datos tiene decenas de miles de registros, necesitamos usar un número reducido de "indicadores representativos" para describir su aspecto general.

<DescriptiveStatsDemo />

### 1.1 Media (Mean): El punto de referencia del nivel general
La media (promedio aritmético) es el indicador más intuitivo.
- **Lógica de cálculo**: la suma de todos los valores dividida por la cantidad total de datos.
- **Limitación**: es muy susceptible a la interferencia de **valores atípicos extremos (Outliers)**.
- **Ejemplo**: si 9 empleados ganan 5k al mes y el jefe gana 100k, el salario promedio se eleva a 14,5k. En este caso, la media no refleja verdaderamente el nivel de ingresos de la mayoría de los empleados.

### 1.2 Mediana (Median) y Moda (Mode)
- **Mediana**: se ordenan los datos de menor a mayor y se toma el valor de la posición central. Resiste eficazmente la interferencia de los valores atípicos y refleja fielmente el nivel típico de la "capa intermedia".
- **Moda**: el valor que aparece con mayor frecuencia en el conjunto de datos. Al analizar "el producto preferido por los usuarios" o "el código de error más frecuente", la moda puede señalar directamente la tendencia del grupo.

### 1.3 Desviación estándar (Standard Deviation): La "amplitud" de la distribución
Describe la magnitud de las fluctuaciones de los puntos de datos respecto a la media.
- **Desviación estándar baja**: los datos están muy concentrados, la media es muy representativa (por ejemplo: las dimensiones de las piezas en una línea de montaje).
- **Desviación estándar alta**: la distribución de los datos es dispersa, con enormes diferencias individuales.
- **Significado**: en la monitorización del rendimiento, una desviación estándar alta suele indicar que la estabilidad del sistema es insuficiente, con un gran número de "solicitudes de cola larga" con tiempos de respuesta extremadamente lentos.

---

## 2. Agregación de datos: Descubrir patrones microscópicos en los grupos

> "La tasa de conversión promedio de todos los usuarios es del 5%" suele ser una verdad sin sentido. Debes aprender a "cortar" los datos para descubrir las enormes diferencias entre usuarios de distintas regiones, canales y dispositivos. El análisis de agregación te permite atravesar el promedio global y llegar directamente a los verdaderos puntos débiles del negocio que permanecen ocultos.

El comportamiento individual suele ser casual, pero el comportamiento grupal obedece a patrones estadísticos. El núcleo de la **agregación de datos (Aggregation)** consiste en "rebanar" la población según dimensiones específicas.

<DataAggregationDemo />

### 2.1 La lógica central de la agregación: Dividir-Calcular-Combinar
1. **Dividir (Split)**: agrupar según un atributo (por ejemplo: ciudad, canal de registro, usuarios nuevos vs. recurrentes).
2. **Calcular (Apply)**: ejecutar funciones de agregación dentro de cada grupo, como `COUNT()` para contar, `SUM()` para sumar, `AVG()` para calcular la media.
3. **Combinar (Combine)**: comparar los resultados de los distintos grupos y descubrir puntos de divergencia.

### 2.2 Motivación de imprescindible agrupar (Group By)
Los datos resumidos suelen ocultar problemas. Por ejemplo, la tasa de conversión general puede estar subiendo, pero al desglosar se descubre que en realidad es "Shanghái" la que ha experimentado un aumento espectacular que eleva el promedio, mientras que todas las demás regiones están descendiendo. Mediante el análisis de agregación, podemos localizar con precisión desde el promedio global hasta la rama con el mejor o peor rendimiento.

---

## 3. Modelo de embudo: Localizar los "puntos de sangrado" en la cadena de valor

> Has invertido muchos recursos en atraer usuarios, pero al final apenas hay ventas. ¿Todo el dinero tirado? El modelo de embudo puede decirte en qué paso exacto los usuarios tropiezan. Aprender esta sección te permitirá transformar la "optimización del negocio" de una suposición ciega a un desarrollo preciso, invirtiendo recursos en los eslabones con mayor retorno en la tasa de conversión.

El recorrido del usuario desde la entrada hasta la consecución del objetivo final (como el pago) es un proceso de filtrado por capas. El modelo de embudo (Funnel) no consiste únicamente en observar la tasa de conversión final, sino en detectar **dónde se pierden los usuarios**.

<FunnelAnalysisDemo />

### 3.1 Indicadores clave de conversión
- **Tasa de conversión global**: total de usuarios que completan el punto final / total de usuarios que entran al punto de inicio.
- **Tasa de conversión por paso**: usuarios en el paso actual / usuarios en el paso anterior (refleja la eficiencia de paso en ese nivel).
- **Tasa de abandono**: 1 - tasa de conversión por paso.

### 3.2 Enfoque de análisis profundo
Si la tasa de abandono de un eslabón es anormalmente alta, indica que existe **fricción en la experiencia** en ese punto. Por ejemplo:
- Abandono severo en la página de registro: indica que el formulario es demasiado complejo o el código de verificación no se recibe.
- Abandono en la selección del método de pago: indica que hay pocos métodos de pago o la redirección carga demasiado lento.
Invertir esfuerzo en optimizar la parte más estrecha del embudo suele generar los mayores retornos.

---

## 4. Análisis de retención: El "chequeo profundo" del producto

> La retención es el primer estándar de oro del valor del producto. Si la adquisición es llenar un cubo con agua, la retención es ver si ese cubo tiene fugas. Si solo sabes ver el tráfico total (visitas) pero no analizas la retención (usuarios recurrentes), no puedes determinar si el producto está creciendo de forma saludable o jugando un juego de números condenado al colapso.

El crecimiento de usuarios no significa éxito; poder retenerlos es el valor central. La tasa de retención (Retention) mide la proporción de usuarios que regresan después de un período específico.

<RetentionAnalysisDemo />

### 4.1 Ventanas de tiempo clave
- **Retención al día 1 (Day 1)**: se centra en la "primera impresión". ¿El usuario percibió el valor central en las primeras 24 horas tras su primera visita?
- **Retención al día 7 (Day 7)**: se centra en la "formación de hábito". ¿El usuario formó un hábito de uso periódico durante la primera semana?
- **Retención al día 30 (Day 30)**: se centra en la "adhesión a largo plazo". Determina el techo de supervivencia del producto.

### 4.2 Forma de la curva de retención: Determinar el PMF
- **Caída continua hasta cero**: indica que el producto no resuelve el punto de dolor de los usuarios, o que se están atrayendo al grupo equivocado.
- **Estabilización (cola larga)**: indica que el producto ha alcanzado el **PMF (Product-Market Fit)**, cuenta con un grupo de usuarios fieles y adheridos, y tiene la base para una expansión a escala.

---

## 5. Conclusión: Construir una intuición científica de los datos

Un analista excelente debe poseer pensamiento crítico y no dejarse engañar por las apariencias:
1. **Mirar la distribución, no solo la media**: reflexionar sobre las diferencias y los valores atípicos detrás de los datos.
2. **Mirar lo local, no solo el total**: reconstruir escenarios reales mediante agregación multidimensional (Group By).
3. **Mirar tendencias, no solo puntos en el tiempo**: observar la salud a largo plazo del producto a través de curvas de retención.
4. **Buscar fracturas en lugar de optimizar a ciegas**: localizar los verdaderos cuellos de botella del negocio a través del embudo.

El objetivo del análisis de datos no es generar informes bonitos, sino reducir la "incertidumbre" al mínimo y tomar decisiones inteligentes basadas en hechos.
test
