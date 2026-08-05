# Principes : Stratégies et hiérarchies de cache
::: tip 🎯 Question centrale
**Pourquoi certains sites web s'ouvrent en 50 millisecondes, alors que d'autres prennent 5 secondes ?** C'est comme demander : pourquoi sortir un livre de son cartable prend 1 seconde, alors qu'aller le chercher à la bibliothèque prend 10 minutes ? La réponse, c'est le cache. Ce chapitre vous fera plonger dans les principes fondamentaux, les modèles de conception et les techniques pratiques du cache, pour multiplier par 100 les performances de votre système.
:::

---

## 1. Motivation et justification : mettre en cache

### 1.1 L'évolution : de « tout interroger à chaque fois » à « mémoriser les données fréquentes »

Aux débuts de l'informatique, les programmeurs interrogeaient le disque dur ou la base de données à chaque fois qu'ils avaient besoin de données. C'est comme si, pour chaque exercice de maths, vous deviez feuilleter votre manuel pour retrouver une formule : c'est précis, mais très inefficace. Avec la montée en charge des systèmes, cette approche a révélé de sérieux problèmes : le CPU de la base de données grimpait à 95 %, le temps de réponse explosait de 100 millisecondes à 8 secondes, et le système finissait par s'effondrer.

C'est comme un étudiant qui, chaque jour, devrait courir de son dortoir à la bibliothèque pour consulter des documents, 50 fois par jour, jusqu'à s'écrouler d'épuisement. La solution est simple : garder un carnet de formules dans son cartable, et le consulter directement au lieu de courir à la bibliothèque à chaque fois. Le cache, c'est le « carnet de formules » du système informatique : il stocke les données fréquemment utilisées dans un emplacement à accès rapide, pour éviter au système de devoir aller à la « bibliothèque » (la base de données) à chaque requête.

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🐌 Sans cache**
- Chaque requête interroge la base de données
- Utilisation CPU de la base : 95 %
- Temps de réponse : 5-8 secondes
- Système susceptible de planter

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 Avec cache**
- 95 % des requêtes renvoyées directement
- Utilisation CPU de la base < 20 %
- Temps de réponse : 50 millisecondes
- Système stable

</div>
</div>

**Voilà le problème central que le cache résout : en stockant des copies des données fréquemment utilisées, on réduit les accès au stockage lent (la base de données), rendant le système plus rapide et plus stable.**

<CachePerformanceComparisonDemo />

### 1.2 Une histoire vraie : pourquoi le cache est une bouée de sauvetage

Vous pensez peut-être : « Mon système tourne bien pour l'instant, pourquoi concevoir un cache à l'avance ? » Laissez-moi vous raconter une histoire vraie, et vous comprendrez pourquoi le cache n'est pas une « option », mais une « nécessité ».

::: warning La débâcle de la base de données d'Ah Qiang
Ah Qiang est ingénieur full-stack dans une startup qui a lancé une appli sociale. Au début, avec peu d'utilisateurs (quelques centaines), le système fonctionnait normalement. Ah Qiang pensait qu'un cache était superflu, il suffisait d'interroger directement la base de données.

Six mois plus tard, l'appli comptait 100 000 utilisateurs. Un jour, une célébrité a publié un message sur l'appli, attirant instantanément 100 000 visiteurs. Résultat : la base de données a explosé. CPU à 100 %, temps de réponse passé de 100 ms à 30 secondes, l'appli entière s'est effondrée, et les utilisateurs ont fui en masse.

Rétrospective : s'il y avait eu une simple couche de cache (comme Redis) pour mettre en cache les publications populaires, la pression sur la base de données aurait été réduite d'au moins 95 %, et le système aurait parfaitement encaissé ce pic de trafic.

Ah Qiang a retenu la leçon : **le cache n'est pas un embellissement, c'est une assurance-vie pour les systèmes à haute concurrence. Ne pas mettre en cache, c'est comme conduire sans ceinture de sécurité : tout va bien jusqu'au jour où il est trop tard.**
:::

::: info 💡 Enseignement clé
La valeur du cache ne réside pas seulement dans la « rapidité », mais surtout dans la « protection ». Il protège la base de données contre l'effondrement et maintient le système stable sous fort trafic. Lorsque vous concevez un système, n'attendez pas qu'un incident survienne pour penser au cache : intégrez-le dès le départ comme un élément central de votre architecture.
:::

---

## 2. Concepts fondamentaux : qu'est-ce que le cache

::: tip 🤔 Qu'est-ce que le cache, au juste ?
En bref, **le cache est un espace de stockage pour des copies de données**. C'est comme un post-it sur votre bureau où vous notez les numéros de téléphone fréquents, pour ne pas avoir à fouiller dans votre répertoire à chaque fois.

**Trois points clés** :
1. **Copie** : les données en cache sont une copie des données originales (base de données), pas les données maîtres
2. **Accès rapide** : le cache réside généralement en mémoire, avec une vitesse de lecture 100 000 fois supérieure à celle du disque dur
3. **Capacité limitée** : l'espace de cache est limité, on ne peut y stocker que les données les plus utilisées

Ainsi, **le cache, c'est échanger de l'espace contre du temps** — sacrifier un peu de mémoire pour obtenir une vitesse d'accès aux données extrêmement rapide.
:::

Avant de plonger dans les aspects techniques, clarifions quelques concepts fondamentaux. Pour vous aider à comprendre, nous allons utiliser l'analogie du « cartable d'étudiant » pour représenter un système de cache.

### 2.1 Comprendre les concepts clés du cache avec l'analogie du cartable

Imaginez que vous êtes un étudiant qui doit consulter divers documents chaque jour. Ce processus ressemble étonnamment à un système de cache :

| Concept | 🎒 Analogie du cartable | Signification technique | Exemple concret |
|------|-----------|----------|----------|
| **Cache Hit (succès cache)** | La formule recherchée est sur le post-it | La donnée demandée est trouvée dans le cache | Recherche d'un profil utilisateur trouvé dans Redis, renvoyé directement |
| **Cache Miss (échec cache)** | Pas sur le post-it, il faut chercher dans le livre | La donnée demandée n'est pas dans le cache | Profil utilisateur absent de Redis, il faut interroger la base |
| **Hit Ratio (taux de succès)** | Sur 100 recherches de formules, 95 sont sur le post-it | La proportion de requêtes servies par le cache | Taux de succès de 95 % = 95 % des requêtes n'interrogent pas la base |
| **TTL (Time To Live)** | Post-it marqué « à jeter dans 3 jours » | Durée de vie du cache avant expiration | Cache d'un profil utilisateur configuré pour expirer après 30 minutes |
| **Eviction (éviction)** | Le cartable est plein, on jette le plus vieux post-it | Suppression de données anciennes quand le cache est plein | Redis plein, supprime automatiquement les données les moins utilisées |

### 2.2 Cache Hit vs Cache Miss

La différence de performance entre un succès et un échec de cache est énorme. Voyons les chiffres :

| Type d'opération | Temps de réponse | Vitesse relative | Scénario adapté |
|---------|---------|----------|----------|
| **Cache CPU L1** | ~0,5 nanoseconde | Extrêmement rapide (référence) | Calculs internes du CPU |
| **Lecture mémoire** | ~100 nanosecondes | 200× plus lent | Cache local (ex. Caffeine) |
| **Requête Redis** | ~1 milliseconde | 2 000 000× plus lent | Cache distribué |
| **Requête MySQL** | ~10 millisecondes | 20 000 000× plus lent | Requête base de données sur disque |

::: tip 📊 Que voyez-vous dans ce tableau ?
**L'écart de performance est saisissant** : une opération en mémoire est 100 000 fois plus rapide qu'une requête MySQL ! C'est comme la différence entre prendre un livre sur son bureau (1 seconde) et aller le chercher à la bibliothèque (100 000 secondes, soit environ 28 heures).

**Trois niveaux de performance** :
1. **Cache local (mémoire)** : le plus rapide, capacité réduite, idéal pour les données très chaudes
2. **Cache Redis** : vitesse moyenne, grande capacité, adapté aux scénarios distribués
3. **Base de données** : le plus lent, capacité illimitée, source ultime des données

**Leçon pratique** : votre système doit faire en sorte que plus de 95 % des requêtes soient servies au niveau du cache, avec moins de 5 % nécessitant un accès à la base de données. Ainsi, la pression sur la base reste faible et les performances globales du système s'améliorent considérablement.
:::

::: details 🔍 Code réel d'un Cache Hit et d'un Cache Miss
Comparons ces deux cas avec du code :

```javascript
// Scénario : recherche d'un profil utilisateur

// ===== Cache Hit (succès cache) =====
// 1. On interroge d'abord le cache Redis
const userFromCache = await redis.get('user:123')
if (userFromCache) {
  // Succès ! Renvoyé directement, environ 1 milliseconde
  return JSON.parse(userFromCache)
}

// ===== Cache Miss (échec cache) =====
// 2. Pas dans le cache, on interroge la base de données
const userFromDB = await db.query('SELECT * FROM users WHERE id = 123')
// Échec ! Il faut interroger la base, environ 10 millisecondes, 10× plus lent

// 3. Une fois trouvé, on écrit dans le cache pour le prochain succès
await redis.set('user:123', JSON.stringify(userFromDB), 'EX', 1800)
return userFromDB
```

**Points clés** :
- Cache Hit : réponse en 1 milliseconde, expérience utilisateur excellente
- Cache Miss : réponse en 10 millisecondes, expérience utilisateur correcte
- **La valeur du cache** : transformer les échecs en succès, multiplier les performances par 10
:::

### 2.3 Le cycle de vie du cache

Une entrée de cache, de sa création à sa destruction, traverse un cycle de vie complet. Comprendre ce processus est essentiel pour concevoir un système de cache.

**Quatre phases** :

**Phase 1 : Écriture (Write)**
- **Écriture proactive** : au démarrage, précharger les données chaudes dans le cache (preheating)
- **Chargement paresseux (Lazy Loading)** : charger depuis la base de données et écrire dans le cache lors du premier accès (le plus courant)

**Phase 2 : Succès/Échec (Hit/Miss)**
- Chaque requête vérifie d'abord le cache
- Succès : renvoyé directement ; Échec : on interroge la base de données

**Phase 3 : Expiration (Expiration)**
- **TTL (Time To Live)** : définir la durée de vie du cache (ex. 30 minutes)
- Une fois le TTL écoulé, le cache expire automatiquement ; le prochain accès devra recharger les données

**Phase 4 : Éviction (Eviction)**
- L'espace de cache est limité ; quand il est plein, il faut supprimer d'anciennes données
- Stratégies d'éviction courantes :
  - **LRU (Least Recently Used)** : supprimer les données les moins récemment utilisées (le plus courant)
  - **LFU (Least Frequently Used)** : supprimer les données les moins fréquemment utilisées
  - **FIFO (First In First Out)** : supprimer les données les plus anciennes

👇 **Essayez par vous-même** :
La démonstration ci-dessous illustre le cycle de vie du cache. Cliquez sur « Ajouter un cache » et observez comment une entrée traverse les phases d'écriture, de succès, d'expiration et d'éviction :

<CacheLifecycleDemo />

---

## 3. L'évolution du cache : du local au distribué

::: tip 🤔 Pourquoi différents types de cache ?
C'est comme lorsque vous étudiez : vous placez vos documents à différents endroits. Sur le bureau, les plus utilisés (post-it) ; dans le cartable, les courants (carnet) ; à la bibliothèque, l'ensemble des ressources (rayonnages).

**Pour un système de cache, c'est pareil** :
- **Cache local (bureau)** : le plus rapide, petite capacité, pour les données super chaudes
- **Cache distribué (casier public)** : assez rapide, grande capacité, pour les données courantes
- **Base de données (bibliothèque)** : le plus lent, capacité illimitée, pour toutes les données

**Pourquoi plusieurs niveaux ?** Parce que chaque niveau a des performances et des coûts différents, et seule une combinaison judicieuse permet d'atteindre le résultat optimal.
:::

Après tous ces concepts, examinons un cas concret : comment un système e-commerce est passé de « sans cache » à une « architecture de cache multi-niveaux ». Ce cas vous donnera une vision intuitive de l'importance de la conception du cache.

### 3.1 Phase 1 : L'ère sans cache — la base de données à nu

**Contexte** : au début, le système a peu d'utilisateurs (quelques centaines). Toutes les requêtes vont directement à la base de données, sans aucune couche de cache.

**Stack technique** :
- Base de données : MySQL
- Pas de cache : ni Redis, ni cache local

**Architecture système** :
```
Requête utilisateur → Serveur d'application → Base de données MySQL
```

**Caractéristiques de cette phase** :
- ✅ **Avantages** : architecture simple, développement rapide
- ❌ **Inconvénients** : forte pression sur la base, performances médiocres, le système s'effondre au-delà de quelques milliers d'utilisateurs

::: details Voir le code de l'époque et les problèmes rencontrés
**Exemple de code** (interrogation de la base à chaque fois) :

```javascript
// Récupérer les détails d'un produit — à chaque fois, on interroge la base
async function getProduct(productId) {
  // Requête directe à la base, sans aucun cache
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )
  return product
}
```

**Problèmes rencontrés** :
1. **CPU de la base qui explose** : chaque requête interroge la base, CPU à 80 %+
2. **Réponse lente** : les requêtes complexes prennent 50-100 ms, mauvaise expérience utilisateur
3. **Faible capacité de concurrence** : la base de données plafonne à 2000 QPS (requêtes par seconde), au-delà elle s'effondre
4. **Problème des produits populaires** : les pages de produits populaires sont interrogées en permanence, la base devient le goulot d'étranglement

**Solutions temporaires de l'époque** :
- Acheter des serveurs plus puissants (plus de CPU, plus de RAM) — coûteux, efficacité limitée
- Séparation lecture/écriture de la base — soulage la lecture, mais la pression d'écriture demeure
- Optimisation SQL — gain de 20-30 %, mais ne résout pas le problème de fond
:::

Ce mode « à nu » tient la route avec moins de 1000 utilisateurs, mais quand le nombre d'utilisateurs atteint 10 000 ou 100 000, la base de données commence à planter fréquemment. L'équipe a un besoin urgent d'introduire un cache.

### 3.2 Phase 2 : Introduction de Redis — performances multipliées par 10

**Contexte** : le nombre d'utilisateurs atteint 10 000, la base de données ne tient plus. L'équipe décide d'introduire Redis comme couche de cache.

**Stack technique** :
- Base de données : MySQL
- Cache : Redis (instance unique)

**Architecture système** :
```
Requête utilisateur → Serveur d'application → Cache Redis (si échec, alors) → Base de données MySQL
```

**Caractéristiques de cette phase** :
- ✅ **Avantages** : performances multipliées par 10, pression sur la base réduite de 90 %
- ❌ **Inconvénients** : point de défaillance unique sur Redis, risque d'incohérence entre cache et base de données

::: details Voir le code d'implémentation du cache Redis
**Exemple de code** (avec cache Redis) :

```javascript
// Récupérer les détails d'un produit — d'abord Redis, puis la base si nécessaire
async function getProduct(productId) {
  // 1. D'abord, vérifier le cache Redis
  const cacheKey = `product:${productId}`
  const cached = await redis.get(cacheKey)

  if (cached) {
    // Cache Hit ! Renvoyé directement, environ 1 milliseconde
    return JSON.parse(cached)
  }

  // 2. Cache Miss, on interroge la base de données
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // 3. Une fois trouvé, on écrit dans Redis avec expiration de 30 minutes
  await redis.setex(
    cacheKey,
    1800,  // 30 minutes = 1800 secondes
    JSON.stringify(product)
  )

  return product
}
```

**Comparaison des performances** :

| Scénario | Sans cache | Avec cache Redis | Gain |
|------|-------|--------------|---------|
| Requête produit standard | 50 ms | 5 ms (cache hit) | **10×** |
| Requête produit populaire | 80 ms | 1 ms (taux de succès 95 %) | **80×** |
| QPS de la base | 2000 (pleine charge) | 200 (cache intercepte 90 %) | **Pression base réduite de 10×** |
| Concurrence maximale | 2000 utilisateurs | 20 000 utilisateurs | **10×** |

**Améliorations apportées** :
1. **Temps de réponse** : en cas de cache hit, le temps passe de 50 ms à 1-5 ms
2. **Capacité de concurrence** : le nombre d'utilisateurs supportés passe de 2000 à 20 000
3. **Pression base de données** : 90 % des requêtes interceptées par Redis, CPU de la base passe de 80 % à 20 %
4. **Expérience utilisateur** : vitesse de chargement des pages nettement améliorée, moins de plaintes

**Nouveaux défis** :
1. **Cohérence du cache** : le prix d'un produit change, la base est mise à jour, mais le cache a encore l'ancienne valeur
2. **Cache Penetration** : quelqu'un interroge malicieusement des IDs de produit inexistants (ex. id=-1), chaque requête traverse jusqu'à la base
3. **Cache Avalanche** : après un redémarrage, tous les caches expirent en même temps, une avalanche de requêtes s'abat sur la base
4. **Point de défaillance unique Redis** : si Redis tombe, toutes les requêtes vont directement à la base, le système peut s'effondrer

**Solutions** :
- **Cohérence du cache** : lors de la mise à jour de la base, supprimer le cache correspondant
- **Cache Penetration** : mettre en cache les données inexistantes aussi (valeur null, TTL court, ex. 5 minutes)
- **Cache Avalanche** : ajouter une valeur aléatoire au TTL pour éviter les expirations simultanées
:::

Après l'introduction de Redis, les performances du système se sont nettement améliorées, mais de nouveaux problèmes sont apparus. L'équipe a commencé à chercher comment les résoudre.

### 3.3 Phase 3 : Architecture de cache multi-niveaux — performances encore multipliées par 5

**Contexte** : le nombre d'utilisateurs atteint 100 000. Même le cache Redis devient un goulot d'étranglement (Redis mono-instance plafonne à environ 100 000 QPS). L'équipe décide d'introduire un cache multi-niveaux.

**Stack technique** :
- Cache L1 : cache local applicatif (Caffeine)
- Cache L2 : cluster Redis
- Base de données : cluster maître-esclave MySQL

**Architecture système** :
```
Requête utilisateur → Cache CDN (ressources statiques) → Serveur d'application
                                                            ↓
                              L1 : Cache local (Caffeine) → échec → L2 : Redis → échec → MySQL
```

**Caractéristiques de cette phase** :
- ✅ **Avantages** : performances extrêmes (cache local en 0,1 ms), haute disponibilité (les données chaudes restent accessibles même si Redis tombe)
- ❌ **Inconvénients** : architecture complexe, cohérence difficile à garantir entre les niveaux de cache

::: details Voir le code du cache multi-niveaux
**Exemple de code** (cache local + Redis à deux niveaux) :

```javascript
// Utilisation du cache local Caffeine
const caffeine = require('caffeine')
const localCache = new caffeine.Cache({
  max: 1000,              // 1000 entrées maximum
  ttl: 30,                // expiration de 30 secondes
})

// Récupérer les détails d'un produit — cache à deux niveaux
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // L1 : d'abord le cache local (le plus rapide, environ 0,1 ms)
  const localCached = localCache.get(cacheKey)
  if (localCached) {
    console.log('L1 hit')
    return localCached
  }

  // L2 : cache local manqué, vérifier Redis (assez rapide, environ 1 ms)
  const redisCached = await redis.get(cacheKey)
  if (redisCached) {
    console.log('L2 hit, rechargement L1')
    const product = JSON.parse(redisCached)
    // Recharger le cache local
    localCache.set(cacheKey, product)
    return product
  }

  // L3 : Redis également manqué, interroger la base de données (le plus lent, environ 10 ms)
  console.log('L3 hit, rechargement L2 et L1')
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // Recharger Redis (expiration 30 minutes)
  await redis.setex(cacheKey, 1800, JSON.stringify(product))
  // Recharger le cache local
  localCache.set(cacheKey, product)

  return product
}
```

**Comparaison des performances multi-niveaux** :

| Niveau de cache | Temps de réponse | Taux de succès | Données adaptées |
|---------|---------|--------|--------------|
| **L1 : Cache local** | ~0,1 ms | 70 % (super chaudes) | Produits populaires, configuration système, sessions utilisateur |
| **L2 : Cache Redis** | ~1 ms | 25 % (chaudes) | La plupart des données produits, agrégations de commentaires |
| **L3 : Base de données** | ~10 ms | 5 % (froides) | Données complètes de tous les produits |

**Amélioration globale des performances** :
- **Temps de réponse moyen** : 5 ms (phase 2) → 1 ms (phase 3), **encore 5× plus rapide**
- **Concurrence maximale** : 20 000 utilisateurs (phase 2) → 100 000 utilisateurs (phase 3), **5× plus élevé**
- **QPS base de données** : 200 (phase 2) → 50 (phase 3), **encore 4× moins**

**Nouveaux problèmes résolus dans cette phase** :
1. **Cohérence du cache local** : les caches locaux de plusieurs instances peuvent être incohérents (l'instance A a l'ancien prix en cache, l'instance B le nouveau)
   - **Solution** : TTL du cache local court (30 secondes), pour réduire la fenêtre d'incohérence
2. **Cache preheating** : après un redémarrage, le cache local est vide, beaucoup de requêtes traversent jusqu'à Redis
   - **Solution** : au démarrage, charger proactivement les données chaudes dans le cache local
:::

L'architecture de cache multi-niveaux est largement utilisée dans les grandes entreprises Internet (comme Taobao, JD.com), capable de supporter des millions de QPS.

### 3.4 Vue d'ensemble de l'évolution de l'architecture de cache

| Phase | Architecture | Temps de réponse | Concurrence max | Changement clé |
|------|------|---------|---------|---------|
| **Phase 1 : Sans cache** | App → Base de données | 50 ms | 2000 utilisateurs | Base à nu, performances faibles |
| **Phase 2 : Cache simple** | App → Redis → Base de données | 5 ms | 20 000 utilisateurs | Introduction de Redis, performances ×10 |
| **Phase 3 : Multi-niveaux** | App → Cache local → Redis → Base de données | 1 ms | 100 000 utilisateurs | Cache local + Redis, performances ×5 supplémentaires |

::: tip 📊 Que voyez-vous dans ce tableau ?
**Phase 1 → Phase 2** : un saut qualitatif. L'introduction de Redis multiplie les performances par 10 et réduit la pression sur la base de 90 %. C'est le passage crucial de « ça marche » à « ça suffit ».

**Phase 2 → Phase 3** : l'optimisation ultime. L'ajout du cache local multiplie encore les performances par 5. C'est le passage de « ça suffit » à « l'excellence », pour les scénarios à très fort trafic.

**Recommandations pratiques** :
- **Moins de 10 000 utilisateurs** : la phase 1 (sans cache) suffit, mais il est conseillé d'introduire Redis (phase 2)
- **10 000 à 100 000 utilisateurs** : la phase 2 (cache Redis) est le meilleur choix
- **Plus de 100 000 utilisateurs** : envisager la phase 3 (cache multi-niveaux), en tenant compte de la complexité de cohérence

**En résumé** : l'évolution de l'architecture de cache ne consiste pas simplement à « ajouter plus de couches de cache », mais à **choisir l'architecture adaptée à l'échelle du trafic** — une conception excessive ajoute de la complexité, une conception insuffisante crée des goulots d'étranglement.
:::

---

## 4. Les trois grands problèmes classiques du cache : Penetration, Hotspot Invalidation, Avalanche

En pratique, le cache introduit trois types de problèmes classiques. Si vous ne les connaissez pas, votre système risque de s'effondrer brutalement à un moment donné. Utilisons des analogies du quotidien pour les comprendre.

### 4.1 Cache Penetration : interroger des données inexistantes

**Définition** : interroger une **donnée qui n'existe pas** (ex. id=-1). Elle n'est pas dans le cache (car jamais stockée), ni dans la base de données. Chaque requête traverse donc directement jusqu'à la base.

::: tip 🤔 La Cache Penetration expliquée par l'analogie de la bibliothèque
Imaginez que vous cherchez un livre à la bibliothèque. Vous demandez au bibliothécaire : « Avez-vous *Le Livre Inexistant* ? »

**Déroulement normal** :
- Le bibliothécaire consulte le catalogue : « Non, ce livre n'existe pas »
- Vous partez

**Scénario de Cache Penetration** :
- 1re fois : le bibliothécaire consulte la base : « Non », il vous le dit
- 2e fois : le bibliothécaire consulte encore la base : « Non »
- 100e fois : le bibliothécaire consulte toujours la base : « Non »

**Problème** : le bibliothécaire (la base de données) est harcelé, il doit consulter la base à chaque fois, même si la réponse est toujours « non ».

**Solution** : le bibliothécaire retient que « *Le Livre Inexistant* n'existe pas ». La prochaine fois, il dit directement « non » sans consulter la base. C'est le **cache d'objet nul**.
:::

**Scénarios réels** :
- Un attaquant malveillant construit des IDs inexistants pour ses requêtes (ex. id=-1, id=999999999)
- Un crawler parcourt des chemins de ressources inexistants (ex. /api/products/invalid-id)
- Une erreur de logique métier conduit à interroger des données invalides

**Solution 1 : Cache d'objet nul**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // 1. Vérifier d'abord le cache
  const cached = await redis.get(cacheKey)
  if (cached !== null) {
    // Attention : cached peut être la chaîne "null"
    if (cached === 'null') {
      // Le cache contient un "objet nul", la donnée n'existe pas en base
      return null
    }
    return JSON.parse(cached)
  }

  // 2. Interroger la base de données
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // 3. Même si la base n'a rien, mettre en cache "null" avec un TTL court (5 minutes)
  if (!product) {
    await redis.setex(cacheKey, 300, 'null')
    return null
  }

  // 4. Donnée trouvée, mise en cache normale
  await redis.setex(cacheKey, 1800, JSON.stringify(product))
  return product
}
```

**Solution 2 : Filtre de Bloom (Bloom Filter)**

Le filtre de Bloom est un outil qui « détermine rapidement si une donnée existe », comme un « super index » :

::: tip 📖 Qu'est-ce qu'un filtre de Bloom ?
Imaginez une « boîte noire magique » :
- Vous demandez : « Le produit avec l'ID 123 existe-t-il ? »
- Elle répond : « **Certainement pas** » → alors il n'existe vraiment pas, pas besoin d'interroger la base
- Elle répond : « **Peut-être** » → alors il faut vérifier dans la base

**Caractéristiques** :
- **Jamais de faux négatif** : si elle dit que ça n'existe pas, c'est vrai
- **Possibilité de faux positif** : si elle dit que ça existe peut-être, il se peut que ça n'existe pas (probabilité faible, ajustable)

**Valeur** : le filtre de Bloom peut intercepter 99 % des requêtes « inexistantes » avant même d'interroger le cache, protégeant ainsi la base de données.
:::

```javascript
// Utilisation d'un filtre de Bloom
const { BloomFilter } = require('bloom-filters')

// Initialisation du filtre de Bloom (en supposant au maximum 1 million d'IDs de produits)
const bloomFilter = new BloomFilter(1000000, 0.01)  // taux de faux positifs 1 %

// Au démarrage, ajouter tous les IDs de produits au filtre de Bloom
async function initBloomFilter() {
  const allIds = await db.query('SELECT id FROM products')
  allIds.forEach(row => {
    bloomFilter.add(row.id)
  })
}

// Avant de chercher un produit, utiliser le filtre de Bloom
async function getProduct(productId) {
  // 1. D'abord, vérifier avec le filtre de Bloom
  if (!bloomFilter.has(productId)) {
    // Certainement pas, retourner null directement, pas besoin d'interroger la base
    console.log('Filtre de Bloom intercepte : produit inexistant')
    return null
  }

  // 2. Le filtre de Bloom dit « peut-être », vérifier le cache
  const cached = await redis.get(`product:${productId}`)
  if (cached) {
    return JSON.parse(cached)
  }

  // 3. Cache miss, interroger la base
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  if (!product) {
    // Faux positif du filtre de Bloom (très rare), n'existe pas réellement
    await redis.setex(`product:${productId}`, 300, 'null')
    return null
  }

  // 4. Donnée trouvée, écrire dans le cache
  await redis.setex(`product:${productId}`, 1800, JSON.stringify(product))
  return product
}
```

### 4.2 Cache Hotspot Invalidation : expiration d'une donnée chaude

**Définition** : une **donnée très chaude** (produit populaire, actualité tendance) expire dans le cache (fin du TTL). À ce moment, un grand nombre de requêtes concurrentes arrivent simultanément et vont toutes interroger la base de données, provoquant un pic de pression.

::: tip 🤔 La Cache Hotspot Invalidation expliquée par l'analogie du livre convoité
Imaginez qu'à la bibliothèque, *Harry Potter* est ultra-populaire, 100 personnes veulent l'emprunter.

**Situation normale** :
- La bibliothèque place *Harry Potter* au « comptoir de prêt » (le cache)
- Tout le monde le prend directement au comptoir, sans aller dans les rayons

**Scénario de Cache Hotspot Invalidation** :
- Le *Harry Potter* du comptoir arrive à expiration (il est retourné en rayon)
- 100 personnes arrivent en même temps, découvrent que le comptoir est vide
- Les 100 personnes se ruent vers les rayons (la base de données)
- Le responsable des rayons (la base de données) est submergé

**Problème** : ce n'est pas un « livre inexistant », mais un « livre ultra-populaire » qui disparaît soudainement du cache, provoquant un afflux massif et instantané de requêtes vers la base de données.
:::

**Scénarios réels** :
- Le classement des tendances Weibo expire, des dizaines de milliers de personnes accèdent simultanément
- Le cache d'une actualité people expire, les fans se ruent dessus
- Le cache des stocks expire au démarrage d'une vente flash

**Solution 1 : Verrou mutex (Mutex Lock)**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // 1. Vérifier d'abord le cache
  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  // 2. Cache miss, acquérir un verrou distribué
  const lockKey = `lock:${productId}`
  const lock = await redis.set(lockKey, '1', 'NX', 'EX', 10)  // verrou de 10 secondes

  if (lock === 'OK') {
    // 3. Verrou acquis, interroger la base
    console.log('Verrou acquis, interrogation de la base de données')
    const product = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    )

    // 4. Écrire dans le cache
    await redis.setex(cacheKey, 1800, JSON.stringify(product))

    // 5. Libérer le verrou
    await redis.del(lockKey)
    return product
  } else {
    // 6. Verrou non acquis, attendre 50 ms puis réessayer
    console.log('Échec d\'acquisition du verrou, nouvelle tentative après attente')
    await new Promise(resolve => setTimeout(resolve, 50))
    return getProduct(productId)  // réessayer récursivement
  }
}
```

**Solution 2 : Expiration logique (Logical Expiration)**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // 1. Vérifier le cache
  const cached = await redis.get(cacheKey)
  if (cached) {
    const data = JSON.parse(cached)

    // 2. Vérifier le temps d'expiration logique
    if (Date.now() < data.expireTime) {
      // Pas encore expiré, renvoyer directement
      return data.product
    } else {
      // 3. Expiration logique, reconstruire le cache en asynchrone, renvoyer l'ancienne donnée
      console.log('Expiration logique, reconstruction asynchrone du cache')
      rebuildCacheAsync(productId)  // reconstruction asynchrone
      return data.product  // renvoyer l'ancienne donnée
    }
  }

  // 4. Cache inexistant (premier chargement), interroger la base en synchrone
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // 5. Écrire dans le cache (avec temps d'expiration logique)
  const cacheData = {
    product: product,
    expireTime: Date.now() + 30 * 60 * 1000  // expiration logique dans 30 minutes
  }
  await redis.set(cacheKey, JSON.stringify(cacheData))

  return product
}

// Reconstruction asynchrone du cache
async function rebuildCacheAsync(productId) {
  const lockKey = `rebuild:${productId}`
  const lock = await redis.set(lockKey, '1', 'NX', 'EX', 10)

  if (lock === 'OK') {
    console.log('Début de la reconstruction asynchrone du cache')
    const product = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    )

    const cacheData = {
      product: product,
      expireTime: Date.now() + 30 * 60 * 1000
    }
    await redis.set(`product:${productId}`, JSON.stringify(cacheData))
    await redis.del(lockKey)
    console.log('Reconstruction asynchrone du cache terminée')
  }
}
```

### 4.3 Cache Avalanche : expiration massive et simultanée

**Définition** : un grand nombre de données en cache **expirent au même moment** (ou Redis tombe en panne), de sorte que toutes les requêtes traversent simultanément vers la base de données, l'écrasant instantanément.

::: tip 🤔 La Cache Avalanche expliquée par l'analogie du retour massif de livres
Imaginez que le « comptoir de prêt » (le cache) de la bibliothèque contienne 1000 livres.

**Situation normale** :
- Les dates de retour de ces livres sont échelonnées : certains aujourd'hui, d'autres demain, d'autres après-demain
- Quelques dizaines de livres arrivent à expiration chaque jour, le responsable (la base de données) gère facilement

**Scénario de Cache Avalanche** :
- Après un redémarrage du système, le responsable définit « retour dans 30 jours » pour les 1000 livres
- 30 jours plus tard, les 1000 livres expirent en même temps
- 1000 personnes arrivent simultanément pour emprunter, découvrent que le comptoir est vide
- Les 1000 personnes se ruent vers les rayons
- Le responsable des rayons (la base de données) est instantanément submergé

**Problème** : ce n'est pas le problème d'un seul livre, mais l'**expiration simultanée d'un grand nombre de données**, qui provoque un pic de pression instantané sur la base de données.
:::

**Scénarios réels** :
- Après un redémarrage, tous les caches sont reconstruits depuis zéro avec le même TTL (ex. 30 minutes)
- Une tâche planifiée rafraîchit les caches par lots avec la même durée d'expiration
- Le service de cache (Redis) tombe en panne ou subit une partition réseau

**Solution 1 : TTL aléatoire**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // Clé : ajouter une valeur aléatoire (±5 minutes) au TTL de base (30 minutes)
  const baseTTL = 1800  // 30 minutes
  const randomOffset = Math.floor(Math.random() * 600) - 300  // -5 à +5 minutes
  const finalTTL = baseTTL + randomOffset

  console.log(`TTL du cache : ${finalTTL} secondes (${Math.floor(finalTTL / 60)} minutes)`)
  await redis.setex(cacheKey, finalTTL, JSON.stringify(product))

  return product
}
```

**Solution 2 : Cache Preheating (préchauffage du cache)**

```javascript
// Au démarrage du système, charger proactivement les données chaudes dans le cache
async function cacheWarmup() {
  console.log('Début du préchauffage du cache...')

  // 1. Récupérer les 1000 produits les plus populaires (triés par nombre de vues)
  const hotProducts = await db.query(`
    SELECT * FROM products
    ORDER BY view_count DESC
    LIMIT 1000
  `)

  // 2. Écriture par lot dans Redis
  for (const product of hotProducts) {
    const cacheKey = `product:${product.id}`
    const ttl = 1800 + Math.floor(Math.random() * 600)  // 30 minutes ± 5 minutes
    await redis.setex(cacheKey, ttl, JSON.stringify(product))
  }

  console.log(`Préchauffage du cache terminé, ${hotProducts.length} produits populaires chargés`)
}

// Exécuter au démarrage de l'application
cacheWarmup()
```

**Solution 3 : Circuit Breaker (disjoncteur)**

```javascript
// Utiliser un disjoncteur pour protéger la base de données
const CircuitBreaker = require('opossum')

// Configurer le disjoncteur
const dbQueryBreaker = new CircuitBreaker(
  async (productId) => {
    return await db.query('SELECT * FROM products WHERE id = ?', [productId])
  },
  {
    timeout: 3000,  // timeout de 3 secondes
    errorThresholdPercentage: 50,  // disjoncter si le taux d'erreur dépasse 50 %
    resetTimeout: 30000  // tentative de reprise après 30 secondes
  }
)

// Traitement dégradé après disjonction
dbQueryBreaker.fallback(() => {
  console.log('Base de données disjonctée, renvoi des données dégradées')
  return {
    id: productId,
    name: 'Service occupé, veuillez réessayer plus tard',
    status: 'degraded'
  }
})

async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  // Interroger la base via le disjoncteur
  const product = await dbQueryBreaker.fire(productId)

  if (product.status === 'degraded') {
    return product  // renvoyer les données dégradées
  }

  await redis.setex(cacheKey, 1800, JSON.stringify(product))
  return product
}
```

👇 **Essayez par vous-même** :
La démonstration ci-dessous compare les scénarios et solutions des trois problèmes de cache : Penetration, Hotspot Invalidation et Avalanche :

<CacheProblemsDemo />

---

## 5. Stratégies de cohérence du cache : synchroniser le cache et la base de données

Le cache est par essence une copie des données. Entre la copie et les données originales (base de données), il existe inévitablement une fenêtre d'incohérence temporelle. Maîtriser cette fenêtre est le défi central de la conception d'un cache.

### 5.1 Pourquoi le cache et la base de données deviennent-ils incohérents

::: tip 🤔 L'incohérence expliquée par l'analogie du post-it et du livre
Imaginez que vous avez noté sur un post-it : « Tél de Xiaoming : 123456 ». C'est une copie de votre répertoire (la base de données).

**Scénario d'incohérence** :
- Vous mettez à jour le répertoire, le numéro de Xiaoming devient « 7654321 »
- Mais vous oubliez de mettre à jour le post-it
- La prochaine fois que vous cherchez le numéro, vous regardez le post-it : c'est encore l'ancien « 123456 »

**Problème** : le post-it (cache) et le répertoire (base de données) sont incohérents.

**Cause** : les données originales ont été mises à jour, mais la copie n'a pas été synchronisée. Dans un système informatique, c'est parce que « mettre à jour la base » et « mettre à jour le cache » sont deux opérations indépendantes avec un intervalle de temps entre elles, qui peut être perturbé par d'autres opérations.
:::

**Scénario concurrent réel** :

| Temps | Thread A (mise à jour âge utilisateur) | Thread B (recherche utilisateur) | Base de données | Cache |
|------|---------------------|------------------|--------|------|
| T1 | Début mise à jour base | - | age=20 | age=20 |
| T2 | Base mise à jour age=25 | Cherche dans le cache, lit age=20 | age=25 | age=20 ❌ |
| T3 | Supprime le cache | - | age=25 | - |
| T4 | - | - | age=25 | Chargé depuis la base age=25 ✅ |

**Problème** : au moment T2, le thread B lit l'ancienne valeur 20 dans le cache, alors que la base est déjà à 25. C'est l'**incohérence du cache**.

### 5.2 Bonne pratique : mettre à jour la base d'abord, puis supprimer le cache

::: tip 🤔 Pourquoi « supprimer » plutôt que « mettre à jour » le cache ?
Vous vous demandez peut-être : pourquoi ne pas directement « mettre à jour le cache » au lieu de « supprimer le cache » ?

**Problèmes de la mise à jour du cache** :
- En cas de mises à jour concurrentes, le thread A peut mettre à jour le cache en premier, puis le thread B met à jour la base mais pas le cache
- La mise à jour du cache peut être coûteuse (par exemple, agréger des données de plusieurs tables)
- Si les données sont supprimées après la mise à jour, l'effort est gaspillé

**Avantages de la suppression du cache** :
- Lors de la prochaine requête, les données les plus récentes sont chargées automatiquement depuis la base (lazy loading)
- Évite les données sales dues aux mises à jour concurrentes
- Simple et fiable, c'est la meilleure pratique de l'industrie
:::

**Procédure standard** :

```javascript
// Mettre à jour les informations d'un produit
async function updateProduct(productId, updateData) {
  // 1. D'abord, mettre à jour la base de données
  await db.query(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [updateData.name, updateData.price, productId]
  )

  // 2. Ensuite, supprimer le cache (pas le mettre à jour !)
  await redis.del(`product:${productId}`)

  // 3. À la prochaine requête, cache miss, chargement automatique depuis la base
  console.log('Mise à jour terminée, cache supprimé')
}
```

::: details Voir pourquoi « mettre à jour la base puis supprimer le cache » est la meilleure approche
Comparaison des trois stratégies de mise à jour :

**Stratégie 1 : Mettre à jour le cache d'abord, puis la base** ❌ Déconseillée
```javascript
// Problème : si la mise à jour de la base échoue, le cache a la nouvelle valeur, la base l'ancienne, incohérence
await redis.set('product:1', newProduct)  // mise à jour du cache réussie
await db.query('UPDATE products SET ...')  // échec de la mise à jour de la base !
// Résultat : le cache a la nouvelle valeur, la base l'ancienne, incohérence permanente !
```

**Stratégie 2 : Supprimer le cache d'abord, puis mettre à jour la base** ❌ Déconseillée
```javascript
// Problème : entre la suppression et la mise à jour, un autre thread peut charger l'ancienne donnée dans le cache
await redis.del('product:1')  // suppression du cache
// À ce moment, le thread B arrive, ne trouve pas le cache, interroge la base (ancienne valeur), écrit dans le cache
await db.query('UPDATE products SET ...')  // mise à jour de la base
// Résultat : le cache a l'ancienne valeur, la base la nouvelle, incohérence !
```

**Stratégie 3 : Mettre à jour la base d'abord, puis supprimer le cache** ✅ Recommandée
```javascript
// Avantage : la mise à jour de la base pose un verrou de ligne, les autres threads doivent attendre, évite les données sales
await db.query('UPDATE products SET ...')  // mise à jour de la base (verrou de ligne)
await redis.del('product:1')  // suppression du cache
// Même si la suppression du cache échoue, la prochaine requête retournera à la source, sans données sales persistantes
```

**Pourquoi la stratégie 3 est-elle optimale ?**
1. **Protection par verrou de base de données** : l'opération de mise à jour acquiert un verrou de ligne, les autres opérations doivent attendre
2. **Impact limité d'un échec de suppression** : même si la suppression du cache échoue, la prochaine lecture retournera simplement à la source, sans introduire de données sales
3. **Simple et fiable** : pas besoin de logique complexe supplémentaire
:::

### 5.3 Double suppression différée : garantie de cohérence pour les scénarios extrêmes

**Scénario** : en haute concurrence, même avec « mettre à jour la base puis supprimer le cache », il existe une probabilité infime d'incohérence. La double suppression différée maximise la cohérence grâce à deux suppressions.

**Procédure** :
```
1. Supprimer le cache
2. Mettre à jour la base de données
3. Attendre un certain temps (ex. 500 ms)
4. Supprimer à nouveau le cache
```

```javascript
async function updateProduct(productId, updateData) {
  const cacheKey = `product:${productId}`

  // 1. Première suppression du cache
  await redis.del(cacheKey)

  // 2. Mettre à jour la base de données
  await db.query(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [updateData.name, updateData.price, productId]
  )

  // 3. Attendre 500 ms (laisser les autres threads terminer leur requête)
  await new Promise(resolve => setTimeout(resolve, 500))

  // 4. Deuxième suppression du cache (supprimer les anciennes données potentiellement chargées par d'autres threads)
  await redis.del(cacheKey)

  console.log('Double suppression différée terminée, données synchronisées')
}
```

**Comparaison des trois stratégies de cohérence** :

| Stratégie | Niveau de cohérence | Impact performance | Complexité | Scénario adapté |
|------|-----------|---------|--------|---------|
| **Mettre à jour la base, puis supprimer le cache** | Cohérence finale (fenêtre < 100 ms) | Faible | Faible | La plupart des scénarios, recommandé par défaut |
| **Double suppression différée** | Cohérence finale forte (fenêtre < 10 ms) | Moyen (délai 500 ms) | Moyen | Scénarios exigeants en cohérence (finance, stocks) |
| **Supprimer le cache, puis mettre à jour la base** | Faible (grande fenêtre d'incohérence) | Faible | Faible | ❌ Déconseillé, risque élevé d'incohérence |

👇 **Essayez par vous-même** :
La démonstration ci-dessous compare l'effet des trois stratégies de cohérence. Cliquez sur « Mettre à jour les données » et observez l'évolution de la cohérence entre le cache et la base :

<CacheConsistencyDemo />

---

## 6. Mise en pratique : construire un système de cache complet

Après toute cette théorie, passons à un cas concret : comment concevoir un système de cache complet pour une page de détail produit e-commerce.

### 6.1 Analyse du scénario métier

**Besoin** : l'utilisateur visite une page de détail produit, qui doit afficher les informations de base, le prix, le stock, les avis, etc.

**Caractéristiques** :
- **Lecture intensive, écriture rare** : 100 lectures pour 1 écriture (ratio 100:1)
- **Concentration des points chauds** : 20 % des produits génèrent 80 % du trafic
- **Données complexes** : informations de base + prix + stock + agrégation d'avis
- **Exigences de cohérence** : cohérence forte pour le prix et le stock, cohérence finale pour le reste

**Indicateurs de performance** :
- Temps de réponse P99 < 100 ms (99 % des requêtes répondent en moins de 100 ms)
- QPS maximal de la base < 5000
- Taux de succès du cache > 95 %

### 6.2 Conception de l'architecture

**Architecture de cache multi-niveaux** :

```
Requête utilisateur
  ↓
Cache CDN (ressources statiques : images, CSS, JS)
  ↓ échec
Cache local Nginx (agrégation des informations de base du produit)
  ↓ échec
Serveur d'application
  ↓
  ├─ L1 : Cache local (Caffeine, produits populaires)
  │   ↓ échec
  ├─ L2 : Cache Redis (toutes les données produits)
  │   ↓ échec
  └─ L3 : Base de données MySQL (données complètes)
```

### 6.3 Implémentation du code principal

**Implémentation complète du cache multi-niveaux (version simplifiée)** :

```javascript
const caffeine = require('caffeine')

// L1 : Cache local (expiration 30 secondes)
const localCache = new caffeine.Cache({
  max: 1000,
  ttl: 30,
})

// Récupérer les détails d'un produit (cache multi-niveaux)
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // L1 : Cache local (environ 0,1 ms)
  const localCached = localCache.get(cacheKey)
  if (localCached) {
    console.log('L1 hit')
    return localCached
  }

  // L2 : Cache Redis (environ 1 ms)
  const redisCached = await redis.get(cacheKey)
  if (redisCached) {
    console.log('L2 hit, rechargement L1')
    const product = JSON.parse(redisCached)
    localCache.set(cacheKey, product)
    return product
  }

  // L3 : Base de données (environ 10 ms, avec verrou distribué anti-hotspot-invalidation)
  const lockKey = `lock:${productId}`
  const lock = await redis.set(lockKey, '1', 'NX', 'EX', 10)

  if (lock === 'OK') {
    console.log('L3 hit, interrogation de la base de données')
    const product = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    )

    if (product) {
      // Écrire dans Redis (30 minutes + TTL aléatoire)
      const ttl = 1800 + Math.floor(Math.random() * 600) - 300
      await redis.setex(cacheKey, ttl, JSON.stringify(product))
      // Recharger le cache local
      localCache.set(cacheKey, product)
    }

    await redis.del(lockKey)
    return product
  } else {
    // Échec d'acquisition du verrou, attendre puis réessayer
    await new Promise(resolve => setTimeout(resolve, 50))
    return getProduct(productId)
  }
}

// Mettre à jour les informations produit (mettre à jour la base d'abord, puis supprimer le cache)
async function updateProduct(productId, updateData) {
  const cacheKey = `product:${productId}`

  // 1. Mettre à jour la base de données
  await db.query(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [updateData.name, updateData.price, productId]
  )

  // 2. Supprimer le cache local
  localCache.del(cacheKey)

  // 3. Supprimer le cache Redis
  await redis.del(cacheKey)

  console.log('Mise à jour terminée, cache supprimé')
}
```

👇 **Essayez par vous-même** :
La démonstration ci-dessous illustre le flux de travail complet d'un système de cache multi-niveaux. Cliquez sur « Rechercher un produit » et observez comment la requête circule à travers les différents niveaux de cache :

<EcommerceCacheArchitectureDemo />

---

## 7. Résumé et parcours d'apprentissage

### 7.1 Récapitulatif des connaissances clés

| Connaissance | En une phrase | Problème résolu | Point pratique |
|--------|-----------|-----------|----------|
| **Cache Hit** | La donnée est trouvée dans le cache | Performance ×10 à ×100 | Taux de succès cible > 95 % |
| **Cache Penetration** | Données inexistantes interrogées, chaque fois jusqu'à la base | Base de données épuisée par des requêtes malveillantes | Filtre de Bloom + cache d'objet nul |
| **Cache Hotspot Invalidation** | Donnée chaude expirée, avalanche de requêtes vers la base | Pic de pression instantané sur la base | Verrou mutex + expiration logique |
| **Cache Avalanche** | Expiration massive et simultanée | Base de données écrasée | TTL aléatoire + cache preheating |
| **Cache multi-niveaux** | Cache local + Redis + Base de données | Optimisation extrême des performances | L1 cache local taux de succès 70 %, L2 Redis taux de succès 25 % |
| **Cohérence du cache** | Synchronisation cache et base de données | Exactitude des données | Mettre à jour la base d'abord, puis supprimer le cache |
| **Double suppression différée** | Supprimer le cache avant et après la mise à jour | Cohérence dans les scénarios extrêmes | Attendre 500 ms avant la deuxième suppression |

### 7.2 Parcours d'apprentissage suggéré

**Phase 1 : Comprendre les principes (1-2 jours)**
- Maîtriser l'essence du cache (copie de données, échanger de l'espace contre du temps)
- Comprendre les concepts clés : taux de succès, TTL, éviction
- Connaître les différences de performance entre les supports de stockage (mémoire vs disque)

**Phase 2 : Maîtriser les bases (2-3 jours)**
- Apprendre à utiliser Redis comme cache (commandes SET, GET, SETEX)
- Implémenter une logique simple de lecture/écriture avec cache (vérifier le cache d'abord, interroger la base si échec)
- Comprendre pourquoi « supprimer le cache plutôt que le mettre à jour » lors d'une modification

**Phase 3 : Résoudre les problèmes classiques (1 semaine)**
- Résoudre la Cache Penetration : implémenter un filtre de Bloom ou un cache d'objet nul
- Résoudre la Cache Hotspot Invalidation : implémenter un verrou mutex ou une expiration logique
- Résoudre la Cache Avalanche : implémenter un TTL aléatoire et un cache preheating

**Phase 4 : Cache multi-niveaux (1-2 semaines)**
- Introduire un cache local (Caffeine/Guava)
- Concevoir une architecture à deux niveaux : cache local + Redis
- Gérer les problèmes de cohérence du cache multi-niveaux

**Phase 5 : Mise en production (continu)**
- Concevoir un système de cache complet pour une page de détail produit
- Mettre en place le monitoring (taux de succès du cache, temps de réponse)
- Effectuer des tests de charge et des optimisations de performance

::: info 💡 En conclusion
Le cache est la pierre angulaire des systèmes à haute concurrence. De la page de détail produit de Taobao au classement des tendances de Weibo, du fil d'actualité de WeChat au flux vidéo de TikTok, tous les systèmes performants reposent sur une architecture de cache soigneusement conçue.

Comprendre le cache, ce n'est pas seulement apprendre une technologie, c'est assimiler la pensée architecturale qui consiste à **échanger de l'espace contre du temps, et à protéger les données maîtres par des copies**. Lorsque vous maîtriserez vraiment le cache, les performances de votre système passeront de « ça marche » à « ça marche bien », pour finalement atteindre « l'excellence ».

Nous espérons que cet article vous aidera à acquérir une compréhension complète des systèmes de cache. Lorsque vous rencontrerez des problèmes de performance dans vos projets, vous pourrez vous demander : « Puis-je résoudre cela avec un cache ? »
:::