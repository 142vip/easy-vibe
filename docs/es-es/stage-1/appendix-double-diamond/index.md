---
title: 'Modelo Double Diamond: primero haz lo correcto, luego hazlo bien'
description: 'Comprende las cuatro etapas de Discover, Define, Develop, Deliver para evitar crear prototipos antes de entender bien el problema.'
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'
const duration = 'Aproximadamente <strong>1.5 horas</strong>'
</script>

# Modelo Double Diamond: primero haz lo correcto, luego hazlo bien

<a id="top-dd"></a>

## Resumen del capitulo

<ChapterIntroduction
  :duration="duration"
  :tags="['Double Diamond', 'Pensamiento de diseno', 'Analisis de necesidades', 'Diseno de soluciones']"
  coreOutput="1 definicion de problema mas clara y 1 punto de entrada de validacion mas razonable"
  expectedOutput="Dejar de precipitarse a dibujar prototipos, sabiendo primero pensar claramente en el problema y luego comparar soluciones"
>

Muchas personas, la primera vez que hacen un producto, caen en la trampa mas facil: no es que "no se esfuercen lo suficiente", sino que entran demasiado rapido en la solucion.

Apenas les viene una direccion a la mente, ya estan pensando en como dibujar la pagina, donde poner los botones, si conectar IA, si hacer login y registro, con que herramienta hacer el prototipo. Despues de un rato de trabajo, descubren que el problema mas fundamental no se ha pensado claramente: el usuario realmente tiene este punto de dolor? Vale la pena resolver este problema ahora? Crees que estas avanzando en el proyecto, pero en realidad solo estas acelerando en la direccion equivocada.

El modelo Double Diamond existe precisamente para evitar esta situacion.

Su recordatorio mas valioso es: **"hacer lo correcto" y "hacerlo bien" son dos etapas completamente diferentes.** Si aun no has aclarado el problema y te precipitas a hacer prototipos, normalmente solo haras la direccion equivocada mas completa.

</ChapterIntroduction>

::: info SOP minimo
**Objetivo**: Despues de leer, sabras mejor cuando hacer productos, cuando pensar primero en el problema y cuando empezar a pensar en soluciones y prototipos, evitando precipitarte en la direccion equivocada desde el principio.

**Accion**: Sigue los cuatro pasos `Discover -> Define -> Develop -> Deliver`, haciendo solo lo que corresponde a la etapa actual en cada paso.

**Resultado**: Obtendras una definicion de problema mas clara, varias soluciones comparables y una version minima verificable.

**Enlaces rapidos**: [Que es el Double Diamond](#dd-what) · [Primer diamante](#dd-first) · [Como te ayuda la IA](#dd-ai)
:::

## Aprenderas lo siguiente

1. Que es el modelo Double Diamond, y por que es adecuado para personas sin experiencia al hacer productos
2. Que hacen las cuatro etapas Discover, Define, Develop y Deliver respectivamente
3. Como distinguir entre "ahora debo seguir divergiendo" y "ahora debo empezar a converger"
4. Como usar el modelo Double Diamond en productos de IA, diseno de prototipos y validacion de necesidades

<a id="dd-what"></a>
## [1. Que es exactamente el modelo Double Diamond](#top-dd)

El modelo Double Diamond es un marco clasico de proceso de diseno promovido por el **Design Council** del Reino Unido. Representa un proceso completo de diseno e innovacion como dos formas de diamante consecutivas.

La razon de ser "diamantes" es que cada diamante contiene dos acciones opuestas pero igualmente importantes:

- **Divergencia**: primero abrir el campo de vision, ver mas posibilidades
- **Convergencia**: luego reducir el alcance, tomar decisiones y priorizar

Todo el proceso tiene cuatro pasos:

1. **Discover**: entender ampliamente a los usuarios, problemas, entorno y mercado
2. **Define**: extraer de la gran cantidad de informacion el problema central que realmente vale la pena resolver
3. **Develop**: explorar multiples soluciones alrededor del problema central
4. **Deliver**: filtrar, prototipar, probar y entregar la solucion mas adecuada

Si comprimes estos cuatro pasos en una frase facil de recordar, seria:

- **Primer diamante**: primero aclarar que problema resolver exactamente
- **Segundo diamante**: luego decidir con que solucion resolverlo

Que es exactamente lo que dijiste muy bien:

- **Primer diamante: hacer lo correcto**
- **Segundo diamante: hacerlo bien**

## 2. Por que el modelo Double Diamond es especialmente adecuado para principiantes

El ritmo mas comun de los principiantes al hacer productos suele ser:

- Se les ocurre una idea
- Les parece que esta direccion es genial
- Empiezan inmediatamente a dibujar prototipos
- Haciendo y haciendo, descubren que las funciones son cada vez mas
- Al final no saben que problema estan resolviendo exactamente

El valor del modelo Double Diamond no esta en complicar el proceso, sino en **obligarte a separar "entender el problema" y "disenar la solucion".**

Esto suena muy comun, pero en realidad es muy importante. Porque muchos productos fracasados no es que la ejecucion no fuera seria, sino:

- Eligieron el problema equivocado
- Malentendieron al usuario
- Se bloquearon demasiado pronto en una solucion
- Gastaron mucho tiempo en pulir detalles sin validar la direccion

El modelo Double Diamond te esta recordando constantemente:

- No porque una idea te parezca facil, asumas que el problema ya esta confirmado
- No porque una solucion pueda implementarse, asumas que vale la pena hacerla
- No porque un prototipo parezca completo, asumas que los usuarios realmente lo necesitaran

<a id="dd-first"></a>
## [3. Primer diamante: hacer lo correcto](#top-dd)

El primer diamante se centra en **el problema en si**, no en la solucion.

Puedes entenderlo como una frase: **no te precipites, primero averigua si realmente vale la pena hacerlo.**

### 3.1 Discover: primero abre el espacio del problema

La tarea central de la fase Discover es **investigar ampliamente, no llegar rapido a conclusiones.**

Lo que normalmente se hace en este paso incluye:

- Ver como los usuarios actuan en escenarios reales
- Entrevistar a usuarios potenciales, entender cuando fue la ultima vez que encontraron el problema
- Observar como se las arreglan actualmente
- Ver como manejan la competencia y las soluciones alternativas
- Recoger informacion de mercado, procesos, restricciones y relaciones aguas arriba/aguas abajo

Muchas personas confunden Discover con "ver mas informacion". Pero lo mas critico es: **tienes que entender a las personas y los escenarios, no solo buscar un monton de informacion.**

Por ejemplo, si quieres hacer una herramienta de "IA que ayuda a organizar actas de reuniones", en la fase Discover deberias prestar mas atencion a:

- Despues de la reunion, donde duele mas exactamente al usuario
- Es dificil tomar notas, organizarlas o sincronizarlas
- Ahora escriben ellos mismos, le piden al becario, escuchan la grabacion, o simplemente no organizan
- Que escenarios de reunion necesitan mas actas y cuales no las necesitan en absoluto

El objetivo mas importante de este paso no es llegar a una respuesta, sino **no asumir demasiado pronto que ya conoces la respuesta.**

### 3.2 Define: extraer el problema central de un monton de informacion

Si Discover abre el campo de vision, Define empieza a cerrarlo.

Lo que hay que hacer en la fase Define no es mantener todas las observaciones, sino preguntar:

- Cual es el problema que realmente merece la pena resolver primero
- Que problema aparece con mas frecuencia, es el mas doloroso y el mas valioso
- En que escenario unico debemos centrarnos en la primera version

El nucleo de este paso es converger un tema amplio en una definicion de problema clara.

Por ejemplo, al principio dices:

> Quiero hacer una herramienta con IA para mejorar la eficiencia de las reuniones.

En la fase Define, una mejor expresion podria ser:

> Primero resolvamos el problema de que los equipos de proyecto, despues de reuniones de colaboracion de 30 a 60 minutos, no pueden producir en 10 minutos un acta con tareas pendientes, responsables y fechas limite.

En este punto el problema empieza a aclararse:

- Quien es el usuario
- Cual es el escenario
- Cual es el punto de bloqueo
- Cual es el criterio de exito

La esencia de Define es **converger de "hay muchos problemas" a "que problema resolver primero esta vez".**

## 4. Segundo diamante: hacerlo bien

Cuando completas el primer diamante, solo entonces es realmente apropiado entrar en el segundo. Porque ahora no estas resolviendo una direccion vaga, sino un problema concreto que ha sido convergido.

### 4.1 Develop: diverge soluciones alrededor del problema central

El foco de la fase Develop es **explorar multiples soluciones posibles alrededor del mismo problema.**

Nota, la divergencia aqui es diferente de la fase Discover.

- La divergencia de Discover explora el espacio de problemas
- La divergencia de Develop explora el espacio de soluciones

Por ejemplo, en el caso de las actas de reuniones, al llegar a la fase Develop, puedes empezar a pensar:

- Hacer una herramienta web o un plugin de reuniones
- Procesar despues de subir la grabacion o registrar en tiempo real
- Solo hacer resumenes o enfocarse en extraer tareas pendientes
- Enfatizar la eficiencia individual o la sincronizacion del equipo
- Dar al usuario libertad de edicion o producir directamente plantillas estructuradas

Este paso es ideal para brainstorming y para abrir las soluciones con el equipo.

Pero hay un requisito previo: **todas las soluciones deben servir al mismo problema ya definido.**  
Si el problema no esta claramente definido, Develop facilmente se convierte de nuevo en funciones volando en todas direcciones.

### 4.2 Deliver: elegir la solucion, hacer prototipos, probar y entregar

La fase Deliver es la fase de convergencia del segundo diamante.

Lo que debes hacer aqui no es seguir pensando mas, sino empezar a juzgar:

- Que solucion es mas adecuada para la etapa actual
- Que version es la mas pequena pero mas util
- Que funciones deben hacerse primero y cuales pueden esperar
- Como hacer prototipos, pruebas y validacion a pequena escala

Muchas personas piensan que Deliver equivale a "lanzamiento". Pero su significado mas preciso es: **convertir una solucion en algo que se pueda probar, verificar e iterar.**

Puede ser:

- Un diagrama de flujo de baja fidelidad
- Un prototipo en Figma
- Un MVP funcional
- Una prueba de usuario a pequena escala
- Una version iterada despues de retroalimentacion real

El punto de Deliver no es "entrega perfecta", sino **poner la solucion en un entorno real para verificarla lo antes posible.**

## 5. Una tabla de comparacion facil de recordar

Si siempre te confundes con las cuatro etapas, puedes recordar directamente esta version:

| Etapa | Que estas haciendo | Palabras clave | Productos comunes |
| --- | --- | --- | --- |
| Discover | Entender el problema | Investigacion, observacion, entrevistas, recopilar informacion | Insights de usuarios, notas de escenario, lista de problemas |
| Define | Definir el problema | Extraer, enfocar, priorizar, reescribir el problema | Definicion del problema, prioridades, punto de entrada MVP |
| Develop | Explorar soluciones | Brainstorming, comparacion, cocreacion, conceptos de prototipo | Lista de soluciones, bocetos de flujo, direccion del prototipo |
| Deliver | Verificar soluciones | Prototipos, pruebas, iteracion, entrega | Prototipos, retroalimentacion de pruebas, version optimizada |

Comprimiendolo aun mas:

- **Discover / Define**: resolver "hacer lo correcto"
- **Develop / Deliver**: resolver "hacerlo bien"

## 6. Los errores mas comunes con el modelo Double Diamond

### 6.1 Pasar directamente a Deliver sin Discover

Este es el mas comun. Muchas personas apenas tienen una idea y ya estan dibujando prototipos, escribiendo PRDs, conectando modelos, haciendo paginas.

El problema no es que no trabajes en serio, sino que puede que ni siquiera hayas confirmado si el problema vale la pena resolver.

### 6.2 Discover mucho tiempo, pero nunca llegar a Define

Otro extremo es investigar continuamente, leer informacion constantemente, hacer entrevistas sin parar, pero sin atreverse a converger.

El Double Diamond no es para que diverjas infinitamente, sino para recordarte: despues de la divergencia debes entrar en la evaluacion y priorizacion.

### 6.3 Despues de Define, cambiar el problema a escondidas

Muchos equipos, al llegar a Develop, modifican la definicion del problema para adaptarse a una solucion que es mas facil de implementar.

Esto es peligroso. Porque puede que no estes resolviendo el problema, sino buscando justificaciones para la solucion que te gusta.

### 6.4 Confundir Deliver con "lanzamiento completo"

Deliver no significa que debas completar todo el producto para considerar que ha terminado. Muchas veces, un prototipo que se puede probar o una ronda de pruebas con usuarios reales ya es un buen deliver.

## 7. Como usar el modelo Double Diamond en productos de IA

Los productos de IA son especialmente propensos a caer en la trampa de "las capacidades primero", porque las capacidades del modelo parecen demasiado atractivas. Querras pensar directamente en:

- Deberia conectar multimodalidad?
- Deberia hacer un Agent?
- Deberia anadir workflows?
- Deberia conectar voz, imagen, busqueda en la web?

Pero el modelo Double Diamond te obliga a preguntar primero:

- En que paso exactamente el usuario esta bloqueado
- Este bloqueo requiere SI o SI IA?
- Sin IA, cual es exactamente la mayor debilidad del metodo actual
- Despues de anadir IA, cual es el progreso mas importante

Esto te ayuda a evitar una situacion comun: **capacidades fuertes, valor debil.**

Una secuencia practica es:

1. En la fase Discover, observar como los usuarios manejan las tareas actualmente
2. En la fase Define, escribir el escenario mas doloroso como una definicion de problema clara
3. En la fase Develop, comparar que capacidades de IA sirven mejor a este problema
4. En la fase Deliver, hacer una version minima para que usuarios reales la prueben

## 8. Una plantilla Double Diamond que puedes usar directamente

Si estas haciendo tu propio producto, puedes seguir esta secuencia:

### Discover

- Quien es el usuario que he observado?
- Cuando fue la ultima vez que encontraron este problema?
- Como lo resuelven ahora?
- Cual es la parte mas molesta, lenta o que menos confianza les da?

### Define

- De todos estos problemas, cual merece la pena resolver primero?
- Que escenario es el mas frecuente o critico?
- A quien serviremos primero en la primera version, y que problema resolveremos?
- Despues de resolverlo exitosamente, como cambiara el estado del usuario?

### Develop

- Para este problema, que soluciones posibles hay?
- Que soluciones son las mas ligeras, rapidas y faciles de verificar?
- Que es imprescindible y que puede esperar?

### Deliver

- Cual es lo minimo que podemos entregar para verificar esta direccion?
- Es un diagrama de flujo, un prototipo o un MVP?
- A quien necesitamos pedir que pruebe?
- Despues de la prueba, como decidimos si continuar, modificar o abandonar?

## 9. Un ejemplo que incluso un principiante puede entender

Supongamos que quieres hacer una herramienta de IA para "ayudar a universitarios a preparar su curriculum de busqueda de empleo".

Muchas personas entrarian directamente en el segundo diamante, pensando:

- Deberia hacer embellecimiento con un clic?
- Deberia hacer reescritura inteligente?
- Deberia hacer matching automatico con la descripcion del puesto?
- Deberia generar una presentacion personal?

Pero siguiendo el modelo Double Diamond, un mejor proceso seria:

### Primer diamante

**Discover**

- Hablar con graduados recientes sobre cuando fue la ultima vez que modificaron su curriculum
- Ver como pasan de un curriculum viejo a una nueva version
- Entender si lo que mas les frustra es "no saber escribir", "no saber modificar" o "no saber juzgar si esta bien"

**Define**

- Finalmente converger en un problema mas concreto:
- No es "los universitarios no saben hacer curriculums"
- Sino "los estudiantes que envian su primera candidatura de practica tienen dificultades para reescribir sus experiencias existentes de forma adaptada al puesto, por lo que retrasan el envio"

### Segundo diamante

**Develop**

- Pensar varias soluciones: biblioteca de plantillas, reescritura con IA, comparacion con el puesto, puntuacion del curriculum, referencia de casos

**Deliver**

- La primera version solo hace "reescribir los bullet points de experiencias segun la descripcion del puesto"
- Probar con 5 estudiantes, ver si enviaran su primera version mas rapido

Descubriras que, una vez que el primer diamante se hace solidamente, el segundo diamante se vuelve mucho mas claro.

## 10. Resumen

Lo mas poderoso del modelo Double Diamond es que te ayuda a descomponer una masa confusa en cuatro acciones mas claras:

- Primero diverge para entender el problema
- Luego converge para definir el problema
- Luego diverge para explorar soluciones
- Finalmente converge para entregar la solucion

No te hace mas lento, sino que te hace **evitar muchos desvios que parecen ocupados pero van en la direccion equivocada.**

Especialmente en la era de la IA, donde hacer cosas se vuelve cada vez mas rapido, el modelo Double Diamond se vuelve aun mas importante. Porque cuando "hacerlo" es cada vez mas facil, la capacidad verdaderamente escasa se convierte en: **estas resolviendo un problema que vale la pena resolver, y lo estas haciendo de la forma adecuada.**

Recuerda solo esta frase:

**Primero haz lo correcto, luego hazlo bien.**

<a id="dd-ai"></a>
## [11. Como usar la IA para recorrer el proceso Double Diamond](#top-dd)

El modelo Double Diamond en si no es una herramienta de IA, pero la IA es muy adecuada para actuar como "acelerador" en las cuatro etapas. La clave no es que la IA tome decisiones por ti, sino que te ayude a expandir tu campo de vision, organizar informacion, comparar soluciones y generar materiales de validacion.

### 11.1 En la fase Discover, usar la IA para hacer una primera preparacion de informacion

Antes de las entrevistas e investigacion formales, puedes pedir a la IA que haga un barrido ligero de problemas, como:

- Que soluciones alternativas comunes existen en el mercado
- De que se quejan mas los usuarios en comunidades publicas
- En que escenarios y grupos de personas es mas frecuente este problema
- Que suelen ignorar los productos existentes

Este paso no puede sustituir la investigacion real, pero es ideal para construir rapidamente un mapa de problemas.

Una entrada simple para principiantes podria ser:

```text
Quiero hacer una herramienta para ayudar a universitarios a modificar su curriculum.
No me des ideas de funciones todavia, primero ayudame a ver que problemas encuentra mas a menudo la gente con este tema.
```

La IA podria responder:

```text
Mapa inicial de problemas:

1. No saber que experiencias incluir
2. No saber como adaptar el curriculum a cada puesto
3. Modificar muchas versiones sin certeza de si esta bien
4. Necesitar que alguien lo revise, pero no querer molestar siempre
5. Por la incertidumbre, posponer continuamente el envio
```

La funcion de este tipo de resultado no es sacar conclusiones por ti, sino ayudarte a entrar mas rapido en Discover.

### 11.2 En la fase Define, dejar que la IA te ayude a converger la definicion del problema

Despues de recoger mucha informacion, lo mas dificil para mucha gente es comprimir el problema en una frase verdaderamente clara. Puedes pasar tus notas de investigacion a la IA y pedirle que las comprima en varias definiciones de problema candidatas:

```text
A continuacion estan los comentarios de usuarios y notas de investigacion que he recogido en la fase Discover:
[pega el contenido]

Por favor ayudame a hacer tres cosas:
1. Identificar los patrones de problemas que aparecen con mas frecuencia
2. Organizar 3 problemas que merezca la pena priorizar, segun frecuencia, intensidad de dolor y verificabilidad
3. Escribir cada problema como una definicion concreta en una frase
```

Asi te sera mas facil entrar en Define, en lugar de quedarte atrapado en "hay muchos problemas".

Puedes incluso hacer la entrada muy simple:

```text
Los problemas que he recogido son:
1. La gente no sabe que poner en el curriculum
2. La gente no sabe como modificarlo
3. La gente siempre siente que no esta bien modificado y no se atreve a enviarlo

Ayudame a ver, cual problema es mas adecuado para resolver primero en la primera version.
```

La IA podria responder:

```text
Problema sugerido para priorizar:

"Los estudiantes que envian su primera candidatura de practica no estan seguros de si su curriculum ha alcanzado el nivel necesario para enviar, por lo que lo modifican repetidamente y retrasan el envio."

Razones:
1. Este problema es mas concreto
2. Puede explicar el comportamiento de procrastinacion
3. Es mas facil disenar una version pequena para verificar
```

Este tipo de resultado es muy util porque te ayuda a converger de un monton de problemas vagos a una definicion mas como un punto de partida para un MVP.

### 11.3 En la fase Develop, usar la IA para diverger multiples soluciones

Muchas personas, una vez definido el problema, se fijan solo en la primera solucion que les viene a la mente. La IA es ideal en este paso para forzarte a diverger:

```text
Ya he definido un problema central: [tu definicion del problema]
Por favor no me des una respuesta final directamente, sino que propongas 2-3 direcciones de solucion desde cada uno de estos angulos:
1. El MVP mas ligero
2. La solucion mas adecuada para verificar la necesidad
3. La solucion mas adecuada para mejorar la experiencia
4. Una solucion que no dependa de IA
5. Una solucion que dependa de IA
Finalmente, compara las ventajas, riesgos y costos de verificacion de cada solucion.
```

Asi no te ataras demasiado pronto a una unica solucion.

Una entrada simple podria ser:

```text
Mi definicion de problema ahora es:
"Los universitarios no estan seguros de si su curriculum ya se puede enviar, por lo que siguen posponiendo el envio."

Por favor ayudame a pensar en 4 soluciones diferentes, no me des solo una.
```

La IA podria responder:

```text
Solucion 1: Checklist de "preparacion para enviar" del curriculum
Solucion 2: Reescritura adaptada segun la descripcion del puesto
Solucion 3: Subir el curriculum y recibir alertas de riesgo
Solucion 4: Proporcionar comparacion con casos excelentes para ayudar al usuario a juzgar la distancia
```

En este punto te sera mas facil entrar en "comparar soluciones", en lugar de fijarte solo en la reescritura con IA desde el principio.

### 11.4 En la fase Deliver, usar la IA para generar textos de prototipos y materiales de prueba

Cuando entras en la fase Deliver, la IA es muy adecuada para acelerar estos trabajos:

- Generar textos de pagina para prototipos de baja fidelidad
- Organizar un guion de prueba de usuario
- Generar multiples versiones comparables de titulos, botones y descripciones
- Organizar la retroalimentacion y la lista de problemas despues de las pruebas

Por ejemplo, puedes pedir a la IA que genere un guion de prueba de usuario de 20 minutos, o que te ayude a resumir la retroalimentacion de 5 usuarios en criterios de "continuar / modificar direccion / pausar".

Una entrada minima podria ser:

```text
He hecho un prototipo muy simple:
el usuario sube su curriculum y el sistema le indica que partes aun no estan listas para enviar.

Por favor ayudame a generar un guion de prueba de usuario de 15 minutos.
```

La IA podria responder:

```text
Guion de prueba de 15 minutos:

1. Primero pedir al usuario que describa su ultima experiencia enviando un curriculum
2. Dejar que el usuario complete independientemente la subida del curriculum
3. Observar si entiende los resultados de la retroalimentacion
4. Preguntar: de estas indicaciones, cuales son las mas utiles y cuales te confunden
5. Preguntar: antes del proximo envio, te gustaria usar esto de nuevo?
```

Este tipo de resultado es muy practico porque te ayuda a pasar de "ya termine el prototipo" a "como lo pruebo ahora".

### 11.5 Dejar que la IA actue como "guardian de etapas"

El problema mas comun del modelo Double Diamond es que la gente se salta etapas. Puedes pedir directamente a la IA que actue como guardian, recordandote en que etapa estas realmente:

```text
Por favor actua como coach de proceso de producto.
A continuacion esta el estado actual de mi proyecto: [tu descripcion]
Por favor juzga en que etapa estoy mas: Discover, Define, Develop o Deliver.
Y dime:
1. Me he saltado demasiado pronto a la siguiente etapa?
2. Cual es la accion mas importante que debo completar en la etapa actual?
3. Que cosas no debo hacer ahora?
```

Esto es especialmente util para principiantes, porque es facil "empezar a dibujar prototipos antes de haber aclarado el problema".

## 📚 Tareas

<StageAssignmentCard title="Organiza tu idea con el Doble Diamante">

Por favor completa las siguientes tareas basandote en el contenido anterior:

1. Elige una idea de producto que quieras hacer recientemente, y escribe un borrador de sus cuatro pasos: Discover, Define, Develop, Deliver
2. En la fase Define, obligate a comprimir el problema en una frase concreta
3. En la fase Develop, lista al menos 3 soluciones diferentes, en lugar de fijarte solo en la primera que se te ocurra
4. En la fase Deliver, escribe una version minima de verificacion que puedas entregar en una semana

</StageAssignmentCard>

## Lectura adicional

Este articulo se basa principalmente en los materiales oficiales del Design Council sobre el Double Diamond, adecuados para seguir profundizando:

- [Design Council: The Double Diamond](https://www.designcouncil.org.uk/our-resources/the-double-diamond/)
- [Design Council: Framework for Innovation](https://www.designcouncil.org.uk/our-work/skills-learning/tools-frameworks/framework-for-innovation-design-councils-evolved-double-diamond/)
- [Design Council: History of the Double Diamond](https://www.designcouncil.org.uk/our-resources/the-double-diamond/history-of-the-double-diamond/)
