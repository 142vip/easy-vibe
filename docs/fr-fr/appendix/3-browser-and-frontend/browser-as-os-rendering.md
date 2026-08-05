# Principes : Pipeline de rendu du navigateur
::: tip 🎯 Question centrale
**Pourquoi certaines pages web sont-elles fluides comme de la soie, tandis que d'autres rament comme un diaporama ?** Comment le navigateur transforme-t-il un tas de code HTML, CSS et JavaScript en la page web que vous voyez ? Ce chapitre vous emmène dans les coulisses du navigateur pour comprendre son fonctionnement et ainsi écrire des pages web plus performantes.
:::

**Que va vous apprendre cet article ?**

| Chapitre | Contenu | Ce que vous saurez faire après |
|-----|------|-----------|
| **Chapitre 1** | Pourquoi comprendre le pipeline de rendu | Comprendre la nécessité de l'optimisation des performances |
| **Chapitre 2** | Les cinq étapes du pipeline de rendu | Maîtriser le flux de rendu de base du navigateur |
| **Chapitre 3** | Construction de l'arbre DOM et du CSSOM | Comprendre comment le HTML et le CSS sont analysés |
| **Chapitre 4** | Construction de l'arbre de rendu | Savoir quels éléments seront rendus |
| **Chapitre 5** | Layout et Reflow | Éviter de déclencher des calculs de mise en page coûteux |
| **Chapitre 6** | Paint et Repaint | Réduire les opérations de peinture inutiles |
| **Chapitre 7** | Composition et accélération GPU | Exploiter le GPU pour améliorer les performances d'animation |
| **Chapitre 8** | Boucle d'événements | Comprendre le mécanisme d'exécution de JavaScript |
| **Chapitre 9** | Optimisation des performances en pratique | Maîtriser les techniques courantes d'optimisation |

Chaque chapitre commence par « comprendre le principe » — pas besoin de savoir écrire du code d'optimisation à la main. Revenez consulter quand vous rencontrez des problèmes de performance.

---

## 1. Motivation et justification : comprendre le « pipeline de rendu »

### 1.1 De « ça marche » à « ça marche vite » : la progression du développeur frontend

Quand on débute en frontend, on se demande seulement si le code « fonctionne » — la page s'affiche, le bouton est cliquable, c'est réussi. Mais à mesure que le projet grandit et que les utilisateurs se multiplient, vous découvrez vite une réalité cruelle : **pour la même fonctionnalité, certains développeurs produisent une page d'une fluidité parfaite, tandis que d'autres créent une page tellement saccadée que les utilisateurs veulent jeter leur souris.**

C'est comme apprendre à conduire. Le débutant se demande seulement si « la voiture peut avancer », mais le conducteur expérimenté se demande « quand changer de vitesse, quand freiner, comment conduire de façon économique ». Le navigateur est votre « voiture » — comprenez son « comportement » pour rouler vite et en douceur.

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🐢 Mentalité débutant (centré sur la fonctionnalité)**
- Tant que la page s'affiche, c'est bon
- Les saccades, c'est la faute du navigateur
- L'optimisation, c'est pour plus tard

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 Mentalité avancé (centré sur l'expérience)**
- La fluidité est au cœur de l'expérience utilisateur
- Comprendre le fonctionnement interne du navigateur
- Penser aux performances dès l'écriture du code

</div>
</div>

**Comprendre le pipeline de rendu, c'est l'étape clé pour passer de « ça marche » à « ça marche vite ».**

### 1.2 Une histoire vraie : pourquoi l'« optimisation » a rendu la page encore plus lente

::: warning La mésaventure de performance de Xiao Zhang
Xiao Zhang est développeur frontend dans une entreprise d'e-commerce. Il doit optimiser la page de détail produit. Cette page rame tellement à l'affichage des informations produit que les utilisateurs se plaignent sans arrêt.

Xiao Zhang se dit : « La page rame parce qu'il y a trop d'éléments DOM. Je vais d'abord cacher les éléments avec `display:none`, les modifier, puis les réafficher — comme ça le navigateur ne refera pas le rendu à chaque fois, non ? »

Il écrit alors ce code :

```javascript
// Ce que vous croyez être une « optimisation »
const container = document.getElementById('list')
container.style.display = 'none'  // Je cache d'abord, ça ne devrait pas déclencher de rendu ?

for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'  // Largeur aléatoire
  container.appendChild(item)
}

container.style.display = 'block'  // J'affiche à la fin, un seul rendu
```

Résultat : après test, la page est **encore plus lente** ! Xiao Zhang est abasourdi : il a pourtant « optimisé », pourquoi est-ce pire ?

Plus tard, le lead frontend regarde le code et pointe le problème : **même si les éléments sont cachés, chaque modification de `style.width` déclenche quand même le calcul de style et le marquage de layout ; le navigateur fait un travail énorme et inutile en arrière-plan.**

La bonne approche est d'utiliser `DocumentFragment` pour tout faire en mémoire, puis d'insérer en une seule fois dans le DOM — un seul déclenchement de rendu.
:::

::: info 💡 Leçon clé
Sans comprendre le fonctionnement du navigateur, vous risquez d'écrire du code « optimisé » qui, en réalité, dégrade les performances. **Comprendre le pipeline de rendu vous permet de savoir quelles opérations sont coûteuses et lesquelles sont bon marché, pour éviter de faire des efforts au mauvais endroit.**
:::

---

## 2. Concept fondamental : qu'est-ce que le « pipeline de rendu »

::: tip 🤔 Qu'est-ce que le « rendu » ?
Le **rendu (Rendering)** , c'est tout simplement le processus par lequel le navigateur « dessine » le code pour en faire la page web que vous voyez.

Imaginez une **imprimerie qui fabrique un livre** :
- **HTML** = le contenu du manuscrit (texte, images, chapitres)
- **CSS** = les exigences de mise en page (taille de police, couleurs, espacement)
- **JavaScript** = les modifications dynamiques (l'auteur modifie le manuscrit, ajuste la mise en page)

Le navigateur reçoit ces « matériaux », les passe par une série d'« étapes », et enfin « imprime » la page web que vous voyez. Cette série d'étapes, c'est le **pipeline de rendu (Rendering Pipeline)** .
:::

Pour vous aider à mieux comprendre, utilisons une **boulangerie** comme métaphore du processus de rendu du navigateur.

### 2.1 Comprendre le pipeline de rendu avec la métaphore de la boulangerie

Imaginez que vous gérez une boulangerie et que chaque jour vous devez préparer différents pains pour vos clients. Les étapes de ce processus ressemblent étonnamment au pipeline de rendu du navigateur :

| Étape | 🥖 Métaphore de la boulangerie | Travail réel du navigateur | Exemple concret |
|------|-------------|--------------|----------|
| **1. Préparer les ingrédients** | Organiser la liste des ingrédients (farine, œufs, crème...) | **Construire l'arbre DOM** : analyser le HTML en une structure arborescente | Vous écrivez `<div><p>Hello</p></div>`, le navigateur l'analyse en arbre `div→p→"Hello"` |
| **2. Préparer les recettes** | Organiser les fiches recettes (proportions pour chaque pain) | **Construire le CSSOM** : analyser le CSS en un arbre de règles | Vous écrivez `.title { color: red }`, le navigateur enregistre « le texte de `.title` est rouge » |
| **3. Établir le plan** | Décider quels pains faire aujourd'hui selon les ingrédients et recettes | **Construire l'arbre de rendu** : fusionner DOM et CSSOM, ne garder que les éléments visibles | La balise `<script>` ne s'affiche pas, donc absente de l'arbre de rendu |
| **4. Disposer les pains** | Placer les pains dans la vitrine, décider où mettre chaque pain | **Layout (mise en page)** : calculer la taille et la position de chaque élément | Calculer « ce div fait 200px de large, 100px de haut, à la position (50, 50) de l'écran » |
| **5. Décorer** | Badigeonner d'œuf, saupoudrer de sésame, ajouter de la crème | **Paint (peinture)** : « peindre » les couleurs, bordures, ombres des éléments | Dessiner effectivement le « texte rouge » à l'écran |
| **6. Assembler** | Superposer et disposer joliment tous les pains | **Composite (composition)** : fusionner plusieurs couches en une image finale | Le GPU fusionne la couche de fond, la couche de texte, la couche d'image en une seule image |

::: tip 📊 Que pouvez-vous tirer de ce tableau ?
Parcourons ce tableau ligne par ligne pour comprendre chaque étape du pipeline de rendu :

**Étapes 1-2 (phase de préparation)** : le navigateur « comprend » d'abord votre code. Le HTML et le CSS sont analysés séparément car ils ont des rôles différents — le HTML définit « quel contenu », le CSS définit « à quoi ça ressemble ».

**Étape 3 (phase de fusion)** : pourquoi « fusionner » ? Parce que tous les éléments HTML ne sont pas affichés (par exemple `<head>`, `<script>`). Le navigateur doit combiner les « éléments visibles » avec « leurs styles » pour former un « plan de construction ».

**Étapes 4-5 (phase de dessin)** : le layout « calcule les positions », le paint « applique les couleurs ». Un changement de layout (comme modifier la largeur) entraîne un repaint, mais un changement de paint (comme modifier la couleur) n'entraîne pas de layout.

**Étape 6 (phase de composition)** : la « magie » des navigateurs modernes. L'approche traditionnelle est de « tout dessiner d'un coup » (CPU, lent), l'approche moderne est de « dessiner par couches + composer sur GPU » (rapide). C'est pourquoi une animation avec `transform` est plus fluide qu'avec `width`.
:::

### 2.2 Les cinq étapes du pipeline de rendu

<RenderingPipelineDemo />

---

## 3. Première étape : construire l'arbre DOM et le CSSOM

### 3.1 Pourquoi « arbrifier »

::: tip 🤔 Qu'est-ce que le DOM ?
Le **DOM (Document Object Model, modèle d'objet de document)** est une structure arborescente que le navigateur crée à partir du document HTML, pour permettre à JavaScript de manipuler facilement les éléments de la page.

Imaginez un **arbre généalogique** :
- Tout en haut, l'« ancêtre » (`<html>`)
- En dessous, les « enfants » (`<body>`, `<head>`)
- Encore en dessous, les « petits-enfants » (`<div>`, `<p>`, `<span>`)

**Pourquoi le transformer en arbre ?** Parce qu'une structure arborescente facilite la « recherche » et la « modification ». Par exemple, pour trouver « tous les éléments avec la classe `title` », le navigateur peut chercher rapidement dans l'arbre au lieu de fouiller lentement dans un tas de texte désordonné.
:::

Quand le navigateur reçoit le HTML, il ne l'affiche pas immédiatement — il doit d'abord le « comprendre ». Ce processus se déroule en trois étapes :

**Première étape : analyse lexicale — découper le code en « mots »**

```html
<div class="container">
  <p>Hello World</p>
</div>
```

Le navigateur voit ce code et le « découpe » d'abord :
- `<div>` → « balise ouvrante div »
- `class="container"` → « attribut class, valeur container »
- `<p>` → « balise ouvrante p »
- `Hello World` → « contenu texte »
- `</p>` → « balise fermante p »
- `</div>` → « balise fermante div »

**Deuxième étape : analyse syntaxique — assembler les « mots » en « nœuds »**

Le navigateur assemble ces « mots » en « nœuds » selon les règles HTML :
- Nœud élément : `<div>`, `<p>`
- Nœud attribut : `class="container"`
- Nœud texte : `"Hello World"`

**Troisième étape : construire l'arbre — établir les relations parent-enfant**

Enfin, le navigateur construit la structure arborescente selon les imbrications des balises :

```
Document (nœud racine du document)
└── html
    └── body
        └── div.class = "container"
            └── p
                └── "Hello World"
```

### 3.2 Le CSSOM : le « manuel des règles » de style

::: tip 🤔 Qu'est-ce que le CSSOM ?
Le **CSSOM (CSS Object Model, modèle d'objet CSS)** est une structure arborescente que le navigateur crée à partir des règles CSS, utilisée pour calculer le style final de chaque élément.

Imaginez un **guide d'assemblage vestimentaire** :
- Les règles du niveau supérieur (la police de body) affectent les niveaux inférieurs (tous les éléments enfants)
- En cas de conflit (plusieurs règles spécifient des couleurs différentes pour le même élément), la « priorité » détermine laquelle s'applique
- Au final, on calcule quels « vêtements » chaque élément doit porter
:::

La construction du CSSOM est similaire à celle du DOM, avec une différence clé : **le CSS est « hérité » et « en cascade »** .

::: details Voir le processus de construction du CSSOM
**CSS original :**
```css
body {
  font-size: 16px;
  color: #333;
}

.container {
  width: 100%;
  color: red;  /* remplace la couleur de body */
}

.container p {
  font-weight: bold;
}
```

**Arbre CSSOM construit :**
```
StyleSheet
├── body
│   ├── font-size: 16px
│   └── color: #333
└── .container
    ├── width: 100%
    ├── color: red  (priorité plus élevée, remplace la couleur de body)
    └── p
        └── font-weight: bold
```
:::

### 3.3 Pièges courants : pourquoi mon CSS ne « s'applique pas »

**Piège n°1 : conflit de spécificité des sélecteurs CSS**

::: details Voir l'erreur courante
```css
/* Votre CSS */
#header { color: red; }      /* sélecteur id, spécificité 100 */
.title { color: blue; }     /* sélecteur class, spécificité 10 */

/* HTML */
<div id="header" class="title">De quelle couleur est ce texte ?</div>
```

Vous pensez que c'est bleu, mais c'est **rouge**. Parce que la spécificité du sélecteur id (100) est supérieure à celle du sélecteur class (10).
:::

**Piège n°2 : balises HTML non fermées, le navigateur « corrige automatiquement »**

::: details Voir comment le navigateur corrige le HTML erroné
```html
<!-- Votre HTML -->
<div>
  <p>Ceci est un texte
</div>

<!-- Après correction par le navigateur -->
<div>
  <p>Ceci est un texte</p>  <!-- Le navigateur ferme automatiquement la balise -->
</div>
```

Le navigateur est « indulgent » et corrige automatiquement vos erreurs. Mais cette indulgence a un coût — le navigateur doit faire des calculs supplémentaires pour deviner votre intention, ce qui **impacte les performances**.
:::

<DomToRenderTreeDemo />

---

## 4. Deuxième étape : construire l'arbre de rendu

### 4.1 Pourquoi a-t-on besoin de l'« arbre de rendu »

Vous vous demandez peut-être : **« On a déjà l'arbre DOM et le CSSOM, pourquoi construire encore un arbre de rendu ? On ne peut pas utiliser directement le DOM ? »**

La réponse est : **l'arbre DOM contient trop d'informations « inutiles »** .

Par exemple, ce HTML :

```html
<html>
<head>
  <title>Titre de la page</title>
  <style>/* Code CSS */</style>
  <script>/* Code JavaScript */</script>
</head>
<body>
  <div class="container">
    <p>Contenu visible</p>
  </div>
  <div style="display: none">
    <p>Contenu caché (display:none)</p>
  </div>
</body>
</html>
```

**L'arbre DOM contient tous les éléments** :
- `<head>`, `<title>`, `<style>`, `<script>` (qui ne s'affichent pas)
- Le div avec `display: none` (qui ne s'affiche pas non plus)

Mais **l'arbre de rendu ne contient que les éléments « à dessiner à l'écran »** :
- Supprime `<head>` et ses enfants
- Supprime le div avec `display: none`

### 4.2 Règles de construction de l'arbre de rendu

Lors de la construction de l'arbre de rendu, le navigateur suit un ensemble de règles :

| Scénario | Traitement | Exemple | Impact sur les performances |
|------|---------|------|----------|
| `display: none` | **Complètement exclu** de l'arbre de rendu | L'élément et ses enfants sont invisibles | ✅ Réduit la charge de rendu |
| `visibility: hidden` | **Inclus dans l'arbre de rendu**, mais non peint | Occupe l'espace, mais totalement transparent | ⚠️ Nécessite quand même le calcul de layout |
| `opacity: 0` | **Inclus dans l'arbre de rendu**, mais transparent | Interactif (cliquable), mais invisible | ⚠️ Nécessite quand même le calcul de layout |
| Hors de la fenêtre d'affichage | **Inclus dans l'arbre de rendu**, pas encore peint | Peint seulement lors du défilement dans la vue | ⚠️ Mais toujours dans l'arbre de rendu |

::: tip 📊 Que pouvez-vous tirer de ce tableau ?
**Constat clé** : `display: none` est la seule méthode de masquage qui « économise vraiment des performances », car l'élément est totalement absent de l'arbre de rendu — le navigateur ne fait aucun calcul de layout ni de peinture pour lui.

En revanche, `visibility: hidden` et `opacity: 0`, bien qu'« invisibles », restent dans l'arbre de rendu — le navigateur doit quand même calculer leur layout (ils occupent de l'espace). Si vous devez « masquer sans affecter le layout » (par exemple pour une animation de fondu), utilisez `opacity` ; si vous devez « masquer complètement sans occuper d'espace », utilisez `display: none`.
:::

### 4.3 Pièges courants : pourquoi ma page rame-t-elle encore malgré display:none

::: danger ❌ Idée reçue : croire que les éléments en display:none « n'existent pas »
Beaucoup pensent qu'avec `display: none`, l'élément « disparaît » et qu'aucune opération dessus n'affecte les performances. C'est **faux** !

Même si l'élément en `display: none` n'est pas dans l'arbre de rendu, quand vous modifiez ses propriétés via JavaScript, le navigateur doit quand même :
1. **Recalculer les styles** (faire correspondre les règles CSS)
2. **Suivre les changements** (se préparer à un affichage futur)

Voici un exemple d'« optimisation » erronée :
:::

::: details Voir le code de la « fausse optimisation »
```javascript
// ❌ Ce que vous croyez être une « optimisation » : cacher, modifier, réafficher
const container = document.getElementById('list')
container.style.display = 'none'

// Manipulation intensive du DOM
for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'  // Modifie la largeur !
  item.textContent = `Item ${i}`
  container.appendChild(item)
}

container.style.display = 'block'

// Problème : chaque modification de style.width oblige le navigateur à recalculer les styles,
// même si l'élément est en display:none !
```

**✅ La bonne approche d'optimisation :**
```javascript
// Utiliser DocumentFragment pour les opérations par lots
const container = document.getElementById('list')
const fragment = document.createDocumentFragment()  // Conteneur virtuel

// Toutes les opérations se font sur le fragment en mémoire
for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'
  item.textContent = `Item ${i}`
  fragment.appendChild(item)  // N'affecte pas le DOM réel
}

// Une seule insertion dans le DOM réel, un seul déclenchement de rendu
container.appendChild(fragment)
```
:::

---

## 5. Troisième étape : layout et reflow

### 5.1 Qu'est-ce que le « layout »

::: tip 🤔 Qu'est-ce que le layout ?
Le **layout**, aussi appelé **reflow**, est le processus par lequel le navigateur calcule « à quelle position et quelle taille » chaque élément de l'arbre de rendu doit apparaître.

Imaginez un **architecte d'intérieur qui mesure une pièce** :
- Il mesure d'abord la longueur et la largeur de chaque pièce
- Il décide où placer les meubles
- Il calcule les coordonnées de chaque meuble

**Pourquoi le layout est-il « coûteux » ?** Parce que le changement d'un élément peut affecter les autres. Par exemple, si vous élargissez un div, le div d'à côté peut être poussé vers le bas, obligeant toute la page à se recalculer.
:::

### 5.2 Les « mines » qui déclenchent un reflow

Voici les opérations courantes qui déclenchent un reflow, **à collectionner et à mémoriser** :

| Catégorie | Propriété/Opération | Impact performances | Alternative |
|------|----------|----------|----------|
| **Dimensions** | `width`, `height`, `min/max-width/height` | 💀💀💀 | Utiliser `transform: scale()` |
| **Position** | `top`, `right`, `bottom`, `left` | 💀💀💀 | Utiliser `transform: translate()` |
| **Marges** | `margin`, `padding` | 💀💀 | Utiliser `transform` ou `gap` |
| **Bordures** | `border-width` | 💀💀 | Éviter les modifications fréquentes |
| **Contenu** | Changement de texte, chargement d'image | 💀💀 | Réserver l'espace, éviter le layout shift |
| **Police** | `font-size`, `line-height` | 💀💀💀 | Éviter les modifications fréquentes |
| **Affichage** | Changement de `display` | 💀💀💀 | Utiliser `visibility` ou `opacity` (si la disparition complète n'est pas nécessaire) |
| **Requête** | `offsetWidth`, `offsetHeight`, etc. | 💀💀💀💀💀 | **Lire par lots, éviter le layout thrashing** |

::: tip 📊 Que pouvez-vous tirer de ce tableau ?
**Constat clé** :
1. **Les propriétés géométriques (largeur, hauteur, position) sont les plus coûteuses** : elles déclenchent un calcul complet de layout
2. **Les propriétés de requête sont plus dangereuses que les modifications** : lire `offsetWidth` force un **layout synchrone** (voir section 5.4)
3. **transform et opacity sont les plus performantes** : elles ne déclenchent pas de reflow, seulement la composition
:::

### 5.3 Pièges courants : pourquoi mon animation rame comme un diaporama

**Piège : animer avec width**

::: details Voir le code d'animation peu performant
```css
/* ❌ Mauvaise animation : déclenche un reflow */
.box {
  width: 100px;
  transition: width 0.3s;
}

.box:hover {
  width: 200px;  /* Changer la largeur déclenche un reflow ! */
}
```

Chaque image de l'animation déclenche un reflow, le navigateur doit :
1. Recalculer la largeur
2. Recalculer la position (peut affecter d'autres éléments)
3. Repeindre

**✅ Bonne animation : utiliser transform**
```css
/* ✅ Bonne animation : ne déclenche que la composition */
.box {
  width: 100px;
  transform: scaleX(1);
  transition: transform 0.3s;
}

.box:hover {
  transform: scaleX(2);  /* Le scale ne déclenche pas de reflow ! */
}
```

`transform` est géré directement par le GPU, ne déclenche ni reflow ni repaint — l'animation est fluide comme de la soie.
:::

### 5.4 Tueur de performances : le layout synchrone forcé

::: danger 💀 Le problème de performance le plus dangereux : le layout thrashing
Le **layout synchrone forcé (Forced Synchronous Layout)** , aussi appelé **layout thrashing**, est le problème de performance le plus courant et le plus grave.

Sa cause : **quand JavaScript lit une propriété de layout (comme `offsetWidth`), le navigateur doit exécuter immédiatement le calcul de layout pour retourner une valeur exacte.**

Si vous alternez lecture et écriture, le navigateur est obligé de faire « layout → lire → layout → lire » en boucle, créant un cercle vicieux.
:::

::: details Voir le code de layout thrashing
```javascript
// ❌ Très mauvais : alternance lecture/écriture, provoque du layout thrashing
const elements = document.querySelectorAll('.item')

for (let i = 0; i < elements.length; i++) {
  const height = elements[i].offsetHeight  // Lecture → force le layout
  elements[i].style.width = (height * 2) + 'px'  // Écriture → marque pour reflow
  // La lecture de la prochaine itération force à nouveau le layout... cercle vicieux !
}

// Avec 100 éléments, cela déclenche 100 calculs de layout !
```

**✅ La bonne approche d'optimisation : séparer lecture et écriture**
```javascript
const elements = document.querySelectorAll('.item')

// Étape 1 : lecture par lots (tout lire d'abord)
const heights = []
for (let i = 0; i < elements.length; i++) {
  heights.push(elements[i].offsetHeight)  // Un seul déclenchement de layout
}

// Étape 2 : écriture par lots (tout écrire ensuite)
requestAnimationFrame(() => {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.width = (heights[i] * 2) + 'px'  // Un seul déclenchement de reflow
  }
})
```
:::

<LayoutReflowDemo />

---

## 6. Quatrième étape : paint et repaint

### 6.1 Qu'est-ce que le « paint »

::: tip 🤔 Qu'est-ce que le paint ?
Le **paint (peinture)** est le processus par lequel le navigateur « dessine » réellement à l'écran les éléments dont le layout a été calculé.

Imaginez **peindre une pièce** :
- Étape de layout = prendre les mesures, tracer les lignes
- Étape de paint = vraiment peindre, poser le papier peint

**Le paint est moins coûteux que le layout, mais pas gratuit.** Des peintures fréquentes affectent quand même les performances, surtout pour les éléments complexes (ombres, dégradés, etc.).
:::

### 6.2 Signaux qui déclenchent un repaint

Contrairement au reflow, le repaint ne concerne que les changements d'« apparence », pas de « géométrie » :

| Catégorie | Propriété | Impact performances | Remarque |
|------|------|----------|------|
| **Couleur** | `color`, `background-color` | 💀 | Le déclencheur de repaint le plus courant |
| **Fond** | `background-image`, `background-position` | 💀💀 | Les images sont plus lentes que les couleurs unies |
| **Bordure** | `border-color`, `border-style` | 💀 | Changer la couleur ou le style de bordure |
| **Texte** | `text-decoration`, `text-shadow` | 💀💀 | L'ombre est plus lente que le texte simple |
| **Ombre de boîte** | `box-shadow` | 💀💀💀 | Les ombres complexes sont très lentes |
| **Arrondi** | `border-radius` | 💀 | Changer la taille de l'arrondi |
| **Transparence** | `opacity` | ✅ | **Spécial : ne déclenche pas de repaint, seulement la composition** |

::: tip 📊 Que pouvez-vous tirer de ce tableau ?
**Constat clé** : `opacity` est spécial ! Comme `transform`, il ne déclenche pas de repaint, mais passe directement à l'étape de composition. C'est pourquoi les animations de fondu avec `opacity` sont les plus performantes.

De plus, **les ombres et les dégradés sont plus coûteux que le repaint** car ils nécessitent des calculs de pixels complexes. Si votre page a beaucoup de `box-shadow`, envisagez d'utiliser des pseudo-éléments ou des images à la place.
:::

### 6.3 Pièges courants : pourquoi mon effet hover est-il saccadé

**Piège : animer le hover avec box-shadow**

::: details Voir l'effet hover peu performant
```css
/* ❌ Mauvais effet hover : l'animation de box-shadow est très lente */
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);  /* L'ombre est très lente ! */
}
```

`box-shadow` nécessite un calcul pixel par pixel, l'animation sera saccadée.

**✅ Bonne pratique : utiliser transform ou un pseudo-élément**
```css
/* ✅ Bon effet hover : utiliser transform */
.card {
  transform: translateY(0);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-4px);  /* Changer l'ombre seulement au hover, pas d'animation dessus */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
```
:::

<PaintLayerDemo />

---

## 7. Cinquième étape : composition et accélération GPU

### 7.1 Qu'est-ce que la « composition »

::: tip 🤔 Qu'est-ce que la composition (Composite) ?
La **composition** est la « magie » des navigateurs modernes. Elle divise les différentes parties de la page en plusieurs **couches (Layers)** , puis utilise le **GPU (processeur graphique)** pour composer l'image finale en parallèle.

Imaginez les **calques de Photoshop** :
- Méthode traditionnelle = tout dessiner sur un seul calque (CPU série, lent)
- Méthode par composition = dessiner par calques, fusionner à la fin (GPU parallèle, rapide)

**Pourquoi la composition est-elle rapide ?** Parce que le GPU excelle dans les tâches parallèles comme la « composition d'images », jusqu'à des dizaines de fois plus vite que le CPU.
:::

### 7.2 Quels éléments sont promus en « couche de composition »

Le navigateur promeut automatiquement certains éléments dans des couches de composition indépendantes. Voici les déclencheurs courants :

| Déclencheur | Propriété/Valeur CSS | Impact performances | Remarque |
|---------|-----------|----------|----------|
| **Transformation 3D** | `transform: translate3d()`, `rotate3d()` | ✅✅✅ | Meilleure performance d'animation |
| **Astuce d'accélération matérielle** | `transform: translateZ(0)` | ✅✅ | Surnommé « forcer l'accélération GPU » |
| **Animation de transparence** | `opacity` qui change (avec animation) | ✅✅✅ | Ne déclenche pas de repaint |
| **Position fixe** | `position: fixed` | ✅ | Évite le re-layout lors du défilement |
| **Will-Change** | `will-change: transform, opacity` | ✅✅ | Crée la couche à l'avance, attention à la mémoire |
| **Canvas/WebGL** | `<canvas>`, contenu WebGL | ✅✅ | Naturellement dans une couche indépendante |
| **Video** | `<video>` | ✅✅ | Couche indépendante, évite les interférences |

::: tip 📊 Que pouvez-vous tirer de ce tableau ?
**Constat clé** : `transform` et `opacity` sont les propriétés d'animation les plus performantes car elles ne déclenchent ni reflow ni repaint — elles passent directement à la composition. C'est pourquoi les guides d'optimisation recommandent toujours « d'utiliser transform et opacity pour les animations ».

Mais attention : **chaque couche de composition consomme de la mémoire GPU**. Abuser de `translateZ(0)` peut faire exploser la mémoire (voir section 7.4).
:::

### 7.3 Pièges courants : trop de couches de composition rendent la page plus lente

::: danger 💀 Le piège de la sur-optimisation
Certains entendent dire que « l'accélération GPU, c'est rapide » et ajoutent `transform: translateZ(0)` à tous les éléments — résultat, la page est encore plus lente.

**Cause du problème** :
Chaque couche de composition nécessite de stocker une « texture » (bitmap) dans la mémoire GPU. Si une page a 100 couches de composition, la mémoire GPU peut être saturée, entraînant des plantages sur les appareils bas de gamme ou un retour au rendu CPU.
:::

::: details Voir le code de « sur-optimisation »
```css
/* ❌ Mauvaise pratique : activer l'accélération GPU sur tous les éléments */
.card { transform: translateZ(0); }
.button { transform: translateZ(0); }
.icon { transform: translateZ(0); }
/* ... 100 éléments avec cette règle ... */

/* Résultat : mémoire GPU saturée, page bloquée */
```

**✅ Bonne pratique : utiliser à bon escient**
```css
/* Stratégie 1 : activer seulement pour les éléments qui ont vraiment besoin d'animation */
.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);  /* Crée automatiquement une couche de composition */
}

/* Stratégie 2 : utiliser will-change pour indiquer au navigateur */
.card {
  will-change: transform;  /* Crée la couche à l'avance */
}

/* Stratégie 3 : supprimer après l'animation */
.card:not(:hover) {
  will-change: auto;  /* Libère la mémoire GPU */
}
```
:::

<CompositeDemo />

---

## 8. Boucle d'événements : le « don d'ubiquité » de JavaScript

::: tip 🤔 Qu'est-ce que la boucle d'événements ?
La **boucle d'événements (Event Loop)** est le mécanisme qui permet à JavaScript d'être « asynchrone ». Comme JavaScript est **mono-thread** (une seule chose à la fois), mais doit gérer les clics utilisateur, les requêtes réseau, les timers, etc., il a besoin d'un « système d'ordonnancement » pour gérer ces tâches.

Imaginez un **centre de tri de colis** :
- **Call Stack (pile d'appels)** = le colis en cours de traitement
- **Web APIs** = les entrepôts partenaires externes (timers, requêtes réseau, etc.)
- **Callback Queue (file de rappels)** = l'étagère des colis en attente
- **Event Loop (boucle d'événements)** = le robot de tri (vérifie constamment « puis-je traiter la tâche suivante ? »)
:::

### 8.1 Macro-tâches et micro-tâches

Au début, JavaScript n'avait qu'une seule file de tâches. Mais avec la complexification de la programmation asynchrone, le navigateur a introduit deux types de tâches :

| Type | Sources courantes | Priorité | Moment d'exécution |
|------|---------|--------|----------|
| **Macro-tâche** | `setTimeout`/`setInterval`, opérations I/O, rendu UI | Basse | Une par cycle de boucle d'événements |
| **Micro-tâche** | `Promise.then`, `MutationObserver` | Haute | Juste après la macro-tâche courante, toutes les micro-tâches sont vidées immédiatement |

**La « formule mnémotechnique » de l'ordre d'exécution** :

```
1. Exécuter la macro-tâche courante (par exemple le bloc <script> entier)
2. Exécuter toutes les micro-tâches générées pendant l'exécution (Promise.then, etc.)
   ↳ Les micro-tâches peuvent générer de nouvelles micro-tâches, toutes sont vidées avant de continuer
3. Si nécessaire, effectuer le rendu UI (reflow/repaint)
4. Démarrer le prochain cycle de boucle d'événements, exécuter la prochaine macro-tâche
```

### 8.2 Pièges courants : Promise est plus rapide que setTimeout

::: danger ❌ Idée reçue : setTimeout(fn, 0) s'exécute « immédiatement »
Beaucoup pensent que `setTimeout(fn, 0)` signifie « exécuter immédiatement après 0 milliseconde ». C'est une compréhension **erronée**.

En réalité, `setTimeout(fn, 0)` signifie : **« après au moins 0 milliseconde, ajouter le rappel dans la file de macro-tâches »** . Mais il doit attendre que la pile d'appels courante soit vide, que la file de micro-tâches soit vidée, et qu'un éventuel rendu UI soit terminé, avant de pouvoir s'exécuter.
:::

::: details Voir l'ordre d'exécution
```javascript
console.log('1. Start')

setTimeout(() => {
  console.log('2. setTimeout callback')
}, 0)

Promise.resolve().then(() => {
  console.log('3. Promise.then')
})

console.log('4. End')

// Ordre de sortie auquel vous vous attendez :
// 1. Start
// 4. End
// 2. setTimeout callback  ← setTimeout(0) n'est-il pas immédiat ?
// 3. Promise.then

// Ordre de sortie réel :
// 1. Start
// 4. End
// 3. Promise.then         ← Promise.then s'exécute avant setTimeout !
// 2. setTimeout callback
```

**Diagramme du flux d'exécution :**
```
Pile d'appels (Call Stack)      File de macro-tâches          File de micro-tâches
                                [setTimeout callback]         [Promise.then callback]

1. console.log('1. Start')
   → Sortie : 1. Start

2. setTimeout(fn, 0)
   → Ajoute le rappel dans la file macro  ← [setTimeout callback]

3. Promise.resolve().then()
   → Ajoute le rappel dans la file micro                            ← [Promise.then callback]

4. console.log('4. End')
   → Sortie : 4. End

5. Pile d'appels vide, vérifie la file de micro-tâches
   → Trouve le rappel Promise.then
   → Exécute : console.log('3. Promise.then')
   → Sortie : 3. Promise.then

6. File de micro-tâches vidée
   → Peut nécessiter un rendu UI (si des changements ont eu lieu)

7. Vérifie la file de macro-tâches
   → Trouve le rappel setTimeout
   → Exécute : console.log('2. setTimeout callback')
   → Sortie : 2. setTimeout callback
```
:::

::: tip 💡 Leçon clé
**Les micro-tâches sont « plus urgentes » que les macro-tâches.** Si vous voulez qu'une opération s'exécute « juste après le bloc de code courant, mais avant la mise à jour UI », utilisez `Promise.then` ou `queueMicrotask`.

`setTimeout(0)` ne garantit pas une exécution immédiate — il est au minimum retardé jusqu'à ce que la pile d'appels soit vide et la file de micro-tâches vidée.
:::

<JSEventLoopDemo />

<MacroMicroTaskDemo />

---

## 9. Optimisation des performances en pratique : faites « voler » votre page web

Maintenant que vous comprenez le pipeline de rendu, voyons comment optimiser. Voici les cinq techniques d'optimisation les plus pratiques.

### 9.1 Règle d'or : éviter le layout synchrone forcé

**Problème** : alterner lecture et écriture des propriétés de layout, provoquant du layout thrashing.

::: details Voir la comparaison avant/après optimisation
```javascript
// ❌ Très mauvais : alternance lecture/écriture, provoque du layout thrashing
for (let i = 0; i < elements.length; i++) {
  const height = elements[i].offsetHeight  // Lecture → force le layout
  elements[i].style.height = (height * 2) + 'px'  // Écriture → marque pour reflow
  // La lecture de la prochaine itération force à nouveau le layout... cercle vicieux !
}

// ✅ Très bon : tout lire d'abord, tout écrire ensuite
// Étape 1 : lecture par lots
const heights = []
for (let i = 0; i < elements.length; i++) {
  heights.push(elements[i].offsetHeight)
}

// Étape 2 : écriture par lots
requestAnimationFrame(() => {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.height = (heights[i] * 2) + 'px'
  }
})
```
:::

### 9.2 Utiliser transform et opacity pour les animations

**Problème** : animer avec `width`, `height`, `left`, `top` déclenche des reflow.

::: details Voir la comparaison avant/après optimisation
```css
/* ❌ Mauvaise animation : déclenche un reflow */
.box {
  transition: width 0.3s, left 0.3s;
}
.box.moving {
  width: 200px;
  left: 100px;
}

/* ✅ Bonne animation : ne déclenche que la composition */
.box {
  transition: transform 0.3s;
}
.box.moving {
  transform: translateX(100px) scaleX(2);
}
```
:::

### 9.3 Défilement virtuel : résoudre les grandes listes de données

**Problème** : quand le nombre d'éléments d'une liste atteint des milliers, le nombre de nœuds DOM devient excessif et dégrade les performances.

**Idée centrale** : ne rendre que les éléments visibles dans la fenêtre d'affichage (avec une petite marge tampon), le nombre de nœuds DOM reste fixe, indépendant de la quantité totale de données.

<RenderingPerformanceDemo />

::: details Voir l'implémentation du défilement virtuel
```vue
<template>
  <div class="virtual-list" @scroll="handleScroll">
    <!-- Élément fantôme pour dimensionner la barre de défilement -->
    <div class="phantom" :style="{ height: totalHeight + 'px' }"></div>

    <!-- Éléments de liste réellement rendus -->
    <div class="content" :style="{ transform: `translateY(${offsetY}px)` }">
      <div
        v-for="item in visibleItems"
        :key="item.id"
        class="item"
        :style="{ height: itemHeight + 'px' }"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  items: Array,
  itemHeight: { type: Number, default: 50 }
})

const scrollTop = ref(0)
const buffer = 5  // Nombre d'éléments tampons

// Nombre d'éléments visibles dans la zone d'affichage
const visibleCount = computed(() => 10)

// Index de départ
const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - buffer)
)

// Index de fin
const endIndex = computed(() =>
  Math.min(props.items.length, startIndex.value + visibleCount.value + buffer * 2)
)

// Données actuellement visibles
const visibleItems = computed(() =>
  props.items.slice(startIndex.value, endIndex.value)
)

// Hauteur totale
const totalHeight = computed(() => props.items.length * props.itemHeight)

// Décalage
const offsetY = computed(() => startIndex.value * props.itemHeight)

const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop
}
</script>
```
:::

### 9.4 Debounce et throttle : réduire la fréquence de déclenchement des événements

**Problème** : les événements déclenchés fréquemment (comme scroll, resize) dégradent les performances.

::: details Voir l'implémentation du debounce et du throttle
```javascript
// Debounce : retarde l'exécution ; si redéclenché pendant le délai, le timer est réinitialisé
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Throttle : exécute à intervalles de temps fixes
function throttle(fn, interval) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

// Exemple d'utilisation
window.addEventListener('scroll', debounce(handleScroll, 200))
window.addEventListener('resize', throttle(handleResize, 100))
```
:::

### 9.5 Lazy loading : charger les ressources non critiques en différé

**Problème** : trop de ressources chargées au premier écran ralentissent l'ouverture de la page.

::: details Voir l'implémentation du lazy loading
```javascript
// Lazy loading des images
const lazyImages = document.querySelectorAll('img[data-src]')

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src  // Charge l'image réelle
      img.removeAttribute('data-src')
      observer.unobserve(img)  // Arrête d'observer
    }
  })
})

lazyImages.forEach(img => imageObserver.observe(img))
```
:::

---

## 10. Les problèmes de performance que vous devriez maintenant savoir identifier

Après avoir compris le pipeline de rendu du navigateur, vous devriez pouvoir identifier les problèmes de performance courants suivants :

| Code problématique | Problème | Comment le décrire à l'IA |
|---------|---------|-------------|
| `element.style.width = ...` | Modification fréquente de la largeur dans une boucle | « Cela déclenche de multiples reflows, veuillez utiliser transform ou un traitement par lots » |
| `height = element.offsetHeight` | Lecture d'une propriété de layout juste après une écriture | « C'est un layout synchrone forcé, veuillez séparer les opérations de lecture et d'écriture » |
| `element.className = ...` | Modification fréquente de class qui déclenche un recalcul de style | « Utilisez classList.add/remove pour réduire les calculs de style » |
| Animation avec `width`/`left` | Déclenche reflow et repaint, performances médiocres | « Utilisez transform et opacity pour les animations » |
| `translateZ(0)` sur tous les éléments | Abus de l'accélération GPU, explosion mémoire | « Activez l'accélération GPU uniquement pour les éléments qui en ont besoin » |
| Liste de 10000 éléments tous rendus | Trop de nœuds DOM, provoque des saccades | « Implémentez le défilement virtuel, ne rendez que la zone visible » |
| Manipulation du DOM dans l'événement scroll | Fréquence de déclenchement trop élevée, provoque des saccades | « Optimisez avec requestAnimationFrame ou throttle » |
| Animation hover avec `box-shadow` | Le calcul d'ombre complexe est très lent | « Utilisez transform ou un pseudo-élément, évitez d'animer box-shadow » |

**Si vous avez lu attentivement les « pièges courants » de chaque chapitre, vous maîtrisez aussi ces concepts fondamentaux :**

- **Les cinq étapes du pipeline de rendu** : DOM/CSSOM → Arbre de rendu → Layout → Paint → Composition
- **Reflow vs Repaint** : le reflow est le plus coûteux (changement géométrique), le repaint l'est moins (changement d'apparence)
- **Layout synchrone forcé** : l'alternance lecture/écriture provoque du layout thrashing, il faut les séparer
- **Accélération GPU** : transform et opacity sont gérés par le GPU, performances optimales
- **Boucle d'événements** : JavaScript est mono-thread, l'asynchrone est réalisé via des files de tâches

Ces concepts vous aideront à localiser rapidement les goulets d'étranglement de performance.

::: info 💡 Voici comment parler à l'IA face à un problème de performance
- « L'animation est saccadée, vérifiez si elle déclenche un reflow ou un repaint »
- « Les performances de défilement sont mauvaises, il faut peut-être utiliser throttle ou requestAnimationFrame »
- « La liste rame avec beaucoup de données, il faut un défilement virtuel »
- « Les modifications fréquentes de style dégradent les performances, optimisez avec transform »
:::

---

## 11. Résumé : l'essence de l'optimisation du pipeline de rendu

À travers cet article, nous pouvons tirer les conclusions fondamentales suivantes :

**Du point de vue pratique** : ce n'est pas « plus d'optimisations » qui compte, mais des optimisations « bien ciblées ». Comprendre le pipeline de rendu du navigateur vous permet de savoir où concentrer vos efforts et où les relâcher.

**Du point de vue des coûts** :
- La plupart des gaspillages de performance viennent de **l'alternance fréquente lecture/écriture** des propriétés de layout, à résoudre par la séparation lecture/écriture et le traitement par lots
- Les animations complexes qui déclenchent reflow et repaint sont souvent dues à l'utilisation de « mauvaises propriétés », à résoudre par `transform` et `opacity`
- Face au rendu de listes avec beaucoup de données, le DOM virtuel seul ne suffit plus, il faut combiner avec des techniques comme le **défilement virtuel**

**L'objectif est : dans des conditions données de navigateur et de matériel, faire en sorte que chaque étape de rendu apporte un bénéfice de performance clair.**

---

## 12. Tableau des termes

| Terme anglais | Correspondance française | Explication |
| :--- | :--- | :--- |
| **DOM** | Document Object Model | Structure arborescente formée par le navigateur après l'analyse du document HTML ; JavaScript peut manipuler les éléments de la page via l'API DOM |
| **CSSOM** | CSS Object Model | Structure arborescente formée par le navigateur après l'analyse du CSS, combinée avec le DOM pour calculer le style final |
| **Render Tree** | Arbre de rendu | Fusion de l'arbre DOM et du CSSOM, ne contient que les nœuds visibles, utilisé pour le calcul de layout et le paint |
| **Layout** | Mise en page | Processus de calcul des informations géométriques (position, taille) de chaque nœud de l'arbre de rendu, aussi appelé Reflow |
| **Reflow** | Reflow / Réagencement | Quand les propriétés géométriques d'un élément (taille, position) changent, le navigateur doit recalculer la mise en page |
| **Paint** | Peinture / Repaint | Processus de dessin à l'écran des styles d'éléments (couleurs, fonds, bordures, etc.) après le calcul de layout |
| **Repaint** | Repaint | Mise à jour de la peinture déclenchée quand les propriétés d'apparence (couleur, fond) changent sans affecter la géométrie |
| **Composite** | Composition | Processus de fusion de plusieurs couches de peinture (Layers) en une image écran finale, généralement exécuté sur le GPU |
| **Layer** | Couche / Couche de composition | Surface de dessin indépendante créée par le navigateur pour optimiser le rendu, pouvant être transformée et composée séparément |
| **Event Loop** | Boucle d'événements | Mécanisme d'exécution asynchrone de JavaScript, responsable de l'ordonnancement des macro-tâches et micro-tâches |
| **Call Stack** | Pile d'appels | Structure de données qui enregistre la fonction JavaScript en cours d'exécution |
| **Macro Task** | Macro-tâche | Type de tâche de priorité basse dans la boucle d'événements, comme setTimeout, setInterval, opérations I/O, etc. |
| **Micro Task** | Micro-tâche | Type de tâche de priorité haute dans la boucle d'événements, comme Promise.then, MutationObserver, etc. |
| **Forced Synchronous Layout** | Layout synchrone forcé | Problème de performance où l'alternance lecture/écriture des propriétés de layout en JavaScript force le navigateur à exécuter immédiatement le calcul de layout |
| **Layout Thrashing** | Layout thrashing | Phénomène de dégradation brutale des performances causé par des layouts synchrones forcés répétés |
| **Virtual Scrolling** | Défilement virtuel | Technique qui ne rend que les éléments de liste visibles dans la fenêtre d'affichage, pour optimiser les performances des grandes listes |
| **RAF** | requestAnimationFrame | API du navigateur pour exécuter du code JavaScript d'animation avant le prochain repaint |
