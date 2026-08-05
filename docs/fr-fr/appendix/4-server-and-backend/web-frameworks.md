# Principes : Nature des frameworks Web backend
::: tip Question centrale
**Le code est prêt, comment faire en sorte que le monde entier puisse y accéder ?** C'est comme demander : voulez-vous tenir un petit stand au bord de la route ou gérer une chaîne de restaurants internationale ? Le choix de l'architecture backend détermine combien de clients votre "restaurant" peut servir.
:::

---

## 1. Motivation et justification : comprendre l'évolution des architectures

Imaginez que vous planifiez un long voyage. Vous pouvez choisir le vélo, la voiture, le train à grande vitesse ou l'avion. Chaque moyen correspond à un scénario : le vélo pour les courtes distances et l'exercice, l'avion pour les traversées de continents.

**Le choix de l'architecture backend est similaire.**

Depuis la naissance d'Internet, l'architecture backend a traversé plusieurs révolutions majeures. Chaque évolution ne vise pas à "suivre la mode", mais à résoudre un problème spécifique de l'époque :

| Époque | Problème central | Évolution architecturale |
| ----- | ------------------------ | ------------------- |
| 1990s | Comment faire fonctionner un site Web | Serveur physique |
| 2000s | Comment maintenir un code de plus en plus complexe | Architecture monolithe + MVC |
| 2010s | Comment faire évoluer et collaborer sur des systèmes très grands | Microservices + Conteneurisation |
| 2020s | Comment réduire les coûts et la complexité d'exploitation | Serverless + Cloud natif |

::: tip Que nous dit ce tableau ?
Lisons-le ligne par ligne :

**1990s -> 2000s** : de "pourvu que ça marche" à "il faut maintenir". Les sites passent de pages statiques à des applications dynamiques, le volume de code explose, nécessitant une meilleure organisation.

**2000s -> 2010s** : du "mono-site" au "distribué". Le nombre d'utilisateurs croît de manière explosive, un seul serveur ne suffit plus, il faut scinder le système et monter en charge horizontalement.

**2010s -> 2020s** : de "l'exploitation maison" au "services cloud". Conteneurs et microservices sont puissants, mais les coûts d'exploitation sont élevés ; Serverless permet aux développeurs de se concentrer uniquement sur la logique métier.

**Enseignement central** : l'évolution architecturale n'est pas un jeu de sélection technologique, c'est un processus de **résolution de problèmes concrets**. Chaque étape a ses scénarios adaptés ; il n'y a pas de "meilleure architecture", seulement "l'architecture la plus adaptée".
:::

**L'intérêt de comprendre cette évolution :**

1. **Éviter de réinventer la roue** : beaucoup de concepts "nouveaux" existent depuis des décennies ; connaître l'histoire permet de se placer sur les épaules de géants
2. **Faire des choix technologiques raisonnables** : il n'y a pas de meilleure architecture, seulement celle adaptée à l'étape actuelle
3. **Comprendre les compromis techniques** : chaque évolution implique un arbitrage entre **efficacité de développement**, **performance système** et **complexité d'exploitation**
4. **Anticiper les tendances** : l'histoire a tendance à se répéter ; comprendre les patterns du passé aide à saisir les directions futures

<EvolutionIntroDemo />

---

## 2. L'ère des serveurs physiques (1990s)

### 2.1 Qu'est-ce qu'un serveur physique

Aux débuts d'Internet, le backend était un **serveur physique** (un véritable ordinateur) placé dans un datacenter.

::: tip Explication simple
Un **serveur physique** est comme votre ordinateur de bureau, mais :

- Allumé 24h/24, 7j/7
- Placé dans un datacenter spécialisé (climatisation, onduleurs, systèmes anti-incendie)
- Connecté à un réseau à très haut débit (fibre entreprise)
- Doté d'une adresse IP publique fixe (accessible du monde entier)

C'est comme la différence entre votre cuisine personnelle et un restaurant professionnel : la vôtre sert à cuisiner de temps en temps, le restaurant est une cuisine professionnelle, ouverte en continu, avec un équipement dédié.
:::

### 2.2 Caractéristiques clés

- **Déploiement mono-site** : toutes les applications tournent sur une seule machine physique
- **Exploitation manuelle** : installation en rack, câblage, installation du système d'exploitation
- **Montée en charge verticale** : en cas de performance insuffisante, seul l'achat d'une machine plus puissante est possible

::: details Montée en charge verticale vs horizontale
**Montée en charge verticale (Scale Up)** : upgrader la configuration d'un seul serveur (plus de CPU, plus de RAM, disque plus rapide).

**Montée en charge horizontale (Scale Out)** : ajouter davantage de serveurs travaillant ensemble.

**Analogie** :

- Montée en charge verticale : agrandir un restaurant, le rendre plus luxueux, mais avec un seul cuisinier
- Montée en charge horizontale : ouvrir des franchises, chaque restaurant est modeste, mais il y a 100 succursales

**Avantages et inconvénients** :

- La montée verticale est simple, mais a un plafond (les serveurs haut de gamme sont chers et limités)
- La montée horizontale est théoriquement illimitée, mais nécessite de résoudre les problèmes de cohérence des données
:::

### 2.3 Points de douleur

- **Lent** : chaque modification de code nécessite un upload manuel puis un redémarrage du serveur
- **Cher** : pour augmenter la capacité, il faut acheter une machine plus puissante (montée en charge verticale)
- **Difficile à étendre** : une seule machine encaisse toutes les requêtes ; quand le CPU est saturé, il ne reste qu'à faire la queue

<PhysicalServerDemo />

### 2.4 Avantages et inconvénients de l'ère des serveurs physiques

| Dimension | Évaluation |
| ------------ | ------------------------------------------------------------ |
| **Avantages** | Contrôle total du matériel, performances prévisibles ; pas d'overhead de virtualisation ; isolation physique des données, sécurité élevée |
| **Inconvénients** | Cycle d'achat long (semaines) ; investissement initial élevé (CapEx) ; faible taux d'utilisation des ressources ; difficile à étendre |
| **Scénarios adaptés** | Systèmes financiers critiques, systèmes gouvernementaux classifiés, scénarios exigeant une stricte souveraineté des données |

::: tip CapEx vs OpEx
**CapEx** (Capital Expenditure) : dépenses d'investissement, investissement massif en une seule fois pour l'achat de matériel.

**OpEx** (Operating Expenditure) : dépenses de fonctionnement, paiement à l'usage (comme un serveur cloud).

**Analogie** :

- CapEx : acheter une maison, payer des centaines de milliers en une fois, puis seulement les charges mensuelles
- OpEx : louer un appartement, payer un loyer mensuel, sans débourser une grosse somme d'un coup

**Enseignement de l'ère du cloud** : Serverless et les services cloud font passer davantage d'entreprises du CapEx à l'OpEx, abaissant le seuil d'entrée pour les startups.
:::

---

## 3. L'ère de l'architecture monolithe (2000s)

### 3.1 Qu'est-ce que l'architecture monolithe

Avec l'apparition de frameworks (Rails / Django / Spring), tout le monde a mis toutes les fonctionnalités dans une seule application.

::: tip Explication simple
L'**architecture monolithe** (Monolith) est comme un hypermarché :

- Les rayons vêtements, alimentation, électronique sont tous dans le même bâtiment
- Tous les employés travaillent dans le même système de gestion
- Si le bâtiment subit une coupure de courant, tous les rayons ferment

En comparaison, les microservices sont comme une rue commerçante : chaque boutique fonctionne indépendamment, la fermeture de l'une n'affecte pas les autres.
:::

<MonolithDemo />

### 3.2 Caractéristiques clés

- **Dépôt de code unique** : tous les modules fonctionnels dans le même projet
- **Base de données partagée** : tous les modules utilisent la même base de données
- **Déploiement unifié** : toute l'application est packagée et déployée comme un tout

### 3.3 Avantages

- **Développement simple** : un seul projet pour toutes les fonctionnalités
- **Déploiement facile** : déposer un gros package sur le serveur et c'est prêt
- **Débogage aisé** : démarrer en local pour déboguer toutes les fonctionnalités

### 3.4 Point de douleur : l'effet avalanche

Imaginez que le cuisinier chargé de couper les légumes se blesse (un bug dans le code). Toute la cuisine doit s'arrêter pour soigner la blessure, et aucun client ne peut être servi.

C'est le risque majeur de l'architecture monolithe : **mauvaise isolation**.

::: details Cas réel d'effet avalanche
Vente flash du Double Onze dans une entreprise e-commerce :

- Le service de commandes lève une exception suite à une erreur de calcul de prix sur un produit
- L'exception n'est pas interceptée correctement, provoquant l'épuisement du pool de threads
- Toutes les requêtes suivantes (navigation produit, recherche, connexion utilisateur) sont bloquées
- Le site Web entier est totalement paralysé pendant 1 heure

**Avec des microservices** :

- Le service de commandes tombe, mais la navigation, la recherche et la connexion restent disponibles
- Les utilisateurs peuvent au moins continuer à parcourir les produits, les pertes sont minimisées
:::

### 3.5 Avantages, inconvénients et scénarios de l'architecture monolithe

| Dimension | Évaluation |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Avantages** | Développement simple, pas de complexité distribuée ; débogage facile, démarrage local pour tout tester ; déploiement simple, un seul package ; gestion transactionnelle aisée, une base de données unique garantit ACID |
| **Inconvénients** | Fort couplage du code, le code gonfle avec la croissance métier ; stack technologique unique, difficile de mettre à niveau localement ; extension difficile, seul le passage à l'échelle globale est possible ; mauvaise isolation des pannes, un module défaillant impacte tout ; faible efficacité de collaboration en équipe, tout le monde modifie le même code |
| **Scénarios adaptés** | Validation MVP de startups, petites équipes (<10 personnes), métier relativement simple, priorité à la vitesse de livraison sur l'évolutivité |
| **Scénarios non adaptés** | Grandes équipes en développement parallèle, publication fréquente de modules différents, certains modules nécessitant une mise à l'échelle indépendante |

::: tip Conseils pour les débutants
Si vous apprenez le développement backend, **il est fortement recommandé de commencer par l'architecture monolithe** :

1. **Apprendre à marcher d'abord** : comprendre HTTP, les bases de données, l'architecture MVC de base
2. **Puis courir** : quand le projet rencontre réellement des problèmes d'évolutivité, envisager les microservices
3. **Éviter la sur-ingénierie** : beaucoup de "microservices" en entreprise sont en réalité des "monolithes distribués", encore plus difficiles à maintenir

**Parcours d'apprentissage** :

- Étape 1 : écrire une application monolithe complète avec Spring Boot / Django / Rails
- Étape 2 : face à un goulot d'étranglement, essayer d'en extraire 1-2 services
- Étape 3 : quand l'équipe dépasse 50 personnes et le système est réellement complexe, passer aux microservices complets
:::

### 3.6 Stack technologique de l'architecture monolithe

| Langage/Framework | Caractéristique | Entreprises représentatives |
| -------------------------- | ---------------------------- | --------------------- |
| **Java + Spring** | Premier choix pour le développement entreprise, écosystème complet | Alibaba, JD.com |
| **PHP + Laravel/ThinkPHP** | Développement rapide, adapté aux projets petite/moyenne taille | Facebook à ses débuts, Weibo |
| **Python + Django/Flask** | Haute productivité, adapté aux prototypes rapides | Instagram, Pinterest |
| **Ruby on Rails** | Convention plutôt que configuration, chouchou des startups | GitHub, Twitter (début) |
| **Node.js + Express** | Langage unique frontend/backend, scénarios I/O intensifs | Netflix, Uber |

---

## 4. Conteneurisation et microservices (2010s)

### 4.1 Pourquoi les microservices

Les douleurs de l'architecture monolithe ont éclaté dans les années 2010 :

- **Code trop volumineux** : un projet de plusieurs millions de lignes, un nouvel arrivant met un mois à comprendre
- **Déploiement trop lent** : 30 minutes pour un build, une publication avec une grande prudence
- **Collaboration trop difficile** : 100 développeurs sur le même projet, des conflits de code quotidiens
- **Extension trop coûteuse** : besoin d'étendre uniquement le "service de chat", mais il faut répliquer toute l'application

**L'idée centrale des microservices** : découper la grande application en plusieurs petits services, chacun :

- Développé et déployé indépendamment
- Ayant sa propre base de données
- Communiquant via des API

<ContainerDockerDemo />

::: tip Qu'est-ce que Docker ?
**Docker** est comme un "conteneur maritime" :

- Chaque conteneur contient sa cargaison indépendante (code + bibliothèques + environnement d'exécution)
- Quel que soit le port de destination (le serveur), il suffit d'ouvrir le conteneur pour démarrer
- Plus besoin de s'inquiéter que "cette machine n'a pas Python 3.9" ou "l'autre machine manque d'une bibliothèque"

**Analogie** :

- Sans Docker : à chaque déménagement, charger meubles, électroménager, vêtements un par un dans le camion, puis tout réinstaller à l'arrivée
- Avec Docker : tout est packagé dans un conteneur, le camion le transporte, et à l'arrivée on le pose et c'est utilisable

**Valeur centrale** : "Construire une fois, exécuter partout".
:::

### 4.2 Chronologie technologique

<TechStackTimelineDemo />

### 4.3 Architecture microservices

Pour résoudre les problèmes du monolithe, nous avons découpé la grande cuisine en plusieurs petites cuisines (services) :

- Un service dédié aux utilisateurs
- Un service dédié aux commandes
- Un service dédié aux paiements

<MicroservicesDemo />

### 4.4 Orchestration Kubernetes

Quand le nombre de conteneurs atteint des centaines, voire des milliers, il faut un "système de gestion portuaire" :

- **Kubernetes (K8s)** : responsable de l'affectation des conteneurs aux machines appropriées (ordonnancement, mise à l'échelle, mises à jour progressives)
- **Service Mesh** : responsable des règles de circulation entre services (disjoncteur, limitation de débit, nouvelles tentatives, observabilité)

<KubernetesDemo />

::: tip Qu'est-ce que l'"orchestration" ?
L'**orchestration** (Orchestration) désigne le système de gestion automatisée d'un grand nombre de conteneurs.

**Analogie** :

- Sans K8s : vous gérez manuellement 100 conteneurs ; si l'un tombe, redémarrage manuel ; si le trafic augmente, ajout manuel de machines
- Avec K8s : vous lui dites "je veux que ce service ait toujours 10 instances en fonctionnement", et il s'occupe automatiquement de :
  - Trouver le serveur avec le plus de ressources et y placer le conteneur
  - Redémarrer automatiquement un conteneur en panne
  - Monter à 20 instances quand le trafic augmente
  - Lors des mises à jour, effectuer un remplacement progressif (arrêter 1 ancienne instance, démarrer 1 nouvelle, et ainsi de suite)

**Point clé** : les microservices ne se résument pas à "découper et c'est bon" ; la vraie difficulté réside dans la **gouvernance et l'exploitation**.
:::

### 4.5 Avantages et inconvénients des microservices et de la conteneurisation

| Dimension | Évaluation |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Avantages** | Déploiement indépendant des services, stacks technologiques hétérogènes ; isolation des pannes, un service en panne n'impacte pas le reste ; mise à l'échelle à la demande, les services critiques montent seuls en charge ; collaboration inter-équipes facilitée, chaque équipe gère ses services ; bases de code plus petites, plus faciles à comprendre et maintenir |
| **Inconvénients** | Complexité distribuée élevée (latence réseau, transactions distribuées, découverte de services) ; coûts d'exploitation élevés, nécessite une équipe DevOps dédiée ; débogage difficile, les problèmes peuvent nécessiter un suivi multi-services ; cohérence des données difficile à garantir ; infrastructure de déploiement et monitoring complexe |
| **Scénarios adaptés** | Grandes équipes (>50 personnes), métier complexe nécessitant une évolution modulaire indépendante, certains modules nécessitant une mise à l'échelle séparée, besoin de stacks multi-langages, exigences de haute disponibilité |
| **Scénarios non adaptés** | Petites équipes, métier simple, trafic faible et stable, absence d'équipe Ops dédiée |

::: details Les pièges des microservices
**Piege 1 : le monolithe distribué**

Découpage en 10 microservices, mais étroitement couplés :

- Le service A appelle B, B appelle C, C rappelle A
- Modifier une fonctionnalité nécessite de toucher 5 services
- Le déploiement doit respecter un ordre strict, sinon le système plante

**C'est pire qu'un monolithe** : vous avez la complexité du monolithe sans les bénéfices de déploiement indépendant des microservices.

**Piege 2 : le sur-découpage**

Transformer une fonctionnalité de 100 lignes en un service indépendant :

- 10 services de 100 lignes chacun
- L'overhead de communication inter-services (sérialisation/désérialisation réseau) pèse plus que la logique métier réelle
- Les coûts d'exploitation explosent : il faut déployer, monitorer et collecter les logs de 10 services

**Bonne pratique** : découper du point de vue de la cohésion fonctionnelle ; un microservice doit représenter une capacité métier complète (ex. "service de commandes", et non "service de création de commandes" + "service de consultation de commandes").
:::

### 4.6 Stack technologique des microservices

| Catégorie | Technologies/Outils | Rôle |
| ------------ | ---------------------------------- | -------------------- |
| **Conteneurisation** | Docker, containerd | Packaging et isolation des applications |
| **Orchestration** | Kubernetes, Docker Swarm | Gestion des conteneurs et mise à l'échelle automatique |
| **Découverte de services** | Consul, etcd, ZooKeeper | Enregistrement et découverte de services |
| **Passerelle API** | Kong, Zuul, Envoy | Point d'entrée unique, routage, limitation de débit |
| **Centre de configuration** | Apollo, Nacos, Spring Cloud Config | Gestion centralisée de la configuration |
| **Monitoring et alertes** | Prometheus, Grafana, ELK | Surveillance des métriques et analyse des logs |
| **Tracing distribué** | Jaeger, Zipkin, SkyWalking | Suivi des requêtes distribuées |
| **Service Mesh** | Istio, Linkerd | Gouvernance du trafic et sécurité |

---

## 5. L'ère Serverless et Cloud natif (2020s+)

### 5.1 Pourquoi Serverless

Les microservices sont performants, mais maintenir des dizaines de petites cuisines reste épuisant. Il faut se soucier de :

- La cuisine est-elle assez grande ? (mise à l'échelle des serveurs)
- Que faire en cas de coupure de courant ? (haute disponibilité)
- Comment gérer trop de conteneurs ? (coûts d'exploitation)

<ServerlessDemo />

::: tip Serverless ne signifie pas "pas de serveur"
**Serverless** signifie "vous n'avez pas besoin de gérer de serveurs", et non qu'il n'y a pas de serveurs.

**Analogie** :

- **Ere des serveurs physiques** : vous achetez le terrain, construisez, aménagez, embauchez des cuisiniers, achetez les ingrédients... tout par vous-même
- **Ere des serveurs cloud** : vous louez un restaurant déjà aménagé, mais gérez les cuisiniers et l'exploitation
- **Ere Serverless** : vous concevez uniquement le menu, le cloud dispose de cuisines partagées et de cuisiniers professionnels ; vous passez commande, ils cuisinent, et vous payez à l'usage

**Changement fondamental** :

- Avant : acheter des serveurs -> configurer l'environnement -> déployer le code -> monitorer -> monter en charge -> maintenir
- Maintenant : écrire du code -> uploader -> payer à l'usage

**Comme la livraison de repas** : vous n'avez pas besoin de cuisine, il suffit de concevoir le menu ; quelqu'un cuisine pour vous.
:::

### 5.2 Qu'est-ce que Serverless

**Serverless = FaaS + BaaS**

**FaaS** (Function as a Service, fonction en tant que service) :

- Vous écrivez uniquement des fonctions (ex. "envoyer un email de bienvenue à l'inscription d'un utilisateur")
- Le fournisseur cloud exécute la fonction, avec mise à l'échelle automatique
- Représentants typiques : AWS Lambda, Alibaba Cloud Function Compute

**BaaS** (Backend as a Service, backend en tant que service) :

- Authentification -> Auth0 / Supabase Auth
- Paiement -> Stripe
- Base de données -> Supabase / Firebase / DynamoDB
- Messagerie -> Kafka / SQS

::: tip Scénarios adaptés à Serverless
**Meilleurs scénarios** :

1. **Trafic à marées** : applications de livraison de repas, fort trafic le midi, quasi nul la nuit. Serverless alloue automatiquement 1000 machines le midi et réduit à 0 la nuit
2. **Piloté par événements** : "après le chargement d'une image par l'utilisateur, compresser automatiquement l'image"
3. **Validation rapide** : petites équipes, MVP, projets de hackathon

**Scénarios non adaptés** :

1. **Tâches longues** : transcodage vidéo (peut durer 1 heure, le temps d'exécution maximal d'une fonction est généralement de 15 minutes)
2. **Applications nécessitant une faible latence** : trading haute fréquence (le délai de démarrage à froid peut aller de quelques dizaines de millisecondes à plusieurs secondes)
3. **Besoin de contrôle fin du bas niveau** : optimisation du noyau OS, accès direct au GPU
:::

### 5.3 Avantages et inconvénients de Serverless et du Cloud natif

| Dimension | Évaluation |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Avantages** | Zéro coût Ops, les développeurs se concentrent uniquement sur le code métier ; mise à l'échelle automatique, réponse parfaite aux pics de trafic ; paiement à l'usage, coût quasi nul sans trafic ; mise en ligne rapide, déploiement mondial en quelques minutes ; haute disponibilité intégrée, le cloud gère automatiquement le basculement |
| **Inconvénients** | Latence de démarrage à froid (quelques centaines de ms à plusieurs secondes) ; limite de durée d'exécution (généralement 5-15 minutes) ; débogage difficile, simulation locale du cloud incomplète ; risque de verrouillage fournisseur ; inadapté aux tâches longues ou de calcul intensif ; coût potentiellement supérieur au traditionnel pour un trafic soutenu à haute fréquence |
| **Scénarios adaptés** | Traitement événementiel (traitement d'images, notifications) ; applications à trafic à marées (pages événementielles, promotions) ; prototypage rapide et MVP ; API bas débit ou tâches de fond ; petites équipes sans Ops dédié |
| **Scénarios non adaptés** | Applications nécessitant une faible latence continue ; calculs de longue durée ; scénarios sensibles au démarrage à froid (trading haute fréquence) ; besoin de contrôle fin de l'infrastructure bas niveau |

::: details Comparaison des coûts : quand Serverless est-il plus cher ?
**Scénario 1 : accès bas débit**

- Serveur traditionnel : 20 $/mois (indépendamment du trafic)
- Serverless : 1 million de requetes x 0,0002 $/requete = 20 $ (paiement uniquement sur le trafic réel)
- **Conclusion** : scénario bas débit, Serverless est plus économique

**Scénario 2 : accès soutenu à haut débit**

- Serveur traditionnel : 20 $/mois
- Serverless : 100 millions de requetes x 0,0002 $/requete = 20 000 $
- **Conclusion** : scénario haut débit soutenu, le serveur traditionnel est plus économique

**Scénario 3 : trafic à marées**

- Serveur traditionnel : pour absorber les pics, un serveur à 100 $/mois (utilisation moyenne de seulement 10 %)
- Serverless : 20 $ aux pics, quasi 0 $ le reste du temps
- **Conclusion** : trafic à marées, Serverless est plus économique

**Enseignement** : ne pas adopter Serverless aveuglément ; effectuer une simulation de coûts en fonction du profil de trafic réel.
:::

### 5.4 Stack technologique et plateformes Serverless

| Catégorie | Technologie/Plateforme | Caractéristique |
| ------------ | ------------------------ | ---------------------------- |
| **Plateformes FaaS** | AWS Lambda | Premier service FaaS, écosystème le plus mature |
|              | Azure Functions | Forte intégration cloud Microsoft, friendly .NET |
|              | Google Cloud Functions | Intégration profonde avec les services GCP |
|              | Alibaba Cloud Function Compute | Écosystème Chine complet, bon optimisation du cold start |
|              | Tencent Cloud Functions | Intégration avec l'écosystème WeChat |
|              | Vercel/Netlify Functions | Friendly développeurs frontend, déploiement en périphérie |
| **Services BaaS** | Firebase | Solution backend mobile de Google |
|              | Supabase | Alternative open source à Firebase basée sur PostgreSQL |
|              | AWS Amplify | Plateforme de développement mobile et Web d'AWS |
| **Outils de déploiement** | Serverless Framework | Déploiement multi-cloud, communauté active |
|              | Terraform | Infrastructure as Code |
|              | Pulumi | Définition de l'infrastructure en langage de programmation |

---

## 6. Comparaison des architectures et guide de sélection

### 6.1 Comparaison panoramique des architectures

<ArchitectureComparisonDemo />

| Dimension | Serveur physique | Architecture monolithe | Microservices + conteneurs | Serverless |
| ---------------- | ---------------------- | ------------------ | ------------------------ | ------------------ |
| **Taille d'équipe** | 1-5 personnes | 5-50 personnes | 50-500 personnes | 1-20 personnes |
| **Complexité de déploiement** | Très élevée | Faible | Très élevée | Très faible |
| **Coûts Ops** | Élevés | Moyens | Très élevés | Faibles |
| **Évolutivité** | Faible | Montée en charge verticale limitée | Montée en charge horizontale excellente | Mise à l'échelle automatique |
| **Flexibilité technologique** | Aucune | Unique | Diversifiée | Limitée |
| **Démarrage à froid** | Aucun | Aucun | Temps de démarrage du conteneur | Latence présente |
| **Scénarios adaptés** | Systèmes anciens, exigences réglementaires spécifiques | Startups, métier simple | Grandes entreprises Internet, métier complexe | Validation rapide, pilotage événementiel |

### 6.2 Arbre de décision pour la sélection technologique

```
Début de la sélection
    |
    +-- L'équipe a des Ops professionnels ?
    |   +-- Oui -> Envisager microservices ou serveur physique
    |   +-- Non -> Continuer
    |
    +-- Besoin de mise en ligne rapide pour valider une idée ?
    |   +-- Oui -> Serverless ou monolithe
    |   +-- Non -> Continuer
    |
    +-- Équipe de plus de 50 personnes ?
    |   +-- Oui -> Envisager les microservices
    |   +-- Non -> Continuer
    |
    +-- Le trafic présente des pics et des creux marqués ?
    |   +-- Oui -> Serverless
    |   +-- Non -> Architecture monolithe (recommandée pour les startups)
    |
    +-- Exigences spéciales (conformité, systèmes anciens) ?
        +-- Oui -> Serveur physique
```

::: tip Conseils de sélection pour les débutants
**Si vous êtes développeur ou petite équipe :**

1. **Étape 0 (apprentissage)** : exécuter une application monolithe en local, comprendre HTTP, les bases de données, l'architecture de base
2. **Étape 1 (MVP)** : déployer l'application monolithe sur un serveur cloud (ex. Alibaba Cloud ECS, AWS EC2)
3. **Étape 2 (croissance)** : quand l'équipe dépasse 10 personnes et le métier se complexifie, envisager d'extraire 1-2 microservices
4. **Étape 3 (maturité)** : quand l'équipe dépasse 50 personnes et le trafic atteint le million, passer aux microservices complets

**Principe clé** : ne pas passer aux microservices dès le départ ; c'est de "l'optimisation prématurée". Laisser l'architecture évoluer avec le métier.
:::

### 6.3 Architectures recommandées par scénario

#### Scénario 1 : développeur indépendant / projet parallèle

- **Architecture recommandée** : Serverless (Vercel/Netlify) ou application monolithe
- **Raison** : quasiment zéro coût Ops, paiement à l'usage, mise en ligne rapide
- **Stack exemple** : Next.js + Vercel + Supabase

#### Scénario 2 : validation MVP de startup

- **Architecture recommandée** : architecture monolithe + serveur cloud
- **Raison** : vitesse de développement élevée, l'équipe peut se concentrer sur la logique métier plutôt que l'infrastructure
- **Stack exemple** : Spring Boot / Django / Rails + RDS + ECS

#### Scénario 3 : entreprise en croissance (équipe de 10-50 personnes)

- **Architecture recommandée** : monolithe modulaire ou microservices légers
- **Raison** : le couplage du code commence à poser problème, mais la complexité complète des microservices n'est pas encore nécessaire
- **Stack exemple** : Spring Cloud / Go Micro + Kubernetes

#### Scénario 4 : grande entreprise Internet

- **Architecture recommandée** : microservices + Service Mesh + architecture de plateforme intermédiaire
- **Raison** : grande équipe, métier complexe, nécessité de cycles de release indépendants et de stacks technologiques multiples
- **Stack exemple** : framework RPC maison + Istio + plateforme PaaS interne

#### Scénario 5 : pilotage événementiel / trafic à marées

- **Architecture recommandée** : Serverless + bus d'événements
- **Raison** : fortes variations de trafic, optimisation extrême des coûts et mise à l'échelle automatique nécessaires
- **Stack exemple** : AWS Lambda + API Gateway + EventBridge

---

## 7. Résumé et parcours d'apprentissage

### 7.1 Points clés

L'évolution de l'architecture backend est fondamentalement un exercice d'**addition** et de **soustraction** :

| Époque | Architecture | Ce que fait le développeur | Ce que fait l'Ops |
| :------------- | :----- | :--------------- | :----------------- |
| **Ere physique** | Mono-site | Écrire des scripts, déployer manuellement | Maintenir le datacenter et le matériel |
| **Ere monolithe** | Un seul bloc | Écrire toute la logique métier | Maintenir quelques gros serveurs |
| **Ere microservices** | Découpage | Se concentrer sur un seul métier | Maintenir le cluster K8s (très fatigant !) |
| **Serverless** | Fonctions | Écrire uniquement les fonctions clés | Prendre un thé (le cloud s'occupe de tout) |

**Enseignements clés** :

- L'évolution architecturale n'est pas "la nouvelle technologie remplace l'ancienne", mais un **changement des scénarios adaptés**
- Il n'y a pas de balle d'argent ; chaque architecture a ses limites
- Le choix architectural doit prendre en compte : taille de l'équipe, complexité métier, profil de trafic, capacités Ops

### 7.2 Recommandations de parcours d'apprentissage

Selon votre stade de carrière, voici les parcours recommandés :

#### Etape 1 : consolider les bases (0-1 an)

**Objectif** : comprendre les concepts fondamentaux du backend, être capable de développer indépendamment une application monolithe

- Maîtriser un langage backend (Java/Python/Go au choix)
- Apprendre le protocole HTTP et la conception d'API RESTful
- Maîtriser une base de données relationnelle (MySQL/PostgreSQL)
- Comprendre les bases du cache (Redis)
- Apprendre Git et les commandes Linux de base
- **Projet pratique** : réaliser une application CRUD complète en monolithe (ex. système de blog, gestion de tâches)

#### Etape 2 : élargir les compétences (1-3 ans)

**Objectif** : comprendre les systèmes distribués, participer au développement de microservices

- Approfondir l'architecture microservices et les stratégies de découpage
- Maîtriser les bases de Docker et Kubernetes
- Apprendre les files de messages (Kafka/RabbitMQ)
- Comprendre les transactions distribuées et la cohérence
- Maîtriser le monitoring et les logs (Prometheus/ELK)
- **Projet pratique** : découper une application monolithe en 3-5 microservices, déployer avec Docker

#### Etape 3 : spécialisation (3-5 ans)

**Objectif** : concevoir de grands systèmes, acquérir des capacités de sélection technologique

- Comprendre en profondeur l'architecture cloud native (Service Mesh, Serverless)
- Maîtriser la planification de capacité et l'optimisation de performance
- Comprendre l'architecture multi-site active et la conception de reprise après sinistre
- Apprendre le DDD (Domain-Driven Design)
- Développer le jugement technologique et la pensée architecturale
- **Projet pratique** : concevoir l'architecture d'un système supportant des millions d'utilisateurs, incluant haute disponibilité, mise à l'échelle élastique, etc.

### 7.3 Ressources d'apprentissage continu

**Livres** :

- "Designing Data-Intensive Applications" (DDIA) - Lecture incontournable sur les systèmes distribués
- "Cloud Native Patterns"
- "Building Microservices"
- "Domain-Driven Design"

**Ressources en ligne** :

- Documentation d'architecture officielle AWS/Azure/Alibaba Cloud
- Documentation des projets CNCF (Cloud Native Computing Foundation)
- Blogs techniques des grandes entreprises (Netflix Tech Blog, Alibaba Tech, etc.)

---

## 8. Glossaire

| Terme | Nom complet | Explication |
| :---------------- | :-------------------------------- | :------------------------------------------------ |
| **Backend** | - | Système côté serveur, responsable de la logique métier, du stockage de données et des interfaces externes |
| **CGI** | Common Gateway Interface | Technologie Web dynamique des débuts, traitement des requêtes via des scripts |
| **Monolith** | - | Architecture monolithe, toute la logique métier packagée dans une seule application |
| **Microservices** | - | Architecture microservices, découpage du métier en plusieurs services indépendants |
| **Container** | - | Technologie de conteneurisation, packaging de l'application et de ses dépendances en unités portables |
| **K8s** | Kubernetes | Plateforme d'orchestration de conteneurs, pour l'ordonnancement, la mise à l'échelle et la gouvernance |
| **Service Mesh** | - | Maille de services, responsable de la gouvernance de communication, l'observabilité et la sécurité entre microservices |
| **Serverless** | - | Calcul sans serveur, les développeurs écrivent uniquement des fonctions, la plateforme les exécute et les met à l'échelle |
| **BaaS** | Backend as a Service | Services backend cloud prêts à l'emploi (authentification, base de données, paiement, etc.) |
| **CI/CD** | Continuous Integration / Delivery | Intégration continue et livraison continue, automatisation des tests et du déploiement |
| **Observability** | - | Observabilité, utilisation des logs/métriques/traces pour comprendre l'état de fonctionnement du système |
