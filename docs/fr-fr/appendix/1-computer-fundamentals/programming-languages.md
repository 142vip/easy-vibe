# Concepts des langages de programmation : paradigmes, évolution et sélection

::: tip Préface
Pourquoi existe-t-il tant de langages de programmation ? Lequel faut-il apprendre ? Ce chapitre vous guide de « l'évolution des langages » aux « paradigmes de programmation » puis à « comment choisir », pour construire une compréhension d'ensemble des langages de programmation. **La conclusion d'abord : il n'y a pas de meilleur langage, seulement le langage le plus adapté au contexte.**
:::

**Que allez-vous apprendre dans cet article ?**

À la fin de ce chapitre, vous aurez acquis :

- **Capacité de choix rationnel** : face à la question « quel langage apprendre », savoir juger selon les besoins du projet plutôt que de suivre aveuglément les tendances
- **Compréhension des paradigmes** : comprendre que « orienté objet » et « programmation fonctionnelle » sont des modes de pensée différents, et pas seulement des différences de syntaxe
- **Perspective historique** : voir plus de 70 ans d'évolution des langages — de l'écriture manuelle de 0 et 1 à la génération de code en langage naturel
- **Fondements pour la suite** : préparer le terrain pour comprendre la conception de nouveaux langages et les décisions de choix technologiques

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Évolution des langages | Du langage machine aux langages de haut niveau |
| **Chapitre 2** | Paradigmes de programmation | Impératif, orienté objet, fonctionnel |
| **Chapitre 3** | Choix du langage | Méthode de sélection basée sur le contexte |

---

## 0. Principe de communication entre l'homme et l'ordinateur

Imaginez que vous devez communiquer avec un robot qui ne comprend que le binaire :

- **Taper directement des 0 et des 1** — la méthode la plus primitive, extrêmement inefficace, un seul 0 mal écrit en 1 et tout est faux (langage machine)
- **Utiliser des mnémoniques** — `MOV AX, 1` est beaucoup plus lisible que `10110000 00000001` (langage assembleur)
- **Des expressions proches du langage naturel** — `int sum = 1 + 2;` est directement compréhensible par l'humain (langage de haut niveau)

**Les langages de programmation sont le pont entre l'homme et l'ordinateur**, et ont évolué pendant plus de 70 ans dans la direction d'une « proximité croissante avec la pensée humaine ».

---

## 1. L'évolution des langages de programmation

👇 Essayez par vous-même : explorez l'histoire de l'évolution des langages de programmation des années 1940 à aujourd'hui

<LanguageMapDemo />

::: tip 💡 En résumé
La tendance de l'évolution des langages de programmation : **de plus en plus proches de la pensée humaine, de plus en plus sûrs, de plus en plus efficaces**. De l'écriture manuelle de 0/1, aux mnémoniques assembleur, à la programmation structurée du C, à l'orienté objet de Java, jusqu'à la sécurité mémoire de Rust — chaque génération a résolu les problèmes de la précédente.
:::

---

## 2. Paradigmes de programmation : la façon de penser les problèmes

Les paradigmes de programmation ne sont pas des caractéristiques de langage, mais des **modes de pensée** — tout comme l'écriture connaît la poésie, le roman, l'essai comme genres différents.

### 2.1 Impératif — « Expliquer à l'ordinateur étape par étape comment faire »

```c
int sum = 0;
for (int i = 0; i < n; i++) {
    sum += arr[i];
}
```

### 2.2 Orienté objet — « Encapsuler données et comportement dans des objets »

```python
class Dog:
    def __init__(self, name):
        self.name = name
    def bark(self):
        print(f"{self.name} says woof!")
```

### 2.3 Fonctionnel — « Combiner des fonctions pures, sans modifier l'état »

```haskell
sum = foldl (+) 0
-- Même entrée produit toujours la même sortie
```

### 2.4 Déclaratif — « Dire uniquement quoi faire, pas comment »

```sql
SELECT name FROM users WHERE active = true
-- La base de données décide elle-même la méthode de recherche la plus rapide
```

::: tip 💡 En pratique
La plupart des langages modernes sont **multi-paradigmes**. Python supporte à la fois l'orienté objet et le fonctionnel ; JavaScript aussi. Ne vous demandez pas « quel paradigme est le meilleur », mais choisissez l'approche la plus adaptée au problème.
:::

---

## 3. Système de types : les règles de circulation des données

| | Typage fort | Typage faible |
|---|---|---|
| **Statique** | Java, Rust, TypeScript — le plus sûr | C, C++ — efficace mais prudence requise |
| **Dynamique** | Python, Ruby — flexible et sûr | JavaScript, PHP — flexible mais sujet aux erreurs |

**Point clé** : que vaut `"1" + 1` ?
- **JavaScript (typage faible)** : `"11"` — conversion automatique silencieuse
- **Python (typage fort)** : `TypeError` — à vous de réfléchir

Pour aller plus loin → [Introduction aux systèmes de types](./type-systems) | [Principes de compilation](./compilers)

---

## 4. Compilé vs Interprété

| | Compilé | Interprété | JIT |
|---|---|---|---|
| **Processus** | Tout traduire d'abord, puis exécuter | Lire et exécuter en même temps | D'abord interpréter, compiler les points chauds |
| **Vitesse** | La plus rapide | Plutôt lente | Intermédiaire |
| **Débogage** | Attendre la compilation | Retour immédiat | Immédiat + optimisation |
| **Représentatifs** | C, Rust, Go | Python, Ruby | Java, JavaScript |

---

## 5. Principe du choix d'un langage de programmation

### Choix par contexte

| Contexte | Langage recommandé | Raison |
|---|---|---|
| **Frontend web** | JavaScript, TypeScript | Le navigateur ne comprend que JS |
| **Backend web** | Go, Java, Python, Node.js | Écosystème mature |
| **Développement mobile** | Swift (iOS), Kotlin (Android) | Recommandation officielle |
| **IA / Données** | Python | PyTorch, Pandas sont en Python |
| **Programmation système** | C, Rust | Contrôle direct du matériel |
| **Cloud natif** | Go, Rust | Docker/K8s sont écrits en Go |

### Recommandation de parcours d'apprentissage

1. **Python** — Syntaxe la plus simple, langue d'entrée pour l'ère de l'IA
2. **JavaScript** — Indispensable pour le développement web, frontend et backend couverts
3. **TypeScript** — Ajouter un système de types à JS, découvrir le typage statique
4. **Go ou Rust** — Comprendre les langages compilés et les concepts de bas niveau

---

## 6. Résumé

::: tip 📚 Points clés
1. **Évolution des langages** : du langage machine aux langages de haut niveau, toujours plus proches de la pensée humaine
2. **Paradigmes de programmation** : impératif, orienté objet, fonctionnel, déclaratif — chacun avec ses cas d'usage
3. **Système de types** : statique/dynamique, fort/faible — impacte sécurité et flexibilité
4. **Mode d'exécution** : compilé le plus rapide, interprété le plus flexible, JIT combine les deux
5. **Pas de solution miracle** : choisir le langage adapté au contexte plutôt que de chercher le « meilleur langage »
:::

**Prochaines étapes** :
- [Principes de compilation](./compilers) - Approfondir le processus de compilation et l'optimisation du code
- [Introduction aux systèmes de types](./type-systems) - Approfondir le système de types et la sécurité des types
- [Introduction aux structures de données](./data-structures) - Comprendre l'organisation des données
- [Introduction aux algorithmes](./algorithm-thinking) - Apprendre les méthodes de résolution de problèmes
