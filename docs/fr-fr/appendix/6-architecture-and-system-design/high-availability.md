# Principes : Haute disponibilité et reprise après sinistre

::: tip Avant-propos
**Une indisponibilité d'une minute peut représenter des centaines de milliers de pertes.** La haute disponibilité (High Availability) désigne la capacité d'un système à continuer de fournir un service face aux pannes matérielles, bugs logiciels, problèmes réseau et autres situations anormales. La reprise après sinistre (Disaster Recovery) est la capacité du système à rétablir ses services lorsqu'un sinistre de grande ampleur se produit.
:::

**Que allez-vous apprendre dans cet article ?**

À l'issue de ce chapitre, vous aurez acquis :

- **Mesure de la disponibilité** : comprendre la signification des « nines » et des temps d'indisponibilité correspondants
- **Basculement en cas de panne** : maîtriser les architectures haute disponibilité : actif-standby, actif-actif, multi-actif
- **Stratégies de reprise après sinistre** : connaître les concepts de RPO et RTO ainsi que les méthodes de conception associées
- **Détection des pannes** : comprendre les mécanismes de découverte de pannes : battements de cœur, sondes, disjoncteurs
- **Chaos Engineering** : découvrir comment injecter activement des pannes pour vérifier la résilience du système

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Mesure de la disponibilité | SLA, « nines », temps d'indisponibilité |
| **Chapitre 2** | Architecture de basculement | Actif-standby, actif-actif, multi-AZ, multi-région actif-actif |
| **Chapitre 3** | Conception de la reprise après sinistre | RPO, RTO, stratégies de sauvegarde |
| **Chapitre 4** | Détection et récupération des pannes | Battements de cœur, disjoncteurs, mise à l'échelle automatique |
| **Chapitre 5** | Chaos Engineering | Injection de pannes, vérification de la résilience |

---

## 1. Mesure de la disponibilité : que signifient les « nines »

La disponibilité se mesure généralement en « nines », selon la formule :

**Disponibilité = Temps de fonctionnement / Temps total x 100 %**

Par exemple, sur un mois (30 jours = 43 200 minutes), si le système est indisponible pendant 43 minutes, la disponibilité est de (43 200 - 43) / 43 200 ≈ 99,9 %. Chaque « nine » supplémentaire réduit le temps d'indisponibilité autorisé d'un ordre de grandeur, et la difficulté et le coût augmentent de façon exponentielle.

| Niveau de disponibilité | Pourcentage | Indisponibilité mensuelle autorisée | Indisponibilité annuelle autorisée | Besoins typiques |
|-----------|--------|------------|------------|---------|
| 2 nines | 99 % | 7,3 heures | 3,65 jours | Outils internes |
| 3 nines | 99,9 % | 43 minutes | 8,76 heures | Systèmes métier courants |
| 4 nines | 99,99 % | 4,3 minutes | 52,6 minutes | E-commerce, SaaS |
| 5 nines | 99,999 % | 26 secondes | 5,26 minutes | Finance, paiements |

<AvailabilityCalculatorDemo />

::: tip Qu'est-ce qu'un SLA ?
Le **SLA (Service Level Agreement, Accord de Niveau de Service)** est un engagement formel entre le fournisseur de services et ses clients. Par exemple, AWS S3 garantit une disponibilité de 99,99 % ; si cet objectif n'est pas atteint, un remboursement proportionnel est effectué. Le SLA n'est pas qu'un indicateur technique, c'est aussi un contrat commercial — violer le SLA signifie perdre de l'argent.
:::

::: tip Le fossé entre 3 nines et 4 nines
3 nines (99,9 %) signifie que le système peut être indisponible 43 minutes par mois — un déploiement problématique suivi d'un rollback et le quota est épuisé.
4 nines (99,99 %) signifie que seules 4 minutes d'indisponibilité sont autorisées par mois — cela exige un système haute disponibilité complet : basculement automatique, déploiement en continu (_rolling deployment_), vérifications de santé, etc.
:::

---

## 2. Architecture de basculement en cas de panne

Le basculement (_Failover_) est le mécanisme central de la haute disponibilité : lorsque le nœud principal tombe en panne, le système bascule automatiquement vers un nœud de secours pour poursuivre le service.

### Mode actif-standby (Active-Standby)

L'architecture haute disponibilité la plus courante. Le nœud principal traite toutes les requêtes, le nœud de secours synchronise les données en temps réel mais ne traite aucune requête. En cas de panne du nœud principal, le nœud de secours prend automatiquement le relais.

```
État normal :
  Client → Nœud principal (traite les requêtes)
            Nœud de secours (synchronise les données, en attente)

Basculement :
  Client → Nœud de secours (prend le relais comme nouveau nœud principal)
            Ancien nœud principal (en panne, en attente de réparation)
```

Le problème critique est le **split-brain** : lors d'une partition réseau, les nœuds principal et de secours croient chacun que l'autre est en panne et se mettent tous les deux à servir les requêtes, entraînant une incohérence des données. La solution consiste à introduire un **nœud arbitre (Quorum)** — au moins 3 nœuds votent pour déterminer qui est le nœud principal.

### Multi-AZ (Multi-Zone de Disponibilité)

Déployer les services dans plusieurs centres de données (zones de disponibilité) d'une même région. La coupure de courant ou de réseau d'un seul centre de données n'affecte pas le service global. Les zones de disponibilité des fournisseurs cloud sont généralement reliées par des liaisons dédiées à faible latence (< 2 ms).

### Multi-région actif-actif

Déployer des réplicas complets du service dans des villes voire des pays différents, chaque site étant capable de traiter indépendamment les requêtes. C'est le plus haut niveau d'architecture haute disponibilité, mais aussi le plus complexe — le défi principal est la **synchronisation des données inter-régions** en termes de latence et de cohérence.

<FailoverStrategyDemo />

| Architecture | Niveau de disponibilité | Coût | Complexité | Cas d'usage |
|------|-----------|------|--------|---------|
| Serveur unique | 99 % à 99,9 % | Faible | Faible | Développement/test, outils internes |
| Actif-standby | 99,9 % à 99,99 % | Moyen | Moyen | Systèmes métier de taille petite à moyenne |
| Multi-AZ | 99,99 % | Élevé | Élevé | E-commerce, plateformes SaaS |
| Multi-région actif-actif | 99,999 % | Très élevé | Très élevé | Finance, grands groupes Internet |

---

## 3. Conception de la reprise après sinistre : RPO et RTO

La conception de la reprise après sinistre s'articule autour de deux indicateurs clés :

| Indicateur | Nom complet | Signification | Exemple |
|------|------|------|------|
| RPO | Recovery Point Objective | Combien de données peut-on tolérer de perdre | RPO = 0 signifie qu'aucune donnée ne peut être perdue |
| RTO | Recovery Time Objective | Combien de temps d'indisponibilité peut-on tolérer | RTO = 5 min signifie qu'il faut récupérer en 5 minutes |

### Relation entre stratégie de sauvegarde et RPO

| Méthode de sauvegarde | RPO | Coût | Description |
|---------|-----|------|------|
| Sauvegarde complète quotidienne | 24 heures | Faible | Perte maximale d'une journée de données |
| Sauvegarde incrémentale en temps réel | De l'ordre de la minute | Moyen | Synchronisation continue via binlog/WAL |
| Réplication synchrone | 0 | Élevé | L'écriture doit attendre la confirmation du réplica |

::: tip Toutes les données n'ont pas besoin d'un RPO de 0
Un avatar utilisateur perdu peut être rechargé (un RPO de 24 h suffit), mais un enregistrement de paiement ne peut en aucun cas être perdu (RPO = 0). Déterminez la stratégie de sauvegarde en fonction de la valeur métier des données, plutôt que d'appliquer une règle uniforme.
:::

---

## 4. Détection et récupération des pannes

### 4.1 Mécanismes de détection des pannes

| Mécanisme | Principe | Vitesse de détection | Cas d'usage |
|------|------|---------|---------|
| Battement de cœur | Envoi régulier de paquets de battement de cœur, déclaration de panne en cas de dépassement du délai | De l'ordre de la seconde | Détection de survie des nœuds |
| Vérification de santé | Sondes HTTP/TCP vérifiant l'état du service | De l'ordre de la seconde | Détection des backends par les load balancers |
| Sonde métier | Simulation de requêtes réelles vérifiant la logique métier | De la seconde à la minute | Surveillance de disponibilité de bout en bout |

**Principe de fonctionnement du battement de cœur** : le nœud A envoie périodiquement (par exemple toutes les 5 secondes) un signal « je suis toujours vivant » au superviseur. Si le superviseur ne reçoit pas le battement de cœur pendant N essais consécutifs (par exemple 3), il déclare le nœud A en panne. Les paramètres clés sont l'**intervalle de battement** et le **seuil d'expiration** — un intervalle trop court augmente la charge réseau, un intervalle trop long retarde la détection de la panne.

**Les trois niveaux de vérification de santé** :
- **Sonde de vivacité (Liveness)** : le processus fonctionne-t-il encore ? Si non, le redémarrer
- **Sonde de disponibilité (Readiness)** : le service peut-il accepter des requêtes ? Si non, le retirer de l'équilibreur de charge
- **Sonde de démarrage (Startup)** : le service a-t-il fini de démarrer ? Si non, attendre, ne pas le déclarer en panne à tort

### 4.2 Mécanismes de récupération automatique

| Mécanisme | Description | Outils typiques |
|------|------|---------|
| Redémarrage automatique | Relance automatique du processus après un crash | systemd, PM2, K8s |
| Mise à l'échelle automatique | Augmentation automatique des instances lors d'une montée en charge | K8s HPA, Auto Scaling des fournisseurs cloud |
| Disjoncteur et dégradation | Échec rapide en cas de panne en aval, prévention des pannes en cascade | Hystrix, Sentinel, Resilience4j |
| Limitation de débit | Rejet direct des requêtes au-delà de la capacité | Nginx limit_req, limitation au niveau de la passerelle |

**Le pattern Disjoncteur (Circuit Breaker) en détail** :

Le disjoncteur s'inspire des fusibles électriques — lorsque le courant est trop fort, il se coupe automatiquement pour protéger l'ensemble du circuit. Dans les microservices, lorsqu'un service en aval est en panne, le disjoncteur « s'ouvre », permettant aux requêtes d'échouer rapidement au lieu d'attendre stupidement un dépassement de délai.

```
Trois états du disjoncteur :

  Fermé (正常) ──→ Taux d'échec dépasse le seuil ──→ Ouvert (disjonction)
       ↑                                    │
       │                              Attente de la période de refroidissement
       │                                    ↓
       └── Requête de sondage réussie ←── Semi-ouvert (sondage)
```

- **État fermé** : transfert normal des requêtes, tout en calculant le taux d'échec
- **État ouvert** : toutes les requêtes renvoient directement une erreur (échec rapide), plus d'appel au service en aval
- **État semi-ouvert** : après la période de refroidissement, quelques requêtes de sondage sont laissées passer. Si elles réussissent, retour à l'état fermé ; si elles échouent, retour à l'état ouvert

**La dégradation (Fallback)** est la stratégie complémentaire du disjoncteur : lorsque le disjoncteur se déclenche, au lieu de renvoyer une erreur, on retourne un résultat « de secours ». Par exemple, si le service de recommandation est en panne, on renvoie la liste des produits populaires ; si le chargement de l'avatar utilisateur échoue, on affiche un avatar par défaut.

---

## 5. Chaos Engineering : chercher activement les problèmes

L'idée fondamentale du Chaos Engineering est la suivante : **plutôt que d'attendre qu'une panne se produise, mieux vaut la provoquer activement**, dans un environnement contrôlé, pour vérifier la résilience du système.

| Outil | Créateur | Capacité principale |
|------|--------|---------|
| Chaos Monkey | Netflix | Arrêt aléatoire d'instances en environnement de production |
| Chaos Mesh | PingCAP | Injection de pannes dans les environnements K8s |
| Litmus | CNCF | Cadre de Chaos Engineering natif cloud |
| ChaosBlade | Alibaba | Outil d'injection de pannes multi-scénarios |

::: tip Étapes de mise en œuvre du Chaos Engineering
1. **Définir l'état stable** : préciser les indicateurs de fonctionnement normal du système (ex. latence P99 < 200 ms)
2. **Formuler une hypothèse** : si un nœud tombe en panne, le système doit se rétablir automatiquement en 30 secondes
3. **Injecter la panne** : provoquer des pannes de manière contrôlée (d'abord en environnement de test, puis en production)
4. **Observer les résultats** : le système se rétablit-il comme prévu ? Y a-t-il des pannes en cascade ?
5. **Corriger les faiblesses** : améliorer l'architecture et les processus après la découverte de problèmes
:::

---

## Résumé

La haute disponibilité n'est pas une fonctionnalité, c'est une capacité architecturale. Elle doit être garantie à chaque étape : conception, développement, déploiement et exploitation.

Rappel des points clés de ce chapitre :

1. **Les « nines »** : chaque « nine » supplémentaire réduit le temps d'indisponibilité d'un ordre de grandeur, avec un coût et une complexité qui croissent de manière exponentielle
2. **Basculement en cas de panne** : de l'actif-standby au multi-région actif-actif, choisir l'architecture adaptée aux besoins métier
3. **RPO et RTO** : concevoir les stratégies de sauvegarde et de récupération en fonction de la valeur des données et de la tolérance métier
4. **Automatisation** : détection des pannes, redémarrage automatique, disjoncteur et dégradation constituent l'infrastructure de la haute disponibilité
5. **Chaos Engineering** : injecter activement des pannes pour vérifier la résilience du système dans un environnement contrôlé

## Pour aller plus loin

- [Site Reliability Engineering](https://sre.google/sre-book/table-of-contents/) - L'ouvrage classique du SRE de Google
- [Chaos Monkey](https://netflix.github.io/chaosmonkey/) - L'outil de Chaos Engineering de Netflix
- [Release It!](https://pragprog.com/titles/mnee2/release-it-second-edition/) - Patterns de conception pour les environnements de production
- [Chaos Mesh](https://chaos-mesh.org/) - Plateforme de Chaos Engineering pour K8s
