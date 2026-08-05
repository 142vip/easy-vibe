# Principios de arquitectura de proyectos frontend

::: tip 🎯 Pregunta Central
**Desde una simple página HTML hasta una aplicación empresarial compleja, ¿cómo elegir la arquitectura adecuada para proyectos de diferentes escalas?** Es como preguntar: desde un estudio hasta un gran centro comercial, ¿cómo diseñar diferentes distribuciones de espacio según las necesidades? Una buena arquitectura debe evolucionar con el crecimiento del proyecto, sin sobrediseñar desde el principio.
:::

---

## 1. Evolución de la Arquitectura: De lo Simple a lo Complejo

### 1.1 Visión General de los Tres Niveles de Complejidad

La arquitectura de un proyecto frontend debe coincidir con su complejidad. Clasificamos los proyectos en tres niveles según dos dimensiones: **complejidad técnica** y **escala de usuarios**:

| Nivel | Stack Tecnológico | Escala de Usuarios | Escenarios Típicos | Enfoque Principal |
|------|--------|----------|----------|------------|
| **Básico** | HTML/CSS/JS | Individual/Equipo pequeño | Blog personal, landing pages, herramientas simples | Lanzamiento rápido, mantenimiento sencillo |
| **Intermedio** | Vue/React + herramientas de build | PYMEs | Sistemas de gestión, e-commerce frontend, SaaS | Reutilización de componentes, gestión de estado |
| **Empresarial** | Framework + Micro-frontend/SSR | Grandes aplicaciones | Plataformas grandes, sistemas de negocio complejos | Optimización de rendimiento, colaboración en equipo, escalabilidad |

::: tip 💡 ¿Cómo elegir?
**¡No sobrediseñes!** Muchos proyectos comienzan con HTML simple y gradualmente incorporan frameworks y herramientas a medida que crecen las necesidades.

- Proyecto personal → Básico
- MVP de startup → Básico o Intermedio
- Sistema de gestión empresarial → Intermedio
- Gran plataforma de internet → Empresarial
:::

---

## 2. Nivel Básico: Proyectos HTML/CSS/JS

### 2.1 Escenarios Aplicables

- Blog personal, página de currículum
- Páginas de producto (Landing Page)
- Páginas de herramientas simples (calculadoras, conversores, etc.)
- Validación de prototipos, demos rápidas

### 2.2 Estructura de Directorios Recomendada

```
my-simple-project/
├── index.html              # Página principal
├── about.html              # Página acerca de (si existe)
├── css/
│   ├── reset.css           # Estilos de reseteo
│   ├── variables.css       # Variables CSS (colores, fuentes, etc.)
│   ├── components.css      # Estilos de componentes (botones, tarjetas, etc.)
│   └── main.css            # Archivo de estilos principal
├── js/
│   ├── utils.js            # Funciones de utilidad
│   ├── api.js              # Llamadas API simples
│   └── main.js             # Lógica principal
├── assets/
│   ├── images/             # Recursos de imágenes
│   └── fonts/              # Archivos de fuentes
└── README.md               # Descripción del proyecto
```

### 2.3 Principios de Organización del Código

**HTML**: Etiquetas semánticas, estructura clara

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的个人博客</title>
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <header class="site-header">
    <nav class="main-nav">
      <a href="index.html">首页</a>
      <a href="about.html">关于</a>
    </nav>
  </header>

  <main class="content">
    <article class="blog-post">
      <h1>文章标题</h1>
      <p>文章内容...</p>
    </article>
  </main>

  <footer class="site-footer">
    <p>&copy; 2024 我的博客</p>
  </footer>

  <script src="js/utils.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

**CSS**: Usar variables CSS para gestionar temas

```css
/* variables.css */
:root {
  --primary-color: #3498db;
  --text-color: #333;
  --bg-color: #fff;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --font-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* components.css - estilos de componentes reutilizables */
.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: 4px;
  background: var(--primary-color);
  color: white;
  cursor: pointer;
}

.card {
  padding: var(--spacing-md);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

**JavaScript**: Organización modular (usando módulos ES6 o división simple)

```javascript
// utils.js
const utils = {
  // Simplificación de manipulación del DOM
  $(selector) {
    return document.querySelector(selector);
  },

  // Debounce simple
  debounce(fn, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  // Encapsulación de almacenamiento local
  storage: {
    get(key) {
      return JSON.parse(localStorage.getItem(key) || 'null');
    },
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
};

// main.js
document.addEventListener('DOMContentLoaded', () => {
  // Lógica de inicialización de página
  initNavigation();
  loadBlogPosts();
});
```

### 2.4 Buenas Prácticas

✅ **Lo que se debe hacer**:
- Usar etiquetas HTML semánticas
- Gestionar colores y espaciados con variables CSS
- Comprimir imágenes y usar lazy loading
- Añadir meta tags SEO básicos

❌ **Lo que se debe evitar**:
- Estilos en línea (`style="..."`)
- Contaminación de variables globales
- Código duplicado (copiar y pegar)

---

## 3. Nivel Intermedio: Proyectos con Vue/React

### 3.1 Escenarios Aplicables

- Sistemas de gestión empresarial (ERP, CRM, OA)
- Frontend/Backend de e-commerce
- Aplicaciones SaaS
- Aplicaciones web que requieren interacciones complejas

### 3.2 Estructura Recomendada para Proyectos Vue

```
my-vue-project/
├── public/                     # Recursos estáticos
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/                 # Estilos, imágenes, fuentes
│   │   ├── styles/
│   │   │   ├── variables.scss
│   │   │   ├── mixins.scss
│   │   │   └── global.scss
│   │   └── images/
│   ├── components/             # Componentes generales
│   │   ├── common/             # Globales (Button, Modal, etc.)
│   │   │   ├── Button/
│   │   │   │   ├── index.vue
│   │   │   │   └── Button.scss
│   │   │   └── Modal/
│   │   └── business/           # Componentes de negocio (UserCard, etc.)
│   ├── views/                  # Componentes de página
│   │   ├── Home/
│   │   ├── User/
│   │   │   ├── List.vue
│   │   │   └── Detail.vue
│   │   └── Product/
│   ├── router/                 # Configuración de rutas
│   │   └── index.js
│   ├── stores/                 # Gestión de estado Pinia/Vuex
│   │   ├── user.js
│   │   └── app.js
│   ├── services/               # Servicios API
│   │   ├── request.js          # Encapsulación de axios
│   │   ├── user.js
│   │   └── product.js
│   ├── utils/                  # Funciones de utilidad
│   │   ├── format.js
│   │   ├── validate.js
│   │   └── storage.js
│   ├── composables/            # Composables
│   │   ├── useAuth.js
│   │   └── useLoading.js
│   ├── constants/              # Definición de constantes
│   │   └── index.js
│   ├── App.vue
│   └── main.js
├── tests/                      # Archivos de prueba
├── .env                        # Variables de entorno
├── vite.config.js
├── package.json
└── README.md
```

### 3.3 Estructura Recomendada para Proyectos React

```
my-react-project/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/             # Componentes generales
│   │   │   ├── Button/
│   │   │   │   ├── index.jsx
│   │   │   │   └── Button.module.css
│   │   │   └── Modal/
│   │   └── business/           # Componentes de negocio
│   ├── pages/                  # Componentes de página
│   │   ├── Home/
│   │   ├── User/
│   │   └── Product/
│   ├── hooks/                  # Hooks personalizados
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   ├── services/               # Servicios API
│   │   ├── api.js
│   │   └── userService.js
│   ├── store/                  # Gestión de estado Redux/Zustand
│   │   ├── slices/
│   │   └── index.js
│   ├── utils/
│   ├── constants/
│   ├── App.jsx
│   └── main.jsx
├── tests/
└── package.json
```

### 3.4 Conceptos Clave en Detalle

#### Principios de Diseño de Componentes

**Responsabilidad única**: Un componente debe hacer solo una cosa

```vue
<!-- ❌ Mal ejemplo: el componente hace demasiadas cosas -->
<template>
  <div>
    <form @submit="handleSubmit">
      <!-- Contenido del formulario -->
    </form>
    <table>
      <!-- Tabla de datos -->
    </table>
    <div class="charts">
      <!-- Gráficos estadísticos -->
    </div>
  </div>
</template>

<!-- ✅ Buen ejemplo: dividido en componentes independientes -->
<template>
  <div>
    <UserForm @submit="fetchData" />
    <UserTable :data="users" />
    <UserStats :data="users" />
  </div>
</template>
```

#### Estrategia de Gestión de Estado

| Tipo de Estado | Ubicación de Almacenamiento | Ejemplo |
|----------|----------|------|
| **Estado global** | Pinia/Redux | Información de usuario, estado de login, configuración de tema |
| **Estado de página** | Componente de página | Condiciones de búsqueda de lista, información de paginación |
| **Estado de componente** | Interno del componente | Entrada de formulario, mostrar/ocultar modal |
| **Estado del servidor** | TanStack Query/SWR | Datos del servidor, caché |

#### Elección del Método de Organización de Directorios

**Método 1: Organización por tipo (adecuado para proyectos pequeños)**

```
src/
├── components/     # Todos los componentes
├── views/          # Todas las páginas
├── stores/         # Todo el estado
└── services/       # Todos los servicios
```

**Método 2: Organización por funcionalidad (adecuado para proyectos medianos/grandes)**

```
src/
├── features/
│   ├── auth/       # Todo el código de autenticación
│   ├── user/       # Todo el código de usuario
│   └── product/    # Todo el código de producto
├── shared/         # Recursos compartidos
└── App.vue
```

::: tip 💡 ¿Cómo elegir?
- Proyecto con < 10 páginas → Organización por tipo
- Proyecto con > 20 páginas → Organización por funcionalidad
- Equipo > 5 personas → Organización por funcionalidad, facilita el desarrollo en paralelo
:::

---

## 4. Nivel Empresarial: Arquitectura para Grandes Aplicaciones

### 4.1 Escenarios Aplicables

- Grandes plataformas de internet (e-commerce, redes sociales, plataformas de contenido)
- Aplicaciones empresariales complejas
- Proyectos que requieren colaboración entre múltiples equipos
- Proyectos con requisitos extremadamente altos de rendimiento y mantenibilidad

### 4.2 Arquitectura de Micro-frontend

Cuando el proyecto crece hasta un punto en que un solo repositorio de código es difícil de mantener, se puede considerar la arquitectura de **micro-frontend**.

```
Gran plataforma de e-commerce/
├── Aplicación shell (marco principal)
│   ├── Navegación superior
│   ├── Menú lateral
│   ├── Entrada al centro de usuario
│   └── Contenedor de sub-aplicaciones
├── Sub-app de productos (despliegue independiente)
│   ├── Lista de productos
│   ├── Detalle de producto
│   └── Gestión de productos
├── Sub-app de pedidos (despliegue independiente)
│   ├── Carrito de compras
│   ├── Lista de pedidos
│   └── Flujo de pago
├── Sub-app de usuarios (despliegue independiente)
│   ├── Centro personal
│   ├── Dirección de envío
│   └── Cupones
└── Sub-app de marketing (despliegue independiente)
    ├── Páginas de campañas
    ├── Emisión de cupones
    └── Tienda de puntos
```

**Ventajas del micro-frontend**:
- Autonomía de equipos: Cada sub-aplicación se desarrolla y despliega de forma independiente
- Agnóstico al stack tecnológico: Diferentes equipos pueden usar diferentes frameworks
- Actualización progresiva: Se puede refactorizar gradualmente el sistema legacy

### 4.3 Estructura de Directorios Empresarial

```
enterprise-project/
├── apps/                       # Sub-aplicaciones micro-frontend
│   ├── main/                   # Aplicación shell
│   ├── product/
│   ├── order/
│   └── user/
├── packages/                   # Paquetes compartidos (Monorepo)
│   ├── ui-components/          # Biblioteca de componentes comunes
│   ├── utils/                  # Funciones de utilidad
│   ├── constants/              # Definición de constantes
│   └── types/                  # Tipos TypeScript
├── shared/                     # Configuración compartida
│   ├── eslint-config/
│   ├── ts-config/
│   └── vite-config/
├── docs/                       # Documentación del proyecto
├── scripts/                    # Scripts de build
└── package.json
```

### 4.4 Arquitectura de Optimización de Rendimiento

Las grandes aplicaciones necesitan prestar atención a la optimización de rendimiento:

```
Estrategias de optimización de rendimiento/
├── Optimización en tiempo de build
│   ├── División de código (Code Splitting)
│   ├── Carga diferida de rutas
│   ├── Tree Shaking
│   └── Compresión de recursos
├── Optimización en tiempo de ejecución
│   ├── Virtual scrolling (listas largas)
│   ├── Lazy loading de imágenes
│   ├── Renderizado bajo demanda de componentes
│   └── Estrategia de caché
└── Optimización de red
    ├── Aceleración CDN
    ├── Caché HTTP
    ├── Precarga de recursos
    └── Service Worker
```

### 4.5 Arquitectura SSR/SSG

Para escenarios que requieren SEO o rendimiento de primera pantalla:

| Solución | Escenario Aplicable | Framework Representativo |
|------|----------|----------|
| **SSR** | Necesita SEO, renderizado rápido de primera pantalla | Next.js, Nuxt.js |
| **SSG** | Contenido estático, actualizaciones poco frecuentes | Astro, VitePress |
| **Híbrido** | Parcialmente estático, parcialmente dinámico | Next.js (ISR) |

---

## 5. Selección de Arquitectura por Nivel de Usuarios

### 5.1 Individual/Equipo Pequeño (DAU < 1000)

**Características**: Iteración rápida, recursos limitados, requisitos cambiantes

**Arquitectura recomendada**:
- Stack tecnológico: Vue 3 + Vite o React + Vite
- Gestión de estado: Pinia o Zustand (ligero)
- Librería UI: Element Plus / Ant Design
- Despliegue: Vercel / Netlify / Servidor en la nube

**Estructura de directorios**: Organización simple por tipo

### 5.2 Empresa Mediana (DAU 1k-100k)

**Características**: Negocio complejo, colaboración en equipo, necesidad de estabilidad

**Arquitectura recomendada**:
- Stack tecnológico: Vue 3 + TypeScript o React + TypeScript
- Gestión de estado: Pinia + Composables o Redux Toolkit
- Librería UI: Biblioteca de componentes propia + componentes de negocio
- Pruebas: Tests unitarios + tests E2E
- Despliegue: Pipeline CI/CD + Docker

**Estructura de directorios**: Organización por funcionalidad, establecer convenciones

### 5.3 Gran Plataforma (DAU > 100k)

**Características**: Alta concurrencia, colaboración multi-equipo, mantenimiento a largo plazo

**Arquitectura recomendada**:
- Stack tecnológico: React/Vue + TypeScript (modo estricto)
- Arquitectura: Micro-frontend + Monorepo
- Gestión de estado: Gestión de estado de granularidad fina + caché de estado del servidor
- Rendimiento: SSR/SSG + CDN + Edge computing
- Monitoreo: Monitoreo frontend + seguimiento de errores + análisis de rendimiento

**Estructura de directorios**: Monorepo + Micro-frontend

---

## 6. Hoja de Ruta de Evolución de la Arquitectura

### 6.1 Ejemplo de Evolución: De Blog a Plataforma

```
Fase 1: Blog personal (HTML/CSS/JS)
    ↓ Necesidad: panel de administración
Fase 2: Añadir panel de administración (Vue/React + estructura simple)
    ↓ Necesidad: sistema de usuarios, función de comentarios
Fase 3: Modularización por funcionalidad (organización por funcionalidad)
    ↓ Necesidad: colaboración multi-equipo, despliegue independiente
Fase 4: Arquitectura micro-frontend (Monorepo)
```

### 6.2 Criterios de actualizar la arquitectura

| Señal | Descripción | Sugerencia |
|------|------|------|
| Tiempo de build > 5 min | Proyecto demasiado grande | Code splitting, micro-frontend |
| Conflictos frecuentes entre varios | Dificultad de colaboración | Organización por funcionalidad, división de módulos |
| Cambiar una cosa rompe muchas | Acoplamiento severo | Refactorización, reforzar pruebas |
| Carga de primera pantalla > 3s | Problema de rendimiento | Lazy loading, SSR, optimización |
| Nuevos miembros tardan en adaptarse | Estructura confusa | Documentación, convenciones, refactorización |

---

## 7. Resumen

::: tip 💡 Idea Central
**No existe una bala de plata en arquitectura, lo adecuado es lo mejor.**

- **Proyectos pequeños**: No sobrediseñar, HTML/CSS/JS es suficiente
- **Proyectos medianos**: Establecer convenciones, componentización, modularización
- **Proyectos grandes**: Considerar micro-frontend, optimización de rendimiento, colaboración en equipo

**Recuerda estos puntos**:
1. **Evolución progresiva**: Comienza simple y crece con las necesidades
2. **Convenciones unificadas**: Mantén consistencia en nomenclatura, estructura y estilo de código
3. **Documentación primero**: Registra las decisiones de arquitectura para facilitar la transmisión
4. **Refactorización periódica**: Paga la deuda técnica a tiempo

**Objetivo final**: Haz que el código, como un espacio bien organizado, funcione eficientemente sin importar su tamaño.
:::

---

## Recursos de Referencia

- [Guía de Estilo de Vue](https://vuejs.org/style-guide/)
- [Sugerencias de Estructura de Proyectos React](https://react.dev/learn/thinking-in-react)
- [Bulletproof React - Guía de Arquitectura](https://github.com/alan2207/bulletproof-react)
- [Feature Sliced Design](https://feature-sliced.design/)
- [Arquitectura Micro-frontend](https://micro-frontends.org/)
