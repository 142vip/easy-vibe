# Principes de représentation des données : codage, stockage et transmission

::: tip Préface
Lorsque vous envoyez une photo à un ami, un message WeChat, ou que vous téléchargez un jeu de plusieurs Go, comment ces informations traversent-elles plus de la moitié du globe pour apparaître intactes sur votre écran ? Ce chapitre s'articule autour d'une question qui perturbe souvent les débutants : **Pourquoi les fichiers que je reçois deviennent-ils illisibles ?** En suivant cette question, nous révélerons complètement les trois piliers fondamentaux de l'informatique : **le codage, le stockage et la transmission**.
:::

**Que allez-vous apprendre dans cet article ?**

À la fin de ce chapitre, vous aurez acquis :

- **Capacité à diagnostiquer les problèmes d'encodage** : quand un fichier s'ouvre avec des caractères incompréhensibles, vous saurez analyser la cause du point de vue de l'encodage, au lieu de simplement penser « le fichier est corrompu »
- **Conscience interplateforme** : lors des échanges de données, savoir pourquoi le format d'encodage et l'ordre des bytes sont importants
- **Vision globale du codage** : comprendre comment l'ordinateur représente tout avec des 0 et des 1 — du texte aux images jusqu'aux objets complexes
- **Fondamentaux pour la suite** : bases pour les protocoles réseau, les formats de fichiers et les techniques de sérialisation

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Encodage des caractères | ASCII, UTF-8, GBK |
| **Chapitre 2** | Stockage des données | Binaire, endianness |
| **Chapitre 3** | Transmission des données | Sérialisation, compression |

Avant de commencer, nous devons clarifier un fait physique souvent ignoré par les débutants :

L'ordinateur est en réalité extrêmement « rigide ». Il ne connaît pas les caractères chinois, ne distingue pas les couleurs, et ne comprend pas les chansons.

Sa base est constituée d'innombrables minuscules interrupteurs à semi-conducteurs, **qui ne peuvent faire qu'une chose encore et encore : déterminer « courant activé (1) » ou « courant désactivé (0) »**.

Puisque l'ordinateur ne connaît que 0 et 1, comment lui faire afficher des images colorées et des textes complexes ?

La réponse est : **convenir d'un « code secret »**.

Nous convenons avec l'ordinateur que si le signal électrique sous-jacent envoie la séquence `01000001`, il dessinera spécifiquement la lettre `A` sur l'écran ; s'il envoie une autre séquence, il affichera la couleur rouge.

Ce **processus de création et d'utilisation d'un code secret pour la traduction mutuelle s'appelle « l'encodage (Encoding) »**.

Une fois compris ce point de départ logique — « tout dans l'ordinateur est fondamentalement du code » — vous comprendrez instantanément le phénomène le plus couramment rencontré : les caractères illisibles (Mojibake).

---

## 0. Introduction : Principe de l'encodage des données

Imaginez : vous recevez un fichier important d'un collègue, vous double-cliquez pour l'ouvrir, et tout ce que vous voyez est une série de caractères étranges comme « 浣犲ソ » ou « ä½ å¥½ ».

Intuitivement, vous pensez sûrement : le fichier a-t-il été endommagé lors de l'envoi ? Y a-t-il eu une perte de paquets ?

En réalité, dans la grande majorité des cas prétendument de « fichiers corrompus », la vérité est unique : **votre ordinateur n'a pas trouvé la bonne règle de lecture**.

Essayez par vous-même :

Dans le simulateur ci-dessous, essayez de basculer entre différents « codes de déchiffrement » pour lire la même séquence d'octets sous-jacente.

<GarbledTextDemo />

**Compréhension clé : des codes non alignés**

Les octets (séquences de 0 et 1) n'ont pas de sens absolu en eux-mêmes. Ce sont les **règles d'encodage** établies par l'homme qui leur donnent un sens.

C'est comme une séquence de code Morse « di-di-dah » : si vous la cherchez dans le code télégraphique chinois, vous obtiendrez un caractère ; si vous la cherchez dans le code militaire américain, vous en obtiendrez un autre.

**L'expéditeur a traduit les caractères chinois en nombres avec le code UTF-8 et vous les a envoyés. Si vous utilisez obstinément le code GBK pour interpréter ces nombres, le résultat sera évidemment une série de caractères illisibles.**

Pour comprendre complètement pourquoi des données non endommagées deviennent illisibles, nous devons connaître la chaîne complète du traitement des données. C'est-à-dire la « vie » des données : **encodage**, **stockage**, **transmission**.

---

## 1. Présentation de l'encodage des données

Pour faire simple :

> **L'encodage des données (Encoding)**, c'est créer un « dictionnaire de traduction bidirectionnel » qui mappe les informations complexes et diverses du monde réel (texte, couleurs, sons) en règles de 0 et de 1 que l'ordinateur peut comprendre.

### 1.1 Principe de l'encodage des caractères : d'ASCII au code universel

Chaque fois que nous tapons un message dans WeChat, à chaque touche enfoncée, l'ordinateur effectue secrètement une action : **la substitution par consultation de table**.

**Phase 1 : Le petit monde d'ASCII**

Aux débuts de l'informatique, les Américains pensaient que le monde ne comptait que 26 lettres, des chiffres et quelques signes de ponctuation. Ils ont donc créé un code secret très fin appelé **le code ASCII**.

Il ne définissait que 128 symboles, par exemple le nombre `65` représente la lettre majuscule `A`. Comme il y avait peu de caractères, **1 octet (Byte = 8 bits)** avec ses 256 combinaisons possibles était largement suffisant.

**Phase 2 : L'ère des codages fragmentés**

Plus tard, l'ordinateur s'est répandu dans le monde entier. On a découvert : **les caractères chinois se comptent par dizaines de milliers, le japonais a ses syllabaires — tout cela ne tient pas dans 1 octet !**

La Chine a donc créé le code GBK (2 octets par caractère), le Japon a créé Shift_JIS... le monde a sombré dans le chaos. Une page web créée en Chine et envoyée à un client américain s'affichait en caractères illisibles sur son ordinateur sans dictionnaire GBK.

**Phase 3 : L'unification sous Unicode (le code universel)**

Finalement, les grands de l'informatique se sont réunis et ont décidé : « Arrêtons de faire chacun dans notre coin et créons un super dictionnaire qui contient tous les symboles de la planète ! » C'est le célèbre **Unicode (le code universel)**. Il attribue à chaque caractère du monde — même à chaque emoji que vous utilisez — un numéro unique.

Et **UTF-8**, que vous entendez souvent, est la « règle de stockage » la plus populaire pour le dictionnaire Unicode. Son point le plus intelligent : il est **à longueur variable** — 1 octet pour l'anglais, 3 octets pour le chinois, très économe en espace.

Essayez par vous-même :

Dans le champ de saisie ci-dessous, tapez quelques caractères chinois, anglais ou emojis (par exemple : `你好 Hello 🎉`) et voyez comment l'ordinateur « consulte la table » pour occuper de l'espace.

<CharacterEncodingExplorer />

**Découverte surprenante** :

- Une lettre anglaise occupe seulement **1 octet** en UTF-8.
- Un caractère chinois occupe généralement **3 octets**.
- Un emoji (🎉) nécessite pas moins de **4 octets** !

> **Le saviez-vous ?** Pourquoi, à longueur égale, un SMS en anglais peut contenir beaucoup plus de texte qu'un SMS en chinois ? Parce que dans la séquence de signaux sous-jacente, la taille physique d'un caractère chinois est trois fois celle d'une lettre anglaise !

### 1.2 Principe de l'encodage des images et de l'audio

Le texte peut être traduit par consultation de table. Mais le sourire de la Joconde, ou une chanson ? Comment deviennent-ils des 0 et des 1 ?

La méthode est la même : **découper et mapper**.

* **Encodage des images** :
  Si vous zoomez à l'infini sur une photo, elle est en réalité composée de millions de petits carrés lumineux (pixels). Il suffit d'attribuer un numéro à chaque couleur (par exemple `#FF0000` pour le rouge), puis de stocker les numéros de millions de carrés — la photo devient un nombre.

  Essayez par vous-même : survolez les petites cases du canevas de gauche et voyez comment les couleurs de l'image sont mappées en codes hexadécimaux.
  <ImageEncodingDemo />

* **Encodage audio** :
  Le son est essentiellement une onde de vibration de l'air. Si nous mesurons la hauteur de cette vague 44100 fois par seconde (échantillonnage) et enregistrons les valeurs de hauteur, l'onde sonore continue devient un tableau discret de nombres.

  Essayez par vous-même : faites glisser le curseur et voyez comment une onde sonore analogique continue est « découpée » en audio numérique.
  <AudioEncodingDemo />

---

## 2. Principe du stockage des données

Une fois les données encodées, elles sont prêtes à être envoyées à quelqu'un d'autre. Mais avant cela, elles doivent être placées sur un support physique de l'ordinateur. Cela nous confronte à une loi hardware incontournable.

Vous pourriez penser : **« Puisqu'il faut les stocker, pourquoi ne pas tout mettre sur le support le plus rapide ? »**

Dans le monde du hardware, cependant, il y a toujours une malédiction : **plus le support de stockage est rapide, plus il coûte cher à fabriquer et plus sa capacité est faible.**

Pour obtenir l'expérience informatique la plus rapide possible avec le moins d'argent possible, les informaticiens ont conçu la **hiérarchie de stockage** (la pyramide de stockage).

Essayez par vous-même :

Cliquez sur les différents niveaux de la pyramide pour voir comment un ordinateur moderne optimise ses ressources.

<StoragePyramidDemo />

**Compréhension clé : la philosophie du gestionnaire de l'entrepôt qu'est le système d'exploitation**

Il n'existe pas de mémoire parfaite. C'est pourquoi le système d'exploitation (comme Windows, macOS) fonctionne comme un gestionnaire d'entrepôt extrêmement intelligent et infatigable :

1. Il entasse des quantités massives de films et de jeux dans l'entrepôt lent mais spacieux (peu coûteux) — **le SSD ou le disque dur**.
2. Quand vous voulez jouer, il se dépêche de charger les fichiers de textures haute définition correspondants depuis le disque vers l'établi ultra-rapide mais de capacité limitée — **la mémoire vive (RAM)**.
3. Quand vous fermez le jeu, il vide la mémoire pour libérer l'établi pour d'autres fichiers.

> **Explication** : Quand vous jouez à un grand jeu en monde ouvert et que les changements de scène provoquent de longs écrans noirs (écrans de chargement), c'est essentiellement parce que l'entrepôt du disque est trop lent et que le manutentionnaire (le système) s'évertue à transférer les données de la carte suivante vers l'établi de la mémoire.

---

## 3. Présentation de la transmission des données

Les données sont encodées et stockées en mémoire — il est maintenant temps de les envoyer à un ami.

> **La transmission des données**, c'est le processus par lequel les signaux électriques (ou optiques) représentant des 0 et des 1 sont acheminés, via des câbles réseau, des câbles ou des ondes radio, de manière précise et intacte d'une machine à une autre.

### 3.1 Principe de la transmission matérielle et locale

À l'intérieur du boîtier ou entre deux ordinateurs très proches, nous sommes confrontés à un **défi purement physique**.

La première idée de beaucoup de monde est : « Un fil envoie un signal à la fois — si j'en mets 8 côte à côte, la vitesse sera multipliée par 8 ! »
C'était l'idée de la **transmission parallèle** utilisée auparavant pour brancher les disques durs.

Cependant, aujourd'hui les ports Type-C des téléphones, les ports USB externes et les interfaces PCIe internes de la carte mère utilisent tous exclusivement la **transmission série (Serial, un seul canal principal pour les données)**.

Essayez par vous-même :
Comparez les animations de transmission série et parallèle.

<DataTransmissionDemo />

**Principe de prédominance de la transmission série**

À basse vitesse, 8 fils sont effectivement meilleurs. Mais quand nous devons envoyer des milliards de signaux par seconde, des problèmes apparaissent :
Les faibles courants sur les fils parallèles génèrent de puissantes ondes électromagnétiques qui s'interfèrent mutuellement (diaphonie / Crosstalk) ; et il est physiquement impossible de garantir que 8 signaux envoyés simultanément arriveront **exactement en même temps** à la ligne d'arrivée. Si un seul fil est légèrement plus lent en raison d'impuretés de matériau, les 8 bits assemblés en un mot seront complètement désordonnés.

Plutôt que de dépenser des sommes astronomiques pour équilibrer 8 pistes, mieux vaut concentrer toutes les ressources techniques sur un seul véhicule de course et le pousser à la vitesse de la lumière. C'est la vérité physique derrière la victoire mondiale des interfaces série.

### 3.2 Principe de la transmission réseau étendue

Et si vos données ne sont pas destinées à une carte graphique à un centimètre dans le boîtier, mais à un serveur américain de l'autre côté de l'océan ?

Un câble continu est impossible. Les données doivent traverser des câbles en fibre optique, des stations sous-marines et d'innombrables routeurs vétustes. Le défi n'est plus la limite physique, mais le **défi de la tolérance aux fautes et de la préservation des données**.

Quand vous envoyez une vidéo de 1 Go via WeChat, la logique sous-jacente ressemble à un déménagement international — vous ne pouvez pas simplement jeter le conteneur entier à la Poste.

1. **Paquetisation (Packetization)** : Le réseau découpe la vidéo en dizaines de milliers de « paquets de données » de la taille d'une enveloppe (généralement 1500 octets).
2. **Somme de contrôle (Checksum)** : Pour éviter qu'un câble sous-marin mordu par un requin ne transforme un `0` en `1`, le système calcule avant l'envoi, à l'aide d'une formule mathématique complexe, une « somme de contrôle » qu'il colle sur l'enveloppe.
3. **Renvoi et accusé de réception TCP** : Le destinataire reçoit l'enveloppe et recalcule lui-même la somme de contrôle. Si elle ne correspond pas (dommage en cours de route), ou s'il constate que la séquence passe du numéro 31 directement au 33 (perte de paquet), il crie sur le réseau : **« Je n'ai pas reçu le numéro 32, veuillez le renvoyer ! »**

C'est précisément grâce à ce mécanisme extrêmement rigoureux de découpage et de vérification des paquets appelé **TCP (Transmission Control Protocol)** au niveau le plus bas que, même si vous téléchargez un fichier WeChat depuis un sous-sol ou avec un WiFi extrêmement instable pendant une demi-heure, au moment où le téléchargement se termine, le fichier est garanti à 100 % intact et sans aucune corruption.

---

## 4. Cas pratique : le processus complet de la photo au partage sur les réseaux sociaux

Nous avons abordé séparément « comment traduire en nombres (encodage) », « où stocker (stockage) » et « comment voyager sans perte (transmission) ».

Maintenant, assemblons ces briques et suivons en immersion une opération des plus banales : **prendre une photo et la sauvegarder automatiquement dans le cloud**.

Dans la seconde où vous appuyez sur le déclencheur, une bataille numérique d'une ampleur titanesque fait déjà rage à l'intérieur de votre téléphone.

Essayez par vous-même :

Cliquez sur « Exécuter cette étape » et suivez le voyage périlleux et complet de ces données.

<PhotoUploadJourneyDemo />

---

## 5. Glossaire

En lisant d'autres documents, vous pourriez rencontrer le jargon suivant. Voici un tableau de référence rapide :

| Terme / Abréviation | Traduction française | Explication simple |
| :--- | :--- | :--- |
| **Bit (b)** | Bit | La plus petite unité du monde informatique, ne peut être que 0 ou 1. |
| **Byte (B)** | Octet | 8 Bits regroupés forment un octet. C'est l'unité de mesure fondamentale de la taille des fichiers. |
| **Character Set** | Jeu de caractères | Comme la « table des matières d'un dictionnaire » — définit qu'un caractère existe, sans préciser comment il est stocké sur le disque. |
| **Encoding** | Encodage | La « règle de stockage » concrète, qui détermine à quels octets correspond un caractère du dictionnaire (ex. UTF-8). |
| **RAM** | Mémoire vive / RAM | Un établi extrêmement rapide mais effacé à la mise hors tension. Les 8 Go / 16 Go de votre téléphone désignent ceci. |
| **SSD** | SSD (disque à semi-conducteurs) | L'entrepôt moderne de l'ordinateur pour la conservation permanente des données, basé sur des puces flash, des dizaines de fois plus rapide que les anciens disques durs. |
| **Serial / Parallel** | Série / Parallèle | Série : un canal avec les données qui se succèdent rapidement ; Parallèle : plusieurs canaux avançant simultanément (mais inadapté aux très hautes fréquences). |
| **Checksum** | Somme de contrôle | Un code de vérification joint lors de la transmission. Le destinataire le recalcule — s'il correspond à celui indiqué sur le paquet, tout est en ordre. |
| **TCP** | Protocol de contrôle de transmission (TCP) | La pierre angulaire d'Internet. Responsable du découpage des gros fichiers, de l'apposition de numéros de séquence et du renvoi des paquets perdus, garantissant une livraison à 100 % intacte. |

---

## Résumé

Les nombreuses questions soulevées au début de l'article trouvent désormais leur réponse du point de vue des fondamentaux du système :

- **Pourquoi le même fichier devient-il illisible quand vous le recevez ?**
  Les données ne sont pas corrompues — votre lecteur a simplement utilisé le mauvais code secret (problème d'encodage).

- **Pourquoi la plupart des câbles derrière les ordinateurs modernes sont-ils un petit câble Type-C, pourtant plus rapide que les câbles beaucoup plus larges d'autrefois ?**
  Parce qu'avant, plusieurs charrettes avançaient lentement côte à côte et se heurtaient facilement (parallèle), tandis qu'aujourd'hui un train à grande vitesse file sur une voie dédiée (série).

- **Pourquoi les grands jeux affichent-ils de longs écrans noirs lors du chargement des scènes ?**
  Parce qu'ils doivent transférer frénétiquement des fichiers de plusieurs dizaines de Go depuis le disque lent (zone de stockage) vers la mémoire rapide mais coûteuse (établi principal).

L'essence de l'ordinateur est en fait très simple :

**Ce n'est rien d'autre qu'une machine douée pour « traduire (encoder) » toutes les images et tous les textes, les « conserver (stocker) » sur une puce de silicium, puis les « expédier (transmettre) » découpés en impulsions électriques.**

Comprendre ce cycle perpétuel, c'est vraiment tenir la clé qui ouvre la porte des principes fondamentaux de l'informatique.
