# Panorama : Modèles de données : Document, Graphe, Série temporelle, Vecteur

::: tip 🎯 Question centrale
**Pourquoi ne peut-on pas tout mettre dans les tables MySQL ?** Quand vos données sont des réseaux sociaux, des flux de capteurs à un million d'événements par seconde ou des vecteurs sémantiques que l'IA doit comprendre, les tables relationnelles atteignent leurs limites. Différentes formes de données nécessitent différentes approches de modélisation.
:::

---

## 1. Au-delà du relationnel : Pourquoi d'autres modèles de données

Les bases de données relationnelles (MySQL, PostgreSQL) organisent les données en « table + ligne + colonne » et conviennent aux données métier structurées au schéma fixe et aux relations claires. Mais les données du monde réel sont bien plus diverses :

| Forme de données | Point faible du relationnel | Meilleur modèle adapté |
|----------|-------------|-------------|
| Profils utilisateurs (champs non fixes, structures imbriquées) | ALTER TABLE fréquents, nombreuses colonnes NULL | **Modèle document** |
| Réseaux sociaux (les amis des amis des amis) | Performance des JOINs multi-niveaux en chute exponentielle | **Modèle graphe** |
| Métriques de supervision (millions d'écritures par seconde) | Goulot d'étranglement en écriture, gonflement des données historiques | **Modèle série temporelle** |
| Recherche sémantique IA (contenu « de sens proche ») | Impossible d'exprimer la similarité sémantique | **Modèle vecteur** |

::: info 💡 Point clé
Il ne s'agit pas de « remplacer » le relationnel, mais de le « compléter ». Le cœur métier de la plupart des systèmes fonctionne toujours sur MySQL/PostgreSQL, mais l'introduction de modèles de données spécialisés dans des scénarios spécifiques peut apporter des gains de performance de plusieurs ordres de grandeur.
:::

---

## 2. Modèle document (Document)

### 2.1 Qu'est-ce que le modèle document

Le modèle document stocke les données sous forme de **documents JSON/BSON**. Chaque enregistrement est un document autonome qui peut avoir une structure de champs différente.

```json
{
  "_id": "user_1001",
  "name": "Jean Dupont",
  "tags": ["VIP", "actif"],
  "address": { "city": "Paris", "district": "Marais" },
  "orders": [
    { "id": "o1", "amount": 299 },
    { "id": "o2", "amount": 599 }
  ]
}
```

**Caractéristiques clés :**
- **Sans contrainte de schéma** : Pas besoin de définir la structure de table à l'avance ; les champs peuvent être ajoutés ou retirés à tout moment
- **Structures imbriquées** : Adresse et commandes sont directement imbriquées dans le document ; une seule lecture suffit pour obtenir toutes les données
- **Scaling horizontal** : Naturellement adapté au sharding, capable de gérer facilement des volumes massifs de données

### 2.2 Document vs Relationnel

| Dimension de comparaison | Relationnel (MySQL) | Document (MongoDB) |
|----------|----------------|------------------|
| Structure des données | Schéma fixe, modification via ALTER TABLE | Schéma flexible, ajout de champs à tout moment |
| Données imbriquées | Nécessite des JOINs multi-tables | Directement imbriquées dans le document |
| Relations inter-enregistrements | JOIN très puissant | Requêtes de relation plus faibles |
| Scénarios adaptés | Données métier à structure stable | Données de contenu à structure variable |

### 2.3 Scénarios typiques

- **CMS (gestion de contenu)** : Articles, commentaires, tags aux structures variées
- **Profils utilisateurs** : Différents utilisateurs ont des champs d'attributs différents
- **Catalogues de produits** : Les téléphones ont « taille d'écran », les produits alimentaires ont « date de péremption » — des champs totalement différents
- **Centres de configuration** : La structure de configuration de chaque service n'est pas standardisée

::: warning ⚠️ Idée reçue courante
« MongoDB n'a pas besoin de conception de structure de données » — Faux ! Le modèle document nécessite également une conception soignée : les niveaux d'imbrication ne doivent pas être trop profonds et les sous-documents fréquemment mis à jour doivent être séparés en collections indépendantes.
:::

---

## 3. Modèle graphe (Graph)

### 3.1 Qu'est-ce que le modèle graphe

Le modèle graphe exprime les entités et leurs relations via des **nœuds (Nodes)** et des **arêtes (Edges)**. Chaque nœud est une entité, chaque arête est une relation ; nœuds et arêtes peuvent tous deux porter des propriétés.

```
(Jean) --[suit]--> (Marie) --[suit]--> (Pierre)
   |                                    |
   +--------[achète]----> (iPhone) <--[achète]--+
```

### 3.2 La capacité tueuse du modèle graphe : les requêtes multi-sauts

**Scénario** : Trouver « les amis des amis des amis » dans un réseau social

Approche relationnelle (3 niveaux de JOIN) :
```sql
SELECT DISTINCT f3.name
FROM friends f1
JOIN friends f2 ON f1.friend_id = f2.user_id
JOIN friends f3 ON f2.friend_id = f3.user_id
WHERE f1.user_id = 1001;
```

Approche base de données graphe (langage de requête Cypher) :
```cypher
MATCH (me)-[:FOLLOWS*1..3]->(target)
WHERE me.name = 'Jean'
RETURN DISTINCT target.name
```

Dans le modèle relationnel, chaque saut supplémentaire ajoute un JOIN et la performance chute de façon exponentielle. Les bases de données graphe traversent les relations directement via des pointeurs, de sorte que la performance des requêtes multi-sauts reste pratiquement constante.

### 3.3 Scénarios typiques

- **Réseaux sociaux** : Recommandation d'amis, suivis en commun, propagation d'influence
- **Graphes de connaissances** : Inférence de relations entre entités (« Qui est l'élève du professeur de qui »)
- **Détection de fraude** : Découverte de boucles financières, réseaux de comptes liés
- **Systèmes de recommandation** : Recommandation basée sur le graphe de relations utilisateur-produit-tag

---

## 4. Modèle série temporelle (Time-Series)

### 4.1 Qu'est-ce que le modèle série temporelle

Le modèle série temporelle utilise le **timestamp** comme axe principal et est optimisé pour les scénarios « écriture chronologique, requête par plage temporelle ».

```
timestamp            device      cpu_usage   memory
2024-01-15 10:00:01  server-01   45%         12.3GB
2024-01-15 10:00:02  server-01   67%         12.5GB
2024-01-15 10:00:03  server-01   92%         14.1GB
```

### 4.2 Pourquoi ne pas utiliser MySQL pour les données de séries temporelles

| Problème | MySQL | Base de données série temporelle (InfluxDB) |
|------|-------|----------------------|
| Vitesse d'écriture | Dizaines de milliers/sec | **Millions/sec** |
| Données historiques | Nettoyage manuel, tables de plus en plus volumineuses | **Politique d'expiration automatique** (TTL) |
| Requêtes d'agrégation | GROUP BY lent | **Downsampling intégré** (5 sec → moyenne sur 1 min) |
| Efficacité de stockage | Stockage générique, gaspillage d'espace | **Compression en colonnes**, 90 % d'économie d'espace |

### 4.3 Scénarios typiques

- **Supervision de serveurs** : CPU, mémoire, disque collectés chaque seconde
- **Capteurs IoT** : Température, humidité, traces GPS
- **Données financières** : Cours de bourse, volumes de transaction à la seconde
- **Analyse de logs** : Agrégation temporelle des logs applicatifs

---

## 5. Modèle vecteur (Vector)

### 5.1 Qu'est-ce que le modèle vecteur

Le modèle vecteur transforme les données non structurées (texte, images, audio) en vecteurs numériques de haute dimension via des **modèles d'embedding**, puis mesure la similarité sémantique en calculant les distances entre vecteurs.

```
"bon resto japonais" → Embedding → [0.82, 0.15, 0.91, 0.33, ...]
                                    ↓ Similarité cosinus
"sushi maître Ginza"  → [0.80, 0.18, 0.89, ...] → 96 % similaire
"pizza italienne"     → [0.12, 0.85, 0.20, ...] → 31 % similaire
```

### 5.2 Recherche vectorielle vs Recherche par mots-clés

| Comparaison | Recherche par mots-clés (LIKE / index plein texte) | Recherche vectorielle |
|------|---------------------------|---------|
| Mode de recherche | Correspondance exacte de chaînes | Correspondance par similarité sémantique |
| « bon resto japonais » | Ne trouve que les textes contenant « japonais » | Peut trouver « sushi », « sashimi », « izakaya » |
| Multilinguisme | Traitement séparé nécessaire | Compréhension sémantique跨lingue |
| Multimodalité | Texte uniquement | Recherche unifiée texte, images, audio |

### 5.3 Scénarios typiques

- **RAG (Retrieval-Augmented Generation)** : Fournir des fragments de connaissance pertinents aux LLM
- **Recherche sémantique** : Comprendre l'intention de l'utilisateur plutôt que des mots-clés
- **Recherche d'image par image** : Uploader une image et trouver des images visuellement similaires
- **Systèmes de recommandation** : Recommandations de similarité basées sur la sémantique du contenu

::: tip 💡 Choix d'une base de données vectorielle
- **Bases de données vectorielles autonomes** : Pinecone, Milvus, Weaviate — spécialisées dans la recherche vectorielle, performances optimales
- **Extensions de bases de données classiques** : pgvector (PostgreSQL), Atlas Vector Search (MongoDB) — réduisent la complexité architecturale
- **Bibliothèques vectorielles en mémoire** : FAISS, Annoy — adaptées aux scénarios à petite échelle et faible latence
:::

---

## 6. Décision de choix : Comment choisir le modèle de données

| À quoi ressemblent vos données ? | Modèle recommandé | Produits représentatifs |
|-------------------|---------|---------|
| Structure fixe, relations claires (commandes, utilisateurs) | Relationnel | MySQL, PostgreSQL |
| Structure flexible, nombreux niveaux d'imbrication (contenu, configuration) | Document | MongoDB, DynamoDB |
| Relations complexes entre entités, traversée multi-sauts nécessaire | Graphe | Neo4j, Amazon Neptune |
| Écriture chronologique, requêtes par plage temporelle | Série temporelle | InfluxDB, TimescaleDB |
| Données non structurées, recherche de similarité sémantique nécessaire | Vecteur | Pinecone, Milvus, pgvector |

::: info 🎯 Conseil pratique
Les systèmes modernes utilisent généralement un **mix multi-modèles** :
- **Cœur métier** sur PostgreSQL (relationnel)
- **Logs comportementaux utilisateurs** sur InfluxDB (série temporelle)
- **Base de connaissances IA** sur Milvus + pgvector (vecteur)
- **Moteur de recommandation** sur Neo4j (graphe)

Ne cherchez pas « une base de données pour résoudre tous les problèmes », mais donnez à chaque type de données le foyer le plus adapté.
:::

<DataModelsDemo />
