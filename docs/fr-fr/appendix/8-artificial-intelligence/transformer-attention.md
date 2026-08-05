---
title: 'Transformer et mécanisme d''attention : le moteur central des grands modèles'
description: 'Comprendre en profondeur l''architecture Transformer et le mécanisme d''attention, percer les secrets de la base technique des grands modèles comme GPT et BERT.'
---

# Principes : Transformer et mécanisme d'attention

En 2017, Google a publié l'article « Attention Is All You Need » proposant l'architecture Transformer, qui a complètement changé les règles du jeu en traitement du langage naturel. Elle a abandonné les réseaux de neurones récurrents (RNN) traditionnels pour s'appuyer uniquement sur le mécanisme d'attention, atteignant des performances supérieures et une efficacité d'entraînement plus élevée. Aujourd'hui, presque tous les grands modèles de langage — GPT, BERT, T5, LLaMA — sont construits sur la base du Transformer.

<TransformerQuickStartDemo />

---

## I. L'impasse du RNN et la percée du Transformer

Avant l'apparition du Transformer, la méthode dominante pour traiter les données séquentielles (comme le texte, la parole) était le réseau de neurones récurrent (RNN) et ses variantes LSTM, GRU. Ces modèles, par une structure récurrente, traitent les éléments de la séquence un par un et maintiennent un état caché pour mémoriser les informations historiques.

### 1.1 Les trois défauts fatals du RNN

**Dépendance séquentielle, pas de parallélisation** : le RNN doit attendre que le calcul du pas de temps précédent soit terminé avant de traiter le mot suivant. Cela rend l'entraînement extrêmement lent et empêche d'exploiter pleinement la capacité de calcul parallèle des GPU modernes.

**Atténuation des dépendances à longue distance** : même avec le LSTM amélioré, lors du traitement de longs textes, les informations du début sont progressivement « oubliées ». Par exemple, dans un article de 500 mots, le modèle a du mal à se souvenir des informations clés mentionnées au début.

**Disparition/explosion du gradient** : lors de la rétropropagation, le gradient doit être transmis couche par couche le long des pas de temps, ce qui entraîne facilement une disparition ou une explosion du gradient, rendant l'entraînement instable.

### 1.2 La percée révolutionnaire du Transformer

Le Transformer, grâce au **mécanisme d'auto-attention (Self-Attention)**, permet au modèle de « voir d'un seul coup » toute la séquence et de calculer directement la relation entre deux positions quelconques, sans transmettre l'information pas à pas.

<RnnVsTransformerDemo />

::: tip Les avantages fondamentaux du Transformer
- **Calcul parallèle** : l'attention de toutes les positions peut être calculée simultanément, la vitesse d'entraînement est décuplée
- **Vision globale** : capture directement les dépendances à longue distance, sans limitation de longueur de séquence
- **Extensibilité** : architecture simple et unifiée, facile à empiler en réseaux plus profonds
:::

---

## II. Architecture complète du Transformer : de l'ensemble aux détails

L'architecture complète du Transformer se compose de deux parties : l'**encodeur (Encoder)** et le **décodeur (Decoder)**, responsables respectivement de la compréhension de l'entrée et de la génération de la sortie.

<TransformerArchitectureDemo />

### 2.1 Encodeur (Encoder)

Prenons la phrase « Le solde du compte bancaire est insuffisant ». Lorsque le modèle traite le mot « solde », il calcule automatiquement sa pertinence avec les autres mots :

- « solde » est fortement lié à « compte » (0,35)
- « solde » est moyennement lié à « bancaire » (0,20)
- « solde » est faiblement lié aux mots-outils comme « le », « du », « est » (0,05-0,10)

Cette pertinence n'est pas définie manuellement, mais apprise automatiquement par le modèle à travers de grandes quantités de données.

<SelfAttentionDemo />

### 2.2 Le processus de calcul de l'attention

Le mécanisme d'auto-attention se réalise en trois étapes clés :

1. **Génération des vecteurs Q, K, V** : chaque mot subit trois transformations linéaires différentes pour générer trois vecteurs : Query (requête), Key (clé), Value (valeur)
2. **Calcul des poids d'attention** : produit scalaire de la Query avec toutes les Keys pour obtenir des scores de similarité
3. **Somme pondérée** : les vecteurs Value sont pondérés par les poids d'attention et sommés pour obtenir la sortie finale

---

## III. Query, Key, Value : les trois mousquetaires de l'attention

Le mécanisme d'attention du Transformer s'inspire des idées de la recherche d'information, en projetant chaque mot dans trois espaces vectoriels différents.

### 3.1 Le rôle des trois vecteurs

**Query (requête)** : représente « ce que je cherche ». L'intention de requête du mot courant, utilisée pour correspondre avec les Keys des autres mots.

**Key (clé)** : représente « ce que je suis ». L'identifiant caractéristique de chaque mot, utilisé pour être retrouvé par les Queries.

**Value (valeur)** : représente « quel est mon contenu ». L'information réelle à transmettre, pondérée et sommée selon les poids d'attention.

L'ingéniosité de cette conception réside dans le fait que **le calcul de similarité (Q·K) et la transmission d'information (V) sont découplés**. Le modèle peut apprendre que « quels mots doivent être pris en compte » et « quelle information extraire après les avoir pris en compte » sont deux problèmes indépendants.

<QKVMechanismDemo />

### 3.2 Formule de calcul de l'attention

La formule complète de calcul de l'attention est :

```
Attention(Q, K, V) = softmax(QK^T / √d_k) V
```

Où :
- `QK^T` : calcule le produit scalaire de Query et Key, obtenant la matrice de similarité
- `√d_k` : facteur d'échelle, empêchant les valeurs de produit scalaire trop grandes de faire disparaître le gradient du softmax
- `softmax` : convertit la similarité en distribution de probabilité (poids d'attention)
- Multiplication finale par `V` : pondère et somme les Values avec les poids d'attention

---

## IV. Attention multi-têtes : comprendre la sémantique sous plusieurs angles

Une seule tête d'attention ne peut capturer qu'un seul type de dépendance. Pour permettre au modèle de comprendre la phrase sous plusieurs angles, le Transformer introduit l'**attention multi-têtes (Multi-Head Attention)**.

### 4.1 Mécanisme de fonctionnement des multi-têtes

L'attention multi-têtes projette l'entrée dans plusieurs sous-espaces différents, chaque « tête » calcule l'attention indépendamment, et enfin les sorties de toutes les têtes sont concaténées.

Un Transformer typique utilise 8 ou 16 têtes d'attention, chaque tête pouvant se concentrer sur différents phénomènes linguistiques :

- **Tête syntaxique** : identifie les relations grammaticales (sujet-verbe-objet, compléments)
- **Tête sémantique** : capture la pertinence lexicale (comme « banque » et « compte »)
- **Tête de position** : se concentre sur les dépendances locales des mots adjacents
- **Tête de référence** : résout les pronoms (comme « il » pointant vers « Pierre »)
- **Tête de sentiment** : identifie la polarité émotionnelle et les connotations
- **Tête d'entité** : reconnaît les noms de personnes, de lieux et autres entités nommées

<MultiHeadAttentionDemo />

### 4.2 Avantages des multi-têtes

**Capacité expressive plus forte** : différentes têtes peuvent capturer différents types de dépendances, évitant les limites d'une perspective unique.

**Calcul parallèle** : plusieurs têtes peuvent être calculées simultanément, sans augmenter le temps de calcul.

**Meilleure robustesse** : même si certaines têtes échouent dans leur apprentissage, les autres têtes fournissent encore des informations utiles.

::: tip Expression mathématique de l'attention multi-têtes
```
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) W^O
où head_i = Attention(QW_i^Q, KW_i^K, VW_i^V)
```
Chaque tête a des matrices de poids indépendantes W^Q, W^K, W^V, et enfin W^O fusionne les sorties de toutes les têtes.
:::

---

## V. Architecture complète du Transformer : encodeur et décodeur

L'architecture complète du Transformer se compose de deux parties : l'**encodeur (Encoder)** et le **décodeur (Decoder)**, responsables respectivement de la compréhension de l'entrée et de la génération de la sortie.

### 5.1 Encodeur (Encoder)

L'encodeur est constitué de plusieurs couches (généralement 6 à 12) de structure identique empilées, chaque couche contenant deux sous-couches :

1. **Couche d'auto-attention multi-têtes** : capture les dépendances internes de la séquence d'entrée
2. **Réseau de neurones feed-forward (Feed Forward)** : effectue une transformation non linéaire indépendante pour chaque position

Chaque sous-couche est suivie d'une **connexion résiduelle (Residual Connection)** et d'une **normalisation de couche (Layer Normalization)**, assurant la stabilité de l'entraînement des réseaux profonds.

### 5.2 Décodeur (Decoder)

Le décodeur est également constitué de plusieurs couches empilées, mais chaque couche a trois sous-couches :

1. **Auto-attention multi-têtes masquée (Masked Multi-Head Attention)** : ne peut voir que les mots précédant la position courante, empêchant la « triche »
2. **Attention croisée (Cross-Attention)** : relie l'encodeur et le décodeur, permettant au décodeur de se concentrer sur la séquence d'entrée
3. **Réseau feed-forward** : identique à l'encodeur

<TransformerArchitectureDemo />

### 5.3 Variantes modernes : encodeur seul vs décodeur seul

Bien que le Transformer original contienne à la fois un encodeur et un décodeur, les grands modèles modernes n'utilisent généralement que l'un des deux :

| Type d'architecture | Modèles représentatifs | Tâches adaptées |
| --- | --- | --- |
| **Encodeur seul** | BERT, RoBERTa | Classification de texte, reconnaissance d'entités nommées, questions-réponses |
| **Décodeur seul** | GPT, LLaMA, Claude | Génération de texte, dialogue, complétion de code |
| **Encodeur-Décodeur** | T5, BART | Traduction, résumé, reformulation de texte |

::: tip Pourquoi GPT n'utilise-t-il que le décodeur ?
La série de modèles GPT adopte une approche de **génération autorégressive**, prédisant le mot suivant un par un. L'architecture à décodeur seul est naturellement adaptée à cette tâche de génération, avec une structure plus simple, facile à étendre à des centaines de milliards de paramètres.
:::

---

## VI. Encodage positionnel : indiquer au modèle l'ordre des mots

Le mécanisme d'auto-attention du Transformer est intrinsèquement **indépendant de la position** — il considère la phrase comme un ensemble de mots, sans se soucier de leur ordre. Mais l'ordre des mots est crucial pour le sens : « Je t'aime » et « Tu m'aimes » ont des sens complètement différents !

### 6.1 Nécessité de l'encodage positionnel

Pour permettre au modèle de percevoir l'information de position, le Transformer ajoute un **encodage positionnel (Positional Encoding)** à l'embedding d'entrée. L'encodage positionnel est un vecteur de même dimension que l'embedding de mot, directement ajouté à celui-ci.

<PositionalEncodingDemo />

### 6.2 Encodage positionnel sinusoïdal

Le Transformer original utilise des fonctions sinus et cosinus fixes pour générer l'encodage positionnel :

```
PE(pos, 2i) = sin(pos / 10000^(2i/d))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d))
```

Avantages de cette conception :
- **Unicité** : chaque position a un encodage unique
- **Position relative** : le modèle peut apprendre les relations de distance relative
- **Extrapolation** : peut traiter des séquences plus longues qu'à l'entraînement

### 6.3 Schémas d'encodage positionnel modernes

Avec l'approfondissement de la recherche, d'autres schémas d'encodage positionnel sont apparus :

**Encodage positionnel apprenable** : BERT, GPT traitent l'encodage positionnel comme un paramètre entraînable plutôt qu'une fonction fixe.

**Encodage positionnel relatif** : T5, DeBERTa n'encodent pas la position absolue, mais la distance relative entre les mots.

**Encodage positionnel rotatif (RoPE)** : schéma utilisé par LLaMA, GPT-NeoX, injecte l'information de position en faisant tourner les vecteurs Q et K, avec de meilleures performances d'extrapolation.

**ALiBi** : réalise la perception de position en ajoutant un terme de biais aux scores d'attention, sans paramètres supplémentaires.

---

## VII. Impact et avenir du Transformer

L'apparition du Transformer n'est pas seulement la naissance d'une nouvelle architecture, c'est un changement de paradigme dans toute la recherche en IA.

### 7.1 Un paradigme de pré-entraînement unifié

Le Transformer a fait du « pré-entraînement + fine-tuning » le processus standard en NLP. En pré-entraînant sur des textes massifs non annotés, le modèle apprend une représentation universelle du langage, puis s'adapte à diverses tâches en aval avec seulement quelques données annotées.

### 7.2 Une architecture universelle cross-modale

Le succès du Transformer ne se limite pas au texte. Il a été appliqué avec succès à :

- **Vision par ordinateur** : Vision Transformer (ViT) surpasse les CNN en classification d'images
- **Reconnaissance vocale** : Whisper utilise le Transformer pour la conversion parole-texte multilingue
- **Prédiction de structure protéique** : AlphaFold 2 utilise le Transformer pour prédire la structure 3D des protéines
- **Apprentissage par renforcement** : Decision Transformer transforme les problèmes RL en modélisation de séquence

### 7.3 La pierre angulaire de l'ère des grands modèles

Des 175 milliards de paramètres de GPT-3 aux milliers de milliards de GPT-4, le Transformer montre une extensibilité étonnante. Ses caractéristiques de calcul parallèle nous permettent d'entraîner des modèles géants sans précédent et d'observer des **capacités émergentes (Emergent Abilities)** — quand le modèle est assez grand, il « comprend » automatiquement le raisonnement, le code, le multilinguisme et d'autres capacités.

### 7.4 Défis et orientations futures

Malgré son immense succès, le Transformer fait encore face à des défis :

**Complexité de calcul** : la complexité de l'auto-attention est O(n²), le calcul devient énorme pour les longs textes.

**Modélisation de longs textes** : bien que théoriquement capable de traiter des longueurs arbitraires, en pratique limité par la mémoire GPU et les ressources de calcul.

**Interprétabilité** : bien que les poids d'attention offrent une certaine interprétabilité, le processus de décision des réseaux profonds reste une boîte noire.

Les directions de recherche actuelles incluent :
- **Transformer efficace** : Linformer, Performer, Flash Attention, etc. pour réduire la complexité
- **Modélisation à long contexte** : Sparse Attention, Sliding Window, mécanismes de mémoire
- **Fusion multimodale** : architecture multimodale native traitant uniformément texte, image, audio

---

## VIII. Résumé

La proposition du Transformer et du mécanisme d'attention marque le passage définitif de l'apprentissage profond de la « conception manuelle de caractéristiques » à l'« apprentissage de bout en bout ». Il ne résout pas seulement le goulot d'étranglement technique du RNN, mais plus important encore, il fournit une architecture simple, universelle et extensible, devenant la pierre angulaire de l'ère des grands modèles.

Comprendre le Transformer, c'est comprendre le cœur de l'IA moderne. De l'encodage bidirectionnel de BERT, à la génération autorégressive de GPT, jusqu'à la représentation unifiée des grands modèles multimodaux, toutes ces percées reposent sur les épaules du Transformer.

À l'avenir, avec l'augmentation de la puissance de calcul et l'optimisation des algorithmes, le Transformer continuera d'évoluer, poussant l'IA vers des directions plus puissantes et plus universelles.
