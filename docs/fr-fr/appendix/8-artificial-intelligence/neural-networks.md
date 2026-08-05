# Fondamentaux : Réseaux de neurones et apprentissage profond

::: tip Préface
**Les réseaux de neurones sont le moteur de la révolution de l'IA.** De la compréhension du langage de ChatGPT à la reconnaissance d'images de la conduite autonome, ce sont les réseaux de neurones qui travaillent en coulisses. Ce n'est pas de la magie, mais un cadre mathématique élégant — qui « apprend » la relation de correspondance entre l'entrée et la sortie à travers de grandes quantités de données. Comprendre ses principes fondamentaux vous aidera à mieux utiliser et déboguer les outils d'IA.
:::

**Qu'allez-vous apprendre dans cet article ?**

Après avoir étudié ce chapitre, vous obtiendrez :

- **Concepts fondamentaux** : comprendre les principes de base des neurones, des couches, de la propagation avant et de la rétropropagation
- **Types de réseaux** : connaître les caractéristiques et les scénarios d'application des architectures principales comme CNN, RNN, Transformer
- **Processus d'entraînement** : comprendre comment le modèle « apprend » à partir des données
- **Techniques clés** : maîtriser des concepts pratiques comme le surapprentissage, le taux d'apprentissage, la régularisation
- **Évolution historique** : comprendre le parcours du perceptron aux grands modèles de langage

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Du neurone au réseau | Perceptron, fonction d'activation, propagation avant |
| **Chapitre 2** | Comment le réseau apprend | Fonction de perte, descente de gradient, rétropropagation |
| **Chapitre 3** | Architectures de réseaux principales | CNN, RNN, Transformer |
| **Chapitre 4** | L'art de l'entraînement | Surapprentissage, régularisation, optimisation des hyperparamètres |
| **Chapitre 5** | Historique et frontières | Du perceptron à GPT |

---

## 1. Du neurone au réseau

### Le neurone individuel

La plus petite unité d'un réseau de neurones est le **neurone** (Neuron). Il simule le fonctionnement d'un neurone biologique : il reçoit plusieurs signaux d'entrée, les somme de manière pondérée, et produit une sortie via une fonction d'activation.

```
Entrée x1 ──→ ×w1 ──┐
Entrée x2 ──→ ×w2 ──┼──→ Σ(somme pondérée) + b(biais) ──→ f(fonction d'activation) ──→ Sortie
Entrée x3 ──→ ×w3 ──┘
```

Expression mathématique : **y = f(w₁x₁ + w₂x₂ + w₃x₃ + b)**

<NeuronDemo />

### Fonction d'activation : pourquoi la non-linéarité est-elle nécessaire

Sans fonction d'activation, quel que soit le nombre de couches de neurones empilées, le résultat final est équivalent à une transformation linéaire (multiplication matricielle). La fonction d'activation introduit la **non-linéarité**, permettant au réseau d'apprendre des motifs complexes.

| Fonction d'activation | Formule | Caractéristiques | Scénario d'utilisation |
|---------|------|------|---------|
| ReLU | max(0, x) | Simple, efficace, entraînement rapide | Choix par défaut pour les couches cachées |
| Sigmoid | 1/(1+e⁻ˣ) | Sortie 0~1 | Couche de sortie pour classification binaire |
| Tanh | (eˣ-e⁻ˣ)/(eˣ+e⁻ˣ) | Sortie -1~1 | Couramment utilisé dans les RNN |
| Softmax | eˣᵢ/Σeˣⱼ | Sortie distribution de probabilité | Couche de sortie pour classification multi-classe |

### Du neurone au réseau

Organiser plusieurs neurones en **couches**, et connecter plusieurs couches en série, constitue un réseau de neurones :

```
Couche d'entrée    Couche cachée 1   Couche cachée 2   Couche de sortie
(caractéristiques) (extraction bas niveau) (extraction haut niveau) (prédiction)

 x1 ──→  [○ ○ ○ ○] ──→ [○ ○ ○] ──→  [○ ○]
 x2 ──→  [○ ○ ○ ○] ──→ [○ ○ ○] ──→  chat/chien
 x3 ──→  [○ ○ ○ ○] ──→ [○ ○ ○]
```

| Concept | Description |
|------|------|
| Couche d'entrée | Reçoit les données brutes (pixels d'image, vecteurs de texte, etc.) |
| Couche cachée | Couche de traitement intermédiaire, plus il y a de couches, plus le réseau est « profond » (le « profond » de l'apprentissage profond) |
| Couche de sortie | Produit la prédiction finale (probabilité de classification, valeur de régression, etc.) |
| Propagation avant | Processus de circulation des données de la couche d'entrée vers la couche de sortie |

::: tip Pourquoi parle-t-on d'apprentissage « profond » ?
L'apprentissage automatique traditionnel n'a généralement que 1 à 2 couches. Quand le nombre de couches cachées atteint des dizaines, voire des centaines, on parle d'apprentissage « profond ». Les réseaux plus profonds peuvent apprendre des caractéristiques plus abstraites : la première couche apprend les contours, la deuxième les textures, la troisième les parties, et les couches plus profondes apprennent « c'est un chat ».
:::

---

## 2. Approche et mise en œuvre : le réseau apprend

L'« apprentissage » d'un réseau de neurones est essentiellement un **problème d'optimisation** : trouver un ensemble de poids (w) et de biais (b) tel que les prédictions du réseau soient aussi proches que possible des réponses réelles.

### Les trois étapes de l'entraînement

```
1. Propagation avant : entrer les données, obtenir la prédiction
2. Calcul de la perte : mesurer l'écart entre la prédiction et la valeur réelle avec la fonction de perte
3. Rétropropagation : calculer le gradient de chaque poids en fonction de la perte, mettre à jour les poids
   ↓
Répéter les étapes ci-dessus jusqu'à ce que la perte soit suffisamment petite
```

### Fonction de perte : mesurer « à quel point on s'est trompé »

La fonction de perte (Loss Function) quantifie l'écart entre la valeur prédite et la valeur réelle. L'objectif de l'entraînement est de minimiser la perte.

| Fonction de perte | Formule résumée | Scénario applicable |
|---------|---------|---------|
| MSE (Erreur quadratique moyenne) | Moyenne des carrés des écarts entre prédiction et valeur réelle | Problèmes de régression |
| Cross-Entropy (Entropie croisée) | -Σ y·log(ŷ) | Problèmes de classification |
| Binary Cross-Entropy | Version binaire de l'entropie croisée | Problèmes de classification binaire |

### Descente de gradient : trouver le point le plus bas

Imaginez que vous êtes au sommet d'une montagne, les yeux bandés, et que vous devez atteindre le point le plus bas. Tout ce que vous pouvez faire est de **tâter la pente sous vos pieds, puis faire un pas dans la direction descendante**. C'est la descente de gradient.

```
Valeur de perte
  ↑
  │    ╱╲
  │   ╱  ╲      ← Position actuelle
  │  ╱    ╲    ↙ Descente dans la direction du gradient
  │ ╱      ╲╱   ← Minimum local
  │╱            ╲╱  ← Minimum global
  └──────────────→ Valeur des poids
```

| Concept | Description |
|------|------|
| Gradient | Dérivée partielle de la fonction de perte par rapport à chaque poids, indiquant « dans quelle direction ajuster pour réduire la perte » |
| Taux d'apprentissage | Quelle distance parcourir à chaque pas. Trop grand, on dépasse le point le plus bas ; trop petit, la convergence est trop lente |
| Taille de batch | Combien d'échantillons utiliser pour calculer le gradient à chaque fois. Le lot complet est trop lent, l'échantillon unique est trop instable, le mini-batch est un compromis |

### Rétropropagation : le triomphe de la règle de chaîne

La rétropropagation (Backpropagation) est un algorithme efficace pour calculer les gradients. Elle utilise la **règle de chaîne** du calcul différentiel pour calculer, couche par couche en partant de la sortie, la contribution de chaque poids à la perte.

```
Propagation avant : Entrée → Couche cachée 1 → Couche cachée 2 → Sortie → Perte
Rétropropagation : Perte → Sortie → Couche cachée 2 → Couche cachée 1 → Mise à jour de tous les poids
```

::: tip Compréhension intuitive de la rétropropagation
Imaginez le réseau de neurones comme une chaîne de montage. Le produit (prédiction) a un défaut (perte élevée), vous devez remonter la chaîne depuis la dernière étape, examiner la contribution de chaque étape (chaque couche de poids) au problème final, puis ajuster proportionnellement. Grande contribution = grand ajustement, petite contribution = petit ajustement.
:::

---

## 3. Architectures de réseaux principales

Différents types de données nécessitent différentes architectures de réseau. Choisir la bonne architecture permet de multiplier l'efficacité.

<NetworkLayersDemo />

### 3.1 CNN (Réseau de neurones convolutifs)

Le CNN est le roi du traitement d'images. Idée centrale : faire glisser de petits noyaux de convolution sur l'image pour extraire des caractéristiques locales.

```
Image d'entrée → [Convolution→Activation→Pooling] × N → Couche fully connected → Sortie
  28×28            Extraction contours/textures/formes           Résultat de classification
```

| Caractéristique | Description |
|------|------|
| Connexion locale | Chaque neurone ne regarde qu'une petite région, pas l'image entière |
| Partage de paramètres | Le même noyau de convolution est réutilisé sur toute l'image, réduisant considérablement les paramètres |
| Invariance par translation | Le chat est reconnu qu'il soit à gauche ou à droite de l'image |
| Caractéristiques hiérarchiques | Les couches superficielles apprennent les contours, les couches profondes la sémantique |

Modèles représentatifs : LeNet, AlexNet, VGG, ResNet, EfficientNet

### 3.2 RNN (Réseau de neurones récurrents)

Le RNN est conçu pour les **données séquentielles**. Son état caché est transmis au pas de temps suivant, donnant au réseau une capacité de « mémoire ».

```
Pas de temps t1    Pas de temps t2    Pas de temps t3
  "Je"   ──→     "aime"    ──→     "les chats"
   ↓               ↓               ↓
  [h1]   ──→     [h2]     ──→     [h3] ──→ Sortie
   ↑               ↑               ↑
  L'état caché est transmis entre les pas de temps (mémoire)
```

| Variante | Problème résolu | Mécanisme central |
|------|-----------|---------|
| RNN original | Modélisation de séquence de base | Connexion récurrente simple |
| LSTM | Disparition du gradient dans les longues séquences | Porte d'oubli, porte d'entrée, porte de sortie |
| GRU | LSTM a trop de paramètres | Simplifié en porte de réinitialisation et porte de mise à jour |
| RNN bidirectionnel | Ne peut voir que le passé | Traite simultanément dans les deux sens |

::: tip Le mécanisme de portes du LSTM
L'ingéniosité du LSTM réside dans ses trois « portes » : la **porte d'oubli** décide quels anciens souvenirs jeter, la **porte d'entrée** décide quelles nouvelles informations stocker, la **porte de sortie** décide quel contenu produire. C'est comme quand vous lisez un livre, vous retenez sélectivement les intrigues importantes et oubliez les détails sans importance.
:::

### 3.3 Transformer : l'attention est tout

En 2017, Google a publié l'article « Attention Is All You Need » proposant le Transformer, qui a complètement changé le domaine de l'IA. Il remplace la structure récurrente par le **mécanisme d'auto-attention** et constitue la base des grands modèles comme GPT, BERT, Claude.

```
Séquence d'entrée → Embedding + Encodage positionnel → [Attention multi-têtes → Feed-Forward] × N → Sortie
                                    ↑
                          Chaque mot peut « voir » tous les autres mots
```

| Avantage | Description |
|------|------|
| Calcul parallèle | Contrairement au RNN qui doit traiter pas à pas, le Transformer peut traiter toute la séquence en parallèle |
| Dépendance longue distance | Établit une connexion directe entre deux positions quelconques, sans limitation de distance |
| Extensibilité | Plus le modèle est grand, plus il y a de données, meilleurs sont les résultats (Scaling Law) |

**Intuition de l'auto-attention** : en lisant la phrase « Le chat s'est assis sur le tapis parce qu'**il** était fatigué », « il » doit se référer au « chat » pour comprendre le sens. L'auto-attention permet au modèle d'apprendre cette association — en calculant un « score de pertinence » pour chaque paire de mots dans la séquence.

<NetworkArchitectureDemo />

## 4. L'art de l'entraînement

Avoir une bonne architecture ne suffit pas, il y a de nombreux « pièges » à éviter pendant l'entraînement.

### 4.1 Surapprentissage vs Sous-apprentissage

| Problème | Manifestation | Cause | Solution |
|------|------|------|---------|
| Surapprentissage | Bonnes performances sur l'ensemble d'entraînement, mauvaises sur l'ensemble de test | Modèle trop complexe, « apprend par cœur » au lieu de comprendre les régularités | Régularisation, Dropout, augmentation de données, arrêt précoce |
| Sous-apprentissage | Mauvaises performances sur les deux ensembles | Modèle trop simple, ne peut pas apprendre les régularités | Augmenter la capacité du modèle, entraîner plus longtemps, meilleures caractéristiques |

```
Erreur
  ↑
  │ ╲  Erreur d'entraînement    Erreur de test  ╱
  │  ╲                                          ╱
  │   ╲─────────────────╱
  │     Sous-apprentissage ← Point optimal → Surapprentissage
  └──────────────────────────→ Complexité du modèle
```

### 4.2 Hyperparamètres clés

Les hyperparamètres sont des paramètres définis manuellement avant l'entraînement (pas appris par le modèle) :

| Hyperparamètre | Rôle | Plage courante | Conseil d'optimisation |
|--------|------|---------|---------|
| Taux d'apprentissage | Amplitude de mise à jour à chaque pas | 1e-5 ~ 1e-1 | L'hyperparamètre le plus important, commencer généralement à 1e-3 |
| Taille de batch | Nombre d'échantillons par entraînement | 16 ~ 512 | Plus c'est grand, plus l'entraînement est stable, mais nécessite plus de mémoire |
| Nombre d'époques (Epoch) | Nombre de parcours complets du jeu de données | 10 ~ 100+ | À utiliser avec l'arrêt précoce, s'arrêter quand la validation ne s'améliore plus |
| Optimiseur | Stratégie de mise à jour du gradient | Adam, SGD | Adam est le choix par défaut, SGD+momentum convient au réglage fin |

### 4.3 Techniques de régularisation

Moyens courants pour prévenir le surapprentissage :

| Technique | Principe | Utilisation |
|------|------|---------|
| Dropout | Désactiver aléatoirement des neurones pendant l'entraînement | Généralement p=0,1~0,5 |
| Décroissance des poids | Ajouter une pénalité sur la taille des poids dans la fonction de perte | Régularisation L2, λ=1e-4 |
| Augmentation de données | Appliquer des transformations aléatoires aux données d'entraînement (retournement, recadrage, rotation) | Indispensable pour les tâches d'image |
| Arrêt précoce | Arrêter l'entraînement quand la perte de validation ne diminue plus | patience=5~10 |
| Batch Normalization | Normaliser la distribution d'entrée de chaque couche | Accélère la convergence, a un léger effet de régularisation |

::: tip Règles empiriques pour l'entraînement
1. Faire d'abord tourner tout le pipeline sur un petit jeu de données pour confirmer l'absence de bugs dans le code
2. Commencer par le fine-tuning à partir d'un modèle pré-entraîné existant, plutôt que de s'entraîner de zéro
3. Le taux d'apprentissage est l'hyperparamètre qui mérite le plus de temps d'optimisation
4. Si la perte d'entraînement ne diminue pas, vérifier d'abord les données et le code, avant de remettre en cause le modèle
:::

---

## 5. Historique et frontières

Le développement des réseaux de neurones a connu plusieurs « hivers » et « renaissances », chaque percée étant due à des innovations techniques clés.

| Année | Jalon | Percée clé |
|------|--------|---------|
| 1958 | Perceptron | Premier modèle de réseau de neurones, ne pouvait traiter que des problèmes linéaires |
| 1986 | Algorithme de rétropropagation | A rendu possible l'entraînement de réseaux multicouches |
| 1998 | LeNet (CNN) | Le réseau convolutif a connu un grand succès en reconnaissance de chiffres manuscrits |
| 2012 | AlexNet | Le CNN profond a écrasé les méthodes traditionnelles sur ImageNet, explosion de l'apprentissage profond |
| 2014 | GAN (Generative Adversarial Network) | Deux réseaux s'entraînent de manière antagoniste, pouvant générer des images réalistes |
| 2017 | Transformer | « Attention Is All You Need », le mécanisme d'attention remplace le RNN |
| 2018 | BERT | Paradigme pré-entraînement + fine-tuning, percée complète en NLP |
| 2020 | GPT-3 | 175 milliards de paramètres, démontre les capacités émergentes des grands modèles |
| 2022 | ChatGPT | Technique d'alignement RLHF, l'IA entre dans la conscience du grand public |
| 2023+ | Grands modèles multimodaux | GPT-4V, Claude, etc., comprennent simultanément le texte et l'image |

### Tendances actuelles

| Direction | Description |
|------|------|
| Grands modèles (LLM) | Paramètres de centaines de millions à des milliers de milliards, émergence de capacités de raisonnement et de programmation |
| Multimodal | Un même modèle traite le texte, l'image, l'audio, la vidéo |
| Fine-tuning efficace | Des techniques comme LoRA, QLoRA permettent aux développeurs ordinaires de fine-tuner les grands modèles |
| Agent IA | Permettre aux grands modèles d'utiliser des outils, de planifier des tâches, d'accomplir des objectifs complexes de manière autonome |
| Distillation de petits modèles | Utiliser les connaissances des grands modèles pour entraîner de petits modèles, déployables sur les appareils edge |

::: tip Leçon pour les développeurs
Vous n'avez pas besoin d'entraîner des réseaux de neurones à partir de zéro. Le développement IA moderne consiste davantage à **appeler des API** (comme OpenAI, Claude API) ou à **fine-tuner des modèles pré-entraînés** (comme avec Hugging Face). Mais comprendre les principes sous-jacents vous aide à mieux choisir les modèles, concevoir les prompts et diagnostiquer les problèmes.
:::

---

## Résumé

| Concept fondamental | En une phrase |
|---------|-----------|
| Neurone | Somme pondérée + fonction d'activation, la plus petite unité de calcul du réseau |
| Propagation avant | Les données circulent de la couche d'entrée vers la couche de sortie, produisant une prédiction |
| Rétropropagation | À partir de la perte, calcule les gradients couche par couche, met à jour les poids |
| CNN | Les noyaux de convolution extraient les caractéristiques locales, premier choix pour le traitement d'images |
| RNN/LSTM | Connexion récurrente maintenant la mémoire, traitement de données séquentielles |
| Transformer | Auto-attention avec traitement parallèle, architecture de base des grands modèles |
| Surapprentissage | Le modèle « apprend par cœur », prévenir avec régularisation, Dropout, etc. |
| Apprentissage par transfert | S'appuyer sur les épaules des géants, utiliser des modèles pré-entraînés pour le fine-tuning |

---

## Lectures complémentaires

- [3Blue1Brown - Série de vidéos sur les réseaux de neurones](https://www.3blue1brown.com/topics/neural-networks) — L'explication visuelle la plus intuitive
- [Stanford CS231n](http://cs231n.stanford.edu/) — Le cours classique sur les réseaux de neurones convolutifs
- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) — Architecture Transformer illustrée
- [Neural Networks and Deep Learning](http://neuralnetworksanddeeplearning.com/) — Manuel en ligne gratuit
- [Cours Hugging Face](https://huggingface.co/learn) — Pratique pratique du Transformer et des grands modèles