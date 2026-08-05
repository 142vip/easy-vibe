# Principes : Langages dédiés (DSL) backend

::: tip Préface
Dans un cas réel, l'ingénieur Armin a construit dans sa nouvelle entreprise un ensemble de services d'infrastructure à l'aide de l'IA, totalisant environ 40 000 lignes de code (Go + YAML + Pulumi + code de collage SDK), dont plus de 90 % ont été générés par l'IA. Ce cas implique de nombreux termes peu familiers pour les débutants : YAML, Pulumi, HCL, Lua, code de collage SDK... Ce ne sont ni du Python ni du JavaScript, mais ils sont omniprésents dans les projets backend. Cet article présente ces technologies depuis un point de vue unifié : les **langages dédiés (DSL)**.
:::

**Objectifs d'apprentissage**

Dans le développement backend, outre la logique métier écrite en langages de programmation généraux (Python, Go, Java, etc.), il existe une grande quantité de fichiers et de code aux **usages variés, aux syntaxes variées, mais qui n'appartiennent pas aux langages de programmation généraux**. Ils partagent un concept englobant : les **DSL (Domain-Specific Language, langage dédié)**.

Après avoir étudié cet article, vous serez en mesure de :

- Comprendre la différence essentielle entre DSL et langage de programmation général (GPL)
- Maîtriser la classification des DSL : formats de sérialisation de données, langages de script embarqués, langages de définition d'infrastructure
- Distinguer les scénarios d'application des formats XML, JSON, YAML, TOML, CSV, Protobuf, etc.
- Comprendre la philosophie de conception de langages de script embarqués comme Lua
- Expliquer les principes et les différences entre Terraform (HCL) et Pulumi
- Comprendre le fonctionnement de la spécification OpenAPI et de la génération automatique de SDK
- Juger quels types de code sont adaptés à la génération par l'IA

| Chapitre | Thème | Concept clé |
|-----|------|---------|
| **Chapitre 1** | Vue d'ensemble des DSL | Définition DSL vs GPL, système de classification et panorama |
| **Chapitre 2** | Formats de sérialisation de données | XML, JSON, YAML, TOML, CSV, Protobuf, etc. |
| **Chapitre 3** | Langages de script embarqués | Philosophie de conception et applications typiques de Lua et autres |
| **Chapitre 4** | Infrastructure as Code | Principes et comparaison de Terraform (HCL) et Pulumi |
| **Chapitre 5** | Code de collage et génération de SDK | Spécification OpenAPI et génération automatique de code client |
| **Chapitre 6** | Relation entre l'IA et les DSL | Pourquoi l'IA est particulièrement douée pour générer du code DSL |

---

## 1. Vue d'ensemble des DSL : un autre monde au-delà des langages généraux

### 1.1 Qu'est-ce qu'un DSL

Un **DSL (Domain-Specific Language, langage dédié)** est un langage conçu pour un domaine ou une tâche spécifique. Par opposition, les **GPL (General-Purpose Language, langages de programmation généraux)** comme Python, Java, Go, C++, etc., sont conçus pour résoudre n'importe quel problème de calcul.

La différence essentielle entre les deux :

| Dimension | GPL (langage général) | DSL (langage dédié) |
|------|-------------------|-------------------|
| **Objectif de conception** | Résoudre n'importe quel problème de calcul | Résoudre un problème dans un domaine spécifique |
| **Portée d'expression** | Turing-complet, peut en théorie tout calculer | Généralement limitée volontairement |
| **Coût d'apprentissage** | Élevé, nécessite de comprendre tout le système linguistique | Faible, il suffit de comprendre les concepts du domaine |
| **Représentants typiques** | Python, Java, Go, C++, JavaScript | SQL, HTML/CSS, expressions régulières, YAML, HCL |

Vous utilisez en réalité des DSL depuis longtemps :

- **SQL** est un DSL pour le domaine des requêtes en base de données — vous utilisez `SELECT * FROM users WHERE age > 18` pour interroger des données, au lieu d'écrire manuellement la logique de parcours en Python
- **HTML/CSS** sont des DSL pour la structure et le style des pages web — vous décrivez la page avec des balises et des attributs, au lieu de manipuler des pixels en C++
- **Les expressions régulières** sont des DSL pour la correspondance de motifs textuels — vous utilisez `\d{3}-\d{4}` pour les numéros de téléphone, au lieu d'écrire manuellement des boucles de comparaison de caractères

### 1.2 Classification des DSL

Les DSL peuvent être divisés en deux grandes catégories selon leur "complétude de Turing" :

**DSL externes (External DSL)**

Possèdent leur propre syntaxe et analyseur indépendants, sans être rattachés à un langage de programmation général. Le code écrit par l'utilisateur est traité par un interpréteur ou compilateur dédié.

- Type description de données pure : JSON, YAML, XML, TOML, CSV, Protobuf (sans aucune logique)
- Type requête/opération : SQL, GraphQL, expressions régulières (capacité logique limitée)
- Type modélisation de domaine : HCL (Terraform), Dockerfile, syntaxe de configuration Nginx (description déclarative de l'état d'un domaine spécifique)

**DSL internes (Internal DSL / Embedded DSL)**

Parasitent à l'intérieur d'un langage de programmation général, utilisant la syntaxe du langage hôte pour construire des expressions dédiées au domaine. Le code est du code hôte valide, mais se lit comme un langage spécialisé.

- Pulumi (écrit en TypeScript/Python/Go, mais dont l'API ressemble à de la configuration déclarative)
- Définitions de routes Ruby on Rails (`get '/users', to: 'users#index'`, code Ruby valide mais se lit comme de la configuration)
- Syntaxe d'assertion dans les frameworks de test (`expect(value).toBe(42)`, JavaScript valide mais se lit comme du langage naturel)

### 1.3 Panorama des DSL dans un projet backend

Dans un projet backend typique, vous rencontrerez les catégories de DSL suivantes :

```
DSL dans un projet backend
+-- Formats de sérialisation de données (description de structures de données)
|   +-- Formats texte : JSON, YAML, XML, TOML, CSV, INI
|   +-- Formats binaires : Protobuf, MessagePack, Avro, BSON
+-- Langages de script embarqués (couche de configuration programmable)
|   +-- Lua (moteurs de jeu, Nginx, Redis)
|   +-- GDScript (moteur Godot)
|   +-- Jsonnet (génération de modèles de configuration)
+-- DSL d'infrastructure et d'exploitation (description déclarative de l'état du système)
|   +-- HCL (Terraform)
|   +-- Dockerfile / Docker Compose YAML
|   +-- Syntaxe de configuration Nginx / Apache
+-- Langages de description d'interface (description du contrat API)
    +-- OpenAPI / Swagger
    +-- Protocol Buffers (fichiers .proto)
    +-- GraphQL Schema
```

Une fois ce panorama compris, les chapitres suivants détailleront chaque branche.

---

## 2. Formats de sérialisation de données : décrire des données structurées en texte

### 2.1 Qu'est-ce que la sérialisation de données

La **sérialisation (Serialization)** est le processus de conversion de structures de données en mémoire (objets, dictionnaires, tableaux, etc.) en un format texte ou flux d'octets stockable ou transmissible. L'opération inverse, la reconstitution des données à partir du texte ou flux d'octets, est appelée **désérialisation (Deserialization)**.

Les formats de sérialisation de données sont la catégorie la plus fondamentale de DSL — ce sont des DSL externes de type description de données pure, sans aucune capacité logique, responsables uniquement de décrire statiquement "quelle est la valeur".

### 2.2 Pourquoi ces formats sont-ils nécessaires

Supposons que vous développiez un service backend dont l'adresse de base de données est `localhost:5432`. Si cette adresse est codée en dur dans le code source, le développement local fonctionne, mais lors du déploiement en production, l'adresse devient `db.prod.company.com:5432`, et vous devez modifier le code source et recompiler.

La pratique standard en ingénierie est : **séparer les paramètres variables du code et les placer dans un fichier de configuration indépendant.** Le programme lit le fichier de configuration au démarrage et adapte son comportement en fonction des valeurs.

Au-delà de la configuration, les formats de sérialisation de données sont largement utilisés pour : l'échange de données entre systèmes (requêtes/réponses API), le stockage persistant de données, la communication inter-langages, etc.

### 2.3 Formats texte lisibles par l'humain

Voici les formats texte de sérialisation les plus courants en ingénierie, présentés par ordre chronologique.

**INI**

Le plus ancien format de configuration, originaire du système Windows. Structure simple, composé de sections (section) et de paires clé-valeur :

```ini
[database]
host = localhost
port = 5432

[server]
debug = true
```

L'avantage est la lisibilité. La limitation est l'absence de structures imbriquées et de types de tableaux, incapable d'exprimer des configurations complexes. Principalement présent dans les systèmes anciens et certaines configurations Linux (comme `php.ini`, `my.cnf`).

**CSV**

**CSV (Comma-Separated Values, valeurs séparées par des virgules)** est le format de données tabulaires le plus simple :

```csv
name,age,city
Alice,30,Beijing
Bob,25,Shanghai
```

Chaque ligne est un enregistrement, les champs séparés par des virgules. CSV est largement utilisé pour l'import/export de données, l'échange de tableurs, les pipelines d'analyse de données. Sa limitation est de ne pouvoir exprimer que des tables plates à deux dimensions, sans structures imbriquées, et sans information de type (toutes les valeurs sont des chaînes).

**XML**

**XML (eXtensible Markup Language, langage de balisage extensible)** est né en 1998 et fut autrefois le standard dominant de l'échange de données :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<config>
  <database>
    <host>localhost</host>
    <port>5432</port>
  </database>
  <server>
    <debug>true</debug>
    <allowed_origins>
      <origin>https://example.com</origin>
      <origin>https://app.example.com</origin>
    </allowed_origins>
  </server>
</config>
```

XML est très expressif, supportant l'imbrication, les attributs, les espaces de noms, la validation par Schema, etc. Mais sa syntaxe est verbeuse — la profusion de balises ouvrantes/fermantes réduit le ratio signal/bruit, rendant l'écriture et la lecture manuelles peu agréables.

XML reste largement utilisé dans les domaines suivants :
- L'écosystème Java (fichiers `pom.xml` de Maven, configurations Spring, fichiers de layout Android)
- Les services Web d'entreprise (protocole SOAP)
- Les formats de documents bureautiques (`.docx`, `.xlsx` sont en réalité des collections de fichiers XML dans une archive ZIP)
- Les flux RSS/Atom, le graphique vectoriel SVG

**JSON**

**JSON (JavaScript Object Notation)** est né en 2001. Grâce à sa concision, il a rapidement remplacé XML comme standard de facto pour l'échange de données dans les API Web :

```json
{
  "database": {
    "host": "localhost",
    "port": 5432
  },
  "server": {
    "debug": true
  }
}
```

Ses avantages sont la clarté de structure et le support d'analyse natif dans presque tous les langages de programmation. Son principal défaut est de **ne pas supporter les commentaires**, et la profusion d'accolades et de guillemets rend l'écriture manuelle sujette aux erreurs. JSON est aussi le format standard de configuration dans les projets frontend (`package.json`, `tsconfig.json`).

**YAML**

**YAML (YAML Ain't Markup Language)** est également né en 2001. C'est le format de configuration le plus utilisé dans les domaines backend et DevOps. Docker Compose, Kubernetes, GitHub Actions, etc., utilisent tous YAML :

```yaml
# Configuration de la base de données
database:
  host: localhost
  port: 5432

# Configuration du serveur
server:
  debug: true
  allowed_origins:
    - https://example.com
    - https://app.example.com
```

Ses avantages sont le support des commentaires, une syntaxe concise et la capacité d'exprimer des structures imbriquées complexes. Son défaut est de **dépendre de l'indentation pour représenter la hiérarchie** ; une erreur d'indentation provoque un échec d'analyse, ce qui est le problème le plus fréquent pour les débutants.

> Complément : le nom complet de YAML, "YAML Ain't Markup Language", est un acronyme récursif.

**TOML**

**TOML (Tom's Obvious Minimal Language)** est né en 2013. Il est adopté par le gestionnaire de paquets Cargo de Rust et par le fichier `pyproject.toml` de Python :

```toml
[database]
host = "localhost"
port = 5432

[server]
debug = true
allowed_origins = [
  "https://example.com",
  "https://app.example.com"
]
```

TOML tente de concilier la simplicité d'INI avec l'expressivité de YAML, tout en évitant les problèmes liés à la sensibilité à l'indentation.

### 2.4 Formats de sérialisation binaires

Les formats ci-dessus sont tous lisibles par l'humain. Dans les scénarios exigeants en performance et en volume, il existe aussi des **formats de sérialisation binaires** — ils sacrifient la lisibilité en échange d'un volume plus petit et d'une vitesse d'analyse plus rapide.

| Format | Développeur | Caractéristique | Scénario d'utilisation typique |
|------|-------|------|------------|
| **Protocol Buffers (Protobuf)** | Google | Nécessite un fichier Schema `.proto` prédéfini, typage fort, volume minimal | Communication gRPC, services internes Google, microservices haute performance |
| **MessagePack** | Communauté | Version binaire de JSON, sans Schema | Encodage interne Redis, communication inter-langages haute performance |
| **Avro** | Apache | Supporte l'évolution de Schema, adapté au Big Data | Sérialisation de données dans l'écosystème Hadoop / Kafka |
| **BSON** | MongoDB | Extension binaire de JSON, supporte plus de types de données | Format de stockage interne de la base de données MongoDB |

Prenons l'exemple de Protocol Buffers, il faut d'abord définir le Schema :

```protobuf
// user.proto
syntax = "proto3";

message User {
  string name = 1;
  int32 age = 2;
  string email = 3;
}
```

Puis, via le compilateur (`protoc`), on génère automatiquement le code de sérialisation/désérialisation pour chaque langage. Ce模式 "définir d'abord le Schema, puis générer le code" est cohérent avec l'approche de génération de SDK à partir d'OpenAPI présentée plus loin.

### 2.5 Comparaison complète

| Format | Type | Année de naissance | Lisibilité | Supporte les commentaires | Scénario d'utilisation typique |
|------|------|---------|--------|---------|------------|
| **INI** | Texte | 1980s | Élevée | Oui | Configuration système, projets anciens |
| **CSV** | Texte | 1972 | Élevée | Non | Import/export de données, échange tabulaire |
| **XML** | Texte | 1998 | Moyenne | Oui | Écosystème Java, services Web d'entreprise, formats de documents |
| **JSON** | Texte | 2001 | Élevée | Non | Échange de données API Web, configuration frontend |
| **YAML** | Texte | 2001 | Élevée | Oui | Docker, K8s, CI/CD, configuration de services backend |
| **TOML** | Texte | 2013 | Élevée | Oui | Configuration de projets Rust / Python |
| **Protobuf** | Binaire | 2008 | Non | — | gRPC, communication entre microservices haute performance |
| **MessagePack** | Binaire | 2008 | Non | — | Communication inter-langages haute performance |
| **Avro** | Binaire | 2009 | Non | — | Pipelines Big Data Hadoop / Kafka |
| **BSON** | Binaire | 2009 | Non | — | Stockage interne MongoDB |

**Point clé** : la fonction essentielle de tous ces formats est identique — **convertir des données structurées en une forme stockable et transmissible**. Les formats texte privilégient la lisibilité humaine et la facilité d'édition ; les formats binaires privilégient la performance d'analyse et le volume de transmission. Le choix du format dépend du compromis entre les besoins spécifiques du scénario.

---

## 3. Langages de script embarqués : la couche de configuration programmable

### 3.1 Définition du concept

Python, JavaScript, Go et autres sont des langages de programmation généraux (General-Purpose Language), capables de s'exécuter de manière autonome et de construire des applications complètes.

Par opposition, il existe une catégorie de langages **spécialement conçus pour être embarqués dans d'autres programmes hôtes**, fournissant à ces hôtes des capacités d'extension programmables. Ces langages sont appelés **langages de script embarqués (Embedded Scripting Language)**.

Le problème central qu'ils résolvent : **lorsque l'expressivité des fichiers de configuration statiques (YAML/JSON) est insuffisante et qu'il faut introduire des conditions, des boucles et autre logique, comment réaliser des comportements dynamiques sans modifier le code source du programme hôte.**

### 3.2 Lua : le langage de script embarqué le plus représentatif

Lua (signifiant "lune" en portugais) est un langage de script extrêmement léger. L'ensemble de son interpréteur compilé ne représente que quelques centaines de Ko. Son objectif de conception n'est pas de fonctionner de manière autonome, mais de servir de couche d'extension embarquable.

Scénarios d'utilisation typiques de Lua :

- **Moteurs de jeux** : le système de plugins de World of Warcraft et les scripts de jeu de Roblox utilisent Lua. Le moteur de jeu implémente le rendu central et les calculs physiques en C/C++, et confie à Lua les éléments fréquemment modifiés comme la logique de niveaux et les dialogues de PNJ. Ainsi, les concepteurs peuvent modifier le contenu du jeu sans recompiler le moteur.

- **Serveurs Web** : OpenResty embarque Lua dans Nginx, permettant aux administrateurs d'implémenter en Lua le filtrage de requêtes, la limitation de débit, l'authentification, etc., sans modifier le code source C de Nginx.

- **Bases de données** : Redis supporte l'envoi de scripts Lua côté serveur, pour implémenter des opérations composites nécessitant des garanties d'atomicité (comme "lire puis écrire").

Voici un exemple de script Lua embarqué dans Nginx (OpenResty) :

```lua
-- Fonction : authentification par token sur le chemin /api/secret
local uri = ngx.var.uri
local token = ngx.req.get_headers()["Authorization"]

if uri == "/api/secret" and token ~= "Bearer my-secret-token" then
    ngx.status = 403
    ngx.say("Access denied")
    return ngx.exit(403)
end
```

### 3.3 Autres langages de script embarqués

| Langage | Environnement hôte | Utilisation typique |
|------|---------|---------|
| **Lua** | Moteurs de jeux, Nginx (OpenResty), Redis | Logique de jeu, stratégies de passerelle, opérations de cache |
| **VimScript / Lua** | Éditeur Vim / Neovim | Développement de plugins pour l'éditeur |
| **Emacs Lisp** | Éditeur Emacs | Personnalisation du comportement de l'éditeur |
| **GDScript** | Moteur de jeu Godot | Scripts de logique de jeu |
| **Jsonnet** | Écosystème Kubernetes / Outils de génération de configuration | Génération template de grandes quantités de configurations JSON/YAML similaires |

**Point clé** : les langages de script embarqués se situent à la **frontière entre les DSL internes et les DSL externes** — ce sont des langages indépendants (avec leur propre syntaxe et interpréteur), mais conçus pour être embarqués dans un programme hôte, et non pour construire des applications de manière autonome. Ils comblent le vide entre les "fichiers de configuration statiques" (DSL de type description de données pure) et les "langages de programmation généraux" (GPL) : lorsque la configuration a besoin d'exprimer de la logique (conditions, boucles, appels de fonctions), embarquer un langage de script léger est la solution standard en ingénierie.

---

## 4. Infrastructure as Code (Infrastructure as Code)

### 4.1 Qu'est-ce que l'"infrastructure"

En ingénierie backend, l'"infrastructure" (Infrastructure) désigne les ressources bas niveau dont dépend l'exécution des applications :

- Ressources de calcul : serveurs (machines virtuelles ou conteneurs)
- Stockage de données : instances de bases de données, buckets de stockage d'objets
- Réseau : règles de pare-feu, équilibreurs de charge, configuration DNS
- Middleware : files de messages, clusters de cache

À l'ère du cloud computing, ces ressources sont créées et gérées via les consoles des fournisseurs de cloud (AWS, Alibaba Cloud, Tencent Cloud, etc.) sous forme d'interfaces graphiques.

### 4.2 Les limites de la gestion manuelle

La gestion manuelle via la console est possible pour les projets à petite échelle, mais avec la croissance du projet, les problèmes suivants apparaissent :

1. **Non reproductible** : les étapes ne sont pas enregistrées, impossible de reproduire exactement le même environnement
2. **Non auditable** : impossible de retracer "qui a modifié quoi et quand"
3. **Non collaboratif** : les opérations ne peuvent pas être versionnées ni faire l'objet de revues de code
4. **Propice aux erreurs** : les opérations manuelles en production comportent des risques d'erreur

L'idée centrale de l'**Infrastructure as Code (IaC)** est : **définir de manière déclarative les ressources d'infrastructure par du code, de sorte qu'elles bénéficient du versionnement, de l'exécution automatisée et du déploiement reproductible.**

### 4.3 Terraform

Terraform est l'outil IaC le plus utilisé actuellement, développé par HashiCorp. Il utilise le langage dédié **HCL (HashiCorp Configuration Language)**.

Terraform adopte un paradigme **déclaratif** : l'utilisateur décrit l'état final souhaité, Terraform calcule automatiquement les opérations nécessaires pour passer de l'état actuel à l'état cible.

```hcl
# Définir un serveur cloud
resource "aws_instance" "my_server" {
  ami           = "ami-0c55b159cbfafe1f0"  # Image du système d'exploitation
  instance_type = "t3.micro"               # Type d'instance

  tags = {
    Name = "my-first-server"
  }
}

# Définir une instance de base de données PostgreSQL
resource "aws_db_instance" "my_database" {
  engine         = "postgres"
  instance_class = "db.t3.micro"
  username       = "admin"
  password       = "please-use-secrets-manager"
}
```

Flux d'exécution :

```bash
terraform plan    # Prévisualiser les modifications à effectuer
terraform apply   # Confirmer et exécuter, crée automatiquement les ressources sur la plateforme cloud
```

### 4.4 Pulumi

Pulumi propose une autre approche : **utiliser directement des langages de programmation généraux (TypeScript, Python, Go, etc.) pour définir l'infrastructure**, plutôt que d'apprendre la syntaxe dédiée HCL.

La même définition de serveur, exprimée avec Pulumi + TypeScript :

```typescript
import * as aws from "@pulumi/aws";

const server = new aws.ec2.Instance("my-server", {
    ami: "ami-0c55b159cbfafe1f0",
    instanceType: "t3.micro",
    tags: { Name: "my-first-server" },
});

const bucket = new aws.s3.Bucket("my-bucket", {
    acl: "private",
});

export const serverIp = server.publicIp;
```

Comme il utilise un langage de programmation général, les développeurs peuvent tirer parti des boucles, conditions, abstraction par fonctions et autres caractéristiques du langage pour gérer une logique d'infrastructure complexe.

### 4.5 Comparaison entre Terraform et Pulumi

| Dimension | Terraform | Pulumi |
|------|-----------|--------|
| **Langage** | HCL (langage dédié) | TypeScript / Python / Go et autres langages généraux |
| **Coût d'apprentissage** | Nécessite d'apprendre la syntaxe HCL | Utilise un langage déjà maîtrisé, coût d'apprentissage faible |
| **Écosystème communautaire** | Très mature, couvre presque tous les fournisseurs de cloud | Croissance rapide, mais taille inférieure à Terraform |
| **Scénarios d'utilisation** | Gestion standardisée de l'infrastructure portée par les équipes Ops | Projets portés par les développeurs, scénarios nécessitant une logique complexe |
| **Adéquation à la génération par l'IA** | Élevée (motifs fixes) | Très élevée (essentiellement du code en langage général) |

**Point clé** : HCL dans les outils IaC est un DSL externe typique — il possède sa propre syntaxe et son analyseur, dédié à la description déclarative de l'état de l'infrastructure. Pulumi, en revanche, adopte une stratégie de DSL interne — utilisant la syntaxe d'un langage de programmation général pour exprimer des concepts propres au domaine. Les deux ont le même objectif (transformer la gestion de l'infrastructure de la manipulation manuelle au pilotage par code), mais empruntent des voies différentes (langage dédié vs langage général). Le code peut être versionné dans Git, faire l'objet de revues d'équipe, d'exécution automatisée et de retour en arrière.

---

## 5. Code de collage et génération automatique de SDK

### 5.1 Qu'est-ce que le code de collage

En ingénierie logicielle, le **code de collage (Glue Code)** désigne du code qui ne contient pas de logique métier en soi, mais sert uniquement à connecter deux systèmes ou modules.

Le code de collage typique comprend :

- Le code de requête HTTP écrit par le frontend pour appeler l'API backend (construction d'URL, définition des en-têtes, analyse de la réponse)
- Le code client HTTP écrit par le service backend A pour appeler l'interface du service B
- Le code d'adaptation d'interface entre différents langages de programmation

La caractéristique de ce code : **hautement répétitif, à motifs fixes, mais impossible à omettre.**

### 5.2 Spécification OpenAPI et génération automatique de code

Puisque le code de collage présente des motifs hautement standardisés, la solution de l'ingénierie est : **décrire d'abord les interfaces API dans un format standard, puis générer automatiquement le code client avec un outil.**

La **spécification OpenAPI** (anciennement Swagger) est le standard de l'industrie pour décrire les API REST. Elle utilise le format YAML ou JSON pour définir précisément les chemins, paramètres, corps de requête et structure de réponse des API :

```yaml
openapi: 3.0.0
info:
  title: API du service de messagerie
  version: 1.0.0

paths:
  /emails:
    post:
      summary: Envoyer un email
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                to:
                  type: string
                  example: "user@example.com"
                subject:
                  type: string
                body:
                  type: string
      responses:
        '200':
          description: Envoi réussi
```

À partir de ce fichier de spécification, des outils comme `openapi-generator` peuvent générer automatiquement des SDK clients dans plusieurs langages :

- **Python** : `client.emails.send(to="user@example.com", subject="Hi", body="Hello")`
- **TypeScript** : `client.emails.send({ to: "user@example.com", subject: "Hi", body: "Hello" })`
- **Go** : `client.Emails.Send(ctx, &SendEmailRequest{To: "user@example.com", ...})`

Le SDK généré encapsule tous les détails de la requête HTTP ; l'appelant n'a pas besoin de se soucier du chemin URL, de la méthode HTTP, du format de sérialisation, etc.

### 5.3 Relire le cas d'Armin

Revenons au cas introductif de cet article. On peut maintenant comprendre avec précision chaque composant :

| Composant | Nature | Description |
|---------|------|------|
| **Go** | Code de logique métier | Implémentation des fonctionnalités centrales du service de messagerie |
| **YAML** | Fichiers de configuration | Configuration de service, définition du pipeline CI/CD, fichier de spécification OpenAPI |
| **Pulumi** | Code d'infrastructure | Définition des ressources cloud (serveurs, base de données, réseau) en Go/TypeScript |
| **Code de collage SDK** | Bibliothèque client générée automatiquement | SDK Python et TypeScript générés automatiquement à partir de la spécification OpenAPI |

Parmi ceux-ci, la configuration YAML, la définition de ressources Pulumi et le code de collage SDK sont trois types de code hautement standardisés, soumis à des spécifications contraignantes — c'est précisément le domaine où l'IA est la plus performante en génération de code. Ainsi, "40 000 lignes de code dont 90 % générées par l'IA" est tout à fait raisonnable.

---

## 6. La relation entre l'IA et les DSL

### 6.1 Analyse de l'adéquation de la génération de code par l'IA

| Dimension de caractéristique | Adapté à la génération par l'IA | Non adapté à la génération par l'IA |
|---------|-------------|---------------|
| **Degré de standardisation** | Hautement répétitif, existence de modèles fixes | Nécessite un design créatif, sans précédent |
| **Contraintes de spécification** | Existence d'un schema ou d'une syntaxe normée | Besoins flous, limites imprécises |
| **Dépendance au contexte** | Cohérence locale, une définition unitaire ne dépend pas de la compréhension globale | Nécessite de comprendre l'intention architecturale de l'ensemble du système |
| **Vérifiabilité** | Peut être validé automatiquement par un outil (ex. `terraform validate`) | Ne peut reposer que sur le jugement humain de la pertinence du design |

Les quatre catégories de technologies présentées dans cet article — fichiers de configuration, scripts embarqués, code IaC, code de collage SDK — possèdent toutes les caractéristiques de la colonne de gauche. Cela explique pourquoi l'IA est significativement plus performante dans la génération de code pour ces domaines que pour la logique métier.

### 6.2 Cadre d'évaluation

Pour juger si un code est adapté à la génération par l'IA, on peut se référer aux trois critères suivants :

1. **Existe-t-il une spécification ou un schema existant ?** — Si oui, c'est favorable à l'IA
2. **S'agit-il d'un motif largement répété ?** — Si oui, c'est favorable à l'IA
3. **Le résultat généré peut-il être validé automatiquement par un outil ?** — Si oui, c'est favorable à l'IA

Le code satisfaisant les trois critères (comme la génération de SDK à partir d'une spécification OpenAPI, ou la définition en lot de ressources homogènes avec Terraform) peut être confié en grande partie à l'IA. Le code ne satisfaisant aucun des trois critères (comme la conception d'un nouveau protocole de cohérence distribué) doit encore être réalisé par les ingénieurs eux-mêmes.

---

## 7. Glossaire

| Terme | Nom complet / Français | Définition |
|------|------------|------|
| **DSL** | Domain-Specific Language / Langage dédié | Langage conçu pour un domaine spécifique, par opposition aux langages de programmation généraux |
| **GPL** | General-Purpose Language / Langage de programmation général | Langage de programmation capable de résoudre n'importe quel problème de calcul, comme Python, Java, Go |
| **DSL externe** | External DSL | Langage dédié possédant sa propre syntaxe et son analyseur, comme SQL, HCL, YAML |
| **DSL interne** | Internal DSL / Embedded DSL | Expression dédiée construite à l'intérieur d'un langage général en utilisant la syntaxe hôte, comme Pulumi |
| **Sérialisation de données** | Data Serialization | Processus de conversion de structures de données en mémoire en un format stockable ou transmissible |
| **INI** | Initialization | Format de configuration clé-valeur le plus ancien, originaire de Windows |
| **CSV** | Comma-Separated Values / Valeurs séparées par des virgules | Format de tableau en texte brut avec champs séparés par des virgules |
| **XML** | eXtensible Markup Language / Langage de balisage extensible | Format de données texte basé sur des balises, très expressif mais syntaxe verbeuse |
| **JSON** | JavaScript Object Notation | Format d'échange de données léger basé sur des paires clé-valeur, standard de facto pour les API Web |
| **YAML** | YAML Ain't Markup Language | Format de fichier de configuration basé sur l'indentation, largement utilisé dans le backend et DevOps |
| **TOML** | Tom's Obvious Minimal Language | Format de configuration à syntaxe explicite, courant dans les écosystèmes Rust et Python |
| **Protobuf** | Protocol Buffers | Format de sérialisation binaire développé par Google, nécessite un Schema prédéfini, volume réduit, vitesse élevée |
| **MessagePack** | — | Format de sérialisation binaire similaire à JSON, sans Schema |
| **Lua** | — | Langage de script embarqué léger, souvent utilisé dans les moteurs de jeux, serveurs Web et extensions de bases de données |
| **IaC** | Infrastructure as Code / Infrastructure as Code | Pratique d'ingénierie consistant à définir et gérer les ressources de cloud computing par du code |
| **Terraform** | — | Outil IaC développé par HashiCorp, utilisant le langage déclaratif HCL |
| **HCL** | HashiCorp Configuration Language | Langage de configuration dédié utilisé par Terraform |
| **Pulumi** | — | Outil IaC supportant les langages de programmation généraux |
| **OpenAPI** | — | Spécification standard de l'industrie pour décrire les interfaces API REST (anciennement Swagger) |
| **SDK** | Software Development Kit / Kit de développement logiciel | Bibliothèque client encapsulant les détails des appels API |
| **Code de collage** | Glue Code | Code d'adaptation sans logique métier, servant uniquement à connecter deux systèmes |

---

## Résumé

L'ingénierie backend comporte une grande quantité de code non métier. Ces éléments partagent un concept englobant : les **DSL (langages dédiés)** — des langages conçus pour des domaines spécifiques, par opposition aux langages de programmation généraux.

Les DSL présentés dans cet article se répartissent en quatre catégories :

1. **Formats de sérialisation de données** (XML / JSON / YAML / TOML / CSV / Protobuf, etc.) — DSL externes de type description de données pure, convertissant les données structurées en une forme stockable et transmissible
2. **Langages de script embarqués** (Lua, etc.) — entre la configuration et les langages généraux, fournissant au programme hôte des capacités d'extension programmables
3. **Langages de définition d'infrastructure** (HCL / Dockerfile, etc.) — DSL externes déclaratifs, décrivant l'état souhaité du système ; Pulumi réalise le même objectif en tant que DSL interne
4. **Langages de description d'interface et génération de code de collage** (OpenAPI / .proto) — génération automatique de code de connexion entre systèmes à partir de spécifications

Une fois compris le cadre de classification des DSL, face aux divers "codes qui ne ressemblent pas à du code" dans les projets backend, on peut rapidement identifier leur nature : à quelle catégorie de DSL ils appartiennent, quel problème de domaine ils résolvent, pourquoi on n'utilise pas un langage de programmation général.

Par ailleurs, les code DSL étant hautement standardisés, pilotés par des spécifications et automatiquement vérifiables, ils constituent aussi le domaine d'application le plus efficace des technologies actuelles de génération de code par l'IA.
