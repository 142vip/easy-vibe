# Fondamentaux : Pratique des plateformes cloud
> **Guide d'apprentissage** : Les fournisseurs de services cloud ne sont pas des « sites pour acheter des serveurs », mais des « infrastructures fournissant de la puissance de calcul comme les compagnies d'eau et d'électricité ». Ce chapitre s'articule autour d'une question centrale : **par où commencer pour comprendre et utiliser les services cloud ?** Nous utiliserons des scénarios réels, des analogies vivantes et des étapes pratiques pour vous aider à construire une carte mentale complète des services cloud.

Avant de commencer, nous vous recommandons de vous familiariser avec :

- **Concepts réseau de base** : Si vous n'êtes pas encore familier avec les adresses IP, les ports et les noms de domaine, nous vous recommandons de lire d'abord [Bases des réseaux informatiques](/fr-fr/appendix/1-computer-fundamentals/computer-networks)
- **Qu'est-ce qu'une API** : Si vous ne connaissez pas encore les API, vous pouvez consulter [Introduction aux API](/fr-fr/appendix/4-server-and-backend/api-intro)

---

## 0. Introduction : pourquoi de plus en plus d'entreprises n'achètent plus de serveurs

Imaginez ce scénario :

Xiao Ming lance sa startup en 2010 et veut créer un site web. Que se passe-t-il ?

Il dépense d'abord 20 000 yuans pour acheter un serveur Dell, puis contacte un datacenter IDC et paie 3 000 yuans par mois de colocation. Ensuite, il installe lui-même Linux, configure l'environnement, et doit se soucier des problèmes matériels — disque dur à remplacer, surchauffe à résoudre. Le pire, c'est que quand le trafic augmente soudainement et que le système ne suit plus, il faut racheter des serveurs. Un an plus tard, Xiao Ming a dépensé 50 000 yuans pour un taux d'utilisation de ses serveurs de seulement 10 %.

Et la société de Xiao Hong, lancée en 2024, comment fait-elle ?

Elle ouvre le site web d'un fournisseur cloud, crée un compte, clique quelques fois et crée un serveur cloud en 2 minutes. Elle paie uniquement ce qu'elle consomme. Pas de trafic, pas de frais. Besoin de plus de puissance ? Un clic pour mettre à niveau. Envie d'ouvrir une filiale aux États-Unis ? Il suffit de changer de région. Un mois plus tard, Xiao Hong a dépensé 500 yuans, avec un taux d'utilisation de 80 %.

**Intuitivement, on pourrait penser : « les services cloud, c'est louer des serveurs ».**

Mais l'essence des services cloud va bien au-delà — c'est une **révolution de la puissance de calcul**.

Autrefois, les entreprises devaient acheter des serveurs, trouver un datacenter, installer un système d'exploitation, se soucier du matériel et rester impuissantes face aux pics de trafic. Aujourd'hui, il suffit de créer un compte, cliquer quelques fois, payer à l'usage, bénéficier d'une mise à l'échelle automatique et d'un déploiement mondial. Cette transformation, c'est comme passer du puits dans son jardin à l'eau courante au robinet.

---

## 1. Présentation et définition : un fournisseur de services cloud

### 1.1 Un service de calcul comme l'eau et l'électricité

L'essence d'un fournisseur de services cloud est d'**emballer la puissance de calcul, le stockage et les capacités réseau en services standardisés**, et de les fournir via Internet — comme une compagnie des eaux fournit l'eau et une compagnie d'électricité fournit le courant.

L'intelligence de ce modèle réside dans le **paiement à l'usage**. Pas besoin d'acheter du matériel à l'avance en grande quantité — vous payez uniquement selon votre consommation réelle. Besoin de plus de ressources ? Un clic suffit. Certains services sont même facturés à la seconde, pour une flexibilité maximale. Et comme les fournisseurs cloud disposent de datacenters dans des dizaines de pays, vous pouvez déployer vos applications à l'échelle mondiale. Toutes les opérations sont en libre-service, disponibles 24h/24, sans approbation manuelle.

### 1.2 Différence entre les services cloud et la colocation traditionnelle

La colocation IDC traditionnelle, c'est comme acheter son propre générateur d'électricité. Vous devez d'abord acheter le matériel (serveurs), puis trouver un endroit pour l'installer (colocation en datacenter), et assurer la maintenance vous-même (installer le système, réparer le matériel). Si la puissance ne suffit plus, il faut racheter un générateur. Ce processus peut prendre de quelques jours à quelques semaines, et les coûts sont fixes — vous payez que vous utilisiez ou non.

Les services cloud, c'est comme se brancher au réseau électrique. Pas besoin d'acheter de générateur — il suffit de tirer un câble (créer un compte), puis de payer selon votre consommation. Besoin de plus de puissance ? Changez pour un forfait plus puissant, en quelques minutes. Dans ce modèle, les coûts sont variables : vous payez ce que vous consommez. Le fournisseur cloud gère toute la maintenance matérielle — vous vous concentrez uniquement sur votre activité.

### 1.3 Cloud public, cloud privé et cloud hybride

Comme les restaurants ont différents modèles d'exploitation, les services cloud se déclinent en trois types.

Le **cloud public** est comme un restaurant ouvert à tous — ressources partagées, accessibles à tous. AWS, Alibaba Cloud et Azure sont des clouds publics, adaptés à la grande majorité des entreprises et des particuliers. C'est le point central de cet ouvrage, car c'est le plus courant et le plus adapté à l'apprentissage.

Le **cloud privé** est comme une cuisine privée — construit en interne, ressources dédiées. OpenStack et VMware en sont des exemples typiques, adaptés aux grandes entreprises, aux gouvernements et aux banques qui exigent un niveau très élevé de sécurité des données.

Le **cloud hybride** combine les deux — une partie des activités sur le cloud public, l'autre sur le cloud privé. Chaque fournisseur propose des solutions hybrides, adaptées aux scénarios nécessitant à la fois conformité réglementaire et élasticité.

👇 **Essayez par vous-même** :
Cliquez sur les cartes de service ci-dessous pour découvrir les six grandes catégories de services cloud.

<CloudServicesOverview />

---

## 2. Présentation : sont les principaux fournisseurs de services cloud

### 2.1 Les trois géants internationaux : AWS, Azure, Google Cloud

Sur le marché mondial des services cloud, trois fournisseurs dominent.

**AWS (Amazon Web Services)** est le service cloud lancé par Amazon en 2006. Il est numéro un mondial avec environ 32 % de parts de marché. C'est le « grand magasin » du cloud, avec la gamme de services la plus complète — plus de 200 services — et la plus grande maturité. La documentation et les ressources communautaires sont les plus riches. Les prix sont relativement élevés, mais le rapport qualité-prix est excellent. Particulièrement adapté aux entreprises s'internationalisant, aux startups et aux grandes entreprises Internet.

**Microsoft Azure** est le service cloud lancé par Microsoft en 2010. Numéro deux mondial avec environ 23 % de parts de marché. Son plus grand atout est l'intégration profonde avec l'écosystème Windows et Office, une large base de clients entreprise, d'excellentes capacités de cloud hybride et une compatibilité naturelle pour les développeurs .NET. Si votre entreprise utilise déjà la stack Microsoft, Azure est le choix évident.

**Google Cloud Platform (GCP)** est le service cloud lancé par Google en 2011. Numéro trois mondial avec environ 10 % de parts de marché. Il est en pointe sur Kubernetes, l'analyse de données et l'IA, avec une forte capacité d'innovation technique et des prix relativement compétitifs. Mais ses parts de marché sont plus petites et son écosystème moins complet que les deux leaders. Adapté aux entreprises axées sur la technologie, aux applications conteneurisées et aux projets d'IA.

### 2.2 Les trois géants chinois : Alibaba Cloud, Tencent Cloud, Huawei Cloud

Sur le marché chinois des services cloud, trois fournisseurs dominent également.

**Alibaba Cloud** est la division cloud d'Alibaba, fondée en 2009. Numéro un en Chine avec environ 40 % de parts de marché. Premier fournisseur cloud chinois et le plus mature, avec une gamme de services complète et une expertise accumulée lors du Double Onze. Les prix sont relativement élevés, mais la stabilité et l'exhaustivité fonctionnelle sont au top. Particulièrement adapté aux entreprises chinoises et aux projets liés au e-commerce.

**Tencent Cloud** est la division cloud de Tencent, fondée en 2013. Numéro deux en Chine avec environ 15 % de parts de marché. Fort dans le gaming, l'audio/vidéo, bien intégré avec l'écosystème WeChat et QQ, avec des prix compétitifs et une croissance rapide ces dernières années. Si vous développez dans le gaming, les réseaux sociaux ou le live streaming, Tencent Cloud est un bon choix.

**Huawei Cloud** est la division cloud de Huawei, fondée en 2015. Numéro trois en Chine avec environ 10 % de parts de marché. Solide expertise en matériel, large base de clients gouvernementaux et entreprise, forte capacité en sécurité et conformité, et des puces IA (Ascend) différenciantes. Adapté aux projets gouvernementaux, aux grandes entreprises publiques et à l'industrie manufacturière.

### 2.3 Comment choisir un fournisseur cloud

Choisir un fournisseur cloud, c'est comme choisir un logement — il faut considérer l'emplacement, le prix, les équipements et bien d'autres facteurs.

**D'abord, le marché cible**. Où se trouvent vos utilisateurs ? Si vos utilisateurs sont en Chine, choisissez Alibaba Cloud ou Tencent Cloud. S'ils sont à l'étranger, optez pour AWS ou Azure. Pour un business mondial, choisissez un fournisseur avec une couverture multi-régions.

**Ensuite, la stack technique**. Quelle technologie utilisez-vous ? Si vous utilisez les technologies Microsoft, choisissez Azure. Pour Kubernetes et le big data, Google Cloud est pertinent. Pour un usage général, AWS est un choix solide.

**Puis le coût**. Pour les petits projets exploratoires, un fournisseur abordable comme Tencent Cloud ou UCloud peut convenir. Pour la production à grande échelle, il faut examiner le coût total — AWS peut être plus économique à long terme.

**Enfin, l'écosystème**. Si vous utilisez déjà certains services comme GitHub ou Office 365, choisir un fournisseur du même écosystème facilitera l'intégration.

Conseil pratique : pour les débutants ou les petits projets, choisissez Alibaba Cloud ou Tencent Cloud (documentation en chinois, support local). Pour les projets à l'international, AWS est le plus mature et offre la meilleure couverture mondiale. Les grandes entreprises pourront avoir besoin d'une stratégie multi-cloud.

---

## 3. Approche et mise en œuvre : utilise-t-on généralement les services cloud

### 3.1 Le flux complet de l'inscription au déploiement

La première étape est la création d'un compte. Le processus est similaire à l'ouverture d'un compte en banque — une vérification d'identité est nécessaire. Rendez-vous sur le site du fournisseur cloud, cliquez sur « Inscription gratuite », remplissez votre adresse e-mail et votre mot de passe, vérifiez votre numéro de téléphone, puis téléchargez votre pièce d'identité pour l'authentification réelle. Enfin, ajoutez un moyen de paiement. Comptez environ 10 à 20 minutes pour l'ensemble du processus.

Une fois inscrit, familiarisez-vous avec quelques concepts clés. La **région (Region)** est la zone géographique où se trouvent les datacenters du fournisseur cloud, par exemple Chine Est (Hangzhou), États-Unis Est (Virginie) ou Asie-Pacifique (Singapour). Le principe est de choisir la région la plus proche de vos utilisateurs pour minimiser la latence. La **zone de disponibilité (Availability Zone, AZ)** désigne les datacenters multiples au sein d'une même région, isolés les uns des autres pour accroître la disponibilité. Si une zone tombe en panne, l'autre continue de fonctionner. Une **instance (Instance)** est un serveur virtuel, par exemple un serveur cloud 2 cœurs / 4 Go, facturé à l'heure ou au forfait.

### 3.2 Créer votre premier serveur cloud

Créer un serveur cloud, c'est comme assembler un ordinateur — mais en cliquant sur une interface web. Choisissez d'abord le mode de paiement : au volume pour les environnements de test, au forfait mensuel/annuel pour les environnements de production. Sélectionnez ensuite la région la plus proche. Pour la spécification de l'instance, 2 cœurs / 4 Go suffisent pour un environnement de test. Pour l'image, choisissez un système d'exploitation comme CentOS 7.9 ou Ubuntu 20.04. Côté stockage, 40 Go de disque système feront l'affaire. Pour le réseau, utilisez le VPC par défaut avec une facturation au trafic sortant. Enfin, définissez le mot de passe root et conservez-le précieusement. Comptez environ 5 minutes — l'instance sera prête 1 à 2 minutes après sa création.

👇 **Essayez par vous-même** :
Choisissez une configuration et découvrez les prix et les scénarios d'utilisation des différentes spécifications.

<ComputeInstanceDemo />

### 3.3 Se connecter au serveur cloud et déployer une application

La connexion à un serveur Linux se fait de préférence via SSH. Pour une connexion par mot de passe : `ssh root@adresse-ip-publique-de-votre-serveur`, puis saisissez le mot de passe. Pour une connexion par clé (plus sécurisée) : `ssh -i votre-cle-privee.pem root@adresse-ip-publique-de-votre-serveur`.

Une fois connecté, vous pouvez déployer votre application. D'abord, mettez à jour le système : sur CentOS, `sudo yum update -y` ; sur Ubuntu, `sudo apt update && sudo apt upgrade -y`. Ensuite, installez les logiciels nécessaires, par exemple Node.js. Puis téléversez votre code via git ou scp. Enfin, installez les dépendances et lancez l'application.

### 3.4 Scénarios d'utilisation courants

**Héberger un site personnel ou un blog** nécessite un serveur cloud et un nom de domaine. 1 cœur / 2 Go suffit, pour un coût d'environ 50 à 100 yuans par mois. Stack technique possible : Nginx + fichiers statiques ou WordPress.

**Déployer un backend API** nécessite un serveur cloud et une base de données. 2 cœurs / 4 Go au minimum, pour un coût d'environ 200 à 500 yuans par mois. Stack technique possible : Node.js ou Python avec MySQL ou PostgreSQL.

**Stocker des images ou des vidéos** est recommandé avec le stockage objet, facturé au volume stocké et au trafic. Le coût varie de quelques yuans à quelques centaines de yuans par mois. Avantages : pas de gestion de disque dur, sauvegarde automatique, et possibilité d'ajouter un CDN pour l'accélération.

👇 **Essayez par vous-même** :
Découvrez les différents types de services de stockage cloud et leurs scénarios d'utilisation.

<StorageTypeDemo />

---

## 4. Approche et mise en œuvre : acheter et appeler des API

### 4.1 Les modèles de facturation des services cloud

Les services cloud proposent plusieurs modes de facturation. Les comprendre peut vous faire économiser beaucoup d'argent.

**Le paiement à l'usage (Pay-as-you-go)**, c'est comme acheter un ticket de cinéma à l'unité — vous payez ce que vous consommez, sans frais quand vous n'utilisez pas. Adapté aux environnements de test et aux projets au trafic instable. Les serveurs cloud sont facturés à l'heure, le stockage objet au Go et au nombre de requêtes, et les API IA au nombre d'appels.

**L'engagement annuel/mensuel ou les instances réservées**, c'est comme acheter un abonnement mensuel ou annuel — vous vous engagez sur une durée et bénéficiez d'une remise, généralement de 30 à 60 %. Adapté aux environnements de production stables à long terme. Par exemple, un serveur 2 cœurs / 4 Go coûte 200 yuans/mois au tarif à l'usage, mais seulement 140 yuans/mois avec un engagement d'un an.

**Les instances spot ou préemptives**, c'est comme un ticket standby — le prix est très bas, jusqu'à 90 % d'économie, mais l'instance peut être récupérée de force. Adapté aux traitements par lots et aux tolérants aux pannes, comme le traitement de données ou le rendu. Le risque est que le fournisseur cloud récupère l'instance en cas de pression sur les ressources.

**Le Serverless facturé à l'appel**, c'est comme un taxi — vous ne vous souciez pas du serveur, seulement du nombre d'appels. La facturation combine le nombre d'appels, le temps de calcul et le trafic. Adapté aux API et aux tâches pilotées par événements. Par exemple, avec Alibaba Cloud Function Compute, les premiers millions d'appels sont gratuits, puis 1,33 yuans par million d'appels supplémentaires.

👇 **Essayez par vous-même** :
Utilisez le calculateur de coûts pour comparer les différences de prix entre les modes de facturation.

<PricingCalculator />

### 4.2 Le processus complet d'achat d'appels API

Prenons l'exemple de l'appel à l'API Qwen (Tongyi Qianwen). Le processus se déroule en quatre étapes.

**Première étape : Activer le service**. Rendez-vous sur la plateforme IA du fournisseur cloud, trouvez Qwen ou DashScope, cliquez sur « Activer maintenant » ou « Essai gratuit ». Comptez environ 2 minutes.

**Deuxième étape : Obtenir la clé API**. Accédez à la gestion des API-KEY dans la console, cliquez sur « Créer ma API-KEY », puis copiez et sauvegardez cette clé. Important : la clé API n'est affichée qu'une seule fois — sauvegardez-la immédiatement.

**Troisième étape : Configurer les permissions**. Accédez au contrôle d'accès (RAM) ou à la gestion des permissions (IAM), créez un utilisateur ou un rôle, et n'autorisez que les permissions nécessaires — par exemple, uniquement l'appel à Qwen, sans pouvoir supprimer de serveurs. C'est le principe du moindre privilège.

**Quatrième étape : Tester l'appel**. Envoyez un premier appel en Python ou JavaScript pour vérifier que l'API fonctionne correctement.

---

## 5. Pratique : déployer un site web depuis zéro

### 5.1 Scénario et choix de la solution

Supposons que vous êtes développeur front-end et que vous voulez déployer un blog personnel. Les besoins sont : site statique (HTML/CSS/JS), votre propre nom de domaine, accès rapide dans le monde entier, et coût minimal.

Trois solutions sont possibles. La solution serveur cloud a un coût moyen et une difficulté moyenne, adaptée aux scénarios nécessitant un backend. La solution stockage objet + CDN a un coût faible et une difficulté faible, adaptée aux sites purement statiques — c'est notre recommandation. La solution Serverless a un coût très faible et une difficulté moyenne, adaptée aux contenus dynamiques.

Nous recommandons le stockage objet + CDN parce que le coût est le plus bas (potentiellement gratuit), la configuration est la plus simple, et la vitesse est optimale grâce au CDN.

👇 **Essayez par vous-même** :
Suivez les instructions étape par étape pour découvrir le processus complet de déploiement d'un site web.

<DeployWorkflowDemo />

### 5.2 Étapes de mise en œuvre

**Étape 1 : Préparer les fichiers du site web**. Créer un simple index.html :

```html
<!DOCTYPE html>
<html>
<head>
  <title>Mon blog</title>
</head>
<body>
  <h1>Bienvenue sur mon blog</h1>
  <p>Ceci est mon premier article.</p>
</body>
</html>
```

**Étape 2 : Créer un Bucket de stockage objet**. Se connecter à la console cloud, trouver le stockage objet (OSS/S3), cliquer sur « Créer un Bucket ». Configurer le nom (par ex. mon-blog-2024, globalement unique), choisir la région (la plus proche), définir les permissions sur lecture publique (le site web doit être accessible).

**Étape 3 : Téléverser les fichiers**. Entrer dans le Bucket, cliquer sur « Téléverser des fichiers », sélectionner index.html, attendre la fin du téléversement.

**Étape 4 : Configurer l'hébergement de site statique**. Accéder aux paramètres du Bucket, trouver « Pages statiques » ou « Hébergement web », activer la fonctionnalité, définir la page d'accueil par défaut sur index.html, sauvegarder.

**Étape 5 : Lier un nom de domaine (facultatif)**. Acheter un nom de domaine, ajouter un enregistrement CNAME pointant vers le domaine du Bucket, lier le domaine personnalisé dans le Bucket, configurer HTTPS.

**Étape 6 : Configurer le CDN (recommandé)**. Activer le service CDN, ajouter le domaine d'accélération, sélectionner l'origine (votre Bucket), attendre l'activation du CDN (quelques minutes à quelques heures).

### 5.3 Estimation des coûts

Estimation mensuelle : stockage objet 0 à 5 yuans (facturé au volume), trafic CDN 0 à 10 yuans (facturé au trafic, avec un quota gratuit), nom de domaine 5 à 10 yuans (calculé au prorata annuel). Total : 5 à 25 yuans par mois. Un petit site pourrait même être entièrement gratuit.

---

## 6. Résumé et prochaines étapes

### 6.1 Rappel des points clés

L'essence des services cloud peut se résumer ainsi : les fournisseurs cloud sont les compagnies d'eau et d'électricité de la puissance de calcul, offrant des capacités de paiement à l'usage, de déploiement mondial et de libre-service. Le flux d'utilisation est : choisir un fournisseur, créer un compte, créer des ressources, configurer les permissions, surveiller les coûts.

Les décisions clés sont les suivantes : le choix du fournisseur dépend du marché, de la stack technique et du coût ; le choix du mode de facturation se fait entre paiement à l'usage, engagement au forfait et Serverless ; la configuration des permissions suit le principe du moindre privilège, active le MFA et réalise des audits réguliers ; le contrôle des coûts passe par la surveillance de la consommation, l'utilisation de remises et la libération rapide des ressources inutilisées.

### 6.2 Parcours d'apprentissage recommandé

Semaine 1 : apprendre les fondamentaux théoriques, comprendre les concepts de base du cloud, créer un compte cloud, lancer un premier serveur. Semaine 2 : pratiquer en déployant un site statique, configurer un nom de domaine et un CDN, apprendre les commandes Linux de base. Semaine 3 : monter en compétence avec la gestion des permissions (IAM), la surveillance et les alertes, l'optimisation des coûts. Semaine 4 : projet pratique en déployant une application complète, en configurant la base de données et le stockage, en implémentant la mise à l'échelle automatique.

### 6.3 Ressources recommandées

La documentation officielle comprend les centres de documentation Alibaba Cloud, la documentation AWS en chinois et la documentation Tencent Cloud. Les plateformes d'apprentissage incluent Alibaba Cloud University, l'offre gratuite AWS et Tencent Cloud Lab. Les ressources communautaires comprennent la communauté Cloud Native, le site Serverless en chinois et la rubrique Cloud Computing sur InfoQ.

---

## 7. Glossaire

| Terme anglais | Traduction française | Explication |
| :--- | :--- | :--- |
| **Cloud Provider** | Fournisseur de services cloud | Entreprise proposant des services de cloud computing, comme AWS, Alibaba Cloud |
| **Region** | Région | Zone géographique où se trouve un datacenter |
| **Availability Zone** | Zone de disponibilité | Datacenter indépendant au sein d'une région |
| **Instance** | Instance | Un serveur virtuel |
| **Image/AMI** | Image | Modèle de système d'exploitation préconfiguré |
| **VPC** | Virtual Private Cloud | Environnement réseau virtuel isolé |
| **IAM/RAM** | Gestion des identités et des accès | Système de gestion des permissions |
| **User** | Utilisateur | Une identité spécifique |
| **Group** | Groupe | Ensemble d'utilisateurs |
| **Role** | Rôle | Identité temporaire |
| **Policy** | Stratégie | Document JSON définissant les permissions |
| **API Key** | Clé API | Identifiant pour appeler des API |
| **AccessKey** | Clé d'accès | Identifiant d'accès programmatique (ID + Secret) |
| **MFA** | Authentification multi-facteurs | Méthode de connexion nécessitant mot de passe + code de vérification |
| **CDN** | Réseau de diffusion de contenu | Service d'accélération mondial, mettant en cache les ressources statiques |
| **OSS/S3** | Stockage objet | Service de stockage de fichiers |
| **ECS/EC2** | Serveur cloud | Service de machines virtuelles |
| **RDS** | Service de base de données relationnelle | Base de données gérée |
| **Serverless** | Sans serveur | Modèle de calcul sans gestion de serveur |
| **Pay-as-you-go** | Paiement à l'usage | Mode de facturation où l'on paie ce que l'on consomme |
| **Reserved Instance** | Instance réservée | Mode de facturation avec engagement annuel ou mensuel |
| **Spot Instance** | Instance spot | Instance bon marché mais pouvant être récupérée |
