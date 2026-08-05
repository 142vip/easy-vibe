# Principes : Nature profonde des frameworks frontend

> 💡 **Guide d'apprentissage** : Cet article répond à une question fondamentale — **Que font réellement les frameworks frontend (Vue, React, Svelte, etc.) ?** Si vous ne connaissez que HTML, CSS et un peu de JavaScript, pas de problème, nous repartons de zéro.

Avant de commencer, assurez-vous de connaître ces deux concepts de base. Si vous avez un doute, consultez les chapitres correspondants :

- **HTML** : Le squelette de la page web, définissant les éléments présents sur la page (titres, paragraphes, boutons, images…). Voir [Mise en page HTML et CSS](./html-css-layout.md).
- **JavaScript** : Le langage de programmation qui rend la page "dynamique", capable de modifier le contenu et de répondre aux actions de l'utilisateur. Voir [Guide approfondi de JavaScript](./javascript-deep-dive.md).

Un autre concept apparaîtra fréquemment par la suite, faisons-en une présentation complète dès maintenant.

### Qu'est-ce que le DOM

DOM signifie Document Object Model (Modèle Objet de Document en français).

Lorsque vous ouvrez une page web dans votre navigateur, la première chose que fait le navigateur est de lire le code HTML. Une fois la lecture terminée, le navigateur n'utilise pas directement le texte HTML pour afficher la page, il **convertit d'abord le code HTML en une structure arborescente** stockée en mémoire. Cet arbre s'appelle l'arbre DOM.

Chaque nœud (Node) de l'arbre correspond à une balise HTML. Les relations d'imbrication entre les balises deviennent des relations parent-enfant dans l'arbre DOM.

👇 **Essayez par vous-même** :
Passez la souris sur le code HTML à gauche, le nœud correspondant dans l'arbre DOM à droite sera mis en surbrillance. L'inverse fonctionne aussi. Chaque ligne de balise HTML correspond à un nœud dans l'arbre DOM.

<WhatIsDomDemo />

**Pourquoi comprendre le DOM ?** Parce que la façon dont JavaScript modifie la page consiste à manipuler cet arbre DOM — ajouter des nœuds, supprimer des nœuds, modifier le contenu des nœuds. Et le travail principal des frameworks frontend est d'automatiser ces opérations DOM pour vous. Nous mentionnerons le DOM à plusieurs reprises par la suite, sa compréhension est la base pour comprendre le principe des frameworks.

---

## 0. Introduction : Qu'est-ce qu'un "framework frontend"

Commençons par expliquer le mot "framework". En programmation, un **framework** est un ensemble de code et de règles déjà écrits, qui définit comment votre code doit être organisé et exécuté. Vous écrivez votre code selon ses conventions, et il gère pour vous une grande quantité de travail répétitif et fastidieux de bas niveau.

Un **framework frontend** est un framework spécialement conçu pour vous aider à **construire des interfaces web**. Les plus courants actuellement sont Vue, React, Svelte et Angular.

Alors, quels problèmes résolvent-ils concrètement ? Les trois cartes ci-dessous résument la logique fondamentale :

<FrameworkMotivationDemo />

Détaillons maintenant étape par étape, en commençant par la question la plus basique.

---

## 1. Le problème central : les données changent, que devient l'interface

### 1.1 Comprenons d'abord ce que sont les "données" et "l'interface"

Dans toute application web, deux choses coexistent simultanément :

- **Les données (Data / State)** : Les informations stockées en interne par le programme. Par exemple "il y a 3 articles dans le panier", "le nom d'utilisateur est Zhang San", "le deuxième onglet est actuellement sélectionné". Ces données sont stockées dans des variables JavaScript, l'utilisateur ne les voit pas.
- **L'interface (UI)** : Ce que l'utilisateur voit à l'écran. Par exemple, la page affiche "Panier(3)", "Bienvenue, Zhang San", le deuxième onglet est en surbrillance. Ce sont les effets visuels produits par les éléments HTML.

**Il existe une correspondance entre les données et l'interface** : si la donnée est "3 articles", l'interface doit afficher "3". Si la donnée devient "4 articles", l'interface doit suivre et afficher "4".

La question est : **qui est responsable de ce "suivi" ?**

👇 **Essayez de cliquer** :
Cliquez sur le bouton "Ajouter un article", observez attentivement : les données (à gauche) ont déjà changé, mais l'interface (à droite) ne s'est pas mise à jour — elles sont "déconnectées". Cliquez ensuite sur "Synchroniser l'interface" pour réparer manuellement.

<DataUIGapDemo />

### 1.2 Pourquoi les variables JavaScript ne mettent-elles pas automatiquement à jour l'interface

C'est le point le plus déroutant pour les débutants, expliquons le principe sous-jacent étape par étape.

En JavaScript, une variable est un espace mémoire utilisé pour stocker des données. Lorsque vous exécutez `count = count + 1`, ce que fait le moteur JavaScript est très simple : il change la valeur à l'emplacement mémoire de `count` de 3 à 4. **Une fois cette étape terminée, c'est fini, rien d'autre ne se produit.**

Or, le contenu affiché sur la page (comme le nœud DOM `<span>3</span>`) est stocké dans un espace mémoire totalement différent. Lorsque le moteur JavaScript modifie la variable, il ne sait absolument pas qu'il existe un nœud DOM sur la page qui affiche la valeur de cette variable, et il n'existe aucun mécanisme pour qu'il le vérifie.

La raison fondamentale est donc : **les variables JavaScript et les nœuds DOM sont deux espaces mémoire indépendants, sans aucun mécanisme de liaison automatique entre eux.** Modifier une variable ne change que la mémoire où se trouve la variable, la mémoire où se trouve le nœud DOM n'est aucunement affectée.

```javascript
let count = 3

// Il y a un nœud DOM sur la page qui affiche la valeur de count :
// <span id="counter">3</span>

count = 4
// Qu'a fait le moteur JavaScript ?
//   → Il a changé la valeur de la variable count en mémoire de 3 à 4
//   → Terminé. C'est tout.
// L'affichage dans le <span> de la page reste "3"
```

Si vous voulez que l'affichage sur la page devienne aussi "4", vous devez **écrire du code supplémentaire**, trouver manuellement ce nœud DOM, puis modifier son contenu :

```javascript
count = 4  // Étape 1 : modifier la variable

// Étape 2 : vous devez écrire vous-même — trouver le nœud DOM et changer son texte
document.getElementById('counter').textContent = count
```

Si la valeur de `count` est affichée à 5 endroits sur la page (quantité dans le panier, liste de produits, prix total, sous-total, indication d'état), vous devez écrire 5 blocs de code comme celui-ci. **Si vous en oubliez un seul, cet endroit affichera toujours l'ancienne valeur, et l'utilisateur verra une information erronée.**

### 1.3 Que fait le framework Deux étapes pour établir une connexion automatique

La synchronisation automatique du framework repose sur **la collaboration de deux étapes** — l'une ne va pas sans l'autre.

**Première étape : vous "enregistrez" dans le template les endroits qui doivent afficher cette variable**

Dans le template HTML du framework, vous utilisez une syntaxe comme `{{ count }}` pour indiquer "ici, afficher la valeur de count" :

```html
<!-- Template Vue -->
<span>Panier : {{ count }} articles</span>    <!-- Position A : je veux afficher count -->
<span>Total : ¥{{ count * 99 }}</span>   <!-- Position B : j'utilise aussi count -->
<span>{{ count > 5 ? 'Trop' : 'Normal' }}</span>  <!-- Position C : j'utilise aussi count -->
```

Lors du premier rendu de la page, le framework enregistre cette "relation d'enregistrement" : **les positions A, B, C dépendent toutes de count**.

**Deuxième étape : le framework surveille la variable, consulte le registre en cas de changement, et met à jour automatiquement**

Le framework utilise le mécanisme intégré `Proxy` de JavaScript pour "envelopper" votre variable, la transformant en une "variable surveillée". Lorsque vous modifiez cette variable, le Proxy intercepte l'écriture et fait discrètement une chose supplémentaire : notifier le framework que "count a changé". Le framework reçoit la notification, consulte le registre de la première étape, et met à jour les trois positions A, B, C.

```
JavaScript natif :
  Vous écrivez du HTML → <span id="counter">3</span> (aucune connexion avec la variable)
  Vous modifiez la variable → count = 4 → terminé, l'interface ne réagit pas
  Vous corrigez manuellement → document.getElementById('counter').textContent = 4 → l'interface se met enfin à jour

Framework Vue :
  Vous écrivez un template → <span>{{ count }}</span> (le framework retient : ici dépend de count)
  Vous modifiez la variable → count = 4 → Proxy intercepte → notifie le framework → le framework consulte le registre → met à jour automatiquement A/B/C
```

C'est pourquoi "seul le framework peut synchroniser automatiquement" — il n'y a absolument aucune connexion entre un `<span>` en HTML natif et une variable JS. C'est la syntaxe de template du framework (`{{ }}`) qui est la clé pour établir cette connexion. Vous écrivez `{{ count }}`, le framework sait alors qu'ici il faut afficher count ; et il peut, lorsque count change, trouver précisément cet endroit et le mettre à jour.

👇 **Essayez de cliquer** :
Sélectionnez d'abord "JavaScript natif", cliquez sur "Exécuter" et observez — la variable change mais l'interface reste figée, vous devez synchroniser manuellement chaque position étape par étape. Puis passez à "Utiliser un framework", cliquez de même sur "Exécuter" — dès que la variable change, le framework accomplit automatiquement toutes les étapes, l'interface suit immédiatement.

<WhyNoAutoSyncDemo />

### 1.4 Comparaison : synchronisation manuelle vs synchronisation automatique en pratique

Après avoir compris le principe, voyons à quel point la différence est grande entre synchronisation manuelle et automatique dans un scénario un peu plus complexe.

👇 **Essayez de cliquer** :
À gauche, la méthode "synchronisation manuelle" sans framework — vous devez cliquer séparément sur le bouton "Synchroniser" pour chaque zone d'affichage. À droite, la méthode "synchronisation automatique" avec un framework — vous cliquez simplement sur "Ajouter un article", toutes les zones d'affichage se mettent à jour automatiquement. Essayez de ne pas synchroniser volontairement une zone à gauche et voyez ce qui se passe.

<ManualVsAutoSyncDemo />

**C'est la raison fondamentale d'être des frameworks frontend : doter les variables JavaScript de la capacité de "notifier automatiquement l'interface lors d'une modification", éliminant les erreurs causées par la synchronisation manuelle.**

---

## 2. L'idée centrale du framework : décrire l'interface avec des données

### 2.1 La différence entre les deux styles d'écriture

Après avoir compris la valeur de la "synchronisation automatique", voyons comment le framework la réalise concrètement.

À l'époque sans framework (par exemple avec jQuery), le code s'écrivait ainsi — vous disiez au navigateur quoi faire, étape par étape :

```javascript
// Étape 1 : trouver l'élément avec l'id "counter" sur la page
var element = document.getElementById('counter')
// Étape 2 : changer le contenu textuel de cet élément par la nouvelle valeur
element.textContent = '4'
// Étape 3 : trouver un autre élément et le modifier aussi
document.getElementById('total').textContent = '¥396'
// Étape 4 : si la quantité est supérieure à 5, modifier aussi l'indication d'état…
```

Ce style d'écriture s'appelle **impératif (Imperative)** — vous "commandez" au navigateur d'exécuter des opérations une par une.

Avec un framework, le code devient ainsi — vous décrivez seulement "à quoi l'interface doit ressembler" :

```html
<!-- Je ne me soucie pas de comment cette valeur est mise à jour sur la page -->
<!-- Je dis seulement : ici doit s'afficher la valeur de count -->
<span>{{ count }}</span>
<span>Total : ¥{{ count * 99 }}</span>
<span v-if="count > 5">Trop d'articles !</span>
```

Ce style d'écriture s'appelle **déclaratif (Declarative)** — vous "déclarez" l'état final de l'interface, quant à la façon d'atteindre cet état, le framework s'en charge lui-même.

### 2.2 La formule fondamentale : UI = f(State)

Tous les frameworks frontend modernes — qu'il s'agisse de Vue, React ou Svelte — suivent la même idée centrale, qui peut s'exprimer par une formule :

> **UI = f(State)**

Cette formule signifie :

- **State (État)** : les données de votre application. Ce sont ces variables en JavaScript : combien d'articles dans le panier, l'utilisateur est-il connecté, quelle est la page actuelle…
- **f (Fonction)** : le mécanisme de rendu du framework. Il sait comment transformer les données en interface.
- **UI (Interface)** : le résultat final que l'utilisateur voit à l'écran.

**Signification** : étant donné un ensemble de données (State), traité par le framework (f), on obtient de manière déterministe l'interface correspondante (UI). Les données changent, l'interface suit. Le développeur n'a qu'à se préoccuper des données, pas de la façon dont l'interface se met à jour.

👇 **Essayez de cliquer** :
Modifiez les données (State) à gauche et observez comment l'interface (UI) à droite change automatiquement en conséquence. C'est la manifestation visuelle de `UI = f(State)`.

<DeclarativeFormulaDemo />

### 2.3 Pourquoi le déclaratif est-il meilleur que l'impératif

Les avantages du style déclaratif :

| Dimension | Impératif (sans framework) | Déclaratif (avec framework) |
| :--- | :--- | :--- |
| **Quantité de code** | Écrire du code d'opération spécifique pour chaque mise à jour | Écrire le template une seule fois, le framework gère automatiquement |
| **Risque d'erreur** | Facile d'oublier de mettre à jour un endroit | Le framework garantit que tous les endroits sont mis à jour |
| **Lisibilité** | Le code est encombré d'opérations DOM | Le code décrit clairement la structure de l'interface |
| **Coût de maintenance** | Modifier une fonctionnalité nécessite de changer beaucoup d'endroits | Il suffit de modifier la logique des données, l'interface suit automatiquement |

En bref : le déclaratif vous permet de vous concentrer sur la "logique métier" (comment les données évoluent), sans vous soucier de "comment l'interface se met à jour", une tâche répétitive et source d'erreurs.

---

## 3. Le système réactif : comment le framework sait-il que les données ont changé

### 3.1 Qu'est-ce que la "réactivité"

Nous avons dit plus haut "les données changent, l'interface se met à jour automatiquement". Mais il y a ici un problème technique : **JavaScript lui-même n'a pas la capacité de "notifier automatiquement les autres lorsqu'une variable est modifiée"**.

Quand vous écrivez `count = 4`, JavaScript change simplement la valeur de `count` de 3 à 4, sans avertir automatiquement qui que ce soit. Le framework a besoin d'un mécanisme pour "détecter" que vous avez modifié les données.

**La réactivité (Reactivity)** est le terme générique pour ce mécanisme : lorsque les données changent, le système peut automatiquement percevoir le changement et exécuter les opérations de mise à jour correspondantes.

### 3.2 Trois implémentations différentes

Différents frameworks adoptent différentes solutions techniques pour implémenter la réactivité. C'est aussi la différence la plus fondamentale entre Vue, React et Svelte.

**Méthode 1 : Interception par Proxy (l'approche de Vue)**

Vue utilise le mécanisme intégré `Proxy` de JavaScript. Un `Proxy` peut exécuter automatiquement un code que vous spécifiez lorsque vous lisez ou modifiez une propriété d'un objet.

Vue enveloppe votre objet de données avec un `Proxy`. Lorsque vous exécutez `count = 4`, le `Proxy` intercepte cette opération d'écriture et notifie Vue : "la valeur de count a changé", puis Vue met à jour toutes les parties de l'interface qui utilisent `count`.

En tant que développeur, vous n'avez rien de supplémentaire à faire — une simple affectation suffit, Vue le détecte automatiquement.

**Méthode 2 : Appel explicite (l'approche de React)**

React n'utilise pas `Proxy`. Il exige que vous passiez par une fonction dédiée pour modifier les données :

```javascript
// Écriture React
const [count, setCount] = useState(0)

// Vous ne pouvez pas écrire count = 4 (React ne le percevra pas)
// Vous devez appeler setCount :
setCount(4)
```

C'est seulement lorsque vous appelez `setCount()` que React sait que les données ont changé et met à jour l'interface. Si vous écrivez directement `count = 4`, React n'en sait absolument rien, l'interface ne se met pas à jour.

Cette approche est plus "explicite" — chaque changement de donnée est signalé activement par vous au framework, il n'y a pas de mise à jour inattendue.

**Méthode 3 : Analyse par compilateur (l'approche de Svelte)**

Svelte emprunte une voie totalement différente. Il dispose d'un compilateur (Compiler) qui, avant l'exécution de votre code, analyse d'abord votre code source.

Quand le compilateur voit que vous avez écrit une instruction d'affectation comme `count += 1`, il insère automatiquement après cette ligne un morceau de code qui "notifie la mise à jour de l'interface". Autrement dit, au moment de l'exécution, l'action de "notification" a déjà été prévue à l'avance par le compilateur.

Votre code ressemble à une simple affectation JavaScript ordinaire, mais le code compilé contient en plus la logique de mise à jour de l'interface.

👇 **Essayez de cliquer** :
Sélectionnez différents onglets de framework, cliquez sur "Modifier les données" et observez les étapes que chaque framework traverse "sous le capot" pour détecter le changement de données et mettre à jour l'interface.

<ReactivityMechanismDemo />

### 3.3 Comparaison des trois méthodes

| Dimension | Vue (Proxy) | React (Appel explicite) | Svelte (Compilateur) |
| :--- | :--- | :--- | :--- |
| **Style d'écriture** | Affectation directe `count = 4` | Obligation d'utiliser `setCount(4)` | Affectation directe `count = 4` |
| **Moment de détection du changement** | Interception automatique à l'exécution | Notification active du développeur | Code de notification inséré à la compilation |
| **Surcoût à l'exécution** | Léger surcoût d'interception du Proxy | Léger surcoût d'ordonnancement de setState | Presque aucun surcoût |
| **Difficulté de débogage** | Moyenne | Flux de données clair, plus facile | Nécessite de comprendre le code compilé |
| **Scénario adapté** | Recherche d'efficacité et écriture naturelle | Recherche de flux de données prévisible | Recherche de performance d'exécution maximale |

Aucune des trois méthodes n'est absolument meilleure. Vue est le plus naturel à écrire, React offre le flux de données le plus contrôlable, Svelte a les meilleures performances d'exécution. Le choix dépend des besoins spécifiques du projet.

---

## 4. Les composants : découper l'interface en blocs réutilisables

### 4.1 Pourquoi découper

Une page web complète peut avoir une barre de navigation, une barre latérale, une zone de contenu, une boîte de recherche, un avatar utilisateur, divers boutons… Si tout le code est écrit dans un seul fichier, ce fichier deviendra extrêmement long et très difficile à maintenir.

Un **composant (Component)** consiste à découper l'interface en blocs indépendants, chaque bloc gérant ses propres données, sa propre interface et sa propre logique.

Par exemple, une page e-commerce peut être décomposée en ces composants :

- Composant `NavBar` : responsable de la barre de navigation supérieure
- Composant `SearchBox` : responsable de la boîte de recherche
- Composant `ProductCard` : responsable d'une fiche produit
- Composant `ShoppingCart` : responsable du panier d'achat

Chaque composant est indépendant. `ProductCard` n'a pas besoin de savoir quel code est écrit dans `NavBar`, il doit seulement bien gérer son propre fonctionnement.

### 4.2 Les trois avantages des composants

**Avantage 1 : Réutilisation.** Un composant `ProductCard`, une fois écrit, peut être utilisé 100 fois sur la page — à chaque fois en passant des données de produit différentes, il affichera des fiches produits différentes. Pas besoin de copier-coller 100 blocs de code HTML.

**Avantage 2 : Encapsulation.** Les données et la logique internes d'un composant sont indépendantes. Modifier le code du composant `SearchBox` n'affecte pas le composant `ProductCard`. En collaboration multi-personnes, différentes personnes peuvent développer simultanément différents composants sans interférence mutuelle.

**Avantage 3 : Maintenabilité.** Lorsqu'une fonctionnalité rencontre un problème, vous pouvez directement localiser le composant correspondant pour le réparer, sans avoir à chercher dans un énorme fichier de plusieurs milliers de lignes.

👇 **Essayez de cliquer** :
Cliquez sur le nom d'un composant à gauche pour voir la zone correspondante sur la page. Remarquez : le même composant `ProductCard` est réutilisé plusieurs fois, affichant à chaque fois des données différentes.

<ComponentTreeDemo />

### 4.3 À quoi ressemble un composant dans le code

Avec Vue, un composant est un fichier `.vue` contenant trois parties :

```html
<!-- ProductCard.vue -->
<template>
  <!-- Ici la structure HTML — "l'apparence" du composant -->
  <div class="card">
    <h3>{{ name }}</h3>
    <p>Prix : ¥{{ price }}</p>
    <button @click="addToCart">Ajouter au panier</button>
  </div>
</template>

<script setup>
// Ici la logique JavaScript — le "comportement" du composant
const props = defineProps(['name', 'price'])

function addToCart() {
  // Gérer la logique "d'ajout au panier"
}
</script>

<style scoped>
/* Ici les styles CSS — le "style" du composant */
.card {
  border: 1px solid #ccc;
  padding: 16px;
}
</style>
```

Utiliser ce composant, c'est comme utiliser une balise HTML personnalisée :

```html
<!-- Utilisation du composant ProductCard ailleurs -->
<ProductCard name="Écouteurs sans fil" price="299" />
<ProductCard name="Clavier mécanique" price="599" />
<ProductCard name="Écran" price="1999" />
```

Trois lignes de code suffisent pour afficher trois fiches produits différentes.

---

## 5. Le coût des opérations DOM : pourquoi le framework fait-il autant d'efforts

### 5.1 Qu'est-ce qu'une opération DOM

Nous avons mentionné le DOM plus tôt — la structure arborescente générée par le navigateur après l'analyse du HTML. Une **opération DOM** consiste à utiliser JavaScript pour modifier les nœuds de cet arbre. Par exemple, changer un texte, ajouter un élément, supprimer un élément, modifier un style.

Ces opérations ne sont pas complexes en elles-mêmes, mais le navigateur, après avoir exécuté une opération DOM, doit effectuer beaucoup de travail supplémentaire pour que l'affichage à l'écran soit mis à jour :

1. **Recalculer les styles** : les styles CSS de ce nœud et de ses nœuds enfants doivent-ils changer ?
2. **Recalculer la mise en page (Layout / Reflow)** : la position et la taille de tous les éléments de la page doivent être recalculées. Car le changement d'un élément peut affecter la position d'autres éléments.
3. **Redessiner (Paint)** : dessiner le contenu calculé à l'écran.

Chacune de ces trois étapes a un coût de calcul. Si votre code déclenche fréquemment des opérations DOM, le navigateur exécutera ces étapes de façon répétée et la page deviendra saccadée.

👇 **Essayez de cliquer** :
Observez la comparaison du temps d'exécution entre l'opération DOM directe et l'opération DOM par lots. Lorsque le nombre de modifications augmente, le temps d'exécution "une par une" grimpe fortement.

<DomOperationCostDemo />

### 5.2 Comment le framework résout-il ce problème

Puisque l'opération DOM directe est coûteuse, le framework cherche à **réduire le nombre d'opérations DOM**. Il existe deux stratégies :

**Stratégie 1 : DOM virtuel + comparaison de différences (l'approche de Vue et React)**

Le DOM virtuel (Virtual DOM) est un objet JavaScript dont la structure correspond exactement à l'arbre DOM réel, mais il n'existe qu'en mémoire et ne déclenche pas la mise en page ni le dessin du navigateur.

Lorsque les données changent, le processus du framework est :

1. Créer un "nouvel arbre DOM virtuel" avec des objets JavaScript, décrivant à quoi l'interface devrait ressembler après le changement de données
2. Comparer ce nouvel arbre avec l'ancien (ce processus s'appelle **Diff**, c'est-à-dire la comparaison de différences), pour identifier les nœuds qui ont changé
3. Appliquer uniquement les parties réellement modifiées au DOM réel (ce processus s'appelle **Patch**, c'est-à-dire l'application de correctifs)

Ainsi, quels que soient les changements de données, les opérations sur le DOM réel sont toujours minimales.

👇 **Essayez de cliquer** :
Cliquez sur "Modifier les données" et observez comment le DOM virtuel compare les deux arbres pour trouver les nœuds modifiés. Regardez bien le "DOM réel" tout à droite — seules les parties réellement modifiées clignoteront.

<VirtualDomDiffDemo />

**Stratégie 2 : Positionnement précis au moment de la compilation (l'approche de Svelte)**

Svelte n'utilise pas de DOM virtuel. Son compilateur analyse déjà lors de l'écriture du code : "quand `count` change, il faut mettre à jour l'élément `<span>` à la ligne 3". À l'exécution, il localise directement cet élément et le met à jour, sans avoir besoin de comparer les deux arbres.

Cette approche saute l'étape de Diff, ce qui est théoriquement plus performant. Mais elle dépend de la capacité d'analyse du compilateur — le compilateur doit être suffisamment intelligent pour identifier correctement tous les endroits nécessitant une mise à jour.

---

## 6. Temps d'exécution vs temps de compilation : le compromis central dans la conception des frameworks

### 6.1 Les deux phases

Le code frontend, depuis son écriture jusqu'à son exécution finale dans le navigateur, passe par deux phases :

- **Temps de compilation (Compile-time / Build-time)** : votre code source est traité par des outils de construction (comme Vite, Webpack), qui le transforment en code directement exécutable par le navigateur. Ce processus a lieu sur votre ordinateur, avant que l'utilisateur n'ouvre la page web.
- **Temps d'exécution (Runtime)** : le code transformé s'exécute dans le navigateur de l'utilisateur. La logique centrale du framework (comme le Diff du DOM virtuel, le traçage de la réactivité) travaille pendant cette phase.

### 6.2 Répartition du travail du framework entre ces deux phases

Les différents frameworks répartissent différemment la charge de travail entre ces deux phases, ce qui détermine leurs caractéristiques de performance et la taille de leur bundle :

- **React** : la majeure partie du travail se fait au runtime. La création du DOM virtuel, le Diff, le Patch ont tous lieu dans le navigateur. L'avantage est une grande flexibilité ; le coût est qu'il faut envoyer tout le code d'exécution du framework (environ 40 Ko) au navigateur.
- **Vue** : approche hybride. Les templates sont optimisés à la compilation (le compilateur marque les nœuds statiques qui ne changeront pas), mais la mise à jour finale de l'interface passe toujours par le DOM virtuel au runtime. Le code d'exécution fait environ 30 Ko.
- **Svelte** : la majeure partie du travail se fait à la compilation. Le compilateur analyse votre code et génère directement des instructions précises de mise à jour du DOM. Au runtime, il n'y a presque pas de code de framework — le résultat final ne contient que votre propre code métier. La taille du bundle est la plus petite.

👇 **Essayez de cliquer** :
Cliquez sur les différents onglets de framework pour voir leur position sur le spectre "Runtime ↔ Compile-time", ainsi que leurs compromis respectifs en termes de taille de bundle, performance d'exécution et expérience de développement.

<FrameworkSpectrumDemo />

### 6.3 Tendances du secteur

Ces dernières années, la direction de développement des frameworks est claire : **déplacer de plus en plus de travail du runtime vers le compile-time**. Car le calcul au moment de la compilation ne consomme pas les ressources de l'appareil de l'utilisateur et n'affecte pas la vitesse de chargement de la page.

- **Vue** développe le Vapor Mode, qui peut sauter le DOM virtuel et générer directement du code d'opération DOM à la compilation
- **React** a lancé React Compiler, qui optimise automatiquement le comportement de re-rendu des composants à la compilation
- **Svelte 5** a introduit le système Runes, renforçant encore la capacité d'analyse à la compilation

---

## 7. Résumé

Récapitulons les points essentiels de cet article :

**Le problème fondamental résolu par les frameworks frontend** : lorsque les données d'une application changent, mettre à jour l'interface de manière automatique, efficace et fiable, sans que le développeur ait à manipuler manuellement le DOM.

**L'idée centrale qu'ils partagent tous** : UI = f(State) — l'interface est une fonction des données, le développeur n'a qu'à se concentrer sur l'évolution des données, le framework se charge de refléter ces changements sur l'interface.

**Leurs différences techniques clés** :

| Point technique | Signification |
| :--- | :--- |
| **Système réactif** | Comment le framework détecte les changements de données. Vue utilise l'interception par Proxy, React utilise setState explicite, Svelte utilise l'analyse par compilateur. |
| **DOM virtuel** | Vue et React utilisent un objet JavaScript pour simuler l'arbre DOM, comparent les deux arbres (Diff) pour trouver le minimum de mises à jour nécessaires et réduire les opérations DOM réelles. |
| **Composants** | Découper l'interface en blocs indépendants et réutilisables, chaque composant gérant ses propres données et son interface. |
| **Optimisation à la compilation** | Analyser et optimiser à l'avance pendant la phase de construction du code pour réduire la charge de calcul au runtime. Svelte est allé le plus loin dans cette direction. |

**En une phrase** : le travail essentiel des frameworks frontend est de prendre en charge le processus de synchronisation "des données vers l'interface", permettant au développeur de ne penser qu'à la logique des données, sans avoir à manipuler l'interface manuellement.

---

## Tableau de correspondance des termes

| Terme anglais | Correspondance française | Explication |
| :--- | :--- | :--- |
| **Framework** | Framework | Un ensemble de code et de règles pré-écrits, fournissant aux développeurs la structure de base et les fonctionnalités courantes d'une application. |
| **DOM** | Modèle Objet de Document | Structure de données arborescente générée par le navigateur après l'analyse du HTML, que JavaScript manipule pour modifier la page. |
| **Virtual DOM** | DOM virtuel | Simulation de l'arbre DOM par un objet JavaScript, utilisant l'algorithme Diff pour trouver le chemin de mise à jour minimal et réduire le nombre d'opérations DOM réelles. |
| **State** | État | Les données de l'application, comme les informations utilisateur, le contenu du panier, l'état actuel de la page, etc. |
| **Reactivity** | Réactivité | Quand les données changent, le système peut automatiquement le percevoir et exécuter les opérations de mise à jour de l'interface correspondantes. |
| **Proxy** | Proxy | Mécanisme intégré de JavaScript permettant d'intercepter les opérations de lecture et d'écriture sur un objet. Vue 3 l'utilise pour implémenter la réactivité. |
| **Component** | Composant | Un bloc de code d'interface indépendant et réutilisable, contenant sa propre structure HTML, sa logique JavaScript et ses styles CSS. |
| **Declarative** | Déclaratif | Un style de programmation : vous décrivez "quel résultat final vous voulez", et le framework décide comment y parvenir. |
| **Imperative** | Impératif | Un style de programmation : vous dites au programme "quoi faire concrètement", étape par étape. |
| **Diff** | Comparaison de différences | Comparer les deux arbres DOM virtuels (ancien et nouveau) pour identifier les nœuds qui ont changé. |
| **Patch** | Application de correctifs | Appliquer les parties modifiées trouvées par le Diff au DOM réel. |
| **Compile-time** | Temps de compilation | La période où le code est traité pendant la phase de construction, avant que l'utilisateur n'ouvre la page web. |
| **Runtime** | Temps d'exécution | La période où le code s'exécute dans le navigateur de l'utilisateur. |
| **Compiler** | Compilateur | Un programme qui transforme le code source en une autre forme de code. Le compilateur de Svelte transforme les fichiers `.svelte` en JavaScript efficace. |
