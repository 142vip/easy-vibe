# Principios de gestión de estado
::: tip 🎯 El problema central
**Cuando la aplicación crece, ¿cómo compartir y sincronizar datos elegantemente entre componentes?** Puede que te encuentres con este dilema: el usuario añade un producto al carrito en la página del producto, pero el contador del carrito en el encabezado no se actualiza; dos componentes no relacionados necesitan los mismos datos, pero no sabes cómo pasárselos. Este capítulo te guiará desde el "caos del paso de datos" hacia una "gestión de estado clara".
:::

---

## 1. Motivación de "componentización y gestión de estado"

### 1.1 Del taller artesanal a la fábrica: la evolución del desarrollo frontend

Antes de empezar, una pregunta: **¿Has intentado cocinar un gran banquete en tu cocina?**

Si solo te preparas un plato de fideos, es sencillo: una olla, un puñado de fideos, un poco de condimento, y listo en segundos. Pero si quieres abrir un restaurante que atienda a cientos de clientes al día, ya no puedes limitarte a "hacer lo que te apetezca". Necesitas recetas estandarizadas, una división clara del trabajo y procesos de compra unificados para garantizar una calidad consistente y una alta eficiencia.

El desarrollo frontend es igual. En solitario, para un proyecto pequeño, el código puede ir donde sea. Pero cuando el equipo crece y el proyecto se vuelve más complejo, necesitas un enfoque sistemático para organizar el código y gestionar los datos. Esto es precisamente lo que resuelven la **componentización y la gestión de estado**.

::: tip 🤔 ¿Qué son "componente" y "estado"?
Antes de continuar, aclaremos dos términos clave:

**Componente**: como una pieza de Lego, cada pieza es una parte independiente con su propia forma, color y función. Puedes ensamblar varias piezas para construir un castillo complejo. En el desarrollo frontend, un botón, un formulario o una barra de navegación pueden ser componentes.

**Estado**: es la "memoria" del componente. Por ejemplo, un botón "recuerda" si está "deshabilitado" o "habilitado"; un componente de carrito de compras "recuerda" qué productos contiene. El estado cambia, y esos cambios activan actualizaciones en la interfaz.

**Componentización + Gestión de estado = Código organizado + Flujo de datos claro**
:::

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🏠 Modo taller artesanal**
- El código está en un solo archivo, como cocinar todos los platos en una sola olla
- Los datos se pasan por todas partes, como un camarero corriendo sin rumbo por el restaurante
- Cambiar una cosa puede afectar a todo lo demás, como echar demasiada sal y arruinar todo el plato

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🏭 Modo fábrica**
- El código se divide en componentes, como un restaurante dividido en sala, cocina y compras
- Los datos se gestionan de forma centralizada, como un almacén y un sistema de distribución unificados
- El alcance de los cambios es claro, como cambiar un plato sin afectar a todo el restaurante

</div>
</div>

### 1.2 Una historia real de tropiezos:Motivación: entender la gestión de estado

Podrías decir: "¿No uso ya Vue/React? ¿No tienen gestión de estado incorporada?". Déjame contarte una historia real para que entiendas por qué es tan importante comprender sistemáticamente la componentización y la gestión de estado.

::: warning Las desventuras de Xiaomei
Xiaomei es una product manager de una empresa de ecommerce que se pasó al desarrollo frontend y le encargaron reconstruir la funcionalidad del carrito de compras. Antes trabajaba con proyectos antiguos en jQuery, y ahora debía migrarlos a Vue 3.

Xiaomei pensó: "La lógica del carrito es sencilla, solo necesito un array". Así que empezó a escribir código:
- En el componente de la página de detalle del producto, usó un array `cart` para almacenar los datos del carrito
- En el componente de la página del carrito, definió otro array `cartItems`
- En el componente de la barra de navegación, creó otra variable `cartCount`

Los problemas no tardaron en aparecer:
1. **Datos desincronizados**: el usuario añadía un producto en la página de detalle, pero los datos del carrito no se actualizaban
2. **Código duplicado**: Xiaomei tuvo que escribir varias funciones de "añadir al carrito", una en cada componente
3. **Mantenimiento difícil**: cuando operaciones pidió una función de "vaciar carrito", Xiaomei descubrió que tenía que modificar tres sitios distintos

Más tarde, consultó a Aqiang, el arquitecto frontend, quien echó un vistazo al código y dijo: "Has cometido el pecado capital de la gestión de estado: almacenar los mismos datos en varios sitios".

La solución era simple: usar Pinia para crear una gestión de estado global del carrito, donde todos los componentes leyeran y escribieran desde el mismo lugar. Después de este cambio, todos los problemas desaparecieron.

Desde entonces, Xiaomei entendió una lección: **sin comprender la componentización y la gestión de estado, escribirás un "código espagueti" imposible de mantener.**
:::

::: info 💡 La lección clave
La componentización y la gestión de estado no son "funcionalidades adicionales" de los frameworks, sino los pilares del desarrollo frontend moderno. Entenderlas te permitirá diseñar arquitecturas claras, escribir código mantenible y colaborar con fluidez en equipo.
:::

---

## 2. Conceptos fundamentales: entender la esencia de la componentización

::: tip 🤔 ¿Qué es el "pensamiento componentizado"?
El pensamiento componentizado es un método para dividir interfaces complejas en unidades de código independientes, reutilizables y con una única responsabilidad.

Hagamos una analogía: imagina que estás montando un ordenador. Compras la CPU, la memoria, el disco duro y la tarjeta gráfica por separado, y luego los ensamblas. Cada pieza tiene una función clara, y puedes reemplazar cualquiera de ellas sin afectar a las demás.

La componentización busca que el código frontend sea igual de "modular": cada componente se ocupa de lo suyo y colabora con otros componentes a través de interfaces bien definidas.
:::

### 2.1 Entendiendo la componentización con la analogía del restaurante

Usemos la analogía del restaurante para entender las ideas centrales de la componentización:

| Concepto | 🍽️ Analogía del restaurante | Función real | Ejemplo concreto |
|------|-------------|----------|----------|
| **Componente** | Los distintos departamentos del restaurante (sala, cocina, compras) | Cada departamento se ocupa de lo suyo | El componente botón gestiona los clics, el componente formulario gestiona la entrada de datos |
| **Props (propiedades)** | El menú que el cliente le da al camarero | El componente padre pasa datos al componente hijo | El padre pasa el "nombre de usuario" al componente de avatar |
| **Events (eventos)** | El camarero avisa a cocina: "nuevo pedido" | El componente hijo notifica al padre lo que ha ocurrido | El componente botón le dice al padre: "me han hecho clic" |
| **State (estado)** | La "lista de pedidos actuales" de la cocina | Datos almacenados dentro del componente | El componente carrito recuerda qué productos contiene |

::: tip 📊 ¿Qué puedes aprender de esta tabla?
Interpretemos cada fila:

**Componente**: igual que un restaurante tiene distintos departamentos, una página frontend se compone de diferentes componentes. Cada componente es una parte independiente con su propia responsabilidad.

**Props**: es la forma en que el componente padre "pasa datos" al hijo. Como cuando un cliente pide al camarero lo que quiere comer, el padre puede pasar datos (nombre de usuario, información del producto) al hijo mediante props. Atención: las props son "unidireccionales", solo van del padre al hijo, nunca al revés.

**Events**: cuando el componente hijo necesita notificar al padre (por ejemplo, un clic en un botón, el envío de un formulario), emite un evento. Como cuando el camarero recibe el pedido y avisa a cocina: "empieza a cocinar". Esto mantiene la unidireccionalidad del flujo de datos: el hijo no puede modificar directamente los datos del padre, solo puede "enviar mensajes".

**State**: es la "memoria" interna del componente. Igual que la cocina necesita recordar los pedidos actuales, el componente necesita recordar su estado (qué productos hay en el carrito, si el botón está deshabilitado). Cuando el estado cambia, el componente actualiza automáticamente la interfaz.
:::

<ComponentHierarchyDemo />

### 2.2 Props y Events: el "canal oficial" entre componentes padre e hijo

En los frameworks frontend (Vue, React), **Props y Events son la forma estándar de comunicación entre componentes padre e hijo**.

**Ejemplo en Vue:**

```vue
<!-- Parent.vue - Componente padre -->
<template>
  <div>
    <!-- Como darle el menú al camarero, pasar datos mediante props -->
    <Child
      :user-name="currentUser.name"
      :is-admin="currentUser.isAdmin"
      @delete-user="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Child from './Child.vue'

const currentUser = ref({
  name: '张三',
  isAdmin: true
})

const handleDelete = (userId) => {
  console.log('Eliminar usuario:', userId)
  // Procesar la lógica de eliminación
}
</script>
```

```vue
<!-- Child.vue - Componente hijo -->
<template>
  <div class="user-card">
    <h3>{{ userName }}</h3>
    <span v-if="isAdmin" class="badge">Administrador</span>
    <button @click="requestDelete">Eliminar usuario</button>
  </div>
</template>

<script setup>
// Recibir los datos del componente padre
const props = defineProps({
  userName: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
})

// Definir los eventos que se pueden emitir
const emit = defineEmits(['delete-user'])

const requestDelete = () => {
  // Notificar al padre mediante un evento
  emit('delete-user', props.userName)
}
</script>
```

::: tip 💡 Principio fundamental
**Props hacia abajo, Events hacia arriba**: esta es la regla de oro de la comunicación entre componentes.

- El componente padre pasa datos al hijo mediante **props** (como asignar tareas a un subordinado)
- El componente hijo notifica al padre lo que ha ocurrido mediante **events** (como un subordinado que informa a su superior)

Esto mantiene el flujo de datos claro y unidireccional, evitando el caos de "cualquiera puede modificar los datos".
:::

<PropsFlowDemo />

### 2.3 Flujo de datos unidireccional: Motivación de se pueden modificar directamente las props

Muchos principiantes cometen el error de modificar directamente las props dentro del componente hijo.

```vue
<!-- ❌ Forma incorrecta -->
<script setup>
const props = defineProps({
  count: { type: Number, default: 0 }
})

// Modificar las props directamente - ¡está prohibido!
props.count = 10  // Dará error
</script>
```

**¿Por qué no se pueden modificar directamente las props?**

Imagina que tomas prestado un libro de la biblioteca (props) y empiezas a pintarrajearlo (modificar props). Otras personas que tomen prestado el mismo libro (otros componentes) también verán tus garabatos, lo que causaría un caos. La forma correcta es: si necesitas modificar los datos, debe hacerlo el componente padre; el hijo solo "solicita el cambio".

```vue
<!-- ✅ Forma correcta -->
<script setup>
const props = defineProps({
  count: { type: Number, default: 0 }
})

const emit = defineEmits(['update-count'])

// Solicitar al padre que modifique mediante un evento
const increment = () => {
  emit('update-count', props.count + 1)
}
</script>
```

---

## 3. Del "caos" al "orden": la evolución de la comunicación entre componentes

::: tip 🤔 ¿Por qué es necesaria la evolución?
A medida que el proyecto crece, la comunicación entre componentes se vuelve cada vez más compleja. Veamos cómo un equipo real fue evolucionando paso a paso hacia un esquema de gestión de estado claro.

No se trata solo de "cambiar de herramienta", sino de **un cambio completo de mentalidad**: pasar de "pasar datos de cualquier manera" a "diseñar un flujo de datos claro".
:::

### 3.1 El panorama de la evolución

La siguiente tabla muestra las cuatro etapas de evolución de la comunicación entre componentes, para que veas cómo se resuelven los problemas paso a paso:

| Etapa | Método de comunicación | Problema típico | Cambio clave |
|------|---------|----------|----------|
| **Etapa 1: Paso libre** | Modificación directa, variables globales | Datos desincronizados, difícil de depurar | Sin normas, cada uno pasa los datos como quiere |
| **Etapa 2: Props/Events** | Comunicación estándar padre-hijo | Props Drilling (paso en cascada) | Hay normas, pero los anidamientos profundos son problemáticos |
| **Etapa 3: Librerías de gestión de estado** | Vuex/Redux/Pinia | Curva de aprendizaje, código repetitivo | Datos centralizados, depuración sencilla |
| **Etapa 4: Soluciones modernas** | Composables/Estados atómicos | Necesidad de entender nuevos conceptos | Más flexible, más conciso |

<EventBusDemo />

::: tip 📊 ¿Qué puedes aprender de esta tabla?
Interpretemos cada fila:

**Etapa 1 → Etapa 2**: de "sin normas" a "con normas". Es un salto cualitativo: empiezas a usar la comunicación estándar por props/events y el flujo de datos se vuelve claro. Pero el precio es que cuando los componentes tienen muchos niveles de anidamiento, los datos deben pasarse capa por capa, lo cual es engorroso (esto es el Props Drilling).

**Etapa 2 → Etapa 3**: de "gestión dispersa" a "gestión centralizada". Empiezas a usar librerías de gestión de estado como Vuex/Redux, colocando los datos compartidos en un "almacén" global donde todos los componentes leen y escriben. Esto resuelve el Props Drilling, pero la curva de aprendizaje aumenta.

**Etapa 3 → Etapa 4**: de "pesado" a "ligero". Las nuevas soluciones (como la Composition API de Vue 3, los Hooks de React) hacen la gestión de estado más flexible y concisa. Ya no necesitas obligatoriamente un store global, puedes combinar pequeñas unidades de estado según necesites.

**En resumen**: la evolución no es solo "cambiar a mejores herramientas", sino **una mejora completa de la mentalidad**: de pasar datos de cualquier manera a diseñar un flujo de datos claro.
:::

### 3.2 Etapa 1: Paso libre — el comienzo del caos

¿Por qué se llama "paso libre"? Porque en esta etapa no hay ninguna norma, los datos se pasan como a cada uno le parece: variables globales, modificaciones directas, event buses por todas partes.

**Escenario típico: datos del carrito dispersos por todas partes**

```javascript
// Componente de la página de detalle del producto
export default {
  data() {
    return {
      localCart: []  // Mantiene su propia copia de los datos del carrito
    }
  },
  methods: {
    addToCart(product) {
      this.localCart.push(product)
      // Intenta sincronizar con otros componentes
      window.cart = this.localCart  // ❌ ¡Variable global!
    }
  }
}

// Componente de la página del carrito
export default {
  data() {
    return {
      cartItems: []  // Otra copia de los datos del carrito
    }
  },
  mounted() {
    // Intenta leer desde la variable global
    this.cartItems = window.cart || []  // ❌ ¡Poco fiable!
  }
}

// Componente de la barra de navegación
export default {
  data() {
    return {
      cartCount: 0  // ¡Una tercera copia de los datos!
    }
  },
  mounted() {
    // Comprueba cambios por sondeo (qué absurdo)
    setInterval(() => {
      this.cartCount = window.cart?.length || 0
    }, 1000)  // ❌ ¡Bajo rendimiento!
  }
}
```

**Características de esta etapa:**
- ✅ **Ventajas**: simple y directo, sin curva de aprendizaje
- ❌ **Desventajas**: datos dispersos, difícil de sincronizar, difícil de depurar, un caos total

### 3.3 Etapa 2: Props/Events — el establecimiento de normas

El caos del paso libre hizo que el equipo se diera cuenta: **necesitamos normas**. Así que empezaron a usar los métodos estándar de comunicación que ofrece el framework: props y events.

**Escenario típico: Props Drilling (perforación de propiedades)**

```vue
<!-- Componente ancestro: App.vue -->
<template>
  <div class="app">
    <!-- Pasar la información de usuario capa por capa -->
    <Layout :user-name="userName" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Layout from './Layout.vue'

const userName = ref('张三')
</script>
```

```vue
<!-- Capa intermedia: Layout.vue -->
<template>
  <div class="layout">
    <Header :user-name="userName" />  <!-- Solo pasa el dato, no lo usa -->
    <Main>
      <Page :user-name="userName" />  <!-- Solo pasa el dato, no lo usa -->
    </Main>
  </div>
</template>

<script setup>
const props = defineProps({
  userName: String
})
</script>
```

```vue
<!-- Donde realmente se necesita: Header.vue -->
<template>
  <header>
    <span>{{ userName }}</span>  <!-- Por fin se usa -->
  </header>
</template>

<script setup>
const props = defineProps({
  userName: String
})
</script>
```

**Características de esta etapa:**
- ✅ **Ventajas**: flujo de datos claro, unidireccional, fácil de entender
- ❌ **Desventajas**: Props Drilling (pasar capa por capa es engorroso), comunicación entre componentes no relacionados es difícil

::: tip 🤔 ¿Qué es el Props Drilling?
Props Drilling se refiere a: **los datos tienen que pasar por muchos componentes intermedios, capa por capa, aunque esos componentes intermedios no usen realmente esos datos**.

Es como si tuvieras que entregar un paquete a alguien en el quinto piso, pero la norma exige que cada piso firme el recibo. Las personas de los pisos uno al cuatro solo "pasan el paquete", no lo necesitan, pero deben participar. Obviamente, esto es muy engorroso.
:::

### 3.4 Etapa 3: Librerías de gestión de estado — gestión centralizada

El dolor del Props Drilling dio origen a las librerías de gestión de estado (Vuex, Redux, Pinia). Su idea central es: **colocar los datos compartidos en un "almacén" global, donde todos los componentes lean y escriban desde el mismo lugar**.

**Escenario típico: gestionar el carrito con Pinia**

```javascript
// stores/cart.js - Estado global del carrito
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // Todos los datos del carrito centralizados aquí
  const items = ref([])

  // Propiedad computada: cantidad de productos
  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  // Método: añadir producto
  const addItem = (product) => {
    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  return {
    items,
    itemCount,
    addItem
  }
})
```

```vue
<!-- Componente de la página de detalle del producto -->
<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

const addToCart = (product) => {
  cart.addItem(product)  // Llamada directa, sin pasar capa por capa
}
</script>
```

```vue
<!-- Componente de la barra de navegación -->
<template>
  <header>
    <span>Carrito ({{ cart.itemCount }})</span>
  </header>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()  // Lectura directa, sincronización automática
</script>
```

**Características de esta etapa:**
- ✅ **Ventajas**: datos centralizados, resuelve el Props Drilling, herramientas de depuración potentes
- ❌ **Desventajas**: curva de aprendizaje, código adicional necesario (código repetitivo), puede ser excesivo para proyectos simples

### 3.5 Etapa 4: Soluciones modernas — flexibilidad y simplicidad

Aunque las librerías de gestión de estado son potentes, también tienen el problema de "matar moscas a cañonazos". Para proyectos medianos y pequeños, han surgido soluciones más flexibles y ligeras.

**Escenario típico: reutilizar lógica de estado con Composables/Hooks**

```javascript
// composables/useCart.js - Lógica de carrito reutilizable
import { ref, computed } from 'vue'

export function useCart() {
  const items = ref([])

  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const addItem = (product) => {
    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  return {
    items,
    itemCount,
    addItem
  }
}
```

```vue
<!-- Usar en cualquier componente -->
<script setup>
import { useCart } from '@/composables/useCart'

// Cada llamada crea una nueva instancia de estado
// Adecuado para estado local dentro de un componente
const { items, itemCount, addItem } = useCart()
</script>
```

**Características de esta etapa:**
- ✅ **Ventajas**: flexible, ligero, componible, se usa bajo demanda
- ❌ **Desventajas**: requiere entender el pensamiento composable, compartir entre componentes necesita tratamiento adicional

---

## 4. Librerías de gestión de estado en detalle: Vuex vs Pinia vs Redux

::: tip 🤔 ¿Cómo elegir una librería de gestión de estado?
Ante las distintas librerías de gestión de estado, puede que te preguntes: ¿cuál elijo?

En realidad, no hay una librería "mejor", solo la "más adecuada". Al elegir, ten en cuenta estos factores:
- **¿Qué framework usas?** Vue → Pinia, React → Redux/Zustand
- **¿Qué tamaño tiene el proyecto?** Proyecto pequeño → Composable, proyecto grande → librería de gestión de estado
- **¿Experiencia del equipo?** Elige la que el equipo conozca, o la que tenga menor curva de aprendizaje

El contenido a continuación detalla las características y escenarios de uso de las principales librerías de gestión de estado.
:::

### 4.1 Comparativa de las principales librerías de gestión de estado

| Característica | Redux | Vuex | Pinia | Zustand |
| :--- | :--- | :--- | :--- | :--- |
| **Framework** | React | Vue | Vue | React |
| **Curva de aprendizaje** | Pronunciada | Media | Suave | Suave |
| **Código repetitivo** | Mucho | Medio | Poco | Muy poco |
| **TypeScript** | Bueno | Bueno | Excelente | Excelente |
| **Herramientas de depuración** | Potentes | Buenas | Excelentes | Buenas |
| **Escenario de uso** | Proyectos grandes | Proyectos medianos/grandes Vue 2/3 | Nuevos proyectos Vue 3 | Proyectos medianos/pequeños React |

::: tip 📊 ¿Qué puedes aprender de esta tabla?
Interpretemos cada fila:

**Redux**: la librería de gestión de estado clásica del ecosistema React. Ventajas: normas estrictas, herramientas de depuración potentes. Desventajas: mucho código repetitivo, curva de aprendizaje pronunciada. Adecuado para proyectos grandes y equipos que necesitan normas estrictas.

**Vuex**: la librería oficial de gestión de estado de la era Vue 2. Su filosofía de diseño es similar a Redux, pero más integrada con el sistema reactivo de Vue. Todavía se puede usar, pero para nuevos proyectos se recomienda Pinia.

**Pinia**: la librería de gestión de estado de nueva generación recomendada oficialmente para Vue 3. Sintaxis concisa, buen soporte de TypeScript, baja curva de aprendizaje. **Es la primera opción para proyectos Vue 3**.

**Zustand**: librería ligera de gestión de estado del ecosistema React. API minimalista, casi sin código repetitivo. Adecuado para proyectos React medianos y pequeños.
:::

<StateManagementComparisonDemo />

### 4.2 Pinia en acción: la opción recomendada para Vue 3

Pinia es la librería de gestión de estado recomendada oficialmente por el equipo de Vue, diseñada específicamente para Vue 3. Es más concisa y fácil de usar que Vuex.

**¿Por qué se llama Pinia?**

Pinia significa "piña" en español. La piña es una fruta compuesta por muchas flores pequeñas, cada una independiente pero formando un todo unificado. Esto refleja exactamente la filosofía de diseño de Pinia: **cada store es independiente, pero se pueden combinar entre sí**.

**Conceptos fundamentales:**

::: details Ver ejemplo completo de código
```javascript
// stores/user.js - Gestión del estado de usuario
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 1. State: almacenar datos
  const userInfo = ref(null)
  const isLoggedIn = computed(() => !!userInfo.value)

  // 2. Actions: métodos para modificar datos
  const login = async (username, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
    const user = await response.json()
    userInfo.value = user  // Modificación directa, Pinia gestiona la reactividad
  }

  const logout = () => {
    userInfo.value = null
  }

  // 3. Getters: propiedades computadas
  const displayName = computed(() => {
    return userInfo.value?.name || 'Visitante'
  })

  return {
    userInfo,
    isLoggedIn,
    login,
    logout,
    displayName
  }
})
```
:::

**Uso en componentes:**

```vue
<template>
  <div class="user-panel">
    <span v-if="user.isLoggedIn">Bienvenido, {{ user.displayName }}</span>
    <button v-if="user.isLoggedIn" @click="user.logout">Cerrar sesión</button>
    <button v-else @click="showLoginDialog">Iniciar sesión</button>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

// Obtener el store directamente, todo el contenido es reactivo
const user = useUserStore()

const showLoginDialog = () => {
  // Mostrar diálogo de inicio de sesión...
}
</script>
```

**Ventajas de Pinia:**

| Ventaja | Descripción | Comparado con Vuex |
|------|------|----------|
| **API concisa** | No necesita mutations, modifica el state directamente | Vuex requiere separar mutations y actions |
| **Compatible con TypeScript** | Inferencia de tipos nativa, sin configuración adicional | Vuex necesita definiciones de tipos complejas |
| **Modularización automática** | Cada archivo de store se convierte automáticamente en un módulo | Vuex requiere configuración manual de namespaced |
| **Menor tamaño** | Aproximadamente 1KB después del empaquetado | Vuex aproximadamente 3KB |

<VuexPiniaDemo />

### 4.3 Redux en acción: la opción clásica para React

Redux es la librería de gestión de estado más clásica del ecosistema React, conocida por su estricto flujo de datos unidireccional.

**¿Por qué se llama Redux?**

Redux es la abreviatura de "Reduced Flux". Flux fue el patrón de arquitectura de aplicaciones propuesto por Facebook en sus inicios, y Redux simplificó los conceptos de Flux, de ahí el nombre "Reduced Flux".

**Principios fundamentales:**

1. **Fuente única de verdad**: todo el state de la aplicación se almacena en un único árbol de objetos
2. **State de solo lectura**: la única forma de cambiar el state es disparando una action
3. **Los cambios se hacen con funciones puras**: los reducers deben ser funciones puras

::: details Ver ejemplo completo de código
```javascript
// 1. Definir Action Types
const ADD_TODO = 'ADD_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'

// 2. Definir Action Creators
const addTodo = (text) => ({
  type: ADD_TODO,
  payload: { id: Date.now(), text, completed: false }
})

const toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  payload: { id }
})

// 3. Definir Reducer (función pura)
const initialState = {
  todos: []
}

const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, action.payload]
      }
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      }
    default:
      return state
  }
}

// 4. Crear Store
import { createStore } from 'redux'
const store = createStore(todoReducer)
```
:::

**Uso en React:**

```jsx
import { useSelector, useDispatch } from 'react-redux'

function TodoList() {
  // Leer el state
  const todos = useSelector(state => state.todos)

  // Obtener la función dispatch
  const dispatch = useDispatch()

  return (
    <ul>
      {todos.map(todo => (
        <li
          key={todo.id}
          onClick={() => dispatch(toggleTodo(todo.id))}
          style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
        >
          {todo.text}
        </li>
      ))}
    </ul>
  )
}
```

**Ventajas y desventajas de Redux:**

| Ventajas | Desventajas |
| :--- | :--- |
| Flujo de datos estricto, fácil de depurar | Mucho código repetitivo, curva de aprendizaje pronunciada |
| Depuración con viaje en el tiempo (Time Travel) | Estados simples requieren escribir mucho código |
| Rico ecosistema de middleware | No adecuado para proyectos pequeños |
| Actualizaciones de estado predecibles | Requiere entender conceptos de programación funcional |

<ReduxFlowDemo />

<MobxReactivityDemo />

<ZustandJotaiDemo />

---

## 5. Guía práctica: Enfoque para diseñar la gestión de estado

::: tip 🤔 ¿Cuándo necesitas una librería de gestión de estado?
No todos los proyectos necesitan una librería de gestión de estado. Antes de introducir una, hazte estas preguntas:

1. **¿Cuántos componentes necesitan compartir estos datos?**
   - Si son solo 2-3 componentes, con props/events es suficiente
   - Si son 5+ componentes, plantéate una librería de gestión de estado

2. **¿Estos datos cambian con frecuencia?**
   - Si casi no cambian (como la información de usuario), usa Provide/Inject
   - Si cambian con frecuencia (como el carrito de compras), usa una librería de gestión de estado

3. **¿Cuál es el tamaño del equipo?**
   - Individual o equipo pequeño: una solución simple es suficiente
   - Equipo grande: se necesitan normas estrictas y herramientas de depuración potentes

**Recuerda: empieza simple y escala según necesites.**
:::

### 5.1 Principios de diseño del estado

Independientemente de la solución de gestión de estado que elijas, debes seguir estos principios:

**Principio 1: Fuente única de verdad**

Los mismos datos solo deben almacenarse en un único lugar. No definas los mismos datos repetidamente en varios componentes.

```javascript
// ❌ Incorrecto: datos dispersos por todas partes
const ProductDetail = { cart: [] }
const CartPage = { items: [] }
const Header = { count: 0 }

// ✅ Correcto: datos centralizados
const cartStore = { items: [] }  // La única fuente de datos
```

**Principio 2: Inmutabilidad**

Al modificar el estado, debes crear nuevos objetos en lugar de modificar directamente el objeto original.

```javascript
// ❌ Incorrecto: modificación directa
state.items.push(newItem)

// ✅ Correcto: crear un nuevo objeto
state.items = [...state.items, newItem]
```

**Principio 3: El estado sube, los eventos bajan**

El estado compartido debe residir en el ancestro común más cercano o en un store global, no disperso entre los componentes hijos.

```vue
<!-- ❌ Incorrecto: el estado está en el componente hijo -->
<Parent>
  <Child :data="childData" @update="childData = $event" />
</Parent>

<!-- ✅ Correcto: el estado está en el componente padre -->
<Parent>
  <Child :data="parentData" @update="parentData = $event" />
</Parent>
```

### 5.2 Caso práctico: diseño del estado de un carrito de ecommerce

Apliquemos lo aprendido para diseñar la gestión de estado de un carrito de compras de ecommerce.

**Análisis de requisitos:**

- La página de lista de productos puede añadir productos al carrito
- La página del carrito permite ver, modificar cantidades y eliminar productos
- La barra de navegación muestra la cantidad de productos en el carrito
- Permite seleccionar/deseleccionar productos y calcular el precio total de los seleccionados
- Los datos se persisten en localStorage

**Diseño del estado (Pinia):**

```javascript
// stores/cart.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // ============ State ============
  const items = ref([])  // Lista de productos en el carrito
  const selectedIds = ref([])  // IDs de productos seleccionados

  // Recuperar datos desde localStorage
  const initFromStorage = () => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        items.value = data.items || []
        selectedIds.value = data.selectedIds || []
      } catch (e) {
        console.error('Error al leer los datos del carrito:', e)
      }
    }
  }

  // Persistir en localStorage
  const persist = () => {
    localStorage.setItem('cart', JSON.stringify({
      items: items.value,
      selectedIds: selectedIds.value
    }))
  }

  // ============ Getters ============
  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const selectedItems = computed(() =>
    items.value.filter(item => selectedIds.value.includes(item.id))
  )

  const selectedTotalPrice = computed(() =>
    selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  // ============ Actions ============
  const addItem = (product) => {
    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity += product.quantity || 1
    } else {
      items.value.push({
        ...product,
        quantity: product.quantity || 1
      })
    }
    persist()
  }

  const updateQuantity = (productId, quantity) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        item.quantity = quantity
        persist()
      }
    }
  }

  const removeItem = (productId) => {
    items.value = items.value.filter(item => item.id !== productId)
    selectedIds.value = selectedIds.value.filter(id => id !== productId)
    persist()
  }

  const toggleSelection = (productId) => {
    const index = selectedIds.value.indexOf(productId)
    if (index > -1) {
      selectedIds.value.splice(index, 1)
    } else {
      selectedIds.value.push(productId)
    }
    persist()
  }

  // Inicializar
  initFromStorage()

  return {
    // State
    items,
    selectedIds,
    // Getters
    itemCount,
    totalPrice,
    selectedItems,
    selectedTotalPrice,
    // Actions
    addItem,
    updateQuantity,
    removeItem,
    toggleSelection
  }
})
```

**Uso en componentes:**

```vue
<!-- Página de detalle del producto: ProductDetail.vue -->
<template>
  <div class="product-detail">
    <h2>{{ product.name }}</h2>
    <p class="price">¥{{ product.price }}</p>
    <button @click="addToCart">Añadir al carrito</button>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  product: Object
})

const cart = useCartStore()

const addToCart = () => {
  cart.addItem({
    id: props.product.id,
    name: props.product.name,
    price: props.product.price
  })
}
</script>
```

```vue
<!-- Barra de navegación: Header.vue -->
<template>
  <header class="header">
    <div class="logo">Mi tienda</div>
    <nav>
      <RouterLink to="/">Inicio</RouterLink>
      <RouterLink to="/cart">
        Carrito ({{ cart.itemCount }})
      </RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()  // Uso directo, reacciona automáticamente a los cambios
</script>
```

---

## 6. Errores comunes y cómo evitarlos

::: warning ⚠️ Estos errores los comete el 90% de los principiantes
En la práctica de la gestión de estado, algunos errores son especialmente comunes. Voy a resumir los más frecuentes y cómo evitarlos.
:::

### 6.1 Error 1: Modificar directamente Props o State

**Código incorrecto:**

```javascript
// ❌ Modificar props directamente
props.user.name = '李四'

// ❌ Modificar directamente el state de Vuex
store.state.user.name = '李四'

// ❌ Modificar directamente un elemento del array
state.items[0].name = 'Nuevo nombre'
```

**¿Por qué no funciona?**

Los frameworks frontend (Vue/React) necesitan "rastrear" los cambios en los datos para actualizar automáticamente la interfaz. Si modificas directamente un objeto o array, el framework puede no detectar el cambio, lo que provoca que la interfaz no se actualice.

**Forma correcta:**

```javascript
// ✅ Vue 3 / Pinia: modificar directamente propiedades de nivel superior
store.user.name = '李四'  // Pinia gestiona la reactividad automáticamente

// ✅ Vue 2 / Vuex: mediante mutation
mutations: {
  UPDATE_USER_NAME(state, newName) {
    state.user.name = newName
  }
}

// ✅ Modificar array: crear un nuevo array
state.items = state.items.map((item, index) =>
  index === 0 ? { ...item, name: 'Nuevo nombre' } : item
)
```

### 6.2 Error 2: Modificar el estado en un Getter

**Código incorrecto:**

```javascript
// ❌ Modificar el estado en un getter
getters: {
  doubleCount(state) {
    state.count *= 2  // ¡Efecto secundario!
    return state.count
  }
}
```

**¿Por qué no funciona?**

Un getter debe ser una "función pura", que solo calcula y devuelve un valor, sin ningún efecto secundario (modificar el estado). Si modificas el estado en un getter, puedes causar bucles infinitos y problemas difíciles de depurar.

**Forma correcta:**

```javascript
// ✅ El getter solo calcula, no modifica
getters: {
  doubleCount(state) {
    return state.count * 2
  }
}

// ✅ Si necesitas modificar, usa una action
actions: {
  doubleCountAndSave({ commit }) {
    commit('SET_DOUBLE_COUNT')
  }
}
```

### 6.3 Error 3: Olvidar limpiar los listeners de eventos

**Código incorrecto:**

```javascript
// ❌ Olvidar cancelar la suscripción
export default {
  created() {
    EventBus.$on('cart-updated', this.handleCartUpdate)
  }
  // ¡El componente se destruye pero el listener sigue activo!
}
```

**¿Por qué no funciona?**

Si el componente se destruye pero el listener de eventos sigue activo, se produce una fuga de memoria (la memoria ocupada no se libera). En aplicaciones de una sola página (SPA), el usuario cambia constantemente de página, y estos listeners no limpiados se acumulan, hasta que eventualmente la página se vuelve lenta.

**Forma correcta:**

```javascript
// ✅ Cancelar la suscripción a tiempo
export default {
  created() {
    EventBus.$on('cart-updated', this.handleCartUpdate)
  },
  beforeUnmount() {  // Vue 3 usa beforeUnmount, Vue 2 usa beforeDestroy
    EventBus.$off('cart-updated', this.handleCartUpdate)
  }
}
```

### 6.4 Error 4: Usar en exceso la gestión de estado

**Código incorrecto:**

```javascript
// ❌ Meter todo el estado en el store
const store = useStore()
store.inputValue = 'Entrada del usuario'
store.isModalOpen = true
store.currentTab = 'profile'
```

**¿Por qué no funciona?**

No todo el estado necesita estar en un store global. Si un estado solo se usa en un componente (como el valor de un campo de entrada, el estado de un modal), mantenlo dentro del componente. El uso excesivo de la gestión de estado complica el código innecesariamente.

**Forma correcta:**

```javascript
// ✅ El estado local se gestiona dentro del componente
const inputValue = ref('')

// ✅ Solo el estado que necesita compartirse va al store
const userInfo = useUserStore()  // Varios componentes necesitan la info del usuario
const cart = useCartStore()  // Varios componentes necesitan los datos del carrito
```

---

## 7. Resumen y recomendaciones

### 7.1 Repaso de conceptos clave

Usemos una tabla para repasar los conceptos fundamentales de la componentización y la gestión de estado:

| Concepto | En una frase | Problema que resuelve | Herramientas típicas |
|------|-----------|-----------|----------|
| **Componentización** | Dividir la interfaz en partes independientes y reutilizables | Reutilización de código, separación de responsabilidades | Componentes de Vue/React |
| **Props** | El componente padre pasa datos al hijo | Comunicación padre → hijo | Integrado en Vue/React |
| **Events** | El componente hijo notifica al padre lo que ha ocurrido | Comunicación hijo → padre | Integrado en Vue/React |
| **State** | Datos almacenados dentro del componente | Recordar el estado del componente | Integrado en Vue/React |
| **Librería de gestión de estado** | Gestionar de forma centralizada el estado global compartido | Comunicación entre componentes, Props Drilling | Pinia, Redux, Zustand |
| **Fuente única de verdad** | Los mismos datos solo se almacenan en un lugar | Inconsistencia de datos, dificultad de sincronización | Principio fundamental de las librerías de gestión de estado |

### 7.2 Recomendaciones según el escenario

| Escenario | Solución recomendada | Razón |
| :--- | :--- | :--- |
| **Comunicación padre-hijo** | Props + Events | Integrado en el framework, simple y directo |
| **Paso de valores entre niveles** | Provide / Inject | Evita el paso en cascada |
| **Estado local del componente** | ref / useState | Simple, no necesita herramientas adicionales |
| **Proyecto Vue mediano** | Pinia | Recomendación oficial, baja curva de aprendizaje |
| **Proyecto React mediano** | Zustand | Minimalista, sin código repetitivo |
| **Proyecto Vue grande** | Pinia + convenciones | Flexible y escalable |
| **Proyecto React grande** | Redux Toolkit | Normas estrictas, ecosistema rico |
| **Reutilización de lógica entre componentes** | Composable / Hooks | Flexible, componible |

### 7.3 Recomendaciones de aprendizaje

**Para principiantes:**

1. **Domina primero lo básico**: entiende los conceptos fundamentales de props, events y state
2. **Empieza con proyectos pequeños**: no introduzcas una librería de gestión de estado desde el principio
3. **Escribe mucho código**: por mucha teoría que estudies, nada sustituye a la práctica

**Para desarrolladores avanzados:**

1. **Lee el código fuente**: entiende cómo funcionan internamente Pinia/Redux
2. **Aprende patrones**: conoce los patrones de diseño comunes (observer, pub/sub)
3. **Sigue el ecosistema**: aprende herramientas relacionadas (DevTools, middleware)

**Recuerda estos principios fundamentales:**

1. **Empieza simple**: no introduzcas prematuramente librerías complejas de gestión de estado
2. **Fuente única de verdad**: evita almacenar los mismos datos en varios lugares
3. **Inmutabilidad**: al modificar el estado, crea nuevos objetos en lugar de modificar directamente
4. **Elige según la necesidad**: selecciona la solución adecuada según el tamaño del proyecto y el equipo

Espero que este artículo te ayude a construir una comprensión global de la componentización y la gestión de estado. Cuando te enfrentes a problemas complejos de flujo de datos en proyectos reales, sabrás por dónde empezar, cómo diseñar y cómo implementar.