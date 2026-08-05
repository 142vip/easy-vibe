# Principes : Modèles multimodaux : Vision, Audio, Vidéo
> 💡 **Guide d'apprentissage** : Ce chapitre ne nécessite pas de connaissances approfondies en vision par ordinateur. Grâce à des démonstrations interactives, vous comprendrez comment l'IA a acquis des « yeux ». Nous allons dévoiler les principes fondamentaux derrière des modèles comme GPT-4V et Qwen-VL.

<VlmQuickStartDemo />

## 0. Introduction : Donner des yeux au cerveau

Dans l'[Introduction aux grands modèles de langage](./llm-principles.md), nous avons vu que le LLM est essentiellement un « cerveau » enfermé dans une boîte noire, qui ne peut comprendre le monde qu'à travers le **texte**.

L'émergence des **Grands Modèles Visuels (VLM)** revient à doter ce cerveau d'une paire d'**yeux**.

Mais ce n'est pas si simple. Car :

- Le **cerveau (LLM)** ne comprend que le **texte** (plus précisément les IDs de tokens).
- Les **yeux (caméra)** perçoivent des **pixels** (valeurs de couleur RGB).

La mission centrale du VLM est de **traduire le « signal pixel » en « signal textuel »**, afin que le LLM trouve la compréhension d'une image aussi naturelle que la lecture d'un article.

---

## 1. Première étape : Transformer les images en « mots » (Tokenisation Visuelle)

Imaginez que vous décrivez un puzzle à un ami au téléphone. Vous ne pouvez pas tout dire d'un coup, vous devez le décrire pièce par pièce.
C'est la même chose pour un ordinateur qui regarde une image.

### 1.1 Découpage (Patchify) — Créer des mots visuels

Nous savons que les grands modèles de langage (LLM), lorsqu'ils traitent du texte, décomposent les phrases en tokens. Pour que le LLM puisse « lire » une image, la méthode la plus intuitive est de transformer l'image en quelque chose de similaire à des tokens.

Afin de s'adapter à cette habitude qu'a le modèle de « lire des mots », nous avons besoin d'une technique capable de convertir une image bidimensionnelle continue en fragments discrets. C'est là qu'intervient le concept de **découpage visuel en patchs (Patchify)** : nous découpons une image bidimensionnelle complète, comme on couperait du tofu, en une grille de petits carrés fixes (appelés Patchs).

- **Image originale** = un article complet
- **Patch d'image** = un mot (Token) dans l'article

En pratique, nous découpons généralement l'image selon des dimensions fixes (par exemple $16 \times 16$ ou $14 \times 14$ pixels) de manière transparente. Par exemple, une image d'entrée courante de $224 \times 224$ pixels, une fois découpée, devient $14 \times 14 = 196$ carrés d'image indépendants.
Grâce à cette opération, la grille de pixels bidimensionnelle, initialement continue et complète, est physiquement découpée en 196 « mots visuels » discrets.

> 🕹️ **Démonstration interactive** : Cliquez sur le bouton ci-dessous pour voir comment l'image originale est découpée par une grille régulière en patchs indépendants.

<PatchifyDemo />

### 1.2 Sérialisation (Flatten) — Mettre en une phrase

Après l'étape de découpage, nous avons maintenant une matrice bidimensionnelle de $14 \times 14$. Cependant, qu'il s'agisse des Transformers traditionnels ou des LLM modernes, leur architecture sous-jacente n'accepte généralement que des **entrées sous forme de séquence unidimensionnelle** (c'est-à-dire une structure de données linéaire, de gauche à droite).

Pour être compatible avec les spécifications d'entrée du grand modèle, nous devons effectuer une **sérialisation (Flatten) et projection linéaire (Linear Projection)** :
1. **Aplatir (Flatten)** : assembler les blocs d'image de plusieurs lignes bout à bout, en « aplatissant » la matrice bidimensionnelle en un long axe unidimensionnel avec un ordre séquentiel.
2. **Projection de caractéristiques (Projection)** : Ces 196 blocs ne sont encore que des « morceaux bruts » empilés de pixels rouge-vert-bleu. Nous devons utiliser un petit réseau de neurones (généralement une couche entièrement connectée) pour traiter chaque bloc, en les compressant et les convertissant respectivement en un vecteur de caractéristiques de longueur fixe (par exemple une liste de nombres de longueur 768).

Après cette étape, une image devient véritablement une « séquence de mots visuels » (Visual Token Sequence).

> 🕹️ **Démonstration interactive** : Observez l'animation ci-dessous pour comprendre comment **un simple bloc de pixels (Patch)** subit une transformation matricielle et est finalement projeté dans un **vecteur (Vector)** de haute dimension contenant des caractéristiques riches et variées.

<LinearProjectionDemo />

---

## 2. Deuxième étape : Traduction inter-espèces (Projection)

À ce stade, bien que l'image ait été convertie en une séquence continue et unidimensionnelle de « mots visuels », cette séquence reste pour le LLM final un charabia illisible.

Pourquoi est-ce illisible ? Parce que les **espaces de caractéristiques sont différents** (autrement dit, ils parlent des langues différentes).
Ce que l'encodeur visuel (comme ViT) extrait, ce sont des **caractéristiques spatiales de pixels** (par exemple, il peut seulement dire « ceci est composé de nombreuses lignes noires courbes », « voici une grande zone rouge ») ; tandis que le LLM comprend des **caractéristiques sémantiques profondes** (comme les concepts de « chat », « arbres », « danger », etc.).

Entre ces deux systèmes de langage radicalement différents, nous devons construire un pont, c'est-à-dire notre traducteur intermodal : le **Projector (Projecteur / Adaptateur)**.

### 2.1 Le rôle du traducteur (Latent Space Alignment)

L'essence académique du Projector est de réaliser l'**alignement de l'espace latent des caractéristiques (Latent Space Alignment)**. C'est comme un interprète simultané dans la vie réelle :

- **Entrée (Source)** : Les « caractéristiques visuelles » émises par ViT (mettant l'accent sur les motifs géométriques, les couleurs, les textures — des représentations continues de haute dimension).
- **Traitement (Traduction)** : Le Projector utilise une structure de réseau de neurones (qui peut être quelques couches simples de transformation linéaire ou des couches d'attention complexes) pour trouver la correspondance mathématique entre les deux langues.
- **Sortie (Cible)** : Produire un « langage LLM » parfaitement conforme aux attentes du LLM (des embeddings textuels équivalents convertis à partir des caractéristiques de l'image, conférant ainsi à l'image un sens dialogique).

Grâce à ce filtrage de traduction, le grand modèle découvre avec surprise : « Tiens ? Cette séquence de nombres qui m'est transmise, n'est-ce pas tout simplement ces combinaisons de mots à caractère descriptif que j'ai l'habitude de lire ? », et il traite alors naturellement et conjointement les caractéristiques de l'image et le langage naturel.

<ProjectorDemo />

### 2.2 Différentes écoles de traduction

Pour rendre ce « processus de traduction » de l'alignement des caractéristiques plus rapide et plus précis, les mondes académique et industriel ont développé plusieurs conceptions de connexion matérielle représentatives :

1.  **École de la traduction littérale (Linear Projection)** :
    - **Méthode** : Extrêmement simple et directe, elle utilise seulement une ou quelques dizaines de couches de perceptron multicouche (MLP / couches de projection linéaire) pour effectuer une transformation matricielle mathématique directe.
    - **Caractéristiques** : **Perte d'information extrêmement faible, préservation des détails authentiques de l'image** ; mais l'inconvénient est que les centaines, voire milliers, de tokens visuels découpés précédemment sont transmis sans filtre au modèle de langage, ce qui entraîne une explosion de la charge de calcul ultérieure.
    - **Représentant** : Série LLaVA.

2.  **École de la traduction libre (Q-Former / Resampler)** :
    - **Méthode** : Plutôt que de transmettre tel quel, on introduit au milieu un « petit réseau de reconnaissance » doté d'une capacité de synthèse abstraite. Cet agent intermédiaire comprend d'abord rapidement l'image dans son ensemble, puis extrait quelques dizaines de points essentiels hautement condensés.
    - **Caractéristiques** : **Information hautement synthétisée et raffinée, moins de tokens, économisant considérablement la puissance de calcul du LLM pour la réflexion** ; l'inconvénient est qu'il est possible de perdre, lors du processus de distillation, des indices d'observation extrêmement subtils situés aux bords de l'image originale.
    - **Représentants** : BLIP-2, Gemini (mécanisme partiellement similaire).

3.  **École du compromis (C-Abstractor / Pooling)** :
    - **Méthode** : À l'aide de pooling convolutif ou de réorganisation locale de régions, on compresse et fusionne des blocs de pixels adjacents de $2 \times 2$ ou plus en une unité d'expression complète.
    - **Caractéristiques** : Compresse raisonnablement la longueur des tokens tout en préservant une partie de la localité et de la spatialité interdépendantes.
    - **Représentant** : Qwen-VL-Max.

---

## 3. Troisième étape : Assemblage (L'Architecture)

Avec les composants et les standards d'interfaçage en place, voyons maintenant comment l'ensemble est assemblé. Les modèles de langage visuel (Vision-Language Model) dominants suivent généralement une **architecture unifiée en « trois segments »**.

### 3.1 La structure corporelle du VLM

<ModelArchitectureComparisonDemo />

Un VLM dans un paradigme typique est composé des trois parties principales suivantes qui fonctionnent en synergie :

1.  **Les « yeux » de perception des caractéristiques (Vision Encoder - Encodeur Visuel)** :
    - **Fonction** : Agit comme le premier point de contrôle de l'entrée image, chargé de regarder l'image et d'extraire des caractéristiques visuelles de haute dimension.
    - **Sélection** : La plupart des constructeurs n'entraînent pas les yeux à partir de zéro, mais empruntent directement des composants matures pré-entraînés sur des centaines de millions de paires « image-texte » (comme la tour visuelle du modèle CLIP d'OpenAI, ou le modèle SigLIP de Google).
    - *Analogie : C'est la région de cellules photoréceptrices hautement spécialisées de la rétine d'un organisme biologique.*

2.  **Le « nerf optique » de conversion du signal (Projector - Projecteur Modal)** :
    - **Fonction** : Fait le lien entre l'encodeur et la base linguistique, responsable de la compression dimensionnelle du signal, de son acheminement et de la traduction sémantique multimodale.
    - **Sélection** : C'est la **priorité absolue** de l'entraînement ultérieur de tout le système multimodal. Son propre nombre de paramètres n'est généralement pas élevé (relativement au LLM), mais il détermine si le « texte » et l'« image » peuvent mutuellement se comprendre.
    - *Analogie : C'est comme le centre nerveux visuel qui convertit les signaux électriques et les transmet au cortex cérébral.*

3.  **Le « cerveau » moteur cognitif (LLM Backbone - Base du modèle de langage)** :
    - **Fonction** : Assure l'observation finale, l'appel au sens commun, le raisonnement logique profond et la génération de réponses anthropomorphiques.
    - **Sélection** : Utilise généralement les grands modèles de langage open source les plus intelligents du secteur comme point d'attache (tels que Qwen, Llama 3, Vicuna, etc.).
    - *Analogie : C'est le centre linguistique et décisionnel du cerveau doté d'une base de connaissances du monde, qui interprète de manière cognitive de haut niveau les signaux transmis par le nerf optique après traitement.*

---

## 4. Approche et mise en œuvre : apprend-il à voir (Entraînement)

Bien, maintenant les différentes parties du corps sont cousues ensemble. Mais avant d'entrer officiellement en service, le VLM tout juste assemblé se trouve en réalité dans un état de « cécité et chaos » semblable à celui d'un nouveau-né — car le nerf optique (Projector) nouvellement ajouté est une page blanche, remplie de valeurs numériques aléatoires sans signification.

Pour doter ce monstre assemblé de la capacité de décrire des images, la communauté scientifique a élaboré une **« Loi d'entraînement en deux phases (Two-Stage Training) »** très efficace.

### Phase un : Reconnaissance d'objets (Feature Alignment — Pré-entraînement de reconnaissance)

Dans cette phase, la tâche principale est d'établir pour le Projector aléatoire une première relation de correspondance intermodale. Le processus ressemble beaucoup à l'apprentissage d'un bébé avec des « cartes mémoire » pour mémoriser de force des mots.

- **Ce qu'on lui montre (Entrée d'entraînement)** : De grandes quantités (souvent des centaines de millions) de paires image-texte extrêmement simples contenant un seul sujet proéminent (par exemple une photo de « chat » sur fond blanc).
- **Ce qu'on lui dit (Sortie cible)** : Des étiquettes textuelles courtes associées (« un chat orange »).
- **Objectif d'optimisation** : Forcer le Projector à apprendre par transformation matricielle à faire coïncider et aligner le plus possible les caractéristiques visuelles correspondantes de ce chat (après traduction) avec le vecteur de token du mot « chat » en langage naturel.
- **État de contrôle des paramètres (Freeze Strategy)** : Pour éviter de détruire l'intelligence du modèle original, durant cette phase, les chercheurs **gèlent (Freeze)** massivement les dizaines de milliards de paramètres des « yeux » (ViT) et du « cerveau » (LLM), et **activent uniquement l'entraînement des quelques millions de paramètres du « nerf optique » (Projector)** lui-même.

<FeatureAlignmentDemo />

### Phase deux : Dialogue (Visual Instruction Tuning — Exercice de dialogue)

Si la première phase ne fait que transformer le modèle en une machine à réciter des noms, la tâche de la seconde phase est de stimuler son intelligence de haut niveau, afin qu'il puisse véritablement répondre à des instructions complexes mêlant texte et image en fonction du contexte.

- **Ce qu'on lui montre (Entrée d'entraînement)** : Des paires de questions-réponses de haute qualité soigneusement conçues. Par exemple, on fournit une photo panoramique complexe de la circulation urbaine.
- **Ce qu'on lui demande de répondre (Sortie cible)** : L'Utilisateur demande : « `<image>` L'homme au vélo blanc dans le coin inférieur gauche porte-t-il un casque ? » L'Assistant répond : « Non, il ne porte rien sur la tête, ce qui est un comportement très dangereux en ville. »
- **Objectif d'optimisation** : Permettre au grand modèle non seulement de recevoir des indices visuels, mais aussi de combiner les connaissances de civilisation accumulées antérieurement, pour fusionner complètement la logique textuelle et les représentations multimodales et effectuer des raisonnements.
- **État de contrôle des paramètres (Freeze Strategy)** : À ce stade, le nerf optique est déjà pratiquement réglé. Dans cette phase de réglage fin, on continue généralement à geler une partie des poids de la couche inférieure de l'encodeur visuel, tout en **dégelant complètement le LLM et le Projector** (ou en adoptant une configuration LoRA) pour effectuer un ajustement global à grande échelle par rétropropagation conjointe.

<VLMInferenceDemo />

---

## 5. Avancé : Voir plus clair (Techniques Avancées)

Bien que l'architecture ci-dessus ait soutenu le paradigme multimodal initial, la première génération de modèles VLM souffrait d'un défaut fondamental très préoccupant — **la myopie (faiblesse visuelle congénitale)**.

Les premiers encodeurs visuels ViT, en raison de leur conception historique, ne pouvaient intrinsèquement traiter que des images minuscules de très basse résolution comme $224 \times 224$ ou $336 \times 336$. C'est comme observer le monde à travers une caméra rétro floue de quelques centaines de milliers de pixels — les détails tels que les petites inscriptions sur les panneaux deviennent complètement flous et se fondent en un amas de pixels. Même le cerveau le plus intelligent ne peut rien faire sans matière première.

Pour surmonter ce problème de basse résolution, les fabricants de modèles de pointe (comme l'équipe Qwen-VL, LLaVA-NeXT, etc.) ont employé des astuces d'ingénierie très ingénieuses :

### 5.1 Cartographie dynamique haute résolution (Dynamic High-Resolution Mapping)

Si l'entrée directe d'une grande image fait exploser la mémoire vidéo, et que la réduction brutale fait disparaître tous les détails, comment résoudre ce dilemme ? La solution actuelle est : une **stratégie à double perspective « Gros plan local + Vue d'ensemble globale »**.

1. **Aperçu global** : D'abord, réduire directement la grande image originale haute définition à $336 \times 336$ et la montrer aux yeux. Cela permet au modèle d'appréhender la **structure macroscopique globale de l'image** (où est le ciel ? où est le sol ?).
2. **Zoom par découpe** : Découper l'image originale haute définition en plusieurs dizaines de blocs de gros plan sans perte de $336 \times 336$ (Slice).
3. **Examen un par un et réassemblage spatial** : Faire en sorte que le moteur visuel examine un par un, à la loupe, ces dizaines de tranches sans perte pour collecter les détails haute définition. Ensuite, le Projector, tel un puzzle, assemble sémantiquement ces blocs de détails avec le contexte de l'aperçu global initial.

Cette approche équivaut à prendre une photo panoramique d'un journal avec votre téléphone (pour voir la mise en page globale), puis à rapprocher le téléphone du journal pour prendre en rafale des dizaines de photos en gros plan de chaque paragraphe.

### 5.2 Changer pour de grands yeux naturels (Scaling the Vision Encoder)

Une autre approche, qui relève d'une esthétique de la force brute pure, consiste à : puisque les yeux d'origine ont un défaut génétique congénital, je vais forger un œil superlatif et stupéfiant depuis le début.

Prenant l'excellent modèle open source chinois **InternVL** comme représentant classique, il abandonne les petits modèles visuels couramment utilisés et entraîne à partir de zéro, en consommant des ressources massives, un encodeur visuel frontal super-géant extrêmement rare, avec plusieurs milliards de paramètres (comme InternViT-6B à 6 milliards de paramètres).
Grâce à sa formidable capacité d'absorption de données, il est né en supportant nativement l'entrée transparente haute résolution, tel un « télescope spatial Hubble ». Cette conception réduit considérablement la surcharge d'ingénierie complexe et les risques de désalignement des caractéristiques introduits par les approches de découpage et réassemblage d'images, réalisant directement une perception visuelle haute définition « sans rien manquer ».

---

## 6. Résumé

Les grands modèles multimodaux (VLM) n'ont rien de magique. Ils ne font qu'une seule chose :

**Traduire la « langue étrangère » qu'est l'image dans la « langue maternelle » qu'est le texte, puis la donner au LLM.**

Si vous comprenez ce point, vous comprenez tout des VLM.

---

## 7. Lexique (Glossary)

| Terme         | Nom complet           | Explication                                                                    |
| :------------ | :-------------------- | :----------------------------------------------------------------------------- |
| **VLM**       | Vision-Language Model | **Grand Modèle Multimodal**. Le GPT qui peut comprendre les images.            |
| **ViT**       | Vision Transformer    | **Modèle Visuel**. Les « yeux » du VLM, chargé de convertir les pixels en vecteurs. |
| **Patch**     | -                     | **Bloc d'image**. Les petits carrés issus du découpage de l'image, équivalents aux « mots visuels ». |
| **Projector** | -                     | **Projecteur / Traducteur**. Le pont qui relie les yeux et le cerveau.          |
| **Alignment** | -                     | **Alignement**. Faire en sorte que les caractéristiques d'image et de texte puissent « se comprendre mutuellement » dans le même espace. |
