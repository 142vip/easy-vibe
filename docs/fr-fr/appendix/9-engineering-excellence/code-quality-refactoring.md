# Introduction : Qualité du code et refactoring

::: tip Avant-propos
**Le code qui fonctionne, est-ce suffisant ?** Vous avez probablement deja ecrit ce genre de code : la fonctionnalite est implementee, mais apres deux semaines, vous ne le comprenez plus vous-meme. Ou un collegue a quitte l'entreprise et laisse un code que « seul Dieu et lui pouvaient comprendre ».

Ce chapitre vous aide a comprendre ce qu'est un bon code, comment identifier un mauvais code et comment l'ameliorer en toute securite.
:::

**Que allez-vous apprendre dans cet article ?**

| Chapitre | Contenu | Concept cle |
|-----|------|---------|
| **Chapitre 1** | Code smells | Identifier les problemes courants |
| **Chapitre 2** | Techniques de refactoring | Ameliorer le code en toute securite |
| **Chapitre 3** | Revue de code | Assurance qualite en travail d'equipe |
| **Chapitre 4** | Metriques de qualite | Mesurer la sante du code avec des donnees |

Apres ce chapitre, vous serez capable d'identifier les problemes de code, de refactoring en toute securite et d'ameliorer continuellement la qualite du code grace au travail d'equipe.

---

## 0. Vue d'ensemble : Le cycle de vie du code

Dans le developpement logiciel, il y a un fait souvent negligee : **le code est lu bien plus souvent qu'il n'est ecrit.**

Du code, de sa naissance a sa mise hors service, suit grossierement ce parcours :

::: tip La vie du code
- **Phase d'ecriture** : Le developpeur ecrit la premiere implementation, la fonctionnalite marche, les tests passent.
- **Phase de revue** : Les membres de l'equipe lisent le code et font des suggestions d'amelioration.
- **Phase de maintenance** : Correction de bugs, ajout de fonctionnalites, adaptation aux nouveaux besoins — cette phase represente plus de 80 % du cycle de vie du code.
- **Phase de refactoring** : Quand le code devient difficile a maintenir, il faut ameliorer sa structure interne sans changer son comportement externe.
- **Mise hors service** : La technologie evolue, l'ancien code est remplace par de nouvelles solutions.
:::

Martin Fowler a dit dans son livre « Refactoring » : **« N'importe quel idiot peut ecrire du code qu'un ordinateur peut comprendre. Seuls les bons programmeurs peuvent ecrire du code que les humains peuvent comprendre. »**

---

## 1. Code smells : Identifier les problemes courants

### 1.1 Qu'est-ce qu'un code smell

Le concept de « code smell » a ete propose par Kent Beck. Il designe des caracteristiques dans le code qui **ne sont pas des bugs, mais qui suggerent des problemes de conception plus profonds**. C'est comme une odeur etrange dans une piece — elle ne vous rend pas immediatement malade, mais elle indique qu'un nettoyage s'impose quelque part.

Identifiez les code smells les plus courants avec le composant interactif ci-dessous :

<CodeSmellDemo />

### 1.2 Liste des code smells courants

| Code smell | Symptome | Danger |
|-------|------|------|
| **Fonction trop longue** | Fonction de plus de 50 lignes | Difficile a comprendre, tester et reutiliser |
| **Nombres magiques** | Ecriture directe de `86400000` dans le code | Signification floue, omissions lors des modifications |
| **Code duplique** | Logique similaire presente a plusieurs endroits | Modifications a synchroniser a plusieurs endroits, risque d'oubli |
| **Imbrication excessive** | Plus de 3 niveaux de if/for | Logique en labyrinthe, difficile a suivre |
| **Liste de parametres trop longue** | Fonction avec plus de 4 parametres | Appel difficile, ordre facile a confondre |
| **Classe Dieu** | Une classe/module fait trop de choses | Responsabilites floues, changement en cascade |

::: tip Insight cle
Les code smells ne sont pas des « erreurs », mais des « signaux ». Ils vous indiquent que la conception ici pourrait necessiter des ameliorations. Tous les code smells n'ont pas besoin d'etre corriges immediatement, mais vous devez etre capable de les identifier.
:::

---

## 2. Techniques de refactoring : Ameliorer le code en toute securite

### 2.1 Qu'est-ce que le refactoring

La definition du refactoring est tres precise : **ameliorer la structure interne du code sans changer son comportement externe.**

Le mot cle est « sans changer le comportement externe ». Le refactoring n'est pas une reecriture, ce n'est pas ajouter des fonctionnalites, ni corriger des bugs. C'est un « rangement » de l'interieur du code.

Comparez les changements avant/apres de plusieurs techniques de refactoring avec le composant ci-dessous :

<RefactoringDemo />

### 2.2 Techniques de refactoring courantes

**Extraire une fonction (Extract Function)**

C'est la technique de refactoring la plus utilisee. Quand une section de code peut etre resumee par un nom significatif, elle devrait etre extraite en fonction.

```javascript
// Avant refactoring
function printReport(data) {
  // Calculer le total
  let total = 0
  for (const item of data.items) {
    total += item.price * item.qty
  }
  // Impression...
}

// Apres refactoring
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0)
}

function printReport(data) {
  const total = calculateTotal(data.items)
  // Impression...
}
```

**Renommer (Rename)**

Les bons noms sont la documentation la moins chere et la plus efficace. Quand vous devez ecrire un commentaire pour expliquer le sens d'une variable ou d'une fonction, son nom n'est pas assez bon.

```javascript
// Avant refactoring
const d = new Date() - startTime  // Temps ecoule
const arr = users.filter(u => u.a) // Utilisateurs actifs

// Apres refactoring
const elapsedMs = new Date() - startTime
const activeUsers = users.filter(user => user.isActive)
```

**Remplacer les conditions imbriquees par des clauses de garde (Replace Nested Conditional with Guard Clauses)**

```javascript
// Avant refactoring
function getPayAmount(employee) {
  if (employee.isSeparated) {
    return { amount: 0 }
  } else {
    if (employee.isRetired) {
      return { amount: employee.pension }
    } else {
      return { amount: employee.salary }
    }
  }
}

// Apres refactoring
function getPayAmount(employee) {
  if (employee.isSeparated) return { amount: 0 }
  if (employee.isRetired) return { amount: employee.pension }
  return { amount: employee.salary }
}
```

::: tip Le filet de securite du refactoring
Le plus grand risque du refactoring est de « introduire des bugs en modifiant ». C'est pourquoi la condition prealable au refactoring est la **couverture de tests**. Apres chaque petite etape de refactoring, executez les tests pour vous assurer que le comportement n'a pas change. Pour le code sans tests, ecrivez d'abord des tests avant de refactoring.
:::

---

## 3. Revue de code : Assurance qualite en travail d'equipe

### 3.1 Pourquoi la revue de code est-elle necessaire

La revue de code (Code Review) est l'un des moyens d'assurance qualite les plus efficaces dans une equipe. Sa valeur ne se limite pas a trouver des bugs :

- **Partage de connaissances** : Les membres de l'equipe comprennent le code des autres, reduisant le « facteur bus » (Le projet peut-il continuer si quelqu'un se fait renverser par un bus ?)
- **Style unifie** : A travers les revues, les normes de codage de l'equipe se forment progressivement
- **Detection precoce des problemes de conception** : Plus difficiles a corriger que les bugs sont les mauvaises decisions architecturales
- **Apprentissage mutuel** : Lire le code des autres est un raccourci pour ameliorer ses competences de programmation

### 3.2 Que reverifier

| Dimension | Focus |
|------|--------|
| **Exactitude** | La logique est-elle correcte ? Les conditions aux limites sont-elles traitees ? |
| **Lisibilite** | Les noms sont-ils clairs ? La structure est-elle comprehensible ? |
| **Securite** | Y a-t-il des risques d'injection ? Des donnees sensibles sont-elles exposees ? |
| **Performance** | Y a-t-il des problemes de performance evidents ? Requetes N+1 ? |
| **Tests** | Y a-t-il des tests correspondants ? Les chemins critiques sont-ils couverts ? |

### 3.3 L'etiquette de la revue

Une bonne revue de code est **une discussion sur le code, pas une critique de la personne** :

- Utilisez « nous » au lieu de « tu » : ~~« Tu as fait une erreur ici »~~ -> « Ici nous pourrions envisager d'utiliser une clause de garde »
- Posez des questions au lieu de donner des ordres : ~~« Change en const »~~ -> « Cette variable sera-t-elle reassignee plus tard ? Si non, const serait plus sur »
- Donnez des raisons : Ne dites pas seulement « c'est mauvais », mais « pourquoi c'est mauvais » et « comment ameliorer »

---

## 4. Metriques de qualite du code

### 4.1 Complexite cyclomatique

La complexite cyclomatique (Cyclomatic Complexity) mesure le nombre de chemins independants dans le code. Chaque `if`, `for`, `case`, `&&`, `||` augmente la complexite.

| Complexite | Evaluation | Recommandation |
|--------|------|------|
| 1-10 | Simple | Facile a comprendre et tester |
| 11-20 | Moyenne | Envisager de diviser |
| 21-50 | Complexe | Refactoring necessaire |
| 50+ | Non maintenable | Refactoring urgent |

### 4.2 Couverture de code

La couverture de code mesure quelle proportion du code est executee par les tests. Indicateurs courants :

- **Couverture de lignes** : Proportion de lignes de code executees par rapport au total
- **Couverture de branches** : Proportion de branches conditionnelles executees par rapport au total

::: tip Le piege de la couverture
80 % de couverture ne signifie pas que la qualite du code est bonne. La couverture vous dit seulement « quel code n'a pas ete teste », pas « si les tests sont significatifs ». Un test avec seulement `expect(true).toBe(true)` augmente la couverture mais n'a aucune valeur.
:::

### 4.3 Outils pratiques

| Outil | Usage |
|------|------|
| **ESLint** | Analyse statique JavaScript/TypeScript |
| **Prettier** | Formatage du code, style uniforme |
| **SonarQube** | Plateforme complete de qualite du code |
| **Husky** | Git hooks, verification automatique avant les commits |

---

## 5. Support de l'IA : Ameliorer la qualite du code avec les grands modeles linguistiques

Les grands modeles linguistiques sont deja tres pratiques dans le domaine de la qualite du code. Ils peuvent servir de « revueur de code en ligne 24h/24 ».

### 5.1 Identifier les code smells

> **Prompt** :
> ```
> Veuillez examiner le code suivant et identifier les code smells,
> y compris mais sans s'y limiter : fonctions trop longues, nombres magiques,
> code duplique, imbrication excessive, listes de parametres trop longues.
> Pour chaque probleme, indiquez l'emplacement exact, la description du probleme et les suggestions d'amelioration.
>
> [Collez votre code ici]
> ```

### 5.2 Refactoring automatique

> **Prompt** :
> ```
> Veuillez refactoring le code suivant avec les exigences suivantes :
> 1. Ne pas changer le comportement externe
> 2. Utiliser des techniques comme l'extraction de fonctions et les clauses de garde
> 3. Ameliorer les noms, eliminer les nombres magiques
> 4. Expliquer les raisons de chaque etape de refactoring
>
> [Collez votre code ici]
> ```

### 5.3 Simuler une revue de code

> **Prompt** :
> ```
> Veuillez examiner ce code du point de vue d'un developpeur senior
> et fournir des retours sur les dimensions suivantes :
> - Exactitude : Y a-t-il des bugs dans la logique ? Les conditions aux limites sont-elles traitees ?
> - Lisibilite : Les noms sont-ils clairs ? La structure est-elle comprehensible ?
> - Performance : Y a-t-il des problemes de performance evidents ?
> - Securite : Y a-t-il des risques d'injection ou de fuite de donnees ?
> Utilisez un ton de « suggestion » plutot que d'« ordre » et proposez des ameliorations.
>
> [Collez votre code ici]
> ```

::: tip Conseil d'utilisation de l'IA
Les suggestions de refactoring de l'IA doivent etre verifiees par vous-meme — executez les tests pour confirmer que le comportement n'a pas change. Traitez l'IA comme « un collegue qui fait des suggestions », pas comme « une autorite a laquelle faire une confiance aveugle ».
:::

---

## 6. Resume

Nous avons construit un systeme complet d'amelioration de la qualite du code, de l'identification des problemes a leur resolution :

1. **Identifier** : Detecter les code smells, savoir ou les ameliorations sont necessaires
2. **Refactoring** : Maitriser les techniques de refactoring en toute securite, ameliorer par petites etapes sous protection des tests
3. **Collaborer** : Garantir collectivement la qualite du code grace aux revues de code
4. **Mesurer** : Suivre la sante du code avec des indicateurs objectifs

::: tip Reflexion finale
La qualite du code n'est pas un travail ponctuel, mais une habitude continue. Comme pour garder une piece propre — on n'attend pas qu'elle soit insalubre pour faire un grand nettoyage, on range un peu chaque jour. La **regle du boy scout** dit bien : laissez le code un peu plus propre que quand vous l'avez trouve.
:::

---

## Lectures complementaires

- **Livre classique** : « Refactoring : Improving the Design of Existing Code » de Martin Fowler est la bible de ce domaine.
- **Clean Code** : « Clean Code » de Robert C. Martin offre de nombreux principes de codage pratiques.
- **Outils pratiques** : Essayez de configurer ESLint + Prettier + Husky dans votre projet pour experimenter l'assurance qualite automatisee du code.
- **Revue de code** : Le guide de revue de code de Google est la reference du secteur et vaut la peine d'etre etudie.
