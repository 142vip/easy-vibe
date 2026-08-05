# Introduction au développement full stack : carte des connaissances informatiques à l'ère Vibe Coding

::: tip Préface
**Qu'est-ce que le Vibe Coding ?** En bref, c'est « écrire du code en langage naturel » — vous décrivez ce que vous voulez en français ou en anglais, et l'IA génère le code pour vous. Cela change complètement les règles du jeu du développement logiciel.

Mais il y a une question cruciale : **l'IA peut vous aider à écrire du code, mais elle ne peut pas penser à votre place.** Vous devez toujours savoir « quoi écrire », « pourquoi l'écrire ainsi » et « comment juger si c'est correct ». C'est exactement le cadre de compréhension fondamental que ce chapitre va vous aider à construire.
:::

**Qu'allez-vous apprendre dans cet article**

Après avoir étudié ce chapitre, vous obtiendrez :

- **Vision globale du domaine** : savoir ce que font respectivement le frontend, le backend, l'IA et les autres domaines
- **Capacité de choix technologique** : pouvoir faire des jugements rationnels face à la question « quel langage/framework apprendre »
- **Trajectoire de croissance claire** : comprendre l'évolution des compétences de zéro à 3-5 ans d'expérience
- **Pensée Vibe Coding** : comprendre quelles compétences deviennent plus importantes à l'ère de l'assistance IA

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Panorama du domaine informatique | Frontend, backend, mobile, IA, DevOps |
| **Chapitre 2** | Présentation du frontend | La couche d'interface perceptible par l'utilisateur |
| **Chapitre 3** | Présentation du backend | La logique serveur en coulisses |
| **Chapitre 4** | Concepts des langages de programmation | Les outils pour communiquer avec l'ordinateur |
| **Chapitre 5** | Ingénieur full-stack | Le généraliste qui maîtrise frontend et backend |
| **Chapitre 6** | Ingénieur en algorithmes IA | Faire apprendre à la machine à penser |
| **Chapitre 7** | Trajectoire de croissance | Feuille de route du débutant à l'expert |

---

## 0. Vibe Coding : le nouveau paradigme du développement logiciel

### 0.1 Présentation du Vibe Coding

Imaginez le développement logiciel d'avant :

<VibeCodingFlowDemo />

**Changement fondamental** : de « comment écrire le code » à « comment décrire le besoin ».

### 0.2 Principes des compétences importantes à l'ère du Vibe Coding

<DeveloperSkillShiftDemo />

::: tip 💡 Aperçu clé
L'IA peut vous aider à écrire du code, mais les compétences suivantes ne peuvent pas être remplacées par l'IA :
- **Jugement** : savoir si le code généré par l'IA est correct et bon
- **Pensée architecturale** : savoir comment concevoir le système et diviser les modules
- **Connaissance du domaine** : comprendre la logique métier, savoir « quoi faire »
- **Capacité de débogage** : savoir par où commencer à enquêter quand un problème survient
:::

---

## 1. Panorama du domaine informatique

Avant d'approfondir chaque direction, établissons une compréhension globale.

<ComputerFieldMapDemo />

### 1.1 Comprendre les domaines avec l'analogie du restaurant

Imaginez un système logiciel comme un **restaurant** :

| Domaine | Rôle dans le restaurant | Ce qu'il fait | Livrables |
|-----|---------|--------|--------|
| **Frontend** | Décoration + Menu + Serveur | Tout ce que l'utilisateur peut voir et avec quoi interagir | Pages web, mini-programmes, interfaces d'applications |
| **Backend** | Cuisine + Entrepôt | Traiter la logique métier, stocker les données | API, bases de données, programmes serveur |
| **Mobile** | Comptoir de vente à emporter | Expérience d'application sur téléphone | Applications iOS/Android |
| **IA/Algorithmes** | Département R&D | Rendre le système « intelligent » | Modèles de recommandation, reconnaissance d'images, dialogue intelligent |
| **DevOps** | Maintenance + Sécurité | Assurer le fonctionnement stable du système | Scripts de déploiement, systèmes de surveillance, protection de sécurité |
| **Ingénierie des données** | Finance + Analystes | Collecte, stockage, analyse des données | Pipelines de données, rapports, tableaux de bord |

### 1.2 Aperçu des stacks technologiques par domaine

Ne vous laissez pas effrayer par ces termes, il s'agit simplement de vous les faire « connaître » :

| Domaine | Langages principaux | Frameworks/outils courants | Livrables typiques |
|-----|---------|--------------|---------|
| Frontend | JavaScript, TypeScript | React, Vue, CSS | Pages web, back-offices |
| Backend | Node.js, Go, Java, Python | Express, Gin, Spring | Services API |
| Mobile | Swift, Kotlin, Dart | SwiftUI, Jetpack, Flutter | Applications mobiles |
| IA/Algorithmes | Python | PyTorch, TensorFlow | Modèles, algorithmes |
| DevOps | Shell, Python | Docker, Kubernetes | Solutions de déploiement |

::: tip 💡 Conseil aux débutants
N'essayez pas de tout apprendre d'un coup. Choisissez d'abord une direction pour approfondir, établissez votre « base », puis élargissez horizontalement. Être full-stack ne signifie pas « savoir un peu de tout », mais « avoir une compétence forte principale et être capable d'utiliser les autres directions ».
:::

---

## 2. Présentation du frontend

### 2.1 Définition en une phrase

**Frontend = la partie que l'utilisateur peut directement voir, cliquer et avec laquelle interagir.**

Quand vous ouvrez une page web :
- La mise en page, les couleurs, les polices → Frontend
- Les animations après un clic sur un bouton → Frontend
- La saisie de formulaires, l'affichage de données → Frontend
- L'adaptation de la page à l'écran du téléphone → Frontend

### 2.2 La triade du frontend

<FrontendTriadDemo />

**Analogie : flux de décoration d'une maison**

| Technologie | Rôle dans la décoration | Responsabilité |
|-----|---------|------|
| **HTML** | Structure de la maison | Où sont les murs, les portes, comment les pièces sont divisées |
| **CSS** | Style décoratif | Couleur des murs, disposition des meubles, effets d'éclairage |
| **JavaScript** | Domotique | Allumer/éteindre les lumières, ouverture automatique des rideaux, système de sécurité |

### 2.3 Principes de l'utilisation des frameworks frontend

On peut écrire des pages web avec HTML/CSS/JS natifs, alors pourquoi apprendre des frameworks comme React, Vue.

<FrontendFrameworkDemo />

**Raison principale** : quand la page devient complexe (comme Taobao, la version web de WeChat), manipuler directement les éléments de la page un par un avec du code devient très chaotique. Les frameworks vous aident à « gérer la complexité ».

### 2.4 Une journée d'un ingénieur frontend

```
9h00   Examiner les maquettes, comprendre quelle fonctionnalité développer
10h00  Écrire le code des composants avec React/Vue
12h00  Pause déjeuner
14h00  S'interfacer avec le backend via l'API, déboguer l'affichage des données
16h00  Corriger les bugs, optimiser les performances de la page
18h00  Revue de code, discuter des solutions techniques avec l'équipe
```

---

## 3. Présentation du backend

### 3.1 Définition en une phrase

**Backend = la logique que l'utilisateur ne voit pas, mais qui soutient le fonctionnement de tout le système.**

Quand vous passez une commande en ligne :
- Vérifier votre nom d'utilisateur et mot de passe → Backend
- Vérifier le stock du produit → Backend
- Calculer le prix promotionnel → Backend
- Générer la commande, débiter le compte → Backend
- Notifier l'entrepôt d'expédier → Backend

### 3.2 Responsabilités fondamentales du backend

<BackendCoreDemo />

**Analogie : flux de cuisine d'un restaurant**

| Responsabilité backend | Analogie cuisine | Contenu concret |
|---------|---------|---------|
| **Conception d'API** | Conception du menu | Définir « ce que l'utilisateur peut commander », « comment commander » |
| **Logique métier** | Processus de cuisson | Traiter les commandes, calculer les prix, vérifier les autorisations |
| **Stockage de données** | Gestion de l'entrepôt | Stocker les données dans la base, interroger les données |
| **Optimisation des performances** | Efficacité de la cuisine | Cache, traitement asynchrone, équilibrage de charge |
| **Protection de sécurité** | Sécurité alimentaire | Prévenir l'injection SQL, contrôle d'accès |

### 3.3 Principes du choix d'un langage backend

| Langage | Caractéristiques | Scénarios adaptés |
|-----|------|---------|
| **Node.js** | Accessible aux frontend, full-stack JavaScript | Projets petits/moyens, prototypage rapide |
| **Go** | Haute performance, concurrence forte | Services à haute concurrence, architecture microservices |
| **Java** | Écosystème mature, niveau entreprise | Grands systèmes d'entreprise, banques |
| **Python** | Simple, bon écosystème IA | Traitement de données, services IA |

::: tip 💡 Conseil aux débutants
Si vous connaissez déjà JavaScript (base frontend), Node.js est le choix le plus naturel pour débuter en backend. Un seul langage, vous pouvez écrire à la fois le frontend et le backend.
:::

### 3.4 Une journée d'un ingénieur backend

```
9h00   Consulter le document de spécifications API
10h00  Concevoir la structure des tables de base de données
11h00  Écrire le code des endpoints API
14h00  Déboguer avec le frontend, corriger les problèmes d'interface
16h00  Optimiser les requêtes lentes, traiter les problèmes en production
18h00  Revue de code, rédiger la documentation technique
```

---

## 4. Concepts des langages de programmation

### 4.1 Présentation d'un langage de programmation

**Langage de programmation = le pont entre l'humain et l'ordinateur.**

L'ordinateur ne comprend que les 0 et les 1, l'humain est habitué au langage naturel. Le langage de programmation est la couche intermédiaire :
- L'humain écrit du code dans un langage de programmation (plus compréhensible que les 0/1)
- L'ordinateur traduit le langage de programmation en instructions machine

### 4.2 Classification des langages

<ProgrammingLanguageMapDemo />

**Classification par mode d'exécution** :

| Type | Principe | Langages représentatifs | Caractéristiques |
|-----|------|---------|------|
| **Compilé** | Traduit en code machine d'abord, puis exécuté | C, C++, Go, Rust | Exécution rapide, compilation lente |
| **Interprété** | Traduit et exécuté en même temps | Python, JavaScript, Ruby | Développement rapide, exécution lente |
| **Bytecode** | Solution intermédiaire | Java, Kotlin, C# | Équilibre entre performance et efficacité de développement |

**Classification par système de types** :

| Type | Caractéristiques | Langages représentatifs |
|-----|------|---------|
| **Typage statique** | Type des variables déterminé à l'écriture du code | Java, TypeScript, Go |
| **Typage dynamique** | Type des variables déterminé à l'exécution | Python, JavaScript, Ruby |
| **Typage fort** | Vérification stricte des types, pas de conversion automatique | Python, Java |
| **Typage faible** | Vérification souple des types, conversion automatique | JavaScript, PHP |

### 4.3 Principes du choix du langage à apprendre

<LanguageSelectionDemo />

::: tip 💡 Principes de choix
Il n'y a pas de « meilleur langage », seulement le « langage le plus adapté au scénario ». Conseils pour les débutants :
1. **Apprenez-en un en profondeur d'abord** : établissez la pensée de programmation
2. **Apprenez-en un deuxième, comparez** : comprenez les différences de conception des langages
3. **Apprenez selon les besoins** : choisissez en fonction des exigences du projet
:::

---

## 5. Ingénieur full-stack : maîtriser frontend et backend

### 5.1 Présentation du full-stack

**Ingénieur full-stack = ingénieur capable de réaliser indépendamment le développement frontend + backend.**

<FullstackSkillDemo />

### 5.2 Avantages du full-stack

| Avantage | Description |
|-----|------|
| **Réalisation indépendante de projets** | Du besoin à la mise en ligne, une seule personne |
| **Faible coût de communication** | Pas de va-et-vient entre frontend et backend |
| **Vision technique large** | Comprendre comment tout le système fonctionne |
| **Adapté à l'entrepreneuriat** | Valider rapidement des idées, développement MVP |

### 5.3 Défis du full-stack

| Défi | Description |
|-----|------|
| **Profondeur vs Largeur** | Risque de « savoir un peu de tout, n'être expert en rien » |
| **Évolution technologique rapide** | Les technologies frontend et backend évoluent rapidement |
| **Dispersion de l'énergie** | Besoin de suivre plusieurs domaines simultanément |

### 5.4 Conseils de progression full-stack

```
Phase 1 : Établir sa base
└── Choisir une direction et approfondir (conseillé de commencer par frontend ou backend)
└── Atteindre le niveau de réalisation indépendante de projets

Phase 2 : Expansion horizontale
└── Apprendre les bases de l'autre direction
└── Pouvoir réaliser des projets full-stack simples

Phase 3 : Maîtrise intégrée
└── Comprendre comment frontend et backend collaborent
└── Pouvoir concevoir une architecture technique complète

Phase 4 : Perfectionnement continu
└── Maintenir une profondeur dans un domaine
└── Maintenir un niveau « utilisable » dans les autres domaines
```

---

## 6. Ingénieur en algorithmes IA : faire apprendre à la machine à penser

### 6.1 Ingénieur IA vs Développement traditionnel

<AIvsTraditionalDemo />

| Dimension | Développement traditionnel | Ingénieur en algorithmes IA |
|-----|---------|--------------|
| **Tâche centrale** | Implémenter une logique métier déterministe | Entraîner des modèles, optimiser des algorithmes |
| **Mode de pensée** | « Si A alors exécuter B » | « Faire apprendre à la machine les régularités à partir des données » |
| **Production de code** | Modules fonctionnels, systèmes | Modèles, scripts d'entraînement |
| **Méthode de débogage** | Points d'arrêt, logs | Examiner les métriques, ajuster les hyperparamètres |
| **Critère de succès** | Fonctionnalité correcte, sans bug | Précision, rappel conformes aux objectifs |

### 6.2 Arbre de compétences de l'ingénieur IA

```
Ingénieur IA (2025)
    │
    ├── Compétences fondamentales
    │   ├── Python (langage principal)
    │   ├── Traitement de données (Pandas, NumPy)
    │   └── Intuition mathématique de base (algèbre linéaire, probabilités et statistiques)
    │
    ├── Applications grands modèles (direction la plus en vogue)
    │   ├── Prompt Engineering (ingénierie de prompt)
    │   ├── RAG (génération augmentée par récupération)
    │   ├── AI Agent (agent intelligent, permettre à l'IA d'accomplir des tâches de manière autonome)
    │   ├── Function Calling / MCP (permettre à l'IA d'appeler des outils externes)
    │   └── Fine-tuning et déploiement (LoRA, vLLM)
    │
    ├── IA générative (GenAI)
    │   ├── Génération de texte (GPT, Claude, Gemini)
    │   ├── Génération d'images (Stable Diffusion, Midjourney, FLUX)
    │   ├── Génération de vidéos (Sora, Kling)
    │   └── Multimodal (texte + image + audio)
    │
    └── Machine learning traditionnel (toujours important)
        ├── Apprentissage supervisé (classification, régression)
        ├── Frameworks de deep learning (PyTorch)
        └── Évaluation et optimisation de modèles
```

### 6.3 Une journée d'un ingénieur IA

```
9h00   Consulter les résultats d'entraînement du modèle, analyser les métriques
10h00  Prétraitement des données, nettoyage des données d'entraînement
12h00  Pause déjeuner
14h00  Ajuster la structure du modèle, essayer de nouvelles approches
16h00  Lancer des expériences, comparer les résultats de différentes approches
18h00  Rédiger le rapport d'expérience, discuter des prochaines étapes avec l'équipe
```

### 6.4 L'ingénieur IA à l'ère du Vibe Coding

Impact du développement assisté par IA sur les ingénieurs IA :

| Changement | Description |
|-----|------|
| **Génération de code** | L'IA peut générer des scripts d'entraînement, du code de traitement de données |
| **Lecture d'articles** | L'IA peut vous aider à résumer les points clés des articles |
| **Enregistrement d'expériences** | L'IA peut vous aider à organiser les résultats d'expériences |
| **Ce qui ne change pas** | La compréhension du problème, le jugement des résultats, la maîtrise de la direction |

---

## 7. Trajectoire de croissance : du débutant à l'expert

### 7.1 Feuille de route de croissance sur 3-5 ans

<CareerPathDemo />

### 7.2 Exigences de compétences par phase

| Phase | Durée | Compétences clés | Livrables typiques |
|-----|------|---------|---------|
| **Débutant** | 0-1 an | Maîtriser un langage + outils de base | Pouvoir réaliser des modules fonctionnels simples |
| **Intermédiaire** | 1-2 ans | Familier avec une stack technologique + ingénierie | Pouvoir réaliser indépendamment des projets de taille moyenne |
| **Avancé** | 2-3 ans | Approfondir un domaine + capacité architecturale | Pouvoir concevoir des solutions système |
| **Senior** | 3-5 ans | Profondeur technique + compréhension métier + collaboration d'équipe | Pouvoir diriger des projets de grande envergure |

### 7.3 Stratégie d'apprentissage à l'ère du Vibe Coding

<LearningStrategyDemo />

::: tip 💡 Conseils essentiels
1. **Les fondamentaux sont plus importants que les outils** : les caractéristiques des langages, les structures de données, la pensée algorithmique sont les racines
2. **La pratique est plus importante que la théorie** : faire des projets est la meilleure façon d'apprendre
3. **La réflexion est plus importante que la mémorisation** : comprendre le « pourquoi » a plus de valeur que retenir le « comment »
4. **L'IA est un outil, pas une béquille** : utilisez l'IA pour accélérer l'apprentissage, pas pour remplacer la réflexion
:::

---

## 8. Résumé : les compétences clés à l'ère du Vibe Coding

En récapitulant ce chapitre, nous avons établi une compréhension globale du domaine informatique :

1. **Division des domaines** : frontend, backend, mobile, IA, DevOps, données — chacun avec son focus
2. **Choix technologique** : il n'y a pas de meilleure technologie, seulement celle la plus adaptée au scénario
3. **Trajectoire de croissance** : approfondir d'abord, élargir ensuite, établir sa base puis s'étendre horizontalement
4. **Ère de l'IA** : l'IA peut vous aider à écrire du code, mais ne peut pas penser à votre place

### Les trois niveaux de compétences à l'ère du Vibe Coding

```
┌─────────────────────────────────────────┐
│  Niveau 3 : Jugement (l'IA ne peut pas remplacer)  │
│  - Savoir ce qui est correct             │
│  - Savoir ce qui est bon                 │
│  - Savoir dans quelle direction aller    │
├─────────────────────────────────────────┤
│  Niveau 2 : Pensée architecturale (IA en support)  │
│  - Capacité de conception système        │
│  - Capacité de division modulaire        │
│  - Capacité de choix technologique       │
├─────────────────────────────────────────┤
│  Niveau 1 : Implémentation du code (l'IA excelle)  │
│  - Écriture de la syntaxe               │
│  - Appels API                            │
│  - Implémentation de motifs courants     │
└─────────────────────────────────────────┘
```
