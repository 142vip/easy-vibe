# Principes : Système de types TypeScript

::: tip Préface
Vous savez déjà écrire du JavaScript, mais vous avez peut-être rencontré ces problèmes :
- Assigner un mauvais type à une variable, découvert seulement à l'exécution
- Mal orthographier un nom de propriété d'objet et déboguer pendant des heures
- Types de paramètres de fonction incorrects, obligeant à modifier sans cesse

TypeScript est l'outil qui vous aide à détecter ces problèmes avant l'exécution du code. Après avoir lu ce guide, vous comprendrez pourquoi TypeScript améliore la qualité du code, vous saurez lire les annotations de type, les interfaces, les génériques et autres concepts fondamentaux, et vous pourrez mieux exploiter le code généré par l'IA en vibecoding.
:::

**Ce que vous allez apprendre dans cet article :**

| Chapitre | Contenu | Ce que vous saurez faire |
|-----|------|-----------|
| **Chapitre 1** | Qu'est-ce que TypeScript | Comprendre sa relation avec JavaScript |
| **Chapitre 2** | Annotations de type de base | Savoir annoter les types des variables |
| **Chapitre 3** | Types d'objets et interfaces | Définir les types des structures de données |
| **Chapitre 4** | Types de fonctions | Annoter les types des paramètres et des valeurs de retour |
| **Chapitre 5** | Génériques | Écrire du code réutilisable et type-safe |
| **Chapitre 6** | Inférence de type et astuces pratiques | Savoir quand une annotation explicite est nécessaire |

---

## 1. Qu'est-ce que TypeScript

::: tip 🤔 Question centrale
**JavaScript est déjà suffisant, pourquoi a-t-on besoin de TypeScript ?** Cela vaut-il la peine d'apprendre une syntaxe supplémentaire ?
:::

### 1.1 Passer des « erreurs à l'exécution » aux « erreurs à la compilation »

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🔴 Points faibles de JavaScript**
- Les erreurs de type ne sont découvertes qu'à l'exécution
- Les fautes de frappe sont difficiles à repérer
- Le refactoring est sujet aux oublis
- L'auto-complétion de l'IDE n'est pas assez précise

*Comme un éditeur de documents sans correcteur orthographique*

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**✅ Avantages de TypeScript**
- Les erreurs sont détectées dès l'écriture du code
- L'auto-complétion intelligente est plus précise
- Le refactoring est plus sûr
- Le code est plus facile à maintenir

*Comme un éditeur avec correcteur orthographique et coloration syntaxique*

</div>
</div>

**Pour comprendre la relation entre les deux en une phrase :**

| Technologie | Analogie | Rôle |
|------|------|------|
| **JavaScript** | Matière première | Code exécutable directement |
| **TypeScript** | Plan + contrôle qualité | Ajoute la vérification des types à JavaScript, puis compile en JavaScript |

### 1.2 Pourquoi le vibecoding a-t-il aussi besoin de TypeScript

::: warning L'IA peut aussi écrire du code bogué
Un développeur a utilisé l'IA pour générer une fonctionnalité de gestion des utilisateurs. Le code JavaScript généré par l'IA fonctionnait, mais il y avait un problème : l'âge de l'utilisateur devait être un nombre, mais il était parfois incorrectement assigné comme une chaîne de caractères.

Résultat : lors du calcul « est-ce que l'utilisateur est majeur », la chaîne "25" était traitée comme une chaîne, ce qui faisait échouer la vérification. Ce bug est resté caché longtemps, jusqu'à ce qu'un utilisateur saisisse des caractères non numériques.

Avec TypeScript, ce code aurait produit une erreur dès l'écriture : `Impossible d'assigner le type "string" au type "number"`.

**C'est là toute la valeur de TypeScript — quand l'IA se trompe de type, vous le détectez immédiatement.**
:::

### 1.3 TypeScript en pratique

TypeScript n'est pas un langage entièrement nouveau, c'est simplement un « sur-ensemble » de JavaScript :

```typescript
// Ceci est du JavaScript valide, et aussi du TypeScript valide
const name = "Zhang San"
const age = 25
function greet(user) {
  return `Hello ${user}`
}

// Ceci est une annotation de type propre à TypeScript
const name2: string = "Li Si"
const age2: number = 30
function greet2(user: string): string {
  return `Hello ${user}`
}
```

**Points clés à retenir :**
- Tout code JavaScript est du code TypeScript valide
- TypeScript ajoute des **annotations de type** optionnelles
- TypeScript est compilé en JavaScript avant d'être exécuté

::: info 💡 Révélation fondamentale
TypeScript ne change pas la façon dont le code s'exécute, il vérifie simplement que les types sont corrects au moment de la compilation. **Vous pouvez adopter TypeScript progressivement** — commencez par ajouter des types aux variables critiques.
:::

---

## 2. Annotations de type de base

::: tip 🤔 Question centrale
**Comment indiquer à TypeScript le type qu'une variable doit avoir ?** Quelle est la syntaxe des annotations de type ?
:::

### 2.1 Syntaxe des annotations de type

Une annotation de type consiste à ajouter `: type` après le nom de la variable :

```typescript
// Syntaxe : nomVariable: type = valeur
const name: string = "Zhang San"
let age: number = 25
let isStudent: boolean = true
```

👇 **Essayez par vous-même** : ajoutez des annotations de type aux variables

<TypeAnnotationDemo />

::: details 🔍 Pourquoi n'a-t-on pas besoin d'annotations de type partout ?
TypeScript peut inférer automatiquement le type d'après la valeur assignée :

```typescript
// Ceux-ci n'ont pas besoin d'annotation de type, TypeScript peut inférer automatiquement
const name = "Zhang San"      // inféré comme string
const age = 25                // inféré comme number
const isActive = true         // inféré comme boolean

// Ces cas nécessitent une annotation explicite
let data  // ❌ Erreur : impossible d'inférer le type
let data: any  // ✅ OK, mais perd l'avantage de la vérification de type

function add(a, b) {  // ❌ Type des paramètres ambigu
  return a + b
}

function add2(a: number, b: number): number {  // ✅ Types clairs
  return a + b
}
```
:::

### 2.2 Types de base

TypeScript prend en charge tous les types de base de JavaScript :

| Type | Description | Exemple |
|------|------|------|
| `string` | Chaîne de caractères | `"hello"`, `'bonjour'` |
| `number` | Nombre (entiers et décimaux) | `42`, `3.14` |
| `boolean` | Booléen | `true`, `false` |
| `null` / `undefined` | Valeur vide | `null`, `undefined` |
| `array` | Tableau | `number[]`, `string[]` |
| `object` | Objet | `{ name: string; age: number }` |

**Deux façons d'écrire les types de tableaux :**

```typescript
// Façon 1 : type[] (la plus courante)
const numbers: number[] = [1, 2, 3, 4, 5]
const names: string[] = ["Zhang San", "Li Si", "Wang Wu"]

// Façon 2 : Array<type>
const numbers2: Array<number> = [1, 2, 3, 4, 5]
const names2: Array<string> = ["Zhang San", "Li Si", "Wang Wu"]
```

**Types spéciaux :**

```typescript
// any : n'importe quel type (à utiliser avec prudence, désactive la vérification de type)
let data: any = 42
data = "maintenant ça peut être une chaîne"
data = { name: "Zhang San" }  // ou un objet

// unknown : version type-safe de any
let value: unknown = 42
// if (typeof value === "number") {
//   console.log(value + 10)  // doit d'abord vérifier le type avant utilisation
// }

// void : pas de valeur de retour
function log(message: string): void {
  console.log(message)
}

// never : ne retourne jamais
function error(message: string): never {
  throw new Error(message)
}
```

::: info 💡 Astuce de reconnaissance
- Voir `: string` → c'est une annotation de type string
- Voir `: number[]` → c'est une annotation de tableau de nombres
- Voir `: void` → cette fonction n'a pas de valeur de retour
:::

---

## 3. Types d'objets et interfaces

::: tip 🤔 Question centrale
**Comment définir le type d'un objet ?** Quels types doivent avoir les propriétés d'un objet ?
:::

### 3.1 Interface : définir la « forme » d'un objet

L'interface est le principal moyen de définir un type d'objet en TypeScript :

```typescript
// Définir une interface User
interface User {
  id: number
  name: string
  email: string
  age?: number  // propriété optionnelle
}

// Utiliser l'interface
const user: User = {
  id: 1,
  name: "Zhang San",
  email: "zhangsan@example.com",
  age: 25
}

// age est optionnel, on peut ne pas le fournir
const user2: User = {
  id: 2,
  name: "Li Si",
  email: "lisi@example.com"
}
```

👇 **Essayez par vous-même** : créez des objets conformes à la définition d'une interface

<InterfaceDemo />

::: details 🔍 Autres fonctionnalités des interfaces
```typescript
// Propriété en lecture seule
interface User {
  readonly id: number  // id ne peut pas être modifié après création
  name: string
}

const user: User = {
  id: 1,
  name: "Zhang San"
}

user.id = 2  // ❌ Erreur : impossible de modifier une propriété en lecture seule
user.name = "Li Si"  // ✅ Peut être modifié

// Type de fonction
interface User {
  name: string
  greet: () => string  // greet est une fonction qui retourne un string
}

const user: User = {
  name: "Zhang San",
  greet: () => "Hello"
}

// Héritage d'interface
interface Admin extends User {
  permissions: string[]
}

const admin: Admin = {
  name: "Administrateur",
  greet: () => "Hello Admin",
  permissions: ["read", "write", "delete"]
}
```
:::

### 3.2 Alias de type (Type Alias)

En plus des interfaces, vous pouvez utiliser `type` pour définir des alias de type :

```typescript
// Alias de type
type User = {
  id: number
  name: string
  email: string
}

// Type union
type Status = "pending" | "success" | "error"

const status: Status = "success"  // ✅
// const status2: Status = "failed"  // ❌ Erreur : ne fait pas partie du type union

// Type intersection (fusionner plusieurs types)
type User = {
  id: number
  name: string
}

type Timestamp = {
  createdAt: Date
  updatedAt: Date
}

type UserWithTimestamp = User & Timestamp

const user: UserWithTimestamp = {
  id: 1,
  name: "Zhang San",
  createdAt: new Date(),
  updatedAt: new Date()
}
```

**Interface vs Alias de type :**

| Caractéristique | interface | type |
|------|-----------|------|
| Extension | `extends` | `&` type intersection |
| Déclaration répétée | Fusion automatique | Provoque une erreur |
| Cas d'usage | Forme d'objet, classes | Types union, intersection, alias de types de base |

::: info 💡 Astuce de reconnaissance
- Voir `interface` → c'est une définition de type d'objet
- Voir `type` → c'est un alias de type
- Voir `?` → c'est une propriété optionnelle
- Voir `readonly` → c'est une propriété en lecture seule
:::

---

## 4. Types de fonctions

::: tip 🤔 Question centrale
**Comment annoter les types des paramètres et de la valeur de retour d'une fonction ?**
:::

### 4.1 Types des paramètres et type de retour

```typescript
// Annotation de type complète pour une fonction
function add(a: number, b: number): number {
  return a + b
}

// Fonction fléchée
const multiply = (a: number, b: number): number => {
  return a * b
}

// Pas de valeur de retour
function log(message: string): void {
  console.log(message)
}

// Retourne plusieurs types (type union)
function parseInput(input: string): number | string {
  const num = parseFloat(input)
  return isNaN(num) ? input : num
}
```

### 4.2 Paramètres optionnels et paramètres par défaut

```typescript
// Paramètre optionnel (marqué par ?)
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name
}

greet("Zhang San")  // "Zhang San"
greet("Zhang San", "Monsieur")  // "Monsieur Zhang San"

// Paramètre par défaut
function greet2(name: string, title: string = "ami"): string {
  return `${title} ${name}`
}

greet2("Li Si")  // "ami Li Si"
greet2("Li Si", "Docteur")  // "Docteur Li Si"
```

### 4.3 Type de fonction comme paramètre

```typescript
// Accepter une fonction comme paramètre
function calculate(
  a: number,
  b: number,
  operation: (x: number, y: number) => number
): number {
  return operation(a, b)
}

calculate(10, 5, (x, y) => x + y)  // 15
calculate(10, 5, (x, y) => x * y)  // 50

// Écriture plus claire : définir d'abord le type de fonction
type Operation = (x: number, y: number) => number

function calculate2(
  a: number,
  b: number,
  operation: Operation
): number {
  return operation(a, b)
}
```

::: info 💡 Astuce de reconnaissance
- Voir `(a: number, b: number) => number` → c'est un type de fonction, décrivant les paramètres et la valeur de retour
- Voir `: void` → la fonction n'a pas de valeur de retour
- Voir `?` → le paramètre est optionnel
:::

---

## 5. Génériques

::: tip 🤔 Question centrale
**Comment écrire du code capable de traiter plusieurs types tout en restant type-safe ?**
:::

### 5.1 Concept de base des génériques

Les génériques vous permettent de définir des fonctions, interfaces ou classes sans spécifier de type concret à l'avance, mais en le précisant au moment de l'utilisation :

```typescript
// Fonction générique : T est une variable de type
function identity<T>(arg: T): T {
  return arg
}

// Spécifier explicitement le type à l'utilisation
const num1 = identity<number>(42)  // le type est number
const str1 = identity<string>("hello")  // le type est string

// Inférence de type : TypeScript peut inférer automatiquement
const num2 = identity(42)  // inféré comme number
const str2 = identity("hello")  // inféré comme string
```

👇 **Essayez par vous-même** : utilisez les génériques pour traiter différents types de données

<GenericDemo />

### 5.2 Contraintes de génériques

Restreindre les génériques pour qu'ils satisfassent certaines conditions :

```typescript
// Contraindre T à avoir une propriété length
interface HasLength {
  length: number
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length)
}

logLength("hello")  // ✅ les chaînes ont length
logLength([1, 2, 3])  // ✅ les tableaux ont length
// logLength(42)  // ❌ les nombres n'ont pas de propriété length
```

### 5.3 Interfaces et classes génériques

```typescript
// Interface générique
interface Box<T> {
  value: T
  getValue(): T
}

const numberBox: Box<number> = {
  value: 42,
  getValue: () => 42
}

const stringBox: Box<string> = {
  value: "hello",
  getValue: () => "hello"
}

// Classe générique
class Storage<T> {
  private items: T[] = []

  add(item: T): void {
    this.items.push(item)
  }

  get(index: number): T {
    return this.items[index]
  }
}

const numberStorage = new Storage<number>()
numberStorage.add(1)
numberStorage.add(2)
// numberStorage.add("string")  // ❌ Erreur

const stringStorage = new Storage<string>()
stringStorage.add("hello")
// stringStorage.add(1)  // ❌ Erreur
```

::: info 💡 Astuce de reconnaissance
- Voir `<T>` → c'est une variable de type générique
- Voir `<T extends SomeType>` → contrainte de générique
- Voir `Array<T>` ou `Promise<T>` → type générique intégré
:::

---

## 6. Inférence de type et astuces pratiques

::: tip 🤔 Question centrale
**Quand faut-il une annotation de type explicite ? Quand peut-on se fier à l'inférence ?**
:::

### 6.1 Inférence de type

TypeScript peut inférer automatiquement les types d'après le contexte :

```typescript
// Inférence lors de l'initialisation de variables
const name = "Zhang San"  // inféré comme string
const age = 25  // inféré comme number
const isActive = true  // inféré comme boolean

// Inférence de tableau
const numbers = [1, 2, 3]  // inféré comme number[]
const mixed = [1, "hello", true]  // inféré comme (number | string | boolean)[]

// Inférence du type de retour d'une fonction
function add(a: number, b: number) {
  return a + b  // inféré comme retournant number
}
```

👇 **Essayez par vous-même** : observez comment TypeScript infère les types

<TypeInferenceDemo />

### 6.2 Quand utiliser une annotation de type explicite

::: details Cas où l'inférence de type est recommandée
```typescript
// ✅ Recommandé : assignation simple de littéraux
const count = 0
const name = "Zhang San"
const isActive = true

// ✅ Recommandé : le type de retour de la fonction peut être inféré
function getUserId(user: User) {
  return user.id  // inféré comme number
}
```
:::

::: details Cas où une annotation explicite est recommandée
```typescript
// ✅ Recommandé : paramètres de fonction (obligatoire)
function add(a: number, b: number) {
  return a + b
}

// ✅ Recommandé : type de propriété d'objet ambigu
const user: {
  id: number
  name: string
  metadata: Record<string, any>
} = {
  id: 1,
  name: "Zhang San",
  metadata: {}  // pourrait être inféré comme {}, besoin de spécifier explicitement
}

// ✅ Recommandé : type de retour de fonction complexe
function getUser(): User | null {
  // ...
  return null
}

// ✅ Recommandé : API publique
export function calculateTotal(prices: number[]): number {
  return prices.reduce((sum, price) => sum + price, 0)
}
```
:::

### 6.3 Gardes de type (Type Guards)

Vérifier les types à l'exécution :

```typescript
// Garde de type typeof
function processValue(value: string | number) {
  if (typeof value === "string") {
    // Ici TypeScript sait que value est un string
    console.log(value.toUpperCase())
  } else {
    // Ici TypeScript sait que value est un number
    console.log(value * 2)
  }
}

// Garde de type instanceof
class Dog {
  bark() {
    console.log("Wouf")
  }
}

class Cat {
  meow() {
    console.log("Miaou")
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark()  // TypeScript sait que c'est un Dog
  } else {
    animal.meow()  // TypeScript sait que c'est un Cat
  }
}

// Garde de type personnalisée
interface User {
  name: string
  email: string
}

function isUser(value: any): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.name === "string" &&
    typeof value.email === "string"
  )
}

function processValue(value: unknown) {
  if (isUser(value)) {
    // Ici value est un User
    console.log(value.name)
  }
}
```

### 6.4 Types utilitaires pratiques

TypeScript fournit des types utilitaires intégrés :

```typescript
// Partial : rend toutes les propriétés optionnelles
interface User {
  id: number
  name: string
  email: string
}

type PartialUser = Partial<User>
// Équivalent à : { id?: number; name?: string; email?: string }

// Required : rend toutes les propriétés obligatoires
type RequiredUser = Required<PartialUser>
// Équivalent à : { id: number; name: string; email: string }

// Pick : conserve uniquement les propriétés spécifiées
type UserBasicInfo = Pick<User, "id" | "name">
// Équivalent à : { id: number; name: string }

// Omit : exclut les propriétés spécifiées
type UserWithoutEmail = Omit<User, "email">
// Équivalent à : { id: number; name: string }

// Record : crée un type d'objet
type UserRoles = Record<string, boolean>
// Équivalent à : { [key: string]: boolean }
```

---

## 7. Astuces pratiques : utiliser TypeScript en vibecoding

::: tip 🤔 Question centrale
**Comment mieux exploiter TypeScript dans le développement assisté par IA ?**
:::

### 7.1 Faire générer du code type-safe par l'IA

**❌ Mauvais prompt :**
```
Écris-moi une fonctionnalité de gestion des utilisateurs
```

**✅ Bon prompt :**
```
Écris-moi une fonctionnalité de gestion des utilisateurs, en utilisant TypeScript.

La structure de données est définie comme suit :
interface User {
  id: number
  name: string
  email: string
  age: number
}

À implémenter :
1. Récupérer la liste des utilisateurs : retourne User[]
2. Créer un utilisateur : accepte Partial<User>, retourne User
3. Mettre à jour un utilisateur : accepte id et Partial<User>, retourne User
4. Supprimer un utilisateur : accepte id, retourne void

Assure-toi que toutes les fonctions ont des annotations de type complètes.
```

### 7.2 Comprendre les messages d'erreur de TypeScript

**Erreurs courantes et leur signification :**

| Message d'erreur | Signification | Solution |
|---------|------|---------|
| `Type 'X' is not assignable to type 'Y'` | Le type X ne peut pas être assigné au type Y | Vérifier la correspondance des types ou effectuer une conversion de type |
| `Property 'X' does not exist on type 'Y'` | La propriété X n'existe pas sur le type Y | Vérifier l'orthographe du nom de la propriété ou définir cette propriété |
| `Argument of type 'X' is not assignable to parameter of type 'Y'` | Le type du paramètre ne correspond pas | Vérifier le type des paramètres lors de l'appel de la fonction |
| `Type 'X' is missing the following properties from type 'Y'` | Le type X manque certaines propriétés du type Y | Compléter les propriétés manquantes |

### 7.3 Adopter TypeScript progressivement

Si vous avez un projet JavaScript, vous pouvez migrer progressivement vers TypeScript :

1. **Étape 1 : Renommer les fichiers en `.ts`**
   ```bash
   # De utils.js à utils.ts
   mv utils.js utils.ts
   ```

2. **Étape 2 : Corriger les erreurs de type évidentes**
   ```typescript
   // Si l'erreur est : Parameter 'a' implicitly has an 'any' type
   // Ajouter une annotation de type
   function add(a: number, b: number) {
     return a + b
   }
   ```

3. **Étape 3 : Ajouter progressivement les définitions de type**
   ```typescript
   // D'abord utiliser any pour corriger rapidement
   function processUser(user: any) {
     // ...
   }

   // Ensuite affiner les types
   interface User {
     id: number
     name: string
   }

   function processUser(user: User) {
     // ...
   }
   ```

4. **Étape 4 : Activer une vérification de type plus stricte**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,  // Activer le mode strict
       "noImplicitAny": true,  // Interdire le any implicite
       "strictNullChecks": true  // Vérification stricte des null
     }
   }
   ```

---

## 8. Ce que vous devriez maintenant savoir reconnaître dans le code

- Voir `: string` → c'est une annotation de type string
- Voir `: number[]` → c'est une annotation de tableau de nombres
- Voir `interface User` → c'est une définition de type d'objet
- Voir `type User =` → c'est un alias de type
- Voir `<T>` → c'est un générique
- Voir `extends` → héritage d'interface ou contrainte de générique
- Voir `?` → propriété optionnelle
- Voir `readonly` → propriété en lecture seule
- Voir `|` → type union
- Voir `&` → type intersection

**Si vous avez lu attentivement la partie « approfondissement » de chaque chapitre, vous maîtrisez également ces concepts fondamentaux :**

- **Annotation de type** : indiquer explicitement le type d'une variable à TypeScript
- **Interface** : définir la structure et le type d'un objet
- **Générique** : écrire du code réutilisable et type-safe
- **Inférence de type** : TypeScript infère automatiquement les types
- **Garde de type** : vérifier les types à l'exécution
- **Types utilitaires** : Partial, Required, Pick, Omit, etc.

::: info 💡 En cas de problème, voici comment formuler votre demande à l'IA
- "Quelle annotation de type dois-je écrire pour cette fonction ? Le paramètre est X, la valeur de retour est Y"
- "Aide-moi à définir une interface qui décrit cette structure de données : ..."
- "Que signifie cette erreur TypeScript ? Comment la corriger ?"
- "Comment ajouter une contrainte à cette fonction générique pour garantir que T possède une certaine propriété ?"
:::