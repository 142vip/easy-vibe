# Introduction : Collecte d'événements et tracking utilisateur

::: tip 🎯 Problème abordé dans ce chapitre
**Comment savoir ce que les utilisateurs font dans notre application ?**

Imaginez que vous teniez un salon de thé. Vous pouvez vous tenir derrière le comptoir et observer chaque client directement : combien de temps regardent-ils le menu avant de commander ? Quelle boisson ont-ils choisie ? Hésitent-ils puis partent sans rien acheter ?

Mais si votre « boutique » est une application mobile ou un site web, vous ne pouvez pas voir directement les actions des utilisateurs. C'est là qu'intervient une solution technique : « enterrer » des points d'enregistrement aux endroits clés de l'application pour capturer automatiquement chaque action de l'utilisateur. C'est ce qu'on appelle l'**Event Tracking**.

Le terme « tracking » peut sembler technique, mais l'idée centrale est simple : **placer un « enregistreur » là où l'utilisateur est susceptible d'agir, et noter ce qu'il fait.**

Ce chapitre explique le processus en quatre étapes :

1. **Choisir la méthode de collecte** — Décider où placer les enregistreurs et comment
2. **Concevoir le format des données** — Déterminer quelles informations chaque enregistrement doit contenir
3. **Transmission et mise en cache** — Envoyer les enregistrements du téléphone de l'utilisateur au serveur en toute sécurité
4. **Nettoyage et chargement** — Trier les données, éliminer les doublons et les erreurs, puis les stocker en base de données
:::

---

## 1. Choisir la méthode de collecte — Où placer les collecteur

**Objectif** : Décider avec quelle méthode enregistrer les actions des utilisateurs.

Un exemple : le chef de produit veut savoir « combien d'utilisateurs ont cliqué sur le bouton d'achat ». Pour répondre à cette question, le développeur doit ajouter une logique d'enregistrement dans le code du « bouton d'achat » — chaque fois qu'un utilisateur clique sur ce bouton, un enregistrement est automatiquement créé.

Mais il y a un choix à faire : **placer des enregistreurs uniquement aux endroits importants** (par exemple n'enregistrer que « achat » et « inscription »), ou bien **placer des enregistreurs partout** (enregistrer chaque clic, chaque glissement, chaque temps de passage) ?

Différents choix correspondent à différentes approches de tracking.

<DataTrackingDemo tab="methods" />

**💡 Les trois principales méthodes de tracking**

Il existe trois approches courantes dans le secteur, chacune avec ses avantages et ses inconvénients :

**Méthode 1 : Tracking par code (Code Tracking) — Enregistrement manuel précis**

Le développeur spécifie manuellement dans le code : quand l'utilisateur effectue une action donnée, un enregistrement est créé.

Par analogie : c'est comme placer une personne dédiée à la caisse du salon de thé, qui note uniquement « qui a acheté quoi et combien a été payé ». Les informations enregistrées sont très détaillées et précises.

- *Avantage* : Permet d'enregistrer des informations métier très détaillées, comme le coupon utilisé par l'utilisateur ou le solde du compte
- *Inconvénient* : Chaque nouveau point d'enregistrement nécessite que le développeur écrive du code, teste et publie une nouvelle version — un processus long

**Méthode 2 : Tracking visuel (Visual Tracking) — Enregistrement par sélection au clic**

Pas besoin d'écrire du code. Le système fournit un outil visuel qui permet à l'équipe opérationnelle de « sélectionner » directement sur l'interface les boutons ou zones à surveiller, et le système commence automatiquement à enregistrer.

Par analogie : c'est comme si, sur l'image de vidéosurveillance du salon de thé, vous pouviez sélectionner avec la souris la « zone de la caisse » et le système commence automatiquement à compter le flux de personnes dans cette zone.

- *Avantage* : Pas besoin de l'intervention d'un développeur ; l'équipe opérationnelle peut configurer elle-même, très efficace
- *Inconvénient* : Ne peut enregistrer que les actions d'interface comme « ce que l'utilisateur a cliqué » ; impossible d'enregistrer des données métier approfondies comme le « montant de la commande »

**Méthode 3 : Tracking complet (Auto Tracking) — Tout enregistrer automatiquement**

On intègre un SDK (une sorte de « boîte à outils ») dans l'application, qui enregistre automatiquement toutes les actions de l'utilisateur : chaque clic, chaque glissement, le temps passé sur chaque page.

Par analogie : c'est comme installer des caméras dans chaque recoin du salon de thé pour enregistrer chaque geste des clients.

- *Avantage* : Aucune action n'est manquée, couverture la plus complète
- *Inconvénient* : Le volume de données est énorme, dont beaucoup sont des informations inutiles (comme les glissements inconscients de l'utilisateur) qui nécessitent beaucoup d'efforts de filtrage et de nettoyage par la suite

**Résumé de cette étape** : Une fois la méthode de tracking choisie, l'application est capable « d'enregistrer les actions des utilisateurs ».

**Mais un nouveau problème se pose** : l'enregistreur peut capturer les actions, mais si chaque enregistreur utilise un format différent (l'un écrit « utilisateurID », l'autre « userID », un troisième ne l'enregistre pas du tout), il sera impossible d'analyser les données de manière uniforme. Il faut donc ensuite définir un format d'enregistrement unifié.

---

## 2. Concevoir le format des données — Que doit contenir chaque enregistrement

**Prérequis** : Nous avons choisi la méthode de tracking (par exemple le tracking par code) et l'application peut capturer les actions des utilisateurs.

**Objectif de cette étape** : Définir un « modèle d'enregistrement » unifié pour que tous les enregistrements de tracking aient un format cohérent.

**Pourquoi un format unifié est-il nécessaire ?** Imaginez : trois employés du salon de thé notent simultanément les ventes. L'un écrit « Jean a acheté un bubble tea 5 € », l'autre écrit « 5, thé, bubble », le troisième écrit « 1 bubble tea ». En fin de mois, ces enregistrements aux formats totalement différents seront un cauchemar à consolider. C'est pourquoi nous avons besoin d'un « formulaire d'enregistrement » unifié qui spécifie les champs obligatoires de chaque enregistrement.

<DataTrackingDemo tab="model" />

**💡 Principe clé : Le modèle d'enregistrement 4W1H**

Quelle que soit l'action enregistrée, chaque donnée doit répondre aux cinq questions suivantes (en abrégé 4W1H) :

**Who — Qui l'a fait ?**

Nous devons savoir quel utilisateur a généré cet enregistrement.

- Si l'utilisateur est connecté, on utilise son ID de compte (par ex. `user_id: "jean123"`)
- Si l'utilisateur n'est pas connecté, on utilise l'identifiant unique de l'appareil (par ex. le numéro de série du téléphone), pour pouvoir au moins distinguer « les actions proviennent du même appareil »

**When — Quand l'a-t-il fait ?**

On enregistre l'heure précise de l'action, à la milliseconde près.

Un détail ici : si votre application a des utilisateurs internationaux, 15h00 heure de Paris et 15h00 heure de New York sont séparées de 6 heures. Pour éviter la confusion, toutes les heures sont converties en UTC (temps universel coordonné).

**Where & How — Dans quel environnement l'a-t-il fait ?**

Cette partie enregistre l'environnement appareil et réseau au moment de l'action, appelé **attributs communs**. Ils sont dits « communs » car ces informations sont automatiquement jointes quelle que soit l'action de l'utilisateur. Par exemple :

- Modèle d'appareil : iPhone 15 / Samsung Galaxy S24
- Type de réseau : WiFi / 5G / 4G
- Version de l'app : v1.2.3
- Système d'exploitation : iOS 18 / Android 15

La valeur de ces informations : si un bug est découvert uniquement sur un modèle spécifique, les attributs communs aident à localiser rapidement le problème.

**What — Qu'a-t-il fait exactement ?**

Cette partie enregistre les détails métier spécifiques de l'action, appelés **attributs personnalisés**. Différentes actions nécessitent différentes informations. Par exemple :

- L'utilisateur clique sur « Ajouter au panier » : il faut enregistrer le nom du produit, le prix du produit, la quantité
- L'utilisateur finalise un paiement : il faut enregistrer le montant de la commande, le mode de paiement, le numéro du coupon

**Résumé de cette étape** : Grâce au modèle 4W1H, nous transformons chaque action de l'utilisateur en un enregistrement de données au format unifié. Dans l'implémentation technique, cet enregistrement est généralement stocké au format JSON (JSON est un format de données universel ; le composant interactif ci-dessus montre à quoi il ressemble).

**Mais un autre problème se pose** : le format des données est maintenant unifié, mais si le nombre d'utilisateurs est important (par exemple lors d'une promotion, des dizaines de milliers d'enregistrements peuvent être générés par seconde), le téléphone de l'utilisateur ne peut pas envoyer une requête réseau à chaque enregistrement — ce serait trop gourmand en batterie et en données, et le serveur ne pourrait pas supporter la charge. Il faut donc concevoir un mode de transmission plus intelligent.

---

## 3. Transmission et mise en cache — Comment envoyer les données en toute sécurité au serveur

**Prérequis** : Chaque action de l'utilisateur a été enregistrée sous forme de données JSON au format unifié.

**Objectif de cette étape** : Transmettre ces données du téléphone (ou navigateur) de l'utilisateur à notre serveur de manière fiable, même en cas de mauvaise connexion réseau, sans perte de données.

**Pourquoi ne pas envoyer directement ?** Si chaque enregistrement généré déclenche immédiatement une requête réseau, c'est comme courir à la poste après chaque lettre écrite — extrêmement inefficace. Une approche plus raisonnable : rassembler plusieurs lettres et les envoyer en une seule fois.

<DataTrackingDemo tab="pipeline" />

**💡 Principe clé : Les trois garanties de la transmission des données**

Les données doivent traverser trois garanties pour aller du téléphone de l'utilisateur au serveur, assurant à la fois l'efficacité et l'absence de perte de données :

**Première garantie : Accumuler puis envoyer (agrégation par lot)**

Le SDK (boîte à outils de tracking) n'envoie pas chaque enregistrement dès qu'il est créé, mais le stocke temporairement dans la mémoire du téléphone. Lorsqu'un certain nombre est atteint (par ex. 30) ou qu'un certain délai est dépassé (par ex. 5 secondes), le lot est empaqueté et envoyé en une seule fois.

Par analogie : vous n'envoyez pas un colis pour chaque article acheté en ligne, vous en regroupez plusieurs — gain de temps et d'effort. Pour le téléphone, cela réduit le nombre de requêtes réseau et économie batterie et données.

**Deuxième garantie : Sécurisé même hors ligne (stockage local)**

Dans l'ascenseur ou le tunnel de métro, le téléphone perd souvent le signal réseau. Si les données ne sont qu'en mémoire vive, elles disparaissent quand l'utilisateur ferme l'application.

C'est pourquoi le SDK stocke les données non encore envoyées dans le stockage local du téléphone (comme mettre d'abord les lettres dans un tiroir). Quand le réseau revient, les données sont automatiquement renvoyées. Ainsi, même en cas de coupure brève, aucune donnée n'est perdue.

**Troisième garantie : Ne pas submerger le serveur (file de messages)**

Une fois arrivées au serveur, les données ne sont pas écrites directement dans la base de données. Pourquoi ? Car lors des pics comme les promotions, des dizaines de milliers de données peuvent affluer simultanément, et la base de données pourrait planter si elle devait tout traiter directement.

La solution est d'ajouter un « tampon » au milieu, techniquement appelé **file de messages** (un outil courant est Kafka). Son rôle est similaire au système de tickets de restaurant aux heures d'affluence : les clients (données) attendent dans une file, et la cuisine (base de données) traite les commandes à son rythme sans être submergée par l'afflux simultané.

**Résumé de cette étape** : Grâce aux trois garanties « accumuler puis envoyer → stockage local hors ligne → tampon par file de messages », les données sont arrivées en toute sécurité sur le serveur.

**Mais un dernier problème** : après reconnexion, les données sont automatiquement renvoyées, ce qui peut entraîner l'envoi en double du même enregistrement. Si ce n'est pas traité avant le stockage en base, les données seront dupliquées (par exemple une commande de 100 € comptée deux fois, gonflant artificiellement le chiffre d'affaires). Il faut donc « nettoyer » les données.

---

## 4. Nettoyage et chargement — Trier les données, éliminer les « données sales »

**Prérequis** : Les données sont arrivées en toute sécurité sur le serveur via le pipeline de transmission.

**Objectif de cette étape** : Avant le stockage définitif en base de données, faire un « bilan de santé » — éliminer les doublons, corriger les formats défectueux et s'assurer que les données finalement stockées sont propres et exactes.

**Pourquoi nettoyer ?** Comme quand vous recevez un carton de colis : vérifier s'il y a des doublons, des erreurs d'expédition, des emballages endommagés. Pour les données, c'est pareil — vérifier et trier avant de stocker en base.

Ce processus est techniquement appelé **ETL**, acronyme de trois mots anglais :
- **E**xtract (Extraction) : Extraire les données de la file de messages
- **T**ransform (Transformation) : Vérifier et corriger les formats de données
- **L**oad (Chargement) : Écrire les données nettoyées dans la base de données

<DataTrackingDemo tab="overview" />

**💡 Principe clé : Les deux actions essentielles du nettoyage des données**

**Action 1 : Dédoublonnage — Éliminer les enregistrements en double**

Comme mentionné précédemment, le SDK renvoie automatiquement les données après reconnexion, ce qui peut envoyer le même enregistrement plusieurs fois. Comment identifier les doublons ?

La méthode est simple : lors de l'empaquetage côté client, chaque enregistrement reçoit un identifiant unique mondial (appelé `dedup_id`, similaire à un numéro de suivi de colis). Avant de stocker les données, le serveur vérifie si cet identifiant existe déjà — s'il existe, c'est un doublon, il est rejeté.

**Action 2 : Validation et uniformisation des formats — Corriger les enregistrements non standard**

L'application est constamment mise à jour, et les codes de tracking de différentes versions peuvent présenter de légères différences. Par exemple :

- L'ancienne version nommait le champ ID utilisateur `userId`, la nouvelle utilise `user_id`
- Certains enregistrements ont un timestamp manifestement incorrect (par exemple 1970)
- Certaines valeurs de champs sont ininterprétables

À cette étape, le système applique des règles de transformation pour traiter ces problèmes de manière uniforme : les noms de champs incohérents sont alignés, les enregistrements aux timestamps anormaux sont rejetés, les valeurs ininterprétables sont marquées `unknown`.

**Résumé de cette étape** : Après dédoublonnage et validation des formats, les données sont écrites sous forme propre et unifiée dans le **data warehouse** (une base de données spécialisée pour le stockage et l'analyse de grandes quantités de données ; ClickHouse et Hive en sont des exemples courants). Les analystes de données peuvent interroger ces données directement en SQL pour obtenir des résultats d'analyse fiables.

---

## Rétrospective du processus complet

Voici le résumé du processus en quatre étapes, de la collecte au chargement des données de tracking :

| Étape | Ce qui a été fait | Ce qui a été obtenu | Problème restant |
|------|----------|-----------|-------------|
| **1. Choisir la méthode de collecte** | Décider comment enregistrer les actions utilisateurs | L'application a la capacité d'enregistrer | Les formats de données des enregistreurs ne sont pas unifiés |
| **2. Concevoir le format des données** | Unifier le format d'enregistrement avec le modèle 4W1H | Chaque enregistrement est un JSON standard | En cas de volume important d'utilisateurs, l'envoi unitaire est impossible |
| **3. Transmission et mise en cache** | Envoi par lot, stockage hors ligne, tampon par file | Les données sont arrivées en toute sécurité sur le serveur | Les tentatives de renvoi peuvent causer des doublons |
| **4. Nettoyage et chargement** | Dédoublonnage, validation, uniformisation des formats | ✅ Données propres stockées dans le data warehouse | — |

---

## Conclusion

Quand un utilisateur clique sur un bouton dans une application, en surface ce n'est qu'un instantané. Mais en coulisses, un pipeline de données complet s'est déjà activé :

1. Le code de tracking capture ce clic et génère un enregistrement standard selon le modèle 4W1H
2. L'enregistrement est temporairement stocké localement sur le téléphone, puis envoyé en lot au serveur
3. Le serveur reçoit les données via une file de messages, puis procède au dédoublonnage et à la validation des formats
4. Finalement, une donnée propre et exacte est écrite dans le data warehouse

C'est le processus complet de l'event tracking. Il transforme les comportements épars et invisibles des utilisateurs en données structurées, interrogeables et analysables. Les chefs de produit peuvent comprendre quelles fonctionnalités les utilisateurs apprécient et où ils décrochent ; les équipes opérationnelles peuvent évaluer l'efficacité des campagnes ; les développeurs peuvent identifier dans quelle version un problème est apparu.

Ce système de « collecte → modélisation → transmission → nettoyage » est l'infrastructure de base de la prise de décision basée sur les données.
