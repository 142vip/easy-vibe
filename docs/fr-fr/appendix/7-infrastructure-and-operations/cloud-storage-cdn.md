# Principes : Stockage objet et réseau CDN
> 💡 **Guide d'apprentissage** : Cet article vous guidera tout au long d'une chaîne complète — du téléversement de fichiers au téléchargement par l'utilisateur. Vous découvrirez comment le stockage objet gère massivement les fichiers comme un « entrepôt intelligent », comment le CDN les achemine jusqu'à l'utilisateur comme un « réseau de relais de livraison », et quels « pièges » vous attendent entre les deux. Il est recommandé de connaître les bases des requêtes HTTP et de la résolution DNS.

Avant de commencer, nous vous recommandons de consolider quelques prérequis :

- **Flux des requêtes HTTP** : Vous pouvez lire [Que se passe-t-il quand on saisit une URL dans le navigateur](./web-basics/url-to-browser.md) pour comprendre la chaîne complète de requêtes.
- **Principe de résolution DNS** : Si vous n'êtes pas encore familier avec la résolution de noms de domaine, vous pouvez consulter le diagramme explicatif du [Flux de requêtes DNS](./deployment/dns-flow.md).

---

## 0. Introduction : pourquoi le téléversement et le téléchargement de fichiers sont-ils si « lents »

Imaginez ce scénario : vous téléversez une photo HD de 10 Mo sur une communauté d'images, et cela prend une demi-minute ; alors que votre ami à Pékin la télécharge en 2 secondes. Pourquoi la même fichier offre-t-elle une expérience si différente entre le téléversement et le téléchargement ?

Ou encore : votre site e-commerce lance une promotion pour le Double Onze, et la page produit est soudainement submergée par des millions de visites — le serveur s'effondre. La bande passante est-elle insuffisante ? Ou l'architecture est-elle mal conçue ?

Les réponses à ces questions se trouvent dans le **stockage objet** et le **CDN** — le « duo en or ».

---

## 1. Stockage objet : votre « entrepôt cloud intelligent »

### 1.1 Qu'est-ce que le stockage objet

Un système de fichiers traditionnel est comme votre armoire chez vous : les vêtements sont rangés par catégories (« hauts / pantalons / jupes ») et pour trouver une chemise, il faut ouvrir l'armoire → section hauts → compartiment chemises. Ce modèle « imbriqué en profondeur » devient extrêmement lourd quand le nombre de fichiers explose.

Le stockage objet, c'est comme la logistique moderne : chaque colis possède un numéro de suivi unique (clé de l'objet). Il suffit de donner ce numéro pour que le robot de l'entrepôt le retrouve parmi des millions de colis.

<ObjectStorageDemo />

**Comparaison des différences clés** :

| Dimension | Système de fichiers traditionnel | Stockage objet |
| :----------- | :--------------------- | :---------------------- |
| **Organisation** | Arborescence de répertoires | Paires clé-valeur plates |
| **Protocole d'accès** | POSIX (opérations fichiers locales) | HTTP/REST API |
| **Extensibilité** | Capacité limitée à une seule machine | Extension horizontale quasi illimitée |
| **Métadonnées** | Attributs de base (taille, date) | Métadonnées personnalisées riches |
| **Scénario type** | Documents de bureau locaux | Images/vidéos/sauvegardes/ressources statiques |

### 1.2 Concepts fondamentaux du stockage objet

#### Le Bucket : votre « zone d'entrepôt »

Le bucket est le conteneur de plus haut niveau du stockage objet, agissant comme un espace de noms indépendant. Tous les objets doivent être stockés dans un bucket.

**Règles de nommage** (exemple avec Alibaba Cloud OSS) :

- Globalement unique : ne peut pas être dupliqué chez tous les utilisateurs du fournisseur cloud
- Uniquement des lettres minuscules, des chiffres et des tirets
- Doit commencer et se terminer par une lettre minuscule ou un chiffre
- Longueur entre 3 et 63 caractères

**Conseil pratique** : une équipe avait créé des dizaines de buckets par ligne de métier, et la facture de fin de mois a été une surprise — chaque bucket a des frais minimum de stockage et de requêtes. Recommandation : planifier les buckets par combinaison « environnement + usage », par ex. `prod-static-assets`, `dev-backup-archive`.

#### L'Objet : votre « artefact de build de données »

L'objet est l'unité fondamentale du stockage, composé de trois parties :

1. **Clé (Key)** : l'identifiant unique de l'objet, comme un « numéro de suivi »
   - Exemple : `images/avatar/2024/user123.jpg`
   - Bien que cela ressemble à un chemin, c'est en réalité une simple chaîne de caractères

2. **Données (Data)** : le contenu de l'objet lui-même
   - Peut être n'importe quelle donnée binaire
   - La limite de taille dépend du fournisseur cloud (généralement jusqu'à 5 To par objet)

3. **Métadonnées (Metadata)** : informations supplémentaires décrivant l'objet
   - Métadonnées système : Content-Type, ETag, Last-Modified, etc.
   - Métadonnées personnalisées : par ex. `x-oss-meta-owner`, `x-oss-meta-project`

#### Contrôle d'accès : qui peut accéder à mon « entrepôt »

Le stockage objet offre plusieurs niveaux de contrôle des permissions :

| Niveau | Méthode de contrôle | Scénario type |
| :----------- | :------------------------ | :------------------------------ |
| **Niveau bucket** | Bucket Policy (stratégie de ressource) | Interdire tout accès externe, n'autoriser que certaines IP |
| **Niveau objet** | ACL (liste de contrôle d'accès) | Image publique, document privé |
| **Autorisation temporaire** | STS (service de jetons de sécurité) | Téléversement direct depuis le frontend, upload depuis mobile |

**Ligne rouge de sécurité** : ne jamais écrire AccessKey ID et AccessKey Secret dans le code frontend ! La bonne pratique est : le frontend demande des identifiants STS temporaires à votre backend, le backend vérifie l'identité et renvoie des identifiants temporaires avec une date d'expiration.

---

## 2. CDN : votre « réseau de livraison mondial »

### 2.1 Pourquoi un CDN est-il nécessaire

Imaginez que vous gérez une boutique en ligne dont le serveur est à Shenzhen. Un utilisateur à Pékin accède à vos images :

- **Sans CDN** : la requête va de Pékin → Hebei → Henan → Hubei → Hunan → Guangdong → Shenzhen, soit plus de 2 000 km, et 4 000 km aller-retour. La latence réseau seule prend des dizaines de millisecondes, et c'est pire en cas de congestion.

- **Avec CDN** : la requête va de Pékin directement au nœud CDN de Pékin (peut-être dans le datacenter China Unicom de Pékin). La distance passe de 2 000 km à 20 km, et la latence de 50 ms à 5 ms.

C'est la valeur fondamentale du CDN : **rapprocher le contenu de l'utilisateur**.

<CdnAccelerationDemo />

### 2.2 Architecture fondamentale du CDN

#### Nœuds edge : les « points relais » les plus proches de l'utilisateur

Les nœuds edge sont le niveau le plus proche de l'utilisateur dans le réseau CDN, généralement déployés dans :

- Datacenters d'opérateurs (China Unicom / China Telecom / China Mobile)
- Points d'échange Internet des grandes métropoles
- Carrefours stratégiques

**Principaux nœuds CDN en Chine** :

- Villes de premier rang : Pékin, Shanghai, Guangzhou, Shenzhen
- Villes de deuxième rang : Hangzhou, Nanjing, Chengdu, Wuhan, Xi'an
- International : Hong Kong, Singapour, Tokyo, Silicon Valley, Francfort

<EdgeNodeDistributionDemo />

#### Origine (Origin) : l'« entrepôt central » du contenu

L'origine est l'endroit où le CDN va chercher le contenu, qui peut être :

- Un stockage objet (OSS/COS/S3)
- Un serveur auto-hébergé (ECS/serveur physique)
- Un équilibreur de charge (SLB/CLB)

**Configuration clé** :

- **Host d'origine** : le nom de domaine / IP utilisé par le nœud CDN pour accéder à l'origine
- **Protocole d'origine** : HTTP ou HTTPS
- **Port d'origine** : 80, 443 ou port personnalisé

#### Nœuds intermédiaires : le « centre de dispatch régional »

Entre les nœuds edge et l'origine, le CDN comporte généralement un ou plusieurs niveaux de nœuds intermédiaires :

- **Nœuds d'agrégation** : regroupent les requêtes de plusieurs nœuds edge pour réduire la pression sur l'origine
- **Centres régionaux** : gèrent la distribution et la planification de contenu pour une grande région

Avantages de cette architecture à plusieurs niveaux :

1. **Réduction de la pression sur l'origine** : 1 000 nœuds edge peuvent ne générer que 10 requêtes vers l'origine
2. **Amélioration du taux de cache hit** : le contenu populaire est intercepté au niveau intermédiaire
3. **Isolation des pannes** : si une liaison tombe, basculement automatique vers un autre chemin

### 2.3 Le flux complet de l'accélération CDN

Suivons une requête utilisateur réelle :

<CachePolicyDemo />

**Étape 1 : Résolution DNS** (planification intelligente)

```
L'utilisateur saisit : cdn.example.com/image.jpg
↓
Le serveur DNS renvoie : l'IP du nœud CDN China Unicom Pékin (1.2.3.4)
```

La clé ici est le **DNS intelligent** : en fonction de l'opérateur, de la localisation géographique et de la charge des nœuds, il renvoie l'IP du nœud CDN optimal.

**Étape 2 : Recherche dans le nœud edge** (cache hit ?)

```
La requête arrive au nœud CDN China Unicom Pékin (1.2.3.4)
↓
Le nœud vérifie son cache local :
├─ Hit ? Renvoie directement le contenu ✓
└─ Miss ? Passe à l'étape suivante
```

**Étape 3 : Récupération depuis l'origine** (remontée niveau par niveau)

```
Le nœud edge n'a pas le contenu en cache
↓
Requête au nœud parent (par ex. centre régional Chine du Nord)
├─ Hit au nœud parent ? Renvoie le contenu
└─ Miss au nœud parent ? Continue vers le haut
    ↓
    Requête à l'origine
    ↓
    L'origine renvoie le contenu
```

**Étape 4 : Mise en cache et réponse** (plus rapide la prochaine fois)

```
Le contenu remonte la chaîne
↓
Chaque niveau met en cache une copie
↓
Finalement arrive à l'utilisateur
```

Ainsi, la prochaine fois qu'un utilisateur demandera le même fichier, il sera directement renvoyé depuis le nœud edge — ouverture quasi instantanée.

---

## 3. Du téléversement à l'accès : analyse complète de la chaîne

### 3.1 Les trois méthodes de téléversement de fichiers

<UploadProcessDemo />

#### Méthode 1 : Client → Serveur → Stockage objet (modèle traditionnel)

```
Navigateur → Votre serveur backend → Stockage objet
```

**Flux** :

1. L'utilisateur sélectionne un fichier et clique sur téléverser
2. Le fichier est d'abord téléversé vers votre serveur backend
3. Le backend reçoit le fichier complet, puis le transfère vers le stockage objet
4. Le résultat du téléversement est renvoyé à l'utilisateur

**Avantages** :

- Implémentation simple, contrôle total côté frontend et backend
- Possibilité de validation côté backend, conversion de format
- Journalisation des opérations sensibles, vérification des permissions

**Inconvénients** :

- **Double consommation de bande passante** : le téléversement de l'utilisateur utilise une première bande passante, le transfert du serveur en utilise une seconde
- **Pression sur le serveur** : les gros fichiers consomment beaucoup de mémoire et de CPU
- **Téléversement lent** : étape de transit supplémentaire, temps perçu plus long par l'utilisateur

**Scénario d'utilisation** : petits fichiers (<10 Mo), nécessité de traitement backend (compression d'images, ajout de filigrane), systèmes de gestion internes.

#### Méthode 2 : Téléversement direct du client vers le stockage objet (recommandé)

```
Navigateur ──────→ Stockage objet
        ↑
        Le backend ne fait que délivrer des identifiants temporaires
```

**Flux** :

1. L'utilisateur sélectionne un fichier, le frontend demande d'abord un « justificatif de téléversement » au backend
2. Le backend vérifie l'identité de l'utilisateur, demande au stockage objet un **identifiant STS temporaire** (avec date d'expiration)
3. Le backend renvoie l'identifiant temporaire au frontend
4. Le frontend utilise cet identifiant pour **téléverser directement le fichier vers le stockage objet**
5. Le stockage objet renvoie le résultat du téléversement, le frontend notifie le backend que « le téléversement est terminé »

**Avantages** :

- **Téléversement rapide** : pas d'étape intermédiaire, vitesse perçue maximale
- **Pression serveur réduite** : seul le traitement des identifiants, pas de flux de fichiers
- **Bande passante économisée** : un seul passage de téléversement
- **Sécurité renforcée** : les identifiants temporaires ont une date d'expiration, une fuite a un impact limité

**Inconvénients** :

- Implémentation un peu plus complexe, nécessite de comprendre STS et les mécanismes de signature
- Le frontend doit gérer le téléversement par fragments et la reprise
- Configuration CORS nécessaire

**Scénario d'utilisation** : téléversement de gros fichiers, contenu généré par les utilisateurs (UGC), besoins de téléversement hautement concurrent.

#### Méthode 3 : Téléversement par fragments + reprise (indispensable pour les gros fichiers)

```
Fichier vidéo de 10 Go
↓
Découpe en 1 000 fragments de 10 Mo
↓
Téléversement parallèle (5 fragments simultanés)
↓
Coupure réseau ! 600 fragments déjà envoyés
↓
Reprise de la connexion, reprise au fragment 601
↓
Tous les fragments envoyés, envoi d'une requête de « fusion »
```

**Pourquoi fragmenter ?**

| Scénario | Sans fragmentation | Avec fragmentation |
| :----------- | :---------------------- | :------------------- |
| **Instabilité réseau** | 99 % téléversé, coupure → tout recommencer | Seuls les fragments échoués sont retéléversés |
| **Vitesse de téléversement** | Monothread, lent | Multithread parallèle, rapide |
| **Empreinte mémoire** | Mettre en cache le fichier entier | Seul le fragment en cours est en cache |
| **Affichage de la progression** | Seulement 0 % et 100 % | Précis au fragment près |

**Spécifications de fragmentation par fournisseur** :

| Fournisseur | Taille max de fragment | Nombre max de fragments | Taille min de fragment |
| :------------- | :----------- | :--------- | :----------- |
| **Alibaba Cloud OSS** | 100 Mo | 10 000 | 100 Ko |
| **Tencent Cloud COS** | 5 Go | 10 000 | 1 Mo |
| **AWS S3** | 5 Go | 10 000 | 5 Mo (recommandé) |
| **Qiniu Cloud** | 100 Mo | 10 000 | 4 Mo |

### 3.2 Détail des stratégies de rappel d'origine CDN

<CachePolicyDemo />

#### Qu'est-ce que le « rappel d'origine »

Les nœuds edge du CDN mettent en cache le contenu de l'origine, mais quand :

- Le contenu demandé est accédé **pour la première fois**
- Le contenu en cache a **expiré (TTL dépassé)**
- Le cache a été **rafraîchi manuellement / préchargé**

Le nœud CDN doit demander le contenu le plus récent à l'**origine** — c'est ce qu'on appelle le « rappel d'origine » (fetch from origin).

#### Les trois modes de rappel d'origine

| Mode | Principe | Scénario d'utilisation | Avantages / Inconvénients |
| :-------------------- | :----------------------- | :------------------------ | :----------------------- |
| **Rappel direct** | Nœud CDN → Origine | L'origine a une IP publique et un trafic modéré | Simple, mais pression sur l'origine |
| **Rappel via origine intermédiaire** | Nœud CDN → Couche intermédiaire → Origine | Sites à fort trafic, architecture de cache multi-niveaux | Répartit la pression sur l'origine, architecture complexe |
| **OSS/COS comme origine** | Nœud CDN → Stockage objet | Ressources statiques, images, vidéos | Meilleure pratique, faible coût, bonnes performances |

#### Configuration pratique du rappel d'origine

**Scénario 1 : Stockage objet comme origine (recommandé)**

```
L'utilisateur accède à : cdn.example.com/images/photo.jpg
                    ↓
            Nœud edge CDN (Pékin)
                    ↓
            Miss, rappel d'origine
                    ↓
            Origine : bucket-name.oss-cn-beijing.aliyuncs.com
                    ↓
            Renvoie l'image, le CDN met en cache et répond à l'utilisateur
```

Paramètres de configuration clés :

- **Type d'origine** : domaine OSS/COS ou origine personnalisée
- **Protocole d'origine** : HTTP ou HTTPS (HTTPS recommandé)
- **Host d'origine** : Header Host utilisé pour accéder à l'origine
- **SNI d'origine** : Indication du nom du serveur lors du rappel HTTPS

**Scénario 2 : Équilibrage de charge multi-origines**

Quand une seule origine ne supporte plus la pression de rappel :

```
Nœud edge CDN
    ├─ Origine A (poids 50 %)
    ├─ Origine B (poids 30 %)
    └─ Origine C (poids 20 %)
```

Mode actif/passif :

```
Nœud edge CDN
    ├─ Origine principale A (tout le trafic quand elle est healthy)
    └─ Origine de secours B (bascule quand l'origine principale est en panne)
```

#### Bande passante de rappel vs bande passante CDN

Il y a une notion souvent source de confusion :

| Métrique | Définition | Relation de facturation |
| :--------------- | :---------------------- | :--------------------------- |
| **Bande passante CDN sortante** | Trafic du nœud CDN vers l'utilisateur | Généralement facturé au trafic dans les frais CDN |
| **Bande passante de rappel** | Trafic de l'origine vers le nœud CDN | Généralement facturé comme trafic sortant du stockage objet ou de l'origine |

**Astuces d'économie** :

- Augmenter le taux de cache hit (plus de requêtes servies depuis le cache, moins de rappels)
- Définir des durées de cache raisonnables (TTL)
- Utiliser la préchargement pour mettre en cache le contenu populaire avant l'afflux d'utilisateurs
- Activer « suivre les 301/302 » pour éviter les rappels inutiles

### 3.3 Configuration de la stratégie de cache

<CachePolicyDemo />

#### Clé de cache (Cache Key) : ce qui définit un « même fichier »

Comment le CDN détermine-t-il si deux requêtes doivent renvoyer la même copie en cache ? Grâce à la **clé de cache**.

**La clé de cache par défaut comprend généralement** :

- Le chemin URL (sans les paramètres de requête)
- Par exemple : `/images/photo.jpg`

**Scénario problématique** :

```
Utilisateur A demande : /images/photo.jpg?w=100&h=100  (vignette 100x100)
Utilisateur B demande : /images/photo.jpg?w=800&h=600  (grande image 800x600)
```

Si la clé de cache ne contient que le chemin, deux images de tailles différentes seront considérées comme le même fichier — d'où des incohérences.

**Solution : Règles de clé de cache personnalisées**

| Règle | Exemple | Effet |
| :------------------- | :------------------------ | :------------------------ |
| **Conserver certains paramètres de requête** | Conserver `w`, `h` | Cache séparé par taille |
| **Conserver tous les paramètres** | Tout conserver | Correspondance exacte |
| **Ignorer certains paramètres** | Ignorer `token`, `timestamp` | Les URLs avec horodatage peuvent hit le cache |
| **Inclure les headers** | Inclure `Accept-Language` | Contenu différent selon la langue |

**Exemple de configuration** (Alibaba Cloud CDN) :

```
Règle de clé de cache :
- Chemin URL : /images/*
- Paramètres de requête conservés : w, h, format
- Paramètres de requête ignorés : token, timestamp, utm_source
```

#### Durée de cache (TTL) : équilibrer la « fraîcheur » du contenu

Le TTL (Time To Live) détermine la durée pendant laquelle le contenu est mis en cache sur les nœuds CDN. Trop court → plus de rappels, coûts plus élevés. Trop long → le contenu mis à jour n'est pas visible par les utilisateurs.

**Recommandations de TTL par type de fichier** :

| Type de fichier | TTL recommandé | Raison |
| :---------- | :---------------------- | :----------------------------- |
| Pages HTML | 0-5 minutes | Mises à jour fréquentes, temps réel nécessaire |
| Fichiers JS/CSS | 1 an (avec hash dans le nom de fichier) | Le contenu ne change pas ; le hash change = cache invalidé |
| Images/vidéos | 7-30 jours | Faible fréquence de mise à jour, cache longue durée possible |
| Fichiers de polices | 1 an | Quasiment jamais modifiés |
| Réponses API | 0-5 minutes (selon le métier) | Exigences de fraîcheur des données |

**Bonne pratique : compatibilité ingénierie frontend + CDN** :

```javascript
// Configuration webpack/vite
output: {
  filename: 'js/[name]-[contenthash:8].js',
  chunkFilename: 'js/[name]-[contenthash:8].chunk.js',
}
```

Noms de fichiers générés : `app-a3f2b1c9.js`

- Contenu modifié → hash modifié → nouvelle URL → cache invalidé naturellement
- Contenu inchangé → hash inchangé → URL inchangée → cache longue durée

#### Rafraîchissement et préchargement du cache

**Rafraîchissement manuel (scénarios d'urgence)** :

Quand vous mettez à jour le contenu sur l'origine, mais que le cache CDN n'a pas encore expiré — les utilisateurs voient encore l'ancien contenu :

| Type de rafraîchissement | Effet | Durée | Scénario d'utilisation |
| :----------- | :--------------------- | :---------- | :----------- |
| **Rafraîchissement URL** | Invalide le cache pour l'URL spécifiée | 5-10 minutes | Mise à jour d'un seul fichier |
| **Rafraîchissement de répertoire** | Invalide tout le contenu du répertoire | 10-30 minutes | Mise à jour par lot |
| **Rafraîchissement complet** | Invalide tout le cache du domaine | 30+ minutes | Rollback d'urgence |

**Avertissement important** : le rafraîchissement invalide uniquement le cache — la prochaine requête rappellera l'origine pour récupérer le nouveau contenu. Ne faites pas de rafraîchissement massif aux heures de pointe, sinon l'origine risque d'être submergée.

**Préchargement (optimisation proactive)** :

Le rafraîchissement est réactif (le contenu a déjà changé). Le préchargement est proactif (mise en cache anticipée).

```
Scénario : demain à 10h, publication d'un article viral

Ce soir, soumettre une requête de préchargement :
- URL : https://cdn.example.com/articles/article-viral.html
- Portée : tous les nœuds edge nationaux

Effet :
Demain à 10h, quand les utilisateurs accéderont au contenu, il sera déjà en cache sur les nœuds edge
→ Zéro latence de rappel, ouverture quasi instantanée
```

---

## 4. Planification du trafic : diriger l'utilisateur vers le nœud « le plus proche »

<TrafficSchedulingDemo />

### 4.1 Planification DNS intelligente

Résolution DNS traditionnelle :

```
L'utilisateur demande : quelle est l'IP de cdn.example.com ?
Le DNS répond : 1.2.3.4 (fixe)
```

Résolution DNS intelligente :

```
Utilisateur (Pékin Unicom) demande : quelle est l'IP de cdn.example.com ?
DNS intelligent : laissez-moi vérifier... le nœud CDN Pékin Unicom est 1.2.3.4

Utilisateur (Shanghai Telecom) demande : quelle est l'IP de cdn.example.com ?
DNS intelligent : le nœud CDN Shanghai Telecom est 5.6.7.8
```

**Dimensions de planification** :
| Dimension | Description | Effet |
| :--- | :--- | :--- |
| **Localisation géographique** | Répartition par province/ville/pays | Accès au plus proche, latence réduite |
| **Opérateur** | Unicom/Telecom/Mobile/BGP | Transmission au sein du même opérateur, évite le passage inter-réseaux |
| **Charge des nœuds** | CPU/bande passante/QPS en temps réel | Éviter les nœuds surchargés |
| **Santé des nœuds** | Détection de disponibilité | Exclusion automatique des nœuds en panne |
| **Facteur coût** | Différence de prix de bande passante | Équilibrer performance et coût |

### 4.2 HTTP DNS et connexion IP directe

Le DNS traditionnel a un problème : **le détournement DNS et la latence de résolution**.

**Solution HTTP DNS** :

```
Client → contourne le DNS système → interroge directement le service HTTP DNS (par ex. 223.5.5.5:80)
         ↓
    Renvoie la liste des IP optimales (avec pondération)
         ↓
    Le client sonde la qualité réseau et choisit la meilleure IP
```

Avantages :

- Anti-détournement : ne passe pas par le DNS de l'opérateur
- Plus précis : peut choisir l'IP en fonction de la qualité réseau du client
- Temps réel : basculement plus rapide en cas de panne

**Conseils pratiques** :

- Fortement recommandé pour les applications mobiles
- Pour le web, utiliser la planification CNAME du CDN
- Pour les services critiques, mettre en place une tolérance multi-IP (un domaine renvoie plusieurs IP)

---

## 5. Optimisation HTTPS : équilibrer sécurité et performance

<HttpsOptimizationDemo />

### 5.1 Pourquoi HTTPS est-il important sur le CDN

**Comparaison de scénarios** :

```
Sans HTTPS :
L'utilisateur accède à http://cdn.example.com/image.jpg
↓
Le navigateur affiche « non sécurisé »
↓
Certains navigateurs/APP bloquent l'accès
↓
Le classement SEO est dégradé
```

```
Avec HTTPS :
L'utilisateur accède à https://cdn.example.com/image.jpg
↓
Le navigateur affiche l'icône de cadenas vert
↓
Le multiplexage HTTP/2 est activé
↓
Performance + sécurité améliorées
```

### 5.2 Points clés de la configuration HTTPS CDN

#### Gestion des certificats

| Solution | Description | Coût | Scénario d'utilisation |
| :--------------------- | :-------------------- | :------------- | :--------------- |
| **Certificat gratuit du fournisseur cloud** | Fourni par Alibaba Cloud / Tencent Cloud, etc. | Gratuit | Domaine unique, démarrage rapide |
| **Let's Encrypt** | Certificat communautaire gratuit | Gratuit | Déploiement automatisé |
| **Certificats commerciaux DV/OV/EV** | Symantec, GeoTrust, etc. | Quelques centaines à dizaines de milliers de yuans/an | Niveau entreprise, barre verte |
| **Certificat wildcard** | \*.example.com | Quelques milliers de yuans/an | Plusieurs sous-domaines |

**Conseils pratiques** :

- Environnement de test : Let's Encrypt ou certificat gratuit du fournisseur
- Environnement de production : certificat wildcard (gain de temps) ou certificat OV mono-domaine (économie)
- Surveiller les dates d'expiration des certificats, configurer des rappels de renouvellement automatique

#### Configuration d'optimisation HTTPS

**Choix de la version TLS** :

```
Configuration recommandée : TLS 1.2 et TLS 1.3 uniquement
Configuration de compatibilité : TLS 1.1 + TLS 1.2 + TLS 1.3 (pour les navigateurs anciens)
```

**Suites de chiffrement** :

```
Recommandé : échange de clés ECDHE + chiffrement AES-GCM
Désactivé : DES, RC4, MD5, SHA1
```

**OCSP Stapling** :

```
Fonctionnalité : le nœud CDN pré-récupère le statut de révocation du certificat
Effet : réduit le temps de vérification client de 200 à 500 ms
Recommandation : activer impérativement
```

**Réutilisation de session TLS** :

```
Réutilisation par Session ID : le client apporte son Session ID précédent, le serveur restaure la session
Réutilisation par Session Ticket : le serveur chiffre l'état de session et l'envoie au client, qui le rapporte ensuite
Effet : évite une poignée de main TLS complète, réduit 1-RTT
```

### 5.3 HTTP/2 et HTTP/3 sur le CDN

**Multiplexage HTTP/2** :

```
HTTP/1.1 :
Requête 1 (index.html) ────────────────→
Réponse 1 ←──────────────────────────────
Requête 2 (style.css) ─────────────────→
Réponse 2 ←──────────────────────────────
Requête 3 (script.js) ─────────────────→
Réponse 3 ←──────────────────────────────
(Séquentiel, une seule à la fois)

HTTP/2 :
Requête 1 ──→
Requête 2 ──→   Multiplexées sur une seule connexion TCP, trames entrelacées
Requête 3 ──→
Réponse 1 ←──   Renvoyées en flux selon la priorité
Réponse 2 ←──
Réponse 3 ←──
(Parallèle, multiplexage sur une seule connexion)
```

**Push serveur HTTP/2** :

```
Scénario : l'utilisateur demande index.html, qui référence style.css et script.js

Approche traditionnelle :
1. L'utilisateur télécharge index.html
2. En l'analysant, découvre le besoin de style.css et script.js
3. Envoie deux requêtes supplémentaires pour les obtenir

Push HTTP/2 :
1. L'utilisateur demande index.html
2. Le nœud CDN renvoie index.html et pousse simultanément style.css et script.js
3. Quand l'utilisateur analyse le HTML, les ressources sont déjà dans le cache

Attention : le push doit être utilisé avec parcimonie — trop de push gaspille la bande passante, pas assez n'apporte aucun bénéfice
```

**HTTP/3 (QUIC)** :

```
Problème d'HTTP/2 : basé sur TCP, blocage en tête de ligne
→ Un paquet TCP perdu bloque toute la connexion en attendant la retransmission

Solution d'HTTP/3 : basé sur QUIC (transmission fiable sur UDP)
→ Chaque flux est indépendant — un flux bloqué n'affecte pas les autres
→ Migration de connexion : passage du WiFi à la 4G sans interruption
→ Poignée de main 0-RTT : établissement rapide de connexion même à la première visite

État actuel : en 2024, la plupart des CDN majeurs supportent HTTP/3 — recommandation : activer
```

---

## 6. Analyse des accès : comprendre vos rapports CDN

<AccessAnalyticsDemo />

### 6.1 Lecture des métriques clés

#### Bande passante (Bandwidth)

```
Définition : quantité de données transmises par unité de temps
Unité : bps (bits par seconde), Mbps, Gbps

Bande passante CDN = somme du trafic sortant de tous les nœuds edge

Attention à distinguer :
- Bande passante facturée : généralement au pic 95 ou pic journalier
- Bande passante réelle : débit de transmission en temps réel
```

**Relation entre bande passante et trafic** :

```
1 Mbps de bande passante持续 pendant 1 heure = 450 Mo de trafic
(Calcul : 1 000 000 bps × 3600s ÷ 8 ÷ 1024 ÷ 1024 ≈ 429 Mo)
```

#### QPS (Queries Per Second)

```
Définition : nombre de requêtes/requêtes par seconde

QPS CDN = total des requêtes HTTP traitées par seconde par tous les nœuds edge

Attention : QPS élevé ne signifie pas bande passante élevée
- Scénario petits fichiers : QPS très élevé, bande passante modérée
- Scénario gros fichiers : QPS modéré, bande passante très élevée
```

#### Taux de cache hit (Hit Ratio)

```
Définition : proportion des requêtes servies depuis le cache des nœuds edge CDN

Formule de calcul :
Taux de hit = (requêtes en cache / total des requêtes) × 100 %
ou
Taux de hit = (1 - trafic de rappel / trafic sortant total) × 100 %

Standards du secteur :
- Images/vidéos/JS/CSS : > 95 %
- Pages HTML : 50-80 % (selon la fréquence de mise à jour)
- API : généralement pas de cache ou très faible
```

**Causes courantes d'un faible taux de hit** :

| Cause | Symptôme | Solution |
| :------------- | :----------------- | :----------------------- |
| Durée de cache trop courte | TTL de quelques minutes seulement | Ajuster le TTL selon le type de fichier |
| Paramètres de requête variables | URL avec nombre aléatoire | Configurer l'ignorance de certains paramètres |
| Clé de cache mal configurée | Différences non pertinentes traitées comme pertinentes | Optimiser les règles de clé de cache |
| Contenu fréquemment mis à jour | Fichiers souvent écrasés | Utiliser un numéro de version ou un hash dans le nom de fichier |
| Beaucoup de premiers accès | Nouveau contenu ou nouveaux nœuds | Précharger à l'avance |

### 6.2 Analyse des journaux et résolution de problèmes

#### Lecture des journaux CDN

Un journal d'accès CDN typique contient les champs suivants :

```
Horodatage | IP client | Méthode HTTP | URL | Code HTTP | Taille réponse | Statut cache | Temps réponse | Referer | User-Agent

Exemple :
2024-01-15 14:32:01 | 114.114.114.114 | GET | https://cdn.example.com/images/photo.jpg | 200 | 153600 | HIT | 23 | https://example.com/ | Mozilla/5.0...
```

Explication des champs clés :

| Champ | Description | Valeur d'analyse |
| :-------------- | :------------- | :------------------------------------------- |
| `cache_status` | Statut du cache | HIT (en cache), MISS (absent), EXPIRED (expiré) |
| `response_time` | Temps de réponse (ms) | Évaluer l'expérience utilisateur ; >500ms nécessite optimisation |
| `http_status` | Code HTTP | Investigation des erreurs 404/500 |
| `bytes_sent` | Octets envoyés | Statistiques de bande passante |

#### Résolution des problèmes courants

**Problème 1 : Les utilisateurs signalent des accès lents**

Étapes d'investigation :

```
1. Vérifier le response_time dans les journaux
   - Si élevé (>500ms) : vérifier s'il s'agit d'un MISS cache ou d'une origine lente

2. Vérifier le cache_status
   - HIT : cache en cache, la lenteur peut provenir de la taille du fichier ou du nœud
   - MISS : pas en cache, optimiser la stratégie de cache ou le taux de hit

3. Vérifier la distribution des IP clients
   - Lenteur dans certaines régions : possible surcharge ou couverture insuffisante du nœud
```

**Problème 2 : Le cache ne fonctionne pas, rappel d'origine à chaque fois**

Liste de vérification :

```
□ L'origine renvoie-t-elle Cache-Control: no-cache / private ?
□ L'URL contient-elle des paramètres aléatoires (par ex. ?_=123456) ?
□ La clé de cache est-elle correctement configurée ?
□ Le TTL est-il trop court ?
□ Le hit se fait-il dans le cache local du navigateur plutôt que sur le CDN ?
```

**Problème 3 : Explosion des coûts**

Directions d'investigation :

```
1. Examiner les détails de la facture
   - Frais de trafic CDN élevés : vérifier si des gros fichiers sont accédés fréquemment ou s'il y a du hotlinking
   - Frais de trafic de rappel élevés : vérifier si le taux de hit a chuté
   - Frais de requêtes élevés : vérifier s'il y a une attaque DDoS applicative ou des robots de scraping

2. Examiner les journaux d'accès
   - Y a-t-il un grand nombre de requêtes 404 (scan ou erreur de configuration)
   - Le Referer est-il anormal (déterminer s'il y a hotlinking)

3. Paramètres de sécurité
   - Activer la protection contre le hotlinking (liste blanche Referer)
   - Activer les listes noires/blanches d'IP
   - Configurer la protection anti-DDoS applicative
```

---

## 7. Cas pratique : construire une solution d'accélération d'images depuis zéro

### 7.1 Scénario métier

Supposons que vous êtes le responsable technique d'une communauté d'images confrontée aux défis suivants :

- **Téléversement** : 1 million d'images par jour (moyenne 2 Mo/image)
- **Accès** : 50 millions de consultations d'images par jour
- **Répartition des accès** : utilisateurs dans tout le pays, avec quelques accès internationaux
- **Exigence de performance** : temps de chargement des images < 500 ms
- **Budget** :保持在 50 000 yuans par mois si possible

### 7.2 Conception de l'architecture

```
                         ┌──────────────────────────────────────┐
                         │       Flux de téléversement utilisateur    │
                         └──────────────────────────────────────┘

   Navigateur utilisateur                                Serveur backend                  Stockage objet
       │                                            │                            │
       │  1. Demande de justificatif de téléversement                          │
       │───────────────────────────────────────────>│                            │
       │                                            │                            │
       │                                            │  2. Demande d'identifiants STS temporaires│
       │                                            │───────────────────────────>│
       │                                            │                            │
       │                                            │  3. Renvoie les identifiants STS          │
       │                                            │<───────────────────────────│
       │                                            │                            │
       │  4. Renvoie le justificatif (incluant STS) │
       │<───────────────────────────────────────────│                            │
       │                                            │                            │
       │  5. Téléversement direct du fichier (signature STS)                    │
       │──────────────────────────────────────────────────────────────────────>│
       │                                            │                            │
       │  6. Renvoie le résultat du téléversement (URL, ETag, etc.)             │
       │<──────────────────────────────────────────────────────────────────────│
       │                                            │                            │
       │  7. Notifie le backend de la fin du téléversement (sauvegarde en BDD) │
       │───────────────────────────────────────────>│                            │


                         ┌──────────────────────────────────────┐
                         │       Flux d'accès utilisateur            │
                         └──────────────────────────────────────┘

   Navigateur utilisateur    Résolution DNS     Nœud CDN       Stockage objet (origine)
       │                     │                     │                     │
       │  1. Demande l'URL de l'image             │                     │
       │────────────────────────────────────────>│                     │
       │                     │                     │                     │
       │                     │  2. Requête DNS     │                     │
       │                     │────────────────────>│                     │
       │                     │                     │                     │
       │                     │  3. Renvoie l'IP du nœud optimal          │
       │                     │<────────────────────│                     │
       │                     │                     │                     │
       │  4. Connexion au nœud CDN                 │                     │
       │────────────────────────────────────────>│                     │
       │                     │                     │                     │
       │                     │  5. Vérifie le cache│                     │
       │                     │                     ├─ Hit ? Renvoie directement │
       │                     │                     └─ Miss ? Continue       │
       │                     │                     │                     │
       │                     │                     │  6. Rappel d'origine│
       │                     │                     │──────────────────>│
       │                     │                     │                     │
       │                     │                     │  7. Renvoie le fichier│
       │                     │                     │<──────────────────│
       │                     │                     │                     │
       │                     │  8. Mise en cache et réponse              │
       │<────────────────────────────────────────│                     │
```

### 7.3 Détail des configurations clés

#### Configuration du stockage objet

**Planification des buckets** :

```
 Bucket : myapp-images-prod
 ├─ Structure des répertoires :
 │   ├─ uploads/           # Images originales téléversées
 │   │   ├─ 2024/01/15/user123-abc.jpg
 │   │   └─ 2024/01/15/user456-def.png
 │   ├─ thumbnails/        # Vignettes
 │   │   ├─ small/         # 100x100
 │   │   ├─ medium/        # 400x300
 │   │   └─ large/         # 800x600
 │   └─ processed/         # Images traitées (filigrane, etc.)
 │
 ├─ Permissions d'accès :
 │   ├─ Répertoire original : privé (accès par signature)
 │   ├─ Répertoire vignettes : lecture publique
 │   └─ CORS : autoriser *.myapp.com
 │
 └─ Stratégie de cycle de vie :
     ├─ Après 7 jours : stockage peu fréquent (économie de 40 %)
     ├─ Après 90 jours : stockage archive (économie de 70 %)
     └─ Après 3 ans : suppression automatique (ou migration vers stockage froid moins cher)
```

**Configuration CORS** :

```xml
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>https://myapp.com</AllowedOrigin>
    <AllowedOrigin>https://www.myapp.com</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <ExposeHeader>ETag</ExposeHeader>
    <ExposeHeader>x-oss-request-id</ExposeHeader>
    <MaxAgeSeconds>3600</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>
```

#### Configuration de l'accélération CDN

**Stratégie de cache** :

```
Règle globale par défaut :
├─ Clé de cache : chemin URL + conservation des paramètres w, h, format
├─ TTL par défaut : 7 jours
└─ Host d'origine : suivi automatique

Par type de fichier :
├─ *.html :
│   ├─ TTL : 5 minutes
│   └─ Priorité de lecture depuis le cache mémoire
│
├─ *.js, *.css :
│   ├─ TTL : 1 an
│   └─ Ignorer les paramètres de requête (hash dans le nom de fichier)
│
├─ *.jpg, *.png, *.gif, *.webp :
│   ├─ TTL : 30 jours
│   ├─ Conserver les paramètres (w, h, format pour le recadrage dynamique)
│   └─ Activer la compression automatique des images
│
└─ /api/* :
    ├─ TTL : 0 (pas de cache)
    └─ Rappel d'origine direct
```

**Configuration d'optimisation HTTPS** :

```
Configuration des certificats :
├─ Type : certificat wildcard *.myapp.com
├─ Déploiement : téléversement via la console CDN, renouvellement automatique
└─ Certificat de secours : certificat EV pour le domaine principal (barre d'adresse verte)

Configuration TLS :
├─ Version TLS minimale : 1.2 (équilibre compatibilité/sécurité)
├─ Version TLS maximale : 1.3
├─ Suites de chiffrement : uniquement les suites robustes
├─ OCSP Stapling : activé
├─ Réutilisation de session TLS : Session Ticket activé
└─ HSTS : activé (max-age=31536000)

HTTP/2 et HTTP/3 :
├─ HTTP/2 : activé (multiplexage, compression des headers)
├─ HTTP/2 Server Push : activé au besoin (recommandé : utiliser Preload à la place)
└─ HTTP/3 (QUIC) : activé (fonctionnalité expérimentale, déploiement progressif)
```

### 7.4 Stratégie de maîtrise des coûts

#### Analyse de la structure des coûts

```
Coûts mensuels CDN + stockage objet :

Part CDN :
├─ Frais de trafic sortant (principal, ~60 %)
│   ├─ Chine continentale : 0,15-0,30 yuans/Go
│   ├─ Asie-Pacifique : 0,40-0,80 yuans/Go
│   └─ Europe/Amérique : 0,30-0,60 yuans/Go
│
├─ Frais de requêtes (mineur, ~5 %)
│   ├─ HTTP : 0,01-0,05 yuans/10 000
│   └─ HTTPS : 0,05-0,15 yuans/10 000 (poignée de main TLS coûteuse en ressources)
│
├─ Frais de bande passante de pointe (mode de facturation optionnel)
│   └─ Facturation au pic 95 : adapté aux scénarios de trafic très variable
│
└─ Frais de fonctionnalités avancées (~5 %)
    ├─ Gestion des certificats HTTPS
    ├─ Protection WAF
    ├─ Push de journaux en temps réel
    └─ Scripts/Functions en edge

Part stockage objet :
├─ Frais de capacité de stockage (~15 %)
│   ├─ Stockage standard : 0,12-0,15 yuans/Go/mois
│   ├─ Stockage peu fréquent : 0,08-0,10 yuans/Go/mois
│   └─ Stockage archive : 0,03-0,05 yuans/Go/mois
│
├─ Frais de requêtes (~5 %)
│   ├─ PUT : 0,01-0,05 yuans/10 000
│   └─ GET : 0,005-0,01 yuans/10 000
│
├─ Frais de récupération de données (stockage peu fréquent/archive)
│   └─ Suppression anticipée ou récupération avec frais supplémentaires
│
└─ Frais de trafic sortant de rappel (~10 %)
    └─ Frais de trafic du rappel CDN vers le stockage objet
```

#### Astuces d'économie en pratique

**Astuce 1 : Stockage à niveaux, gestion automatisée du cycle de vie**

```yaml
# Exemple de règle de cycle de vie
rules:
  - id: image-lifecycle
    prefix: uploads/
    transitions:
      # Après 7 jours, passage en stockage peu fréquent — économie de 30 %
      - days: 7
        storageClass: IA
      # Après 90 jours, passage en stockage archive — économie de 70 %
      - days: 90
        storageClass: Archive
    # Après 3 ans, suppression automatique
    expiration:
      days: 1095
```

**Astuce 2 : Augmenter le taux de cache hit, réduire les rappels d'origine**

```
Que signifie faire passer le taux de hit de 90 % à 95 % ?

Hypothèses :
- Trafic journalier : 10 To
- Hit 90 % : rappel de 1 To
- Hit 95 % : rappel de 0,5 To

Économie de trafic de rappel : 0,5 To/jour × 0,15 yuans/Go × 30 jours = 2 250 yuans/mois
```

**Astuce 3 : Compression et optimisation de format**

```
Plan d'optimisation des images :
├─ Stockage des images originales dans le stockage objet (non exposé directement)
├─ Activation du traitement d'images par le CDN :
│   ├─ Conversion automatique de format : JPEG → WebP/AVIF (économie de 30 à 50 %)
│   ├─ Compression automatique de qualité : compression visuellement sans perte (économie de 20 à 40 %)
│   ├─ Adaptation de taille : retour de la taille appropriée selon l'appareil
│   └─ Chargement progressif : d'abord flou, puis net
└─ Effet : réduction des coûts de bande passante de 50 à 70 %
```

**Astuce 4 : Plafonnement de bande passante et alertes**

```yaml
# Configuration de plafonnement de bande passante
bandwidth_cap:
  daily_limit: 500 # Mbps, désactivation automatique du CDN si le pic journalier est dépassé
  monthly_limit: 10000 # Go, désactivation si le trafic mensuel est dépassé

  # Seuils d'alerte
  alerts:
    - threshold: 70% # Alerte à 70 %
      channels: [sms, email]
    - threshold: 90% # Appel téléphonique à 90 %
      channels: [phone]
```

---

## 8. Résumé : les règles d'or du stockage objet + CDN

### 8.1 Principes de conception architecturale

**Principe 1 : Séparation statique/dynamique**

```
Contenu dynamique (API, HTML) → Origine ou fonctions edge
Contenu statique (images, JS, CSS, vidéos) → CDN + stockage objet
```

**Principe 2 : Service au plus proche**

```
L'utilisateur est là où le contenu est mis en cache
→ Choisir un fournisseur CDN avec une large couverture
→ Activer la planification DNS intelligente
→ Précharger le contenu important à l'avance
```

**Principe 3 : Cache multi-niveaux**

```
Cache navigateur local (le plus rapide)
    ↓
Cache nœuds edge CDN (rapide)
    ↓
Niveau intermédiaire CDN / nœuds régionaux (secours)
    ↓
Stockage objet / origine (dernier rempart)
```

**Principe 4 : Équilibre coût / expérience**

```
Stockage à niveaux : données chaudes en stockage standard, données froides en archive
Stratégie de cache : TTL long pour le contenu fréquent, TTL court pour le contenu rare
Optimisation de compression : format WebP/AVIF, compression intelligente de qualité
Surveillance et alertes : plafonnement de bande passante pour prévenir le trafic anormal
```

### 8.2 Liste de contrôle anti-pièges

**Nommage et permissions des buckets**

- [ ] Le nom du bucket est globalement unique
- [ ] Les fichiers privés ne sont pas en lecture publique
- [ ] AccessKey n'est pas dans le code frontend — utiliser des identifiants STS temporaires
- [ ] Activer le chiffrement côté serveur (SSE) pour les données sensibles

**Configuration du cache CDN**

- [ ] Le TTL des fichiers HTML ne doit pas être trop long (< 5 minutes recommandé)
- [ ] JS/CSS : utiliser des noms avec hash, TTL = 1 an
- [ ] La clé de cache doit être raisonnable — ne pas y inclure de données utilisateur
- [ ] Rafraîchir le cache ou précharger après une mise à jour importante

**Sécurité HTTPS**

- [ ] Les certificats ne doivent pas expirer — configurer le renouvellement automatique
- [ ] Version TLS minimale recommandée : 1.2
- [ ] Activer HSTS pour prévenir les attaques par rétrogradation
- [ ] Les cookies sensibles doivent avoir les attributs Secure et HttpOnly

**Maîtrise des coûts**

- [ ] Activer les alertes de plafonnement de bande passante pour prévenir le trafic anormal
- [ ] Le stockage peu fréquent/archive a une durée minimale de stockage et des frais de suppression anticipée — attention aux règles
- [ ] Les frais de trafic de rappel sont aussi élevés — maximiser le taux de cache hit
- [ ] Analyser régulièrement les journaux d'accès et nettoyer les ressources zombies

---

## 9. Modèle de code pratique

### 9.1 Téléversement direct frontend vers le stockage objet (JavaScript)

```javascript
/**
 * Utilitaire de téléversement direct vers le stockage objet
 * Support : Alibaba Cloud OSS, Tencent Cloud COS, AWS S3
 */
class DirectUploader {
  constructor(config) {
    this.provider = config.provider // 'oss' | 'cos' | 's3'
    this.region = config.region
    this.bucket = config.bucket
    this.getCredentials = config.getCredentials // fonction pour obtenir les identifiants temporaires
  }

  /**
   * Obtenir les identifiants STS temporaires
   */
  async fetchCredentials() {
    const credentials = await this.getCredentials()
    return {
      accessKeyId: credentials.accessKeyId,
      accessKeySecret: credentials.accessKeySecret,
      sessionToken: credentials.securityToken || credentials.sessionToken,
      expiration: credentials.expiration
    }
  }

  /**
   * Générer la signature de téléversement (pour le calcul côté frontend)
   */
  generateSignature(credentials, fileKey, fileType, options = {}) {
    const timestamp = new Date().toISOString()
    const date = timestamp.slice(0, 10).replace(/-/g, '')

    switch (this.provider) {
      case 'oss':
        return this._ossSignature(credentials, fileKey, date, options)
      case 'cos':
        return this._cosSignature(credentials, fileKey, date, options)
      case 's3':
        return this._s3Signature(credentials, fileKey, date, options)
      default:
        throw new Error('Fournisseur inconnu')
    }
  }

  /**
   * Téléversement de fichier unique (petits fichiers < 100 Mo)
   */
  async upload(file, options = {}) {
    const credentials = await this.fetchCredentials()
    const fileKey = this._generateFileKey(file, options.directory)

    const formData = new FormData()

    const formFields = this._buildFormFields(
      credentials,
      fileKey,
      file.type,
      options
    )
    Object.entries(formFields).forEach(([key, value]) => {
      formData.append(key, value)
    })

    formData.append('file', file)

    const uploadUrl = this._getUploadUrl()
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      signal: options.signal
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Échec du téléversement : ${response.status} ${errorText}`)
    }

    return {
      url: this._getFileUrl(fileKey),
      key: fileKey,
      etag: response.headers.get('ETag'),
      size: file.size
    }
  }

  /**
   * Téléversement par fragments (gros fichiers > 100 Mo)
   */
  async multipartUpload(file, options = {}) {
    const partSize = options.partSize || 10 * 1024 * 1024 // 10 Mo par fragment
    const parallel = options.parallel || 3 // 3 parallèle par défaut

    const credentials = await this.fetchCredentials()
    const fileKey = this._generateFileKey(file, options.directory)

    // 1. Initialiser le téléversement par fragments
    const uploadId = await this._initMultipartUpload(
      credentials,
      fileKey,
      file.type
    )

    // 2. Calculer les fragments
    const parts = []
    const totalParts = Math.ceil(file.size / partSize)
    for (let i = 0; i < totalParts; i++) {
      const start = i * partSize
      const end = Math.min(start + partSize, file.size)
      parts.push({
        number: i + 1,
        start,
        end,
        blob: file.slice(start, end)
      })
    }

    // 3. Téléversement des fragments (avec contrôle de concurrence et reprise)
    const uploadedParts = []
    const failedParts = []

    if (options.resume) {
      const existingParts = await this._listParts(
        credentials,
        fileKey,
        uploadId
      )
      for (const part of existingParts) {
        uploadedParts.push(part)
      }
    }

    const pendingParts = parts.filter(
      (p) => !uploadedParts.some((up) => up.partNumber === p.number)
    )

    const uploadPart = async (part) => {
      try {
        const etag = await this._uploadPart(
          credentials,
          fileKey,
          uploadId,
          part
        )
        return { partNumber: part.number, etag }
      } catch (error) {
        failedParts.push({ part, error })
        throw error
      }
    }

    const chunks = []
    for (let i = 0; i < pendingParts.length; i += parallel) {
      chunks.push(pendingParts.slice(i, i + parallel))
    }

    for (const chunk of chunks) {
      const results = await Promise.allSettled(chunk.map(uploadPart))
      for (const result of results) {
        if (result.status === 'fulfilled') {
          uploadedParts.push(result.value)
        }
      }
    }

    if (uploadedParts.length !== totalParts) {
      throw new Error(
        `Téléversement incomplet : ${uploadedParts.length}/${totalParts} fragments envoyés`
      )
    }

    // 4. Finaliser le téléversement par fragments (fusion)
    await this._completeMultipartUpload(
      credentials,
      fileKey,
      uploadId,
      uploadedParts
    )

    return {
      url: this._getFileUrl(fileKey),
      key: fileKey,
      size: file.size,
      parts: totalParts
    }
  }

  /**
   * Générer le chemin de stockage du fichier
   */
  _generateFileKey(file, directory = '') {
    const date = new Date()
    const datePath = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
    const random = Math.random().toString(36).substring(2, 10)
    const ext = file.name.split('.').pop() || 'bin'
    const key = directory
      ? `${directory}/${datePath}/${random}.${ext}`
      : `${datePath}/${random}.${ext}`
    return key
  }

  // ============ Méthodes spécifiques par fournisseur ============

  _getUploadUrl() {
    switch (this.provider) {
      case 'oss':
        return `https://${this.bucket}.oss-${this.region}.aliyuncs.com`
      case 'cos':
        return `https://${this.bucket}.cos.${this.region}.myqcloud.com`
      case 's3':
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com`
      default:
        throw new Error('Fournisseur inconnu')
    }
  }

  _getFileUrl(key) {
    return `https://${this.bucket}.${this.provider === 'oss' ? 'oss' : 'cos'}-${this.region}.${
      this.provider === 'oss'
        ? 'aliyuncs.com'
        : this.provider === 'cos'
          ? 'myqcloud.com'
          : 'amazonaws.com'
    }/${key}`
  }

  // Les méthodes de signature, de téléversement par fragments, etc. propres à chaque fournisseur
  _buildFormFields(credentials, fileKey, fileType, options) {
    return {}
  }

  async _initMultipartUpload(credentials, fileKey, fileType) {
    return 'upload-id'
  }

  async _uploadPart(credentials, fileKey, uploadId, part) {
    return 'etag'
  }

  async _completeMultipartUpload(credentials, fileKey, uploadId, parts) {
  }

  async _listParts(credentials, fileKey, uploadId) {
    return []
  }
}

// Exemple d'utilisation
const uploader = new DirectUploader({
  provider: 'oss',
  region: 'cn-beijing',
  bucket: 'myapp-images-prod',
  getCredentials: async () => {
    const res = await fetch('/api/upload/credentials')
    return res.json()
  }
})

// Téléversement de petit fichier
async function uploadAvatar(file) {
  try {
    const result = await uploader.upload(file, {
      directory: 'avatars',
      onProgress: (progress) => {
        console.log(`Progression : ${progress.percent}%`)
      }
    })
    console.log('Téléversement réussi :', result.url)
    return result
  } catch (error) {
    console.error('Échec du téléversement :', error)
    throw error
  }
}

// Téléversement par fragments de gros fichier
async function uploadVideo(file) {
  try {
    const result = await uploader.multipartUpload(file, {
      directory: 'videos',
      partSize: 10 * 1024 * 1024, // 10 Mo par fragment
      parallel: 3, // 3 parallèle
      resume: true, // Support de la reprise
      onProgress: (progress) => {
        console.log(
          `Progression : ${progress.percent}%, ${progress.loaded}/${progress.total} envoyés`
        )
      },
      onPartComplete: (part) => {
        console.log(`Fragment ${part.number} téléversé`)
      }
    })
    console.log('Téléversement réussi :', result.url)
    return result
  } catch (error) {
    console.error('Échec du téléversement :', error)
    throw error
  }
}
```

### 9.2 Service d'identifiants temporaires backend (Node.js/Express)

```javascript
/**
 * Service d'identifiants STS temporaires pour le stockage objet
 * Support : Alibaba Cloud OSS, Tencent Cloud COS, AWS S3
 */
const express = require('express')
const STS = require('ali-oss').STS // Alibaba Cloud
const router = express.Router()

// Configuration
const config = {
  oss: {
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    region: 'oss-cn-beijing',
    bucket: 'myapp-images-prod',
    roleArn: process.env.OSS_STS_ROLE_ARN
  }
}

/**
 * Obtenir les identifiants STS temporaires (Alibaba Cloud OSS)
 * POST /api/upload/credentials
 */
router.post('/credentials', async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Non autorisé' })
    }

    const date = new Date()
    const prefix = `uploads/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${userId}/`

    const sts = new STS({
      accessKeyId: config.oss.accessKeyId,
      accessKeySecret: config.oss.accessKeySecret
    })

    const result = await sts.assumeRole(
      config.oss.roleArn,
      {
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              'oss:PutObject',
              'oss:InitiateMultipartUpload',
              'oss:UploadPart',
              'oss:CompleteMultipartUpload',
              'oss:AbortMultipartUpload',
              'oss:ListParts'
            ],
            Resource: [`acs:oss:*:*:${config.oss.bucket}/${prefix}*`]
          }
        ],
        Version: '1'
      },
      3600,
      'web-upload-session-' + Date.now()
    )

    res.json({
      success: true,
      data: {
        credentials: {
          accessKeyId: result.credentials.AccessKeyId,
          accessKeySecret: result.credentials.AccessKeySecret,
          sessionToken: result.credentials.SecurityToken,
          expiration: result.credentials.Expiration
        },
        config: {
          provider: 'oss',
          region: config.oss.region,
          bucket: config.oss.bucket,
          endpoint: `https://${config.oss.bucket}.${config.oss.region}.aliyuncs.com`,
          prefix: prefix,
          maxSize: 100 * 1024 * 1024,
          allowedTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'video/mp4'
          ]
        }
      }
    })
  } catch (error) {
    console.error('Échec de l\'obtention des identifiants :', error)
    res.status(500).json({
      success: false,
      error: 'Impossible d\'obtenir les identifiants de téléversement',
      message: error.message
    })
  }
})

/**
 * Callback : le frontend notifie le backend après le téléversement
 * POST /api/upload/callback
 */
router.post('/callback', async (req, res) => {
  try {
    const { key, etag, size, mimeType, originalName } = req.body
    const userId = req.user?.id

    const fileRecord = await db.files.create({
      userId,
      key,
      etag,
      size,
      mimeType,
      originalName,
      url: `https://cdn.example.com/${key}`,
      createdAt: new Date()
    })

    await processFileAsync(fileRecord)

    res.json({
      success: true,
      data: {
        fileId: fileRecord.id,
        url: fileRecord.url,
        size: fileRecord.size
      }
    })
  } catch (error) {
    console.error('Échec du callback de téléversement :', error)
    res.status(500).json({
      success: false,
      error: 'Impossible de traiter le fichier téléversé'
    })
  }
})

module.exports = router
```

### 9.3 Protection contre le hotlinking et configuration de sécurité

```javascript
/**
 * Exemple de configuration de sécurité et anti-hotlinking CDN
 */

// 1. Anti-hotlinking par Referer
const refererConfig = {
  allowList: [
    '*.myapp.com',
    '*.myapp.cn',
    'localhost:*',
    '127.0.0.1:*'
  ],

  blockList: [
    '*.competitor.com',
    'spam-site.com'
  ],

  allowEmptyReferer: false
}

// 2. Authentification URL (anti-hotlinking plus sécurisé, avec horodatage et signature)
class URLAuth {
  constructor(config) {
    this.key = config.key
    this.expireTime = config.expireTime || 3600
  }

  sign(url, expireIn = this.expireTime) {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const timestamp = Math.floor(Date.now() / 1000) + expireIn

    const signStr = `${pathname}-${timestamp}-${this.key}`
    const signature = this._md5(signStr)

    urlObj.searchParams.set('sign', signature)
    urlObj.searchParams.set('t', timestamp.toString())

    return urlObj.toString()
  }

  verify(url) {
    const urlObj = new URL(url)
    const signature = urlObj.searchParams.get('sign')
    const timestamp = parseInt(urlObj.searchParams.get('t'))
    const pathname = urlObj.pathname

    if (timestamp < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: 'URL expirée' }
    }

    const signStr = `${pathname}-${timestamp}-${this.key}`
    const expectedSign = this._md5(signStr)

    if (signature !== expectedSign) {
      return { valid: false, error: 'Signature invalide' }
    }

    return { valid: true }
  }

  _md5(str) {
    return require('crypto').createHash('md5').update(str).digest('hex')
  }
}

const auth = new URLAuth({
  key: 'your-secret-key-only-known-by-server',
  expireTime: 3600
})

const signedUrl = auth.sign(
  'https://cdn.example.com/private/document.pdf',
  7200
)

const result = auth.verify(signedUrl)
if (!result.valid) {
  // Renvoyer 403 Forbidden
}

// 3. Listes noires/blanches d'IP
const ipConfig = {
  whiteList: [
    '192.168.1.0/24',
    '10.0.0.0/8'
  ],

  blackList: ['1.2.3.4', '5.6.7.8']
}

// 4. Listes noires/blanches User-Agent
const uaConfig = {
  blackList: [
    'Wget',
    'curl',
    'python-requests',
    'Scrapy',
    'AhrefsBot',
    'SemrushBot'
  ],

  whiteList: [
    'Mozilla/*',
    'AppleWebKit/*'
  ]
}
```

---

## 10. Glossaire

| Terme anglais | Traduction française | Explication |
| :------------------------- | :---------------- | :--------------------------------------------------------------------------------------------------- |
| **Object Storage** | Stockage objet | Architecture de stockage gérant les données comme des objets et non en arborescence. Adapté aux images, vidéos, sauvegardes, etc. |
| **Bucket** | Bucket (seau de stockage) | Conteneur de plus haut niveau dans le stockage objet, pour organiser et isoler les données. |
| **Object** | Objet / fichier objet | Unité fondamentale du stockage objet, composée de données, métadonnées et clé unique. |
| **CDN** | Réseau de diffusion de contenu | Content Delivery Network — déploie des nœuds edge dans le monde entier pour rapprocher le contenu des utilisateurs. |
| **Edge Node** | Nœud edge | Serveur de cache déployé dans le réseau CDN, servant directement les utilisateurs. |
| **Origin** | Origine (serveur d'origine) | Serveur depuis lequel le CDN récupère le contenu — peut être du stockage objet, un ECS ou un serveur dédié. |
| **Cache Hit** | Cache hit | Le contenu demandé est déjà sur le nœud edge CDN — renvoyé directement sans rappel d'origine. |
| **Cache Miss** | Cache miss | Le nœud edge n'a pas le contenu — rappel d'origine nécessaire. |
| **Hit Ratio** | Taux de cache hit | Proportion des requêtes servies depuis le cache. Plus le taux est élevé, moins de rappels et plus les coûts sont bas. |
| **TTL** | Time To Live / Durée de cache | Durée de validité du contenu en cache sur les nœuds CDN. Au-delà, un rappel d'origine est nécessaire. |
| **Back to Source** | Rappel d'origine | Processus par lequel le nœud edge CDN demande le contenu à l'origine. |
| **Purge/Refresh** | Rafraîchissement du cache | Invalider de force le cache CDN — la prochaine requête rappellera l'origine pour le contenu à jour. |
| **Preheat** | Préchargement | Pousser proactivement le contenu vers les nœuds CDN avant la publication, pour que le premier accès soit déjà en cache. |
| **CORS** | Partage de ressources cross-origin | Cross-Origin Resource Sharing — mécanisme de sécurité du navigateur contrôlant l'accès aux ressources entre domaines. |
| **Referer** | Page d'origine | Header HTTP indiquant la page depuis laquelle la requête a été initiée. Utilisé pour l'anti-hotlinking. |
| **STS** | Service de jetons de sécurité | Security Token Service — service délivrant des identifiants d'accès temporaires, pour le téléversement direct frontend, etc. |
| **Multipart Upload** | Téléversement par fragments | Découper un gros fichier en fragments pour un téléversement parallèle avec reprise possible. |
| **ETag** | Tag d'entité | Header de réponse HTTP identifiant une version spécifique d'une ressource, utilisé pour la validation de cache. |
| **S3 API** | API compatible S3 | Spécification d'API de stockage objet d'AWS S3 — la plupart des fournisseurs cloud sont compatibles. |
| **Canonical Query String** | Chaîne de requête canonique | Partie de la chaîne de signature, pour garantir que la requête n'a pas été altérée. |

---

## Résumé : les règles d'or du stockage objet + CDN

1. **Téléversement direct** : gros fichiers par fragments, sécurité par STS
2. **Cache multi-niveaux** : navigateur → CDN → origine, cache à chaque niveau
3. **Service au plus proche** : DNS intelligent + couverture de nœuds mondiale
4. **Sécurité sans faille** : HTTPS + anti-hotlinking + contrôle d'accès
5. **Coûts sous surveillance** : taux de hit, bande passante, stockage à niveaux — optimisation continue

Cette architecture soutient la grande majorité des accès aux ressources statiques sur Internet. La comprendre, c'est comprendre la pierre angulaire de l'optimisation des performances web modernes.
