# Principes : Fonctionnement des moteurs de recherche

::: tip Préface
**Vous cherchez "robe rouge" sur Taobao, et en 0,1 seconde vous trouvez les résultats les plus pertinents parmi des milliards de produits — comment est-ce possible ?** Les moteurs de recherche sont l'une des infrastructures les plus centrales d'Internet. De Google à la recherche interne des sites e-commerce, leur principe fondamental est le même : l'index inversé + le classement par pertinence.
:::

**Que allez-vous apprendre dans cet article ?**

Après avoir étudié ce chapitre, vous serez en mesure de :

- **Index inversé** : comprendre la structure de données la plus centrale des moteurs de recherche
- **Techniques de segmentation** : découvrir les défis et solutions de la segmentation de texte chinois
- **Classement par pertinence** : maîtriser les principes fondamentaux de TF-IDF et BM25
- **Elasticsearch** : comprendre l'architecture et les scénarios d'utilisation du moteur de recherche le plus populaire
- **Optimisation de la recherche** : maîtriser les synonymes, la correction, le surlignage et d'autres fonctionnalités pratiques de recherche

| Chapitre | Contenu | Concept clé |
|-----|------|---------|
| **Chapitre 1** | Index inversé | Index direct vs index inversé |
| **Chapitre 2** | Segmentation et analyse | Segmentation chinoise, mots vides, racinisation |
| **Chapitre 3** | Classement par pertinence | TF-IDF, BM25 |
| **Chapitre 4** | Elasticsearch | Architecture distribuée, shards, réplicas |
| **Chapitre 5** | Optimisation de la recherche | Synonymes, correction, auto-complétion |

---

## 0. Vue d'ensemble : quelle est l'essence de la recherche

L'essence de la recherche est un problème de **recherche d'information (Information Retrieval)** : étant donné une requête, trouver les résultats les plus pertinents parmi une masse de documents, et les retourner classés par pertinence.

Ce processus se divise en deux phases :

- **Phase d'indexation (hors ligne)** : traiter tous les documents à l'avance et construire une structure de recherche efficace
- **Phase de requête (en ligne)** : lorsque l'utilisateur saisit des mots-clés, trouver rapidement les documents correspondants et les classer

::: tip Pourquoi ne pas utiliser la requête LIKE d'une base de données ?
`SELECT * FROM products WHERE name LIKE '%robe rouge%'` semble pouvoir effectuer une recherche, mais elle nécessite un **balayage complet de la table** — vérifier chaque ligne une par une. Lorsque le volume de données atteint le million, cette requête devient trop lente pour être utilisable. L'index inversé transforme cette opération O(n) en une recherche O(1).
:::

---

## 1. L'index inversé : le "cœur" du moteur de recherche

Les bases de données traditionnelles utilisent un **index direct** : de l'ID du document vers son contenu. Les moteurs de recherche utilisent un **index inversé** : du mot-clé vers la liste des documents qui le contiennent.

<InvertedIndexDemo />

| Type d'index | Direction | Mode de recherche | Scénario d'utilisation |
|---------|------|---------|---------|
| Index direct | Document -> Contenu | Connaître l'ID, chercher le contenu | Requête par clé primaire en base de données |
| Index inversé | Mot-clé -> Liste de documents | Connaître le mot-clé, chercher les documents | Recherche en texte intégral |

::: tip Processus de construction de l'index inversé
1. **Collecte des documents** : récupérer tous les documents devant être recherchés
2. **Segmentation (Tokenization)** : découper les documents en mots
3. **Création du mapping** : enregistrer dans quels documents chaque mot apparaît (ainsi que la position et la fréquence d'apparition)
4. **Stockage persistant** : écrire l'index sur le disque, supportant la recherche rapide
:::

---

## 2. Segmentation et analyse de texte

La segmentation est la première étape d'un moteur de recherche, et aussi le plus grand défi de la recherche en chinois. L'anglais se segmente naturellement par les espaces, mais le chinois n'a pas de séparateur — "乒乓球拍卖了" peut être découpé en "乒乓球/拍卖/了" ou "乒乓/球拍/卖/了".

| Méthode de segmentation | Description | Exemple |
|---------|------|------|
| Segmentation standard | Découpe par espaces et ponctuation (anglais) | "hello world" -> ["hello", "world"] |
| Segmentation chinoise | Découpe basée sur un dictionnaire ou un modèle | "搜索引擎" -> ["搜索", "引擎"] |
| N-gram | Découpe par fenêtre glissante de longueur fixe | "搜索" -> ["搜索", "索引"] |
| Dictionnaire personnalisé | Ajout de termes métier spécifiques | "iPhone16ProMax" comme un seul mot |

::: tip Pipeline d'analyse de texte
La segmentation n'est qu'une étape de l'analyse de texte. Le pipeline complet comprend :
1. **Filtrage de caractères** : suppression des balises HTML, caractères spéciaux
2. **Segmentation** : découpage du texte en tokens
3. **Filtrage des mots vides** : suppression des mots fréquents sans signification tels que "的", "了", "是"
4. **Extension des synonymes** : étendre "手机" en "手机、电话、移动电话"
5. **Racinisation** : réduire "running" en "run" (anglais)
:::

---

## 3. Classement par pertinence : quel résultat est le plus "pertinent"

Trouver les documents correspondants n'est que la première étape. Ce qui est plus important, c'est le **classement** — mettre les résultats les plus pertinents en premier.

| Algorithme | Principe | Caractéristique |
|------|------|------|
| TF-IDF | Fréquence du terme (TF) x Fréquence inverse de document (IDF) | Algorithme classique, simple et efficace |
| BM25 | Version améliorée de TF-IDF, ajout de la normalisation de la longueur du document | Algorithme par défaut d'Elasticsearch |
| Recherche vectorielle | Conversion des documents et requêtes en vecteurs, calcul de la similarité cosinus | Supporte la recherche sémantique |

::: Tip Intuition de TF-IDF
- **TF (fréquence du terme)** : plus un mot apparaît fréquemment dans un document, plus ce document est susceptible d'être pertinent pour ce mot
- **IDF (fréquence inverse de document)** : moins un mot apparaît dans de documents, plus son pouvoir discriminant est élevé
- "的" apparaît dans tous les documents (IDF faible), donc chercher "的" n'a pas de sens
- "Elasticsearch" n'apparaît que dans peu de documents (IDF élevé), le chercher permet de cibler précisément
:::

---

## 4. Elasticsearch : le moteur de recherche le plus populaire

Elasticsearch est le moteur de recherche open source le plus populaire actuellement, construit sur Apache Lucene, offrant des capacités de recherche en texte intégral distribuées via une API RESTful.

| Concept | Description |
|------|------|
| Index | Similaire à une "table" de base de données, stocke des documents de même type |
| Document | Un enregistrement, au format JSON |
| Shard | Fragment, répartition d'un index sur plusieurs nœuds |
| Replica | Réplique, fournit haute disponibilité et extensibilité en lecture |
| Mapping | Définition des types de champs, similaire au Schema d'une base de données |
| Analyzer | Analyseur de texte, définit les règles de segmentation |

::: tip ES vs base de données
Elasticsearch ne remplace pas une base de données, mais fonctionne comme une couche de recherche en complément de la base de données. Architecture typique : les données sont écrites dans la base de données -> synchronisées vers ES -> les requêtes de recherche passent par ES -> les requêtes de détail passent par la base de données.
:::

---

## 5. Optimisation de la recherche : rendre la recherche plus "intelligente"

| Technique d'optimisation | Description | Effet |
|---------|------|------|
| Synonymes | "手机" peut aussi trouver "电话" | Améliore le rappel |
| Correction orthographique | "iphoen" corrigé automatiquement en "iphone" | Tolérance aux erreurs |
| Auto-complétion | Saisir "苹" suggère "苹果手机" | Améliore l'expérience |
| Surlignage | Mise en évidence des mots correspondants dans les résultats | Affichage intuitif |
| Ajustement des poids | Poids de correspondance dans le titre > poids de correspondance dans le contenu | Améliore la précision |
| Filtrage et agrégation | Filtrer par tranche de prix, par marque | Réduit le périmètre |

---

## Résumé

Les moteurs de recherche sont une infrastructure centrale des applications Internet. Comprendre l'index inversé, la segmentation et le classement par pertinence, c'est maîtriser l'essence des moteurs de recherche.

Récapitulatif des points clés de ce chapitre :

1. **Index inversé** : mapping inverse du mot-clé vers les documents, la structure de données centrale des moteurs de recherche
2. **La segmentation est fondamentale** : la segmentation chinoise est la clé de la qualité de recherche, il faut choisir le bon segmenteur
3. **Classement BM25** : scoring de pertinence basé sur la fréquence des termes et la fréquence de document, algorithme par défaut d'ES
4. **Architecture ES** : shards + réplicas pour la distribution et la haute disponibilité
5. **Optimisation de la recherche** : synonymes, correction, auto-complétion rendent la recherche plus intelligente

## Pour aller plus loin

- [Documentation officielle Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) - La référence ES la plus autorisée
- [Guide définitif Elasticsearch](https://www.elastic.co/guide/cn/elasticsearch/guide/current/index.html) - Guide d'introduction en chinois
- [Apache Lucene](https://lucene.apache.org/) - La bibliothèque de moteur de recherche sous-jacente d'ES
- [MeiliSearch](https://www.meilisearch.com/) - Moteur de recherche léger, adapté aux projets de taille petite à moyenne
- [Typesense](https://typesense.org/) - Moteur de recherche instantanée open source
