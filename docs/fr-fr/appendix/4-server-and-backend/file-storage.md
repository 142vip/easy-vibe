# Introduction : Stockage de fichiers et stockage objet

::: tip Préface
**Un utilisateur charge un avatar, vous le stockez dans le répertoire `/uploads` du serveur — puis le disque du serveur se remplit, ou vous ajoutez un second serveur, et l'utilisateur constate que son avatar apparaît et disparaît.** Le stockage de fichiers peut sembler simple, mais dans un environnement distribué, c'est un problème architectural qui nécessite une attention sérieuse. Le stockage d'objets est la réponse standard de l'ère Internet à ce problème.
:::

**Que allez-vous apprendre dans cet article ?**

Après avoir étudié ce chapitre, vous serez en mesure de :

- **Connaître les types de stockage** : comprendre les différences et les scénarios d'application du stockage par blocs, du stockage de fichiers et du stockage d'objets
- **Maîtriser les concepts clés du stockage d'objets** : Bucket, Object, Key, URL pré-signée, etc.
- **Concevoir des solutions de téléchargement** : apprendre à choisir entre le téléchargement direct côté client et le transit côté serveur
- **Comprendre l'accélération CDN** : comprendre comment le CDN accélère la distribution mondiale de ressources statiques
- **Meilleures pratiques** : maîtriser les techniques pratiques de nommage de fichiers, contrôle d'accès, gestion du cycle de vie

| Chapitre | Contenu | Concept clé |
|-----|------|---------|
| **Chapitre 1** | Comparaison des types de stockage | Stockage par blocs, stockage de fichiers, stockage d'objets |
| **Chapitre 2** | Concepts clés du stockage d'objets | Bucket, Object, Key, métadonnées |
| **Chapitre 3** | Solutions de téléchargement de fichiers | Téléchargement direct côté client, URL pré-signée |
| **Chapitre 4** | Accélération CDN | Nœuds de périphérie, stratégie de cache, récupération à la source |
| **Chapitre 5** | Meilleures pratiques | Conventions de nommage, permissions, cycle de vie |

---

## 0. Vue d'ensemble : pourquoi ne pas stocker les fichiers localement sur le serveur

Au début d'un projet, stocker les fichiers chargés par les utilisateurs dans un répertoire local du serveur est l'approche la plus intuitive. Mais à mesure que le projet évolue, vous rencontrerez une série de problèmes :

- **Espace disque limité** : le disque du serveur finit toujours par se remplir, l'extension est compliquée
- **Pas de partage multi-serveurs** : après l'équilibrage de charge, les requêtes utilisateur peuvent atteindre différents serveurs, les fichiers sont introuvables
- **Pas de sauvegarde** : si le serveur tombe en panne, les fichiers sont perdus
- **Pas de CDN** : les utilisateurs du monde entier accèdent au même serveur, la vitesse est lente

::: tip La valeur centrale du stockage d'objets
Le stockage d'objets (comme AWS S3, Alibaba Cloud OSS) résout tous ces problèmes : **capacité illimitée, accessibilité mondiale, sauvegarde automatique, support natif du CDN**. Il est devenu la norme de facto pour le stockage de fichiers dans les applications Internet.
:::

---

## 1. Comparaison des types de stockage : blocs, fichiers, objets

Le monde informatique dispose de trois modes de stockage principaux, chacun résolvant des problèmes à différents niveaux.

<FileStorageTypeDemo />

| Dimension | Stockage par blocs | Stockage de fichiers | Stockage d'objets |
|------|--------|---------|---------|
| Unité de données | Blocs de taille fixe | Fichiers + répertoires | Objets (Key-Value) |
| Protocole d'accès | iSCSI/FC | NFS/SMB | API REST HTTP |
| Performance | La plus élevée (millisecondes) | Moyenne | Plus faible (mais suffisante) |
| Extensibilité | Limitée | Moyenne | Quasiment illimitée |
| Coût | Le plus élevé | Moyen | Le plus bas |
| Scénario typique | Bases de données | Fichiers partagés | Images/vidéos/sauvegardes |

::: tip Aide-mémoire simple
- **Stockage par blocs** comme un disque dur — pour les bases de données
- **Stockage de fichiers** comme un dossier partagé réseau — pour partager des configurations entre plusieurs serveurs
- **Stockage d'objets** comme un cloud de stockage — pour les images et vidéos chargées par les utilisateurs
:::

---

## 2. Concepts clés du stockage d'objets

Le modèle de données du stockage d'objets est très simple : un **Bucket (seau)** est le conteneur, un **Object (objet)** est le fichier, chaque objet étant identifié par une **Key (clé)** unique.

```
my-app-bucket/                    ← Bucket (seau)
├── avatars/user-123.jpg          ← Clé d'objet
├── avatars/user-456.png          ← Clé d'objet
├── reports/2024/q1-report.pdf    ← Clé d'objet (le "répertoire" n'est qu'un préfixe de clé)
└── uploads/temp/file.zip         ← Clé d'objet
```

| Concept | Description | Exemple |
|------|------|------|
| Bucket | Conteneur de stockage, nommage globalement unique | `my-app-prod`, `company-assets` |
| Object | Le fichier stocké lui-même + métadonnées | Une image, un PDF |
| Key | Identifiant unique de l'objet | `avatars/user-123.jpg` |
| Métadonnées | Informations supplémentaires sur l'objet | Content-Type, étiquettes personnalisées |
| ACL | Liste de contrôle d'accès | public-read, private |
| URL pré-signée | Lien d'accès temporaire autorisé | Lien de téléchargement/chargement valide 15 minutes |

::: tip Le stockage d'objets n'a pas de vrais « répertoires »
`avatars/user-123.jpg` — le `avatars/` n'est pas un répertoire, c'est seulement un préfixe de clé. Le stockage d'objets a une structure plate, tous les objets sont au même niveau. Les « dossiers » affichés dans la console ne sont qu'un effet visuel de regroupement par préfixe.
:::

---

## 3. Solutions de téléchargement de fichiers : qui télécharge

Il existe deux approches principales pour le téléchargement de fichiers : le transit par le serveur et le téléchargement direct par le client. Pour la plupart des scénarios, le **téléchargement direct par le client** est le meilleur choix.

<FileUploadFlowDemo />

::: tip Avantages du téléchargement direct côté client
1. **Économise la bande passante du serveur** : les fichiers ne passent pas par votre serveur, vont directement vers OSS
2. **Évite les dépassements de délai** : le chargement de gros fichiers ne déclenche pas les limites de timeout de Nginx/Passerelle
3. **Réduit la charge du serveur** : le serveur ne fait que générer des informations d'identification, pas besoin de traiter le flux de fichiers
4. **Supporte la reprise de téléchargement** : OSS supporte nativement le chargement par fragments, le frontend peut implémenter la reprise

Étapes de mise en œuvre : le frontend demande au backend une URL pré-signée → le frontend utilise cette URL pour télécharger directement vers OSS → OSS rappelle le backend pour notification
:::

---

## 4. Accélération CDN : rendre le site rapide pour les utilisateurs du monde entier

Lorsque vos utilisateurs sont répartis dans le monde entier, le téléchargement de fichiers depuis un seul serveur source est lent. Le CDN (Content Delivery Network) déploie des nœuds de périphérie dans le monde entier, mettant en cache les fichiers au nœud le plus proche de l'utilisateur, réduisant considérablement la latence d'accès.

<CDNAccelerationDemo />

| Concept CDN | Description |
|---------|------|
| Nœud de périphérie | Serveurs de cache distribués dans le monde entier |
| Récupération à la source | Lorsque le nœud de périphérie n'a pas de cache, il demande le fichier au serveur source |
| Taux de réussite du cache | Proportion de requêtes servies directement par les nœuds de périphérie, plus c'est élevé mieux c'est |
| TTL | Durée de validité du cache, après expiration il faut récupérer à nouveau à la source |
| Purge du cache | Suppression proactive du cache des nœuds de périphérie pour que les nouveaux fichiers prennent effet |

::: tip Meilleures pratiques CDN
- **Ajouter un hash au nom de fichier** : `logo.a3f2b1.png` au lieu de `logo.png`, ainsi pas besoin de purger le cache lors de la mise à jour du fichier
- **Définir un TTL raisonnable** : ressources statiques (JS/CSS/images) avec un TTL long (1 an), HTML avec un TTL court (5 minutes)
- **Activer la compression Gzip/Brotli** : les ressources texte compressées voient leur volume réduit de 60 à 80 %
:::

---

## 5. Meilleures pratiques

| Pratique | Description | Exemple |
|------|------|------|
| Convention de nommage des clés | Organiser les fichiers avec des préfixes significatifs | `{type}/{date}/{uuid}.{ext}` |
| Éviter les clés chaudes | Ne pas commencer par des numéros séquentiels | Utiliser des préfixes UUID ou hash |
| Principe du moindre privilège | Bucket privé par défaut | Ne définir public-read que pour les fichiers devant être publics |
| Règles de cycle de vie | Nettoyage automatique des fichiers expirés | Les fichiers temporaires sont automatiquement supprimés après 7 jours |
| Configuration CORS | Le téléchargement direct côté client nécessite la configuration CORS | Autoriser PUT/POST pour votre domaine |
| Chiffrement côté serveur | Activer SSE pour les fichiers sensibles | SSE-S3 ou SSE-KMS |

---

## Résumé

Le stockage de fichiers est un problème fondamental auquel toute application Web est confrontée. Le stockage d'objets, avec sa capacité illimitée, son faible coût et sa haute disponibilité, est devenu le choix standard pour les applications Internet.

Récapitulatif des points clés de ce chapitre :

1. **Trois types de stockage** : stockage par blocs pour les bases de données, stockage de fichiers pour le partage, stockage d'objets pour les fichiers utilisateurs
2. **Modèle de stockage d'objets** : Bucket + Key + Object, structure plate, accès via API HTTP
3. **Téléchargement direct côté client** : solution URL pré-signée, les fichiers ne passent pas par le serveur, efficace et économique en ressources
4. **Accélération CDN** : cache des nœuds de périphérie + hash dans le nom de fichier, pour une vitesse optimale partout dans le monde
5. **Sécurité et gestion** : principe du moindre privilège, règles de cycle de vie, chiffrement côté serveur

## Pour aller plus loin

- [Guide du développeur AWS S3](https://docs.aws.amazon.com/s3/) - La documentation de référence du stockage d'objets
- [Meilleures pratiques Alibaba Cloud OSS](https://help.aliyun.com/document_detail/31853.html) - Le stockage d'objets le plus utilisé en Chine
- [Documentation MinIO](https://min.io/docs/minio/linux/index.html) - Stockage d'objets open source compatible S3
- [Cloudflare R2](https://developers.cloudflare.com/r2/) - Stockage d'objets sans frais de sortie
- [Détail des URL pré-signées](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html) - Le mécanisme central du téléchargement direct côté client
