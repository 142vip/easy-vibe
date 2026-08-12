---
title: 'Proyecto completo: de una idea a una obra terminada'
description: 'Usa tu prototipo con IA de principio a fin, pide a otra persona que lo pruebe y corrige los problemas que observes.'
---

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'
import ProductFinishMap from '../../../zh-cn/stage-1/complete-project-practice/ProductFinishMap.vue'
import StageOneCompletion from '../../../zh-cn/stage-1/complete-project-practice/StageOneCompletion.vue'

const duration = 'Aproximadamente <strong>2–3 días</strong>'
const relatedArticles =
  relatedArticlesMap['es-es/stage-1/complete-project-practice'] ?? []
</script>

# Proyecto completo: de una idea a una obra terminada


## Qué haremos en este capítulo

<ChapterIntroduction :duration="duration" :tags="['Uso completo', 'Experiencia de producto', 'Prueba con usuarios', 'Presentación']" coreOutput="Un producto de IA que otra persona pueda usar sin instrucciones" expectedOutput="Una aplicación web probada y mejorada con una persona real">

En los capítulos anteriores partimos de una idea, construimos un prototipo interactivo y conseguimos que la función de IA de la página funcionara de verdad.

Tú sabes qué escribir y dónde pulsar. Alguien que abre la página por primera vez quizá no encuentre ni el primer paso. Si después de pulsar no aparece nada enseguida, también puede pensar que la página está rota.

En este capítulo no añadiremos funciones nuevas. Usaremos el producto de principio a fin, corregiremos los lugares donde una persona puede quedarse bloqueada y pediremos a alguien que lo pruebe. Al terminar tendrás una obra que puedes compartir con tranquilidad.

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Úsalo tú', description: 'Ve desde el inicio hasta el resultado' },
      { title: 'Corrige los bloqueos', description: 'Espera, resultado y error' },
      { title: 'Pide una prueba', description: 'Observa antes de ayudar' },
      { title: 'Ordena y comparte', description: 'Haz que la obra se entienda' }
    ]" />
  </ClientOnly>
</div>

<ProductFinishMap />

## 1. Usa el producto de principio a fin

No corras a añadir inicio de sesión, trabajo en equipo o paneles de datos. Abre el producto actual y úsalo como una persona nueva, desde la primera página hasta obtener un resultado. Cada paso que todavía exige una explicación a tu lado es un lugar que debes corregir.

En nuestro espacio de contenidos para comercio electrónico, un uso completo se parece a esto:

> Una persona de operaciones sube la imagen de un producto, completa la información necesaria, genera un primer borrador de imagen y texto, comprueba el resultado y lo copia o guarda para editarlo y publicarlo después.

Por ahora basta con que funcione este recorrido breve. El acceso, los permisos de equipo y el lanzamiento formal pueden esperar hasta que el producto los necesite.

### 1.1 Sigue el orden real de uso

Deja a un lado el código y los componentes. Haz lo mismo que haría un usuario:

1. Abrir la página y entender para qué sirve la herramienta.
2. Subir una imagen y completar datos necesarios como nombre y material.
3. Pulsar «Generar texto» y ver que la página está trabajando.
4. Revisar el título y los puntos de venta devueltos por la IA; editar o volver a generar cuando sea necesario.
5. Copiar, descargar o guardar de forma temporal el resultado y terminar la tarea.

Cuando llegues al final, pregúntate: ¿podría hacerlo otra persona si yo no estuviera al lado? Anota funciones como gestión de equipos o paneles complejos, pero no las construyas ahora si no afectan a este uso.

::: tip ¿Qué tamaño debe tener esta versión?
Si puedes explicar la tarea en una frase y la otra persona puede empezar en pocos minutos, el alcance suele ser adecuado.
:::

### 1.2 Vuelve a probar desde una página vacía

Después de desarrollar durante un tiempo, la página suele conservar datos de prueba y el último resultado. Es fácil olvidar que una persona nueva no verá nada de eso. Abre una ventana privada o borra los datos locales y comienza otra vez.

Solo necesitas probar tres situaciones:

1. **Abrir en blanco:** pulsa sin rellenar nada y comprueba que la página indica qué falta.
2. **Generar con normalidad:** sube una imagen y genera contenido; confirma que se ve la espera y que, al aparecer el resultado, hay un siguiente paso claro.
3. **Provocar un error:** sube un archivo no admitido o haz que falle la petición; confirma que los datos siguen allí y que se puede reintentar.

Anota dónde te detienes. En la siguiente sección corregiremos esos puntos.

Puedes pedir a un IDE con IA que inspeccione el código, pero no sustituye una prueba real:

```text
Todavía no cambies el código.

Revisa el proyecto actual siguiendo esta tarea:
el usuario sube una imagen de producto, introduce los datos necesarios,
genera el texto, revisa el resultado y lo copia o guarda.

Dime qué páginas y archivos participan en el recorrido
y en qué puntos podría interrumpirse ahora.
```

El IDE puede localizar código sospechoso. Para saber si la página se usa bien, tienes que pulsarla tú mismo.

## 2. Corrige los lugares donde es fácil quedarse bloqueado

Después de un recorrido completo, los problemas suelen aparecer en cuatro momentos: al abrir la página, mientras se espera a la IA, después de recibir el resultado y cuando la petición falla. No hace falta un diseño complicado. La persona debe saber qué ocurre y qué puede hacer después.

### 2.1 ¿Se entiende qué hacer al abrir?

Una página vacía no debería contener solo un campo. Añade una explicación breve, algún ejemplo o una nota con el formato y tamaño de imagen admitidos cerca de la zona de carga.

Si el formulario tiene muchos campos, conserva los que necesita un buen resultado. El nombre, la imagen y las características principales pueden ser obligatorios; la marca, el enlace de referencia y los ajustes de estilo pueden ir en «Más opciones». Una persona nueva no debería completar un formulario largo antes de probar el producto.

### 2.2 ¿La página responde después de pulsar?

Una petición a la IA puede tardar varios segundos. Después del clic, el botón debe mostrar «Generando» y evitar temporalmente envíos repetidos. Los datos introducidos no deben desaparecer y la página no debería saltar a un resultado vacío.

![Estado de espera durante la generación del contenido](../../../zh-cn/stage-1/building-prototype/images/index-2026-01-14-15-50-05.png)

*La espera no necesita una animación complicada. Mostrar que el trabajo ha empezado y conservar el contenido y la posición ya evita la mayor parte de la confusión.*

Si una imagen o un vídeo entra en una cola, puedes mostrar fases como «En cola» y «Generando». No inventes un porcentaje exacto si la API no proporciona el progreso.

### 2.3 ¿Qué puede hacer la persona con el resultado?

La respuesta de la IA no termina el recorrido. Normalmente hay que verificar datos, corregir palabras y llevar el resultado al siguiente paso. La zona de resultado debe ofrecer al menos una acción útil: editar, copiar, descargar o volver a generar.

![Página de resultado con comprensión de imagen y generación de texto](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-35-41.png)

*La imagen subida permanece encima del resultado. Así se puede comparar el texto con el original, en lugar de aceptar sin más una respuesta del modelo.*

Si el modelo no puede confirmar algún dato, señálalo para que la persona lo complete o borre. Es más realista que presentar un párrafo como «respuesta final».

### 2.4 ¿Se puede continuar después de un error?

La red, el límite de uso o un archivo no admitido pueden hacer fallar la petición. No hace falta mostrar todo el error técnico, pero sí decir que la operación no terminó y permitir reintentar o cambiar la entrada.

Por ejemplo:

- **Formato no admitido:** explica los formatos aceptados y permite elegir otro archivo.
- **Falta un dato obligatorio:** muestra el aviso junto al campo, no solo «Parámetros incorrectos».
- **Servicio de IA no disponible:** conserva los datos y ofrece «Volver a generar».
- **Resultado poco útil:** permite cambiar la entrada y probar de nuevo sin empezar desde cero.

Si al actualizar se pierde un formulario largo, puedes guardar temporalmente el borrador con LocalStorage. Conserva solo datos normales necesarios para seguir; nunca guardes una API Key, datos reales de clientes ni archivos sensibles en el navegador.

Entrega los problemas al IDE con una petición centrada:

```text
Revisa el recorrido “subir una imagen y generar texto”
en cuatro momentos: inicio, espera, éxito y error.

Corrige primero lo que impide continuar:
- los campos obligatorios no tienen aviso;
- el botón se puede pulsar varias veces durante la petición;
- un error borra los datos;
- el resultado no permite editar, copiar o volver a generar.

Antes de cambiar nada, dime qué archivos modificarás.
Al terminar, dame pasos de prueba manual.
```

## 3. Pide a otra persona que lo use

Después de mirar mucho una página propia, todo parece evidente. Una persona que no participó en el desarrollo puede encontrar en pocos minutos problemas que llevas tiempo sin ver.

Busca, si puedes, a alguien que realmente usaría el producto. Para esta herramienta puede ser una persona que haya gestionado una tienda o creado fichas de producto. Si no la encuentras, también sirve un amigo que nunca haya visto la página.

### 3.1 Explica solo la tarea

Al comenzar, indica únicamente el objetivo:

> Usa esta herramienta para generar un título y varios puntos de venta a partir de la imagen. Revisa el contenido y copia la versión que seguirías editando.

Primero observa; no digas enseguida dónde pulsar. Anota las pausas, los pasos atrás, los clics repetidos y las preguntas. Si explicas en el momento, ocultas un problema que debería resolver la propia página.

Una o dos personas ya pueden descubrir muchos fallos claros. No hace falta un informe formal: apunta dónde se detuvieron.

Si abren la página y no se mueven, añade una frase de propósito. Si pulsan muchas veces «Generar», aclara la espera. Si no saben qué hacer con el resultado, añade edición o copia. Si después de un error deben rellenar todo otra vez, conserva los datos y ofrece reintento.

### 3.2 Habla cuando termine la prueba

Después de completar o abandonar la tarea, pregunta:

1. ¿En qué paso dudaste más?
2. ¿Qué partes del resultado usarías directamente y cuáles cambiarías siempre?
3. Si tuvieras que hacer lo mismo otra vez, ¿volverías a usar esta herramienta? ¿Por qué?

No preguntes solo «¿te pareció fácil?». Un «está bien» por cortesía ayuda poco. Los comportamientos y ejemplos concretos son más útiles.

::: warning Cuando uses material real
Las imágenes, grabaciones o documentos de la persona pueden contener información de negocio. Explica a qué tipo de servicio de IA se enviarán, evita datos de clientes sin permiso y borra después los archivos que ya no hagan falta.
:::

## 4. Corrige el bloqueo y vuelve a probar

La prueba puede producir una lista larga. No hace falta resolverla completa. Empieza por lo que impide terminar la tarea o hace que el resultado no sea fiable.

Usa este orden:

1. **No se puede completar la tarea:** el botón no funciona, la petición falla o no se puede sacar el resultado.
2. **El resultado no es fiable:** inventa información, no se puede comprobar o carece de fuentes necesarias.
3. **La operación se presta a confusión:** no está claro dónde empezar ni cuál es el estado actual.
4. **El esfuerzo es demasiado alto:** hay pasos repetidos, se pierden datos o no hay respuesta durante la espera.
5. **Estilo y nuevas funciones:** mejoras visuales y deseos que no impiden la tarea principal.

Elige de uno a tres puntos importantes. Después de corregirlos, repite el recorrido. Si es posible, pide a la misma persona que vuelva. El cambio sirve cuando el bloqueo original ha desaparecido.

### 4.1 Cuenta al IDE un problema concreto

No digas solo «optimiza la página». Incluye lo que has observado:

```text
Tarea: subir una imagen de producto y generar tres puntos de venta.

Problema observado:
Dos personas pulsaron “Generar” varias veces porque la página
no mostraba con claridad que la petición había empezado.
Esto creó tareas duplicadas.

Modifica la página:
1. Desactiva el botón al empezar y muestra “Generando”.
2. Actívalo de nuevo después del éxito o el error.
3. Conserva los datos que ya había escrito el usuario.
4. Dime cómo probar manualmente los clics repetidos y el error.
```

Una petición concreta evita cambios que no vienen al caso y te dice qué comprobar después.

### 4.2 Repite todo el recorrido

Corregir un lugar puede afectar a otro. Antes de compartir, prueba cuatro casos:

- una entrada normal con todos los datos;
- un campo obligatorio vacío;
- una petición fallida o agotada por tiempo;
- editar, copiar o volver a generar después del resultado.

Si guardas borradores, actualiza también la página. Comprueba la función nueva y que el recorrido original no se haya roto.

## 5. Prepara la obra para compartirla

La obra ya no solo «funciona en tu ordenador». Otra persona la ha usado y tú has corregido un problema real. Ordena el acceso y la explicación para enseñarla a más gente.

### 5.1 Explícala en un minuto

Puedes seguir este orden:

1. **Quién tiene qué problema:** una persona de comercio electrónico organiza imágenes y argumentos cada vez que prepara un borrador.
2. **Cómo ayuda el producto:** sube una imagen y algunos datos y obtiene contenido que puede seguir editando.
3. **Qué capacidades de IA usa:** comprensión de imágenes y generación de texto.
4. **Cómo termina la tarea:** subir, generar, revisar, editar y copiar.
5. **Qué cambiaste tras la prueba:** por ejemplo, una espera visible y datos conservados después de un error.

Haz que entiendan el producto antes de enumerar frameworks y modelos.

### 5.2 Prepara lo que necesita otra persona

Antes de compartir, reúne tres cosas:

1. **Una aplicación ejecutable:** ofrece el enlace; si no está desplegada, escribe el comando de inicio y la dirección.
2. **Un vídeo de 30–60 segundos:** muestra una tarea completa desde la entrada hasta el resultado, no un cambio rápido de pantallas.
3. **Una página de explicación:** usuario objetivo, problema, recorrido, capacidad de IA, una opinión real y la mejora que hiciste.

Si todavía no puedes dar acceso remoto, una ejecución local y el vídeo sirven como resultado de Stage 1. Lo importante es que otra persona entienda la obra y vea que el recorrido se completa.

### 5.3 ¿Continuar esta obra o empezar otra?

Puedes seguir con el espacio de contenidos del curso o aplicar el mismo método a reuniones, audio, apoyo al aprendizaje o herramientas profesionales. La [guía de escenarios de IA](../appendix-industry-scenarios/index.md) te ayudará a explorar opciones.

No cambies a un tema desconocido solo para parecer original. Un problema pequeño de tu estudio, trabajo o vida, probado y corregido con una persona real, convence más que una página con muchas funciones que nadie ha usado.

### Antes de enviarla

Abre por última vez el enlace y completa el recorrido. Confirma que otra persona puede abrirlo, que la IA devuelve el resultado y que no aparece ninguna API Key en la página o las capturas. Si usaste imágenes, audio o documentos ajenos, confirma también el permiso.

## 6. 📚 Tarea

<StageAssignmentCard title="Termina y publica tu obra de Stage 1">

  <p>No añadas funciones nuevas. Prepara la obra actual y entrégasela de verdad a una persona.</p>

  <ol>
    <li>
      <strong>Úsala una vez de principio a fin</strong>
      <ul>
        <li>Empieza al abrir la página y continúa hasta obtener, editar o guardar el resultado.</li>
      </ul>
    </li>
    <li>
      <strong>Pide a una persona que la pruebe</strong>
      <ul>
        <li>No expliques primero la interfaz. Observa dónde se detiene y corrige un problema.</li>
      </ul>
    </li>
    <li>
      <strong>Comparte la obra</strong>
      <ul>
        <li>Prepara un enlace o instrucciones, un vídeo de 30–60 segundos y una presentación breve.</li>
      </ul>
    </li>
  </ol>

  <p>Stage 1 termina de verdad cuando otra persona puede abrir la obra y completar un uso sin ayuda.</p>
</StageAssignmentCard>

## Siguiente paso

Has recorrido un camino completo: partir de un problema real, limitar la primera versión, construir un prototipo, conectar la IA y mejorar el producto después de que alguien lo use.

En Stage 2 aprenderemos bases de datos, cuentas, pagos, despliegue y una ingeniería de frontend y backend más completa. Todo eso permitirá servir a más personas y datos reales, pero el punto de partida seguirá siendo el mismo: completar primero una tarea valiosa.

<RelatedArticlesSection
  title="Continúa aprendiendo"
  description="Después de Stage 1, sigue con los contenidos de ingeniería que aparecen abajo."
  :items="relatedArticles"
/>

<StageOneCompletion />
