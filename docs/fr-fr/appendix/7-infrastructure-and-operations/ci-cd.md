# Introduction : Automatisation CI/CD
::: tip 🎯 Question centrale
**Le code fonctionne parfaitement en local, mais comment le rendre accessible au monde entier ?**
:::

---

## 1. Motivation et justification : faut-il « mettre en ligne un service »

Imaginez que vous avez préparé un festin chez vous, absolument délicieux. Le problème, c'est que seule votre famille peut en profiter. Les voisins, les passants, les inconnus n'y ont pas accès.

Que faire ? Il faut **apporter les plats au restaurant**. C'est exactement ce que signifie « mettre en ligne un service » — transférer votre code, depuis votre ordinateur personnel, vers un « ordinateur public » allumé 24h/24 et 7j/7. Ainsi, toute personne disposant d'un accès Internet peut visiter votre site.

<DeploymentOverviewDemo />

La mise en ligne d'un service implique de nombreuses étapes. Tout comme ouvrir un restaurant ne se résume pas à servir des plats, il faut louer un local, l'aménager, obtenir les permis, embaucher du personnel, etc. Développer un site web suit la même logique. Du code au site web accessible par les utilisateurs, il y a de nombreuses étapes intermédiaires : construction, déploiement, configuration réseau, sécurité, etc.

Je vais décomposer l'ensemble du processus pour vous. Chaque étape sera expliquée en détail, de manière à ce que même les débutants absolus puissent comprendre.

---

## 2. Construction : transformer le code en un « artefact de build transportable »

### 2.1 Pourquoi construire

Les débutants demandent souvent : le code est écrit, pourquoi ne pas le mettre directement sur le serveur pour que les utilisateurs y accèdent ?

Pour répondre à cette question, il faut d'abord comprendre le format du code que vous écrivez. Vous utilisez peut-être des frameworks comme Vue, React, Express, Koa, etc. Ces frameworks ont un point commun : **ils ne sont pas directement utilisables par le navigateur ou le serveur**.

Par exemple, lorsque vous écrivez du code Vue, vous utilisez des balises comme `<template>` et `<script setup>`. Cette syntaxe n'est reconnue que par Vue. Le navigateur ne la comprend pas du tout. Le navigateur ne reconnaît que trois langages : HTML (structure de la page), CSS (style de la page) et JavaScript (logique de la page). La syntaxe des composants Vue est du charabia pour le navigateur.

Il faut donc faire quelque chose d'essentiel avant de mettre le code sur le serveur : **le traduire dans un langage que le navigateur peut comprendre**. Ce processus de traduction s'appelle la « construction » (Build).

### 2.2 Que fait concrètement la construction

La construction ne se limite pas à la traduction. Elle effectue également de nombreuses optimisations pour que le site soit plus rapide et plus économe en ressources. Voici en détail ce qu'elle fait :

**Étape 1 : Résolution des dépendances**

Lorsque vous écrivez du code, vous utilisez diverses bibliothèques tierces comme Vue, Vue Router, Axios, Vite, etc. Il est impossible de demander aux utilisateurs de les télécharger depuis npm à chaque fois — ce serait trop lent. L'outil de construction analyse le code, identifie toutes les dépendances, puis les « empaquette » ensemble.

**Étape 2 : Compilation et transpilation**

C'est l'étape la plus importante. Les composants Vue sont compilés en HTML et JavaScript. Le SASS/LESS est compilé en CSS. La syntaxe ES6+ est convertie en code ES5 plus compatible. Une fois cette étape terminée, le code passe d'un « format lisible par le développeur » à un « format exécutable par la machine ».

**Étape 3 : Minification et obfuscation**

La minification consiste à supprimer tous les espaces, les retours à la ligne et les commentaires. Les noms de variables sont raccourcis : par exemple, `userName` devient `a`, `calculateTotalPrice` devient `b`. La taille des fichiers est ainsi considérablement réduite, ce qui accélère le téléchargement pour l'utilisateur. Le code obfusqué est pratiquement illisible pour un humain, ce qui offre aussi une certaine « protection du code ».

**Étape 4 : Découpage du code (Code Splitting)**

Vous avez peut-être écrit 10 pages, chacune avec son propre code. Mais l'utilisateur peut n'en visiter qu'une seule. Pourquoi devrait-il télécharger le code des 9 autres pages ? L'outil de construction divise le code en plusieurs blocs. L'utilisateur ne télécharge que le code de la page qu'il visite. C'est le « chargement à la demande », qui améliore considérablement la vitesse de premier accès.

**Étape 5 : Génération des empreintes (Hash)**

C'est une étape très importante mais souvent négligée. Après la construction, les noms de fichiers deviennent quelque chose comme `app.abc123.js` ou `vendor.def456.css`. La chaîne alphanumérique à la fin s'appelle un « hash » (empreinte).

Le hash a un rôle clé : lorsque le code est modifié, la valeur du hash change. Le navigateur sait alors que « ce fichier a changé, il faut le retélécharger ». Les fichiers inchangés continuent d'être servis depuis le cache. Cela garantit à la fois que l'utilisateur voit toujours la dernière version du code et que le cache est utilisé au maximum pour améliorer la vitesse.

<DeploymentBuildDemo />

### 2.3 Comment exécuter la construction

La plupart des projets front-end modernes ont déjà un outil de construction configuré. Il suffit de retenir une commande :

```bash
# Avec npm
npm run build

# Avec yarn
yarn build

# Avec pnpm
pnpm build
```

Après l'exécution, cherchez un dossier nommé `dist` à la racine du projet (parfois appelé `build` ou `.output`). Il contient tous les fichiers construits. Ce sont les fichiers qu'il faut envoyer sur le serveur. Ils ne nécessitent aucune modification supplémentaire — il suffit de les copier sur le serveur.

### 2.4 Que contient le résultat de la construction

En ouvrant le dossier dist, vous trouverez principalement trois types de fichiers :

- **Fichiers HTML** : généralement `index.html`. C'est le point d'entrée. C'est le premier fichier chargé par le navigateur.
- **Fichiers JS** : tout le code JavaScript. Il peut y en avoir un ou plusieurs.
- **Fichiers CSS** : tout le code de style. Il peut être intégré au HTML ou se trouver dans des fichiers CSS séparés.

Pour les projets backend plus complexes (comme Node.js), le résultat de la construction peut être un fichier exécutable ou une image Docker. Mais le principe est le même : transformer le code dans un format directement exécutable par le serveur.

---

## 3. Serveur : trouver une « maison » qui ne ferme jamais

### 3.1 Qu'est-ce qu'un serveur exactement

Beaucoup de gens entendent le mot « serveur » et imaginent un équipement mystérieux et sophistiqué. En réalité, ce n'est pas si compliqué. **Un serveur est un ordinateur**. Un ordinateur qui ne s'éteint jamais et qui est toujours connecté à Internet.

Certaines personnes demandent : je n'ai déjà un ordinateur chez moi, pourquoi dépenser pour louer un serveur ?

C'est une bonne question. Voici l'analyse :

D'abord, votre ordinateur personnel ne peut pas rester allumé 24h/24. Vous sortez, vous dormez, et parfois il plante et redémarre. Un serveur, en revanche, est conçu spécifiquement pour cela. Il fonctionne 365 jours par an sans interruption. Votre site est toujours accessible.

Ensuite, votre connexion Internet domestique n'est pas adaptée. La vitesse de montage (upload) d'un accès Internet domestique est généralement très lente. De plus, l'adresse IP d'un accès domestique est dynamique — elle change régulièrement. Impossible d'utiliser cela pour héberger un site web. Les serveurs utilisent des connexions haut débit dans des datacenters, avec des adresses IP fixes et des débits très rapides.

Troisièmement, votre ordinateur n'a pas d'« adresse IP publique ». Qu'est-ce qu'une adresse IP publique ? C'est une adresse unique au monde. Seul un ordinateur disposant de cette adresse peut être trouvé sur Internet. L'adresse IP de votre ordinateur personnel n'est généralement valable que dans votre réseau local. Les personnes à l'extérieur ne peuvent pas vous trouver. Un serveur, en revanche, dispose d'une adresse IP publique fixe. N'importe qui dans le monde peut le trouver grâce à cette adresse.

<DeploymentServerDemo />

### 3.2 Comment choisir un serveur

Le choix d'un serveur dépend principalement de trois critères : **le nombre de cœurs CPU**, **la quantité de mémoire RAM** et **l'espace disque**. Plus ces valeurs sont élevées, plus le serveur est performant — et plus cher.

Pour les débutants, il n'est pas nécessaire d'investir dans une configuration coûteuse. Voici un guide simple :

- **Projets personnels, apprentissage** : 1 cœur, 2 Go de RAM — c'est suffisant. Environ quelques dizaines de yuans par mois.
- **Petits projets commerciaux** : 2 cœurs, 4 Go de RAM. Capacité de gérer quelques milliers à quelques dizaines de milliers de visites par jour.
- **Projets moyens** : 4 cœurs, 8 Go ou plus. Nécessite une équipe dédiée à l'exploitation.

Un autre facteur à prendre en compte : **la localisation géographique**. Si vos utilisateurs sont principalement en Chine, choisissez des serveurs en Chine (Alibaba Cloud, Tencent Cloud) pour de meilleures performances. Si vos utilisateurs sont principalement à l'étranger, choisissez des serveurs internationaux (AWS, Google Cloud, DigitalOcean) ou à Hong Kong. La vitesse est bonne et aucune enregistrement ICP n'est nécessaire.

### 3.3 Chine ou étranger

C'est une question importante que beaucoup de gens ne se posent pas au début, mais qui peut causer des problèmes par la suite.

**Acheter un serveur en Chine** offre une vitesse plus rapide et une latence plus faible. L'inconvénient est qu'il faut effectuer un enregistrement ICP (soumettre les informations du site aux autorités compétentes pour approbation). Le délai est généralement d'une semaine à un mois. Les serveurs chinois sont aussi relativement plus chers.

**Acheter un serveur à l'étranger** permet de s'affranchir de l'enregistrement ICP. Vous pouvez l'utiliser immédiatement après l'achat. Les prix peuvent aussi être plus avantageux. L'inconvénient est que la vitesse d'accès depuis la Chine continentale peut être plus lente. Les datacenters à Hong Kong ou Singapour offrent de meilleures performances.

Notre recommandation : pour les projets personnels et les sites de démonstration, achetez un serveur à Hong Kong ou à l'étranger pour éviter les démarches d'enregistrement. Pour les projets commerciaux sérieux nécessitant une exploitation à long terme, achetez un serveur en Chine et effectuez l'enregistrement ICP. Cela vous évitera bien des soucis par la suite.

### 3.4 Comparaison des principaux fournisseurs cloud

| Fournisseur | Public cible | Caractéristiques | Prix pour les nouveaux utilisateurs |
|------|---------|------|-----------|
| Alibaba Cloud | Activité en Chine | Leader du marché, écosystème complet | Première année : quelques dizaines à une centaine de yuans |
| Tencent Cloud | Mini-programmes, jeux | Bonne intégration cloud des mini-programmes | Offres de bienvenue très agressives |
| Huawei Cloud | Entreprises | Choix privilégié pour les projets gouvernementaux | Prix relativement élevé |
| DigitalOcean | Développeurs | Simple et transparent | À partir de 4 $/mois |
| Vercel | Projets front-end | Zéro configuration, déploiement automatique | Le quota gratuit suffit |

Pour les débutants, nous recommandons les offres étudiantes / nouveaux utilisateurs d'**Alibaba Cloud** ou **Tencent Cloud**. Souvent, l'année ne coûte que quelques dizaines de yuans — un excellent rapport qualité-prix. Pour les projets purement front-end, vous pouvez aussi utiliser directement **Vercel** ou **Netlify**. Pas besoin de louer un serveur : il suffit de pousser le code et le déploiement se fait automatiquement.

### 3.5 Que faire après avoir reçu votre serveur

Après l'achat du serveur, vous recevrez un e-mail contenant plusieurs informations importantes :

- **Adresse IP** : une suite de chiffres comme `123.45.67.89`. C'est l'adresse de votre serveur sur Internet.
- **Nom d'utilisateur de connexion** : généralement `root` (compte administrateur).
- **Mot de passe de connexion** : mot de passe initial, ou un lien pour le définir.

Avec ces informations, vous pouvez vous connecter à distance au serveur via **SSH (Secure Shell)** et le configurer. SSH est une commande chiffrée de contrôle à distance qui vous permet d'administrer un serveur situé à l'autre bout du monde depuis votre propre ordinateur.

La commande de connexion ressemble à ceci :

```bash
ssh root@123.45.67.89
# Après avoir appuyé sur Entrée, le mot de passe vous sera demandé. Une fois le bon mot de passe saisi, vous serez connecté.
```

Une fois connecté, vous accédez à l'interface en ligne de commande du serveur. L'aspect est similaire à une fenêtre de terminal ouverte sur votre propre ordinateur. Vous pouvez y installer des logiciels, créer des dossiers, modifier des configurations. Toutes les opérations sont identiques à celles sur votre ordinateur local.

---

## 4. Déploiement : installer le code dans la « maison »

### 4.1 Qu'est-ce que le déploiement

Le déploiement, c'est une fois que vous avez loué un serveur (la maison), y installer votre code (les meubles et effets personnels), puis ouvrir les portes pour commencer l'activité.

Concrètement, le déploiement comprend les étapes suivantes :

1. **Téléverser le code sur le serveur** : transférer le résultat de la construction depuis votre ordinateur local vers le serveur.
2. **Installer les dépendances** : le serveur n'a peut-être pas les paquets nécessaires au projet. Il faut les installer.
3. **Configurer les variables d'environnement** : informations sensibles comme les mots de passe de base de données, les clés API, etc.
4. **Démarrer le service** : lancer l'application pour qu'elle commence à écouter les requêtes des utilisateurs.

Ces quatre étapes peuvent sembler complexes, mais elles ne sont pas si difficiles en pratique. Nous allons détailler chaque étape ci-dessous.

<DeploymentServerDemo />

### 4.2 Comment téléverser le code sur le serveur

**Méthode 1 : Téléversement FTP/SFTP**

C'est la méthode la plus intuitive. C'est comme utiliser un service de stockage en ligne — vous glissez-déposez les fichiers vers le serveur. Vous pouvez télécharger un logiciel gratuit appelé **FileZilla** sur votre ordinateur. Saisissez l'adresse IP du serveur, le nom d'utilisateur et le mot de passe, et vous pourrez gérer les fichiers du serveur aussi facilement que vos fichiers locaux.

**Méthode 2 : Récupération via Git**

C'est la méthode recommandée. Créez d'abord un dépôt de code sur GitHub, GitLab ou Gitee. Poussez le code vers le cloud. Ensuite, sur le serveur, utilisez la commande `git clone` pour récupérer le code.

L'avantage est que pour les mises à jour ultérieures, il suffit d'exécuter `git pull` sur le serveur. Pas besoin de téléverser manuellement à chaque fois. De plus, le code est sauvegardé dans le cloud — même si le serveur est réinstallé, vous ne perdez rien.

**Méthode 3 : Déploiement automatique par CI/CD**

C'est la méthode la plus professionnelle et celle que nous recommandons vivement. En configurant CI/CD (intégration continue / déploiement continu), il suffit de pousser le code vers GitHub. Le système CI/CD effectue automatiquement pour vous : récupération du code → installation des dépendances → construction → déploiement. Vous n'avez même pas besoin de vous connecter au serveur. Tout est fait automatiquement.

### 4.3 Étapes concrètes du déploiement

Prenons la méthode la plus simple — le déploiement manuel via Git. Voici la démonstration étape par étape :

**Étape 1 : Se connecter au serveur**

```bash
ssh root@123.45.67.89
```

**Étape 2 : Installer les logiciels nécessaires**

S'il s'agit d'un projet Node.js, il faut d'abord installer Node.js :

```bash
# Sur un système Ubuntu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

**Étape 3 : Récupérer le code**

```bash
# Créer le répertoire du site
mkdir -p /var/www/my-website
cd /var/www/my-website

# Cloner le dépôt de code (il faut d'abord avoir créé le dépôt sur GitHub)
git clone https://github.com/votre-utilisateur/votre-depot.git .
```

**Étape 4 : Installer les dépendances et construire**

```bash
# Installer les dépendances du projet
npm install

# Construire le projet (génère le répertoire dist)
npm run build
```

**Étape 5 : Démarrer le service avec PM2**

Pourquoi utiliser PM2 ? C'est un gestionnaire de processus qui permet au site de fonctionner en arrière-plan en continu. Même si le serveur redémarre, l'application se relance automatiquement.

```bash
# Installer PM2 globalement
sudo npm install -g pm2

# Démarrer le site (en supposant que le fichier d'entrée est index.js)
pm2 start index.js

# Configurer le démarrage automatique
pm2 startup
pm2 save
```

**Étape 6 : Configurer le proxy inverse Nginx**

Les applications Node.js fonctionnent généralement sur des ports comme 3000 ou 8080. Mais les utilisateurs accèdent au port 80 (port par défaut de HTTP). Il faut utiliser Nginx pour transférer les requêtes du port 80 vers le port de l'application.

```bash
# Installer Nginx
sudo apt install -y nginx

# Créer le fichier de configuration Nginx
sudo nano /etc/nginx/sites-available/my-website
```

Dans l'éditeur, saisissez la configuration suivante :

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    # Fichiers statiques (résultat de la construction) servis directement
    location / {
        root /var/www/my-website/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Requêtes API transférées vers le backend Node.js
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Après avoir sauvegardé et quitté, activez cette configuration :

```bash
# Activer la configuration
sudo ln -s /etc/nginx/sites-available/my-website /etc/nginx/sites-enabled/

# Tester la configuration pour détecter d'éventuelles erreurs
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

Maintenant, en visitant `http://example.com` (n'oubliez pas de configurer la résolution DNS du nom de domaine vers l'adresse IP du serveur), vous devriez voir le site !

---

## 5. Nom de domaine et DNS : donner un bon nom au site

### 5.1 Pourquoi acheter un nom de domaine

Avec l'adresse IP du serveur, pourquoi acheter un nom de domaine ?

Réfléchissez. Retenir une suite de chiffres comme `123.45.67.89`, n'est-ce pas difficile ? N'est-il pas facile de se tromper ? Mais retenir des noms comme `baidu.com` ou `taobao.com` est beaucoup plus simple, non ?

Le nom de domaine est le nom du site. Facile à retenir, professionnel. Il renforce aussi l'image de marque. Imaginez : dire à quelqu'un « visite mon site, l'IP est 123.45.67.89 » ou « visite jesuisbeau.com » — lequel semble plus sérieux ?

<DeploymentDnsDemo />

### 5.2 Qu'est-ce que le DNS

Très bien. Vous avez acheté un nom de domaine, disons `my-awesome-website.com`. Mais voici le problème : les ordinateurs ne comprennent que les adresses IP. Ils ne comprennent pas « my-awesome-website.com ».

C'est là que le DNS entre en jeu. DNS signifie « Domain Name System » (Système de Noms de Domaine). On peut le comparer à un immense « annuaire téléphonique » chargé de traduire les noms de domaine (lisibles par l'homme) en adresses IP (compréhensibles par les machines).

Lorsque vous saisissez `my-awesome-website.com` dans votre navigateur et appuyez sur Entrée, voici ce qui se passe en arrière-plan :

1. Le navigateur demande au DNS : « Hé, quelle est l'adresse IP de my-awesome-website.com ? »
2. Le DNS consulte l'« annuaire » et répond au navigateur : « Son adresse IP est 123.45.67.89 »
3. Le navigateur utilise cette adresse IP pour trouver le serveur et envoie la requête

Tout ce processus ne prend généralement que quelques dizaines de millisecondes. L'utilisateur ne perçoit aucun délai.

### 5.3 Comment configurer le DNS

La configuration DNS se fait généralement à deux endroits :

**Méthode 1 : Configuration chez le registraire de nom de domaine**

Configurez les enregistrements DNS là où vous avez acheté le nom de domaine. Le type d'enregistrement le plus courant est l'**enregistrement A** :

- **Type d'enregistrement** : A
- **Enregistrement hôte** : généralement `@` (représente le domaine lui-même, par ex. my-awesome-website.com) ou `www` (représente www.my-awesome-website.com)
- **Valeur de l'enregistrement** : l'adresse IP du serveur, par ex. `123.45.67.89`

**Méthode 2 : Utiliser un service DNS tiers**

De nombreux professionnels n'utilisent pas le DNS fourni par le registraire. Ils préfèrent des services DNS spécialisés comme Cloudflare, Alibaba Cloud DNSPod ou Tencent Cloud DNS. Ces services sont généralement plus stables, plus rapides en résolution, et offrent des fonctionnalités supplémentaires comme le CDN et la protection DDoS.

### 5.4 Combien de temps la propagation DNS prend-elle

C'est une question fréquente. La réponse est : **cela dépend. Généralement de quelques minutes à 24 heures**.

Après une modification DNS, tous les serveurs DNS dans le monde doivent se synchroniser. C'est comme jeter un caillou dans l'océan — les vagues mettent du temps à atteindre les rivages lointains. Certains serveurs DNS se mettent à jour rapidement, en quelques minutes. D'autres sont plus lents et peuvent nécessiter davantage de temps.

Vous pouvez vérifier si le DNS est propagé avec la commande suivante :

```bash
# Windows
ping votre-domaine

# Mac/Linux
ping votre-domaine
```

Si le ping fonctionne et affiche l'adresse IP du serveur, cela signifie que le DNS est propagé.

---

## 6. HTTPS : installer un « cadenas » sur le site

### 6.1 Différence entre HTTP et HTTPS

Vous l'avez peut-être remarqué. Certaines adresses de sites commencent par `http://` et d'autres par `https://`. Ce « s » est très important. Il signifie « Secure » (sécurisé).

**HTTP (HyperText Transfer Protocol)** est le protocole utilisé pour transmettre les pages web. On peut le comparer à un camion qui transporte des données. Mais ce camion est **transparent** — tout le monde peut voir ce qu'il contient. Sur un site en HTTP, les mots de passe saisis et les informations personnelles renseignées peuvent être interceptés par n'importe quel intermédiaire pendant le transit.

**HTTPS (HTTP Secure)** ajoute à ce camion un **conteneur scellé** muni d'un cadenas. Seuls l'expéditeur et le destinataire possèdent la clé. Même si quelqu'un intercepte le conteneur en cours de route, il ne peut pas en comprendre le contenu. C'est le chiffrement des communications.

<DeploymentHttpsDemo />

### 6.2 Pourquoi utiliser HTTPS

Première raison : **la sécurité**. Sans HTTPS, les mots de passe que les utilisateurs saisissent sur le site sont transmis en clair. Toute personne avec un minimum de compétences techniques peut les intercepter. De nos jours, qui oserait utiliser un site sans HTTPS ?

Deuxième raison : **l'avertissement du navigateur**. Les navigateurs modernes comme Chrome et Edge affichent un avertissement « non sécurisé » pour les sites sans HTTPS. Les utilisateurs voient l'icône d'avertissement et partent immédiatement — encore moins susceptibles de s'inscrire ou de payer.

Troisième raison : **le SEO**. Les moteurs de recherche comme Google et Baidu donnent la priorité aux sites HTTPS dans leurs résultats. Le référencement naturel est meilleur.

### 6.3 Comment obtenir un certificat HTTPS

Autrefois, les certificats HTTPS étaient chers — plusieurs centaines, voire milliers de yuans par an. Aujourd'hui, une organisation appelée **Let's Encrypt** propose des certificats SSL/TLS entièrement gratuits. Et la communauté propose de nombreux outils automatisés pour l'installation et le renouvellement.

**Méthode 1 : Utiliser Certbot (recommandée)**

Certbot est un outil qui demande et configure automatiquement les certificats Let's Encrypt. Très simple d'utilisation :

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Demander un certificat et configurer Nginx en une seule commande
sudo certbot --nginx -d example.com -d www.example.com
```

Pendant l'exécution, quelques questions vous seront posées, comme votre adresse e-mail (pour les rappels d'expiration du certificat). Une fois les questions répondues, le certificat est automatiquement configuré. En visitant le site, vous verrez un petit cadenas dans la barre d'adresse.

Le certificat est valable 90 jours. Mais Certbot configure une tâche planifiée pour le renouvellement automatique. Vous n'avez pratiquement pas à vous en soucier.

**Méthode 2 : Utiliser Cloudflare**

Si vous utilisez le service DNS de Cloudflare, vous n'avez même pas besoin de configurer le certificat HTTPS vous-même. Cloudflare fournit automatiquement le support HTTPS pour votre domaine. Il gère même le problème du renouvellement tous les 90 jours.

### 6.4 Quels changements après la configuration HTTPS

Une fois HTTPS configuré, l'accès passe de `http://example.com` à `https://example.com`. Ce changement apporte plusieurs garanties de sécurité :

1. **Transmission chiffrée** : toutes les communications entre l'utilisateur et le serveur sont chiffrées.
2. **Authentification** : le certificat prouve que « je suis bien ce site ». Protection contre le phishing.
3. **Intégrité des données** : toute altération des données peut être détectée.

---

## 7. CI/CD : laisser les robots travailler pour vous

### 7.1 Qu'est-ce que CI/CD

CI/CD est l'abréviation de deux termes : **C**ontinuous **I**ntegration (Intégration Continue) et **C**ontinuous **D**eployment (Déploiement Continu). On peut le voir comme un système de robots qui travaillent automatiquement pour vous.

Sans CI/CD, chaque nouvelle publication suivait ce processus :

1. Allumer l'ordinateur, se connecter à GitHub
2. Récupérer le dernier code
3. Exécuter les tests pour vérifier l'absence de bugs
4. Construire manuellement le projet
5. Se connecter au serveur
6. Récupérer le dernier code
7. Installer les dépendances
8. Construire le projet
9. Redémarrer le service

Ces 9 étapes devaient être exécutées manuellement à chaque publication. Fastidieux, n'est-ce pas ? Et il est facile d'en oublier une — par exemple, oublier d'exécuter les tests ou de redémarrer le service.

Avec CI/CD, le processus devient :

1. Pousser le code vers GitHub
2. Prendre un thé et attendre
3. (Le robot effectue automatiquement les 9 étapes ci-dessus)
4. Le site est mis à jour automatiquement

<DeploymentCicdDemo />

C'est la magie de CI/CD : **il suffit de pousser le code. Tout le reste est fait automatiquement**.

### 7.2 Le flux de travail CI/CD

Un flux CI/CD typique se déroule ainsi :

**Étape 1 : Soumission du code (Push)**

Vous avez terminé le développement d'une nouvelle fonctionnalité. Vous poussez le code vers GitHub.

**Étape 2 : Déclenchement de la CI (Intégration Continue)**

GitHub détecte le changement de code et notifie le système CI (GitHub Actions, GitLab CI, etc.) pour commencer à travailler.

**Étape 3 : Installation des dépendances et tests**

Le système CI lance un ordinateur virtuel et y effectue :
- L'installation des dépendances du projet
- L'exécution des tests pour s'assurer qu'il n'y a pas de bugs
- La construction du projet pour générer les artefacts

Si les tests échouent, la CI envoie une notification par e-mail. Le déploiement est arrêté. Le code problématique ne sera pas déployé en production.

**Étape 4 : Exécution du CD (Déploiement Continu)**

Une fois tous les tests réussis, le système CI :
- Se connecte au serveur via SSH
- Récupère le dernier code
- Installe les dépendances
- Construit le projet
- Redémarre le service

Tout le processus peut ne prendre que quelques minutes. Entièrement automatique.

### 7.3 Comment configurer GitHub Actions

GitHub Actions est la fonctionnalité CI/CD intégrée de GitHub. Elle est gratuite (le quota gratuit est suffisant pour les projets personnels) et se configure très simplement.

Créez un fichier `.github/workflows/deploy.yml` à la racine du projet et saisissez la configuration suivante :

```yaml
name: Deploy to Production

# Condition de déclenchement : à chaque push sur la branche main
on:
  push:
    branches: [main]

# Liste des tâches
jobs:
  # Tâche de déploiement
  deploy:
    # Système d'exploitation d'exécution
    runs-on: ubuntu-latest

    # Étapes détaillées
    steps:
      # 1. Récupérer le code
      - name: Checkout code
        uses: actions/checkout@v3

      # 2. Installer l'environnement Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      # 3. Installer les dépendances et construire
      - name: Install and Build
        run: |
          npm ci
          npm run build

      # 4. Déployer sur le serveur
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/my-website
            git pull origin main
            npm install
            npm run build
            pm2 restart all
```

Ce fichier de configuration indique à GitHub Actions :

- De se déclencher lorsqu'il y a du nouveau code sur la branche main
- D'exécuter les tâches sur une machine Ubuntu
- D'abord installer Node.js 18
- Puis installer les dépendances et construire le projet
- Enfin, se connecter au serveur via SSH pour exécuter une série de commandes de déploiement

Une fois configuré, chaque `git push origin main` déclenchera automatiquement le déploiement. Très pratique.

---

## 8. Surveillance et journaux : être le « veilleur de nuit » du site

### 8.1 Pourquoi surveiller

Une fois le site en ligne, il devrait théoriquement fonctionner 24h/24 et 7j/7 sans interruption. Mais dans le monde réel, rien n'est parfait. Le serveur peut tomber en panne. Le réseau peut subir des perturbations. Le code peut contenir des bugs. Dans un environnement de production réel, toutes sortes d'incidents peuvent survenir.

Sans surveillance, la seule façon d'apprendre que « le site est en panne » est qu'un utilisateur vous appelle. À ce moment-là, il est souvent trop tard. Les utilisateurs sont peut-être déjà partis.

Avec la surveillance, vous pouvez :

- **Détecter les problèmes à l'avance** : le CPU est à 90 % ? Ajoutez un serveur avant qu'il ne soit trop tard.
- **Localiser rapidement les problèmes** : le site est lent ? Consultez la surveillance pour identifier le goulot d'étranglement.
- **Avoir l'esprit tranquille** : combien de visiteurs par jour, quand le trafic est-il le plus élevé, etc.

<DeploymentMonitorDemo />

### 8.2 Quels métriques surveiller

Les métriques les plus importantes sont les suivantes :

| Métrique | Plage normale | Que faire en cas de dépassement |
|------|---------|-----------|
| Utilisation CPU | < 70 % | Mettre à niveau le serveur ou optimiser le code |
| Utilisation mémoire | < 80 % | Vérifier s'il y a une fuite de mémoire |
| Utilisation disque | < 80 % | Nettoyer les journaux ou les fichiers inutiles |
| Disponibilité du site | 100 % | Vérifier si le service fonctionne correctement |
| Temps de réponse | < 2 secondes | Optimiser les requêtes de base de données ou ajouter un cache |
| Taux d'erreur | < 1 % | Consulter les journaux d'erreurs pour identifier le problème |

### 8.3 Comment configurer la surveillance

**Solution la plus simple : Uptime Robot**

Inscrivez-vous sur uptimerobot.com. Ajoutez l'URL de votre site. Il vérifie automatiquement toutes les 5 minutes si le site fonctionne. Si le site est en panne, il vous envoie un e-mail. La version gratuite permet de surveiller 50 sites — largement suffisant pour les projets personnels.

**Solution intermédiaire : Surveillance Alibaba Cloud / Tencent Cloud**

Si votre serveur est chez Alibaba Cloud ou Tencent Cloud, la surveillance est intégrée. Il suffit de configurer les seuils d'alerte.

**Solution professionnelle : Prometheus + Grafana**

Ce sont les « couteaux suisses » de la surveillance. Très puissants, ils peuvent surveiller pratiquement n'importe quel métrique et créer de magnifiques tableaux de bord visuels. Cependant, la configuration est relativement complexe et convient aux développeurs expérimentés.

### 8.4 Journaux : comment investiguer en cas de problème

La surveillance vous dit « il y a un problème sur le site ». Mais pour comprendre quel est le problème exact et pourquoi il est survenu, il faut consulter les **journaux** (logs).

Les journaux sont le « carnet de bord » du programme en cours d'exécution. Ils enregistrent les événements survenus pendant le fonctionnement :

- Quel utilisateur a accédé à quelle page et à quel moment
- Combien de temps a pris une requête de base de données
- S'il y a eu des erreurs et quel était le message d'erreur

**Utilisation basique des journaux**

Consulter les journaux d'application sur le serveur :

```bash
# Consulter les journaux PM2
pm2 logs

# Consulter les journaux d'accès Nginx
tail -f /var/log/nginx/access.log

# Consulter les journaux d'erreurs Nginx
tail -f /var/log/nginx/error.log
```

**Solution avancée de journaux**

Pour les projets complexes, nous recommandons des outils professionnels de collecte de journaux :

- **Loki** : gratuit et open source. De la même famille que Prometheus.
- **ELK (Elasticsearch + Logstash + Kibana)** : très puissant mais complexe à configurer.
- **Sentry** : outil spécialisé dans la collecte des erreurs d'application. Capture automatiquement les rapports d'erreurs.

### 8.5 Alertes : comment être informé immédiatement en cas de problème

La surveillance vous informe qu'il y a un problème. Mais si vous ne regardez pas le tableau de bord en permanence, que faire ? C'est là qu'interviennent les **alertes**.

Les alertes envoient automatiquement des notifications par SMS, WeChat, DingTalk, e-mail, etc., lorsque le système de surveillance détecte une anomalie. Vous pouvez configurer différents niveaux d'alerte :

- **Urgent (site complètement en panne)** : SMS + appel téléphonique. Vous devez être informé immédiatement.
- **Critique (taux d'erreur en hausse)** : message DingTalk / WeChat. Traitez dès que vous le voyez.
- **Normal (CPU légèrement élevé)** : résumé par e-mail. Un coup d'œil par jour suffit.

Le principe fondamental de la configuration des alertes est : **des alertes hiérarchisées, sans se submerger**. Si chaque incident mineur déclenche un SMS, vous finirez par désactiver les alertes.

---

## 9. Tableau de référence rapide pour les problèmes courants

| Symptôme | Cause probable | Solution |
|---------|---------|---------|
| Le site ne s'ouvre pas | DNS non résolu / serveur en panne / Nginx non démarré | `ping domaine` pour vérifier la connectivité ; `pm2 list` pour vérifier le service ; `systemctl status nginx` pour vérifier Nginx |
| Page blanche | Chemin des artefacts de construction incorrect / fichiers statiques mal configurés | Vérifier que le chemin root de Nginx pointe vers le répertoire dist |
| Page 404 introuvable | Routage mal configuré / erreur dans le chemin | Ajouter `try_files $uri $uri/ /index.html` dans la configuration Nginx |
| 502 Bad Gateway | Service backend en panne / port non ouvert | `pm2 list` pour vérifier si le processus fonctionne ; vérifier le port |
| 403 Forbidden | Permissions incorrectes / index de répertoire non activé | Vérifier les permissions `chmod -R 755` ; ajouter `autoindex on` dans Nginx |
| Certificat HTTPS expiré | Certificat non renouvelé | `certbot renew` pour le renouvellement manuel ; vérifier la tâche planifiée de renouvellement automatique |
| Pas de changement après mise à jour | Cache du navigateur / cache CDN | Ctrl+Shift+R pour forcer le rafraîchissement ; vider le cache dans la console CDN |
| Site très lent | Bande passante insuffisante / pas de cache / CDN non configuré | Mettre à niveau la bande passante ; configurer le cache Redis ; intégrer un CDN |
| Connexion à la base de données impossible | Base de données non démarrée / mot de passe incorrect / problème de permissions | Vérifier l'état du service de base de données ; vérifier les informations de connexion |

---

## Résumé

La mise en ligne d'un service est un projet systémique majeur. Elle couvre tous les aspects, de la construction du code au déploiement sur le serveur, de la configuration réseau à la sécurité, de la surveillance et des alertes à l'analyse des journaux. Pour les débutants, il n'est pas nécessaire de viser la perfection dès le départ. Commencez par faire fonctionner un MVP (Produit Minimum Viable), puis améliorez-le progressivement.

Les points clés de l'ensemble du processus peuvent être résumés comme suit :

### Flux principal

1. **Construction** → Utiliser `npm run build` pour transformer le code en HTML/CSS/JS compréhensible par le navigateur
2. **Déploiement** → Téléverser les artefacts de construction sur le serveur. Configurer un proxy inverse avec Nginx.
3. **Nom de domaine** → Acheter un nom de domaine et configurer la résolution DNS vers l'adresse IP du serveur
4. **HTTPS** → Demander un certificat gratuit avec Let's Encrypt. Protéger la transmission des données.
5. **CI/CD** → Configurer le déploiement automatique. Le site se met à jour automatiquement après chaque push de code.
6. **Surveillance** → Configurer la surveillance et les alertes. Être informé immédiatement en cas de problème.

### Parcours d'apprentissage recommandé

- **Jour 1** : Déployer une page statique avec Vercel/Netlify. Ressentir l'expérience de « transformer du code en site web ».
- **Semaine 1** : Louer un serveur cloud. Déployer manuellement un projet Node.js. Configurer le nom de domaine et HTTPS.
- **Semaines 2-4** : Configurer un flux CI/CD complet. Mettre en place la surveillance et les alertes.
- **Apprentissage continu** : Apprendre la conteneurisation Docker, l'orchestration Kubernetes, l'architecture microservices.

---

## Glossaire

| Terme | Anglais | Explication simple |
|------|------|-----------|
| Construction | Build | Traduire et empaqueter le code source dans un format exécutable par le navigateur |
| Déploiement | Deploy | Placer le code sur un serveur pour que les utilisateurs puissent y accéder |
| Serveur | Server | Un ordinateur allumé 24h/24 et connecté à Internet |
| Nom de domaine | Domain | Le nom facile à retenir d'un site (comme baidu.com) |
| DNS | Domain Name System | L'« annuaire téléphonique » qui traduit les noms de domaine en adresses IP |
| HTTP | HyperText Transfer Protocol | Protocole de transmission de pages web (non sécurisé, transmission en clair) |
| HTTPS | HTTP Secure | Protocole de transmission de pages web chiffré (sécurisé) |
| Nginx | Engine X | Serveur web haute performance. Utilisé comme proxy inverse. |
| Proxy inverse | Reverse Proxy | Le « réceptionniste à l'entrée » qui transmet les requêtes vers le backend. |
| SSH | Secure Shell | Outil chiffré de connexion à distance à un serveur |
| CDN | Content Delivery Network | Réseau de serveurs distribué dans le monde entier pour accélérer l'accès. |
| CI/CD | Continuous Integration/Deployment | Pipeline automatisé. Les tests et le déploiement se font automatiquement après le push de code. |
| SSL/TLS | Secure Sockets Layer / Transport Layer Security | Protocole de chiffrement. Assure la sécurité de HTTPS. |
| PM2 | Process Manager 2 | Gestionnaire de processus Node.js. Maintient l'application en fonctionnement continu. |
