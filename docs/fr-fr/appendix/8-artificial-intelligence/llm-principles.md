# Principes : Fonctionnement des grands modèles de langage
> 💡 **Guide d'apprentissage** : Ce chapitre ne nécessite aucune base en programmation. Grâce à des démonstrations interactives, il vous plonge dans les mécanismes fondamentaux des grands modèles de langage (LLM). Nous commencerons par la tokenisation la plus élémentaire pour arriver à la manière dont GPT est entraîné et effectue son inférence.

<LlmQuickStartDemo />

## 0. Introduction : du langage humain au calcul machine

Les humains communiquent par le langage, les ordinateurs calculent avec des nombres.
L'essence des **grands modèles de langage (LLM)** est justement de servir de pont entre ces deux mondes.

Leur mission principale est unique : **transformer le problème de « compréhension du langage » en un problème de « calcul mathématique ».**

Pour atteindre cet objectif, trois défis fondamentaux doivent être relevés :

1.  **Traduction** : comment convertir du texte en nombres ? (Tokenisation et Embedding)
2.  **Efficacité** : comment faire calculer l'ordinateur rapidement ? (Calcul matriciel)
3.  **Mémoire** : comment faire comprendre le contexte à l'ordinateur ? (Modèle Transformer)

Ce tutoriel vous guidera pas à pas, en partant de zéro, pour déconstruire la construction de ce pont.

---

## 1. Première étape : la traduction (Tokenisation)

L'ordinateur ne comprend pas le mot « hamburger », il ne connaît que les nombres.
Notre première tâche est donc : **découper le texte en unités minimales que l'ordinateur peut comprendre.**

### 1.1 Qu'est-ce que la tokenisation

La tokenisation consiste à décomposer une phrase entière en « unités lexicales » (Tokens).

- **Anglais** : les espaces sont déjà présents, ce qui facilite naturellement la tokenisation (ex. `I love AI`).
- **Chinois** : pas d'espaces, il faut un algorithme pour segmenter (ex. `我爱人工智能`).

#### Tokenizer (le traducteur)

Le programme qui exécute la tokenisation est appelé **Tokenizer**.
Il agit comme un traducteur, chargé de convertir le texte humain en une séquence de nombres compréhensible par la machine.

Les LLM modernes (comme GPT-4) utilisent généralement la **Subword Tokenization (tokenisation en sous-mots)** (comme l'algorithme BPE).
Son intelligence réside dans ceci : **les mots courants restent entiers, les mots rares sont décomposés.**

Voici un exemple réel de tokenisation BPE (basé sur le Tokenizer de GPT-4) :

**Input** : `"The quick brown fox jumps over the lazy dog. \n今天天气真不错！"`

**Token List** :

```text
index=791,   string='The'
index=4062,  string=' quick'
index=14198, string=' brown'
index=39935, string=' fox'
index=83368, string=' jumps'   <-- si décomposé, pourrait être ' jump' + 's'
index=927,   string=' over'
index=279,   string=' the'
index=16053, string=' lazy'
index=3290,  string=' dog'
index=13,    string='.'
index=198,   string='\n'       <-- saut de ligne
index=33838, string='今天'      <-- mot courant directement fusionné
index=54580, string='天气'
index=20265, string='真'
index=57672, string='不错'
index=171,   string='！'
```

> **À propos du traitement des caractères rares** :
> Si un caractère rare n'existe pas dans le vocabulaire (supposons que « 今 » soit très rare), le modèle retombe au niveau **Byte** pour l'encodage.
> 1.  Raw Input : `今`
> 2.  Bytes : `\xE4 \xBB \x8A`
> 3.  Recherche BPE : d'abord chercher `\xE4\xBB\x8A` -> introuvable -> décomposer en `\xE4\xBB` (ID=1001) + `\x8A` (ID=2002).
> 4.  Token final : `[1001, 2002]`.
>
> Ce mécanisme garantit que **quel que soit le caractère saisi, le modèle peut le traiter, sans jamais rencontrer de problème OOV (Out Of Vocabulary)**.

<TokenizationDemo />

**Point clé** : le LLM ne traite pas des mots, mais des **Token ID** (une série d'indices numériques).

---

## 2. Problème central : comment faire « calculer » le langage par un ordinateur

Notre mission est de traiter le langage. Mais l'ordinateur ne connaît que les nombres.
L'idée la plus directe est : attribuer un numéro (ID) à chaque mot.

- pomme -> ID 10
- banane -> ID 20

### 2.1 Pourquoi ne pas utiliser de simples ID

Si l'on n'utilise que des ID, l'ordinateur considérera « 10 » et « 20 » comme deux nombres sans aucun rapport.
De plus, si le vocabulaire contient 100 000 mots, il nous faudrait potentiellement un tableau de longueur 100 000 pour représenter un seul mot (encodage One-Hot), avec 99 999 positions à 0 et une seule position à 1.

- **Inconvénient 1 : trop de gaspillage** (creux, tableau One-Hot trop grand).
- **Inconvénient 2 : pas de sens** (impossible de représenter que « pomme » et « banane » sont toutes les deux des fruits).

### 2.2 Solution : l'Embedding (vecteur dense)

Pour exprimer un mot de manière **efficace** et **signifiante**, nous avons inventé l'**Embedding**.
Au lieu d'utiliser un long tableau de 0/1, on utilise un tableau plus court, rempli de nombres décimaux (par exemple 512 nombres), pour décrire un mot.

- Par exemple : `[0.8 (est un fruit), 0.1 (rouge), 0.9 (sucré)...]`
  Ainsi, non seulement nous compressons les données, mais nous transformons le sens des mots en « coordonnées » calculables.

<EmbeddingDemo />

---

## 3. Du mot à la matrice

Après avoir résolu le problème d'expression d'« un mot », il faut maintenant résoudre celui d'expression d'« une phrase ».

### 3.1 Pourquoi une matrice

Parce qu'une phrase contient de nombreux mots.

- Un mot = une ligne de nombres (vecteur).
- Une phrase = de nombreuses lignes de nombres empilées ensemble.
  C'est ce qu'est une **matrice**.

La raison pour laquelle on assemble le tout en matrice est que le matériel central des ordinateurs modernes — le **GPU (carte graphique)** — est conçu par nature pour effectuer des calculs matriciels.
Ce n'est qu'en transformant le langage en matrice que l'on peut exploiter la capacité de calcul parallèle du GPU et réaliser une inférence et un entraînement **efficaces**.

### 3.2 Pipeline complet

Récapitulons comment les données circulent :

1.  **Tokenisation** : découper le texte en morceaux.
2.  **Indexation** : transformer les morceaux en ID.
3.  **Embedding** : transformer les ID en vecteurs (pour la sémantique et la compression).
4.  **Empilement** : assembler les vecteurs en matrice (pour un calcul GPU efficace).

<TokenizerToMatrix />

---

## 3.5 Interlude : qu'est-ce qu'un « modèle » au juste

Avant d'aborder l'architecture concrète, comprenons d'abord de manière intuitive ce qu'est un « modèle ».

Dans le domaine de l'IA, un **modèle (Model)** est en réalité une **fonction** ou une **boîte noire** extrêmement complexe.

- **Entrée** : un ensemble de nombres (comme les Token ID ci-dessus).
- **Traitement** : la boîte noire contient des centaines de milliards de paramètres (que l'on peut voir comme des centaines de milliards de boutons de réglage), qui effectuent des opérations frénétiques d'addition, soustraction, multiplication et division sur les données d'entrée.
- **Sortie** : un autre ensemble de nombres (représentant le résultat de la prédiction, par exemple la probabilité du mot suivant).

**Une analogie :**

Vous pouvez imaginer le modèle comme un **chef cuisinier expérimenté** :

1.  **Entrée (les ingrédients)** : vous lui donnez du bœuf, des pommes de terre, des tomates.
2.  **Modèle (le cerveau du chef)** : en se basant sur les milliers de recettes qu'il a apprises (les données d'entraînement), il calcule rapidement dans sa tête : couper le bœuf en morceaux, éplucher les pommes de terre, contrôler la cuisson...
3.  **Sortie (le plat)** : il sert finalement un ragoût de bœuf aux pommes de terre.

Ce qu'on appelle l'**entraînement (Training)** consiste à faire de ce chef un apprenti, et à le laisser essayer et se tromper des milliards de fois. S'il sale trop, on ajuste le « bouton du sel » ; si c'est trop fade, on ajuste le « bouton de la cuisson », jusqu'à ce qu'il puisse produire de délicieux plats de manière stable.

Le LLM d'aujourd'hui est un « super chef » qui a « lu tous les livres de l'humanité », sauf qu'au lieu de cuisiner des plats, il cuisine du texte.

## 4. Le chemin de l'évolution : de RNN à Transformer

Avec les données (Tokens) et le chef (modèle), voyons maintenant comment ce chef réfléchit.

Dans l'histoire évolutive de l'IA, il existe principalement deux « façons de penser » (architectures) : **RNN** et **Transformer**.

### 4.1 L'ancienne méthode maladroite : RNN (le jeu du téléphone)

Les premiers modèles (RNN, Réseaux de Neurones Récurrents) traitaient une phrase comme un **jeu du téléphone arabe**.

**Fonctionnement :**

1.  Lire le 1er mot « Je », le mémoriser, le transmettre à l'étape 2.
2.  Lire le 2e mot « aime », le combiner avec le souvenir précédent, mettre à jour l'information en mémoire, la transmettre à l'étape 3.
3.  Lire le 3e mot « manger », mettre à jour la mémoire...
4.  ... jusqu'à avoir lu le dernier mot.

**Cela entraîne deux défauts fatals :**

1.  **Lent (pas de parallélisme)** : il faut attendre que la personne précédente ait fini de transmettre pour que la suivante puisse commencer. Impossible de faire travailler 100 personnes en même temps.
2.  **Oubli (perte d'information à longue distance)** : quand le message arrive à la 100e personne, elle a peut-être déjà oublié si la 1re personne disait « Je » ou « Tu ». Résultat : quand le modèle écrit un texte long, il perd facilement le fil.

### 4.2 Le design génial d'aujourd'hui : Transformer (la table ronde)

En 2017, Google a proposé une toute nouvelle architecture — le **Transformer**. Il a complètement changé les règles, transformant le « jeu du téléphone » en **table ronde**.

**Fonctionnement :**
Le Transformer ne transmet plus l'information mot par mot, mais fait **asseoir tous les mots à la table en une seule fois**.

1.  **Vue d'ensemble (calcul parallèle)** : tous les mots entrent simultanément, sans faire la queue. Chacun écrit son information sur un papier et le pose au milieu de la table.
2.  **Mécanisme d'Attention** : c'est son arme fatale. Chaque mot peut **directement** consulter l'information de n'importe quel autre mot autour de la table.
    - Par exemple, en lisant le mot « il », le modèle n'a pas besoin de se souvenir du message transmis précédemment, il jette directement un coup d'œil au « petit chat » mentionné plus tôt et comprend instantanément que « il = le petit chat ».

**Cela résout parfaitement les points faibles du RNN :**

- **Rapide** : tout le monde consulte les documents en même temps, le GPU peut fonctionner à plein régime, avec une efficacité extrême.
- **Pas d'oubli** : quelle que soit la longueur de la phrase, la distance entre le 1er mot et le 10 000e n'est qu'« à un pas », on peut regarder qui on veut.

> **En résumé** :
>
> - **RNN** : comme traverser un labyrinthe, pas à pas, on s'y perd facilement.
> - **Transformer** : comme regarder une carte avec une vue d'ensemble, le point de départ et la destination sont tous les deux visibles.

#### Motivation : a-t-on encore besoin de l'information de « position »

Parce que le Transformer traite tout « en une seule fournée », sans traitement spécial, il ne distingue pas « Je t'aime » de « Tu m'aimes » (les mots sont les mêmes, seul l'ordre change).
C'est pourquoi nous collons à chaque mot une **étiquette numérotée (encodage positionnel)**, pour indiquer au modèle qui est en 1re position, qui est en 2e position.

> Petit rappel : de nombreux LLM sont autorégressifs (ils prédisent le mot suivant), donc lors de la génération, ils produisent encore un token après l'autre ; mais dans le calcul interne de **chaque étape de génération**, le Transformer reste capable de mieux exploiter le parallélisme matriciel et l'optimisation du cache.

### 4.3 Astuce d'efficacité : le Cache KV (KV Cache)

Vous avez peut-être entendu dire que lors de la génération de longs textes, plus on avance, plus c'est lent, ou plus la mémoire vidéo est sollicitée. C'est généralement parce que le modèle doit « se souvenir » de tout le contenu généré précédemment.

**Comment le Transformer « prend-il des notes » ?**

Dans le mécanisme d'attention du Transformer, chaque mot génère deux vecteurs `Key (K)` et `Value (V)`, destinés à être « consultés » par les mots suivants.

- Quand le modèle génère le 100e mot, il doit revenir en arrière pour consulter les K et V des 99 mots précédents.
- S'il fallait recalculer à chaque fois les K et V des 99 mots précédents, ce serait un énorme gaspillage !

**Le rôle du Cache KV :**

Le Cache KV fonctionne comme un **« carnet de notes incrémental »**.

1.  **Pas de recalcul** : une fois les K et V du 1er mot calculés, on les stocke.
2.  **Calculer seulement le nouveau** : pour générer le 2e mot, on calcule uniquement les K et V du 2e mot, puis on les assemble avec les K et V du 1er mot.
3.  **Accumulation progressive** : au fil de la conversation, ce « carnet de notes » (occupation de la mémoire vidéo) devient de plus en plus épais.

C'est pourquoi les conversations à long contexte (Long Context) consomment énormément de mémoire vidéo — **ce n'est pas que le modèle grossit, c'est que les notes (Cache KV) sont trop épaisses.**

<RNNvsTransformer />

---

## 5. Révélation : de la « continuation de texte » au « dialogue »

Beaucoup de gens croient à tort que ChatGPT comprend vraiment ce que nous disons, mais en réalité son instinct fondamental est unique : **deviner le mot suivant** (Next Token Prediction).

### 5.1 L'instinct : la continuation effrénée

Si vous donnez au modèle de base (Base Model) l'entrée : « Quel temps fait-il aujourd'hui », il pourrait continuer par : « allons nous promener au parc. »
Mais si vous entrez : « Quelle est la capitale des États-Unis ? », il pourrait continuer par : « Quelle est la capitale de la Chine ? Quelle est la capitale du Japon ? » (parce qu'il imite le format d'un questionnaire, au lieu de répondre à la question).

### 5.2 L'astuce : utiliser un « scénario » pour dialoguer

Pour le transformer en assistant conversationnel, les ingénieurs ont trouvé une méthode ingénieuse : **le jeu de rôle**.
Ils ajoutent discrètement des **balises (Template)** spéciales dans le contenu fourni au modèle, lui faisant croire qu'il est en train de continuer l'écriture d'un « scénario de dialogue ».

Par exemple, vous voyez :

> User: Bonjour

Ce que le modèle voit en réalité :

> `<|user|>` Bonjour `<|assistant|>`

Dès que le modèle voit `<|assistant|>`, il comprend : « Ah, c'est à mon tour de jouer le rôle de l'assistant. »

### 5.3 Démonstration interactive approfondie

La démonstration ci-dessous vous guidera pas à pas pour découvrir l'essence du LLM. Veuillez cliquer successivement sur **1. Instinct -> 2. Astuce -> 3. Principe -> 4. Avancé**, essayez par vous-même !

<TrainingInferenceDemo />

---

## 6. Du « n'importe quoi » au « bon assistant » (Alignement)

Savoir dialoguer ne suffit pas. Le modèle brut pourrait apprendre aux gens à fabriquer des bombes, ou proférer des injures.
Pour en faire un assistant poli, sûr et fiable comme ChatGPT, deux dernières étapes de polissage sont nécessaires :

1.  **SFT (Ajustement supervisé par instructions)** :
    - Faire appel à des experts humains pour rédiger de nombreuses paires question-réponse de haute qualité, afin d'apprendre au modèle à « bien s'exprimer ».
    - Objectif : rendre le modèle capable de comprendre les instructions, et qu'il cesse de continuer le texte n'importe comment.
    - _Exemple de données (format JSON)_ :
      ```json
      // Exemple de données d'entraînement SFT
      {
        "messages": [
          { "role": "user", "content": "Veuillez traduire cette phrase en anglais : « Bonjour »." },
          { "role": "assistant", "content": "Hello." }
        ]
      }
      // Le modèle a appris : quand il entend l'instruction « traduire », il doit donner directement le résultat,
      // au lieu de continuer par « Bonjour, comment ça va »
      ```

2.  **RLHF (Apprentissage par renforcement avec feedback humain)** :
    - **Notation** : le modèle génère plusieurs réponses, des évaluateurs humains les notent (laquelle est la plus sûre ? la plus polie ?).
    - **Récompense et punition** : si le modèle répond bien, il reçoit une récompense ; s'il répond mal, une punition. Petit à petit, le modèle apprend à « s'aligner » sur les valeurs humaines (Alignement).
    - _Exemple de données (format JSON)_ :
      ```json
      // Exemple de données de préférence RLHF (DPO/PPO)
      {
        "prompt": "Comment fabriquer une bombe ?",
        "chosen": "Je suis désolé, je ne peux pas répondre à cette question.", // réponse préférée par l'humain (sûre)
        "rejected": "Tout d'abord, vous devez..." // réponse rejetée par l'humain (dangereuse)
      }
      ```

**Dans la démonstration ci-dessus, cliquez sur le 4e onglet « Avancé : Alignement » pour constater par vous-même l'énorme différence avant et après alignement.**

---

## 7. Exploration des frontières : modèles capables de réfléchir, architecture MoE et mécanisme d'attention linéaire

Avec l'évolution technologique, nous avons découvert que se contenter de « prédire le mot suivant » conduit parfois à des erreurs grossières, notamment face à des problèmes mathématiques et logiques.
C'est ainsi qu'une nouvelle génération de **Thinking Models** (comme OpenAI o1, DeepSeek-R1) est née.

### 7.1 Qu'est-ce que « réfléchir » (Thinking Models)

Face à une question complexe (comme « 9.11 et 9.9, lequel est le plus grand ? »), un humain ne répond pas du tac au tac, il réfléchit d'abord dans sa tête.
Un Thinking Model est un modèle qui a appris cette capacité de **réflexion lente (Système 2)**.

- **Réflexion rapide (Système 1)** : intuitive, réponse du tac au tac. Sujette à l'erreur.
- **Réflexion lente (Système 2)** : en produisant une « chaîne de pensée (Chain of Thought) », on raisonne pas à pas pour finalement donner la réponse.

<ThinkingModelDemo />

### 7.2 Les secrets de l'entraînement : de l'« imitation » à l'« exploration »

Pourquoi les anciens modèles ne réfléchissaient-ils pas ainsi ? Parce que la méthode d'entraînement a changé.

#### Mode traditionnel (SFT - Apprentissage par imitation)

- **Méthode** : montrer au modèle le processus de réflexion humain, et le laisser l'**imiter**.
- **Limite** : le plafond du modèle est celui des données humaines et de leur qualité. Si les humains eux-mêmes n'arrivent pas à résoudre un problème (par exemple un problème mathématique extrêmement difficile), le modèle ne peut pas non plus l'apprendre.

#### Mode réflexion (RL - Apprentissage par renforcement)

- **Méthode** : **ne pas** fournir les données de processus, mais seulement un **vérificateur (Verifier)** final.
  - Par exemple, donner un problème de maths, et laisser le modèle essayer par lui-même, au hasard.
  - S'il se trompe -> punition.
  - S'il réussit -> récompense.
- **Le moment Eurêka (Aha Moment)** :
  Après des milliers de tentatives auto-initiées, le modèle découvre avec surprise que : **« Si j'écris quelques étapes de dérivation supplémentaires sur un brouillon avant de sortir la réponse, ma probabilité de recevoir une récompense augmente considérablement ! »**
  Ainsi, ce comportement « réfléchir d'abord, répondre ensuite » est renforcé et consolidé. C'est comme AlphaGo qui jouait contre lui-même et a fini par surpasser les parties humaines enregistrées.

### 7.3 Guide pratique : le grand bouleversement du style de Prompt

Lorsque vous utilisez un Thinking Model (comme DeepSeek-R1, OpenAI o1), votre stratégie de prompting doit complètement changer.

| Caractéristique        | Modèles traditionnels (GPT-4o, Claude 3.5)        | Thinking Models (R1, o1)                                     |
| :--------------------- | :------------------------------------------------ | :----------------------------------------------------------- |
| **Logique centrale**   | **Système 1 (Intuition)**                         | **Système 2 (Logique)**                                      |
| **Astuces de prompting** | Nécessite de guider la chaîne de pensée (CoT)<br>Ex. : « Veuillez réfléchir pas à pas... » | **Ne pas** en faire trop<br>Le modèle a une chaîne de pensée intégrée, une guidance artificielle le perturberait |
| **Clarté des instructions** | Nécessite de décomposer les tâches complexes en sous-tâches | Donner directement l'objectif final, laisser le modèle décomposer lui-même |
| **Scénarios adaptés**  | Écriture créative, traduction simple, conversation légère | Mathématiques complexes, refactoring de code, raisonnement logique |

> ⚠️ **Attention** : avec un Thinking Model, moins on intervient, mieux c'est. Vous devez seulement définir clairement **« quel est le résultat parfait de la tâche »**, et non pas définir **« comment faire »**.

### 7.4 Tendance future : fusion rapide-lent

À l'avenir, nous n'aurons peut-être plus besoin de distinguer « modèle de réflexion » et « modèle ordinaire ».
L'IA idéale devrait, comme les humains, posséder une capacité de **calcul adaptatif (Adaptive Compute)** :

- Face à « 1+1=? » : activer instantanément le Système 1, réponse immédiate.
- Face à « prouver l'hypothèse de Riemann » : basculer automatiquement vers le Système 2, réfléchir trois jours et trois nuits avant de répondre.
- **Transition transparente pour l'utilisateur** : vous posez juste une question, le modèle décide lui-même du niveau d'« effort cérébral » pour la résoudre.

### 7.5 Évolution architecturale : du « généraliste » au « collège d'experts » (Dense vs MoE)

À mesure que les modèles deviennent de plus en plus grands (comme GPT-4, DeepSeek-V3), si pour chaque mot généré il fallait recalculer l'ensemble des neurones, la lenteur deviendrait insupportable.
C'est ainsi qu'est née l'architecture **MoE (Mixture of Experts, mélange d'experts)**.

- **Dense (modèle dense)** :
  - **Analogie** : un **génie universel**. Quelle que soit la question posée, il mobilise tout son cerveau pour répondre.
  - **Caractéristiques** : stable, mais à mesure que le savoir s'accumule, les réactions deviennent de plus en plus lentes.
  - **Représentants** : GPT-3, Llama-2.

- **MoE (modèle à mélange d'experts)** :
  - **Analogie** : un **collège d'experts sur une chaîne de montage** (à chaque mot traité, le personnel change).
  - **Mécanisme central (Token-Level Routing)** :
    L'essence du MoE réside dans le **routage natif au niveau du Token**. Il ne répartit **absolument pas** le travail par « type de tâche » (comme envoyer tous les problèmes de maths à l'expert en maths), mais bien par **le mot en cours de génération, en temps réel**.
    - Quand le modèle génère « `def` », il route vers l'**expert en code**.
    - Quand le modèle génère « `love` », il route vers l'**expert en littérature**.
    - Quand le modèle génère « `3.14` », il route vers l'**expert en mathématiques**.
    Cela signifie que, même au sein d'une même phrase, des mots différents sont souvent traités par des experts différents.
  - **Caractéristiques** : bien que l'effectif total soit important (nombre élevé de paramètres), seules quelques personnes travaillent à chaque mot traité (peu de paramètres activés). **À la fois érudit et rapide.**
  - **Représentants** : GPT-4, DeepSeek-V3, Mixtral.

<MoEDemo />

### 7.6 Révolution de l'efficacité : repousser les limites de la longueur (Linear Attention)

Outre le MoE, il existe un autre point sensible majeur : **la longueur du contexte**.
Le Transformer traditionnel (comme GPT-4) utilise un **mécanisme d'attention standard**, dont la complexité de calcul explose de façon **quadratique** avec le nombre de mots.

- Pour 10 000 mots, le nombre de calculs est de 100 millions.
- Pour 100 000 mots, le nombre de calculs est de 10 milliards !

Pour résoudre ce problème, des modèles comme MiniMax (série abab) et RWKV ont adopté le **mécanisme d'attention linéaire (Linear Attention)**.

### Motivation et justification : l'un est « maillé » et l'autre « linéaire »

La différence fondamentale réside dans : **choisissez-vous de « conserver tous les propos originaux », ou de « résumer au fur et à mesure » ?**

- **Attention standard (maillée) — Pourquoi faut-il forcément regarder en arrière ?**
  - **Raison principale** : pour **« trouver la pertinence »**.
  - **Exemple** : prenons la phrase « J'ai donné la **pomme** à **il**... ». Quand vous lisez le mot « **il** », pour déterminer à qui ce « il » fait référence, le modèle doit obligatoirement revenir en arrière et scanner tous les mots précédents (J', ai, donné, la, pomme, à).
  - **Processus** : « il » émet un signal de requête (Query), pour le comparer aux étiquettes (Key) de tous les mots précédents.
    - Correspondance avec « J' » ? 0 point.
    - Correspondance avec « pomme » ? **100 points !**
  - **Coût** : comme le modèle ne sait pas quel mot est important, il **doit vérifier tous les mots précédents, sans en manquer un seul**. C'est pourquoi les lignes forment un maillage.

- **Attention linéaire (linéaire) — Pourquoi peut-on ne pas regarder en arrière ?**
  - **Principe** : le modèle a appris à « prendre des notes ». Après avoir lu « pomme », il compresse l'information « il y a une pomme » dans un **état (State)** ; en lisant « il », il consulte directement l'état qu'il a en main pour savoir que « il = pomme ».
  - **Coût** : bien que rapide, le processus de « compression » peut faire perdre certains détails (par exemple oublier que la pomme est rouge).

<LinearAttentionDemo />

### 7.7 Comparaison des architectures : RNN vs Transformer vs RWKV

| Architecture | Mécanisme central | Complexité (longueur N) | Entraînement parallèle | Vitesse d'inférence | Problème d'oubli | Modèles représentatifs |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RNN** | Récursion séquentielle | $O(N)$ (faible) | ❌ Impossible | Lent (séquentiel) | Grave (oubli longue distance) | LSTM, GRU |
| **Transformer** | Attention globale | $O(N^2)$ (très élevée) | ✅ Possible | Moyen (Cache KV) | Aucun (mais limité par la fenêtre) | GPT-4, Llama |
| **RWKV / Linear** | Attention linéaire | $O(N)$ (faible) | ✅ Possible | Rapide (mémoire vidéo constante) | Léger (perte par compression) | RWKV, MiniMax |

> **RWKV / Linear Attention** tente de combiner les avantages des deux : s'entraîner en parallèle comme un Transformer, et inférer efficacement comme un RNN.

---

## 8. Résumé et parcours d'apprentissage

Vous avez maintenant relié tous les points, de la « tokenisation » jusqu'à « ChatGPT » :

1.  **Tokenisation** : découper le texte en Tokens.
2.  **Embedding** : mapper les Tokens en vecteurs sémantiques.
3.  **Transformer** : utiliser le mécanisme d'attention pour traiter les séquences, extraire les caractéristiques en parallèle.
4.  **Entraînement** : formater les données avec un Template, entraîner en parallèle via Teacher Forcing.
5.  **Inférence** : générer mot par mot de manière autorégressive.

**Suggestions pour la suite** :

- Si les mathématiques vous intéressent, vous pouvez approfondir l'**algèbre linéaire** (calcul matriciel) et la **théorie des probabilités**.
- Si vous souhaitez mettre la main à la pâte, vous pouvez essayer d'utiliser la bibliothèque Python `transformers` pour charger un modèle miniature (comme GPT-2) et expérimenter.

---

## 9. Glossaire

| Terme              | Nom complet                                | Explication                                                                                                                          |
| :----------------- | :----------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| **LLM**            | Large Language Model                       | Grand modèle de langage. Un modèle d'IA entraîné sur des textes massifs, capable de comprendre et de générer du langage humain.      |
| **Token**          | -                                          | **Token**. La plus petite unité issue du découpage du texte (mot, caractère ou fragment de caractère). Le modèle lit et écrit des Token ID. |
| **Embedding**      | -                                          | **Plongement lexical**. Vecteur numérique projetant un Token dans un espace de grande dimension (ex. 4096), capturant les relations sémantiques. |
| **Transformer**    | -                                          | Architecture centrale des LLM modernes. Basée sur le mécanisme d'attention, capable de traiter de longs textes en parallèle.         |
| **Attention**      | Attention Mechanism                        | **Mécanisme d'attention**. Permet au modèle, lorsqu'il traite un mot, de se concentrer dynamiquement sur les autres mots pertinents du contexte. |
| **Context Window** | -                                          | **Fenêtre de contexte**. Le nombre maximal de Tokens que le modèle peut « mémoriser » lors d'une inférence (ex. 128k).               |
| **Pre-training**   | -                                          | **Pré-entraînement**. Entraîner le modèle sur des textes massifs non annotés pour lui faire apprendre les règles fondamentales du langage et les connaissances du monde. |
| **SFT**            | Supervised Fine-Tuning                     | **Ajustement supervisé**. Utiliser des paires question-réponse de haute qualité pour apprendre au modèle à suivre les instructions humaines. |
| **RLHF**           | Reinforcement Learning from Human Feedback | **Apprentissage par renforcement avec feedback humain**. Par la notation humaine, ajuster davantage le comportement du modèle pour l'aligner sur les valeurs humaines (Alignement). |
| **CoT**            | Chain of Thought                           | **Chaîne de pensée**. Technique consistant à guider le modèle pour qu'il génère d'abord les étapes de raisonnement avant de donner la réponse finale. |
| **MoE**            | Mixture of Experts                         | **Mélange d'experts**. Modèle composé de plusieurs sous-modèles « experts », dont seule une partie est activée en fonction du problème, pour une meilleure efficacité. |
| **Temperature**    | -                                          | **Température**. Paramètre contrôlant l'aléatoire de la génération du modèle. Plus elle est élevée, plus les réponses sont créatives mais imprévisibles ; plus elle est basse, plus elles sont déterministes. |
