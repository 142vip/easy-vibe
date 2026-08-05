# Fondamentaux : Système d'exploitation Linux

::: tip Avant-propos
**Dans le monde des serveurs, Linux est le protagoniste absolu.** Plus de 90 % des serveurs dans le monde fonctionnent sous Linux. De WeChat que vous utilisez chaque jour aux recherches Google, tout repose sur Linux. Pour un développeur, maîtriser les bases de Linux n'est pas une option — c'est un prérequis indispensable.
:::

**Que allez-vous apprendre dans cet article ?**

À l'issue de ce chapitre, vous maîtriserez :

- **Système de fichiers** : comprendre la structure des répertoires Linux et la philosophie « tout est fichier »
- **Commandes courantes** : maîtriser les commandes essentielles de manipulation de fichiers, traitement de texte et gestion de processus
- **Modèle de permissions** : comprendre les concepts d'utilisateurs, de groupes et de permissions
- **Bases du Shell** : connaître les concepts clés du Shell : tubes, redirections, variables d'environnement
- **Compétences pratiques** : apprendre les fondamentaux de l'exploitation : consultation de journaux, investigation de processus, diagnostic réseau

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Système de fichiers | Structure des répertoires, tout est fichier |
| **Chapitre 2** | Commandes courantes | Fichiers, texte, processus, réseau |
| **Chapitre 3** | Modèle de permissions | Utilisateurs, groupes, rwx, sudo |
| **Chapitre 4** | Bases du Shell | Tubes, redirections, variables, scripts |
| **Chapitre 5** | Scénarios pratiques | Investigation de journaux, diagnostic de performance |

---

## 1. Système de fichiers : tout est fichier

L'une des philosophies les plus fondamentales de Linux est que **tout est fichier**. Les fichiers ordinaires sont des fichiers, les répertoires sont des fichiers, les disques durs sont des fichiers, et même les connexions réseau et les informations sur les processus sont des fichiers. Cette abstraction unifiée vous permet d'utiliser un même ensemble d'outils (lecture, écriture, contrôle des permissions) pour opérer sur quasiment toutes les ressources système.

<LinuxFileSystemDemo />

### Aide-mémoire de la structure des répertoires

Imaginez le système de fichiers Linux comme un arbre inversé :

```
/                    ← Répertoire racine (la racine de l'arbre)
├── home/            ← Répertoire personnel des utilisateurs (vos fichiers sont ici)
├── etc/             ← Fichiers de configuration (le « panneau de paramètres » du système)
├── var/             ← Données variables (journaux, cache)
├── usr/             ← Programmes installés par l'utilisateur
├── tmp/             ← Fichiers temporaires (disparaissent au redémarrage)
├── proc/            ← Informations sur les processus (virtuel, n'occupe pas de disque)
├── dev/             ← Fichiers de périphériques (disques durs, terminaux)
├── bin/             ← Commandes de base (ls, cp, mv)
├── sbin/            ← Commandes d'administration système (nécessite root)
├── opt/             ← Logiciels tiers
└── root/            ← Répertoire personnel de l'utilisateur root
```

### Les deux types de chemins

| Type | Format | Exemple | Description |
|------|------|------|------|
| Chemin absolu | Commence par `/` | `/home/alice/code/app.js` | Part de la racine, sans ambiguïté |
| Chemin relatif | Commence par le répertoire courant | `./code/app.js` ou `../config` | `.` est le répertoire courant, `..` est le répertoire parent |

::: tip La puissance du « tout est fichier »
Vous voulez connaître les informations du CPU ? Lisez un fichier : `cat /proc/cpuinfo`
Vous voulez connaître l'utilisation de la mémoire ? Lisez un fichier : `cat /proc/meminfo`
Vous voulez générer un nombre aléatoire ? Lisez un fichier : `cat /dev/urandom`
Vous voulez ignorer une sortie ? Écrivez dans un fichier : `echo "no thanks" > /dev/null`

Pas besoin d'API dédiée, lire et écrire des fichiers suffit. C'est l'élégance de la philosophie Unix.
:::

---

## 2. Commandes courantes

Les commandes Linux suivent un format unifié : `commande [options] [arguments]`. Par exemple, dans `ls -la /home`, `ls` est la commande, `-la` sont les options et `/home` est l'argument.

<LinuxCommandDemo />

### Les 10 commandes les plus utilisées

Si vous ne deviez retenir que 10 commandes, retenez celles-ci :

| Commande | Usage | Moyen mnémotechnique |
|------|------|----------|
| `ls` | Lister les fichiers | list |
| `cd` | Changer de répertoire | change directory |
| `cat` | Afficher un fichier | concatenate |
| `grep` | Rechercher du texte | global regular expression print |
| `find` | Trouver des fichiers | tout simplement find |
| `ps` | Voir les processus | process status |
| `tail -f` | Suivre un journal en temps réel | Voir la « queue » du fichier, -f pour follow |
| `chmod` | Modifier les permissions | change mode |
| `curl` | Envoyer des requêtes HTTP | client URL |
| `ssh` | Connexion distante | secure shell |

### L'art de combiner les commandes

La puissance de Linux ne réside pas dans chaque commande individuelle, mais dans la **combinaison des commandes**. En utilisant le tube `|` pour chaîner des commandes simples, on résout des problèmes complexes :

```bash
# Trouver les 5 processus consommant le plus de CPU
ps aux --sort=-%cpu | head -6

# Compter les types d'erreurs les plus fréquents dans les journaux
grep "ERROR" app.log | awk '{print $4}' | sort | uniq -c | sort -rn | head -10

# Trouver les fichiers de plus de 100 Mo
find / -size +100M -type f 2>/dev/null

# Surveiller en temps réel les erreurs dans les journaux
tail -f /var/log/app.log | grep --color "ERROR"
```

::: tip Philosophie Unix
« Faire une seule chose, mais bien la faire. » Chaque commande ne gère qu'une seule fonction. En les combinant via des tubes, on réalise des opérations complexes. C'est pourquoi les commandes Linux sont courtes — ce sont des briques, pas des couteaux suisses.
:::

---

## 3. Modèle de permissions

Linux est un système multi-utilisateurs. Le modèle de permissions en est la pierre angulaire de la sécurité. Chaque fichier possède trois groupes de permissions, contrôlant respectivement ce que peuvent faire le **propriétaire (Owner)**, le **groupe (Group)** et les **autres (Others)**.

### Comprendre la sortie de `ls -l`

```bash
$ ls -l app.js
-rwxr-xr-- 1 alice developers 2048 Jan 15 10:30 app.js
│├──┤├──┤├──┤   │     │          │
│ │   │   │     │     │          └── Taille du fichier
│ │   │   │     │     └── Groupe
│ │   │   │     └── Propriétaire
│ │   │   └── Permissions des autres : r-- (lecture seule)
│ │   └── Permissions du groupe : r-x (lecture + exécution)
│ └── Permissions du propriétaire : rwx (lecture + écriture + exécution)
└── Type de fichier : - fichier ordinaire, d répertoire, l lien
```

### Les trois types de permissions

| Permission | Lettre | Nombre | Signification pour un fichier | Signification pour un répertoire |
|------|------|------|-------------|-------------|
| Lecture | `r` | 4 | Consulter le contenu du fichier | Lister le contenu du répertoire (ls) |
| Écriture | `w` | 2 | Modifier le contenu du fichier | Créer/supprimer des fichiers dans le répertoire |
| Exécution | `x` | 1 | Exécuter le programme/le script | Entrer dans le répertoire (cd) |

<LinuxPermissionsDemo />

### Calcul rapide des permissions numériques

Les trois nombres représentent respectivement les permissions d'Owner, Group et Others. Chaque nombre est la somme de r(4) + w(2) + x(1) :

```
chmod 755 script.sh
  7 = rwx (4+2+1)  → Propriétaire : lecture + écriture + exécution
  5 = r-x (4+0+1)  → Groupe : lecture + exécution
  5 = r-x (4+0+1)  → Autres : lecture + exécution
```

| Permissions courantes | Signification | Usage typique |
|---------|------|---------|
| `644` | rw-r--r-- | Fichier ordinaire (propriétaire en écriture, autres en lecture seule) |
| `755` | rwxr-xr-x | Fichier/répertoire exécutable |
| `600` | rw------- | Fichier confidentiel (comme les clés SSH) |
| `777` | rwxrwxrwx | Lecture/écriture/exécution pour tous (dangereux, à éviter) |

### sudo : obtenir temporairement les privilèges super-utilisateur

Les utilisateurs ordinaires ont des permissions limitées. Certaines opérations nécessitent les droits root. `sudo` vous permet d'exécuter temporairement une commande en tant que root :

```bash
# Un utilisateur ordinaire ne peut pas modifier la configuration système
$ vim /etc/nginx/nginx.conf
# Permission denied

# Utiliser sudo pour une élévation temporaire de privilèges
$ sudo vim /etc/nginx/nginx.conf
# Saisir votre mot de passe pour pouvoir modifier

# Passer en utilisateur root (à utiliser avec précaution)
$ sudo su -
```

::: warning Principe du moindre privilège
N'utilisez jamais `chmod 777` pour résoudre un problème de permissions — c'est l'équivalent de détruire la serrure de votre porte. La bonne approche consiste à déterminer précisément qui a besoin de quelles permissions et à les accorder de manière ciblée. De même, ne travaillez pas longtemps en tant que root ; utilisez `sudo` uniquement lorsque c'est nécessaire.
:::

---

## 4. Bases du Shell

Le Shell est l'« interprète » entre vous et le noyau Linux. Vous saisissez des commandes, le Shell les interprète et les transmet au noyau pour exécution. Les Shells les plus courants sont **Bash** (par défaut sur la plupart des distributions Linux) et **Zsh** (par défaut sur macOS).

### Tubes et redirections

Ce sont les deux fonctionnalités les plus puissantes du Shell :

| Symbole | Nom | Rôle | Exemple |
|------|------|------|------|
| `|` | Tube (pipe) | Envoyer la sortie d'une commande comme entrée de la suivante | `cat log | grep ERROR` |
| `>` | Redirection de sortie | Écrire la sortie dans un fichier (écrase) | `echo "hello" > file.txt` |
| `>>` | Redirection en ajout | Ajouter la sortie à la fin du fichier | `echo "world" >> file.txt` |
| `<` | Redirection d'entrée | Lire l'entrée depuis un fichier | `wc -l < file.txt` |
| `2>` | Redirection d'erreur | Écrire les messages d'erreur dans un fichier | `cmd 2> error.log` |
| `2>&1` | Fusion des sorties | Fusionner les erreurs et la sortie standard | `cmd > all.log 2>&1` |

### Variables d'environnement

Les variables d'environnement sont les « configurations globales » du Shell, influençant le comportement des commandes :

```bash
# Afficher toutes les variables d'environnement
env

# Consulter une variable spécifique
echo $PATH
echo $HOME

# Définir temporairement (uniquement dans le Shell courant)
export API_KEY="abc123"

# Définir de manière permanente (écrire dans le fichier de configuration)
echo 'export API_KEY="abc123"' >> ~/.bashrc
source ~/.bashrc   # Appliquer la configuration immédiatement
```

| Variable courante | Signification | Exemple de valeur |
|---------|------|--------|
| `$PATH` | Chemins de recherche des commandes | `/usr/local/bin:/usr/bin:/bin` |
| `$HOME` | Répertoire personnel de l'utilisateur | `/home/alice` |
| `$USER` | Nom de l'utilisateur courant | `alice` |
| `$PWD` | Répertoire de travail courant | `/var/log` |
| `$SHELL` | Shell actuellement utilisé | `/bin/bash` |

### Introduction aux scripts Shell

Écrire plusieurs commandes dans un fichier constitue un script Shell. C'est le point de départ de l'automatisation de l'exploitation :

```bash
#!/bin/bash
# deploy.sh - Script de déploiement simple

APP_DIR="/opt/myapp"
LOG_FILE="/var/log/deploy.log"

echo "$(date) - Début du déploiement..." >> $LOG_FILE

# Récupérer le dernier code
cd $APP_DIR && git pull origin main

# Installer les dépendances
npm install --production

# Redémarrer le service
pm2 restart myapp

echo "$(date) - Déploiement terminé" >> $LOG_FILE
```

```bash
# Donner les permissions d'exécution au script et le lancer
chmod +x deploy.sh
./deploy.sh
```

::: tip Astuce de débogage de scripts
Ajoutez `set -ex` au début du script : `-e` fait en sorte que le script s'arrête immédiatement en cas d'erreur (au lieu de continuer), `-x` affiche chaque commande exécutée (utile pour le diagnostic). Ces deux options sont quasiment incontournables dans les scripts de production.
:::

---

## 5. Scénarios pratiques

La théorie est terminée. Voyons maintenant quelques scénarios pratiques que les développeurs rencontrent le plus souvent.

### 5.1 Investigation des journaux

Quand un service pose problème, le premier réflexe est de consulter les journaux. Voici les techniques courantes d'investigation :

```bash
# 1. Suivre les journaux en temps réel (le plus courant)
tail -f /var/log/app/error.log

# 2. Rechercher les erreurs sur une période donnée
grep "2024-01-15 14:" error.log | grep "ERROR"

# 3. Compter le nombre d'erreurs par heure
grep "ERROR" app.log | awk '{print substr($1,1,13)}' | uniq -c

# 4. Afficher les 100 dernières lignes du journal
tail -100 app.log

# 5. Rechercher dans plusieurs fichiers de journalisation
grep -r "OutOfMemory" /var/log/app/
```

### 5.2 Investigation des processus

Application bloquée, pic CPU, fuite mémoire — ces problèmes nécessitent d'investiger au niveau des processus :

```bash
# Voir les processus consommant le plus de CPU
ps aux --sort=-%cpu | head -10

# Voir les processus consommant le plus de mémoire
ps aux --sort=-%mem | head -10

# Trouver un processus spécifique
ps aux | grep "node"

# Voir les détails d'un processus (y compris les threads)
top -Hp <PID>

# Voir les fichiers ouverts par un processus
lsof -p <PID>

# Terminer un processus proprement (SIGTERM)
kill <PID>

# Forcer la terminaison (SIGKILL, en dernier recours)
kill -9 <PID>
```

### 5.3 Diagnostic réseau

Un service est injoignable ? Déterminez d'abord s'il s'agit d'un problème réseau ou applicatif :

```bash
# Tester l'accessibilité de la cible
ping -c 4 google.com

# Vérifier si un port est ouvert
telnet db-server 3306
# Ou avec nc
nc -zv db-server 3306

# Voir les ports en écoute sur la machine locale
ss -tlnp
# ou
netstat -tlnp

# Vérifier la résolution DNS
dig api.example.com
nslookup api.example.com

# Tester une interface HTTP
curl -v http://localhost:3000/health

# Voir les statistiques des connexions réseau
ss -s
```

### 5.4 Investigation de l'espace disque

Un disque plein est l'un des incidents les plus fréquents en production :

```bash
# Voir l'utilisation de chaque partition
df -h

# Trouver les répertoires occupant le plus d'espace
du -sh /* 2>/dev/null | sort -rh | head -10

# Affiner la recherche dans les gros répertoires
du -sh /var/log/* | sort -rh | head -10

# Trouver les gros fichiers (>100 Mo)
find / -type f -size +100M 2>/dev/null | head -20

# Nettoyer les occupations d'espace courantes
# Nettoyer les anciens journaux
sudo journalctl --vacuum-size=500M
# Nettoyer les images Docker inutilisées
docker system prune -a
```

::: tip Formule mnémotechnique pour l'investigation en production
**« D'abord les journaux, ensuite les processus, puis le réseau, enfin le disque »**. 90 % des problèmes en production peuvent être diagnostiqués par ces quatre étapes. Une fois ce réflexe acquis, l'efficacité du dépannage augmente considérablement.
:::

---

## Résumé

Linux est une compétence indispensable pour les développeurs. Maîtriser les bases permet de faire face à la plupart des scénarios quotidiens de développement et d'exploitation.

Passons en revue les points clés de ce chapitre :

1. **Tout est fichier** : Linux unifie l'accès aux ressources matérielles, aux processus et au réseau via l'abstraction fichier
2. **Combinaison de commandes** : chaque commande a une fonction simple, c'est leur combinaison via les tubes `|` qui révèle leur véritable puissance
3. **Modèle de permissions** : Owner/Group/Others x Read/Write/Execute, paramétrable rapidement en notation numérique (ex : 755)
4. **Bases du Shell** : tubes, redirections, variables d'environnement et scripts sont les fondations de l'automatisation
5. **Investigation pratique** : journaux → processus → réseau → disque, quatre étapes pour diagnostiquer la plupart des problèmes en production

## Pour aller plus loin

- [Pages de manuel Linux](https://man7.org/linux/man-pages/) - Documentation officielle des man pages Linux
- [The Linux Command Line](https://linuxcommand.org/tlcl.php) - Livre gratuit d'initiation à la ligne de commande Linux
- [Linux Journey](https://linuxjourney.com/) - Site d'apprentissage interactif de Linux
- [explainshell.com](https://explainshell.com/) - Saisissez une commande et obtenez automatiquement l'explication de chaque paramètre
