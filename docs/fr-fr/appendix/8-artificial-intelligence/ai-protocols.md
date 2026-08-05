# Principes : Protocoles agents IA : MCP et A2A

::: tip Question centrale
**Comment les agents IA « dialoguent-ils » avec le monde extérieur ?** Tout comme Internet a besoin du protocole HTTP, les agents IA ont besoin de protocoles de communication standardisés. Ce chapitre présente les deux protocoles d'agent les plus répandus : MCP et A2A, qui résolvent respectivement les problèmes de communication entre l'IA et les outils, et entre agents.
:::

---

## 0. Présentation et définition : un protocole

Dans le domaine informatique, un **protocole (Protocol)** est un ensemble de règles et de conventions standardisées permettant à différents systèmes et programmes de se « comprendre » et de « communiquer » entre eux.

### 0.1 Pourquoi a-t-on besoin de protocoles

Imaginez un scénario : vous envoyez un colis à un ami, vous devez remplir l'adresse. Si chacun écrivait le format d'adresse différemment, le livreur ne pourrait pas livrer. Le protocole définit la norme « comment écrire l'adresse » — province, ville, arrondissement, rue, numéro, en suivant ce format, tout le monde peut comprendre.

C'est la même chose pour les ordinateurs. Pour que deux programmes communiquent, ils doivent convenir de :
- Quel est le format des données ? (JSON ? Binaire ?)
- Comment établir la connexion ? (Processus de handshake)
- Que faire en cas d'erreur ? (Gestion des erreurs)

### 0.2 Protocoles courants en informatique

| Protocole | Rôle | Vous l'utilisez tous les jours |
|------|------|-------------|
| **HTTP** | Protocole de transfert de pages web | Le navigateur ouvre des pages web |
| **HTTPS** | HTTP chiffré | Banque en ligne, pages de paiement |
| **TCP/IP** | Protocole fondamental d'Internet | Toutes les communications réseau |
| **DNS** | Protocole de résolution de noms de domaine | Transforme `google.com` en adresse IP |
| **SMTP** | Protocole d'envoi d'emails | Envoyer des emails |
| **WebSocket** | Communication bidirectionnelle en temps réel | Applications de chat, jeux en ligne |
| **SSH** | Connexion sécurisée à distance | Se connecter à un serveur |
| **FTP** | Protocole de transfert de fichiers | Télécharger/téléverser des fichiers |

Ces protocoles constituent la pierre angulaire d'Internet. Sans eux, vous ne pourriez pas naviguer sur le web, envoyer des emails ou regarder des vidéos.

### 0.3 La valeur des protocoles

La valeur fondamentale des protocoles est la **standardisation** et l'**interopérabilité** :

- **Standardisation** : tout le monde suit les mêmes règles, ce qui réduit les coûts de communication
- **Interopérabilité** : des systèmes de différents fournisseurs et piles technologiques peuvent s'interfacer de manière transparente

Par exemple, le protocole HTTP permet au navigateur Chrome d'accéder à un serveur Nginx, et à un scraper Python d'extraire des données d'un site web Java. Chrome et Nginx n'ont pas besoin de se « connaître », il suffit qu'ils respectent tous les deux le protocole HTTP.

### 0.4 Les agents IA ont aussi besoin de protocoles

Pour qu'un agent IA puisse vraiment « travailler », il a besoin de :
- Appeler des outils externes (consulter la météo, envoyer des emails, manipuler des bases de données)
- Collaborer avec d'autres agents (se répartir le travail pour accomplir des tâches complexes)

Cela nécessite des protocoles standardisés pour définir « comment l'IA appelle les outils » et « comment les agents dialoguent entre eux ». C'est l'origine de **MCP** et **A2A**.

---

## 1. Les niveaux de protocoles d'agent

Avant d'approfondir les protocoles spécifiques, examinons les niveaux de communication dans l'écosystème des agents :

| Niveau | Protocole | Problème résolu | Analogie |
|------|------|-----------|------|
| **1** | Function Call | Comment l'IA appelle des fonctions locales | Le cerveau envoie des instructions |
| **2** | **MCP** | Comment l'IA se connecte aux outils et sources de données externes | Port USB-C |
| **3** | **A2A** | Comment les agents collaborent et communiquent entre eux | WeChat Entreprise |

::: tip Lecture ligne par ligne de ce tableau
**Niveau 1 (Function Call)** : c'est la capacité la plus fondamentale des grands modèles — déclencher l'exécution de fonctions en produisant des données structurées (JSON). C'est la base du « protocole », mais c'est plus une capacité qu'un protocole standard.

**Niveau 2 (MCP)** : Model Context Protocol, publié par Anthropic le 25 novembre 2024. Il standardise la connexion entre l'IA et les outils externes, les sources de données, comme l'USB-C a unifié les interfaces de charge de tous les appareils.

**Niveau 3 (A2A)** : Agent-to-Agent Protocol, publié par Google le 9 avril 2025. Il permet à différents agents de se découvrir, de communiquer et de collaborer, comme WeChat Entreprise permet aux collègues de s'envoyer des tâches et de discuter.
:::

Ce chapitre se concentre sur les deux protocoles formels des niveaux 2 et 3 : MCP et A2A.

---

## 2. MCP (Model Context Protocol)

### 2.1 Informations de base sur le protocole

| Élément | Contenu |
|------|------|
| **Nom complet** | Model Context Protocol |
| **Initiateur** | Anthropic |
| **Date de publication** | 25 novembre 2024 |
| **Documentation officielle** | [modelcontextprotocol.io](https://modelcontextprotocol.io) |
| **Licence open source** | MIT License |
| **GitHub** | [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol) |

::: tip Pourquoi l'appeler « Context Protocol » ?
Le **Context (contexte)** est la clé pour que les grands modèles comprennent les tâches. L'idée centrale de MCP est : **permettre à l'IA d'obtenir dynamiquement les informations contextuelles nécessaires**, plutôt que de tout mettre dans le Prompt.

Par exemple, quand l'IA a besoin de lire un fichier, vous n'avez pas besoin de copier-coller le contenu du fichier, elle peut y accéder directement via MCP.
:::

### 2.2 Contexte de publication

En 2024, avec la sortie de Claude 3.5 Sonnet, Anthropic a constaté un problème : **chaque outil nécessitait une intégration séparée**.

Imaginez :
- Vous voulez que l'IA lise un dépôt GitHub → écrire le code d'intégration GitHub
- Vous voulez que l'IA interroge une base de données → écrire le code d'intégration base de données
- Vous voulez que l'IA manipule le système de fichiers → écrire le code d'intégration système de fichiers

Chaque intégration nécessite de répéter du code similaire : authentification, gestion d'erreurs, conversion de données...

Anthropic a écrit dans son blog officiel :
> "We're introducing the Model Context Protocol (MCP), an open protocol that standardizes how applications provide context to LLMs."

**Objectif central** : permettre aux développeurs d'outils d'écrire le code une seule fois, et que toutes les applications IA supportant MCP puissent l'utiliser.

### 2.3 Qu'est-ce que MCP

<McpVisualDemo />

**Trois capacités fondamentales** :

| Capacité | Anglais | Rôle | Exemple |
|------|------|------|------|
| **Outils** | Tools | Fonctions que l'IA peut appeler | Consulter la météo, envoyer un email |
| **Ressources** | Resources | Données que l'IA peut lire | Contenu de fichiers, enregistrements de base de données |
| **Prompts** | Prompts | Templates de prompts prédéfinis | Template de revue de code, template d'écriture |

### 2.4 Implémentation interne de MCP

<McpDetailedDemo />

### 2.5 Analogie : le port USB-C

MCP est comme le **port USB-C** :

- **Avant** : chaque appareil avait son propre port de charge (rond, plat, magnétique...)
- **Maintenant** : l'USB-C a unifié la charge et le transfert de données pour tous les appareils
- **MCP** : unifie la connexion entre l'IA et tous les outils

Le développeur d'outils n'a qu'à implémenter un MCP Server une seule fois, et toutes les applications IA supportant MCP (Claude, Cursor, Windsurf, etc.) peuvent l'utiliser directement.

### 2.6 Scénarios d'application typiques de MCP

| Scénario | Description | Exemple |
|------|------|------|
| **Manipulation de fichiers locaux** | Permettre à l'IA de lire/modifier des fichiers locaux | Lire une base de code, analyser des fichiers journaux |
| **Requêtes de base de données** | Permettre à l'IA d'interroger directement des bases de données | Requêtes SQL, analyse de données |
| **Appels API** | Permettre à l'IA d'appeler des services tiers | API GitHub, Slack, email |
| **Intégration d'outils de développement** | Permettre à l'IA d'utiliser des outils de développement | Opérations Git, commandes terminal |

**Cas réels** :
- **Cursor/Windsurf** : connexion au système de fichiers, Git, terminal via MCP
- **Claude Desktop** : connexion aux applications de notes, client email via MCP
- **Scripts d'automatisation** : permettre à l'IA d'exécuter des tâches automatisées (sauvegarde, déploiement, synchronisation de données)

---

## 3. A2A (Agent-to-Agent Protocol)

### 3.1 Informations de base sur le protocole

| Élément | Contenu |
|------|------|
| **Nom complet** | Agent-to-Agent Protocol |
| **Initiateur** | Google |
| **Date de publication** | 9 avril 2025 |
| **Documentation officielle** | [google.github.io/A2A](https://google.github.io/A2A) |
| **Licence open source** | Apache 2.0 |
| **GitHub** | [github.com/google/A2A](https://github.com/google/A2A) |

::: tip Pourquoi Google en est-il l'initiateur ?
Google a publié A2A lors de la conférence Cloud Next 2025, étroitement lié à sa stratégie d'IA d'entreprise.

Google estime que l'IA d'entreprise du futur n'est pas un seul super-agent, mais **plusieurs agents spécialisés qui collaborent** — certains pour l'analyse de données, d'autres pour la génération de code, d'autres pour le traitement de documents.

Ces agents ont besoin d'un moyen standardisé de communiquer entre eux, d'où la naissance d'A2A.
:::

### 3.2 Contexte de publication

MCP a résolu le problème « comment l'IA se connecte aux outils », mais il reste une question : **comment plusieurs agents collaborent-ils ?**

Imaginez un scénario :
- L'Agent A est un « expert en analyse des besoins »
- L'Agent B est un « expert en génération de code »
- L'Agent C est un « expert en tests »

L'utilisateur dit : « Aide-moi à développer une fonctionnalité de connexion »

L'Agent A analyse les besoins, puis doit déléguer la tâche à l'Agent B ; l'Agent B écrit le code, puis doit le faire tester par l'Agent C. Comment communiquent-ils entre eux ?

Google a écrit dans son blog officiel :
> "A2A is an open protocol that enables AI agents to communicate with each other, facilitating collaboration across different frameworks and vendors."

**Objectif central** : permettre aux agents développés par différents fournisseurs et frameworks de collaborer de manière transparente.

### 3.3 Qu'est-ce que A2A

<A2AVisualDemo />

**Trois concepts fondamentaux** :

| Concept | Anglais | Rôle | Analogie |
|------|------|------|------|
| **Agent Card** | Carte d'agent | Décrit les capacités de l'agent | Badge d'employé |
| **Task** | Tâche | Unité de travail à exécuter | Bon de travail |
| **Message** | Message | Contenu de communication entre agents | Historique de chat |

### 3.4 Implémentation interne d'A2A

<A2ADetailedDemo />

### 3.5 Analogie : WeChat Entreprise

A2A est comme **WeChat Entreprise** :

- **Agent Card** : la carte de visite de chacun, affichant le nom, le département, les responsabilités
- **Envoyer une tâche** : @quelqu'un, assigner une tâche
- **Communication par chat** : possibilité de communiquer à tout moment pendant l'exécution de la tâche
- **Suivi de tâche** : voir la progression et l'état de la tâche

Les différents agents sont comme différents collègues, A2A leur permet de collaborer pour accomplir des projets complexes.

### 3.6 Scénarios d'application typiques d'A2A

| Scénario | Description | Exemple |
|------|------|------|
| **Développement logiciel** | Collaboration multi-agents pour des tâches de développement | Analyse des besoins → Code → Tests → Déploiement |
| **Workflow d'entreprise** | Collaboration d'agents de différents départements | Agent RH + Agent Finance + Agent Juridique |
| **Service client intelligent** | Répartition du travail entre plusieurs agents spécialisés | Accueil → Réponse → Transfert → Enregistrement |
| **Analyse de données** | Collaboration de plusieurs agents pour analyser les données | Collecte → Nettoyage → Analyse → Visualisation → Rapport |

**Cas réels** :
- **Google Agent Space** : collaboration de plusieurs agents en entreprise pour traiter des documents, emails, agendas
- **Équipe de développement logiciel** : Agent Besoins → Agent Code → Agent Tests → Agent Déploiement
- **Système de service client intelligent** : Agent Accueil → Agent Réponse spécialisée → Agent Transfert humain

---

## 4. MCP vs A2A : comparaison et relation

### 4.1 Différences fondamentales

| Dimension | MCP | A2A |
|------|-----|-----|
| **Initiateur** | Anthropic (nov. 2024) | Google (avr. 2025) |
| **Positionnement** | Connexion IA-Outils | Collaboration Agent-Agent |
| **Portée de communication** | Client-Serveur | Peer-to-Peer |
| **Format de données** | JSON-RPC 2.0 | HTTP + JSON |
| **Analogie** | Port USB-C | WeChat Entreprise |

### 4.2 Relation entre les deux

MCP et A2A ne sont **pas en concurrence, mais complémentaires** :

<ProtocolComparisonDemo />

### 4.3 Comment choisir

| Scénario | Choix |
|------|------|
| Faire appeler des fonctions ou outils locaux à l'IA | Function Call |
| Utiliser des outils tiers (base de données, API, système de fichiers) | MCP |
| Construire un système de collaboration multi-agents | A2A |
| Besoin simultané d'intégration d'outils et de collaboration multi-agents | MCP + A2A |

---

## 5. Tendances futures des protocoles

### 5.1 Développement de l'écosystème

**Écosystème MCP** (début 2025) :
- Serveurs officiels fournis : système de fichiers, SQLite, Git, PostgreSQL, etc.
- Serveurs contribués par la communauté : Slack, Notion, Figma, Stripe, etc.
- Applications supportant MCP : Claude Desktop, Cursor, Windsurf, Zed, etc.

**Écosystème A2A** (vient d'être publié) :
- Les produits Agent de Google sont les premiers à le supporter
- La communauté open source développe des SDK pour divers langages
- Les applications d'entreprise sont en cours d'exploration

### 5.2 Processus de standardisation

Actuellement, les protocoles d'agent sont encore dans une « période des Royaumes combattants » :
- MCP et A2A sont les deux plus répandus
- D'autres protocoles émergents comme ANP, AGP existent également
- Une fusion ou unification pourrait se produire à l'avenir

Analogie avec le développement d'Internet :
- Début : coexistence de divers protocoles de réseau local
- Ensuite : TCP/IP est devenu le standard
- Aujourd'hui : les protocoles d'agent pourraient aussi converger vers l'unification

---

## 6. Résumé

::: tip Points essentiels
| Protocole | En une phrase | Date de publication | Initiateur | Scénario applicable |
|------|-----------|---------|--------|---------|
| **MCP** | L'« USB-C » pour connecter l'IA aux outils | Nov. 2024 | Anthropic | Intégration d'outils, connexion aux sources de données |
| **A2A** | Le « WeChat Entreprise » pour la collaboration des agents | Avr. 2025 | Google | Collaboration multi-agents, délégation de tâches |

**Aperçus clés** :
1. MCP résout le problème « comment l'IA obtient des capacités externes »
2. A2A résout le problème « comment plusieurs IA collaborent »
3. Les deux sont complémentaires et pourraient être utilisés ensemble à l'avenir
4. Le choix du protocole dépend du scénario spécifique, il n'y a pas de solution miracle
:::

---

## Références

1. **Documentation officielle MCP** : [modelcontextprotocol.io](https://modelcontextprotocol.io)
2. **GitHub MCP** : [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)
3. **Blog de publication Anthropic** : "Introducing the Model Context Protocol" (25/11/2024)
4. **Documentation officielle A2A** : [google.github.io/A2A](https://google.github.io/A2A)
5. **GitHub A2A** : [github.com/google/A2A](https://github.com/google/A2A)
6. **Blog Google Cloud** : "Announcing the Agent-to-Agent Protocol" (09/04/2025)