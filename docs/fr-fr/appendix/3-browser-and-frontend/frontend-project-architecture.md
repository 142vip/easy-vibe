# Principes : Architecture de projet frontend

::: tip 🎯 Question principale
**Des simples pages HTML aux applications d'entreprise complexes, comment choisir l'architecture adaptee a la taille de votre projet ?** C'est comme demander : d'un studio a un grand centre commercial, comment concevoir differents agencements selon les besoins ? Une bonne architecture doit evoluer avec le projet, sans etre surdimensionnee des le depart.
:::

---

## 1. Evolution de l'architecture : du simple au complexe

### 1.1 Apercu des trois niveaux de complexite

L'architecture d'un projet frontend doit correspondre a la complexite du projet. Nous classons les projets en trois niveaux selon deux dimensions : la **complexite technique** et le **nombre d'utilisateurs** :

| Niveau | Stack technique | Nombre d'utilisateurs | Scenarios typiques | Preoccupation principale |
|--------|----------------|----------------------|-------------------|--------------------------|
| **Debutant** | HTML/CSS/JS | Individu/petite equipe | Blog personnel, page promotionnelle, outils simples | Mise en ligne rapide, maintenance simple |
| **Intermediaire** | Vue/React + outils de build | PME | Systemes de gestion, vitrine e-commerce, SaaS | Reutilisation de composants, gestion d'etat |
| **Entreprise** | Framework + micro-frontend/SSR | Applications a grande echelle | Grandes plateformes, systemes metiers complexes | Optimisation des performances, collaboration d'equipe, evolutivite |

::: tip 💡 Comment choisir ?
**Ne surdimensionnez pas !** Beaucoup de projets commencent par du simple HTML et introduisent progressivement des frameworks et des outils au fur et a mesure que les besoins evoluent.

- Projet personnel → Niveau debutant
- MVP de startup → Debutant ou intermediaire
- Systeme de gestion d'entreprise → Intermediaire
- Grande plateforme internet → Entreprise
:::

---

## 2. Niveau debutant : projets HTML/CSS/JS

### 2.1 Scenarios d'application

- Blog personnel, page de CV
- Page promotionnelle de produit (Landing Page)
- Pages d'outils simples (calculatrice, convertisseur, etc.)
- Validation de prototype, demo rapide

### 2.2 Structure de repertoire recommandee

```
my-simple-project/
├── index.html              # Page d'accueil
├── about.html              # Page a propos (si necessaire)
├── css/
│   ├── reset.css           # Reinitialisation des styles
│   ├── variables.css       # Variables CSS (couleurs, polices, etc.)
│   ├── components.css      # Styles de composants (boutons, cartes, etc.)
│   └── main.css            # Feuille de style principale
├── js/
│   ├── utils.js            # Fonctions utilitaires
│   ├── api.js              # Appels API simples
│   └── main.js             # Logique principale
├── assets/
│   ├── images/             # Ressources images
│   └── fonts/              # Fichiers de polices
└── README.md               # Description du projet
```

### 2.3 Principes d'organisation du code

**HTML** : balises semantiques, structure claire

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mon blog personnel</title>
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <header class="site-header">
    <nav class="main-nav">
      <a href="index.html">Accueil</a>
      <a href="about.html">A propos</a>
    </nav>
  </header>

  <main class="content">
    <article class="blog-post">
      <h1>Titre de l'article</h1>
      <p>Contenu de l'article...</p>
    </article>
  </main>

  <footer class="site-footer">
    <p>&copy; 2024 Mon blog</p>
  </footer>

  <script src="js/utils.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

**CSS** : gestion du theme avec les variables CSS

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

/* components.css - Styles de composants reutilisables */
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

**JavaScript** : organisation modulaire (avec modules ES6 ou division simple)

```javascript
// utils.js
const utils = {
  // Simplification de la manipulation DOM
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

  // Wrapper du stockage local
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
  // Logique d'initialisation de la page
  initNavigation();
  loadBlogPosts();
});
```

### 2.4 Bonnes pratiques

✅ **A faire** :
- Utiliser des balises HTML semantiques
- Gerer les couleurs et les espacements avec des variables CSS
- Compresser les images et utiliser le chargement paresseux
- Ajouter les balises meta SEO de base

❌ **A eviter** :
- Styles en ligne (`style="..."`)
- Pollution par les variables globales
- Code duplique (copier-coller)

---

## 3. Niveau intermediaire : projets avec frameworks Vue/React

### 3.1 Scenarios d'application

- Systemes de gestion d'entreprise (ERP, CRM, OA)
- Front/back-office e-commerce
- Applications SaaS
- Applications web necessitant des interactions complexes

### 3.2 Structure de projet Vue recommandee

```
my-vue-project/
├── public/                     # Ressources statiques
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/                 # Styles, images, polices
│   │   ├── styles/
│   │   │   ├── variables.scss
│   │   │   ├── mixins.scss
│   │   │   └── global.scss
│   │   └── images/
│   ├── components/             # Composants communs
│   │   ├── common/             # Globaux (Button, Modal, etc.)
│   │   │   ├── Button/
│   │   │   │   ├── index.vue
│   │   │   │   └── Button.scss
│   │   │   └── Modal/
│   │   └── business/           # Composants metier (UserCard, etc.)
│   ├── views/                  # Composants de page
│   │   ├── Home/
│   │   ├── User/
│   │   │   ├── List.vue
│   │   │   └── Detail.vue
│   │   └── Product/
│   ├── router/                 # Configuration du routeur
│   │   └── index.js
│   ├── stores/                 # Gestion d'etat Pinia/Vuex
│   │   ├── user.js
│   │   └── app.js
│   ├── services/               # Services API
│   │   ├── request.js          # Wrapper axios
│   │   ├── user.js
│   │   └── product.js
│   ├── utils/                  # Fonctions utilitaires
│   │   ├── format.js
│   │   ├── validate.js
│   │   └── storage.js
│   ├── composables/            # Fonctions composites
│   │   ├── useAuth.js
│   │   └── useLoading.js
│   ├── constants/              # Definitions de constantes
│   │   └── index.js
│   ├── App.vue
│   └── main.js
├── tests/                      # Fichiers de test
├── .env                        # Variables d'environnement
├── vite.config.js
├── package.json
└── README.md
```

### 3.3 Structure de projet React recommandee

```
my-react-project/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/             # Composants communs
│   │   │   ├── Button/
│   │   │   │   ├── index.jsx
│   │   │   │   └── Button.module.css
│   │   │   └── Modal/
│   │   └── business/           # Composants metier
│   ├── pages/                  # Composants de page
│   │   ├── Home/
│   │   ├── User/
│   │   └── Product/
│   ├── hooks/                  # Hooks personnalises
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   ├── services/               # Services API
│   │   ├── api.js
│   │   └── userService.js
│   ├── store/                  # Gestion d'etat Redux/Zustand
│   │   ├── slices/
│   │   └── index.js
│   ├── utils/
│   ├── constants/
│   ├── App.jsx
│   └── main.jsx
├── tests/
└── package.json
```

### 3.4 Explication des concepts cles

#### Principes de conception de composants

**Responsabilite unique** : un composant ne fait qu'une seule chose

```vue
<!-- ❌ Mauvais exemple : le composant fait trop de choses -->
<template>
  <div>
    <form @submit="handleSubmit">
      <!-- Contenu du formulaire -->
    </form>
    <table>
      <!-- Tableau de donnees -->
    </table>
    <div class="charts">
      <!-- Graphiques statistiques -->
    </div>
  </div>
</template>

<!-- ✅ Bon exemple : diviser en composants independants -->
<template>
  <div>
    <UserForm @submit="fetchData" />
    <UserTable :data="users" />
    <UserStats :data="users" />
  </div>
</template>
```

#### Strategie de gestion d'etat

| Type d'etat | Emplacement de stockage | Exemple |
|------------|------------------------|---------|
| **Etat global** | Pinia/Redux | Informations utilisateur, etat de connexion, theme |
| **Etat de page** | Composant de page | Conditions de recherche de liste, pagination |
| **Etat de composant** | Interieur du composant | Saisie de formulaire, affichage/masquage de modale |
| **Etat serveur** | TanStack Query/SWR | Donnees serveur, cache |

#### Choix de l'organisation des repertoires

**Methode 1 : Organisation par type (pour les petits projets)**

```
src/
├── components/     # Tous les composants
├── views/          # Toutes les pages
├── stores/         # Tous les etats
└── services/       # Tous les services
```

**Methode 2 : Organisation par fonctionnalite (pour les projets moyens et grands)**

```
src/
├── features/
│   ├── auth/       # Tout le code de la fonctionnalite auth
│   ├── user/       # Tout le code de la fonctionnalite utilisateur
│   └── product/    # Tout le code de la fonctionnalite produit
├── shared/         # Ressources partagees
└── App.vue
```

::: tip 💡 Comment choisir ?
- Pages du projet < 10 → Organisation par type
- Pages du projet > 20 → Organisation par fonctionnalite
- Equipe > 5 personnes → Organisation par fonctionnalite, facilite le developpement parallele
:::

---

## 4. Niveau entreprise : architecture des grandes applications

### 4.1 Scenarios d'application

- Grandes plateformes internet (e-commerce, social, plateformes de contenu)
- Applications d'entreprise complexes
- Projets necessitant la collaboration de plusieurs equipes
- Projets avec des exigences tres elevees en performance et maintenabilite

### 4.2 Architecture micro-frontend

Lorsqu'un projet atteint une certaine taille et qu'une base de code unique devient difficile a maintenir, une architecture **micro-frontend** peut etre envisagee.

```
Grande plateforme e-commerce/
├── Application de base (framework principal)
│   ├── Navigation superieure
│   ├── Menu lateral
│   ├── Entree de l'espace utilisateur
│   └── Conteneur de sous-applications
├── Sous-application Produit (deployee independamment)
│   ├── Liste des produits
│   ├── Detail produit
│   └── Gestion des produits
├── Sous-application Commande (deployee independamment)
│   ├── Panier
│   ├── Liste des commandes
│   └── Processus de paiement
├── Sous-application Utilisateur (deployee independamment)
│   ├── Espace personnel
│   ├── Adresses de livraison
│   └── Coupons
└── Sous-application Marketing (deployee independamment)
    ├── Pages promotionnelles
    ├── Distribution de coupons
    └── Magasin de points
```

**Avantages du micro-frontend** :
- Autonomie des equipes : chaque sous-application est developpee et deployee independamment
- Independance technologique : differentes equipes peuvent utiliser differents frameworks
- Mise a niveau progressive : les anciens systemes peuvent etre refactores progressivement

### 4.3 Structure de repertoire entreprise

```
enterprise-project/
├── apps/                       # Sous-applications micro-frontend
│   ├── main/                   # Application de base
│   ├── product/
│   ├── order/
│   └── user/
├── packages/                   # Paquets partages (Monorepo)
│   ├── ui-components/          # Bibliotheque de composants commune
│   ├── utils/                  # Fonctions utilitaires
│   ├── constants/              # Definitions de constantes
│   └── types/                  # Types TypeScript
├── shared/                     # Configurations partagees
│   ├── eslint-config/
│   ├── ts-config/
│   └── vite-config/
├── docs/                       # Documentation du projet
├── scripts/                    # Scripts de build
└── package.json
```

### 4.4 Architecture d'optimisation des performances

Les grandes applications doivent s'attarder sur l'optimisation des performances :

```
Strategie d'optimisation des performances/
├── Optimisation au build
│   ├── Decoupage du code (Code Splitting)
│   ├── Chargement paresseux des routes
│   ├── Tree Shaking
│   └── Compression des ressources
├── Optimisation a l'execution
│   ├── Defilement virtuel (listes longues)
│   ├── Chargement paresseux des images
│   ├── Rendu a la demande des composants
│   └── Strategie de cache
└── Optimisation reseau
    ├── Acceleration CDN
    ├── Cache HTTP
    ├── Prechargement des ressources
    └── Service Worker
```

### 4.5 Architecture SSR/SSG

Pour les scenarios necessitant du SEO ou des performances de premier rendu :

| Solution | Scenario d'application | Frameworks representatifs |
|----------|----------------------|--------------------------|
| **SSR** | SEO necessaire, premier rendu rapide | Next.js, Nuxt.js |
| **SSG** | Contenu statique, mises a jour peu frequentes | Astro, VitePress |
| **Hybride** | Partie statique, partie dynamique | Next.js (ISR) |

---

## 5. Choix d'architecture selon le volume d'utilisateurs

### 5.1 Individu/petite equipe (utilisateurs actifs/jour < 1 000)

**Caracteristiques** : iterations rapides, ressources limitees, besoins changeants

**Architecture recommandee** :
- Stack technique : Vue 3 + Vite ou React + Vite
- Gestion d'etat : Pinia ou Zustand (leger)
- Bibliotheque UI : Element Plus / Ant Design
- Deploiement : Vercel / Netlify / serveur cloud

**Structure de repertoire** : organisation simple par type

### 5.2 Entreprise moyenne (utilisateurs actifs/jour 1k-100k)

**Caracteristiques** : metier complexe, collaboration d'equipe, stabilite necessaire

**Architecture recommandee** :
- Stack technique : Vue 3 + TypeScript ou React + TypeScript
- Gestion d'etat : Pinia + fonctions composites ou Redux Toolkit
- Bibliotheque UI : bibliotheque de composants maison + bibliotheque de composants metier
- Tests : tests unitaires + tests E2E
- Deploiement : pipeline CI/CD + Docker

**Structure de repertoire** : organisation par fonctionnalite, etablir des normes

### 5.3 Grande plateforme (utilisateurs actifs/jour > 100k)

**Caracteristiques** : forte concurrence, collaboration multi-equipes, maintenance a long terme

**Architecture recommandee** :
- Stack technique : React/Vue + TypeScript (mode strict)
- Architecture : micro-frontend + Monorepo
- Gestion d'etat : gestion d'etat fine + cache d'etat serveur
- Performances : SSR/SSG + CDN + edge computing
- Monitoring : monitoring frontend + suivi des erreurs + analyse des performances

**Structure de repertoire** : Monorepo + micro-frontend

---

## 6. Feuille de route de l'evolution architecturale

### 6.1 Exemple d'evolution : du blog a la plateforme

```
Etape 1 : Blog personnel (HTML/CSS/JS)
    ↓ Besoin : back-office d'administration necessaire
Etape 2 : Ajout d'un back-office d'administration (Vue/React + structure simple)
    ↓ Besoin : systeme utilisateurs, fonctionnalite de commentaires
Etape 3 : Modularisation des fonctionnalites (organisation par fonctionnalite)
    ↓ Besoin : collaboration multi-equipes, deploiement independant
Etape 4 : Architecture micro-frontend (Monorepo)
```

### 6.2 Quand faut-il mettre a niveau l'architecture

| Signal | Description | Recommandation |
|--------|------------|----------------|
| Temps de build > 5 minutes | Projet trop volumineux | Decoupage du code, micro-frontend |
| Conflits frequents entre plusieurs personnes | Collaboration difficile | Organisation par fonctionnalite, separation des modules |
| Modifier un endroit en casse plusieurs autres | Couplage severe | Refactoring, renforcer les tests |
| Premier rendu > 3 secondes | Probleme de performance | Chargement paresseux, SSR, optimisation |
| L'integration des nouveaux membres est lente | Structure confuse | Documentation, normes, refactoring |

---

## 7. Resume

::: tip 💡 Idee centrale
**Il n'y a pas de balle d'argent en architecture — ce qui convient est le mieux.**

- **Petits projets** : ne pas surdimensionner, HTML/CSS/JS suffit
- **Projets moyens** : etablir des normes, componentisation, modularisation
- **Grands projets** : envisager le micro-frontend, l'optimisation des performances, la collaboration d'equipe

**Retenez ces points** :
1. **Evolution progressive** : commencer simplement, grandir avec les besoins
2. **Conventions unifiees** : nomenclature, structure, style de code coherents
3. **Documentation d'abord** : documenter les decisions architecturales pour faciliter la transmission
4. **Refactoring regulier** : rembourser la dette technique en temps voulu

**Objectif final** : faire en sorte que le code fonctionne comme un espace bien organise, quelle que soit sa taille, de maniere efficace.
:::

---

## Ressources de reference

- [Guide de style Vue](https://vuejs.org/style-guide/)
- [Suggestions de structure de projet React](https://react.dev/learn/thinking-in-react)
- [Bulletproof React - Guide d'architecture](https://github.com/alan2207/bulletproof-react)
- [Feature Sliced Design](https://feature-sliced.design/)
- [Architecture micro-frontend](https://micro-frontends.org/)
