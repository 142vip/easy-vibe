# Introduction : Stratégies et méthodologies de test

::: tip Avant-propos
**Votre code est-il vraiment « sans probleme » ?** A chaque modification de code, cliquer manuellement pour verifier que tout fonctionne — cette approche est tolerable pour les petits projets. Mais quand le code atteint des dizaines de milliers de lignes et que l'equipe s'elargit a une douzaine de personnes, les « clics manuels » deviennent un desastre.

Ce chapitre vous aide a comprendre les strategies cles des tests logiciels, de la pyramide de tests au TDD, et a etablir une pensee systematique d'assurance qualite.
:::

**Que allez-vous apprendre dans cet article ?**

| Chapitre | Contenu | Concept cle |
|-----|------|---------|
| **Chapitre 1** | Pyramide de tests | Niveaux et proportions des tests |
| **Chapitre 2** | Tests unitaires en pratique | Comment ecrire un bon test |
| **Chapitre 3** | Developpement pilote par les tests (TDD) | Le cycle rouge-vert-refactoring |
| **Chapitre 4** | Choix de strategie de test | Solutions pour differents contextes |

Apres ce chapitre, vous comprendrez comment choisir une strategie de test adaptee a votre projet, ecrire des tests utiles et ameliorer la qualite de conception du code grace au TDD.

---

## 0. Vue d'ensemble : Pourquoi les tests automatises sont-ils necessaires

Imaginez que vous etes un ingenieur en batiment. A chaque modification des plans, vous ne grimpez pas personnellement tous les etages pour verifier la securite structurelle — vous vous fiez a un **systeme de detection automatise**. Les tests logiciels sont le « systeme de detection structurelle » du monde du code.

::: tip La valeur des tests automatises
- **Protection contre les regressions** : Modifier la fonctionnalite A detecte automatiquement si B, C, D sont affectees
- **Confiance dans le refactoring** : Avec une couverture de tests, le refactoring se fait l'esprit tranquille
- **Documentation vivante** : Les bons tests sont le meilleur manuel d'utilisation
- **Retour rapide** : Savoir en quelques secondes si le code est correct, plutot que de decouvrir les problemes apres le deploiement
:::

---

## 1. Pyramide de tests : Niveaux et proportions des tests

### 1.1 La pyramide a trois niveaux

La pyramide de tests proposee par Mike Cohn est le modele classique de strategie de test. Elle nous dit que **les differents types de tests doivent avoir des proportions differentes**.

Cliquez sur chaque niveau de la pyramide avec le composant interactif ci-dessous pour comprendre les caracteristiques de chaque niveau de test :

<TestPyramidDemo />

### 1.2 Pourquoi une forme pyramidale

La forme pyramidale reflete un compromis fondamental : **vitesse contre realisme**.

- **Niveau inferieur (tests unitaires)** : Tres rapides, les plus nombreux, cout le plus bas — mais ne verifient que des composants individuels
- **Niveau intermediaire (tests d'integration)** : Vitesse moderee, nombre adequat — verifient la cooperation entre composants
- **Niveau superieur (tests E2E)** : Les plus proches des utilisateurs reels, mais lents, couts de maintenance eleves, sujets aux echecs lies a l'environnement

> **Anti-pattern : le cornet de glace** — Si votre projet a le plus de tests E2E et le moins de tests unitaires, vous avez un « cornet de glace » a l'envers. Cela signifie que la suite de tests s'execute lentement, echoue frequemment et coute extremement cher a maintenir.

---

## 2. Tests unitaires en pratique

### 2.1 Qu'est-ce qu'un bon test unitaire

Un bon test unitaire suit le principe **FIRST** :

| Principe | Signification | Description |
|------|------|------|
| **F**ast | Rapide | Termine en millisecondes, les developpeurs veulent l'executer souvent |
| **I**ndependent | Independant | Les tests ne dependent pas les uns des autres, peuvent s'executer separement |
| **R**epeatable | Repetable | Resultats identiques dans tout environnement |
| **S**elf-validating | Auto-validant | Resultat clair de succes/echec, pas de jugement humain necessaire |
| **T**imely | Opportun | Ecrire les tests en meme temps (ou avant) le code |

### 2.2 La structure des tests : Le pattern AAA

Chaque test devrait avoir une structure claire en trois parties :

```javascript
test('devrait calculer correctement le prix TTC', () => {
  // Arrange (Preparer) — Configurer les donnees de test
  const price = 100
  const taxRate = 0.13

  // Act (Executer) — Appeler la fonction a tester
  const result = calculateTotalWithTax(price, taxRate)

  // Assert (Verfier) — Verifier le resultat
  expect(result).toBe(113)
})
```

### 2.3 Que tester Que ne pas tester

**Ce qui devrait etre teste :**
- La logique metier principale (calcul de prix, verification de permissions, transformation de donnees)
- Les conditions aux limites (valeurs nulles, zero, nombres negatifs, tres grands nombres)
- Les chemins de gestion des erreurs

**Ce qui n'a pas besoin d'etre teste :**
- L'implementation interne des bibliotheques tierces
- Les simples getter/setter
- Les fonctionnalites propres au framework (ex : systeme reactif de Vue)

---

## 3. TDD : Developpement pilote par les tests

### 3.1 Le cycle rouge-vert-refactoring

Le coeur du TDD (Test-Driven Development) est un cycle simple : **ecrire le test d'abord, puis l'implementation, enfin refactoring**.

Experimentez le cycle complet du TDD avec le composant interactif ci-dessous :

<TDDCycleDemo />

### 3.2 Les trois regles du TDD

1. **Ne pas ecrire de code de production, sauf pour faire passer un test qui echoue**
2. **Ecrire juste assez de code de test pour le faire echouer** (une erreur de compilation compte comme un echec)
3. **Ecrire juste assez de code de production pour faire passer le test**

### 3.3 La veritable valeur du TDD

La valeur du TDD ne reside pas simplement dans « ecrire les tests d'abord », mais dans le fait qu'il **vous force a reflechir a la conception de l'interface**. Quand vous ecrivez le test d'abord, vous pensez du point de vue de « l'utilisateur » : quels parametres cette fonction devrait-elle recevoir ? Quel resultat devrait-elle retourner ? Cela conduit naturellement a une meilleure conception d'API.

::: tip Le TDD n'est pas une balle d'argent
Le TDD convient au code a logique dense (algorithmes, regles metier, transformation de donnees), mais pour les mises en page UI, les prototypes exploratoires et autres scenarios, le TDD force peut en fait ralentir le developpement. L'essentiel est de comprendre sa philosophie et de l'appliquer avec souplesse.
:::

---

## 4. Choix de strategie de test

### 4.1 Points forts des tests selon le type de projet

| Type de projet | Focus des tests | Proportion recommandee |
|----------|----------|----------|
| **Bibliotheque utilitaire / SDK** | Principalement des tests unitaires | 90 % unitaires + 10 % integration |
| **Service API** | Principalement des tests d'integration | 30 % unitaires + 60 % integration + 10 % E2E |
| **Application web** | Distribution equilibree | 50 % unitaires + 30 % integration + 20 % E2E |
| **MVP / Prototype** | E2E sur les chemins critiques | Quelques tests cles seulement |

### 4.2 Outils de test courants

| Outil | Type | Cas d'utilisation |
|------|------|----------|
| **Vitest** | Unitaire/Integration | Premier choix pour les projets Vite, compatible API Jest |
| **Jest** | Unitaire/Integration | Le plus populaire dans l'ecosysteme Node.js |
| **Playwright** | E2E | Multi-navigateurs, cree par Microsoft |
| **Cypress** | E2E | Bonne experience developpeur, debogage facile |
| **Testing Library** | Tests de composants | Tester les composants UI du point de vue utilisateur |

---

## 5. Support de l'IA : Ameliorer l'efficacite des tests avec les grands modeles linguistiques

Les grands modeles linguistiques sont deja tres performants dans le domaine des tests — ils peuvent vous aider a generer des cas de test, decouvrir des conditions aux limites et meme ecrire du code de test complet.

### 5.1 Generer des tests unitaires

> **Prompt** :
> ```
> Veuillez ecrire des tests unitaires pour la fonction suivante avec le framework Vitest :
> 1. Suivre le pattern AAA (Arrange-Act-Assert)
> 2. Couvrir les chemins normaux, les conditions aux limites et les chemins d'erreur
> 3. Chaque cas de test doit avoir une description claire en francais
>
> [Collez le code de la fonction ici]
> ```

### 5.2 Decouvrir les conditions aux limites

> **Prompt** :
> ```
> Analysez la fonction suivante et listez toutes les conditions aux limites possibles
> et les scenarios d'entree extremes, y compris : valeurs nulles, zero, nombres negatifs,
> tres grands nombres, caracteres speciaux, situations de concurrence, etc.
> Pour chaque scenario, decrivez le comportement attendu et les risques possibles.
>
> [Collez le code de la fonction ici]
> ```

### 5.3 Generer des tests a partir des exigences (support TDD)

> **Prompt** :
> ```
> Je veux implementer un module de panier. Exigences :
> - Ajouter un article, supprimer un article, modifier la quantite
> - Calcul automatique du prix total (remise incluse)
> - Message d'erreur en cas de stock insuffisant
>
> Veuillez d'abord ecrire les cas de test selon l'approche TDD (sans implementation),
> en utilisant Vitest et en couvrant tous les scenarios cles.
> ```

::: tip Conseil d'utilisation de l'IA
Verifiez que les assertions des tests generes par l'IA sont significatives — evitez les tests inutiles comme `expect(true).toBe(true)`. Un bon test doit reellement echouer quand le code contient des erreurs.
:::

---

## 6. Resume

1. **Pyramide de tests** : Plus de tests a la base, moins au sommet — equilibrer vitesse et realisme
2. **Tests unitaires** : Suivre le principe FIRST et le pattern AAA, tester la logique principale
3. **TDD** : Cycle rouge-vert-refactoring, les tests pilotent la conception
4. **Choix de strategie** : Selectionner les proportions de test adaptees selon le type et la phase du projet

::: tip Reflexion finale
Les tests ne sont pas une charge, mais un **accelerateur**. A court terme, ecrire des tests prend effectivement plus de temps ; a long terme, cela evite d'innombrables verifications manuelles, d'investigations de bugs de regression et de correctifs urgents en pleine nuit. Avec de bons tests, vous pouvez dire avec confiance : **« Modifiez sans crainte — les tests nous diront s'il y a un probleme. »**
:::

---

## Lectures complementaires

- **Livre classique** : « Test-Driven Development » de Kent Beck est l'ouvrage fondateur du TDD.
- **Guide pratique** : Essayez d'ecrire des tests avec Vitest pour un petit projet et decouvrez le processus de test de bout en bout.
- **Patterns de test** : Comprendre les differences et les cas d'utilisation de Mock, Stub et Spy.
- **Integration continue** : Integrez les tests dans votre pipeline CI/CD pour une execution automatique a chaque commit.
