# Principes : Systèmes distribués et leurs défis

::: tip Avant-propos
**Ce n'est que lorsqu'une machine ne suffit plus que les vrais problèmes commencent.** Les systèmes distribués sont la pierre angulaire de l'Internet moderne — des messages WeChat aux commandes sur Taobao, ce sont des centaines, voire des milliers de machines qui travaillent de concert en coulisses. Mais « distribué » n'est pas un repas gratuit : il apporte une série de défis que les systèmes monopostes n'ont jamais rencontrés.
:::

**Que allez-vous apprendre dans cet article ?**

À l'issue de ce chapitre, vous aurez acquis :

- **Théorèmes fondamentaux** : comprendre le théorème CAP et son impact sur la conception de systèmes
- **Modèles de cohérence** : distinguer cohérence forte, cohérence à terme, cohérence causale
- **Huit grands défis** : maîtriser les problèmes fondamentaux auxquels font face les systèmes distribués
- **Algorithmes de consensus** : découvrir les principes de base de Paxos, Raft et autres
- **Patterns pratiques** : vous familiariser avec les solutions courantes comme 2PC, Saga, CRDT

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Pourquoi le distribué | Passerelle à l'échelle, disponibilité, répartition géographique |
| **Chapitre 2** | Théorème CAP | Cohérence, disponibilité, tolérance aux partitions |
| **Chapitre 3** | Modèles de cohérence | Cohérence forte, cohérence à terme, cohérence causale |
| **Chapitre 4** | Huit grands défis | Réseau, horloges, partitions, split-brain, etc. |
| **Chapitre 5** | Algorithmes de consensus | Paxos, Raft, ZAB |
| **Chapitre 6** | Transactions distribuées | 2PC, Saga, TCC |

---

## 0. Vue d'ensemble : pourquoi les systèmes distribués

Les systèmes monopostes sont simples et fiables, mais ils se heurtent à trois goulets d'étranglement insurmontables :

| Goulet d'étranglement | Description | Solution distribuée |
|------|------|-------------|
| Plafond de performances | Le CPU, la mémoire et le disque d'une seule machine ont des limites physiques | Mise à l'échelle horizontale : ajouter des machines pour répartir la charge |
| Point de défaillance unique | Si une machine tombe en panne, tout le service est indisponible | Réplicas redondants : plusieurs machines se servent mutuellement de sauvegarde |
| Latence géographique | Les utilisateurs sont répartis dans le monde entier, une seule machine ne peut être qu'à un seul endroit | Déploiement multi-sites : servir les utilisateurs au plus près |

::: tip Le prix du distribué
Les systèmes distribués résolvent les problèmes ci-dessus, mais introduisent de nouvelles complexités : réseau non fiable, horloges désynchronisées, défaillances partielles, cohérence des données... Ce sont précisément ces « défis » que nous allons aborder dans cet article.

**Les huit erreurs de l'informatique distribuée de Peter Deutsch** nous rappellent que les hypothèses suivantes sont toutes fausses en environnement distribué :
1. Le réseau est fiable
2. La latence est nulle
3. La bande passante est infinie
4. Le réseau est sûr
5. La topologie ne change pas
6. Il n'y a qu'un seul administrateur
7. Le coût de transmission est nul
8. Le réseau est homogène
:::

---

## 1. Théorème CAP : le « triangle impossible » des systèmes distribués

En 2000, Eric Brewer a formulé la conjecture CAP (démontrée ensuite comme théorème) : un système distribué ne peut satisfaire simultanément que deux des trois propriétés suivantes au maximum.

| Propriété | Signification | Compréhension intuitive |
|------|------|---------|
| **C**onsistency (Cohérence) | Tous les nœuds voient les mêmes données au même instant | Quel que soit le distributeur automatique où vous consultez votre solde, le résultat est identique |
| **A**vailability (Disponibilité) | Chaque requête reçoit une réponse non erronée | Le système peut toujours vous répondre, jamais « service indisponible » |
| **P**artition tolerance (Tolérance aux partitions) | Le système continue de fonctionner en cas de partition réseau | Même si certains câbles sont coupés, le système fonctionne toujours |

<CAPTheoremDemo />

### Motivation et justification : ne peut-on en choisir que deux

Dans un environnement distribué, les partitions réseau (P) sont inévitables — les fibres optiques sont coupées, les commutateurs tombent en panne, les centres de données perdent leur connexion. P est donc obligatoire, le choix réel se fait entre C et A :

- **Choisir CP** : en cas de partition, rejeter les requêtes incertaines pour garantir l'exactitude des données → adapté à la finance, aux stocks
- **Choisir AP** : en cas de partition, continuer à servir, mais les données peuvent être temporairement incohérentes → adapté aux réseaux sociaux, au contenu

::: tip CAP n'est pas noir ou blanc
Dans la réalité, les systèmes ne sont pas simplement « CP ou AP ». Beaucoup de systèmes font des choix différents selon les opérations — par exemple, dans une même base de données, les lectures peuvent être AP (autoriser la lecture de données anciennes) et les écritures CP (exiger la confirmation de la majorité).
:::

---

## 2. Modèles de cohérence : le « degré de rigueur » de la synchronisation des données

La cohérence n'est pas un interrupteur (présente ou absente), c'est un spectre. Les différents modèles de cohérence font des compromis différents entre « exactitude » et « performance ».

<ConsistencyModelsDemo />

### Comparaison des modèles de cohérence

| Modèle | Garantie | Latence | Cas d'usage |
|------|------|------|---------|
| Cohérence forte | La lecture renvoie toujours la dernière valeur écrite | Élevée (nécessite l'attente de synchronisation) | Virements bancaires, déduction de stocks |
| Cohérence à terme | Tous les réplicas finiront par converger, mais on peut lire des valeurs intermédiaires anciennes | Faible (l'écriture renvoie immédiatement) | Fils sociaux, DNS |
| Cohérence causale | Les opérations liées causalement respectent un ordre garanti | Moyenne | Réponses à des commentaires, édition collaborative |
| Cohérence linéarisable | Toutes les opérations semblent s'exécuter séquentiellement sur une seule machine | La plus élevée | Verrous distribués, élection de leader |
| Cohérence de session | Au sein d'une même session, lecture garantie de ses propres écritures | Faible à moyenne | Données personnelles utilisateur |

::: tip Cohérence « lire ses propres écritures »
Le besoin pratique le plus courant est le suivant : après avoir modifié ses données, l'utilisateur doit pouvoir voir immédiatement la mise à jour (les autres utilisateurs peuvent la voir plus tard). C'est ce qu'on appelle la cohérence « Read Your Own Writes », une amélioration pratique de la cohérence à terme.
:::

---

## 3. Huit grands défis : le « champ de mines » des systèmes distribués

La complexité des systèmes distribués ne vient pas d'un seul problème, mais de l'entrelacement de multiples problèmes. Voici les huit défis les plus fondamentaux.

<DistributedChallengesDemo />

### Les liens entre les défis

Ces huit défis ne sont pas isolés, ils sont interconnectés :

- **Réseau non fiable** → provoque des **partitions réseau** → déclenche des **arbitrages CAP**
- **Horloges désynchronisées** → rendent le **tri des événements difficile** → affectent la **cohérence des données**
- **Défaillances partielles** → peuvent provoquer un **split-brain** → nécessitent des **algorithmes de consensus** pour résolution
- **Cohérence des données** → nécessite des **transactions distribuées** → mais celles-ci sont affectées par le **réseau non fiable**

::: tip Pas de solution miracle
Il n'existe pas de solution « parfaite » pour les systèmes distribués, seulement des compromis « adaptés ». Comprendre la nature de ces défis est la seule façon de faire les bons arbitrages lors de la conception d'un système.
:::

---

## 4. Algorithmes de consensus : comment faire « tomber d'accord » plusieurs machines

Les algorithmes de consensus sont au cœur des systèmes distribués — ils résolvent le problème suivant : comment plusieurs nœuds peuvent-ils se mettre d'accord sur une valeur, même en cas de panne de certains nœuds ou de latence réseau ?

### 4.1 Paxos

Proposé par Leslie Lamport en 1990, c'est le premier algorithme de consensus dont la correction a été rigoureusement prouvée.

| Rôle | Responsabilité |
|------|------|
| Proposer (Proposant) | Propose une valeur |
| Acceptor (Accepteur) | Vote pour accepter ou rejeter la proposition |
| Learner (Apprenant) | Apprend la valeur finalement retenue |

**Processus en deux phases** :
1. **Phase Prepare** : le Proposer envoie un numéro de proposition, les Acceptors promettent de ne plus accepter de propositions avec un numéro inférieur
2. **Phase Accept** : le Proposer envoie la valeur concrète, la proposition est adoptée si la majorité des Acceptors l'acceptent

::: tip Le problème de Paxos
Paxos est correct, mais il est notoirement difficile à comprendre et à implémenter. Lamport lui-même a utilisé une métaphore du parlement grec dans son article, ce qui a encore plus困惑é de gens.
:::

### 4.2 Raft : conçu pour la compréhensibilité

En 2014, Diego Ongaro a proposé Raft, avec pour objectif de créer un « Paxos facile à comprendre ». Il décompose le problème du consensus en trois sous-problèmes :

| Sous-problème | Description |
|--------|------|
| Élection du Leader | Élire un Leader dans le cluster, toutes les écritures passent par lui |
| Réplication des logs | Le Leader réplique le journal des opérations vers tous les Followers |
| Sécurité | Garantir que les logs déjà validés ne soient pas écrasés |

**Le processus fondamental de Raft** :
1. Au démarrage du cluster, tous les nœuds sont des Followers
2. Si un Follower n'a pas reçu de battement de cœur du Leader avant l'expiration du délai, il devient Candidate et lance une élection
3. Le Candidate ayant obtenu la majorité des votes devient le nouveau Leader
4. Le Leader reçoit les requêtes des clients, réplique les logs vers la majorité des nœuds, puis valide

### 4.3 Comparaison des algorithmes de consensus

| Algorithme | Date de proposition | Compréhensibilité | Systèmes utilisateurs |
|------|---------|---------|---------|
| Paxos | 1990 | Difficile | Google Chubby |
| Raft | 2014 | Facile | etcd, Consul, TiKV |
| ZAB | 2011 | Moyenne | ZooKeeper |
| EPaxos | 2013 | Difficile | Principalement de la recherche académique |

---

## 5. Transactions distribuées : le « tout ou rien » entre nœuds

Les transactions dans une base de données monoposte reposent sur des verrous locaux et des journaux pour implémenter ACID. Mais lorsqu'une opération métier implique plusieurs services ou bases de données, comment garantir l'atomicité ?

### 5.1 Validation en deux phases (2PC)

Le protocole de transaction distribuée le plus classique, divisé en deux phases :

| Phase | Action du coordinateur | Action des participants |
|------|-----------|-----------|
| Prepare | Demande à tous les participants « pouvez-vous valider ? » | Exécute l'opération sans valider, répond Yes/No |
| Commit | Si tous ont répondu Yes, envoie Commit | Valide définitivement ; si un No, tous font un rollback |

**Les problèmes de 2PC** :
- **Blocage** : après le Prepare, si le coordinateur tombe en panne, les participants attendent indéfiniment
- **Point de défaillance unique** : le coordinateur est un point unique, s'il tombe en panne, toute la transaction est bloquée
- **Performances médiocres** : nécessite de multiples aller-retour réseau, les verrous sont maintenus longtemps

### 5.2 Le pattern Saga

Saga découpe une grande transaction en plusieurs transactions locales, chacune ayant une opération de compensation correspondante. Si une étape échoue, on exécute les compensations en ordre inverse.

**Exemple de Saga pour une commande e-commerce** :

| Étape | Opération正向 | Opération de compensation |
|------|---------|---------|
| T1 | Créer la commande (en attente de paiement) | Annuler la commande |
| T2 | Décrémenter le stock | Restaurer le stock |
| T3 | Décrémenter le solde | Rembourser le solde |
| T4 | Confirmer la commande (payée) | — |

Si T3 (décrémenter le solde) échoue : exécuter C2 (restaurer le stock) → C1 (annuler la commande).

**Deux modes d'orchestration** :
- **Chorégraphie** : chaque service écoute les événements et décide de la prochaine étape lui-même. Simple mais difficile de suivre l'état global
- **Orchestration** : un coordinateur central contrôle le flux. Clair mais le coordinateur est un point unique

### 5.3 TCC (Try-Confirm-Cancel)

TCC est une implémentation au niveau métier du 2PC, divisant chaque opération en trois phases :

| Phase | Description | Exemple (déduction de stock) |
|------|------|---------------|
| Try | Réserver les ressources, sans exécution réelle | Geler 10 articles en stock (stock disponible -10, stock gelé +10) |
| Confirm | Confirmer l'exécution, consommer les ressources réservées | Stock gelé -10 (déduction réelle) |
| Cancel | Annuler la réservation, libérer les ressources | Stock gelé -10, stock disponible +10 (restauration) |

### 5.4 Comparaison des trois approches

| Approche | Cohérence | Performance | Complexité | Cas d'usage |
|------|--------|------|--------|---------|
| 2PC | Forte | Faible | Moyenne | Transactions inter-bases au niveau base de données |
| Saga | À terme | Élevée | Élevée | Processus métier longs (commandes, logistique) |
| TCC | À terme | Moyenne | La plus élevée | Scénarios financiers haute fiabilité |

::: tip Conseils pratiques de choix
- Si une transaction en base unique suffit, n'utilisez pas de transaction distribuée
- La plupart des scénarios métier se contentent de Saga + file de messages
- TCC convient aux scénarios financiers exigeant une très forte cohérence, mais le coût de développement est élevé
- 2PC convient aux intergiciels de base de données (ex. ShardingSphere) pour un traitement automatique
:::

---

## Résumé

Les systèmes distribués sont l'infrastructure de l'Internet moderne, mais leur complexité dépasse de loin celle des systèmes monopostes. Comprendre ces défis ne sert pas à les « résoudre » (beaucoup sont fondamentaux), mais à faire les bons compromis lors de la conception d'un système.

Rappel des points clés de ce chapitre :

1. **Théorème CAP** : les partitions réseau sont inévitables, le choix réel se fait entre cohérence et disponibilité
2. **Modèles de cohérence** : de la cohérence forte à la cohérence à terme, c'est un spectre à choisir selon les besoins métier
3. **Huit grands défis** : réseau non fiable, horloges désynchronisées, partitions réseau, split-brain, etc. sont interconnectés
4. **Algorithmes de consensus** : Raft est actuellement l'algorithme de consensus le plus pratique, etcd/Consul reposent dessus
5. **Transactions distribuées** : Saga convient à la plupart des scénarios, TCC aux scénarios financiers, 2PC au niveau base de données

## Pour aller plus loin

- [Designing Data-Intensive Applications](https://dataintensive.net/) - L'ouvrage classique de Martin Kleppmann sur les systèmes distribués
- [The Raft Consensus Algorithm](https://raft.github.io/) - Démonstration visuelle officielle de Raft
- [CAP Twelve Years Later](https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/) - Réexamen de CAP par Brewer
- [Jepsen](https://jepsen.io/) - Cadre de test de correction pour systèmes distribués
- [Patterns de systèmes distribués](https://martinfowler.com/articles/patterns-of-distributed-systems/) - Collection de patterns distribués de Martin Fowler
