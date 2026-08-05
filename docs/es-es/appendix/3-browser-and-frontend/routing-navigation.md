# Introducción al enrutamiento y navegación
::: tip 🎯 Pregunta central
**¿Por qué algunos sitios web no muestran una pantalla en blanco al cambiar de página, siendo tan fluidos como una App?** Esta es la magia del enrutamiento del frontend. Este capítulo te llevará desde la "navegación tipo pasar páginas" de los sitios web tradicionales al mundo del "cambio de diapositivas" de las aplicaciones de una sola página, para que entiendas cómo el enrutamiento del frontend eleva la experiencia del usuario a otro nivel.
:::

---

## 1. Motivación de enrutamiento del frontend

### 1.1 De los sitios web tradicionales a las SPAs: un salto cualitativo en la experiencia de usuario

Recordando la experiencia de navegación web de los primeros tiempos, cada clic en un enlace era un proceso de "cambio completo de página": la pantalla se ponía en blanco, aparecía un spinner de carga y toda la página se volvía a renderizar. Si la red era lenta, tenías que mirar el spinner durante varios segundos. Esta experiencia hoy en día está obsoleta, pero en aquel entonces era la práctica estándar.

El desarrollo frontend moderno ha cambiado completamente este modelo. Utilizamos técnicas de enrutamiento del frontend para que el cambio de página sea tan fluido como en una app móvil: sin pantalla en blanco, sin spinner de carga, el usuario apenas percibe el proceso de "navegación". Esta mejora en la experiencia no es magia, sino mérito del sistema de enrutamiento del frontend.

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📖 Sitio web tradicional (MPA)**
- Clic en enlace → Recarga completa de la página
- Cada página es un archivo HTML independiente
- El navegador vuelve a descargar todos los recursos
- Experiencia como "pasar páginas de un libro", con un proceso de cambio evidente

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📱 Aplicación de una sola página (SPA)**
- Clic en enlace → Cambio sin recarga
- Solo un archivo HTML de entrada
- Solo se descargan los datos necesarios
- Experiencia como "diapositivas", fluida y natural

</div>
</div>

**Este es el problema central que el "enrutamiento del frontend" resuelve: lograr el cambio de vistas y la sincronización de la URL sin recargar la página.**

<RouteMatchingDemo />

### 1.2 Una historia real de tropiezos:Motivación: entender los modos de enrutamiento

Podrías decir: "Yo uso Vue Router o React Router, lo configuro y ya funciona, ¿por qué necesito entender estos principios subyacentes?" Déjame contarte una historia real para que entiendas por qué este conocimiento es tan importante.

::: warning El tropiezo de Li con el despliegue
Li es un desarrollador frontend novato que, recién incorporado, se encargó de desarrollar una SPA basada en Vue. En desarrollo local todo funcionaba perfectamente, la navegación entre rutas era suave como la seda. Pero cuando desplegó el proyecto en el servidor de pruebas, apareció el problema: cuando los usuarios accedían directamente a una ruta (como `example.com/user/123`) o recargaban la página de detalle, veían un error **404 Not Found**.

Li se quedó perplejo: si en local funcionaba bien, ¿por qué daba 404 después del despliegue? Estuvo investigando mucho tiempo, incluso sospechando que era un problema de configuración del servidor.

Luego consultó a un compañero senior, quien detectó el problema de inmediato: Li estaba usando el modo History, pero el servidor no tenía configurado el fallback. Cuando un usuario accede directamente a `/user/123`, el servidor intenta buscar un archivo correspondiente a esa ruta, pero todas las rutas de una SPA apuntan en realidad al mismo `index.html`. La solución era simple: configurar el servidor para que todas las rutas redirijan a `index.html`, dejando que el enrutador del frontend se encargue del resto.

Desde entonces, Li entendió una lección: **si no entiendes el principio de los modos de enrutamiento y los requisitos de configuración del servidor, ni siquiera sabrás por qué falla, y mucho menos cómo solucionarlo.**
:::

::: info 💡 Enseñanza central
El enrutamiento del frontend no es "magia negra". Entender su funcionamiento te permite localizar y resolver rápidamente problemas de despliegue, rendimiento y SEO. Y lo que es más importante, te ayuda a tomar decisiones más acertadas en la arquitectura del proyecto: cuándo usar el modo Hash, cuándo el modo History y cómo evitar las trampas más comunes.
:::

---

## 2. Conceptos fundamentales: ruta, modo, navegación

Antes de profundizar en implementaciones concretas, necesitamos aclarar algunos conceptos fundamentales. Para ayudarte a entenderlos mejor, usaremos la analogía de una biblioteca para relacionarlos entre sí.

::: tip 🤔 ¿Qué tienen que ver estos conceptos con el enrutamiento?
Ruta, modo y navegación son los tres pilares del sistema de enrutamiento del frontend.

Cuando usas Vue Router o React Router, el framework se encarga de:
1. **Mapeo de rutas** → Define la correspondencia entre URLs y componentes
2. **Selección de modo** → Decide si usar el modo Hash o History
3. **Control de navegación** → Gestiona los cambios de página, avance y retroceso del navegador

Por lo tanto, **entender estos tres conceptos es esencial para saber qué hace realmente el sistema de enrutamiento, por qué a veces necesita configuración especial y por qué surgen problemas en el despliegue.**
:::

### 2.1 Entendiendo el sistema de enrutamiento con la analogía de la biblioteca

Imagina que buscas un libro en una biblioteca. Este proceso es sorprendentemente similar al funcionamiento del enrutamiento del frontend:

| Concepto | 📚 Analogía de la biblioteca | Función real | Ejemplo concreto |
|------|-------------|----------|----------|
| **Ruta (Route)** | Correspondencia entre la signatura y el libro | Define la relación de mapeo entre URL y componente de página | La ruta `/user/123` corresponde al componente `UserDetail.vue` |
| **Enrutador (Router)** | El sistema de guía y localización de la biblioteca | El módulo central que gestiona todas las rutas y el comportamiento de navegación | Vue Router, React Router son enrutadores |
| **Modo de enrutamiento** | El método de indexación (catálogo de fichas vs. sistema electrónico) | Determina la forma de la URL y el mecanismo de implementación subyacente | El modo Hash usa `#`, el modo History usa rutas normales |
| **Navegación** | Caminar de una estantería a otra | El comportamiento de cambiar entre diferentes páginas | Clic en enlace, navegación programática, avance/retroceso del navegador |

::: tip 📊 ¿Qué puedes aprender de esta tabla?
Veamos cada fila:

**Ruta**: es solo una "configuración" que indica al sistema "qué URL corresponde a qué página". Como la signatura de un libro que corresponde a su ubicación.

**Enrutador**: es el "gestor", responsable de encontrar el componente correspondiente según la URL actual y renderizarlo. Como el bibliotecario que encuentra el libro según la signatura que le das.

**Modo de enrutamiento**: es la "forma de implementación", que determina cómo se ve la URL y qué tecnología se usa por debajo. Como si la biblioteca usa un catálogo de papel o un sistema de consulta electrónico.

**Navegación**: es el "comportamiento", la acción del usuario que desencadena el cambio de página. Como cuando caminas de la sección A a la sección B en la biblioteca.

Entender la diferencia entre estos cuatro conceptos es muy importante: **la ruta es configuración estática, el enrutador es el gestor dinámico, el modo es la decisión técnica y la navegación es el comportamiento del usuario.**
:::

### 2.2 Ruta (Route): el contrato de mapeo entre URL y componente

Una ruta, en esencia, es un "contrato" que establece qué contenido debe mostrarse al acceder a una determinada URL. En Vue Router, una configuración típica de rutas se ve así:

```javascript
const routes = [
  {
    path: '/',           // Ruta URL
    component: Home      // Componente correspondiente
  },
  {
    path: '/user/:id',   // Ruta dinámica con parámetro
    component: UserDetail,
    children: [          // Rutas anidadas
      { path: 'profile', component: UserProfile },
      { path: 'posts', component: UserPosts }
    ]
  }
]
```

**Quizás te preguntes: ¿por qué no usar simplemente etiquetas `<a>` para navegar, en lugar de usar enrutamiento?**

La respuesta está en la naturaleza de las "aplicaciones de una sola página": una SPA tiene solo una página HTML, y todos los cambios de página son en realidad sustituciones de componentes dentro de la misma página. Si usaras el tradicional `<a href="/user/123">`, el navegador realmente solicitaría la ruta `/user/123`, provocando una recarga de página o un error 404. El papel del enrutamiento es interceptar estos comportamientos de navegación y reemplazar dinámicamente los componentes mediante JavaScript, logrando así un cambio sin recarga.

::: details 🔧 Patrones comunes de configuración de rutas
**Ruta estática** (la más simple):
```javascript
{ path: '/home', component: Home }
{ path: '/about', component: About }
```

**Ruta dinámica** (con parámetros):
```javascript
{ path: '/user/:id', component: UserDetail }
// Puede coincidir con /user/123, /user/abc, etc.
// El componente puede obtener el parámetro mediante route.params.id
```

**Rutas anidadas** (relación padre-hijo):
```javascript
{
  path: '/user/:id',
  component: UserLayout,    // Componente padre
  children: [
    { path: 'profile', component: UserProfile },   // Ruta real /user/:id/profile
    { path: 'posts', component: UserPosts }        // Ruta real /user/:id/posts
  ]
}
```

**Ruta comodín** (página 404):
```javascript
{ path: '/:pathMatch(.*)*', component: NotFound }
// Coincide con todas las rutas no definidas
```
:::

### 2.3 Modos de enrutamiento: diferencia esencial entre Hash y History

El enrutamiento del frontend tiene dos modos principales de implementación: el modo Hash y el modo History. Tienen diferencias esenciales en la forma de la URL, la implementación subyacente y la compatibilidad.

::: tip 🤔 ¿Por qué se necesitan dos modos?
Esto es en realidad el resultado de razones históricas y compromisos técnicos.

**El modo Hash** fue la primera forma de implementar enrutamiento en el frontend. Utiliza la parte hash de la URL (es decir, el contenido después de `#`). Los cambios en el hash no provocan recarga de página y además tiene una compatibilidad excelente (incluso IE8 lo soporta).

**El modo History** es la "práctica estándar" tras la llegada de HTML5. Utiliza los métodos `pushState` y `replaceState` proporcionados por la History API, lo que permite que la URL tenga un aspecto más "normal" (sin `#`), pero requiere configuración adicional en el servidor.

Haciendo una analogía: el modo Hash es como "pegar una nota adhesiva en la puerta de una habitación" (no afecta a la estructura de la habitación), mientras que el modo History es como "renumerar las habitaciones" (necesita actualizar el sistema de numeración).
:::

| Característica | Modo Hash | Modo History |
|------|-----------|--------------|
| **Ejemplo de URL** | `https://example.com/#/user/123` | `https://example.com/user/123` |
| **Principio de implementación** | Escucha el evento `hashchange` | Usa la History API (`pushState`, `replaceState`) |
| **Configuración del servidor** | No necesaria (el hash no se envía al servidor) | **Debe configurarse fallback a index.html** |
| **Compatibilidad del navegador** | IE8+ (prácticamente todos los navegadores) | IE10+ (navegadores modernos) |
| **Amigabilidad SEO** | Baja (los motores de búsqueda pueden ignorar el hash) | Buena (estructura de URL clara) |
| **Experiencia de usuario** | La URL tiene `#`, parece un "salto de ancla" | URL limpia, similar a un sitio web tradicional |
| **Dificultad de despliegue** | Baja, no requiere configuración especial | Alta, requiere configuración correcta del servidor |

<HashVsHistoryDemo />

::: tip 📊 ¿Qué puedes aprender de esta tabla?
Veamos cada fila:

**Ejemplo de URL**: El modo Hash tiene un `#` visible en la URL, el usuario nota inmediatamente que es una "SPA"; el modo History tiene una URL como la de un sitio tradicional, aspecto más "profesional".

**Principio de implementación**: El modo Hash escucha el evento `hashchange` (se dispara cuando cambia el hash); el modo History usa la History API de HTML5, que puede "simular" un salto de página sin recargar realmente.

**Configuración del servidor**: ¡Este es el punto donde más se tropieza! En el modo Hash, el contenido después de `#` no se envía al servidor, por lo que el servidor no necesita conocer la existencia de las rutas; pero en el modo History, la ruta completa se envía al servidor, y si el servidor no está bien configurado, devolverá un 404.

**Amigabilidad SEO**: Los crawlers de los motores de búsqueda normalmente no ejecutan JavaScript, por lo que las URLs del modo Hash pueden ser ignoradas; las URLs del modo History tienen una estructura clara y son más fáciles de indexar.

**Dificultad de despliegue**: El modo Hash funciona "nada más sacarlo de la caja", mientras que el modo History requiere conocimientos de operaciones (Nginx, Apache, etc.). Esta es también la razón por la que muchos proyectos personales usan el modo Hash por defecto.
:::

---

## 3. Camino de evolución: de los sitios web tradicionales al enrutamiento moderno

Después de explicar tantos conceptos, veamos un caso real: cómo un sitio de comercio electrónico evolucionó paso a paso desde el "modelo tradicional de múltiples páginas" hasta el "enrutamiento moderno de SPA". Con este caso, entenderás de forma más intuitiva qué problemas resuelve el enrutamiento del frontend.

::: tip 📖 Conocimientos previos: ¿qué son MPA, SPA y SSR?
Antes de empezar con el caso, una breve introducción a estos términos:

- **MPA (Multi-Page Application)**: **Aplicación de múltiples páginas**, la forma tradicional de desarrollar sitios web. Cada página es un archivo HTML independiente, y la navegación entre páginas recarga toda la página.
- **SPA (Single-Page Application)**: **Aplicación de una sola página**, el enfoque principal del frontend moderno. Solo hay un HTML de entrada, y el cambio de página se hace reemplazando componentes dinámicamente con JavaScript, sin recarga.
- **SSR (Server-Side Rendering)**: **Renderizado del lado del servidor**, genera el HTML completo en el servidor. Combina las ventajas de SPA y MPA: primera carga rápida y buen SEO.

**En pocas palabras**: MPA es "volver a dibujar cada vez que pasas de página", SPA es "borrar y redibujar en el mismo papel", y SSR es "dibujarlo en el papel antes de entregártelo".
:::

### 3.1 Panorama general de la evolución

La siguiente tabla muestra las cuatro etapas de evolución de las aplicaciones frontend, para que veas cómo la tecnología de enrutamiento se ha desarrollado paso a paso:

| Etapa | Tipo de aplicación | Implementación del enrutamiento | Característica principal | Experiencia de usuario |
|------|---------|---------|---------|---------|
| **Etapa 1: Múltiples páginas tradicional** | MPA | Enrutamiento del lado del servidor | Cada página es un archivo HTML independiente | Recarga en cada navegación |
| **Etapa 2: SPA temprana** | SPA (modo Hash) | Enrutamiento Hash | URL con `#`, buena compatibilidad | Sin recarga, pero URL poco estética |
| **Etapa 3: SPA moderna** | SPA (modo History) | Enrutamiento History | URL limpia, requiere configuración del servidor | Fluida, URL similar a sitio tradicional |
| **Etapa 4: Renderizado híbrido** | SPA + SSR | Enrutamiento isomórfico | Primera carga en servidor, navegación posterior en frontend | Primera carga rápida, buen SEO, experiencia fluida |

::: tip 📊 ¿Qué puedes aprender de esta tabla?
Veamos cada fila:

**Etapa 1 → Etapa 2**: De "con recarga" a "sin recarga", este es un salto cualitativo. El usuario experimenta por primera vez una fluidez "como la de una app", a costa de que la URL lleve `#`, lo que resulta poco profesional.

**Etapa 2 → Etapa 3**: De "funciona" a "funciona bien". El modo History hace que la URL sea más limpia, más parecida a un sitio tradicional, pero a costa de una mayor complejidad de despliegue (necesita configurar el servidor).

**Etapa 3 → Etapa 4**: De "buena experiencia" a "buena experiencia + buen SEO". SSR resuelve el problema de SEO de las SPAs y la velocidad de primera carga, pero la complejidad de implementación aumenta considerablemente.

**En resumen**: La evolución del enrutamiento del frontend no es solo "la navegación se ha vuelto más rápida", sino **una mejora completa de la arquitectura de la aplicación**: del dominio del servidor al dominio del frontend, y luego a la combinación de ambos. Cada paso equilibra múltiples dimensiones como la experiencia de usuario, el costo de desarrollo y el SEO.
:::

### 3.2 Etapa 1: Aplicación tradicional de múltiples páginas — recarga en cada paso

¿Por qué se llama "aplicación tradicional de múltiples páginas"? Porque en esta etapa cada página es un archivo HTML independiente, y al navegar entre páginas el navegador vuelve a descargar todos los recursos (HTML, CSS, JS). Esta es la forma más antigua de desarrollo web, y muchos sitios tradicionales todavía funcionan así.

En esta etapa, el sitio de comercio electrónico "CompraMás" usaba una arquitectura MPA típica:

**Forma de desarrollo**:
- **Implementación del enrutamiento**: Enrutamiento del lado del servidor, cada página corresponde a un archivo HTML en el servidor
- **Navegación entre páginas**: Usando `<a href="/products/123">`, que provoca una recarga completa de la página
- **Gestión de estado**: Cada navegación pierde el estado anterior de la página (posición de scroll, contenido de formularios, etc.)

**Características de esta etapa**:
- ✅ **Ventajas**: Implementación simple, amigable para motores de búsqueda (buen SEO), avance/retroceso del navegador funciona sin configuración adicional
- ❌ **Desventajas**: Recarga en cada navegación, mala experiencia de usuario, alta carga en el servidor (recarga repetida de los mismos recursos)

::: details Ver la estructura del proyecto y el flujo de acceso de entonces
**Estructura del proyecto** (estructura típica de renderizado del lado del servidor):
```
server/
├── views/              # Plantillas HTML
│   ├── index.html      # Plantilla de la página principal
│   ├── products.html   # Plantilla de la lista de productos
│   └── product.html    # Plantilla del detalle de producto
├── public/             # Recursos estáticos
│   ├── css/
│   ├── js/
│   └── images/
└── server.js           # Punto de entrada del servidor
```

**Flujo de navegación entre páginas**:
```
1. El usuario hace clic en el enlace <a href="/products/123">
       ↓
2. El navegador envía una petición GET al servidor
       ↓
3. El servidor renderiza product.html, inserta los datos
       ↓
4. Devuelve la página HTML completa
       ↓
5. El navegador analiza el HTML, descarga CSS/JS, renderiza la página
       ↓
6. El usuario ve la página (este proceso suele tardar 1-3 segundos)
```

**Puntos de dolor del usuario**:
- Después de hacer clic en un enlace, la pantalla se pone en blanco, el tiempo de espera es largo
- En cada navegación se vuelven a descargar los mismos archivos CSS/JS
- El botón de avance/retroceso del navegador recarga la página
- No se puede mantener el estado complejo de la página (como filtros aplicados, posición de scroll)
:::

Este enfoque de desarrollo era aceptable para sitios pequeños, pero a medida que los sitios crecían y los usuarios exigían mejor experiencia, estos problemas empezaron a afectar gravemente la retención de usuarios y las tasas de conversión.

### 3.3 Etapa 2: SPA temprana — la era del enrutamiento Hash

Cuando los problemas de las aplicaciones tradicionales de múltiples páginas se acumularon lo suficiente, el equipo de "CompraMás" decidió introducir el enrutamiento del frontend y migrar a una arquitectura de SPA. Este fue un punto de inflexión importante: del "dominio del servidor" al "dominio del frontend".

Pero esta etapa también tuvo su costo: la URL llevaba `#`, lo que no parecía profesional, y además había problemas con la indexación en motores de búsqueda.

**Forma de desarrollo**:
- **Implementación del enrutamiento**: Enrutamiento Hash, usando la parte `#` de la URL
- **Navegación entre páginas**: JavaScript intercepta los clics en enlaces y reemplaza componentes dinámicamente
- **Gestión de estado**: El estado de la página se mantiene en el cliente, sin necesidad de recargar

**Características de esta etapa**:
- ✅ **Ventajas**: Cambio sin recarga, experiencia de usuario fluida, menor carga en el servidor
- ❌ **Desventajas**: URL con `#`, poco amigable para SEO, primera carga más lenta

::: details Ver la implementación del enrutamiento Hash
**Estructura del proyecto** (estructura típica de SPA temprana):
```
project/
├── index.html          # El único archivo HTML de entrada
├── css/
│   └── app.css         # Todos los estilos empaquetados en un archivo
├── js/
│   ├── router.js       # Implementación simple del enrutador
│   ├── views/          # Componentes de página
│   │   ├── Home.js
│   │   ├── ProductList.js
│   │   └── ProductDetail.js
│   └── app.js          # Punto de entrada de la aplicación
└── server.js           # Servidor simple de archivos estáticos
```

**Código central del enrutamiento Hash**:
```javascript
// router.js - Implementación simplificada del enrutador Hash
class HashRouter {
  constructor(routes) {
    this.routes = routes
    this.currentPath = null

    // Escuchar cambios de hash
    window.addEventListener('hashchange', () => {
      this.matchRoute()
    })

    // Inicializar
    this.matchRoute()
  }

  matchRoute() {
    // Obtener el hash actual (quitando #)
    const hash = window.location.hash.slice(1) || '/'
    const route = this.routes.find(r => r.path === hash)

    if (route) {
      this.render(route.component)
    } else {
      this.render(NotFoundComponent)
    }
  }

  render(component) {
    const app = document.getElementById('app')
    app.innerHTML = component.template()
    component.mount?.(app)
  }

  navigate(path) {
    window.location.hash = path
  }
}

// Uso
const router = new HashRouter([
  { path: '/', component: Home },
  { path: '/products', component: ProductList },
  { path: '/products/:id', component: ProductDetail }
])

// Navegar
router.navigate('/products/123')
```

**Formato de URL**:
- Página principal: `https://example.com/#/`
- Lista de productos: `https://example.com/#/products`
- Detalle de producto: `https://example.com/#/products/123`

**Mejoras conseguidas**:
1. **Mejora de la experiencia de usuario**: Cambio de página sin recarga, fluido y natural
2. **Menor carga en el servidor**: Solo se carga una vez HTML/CSS/JS, después solo se solicitan datos
3. **Conservación del estado**: La posición de scroll, el contenido de formularios y otros estados se mantienen al cambiar de página
4. **Compatibilidad offline**: Con Service Worker se puede lograr acceso sin conexión

**Nuevos puntos de dolor**:
1. **URL poco estética**: El `#` hace que la URL parezca un "salto de ancla", poco profesional
2. **Problemas de SEO**: Los crawlers de motores de búsqueda pueden ignorar el contenido después del hash, impidiendo que las páginas sean indexadas
3. **Primera carga lenta**: Hay que cargar todo el JavaScript de una vez, lo que aumenta el tiempo de primera carga
:::

### 3.4 Etapa 3: SPA moderna — el enrutamiento History se convierte en el estándar

Los puntos débiles del enrutamiento Hash (URL poco estética, mal SEO) atormentaron a los desarrolladores durante muchos años. Con la popularización de HTML5 y la mejora de la compatibilidad de los navegadores, el enrutamiento History se convirtió gradualmente en el estándar.

El enrutamiento History utiliza la History API de HTML5, permitiendo que la URL sea "normal" (sin `#`), pero a costa de necesitar configuración adicional en el servidor.

**Forma de desarrollo**:
- **Implementación del enrutamiento**: Enrutamiento History, usando `pushState` y `replaceState`
- **Librerías de enrutamiento**: Vue Router, React Router y otras librerías maduras
- **Configuración del servidor**: Es necesario configurar el servidor para que todas las rutas redirijan a `index.html`

**Características de esta etapa**:
- ✅ **Ventajas**: URL limpia, buen SEO, experiencia de usuario fluida
- ❌ **Desventajas**: El despliegue requiere configuración especial, el servidor debe cooperar

::: details Implementación del enrutamiento History y configuración de despliegue
**Estructura del proyecto** (estructura típica de SPA moderna):
```
project/
├── public/
│   └── index.html          # El único HTML de entrada
├── src/
│   ├── router/
│   │   └── index.js        # Configuración de enrutamiento
│   ├── views/              # Componentes de página
│   │   ├── Home.vue
│   │   ├── ProductList.vue
│   │   └── ProductDetail.vue
│   ├── App.vue
│   └── main.js
├── package.json
└── vite.config.js          # Configuración de construcción
```

**Ejemplo de configuración de Vue Router**:
```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),  // Modo History
  routes: [
    { path: '/', component: () => import('@/views/Home.vue') },
    { path: '/products', component: () => import('@/views/ProductList.vue') },
    { path: '/products/:id', component: () => import('@/views/ProductDetail.vue') },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFound.vue') }
  ]
})

export default router
```

**Formato de URL**:
- Página principal: `https://example.com/`
- Lista de productos: `https://example.com/products`
- Detalle de producto: `https://example.com/products/123`

**Clave: configuración de Nginx** (obligatoria en el despliegue):
```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/app;
    index index.html;

    # Configuración clave: todas las rutas apuntan a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**¿Por qué es necesaria esta configuración?**

```
Escenario: el usuario accede directamente a https://example.com/products/123

❌ Sin configuración:
1. El navegador solicita /products/123 al servidor
2. Nginx busca /products/123 en el sistema de archivos
3. No encuentra el archivo, devuelve 404

✅ Con try_files configurado:
1. El navegador solicita /products/123 al servidor
2. Nginx intenta buscar el archivo → no existe
3. Redirige a /index.html (según la regla try_files)
4. El navegador carga index.html
5. Vue Router toma el control, analiza /products/123
6. Renderiza el componente ProductDetail
7. ¡La página se muestra correctamente!
```

**Comparación de diferencias con el modo Hash**:
| Elemento | Modo Hash | Modo History |
|--------|----------|-------------|
| URL | `/#/products/123` | `/products/123` |
| Configuración del servidor | No necesaria | **Obligatoria** |
| Acceso directo | ✅ Funciona correctamente | ❌ Necesita soporte del servidor |
| SEO | ⚠️ Deficiente | ✅ Bueno |
:::

### 3.5 Etapa 4: Renderizado híbrido — la solución definitiva SPA + SSR

Cuando el enrutamiento History maduró, el equipo empezó a centrarse en problemas más profundos: ¿cómo mantener la experiencia fluida de la SPA y al mismo tiempo resolver el SEO y la lentitud de la primera carga?

El núcleo de esta etapa es el "renderizado isomórfico": la primera carga se renderiza en el servidor (buen SEO, carga rápida), y las interacciones posteriores usan el enrutamiento del frontend (experiencia fluida).

**Forma de desarrollo**:
- **Selección de framework**: Next.js (React), Nuxt.js (Vue)
- **Estrategia de renderizado**: Renderizado del lado del servidor + hidratación (Hydration) en el cliente
- **Modo de enrutamiento**: Modo History (ya configurado en el servidor)

**Características de esta etapa**:
- ✅ **Ventajas**: Primera carga rápida, buen SEO, interacciones posteriores fluidas
- ❌ **Desventajas**: Alta complejidad de implementación, requiere entorno de ejecución en el servidor

::: details Cómo funciona el renderizado híbrido
**Flujo de carga de página**:
```
1. El usuario accede a /products/123
       ↓
2. El servidor recibe la petición
       ↓
3. El servidor renderiza el componente ProductDetail → genera HTML completo
       ↓
4. Devuelve el HTML al navegador (contiene el contenido completo)
       ↓
5. El navegador muestra el contenido rápidamente (primera carga rápida)
       ↓
6. Carga JavaScript, ejecuta la "hidratación" (Hydration)
       ↓
7. Las navegaciones posteriores las gestiona el enrutador del frontend (sin recarga)
```

**Comparación de primera carga: SPA tradicional vs SSR**:

| Elemento | SPA tradicional | SSR |
|--------|---------|-----|
| Contenido en primera carga | Pantalla en blanco → cargar JS → renderizar | Muestra contenido inmediatamente |
| SEO | Los crawlers pueden no ver el contenido | Los crawlers ven el HTML completo |
| Tiempo de primera carga | Lento (necesita cargar JS) | Rápido (el HTML ya contiene el contenido) |
| Interacciones posteriores | Fluido (enrutamiento del frontend) | Fluido (enrutamiento del frontend) |
:::

---

## 4. Principios en profundidad: Enfoque de enrutamiento

Después de ver los casos reales, profundicemos en los principios de funcionamiento del enrutamiento del frontend para entender en qué se diferencian realmente los modos Hash y History.

<RouterArchitectureDemo />

### 4.1 Cómo funciona el modo Hash

El núcleo del modo Hash es aprovechar la parte `hash` de la URL (es decir, el contenido después de `#`). El hash tiene dos propiedades importantes:

1. **Los cambios en el hash no provocan recarga de la página**
2. **Los cambios en el hash se registran en la pila de historial del navegador**

Esto significa que podemos cambiar la URL sin recargar la página, y al mismo tiempo los botones de avance/retroceso del navegador funcionan correctamente.

**Flujo de trabajo**:

```
El usuario hace clic en el enlace <a href="#/user/123">
       ↓
El navegador actualiza la URL (sin recargar la página)
https://example.com/#/user/123
       ↓
Se dispara el evento hashchange
       ↓
El listener de enrutamiento captura el evento
       ↓
Analiza el valor hash → /user/123
       ↓
Coincide con la configuración de rutas → encuentra el componente UserDetail
       ↓
Renderiza el componente en la página
```

**Implementación del código central**:

```javascript
class HashRouter {
  constructor(routes) {
    this.routes = routes

    // Escuchar cambios de hash
    window.addEventListener('hashchange', () => {
      this.loadRoute()
    })

    // Carga inicial
    this.loadRoute()
  }

  loadRoute() {
    // Obtener el hash actual, quitando el # inicial
    const hash = window.location.hash.slice(1) || '/'
    const route = this.matchRoute(hash)

    if (route) {
      this.render(route.component)
    }
  }

  matchRoute(path) {
    return this.routes.find(r => r.path === path)
  }

  render(component) {
    document.getElementById('app').innerHTML = component.template()
  }

  push(path) {
    window.location.hash = path
  }
}
```

::: tip 💡 Ventajas del modo Hash
- **Buena compatibilidad**: Soportado desde IE8+, funciona en prácticamente todos los navegadores
- **Despliegue simple**: No requiere configuración del servidor, funciona nada más sacarlo de la caja
- **Implementación simple**: Solo necesita escuchar el evento `hashchange`
:::

### 4.2 Cómo funciona el modo History

El modo History utiliza la History API de HTML5, que proporciona métodos como `pushState` y `replaceState` para cambiar la URL sin recargar la página.

**API central**:

```javascript
// Añadir una nueva entrada al historial
history.pushState(state, title, url)
// Ejemplo: history.pushState({id: 123}, 'Detalle de usuario', '/user/123')

// Reemplazar la entrada actual del historial
history.replaceState(state, title, url)

// Escuchar cambios en el historial (botones avance/retroceso)
window.addEventListener('popstate', (event) => {
  // event.state contiene el state pasado a pushState
})
```

**Flujo de trabajo**:

```
El usuario hace clic en el enlace <a href="/user/123">
       ↓
JavaScript intercepta el evento de clic
event.preventDefault()
       ↓
Llama a history.pushState
history.pushState({id: 123}, 'Detalle de usuario', '/user/123')
       ↓
La URL se actualiza (sin recargar la página)
https://example.com/user/123
       ↓
El enrutador coincide y renderiza el componente
       ↓
El usuario hace clic en el botón de retroceso del navegador
       ↓
Se dispara el evento popstate
       ↓
El listener de enrutamiento captura el evento
       ↓
Renderiza el componente correspondiente según la nueva URL
```

**Implementación del código central**:

```javascript
class HistoryRouter {
  constructor(routes) {
    this.routes = routes

    // Interceptar todos los clics en enlaces
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a')
      if (link && link.getAttribute('href').startsWith('/')) {
        e.preventDefault()
        this.push(link.getAttribute('href'))
      }
    })

    // Escuchar avance/retroceso del navegador
    window.addEventListener('popstate', () => {
      this.loadRoute()
    })

    // Carga inicial
    this.loadRoute()
  }

  loadRoute() {
    const path = window.location.pathname
    const route = this.matchRoute(path)

    if (route) {
      this.render(route.component)
    }
  }

  push(path) {
    history.pushState({}, '', path)
    this.loadRoute()
  }

  render(component) {
    document.getElementById('app').innerHTML = component.template()
  }
}
```

::: warning ⚠️ La trampa del modo History
El mayor problema del modo History es que: **cuando el usuario accede directamente a una URL o recarga la página, el navegador envía una petición al servidor**.

Si el servidor no está correctamente configurado, devolverá un 404. La solución es configurar el servidor para que todas las rutas redirijan a `index.html`, dejando que el enrutador del frontend se encargue del resto.
:::

---

## 5. Guía práctica de configuración de enrutamiento

Ya hemos cubierto suficiente teoría. A continuación se presentan los patrones de configuración de enrutamiento más comunes en proyectos reales y las mejores prácticas.

### 5.1 Configuración básica de enrutamiento

::: details Ejemplo completo de configuración de Vue Router

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/user/:id',
      name: 'UserDetail',
      component: () => import('@/views/UserDetail.vue'),
      props: true  // Pasar los parámetros de ruta como props
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // Comportamiento de scroll: mantener posición al volver, si no, ir arriba
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
```

:::

### 5.2 Carga diferida de rutas: mejora el rendimiento de la primera carga

La carga diferida de rutas (lazy loading) consiste en cargar el componente correspondiente solo cuando se accede a una ruta, en lugar de cargar todos los componentes de una vez. Esto reduce significativamente el tiempo de primera carga.

```javascript
// ❌ Cargar todos los componentes de una vez (primera carga lenta)
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import User from '@/views/User.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/user', component: User }
]

// ✅ Carga diferida (primera carga rápida)
const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  { path: '/about', component: () => import('@/views/About.vue') },
  { path: '/user', component: () => import('@/views/User.vue') }
]
```

<CodeSplittingDemo />

::: tip 💡 Principio de la carga diferida
Cuando usas `import('@/views/Home.vue')`, Webpack/Vite empaqueta este componente en un archivo separado. Solo cuando el usuario accede a esta ruta, se descarga el archivo correspondiente.

Haciendo una analogía: la carga diferida es como "pedir los platos según los necesitas", en lugar de servir todos los platos de una vez. Esto reduce el tiempo de primera carga y mejora la experiencia de usuario.
:::

### 5.3 Guardias de ruta: control de permisos e interceptación de navegación

Las guardias de ruta permiten ejecutar lógica antes y después de un cambio de ruta. Se usan habitualmente para verificación de permisos, configuración del título de página, precarga de datos, etc.

```javascript
// Guardia global antes de cada navegación
router.beforeEach(async (to, from, next) => {
  // Establecer el título de la página
  document.title = to.meta.title || 'My App'

  // Verificación de permisos
  if (to.meta.requiresAuth) {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      next('/login')
      return
    }
  }

  next()
})

// Hook global después de cada navegación
router.afterEach((to, from) => {
  // Estadísticas de visitas de página
  analytics.trackPageView(to.path)
})

// Guardia a nivel de ruta
const routes = [
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true, roles: ['admin'] },
    beforeEnter: (to, from, next) => {
      // Lógica exclusiva de esta ruta
      if (hasPermission()) {
        next()
      } else {
        next('/403')
      }
    }
  }
]
```

::: tip 💡 Usos comunes de las guardias de ruta
- **Verificación de permisos**: Comprobar si el usuario tiene permiso para acceder a una página
- **Título de página**: Establecer dinámicamente document.title
- **Precarga de datos**: Obtener datos antes de entrar a la página
- **Barra de progreso**: Mostrar una barra de progreso durante el cambio de página
- **Estadísticas de visitas**: Registrar las visitas a las páginas
:::

---

## 6. Problemas comunes y soluciones

### 6.1 Error 404 al recargar después del despliegue

**Problema**: En desarrollo local funciona correctamente, pero al desplegar en el servidor, acceder directamente a una ruta o recargar la página muestra un error 404.

**Causa**: En el modo History, el servidor trata la URL como una ruta de archivo e intenta encontrarla, pero todas las rutas de una SPA apuntan en realidad a `index.html`.

**Solución**: Configurar el fallback del servidor.

```nginx
# Configuración de Nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

```apache
# Configuración de Apache (.htaccess)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 6.2 Pérdida de parámetros de ruta

**Problema**: Después de recargar la página, los parámetros de ruta `$route.params` se pierden.

**Causa**: Los parámetros de ruta solo existen durante la navegación entre rutas; al recargar, hay que volver a analizarlos desde la URL.

**Solución**:

```javascript
// ❌ Enfoque incorrecto: obtener parámetros solo en created
created() {
  const userId = this.$route.params.id
  this.fetchUser(userId)
}

// ✅ Enfoque correcto: observar los cambios de ruta
watch: {
  '$route.params.id': {
    immediate: true,
    handler(newId) {
      this.fetchUser(newId)
    }
  }
}
```

### 6.3 Posición de scroll anómala al cambiar de página

**Problema**: Después de cambiar de página, la posición de scroll no se restablece, o al volver atrás no se mantiene la posición anterior.

**Solución**: Configurar `scrollBehavior` en el enrutador.

```javascript
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // Mantener la posición de scroll al volver atrás
    if (savedPosition) {
      return savedPosition
    }
    // Saltar a un ancla
    if (to.hash) {
      return { el: to.hash }
    }
    // Si no, ir al principio de la página
    return { top: 0 }
  }
})
```

---

## 7. Resumen

Recapitulemos los conceptos fundamentales del enrutamiento del frontend con esta tabla:

| Concepto | En una frase | Problema que resuelve | Solución representativa |
|------|-----------|-----------|----------|
| **Enrutamiento** | Relación de mapeo entre URL y componente | Mostrar diferente contenido según la URL | Vue Router, React Router |
| **Modo Hash** | Implementa enrutamiento usando el hash de la URL | Buena compatibilidad, despliegue simple | Modo Hash de Vue Router |
| **Modo History** | Implementa enrutamiento usando la History API | URL limpia, buen SEO | Modo History de Vue Router |
| **Carga diferida** | Cargar componentes de ruta bajo demanda | Reducir el tiempo de primera carga | `() => import('./Page.vue')` |
| **Guardias de ruta** | Funciones hook antes/después del cambio de ruta | Control de permisos, precarga de datos | `beforeEach`, `beforeEnter` |
| **Rutas dinámicas** | Rutas con parámetros | Coincidir con una categoría de rutas, no una sola | `/user/:id` |

::: info Para terminar
El enrutamiento del frontend es una de las tecnologías fundamentales de las aplicaciones modernas de una sola página. Desde el temprano modo Hash hasta el actual modo History como estándar, la tecnología de enrutamiento no ha dejado de evolucionar para ofrecer a los usuarios una experiencia de navegación cada vez más fluida.

Entender los principios y modos del enrutamiento te permite localizar y resolver rápidamente problemas de despliegue, rendimiento y SEO. Y lo que es más importante, te ayuda a tomar decisiones más acertadas en la arquitectura del proyecto: cuándo usar Hash, cuándo usar History y cómo evitar las trampas más comunes.

Espero que este artículo te ayude a construir una comprensión global del enrutamiento del frontend. Para que cuando te encuentres con problemas relacionados con el enrutamiento en tus proyectos, sepas por dónde empezar, cómo localizarlos y cómo resolverlos.
:::