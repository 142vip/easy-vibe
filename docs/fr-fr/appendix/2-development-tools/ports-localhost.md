# Principes : Ports et mécanismes de localhost

> 💡 **Guide d'apprentissage** : Lorsque vous exécutez `npm run dev` et que le terminal affiche `http://localhost:5173`, vous êtes-vous déjà demandé : qu'est-ce que `localhost` ? Que représente `5173` ? Pourquoi obtient-on parfois l'erreur `EADDRINUSE` ? Ce chapitre va expliquer en profondeur ces concepts que vous voyez tous les jours en développement mais que vous n'avez jamais vraiment approfondis.

Avant de commencer, il est conseillé de poser deux « briques de base » :

- **Bases réseau** : si vous n'êtes pas très familier avec les concepts d'adresse IP et de HTTP, vous pouvez d'abord consulter la partie [Fondamentaux de l'informatique - Communication réseau](../1-computer-fundamentals/network-fundamentals.md).
- **Bases du terminal** : si vous n'êtes pas encore à l'aise avec la ligne de commande, vous pouvez d'abord consulter [Ligne de commande et scripts Shell](./command-line-shell.md).

---

## 0. Introduction : qu'est-ce que ce fameux `localhost:5173` qu'on voit tous les jours

<DevServerFlowDemo />

Le quotidien de chaque développeur est indissociable de cette ligne de sortie :

```
➜  Local:   http://localhost:5173/
```

Mais vous êtes-vous déjà demandé ce que cache cette courte ligne ? Elle contient plusieurs concepts clés :

- **http://** → protocole de communication (dans quelle langue dialoguer)
- **localhost** → adresse cible (qui contacter)
- **:5173** → numéro de port (une fois trouvé, à quelle porte frapper)

Comprendre ces trois éléments vous permettra de résoudre 90 % des problèmes réseau en environnement de développement. Décortiquons-les un par un.

---

## 1. Présentation et définition : un port (L'IP est l'immeuble, le port est le numéro d'appartement)

### 1.1 Une analogie intuitive

Imaginez un serveur comme un immeuble :

- **L'adresse IP** (par exemple `192.168.1.100`) est l'adresse de l'immeuble — elle vous dit « dans quel immeuble aller ».
- **Le numéro de port** (par exemple `:80`) est le numéro d'appartement dans l'immeuble — il vous dit « dans quelle pièce entrer ».

Un immeuble peut abriter simultanément un restaurant (pièce 80), un café (pièce 443), un bureau (pièce 22). De même, un ordinateur peut exécuter simultanément un serveur web, une base de données et un service SSH, chacun occupant un port différent.

👇 **Essayez par vous-même** :
Cliquez sur les « plaques de porte » ci-dessous pour simuler une connexion vers différents ports. Observez ce qui se passe lorsque le port est « ouvert » (un programme écoute) et lorsqu'il est « fermé ».

<PortAnalogyDemo />

### 1.2 Plage de valeurs des numéros de port

Un numéro de port est un entier compris entre **0 et 65535** (soit 65536 ports au total). Cette plage est divisée en trois intervalles :

| Intervalle | Plage | Usage | Exemples |
| :--- | :--- | :--- | :--- |
| **Ports système** | 0 – 1023 | Réservés aux protocoles standards, les utilisateurs ordinaires ne peuvent pas les occuper librement | 80 (HTTP), 443 (HTTPS), 22 (SSH) |
| **Ports enregistrés** | 1024 – 49151 | Attribués aux applications courantes | 3306 (MySQL), 5432 (PostgreSQL), 6379 (Redis) |
| **Ports dynamiques** | 49152 – 65535 | Attribués temporairement par le système d'exploitation | Quand le navigateur envoie une requête, le système attribue aléatoirement un port source |

> Pourquoi votre serveur de développement aime-t-il utiliser 3000, 5173, 8080 ? Parce que ces numéros sont dans la plage des « ports enregistrés », ne nécessitent pas de privilèges administrateur pour écouter et entrent rarement en conflit avec les services système.

### 1.3 Référence rapide des ports courants en développement

👇 **Essayez par vous-même** :
Saisissez un numéro de port ou un nom de service pour rechercher, cliquez sur une ligne pour afficher des exemples d'utilisation.

<CommonPortsDemo />

---

## 2. Qu'est-ce que localhost (Se chercher soi-même)

### 2.1 Le concept central de « boucle locale »

`localhost` est un nom de domaine spécial qui pointe toujours vers **votre propre ordinateur**.

Lorsque vous saisissez `http://localhost:3000` dans votre navigateur, voici ce qui se passe :

1. Le navigateur demande au système d'exploitation : « Quelle est l'IP de `localhost` ? »
2. Le système d'exploitation répond directement : « `127.0.0.1` » (pas besoin de consulter le DNS en ligne)
3. Le paquet de données est envoyé vers `127.0.0.1`, mais **ne quitte jamais vraiment la machine**
4. Le système d'exploitation fait « rebondir » le paquet via l'**interface de boucle locale (loopback interface)**
5. Le programme qui écoute sur le port 3000 reçoit la requête et renvoie la réponse

**Tout le processus ne passe par aucun câble réseau, aucun routeur et ne nécessite aucune connexion Internet.**

👇 **Essayez par vous-même** :
Cliquez sur « Envoyer la requête » pour observer le parcours complet du paquet de données. Cliquez ensuite sur les « cartes alias » ci-dessous pour découvrir les différentes écritures de localhost et leurs différences.

<LocalhostLoopbackDemo />

### 2.2 `localhost` vs `127.0.0.1` vs `0.0.0.0`

Ces trois concepts sont souvent confondus, mais leurs significations sont complètement différentes :

| Écriture | Signification | Qui peut accéder |
| :--- | :--- | :--- |
| `localhost` / `127.0.0.1` | Adresse de boucle locale, uniquement la machine locale | Seulement votre propre ordinateur |
| `0.0.0.0` | Écoute sur toutes les interfaces réseau | Machine locale + autres appareils du réseau local |
| `192.168.x.x` | IP du réseau local | Appareils du réseau local |

**Scénarios pratiques** :

```bash
# Seul vous-même pouvez accéder (sécurisé, adapté au développement)
npm run dev -- --host localhost

# Le téléphone peut aussi accéder (adapté au débogage mobile)
npm run dev -- --host 0.0.0.0
```

> De nombreux frameworks (comme Vite, Next.js) écoutent par défaut sur `localhost`, donc votre téléphone ne peut pas accéder même connecté au même WiFi. Vous voulez déboguer sur mobile ? Ajoutez le paramètre `--host`.

---

## 3. Conflit de ports : le problème le plus courant en environnement de développement

### 3.1 Pourquoi y a-t-il conflit

**Un port ne peut être écouté que par un seul programme à la fois.** C'est comme un appartement qui ne peut être occupé que par une seule famille.

Si vous essayez de démarrer un deuxième service sur le même port, vous verrez cette erreur classique :

```
Error: listen EADDRINUSE :::3000
```

Traduit en langage humain : **« L'appartement n°3000 est déjà occupé, vous ne pouvez pas entrer ! »**

Scénarios de conflit courants :
- Le serveur de développement précédent n'a pas été correctement arrêté et tourne encore en arrière-plan
- Deux projets différents utilisent le même port par défaut
- Un service système occupe déjà le port que vous voulez utiliser

👇 **Essayez par vous-même** :
Essayez de démarrer plusieurs fois le service dans le simulateur ci-dessous. En cas de conflit de port, comparez les différentes approches entre le « démarrage direct » et le « démarrage intelligent ».

<PortConflictDemo />

### 3.2 Diagnostic et résolution

Face à un conflit de port, la procédure de diagnostic est très standardisée :

**macOS / Linux :**
```bash
# Étape 1 : voir qui occupe le port 3000
lsof -i :3000

# Étape 2 : une fois le PID obtenu, forcer l'arrêt
kill -9 <PID>
```

**Windows :**
```bash
# Étape 1 : voir qui occupe le port 3000
netstat -ano | findstr :3000

# Étape 2 : terminer le processus
taskkill /PID <PID> /F
```

> De nombreux frameworks modernes (Vite, Create React App, etc.) demandent automatiquement « Voulez-vous changer de port ? » en cas de conflit. Mais comprendre le principe sous-jacent vous aide à diagnostiquer plus rapidement les problèmes complexes que les frameworks ne peuvent pas résoudre pour vous.

---

## 4. La « Same-Origin Policy » et le cross-origin en développement

### 4.1 Qu'est-ce qu'une « origine »

Le navigateur a un mécanisme de sécurité appelé **Same-Origin Policy (politique de même origine)** : seules les ressources ayant exactement le même **protocole, nom de domaine et port** sont considérées comme de « même origine ».

| Adresse A | Adresse B | Même origine ? | Raison |
| :--- | :--- | :--- | :--- |
| `http://localhost:5173` | `http://localhost:5173/about` | ✅ Même origine | Protocole, domaine et port identiques |
| `http://localhost:5173` | `http://localhost:3000` | ❌ Origine différente | **Port différent** (5173 vs 3000) |
| `http://localhost:5173` | `https://localhost:5173` | ❌ Origine différente | **Protocole différent** (http vs https) |

### 4.2 Pourquoi la séparation frontend/backend rencontre-t-elle forcément le cross-origin

Quand l'architecture de votre projet est :

```
Frontend (Vite)   →  http://localhost:5173
Backend (Express) →  http://localhost:3000
```

La page frontend est chargée depuis `:5173`, puis utilise `fetch('/api/users')` pour appeler l'API sur `:3000` — **les ports sont différents, la restriction cross-origin se déclenche !**

**Deux solutions courantes :**

**Solution 1 : configurer CORS côté backend**
```javascript
// Backend Express
app.use(cors({ origin: 'http://localhost:5173' }))
```

**Solution 2 : configurer un proxy côté frontend (recommandé)**
```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
}
```

Le principe du proxy : laisser le serveur de développement Vite « transférer » les requêtes pour vous. Le navigateur croit communiquer avec `:5173` (même origine), mais en réalité Vite transmet discrètement la requête à `:3000` en coulisses.

---

## 5. Diagnostic pratique : les trois problèmes les plus fréquents

👇 **Essayez par vous-même** :
Choisissez un problème que vous avez déjà rencontré et suivez les étapes de diagnostic. Vous pouvez cliquer sur « Exécuter » à chaque étape pour voir le résultat.

<PortTroubleshootDemo />

---

## 6. Glossaire

| Terme anglais | Correspondance | Explication |
| :--- | :--- | :--- |
| **Port** | Port | Un nombre entre 0 et 65535, utilisé pour distinguer les différents services réseau sur une même machine. Chaque service « écoute » un port, en attente de connexions client. |
| **localhost** | Hôte local | Un nom de domaine spécial, pointant toujours vers la machine locale (127.0.0.1). Utilisé pour accéder aux services exécutés sur la machine locale sans connexion réseau. |
| **Loopback Interface** | Interface de boucle locale | Interface réseau virtuelle du système d'exploitation. Les paquets envoyés à 127.0.0.1 ne quittent pas la machine mais sont « renvoyés » via cette interface. |
| **EADDRINUSE** | Adresse déjà utilisée | Erreur signalée par Node.js / le système d'exploitation, indiquant que le port que vous voulez écouter est déjà occupé par un autre programme. |
| **CORS** | Partage de ressources cross-origin | Mécanisme de sécurité du navigateur. Quand une page frontend tente d'appeler une API d'une origine différente (protocole/domaine/port différents), le backend doit donner une autorisation explicite. |
| **Same-Origin Policy** | Politique de même origine | Pierre angulaire de la sécurité du navigateur : seules les requêtes de même protocole, même domaine et même port peuvent communiquer librement, bloquant la lecture de données cross-origin. |
| **Proxy** | Proxy | En environnement de développement, le serveur proxy transfère les requêtes au backend à la place du navigateur, contournant les restrictions de même origine du navigateur. |
| **0.0.0.0** | Toutes les interfaces | Quand un service écoute sur 0.0.0.0, il accepte les connexions provenant de n'importe quelle interface réseau (machine locale, réseau local, etc.). |
| **Well-known Ports** | Ports bien connus | Terme collectif pour les ports 0-1023, réservés aux protocoles standards comme HTTP (80), HTTPS (443), SSH (22). |
| **PID** | ID de processus | Numéro unique attribué par le système d'exploitation à chaque programme en cours d'exécution, utilisé pour gérer et terminer les processus. |
| **lsof** | Lister les fichiers ouverts | Commande macOS/Linux pour voir quel processus occupe un port donné (`lsof -i :numéro_port`). |
| **HMR** | Hot Module Replacement | Fonctionnalité du serveur de développement : quand vous modifiez le code, le navigateur se met à jour automatiquement sans rafraîchissement manuel. Le mécanisme sous-jacent utilise WebSocket pour notifier le navigateur. |

---

## Résumé

Les ports et localhost sont les concepts les plus fondamentaux et les plus fréquents en environnement de développement :

- **Port** = le « numéro d'appartement » qui distingue les différents services sur une machine (0-65535)
- **localhost** = l'adresse spéciale « se chercher soi-même » (127.0.0.1), les données ne quittent pas la machine
- La nature du **conflit de port** est qu'« une seule plaque peut être accrochée à une porte »
- La nature du **cross-origin** est que « port différent = origine différente », nécessitant CORS ou un proxy pour résoudre

Retenez ces quatre phrases, et vous pourrez rapidement identifier la cause de la plupart des problèmes réseau que vous rencontrez en environnement de développement.