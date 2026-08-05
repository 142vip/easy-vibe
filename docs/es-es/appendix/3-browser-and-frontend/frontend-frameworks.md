# Introducción a los frameworks frontend

::: tip Prefacio
Ya has aprendido los fundamentos de HTML, CSS y JavaScript, y puedes crear páginas web sencillas. Pero a medida que las funcionalidades web se vuelven más complejas, probablemente notes que: escribir código con JavaScript nativo se vuelve difícil de mantener, modificar una parte requiere cambios en muchos lugares, y el trabajo en equipo a menudo genera conflictos.

Por eso necesitamos frameworks frontend: hacen que el código sea más organizado, más fácil de mantener y más eficiente de desarrollar. En el vibecoding, la IA escribirá la mayor parte del código por ti. Pero al menos debes ser capaz de entender el estilo de código de los diferentes frameworks, conocer sus ventajas y desventajas, para que la IA pueda ayudarte a elegir la tecnología más adecuada.

Después de leer esto, podrás:
- Entender por qué la tecnología frontend necesita evolucionar constantemente
- Conocer las características de Vue, React, Svelte y Angular
- Comprender conceptos clave como "data-driven" y "componentización"
- Elegir el framework adecuado según el proyecto
:::

**¿Qué aprenderás en este artículo?**

| Capítulo | Contenido | ¿Qué podrás hacer después? |
|-----|------|-----------|
| **Capítulo 1** | Por qué prestar atención a la evolución del frontend | Entender qué problemas resuelve cada evolución tecnológica |
| **Capítulo 2** | La era de las páginas web estáticas | Conocer las primeras formas de desarrollo web |
| **Capítulo 3** | La era de jQuery | Comprender los puntos débiles de la programación "imperativa" |
| **Capítulo 4** | La era de Vue/React | Dominar el pensamiento "declarativo" y "data-driven" |
| **Capítulo 5** | Estrategias de renderizado | Conocer las diferencias entre CSR, SSR y SSG y sus casos de uso |
| **Capítulo 6** | Herramientas de ingeniería | Entender el rol de herramientas de construcción como Webpack y Vite |

Cada capítulo comienza con "por qué necesitamos esta tecnología", para que entiendas la lógica detrás de la evolución tecnológica.

---

## 1. Motivación de prestar atención a la historia de la evolución del frontend

::: tip 🤔 Pregunta clave
**¿Por qué las páginas web son cada vez más complejas? ¿Por qué la tecnología frontend necesita evolucionar constantemente?** Esta pregunta te guiará a través de la evolución técnica desde páginas web simples hasta aplicaciones web modernas.
:::

### 1.1 De "póster electrónico" a "aplicación de escritorio"

Imagina un **póster** que ves en la calle:

- ✅ Tiene contenido (texto, imágenes)
- ✅ Tiene diseño (colores, composición)
- ❌ Pero si le hablas, no responde
- ❌ Si haces clic en alguna parte, no pasa nada

**Las primeras páginas web** eran como estos "pósters electrónicos": solo se podían ver, no modificar, con contenido fijo.

**Las páginas web modernas** son completamente diferentes. Son como **aplicaciones de escritorio** (VS Code, Figma):

- ✅ Puedes editar documentos, dibujar, jugar
- ✅ Responden en tiempo real a cada una de tus acciones
- ✅ Incluso pueden funcionar sin conexión

**La razón principal de esta transformación: las funcionalidades web son cada vez más complejas y requieren tecnologías y métodos de desarrollo más eficientes.**

### 1.2 Una metáfora cotidiana: construir una casa

La evolución de la tecnología frontend es como la evolución en la forma de construir casas:

| Era | 🏠 Metáfora de construcción | Características reales | Ventajas y desventajas |
|------|-----------|---------|--------|
| **2000s** | **Pegar pósters** | Páginas web estáticas, solo escribir HTML | ✅ Simple ❌ Sin interactividad |
| **2010s** | **Contratar obreros para decorar manualmente** | Era de jQuery, manipular cada elemento manualmente | ✅ Interactivo ❌ Código desordenado, difícil de mantener |
| **2020s** | **Construir con bloques LEGO** | Era de Vue/React, desarrollo por componentes | ✅ Eficiente, mantenible ❌ Curva de aprendizaje |

::: tip 💡 ¿Qué puedes observar en esta tabla?

**Fase 1 → Fase 2**: De "no se puede mover" a "se puede mover". Es un salto cualitativo: las páginas web comienzan a tener interacción, pero el costo es que el código se vuelve caótico.

**Fase 2 → Fase 3**: De "funciona" a "funciona bien". La componentización permite reutilizar código como bloques de construcción, aumentando enormemente la eficiencia de desarrollo.

**Idea central**: La evolución tecnológica no es "novedad por novedad", sino resolver los puntos débiles de la fase anterior.
:::

---

---

## 2. Primera fase: Páginas web estáticas y "corte de imágenes" (2000s)

::: tip 🤔 Pregunta clave
**¿Cómo eran las primeras páginas web? ¿Por qué no se necesitaban frameworks en ese entonces?** Entender las limitaciones de esta fase es clave para comprender la necesidad de la evolución tecnológica posterior.
:::

<FrontendEvolutionDemo />

### 2.1 Enfoque de era esta era

**Método de desarrollo**:

- Escribir algunos archivos HTML
- Incrustar algo de CSS y JavaScript
- Arrastrar los archivos directamente al navegador para ver el resultado
- Subir la carpeta al servidor para completar el despliegue

**Características**:

- ✅ **Ventajas**: Simple y directo, sin curva de aprendizaje, escribes y funciona
- ❌ **Desventajas**: No se pueden implementar interacciones complejas, el código se vuelve caótico al crecer

::: details Ver la estructura de proyecto de esa época

```
project/
├── index.html
├── login.html
├── css/
│   ├── bootstrap.css
│   └── custom.css
├── js/
│   ├── jquery.js
│   └── app.js
└── images/
```

**Problemas encontrados**:

1. **Contaminación de variables globales**: Todas las variables estaban en el espacio de nombres global, fáciles de sobrescribir entre sí
2. **Gestión de dependencias caótica**: Los archivos JS debían cargarse en el orden correcto, o se producían errores
3. **Código difícil de reutilizar**: Para reutilizar una funcionalidad, solo se podía copiar y pegar
:::

### 2.2 Introducción a "corte de imágenes"

Quizás hayas oído el término "corte de imágenes". Era el trabajo principal del frontend temprano:

**¿Qué es el corte de imágenes?**

El diseñador diseña la página en Photoshop → El frontend corta el diseño en pequeñas imágenes → Usa HTML para ensamblar las imágenes en una página

**¿Por qué era tan lento?**

Cada pequeña imagen en la página web requería que el navegador hiciera una **petición de red**. Cuantas más peticiones, más lenta la carga.

👇 **Pruébalo tú mismo**: Observa el impacto de las peticiones de imágenes en el rendimiento de carga

<SliceRequestDemo />

::: tip 💡 Sprite de imágenes (CSS Sprites)

Para reducir el número de peticiones, surgió la técnica de "sprites": combinar muchas imágenes pequeñas en una imagen grande.

La ventaja es que se reducen las peticiones, la desventaja es que crear y mantener los sprites es muy tedioso.

La lección de esta fase: **demasiadas peticiones son el mayor enemigo del rendimiento**.
:::

---

---

## 3. Segunda fase: La era de jQuery - "Acarrear ladrillos manualmente" (2010s)

::: tip 🤔 Pregunta clave
**¿Por qué se necesitaba jQuery? ¿Qué problemas resolvió y qué nuevos problemas trajo?** Entender las limitaciones de jQuery es clave para comprender el valor de Vue/React.
:::

### 3.1 Motivación de jQuery

A medida que las páginas web se volvían más complejas, los problemas de JavaScript nativo se hicieron evidentes:

- ❌ **API verbosa**: Incluso operaciones simples requerían mucho código
- ❌ **Compatibilidad entre navegadores**: Las APIs variaban entre navegadores, requiriendo mucho código de compatibilidad
- ❌ **Selectores débiles**: Encontrar elementos era engorroso

**jQuery** nació. Hizo que JavaScript fuera más simple:

```javascript
// JavaScript nativo (verboso)
const element = document.getElementById('title')

// jQuery (conciso)
const element = $('#title')
```

### 3.2 El enfoque de jQuery: modificar la página manualmente

El enfoque central de jQuery es **imperativo**: le dices al navegador "cómo hacerlo".

```javascript
// Encontrar el elemento del título
$('#title').text('Nuevo título')

// Encontrar el botón y deshabilitarlo
$('#submit-btn').attr('disabled', true)

// Encontrar la lista y añadir un elemento
$('ul').append('<li>Nuevo elemento</li>')
```

**Problema**: Necesitas recordar qué elementos hay en la página, y cada vez que los datos cambian, debes actualizar manualmente todos los elementos relacionados.

👇 **Pruébalo tú mismo**: Compara jQuery con el enfoque data-driven

<JQueryVsStateDemo />

::: warning ⚠️ Los puntos débiles de jQuery

Imagina que estás haciendo un carrito de compras:

```javascript
// El usuario hace clic en "Añadir al carrito"
function addToCart() {
  cartCount++ // Los datos cambian

  // Debes actualizar manualmente todos los lugares relacionados
  $('#cart-count').text(cartCount) // Punto rojo en la esquina superior derecha
  $('#cart-page-count').text(cartCount) // Página del carrito
  $('#checkout-price').text(calculatePrice()) // Botón de pagar

  // ¡Si olvidas un lugar, la página queda inconsistente!
}
```

**Este es el costo de "acarrear ladrillos manualmente"**: propenso a errores, difícil de mantener.
:::

### 3.3 La popularización del móvil: el surgimiento del diseño responsive

En esta fase también ocurrió un cambio importante: **los teléfonos y tablets comenzaron a popularizarse**.

Las páginas web debían adaptarse a diferentes pantallas. Esto requería **diseño responsive**: el mismo HTML/CSS se adapta automáticamente según el ancho de pantalla.

**El núcleo del diseño responsive: Media Queries**

```css
/* Pantalla de escritorio (más de 640px) */
@media (min-width: 640px) {
  .container {
    display: flex;
  }
}

/* Pantalla de móvil (menos de 640px) */
@media (max-width: 640px) {
  .container {
    display: block;
  }
}
```

👇 **Pruébalo tú mismo**: Ajusta el ancho del navegador y observa el efecto del diseño responsive

<ResponsiveGridDemo />

::: tip 💡 El diseño responsive es como un "marco de fotos inteligente"

Imagina que ves la misma foto en diferentes habitaciones:

- En un **salón grande** (pantalla de escritorio), la foto puede ser más grande y tener otros elementos decorativos alrededor
- En un **dormitorio pequeño** (pantalla de móvil), la foto necesita reducirse y los demás elementos decorativos deben guardarse

**El diseño responsive** es ese "marco inteligente" que ajusta automáticamente la presentación según el tamaño de la habitación.
:::

---

---

## 4. Tercera fase: De "acarrear ladrillos" a "data-driven" (Vue/React)

::: tip 🤔 Pregunta clave
**¿Por qué necesitamos Vue/React? ¿Cuál es la diferencia esencial con jQuery?** Entender "declarativo" y "data-driven" es la clave para dominar los frameworks frontend modernos.
:::

### 4.1 Motivación de nuevos frameworks

Los problemas de la era jQuery se acumularon hasta cierto punto:

- **El código se vuelve caótico al crecer**: Operaciones DOM por todas partes, difícil de mantener
- **Propenso a bugs**: Si olvidas actualizar un lugar, la página queda inconsistente
- **Colaboración difícil**: Varias personas modificando el mismo archivo, fácil que haya conflictos

**El enfoque central de Vue / React**: **solo cambias los datos, la página se actualiza automáticamente**.

### 4.2 El enfoque de Vue/React: UI declarativa

**jQuery (imperativo)**:

```javascript
// Le dices al navegador cada paso que debe hacer
$('#title').text('Nuevo título')
$('#title').css('color', 'red')
$('#title').show()
```

**Vue (declarativo)**:

```javascript
// Solo le dices al navegador "qué mostrar"
data() {
  return {
    title: "Nuevo título",
    color: "red",
    visible: true
  }
}
```

👇 **Pruébalo tú mismo**: Compara la diferencia entre imperativo y declarativo

<ImperativeVsDeclarativeDemo />

::: tip 💡 Imperativo vs Declarativo

Es como pintar un cuadro:

- **Imperativo**: Le dices al pintor "toma el pincel, usa pintura roja, dibuja un círculo en las coordenadas (10,10)"
- **Declarativo**: Le das directamente una foto al pintor, "píntame algo así"

Vue/React es "declarativo": describes "cómo se ve la página", y el framework se encarga de "cómo dibujarla".
:::

### 4.3 Componentización: escribir páginas como armar LEGO

La característica más potente de **Vue / React** es la **componentización**: dividir la página en "bloques" independientes.

Imagina que estás armando LEGO:

- No necesitas "tallar cada bloque desde cero" (escribir HTML/CSS desde cero)
- Solo necesitas "ensamblar los bloques según las instrucciones" (combinar componentes)
- Cada bloque es **independiente**, puedes **reutilizarlo** en diferentes sets

**Beneficios de los componentes**:

- **Reutilización**: Escribes un componente "tarjeta de producto" y lo usas 100 veces
- **Encapsulamiento**: El estado interno de un componente no afecta a otros
- **Mantenimiento**: Modificas un componente y todos los lugares donde se usa se actualizan

::: info 💡 Consejos de identificación
- Ves `<ComponentName />` → Es un componente
- Ves `import xxx from './xxx.vue'` → Está importando un componente
- Ves `props: {...}` → Parámetros que recibe el componente
- Ves `emit('xxx')` → El componente envía un evento al componente padre
:::

### 4.4 SPA: El nacimiento de las Single-Page Applications

En la era de **Vue / React** también ocurrió un cambio importante: **de MPA a SPA**.

**MPA (Multi-Page Application)**:

- Haces clic en un enlace → La página completa se recarga → Se muestra la nueva página
- Es como **hojear un libro**: cada vez que pasas página, cierras el libro viejo y tomas uno nuevo del estante

**SPA (Single-Page Application)**:

- Haces clic en un enlace → Solo se actualiza el área de contenido → La página no se recarga
- Es como **cambiar de capítulo en el mismo libro**: solo borras el contenido viejo y escribes el nuevo

👇 **Pruébalo tú mismo**: Experimenta la diferencia entre MPA y SPA

<RoutingModeDemo />

**Ventajas de SPA**:

- ✅ **Experiencia fluida**: Cambio de páginas rápido
- ✅ **Estado fácil de gestionar**: El contenido ingresado y la posición de scroll se mantienen
- ❌ **La primera carga puede ser lenta**: Necesita descargar JavaScript primero
- ❌ **El SEO requiere tratamiento adicional**: Los motores de búsqueda pueden no capturar el contenido (se necesita SSR/SSG)

---

---

## 5. Estrategias de renderizado: De CSR a SSR/SSG

::: tip 🤔 Pregunta clave
**¿La página se genera en el servidor o en el navegador?** Cada estrategia de renderizado tiene sus ventajas y desventajas; elegir la adecuada es crucial para el rendimiento y el SEO.
:::

**CSR (Client-Side Rendering) - Renderizado del lado del cliente**:

- El navegador descarga JavaScript → Ejecuta el código → Genera la página
- Ventajas: Interacción fluida, menor carga del servidor
- Desventajas: Primera carga lenta, desfavorable para SEO

**SSR (Server-Side Rendering) - Renderizado del lado del servidor**:

- El servidor genera HTML → Lo envía al navegador → El navegador lo muestra directamente
- Ventajas: Primera carga rápida, favorable para SEO
- Desventajas: Mayor carga del servidor, implementación compleja

**SSG (Static Site Generation) - Generación de sitios estáticos**:

- Genera el HTML de todas las páginas en tiempo de construcción
- Ventajas: Extremadamente rápido, completamente estático, amigable con CDN
- Desventajas: No apto para contenido dinámico

👇 **Pruébalo tú mismo**: Compara las características de las diferentes estrategias de renderizado

<RenderingStrategyDemo />

::: info 💡 ¿Cómo elegir?
- **Sitios de contenido** (blogs, documentación): Prioriza SSG
- **Sitios dinámicos que necesitan SEO** (e-commerce, noticias): Usa SSR
- **Sistemas de administración interna**: Usa CSR
- **Requisitos mixtos**: Considera el renderizado híbrido de Nuxt/Next.js
:::

---

## 6. Cuarta fase: Ingeniería y herramientas de construcción (2015s-2020s)

::: tip 🤔 Pregunta clave
**¿Por qué el frontend necesita "ingeniería"? ¿Qué hacen exactamente las herramientas de construcción?** Entender la ingeniería es clave para comprender el flujo de trabajo de los proyectos frontend modernos.
:::

### 6.1 Motivación de ingeniería

Los proyectos frontend son cada vez más grandes, ya no se puede depender de "incluir scripts manualmente".

**Ingeniería** significa usar herramientas y estándares para hacer el desarrollo más eficiente, el código más fiable y la colaboración más fluida.

::: tip 💡 Ingeniería = De "taller artesanal" a "fábrica moderna"

Imagina cocinar en casa vs dirigir un restaurante:

- **Cocinar en casa**: Cocinas lo que quieras, mucha libertad
- **Dirigir un restaurante**: Necesitas recetas estandarizadas, procedimientos normalizados, compras unificadas de ingredientes

El desarrollo frontend es igual:

- **Proyectos pequeños**: Puedes escribir código como quieras
- **Proyectos grandes**: Necesitas normas de código unificadas, herramientas automatizadas, procesos estandarizados
:::

### 6.2 Herramientas de construcción: Webpack → Vite

**Webpack** (tradicional):

- Modo de trabajo: **Primero empaquetar, luego servir**
- Al iniciar: Empaqueta todo el código → Inicia el servidor
- Problema: **Lento**. Cuanto más grande el proyecto, más lento el inicio (puede tardar 30 segundos)

**Vite** (moderno):

- Modo de trabajo: **Compilación bajo demanda**
- Al iniciar: No empaqueta, inicia el servidor directamente
- El navegador solicita un archivo, se compila en tiempo real ese archivo
- Ventaja: **Rápido**. Normalmente inicia en menos de 1 segundo

| Comparación | Webpack | Vite | Mejora |
|--------|---------|------|------|
| Inicio en frío | 30s+ | <1s | **30 veces más rápido** |
| Hot reload | 3-5s | <100ms | **30 veces más rápido** |
| Archivo de configuración | Cientos de líneas | Decenas de líneas | **Mucho más simple** |

::: tip 💡 ¿Por qué Vite es tan rápido?

**Webpack** es como **mudarse con toda la casa**: primero empaquetas todo, luego sales.

**Vite** es como **viajar ligero**: solo llevas lo esencial, compras lo que necesitas sobre la marcha.

En el entorno de desarrollo, la mayoría de las veces solo necesitas modificar unos pocos archivos. Vite solo compila esos archivos, por eso es rápido.
:::

---

---

## 7. Comparativa de frameworks principales

::: tip 🤔 Pregunta clave
**¿Qué características tienen Vue, React, Svelte y Angular? ¿Cómo elegir el framework adecuado?** Conocer sus filosofías de diseño y casos de uso te permitirá tomar una decisión informada.
:::

### 7.1 Comparativa de los cuatro frameworks

| Característica | Vue | React | Svelte | Angular |
|------|-----|-------|--------|---------|
| **Filosofía de diseño** | Framework progresivo | Biblioteca UI | Framework en tiempo de compilación | Plataforma completa |
| **Curva de aprendizaje** | ⭐⭐ Fácil | ⭐⭐⭐ Media | ⭐⭐ Fácil | ⭐⭐⭐⭐ Empinada |
| **Rendimiento** | Rápido | Rápido | **Muy rápido** | Rápido |
| **Ecosistema** | Completo | **El más completo** | En crecimiento | Completo |
| **Tamaño del paquete** | Pequeño | Mediano | **El más pequeño** | Grande |
| **Casos de uso** | Proyectos pequeños/medianos | Proyectos grandes | Alta exigencia de rendimiento | Aplicaciones empresariales |
| **Respaldo** | Evan You (independiente) | Meta | Comunidad | Google |

### 7.2 Vue: Framework progresivo

**Filosofía central**: Adopción progresiva, puedes usar solo una parte o el ecosistema completo

```vue
<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue'
    }
  }
}
</script>
```

**Ventajas**:
- ✅ Curva de aprendizaje suave, documentación en chino muy completa
- ✅ Sintaxis de plantillas intuitiva, fácil de entender
- ✅ Componentes de archivo único (.vue) con estructura clara
- ✅ Ideal para desarrollo rápido

**Desventajas**:
- ❌ La gestión de estado en proyectos grandes requiere aprender Vuex/Pinia adicionalmente
- ❌ Flexibilidad ligeramente inferior a React

**Casos de uso**:
- Aplicaciones web pequeñas y medianas
- Prototipado rápido
- Equipos que prefieren documentación en chino

### 7.3 React: Biblioteca UI

**Filosofía central**: Solo se encarga de la capa de vista, el resto de problemas se delegan a la comunidad

```jsx
function App() {
  const [message, setMessage] = useState('Hello React')
  return <div>{message}</div>
}
```

**Ventajas**:
- ✅ El ecosistema más completo, abundantes bibliotecas de componentes
- ✅ Sintaxis JSX flexible, gran capacidad expresiva
- ✅ Excelente rendimiento con Virtual DOM
- ✅ Ideal para proyectos grandes

**Desventajas**:
- ❌ Curva de aprendizaje más empinada, requiere dominar conceptos adicionales
- ❌ Necesitas elegir y combinar diversas bibliotecas por ti mismo
- ❌ JSX requiere compilación, no se puede ejecutar directamente en el navegador

**Casos de uso**:
- Aplicaciones grandes y complejas
- Proyectos que necesitan un ecosistema rico
- Desarrollo multiplataforma (React Native)

### 7.4 Svelte: Framework en tiempo de compilación

**Filosofía central**: Sin Virtual DOM, convierte los componentes en código nativo eficiente en tiempo de compilación

```svelte
<script>
  let message = 'Hello Svelte'
</script>

<div>{message}</div>
```

**Ventajas**:
- ✅ **Mejor rendimiento** (sin sobrecarga de Virtual DOM en tiempo de ejecución)
- ✅ El tamaño de paquete más pequeño
- ✅ Sintaxis simple e intuitiva
- ✅ Sistema reactivo con soporte nativo

**Desventajas**:
- ❌ Ecosistema relativamente pequeño
- ❌ Comunidad menos numerosa que Vue/React
- ❌ Menos bibliotecas de terceros

**Casos de uso**:
- Aplicaciones con requisitos de rendimiento muy altos
- Proyectos sensibles al tamaño del paquete
- Equipos dispuestos a probar nuevas tecnologías

### 7.5 Angular: Plataforma completa

**Filosofía central**: Proporciona una solución completa, lista para usar

```typescript
@Component({
  selector: 'app-root',
  template: '<div>{{ message }}</div>'
})
export class AppComponent {
  message = 'Hello Angular'
}
```

**Ventajas**:
- ✅ Funcionalidad completa: enrutamiento, HTTP, formularios, todo incluido
- ✅ Soporte nativo de TypeScript
- ✅ Ideal para equipos y proyectos grandes
- ✅ Estándares de código unificados

**Desventajas**:
- ❌ Curva de aprendizaje empinada
- ❌ Muchos conceptos, alta complejidad
- ❌ Tamaño de paquete grande
- ❌ No apto para proyectos pequeños

**Casos de uso**:
- Aplicaciones empresariales a gran escala
- Equipos que necesitan estándares estrictos
- Proyectos con stack tecnológico TypeScript existente

---

## 8. Resumen: La esencia de la evolución

La evolución de la tecnología frontend trata esencialmente de resolver dos problemas:

### 8.1 Eficiencia: De manual a automático

| Era | Método de desarrollo | Eficiencia |
|------|---------|------|
| **2000s** | Escribir HTML/CSS/JS a mano | ⭐ |
| **2010s** | jQuery + manipulación manual del DOM | ⭐⭐ |
| **2020s** | Vue/React + data-driven | ⭐⭐⭐ |
| **Actualidad** | Componentización + Ingeniería + Automatización | ⭐⭐⭐⭐⭐ |

### 8.2 Escala: De individual a equipo

| Era | Escala del proyecto | Forma de colaboración |
|------|---------|---------|
| **2000s** | Unos pocos archivos | Una persona puede mantenerlo |
| **2010s** | Decenas de archivos | Equipo pequeño, propenso a conflictos |
| **2020s** | Cientos de archivos | Equipo mediano, necesita estándares |
| **Actualidad** | Miles de archivos | Equipo grande, necesita un sistema de ingeniería completo |

---

---

## 9. Ruta de aprendizaje

### 9.1 Si empiezas desde cero

**Paso 1: Fundamentos de HTML/CSS/JavaScript**

- Comprender los tres pilares de la web
- Poder crear páginas estáticas simples

**Paso 2: Aprender un framework (se recomienda Vue)**

- Entender el pensamiento "data-driven"
- Dominar el desarrollo por componentes

**Paso 3: Proyecto práctico**

- Hacer una SPA completa
- Familiarizarse con enrutamiento, gestión de estado y llamadas a API

### 9.2 Si ya tienes conocimientos básicos

**Direcciones de profundización**:

- **Ingeniería**: Aprender Vite/Webpack, entender el proceso de construcción
- **Optimización de rendimiento**: Aprender lazy loading, code splitting, estrategias de caché
- **TypeScript**: Añadir tipos al código para mejorar la fiabilidad
- **Renderizado del lado del servidor**: Aprender Nuxt/Next.js para resolver problemas de SEO y primera carga

---

## 10. Lo que ahora deberías poder identificar en el código

Después de leer este capítulo, deberías ser capaz de:

- ✅ Entender el contexto y las razones de la evolución de la tecnología frontend
- ✅ Distinguir las características de Vue, React, Svelte y Angular
- ✅ Comprender la diferencia entre "imperativo" y "declarativo"
- ✅ Dominar la idea central de "data-driven"
- ✅ Conocer el valor del desarrollo por componentes
- ✅ Entender los casos de uso de CSR, SSR y SSG
- ✅ Comprender el rol de las herramientas de construcción (Webpack, Vite)
- ✅ Poder elegir el framework y la tecnología adecuados según el proyecto

::: info 💡 Aplicación práctica
Cuando uses IA para hacer proyectos, puedes decirle cosas como:

- "Este es un sitio de blog que necesita SEO, usa Nuxt (el framework SSR de Vue)"
- "Este es un sistema de administración interna, usa Vue + Element Plus, no necesita SSR"
- "Esta es una aplicación web con altos requisitos de rendimiento, considera usar Svelte"
- "El proyecto ya usa React, sigamos usando bibliotecas del ecosistema React"
:::

---

## Glosario rápido

| Término | Inglés | Explicación sencilla |
|------|------|-----------|
| **DOM** | Document Object Model | Modelo de Objetos del Documento. Representa la página como un árbol de objetos que JS puede leer y modificar. |
| **jQuery** | - | Biblioteca JS popular temprana que simplificó la manipulación del DOM. |
| **Vue/React** | - | Frameworks frontend modernos que usan data-driven y desarrollo por componentes. |
| **Componente** | Component | Unidad de UI reutilizable, como botones, tarjetas, barras de navegación. |
| **MPA** | Multi-Page Application | Aplicación multipágina. Cada navegación recarga toda la página. |
| **SPA** | Single-Page Application | Aplicación de página única. Se carga una vez, los cambios posteriores no recargan la página. |
| **Enrutamiento** | Routing | Reglas y proceso que gestionan la navegación entre páginas. |
| **SSR** | Server-Side Rendering | Renderizado del lado del servidor. El servidor genera HTML y lo envía al navegador. |
| **SSG** | Static Site Generation | Generación de sitios estáticos. Las páginas se pre-renderizan como HTML estático en tiempo de construcción. |
| **CSR** | Client-Side Rendering | Renderizado del lado del cliente. El navegador genera la página mediante JavaScript. |
| **Webpack** | - | Herramienta de empaquetado tradicional, primero empaqueta y luego sirve. |
| **Vite** | - | Herramienta de construcción moderna, compilación bajo demanda, extremadamente rápida. |
| **Responsive** | Responsive Design | Diseño que adapta automáticamente la página a diferentes tamaños de pantalla. |
| **Media Query** | Media Query | Condicionales CSS que aplican diferentes estilos según el ancho de pantalla. |
| **Imperativo** | Imperative | Le dices al programa "cómo hacerlo". |
| **Declarativo** | Declarative | Le dices al programa "qué quieres". |
| **Data-driven** | Data-Driven | Solo modificas los datos, la interfaz se actualiza automáticamente. |
| **Tree Shaking** | - | Optimización de sacudido de árbol. Elimina automáticamente el código no usado, reduciendo el tamaño del paquete. |
| **Code Splitting** | Code Splitting | Divide el código en múltiples fragmentos pequeños, cargados bajo demanda. |