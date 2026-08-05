# Principes : Files de tâches asynchrones

::: tip Préface
**Un utilisateur clique sur le bouton « Exporter le rapport », puis fixe l'animation de chargement qui tourne pendant 30 secondes — est-ce raisonnable ?** Lorsqu'une opération nécessite plusieurs secondes voire plusieurs minutes pour se terminer, faire attendre l'utilisateur n'est clairement pas une bonne expérience. Les files de tâches asynchrones sont le modèle architectural clé pour résoudre ce problème — déléguer les opérations longues en arrière-plan et répondre immédiatement à l'utilisateur.
:::

**Que allez-vous apprendre dans cet article ?**

Après avoir étudié ce chapitre, vous serez en mesure de :

- **Comparer synchronisme et asynchronisme** : comprendre pourquoi certaines opérations doivent être asynchrones et l'amélioration de l'expérience utilisateur qui en découle
- **Maîtriser le modèle producteur-consommateur** : comprendre l'idée centrale et le flux de fonctionnement du pattern Producer-Consumer
- **Comprendre le mécanisme de pool de Workers** : voir comment les tâches sont distribuées à plusieurs Workers pour un traitement parallèle
- **Garanties de fiabilité** : maîtriser les mécanismes de garantie tels que les nouvelles tentatives, l'idempotence et les files de lettres mortes
- **Capacité de sélection technologique** : connaître les caractéristiques et les scénarios d'application des principaux frameworks de tâches asynchrones

| Chapitre | Contenu | Concept clé |
|-----|------|---------|
| **Chapitre 1** | Pourquoi l'asynchrone | Synchrone bloquant vs asynchrone non bloquant |
| **Chapitre 2** | Modèle producteur-consommateur | Producer, Queue, Consumer |
| **Chapitre 3** | Pool de Workers | Traitement concurrent, distribution de tâches |
| **Chapitre 4** | Garanties de fiabilité | Stratégie de nouvelle tentative, idempotence, file de lettres mortes |
| **Chapitre 5** | Sélection de frameworks | Celery, Sidekiq, Bull, RQ |

---

## 0. Vue d'ensemble : pourquoi ne pas faire « attendre » l'utilisateur

Imaginez que vous commandiez dans un restaurant. Un bon restaurant vous donne immédiatement un numéro de commande après votre commande, puis vous pouvez vous installer et utiliser votre téléphone en attendant que le repas soit prêt. Plutôt que de vous faire rester debout au comptoir à regarder le chef préparer tout le plat.

Dans les applications Web, il existe de nombreuses opérations similaires de « préparation culinaire » :

- **Envoi d'e-mails/SMS** : appel à une API tierce, peut prendre plusieurs secondes
- **Génération de rapports/PDF** : calculs sur de grandes quantités de données, peut prendre des dizaines de secondes
- **Traitement d'images/vidéos** : compression, transcodage, filigrane, peut prendre plusieurs minutes
- **Synchronisation de données** : synchronisation inter-systèmes, durée indéterminée

::: tip L'idée centrale des tâches asynchrones
Extraire les opérations longues du flux principal de requête-réponse et les placer dans une file d'attente en arrière-plan pour un traitement asynchrone. Après avoir soumis la requête, l'utilisateur reçoit immédiatement une réponse « bien reçu, traitement en cours ». Une fois le traitement terminé, le résultat est communiqué via notification, interrogation ou WebSocket.
:::

---

## 1. Synchrone vs Asynchrone : l'histoire d'une commande

Lorsqu'un utilisateur soumet une commande, le backend doit effectuer de nombreuses tâches : déduire le stock, créer l'enregistrement de commande, envoyer l'e-mail de confirmation, mettre à jour le système de recommandation, enregistrer le journal d'audit...

En mode synchrone, ces opérations s'exécutent séquentiellement et l'utilisateur doit attendre que toutes soient terminées pour voir le résultat. En mode asynchrone, seules les opérations clés (déduction du stock, création de la commande) sont effectuées, les autres sont placées dans la file d'attente pour un traitement en arrière-plan.

<AsyncTaskFlowDemo />

| Dimension de comparaison | Traitement synchrone | Traitement asynchrone |
|---------|---------|---------|
| Temps d'attente utilisateur | Durée totale de toutes les opérations | Durée des opérations clés uniquement |
| Débit du système | Faible (thread bloqué) | Élevé (libération rapide du thread) |
| Impact des échecs | Les échecs non critiques entraînent l'échec global | Les échecs non critiques n'affectent pas le flux principal |
| Complexité d'implémentation | Simple | Nécessite une infrastructure de file d'attente supplémentaire |
| Cohérence des données | Forte | À terme |

::: tip Quand utiliser l'asynchrone ?
Trois critères de jugement : **longue durée** (plus de 1 à 2 secondes), **non critique** (l'échec ne doit pas affecter le flux principal), **différable** (le résultat n'est pas nécessaire immédiatement). Si au moins deux de ces critères sont remplis, envisagez l'asynchronisation.
:::

---

## 2. Modèle producteur-consommateur : la « chaîne de montage » des tâches

Le cœur des files de tâches asynchrones est le classique **pattern Producteur-Consommateur (Producer-Consumer Pattern)**. Ce pattern comporte trois rôles :

- **Producteur (Producer)** : celui qui génère les tâches, généralement le serveur Web lorsqu'il traite les requêtes des utilisateurs
- **File d'attente (Queue)** : le tampon stockant les tâches en attente, généralement implémenté via Redis, RabbitMQ, etc.
- **Consommateur (Consumer/Worker)** : le processus de travail qui extrait les tâches de la file et les exécute

<TaskWorkerDemo />

::: tip Les trois valeurs de la file d'attente
1. **Découplage** : le producteur n'a pas besoin de savoir qui traitera la tâche, le consommateur n'a pas besoin de savoir d'où vient la tâche
2. **Lissage des pics** : lors d'un trafic soudain, les tâches s'accumulent d'abord dans la file, le consommateur traite à son propre rythme
3. **Fiabilité** : les tâches sont persistées dans la file, même si le consommateur tombe en panne, rien n'est perdu
:::

| Composant | Responsabilité | Implémentations courantes |
|------|------|---------|
| Middleware de messages | Stockage et transfert des messages de tâches | Redis, RabbitMQ, Kafka |
| Sérialiseur | Sérialisation/désérialisation des paramètres de tâche | JSON, MessagePack, Pickle |
| Planificateur | Gestion des tâches planifiées et différées | Cron, APScheduler, node-cron |
| Stockage de résultats | Conservation des résultats d'exécution des tâches | Redis, Base de données, S3 |

---

## 3. Garanties de fiabilité : les tâches ne doivent ni être « perdues » ni « dupliquées »

Dans un environnement distribué, les fluctuations réseau, les redémarrages de service et le manque de ressources peuvent survenir à tout moment. Le système de tâches asynchrones doit disposer de mécanismes de fiabilité complets.

Les deux problèmes les plus critiques : **la perte de tâches** (le consommateur plante en milieu de traitement) et **l'exécution en double** (la tâche a été livrée deux fois).

<TaskRetryDemo />

::: tip Les trois piliers de la fiabilité
1. **Mécanisme ACK** : le consommateur n'envoie un accusé de réception (ACK) qu'après avoir traité la tâche ; les tâches non acquittées sont redistribuées
2. **Stratégie de nouvelle tentative** : en cas d'échec, la tâche est retentée selon une stratégie ; le backoff exponentiel avec jitter est la meilleure pratique
3. **Conception idempotente** : l'exécution multiple d'une même tâche produit le même effet qu'une seule exécution ; la déduplication se fait via un identifiant unique
:::

| Mécanisme | Problème résolu | Mode de mise en œuvre |
|------|-----------|---------|
| Accusé de réception ACK | Perte de tâche | Confirmation manuelle après traitement ; redistribution en cas de non-confirmation dans le délai |
| File de lettres mortes (DLQ) | Les « messages empoisonnés » qui échouent à répétition | Transfert vers la file de lettres mortes après dépassement du seuil de tentatives ; intervention humaine |
| Idempotence | Exécution en double | Déduplication via un ID unique de tâche, contrainte d'unicité en base de données |
| File de priorité | Famine des tâches | Les tâches haute priorité sont traitées en premier, évitant le blocage par les tâches basse priorité |
| Contrôle du délai d'attente | Blocage de tâche | Définition d'un temps d'exécution maximal ; terminaison automatique et nouvelle tentative en cas de dépassement |

---

## 4. Sélection de frameworks : choisir l'outil adapté

Différents écosystèmes linguistiques disposent de frameworks de tâches asynchrones différents, chacun avec ses propres compromis en termes de richesse fonctionnelle, de performance et de facilité d'utilisation. Choisissez d'abord en fonction de votre stack technologique, puis décidez selon la taille du projet et les besoins.

<AsyncComparisonDemo />

::: tip Conseils de sélection
- **Projets Python** : Celery pour les projets moyen/grand, RQ pour les petits projets
- **Projets Node.js** : BullMQ en premier choix (la génération suivante de Bull)
- **Projets Ruby** : Sidekiq est pratiquement le seul choix
- **Projets Java** : Spring Batch pour l'écosystème Spring, Kafka Streams pour le haut débit
- **Projets Go** : Asynq (basé sur Redis) ou Machinery

Si votre projet utilise déjà Redis, les solutions basées sur Redis (Celery+Redis, BullMQ, Sidekiq) sont le moyen le plus simple de démarrer.
:::

---

## Résumé

Les files de tâches asynchrones sont une infrastructure indispensable dans l'architecture backend. Elles permettent au système de traiter élégamment les opérations longues tout en améliorant l'expérience utilisateur et le débit du système.

Récapitulatif des points clés de ce chapitre :

1. **Critères d'asynchronisation** : longue durée, non critique, différable — si deux critères sont remplis, asynchronisez
2. **Modèle producteur-consommateur** : Producer → Queue → Consumer, les trois rôles sont découplés et collaboratifs
3. **Pool de Workers** : plusieurs Workers consomment en parallèle, améliorant la capacité de traitement
4. **Garanties de fiabilité** : accusé de réception ACK + stratégie de nouvelle tentative + idempotence — les trois sont indispensables
5. **Sélection de frameworks** : choisir en fonction de la stack technologique et de la taille du projet ; Redis est le middleware de messages le plus courant

## Pour aller plus loin

- [Documentation officielle Celery](https://docs.celeryq.dev/) - La file de tâches distribuée la plus populaire pour Python
- [Documentation BullMQ](https://docs.bullmq.io/) - File de tâches haute performance pour Node.js
- [Wiki Sidekiq](https://github.com/sidekiq/sidekiq/wiki) - La référence du traitement de tâches dans l'écosystème Ruby
- [Tutoriels RabbitMQ](https://www.rabbitmq.com/tutorials) - Tutoriel d'introduction au middleware de messages
- [Meilleures pratiques pour les tâches asynchrones](https://brandur.org/job-drain) - Patterns de conception et pièges des files de tâches
