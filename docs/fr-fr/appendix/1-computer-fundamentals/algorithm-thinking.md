# Introduction aux algorithmes

::: tip Préface
**Comment résoudre efficacement les problèmes ?** Vous avez peut-être déjà rencontré cette situation : pour un même problème, le code de l'un donne un résultat en quelques secondes, tandis que celui d'un autre tourne toujours au bout de plusieurs minutes. La différence réside souvent dans l'algorithme. Ce chapitre vous guide vers la compréhension des concepts fondamentaux de la pensée algorithmique.
:::

**Que allez-vous apprendre dans cet article ?**

À la fin de ce chapitre, vous aurez acquis :

- **Capacité de décomposition** : face à des problèmes complexes, savoir utiliser des stratégies comme diviser pour régner ou la récursivité, plutôt que de coder immédiatement
- **Jugement d'efficacité** : utiliser la notation grand O pour déterminer quelle solution est la plus efficace, plutôt que de deviner au feeling
- **Pensée en complexité** : estimer la taille des données et les exigences temporelles avant de coder, pour choisir le bon niveau d'algorithme
- **Fondements pour la suite** : préparer le terrain pour les structures de données avancées, les systèmes distribués et l'apprentissage automatique

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Recherche binaire | Diviser pour régner, O(log n) |
| **Chapitre 2** | Algorithmes de tri | Tri à bulles, tri rapide, tri fusion |
| **Chapitre 3** | Analyse de complexité | Complexité temporelle, complexité spatiale |

---

## 0. Présentation d'un algorithme

Imaginez que vous cherchez un mot dans un dictionnaire :

- **Méthode 1** : Tourner les pages une par une depuis le début (recherche linéaire)
- **Méthode 2** : Se positionner grâce à la première lettre, puis faire une recherche binaire (recherche binaire)

Les deux méthodes permettent de trouver le mot, mais leur efficacité est radicalement différente. **Un algorithme est une méthode de résolution de problème.**

<AlgorithmDemo />

**Indicateurs clés d'un algorithme :**

| Indicateur | Signification | Pourquoi c'est important |
|------|------|-----------|
| **Complexité temporelle** | Tendance du temps d'exécution en fonction de la taille des données | Prédire les performances sur de grandes quantités de données |
| **Complexité spatiale** | Tendance de l'utilisation mémoire en fonction de la taille des données | Évaluer la consommation mémoire |
| **Correction** | Obtient-il toujours le bon résultat | Exigence fondamentale d'un algorithme |

::: tip 📊 Lecture ligne par ligne
**Complexité temporelle** : décrite avec la notation grand O. O(n) signifie que si la taille des données double, le temps double aussi ; O(n²) signifie que si les données doublent, le temps est multiplié par 4.

**Complexité spatiale** : utilise également la notation grand O. Certains algorithmes échangent de l'espace contre du temps (comme les tables de hachage), d'autres échangent du temps contre de l'espace (comme les algorithmes de compression).

**Correction** : un algorithme doit produire un résultat correct pour toutes les entrées possibles. Les cas limites (entrée vide, entrée extrêmement grande) sont les plus sujets aux erreurs.
:::

---

## 1. Recherche binaire : éliminer la moitié à chaque fois

### 1.1 Principe de la recherche binaire

::: tip 💡 Comment fonctionne la recherche binaire ?
**Prérequis** : les données doivent être triées

**Processus** :
1. Trouver l'élément du milieu
2. Si l'élément du milieu est égal à la cible — trouvé !
3. Si la cible est inférieure à l'élément du milieu, continuer dans la moitié gauche
4. Si la cible est supérieure à l'élément du milieu, continuer dans la moitié droite
5. À chaque étape, éliminer la moitié, jusqu'à trouver ou confirmer l'absence

**Complexité temporelle** : O(log n)

**Analogie quotidienne** : Le jeu du nombre à deviner. Je pense à un nombre entre 1 et 100, vous devinez le milieu à chaque fois et je vous dis si c'est plus grand ou plus petit. En 7 essais maximum, vous trouverez (car 2⁷ = 128 > 100).
:::

👇 **Essayez par vous-même** :
La démo ci-dessous illustre le principe de la recherche binaire. Choisissez entre la recherche séquentielle et la recherche binaire pour comparer :

<SearchAlgorithmDemo />

### 1.2 Principe de l'efficacité de la recherche binaire

| Taille des données | Recherche linéaire | Recherche binaire |
|--------|---------|---------|
| 100 | 100 fois | 7 fois |
| 1 000 | 1 000 fois | 10 fois |
| 1 000 000 | 1 000 000 fois | 20 fois |
| 1 000 000 000 | 1 000 000 000 fois | 30 fois |

::: tip 📊 Lecture ligne par ligne
**Première colonne (taille des données)** : la quantité de données à rechercher. La taille passe de 100 à 1 milliard (multipliée par 10 millions !)

**Deuxième colonne (recherche linéaire)** : la méthode la plus « basique » — chercher un par un depuis le début. Le nombre de comparaisons est égal à la taille des données ; plus il y a de données, plus il y a de comparaisons.

**Troisième colonne (recherche binaire)** : la méthode intelligente — éliminer la moitié à chaque fois. Le nombre de comparaisons ne dépend que du logarithme de la taille des données. Même avec 1 milliard de données, il suffit de 30 comparaisons !

**Conclusion comparative** : lorsque les données atteignent 1 million, la recherche linéaire nécessite 1 million de comparaisons, tandis que la recherche binaire n'en nécessite que 20 — un facteur 50 000 de différence !
:::

::: tip 📊 La puissance de la croissance logarithmique
La complexité temporelle de la recherche binaire est O(log n), ce qui signifie :

- 1 milliard de données → 30 comparaisons maximum
- 1 billion de données → 40 comparaisons maximum

C'est la puissance de la croissance logarithmique : la taille des données est multipliée par 1 000, le nombre de comparaisons n'augmente que de 10.
:::

---

## 2. Le tri : transformer le désordre en ordre

### 2.1 Algorithmes de tri courants

| Algorithme | Complexité temporelle | Caractéristiques | Cas d'usage |
|------|-----------|------|---------|
| **Tri à bulles** | O(n²) | Simple mais lent | Enseignement, petites quantités de données |
| **Tri par sélection** | O(n²) | Simple mais lent | Petites quantités de données |
| **Tri par insertion** | O(n²) | Rapide sur des données presque triées | Petites quantités, presque triées |
| **Tri rapide** | O(n log n) | Le plus rapide en pratique | Tri généraliste |
| **Tri fusion** | O(n log n) | Tri stable | Scénarios nécessitant la stabilité |
| **Tri par tas** | O(n log n) | Tri sur place | Scénarios à mémoire limitée |

::: tip 📊 Lecture ligne par ligne
**Tri à bulles** : l'algorithme de tri le plus fondamental, comme des bulles remontant à la surface de l'eau. Facile à comprendre, mais le plus lent. Adapté pour apprendre le concept de tri, pas pour une utilisation réelle.

**Tri par sélection** : à chaque fois, sélectionner le plus petit et le placer en premier. Aussi simple, mais effectue le même nombre de comparaisons que les données soient triées ou non.

**Tri par insertion** : comme lorsqu'on trie ses cartes en main. Insérer chaque élément dans la partie déjà triée. Très efficace sur des données presque triées.

**Tri rapide** : l'algorithme de tri le plus utilisé en pratique. Le plus rapide en moyenne, mais se dégrade à O(n²) dans le pire cas (données déjà triées).

**Tri fusion** : utilise le principe « diviser pour régner », toujours O(n log n), mais nécessite de l'espace supplémentaire. Adapté aux scénarios nécessitant un tri stable.

**Tri par tas** : utilise la structure de données « tas » pour trier, sur place (pas d'espace supplémentaire), mais souvent plus lent que le tri rapide en pratique.
:::

### 2.2 Principe de l'efficacité du tri rapide

::: tip 💡 Principe du tri rapide
**Idée centrale** : Diviser pour régner

1. Choisir un élément « pivot »
2. Placer les éléments plus petits que le pivot à gauche, les plus grands à droite
3. Trier récursivement les parties gauche et droite
4. Fusionner les résultats

**Pourquoi rapide ?**
- Après chaque partitionnement, le pivot est à sa position finale
- En moyenne, chaque partition élimine environ la moitié des éléments
- Complexité temporelle O(n log n)

**Analogie quotidienne** : Ranger une bibliothèque. Sortir un livre, placer les plus minces à gauche et les plus épais à droite. Puis répéter le processus pour chaque pile.
:::

👇 **Essayez par vous-même** :
La démo ci-dessous visualise les algorithmes de tri. Générez un tableau et observez la comparaison entre le tri à bulles et le tri rapide :

<SortingAlgorithmDemo />

---

## 3. Récursivité : s'appeler soi-même

### 3.1 L'essence de la récursivité

::: tip 💡 Principe de la récursivité
**La récursivité** est une technique de programmation où une fonction s'appelle elle-même.

**Deux éléments clés** :
1. **Cas de base** : condition d'arrêt de la récursivité
2. **Étape récursive** : décomposition du problème en sous-problèmes plus petits

**Exemple classique : la factorielle**
```js
function factorial(n) {
  if (n <= 1) return 1        // Cas de base
  return n * factorial(n - 1) // Étape récursive
}
```

**Analogie quotidienne** : Les poupées russes. On ouvre une poupée, à l'intérieur il y en a une plus petite, jusqu'à la plus petite qui ne s'ouvre plus.
:::

### 3.2 Récursivité vs Itération

| Caractéristique | Récursivité | Itération (boucle) |
|------|------|-------------|
| **Concision du code** | Généralement plus concis | Potentiellement plus complexe |
| **Consommation mémoire** | Plus élevée (pile d'appels) | Plus faible |
| **Performance** | Légèrement plus lent (overhead des appels) | Plus rapide |
| **Cas d'usage** | Parcours d'arbres, diviser pour régner | Tâches répétitives simples |

::: tip 📊 Lecture ligne par ligne
**Concision du code** : la récursivité peut souvent exprimer une logique complexe en quelques lignes (comme le parcours d'un arbre), tandis que les boucles peuvent nécessiter plus de variables et d'imbrications.

**Consommation mémoire** : la récursivité utilise une « pile d'appels » pour stocker les informations de chaque niveau, comme empiler des assiettes — à chaque appel récursif, on ajoute une assiette. Les boucles n'ont pas cet overhead.

**Performance** : chaque appel de fonction a un overhead (passage de paramètres, opérations sur la pile, etc.), donc la récursivité est généralement légèrement plus lente que les boucles.

**Cas d'usage** : la récursivité excelle pour les problèmes de structure intrinsèquement récursive (comme les arbres de fichiers, le DOM) ; les boucles sont adaptées aux opérations répétitives simples (comme le parcours de tableaux).
:::

::: warning ⚠️ Pièges de la récursivité
**Débordement de pile (Stack Overflow)** : la profondeur de récursivité est trop importante, l'espace de la pile d'appels est épuisé.

**Solutions** :
- Passer à l'itération
- Utiliser l'optimisation de la récursivité terminale (prise en charge par certains langages)
- Limiter la profondeur de récursivité
:::

👇 **Essayez par vous-même** :
La démo ci-dessous montre le processus d'appel récursif. Observez comment une fonction s'appelle elle-même :

<RecursiveThinkingDemo />

---

## 4. Algorithmes gloutons : choisir l'optimum à chaque étape

### 4.1 La pensée gloutonne

::: tip 💡 Principe de l'algorithme glouton
**Les algorithmes gloutons** font à chaque étape le choix qui semble localement optimal, en espérant obtenir une solution globalement optimale.

**Conditions d'application** :
1. **Propriété de choix glouton** : un optimum local conduit à un optimum global
2. **Sous-structure optimale** : la solution optimale du problème contient les solutions optimales des sous-problèmes

**Exemple classique : le rendu de monnaie**
- Objectif : composer un montant donné avec le moins de pièces possible
- Stratégie gloutonne : toujours choisir la plus grande pièce
- Résultat : 67 € = 50 + 10 + 5 + 1 + 1 (5 pièces)

**Analogie quotidienne** : En montagne, choisir à chaque fois le chemin le plus raide. On n'atteint pas nécessairement le sommet le plus haut, mais généralement une bonne position.
:::

### 4.2 Les limites de l'approche gloutonne

::: warning ⚠️ Le glouton ne garantit pas toujours l'optimum
**Contre-exemple : rendu de monnaie**

Si les valeurs des pièces sont [1, 3, 4] et qu'on doit composer 6 € :
- Glouton : 4 + 1 + 1 = 3 pièces
- Optimal : 3 + 3 = 2 pièces

L'algorithme glouton a échoué ici !

**Leçon** : les algorithmes gloutons sont simples et efficaces, mais ne trouvent pas toujours la solution optimale. Avant de les utiliser, il faut prouver que le problème satisfait les conditions gloutonnes.
:::

👇 **Essayez par vous-même** :
La démo ci-dessous montre les effets pratiques de l'algorithme glouton. Essayez différentes combinaisons de pièces et observez les performances de la stratégie gloutonne :

<GreedyThinkingDemo />

---

## 5. Paradigmes de conception d'algorithmes

| Paradigme | Idée | Algorithmes typiques | Problèmes applicables |
|------|------|---------|---------|
| **Diviser pour régner** | Décomposer le problème en sous-problèmes | Tri rapide, tri fusion | Problèmes décomposables |
| **Glouton** | Choisir l'optimum à chaque étape | Arbre couvrant minimum, codage de Huffman | Problèmes avec propriété gloutonne |
| **Programmation dynamique** | Mémoriser les solutions des sous-problèmes | Problème du sac à dos, plus court chemin | Sous-problèmes chevauchants |
| **Retour arrière (Backtracking)** | Essayer, revenir en arrière si ça ne marche pas | Problème des huit dames, toutes les permutations | Problèmes de recherche |

::: tip 📊 Lecture ligne par ligne
**Diviser pour régner** : décomposer les grands problèmes en petits, les résoudre séparément puis les fusionner. Comme faire le ménage : salon, chambre, cuisine séparément, et à la fin tout est propre.

**Glouton** : à chaque étape, choisir le mieux actuellement sans penser aux conséquences à long terme. Comme manger d'abord son plat préféré — pas forcément optimal, mais rapide.

**Programmation dynamique** : retenir les résultats intermédiaires pour éviter les calculs redondants. Comme prendre des notes : la prochaine fois qu'on rencontre le même problème, on consulte directement la réponse.

**Retour arrière** : quand on est bloqué, revenir en arrière et réessayer. Comme dans un labyrinthe : ce chemin est bloqué, retourner au carrefour précédent et en essayer un autre.
:::

👇 **Essayez par vous-même** :
La démo ci-dessous présente les caractéristiques et les domaines d'application des différents paradigmes de conception d'algorithmes :

<AlgorithmParadigmDemo />

---

## 6. Résumé : L'algorithme, un art de résoudre les problèmes

Résumons les différentes pensées algorithmiques avec une analogie :

| Pensée | Analogie | Point clé |
|------|------|---------|
| **Recherche binaire** | Devinette numérique | Éliminer la moitié à chaque fois |
| **Tri** | Ranger une bibliothèque | Créer de l'ordre |
| **Récursivité** | Poupées russes | Réduire le grand au petit |
| **Glouton** | Choisir son chemin en montagne | Optimum local |

::: tip 💡 Insight clé
**L'essence des algorithmes est l'équilibre entre « efficacité » et « correction ».**

- Un bon algorithme peut améliorer les performances de plusieurs ordres de grandeur
- Mais l'optimisation excessive peut introduire de la complexité
- D'abord assurer la correction, puis viser l'efficacité

Comprendre la pensée algorithmique est plus important que de mémoriser des algorithmes spécifiques :
- Diviser pour régner : décomposer les grands problèmes en petits
- Glouton : choisir l'optimum à chaque étape
- Programmation dynamique : mémoriser les solutions des sous-problèmes
- Retour arrière : essayer, revenir en arrière si ça ne marche pas
:::

---

## Lectures complémentaires

- **Introduction à l'algorithmique** : manuel classique pour l'apprentissage systématique des algorithmes
- **LeetCode** : améliorer ses compétences algorithmiques par la pratique
- **Visualisation d'algorithmes** : comprendre intuitivement l'exécution des algorithmes
- **Algorithmes de compétition** : apprendre des techniques algorithmiques avancées
