# Introduction : API et communication inter-programmes

::: tip 🎯 Question centrale
**Qu'est-ce qu'une API ?** C'est comme demander : comment concevoir le menu d'un restaurant pour que les clients comprennent du premier coup ? Comment le serveur note les commandes sans se tromper ? Les API résolvent précisément le problème du « dialogue entre programmes ». Vous utilisez des API depuis votre premier jour de code, même sans vous en rendre compte.
:::

---

## 0. Trois confusions fréquentes chez les débutants

**Confusion n°1 : Les API sont-elles un concept très avancé ?**

Beaucoup de gens entendent parler d'API et pensent qu'il s'agit d'un concept réservé aux ingénieurs seniors. En réalité, vous avez déjà utilisé des API depuis longtemps :

```python
len("hello")        # C'est une API fournie par Python
open("file.txt")    # C'est aussi une API
requests.get(url)   # C'est encore une API
```

**Confusion n°2 : Quelle est la différence entre une API Web et une API classique ?**

| Type | Cible appelée | Mode de communication | Scénario typique |
| :--- | :--- | :--- | :--- |
| **API de fonction** | Code local | Appel de fonction | `len()`, `open()` |
| **API du système d'exploitation** | Système d'exploitation | Appel système | Lecture/écriture de fichiers, création de processus |
| **API Web** | Serveur distant | Requête HTTP | Appel à un modèle IA, récupération de la météo |

**Confusion n°3 : Dois-je utiliser HTTP ou un SDK ?**

```python
# Approche HTTP : vous gérez tous les détails vous-même
import requests
response = requests.post(
    "https://api.deepseek.com/v1/chat/completions",
    headers={"Authorization": "Bearer sk-xxx"},
    json={"model": "deepseek-chat", "messages": [...]}
)
result = response.json()["choices"][0]["message"]["content"]

# Approche SDK : le gestionnaire s'occupe de tout
from openai import OpenAI
client = OpenAI(api_key="sk-xxx")
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[...]
)
result = response.choices[0].message.content
```

---

## 1. L'essence des API : la prise et la prise murale

Une **API** (Application Programming Interface, interface de programmation d'application) est un « contrat de dialogue entre programmes ».

### 1.1 Analogie avec les appareils électriques

| Concept | Analogie électrique | Correspondance API |
| :--- | :--- | :--- |
| **Interface** | Forme de la prise | Signature de fonction / URL |
| **Entrée** | Courant entrant | Paramètres de fonction / Corps de la requête |
| **Sortie** | L'appareil fonctionne | Valeur de retour / Corps de la réponse |

### 1.2 Comparaison des trois types d'API

<ApiTypesComparison />

### 1.3 Différence entre API de fonction et API HTTP

Beaucoup de débutants se posent la question : quelle est la différence entre une API de fonction et une API HTTP ? Comment les distinguer dans la documentation ?

<ApiFunctionVsHttp />

### 1.4 Comment lire les différents types de documentation API

Face à différents types de documentation API, les points d'attention varient :

<DocumentTypesComparison />

---

## 2. Un appel API complet

👇 **Essayez par vous-même** : cliquez sur le bouton ci-dessous et observez un flux complet de requête-réponse API :

<ApiRequestDemo />

### 2.1 Les quatre phases d'un appel API

| Phase | Ce qui se passe | Analogie électrique |
| :--- | :--- | :--- |
| **Requête** | Le client envoie une requête au serveur | Appuyer sur l'interrupteur |
| **Transmission** | La requête transite via le réseau jusqu'au serveur | Le courant passe dans les fils |
| **Traitement** | Le serveur traite la requête et renvoie des données | L'appareil se met en marche |
| **Réponse** | Le client reçoit et traite le résultat renvoyé | L'ampoule s'allume |

### 2.2 Analogie avec le restaurant

| Rôle au restaurant | Correspondance API | Explication |
| :--- | :--- | :--- |
| **Menu** | Documentation API | Vous indique quels « plats » sont disponibles |
| **Serveur** | Protocole HTTP | Un « mode de dialogue » standardisé |
| **Cuisine** | Côté serveur | Traite les requêtes selon les « commandes » |
| **Service à table** | Réponse | Renvoie le résultat au « client » |

---

## 3. Méthodes HTTP : êtes-vous en train de « demander » ou de « faire »

Lorsque vous appelez une API Web, vous devez indiquer au serveur ce que vous voulez faire. C'est l'origine des méthodes HTTP.

### 3.1 Comprendre avec la commande au restaurant

| Scénario | Comment diriez-vous dans la réalité ? | Méthode HTTP correspondante |
| :--- | :--- | :--- |
| Vous voulez savoir quels plats sont disponibles aujourd'hui | « Serveur, montrez-moi le menu » | **GET** -纯粹的 « demander », sans modifier les données |
| Vous voulez commander un poulet Kung Pao | « Je prends un poulet Kung Pao » | **POST** - « Faire » quelque chose, créer des données |
| Vous voulez changer un plat | « Remplacez le poulet Kung Pao par du porc à la sauce aigre-douce » | **PUT** - Remplacer les données |
| Vous voulez modifier l'assaisonnement | « Pas de cacahuètes dans le poulet Kung Pao » | **PATCH** - Modification partielle |
| Vous ne voulez plus ce plat | « Laissez tomber, annulez ce plat » | **DELETE** - Supprimer les données |

<HttpMethodsDemo />

::: warning À propos de l'idempotence
**Idempotence** : l'exécution multiple produit-elle le même résultat ?

- **Opérations idempotentes** (GET/PUT/DELETE) : cliquer 10 fois ou 1 fois, le résultat est identique
- **Opérations non idempotentes** (POST) : cliquer 10 fois peut créer 10 commandes

**Solution** : utiliser un identifiant unique pour les opérations POST afin d'éviter le traitement en double.
:::

### 3.2 Aide-mémoire des méthodes HTTP

| Méthode | Usage | Idempotence | Sécurité | Scénario typique |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | Récupérer une ressource | Oui | Oui | Liste de résultats, afficher les détails |
| **POST** | Créer une ressource | Non | Non | Ajouter un utilisateur, soumettre une commande |
| **PUT** | Mise à jour complète | Oui | Non | Remplacer le profil utilisateur complet |
| **PATCH** | Mise à jour partielle | Non | Non | Modifier uniquement le pseudo |
| **DELETE** | Supprimer une ressource | Oui | Non | Supprimer un utilisateur, annuler une commande |

---

## 4. Codes d'état HTTP : que vous dit le serveur

Lorsque le serveur répond, il renvoie d'abord un code d'état pour vous indiquer si la requête a réussi.

### 4.1 Catégories de codes d'état

<StatusCodeCategories />

### 4.2 Détails des codes d'état courants

| Code d'état | Signification | Scénario typique | Traitement côté client |
| :--- | :--- | :--- | :--- |
| **200 OK** | Succès | Requête traitée normalement | Afficher les données |
| **201 Created** | Création réussie | Requête POST a créé une ressource avec succès | Rediriger vers la nouvelle ressource |
| **400 Bad Request** | Format de requête incorrect | Paramètre manquant ou format incorrect | Vérifier les paramètres |
| **401 Unauthorized** | Non authentifié | Aucune clé API valide fournie | Guider l'utilisateur vers la connexion |
| **403 Forbidden** | Non autorisé | La clé API n'a pas les droits d'accès à cette ressource | Indiquer des droits insuffisants |
| **404 Not Found** | N'existe pas | L'adresse ou la ressource demandée n'existe pas | Vérifier l'URL |
| **429 Too Many Requests** | Trop de requêtes | Limite de débit dépassée | Réessayer plus tard |
| **500 Internal Server Error** | Erreur serveur | Problème côté serveur | Inviter l'utilisateur à réessayer plus tard |

👇 **Essayez par vous-même** : cliquez sur le bouton ci-dessous pour comprendre la signification des codes d'état courants :

<StatusCodeDemo />

---

## 5. HTTP vs SDK : faire les courses vous-même ou déléguer à un gestionnaire

### 5.1 Comparaison des deux modes d'appel

| | 🏃 **API HTTP** | 🤵 **SDK** |
| :--- | :--- | :--- |
| **Analogie** | Faire les courses soi-même | Déléguer à un gestionnaire |
| **Avantages** | ✓ Utilisable dans tous les langages<br>✓ Contrôle total des détails de la requête<br>✓ Pas de dépendance supplémentaire | ✓ Code concis et lisible<br>✓ Gestion automatique de l'authentification<br>✓ Nouvelles tentatives d'erreur intégrées |
| **Inconvénients** | ✗ Nécessite de gérer tous les détails<br>✗ Code verbeux et sujet aux erreurs | ✗ Nécessite d'installer des dépendances<br>✗ Possibles problèmes de version |
| **Exemple de code** | `requests.post(url, json=..., headers={...})` | `client.chat.completions.create(...)` |

### 5.2 Comment choisir

| Scénario | Approche recommandée | Raison |
| :--- | :--- | :--- |
| **Développement rapide** | SDK | Gestion automatique de l'authentification, des erreurs, des nouvelles tentatives |
| **Apprentissage des principes** | HTTP | Comprendre les mécanismes sous-jacents |
| **Langage non supporté** | HTTP | Utilisable dans n'importe quel langage |
| **Besoin de personnalisation** | HTTP | Contrôle flexible de chaque détail |

::: tip 💡 Conseil
**Utilisez le SDK quand c'est possible**, laissez les tâches ingrates à la bibliothèque, gardez votre temps pour vous.
:::

---

## 6. Approche et mise en œuvre : lire une documentation API

La documentation API est comme un hybride entre un manuel d'utilisation et un menu. Vous n'avez pas besoin de la lire de bout en bout, il suffit d'apprendre à « consulter le dictionnaire ».

### 6.1 Liste de contrôle pour la lecture de documentation

Ouvrez n'importe quelle documentation API (par exemple OpenAI ou DeepSeek), vous n'avez besoin de chercher que ces éléments :

<ApiDocumentDemo />

| Élément | Description | Exemple |
| :--- | :--- | :--- |
| **URL de base** | L'adresse racine de l'API | `https://api.deepseek.com` |
| **Authentification** | Comment prouver votre identité | `Authorization: Bearer sk-xxx` |
| **Endpoints** | La liste spécifique des interfaces | `/v1/chat/completions` |
| **Paramètres** | Paramètres obligatoires/optionnels | `model` (obligatoire), `temperature` (optionnel) |
| **Réponse** | Structure des données renvoyées | `{"choices": [...]}` |

### 6.2 Étapes pour lire la documentation

1. **Trouver l'URL de base** - c'est le préfixe de toutes les requêtes
2. **Comprendre le mode d'authentification** - La clé API va-t-elle dans le Header ou dans les Query ?
3. **Trouver l'Endpoint nécessaire** - L'interface spécifique que vous voulez appeler
4. **Consulter les paramètres de la requête** - Lesquels sont obligatoires ? Lesquels sont optionnels ?
5. **Comprendre le format de réponse** - Comment les données sont-elles organisées ?

---

## 7. Exercice pratique : simuler un appel API

La pratique vaut mieux que la théorie. Voici une API simulée où vous pouvez remplir n'importe quels paramètres et modifier l'adresse comme vous le souhaitez, pour voir ce qui se passe.

<ApiPlayground />

Essayez de déclencher les scénarios suivants :
- ✅ **Requête réussie** : remplissez le bon Endpoint et la clé API
- ❌ **Erreur 401** : ne remplissez pas la clé API, voyez comment le serveur vous refuse
- ❌ **Erreur 404** : remplissez une adresse qui n'existe pas

---

## 8. Résumé

::: info Points clés
1. **Les API sont un porte-voix**, elles transmettent votre message à un autre bout de code ou à un serveur distant
2. **Vous utilisez déjà des API**, de `len()` à `open()`, tout est API
3. **Les API Web sont un super-pouvoir**, vous permettant d'appeler des super-ordinateurs à des milliers de kilomètres
4. **Le SDK est un bon gestionnaire**, utilisez le SDK quand c'est possible plutôt que de faire les courses vous-même
5. **Cherchez trois choses dans la documentation** : adresse, authentification, paramètres
:::

À l'ère de la programmation IA, vous n'avez besoin de retenir que ces quelques concepts essentiels. Le reste des détails, l'IDE et l'assistant IA s'en chargeront pour vous.

---

## Glossaire

| Terme | Nom complet | Explication |
| :--- | :--- | :--- |
| **API** | Application Programming Interface | Interface de programmation d'application, définit comment les logiciels interagissent |
| **Web API** | - | API basée sur le protocole HTTP, utilisée pour la communication réseau |
| **Endpoint** | - | Point de terminaison, l'adresse spécifique d'une API |
| **HTTP** | HyperText Transfer Protocol | Protocole de communication utilisé par les API Web |
| **GET** | - | Méthode pour récupérer une ressource |
| **POST** | - | Méthode pour soumettre des données |
| **SDK** | Software Development Kit | Kit de développement logiciel, encapsule les appels API bas niveau |
| **URL** | Uniform Resource Locator | L'adresse réseau d'une API |
| **JSON** | JavaScript Object Notation | Format de données couramment utilisé |
| **Authentication** | - | Processus de vérification d'identité |
| **Status Code** | - | Code d'état dans la réponse HTTP |
| **Request** | - | Requête |
| **Response** | - | Réponse |
| **Header** | - | En-tête HTTP, contient des métadonnées |
| **Payload** | - | Les données réelles de la requête ou de la réponse |
| **Rate Limit** | - | Limite de débit |
| **Idempotent** | - | Idempotent, l'exécution multiple produit le même résultat |
| **REST** | Representational State Transfer | Un style d'architecture API |
| **RPC** | Remote Procedure Call | Appel de procédure à distance |
| **GraphQL** | - | Un langage de requête API |
| **gRPC** | - | Framework RPC haute performance développé par Google |
