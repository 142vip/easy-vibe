# Principes : Bases de données : Index, Transactions, Optimisation
::: tip 🎯 Question centrale
**Pourquoi votre requête Excel prend 10 secondes, tandis qu'une recherche sur un site e-commerce ne prend que 0,01 seconde ?** Quand les données passent de « quelques milliers » à « un milliard », et d'« une seule personne » à « des millions d'utilisateurs simultanés », Excel ne suffit plus. Les bases de données ont été créées pour résoudre ce problème — ce sont des « super-Excel » spécialisées dans le traitement de données massives et la forte concurrence. Ce chapitre vous fait découvrir les principes fondamentaux des bases de données, depuis zéro.
:::

---

## 1. Motivation et justification : « les bases de données »

### 1.1 De la petite librairie à Amazon : L'évolution de l'échelle des données

Imaginez que vous tenez une petite librairie et vendez quelques livres par jour. Vous notez dans un carnet :

```
2024-01-15 : Jean a acheté « Cent ans de solitude », 59 euros
2024-01-16 : Marie a acheté « La Condition humaine », 39 euros
```

À ce stade, le carnet suffit amplement. Mais quand votre librairie devient un « Amazon » avec un million de commandes par jour, les problèmes apparaissent :

- **Volume de données** : Plus quelques dizaines de lignes, mais des centaines de millions
- **Accès concurrentiel** : Plus une seule personne qui consulte, mais des millions d'utilisateurs simultanés
- **Relations entre données** : Les commandes sont liées aux utilisateurs, produits, stocks, logistique... des relations complexes à gérer efficacement
- **Sécurité des données** : Une coupure de courant ne doit pas effacer toutes les commandes

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📓 Excel / Carnet**
- Adapté aux individus ou petites équipes
- Volume de données : quelques milliers à quelques dizaines de milliers de lignes
- Utilisateur unique, accès séquentiel
- Recherche manuelle, lente

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🗄️ Base de données**
- Adaptée aux applications d'entreprise
- Volume de données : des centaines de millions et plus
- Des millions d'utilisateurs en ligne simultanément
- Requêtes en millisecondes

</div>
</div>

**C'est le problème que résout la « base de données » : comment stocker efficacement, interroger rapidement et gérer en toute sécurité des données massives ?**

### 1.2 Une histoire vraie : Pourquoi il ne faut pas stocker les données utilisateurs dans Excel

Vous pourriez dire : « Mon projet n'a que quelques dizaines de milliers d'utilisateurs, Excel ne suffit-il pas ? » Laissez-moi vous raconter une histoire vraie.

::: warning L'aventure malheureuse de Lucas
Lucas a lancé une application sociale. Au début, les utilisateurs n'étaient pas nombreux, alors il stockait leurs informations (nom, téléphone, date d'inscription, etc.) dans Excel. Chaque jour, il exportait Excel pour suivre la croissance — tout allait bien.

Quand le nombre d'utilisateurs a dépassé 100 000, les problèmes ont commencé :
- Excel mettait 5 minutes à s'ouvrir
- Filtrer « les utilisateurs de Paris » faisait planter l'application
- Une fois, le fichier Excel s'est corrompu et des milliers de données utilisateurs ont été définitivement perdues

Le plus critique : il voulait implémenter la fonctionnalité « voir toutes les commandes d'un utilisateur » — mais les informations utilisateurs et les commandes étaient dans des fichiers Excel séparés, il devait copier-coller manuellement, ce qui prenait à chaque fois une demi-heure.

Il a demandé conseil à un ancien. Celui-ci a regardé et a souri : « Ce dont tu as besoin, ce n'est pas d'Excel, mais d'une base de données. »

Après être passé à une base de données, tout a changé :
- La requête « utilisateurs de Paris » ne prenait plus que 0,01 seconde
- Grâce aux « relations », utilisateurs et commandes étaient automatiquement liés — une seule instruction SQL suffisait
- Sauvegarde automatique des données — plus aucune crainte de corruption de fichier

Lucas a compris une vérité : **Quand les données sont petites, n'importe quoi fonctionne ; mais quand elles deviennent volumineuses, Excel est un désastre.**
:::

::: info 💡 Leçon clé
Une base de données n'est pas « un Excel plus complexe », mais repose sur une philosophie de conception totalement différente :
- **Excel** : Conçu pour les petites données et l'usage individuel
- **Base de données** : Conçue pour les données massives, la forte concurrence et les relations complexes

Choisir le bon outil peut améliorer les performances système de plusieurs milliers de fois.
:::

---

## 2. Concepts clés : Table, ligne, colonne, clé primaire

::: tip 🤔 Quel est le lien entre ces concepts et les bases de données ?
Les tables, lignes, colonnes et clés primaires sont les « briques » des bases de données.

Imaginez que vous construisez une maison :
- **Table** = une pièce (stocke un type de données)
- **Ligne** = une boîte dans la pièce (un enregistrement complet)
- **Colonne** = l'étiquette sur la boîte (nom, âge, etc.)
- **Clé primaire** = le numéro unique de la boîte (jamais en double)

Comprendre ces concepts de base est essentiel pour savoir comment les données sont organisées.
:::

Avant d'approfondir les bases de données, nous devons d'abord clarifier ces concepts clés. Pour vous aider à comprendre, utilisons la métaphore de la bibliothèque.

### 2.1 Comprendre la structure d'une base de données avec la métaphore de la bibliothèque

Imaginez que vous entrez dans une bibliothèque. Son organisation est étonnamment similaire à celle d'une base de données :

| Concept | 📚 Métaphore bibliothèque | Fonction réelle | Exemple concret |
|------|-------------|----------|----------|
| **Base de données (Database)** | Toute la bibliothèque | Conteneur stockant toutes les données | Base de données d'un site e-commerce |
| **Table (Table)** | Une étagière | Collection de données de même nature | Table utilisateurs, table produits, table commandes |
| **Colonne (Column)** | L'étiquette sur la tranche du livre | Attributs des données (champs) | Nom, âge, numéro de téléphone |
| **Ligne (Row)** | Chaque livre sur l'étagère | Un enregistrement de données concret | « Jean, 25 ans, Paris » |
| **Clé primaire (Primary Key)** | Le numéro ISBN de chaque livre | ID identifiant de manière unique chaque ligne | user_id = 1001 |

**Un exemple concret** : Table utilisateurs (users)

| user_id (clé primaire) | name | age | city | email |
|:-------------:|------|-----|------|-------|
| 1001 | Jean | 25 | Paris | jean@example.com |
| 1002 | Marie | 30 | Lyon | marie@example.com |
| 1003 | Pierre | 28 | Paris | pierre@example.com |

- **Table** : `users` (stocke toutes les données utilisateurs)
- **Colonnes** : `user_id`, `name`, `age`, `city`, `email` (les attributs de chaque utilisateur)
- **Lignes** : Chaque ligne est un utilisateur (par ex. « Jean, 25 ans, Paris »)
- **Clé primaire** : `user_id` (1001, 1002, 1003 — jamais en double)

### 2.2 Clé primaire (Primary Key) : Le « numéro de sécurité sociale » des données

::: tip 📖 Qu'est-ce qu'une clé primaire ?
La **clé primaire** est l'identifiant unique de chaque ligne dans une table, comme un numéro de sécurité sociale.

**Caractéristiques clés** :
- **Unicité** : Jamais en double (deux personnes ne peuvent pas avoir le même numéro de sécurité sociale)
- **Non nulle** : Doit avoir une valeur (il ne peut pas y avoir de personne « sans numéro de sécurité sociale »)
- **Immuabilité** : Une fois définie, elle ne change pas (votre numéro de sécurité sociale ne change pas)

**Pratiques courantes** :
- Utiliser un entier auto-incrémenté : 1, 2, 3, 4...
- Utiliser un UUID (identifiant universellement unique) : `550e8400-e29b-41d4-a716-446655440000`
:::

Pourquoi a-t-on besoin d'une clé primaire ? Imaginez un monde sans clé primaire :

**Scénario** : Vous voulez modifier l'âge de « Jean », mais la table contient 3 « Jean ». Lequel le système doit-il modifier ?

```sql
-- Sans clé primaire, cela modifie tous les « Jean » !
UPDATE users SET age = 26 WHERE name = 'Jean';

-- Avec clé primaire, modification précise
UPDATE users SET age = 26 WHERE user_id = 1001;
```

**La règle d'or de la clé primaire** : Chaque table doit avoir une clé primaire, et elle ne doit jamais être modifiée.

### 2.3 Clé étrangère (Foreign Key) : Le pont entre les tables

C'est la clé de la supériorité des bases de données sur Excel — **les tables peuvent être mises en relation les unes avec les autres**.

::: tip 📖 Qu'est-ce qu'une clé étrangère ?
Une **clé étrangère** est une colonne qui pointe vers la clé primaire d'une autre table, utilisée pour établir une association entre tables.

**Compréhension simple** :
- Clé primaire = mon numéro de sécurité sociale
- Clé étrangère = le numéro de sécurité sociale de quelqu'un d'autre que je référence

**Un exemple** : Le champ `user_id` dans la table des commandes est une clé étrangère qui pointe vers la clé primaire de la table utilisateurs.
:::

Un exemple concret :

**Table utilisateurs (users)** :

| user_id (clé primaire) | name | phone |
|:-------------:|------|-------|
| 1001 | Jean | 06xxxx |
| 1002 | Marie | 07xxxx |

**Table commandes (orders)** :

| order_id (clé primaire) | product_name | price | user_id (clé étrangère) |
|:--------------:|-------------|-------|:-------------:|
| 5001 | iPhone 15 | 5999 | 1001 |
| 5002 | MacBook | 14999 | 1001 |
| 5003 | AirPods | 1999 | 1002 |

**Compréhension clé** :
- `user_id = 1001` dans la table commandes pointe vers `user_id = 1001` (Jean) dans la table utilisateurs
- Quand vous cherchez « qui a passé la commande 5001 », la base de données va automatiquement chercher l'utilisateur avec `user_id = 1001` dans la table utilisateurs

**Avantages** :
- **Pas de duplication de données** : Même si Jean achète 100 produits, ses informations ne sont stockées qu'une seule fois dans la table utilisateurs
- **Maintenance facile** : Si Jean change de numéro, il suffit de modifier la table utilisateurs ; toutes les commandes seront automatiquement associées au nouveau numéro
- **Requêtes flexibles** : Les questions complexes comme « combien chaque utilisateur a-t-il dépensé au total » deviennent faciles à répondre

<DatabaseRelationDemo />

---

## 3. Approche et mise en œuvre : communication à une base de données Introduction et pratique du SQL

Vous ne pouvez pas « cliquer » directement sur une base de données avec la souris (il existe des outils graphiques, mais ils convertissent essentiellement les clics en commandes). Vous avez besoin d'un langage spécial pour donner des instructions à la base de données.

Ce langage s'appelle **SQL (Structured Query Language, langage de requête structuré)**.

Bonne nouvelle : SQL ressemble beaucoup à l'anglais naturel et se lit presque comme si l'on parlait.

### 3.1 Les opérations fondamentales du SQL : CRUD

La plupart du temps, il suffit de maîtriser quatre opérations, connues dans le métier sous le nom de **CRUD** :

| Opération | Anglais | Mot-clé SQL | Explication simple |
|------|------|------------|----------|
| **C**reate | Créer | `INSERT` | Ajouter une nouvelle donnée |
| **R**ead | Lire | `SELECT` | Consulter des données |
| **U**pdate | Mettre à jour | `UPDATE` | Modifier des données |
| **D**elete | Supprimer | `DELETE` | Effacer des données |

::: tip 📊 Que nous dit ce tableau ?
Ces quatre opérations couvrent tous les scénarios de traitement de données :
- **Create** : À l'inscription, insérer un nouvel enregistrement utilisateur
- **Read** : À la connexion, vérifier le nom d'utilisateur et le mot de passe
- **Update** : Quand l'utilisateur modifie son profil, mettre à jour les données dans la table
- **Delete** : Quand l'utilisateur supprime son compte, effacer ses données

Mémorisez ces quatre opérations et vous maîtrisez 80 % des opérations SQL quotidiennes.
:::

### 3.2 Consulter des données (SELECT) : L'opération la plus utilisée

La consultation est la fonction la plus importante d'une base de données et la clé de l'optimisation des performances.

**Exemple 1** : Trouver tous les utilisateurs de Paris

```sql
SELECT name, age FROM users WHERE city = 'Paris';
```

**Compréhension mot à mot** :
- `SELECT name, age` : Sélectionner les colonnes name et age
- `FROM users` : Dans la table users
- `WHERE city = 'Paris'` : Sous la condition où city est « Paris »

**Résultat** :

| name | age |
|------|-----|
| Jean | 25 |
| Pierre | 28 |

**Exemple 2** : Trouver les produits dont le prix est entre 5000 et 15000

```sql
SELECT name, price FROM products
WHERE price BETWEEN 5000 AND 15000;
```

**Exemple 3** : Recherche floue (trouver les utilisateurs dont le nom contient « Je »)

```sql
SELECT name FROM users WHERE name LIKE '%Je%';
```

::: warning ⚠️ Piège de performance : Utilisation de LIKE
`LIKE '%Je%'` provoque un **balayage complet de la table** (full table scan), très lent avec beaucoup de données.

**Conseil d'optimisation** :
- ❌ Ne pas utiliser `LIKE '%Je%'` (% devant et derrière)
- ✅ Utilisable : `LIKE 'Je%'` (% seulement derrière)

Car `LIKE 'Je%'` peut utiliser un index, alors que `LIKE '%Je%'` ne le peut pas.
:::

### 3.3 Insérer des données (INSERT) : Ajouter des enregistrements

**Exemple** : Ajouter un nouvel utilisateur

```sql
INSERT INTO users (user_id, name, age, city, email)
VALUES (1004, 'Sophie', 35, 'Marseille', 'sophie@example.com');
```

**Compréhension mot à mot** :
- `INSERT INTO users` : Insérer dans la table users
- `(user_id, name, age, city, email)` : Spécifier les colonnes à insérer
- `VALUES (1004, 'Sophie', ...)` : Les valeurs correspondantes

**Insertion en lot** (plus efficace) :

```sql
INSERT INTO users (name, age, city) VALUES
('Luc', 25, 'Paris'),
('Claire', 28, 'Lyon'),
('Paul', 30, 'Marseille');
```

### 3.4 Mettre à jour des données (UPDATE) : Modifier des enregistrements

**Exemple** : Augmenter de 1 l'âge de tous les utilisateurs parisiens

```sql
UPDATE users SET age = age + 1 WHERE city = 'Paris';
```

::: danger ❌ Très dangereux : N'oubliez pas WHERE !
Si vous oubliez la clause `WHERE`, vous modifiez **toutes les lignes** !

```sql
-- Dangereux ! Cela change l'âge de tous les utilisateurs à 26
UPDATE users SET age = 26;

-- Correct : Modifier uniquement l'utilisateur avec user_id = 1001
UPDATE users SET age = 26 WHERE user_id = 1001;
```

**Leçon vraie** : En 2012, un ingénieur d'une entreprise renommée a oublié WHERE, entraînant la mise à jour erronée de millions de données utilisateurs en production, paralyant le système pendant 4 heures avec des pertes considérables.
:::

### 3.5 Supprimer des données (DELETE) : Effacer des enregistrements

**Exemple** : Supprimer l'utilisateur avec user_id = 1004

```sql
DELETE FROM users WHERE user_id = 1004;
```

::: danger ❌ Doublement dangereux : DELETE exige WHERE encore plus !
```sql
-- Dangereux ! Cela supprime toutes les données de la table !
DELETE FROM users;

-- Correct : Supprimer uniquement la ligne spécifiée
DELETE FROM users WHERE user_id = 1004;
```

**Meilleures pratiques** :
1. Avant de supprimer, vérifier les données avec SELECT
2. Dans les systèmes critiques, utiliser la « suppression douce » (ajouter un champ `is_deleted` pour marquer la suppression)
3. Sauvegarder les données avant toute opération en production
:::

### 3.6 Requêtes multi-tables (JOIN) : Le moment magique des bases de données

Vous vous souvenez des « clés étrangères » dont nous avons parlé ? La force la plus grande de SQL est la capacité d'interroger plusieurs tables liées en une seule requête.

**Scénario** : Rechercher « tous les produits achetés par Jean »

Nous avons trois tables :

**Table utilisateurs (users)** :
| user_id | name |
|---------|------|
| 1001 | Jean |

**Table produits (products)** :
| product_id | name | price |
|------------|------|-------|
| 201 | iPhone 15 | 5999 |
| 202 | MacBook | 14999 |

**Table commandes (orders)** :
| order_id | user_id | product_id | quantity |
|----------|---------|------------|----------|
| 5001 | 1001 | 201 | 1 |
| 5002 | 1001 | 202 | 2 |

**Requête SQL** :

```sql
SELECT u.name, p.name AS product_name, p.price, o.quantity
FROM orders o
JOIN users u ON o.user_id = u.user_id
JOIN products p ON o.product_id = p.product_id
WHERE u.name = 'Jean';
```

**Résultat** :

| name | product_name | price | quantity |
|------|--------------|-------|----------|
| Jean | iPhone 15 | 5999 | 1 |
| Jean | MacBook | 14999 | 2 |

**Comprendre le processus du JOIN** :
1. `FROM orders o` : Commencer par la table des commandes
2. `JOIN users u ON o.user_id = u.user_id` : Joindre la table utilisateurs via user_id
3. `JOIN products p ON o.product_id = p.product_id` : Joindre la table produits via product_id
4. `WHERE u.name = 'Jean'` : Filtrer les commandes de Jean

<SqlPlaygroundDemo />

---

## 4. Motivation et justification : les bases de données sont-elles si rapides Révélation du principe des index

C'est la partie la plus fascinante des bases de données, et aussi la question la plus posée en entretien.

Si vous cherchez dans Excel « toutes les personnes dont le nom commence par Je », Excel doit scanner de la première à la dernière ligne. C'est un **balayage complet de la table** — plus il y a de données, plus c'est lent.

Mais dans une base de données, même avec 1 milliard de lignes, la recherche ne prend que quelques millisecondes.

**Le secret : les index (Index).**

### 4.1 Compréhension intuitive : L'inspiration du dictionnaire

Imaginez que vous devez chercher un mot dans un livre de 1000 pages sans table des matières. Que faites-vous ?

**Vous ne pouvez que tourner les pages une par une** — c'est le balayage complet, en moyenne 500 pages à tourner.

Mais si ce livre possède un **index alphabétique** ?

Vous cherchez le mot « base de données » :
1. Ouvrez l'index et trouvez la section commençant par « b »
2. Dans la section « b », cherchez « a »
3. L'index vous indique : page 256

Vous trouvez en seulement 3 recherches ! C'est la **recherche par index**.

**L'index d'une base de données est comme la table des matières d'un livre** :
- Sans index : Balayage ligne par ligne (1 milliard de lignes = plusieurs minutes)
- Avec index : Saut direct (1 milliard de lignes = 3 accès disque = quelques millisecondes)

### 4.2 Balayage complet vs Recherche par index : Comparaison de vitesse

Supposons une table utilisateurs avec 10 millions d'enregistrements.

**Scénario** : Trouver l'utilisateur avec `user_id = 5 555 555`

| Méthode | Processus | Lignes à vérifier | Temps estimé |
|------|------|----------------|----------|
| **Balayage complet** | Commencer à la ligne 1, vérifier une par une | En moyenne 5 millions de lignes | 5-30 secondes |
| **Recherche par index** | Parcourir l'arbre d'index et sauter directement à la cible | 3-4 comparaisons | 0,003 seconde |

**Écart de vitesse : Plusieurs milliers de fois !**

::: tip 💡 Leçon clé
Les index ne sont pas une baguette magique ; ils ont un coût :
- **Espace occupé** : Les index nécessitent de l'espace de stockage supplémentaire
- **Ralentissement des écritures** : Chaque INSERT/UPDATE/DELETE doit aussi mettre à jour l'index

**Quand créer un index ?**
- Colonnes fréquemment utilisées dans les requêtes (conditions WHERE, JOIN)
- Volumes de données importants (quelques milliers de lignes n'en ont pas besoin)

**Quand ne pas créer d'index ?**
- Colonnes rarement interrogées
- Colonnes fréquemment mises à jour
- Tables de petite taille
:::

### 4.3 Structure de données sous-jacente : L'arbre B+

Les vrais index ne sont pas de simples « listes alphabétiques », mais une structure de données soigneusement conçue appelée **arbre B+ (B+ Tree)**.

::: tip 📖 Qu'est-ce qu'un arbre B+ ?
L'**arbre B+** est une structure de données arborescente « plate et large » :

- **Plate** : De la racine aux feuilles, généralement 3-4 niveaux seulement
- **Large** : Chaque nœud peut stocker plusieurs centaines de clés

**Pourquoi « plate et large » ?**

Les données sont stockées sur disque, et chaque lecture disque (I/O) est extrêmement lente (des milliers de fois plus lent que la mémoire). L'objectif de conception de l'arbre B+ est de **minimiser le nombre d'I/O disque**.

- 3-4 niveaux de hauteur = au maximum 3-4 lectures disque
- Chaque niveau stocke une grande quantité de données = garantit que l'arbre ne sera pas trop haut
:::

**Un exemple concret** :

Supposons que chaque nœud d'un arbre B+ puisse stocker 1000 clés :

- **Nœud racine** : 1000 clés → pointe vers 1000 nœuds enfants
- **Nœuds intermédiaires** : Chacun stocke 1000 clés → pointe vers 1000 nœuds feuilles
- **Nœuds feuilles** : Chacun stocke 1000 données réelles

**Volume total de données** = 1000 × 1000 × 1000 = **1 milliard de données**

**Hauteur de l'arbre** = **3 niveaux**

Cela signifie : pour trouver n'importe quelle donnée parmi 1 milliard, il suffit de **3 accès disque** !

C'est le secret de la rapidité fulgurante des requêtes en base de données.

<BPlusTreeDemo />

---

## 5. Transactions : Comment garantir que les données ne sont ni perdues ni corrompues

Imaginez la réservation de billets de train pour les fêtes :

- Temps T1 : L'utilisateur A consulte et voit « Train G1234, 1 place restante »
- Temps T2 : L'utilisateur B consulte aussi et voit « 1 place restante »
- Temps T3 : L'utilisateur A clique « Acheter » ; le système décrémente le stock, le billet est vendu à A
- Temps T4 : L'utilisateur B clique « Acheter » — sans mécanisme de protection, le système décrémente à nouveau le stock et vend le même billet à B !

C'est un classique problème de **conflit de concurrence**.

### 5.1 Qu'est-ce qu'une transaction (Transaction)

Une **transaction** est un ensemble d'opérations de base de données qui **réussissent toutes ensemble ou échouent toutes ensemble** — il n'y a pas d'état « à moitié fait ».

::: tip 🤖 Un exemple du quotidien
Le **virement bancaire** est une transaction typique :

1. Débiter 100 euros du compte A
2. Créditer 100 euros sur le compte B

Si l'étape 1 réussit mais que l'étape 2 échoue (par exemple coupure de courant), que se passe-t-il ?
- **Sans transaction** : L'argent du compte A a disparu, le compte B n'a rien reçu — l'argent s'est volatilisé
- **Avec transaction** : Le système détecte l'échec de l'étape 2 et annule automatiquement (rollback) l'étape 1 ; les deux comptes reviennent à leur état initial

C'est l'**atomicité** des transactions : tout ou rien.
:::

### 5.2 Les quatre propriétés des transactions (ACID)

Les transactions ont quatre propriétés, abrégées en **ACID** :

| Propriété | Anglais | Signification | Exemple du virement bancaire |
|------|------|------|--------------|
| **A**tomicité | Atomicité | Tout ou rien | Le débit et le crédit doivent réussir ensemble ; on ne peut pas débiter sans créditer |
| **C**ohérence | Cohérence | Les données restent toujours dans un état légal | Avant et après le virement, le total des deux comptes doit rester inchangé |
| **I**solation | Isolation | Plusieurs transactions ne s'affectent pas mutuellement | Pendant que A fait un virement, B doit voir le solde « avant » ou « après », pas un état intermédiaire |
| **D**urabilité | Durabilité | Une fois validé (commit), les données sont sauvegardées en permanence | Après un virement réussi, même une coupure de courant ne ramène pas les soldes en arrière |

::: tip 📊 Que nous dit ce tableau ?
Ces quatre propriétés garantissent la sécurité des données :

- **Atomicité** : Prévient les « actions à moitié exécutées » (débité mais pas crédité)
- **Cohérence** : Prévient les données illogiques (le total change après le virement)
- **Isolation** : Prévient les conflits de concurrence (deux personnes modifiant les mêmes données simultanément)
- **Durabilité** : Prévient la perte de données (commit résiste aux coupures de courant)

Sans ces garanties, un système bancaire ne pourrait tout simplement pas fonctionner.
:::

### 5.3 Niveaux d'isolation des transactions : Arbitrer entre sécurité et performance

En théorie, nous souhaitons des transactions totalement isolées. Mais **isolation complète = performances dégradées** (car cela nécessite de nombreux verrous, les autres transactions doivent attendre).

Les bases de données proposent donc quatre **niveaux d'isolation** :

| Niveau d'isolation | Lecture sale | Lecture non répétable | Lecture fantôme | Performance | Scénario d'utilisation |
|----------|------|------------|------|------|----------|
| **Read Uncommitted** | Possible | Possible | Possible | Le plus rapide | Presque jamais utilisé (données potentiellement fausses) |
| **Read Committed** | Impossible | Possible | Possible | Rapide | Business courant (par défaut Oracle) |
| **Repeatable Read** | Impossible | Impossible | Possible | Moyen | Virements bancaires (par défaut MySQL) |
| **Serializable** | Impossible | Impossible | Impossible | Le plus lent | Scénarios extrêmement stricts (rarement utilisé) |

::: tip 📖 Que signifient les trois types de « lecture » ?
- **Lecture sale (Dirty Read)** : Lire des données qu'une autre transaction n'a pas encore validées (peuvent être annulées, données inexactes)
- **Lecture non répétable (Non-repeatable Read)** : Dans la même transaction, lire deux fois la même donnée donne des résultats différents (modifiée par une autre transaction)
- **Lecture fantôme (Phantom Read)** : Dans la même transaction, deux requêtes donnent des nombres de lignes différents (une autre transaction a inséré/supprimé des données)

**Exemples concrets** (consultation du solde bancaire) :
- **Lecture sale** : Vous voyez un solde de 1000 euros, mais l'autre transaction est annulée — en réalité il n'y a que 100 euros
- **Lecture non répétable** : La première consultation affiche 1000 euros, la seconde affiche 800 euros (montant débité entre-temps)
- **Lecture fantôme** : La première requête affiche 5 transactions, la seconde en affiche 6 (une nouvelle a été ajoutée)
:::

<TransactionACIDDemo />

---

## 6. Optimisation des performances : Techniques pratiques pour des requêtes 1000 fois plus rapides

Vous comprenez maintenant les concepts fondamentaux d'index et de transactions. Mais dans des projets réels, vous pouvez rencontrer divers problèmes de performance.

Cette section propose des **stratégies d'optimisation directement applicables**.

### 6.1 Guide des pièges liés à l'utilisation des index

::: warning ⚠️ Erreur courante : Les index qui ne fonctionnent pas
Souvent, vous avez créé un index, mais la requête reste lente — parce que l'index est **inopérant**.

**Causes courantes d'index inopérant** :
1. Utilisation de fonctions sur une colonne indexée
2. Conversion de type implicite
3. Requête LIKE commençant par %
4. Conditions OR (dans certains cas)
5. Index composé ne respectant pas la règle du préfixe le plus à gauche
:::

**Piège 1 : Utiliser des fonctions sur une colonne indexée**

```sql
-- ❌ Erreur : Fonction sur colonne indexée, l'index ne peut pas être utilisé
SELECT * FROM users WHERE YEAR(created_at) = 2024;

-- ✅ Correct : Réécrire en requête de plage, l'index peut être utilisé
SELECT * FROM users
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';
```

**Piège 2 : Conversion de type implicite**

```sql
-- Supposons user_id de type int
-- ❌ Erreur : Passer une chaîne, conversion implicite, l'index ne peut pas être utilisé
SELECT * FROM users WHERE user_id = '123';

-- ✅ Correct : Passer le type correspondant
SELECT * FROM users WHERE user_id = 123;
```

**Piège 3 : LIKE commençant par %**

```sql
-- ❌ Erreur : Commence par %, l'index ne peut pas être utilisé
SELECT * FROM users WHERE name LIKE '%Jean%';

-- ✅ Correct : Commencer par un préfixe fixe, l'index peut être utilisé
SELECT * FROM users WHERE name LIKE 'Jean%';

-- ✅ Ou utiliser un index plein texte (adapté à la recherche textuelle)
SELECT * FROM users WHERE MATCH(name) AGAINST('Jean');
```

### 6.2 Templates pratiques d'optimisation SQL

**Template 1 : Optimisation de la pagination (problème de pagination profonde)**

::: details Voir le problème et la solution
```sql
-- ❌ Problème : Avec un OFFSET élevé, la requête ralentit de plus en plus
SELECT * FROM orders
ORDER BY created_at DESC
LIMIT 10 OFFSET 1000000;

-- ✅ Solution 1 : Utiliser le timestamp de la dernière requête comme curseur
SELECT * FROM orders
WHERE created_at < '2024-01-15 12:00:00'
ORDER BY created_at DESC
LIMIT 10;

-- ✅ Solution 2 : Utiliser une requête de plage sur la clé primaire
SELECT * FROM orders
WHERE order_id > 1000000
ORDER BY order_id
LIMIT 10;
```
:::

**Template 2 : Optimisation de l'insertion en lot**

```sql
-- ❌ Inefficace : Insertions unitaires multiples (plusieurs allers-retours réseau)
INSERT INTO users (name, age) VALUES ('Jean', 25);
INSERT INTO users (name, age) VALUES ('Marie', 30);
INSERT INTO users (name, age) VALUES ('Pierre', 28);

-- ✅ Efficace : Insertion en lot en une seule instruction SQL (un seul aller-retour réseau)
INSERT INTO users (name, age) VALUES
('Jean', 25),
('Marie', 30),
('Pierre', 28);
```

**Template 3 : Éviter SELECT ***

```sql
-- ❌ Inefficace : Retourner toutes les colonnes (y compris les grands champs inutiles)
SELECT * FROM users WHERE user_id = 1;

-- ✅ Efficace : Retourner uniquement les colonnes nécessaires
SELECT user_id, name, email FROM users WHERE user_id = 1;
```

### 6.3 Stratégies pour les scénarios de forte concurrence

| Scénario | Problème | Solution |
|------|------|----------|
| **Données hotspot** | Une ligne est lue/écrite très fréquemment, causant une contention de verrous | Utiliser un cache (Redis) + séparation lecture/écriture |
| **Vente flash** | Décrémentation du stock en forte concurrence soudaine | Verrouillage optimiste + préchargement du stock + file de messages pour l'écrêtage des pics |
| **Requêtes lentes** | Des requêtes complexes font plier la base de données | Optimisation des index + fractionnement des requêtes + séparation lecture/écriture |
| **Épuisement des connexions** | Trop de requêtes simultanées épuisent le pool de connexions | Optimisation du pool de connexions + limitation du débit + dégradation de service |

::: tip 💡 Leçon clé
Principes fondamentaux de l'optimisation des performances :
1. **Mesurer d'abord, optimiser ensuite** : Utiliser `EXPLAIN` pour analyser le plan de requête et identifier le vrai goulot d'étranglement
2. **Les index d'abord** : 80 % des problèmes de performance peuvent être résolus par l'optimisation des index
3. **Réduire la charge sur la base de données** : Utiliser le cache quand c'est possible, traiter de manière asynchrone quand c'est possible
4. **Diviser pour régner** : Grandes tables en petites tables, grandes requêtes en petites requêtes
:::

<QueryOptimizationDemo />

---

## 7. Résumé et parcours d'apprentissage

Récapitulons les concepts clés des bases de données avec un tableau :

| Concept | Explication en une phrase | Problème résolu | Point clé |
|------|-----------|-----------|--------|
| **Table, ligne, colonne** | L'organisation des données | Comment stocker des données structurées | Table = feuille Excel, ligne = enregistrement, colonne = champ |
| **Clé primaire** | L'identifiant unique de chaque ligne | Comment trouver précisément une ligne | Unique, non nulle, immuable |
| **Clé étrangère** | Le pont entre les tables | Comment associer les données de différentes tables | Pointe vers la clé primaire d'une autre table |
| **SQL** | Le langage pour parler à la base de données | Comment insérer, consulter, modifier et supprimer des données | SELECT, INSERT, UPDATE, DELETE |
| **Index** | La structure de données accélérant les requêtes | Comment trouver rapidement les données | Arbre B+, réduit les I/O disque |
| **Transaction** | Le mécanisme garantissant la sécurité des données | Comment prévenir les conflits de concurrence et la perte de données | ACID : Atomicité, Cohérence, Isolation, Durabilité |

::: info En conclusion
Les bases de données sont un sujet vaste et profond ; cet article n'est qu'une introduction. Si vous souhaitez approfondir, voici le parcours recommandé :

**Prochaines étapes** :
1. **Pratique** : Installer MySQL ou PostgreSQL, créer des tables, insérer des données, écrire des requêtes SQL
2. **Frameworks ORM** : Apprendre à utiliser les bases de données dans le code (ex : SQLAlchemy, Prisma, TypeORM)
3. **Optimisation des index** : Approfondir les index composés, les index de couverture, le pushdown d'index et autres sujets avancés
4. **Principes des transactions** : Comprendre le MVCC (Multi-Version Concurrency Control), les mécanismes de verrouillage et l'implémentation des niveaux d'isolation
5. **Bases de données distribuées** : Apprendre le sharding, la séparation lecture/écriture, la réplication maître-esclave et autres architectures

Rappelez-vous : **Théorie + Pratique = Maîtrise véritable**.
:::
