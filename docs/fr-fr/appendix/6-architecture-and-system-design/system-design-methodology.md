# Méthodologie : Conception de systèmes

::: tip Avant-propos
**La conception de systèmes ne consiste pas à dessiner des architectures au doigt mouillé, c'est une méthodologie structurée.** Que ce soit pour un exercice de conception de systèmes en entretien ou pour la conception architecturale en conditions réelles, on suit un cadre de réflexion similaire : d'abord bien comprendre le problème, puis estimer les dimensions, ensuite concevoir la solution, et enfin approfondir les optimisations.
:::

**Que allez-vous apprendre dans cet article ?**

À l'issue de ce chapitre, vous aurez acquis :

- **Processus de conception** : maîtriser le cadre en quatre étapes de la conception de systèmes
- **Estimation de capacité** : apprendre les techniques d'« estimation au dos d'une enveloppe »
- **Patterns courants** : vous familiariser avec les patterns fondamentaux : cache, sharding, files de messages, etc.
- **Pensée en termes de compromis** : comprendre la philosophie des _trade-offs_ dans la conception architecturale
- **Études de cas** : comprendre le processus de conception à travers des cas comme le service de liens courts, le fil d'actualité, etc.

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Méthode en quatre étapes | Clarification des besoins, estimation de capacité, conception architecturale, optimisation approfondie |
| **Chapitre 2** | Estimation de capacité | QPS, stockage, bande passante, estimation au dos d'une enveloppe |
| **Chapitre 3** | Patterns de conception fondamentaux | Cache, sharding, files de messages, CDN |
| **Chapitre 4** | Pensée en termes de compromis | Cohérence vs disponibilité, performance vs coût |
| **Chapitre 5** | Cas classiques | Service de liens courts, fil d'actualité, système de vente flash |

---

## 1. La méthode en quatre étapes de la conception de systèmes

La conception de systèmes ne consiste pas à dessiner un schéma d'architecture d'emblée. Que ce soit en entretien ou en pratique, il faut suivre un processus structuré.

<SystemDesignStepsDemo />

::: tip Pourquoi clarifier les besoins en premier ?
Beaucoup de gens se mettent à dessiner dès qu'ils reçoivent le sujet, et finissent par concevoir un système « correct mais pas celui que l'examinateur attendait ». Passer 5 minutes à clarifier les besoins permet d'éviter 30 minutes de rework.

Questions de clarification courantes :
- Quelle est la fonctionnalité principale du système ? (ne pas concevoir toutes les fonctionnalités)
- Quelle est la taille de la base d'utilisateurs ? (détermine si le distribué est nécessaire)
- Quel est le ratio lecture/écriture ? (détermine la stratégie de cache)
- Combien de temps les données doivent-elles être conservées ? (détermine la solution de stockage)
:::

---

## 2. Estimation de capacité : l'art du calcul au dos d'une enveloppe

L'« estimation au dos d'une enveloppe » (_Back-of-envelope estimation_) est une compétence fondamentale en conception de systèmes. Il ne s'agit pas de calculer avec précision, mais de connaître l'ordre de grandeur.

<CapacityEstimationDemo />

### Aide-mémoire des conversions courantes

| Ordre de grandeur | Conversion | Astuce mnémotechnique |
|------|------|---------|
| 1 jour | 86 400 secondes | ≈ 100 000 secondes |
| 100 millions de requêtes/jour | ≈ 1 200 QPS | Diviser par 100 000 |
| 1 Ko x 100 millions | ≈ 100 Go | 100 millions de petits enregistrements |
| 1 Mo x 1 million | ≈ 1 To | 1 million d'images |

### Application de la règle des 80/20 dans les estimations

La plupart des systèmes suivent la règle des 80/20 : 20 % des données supportent 80 % des requêtes. Cela signifie que :

- **Taille du cache** ≈ Volume total de données x 20 %
- **QPS des points chauds** ≈ QPS total x 80 % concentré sur 20 % des clés
- **Taux de réussite du cache** visé ≈ 80 %+ (en dessous, la stratégie de cache est probable à revoir)

---

## 3. Patterns de conception fondamentaux

Les patterns qui reviennent sans cesse en conception de systèmes — les maîtriser permet de faire face à la plupart des scénarios.

### 3.1 Patterns de cache

| Pattern | Chemin de lecture | Chemin d'écriture | Cas d'usage |
|------|--------|--------|---------|
| Cache-Aside | D'abord chercher dans le cache ; en cas d'échec, chercher en BDD puis remplir le cache | D'abord écrire en BDD, puis invalider le cache | Usage général, le plus courant |
| Read-Through | La couche de cache charge automatiquement depuis la BDD | Identique à Cache-Aside | Nécessite un framework de cache |
| Write-Behind | Identique à Cache-Aside | D'abord écrire dans le cache, écrire en BDD de manière asynchrone | Écritures intensives, tolérance possible de pertes de données |

::: tip Pourquoi « invalider le cache » plutôt que « mettre à jour le cache » ?
La mise à jour du cache est sujette à des incohérences de données en cas de concurrence : les threads A et B mettent à jour simultanément, A écrit d'abord en BDD mais B met à jour le cache en premier, ce qui fait que le cache contient l'ancienne valeur de B. L'invalidation du cache permet à la prochaine requête de lecture de recharger les données depuis la BDD, évitant naturellement ce problème.
:::

### 3.2 Sharding (partitionnement de bases et de tables)

Lorsque le volume de données d'une table dépasse la dizaine de millions, ou que le QPS d'une base atteint son plafond, il faut envisager le sharding.

| Stratégie | Approche | Avantage | Inconvénient |
|------|------|------|------|
| Sharding vertical (par base) | Séparer les bases de données par domaine métier | Découplage métier, mise à l'échelle indépendante | JOIN inter-bases difficile |
| Sharding horizontal (par table) | Diviser une même table en plusieurs selon une règle | Volume par table contrôlé | Le choix de la clé de sharding est crucial |
| Division verticale (par table) | Extraire les gros champs dans une table séparée | Réduction des E/S, amélioration des performances de requête | Nécessite un JOIN supplémentaire |

**Principes de choix de la clé de sharding** :
- Choisir le champ le plus fréquemment interrogé (ex. user_id)
- La distribution des données doit être uniforme, éviter les points chauds
- Dans la mesure du possible, garder les données d'un même utilisateur dans le même shard (réduire les requêtes inter-shards)

### 3.3 Files de messages

La file de messages est l'« amortisseur » des systèmes distribués. Ses rôles fondamentaux sont le découplage, l'asynchronisme et le lissage des pics.

| Scénario | Sans file de messages | Avec file de messages |
|------|---------|--------|
| Notification après commande | L'interface de commande appelle synchroniquement le service de notification, un échec de notification entraîne l'échec de la commande | Après succès de la commande, envoi d'un message, consommation asynchrone par le service de notification |
| Vente flash | Le trafic instantané sature la base de données | Les requêtes entrent d'abord dans la file, le backend consomme à sa capacité |
| Synchronisation de données | Le service A appelle directement l'interface du service B | Le service A émet un événement, le service B s'y abonne et le traite |

---

## 4. Pensée en termes de compromis : pas de solution miracle

L'essence de la conception architecturale est le compromis (_Trade-off_). Chaque décision a un prix ; la clé est de comprendre ce prix et de faire le choix adapté à l'étape actuelle.

| Dimension du compromis | Option A | Option B | Critère de décision |
|---------|--------|--------|---------|
| Cohérence vs disponibilité | Cohérence forte (CP) | Haute disponibilité (AP) | Le métier peut-il tolérer une incohérence temporaire ? |
| Performance vs coût | Cache complet | Cache à la demande | Volume de données et budget |
| Simplicité vs flexibilité | Architecture monolithique | Microservices | Taille de l'équipe et complexité métier |
| Temps réel vs traitement par lots | Traitement par flux | Traitement par lots | Exigence de fraîcheur des données |
| Solution interne vs solution managée | Déployer son propre MySQL | Utiliser une base de données cloud RDS | Capacité d'exploitation et coût |

::: tip Les enregistrements de décisions architecturales (ADR)
Chaque décision architecturale importante devrait être documentée : **quel était le contexte, quelles options ont été envisagées, pourquoi celle-ci a été choisie, quels sont les inconvénients**. L'objectif n'est pas de chercher des coupables, mais de permettre aux futurs intervenants de comprendre « pourquoi on a conçu les choses ainsi à l'époque ».

Le format est simple :
- **Titre** : Remplacer X par Y
- **Contexte** : Quel problème rencontrions-nous
- **Décision** : Quelle solution avons-nous choisie
- **Raisons** : Pourquoi ce choix
- **Inconvénients** : Les défauts et risques de cette décision
:::

### Compromis erronés courants

| Erreur | Manifestation | Bonne pratique |
|------|------|---------|
| Optimisation prématurée | Sharding avec seulement 1 000 utilisateurs actifs par jour | Commencer avec une base unique, décomposer à l'apparition du goulet d'étranglement |
| Approche technologique | « Je veux utiliser Kafka » plutôt que « j'ai besoin d'asynchrone » | Partir du problème, pas de la technologie |
| Ignorer les coûts d'exploitation | Choix de la solution optimale mais que l'équipe ne peut pas maintenir | La solution doit correspondre aux capacités de l'équipe |
| Poursuivre la cohérence parfaite | Transactions distribuées pour tous les scénarios | La cohérence à terme suffit pour la plupart des scénarios |

---

## 5. Cas classiques

Trois cas classiques pour relier la méthodologie vue précédemment.

### 5.1 Service de liens courts (TinyURL)

Le service de liens courts est un classique des entretiens de conception de systèmes — petit mais complet.

**Clarification des besoins** :
- Fonctionnalité principale : lien long → lien court (écriture), lien court → redirection (lecture)
- Ratio lecture/écriture : environ 100:1 (lecture bien plus fréquente que écriture)
- Redirections quotidiennes : 100 millions
- Les liens courts n'expirent jamais

**Estimation de capacité** :

| Indicateur | Calcul | Résultat |
|------|------|------|
| QPS écriture | 100 millions / 100 / 86 400 | ≈ 12 QPS |
| QPS lecture | 100 millions / 86 400 | ≈ 1 200 QPS |
| QPS lecture de pointe | 1 200 x 3 | ≈ 3 600 QPS |
| Stockage sur 5 ans | 1 million/jour x 365 x 5 x 100 o | ≈ 18 Go |
| Cache (20 %) | 18 Go x 20 % | ≈ 3,6 Go |

**Conception architecturale** :

```
Chemin d'écriture : Client → API Server → Générateur d'ID → Encodage Base62 → Écriture MySQL + Redis
Chemin de lecture : Client → CDN → API Server → Requête Redis → Redirection 302
                                    ↓ (cache miss)
                                  Requête MySQL → Remplissage Redis
```

**Décisions de conception clés** :
- Génération du code court : ID distribué Snowflake + encodage Base62, évitant les collisions de hachage
- Stratégie de cache : Cache-Aside, accélération CDN pour les liens courts populaires
- Base de données : une seule table suffit (18 Go est faible), index sur le code court

### 5.2 Système de fil d'actualité

Le fil d'actualité des plateformes sociales (Moments WeChat, fil Twitter) est un autre classique.

**Défi central** : un utilisateur publie un contenu, comment le faire voir à tous ses abonnés ?

| Approche | Principe | Avantage | Inconvénient |
|------|------|------|------|
| Mode tiré (Pull) | Agrégation en temps réel des contenus des abonnements lors de la lecture | Écriture simple, stockage réduit | Lecture lente, latence élevée avec beaucoup d'abonnements |
| Mode poussé (Push) | À la publication, écriture dans la boîte de réception de tous les abonnés | Lecture extrêmement rapide | Diffusion d'écriture massive pour les gros comptes |
| Mode hybride Push-Pull | Utilisateurs normaux en Push, gros comptes en Pull | Équilibre lecture/écriture | Implémentation complexe |

**Solution hybride Push-Pull** :
- Abonnés < 10 000 : à la publication, pousser vers le cache de fil de tous les abonnés (mode Push)
- Abonnés > 10 000 : pas de push, les abonnés tirent en temps réel à la lecture (mode Pull)
- Lorsqu'un utilisateur ouvre son fil : fusionner les contenus poussés + tirer en temps réel les contenus des gros comptes, trier par date

### 5.3 Système de vente flash

Le défi central de la vente flash : concurrence instantanée ultra-élevée + le stock ne doit pas être sur-vendu.

**Caractéristiques du trafic** :
- Avant le début de l'événement : de nombreux utilisateurs actualisent la page en attendant
- Au début de l'événement : le QPS peut être 100 fois supérieur à la normale
- Après l'événement : le trafic redescend rapidement

**Stratégie de lissage des pics en couches** :

```
Requête utilisateur → CDN (page statique) → Passerelle (limitation de débit) → File de messages (lissage des pics) → Service de stock (décrémentation)
```

| Couche | Stratégie | Effet |
|------|------|------|
| Frontend | Bouton grisé + délai aléatoire + captcha | Filtrer les robots, disperser les requêtes |
| CDN | Cache des ressources statiques | Réduit 90 % des requêtes de page |
| Passerelle | Limitation par seau à jetons | Ne laisser passer que le trafic que le système peut supporter |
| File de messages | Requêtes dans la file, traitement asynchrone | Lissage des pics, protection de la base de données |
| Service de stock | Pré-décrémentation Redis + opération atomique Lua | Prévenir la sur-vente, réponse en millisecondes |

::: tip Principes fondamentaux de la vente flash
1. **Intercepter le plus en amont possible** : ce qui peut être bloqué au CDN ne doit pas aller jusqu'à la couche applicative
2. **Séparation lecture/écriture** : la page produit passe par le cache, seul le passage de commande sollicite la base de données
3. **Traitement asynchrone** : après le clic sur « acheter », retour immédiat « en file d'attente », traitement asynchrone en arrière-plan
4. **Solution de repli** : limitation de débit, disjoncteur, dégradation — chaque couche doit avoir un plan B en cas de problème
:::

---

## Résumé

La conception de systèmes est une compétence fortement pratique, dont le cœur réside dans la pensée structurée et les compromis éclairés.

Rappel des points clés de ce chapitre :

1. **Cadre en quatre étapes** : clarification des besoins → estimation de capacité → conception architecturale → optimisation approfondie, aucune étape ne peut être sautée
2. **Estimation au dos d'une enveloppe** : pas besoin de précision, juste l'ordre de grandeur, pour guider les décisions architecturales
3. **Patterns fondamentaux** : cache, sharding, files de messages, CDN, limitation de débit, disjoncteur — ce sont les « briques » de la conception de systèmes
4. **Pensée en termes de compromis** : il n'y a pas de solution parfaite, seulement une solution adaptée à l'étape actuelle ; documenter les raisons et les inconvénients de chaque décision
5. **Cas classiques** : le service de liens courts pour les fondamentaux, le fil d'actualité pour les modèles push/pull, la vente flash pour la haute concurrence — maîtriser ces trois permet de raisonner par analogie

## Pour aller plus loin

- [System Design Interview](https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF) - L'ouvrage classique d'Alex Xu sur les entretiens de conception de systèmes
- [Designing Data-Intensive Applications](https://dataintensive.net/) - Conception d'applications data-intensive par Martin Kleppmann
- [The System Design Primer](https://github.com/donnemartin/system-design-primer) - La ressource d'apprentissage la plus complète sur GitHub
- [ByteByteGo](https://bytebytego.com/) - Blog de visualisation de conception de systèmes par Alex Xu
