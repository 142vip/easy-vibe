# Fondamentaux : Système de mise en page HTML/CSS
::: tip 🎯 Question centrale
**Comment les pages web sont-elles créées ? Pourquoi certaines pages ne contiennent-elles que du texte, tandis que d'autres sont interactives comme des applications ?** Cette question vous amènera à découvrir les trois piliers du développement web, vous permettant de comprendre la structure de chaque page web.
:::

---

## 1. Que sont HTML, CSS et JavaScript

### 1.1 Des pages statiques aux applications dynamiques

Imaginez une **affiche** que vous voyez dans la rue. Vous ne pouvez que la regarder, sans interagir — l'affiche ne change pas de contenu parce que vous la regardez, et ne fait pas apparaître plus d'informations parce que vous touchez un endroit.

Les premières pages web étaient exactement comme ces « affiches électroniques » : on ne pouvait que les regarder, sans les modifier, avec un contenu fixe.

Mais les pages web modernes sont complètement différentes. Elles ressemblent à des **applications de bureau** :

- Vous pouvez cliquer, glisser, saisir, télécharger
- La page change en temps réel selon vos actions
- Elles peuvent accomplir des tâches complexes comme un logiciel (par exemple, le montage vidéo en ligne)

**La raison centrale de cette transformation, ce sont les trois piliers de la technologie web : HTML + CSS + JavaScript**.

### 1.2 Une analogie : construire une maison

| Technologie    | 🏠 Analogie de la maison                 | Rôle réel                       | Exemple concret                                              |
| -------------- | ---------------------------------------- | ------------------------------- | ------------------------------------------------------------ |
| **HTML**       | La **structure et les matériaux** de la maison | Définit le contenu et la hiérarchie de la page | C'est un mur, c'est une fenêtre, c'est une pièce             |
| **CSS**        | La **décoration et l'apparence** de la maison | Contrôle le style et la mise en page | Peindre le mur en bleu, placer la fenêtre à l'est, poser du carrelage au sol |
| **JavaScript** | Les **appareils électriques et le système intelligent** de la maison | Rend la page interactive et logique | Appuyer sur l'interrupteur allume la lumière, ouvrir la porte déclenche l'ouverture automatique des rideaux |

::: tip 💡 La relation entre les trois

**HTML → CSS** : Il faut d'abord une maison pour pouvoir la décorer. HTML est la base, CSS est l'embellissement.

**HTML + CSS → JavaScript** : Il faut d'abord la maison et la décoration pour installer le système intelligent. JavaScript rend « vivante » une page « morte ».

**Idée centrale** : Les trois ont chacun leur rôle, aucun n'est superflu. Une page avec seulement HTML est laide, une page avec seulement HTML+CSS n'est pas interactive, les trois réunis permettent de créer des « applications web » comme la version web de WeChat ou Taobao.
:::

### 1.3 Essayez par vous-même

👇 La démonstration ci-dessous montre comment HTML/CSS/JavaScript collaborent :

<WebTechTriad />

---

## 2. HTML : le squelette de la page web

### 2.1 Pourquoi a-t-on besoin de HTML

Avant l'apparition de HTML, le contenu sur Internet était uniquement du **texte brut**. Comme le texte que vous lisez actuellement, sans aucun formatage, sans hiérarchie, sans liens.

Quels sont les problèmes du texte brut ?

- ❌ **Impossible d'exprimer la hiérarchie** : on ne distingue pas le titre, le corps du texte, les annotations
- ❌ **Les machines ne comprennent pas** : les moteurs de recherche, les lecteurs d'écran (pour les malvoyants) ne peuvent pas comprendre le contenu
- ❌ **Impossible d'interagir** : pas de liens, pas de boutons, pas de champs de saisie

**HTML (HyperText Markup Language)** est né pour résoudre ce problème. Il utilise des « balises » (tags) pour marquer la signification du contenu, afin que le navigateur sache « ce que c'est ».

### 2.2 À quoi ressemble le code HTML

L'unité de base de HTML est la « balise » (tag). Les balises sont entourées de chevrons `< >` et apparaissent par paires :

```html
<h1>Ceci est un titre</h1>
<p>Ceci est un paragraphe</p>
<a href="url">Ceci est un lien</a>
```

**Concepts clés** :

| Concept | Explication | Exemple |
|------|------|------|
| **Balise** | Un marqueur entouré de chevrons | `<h1>`, `</h1>` |
| **Élément** | L'ensemble balise + contenu | `<h1>Titre</h1>` |
| **Attribut** | Information supplémentaire sur la balise | `href="url"`, `class="card"` |
| **Imbrication** | Une balise à l'intérieur d'une autre | `<div><p>Texte</p></div>` |

### 2.3 Comment lire du code HTML

::: tip 🎯 Lecture obligatoire pour les débutants : méthode de lecture du code

Beaucoup de débutants sont perdus face à une série de `<xxx>`. En réalité, lire du code HTML suit une **méthode systématique** :

**Première étape : trouver le « conteneur le plus externe »**

```html
<div class="card">        ← C'est le conteneur, qui contient le contenu
  <h2>Titre</h2>
  <p>Texte descriptif</p>
</div>
```

**Deuxième étape : deviner la signification à partir du nom de la balise**

| Nom de balise | À retenir | Ce qu'elle contient |
|--------|----------|------------|
| `<div>` | Grande boîte | Tout type de contenu, pour regrouper |
| `<span>` | Petite boîte | Fragment de texte, pour marquer |
| `<p>` | Paragraphe | Un bloc de texte |
| `<h1>`-`<h6>` | Titre | Texte de titre, plus le chiffre est petit, plus c'est important |
| `<a>` | Ancre/Lien | Contenu cliquable qui redirige |
| `<img>` | Image | Ne contient pas de texte, utilise src pour pointer vers l'image |
| `<button>` | Bouton | Texte/icône cliquable |
| `<input>` | Champ de saisie | Ne contient pas de texte, endroit où l'utilisateur saisit |

**Troisième étape : regarder class et id**

```html
<div class="user-card" id="user-123">
```

- `class="user-card"` → le « type » de cet élément, CSS peut le sélectionner par lot
- `id="user-123"` → le « numéro d'identité » de cet élément, identifiant unique

**Quatrième étape : l'indentation montre la hiérarchie**

```html
<body>
  <header>           ← L'indentation indique que header est un enfant de body
    <nav>            ← nav est un enfant de header
      <a>Accueil</a> ← a est un enfant de nav
    </nav>
  </header>
</body>
```
:::

### 2.4 Référence rapide des balises HTML courantes

**Balises de structure** (définissent le squelette de la page) :

```html
<h1>Ceci est un titre de niveau 1</h1>
<h2>Ceci est un titre de niveau 2</h2>
<p>Ceci est un paragraphe</p>
<div>Ceci est un conteneur (pour regrouper)</div>
<span>Ceci est un conteneur en ligne (pour marquer du texte)</span>
```

**Liens et médias** (enrichissent la page) :

```html
<a href="https://example.com">Cliquez ici pour y aller</a>
<img src="photo.jpg" alt="Description de la photo" />
<video src="movie.mp4" controls></video>
```

**Formulaires** (collectent les saisies utilisateur) :

```html
<form>
  <input type="text" placeholder="Veuillez saisir votre nom d'utilisateur" />
  <input type="password" placeholder="Veuillez saisir votre mot de passe" />
  <button type="submit">Connexion</button>
</form>
```

**Balises sémantiques** (ajoutées en HTML5, rendent le sens de la page plus explicite) :

```html
<header>En-tête de page</header>
<nav>Barre de navigation</nav>
<main>Zone de contenu principal</main>
<article>Un article</article>
<aside>Barre latérale</aside>
<footer>Pied de page</footer>
```

::: tip 💡 Pourquoi utiliser des balises sémantiques ?

`<div class="header">` et `<header>` semblent produire le même effet, pourquoi utiliser le second ?

1. **SEO friendly** : les moteurs de recherche comprennent mieux la structure de la page
2. **Accessibilité** : les lecteurs d'écran peuvent rapidement localiser les zones comme « navigation », « contenu principal »
3. **Lisibilité du code** : voir `<header>` permet de savoir immédiatement que c'est un en-tête

**Quand utiliser div ?** Quand il n'y a pas de balise sémantique appropriée. Par exemple, un conteneur purement décoratif.
:::

### 2.5 Comment mémoriser autant de balises HTML

::: tip 🎯 Confusion des débutants

« Il y a plus d'une centaine de balises HTML, comment tout retenir ? »

**La réponse est : pas besoin de tout retenir.** En développement réel, 90 % des cas utilisent seulement une vingtaine de balises.
:::

#### Mémorisation par catégorie d'usage

**1. Structure de page (dessiner le squelette)**

| Balise | Moyen mnémotechnique | Usage |
|------|----------|------|
| `<header>` | En-tête | En-tête de page ou de section |
| `<nav>` | Navigation | Zone de liens de navigation |
| `<main>` | Principal | Contenu principal de la page (un seul par page) |
| `<article>` | Article | Bloc de contenu indépendant (peut être extrait et rester significatif) |
| `<section>` | Section | Regroupement de contenu thématique |
| `<aside>` | À côté | Barre latérale, contenu complémentaire |
| `<footer>` | Pied | Pied de page ou de section |

**Méthode de mémorisation** : Imaginez un journal — il a un en-tête (header), une table des matières (nav), un corps (main/article), des colonnes (aside), un pied de page (footer).

**2. Balisage de contenu (dire ce que c'est)**

| Balise | Moyen mnémotechnique | Usage |
|------|----------|------|
| `<h1>`-`<h6>` | Titre 1-6 | Hiérarchie des titres, h1 est le plus grand et le plus important |
| `<p>` | Paragraphe | Un bloc de texte |
| `<ul>`/`<ol>`/`<li>` | Non ordonné/Ordonné/Élément de liste | Listes |
| `<a>` | Ancre | Lien, pour naviguer |
| `<img>` | Image | Image |
| `<video>`/`<audio>` | Vidéo/Audio | Multimédia |
| `<strong>`/`<em>` | Emphase forte/Emphase italique | Emphase sémantique |

**Méthode de mémorisation** : `<a>` est l'abréviation de anchor (ancre), imaginez un bateau qui jette l'ancre à un endroit, un lien « s'ancre » vers une autre page.

**3. Interaction par formulaire (collecter les saisies utilisateur)**

| Balise | Moyen mnémotechnique | Usage |
|------|----------|------|
| `<form>` | Formulaire | Conteneur de formulaire |
| `<input>` | Saisie | Différents champs de saisie (le type détermine la forme) |
| `<textarea>` | Zone de texte | Saisie de texte multiligne |
| `<select>`/`<option>` | Sélection/Option | Liste déroulante |
| `<button>` | Bouton | Bouton |
| `<label>` | Étiquette | Texte descriptif du champ de saisie |

**Méthode de mémorisation** : l'attribut `type` de `<input>` détermine son apparence :
- `type="text"` → Champ texte
- `type="password"` → Champ mot de passe
- `type="email"` → Champ email
- `type="checkbox"` → Case à cocher
- `type="radio"` → Bouton radio

**4. Conteneurs (pour regrouper)**

| Balise | Moyen mnémotechnique | Usage |
|------|----------|------|
| `<div>` | Grande boîte | Conteneur de bloc, occupe toute la ligne |
| `<span>` | Petite boîte | Conteneur en ligne, occupe seulement la largeur du contenu |

**Méthode de mémorisation** : div = division, span = étendue. div sert à diviser de grandes zones, span sert à marquer des fragments de texte.

#### Que faire face à une balise inconnue

**Méthode 1 : deviner le mot anglais**

De nombreuses balises sont des abréviations de mots anglais :
- `<abbr>` = abbreviation (abréviation)
- `<blockquote>` = block quote (citation en bloc)
- `<caption>` = caption (légende)
- `<figcaption>` = figure caption (légende d'image)

**Méthode 2 : consulter MDN**

[Référence des éléments HTML MDN](https://developer.mozilla.org/fr/docs/Web/HTML/Element) contient des explications détaillées pour toutes les balises.

**Méthode 3 : demander à l'IA**

> « Que signifie la balise `<dl>` en HTML ? Quand l'utiliser ? »

#### Pas besoin d'apprendre les balises par cœur

**Le véritable flux de travail est le suivant** :

1. Vous savez que vous avez besoin d'un « conteneur » → écrivez `<div>`
2. Plus tard, vous réalisez que c'est une « zone de navigation » → changez en `<nav>`
3. Plus tard, vous réalisez que c'est un « article indépendant » → changez en `<article>`

**Écrivez d'abord, optimisez la sémantique ensuite**. Les balises peuvent être changées à tout moment, ne vous bloquez pas au début sur le choix de la balise.

---

## 3. CSS : la peau de la page web

### 3.1 Pourquoi a-t-on besoin de CSS

Imaginez que vous emménagez dans un **appartement brut** : il y a des murs, des fenêtres, des portes, on peut y vivre, mais :

- Les murs sont en béton gris, ce n'est pas beau
- Les prises et interrupteurs sont installés n'importe comment, ce n'est pas esthétique
- Pas de meubles, la vie n'est pas pratique

Une page web avec seulement HTML est comme ça : elle a du contenu, une structure, mais elle est **laide**, **désordonnée**, **peu conviviale**.

CSS (Cascading Style Sheets) est « l'équipe de décoration » de la page web. Il ne change pas la structure HTML (ne démolit pas les murs, ne change pas les portes), il s'occupe seulement de :

- 🎨 **Peindre les murs** : changer les couleurs, les fonds
- 🖼️ **Accrocher des tableaux** : ajouter des bordures, des ombres, des coins arrondis
- 🪑 **Disposer les meubles** : ajuster la mise en page, les espacements, l'alignement

### 3.2 À quoi ressemble le code CSS

Le code CSS a un format fixe :

```css
sélecteur {
  nom-propriété: valeur;
  nom-propriété: valeur;
}
```

**Trois façons d'écrire** :

```html
<!-- Méthode 1 : style en ligne (pour tester temporairement) -->
<div style="color: red;">Texte rouge</div>

<!-- Méthode 2 : style interne (écrit dans le fichier HTML) -->
<style>
  .red-text { color: red; }
</style>

<!-- Méthode 3 : style externe (fichier CSS indépendant, recommandé) -->
<link rel="stylesheet" href="styles.css" />
```

### 3.3 Comment lire du code CSS

::: tip 🎯 Lecture obligatoire pour les débutants : méthode de lecture du CSS

**Première étape : regarder le sélecteur — « Qui décorer ? »**

| Sélecteur | Syntaxe | Signification |
|--------|------|------|
| Sélecteur de balise | `p { }` | Toutes les balises `<p>` |
| Sélecteur de classe | `.card { }` | Tous les éléments avec `class="card"` |
| Sélecteur d'ID | `#header { }` | L'élément unique avec `id="header"` |
| Sélecteur descendant | `.card h2 { }` | Tous les `<h2>` à l'intérieur de `.card` |
| Sélecteur groupé | `.card, .box { }` | Sélectionne à la fois `.card` et `.box` |

**Deuxième étape : regarder les propriétés — « Quoi décorer ? »**

| Catégorie de propriété | Propriétés courantes | Rôle |
|----------|----------|------|
| Texte | `color`, `font-size`, `font-weight` | Couleur, taille, graisse |
| Fond | `background`, `background-color` | Couleur de fond, image de fond |
| Bordure | `border`, `border-radius` | Ligne de bordure, coins arrondis |
| Espacement | `margin`, `padding` | Marge extérieure, marge intérieure |
| Mise en page | `display`, `flex`, `grid` | Mode de disposition |

**Troisième étape : regarder les valeurs — « Comment décorer ? »**

```css
.card {
  width: 300px;        /* Largeur fixe */
  padding: 16px;       /* Marge intérieure de 16 pixels */
  border-radius: 8px;  /* Coins arrondis de 8 pixels */
  background: #fff;    /* Fond blanc */
}
```

**Unités courantes** :
- `px` : pixel, taille fixe
- `%` : pourcentage, relatif à l'élément parent
- `rem` : relatif à la taille de police de l'élément racine
- `vw/vh` : relatif à la largeur/hauteur de la fenêtre (viewport)
:::

### 3.4 Priorité des sélecteurs

Si un élément est sélectionné par plusieurs sélecteurs en même temps, qui l'emporte ?

```html
<p class="highlight" id="special">De quelle couleur est ce texte ?</p>
```

```css
p { color: red; }             /* Priorité : 1 */
.highlight { color: yellow; } /* Priorité : 10 */
#special { color: blue; }     /* Priorité : 100 */
```

**Réponse** : bleu. Le sélecteur d'ID a la priorité la plus élevée, le sélecteur de classe vient ensuite, le sélecteur de balise est le plus bas.

**Le style en ligne** (écrit dans l'attribut style) a une priorité de 1000, la plus élevée !

### 3.5 Le modèle de boîte : pourquoi la largeur ne correspond pas

::: tip 🎯 Scénario réel

Vous créez une page web, vous voulez trois cartes côte à côte, chaque carte fait 300px de large, le conteneur fait 900px au total. Vous écrivez :

```css
.card { width: 300px; }
```

Résultat : **la troisième carte passe à la ligne suivante !**

**Pourquoi ?** Parce que `width: 300px` n'est que la largeur du contenu, vous avez oublié de compter le padding et la bordure. Si la carte a `padding: 20px` et `border: 1px`, la largeur réelle est de 342px, trois cartes font 1026px, ce qui dépasse le conteneur !
:::

Chaque élément HTML est considéré en CSS comme une « boîte » composée de quatre couches. Imaginez que vous **préparez un colis** : le contenu est le produit, le padding est le papier bulle, la bordure est le carton, la marge est l'espace entre les cartons.

👇 **Essayez par vous-même** : faites glisser les curseurs pour ajuster la taille de chaque couche et observez les changements du modèle de boîte :

<CssBoxModel />

**Solution** :

```css
.box {
  box-sizing: border-box;  /* Pour que width inclue le padding et la bordure */
  width: 200px;
  padding: 10px;
  border: 5px;
}
```

Ainsi, `width: 200px` est la largeur finale, le padding et la bordure sont « compressés » à l'intérieur.

### 3.6 Flexbox : comment aligner automatiquement les éléments

Flexbox est la méthode de mise en page la plus utilisée en CSS moderne. Elle permet aux éléments de s'aligner automatiquement, comme les livres sur une étagère qui s'alignent tout seuls.

👇 **Essayez par vous-même** : changez la direction, l'alignement, et observez comment les boîtes se disposent :

<CssFlexbox />

**Concepts fondamentaux de Flex** :

| Propriété | Rôle | Valeurs courantes |
|------|------|--------|
| `display: flex` | Active la mise en page Flex | - |
| `flex-direction` | Direction de l'axe principal | `row` (horizontal), `column` (vertical) |
| `justify-content` | Alignement sur l'axe principal | `flex-start`, `center`, `space-between` |
| `align-items` | Alignement sur l'axe transversal | `stretch`, `center`, `flex-start` |
| `flex-wrap` | Retour à la ligne | `nowrap`, `wrap` |
| `gap` | Espacement entre les éléments | `10px`, `1rem` |

### 3.7 Préprocesseurs CSS : SCSS/SASS et LESS

::: tip 🎯 Scénario réel

Vous avez écrit un projet, le fichier CSS fait 2000 lignes. Plus tard, vous devez changer la couleur du thème, et vous découvrez :

- La couleur principale `#3b82f6` apparaît 50 fois
- Changer une couleur nécessite une recherche et remplacement global, avec le risque d'en oublier
- Les sélecteurs comme `.nav .nav-list .nav-item .nav-link` sont longs et difficiles à maintenir

**Les préprocesseurs CSS** sont là pour résoudre ces problèmes. Ils permettent au CSS de « programmer » : avoir des variables, de l'imbrication, pouvoir réutiliser du code.
:::

#### 3.7.1 Qu'est-ce qu'un préprocesseur CSS

**En langage simple** : un préprocesseur est un « CSS plus intelligent ». Vous écrivez des styles avec une syntaxe plus puissante, puis il les **compile** en CSS ordinaire que le navigateur peut reconnaître.

**Pourquoi l'utiliser ?**

| Point douloureux | CSS natif | Préprocesseur |
|------|----------|----------|
| Couleur qui se répète | Copier-coller partout | Définir une variable, une modification s'applique partout |
| Sélecteurs trop imbriqués | Écrits en une longue chaîne | Syntaxe d'imbrication, la hiérarchie est claire |
| Styles identiques répétés | Copier-coller | Mixins, réutilisables comme des fonctions |

#### 3.7.2 Comparaison des trois principaux préprocesseurs

| Caractéristique | CSS natif | **SCSS/SASS** | **LESS** |
|------|----------|---------------|----------|
| **Syntaxe des variables** | `--primary` | `$primary` | `@primary` |
| **Syntaxe d'imbrication** | ❌ Non supporté | ✅ Supporté | ✅ Supporté |
| **Mixins (réutilisation de code)** | ❌ Non supporté | ✅ `@mixin` | ✅ `.mixin()` |
| **Difficulté d'apprentissage** | Facile | Moyen | Moyen |
| **Popularité** | - | ⭐⭐⭐ Le plus populaire | ⭐⭐ Assez populaire |

**Pour résumer simplement** :
- **SCSS** : utilise le symbole `$`, utilisé par Bootstrap 5, le meilleur écosystème
- **LESS** : utilise le symbole `@`, cohérent avec la syntaxe `@media` de CSS, facile à prendre en main

#### 3.7.3 Comparaison des fonctionnalités principales

##### 1. Variables : une modification, effet global

**Scénario** : la couleur du thème `#3b82f6` est utilisée à 20 endroits, il faut la changer en rouge.

<Tabs>
<TabItem label="CSS natif">

```css
/* Il faut modifier 20 endroits, facile d'en oublier */
.button { background: #3b82f6; }
.link { color: #3b82f6; }
.border { border-color: #3b82f6; }
```

</TabItem>
<TabItem label="SCSS">

```scss
$primary: #3b82f6;

.button { background: $primary; }
.link { color: $primary; }
.border { border-color: $primary; }
/* Modifier $primary à un seul endroit suffit */
```

</TabItem>
<TabItem label="LESS">

```less
@primary: #3b82f6;

.button { background: @primary; }
.link { color: @primary; }
.border { border-color: @primary; }
/* Modifier @primary à un seul endroit suffit */
```

</TabItem>
</Tabs>

##### 2. Imbrication : la hiérarchie est claire

**Scénario** : la barre de navigation a une structure à plusieurs niveaux.

<Tabs>
<TabItem label="CSS natif">

```css
/* Écrit en une longue chaîne, difficile de voir la hiérarchie */
.navbar .nav-list .nav-item .nav-link { }
.navbar .nav-list .nav-item .nav-link:hover { }
```

</TabItem>
<TabItem label="SCSS">

```scss
.navbar {
  .nav-list {
    .nav-item {
      .nav-link {
        &:hover { }  /* & représente le sélecteur parent */
      }
    }
  }
}
```

</TabItem>
<TabItem label="LESS">

```less
.navbar {
  .nav-list {
    .nav-item {
      .nav-link {
        &:hover { }
      }
    }
  }
}
```

</TabItem>
</Tabs>

##### 3. Mixins : réutiliser des fragments de code

**Scénario** : plusieurs boutons ont besoin du style « centré ».

<Tabs>
<TabItem label="CSS natif">

```css
/* Copier-coller 3 fois */
.btn-primary {
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-secondary {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

</TabItem>
<TabItem label="SCSS">

```scss
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-primary { @include center; }
.btn-secondary { @include center; }
```

</TabItem>
<TabItem label="LESS">

```less
.center() {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-primary { .center(); }
.btn-secondary { .center(); }
```

</TabItem>
</Tabs>

#### 3.7.4 Comment choisir

| Situation | Recommandation |
|------|----------|
| Vous débutez, petit projet | **CSS natif** (consolidez d'abord les bases) |
| Le projet utilise Bootstrap 5 | **SCSS** (le code source de Bootstrap est en SCSS) |
| L'équipe est familière avec le symbole `@` | **LESS** (cohérent avec la syntaxe `@media` de CSS) |
| Besoin de logique complexe (boucles, conditions) | **SCSS** (plus puissant) |

#### 3.7.5 Utilisation dans un projet

**Projet Vite (le plus simple)** :

```bash
# Installer sass
npm install -D sass

# Utiliser directement des fichiers .scss ou .less
```

::: tip 💡 Conseils pour les débutants

1. **Maîtrisez d'abord le CSS natif** : les préprocesseurs ne sont que du « sucre syntaxique », sans comprendre les bases du CSS, vous serez de plus en plus perdu
2. **Pas obligatoire pour les petits projets** : si le CSS fait moins de 200 lignes, écrire du CSS directement est plus simple
3. **Commencez par SCSS** : la syntaxe est presque identique au CSS, avec juste les variables `$` en plus
4. **N'imbriquez pas trop profondément** : au-delà de 3 niveaux, le code devient difficile à maintenir
:::

#### 3.7.6 Comparaison de l'organisation des fichiers selon la pile technique

**Même projet, différentes piles techniques, quelle différence dans la structure des fichiers ?**

<Tabs>
<TabItem label="HTML + CSS natif">

```
my-website/
├── index.html              # Structure de la page
├── about.html
├── css/
│   ├── reset.css           # Styles de réinitialisation
│   ├── layout.css          # Styles de mise en page
│   ├── components.css      # Styles des composants
│   └── style.css           # Style principal (peut faire des milliers de lignes)
├── js/
│   └── main.js
└── images/
    └── logo.png
```

**Caractéristiques** :
- CSS concentré dans un ou quelques fichiers
- Pour modifier les styles, il faut basculer entre les fichiers HTML et CSS
- Les styles peuvent facilement entrer en conflit

</TabItem>
<TabItem label="Vue + CSS natif">

```
src/
├── components/             # Dossier des composants
│   ├── Button/
│   │   ├── Button.vue      # Template + style + logique
│   │   └── Button.test.js
│   ├── Header/
│   │   └── Header.vue
│   └── Footer/
│       └── Footer.vue
├── views/                  # Dossier des pages
│   ├── Home.vue
│   └── About.vue
├── App.vue                 # Composant racine
└── main.js                 # Point d'entrée
```

**Structure interne de Button.vue** :
```vue
<template>
  <button class="btn">Cliquer</button>
</template>

<script>
export default { name: 'Button' }
</script>

<style scoped>              <!-- scoped : le style n'affecte que le composant courant -->
.btn { background: #3b82f6; }
</style>
```

</TabItem>
<TabItem label="Vue + SCSS">

```
src/
├── assets/
│   └── styles/
│       ├── _variables.scss     # Variables : couleurs, espacements, etc.
│       ├── _mixins.scss        # Mixins : blocs de code réutilisables
│       ├── _functions.scss     # Fonctions : calculs de couleur, etc.
│       └── global.scss         # Point d'entrée des styles globaux
├── components/
│   ├── Button/
│   │   └── Button.vue          # Dans le composant, utiliser @import pour les variables
│   └── Card/
│       └── Card.vue
├── views/
│   ├── Home.vue
│   └── About.vue
├── App.vue
└── main.js
```

**_variables.scss** :
```scss
$primary: #3b82f6;
$secondary: #64748b;
$spacing-sm: 8px;
$spacing-md: 16px;
```

**Button.vue** :
```vue
<style scoped lang="scss">
@import '@/assets/styles/variables';

.btn {
  background: $primary;      // Utiliser une variable
  padding: $spacing-md;
}
</style>
```

</TabItem>
<TabItem label="Vue + Tailwind CSS">

```
src/
├── components/
│   ├── Button.vue          # Pas besoin de bloc style
│   ├── Card.vue
│   └── Header.vue
├── views/
│   ├── Home.vue
│   └── About.vue
├── App.vue
└── main.js

# Fichiers de configuration (répertoire racine)
tailwind.config.js          # Configuration du thème
tailwind.css                # Point d'entrée des styles de base
```

**Button.vue** (sans bloc style) :
```vue
<template>
  <button class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
    Cliquer
  </button>
</template>
```

**Caractéristiques** :
- Pas de fichier de style séparé
- Les noms de classe sont les styles (`bg-blue-500` = fond bleu)
- Configuration centralisée dans `tailwind.config.js`

</TabItem>
</Tabs>

**Résumé des différences fondamentales** :

| Pile technique | Emplacement des styles | Gestion du thème | Réutilisation du code |
|--------|-------------|----------|----------|
| HTML+CSS natif | Centralisé dans le dossier `css/` | Rechercher et remplacer | Copier-coller |
| Vue + CSS | Distribué dans les composants `.vue` | Rechercher et remplacer | Copier-coller |
| Vue + SCSS | Dans les composants + fichiers communs `styles/` | Variables centralisées | Réutilisation par mixins |
| Vue + Tailwind | Aucun (dans les noms de classe) | `tailwind.config.js` | Combinaison de noms de classe |

### 3.8 Comment mémoriser autant de propriétés CSS

::: tip 🎯 Confusion des débutants

« Il y a des centaines de propriétés CSS, comment tout retenir ? »

**La réponse est : classez par usage, retenez les propriétés essentielles, cherchez les autres quand vous en avez besoin.**
:::

#### Mémorisation par catégorie d'usage

**1. Typographie (gère l'apparence du texte)**

| Propriété | Moyen mnémotechnique | Valeurs courantes |
|------|----------|--------|
| `color` | Couleur | `red`, `#fff`, `rgb(0,0,0)` |
| `font-size` | Taille de police | `16px`, `1rem`, `1.5em` |
| `font-weight` | Graisse de police | `normal`, `bold`, `100`-`900` |
| `font-family` | Famille de police | `"Microsoft YaHei"`, `sans-serif` |
| `line-height` | Hauteur de ligne | `1.5`, `24px` |
| `text-align` | Alignement du texte | `left`, `center`, `right` |
| `text-decoration` | Décoration du texte | `none`, `underline`, `line-through` |

**Méthode de mémorisation** : imaginez que vous mettez en forme dans Word — changer la couleur, la taille, mettre en gras, changer la police, ajuster l'interligne, aligner, souligner.

**2. Modèle de boîte (gère l'espace occupé par l'élément)**

| Propriété | Moyen mnémotechnique | Valeurs courantes |
|------|----------|--------|
| `width`/`height` | Largeur/Hauteur | `100px`, `50%`, `100vw` |
| `padding` | Marge intérieure | `10px`, `10px 20px` |
| `margin` | Marge extérieure | `10px`, `auto` (pour centrer) |
| `border` | Bordure | `1px solid #ccc` |
| `border-radius` | Coins arrondis | `4px`, `50%` (cercle) |
| `box-sizing` | Modèle de boîte | `border-box` (recommandé) |

**Méthode de mémorisation** : padding est la marge « intérieure » (distance du contenu à la bordure), margin est la marge « extérieure » (distance de la bordure aux autres éléments).

**Règle de raccourci** :
```css
/* Quatre valeurs : haut droite bas gauche (sens horaire) */
padding: 10px 20px 15px 25px;

/* Deux valeurs : haut-bas gauche-droite */
padding: 10px 20px;

/* Une valeur : les quatre côtés identiques */
padding: 10px;
```

**3. Fond et bordure (gère l'apparence de l'élément)**

| Propriété | Moyen mnémotechnique | Valeurs courantes |
|------|----------|--------|
| `background` | Fond | `#fff`, `url(bg.jpg)`, `linear-gradient(...)` |
| `background-color` | Couleur de fond | `#fff`, `rgba(0,0,0,0.5)` |
| `background-image` | Image de fond | `url(photo.jpg)` |
| `background-size` | Taille du fond | `cover`, `contain`, `100%` |
| `background-position` | Position du fond | `center`, `top left` |
| `box-shadow` | Ombre de boîte | `0 2px 10px rgba(0,0,0,0.1)` |
| `opacity` | Opacité | `0`-`1` (0 complètement transparent) |

**Méthode de mémorisation** : `background` est un raccourci, on peut définir plusieurs valeurs à la fois :
```css
background: #fff url(bg.jpg) no-repeat center/cover;
/*          couleur  image      répétition  position/taille */
```

**4. Mise en page (gère la disposition des éléments)**

| Propriété | Moyen mnémotechnique | Valeurs courantes |
|------|----------|--------|
| `display` | Mode d'affichage | `block`, `inline`, `flex`, `grid`, `none` |
| `position` | Positionnement | `static`, `relative`, `absolute`, `fixed`, `sticky` |
| `top`/`right`/`bottom`/`left` | Quatre directions | `10px`, `50%` (à utiliser avec position) |
| `z-index` | Niveau de profondeur | Plus le nombre est grand, plus l'élément est au-dessus |
| `float` | Flottant | `left`, `right` (ancienne méthode, déconseillée) |
| `overflow` | Gestion du débordement | `visible`, `hidden`, `scroll`, `auto` |

**Méthode de mémorisation pour position** :
- `static` : par défaut, flux normal
- `relative` : décalage par rapport à sa position d'origine
- `absolute` : positionné par rapport à l'ancêtre positionné le plus proche
- `fixed` : positionné par rapport à la fenêtre (reste fixe même en défilant)
- `sticky` : se fixe après avoir défilé jusqu'à une certaine position

**5. Mise en page Flexbox (l'outil magique de mise en page unidimensionnelle)**

| Propriété | Moyen mnémotechnique | Rôle |
|------|----------|------|
| `display: flex` | Activer Flex | Le conteneur devient un conteneur Flex |
| `flex-direction` | Direction | `row` (horizontal), `column` (vertical) |
| `justify-content` | Alignement sur l'axe principal | Comment les éléments sont disposés sur l'axe principal |
| `align-items` | Alignement sur l'axe transversal | Comment les éléments sont alignés sur l'axe transversal |
| `flex-wrap` | Retour à la ligne | `nowrap`, `wrap` |
| `gap` | Écart | Espacement entre les éléments |
| `flex` | Flexibilité | Proportion d'étirement des éléments enfants |

**Méthode de mémorisation** :
- `justify` = justifier/aligner → alignement sur l'axe principal
- `align` = aligner → alignement sur l'axe transversal

**6. Animation et transition (gère le mouvement des éléments)**

| Propriété | Moyen mnémotechnique | Valeurs courantes |
|------|----------|--------|
| `transition` | Transition | `all 0.3s ease` |
| `transform` | Transformation | `translate(10px)`, `rotate(45deg)`, `scale(1.1)` |
| `animation` | Animation | `fadeIn 1s ease forwards` |

**Règle de raccourci** :
```css
/* transition: propriété durée fonction-de-timing délai */
transition: all 0.3s ease 0s;

/* transform peut combiner plusieurs transformations */
transform: translateX(10px) rotate(45deg) scale(1.1);
```

#### Que faire face à une propriété inconnue

**Méthode 1 : deviner le mot anglais**

De nombreuses propriétés sont des mots anglais ou des abréviations :
- `margin` = marge
- `padding` = remplissage
- `border` = bordure
- `visibility` = visibilité
- `cursor` = curseur

**Méthode 2 : associer par scénario**

Quand vous voulez réaliser un effet, pensez aux « mots-clés » :

| Je veux... | Propriétés possibles |
|---------|------------|
| Changer la couleur | `color`, `background-color`, `border-color` |
| Changer la taille | `width`, `height`, `font-size` |
| Changer la position | `margin`, `position`, `top/left` |
| Changer l'espacement | `padding`, `margin`, `gap` |
| Cacher un élément | `display: none`, `visibility: hidden`, `opacity: 0` |
| Centrer | `margin: auto`, `text-align: center`, `justify-content: center` |
| Ajouter des coins arrondis | `border-radius` |
| Ajouter une ombre | `box-shadow`, `text-shadow` |
| Ajouter une animation | `transition`, `animation` |

**Méthode 3 : consulter MDN ou demander à l'IA**

[MDN Référence des propriétés CSS](https://developer.mozilla.org/fr/docs/Web/CSS/Reference) contient des explications détaillées pour toutes les propriétés.

> « En CSS, comment faire pour que le texte s'affiche sur une seule ligne et que la partie qui dépasse soit remplacée par des points de suspension ? »

**Méthode 4 : « apprendre en observant » avec les outils de développement**

Vous voyez un effet de page web qui vous plaît :
1. Clic droit → « Inspecter »
2. Sélectionnez l'élément, regardez le panneau Styles
3. Copiez directement les propriétés CSS

#### Pas besoin d'apprendre les propriétés par cœur

**Le véritable flux de travail est le suivant** :

1. Vous savez que vous voulez « centrer » → recherchez « CSS centrer »
2. Copiez le code, ajustez les valeurs
3. À force de l'utiliser, vous le retiendrez

**Parcours d'apprentissage recommandé** :

1. **Maîtrisez d'abord le modèle de boîte** : `width`, `height`, `padding`, `margin`, `border`
2. **Puis maîtrisez Flexbox** : `display: flex`, `justify-content`, `align-items`
3. **Ensuite maîtrisez le positionnement** : `position`, `top/left`, `z-index`
4. **Enfin apprenez les animations** : `transition`, `transform`, `animation`

Pour les autres propriétés, cherchez quand vous en avez besoin, vous les retiendrez naturellement à force de les utiliser.

---

## 4. JavaScript : le cerveau de la page web

### 4.1 Pourquoi a-t-on besoin de JavaScript

Une page web avec seulement HTML + CSS, c'est comme **un mannequin dans une vitrine de magasin** :

- ✅ C'est beau à regarder (CSS)
- ✅ La structure est claire (HTML)
- ❌ Mais si vous lui parlez, il ne répond pas
- ❌ Vous appuyez sur un bouton, rien ne se passe

**JavaScript** transforme la page web de « mannequin de vitrine » en « personne réelle » :

- ✅ Cliquer sur un bouton fait apparaître une notification
- ✅ Saisir du texte vérifie le format en temps réel
- ✅ Défiler la page charge plus de contenu
- ✅ Soumettre un formulaire affiche « Envoi en cours... »

### 4.2 À quoi ressemble le code JavaScript

**Capacité 1 : mémoriser des données** (variables)

```javascript
let userName = 'Zhang San'
let isLoggedIn = true
let cartCount = 5
```

**Capacité 2 : répéter des actions** (fonctions)

```javascript
function sayHello(name) {
  return 'Bonjour, ' + name + ' !'
}

console.log(sayHello('Zhang San'))  // Affiche : Bonjour, Zhang San !
```

**Capacité 3 : répondre aux événements** (écouteurs d'événements)

```javascript
button.addEventListener('click', function() {
  alert('Le bouton a été cliqué !')
})
```

**Capacité 4 : modifier la page** (manipulation du DOM)

```javascript
document.getElementById('title').textContent = 'Nouveau titre'
document.getElementById('box').style.background = 'red'
```

### 4.3 Comment lire du code JavaScript

::: tip 🎯 Lecture obligatoire pour les débutants : méthode de lecture du code JS

**Première étape : trouver les variables — « Qu'est-ce qui est mémorisé ? »**

```javascript
const API_URL = 'https://api.example.com'  // Constante, ne change pas
let count = 0                                // Variable, peut changer
const user = { name: 'Zhang San', age: 25 }  // Objet, plusieurs données
const items = ['Pomme', 'Banane', 'Orange']  // Tableau, données en liste
```

**Deuxième étape : trouver les fonctions — « Que peut-on faire ? »**

```javascript
// Le nom de la fonction permet souvent de deviner son usage
function handleClick() { }      // Gérer le clic
function fetchData() { }        // Récupérer des données
function validateForm() { }     // Valider le formulaire
```

**Troisième étape : trouver les événements — « Quand cela se déclenche-t-il ? »**

```javascript
button.addEventListener('click', handleClick)     // Au clic
input.addEventListener('input', validateForm)     // À la saisie
window.addEventListener('scroll', loadMore)       // Au défilement
```

**Quatrième étape : trouver les manipulations du DOM — « Qu'est-ce qui a été modifié ? »**

```javascript
element.textContent = 'Nouveau contenu'    // Modifier le texte
element.classList.add('active')             // Ajouter une classe de style
element.style.display = 'none'              // Cacher l'élément
parent.appendChild(child)                   // Ajouter un élément
```
:::

### 4.4 DOM : comment JavaScript manipule-t-il la page

Après avoir lu le code HTML, le navigateur ne le traite pas comme un ensemble de chaînes de caractères, mais le dessine en mémoire sous forme d'un « arbre » :

```
Document
    ↓
<html>
    ├─<head>
    │   └─<title>Ma page web</title>
    └─<body>
        ├─<h1>Bienvenue</h1>
        └─<div class="card">
            ├─<img src="photo.jpg">
            └─<p>Un texte</p>
```

Cet arbre s'appelle l'**arbre DOM**. Chaque balise HTML est un « nœud » de cet arbre.

**Comment trouver un nœud ?**

```javascript
// Par ID (le plus rapide, unique)
const element = document.getElementById('header')

// Par sélecteur (le plus utilisé)
const element = document.querySelector('.card h2')    // Trouver le premier
const elements = document.querySelectorAll('button')  // Trouver tous

// Par relation
element.parentNode           // Trouver le nœud parent
element.children             // Trouver les nœuds enfants
element.nextElementSibling   // Trouver le frère suivant
```

**Avertissement de performance** : manipuler le DOM est **coûteux**. Chaque modification du DOM oblige le navigateur à recalculer la mise en page et à redessiner.

```javascript
// ❌ Inefficace : boucle 1000 fois, chaque itération manipule le DOM
for (let i = 0; i < 1000; i++) {
  document.body.appendChild(createDiv())
}

// ✅ Efficace : tout assembler d'abord, insérer en une seule fois
const fragment = document.createDocumentFragment()
for (let i = 0; i < 1000; i++) {
  fragment.appendChild(createDiv())
}
document.body.appendChild(fragment)
```

C'est précisément pourquoi les frameworks modernes comme **Vue / React** sont nés : ils manipulent un « DOM virtuel » en mémoire, calculent les modifications minimales, puis appliquent seulement ces changements au DOM réel.

👇 **Essayez par vous-même** : les méthodes de base de manipulation du DOM :

<DomManipulator />

### 4.5 ECMAScript : l'évolution des versions de JavaScript

**ECMAScript** est le « cahier des charges standard » de JavaScript. Les fabricants de navigateurs implémentent le moteur JavaScript selon ce standard.

#### Motivation : des numéros de version

JavaScript n'est pas figé. Chaque année, de nouvelles fonctionnalités sont ajoutées, des problèmes sont corrigés. Le numéro de version vous indique « quelles fonctionnalités ce navigateur prend en charge ».

#### Aperçu des versions importantes

| Version | Année | Fonctionnalités clés | Problème résolu |
|------|------|----------|----------------|
| **ES5** | 2009 | Mode strict, `forEach`/`map`/`filter` | Standardisation du langage, ajout de méthodes pour les tableaux |
| **ES6/ES2015** | 2015 | `let/const`, fonctions fléchées, `class`, `Promise`, modules | La plus grande mise à jour, point de départ du JS moderne |
| **ES2016** | 2016 | `includes()`, `**` exponentiation | Petite mise à jour |
| **ES2017** | 2017 | `async/await`, `Object.entries()` | Code asynchrone plus lisible |
| **ES2018** | 2018 | `...` opérateur de spread, `Promise.finally()` | Améliorations pour les objets et l'asynchrone |
| **ES2020** | 2020 | Chaînage optionnel `?.`, coalescence nulle `??`, `BigInt` | Accès sécurisé aux propriétés imbriquées |
| **ES2021** | 2021 | `replaceAll()`, assignation logique `??=` | Améliorations pour les chaînes et l'assignation |
| **ES2022** | 2022 | `await` au niveau supérieur, `.at()` pour l'indexation | Chargement asynchrone des modules plus pratique |

#### Les syntaxes ES6+ les plus utilisées

**1. `let` et `const` remplacent `var`**

```javascript
// ❌ Ancienne syntaxe : var a du hoisting, source de bugs
var name = 'Zhang San'
if (true) {
  var name = 'Li Si'  // Écrase le name externe
}
console.log(name)  // 'Li Si', pas le résultat attendu

// ✅ Nouvelle syntaxe : let a une portée de bloc
let name = 'Zhang San'
if (true) {
  let name = 'Li Si'  // N'existe que dans ce if
}
console.log(name)  // 'Zhang San', conforme aux attentes

// ✅ const : ne peut pas être réassigné après déclaration
const PI = 3.14159
PI = 3  // Erreur ! Empêche les modifications accidentelles
```

**2. Fonctions fléchées : une syntaxe plus concise**

```javascript
// ❌ Ancienne syntaxe
const add = function(a, b) {
  return a + b
}

// ✅ Nouvelle syntaxe
const add = (a, b) => a + b

// Le this des fonctions fléchées est lié à la portée englobante
const obj = {
  name: 'Zhang San',
  // ❌ Fonction normale : this pointe vers l'appelant
  oldWay: function() {
    setTimeout(function() {
      console.log(this.name)  // undefined
    }, 100)
  },
  // ✅ Fonction fléchée : this hérite de obj
  newWay: function() {
    setTimeout(() => {
      console.log(this.name)  // 'Zhang San'
    }, 100)
  }
}
```

**3. Destructuration : extraire des données d'objets/tableaux**

```javascript
// Destructuration d'objet
const user = { name: 'Zhang San', age: 25, city: 'Pékin' }
const { name, age } = user  // Extraction directe
console.log(name)  // 'Zhang San'

// Destructuration de tableau
const colors = ['red', 'green', 'blue']
const [first, second] = colors
console.log(first)  // 'red'

// Destructuration dans les paramètres de fonction
function greet({ name, age }) {
  console.log(`${name} a ${age} ans`)
}
greet(user)  // 'Zhang San a 25 ans'
```

**4. Littéraux de gabarit : la concaténation de chaînes sans douleur**

```javascript
// ❌ Ancienne syntaxe : plein de guillemets et de signes plus
const msg = 'L\'utilisateur ' + name + ' a ' + age + ' ans'

// ✅ Nouvelle syntaxe : backticks + ${}
const msg = `L'utilisateur ${name} a ${age} ans`

// Prend également en charge le multiligne
const html = `
  <div class="card">
    <h2>${name}</h2>
    <p>Âge : ${age}</p>
  </div>
`
```

**5. `async/await` : écrire du code asynchrone comme du code synchrone**

```javascript
// ❌ Callback hell (enfer des callbacks)
fetchUser(function(user) {
  fetchOrders(user.id, function(orders) {
    fetchDetails(orders[0].id, function(details) {
      console.log(details)
    })
  })
})

// ✅ async/await
async function getUserData() {
  const user = await fetchUser()
  const orders = await fetchOrders(user.id)
  const details = await fetchDetails(orders[0].id)
  console.log(details)
}
```

**6. Chaînage optionnel `?.` et coalescence nulle `??`**

```javascript
const user = {
  name: 'Zhang San',
  address: {
    city: 'Pékin'
  }
}

// ❌ Ancienne syntaxe : vérifications en cascade
const street = user && user.address && user.address.street
const streetName = street !== undefined ? street : 'Inconnu'

// ✅ Nouvelle syntaxe : chaînage optionnel + coalescence nulle
const streetName = user?.address?.street ?? 'Inconnu'
```

::: tip 💡 Comment savoir quelles fonctionnalités sont supportées par le navigateur ?

1. **Consulter les tables de compatibilité** : [caniuse.com](https://caniuse.com/) saisissez le nom de la fonctionnalité
2. **Utiliser des outils de build** : Babel peut transformer la nouvelle syntaxe en code compatible avec les anciens navigateurs
3. **Regarder le public cible** : si vous ne supportez que les navigateurs modernes, la plupart des fonctionnalités ES6+ peuvent être utilisées directement
:::

### 4.6 TypeScript : ajouter des contraintes de type à JavaScript

#### Motivation : a-t-on besoin de TypeScript

**Scénario 1 : type des paramètres de fonction incertain**

```javascript
// JavaScript
function calculateTotal(price, quantity) {
  return price * quantity
}

calculateTotal(100, 5)      // 500 ✅
calculateTotal('100', 5)    // '1005' ❌ Concaténation de chaînes, pas une multiplication
calculateTotal(100, '5')    // 500 ✅ Mais c'est un coup de chance
```

JavaScript ne vous dit pas que le type du paramètre est incorrect, vous ne découvrez le problème qu'à l'exécution.

**Scénario 2 : faute de frappe dans le nom d'une propriété d'objet**

```javascript
// JavaScript
const user = {
  name: 'Zhang San',
  age: 25
}

console.log(user.nmae)  // undefined, faute de frappe mais pas d'erreur
```

**TypeScript résout ces problèmes** :

```typescript
// TypeScript
interface User {
  name: string
  age: number
}

function greet(user: User) {
  console.log(`Bonjour, ${user.name}`)
  console.log(user.nmae)  // ❌ Erreur à la compilation : la propriété 'nmae' n'existe pas
}

greet({ name: 'Zhang San', age: 25 })        // ✅
greet({ name: 'Zhang San', age: '25' })      // ❌ Erreur à la compilation : age doit être un number
greet({ name: 'Zhang San' })                 // ❌ Erreur à la compilation : age est manquant
```

#### Les concepts fondamentaux de TypeScript

**1. Types de base**

```typescript
let name: string = 'Zhang San'
let age: number = 25
let isActive: boolean = true
let anyValue: any = 'Peut être de n\'importe quel type'  // Déconseillé, perd l'intérêt du contrôle de type
```

**2. Interface : définir la structure d'un objet**

```typescript
interface Product {
  id: number
  name: string
  price: number
  discount?: number  // Propriété optionnelle
  readonly createdAt: Date  // Propriété en lecture seule
}

const product: Product = {
  id: 1,
  name: 'iPhone 15',
  price: 6999,
  createdAt: new Date()
}
```

**3. Alias de type (Type)**

```typescript
type ID = string | number  // Type union
type Status = 'pending' | 'approved' | 'rejected'  // Type littéral

function updateStatus(id: ID, status: Status) {
  // ...
}

updateStatus(1, 'approved')      // ✅
updateStatus('abc', 'pending')   // ✅
updateStatus(1, 'processing')    // ❌ 'processing' n'est pas un Status valide
```

**4. Génériques : des types réutilisables**

```typescript
// Sans générique : écrire une fonction pour chaque type
function getFirstNumber(arr: number[]): number {
  return arr[0]
}
function getFirstString(arr: string[]): string {
  return arr[0]
}

// Avec générique : une seule fonction pour tout
function getFirst<T>(arr: T[]): T {
  return arr[0]
}

getFirst([1, 2, 3])        // Retourne un number
getFirst(['a', 'b', 'c'])  // Retourne un string
```

#### Comparaison TypeScript vs JavaScript

| Caractéristique | JavaScript | TypeScript |
|------|------------|------------|
| Vérification de type | Erreurs découvertes à l'exécution | Erreurs découvertes à la compilation |
| Support IDE | Suggestions de base | Autocomplétion intelligente, refactoring, aller à la définition |
| Courbe d'apprentissage | Simple | Nécessite d'apprendre le système de types |
| Cas d'usage | Petits projets, prototypes | Grands projets, travail en équipe |
| Mode d'exécution | Exécuté directement par le navigateur | Doit être compilé en JavaScript |

#### TypeScript en développement réel

```typescript
// Définition du type de réponse API
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface User {
  id: number
  name: string
  email: string
}

// Requête API avec types
async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// À l'utilisation, l'IDE suggère toutes les propriétés
fetchUser(1).then(res => {
  console.log(res.data.name)   // ✅ L'IDE autocomplète
  console.log(res.data.nmae)   // ❌ Erreur à la compilation
})
```

::: tip 💡 Conseils pour les débutants

1. **Maîtrisez d'abord JavaScript** : TypeScript est un sur-ensemble de JS, apprendre TS sans connaître JS est très pénible
2. **Pas obligatoire pour les petits projets** : les définitions de type augmentent la quantité de code, un projet simple devient plus complexe
3. **Transitionnez depuis JSDoc** : écrivez des commentaires `/** @type {User} */` dans les fichiers JS pour expérimenter les suggestions de type
4. **`any` est un compromis, pas une solution** : face à un problème de type, essayez d'abord de le résoudre, n'utilisez pas directement `any`
:::

### 4.7 La chaîne d'outils moderne de développement JavaScript

::: tip 🎯 Pourquoi a-t-on besoin d'une chaîne d'outils ?

Le navigateur ne connaît que HTML/CSS/JS. Mais en développement moderne, nous utilisons :

- **TypeScript** : le navigateur ne le connaît pas, il doit être compilé en JS
- **SCSS/Less** : le navigateur ne les connaît pas, ils doivent être compilés en CSS
- **Modularisation** : `import/export` doit être empaqueté en un seul fichier
- **Nouvelle syntaxe** : ES6+ doit être transpilé en code compatible avec les anciens navigateurs

La chaîne d'outils transforme ce « code de développement » en « code exécutable par le navigateur ».
:::

**Outils essentiels** :

| Outil | Rôle | Analogie |
|------|------|------|
| **Node.js** | Environnement d'exécution JavaScript | Permet à JS de s'exécuter en dehors du navigateur |
| **npm/yarn/pnpm** | Gestionnaire de paquets | Télécharger des bibliothèques écrites par d'autres |
| **Vite/Webpack** | Outil de build | Empaqueter le code source en code exécutable par le navigateur |
| **Babel** | Compilateur | Transformer la nouvelle syntaxe en ancienne syntaxe |
| **ESLint** | Vérificateur de code | Détecter les problèmes de code et les incohérences de style |

**Un flux de développement typique** :

```bash
# 1. Initialiser le projet
npm create vite@latest my-app -- --template vue-ts

# 2. Installer les dépendances
cd my-app
npm install

# 3. Mode développement (rechargement à chaud)
npm run dev

# 4. Construire la version de production
npm run build
```

---

## 5. La collaboration entre les trois

### 5.1 Comparaison des rôles

| Rôle | Responsable de | Ne fait pas | Exemple typique |
|------|----------|----------|----------|
| **HTML** | Définit la structure et la sémantique | Ne gère pas le style/l'interaction | `<section><h1>Titre</h1></section>` |
| **CSS** | Contrôle l'apparence et la mise en page | Ne gère pas la logique/les données | `.card { background: white; }` |
| **JavaScript** | Gère l'interaction et la logique | Ne définit pas la structure | `button.onclick = () => alert()` |

### 5.2 Un exemple complet de collaboration

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* CSS : rend la carte jolie */
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      max-width: 300px;
    }
    .card button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <!-- HTML : définit la structure de la carte -->
  <div class="card">
    <h2 id="title">Cliquez sur le bouton</h2>
    <button id="btn">Cliquez-moi</button>
  </div>

  <script>
    // JavaScript : rend le bouton cliquable
    const btn = document.getElementById('btn')
    const title = document.getElementById('title')

    btn.addEventListener('click', function() {
      title.textContent = 'Cliqué !'
      alert('Le titre a été modifié')
    })
  </script>
</body>
</html>
```

---

## 6. Que faire face à du code inconnu

### 6.1 Demander à l'IA

> « Que signifie la balise `<aside>` en HTML ? Quand l'utiliser ? »
>
> « Quel est l'effet de `position: sticky` en CSS ? »

### 6.2 Consulter MDN

[MDN Web Docs](https://developer.mozilla.org/fr/) est la documentation la plus fiable pour les technologies web. Face à une balise, une propriété ou une méthode inconnue, une recherche suffit.

### 6.3 Les outils de développement du navigateur

1. Clic droit sur un élément de la page → « Inspecter »
2. Dans le panneau **Elements**, voir la structure HTML
3. Dans le panneau **Styles**, voir les styles CSS
4. Dans le panneau **Console**, exécuter du code JS

### 6.4 Référence rapide des propriétés CSS courantes

| Vous voyez ceci | Cela signifie |
|----------|------------|
| `display: flex` | Active la mise en page flexible |
| `position: absolute` | Positionnement absolu |
| `z-index: 100` | Niveau de profondeur, le plus grand est au-dessus |
| `overflow: hidden` | La partie qui dépasse est cachée |
| `cursor: pointer` | Le curseur devient une main |
| `transition: all 0.3s` | Effet de transition animée |
| `box-sizing: border-box` | Fait en sorte que width inclue padding et border |

---

## 7. Table de référence rapide des termes

| Terme | Anglais | Explication en langage simple |
|------|------|------------|
| **HTML** | HyperText Markup Language | Langage de balisage hypertexte, décrit la structure de la page avec des balises |
| **CSS** | Cascading Style Sheets | Feuilles de style en cascade, contrôle les couleurs, la mise en page, les animations |
| **JavaScript** | JavaScript | Langage de programmation de la page web, responsable de l'interaction et de la logique |
| **DOM** | Document Object Model | Modèle d'objet de document, représente la page comme un arbre d'objets |
| **Flexbox** | Flexible Box Layout | Un schéma de mise en page unidimensionnelle, facile pour l'alignement et la distribution |
| **Modèle de boîte** | CSS Box Model | L'élément est une boîte composée de couches allant du contenu à la marge extérieure |
| **SCSS** | Sassy CSS | Préprocesseur CSS, supporte les variables, l'imbrication, les mixins |
| **TypeScript** | TypeScript | Sur-ensemble de JavaScript, ajoute un système de types |
| **ES6** | ECMAScript 2015 | Une version importante de JavaScript, a ajouté de nombreuses syntaxes |
| **Sémantique** | Semantic HTML | Utiliser des balises porteuses de sens (comme header) plutôt que div |
| **Responsive** | Responsive Design | Conception qui adapte automatiquement la page aux différentes tailles d'écran |

---

## Résumé

Maintenant vous savez que : **HTML définit le squelette, CSS s'occupe de l'apparence, JavaScript donne l'âme**.

Ces trois piliers sont les fondations du développement web. En les comprenant, vous pouvez :

- Lire le code source de n'importe quelle page web (clic droit → « Voir le code source de la page »)
- Modifier la page web de quelqu'un d'autre (Outils de développement du navigateur → Elements)
- Commencer à apprendre les frameworks frontend (Vue/React), qui sont tous basés sur ces trois piliers

**Suggestions pour la suite** :

- Si vous voulez créer rapidement des pages web, apprenez le framework **Vue** ou **React**
- Si vous voulez approfondir le CSS, apprenez les mises en page **Flexbox** et **Grid**
- Si vous voulez améliorer la qualité de votre code, apprenez **TypeScript**