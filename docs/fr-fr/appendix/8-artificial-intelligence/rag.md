# Principes : RAG : Génération augmentée par récupération

::: tip Préface
**Pourquoi ChatGPT raconte-t-il parfois « n'importe quoi avec aplomb » ?** Les connaissances des grands modèles de langage proviennent de leurs données d'entraînement, mais ces données ont une date limite et n'incluent pas les documents internes de votre entreprise. Le RAG (Retrieval-Augmented Generation, génération augmentée par récupération) est la technologie centrale qui résout ce problème — permettre à l'IA de « consulter des documents » avant de répondre.
:::

**Qu'allez-vous apprendre dans cet article ?**

Après avoir étudié ce chapitre, vous obtiendrez :

- **Compréhension des concepts fondamentaux** : comprendre ce qu'est le RAG, pourquoi il est nécessaire et comment il résout le problème des « hallucinations » des grands modèles
- **Connaissance du pipeline complet** : maîtriser le flux de bout en bout, du chargement de documents, du découpage, de la vectorisation jusqu'à la récupération et la génération
- **Capacité de choix technologique** : connaître les avantages et inconvénients des différentes stratégies de découpage et méthodes de récupération, et pouvoir choisir en fonction du contexte
- **Vision de l'évolution architecturale** : comprendre le parcours évolutif du RAG, de Naive à Advanced puis Modular
- **Capacité de décision pratique** : savoir quand utiliser le RAG et quand utiliser le fine-tuning

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Pipeline de base du RAG | Indexation, récupération, génération — les trois phases |
| **Chapitre 2** | Stratégies de découpage de texte | Découpage fixe, découpage sémantique, découpage récursif |
| **Chapitre 3** | Techniques de récupération | Récupération vectorielle, par mots-clés, hybride |
| **Chapitre 4** | Évolution architecturale | Naive RAG → Advanced RAG → Modular RAG |
| **Chapitre 5** | RAG vs Fine-tuning | Comparaison des scénarios d'application des deux approches |

---

## 0. Vue d'ensemble : pourquoi les grands modèles ont-ils besoin de « consulter des documents »

Imaginez que vous êtes un professeur érudit, ayant lu d'innombrables livres. Mais si quelqu'un vous demande « Quel était le chiffre d'affaires de l'entreprise hier ? », vous ne pourrez certainement pas répondre — car cette information ne figure pas dans les livres que vous avez lus.

Les grands modèles de langage font face au même dilemme :

- **Connaissances avec une date limite** : les données d'entraînement de GPT-4 s'arrêtent à une certaine date, il ne sait rien de ce qui s'est passé après
- **Absence de connaissances privées** : les documents internes de votre entreprise, les manuels produits, les données clients, le modèle ne les a jamais vus
- **Tendance aux hallucinations** : lorsque le modèle n'est pas sûr de la réponse, il a tendance à « inventer » une réponse qui semble plausible

::: tip L'idée centrale du RAG
La solution du RAG est très intuitive : **avant de laisser le modèle répondre, aidez-le d'abord à trouver des documents de référence pertinents**. C'est comme un examen à livre ouvert — vous n'avez pas besoin de mémoriser toutes les connaissances, juste de savoir où chercher et comment chercher.

RAG = Récupération (Retrieval) + Augmentation (Augmented) + Génération (Generation)
:::

---

## 1. Pipeline de base du RAG : indexation, récupération, génération

Le flux de travail du RAG peut être divisé en deux phases : **l'indexation hors ligne** et **la requête en ligne**.

La phase hors ligne est comme le travail de catalogage dans une bibliothèque — classer, numéroter et ranger tous les livres pour faciliter les recherches futures. La phase en ligne est le processus où un lecteur vient chercher des informations à la bibliothèque — trouver les livres pertinents en fonction de la question, puis synthétiser les informations pour donner une réponse.

<RAGPipelineDemo />

::: tip Les trois phases fondamentales
1. **Phase d'indexation (Indexing)** : charger les documents bruts, les nettoyer, les découper, puis les transformer en vecteurs via un modèle d'embedding et les stocker dans une base de données vectorielle. C'est un travail de préparation unique.
2. **Phase de récupération (Retrieval)** : lorsque l'utilisateur pose une question, transformer également la question en vecteur et rechercher les fragments de document les plus similaires dans la base de données vectorielle.
3. **Phase de génération (Generation)** : concaténer les fragments de document récupérés et la question de l'utilisateur en un prompt, et le soumettre au grand modèle pour générer la réponse finale.
:::

| Phase | Entrée | Sortie | Technologie clé |
|------|------|------|---------|
| Indexation | Documents bruts | Base de données vectorielle | Découpage de texte, modèle d'embedding |
| Récupération | Question utilisateur | Top-K fragments de document | Similarité vectorielle, reranking |
| Génération | Question + contexte | Réponse finale | Ingénierie de prompt, LLM |

---

## 2. Découpage de texte : faire entrer l'éléphant dans le réfrigérateur

Le découpage de texte est l'étape la plus facilement négligée du RAG, mais celle qui a le plus d'impact sur les résultats. Pourquoi faut-il découper ? Parce que la fenêtre de contexte des grands modèles est limitée, nous ne pouvons pas y mettre un livre entier. Plus important encore, **la qualité du découpage détermine directement la qualité de la récupération**.

Imaginez que vous cherchez un point de connaissance dans un livre à la bibliothèque. Si le livre entier est un seul « bloc », même s'il est récupéré, cela ne sert à rien — vous devez encore parcourir tout le livre. Mais si on découpe par chapitre, voire par paragraphe, on peut localiser précisément le contenu dont vous avez besoin.

<ChunkingStrategyDemo />

::: tip Choix de la stratégie de découpage
- **Découpage par taille fixe** : découper selon le nombre de caractères ou de tokens, simple et brutal mais peut couper la sémantique
- **Découpage récursif** : d'abord par paragraphe, puis par phrase si le paragraphe est trop long, préserve l'intégrité sémantique
- **Découpage sémantique** : utiliser le modèle d'embedding pour juger les frontières sémantiques, découper là où la similarité change brusquement
- **Découpage par structure de document** : utiliser les informations structurelles comme les titres Markdown, les balises HTML pour découper

Il n'y a pas de « meilleure » stratégie de découpage, seulement celle qui convient le mieux à vos données. Il est généralement conseillé de commencer par le découpage récursif, avec une taille de chunk de 200-500 tokens et un chevauchement (overlap) de 10-20 %.
:::

---

## 3. Techniques de récupération : comment trouver le contenu le plus pertinent

Une fois le découpage terminé, la question clé suivante est : **l'utilisateur pose une question, comment trouver les fragments les plus pertinents parmi des milliers de fragments de document ?**

C'est comme chercher un livre dans une immense bibliothèque. Vous pouvez chercher par mots-clés du titre (récupération par mots-clés), ou décrire le contenu souhaité pour qu'un bibliothécaire vous aide (récupération sémantique), la meilleure approche étant de combiner les deux (récupération hybride).

<RetrievalDemo />

| Méthode de récupération | Principe | Avantages | Inconvénients |
|---------|------|------|------|
| Récupération par mots-clés (BM25) | Basée sur la fréquence des termes et la fréquence inverse de document | Correspondance exacte, rapide | Ne comprend pas la sémantique, inefficace pour les synonymes |
| Récupération vectorielle | Basée sur la similarité cosinus des vecteurs d'embedding | Comprend la sémantique, prend en charge la correspondance floue | Insensible aux noms propres |
| Récupération hybride | Fusion des résultats vectoriels et par mots-clés | Combine précision et sémantique | Nécessite un réglage des poids, complexité plus élevée |

::: tip Reranking (réordonnancement)
Après avoir récupéré les documents candidats, une étape de « reranking » est généralement nécessaire. La récupération initiale vise le rappel (ne rien manquer), le reranking vise la précision (placer les plus pertinents en premier). Les modèles de reranking courants incluent Cohere Rerank, BGE Reranker, etc., qui utilisent des encodeurs croisés pour noter finement les paires requête-document.
:::

---

## 4. Évolution architecturale : du simple à l'intelligent

La technologie RAG a connu trois générations d'évolution en seulement deux ans, chaque génération résolvant les points douloureux de la précédente.

<RAGArchitectureDemo />

::: tip Comparaison des trois générations d'architecture RAG
- **Naive RAG (2023)** : le pipeline le plus basique « indexation → récupération → génération », simple à implémenter mais aux résultats limités. Problèmes : qualité de récupération instable, incapacité à traiter les requêtes complexes, introduction facile de contexte bruité.
- **Advanced RAG (2024)** : ajoute au Naive RAG des optimisations comme la réécriture de requête, la récupération hybride, le reranking et la compression de contexte, améliorant significativement la précision de récupération et la qualité de génération.
- **Modular RAG (2025)** : décompose le RAG en modules interchangeables, prend en charge le routage décisionnel, la récupération adaptative, l'auto-réflexion et d'autres capacités avancées. Peut choisir dynamiquement le pipeline de traitement optimal selon le type de requête.
:::

---

## 5. RAG vs Fine-tuning : lequel choisir

Lorsque vous voulez qu'un grand modèle maîtrise des connaissances dans un domaine spécifique, il y a généralement deux voies : le RAG et le fine-tuning (ajustement fin). Elles ne sont pas mutuellement exclusives, mais complémentaires.

Pour faire une analogie : **le fine-tuning, c'est comme envoyer un élève en cours particuliers**, pour intérioriser les connaissances dans le cerveau ; **le RAG, c'est comme donner un livre de référence à l'élève**, qu'il peut consulter pendant l'examen. Les deux approches ont leurs avantages et inconvénients, tout dépend de vos besoins spécifiques.

<RAGvsFineTuningDemo />

| Dimension | RAG | Fine-tuning |
|------|-----|------|
| Mise à jour des connaissances | En temps réel, il suffit de modifier les documents | Nécessite un réentraînement |
| Coût | Faible (pas besoin d'entraînement GPU) | Élevé (nécessite des ressources d'entraînement) |
| Explicabilité | Élevée (sources traçables) | Faible (connaissances internalisées dans les poids) |
| Scénarios adaptés | Questions-réponses sur base de connaissances, recherche documentaire | Transfert de style, optimisation de tâches spécifiques |
| Contrôle des hallucinations | Bon (références consultables) | Moyen (hallucinations toujours possibles) |

::: tip Conseils pratiques
Dans la plupart des scénarios, **essayez d'abord le RAG**. Les avantages du RAG : pas besoin d'entraînement, connaissances mises à jour en temps réel, réponses traçables aux sources. N'envisagez le fine-tuning que lorsque vous devez changer le « modèle de comportement » du modèle (format de sortie, style linguistique, mode de raisonnement). La solution la plus puissante est souvent la combinaison **RAG + fine-tuning**.
:::

---

## Résumé

Le RAG est l'une des technologies les plus pratiques pour faire « atterrir » les grands modèles aujourd'hui. Sa valeur centrale réside dans le fait que les réponses du modèle sont vérifiables, les connaissances sont mises à jour en temps réel et les hallucinations sont effectivement contrôlables.

Récapitulatif des points clés de ce chapitre :

1. **Le problème central résolu par le RAG** : connaissances obsolètes des grands modèles, absence de données privées, tendance aux hallucinations
2. **Pipeline en trois phases** : indexation (préparation hors ligne) → récupération (recherche en ligne) → génération (réponse synthétisée)
3. **Le découpage est la base** : la qualité du découpage détermine directement la qualité de la récupération, choisir la bonne stratégie est crucial
4. **La récupération est la clé** : la récupération hybride + reranking est actuellement la meilleure combinaison
5. **L'architecture évolue** : du Naive RAG au Modular RAG, le système devient de plus en plus intelligent et flexible
6. **RAG et fine-tuning sont complémentaires** : dans la plupart des cas, essayez d'abord le RAG, envisagez le fine-tuning quand vous devez changer le comportement du modèle

## Lectures complémentaires

- [Tutoriel LangChain RAG](https://python.langchain.com/docs/tutorials/rag/) - Guide pratique du framework RAG le plus populaire
- [Documentation LlamaIndex](https://docs.llamaindex.ai/) - Framework dédié au RAG, offrant de riches connecteurs de données
- [Article RAG Survey](https://arxiv.org/abs/2312.10997) - Revue complète des techniques RAG
- [Stratégies de découpage](https://www.pinecone.io/learn/chunking-strategies/) - Explication détaillée des stratégies de découpage par Pinecone
- [Comparaison des bases de données vectorielles](https://superlinked.com/vector-db-comparison) - Comparaison fonctionnelle des principales bases de données vectorielles