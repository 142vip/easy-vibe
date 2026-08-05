# Panorama : Trajet complet d'une requête Web

::: tip Préface
**Lorsque vous saisissez une adresse web dans votre navigateur et appuyez sur Entrée, que se passe-t-il jusqu'à l'affichage de la page ?** C'est une question classique d'entretien, mais surtout la clé pour comprendre toute l'architecture Web. Comprendre cette chaîne vous permettra de saisir comment le frontend, le backend, le réseau et les bases de données collaborent.
:::

**Que allez-vous apprendre dans cet article ?**

Après avoir étudié ce chapitre, vous serez en mesure de :

- **Vision globale** : comprendre le processus complet d'une requête HTTP de l'envoi au retour
- **Rôle de chaque couche** : comprendre ce que font DNS, TCP, l'équilibrage de charge, le serveur Web, le serveur d'application et la base de données
- **Capacité de diagnostic** : savoir à quel niveau chercher quand une requête est lente ou échoue
- **Idées d'optimisation** : chaque couche a une marge d'optimisation, savoir où se trouvent les points d'optimisation

| Chapitre | Contenu | Concept clé |
|-----|------|---------|
| **Chapitre 1** | Le navigateur envoie la requête | Résolution DNS, connexion TCP, requête HTTP |
| **Chapitre 2** | Le transport réseau | Routage, CDN, équilibrage de charge |
| **Chapitre 3** | Le traitement côté serveur | Serveur Web, logique applicative, requête en base de données |
| **Chapitre 4** | Le retour de la réponse | Sérialisation, compression, rendu |
| **Chapitre 5** | L'optimisation globale | Cache, réutilisation de connexion, traitement asynchrone |

---

## 0. Vue d'ensemble : que traverse une requête

Prenons une analogie : vous commandez un livre en ligne. Ce processus est étonnamment similaire à une requête HTTP.

| Phase de la requête | Analogie avec l'achat de livre | Correspondance technique |
|---------|---------|---------|
| Saisie de l'URL | Vous dites "je vais à telle librairie" | Le navigateur analyse l'URL |
| Résolution DNS | Chercher l'adresse de la librairie sur une carte | Nom de domaine -> adresse IP |
| Connexion TCP | Arriver devant la librairie, pousser la porte | Établissement de connexion par triple handshake |
| Envoi de la requête | Dire au vendeur "je veux le livre xxx" | Message de requête HTTP |
| Traitement serveur | Le vendeur cherche le livre en réserve, vérifie le stock, calcule le prix | Logique applicative + requête en base de données |
| Retour de la réponse | Le vendeur vous remet le livre | Message de réponse HTTP |
| Rendu par le navigateur | Vous ouvrez le livre et commencez à lire | Analyse et rendu HTML/CSS/JS |

<RequestJourneyFlow />

---

## 1. Le navigateur envoie la requête

### 1.1 Analyse de l'URL

Lorsque vous saisissez `https://api.example.com/books?id=123`, le navigateur la décompose en plusieurs parties :

| Partie | Valeur | Signification |
|-----|-----|------|
| Protocole | `https` | Communication chiffrée |
| Nom de domaine | `api.example.com` | Le "nom" du serveur |
| Chemin | `/books` | La ressource à accéder |
| Paramètres de requête | `id=123` | Conditions supplémentaires |

### 1.2 Résolution DNS : nom de domaine -> adresse IP

Les ordinateurs ne comprennent pas les noms de domaine, seulement les adresses IP (comme `93.184.216.34`). DNS est l'"annuaire téléphonique" d'Internet.

```
Cache du navigateur -> Cache du système -> Cache du routeur -> DNS du FAI -> Serveur de noms racine
     Si trouvé, on l'utilise directement ; sinon, on descend
```

::: tip L'importance du cache DNS
Si chaque requête devait interroger le serveur de noms racine, l'Internet mondial serait submergé par les requêtes DNS. C'est pourquoi chaque niveau dispose d'un cache, et la grande majorité des requêtes peuvent être résolues au niveau du navigateur ou du système.
:::

### 1.3 Triple handshake TCP

Une fois l'adresse IP trouvée, le navigateur doit "établir une connexion" avec le serveur. TCP utilise un triple handshake pour s'assurer que les deux parties sont prêtes :

```
Client -> Serveur : Bonjour, je voudrais me connecter (SYN)
Serveur -> Client : D'accord, je suis prêt (SYN + ACK)
Client -> Serveur : Reçu, commençons la communication (ACK)
```

S'il s'agit de HTTPS, un handshake TLS supplémentaire est nécessaire pour négocier le chiffrement.

### 1.4 Envoi de la requête HTTP

Une fois la connexion établie, le navigateur envoie le message de requête HTTP :

```http
GET /books?id=123 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbGci...
User-Agent: Chrome/120.0
```

| Composant | Contenu |
|---------|------|
| Ligne de requête | Méthode (GET) + chemin + version du protocole |
| En-têtes de requête | Métadonnées : authentification, format de données attendu, etc. |
| Corps de la requête | Uniquement pour POST/PUT, contient les données à soumettre |

---

## 2. Le transport réseau : la requête en chemin

### 2.1 Routage et transfert

Une fois la requête partie de votre ordinateur, elle traverse plusieurs routeurs, comme un colis passant par plusieurs centres de tri :

```
Votre ordinateur -> Routeur domestique -> Réseau de l'opérateur -> Réseau fédérateur -> Datacenter cible
```

Chaque routeur décide du "prochain saut" en fonction de l'adresse IP. Vous pouvez utiliser la commande `traceroute` pour voir les nœuds traversés par la requête.

### 2.2 Accélération CDN

Si le site cible utilise un CDN (réseau de distribution de contenu), la requête peut ne pas atteindre le serveur d'origine :

| Scénario | Destination |
|-----|------|
| Requête de ressources statiques (images, CSS, JS) | Retour direct par le nœud de périphérie CDN |
| Requête de données dynamiques (API) | Traversée du CDN, atteinte du serveur d'origine |

L'essence du CDN est de "placer le contenu à l'avance au plus près de l'utilisateur".

### 2.3 Équilibrage de charge

Les grands sites ne se contentent pas d'un seul serveur. L'équilibreur de charge répartit les requêtes sur plusieurs serveurs :

```
Requête utilisateur -> Équilibreur de charge -> Serveur A (30 % du trafic)
                                       -> Serveur B (30 % du trafic)
                                       -> Serveur C (40 % du trafic)
```

Stratégies de répartition courantes :

| Stratégie | Principe | Scénario d'utilisation |
|-----|------|---------|
| Tourniquet (Round Robin) | Répartition séquentielle | Serveurs de configuration identique |
| Tourniquet pondéré | Répartition selon les poids | Serveurs de configuration différente |
| Hachage IP | Un même utilisateur est toujours dirigé vers le même serveur | Nécessité de maintien de session |
| Moins de connexions | Diriger vers le serveur ayant le moins de connexions actuelles | Temps de traitement des requêtes très variable |

---

## 3. Le traitement côté serveur : que se passe-t-il en cuisine

Une fois arrivée au serveur, la requête traverse plusieurs couches de traitement.

### 3.1 Serveur Web (Nginx / Apache)

Le premier à recevoir la requête est généralement le serveur Web. Il est responsable de :

| Responsabilité | Description |
|-----|------|
| Service de fichiers statiques | Retour direct de HTML, CSS, JS, images |
| Proxy inverse | Transmission des requêtes API vers l'application backend |
| Terminaison SSL | Traitement du chiffrement/déchiffrement HTTPS |
| Filtrage de requêtes | Interception des requêtes malveillantes, limitation de débit |

### 3.2 Traitement par le serveur d'application

Le serveur Web transmet la requête au serveur d'application (Node.js, Spring, Django, etc.). Le flux de traitement :

```
Entrée de la requête -> Chaîne de middlewares -> Correspondance de route -> Contrôleur -> Couche service -> Couche d'accès aux données
```

**Ce que fait le middleware** :

1. Analyse du corps de la requête (JSON, données de formulaire)
2. Vérification de l'identité (vérification du Token)
3. Vérification des permissions (cet utilisateur peut-il accéder à cette interface ?)
4. Journalisation (qui a accédé à quoi et quand)

### 3.3 Requête en base de données

La plupart des requêtes finissent par interagir avec la base de données :

```
Code applicatif : SELECT * FROM books WHERE id = 123
    |
Moteur de base de données : analyse SQL -> optimisation de requête -> plan d'exécution -> lecture des données
    |
Résultat retourné : { id: 123, title: "xxx", price: 59.9 }
```

::: tip La base de données est le goulot d'étranglement le plus courant
Le transfert réseau se compte généralement en millisecondes, la logique applicative est aussi rapide, mais une requête en base de données sans index peut prendre plusieurs secondes voire dizaines de secondes. Ainsi, les "requêtes lentes" sont très probablement dues à des requêtes en base de données lentes.
:::

---

## 4. Le retour de la réponse : le chemin retour des données

### 4.1 Construction de la réponse HTTP

Une fois le traitement terminé, le serveur construit le message de réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Encoding: gzip
Cache-Control: max-age=3600

{"id": 123, "title": "xxx", "price": 59.9}
```

| Composant | Contenu |
|---------|------|
| Ligne d'état | Version du protocole + code d'état (200 succès, 404 non trouvé, 500 erreur serveur) |
| En-têtes de réponse | Format des données, stratégie de cache, méthode de compression, etc. |
| Corps de la réponse | Les données réelles (JSON, HTML, etc.) |

### 4.2 Compression des données

Le serveur compresse généralement le corps de la réponse avec gzip ou brotli pour réduire le volume de transfert :

| Algorithme de compression | Taux de compression | Vitesse |
|---------|--------|------|
| gzip | Environ 70 % | Rapide |
| brotli | Environ 80 % | Plus lent mais meilleure compression |

Un JSON de 100 Ko, une fois compressé, peut ne faire que 20 à 30 Ko.

### 4.3 Rendu par le navigateur

Une fois la réponse reçue, le navigateur :

1. **Analyse le HTML** -> construction de l'arbre DOM
2. **Analyse le CSS** -> construction de l'arbre de styles
3. **Fusion** -> génération de l'arbre de rendu
4. **Mise en page** -> calcul de la position et de la taille de chaque élément
5. **Peinture** -> dessin des pixels à l'écran

<RequestTimeline />

---

## 5. Optimisation globale : chaque couche peut être plus rapide

### 5.1 Moyens d'optimisation par couche

| Niveau | Moyen d'optimisation | Effet |
|-----|---------|------|
| DNS | Pré-résolution DNS, utilisation d'un service DNS rapide | Réduction du temps de requête DNS |
| Réseau | CDN, HTTP/2, réutilisation de connexion | Réduction de la latence de transfert |
| Serveur | Cache (Redis), traitement asynchrone | Réduction du temps de traitement |
| Base de données | Index, optimisation de requêtes, séparation lecture/écriture | Réduction du temps de requête |
| Frontend | Chargement paresseux, fractionnement de code, compression des ressources | Réduction du temps de rendu |

### 5.2 Le cache : l'optimisation la plus efficace

Le cache existe à chaque niveau de la chaîne de la requête :

```
Cache du navigateur -> Cache CDN -> Cache du proxy inverse -> Cache applicatif (Redis) -> Cache de la base de données
```

::: tip L'essence du cache
Échanger de l'espace contre du temps. Stocker les résultats déjà calculés pour les réutiliser directement sans recalculer. Chaque augmentation de 10 % du taux de réussite du cache peut multiplier les performances du système par plusieurs.
:::

### 5.3 Approche de diagnostic en cas d'échec de requête

| Symptôme | Couche potentiellement problématique | Méthode de diagnostic |
|-----|------------|---------|
| Aucune réponse | DNS / Réseau | ping, nslookup |
| Délai d'attente de connexion | Réseau / Serveur en panne | telnet, curl |
| Retour 4xx | Requête client incorrecte | Vérifier l'URL, les paramètres, le Token |
| Retour 5xx | Erreur interne du serveur | Consulter les journaux du serveur |
| Réponse très lente | Base de données / Logique applicative | Consulter les journaux de requêtes lentes, outils APM |

---

## 6. Résumé

Le voyage complet d'une requête HTTP :

1. **Navigateur** : analyse de l'URL -> requête DNS -> connexion TCP -> envoi de la requête
2. **Réseau** : routage -> évaluation CDN -> répartition par équilibrage de charge
3. **Serveur** : réception par le serveur Web -> traitement par les middlewares -> logique métier -> requête en base de données
4. **Retour** : construction de la réponse -> compression -> transfert réseau -> rendu par le navigateur

::: tip La valeur de la compréhension globale
Lorsque vous êtes capable de dessiner mentalement la chaîne complète d'une requête, vous pouvez localiser rapidement le niveau problématique face à n'importe quelle situation. C'est le passage clé de "développeur junior" à "capable de diagnostiquer les problèmes de manière autonome".
:::

---

## Pour aller plus loin

- [Guide HTTP MDN](https://developer.mozilla.org/fr/docs/Web/HTTP) — Documentation HTTP de MDN
- [High Performance Browser Networking](https://hpbn.co/) — Optimisation des performances réseau côté navigateur
- [What happens when...](https://github.com/alex/what-happens-when) — L'explication classique de "que se passe-t-il après la saisie d'une URL"
