# Introduction aux structures de données

::: tip Préface
**Programme = Structure de données + Algorithme.** Nous avons appris comment le CPU exécute les instructions et comment le système d'exploitation gère les ressources. Mais l'objet central que traitent les programmes est la **donnée** — informations utilisateur, listes de produits, relations sociales... La façon dont ces données sont organisées en mémoire détermine directement la vitesse du programme. Vous êtes-vous déjà demandé pourquoi certains programmes traitent des dizaines de milliers d'enregistrements en un instant, tandis que d'autres bloquent après quelques centaines ? La réponse résume souvent dans le **choix de la structure de données**.
:::

**Que allez-vous apprendre dans cet article ?**

À la fin de ce chapitre, vous aurez acquis :

- **Intuition de jugement** : voir un besoin et avoir automatiquement la bonne structure de données en tête
- **Perspective d'analyse de performance** : déterminer si le goulot d'étranglement vient d'un mauvais choix de structure de données ou d'un algorithme inefficace
- **Pensée en compromis** : comprendre l'échange « espace contre temps » et « temps contre espace », et savoir qu'il n'y a pas de structure de données parfaite
- **Lisibilité du code** : ne plus être intimidé par HashMap, Stack, Queue et autres termes
- **Fondements pour la suite** : préparer le terrain pour les index de bases de données, les systèmes de cache et les moteurs de recherche

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Vue d'ensemble | Quatre grandes catégories, critères de classification |
| **Chapitre 2** | Structures linéaires | Tableaux, listes chaînées, piles, files |
| **Chapitre 3** | Tables de hachage | Fonction de hachage, gestion des collisions, recherche en O(1) |
| **Chapitre 4** | Structures arborescentes | Arbre binaire, arbre du système de fichiers, arbre DOM |
| **Chapitre 5** | Structures de graphes | Graphe orienté, non orienté, algorithmes de parcours |
| **Chapitre 6** | Comparaison de performances | Complexité temporelle, complexité spatiale |
| **Chapitre 7** | Guide de sélection | Analyse de scénarios, processus de décision |

---

## 1. Présentation des structures de données

Imaginez que vous devez organiser une pile de livres :

- **Entassés par terre** : pour trouver un livre, il faut les fouiller un par un — stockage le plus primitif
- **Placés dans une étagère numérotée** : aller directement à l'emplacement — c'est un **tableau**
- **Répartis dans des armoires par catégorie** : déterminer d'abord l'armoire, puis chercher — c'est une **table de hachage**
- **Placés sur des étagères multicoups triées par titre** : éliminer la moitié à chaque fois — c'est un **arbre**

Le mode d'organisation fait une différence considérable d'efficacité. **Une structure de données est la « méthode d'organisation » des données** — elle détermine comment les données sont stockées, trouvées et modifiées.

<DataStructureOverviewDemo />

Toutes les structures de données se répartissent en quatre grandes catégories :

| Type | Relation entre les données | Représentants typiques | Analogie quotidienne |
|------|---------|---------|---------|
| **Structure linéaire** | Un-à-un, en ligne | Tableau, liste chaînée, pile, file | Wagons de train, file d'attente |
| **Structure de hachage** | Clé → Valeur | Table de hachage, dictionnaire, ensemble | Fichier de bibliothèque |
| **Structure arborescente** | Un-à-plusieurs, hiérarchique | Arbre binaire, arbre B, tas | Arbre généalogique, dossiers |
| **Structure de graphe** | Plusieurs-à-plusieurs, en réseau | Graphe orienté, graphe non orienté | Plan de métro, réseau social |

::: tip Pourquoi apprendre autant de types ?
Parce qu'**il n'y a pas de structure de données universelle**. Chaque structure est un compromis entre « vitesse de recherche », « vitesse d'insertion » et « consommation mémoire ». Comme on n'utilise pas un sac à dos pour déménager des meubles ni un camion pour envoyer une lettre — choisir le bon outil multiplie l'efficacité.
:::

---

## 2. Structures linéaires : Le mode d'organisation le plus fondamental

Les structures linéaires sont la façon la plus intuitive d'organiser les données — les données sont disposées les unes après les autres, comme des wagons de train. Mais la façon de les « connecter » et l'extrémité d'où l'on opère produisent quatre variantes, chacune avec ses points forts.

<LinearStructuresDemo />

### 2.1 Tableau vs Liste chaînée : Deux modes de stockage fondamentalement différents

Les tableaux et les listes chaînées sont les deux structures linéaires les plus fondamentales. Leur différence clé réside dans la **disposition en mémoire** :

| Dimension de comparaison | Tableau | Liste chaînée |
|---------|------|------|
| **Disposition mémoire** | Un bloc continu | Éparpillé, relié par des pointeurs |
| **Accès au n-ième** | Calculer l'adresse directement, O(1) | Chercher un par un depuis le début, O(n) |
| **Insertion au milieu** | Déplacer tous les suivants, O(n) | Modifier deux pointeurs seulement, O(1) |
| **Taille** | Fixée à la création | Extensible à tout moment |
| **Analogie** | Rangée de casiers numérotés | Chasse au trésor avec indices en chaîne |

::: tip Quand utiliser un tableau ? Quand une liste chaînée ?
- **Quantité de données connue, accès fréquent par position** → Tableau (ex. : bulletin de notes, matrice de pixels)
- **Quantité inconnue, insertions/suppressions fréquentes** → Liste chaînée (ex. : playlist, historique d'annulation)
- **Incertain ?** → Commencer par un tableau. Dans la plupart des scénarios, l'avantage de performance lié à la convivialité cache l'emporte
:::

### 2.2 Piles et files : Structures linéaires « avec des règles »

Les piles et les files sont en essence des tableaux ou des listes chaînées, mais avec des **opérations restreintes**. Cela semble réduire les fonctionnalités, mais c'est précisément cette restriction qui leur donne un usage bien défini :

| Structure | Règle | Opérations | Analogie | Où dans votre code ? |
|------|------|------|------|-----------------|
| **Pile (Stack)** | Dernier entré, premier sorti (LIFO) | push / pop | Pile d'assiettes | Pile d'appels, retour navigateur, Ctrl+Z |
| **File (Queue)** | Premier entré, premier sorti (FIFO) | enqueue / dequeue | File d'attente au guichet | Ordonnancement, file de messages, file d'impression |

::: tip Pourquoi la « restriction » est-elle une bonne chose ?
Imaginez une pile qui ne permet que « poser une assiette » et « retirer une assiette » — vous ne vous tromperez jamais d'ordre. **La restriction apporte la déterminabilité, la déterminabilité apporte la fiabilité.** La pile d'appels garantit par LIFO que la dernière fonction appelée est la première à revenir. Si l'on pouvait accéder arbitrairement aux fonctions intermédiaires, le programme serait chaotique.
:::

---

## 3. Tables de hachage : La recherche la plus rapide

La recherche dans les structures linéaires n'est jamais assez rapide — le tableau nécessite un parcours O(n), même trié avec la recherche binaire c'est O(log n). Existe-t-il une structure capable de **trouver directement en O(1)** ? Oui, la table de hachage.

<HashTableDemo />

### 3.1 L'idée centrale de la table de hachage

Le principe est en réalité très simple :

1. Vous fournissez une **clé** (par ex. « pomme »)
2. La **fonction de hachage** calcule un nombre à partir de la clé (par ex. `hash("pomme") = 3`)
3. Aller directement à la position 3 du tableau — pas de parcours, en une seule étape

C'est comme le système d'indexation d'une bibliothèque : au lieu de parcourir toutes les étagères, on consulte le fichier et on localise directement le livre.

### 3.2 Principe de gestion des collisions de hachage

Deux clés différentes peuvent donner le même index — c'est une **collision de hachage**. Comme deux livres avec le même numéro de fichier pointant vers le même emplacement.

| Méthode | Principe | Analogie |
|---------|------|------|
| **Chaînage** | Stocker plusieurs valeurs au même endroit via une liste chaînée | Plusieurs livres dans le même casier |
| **Adressage ouvert** | En cas de collision, chercher la prochaine place libre | Casier plein → casier voisin |

### 3.3 Performances de la table de hachage

| Opération | Cas moyen | Pire cas (toutes en collision) |
|------|---------|-------------------|
| **Recherche** | O(1) | O(n) |
| **Insertion** | O(1) | O(n) |
| **Suppression** | O(1) | O(n) |

::: warning Quand y a-t-il dégradation ?
Quand toutes les clés sont mappées vers le même index, la table de hachage dégénère en liste chaînée et toutes les opérations deviennent O(n). Solution : choisir une bonne fonction de hachage + redimensionnement dynamique (quand le facteur de charge dépasse le seuil).
:::

::: tip La table de hachage est partout dans votre code
- Les objets `{}` et `Map` de JavaScript → table de hachage
- Le `dict` de Python → table de hachage
- Le `HashMap` de Java → table de hachage
- Les index de base de données → utilisent aussi le hachage en interne

Chaque fois que vous écrivez `user["name"]` ou `map.get("key")`, c'est une table de hachage qui travaille en arrière-plan.
:::

---

## 4. Structures arborescentes : Expression des relations hiérarchiques

La table de hachage recherche vite, mais les données ne sont pas triées. Si vous avez besoin de **rechercher rapidement tout en gardant les données ordonnées**, il faut des structures arborescentes.

Caractéristique clé de l'arbre : chaque nœud peut avoir plusieurs « enfants », mais un seul « parent » (sauf la racine). Cette relation hiérarchique un-à-plusieurs se retrouve partout dans la réalité.

<TreeStructureDemo />

### 4.1 Arbre binaire de recherche : Un arbre ordonné

L'arbre binaire de recherche suit une règle simple mais puissante : **à gauche les plus petits, à droite les plus grands**.

- Toutes les valeurs du sous-arbre gauche < nœud racine
- Toutes les valeurs du sous-arbre droit > nœud racine

À chaque comparaison lors de la recherche, on exclut la moitié des nœuds — complexité temporelle O(log n). Comme le jeu du nombre à deviner : « Plus grand ou plus petit que 50 ? » → « Plus grand. » « Plus grand ou plus petit que 75 ? » — à chaque fois on élimine la moitié.

### 4.2 Arbres équilibrés : Prévenir la dégénérescence

L'arbre binaire de recherche a un problème : si les données sont insérées dans l'ordre (1, 2, 3, 4, 5), l'arbre dégénère en une chaîne linéaire et la recherche redevient O(n). Les arbres équilibrés évitent ce problème en ajustant automatiquement leur structure :

| Type | Stratégie d'équilibre | Caractéristiques | Application typique |
|------|---------|------|---------|
| **Arbre AVL** | Équilibre strict (différence de hauteur ≤ 1) | Recherche la plus rapide, insertion/suppression un peu plus lentes | Scénarios avec recherches fréquentes |
| **Arbre rouge-noir** | Équilibre approximatif | Bonne performance globale | Java TreeMap, noyau Linux |
| **Arbre B** | Équilibre multi-voies, plusieurs valeurs par nœud | Réduction des E/S disque | Index de bases de données |

::: tip Où trouve-t-on des arbres dans votre code ?
- **Système de fichiers** : L'imbrication des dossiers est une structure arborescente
- **DOM HTML** : `<html>` → `<body>` → `<div>` → `<p>` est un arbre
- **Index de bases de données** : Les arbres B+ permettent la recherche dans des millions d'enregistrements en seulement 3-4 lectures disque
- **JSON/XML** : Les formats de données imbriqués sont par essence des arbres
:::

---

## 5. Structures de graphes : Réseaux de relations complexes

Les arbres ne peuvent représenter que des relations hiérarchiques « un-à-plusieurs ». Mais dans la réalité, beaucoup de relations sont « plusieurs-à-plusieurs » — vos amis ont aussi des amis, entre les villes il y a plusieurs routes. Une structure où **n'importe quels nœuds peuvent être connectés** est un graphe.

<GraphStructureDemo />

### 5.1 Trois formes de graphes

| Type | Caractéristiques | Analogie | Application typique |
|------|------|------|---------|
| **Graphe non orienté** | Arêtes sans direction, A→B = B→A | Amis WeChat (mutuel) | Réseaux sociaux, réseaux de communication |
| **Graphe orienté** | Arêtes avec direction, A→B ≠ B→A | Abonnements Weibo (unilatéral) | Liens web, relations de dépendance |
| **Graphe pondéré** | Arêtes avec poids (distance, coût, etc.) | Routes entre villes (avec kilométrage) | Navigation cartographique, plus court chemin |

### 5.2 Parcours de graphes

Le parcours de graphes est plus complexe que pour les structures linéaires, car il peut y avoir des cycles (A→B→C→A). Il faut marquer les nœuds « déjà visités » :

| Méthode de parcours | Stratégie | Analogie | Scénario d'usage |
|---------|------|------|---------|
| **BFS (en largeur)** | Visiter d'abord tous les voisins, puis les voisins des voisins | Propagation d'ondes | Plus court chemin, parcours par niveau |
| **DFS (en profondeur)** | Suivre un chemin jusqu'au bout, revenir en arrière si bloqué | Labyrinthe | Recherche de chemin, test de connectivité |

::: tip Applications des graphes dans la réalité
- **Navigation cartographique** : Les villes sont des nœuds, les routes des arêtes, la navigation trouve le plus court chemin dans le graphe
- **Réseaux sociaux** : Les utilisateurs sont des nœuds, les abonnements/amis sont des arêtes, les « personnes que vous connaissez peut-être » sont recommandées par des algorithmes de graphes
- **Gestionnaires de paquets** : Les dépendances npm/pip forment un graphe orienté, `npm install` est un tri topologique du graphe
:::

---

## 6. Comparaison de performances : Toutes les structures en un coup d'œil

Maintenant que nous avons appris tant de structures de données, quelle est la différence de performance ? Ce comparateur interactif vous aidera à construire votre intuition :

<DataStructureDemo />

**Tableau de comparaison des performances clés :**

| Structure de données | Accès | Recherche | Insertion | Suppression | Espace |
|---------|------|------|------|------|------|
| **Tableau** | O(1) | O(n) | O(n) | O(n) | O(n) |
| **Liste chaînée** | O(n) | O(n) | O(1) | O(1) | O(n) |
| **Pile/File** | O(n) | O(n) | O(1) | O(1) | O(n) |
| **Table de hachage** | — | O(1) | O(1) | O(1) | O(n) |
| **Arbre binaire de recherche** | — | O(log n) | O(log n) | O(log n) | O(n) |
| **Graphe** | — | O(V+E) | O(1) | O(E) | O(V+E) |

::: tip Comment lire ce tableau ?
- **O(1)** : Temps d'opération constant quelle que soit la taille des données — le plus rapide
- **O(log n)** : Les données doublent, le temps augmente d'une seule étape — très rapide
- **O(n)** : Les données doublent, le temps double aussi — moyen
- **O(V+E)** : Dépend du nombre de nœuds et d'arêtes — représentation spécifique aux graphes

Note : Ce sont toutes des **moyennes**. Dans le pire des cas, la table de hachage peut dégénérer à O(n) et l'arbre binaire de recherche aussi.
:::

---

## 7. Guide de sélection : principe du choix d'une structure de données

Avec toutes ces structures de données, comment choisir face à un besoin réel ? La clé est de **partir du besoin** et de se poser quelques questions :

1. **Quelle est l'opération la plus fréquente ?** Recherche ? Insertion ? Suppression ? Parcours ?
2. **Quelle relation entre les données ?** Un-à-un ? Un-à-plusieurs ? Plusieurs-à-plusieurs ?
3. **Quelle est la taille des données ?** Quelques dizaines et quelques millions peuvent donner des choix optimaux totalement différents
4. **Faut-il un ordre ?** Faut-il traverser les données dans un certain ordre

<DataStructureSelectorDemo />

**Flux de décision rapide :**

| Votre besoin | Structure recommandée | Raison |
|---------|---------|------|
| Accès rapide par position | Tableau | Accès aléatoire O(1) |
| Insertions/suppressions fréquentes au milieu | Liste chaînée | Insertion/suppression O(1), pas de déplacement d'éléments |
| Dernier entré premier sorti (annulation, récursivité) | Pile | Sémantique LIFO naturellement adaptée |
| Premier entré premier sorti (file de tâches) | File | Sémantique FIFO naturellement adaptée |
| Recherche rapide par clé | Table de hachage | Recherche moyenne O(1) |
| Données triées + recherche rapide | Arbre binaire de recherche | Recherche O(log n) tout en restant trié |
| Relations complexes plusieurs-à-plusieurs | Graphe | Peut exprimer des connexions entre nœuds quelconques |

::: tip Règles empiriques en développement réel
- Dans **80 % des scénarios**, les tableaux et les tables de hachage suffisent
- Quand on a besoin d'**ordre**, envisager les arbres
- Quand les **relations sont complexes**, envisager les graphes
- **Incertain ?** Commencer par le plus simple, changer en cas de problème de performance. L'optimisation prématurée est la racine de tous les maux
:::

---

## Résumé

> Les structures de données sont la base organisationnelle des programmes. Le **tableau** est le plus rapide pour l'accès par position ; la **liste chaînée** est la plus flexible pour l'insertion et la suppression ; la **table de hachage** est la plus rapide pour la recherche par clé ; l'**arbre** exprime des relations hiérarchiques tout en gardant les données triées ; le **graphe** exprime des relations en réseau arbitrairement complexes. Il n'y a pas de meilleure structure de données, seulement la plus adaptée — la clé est de comprendre les forces et les coûts de chaque structure et de faire des compromis selon les besoins réels.

---

## Lectures complémentaires

| Thème | Ressource recommandée |
|------|---------|
| Visualisation de structures de données | [VisuAlgo](https://visualgo.net/) — Démonstrations animées de structures de données et algorithmes |
| Algorithmes et structures de données | « Grokking Algorithms » — Aditya Bhargava, illustré et adapté aux débutants |
| Compréhension approfondie | « Structures de données et analyse d'algorithmes » — Mark Allen Weiss |
| Entraînement pratique | [LeetCode](https://leetcode.com/) — Exercices classés par structure de données |

---

## Prochaines étapes

Vous avez maintenant maîtrisé les concepts clés des structures de données. Vous pouvez continuer avec :

- **[Introduction aux algorithmes](./algorithm-thinking.md)** : Apprendre à résoudre des problèmes avec le tri, la recherche, la récursivité et la programmation dynamique
- **[Concepts des langages de programmation : paradigmes, évolution et sélection](./programming-languages.md)** : Comprendre comment différents langages implémentent ces structures de données
