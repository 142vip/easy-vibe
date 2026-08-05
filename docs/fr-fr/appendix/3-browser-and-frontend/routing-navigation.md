# Introduction : Routage et navigation frontend
::: tip 🎯 Question centrale
**Pourquoi certains sites web ne clignotent-ils pas en blanc lors du changement de page, et sont aussi fluides qu'une application ?** C'est la magie du routage frontend. Ce chapitre vous fera passer de la navigation traditionnelle « à tourne-page » des sites web classiques au monde du « changement de diapositive » des applications monopages, pour comprendre comment le routage frontend améliore considérablement l'expérience utilisateur.
:::

---

## 1. Motivation et justification : le « routage frontend »

### 1.1 Des sites traditionnels aux applications monopages : un changement qualitatif de l'expérience utilisateur

Repensez à l'expérience de navigation des premiers sites web : chaque clic sur un lien déclenchait un « tournage de page » complet — écran blanc momentané, roue de chargement qui tourne, toute la page qui se rerend. Si le réseau était lent, vous restiez à fixer la roue de chargement pendant plusieurs secondes. Cette expérience semble aujourd'hui dépassée, mais c'était la norme à l'époque.

Le développement frontend moderne a complètement changé ce paradigme. Nous utilisons la technique du routage frontend pour rendre les transitions de page aussi fluides qu'une application mobile — pas d'écran blanc, pas de roue de chargement, l'utilisateur ne perçoit presque pas le processus de « saut ». Cette amélioration n'est pas de la magie, c'est le mérite du système de routage frontend.

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📖 Site traditionnel (MPA)**
- Clic sur un lien → Rafraîchissement complet de la page
- Chaque page est un fichier HTML indépendant
- Le navigateur retélécharge toutes les ressources
- Expérience comme « tourner les pages d'un livre », avec un processus de changement de page perceptible

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📱 Application monopage (SPA)**
- Clic sur un lien → Transition sans rafraîchissement
- Un seul fichier HTML d'entrée
- Seules les données nécessaires sont téléchargées
- Expérience comme un « diaporama », fluide et naturelle

</div>
</div>

**C'est le problème central que le « routage frontend » doit résoudre : réaliser le changement de vue et la synchronisation de l'URL sans rafraîchir la page.**

<RouteMatchingDemo />

### 1.2 Une histoire vraie de piège à éviter : pourquoi vous devez comprendre les modes de routage

Vous pourriez dire : « J'utilise Vue Router ou React Router, je configure et ça marche, pourquoi devrais-je comprendre ces principes sous-jacents ? » Laissez-moi vous raconter une histoire vraie, et vous comprendrez pourquoi ces connaissances sont si importantes.

::: warning L'histoire du déploiement de Xiao Li
Xiao Li est un développeur frontend débutant, fraîchement embauché pour développer une application monopage basée sur Vue. En développement local, tout fonctionnait parfaitement, les transitions de routage étaient soyeuses. Mais après avoir déployé le projet sur le serveur de test, un problème est apparu : lorsque les utilisateurs accédaient directement à une route (comme `example.com/user/123`) ou rafraîchissaient la page de détail, ils voyaient une erreur **404 Not Found**.

Xiao Li était perdu : tout fonctionnait bien en local, pourquoi un 404 après le déploiement ? Il a passé beaucoup de temps à enquêter, allant jusqu'à soupçonner un problème de configuration du serveur.

Plus tard, il a demandé conseil à un collègue senior, qui a immédiatement identifié le problème : Xiao Li utilisait le mode History, mais le serveur n'était pas configuré avec un fallback. Lorsque l'utilisateur accède directement à `/user/123`, le serveur essaie de trouver un fichier correspondant à ce chemin, mais toutes les routes de la SPA pointent en réalité vers le même `index.html`. La solution est simple : configurer le serveur pour que toutes les routes retombent sur `index.html`, laissant le routage frontend prendre le relais.

Xiao Li a alors compris une leçon : **sans comprendre le principe des modes de routage et les exigences de configuration serveur, vous ne saurez même pas pourquoi une erreur se produit, et encore moins comment la résoudre.**
:::

::: info 💡 Enseignement clé
Le routage frontend n'est pas de la « magie noire ». Comprendre son fonctionnement vous permet de localiser rapidement et de résoudre précisément les problèmes de déploiement, de performance et de SEO. Plus important encore, cela vous aide à faire des choix plus éclairés lors de la conception architecturale d'un projet — quand utiliser le mode Hash, quand utiliser le mode History, et comment éviter les pièges courants.
:::

---

## 2. Concepts fondamentaux : route, mode, navigation

Avant d'approfondir les implémentations concrètes, nous devons d'abord clarifier quelques concepts fondamentaux. Pour vous aider à mieux comprendre, nous utiliserons une analogie avec une bibliothèque pour illustrer leurs relations.

::: tip 🤔 Quel rapport entre ces concepts et le routage ?
Route, mode et navigation sont les trois piliers du système de routage frontend.

Lorsque vous utilisez Vue Router ou React Router, le framework gère pour vous :
1. **Le mapping des routes** → Définir la correspondance entre les URL et les composants
2. **Le choix du mode** → Décider d'utiliser le mode Hash ou History
3. **Le contrôle de navigation** → Gérer les transitions de page, l'avance/retour du navigateur

Ainsi, **comprendre ces trois concepts, c'est savoir ce que fait réellement le système de routage, pourquoi certaines configurations spéciales sont parfois nécessaires, et pourquoi des problèmes surviennent au déploiement.**
:::

### 2.1 Comprendre le système de routage avec l'analogie de la bibliothèque

Imaginez que vous cherchez un livre dans une bibliothèque. Ce processus est étonnamment similaire au fonctionnement du routage frontend :

| Concept | 📚 Analogie de la bibliothèque | Rôle réel | Exemple concret |
|------|-------------|----------|----------|
| **Route** | La correspondance entre le numéro d'étagère et le livre | Définir le mapping entre l'URL et le composant de page | Le chemin `/user/123` correspond au composant `UserDetail.vue` |
| **Routeur (Router)** | Le système d'orientation et de localisation de la bibliothèque | Le module central qui gère toutes les routes et les comportements de navigation | Vue Router, React Router sont des routeurs |
| **Mode de routage** | La méthode d'indexation (catalogue papier vs système électronique) | Déterminer la forme de l'URL et l'implémentation sous-jacente | Le mode Hash utilise `#`, le mode History utilise des chemins normaux |
| **Navigation** | Se déplacer d'une étagère à une autre | L'action de basculer entre différentes pages | Clic sur un lien, saut programmatique, avance/retour du navigateur |

::: tip 📊 Que pouvez-vous tirer de ce tableau ?
Parcourons ce tableau ligne par ligne :

**Route** : c'est simplement une « configuration » qui indique au système « quelle URL correspond à quelle page ». Comme la cote d'un livre qui correspond à l'emplacement d'un livre.

**Routeur** : c'est le « gestionnaire », chargé de trouver le composant correspondant à l'URL actuelle et de le rendre. Comme le bibliothécaire qui trouve le livre d'après la cote que vous lui donnez.

**Mode de routage** : c'est la « méthode d'implémentation », qui détermine à quoi ressemble l'URL et quelle technologie sous-jacente est utilisée. Comme une bibliothèque qui peut utiliser un catalogue papier ou un système de recherche électronique.

**Navigation** : c'est le « comportement », l'action déclenchée par l'utilisateur pour changer de page. Comme vous déplacer de la section A à la section B dans la bibliothèque.

Comprendre la distinction entre ces quatre notions est essentiel : **la route est une configuration statique, le routeur est un gestionnaire dynamique, le mode est un choix technique, la navigation est un comportement utilisateur.**
:::

### 2.2 Route : le contrat de mapping entre URL et composants

Une route, par essence, est un « contrat » qui stipule quel contenu doit être affiché lorsqu'on accède à une URL donnée. Dans Vue Router, une configuration de route typique ressemble à ceci :

```javascript
const routes = [
  {
    path: '/',           // Chemin URL
    component: Home      // Composant correspondant
  },
  {
    path: '/user/:id',   // Route dynamique avec paramètre
    component: UserDetail,
    children: [          // Routes imbriquées
      { path: 'profile', component: UserProfile },
      { path: 'posts', component: UserPosts }
    ]
  }
]
```

**Vous vous demandez peut-être : pourquoi utiliser le routage au lieu d'une simple balise `<a>` ?**

La réponse réside dans la nature même de la « SPA » : une SPA n'a qu'une seule page HTML, toutes les transitions de page consistent en réalité à remplacer des composants dans la même page. Si vous utilisez une balise `<a href="/user/123">` traditionnelle, le navigateur va réellement demander le chemin `/user/123`, provoquant un rafraîchissement de la page ou une erreur 404. Le rôle du routage est d'intercepter ces comportements de navigation et de remplacer dynamiquement les composants via JavaScript, réalisant ainsi une transition sans rafraîchissement.

::: details 🔧 Modèles courants de configuration de route
**Route statique** (la plus simple) :
```javascript
{ path: '/home', component: Home }
{ path: '/about', component: About }
```

**Route dynamique** (avec paramètres) :
```javascript
{ path: '/user/:id', component: UserDetail }
// Peut correspondre à /user/123, /user/abc, etc.
// Dans le composant, on peut récupérer le paramètre via route.params.id
```

**Routes imbriquées** (relation parent-enfant) :
```javascript
{
  path: '/user/:id',
  component: UserLayout,    // Composant parent
  children: [
    { path: 'profile', component: UserProfile },   // Chemin réel /user/:id/profile
    { path: 'posts', component: UserPosts }        // Chemin réel /user/:id/posts
  ]
}
```

**Route joker** (page 404) :
```javascript
{ path: '/:pathMatch(.*)*', component: NotFound }
// Correspond à toutes les routes non définies
```
:::

### 2.3 Modes de routage : la différence fondamentale entre Hash et History

Le routage frontend propose deux modes d'implémentation principaux : le mode Hash et le mode History. Ils diffèrent fondamentalement par la forme de l'URL, l'implémentation sous-jacente et la compatibilité.

::: tip 🤔 Pourquoi deux modes ?
C'est le résultat de raisons historiques et de compromis techniques.

**Le mode Hash** est la première implémentation du routage frontend. Il utilise la partie hash de l'URL (c'est-à-dire le contenu après `#`). Les changements de hash ne déclenchent pas de rafraîchissement de la page et la compatibilité est excellente (même IE8 le supporte).

**Le mode History** est la « méthode standard » introduite avec HTML5. Il utilise les méthodes `pushState` et `replaceState` fournies par l'API History, ce qui permet d'avoir une URL plus « normale » (sans `#`), mais nécessite une configuration côté serveur.

Pour faire une analogie : le mode Hash, c'est comme « coller un post-it sur la porte d'une chambre » (sans modifier la structure de la chambre), le mode History, c'est comme « renuméroter les chambres » (il faut mettre à jour le système de plaque de porte).
:::

| Caractéristique | Mode Hash | Mode History |
|------|-----------|--------------|
| **Exemple d'URL** | `https://example.com/#/user/123` | `https://example.com/user/123` |
| **Principe d'implémentation** | Écoute de l'événement `hashchange` | Utilisation de l'API History (`pushState`, `replaceState`) |
| **Configuration serveur** | Non nécessaire (le hash n'est pas envoyé au serveur) | **Fallback vers index.html obligatoire** |
| **Compatibilité navigateur** | IE8+ (presque tous les navigateurs) | IE10+ (navigateurs modernes) |
| **Convivialité SEO** | Médiocre (les moteurs de recherche peuvent ignorer le hash) | Bonne (structure d'URL claire) |
| **Expérience utilisateur** | URL avec `#`, ressemble à une « ancre » | URL esthétique, proche des sites traditionnels |
| **Difficulté de déploiement** | Faible, aucune configuration spéciale | Élevée, nécessite une configuration serveur correcte |

<HashVsHistoryDemo />

::: tip 📊 Que pouvez-vous tirer de ce tableau ?
Parcourons ce tableau ligne par ligne :

**Exemple d'URL** : l'URL en mode Hash contient un `#` visible, l'utilisateur voit immédiatement qu'il s'agit d'une « application monopage » ; l'URL en mode History ressemble à celle d'un site traditionnel, plus « professionnelle ».

**Principe d'implémentation** : le mode Hash écoute l'événement `hashchange` (déclenché lors d'un changement de hash) ; le mode History utilise l'API History HTML5, qui permet de « simuler » une navigation sans rafraîchir la page.

**Configuration serveur** : c'est le piège le plus courant ! En mode Hash, le contenu après `#` n'est pas envoyé au serveur, donc le serveur n'a pas besoin de connaître l'existence des routes ; mais en mode History, le chemin complet est envoyé au serveur, et si le serveur n'est pas correctement configuré, il renverra une erreur 404.

**Convivialité SEO** : les robots des moteurs de recherche n'exécutent généralement pas JavaScript, les URL en mode Hash peuvent être ignorées ; les URL en mode History ont une structure claire et sont plus facilement indexées.

**Difficulté de déploiement** : le mode Hash fonctionne « prêt à l'emploi », le mode History nécessite des connaissances en opérations (Nginx, Apache, etc.). C'est pourquoi de nombreux projets personnels utilisent le mode Hash par défaut.
:::

---

## 3. Chemin d'évolution : des sites traditionnels au routage moderne

Après avoir abordé tous ces concepts, examinons un cas réel : comment un site e-commerce est passé progressivement d'une « multi-page traditionnelle » à un « routage moderne d'application monopage ». Ce cas vous permettra de comprendre plus intuitivement quels problèmes le routage frontend résout.

::: tip 📖 Contexte : que sont MPA, SPA et SSR ?
Avant de commencer le cas, présentons brièvement ces termes :

- **MPA (Multi-Page Application)** : **Application multi-page**, la méthode de développement traditionnelle des sites web. Chaque page est un fichier HTML indépendant, les transitions de page rafraîchissent toute la page.
- **SPA (Single-Page Application)** : **Application monopage**, l'approche dominante du frontend moderne. Une seule entrée HTML, les transitions de page se font par remplacement dynamique des composants via JavaScript, sans rafraîchissement.
- **SSR (Server-Side Rendering)** : **Rendu côté serveur**, génération du HTML complet côté serveur. Combine les avantages de la SPA et de la MPA : premier rendu rapide, bon SEO.

**Pour faire simple** : la MPA, c'est « redessiner à chaque page tournée », la SPA, c'est « effacer et redessiner sur la même feuille », le SSR, c'est « dessiner à l'avance sur la feuille avant de vous la donner ».
:::

### 3.1 Vue d'ensemble de l'évolution

Le tableau suivant montre les quatre phases d'évolution des applications frontend, vous pouvez y voir comment la technologie de routage s'est développée étape par étape :

| Phase | Type d'application | Implémentation du routage | Caractéristique clé | Expérience utilisateur |
|------|---------|---------|---------|---------|
| **Phase 1 : Multi-page traditionnelle** | MPA | Routage côté serveur | Chaque page est un fichier HTML indépendant | Rafraîchissement à chaque navigation |
| **Phase 2 : SPA précoce** | SPA (mode Hash) | Routage Hash | URL avec `#`, bonne compatibilité | Sans rafraîchissement, mais URL peu esthétique |
| **Phase 3 : SPA moderne** | SPA (mode History) | Routage History | URL esthétique, nécessite configuration serveur | Fluide, URL proche des sites traditionnels |
| **Phase 4 : Rendu hybride** | SPA + SSR | Routage isomorphe | Premier rendu côté serveur, routage frontend ensuite | Premier affichage rapide, bon SEO, expérience fluide |

::: tip 📊 Que pouvez-vous tirer de ce tableau ?
Parcourons ce tableau ligne par ligne :

**Phase 1 → Phase 2** : du « avec rafraîchissement » au « sans rafraîchissement », c'est un saut qualitatif. L'utilisateur découvre pour la première fois une fluidité « digne d'une appli », mais au prix d'un `#` dans l'URL, ce qui paraît moins professionnel.

**Phase 2 → Phase 3** : de « fonctionnel » à « agréable ». Le mode History rend l'URL esthétique, plus proche des sites traditionnels, mais au prix d'une complexité de déploiement accrue (configuration serveur nécessaire).

**Phase 3 → Phase 4** : de « bonne expérience » à « bonne expérience + bon SEO ». Le SSR résout le problème de SEO des SPA, et le premier rendu est plus rapide, mais la complexité d'implémentation augmente considérablement.

**En résumé** : l'évolution du routage frontend ne se résume pas à « des transitions plus rapides », c'est **une mise à niveau de toute l'architecture applicative** — du côté serveur dominant au côté frontend dominant, puis à la combinaison des deux, chaque étape équilibrant expérience utilisateur, coût de développement, SEO et d'autres dimensions.
:::

### 3.2 Phase 1 : Application multi-page traditionnelle — rafraîchissement à chaque fois

Pourquoi parle-t-on d'« application multi-page traditionnelle » ? Parce qu'à cette phase, chaque page est un fichier HTML indépendant, et le navigateur retélécharge toutes les ressources (HTML, CSS, JS) à chaque transition. C'est la plus ancienne méthode de développement web, et de nombreux sites traditionnels fonctionnent encore ainsi aujourd'hui.

À cette phase, le site e-commerce « AchetezPlus » utilisait une architecture MPA typique :

**Méthode de développement** :
- **Implémentation du routage** : routage côté serveur, chaque page correspond à un fichier HTML sur le serveur
- **Transition de page** : utilisation de `<a href="/products/123">`, déclenchant un rafraîchissement complet de la page
- **Gestion d'état** : l'état de la page précédente est perdu à chaque navigation (position de défilement, contenu du formulaire, etc.)

**Caractéristiques de cette phase** :
- ✅ **Avantages** : implémentation simple, bon pour le référencement (SEO), avance/retour du navigateur fonctionnel dès le départ
- ❌ **Inconvénients** : rafraîchissement à chaque navigation, expérience utilisateur médiocre, forte pression sur le serveur (rechargement répété des mêmes ressources)

::: details Voir la structure du projet et le flux de navigation de l'époque
**Structure du projet** (structure typique de rendu côté serveur) :
```
server/
├── views/              # Templates HTML
│   ├── index.html      # Template de la page d'accueil
│   ├── products.html   # Template de la liste de produits
│   └── product.html    # Template de la fiche produit
├── public/             # Ressources statiques
│   ├── css/
│   ├── js/
│   └── images/
└── server.js           # Point d'entrée du serveur
```

**Flux de navigation** :
```
1. L'utilisateur clique sur le lien <a href="/products/123">
       ↓
2. Le navigateur envoie une requête GET au serveur
       ↓
3. Le serveur rend product.html, insère les données
       ↓
4. Renvoie la page HTML complète
       ↓
5. Le navigateur parse le HTML, télécharge CSS/JS, affiche la page
       ↓
6. L'utilisateur voit la page (ce processus prend généralement 1 à 3 secondes)
```

**Points de douleur utilisateur** :
- Écran blanc après le clic sur un lien, temps d'attente long
- Retéléchargement des mêmes fichiers CSS/JS à chaque navigation
- L'avance/retour du navigateur recharge la page
- Impossible de conserver un état de page complexe (filtres, position de défilement)
:::

Cette approche de développement reste acceptable pour les petits sites, mais à mesure que le site grandit et que les attentes des utilisateurs augmentent, ces problèmes commencent à affecter sérieusement la rétention et le taux de conversion.

### 3.3 Phase 2 : SPA précoce — l'ère du routage Hash

L'accumulation des problèmes des applications multi-page a atteint un point critique, et l'équipe « AchetezPlus » a décidé d'introduire le routage frontend et de passer à une architecture d'application monopage. C'était un tournant important — du « côté serveur dominant » au « côté frontend dominant ».

Mais cette phase avait aussi un coût : l'URL contenait un `#`, ce qui paraissait peu professionnel, et l'indexation par les moteurs de recherche posait problème.

**Méthode de développement** :
- **Implémentation du routage** : routage Hash, utilisant la partie `#` de l'URL
- **Transition de page** : JavaScript intercepte les clics sur les liens et remplace dynamiquement les composants
- **Gestion d'état** : l'état de la page est conservé côté client, pas besoin de recharger

**Caractéristiques de cette phase** :
- ✅ **Avantages** : transition sans rafraîchissement, expérience utilisateur fluide, pression serveur réduite
- ❌ **Inconvénients** : URL avec `#`, SEO peu favorable, premier chargement plus lent

::: details Voir l'implémentation du routage Hash
**Structure du projet** (structure typique d'une SPA précoce) :
```
project/
├── index.html          # Le seul fichier HTML d'entrée
├── css/
│   └── app.css         # Tous les styles regroupés dans un fichier
├── js/
│   ├── router.js       # Implémentation simple du routage
│   ├── views/          # Composants de page
│   │   ├── Home.js
│   │   ├── ProductList.js
│   │   └── ProductDetail.js
│   └── app.js          # Point d'entrée de l'application
└── server.js           # Serveur de fichiers statiques simple
```

**Code central du routage Hash** :
```javascript
// router.js - Implémentation simplifiée du routage Hash
class HashRouter {
  constructor(routes) {
    this.routes = routes
    this.currentPath = null

    // Écouter les changements de hash
    window.addEventListener('hashchange', () => {
      this.matchRoute()
    })

    // Initialisation
    this.matchRoute()
  }

  matchRoute() {
    // Récupérer le hash actuel (en enlevant le #)
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

// Utilisation
const router = new HashRouter([
  { path: '/', component: Home },
  { path: '/products', component: ProductList },
  { path: '/products/:id', component: ProductDetail }
])

// Navigation
router.navigate('/products/123')
```

**Formes d'URL** :
- Accueil : `https://example.com/#/`
- Liste de produits : `https://example.com/#/products`
- Fiche produit : `https://example.com/#/products/123`

**Améliorations apportées** :
1. **Expérience utilisateur améliorée** : transitions de page sans rafraîchissement, fluides et naturelles
2. **Pression serveur réduite** : HTML/CSS/JS chargés une seule fois, seules les données sont demandées ensuite
3. **Conservation de l'état** : la position de défilement, le contenu des formulaires et d'autres états peuvent être conservés lors des transitions
4. **Compatible hors-ligne** : avec un Service Worker, l'accès hors-ligne est possible

**Nouveaux points de douleur** :
1. **URL peu esthétique** : le `#` donne à l'URL un aspect d'« ancre », peu professionnel
2. **Problème de SEO** : les robots des moteurs de recherche peuvent ignorer le contenu après le hash, rendant les pages non indexables
3. **Premier chargement lent** : tout le JavaScript doit être chargé en une fois, le temps de premier affichage est plus long
:::

### 3.4 Phase 3 : SPA moderne — le routage History devient la norme

Les points de douleur du routage Hash (URL peu esthétique, mauvais SEO) ont tourmenté les développeurs pendant de nombreuses années. Avec la généralisation de HTML5 et l'amélioration de la compatibilité des navigateurs, le routage History est progressivement devenu la norme.

Le routage History utilise l'API History HTML5, ce qui permet d'avoir une URL « normale » (sans `#`), mais au prix d'une configuration côté serveur.

**Méthode de développement** :
- **Implémentation du routage** : routage History, utilisant `pushState` et `replaceState`
- **Bibliothèques de routage** : Vue Router, React Router et d'autres bibliothèques matures
- **Configuration serveur** : nécessite de configurer le serveur pour que toutes les routes retombent sur `index.html`

**Caractéristiques de cette phase** :
- ✅ **Avantages** : URL esthétique, bon pour le SEO, expérience utilisateur fluide
- ❌ **Inconvénients** : le déploiement nécessite une configuration spéciale, le serveur doit coopérer

::: details Implémentation du routage History et configuration de déploiement
**Structure du projet** (structure typique d'une SPA moderne) :
```
project/
├── public/
│   └── index.html          # La seule entrée HTML
├── src/
│   ├── router/
│   │   └── index.js        # Configuration du routage
│   ├── views/              # Composants de page
│   │   ├── Home.vue
│   │   ├── ProductList.vue
│   │   └── ProductDetail.vue
│   ├── App.vue
│   └── main.js
├── package.json
└── vite.config.js          # Configuration de build
```

**Exemple de configuration Vue Router** :
```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),  // Mode History
  routes: [
    { path: '/', component: () => import('@/views/Home.vue') },
    { path: '/products', component: () => import('@/views/ProductList.vue') },
    { path: '/products/:id', component: () => import('@/views/ProductDetail.vue') },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFound.vue') }
  ]
})

export default router
```

**Formes d'URL** :
- Accueil : `https://example.com/`
- Liste de produits : `https://example.com/products`
- Fiche produit : `https://example.com/products/123`

**Clé : configuration Nginx** (à configurer impérativement au déploiement) :
```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/app;
    index index.html;

    # Configuration clé : toutes les routes pointent vers index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Pourquoi cette configuration est-elle nécessaire ?**

```
Scénario : l'utilisateur accède directement à https://example.com/products/123

❌ Sans configuration :
1. Le navigateur demande /products/123 au serveur
2. Nginx cherche /products/123 dans le système de fichiers
3. Ne trouve pas le fichier, renvoie 404

✅ Avec try_files configuré :
1. Le navigateur demande /products/123 au serveur
2. Nginx essaie de trouver le fichier → n'existe pas
3. Retombe sur /index.html (selon la règle try_files)
4. Le navigateur charge index.html
5. Vue Router prend le relais, analyse /products/123
6. Rend le composant ProductDetail
7. La page s'affiche normalement !
```

**Comparaison avec le mode Hash** :
| Élément de comparaison | Mode Hash | Mode History |
|--------|----------|-------------|
| URL | `/#/products/123` | `/products/123` |
| Configuration serveur | Non nécessaire | **Obligatoire** |
| Accès direct | ✅ Fonctionne normalement | ❌ Nécessite le support du serveur |
| SEO | ⚠️ Médiocre | ✅ Bon |
:::

### 3.5 Phase 4 : Rendu hybride — la solution ultime SPA + SSR

Une fois le routage History arrivé à maturité, l'équipe a commencé à s'intéresser à des problèmes plus profonds : comment conserver l'expérience fluide de la SPA tout en résolvant les problèmes de SEO et de premier chargement lent ?

Le cœur de cette phase est le « rendu isomorphe » — le premier écran est rendu côté serveur (bon SEO, chargement rapide), les interactions suivantes sont gérées par le routage frontend (expérience fluide).

**Méthode de développement** :
- **Choix du framework** : Next.js (React), Nuxt.js (Vue)
- **Stratégie de rendu** : rendu côté serveur + hydratation côté client (Hydration)
- **Mode de routage** : mode History (le serveur est déjà configuré)

**Caractéristiques de cette phase** :
- ✅ **Avantages** : premier écran rapide, bon SEO, interactions suivantes fluides
- ❌ **Inconvénients** : haute complexité d'implémentation, nécessite un environnement d'exécution serveur

::: details Fonctionnement du rendu hybride
**Flux de chargement de la page** :
```
1. L'utilisateur accède à /products/123
       ↓
2. Le serveur reçoit la requête
       ↓
3. Le serveur rend le composant ProductDetail → génère le HTML complet
       ↓
4. Renvoie le HTML au navigateur (contenant le contenu complet)
       ↓
5. Le navigateur affiche rapidement le contenu (premier rendu rapide)
       ↓
6. Charge JavaScript, exécute l'« hydratation » (Hydration)
       ↓
7. Les transitions de page suivantes sont gérées par le routage frontend (sans rafraîchissement)
```

**Comparaison du premier écran : SPA traditionnelle vs SSR** :

| Élément | SPA traditionnelle | SSR |
|--------|---------|-----|
| Contenu au premier écran | Écran blanc → chargement JS → rendu | Contenu affiché immédiatement |
| SEO | Le robot peut ne pas voir le contenu | Le robot voit le HTML complet |
| Temps de premier écran | Plus lent (nécessite le chargement JS) | Plus rapide (le HTML contient déjà le contenu) |
| Interactions suivantes | Fluide (routage frontend) | Fluide (routage frontend) |
:::

---

## 4. Principes en profondeur : comment fonctionne le routage

Après avoir vu le cas concret, approfondissons le principe de fonctionnement du routage frontend pour comprendre ce qui différencie vraiment les modes Hash et History.

<RouterArchitectureDemo />

### 4.1 Principe de fonctionnement du mode Hash

Le cœur du mode Hash est d'utiliser la partie `hash` de l'URL (c'est-à-dire le contenu après `#`). Le hash possède deux propriétés importantes :

1. **Les changements de hash ne déclenchent pas de rafraîchissement de la page**
2. **Les changements de hash sont enregistrés dans la pile d'historique du navigateur**

Cela signifie que nous pouvons modifier l'URL sans rafraîchir la page, tout en conservant le fonctionnement normal des boutons avance/retour du navigateur.

**Flux de fonctionnement** :

```
L'utilisateur clique sur le lien <a href="#/user/123">
       ↓
Le navigateur met à jour l'URL (sans rafraîchir la page)
https://example.com/#/user/123
       ↓
Déclenche l'événement hashchange
       ↓
L'écouteur de routage capture l'événement
       ↓
Analyse la valeur du hash → /user/123
       ↓
Correspondance avec la configuration de route → trouve le composant UserDetail
       ↓
Rend le composant dans la page
```

**Implémentation du code central** :

```javascript
class HashRouter {
  constructor(routes) {
    this.routes = routes

    // Écouter les changements de hash
    window.addEventListener('hashchange', () => {
      this.loadRoute()
    })

    // Chargement initial
    this.loadRoute()
  }

  loadRoute() {
    // Récupérer le hash actuel, enlever le # au début
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

::: tip 💡 Avantages du mode Hash
- **Bonne compatibilité** : IE8+ supporté, fonctionne sur presque tous les navigateurs
- **Déploiement simple** : aucune configuration serveur nécessaire, prêt à l'emploi
- **Implémentation simple** : il suffit d'écouter l'événement `hashchange`
:::

### 4.2 Principe de fonctionnement du mode History

Le mode History utilise l'API History HTML5, qui fournit des méthodes comme `pushState` et `replaceState` permettant de modifier l'URL sans rafraîchir la page.

**API principales** :

```javascript
// Ajouter une nouvelle entrée dans l'historique
history.pushState(state, title, url)
// Exemple : history.pushState({id: 123}, 'Détail utilisateur', '/user/123')

// Remplacer l'entrée actuelle de l'historique
history.replaceState(state, title, url)

// Écouter les changements d'historique (boutons avance/retour)
window.addEventListener('popstate', (event) => {
  // event.state contient le state passé à pushState
})
```

**Flux de fonctionnement** :

```
L'utilisateur clique sur le lien <a href="/user/123">
       ↓
JavaScript intercepte l'événement de clic
event.preventDefault()
       ↓
Appelle history.pushState
history.pushState({id: 123}, 'Détail utilisateur', '/user/123')
       ↓
L'URL est mise à jour (sans rafraîchir la page)
https://example.com/user/123
       ↓
Le routage correspond et rend le composant
       ↓
L'utilisateur clique sur le bouton retour du navigateur
       ↓
Déclenche l'événement popstate
       ↓
L'écouteur de routage capture l'événement
       ↓
Rend le composant correspondant à la nouvelle URL
```

**Implémentation du code central** :

```javascript
class HistoryRouter {
  constructor(routes) {
    this.routes = routes

    // Intercepter tous les clics sur les liens
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a')
      if (link && link.getAttribute('href').startsWith('/')) {
        e.preventDefault()
        this.push(link.getAttribute('href'))
      }
    })

    // Écouter l'avance/retour du navigateur
    window.addEventListener('popstate', () => {
      this.loadRoute()
    })

    // Chargement initial
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

::: warning ⚠️ Piège du mode History
Le plus gros problème du mode History est le suivant : **lorsque l'utilisateur accède directement à une URL ou rafraîchit la page, le navigateur envoie une requête au serveur**.

Si le serveur n'est pas correctement configuré, il renverra une erreur 404. La solution est de configurer le serveur pour que toutes les routes retombent sur `index.html`, laissant le routage frontend prendre le relais.
:::

---

## 5. Guide pratique de configuration du routage

Assez de théorie, voici les modèles de configuration de routage couramment utilisés dans les projets réels et les meilleures pratiques.

### 5.1 Configuration de route de base

::: details Exemple complet de configuration Vue Router

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
      props: true  // Passer les paramètres de route en tant que props
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // Comportement de défilement : conserver la position au retour, sinon défiler en haut
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

### 5.2 Lazy loading des routes : améliorer les performances du premier écran

Le lazy loading des routes consiste à ne charger le composant correspondant qu'au moment où l'utilisateur accède à cette route, plutôt que de charger tous les composants en une seule fois. Cela réduit significativement le temps de chargement du premier écran.

```javascript
// ❌ Chargement unique de tous les composants (premier écran lent)
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import User from '@/views/User.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/user', component: User }
]

// ✅ Lazy loading (premier écran rapide)
const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  { path: '/about', component: () => import('@/views/About.vue') },
  { path: '/user', component: () => import('@/views/User.vue') }
]
```

<CodeSplittingDemo />

::: tip 💡 Principe du lazy loading
Lorsque vous utilisez `import('@/views/Home.vue')`, Webpack/Vite regroupe ce composant dans un fichier séparé. Ce fichier n'est téléchargé que lorsque l'utilisateur accède à cette route.

Pour faire une analogie : le lazy loading, c'est comme « commander les plats à la demande », plutôt que d'apporter tous les plats d'un coup. Cela réduit le temps de chargement du premier écran et améliore l'expérience utilisateur.
:::

### 5.3 Gardes de route : contrôle d'accès et interception de navigation

Les gardes de route permettent d'exécuter du code avant et après une transition de route, souvent utilisées pour la vérification d'authentification, la définition du titre de page, le préchargement de données, etc.

```javascript
// Garde globale avant chaque route
router.beforeEach(async (to, from, next) => {
  // Définir le titre de la page
  document.title = to.meta.title || 'My App'

  // Vérification d'authentification
  if (to.meta.requiresAuth) {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      next('/login')
      return
    }
  }

  next()
})

// Hook global après chaque route
router.afterEach((to, from) => {
  // Statistiques de visites
  analytics.trackPageView(to.path)
})

// Garde au niveau de la route
const routes = [
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true, roles: ['admin'] },
    beforeEnter: (to, from, next) => {
      // Logique spécifique à cette route
      if (hasPermission()) {
        next()
      } else {
        next('/403')
      }
    }
  }
]
```

::: tip 💡 Usages courants des gardes de route
- **Vérification d'authentification** : vérifier si l'utilisateur a le droit d'accéder à une page
- **Titre de page** : définir dynamiquement document.title
- **Préchargement de données** : récupérer les données avant d'entrer dans la page
- **Barre de progression** : afficher une barre de progression pendant la transition
- **Statistiques de visites** : enregistrer les pages consultées
:::

---

## 6. Problèmes courants et solutions

### 6.1 Erreur 404 après déploiement lors du rafraîchissement

**Problème** : le développement local fonctionne normalement, mais après le déploiement sur le serveur, l'accès direct à une route ou le rafraîchissement de la page affiche une erreur 404.

**Cause** : en mode History, le serveur traite l'URL comme un chemin de fichier à rechercher, mais toutes les routes de la SPA pointent en réalité vers `index.html`.

**Solution** : configurer le fallback du serveur.

```nginx
# Configuration Nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

```apache
# Configuration Apache (.htaccess)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 6.2 Perte des paramètres de route

**Problème** : après un rafraîchissement de la page, les paramètres de route `$route.params` sont perdus.

**Cause** : les paramètres de route n'existent qu'au moment de la transition de route, ils doivent être ré-analysés depuis l'URL après un rafraîchissement.

**Solution** :

```javascript
// ❌ Mauvaise pratique : récupérer les paramètres seulement dans created
created() {
  const userId = this.$route.params.id
  this.fetchUser(userId)
}

// ✅ Bonne pratique : surveiller les changements de route
watch: {
  '$route.params.id': {
    immediate: true,
    handler(newId) {
      this.fetchUser(newId)
    }
  }
}
```

### 6.3 Position de défilement anormale lors des transitions de page

**Problème** : après une transition de page, la position de défilement n'est pas réinitialisée, ou la position précédente n'est pas conservée lors du retour.

**Solution** : configurer `scrollBehavior` du routeur.

```javascript
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // Conserver la position de défilement au retour
    if (savedPosition) {
      return savedPosition
    }
    // Naviguer vers l'ancre
    if (to.hash) {
      return { el: to.hash }
    }
    // Sinon, défiler en haut
    return { top: 0 }
  }
})
```

---

## 7. Résumé

Récapitulons les concepts fondamentaux du routage frontend avec un tableau :

| Concept | En une phrase | Problème résolu | Solution représentative |
|------|-----------|-----------|----------|
| **Route** | Mapping entre URL et composants | Afficher différents contenus selon l'URL | Vue Router, React Router |
| **Mode Hash** | Utilise le hash de l'URL pour le routage | Bonne compatibilité, déploiement simple | Mode Hash de Vue Router |
| **Mode History** | Utilise l'API History pour le routage | URL esthétique, bon SEO | Mode History de Vue Router |
| **Lazy loading** | Chargement des composants à la demande | Réduire le temps de chargement initial | `() => import('./Page.vue')` |
| **Gardes de route** | Hooks avant/après les transitions de route | Contrôle d'accès, préchargement de données | `beforeEach`, `beforeEnter` |
| **Route dynamique** | Route avec paramètres | Correspondre à une catégorie de chemins | `/user/:id` |

::: info En conclusion
Le routage frontend est l'une des technologies centrales des applications monopages modernes. Du mode Hash des débuts au mode History devenu la norme, la technologie de routage évolue constamment pour offrir aux utilisateurs une expérience de navigation toujours plus fluide.

Comprendre les principes et les modes du routage vous permet de localiser rapidement et de résoudre précisément les problèmes de déploiement, de performance et de SEO. Plus important encore, cela vous aide à faire des choix plus éclairés lors de la conception architecturale d'un projet — quand utiliser le mode Hash, quand utiliser le mode History, et comment éviter les pièges courants.

Nous espérons que cet article vous a aidé à construire une compréhension globale du routage frontend. Lorsque vous rencontrerez des problèmes liés au routage dans vos projets réels, vous saurez par où commencer, comment localiser le problème et comment le résoudre.
:::