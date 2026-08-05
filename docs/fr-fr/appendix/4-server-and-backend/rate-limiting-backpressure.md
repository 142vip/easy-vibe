# Principes : Limitation de débit et contre-pression

::: tip Préface
**Le jour du Double Onze à minuit, des centaines de millions d'utilisateurs se ruent simultanément — le serveur peut-il résister ?** Tout système a une capacité de traitement maximale. Lorsque le volume de requêtes dépasse la capacité du système, sans contrôle, le résultat est que personne ne peut l'utiliser. La limitation de débit et la contre-pression sont les deux lignes de défense qui protègent le système contre la surcharge.
:::

**Que allez-vous apprendre dans cet article ?**

Après avoir étudié ce chapitre, vous serez en mesure de :

- **Comprendre la nécessité de la limitation** : comprendre pourquoi il faut refuser activement certaines requêtes pour protéger le système
- **Maîtriser les algorithmes de limitation** : comprendre les principes et les différences des trois algorithmes clés : seau à jetons, seau à fuite, fenêtre glissante
- **Mécanisme de contre-pression** : comprendre les stratégies de traitement lorsque la vitesse amont dépasse la vitesse aval
- **Limitation multi-niveaux** : découvrir l'architecture de limitation multi-niveaux du client à la passerelle et au service
- **Capacité pratique** : savoir quelle stratégie de limitation choisir dans quel scénario

| Chapitre | Contenu | Concept clé |
|-----|------|---------|
| **Chapitre 1** | Pourquoi la limitation est nécessaire | Effet avalanche, protection des services |
| **Chapitre 2** | Algorithmes de limitation | Seau à jetons, seau à fuite, fenêtre glissante |
| **Chapitre 3** | Contrôle de contre-pression | Tampon, stratégie de rejet, mise à l'échelle élastique |
| **Chapitre 4** | Architecture de limitation multi-niveaux | Client, passerelle, côté serveur |
| **Chapitre 5** | Pratique et sélection | Nginx, Redis, Sentinel |

---

## 0. Vue d'ensemble : pourquoi « refuser » des utilisateurs

Cela semble contre-intuitif — ne devrions-nous pas servir au mieux chaque utilisateur ? Mais la réalité est que **sans refuser certaines requêtes, toutes les requêtes échoueront**.

Imaginez un restaurant qui ne peut accueillir que 100 personnes et où 1 000 personnes se ruent soudainement à l'intérieur. Sans limitation de débit, le résultat n'est pas que les 1 000 personnes pourront manger, mais que la cuisine s'effondre, les serveurs sont paralysés, et personne ne peut manger. La bonne approche est de limiter le flux à l'entrée en faisant patienter les autres, en laissant entrer les 100 premières personnes.

::: tip Objectif principal de la limitation de débit
- **Protéger le système** : éviter la surcharge qui rendrait le service totalement indisponible
- **Allocation équitable** : garantir que les requêtes acceptées puissent être traitées normalement
- **Dégradation gracieuse** : les requêtes limitées reçoivent un code d'état 429 explicite, plutôt qu'un délai d'attente ou une erreur 500
:::

---

## 1. Algorithmes de limitation : trois solutions classiques

Le problème central de la limitation est : **dans un intervalle de temps donné, combien de requêtes sont autorisées au maximum à passer ?** Les différents algorithmes offrent des compromis entre précision, gestion du trafic en rafale et complexité de mise en œuvre.

<RateLimitAlgorithmDemo />

| Algorithme | Principe | Trafic en rafale | Précision | Complexité de mise en œuvre |
|------|------|---------|--------|-----------|
| Seau à jetons | Débit fixe de jetons, les requêtes consomment des jetons | Autorisé (si le seau a un stock) | Élevée | Moyenne |
| Seau à fuite | Les requêtes sont mises en file d'attente, traitement à débit fixe | Non autorisé (lissage complet) | Élevée | Moyenne |
| Fenêtre glissante | Comptage des requêtes dans la fenêtre | Partiellement autorisé | Assez élevée | Faible |
| Fenêtre fixe | Comptage par fenêtre temporelle | Rafale possible aux limites | Faible | La plus faible |

::: tip Quel algorithme choisir ?
- **Limitation d'API** : le seau à jetons est le plus courant, il autorise des rafales raisonnables
- **Façonnage du trafic** : le seau à fuite convient aux scénarios nécessitant un débit de sortie constant
- **Comptage simple** : la fenêtre glissante est simple à implémenter et convient à la plupart des applications Web
:::

---

## 2. Contrôle de contre-pression : quand l'amont est plus rapide que l'aval

La limitation de débit résout le problème des « requêtes externes trop nombreuses », tandis que la **contre-pression (Backpressure)** résout le problème de « la vitesse des composants internes ne correspond pas ».

Lorsque le producteur produit des données plus rapidement que le consommateur ne peut les traiter, le tampon intermédiaire ne cesse de grossir, entraînant finalement un débordement de mémoire ou une perte de données. Le mécanisme de contre-pression permet au consommateur de « notifier en retour » le producteur pour qu'il ralentisse.

<BackpressureDemo />

::: tip Quatre stratégies de contre-pression
1. **Rejet (Drop)** : lorsque le tampon est plein, rejeter les nouvelles ou les anciennes données, adapté aux scénarios où l'exigence de temps réel est élevée mais la perte est acceptable
2. **Blocage (Block)** : mettre en pause le producteur jusqu'à ce que le consommateur ait terminé, adapté aux scénarios où les données ne peuvent pas être perdues
3. **Échantillonnage (Sample)** : ne traiter qu'une partie des données, adapté aux flux de données à haute fréquence
4. **Mise à l'échelle élastique (Scale)** : augmenter dynamiquement le nombre de consommateurs, adapté aux environnements natifs cloud
:::

---

## 3. Architecture de limitation multi-niveaux

En production, la limitation de débit à un seul point ne suffit pas ; il faut une **protection multi-niveaux**, chaque niveau résolvant un problème de granularité différent.

| Niveau | Position | Granularité de limitation | Outils |
|------|------|---------|------|
| Client | Frontend/App | Anti-rebond de bouton, limitation de requêtes | lodash.throttle, debounce |
| CDN/WAF | Nœud de périphérie | Niveau IP, niveau régional | Cloudflare Rate Limiting |
| Passerelle API | Passerelle d'entrée | Niveau de route, niveau utilisateur | Nginx limit_req, Kong |
| Côté serveur | Application interne | Niveau d'interface, niveau de ressource | Sentinel, Resilience4j |
| Base de données | Couche de stockage | Nombre de connexions, QPS | Configuration du pool de connexions, coupure des requêtes lentes |

::: tip Spécification HTTP pour la limitation
Les requêtes limitées doivent renvoyer le code d'état `429 Too Many Requests` et inclure dans les en-têtes de réponse :
- `Retry-After` : délai suggéré avant une nouvelle tentative (en secondes ou date)
- `X-RateLimit-Limit` : plafond de limitation
- `X-RateLimit-Remaining` : quota restant
- `X-RateLimit-Reset` : heure de réinitialisation du quota
:::

---

## 4. Sélection pratique

| Scénario | Solution recommandée | Description |
|------|---------|------|
| Limitation à l'entrée Nginx | `limit_req_zone` | Basé sur l'algorithme du seau à fuite, configuration simple |
| Limitation distribuée | Redis + script Lua | Seau à jetons ou fenêtre glissante, comptage partagé entre instances |
| Microservices Java | Sentinel / Resilience4j | Supporte la coupure de circuit, la dégradation, la limitation des points chauds |
| API Node.js | express-rate-limit | Simple d'utilisation, supporte le stockage Redis |
| Service Go | golang.org/x/time/rate | Implémentation standard du seau à jetons |

---

## Résumé

La limitation de débit et la contre-pression sont les deux lignes de défense clés pour protéger la stabilité du système. La limitation de débit contrôle la vitesse d'afflux du trafic externe, tandis que la contre-pression coordonne la vitesse de traitement des composants internes.

Récapitulatif des points clés de ce chapitre :

1. **Nécessité de la limitation** : sans refuser certaines requêtes, toutes les requêtes échoueront
2. **Trois algorithmes clés** : seau à jetons (autorise les rafales), seau à fuite (lissage complet), fenêtre glissante (simple et précis)
3. **Mécanisme de contre-pression** : quatre stratégies — rejet, blocage, échantillonnage, mise à l'échelle
4. **Protection multi-niveaux** : du client à la base de données, chaque niveau résout un problème de granularité différent
5. **Spécification 429** : en cas de limitation, renvoyer le code d'état standard et les en-têtes de limitation

## Pour aller plus loin

- [Pratique de limitation chez Stripe](https://stripe.com/blog/rate-limiters) - Conception de limitation pour les systèmes de paiement
- [Documentation Nginx limit_req](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html) - Module de limitation Nginx
- [Alibaba Sentinel](https://sentinelguard.io/) - Composant de contrôle de trafic pour services distribués
- [Resilience4j](https://resilience4j.readme.io/) - Bibliothèque Java légère de tolérance aux pannes
- [Explication détaillée de l'algorithme du seau à jetons](https://en.wikipedia.org/wiki/Token_bucket) - Principes mathématiques de l'algorithme du seau à jetons
