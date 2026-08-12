---
title: 'Cómo reconocer una buena idea'
description: 'Aprende a descubrir oportunidades en los problemas cotidianos, analizar necesidades y convertir una idea común en un producto por el que alguien esté dispuesto a pagar.'
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'

const duration = 'Aproximadamente <strong>3 horas</strong>'
</script>

# Cómo reconocer una buena idea

## Introducción del capítulo

<ChapterIntroduction :duration="duration" :tags="['Descubrimiento de necesidades', 'Pensamiento de producto', 'Análisis de usuarios', 'Modelo de negocio']" coreOutput="3 conceptos de producto con indicios reales" expectedOutput="Una dirección de producto que puedas validar">

En el capítulo anterior reunimos una serie de pistas iniciales a partir de experiencias cotidianas, conversaciones públicas y reseñas de productos. Ahora no toca programar de inmediato, sino ordenar esas pistas, convertirlas en posibles direcciones y escoger una que merezca la pena validar.

Una dirección no es buena solo porque suene novedosa. También debemos observar con qué frecuencia aparece el problema, cuánto afecta a la persona, cómo lo resuelve hoy y si está dispuesta a invertir tiempo o dinero.

En este capítulo seguiremos la historia de Xiao Ming para situar estos criterios en casos concretos. Poco a poco organizaremos las direcciones candidatas y conservaremos varios conceptos de producto respaldados por indicios y dignos de una investigación posterior. En el capítulo siguiente analizaremos con más detalle qué intenta conseguir realmente el usuario.

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
Puede parecer extraño: «¿No es este un curso de Vibe Coding? ¿Por qué debemos aprender primero a encontrar necesidades? ¿No podemos empezar a programar?».

Muchos cursos de programación enseñan a construir directamente una lista de tareas, una calculadora o un blog personal. Esos proyectos ayudan a familiarizarse con la sintaxis y las herramientas, pero tienen un problema:

<strong>Cuando la dirección es incorrecta, cuanto más avanzamos, más nos equivocamos.</strong>

Imaginemos tres casos:

- Dedicamos dos semanas a un sistema de calendario, aunque ya existen cien alternativas mejores.
- Creamos una calculadora de calorías por fotografía que se desinstala después del primer uso.
- Terminamos una aplicación de gastos personales que ni siquiera nosotros queremos utilizar.

¿Podríamos incluir estos proyectos en un currículum? Probablemente no, porque <strong>no resuelven problemas reales ni crean valor real</strong>.

La cuestión es sencilla: si vamos a invertir tiempo en aprender, conviene aspirar a un resultado mejor.

Vibe Coding permite convertir ideas en productos con rapidez. Por eso debemos aprender a <strong>encontrar ideas que merezca la pena construir</strong>: no proyectos de práctica, sino productos que la gente quiera usar.

De ahí que empecemos por aprender a encontrar grandes ideas.

---

**En mi opinión**, el tiempo es valioso. **Si vamos a hacer algo, hagámoslo bien**; de lo contrario, sería preferible descansar. Como responsable del curso, haré todo lo posible por ayudarte a buscar un resultado excelente.

Aunque nadie confíe en que puedas hacerlo bien, yo seguiré esperando tu éxito. Has elegido crear productos con Vibe Coding; veamos hasta dónde puedes llegar.

:::

---

## Apertura: la historia del desarrollador independiente Xiao Ming

Xiao Ming llevaba tres años trabajando como programador cuando pensó en crear una aplicación de ejercicio. Quería generar planes de entrenamiento, registrar sesiones y ayudar a la gente a ponerse en forma. La idea le entusiasmó.

Durante un año dedicó casi todo su tiempo libre al proyecto. Construyó cursos, registros diarios, comunidad y análisis de datos. La interfaz también le parecía bastante buena.

El primer mes después del lanzamiento consiguió 50 000 descargas gracias a la promoción. Sin embargo, casi todos los usuarios abrían la aplicación una vez y la borraban. La retención a siete días era del 5 % y apenas nadie pagaba. Keep, Boohee y FitTime ya tenían más contenido y mejores funciones. ¿Por qué iba alguien a cambiar?

Al cabo de un año había perdido 200 000 yuanes. Su pregunta era sencilla: «La aplicación está bien hecha, ¿por qué nadie la usa ni paga por ella?».

<figure class="idea-field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:Woman_stretching_in_a_gym_while_holding_her_phone.jpg" target="_blank" rel="noopener noreferrer">
    <img src="/images/finding-great-idea/fitness-phone-context.jpg" alt="Una mujer estira en un gimnasio mientras sostiene el teléfono" loading="lazy" />
  </a>
  <figcaption><strong>Observa la situación antes de elegir funciones.</strong> El teléfono ya aparece en una sesión de ejercicio, pero eso no demuestra que haga falta otra aplicación. Primero hay que averiguar para qué se usa y en qué punto deja de servir la solución actual. Foto: Shixart1985, CC BY 2.0.</figcaption>
</figure>

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

Una persona dijo: «La aplicación está bien, pero ya uso Keep. ¿Por qué debería cambiar?».

Otra comentó: «Me pides que registre cada entrenamiento. Es demasiado trabajo y no quiero hacerlo».

La tercera fue más directa: «Las funciones gratuitas me bastan. ¿Por qué iba a pagar?».

De estas respuestas salieron tres problemas:

**Primer problema: la solución actual ya es suficientemente buena.** Cambiar de producto cuesta tiempo y obliga a aprender nuevas rutinas.

**Segundo problema: el producto exige demasiados hábitos nuevos.** Registrar cada sesión añade fricción antes de aportar valor.

**Tercer problema: existen muchos sustitutos gratuitos.** Una función general no ofrece una razón clara para pagar.

### ¿Qué es una necesidad real?

Xiao Ming estudió productos por los que la gente sí pagaba. Descubrió que una necesidad real no es algo que el creador considera útil, sino un problema por el que el usuario ya actúa: paga, cambia su comportamiento o soporta molestias para resolverlo.

**Las necesidades reales se observan en el comportamiento, no se inventan en una reunión.**

### Casos: productos por los que la gente paga

#### Meicai: permitir que el dueño de un restaurante duerma un poco más

Meicai parece un servicio para comprar verduras, pero el problema profundo era otro. Muchos dueños de pequeños restaurantes tenían que levantarse a las cuatro de la mañana para ir al mercado mayorista, invertir tiempo y exponerse a precios poco transparentes. El valor no era solo una cesta más barata: era recuperar descanso y reducir incertidumbre.

Cuanto mayor es el dolor, mayor suele ser la disposición a pagar. El tiempo y el esfuerzo ahorrados pueden valer más que el descuento en la compra.

<figure class="idea-field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:Haikou_wholesale_vegetable_market_-_06.JPG" target="_blank" rel="noopener noreferrer">
    <img src="/images/finding-great-idea/haikou-wholesale-market.jpg" alt="Personas comprando verduras en un mercado mayorista de Haikou" loading="lazy" />
  </a>
  <figcaption><strong>Comprar no empieza ni termina al hacer el pedido.</strong> La fotografía muestra un mercado mayorista real de Haikou. Llegar, elegir, cargar y volver al restaurante también forman parte del trabajo; ahí puede estar el valor principal del producto. Foto: Anna Frodesiak, CC0.</figcaption>
</figure>

#### Xiaohongshu: reducir la dificultad de elegir

Xiaohongshu comenzó con recomendaciones de compras. Frente a miles de opciones, muchas personas no sabían qué comprar ni en quién confiar. Las notas de otros usuarios reducían el tiempo de búsqueda y el riesgo de equivocarse.

Aquí aparecen dos problemas profundos: dificultad para elegir y falta de confianza. La persona no paga por una lista de productos, sino por decidir con menos ansiedad.

En ambos casos, el producto no vende una función aislada; reduce un temor. **El miedo impulsa el pago y la ansiedad impulsa la acción.**

### Tres niveles de necesidad: dolor, satisfacción y deseo

::: tip Punto de dolor — impulsado por el miedo
Es un problema que ya causa sufrimiento, ansiedad, riesgo o inconvenientes. No resolverlo tiene consecuencias claras.

- Una persona con diabetes no sabe cuántos carbohidratos elevarán su glucosa.
- Un restaurador debe levantarse a las cuatro de la mañana para comprar suministros.

El usuario paga porque dejarlo sin resolver duele.
:::

::: tip Punto de satisfacción — recompensa inmediata
La necesidad puede resolverse enseguida y produce alivio o placer inmediato.

- Recibir comida en treinta minutos satisface el hambre de inmediato.
- Generar una presentación cuidada con un clic ahorra tiempo y esfuerzo.

La satisfacción ayuda a que el usuario vuelva, aunque por sí sola no siempre basta para cobrar.
:::

::: tip Punto de deseo — el yo que alguien imagina
La persona quiere verse más disciplinada, elegante o creativa, pero no sufre una consecuencia grave si no lo consigue.

- Registrar cuánta agua se bebe cada día representa una vida disciplinada imaginada.
- Aplicar filtros artísticos con IA a las fotografías representa un gusto artístico imaginado.

La disposición a pagar suele ser menor porque el problema puede posponerse.
:::

Como regla inicial: **dolor > satisfacción > deseo**. El dolor funciona como un analgésico; la satisfacción como una recompensa inmediata; el deseo se parece más a una vitamina o un lujo.

La razón puede resumirse así:

1. **Los puntos de dolor son necesidades de supervivencia.** No resolverlos causa un perjuicio grave, así que funcionan como «analgésicos».
2. **Los puntos de satisfacción ofrecen una recompensa inmediata.** Producen placer y hacen que las personas regresen.
3. **Los puntos de deseo satisfacen aspiraciones.** Son agradables, pero también los primeros en eliminarse; se parecen a vitaminas o artículos de lujo.

Un error frecuente consiste en vender un deseo como si fuera un dolor. «Registrar agua te hará más saludable» no cambia el hecho de que una persona puede beber sin registrar nada.

### Método de cinco pasos para comprobar una necesidad real

1. **Habla con usuarios reales y pregunta qué hacen hoy.** Busca diez personas del grupo objetivo. Si ya improvisan una solución, el problema existe; si nunca intentan resolverlo, quizá no sea urgente.
2. **Analiza las alternativas actuales.** Pueden usar otro producto, una hoja de cálculo, su memoria o simplemente soportar el problema. Tu propuesta debe mejorar de forma visible esa alternativa.

<figure class="idea-field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:Project_User_Experience_Testing_(9719939867).jpg" target="_blank" rel="noopener noreferrer">
    <img src="/images/finding-great-idea/ux-test-researcher-participant.jpg" alt="Un investigador y una participante prueban juntos un sitio web" loading="lazy" />
  </a>
  <figcaption><strong>Comprueba por separado lo que la gente dice y lo que hace.</strong> La fotografía documenta una prueba de experiencia de usuario de un sitio web. La entrevista ayuda a reconstruir la rutina habitual; una prueba de usabilidad permite ver dónde se detiene realmente la participante. Foto: Samuel Mann, CC BY 2.0.</figcaption>
</figure>
3. **Comprueba si pagan.** Una preventa o una pequeña señal vale más que una promesa. Más del 10 % es una señal fuerte; entre 5 % y 10 % exige ajustes; por debajo del 5 % conviene revisar la hipótesis.
4. **Calcula si el mercado sostiene el proyecto.** Multiplica el número de usuarios objetivo, la proporción que pagaría y el precio medio.
5. **Piensa qué será difícil de copiar.** La tecnología, los datos, la red de usuarios, la marca o un coste operativo menor pueden convertirse en barreras.

**Resumen del acto: lo que aprendió Xiao Ming**

1. **Criterios de una necesidad real**
   - El criterio más importante es que las personas estén dispuestas a pagar.
   - También están dispuestas a cambiar su comportamiento.
   - Si no existe una solución, sufren una pérdida importante.
2. **Evitar las necesidades falsas**
   - Los puntos de deseo no son puntos de dolor y no deben tratarse como necesidades reales.
   - Un mercado demasiado pequeño no sostiene un modelo de negocio.
   - Si la solución es más compleja que el problema, las personas la abandonarán.
3. **Orden de prioridad**
   - La prioridad es: puntos de dolor > puntos de satisfacción > puntos de deseo.

**Resultado del acto**

- Comprendemos qué es una necesidad real.
- Dominamos la clasificación en puntos de dolor, satisfacción y deseo.
- Hemos aprendido el método de cinco pasos para validar necesidades.

---

## Segundo acto: extraer una buena idea

Xiao Ming ya sabía reconocer una necesidad real, pero todavía no sabía por dónde empezar. Al fin y al cabo, una necesidad no puede inventarse de la nada.

Decidió partir de aquello que conocía mejor: las personas y situaciones cercanas.

### Empezar por uno mismo: la hermana de Xiao Ming

Pensó en su hermana, que acababa de ser madre. A menudo se quejaba de que no encontraba tiempo para entrenar, no lograba reducir el abdomen y se sentía cada vez más ansiosa.

Un día, Xiao Ming le preguntó cómo resolvía ahora el problema del ejercicio.

Ella suspiró: «Sigo las rutinas de Keep, pero esos movimientos no están adaptados al cuerpo después del parto y luego me duele aún más la zona lumbar. No puedo ir al gimnasio porque nadie cuida al bebé. Un entrenador personal cuesta entre 300 y 500 yuanes por sesión. Si entreno sola, temo hacerme daño».

Xiao Ming pensó que quizá acababa de encontrar una necesidad real.

El problema era concreto. El tiempo estaba fragmentado porque cuidar al bebé impedía reservar un bloque completo. El cuerpo tenía limitaciones, como la diástasis abdominal o la debilidad del suelo pélvico, que impedían ejercicios intensos. También había ansiedad por los cambios físicos, información contradictoria sobre qué movimientos eran seguros y una sensación de soledad por la falta de apoyo de otras personas en la misma situación.

Eran puntos de dolor reales, no simples deseos que estaría bien satisfacer.

<figure class="idea-field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:Post_Pregnancy_Pt_Class_DVIDS301829.jpg" target="_blank" rel="noopener noreferrer">
    <img src="/images/finding-great-idea/post-pregnancy-training.jpg" alt="Un grupo participa en una clase de ejercicio después del embarazo" loading="lazy" />
  </a>
  <figcaption><strong>El ejercicio posparto tiene restricciones propias.</strong> La fotografía documenta una clase real después del embarazo. El lugar, la supervisión y la intensidad del movimiento no son adornos del escenario: forman parte del problema que conviene entender antes de enumerar funciones. Foto: Staff Sgt Orly N. Tyrell, Fuerza Aérea de Estados Unidos, dominio público.</figcaption>
</figure>

### Segmentación horizontal: necesidades de grupos diferentes

Xiao Ming comprendió que «aplicación de ejercicio» era una idea demasiado amplia. Pretendía ayudar a todo el mundo a entrenar, pero cada grupo tenía necesidades distintas.

Dividió a las personas interesadas en el ejercicio en varios segmentos, siguiendo el método del Apéndice B.

Quien busca ganar músculo necesita controlar las proteínas y valora la eficiencia. Una persona con diabetes debe vigilar los carbohidratos y puede pagar por seguridad. Una madre después del parto tiene poco tiempo y necesita una solución adaptada. Quien come siempre fuera desconoce las calorías, aunque su disposición a pagar es media. Un estudiante que prepara exámenes necesita herramientas eficaces, pero dispone de poco presupuesto.

Escogió a las madres recientes porque conocía el problema de cerca, el dolor era intenso, existía disposición a pagar y la competencia especializada era menor.

::: tip Por qué segmentar
Una herramienta general compite con plataformas consolidadas. En un grupo pequeño, el problema suele ser más concreto, la propuesta se explica mejor y es más fácil crear reputación. Servir muy bien a una comunidad definida puede ser más valioso que intentar agradar a todo el mundo.
:::

### Profundizar verticalmente: el escenario completo

Después de escoger el grupo, Xiao Ming no se limitó a la función de «ejercicio posparto». Quería comprender todo el escenario de uso, siguiendo el método del Apéndice C.

Observó un día entero de su hermana.

- A las seis de la mañana el bebé se duerme y quedan treinta minutos, pero ella no sabe qué ejercicio es seguro ni quiere hacer ruido.
- A las diez sostiene al bebé y le duele la espalda, aunque tiene las manos ocupadas.
- A las tres el bebé duerme, pero ella está cansada y no sabe si conviene entrenar.
- A las ocho por fin tiene tiempo; se mira al espejo, recuerda su cuerpo anterior y se angustia.

La necesidad no era «faltan cursos de ejercicio», sino el miedo y la ansiedad de la recuperación posparto.

<figure class="idea-field-figure idea-field-figure--portrait idea-field-figure--artifact">
  <a href="https://commons.wikimedia.org/wiki/File:Beispiel_Customer_Journey_Map.jpg" target="_blank" rel="noopener noreferrer">
    <img src="/images/finding-great-idea/customer-journey-work.jpg" alt="Ejemplo físico de un mapa de experiencia del cliente colocado en una pared" loading="lazy" />
  </a>
  <figcaption><strong>Reconstruye la situación sobre una línea de tiempo.</strong> La imagen muestra un ejemplo de trabajo con un mapa de experiencia. El mapa no es evidencia de usuario por sí solo; sirve para ordenar lo aprendido en entrevistas y observaciones, y localizar cambios de emoción y obstáculos. Foto: Anakin Schoeber, CC BY-SA 4.0.</figcaption>
</figure>

::: info Pensar en escenarios
Un dolor no es simplemente una función que falta. Es una emoción situada en un momento concreto y acompañada de voluntad de actuar. Una madre puede sentir miedo a una secuela, ansiedad ante el espejo, desorientación por no saber cómo empezar y soledad porque nadie parece comprenderla.

Un buen producto resuelve esa experiencia, no solo añade un botón.
:::

### Reconstruir el valor: de «app de ejercicio» a «asistente de recuperación posparto»

::: tip Concepto reconstruido: asistente de recuperación posparto
**Posicionamiento:** entrenador de recuperación y apoyo emocional para madres después del parto.

**Funciones principales:**

1. **Entrenamiento en momentos breves:**
   - Cada sesión requiere solo de 10 a 15 minutos.
   - Puede hacerse mientras duerme el bebé.
   - Incluye movimientos que pueden realizarse mientras se sostiene al bebé.
2. **Cursos específicos para el posparto:**
   - Se organizan por etapa: de 0 a 3 meses, de 3 a 6 meses y más de 6 meses.
   - Incluyen entrenamiento para la diástasis abdominal y la recuperación del suelo pélvico.
   - Cada movimiento incorpora advertencias específicas para el posparto.
3. **Corrección de movimientos con IA:**
   - La cámara del teléfono reconoce los movimientos.
   - Ofrece avisos en tiempo real, como «flexionas demasiado las rodillas» o «mantén recta la espalda».
   - Ayuda a evitar lesiones causadas por una ejecución incorrecta.
4. **Comunidad de apoyo psicológico:**
   - Es una comunidad privada solo para madres después del parto.
   - Permite compartir avances y darse ánimo.
   - Cuenta con profesionales de la psicología.
5. **Planes personalizados:**
   - Se adaptan al tipo de parto —vaginal o cesárea— y al estado físico.
   - Tienen en cuenta las necesidades especiales durante la lactancia.

**Modelo de negocio:**

- Cursos básicos gratuitos.
- Cursos avanzados: 99 yuanes al mes, con corrección de movimientos mediante IA y planes personalizados.
- Orientación individual: 299 yuanes al mes, con acompañamiento en línea.
- Membresía de la comunidad: 199 yuanes al año, con apoyo psicológico y preguntas a especialistas.

**Barreras competitivas:**

- Especialización: colaboración con centros de recuperación posparto y respaldo médico.
- Permanencia en la comunidad: los vínculos emocionales entre las madres son fuertes.
- Acumulación de datos: cuantos más datos corporales haya, más precisos serán los planes.

**Tamaño del mercado:**

- En China nacen unos diez millones de bebés al año.
- El mercado de recuperación posparto ronda los 50 000 millones de yuanes.
- Atender al 1 % de las madres equivaldría a 100 000 usuarias.
- El ingreso medio por usuaria sería de 500 yuanes al año.
- Los ingresos potenciales serían de 50 millones de yuanes anuales.
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

Xiao Ming aplicó el mismo método a otras ideas para comprobar si podía generalizarse. Los casos completos aparecen en el Apéndice D.

#### De «medir calorías» a «comer con tranquilidad si tienes diabetes»

La idea común consiste en fotografiar los alimentos para estimar sus calorías y ayudar a perder peso. Sin embargo, ya existen productos maduros como Boohee Health y MyFitnessPal.

Al segmentar el grupo, Xiao Ming observó una necesidad distinta entre las personas con diabetes: deben controlar estrictamente los carbohidratos, pero resulta difícil estimarlos al comer fuera. Antes de la comida no saben si un plato elevará demasiado la glucosa; durante la comida necesitan saber cuántos carbohidratos llevan consumidos; después quieren relacionar los alimentos con la medición de glucosa.

El concepto reconstruido se llama «Comer con tranquilidad si tienes diabetes» y se posiciona como asistente de seguridad alimentaria.

---

#### De «agregador de noticias» a «responsable de inteligencia de inversión»

La idea común consiste en reunir noticias de distintas plataformas para evitar abrirlas una por una. Sin embargo, las grandes aplicaciones de noticias ya resuelven bien esa tarea.

Al segmentar, Xiao Ming encontró una necesidad especial entre los analistas financieros: deben seguir sectores concretos, pero la información está muy dispersa. Por la mañana revisan el cierre de las bolsas estadounidenses y los tipos de cambio; después siguen anuncios de empresas en cartera y noticias sectoriales; por la tarde investigan posibles inversiones y necesitan una gran cantidad de información especializada.

El concepto reconstruido se llama «Responsable de inteligencia de inversión» y se posiciona como radar de información y asistente para la toma de decisiones.

---

#### De «mercado universitario de segunda mano» a «asistente de liquidación antes de graduarse»

La idea común es un mercado universitario de segunda mano. Sin embargo, las plataformas generales ya están bien establecidas.

Después de segmentar, Xiao Ming identificó una necesidad especial entre quienes están a punto de graduarse: tienen demasiadas pertenencias y venderlas una por una requiere demasiado trabajo. Deben dejar el campus en una semana, no saben quién puede querer cada objeto y apenas tienen tiempo para negociar, entregar y cobrar.

El concepto reconstruido se llama «Asistente de liquidación antes de graduarse» y se posiciona como gestor de los bienes del estudiante al abandonar el campus.

---

### Resumen del segundo acto: lo que aprendió Xiao Ming

**1. Empieza por lo cercano**

- Al formar parte del grupo, comprendemos sus puntos de dolor de manera natural.
- El interés es un buen punto de partida y la pasión, un buen impulso.

**2. Segmenta horizontalmente**

- No intentes servir a todo el mundo; busca el segmento que sufre el dolor más intenso.
- Cuanto más concreto sea, mayor puede ser la oportunidad y la disposición a pagar.

**3. Profundiza verticalmente**

- Describe el recorrido completo: antes, durante y después del uso.
- Busca puntos de contacto emocionales como miedo, ansiedad, impotencia y soledad.

**4. Reconstruye el valor**

- Pasa de una función a una solución.
- Pasa de una herramienta a un asistente, gestor o acompañante.

El resultado ya es concreto: madres después del parto, un escenario completo y una propuesta diferenciada.

📦 **Resultado del acto:**

- Un grupo objetivo preciso: madres después del parto.
- El escenario completo y las emociones reales de las usuarias.
- Un concepto reconstruido con una estrategia de diferenciación clara.

---

## Tercer acto: afinar la idea mediante una conversación con IA

Xiao Ming ya tenía una dirección de producto clara: un asistente de recuperación posparto. Sin embargo, todavía no sabía cómo llevarla a la práctica, por dónde empezar ni cuán difícil sería la implementación técnica.

Decidió apoyarse en la IA para afinar el concepto y convertir la idea en un plan ejecutable.

### Primera ronda: presentar la idea inicial

Xiao Ming explicó su idea a la IA: «Quiero crear una aplicación que funcione como asistente de recuperación para madres después del parto y las ayude a recuperar su forma física. Sin embargo, me preocupa la dificultad técnica, sobre todo la función de corrección de movimientos mediante IA. ¿Puede hacerlo una sola persona?».

---

### Segunda ronda: la IA ayuda a planificar el MVP

La IA respondió: «Es una buena pregunta. Preparemos un plan para el MVP, es decir, el producto mínimo viable».

Propuso trabajar en tres fases. La primera duraría uno o dos meses y se dedicaría a validar la necesidad. En lugar de crear una aplicación completa, Xiao Ming haría primero un miniprograma de WeChat con cursos específicos en vídeo y una comunidad de seguimiento. Las usuarias subirían sus vídeos y un entrenador respondería con indicaciones manuales. El objetivo sería comprobar si las madres están dispuestas a pagar.

La segunda fase duraría de tres a seis meses. Si la primera validación daba resultado, incorporaría las funciones centrales: corrección de movimientos mediante IA con un SDK existente, planes personalizados y una comunidad mejorada.

La tercera fase duraría de seis a doce meses y estaría orientada a crecer. Xiao Ming desarrollaría una aplicación independiente, colaboraría con centros de recuperación posparto y ampliaría el servicio a las etapas de embarazo y preparación para el embarazo.

Para la parte técnica, la IA recomendó utilizar capacidades existentes de reconocimiento corporal, como las API de Baidu o Tencent, en lugar de desarrollar el sistema desde cero. Al principio se combinaría la orientación humana con la IA y se automatizaría poco a poco.

El desarrollo externalizado del miniprograma costaría entre 10 000 y 20 000 yuanes, aunque Xiao Ming también podía construirlo con un AI IDE. Para producir el contenido, colaboraría con especialistas en recuperación posparto; para promocionarlo, empezaría por comunidades de madres y Xiaohongshu.

El indicador de validación sería conseguir cien usuarias durante el primer mes y una conversión de pago del 10 %. Si alcanzaba esa cifra, continuaría invirtiendo. Si no, ajustaría la dirección a tiempo.

<figure class="idea-field-figure idea-field-figure--artifact">
  <a href="https://commons.wikimedia.org/wiki/File:UX_prototyping_4.jpg" target="_blank" rel="noopener noreferrer">
    <img src="/images/finding-great-idea/app-prototype-user-test.jpg" alt="Una participante prueba el prototipo de una aplicación en un teléfono" loading="lazy" />
  </a>
  <figcaption><strong>Pon el prototipo en manos de la participante.</strong> La fotografía documenta una prueba real de un prototipo de aplicación. No importa que la interfaz parezca terminada: importa si la participante completa la tarea, dónde duda y qué debe cambiar en la siguiente iteración. Foto: Luthienrecanto, CC BY-SA 4.0.</figcaption>
</figure>

### Tercera ronda: Xiao Ming plantea una preocupación

La recuperación posparto requiere conocimientos médicos y Xiao Ming no los tenía. Preguntó cómo garantizar la calidad del contenido.

---

### Cuarta ronda: la IA ofrece soluciones

La IA señaló que era una preocupación habitual entre fundadores con formación técnica, pero que había varias soluciones.

La primera opción era colaborar con profesionales. Xiao Ming podía buscar especialistas en recuperación posparto o médicos de nutrición hospitalaria: él aportaría tecnología y producto; ellos, contenido especializado. El acuerdo podía basarse en un reparto de ingresos.

La segunda opción era integrar contenido público de calidad durante la etapa inicial, por ejemplo vídeos de recuperación disponibles en YouTube o Bilibili. Primero tendría que seleccionarlos, ordenarlos y revisarlos; más adelante produciría contenido original.

La tercera opción era fomentar contenido generado por usuarias. Las madres con experiencia compartirían sus métodos de recuperación y la comunidad ayudaría a filtrar las aportaciones mediante votaciones, hasta formar gradualmente un ecosistema de contenidos.

La recomendación inicial fue buscar dos o tres especialistas, crear el curso conjuntamente y dividir los ingresos, por ejemplo 70 % para el producto y 30 % para quienes aportan el contenido. Así el coste inicial de producción podía ser bajo sin fingir conocimientos médicos.

**Recomendación: empezar por la primera opción**

Pasos concretos:

1. Encontrar dos o tres especialistas en recuperación posparto.
2. Proponerles una colaboración: Xiao Ming desarrolla el producto y ellos preparan los cursos.
3. Repartir los ingresos: un 70 % para Xiao Ming y un 30 % para los especialistas.
4. De este modo se protege la calidad del contenido y se reduce el coste.

**Coste inicial:**

- Producción de los cursos: 0 yuanes mediante el reparto de ingresos.
- Xiao Ming solo aporta el tiempo de desarrollo y el coste de promoción.

:::

---

### Quinta ronda: Xiao Ming pregunta por la promoción

Su última duda era cómo encontrar madres recientes sin gastar demasiado en publicidad.

---

### Sexta ronda: la IA propone una estrategia de promoción

La IA explicó que el grupo era relativamente fácil de localizar y que la promoción podía empezar con un coste muy bajo.

El canal más recomendable era Xiaohongshu. Xiao Ming buscaría términos como «recuperación posparto» y «diástasis abdominal», localizaría a creadoras relacionadas y les propondría una colaboración por mensaje privado. Podía ofrecer un mes de prueba gratuito a cambio de difusión, con un coste cercano a cero.

La segunda vía eran las comunidades de madres en WeChat o QQ. Entraría para intercambiar experiencias de recuperación, compartiría contenido útil sin publicar anuncios directos y construiría confianza poco a poco.

También podía colaborar con el área de obstetricia de hospitales, ofrecer orientación gratuita y distribuir folletos cuyo único coste serían unos cientos de yuanes de impresión. Otra posibilidad era colocar materiales en tiendas de productos maternoinfantiles y entregar tarjetas de prueba con las compras.

La prueba debía tener números claros: cien usuarias, diez pagos, menos de 1000 yuanes de promoción y un coste de adquisición inferior a 10 yuanes por persona.

### Resultado: Xiao Ming ya tiene un plan claro

Después de seis rondas de conversación, Xiao Ming ya tenía un plan claro.

La primera fase duraría uno o dos meses. Crearía un miniprograma de WeChat, colaboraría con dos o tres especialistas mediante reparto de ingresos, ofrecería solo cursos específicos en vídeo y una comunidad de seguimiento, y mantendría la orientación manual de los movimientos. La meta sería llegar a cien usuarias y una conversión de pago del 10 %.

La segunda fase duraría de tres a seis meses. Si la primera validación funcionaba, continuaría invirtiendo: añadiría corrección de movimientos mediante IA, planes personalizados y mejoras en la comunidad.

La tercera fase duraría de seis a doce meses. Desarrollaría una aplicación independiente, colaboraría con centros especializados y ampliaría el servicio al embarazo y la preparación para el embarazo.

El coste inicial sería muy bajo: desarrollo propio con un AI IDE, contenido sin coste inicial gracias al reparto de ingresos y promoción en Xiaohongshu y comunidades de madres por menos de 1000 yuanes. El total quedaría por debajo de 1000 yuanes.

---

### Método de cinco pasos para afinar una idea con IA

**Primer paso: presenta la idea en bruto.** Describe la idea inicial, aunque todavía sea imprecisa, y menciona preocupaciones como la competencia o la falta de diferenciación.

**Segundo paso: pide a la IA que planifique el MVP.** Pregunta qué debe contener, cuántas fases requiere, qué objetivo tiene cada fase y qué dificultad técnica presenta.

**Tercer paso: expón tus preocupaciones.** Incluye la dificultad técnica, el coste del contenido, el coste de promoción y el acceso a usuarios.

**Cuarto paso: pide soluciones concretas.** Compara las opciones, escoge la más adecuada y estima su coste.

**Quinto paso: confirma el plan.** Organiza acciones claras y define indicadores que permitan continuar o ajustar la dirección.

**Plantilla de prompt:**

```text
Quiero crear [concepto de producto],
pero me preocupa [tu preocupación].
Ayúdame a:
1. Planificar un MVP
2. Proponer una implementación técnica concreta
3. Estimar el coste
4. Definir indicadores de validación
```

### Resumen del tercer acto: lo que aprendió Xiao Ming

En el tercer acto, Xiao Ming comprendió tres cosas.

**Primera: la IA sirve para afinar el concepto mediante varias rondas.** No debemos esperar una respuesta perfecta en un solo intercambio. Conviene aportar observaciones, experiencias y comentarios de personas cercanas; si una recomendación no resulta razonable, debemos señalarlo. La conversación termina cuando existe un plan de acción concreto.

**Segunda: un MVP sigue tres principios.** Debe ser mínimo y contener solo la función central; verificable, para comprobar pronto si la necesidad es real; y de bajo coste, para validar con la menor inversión posible.

**Tercera: hacen falta indicadores.** Una conversión de pago superior al 10 % indica que la necesidad es real y merece inversión. Entre el 5 % y el 10 %, la necesidad existe, pero el concepto debe afinarse. Por debajo del 5 %, conviene revisar la propuesta y ajustar la dirección.

---

📦 **Resultado del capítulo:**

- Un plan de MVP claro.
- Una ruta técnica conocida.
- Indicadores de validación definidos.

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

**No preguntes:** «¿Usarías mi producto?». Esta pregunta produce cerca de un 90 % de falsos positivos.

**Pregunta en su lugar:**

- «¿Cómo resuelves actualmente este problema?», para conocer el comportamiento real.
- «¿Cuántas veces te molestó durante la última semana?», para conocer la frecuencia.
- «¿Cuánto dinero o tiempo dedicaste a resolverlo?», para conocer la disposición a pagar.
- «Si la solución exige cambiar de hábitos, ¿estarías dispuesto a hacerlo?», para conocer el coste del cambio.

**Criterios de decisión:**

- Si más de tres personas dicen que el problema les causa dificultades todos los días, puede tratarse de un punto de dolor.
- Si dicen que es interesante pero no urgente, probablemente sea un punto de deseo.
- Si ya usan una solución y no están satisfechas, existe una oportunidad.

**Pregunta clave:** ¿qué método utilizan actualmente para resolver el problema?

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

**Casos:**

- Las personas con diabetes controlan su dieta mediante experiencia y conjeturas, un método muy rudimentario: existe una gran oportunidad.
- Quienes siguen una dieta común utilizan Boohee Health, un producto maduro con satisfacción media: hay margen para segmentar verticalmente.
- Los estudiantes comercian objetos usados mediante grupos de WeChat y varias herramientas: integrarlas puede aportar valor.

**El método más eficaz: preventa o señal**

**Pasos:**

- Crea una página de destino sencilla que describa el concepto del producto.
- Añade un botón de preventa o reserva.
- Comprueba cuántas personas pagan; incluso un yuan cuenta.

**Criterios de decisión:**

- Más del 10 % paga una señal: la necesidad es real y merece inversión.
- Entre el 5 % y el 10 %: la necesidad existe, pero debe afinarse.
- Menos del 5 %: la necesidad puede no ser válida o el concepto presenta problemas.

Muchas personas afirman que comprarían. Las que pagan son el verdadero grupo objetivo.

**Paso 2: comprueba el pago mediante preventa o señal.** Crea una página sencilla, explica la propuesta y añade un botón de reserva. Más del 10 % es una señal fuerte; entre 5 % y 10 % pide ajustes; menos del 5 % contradice la idea actual.

**Paso 3: estima el mercado.**

```text
Potential market size = target user count × willingness to pay × average order value
```

En un mercado universitario de segunda mano, por ejemplo: 40 millones de estudiantes × 50 % con necesidad × 10 % que usaría la plataforma × dos operaciones × 100 yuanes × 5 % de comisión equivale a unos 20 millones de yuanes anuales.

- Usuarios objetivo: 40 millones de estudiantes universitarios en China.
- Con necesidad de compraventa de segunda mano: 50 %, es decir, 20 millones.
- Dispuestos a utilizar la plataforma: 10 %, es decir, 2 millones.
- Frecuencia anual: dos operaciones.
- Comisión de la plataforma: 5 %.
- Valor medio del pedido: 100 yuanes.
- Mercado potencial: 2 000 000 × 2 × 100 × 5 % = 20 millones de yuanes al año.

**Paso 4: interpreta el tamaño.** Más de mil millones de yuanes es un mercado grande; entre cien millones y mil millones puede sostener un negocio especializado; menos de cien millones puede encajar mejor como proyecto pequeño o actividad secundaria.

- Más de mil millones de yuanes: un mercado grande que merece explorarse.
- Entre cien millones y mil millones: un mercado mediano o pequeño cuyo techo resulta visible.
- Menos de cien millones: un nicho apropiado para un negocio secundario o pequeño y especializado.

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

- La mayoría de los proyectos iniciales no cuentan con barreras claras.
- Esto no impide empezar; la clave consiste en avanzar con rapidez.
- Primero se ocupa una posición y después se construyen las barreras.

### Apéndice B: segmentación horizontal de usuarios

No intentes servir a «todos los usuarios de X». Enumera segmentos y evalúa intensidad del dolor, disposición a pagar, tamaño, competencia y cuánto conoces al grupo.

**Paso 1: enumera todos los segmentos de usuarios posibles**

Para el concepto de producto, anota todos los grupos que podrían utilizarlo.

**Paso 2: evalúa el valor comercial de cada grupo**

| Dimensión de evaluación | Descripción |
| --- | --- |
| Intensidad del dolor | ¿La necesidad del grupo es un dolor o un deseo? |
| Disposición a pagar | ¿Cuánto pagaría por una solución? |
| Tamaño del mercado | ¿Cuántas personas forman el grupo? |
| Nivel de competencia | ¿Las soluciones actuales resultan satisfactorias? |
| Conocimiento del grupo | ¿Comprendes a estas personas y tienes canales para llegar a ellas? |

**Paso 3: elige un grupo para analizarlo en profundidad**

Escoge aquel cuyo dolor sea más intenso, tenga mayor disposición a pagar, conozcas mejor y afronte una competencia relativamente menor.

::: tip Ejemplo de segmentación

**Concepto de producto:** aplicación de gastos

| Grupo para una app de gastos | Dolor | Pago | Tamaño | Competencia |
| --- | --- | --- | --- | --- |
| Empleados | Registrar es molesto | Bajo | Grande | Alta |
| Propietarios de pequeñas empresas | Mezclan gastos personales y de empresa | Alto | Medio | Media |
| Autónomos | Ingresos variables y flujo de caja incierto | Alto | Medio | Media |
| Padres de estudiantes en el extranjero | No saben en qué se gasta el dinero | Alto | Pequeño | Baja |

Escoge el grupo con dolor intenso, pago probable, acceso real y competencia manejable. En el ejemplo, los padres de estudiantes internacionales ofrecen un problema más concreto que el usuario general.

:::

### Apéndice C: profundización vertical del escenario

Después de encontrar el grupo, no debemos detenernos en una sola función. Necesitamos comprender su **escenario completo**.

**Paso 1: describe un día entero de la persona**

Describe un día de la persona.

**Paso 2: analiza los dolores de cada situación**

Identifica el problema de cada momento.

**Paso 3: encuentra los puntos de contacto emocionales**

Señala emociones como miedo, ansiedad, impotencia, soledad, enfado o arrepentimiento.

**Paso 4: reconstruye el valor**

Reconstruye el valor a partir del escenario completo.

::: tip Ejemplo de profundización

**Grupo de usuarios:** madres después del parto

| Hora | Escenario de una madre reciente | Problema | Emoción |
| --- | --- | --- | --- |
| 6:00 | El bebé se acaba de dormir | No sabe qué movimiento es seguro | Miedo |
| 10:00 | Sostiene al bebé y le duele la espalda | Tiene las manos ocupadas | Ansiedad |
| 15:00 | Quiere entrenar, pero está agotada | No sabe si debe hacerlo | Impotencia |
| 20:00 | Por fin tiene tiempo y se mira al espejo | Siente que no se recuperará | Tristeza |
| A largo plazo | Nadie parece comprenderla | Cree que está sola | Soledad |

La nueva propuesta no es un «rastreador de ejercicio», sino un entrenador de recuperación acompañado de apoyo emocional.

:::

### Apéndice D: más transformaciones de una idea común

#### De «app de gastos» a «gestor de dinero para estudiar en el extranjero»

**Idea común:** aplicación de contabilidad automática que conecta tarjetas y clasifica los gastos.

**Problema:** ya existen SuiShouJi, WaCai y las facturas de Alipay.

**Segmentación horizontal:**

- Los padres de estudiantes en el extranjero quieren saber cuánto gastan sus hijos y si exceden el presupuesto.

**Profundización vertical:**

- El dolor no es llevar las cuentas, sino la **pérdida de control**: desconocer cuánto gasta el hijo y adónde va el dinero.
- Cada mes reciben la factura de la tarjeta, pero el hijo no explica los gastos por iniciativa propia.

**Concepto reconstruido:** «Gestor de gastos en el extranjero», que no solo contabiliza, sino que permite ver con claridad los gastos del hijo.

**Funciones principales:**

- Sincronización de los gastos en tiempo real.
- Alertas de exceso de presupuesto.
- Informes mensuales de análisis de gastos.
- Comparación con estudiantes parecidos, por ejemplo: «El gasto está un 20 % por encima de la media».

#### De «temporizador Pomodoro» a «prueba de trabajo remoto»

**Idea común:** una aplicación Pomodoro para ayudar a concentrarse.

**Problema:** los teléfonos ya ofrecen estadísticas de uso, además de Forest y Pomodoro Todo.

**Segmentación horizontal:**

- Los trabajadores remotos necesitan demostrar a sus responsables que realmente trabajan.

**Profundización vertical:**

- El dolor no es la falta de concentración, sino una **crisis de confianza**: si el responsable no puede ver el trabajo, resulta difícil demostrarlo.
- Al final de cada jornada, el responsable pregunta por los avances y no existen pruebas claras.

**Concepto reconstruido:** «Prueba de trabajo remoto», que ayuda a construir confianza con la empresa.

**Funciones principales:**

- Seguimiento automático del tiempo de trabajo.
- Informes de productividad.
- Resúmenes de actividad en pantalla que protegen la privacidad.
- Informe diario generado y enviado automáticamente al responsable.

#### De «venta de libros usados» a «biblioteca de álbumes infantiles»

**Idea común:** una plataforma para intercambiar libros usados.

**Problema:** ya existen mercados como Duozhuayu, Xianshu y Kongfuzi.

**Segmentación horizontal:**

- Las madres acumulan álbumes ilustrados que sus hijos ya han leído, pero comprar nuevos resulta caro.

**Profundización vertical:**

- El dolor no es que los libros sean caros, sino su **ciclo de vida breve**: los libros de los tres años dejan de servir a los cuatro.
- La casa se llena de libros que el niño ya no lee, aunque tirarlos parece un desperdicio.

**Concepto reconstruido:** «Biblioteca de álbumes ilustrados a domicilio», que alquila el derecho de uso en vez de vender libros usados.

**Funciones principales:**

- Suscripción con cinco libros apropiados para la edad cada mes; se devuelven tras leerlos y se reciben otros.
- Seguimiento del progreso de lectura.
- Recomendaciones adecuadas para la edad.
- Garantía de desinfección.

### Apéndice E: cinco pasos para afinar un concepto con IA

Mediante varias rondas de conversación con IA, una idea común puede convertirse poco a poco en un concepto de producto preciso y realizable.

**Acciones:**

- Describe la idea inicial, aunque todavía sea imprecisa.
- Explica qué te preocupa, por ejemplo una competencia intensa o la falta de diferenciación.

**Prompt:**

```text
Quiero crear [concepto de producto],
pero he detectado [problema o preocupación].
```

**Acciones:**

- Pide a la IA que prepare el plan del producto mínimo viable.
- Examina la dificultad técnica y el coste.
- Define indicadores de validación.

**Prompt:**

```text
Ayúdame a:
1. Planificar un MVP
2. Proponer una implementación técnica concreta
3. Estimar el coste
4. Definir indicadores de validación
```

**Acciones:**

- ¿Qué dificultad presenta la implementación técnica?
- ¿Cuánto costará producir el contenido?
- ¿Cuánto costará la promoción?
- ¿Qué dificultad tendrá la captación de usuarios?

**Prompt:**

```text
Me preocupa:
1. [Preocupación 1]
2. [Preocupación 2]
3. [Preocupación 3]
```

**Acciones:**

- Solicita recomendaciones concretas para cada preocupación.
- Compara varias opciones y escoge la más adecuada.
- Estima el coste de cada opción.

**Prompt:**

```text
Propón soluciones concretas para estas preocupaciones.
```

**Acciones:**

- Organiza un plan de acción claro.
- Define indicadores de validación.
- Si no se alcanzan, ajusta la dirección a tiempo.

**Prompt:**

```text
Ayúdame a organizar un plan de acción claro.
```

::: tip Técnicas clave

- **Varias rondas:** no esperes una respuesta perfecta de un solo intercambio; mejora el resultado de forma iterativa.
- **Aportar información:** comparte con la IA observaciones, experiencias y comentarios de personas cercanas.
- **Cuestionar a la IA:** señala a tiempo las recomendaciones que no resulten razonables.
- **Centrarse en la ejecución:** la conversación debe terminar en un plan de acción concreto.

:::

---

### Apéndice F: lista de comprobación de la necesidad

Antes de invertir tiempo en el desarrollo, utiliza esta lista para validar la idea. La pregunta central es: <strong>¿pagará el usuario por resolverlo?</strong>

::: tip Lista de comprobación de la necesidad

**1. Claridad del perfil de usuario**

- ☐ ¿Puedes describirlo en una frase?
- ☐ ¿Conoces su alternativa actual?
- ☐ ¿Puedes narrar el escenario con detalles?
- ☐ ¿Tiene capacidad de pago?

**2. Intensidad del punto de dolor**

- ☐ ¿Qué tiempo, dinero o energía pierde hoy?
- ☐ ¿Qué ocurre si no lo resuelve?
- ☐ ¿Ya busca una solución?
- ☐ ¿Cuánto pagaría realmente?

**3. Diferenciación de la solución**

- ☐ ¿Qué ventaja tienes frente a la alternativa?
- ☐ ¿Basta para que la persona cambie?
- ☐ ¿Una plataforma grande puede copiarla con facilidad?
- ☐ ¿La diferencia justifica el precio?

**4. Viabilidad del modelo de negocio**

- ☐ ¿Has probado el pago y el precio?
- ☐ ¿Cuánto cuesta adquirir un usuario?
- ☐ ¿El valor del ciclo de vida del usuario (LTV) cubre el coste de adquisición (CAC)?
- ☐ ¿Existen otras fuentes de ingresos, como publicidad, servicios avanzados o clientes empresariales?

**5. Plan de validación rápida**

- ☐ ¿Puedes crear un prototipo en una o dos semanas?
- ☐ ¿Puedes entrevistar a diez usuarios?
- ☐ ¿Puedes diseñar un experimento para la hipótesis principal?
- ☐ ¿Puedes pedir una señal por adelantado para comprobar la disposición a pagar?

:::

<strong>No preguntes «¿usarías este producto?».</strong> Este tipo de pregunta suele producir falsos positivos.

<strong>Pregunta en su lugar:</strong>

- «¿Cómo resuelves este problema ahora?», para conocer el comportamiento real.
- «¿Cuántas veces te ha molestado durante la última semana?», para conocer la frecuencia.
- «Si una solución exigiera cambiar tus hábitos actuales, ¿estarías dispuesto a hacerlo?», para conocer el coste del cambio.
- «Si costara XX yuanes, ¿la comprarías?», para conocer la disposición a pagar.

**La mejor validación:** pedir al usuario que adelante una señal. Muchas personas dicen que pagarían; las que entregan dinero son las usuarias objetivo reales.

**Indicadores clave:**

- Más del 10 % acepta pagar una señal: la necesidad es real y merece inversión.
- Entre el 5 % y el 10 %: la necesidad existe, pero hay que afinar el concepto.
- Menos del 5 %: la necesidad no se sostiene o el concepto de producto tiene un problema.

---

## Resumen del capítulo

En este capítulo seguimos la historia de Xiao Ming para examinar ideas desde la perspectiva de producto. La pregunta central se mantuvo en todo momento: <strong>¿pagará el usuario por resolverlo?</strong>

::: info Puntos clave

**1. Tres criterios de una necesidad real:**

- El usuario está dispuesto a pagar; es el criterio más importante.
- El usuario está dispuesto a cambiar su comportamiento.
- Si no encuentra una solución, sufrirá una pérdida importante.

**2. El recorrido desde una idea común hasta un producto por el que alguien paga:**

- <strong>Segmentación horizontal:</strong> encontrar un grupo específico; cuanto más preciso sea, mayor puede ser la disposición a pagar.
- <strong>Profundización vertical:</strong> comprender el escenario completo y atender la emoción, no solo la función.
- <strong>Reconstrucción del valor:</strong> pasar de herramienta a solución y establecer una razón clara para pagar.

**3. Evitar las trampas de las falsas necesidades:**

- Resolver un falso dolor, es decir, un deseo en lugar de un punto de dolor.
- Elegir un mercado tan pequeño que no sostenga el modelo de negocio.
- Proponer una solución más compleja que el propio problema.

**4. Comprobar la disposición a pagar:**

- Entrevistar en profundidad a diez usuarios objetivo.
- Solicitar una señal por adelantado para comprobar la intención real.
- Invertir solo si más del 10 % está dispuesto a adelantarla.

**5. Afinar el concepto mediante conversaciones con IA:**

- Trabajar en varias rondas y mejorar el plan de forma iterativa.
- Centrarse en la ejecución y terminar con acciones concretas.
- Definir indicadores de validación y ajustar la dirección a tiempo.

:::

**Recordemos:** un buen responsable de producto no inventa necesidades desde cero. Encuentra necesidades reales <strong>ignoradas, infravaloradas o atendidas de forma incorrecta</strong> y descubre una manera por la que el usuario esté dispuesto a pagar.

El siguiente paso será ordenar la dirección con el modelo del doble diamante y comprobarla con Jobs to Be Done y The Mom Test. Solo después de reunir esas pruebas empezaremos a construir el prototipo.
