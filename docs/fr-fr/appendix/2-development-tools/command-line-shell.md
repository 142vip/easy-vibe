# Introduction : Ligne de commande et scripts Shell
> 💡 **Guide d'apprentissage** : Ce chapitre vise a fournir aux debutants sans experience une comprehension systematique du fonctionnement du terminal. Aucune formation en informatique n'est requise. Nous analyserons progressivement les mecanismes du terminal, de base en avance, a travers des demonstrations interactives.

## 0. Demarrage rapide : Comment ouvrir le terminal

Avant de commencer a apprendre, vous devez d'abord le trouver. Le terminal est un composant "installe par defaut" de chaque systeme d'exploitation — vous n'avez besoin d'installer aucun logiciel pour l'utiliser.

::: info 🖥️ Methode d'ouverture selon le systeme

** macOS (Mac)**

1.  Appuyez sur `Command (⌘) + Espace` pour ouvrir la recherche Spotlight.
2.  Saisissez `Terminal`.
3.  Appuyez sur Entree et une fenetre avec du texte blanc sur fond noir (ou noir sur fond blanc) apparaitra.

**🪟 Windows**

- **Methode 1 (CMD)** : Appuyez sur `Win + R`, saisissez `cmd` et appuyez sur Entree. C'est la ligne de commande la plus ancienne.
- **Methode 2 (PowerShell)** : Appuyez sur `Win + R`, saisissez `powershell` et appuyez sur Entree. C'est un terminal plus moderne et plus puissant.
- _Conseil : Pour des operations simples, les deux conviennent, mais pour l'environnement de developpement, PowerShell ou l'installation de WSL (Windows Subsystem for Linux) est recommande._

**🐧 Linux**

- Generalement, le raccourci est `Ctrl + Alt + T`.
- Ou recherchez `Terminal` dans le menu des applications.

:::

### 0.1 Travaux pratiques : Essayez d'abord (Hands-on Lab)

La theorie seule ne suffit pas. Avant de decouvrir les principes plus arides, commencons par experimenter directement la sensation de "saisir des commandes".

> 💡 **Astuce** : Pour plus de securite et de facilite, il est recommande de s'exercer dans le **simulateur web** ci-dessous. Si vous etes confiant, vous pouvez aussi ouvrir le veritable terminal de votre ordinateur selon la methode du chapitre 0 et suivre les etapes (le resultat sera le meme).

Dans cet exercice, vous apprendrez a :

1.  **Voir les fichiers** : Utiliser `ls` ou `dir` pour voir le contenu du repertoire actuel.
2.  **Creer et naviguer** : Utiliser `mkdir` pour creer un nouveau dossier et `cd` pour y entrer comme a travers un portail.
3.  **Creer de nouveaux fichiers** : Creer rapidement un nouveau fichier avec une commande.
4.  **Installer des logiciels** : Ressentir le plaisir d'installer une bibliotheque Python ou un logiciel systeme en une seule ligne de code.
5.  **Supprimer et nettoyer** : Apprendre a supprimer les fichiers inutiles (a utiliser avec precaution !).
6.  **Demander de l'aide a l'IA** : C'est le plus important ! Quand vous oubliez une commande, apprenez a demander a l'IA : "Comment supprimer un fichier sur Mac ?", elle vous donnera directement la reponse.

_Choisissez ci-dessous le systeme d'exploitation que vous utilisez habituellement, puis suivez le guide pour commencer :_

<TerminalHandsOn />

### 0.2 Pourquoi abandonner la souris (Why CLI )

Vous pourriez vous demander : _"Les interfaces graphiques (GUI) sont si pratiques aujourd'hui, il suffit de cliquer avec la souris. Pourquoi taper des commandes complexes dans une fenetre au texte blanc sur fond noir ?"_

Ce n'est pas pour "faire le geek", mais parce que dans certaines situations, **le langage (commandes) est plus puissant que les gestes (souris)**.

#### 1. La souris a du mal a exprimer le "traitement par lots" et la "logique"

- **GUI (souris)** : Adapté pour "cliquer sur ce qu'on voit". Si vous voulez supprimer une photo, un clic droit suffit. Mais si vous voulez "supprimer toutes les photos prises en 2023, de plus de 5 Mo et au format PNG", la souris est impuissante — vous devrez filtrer manuellement pendant longtemps.
- **CLI (commande)** : Adapté pour "decrire ce que vous voulez faire". L'exigence ci-dessus ne necessite qu'une seule ligne de commande. L'ordinateur trouvera automatiquement les fichiers correspondants et les traitera, meme s'il y en a 10 000.

#### 2. Les commandes peuvent etre enregistrees et reutilisées

- **GUI** : Vous configurez un environnement une fois, ce qui necessite des dizaines de clics de menu. La prochaine fois que vous changez d'ordinateur, vous devez tout recommencer de memoire, avec le risque d'oublier des etapes.
- **CLI** : Vous pouvez ecrire toutes les commandes dans un fichier (un script). La prochaine fois, il suffit d'executer ce fichier et l'ordinateur reproduira vos operations **sans aucune erreur**. C'est la base de "l'automatisation".

#### 3. Le seul choix pour le controle a distance

- **GUI** : Transmettre des images, c'est comme regarder une video haute definition — cela necessite une tres grande vitesse Internet. Si la connexion est legerement instable, la souris saccade et devient inutilisable.
- **CLI** : Seul du texte pur est transmis, quelques dizaines de caracteres. Meme dans une zone montagneuse avec un signal tres faible, vous pouvez controler fluidement un serveur dans un datacenter a l'autre bout du monde.

**Resume** : La GUI est adaptee a l'**exploration** (naviguer sur le Web, voir des images), la CLI a la **production** (developpement, exploitation, traitement par lots). En tant que developpeurs, nous utilisons le terminal parce qu'il est **plus precis, plus controle et plus efficace**.

## 1. Definition des concepts : Qu'est-ce qu'un terminal (Definition)

_Sur differents systemes d'exploitation, le terminal a une apparence differente et **les commandes sont aussi differentes**. Cliquez sur les boutons ci-dessous pour basculer et observez comment macOS, Windows et Linux accomplissent la meme chose avec des commandes differentes (par ex. `dir` vs `ls`) :_

<TerminalOSDemo />

Avant la generalisation des interfaces graphiques (GUI), le terminal etait le principal moyen d'interaction entre l'homme et l'ordinateur. Meme aujourd'hui, il reste l'outil le plus precis et le plus efficace pour les developpeurs pour controler l'ordinateur.

<TerminalDefinition />

Essentiellement, le terminal est un **environnement d'entree/sortie de flux de caracteres** :

- **Entree** : Envoi d'instructions (signaux caracteres) via le clavier.
- **Sortie** : Affichage de retours textuels via une grille d'ecran.

Il ne traite pas les graphiques complexes, les images ou les videos, mais se concentre sur l'**interaction d'informations textuelles**.

## 2. Architecture centrale : L'art du decouplage (The Big Picture)

Avant d'aller plus loin, posons-nous une question : **Le fenetre du terminal comprend-elle vraiment ce que vous dites ?**

En realite, le terminal est comme un **ecran qui ne fait que transmettre les messages**. Quand vous saisissez la commande `date`, le terminal ne sait pas que cela signifie "afficher la date" — il se contente d'empaqueter les 4 lettres et de les envoyer au veritable patron en coulisses : le **Shell**.

Le Shell est le "cerveau" capable de comprendre votre langage et de diriger l'ordinateur.

Pour comprendre comment ils cooperent, examinons ces trois "travailleurs" aux roles bien definis. La meilleure analogie pour comprendre leur relation est celle du **navigateur** et du **serveur Web**.

### 2.1 Repartition des roles

- **🖥️ Terminal — comme le "navigateur"**
  - **Role** : Il est uniquement responsable de l'**entree** (transmettre vos touches a l'interlocuteur) et de l'**affichage** (dessiner les caracteres renvoyés par l'interlocuteur sur l'ecran).
  - **Caractere** : Il n'a **aucune intelligence propre** et ne comprend pas ce qu'est `ls` ou `cd`. C'est comme le navigateur Chrome — que vous visitiez Google ou Bing, il ne fait que rendre la page Web.
  - _Terminaux courants_ : Fenetre CMD/PowerShell de Windows, Terminal.app de macOS, terminal integre de VS Code.

- **🧠 Shell — comme le "serveur Web"**
  - **Role** : C'est le cerveau logique. Il s'execute en arriere-plan, **recoit** les chaines de commandes que vous envoyez, **interprete** leur signification, puis **ordonne** au systeme d'exploitation d'agir.
  - **Caractere** : Il est invisible et intangible, ne communiquant avec l'exterieur que par des flux textuels.
  - _Shells courants_ : Bash, Zsh, Fish, PowerShell.

- **⚙️ Noyau (Kernel) — le "grand manager" en coulisses**
  - **Role** : Le coeur du systeme d'exploitation. Seul lui peut controler directement le materiel (lecture/ecriture disque, allocation memoire, controle du CPU).
  - **Relation** : Le Shell est le "secretaire" du noyau, traduisant le langage humain pour le noyau.

### 2.2 Pourquoi les separer (Interchangeabilite)

Precisement parce que la **couche de presentation** (terminal) et la **couche logique** (Shell) sont completement separees, elles peuvent etre librement combinees :

- **Changer de "skin"** : Sur macOS, vous pouvez utiliser le Terminal integre, telecharger iTerm2, ou utiliser le terminal de VS Code. Ils ont une apparence differente, mais ils se connectent tous au meme Shell (zsh), donc les commandes sont strictement identiques.
- **Changer de "cerveau"** : Dans la meme fenetre de terminal, vous pouvez passer de bash a zsh ou a l'environnement interactif Python. Le terminal ne change pas, mais la logique de traitement des commandes change.

### 2.3 Flux d'interaction : Les frappes qui disparaissent

Vous pourriez penser : _"Quand j'appuie sur 'a' au clavier, le terminal dessine un 'a' a l'ecran."_
**Faux !** Le veritable processus est le suivant (c'est ce qu'on appelle l'**echo**) :

1.  **Appuyer sur 'a'** : Le signal du clavier est transmis au terminal.
2.  **Envoyer le signal** : Le terminal envoie le code de 'a' au Shell.
3.  **Traitement par le Shell** : Le Shell recoit 'a', juge qu'il n'y a pas de probleme, et renvoie 'a' tel quel au terminal.
4.  **Afficher le caractere** : Le terminal recoit le 'a' renvoye par le Shell et le dessine a l'ecran.

> 💡 **Petite experience** : Certaines commandes (comme lors de la saisie d'un mot de passe) desactivent la fonctionnalite d'echo du Shell. Quand vous appuyez sur une touche, le terminal l'envoie au Shell, mais le Shell **ne renvoie rien**, donc l'ecran reste vide. C'est pour proteger la vie privee.

**Resume en une phrase** :
Vous tapez dans le terminal ➡️ le signal est transmis au Shell ➡️ le Shell le renvoie tel quel (vous voyez le texte) et le comprend ➡️ le Shell ordonne au noyau d'agir.

_La demonstration ci-dessous montre ce processus. Observez le "mur" entre le Shell et le noyau et comment les caracteres font l'aller-retour :_

<ArchitectureDemo />

## 3. Modele visuel : Le systeme de grille (The Grid System)

Contrairement aux interfaces graphiques modernes qui utilisent des "pixels", l'affichage du terminal est base sur une **grille de caracteres (Character Grid)**.
L'ecran du terminal est divise en lignes et colonnes, chaque case s'appelant une **cellule (Cell)**.

### 3.1 Composition d'une cellule

Chaque cellule est la plus petite unite d'affichage du terminal et contient deux types d'informations cles :

1.  **Glyphe (Glyph)** : Le texte effectivement affiche (par ex. `A`, `E`, `$`).
2.  **Attributs (Attributes)** : Le style du caractere (par ex. couleur de premier plan, couleur de fond, gras, souligne).

Quand vous faites glisser la fenetre du terminal pour en changer la taille, vous modifiez essentiellement le **nombre de lignes (Rows)** et le **nombre de colonnes (Columns)** de cette grille.

_Essayez d'interagir dans la zone interactive ci-dessous et observez comment la grille accueille les caracteres :_

<TerminalGrid />

### 3.2 Inspection des styles

Le terminal ne peut pas afficher d'images — toutes les "interfaces" sont realisees par la combinaison de couleurs et de styles de caracteres.

_Cliquez sur une cellule ci-dessous pour voir les attributs de style caches derriere chaque case :_

<CellInspector />

## 4. Protocole de communication : Sequences d'echappement (Escape Sequences)

Vous vous demandez peut-etre : si le terminal ne transmet que du texte, comment sont realises le texte en couleur, le deplacement du curseur et l'effacement de l'ecran ?

La reponse est les **sequences d'echappement**.
Il s'agit d'une chaine de caracteres speciaux (commençant generalement par le caractere `ESC`). Quand le terminal recoit ces caracteres, **il ne les affiche pas a l'ecran**, mais les interprete comme des **instructions de controle**.

Par exemple :

- Caractere normal `A` → Dessine un A a l'ecran.
- Sequence `\033[31m` → **Instruction** : Regler la couleur du texte suivant sur le rouge.
- Sequence `\033[2J` → **Instruction** : Effacer l'ecran.

C'est comme un code convenu avec un ami : si je parle normalement, tu notes ; si je leve la main gauche (equivalent a `ESC`), la phrase suivante est un ordre, pas du contenu.

_Cliquez sur le bouton "Lecture" ci-dessous et observez comment le terminal traite le flux de caracteres un par un et identifie les instructions cachees :_

<EscapeParserDemo />

_Le composant ci-dessous montre plus de types de sequences d'echappement et leurs effets de rendu :_

<EscapeSequences />

## 5. Mecanisme d'entree : Flux d'octets (Input as Byte Stream)

Le processus d'entree est souvent mal compris. Quand vous appuyez sur une touche, le terminal ne "dessine" pas directement le caractere a l'ecran, mais effectue une **transmission codee**.

1.  **Capture de la touche** : Le terminal capture votre action physique sur la touche.
2.  **Conversion d'encodage** : Conversion de la touche en une **sequence d'octets** specifique.
    - Appuyer sur `a` → envoyer l'octet `a`.
    - Appuyer sur `Fleche vers le haut` → envoyer la sequence `^[[A`.
3.  **Transmission** : Envoyer le flux d'octets au Shell ou au programme en cours d'execution.

**Point cle** : Toutes les touches (y compris les touches de fonction et les clics de souris) sont des **donnees d'octets** au niveau de la transmission.

_Essayez de taper une touche ci-dessous et observez comment votre entree est convertie en donnees de bas niveau :_

<InputVisualizer />

## 6. Modes de fonctionnement : Machine a ecrire vs console de jeu (Cooked vs. Raw Mode)

Le terminal a deux personnalites completement differentes. Comprendre cela vous permettra de comprendre pourquoi **saisir des commandes** dans le terminal et **jouer au Snake** sont des experiences completement differentes.

- **Mode Cooked — comme une machine a ecrire**
  - C'est le mode par defaut.
  - **Comportement** : Les caracteres que vous saisissez sont **temporairement retenus** par le terminal jusqu'a ce que vous appuyiez sur la touche Entree.
  - **Avantage** : Cela vous donne la possibilite de corriger. Une erreur de frappe ? Appuyez sur la touche Retour arriere (Backspace) pour effacer et reecrire — le programme ne saura jamais que vous avez fait une erreur auparavant.
  - _Scénario d'utilisation : Saisie de commandes quotidienne (par ex. `ls`, `cd`)._

- **Mode Raw — comme une manette de jeu**
  - C'est le mode "expert".
  - **Comportement** : Chaque touche que vous appuyez (y compris les fleches directionnelles, les combinaisons Ctrl) est **instantanement** envoyee au programme, sans aucun tampon.
  - **Avantage** : Le programme peut reagir en temps reel a vos actions.
  - _Scenario d'utilisation : Jeux en terminal (par ex. Snake), utilisation de l'editeur Vim (un editeur fonctionnant uniquement au clavier)._

_Cliquez sur le bouton ci-dessous pour basculer entre les modes et experimenter la sensation differente entre "ecrire une lettre" et "jouer a un jeu" :_

<CookedRawDemo />

## 7. Controle des processus : Signaux (Signals)

Dans le terminal, appuyer sur `Ctrl+C` permet generalement d'arreter un programme. Ce n'est pas realise en envoyant un caractere, mais en declenchant un **signal (Signal)**.

Les signaux sont un mecanisme de notification au niveau du systeme d'exploitation, informant le programme qu'un evenement specifique s'est produit.

- **Ctrl+C** → Envoie `SIGINT` (Interrupt) : Indique au programme "Veuillez interrompre l'operation en cours".
- **Ctrl+Z** → Envoie `SIGTSTP` (Suspend) : Indique au programme "Veuillez vous mettre en pause et passer en arriere-plan".

Ce mecanisme contourne le canal d'entree de donnees standard, garantissant que l'utilisateur conserve le controle meme lorsque le programme est plante.

<SignalsDemo />

## 8. Application avancee : Interface plein ecran et tampons (Buffers & TUI)

Avez-vous remarque que quand vous editez un fichier avec `vim` ou affichez l'etat du systeme avec `htop`, ils occupent tout l'ecran ? Et quand vous les quittez, l'ecran revient instantanement a son etat precedent, avec l'historique des commandes intact.

C'est parce que le terminal bascule entre deux "toiles" :

- **Tampon principal (Primary Buffer)** — comme un **brouillon**.
  - Vous ecrivez une ligne, le systeme repond par une ligne.
  - Quand c'est plein, on tourne la page (defilement), et ce qui a ete ecrit precedemment reste en haut.
  - _Utilisation : Saisie quotidienne de commandes._

- **Tampon alternatif (Alternate Buffer)** — comme un **tableau noir**.
  - Le programme essuie le tableau et dessine dessus (affichage plein ecran).
  - Quoi qu'il dessine, cela n'affecte pas le brouillon sur votre bureau.
  - Quand vous quittez le programme, c'est comme si on rangeait le tableau — vous vous retrouvez devant votre brouillon.
  - _Utilisation : Vim, Nano, jeux et autres logiciels en plein ecran._

_Cliquez sur le bouton ci-dessous pour experimenter le passage instantane entre "brouillon" et "tableau noir" :_

<BufferSwitchDemo />

---

## 9. Resume (Summary)

Le terminal n'est pas une boite noire mysterieuse — c'est une interface d'interaction textuelle standardisee.

- **Affichage** : Base sur une grille et des caracteres.
- **Controle** : Base sur les sequences d'echappement.
- **Interaction** : Basee sur les flux d'entree/sortie et les signaux.

En comprenant ces principes fondamentaux, vous ne vous contentez plus de memoriser des commandes par coeur, mais vous pouvez veritablement comprendre le flux logique derriere chaque frappe au clavier.

## Annexe : Glossaire (Vocabulary)

| Terme              | Anglais                   | Explication                                               |
| :---------------- | :--------------------- | :------------------------------------------------- |
| **Terminal**          | Terminal               | Programme de fenetre responsable de l'affichage et de l'entree (frontend).                 |
| **Shell**         | Shell                  | Programme responsable de l'interpretation des commandes et de la logique d'execution (backend).             |
| **CLI**           | Command Line Interface | Interface en ligne de commande, un mode d'interaction base sur le texte.               |
| **TUI**           | Text User Interface    | Interface utilisateur textuelle, designant une pseudo-interface graphique construite avec des caracteres dans le terminal. |
| **Sequence d'echappement**      | Escape Sequence        | Instructions de caracteres speciales pour controler le curseur du terminal, les couleurs, etc.           |
| **Entree/Sortie standard** | Stdin/Stdout           | Canaux standard par lesquels les programmes recoivent et emettent des donnees.                 |

## References (Reference)

- [How Terminals Work](https://how-terminals-work.vercel.app/) : La structure et les demonstrations de cet article sont fortement inspirees de ce projet. Si vous souhaitez approfondir les details d'implementation technique, la lecture du tutoriel original est fortement recommandee.
