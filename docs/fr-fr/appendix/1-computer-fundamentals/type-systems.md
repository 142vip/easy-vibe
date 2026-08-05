# Introduction aux systèmes de types

::: tip Préface
**Pourquoi `"1" + 1` donne `"11"` en JavaScript mais lève une erreur en Python ?** C'est le système de types qui est à l'œuvre. Le système de types est l'ensemble de règles d'un langage de programmation — il détermine comment les données peuvent être utilisées, avec quelles autres données elles peuvent opérer, et quand la légalité est vérifiée. Comprendre les systèmes de types, c'est comprendre les différences entre les langages.
:::

**Contenu de cet article**

À la fin de ce chapitre, vous aurez acquis :

- **Capacité de classification** : maîtriser la classification en quatre quadrants (statique/dynamique, fort/faible)
- **Diagnostic des problèmes** : voir `TypeError` et rapidement identifier s'il s'agit d'une incompatibilité de types ou d'une conversion implicite
- **Choix de langage** : comprendre pourquoi TypeScript convient aux grands projets et Python aux prototypes rapides
- **Inférence de types** : comprendre comment les langages modernes combinent concision et sécurité
- **Conscience pratique** : acquérir des habitudes de codage typage-sûr

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Qu'est-ce qu'un système de types | Essence des types, pourquoi les types sont nécessaires |
| **Chapitre 2** | Typage statique vs dynamique | Moment de la vérification, support IDE, sécurité |
| **Chapitre 3** | Typage fort vs faible | Conversion implicite, sécurité des types |
| **Chapitre 4** | Inférence de types | Inférence automatique, le meilleur des deux mondes |
| **Chapitre 5** | Génériques : écrire une fois,适用 tous les types | Paramètres de type, contraintes de type, réutilisation |
| **Chapitre 6** | Sécurité des types en pratique | Pièges courants, stratégies de défense |
| **Chapitre 7** | Quadrant des types de langages | Classification en quatre quadrants, choix du langage |

---

## 0. Présentation du système de types et des données

Dans le monde réel, vous n'essayez pas de glisser un livre dans une tasse de café — ce sont des types différents d'objets. Le monde de la programmation est identique : nombres, chaînes, booléens, tableaux... chaque donnée a sa propre identité qui détermine à quelles opérations elle peut participer.

Le **système de types** est l'ensemble de règles par lequel un langage de programmation gère ces identités. Il répond à deux questions fondamentales :

::: tip Les deux dimensions du système de types
- **Quand vérifier** : Au moment d'écrire le code (statique) ou à l'exécution (dynamique)
- **Quelle sévérité** : Interdire strictement le mélange (fort) ou convertir automatiquement (faible)
:::

---

## 1. Présentation d'un système de types : principes de base

<TypeSystemDemo />

L'essence d'un système de types est un ensemble de **contraintes** qui indiquent au compilateur ou à l'interpréteur :

- Quelles valeurs cette variable peut stocker
- Ces deux valeurs peuvent être additionnées
- Quel devrait être le type du paramètre de cette fonction

Un monde sans système de types est un environnement sans contraintes — n'importe quelle donnée peut opérer avec n'importe quelle autre, avec des résultats totalement imprévisibles.

| Rôle du système de types | Description | Exemple |
|-------------|------|------|
| Prévenir les opérations illégales | Bloquer les opérations sans sens | Pas de division sur une chaîne |
| Fournir de la documentation | Le type est la meilleure documentation | `function add(a: number, b: number)` est immédiatement compréhensible |
| Aider les outils IDE | Auto-complétion, refactoring, navigation | Taper `user.` suggère automatiquement toutes les propriétés |
| Optimiser les performances | Le compilateur connaissant le type peut générer du code plus rapide | Si c'est un entier, utiliser l'instruction entière |

---

## 2. Typage statique vs dynamique : Principe du moment de vérification

C'est la dimension de classification la plus importante — le **moment de la vérification**.

<StaticVsDynamicDemo />

::: tip Différence clé
- **Typage statique** : Le type d'une variable est déterminé à la compilation ; les erreurs de type sont détectées avant l'exécution. Représentants : Java, TypeScript, Rust, Go.
- **Typage dynamique** : Le type d'une variable est déterminé à l'exécution ; une même variable peut stocker d'abord un nombre puis une chaîne. Représentants : Python, JavaScript, Ruby, PHP.
:::

| Dimension | Statique | Dynamique |
|------|---------|---------|
| Moment de la vérification | Compilation (avant l'exécution) | Exécution (quand la ligne est atteinte) |
| Découverte des bugs | Tôt (dès l'écriture) | Tard (exposé lors de l'utilisation) |
| Flexibilité | Plus faible (type fixe) | Plus élevée (type variable) |
| Support IDE | Bon (auto-complétion, refactoring) | Plus faible (type connu seulement à l'exécution) |
| Vitesse de développement | Plus lent au début (écrire les types) | Plus rapide au début (pas de types) |
| Coût de maintenance | Bas (les types servent de documentation) | Élevé (informations de type manquantes) |

::: tip Tendance : Les langages dynamiques deviennent « statiques »
Python a ajouté les Type Hints, la communauté JavaScript se tourne vers TypeScript — les langages dynamiques adoptent les avantages du typage statique. Cela montre que les bénéfices en sécurité du typage statique sont de plus en plus reconnus dans les grands projets.
:::

---

## 3. Typage fort vs faible : Principe de la conversion de types

La seconde dimension de classification est le **degré de sévérité des conversions de types**.

<StrongVsWeakDemo />

::: tip Différence clé
- **Typage fort** : Pas de conversion implicite ; une incompatibilité de types génère une erreur. Vous devez explicitement dire au langage : « je veux convertir cette chaîne en nombre ».
- **Typage faible** : Les conversions implicites sont autorisées ; le langage vous « aide » automatiquement. Mais cette « aide » engendre souvent des bugs inattendus.
:::

| Dimension | Fort | Faible |
|------|-------|-------|
| `"1" + 1` | Erreur ou conversion explicite requise | Conversion automatique (pourrait donner `"11"` ou `2`) |
| Sécurité | Élevée (pas d'erreurs silencieuses) | Basse (la conversion implicite peut causer des bugs) |
| Commodité | Basse (conversion manuelle) | Élevée (conversion automatique) |
| Prévisibilité | Élevée (comportement déterministe) | Basse (règles de conversion complexes) |

---

## 4. Inférence de types : La solution moderne idéale

Les premiers langages à typage statique (comme Java) exigeaient la déclaration explicite du type de chaque variable — fastidieux à écrire. Les langages modernes résolvent ce problème par l'**inférence de types** — le compilateur déduit automatiquement le type, vous n'avez pas besoin de l'écrire, mais la vérification reste stricte.

<TypeInferenceFlowDemo />

::: tip La valeur de l'inférence de types
Écrire aussi concisément qu'un langage dynamique, avec une vérification aussi stricte qu'un langage statique. C'est la direction dominante des langages de programmation modernes.
- **TypeScript** : `let x = 42` → déduit automatiquement comme `number`
- **Rust** : `let v = vec![1, 2, 3]` → déduit automatiquement comme `Vec<i32>`
- **Kotlin** : `val name = "Alice"` → déduit automatiquement comme `String`
- **Go** : `x := 42` → déclaration courte avec inférence automatique
:::

---

## 5. Génériques : Écrire une fois, appliquer à tous les types

Quand vous écrivez une fonction « récupérer le premier élément d'un tableau », vous découvrez : un pour les tableaux de nombres, un pour les tableaux de chaînes, un pour les tableaux d'objets... Le code est identique, seul le type diffère. Les **génériques** résolvent ce problème — en utilisant un « paramètre de type » à la place d'un type concret, un seul code fonctionne pour tous les types.

<GenericTypeDemo />

::: tip La valeur centrale des génériques
- **Réutilisation du code** : Une seule fonction/classe pour tous les types, pas de répétition
- **Sécurité des types** : Contrairement à `any` qui abandonne la vérification, les génériques préservent l'information de type tout au long
- **Contraintes de type** : Avec `extends`, limiter la portée du générique — flexible et sûr
:::

| Caractéristique | Description | Exemple |
|---------|------|------|
| Fonction générique | Paramètres/valeur de retour utilisent un paramètre de type | `function first<T>(arr: T[]): T` |
| Classe générique | Propriétés/méthodes utilisent un paramètre de type | `class Box<T> { value: T }` |
| Contrainte générique | Avec extends, limiter la portée de T | `<T extends HasLength>` |
| Paramètres de type multiples | Utiliser plusieurs variables de type simultanément | `function pair<K, V>(k: K, v: V)` |

---

## 6. Sécurité des types en pratique : Pièges courants et défenses

La théorie est terminée — voyons maintenant les pièges de types les plus fréquents en développement réel. Ces pièges sont indépendants du langage et presque tous les développeurs y sont confrontés.

<TypeSafetyPracticeDemo />

::: tip Quatre règles d'or de la sécurité des types
1. **Activer le mode strict** : TypeScript `strict: true`, Python `mypy --strict`
2. **Éviter `any`** : Utiliser `unknown` à la place de `any` pour forcer la vérification de type avant utilisation
3. **Traiter explicitement null** : Utiliser le chaînage optionnel `?.` et le coalescence nulle `??` pour un accès sûr
4. **Définir des interfaces pour les API** : Les données externes ne sont jamais fiables — interface + validation à l'exécution comme double garantie
:::

| Piège | Niveau de danger | Défense |
|------|---------|---------|
| Référence null/undefined | ⭐⭐⭐⭐⭐ | strictNullChecks + chaînage optionnel |
| Abus du type any | ⭐⭐⭐⭐ | Utiliser unknown + gardes de type |
| Conversion implicite | ⭐⭐⭐ | Comparaison stricte === + ESLint |
| Types de tableau incohérents | ⭐⭐⭐ | Déclarer explicitement le type des éléments du tableau |

---

## 7. Quadrant des types de langages : classification des langages de programmation

En combinant les dimensions « statique/dynamique » et « fort/faible », on obtient une classification en quatre quadrants. Chaque langage de programmation peut être placé dans ce diagramme.

<LanguageTypeModelDemo />

| Quadrant | Caractéristiques | Langages représentatifs | Cas d'usage |
|------|------|---------|---------|
| Statique + Fort | Le plus sûr, vérification stricte à la compilation | Rust, Java, Haskell | Grands systèmes, critique en sécurité |
| Statique + Faible | Vérification à la compilation mais conversion implicite autorisée | C, C++ | Programmation système, sensible aux performances |
| Dynamique + Fort | Vérification à l'exécution, pas de conversion implicite | Python, Ruby | Scripts, prototypes rapides |
| Dynamique + Faible | Le plus flexible, mais aussi le plus sujet aux bugs | JavaScript, PHP | Frontend web, petits scripts |

::: tip Il n'y a pas de « meilleur » système de types
Le système de types est un critère important dans le choix d'un langage :
- **Prototypage rapide** : Dynamique (Python) — développement rapide
- **Grands projets** : Statique (TypeScript, Java) — coût de maintenance faible
- **Programmation système** : Fort + Statique (Rust) — sécurité maximale
- **Travail en équipe** : Le typage statique offre une meilleure lisibilité et un meilleur support IDE
:::

---

## Résumé

Les systèmes de types sont une perspective clé pour comprendre les différences entre langages de programmation. Ce n'est pas de la théorie ennuyeuse, mais quelque chose qui affecte directement votre expérience de codage et la qualité du code.

Les points clés de ce chapitre :

1. **Les types définissent le comportement des données** : chaque donnée a un type qui détermine les opérations possibles
2. **Statique vs Dynamique** : quand vérifier les types — à la compilation ou à l'exécution
3. **Fort vs Faible** : permettre ou non les conversions implicites
4. **Inférence de types** : les langages modernes combinent la concision dynamique et la sécurité statique
5. **Génériques** : réutilisation du code avec des paramètres de type, flexibilité et sécurité des types
6. **Sécurité des types en pratique** : références null, abus de any, conversions implicites sont les pièges les plus courants
7. **Classification en quatre quadrants** : pas de meilleur système de types, seulement le choix le plus adapté au contexte

## Lectures complémentaires

- [Documentation TypeScript](https://www.typescriptlang.org/docs/) — Le surensemble JavaScript à typage statique le plus populaire
- [Python Type Hints](https://docs.python.org/3/library/typing.html) — Le système d'indications de types de Python
- [Rust Book - Data Types](https://doc.rust-lang.org/book/ch03-02-data-types.html) — Introduction au système de types de Rust
- [Type Systems (Wikipedia)](https://en.wikipedia.org/wiki/Type_system) — Vue d'ensemble académique des systèmes de types
- [What To Know Before Debating Type Systems](https://cdsmith.wordpress.com/2011/01/09/an-old-article-i-wrote/) — Discussion classique sur les systèmes de types
