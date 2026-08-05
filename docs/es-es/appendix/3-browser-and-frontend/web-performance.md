# Principios de optimización del rendimiento web
::: tip 🎯 Pregunta central
**¿Por qué tu página web carga lentamente y los usuarios se quejan constantemente de que se traba?** Es como preguntar: ¿por qué la comida tarda en servirse en un restaurante y los clientes se impacientan? Este capítulo te guiará a través de los conceptos fundamentales de optimización del rendimiento frontend para que tu página web "vuele".
:::

---

## 1. Motivación de "optimizar el rendimiento"

### 1.1 De funcional a usable: la evolución de la optimización de rendimiento

Hace diez años, las páginas web eran muy simples — una página podía ocupar apenas unos pocos KB y la velocidad de carga era casi imperceptible. En aquel entonces, ni siquiera necesitábamos pensar en la optimización de rendimiento, porque el problema ni siquiera existía.

Pero ahora todo es completamente diferente. La complejidad de las páginas web modernas ha crecido exponencialmente: una página de inicio de comercio electrónico puede tener decenas de imágenes en alta definición, una plataforma social puede cargar miles de publicaciones simultáneamente, y un panel de administración puede contener decenas de componentes interactivos. Detrás de estas funcionalidades "ricas" hay una enorme cantidad de código y recursos — si no se optimizan adecuadamente, la experiencia del usuario será desastrosa.

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**👴 Páginas web de hace diez años**
- Una sola página ocupaba entre unos pocos KB y decenas de KB
- Solo texto y pocas imágenes
- Los usuarios apenas percibían retrasos en la carga
- No se necesitaba ninguna optimización de rendimiento

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 Páginas web modernas**
- Una sola página puede ocupar varios MB o incluso más
- Incluyen imágenes HD, videos y componentes interactivos
- Carga lenta, scroll con trabas, clics con respuesta tardía
- La optimización de rendimiento es obligatoria para que sea usable

</div>
</div>

**Este es el problema que la "optimización de rendimiento" busca resolver: reducir el tiempo de espera del usuario y hacer que las operaciones sean más fluidas.**

### 1.2 Una historia real de tropiezos:Motivación: entender la optimización de rendimiento

Podrías decir: "Con las redes tan rápidas y los dispositivos tan potentes de hoy, ¿realmente hace falta optimizar el rendimiento?" Déjame contarte una historia real para que entiendas por qué este conocimiento es tan importante.

::: warning La historia de tropiezos de rendimiento de Xiao Wang
Xiao Wang es un ingeniero frontend recién incorporado, encargado de desarrollar la página de inicio de comercio electrónico de la empresa. Usó el último Vue 3, la librería de UI más popular, y las funcionalidades quedaron muy completas. En sus pruebas con el ordenador de alto rendimiento de la empresa, todo funcionaba perfectamente.

Pero al día siguiente del lanzamiento, el departamento de atención al cliente explotó — una avalancha de usuarios se quejaba de que "el sitio va muy lento", "las imágenes no cargan", "hago clic en los botones y no pasa nada durante un buen rato". Xiao Wang abrió su máquina de desarrollo para probar y todo iba fluido. No entendía en absoluto dónde estaba el problema.

Más tarde, pidió ayuda a un mentor para diagnosticarlo. El mentor le hizo usar un portátil normal, conectarse a una red 4G común, y luego probar su propio sitio web. Xiao Wang se quedó atónito: la página de inicio tardaba más de diez segundos en cargar, al hacer scroll en la lista iba a trompicones como un PowerPoint, y al hacer clic en un botón tardaba varios segundos en responder.

Resulta que el entorno de desarrollo de Xiao Wang era un MacBook Pro de gama alta + fibra de gigabit, mientras que la mayoría de los usuarios usan dispositivos normales + redes móviles. En su código había docenas de imágenes HD sin comprimir, importaba la librería de UI entera aunque solo usaba unos pocos componentes, y además realizaba muchos cálculos síncronos durante el renderizado.

La solución en realidad no era compleja: comprimir imágenes, importar componentes bajo demanda, mover los cálculos a hilos en segundo plano y usar listas virtuales. Después de estos cambios, el tiempo de carga de la página de inicio pasó de más de diez segundos a 2 segundos, el scroll se volvió muy fluido y las quejas de los usuarios desaparecieron de inmediato.

Desde entonces, Xiao Wang entendió una lección: **sin entender la optimización de rendimiento, el código que escribes puede volar en tu propio ordenador, pero en los dispositivos de los usuarios puede ser directamente inutilizable.**
:::

::: info 💡 Enseñanza clave
La optimización de rendimiento no es opcional, es una habilidad esencial. Debes pensar desde la perspectiva del usuario — usan dispositivos normales y redes normales. Si tu código no funciona bien en sus dispositivos, significa que necesitas optimizarlo.
:::

---

## 2. Conceptos fundamentales: carga, renderizado e interacción

::: tip 🤔 ¿Qué relación tienen estos conceptos con el rendimiento?
Carga, renderizado e interacción son los tres eslabones fundamentales por los que pasa un usuario al visitar una página web, y cada uno de ellos puede convertirse en un cuello de botella de rendimiento.

Cuando un usuario visita tu página web, pasa secuencialmente por:
1. **Carga** → descargar HTML/CSS/JS/imágenes del servidor al navegador
2. **Renderizado** → "dibujar" el contenido descargado para convertirlo en la página que el usuario ve
3. **Interacción** → responder a las operaciones del usuario como clics, scroll, etc.

Por lo tanto, **la optimización de rendimiento consiste en hacer que estos tres eslabones sean más rápidos**. Entenderlos te permitirá saber dónde está el cuello de botella de rendimiento y qué método usar para optimizarlo.
:::

Antes de profundizar en técnicas específicas de optimización, necesitamos aclarar estos conceptos fundamentales. Para ayudarte a entenderlos mejor, usaremos una analogía con un restaurante para ilustrar la relación entre ellos.

### 2.1 Entendiendo los tres eslabones con la analogía del restaurante

Imagina que vas a un restaurante a comer. Este proceso es sorprendentemente similar a visitar una página web:

| Eslabón | 🍽️ Analogía del restaurante | Función real | Ejemplo concreto |
|------|-------------|----------|----------|
| **Carga** | Transportar los ingredientes del almacén a la cocina | Descargar HTML/CSS/JS/imágenes del servidor al navegador | El usuario abre la página web, el navegador empieza a descargar recursos |
| **Renderizado** | El chef transforma los ingredientes en platos | El navegador convierte el código en la página que el usuario ve | El navegador analiza el HTML, calcula el layout, dibuja la página |
| **Interacción** | El camarero atiende las peticiones del cliente | El navegador responde a clics, scroll y otras operaciones | El usuario hace clic en un botón, la página responde |

### 2.2 Carga (Loading): el transporte de ingredientes

La carga se refiere al proceso de descargar los recursos necesarios para la página web (HTML, CSS, JavaScript, imágenes, fuentes, etc.) desde el servidor al navegador. Este proceso es como transportar ingredientes del almacén a la cocina — si el transporte es lento o hay demasiados ingredientes, la cocina se queda esperando.

**¿Por qué la carga puede ser lenta?** Principalmente por tres razones: primero, el tamaño de los recursos es demasiado grande — una imagen HD sin comprimir puede ocupar 5MB, equivalente a descargar una novela; segundo, la latencia de red — si el servidor está en el extranjero o el usuario usa una red móvil, cada petición tarda mucho; tercero, demasiadas peticiones — el navegador tiene un límite de descargas simultáneas, y si hay demasiados recursos, tienen que hacer cola.

::: details 🔍 Veamos qué ocurre durante la fase de carga
Cuando el usuario escribe una URL en la barra de direcciones y pulsa Enter, ocurre lo siguiente en secuencia:

1. **Resolución DNS**: convertir el nombre de dominio (ej. `www.example.com`) en una dirección IP (ej. `192.168.1.1`), como buscar la dirección de un restaurante en la guía telefónica
2. **Conexión TCP**: el navegador y el servidor establecen una conexión, como marcar un número antes de llamar
3. **Handshake TLS**: establecer una conexión segura (HTTPS), como verificar la identidad de la otra parte
4. **Solicitar recursos**: el navegador solicita el archivo HTML al servidor
5. **Analizar HTML**: el navegador analiza el HTML, descubre que necesita CSS, JS, imágenes y otros recursos, y continúa solicitándolos
6. **Descargar recursos**: descargar todos los recursos necesarios al dispositivo local
7. **Comenzar el renderizado**: una vez completada la descarga, comienza el renderizado de la página

Los pasos 1-4 se denominan "Tiempo hasta el primer byte" (TTFB), y los pasos 5-7 son el tiempo real de descarga de recursos.
:::

**Técnicas comunes de optimización de carga:**

- **Comprimir recursos**: reducir el tamaño de los archivos (compresión Gzip, Brotli)
- **Usar CDN**: almacenar los archivos en servidores más cercanos al usuario
- **Carga perezosa (Lazy Loading)**: cargar solo el contenido visible para el usuario, el resto se carga cuando el usuario hace scroll
- **División de código (Code Splitting)**: dividir archivos grandes en archivos más pequeños y cargarlos bajo demanda

### 2.3 Renderizado (Rendering): el chef cocinando

El renderizado se refiere al proceso mediante el cual el navegador convierte el HTML, CSS y JavaScript descargados en la página que el usuario puede ver. Este proceso es como el chef transformando ingredientes en platos — si el proceso es complejo y tiene muchos pasos, servir la comida tardará más.

::: tip 📖 ¿Qué es el "renderizado"?
Quizás hayas oído el término "renderizado", pero ¿qué es exactamente?

**En pocas palabras, el renderizado es el proceso de convertir código en una imagen visual.**

Lo que el navegador debe hacer incluye:
1. **Analizar HTML** → generar el árbol DOM (la estructura de la página)
2. **Analizar CSS** → generar el árbol CSSOM (los estilos de la página)
3. **Combinar** → generar el árbol de renderizado (combinación de estructura y estilos)
4. **Layout** → calcular la posición y el tamaño de cada elemento
5. **Pintar (Paint)** → dibujar los elementos
6. **Componer (Composite)** → fusionar múltiples capas en la imagen final

Este proceso es muy complejo — cualquier problema en cualquiera de estos pasos provocará que la página se trabe.
:::

**¿Por qué el renderizado puede ser lento?** Principalmente por dos razones: primero, la página es demasiado compleja — si una página tiene decenas de miles de nodos DOM, el navegador tardará mucho en calcular el layout y pintar; segundo, modificaciones frecuentes de la página — si el código JavaScript modifica el DOM con frecuencia, el navegador tendrá que recalcular el layout y repintar repetidamente, consumiendo mucho rendimiento.

::: details 📁 Veamos qué ocurre durante la fase de renderizado
**El flujo completo de renderizado**:

```
HTML (cadena de texto)
    ↓
[Analizar HTML] → generar el árbol DOM
    ↓
Árbol DOM (estructura de la página)

CSS (hoja de estilos)
    ↓
[Analizar CSS] → generar el árbol CSSOM
    ↓
Árbol CSSOM (estilos de la página)

Árbol DOM + Árbol CSSOM
    ↓
[Combinar] → generar el árbol de renderizado
    ↓
Árbol de renderizado (elementos a renderizar)
    ↓
[Layout] → calcular la posición y el tamaño de cada elemento
    ↓
[Paint] → rellenar colores, dibujar texto
    ↓
[Composite] → fusionar múltiples capas
    ↓
Imagen final
```

**Ruta crítica de renderizado (Critical Rendering Path)**: el navegador debe renderizar el contenido de la primera pantalla lo antes posible, para que el usuario sienta que "el sitio es rápido". Esto se llama "optimización de la ruta crítica de renderizado".
:::

👇 **Pruébalo tú mismo**:
La siguiente demostración muestra cómo el navegador renderiza una página. Haz clic en "Siguiente" para observar las distintas fases del renderizado:

<PerformanceOverviewDemo />

**Técnicas comunes de optimización de renderizado:**

- **Reducir reflows y repaints**: evitar modificar el DOM con frecuencia, usar `transform` y `opacity` en lugar de `top` y `width`
- **Listas virtuales**: renderizar solo el contenido del área visible — con grandes volúmenes de datos la mejora de rendimiento es notable
- **Animaciones CSS**: usar animaciones CSS en lugar de animaciones JavaScript, mejor rendimiento

### 2.4 Interacción (Interaction): el camarero respondiendo

La interacción se refiere al proceso mediante el cual el navegador responde a las operaciones del usuario (clics, scroll, entrada de texto, etc.). Este proceso es como el camarero atendiendo las peticiones del cliente — si el camarero está desbordado, el cliente tiene que esperar.

**¿Por qué la interacción puede trabarse?** La razón principal es que **el hilo principal está bloqueado**. El JavaScript del navegador es de un solo hilo — si el código está ejecutando cálculos complejos, no puede responder a las operaciones del usuario, provocando que la página se trabe.

::: tip 🤔 ¿Qué es el "hilo principal"?
El navegador tiene múltiples hilos, pero solo uno es responsable de ejecutar JavaScript, renderizar la página y responder a las operaciones del usuario — **el hilo principal**.

Puedes imaginar el hilo principal como un **camarero ocupado** que tiene que hacer muchas cosas:
- Ejecutar código JavaScript (calcular datos, llamar a APIs)
- Renderizar la página (layout, pintado)
- Responder a las operaciones del usuario (clic en botones, scroll de página)

El problema es: **solo hay una persona**. Si está ejecutando un cálculo JavaScript complejo (por ejemplo, procesar diez mil registros de datos) y en ese momento el usuario hace clic en un botón, no puede responder inmediatamente — tiene que esperar a que termine el cálculo. Esta es la raíz de **los bloqueos**.

**Solución**:
- Mover los cálculos complejos a un Web Worker (hilo en segundo plano)
- Usar time slicing, dividiendo tareas grandes en tareas pequeñas
- Evitar operaciones síncronas complejas, usar asíncronas en su lugar
:::

👇 **Pruébalo tú mismo**:
La siguiente demostración compara la diferencia entre cálculo síncrono y Web Worker. Haz clic en "Iniciar cálculo" y observa si la página se traba:

<PerformanceMetricsDemo />

**Técnicas comunes de optimización de interacción:**

- **Debounce y throttle**: limitar la frecuencia de activación de eventos (como eventos de scroll, eventos de entrada)
- **Web Worker**: mover cálculos complejos a hilos en segundo plano, sin bloquear el hilo principal
- **Time slicing**: dividir tareas grandes en tareas pequeñas, dando al navegador la oportunidad de responder a las operaciones del usuario

---

## 3. Caso práctico: el camino de evolución de optimización de rendimiento de un equipo

Hemos cubierto muchos conceptos. Ahora veamos un caso real: cómo una startup pasó de "no considerar el rendimiento en absoluto" a una "optimización de rendimiento sistemática". A través de este caso, entenderás de forma más intuitiva qué problemas resuelve realmente la optimización de rendimiento.

### 3.1 Panorama general de la evolución

La siguiente tabla muestra las cuatro fases de la optimización de rendimiento. Puedes ver cómo las técnicas, herramientas y métricas evolucionan paso a paso:

| Fase | Técnicas de optimización | Herramientas de monitoreo | Métricas clave | Cambio fundamental |
|------|---------|---------|---------|----------|
| **Fase 1: Era primitiva** | Ninguna (no se consideraba) | Ninguna (a ojo) | Ninguna | Sin conciencia de rendimiento, con que funcionara bastaba |
| **Fase 2: Optimización manual** | Comprimir imágenes, reducir peticiones | Panel Network del navegador | Tiempo de carga de página | Se empieza a tener conciencia, pero con métodos rudimentarios |
| **Fase 3: Optimización sistemática** | Code splitting, lazy loading, listas virtuales | Lighthouse, panel Performance | FCP, LCP, TBT | Uso de herramientas profesionales, con objetivos de optimización claros |
| **Fase 4: Optimización continua** | Presupuesto de rendimiento, verificación CI/CD | RUM, Lighthouse CI | INP, CLS, monitoreo de trazabilidad completa | El rendimiento se integra en el flujo de desarrollo |

::: tip 📊 ¿Qué puedes ver en esta tabla?
Interpretemos esta tabla fila por fila:

**Fase 1 → Fase 2**: de "sin conciencia" a "con conciencia". Este es un paso clave — los desarrolladores empiezan a darse cuenta de que el rendimiento es un problema e intentan optimizarlo. Pero las técnicas son bastante rudimentarias, basadas principalmente en la intuición y la experiencia.

**Fase 2 → Fase 3**: de "manual" a "sistemático". Este es un salto cualitativo — se empiezan a usar herramientas profesionales (Lighthouse, panel Performance) para diagnosticar problemas de rendimiento, con métodos científicos (code splitting, lazy loading) para optimizar, en lugar de ir a ojo.

**Fase 3 → Fase 4**: de "optimización puntual" a "optimización continua". Cuando la optimización de rendimiento se convierte en parte del flujo de desarrollo, se necesita establecer un sistema de monitoreo (RUM, monitoreo de usuarios reales) y configurar presupuestos de rendimiento en la fase de desarrollo para prevenir regresiones.

**En resumen**: la evolución de la optimización de rendimiento no es solo "usar más tecnología", sino **una mejora completa de la mentalidad** — de responder reactivamente a prevenir proactivamente, de la intuición a los datos, de la optimización puntual a la mejora continua.
:::

### 3.2 Fase 1: Era primitiva — sin consideración alguna

¿Por qué se llama "era primitiva"? Porque en esta fase no se consideraba en absoluto el rendimiento — con que funcionara, bastaba. El equipo era de solo 3 personas, haciendo un sitio web corporativo simple. El proyecto era pequeño y no parecía haber problemas.

Pero a medida que el proyecto crecía y los usuarios aumentaban, los problemas empezaron a aflorar.

**Forma de trabajo**:
- **Técnicas de optimización**: ninguna, desarrollo directo sin considerar el rendimiento
- **Herramientas de monitoreo**: ninguna, se juzgaba la velocidad a ojo
- **Métricas clave**: ninguna

**Características de esta fase**:
- ✅ **Ventajas**: desarrollo rápido, sin coste de aprendizaje adicional
- ❌ **Desventajas**: mala experiencia de usuario, con redes lentas era directamente inutilizable

::: details Ver los problemas de aquel entonces
**Problemas concretos encontrados**:

1. **Imágenes demasiado grandes**: el product manager subió una imagen de banner de 5MB para la página de inicio — los usuarios con red móvil tenían que esperar 1 minuto para que se abriera la página
2. **Sin compresión**: los archivos CSS y JS no estaban comprimidos en absoluto, su tamaño era 3 veces mayor que comprimidos
3. **Sin caché**: en cada visita se volvían a descargar todos los recursos, incluso los usuarios recurrentes tenían que esperar
4. **Carga síncrona**: todos los archivos JS se cargaban de forma síncrona en el `<head>`, bloqueando el renderizado de la página

**Feedback de los usuarios**:
- "¿Por qué no se abre vuestra web?"
- "Las imágenes no terminan de cargar, solo se ve en blanco"
- "Hago clic en los botones y no pasa nada, ¿está rota la web?"

**Solución temporal de aquel entonces**:
```html
<!-- Usar una pantalla de carga para "engañar" al usuario -->
<div id="loading">Cargando...</div>
<script>
  // Solo se quita la pantalla de carga cuando la página ha terminado de cargar
  window.onload = function() {
    document.getElementById('loading').style.display = 'none'
  }
</script>
```

Esto era completamente "autoengañarse" — la página seguía siendo lenta, solo que el usuario no lo veía.
:::

### 3.3 Fase 2: Optimización manual — empieza la conciencia

Cuando los problemas de la era primitiva se acumularon lo suficiente, el equipo finalmente decidió empezar a optimizar el rendimiento. Este fue un punto de inflexión importante — de "no considerar en absoluto" a "optimizar con conciencia".

Pero la optimización en esta fase era bastante rudimentaria, basada principalmente en comprimir imágenes, combinar archivos y otras técnicas simples.

**Forma de trabajo**:
- **Técnicas de optimización**: comprimir imágenes manualmente, combinar archivos CSS/JS, reducir peticiones HTTP
- **Herramientas de monitoreo**: panel Network del navegador, registros de tiempo simples
- **Métricas clave**: tiempo de carga de página (medido manualmente con cronómetro)

**Características de esta fase**:
- ✅ **Ventajas**: mejora notable, los usuarios dejaron de quejarse masivamente
- ❌ **Desventajas**: optimización no sistemática, propensa a regresiones, falta de métricas cuantitativas

::: details Ver las prácticas concretas de optimización manual
**Técnicas de optimización manual**:

1. **Comprimir imágenes manualmente**:
   - Usar Photoshop para "Guardar para Web" en cada imagen manualmente
   - Convertir PNG a JPEG (compresión con pérdida, pero mucho menor tamaño)
   - Reducir las dimensiones de la imagen (por ejemplo, de 2000px de ancho a 800px)

2. **Combinar archivos manualmente**:
   ```html
   <!-- Antes de optimizar: 10 archivos JS = 10 peticiones -->
   <script src="utils.js"></script>
   <script src="api.js"></script>
   <script src="component-a.js"></script>
   <script src="component-b.js"></script>
   ... (6 más)

   <!-- Después de optimizar: 1 archivo JS combinado = 1 petición -->
   <script src="all.js"></script>
   ```

3. **Mover CSS/JS al final de la página**:
   ```html
   <body>
     <!-- Contenido de la página -->
     <h1>Bienvenido</h1>

     <!-- Optimización: poner CSS/JS al final -->
     <link rel="stylesheet" href="style.css">
     <script src="app.js"></script>
   </body>
   ```

**Mejoras conseguidas**:
- Tamaño de imágenes reducido de 5MB a 500KB (90% menos)
- Número de peticiones HTTP reducido de 30 a 5
- Tiempo de carga de página reducido de 30 segundos a 8 segundos

**Nuevos puntos débiles**:
1. **Gran carga de trabajo manual**: cada actualización requería comprimir imágenes y combinar archivos manualmente
2. **Fácil de olvidar**: los nuevos no sabían que había que optimizar, subían las imágenes originales directamente
3. **Falta de cuantificación**: solo se sabía que "iba más rápido", pero no cuánto exactamente
:::

### 3.4 Fase 3: Optimización sistemática — con herramientas y datos

Los problemas de la fase 2 (gran carga de trabajo manual, falta de cuantificación) atormentaron al equipo durante mucho tiempo. Hasta que más tarde, el equipo descubrió herramientas profesionales como Lighthouse y el panel Performance, entrando en la era de la optimización sistemática.

El núcleo de esta fase es **la optimización basada en datos** — primero diagnosticar problemas con herramientas, encontrar los cuellos de botella de rendimiento, y luego optimizar de forma dirigida.

**Forma de trabajo**:
- **Técnicas de optimización**: code splitting, lazy loading, listas virtuales, compresión automática de imágenes
- **Herramientas de monitoreo**: Lighthouse, panel Performance de Chrome, WebPageTest
- **Métricas clave**: FCP (First Contentful Paint), LCP (Largest Contentful Paint), TBT (Total Blocking Time)

::: details Prácticas concretas de optimización sistemática
**Usar Lighthouse para diagnosticar problemas**:

Lighthouse es una herramienta de prueba de rendimiento automatizada desarrollada por Google que proporciona informes completos de rendimiento y recomendaciones de optimización.

```bash
# Usar Lighthouse para probar una página web
lighthouse https://www.example.com --view
```

Lighthouse te dará:
- **Puntuación de rendimiento** (0-100 puntos)
- **Métricas clave** (FCP, LCP, CLS, TBT, INP)
- **Recomendaciones de optimización** (como "activar compresión de texto", "eliminar JavaScript no utilizado")

**Interpretación de métricas clave**:

| Métrica | Nombre completo | Significado | Valor ideal |
|------|------|------|--------|
| **FCP** | First Contentful Paint | Tiempo hasta el primer contenido pintado (cuándo el usuario ve el primer contenido) | <1.8s |
| **LCP** | Largest Contentful Paint | Tiempo hasta el contenido más grande pintado (cuándo termina de cargar el contenido principal) | <2.5s |
| **TBT** | Total Blocking Time | Tiempo total de bloqueo (tiempo total que el hilo principal está bloqueado) | <200ms |
| **CLS** | Cumulative Layout Shift | Cambio acumulativo de layout (grado de desplazamiento de los elementos de la página) | <0.1 |

:::

**Características de esta fase**:
- ✅ **Ventajas**: optimización dirigida, buenos resultados, con métricas cuantitativas
- ❌ **Desventajas**: requiere aprender herramientas y métricas, tiene cierta curva de aprendizaje

::: details Ver las técnicas concretas de optimización sistemática
**1. Code Splitting (división de código)**:

Dividir archivos grandes en archivos pequeños y cargarlos bajo demanda. Por ejemplo, cuando el usuario visita la página de inicio, solo se carga el código necesario para la página de inicio; cuando hace clic en "Acerca de", se carga el código de la página "Acerca de".

```js
// Antes de optimizar: todo el código en un solo archivo, cargado de una vez
import About from './views/About.vue'
import Contact from './views/Contact.vue'
// ... 10 páginas más

// Después de optimizar: carga perezosa, solo se carga al visitar
const About = () => import('./views/About.vue')
const Contact = () => import('./views/Contact.vue')
```

**Resultado**: la cantidad de código cargado en la página de inicio se redujo un 70%, el tiempo de primera pantalla bajó de 5 segundos a 1.5 segundos.

**2. Lazy Loading de imágenes**:

Cargar solo las imágenes que el usuario puede ver; las demás se cargan cuando entran en el área visible al hacer scroll.

```html
<!-- Los navegadores modernos soportan lazy loading nativo -->
<img src="placeholder.jpg" data-src="real-image.jpg" loading="lazy" />
```

**Resultado**: el número de imágenes cargadas en la página de inicio se redujo de 20 a 3, ahorrando un 80% de ancho de banda.

**3. Virtual Scrolling (listas virtuales)**:

Si necesitas renderizar 10,000 registros, no crees realmente 10,000 nodos DOM — renderiza solo los 20 del área visible y reemplázalos dinámicamente al hacer scroll.

```vue
<!-- Usar el componente vue-virtual-scroller -->
<RecycleScroller
  :items="items"
  :item-size="50"
  key-field="id"
>
  <template #default="{ item }">
    <div>{{ item.name }}</div>
  </template>
</RecycleScroller>
```

**Resultado**: 10,000 registros pasaron de "congelar la página" a "scroll fluido", con un 95% menos de uso de memoria.
:::

### 3.5 Fase 4: Optimización continua — integrar el rendimiento en el flujo de desarrollo

Cuando las herramientas y los métodos maduraron, el equipo empezó a enfocarse en cuestiones más profundas: ¿cómo prevenir la regresión del rendimiento? ¿Cómo hacer que el rendimiento forme parte del flujo de desarrollo?

El núcleo de esta fase es **establecer un sistema de monitoreo y presupuesto de rendimiento** — no optimizar después del lanzamiento, sino prevenir los problemas de rendimiento durante la fase de desarrollo.

**Forma de trabajo**:
- **Técnicas de optimización**: presupuesto de rendimiento (Performance Budget), Lighthouse CI, monitoreo de usuarios reales (RUM)
- **Herramientas de monitoreo**: Lighthouse CI, API de WebPageTest, Google Analytics
- **Métricas clave**: INP (Interaction to Next Paint), CLS (Cumulative Layout Shift), monitoreo de trazabilidad completa

::: details Prácticas concretas de optimización continua
**1. Establecer un presupuesto de rendimiento**:

Configurar límites en la configuración de empaquetado — si se superan, se genera un error, evitando "introducir accidentalmente archivos grandes".

```js
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Limitar cada archivo a un máximo de 200KB
        chunkFileNames: 'js/[name]-[hash].js',
      }
    },
    // Advertir cuando se superen los 200KB
    chunkSizeWarningLimit: 200
  }
})
```

**2. Lighthouse CI**:

En cada commit de código, ejecutar automáticamente pruebas de Lighthouse. Si la puntuación de rendimiento baja, se bloquea el merge.

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://staging.example.com
          budgetPath: ./budget.json
```

**3. Monitoreo de usuarios reales (RUM)**:

Recopilar datos de rendimiento en los navegadores de usuarios reales, en lugar de probar solo en el entorno de desarrollo.

```js
// Enviar datos de rendimiento al servidor
const perfData = performance.getEntriesByType('navigation')[0]
const lcp = performance.getEntriesByType('largest-contentful-paint')[0]

fetch('/api/perf', {
  method: 'POST',
  body: JSON.stringify({
    fcp: perfData.loadEventEnd - perfData.fetchStart,
    lcp: lcp.renderTime || lcp.loadTime,
    url: window.location.href
  })
})
```

**Resultados**:
- Se puede detectar a tiempo la regresión de rendimiento (por ejemplo, un commit que hace que el LCP pase de 2 segundos a 5 segundos)
- Se puede entender la experiencia real del usuario (en lugar del "estado ideal" del entorno de desarrollo)
- Se puede optimizar de forma dirigida para el 10% de usuarios más lentos
:::

**¿Qué se hace en esta fase?**

1. **Presupuesto de rendimiento**: limitar el tamaño de archivos y el número de peticiones — alertar si se superan
2. **Verificación CI/CD**: probar el rendimiento automáticamente en cada commit — bloquear el merge si hay regresión
3. **Monitoreo de usuarios reales**: recopilar datos de rendimiento de usuarios reales, mejora continua
4. **Informes periódicos de rendimiento**: generar informes de rendimiento semanales/mensuales, seguir las tendencias

---

## 4. Cuellos de botella comunes de rendimiento y sus soluciones

Después de tanta teoría, veamos los problemas de rendimiento más comunes en el desarrollo real y cómo resolverlos.

### 4.1 Carga lenta de imágenes

**Síntoma**: las imágenes tardan mucho en cargar o la página salta durante el proceso de carga.

**Causas**:
- Imágenes con demasiado peso (originales en alta definición)
- Imágenes con dimensiones excesivas (imagen de 2000px de ancho mostrada a 200px)
- Sin lazy loading (todas las imágenes se cargan de una vez)

**Soluciones**:

1. **Usar formatos de imagen modernos** (WebP, AVIF):

```html
<!-- Moderno: formato WebP, 30-70% menos de tamaño -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Imagen">
</picture>
```

2. **Imágenes responsivas** (cargar diferentes tamaños según el dispositivo):

```html
<!-- Dispositivos pequeños cargan imagen pequeña, grandes cargan imagen grande -->
<img
  src="image-800.jpg"
  srcset="image-400.jpg 400w,
          image-800.jpg 800w,
          image-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px,
         (max-width: 1200px) 800px,
         1200px"
  alt="Imagen responsiva">
```

3. **Lazy loading** (cargar cuando el usuario llega con el scroll):

```html
<!-- Moderno: lazy loading nativo -->
<img src="placeholder.jpg" data-src="real-image.jpg" loading="lazy" />
```

👇 **Pruébalo tú mismo**:
La siguiente demostración compara la diferencia entre usar y no usar lazy loading. Observa las peticiones de red:

<ImageOptimizationDemo />

### 4.2 Primera pantalla lenta

**Síntoma**: el usuario abre la página web y ve una pantalla en blanco durante mucho tiempo.

**Causas**:
- Se carga demasiado código innecesario
- La ruta crítica de renderizado está bloqueada
- No se ha hecho code splitting

**Soluciones**:

1. **Code Splitting**:

```js
// Lazy loading de rutas: cargar solo al visitar
const routes = [
  {
    path: '/about',
    component: () => import('./views/About.vue')  // Solo se carga al visitar /about
  }
]
```

2. **Precarga de recursos críticos (Preload)**:

```html
<!-- Informar al navegador por adelantado: estos recursos son importantes, cárgalos primero -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="hero-image.jpg" as="image">
```

3. **CSS crítico inline**:

```html
<!-- Incrustar directamente en el HTML el CSS necesario para la primera pantalla -->
<style>
  /* Estilos críticos de la primera pantalla */
  .hero { background: #000; color: #fff; }
</style>
```

### 4.3 Scroll con trabas

**Síntoma**: al hacer scroll en la página, el movimiento no es fluido, va a trompicones.

**Causas**:
- Demasiados nodos DOM renderizados (por ejemplo, 10,000 registros)
- Cálculos complejos en los listeners de eventos de scroll
- Cálculos de layout activados con frecuencia

**Soluciones**:

1. **Virtual Scrolling**:

```vue
<!-- Renderizar solo el contenido del área visible -->
<RecycleScroller
  :items="10000"
  :item-size="50"
>
  <template #default="{ item }">
    <div>{{ item.name }}</div>
  </template>
</RecycleScroller>
```

👇 **Pruébalo tú mismo**:
La siguiente demostración compara la diferencia de rendimiento entre una lista normal y una lista virtual:

<VirtualScrollingDemo />

2. **Throttle en eventos de scroll**:

```js
// Limitar la frecuencia de activación del evento scroll (máximo una vez cada 100ms)
const throttledScroll = throttle(() => {
  updatePosition()
}, 100)

window.addEventListener('scroll', throttledScroll)
```

3. **Usar `will-change` de CSS**:

```css
/* Informar al navegador por adelantado: este elemento va a cambiar, prepárate */
.scroll-container {
  will-change: transform;
}
```

### 4.4 Respuesta lenta a clics

**Síntoma**: después de hacer clic en un botón, hay que esperar varios segundos para que responda.

**Causas**:
- Cálculos complejos en el manejador del evento de clic (bloqueando el hilo principal)
- No se usa debounce (el usuario hace clic rápido varias veces, activando el cálculo repetidamente)

**Soluciones**:

1. **Debounce en eventos de clic**:

```js
// Solo se ejecuta 300ms después de que el usuario deje de hacer clic
const debouncedClick = debounce(() => {
  submitForm()
}, 300)

button.addEventListener('click', debouncedClick)
```

2. **Usar Web Worker** (mover el cálculo a un hilo en segundo plano):

```js
// Hilo principal
const worker = new Worker('calculator.js')
button.addEventListener('click', () => {
  worker.postMessage({ data: largeData })
})

worker.onmessage = (e) => {
  // Cálculo completado, mostrar resultado
  showResult(e.data.result)
}

// calculator.js (hilo Worker)
self.onmessage = (e) => {
  const result = heavyCalculation(e.data.data)
  self.postMessage({ result })
}
```

---

## 5. Herramientas de monitoreo de rendimiento

La optimización de rendimiento no es un trabajo puntual — requiere monitoreo continuo. A continuación se presentan las herramientas más comunes.

### 5.1 Herramientas de desarrollo del navegador

**Chrome DevTools** es la herramienta de análisis de rendimiento más utilizada:

- **Panel Network**: ver la carga de recursos
- **Panel Performance**: analizar el rendimiento en tiempo de ejecución (FPS, actividad del hilo principal)
- **Lighthouse**: generar informes de rendimiento con un solo clic

::: tip Cómo usar el panel Performance
1. Abre Chrome DevTools (F12)
2. Cambia al panel Performance
3. Haz clic en el botón "Record"
4. Interactúa con la página web (scroll, clics, etc.)
5. Haz clic en "Stop" para detener la grabación
6. Analiza los resultados: observa los FPS, la actividad del hilo principal, las tareas largas, etc.
:::

### 5.2 Lighthouse

**Lighthouse** es una herramienta de prueba de rendimiento automatizada desarrollada por Google:

```bash
# Uso desde línea de comandos
lighthouse https://www.example.com --view

# O desde Chrome DevTools
# Abre DevTools → Lighthouse → Haz clic en "Analyze page load"
```

Lighthouse proporciona:
- Puntuación de rendimiento (0-100 puntos)
- Métricas clave (FCP, LCP, CLS, TBT, INP)
- Recomendaciones de optimización (ordenadas por impacto)

### 5.3 WebPageTest

**WebPageTest** es una herramienta de prueba de rendimiento online que permite probar desde múltiples ubicaciones y dispositivos:

```bash
# Visita https://www.webpagetest.org
# Introduce la URL, selecciona ubicación y dispositivo, haz clic en "Start Test"
```

WebPageTest proporciona:
- Diagrama de cascada (Waterfall): línea de tiempo de carga de cada recurso
- Comparación de video: video del proceso de carga antes y después de optimizar
- Recomendaciones de optimización

---

## 6. Lista de verificación de optimización de rendimiento

A continuación, una lista práctica de verificación de optimización de rendimiento. Puedes optimizar tu página web siguiendo este orden:

### 6.1 Optimización de carga

- ✅ **Comprimir imágenes**: usar formato WebP, calidad de compresión 80-85%
- ✅ **Imágenes responsivas**: cargar diferentes tamaños según el dispositivo
- ✅ **Lazy loading**: carga perezosa de imágenes y componentes, cargar solo el contenido visible
- ✅ **Code splitting**: dividir el código por rutas, cargar bajo demanda
- ✅ **Comprimir código**: activar compresión Gzip/Brotli
- ✅ **Usar CDN**: alojar recursos estáticos en CDN para acelerar la descarga
- ✅ **Precargar recursos críticos**: usar `<link rel="preload">`

### 6.2 Optimización de renderizado

- ✅ **Reducir reflows y repaints**: usar `transform` y `opacity` en lugar de `top` y `width`
- ✅ **Listas virtuales**: usar virtual scrolling con grandes volúmenes de datos
- ✅ **Animaciones CSS**: priorizar animaciones CSS sobre animaciones JavaScript
- ✅ **Optimizar la ruta crítica de renderizado**: CSS crítico inline, cargar CSS no crítico de forma diferida
- ✅ **Evitar @import**: `@import` bloquea el renderizado, usar `<link>` en su lugar

### 6.3 Optimización de interacción

- ✅ **Debounce y throttle**: usar debounce/throttle en eventos de scroll, entrada y resize
- ✅ **Web Worker**: mover cálculos complejos a hilos en segundo plano
- ✅ **Time slicing**: dividir tareas grandes en tareas pequeñas, evitar tareas largas
- ✅ **Evitar layout síncrono**: no leer propiedades de layout (como `offsetHeight`) dentro de bucles

### 6.4 Optimización de caché

- ✅ **Caché HTTP**: configurar Cache-Control y ETag
- ✅ **Service Worker**: cachear recursos estáticos, permitir acceso offline
- ✅ **LocalStorage**: cachear datos de API, reducir peticiones
- ✅ **Caché en memoria**: usar `Map`/`Object` para cachear resultados de cálculos

### 6.5 Optimización de monitoreo

- ✅ **Lighthouse CI**: probar el rendimiento automáticamente en cada commit
- ✅ **Monitoreo de usuarios reales**: recopilar datos de rendimiento de usuarios reales
- ✅ **Presupuesto de rendimiento**: establecer límites de tamaño de archivo, alertar si se superan
- ✅ **Informes periódicos de rendimiento**: generar informes de tendencias de rendimiento semanales/mensuales

---

## 7. Resumen

Repasemos los conceptos fundamentales de la optimización de rendimiento frontend con una tabla:

| Concepto | Explicación en una frase | Problema que resuelve | Técnicas comunes |
|------|-----------|-----------|----------|
| **Optimización de carga** | Hacer que los recursos se descarguen más rápido | Primera pantalla lenta, mucho tiempo de espera | Comprimir imágenes, CDN, code splitting, lazy loading |
| **Optimización de renderizado** | Hacer que la página se "dibuje" más rápido | Scroll con trabas, clics lentos | Listas virtuales, reducir reflows/repaints, animaciones CSS |
| **Optimización de interacción** | Hacer que la respuesta sea más rápida | Clics sin respuesta, operaciones con trabas | Debounce/throttle, Web Worker, time slicing |
| **Optimización de caché** | Evitar descargas repetidas | Visitas recurrentes lentas | Caché HTTP, Service Worker, LocalStorage |
| **Optimización de monitoreo** | Detectar problemas continuamente | Regresión de rendimiento | Lighthouse, RUM, presupuesto de rendimiento |

::: info Para terminar
La optimización de rendimiento es un tema en continua evolución. Las herramientas cambiarán, pero el principio fundamental permanece: **ponerse en el lugar del usuario, reducir el tiempo de espera y hacer que las operaciones sean más fluidas**.

Una vez que entiendas estos principios básicos, seas cual sea la evolución tecnológica, podrás adaptarte rápidamente y afrontar los retos con soltura.

Espero que este artículo te ayude a construir una comprensión global de la optimización de rendimiento frontend. Cuando te enfrentes a problemas de rendimiento en proyectos reales, sabrás por dónde empezar, cómo localizarlos y cómo resolverlos.
:::