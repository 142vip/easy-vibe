# Principes d'organisation des ordinateurs

::: tip Préface
**Après avoir construit un CPU à partir de transistors, comment l'ordinateur forme-t-il un système complet.** Dans le chapitre précédent, nous sommes partis des transistors pour construire des additionneurs, des registtres, des unités de calcul, et finalement assembler le cœur du CPU. Mais le CPU seul ne suffit pas — il doit collaborer avec la mémoire et les périphériques d'entrée/sortie, les bus relient les composants, et un jeu d'instructions pilote le tout. Dans ce chapitre, nous passons de la perspective interne du CPU à celle du système informatique dans son ensemble, pour approfondir notre compréhension de l'architecture de von Neumann, du jeu d'instructions, de la hiérarchie de stockage, ainsi que des bus et des entrées/sorties.
:::

**Ce que vous allez apprendre dans cet article**

À la fin de ce chapitre, vous aurez acquis :

- **Perspective système** : comprendre comment le CPU, la mémoire et les E/S collaborent — vous n'êtes plus un simple passionné de hardware isolé
- **Terminologie hardware** : maîtriser les concepts clés tels que le cycle d'instruction, le pipeline, le CPI, le taux de succès du cache
- **Pensée performance** : comprendre les goulots d'étranglement et les optimisations dans l'architecture informatique
- **Fondamentaux pour la suite** : bases professionnelles pour les systèmes d'exploitation, l'architecture des calculateurs et le développement embarqué

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Architecture de von Neumann | Programme stocké, cinq composants principaux, chemin de données |
| **Chapitre 2** | Jeu d'instructions | Format d'instruction, modes d'adressage, CISC vs RISC |
| **Chapitre 3** | Unité de contrôle du CPU | Unité de commande, micro-opérations, cycle d'instruction |
| **Chapitre 4** | Hiérarchie de stockage | Cache, mémoire principale, mémoire virtuelle, pagination |
| **Chapitre 5** | Bus et E/S | Arbitrage de bus, DMA, mécanisme d'interruption |

---

## 0. Vue d'ensemble : le système hardware de l'ordinateur

Dans le chapitre précédent « Fondamentaux des circuits numériques : du transistor au CPU », nous avons compris le fonctionnement interne du CPU — de l'extraction, au décodage, à l'exécution, jusqu'à l'écriture. Mais le CPU lui-même n'est qu'une unité d'exécution ; pour que l'ordinateur soit réellement utilisable, il faut la coopération de plusieurs composants périphériques.

<CpuArchitectureDemo />

::: tip Décomposition par couches : le système hardware de l'ordinateur
- **Couche 1 : Cœur du CPU**
  Responsable de l'exécution des instructions, comprenant l'unité de commande (émission des signaux de contrôle) et l'unité de calcul (opérations arithmétiques et logiques)

- **Couche 2 : Banc de registres**
  Stockage ultra-rapide à l'intérieur du CPU, comprenant les registres généralistes et spécialisés (PC, IR, MAR, MDR, etc.)

- **Couche 3 : Mémoire principale**
  Mémoire stockant les programmes et les données, à laquelle le CPU accède via le bus d'adresses et le bus de données

- **Couche 4 : Périphériques d'E/S**
  Périphériques d'entrée/sortie connectés au bus système via des contrôleurs d'E/S

- **Couche 5 : Bus système**
  Canal de données reliant le CPU, la mémoire et les E/S, comprenant le bus d'adresses, le bus de données et le bus de contrôle
:::

---

## 1. Architecture de von Neumann : principe de l'ordinateur moderne

### 1.1 Le concept de programme stocké

En 1945, le mathématicien John von Neumann a proposé le concept révolutionnaire d'architecture à **programme stocké (Stored-program)**. Cette idée a posé les fondations de l'ordinateur moderne.

::: tip Concept clé
**Programme stocké** : le programme lui-même, en tant que type particulier de données, est stocké en mémoire au même titre que les données ordinaires. Le CPU peut lire et exécuter les instructions du programme stockées en mémoire de la même manière qu'il lit et écrit des données.
:::

Cela signifie que :
- **Les premiers ordinateurs** : les programmes étaient implémentés par câblage fixe ; modifier un programme nécessitait de refaire les soudures
- **Architecture de von Neumann** : les programmes sont stockés en mémoire ; pour modifier un programme, il suffit de modifier le contenu de la mémoire

### 1.2 Les cinq composants principaux

L'architecture de von Neumann divise l'ordinateur en cinq composants fondamentaux :

<RegisterDemo />

| Composant | Anglais | Fonction | Principaux éléments |
|------|------|------|---------|
| **Unité arithmétique** | ALU (Arithmetic Logic Unit) | Exécute les opérations arithmétiques et logiques | Additionneur, décaleur, comparateur |
| **Unité de commande** | CU (Control Unit) | Coordonne le travail de tous les composants | Registre d'instruction, décodeur, générateur de séquence |
| **Mémoire** | Memory | Stocke les programmes et les données | Registre d'adresse mémoire (MAR), registre de données mémoire (MDR) |
| **Entrée** | Input | Saisie d'informations | Clavier, souris, scanner |
| **Sortie** | Output | Affichage des informations | Écran, imprimante |

### 1.3 Chemin de données

Le **chemin de données (Data Path)** est la route suivie par les données entre les différentes unités fonctionnelles. À l'intérieur du CPU, le chemin de données relie :

- Le banc de registres
- L'unité arithmétique et logique (ALU)
- Le registre de données mémoire (MDR)

La largeur du chemin de données (combien de bits peuvent être transférés à la fois) influence directement les performances de l'ordinateur.

### 1.4 Le goulot d'étranglement de von Neumann

L'architecture de von Neumann présente un célèbre **goulot d'étranglement de performance** :

> La vitesse de transfert des données entre le CPU et la mémoire est bien inférieure à la vitesse de traitement du CPU.

Le CPU se retrouve donc souvent en état d'attente. De nombreuses techniques d'optimisation des ordinateurs modernes sont conçues pour résoudre ce problème :

| Technique d'optimisation | Principe |
|---------|------|
| **Cache** | Placer un petit stockage rapide à proximité du CPU |
| **Pipeline d'instructions** | Placer plusieurs instructions simultanément à différents stades |
| **Superscalaire** | Émettre plusieurs instructions par cycle d'horloge |
| **Multi-cœur parallèle** | Plusieurs cœurs de CPU se partagent les tâches de calcul |

---

## 2. Jeu d'instructions : l'interface entre le CPU et le logiciel

Dans la section précédente, nous avons découvert le concept clé de l'architecture de von Neumann : **les programmes et les données sont stockés de la même manière en mémoire**. Mais cela soulève une question essentielle — à quoi ressemble le programme stocké en mémoire. Comment le CPU le comprend-il.

La réponse est le **jeu d'instructions (Instruction Set Architecture, ISA)**. Si l'on compare le CPU à un service, le jeu d'instructions est sa **documentation API** — il définit toutes les commandes que le CPU peut comprendre, le format de chaque commande et la portée des données sur lesquelles les commandes peuvent opérer. Chaque ligne de code que vous écrivez est finalement traduite par le compilateur en une séquence d'appels de cette API.

### 2.1 Du code à l'instruction : flux de traduction d'une ligne de code

Tout d'abord, établissons une vue d'ensemble : le code que vous écrivez dans votre éditeur et ce que le CPU exécute réellement sont séparés par plusieurs couches de traduction.

<CodeToInstructionDemo />

Cette chaîne de traduction est la clé pour comprendre le jeu d'instructions :

| Couche | Contenu | Qui peut comprendre |
|------|------|---------|
| Langage de haut niveau | `int a = 10 + 5;` | Les humains |
| Langage assembleur | `MOV R1, #10` / `ADD R3, R1, R2` | Les humains (avec formation) |
| Code machine | `0001 0001 0000 1010` | Le CPU |

::: tip Principes de compréhension de cette chaîne
- En voyant une erreur de compilation, vous savez que l'erreur s'est produite à l'étape langage de haut niveau → assembleur
- En voyant un crash à l'exécution, vous savez que le problème survient au stade d'exécution des instructions par le CPU
- Pour l'optimisation des performances, vous comprenez quelles optimisations le compilateur effectue lors de la traduction
- Lors du choix d'une architecture CPU (x86 vs ARM), vous savez que la différence réside dans l'API du jeu d'instructions
:::

### 2.2 Présentation du format d'une instruction

Maintenant que nous savons que le code est traduit en instructions, la question suivante est : **quelle est la structure interne d'une instruction.**

Chaque instruction machine est essentiellement une séquence de bits, mais avec un format interne strict. Les deux parties les plus importantes :

- **Code opération (Opcode)** : indique au CPU quoi faire — addition. Saut. Lecture mémoire.
- **Opérandes** : indiquent au CPU avec quoi — quel registre. Quelle adresse mémoire. Quelle constante.

Comme une phrase a une structure verbe + objet, une instruction a une structure opération + cible :

```
Instruction :  ADD  R3, R1, R2
               ───  ──────────
               Opcode  Opérandes
               (addition) (R3 = R1 + R2)
```

Selon le nombre d'opérandes, les formats d'instructions se divisent en quatre types :

<InstructionFormatDemo />

| Format | Structure | Exemple | Cas d'utilisation |
|------|------|------|---------|
| Zéro adresse | Opcode uniquement | `RET` (retour) | Machine à pile, opérandes implicites au sommet |
| Une adresse | Opcode + 1 adresse | `INC R1` (R1 + 1) | Opérations à un opérande |
| Deux adresses | Opcode + 2 adresses | `MOV R1, R2` | Le plus courant, transfert et opérations |
| Trois adresses | Opcode + 3 adresses | `ADD R3, R1, R2` | Ne détruit pas les opérandes sources |

::: tip Principes de la multiplicité des formats
C'est un **compromis entre espace et flexibilité**. Les instructions à zéro adresse sont les plus courtes (économie de mémoire) mais nécessitent des opérations de pile supplémentaires ; les instructions à trois adresses sont les plus flexibles (les données sources sont préservées) mais occupent plus de bits. Différentes architectures CPU choisissent différentes combinaisons de formats d'instructions.
:::

### 2.3 Principes de localisation des données — Modes d'adressage

L'instruction dit au CPU fais une addition, mais où sont les deux nombres à additionner. Ils peuvent être écrits directement dans l'instruction, se trouver dans un registre, ou à une adresse mémoire. Les **modes d'adressage** sont les règles qui indiquent au CPU où trouver les opérandes.

Analogie quotidienne : flux de localisation d'une personne

| Mode d'adressage | Analogie | Exemple d'instruction | Explication |
|---------|------|---------|------|
| **Adressage immédiat** | La personne est devant vous | `MOV R1, #100` | Donnée directement dans l'instruction, le plus rapide |
| **Adressage par registre** | Appeler un collègue au poste interne | `MOV R1, R2` | Donnée dans un registre interne du CPU, très rapide |
| **Adressage direct** | Connaître le numéro de porte et s'y rendre | `MOV R1, [0x1000]` | Adresse mémoire dans l'instruction |
| **Adressage indirect** | Demander à l'accueil Dans quelle chambre est Dupont. | `MOV R1, [R2]` | Le registre contient une adresse, recherche supplémentaire nécessaire |
| **Adressage indexé** | Bâtiment 3 + 5ème étage pour trouver la chambre | `MOV R1, [R2+10]` | Adresse de base + décalage, pour l'accès aux tableaux |

<AddressingModeDemo />

::: tip Principes de la multiplicité des modes d'adressage
Différents scénarios nécessitent différentes stratégies de recherche de données :
- **Affectation de constante** (`x = 100`) → adressage immédiat, la donnée est dans l'instruction
- **Opération sur variable** (`a + b`) → adressage par registre, la donnée est déjà chargée dans un registre
- **Accès à un tableau** (`arr[i]`) → adressage indexé, adresse de base + décalage d'index
- **Opération sur pointeur** (`*ptr`) → adressage indirect, le registre contient une adresse

Quand vous écrivez `arr[i]`, vous ne pensez pas aux modes d'adressage, mais le compilateur choisit automatiquement le mode le plus approprié.
:::

### 2.4 La liste des capacités du CPU — Classification des instructions

Maintenant que nous connaissons les formats d'instructions et les modes d'adressage, la dernière question : **que peut faire réellement le CPU.**

Toutes les instructions peuvent être classées en six grandes catégories, couvrant tout ce qu'un ordinateur peut faire :

| Type | Ce qu'il fait | Instructions représentatives | Correspond à votre code |
|------|-------|---------|-------------|
| **Transfert de données** | Déplacer des données | MOV, LOAD, STORE | `let x = y`, passage de paramètres |
| **Opérations arithmétiques** | Calculs de base | ADD, SUB, MUL, DIV | `a + b`, `count++` |
| **Opérations logiques** | Manipulation de bits | AND, OR, NOT, XOR | `flags & 0xFF`, vérification de permissions |
| **Opérations de décalage** | Décalage gauche/droite | SHL, SHR | `x << 2` (équivalent à multiplier par 4) |
| **Transfert de contrôle** | Saut et appel | JMP, CALL, RET | `if`, `for`, appel de fonction |
| **Entrée/Sortie** | Communication avec les périphériques | IN, OUT | Lire le clavier, écrire à l'écran |

::: tip Une observation clé
Tout le code que vous écrivez — aussi complexe soit la logique métier, aussi spectaculaire soit l'animation UI — sera finalement décomposé en combinaisons de ces six opérations de base. L'intelligence du CPU ne réside pas dans sa capacité à faire des choses complexes, mais dans sa capacité à exécuter ces opérations simples à une vitesse de plusieurs milliards par seconde.
:::

### 2.5 Deux philosophies de conception : CISC vs RISC

La conception du jeu d'instructions comporte une divergence fondamentale : **rendre chaque instruction aussi puissante que possible, ou aussi simple que possible.**

Cette divergence a créé deux camps, affectant directement chaque appareil que vous utilisez aujourd'hui :

<CISCvsRISCDemo />

Une analogie pour comprendre :
- **CISC comme un couteau suisse** : un couteau intégrant ciseaux, ouvre-bouteille, tournevis... beaucoup de fonctions, mais aucune n'est forcément optimale
- **RISC comme une boîte à outils professionnelle** : chaque outil ne fait qu'une chose, mais la fait vite et bien

::: tip Principes du choix entre smartphone et PC
- **x86 (CISC)** domine le marché des PC et serveurs depuis 40 ans, accumulant un vaste écosystème logiciel. Changer d'architecture signifie recompiler tous les logiciels
- **ARM (RISC)** domine les appareils mobiles grâce à sa faible consommation. Les batteries de téléphones sont petites, chaque milliwatt compte
- **Apple Silicon** a prouvé que RISC peut aussi offrir de hautes performances — la série M dépasse simultanément les concurrents x86 en performance et en consommation
- **RISC-V** est une architecture RISC open source en croissance rapide dans les domaines de l'IoT, de l'éducation et des puces IA
:::

---

> **Résumé** : Le jeu d'instructions est le pont entre le logiciel et le hardware. Votre code est traduit en instructions par le compilateur ; les instructions indiquent au CPU via l'opcode et les opérandes quoi faire et avec quoi ; le mode d'adressage détermine d'où proviennent les données. Différentes conceptions de jeux d'instructions (CISC/RISC) déterminent les caractéristiques de performance et les scénarios d'utilisation du CPU.
>
> Nous connaissons maintenant la structure statique des instructions — leur apparence et leurs types. La question suivante est : **comment le CPU exécute-t-il ces instructions étape par étape en interne.** C'est le rôle de l'unité de commande.

---

## 3. Unité de commande : principe de contrôle du CPU

### 3.1 Composition de l'unité de commande

L'unité de commande est le cerveau du CPU, chargée de coordonner tous les composants selon les exigences des instructions :

<ControllerDemo />

| Composant | Fonction |
|------|------|
| **Compteur ordinal (PC)** | Stocke l'adresse de la prochaine instruction |
| **Registre d'instruction (IR)** | Stocke l'instruction en cours d'exécution |
| **Décodeur d'instructions** | Analyse l'opcode et les opérandes de l'instruction |
| **Générateur de séquence** | Produit les signaux de tempo pour contrôler le timing |
| **Générateur de séquence de micro-opérations** | Produit la série de signaux de contrôle nécessaires à l'exécution de l'instruction |

<PSWFlagDemo />

### 3.2 Cycle d'instruction

Pour exécuter une instruction, le CPU traverse un **cycle d'instruction** complet, comprenant généralement :

1. **Cycle d'extraction (Fetch)** : Lecture de l'instruction depuis la mémoire vers l'IR
2. **Cycle de décodage (Decode)** : Analyse du sens de l'instruction
3. **Cycle d'exécution (Execute)** : Exécution de l'opération
4. **Cycle d'accès mémoire (Memory Access)** : Accès à la mémoire si nécessaire
5. **Cycle d'écriture (Write Back)** : Écriture du résultat dans un registre ou la mémoire

### 3.3 Micro-opérations

Les **micro-opérations** sont les opérations les plus élémentaires pilotées par des signaux de contrôle. Par exemple, la phase d'extraction peut être décomposée en micro-opérations suivantes :

| Tempo | Micro-opération | Signaux de contrôle |
|------|--------|---------|
| T1 | PC → MAR | PCout, MARin |
| T2 | MEM → MDR | MEMout, MDRin |
| T3 | MDR → IR | MDRout, IRin |
| T4 | PC + 1 → PC | PC+1, PCin |

### 3.4 Unité de commande câblée vs microprogrammée

| Caractéristique | Unité câblée | Unité microprogrammée |
|------|------------|-------------|
| **Implémentation** | Circuit logique combinatoire | Séquence de micro-instructions (firmware) |
| **Vitesse** | Rapide | Légèrement plus lent |
| **Complexité de conception** | Complexe | Plus simple |
| **Flexibilité** | Faible (modification = reconception) | Élevée (modification du microprogramme) |
| **Application typique** | Processeurs RISC | Premiers processeurs CISC |

---

## 4. Hiérarchie de stockage : principes de la nécessité du cache

### 4.1 Structure de la hiérarchie de stockage

Les dispositifs de stockage de l'ordinateur forment une structure pyramidale :

<StorageHierarchyDemo />

| Niveau | Type de stockage | Temps d'accès | Capacité typique | Position |
|------|---------|---------|---------|------|
| **Registres** | SRAM | < 1 ns | Quelques Ko | À l'intérieur du CPU |
| **Cache L1** | SRAM | ~ 1 ns | 32-64 Ko | Près du cœur du CPU |
| **Cache L2** | SRAM | ~ 3-10 ns | 256 Ko - 1 Mo | Dans la puce CPU |
| **Cache L3** | SRAM | ~ 10-20 ns | 2-16 Mo | Dans la puce CPU / partagé |
| **Mémoire principale (RAM)** | DRAM | ~ 50-100 ns | 8-64 Go | Sur la carte mère |
| **SSD** | Flash | ~ 10-100 μs | 256 Go - 2 To | Sur la carte mère |
| **HDD** | Disque magnétique | ~ 5-10 ms | 1-10 To | Dans le boîtier |

::: tip Analogie des différences de vitesse
Si l'accès du CPU au cache L1 correspond à **prendre une feuille de papier sur son bureau** :
- Accès à la mémoire → prendre l'ascenseur pour aller acheter du papier au magasin en bas
- Accès au SSD → conduire dans une autre ville pour acheter du papier
- Accès au HDD → prendre l'avion pour un autre pays pour acheter du papier

Les différences de vitesse peuvent atteindre **plusieurs millions de fois**.
:::

### 4.2 Principe du cache

Le **Cache** est un stockage rapide entre le CPU et la mémoire principale. Son principe fondamental repose sur deux principes de localité :

::: tip Principes de localité
- **Localité temporelle** : si une donnée vient d'être accédée, elle sera probablement accédée à nouveau bientôt
- **Localité spatiale** : si une donnée est accédée, les données voisines le seront probablement aussi bientôt
:::

#### Fonctionnement du cache

1. **Succès (Hit)** : les données demandées par le CPU sont dans le cache — lecture directe
2. **Échec (Miss)** : les données ne sont pas dans le cache — chargement depuis la mémoire

```
Taux de succès = Nombre de succès / Total des accès
Temps d'accès moyen = Taux de succès × Temps cache + (1 - Taux de succès) × Temps mémoire
```

<CacheDemo />

### 4.3 Méthodes de mappage du cache

| Méthode | Principe | Avantage | Inconvénient |
|------|------|------|------|
| **Mappage direct** | Chaque bloc mémoire ne peut aller qu'à une position fixe | Simple et rapide | Taux de conflit élevé |
| **Associatif par ensemble** | Chaque bloc peut aller dans N positions (N voies) | Équilibre vitesse/taux de succès | Implémentation plus complexe |
| **Pleinement associatif** | Position quelconque | Taux de conflit le plus bas | Difficile à implémenter (comparaison de tous les tags) |

### 4.4 Mémoire virtuelle

La **mémoire virtuelle** est une abstraction importante fournie par le système d'exploitation :

- Chaque processus croit disposer d'un espace d'adressage virtuel complet
- Le système d'exploitation traduit les adresses virtuelles en adresses physiques
- Les pages peu utilisées peuvent être échangées vers le disque (espace de swap)

::: tip Analogie de la mémoire virtuelle
Imaginez la mémoire virtuelle comme la **gestion des chambres d'hôtel** :
- Vous (le processus) croyez que tout l'immeuble est à vous
- En réalité, l'hôtel (l'OS) ne vous alloue que les chambres actuellement nécessaires
- Les chambres inoccupées sont échangées vers l'entrepôt (disque)
- Les chambres nécessaires peuvent être rapatriées à tout moment
:::

---

## 5. Bus et E/S : les canaux de communication de l'ordinateur

### 5.1 Bus système

Le **Bus** est le canal de données reliant les composants de l'ordinateur :

<BusSystemDemo />

| Type de bus | Fonction | Direction | Largeur typique |
|---------|------|------|---------|
| **Bus d'adresses** | Transmet les adresses mémoire | Unidirectionnel (CPU → mémoire) | 32 bits / 64 bits |
| **Bus de données** | Transmet les données | Bidirectionnel | 32 bits / 64 bits |
| **Bus de contrôle** | Transmet les signaux de contrôle | Bidirectionnel | Plusieurs lignes de signal |

### 5.2 Arbitrage de bus

Quand plusieurs appareils demandent simultanément l'utilisation du bus, un mécanisme d'arbitrage décide qui l'utilisera en premier :

| Méthode d'arbitrage | Description |
|---------|------|
| **Arbitrage centralisé** | Un arbitre central prend la décision |
| **Arbitrage distribué** | Les appareils négocient entre eux |

### 5.3 Méthodes d'accès aux périphériques E/S

| Méthode | Principe | Avantage | Inconvénient |
|------|------|------|------|
| **Scrutation programmée (Polling)** | Le CPU vérifie cycliquement l'état des E/S | Simple | Faible utilisation du CPU |
| **Interruption** | Les E/S notifient le CPU après achèvement | Le CPU peut travailler en parallèle | Surcoût du traitement des interruptions |
| **DMA** | Le périphérique E/S accède directement à la mémoire | Le CPU n'est pas impliqué | Nécessite un contrôleur DMA |

<IOMethodDemo />

### 5.4 Principe du DMA

Le **DMA (Direct Memory Access)** permet aux périphériques E/S d'échanger directement des données avec la mémoire :

<NetworkOverviewDemo />

- **Sans DMA** : Le CPU participe à tout le transfert de données et ne peut rien faire d'autre
- **Avec DMA** : Le CPU indique au contrôleur DMA d'où à où, combien transférer, puis va exécuter d'autres tâches ; le DMA notifie le CPU une fois terminé

::: tip Analogie du DMA
C'est comme **commander en livraison** :
- **Sans DMA** : Vous allez vous-même au supermarché, faites les courses, rentrez, lavez et cuisinez (participation totale)
- **Avec DMA** : Vous commandez par téléphone et le livreur dépose tout directement dans la cuisine (quelqu'un d'autre s'en charge, vous n'avez qu'à réceptionner)
:::

### 5.5 Mécanisme d'interruption

Les **interruptions** sont un mécanisme très important dans le système informatique :

1. Le périphérique E/S envoie une **requête d'interruption** au CPU après achèvement
2. Le CPU termine l'instruction en cours, puis répond à l'interruption
3. Le CPU sauvegarde son état et branche vers le programme de traitement d'interruption
4. Après traitement, l'état est restauré et l'exécution reprend

---

## 6. Optimisation des performances du CPU : technique de pipeline

### 6.1 Pipeline d'instructions

Le **pipeline d'instructions** est une technique de parallélisme maximisant l'efficacité du CPU :

<PipelineDemo />

#### Principe de fonctionnement du pipeline

```
Exécution séquentielle (5 instructions, 15 cycles) :
Instruction1 : IF→ID→EX→MEM→WB
Instruction2 :            IF→ID→EX→MEM→WB
Instruction3 :                         IF→ID→EX→MEM→WB
...

Exécution en pipeline (5 instructions, 9 cycles) :
Instruction1 : IF→ID→EX→MEM→WB
Instruction2 :    IF→ID→EX→MEM→WB
Instruction3 :       IF→ID→EX→MEM→WB
...
```

Idéalement, pour N instructions, le CPI (cycles par instruction) ≈ 1

### 6.2 Aléas du pipeline

Le pipeline peut améliorer les performances mais introduit aussi des problèmes d'**aléas (Hazards)** :

| Type | Cause | Solution |
|------|------|---------|
| **Aléa structurel** | Conflit de ressources hardware | Ajouter du hardware / décaler l'exécution |
| **Aléa de données** | Instruction ultérieure nécessite le résultat d'une précédente | Transmission de données / bulles / ordonnancement |
| **Aléa de contrôle** | Instruction de branchement modifie le flux d'exécution | Slot de délai / prédiction de branchement |

---

## 7. Résumé : flux de fonctionnement de l'ordinateur

Relions l'ensemble du processus avec la terminologie professionnelle :

> **Après le lancement du programme, le système d'exploitation charge le fichier exécutable depuis le disque vers la mémoire. L'unité d'extraction du CPU (IF) lit l'instruction depuis la mémoire via le bus d'adresses et la place dans le registre d'instruction (IR). L'unité de commande décode l'instruction (ID), identifie le type d'opération et génère les signaux de contrôle appropriés. L'unité d'exécution (EX) effectue l'opération arithmétique ou logique ; si un accès mémoire est nécessaire, elle accède à la mémoire via le bus de données (MEM) ; enfin, le résultat est écrit (WB) dans un registre ou la mémoire. L'ensemble du processus est cadencé par l'horloge, et la séquence de micro-opérations générée par l'unité de commande coordonne le travail ordonné de tous les composants.**

---

## Pour aller plus loin

| Thème | Contenu recommandé |
|------|-----------------|
| Architecture des calculateurs | « Computer Organization and Design: The Hardware/Software Interface » - Patterson & Hennessy |
| Microarchitecture CPU | « Computer Systems: A Programmer's Perspective » - Bryant & O'Hallaron |
| Architecture de jeu d'instructions | Manuel de référence ARMv8, Manuel Intel x64 |
| Principes du cache | Protocole de cohérence de cache (MESI), Politiques d'écriture du cache |
| Systèmes d'exploitation | Chapitre suivant « Principes des systèmes d'exploitation : processus, mémoire et systèmes de fichiers » |

---

## Prochaines étapes

Vous avez maintenant maîtrisé les connaissances professionnelles de l'architecture des ordinateurs. Vous pouvez continuer à apprendre :

- **[Principes des systèmes d'exploitation : processus, mémoire et systèmes de fichiers](./operating-systems.md)** : comprendre comment les programmes s'exécutent sur le système d'exploitation, comment les processus, les threads et la gestion mémoire sont implémentés
- **[Principes de représentation des données : codage, stockage et transmission](./data-encoding-storage.md)** : approfondir la compréhension de la représentation des données dans l'ordinateur
