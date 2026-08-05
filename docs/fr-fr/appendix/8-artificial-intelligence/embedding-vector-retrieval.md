# Principes : Embeddings et recherche vectorielle

::: tip Préface
**Comment l'ordinateur comprend-il que « le chat et le chien se ressemblent, mais pas la voiture » ?** Pour les humains, c'est du bon sens, mais pour l'ordinateur, « chat », « chien », « voiture » ne sont que trois chaînes de caractères sans aucun lien. La technologie d'Embedding (plongement) est la clé pour résoudre ce problème — elle transforme les mots en vecteurs numériques, permettant à l'ordinateur de comprendre la « proximité sémantique ».
:::

**Qu'allez-vous apprendre dans cet article ?**

Après avoir étudié ce chapitre, vous obtiendrez :

- **Compréhension intuitive** : comprendre ce qu'est l'Embedding et pourquoi les vecteurs de « chat » et « chien » sont proches
- **Calcul de similarité** : maîtriser la similarité cosinus, la distance euclidienne et d'autres méthodes de mesure fondamentales
- **Principes d'indexation** : comprendre comment les bases de données vectorielles effectuent des recherches en millisecondes parmi des millions de données
- **Choix technologique** : connaître les caractéristiques et les scénarios d'application des principales bases de données vectorielles
- **Pipeline de bout en bout** : maîtriser le pipeline complet du texte au vecteur à la recherche

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Concept d'Embedding | Espace sémantique, représentation vectorielle |
| **Chapitre 2** | Calcul de similarité | Similarité cosinus, distance euclidienne |
| **Chapitre 3** | Index vectoriel | Recherche exhaustive vs ANN |
| **Chapitre 4** | Bases de données vectorielles | Pinecone, Milvus, Chroma |
| **Chapitre 5** | Pipeline de bout en bout | Texte → Vecteur → Stockage → Requête |

---

## 0. Vue d'ensemble : le pont entre le texte et les nombres

Dans le monde du traitement du langage naturel, il existe un défi fondamental : **l'ordinateur ne connaît que les nombres, pas les mots**.

L'approche traditionnelle consistait à attribuer un numéro à chaque mot (encodage One-Hot), par exemple « chat »=001, « chien »=010, « voiture »=100. Mais cette approche a un défaut fatal : **tous les mots sont à la même distance les uns des autres**. La distance entre « chat » et « chien » est identique à celle entre « chat » et « voiture » — ce qui ne correspond évidemment pas à notre intuition.

La révolution de l'Embedding réside dans le fait qu'il projette chaque mot dans un **espace vectoriel dense de faible dimension**, où les mots sémantiquement proches se regroupent naturellement. Dans cet espace, « chat » et « chien » sont proches, tandis que « voiture » est éloignée — l'ordinateur peut enfin « comprendre » la sémantique.

::: tip Le saut du One-Hot à l'Embedding
- **One-Hot** : dimension = taille du vocabulaire (potentiellement des dizaines de milliers), chaque vecteur n'a qu'un seul 1, le reste étant des 0, creux et sans sémantique
- **Embedding** : dimension généralement de 768 à 1536, chaque nombre a un sens, dense et riche en informations sémantiques
- **Percée clé** : Word2Vec (2013) a prouvé que « le sens d'un mot peut être défini par son contexte », ouvrant l'ère de l'Embedding
:::

---

## 1. Concept d'Embedding : transformer les mots en coordonnées

L'idée centrale de l'Embedding peut se résumer en une phrase : **utiliser un ensemble de nombres (vecteur) pour représenter le sens d'un mot ou d'une phrase**.

Imaginez un système de coordonnées bidimensionnel. Nous plaçons « chat » aux coordonnées (0,2, 0,7), « chien » à (0,3, 0,6), « voiture » à (0,9, 0,1). Vous remarquerez que « chat » et « chien » ont des coordonnées proches, tandis que « voiture » en est éloignée. C'est l'intuition de l'Embedding — **la similarité sémantique devient une distance spatiale**.

<EmbeddingConceptDemo />

::: tip Trois propriétés clés de l'Embedding
1. **Clustering sémantique** : les mots de sens similaire se regroupent automatiquement (un cluster animaux, un cluster nourriture, un cluster technologie)
2. **Relations analogiques** : les opérations vectorielles peuvent exprimer des relations sémantiques, exemple classique : roi - homme + femme ≈ reine
3. **Signification des dimensions** : chaque dimension encode implicitement une caractéristique sémantique (comme « est-ce un animal », « taille », « polarité émotionnelle », etc.)
:::

| Méthode d'encodage | Dimension | Information sémantique | Application typique |
|---------|------|---------|---------|
| One-Hot | Taille du vocabulaire (~50000) | Aucune | NLP traditionnel |
| Word2Vec | 100~300 | Sémantique au niveau des mots | Similarité de mots, raisonnement analogique |
| BERT Embedding | 768 | Sémantique contextuelle | Compréhension de phrases, questions-réponses |
| OpenAI text-embedding-3 | 1536~3072 | Sémantique profonde | RAG, recherche sémantique |

---

## 2. Calcul de similarité : à quel point deux vecteurs sont-ils « proches »

Avec la représentation vectorielle, la question suivante est naturellement : **comment mesurer la similarité entre deux vecteurs ?** C'est comme mesurer la distance entre deux villes sur une carte — vous pouvez mesurer la distance à vol d'oiseau ou vérifier si les directions coïncident.

<VectorSimilarityDemo />

::: tip Deux mesures fondamentales
- **Similarité cosinus (Cosine Similarity)** : mesure si la **direction** de deux vecteurs coïncide, plage de valeurs [-1, 1]. 1 indique des directions identiques, 0 indique l'orthogonalité (sans relation), -1 indique des directions opposées. Premier choix pour la comparaison sémantique de texte, car elle n'est pas affectée par la longueur du vecteur.
- **Distance euclidienne (Euclidean Distance)** : mesure la **distance en ligne droite** entre les extrémités de deux vecteurs, plage de valeurs [0, ∞). 0 indique une coïncidence parfaite, plus la valeur est grande, moins ils sont similaires. Adaptée aux scénarios nécessitant de prendre en compte la « magnitude absolue ».
:::

| Méthode de mesure | Intuition de la formule | Plage de valeurs | Scénario applicable |
|---------|---------|------|---------|
| Similarité cosinus | Regarde la direction, ignore la longueur | [-1, 1] | Recherche sémantique de texte, systèmes de recommandation |
| Distance euclidienne | Regarde la distance en ligne droite | [0, ∞) | Caractéristiques d'image, analyse de clustering |
| Produit scalaire | Direction × Longueur | (-∞, +∞) | Calcul rapide pour vecteurs normalisés |
| Distance de Manhattan | Distance parcourue le long des axes | [0, ∞) | Vecteurs creux en haute dimension |

---

## 3. Index vectoriel : comment rechercher en millisecondes parmi des millions de vecteurs

Supposons que vous ayez 1 million de documents, chacun transformé en un vecteur de 1536 dimensions. Un utilisateur pose une question, vous devez trouver les 10 plus similaires. La méthode la plus directe est de calculer la similarité un par un — mais cela signifie effectuer 1 million de calculs vectoriels à 1536 dimensions, c'est trop lent.

C'est le problème que l'**index vectoriel** résout : **échanger de l'espace contre du temps, en établissant une structure d'index par prétraitement, pour faire passer la vitesse de recherche de O(n) à environ O(log n)**.

<VectorIndexDemo />

::: tip Recherche exhaustive vs Recherche approximative du plus proche voisin (ANN)
- **Recherche exhaustive (Flat)** : comparer un par un, 100 % précis mais lent. Adapté aux petits volumes de données (< 100 000).
- **IVF (Inverted File Index)** : diviser d'abord l'espace vectoriel en plusieurs régions (clustering), ne rechercher que dans les régions les plus proches lors de la requête. Comme ranger une bibliothèque par thèmes, on ne va que dans les sections pertinentes pour chercher un livre.
- **HNSW (Hierarchical Navigable Small World)** : construire une structure de graphe multicouche, naviguer de couche en couche du grossier au fin. Comme regarder d'abord une carte du monde pour localiser le pays, puis une carte régionale, enfin une carte des rues.
- **PQ (Product Quantization)** : compresser les vecteurs de haute dimension en codes courts, sacrifier un peu de précision pour économiser beaucoup de mémoire. Adapté aux très grands ensembles de données.
:::

| Type d'index | Vitesse de construction | Vitesse de requête | Rappel | Occupation mémoire | Échelle applicable |
|---------|---------|---------|-------|---------|---------|
| Flat (exhaustif) | Aucune construction | Lent | 100 % | Élevée | < 100 000 |
| IVF | Moyen | Rapide | 95 %+ | Moyenne | 100 000 ~ 10 millions |
| HNSW | Lent | Très rapide | 99 %+ | Élevée | 100 000 ~ 10 millions |
| PQ | Moyen | Rapide | 90 %+ | Très faible | > 10 millions |
| IVF-PQ | Moyen | Rapide | 92 %+ | Faible | > 100 millions |

---

## 4. Bases de données vectorielles : un moteur de stockage conçu pour les vecteurs

Avec les vecteurs et les algorithmes d'index, vous avez besoin d'un endroit pour les stocker et les gérer. Les bases de données traditionnelles (MySQL, PostgreSQL) excellent dans le traitement des données structurées, mais peinent face à la recherche de similarité de vecteurs en haute dimension. Les **bases de données vectorielles** sont spécialement conçues pour ce scénario.

<VectorDatabaseDemo />

::: tip Capacités fondamentales des bases de données vectorielles
1. **Stockage efficace** : format de stockage optimisé pour les vecteurs à virgule flottante en haute dimension
2. **Recherche ANN** : algorithmes d'index de plus proche voisin intégrés (HNSW, IVF, etc.)
3. **Filtrage par métadonnées** : prise en charge du filtrage par étiquettes, temps et autres conditions en parallèle de la recherche vectorielle
4. **Mise à jour en temps réel** : prise en charge de l'ajout, la suppression et la modification dynamiques de vecteurs sans reconstruction complète de l'index
5. **Passage à l'échelle horizontal** : architecture distribuée prenant en charge des centaines de millions de vecteurs
:::

| Base de données | Type | Caractéristiques | Scénario applicable |
|-------|------|------|---------|
| Pinecone | Service cloud entièrement géré | Zéro opération, prêt à l'emploi | Prototypage rapide, production petite/moyenne échelle |
| Milvus | Open source distribué | Haute performance, scalable | Production à grande échelle |
| Chroma | Open source léger | Embarqué, API simple | Développement local, petits projets |
| Weaviate | Open source cloud-native | Vectorisation intégrée, GraphQL | Scénarios nécessitant une vectorisation automatique |
| Qdrant | Open source haute performance | Implémenté en Rust, filtrage puissant | Scénarios nécessitant un filtrage complexe |
| pgvector | Extension PostgreSQL | Réutilise l'infrastructure PG existante | Équipes utilisant déjà PostgreSQL |

---

## 5. Pipeline de bout en bout : le flux complet du texte à la recherche

Après avoir compris chaque composant, assemblons-les pour voir comment fonctionne un système complet de recherche vectorielle.

Le flux complet se divise en deux lignes : **l'écriture hors ligne** (transformer les documents en vecteurs et les stocker) et **la requête en ligne** (transformer la question en vecteur pour rechercher).

<EmbeddingPipelineDemo />

::: tip Flux d'écriture hors ligne
1. **Chargement de documents** : lire le texte brut depuis diverses sources (PDF, pages web, bases de données)
2. **Prétraitement du texte** : nettoyage, débruitage, normalisation (suppression des balises HTML, caractères spéciaux, etc.)
3. **Découpage du texte** : diviser le texte long en fragments de taille appropriée selon la stratégie (200~500 tokens)
4. **Vectorisation** : appeler le modèle d'embedding (comme OpenAI text-embedding-3-small) pour transformer chaque fragment en vecteur
5. **Stockage dans la base vectorielle** : écrire le vecteur, le texte original et les métadonnées dans la base de données
:::

::: tip Flux de requête en ligne
1. **Réception de la requête** : l'utilisateur saisit une question en langage naturel
2. **Vectorisation de la requête** : transformer la question en vecteur avec le même modèle d'embedding
3. **Recherche de similarité** : rechercher les Top-K fragments de document les plus similaires dans la base vectorielle
4. **Post-traitement** : reranking, déduplication, filtrage par métadonnées
5. **Retour des résultats** : renvoyer les fragments de document les plus pertinents à l'appelant (ou les transmettre au LLM pour générer une réponse)
:::

| Étape | Choix clé | Solution recommandée |
|------|---------|---------|
| Modèle d'embedding | Précision vs Coût vs Vitesse | OpenAI text-embedding-3-small (bon rapport qualité-prix) |
| Stratégie de découpage | Granularité vs Intégrité sémantique | Découpage récursif, 200~500 tokens |
| Base vectorielle | Échelle vs Coût d'exploitation | Chroma pour petits projets, Pinecone/Milvus pour la production |
| Mesure de similarité | Sémantique vs Précision | Similarité cosinus (premier choix pour le texte) |
| Valeur Top-K | Rappel vs Bruit | Récupérer d'abord 20 résultats, reranker puis prendre le Top 5 |

---

## Résumé

L'Embedding et la recherche vectorielle sont le pont entre le « langage humain » et la « compréhension machine », et constituent l'infrastructure des applications IA comme le RAG, la recherche sémantique et les systèmes de recommandation.

Récapitulatif des points clés de ce chapitre :

1. **L'essence de l'Embedding** : projeter le texte dans un espace vectoriel de haute dimension, transformant la similarité sémantique en distance spatiale
2. **Mesures de similarité** : la similarité cosinus se concentre sur la direction (adaptée au texte), la distance euclidienne sur la distance absolue
3. **L'index est la clé de la performance** : HNSW et IVF ramènent la recherche parmi des millions de vecteurs à la milliseconde
4. **Choix de la base vectorielle** : Chroma/pgvector pour les petits projets, Pinecone/Milvus pour l'environnement de production
5. **Pensée de bout en bout** : du chargement du document à la recherche finale, chaque choix influence le résultat final

## Lectures complémentaires

- [Documentation OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings) - Guide officiel d'utilisation des modèles d'embedding
- [Pinecone Learning Center](https://www.pinecone.io/learn/) - Tutoriel systématique sur les bases de données vectorielles et la recherche
- [Wiki FAISS](https://github.com/facebookresearch/faiss/wiki) - Documentation de la bibliothèque de recherche vectorielle open source de Facebook
- [Article original Word2Vec](https://arxiv.org/abs/1301.3781) - L'œuvre fondatrice de l'ère Embedding
- [Classement MTEB](https://huggingface.co/spaces/mteb/leaderboard) - Classement comparatif des performances des modèles d'embedding