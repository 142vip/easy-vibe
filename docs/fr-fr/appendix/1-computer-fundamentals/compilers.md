# Principes de compilation

::: tip Préface
**Que se passe-t-il quand vous appuyez sur le bouton « Exécuter » ? Comment le code devient-il un résultat à l'écran ?** Chaque ligne de code que vous écrivez est en réalité « illisible » pour l'ordinateur — il ne connaît que les 0 et les 1. Le compilateur est le « traducteur » qui transforme le langage humain en langage machine. Comprendre la théorie des compilateurs vous permet de comprendre d'où viennent les messages d'erreur, pourquoi certains langages sont rapides et d'autres lents, et les mécanismes fondamentaux de l'optimisation du code.
:::

**Que allez-vous apprendre dans cet article ?**

À la fin de ce chapitre, vous aurez acquis :

- **Vue d'ensemble** : maîtriser le pipeline complet de compilation, du code source au programme exécutable
- **Analyse lexicale** : comprendre comment le compilateur découpe le code en tokens
- **Analyse syntaxique** : comprendre la construction de l'AST (arbre syntaxique abstrait)
- **Visualisation de l'AST** : voir directement la structure arborescente du code
- **Analyse sémantique et optimisation** : comprendre les principes de la vérification de types et de l'optimisation du code
- **Techniques d'optimisation en pratique** : maîtriser le constant folding, l'élimination du code mort et d'autres optimisations clés
- **Modèles d'exécution** : distinguer les trois modes d'exécution : compilé, interprété et JIT

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Qu'est-ce qu'un compilateur | Analogie du traducteur, pipeline de compilation |
| **Chapitre 2** | Analyse lexicale | Token, règles lexicales |
| **Chapitre 3** | Analyse syntaxique | AST, arbre syntaxique, priorités |
| **Chapitre 4** | Visualisation de l'AST | Arbre syntaxique interactif, types de nœuds |
| **Chapitre 5** | Analyse sémantique et optimisation | Vérification de types, constant folding, élimination du code mort |
| **Chapitre 6** | Techniques d'optimisation en pratique | Inlining de fonctions, loop hoisting, propagation de constantes |
| **Chapitre 7** | Compilé vs Interprété vs JIT | Comparaison des trois modèles d'exécution |

---

## 0. Principe du pipeline de compilation

Le pipeline de compilation comprend cinq étapes principales :

1. **Analyse lexicale** — découper le code source en tokens
2. **Analyse syntaxique** — organiser les tokens en arbre syntaxique (AST)
3. **Analyse sémantique** — vérifier la validité du code (types, portée)
4. **Optimisation du code** — rendre le code plus efficace
5. **Génération de code** — produire le code machine cible

<CompilerAnalogyDemo />

---

## 1. Le pipeline en six étapes du compilateur

Le travail du compilateur peut être divisé en six phases, comme une chaîne de montage d'usine, chaque phase transmettant son résultat à la suivante.

<CompilerDemo />

::: tip Pipeline de compilation
1. **Analyse lexicale (Lexical Analysis)** : découper le code source en tokens (mots)
2. **Analyse syntaxique (Syntax Analysis)** : organiser les tokens en arbre syntaxique (AST)
3. **Analyse sémantique (Semantic Analysis)** : vérifier que les types sont corrects et les variables déclarées
4. **Génération de code intermédiaire (IR Generation)** : produire une représentation intermédiaire indépendante de la plateforme
5. **Optimisation du code (Optimization)** : rendre le code intermédiaire plus efficace
6. **Génération de code (Code Generation)** : produire le code machine de la plateforme cible
:::

| Phase | Entrée | Sortie | Analogie |
|------|------|------|------|
| Analyse lexicale | Flux de caractères du code source | Flux de tokens | Découper une phrase en mots |
| Analyse syntaxique | Flux de tokens | AST (arbre syntaxique) | Analyser la structure de la phrase |
| Analyse sémantique | AST | AST typé | Vérifier que le sens est cohérent |
| Code intermédiaire | AST typé | IR | Rédiger un premier brouillon |
| Optimisation du code | IR | IR optimisé | Affiner et supprimer |
| Génération de code | IR optimisé | Code machine | Produire la version finale |

---

## 2. Analyse lexicale : découper le code en « mots »

L'analyse lexicale est la première étape de la compilation. Le compilateur scanne chaque caractère du code source de gauche à droite et les regroupe en **tokens (unités lexicales)** significatifs.

<LexerTokenDemo />

Comme votre cerveau assemble automatiquement les lettres en mots lorsque vous lisez une phrase en anglais, l'analyseur lexical assemble les caractères en tokens :

```
Code source : let x = 10 + 5;

Flux de tokens :
[let]   → Mot-clé (mot réservé du langage)
[x]     → Identifiant (nom de variable)
[=]     → Opérateur (affectation)
[10]    → Littéral numérique
[+]     → Opérateur (addition)
[5]     → Littéral numérique
[;]     → Séparateur (fin d'instruction)
```

::: tip Les cinq types de tokens
- **Mots-clés** : mots spéciaux réservés par le langage, comme `let`, `if`, `return`, `function`
- **Identifiants** : noms définis par le programmeur, comme les noms de variables et de fonctions
- **Littéraux** : valeurs écrites directement dans le code, comme le nombre `42` ou la chaîne `"hello"`
- **Opérateurs** : symboles effectuant des calculs, comme `+`, `-`, `=`, `===`
- **Séparateurs** : symboles délimitant la structure du code, comme `;`, `,`, `(`, `)`
:::

---

## 3. Analyse syntaxique : construire l'arbre syntaxique (AST)

L'analyse lexicale a découpé le code en tokens, mais les tokens ne sont que des « mots » isolés. L'analyse syntaxique a pour mission d'organiser ces tokens en un **arbre syntaxique abstrait (Abstract Syntax Tree, AST)** selon les règles grammaticales — il reflète la structure du code et la priorité des opérateurs.

```
Expression : 1 + 2 * 3

Arbre syntaxique :     Pourquoi cette forme ?
       +            Parce que * a une
      / \           priorité supérieure
     1   *          à +, donc 2 * 3
        / \         est d'abord regroupé
       2   3        en sous-arbre
```

::: tip L'importance de l'AST
L'AST est la « structure de données centrale » du compilateur ; l'analyse sémantique, l'optimisation et la génération de code ultérieures s'appuient toutes dessus. Les outils de développement modernes utilisent également massivement l'AST :
- **ESLint** : parse le code en AST pour vérifier les violations de règles
- **Prettier** : parse en AST puis reformate la sortie
- **Babel** : parse l'AST → transforme → génère du code compatible
- **Refactoring dans l'IDE** : renommage sûr de variables et extraction de fonctions basés sur l'AST
:::

| Structure syntaxique | Séquence de tokens | Nœud AST |
|---------|-----------|---------|
| Déclaration de variable | `let` `x` `=` `10` | VariableDeclaration → Identifier + Literal |
| Appel de fonction | `add` `(` `1` `,` `2` `)` | CallExpression → Identifier + Arguments |
| Instruction conditionnelle | `if` `(` `a` `>` `b` `)` | IfStatement → BinaryExpression + Block |

---

## 4. Visualisation de l'AST : structure arborescente du code

Ci-dessus, nous avons décrit la structure de l'AST textuellement, mais « voir » est plus intuitif que « lire ». Le composant interactif ci-dessous vous permet de choisir différentes expressions et d'observer leur arbre syntaxique en temps réel.

<ASTVisualizerDemo />

Grâce à la visualisation, vous découvrirez que les règles fondamentales de l'AST sont en réalité très simples :

| Structure du code | Nœud racine de l'AST | Nœuds enfants |
|---------|-----------|-------|
| `1 + 2 * 3` | BinaryExpression (+) | Gauche : NumericLiteral(1), Droite : BinaryExpression(*) |
| `let x = 10` | VariableDeclaration | VariableDeclarator → Identifier(x) + NumericLiteral(10) |
| `add(a, b)` | CallExpression | Identifier(add) + Arguments(a, b) |

::: tip L'AST dans le développement quotidien
Vous n'avez peut-être jamais écrit de compilateur, mais vous utilisez chaque jour des outils basés sur l'AST :
- **ESLint / Prettier** : parsent le code en AST, vérifient les règles ou reformatent
- **Babel / SWC** : parsent l'AST → transforment la syntaxe → génèrent du code compatible
- **Refactoring dans l'IDE** : renommage sûr, extraction de fonctions basés sur l'AST
- **Tree-shaking** : analysent les import/export de l'AST, suppriment le code inutilisé
:::

---

## 5. Analyse sémantique et optimisation du code

L'analyse syntaxique garantit que le code est « structurellement correct », mais une structure correcte ne signifie pas que le code est valide. L'analyse sémantique vérifie la validité du code, tandis que l'optimisation du code permet au programme de s'exécuter plus rapidement.

<CompilationPracticeDemo />

### 5.1 Analyse sémantique : vérification de la validité du code

| Vérification | Exemple | Résultat |
|---------|------|------|
| Vérification de types | `int x = "hello"` | ❌ Incompatibilité de types |
| Vérification de portée | Utilisation d'une variable non déclarée `y` | ❌ La variable n'existe pas |
| Inférence de types | `1 + 2.0` | ✅ Résultat inféré comme float |
| Vérification des paramètres | `add(1, 2, 3)` mais la fonction n'accepte que 2 paramètres | ❌ Nombre de paramètres incorrect |

::: tip La plupart des erreurs que vous voyez proviennent de l'analyse sémantique
- `TypeError: Cannot read properties of undefined` — vérification de types
- `ReferenceError: x is not defined` — vérification de portée
- `Expected 2 arguments, but got 3` — vérification des paramètres
:::

### 5.2 Optimisation du code : rendre le programme plus rapide

Avant de générer le code final, le compilateur applique diverses optimisations au code intermédiaire. Ces optimisations sont transparentes pour le programmeur mais peuvent améliorer significativement les performances.

| Technique d'optimisation | Avant | Après | Principe |
|---------|-------|-------|------|
| Constant folding | `x = 10 + 5` | `x = 15` | Calcul du résultat à la compilation |
| Élimination du code mort | `if (false) { ... }` | Suppression directe | Code qui ne sera jamais exécuté |
| Propagation de constantes | `x = 15; y = x * 2` | `y = 30` | Remplacement direct par les valeurs connues |
| Déplacement des invariants de boucle | `len = arr.length` calculé en boucle | Déplacé hors de la boucle | Éviter les calculs répétés |

---

## 6. Techniques d'optimisation en pratique : comment le compilateur accélère le code

Nous avons mentionné plusieurs techniques d'optimisation par leur nom. Voyons maintenant en détail comment le compilateur procède concrètement. Le composant interactif ci-dessous illustre 5 des optimisations les plus courantes ; vous pouvez comparer visuellement le code avant et après optimisation.

<CodeOptimizationDemo />

Les compilateurs modernes et les moteurs JIT (comme V8, GCC, LLVM) appliquent automatiquement des dizaines d'optimisations. En tant que développeur, vous n'avez pas besoin de les faire manuellement, mais les comprendre vous aide à :

- **Écrire du code plus facilement optimisable** : par exemple, utiliser `const` plutôt que `let` facilite le constant folding par le compilateur
- **Comprendre les différences de performance** : pourquoi les petites fonctions sont-elles plus rapides que les grandes ? Parce que le compilateur peut les inliner
- **Éviter la « désoptimisation »** : certains patterns comme `eval()` et `with` empêchent les optimisations du compilateur

| Technique d'optimisation | Condition de déclenchement | Impact sur les performances | Ce que le développeur peut faire |
|---------|---------|---------|-------------|
| Constant folding | L'expression ne contient que des constantes | Élimine le calcul à l'exécution | Utiliser davantage les déclarations const |
| Élimination du code mort | Code inaccessible ou résultat inutilisé | Réduit la taille du code | Nettoyer le code inutilisé |
| Déplacement des invariants de boucle | Calcul invariant dans la boucle | Réduit les calculs répétés | L'extraction manuelle est aussi une bonne pratique |
| Inlining de fonctions | Petite fonction appelée fréquemment | Élimine le surcoût d'appel | Garder les fonctions petites et ciblées |
| Propagation de constantes | Valeur de variable déterminable à la compilation | Toute la chaîne de calcul est éliminée | Utiliser des constantes plutôt que des nombres magiques |

---

## 7. Compilé vs Interprété vs JIT

Une fois le code écrit, il existe trois « modes de traduction » pour l'exécuter. Chacun a ses avantages et inconvénients, déterminant directement les caractéristiques de performance et les cas d'usage d'un langage.

<CompileVsInterpretDemo />

| Dimension | Compilé | Interprété | JIT (Just-In-Time) |
|------|-------|-------|------------|
| Processus | Compiler entièrement en code machine, puis exécuter | Lire et exécuter ligne par ligne | D'abord interpréter, puis compiler les points chauds |
| Vitesse d'exécution | La plus rapide | La plus lente | Intermédiaire (points chauds proches du compilé) |
| Vitesse de démarrage | Lent (compilation nécessaire) | Rapide (exécution directe) | Intermédiaire (préchauffage nécessaire) |
| Multiplateforme | Recompilation nécessaire | Naturellement multiplateforme | Multiplateforme |
| Langages représentatifs | C, Rust, Go | Python, Ruby | JavaScript (V8), Java |

::: tip Pourquoi JavaScript est-il si rapide ?
Le compilateur JIT du moteur V8 surveille quelles portions de code sont fréquemment exécutées (points chauds), puis les compile en code machine hautement optimisé. Ainsi, bien que JavaScript soit un « langage interprété », sa performance dans V8 peut approcher celle des langages compilés. C'est aussi ce qui permet à Node.js d'être utilisé côté serveur.
:::

---

## Résumé

La théorie des compilateurs n'est pas un savoir réservé aux seuls développeurs de compilateurs. Comprendre le processus de compilation vous aide à mieux saisir les messages d'erreur, à choisir le bon langage et à écrire du code plus efficace.

Revenons sur les points clés de ce chapitre :

1. **Pipeline en cinq étapes** : analyse lexicale → analyse syntaxique → analyse sémantique → optimisation → génération de code
2. **L'analyse lexicale découpe en tokens** : découpe le flux de caractères en mots-clés, identifiants, opérateurs et autres unités significatives
3. **L'analyse syntaxique construit l'AST** : organise les tokens en structure arborescente selon les règles grammaticales, reflétant la priorité des opérateurs
4. **L'analyse sémantique garantit la correction** : vérification de types, vérification de portée — la plupart des erreurs que vous voyez proviennent d'ici
5. **Le compilateur optimise automatiquement** : le constant folding, l'élimination du code mort, l'inlining de fonctions accélèrent le code automatiquement
6. **Trois modèles d'exécution** : compilé le plus rapide, interprété le plus flexible, JIT combine les deux

## Lectures complémentaires

- [AST Explorer](https://astexplorer.net/) — Visualiser la structure AST du code en ligne
- [Crafting Interpreters](https://craftinginterpreters.com/) — Implémenter un langage de programmation depuis zéro (livre en ligne gratuit)
- [The Super Tiny Compiler](https://github.com/jamiebuilds/the-super-tiny-compiler) — Un minuscule compilateur en JavaScript
- [V8 Blog](https://v8.dev/blog) — Blog sur la technologie de compilation JIT du moteur V8
- [Site officiel de LLVM](https://llvm.org/) — L'infrastructure de compilateur la plus populaire
