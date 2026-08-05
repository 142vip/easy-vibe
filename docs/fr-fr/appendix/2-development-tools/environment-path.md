# Introduction : Variables d'environnement et PATH

> 💡 **Guide d'apprentissage** : Chaque fois que vous saisissez `git` ou `python` dans le terminal, le systeme doit trouver ou se trouve ce programme. Chaque fois que votre code appelle une API de grand modele linguistique, le programme doit savoir quelle cle utiliser. Derriere ces deux taches se cache le meme mecanisme — les **variables d'environnement**.

---

## 0. Chaque programme emporte avec lui un ensemble de configurations

Chaque programme en cours d'execution possede un ensemble de configurations "cle=valeur" appelees **variables d'environnement**. Le programme peut lire ces configurations a tout moment pour connaitre l'environnement d'execution actuel.

Cliquez sur n'importe quelle variable dans la liste ci-dessous pour "consulter" sa valeur dans le terminal :

<EnvVarOverviewDemo />

---

## 1. PATH : Comment le Shell trouve les commandes que vous saisissez

`PATH` est une variable d'environnement speciale qui stocke une liste de chemins de repertoires (separes par des deux-points). Lorsque vous saisissez `git`, le Shell parcourt ces repertoires dans l'ordre pour trouver un fichier executable nomme `git` — il s'arrete des qu'il trouve le premier.

```bash
$ echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

Selectionnez une commande et observez le processus de recherche repertoire par repertoire du Shell :

<PathSearchDemo />

**Trois regles cles** :
- Plus un repertoire est vers le debut du PATH, plus sa priorite est elevee
- La recherche s'arrete au premier trouve, sans continuer
- Si aucun repertoire ne contient le programme → `command not found`

---

## 2. Motivation et justification : faut-il redemarrer le terminal apres l'installation d'un outil

Lors de l'installation d'outils comme nvm, Homebrew ou conda, le script d'installation ajoute automatiquement une ligne a `~/.zshrc` pour inclure son propre repertoire dans le PATH :

```bash
# Contenu ecrit automatiquement par le script d'installation (exemple)
export PATH="/usr/local/opt/python@3.12/bin:$PATH"
```

Cette ligne de code n'est executee qu'au **demarrage d'un nouveau Shell**. Les fenetres de terminal deja ouvertes ne sont pas affectees, donc :

```bash
# Egalement efficace sans redemarrage
source ~/.zshrc
```

**Situations frequentes avec les outils de developpement IA** :

```bash
# Ollama / pipx affichent command not found apres l'installation
which ollama          # Trouver l'emplacement reelle de l'installation

# Chemin des outils CLI installes via pip (a ajouter au PATH)
# macOS : ~/Library/Python/3.x/bin
# Linux : ~/.local/bin
export PATH="$PATH:$HOME/.local/bin"

# Recommande : installer les outils CLI avec pipx, gere le PATH automatiquement
pipx install aider-chat
```

---

## 3. Portee des variables : Qui peut voir cette variable

Les variables d'environnement ne sont pas diffusees a tous les programmes — chaque processus detient sa **propre copie**, heritee du processus parent. Modifier sa propre copie n'affecte pas le processus parent.

Le diagramme ci-dessous montre trois niveaux. Exportez une nouvelle variable au "niveau utilisateur" et verifiez si elle apparait au "niveau processus" :

<EnvScopeDemo />

---

## 4. export : Determine si un processus enfant peut lire cette variable

Lors de la definition d'une variable, ajouter ou non `export` fait une difference fondamentale :

<EnvExportDemo />

Pour qu'une variable persiste entre les sessions, ecrivez la commande `export` dans un fichier de configuration :

```bash
# macOS (zsh)
echo 'export MY_VAR="value"' >> ~/.zshrc
source ~/.zshrc       # Effectif immediatement, pas besoin de redemarrer le terminal

# Linux (bash)
echo 'export MY_VAR="value"' >> ~/.bashrc
source ~/.bashrc
```

---

## 5. Cles API : Ne doivent jamais etre ecrites dans le code

Lorsque vous appelez des API comme OpenAI, Anthropic ou DeepSeek, la cle est votre "piece d'identite + carte de credit". Si elle est divulgue, d'autres peuvent utiliser votre quota et les frais sont a votre charge.

L'erreur la plus courante est d'ecrire la cle directement dans le code :

<ApiKeyDangerDemo />

---

## 6. Developpement local : Gerer les cles avec un fichier .env

En developpement local, stockez les cles dans un fichier `.env` a la racine du projet. Le code les lit via la bibliotheque dotenv. `.env` doit imperativement etre ajoute a `.gitignore` et ne jamais etre commite dans Git.

Ecrivez la configuration a gauche et lisez-la a droite — changez de langue pour voir deux approches differentes :

<DotEnvDemo />

---

## 7. Environnement de production : Laisser la plateforme d'execution injecter les cles

`.env` est un outil de commodite pour la phase de developpement. Sur les serveurs et les plateformes cloud, c'est l'**environnement d'execution** qui doit etre responsable de l'injection des cles — le code lui-meme ne doit pas savoir ou les cles sont stockees :

<ServerSecretDemo />

---

## 8. Resolution de problemes en pratique

### `command not found`

```bash
# Etape 1 : Verifier si le programme est dans le PATH
which python3         # Une sortie signifie qu'il a ete trouve

# Etape 2 : Trouver l'emplacement reel du programme (macOS)
brew list python | grep bin

# Etape 3 : Ajouter le repertoire au PATH
export PATH="/chemin/trouve:$PATH"
source ~/.zshrc       # Apres avoir ecrit dans le fichier de configuration, executer source
```

### Deux versions installees, mais ce n'est pas celle voulue qui est utilisee

```bash
which python
# /usr/bin/python ← Ancienne version systeme, plus haut dans le PATH

# Placer le repertoire de la nouvelle version en debut de PATH
export PATH="/usr/local/bin:$PATH"

which python
# /usr/local/bin/python ← Nouvelle version, maintenant prioritaire
```

### La variable est bien definie mais le programme ne la lit pas

| Cause | Solution |
|:---|:---|
| Oubli de `export` | Ajouter `export` et reessayer |
| Modification de `~/.zshrc` sans effet | `source ~/.zshrc` |
| Utilisation de `.env` mais dotenv non installe | `pip install python-dotenv` / `npm install dotenv` |
| Sur le serveur, effectif uniquement dans la session SSH | Utiliser `EnvironmentFile` de systemd a la place |

---

## Glossaire

| Terme | Signification |
|:---|:---|
| **PATH** | Stocke la liste des repertoires ou le Shell recherche les fichiers executables, separes par des deux-points, l'ordre determine la priorite |
| **export** | Marque une variable comme transmissible, les processus enfants recoivent automatiquement une copie au demarrage |
| **source** | Re-execute un fichier de configuration dans le Shell actuel, rendant les modifications immediatement effectives |
| **which** | Affiche le chemin du fichier executable correspondant a une commande (resultat de la recherche dans le PATH) |
| **.env** | Fichier de configuration local du projet, stocke les cles de developpement, doit imperativement etre ajoute a `.gitignore` |
| **.env.example** | Modele avec des noms de variables complets mais des valeurs vides, peut etre commite securitairement dans Git |
| **chmod 600** | Permissions de fichier : seul le proprietaire peut lire et ecrire, adapte pour proteger les fichiers de cles |
| **Secret Scanner** | Fonctionnalite des plateformes comme GitHub qui scanne automatiquement les fuites de cles et notifie le fournisseur pour les revoquer |
