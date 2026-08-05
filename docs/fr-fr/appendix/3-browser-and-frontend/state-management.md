# Principes : Gestion d'état frontend
::: tip 🎯 Question centrale
**Lorsque l'application devient de plus en plus grande, comment partager et synchroniser élégamment les données entre les composants ?** Vous pourriez rencontrer ce dilemme : l'utilisateur ajoute un article au panier sur la page produit, mais le nombre d'articles dans l'en-tête ne se met pas à jour ; deux composants sans relation ont besoin des mêmes données, mais vous ne savez pas comment les transmettre. Ce chapitre vous fera passer du « transfert de données chaotique » à une « gestion d'état claire ».
:::

---

## 1. Motivation et justification : la « composantisation et la gestion d'état »

### 1.1 Du petit atelier à l'usine : l'évolution du développement frontend

Avant de commencer, une question : **avez-vous déjà essayé de préparer un grand repas dans une cuisine ?**

Si vous vous faites juste un bol de nouilles, c'est simple — une casserole, des nouilles, un peu d'assaisonnement, et c'est prêt en dix secondes. Mais si vous devez ouvrir un restaurant qui sert des centaines de clients par jour, vous ne pouvez plus « faire ce que vous voulez ». Vous avez besoin de recettes standardisées, d'une répartition claire des tâches, de processus d'approvisionnement unifiés, pour garantir une qualité stable et une efficacité de service élevée.

Le développement frontend, c'est pareil. Quand on code seul un petit projet, on peut mettre le code n'importe où. Mais quand l'équipe s'agrandit et que le projet devient plus complexe, il faut une méthode systématique pour organiser le code et gérer les données. C'est exactement le problème que la **composantisation et la gestion d'état** résolvent.

::: tip 🤔 Que sont un « composant » et un « état » ?
Avant de continuer, expliquons d'abord deux termes fondamentaux :

**Composant (Component)** : comme une brique de Lego, chaque brique est une partie indépendante avec sa propre forme, couleur et fonction. Vous pouvez assembler plusieurs briques pour construire un château complexe. En développement frontend, un bouton, un formulaire, une barre de navigation, tout cela peut être un composant.

**État (State)** : c'est la « mémoire » du composant. Par exemple, un bouton « se souvient » s'il est « désactivé » ou « activé » ; un composant de panier « se souvient » des articles qu'il contient. L'état change, et ces changements déclenchent la mise à jour de l'interface.

**Composantisation + Gestion d'état = Code organisé + Flux de données clair**
:::

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🏠 Mode petit atelier**
- Le code est écrit dans un seul fichier, comme cuisiner tous les plats dans une seule casserole
- Les données sont transmises partout, comme un serveur qui court dans tout le restaurant
- Modifier un endroit peut affecter d'autres parties, comme trop de sel qui gâche tout le plat

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🏭 Mode usine**
- Le code est divisé en composants, comme un restaurant divisé en salle, cuisine et service des achats
- Les données sont gérées de manière centralisée, comme un entrepôt et un système de distribution unifiés
- La portée des modifications est claire, comme changer un plat qui n'affecte pas tout le restaurant

</div>
</div>

### 1.2 Une histoire vraie : pourquoi vous devez comprendre la gestion d'état

Vous pourriez dire : « Mais j'utilise Vue/React, n'ont-ils pas déjà leur propre gestion d'état ? » Laissez-moi vous raconter une histoire vraie pour vous montrer pourquoi il est si important de comprendre systématiquement la composantisation et la gestion d'état.

::: warning Les déboires de Xiaomei
Xiaomei est une ancienne cheffe de produit dans une entreprise d'e-commerce, reconvertie en développeuse frontend. Elle vient de prendre en charge la refonte de la fonctionnalité panier de l'entreprise. Elle utilisait auparavant un ancien projet de l'ère jQuery, et doit maintenant le moderniser avec Vue 3.

Xiaomei s'est dit : « La logique du panier est simple, il suffit de stocker un tableau. » Elle a donc commencé à coder :
- Dans le composant de la page détail produit, elle utilise un tableau `cart` pour stocker les données du panier
- Dans le composant de la page panier, elle définit un autre tableau `cartItems`
- Dans le composant de la barre de navigation, il y a encore une variable `cartCount`

Les problèmes sont vite apparus :
1. **Données désynchronisées** : l'utilisateur ajoute un article sur la page détail, mais les données de la page panier ne se mettent pas à jour
2. **Code dupliqué** : Xiaomei a dû écrire plusieurs fonctions « ajouter au panier » dans différents composants
3. **Maintenance difficile** : quand les opérations demandent d'ajouter une fonction « vider le panier », Xiaomei découvre qu'elle doit modifier trois endroits

Plus tard, elle demande conseil à Aqiang, l'architecte frontend. En un coup d'œil sur le code, il dit : « Tu as commis le péché capital de la gestion d'état — stocker les mêmes données à plusieurs endroits. »

La solution est simple : utiliser Pinia pour créer un état global du panier, où tous les composants lisent et écrivent les données depuis un seul et même endroit. Après cette modification, tous les problèmes sont résolus.

Xiaomei a compris une leçon importante : **sans comprendre la composantisation et la gestion d'état, vous écrirez du « code spaghetti » impossible à maintenir.**
:::

::: info 💡 Leçon clé
La composantisation et la gestion d'état ne sont pas des « fonctionnalités optionnelles » des frameworks, mais les piliers du développement frontend moderne. Les comprendre vous permet de concevoir une architecture claire, d'écrire du code maintenable et d'être à l'aise dans la collaboration en équipe.
:::

---

## 2. Concepts fondamentaux : comprendre l'essence de la composantisation

::: tip 🤔 Qu'est-ce que la « pensée composant » ?
La pensée composant est une méthode qui consiste à décomposer une interface complexe en unités de code indépendantes, réutilisables et à responsabilité unique.

Pour faire une analogie : imaginez que vous assemblez un ordinateur. Vous achetez séparément le CPU, la mémoire, le disque dur, la carte graphique, puis vous les assemblez. Chaque composant a une fonction claire, et vous pouvez remplacer n'importe quel composant sans affecter les autres.

La composantisation permet au code frontend d'être tout aussi « modulaire » — chaque composant s'occupe de ses propres affaires et collabore avec les autres via des interfaces bien définies.
:::

### 2.1 Comprendre la composantisation avec l'analogie du restaurant

Utilisons l'analogie du restaurant pour comprendre les idées fondamentales de la composantisation :

| Concept | 🍽️ Analogie du restaurant | Rôle réel | Exemple concret |
|------|-------------|----------|----------|
| **Composant** | Les différents services du restaurant (salle, cuisine, achats) | Chaque service s'occupe de ses propres affaires | Le composant bouton gère le clic, le composant formulaire gère la saisie |
| **Props (propriétés)** | La commande que le client passe au serveur | Le composant parent transmet des données au composant enfant | Le parent transmet le « nom d'utilisateur » au composant avatar |
| **Events (événements)** | Le serveur qui informe la cuisine « nouvelle commande » | Le composant enfant notifie le parent de ce qui s'est passé | Le composant bouton dit au parent « j'ai été cliqué » |
| **State (état)** | La « liste des commandes en cours » de la cuisine | Les données stockées à l'intérieur du composant | Le composant panier se souvient des articles qu'il contient |

::: tip 📊 Que pouvez-vous retenir de ce tableau ?
Parcourons ce tableau ligne par ligne :

**Composant** : comme un restaurant a différents services, une page frontend est composée de différents composants. Chaque composant est une partie indépendante avec ses propres responsabilités.

**Props** : c'est le moyen par lequel le composant parent « transmet des données » au composant enfant. Comme un client qui passe commande au serveur, le parent peut transmettre des données (comme le nom d'utilisateur, les informations sur le produit) à l'enfant via les props. Attention : les props sont « unidirectionnelles », elles ne vont que du parent vers l'enfant, jamais dans l'autre sens.

**Events** : quand le composant enfant doit notifier le parent (par exemple, un bouton cliqué, un formulaire soumis), il déclenche un événement. Comme un serveur qui, après avoir pris une commande, informe la cuisine de « commencer à cuisiner ». Cela maintient l'unidirectionnalité du flux de données — l'enfant ne peut pas modifier directement les données du parent, il ne peut qu'« envoyer un message ».

**State** : c'est la « mémoire » interne du composant. Comme la cuisine doit se souvenir des commandes en cours, le composant doit se souvenir de son état (par exemple, les articles dans le panier, si le bouton est désactivé). Quand l'état change, le composant met automatiquement à jour l'interface.
:::

<ComponentHierarchyDemo />

### 2.2 Props et Events : le « canal officiel » entre parent et enfant

Dans les frameworks frontend (Vue, React), **les Props et les Events sont le moyen standard de communication entre composants parent et enfant**.

**Exemple Vue :**

```vue
<!-- Parent.vue - Composant parent -->
<template>
  <div>
    <!-- Comme donner un menu au serveur, transmettre des données via les props -->
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
  name: 'Zhang San',
  isAdmin: true
})

const handleDelete = (userId) => {
  console.log('Supprimer l\'utilisateur :', userId)
  // Gérer la logique de suppression
}
</script>
```

```vue
<!-- Child.vue - Composant enfant -->
<template>
  <div class="user-card">
    <h3>{{ userName }}</h3>
    <span v-if="isAdmin" class="badge">Administrateur</span>
    <button @click="requestDelete">Supprimer l'utilisateur</button>
  </div>
</template>

<script setup>
// Recevoir les données transmises par le parent
const props = defineProps({
  userName: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
})

// Définir les événements qui peuvent être déclenchés
const emit = defineEmits(['delete-user'])

const requestDelete = () => {
  // Notifier le parent via un événement
  emit('delete-user', props.userName)
}
</script>
```

::: tip 💡 Principe fondamental
**Props vers le bas, Events vers le haut** — c'est la règle d'or de la communication entre composants.

- Le composant parent transmet les données à l'enfant via les **props** (comme assigner des tâches à un subordonné)
- Le composant enfant notifie le parent de ce qui s'est passé via les **events** (comme un subordonné qui fait un rapport)

Cela maintient un flux de données clair et unidirectionnel, évitant le chaos où « n'importe qui peut modifier les données ».
:::

<PropsFlowDemo />

### 2.3 Flux de données unidirectionnel : pourquoi ne peut-on pas modifier directement les props

Beaucoup de débutants font une erreur : modifier directement la valeur des props dans le composant enfant.

```vue
<!-- ❌ Mauvaise pratique -->
<script setup>
const props = defineProps({
  count: { type: Number, default: 0 }
})

// Modifier directement les props — c'est interdit !
props.count = 10  // Provoquera une erreur
</script>
```

**Pourquoi ne peut-on pas modifier directement les props ?**

Imaginez : vous empruntez un livre à la bibliothèque (props), puis vous gribouillez dessus (modifier les props). Les autres personnes qui emprunteront ce livre (d'autres composants) verront aussi vos gribouillages, ce qui causera le chaos. La bonne approche : si vous devez modifier les données, laissez le parent le faire, l'enfant ne fait que « demander la modification ».

```vue
<!-- ✅ Bonne pratique -->
<script setup>
const props = defineProps({
  count: { type: Number, default: 0 }
})

const emit = defineEmits(['update-count'])

// Demander au parent de modifier via un événement
const increment = () => {
  emit('update-count', props.count + 1)
}
</script>
```

---

## 3. Du « chaos » à « l'ordre » : l'évolution de la communication entre composants

::: tip 🤔 Pourquoi cette évolution est-elle nécessaire ?
Au fur et à mesure que le projet grandit, la communication entre les composants devient de plus en plus complexe. Voyons comment une vraie équipe a évolué étape par étape vers une solution de gestion d'état claire.

Il ne s'agit pas seulement d'une « mise à niveau des outils », mais d'un **changement complet de mentalité** — passer du « transfert arbitraire de données » à la « conception d'un flux de données clair ».
:::

### 3.1 Vue d'ensemble de l'évolution

Le tableau ci-dessous montre les quatre phases de l'évolution de la communication entre composants, vous pouvez voir comment les problèmes sont résolus étape par étape :

| Phase | Mode de communication | Problèmes typiques | Changement clé |
|------|---------|----------|----------|
| **Phase 1 : Transfert libre** | Modification directe, variables globales | Données désynchronisées, difficile à déboguer | Aucune norme, tout est permis |
| **Phase 2 : Props/Events** | Communication standard parent-enfant | Props Drilling (transmission en cascade) | Une norme existe, mais les imbrications profondes sont pénibles |
| **Phase 3 : Bibliothèque de gestion d'état** | Vuex/Redux/Pinia | Courbe d'apprentissage, code boilerplate | Données centralisées, débogage facile |
| **Phase 4 : Solutions modernes** | Composables/Atomic | Besoin de comprendre de nouveaux concepts | Plus flexible, plus concis |

<EventBusDemo />

::: tip 📊 Que pouvez-vous retenir de ce tableau ?
Parcourons ce tableau ligne par ligne :

**Phase 1 → Phase 2** : de « sans norme » à « avec norme ». C'est un saut qualitatif — vous commencez à utiliser la communication standard props/events, le flux de données devient clair. Mais le prix à payer est que lorsque la hiérarchie des composants est profonde, les données doivent être transmises niveau par niveau, ce qui est pénible (c'est le Props Drilling).

**Phase 2 → Phase 3** : de la « gestion dispersée » à la « gestion centralisée ». Vous commencez à utiliser des bibliothèques de gestion d'état comme Vuex/Redux, en plaçant les données partagées dans un « entrepôt » global où tous les composants lisent et écrivent. Cela résout le Props Drilling, mais la courbe d'apprentissage augmente.

**Phase 3 → Phase 4** : du « lourd » au « léger ». Les nouvelles solutions (comme la Composition API de Vue 3, les Hooks de React) rendent la gestion d'état plus flexible et plus concise. Vous n'êtes plus obligé d'utiliser un store global, vous pouvez composer de petites unités d'état selon vos besoins.

**En résumé** : l'évolution n'est pas seulement « remplacer par de meilleurs outils », mais une **mise à niveau complète de la mentalité** — passer du transfert arbitraire des données à la conception d'un flux de données clair.
:::

### 3.2 Phase 1 : Transfert libre — le début du chaos

Pourquoi l'appeler « transfert libre » ? Parce qu'à cette phase, il n'y a aucune norme, les données sont transmises n'importe comment — variables globales, modifications directes, bus d'événements dans tous les sens.

**Scénario typique : les données du panier dispersées partout**

```javascript
// Composant de la page détail produit
export default {
  data() {
    return {
      localCart: []  // Maintient sa propre copie des données du panier
    }
  },
  methods: {
    addToCart(product) {
      this.localCart.push(product)
      // Tente de synchroniser avec d'autres composants
      window.cart = this.localCart  // ❌ Variable globale !
    }
  }
}

// Composant de la page panier
export default {
  data() {
    return {
      cartItems: []  // Encore une copie des données du panier
    }
  },
  mounted() {
    // Tente de lire depuis la variable globale
    this.cartItems = window.cart || []  // ❌ Pas fiable !
  }
}

// Composant de la barre de navigation
export default {
  data() {
    return {
      cartCount: 0  // Une troisième copie des données !
    }
  },
  mounted() {
    // Vérifie périodiquement les changements (quelle absurdité)
    setInterval(() => {
      this.cartCount = window.cart?.length || 0
    }, 1000)  // ❌ Mauvaises performances !
  }
}
```

**Caractéristiques de cette phase :**
- ✅ **Avantages** : simple et direct, aucune courbe d'apprentissage
- ❌ **Inconvénients** : données dispersées, difficile à synchroniser, débogage pénible, un vrai chaos

### 3.3 Phase 2 : Props/Events — l'établissement des normes

Le chaos du transfert libre a fait prendre conscience à l'équipe : **nous avons besoin de normes**. Ils ont donc commencé à utiliser les moyens de communication standard fournis par le framework : les props et les events.

**Scénario typique : Props Drilling (forage de propriétés)**

```vue
<!-- Composant ancêtre : App.vue -->
<template>
  <div class="app">
    <!-- Transmettre les informations utilisateur niveau par niveau -->
    <Layout :user-name="userName" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Layout from './Layout.vue'

const userName = ref('Zhang San')
</script>
```

```vue
<!-- Niveau intermédiaire : Layout.vue -->
<template>
  <div class="layout">
    <Header :user-name="userName" />  <!-- Juste transmettre, sans utiliser -->
    <Main>
      <Page :user-name="userName" />  <!-- Juste transmettre, sans utiliser -->
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
<!-- Là où on en a vraiment besoin : Header.vue -->
<template>
  <header>
    <span>{{ userName }}</span>  <!-- Enfin utilisé -->
  </header>
</template>

<script setup>
const props = defineProps({
  userName: String
})
</script>
```

**Caractéristiques de cette phase :**
- ✅ **Avantages** : flux de données clair, unidirectionnel, facile à comprendre
- ❌ **Inconvénients** : Props Drilling (transmission en cascade pénible), communication inter-composants difficile

::: tip 🤔 Qu'est-ce que le Props Drilling ?
Le Props Drilling signifie que **les données doivent traverser de nombreux composants intermédiaires, niveau par niveau, alors que ces composants intermédiaires n'utilisent pas réellement ces données**.

C'est comme si vous deviez livrer un colis à quelqu'un au cinquième étage, mais que le règlement exige que chaque étage signe un accusé de réception. Les personnes des étages 1 à 4 ne font que « transmettre le colis », elles n'en ont pas besoin, mais doivent quand même participer. C'est évidemment très pénible.
:::

### 3.4 Phase 3 : Bibliothèques de gestion d'état — gestion centralisée

Les difficultés du Props Drilling ont donné naissance aux bibliothèques de gestion d'état (Vuex, Redux, Pinia). Leur idée centrale : **placer les données partagées dans un « entrepôt » global, où tous les composants lisent et écrivent les données**.

**Scénario typique : gérer le panier avec Pinia**

```javascript
// stores/cart.js - État global du panier
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // Toutes les données du panier sont centralisées ici
  const items = ref([])

  // Propriété calculée : nombre d'articles
  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  // Méthode : ajouter un article
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
<!-- Composant de la page détail produit -->
<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

const addToCart = (product) => {
  cart.addItem(product)  // Appel direct, sans transmission en cascade
}
</script>
```

```vue
<!-- Composant de la barre de navigation -->
<template>
  <header>
    <span>Panier ({{ cart.itemCount }})</span>
  </header>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()  // Lecture directe, synchronisation automatique
</script>
```

**Caractéristiques de cette phase :**
- ✅ **Avantages** : données centralisées, résout le Props Drilling, outils de débogage puissants
- ❌ **Inconvénients** : courbe d'apprentissage, code supplémentaire nécessaire (code boilerplate), peut être excessif pour des projets simples

### 3.5 Phase 4 : Solutions modernes — flexibilité et concision

Bien que puissantes, les bibliothèques de gestion d'état ont aussi le problème de « tirer sur une mouche avec un canon ». Pour les projets de petite et moyenne taille, des solutions plus flexibles et plus légères sont apparues.

**Scénario typique : réutiliser la logique d'état avec des Composables/Hooks**

```javascript
// composables/useCart.js - Logique de panier réutilisable
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
<!-- Utilisation dans n'importe quel composant -->
<script setup>
import { useCart } from '@/composables/useCart'

// Chaque appel crée une nouvelle instance d'état
// Adapté à l'état local interne au composant
const { items, itemCount, addItem } = useCart()
</script>
```

**Caractéristiques de cette phase :**
- ✅ **Avantages** : flexible, léger, composable, à utiliser selon les besoins
- ❌ **Inconvénients** : nécessite de comprendre la pensée compositionnelle, le partage inter-composants nécessite un traitement supplémentaire

---

## 4. Bibliothèques de gestion d'état en détail : Vuex vs Pinia vs Redux

::: tip 🤔 Comment choisir une bibliothèque de gestion d'état ?
Face aux différentes bibliothèques de gestion d'état, vous pourriez être perplexe : laquelle choisir ?

En réalité, il n'y a pas de « meilleure » bibliothèque, seulement la « plus adaptée ». Pour choisir, considérez ces facteurs :
- **Quel framework utilisez-vous ?** Vue → Pinia, React → Redux/Zustand
- **Quelle est la taille du projet ?** Petit projet → Composable, grand projet → bibliothèque de gestion d'état
- **Quelle est l'expérience de l'équipe ?** Choisissez ce que l'équipe connaît, ou ce qui a une faible courbe d'apprentissage

Le contenu suivant détaille les caractéristiques et les cas d'usage des principales bibliothèques de gestion d'état.
:::

### 4.1 Comparaison des principales bibliothèques de gestion d'état

| Caractéristique | Redux | Vuex | Pinia | Zustand |
| :--- | :--- | :--- | :--- | :--- |
| **Framework cible** | React | Vue | Vue | React |
| **Courbe d'apprentissage** | Raide | Moyenne | Douce | Douce |
| **Code boilerplate** | Beaucoup | Moyen | Peu | Très peu |
| **TypeScript** | Bon | Bon | Excellent | Excellent |
| **Outils de débogage** | Puissants | Bons | Excellents | Bons |
| **Cas d'usage** | Grands projets | Projets Vue 2/3 moyens à grands | Nouveaux projets Vue 3 | Projets React petits à moyens |

::: tip 📊 Que pouvez-vous retenir de ce tableau ?
Parcourons ce tableau ligne par ligne :

**Redux** : la bibliothèque de gestion d'état classique de l'écosystème React. Avantages : normes strictes, outils de débogage puissants. Inconvénients : beaucoup de code boilerplate, courbe d'apprentissage raide. Convient aux grands projets et aux équipes qui ont besoin de normes strictes.

**Vuex** : la bibliothèque de gestion d'état officielle de l'ère Vue 2. Sa philosophie est similaire à Redux, mais plus adaptée au système réactif de Vue. Encore utilisable aujourd'hui, mais Pinia est recommandé pour les nouveaux projets.

**Pinia** : la bibliothèque de gestion d'état de nouvelle génération officiellement recommandée pour Vue 3. Syntaxe concise, bon support TypeScript, faible courbe d'apprentissage. **C'est le premier choix pour les projets Vue 3.**

**Zustand** : la bibliothèque de gestion d'état légère de l'écosystème React. API minimaliste, quasiment aucun code boilerplate. Convient aux projets React de petite et moyenne taille.
:::

<StateManagementComparisonDemo />

### 4.2 Pinia en pratique : le choix recommandé pour Vue 3

Pinia est la bibliothèque de gestion d'état officiellement recommandée par l'équipe Vue, conçue spécialement pour Vue 3. Elle est plus concise et plus facile à utiliser que Vuex.

**Pourquoi ce nom, Pinia ?**

Pinia signifie « ananas » en espagnol. L'ananas est un fruit composé de nombreuses petites fleurs, chaque fleur est indépendante, mais l'ensemble forme un tout unifié. C'est exactement la métaphore de la philosophie de conception de Pinia — **chaque store est indépendant, mais peut être combiné avec les autres**.

**Concepts fondamentaux :**

::: details Voir l'exemple de code complet
```javascript
// stores/user.js - Gestion de l'état utilisateur
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 1. State : stocker les données
  const userInfo = ref(null)
  const isLoggedIn = computed(() => !!userInfo.value)

  // 2. Actions : méthodes pour modifier les données
  const login = async (username, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
    const user = await response.json()
    userInfo.value = user  // Modification directe, Pinia gère la réactivité
  }

  const logout = () => {
    userInfo.value = null
  }

  // 3. Getters : propriétés calculées
  const displayName = computed(() => {
    return userInfo.value?.name || 'Visiteur'
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

**Utilisation dans un composant :**

```vue
<template>
  <div class="user-panel">
    <span v-if="user.isLoggedIn">Bienvenue, {{ user.displayName }}</span>
    <button v-if="user.isLoggedIn" @click="user.logout">Déconnexion</button>
    <button v-else @click="showLoginDialog">Connexion</button>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

// Obtenir directement le store, tout le contenu est réactif
const user = useUserStore()

const showLoginDialog = () => {
  // Afficher la boîte de dialogue de connexion...
}
</script>
```

**Avantages de Pinia :**

| Avantage | Description | Comparé à Vuex |
|------|------|----------|
| **API concise** | Pas besoin de mutations, modification directe du state | Vuex nécessite de séparer mutations et actions |
| **TypeScript-friendly** | Déduction de types native, pas de configuration supplémentaire | Vuex nécessite des définitions de types complexes |
| **Modularisation automatique** | Chaque fichier store devient automatiquement un module | Vuex nécessite une configuration manuelle de `namespaced` |
| **Taille réduite** | Environ 1 Ko après build | Vuex environ 3 Ko |

<VuexPiniaDemo />

### 4.3 Redux en pratique : le choix classique pour React

Redux est la bibliothèque de gestion d'état la plus classique de l'écosystème React, réputée pour son flux de données unidirectionnel strict.

**Pourquoi ce nom, Redux ?**

Redux est l'abréviation de « Reduced Flux ». Flux est un modèle d'architecture d'application proposé par Facebook, et Redux a simplifié les concepts de Flux, d'où le nom « Reduced Flux ».

**Principes fondamentaux :**

1. **Source de données unique** : tout le state de l'application est stocké dans un arbre d'objets unique
2. **State en lecture seule** : la seule façon de changer le state est de déclencher une action
3. **Modification par fonctions pures** : les Reducers doivent être des fonctions pures

::: details Voir l'exemple de code complet
```javascript
// 1. Définir les types d'actions
const ADD_TODO = 'ADD_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'

// 2. Définir les créateurs d'actions
const addTodo = (text) => ({
  type: ADD_TODO,
  payload: { id: Date.now(), text, completed: false }
})

const toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  payload: { id }
})

// 3. Définir le Reducer (fonction pure)
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

// 4. Créer le Store
import { createStore } from 'redux'
const store = createStore(todoReducer)
```
:::

**Utilisation dans React :**

```jsx
import { useSelector, useDispatch } from 'react-redux'

function TodoList() {
  // Lire le state
  const todos = useSelector(state => state.todos)

  // Obtenir la fonction dispatch
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

**Avantages et inconvénients de Redux :**

| Avantages | Inconvénients |
| :--- | :--- |
| Flux de données strict, facile à déboguer | Beaucoup de code boilerplate, courbe d'apprentissage raide |
| Débogage par voyage dans le temps (Time Travel) | Même un état simple nécessite beaucoup de code |
| Riche écosystème de middlewares | Ne convient pas aux petits projets |
| Mises à jour d'état prévisibles | Nécessite de comprendre les concepts de programmation fonctionnelle |

<ReduxFlowDemo />

<MobxReactivityDemo />

<ZustandJotaiDemo />

---

## 5. Guide pratique : comment concevoir la gestion d'état

::: tip 🤔 Quand a-t-on besoin d'une bibliothèque de gestion d'état ?
Tous les projets n'ont pas besoin d'une bibliothèque de gestion d'état. Avant d'en introduire une, posez-vous ces questions :

1. **Combien de composants ont besoin de partager ces données ?**
   - Si seulement 2-3 composants, les props/events suffisent
   - Si 5 composants ou plus, envisagez une bibliothèque de gestion d'état

2. **Ces données changent-elles fréquemment ?**
   - Si elles ne changent presque pas (comme les infos utilisateur), utilisez Provide/Inject
   - Si elles changent souvent (comme le panier), utilisez une bibliothèque de gestion d'état

3. **Quelle est la taille de l'équipe ?**
   - Individuel ou petite équipe : une solution simple suffit
   - Grande équipe : besoin de normes strictes et d'outils de débogage puissants

**Rappelez-vous : commencez simple, montez en puissance selon les besoins.**
:::

### 5.1 Principes de conception de l'état

Quelle que soit la solution de gestion d'état que vous choisissez, vous devez suivre ces principes :

**Principe 1 : Source de données unique**

Les mêmes données ne doivent être stockées qu'à un seul endroit. Ne définissez pas les mêmes données en double dans plusieurs composants.

```javascript
// ❌ Erreur : données dispersées partout
const ProductDetail = { cart: [] }
const CartPage = { items: [] }
const Header = { count: 0 }

// ✅ Correct : données centralisées
const cartStore = { items: [] }  // Source de données unique
```

**Principe 2 : Immuabilité**

Lors de la modification de l'état, créez un nouvel objet au lieu de modifier directement l'objet original.

```javascript
// ❌ Erreur : modification directe
state.items.push(newItem)

// ✅ Correct : créer un nouvel objet
state.items = [...state.items, newItem]
```

**Principe 3 : L'état remonte, les événements descendent**

L'état partagé doit être placé dans le composant ancêtre commun le plus proche ou dans le store global, et non dispersé dans les différents composants enfants.

```vue
<!-- ❌ Erreur : l'état est dans le composant enfant -->
<Parent>
  <Child :data="childData" @update="childData = $event" />
</Parent>

<!-- ✅ Correct : l'état est dans le composant parent -->
<Parent>
  <Child :data="parentData" @update="parentData = $event" />
</Parent>
```

### 5.2 Cas pratique : conception de l'état d'un panier e-commerce

Mettons en pratique les connaissances précédentes pour concevoir une solution de gestion d'état pour un panier d'e-commerce.

**Analyse des besoins :**

- La page liste des produits peut ajouter des articles au panier
- La page panier peut consulter, modifier la quantité, supprimer des articles
- La barre de navigation affiche le nombre d'articles dans le panier
- Possibilité de sélectionner/désélectionner des articles, calculer le prix total des articles sélectionnés
- Persistance des données dans le localStorage

**Conception de l'état (Pinia) :**

```javascript
// stores/cart.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // ============ State (État) ============
  const items = ref([])  // Liste des articles du panier
  const selectedIds = ref([])  // IDs des articles sélectionnés

  // Restaurer les données depuis le localStorage
  const initFromStorage = () => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        items.value = data.items || []
        selectedIds.value = data.selectedIds || []
      } catch (e) {
        console.error('Échec de la lecture des données du panier :', e)
      }
    }
  }

  // Persister dans le localStorage
  const persist = () => {
    localStorage.setItem('cart', JSON.stringify({
      items: items.value,
      selectedIds: selectedIds.value
    }))
  }

  // ============ Getters (Propriétés calculées) ============
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

  // ============ Actions (Méthodes) ============
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

  // Initialisation
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

**Utilisation dans les composants :**

```vue
<!-- Page détail produit : ProductDetail.vue -->
<template>
  <div class="product-detail">
    <h2>{{ product.name }}</h2>
    <p class="price">¥{{ product.price }}</p>
    <button @click="addToCart">Ajouter au panier</button>
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
<!-- Barre de navigation : Header.vue -->
<template>
  <header class="header">
    <div class="logo">Ma boutique</div>
    <nav>
      <RouterLink to="/">Accueil</RouterLink>
      <RouterLink to="/cart">
        Panier ({{ cart.itemCount }})
      </RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()  // Utilisation directe, réagit automatiquement aux changements
</script>
```

---

## 6. Pièges courants et guide pour les éviter

::: warning ⚠️ Ces pièges, 90 % des débutants tombent dedans
Dans la pratique de la gestion d'état, certaines erreurs sont particulièrement courantes. Résumons les pièges les plus fréquents et comment les éviter.
:::

### 6.1 Piège n°1 : Modifier directement les Props ou le State

**Code erroné :**

```javascript
// ❌ Modifier directement les props
props.user.name = 'Li Si'

// ❌ Modifier directement le state de Vuex
store.state.user.name = 'Li Si'

// ❌ Modifier directement un élément de tableau
state.items[0].name = 'Nouveau nom'
```

**Pourquoi cela ne fonctionne-t-il pas ?**

Les frameworks frontend (Vue/React) ont besoin de « tracer » les changements de données pour mettre automatiquement à jour l'interface. Si vous modifiez directement un objet ou un tableau, le framework peut ne pas détecter le changement, ce qui empêche la mise à jour de l'interface.

**Bonne pratique :**

```javascript
// ✅ Vue 3 / Pinia : modifier directement les propriétés de premier niveau
store.user.name = 'Li Si'  // Pinia gère automatiquement la réactivité

// ✅ Vue 2 / Vuex : passer par une mutation
mutations: {
  UPDATE_USER_NAME(state, newName) {
    state.user.name = newName
  }
}

// ✅ Modifier un tableau : créer un nouveau tableau
state.items = state.items.map((item, index) =>
  index === 0 ? { ...item, name: 'Nouveau nom' } : item
)
```

### 6.2 Piège n°2 : Modifier l'état dans un Getter

**Code erroné :**

```javascript
// ❌ Modifier l'état dans un getter
getters: {
  doubleCount(state) {
    state.count *= 2  // Effet de bord !
    return state.count
  }
}
```

**Pourquoi cela ne fonctionne-t-il pas ?**

Un Getter doit être une « fonction pure », qui ne fait que calculer et retourner une valeur, sans aucun effet de bord (modification de l'état). Modifier l'état dans un getter peut provoquer des boucles infinies et des problèmes difficiles à déboguer.

**Bonne pratique :**

```javascript
// ✅ Le Getter ne fait que calculer, sans modifier
getters: {
  doubleCount(state) {
    return state.count * 2
  }
}

// ✅ Si vous devez modifier, utilisez une action
actions: {
  doubleCountAndSave({ commit }) {
    commit('SET_DOUBLE_COUNT')
  }
}
```

### 6.3 Piège n°3 : Oublier de nettoyer les écouteurs d'événements

**Code erroné :**

```javascript
// ❌ Oublier de se désabonner
export default {
  created() {
    EventBus.$on('cart-updated', this.handleCartUpdate)
  }
  // Le composant est détruit, mais l'écouteur est toujours là !
}
```

**Pourquoi cela ne fonctionne-t-il pas ?**

Si le composant est détruit mais que l'écouteur d'événement reste actif, cela provoque une fuite de mémoire (la mémoire occupée ne peut pas être libérée). Dans une application monopage, l'utilisateur change constamment de page, et ces écouteurs non nettoyés s'accumulent, finissant par ralentir la page.

**Bonne pratique :**

```javascript
// ✅ Se désabonner à temps
export default {
  created() {
    EventBus.$on('cart-updated', this.handleCartUpdate)
  },
  beforeUnmount() {  // Vue 3 utilise beforeUnmount, Vue 2 utilise beforeDestroy
    EventBus.$off('cart-updated', this.handleCartUpdate)
  }
}
```

### 6.4 Piège n°4 : Utiliser excessivement la gestion d'état

**Code erroné :**

```javascript
// ❌ Mettre tous les états dans le store
const store = useStore()
store.inputValue = 'Saisie utilisateur'
store.isModalOpen = true
store.currentTab = 'profile'
```

**Pourquoi cela ne fonctionne-t-il pas ?**

Tous les états n'ont pas besoin d'être dans le store global. Si un état n'est utilisé que dans un seul composant (comme la valeur d'un champ de saisie, l'ouverture d'une modale), gardez-le dans le composant. L'utilisation excessive de la gestion d'état rend le code inutilement complexe.

**Bonne pratique :**

```javascript
// ✅ Les états locaux sont gérés dans le composant
const inputValue = ref('')

// ✅ Seuls les états qui doivent être partagés vont dans le store
const userInfo = useUserStore()  // Plusieurs composants ont besoin des infos utilisateur
const cart = useCartStore()  // Plusieurs composants ont besoin des données du panier
```

---

## 7. Résumé et recommandations

### 7.1 Récapitulatif des connaissances clés

Récapitulons les concepts fondamentaux de la composantisation et de la gestion d'état avec un tableau :

| Concept | En une phrase | Problème résolu | Outils typiques |
|------|-----------|-----------|----------|
| **Composantisation** | Diviser l'interface en parties indépendantes et réutilisables | Réutilisation du code, séparation des responsabilités | Composants Vue/React |
| **Props** | Le parent transmet des données à l'enfant | Communication parent-enfant | Intégré à Vue/React |
| **Events** | L'enfant notifie le parent de ce qui s'est passé | Communication enfant-parent | Intégré à Vue/React |
| **State** | Données stockées à l'intérieur du composant | Mémoriser l'état du composant | Intégré à Vue/React |
| **Bibliothèque de gestion d'état** | Gérer centralement l'état global partagé | Communication inter-composants, Props Drilling | Pinia, Redux, Zustand |
| **Source de données unique** | Les mêmes données ne sont stockées qu'à un seul endroit | Incohérence des données, difficulté de synchronisation | Principe fondamental des bibliothèques de gestion d'état |

### 7.2 Recommandations selon les scénarios

| Scénario | Solution recommandée | Raison |
| :--- | :--- | :--- |
| **Communication parent-enfant** | Props + Events | Intégré au framework, simple et direct |
| **Transmission inter-niveaux** | Provide / Inject | Éviter la transmission en cascade |
| **État local du composant** | ref / useState | Simple, pas besoin d'outils supplémentaires |
| **Projet Vue de taille moyenne** | Pinia | Recommandation officielle, faible courbe d'apprentissage |
| **Projet React de taille moyenne** | Zustand | Minimaliste, sans code boilerplate |
| **Grand projet Vue** | Pinia + conventions | Flexible et extensible |
| **Grand projet React** | Redux Toolkit | Conventions strictes, écosystème riche |
| **Réutilisation de logique inter-composants** | Composable / Hooks | Flexible, composable |

### 7.3 Conseils d'apprentissage

**Pour les débutants :**

1. **Maîtrisez d'abord les bases** : comprenez les concepts fondamentaux de props, events et state
2. **Commencez par de petits projets** : n'introduisez pas tout de suite une bibliothèque de gestion d'état
3. **Codez beaucoup** : la théorie ne remplace jamais la pratique

**Pour les développeurs avancés :**

1. **Lisez le code source** : comprenez le fonctionnement interne de Pinia/Redux
2. **Apprenez les patterns** : familiarisez-vous avec les designs patterns courants (observateur, publication-abonnement)
3. **Suivez l'écosystème** : apprenez les outils associés (DevTools, middlewares)

**Retenez ces principes fondamentaux :**

1. **Commencez simple** : n'introduisez pas prématurément des bibliothèques de gestion d'état complexes
2. **Source de données unique** : évitez de stocker les mêmes données à plusieurs endroits
3. **Immuabilité** : créez de nouveaux objets lors de la modification de l'état, au lieu de modifier directement
4. **Choisissez selon vos besoins** : adaptez la solution à la taille du projet et à la situation de l'équipe

Nous espérons que cet article vous aidera à construire une compréhension globale de la composantisation et de la gestion d'état. Lorsque vous rencontrerez des problèmes complexes de flux de données dans vos projets réels, vous saurez par où commencer, comment concevoir et comment implémenter.