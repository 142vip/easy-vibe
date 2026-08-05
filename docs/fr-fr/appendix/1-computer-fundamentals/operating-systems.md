# Principes des systèmes d'exploitation : processus, mémoire et systèmes de fichiers

::: tip Préface
**Avec un CPU parfait et une mémoire infinie, peut-on utiliser directement l'ordinateur ?**
Dans le chapitre précédent, nous avons vu comment les transistors s'assemblent en un CPU puissant. Mais même avec le meilleur matériel, pour afficher une seule lettre à l'écran, il faudrait écrire des centaines de lignes d'instructions machine obscures. Non seulement c'est fastidieux, mais c'est aussi extrêmement dangereux — une simple erreur et votre code pourrait écraser les données de quelqu'un d'autre.

Pour résoudre ces cauchemars, le **système d'exploitation (Operating System, OS)** est né. C'est le plus grand « logiciel » qui se place entre vous et le matériel froid. Ce chapitre met de côté le code complexe et utilise des analogies simples pour montrer comment ce « super intendant » dompte le matériel chaotique.
:::

**Que allez-vous apprendre dans cet article ?**

À la fin de ce chapitre, vous aurez acquis :

- **Capacité de diagnostic** : pouvoir analyser les causes des problèmes « programme bloqué » ou « mémoire insuffisante » du point de vue du système d'exploitation
- **Compréhension approfondie de la terminologie** : comprendre quels problèmes résolvent « multiprocessus », « mémoire virtuelle » et « permissions de fichiers »
- **Pensée systémique** : comprendre que les programmes ne fonctionnent pas isolément, mais interagissent étroitement avec le système d'exploitation, d'autres processus et les ressources matérielles
- **Fondements pour la suite** : préparer le terrain pour la programmation concurrente, l'optimisation système et la conteneurisation

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Gestion des processus | Multiplexage temporel du CPU, tourniquet (round-robin) |
| **Chapitre 2** | Gestion de la mémoire | Mémoire virtuelle, mécanisme de pagination |
| **Chapitre 3** | Système de fichiers | Organisation des fichiers, structure des répertoires |

---

## 0. Vue d'ensemble : Principe d'un système d'exploitation

Imaginez que vous ouvrez une « usine de calcul » (votre ordinateur) très prometteuse. L'usine compte un collaborateur surpuissant et infatigable (CPU), un immense entrepôt (mémoire) et d'innombrables conteneurs (disque dur).

Si vous **n'employez pas** de directeur d'usine (système d'exploitation) :
1. **Crise de monopole du CPU** : Le CPU ne peut faire qu'une chose à la fois. Si quelqu'un l'utilise pour écouter de la musique et qu'un autre veut naviguer sur le web ? Désolé, tout le monde doit attendre que l'auditeur rende le CPU volontairement.
2. **Bousculade mémoire** : WeChat et le jeu utilisent tous deux l'entrepôt (mémoire). Sans agent de sécurité pour délimiter les zones, le jeu risque de placer ses données d'équipement dans la boîte de WeChat — crash immédiat.
3. **Labyrinthe du disque dur** : Le disque dur n'est physiquement qu'un grand disque gravé de 0 et de 1. Pour retrouver la photo d'hier, il faut se souvenir exactement de « face 1, piste 56, secteur 8 » — personne ne peut retenir de telles coordonnées inhumaines.

<OSArchitectureDemo />

Pour résoudre ces trois cauchemars, le système d'exploitation déploie ses trois armes : **gestion des processus**, **gestion de la mémoire** et **système de fichiers**.

---

## 1. Gestion des processus : Le multiplexage temporel du CPU

Quand vous utilisez votre ordinateur, vous avez souvent WeChat ouvert, de la musique en fond et vous tapez du texte en même temps. Mais si votre ordinateur n'a qu'un seul cœur CPU, comment fait-il ces trois choses simultanément ?

La réponse : **il ne les fait pas en même temps. C'est le système d'exploitation qui gère frénétiquement le temps.**

<ProcessDemo />

### 1.1 Présentation d'un processus
Chaque programme en cours d'exécution est un **processus**. On peut le comparer à une « équipe projet » : avec son propre code (liste de tâches), ses propres données mémoire (budget du projet), qui fait la queue pour être reçu par le CPU.

### 1.2 Tourniquet à tranches de temps
Pour éviter qu'un logiciel malveillant monopolise le CPU, le système d'exploitation découpe le temps du CPU en minuscules tranches (environ 10 millisecondes) et les attribue tour à tour à chaque processus. La commutation est si rapide que tout semble s'exécuter « en simultané ».

---

## 2. Gestion de la mémoire : L'espace d'adressage virtuel

Le problème de l'utilisation alternée du CPU étant résolu, passons à l'espace mémoire. Sans gestion, tous les logiciels écrivent directement dans la mémoire physique, ce qui provoque inévitablement des **écrasements mutuels**.

<MemoryDemo />

### 2.1 Présentation de la mémoire virtuelle
Le système d'exploitation ment effrontément à chaque processus : « Hey, tu as l'exclusivité de toute la mémoire disponible de cet ordinateur, utilise-la comme tu veux ! »

Du point de vue du processus, sa mémoire est toujours **contiguë** et **propre**. Il y écrit ses données en toute tranquillité.

### 2.2 Principe de la table des pages
En réalité ? Le système d'exploitation glisse subrepticement les données dans les interstices de la **vraie mémoire physique**. Cela présente deux avantages géniaux :
1. **Sécurité absolue** : WeChat ne voit que son propre espace et ne peut pas modifier les données des autres
2. **Utilisation de la fragmentation** : Même si la mémoire physique est chaotique, l'espace virtuel du processus reste bien ordonné

---

## 3. Le système de fichiers : L'organisation du stockage persistant

Si vous achetez un disque dur tout neuf, il ne contient que des cellules de stockage vierges. Pour y sauvegarder une photo, le disque dur vous demande : « Dites-moi à quel octet vous voulez la stocker ? »

<FilesystemDemo />

### 3.1 Fonction du système de fichiers
1. **Découper le disque** : Diviser le disque en innombrables **blocs** de taille fixe (généralement 4 Ko)
2. **Tenir un registre** : Noter quels blocs sont pleins et lesquels sont vides
3. **Traduire les chemins** : Traduire `D:/Photos/Animal de compagnie.jpg` en « blocs 3, 7 et 11 »

C'est pourquoi renommer un fichier est instantané (seul le nom dans le registre change) tandis que copier un fichier prend du temps (il faut réellement lire et écrire les blocs de données sur le disque).

---

## 4. Coordination des trois : Le processus complet de lancement d'un programme

Nous avons examiné séparément les trois modules du système d'exploitation. Voyons maintenant comment ils collaborent quand vous **double-cliquez pour ouvrir un programme** :

<ProgramLaunchDemo />

Que vous cliquiez sur l'icône du bureau ou que vous écriviez `print("Hello World")` dans votre code, rien ne fonctionnerait sans ce travail complexe en coulisses. Si nous pouvons naviguer si facilement dans le monde numérique, c'est parce que le système d'exploitation porte la charge à notre place en arrière-plan.

---

## Lectures complémentaires

Si vous trouvez fascinantes les diverses « techniques de management et de ruse » du système d'exploitation, explorez ces sujets avancés :
- **Processus et threads** : Si le processus est une équipe projet, les « threads » en sont les collaborateurs
- **Concurrence et verrous** : Comment prévenir les interblocages quand deux processus se disputent la même ressource
- **Appels système** : Le « guichet de service » que le système d'exploitation offre aux applications supérieures
