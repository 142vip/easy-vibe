---
title: 'Usa Jobs to Be Done para encontrar lo que los usuarios realmente quieren lograr'
description: 'Comprende que los usuarios no compran funciones, sino que "contratan" tu producto para completar un progreso en un escenario especifico.'
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'
</script>

# Usa Jobs to Be Done para encontrar lo que los usuarios realmente quieren lograr

<a id="top-jtbd"></a>

Supongamos que queremos crear una herramienta para redactar actas de reuniones. Si partimos de las funciones, enseguida podemos enumerar transcripción, resumen, extracción de tareas y exportación de documentos. Sin embargo, esas funciones no responden a una pregunta más básica: ¿por qué querría alguien utilizarla después de una reunión?

Jobs to Be Done (JTBD) responde desde la «tarea que el usuario quiere completar». Se ocupa de la situación concreta, el resultado esperado y la forma de resolverlo actualmente, sin dar por sentado que una función determinada será útil.

Este capítulo presenta primero los conceptos fundamentales de JTBD y después explica cómo convertir una descripción funcional en una hipótesis de necesidad que podamos validar.

<a id="jtbd-what"></a>
## [1. De las funciones a la tarea](#top-jtbd)

Jobs to Be Done se abrevia comunmente como **JTBD**. Su idea central esta relacionada con la expresion clasica promovida por el equipo de Clayton Christensen: **los usuarios "contrataran" un producto para completar una tarea.**

La "tarea" aqui no es una accion superficial de una lista de pendientes, sino un **progreso** que el usuario espera que ocurra en su estado. Por ejemplo:

- No es "quiero una herramienta de actas con IA", sino "quiero tener los puntos clave, las tareas pendientes y los responsables organizados en 10 minutos despues de la reunion, sin depender de la memoria para completar las notas"
- No es "quiero una app de contabilidad", sino "quiero saber en que se me va el dinero, para no estar ansioso a fin de mes"
- No es "quiero un optimizador de curriculum", sino "quiero enviar un curriculum decente con mas confianza, sin dudar cada vez de que lo he escrito mal"

Entonces, **JTBD no se centra en como se ve el producto, sino en por que el usuario lo necesita en este momento.**

Es por eso que muchos productos aparentemente diferentes en realidad compiten por el mismo job. El usuario quiere "no aburrirse en el camino al trabajo", y los objetos que puede contratar pueden ser videos cortos, podcasts, juegos, chat, o incluso echar una cabezadita. El usuario quiere "entender rapidamente un PDF muy largo", y los objetos que puede contratar pueden ser una herramienta de resumen con IA, un becario, un colega, leerlo a duras penas, o simplemente no leerlo.

Una vez que miras los problemas desde esta perspectiva, descubres que tu verdadero competidor muchas veces no es solo "otra app parecida a la tuya", sino **todas las soluciones alternativas aceptables para el usuario**.

<figure class="field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:Mapa_de_viaje_de_clientes.png" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/jtbd/customer-journey-map.png" alt="Mapa del recorrido del cliente que registra por etapas sus necesidades, actividades, herramientas, emociones y oportunidades de producto" loading="lazy" />
  </a>
  <figcaption><strong>La tarea sucede a lo largo de un proceso.</strong> Este mapa divide el uso de una herramienta en línea en varias etapas y anota en cada una las necesidades, las actividades reales, las herramientas empleadas, las emociones y las oportunidades. Una investigación JTBD también debe seguir ese proceso, en vez de preguntar únicamente qué funciones gustan al usuario. Autor: Advenio; fuente: <a href="https://commons.wikimedia.org/wiki/File:Mapa_de_viaje_de_clientes.png" target="_blank" rel="noreferrer">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.</figcaption>
</figure>

## 2. Diferencias respecto al perfil de usuario y la lista de funciones

Muchos principiantes, al hacer analisis de necesidades, primero escriben un perfil de usuario: 25 anos, mujer, ciudad de primer nivel, oficinista, le gustan las herramientas de eficiencia, dispuesta a probar productos nuevos. Esta informacion no se puede decir que sea completamente inutil, pero normalmente **no es suficiente para explicar por que una persona tomara accion en este momento.**

JTBD se preocupa mas por las siguientes preguntas:

- En que escenario decide buscar una solucion
- Que es exactamente lo que le tiene bloqueado en ese momento
- Que quiere llevar al siguiente nivel
- Que metodo torpe esta usando actualmente para arreglarselas
- Si las cosas se resuelven bien, que resultado le hara sentir que "valio la pena"

Es decir, **el perfil de usuario es mas como "quien es probablemente esta persona", mientras que JTBD es mas como "que quiere realmente lograr esta persona ahora".**

Asimismo, las listas de funciones tambien pueden desviar a uno. El usuario dice "quiero exportar a Word", "quiero reescritura con IA", "quiero entrada de voz"; todo esto son solo expresiones superficiales. JTBD seguira preguntando:

- Por que necesitas exportar a Word ahora, y no a PDF?
- Quieres reescribir, es porque el estilo es malo, o porque necesitas adaptarlo a diferentes destinatarios?
- Quieres entrada de voz, es porque te da pereza escribir, o porque frecuentemente estas caminando, conduciendo, o necesitas registrar justo despues de una reunion?

Muchas veces, **la funcion es solo una traduccion temporal del job**. Si solo recoges funciones, es facil hacer un producto donde "agregas lo que el usuario dice"; si puedes ver el job detras, tienes mas oportunidades de hacer una solucion verdaderamente comoda y competitiva.

## 3. Ejemplo: actas de reuniones

Primero no te apresures a pensar en productos complejos de IA; empecemos con un ejemplo de la vida cotidiana.

Supongamos que alguien siempre llega tarde para desayunar antes de salir de casa por la manana, y a menudo compra un sandwich y un cafe en la entrada del metro. En la superficie, "compra" un desayuno; pero si lo miramos con JTBD, lo que realmente quiere lograr puede ser:

- Resolver una comida de la forma que menos esfuerzo mental requiera en una manana con prisa
- Evitar llegar a la oficina muerto de hambre
- No retrasar el ritmo de desplazamiento por desayunar

En este caso, el usuario no esta contratando "un sandwich de una marca fija", sino una solucion que le ayude a avanzar su manana sin problemas. Si la tienda de conveniencia de al lado es mas rapida, mas cercana y mas estable, probablemente cambiara inmediatamente su eleccion.

Llevando esta logica a productos de IA es aun mas evidente.

Por ejemplo, si quieres hacer una "herramienta de actas de reuniones con IA". Si te quedas solo en el nivel de funciones, facilmente empezaras a pensar:

- Deberia soportar la subida de audio?
- Deberia integrar separacion de hablantes?
- Deberia exportar a Markdown?
- Deberia generar automaticamente tareas pendientes?

Nada de esto esta mal, pero no es suficiente. Si preguntas un nivel mas con JTBD, lo que el usuario realmente quiere lograr puede ser:

- Quiero tener los resultados de la discusion sincronizados con los que no asistieron en 10 minutos despues de la reunion
- Quiero extraer limpiamente las tareas, responsables y fechas limite, sin que el equipo colabore de memoria
- Quiero reducir el tiempo de organizacion repetitiva de contenido de reuniones, guardando energia para la toma de decisiones y el avance

Una vez que el job queda claro, muchas prioridades de funciones aparecen automaticamente. Lo mas importante en la primera version puede no ser "soportar 12 formatos de exportacion", sino:

- La estructura del acta debe ser suficientemente clara
- La extraccion de tareas pendientes debe ser estable
- Compartir el enlace debe ser facil
- El resultado debe ser lo suficientemente confiable para reenviarlo directamente al equipo

Este es el valor de JTBD: **te ayuda a volver de "que capacidades quiero apilar" a "que progreso quiero ayudar al usuario a alcanzar".**

<figure class="field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:Taking_Notes.JPG" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/jtbd/meeting-note-taking.jpg" alt="En una reunión real, los participantes toman notas tanto con ordenadores como con papel y bolígrafo" loading="lazy" />
  </a>
  <figcaption><strong>Observemos la situación antes de pensar en funciones.</strong> En la reunión ya se emplean ordenadores, papel, bolígrafos y hábitos propios para completar la tarea. Antes de crear un producto de actas, debemos averiguar qué anotan y cómo organizan después el material, no suponer que «transcribir el audio» es la respuesta. Foto: Unclefeet, <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">CC BY-SA 3.0</a>.</figcaption>
</figure>

La siguiente comparación presenta tres situaciones. Al cambiar de una a otra, observemos qué describen respectivamente la «función del producto» y la «tarea del usuario».

<JtbdProgressLab />

## 4. Los cinco elementos de JTBD

Si eres principiante, primero no intentes hacer JTBD muy academico. Con capturar los 5 elementos mas practicos es suficiente.

### 4.1 Escenario

En que momento y en que entorno el usuario piensa en este producto?

- Despues de una reunion
- Cuando el jefe pide materiales de urgencia
- Por la noche preparando el curriculum para enviar
- A fin de mes descubriendo que el dinero no llega

**Una necesidad sin escenario normalmente no es lo suficientemente real.**

### 4.2 Disparador

Que le hace decidir buscar una solucion inmediatamente?

- Abrumado por un documento largo, sin saber por donde empezar
- Tienes que entregar algo manana, y hoy descubres que el formato es un desastre
- Tu jefe te acaba de preguntar por el progreso, y te das cuenta de que no lo tienes organizado
- Quieres mantener un registro, pero escribir a mano, copiar y organizar es muy complicado

Los disparadores suelen venir con emocion. Esta emocion es importante, porque determina por que el usuario tomara accion en este momento.

### 4.3 El progreso que quiere lograr

No solo quiere "hacer una accion", sino a que nuevo estado quiere llevarse?

- De la confusion a la claridad
- De la ansiedad a la tranquilidad
- De la procrastinacion a la accion
- De la ineficiencia a la fluidez
- De no saber explicarse a poder entregar directamente

En este paso, la palabra "progreso" es clave. Porque lo que mucha gente realmente compra no es una herramienta, sino un **cambio de estado**.

### 4.4 Solucion alternativa actual

Sin tu producto, como lo hace ahora?

- Copiar y pegar a mano
- Arreglarselas con Excel o notas
- Pedir ayuda a un colega
- Posponerlo y no hacerlo
- Saltar entre varias herramientas

Quien sea la solucion alternativa, ese es tu verdadero entorno competitivo.

<figure class="field-figure field-figure--narrow">
  <a href="https://commons.wikimedia.org/wiki/File:Scrum_task_board.jpg" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/jtbd/physical-task-board.jpg" alt="Tablero físico de tareas en una oficina, con notas adhesivas que se desplazan entre las columnas de pendientes, en curso y pruebas" loading="lazy" />
  </a>
  <figcaption><strong>La alternativa no tiene por qué ser otra aplicación.</strong> Este tablero físico cumple la tarea de «hacer visible el progreso» con simples notas adhesivas y cinta. Al estudiar la competencia también debemos incluir procesos manuales, hojas de cálculo y hábitos de colaboración como estos. Foto: Logan Ingalls, <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">CC BY 2.0</a>.</figcaption>
</figure>

### 4.5 Criterio de exito

Como se sabe que el problema esta realmente resuelto?

- Obtener un resultado compartible en 10 minutos
- Poder enviar a otros sin necesidad de grandes revisiones
- No olvidar, equivocarse ni perderse cosas facilmente
- Saber que hacer a continuacion desde el primer uso

Si ni siquiera puedes explicar "como juzga el usuario si valio la pena", entonces esta direccion probablemente aun no esta bien definida.

<a id="jtbd-formula"></a>
## [5. Fórmula de una frase JTBD](#top-jtbd)

Cuando quieras organizar una direccion de producto, puedes usar esta formula muy practica:

> Cuando __________, quiero __________, para __________.  
> Ahora solo puedo __________ para arreglarmelas con esto.

Por ejemplo:

> Cuando termino una reunion de proyecto con mucha informacion, quiero obtener rapidamente un acta con tareas, responsables y fechas limite, para poder sincronizar inmediatamente al equipo y avanzar en la ejecucion.  
> Ahora solo puedo arreglarmelas recordando, revisando el historial de chat y organizando manualmente.

Otro ejemplo:

> Cuando me preparo para enviar mi candidatura a un nuevo puesto, quiero reescribir rapidamente mis experiencias en una version mas adaptada al puesto, para poder enviar un curriculum decente con mas confianza.  
> Ahora solo puedo copiar repetidamente mi antiguo curriculum y modificar las formulaciones a mano, hasta que ya no estoy seguro de nada.

Si puedes escribir una frase con este nivel de claridad, el diseno de paginas, el diseno de prompts y la priorizacion de funciones seran mucho mas faciles.

## 6. Al hacer productos de IA, presta atencion a estos tres niveles de job

Muchos productos de IA parecen impresionantes en las demos, pero despues de lanzarse no retienen a los usuarios. La razon comun es que solo resuelven la accion superficial, sin resolver el job mas profundo.

Puedes dividir un job en tres niveles:

### 6.1 Nivel funcional

Cual es la tarea mas superficial?

- Resumir documentos
- Reescribir textos
- Extraer tareas pendientes
- Generar imagenes

Este es el nivel que los usuarios expresan mas facilmente.

### 6.2 Nivel emocional

Que molestia quiere reducir el usuario, o que sensacion quiere obtener?

- No quiere sentirse tan agobiado
- No quiere parecer poco profesional
- No quiere empezar de cero cada vez
- Quiere sentir mas control

Mucha disposicion a pagar esta fuertemente relacionada con el nivel emocional.

### 6.3 Nivel social

Como quiere que lo perciban los demas?

- Parecer mas confiable
- Parecer mas organizado en el equipo
- Parecer mas profesional ante los clientes
- Saber expresarse mejor en redes sociales

Si solo haces el nivel funcional, el producto es facil de reemplazar; si tambien entiendes el nivel emocional y el social, sera mas facil encontrar un valor verdaderamente pegajoso.

## 7. Usa JTBD para filtrar direcciones de producto

A veces no es que ya tengas un producto, sino que tienes 3 a 5 ideas y no sabes cual hacer. Aqui JTBD es ideal para filtrar.

Puedes tomar cada idea y preguntarte 5 cosas:

1. El escenario correspondiente a esta idea es lo suficientemente concreto?
2. El usuario ya esta usando algun metodo torpe para resolverlo?
3. El dolor de este job es lo suficientemente fuerte, o lo suficientemente frecuente?
4. Si lo hago bien, el usuario sentira claramente que "su estado mejoro"?
5. Puedo hacer una primera version solo en torno al paso clave de este job, algo pequeno pero util?

Si despues de hablar de una direccion solo puedes decir "me parece interesante", pero no puedes explicar el disparador, la solucion alternativa y el criterio de exito, probablemente sea solo una inspiracion vaga, no una direccion madura.

## 8. Preguntas que puedes usar directamente para entrevistar usuarios

Mucha gente, al hacer investigacion, pregunta: "Que funciones quieres?" Este tipo de pregunta facilmente obtiene respuestas superficiales.

JTBD es mas adecuado para hacer este tipo de preguntas:

- Cuando fue la ultima vez que encontraste este problema?
- Que estabas haciendo en ese momento, por que te bloqueaste?
- Como lo resolviste al final?
- En este proceso, cual fue la parte mas molesta, mas lenta o que menos confianza te dio?
- Si hubiera una herramienta que te ayudara, que resultado te haria sentir que realmente es util?
- Que metodos alternativos has probado? Por que no fueron lo suficientemente buenos?

Este tipo de preguntas tiene una ventaja: lleva la conversacion de vuelta a las experiencias reales, en lugar de quedarse en preferencias imaginadas.

<figure class="field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:Touch_on_Clamshell_Devices.jpg" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/jtbd/intel-context-observation.jpg" alt="Durante un estudio de experiencia de usuario de Intel, una participante toca directamente la pantalla de un portátil" loading="lazy" />
  </a>
  <figcaption><strong>El comportamiento puede ser más concreto que una respuesta.</strong> Durante un estudio de Intel sobre el uso táctil de portátiles en Brasil, China, Italia y Estados Unidos, los investigadores observaron que los participantes inclinaban la pantalla hacia atrás y la manejaban con ambos pulgares o desde distintas posturas. Es difícil descubrir estos gestos preguntando «¿qué función quieres?», pero muestran cómo se adopta realmente un producto. Foto: <a href="https://commons.wikimedia.org/wiki/File:Touch_on_Clamshell_Devices.jpg" target="_blank" rel="noreferrer">Intel Free Press / Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">CC BY 2.0</a>.</figcaption>
</figure>

## 9. Usa IA para ayudarte con el analisis JTBD

JTBD no fue inventado por la IA, pero la IA es muy adecuada para ayudarte a organizar y refinar JTBD.

Por ejemplo, si ya has recogido 5 a 10 comentarios de usuarios, puedes pasarlos al modelo y pedirle que los resuma siguiendo esta estructura:

```text
Por favor actua como asistente de investigacion de producto.
Te dare algunas citas textuales de usuarios. Por favor no des sugerencias de funciones primero,
sino organiza primero siguiendo el marco de Jobs to Be Done:

1. En que escenario se encuentra el usuario
2. Cual es el evento que detona su accion
3. Cual es el progreso que realmente quiere lograr
4. Cual es la solucion alternativa actual
5. Cual es el criterio de exito que mas le importa
6. Que palabras emocionales aparecen repetidamente en estos comentarios

Finalmente, organiza todo esto en 3 hipotesis JTBD que mas valga la pena verificar primero.
```

Si ya tienes una idea, tambien puedes pedir a la IA que te ayude con la primera ronda de convergencia:

```text
Quiero hacer [tu idea de producto].
Por favor no me des una lista de funciones directamente, sino analiza usando el metodo Jobs to Be Done:

1. Que escenarios concretos podria servir este producto
2. En cada escenario, cual es el job central que el usuario quiere completar
3. Que soluciones alternativas existen actualmente
4. Que job es mas adecuado como punto de partida para un MVP, y por que
5. Escribe el job final recomendado como una frase JTBD clara
```

La ventaja de hacer esto es que no seras arrastrado inmediatamente por la IA a "brainstormear 50 funciones", sino que primero aclararas la direccion.

## 10. Los 4 errores mas comunes de los principiantes

### 10.1 Escribir el job como un nombre de funcion

"Resumen con IA", "clasificacion inteligente", "generacion automatica" no son jobs, solo son posibles formas de implementacion.

### 10.2 Escribir un grupo demasiado amplio

"Todos los oficinistas", "todos los estudiantes", "todos los emprendedores" suelen ser demasiado amplios. Cuanto mas amplio, mas dificil es ver escenarios reales.

### 10.3 Solo escuchar lo que el usuario dice, sin observar lo que hace

El usuario describira lo que quiere, pero sus verdaderas prioridades suelen estar ocultas en como se arregla actualmente para resolver los problemas.

### 10.4 Querer hacer una plataforma completa desde el principio

La forma correcta de usar JTBD normalmente no es "voy a hacer una gran plataforma que haga de todo", sino primero enfocarse en el paso mas critico de un escenario y hacerlo excepcionalmente bien.

<a id="jtbd-ai"></a>
## [11. Uso de la IA para organizar materiales JTBD](#top-jtbd)

JTBD no fue inventado por la IA, pero la IA es muy adecuada para actuar como tu asistente de investigacion, asistente de organizacion y asistente de contraste dentro de este metodo. La clave es: **dejar que la IA te ayude a organizar y expandir, no que adivine por ti lo que piensan los usuarios.**

Puedes usarlo asi:

### 11.1 Pedir a la IA que convierta ideas vagas en hipótesis JTBD

Cuando solo tienes una descripcion vaga en mente, como "quiero hacer una herramienta para ayudar a universitarios a encontrar practicas", primero puedes pedir a la IA que la descomponga en varios jobs posibles:

```text
Tengo una idea vaga de producto: [tu idea]
Por favor no me des una lista de funciones directamente, sino analiza usando el enfoque de Jobs to Be Done:
1. A que escenarios concretos podria corresponder
2. En cada escenario, cual es el progreso que el usuario realmente quiere lograr
3. Cual podria ser la solucion alternativa actual
4. Que job es mas adecuado para hacer primero un MVP
Finalmente, escribe cada job como una frase JTBD clara.
```

Incluso puedes escribir la entrada de forma muy basica:

```text
Quiero hacer algo para ayudar a universitarios a encontrar practicas.
No se muy bien que hacer exactamente, ayudame a pensar que es lo que los usuarios realmente quieren lograr.
```

La IA podria dar un resultado util como este:

```text
Posibles direcciones JTBD:

1. Cuando me preparo por primera vez para enviar candidaturas de practicas, quiero saber rapidamente que materiales debo preparar primero,
para no estar posponiendo el envio por la confusion de informacion.

2. Cuando veo una oferta de practicas, quiero juzgar rapidamente si vale la pena aplicar,
para no perder demasiado tiempo en puestos que no me convienen.

3. Cuando empiezo a enviar candidaturas, quiero adaptar mi curriculum existente a una version mas ajustada al puesto,
para poder enviarlo mas rapido y mejorar mi tasa de aprobacion.
```

El valor de este tipo de resultado es que descompone tu idea original muy general en varias direcciones mas cercanas a escenarios reales.

### 11.2 Dejar que la IA te ayude a organizar citas textuales de entrevistas

Si ya has hecho varias entrevistas con usuarios, puedes pasar las transcripciones a la IA y pedirle que extraiga los escenarios, disparadores, soluciones alternativas y criterios de exito que se repiten.

```text
A continuacion estan las citas textuales de 5 usuarios.
Por favor no des soluciones primero, sino organiza siguiendo el marco JTBD:
1. En que escenario se encuentra el usuario
2. Cual es el evento que detona su accion
3. Cual es el progreso que realmente quiere lograr
4. Cual es la solucion alternativa actual
5. Cual es el criterio de exito que mas le importa
6. Que informacion se repite entre multiples usuarios
Finalmente, organiza en 3 hipotesis JTBD que mas valga la pena verificar primero.
```

Una entrada simple de principiante tambien podria ser:

```text
Pregunte a 3 personas, y mas o menos dijeron esto:

1. Cada vez que quiero enviar una practica tengo que rehacer el curriculum, es muy molesto.
2. En realidad lo que mas miedo me da es no saber si lo he escrito bien.
3. Ahora le pido a companeros de cursos superiores que me lo revisen, pero me da pena molestarles siempre.

Ayudame a organizar, que es lo que realmente quieren lograr.
```

La IA podria responder:

```text
Resultado organizado:

- Escenario comun: antes de enviar candidaturas de practicas, necesitan trabajar en el curriculum
- Dificultad comun: no saben como modificarlo hasta que este "lo suficientemente bien"
- Solucion alternativa actual: pedir a companeros de cursos superiores que lo revisen, modificarlo una y otra vez
- Posible JTBD:
  Cuando me preparo para enviar candidaturas de practicas, quiero juzgar mas rapidamente si mi curriculum ya esta listo para enviar,
  para no quedarme atascado en "lo modifico una vez mas" y retrasar el envio indefinidamente.
```

Este tipo de resultado es muy util porque te ayuda a extraer de citas textuales dispersas algo que se parece mas a una "necesidad".

### 11.3 Dejar que la IA haga una ronda ligera de investigacion en la red

Antes de empezar entrevistas a gran escala, puedes pedir a la IA que haga un barrido de informacion externa muy ligero, como:

- En foros o comunidades publicas, como se queja la gente de este problema
- En el mercado, que nivel de problema resuelven principalmente los productos existentes
- Cual es la solucion alternativa mas comun de los usuarios
- En las resenas comunes, cuales son los puntos que mas satisfaccion y mas insatisfaccion generan

Esta investigacion no puede sustituir las entrevistas reales con usuarios, pero es ideal como calentamiento en la fase de Discover, ayudandote a construir primero un mapa de problemas.

Una entrada simple podria ser:

```text
Por favor ayudame a buscar:
"Cuales son los puntos de dolor mas comunes cuando los universitarios modifican su curriculum y envian candidaturas de practicas?"
Prioriza lo que la gente dice en foros publicos, posts de experiencia y comunidades de busqueda de empleo.
Organizalo en 5 problemas mas comunes.
```

La IA podria responder:

```text
Puntos de dolor comunes organizados:

1. No saber que poner en el curriculum, muy poca experiencia
2. No saber como adaptarlo a diferentes puestos
3. Modificar muchas versiones pero sin certeza de si es suficientemente bueno
4. No encontrar a alguien fiable que lo revise
5. El proceso de envio es complicado, facil de procrastinar
```

Este tipo de resultado no debe tomarse como conclusion final, pero es ideal para decidir que tipo de problema priorizar en las entrevistas.

### 11.4 Dejar que la IA actue como "abogado del diablo"

Muchas veces nos encariñamos demasiado con nuestras propias ideas. Puedes pedir especificamente a la IA que asuma el rol de alguien critico, obligandote a explicar el problema mas claramente:

```text
Por favor actua como un consultor de investigacion de producto muy estricto.
A continuacion esta mi hipotesis JTBD: [tu hipotesis]
Por favor critica desde los siguientes angulos:
1. Este escenario es demasiado amplio?
2. Este job esta escrito como una funcion en lugar de un progreso real?
3. La solucion alternativa es demasiado debil?
4. El criterio de exito no es lo suficientemente claro?
5. Cual es el riesgo que mas necesita ser verificado en esta hipotesis?
```

La ventaja de hacer esto es que descubriras mas rapidamente si estas mirando necesidades o solo estas mirando la solucion que te gusta.

## 12. Resumen

- JTBD desplaza el análisis desde las funciones del producto hacia la tarea que el usuario quiere completar.
- Una hipótesis JTBD debe indicar la situación, el desencadenante, el progreso esperado, la alternativa actual y el criterio de éxito.
- Una función es solo una posible forma de completar la tarea; no debemos confundirla con la tarea del usuario.
- JTBD sigue siendo una hipótesis que debemos comprobar mediante entrevistas y pruebas de comportamiento.

## 13. Ejercicio

<StageAssignmentCard title="Explica qué intenta conseguir realmente el usuario">

Por favor completa las siguientes tareas basandote en el contenido anterior:

1. Elige una idea de producto que quieras hacer recientemente, y escribela claramente usando la formula JTBD
2. Completa los 5 elementos para esta idea: escenario, disparador, progreso, solucion alternativa, criterio de exito
3. Encuentra 3 usuarios potenciales, y al menos una vez logra preguntar "cuando fue la ultima vez que encontraste este problema"
4. Pasa las citas textuales de las entrevistas a la IA, y organiza en 3 hipotesis JTBD que mas valga la pena verificar primero

</StageAssignmentCard>

## Lectura adicional

- [Christensen Institute: Jobs to Be Done](https://www.christenseninstitute.org/theory/jobs-to-be-done/)
- [Harvard Business School Online: What Is Jobs to Be Done?](https://online.hbs.edu/blog/post/jobs-to-be-done)
- [Intercom: Jobs-to-be-Done: A framework for customer needs](https://www.intercom.com/blog/jobs-to-be-done-framework/)
- [Mural: Jobs to Be Done framework guide](https://www.mural.co/blog/jobs-to-be-done-framework)

<style scoped>
.field-figure { margin: 24px 0 32px; overflow: hidden; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg-soft); }
.field-figure > a { display: block; background: #f4f4f1; }
.field-figure img { display: block; width: 100%; max-height: 520px; object-fit: contain; }
.field-figure--narrow img { max-height: 720px; object-fit: contain; }
.field-figure figcaption { padding: 13px 16px 15px; border-top: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); font-size: 13px; line-height: 1.75; }
.field-figure figcaption strong { color: var(--vp-c-text-1); }
@media (max-width: 640px) { .field-figure { margin: 20px 0 28px; } }
</style>
