---
title: 'Cómo reconocer una buena idea'
description: 'Aprende a descubrir oportunidades en los problemas cotidianos, analizar necesidades y convertir una idea común en un producto por el que alguien esté dispuesto a pagar.'
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'

const duration = 'Aproximadamente <strong>3 horas</strong>'
</script>

# Cómo reconocer una buena idea

<ProductJourney current="choose" />

## Introducción del capítulo

<ChapterIntroduction :duration="duration" :tags="['Descubrimiento de necesidades', 'Pensamiento de producto', 'Análisis de usuarios', 'Modelo de negocio']" coreOutput="3 conceptos de producto con indicios reales" expectedOutput="Una dirección de producto que puedas validar">

En el capítulo anterior reunimos pistas procedentes de experiencias cotidianas, conversaciones públicas y opiniones sobre productos. Ahora no toca programar de inmediato: primero hay que ordenar esas pistas, convertirlas en posibles direcciones y escoger una que merezca ser investigada.

Una dirección no es buena solo porque suene novedosa. Debemos observar con qué frecuencia aparece el problema, cuánto afecta a la persona, cómo lo resuelve hoy y si ya invierte tiempo o dinero en hacerlo.

Seguiremos la historia de Xiao Ming para llevar estos criterios a situaciones concretas. Al terminar tendrás varias ideas respaldadas por indicios y sabrás cuál conviene investigar en el capítulo siguiente.

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Paso 1', description: 'Establecer criterios' },
      { title: 'Paso 2', description: 'Encontrar problemas cotidianos' },
      { title: 'Paso 3', description: 'Separar grupos de usuarios' },
      { title: 'Paso 4', description: 'Profundizar en el escenario' },
      { title: 'Paso 5', description: 'Comprobar la necesidad' },
      { title: 'Paso 6', description: 'Afinar el concepto' }
    ]" />
  </ClientOnly>
</div>

## Paso 1: establecer un criterio — ¿por qué necesidad pagaría alguien?

::: warning ¿Por qué importa tanto este capítulo?
Puede parecer extraño detenerse aquí en un curso de Vibe Coding. Muchos cursos empiezan con una lista de tareas, una calculadora o un blog. Esos ejercicios ayudan a aprender una herramienta, pero no responden a la pregunta principal: ¿alguien necesita lo que estamos construyendo?

Si la dirección es incorrecta, cada semana de trabajo solo hace más costoso el error. Puedes dedicar dos semanas a otro calendario que compite con cien productos mejores, crear un contador de calorías que se abandona después del primer uso o terminar una aplicación de gastos que ni tú utilizas.

Vibe Coding reduce el tiempo entre una idea y un producto. Precisamente por eso conviene aprender a escoger ideas que merezcan ese esfuerzo: no simples ejercicios, sino soluciones que alguien quiera usar.

El tiempo es valioso. Si has decidido intentar crear un producto, merece la pena averiguar hasta dónde puedes llevarlo.
:::

Para comparar ideas distintas, empieza con cinco preguntas sencillas:

| Criterio | Pregunta que debes responder |
| --- | --- |
| Frecuencia | ¿Con qué frecuencia aparece el problema? |
| Intensidad | ¿Cuánto molesta cuando ocurre? |
| Alternativa actual | ¿Cómo lo resuelve hoy la persona? |
| Pago | ¿Por qué pagaría para resolverlo mejor? |
| Alcance | ¿Hay suficientes personas con el mismo problema? |

---

## Apertura: la historia del desarrollador independiente Xiao Ming

Xiao Ming llevaba tres años trabajando como programador cuando pensó en crear una aplicación de ejercicio. Quería generar planes de entrenamiento, registrar sesiones y ayudar a la gente a ponerse en forma. La idea le entusiasmó.

Durante un año dedicó casi todo su tiempo libre al proyecto. Construyó cursos, registros diarios, comunidad y análisis de datos. La interfaz también le parecía bastante buena.

El primer mes después del lanzamiento consiguió 50 000 descargas gracias a la promoción. Sin embargo, casi todos los usuarios abrían la aplicación una vez y la borraban. La retención a siete días era del 5 % y apenas nadie pagaba. Keep, Boohee y FitTime ya tenían más contenido y mejores funciones. ¿Por qué iba alguien a cambiar?

Al cabo de un año había perdido 200 000 yuanes. Su pregunta era sencilla: «La aplicación está bien hecha, ¿por qué nadie la usa ni paga por ella?».

El problema no estaba en la tecnología ni en el acabado, sino en el punto de partida. Xiao Ming nunca había preguntado si el usuario necesitaba otra aplicación de ejercicio, qué diferencia concreta ofrecía o por qué estaría dispuesto a pagar.

**Cuando la dirección es incorrecta, mejorar el producto solo te aleja más del objetivo.**

::: tip Qué haremos
Revisaremos el proyecto de Xiao Ming en tres actos:

**Primer acto: encontrar una necesidad real.** Entender qué problemas justifican un pago.

**Segundo acto: extraer una buena idea.** Pasar de una intuición amplia a una oportunidad concreta.

**Tercer acto: afinarla conversando con IA.** Convertir la idea en un plan que pueda probarse.
:::

---

## Primer acto: encontrar una necesidad real

Xiao Ming no se rindió. Empezó por preguntar qué clase de necesidad hace que una persona cambie de comportamiento y pague.

### La duda de Xiao Ming: ¿por qué no pagan los usuarios?

Habló con varios amigos que habían probado su aplicación.

Una persona dijo: «Está bien, pero ya uso Keep. ¿Por qué debería cambiar?». Otra comentó que registrar cada entrenamiento era demasiado trabajo. Una tercera fue directa: «La parte gratuita me basta; no tengo motivo para pagar».

De estas respuestas salieron tres problemas:

1. **La solución actual ya es suficientemente buena.** Cambiar de producto cuesta tiempo y obliga a aprender nuevas rutinas.
2. **El producto exige demasiados hábitos nuevos.** Registrar cada sesión añade fricción antes de aportar valor.
3. **Existen muchos sustitutos gratuitos.** Una función general no ofrece una razón clara para pagar.

### ¿Qué es una necesidad real?

Xiao Ming estudió productos por los que la gente sí pagaba. Descubrió que una necesidad real no es algo que el creador considera útil, sino un problema por el que el usuario ya actúa: paga, cambia su comportamiento o soporta molestias para resolverlo.

**Las necesidades reales se observan en el comportamiento, no se inventan en una reunión.**

### Casos: productos por los que la gente paga

#### Meicai: permitir que el dueño de un restaurante duerma un poco más

Meicai parece un servicio para comprar verduras, pero el problema profundo era otro. Muchos dueños de pequeños restaurantes tenían que levantarse a las cuatro de la mañana para ir al mercado mayorista, invertir tiempo y exponerse a precios poco transparentes. El valor no era solo una cesta más barata: era recuperar descanso y reducir incertidumbre.

Cuanto mayor es el dolor, mayor suele ser la disposición a pagar. El tiempo y el esfuerzo ahorrados pueden valer más que el descuento en la compra.

#### Xiaohongshu: reducir la dificultad de elegir

Xiaohongshu comenzó con recomendaciones de compras. Frente a miles de opciones, muchas personas no sabían qué comprar ni en quién confiar. Las notas de otros usuarios reducían el tiempo de búsqueda y el riesgo de equivocarse.

Aquí aparecen dos problemas profundos: dificultad para elegir y falta de confianza. La persona no paga por una lista de productos, sino por decidir con menos ansiedad.

En ambos casos, el producto no vende una función aislada; reduce un temor. **El miedo impulsa el pago y la ansiedad impulsa la acción.**

### Tres niveles de necesidad: dolor, satisfacción y deseo

::: tip Punto de dolor — impulsado por el miedo
Es un problema que ya causa sufrimiento, ansiedad, riesgo o inconvenientes. No resolverlo tiene consecuencias claras.

Ejemplos: una persona con diabetes no sabe cuánto carbohidrato elevará su glucosa; un restaurador debe levantarse de madrugada para comprar suministros.

El usuario paga porque dejarlo sin resolver duele.
:::

::: tip Punto de satisfacción — recompensa inmediata
La necesidad puede resolverse enseguida y produce alivio o placer inmediato.

Ejemplos: recibir comida en treinta minutos o generar una presentación cuidada con un clic.

La satisfacción ayuda a que el usuario vuelva, aunque por sí sola no siempre basta para cobrar.
:::

::: tip Punto de deseo — el yo que alguien imagina
La persona quiere verse más disciplinada, elegante o creativa, pero no sufre una consecuencia grave si no lo consigue.

Ejemplos: registrar cada vaso de agua o aplicar un filtro artístico a una foto.

La disposición a pagar suele ser menor porque el problema puede posponerse.
:::

Como regla inicial: **dolor > satisfacción > deseo**. El dolor funciona como un analgésico; la satisfacción como una recompensa inmediata; el deseo se parece más a una vitamina o un lujo.

Un error frecuente consiste en vender un deseo como si fuera un dolor. «Registrar agua te hará más saludable» no cambia el hecho de que una persona puede beber sin registrar nada.

### Método de cinco pasos para comprobar una necesidad real

1. **Habla con usuarios reales y pregunta qué hacen hoy.** Busca diez personas del grupo objetivo. Si ya improvisan una solución, el problema existe; si nunca intentan resolverlo, quizá no sea urgente.
2. **Analiza las alternativas actuales.** Pueden usar otro producto, una hoja de cálculo, su memoria o simplemente soportar el problema. Tu propuesta debe mejorar de forma visible esa alternativa.
3. **Comprueba si pagan.** Una preventa o una pequeña señal vale más que una promesa. Más del 10 % es una señal fuerte; entre 5 % y 10 % exige ajustes; por debajo del 5 % conviene revisar la hipótesis.
4. **Calcula si el mercado sostiene el proyecto.** Multiplica el número de usuarios objetivo, la proporción que pagaría y el precio medio.
5. **Piensa qué será difícil de copiar.** La tecnología, los datos, la red de usuarios, la marca o un coste operativo menor pueden convertirse en barreras.

**Resumen del acto.** Una necesidad real hace que la persona pague, cambie de comportamiento o pierda algo importante si no la resuelve. Conviene distinguir dolor, satisfacción y deseo, y comprobar la idea con hechos antes de programar.

---

## Segundo acto: extraer una buena idea

Xiao Ming ya sabía reconocer una necesidad, pero todavía no sabía dónde encontrarla. Decidió empezar por las personas y situaciones que conocía mejor.

### Empezar por uno mismo: la hermana de Xiao Ming

Su hermana acababa de ser madre. Quería recuperar su cuerpo, pero tenía poco tiempo, sufría molestias físicas y estaba rodeada de información contradictoria.

Cuando Xiao Ming le preguntó cómo lo resolvía, ella explicó que los ejercicios generales de Keep le provocaban dolor lumbar, no podía ir al gimnasio porque cuidaba al bebé, un entrenador personal costaba entre 300 y 500 yuanes por sesión y entrenar sola le daba miedo.

El problema era concreto: tiempo fragmentado, limitaciones físicas, ansiedad por el cuerpo, demasiada información y poca compañía. No era una mejora agradable; era una combinación de dolores reales.

### Segmentación horizontal: necesidades de grupos diferentes

«Personas que quieren hacer ejercicio» era un grupo demasiado amplio. Xiao Ming lo separó en varios segmentos.

- Quien busca ganar músculo necesita controlar proteínas y valora la eficiencia.
- Una persona con diabetes debe vigilar carbohidratos y puede pagar por seguridad.
- Una madre después del parto tiene poco tiempo y necesita una solución adaptada.
- Quien come siempre fuera desconoce las calorías, aunque su disposición a pagar es media.
- Un estudiante que prepara exámenes necesita herramientas eficaces, pero dispone de poco presupuesto.

Escogió a las madres recientes porque conocía el problema de cerca, el dolor era intenso, existía disposición a pagar y la competencia especializada era menor.

::: tip Por qué segmentar
Una herramienta general compite con plataformas consolidadas. En un grupo pequeño, el problema suele ser más concreto, la propuesta se explica mejor y es más fácil crear reputación. Servir muy bien a una comunidad definida puede ser más valioso que intentar agradar a todo el mundo.
:::

### Profundizar verticalmente: el escenario completo

Xiao Ming observó un día entero de su hermana.

- A las seis de la mañana el bebé se duerme y quedan treinta minutos, pero ella no sabe qué ejercicio es seguro ni quiere hacer ruido.
- A las diez sostiene al bebé y le duele la espalda, aunque tiene las manos ocupadas.
- A las tres el bebé duerme, pero ella está cansada y no sabe si conviene entrenar.
- A las ocho por fin tiene tiempo; se mira al espejo, recuerda su cuerpo anterior y se angustia.

La necesidad no era «faltan cursos de ejercicio», sino el miedo y la ansiedad de la recuperación posparto.

::: info Pensar en escenarios
Un dolor no es simplemente una función que falta. Es una emoción situada en un momento concreto y acompañada de voluntad de actuar. Una madre puede sentir miedo a una secuela, ansiedad ante el espejo, desorientación por no saber cómo empezar y soledad porque nadie parece comprenderla.

Un buen producto resuelve esa experiencia, no solo añade un botón.
:::

### Reconstruir el valor: de «app de ejercicio» a «asistente de recuperación posparto»

::: tip Concepto reconstruido: asistente de recuperación posparto
**Posicionamiento:** entrenador de recuperación y apoyo emocional para madres después del parto.

**Funciones principales:**

1. Sesiones de 10 a 15 minutos que pueden hacerse mientras duerme el bebé, incluso con movimientos compatibles con sostenerlo.
2. Cursos por etapa —0 a 3 meses, 3 a 6 meses y más de 6 meses— con ejercicios de abdomen y suelo pélvico y advertencias de seguridad.
3. Corrección de postura con la cámara, usando capacidades existentes en vez de entrenar un sistema desde cero.
4. Comunidad privada con otras madres, profesionales de recuperación y apoyo psicológico.
5. Plan adaptado al tipo de parto, el estado físico y la lactancia.

**Modelo de negocio:** contenido básico gratuito; curso avanzado por 99 yuanes al mes; orientación individual por 299 yuanes al mes; comunidad por 199 yuanes al año.

**Barreras:** colaboración con especialistas, vínculo de la comunidad y datos que mejoran las recomendaciones.

**Mercado inicial:** si se atendiera al 1 % de unos diez millones de nuevos nacimientos al año, serían 100 000 usuarias. Con un ingreso medio de 500 yuanes anuales, el potencial sería de 50 millones de yuanes al año.
:::

| Dimensión | Idea original | Concepto reconstruido |
| --- | --- | --- |
| Usuario | Toda persona que hace ejercicio | Madres después del parto |
| Problema | Registrar entrenamientos | Ansiedad y recuperación posparto |
| Barrera | Tecnología fácil de copiar | Especialización, comunidad y datos |
| Disposición a pagar | Baja, con muchos sustitutos gratuitos | Alta por necesidad y valor emocional |
| Expansión | Limitada | Embarazo y preparación para el embarazo |

Así evoluciona una función hasta convertirse en un producto por el que alguien puede pagar.

### Más ejemplos: de una idea común a una buena idea

#### De «medir calorías» a «comer con tranquilidad si tienes diabetes»

Fotografiar alimentos para estimar calorías ya tiene competidores maduros. Al centrarse en personas con diabetes aparece otro escenario: antes de comer no saben si un plato disparará la glucosa; durante la comida necesitan controlar carbohidratos; después quieren relacionar comida y medición. El producto deja de ser una calculadora de dieta y se convierte en un asistente de seguridad alimentaria.

#### De «agregador de noticias» a «responsable de inteligencia de inversión»

Reunir noticias generales compite con grandes plataformas. Un analista financiero, en cambio, debe vigilar mercados extranjeros por la mañana, anuncios de empresas durante el día e industrias nuevas al investigar inversiones. El valor es filtrar señales y ayudar a decidir, no mostrar más noticias.

#### De «mercado universitario de segunda mano» a «asistente de liquidación antes de graduarse»

Un graduado tiene pocos días para dejar el campus, demasiados objetos y poco tiempo para negociar, cobrar y entregar. La oportunidad no es otro mercado general, sino un gestor que agrupe, encuentre compradores y coordine la salida.

### Resumen del segundo acto: lo que aprendió Xiao Ming

1. **Empieza por lo cercano.** Entiendes mejor a un grupo al que perteneces o con el que convives.
2. **Segmenta horizontalmente.** No sirvas a «todo el mundo»; busca el grupo que sufre más.
3. **Profundiza verticalmente.** Describe antes, durante y después, junto con miedo, ansiedad, impotencia o soledad.
4. **Reconstruye el valor.** Pasa de una función a una solución, y de una herramienta a un asistente.

El resultado ya es concreto: madres después del parto, un escenario completo y una propuesta diferenciada.

---

## Tercer acto: afinar la idea mediante una conversación con IA

Xiao Ming tenía una dirección, pero aún no sabía cómo empezar ni si la corrección de postura con IA era viable para una sola persona. Utilizó la conversación para convertir la idea en un plan.

### Primera ronda: presentar la idea inicial

Xiao Ming escribió: «Quiero crear un asistente de recuperación para madres después del parto. Me preocupa la dificultad técnica, sobre todo corregir posturas con IA. ¿Puede hacerlo una sola persona?».

### Segunda ronda: la IA ayuda a planificar el MVP

La IA propuso tres fases.

En uno o dos meses, validar la necesidad con un miniprograma de WeChat: vídeos adaptados, comunidad de seguimiento y correcciones humanas a los vídeos enviados. La meta sería saber si las usuarias pagan.

Entre el tercer y el sexto mes, si la prueba funciona, añadir corrección de postura con un SDK existente, planes personales y una comunidad mejorada.

Entre el sexto y el duodécimo mes, desarrollar una aplicación independiente, colaborar con centros de recuperación y ampliar el servicio al embarazo.

En vez de crear visión artificial desde cero, podría usar servicios existentes y combinar al principio trabajo humano con IA. Los indicadores iniciales serían cien usuarias el primer mes y una conversión de pago del 10 %.

### Tercera ronda: Xiao Ming plantea una preocupación

La recuperación posparto requiere conocimientos médicos y Xiao Ming no los tenía. Preguntó cómo garantizar la calidad del contenido.

### Cuarta ronda: la IA ofrece soluciones

La primera opción era colaborar con entrenadores y profesionales de salud: Xiao Ming aportaría producto y tecnología, y ellos contenido, con reparto de ingresos. La segunda era seleccionar y revisar recursos públicos durante la prueba. La tercera, permitir contenido de la comunidad y filtrarlo mediante revisión profesional y votación.

La recomendación inicial fue buscar dos o tres especialistas, crear el curso conjuntamente y dividir los ingresos, por ejemplo 70 % para el producto y 30 % para quienes aportan el contenido. Así el coste inicial de producción podía ser bajo sin fingir conocimientos médicos.

### Quinta ronda: Xiao Ming pregunta por la promoción

Su última duda era cómo encontrar madres recientes sin gastar demasiado en publicidad.

### Sexta ronda: la IA propone una estrategia de promoción

La IA sugirió empezar en Xiaohongshu con términos como «recuperación posparto» y «diástasis abdominal», contactar con creadoras y ofrecer un mes de prueba. También podía compartir material útil en comunidades de madres, colaborar con áreas de obstetricia de hospitales o con tiendas de productos infantiles.

La prueba debía tener números claros: cien usuarias, diez pagos, menos de 1000 yuanes de promoción y un coste de adquisición inferior a 10 yuanes por persona.

### Resultado: Xiao Ming ya tiene un plan claro

La primera fase sería un miniprograma con cursos y comunidad, dos o tres especialistas y corrección manual. La segunda incorporaría IA y personalización después de validar el pago. La tercera pasaría a una aplicación y asociaciones institucionales.

El presupuesto inicial se limitaría al desarrollo con AI IDE, colaboración por reparto de ingresos y promoción pequeña. Ya no era una lista de funciones, sino una hipótesis con plazos e indicadores.

### Método de cinco pasos para afinar una idea con IA

1. **Presenta la idea en bruto** y menciona tus dudas.
2. **Pide un MVP** con fases, objetivos y dificultad técnica.
3. **Expón tus preocupaciones** sobre tecnología, contenido, promoción o acceso a usuarios.
4. **Compara soluciones** y sus costes.
5. **Cierra con un plan** y métricas que indiquen cuándo continuar o cambiar.

```text
Quiero crear [concepto de producto],
pero me preocupa [tu preocupación].
Ayúdame a:
1. planificar un MVP;
2. proponer una implementación técnica concreta;
3. estimar los costes;
4. definir indicadores de validación.
```

### Resumen del tercer acto: lo que aprendió Xiao Ming

Una conversación útil necesita varias rondas y datos reales. El MVP contiene solo lo imprescindible para comprobar la hipótesis, debe poder medirse y utilizar el menor coste razonable. Como orientación inicial, una conversión superior al 10 % anima a continuar; entre 5 % y 10 % pide ajustes; por debajo del 5 % obliga a revisar la propuesta.

---

## Final: tu turno

### Una frase para recordar el método

**Una persona, una tarea y un punto de entrada; segmenta, profundiza, afina con IA y valida antes de construir.**

- Una persona: empieza por un grupo que conozcas.
- Una tarea: no intentes resolverlo todo.
- Un punto de entrada: cuanto más concreto, mejor.
- Segmenta: encuentra al grupo con más disposición a pagar.
- Profundiza: observa el recorrido y la emoción completa.
- Conversa con IA: convierte la intuición en un plan.
- Valida: comprueba la necesidad antes de invertir.

---

## 📚 Tarea del capítulo

<StageAssignmentCard title="Convertir una pequeña molestia en una idea de producto">

  <p>Empieza por una molestia reciente. No hace falta inventar un problema grandioso.</p>

  <ol>
    <li>Describe la molestia en una frase.</li>
    <li>Enumera tres grupos que podrían sufrirla y escoge el que mejor conoces.</li>
    <li>Explica en qué situación aparece y cómo se resuelve hoy.</li>
    <li>Formula de nuevo la idea: para quién es y qué tarea le ayuda a hacer mejor.</li>
  </ol>

  <p>Enséñasela después a una persona y comprueba si la entiende de inmediato.</p>
</StageAssignmentCard>

---

## Apéndice: metodología operativa

### Apéndice A: método de cinco pasos para analizar una necesidad

**Paso 1: encuentra diez usuarios objetivo.** No preguntes «¿usarías mi producto?». Pregunta qué hacen hoy, cuántas veces apareció el problema esta semana, cuánto tiempo o dinero gastaron y qué hábito tendrían que cambiar.

Señales útiles:

- «Me ocurre todos los días» puede indicar un dolor.
- «Es interesante, pero no tengo prisa» suele indicar un deseo.
- «Uso X, pero no estoy satisfecho» muestra una oportunidad.

| Alternativa actual | Qué significa | Oportunidad |
| --- | --- | --- |
| Ninguna | La persona soporta el problema | Puede ser grande, pero exige educación |
| Método torpe | Hoja de cálculo, trabajo manual, coordinación | Buena oportunidad |
| Varios productos unidos | A + B + C | Integrarlos puede aportar valor |
| Producto maduro insatisfactorio | Ya existe hábito, pero hay fricción | Exige diferenciación |
| Producto maduro satisfactorio | La solución actual funciona bien | Poca oportunidad sin cambio radical |

::: tip Qué es una innovación disruptiva
No consiste solo en mejorar un producto, sino en servir de forma más sencilla o barata a un grupo ignorado. El teléfono inteligente cambió la interacción, las plataformas de transporte cambiaron cómo se solicita un coche y el libro electrónico cambió cómo se compra y transporta una biblioteca.

Suele empezar en un grupo nuevo o desatendido y crecer desde allí.
:::

**Paso 2: comprueba el pago mediante preventa o señal.** Crea una página sencilla, explica la propuesta y añade un botón de reserva. Más del 10 % es una señal fuerte; entre 5 % y 10 % pide ajustes; menos del 5 % contradice la idea actual.

**Paso 3: estima el mercado.**

```text
Mercado potencial = número de usuarios objetivo × disposición a pagar × precio medio
```

En un mercado universitario de segunda mano, por ejemplo: 40 millones de estudiantes × 50 % con necesidad × 10 % que usaría la plataforma × dos operaciones × 100 yuanes × 5 % de comisión equivale a unos 20 millones de yuanes anuales.

**Paso 4: interpreta el tamaño.** Más de mil millones de yuanes es un mercado grande; entre cien millones y mil millones puede sostener un negocio especializado; menos de cien millones puede encajar mejor como proyecto pequeño o actividad secundaria.

**Paso 5: piensa en una barrera.**

| Tipo | Cómo funciona | Ejemplos |
| --- | --- | --- |
| Efecto de red | Cada usuario aumenta el valor | WeChat, Didi |
| Datos acumulados | Más datos mejoran la decisión | Douyin, Toutiao |
| Marca | Ocupa un lugar en la mente | Nike, Coca-Cola |
| Escala | Más volumen reduce el coste | Amazon, JD Logistics |
| Patente o técnica | Conocimiento difícil de reproducir | Huawei, DJI |
| Coste de cambio | Migrar resulta caro | Software empresarial, sistemas operativos |

Un proyecto temprano suele carecer de una barrera fuerte. Primero debe aprender más rápido, ocupar una posición y construirla después.

### Apéndice B: segmentación horizontal de usuarios

No intentes servir a «todos los usuarios de X». Enumera segmentos y evalúa intensidad del dolor, disposición a pagar, tamaño, competencia y cuánto conoces al grupo.

| Grupo para una app de gastos | Dolor | Pago | Tamaño | Competencia |
| --- | --- | --- | --- | --- |
| Empleados | Registrar es molesto | Bajo | Grande | Alta |
| Propietarios de pequeñas empresas | Mezclan gastos personales y de empresa | Alto | Medio | Media |
| Autónomos | Ingresos variables y flujo de caja incierto | Alto | Medio | Media |
| Padres de estudiantes en el extranjero | No saben en qué se gasta el dinero | Alto | Pequeño | Baja |

Escoge el grupo con dolor intenso, pago probable, acceso real y competencia manejable. En el ejemplo, los padres de estudiantes internacionales ofrecen un problema más concreto que el usuario general.

### Apéndice C: profundización vertical del escenario

1. Describe un día de la persona.
2. Identifica el problema de cada momento.
3. Señala emociones como miedo, ansiedad, impotencia, soledad, enfado o arrepentimiento.
4. Reconstruye el valor a partir del escenario completo.

| Hora | Escenario de una madre reciente | Problema | Emoción |
| --- | --- | --- | --- |
| 6:00 | El bebé se acaba de dormir | No sabe qué movimiento es seguro | Miedo |
| 10:00 | Sostiene al bebé y le duele la espalda | Tiene las manos ocupadas | Ansiedad |
| 15:00 | Quiere entrenar, pero está agotada | No sabe si debe hacerlo | Impotencia |
| 20:00 | Por fin tiene tiempo y se mira al espejo | Siente que no se recuperará | Tristeza |
| A largo plazo | Nadie parece comprenderla | Cree que está sola | Soledad |

La nueva propuesta no es un «rastreador de ejercicio», sino un entrenador de recuperación acompañado de apoyo emocional.

### Apéndice D: más transformaciones de una idea común

#### De «app de gastos» a «gestor de dinero para estudiar en el extranjero»

El dolor de los padres no es registrar cada compra, sino perder el control sobre cuánto y en qué gasta su hijo. El producto puede sincronizar consumos, avisar de excesos, crear un informe mensual y comparar con estudiantes parecidos.

#### De «temporizador Pomodoro» a «prueba de trabajo remoto»

La necesidad de un trabajador remoto puede no ser concentrarse, sino demostrar a su responsable qué hizo. Un producto podría seguir tiempo de trabajo, resumir actividad respetando la privacidad y generar un informe diario.

#### De «venta de libros usados» a «biblioteca de álbumes infantiles»

Los álbumes duran poco para cada edad y se acumulan en casa. En lugar de venderlos uno por uno, una suscripción puede enviar cinco libros apropiados, recogerlos después, recomendar la siguiente tanda y garantizar su limpieza.

### Apéndice E: cinco pasos para afinar un concepto con IA

Primero describe la idea, aunque sea incompleta, y la preocupación principal.

```text
Quiero crear [concepto de producto],
pero he observado [problema o preocupación].
```

Después pide un MVP, la implementación, el coste y los indicadores.

```text
Ayúdame a:
1. planificar un MVP;
2. proponer una implementación técnica concreta;
3. estimar los costes;
4. definir indicadores de validación.
```

Expón por separado las dudas reales.

```text
Me preocupan:
1. [preocupación 1]
2. [preocupación 2]
3. [preocupación 3]
```

Pide soluciones comparables.

```text
Propón soluciones concretas para estas preocupaciones,
compara sus costes y recomienda una.
```

Termina con un plan de acción.

```text
Ordena todo lo anterior en un plan de acción claro,
con fechas, métricas y una condición para cambiar de dirección.
```

::: tip Claves de la conversación
- No esperes una respuesta perfecta en una sola ronda.
- Aporta observaciones, experiencia y comentarios reales.
- Señala las recomendaciones poco realistas.
- Termina siempre con una acción verificable.
:::

### Apéndice F: lista de comprobación de la necesidad

::: tip Antes de invertir tiempo
**Usuario**
- ☐ ¿Puedes describirlo en una frase?
- ☐ ¿Conoces su alternativa actual?
- ☐ ¿Puedes narrar el escenario con detalles?
- ☐ ¿Tiene capacidad de pago?

**Intensidad del dolor**
- ☐ ¿Qué tiempo, dinero o energía pierde hoy?
- ☐ ¿Qué ocurre si no lo resuelve?
- ☐ ¿Ya busca una solución?
- ☐ ¿Cuánto pagaría realmente?

**Diferenciación**
- ☐ ¿Qué ventaja tienes frente a la alternativa?
- ☐ ¿Basta para que la persona cambie?
- ☐ ¿Una plataforma grande puede copiarla con facilidad?
- ☐ ¿La diferencia justifica el precio?

**Negocio**
- ☐ ¿Has probado el pago y el precio?
- ☐ ¿Cuánto cuesta adquirir un usuario?
- ☐ ¿El valor de vida cubre ese coste?
- ☐ ¿Existe otro ingreso posible?

**Prueba rápida**
- ☐ ¿Puedes crear un prototipo en una o dos semanas?
- ☐ ¿Puedes entrevistar a diez usuarios?
- ☐ ¿Puedes diseñar un experimento para la hipótesis principal?
- ☐ ¿Puedes pedir una señal por adelantado?
:::

No preguntes «¿usarías este producto?». Pregunta qué hace hoy, cuántas veces apareció el problema, qué hábito cambiaría y si pagaría un precio concreto. La mejor evidencia es una reserva real.

---

## Resumen del capítulo

La pregunta central de este capítulo fue siempre la misma: **¿pagará alguien por resolver este problema?**

::: info Ideas principales
1. Una necesidad real provoca pago, cambio de comportamiento o una pérdida importante si no se resuelve.
2. Para pasar de una idea común a un producto, segmenta el grupo, profundiza en su escenario y reconstruye el valor.
3. Evita los falsos dolores, los mercados demasiado pequeños y las soluciones más complicadas que el propio problema.
4. Entrevista a diez usuarios y utiliza preventa o señal para comprobar la disposición real a pagar.
5. Conversa con IA en varias rondas, pero termina con un plan, una métrica y una decisión.
:::

Un buen responsable de producto no inventa necesidades desde cero. Encuentra problemas ignorados, infravalorados o mal resueltos y descubre una forma por la que el usuario sí quiera pagar.

El siguiente paso será ordenar la dirección con el modelo del doble diamante y comprobarla con Jobs to Be Done y The Mom Test. Solo después de reunir esas pruebas empezaremos a construir el prototipo.
