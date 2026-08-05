# Principes : Surveillance, journalisation et alerting
> Guide d'apprentissage : ce chapitre ne nécessite aucune compétence en programmation. Des démonstrations interactives vous feront découvrir l'ensemble du corpus de connaissances en exploitation. De la surveillance des alertes à la résolution d'incidents, de la planification de capacité à l'exploitation automatisée, vous maîtriserez toutes les compétences nécessaires à l'exploitation de systèmes en production.

## 0. Introduction : la mise en production n'est que le début

Beaucoup de débutants pensent : « Le code est déployé en production, la mission est accomplie. »

**Grave erreur !**

La mise en production n'est que le **point de départ de l'exploitation**. Comme pour une voiture neuve, l'entretien, les réparations et le ravitaillement constituent la routine.

Les objectifs de l'exploitation sont au nombre de trois :

1. **Stabilité (Stability)** : le système ne doit pas tomber en panne, les services doivent rester disponibles
2. **Performance (Performance)** : temps de réponse rapide, bonne expérience utilisateur
3. **Sécurité (Security)** : les données ne doivent pas fuir, se protéger contre les attaques

---

## 1. Système de surveillance (Monitoring)

La surveillance est le « regard » de l'exploitation. Un système sans surveillance, c'est comme un conducteur aveugle : en cas de problème, on ne le sait même pas.

### 1.1 Les trois niveaux de surveillance

<MonitoringDashboardDemo />

**Surveillance de l'infrastructure** : les ressources matérielles des serveurs

- Utilisation CPU
- Utilisation mémoire
- Espace disque et E/S
- Bande passante réseau

**Surveillance applicative** : l'état de fonctionnement des logiciels

- QPS (requêtes par seconde)
- Temps de réponse (latence)
- Taux d'erreur
- Appels aux services dépendants

**Surveillance métier** : la santé de l'activité

- DAU/MAU (utilisateurs actifs quotidiens/mensuels)
- Volume de commandes
- Taux de succès des paiements
- Taux de rétention des utilisateurs

### 1.2 Stack d'outils de surveillance

| Outil           | Usage           | Caractéristiques                     |
| :------------- | :------------- | :----------------------- |
| **Prometheus** | Collecte et stockage de métriques | Base de données temporelle, adaptée aux données de surveillance |
| **Grafana**    | Tableau de bord de visualisation     | Graphiques et dashboards puissants   |
| **Zabbix**     | Surveillance complète       | Outil historique, fonctionnalités exhaustives       |
| **Datadog**    | Plateforme de surveillance SaaS  | Solution tout-en-un, payante     |

**Point clé** : la surveillance doit être multicouche, couvrant tous les aspects de l'infrastructure à l'activité, pour éviter les « angles morts ».

---

## 2. Système d'alertes (Alerting)

Une fois que la surveillance a détecté un problème, il faut en informer rapidement l'équipe d'exploitation — c'est le rôle des **alertes**.

### 2.1 Flux d'alertes

<AlertFlowDemo />

### 2.2 Conception des niveaux d'alerte

Une graduation raisonnable des alertes permet d'éviter la « fatigue d'alertes » :

| Niveau   | Temps de réponse        | Scénario typique                   | Canal de notification           |
| :----- | :-------------- | :------------------------- | :----------------- |
| **P0** | Immédiat (sous 5 minutes) | Service principal en panne, échec de paiement     | Téléphone + SMS + DingTalk |
| **P1** | Sous 30 minutes        | Dysfonctionnement partiel, baisse sévère de performance | SMS + DingTalk + Email |
| **P2** | Traitement dans la journée        | Taux d'utilisation des ressources élevé, erreurs sporadiques   | DingTalk + Email        |
| **P3** | Traitement dans la semaine        | Problèmes non critiques, suggestions d'optimisation       | Email               |

### 2.3 Consolidation et réduction du bruit des alertes

**Problème récurrent** : un seul incident peut déclencher des centaines, voire des milliers d'alertes, conduisant à l'insensibilité de l'équipe de garde.

**Solutions :**

1. **Regroupement des alertes** : fusionner les alertes similaires (par ex. consolider plusieurs problèmes d'un même serveur en une seule alerte)
2. **Suppression des alertes** : si le problème parent est déjà signalé, ne pas alerter pour les sous-problèmes
3. **Règles de mise en sourdine** : suspendre automatiquement les alertes pendant les fenêtres de maintenance
4. **Limitation de fréquence** : ne pas notifier à plusieurs reprises la même alerte dans un court intervalle

**Point clé** : les alertes doivent être « peu nombreuses mais pertinentes », chacune doit mériter un traitement.

---

## 3. Gestion des journaux (Logging)

Les journaux sont la « boîte noire » du dépannage.

### 3.1 Niveaux de journalisation

```javascript
console.debug('Informations de débogage détaillées') // Utilisé en développement
console.info('Informations générales') // Enregistrement du flux normal
console.warn('Message d\'avertissement') // Problème potentiel
console.error('Message d\'erreur') // Erreurs nécessitant une attention
```

### 3.2 Journaux structurés

Journaux traditionnels (mauvaise pratique) :

```
2024-01-15 10:23:45 ERROR User john failed to login, attempts=3, ip=192.168.1.100
```

Journaux structurés (recommandé) :

```json
{
  "timestamp": "2024-01-15T10:23:45Z",
  "level": "ERROR",
  "message": "User login failed",
  "user": "john",
  "attempts": 3,
  "ip": "192.168.1.100",
  "service": "auth-service"
}
```

### 3.3 Stack de journaux ELK

**ELK = Elasticsearch + Logstash + Kibana**

- **Logstash** : collecte et filtrage des journaux
- **Elasticsearch** : stockage et recherche des journaux
- **Kibana** : visualisation et interrogation des journaux

**Bonnes pratiques :**

- Les informations sensibles (mots de passe, tokens) ne doivent pas figurer dans les journaux
- Les opérations critiques (connexion, paiement, modification de permissions) doivent être journalisées
- Les journaux doivent inclure le contexte (ID utilisateur, ID de requête, horodatage)
- Nettoyer régulièrement les journaux obsolètes pour éviter la saturation des disques

---

## 4. Traçage distribué (Tracing)

Dans une architecture de microservices, une requête peut traverser une dizaine de services. Comment tracer son chemin complet ?

**Trace ID et Span ID**

- **Trace ID** : l'identifiant unique de la chaîne complète d'une requête (comme un numéro de suivi de colis)
- **Span ID** : l'identifiant d'un appel de service individuel (comme chaque relais)

### 4.1 Démonstration de traçage distribué

<TraceVisualizationDemo />

### 4.2 Standard OpenTelemetry

OpenTelemetry (OTel) est le **standard industriel** du traçage distribué, fournissant des API et SDK unifiés.

```javascript
// Exemple : utiliser OpenTelemetry pour enregistrer un Span
import { trace } from '@opentelemetry/api'

const tracer = trace.getTracer('my-service')

async function processOrder(orderId) {
  // Créer un Span
  const span = tracer.startSpan('processOrder')

  try {
    // Définir des attributs
    span.setAttribute('order.id', orderId)

    // Logique métier...
    await validateOrder(orderId)
    await saveToDatabase(orderId)

    span.setStatus({ code: SpanStatusCode.OK })
  } catch (error) {
    span.recordException(error)
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message })
  } finally {
    span.end() // Terminer le Span
  }
}
```

**Point clé** : le traçage distribué permet de localiser rapidement les goulots d'étranglement et les points de défaillance. C'est un outil incontournable en environnement microservices.

---

## 5. Processus de résolution d'incidents

Les incidents en production sont inévitables. L'essentiel est de **répondre rapidement et restaurer rapidement**.

### 5.1 Processus de traitement des incidents

<IncidentResponseDemo />

### 5.2 Outils de dépannage courants

| Outil         | Usage         | Scénario typique                 |
| :----------- | :----------- | :----------------------- |
| **tcpdump**  | Capture et analyse de paquets     | Problèmes réseau, perte de paquets     |
| **strace**   | Traçage des appels système | Processus bloqué, problèmes de permissions de fichiers   |
| **Arthas**   | Diagnostic Java    | Pic CPU, fuite mémoire, interblocage |
| **top/htop** | Surveillance des ressources système | Forte occupation CPU/mémoire           |
| **netstat**  | Consultation des connexions réseau | Port occupé, nombre de connexions anormal     |
| **lsof**     | Consultation des fichiers ouverts | Fichier occupé, disque saturé       |

**Exemple avec Arthas** (outil de diagnostic Java open source par Alibaba) :

```bash
# Voir les 5 threads consommant le plus de CPU
$ top -H -p 12345

# Voir le temps d'exécution d'une méthode
$ trace com.example.OrderService createOrder

# Voir les champs statiques d'une classe
$ getstatic com.example.Config MAX_CONNECTIONS

# Mise à jour à chaud du code (sans redémarrage)
$ mc /tmp/Test.java
$ redefine /tmp/Test.class
```

### 5.3 Rétrospective post-incident (Post-mortem)

**Une rétrospective n'est pas une session de recherche de coupables !**

Les objectifs de la rétrospective sont :

1. Reconstituer la chronologie de l'incident
2. Identifier la cause racine (Root Cause Analysis)
3. Tirer des leçons
4. Élaborer des mesures d'amélioration

**Méthode des 5 Pourquoi :**

Poser la question « pourquoi » au moins 5 fois pour atteindre la cause racine :

- Pourquoi le service est-il tombé ?
  - Parce qu'il y a eu un dépassement mémoire (OOM)
- Pourquoi un dépassement mémoire ?
  - Parce que les données en cache étaient trop volumineuses
- Pourquoi les données en cache étaient-elles trop volumineuses ?
  - Parce qu'aucune durée d'expiration n'était configurée
- Pourquoi aucune durée d'expiration n'était configurée ?
  - Parce qu'elle a été oubliée lors du développement
- **Cause racine** : absence de revue de code et de cas de test

**Point clé** : instaurer une culture blameless, se concentrer sur l'amélioration des processus plutôt que sur la responsabilité individuelle.

---

## 6. Optimisation des performances

### 6.1 Analyse des goulots d'étranglement

**Approche d'optimisation descendante :**

```
Perception utilisateur
  ↓
Optimisation frontend (réduire les requêtes, CDN, chargement différé)
  ↓
Optimisation réseau (HTTP/2, compression, connexions persistantes)
  ↓
Optimisation backend (cache, asynchrone, traitement par lots)
  ↓
Optimisation de la base de données (index, optimisation des requêtes, sharding)
  ↓
Optimisation système (paramètres noyau, réglage JVM)
```

### 6.2 Optimisation de la base de données

**Optimisation des index :**

```sql
-- Requête lente (sans index)
SELECT * FROM orders WHERE user_id = 12345;

-- 100 fois plus rapide après création de l'index
CREATE INDEX idx_user_id ON orders(user_id);
```

**Optimisation des requêtes :**

```sql
-- À éviter : SELECT *
SELECT * FROM users WHERE id = 123;

-- Recommandé : ne sélectionner que les colonnes nécessaires
SELECT id, name, email FROM users WHERE id = 123;

-- À éviter : trop de valeurs dans IN
SELECT * FROM orders WHERE user_id IN (1, 2, 3, ..., 10000);

-- Recommandé : utiliser JOIN ou des requêtes par lots
SELECT * FROM orders o JOIN user_ids u ON o.user_id = u.id;
```

### 6.3 Optimisation du cache

**Architecture de cache multi-niveaux :**

```
Cache du navigateur (CDN)
  ↓
Cache local (mémoire/Guava)
  ↓
Cache distribué (Redis/Memcached)
  ↓
Base de données (MySQL/PostgreSQL)
```

**Stratégies de mise à jour du cache :**

| Stratégie              | Avantages         | Inconvénients         | Cas d'utilisation                 |
| :---------------- | :----------- | :----------- | :----------------------- |
| **Cache-Aside**   | Simple, fiable   | Première requête lente   | Beaucoup de lectures, peu d'écritures                 |
| **Write-Through** | Bonne cohérence des données | Écriture lente       | Équilibre lecture/écriture                 |
| **Write-Behind**  | Écriture extrêmement rapide     | Risque de perte de données | Beaucoup d'écritures, peu de lectures, tolérance à une incohérence temporaire |

**Point clé** : le cache n'est pas une solution miracle. Il faut prendre en compte la cohérence, l'avalanche, la pénétration et autres problèmes (cf. chapitre « Conception du cache système »).

---

## 7. Planification de capacité

### 7.1 Évaluation de la capacité

<CapacityPlanningDemo />

### 7.2 Tests de charge

**Choix des outils :**

| Outil       | Caractéristiques                | Cas d'utilisation      |
| :--------- | :------------------ | :------------ |
| **JMeter** | Puissant, interface graphique    | Tests de charge sur API HTTP |
| **wrk/ab** | Léger, en ligne de commande        | Tests de référence rapides  |
| **Locust** | Scripts Python, distribué | Scénarios de test de charge complexes  |
| **K6**     | Moderne, scripts JS       | Intégration CI/CD    |

**Exemple avec wrk :**

```bash
# Installer wrk
$ brew install wrk  # macOS
$ apt install wrk   # Ubuntu

# Test de charge sur une API HTTP (10 threads, 30 secondes)
$ wrk -t10 -c100 -d30s http://example.com/api/users

# Sortie :
# Running 30s test @ http://example.com/api/users
#   10 threads and 100 connections
#   Thread Stats   Avg      Stdev     Max   +/- Stdev
#     Latency    45.32ms   12.45ms 120.50ms   87.56%
#     Req/Sec     2.12k   123.45    3.45k    89.01%
#   632450 requests in 30.00s, 1.23GB read
# Requests/sec:  21081.67
```

### 7.3 Mise à l'échelle élastique

**Mise à l'échelle automatique à l'ère cloud-native :**

```yaml
# Kubernetes HPA (Horizontal Pod Autoscaler)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

**Lorsque l'utilisation CPU dépasse 70 %, les Pods sont automatiquement mis à l'échelle (maximum 10)**

**Point clé** : anticiper la montée en charge en fonction des prévisions d'activité (par ex. le Double 11) pour ne pas être pris au dépourvu.

---

## 8. Exploitation sécurisée

### 8.1 Contrôle d'accès

**Principe du moindre privilège :**

- Les développeurs ne peuvent accéder qu'à l'environnement de développement
- Les exploitants ne peuvent accéder à la production qu'avec une approbation
- Les opérations sensibles sur la base de données nécessitent une double confirmation

**Bastion (Jump Server) :**

Toutes les opérations d'exploitation passent par un bastion, enregistrant un journal complet de toutes les opérations.

### 8.2 Sauvegarde des données

**Règle 3-2-1 de la sauvegarde :**

- **3** copies des données (1 originale + 2 sauvegardes)
- **2** supports de stockage différents (disque local + stockage cloud)
- **1** sauvegarde hors site (protection contre les sinistres localisés)

**Stratégie de sauvegarde :**

| Type         | Fréquence | Durée de rétention | RTO    | RPO     |
| :----------- | :--- | :------- | :----- | :------ |
| **Sauvegarde complète** | Hebdomadaire | 1 mois   | 4 heures | 24 heures |
| **Sauvegarde incrémentale** | Quotidienne | 1 semaine     | 2 heures | 1 heure  |
| **Sauvegarde en temps réel** | À la seconde | 7 jours     | Minutes | À la seconde    |

**RTO (Recovery Time Objective)** : objectif de temps de récupération (durée maximale d'interruption du service)
**RPO (Recovery Point Objective)** : objectif de point de récupération (volume maximal de données pouvant être perdues)

### 8.3 Scan des vulnérabilités

**Scans réguliers :**

- **Scan de code** : SonarQube, ESLint (découverte des vulnérabilités potentielles)
- **Scan des dépendances** : npm audit, Snyk (détection des vulnérabilités dans les bibliothèques tierces)
- **Scan des conteneurs** : Trivy, Clair (détection des vulnérabilités dans les images)

```bash
# Exemple npm audit
$ npm audit

found 3 vulnerabilities (1 moderate, 2 high)

Package         Severity  Vulnerable versions
lodash          high      <4.17.21
express         moderate  4.0.0 - 4.18.2

# Correction automatique
$ npm audit fix
```

---

## 9. Exploitation automatisée (DevOps)

### 9.1 Pipeline CI/CD

```yaml
# Exemple .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - npm install
    - npm test
  tags:
    - docker

build:
  stage: build
  script:
    - docker build -t myapp:$CI_COMMIT_SHA .
    - docker push registry.example.com/myapp:$CI_COMMIT_SHA
  only:
    - main

deploy:
  stage: deploy
  script:
    - kubectl set image deployment/myapp myapp=registry.example.com/myapp:$CI_COMMIT_SHA
  environment:
    name: production
  when: manual # Déploiement déclenché manuellement
```

### 9.2 Infrastructure as Code (IaC)

**Exemple Terraform** (gestion des ressources cloud) :

```hcl
# main.tf
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "WebServer"
    Env  = "production"
  }
}

resource "aws_security_group" "web" {
  name = "web-sg"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

**Avantages :**

- Contrôle de version : toute la configuration est dans Git
- Reproductible : cohérence des environnements
- Auditable : historique des modifications clair
- Réversible : retour rapide à une version antérieure

### 9.3 Pratiques GitOps

**GitOps = Git + IaC + Automatisation**

Principe fondamental : **le dépôt Git est l'unique source de vérité pour l'infrastructure**

Flux de travail :

```
1. Modifier les fichiers de configuration (push vers Git)
   ↓
2. Le changement dans le dépôt Git déclenche le CI/CD
   ↓
3. Exécution automatique de terraform apply / kubectl apply
   ↓
4. L'infrastructure se met à jour automatiquement
   ↓
5. La surveillance compare l'état réel à l'état souhaité
```

**Outils :** ArgoCD, Flux (déploiement Kubernetes)

---

## 10. Résumé et bonnes pratiques

L'exploitation est un vaste domaine, mais son cœur peut se résumer ainsi :

### 10.1 Modèle de maturité de l'exploitation

| Niveau     | Caractéristiques               | Pratiques                           |
| :------- | :----------------- | :----------------------------- |
| **Débutant** | Réponse réactive, opérations manuelles | Traitement uniquement en cas de problème, déploiement manuel         |
| **Intermédiaire** | Automatisation, standardisation     | CI/CD, surveillance et alertes, documentation        |
| **Avancé** | Approche préventive, auto-guérison     | Planification de capacité, exercices d'incidents, mise à l'échelle automatique |
| **Expert** | Intelligence, exploitation sans surveillance   | AIOps, Chaos Engineering, Serverless    |

### 10.2 Une journée d'un ingénieur d'exploitation

```
09:00 - Consulter les alertes de la nuit, vérifier l'état du système
10:00 - Traiter les problèmes remontés par les utilisateurs
11:00 - Participer à la réunion hebdomadaire R&D, évaluer les risques d'exploitation des nouvelles solutions
14:00 - Optimiser les requêtes lentes, améliorer les performances
15:00 - Revue de code (Code Review)
16:00 - Rédiger la documentation de déploiement, mettre à jour les règles de surveillance
17:00 - Exercice d'incident (Chaos Engineering)
18:00 - Passation de garde
```

### 10.3 Parcours d'apprentissage

**Phase d'initiation** (1 à 3 mois) :

- Maîtriser les commandes Linux courantes
- Découvrir les systèmes de surveillance (Prometheus + Grafana)
- Maîtriser la consultation de journaux (ELK)

**Phase intermédiaire** (3 à 6 mois) :

- Approfondir la technologie des conteneurs (Docker + K8s)
- Maîtriser un outil de diagnostic (Arthas, tcpdump)
- Pratiquer les pipelines CI/CD

**Phase avancée** (6 à 12 mois) :

- Optimisation des performances (base de données, JVM, réseau)
- Planification de capacité et optimisation des coûts
- Rétrospective d'incidents et amélioration des processus

**Phase experte** (plus d'un an) :

- Conception d'architecture (haute disponibilité, reprise après sinistre)
- Chaos Engineering (injection proactive de pannes)
- AIOps (exploitation intelligente)

---

## 11. Glossaire

| Terme            | Nom complet                              | Définition                                           |
| :-------------- | :-------------------------------- | :--------------------------------------------- |
| **Monitoring**  | -                                 | Surveillance, observation en temps réel de l'état de fonctionnement du système.                   |
| **Alerting**    | -                                 | Alertes, notification des personnes concernées en cas d'anomalie.                     |
| **Logging**     | -                                 | Journaux, enregistrement des événements survenus pendant le fonctionnement du système.               |
| **Tracing**     | -                                 | Traçage distribué, suivi du chemin complet d'une requête dans un système distribué.   |
| **QPS**         | Queries Per Second                | Requêtes par seconde, mesure du débit du système.                   |
| **Latency**     | -                                 | Latence, temps entre l'envoi d'une requête et l'obtention de la réponse.                   |
| **RTO**         | Recovery Time Objective           | Objectif de temps de récupération, durée maximale d'interruption du service.               |
| **RPO**         | Recovery Point Objective          | Objectif de point de récupération, volume maximal de données pouvant être perdues.         |
| **Post-mortem** | -                                 | Rétrospective post-incident, analyse des causes et mesures d'amélioration.         |
| **CI/CD**       | Continuous Integration/Delivery   | Intégration continue et livraison continue, automatisation des tests et du déploiement.         |
| **IaC**         | Infrastructure as Code            | Infrastructure as Code, gestion des serveurs, réseaux et autres ressources par du code. |
| **GitOps**      | -                                 | Git Ops, le dépôt Git est l'unique source de vérité pour l'infrastructure.   |
| **ELK**         | Elasticsearch + Logstash + Kibana | Triptyque de collecte, stockage et visualisation des journaux.         |
| **SLA**         | Service Level Agreement           | Accord de niveau de service, engagement de disponibilité du service (par ex. 99,9 %).   |
| **Blameless**   | -                                 | Culture sans blâme, la rétrospective se concentre sur l'amélioration des processus et non sur la responsabilité individuelle.     |

---

## 12. Pour aller plus loin

- **[Conception du cache système](/fr-fr/appendix/4-server-and-backend/caching)** - Principes, motifs et bonnes pratiques du cache
- **[Conception des files de messages](/fr-fr/appendix/4-server-and-backend/message-queues)** - Lissage des pics, découplage asynchrone
- **[Principes d'authentification en pratique](/fr-fr/appendix/4-server-and-backend/auth-authorization)** - Authentification et autorisation, durcissement de la sécurité
- **[Histoire de l'évolution du backend](/fr-fr/appendix/4-server-and-backend/backend-layered-architecture)** - Du monolithe aux microservices jusqu'au Serverless
- **[Déploiement et mise en production](/fr-fr/appendix/7-infrastructure-and-operations/ci-cd)** - Le dernier kilomètre du développement vers la production
