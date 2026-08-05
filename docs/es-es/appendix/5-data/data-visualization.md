# Principios de visualización de datos

::: tip Prefacio
**Una buena tabla vale más que mil filas de datos.** La visualización de datos transforma números abstractos en expresiones visuales intuitivas, permitiendo a las personas comprender la historia detrás de los datos en cuestión de segundos. Desde los gráficos de Excel hasta los paneles de monitorización de Grafana, la visualización está en todas partes.
:::

**¿Qué aprenderás en este artículo?**

Después de completar este capítulo, obtendrás:

- **Selección de gráficos**: Elegir el tipo de gráfico más adecuado según el propósito de los datos
- **Principios de visualización**: Dominar los principios de diseño fundamentales de la visualización de datos
- **Diseño de dashboards**: Conocer los patrones de diseño de diferentes tipos de dashboards
- **Ecosistema de herramientas**: Familiarizarte con el posicionamiento y la selección de las herramientas de visualización más populares
- **Errores comunes**: Evitar gráficos engañosos y errores frecuentes de visualización

| Capítulo | Contenido | Conceptos clave |
|-----|------|---------|
| **Capítulo 1** | Selección de tipos de gráficos | Comparación, tendencia, proporción, distribución, relación |
| **Capítulo 2** | Principios de diseño de visualización | Ratio tinta-datos, consistencia, legibilidad |
| **Capítulo 3** | Diseño de dashboards | Panorámico, comparativo, de profundización, en tiempo real |
| **Capítulo 4** | Selección de herramientas | ECharts, D3, Grafana, Metabase |
| **Capítulo 5** | Errores comunes | Ejes truncados, gráficos de pastel 3D, uso excesivo de color |

---

## 0. Panorama general: Motivación de visualización

El cerebro humano procesa información visual mucho más rápido que el texto. Un gráfico de líneas te permite ver rápidamente que "las ventas del mes pasado están disminuyendo", mientras que la misma información presentada en una tabla requeriría comparar fila por fila para llegar a la misma conclusión.

El valor fundamental de la visualización:

- **Descubrir patrones**: Tendencias, ciclos y valores atípicos son evidentes de un vistazo en un gráfico
- **Apoyar la toma de decisiones**: Permite que incluso el personal no técnico comprenda los datos y participe en las decisiones
- **Eficiencia de comunicación**: Una imagen vale más que mil palabras, reduciendo la ambigüedad en la interpretación de datos

::: tip Visualización ≠ Bonito
El objetivo de la visualización es **transmitir información**, no lucirse. Un gráfico de barras sencillo pero preciso es mucho más valioso que un gráfico 3D llamativo pero difícil de entender.
:::

---

## 1. Selección de tipos de gráficos: Usa el gráfico correcto para contar la historia correcta

El primer paso para elegir un gráfico no es "qué gráfico me gusta", sino "qué información quiero transmitir". Diferentes propósitos de datos corresponden a diferentes tipos de gráficos óptimos.

<ChartTypeSelectorDemo />

### Tabla de referencia rápida para selección de gráficos

| Propósito de datos | Gráfico recomendado | No recomendado | Razón |
|---------|---------|--------|------|
| Comparar magnitudes | Gráfico de barras, gráfico de barras horizontales | Gráfico de pastel | El ojo humano es más sensible a las diferencias de longitud que a las de ángulo |
| Mostrar tendencias | Gráfico de líneas, gráfico de áreas | Gráfico de barras | La continuidad de la línea implica la continuidad del tiempo |
| Mostrar proporciones | Gráfico de pastel (≤5 categorías), gráfico de barras apiladas | Gráfico de pastel 3D | La perspectiva 3D distorsiona las proporciones de área |
| Mostrar distribución | Histograma, diagrama de caja | Gráfico de líneas | La distribución requiere ver frecuencias, no tendencias |
| Mostrar relaciones | Gráfico de dispersión, gráfico de burbujas | Gráfico de barras | La relación entre dos variables continuas requiere un espacio bidimensional |

::: tip Una regla de decisión simple
- **Una variable** → Histograma (distribución) o tarjeta numérica (KPI)
- **Dos variables** → Gráfico de líneas (tiempo vs. valor) o gráfico de dispersión (valor vs. valor)
- **Múltiples categorías** → Gráfico de barras (comparación) o gráfico de pastel (proporción, ≤5 categorías)
- **Multidimensional** → Gráfico de radar o gráfico de coordenadas paralelas
:::

---

## 2. Principios de diseño de visualización: Principios de codificación visual

Una buena visualización no es "bonita", sino "comprensible". Varios principios clásicos propuestos por Edward Tufte en "The Visual Display of Quantitative Information" siguen siendo una referencia importante para el diseño de visualización hoy en día.

| Principio | Descripción | Contraejemplo |
|------|------|---------|
| Ratio tinta-datos | La proporción de "tinta" utilizada para mostrar datos en el gráfico debe ser lo más alta posible | Exceso de líneas de cuadrícula, elementos decorativos |
| Minimizar elementos no informativos | Eliminar elementos visuales que no transmitan información | Efectos 3D, sombras, fondos degradados |
| Escala consistente | Los ejes comienzan desde cero, con intervalos uniformes; si se trunca un eje, debe indicarse claramente | Eje Y comienza en 95 sin indicarlo |
| Uso razonable del color | Usar color para codificar información, no para decorar | Colores del arcoíris para datos ordenados |
| Etiquetado claro | Título, etiquetas de ejes, leyenda y unidades son indispensables | Sin unidades, sin rango de tiempo |

### 2.1 Ratio tinta-datos (Data-Ink Ratio)

> La proporción de "tinta" utilizada para expresar datos en un gráfico respecto a la "tinta" total debe ser lo más alta posible.

En pocas palabras: **elimina todo elemento que no transmita información**.

| Debería eliminarse | Debería conservarse |
|-----------|-----------|
| Efectos 3D, sombras, degradados | Puntos de datos, etiquetas de ejes |
| Líneas de cuadrícula innecesarias | Líneas de referencia clave (como valores objetivo) |
| Iconos decorativos | Leyenda (cuando hay múltiples series) |
| Colores de fondo llamativos | Títulos y unidades claros |

### 2.2 Principio de consistencia

- **Color consistente**: La misma dimensión usa el mismo color en diferentes gráficos, por ejemplo, "ingresos" siempre en azul
- **Escala consistente**: Los ejes deben comenzar desde 0 siempre que sea posible, a menos que haya una razón justificada y se indique claramente
- **Tiempo consistente**: Los intervalos del eje temporal deben ser uniformes; no representes puntos temporales desiguales como si fueran equidistantes

### 2.3 Principio de legibilidad

- **El título debe expresar una conclusión**: No "ventas mensuales", sino "las ventas han disminuido durante 3 meses consecutivos"
- **Marcar puntos clave**: Añade anotaciones en valores atípicos y puntos de inflexión para guiar la atención del lector
- **Controlar la densidad de información**: Un gráfico debe transmitir 1-2 mensajes centrales, no saturas demasiado

::: tip Tres reglas para el uso del color
1. **Mismo indicador, mismo color**: Los ingresos deben ser azules en todos los gráficos, no alternar entre azul y verde
2. **Datos ordenados con gradiente**: La temperatura de baja a alta debe usar un gradiente de azul→rojo, no colores discretos
3. **Considerar la accesibilidad para daltónicos**: Aproximadamente el 8% de los hombres tienen daltonismo rojo-verde; evita usar solo rojo y verde para distinguir información clave
:::

---

## 3. Diseño de dashboards: Diferentes escenarios, diferentes patrones

Un dashboard es una combinación orgánica de múltiples gráficos. Un buen dashboard no es simplemente apilar gráficos juntos, sino seleccionar el patrón de diseño adecuado según el escenario de uso.

<DashboardLayoutDemo />

### Cuatro patrones de diseño comunes

| Patrón de diseño | Estructura central | Escenario de uso | Puntos de diseño |
|---------|---------|---------|---------|
| Panorámico global | Tarjetas KPI + gráfico de tendencias + tabla de detalles | Informes diarios para directivos, panel de operaciones | Los indicadores clave van en la parte superior, para ver los números críticos de un vistazo |
| Análisis comparativo | Diseño simétrico izquierdo-derecho | Tests A/B, análisis interanual/intermensual | Mantener las dimensiones de comparación consistentes, resaltar las diferencias |
| Análisis de profundización | Despliegue progresivo de resumen a detalle | Análisis de ventas, análisis de comportamiento de usuarios | Soportar interacción con clics, profundizar nivel por nivel |
| Monitorización en tiempo real | Números grandes + curvas en tiempo real + estado de alertas | Pantallas de eventos masivos, monitorización de servidores | Actualización automática, fondo oscuro, adecuado para proyección |

### 5 principios del diseño de dashboards

1. **Primero pregunta "quién lo va a ver"**: El CEO mira indicadores estratégicos, operaciones mira indicadores de proceso, los ingenieros miran indicadores técnicos
2. **Regla de los 5 segundos**: El usuario debería comprender la información central del dashboard en 5 segundos
3. **Jerarquía de información**: Lo más importante en la esquina superior izquierda, lo secundario debajo
4. **Minimizar el desplazamiento**: Mostrar el contenido central en una pantalla, evitando que el usuario deba desplazarse para ver datos clave
5. **Espacio en blanco**: No rellenes cada centímetro de espacio; el espacio en blanco adecuado hace la experiencia visual más cómoda

::: tip Dashboard vs. Informe
- **Dashboard**: En tiempo real o cuasi-real, interactivo, orientado a la monitorización y la toma rápida de decisiones
- **Informe**: Generado periódicamente (diario/semanal/mensual), estático, orientado al análisis detallado y archivo

No son mutuamente excluyentes, sino complementarios. El dashboard detecta problemas, el informe los analiza en profundidad.
:::

---

## 4. Selección de herramientas: Desde bibliotecas de código hasta plataformas BI

Las herramientas de visualización se pueden dividir en tres niveles: bibliotecas de gráficos a nivel de código, bibliotecas de gráficos para análisis de datos y plataformas BI. La elección depende de la complejidad de los requisitos, las necesidades de interacción y la capacidad técnica del equipo.

### 4.1 Bibliotecas de gráficos a nivel de código

| Herramienta | Lenguaje/Plataforma | Características | Escenario de uso |
|------|----------|------|---------|
| ECharts | JavaScript | Listo para usar, gran variedad de gráficos, documentación en chino completa | Gráficos integrados en sistemas empresariales |
| D3.js | JavaScript | Flexibilidad de bajo nivel, permite personalizar cualquier efecto de visualización | Visualización de datos altamente personalizada |
| Chart.js | JavaScript | Ligero y sencillo, fácil de aprender | Necesidades de gráficos simples |
| Matplotlib | Python | Biblioteca estándar de computación científica, gráficos estáticos | Análisis de datos, gráficos para publicaciones |
| Plotly | Python/JS | Gráficos interactivos, soporte 3D | Exploración de datos, Jupyter Notebook |

### 4.2 Plataformas BI (sin código/bajo código)

| Herramienta | Posicionamiento | Ventaja principal | Equipo adecuado |
|------|------|---------|---------|
| Grafana | Visualización de monitorización | Buen soporte para datos de series temporales, integración de alertas | Equipos de operaciones/SRE |
| Metabase | BI ligero | Código abierto y gratuito, genera gráficos con SQL | Equipos pequeños y medianos para implementación rápida |
| Apache Superset | BI empresarial | Código abierto, soporta grandes fuentes de datos | Empresas con equipo de datos |
| Tableau | BI comercial | Operación de arrastrar y soltar, excelentes resultados visuales | Analistas de negocio |
| Power BI | BI comercial | Buena integración con el ecosistema Microsoft | Empresas que usan el stack tecnológico de Microsoft |

::: tip Recomendaciones de selección
- **Desarrolladores integrando gráficos en productos** → ECharts (buen ecosistema en chino) o Chart.js (escenarios simples)
- **Analistas de datos haciendo análisis exploratorio** → Plotly + Jupyter o Metabase
- **Pantallas de monitorización de operaciones** → Grafana (el estándar de facto)
- **Equipos de negocio para autoanálisis** → Metabase (código abierto) o Tableau (comercial)
- **Necesidad de alta personalización** → D3.js (curva de aprendizaje pronunciada, pero la mayor flexibilidad)
:::

---

## 5. Errores comunes: Estos gráficos te están engañando

La visualización de datos es un arma de doble filo: bien usada revela la verdad, mal usada crea ilusiones. Estos son los errores de visualización más comunes que todo profesional de datos debería poder identificar.

### 5.1 Ejes truncados

Cambiar el punto de partida del eje Y de 0 a un número grande hace que las diferencias minúsculas parezcan cambios enormes.

| Escenario | Diferencia real | Impresión visual |
|------|---------|---------|
| Eje Y desde 0 | Producto A: 98 puntos, Producto B: 95 puntos | La diferencia es pequeña |
| Eje Y desde 90 | Mismos datos | A parece varias veces mayor que B |

**¿Cuándo es aceptable truncar?** Cuando el valor absoluto de los datos es grande pero el cambio es pequeño (como el precio de una acción de 100 a 105), truncar es razonable, pero debe indicarse claramente.

### 5.2 La trampa de la perspectiva en gráficos de pastel 3D

La perspectiva 3D hace que los sectores más cercanos al observador parezcan más grandes. Un sector del 25% puede parecer del 35% en una vista 3D.

**Solución**: Nunca uses gráficos de pastel 3D. Usa gráficos de pastel normales o de anillo, o simplemente usa un gráfico de barras.

### 5.3 Uso excesivo de color

| Práctica incorrecta | Práctica correcta |
|---------|---------|
| Usar rojo y verde para representar datos | Usar combinaciones seguras para daltónicos como azul-naranja |
| Cada categoría con un color diferente | Misma serie con variaciones de tono de un mismo color |
| Codificar datos continuos con color pero sin leyenda | Siempre proporcionar leyenda de color y etiquetas numéricas |
| Contraste insuficiente entre color de fondo y color de datos | Asegurar un contraste de nivel WCAG AA |

### 5.4 Otros errores comunes

| Trampa | Problema | Solución |
|------|------|------|
| Doble eje Y | Dos indicadores no relacionados comparten el eje X, sugiriendo una relación causal | Separar en dos gráficos o aclarar que no hay causalidad |
| Distorsión por área | Usar el radio del círculo en lugar del área para representar valores | Cuando el valor se duplica, el área debe duplicarse, no el radio |
| Eje temporal no uniforme | Enero, marzo y diciembre tienen el mismo espaciado | Ordenar según la proporción de tiempo real |
| Demasiadas categorías | Gráfico de pastel con 15 sectores | Más de 5 categorías: usar gráfico de barras o agrupar en "Otros" |

::: tip Código ético de la visualización
El propósito de la visualización es **ayudar a comprender**, no **manipular la percepción**. Cada vez que hagas un gráfico, pregúntate:

- Si yo fuera el lector, ¿este gráfico me llevaría a una conclusión errónea?
- ¿Estoy ocultando datos desfavorables?
- ¿Los ejes, las escalas y los colores representan los datos de manera justa?
:::

---

## Resumen

La visualización de datos es la "última milla" en la transmisión del valor de los datos. Por muy bueno que sea un análisis, si no puede ser comprendido correctamente, es como si no existiera.

Repasemos los puntos clave de este capítulo:

1. **Elegir el gráfico correcto**: Seleccionar el tipo de gráfico según el propósito de los datos (comparación, tendencia, proporción, distribución, relación)
2. **Principios de diseño**: Alto ratio tinta-datos, consistencia y legibilidad son los tres principios fundamentales
3. **Diseño de dashboards**: Los cuatro patrones (panorámico, comparativo, de profundización y en tiempo real) cubren la mayoría de los escenarios
4. **Selección de herramientas**: Desde ECharts hasta Grafana, elegir según la capacidad del equipo y la complejidad de los requisitos
5. **Evitar trampas**: Los ejes truncados, los gráficos de pastel 3D y el uso excesivo de color son los métodos engañosos más comunes

## Lecturas adicionales

- [The Visual Display of Quantitative Information](https://www.edwardtufte.com/tufte/books_vdqi) - El clásico de visualización de Edward Tufte
- [Documentación oficial de ECharts](https://echarts.apache.org/zh/index.html) - La biblioteca de gráficos en chino más popular
- [D3.js](https://d3js.org/) - Potente biblioteca de visualización de bajo nivel
- [Grafana](https://grafana.com/) - El estándar de facto para visualización de monitorización
- [From Data to Viz](https://www.data-to-viz.com/) - Árbol de decisión para selección de tipos de gráficos
- [ColorBrewer](https://colorbrewer2.org/) - Herramienta de esquemas de color seguros para daltónicos
