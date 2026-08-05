# Fondamentaux : Patterns de conception logicielle

::: tip Avant-propos
**Pourquoi votre code est-il toujours « fonctionnel mais brouillon » ?** Vous avez peut-etre deja rencontre cette situation : les exigences changent et le code doit etre largement modifie ; vous voulez reutiliser une logique, mais elle est entremelee avec d'autres code. Les patterns de conception sont les « recettes d'organisation du code » resumees par les anciens, qui vous aident a ecrire du code flexible et maintenable.

Ce chapitre vous aide a comprendre les patterns de conception les plus pratiques — non pas pour les memoriser, mais pour comprendre « quel pattern utiliser dans quelle situation ».
:::

**Que allez-vous apprendre dans cet article ?**

| Chapitre | Contenu | Concept cle |
|-----|------|---------|
| **Chapitre 1** | Qu'est-ce qu'un pattern de conception | Nature et classification des patterns |
| **Chapitre 2** | Patterns de creation | Comment creer des objets elegamment |
| **Chapitre 3** | Patterns structurels | Comment organiser la structure du code |
| **Chapitre 4** | Patterns comportementaux | Comment gerer les interactions entre objets |

Apres ce chapitre, vous maitriserez les patterns de conception les plus couramment utilises et serez capable d'identifier les situations d'application dans des projets reels et de les utiliser de maniere flexible.

---

## 0. Vue d'ensemble : L'essence des patterns de conception

Imaginez que vous apprenez a cuisiner. Vous pouvez a chaque fois experimenter depuis le debut, ou apprendre des recettes classiques — les recettes ne limitent pas votre creativite, elles vous mettent sur les epaules de vos predecesseurs. Les patterns de conception sont les « recettes classiques » du monde de la programmation.

::: tip La valeur des patterns de conception
- **Langage commun** : Dire « utilisons le pattern Observer ici » permet a l'equipe de comprendre immediatement votre intention de conception
- **Reuse d'experience** : Pas besoin de refaire les memes erreurs que vos predecesseurs
- **Extension flexible** : Un bon pattern permet de ne faire que de petites modifications face aux changements, plutot que de gros remaniements
:::

Parcourez la classification et l'utilisation des patterns de conception courants avec le composant interactif ci-dessous :

<DesignPatternCatalogDemo />

---

## 1. Patterns de creation : Comment creer des objets elegamment

### 1.1 Pattern Singleton

**Scenario** : Une seule instance necessaire globalement, par exemple : gestionnaire de configuration, logger, pool de connexions de base de donnees.

```javascript
class ConfigManager {
  static instance = null

  static getInstance() {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  constructor() {
    this.config = {}
  }
}

// Quel que soit le nombre d'appels, c'est toujours la meme instance
const a = ConfigManager.getInstance()
const b = ConfigManager.getInstance()
console.log(a === b) // true
```

### 1.2 Pattern Fabrique (Factory)

**Scenario** : Creer differents types d'objets selon differentes conditions, sans que l'appelant ait besoin de connaitre les details de creation.

```javascript
function createNotification(type, message) {
  switch (type) {
    case 'email':
      return { send: () => console.log(`Envoyer email : ${message}`) }
    case 'sms':
      return { send: () => console.log(`Envoyer SMS : ${message}`) }
    case 'push':
      return { send: () => console.log(`Notification push : ${message}`) }
    default:
      throw new Error(`Type de notification inconnu : ${type}`)
  }
}

// L'appelant ne se soucie pas de l'implementation concrete
const notification = createNotification('email', 'Bonjour')
notification.send()
```

---

## 2. Patterns structurels : Comment organiser la structure du code

### 2.1 Pattern Adaptateur (Adapter)

**Scenario** : Deux interfaces incompatibles necessitent une « prise adapteur ». Par exemple, le format de donnees retourne par une ancienne API ne correspond pas au format attendu par un nouveau composant.

```javascript
// Format retourne par l'ancienne API
const oldApi = {
  getUserInfo: () => ({ user_name: 'Dupont', user_age: 25 })
}

// Adaptateur : conversion vers le nouveau format
function adaptUser(oldUser) {
  return { name: oldUser.user_name, age: oldUser.user_age }
}

const user = adaptUser(oldApi.getUserInfo())
// { name: 'Dupont', age: 25 }
```

### 2.2 Pattern Decorateur (Decorator)

**Scenario** : Ajouter de nouvelles fonctionnalites a un objet sans modifier le code existant. Comme mettre une coque sur un telephone — les fonctionnalites restent les memes, mais une protection est ajoutee.

```javascript
// Fonction de log de base
function log(message) {
  console.log(message)
}

// Decoration : ajout d'un horodatage
function withTimestamp(fn) {
  return (message) => fn(`[${new Date().toISOString()}] ${message}`)
}

// Decoration : ajout du niveau de log
function withLevel(fn, level) {
  return (message) => fn(`[${level}] ${message}`)
}

const enhancedLog = withTimestamp(withLevel(log, 'INFO'))
enhancedLog('Service demarre avec succes')
// [2025-01-15T10:30:00.000Z] [INFO] Service demarre avec succes
```

---

## 3. Patterns comportementaux : Comment gerer les interactions entre objets

### 3.1 Pattern Observateur (Observer)

**Scenario** : Lorsque l'etat d'un objet change, d'autres objets doivent etre automatiquement notifies. Par exemple : apres une commande utilisateur, il faut envoyer un email, deduire le stock et enregistrer un log simultanement.

```javascript
class EventEmitter {
  constructor() {
    this.listeners = {}
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(callback)
  }

  emit(event, data) {
    (this.listeners[event] || []).forEach(cb => cb(data))
  }
}

const bus = new EventEmitter()
bus.on('order:created', (order) => console.log('Envoyer email de confirmation', order.id))
bus.on('order:created', (order) => console.log('Deduire le stock', order.id))
bus.emit('order:created', { id: 'ORD-001' })
```

### 3.2 Pattern Strategie (Strategy)

**Scenario** : Une meme operation a plusieurs algorithmes/strategies, necessitant un changement au moment de l'execution. Par exemple : differentes methodes de tri, differentes regles de calcul de prix.

```javascript
const pricingStrategies = {
  normal: (price) => price,
  vip: (price) => price * 0.8,
  svip: (price) => price * 0.6
}

function calculatePrice(price, memberLevel) {
  const strategy = pricingStrategies[memberLevel] || pricingStrategies.normal
  return strategy(price)
}

calculatePrice(100, 'vip')  // 80
calculatePrice(100, 'svip') // 60
```

Experimenter les effets de differents patterns de conception avec le composant interactif ci-dessous :

<PatternPlaygroundDemo />

---

## 4. Approche et mise en œuvre : choisir un pattern de conception

| Probleme rencontre | Pattern recommande | Idee cle |
|-------------|---------|---------|
| Une seule instance globalement necessaire | Singleton | Controler le nombre d'instances |
| Creer differents objets selon les conditions | Fabrique | Encapsuler la logique de creation |
| Interfaces incompatibles necessitant une conversion | Adaptateur | Envelopper avec un calque de conversion |
| Ajouter des fonctionnalites dynamiquement | Decorateur | Renforcer par enveloppement successif |
| Changement d'etat notifiant plusieurs parties | Observateur | Decouplage par publication-abonnement |
| Plusieurs algorithmes a changer au moment de l'execution | Strategie | Encapsuler les algorithmes en objets |

::: tip Principe fondamental
Les patterns de conception ne sont pas « plus on en a, mieux c'est ». **L'over-engineering** est aussi mauvais que **l'absence de conception**. Utilisez des patterns uniquement la ou une veritable flexibilite est necessaire. Pour les problemes simples, des solutions simples. Rappelez-vous le principe KISS : Keep It Simple, Stupid.
:::

---

## 5. Support de l'IA : Apprendre et appliquer les patterns de conception avec les grands modeles linguistiques

Les grands modeles linguistiques peuvent vous aider a identifier les situations ou les patterns de conception sont applicables et a proposer des solutions de refactoring concretes.

### 5.1 Identifier les patterns applicables

> **Prompt** :
> ```
> Analysez le code suivant et determinez s'il existe des endroits
> ou des patterns de conception pourraient etre ameliores.
> Si oui, veuillez indiquer :
> 1. Le probleme dans le code actuel
> 2. Le pattern de conception recommande
> 3. Un exemple de code apres refactoring
> 4. Pourquoi ce pattern est adapte a ce scenario
>
> [Collez votre code ici]
> ```

### 5.2 Apprendre les patterns avec des scenarios concrets

> **Prompt** :
> ```
> Demontrez l'application des patterns de conception suivants en utilisant
> un scenario reel de « systeme de commande de livraison » :
> - Pattern Fabrique : creation de differents types de commandes
> - Pattern Observateur : notification des changements de statut de commande
> - Pattern Strategie : differentes regles de calcul des frais de livraison
>
> Utilisez des exemples de code JavaScript. Pour chaque pattern, montrez d'abord
> le probleme sans le pattern, puis l'amelioration avec le pattern.
> ```

### 5.3 Juger s'il y a over-engineering

> **Prompt** :
> ```
> Examinez le code suivant et jugez s'il existe un probleme d'over-engineering.
> Y a-t-il des abstractions inutiles, des patterns de conception non utilises
> ou des optimisations prematurees ? Si oui, suggerez des simplifications
> en suivant le principe KISS.
>
> [Collez votre code ici]
> ```

::: tip Conseil d'utilisation de l'IA
Laissez l'IA expliquer les patterns de conception avec des scenarios metier qui vous sont familiers — c'est beaucoup plus efficace que de regarder des diagrammes UML abstraits. Mais rappelez-vous : l'IA a tendance a recommander des solutions plus complexes. Vous devez juger par vous-meme si elles sont vraiment necessaires.
:::

---

## 6. Resume

1. **Patterns de creation** : Resolution du probleme « comment creer des objets », rendant le processus de creation plus flexible
2. **Patterns structurels** : Resolution du probleme « comment organiser le code », rendant la structure plus claire
3. **Patterns comportementaux** : Resolution du probleme « comment les objets interagissent », rendant la cooperation plus lachement couplee
4. **Utilisation flexible** : Choisir selon le scenario reel, ne pas utiliser de patterns pour utiliser des patterns

::: tip Reflexion finale
L'essence des patterns de conception est la **gestion du changement**. Une bonne conception rend les parties changeantes faciles a modifier et les parties stables, stables. Quand vous ecrivez du code, demandez-vous : « Si les exigences changent, combien d'endroits dois-je modifier ? » — Si la reponse est « beaucoup d'endroits », un pattern de conception pourrait vous aider.
:::

---

## Lectures complementaires

- **Livre classique** : « Design Patterns : Elements of Reusable Object-Oriented Software » du GoF est l'ouvrage fondateur des patterns de conception.
- **Perspective moderne** : En JavaScript, de nombreux patterns deviennent plus concis grace aux caracteristiques du langage (closures, fonctions d'ordre superieur).
- **Conseil pratique** : Comprenez d'abord le probleme, puis considerez les patterns. Ne cherchez pas des clous avec un marteau.
- **Apprentissage approfondi** : Decouvrez les principes SOLID, qui sont les principes directeurs derriere les patterns de conception.
