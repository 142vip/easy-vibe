<script setup>
import RelatedArticlesSection from '../../../../.vitepress/theme/components/RelatedArticlesSection.vue'
import { relatedArticlesMap } from '../../../../.vitepress/theme/data/relatedArticles'
</script>

# Mettez votre site en ligne (avancé) : préparez votre propre VPS

> 💡 **Que signifie « mettre un site en ligne » ?** On parle aussi de « mise en production » ou de « déploiement/publication ». Un site web construit sur votre propre ordinateur ne peut être ouvert que par vous. **Mettre un site en ligne signifie le placer sur un serveur qui fonctionne 24h/24, afin que n'importe qui puisse saisir une URL dans son navigateur et le visiter** — un peu comme un document Word que vous seul pouvez lire devient visible par tous une fois publié sur un blog ; la différence, c'est que cette fois vous publiez un site web complet.

Dans le chapitre précédent, nous avons appris la façon la plus simple de publier — en utilisant des plateformes PaaS en un clic comme Vercel ou Zeabur. Ce chapitre aborde l'approche plus flexible du « faites-le vous-même » : **achetez votre propre serveur cloud, configurez tout à partir de zéro et publiez votre site vous-même**. Vous apprendrez à choisir un serveur, à vous y connecter, à installer l'environnement, à configurer Nginx, à attacher un domaine et à activer HTTPS. Une fois que vous aurez compris cela, aucune plateforme ne pourra vous limiter — exécutez les services que vous voulez.

---

# 0. Choisissez judicieusement : arbre de décision pour les plateformes de déploiement

Avant de choisir une plateforme, répondez à trois questions :

1. **Votre projet doit-il fonctionner 24h/24 ?**
   - Non (il ne répond que lorsqu'il est visité, par exemple : docs, blogs, sites statiques) → **Hébergement statique / PaaS**
   - Oui (tâches cron, robots d'exploration, bots Telegram/Discord, services WebSocket) → **PaaS toujours actif ou VPS**

2. **Avez-vous besoin d'un GPU ?**
   - Non (il suffit d'appeler les API OpenAI/Anthropic) → Les plateformes classiques conviennent
   - Oui (exécution de modèles open-source, génération d'images/vidéos) → **Plateformes cloud GPU** (Modal, Replicate, Lambda Labs)

3. **Où se trouvent principalement vos utilisateurs ?**
   - Monde entier / États-Unis-UE → Vercel / Railway / Fly.io / AWS
   - Chine continentale → Clouds chinois (Alibaba Cloud / Tencent Cloud) ou Cloudflare (rapide en Chine)
   - Les deux → Utilisez un CDN, déployez les contenus destinés à la Chine sur un cloud chinois, le reste sur AWS avec GeoDNS

```
Quel type de projet déployez-vous ?
│
├─ Site statique purement frontend (sortie de build Vite/React/Vue)
│   ├─ Entièrement gratuit → Cloudflare Pages (bande passante illimitée) / GitHub Pages
│   ├─ Projet Next.js → Vercel (plateforme officielle, meilleure expérience développeur)
│   └─ Utilisateurs principalement en Chine → Cloudflare Pages ou OSS+CDN national
│
├─ API backend, pas besoin d'être toujours active (déclenchée par les requêtes)
│   ├─ API Node.js/Python → Vercel Functions / Cloudflare Workers
│   └─ Frameworks full-stack (Next.js/Nuxt/SvelteKit) → Vercel
│
├─ Nécessite un processus toujours actif (Bot, cron, WebSocket)
│   ├─ Pas envie de gérer des serveurs → Railway / Render / Fly.io
│   ├─ Contrôle total et économies → Achetez un VPS (DigitalOcean / Vultr / Hetzner / AWS EC2)
│   └─ Projets destinés à la Chine → Tencent Cloud Lighthouse / Alibaba Cloud ECS
│
├─ Besoin d'exécuter des modèles IA / GPU
│   ├─ API d'inférence → Modal / Replicate / Hugging Face Inference
│   ├─ Entraînement / Fine-tuning → Modal / Lambda Labs
│   └─ GPU en Chine → AutoDL / Alibaba Cloud PAI
│
└─ Grands projets en production
    └─ AWS/GCP + Kubernetes (embauchez un DevOps ou laissez l'IA écrire du Terraform)
```

---

# 1. Les plateformes de déploiement gratuites/à faible coût en détail (aucun serveur nécessaire)

Pour la plupart des projets personnels, des démos et des portfolios, vous **n'avez pas besoin d'acheter un serveur du tout**. Cette section présente les plateformes gratuites/à faible coût les plus populaires, avec la façon de s'inscrire, de les utiliser, ainsi que leurs pièges.

## 1.1 Vercel — le premier choix pour Next.js / le frontend

**Site web :** https://vercel.com

**Idéal pour :** les projets Next.js, les frontends React/Vue, les applications full-stack avec Serverless Functions, les chatbots IA (temps de réponse rapide)

**Comment l'utiliser :**
1. Inscrivez-vous avec votre compte GitHub
2. Cliquez sur « Add New... » → « Project »
3. Sélectionnez votre dépôt GitHub
4. Vercel détecte automatiquement votre framework (Next.js/Vite/React, etc.), renseignez les variables d'environnement
5. Cliquez sur « Deploy » — votre site est en ligne en 1 à 2 minutes à l'adresse `xxx.vercel.app`

**Niveau gratuit (plan Hobby) :**
- 100 Go de bande passante/mois
- 100 heures de temps de build/mois
- Temps d'exécution des Serverless Functions **10 secondes** (la limite la plus critique !)
- HTTPS automatique, CDN mondial, aperçus de PR

**Payant (Pro, 20 $/mois) :**
- Délai d'expiration des fonctions étendu à 60-300 s
- 1 To de bande passante
- Fonctionnalités de collaboration en équipe

**⚠️ Principales limites rencontrées par les débutants :**
- **Délai d'expiration de 10 secondes pour les fonctions** sur le niveau gratuit : les appels d'API IA dépassant 10 s seront interrompus. Le niveau Pro à 20 $/mois l'étend à 60 s, 300 s en option payante
- **Pas de processus toujours actif** : pas de cron, pas de long-polling WebSocket, pas de bots qui tournent en permanence
- **Démarrages à froid** : les fonctions inutilisées depuis un moment seront lentes à la première requête
- **Coûts des projets IA** : les réponses IA en streaming consomment de la bande passante ; un trafic important peut faire grimper la facture Pro à 200 $/mois

**Verdict :** Vercel offre l'expérience la plus fluide pour déployer des pages frontend, des docs et des démos rapides. Mais pour des agents toujours actifs ou des appels IA de longue durée — n'utilisez pas Vercel.

## 1.2 Cloudflare Pages — bande passante illimitée, rapide partout dans le monde

**Site web :** https://pages.cloudflare.com

**Idéal pour :** les sites statiques, les projets gourmands en bande passante, les audiences mondiales, les Edge Functions

**Niveau gratuit :**
- **Bande passante illimitée** (le plus gros argument de vente !)
- 500 builds/mois
- Requêtes illimitées
- Cloudflare Workers : 100 000 requêtes/jour
- Plus de 300 points de présence dans le monde, vitesse correcte même en Chine

**Comment l'utiliser :**
1. Créez un compte Cloudflare gratuit
2. Allez dans Workers & Pages → Create → Pages → Connect to Git
3. Sélectionnez votre dépôt, définissez la commande de build (Vite : `npm run build`, dossier de sortie : `dist`)
4. Cliquez sur Save and Deploy

**Bonus : Workers AI :** Cloudflare propose également d'exécuter des modèles IA open-source (Llama 3, Mistral, Stable Diffusion) sur les nœuds périphériques, avec 10 000 neurones/jour gratuits. Idéal pour exécuter de petits modèles sans dépendre des API OpenAI.

**Verdict :** Le meilleur choix pour les sites statiques, en particulier les projets avec une audience mondiale. La bande passante illimitée est une fonctionnalité imbattable.

## 1.3 Railway — la meilleure expérience pour les services backend (toujours actifs)

**Site web :** https://railway.app

**Idéal pour :** les services backend toujours actifs, les API Node.js/Python/Go, les bots Discord/Telegram, les projets full-stack nécessitant des bases de données

**Comment l'utiliser :**
1. Inscrivez-vous avec GitHub
2. New Project → Deploy from GitHub repo (ou choisissez un template)
3. Railway détecte automatiquement le type de votre projet, installe les dépendances, construit et démarre
4. Ajoutez en un clic des bases de données PostgreSQL/Redis/MySQL/MongoDB
5. Domaine généré automatiquement, ou liez votre propre domaine

**Tarifs :**
- Les nouveaux utilisateurs reçoivent **5 $ de crédit d'essai** (pas gratuit en permanence)
- Facturation à l'usage ensuite, à partir d'environ 5 $/mois (service toujours actif aux spécifications minimales + base de données)
- Mise en veille après 5 min d'inactivité (pendant l'essai gratuit) ; pas de veille après paiement

**Verdict :** Railway offre la meilleure expérience pour déployer des API backend, des bots et des applications full-stack nécessitant des bases de données — déploiement automatique depuis GitHub, bases de données intégrées, journaux et surveillance inclus.

## 1.4 Fly.io — des conteneurs vraiment gratuits 24h/24

**Site web :** https://fly.io

**Idéal pour :** les services distribués mondialement à faible latence, ceux qui veulent un conteneur **vraiment gratuit 24h/24**, et qui acceptent une petite courbe d'apprentissage

**Niveau gratuit :**
- 3 VM partagées micro (micro-1x, 256 Mo de RAM)
- **Aucune limite de durée d'exécution** (pas de mise en veille comme Render)
- 160 Go de trafic sortant/mois
- 3 Go de volumes persistants
- Plus de 30 régions de datacenters dans le monde
- Support GPU (A100/H100)

**Comment l'utiliser :**
1. L'inscription nécessite une carte bancaire (aucun débit, vérification d'identité)
2. Installez le CLI flyctl
3. Écrivez un fichier de configuration `fly.toml` dans votre projet (l'IA peut le générer)
4. `fly launch` → construit automatiquement l'image Docker, attribue une IP, déploie
5. `fly deploy` pour mettre à jour, `fly logs` pour consulter les journaux

**Verdict :** Si vous avez besoin d'un **conteneur vraiment gratuit 24h/24** pour un bot/une API/une tâche cron, Fly.io est la meilleure option gratuite. Le compromis : apprendre les commandes flyctl et les bases de Docker.

## 1.5 Render — 750 heures gratuites mais mise en veille

**Site web :** https://render.com

**Idéal pour :** la phase d'apprentissage, les projets personnels, les projets qui acceptent les démarrages à froid

**Niveau gratuit :**
- Web Service : 750 heures/mois (une instance fonctionne en continu)
- PostgreSQL : gratuit pendant 90 jours (⚠️ la base de données est supprimée après !)
- Sites statiques : entièrement gratuits, 100 Go de bande passante

**⚠️ Problème clé :**
- **Mise en veille après 15 minutes d'inactivité**, le démarrage à froid prend 10 à 30 secondes (mauvaise expérience utilisateur)
- La base de données gratuite est supprimée après 90 jours — pensez à faire des sauvegardes !

**Verdict :** Bon pour les projets de dev/test/école, mais ne mettez pas de projets de production destinés aux utilisateurs sur le niveau gratuit. Le payant commence à 7 $/mois pour désactiver la mise en veille.

## 1.6 Autres plateformes notables

| Plateforme | Type | Niveau gratuit | Points forts |
|----------|------|-----------|------------|
| **GitHub Pages** | Hébergement statique | Illimité (limite souple de 100 Go) | Le plus simple : poussez sur GitHub, c'est en ligne |
| **Hugging Face Spaces** | Applications IA | Petite instance CPU gratuite | Dédié aux démos IA (Gradio/Streamlit) |
| **Modal** | GPU IA/Serverless | 30 $/mois de crédit | Python functions-as-a-service, démarrage à froid GPU < 4 s |
| **Replicate** | Hébergement de modèles IA | Paiement à l'appel | Transforme les modèles en API sans gérer d'infrastructure |
| **Denoland Deploy** | Deno/Edge | 100k requêtes/jour gratuites | Plateforme officielle Deno, TypeScript natif |
| **Netlify** | Hébergement statique | 100 Go de bande passante/mois | Écosystème de plugins riche |
| **Supabase** | BaaS | 500 Mo de base de données gratuits | Alternative open-source à Firebase, Postgres+Auth+Storage |
| **Neon** | Postgres Serverless | 500 Mo gratuits | Bases de données ramifiables pour Serverless |
| **Upstash** | Redis Serverless | 10k commandes/jour gratuites | Redis basé sur les requêtes pour Serverless |

---

# 2. Acheter un VPS cloud : guide pas à pas avec AWS

Si vous avez besoin d'un contrôle total sur l'environnement du serveur, d'exécuter des services personnalisés, ou si le PaaS ne couvre pas vos besoins, il est temps d'acheter votre propre serveur cloud. Cette section détaille AWS (la plateforme cloud mondiale la plus utilisée), et couvre aussi des alternatives comme DigitalOcean, Vultr et Hetzner.

## 2.1 Niveau gratuit AWS — gratuit pendant 12 mois

AWS offre aux nouveaux utilisateurs un niveau gratuit de 12 mois, parfait pour apprendre et pour les projets personnels. Voici ce qui est inclus :

| Service | Allocation du niveau gratuit |
|---------|---------------------|
| **EC2** | 750 heures/mois de t2.micro ou t3.micro (une instance fonctionnant 24h/24) |
| **S3** | 5 Go de stockage standard |
| **RDS** | 750 heures/mois de db.t2.micro/db.t3.micro + 20 Go de stockage |
| **Lambda** | 1 million de requêtes/mois + 3,2 millions de secondes de calcul |
| **CloudFront** | 50 Go de trafic sortant + 2 millions de requêtes/mois |
| **CloudWatch** | 10 métriques personnalisées + 1 Go d'ingestion de journaux |
| **DynamoDB** | 25 Go de stockage + 2,5 millions d'unités de capacité de lecture/écriture |

**⚠️ Important :** le niveau gratuit expire 12 mois après l'inscription, après quoi vous serez facturé aux tarifs standards. Configurez toujours des alertes de facturation (Billing Dashboard → Budgets) pour éviter les mauvaises surprises. Détruisez les ressources que vous n'utilisez pas !

### Comment créer une instance EC2 (VPS AWS) :

1. **Inscrivez-vous** sur https://aws.amazon.com/ avec une adresse e-mail et une carte bancaire
2. Allez dans **EC2 Dashboard** → **Launch Instances**
3. **Étape 1 : choisissez une Amazon Machine Image (AMI)**
   - Sélectionnez **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type** (64 bits x86) — c'est l'option la plus adaptée aux débutants
4. **Étape 2 : choisissez le type d'instance**
   - Sélectionnez **t2.micro** (éligible au niveau gratuit, 1 vCPU, 1 Go de RAM)
5. **Étape 3 : configurez les détails de l'instance**
   - Conservez les valeurs par défaut (1 instance, VPC par défaut)
6. **Étape 4 : ajoutez du stockage**
   - Le volume racine gp2 par défaut de 8 Go suffit pour commencer
7. **Étape 5 : ajoutez des tags** (facultatif, pour l'organisation)
8. **Étape 6 : configurez le groupe de sécurité** (⚠️ CRITIQUE — c'est votre pare-feu)
   - Créez un nouveau groupe de sécurité
   - Ajoutez les règles :
     - Type : **SSH**, port : 22, source : **My IP** (seule votre IP peut se connecter en SSH)
     - Type : **HTTP**, port : 80, source : **Anywhere (0.0.0.0/0)**
     - Type : **HTTPS**, port : 443, source : **Anywhere**
9. **Étape 7 : vérifiez et lancez**
10. **Paire de clés** : lorsque vous y êtes invité, créez une nouvelle paire de clés (par exemple `my-aws-key.pem`), téléchargez-la et conservez-la en lieu sûr. **Vous ne pourrez pas la télécharger à nouveau !**
11. Cliquez sur **Launch Instances** → attendez 2 à 5 minutes qu'elle démarre

### Se connecter à votre instance EC2 :

```bash
# Sur votre terminal local Mac/Linux
chmod 400 my-aws-key.pem  # Définissez les bonnes permissions (obligatoire !)
ssh -i my-aws-key.pem ubuntu@VOTRE_IP_PUBLIQUE
# ex. : ssh -i my-aws-key.pem ubuntu@54.123.45.67

# Sur Windows, utilisez PuTTY (convertissez .pem en .ppk) ou Windows Terminal avec OpenSSH
```

**Obtenez votre IP publique :** allez dans EC2 Dashboard → Instances → Sélectionnez votre instance → cherchez « Public IPv4 address » dans les détails.

## 2.2 DigitalOcean — une documentation idéale pour les débutants

**Site web :** https://www.digitalocean.com

**Tarifs :** les Droplets commencent à 4 $/mois (512 Mo de RAM, 10 Go de SSD, 500 Go de bande passante)

**Pourquoi choisir DO :** leur documentation (appelée « community tutorials ») est légendaire — presque toutes les questions sur Linux/les serveurs ont un tutoriel DO bien rédigé. Leur interface est propre et adaptée aux débutants.

**Comment l'utiliser :**
1. Inscrivez-vous (carte bancaire ou PayPal, dépôt minimum de 2 $ via PayPal)
2. Cliquez sur « Create » → « Droplets »
3. Choisissez Ubuntu 22.04, plan de base à 4 $/mois, sélectionnez un datacenter proche de vos utilisateurs (NYC, SFO, Londres, Singapour, etc.)
4. Ajoutez votre clé publique SSH (recommandé) ou définissez un mot de passe root
5. Cliquez sur « Create Droplet » — prêt en ~1 minute
6. Connectez-vous via : `ssh root@IP_DE_VOTRE_DROPLET`

## 2.3 Vultr — facturation à l'heure, de nombreuses localisations

**Site web :** https://www.vultr.com

**Tarifs :** le Cloud Compute classique commence à 5 $/mois (1 vCPU, 1 Go de RAM, 25 Go de SSD, 1 To de bande passante)

**Pourquoi choisir Vultr :** paiement à l'heure (vous pouvez créer un serveur pour 10 minutes de test, puis le détruire et ne payer que quelques centimes), plus de 30 localisations dans le monde, et des instances GPU abordables si vous en avez besoin plus tard.

## 2.4 Hetzner — le meilleur rapport qualité-prix pour les projets à long terme

**Site web :** https://www.hetzner.com/cloud

**Tarifs :** la CX11 commence à 3,49 €/mois (1 vCPU, 2 Go de RAM, 20 Go de SSD, 20 To de trafic !)

**Pourquoi choisir Hetzner :** le meilleur rapport qualité-prix en Europe, réseau extrêmement stable. Idéal pour les projets de production longue durée. Le compromis : les datacenters sont en Allemagne/Finlande/États-Unis (pas de localisation en Asie).

## 2.5 Comparaison rapide des fournisseurs de VPS

| Fournisseur | Prix de départ | Idéal pour | Essai gratuit |
|----------|---------------|----------|-----------|
| **AWS EC2** | Niveau gratuit pendant 12 mois, puis ~10 $/mois | Apprendre AWS, intégration en entreprise | 12 mois de niveau gratuit |
| **DigitalOcean** | 4 $/mois | Débutants, excellente documentation | 200 $ de crédit pendant 60 jours (nouveaux utilisateurs) |
| **Vultr** | 5 $/mois (2,50 $ en IPv6 uniquement) | Tests à l'heure, de nombreuses régions | 100 $ de crédit pendant 30 jours |
| **Hetzner** | 3,49 €/mois | Meilleur rapport qualité-prix pour les projets à long terme | 20 € de crédit |
| **Linode (Akamai)** | 5 $/mois | Établi, fiable | 100 $ de crédit pendant 60 jours |

---

# 3. Configuration initiale du serveur (Ubuntu 22.04)

Une fois que vous êtes connecté en SSH à votre serveur, la première chose à faire est de mettre à jour le système et d'installer les outils de base. Vous pouvez **copier l'invite ci-dessous à votre assistant IA** et lui demander de générer les commandes exactes dont vous avez besoin :

> « Je viens de configurer un nouveau serveur Ubuntu 22.04 et je veux déployer un projet [Node.js/Python/...]. Donne-moi les commandes d'initialisation complètes incluant : mise à jour du système, création d'un utilisateur sudo non-root, configuration de l'authentification par clé SSH, installation de Node.js 20, installation de Nginx, installation de Docker, configuration du pare-feu ufw de base. »

Une configuration initiale typique :

```bash
# 1. Mise à jour du système et installation des outils de base
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git vim ufw build-essential

# 2. Création d'un utilisateur classique (n'utilisez pas toujours root !)
sudo adduser votrenom
sudo usermod -aG sudo votrenom

# 3. Installation de Node.js (utilisez nvm, PAS apt)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 20
node -v  # vérification

# 4. Installation de Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
# Visitez http://VOTRE-IP dans le navigateur, vous devriez voir la page d'accueil Nginx

# 5. Installation de Docker (si vous utilisez des conteneurs)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker votrenom  # exécuter Docker sans sudo
# Déconnectez-vous puis reconnectez-vous pour que cela prenne effet
docker --version

# 6. Configuration du pare-feu
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo ufw status
```

## 3.1 Configuration du groupe de sécurité / pare-feu (TRÈS IMPORTANT !)

Sur AWS, cela se fait via les **Security Groups** (dans la console EC2). Sur DigitalOcean/Vultr, c'est dans les paramètres de pare-feu de leur tableau de bord. Sur Ubuntu, vous avez aussi besoin de `ufw`.

**Ouvrez au minimum ces ports :**

| Port | Usage | Recommandation |
|------|---------|---------------|
| **22** | SSH | Obligatoire ; restreignez à votre IP si possible |
| **80** | HTTP | Obligatoire pour le web |
| **443** | HTTPS | Obligatoire pour le web sécurisé |
| **3000-3999** | Ports de dev Node.js | Ouvrez temporairement pour déboguer, fermez après le déploiement |

> ⚠️ **L'erreur n°1 des débutants :** l'application tourne mais vous ne pouvez pas y accéder. Dans 90 % des cas, c'est parce que le groupe de sécurité/le pare-feu n'autorise pas ce port.

---

# 4. Trois scénarios de déploiement typiques

## 4.1 Scénario 1 : déployer un frontend statique (Vite/React/Vue)

Après `npm run build`, vous obtenez un dossier `dist/` contenant de purs fichiers HTML/CSS/JS.

**Récupérer le code sur le serveur :**

```bash
# Option A : rsync depuis la machine locale
rsync -avz --exclude=node_modules ./dist/ votrenom@VOTRE-IP:/var/www/monapp/

# Option B : git clone sur le serveur (recommandé, mises à jour plus faciles)
cd /var/www
sudo git clone https://github.com/VOTRE_USER/VOTRE_REPO.git monapp
cd monapp
npm install
npm run build
```

**Configurer Nginx :**

```bash
sudo vim /etc/nginx/sites-available/monapp
```

```nginx
server {
    listen 80;
    server_name VOTRE-IP-OU-DOMAINE;

    root /var/www/monapp/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;  # Secours pour le routage SPA
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Activer le site :

```bash
sudo ln -s /etc/nginx/sites-available/monapp /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 4.2 Scénario 2 : déployer un backend Node.js (Express/Fastify/NestJS)

Utilisez **PM2** pour garder l'application en cours d'exécution en arrière-plan :

```bash
npm install -g pm2
cd /chemin/vers/votre/app
npm install
npm run build  # si TypeScript
pm2 start dist/main.js --name "monapp"
pm2 startup && pm2 save  # démarrage automatique au boot
pm2 logs monapp  # consulter les journaux
```

**Proxy inverse Nginx :**

```nginx
server {
    listen 80;
    server_name api.votredomaine.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 4.3 Scénario 3 : déploiement full-stack avec Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:pass@db:5432/monapp
    depends_on: [db, redis]
    restart: always

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: monapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:7-alpine
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./frontend/dist:/usr/share/nginx/html
    depends_on: [app]
    restart: always

volumes:
  postgres_data:
```

Exécutez avec : `docker compose up -d`

---

# 5. Domaine et HTTPS

## 5.1 Acheter un domaine et configurer le DNS

Enregistrez un domaine via Namecheap, Cloudflare Registrar, GoDaddy ou AWS Route 53. Dans les paramètres DNS de votre domaine, ajoutez des **enregistrements A** :

| Type | Hôte | Valeur |
|------|------|-------|
| A | @ | L'IP de votre serveur |
| A | www | L'IP de votre serveur |
| A | api | L'IP de votre serveur (pour le backend) |

## 5.2 HTTPS en un clic avec Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d votredomaine.com -d www.votredomaine.com -d api.votredomaine.com
# Choisissez l'option 2 (Redirect) pour rediriger automatiquement HTTP vers HTTPS
sudo certbot renew --dry-run  # test du renouvellement automatique
```

---

# 6. Les services des fournisseurs cloud en profondeur (au-delà du VPS)

Lorsque vous vous connectez à la console AWS (ou à tout tableau de bord cloud), vous voyez des dizaines de services aux noms énigmatiques (EC2, S3, RDS, ELB, VPC…). Cette section explique les plus courants et quand les utiliser, **en prenant AWS comme exemple principal** (les concepts s'appliquent directement aux autres clouds).

## 6.1 Vue d'ensemble de l'architecture cloud

Une application web typique tournant sur le cloud ressemble à ceci :

```
Utilisateur → CloudFront (CDN) → ALB (Équilibreur de charge) → EC2 (Votre serveur d'applications)
                              │                     │
                              │                     ├── S3 (images/fichiers)
                              │                     ├── RDS (base de données)
                              │                     └── ElastiCache (Redis)
                              │
                              └── ECS/EKS (conteneurs, avancé)
                              
         └── Route 53 (DNS) → mappe votre domaine vers CloudFront/ALB
             + ACM (certificats SSL) → chiffrement HTTPS
```

Passons en revue chaque service.

## 6.2 Calcul : là où votre code s'exécute

### EC2 (Elastic Compute Cloud) — le VPS

C'est le « serveur cloud » que nous utilisons. C'est une machine virtuelle à laquelle vous pouvez vous connecter en SSH, installer ce que vous voulez et configurer comme bon vous semble.

- **Alibaba Cloud :** ECS
- **Tencent Cloud :** CVM / Lighthouse
- **DigitalOcean :** Droplet
- **Hetzner :** Cloud Server

**Quand l'utiliser :** lorsque vous avez besoin d'un contrôle total, de logiciels personnalisés, de processus toujours actifs.

### Lambda — fonctions serverless

Téléchargez des extraits de code sans gérer de serveurs. Payez par invocation et par temps d'exécution. Ne s'exécute que lorsqu'elle est déclenchée.

- **Alibaba Cloud :** Function Compute
- **Tencent Cloud :** SCF (Serverless Cloud Function)
- **GCP :** Cloud Functions

**Quand l'utiliser :** les tâches occasionnelles (gestionnaires de webhooks, traitement d'images, tâches planifiées), les API au trafic en pics. **Pas pour** les processus toujours actifs comme les bots WebSocket.

### ECS/EKS — orchestration de conteneurs

Si votre projet utilise Docker et grandit jusqu'à compter plusieurs conteneurs/services, utilisez Kubernetes pour l'orchestration.

- **AWS ECS :** le service de conteneurs plus simple d'Amazon
- **AWS EKS :** Kubernetes managé
- **Alibaba Cloud :** ACK
- **Tencent Cloud :** TKE
- **Google Cloud :** GKE

**Quand l'utiliser :** architectures de microservices multi-services, mise à l'échelle automatique, projets d'équipe. La plupart des projets personnels n'en auront pas besoin — un VPS + Docker Compose suffit.

## 6.3 Stockage : là où vivent les fichiers et les données

### S3 (Simple Storage Service) ⭐ le plus utilisé

**C'est le service le plus courant après les serveurs**, utilisé pour stocker des images, des vidéos, des PDF, des ressources de sites statiques, des sauvegardes, etc. **Ne stockez jamais les fichiers téléversés par les utilisateurs sur le disque local de votre serveur !** Ils seraient perdus si vous reconstruisez/migrez/redimensionnez le serveur.

- **Alibaba Cloud :** OSS (Object Storage Service)
- **Tencent Cloud :** COS (Cloud Object Storage)
- **Google Cloud :** GCS (Google Cloud Storage)
- **Alternative :** Cloudflare R2 (zéro frais de sortie — excellente affaire !)

**Niveau gratuit :** AWS S3 offre 5 Go de stockage standard pendant 12 mois dans le cadre du niveau gratuit. Alibaba Cloud OSS offre aux nouveaux utilisateurs 5 Go pendant 6 mois. Cloudflare R2 a un niveau gratuit permanent avec 10 Go de stockage.

**Ce que vous pouvez faire avec S3 :**
- Stocker les téléversements des utilisateurs (avatars, images, pièces jointes, photos de produits)
- Héberger des sites web statiques (téléversez votre dossier `dist/`, activez « Static website hosting »)
- Sauvegarder les exports de base de données
- Associer à un CDN CloudFront pour des téléchargements rapides dans le monde entier
- Générer des URL pré-signées pour partager des fichiers privés

**Comment utiliser S3 (parcours dans la console AWS) :**

1. Allez dans **S3 Dashboard** → **Create bucket**
2. Saisissez un nom de bucket **globalement unique** (par exemple `monapp-images`)
3. Choisissez une région AWS (par exemple us-east-1 pour l'est des États-Unis)
4. **Object Ownership :** sélectionnez « ACLs enabled » → « Bucket owner preferred » (plus simple pour l'accès public)
5. **Décochez** « Block all public access » si vous voulez des images publiques (lisez l'avertissement, ne décochez que pour du contenu public)
6. Laissez les autres paramètres par défaut → Cliquez sur **Create bucket**
7. Cliquez sur votre bucket → **Upload** → Sélectionnez des fichiers
8. Après le téléversement, chaque fichier obtient une URL comme `https://monapp-images.s3.us-east-1.amazonaws.com/avatar.jpg`
9. Utilisez cette URL directement dans votre frontend `<img src="...">`

**Utiliser S3 avec du code (exemple Node.js, demandez à l'IA d'écrire la logique complète) :**

```javascript
// npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-east-1" });

async function uploadFile(buffer, filename, contentType) {
  await s3.send(new PutObjectCommand({
    Bucket: "monapp-images",
    Key: filename,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read" // rendre le fichier accessible publiquement
  }));
  return `https://monapp-images.s3.us-east-1.amazonaws.com/${filename}`;
}
```

> ⚠️ **Note de sécurité critique :** les AWS Access Keys sont comme le mot de passe de votre S3. **Ne les codez jamais en dur dans le frontend et ne les commitez jamais dans Git !** Stockez-les dans des variables d'environnement ou utilisez des rôles IAM. Si les clés fuient, désactivez-les immédiatement dans la console IAM.

### EBS (Elastic Block Store) — disques durs virtuels

Volumes de stockage par blocs attachés aux instances EC2 (comme le disque dur de votre ordinateur). Les instances EC2 sont livrées avec un volume racine (8-60 Go en général) ; achetez des volumes EBS supplémentaires lorsque vous avez besoin de plus d'espace.

- **Alibaba Cloud :** Cloud Disk (ESSD/SSD)
- **Tencent Cloud :** CBS (Cloud Block Storage)

**Quand l'utiliser :** espace disque supplémentaire pour votre serveur, données qui doivent persister indépendamment du cycle de vie de l'instance EC2.

### EFS (Elastic File System) — stockage de fichiers partagé

Un système de fichiers réseau que plusieurs instances EC2 peuvent monter simultanément. Idéal pour partager des fichiers téléversés entre plusieurs serveurs web.

- **Alibaba Cloud :** NAS
- **Tencent Cloud :** CFS

La plupart des petits projets n'en ont pas besoin — un seul serveur + S3 suffit.

## 6.4 Bases de données : stockage structuré des données

### RDS (Relational Database Service) ⭐ courant

**N'exécutez pas votre base de données de production sur le même VPS !** Bien que techniquement possible (nous l'avons fait plus tôt dans l'exemple Docker Compose), pour la production, utilisez une base de données managée : sauvegardes automatiques, haute disponibilité, surveillance et mise à l'échelle en un clic.

- **Alibaba Cloud :** RDS
- **Tencent Cloud :** TDSQL-C / CDB
- **Google Cloud :** Cloud SQL

**Moteurs pris en charge :** MySQL, PostgreSQL, MariaDB, SQL Server, Oracle et Amazon Aurora (compatible MySQL/PostgreSQL, optimisé pour le cloud).

**Niveau gratuit :** AWS RDS offre 750 heures/mois de db.t2.micro ou db.t3.micro + 20 Go de stockage pendant 12 mois.

**Comment configurer RDS (AWS) :**

1. Allez dans **RDS** → **Create database**
2. Sélectionnez **Standard create** → Moteur : **MySQL 8.0** ou PostgreSQL
3. Modèles : **Free tier** (pour rester dans l'allocation gratuite)
4. Définissez l'identifiant de l'instance de base de données, le nom d'utilisateur principal, le mot de passe principal
5. Configuration de l'instance : **db.t3.micro** (niveau gratuit)
6. Stockage : 20 Go gp2 (éligible au niveau gratuit)
7. Connectivité : sélectionnez le **même VPC** que votre instance EC2
8. **Accès public :** Non (autorisez uniquement l'accès depuis le VPC)
9. Groupe de sécurité VPC : créez-en un nouveau, ou sélectionnez-en un existant qui autorise le port 5432/3306 depuis votre groupe de sécurité EC2
10. Cliquez sur **Create database** → attendez ~5 à 10 minutes
11. Une fois disponible, récupérez l'**Endpoint** (il ressemble à `mydb.xxxxx.us-east-1.rds.amazonaws.com:3306`)
12. Mettez à jour la variable `DATABASE_URL` de votre application pour pointer vers cet endpoint, et ajoutez votre groupe de sécurité EC2 aux règles entrantes du groupe de sécurité RDS

> 💡 **Astuce vibecoding :** dites à l'IA « J'ai une instance RDS PostgreSQL sur AWS à [endpoint], avec l'utilisateur [nom d'utilisateur], aide-moi à écrire le code de connexion et les scripts de migration pour [mon projet]. »

### ElastiCache — Redis/Memcached managés

Cache en mémoire pour les données chaudes (réduire les requêtes de base de données), stockage de sessions/tokens, files de messages, classements, etc.

- **Alibaba Cloud :** ApsaraDB for Redis
- **Tencent Cloud :** TencentDB for Redis
- **Alternative :** Upstash (Redis Serverless, niveau gratuit disponible)

Pour les petits projets, vous pouvez simplement exécuter `sudo apt install redis-server` sur votre VPS ; utilisez un Redis managé pour la production/la haute disponibilité.

## 6.5 Réseau : un accès plus rapide et plus sûr

### CloudFront — CDN (réseau de diffusion de contenu) ⭐ courant

Met en cache vos ressources statiques (images, CSS, JS, vidéos) sur des nœuds périphériques dans le monde entier, afin que les utilisateurs reçoivent le contenu depuis le nœud le plus proche.

- **Alibaba Cloud :** CDN / DCDN
- **Tencent Cloud :** CDN / EdgeOne
- **Google Cloud :** Cloud CDN
- **Alternative gratuite :** Cloudflare CDN (le plan gratuit inclut une bande passante illimitée)

**Quand l'utiliser :**
- Sites avec images/vidéos/gros fichiers
- Utilisateurs répartis dans différentes régions
- Réduire les coûts de bande passante sur votre serveur d'origine
- Cloudflare Pages = essentiellement CDN + hébergement statique

**Comment configurer CloudFront :**
1. Console CloudFront → **Create distribution**
2. Domaine d'origine : sélectionnez votre bucket S3 ou votre ALB EC2
3. Comportement de cache par défaut : rediriger HTTP vers HTTPS
4. Créez la distribution → attendez ~5 à 15 minutes pour le déploiement
5. Pointez le DNS de votre domaine vers le nom de domaine de la distribution CloudFront (par exemple `dxxx.cloudfront.net`) via un enregistrement CNAME

### ELB (Elastic Load Balancing) — équilibrage de charge

Répartit le trafic entrant entre plusieurs instances EC2, en retirant automatiquement les instances défaillantes.

- **ALB (Application Load Balancer) :** couche 7 (HTTP/HTTPS), routage par chemin, le plus courant pour les applications web
- **NLB (Network Load Balancer) :** couche 4 (TCP/UDP), latence ultra-faible
- **GLB (Gateway Load Balancer) :** pour les appliances réseau virtuelles
- **Alibaba Cloud :** SLB / ALB
- **Tencent Cloud :** CLB

Les projets à serveur unique n'en ont pas besoin. Utilisez-le lorsque vous passez à plusieurs serveurs backend.

### Route 53 — service DNS

Traduit les noms de domaine en adresses IP. La plupart des registraires de domaines incluent un DNS gratuit, mais Route 53 est profondément intégré à AWS.

- **Alibaba Cloud :** Alibaba Cloud DNS
- **Tencent Cloud :** DNSPod
- **Alternative gratuite :** Cloudflare DNS (l'un des plus rapides au monde, entièrement gratuit)

**Types d'enregistrements DNS courants :**

| Type | Usage | Exemple |
|------|---------|---------|
| **A** | Domaine → adresse IPv4 | `@ → 54.123.45.67` |
| **AAAA** | Domaine → adresse IPv6 | `@ → 2600:xxxx::` |
| **CNAME** | Domaine → un autre domaine (utilisé pour le CDN) | `static → dxxx.cloudfront.net` |
| **MX** | Serveur de messagerie (nécessaire pour l'e-mail professionnel) | - |
| **TXT** | Texte arbitraire (vérification de domaine, SPF/DKIM) | - |

### ACM (AWS Certificate Manager) — certificats SSL gratuits

AWS fournit des certificats SSL/TLS gratuits qui se renouvellent automatiquement lorsqu'ils sont utilisés avec CloudFront ou ALB. Demandez simplement un certificat, validez-le via DNS ou e-mail, puis attachez-le à votre distribution/équilibreur de charge.

- **Alibaba Cloud :** certificats SSL gratuits
- **Tencent Cloud :** certificats SSL gratuits
- **Option gratuite universelle :** Certbot + Let's Encrypt (la méthode présentée dans la section 5, renouvellement automatique tous les 90 jours)

### VPC (Virtual Private Cloud)

Un réseau virtuel isolé sur AWS où vivent vos EC2, RDS et autres ressources. Les nouveaux comptes reçoivent un VPC par défaut. L'utilisation avancée (séparation sous-réseaux publics/privés, passerelles NAT) nécessite une étude plus approfondie.

## 6.6 Autres services courants

### Enregistrement de domaine

- **Monde entier :** Namecheap, Cloudflare Registrar (confidentialité WHOIS gratuite), GoDaddy
- **AWS :** Route 53 (fait aussi l'enregistrement)
- **Chine :** Alibaba Cloud Wanwang, Tencent Cloud DNSPod (obligatoire pour l'homologation ICP)

### SES (Simple Email Service) — envoi d'e-mails

N'exploitez pas votre propre serveur de messagerie (vous finirez probablement dans les spams). Utilisez un service d'e-mail professionnel.

- **AWS SES**, SendGrid, Mailgun, Resend
- **Chine :** Alibaba Cloud Direct Mail, Tencent SES
- Utilisations : e-mails de vérification, notifications, e-mails marketing

### SNS (Simple Notification Service) — notifications SMS/Push

Pour les SMS et les notifications push mobiles. Twilio est l'alternative mondiale populaire pour les SMS.

### CloudWatch — surveillance et journaux

Surveillez le CPU/mémoire/disque EC2, consultez les journaux d'application, configurez des alertes (CPU élevé, service en panne).

- **Alibaba Cloud :** Cloud Monitor + SLS (Log Service)
- **Tencent Cloud :** Cloud Monitor + CLS
- **Alternative pour débutants :** la surveillance intégrée de PM2 + Uptime Kuma (open-source, un seul conteneur Docker à exécuter)

### S3 avancé : traitement d'images / déclencheurs Lambda

S3 peut déclencher automatiquement des fonctions Lambda lorsqu'un fichier est téléversé. Par exemple, quand un utilisateur téléverse une grande photo, une fonction Lambda peut automatiquement la redimensionner en vignettes. En Chine, Alibaba OSS dispose d'un traitement d'images intégré (ajoutez `?x-oss-process=image/resize,w_300` aux URL) et Tencent COS propose Cloud Infinite (CI) pour des fonctionnalités similaires.

## 6.7 Correspondance des services cloud : AWS ↔ clouds chinois ↔ alternatives

Référence rapide pour trouver les services équivalents :

| Catégorie | AWS | Alibaba Cloud | Tencent Cloud | Alternative gratuite/économique |
|----------|-----|--------------|---------------|------------------------|
| Serveurs cloud | EC2 | ECS | CVM / Lighthouse | DigitalOcean / Vultr / Hetzner |
| Stockage d'objets | S3 | OSS | COS | Cloudflare R2 (zéro trafic sortant) |
| Base de données relationnelle | RDS | RDS | TDSQL-C/CDB | Supabase / Neon |
| Cache Redis | ElastiCache | ApsaraDB Redis | TencentDB Redis | Upstash |
| CDN | CloudFront | CDN/DCDN | CDN/EdgeOne | Cloudflare CDN (gratuit) |
| Équilibreur de charge | ALB/NLB | SLB/ALB | CLB | Nginx auto-hébergé / Caddy |
| Serverless | Lambda | Function Compute | SCF | Cloudflare Workers |
| Conteneurs/K8s | ECS/EKS | ACK | TKE | Fly.io / Railway |
| DNS | Route 53 | Alibaba Cloud DNS | DNSPod | Cloudflare DNS (gratuit) |
| Certificats SSL | ACM (gratuit) | Certificats gratuits | Certificats gratuits | Let's Encrypt (gratuit) |
| E-mail | SES | Direct Mail | SES | Niveau gratuit Resend / SendGrid |
| SMS | SNS | SMS | SMS | Twilio |
| Surveillance | CloudWatch | Cloud Monitor | Cloud Monitor | Uptime Kuma (auto-hébergé) |
| API IA/ML | Bedrock | Tongyi Qianwen/Bailian | Hunyuan/TI | API OpenAI / Anthropic |
| Enregistrement de domaine | Route 53 | Wanwang | DNSPod | Namecheap / Cloudflare |

## 6.8 Questions courantes des débutants

**Q : Dois-je utiliser les services managés du cloud ou tout auto-héberger sur un VPS ?**

- **Projets personnels / apprentissage :** auto-hébergement sur VPS (tout en Docker Compose) — moins cher et vous apprenez davantage.
- **Production avec de vrais utilisateurs :** utilisez des services managés pour les bases de données et le stockage d'objets (sauvegarde automatique, stabilité), l'application peut rester sur le VPS.
- **Projets bien financés/en équipe :** utilisez autant que possible les services managés du cloud — consacrez votre temps à la logique métier, pas à l'exploitation.

**Q : Comment utiliser le niveau gratuit AWS sans être facturé ?**

1. Lancez toujours des instances **t2.micro/t3.micro** (marquées « Free tier eligible »)
2. Configurez une **alarme de facturation** à 0 $ ou 1 $ (Billing Dashboard → Budgets → Create budget)
3. **Terminez/supprimez** les ressources quand vous avez fini : instances EC2, bases de données RDS, buckets S3, volumes EBS, IP élastiques
4. Notez que les volumes EBS et les IP élastiques **continuent d'être facturés même lorsque l'instance est arrêtée** s'ils ne sont pas supprimés
5. Vérifiez le Billing Dashboard chaque mois

**Q : AWS vs autres fournisseurs de VPS ?**

- Apprendre l'écosystème AWS / se préparer aux métiers du cloud → Utilisez le niveau gratuit AWS
- Déploiement rapide, projets simples, coût minimal → DigitalOcean (4 $/mois) ou Hetzner (3,49 €/mois)
- Tests à l'heure → Vultr (facturation à l'heure, détruisez à tout moment)
- Charges de travail IA/GPU → Modal ou Lambda Labs
- Conteneur gratuit 24h/24 → niveau gratuit Fly.io

---

# 7. Plateformes de déploiement spécifiques aux agents IA

Si vous déployez des agents IA (pas seulement des applications web classiques), il existe des plateformes spécialement conçues pour les charges de travail IA :

## 7.1 Modal — GPU serverless pour l'IA/le ML en Python

**Site web :** https://modal.com

**Idéal pour :** les projets Python IA nécessitant une inférence GPU, des tâches planifiées, le traitement de données par lots

**Fonctionnalités :**
- Définissez des fonctions avec des décorateurs Python, `modal deploy` pour un déploiement en une commande
- Démarrage à froid des conteneurs GPU ~1 seconde, facturé à la milliseconde
- Planification intégrée, gestion des secrets, stockage partagé
- Le plan gratuit inclut 30 $/mois de crédit (suffisant pour la plupart des projets personnels)
- Ne prend en charge que Python

```python
import modal
app = modal.App("mon-agent-ia")

@app.function(gpu="A10G", timeout=300)
def run_agent(prompt: str):
    # Exécutez votre modèle/agent IA ici
    return result
```

## 7.2 Hugging Face Spaces — le premier choix pour les démos IA

**Site web :** https://huggingface.co/spaces

**Idéal pour :** présenter rapidement des démos IA (UI Gradio/Streamlit), afficher des modèles open-source

**Fonctionnalités :**
- Petites instances CPU gratuites ; GPU disponible en version payante
- Prend en charge Gradio, Streamlit, Docker
- Communauté active ; chaque Space a un code et des discussions publics
- Fork en un clic des Spaces des autres pour les modifier

## 7.3 Replicate — transformer des modèles en API

**Site web :** https://replicate.com

**Idéal pour :** transformer des modèles IA en API HTTP appelables sans gérer de serveurs

Poussez votre modèle, Replicate l'empaquette en une API HTTP, facturée à l'appel. Idéal pour publier des modèles fine-tunés.

## 7.4 Lambda Labs — instances GPU à la demande

**Site web :** https://lambdalabs.com

**Idéal pour :** l'entraînement et l'inférence gourmands en GPU, à un coût inférieur aux instances GPU AWS/GCP. A100, H100, A10 disponibles à la demande.

---

# 8. 🎯 Le flux de travail de déploiement « vibecoding » : laissez l'IA être votre DevOps

C'est l'état d'esprit le plus important pour le déploiement à l'ère du vibecoding : **vous n'avez pas besoin de mémoriser chaque commande — l'IA est votre assistant DevOps.**

## 8.1 Deux modes de collaboration avec l'IA

**Mode 1 : générer les scripts en local, exécuter manuellement**

Dites à votre assistant de codage IA (Claude Code, Trae Solo, Cursor) :

> « Je veux déployer [description du projet] sur [plateforme/serveur]. Génère :
> 1. Une liste de contrôle de déploiement complète, étape par étape
> 2. Tous les fichiers de configuration nécessaires (Nginx, PM2, Dockerfile, docker-compose)
> 3. Un script de déploiement deploy.sh
> 4. Une liste de contrôle des variables d'environnement »

Ensuite, exécutez simplement ce que l'IA génère.

**Mode 2 : l'IA se connecte directement en SSH à votre serveur (encore plus simple)**

Claude Code prend en charge les opérations SSH à distance :

```bash
claude
# Dites-lui :
# "Connecte-toi en SSH à root@MON-IP et déploie /root/monapp, configure Nginx + HTTPS + PM2"
```

L'IA vérifiera automatiquement l'environnement, installera les dépendances manquantes, récupérera le code, construira, configurera et vérifiera — le tout sans que vous tapiez des commandes manuellement.

> ⚠️ **Rappels de sécurité :**
> - Entraînez-vous d'abord sur un serveur de test pour confirmer que l'IA ne fera pas de modifications destructrices
> - Sauvegardez régulièrement les données importantes
> - Donnez à l'IA un utilisateur à privilèges minimaux (pas de root ; un utilisateur sudo convient, mais surveillez les commandes)
> - Avant que l'IA n'exécute des commandes dangereuses, vérifiez ce qu'elle s'apprête à faire

## 8.2 Modèle d'invite de déploiement universelle

Quelle que soit la plateforme/serveur choisi, remplissez ce formulaire et envoyez-le à l'IA pour obtenir un plan d'action complet :

```
Aide-moi à déployer un projet avec les informations suivantes :

[CIBLE DE DÉPLOIEMENT]
- Plateforme/Serveur : [Vercel / Railway / Fly.io / VPS Ubuntu 22.04 / AWS EC2 / ...]
- IP du serveur (si VPS) : xxx.xxx.xxx.xxx
- Déjà configuré : [connexion par clé SSH / Docker installé / Nginx installé / ...]

[INFORMATIONS SUR LE PROJET]
- Type de projet : [Next.js 14 / Vite+React / Node.js Express / Python FastAPI / ...]
- Emplacement du code : dépôt GitHub https://github.com/xxx/xxx
- Stack technique : Node.js 20 + PostgreSQL 16 + Redis 7
- Commande de démarrage : npm run start
- Écoute sur le port : 3000
- Variables d'environnement : DATABASE_URL=xxx, JWT_SECRET=xxx, OPENAI_API_KEY=xxx

[DOMAINE]
- Domaine : mondomaine.com
- DNS pointant déjà vers le serveur : Oui/Non
- Besoin de HTTPS : Oui/Non

[EXIGENCES]
1. Étapes complètes (listez séparément les opérations locales et serveur)
2. Fournissez tous les fichiers de configuration
3. Dites-moi comment vérifier que le déploiement a réussi
4. Listez les pièges courants et les étapes de dépannage
```

## 8.3 Flux de travail de dépannage assisté par l'IA

Quand les choses cassent :

1. **Consultez d'abord les journaux :**
   - Nginx : `sudo tail -50 /var/log/nginx/error.log`
   - PM2 : `pm2 logs monapp`
   - Docker : `docker compose logs app`
   - systemd : `sudo journalctl -u monapp -n 50`

2. **Copiez l'erreur complète à l'IA** avec le contexte :
   > « Je déploie du Node.js sur Ubuntu, j'obtiens une 502 Bad Gateway. Journal d'erreur Nginx : [collez]. Configuration : [collez]. Statut PM2 : [collez]. Aide-moi à déboguer. »

3. **Référence rapide des problèmes courants :**
   - **502 Bad Gateway :** le backend ne tourne pas, mauvais port, proxy_pass incorrect
   - **Impossible d'accéder à l'IP :** le groupe de sécurité n'autorise pas le port, ufw bloque, Nginx n'est pas démarré
   - **Le rafraîchissement donne une 404 :** il manque `try_files` dans Nginx pour le routage SPA
   - **Ressources statiques en 404 :** mauvais chemin root, permissions de fichiers
   - **Le certificat HTTPS échoue :** le domaine ne pointe pas vers le serveur, port 80 bloqué
   - **PM2 redémarre sans cesse :** bug de code provoquant un crash, vérifiez `pm2 logs`
   - **Délai d'expiration de la fonction Vercel :** dépasse la limite de 10 s — passez à Fly.io/Railway/VPS pour les tâches de longue durée
   - **Railway/Render 503 :** service en veille ou crédits épuisés
   - **AWS EC2 connexion refusée :** il manque la règle SSH dans le groupe de sécurité ou mauvais port

---

# 9. Conseils après le déploiement

## 9.1 Transfert de fichiers

```bash
# Local → Serveur
scp ./fichier.zip votrenom@IP:/home/votrenom/
scp -r ./dossier votrenom@IP:/home/votrenom/

# Serveur → Local
scp votrenom@IP:/home/votrenom/fichier.zip ./

# rsync (synchronisation incrémentale, recommandé pour le déploiement)
rsync -avz --exclude=node_modules --exclude=.git ./projet/ votrenom@IP:/var/www/projet/
```

## 9.2 Script de mise à jour en une commande

Créez `deploy.sh` sur votre serveur :

```bash
#!/bin/bash
set -e
cd /chemin/vers/projet
git pull origin main
npm install
npm run build
pm2 restart monapp
echo "✅ Déploiement terminé !"
```

Les mises à jour se font simplement avec `bash deploy.sh`. Pour une automatisation complète, configurez GitHub Actions (demandez à l'IA d'écrire la configuration CI/CD) afin que les pushs de code vers main se déploient automatiquement.

## 9.3 Liste de contrôle pour renforcer la sécurité

Demandez à l'IA de générer un script de durcissement complet, qui inclut généralement :
- Désactiver la connexion par mot de passe, utiliser uniquement des clés SSH
- Changer le port SSH par défaut (22 → autre chose)
- Installer fail2ban (bannissement automatique des IP de force brute)
- Activer les mises à jour de sécurité automatiques : `sudo apt install unattended-upgrades`
- Ne jamais committer de secrets/.env dans Git
- Planifier des sauvegardes régulières de la base de données vers S3

---

# 10. Résumé du chapitre

**Résumé des options de déploiement :**

| Scénario | Recommandation | Coût | Difficulté |
|----------|------------|------|-----------|
| Frontend/docs purs | Cloudflare Pages / Vercel / GitHub Pages | Gratuit | ⭐ |
| Next.js full-stack (réponse rapide) | Vercel | Gratuit / 20 $/mois | ⭐ |
| API backend / Bot (toujours actif) | Railway / Fly.io (gratuit) / VPS | 0-10 $/mois | ⭐⭐ |
| Full-stack (contrôle total) | DigitalOcean / Vultr / AWS EC2 + Docker | 4-10 $/mois | ⭐⭐⭐ |
| Démos d'agents IA | Hugging Face Spaces | Gratuit | ⭐ |
| Inférence IA sur GPU | Modal (mondial) | 0-30 $/mois de crédit | ⭐⭐ |
| Production avec utilisateurs | Services managés AWS/Azure/GCP | Variable | ⭐⭐⭐ |

**Retenez les 5 étapes fondamentales :**
1. **Choisissez une plateforme** → en fonction du type de votre projet (utilisez le tableau ci-dessus)
2. **Mettez le code dessus** → git push / rsync / déploiement automatique GitHub
3. **Configurez l'environnement** → installez Node.js/Nginx/Docker (ou la plateforme s'en charge)
4. **Gardez-le en marche** → PM2 / Docker / systemd
5. **Domaine + HTTPS** → enregistrements DNS + Certbot / ACM

**L'état d'esprit vibecoding :**
1. Comprenez *ce qui* doit être fait, pas chaque commande
2. Décrivez clairement les exigences à l'IA — elle fournit des solutions complètes
3. Comprenez ce que fait l'IA, confirmez les étapes clés
4. Quand des erreurs surviennent, collez les journaux à l'IA — elle diagnostique 90 % des problèmes
5. Sauvegardez les données importantes, utilisez le principe du moindre privilège

Déployez une fois et vous vous rendrez compte — mettre un site en ligne n'est pas si difficile. 🎯

---

<RelatedArticlesSection
  :articles="relatedArticlesMap['fr-fr/stage-2/backend/cloud-server-deployment']"
  title="Articles connexes"
  description="Continuez à apprendre les compétences d'ingénierie liées au déploiement."
/>
