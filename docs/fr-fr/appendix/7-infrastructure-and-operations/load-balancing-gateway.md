# Principes : Équilibrage de charge et passerelles
::: tip Question centrale
**Lorsqu'un seul serveur ne peut plus supporter la charge, comment répartir le trafic de manière « intelligente » vers plusieurs instances de serveurs ?** L'équilibrage de charge est le « distributeur » des systèmes distribués modernes. Cet article explore en profondeur la philosophie de conception et les pratiques d'ingénierie de l'équilibrage de charge à travers des cas réels (caisse de salon de thé, tri de colis, circulation routière).
:::

---

## 1. Motivation et justification : « l'équilibrage de charge »

### 1.1 Partons d'un cas réel : l'évolution de l'architecture d'un site web

Une startup a rencontré de graves problèmes de performance lors de la croissance rapide de sa base d'utilisateurs :

**Reconstitution du scénario :**

```
Étape 1 : Serveur unique
Utilisateur → Serveur (1 cœur, 2 Go)
       ↓
  1000 utilisateurs actifs/jour → Heures de pointe : 1000 visiteurs simultanés
       ↓
Problème : CPU à 100 %, temps de réponse lent, pannes fréquentes
```

::: warning Le problème fatal du serveur unique

- **Goulot d'étranglement de performance** : CPU à 100 %, temps de réponse > 5 secondes
- **Point unique de défaillance** : si le serveur tombe en panne, tout le site est indisponible
- **Évolution difficile** : seule la mise à niveau verticale est possible (ajouter CPU, mémoire), coûteuse et limitée
  :::

**Architecture améliorée (avec équilibrage de charge) :**

```
Étape 2 : Serveurs multiples + Équilibreur de charge
Utilisateur → Équilibreur de charge (Nginx)
       ↓
     ├→ Serveur 1 (1 cœur, 2 Go)
     ├→ Serveur 2 (1 cœur, 2 Go)
     └→ Serveur 3 (1 cœur, 2 Go)
```

::: tip Résultats après amélioration

- **Performances améliorées** : 3 serveurs traitent en parallèle, temps de réponse < 1 seconde
- **Haute disponibilité** : si un serveur tombe en panne, les autres continuent de servir
- **Évolution horizontale** : besoin de plus de performance ? Ajoutez simplement des serveurs
  :::

### 1.2 Analogie avec la vie quotidienne : le salon de thé

Imaginez que vous gérez un salon de thé à la mode :

- **1 caisse** : les clients font la queue, les suivants s'impatientent, mauvaises avis
- **3 caisses** : le personnel répartit les clients entre les caisses, efficacité multipliée par 3

**L'équilibreur de charge est le « distributeur de caisses » :**

- **Utilisateurs** (clients) → Demandent un service
- **Équilibreur de charge** (distributeur) → Répartit les requêtes vers différents serveurs
- **Serveurs** (caisses) → Traitent les requêtes

<LoadBalancerTypesDemo />

---

## 2. Qu'est-ce que l'équilibrage de charge

### 2.1 Équilibrage de charge couche 4 (L4) : ne regarde que le numéro de porte

**Fonctionne au niveau transport (TCP/UDP)**, comme un livreur qui ne regarde que votre **numéro de porte (adresse IP + numéro de port)**, sans se soucier de ce qui se passe chez vous.

**Caractéristiques :**

- **Vitesse extrême** : ne fait qu'une simple redirection d'adresse, n'analyse pas le contenu des paquets
- **Cas d'utilisation** : connexions à la base de données, cache Redis, serveurs de jeux à connexion longue
- **Produits représentatifs** : LVS (Linux Virtual Server), AWS NLB, Azure Load Balancer

::: details Principe de fonctionnement

```
Requête client → Équilibreur de charge L4 → Serveur backend
              ↓
         Ne regarde que IP + Port
              ↓
         Transfert rapide (sans dépaqueter le contenu)
```

:::

### 2.2 Équilibrage de charge couche 7 (L7) : examine le contenu du artefact de build

**Fonctionne au niveau applicatif (HTTP/HTTPS)**, comme un livreur qui, au-delà du numéro de porte, **ouvre le colis pour examiner son contenu** et décider comment le livrer en conséquence.

**Caractéristiques :**

- **Routage intelligent** : peut effectuer un routage fin basé sur le chemin URL, les en-têtes HTTP, les cookies, etc.
- **Fonctionnalités avancées** : terminaison SSL, cache de contenu, compression, WAF de sécurité
- **Cas d'utilisation** : applications Web, passerelles API, architectures microservices
- **Produits représentatifs** : Nginx, HAProxy, AWS ALB, Envoy

::: details Principe de fonctionnement

```
Requête client → Équilibreur de charge L7 → Analyse le contenu HTTP
              ↓
         Examine URL, Header, Cookie
              ↓
         Routage intelligent vers un serveur spécifique
```

:::

### 2.3 Comparaison L4 vs L7

| Dimension           | Équilibrage L4     | Équilibrage L7          |
| :------------- | :------------------- | :------------------------ |
| **Couche de travail**   | Transport (TCP/UDP)      | Applicatif (HTTP/HTTPS)        |
| **Critère de décision**   | Adresse IP + numéro de port      | URL, Header, Cookie, Body |
| **Vitesse de traitement**   | Extrêmement rapide (mode noyau)     | Assez rapide (analyse en espace utilisateur)          |
| **Richesse fonctionnelle** | Transfert de base             | Terminaison SSL, cache, compression, WAF  |
| **Scénario typique**   | Base de données, jeux, connexions longues | Applications Web, passerelles API, microservices  |
| **Produits représentatifs**   | LVS, AWS NLB         | Nginx, HAProxy, AWS ALB   |

---

## 3. Problème central n°1 : comment éviter que les serveurs « en panne » continuent à recevoir des requêtes

### 3.1 Vérifications de santé : ne laissez pas un serveur « malade »拖垮 le système

Imaginez que l'une de vos caisses tombe en panne, mais que le distributeur ne le sait pas et continue d'envoyer des clients vers elle. La file d'attente s'allonge, les clients se plaignent.

**Le contrôle de santé (Health Check) est la « sentinelle » qui empêche cette situation**. Il effectue régulièrement un « bilan de santé » de chaque serveur, retire immédiatement ceux qui sont « malades » et les réintègre une fois « guéris ».

<!-- <HealthCheckDemo /> -->

### 3.2 Contrôle de santé actif vs passif

**Contrôle de santé actif (Active Health Check)** : l'équilibreur de charge « frappe à la porte » pour demander au serveur « Es-tu toujours là ? »

- Envoie régulièrement des requêtes de sondage (par ex. HTTP /health, TCP ping)
- Un délai de réponse ou un code d'erreur indique que le serveur est défectueux
- **Avantage** : résultat de détection fiable
- **Inconvénient** : génère du trafic de sondage supplémentaire

**Contrôle de santé passif (Passive Health Check)** : l'équilibreur de charge « observe » les réponses du trafic réel

- Statistiques sur le temps de réponse et le taux d'erreur des requêtes réelles
- Des échecs consécutifs indiquent que le serveur est défectueux
- **Avantage** : aucun trafic supplémentaire
- **Inconvénient** : nécessite suffisamment de trafic pour porter un jugement

::: details Tableau des seuils
| Indicateur | Seuil de santé | Seuil de défectuosité | Description |
|:---|:---|:---|:---|
| **Code d'état HTTP** | 200-399 | 400+ ou timeout | Les 4xx/5xx sont considérés comme des échecs |
| **Connexion TCP** | Établie avec succès | Délai de connexion | Vérifier si le port est accessible |
| **Temps de réponse** | < 500 ms | > 2000 ms | Le délai est généralement fixé entre 2 et 5 secondes |
| **Échecs consécutifs** | - | 3 | Éviter les faux positifs dus à un incident isolé |
| **Intervalle de vérification** | - | 5 s | Trop fréquent augmente la charge |

::: tip Piège courant : seuils trop « sensibles »
Une équipe avait fixé le seuil de temps de réponse du contrôle de santé à 100 ms, alors que le temps de réponse moyen de leur application oscillait entre 80 et 120 ms. Résultat : les serveurs étaient fréquemment marqués comme « défectueux », le trafic oscillait sans cesse entre serveurs sains et défectueux, et la disponibilité globale du système diminuait.

**La bonne approche** : le seuil doit être fixé à **2 à 3 fois le temps de réponse au 99e percentile**, laissant une marge suffisante pour les variations normales.
:::

---

## 4. Problème central n°2 : comment s'assurer que le « client habituel » trouve toujours le même « instance backend »

### 4.1 Persistance de session : le « client habituel » trouve toujours le même « instance backend »

Imaginez que vous êtes un habitué du salon de thé, toujours accueilli par le même employé qui connaît vos préférences (moitié de sucre, sans glace). Le service est rapide et attentionné. Mais si à chaque visite vous avez un nouvel employé, vous devez tout répéter, l'efficacité en prend un coup.

**La persistance de session (Session Persistence/Sticky Session)** résout précisément ce problème : s'assurer que les requêtes d'un même utilisateur sont toujours routées vers le même serveur backend.

<SessionPersistenceDemo />

### 4.2 Comparaison de trois mécanismes de persistance de session

| Mécanisme           | Principe de mise en œuvre                                  | Avantage                            | Inconvénient                          | Cas d'utilisation                |
| :------------- | :---------------------------------------- | :------------------------------ | :---------------------------- | :---------------------- |
| **Insertion de cookie** | L'équilibreur de charge insère un cookie dans la réponse, les requêtes ultérieures portent ce cookie | Insensible aux changements d'IP, la persistance est établie dès la première requête | Le client doit supporter les cookies, qui peuvent être désactivés | Panier e-commerce, maintien de la connexion |
| **Hachage IP**     | Calcul de hachage sur l'IP du client, mappage vers un serveur spécifique     | Aucun support client requis, sans état           | Un changement d'IP fait perdre la session, répartition difficilement uniforme | Environnements sans cookie, WebSocket |
| **Table de sessions sticky** | L'équilibreur de charge maintient une table de mappage session → serveur                | Supporte la réplication de session et le basculement          | Consomme la mémoire de l'équilibreur de charge, nécessite une synchronisation supplémentaire       | Scénarios exigeant une haute disponibilité stricte    |

::: tip Recommandations d'utilisation

- **Insertion de cookie** : recommandée en priorité, bonne compatibilité
- **Hachage IP** : uniquement pour les scénarios spéciaux comme WebSocket
- **Table de sessions sticky** : combinée aux cookies, offre une capacité de basculement
  :::

---

## 5. Problème central n°3 : comment réaliser un déploiement sans interruption

### 5.1 Déploiement bleu-vert : publication sans interruption par « basculement instantané »

**Idée fondamentale** : maintenir simultanément deux environnements de production identiques (environnement bleu et environnement vert), mais un seul est exposé au public.

<BlueGreenDeploymentDemo />

**Flux de travail :**

1. **État initial** : l'environnement bleu exécute v1.0 (production), l'environnement vert est en attente.
2. **Déploiement de la nouvelle version** : déployer v1.1 dans l'environnement vert, effectuer des tests de fumigation internes.
3. **Basculement du trafic** : pointer l'équilibreur de charge vers l'environnement vert, le trafic bascule instantanément vers v1.1.
4. **Surveillance** : observer l'état de l'environnement vert, confirmer l'absence d'anomalies.
5. **Conservation de l'ancienne version** : l'environnement bleu conserve v1.0 pendant un certain temps (par ex. 24 heures), comme assurance de rollback rapide.

::: tip Analyse des avantages et inconvénients
| Avantages | Inconvénients |
|:---|:---|
| Temps d'indisponibilité nul, le basculement s'effectue en quelques millisecondes | Coût de ressources élevé, nécessite la maintenance simultanée de deux environnements |
| Rollback rapide, retour à l'environnement précédent dès qu'un problème est détecté | Les modifications de schéma de base de données nécessitent un traitement de compatibilité particulier |
| Le nouvel environnement peut être testé exhaustivement avant de prendre le trafic | Non applicable aux services avec état (comme les connexions longues WebSocket) |

:::

### 5.2 Publication canari : stratégie de déploiement progressif en « petites étapes rapides »

Le nom « publication canari » vient de la pratique historique des « canaris de mine » — les mineurs emmenaient un canari dans la mine ; si le canari montrait des signes anormaux, cela indiquait une fuite de gaz toxique et les mineurs évacuaient immédiatement. Dans la publication logicielle, la publication canari consiste à faire tester d'abord la nouvelle version par un petit nombre d'utilisateurs, puis à étendre progressivement la portée si aucun problème n'est détecté.

<CanaryReleaseDemo />

**Idée fondamentale :**

1. **Trafic limité en premier** : rediriger d'abord 1 % du trafic vers les serveurs de la nouvelle version.
2. **Surveillance des indicateurs** : suivre en continu le taux d'erreur, la latence et les indicateurs clés de l'activité.
3. **Augmentation progressive** : si tout est normal, augmenter progressivement la proportion à 5 %, 10 %, 25 %, 50 %, 100 %.
4. **Rollback rapide** : dès qu'une anomalie est détectée, basculer immédiatement tout le trafic vers l'ancienne version.

::: tip Avantages de la publication canari
| Avantage | Description |
|:---|:---|
| Risque maîtrisé | Même si la nouvelle version a un bug critique, seuls quelques utilisateurs sont affectés |
| Validation réelle | Testée dans le véritable environnement de production, plus fiable que l'environnement de test |
| Itération rapide | L'équipe peut publier de nouvelles fonctionnalités plus fréquemment et en toute confiance |
| Économie de ressources | Pas besoin de préparer deux environnements complets comme pour le déploiement bleu-vert |

:::

---

## 6. Problème central n°4 : comment permettre au système de « respirer » tout seul

### 6.1 Mise à l'échelle automatique : le système s'adapte comme un restaurant qui « ajuste son personnel »

Imaginez que vous gérez un restaurant :

- **Heure de pointe du déjeuner** : 10 serveurs sont nécessaires, mais à 15 h en période creuse, 2 suffisent
- Si vous gardez 10 serveurs en permanence : les coûts salariaux explosent
- Si vous n'en gardez que 2 : aux heures de pointe, les clients s'impatientent et partent

**La mise à l'échelle automatique (Auto Scaling)** permet au système de s'adapter comme un restaurant — ajouter automatiquement des serveurs quand la charge est élevée, en retirer quand elle est basse.

<AutoScalingDemo />

### 6.2 Choix des métriques de mise à l'échelle

Le cœur de la mise à l'échelle automatique est de répondre à une question : **quand faut-il ajouter des serveurs ? quand faut-il en retirer ?**

Métriques de décision courantes :

| Métrique                | Seuil de montée en charge   | Seuil de baisse   | Cas d'utilisation         |
| :------------------ | :--------- | :--------- | :--------------- |
| **Utilisation CPU**       | > 70 %      | < 30 %      | Applications à forte charge de calcul   |
| **Utilisation mémoire**      | > 75 %      | < 40 %      | Applications à forte consommation mémoire   |
| **QPS (requêtes par seconde)** | > 1000/s   | < 400/s    | Passerelles API, services Web |
| **Nombre de connexions**          | > 5000     | < 1000     | Base de données, files de messages |
| **Métrique métier personnalisée**  | Selon l'activité | Selon l'activité | Scénarios métier spécifiques     |

::: tip Pièges et solutions de la stratégie de mise à l'échelle

**Piège 1 : la mise à l'échelle réagit trop lentement, le pic de trafic a déjà fait tomber le système**

Lors d'une promotion e-commerce, un système déclenchait la montée en charge à CPU > 80 %, mais la collecte des métriques avait 1 minute de retard et le démarrage d'une nouvelle instance prenait 3 minutes. Le trafic est arrivé trop vite, la mise à l'échelle n'était pas terminée que les serveurs étaient déjà en panne.

**Solutions :**

- **Mise à l'échelle anticipée** : prévoir les pics de trafic sur la base des données historiques, commencer la montée en charge 30 minutes à l'avance
- **Seuils à plusieurs niveaux** : 60 % pour l'alerte (préchauffage des nouvelles instances), 70 % pour la montée en charge officielle, 80 % pour la montée en charge d'urgence
- **Montée en charge rapide** : utiliser le déploiement conteneurisé, les nouvelles instances démarrent en 30 secondes (contre 3 à 5 minutes pour les VM)

**Piège 2 : mise à l'échelle trop agressive, explosion des coûts**

Une startup avait configuré une politique agressive : CPU > 50 % déclenchait la montée en charge. Résultat : une fluctuation normale de l'activité a déclenché la montée en charge, le nombre de serveurs est passé de 5 à 30, et la facture cloud a fait pleurer le DAF à la fin du mois.

**Solutions :**

- **Définir un délai de refroidissement** : après une montée en charge, attendre au moins 5 minutes avant de pouvoir relancer
- **Définir un nombre maximum d'instances** : max = nombre actuel x 2, pour éviter une expansion infinie
- **Distinguer les pics ponctuels des tendances** : ne déclencher la montée en charge que si le seuil est dépassé pendant 3 cycles consécutifs

**Piège 3 : baisse d'échelle trop rapide, les machines viennent d'être ajoutées et sont déjà retirées**

Une équipe avait configuré la baisse d'échelle à CPU < 30 %. Après la montée en charge, le trafic était encore en cours d'absorption, le CPU est brièvement redescendu à 25 %, déclenchant la baisse. Après la baisse, le CPU est remonté à 80 %, déclenchant à nouveau la montée — le système oscillait frénétiquement entre « montée-baisse-montée ».

**Solutions :**

- **Baisse d'échelle plus conservatrice** : seuil de montée à 70 %, seuil de baisse à 25 %, avec une zone tampon suffisante entre les deux
- **Délai de refroidissement plus long pour la baisse** : après une montée, attendre au moins 10 minutes avant de pouvoir baisser
- **Baisse progressive** : ne retirer qu'une seule machine à la fois, observer avant de décider de continuer
  :::

---

## 7. En pratique : comment choisir un équilibreur de charge

### 7.1 Comparaison des équilibreurs de charge principaux

| Caractéristique           | Nginx                           | HAProxy               | Envoy          | Équilibreur de charge cloud |
| -------------- | ------------------------------- | --------------------- | -------------- | -------------- |
| **Positionnement**       | Proxy inverse/équilibreur de charge haute performance         | Équilibreur de charge open source          | Proxy cloud-native     | Équilibreur de charge géré   |
| **Performance**       | Extrêmement élevée (C, événementiel)            | Élevée (événementiel)          | Élevée (C++/Rust)   | Extrêmement élevée           |
| **Richesse fonctionnelle** | Équilibrage de charge de base, fichiers statiques, cache    | Algorithmes d'équilibrage de charge riches    | Routage avancé, observabilité | Fonctionnalités complètes       |
| **Configuration**       | Fichier de configuration (nginx.conf)            | Fichier de configuration (haproxy.cfg) | API/Fichier de configuration   | Console UI       |
| **Extensions**       | Modules C/Scripts Lua                   | Scripts Lua               | WASM/Filtre    | Plugins           |
| **Cas d'utilisation**   | Ressources statiques, équilibrage L7, terminaison SSL | Équilibrage L7, haute disponibilité  | Maillage de services, multi-cloud | Prise en main rapide       |

::: tip Recommandations de sélection
**Arbre de décision :**

```
Choisir un équilibreur de charge :
│
├─ Besoin uniquement d'un équilibrage L4 de base ?
│  ├─ Oui → LVS (open source, gratuit) ou NLB du fournisseur cloud
│  └─ Non → Continuer
│
├─ Besoin de maillage de services, déploiement multi-cloud ?
│  ├─ Oui → Envoy
│  └─ Non → Continuer
│
├─ Besoin de configurations et plugins très complexes ?
│  ├─ Oui → HAProxy
│  └─ Non → Continuer
│
├─ Besoin de haute performance + configuration simple ?
│  ├─ Oui → Nginx (choix recommandé)
│  └─ Continuer
│
├─ Préférer une solution gérée ?
│  ├─ Oui → Équilibreur de charge cloud (AWS ALB, Alibaba SLB)
│  └─ Nginx auto-hébergé
```

:::

---

## 8. Résumé : la philosophie fondamentale de l'équilibrage de charge

### 8.1 Rappel des principes fondamentaux

| Principe     | Signification                       | Points de pratique                              |
| -------- | -------------------------- | ------------------------------------- |
| **Couches** | L4 gère le « tri de colis » (rapide mais simple) | L4 pour bases de données, jeux ; L7 pour Web, API     |
| **Redondance** | Le point unique de défaillance est l'ennemi de l'architecture       | Améliorer la disponibilité via le déploiement multi-instances, multi-zones      |
| **Progressivité** | Ne jamais « tout changer d'un coup » lors d'une nouvelle version     | Déploiement bleu-vert pour zéro interruption ; canari pour un risque maîtrisé |
| **Élasticité** | Le système doit « respirer » comme un organisme vivant        | Montée en charge automatique quand la demande est forte, baisse quand elle est faible             |

### 8.2 Liste de contrôle de conception

Avant d'introduire un équilibreur de charge, posez-vous les questions suivantes :

- [ ] Avez-vous vraiment besoin d'un équilibreur de charge ? (La performance d'un seul serveur est-elle réellement insuffisante)
- [ ] Choisir L4 ou L7 ? (selon le scénario métier)
- [ ] Comment gérer la persistance de session ? (Cookie, hachage IP, table de sessions)
- [ ] Comment implémenter les contrôles de santé ? (actif, passif, paramétrage des seuils)
- [ ] Comment réaliser le zéro temps d'arrêt ? (déploiement bleu-vert, canari)
- [ ] Comment implémenter l'élasticité ? (métriques de mise à l'échelle, délai de refroidissement, nombre maximum d'instances)

---

## 9. Glossaire

| Terme             | Anglais                                      | Définition                                                                 |
| ---------------- | ----------------------------------------- | -------------------------------------------------------------------- |
| **Équilibreur de charge**   | Load Balancer                             | Dispositif ou logiciel répartissant le trafic vers plusieurs serveurs backend                               |
| **Équilibrage L4** | L4 Load Balancing                         | Équilibrage de charge basé sur la couche transport (TCP/UDP)                                        |
| **Équilibrage L7** | L7 Load Balancing                         | Équilibrage de charge basé sur la couche applicative (HTTP/HTTPS)                                     |
| **Contrôle de santé**     | Health Check                              | Mécanisme vérifiant périodiquement l'état de santé des serveurs backend                                   |
| **Persistance de session**     | Session Persistence                       | Garantit que les requêtes d'un même utilisateur sont toujours routées vers le même serveur                             |
| **Session sticky**     | Sticky Session                            | Autre appellation, identique à Session Persistence                                    |
| **Déploiement bleu-vert**     | Blue-Green Deployment                     | Stratégie de publication sans interruption par basculement entre deux environnements                                         |
| **Publication canari**   | Canary Release                            | Stratégie de déploiement progressif validée d'abord sur un faible volume de trafic                                       |
| **Mise à l'échelle automatique**   | Auto Scaling                              | Ajout ou retrait automatique de serveurs en fonction de la charge                                     |
| **Évolution horizontale**     | Horizontal Scaling                        | Augmenter la capacité de traitement en ajoutant des serveurs                                     |
| **Évolution verticale**     | Vertical Scaling                          | Augmenter la capacité de traitement en améliorant la configuration d'un seul serveur (CPU, mémoire)                                |
| **Multi-région**       | Multi-Region                              | Déployer des services dans plusieurs zones géographiques                                               |
| **Multi-actif**         | Active-Active                             | Plusieurs régions fournissent simultanément des services                                             |
| **Actif-veille**         | Active-Standby                            | Une seule région fournit le service, les autres sont en attente                                       |
| **Réplication de données**     | Data Replication                          | Mécanisme de copie de données entre régions                                                 |
| **RTO**          | Recovery Time Objective (RTO)             | Objectif de temps de récupération, délai maximal de restauration du service après une panne                         |
| **RPO**          | Recovery Point Objective (RPO)            | Objectif de point de récupération, volume maximal de données pouvant être perdues après une panne                           |
