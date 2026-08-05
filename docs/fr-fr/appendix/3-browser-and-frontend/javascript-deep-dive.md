# Principes : Mécanismes internes de JavaScript

::: tip Préface
Vous avez appris HTML et CSS et pouvez créer de belles pages web. Mais vous avez peut-être remarqué que : cliquer sur un bouton ne fait rien, remplir un formulaire ne permet pas de l'envoyer — la page web ressemble à une image « statique ».

C'est pourquoi nous avons besoin de JavaScript — il donne « vie » aux pages web. Cliquer sur un bouton affiche un menu, taper du texte déclenche une recherche en temps réel, faire défiler la page charge plus de contenu… Tous ces effets interactifs reposent sur JavaScript.

En vibecoding, l'IA écrit la plupart du code pour vous. Mais vous devez au moins pouvoir comprendre ce que fait le code, sinon vous ne remarquerez pas si l'IA écrit quelque chose d'incorrect. Après avoir lu ce guide, vous serez capable de :

- Comprendre ce que fait le code généré par l'IA
- Repérer les problèmes dans le code
- Dire clairement à l'IA ce qu'il faut modifier
:::

**Ce que vous allez apprendre dans cet article :**

| Chapitre | Contenu | Ce que vous pourrez faire après |
|----------|---------|--------------------------------|
| **Chapitre 1** | Qu'est-ce que JavaScript | Comprendre son rôle dans une page web |
| **Chapitre 2** | Données et variables | Savoir comment un programme stocke et utilise les données |
| **Chapitre 3** | Fonctions et logique | Comprendre les conditions, boucles et la réutilisation du code |
| **Chapitre 4** | DOM et événements | Savoir comment le code contrôle la page et répond aux actions utilisateur |
| **Chapitre 5** | Techniques pratiques | Comment lire le code de l'IA et comment décrire les erreurs |

Chaque chapitre commence par « reconnaître le code », pas besoin de l'écrire vous-même. Si vous rencontrez du code que vous ne comprenez pas, revenez consulter ce guide.

---

## 1. Qu'est-ce que JavaScript

::: tip 🤔 Question centrale
**Pourquoi les pages web ont-elles besoin de JavaScript ?** HTML et CSS suffisent déjà à donner du contenu et du style à une page web, alors pourquoi apprendre un nouveau langage ?
:::

### 1.1 De la « page web statique » à « l'application dynamique »

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📄 Page web sans JavaScript**
- Contenu fixe, aucune interaction
- Cliquer sur un bouton ne fait rien
- Impossible d'envoyer un formulaire rempli
- La page ne se met pas à jour automatiquement

*Comme une affiche en papier, on ne peut que la regarder*

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 Page web avec JavaScript**
- Un clic sur un bouton affiche un menu
- La saisie de texte déclenche une recherche en temps réel
- Le défilement charge automatiquement plus de contenu
- Les données s'affichent en temps réel

*Comme une véritable application*

</div>
</div>

**Pour comprendre la relation entre les trois en une phrase :**

| Technologie | Métaphore | Rôle |
|-------------|-----------|------|
| **HTML** | Squelette | Définit la structure et le contenu de la page |
| **CSS** | Peau | Définit l'apparence et le style de la page |
| **JavaScript** | Muscles et système nerveux | Rend la page réactive, interactive et capable de « penser » |

### 1.2 Pourquoi le vibecoding nécessite aussi de comprendre JavaScript

::: warning L'erreur classique d'un développeur débutant en JS
Un développeur qui vient de commencer JavaScript a utilisé l'IA pour créer une application « compteur » : cliquer sur un bouton augmente le nombre de 1. Le code généré par l'IA fonctionnait correctement.

Mais il voulait le modifier pour « augmenter de 2 » et a dit à l'IA : « Fais en sorte que chaque clic augmente de 2. » L'IA a modifié le code, mais le nombre n'augmentait toujours que de 1.

Il a demandé à l'IA pourquoi ça ne marchait pas, l'IA a donné une explication, mais il ne comprenait pas ce que signifiait `count = count + 1` dans le code, ni si l'IA avait modifié le bon endroit. Il ne pouvait que répéter « l'augmentation de 2 ne fonctionne pas », l'IA a produit plusieurs versions, certaines modifiaient la valeur initiale à 2, d'autres ajoutaient 2 à un endroit complètement différent.

Finalement, après avoir lu le concept de « variable » au chapitre 2, il a compris que `count = count + 1` ajoute 1 à la valeur de count puis la stocke à nouveau. Il a alors dit à l'IA : « Remplace `count + 1` par `count + 2`. »

Corrigé en une seule tentative.

**C'est pourquoi il faut comprendre JavaScript — pas pour écrire du code à la main, mais pour pouvoir repérer le problème en un coup d'œil quand l'IA ne le fait pas correctement, et dire exactement ce qu'il faut changer.**
:::

### 1.3 Un aperçu : un vrai code généré par l'IA

Avant d'approfondir, regardons un vrai code généré par l'IA. Ne vous inquiétez pas si vous ne comprenez pas tout, ayez juste une première impression, nous expliquerons chaque partie plus tard.

**Scénario** : créer une fonctionnalité « cliquer sur un bouton pour changer la couleur de fond »

```javascript
// Définir un ensemble de couleurs
const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']
let currentIndex = 0

// Trouver le bouton sur la page
const button = document.querySelector('#changeBtn')

// Ajouter un événement de clic au bouton
button.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % colors.length
  document.body.style.backgroundColor = colors[currentIndex]
})
```

**Que fait ce code ?**

| Code | Rôle | Chapitre correspondant |
|------|------|------------------------|
| `const colors = [...]` | Définit un ensemble de couleurs | Chapitre 2 : Tableaux |
| `let currentIndex = 0` | Enregistre quelle couleur est actuellement affichée | Chapitre 2 : Variables |
| `document.querySelector(...)` | Trouve le bouton sur la page | Chapitre 4 : Recherche DOM |
| `button.addEventListener(...)` | Ajoute un événement de clic au bouton | Chapitre 4 : Écouteurs d'événements |
| `() => {...}` | Définit le code à exécuter après le clic | Chapitre 3 : Fonctions fléchées |

::: info 💡 Leçon clé
Vous n'avez pas besoin de comprendre chaque ligne maintenant. Rappelez-vous simplement : **le code JavaScript est une série d'instructions qui disent au navigateur « ce qui doit se passer quand l'utilisateur fait quelque chose ».**
:::

---

## 2. Les données : variables et types de données

::: tip 🤔 Question centrale
**Comment un programme « se souvient-il » des choses ?** Le contenu saisi par l'utilisateur, les données récupérées du serveur, les résultats intermédiaires des calculs — où sont stockées toutes ces informations ?
:::

### 2.1 Variables : donner un nom aux données

**Une variable est comme une boîte étiquetée** — vous pouvez y mettre des données et les récupérer plus tard grâce à l'étiquette.

```javascript
const name = "Zhang San"   // Le nom ne change pas, on utilise const
let age = 25               // L'âge peut changer, on utilise let
```

**Pourquoi distinguer const et let ?**

Imaginez : votre numéro de carte d'identité (const) ne change jamais dans votre vie, mais votre âge (let) change chaque année. JavaScript vous permet d'utiliser différents mots-clés pour exprimer cette intention de « changement ou non ».

| Mot-clé | Modifiable | Cas d'utilisation | Exemple |
|---------|-----------|-------------------|---------|
| `const` | ❌ Non | Données dont la valeur ne change pas | Numéro de carte d'identité, configuration, liste de couleurs |
| `let` | ✅ Oui | Données dont la valeur change | Compteur, option sélectionnée, saisie utilisateur |

::: details 🔍 Un exemple concret
```javascript
// Avec const : ces valeurs ne changent pas
const PI = 3.14159
const MAX_USERS = 100
const APP_NAME = "TodoList"

// Avec let : ces valeurs changent
let count = 0
count = 1  // ✅ Peut être modifié

count = count + 1  // ✅ Peut être recalculé à partir de la valeur précédente

// Que se passe-t-il avec const ?
const fixedCount = 0
fixedCount = 1  // ❌ Erreur ! const ne peut pas être réassigné
```
:::

👇 **Essayez par vous-même** : modifiez le code ci-dessous pour voir la différence entre const et let

<VariableBoxDemo />

### 2.2 Types de données : les différentes « choses » en JavaScript

JavaScript divise les données en plusieurs types, les trois plus courants sont :

| Type | Description | Exemple | Cas d'usage réel |
|------|-------------|---------|------------------|
| `string` (chaîne) | Contenu textuel | `"hello"`, `'你好'` | Nom d'utilisateur, description de produit, message d'info |
| `number` (nombre) | Valeur numérique | `42`, `3.14` | Prix, quantité, note |
| `boolean` (booléen) | Oui/Non | `true`, `false` | Est connecté, est terminé, est visible |

**Deux valeurs spéciales à connaître :**

- `undefined` → la variable est déclarée mais n'a pas encore de valeur
- `null` → intentionnellement vide (signifie « il n'y a pas de valeur ici »)

::: details 🔍 Littéraux de gabarits : concaténer du texte plus facilement
Dans le code généré par l'IA, vous verrez souvent des chaînes entourées de backticks (`` ` ``) contenant `${...}` :

```javascript
const name = "Zhang San"
const age = 25

// Méthode traditionnelle (fastidieuse)
const message = "Je m'appelle " + name + ", j'ai " + age + " ans"

// Littéral de gabarit (concis)
const message = `Je m'appelle ${name}, j'ai ${age} ans`
// Résultat : "Je m'appelle Zhang San, j'ai 25 ans"
```

**Point de reconnaissance** : quand vous voyez des backticks et `${}`, cela signifie que des variables sont insérées dans le texte.
:::

### 2.3 Objets et tableaux : organiser les données

**Objet = un ensemble de propriétés nommées** (comme une fiche d'information personnelle)

```javascript
const user = {
  name: "Zhang San",
  age: 25,
  isVIP: true
}

// Utiliser le point pour accéder aux propriétés
console.log(user.name)    // "Zhang San"
console.log(user.age)     // 25
```

**Tableau = un ensemble de données ordonnées** (comme une liste)

```javascript
const colors = ['Rouge', 'Vert', 'Bleu']

// Accès par index (commence à 0)
console.log(colors[0])  // "Rouge"
console.log(colors[1])  // "Vert"
```

**Structures imbriquées : objets dans des tableaux, tableaux dans des objets**

C'est la structure de données la plus courante dans le code de l'IA :

```javascript
const todos = [
  { id: 1, text: "Apprendre JavaScript", done: false },
  { id: 2, text: "Faire le projet", done: true },
  { id: 3, text: "Rédiger la documentation", done: false }
]

// Accès : prendre l'élément 0 du tableau, puis sa propriété text
console.log(todos[0].text)  // "Apprendre JavaScript"
```

::: info 💡 Astuce de reconnaissance
- Vous voyez `{}` → c'est un objet, contenant des paires `nom: valeur`
- Vous voyez `[]` → c'est un tableau, contenant des valeurs ordonnées
- Vous voyez `data[0].name` → prendre l'élément 0 du tableau, puis sa propriété name
:::

### 2.4 Valeur vs référence : un piège courant

C'est l'un des problèmes les plus fréquents pour les débutants !

**Assignation de types primitifs (string, number, boolean) = copie une donnée entièrement nouvelle :**

```javascript
let a = 10
let b = a      // b reçoit une copie de a
b = 20
console.log(a) // 10 (a n'est pas affecté)
```

**Assignation d'objets et tableaux = copie « l'adresse » (pointe vers la même chose) :**

```javascript
let user1 = { name: "Zhang San" }
let user2 = user1      // user2 pointe vers le même objet
user2.name = "Li Si"   // modifier user2 affecte user1
console.log(user1.name) // "Li Si" (user1 a aussi changé !)
```

**Pourquoi créer une copie ?**

Dans React/Vue, modifier directement les données empêche l'interface de se mettre à jour. C'est pourquoi le code de l'IA utilise souvent `[...array]` ou `{...obj}` — il crée une copie pour éviter les interférences mutuelles.

```javascript
// Créer une copie avec l'opérateur de décomposition
const arr1 = [1, 2, 3]
const arr2 = [...arr1]     // Crée un nouveau tableau
arr2.push(4)
console.log(arr1)          // [1, 2, 3] (non affecté)
console.log(arr2)          // [1, 2, 3, 4]
```

👇 **Essayez par vous-même** : observez le comportement des données originales lors de la modification d'une copie

<ReferenceDemo />

### 2.5 Déstructuration et décomposition : les raccourcis du JavaScript moderne

Ces deux syntaxes sont omniprésentes dans le code de l'IA, vous ne pourrez pas lire le code sans les connaître.

**Déstructuration : extraire rapidement des données d'un objet ou d'un tableau**

```javascript
const user = { name: "Zhang San", age: 25, city: "Pékin" }

// Méthode traditionnelle (fastidieuse)
const name = user.name
const age = user.age

// Déstructuration (concis)
const { name, age } = user
// Même effet, en une seule ligne
```

**Opérateur de décomposition : copier et étendre des données**

```javascript
// Copier un tableau et ajouter de nouveaux éléments
const arr1 = [1, 2, 3]
const arr2 = [...arr1, 4, 5]  // [1, 2, 3, 4, 5]

// Copier un objet et ajouter de nouvelles propriétés
const user1 = { name: "Zhang San", age: 25 }
const user2 = { ...user1, city: "Pékin" }
// { name: "Zhang San", age: 25, city: "Pékin" }
```

::: info 💡 Astuce de reconnaissance
- Vous voyez `const { name, age } = person` → extraire name et age de l'objet person
- Vous voyez `...array` ou `...obj` → décomposer le tableau ou l'objet
- Vous n'avez pas besoin de savoir l'écrire, mais vous devez pouvoir le lire
:::

---

## 3. Logique : fonctions et contrôle de flux

::: tip 🤔 Question centrale
**Comment le code « prend des décisions » et « répète des actions » ?** Un programme doit exécuter différentes opérations selon les conditions et répéter certaines tâches — comment exprimer cette logique ?
:::

### 3.1 Conditions : si... alors... sinon...

**if/else : le jugement conditionnel le plus basique**

```javascript
const age = 18

if (age >= 18) {
  console.log("Adulte")
} else {
  console.log("Mineur")
}
```

**Opérateur ternaire : un if/else raccourci**

```javascript
// Version complète (4 lignes)
let message
if (age >= 18) {
  message = "Adulte"
} else {
  message = "Mineur"
}

// Opérateur ternaire (1 ligne)
const message = age >= 18 ? "Adulte" : "Mineur"
// Format : condition ? valeur_si_vrai : valeur_si_faux
```

**Court-circuit && : courant dans le code React**

```javascript
// Afficher le panneau utilisateur seulement si isLoggedIn est true
isLoggedIn && <UserPanel />

// Équivalent à
if (isLoggedIn) {
  return <UserPanel />
}
```

::: info 💡 Astuce de reconnaissance
- Vous voyez `? :` → c'est l'opérateur ternaire, un if/else raccourci
- Vous voyez `&&` → ce qui suit ne s'exécute que si ce qui précède est true
:::

### 3.2 Fonctions : empaqueter des opérations

**Fonction = recette d'un plat**

- Définir une fonction = écrire la recette
- Appeler une fonction = cuisiner selon la recette
- Paramètres = ingrédients
- Valeur de retour = plat fini

```javascript
// Définir une fonction (écrire la recette)
function greet(name) {
  return "Bonjour " + name
}

// Appeler la fonction (cuisiner selon la recette)
console.log(greet("Zhang San"))  // "Bonjour Zhang San"
console.log(greet("Li Si"))      // "Bonjour Li Si"
```

**Trois façons d'écrire, reconnaissables en un coup d'œil :**

```javascript
// 1. Déclaration function (méthode traditionnelle)
function greet(name) {
  return "Bonjour " + name
}

// 2. Fonction fléchée (la plus utilisée dans le code de l'IA)
const greet = (name) => {
  return "Bonjour " + name
}

// 3. Fonction fléchée raccourcie (une seule ligne)
const greet = (name) => "Bonjour " + name
```

👇 **Essayez par vous-même** : saisissez différents noms et voyez comment la fonction fonctionne

<FunctionMachineDemo />

::: info 💡 Astuce de reconnaissance
- Vous voyez `function` ou `=>` → c'est une fonction
- Vous voyez `fn()` → cet appel exécute la fonction
- Vous voyez `() => {}` → fonction fléchée, la syntaxe dominante du JS moderne
:::

### 3.3 Méthodes de tableau : des outils puissants pour traiter les listes

Dans React/Vue, presque chaque rendu de liste utilise ces méthodes.

```javascript
const todos = [
  { id: 1, text: "Apprendre", done: false },
  { id: 2, text: "Travailler", done: true }
]

// .map() : transformer chaque élément du tableau en autre chose
const texts = todos.map(todo => todo.text)
// ["Apprendre", "Travailler"]

// .filter() : filtrer les éléments qui remplissent une condition
const unfinished = todos.filter(todo => !todo.done)
// [{ id: 1, text: "Apprendre", done: false }]

// .find() : trouver le premier élément qui remplit une condition
const found = todos.find(todo => todo.id === 1)
// { id: 1, text: "Apprendre", done: false }
```

::: info 💡 Astuce de reconnaissance
- Vous voyez `.map()` → transformer un tableau, retourne un nouveau tableau
- Vous voyez `.filter()` → filtrer un tableau
- Vous voyez `items.map(item => <li>{item.name}</li>)` → transformer chaque élément de données en balise de liste
:::

### 3.4 Portée : la « visibilité » des variables

**Métaphore des « pièces » :**

- Les variables à l'intérieur d'une fonction sont comme des objets dans une pièce, invisibles de l'extérieur
- Mais les personnes dans la pièce peuvent voir les objets dans le couloir (portée externe)

```javascript
const global = "Variable globale"  // Objet dans le couloir

function room() {
  const local = "Objet dans la pièce"  // Objet dans la pièce
  console.log(global)  // ✅ Peut voir le couloir
}

console.log(local)  // ❌ Erreur ! L'extérieur ne peut pas voir l'intérieur de la pièce
```

**Intuition clé :** l'endroit où le code est écrit détermine quelles variables il peut voir.

👇 **Essayez par vous-même** : cliquez sur différentes portées pour voir quelles variables sont accessibles

<ScopeDemo />

### 3.5 Fermeture : une fonction « se souvient » de l'environnement où elle est née

**Ne le considérez pas comme un concept isolé, comprenez-le à partir d'un scénario concret :**

```javascript
function setupCounter() {
  let count = 0  // Cette variable est à l'intérieur de la fonction

  return {
    add: () => { count++; return count },
    getCount: () => count
  }
}

const counter = setupCounter()
console.log(counter.add())      // 1
console.log(counter.add())      // 2
console.log(counter.getCount()) // 2
```

**Intuition clé :** lorsqu'une fonction est créée, elle « se souvient » des variables qui l'entourent, même si la fonction externe a déjà terminé son exécution.

👇 **Essayez par vous-même** : observez comment la fermeture permet à la fonction de « se souvenir » de l'état

<ClosureDemo />

### 3.6 this : par qui la fonction est appelée

**Sans entrer dans les règles de liaison complexes, voici les scénarios les plus courants :**

**Scénario 1 : dans une méthode d'objet, this pointe vers cet objet**

```javascript
const user = {
  name: "Zhang San",
  sayHi() {
    console.log("Bonjour, je suis " + this.name)  // this pointe vers user
  }
}
user.sayHi()  // "Bonjour, je suis Zhang San"
```

**Scénario 2 : dans un écouteur d'événement, this pointe vers l'élément qui déclenche l'événement**

```javascript
button.addEventListener('click', function() {
  console.log(this)  // this pointe vers l'élément button
})

// Mais les fonctions fléchées ne changent pas this
button.addEventListener('click', () => {
  console.log(this)  // this pointe vers le this extérieur
})
```

::: info 💡 Que faire en cas de problème ?
Si le code de l'IA contient un bug lié à this (par exemple `Cannot read property of undefined`), dites à l'IA : « Le this dans cette méthode ne pointe pas au bon endroit, utilise une fonction fléchée ou bind »
:::

---

## 4. Interaction : DOM, événements et asynchrone

::: tip 🤔 Question centrale
**Comment JavaScript « interagit » avec la page web ?** Comment trouver les éléments sur la page ? Comment répondre aux clics et saisies de l'utilisateur ? Comment récupérer des données du serveur ?
:::

### 4.1 DOM : la page web vue par JavaScript

Aux yeux de JavaScript, une page web est un « arbre », chaque balise HTML est un « nœud » de cet arbre.

```html
<html>
  <body>
    <h1>Titre</h1>
    <p>Paragraphe</p>
    <ul>
      <li>Élément 1</li>
      <li>Élément 2</li>
    </ul>
  </body>
</html>
```

**JS manipule la page web = trouver un nœud + modifier un nœud + créer/supprimer un nœud**

👇 **Essayez par vous-même** : cliquez sur les nœuds pour voir comment l'arbre DOM est organisé

<DOMTreeDemo />

### 4.2 Rechercher et modifier des éléments

**Rechercher des éléments :**

```javascript
// Rechercher par sélecteur CSS (le plus courant)
const title = document.querySelector('h1')      // Trouver le premier h1
const button = document.querySelector('#btn')   // Trouver l'élément avec id="btn"
const items = document.querySelectorAll('.item') // Trouver tous les éléments avec class="item"
```

**Modifier des éléments :**

```javascript
// Changer le texte
title.textContent = "Nouveau titre"

// Changer le style
element.style.color = "red"
element.style.fontSize = "20px"

// Changer les classes CSS
element.classList.add('active')      // Ajouter une classe
element.classList.remove('hidden')   // Supprimer une classe
element.classList.toggle('open')     // Basculer une classe (supprime si présente, ajoute si absente)
```

::: info 💡 Astuce de reconnaissance
- Vous voyez `document.querySelector` → rechercher un élément de la page
- Vous voyez `.textContent` → modifier le texte
- Vous voyez `.style.xxx` → modifier le style
- Vous voyez `.classList.add/remove/toggle` → modifier les classes CSS
:::

### 4.3 Événements : quand l'utilisateur effectue une action...

**addEventListener : ajouter un écouteur d'événement à un élément**

```javascript
button.addEventListener('click', () => {
  console.log("Le bouton a été cliqué")
})
```

**Événements courants :**

| Événement | Déclencheur | Cas d'usage réel |
|-----------|-------------|------------------|
| `click` | Clic | Clic sur un bouton, navigation par lien |
| `input` | Changement du contenu d'un champ | Recherche en temps réel, validation de formulaire |
| `submit` | Soumission d'un formulaire | Connexion, inscription, envoi de données |
| `scroll` | Défilement de la page | Chargement différé, retour en haut |

**Objet événement : obtenir plus d'informations**

```javascript
input.addEventListener('input', (e) => {
  console.log(e.target.value)  // Obtenir la valeur du champ de saisie
  e.preventDefault()            // Empêcher le comportement par défaut (ex. rechargement après soumission)
})
```

::: info 💡 Application pratique
Quand vous voulez ajouter une fonctionnalité à un bouton, vous dites essentiellement à l'IA : « Ajoute un événement de clic à ce bouton, et exécute telle opération lors du clic »
:::

### 4.4 Asynchrone : pourquoi certaines opérations ne sont pas immédiates

**Métaphore du restaurant :**

Après avoir commandé, vous n'attendez pas debout devant la cuisine, vous pouvez faire autre chose, le serveur vous apportera le plat quand il sera prêt.

**Scénario le plus courant : récupérer des données du serveur**

```javascript
// Écriture synchrone (bloque la page, à ne pas utiliser)
const data = fetch('/api/data')  // ❌ Écrire ainsi bloquera la page

// Écriture asynchrone (correcte)
async function loadData() {
  try {
    const response = await fetch('/api/data')
    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.error('Erreur :', error)
  }
}
```

**Syntaxe async/await :**

- `async` → marque que cette fonction contient des opérations asynchrones
- `await` → attend que cette opération se termine (mais sans bloquer la page)
- `try/catch` → gérer les erreurs possibles

👇 **Essayez par vous-même** : observez l'ordre d'exécution des opérations asynchrones

<AsyncRestaurantDemo />

::: info 💡 Astuce de reconnaissance
- Vous voyez `async/await` → en attente d'une opération longue
- Vous voyez `fetch()` → récupération de données depuis le serveur
- Vous voyez `try/catch` → gestion des erreurs possibles
:::

### 4.5 Boucle d'événements : comment JavaScript fonctionne vraiment

**Sans jargon « micro-tâche/macro-tâche », comprenez avec un modèle simple :**

**JS est un « poste de travail unique »**, il ne fait qu'une chose à la fois, mais dispose d'un « bloc-notes » (file de tâches).

Quand il rencontre une opération qui nécessite d'attendre (requête réseau, minuteur), JS n'attend pas bêtement, il colle « ce qu'il faut faire quand c'est prêt » sur le bloc-notes et continue l'exécution. Quand la tâche en cours est terminée, il consulte le bloc-notes.

```javascript
console.log("1")

setTimeout(() => console.log("2"), 0)  // Même avec 0 seconde, c'est différé

console.log("3")

// Sortie : 1, 3, 2 (pas 1, 2, 3 !)
```

**Pourquoi ?**
1. Exécute `console.log("1")` → affiche 1
2. Rencontre `setTimeout` → colle le callback sur le bloc-notes, continue
3. Exécute `console.log("3")` → affiche 3
4. Le code en cours est terminé, consulte le bloc-notes
5. Exécute le callback de `setTimeout` → affiche 2

👇 **Essayez par vous-même** : observez l'ordre d'exécution du code

<JSEventLoopDemo />

::: info 💡 Que faire en cas de problème ?
Si dans le code de l'IA le rendu de la page se fait avant que les données ne soient récupérées, dites à l'IA : « Les données ne sont pas encore chargées mais le rendu commence déjà, il faut ajouter un état de chargement (loading) et ne faire le rendu qu'une fois les données arrivées »
:::

### 4.6 Modules : import et export

La première ligne du code React/Vue généré par l'IA est presque toujours `import`.

**import = importer des fonctionnalités depuis un autre fichier**

```javascript
// Importer une fonction depuis un fichier utilitaire
import { formatDate } from './utils'

// Importer depuis un package tiers
import React from 'react'
import { useState } from 'react'
```

**export = exposer des fonctionnalités pour que d'autres puissent les utiliser**

```javascript
// utils.js
export function formatDate(date) {
  // ...
}

// Ou export par défaut
export default function formatDate(date) {
  // ...
}
```

**Package npm = outil écrit par d'autres, utilisable après installation**

```javascript
// Installer le package : npm install lodash
// Utiliser le package
import _ from 'lodash'
```

::: info 💡 Astuce de reconnaissance
- Vous voyez `import` → importer des fonctionnalités depuis un autre fichier
- Vous voyez `export` → exposer des fonctionnalités pour que d'autres les utilisent
- Vous voyez `from 'react'` → importer depuis le package React
- Vous voyez `from './utils'` → importer depuis un fichier local
:::

---

## 5. Pratique : lire le code, comprendre les erreurs, décrire précisément

::: tip 🤔 Question centrale
**Après avoir appris toute cette syntaxe, comment l'utiliser concrètement face au code de l'IA ?** Comment lire rapidement le code ? Que faire face à une erreur ? Comment demander à l'IA de modifier le code avec précision ?
:::

### 5.1 Comment lire le code généré par l'IA

**Méthode en quatre étapes :**

| Étape | Ce qu'il faut regarder | Exemple |
|-------|------------------------|---------|
| **Étape 1 : Structure globale** | Combien de fonctions ? Que font-elles ? | `loadData()` charge les données, `renderList()` affiche la liste |
| **Étape 2 : Point d'entrée** | Où commence l'exécution du programme ? | `addEventListener('click', ...)` démarre au clic |
| **Étape 3 : Tracer le flux de données** | D'où viennent les données ? Où vont-elles ? | Récupérées de l'API → analysées → affichées sur la page |
| **Étape 4 : Logique détaillée** | Comment les fonctions spécifiques traitent-elles les données ? | Boucles, conditions, calculs |

**Faisons une « démonstration de lecture » complète avec l'exemple de code du chapitre 1 :**

```javascript
// Étape 1 : Structure globale
// - Un tableau de couleurs
// - Une variable qui enregistre l'index actuel
// - Un événement de clic sur un bouton

// Étape 2 : Point d'entrée
// button.addEventListener('click', ...) → s'exécute au clic sur le bouton

// Étape 3 : Flux de données
// colors (tableau de couleurs) → currentIndex (index actuel) → backgroundColor (couleur de fond)

// Étape 4 : Logique détaillée
// currentIndex = (currentIndex + 1) % colors.length
// Cette formule signifie : ajouter 1 à chaque fois, mais ne pas dépasser la longueur du tableau (cyclique)
```

### 5.2 Guide rapide des erreurs courantes

| Erreur | Explication simple | Comment en parler à l'IA |
|--------|-------------------|--------------------------|
| `TypeError: Cannot read properties of undefined` | Vous essayez d'accéder à une propriété sur quelque chose qui n'existe pas | « Erreur à la ligne X, telle variable est undefined, vérifie sa logique d'assignation » |
| `ReferenceError: xxx is not defined` | Vous utilisez un nom de variable qui n'a pas été déclaré | « La variable xxx n'est pas définie, est-ce une faute d'orthographe ou un oubli d'importation ? » |
| `TypeError: xxx is not a function` | Vous appelez comme une fonction quelque chose qui n'en est pas une | « xxx n'est pas une fonction, vérifie son type et sa provenance » |
| `SyntaxError: Unexpected token` | Erreur de syntaxe (parenthèses non appariées, virgule manquante, etc.) | « Erreur de syntaxe à la ligne X, vérifie les parenthèses et la ponctuation » |
| `CORS error` | Le navigateur bloque une requête cross-origin | « Erreur CORS, il faut configurer le partage de ressources cross-origin » |
| `404 Not Found` | La ressource demandée n'existe pas | « L'API retourne 404, vérifie si l'URL de l'endpoint est correcte » |

### 5.3 Comment décrire un problème avec précision

La différence entre un débutant et un développeur expérimenté se manifeste souvent dans **la précision avec laquelle ils décrivent un problème**.

| ❌ Mauvaise description | ✅ Bonne description |
|------------------------|---------------------|
| « Le code a un bug » | « Quand je clique sur le bouton supprimer, ce n'est pas l'élément actuel qui est supprimé mais le dernier » |
| « Le style n'est pas bon » | « Le titre devrait être centré, mais il est aligné à gauche » |
| « Les données ne s'affichent pas » | « La requête fetch retourne bien des données (visibles dans la console), mais la page ne se re-rend pas » |
| « Ajoute une fonctionnalité » | « Ajoute une barre de recherche sur la page de liste d'utilisateurs, qui filtre la liste en temps réel lors de la saisie, avec correspondance floue sur le champ name » |
| « Le clic ne fait rien » | « Au clic sur le bouton, la console affiche l'erreur 'Cannot read property of undefined', à la ligne X » |

**Un exercice pratique :**

```javascript
// Code avec un bug
function deleteTodo(index) {
  todos.splice(index, 1)  // Supprime toujours le dernier élément
}

// Symptôme : quel que soit le bouton supprimer cliqué, c'est toujours le dernier élément qui est supprimé
```

**❌ Mauvaise description :** « La fonction de suppression a un bug »

**✅ Bonne description :** « Quand je clique sur le bouton supprimer, ce n'est pas l'élément actuel qui est supprimé mais le dernier. Le code utilise splice(index, 1), mais l'index n'est probablement pas correct. Il faut utiliser l'id unique de chaque élément pour faire correspondre la suppression. »

### 5.4 Ce que vous devriez maintenant pouvoir reconnaître dans le code

- Voir `const/let` → savoir si une variable peut être réassignée
- Voir `{}` → objet / voir `[]` → tableau
- Voir `{...obj}` ou `[...arr]` → création d'une copie
- Voir `function` ou `=>` → définition d'une opération réutilisable
- Voir `if/else` ou `? :` → le code fait un jugement conditionnel
- Voir `.map()` / `.filter()` → transformation ou filtrage d'un tableau
- Voir `document.querySelector` → recherche d'un élément de la page
- Voir `addEventListener` → écoute d'une action utilisateur
- Voir `async/await` → attente d'une opération longue
- Voir `import/export` → importation ou exportation de modules
- Rencontrer une erreur → pouvoir comprendre l'essentiel et la décrire précisément à l'IA

**Si vous avez lu attentivement la partie « approfondissement » de chaque chapitre, vous maîtrisez également ces concepts fondamentaux :**

- **Valeur vs référence** : les types primitifs copient la valeur, les objets/tableaux copient l'adresse
- **Portée et fermeture** : une fonction peut « se souvenir » des variables qui l'entouraient à sa création
- **L'essence de this** : dépend de qui appelle la fonction, pas d'où elle est écrite
- **Boucle d'événements** : JS est mono-thread, il utilise la file de tâches pour rester « non-bloquant »

Ces concepts vous aideront à localiser les problèmes plus rapidement.

::: info 💡 Quand vous rencontrez un problème, parlez ainsi à l'IA
- « Erreur XXX à la ligne X, peux-tu voir quel est le problème ? »
- « La logique de cette fonction est XXX, mais le résultat n'est pas correct, il devrait être XXX »
- « Je veux modifier la fonctionnalité XXX, les exigences spécifiques sont XXX »
:::