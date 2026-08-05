# Principes : Sérialisation et formats de données

::: tip Question centrale
**Comment les données sont-elles transmises sur le réseau ?** C'est comme demander : comment faire en sorte que ce qu'une personne dit soit compris par une autre ? La sérialisation résout le problème de la "traduction des données" — traduire les objets en mémoire dans un format transmissible.
:::

---

## La nécessité de la sérialisation des données

Au cours des interactions entre le frontend et le backend, les données doivent subir plusieurs "transformations" pour passer du serveur au client.

**Scénario 1 : les données reçues par le frontend ont "changé"**

```javascript
// Backend envoie
Date birth = new Date(1990, 5, 15)

// Frontend reçoit
{ "birth": "1990-06-15T00:00:00Z" }  // Une chaîne !
```

Le frontend veut utiliser `.getFullYear()`, mais ça plante — car ce n'est pas un objet Date, c'est une chaîne de caractères.

**Scénario 2 : caractères chinois illisibles**

```json
// Attendu
{ "name": "Zhang San" }

// Reçu
{ "name": "å¼ ä¸" }
```

Un problème d'encodage de caractères transforme le texte en caractères illisibles.

**Scénario 3 : goulot d'étranglement de performance**

```json
// Une réponse contenant une liste de 10000 produits
{
  "products": [
    { "id": 1, "name": "...", "description": "...", ... },
    // ... 9999 de plus
  ]
}
// Taille : 5,2 Mo, temps de transfert : 3,5 secondes
```

La redondance du format JSON rend le paquet de données trop volumineux, affectant gravement les performances.

---

**La sérialisation, c'est comme "traduire"** — traduire les objets en mémoire dans un format transmissible, puis le destinataire "re-traduit" dans l'autre sens.

---

## 1. Qu'est-ce que la sérialisation/désérialisation

**La sérialisation** (Serialization) est le processus de transformation d'un objet en un format transmissible.

**La désérialisation** (Deserialization) est le processus de transformation d'un format transmissible en objet.

### 1.1 Analogie avec l'envoi d'un artefact de build

| Envoi de colis | Sérialisation | Explication |
| :--- | :--- | :--- |
| Emballer les objets | Sérialisation | Mettre les objets dans un carton, coller une étiquette |
| Transport | Transfert réseau | Le camion de livraison achemine vers la destination |
| Déballer et récupérer | Désérialisation | Le destinataire ouvre le carton, sort les objets |

### 1.2 Pourquoi la sérialisation est-elle nécessaire

| Raison | Explication | Exemple |
| :--- | :--- | :--- |
| **Transfert réseau** | Le réseau ne peut transmettre que des flux d'octets | Appels API, communication RPC |
| **Stockage persistant** | Le disque ne peut stocker que des octets | Sauvegarder un objet dans un fichier, une base de données |
| **Inter-langages** | Les structures de données diffèrent entre langages | Objet Java -> dictionnaire Python |
| **Cache distribué** | Redis/Memcached stockent des octets | Mettre en cache des informations utilisateur |

---

## 2. Formats de sérialisation courants

**Essayez par vous-même** : cliquez sur le bouton ci-dessous pour observer le processus de sérialisation dans différents langages :

<SerializationDemo />

### 2.1 JSON : le plus universel

**Avantages** :
- Bonne lisibilité, facilité de débogage
- Supporté par tous les langages
- Support natif par le navigateur (`JSON.parse` / `JSON.stringify`)

**Inconvénients** :
- Volume important (quantité de `{}` `""` et autres marqueurs)
- Ne supporte pas des types de données riches (Date, Map, Set sont convertis en chaînes)

**Scénarios d'utilisation** :
- API publiques
- Communication frontend-backend
- Fichiers de configuration

### 2.2 XML : autrefois le standard

```xml
<?xml version="1.0" encoding="UTF-8"?>
<user>
  <id>123</id>
  <name>Zhang San</name>
  <email>zhangsan@example.com</email>
  <age>28</age>
</user>
```

**Avantages** :
- Structure claire, supporte les commentaires
- Supporte les structures imbriquées complexes
- Validation par Schema (XSD)

**Inconvénients** :
- Volume important, analyse lente
- Redondance des balises (`<open></close>`)

**Scénarios d'utilisation** :
- Fichiers de configuration (Spring, MyBatis)
- Protocole SOAP
- Échange de données complexes

### 2.3 Protobuf : le plus performant

```protobuf
// user.proto
syntax = "proto3";
message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
  int32 age = 4;
}
```

**Avantages** :
- Volume réduit (30 à 50 % plus petit que JSON)
- Vitesse élevée (5 à 10 fois plus rapide à analyser)
- Rétrocompatible (l'ajout de champs n'affecte pas les anciennes versions)

**Inconvénients** :
- Illisible (format binaire)
- Nécessite un fichier de définition `.proto`
- Ne supporte pas les types dynamiques

**Scénarios d'utilisation** :
- Communication interne entre microservices
- Scénarios haute performance (jeux, communication en temps réel)
- Applications mobiles (économie de bande passante)

### 2.4 MessagePack : un compromis entre lisibilité et performance

```json
// MessagePack est une version binaire de JSON
// Pour les mêmes données, MessagePack est environ 30 % plus petit que JSON
```

**Avantages** :
- Plus petit que JSON, plus rapide que JSON
- Conserve le modèle de données de JSON
- Supporte tous les types JSON

**Inconvénients** :
- Illisible
- Moins performant que Protobuf

**Scénarios d'utilisation** :
- Besoin de performance sans vouloir utiliser Protobuf
- Cache Redis
- Messages WebSocket

---

## 3. Comparaison des méthodes de sérialisation par langage

| Langage | Bibliothèque JSON | Bibliothèque Protobuf | Bibliothèque XML |
| :--- | :--- | :--- | :--- |
| **JavaScript** | `JSON.stringify()` | `protobuf.js` | `fast-xml-parser` |
| **Python** | `json.dumps()` | `protobuf` | `xmltodict` |
| **Java** | `Jackson` / `Gson` | `protobuf-java` | `JAXB` |
| **Go** | `encoding/json` | `proto` | `encoding/xml` |
| **C++** | `nlohmann/json` | `protobuf` | `tinyxml2` |
| **C#** | `System.Text.Json` | `Google.Protobuf` | `System.Xml` |

::: tip Recommandations de choix
- **Communication frontend-backend** : JSON (facilité de débogage)
- **Communication interne entre microservices** : Protobuf (performance optimale)
- **Fichiers de configuration** : JSON ou YAML
- **Intégration avec des systèmes anciens** : XML (peut-être pas d'autre choix)
:::

---

## 4. Comparaison de performance

### 4.1 Comparaison de taille (avec un objet utilisateur)

| Format | Taille | Relatif à JSON |
| :--- | :--- | :--- |
| JSON | 68 octets | 100 % |
| XML | 142 octets | 209 % |
| Protobuf | 38 octets | 56 % |
| MessagePack | 52 octets | 76 % |

### 4.2 Comparaison de vitesse (10000 sérialisations)

| Format | Temps | Relatif à JSON |
| :--- | :--- | :--- |
| JSON | 45 ms | 100 % |
| XML | 120 ms | 267 % |
| Protobuf | 8 ms | 18 % |
| MessagePack | 28 ms | 62 % |

::: tip Conclusion des tests de performance
- **Protobuf est le plus rapide** : adapté aux scénarios haute performance
- **MessagePack arrive en second** : environ 40 % plus rapide que JSON
- **JSON est le plus lent** : mais suffisant pour la plupart des scénarios
:::

---

## 5. Problèmes courants

### 5.1 Problème de sérialisation des dates

**Problème** : un objet Date devient une chaîne après sérialisation

```javascript
// Avant sérialisation
const date = new Date('2024-01-01')

// Après sérialisation
JSON.stringify(date)  // "2024-01-01T00:00:00.000Z"
```

**Solution** :
```javascript
// Option 1 : convertir en timestamp
{ createdAt: date.getTime() }  // 1704067200000

// Option 2 : convertir en chaîne ISO
{ createdAt: date.toISOString() }  // "2024-01-01T00:00:00.000Z"

// Option 3 : sérialisation personnalisée
JSON.stringify(obj, (key, value) => {
  if (value instanceof Date) {
    return { __type: 'Date', value: value.toISOString() }
  }
  return value
})
```

### 5.2 Problème de référence circulaire

**Problème** : une référence circulaire dans un objet provoque une erreur

```javascript
const obj = { name: 'test' }
obj.self = obj
JSON.stringify(obj)  // TypeError: Converting circular structure to JSON
```

**Solution** :
```javascript
// Option 1 : filtrer les références circulaires
const seen = new WeakSet()
JSON.stringify(obj, (key, value) => {
  if (typeof value === 'object' && value !== null) {
    if (seen.has(value)) return
    seen.add(value)
  }
  return value
})

// Option 2 : utiliser la bibliothèque flatted
import { parse, stringify } from 'flatted'
stringify(obj)  // Gère automatiquement les références circulaires
```

### 5.3 Problème de caractères illisibles

**Problème** : les caractères deviennent illisibles après sérialisation

**Cause** :
- Incohérence de l'encodage des caractères (UTF-8 vs GBK)
- Marqueur BOM

**Solution** :
```python
# Python : s'assurer d'utiliser UTF-8
import json
json.dumps(data, ensure_ascii=False)  # Ne pas échapper les caractères non-ASCII
```

```javascript
// Node.js : définir l'en-tête de réponse
res.setHeader('Content-Type', 'application/json; charset=utf-8')
```

---

## 6. Pratique : solution de sérialisation pour un système e-commerce

### 6.1 Analyse des scénarios

| Scénario | Choix de format | Raison |
| :--- | :--- | :--- |
| **App -> API backend** | JSON | Facilité de débogage, unification frontend-backend |
| **Backend -> Backend RPC** | Protobuf | Performance optimale, économie de bande passante |
| **Cache dans Redis** | MessagePack | Plus petit que JSON, peut sérialiser des objets complexes |
| **Journalisation** | JSON | Facile à analyser par les outils de log |

### 6.2 Exemples de code

```javascript
// Réponse API (JSON)
app.get('/api/products/:id', async (req, res) => {
  const product = await db.getProduct(req.params.id)
  res.json({
    code: 0,
    data: product
  })
})

// Communication entre microservices (Protobuf)
// product.proto
syntax = "proto3";
message Product {
  int32 id = 1;
  string name = 2;
  int32 price = 3;
}

// Côté serveur
const proto = require('./product.proto')
const message = proto.Product.create(product)
const buffer = proto.Product.encode(message).finish()

// Côté client
const decoded = proto.Product.decode(buffer)

// Cache Redis (MessagePack)
const msgpack = require('msgpack-lite')
await redis.set(
  `product:${id}`,
  msgpack.encode(product)
)
const cached = msgpack.decode(await redis.get(`product:${id}`))
```

---

## 7. Utiliser l'IA pour choisir une solution de sérialisation

L'IA peut vous aider à choisir le format de sérialisation adapté à votre scénario.

### 7.1 Modèle de prompt

```
Vous êtes un architecte système expérimenté, spécialisé dans les technologies de sérialisation de données. Aidez-moi à choisir une solution de sérialisation appropriée.

## Scénario métier
[Décrivez votre scénario, par ex. : application e-commerce, backend de jeu, microservices, etc.]

## Exigences techniques
[Listez les contraintes, par ex. :
- Frontend/backend séparés (Vue + Node.js)
- Exigences de performance élevées (QPS > 10000)
- Sensible à la bande passante (mobile, économiser les données)
- Multi-langage (Java + Python + Go)]

## Caractéristiques des données
[Décrivez les particularités des données, par ex. :
- Volume important (réponse unique > 1 Mo)
- Structure complexe (imbrication multiple)
- Contient des dates, données binaires et autres types spéciaux]

## Format de sortie
Veuillez produire dans le format suivant :
1. Solution recommandée (JSON/Protobuf/MessagePack/XML)
2. Justification
3. Comparaison de performance (estimation taille et vitesse)
4. Exemple de code
```

### 7.2 Exemple pratique

**Prompt en entrée** :

```
Vous êtes un architecte système expérimenté. Notre application e-commerce doit optimiser les performances de l'interface de liste de produits.

## Scénario métier
- Interface de liste de produits d'une application e-commerce
- Retour de 100 produits par appel
- Chaque produit contient : id, name, price, image, description et 20 autres champs
- Actuellement en JSON, taille de réponse environ 200 Ko, temps 800 ms

## Exigences techniques
- Frontend en Vue.js
- Backend en Node.js + microservices Go
- Concilier performance et efficacité de développement

## Objectif d'optimisation
- Temps de réponse réduit à moins de 300 ms
- Taille du paquet de données réduite de 30 %
```

**Sortie de l'IA** :

```
Solution recommandée : approche hybride

1. **Couche API** : continuer en JSON (convivial pour le frontend)
2. **Communication entre microservices** : passer à Protobuf (gain de performance)
3. **Données statiques** : activer la compression gzip

### Justification
- JSON est le plus convivial pour le frontend, pas d'analyse supplémentaire nécessaire
- Les microservices backend en Protobuf réduisent de 40 % le volume de données
- La compression gzip est très efficace sur le texte (JSON compressible à 70 %)

### Comparaison de performance
| Solution | Taille | Temps |
|------|------|------|
| Actuel (JSON) | 200 Ko | 800 ms |
| + gzip | 60 Ko | 350 ms |
| + Protobuf | 50 Ko | 280 ms |

### Exemple de code
[Code d'implémentation concret...]
```

---

## Glossaire

| Terme | Anglais | Explication |
| :--- | :--- | :--- |
| **Sérialisation** | Serialization | Objet -> flux d'octets |
| **Désérialisation** | Deserialization | Flux d'octets -> objet |
| **JSON** | JavaScript Object Notation | Le format texte le plus courant |
| **XML** | Extensible Markup Language | Langage de balisage, autrefois standard |
| **Protobuf** | Protocol Buffers | Format haute performance open source de Google |
| **MessagePack** | - | Version binaire de JSON |
| **Encodage** | Encoding | Caractère -> octet |
| **Décodage** | Decoding | Octet -> caractère |
