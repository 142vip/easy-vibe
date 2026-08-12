---
title: 'Añadir funciones de IA a un prototipo'
description: 'Empieza por los prompts, la documentación oficial y la consola del servicio para añadir texto, visión, imagen, voz y vídeo a un prototipo web.'
---

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'
import AiCapabilityGuide from '../../../zh-cn/stage-1/integrating-ai-capabilities/AiCapabilityGuide.vue'
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'

const duration = 'Aproximadamente <strong>1–2 días</strong>'
const relatedArticles =
  relatedArticlesMap['es-es/stage-1/integrating-ai-capabilities'] ?? []
</script>

# Añadir funciones de IA a un prototipo


## Presentación del capítulo

<ChapterIntroduction :duration="duration" :tags="['Prompts', 'Documentación de API', 'Consolas de servicio', 'Multimodalidad']" coreOutput="Añadir una o dos funciones reales de IA al prototipo" expectedOutput="Un prototipo web capaz de llamar a servicios de texto, imagen, voz o vídeo">

El prototipo del capítulo anterior ya permite comprobar la estructura de la página y el recorrido de uso, pero sus resultados todavía proceden de datos simulados. En este capítulo conectaremos una de sus acciones principales con un servicio de IA real.

Integrar IA no consiste únicamente en copiar código de una API. Hay que resolver tres asuntos a la vez: **cómo explicar la tarea, cómo leer la documentación oficial y cómo colocar la llamada de forma segura dentro del producto.**

Primero aprenderemos un método común y después veremos texto, comprensión de imágenes, generación de imágenes, voz y vídeo. Los nombres de los modelos y las pantallas de las consolas cambian con frecuencia; los ejemplos sirven para entender la estructura. Al realizar una integración real, copia el identificador del modelo y los parámetros desde la documentación actual del servicio.

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Definir la tarea', description: 'Preparar el prompt de negocio' },
      { title: 'Leer la documentación', description: 'Encontrar la API y sus parámetros' },
      { title: 'Completar la conexión', description: 'Realizar una llamada segura' },
      { title: 'Ampliar modalidades', description: 'Imagen, voz y vídeo' }
    ]" />
  </ClientOnly>
</div>

## 1. Decide qué función vas a conectar

El espacio de trabajo de contenidos para comercio electrónico del capítulo anterior ya tiene datos del producto y un botón «Generar texto». Sin embargo, el resultado sigue siendo simulado. Empezaremos por hacer que ese botón funcione de verdad.

El proceso es sencillo: la persona introduce el nombre, el material y los puntos fuertes del producto, pulsa el botón y recibe un texto comercial. Como tanto la entrada como la salida son texto, necesitamos un modelo capaz de generar texto.

Si la página ofrece otra función, también cambiará la capacidad necesaria. Por ejemplo:

- Para subir una foto y reconocer el color y el estilo hace falta comprensión de imágenes.
- Para crear un cartel a partir de los datos del producto hace falta generación de imágenes.
- Para convertir una grabación en un acta, primero se pasa la voz a texto y después un modelo de texto organiza la transcripción.
- Para convertir un artículo en audio reproducible hace falta síntesis de voz.
- Para animar una fotografía del producto hace falta generación de vídeo a partir de imagen.

Antes de integrar nada, vuelve a mirar la página: ¿qué entrega la persona y qué espera ver al final? Cuando ambas cosas están claras, normalmente se puede decidir si hay que buscar un modelo de texto, imagen, voz o vídeo.

<AiCapabilityGuide />

### 1.1 A veces una función se divide en varios pasos

No todas las funciones pueden resolverse con un solo modelo y una sola petición. «Subir una foto y generar argumentos de venta» exige primero comprender el producto de la imagen y después redactar a partir del resultado. Para «responder con la documentación de la empresa» también hay que localizar antes el contenido pertinente.

No empieces la división por los nombres de los modelos. Sigue las acciones de la persona: qué paso comprende contenido existente, cuál crea contenido nuevo y cuál únicamente busca información. Si hace falta, conecta dos o tres capacidades en orden.

La IA solo debe encargarse de aquello para lo que resulta apropiada. El inicio de sesión, los pagos, el guardado de archivos y la navegación tienen reglas explícitas y siguen siendo trabajo del programa convencional.

![Página real en la que se comprende una imagen de producto antes de generar su descripción](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-35-41.webp)

*En este prototipo se identifica primero la información del producto. Después se genera una descripción y una lista de argumentos que la persona puede seguir editando.*

### 1.2 Qué buscar al abrir la consola del servicio

Una vez elegida la generación de texto, se puede abrir una plataforma como DeepSeek, SiliconFlow, Volcengine Ark o MiniMax. La plataforma aporta la cuenta, la facturación y el punto de acceso; el modelo elegido procesa la petición.

Para la primera integración no hace falta estudiar todos los menús. Localiza estos cuatro elementos:

1. Crea una **API Key** para que la aplicación llame al servicio.
2. Anota el **Model ID** que vas a usar.
3. Busca el ejemplo mínimo de curl o JavaScript en la documentación oficial.
4. Comprueba la cuota, el precio y los límites de uso.

La aplicación envía la información del producto mediante una **API**. Si la documentación ofrece un **SDK** de JavaScript o Python, también puedes usarlo: simplemente envuelve el código de la petición. La frase «genera un título y varios argumentos a partir de estos datos» dentro de la petición es el prompt enviado al modelo.

El nombre de la plataforma, el identificador del modelo y la dirección de la API no son lo mismo. Usa la dirección y el Model ID del ejemplo oficial; no copies la URL de la zona de pruebas en línea.

### 1.3 Deja para más adelante las API que todavía no necesitas

En la consola pueden aparecer Embedding, Rerank, Function Calling, OCR y moderación. Embedding y Rerank se usan en bases de conocimiento; OCR permite leer PDF y recibos; Function Calling permite que el modelo utilice herramientas externas como buscadores o bases de datos.

No hace falta aprenderlo todo ahora. Conecta primero una API directamente relacionada con una función de la página y vuelve a la documentación correspondiente cuando el producto necesite otra capacidad.

## 2. Prueba primero el resultado generado

Antes de escribir el código de la API, prueba el modelo en la zona de pruebas de la plataforma. No solo queremos saber si «sabe redactar», sino si devuelve el formato que necesita la página.

### 2.1 La persona solo tiene que explicar lo que quiere

Empieza en la zona de pruebas como lo haría una persona real:

```text
Quiero publicar una mochila ligera para ir al trabajo, hecha de nailon negro
y pensada para el uso diario.
Escribe un título breve y tres argumentos de venta.
```

Cuando exista una página, la persona quizá ni siquiera tenga que redactar ese párrafo. Rellena nombre, material y color y pulsa «Generar texto». El programa lee los campos y añade reglas fijas: no inventar precios ni ventas, mantener un título corto y devolver un formato determinado.

Estas reglas no deben repetirse en cada uso. Si la página muestra por separado título, resumen y argumentos, el programa puede pedir los campos JSON `title`, `summary` y `selling_points`. La entrada sigue siendo natural y la página puede leer el resultado de forma estable.

En la primera prueba utiliza varios productos y omite a propósito un campo. Comprueba si el modelo inventa la información ausente. Si el formato cambia, corrige las instrucciones fijas del programa en lugar de obligar a las personas a aprender a escribir prompts.

### 2.2 Conecta la API con la página

La documentación oficial suele incluir un ejemplo de curl, JavaScript o Python. Entrégalo al IDE con IA junto con la función que quieres incorporar.

```text
Añade un botón «Generar texto» a la página de detalles del producto.

Al pulsarlo, envía la información del producto a la API de abajo
y muestra en la página el texto generado.

No pongas la API Key en el navegador. Muestra también los estados de espera y error.
Cuando termines, dime qué debo configurar y cómo iniciar y probar la página.

Ejemplo oficial de la API:
<pega un ejemplo de curl o SDK sin una clave real>
```

Con la ubicación de la página y el ejemplo oficial, el IDE no necesita adivinar el formato. Comprueba primero que una petición responde correctamente. Para añadir imagen, voz o vídeo, sustituye la descripción de la función y el ejemplo oficial.

## 3. Envía la primera petición siguiendo el ejemplo oficial

Después de probar el prompt, abre el Quick Start o la API Reference. Aunque cada documentación tenga un aspecto distinto, la primera llamada exige cuatro datos: la dirección, la ubicación de la API Key, el valor de `model` y el ejemplo mínimo.

Copia el ejemplo oficial de curl, JavaScript o Python y cambia únicamente el Model ID y el contenido de prueba. Obtén una respuesta normal en el terminal antes de integrarlo en el proyecto. Si luego falla la página, al menos sabrás que la cuenta, la clave y el modelo funcionan.

Revisa también la respuesta. El texto suele estar dentro de un campo JSON; una imagen puede devolver una URL; el audio puede llegar como datos binarios; y el vídeo suele devolver primero un identificador de tarea. La página se debe construir conforme a la respuesta real.

### 3.1 Pide ayuda a la IA para leer documentación extensa

No hace falta leer una documentación larga de principio a fin. Da al IDE el enlace que estás consultando y pídele que localice únicamente lo necesario para la primera llamada.

```text
Lee esta documentación de API: <enlace>

Quiero llamar a la API con JavaScript. Muéstrame el ejemplo más sencillo,
dónde se colocan la API Key y el model, y cómo se obtiene el resultado.
Utiliza únicamente parámetros que aparezcan en esta documentación.
```

## 4. La primera visita a la consola

La creación de claves, la selección del modelo y la consulta del consumo suelen hacerse en la consola. Los nombres de los menús varían, pero el trabajo es parecido.

### 4.1 Crea una clave y confirma que la petición llegó

La API Key es la credencial con la que la aplicación llama al modelo. Guárdala en una variable de entorno local. No la pongas en capturas, conversaciones ni código del navegador. Si puede haberse filtrado, revócala inmediatamente y crea otra.

Después de la primera petición abre Usage o Billing y busca un registro nuevo. Allí también verás el saldo y la quota. Si falla, distingue entre código que no envió nada, una petición rechazada y una cuenta sin cuota disponible.

![Página Usage de DeepSeek con saldo, gasto mensual y tendencia de llamadas](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-13-57-41.png)

*La página Usage de DeepSeek muestra el volumen de llamadas, el gasto y el saldo.*

Si el error incluye un Request ID o Trace ID, guárdalo. Este número permite localizar la petición concreta entre muchas llamadas simultáneas.

### 4.2 Elige el modelo y copia el nombre exacto de llamada

El catálogo muestra los modelos de texto, imagen, voz y vídeo disponibles. Entra en el detalle y copia el Model ID que se utiliza en el código; puede no coincidir con el nombre visible.

![Catálogo de SiliconFlow con filtros de texto, imagen, vídeo y voz](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-05-04.webp)

*El catálogo de SiliconFlow permite filtrar por tipo de capacidad.*

Algunas plataformas piden elegir una Region o crear un Deployment antes de proporcionar Base URL y Endpoint. Sigue su guía rápida y no confundas la URL de la consola con la dirección de la API.

![Acceso rápido de Volcengine Ark con API Key y pasos de prueba](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-23-13-01.png)

*Volcengine Ark reúne la creación de la clave, la elección del modelo y un ejemplo ejecutable.*

### 4.3 Límites de uso y tareas largas

RPM y TPM indican las peticiones y los tokens permitidos por minuto. Los servicios de imagen, voz y vídeo también pueden limitar la Concurrency, es decir, cuántos trabajos se ejecutan a la vez. Al superar el límite suele aparecer `429`; espera y vuelve a intentarlo en lugar de pulsar repetidamente.

Las tareas largas, como el vídeo, no devuelven el archivo al instante. Primero entregan un Task ID. El programa consulta su progreso o usa un Callback/Webhook para que la plataforma avise al servidor. El File ID o la URL temporal pueden caducar, por lo que antes de publicar hay que decidir si se guarda el archivo en almacenamiento propio.

La documentación también incluye `max_tokens`, `temperature` y `stream`. Mantén los valores del ejemplo oficial en la primera versión. Cambia `max_tokens` si la salida se corta y activa `stream` si necesitas mostrarla poco a poco. No modifiques todos los parámetros a la vez.

## 5. Lleva el ejemplo oficial a la página

Cuando el ejemplo del terminal funcione, intégralo en este orden:

1. Guarda la clave en `.env.local` u otro archivo que no se suba a Git.
2. Llama al modelo desde un servidor o una Serverless Function.
3. Haz que la página llame a tu propia ruta `/api/...`, sin transportar la clave externa.
4. Añade estados de espera, éxito y error al botón.
5. Vuelve a Usage para confirmar una llamada real.

```text
Página del navegador
    │ solo envía datos de negocio
    ▼
Tu ruta /api ── lee la API Key de una variable de entorno del servidor
    │
    ▼
Servicio de IA ── devuelve texto, JSON, un archivo o task_id
```

::: warning Protege la API Key
No escribas una API Key en código de Vue, React o HTML que se ejecute en el navegador. Aunque la variable empiece por `VITE_` o `NEXT_PUBLIC_`, puede terminar dentro del paquete público. En un despliegue público, llama al modelo desde un backend, una Serverless Function o una pasarela protegida.
:::

### 5.1 Algunas API no responden inmediatamente

El texto corto, la comprensión de imágenes y la transcripción de audios breves suelen responder en una sola petición. Una conversación o voz en tiempo real puede llegar por streaming y mostrarse conforme se recibe.

La generación de imagen y vídeo suele ser asíncrona: la primera petición solo devuelve `task_id` y después se consulta si está en cola, procesando, completada o fallida. Puede tardar decenas de segundos, de modo que la página no debe quedarse en un «Cargando» inmóvil.

## 6. Conecta primero la generación de texto

La [documentación de la API de DeepSeek](https://api-docs.deepseek.com/) ofrece una interfaz de texto compatible con SDK habituales. Los modelos cambian; copia el ID vigente desde la [lista de modelos](https://api-docs.deepseek.com/api/list-models).

Envía primero una petición con curl y los mismos datos de producto que usaste en la zona de pruebas.

```bash
curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${DEEPSEEK_API_KEY}" \
  -d '{
    "model": "deepseek-v4-flash",
    "messages": [
      {"role": "system", "content": "Devuelve JSON con title, summary y selling_points. selling_points debe contener tres elementos. No inventes precios, ventas ni efectos."},
      {"role": "user", "content": "Quiero publicar una mochila de nailon negro para ir al trabajo. Escribe un título breve, una introducción y tres argumentos de venta."}
    ],
    "stream": false
  }'
```

Configura la clave en una variable de entorno y ejecuta el comando. Cuando funcione, entrega el mismo ejemplo y el prompt de integración de la sección 2 al IDE. La primera versión puede tener un solo botón y un producto fijo; conecta el formulario completo después.

### Prueba con dos productos

Cambia el nombre, material y color y genera otra vez. Si cada resultado corresponde a su entrada y la página lo muestra correctamente, la integración mínima funciona. Después elimina un dato y comprueba que el modelo no inventa precios, efectos o ventas. Usa temporalmente una clave incorrecta para comprobar el mensaje de error.

Por último, confirma las llamadas en Usage. Ver texto en la página no demuestra que proceda de la API: los datos simulados olvidados pueden producir una pantalla parecida.

## 7. Comprensión de imágenes con Qwen3-VL

Un modelo de visión recibe una imagen y una pregunta. Pregunta por los datos que necesita la página; «¿qué hay en la imagen?» suele producir una descripción demasiado general.

```text
Observa esta foto de producto. Indica qué objeto es, su color principal,
los materiales y detalles estructurales visibles y cualquier texto de la imagen.

Di claramente lo que no se vea. No adivines marca, precio ni ventas.
Devuelve JSON para que pueda mostrarlo en la página.
```

El [catálogo de SiliconFlow](https://cloud.siliconflow.cn/models) permite filtrar los modelos de visión disponibles. Aquí usamos `Qwen/Qwen3-VL-8B-Instruct` para explicar la estructura; confirma el Model ID actual antes de ejecutarlo.

```python
import base64
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SILICONFLOW_API_KEY"],
    base_url="https://api.siliconflow.cn/v1"
)

with open("product.jpg", "rb") as image_file:
    image_data = base64.b64encode(image_file.read()).decode("utf-8")

response = client.chat.completions.create(
    model="Qwen/Qwen3-VL-8B-Instruct",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Devuelve JSON con la categoría, el color, los materiales y la estructura visibles y el texto de la imagen. No adivines lo que no se vea."},
            {"type": "image_url", "image_url": {
                "url": f"data:image/jpeg;base64,{image_data}"
            }}
        ]
    }]
)
```

![Integración de una API de comprensión de imágenes en el IDE](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-34-36.webp)

*Es más fácil detectar errores si la persona confirma primero los datos identificados y después genera el texto final.*

## 8. Genera y modifica imágenes de producto

[Seedream](https://seed.bytedance.com/en/blog/deeper-thinking-more-accurate-generation-introducing-seedream-5-0-lite) genera imágenes desde texto y modifica una imagen de referencia. En fotografía de producto hay que evitar un resultado atractivo en el que el objeto haya cambiado; describe también las partes que deben conservarse.

```text
Convierte la mochila negra de la referencia en un cartel vertical de producto.
Ponla en el centro de una superficie gris clara, con luz suave y espacio arriba para un título.
No añadas texto, logotipo ni precio, y no cambies cremalleras, tirantes ni bolsillos.
```

Después de la primera generación, comprueba la deformación del producto antes que el fondo y la composición. No empieces acumulando términos de estilo.

Copia el Model ID y la petición mínima actuales desde la [consola de Volcengine Ark](https://www.volcengine.com/experience/ark?launch=seedream). No conserves indefinidamente el número de versión de un tutorial.

```bash
curl -X POST https://ark.cn-beijing.volces.com/api/v3/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ARK_API_KEY}" \
  -d '{
    "model": "<copia el Model ID actual de la consola>",
    "prompt": "Convierte la mochila negra de referencia en un cartel vertical limpio. No añadas texto, logotipo ni precio y no cambies la estructura de la mochila.",
    "image": ["https://example.com/product-reference.png"],
    "response_format": "url",
    "stream": false,
    "watermark": false
  }'
```

![Resultado de la generación de imágenes integrada en el producto](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-23-21-13.webp)

Las URL de imagen pueden caducar. Un prototipo puede mostrarlas directamente; un producto debe decidir, según las condiciones del servicio, si las copia a su almacenamiento y registrar prompt, versión del modelo y fecha.

## 9. Reconocer y sintetizar voz son API diferentes

- **ASR / STT** convierte la voz o un archivo de audio en texto.
- **TTS** convierte texto en voz reproducible.

Tienen entradas, salidas e interacciones distintas. No las escondas tras un único botón ambiguo de «API de voz».

### 9.1 Voz a texto: subir audio y recibir una transcripción

La [documentación de transcripción de SiliconFlow](https://docs.siliconflow.cn/cn/api-reference/audio/create-audio-transcriptions) utiliza `multipart/form-data` para subir el archivo, no JSON.

```bash
curl --request POST \
  --url https://api.siliconflow.cn/v1/audio/transcriptions \
  -H "Authorization: Bearer ${SILICONFLOW_API_KEY}" \
  -F "file=@meeting.mp3" \
  -F "model=FunAudioLLM/SenseVoiceSmall"
```

```text
Añade un botón «Subir y transcribir una grabación» a la página actual.

Cuando se suba un archivo mp3, m4a o wav, llama desde el servidor a la API de abajo
y coloca la transcripción en un cuadro de texto editable.
Guarda la API Key en una variable de entorno y permite reintentar tras un error.

Ejemplo oficial:
<pega el ejemplo curl anterior>
```

### 9.2 Texto a voz puede devolver audio en lugar de JSON

La [documentación T2A HTTP de MiniMax](https://platform.minimax.io/docs/api-reference/speech-t2a-http) ofrece síntesis síncrona. El ejemplo actual utiliza `speech-2.8-hd`; confirma el modelo y la voz en la plataforma.

Prepara números, siglas y pausas para la lectura y después elige voz, velocidad, volumen, emoción y formato. No envíes a locución una página completa con Markdown, URL y etiquetas de botones.

```bash
curl --request POST \
  --url https://api.minimax.io/v1/t2a_v2 \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "speech-2.8-hd",
    "text": "Esta es una muestra de audio de la presentación del producto.",
    "stream": false,
    "output_format": "hex",
    "language_boost": "auto",
    "voice_setting": {
      "voice_id": "<copia voice_id de la lista de voces>",
      "speed": 1,
      "vol": 1,
      "pitch": 0
    },
    "audio_setting": {
      "sample_rate": 32000,
      "bitrate": 128000,
      "format": "mp3",
      "channel": 1
    }
  }'
```

La página de audio también necesita reproducir, detener, volver a generar y descargar. TTS por streaming usa WebSocket o HTTP en streaming y reproduce cada fragmento al llegar.

::: warning Voz y privacidad
Antes de subir una grabación explica el uso, el plazo de conservación y la forma de borrarla. La clonación de voz requiere permiso explícito de su propietario. No uses grabaciones ajenas o de personajes públicos cuya procedencia no esté clara.
:::

## 10. Generación de vídeo: crea una tarea y espera el resultado

El vídeo suele usar una API asíncrona. La [guía de vídeo de MiniMax](https://platform.minimax.io/docs/guides/video-generation) divide el flujo en crear una tarea y recibir `task_id`, consultar hasta obtener `file_id` y solicitar la descarga.

### 10.1 Explica también cómo cambia la escena

Un prompt de vídeo debe describir posición inicial, orden del movimiento, cámara y duración.

```text
Muestra esta mochila negra durante seis segundos sobre un expositor gris claro.
La cámara se mueve lentamente desde el frente hacia la derecha y después se acerca un poco.
Mantén el formato vertical. No cambies la mochila ni añadas personas, texto o logotipos.
```

Si hay muchas acciones, empieza con un plano y un movimiento principal. Girar, abrir, ampliar y cambiar de escena a la vez dificulta conservar la forma del producto.

### 10.2 Crear y consultar son dos peticiones

```bash
# Paso 1: crear la tarea
curl --request POST \
  --url https://api.minimax.io/v1/video_generation \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "MiniMax-Hailuo-2.3",
    "prompt": "Muestra una mochila negra sobre un expositor gris claro. La cámara se mueve del frente hacia la derecha y se acerca un poco. No cambies la mochila ni añadas personas, texto o logotipos.",
    "duration": 6,
    "resolution": "1080P"
  }'

# Paso 2: consultar con el task_id recibido
curl --request GET \
  --url "https://api.minimax.io/v1/query/video_generation?task_id=<TASK_ID>" \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}"
```

La página debe mostrar `Preparing`, `Queueing`, `Processing`, `Success` y `Fail`. Define intervalo y condición de parada. En producción se puede usar `callback_url` para que la plataforma avise al servidor.

::: warning Vídeo y material de personas reales
Si utilizas fotos o voces de personas, marcas o material protegido, confirma los permisos y las normas de la plataforma. Algunos servicios exigen verificación facial, registro del material o moderación; no son pasos que deban esquivarse desde el navegador.
:::

## 11. Cómo diagnosticar problemas habituales

| Síntoma | Comprueba primero |
| --- | --- |
| `401 / 403` | Clave, permisos y cabecera de autorización |
| `404` | Base URL, Endpoint y Model ID actuales |
| `429` | RPM, TPM, concurrencia y nivel de uso de la cuenta |
| `400` | Parámetros obligatorios, formato, JSON y tamaño |
| `5xx / timeout` | Estado del servicio, tiempo límite y reintentos |
| Siempre en cola | Concurrencia, consulta del estado, cuota y carga |
| Éxito sin contenido | Ruta del campo, binarios y URL temporal caducada |
| Funciona localmente, falla en producción | Variables de entorno, CORS, límite Serverless y red regional |

Guarda hora, tipo de petición, estado HTTP y Request ID o Trace ID. No escribas en los registros la API Key, una grabación completa ni datos empresariales sensibles.

## 12. 📚 Tarea del capítulo

<StageAssignmentCard title="Añade una función de IA a tu prototipo">

  <p>Elige un botón que necesite realmente IA. La primera versión solo requiere una capacidad; no es necesario implementar texto, imagen, voz y vídeo a la vez.</p>

  <ol>
    <li>Busca el Model ID actual y el ejemplo mínimo en la documentación oficial.</li>
    <li>Entrega el ejemplo al IDE con IA y conéctalo al botón.</li>
    <li>Guarda la API Key en una variable del servidor y añade los estados de espera y error.</li>
    <li>Realiza una llamada real y confirma en Usage o en los registros que llegó al servicio.</li>
  </ol>

  <p>Guarda una captura y explica en una frase qué hace la IA por la persona en esta página. Confirma el permiso antes de usar imágenes, voces o material de otras personas.</p>
</StageAssignmentCard>

## Siguiente paso

El próximo capítulo devuelve estas funciones al flujo completo del producto. Añadiremos datos, estados y respuesta a la persona para convertir una llamada aislada en un prototipo de uso repetido.

<RelatedArticlesSection
  title="Artículos relacionados"
  description="Pasa de una función de IA a un flujo de producto completo."
  :items="relatedArticles"
/>
