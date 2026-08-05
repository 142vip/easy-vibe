# Principes : Environnement d'exécution JavaScript

::: tip Preface
Vous avez deja appris la syntaxe de base de JavaScript, mais vous etes-vous deja demande :
- Ou le code s'execute-t-il exactement ?
- Pourquoi le meme code se comporte-t-il differemment dans le navigateur et dans Node.js ?
- Pourquoi le code "se bloque" parfois, mais peut parfois s'executer "en parallele" ?

Cet article vous plongera dans l'environnement d'execution JavaScript, y compris la boucle d'evenements, la pile d'appels, la gestion de la memoire et bien plus encore. Apres avoir lu cet article, vous comprendrez pourquoi le code s'execute dans un certain ordre, vous saurez localiser rapidement les bugs lies a l'asynchronisme, optimiser les performances du code et eviter les fuites de memoire.
:::

**Ce que vous apprendrez dans cet article**

| Chapitre | Contenu | Ce que vous pourrez faire apres |
|----------|---------|-------------------------------|
| **Chapitre 1** | Apercu de l'environnement d'execution | Comprendre ou le code JavaScript s'execute |
| **Chapitre 2** | Runtime du navigateur | Connaitre les Web APIs fournis par le navigateur |
| **Chapitre 3** | Runtime Node.js | Decouvrir l'environnement JavaScript cote serveur |
| **Chapitre 4** | Boucle d'evenements approfondie | Maitriser l'ordre d'execution des macro-taches et micro-taches |
| **Chapitre 5** | Pile d'appels et memoire | Comprendre le processus d'execution du code et la gestion memoire |
| **Chapitre 6** | Conseils pratiques | Optimiser les performances, deboguer les fuites memoire |

---

## 1. Apercu de l'environnement d'execution

::: tip 🤔 Question principale
**Qu'est-ce qu'un "environnement d'execution" ?** JavaScript n'est qu'un langage — pourquoi le meme code se comporte-t-il differemment selon l'environnement ?
:::

### 1.1 Qu'est-ce qu'un environnement d'execution

**Runtime = moteur JavaScript + APIs fournies par l'environnement**

Si JavaScript est compare a un "langage de programmation", alors l'environnement d'execution est le "systeme d'exploitation" — il determine ce que votre code peut ou ne peut pas faire.

```
┌─────────────────────────────────────┐
│         Code JavaScript             │
├─────────────────────────────────────┤
│      Moteur JavaScript (V8)         │  ← Responsable de l'analyse et de l'execution du code
├─────────────────────────────────────┤
│      Environnement d'execution      │  ← Fournit des capacites supplementaires
│      (navigateur/Node.js)           │
└─────────────────────────────────────┘
```

**Une analogie : JavaScript est la "langue standard", le runtime est la "ville"**

- La syntaxe JavaScript (langue standard) est la meme partout
- Mais les installations proposees par differentes villes different :
  - Navigateur = dispose de DOM, window, fetch (comme une ville avec des centres commerciaux, des bibliotheques)
  - Node.js = dispose de fs, http, path (comme une ville avec des usines, des autoroutes)

### 1.2 Les deux principaux runtimes

| Caracteristique | Navigateur | Node.js |
|----------------|------------|---------|
| **Utilisation principale** | Interactions web, interface utilisateur | Applications serveur, outils en ligne de commande |
| **Objet global** | `window` | `global` |
| **API DOM** | ✅ Supportee | ❌ Non supportee |
| **Systeme de fichiers** | ❌ Limite | ✅ Entierement supporte |
| **Systeme de modules** | ES Modules | CommonJS + ES Modules |
| **Minuteurs** | `setTimeout`, `setInterval` | `setTimeout`, `setInterval` |
| **Requetes reseau** | `fetch`, `XMLHttpRequest` | Modules `http`, `https` |

👇 **Essayez par vous-meme** : Comparez les differences d'environnement entre le navigateur et Node.js

<RuntimeEnvironmentDemo />

::: info 💡 Lecon cles
Le runtime determine les APIs que vous pouvez utiliser. Les APIs DOM utilisables dans le navigateur ne le sont pas dans Node.js ; les APIs de fichier utilisables dans Node.js ne le sont pas dans le navigateur. C'est pourquoi certains codes necessitent une "verification d'environnement".
:::

---

## 2. Runtime du navigateur

::: tip 🤔 Question principale
**Quelles capacites le navigateur fournit-il pour permettre a JavaScript de manipuler les pages web ?**
:::

### 2.1 Composition du runtime navigateur

```
┌─────────────────────────────────────────────┐
│            Moteur JavaScript                 │
│            (V8 / SpiderMonkey)               │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│              Web APIs                        │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐     │
│  │   DOM   │ │   BOM    │ │ Network  │     │
│  │Manipuler│ │Manipuler │ │Requetes  │     │
│  │ la page │ │navigateur│ │reseau    │     │
│  └─────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           Boucle d'evenements (Event Loop)   │
│     Coordonne l'execution du code, le        │
│     traitement des evenements et la          │
│     planification des taches                 │
└─────────────────────────────────────────────┘
```

### 2.2 Les trois categories de Web APIs

**1. API DOM — Manipuler le contenu des pages web**

```javascript
// Trouver un element
const title = document.querySelector('h1')

// Modifier le contenu
title.textContent = 'Nouveau titre'

// Ajouter un style
title.style.color = 'red'
```

**2. API BOM — Controler le navigateur**

```javascript
// Navigation de page
window.location.href = 'https://example.com'

// Stockage du navigateur
localStorage.setItem('key', 'value')

// Historique du navigateur
history.back()
```

**3. API Network — Requetes reseau**

```javascript
// Envoyer une requete HTTP
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
```

### 2.3 Le mecanisme d'evenements specifique au navigateur

L'une des fonctionnalites les plus puissantes du runtime navigateur est le modele "evenementiel" — le code ne s'execute pas en permanence, mais attend les actions de l'utilisateur.

```javascript
button.addEventListener('click', () => {
  console.log('Le bouton a ete clique')
})
```

**Types d'evenements courants :**

| Type d'evenement | Moment du declenchement | Scenario pratique |
|-----------------|------------------------|-------------------|
| `click` | Clic de souris | Interaction avec un bouton |
| `input` | Changement du contenu d'un champ | Recherche en temps reel |
| `scroll` | Defilement de la page | Chargement paresseux |
| `load` | Chargement de ressource termine | Initialisation des donnees |
| `error` | Erreur survenue | Gestion des erreurs |

---

## 3. Runtime Node.js

::: tip 🤔 Question principale
**Grace a quoi JavaScript peut-il s'executer cote serveur ?**
:::

### 3.1 Composition de Node.js

```
┌─────────────────────────────────────────────┐
│            Moteur JavaScript                 │
│                 (V8)                         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           Modules integres Node.js           │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐     │
│  │   fs    │ │   http   │ │   path   │     │
│  │Operations│ │Serveur  │ │Traitement│     │
│  │fichiers │ │web      │ │chemins   │     │
│  └─────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│       Bibliotheque libuv (Event Loop)        │
│       Support I/O asynchrone multiplateforme │
└─────────────────────────────────────────────┘
```

### 3.2 Capacites specifiques a Node.js

**1. Operations sur le systeme de fichiers**

```javascript
const fs = require('fs')

// Lire un fichier
fs.readFile('./data.txt', 'utf8', (err, data) => {
  if (err) throw err
  console.log(data)
})

// Ecrire un fichier
fs.writeFile('./output.txt', 'Hello', (err) => {
  if (err) throw err
  console.log('Ecriture reussie')
})
```

**2. Serveur HTTP**

```javascript
const http = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end('<h1>Hello World</h1>')
})

server.listen(3000)
```

**3. Systeme de modules**

```javascript
// CommonJS (defaut dans Node.js)
const fs = require('fs')
module.exports = { myFunction }

// ES Modules (methode moderne)
import fs from 'fs'
export { myFunction }
```

### 3.3 Navigateur vs Node.js : comparaison

| Caracteristique | Navigateur | Node.js |
|----------------|------------|---------|
| **Fichier d'entree** | Fichier HTML | Fichier JavaScript |
| **Objets globaux** | `window`, `document` | `global`, `process` |
| **Chargement de modules** | Balise `<script>` | `require()` / `import` |
| **Securite** | Environnement sandbox, restreint | Acces aux ressources systeme |
| **Utilisation** | Interface utilisateur | Services backend, outils |

---

## 4. La boucle d'evenements en profondeur

::: tip 🤔 Question principale
**JavaScript est mono-thread, comment peut-il "ne pas bloquer" ?**
:::

### 4.1 Qu'est-ce que la boucle d'evenements

**Boucle d'evenements = le "centre de planification des taches" de JavaScript**

JavaScript est mono-thread et ne peut faire qu'une seule chose a la fois. Mais la boucle d'evenements donne l'illusion qu'il peut faire "simultanement" plusieurs choses.

**Mecanisme central :**

1. **Executer le code synchrone** (pile d'appels)
2. **Traiter les taches asynchrones** (file d'attente)
3. **Attendre de nouvelles taches** (boucle repetitive)

```
Pile d'appels              File d'attente
┌─────────┐              ┌──────────┐
│ Tache 1 │              │ Macro 1  │
│ Tache 2 │ ←────────────  │ Macro 2  │
│ Tache 3 │  une terminee │ Macro 3  │
└─────────┘  prend la suiv. └──────────┘
      ↓                        ↑
      └────────────────────────┘
       Boucle d'evenements verifie en continu
```

### 4.2 Macro-taches vs Micro-taches

C'est le concept le plus souvent confondu dans les entretiens et dans la pratique !

**Macro-taches (Macrotask) :**
- `setTimeout`, `setInterval`
- Operations I/O
- Rendu UI

**Micro-taches (Microtask) :**
- `Promise.then`
- `MutationObserver`
- `queueMicrotask`

**Ordre d'execution : code synchrone → micro-taches → macro-taches**

👇 **Essayez par vous-meme** : Observez l'ordre d'execution des macro-taches et micro-taches

<TaskQueueDemo />

### 4.3 Question classique d'entretien

```javascript
console.log('1')

setTimeout(() => console.log('2'), 0)

Promise.resolve().then(() => console.log('3'))

console.log('4')

// Sortie : 1, 4, 3, 2
```

**Pourquoi cet ordre ?**

1. Execution du code synchrone : `console.log('1')`, `console.log('4')` → sortie 1, 4
2. Verification de la file des micro-taches : `Promise.then` → sortie 3
3. Verification de la file des macro-taches : `setTimeout` → sortie 2

::: info 💡 Conseil pratique
- Pour une execution la plus rapide possible, utilisez les micro-taches (`Promise.then`)
- Pour retarder l'execution, utilisez les macro-taches (`setTimeout`)
- Ne melangez jamais trop d'operations asynchrones, sinon vous aboutirez a l'"enfer des callbacks"
:::

---

## 5. Pile d'appels et memoire

::: tip 🤔 Question principale
**Comment le code est-il execute ? Ou sont stockees les variables ? Quand sont-elles recuperees ?**
:::

### 5.1 Pile d'appels : les "empreintes" de l'execution des fonctions

**Pile d'appels = un "carnet de notes" enregistrant les appels de fonctions**

Chaque fois qu'une fonction est appelee, un nouvel enregistrement est ajoute sur la pile ; lorsque l'execution est terminee, l'enregistrement est supprime.

```javascript
function a() {
  b()
}

function b() {
  c()
}

function c() {
  console.log('Execution terminee')
}

a()
```

**Evolution de la pile d'appels :**

```
Etape 1 : appel de a()
┌─────────┐
│    a    │
└─────────┘

Etape 2 : a() appelle b()
┌─────────┐
│    b    │
│    a    │
└─────────┘

Etape 3 : b() appelle c()
┌─────────┐
│    c    │
│    b    │
│    a    │
└─────────┘

Etape 4 : c() terminee, depilage progressif
┌─────────┐
│    b    │
│    a    │
└─────────┘
```

👇 **Essayez par vous-meme** : Observez les changements de la pile d'appels

<CallStackDemo />

### 5.2 Gestion de la memoire : ou vont les dechets

JavaScript dispose d'un mecanisme de "ramasse-miettes automatique" — vous n'avez pas besoin de liberer la memoire manuellement, le moteur s'en charge pour vous.

**Principe du ramasse-miettes : algorithme Mark-and-Sweep**

1. **Phase de marquage** : a partir de la "racine", trouver toutes les variables accessibles
2. **Phase de balayage** : les variables non marquees sont des "dechets" et seront回收ees

```javascript
// Exemple de ramasse-miettes
let obj1 = { name: 'Objet1' }
let obj2 = { name: 'Objet2' }

// obj1 est reassigne, l'objet original perd sa reference
obj1 = null  // L'original { name: 'Objet1' } sera回收e

// obj2 est toujours utilise, ne sera pas回收
console.log(obj2.name)
```

👇 **Essayez par vous-meme** : Observez le processus de ramasse-miettes

<GarbageCollectionDemo />

### 5.3 Fuites memoire : les consequences de l'oubli de nettoyage

**Fuite memoire = memoire qui aurait du etre liberee ne l'est pas et s'accumule**

Causes courantes :

**1. Trop de variables globales**

```javascript
// ❌ Erreur : les variables globales ne sont pas回收ees
globalCache = []

function addItem(item) {
  globalCache.push(item)
}
```

**2. Ecouteurs d'evenements non supprimes**

```javascript
// ❌ Erreur : ecouteur non supprime
button.addEventListener('click', handleClick)

// ✅ Correct : supprimer l'ecouteur quand il n'est plus necessaire
button.removeEventListener('click', handleClick)
```

**3. Closures referencant de gros objets**

```javascript
// ❌ Erreur : la closure garde une reference vers un gros objet, non回收able
function createHandler() {
  const bigData = new Array(1000000).fill('data')
  return function() {
    console.log('Traitement en cours')
  }
}

const handler = createHandler()  // bigData reste en memoire
```

👇 **Essayez par vous-meme** : Observez comment les fuites memoire se produisent

<MemoryLeakDemo />

::: info 💡 Conseils pratiques
- **Verification reguliere** : ouvrir DevTools → Memory → Take Heap Snapshot, verifier l'utilisation memoire
- **Eviter les variables globales** : utiliser `const` et `let` plutot que `var`
- **Nettoyer immediatement** : supprimer les ecouteurs d'evenements et les minuteurs apres usage
- **References faibles** : utiliser `WeakMap` et `WeakSet` pour stocker les references d'objets
:::

---

## 6. Conseils pratiques

::: tip 🤔 Question principale
**Comment ecrire du code JavaScript haute performance ? Comment deboguer en cas de probleme ?**
:::

### 6.1 Conseils d'optimisation des performances

**1. Reduire les reflows et repaints**

```javascript
// ❌ Erreur : chaque iteration declenche un reflow
for (let i = 0; i < 1000; i++) {
  element.style.top = i + 'px'
}

// ✅ Correct : modification en lot
element.style.transform = `translateY(${position}px)`
```

**2. Utiliser la delegation d'evenements**

```javascript
// ❌ Erreur : ajouter un ecouteur a chaque bouton
buttons.forEach(btn => {
  btn.addEventListener('click', handleClick)
})

// ✅ Correct : ajouter un seul ecouteur au parent
container.addEventListener('click', (e) => {
  if (e.target.matches('.button')) {
    handleClick(e)
  }
})
```

**3. Debounce et Throttle**

```javascript
// Debounce : executer apres que l'utilisateur a arrete de saisir
function debounce(fn, delay) {
  let timer
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Throttle : limiter la frequence d'execution
function throttle(fn, delay) {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}
```

### 6.2 Conseils de debogage

**1. Consulter la pile d'appels avec DevTools**

```javascript
function a() {
  b()
}

function b() {
  c()
}

function c() {
  debugger  // Pause ici, examiner la pile d'appels
}

a()
```

**2. Suivre le chemin d'execution avec `console.trace()`**

```javascript
function trackExecution() {
  console.trace('Chemin d\'execution')
  // Affiche la pile d'appels complete
}
```

**3. Analyser les performances avec l'API Performance**

```javascript
performance.mark('start')

// Executer du code
for (let i = 0; i < 10000; i++) {
  // ...
}

performance.mark('end')
performance.measure('Performance boucle', 'start', 'end')

const measure = performance.getEntriesByName('Performance boucle')[0]
console.log(`Temps d'execution : ${measure.duration}ms`)
```

### 6.3 Reference rapide des problemes courants

| Probleme | Cause possible | Solution |
|----------|---------------|----------|
| **Utilisation memoire elevee** | Fuite memoire, cache excessif | Verifier les variables globales, supprimer les ecouteurs |
| **Page saccadee** | Taches longues bloquant le thread principal | Diviser les taches, utiliser les Web Workers |
| **Evenements non declenches** | Ecouteur non lie, element inexistant | Verifier le moment du chargement DOM |
| **Ordre asynchrone incorrect** | Melange de macro-taches et micro-taches | Utiliser uniformement Promise ou async/await |
| **Minuterie imprecise** | Thread principal bloque | Utiliser les Web Workers ou requestAnimationFrame |

---

## Resume

Vous devriez maintenant comprendre :

- **Runtime = moteur + APIs d'environnement**, differents runtimes fournissent differentes capacites
- **La boucle d'evenements** coordonne l'ordre d'execution du code synchrone, des micro-taches et des macro-taches
- **La pile d'appels** enregistre le processus d'execution des fonctions, le **depassement de pile** resulte d'une recursion trop profonde
- **Le ramasse-miettes** nettoie automatiquement les variables inutilisees, mais attention aux **fuites memoire**
- **L'optimisation des performances** consiste principalement a reduire les reflows/repaints et a utiliser judicieusement l'asynchronisme

::: info 💡 Comment parler a l'IA en cas de probleme
- "Cette fonction s'execute trop lentement, aide-moi a voir comment optimiser les performances"
- "L'utilisation memoire augmente sans cesse, c'est peut-etre une fuite memoire, aide-moi a verifier"
- "L'ordre des operations asynchrones est incorrect, ca devrait etre A puis B, mais A et B commencent presque en meme temps"
- "L'ecouteur d'evenement ne se declenche pas, verifie si l'element est deja charge dans le DOM"
:::
