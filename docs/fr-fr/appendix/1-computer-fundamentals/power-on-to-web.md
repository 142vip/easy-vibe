# Panorama du système informatique : du démarrage à la visite web

::: tip Préface
Vous êtes-vous déjà demandé ce qui se passe exactement entre le moment où vous appuyez sur le bouton d'alimentation de votre ordinateur et celui où vous voyez enfin une page web dans votre navigateur.

Ce processus est semblable à une **course de relais** — une fois sous tension, le matériel réveille le firmware, qui après avoir terminé ses vérifications passe le relais au système d'exploitation. Une fois l'environnement prêt, le système d'exploitation peut lancer le navigateur, qui se connecte ensuite au réseau pour récupérer la page web depuis un serveur distant. Chaque maillon **dépend de la réussite du maillon précédent** : si un seul relayeur échoue, les étapes suivantes ne peuvent pas avoir lieu.

Comprendre cette chaîne complète vous aide à construire une vision globale du système informatique — c'est aussi un passage obligé pour devenir ingénieur full-stack.
:::

**Ce que vous allez apprendre**

Cet article suit l'ordre chronologique réel des événements et vous guide à travers les cinq étapes, de l'appui sur le bouton d'alimentation jusqu'à l'affichage de la page web :

1. **Démarrage du matériel** (Section 1) → Comment le courant électrique réveille le CPU
2. **Auto-test du firmware** (Section 2) → Comment le BIOS/UEFI vérifie le matériel et trouve le périphérique de démarrage
3. **Démarrage du système d'exploitation** (Section 3) → Comment le noyau se charge et comment le bureau apparaît
4. **Lancement du navigateur** (Section 4) → Comment une application est exécutée par le système d'exploitation
5. **Requête réseau** (Section 5) → Le flux complet d'une requête réseau, de la saisie de l'URL jusqu'au rendu de la page

Chaque étape se construit sur la précédente, aucune ne peut être omise.

---

## 1. Appui sur le bouton d'alimentation : le réveil du matériel

### 1.1 Mise sous tension

Lorsque vous appuyez sur le bouton d'alimentation, le **bloc d'alimentation (PSU)** se met en marche et convertit le courant alternatif (220 V) en courant continu (12 V, 5 V, 3,3 V, etc.) pour alimenter les différents composants matériels.

```
Bouton d'alimentation → Bloc d'alimentation (PSU) → Sortie courant continu → Alimentation des composants de la carte mère
```

### 1.2 Réveil du chipset de la carte mère

Une fois l'alimentation stabilisée, le **chipset de la carte mère** entre en action. Il joue le rôle de chef d'orchestre de l'ordinateur, chargé de coordonner tous les composants matériels.

### 1.3 Réinitialisation du CPU

Après avoir reçu le signal de réinitialisation, le CPU remet à zéro tous ses registres internes et son cache, puis commence à exécuter des instructions à partir d'une adresse prédéfinie. Cette adresse pointe généralement vers la puce **BIOS/UEFI**.

<PowerOnDemo />

---

> **Premier relais terminé** ⛳ À ce stade, le travail au niveau matériel est achevé : le bloc d'alimentation a converti le courant alternatif en courant continu stable, le chipset de la carte mère a été réveillé et coordonne les composants, et le CPU a terminé sa réinitialisation — ses registres sont vidés et il est prêt à exécuter sa première instruction.
>
> Mais attention — à cet instant, le CPU est comme un nouveau-né qui vient d'ouvrir les yeux. Bien qu'il puisse exécuter des instructions, il ne sait rien de son environnement : combien de mémoire est installée. La carte graphique fonctionne-t-elle. Où se trouve le disque dur. Depuis quel périphérique faut-il démarrer le système d'exploitation. Le CPU ne peut pas répondre seul à ces questions.
>
> Ainsi, la première instruction exécutée par le CPU après sa réinitialisation est un saut vers une **adresse mémoire fixe** — cette adresse pointe vers la puce de firmware BIOS/UEFI soudée sur la carte mère. À partir de cet instant, le contrôle passe du matériel pur au firmware. La mission du BIOS/UEFI est claire : **vérifier que tout le matériel fonctionne correctement, puis trouver le système d'exploitation et le démarrer**. C'est le deuxième relais de la course.

## 2. BIOS/UEFI : l'auto-test du matériel

<BiosUefiInteractiveDemo />

---

> **Deuxième relais terminé** ⛳ Le BIOS/UEFI a rempli ses trois missions : le POST a confirmé que la mémoire, la carte graphique, le clavier et les autres périphériques fonctionnent correctement ; les modes de fonctionnement de chaque composant ont été initialisés ; et le secteur de démarrage sur le disque dur a été trouvé en suivant l'ordre de démarrage.
>
> Mais le rôle du BIOS/UEFI s'arrête là — c'est essentiellement un médecin examinateur + dispatcheur. Il peut vérifier si le matériel est en bonne santé et décider depuis quel périphérique démarrer, mais il ne gère pas vos fichiers, n'exécute pas vos applications et ne vous affiche pas un joli bureau. Ces tâches complexes nécessitent un logiciel plus puissant pour prendre le relais — c'est le **système d'exploitation**.
>
> La passation est très concrète : le BIOS/UEFI lit le code du programme d'amorçage situé dans le premier secteur du disque dur (le secteur de démarrage), le charge en mémoire, puis fait sauter le CPU vers ce code pour l'exécuter. À partir de cet instant, le contrôle passe officiellement du firmware au programme d'amorçage du système d'exploitation. Le programme d'amorçage va charger le noyau du système d'exploitation étape par étape, démarrer les services système, pour finalement afficher le bureau que vous connaissez bien. Le maillon le plus complexe de cette chaîne commence.

## 3. Démarrage du système d'exploitation : du noyau au bureau

<OSBootInteractiveDemo />

---

> **Troisième relais terminé** ⛳ Le système d'exploitation est complètement démarré, le bureau s'affiche devant vous. Récapitulons ce que ce relais a accompli : le programme d'amorçage a lu le noyau depuis le disque dur, le noyau a pris le contrôle du CPU et de la mémoire, les services système ont démarré un par un (réseau, audio, centre de sécurité…), et enfin l'interface graphique a rendu le bureau.
>
> À cet instant, le système d'exploitation est comme un immeuble où l'eau et l'électricité sont branchées et où le gestionnaire a emménagé — la **gestion des processus** attribue un appartement à chaque résident (programme), la **gestion mémoire** alloue l'espace, le **système de fichiers** gère l'entrepôt, et la **pile de protocoles réseau** s'occupe des communications extérieures. Ces services publics constituent l'infrastructure sur laquelle toutes les applications s'exécutent : sans eux, aucun programme ne peut démarrer.
>
> Maintenant, vous voulez aller sur Internet, alors vous double-cliquez sur l'icône du navigateur sur le bureau. Derrière ce simple geste, le système d'exploitation accomplit une série de tâches : trouver où se situe le fichier exécutable du navigateur sur le disque dur, lui créer un processus indépendant, allouer de l'espace mémoire, charger le code du programme… C'est l'expression directe de la capacité de gestion des processus du système d'exploitation. Voyons maintenant comment le navigateur est lancé.

## 4. Ouverture du navigateur : le lancement de l'application

### 4.1 Le processus de lancement d'une application

Lorsque vous double-cliquez sur l'icône du navigateur, le système d'exploitation effectue les opérations suivantes :

1. **Recherche du fichier exécutable** : en fonction des associations de fichiers, il trouve le fichier `.exe` (Windows) ou l'exécutable du navigateur
2. **Création d'un processus** : il crée un nouveau **processus** pour le navigateur
3. **Chargement du programme** : il charge le code du navigateur du disque dur vers la mémoire
4. **Initialisation** : il lance le thread principal du navigateur, le moteur de rendu, le moteur réseau, etc.

```
Lancement du navigateur :
┌─────────────────────────────────────────────────┐
│  1. Double-clic sur l'icône                     │
│  2. Le système d'exploitation trouve            │
│     l'exécutable du navigateur                  │
│  3. Création du processus du navigateur         │
│  4. Chargement du code en mémoire               │
│  5. Initialisation des modules                  │
│     (rendu, réseau, JS)                         │
│  6. Affichage de la fenêtre du navigateur       │
└─────────────────────────────────────────────────┘
```

### 4.2 Les principaux composants du navigateur

Un navigateur moderne est un véritable système d'exploitation, composé principalement des éléments suivants :

| Module | Fonction |
|-----|------|
| **Interface utilisateur** | Barre d'adresse, onglets, favoris, etc. |
| **Moteur du navigateur** | Coordination entre l'UI et le moteur de rendu |
| **Moteur de rendu** | Analyse du HTML/CSS, affichage de la page web |
| **Moteur JavaScript** | Exécution du code JavaScript |
| **Module réseau** | Envoi des requêtes HTTP |
| **Backend UI** | Dessin des composants d'interface de base |
| **Stockage de données** | Cookies, LocalStorage, etc. |

<BrowserArchitectureDemo />

---

> **Quatrième relais terminé** ⛳ Le navigateur a bien été lancé. Le système d'exploitation lui a créé un processus indépendant, alloué de l'espace mémoire, et les différents modules du navigateur sont initialisés : le moteur de rendu est prêt à analyser le HTML/CSS, le moteur JavaScript est prêt à exécuter les scripts, et le module réseau est prêt à envoyer et recevoir des données.
>
> Vous pouvez imaginer le navigateur à cet instant comme une voiture dont le moteur tourne — le moteur ronronne, le tableau de bord est allumé, le système de navigation est prêt, mais la voiture est encore à l'arrêt car le conducteur (vous) ne lui a pas encore dit où aller. La fenêtre du navigateur est vide pour le moment, et le curseur clignote dans la barre d'adresse, attendant votre saisie.
>
> Lorsque vous tapez `https://www.example.com` dans la barre d'adresse et appuyez sur Entrée, un flux à travers tout Internet commence. Le module réseau du navigateur prend en charge cette requête : il analyse d'abord la structure de l'URL, puis traduit le nom de domaine en adresse IP via DNS, établit ensuite une connexion TCP avec le serveur distant à travers le réseau, négocie un canal chiffré, envoie la requête HTTP, attend la réponse du serveur, et enfin transmet le code HTML/CSS/JS reçu au moteur de rendu pour le dessiner en page web. C'est le relais qui comporte le plus d'étapes et qui fait intervenir le plus de protocoles — et c'est aussi celui que les développeurs web doivent le mieux comprendre.

## 5. Accès à une URL : tout le processus d'une requête réseau

### 5.1 Présentation d'une URL

Une **URL (Uniform Resource Locator)** est l'adresse d'une ressource. Comme une adresse postale, elle sert à localiser des ressources sur Internet.

```
Structure d'une URL :
┌─────────────────────────────────────────────────────────────────┐
│  https://  │  www.example.com  │  /path/to/page  │ ?query=1    │
│  Protocole │   Nom de domaine  │    Chemin       │  Requête    │
└─────────────────────────────────────────────────────────────────┘
```

- **Protocole (Protocol)** : la méthode d'accès (http, https, ftp, etc.)
- **Nom de domaine (Domain)** : l'adresse du serveur
- **Chemin (Path)** : l'emplacement de la ressource sur le serveur
- **Requête (Query)** : les paramètres supplémentaires

### 5.2 Le flux complet d'accès à une URL

Lorsque vous accédez à `https://www.example.com`, voici ce qui se passe :

<URLRequestDemo />

#### Première étape : Analyse de l'URL

Le navigateur commence par **analyser l'URL**, en extrayant le protocole, le nom de domaine, le chemin et d'autres informations.

```
Analyse de l'URL :
https://www.example.com/index.html
  ↓
Protocole : https
Nom de domaine : www.example.com
Chemin : /index.html
```

#### Deuxième étape : Résolution DNS

L'ordinateur accède au serveur via le réseau, mais le réseau utilise des **adresses IP** (comme 93.184.216.34), pas des noms de domaine. Il faut donc convertir le nom de domaine en adresse IP — ce processus s'appelle la **résolution DNS**.

```
Processus de résolution DNS :
┌─────────────────────────────────────────────────────────────────┐
│  Cache du navigateur → Fichier hosts → Cache DNS local         │
│  → Serveur DNS                                                  │
└─────────────────────────────────────────────────────────────────┘

Processus réel :
1. Le navigateur vérifie son cache (a-t-il été visité récemment)
2. Le système d'exploitation vérifie le cache DNS
3. Envoi d'une requête au serveur DNS
4. Le serveur DNS renvoie l'adresse IP
```

#### Troisième étape : Établissement de la connexion TCP

Une fois l'adresse IP obtenue, le navigateur doit établir une **connexion TCP** avec le serveur. TCP est un protocole de la couche transport qui garantit une transmission fiable des données.

```
Handshake TCP en trois étapes :
┌─────────────────────────────────────────────────────────────────┐
│  Client → Serveur : SYN (demande de synchronisation)           │
│  Serveur → Client : SYN-ACK (accusé de réception et synchro)  │
│  Client → Serveur : ACK (accusé de réception)                  │
│                        ↓                                        │
│  Connexion établie !                                            │
└─────────────────────────────────────────────────────────────────┘
```

S'il s'agit de **HTTPS**, un **handshake TLS/SSL** supplémentaire est nécessaire pour établir un canal chiffré.

#### Quatrième étape : Envoi de la requête HTTP

Une fois la connexion établie, le navigateur envoie une **requête HTTP** au serveur :

```
Format d'une requête HTTP :
┌─────────────────────────────────────────────────────────────────┐
│  GET /index.html HTTP/1.1                                      │
│  Host: www.example.com                                         │
│  User-Agent: Mozilla/5.0...                                     │
│  Accept: text/html                                             │
│                                                                 │
│  (ligne vide)                                                   │
└─────────────────────────────────────────────────────────────────┘
```

Méthodes HTTP courantes :

| Méthode | Signification | Usage |
|-----|------|-----|
| **GET** | Récupérer une ressource | Naviguer sur le web |
| **POST** | Envoyer des données | Connexion, envoi de formulaire |
| **PUT** | Téléverser une ressource | Téléversement de fichier |
| **DELETE** | Supprimer une ressource | Suppression de données |

#### Cinquième étape : Traitement de la requête par le serveur

Le serveur (généralement un **serveur web** comme Nginx ou Apache) après avoir reçu la requête :

1. **Analyse la requête** : comprend ce que le client veut
2. **Traite la logique métier** : appelle le programme backend (comme Python, Node.js, Java)
3. **Interroge la base de données** : récupère les données nécessaires
4. **Génère la réponse** : assemble les données au format HTML, JSON, etc.

```
Processus de traitement côté serveur :
┌─────────────────────────────────────────────────────────────────┐
│  1. Le serveur web reçoit la requête (Nginx/Apache)            │
│  2. Trouve le gestionnaire correspondant au chemin              │
│  3. Exécute le code backend (API, logique métier)              │
│  4. Interroge la base de données si nécessaire                 │
│  5. Assemble la réponse (HTML/JSON/CSS/JS)                     │
│  6. Renvoie la réponse HTTP                                    │
└─────────────────────────────────────────────────────────────────┘
```

#### Sixième étape : Retour de la réponse HTTP

Le serveur renvoie une **réponse HTTP** contenant le code de statut, les en-têtes de réponse et le corps de la réponse :

```
Format d'une réponse HTTP :
┌─────────────────────────────────────────────────────────────────┐
│  HTTP/1.1 200 OK                                               │
│  Content-Type: text/html                                       │
│  Content-Length: 1234                                          │
│                                                                 │
│  <!DOCTYPE html>                                               │
│  <html>...</html>                                              │
└─────────────────────────────────────────────────────────────────┘
```

Codes de statut courants :

| Code de statut | Signification |
|-------|------|
| **200** | Succès |
| **301/302** | Redirection |
| **404** | Ressource non trouvée |
| **500** | Erreur serveur |

#### Septième étape : Rendu de la page par le navigateur

Après avoir reçu la réponse, le navigateur commence le **rendu de la page** :

<RenderingDemo />

1. **Analyse du HTML** : construction de l'arbre DOM
2. **Analyse du CSS** : calcul des styles, construction de l'arbre de rendu
3. **Exécution du JavaScript** : exécution du code JS de la page
4. **Peinture de la page** : affichage du contenu à l'écran

```
Processus de rendu du navigateur :
┌─────────────────────────────────────────────────────────────────┐
│  1. Analyse HTML → Arbre DOM                                   │
│  2. Analyse CSS → Règles de style                              │
│  3. DOM + CSS → Arbre de rendu                                 │
│  4. Calcul de la mise en page → Taille et position             │
│     de chaque élément                                           │
│  5. Peinture → Affichage des pixels à l'écran                  │
│  6. Composition → Fusion et affichage des couches              │
└─────────────────────────────────────────────────────────────────┘
```

---

> **Dernier relais terminé** ⛳ La page web s'affiche enfin devant vos yeux. Revenons sur toutes les étapes de ce dernier relais : le navigateur analyse l'URL pour en extraire le protocole et le nom de domaine, traduit le nom de domaine en adresse IP par des requêtes DNS successives, établit une connexion fiable avec le serveur via le handshake TCP en trois étapes, négocie un canal chiffré par handshake TLS, envoie la requête HTTP, le serveur traite la logique métier, interroge la base de données, assemble les données de réponse et les renvoie, et enfin le moteur de rendu du navigateur analyse le HTML en arbre DOM, calcule les règles de style CSS, fusionne les deux en arbre de rendu, calcule la mise en page, et peint pixel par pixel sur l'écran.
>
> Prenons maintenant du recul et examinons cette course de relais dans son ensemble, du début à la fin. Depuis l'instant où vous appuyez sur le bouton d'alimentation : le courant réveille le matériel (1er relais) → le firmware vérifie les périphériques et trouve le disque de démarrage (2e relais) → le système d'exploitation démarre complètement, du noyau jusqu'au bureau (3e relais) → le navigateur est lancé en tant qu'application par le système d'exploitation (4e relais) → la requête réseau traverse Internet pour récupérer les données et les afficher en page web (5e relais). Ces cinq relais sont étroitement imbriqués, chacun se construit sur les acquis du précédent — si un seul maillon manque, vous ne pourriez pas voir cette page web.
>
> Voyons maintenant un diagramme de flux complet qui relie ces cinq étapes et montre visuellement leurs dépendances.

## 6. Récapitulatif complet du processus

Relions l'ensemble du processus :

<FullProcessDemo />

```
Du bouton d'alimentation à l'affichage d'un site web — le processus complet :

┌──────────────────────────────────────────────────────────────────┐
│  1. Appui sur le bouton d'alimentation                            │
│     └── Mise sous tension → Réveil de la carte mère              │
│         → Réinitialisation du CPU → Exécution du BIOS/UEFI       │
├──────────────────────────────────────────────────────────────────┤
│  2. Démarrage du BIOS/UEFI                                       │
│     └── Auto-test matériel → Recherche du périphérique           │
│         de démarrage → Lecture du programme d'amorçage            │
├──────────────────────────────────────────────────────────────────┤
│  3. Démarrage du système d'exploitation                          │
│     └── Programme d'amorçage → Chargement du noyau               │
│         → Démarrage des services → Affichage du bureau           │
├──────────────────────────────────────────────────────────────────┤
│  4. Ouverture du navigateur                                      │
│     └── Double-clic sur l'icône → Création du processus          │
│         → Chargement du programme → Affichage de la fenêtre      │
├──────────────────────────────────────────────────────────────────┤
│  5. Accès à l'URL                                                │
│     └── Analyse de l'URL → Résolution DNS → Connexion TCP       │
│         → Requête HTTP → Traitement serveur                     │
│         → Réponse HTTP → Rendu navigateur → Affichage de la page │
└──────────────────────────────────────────────────────────────────┘
```

---

> En observant l'ensemble de cette chaîne, vous remarquerez une règle intéressante : chaque étape résout un problème complètement différent et fait appel à des domaines techniques radicalement distincts. Le 1er relais relève du **génie électronique** — conversion de puissance, conception de circuits, transmission de signaux ; le 2e relais appartient à la **programmation firmware** — utiliser du code bas niveau pour contrôler directement le matériel ; le 3e relais est le monde des **systèmes d'exploitation** — ordonnancement des processus, gestion mémoire, systèmes de fichiers, qui sont au cœur de l'informatique ; le 4e relais touche au **développement d'applications** — comment concevoir l'architecture logicielle complexe d'un navigateur ; le 5e relais couvre à la fois les **réseaux informatiques** et le **développement frontend** — des protocoles réseau comme DNS, TCP/IP, HTTP jusqu'à l'analyse et le rendu de HTML/CSS/JS.
>
> Cela explique aussi pourquoi un ingénieur full-stack a besoin d'un large éventail de connaissances : chaque ligne de code frontend que vous écrivez doit traverser toute cette chaîne avant d'être présentée à l'utilisateur. Comprendre chaque maillon de la chaîne vous aide à localiser rapidement l'origine d'un problème — est-ce un problème de couche réseau. Un problème de serveur. Ou un problème de rendu dans le navigateur.
>
> La carte des connaissances ci-dessous organise ces domaines techniques et vous indique la direction pour vos apprentissages futurs.

## 7. Carte des connaissances

Les domaines de connaissance abordés dans ce chapitre :

```
Aperçu du système informatique
├── Bases du matériel
│   ├── Bloc d'alimentation (PSU)
│   ├── Chipset de la carte mère
│   └── CPU
├── BIOS/UEFI
│   ├── Auto-test POST
│   ├── Ordre de démarrage
│   └── Programme d'amorçage
├── Système d'exploitation
│   ├── Noyau (Kernel)
│   ├── Services système
│   └── Environnement de bureau
├── Application
│   ├── Gestion des processus
│   └── Chargement des programmes
└── Communication réseau
    ├── Résolution DNS
    ├── Protocole TCP/IP
    ├── Protocole HTTP
    └── Rendu du navigateur
```

::: tip Pour aller plus loin
Si vous souhaitez approfondir certains aspects, vous pouvez continuer avec :

- **Fondamentaux des circuits numériques : du transistor au CPU** : comprendre les bases du matériel informatique
- **Principes des systèmes d'exploitation : processus, mémoire et systèmes de fichiers** : comprendre le système d'exploitation en profondeur
- **Réseaux informatiques : de la saisie d'URL au rendu des pages** : comprendre les protocoles réseau en profondeur
:::
