# Introduction : Gestionnaires de paquets

> 💡 **Guide d'apprentissage** : Pas besoin de reinventer la roue pour ecrire du code — 99 % des fonctionnalites ont deja ete ecrites et publiees sur Internet par quelqu'un d'autre. Le **gestionnaire de paquets** est l'outil qui vous aide a trouver, telecharger et gerer ces "pieces toutes pretes". Ce chapitre s'articule autour d'une question centrale : **Comment rendre les dependances de code reproductibles, collaboratives et maintenables ?**

---

## 0. Motivation et justification : aurez-vous inevitablement besoin d'un gestionnaire de paquets

Imaginez que vous voulez ecrire un programme Node.js qui envoie des requetes HTTP. Deux methodes :

- **Methode A (manuelle)** : Implementer vous-meme la connexion TCP, l'analyse du protocole HTTP, la gestion des redirections, les mecanismes de timeout... probablement des milliers de lignes de code et plusieurs mois de debogage.
- **Methode B (gestionnaire de paquets)** : `npm install axios`, en dix secondes, une seule ligne de code.

Le gestionnaire de paquets est essentiellement l'**"App Store" du code**. Il vous aide a :

1. Trouver les bibliotheques publiees par d'autres dans un registre central (Registry)
2. Les telecharger et les installer automatiquement dans votre projet
3. Gerer les dependances de ces bibliotheques elles-memes (dependances de dependances)
4. Enregistrer la version exacte que vous utilisez pour eviter les problemes en equipe

---

## 1. Apercu des gestionnaires de paquets par ecosysteme

Different langages de programmation et systemes d'exploitation ont leurs propres chaines d'outils, mais la logique sous-jacente est identique.

👇 **Essayez** : Choisissez un ecosysteme que vous connaissez et explorez ses principaux outils de gestion de paquets.

<PackageManagerOverviewDemo />

### 1.1 Ou telecharger les paquets — Le Registry

Derriere chaque ecosysteme se trouve un depot central stockant tous les paquets disponibles :

| Ecosysteme | Registry | Nombre de paquets |
| :--- | :--- | :--- |
| JavaScript | [npmjs.com](https://npmjs.com) | 2M+ |
| Python | [pypi.org](https://pypi.org) | 500K+ |
| Rust | [crates.io](https://crates.io) | 150K+ |
| Go | [pkg.go.dev](https://pkg.go.dev) | 500K+ |
| Outils macOS/Linux | [formulae.brew.sh](https://formulae.brew.sh) | 7000+ |
| Logiciels Windows | [winget.run](https://winget.run) / [chocolatey.org](https://chocolatey.org) | Dizaines de milliers |

### 1.2 Comparaison JavaScript : npm vs yarn vs pnpm

Fonctionnalites similaires, differences principalement en **vitesse et espace disque** :

```text
Espace disque : pnpm (liens physiques partages) < yarn PnP (zero node_modules) < npm (copie complete)
Vitesse d'installation : pnpm ≈ yarn > npm
Usage courant : npm (le plus repandu) > pnpm (recommande pour nouveaux projets) > yarn (certaines equipes)
```

**Recommandation** : Nouveaux projets avec `pnpm`, projets existants conserver l'outil actuel, ne pas changer sans raison.

### 1.3 Comparaison Windows : winget vs Chocolatey vs Scoop

| | winget | Chocolatey | Scoop |
| :--- | :--- | :--- | :--- |
| **Soutien officiel** | Microsoft officiel | Tiers | Tiers |
| **Droits admin requis** | Partiellement | Oui | **Non** |
| **Scenario adapte** | Installation quotidienne | Deploiement en masse en entreprise | Gestion d'outils de developpement |
| **Nombre de paquets** | Nombreux, croissance rapide | Le plus (10000+) | Focus sur outils de dev |

**Recommandation** : Quotidien `winget`, outils de dev `scoop`, automatisation entreprise `Chocolatey`.

---

## 2. Installation de paquets — Que se passe-t-il en coulisses

Apres avoir saisi `npm install axios`, la ligne de commande reste silencieuse quelques secondes puis c'est termine. Que s'est-il passe pendant ces secondes ?

👇 **Essayez** : Choisissez un paquet, cliquez sur "Executer" et observez le processus complet d'installation.

<PackageInstallDemo />

### 2.1 Les quatre etapes en detail

**① Resolution des dependances (Resolve)**

Le gestionnaire comprend d'abord ce qu'il faut installer. Prenons `axios` : il depend lui-meme de `follow-redirects`, `form-data`, etc., qui doivent aussi etre installes. Ce processus s'appelle la **construction de l'arbre de dependances**.

**② Telechargement (Fetch)**

Tous les paquets necessaires sont telecharges depuis le Registry (archives `.tgz`). Un gestionnaire intelligent :
- telecharge plusieurs paquets en parallele plutot que sequentiellement
- verifie d'abord le cache local pour eviter le reseau en cas de correspondance

**③ Liaison (Link)**

Les paquets telecharges sont decompresses et places dans le repertoire `node_modules/`, avec la configuration des references.

**④ Ecriture du fichier de verrouillage (Lockfile)**

Les **versions exactes** de cette installation sont enregistrees dans `package-lock.json` (ou `yarn.lock` / `pnpm-lock.yaml`).

### 2.2 Reference rapide des commandes les plus utilisees

```bash
# ── JavaScript (npm) ──────────────────────────────────
npm install              # Installer toutes les dependances selon package.json
npm install axios        # Installer un nouveau paquet (dependance de production)
npm install -D jest      # Installer une dependance de developpement
npm install -g tsx       # Installation globale (disponible partout)
npm uninstall axios      # Desinstaller un paquet
npm update               # Mettre a jour tous les paquets a la derniere version compatible
npm run build            # Executer un script de package.json
npx create-react-app .   # Execution temporaire, sans installation dans le projet

# ── Python (pip) ──────────────────────────────────────
pip install requests           # Installer un paquet
pip install requests==2.28.0   # Installer une version specifique
pip freeze > requirements.txt  # Exporter la liste des dependances actuelles
pip install -r requirements.txt # Installer selon la liste

# ── Rust (cargo) ──────────────────────────────────────
cargo add serde    # Ajouter une dependance (met a jour automatiquement Cargo.toml)
cargo build        # Compiler le projet
cargo test         # Executer les tests
cargo run          # Executer le projet

# ── Go (go mod) ───────────────────────────────────────
go get github.com/gin-gonic/gin  # Ajouter une dependance
go mod tidy                      # Nettoyer les dependances (supprimer les inutiles, ajouter les manquantes)
go build ./...                   # Compiler

# ── Windows (winget) ──────────────────────────────────
winget install Git.Git           # Installer un logiciel
winget upgrade --all             # Mettre a jour tous les logiciels installes
```

### 2.3 Que sont les npm scripts

Le fichier `package.json` contient un champ `scripts` — c'est le **task runner** integre a npm :

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "jest",
    "lint": "eslint src/"
  }
}
```

Execution : `npm run dev`, `npm run build`. Avantages :
- **Point d'entree unifie** : les membres de l'equipe n'ont pas besoin de memoriser les commandes specifiques des outils sous-jacents
- **Configuration automatique de l'environnement** : `node_modules/.bin` est automatiquement ajoute au PATH lors de l'execution

---

## 3. Installation globale vs locale

L'un des concepts les plus confus pour les debutants.

### 3.1 La difference

```bash
npm install axios        # Locale : dans ./node_modules/, uniquement pour le projet actuel
npm install -g typescript  # Globale : dans un repertoire systeme, disponible partout
```

| | Installation locale | Installation globale |
| :--- | :--- | :--- |
| **Emplacement** | `./node_modules/` | Repertoire systeme (ex : `/usr/local/lib/`) |
| **Adapte pour** | Dependances de projet (axios, vue, react) | Outils CLI (tsc, eslint, create-react-app) |
| **Isolation de version** | Version independante par projet ✅ | Une seule version pour tout le systeme ⚠️ |
| **Coherence d'equipe** | Lockfile garantit la coherence ✅ | Versions potentiellement differentes par personne ⚠️ |

### 3.2 La regle d'or

> **Les dependances de bibliotheque (axios, lodash, vue) sont toujours installees localement ;
> Les outils CLI (tsc, eslint) sont de preference installes localement et appeles avec `npx`.**

**Pourquoi recommander aussi l'installation locale pour les outils CLI ?**

Supposons que vous ayez installe globalement `eslint@8`, mais que le projet A necessite les nouvelles regles de `eslint@9`. Vous devriez alors basculer constamment entre le global et le projet. En installant `eslint` localement et en l'appelant avec `npx eslint .`, chaque projet peut configurer independemment sa propre version.

### 3.3 npx — Execution temporaire sans pollution

`npx` est le runner de paquets integre a npm, vous permettant d'executer un paquet **sans l'installer** :

```bash
# Executer create-vue sans l'installer pour initialiser un projet
npx create-vue my-project

# Formater des fichiers avec prettier sans l'installer
npx prettier --write src/

# Forcer une version specifique (ignorer la version installee)
npx typescript@5.4 tsc --version
```

Le `uvx` de Python et le `cargo run` de Rust offrent egalement des capacites similaires d'"execution temporaire" :

```bash
uvx ruff check .       # Python : execution temporaire du verificateur ruff
cargo install ripgrep  # Rust : installation globale, devient la commande systeme rg
```

---

## 4. Le secret des numeros de version — Versionnement semantique

Dans votre `package.json`, vous verrez peut-etre ceci :

```json
{
  "dependencies": {
    "axios": "^1.6.8",
    "typescript": "~5.4.0"
  }
}
```

Que signifient `^` et `~` ?

👇 **Essayez** : Survolez les differentes parties du numero de version pour comprendre leur signification ; cliquez sur les symboles de plage pour voir quelles versions sont acceptees.

<DependencyTreeDemo />

### 4.1 Pourquoi ne pas fixer completement la version

| Approche | Avantages | Inconvenients |
| :--- | :--- | :--- |
| `"axios": "1.6.8"` (fixe exactement) | Entierement previsible | Les correctifs de securite ne se mettent pas a jour automatiquement |
| `"axios": "^1.6.8"` (plage compatible, recommande) | Obtenir automatiquement les corrections de bugs et nouvelles fonctionnalites | Rarement, peut introduire de petites incompatibilites |
| `"axios": "*"` (n'importe quelle version) | Toujours la derniere | Les montees de version majeure peuvent completement casser le code |

**Bonne pratique** : declarer une plage avec `^` + fixer la version reelle avec un lockfile, utiliser les deux ensemble.

### 4.2 Qu'est-ce que l'enfer des dependances

Quand vous dependez de 50 paquets, chacun dependant de plusieurs autres, l'"arbre de dependances" peut avoir des centaines de noeuds. Si deux paquets dont vous dependez necessitent **des versions incompatibles de la meme bibliotheque**, un "conflit de dependances" apparait.

Solutions par ecosysteme :
- **npm v3+** : meme version majeure partagee au sommet, versions majeures differentes installees separement
- **pnpm** : liens physiques + isolation stricte, empechant fondamentalement les "dependances fantomes" (paquets utilisables mais non declares)
- **cargo (Rust)** : au niveau du langage, impose que chaque paquet ne depende que d'une meme version — conflicts elimines
- **go mod (Go)** : strategie de selection de version minimale (MVS), choisit la version la plus basse satisfaisant toutes les contraintes

---

## 5. Lockfile — La pierre angulaire de la collaboration

### 5.1 Pourquoi un lockfile est-il necessaire

Supposons que `package.json` indique `"axios": "^1.6.0"` :

- Vous installez aujourd'hui → `1.6.8`
- Votre collegue installe demain → possiblement `1.7.0` (publie la nuit derniere)
- Le serveur CI la semaine prochaine → possiblement `1.7.1`

Meme code, trois resultats differents. Le **lockfile** enregistre la version exacte de chaque paquet. Si tout le monde installe selon celui-ci, les resultats sont strictement identiques.

| Scenario | Commande | Comportement |
| :--- | :--- | :--- |
| Synchronisation de l'environnement de dev | `npm install` | Installation en referencant le lockfile, pas de mise a jour |
| CI / deploiement en production | `npm ci` | Installation **strictement** selon le lockfile, erreur immediate en cas de difference |
| Mise a jour proactive | `npm update` | Mise a jour dans la plage autorisee, mise a jour du lockfile |

### 5.2 Le lockfile doit-il etre commite dans Git

**Les applications doivent le commiter, les bibliotheques publiees sur npm peuvent ne pas le faire.**

- ✅ **Applications Web, services backend** : doivent etre commites, garantissant que l'environnement de deploiement et de developpement sont identiques
- ❌ **Bibliotheques publiees sur npm** : generalement non commites, les utilisateurs de la bibliotheque ont leurs propres lockfiles
- ✅ **Projets Python** : `requirements.txt` fonctionne comme un lockfile, doit etre commis
- ✅ **Projets Go** : `go.sum` doit etre commis, utilise pour la verification d'integrite

---

## 6. Environnements virtuels Python

Python a un concept necessitant une attention particuliere : les **environnements virtuels (venv)**.

**Pourquoi est-ce necessaire ?**

Python installe les paquets par defaut **globalement**. Votre projet A necessite `requests==2.28`, le projet B necessite `requests==2.31` — conflit.

**Solution** : Creer un environnement virtuel independant pour chaque projet, sans interference mutuelle.

```bash
# 1. Creer un environnement virtuel (a la racine du projet)
python -m venv .venv

# 2. Activer l'environnement virtuel
source .venv/bin/activate        # macOS / Linux
.venv\Scripts\activate           # Windows (invite de commande CMD)
.venv\Scripts\Activate.ps1       # Windows (PowerShell)

# 3. Apres activation, pip install n'affecte que l'environnement virtuel actuel
pip install requests

# 4. Quitter l'environnement virtuel
deactivate
```

> ⚠️ **Probleme courant sur Windows** : PowerShell interdit par defaut l'execution de scripts, il faut d'abord executer :
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

**Alternatives modernes** :
- `conda create -n myproject python=3.11` — gere meme la version de Python
- `uv venv && source .venv/bin/activate` — ecrit en Rust, creation extremement rapide

**Faut-il commiter `.venv` dans Git ?**

Non ! `.venv` est genere localement et doit etre ajoute a `.gitignore`. Utilisez `requirements.txt` ou `pyproject.toml` pour decrire les dependances.

---

## 7. FAQ — Reference rapide

**Q : Faut-il commiter `node_modules` dans Git ?**

Non ! Generalement plusieurs centaines de Mo, il doit etre ajoute a `.gitignore`. Avec `package-lock.json`, n'importe qui peut reconstruire rapidement avec `npm install`.

**Q : Echec d'installation / erreurs bizarres ?**

```bash
# Vider le cache, supprimer l'ancienne installation, recommencer
npm cache clean --force
rm -rf node_modules package-lock.json   # macOS/Linux
rmdir /s /q node_modules && del package-lock.json  # Windows CMD
npm install
```

**Q : L'installation est trop lente ?**

```bash
# Basculer vers un miroir national (recommande : ecrire dans le fichier .npmrc)
echo "registry=https://registry.npmmirror.com" > .npmrc

# pip peut aussi configurer un miroir
pip install requests -i https://pypi.tuna.tsinghua.edu.cn/simple
```

**Q : Comment gerer les vulnerabilites de securite des paquets ?**

```bash
npm audit          # Scanner les vulnerabilites connues
npm audit fix      # Corriger automatiquement les vulnerabilites compatibles
npm audit fix --force  # Mise a jour forcee (potentiellement destructif, a utiliser avec precaution)
```

**Q : Comment savoir si un paquet est digne de confiance ?**

Verifier sur [npmjs.com](https://npmjs.com) ou [bundlephobia.com](https://bundlephobia.com) :
- Telechargements hebdomadaires (plus = plus credible)
- Derniere mise a jour (prudence si > 2 ans sans mise a jour)
- Nombre de dependances (plus de dependances = plus de risques potentiels)
- Stars GitHub et activite des Issues

**Q : Ou se trouve le logiciel installe avec winget sur Windows ?**

winget installe par defaut dans les repertoires systeme (necessite des droits admin) ou `%LOCALAPPDATA%\Microsoft\WindowsApps`. Les logiciels installes avec Scoop sont reunis dans `%USERPROFILE%\scoop\apps\`, facilitant la gestion et la migration.

---

## 8. Glossaire

| Terme anglais | Traduction | Explication |
| :--- | :--- | :--- |
| **Package** | Paquet / bibliotheque | Module de code ecrit et publie par quelqu'un d'autre |
| **Registry** | Registre / depot | Serveur de stockage central pour tous les paquets (ex : npmjs.com) |
| **Dependency** | Dependance | Autres paquets necessaires au fonctionnement de votre projet |
| **devDependency** | Dependance de developpement | Paquets necessaires uniquement en phase de developpement (frameworks de test, outils de build, etc.) |
| **Lockfile** | Fichier de verrouillage | Enregistre les numeros de version exacts, garantit la coherence de l'environnement |
| **SemVer** | Versionnement semantique | Convention de nommage de version MAJOR.MINOR.PATCH |
| **node_modules** | Repertoire de modules | Repertoire ou les paquets npm sont reellement stockes |
| **venv** | Environnement virtuel | Bac a sable d'isolation de paquets independant pour projets Python |
| **tarball** | Archive compressee | Format de distribution des paquets, generalement fichier `.tgz` |
| **Hoisting** | Remontee | npm remonte les sous-dependances au sommet pour eviter les installations en double |
| **Phantom Dependency** | Dependance fantome | Paquets utilisables sans etre declares dans le fichier de configuration (pnpm peut les empecher) |
| **npx** | — | Runner de paquets integre a npm, execute temporairement un paquet sans l'installer |
| **go.sum** | — | Fichier de verification de hachage du module Go, empeche la falsification des dependances |
| **Crate** | — | Nom de l'unite "paquet" dans l'ecosysteme Rust |
| **winget** | — | Gestionnaire de paquets officiel de Windows (integre dans Windows 10/11) |

---

## Resume : L'essence du gestionnaire de paquets

Quatre phrases pour retenir l'essentiel :

1. **Gestionnaire de paquets = App Store** : vous aide a trouver, installer et gerer des pieces de code sans reinventer la roue.
2. **Lockfile = contrat d'equipe** : fixe les versions exactes et rend "Ca marche chez moi" chose du passe.
3. **Versionnement semantique = langage de communication** : `^` obtient securitairement les mises a jour, attention quand MAJOR change.
4. **Local > Global** : les dependances de projet sont de preference installees localement, les outils executes temporairement avec `npx` / `uvx` pour garder un environnement propre.
