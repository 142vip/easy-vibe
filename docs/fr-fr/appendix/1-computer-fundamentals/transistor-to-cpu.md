# Fondamentaux des circuits numériques : du transistor au CPU

::: tip Préface
**Comment un ordinateur pense-t-il.** Vous savez peut-être que le CPU est le cerveau de l'ordinateur, mais comment ce cerveau fonctionne-t-il réellement. Comment un assemblage de métal et de plastique devient-il un appareil intelligent capable d'exécuter des programmes et de traiter des données. Ce chapitre vous guide depuis le transistor, le composant le plus fondamental, pour comprendre pas à pas les principes de construction d'un CPU.
:::

**Ce que vous allez apprendre dans cet article**

Après avoir étudié ce chapitre, vous aurez acquis :

- **La compréhension de la terminologie** : entendre des termes comme fréquence du CPU, multicœur, jeu d'instructions ne vous laissera plus perplexe, vous en comprendrez les principes physiques sous-jacents
- **La perspective d'exécution du code** : voir comment une ligne de code passe par les étapes de recherche, décodage, exécution et écriture pour finalement devenir des pixels à l'écran
- **La pensée en couches d'abstraction** : comprendre comment chaque couche fournit des services à la couche supérieure tout en masquant la complexité de la couche inférieure
- **Les bases pour la suite** : poser les fondations pour l'architecture des ordinateurs, le développement embarqué et l'optimisation des performances

| Chapitre | Contenu | Concept clé |
|-----|------|---------|
| **Chapitre 1** | Transistor | L'interrupteur du monde numérique |
| **Chapitre 2** | Portes logiques | La réalisation physique de l'algèbre booléenne |
| **Chapitre 3** | Unités fonctionnelles | Additionneur, registre, multiplexeur |
| **Chapitre 4** | Cœur du CPU | Recherche, décodage, exécution, écriture |

---

## 0. Vue d'ensemble : du sable à l'intelligence

En explorant les couches basses de l'ordinateur, on se heurte souvent à une question fondamentale : **d'où vient réellement la capacité de penser d'un ordinateur moderne.**

Si l'on retire la coque brillante de l'ordinateur, on ne voit généralement qu'un amas de métal, de plastique et de plaquettes de silicium. Ces matériaux n'ont pas de vie, ne comprennent pas les mathématiques, et encore moins ce qu'est l'intelligence. Mais lorsqu'un courant électrique les traverse, tout se met en marche. En fin de compte, tout repose sur une abstraction physique d'une simplicité extrême : **l'interrupteur**.

Imaginez un interrupteur commandant une ampoule. Appuyez, la lumière s'allume, représentant 1 ; relâchez, la lumière s'éteint, représentant 0. Que se passerait-il si nous disposions de plusieurs dizaines de milliards de tels interrupteurs, et que nous puissions faire en sorte que **la sortie d'un interrupteur contrôle un autre interrupteur**, créant ainsi des réseaux logiques d'une complexité inouïe.

La réponse est une plateforme de calcul universelle capable d'exécuter n'importe quelle logique. La clé pour comprendre un système informatique réside dans l'abstraction. Comme un jeu de construction, nous contrôlons la complexité des couches basses en les encapsulant couche par couche. Voici les quatre niveaux fondamentaux qui mènent du sable à l'intelligence :

::: tip Déconstruction couche par couche : du sable à l'intelligence
- **Niveau 1 : Transistors (plusieurs dizaines de milliards)**
  C'est l'interrupteur le plus fondamental. Les CPU modernes utilisent principalement des MOSFET (transistors à effet de champ métal-oxyde-semiconducteur). Appliquez une tension sur la grille, et le chemin entre la source et le drain devient conducteur. C'est le point de départ physique du contrôle électrique par l'électricité, qui répond à la question centrale : comment contrôler un signal électrique avec un autre signal électrique.

- **Niveau 2 : Portes logiques (plusieurs milliards)**
  Lorsque nous connectons des transistors en série ou en parallèle selon des schémas spécifiques, une transformation fascinante se produit — les circuits deviennent des mathématiques. Par exemple, une porte AND (ET) exige que ses deux entrées soient à 1 pour que la sortie soit 1 ; cela constitue la correspondance entre l'algèbre booléenne et les circuits physiques, répondant à la question centrale : comment convertir la conduction/coupure physique en opérations logiques basées sur 0 et 1.

- **Niveau 3 : Unités fonctionnelles (quelques centaines)**
  En assemblant les portes logiques de base, on peut construire des modules de calcul à usage spécifique. Les additionneurs traitent les opérations arithmétiques, les multiplexeurs contrôlent le flux des données, et les registres confèrent aux circuits une capacité de mémoire. La question centrale est : comment construire une machine capable d'effectuer des additions et de mémoriser des états.

- **Niveau 4 : Cœur du CPU (1 à 128 cœurs)**
  C'est le centre de commande de toute la microarchitecture. Lorsque vous écrivez une ligne de code, les différents composants internes du CPU travaillent de concert à une fréquence de plusieurs milliards d'opérations par seconde, exécutant le cycle complet de recherche, décodage, exécution et écriture. La question centrale est : comment faire collaborer tous les modules pour exécuter automatiquement une séquence de programme donnée.
:::

---

## 1. Le transistor : l'interrupteur du monde numérique

Commençons par le monde microscopique. Le composant ci-dessous illustre le principe de base du transistor, vous pouvez essayer de le manipuler pour observer comment le courant circule :

<TransistorDemo />

### 1.1 Présentation d'un transistor

::: tip Introduction du concept
En ingénierie, le **transistor** est un dispositif à semiconducteur qui a changé l'histoire de l'humanité. Dans le contexte des circuits numériques, on peut tout simplement le considérer comme un interrupteur parfait.

Pourquoi avons-nous besoin de transistors. Pensez à un robinet dans la vie courante. Vous tournez la poignée, et l'eau jaillit. **Le transistor est en réalité un robinet à l'échelle nanométrique** :
- **La source (Source)** et le **drain (Drain)** sont comme les deux extrémités d'un tuyau d'eau.
- **La grille (Gate)** est la vanne qui contrôle le débit d'eau.

La différence cruciale est qu'au lieu de tourner un interrupteur à la main, on utilise un **signal de tension**. Lorsqu'un interrupteur peut être contrôlé par le signal électrique produit par un autre interrupteur, on franchit l'immense fossé qui sépare l'intervention humaine du calcul automatique.
:::

### 1.2 Principes de représentation 0 et 1 par un transistor

Vous pourriez vous demander : ce que l'ordinateur ne connaît que 0 et 1, à quoi cela ressemble-t-il dans le monde physique. Des minuscules 0 et 1 circulent-ils vraiment à l'intérieur d'une puce.

Bien sûr que non. Tout repose sur des **conventions d'abstraction** créées par l'homme. Nous devons abandonner notre attachement aux signaux analogiques continus et définir deux seuils extrêmes :

- Nous définissons arbitrairement une **tension haute (par exemple 3,3 V ou 1,0 V)** comme le **1** logique (Vrai).
- Nous définissons une **tension basse (proche de 0 V)** comme le **0** logique (Faux).

C'est ce qu'on appelle la capacité d'abstraction numérique : nous découpons le monde analogique plein de bruit en de nets et précis 0 et 1. Une tension haute appliquée à la grille rend le transistor passant, comme un interrupteur fermé ; une tension basse le rend bloqué, comme un interrupteur ouvert.

### 1.3 L'évolution du nombre de transistors

Un seul transistor ne fait que contrôler un passage de courant, ce qui semble dérisoire. Mais que se passe-t-il si l'on combine plusieurs dizaines de milliards de tels interrupteurs. Observez le tableau ci-dessous qui illustre la loi de Moore et l'évolution des puces modernes.

| Époque | Puce processeur       | Nombre de transistors | Nœud de gravure | Signification historique |
| -------- | ---------------- | ---------- | -------- | ---------------------- |
| 1971     | Intel 4004       | 2 300      | 10 µm   | Les débuts du microprocesseur |
| 1993     | Intel Pentium    | 3,1 millions      | 800 nm  | La démocratisation de l'ordinateur personnel |
| 2006     | Intel Core 2 Duo | 291 millions     | 65 nm   | L'architecture multicœur devient dominante |
| 2020     | Apple M1         | 16 milliards      | 5 nm    | La révolution des architectures mobiles |
| 2023     | Apple M3 Max     | 92 milliards      | 3 nm    | Aux limites physiques de l'atome |

> **Réflexion approfondie : que signifie 3 nm.**
> Quand on entend parler de 5 nm ou 3 nm dans les actualités, il faut imaginer à quel point c'est minuscule. Un atome de silicium a un diamètre d'environ 0,2 nanomètre. Avec un procédé de 3 nm, la structure la plus critique du transistor n'a que quelques dizaines d'atomes de large. Cela signifie que nous construisons la plus vaste forteresse de calcul de l'humanité à l'échelle même où les lois de la mécanique quantique commencent à entrer en jeu.

---

## 2. Les portes logiques : faire des calculs avec des interrupteurs

### 2.1 Du transistor aux portes logiques

Comme nous l'avons dit, un transistor isolé ne fait que contrôler simplement le courant. Mais lorsque vous disposez plusieurs transistors selon des structures particulières, la physique devient de la logique mathématique. Dans cette nouvelle dimension, on ne parle plus de tensions et de courants fastidieux, mais directement de vrai (1) et de faux (0) logiques.

Utilisez la démonstration de portes logiques ci-dessous pour visualiser intuitivement l'effet de la combinaison d'interrupteurs :

<LogicGateDemo />

### 2.2 Présentation des portes logiques de base

Dans notre architecture informatique, il existe quelques portes logiques fondamentales — tous les supercalculateurs sont construits à partir de ces briques élémentaires :

- **Porte AND (ET)** :
  - **Règle** : la sortie est 1 uniquement si toutes les entrées sont à 1.
  - **Compréhension intuitive** : deux transistors en **série**. Pour que le courant passe, les deux verrous doivent être ouverts simultanément. Comme pour ouvrir le coffre d'une banque : il faut que le directeur ET le superviseur insèrent chacun leur clé.

- **Porte OR (OU)** :
  - **Règle** : la sortie est 1 dès qu'au moins une entrée est à 1.
  - **Compréhension intuitive** : deux transistors en **parallèle**. Plusieurs chemins coexistent, un seul suffit pour laisser passer le courant.

- **Porte NOT (NON / inverseur)** :
  - **Règle** : une entrée à 1 donne inévitablement 0 en sortie, une entrée à 0 donne 1.
  - **Compréhension intuitive** : c'est la porte spécialisée dans l'inversion d'état, souvent utilisée comme rempart crucial pour le conditionnement des signaux dans la conception de circuits.

- **Porte XOR (OU exclusif)** :
  - **Règle** : la sortie est exactement 1 lorsque les deux entrées sont **différentes**.
  - **Compréhension intuitive** : on peut la voir comme une machine de précision qui détecte la différence. C'est l'arme fatale pour effectuer l'addition binaire dans les circuits.

### 2.3 Principes de réalisation de l'addition avec des portes logiques

Si les portes logiques présentées jusqu'ici ne permettent que de simples évaluations conditionnelles, comment l'ordinateur fait-il des calculs mathématiques.


<BinaryAdditionRulesDemo />

Ainsi, en combinant une porte XOR (pour calculer le bit de somme) et une porte AND (pour calculer la retenue), on obtient un circuit capable d'additionner deux bits d'un seul chiffre : c'est le **demi-additionneur (Half Adder)**.

<HalfAdderDemo />

Mais le demi-additionneur a un défaut fatal : physiquement, il ne possède que **deux ports d'entrée (A et B)**.

Imaginez que nous fassions une addition décimale posée (par exemple `19 + 22`) :
- **Calcul des unités** : `9 + 2 = 11`. Seulement deux nombres à additionner, on écrit `1` et on retient `1`. Deux entrées suffisent, le demi-additionneur y parvient parfaitement.
- **Calcul des dizaines** : il faut non seulement calculer `1 + 2`, mais aussi **ajouter la retenue 1 provenant des unités** (soit `1 + 2 + 1 = 4`). Cela signifie que dans une addition à plusieurs chiffres, sauf le chiffre de poids le plus faible, tous les autres chiffres additionnent en réalité **trois nombres**.

Comme le demi-additionneur n'a pas de troisième entrée pour recevoir la retenue entrante (Carry-in) provenant du chiffre inférieur, il est inutilisable pour tous les chiffres sauf le plus à droite. Pour résoudre ce problème, nous avons besoin de l'**additionneur complet (Full Adder)**, capable de recevoir trois signaux :

<FullAdderDemo />

En chaînant plusieurs additionneurs complets, on peut réaliser l'addition de nombres à plusieurs chiffres :

<AdderChainDemo />

::: tip Analyse clé : décomposition de l'additionneur
Pour traiter des nombres plus complexes dans le monde réel, les additionneurs s'assemblent comme des briques de construction :

1. **Demi-additionneur (Half Adder)** : il additionne deux bits d'un seul chiffre (c'est-à-dire la combinaison des portes XOR et AND décrites ci-dessus). Il calcule le bit de somme et la retenue, mais ne peut pas recevoir de retenue provenant d'un chiffre inférieur.
2. **Additionneur complet (Full Adder)** : dans un calcul à plusieurs chiffres, les chiffres intermédiaires doivent non seulement additionner A et B, mais aussi traiter la retenue provenant du chiffre inférieur (Carry In). En intégrant cette retenue entrante dans la logique, on obtient l'additionneur complet.
3. **Additionneur à propagation de retenue (Ripple Carry Adder)** : pour traiter des nombres de 32 ou 64 bits, il suffit de chaîner des dizaines d'additionneurs complets. Le signal de retenue se propage comme une vague des bits de poids faible vers les bits de poids fort, permettant d'effectuer des additions de n'importe quelle taille.
:::

Vous voulez voir d'un seul coup d'œil le processus complet, des portes logiques jusqu'à l'addition multibit. Essayez cette démonstration combinée :

<CompleteAdderDemo />

---

## 3. Les unités fonctionnelles : combinaison de portes logiques

Maintenant que nous tenons les briques des portes logiques, nous pouvons franchir un nouveau niveau d'abstraction. Le simple calcul d'addition ne suffit pas, nous allons regrouper des ensembles de portes logiques et les assembler en modules aux fonctions spécifiques. Ces modules sont collectivement appelés **unités fonctionnelles (Functional Units)**.

### 3.1 Classification des modules fonctionnels courants

Lors de la conception d'un CPU, il existe des modules préfabriqués classiques ayant fait leurs preuves :

| Nom du module       | Mission principale                       | Nature de la structure logique interne                   | Métaphore de la vie courante |
| -------------- | ------------------------------------ | ------------------------------------ | -------------------- |
| **Additionneur (Adder)** | Moteur de calcul gérant tous types d'opérations arithmétiques           | Chaînage avancé bit à bit d'une multitude d'additionneurs complets             | Un boulier infatigable |
| **Multiplexeur (MUX)** | Contrôle le flux des données, réalise la sélection d'une voie parmi plusieurs | Fusion ingénieuse de portes AND comme aiguillages et de portes OR pour la convergence | Un aiguillage ferroviaire de précision |
| **Décodeur (Decoder)** | Déchiffre et traduit les instructions binaires brutes provenant de l'extérieur     | Réseau de portes qui active précisément certaines sorties selon l'état de l'entrée   | Un traducteur de codes secrets |
| **Bascule (Flip-Flop)**| Surmonte la nature éphémère des signaux électriques, enregistre l'historique | Boucles de rétroaction croisées extrêmement subtiles formant un mode bistable   | Une balançoire à bascule qui conserve son état |

Pour visualiser intuitivement comment ces unités fonctionnelles travaillent, vous pouvez manipuler le composant ci-dessous pour observer la logique interne du **multiplexeur** et du **décodeur** :

<FunctionalUnitDemo />

Utilisez l'expérimentation interactive ci-dessous pour explorer le phénomène le plus fascinant — **comment la mémoire émerge-t-elle de nulle part.** :

<RegisterDemo />

### 3.2 Le registre : l'unité de stockage des données

Au-delà du calcul, l'ordinateur doit aussi pouvoir mémoriser des données, à court ou à long terme. Si l'on perdait la mémoire de la seconde précédente pendant un calcul, aucune opération complexe ne serait possible. L'ordinateur doit disposer de moyens pour conserver les états passés ; cette capacité repose principalement sur une structure de circuit appelée **bascule (Flip-Flop)**.

::: tip Compréhension approfondie : la mémoire est essentiellement une boucle
Dans la plupart des circuits logiques, les signaux se propagent vers l'avant (boucle d'anticipation). Pour produire une mémoire persistante, les premiers pionniers ont eu une idée géniale : réinjecter la sortie électrique dans l'entrée.

C'est comme une balançoire à bascule astucieuse avec deux points d'équilibre stables. Tant qu'aucune perturbation extérieure ne survient, grâce à sa conception en boucle fermée, elle restera indéfiniment figée dans l'état côté gauche haut, côté droit bas (mémorisant par exemple 0) ou dans l'état opposé (mémorisant 1). Même un changement d'état fugace peut être verrouillé durablement grâce au bouclage mutuel de la boucle fermée.

Lorsque l'on aligne 32 ou 64 de ces bascules en une rangée ordonnée, et qu'on applique un même signal d'horloge puissant (Clock) pour leur ordonner d'agir à l'unisson, le **registre (Register)** voit le jour. Il occupe une place centrale dans le système du CPU, servant de brouillon de travail ultra-rapide qui préserve silencieusement chaque variable critique instantanée.
:::

Utilisez la démonstration interactive ci-dessous pour expérimenter par vous-même ce processus de rupture et de rétablissement de la boucle fermée :

<FlipFlopDemo />

---

## 4. Architecture du CPU : des unités fonctionnelles au processeur

Une fois que les différents modules de calcul et de mémorisation sont conçus, vient l'étape cruciale de l'intégration. Comment combiner ces modules pour en faire un processeur central (CPU) capable d'exécuter automatiquement des instructions.

### 4.1 Les composants essentiels du CPU

Si l'on considère le CPU comme une machine à la division du travail bien définie, chaque unité occupe une place irremplaçable :

- **Unité arithmétique et logique (ALU)** : l'unité de calcul qui fait le travail, spécialisée dans l'addition, la soustraction, la multiplication, la division et toutes sortes d'opérations logiques.
- **Banc de registres (Register File)** : les tiroirs temporaires sur l'établi. De très faible capacité mais extrêmement rapides, ils servent à stocker momentanément les paramètres urgents en cours de calcul.
- **Bus interne (Internal Bus)** : le tapis roulant du système, chargé de transporter données et signaux entre les différents modules.
- **Unité de contrôle (Control Unit)** : le chef d'orchestre. Sa mission est de lire les instructions composées de 0 et de 1 dans la mémoire, de décoder ce qu'il faut faire, et d'envoyer des signaux de contrôle spécifiques aux autres modules, les orchestrant pour qu'ils accomplissent leurs tâches respectives.

<MinCpuDemo />

### 4.2 Principes d'exécution des instructions par le CPU

Quelle que soit la complexité du langage de programmation de haut niveau que vous écrivez, tout finit par devenir une série d'instructions bas niveau en mémoire. Le processus d'exécution de toute instruction par le CPU répète fondamentalement les quatre étapes classiques suivantes :

1. **Recherche (Fetch)** : en suivant l'adresse pointée par le curseur d'exécution du programme, aller chercher le prochain jeu d'instructions binaires dans la mémoire cache, relativement lente, et l'extraire de force dans le cœur.
2. **Décodage (Decode)** : le cerveau de commandement analyse immédiatement : cette instruction demande-t-elle de déplacer des données en mémoire, ou d'appeler l'additionneur pour un calcul. Les circuits nécessaires sont immédiatement connectés et activés.
3. **Exécution (Execute)** : l'instruction est distribuée aux unités de traitement comme l'ALU, les machines tournent à plein régime pour effectuer les bascules logiques matérielles.
4. **Écriture (Write Back)** : le moment de cristallisation du résultat. Le résultat fraîchement obtenu est soigneusement écrit dans un registre spécifique ou renvoyé vers la mémoire plus vaste.

Cliquez sur l'impulsion d'horloge ci-dessous pour observer comment, dans cette boucle infinie, les instructions sont décomposées et exécutées étape par étape, et quels modules matériels sont impliqués :

<CpuArchitectureDemo />

::: tip La quête ultime d'efficacité : le pipeline
S'il fallait attendre qu'une instruction ait traversé les quatre étapes avant de commencer l'instruction suivante, l'efficacité serait manifestement trop faible.

Comme une chaîne de montage dans une usine, les ingénieurs en puces ont introduit la technique du **pipeline d'instructions**. Cela signifie que pendant qu'une partie du circuit est en train d'exécuter l'instruction A, les circuits précédents ne restent pas inactifs : ils décodent l'instruction B, voire vont déjà rechercher l'instruction C. Grâce à ce chevauchement parallèle, l'efficacité d'exécution du CPU est considérablement améliorée.
:::

---

## 5. Conclusion : traverser les niveaux d'abstraction

En regardant en arrière, nous avons parcouru les couches d'abstraction les plus fondamentales de l'architecture informatique. Voici le chemin complet qui transforme les matériaux physiques bruts en une plateforme de calcul universelle :

1. **Physique macroscopique : le sable (cristaux de dioxyde de silicium)**
   → *Après avoir subi les traitements exigeants de la fonderie, du découpage, de la gravure par gaz toxiques...*
2. **Physique microscopique : des milliards d'interrupteurs à transistors** (contrôler l'électricité par l'électricité)
   → *Grâce aux innombrables heures de câblage méticuleux des grands ingénieurs, réalisant une étonnante contrainte d'abstraction numérique*
3. **Algèbre numérique : le système de portes logiques AND / OR / NOT**
   → *Élimination impitoyable des erreurs, dérivation des comportements fondamentaux à partir de tables de vérité parfaites*
4. **Modules de microarchitecture : la collection de briques des unités fonctionnelles (additionneurs, etc.)**
   → *Intégration du rythme d'horloge système et de la capacité de mémoire, évoluant vers des entités fonctionnelles complètes*
5. **Architecture complexe : la vaste et ingénieuse matrice collaborative du CPU**
   → *Ouverture complète vers le monde des applications virtuelles pour les développeurs du monde entier*
6. **Le royaume des mille et une applications : algorithmes, logiciels système et l'univers florissant d'Internet**

Ce qu'il y a de plus fascinant en informatique, c'est que **chaque couche d'encapsulation masque parfaitement les détails complexes de la couche inférieure**. En tant que développeur logiciel, quand vous écrivez `salary = base + bonus`, vous n'avez nul besoin de vous préoccuper de la dérive des électrons sous-jacents ni du cheminement du courant dans le demi-additionneur ; de même, le concepteur matériel de la puce n'a pas à se soucier du logiciel que cette puce exécutera un jour.

C'est précisément ce découplage extrême entre les niveaux et cet emboîtement en boîtes noires hautement indépendantes qui, ensemble, ont donné naissance et ouvert la voie à l'ère florissante de la technologie moderne.

::: tip Réflexion ultime
**En fin de compte, ce qu'on appelle la puissance de calcul n'est rien d'autre que la reconfiguration incessante de milliards d'interrupteurs dans un espace confiné ; rythmée par le battement de l'horloge, elle accomplit des calculs complexes sur cette minuscule plaquette de silicium.**

Le changement quantitatif finit par provoquer un saut qualitatif, cette phrase se vérifie sans cesse dans l'architecture informatique. Lorsque nous tapons sur le clavier et regardons l'écran, nous pouvons essayer d'imaginer : au plus profond des fondations microscopiques de silicium, des dizaines de milliards de transistors minuscules, en un éclair, déploient toutes leurs forces pour une collaboration de précision. C'est peut-être là la beauté la plus singulière de l'informatique.
:::

---

## Lectures complémentaires

Si vous êtes passionné par les technologies de bas niveau, vous pouvez explorer les directions suivantes :
- **Ouvrage classique** : *Computer Organization and Design (The Hardware/Software Interface)* est un excellent livre de référence pour approfondir l'architecture des ordinateurs.
- **Simulation logique numérique** : essayez d'utiliser un logiciel de simulation logique ou des composants électroniques de base pour construire vous-même un simple additionneur 8 bits ou un simulateur.
- **Architecture de pointe** : découvrez comment les caches multiniveaux atténuent le problème du mur mémoire, le principe de l'exécution dans le désordre des instructions, et les mécanismes de calcul spécifiques des GPU.
- **Langage d'assemblage et bas niveau** : essayez d'apprendre les bases de l'assembleur, pour comprendre comment les langages de haut niveau sont finalement traduits en instructions hexadécimales que la machine peut exécuter.
