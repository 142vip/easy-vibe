# Principes : Files de messages et architecture événementielle
::: tip Question centrale
**Quand le couplage système est sévère et que le trafic augmente soudainement, comment garantir la stabilité de la chaîne principale ?** Les files de messages sont le "tampon" et le "découpleur" des systèmes distribués modernes. Cet article explore en profondeur la philosophie de conception et la pratique d'ingénierie des files de messages à travers des cas réels (système de tickets de restaurant, tri express, système de vente flash).
:::

---

## 1. Motivation et justification : les "files de messages"

### 1.1 Un cas réel : l'évolution du système de commandes de Taobao

En 2012, le système de commandes de Taobao a subi une panne grave. Au Double Onze à minuit, le trafic a afflué massivement ; le service de commandes appelait directement le service de stock, le service de paiement, le service de logistique... toute la chaîne est tombée comme des dominos.

**L'architecture d'alors (fortement couplée) :**

```
Utilisateur passe commande -> Service de commandes -> Appel synchrone au service de stock -> Appel synchrone au service de paiement -> Appel synchrone au service de logistique
                    |                    |                    |
                 Réponse 200ms       Réponse 500ms       Réponse 300ms
```

::: warning Le problème fatal du couplage fort

- **Temps de réponse total** = 200 + 500 + 300 = 1000 ms (l'utilisateur attend 1 seconde)
- **Le service de stock tombe** -> le service de commandes tombe aussi (pool de threads épuisé)
- **Le service de paiement ralentit** -> toute la chaîne est ralentie
- **Impossible de monter en charge horizontalement** -> seule l'ajout vertical de machines est possible (coûteux et limité)
:::

**L'architecture améliorée (avec file de messages) :**

```
Utilisateur passe commande -> Service de commandes -> Envoie le message "commande créée" -> Retour immédiat (50ms)
                              |
                        File de messages (Kafka)
                              |
        +-------------+-------------+-------------+
        v             v             v             v
   Service de    Service de    Service de    Service de
   stock         paiement      logistique    notification
   (déduction    (traitement   (création     (envoi
    asynchrone)   asynchrone)   asynchrone)   asynchrone)
```

::: tip Résultat après amélioration

- **Temps de réponse utilisateur** = 50 ms (expérience améliorée 20 fois)
- **Le service de stock tombe** -> les messages sont conservés dans la file, le traitement reprend après récupération
- **Le service de paiement ralentit** -> n'affecte pas la création de la commande
- **Montée en charge horizontale possible** -> il suffit d'ajouter des instances de consommateurs
:::

### 1.2 Analogie avec la vie courante : le système de tickets de restaurant

Imaginez que vous allez dans un restaurant très prisé :

- **Sans système de tickets** : les clients doivent attendre debout au guichet, les places sont limitées, la file s'allonge, le restaurant est sous pression
- **Avec système de tickets** : après avoir commandé, on vous donne un numéro, vous pouvez vous installer, et on vous appelle quand c'est prêt

**La file de messages est le "système de tickets" du système logiciel** :

- **Producteur** (celui qui commande) -> place le message (la commande) dans la file
- **File** (le distributeur de tickets) -> stocke temporairement les messages
- **Consommateur** (le cuisinier) -> traite les messages à son propre rythme

<PeakShavingDemo />

---

## 2. Présentation et définition : une file de messages (Définition + trois éléments clés)

### 2.1 Qu'est-ce qu'une "file de messages"

::: tip Explication terminologique
**File de messages (Message Queue, MQ)** est un conteneur de stockage de messages. Les producteurs y placent des messages, les consommateurs les extraient pour les traiter. Elle implémente la "communication asynchrone" — l'expéditeur n'a pas besoin d'attendre la fin du traitement par le récepteur.

**Synchrone vs Asynchrone** :

- **Synchrone** : comme un appel téléphonique, l'interlocuteur doit décrocher pour communiquer
- **Asynchrone** : comme l'envoi d'un message WeChat, vous envoyez et l'autre lit quand il est disponible

C'est comme la différence entre appeler un ami (synchrone) et envoyer un message WeChat (asynchrone).
:::

### 2.2 Les trois éléments clés de la file de messages

#### Élément 1 : le Producteur (Producer)

**Responsabilité** : créer et envoyer des messages dans la file.

**Analogie** : le producteur est comme "l'expéditeur", qui dépose ses lettres (messages) à la poste (file).

::: details Points clés de conception

- **Mode d'envoi** : envoi synchrone (fiable mais bloquant) vs envoi asynchrone (haute performance mais nécessite gestion des callbacks)
- **Acquittement du message** : attendre la confirmation du Broker (Au moins une fois) vs envoyer et oublier (Au plus une fois)
- **Traitement des échecs** : stratégie de nouvelle tentative, sauvegarde dans un journal local, file de lettres mortes
:::

#### Élément 2 : le Consommateur (Consumer)

**Responsabilité** : récupérer les messages de la file et les traiter.

**Analogie** : le consommateur est comme "le destinataire", qui retire les lettres (messages) de sa boîte aux lettres (file) et les traite.

::: details Points clés de conception

- **Mode de consommation** : mode Push (le Broker pousse activement) vs mode Pull (le consommateur tire activement)
- **Acquittement de consommation** : ACK automatique (efficace mais possible perte de messages) vs ACK manuel (fiable mais nécessite gestion des timeouts)
- **Contrôle de concurrence** : consommation séquentielle mono-thread vs consommation parallèle multi-thread
- **Traitement des échecs** : stratégie de nouvelle tentative, file de lettres mortes, mécanisme de compensation
:::

#### Élément 3 : le Broker (agent de messages)

**Responsabilité** : recevoir, stocker et transmettre les messages.

**Analogie** : le Broker est comme "la poste" ou "le centre de tri express", responsable de la réception, du tri et de la distribution des lettres.

::: details Points clés de conception

- **Modèle de stockage** : stockage en mémoire (faible latence) vs stockage sur disque (haute fiabilité)
- **Stratégie de réplication** : réplication maître-esclave, synchronisation multi-réplicas
- **Mécanisme de haute disponibilité** : déploiement en cluster, basculement automatique
- **Extensibilité** : partitions (Partition), sharding (Sharding)
:::

---

## 3. Problème central 1 : comment découpler le système pour éviter l'effet domino

### 3.1 La tragédie du couplage fort : un service tombe, tout s'effondre

**Reconstitution du scénario** : l'architecture d'une plateforme e-commerce à ses débuts

```
Le service de commandes appelle directement les services en aval :
+-------------+
| Service de   |
| commandes    |
+------+------+
       |
       +-----------+-----------+-----------+
       v           v           v           v
+----------+ +----------+ +----------+ +----------+
| Service  | | Service  | | Service  | | Service  |
| stock    | | paiement | | logistique| | SMS      |
| 200ms    | | 500ms    | | 300ms    | | 100ms    |
+----------+ +----------+ +----------+ +----------+
```

::: tip Analyse des points de douleur
| Point de douleur | Manifestation concrète | Conséquence |
|------|----------|------|
| **Défaillance en cascade** | Le service de stock tombe, l'appel synchrone du service de commandes expire | Le pool de threads du service de commandes est épuisé, incapable de traiter les nouvelles requêtes |
| **Latence de réponse** | Obligation d'attendre tous les services en aval | L'utilisateur attend plus d'une seconde, expérience déplorable |
| **Extension difficile** | Ajout d'un service de points : nécessite de modifier le code du service de commandes | Les cycles de release s'allongent, les risques augmentent |
| **Gaspillage de ressources** | Le service de commandes doit attendre le service SMS | Les connexions à la base de données sont occupées longtemps |
:::

### 3.2 Solution de découplage : introduire la file de messages comme "couche intermédiaire"

**Architecture après découplage :**

```
Le service de commandes envoie seulement un message, sans se soucier de qui le consomme :

+-------------+
| Service de   | -- Envoie le message "commande créée" --+
| commandes    |                                          |
+-------------+                                          v
                                               +-------------------+
                                               |   File de         |
                                               |   messages        |
                                               | (Kafka/RabbitMQ)  |
                                               | - Stockage fiable |
                                               | - Multi-réplicas  |
                                               | - Garantie d'ordre|
                                               +--------+----------+
                                                        |
              +-------------------+-------------------+
              |                   |                   |
              v                   v                   v
       +--------------+    +--------------+    +--------------+
       | Service de   |    | Service de   |    | Service de   |
       | stock        |    | paiement     |    | logistique   |
       | S'abonne à   |    | S'abonne à   |    | S'abonne à   |
       | l'événement  |    | l'événement  |    | l'événement  |
       +--------------+    +--------------+    +--------------+
```

<DecouplingDemo />

::: tip Les bénéfices du découplage
| Dimension | Avant découplage | Après découplage |
|------|--------|--------|
| **Isolation des pannes** | Stock en panne = Commandes en panne | Stock en panne, messages conservés dans la file, consommation après récupération |
| **Temps de réponse** | 1000 ms (attente synchrone) | 50 ms (retour dès l'envoi du message) |
| **Extensibilité** | Ajout de service = modification du code des commandes | Ajout de service = simple abonnement au topic |
| **Complexité système** | Le service de commandes dépend fortement des services en aval | Le service de commandes dépend uniquement de la file de messages |
:::

### 3.3 L'essence du découplage : de "l'appel direct" au "pilotage par événements"

**Changement de paradigme :**

```
Pensée traditionnelle (impérative) :
"Le service de commandes ordonne au service de stock : déduis le stock !"
  | Appel direct
  | Couplage fort, le service appelé doit être en ligne
  | L'appelant doit connaître l'interface de l'appelé

Pensée événementielle (déclarative) :
"Le service de commandes déclare : la commande a été créée, que ceux qui sont concernés la traitent."
  | Envoi de l'événement vers la file de messages
  | Découplage, les consommateurs peuvent être hors ligne
  | Le producteur n'a pas besoin de connaître l'existence des consommateurs
```

---

## 4. Problème central 2 : comment lisser les pics de trafic

### 4.1 Scénario de vente flash : comment gérer 100 000 QPS

**Reconstitution du scénario** : une plateforme e-commerce lors d'une vente flash du Double Onze, avec un pic estimé à 100 000 QPS, mais la base de données ne peut supporter que 1 000 QPS.

**Conséquences de l'impact direct :**

```
Requêtes utilisateur -> Serveur applicatif -> Base de données
  100k/s       100k/s          1000/s (limite)
                              |
                         Pool de connexions épuisé
                         Délai d'attente dépassé
                         Base de données en panne
                              |
                         Effet avalanche (tous les services dépendant de la base de données tombent)
```

::: tip Explication terminologique
**QPS (Queries Per Second)** : requêtes par seconde, indicateur mesurant le débit d'un système.

**100 000 QPS** signifie 100 000 requêtes par seconde, comme 100 000 personnes se ruant simultanément dans un magasin.
:::

### 4.2 Solution de lissage : la file de messages comme "bassin de rétention"

**Conception de l'architecture :**

```
+-----------------------------------------------------------------------+
|                  Architecture du système de vente flash               |
+-----------------------------------------------------------------------+
|                                                                       |
|  Couche 1 : Passerelle (limitation stricte)                           |
|  +---------------------------------------------------------------+   |
|  |  - Limitation par seau à jetons : 100k/s -> 10k/s (rejette 90%)|   |
|  |  - Cache CDN pour les ressources statiques                     |   |
|  |  - Pages de file d'attente / captcha (premier niveau)          |   |
|  +---------------------------------------------------------------+   |
|                            |                                          |
|                            v                                          |
|  Couche 2 : Service (limitation souple)                               |
|  +---------------------------------------------------------------+   |
|  |  - Limitation Nginx : 10k/s -> 5000/s                         |   |
|  |  - Pré-déduction du stock via Redis (opération atomique) :    |   |
|  |    * Script Lua pour l'atomicité                               |   |
|  |    * Stock insuffisant : retour "épuisé"                       |   |
|  |  - Génération de jeton de commande (justificatif de file)      |   |
|  +---------------------------------------------------------------+   |
|                            |                                          |
|                            v                                          |
|  Couche 3 : File de messages (lissage central)                        |
|  +---------------------------------------------------------------+   |
|  |  Kafka/RocketMQ :                                              |   |
|  |  - Écriture par lot : 5000/s -> 1000/s (capacité de la BDD)   |   |
|  |  - Persistance des messages : garantie de non-perte             |   |
|  |  - Consommation parallèle multi-partitions : débit amélioré     |   |
|  |  - Gestion des offsets : reprise après panne                    |   |
|  +---------------------------------------------------------------+   |
|                            |                                          |
|                            v                                          |
|  Couche 4 : Consommateurs (traitement asynchrone)                     |
|  +---------------------------------------------------------------+   |
|  |  Consommateurs de traitement de commandes (multi-instances) :  |   |
|  |  - Pull depuis Kafka (1000/s, correspondant à la capacité BDD) |   |
|  |  - Transaction BDD : création de commande + déduction de stock |   |
|  |  - Mise à jour du statut en "créée"                            |   |
|  |  - Envoi de notification (email/SMS/push)                      |   |
|  |  - Acquittement de consommation (ACK)                          |   |
|  +---------------------------------------------------------------+   |
|                                                                       |
+-----------------------------------------------------------------------+
```

<PeakShavingDemo />

### 4.3 Principes mathématiques du lissage des pics

**Effet de lissage du trafic :**

```
Trafic original (pic) :                  Trafic lissé :

100k/s |    /\                    1000/s |████████████████
       |   /  \                          |
       |  /    \                         |
 1000/s|/        \                   0/s |
       +---------------               +----------------
       0s   1s   2s                   0s              20s

Original : 100k/s en pic, pendant 1 seconde
Lissé    : 1000/s à débit constant, pendant 100 secondes
```

**Formules clés :**

```
Longueur de la file = taux de production x durée - taux de consommation x durée
                    = 100 000 x 1 - 1 000 x 1
                    = 99 000 messages (accumulation dans la file au pic)

Temps pour consommer tous les messages = longueur de la file / taux de consommation
                                        = 99 000 / 1 000
                                        = 99 secondes
```

---

## 5. Problème central 3 : comment garantir que les messages ne sont ni perdus, ni dupliqués, et restent ordonnés

### 5.1 Fiabilité des messages : trois lignes de défense

Les messages peuvent être perdus à trois étapes : lors de l'envoi par le producteur, lors du stockage par le Broker, lors du traitement par le consommateur.

::: warning Les trois lignes de défense
**Ligne 1 : Accusé de réception du producteur (Producer ACK)**

- Lors de l'envoi, attendre la confirmation de réception par le Broker
- Si aucune confirmation, réessayer ou journaliser localement

**Ligne 2 : Persistance par le Broker**

- Les messages sont écrits sur disque, pas seulement en mémoire
- Synchronisation multi-réplicas, garantie de non-perte de données

**Ligne 3 : Accusé de réception du consommateur (Consumer ACK)**

- Après traitement, le consommateur envoie manuellement un accusé (ACK)
- Si le traitement échoue, pas d'acquittement ; le Broker redistribue le message
:::

<ReliabilityDemo />

### 5.2 Comment gérer la consommation en double des messages

**La duplication de messages peut survenir dans les scénarios suivants :**

1. **Nouvelle tentative du producteur** : le producteur n'a pas reçu d'ACK après l'envoi, il renvoie le même message
2. **Timeout de l'ACK du consommateur** : le traitement est terminé mais l'ACK a expiré, le Broker redistribue
3. **Instabilité réseau** : l'ACK du consommateur n'atteint pas le Broker, le Broker considère le message non consommé
4. **Redémarrage du consommateur** : après redémarrage, le consommateur retraite le même lot de messages

::: tip Idempotence
**Idempotence** : l'exécution multiple d'une même opération produit le même effet qu'une seule exécution.

**Idempotence dans la vie courante** :

- **Idempotent** : appuyer sur le bouton d'ascenseur (appuyer 10 fois ou 1 fois, l'ascenseur vient)
- **Non idempotent** : virement bancaire (transférer 10 euros exécuté deux fois = 20 euros transférés)

**Solution technique** : générer un ID unique pour chaque message, vérifier avant traitement s'il a déjà été traité.
:::

<IdempotenceDemo />

---

## 6. Pratique : comment choisir une file de messages

### 6.1 Comparaison des quatre files de messages principales

| Caractéristique | RabbitMQ | Kafka | RocketMQ | Redis Stream |
| ------------ | ------------ | ------------ | -------------- | ------------ |
| **Positionnement** | File de messages traditionnelle | Flux de journal distribué | File de messages e-commerce | File légère |
| **Débit** | ~10k/s | ~1M/s | ~100k/s | ~50k/s |
| **Latence** | Microsecondes | Millisecondes | Millisecondes | Millisecondes |
| **Fiabilité** | Élevée (persistance) | Élevée (multi-réplicas) | Élevée (écriture synchrone) | Moyenne (AOF) |
| **Rejeu des messages** | Non supporté | Supporté | Supporté | Supporté |
| **Messages transactionnels** | Supporté (faible) | Non supporté | Supporté (fort) | Non supporté |
| **Messages différés** | Supporté | Non supporté | Supporté | Non supporté |
| **Scénarios d'utilisation** | Applications d'entreprise traditionnelles | Logs, Big Data | E-commerce, finance | Applications à petite échelle |

::: tip Conseils de sélection
**Arbre de décision :**

```
Choix de la file de messages :
|
+-- Besoin de messages transactionnels (transactions distribuées) ?
|   +-- Oui -> RocketMQ (premier choix) ou RabbitMQ
|   +-- Non -> continuer
|
+-- Besoin de traiter des volumes massifs de logs / flux temps réel ?
|   +-- Oui -> Kafka (premier choix)
|   +-- Non -> continuer
|
+-- QPS > 10k/s ?
|   +-- Oui -> RocketMQ ou Kafka
|   +-- Non -> continuer
|
+-- Besoin de routage complexe (ex. correspondance de headers) ?
|   +-- Oui -> RabbitMQ
|   +-- Non -> continuer
|
+-- Infrastructure Redis existante ?
    +-- Oui -> Redis Stream (démarrage rapide)
    +-- Non -> RabbitMQ (fonctionnalités complètes, courbe d'apprentissage modérée)
```

:::

---

## 7. Résumé : principes de conception des files de messages

### 7.1 Rappel des principes clés

| Principe | Signification | Points de pratique |
| -------- | ---------------- | --------------------------------------- |
| **Découplage** | Les services ne dépendent pas directement les uns des autres | Communication via la file de messages, la panne d'un consommateur n'affecte pas le producteur |
| **Lissage des pics** | Lisser les fluctuations de trafic | La file de messages comme bassin de rétention, les consommateurs traitent à débit constant |
| **Fiabilité** | Aucun message perdu | ACK producteur + persistance Broker + ACK consommateur |
| **Idempotence** | La consommation en double est sans impact | Garantie d'idempotence au niveau métier (clé unique, machine à états) |
| **Ordonnancement** | Garantie d'ordre des messages | Ordre garanti par partition ou tri côté consommateur |

### 7.2 Liste de contrôle de conception

Avant d'introduire une file de messages, posez-vous les questions suivantes :

- [ ] Avez-vous vraiment besoin d'une file de messages ? (L'asynchrone simple peut utiliser un pool de threads)
- [ ] La perte de messages est-elle acceptable ? (Détermine le niveau de fiabilité)
- [ ] La duplication de messages affecte-t-elle le métier ? (Détermine l'investissement en idempotence)
- [ ] L'ordre des messages est-il important ? (Détermine la stratégie de partitionnement)
- [ ] Quelle est la capacité de traitement des consommateurs ? (Détermine la taille de la file et les seuils d'alerte)
- [ ] Comment gérer les échecs de consommation ? (Détermine les stratégies de nouvelle tentative et de lettres mortes)

---

## 8. Glossaire

| Terme | Nom complet | Explication |
| ----------------------- | ----------------- | ----------------------------------------------- |
| **MQ** | Message Queue | **File de messages**. Middleware pour la communication asynchrone, réalisant le découplage entre producteurs et consommateurs. |
| **Producer** | - | **Producteur**. Celui qui envoie les messages. |
| **Consumer** | - | **Consommateur**. Celui qui reçoit et traite les messages. |
| **Broker** | - | **Agent de messages**. Programme serveur stockant et transférant les messages. |
| **Topic** | - | **Topic**. Classification logique des messages (ex. "orders"). |
| **Queue** | - | **File**. Conteneur physique de stockage des messages. |
| **Partition** | - | **Partition**. Concept Kafka : un Topic peut être divisé en plusieurs Partitions pour améliorer la concurrence. |
| **ACK** | Acknowledgment | **Accusé de réception**. Le consommateur confirme au Broker le traitement du message. |
| **Pub/Sub** | Publish/Subscribe | **Publication/Abonnement**. Un message peut être reçu par plusieurs consommateurs. |
| **P2P** | Point-to-Point | **Point à point**. Un message ne peut être reçu que par un seul consommateur. |
| **DLQ** | Dead Letter Queue | **File de lettres mortes**. Stocke les messages impossibles à consommer. |
| **Idempotence** | - | **Idempotence**. L'exécution multiple produit le même résultat. |
| **Throughput** | - | **Débit**. Nombre de messages traités par unité de temps. |
| **Latency** | - | **Latence**. Délai entre l'envoi et la réception d'un message. |
| **Persistence** | - | **Persistance**. Écriture des messages sur disque, pas seulement en mémoire. |
| **Replication** | - | **Réplication**. Copie des messages sur plusieurs nœuds pour la haute disponibilité. |
| **Transaction Message** | - | **Message transactionnel**. Garantit la cohérence entre la transaction locale et l'envoi du message. |
| **Backpressure** | - | **Contre-pression**. Le consommateur notifie le producteur de ralentir quand il n'arrive plus à suivre. |
| **Offset** | - | **Offset**. Position de consommation du consommateur dans une partition. |
| **Rebalance** | - | **Rééquilibrage**. Redistribution des partitions lors d'un changement dans le groupe de consommateurs. |
