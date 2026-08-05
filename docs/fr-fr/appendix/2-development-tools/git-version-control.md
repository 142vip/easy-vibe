# Principes : Gestion de versions avec Git

> 💡 **Guide d'apprentissage** : Ce chapitre est destine a ceux qui n'ont jamais utilise Git. Nous ne vous ferons pas memoriser des commandes des le depart, mais nous clarifierons d'abord "quel probleme Git resout pour vous", puis nous relierons les commandes et les concepts etape par etape. Apres lecture, vous serez capable de committer localement, de creer des branches et de pousser vers GitHub de maniere autonome.

---

## 0. D'abord une question : Avez-vous deja vecu ces cauchemars

**Scenario 1 : L'enfer des versions**

Vous redigez un memoire ou ecrivez du code, et a mi-chemin vous realisez une erreur. Vous voulez revenir a la version d'il y a trois jours — mais elle a disparu.

```
Projet_v1.zip
Projet_v2_modifie.zip
Projet_v3_final.zip
Projet_v3_final_vraiment_final.zip
Projet_v3_final_jur_plus_jamais.zip
```

A chaque nouvelle copie sauvegardee, le disque dur devient de plus en plus chaotique, et vous ne vous souvenez plus de ce qui a ete modifie dans quelle version.

**Scenario 2 : Le cauchemar de la collaboration**

Vous et un collegue modifiez le meme fichier en meme temps :
- Vous modifiez la ligne 10 et ajoutez une fonctionnalite de connexion
- Votre collegue modifie la ligne 10 et corrige un bug
- Vous vous echangez le code par email, et lors de la fusion, les modifications de l'un sont ecrasees par celles de l'autre
- Personne ne sait quel code est le bon

**Scenario 3 : Pas de "pilule de regret"**

Vous avez deploye du nouveau code en production, et un bug apparait. Vous voulez revenir d'urgence a la derniere version stable — mais vous ne savez pas comment revenir en arriere et cherchez frenetiquement une sauvegarde.

---

**Git a ete cree precisement pour resoudre ces trois problemes.**

Git est un **systeme de controle de version** (Version Control System). Son essence : **enregistrer chacune de vos operations de "sauvegarde" pour former une timeline historique complete, vous permettant de revenir a n'importe quel point historique a tout moment.**

Sans exageration, Git est l'un des outils les plus importants du developpement logiciel moderne. Presque toutes les entreprises et tous les projets open source l'utilisent.

---

## 1. Git et GitHub sont-ils la meme chose

Beaucoup de debutants confondent ces deux concepts. Clarifions d'abord :

| | Git | GitHub |
| :--- | :--- | :--- |
| **Quoi** | Un outil de controle de version qui s'execute sur votre ordinateur | Un site Web hebergeant des depots Git (cloud) |
| **Ou** | Sur votre ordinateur local | Sur Internet |
| **Utilisable independamment** | ✅ Oui, gere uniquement l'historique local | ❌ Doit etre utilise avec Git |
| **Analogie** | Votre journal intime local | Le cloud pour stocker votre journal |

En resume : **Git est l'outil, GitHub est le service d'hebergement.** Comme Word est l'outil et OneDrive le cloud, les deux s'utilisent ensemble mais ne sont pas la meme chose.

Outre GitHub, des services similaires incluent GitLab, Gitee (national), etc.

---

## 2. Concept cle : Les trois zones

C'est la conception la plus importante de tout Git. Comprendre ces trois zones, c'est comprendre l'ame de Git.

Git divise l'etat de vos fichiers en trois niveaux :

**Repertoire de travail (Working Directory)**
C'est votre **dossier normal**. Tous les fichiers que vous voyez et editez actuellement s'y trouvent. Modifiez comme vous le souhaitez — Git detectera vos modifications mais ne fera aucun enregistrement.

**Zone de transit (Staging Area / Index)**
C'est un **relayage de "preparation au commit"**. Vous pouvez "placer" les fichiers du repertoire de travail que vous souhaitez sauvegarder dans la zone de transit, comme mettre des colis dans un carton — pas encore expedie, mais vous avez deja choisi ce qu'il faut envoyer.

**Depot (Repository)**
C'est le **depot d'historique permanent**, cache dans le dossier `.git`. Chaque fois que vous executez `git commit`, le contenu de la zone de transit est scelle dans le depot, formant un enregistrement historique immuable.

👇 **Essayez** : Cliquez sur les boutons de commande dans l'ordre et observez comment les fichiers circulent entre les trois zones.

<GitCommitFlow />

### Motivation et justification : un "processus en deux etapes" (add + commit)

Beaucoup de debutants demandent : pourquoi ne pas simplement sauvegarder en un clic, au lieu de faire d'abord `add` puis `commit` ?

**Parce qu'en developpement reel, vous ne voulez souvent pas committer toutes vos modifications en une fois.**

Exemple : vous avez modifie 5 fichiers aujourd'hui :
- `login.js` : fonctionnalite de connexion terminee (voulez committer)
- `style.css` : style de la page de connexion ajuste (voulez committer)
- `debug.log` : sortie de debogage temporaire (**ne voulez PAS committer**)
- `experiment.js` : nouvelle fonctionnalite en test, pas encore terminee (**ne voulez PAS committer**)
- `todo.txt` : vos notes personnelles (**ne voulez PAS committer**)

Sans zone de transit, vous devez soit committer les 5 fichiers (historique de commits desordonne), soit n'en committer aucun.

Avec la zone de transit, vous pouvez controler precisement : `git add login.js style.css` place uniquement ces deux fichiers dans le carton, puis `commit`, et ce commit enregistre clairement "fonctionnalite de connexion terminee".

---

## 3. Premiere utilisation de Git : Initialisation et workflow de base

### 3.1 Installation et initialisation

Apres avoir installe Git (inclus sur macOS, telecharger depuis git-scm.com pour Windows), ouvrez le terminal et accedez au dossier de votre projet :

```bash
# Initialiser un depot Git dans le dossier courant
git init

# Git cree un dossier cache .git ; tout l'historique y est stocke
# Sortie : Initialized empty Git repository in .../your-project/.git/
```

Lors de la premiere utilisation, vous devez egalement indiquer a Git qui vous etes (ces informations seront jointes a chaque commit) :

```bash
git config --global user.name "Votre nom"
git config --global user.email "votre@email.com"
```

### 3.2 Workflow quotidien : Trois etapes de sauvegarde

Apres l'initialisation, 90 % des operations quotidiennes de developpement consistent a repeter ces trois etapes :

**Etape 1 : Verifier le statut**

```bash
git status
```

C'est la commande la plus utilisee. Elle vous indique :
- Sur quelle branche vous vous trouvez
- Quels fichiers ont ete modifies (rouge = non stage)
- Quels fichiers sont dans la zone de transit (vert = stage, en attente de commit)

**Etape 2 : Placer les fichiers dans la zone de transit**

```bash
# Ajouter un seul fichier
git add login.js

# Ajouter plusieurs fichiers
git add login.js style.css

# Ajouter tous les fichiers modifies du dossier courant (. signifie "tout")
git add .
```

> ⚠️ Erreur courante de debutant : `git add .` est tres pratique mais ajoute egalement tous les fichiers temporaires que vous ne voulez pas committer. Prenez l'habitude d'ajouter precisement ou utilisez `.gitignore` pour exclure les fichiers non souhaites (explique plus loin).

**Etape 3 : Committer et ecrire une description**

```bash
git commit -m "feat: ajout de la fonctionnalite de connexion utilisateur"
```

Le contenu entre guillemets apres `-m` s'appelle le **message de commit** (commit message). Il est destine a votre futur vous et a vos collegues — redigez-le de maniere significative.

### 3.3 Comment rediger des messages de commit professionnels

```bash
# ❌ Redaction inutile — on ne comprend pas ce qui a ete fait
git commit -m "update"
git commit -m "fix"
git commit -m "quelques modifications"

# ✅ Bonne redaction : type + deux-points + description en une phrase
git commit -m "feat: ajout de la fonctionnalite de connexion utilisateur"
git commit -m "fix: correction de l'ecran blanc sur la page d'accueil dans iOS Safari"
git commit -m "docs: mise a jour des instructions de deploiement dans le README"
git commit -m "refactor: separation de UserService en module independant"
git commit -m "style: unification de l'indentation du code a 2 espaces"
```

**Signification des prefixes courants :**

| Prefixe | Signification |
| :--- | :--- |
| `feat:` | Nouvelle fonctionnalite (feature) |
| `fix:` | Correction de bug |
| `docs:` | Modification de documentation |
| `style:` | Ajustement du formatage du code (sans impact fonctionnel) |
| `refactor:` | Refactorisation du code (fonctionnalite inchangee, structure optimisee) |
| `chore:` | Build, outils, dependances |
| `test:` | Lie aux tests |

Avec cette habitude, en consultant l'historique quelques mois plus tard, vous saurez en un coup d'oeil ce que chaque commit a fait. C'est particulierement important en travail d'equipe.

### 3.4 Consulter l'historique

```bash
# Format detaille (informations completes de chaque commit)
git log

# Format compact (une ligne par commit, recommande pour l'usage quotidien)
git log --oneline

# Exemple de sortie :
# a1b2c3d (HEAD -> main) feat: ajout de la fonctionnalite de connexion utilisateur
# 9f3e1b2 init: initialisation du projet
```

---

## 4. Univers paralleles : Les branches (Branch)

**Les branches** sont la fonctionnalite la plus puissante mais aussi la plus deroutante de Git pour les debutants. Mais une fois comprise, vous decouvrirez que ce design est tres elegant.

### 4.1 Qu'est-ce qu'une branche Comprendre avec les "univers paralleles"

Imaginez que vous jouez a un jeu de role avec un choix cle :
- Choix A : Affronter le grand boss (developper une nouvelle fonctionnalite)
- Choix B : Maintenir la situation actuelle (la ligne principale reste inchangee)

Si vous faites directement le choix A sur la sauvegarde principale et echouez, toute la progression du jeu est detruite.

Mais si vous **copiez la sauvegarde** et affrontez le boss dans la copie :
- Victoire ? Fusionnez les resultats de la copie dans la sauvegarde principale
- Defaite ? La sauvegarde principale n'est pas affectee ; supprimez la copie et reessayez

**Les branches Git sont exactement ce mecanisme de "copie de sauvegarde".**

Dans Git, la branche `main` (ou `master`) est votre "sauvegarde principale", qui doit toujours rester stable et utilisable. Pour developper une nouvelle fonctionnalite, vous creez une nouvelle branche a partir de main, developpez et testez la-bas, puis fusionnez dans main une fois termine.

### 4.2 Demonstration visuelle des branches

👇 **Essayez** : Cliquez sur les boutons de commande dans l'ordre et observez comment le diagramme de branches ci-dessous se divise, s'etend et fusionne finalement. Portez une attention particuliere a la position du label HEAD — il indique toujours "ou vous etes actuellement".

<GitBranchVisual />

### 4.3 Operations sur les branches en detail

**Creer et basculer vers une nouvelle branche :**

```bash
# Methode 1 : Creer d'abord, puis basculer (deux etapes)
git branch feature-login      # Creer la branche
git checkout feature-login    # Basculer

# Methode 2 : En une seule etape (recommande)
git checkout -b feature-login

# Sortie : Switched to a new branch 'feature-login'
```

Apres la creation d'une branche, l'invite de commande affiche le nom de la branche actuelle :
```
user@mac ~/project (feature-login) $
```

**Afficher toutes les branches :**

```bash
git branch

# Sortie (* indique la branche actuelle) :
# * feature-login
#   main
```

**Developper normalement sur la branche :**

```bash
# Sur la branche feature-login : modifier le code, add, commit — exactement comme d'habitude
git add login.js
git commit -m "feat: ajout de la structure HTML du formulaire de connexion"

git add login.js api.js
git commit -m "feat: connexion a l'API de connexion terminee"
```

Ces commits n'existent que sur la branche `feature-login` — la branche `main` ne sait rien de ce que vous avez fait.

**Revenir a la branche principale et fusionner :**

```bash
# Revenir a main
git checkout main

# Fusionner toutes les modifications de feature-login
git merge feature-login

# Apres la fusion, vous pouvez supprimer cette branche (optionnel)
git branch -d feature-login
```

### 4.4 Quand faut-il creer une branche

| Scenario | Recommandation | Raison |
| :--- | :--- | :--- |
| Developper une nouvelle fonctionnalite | ✅ Creer une branche | N'affecte pas la ligne principale avant completion ; peut etre abandonnee a tout moment |
| Corriger un bug urgent en production | ✅ Creer une branche `hotfix-xxx` depuis main | Fusion directe apres correction, sans inclure de fonctionnalites inachevees |
| Developpement parallele avec des collegues | ✅ Chacun sa branche | Sans interference mutuelle ; fusion via Pull Request apres completion |
| Corriger une simple faute de frappe | ❌ Modifier directement sur main | Risque extremement faible, pas besoin de branche supplementaire |

### 4.5 Strategies de branchement courantes en equipe

Dans les projets reels, l'equipe convient generalement de la nomenclature et de l'usage des branches :

| Nom de branche | Usage | Caracteristique |
| :--- | :--- | :--- |
| `main` / `master` | Code stable pour la production | Seul le code ayant passe les tests peut y entrer ; pas de push direct |
| `dev` / `develop` | Branche d'integration quotidienne | Toutes les branches de fonctionnalite fusionnent d'abord ici, puis vont sur main apres les tests |
| `feature/xxx` | Developpement de fonctionnalite specifique | Par ex. `feature/user-login` ; fusionne dans dev apres completion |
| `hotfix/xxx` | Correction urgente | Cree depuis main ; fusionne directement dans main et dev apres correction |

---

## 5. Collaborer avec l'equipe : Le depot distant

Jusqu'a present, vous n'avez appris que des operations Git **locales** — tout l'historique est stocke uniquement sur votre ordinateur. Pour partager du code avec vos collegues, vous avez besoin d'un **depot distant**, c'est-a-dire un stockage cloud comme GitHub ou GitLab.

### 5.1 Principe de fonctionnement du depot distant

Le depot distant peut etre compris comme un **"sauvegarde commune" de l'equipe** :

- Chacun ecrit du code localement et committe
- Apres completion, `push` (telecharger) vers le depot distant
- Les collegues `pull` (telecharger) les derniers contenus du depot distant vers leur local
- Ainsi le code de tout le monde reste synchronise

👇 **Essayez** : Cliquez sur les commandes dans l'ordre pour vivre le processus complet de l'association au depot distant, du push et du pull des mises a jour des collegues.

<GitSyncDemo />

### 5.2 Premier push d'un projet vers GitHub

**Etape 1** : Creer un nouveau depot sur GitHub (cliquez sur + en haut a droite -> New repository), ne pas cocher les options d'initialisation.

**Etape 2** : Retourner au terminal local et associer le depot distant :

```bash
# Associer le depot local avec le depot GitHub
# "origin" est l'alias du depot distant, le nom conventionnel (modifiable mais pas necessaire)
git remote add origin https://github.com/utilisateur/nom-du-depot.git

# Confirmer que l'association a reussi
git remote -v
# Sortie :
# origin  https://github.com/utilisateur/nom-du-depot.git (fetch)
# origin  https://github.com/utilisateur/nom-du-depot.git (push)
```

**Etape 3** : Pousser le contenu local vers le distant :

```bash
# Premier push ; -u signifie "par defaut, pousser vers la branche main d'origin lors des futurs git push"
git push -u origin main

# Ensuite, pour chaque push :
git push
```

### 5.3 Commandes de collaboration quotidienne

**Pousser (vous avez modifie quelque chose et voulez que les collegues le voient) :**
```bash
git push
```

**Tirer (les collegues ont modifie quelque chose et vous voulez synchroniser) :**
```bash
git pull
```

`git pull` est en realite la combinaison de deux commandes :
1. `git fetch` : telecharger les derniers commits du depot distant
2. `git merge` : fusionner le contenu telecharge dans la branche actuelle

**Recuperer pour la premiere fois le projet de quelqu'un d'autre sur GitHub :**
```bash
# Copier entierement le depot distant en local (a faire une seule fois)
git clone https://github.com/quelquun/un-projet.git

# clone cree automatiquement l'association avec le distant, ensuite push/pull suffisent
```

### 5.4 Direction de push et pull

```
Votre ordinateur (depot local)  ←→  GitHub (depot distant)

git push :  local → distant   (vous avez modifie quelque chose, telechargez pour les collegues)
git pull :  distant → local   (les collegues ont modifie quelque chose, telechargez chez vous)
git clone : distant → local   (premiere copie complete du depot)
```

> **Bonne pratique** : Avant de commencer a travailler chaque jour, faites `git pull` pour obtenir le dernier code ; en fin de journee ou apres avoir termine une fonctionnalite, faites `git push` pour sauvegarder et partager vos progres avec les collegues.

---

## 6. Avance : Gerer les conflits

Les conflits sont inevitables en collaboration, mais ils ne sont pas si effrayants.

### 6.1 Comment les conflits se produisent-ils

Quand vous et un collegue **modifiez simultanement la meme ligne du meme fichier**, Git ne sait pas quelle version utiliser lors de la fusion, et un conflit apparait.

Exemple :
- Vous avez ecrit dans la ligne 5 de `login.js` : `const timeout = 3000`
- Votre collegue a ecrit en meme temps sur la meme ligne : `const timeout = 5000`
- Lors d'un `git pull` ou `git merge`, Git detecte cette contradiction et "met en pause" pour vous dire : "Je ne peux pas decider, choisissez."

### 6.2 A quoi ressemble un fichier en conflit

Git insere des marqueurs speciaux aux endroits en conflit :

```javascript
function login() {
  const url = '/api/login'

 <<<<<<< HEAD
  const timeout = 3000   // Votre version
 =======
  const timeout = 5000   // Version du collegue
 >>>>>>> feature/update-timeout

  return fetch(url, { timeout })
}
```

- Entre `<<<<<<< HEAD` et `=======` : le contenu de votre branche actuelle
- Entre `=======` et `>>>>>>> xxx` : le contenu a fusionner

### 6.3 Comment resoudre un conflit

**Etape 1** : Ouvrir le fichier en conflit et trouver tous les marqueurs `<<<<<<<` (generalement les editeurs comme VS Code les surlignent automatiquement)

**Etape 2** : Decider quel code conserver, puis editer manuellement le fichier en supprimant tous les symboles de marquage (`<<<<<<<`, `=======`, `>>>>>>>`).

Exemple : decision d'utiliser 5000 (version du collegue) :
```javascript
function login() {
  const url = '/api/login'
  const timeout = 5000   // Adopter la modification du collegue
  return fetch(url, { timeout })
}
```

**Etape 3** : Committer a nouveau

```bash
# Marquer le conflit comme resolu
git add login.js

# Terminer le commit de fusion (Git genere automatiquement un message de commit de fusion)
git commit
```

### 6.4 Bonnes habitudes pour reduire les conflits

- **Tirer frequemment** : Synchroniser le dernier code avant de commencer a travailler, pour eviter de "trop prendre de retard"
- **Petits commits** : Ne pas accumuler une semaine de code pour un seul commit ; des commits frequents et de petite taille facilitent la detection et la resolution des conflits
- **Isolation des branches** : Differentes fonctionnalites dans differentes branches, reduisant la competition sur les memes lignes
- **Communication** : Prevenir les collegues avant de modifier des fichiers partages (par ex. `config.js`)

---

## 7. Reference rapide des commandes

<GitCommandCheatsheet />

---

## 8. Pratique : Processus complet pour rejoindre un projet d'equipe

C'est le processus standard lorsque vous rejoignez une nouvelle equipe ou un nouveau projet — vous pouvez le copier directement :

```bash
# ① Jour 1 : Cloner le projet en local (une seule fois)
git clone https://github.com/team/project.git
cd project

# ② Debut de chaque journee de travail : d'abord tirer le dernier code
git pull origin main

# ③ Creer sa propre branche de fonctionnalite (ne pas modifier directement main)
git checkout -b feature/user-profile

# ④ Developpement normal... ecrire du code...

# ⑤ Apres avoir termine un petit point de fonctionnalite, committer immediatement (ne pas accumuler)
git add src/UserProfile.vue
git commit -m "feat: fonctionnalite d'upload de photo de profil terminee"

git add src/UserProfile.vue src/api/user.js
git commit -m "feat: connexion API d'edition de profil terminee"

# ⑥ Pousser sa branche sur le distant pour que les collegues puissent la voir
git push origin feature/user-profile

# ⑦ Creer une Pull Request (PR) sur GitHub, demandant la fusion dans main
# (cette etape se fait sur la page Web de GitHub)

# ⑧ Attendre le code review des collegues, modifier selon les retours, continuer commit + push

# ⑨ Apres fusion de la PR, retourner sur main, mettre a jour le local, supprimer la branche de fonctionnalite
git checkout main
git pull
git branch -d feature/user-profile
```

---

## 9. .gitignore : Quels fichiers ne doivent pas etre suivis

Certains fichiers ne doivent **pas** etre committer dans le depot Git :
- `node_modules/` : dependances, tres volumineux, regenerable avec `npm install`
- `.env` : fichier de variables d'environnement, peut contenir des mots de passe de base de donnees et des cles API — **ne jamais uploader dans un depot public**
- `*.log` : fichiers de log
- `.DS_Store` : fichier cache genere automatiquement par macOS
- `dist/`, `build/` : artefacts de build, reconstruisables

Creez un fichier `.gitignore` a la racine du projet et ecrivez les regles pour les fichiers a ne pas suivre :

```gitignore
# Dependances
node_modules/

# Variables d'environnement (important ! les mots de passe ne doivent pas etre commit)
.env
.env.local

# Artefacts de build
dist/
build/

# Fichiers systeme
.DS_Store
Thumbs.db

# Logs
*.log
```

GitHub propose des modeles .gitignore pour differentes langues et frameworks : [github.com/github/gitignore](https://github.com/github/gitignore)

---

## Glossaire

| Terme | Anglais | Explication |
| :--- | :--- | :--- |
| **Depot** | Repository (Repo) | Base de donnees stockant tout l'historique des versions du projet, dans le dossier `.git` |
| **Commit** | Commit | Un enregistrement de version complet, comme un point de sauvegarde de jeu, avec description et horodatage |
| **Branche** | Branch | Ligne de developpement independante, comme des timelines paralleles sans influence mutuelle |
| **Fusion** | Merge | Integrer les modifications d'une branche dans une autre |
| **Conflit** | Conflict | La meme ligne de code modifiee par plusieurs personnes, Git ne sait pas quelle version choisir, resolution manuelle necessaire |
| **Staging** | Stage / Index | Placer les modifications dans la liste "preparation au commit" |
| **Distant** | Remote | Copie cloud du depot (GitHub / GitLab / Gitee) |
| **Clonage** | Clone | Copier integralement le depot distant en local |
| **Push** | Push | Telecharger les commits locaux vers le depot distant |
| **Pull** | Pull | Telecharger les derniers contenus distants et les fusionner localement |
| **HEAD** | HEAD | Pointeur vers la branche/le commit actuel, indiquant "ou vous etes" |
| **origin** | origin | Alias par defaut du depot distant (nom conventionnel) |
| **stash** | Stash | Sauvegarde temporaire des modifications non encore committees, utilise pour changer de tache |
| **PR / MR** | Pull Request / Merge Request | Demande de fusion de votre branche dans la branche principale, generalement avec review de l'equipe |
