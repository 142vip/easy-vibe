# Introduction : Écosystème des frameworks frontend

::: tip Préface
Vous avez appris les bases du HTML, CSS et JavaScript, et vous pouvez créer des pages web simples. Mais à mesure que les fonctionnalités se complexifient, vous remarquerez peut-être que le code en JavaScript vanilla devient difficile à maintenir : une modification nécessite des changements à de nombreux endroits, et les conflits sont fréquents lors du travail en équipe.

C'est pourquoi nous avons besoin de frameworks frontend — ils rendent le code mieux organisé, plus facile à maintenir et plus efficace à développer. En vibecoding, l'IA écrira la majeure partie du code pour vous. Mais vous devez au moins être capable de reconnaître les styles de code des différents frameworks et de connaître leurs avantages et inconvénients, afin que l'IA puisse vous aider à choisir la stack technique la plus adaptée.

Après avoir lu ce guide, vous serez capable de :
- Comprendre pourquoi les technologies frontend évoluent constamment
- Connaître les caractéristiques de Vue, React, Svelte et Angular
- Maîtriser les concepts clés comme le « data-driven » et la « composantisation »
- Choisir le framework adapté à votre projet
:::

**Que va vous apprendre cet article ?**

| Chapitre | Contenu | Ce que vous saurez faire |
|----------|---------|--------------------------|
| **Chapitre 1** | Pourquoi s'intéresser à l'évolution du frontend | Comprendre quels problèmes chaque évolution technologique résout |
| **Chapitre 2** | L'ère des pages web statiques | Découvrir les premières méthodes de développement web |
| **Chapitre 3** | L'ère jQuery | Comprendre les limites de la programmation « impérative » |
| **Chapitre 4** | L'ère Vue/React | Maîtriser la pensée « déclarative » et « data-driven » |
| **Chapitre 5** | Stratégies de rendu | Connaître les différences entre CSR, SSR et SSG et leurs cas d'usage |
| **Chapitre 6** | Outils d'ingénierie | Comprendre le rôle des outils de build comme Webpack et Vite |

Chaque chapitre commence par « pourquoi cette technologie est nécessaire », vous permettant de comprendre la logique derrière l'évolution technologique.

---

## 1. Motivation et justification : s'intéresser à l'histoire de l'évolution du frontend

::: tip 🤔 Question centrale
**Pourquoi les pages web deviennent-elles de plus en plus complexes ? Pourquoi les technologies frontend évoluent-elles constamment ?** Cette question vous guidera à travers le parcours d'évolution technique, des pages web simples aux applications web modernes.
:::

### 1.1 De l'« affiche électronique » à l'« application de bureau »

Imaginez une **affiche** que vous voyez dans la rue :

- ✅ Elle a du contenu (texte, images)
- ✅ Elle a un design (couleurs, mise en page)
- ❌ Mais si vous lui parlez, elle ne répond pas
- ❌ Si vous cliquez quelque part, rien ne se passe

**Les premières pages web** étaient comme ces « affiches électroniques » : visibles uniquement, non modifiables, au contenu fixe.

**Les pages web modernes** sont totalement différentes. Elles ressemblent à des **applications de bureau** (VS Code, Figma) :

- ✅ On peut éditer des documents, dessiner, jouer à des jeux
- ✅ Elles répondent en temps réel à chaque action
- ✅ Elles peuvent même fonctionner hors ligne

**La raison principale de cette transformation : les pages web ont des fonctionnalités de plus en plus complexes, nécessitant des technologies et des méthodes de développement plus efficaces.**

### 1.2 Une analogie du quotidien : construire une maison

L'évolution des technologies frontend, c'est comme l'évolution des méthodes de construction :

| Époque | 🏠 Analogie de construction | Caractéristiques réelles | Avantages/Inconvénients |
|--------|----------------------------|--------------------------|-------------------------|
| **Années 2000** | **Coller des affiches** | Pages statiques, il suffit d'écrire du HTML | ✅ Simple ❌ Pas d'interaction |
| **Années 2010** | **Faire appel à des ouvriers** | Ère jQuery, manipulation manuelle de chaque élément | ✅ Interactif ❌ Code désordonné, difficile à maintenir |
| **Années 2020** | **Construire avec des LEGO** | Ère Vue/React, développement par composants | ✅ Efficace, maintenable ❌ Courbe d'apprentissage |

::: tip 💡 Que pouvez-vous observer dans ce tableau ?

**Phase 1 → Phase 2** : de « statique » à « interactif ». C'est un saut qualitatif — les pages web commencent à avoir des interactions, mais au prix d'un code qui devient chaotique.

**Phase 2 → Phase 3** : de « fonctionnel » à « bien conçu ». La composantisation rend le code réutilisable comme des briques, améliorant considérablement l'efficacité de développement.

**Idée centrale** : l'évolution technologique n'est pas « du nouveau pour le nouveau », mais résout les points douloureux de la phase précédente.
:::

---

---

## 2. Première phase : pages web statiques et « découpage » (années 2000)

::: tip 🤔 Question centrale
**À quoi ressemblaient les premières pages web ? Pourquoi n'avait-on pas besoin de frameworks à l'époque ?** Comprendre les limites de cette phase est essentiel pour saisir la nécessité de l'évolution technologique ultérieure.
:::

<FrontendEvolutionDemo />

### 2.1 À quoi ressemblait cette époque

**Méthode de développement** :

- Écrire quelques fichiers HTML
- Intégrer du CSS et du JavaScript
- Faire glisser les fichiers directement dans le navigateur pour voir le résultat
- Téléverser le dossier sur le serveur pour déployer

**Caractéristiques** :

- ✅ **Avantages** : simple et direct, pas de courbe d'apprentissage, on écrit et ça fonctionne
- ❌ **Inconvénients** : impossible d'implémenter des interactions complexes, le code devient vite désordonné

::: details Voir la structure de projet de l'époque

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

**Problèmes rencontrés** :

1. **Pollution des variables globales** : toutes les variables sont dans l'espace de noms global, risquant de s'écraser mutuellement
2. **Gestion chaotique des dépendances** : les fichiers JS doivent être chargés dans le bon ordre, sinon des erreurs surviennent
3. **Code difficile à réutiliser** : pour réutiliser une fonctionnalité, il faut copier-coller
:::

### 2.2 Qu'est-ce que le « découpage »

Vous avez peut-être entendu parler du terme « découpage ». C'était le travail principal du frontend à ses débuts :

**Qu'est-ce que le découpage ?**

Le designer crée la page dans Photoshop → le développeur frontend découpe le design en petites images → il assemble les images en page avec HTML

**Pourquoi est-ce si lent ?**

Chaque petite image sur la page web nécessite une **requête réseau** du navigateur. Plus il y a de requêtes, plus le chargement est lent.

👇 **Essayez vous-même** : observez l'impact des requêtes d'images sur les performances de chargement

<SliceRequestDemo />

::: tip 💡 Sprite CSS

Pour réduire le nombre de requêtes, la technique du « sprite CSS » est apparue : fusionner plusieurs petites images en une seule grande image.

L'avantage est la réduction du nombre de requêtes, l'inconvénient est que la création et la maintenance sont fastidieuses.

La leçon de cette phase : **trop de requêtes est l'ennemi de la performance**.
:::

---

---

## 3. Deuxième phase : l'ère jQuery - « travail manuel » (années 2010)

::: tip 🤔 Question centrale
**Pourquoi avait-on besoin de jQuery ? Quels problèmes a-t-il résolus et quels nouveaux problèmes a-t-il apportés ?** Comprendre les limites de jQuery est essentiel pour saisir la valeur de Vue/React.
:::

### 3.1 Pourquoi avait-on besoin de jQuery

À mesure que les pages web devenaient plus complexes, les problèmes du JavaScript vanilla sont apparus :

- ❌ **API verbeuse** : même des opérations simples nécessitent beaucoup de code
- ❌ **Compatibilité navigateur** : les API diffèrent selon les navigateurs, nécessitant beaucoup de code de compatibilité
- ❌ **Sélecteurs faibles** : trouver des éléments est fastidieux

**jQuery** est né. Il a rendu JavaScript plus simple :

```javascript
// JavaScript vanilla (verbeux)
const element = document.getElementById('title')

// jQuery (concis)
const element = $('#title')
```

### 3.2 La logique de jQuery : modifier la page manuellement

La logique centrale de jQuery est **impérative** : vous dites au navigateur « comment faire ».

```javascript
// Trouver l'élément titre
$('#title').text('Nouveau titre')

// Trouver le bouton et le désactiver
$('#submit-btn').attr('disabled', true)

// Trouver la liste et ajouter un élément
$('ul').append('<li>Nouvel élément</li>')
```

**Problème** : vous devez vous souvenir de tous les éléments de la page, et à chaque changement de données, mettre à jour manuellement tous les éléments concernés.

👇 **Essayez vous-même** : comparez jQuery et l'approche data-driven

<JQueryVsStateDemo />

::: warning ⚠️ Les points douloureux de jQuery

Imaginez que vous créez un panier d'achat :

```javascript
// L'utilisateur clique sur « Ajouter au panier »
function addToCart() {
  cartCount++ // Les données changent

  // Vous devez mettre à jour manuellement tous les endroits concernés
  $('#cart-count').text(cartCount) // Le badge en haut à droite
  $('#cart-page-count').text(cartCount) // La page du panier
  $('#checkout-price').text(calculatePrice()) // Le bouton de paiement

  // Si vous oubliez un endroit, la page devient incohérente !
}
```

**C'est le prix du « travail manuel »** : sujet aux erreurs, difficile à maintenir.
:::

### 3.3 L'essor du mobile : l'apparition du design responsive

Un autre changement important de cette époque : **les smartphones et tablettes deviennent populaires**.

Les pages web doivent s'adapter à différents écrans. Cela nécessite le **responsive design** : un même ensemble HTML/CSS qui adapte automatiquement sa mise en page selon la largeur de l'écran.

**Le cœur du responsive design : les Media Queries**

```css
/* Écran d'ordinateur (plus de 640px) */
@media (min-width: 640px) {
  .container {
    display: flex;
  }
}

/* Écran de téléphone (moins de 640px) */
@media (max-width: 640px) {
  .container {
    display: block;
  }
}
```

👇 **Essayez vous-même** : ajustez la largeur du navigateur et observez l'effet du responsive design

<ResponsiveGridDemo />

::: tip 💡 Le responsive, c'est comme un « cadre photo intelligent »

Imaginez que vous regardez la même photo dans différentes pièces :

- Dans un **grand salon** (écran d'ordinateur), la photo peut être plus grande, avec d'autres éléments décoratifs à côté
- Dans une **petite chambre** (écran de téléphone), la photo doit être réduite et les autres décorations rangées

**Le responsive design** est ce « cadre photo intelligent » qui ajuste automatiquement l'affichage selon la taille de la pièce.
:::

---

---

## 4. Troisième phase : du « travail manuel » au « data-driven » (Vue/React)

::: tip 🤔 Question centrale
**Pourquoi a-t-on besoin de Vue/React ? Quelle est la différence fondamentale avec jQuery ?** Comprendre le « déclaratif » et le « data-driven » est la clé pour maîtriser les frameworks frontend modernes.
:::

### 4.1 Pourquoi a-t-on besoin de nouveaux frameworks

Les problèmes de l'ère jQuery se sont accumulés :

- **Le code devient vite désordonné** : des opérations DOM partout, difficile à maintenir
- **Sujet aux bugs** : un oubli de mise à jour et la page devient incohérente
- **Collaboration difficile** : plusieurs personnes modifient le même fichier, conflits fréquents

**L'idée centrale de Vue / React** : **modifiez uniquement les données, la page se met à jour automatiquement**.

### 4.2 La logique de Vue/React : UI déclarative

**jQuery (impératif)** :

```javascript
// Vous devez dire au navigateur chaque étape à suivre
$('#title').text('Nouveau titre')
$('#title').css('color', 'red')
$('#title').show()
```

**Vue (déclaratif)** :

```javascript
// Vous dites simplement au navigateur « ce qu'il faut afficher »
data() {
  return {
    title: "Nouveau titre",
    color: "red",
    visible: true
  }
}
```

👇 **Essayez vous-même** : comparez la différence entre impératif et déclaratif

<ImperativeVsDeclarativeDemo />

::: tip 💡 Impératif vs Déclaratif

C'est comme peindre un tableau :

- **Impératif** : vous dites au peintre « prends le pinceau, trempe-le dans la peinture rouge, trace un cercle aux coordonnées (10,10) »
- **Déclaratif** : vous donnez directement une photo au peintre, « peins-moi ça »

Vue/React sont « déclaratifs » : vous décrivez « à quoi la page ressemble », le framework s'occupe de « comment la dessiner ».
:::

### 4.3 Composantisation : écrire des pages comme on assemble des LEGO

La fonctionnalité la plus puissante de **Vue / React** est la **composantisation** : décomposer la page en « briques » indépendantes.

Imaginez que vous assemblez des LEGO :

- Vous n'avez pas besoin de « sculpter chaque brique à partir de zéro » (écrire HTML/CSS from scratch)
- Vous avez juste besoin de « suivre les instructions pour assembler les briques » (combiner les composants)
- Chaque brique est **indépendante**, vous pouvez la **réutiliser** dans différents ensembles

**Avantages des composants** :

- **Réutilisation** : écrivez un composant « fiche produit », utilisez-le 100 fois
- **Encapsulation** : l'état interne d'un composant n'affecte pas les autres
- **Maintenance** : modifiez un composant, tous les endroits qui l'utilisent sont mis à jour

::: info 💡 Astuces de reconnaissance
- Vous voyez `<ComponentName />` → c'est un composant
- Vous voyez `import xxx from './xxx.vue'` → importation d'un composant
- Vous voyez `props: {...}` → paramètres reçus par le composant
- Vous voyez `emit('xxx')` → le composant envoie un événement au parent
:::

### 4.4 SPA : la naissance des applications monopages

L'ère **Vue / React** apporte un autre changement majeur : **de MPA à SPA**.

**MPA (Multi-Page Application)** :

- Cliquer sur un lien → rechargement complet de la page → affichage de la nouvelle page
- Comme **feuilleter un livre** : à chaque page tournée, il faut fermer l'ancien livre, aller chercher le nouveau dans la bibliothèque

**SPA (Single-Page Application)** :

- Cliquer sur un lien → seule la zone de contenu est rafraîchie → la page ne se recharge pas
- Comme **changer de chapitre dans le même livre** : on efface seulement l'ancien contenu, on écrit le nouveau

👇 **Essayez vous-même** : découvrez la différence entre MPA et SPA

<RoutingModeDemo />

**Avantages de la SPA** :

- ✅ **Expérience fluide** : changement de page rapide
- ✅ **État facile à gérer** : le contenu saisi, la position de défilement sont conservés
- ❌ **Premier chargement potentiellement lent** : JavaScript doit d'abord être téléchargé
- ❌ **SEO nécessite un traitement supplémentaire** : les moteurs de recherche peuvent ne pas indexer le contenu (nécessite SSR/SSG)

---

---

## 5. Stratégies de rendu : de CSR à SSR/SSG

::: tip 🤔 Question centrale
**La page est-elle générée sur le serveur ou dans le navigateur ?** Chaque stratégie de rendu a ses avantages et inconvénients. Choisir la bonne stratégie est crucial pour les performances et le SEO.
:::

**CSR (Client-Side Rendering) Rendu côté client** :

- Le navigateur télécharge JavaScript → exécute le code → génère la page
- Avantages : interactions fluides, faible pression sur le serveur
- Inconvénients : premier chargement lent, mauvais pour le SEO

**SSR (Server-Side Rendering) Rendu côté serveur** :

- Le serveur génère le HTML → l'envoie au navigateur → le navigateur l'affiche directement
- Avantages : premier chargement rapide, bon pour le SEO
- Inconvénients : forte pression sur le serveur, implémentation complexe

**SSG (Static Site Generation) Génération de site statique** :

- Génère le HTML de toutes les pages au moment du build
- Avantages : extrêmement rapide, entièrement statique, compatible CDN
- Inconvénients : ne convient pas au contenu dynamique

👇 **Essayez vous-même** : comparez les caractéristiques des différentes stratégies de rendu

<RenderingStrategyDemo />

::: info 💡 Comment choisir ?
- **Sites de contenu** (blog, documentation) : privilégiez SSG
- **Sites dynamiques nécessitant du SEO** (e-commerce, actualités) : utilisez SSR
- **Systèmes d'administration** : utilisez CSR
- **Besoins mixtes** : envisagez le rendu hybride de Nuxt/Next.js
:::

---

## 6. Quatrième phase : ingénierie et outils de build (2015-2020)

::: tip 🤔 Question centrale
**Pourquoi le frontend a-t-il besoin d'« ingénierie » ? Que font exactement les outils de build ?** Comprendre l'ingénierie est essentiel pour saisir le flux de travail des projets frontend modernes.
:::

### 6.1 Pourquoi a-t-on besoin d'« ingénierie »

Les projets frontend deviennent de plus en plus volumineux, on ne peut plus se contenter d'« inclure manuellement des scripts ».

**L'ingénierie**, c'est utiliser des outils et des normes pour rendre le développement plus efficace, le code plus fiable et la collaboration plus fluide.

::: tip 💡 Ingénierie = de l'« atelier artisanal » à l'« usine moderne »

Imaginez cuisiner chez vous vs gérer un restaurant :

- **Cuisiner chez vous** : vous cuisinez ce que vous voulez, très libre
- **Gérer un restaurant** : il faut des recettes standardisées, des procédures opérationnelles normalisées, un approvisionnement unifié

Le développement frontend est pareil :

- **Petit projet** : écrivez comme vous voulez
- **Grand projet** : il faut des normes de code unifiées, des outils d'automatisation, des processus standardisés
:::

### 6.2 Outils de build : Webpack → Vite

**Webpack** (traditionnel) :

- Mode de fonctionnement : **d'abord bundler, puis servir**
- Au démarrage : bundle tout le code → démarre le serveur
- Problème : **lent**. Plus le projet est grand, plus le démarrage est lent (peut atteindre 30 secondes)

**Vite** (moderne) :

- Mode de fonctionnement : **compilation à la demande**
- Au démarrage : pas de bundling, démarre le serveur directement
- Le navigateur demande un fichier, Vite le compile en temps réel
- Avantage : **rapide**. Démarre généralement en moins d'une seconde

| Comparaison | Webpack | Vite | Amélioration |
|-------------|---------|------|--------------|
| Démarrage à froid | 30s+ | <1s | **30x plus rapide** |
| Hot reload | 3-5s | <100ms | **30x plus rapide** |
| Fichier de configuration | Centaines de lignes | Dizaines de lignes | **Bien plus simple** |

::: tip 💡 Pourquoi Vite est-il si rapide ?

**Webpack**, c'est comme **déménager avec toutes ses affaires** : on emballe tout d'abord, puis on part.

**Vite**, c'est comme **voyager léger** : on n'emporte que l'essentiel, on achète ce dont on a besoin en cours de route.

En environnement de développement, la plupart du temps vous ne modifiez que quelques fichiers. Vite ne compile que ces fichiers, donc c'est évidemment rapide.
:::

---

---

## 7. Comparaison des principaux frameworks

::: tip 🤔 Question centrale
**Quelles sont les caractéristiques de Vue, React, Svelte et Angular ? Comment choisir le framework adapté ?** Comprendre leurs philosophies de conception et leurs cas d'usage est essentiel pour faire un choix éclairé.
:::

### 7.1 Comparaison des quatre principaux frameworks

| Caractéristique | Vue | React | Svelte | Angular |
|-----------------|-----|-------|--------|---------|
| **Philosophie** | Framework progressif | Bibliothèque UI | Framework compilé | Plateforme complète |
| **Courbe d'apprentissage** | ⭐⭐ Facile | ⭐⭐⭐ Moyen | ⭐⭐ Facile | ⭐⭐⭐⭐ Raide |
| **Performance** | Rapide | Rapide | **Très rapide** | Rapide |
| **Écosystème** | Complet | **Le plus complet** | En croissance | Complet |
| **Taille du bundle** | Petit | Moyen | **Le plus petit** | Grand |
| **Cas d'usage** | Projets petits/moyens | Grands projets | Exigences de performance élevées | Applications d'entreprise |
| **Support** | Evan You (indépendant) | Meta | Communauté | Google |

### 7.2 Vue : framework progressif

**Philosophie** : adoption progressive, on peut utiliser seulement une partie ou toute la suite

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

**Avantages** :
- ✅ Courbe d'apprentissage douce, documentation en chinois complète
- ✅ Syntaxe de template intuitive, facile à comprendre
- ✅ Composants monofichiers (.vue) à la structure claire
- ✅ Adapté au développement rapide

**Inconvénients** :
- ❌ La gestion d'état dans les grands projets nécessite d'apprendre Vuex/Pinia en plus
- ❌ Flexibilité légèrement inférieure à React

**Cas d'usage** :
- Applications web de petite et moyenne taille
- Prototypage rapide
- Équipes sinophones (documentation en chinois)

### 7.3 React : bibliothèque UI

**Philosophie** : ne gère que la couche vue, le reste est délégué à la communauté

```jsx
function App() {
  const [message, setMessage] = useState('Hello React')
  return <div>{message}</div>
}
```

**Avantages** :
- ✅ Écosystème le plus complet, bibliothèques de composants riches
- ✅ Syntaxe JSX flexible, grande expressivité
- ✅ Performance du DOM virtuel excellente
- ✅ Adapté aux grands projets

**Inconvénients** :
- ❌ Courbe d'apprentissage plus raide, concepts supplémentaires à maîtriser
- ❌ Il faut choisir et assembler soi-même les différentes bibliothèques
- ❌ JSX nécessite une compilation, ne peut pas s'exécuter directement dans le navigateur

**Cas d'usage** :
- Applications complexes de grande envergure
- Projets nécessitant un écosystème riche
- Développement multiplateforme (React Native)

### 7.4 Svelte : framework compilé

**Philosophie** : pas de DOM virtuel, le compilateur transforme les composants en code natif efficace

```svelte
<script>
  let message = 'Hello Svelte'
</script>

<div>{message}</div>
```

**Avantages** :
- ✅ **Performance optimale** (pas de surcoût d'exécution du DOM virtuel)
- ✅ Taille de bundle la plus petite
- ✅ Syntaxe simple et intuitive
- ✅ Système réactif natif

**Inconvénients** :
- ❌ Écosystème relativement petit
- ❌ Taille de la communauté inférieure à Vue/React
- ❌ Moins de bibliothèques tierces

**Cas d'usage** :
- Applications nécessitant des performances très élevées
- Projets sensibles à la taille du bundle
- Équipes prêtes à essayer de nouvelles technologies

### 7.5 Angular : plateforme complète

**Philosophie** : fournit une solution complète, prête à l'emploi

```typescript
@Component({
  selector: 'app-root',
  template: '<div>{{ message }}</div>'
})
export class AppComponent {
  message = 'Hello Angular'
}
```

**Avantages** :
- ✅ Fonctionnalités complètes : routing, HTTP, formulaires, tout est inclus
- ✅ Support natif de TypeScript
- ✅ Adapté aux grandes équipes et aux grands projets
- ✅ Normes de code unifiées

**Inconvénients** :
- ❌ Courbe d'apprentissage raide
- ❌ Nombreux concepts, complexité élevée
- ❌ Taille de bundle importante
- ❌ Ne convient pas aux petits projets

**Cas d'usage** :
- Applications d'entreprise à grande échelle
- Équipes nécessitant des normes strictes
- Projets avec une stack TypeScript existante

---

## 8. Résumé : l'essence de l'évolution

L'évolution des technologies frontend résout essentiellement deux problèmes :

### 8.1 Efficacité : du manuel à l'automatique

| Époque | Méthode de développement | Efficacité |
|--------|--------------------------|------------|
| **Années 2000** | HTML/CSS/JS écrits à la main | ⭐ |
| **Années 2010** | jQuery + manipulation manuelle du DOM | ⭐⭐ |
| **Années 2020** | Vue/React + data-driven | ⭐⭐⭐ |
| **Aujourd'hui** | Composants + ingénierie + automatisation | ⭐⭐⭐⭐⭐ |

### 8.2 Échelle : de l'individu à l'équipe

| Époque | Taille du projet | Mode de collaboration |
|--------|------------------|----------------------|
| **Années 2000** | Quelques fichiers | Une seule personne peut maintenir |
| **Années 2010** | Dizaines de fichiers | Petite équipe, conflits fréquents |
| **Années 2020** | Centaines de fichiers | Équipe moyenne, normes nécessaires |
| **Aujourd'hui** | Milliers de fichiers | Grande équipe, système d'ingénierie complet nécessaire |

---

---

## 9. Feuille de route d'apprentissage

### 9.1 Si vous partez de zéro

**Étape 1 : bases HTML/CSS/JavaScript**

- Comprendre les trois piliers du web
- Savoir créer des pages statiques simples

**Étape 2 : apprendre un framework (Vue recommandé)**

- Comprendre la pensée « data-driven »
- Maîtriser le développement par composants

**Étape 3 : projet pratique**

- Créer une application monopage complète
- Se familiariser avec le routing, la gestion d'état, les appels API

### 9.2 Si vous avez déjà des bases

**Directions d'approfondissement** :

- **Ingénierie** : apprendre Vite/Webpack, comprendre le processus de build
- **Optimisation des performances** : apprendre le lazy loading, le code splitting, les stratégies de cache
- **TypeScript** : ajouter des types au code, améliorer la fiabilité
- **Rendu côté serveur** : apprendre Nuxt/Next.js, résoudre les problèmes de SEO et de premier chargement

---

## 10. Ce que vous devriez maintenant savoir reconnaître

En lisant ce chapitre, vous devriez être capable de :

- ✅ Comprendre la logique et les raisons de l'évolution des technologies frontend
- ✅ Distinguer les caractéristiques de Vue, React, Svelte et Angular
- ✅ Comprendre la différence entre « impératif » et « déclaratif »
- ✅ Maîtriser l'idée centrale du « data-driven »
- ✅ Connaître la valeur du développement par composants
- ✅ Comprendre les cas d'usage de CSR, SSR et SSG
- ✅ Comprendre le rôle des outils de build (Webpack, Vite)
- ✅ Savoir choisir le framework et la stack technique adaptés à votre projet

::: info 💡 Application pratique
Quand vous utilisez l'IA pour vos projets, vous pouvez lui dire :

- « C'est un site de blog qui a besoin de SEO, utilise Nuxt (le framework SSR de Vue) »
- « C'est un système d'administration, utilise Vue + Element Plus, pas besoin de SSR »
- « C'est une application web avec des exigences de performance élevées, envisage Svelte »
- « Le projet utilise déjà React, continuons avec les bibliothèques de l'écosystème React »
:::

---

## Table de référence rapide

| Terme | Anglais | Explication simple |
|-------|---------|-------------------|
| **DOM** | Document Object Model | Document Object Model. Représente la page sous forme d'arbre d'objets, manipulable par JS. |
| **jQuery** | - | Bibliothèque JS populaire des débuts, simplifiait la manipulation du DOM. |
| **Vue/React** | - | Frameworks frontend modernes, basés sur le data-driven et le développement par composants. |
| **Composant** | Component | Unité UI réutilisable, comme un bouton, une carte, une barre de navigation. |
| **MPA** | Multi-Page Application | Application multipage. Chaque navigation recharge toute la page. |
| **SPA** | Single-Page Application | Application monopage. Chargée une seule fois, les navigations suivantes ne rafraîchissent pas la page. |
| **Routing** | Routing | Gère les règles et le processus de transition entre les pages. |
| **SSR** | Server-Side Rendering | Rendu côté serveur. Le serveur génère le HTML puis l'envoie au navigateur. |
| **SSG** | Static Site Generation | Génération de site statique. Les pages sont pré-rendues en HTML statique au moment du build. |
| **CSR** | Client-Side Rendering | Rendu côté client. Le navigateur génère la page via JavaScript. |
| **Webpack** | - | Outil de bundling traditionnel, bundle d'abord, sert ensuite. |
| **Vite** | - | Outil de build moderne, compilation à la demande, extrêmement rapide. |
| **Responsive** | Responsive Design | Design qui adapte automatiquement la page aux différentes tailles d'écran. |
| **Media Query** | Media Query | Condition CSS qui applique différents styles selon la largeur de l'écran. |
| **Impératif** | Imperative | Dire au programme « comment faire ». |
| **Déclaratif** | Declarative | Dire au programme « ce qu'on veut ». |
| **Data-driven** | Data-Driven | Modifier uniquement les données, l'interface se met à jour automatiquement. |
| **Tree Shaking** | - | Élimination du code mort. Supprime automatiquement le code inutilisé, réduit la taille du bundle. |
| **Code Splitting** | Code Splitting | Diviser le code en plusieurs petits morceaux, chargés à la demande. |