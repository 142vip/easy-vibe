# Introduction : Gouvernance et qualité des données

::: tip Préface
**Avez-vous déjà rencontré cette situation : les chiffres du rapport ne correspondent pas au business réel, les informations d'un même utilisateur diffèrent entre deux systèmes, ou les résultats d'analyse sont totalement peu fiables à cause de données sales ?** La gouvernance des données est précisément la méthode systématique pour résoudre ces problèmes. À l'ère de la « prise de décision basée sur les données », la qualité des données détermine directement la qualité des décisions — Garbage In, Garbage Out.
:::

**Que allez-vous apprendre dans cet article ?**

À la fin de ce chapitre, vous aurez acquis :

- **Les dimensions de la qualité des données** : Comprendre les six dimensions que sont la complétude, l'exactitude, la cohérence, etc.
- **Le système de gouvernance des données** : Connaître le cadre de gouvernance couvrant l'organisation, les processus et la technologie
- **Le lignage des données** : Maîtriser le suivi de bout en bout, de la source à la consommation
- **La gestion des métadonnées** : Comprendre l'importance des « données qui décrivent les données »
- **L'architecture en couches des données** : Maîtriser le modèle de couches ODS → DWD → DWS → ADS de l'entrepôt de données
- **Les compétences pratiques** : Savoir comment implémenter la gouvernance des données dans un projet

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Dimensions de la qualité des données | Complétude, exactitude, cohérence, actualité |
| **Chapitre 2** | Cadre de gouvernance des données | Organisation, processus, technologie, culture |
| **Chapitre 3** | Suivi du lignage des données | Analyse d'impact, investigation de problèmes, audit de conformité |
| **Chapitre 4** | Gestion des métadonnées | Métadonnées techniques, métadonnées métier, métadonnées opérationnelles |
| **Chapitre 5** | Architecture en couches des données | ODS, DWD, DWS, ADS |
| **Chapitre 6** | Outils et pratiques de gouvernance | Great Expectations, dbt, DataHub |

---

## 0. Vue d'ensemble : Pourquoi la gouvernance des données est-elle nécessaire

La gouvernance des données n'est pas un problème technique, mais un **problème de management**. Elle répond à la question centrale : **Qui est responsable des données ? Quels sont les standards des données ? Comment garantir que les données restent fiables dans le temps ?**

Imaginez une entreprise avec 100 tables de données, chacune maintenue par une équipe différente, sans convention de nommage unifiée, sans dictionnaire de données, sans contrôle qualité. Le résultat : le même indicateur « utilisateurs actifs mensuels » est calculé à 5 millions par le marketing et à 3 millions par l'équipe produit — parce que les définitions diffèrent.

::: tip Les quatre piliers de la gouvernance des données
1. **Organisation** : Clarifier les rôles et responsabilités des Data Owners et Data Stewards
2. **Processus** : Établir des processus standardisés pour l'intégration, la modification et la mise hors service des données
3. **Technologie** : Déployer des outils de monitoring de la qualité des données, de gestion des métadonnées et de suivi du lignage
4. **Culture** : Faire adhérer toute l'entreprise à l'idée que « les données sont un actif » et non un « sous-produit »
:::

---

## 1. Les six dimensions de la qualité des données

La qualité des données n'est pas un concept vague : elle se mesure selon six dimensions concrètes, chacune avec une définition précise et des méthodes de détection.

<DataQualityDemo />

| Dimension | Définition | Méthode de détection | Problèmes courants |
|------|------|---------|---------|
| Complétude | Les données sont-elles manquantes ? | Vérification du taux de valeurs nulles | Champs obligatoires vides, données associées manquantes |
| Exactitude | Les données sont-elles correctes ? | Validation par règles, vérification par échantillonnage | Montants négatifs, dates invalides |
| Cohérence | Les données multi-sources sont-elles cohérentes ? | Comparaison inter-systèmes | Nom d'utilisateur différent entre le CRM et le système de commandes |
| Actualité | Les données sont-elles mises à jour en temps opportun ? | Vérification de l'horodatage de mise à jour | Données de stock en retard, prix non synchronisés |
| Unicité | Existe-t-il des enregistrements en double ? | Vérification de dédoublonnage | Même utilisateur inscrit deux fois |
| Validité | Les données sont-elles conformes aux règles de format ? | Validation par regex/plage de valeurs | Format d'email erroné, âge négatif |

::: tip La règle 1-10-100 de la qualité des données
- **1 euro** : Validation à l'entrée des données, prévention des données sales
- **10 euros** : Nettoyage des données sales déjà présentes dans l'entrepôt de données
- **100 euros** : Pertes dues aux mauvaises décisions causées par des données sales

Plus tôt on détecte et corrige les problèmes de qualité des données, plus le coût est faible.
:::

---

## 2. Cadre de gouvernance des données : Gestion sur tout le cycle de vie

La gouvernance des données n'est pas un projet ponctuel, mais un processus continu couvrant tout le cycle de vie des données. De la création à la destruction, chaque phase nécessite des normes claires et des responsables identifiés.

<DataGovernanceFrameworkDemo />

| Phase | Production clé | Rôle principal |
|------|---------|---------|
| Définition des standards | Dictionnaire de données, conventions de nommage, standards de classification | Architecte de données |
| Collecte et intégration | Spécifications d'intégration, règles de validation, enregistrement du lignage | Ingénieur données |
| Stockage et gestion | Modèle en couches, matrice de permissions, politiques de cycle de vie | DBA / Ingénieur plateforme |
| Utilisation et consommation | Catalogue de données, règles de masquage, rapports de qualité | Analyste données / Métier |
| Archivage et destruction | Politique d'archivage, registre des suppressions, logs d'audit | Équipe sécurité et conformité |

## 2. Cadre de gouvernance des données

La gouvernance des données ne se résout pas en achetant un outil ; elle nécessite un cadre complet pour la soutenir. Le cadre de référence le plus utilisé dans l'industrie est DAMA-DMBOK (Data Management Body of Knowledge).

| Domaine de gouvernance | Contenu central | Production clé |
|---------|---------|---------|
| Architecture des données | Définir les modèles de données, les flux de données et les stratégies de stockage | Diagramme d'architecture de données, diagramme ER |
| Standards de données | Conventions de nommage unifiées, règles de codage, définitions d'indicateurs | Dictionnaire de données, référentiel d'indicateurs |
| Qualité des données | Établir des règles qualité, alertes de monitoring, processus de correction | Rapports de qualité, tableau de bord SLA |
| Sécurité des données | Classification, contrôle d'accès, masquage et chiffrement | Politique de sécurité, logs d'audit |
| Gestion des données de référence | Unifier les « enregistrements de référence » des entités clés (clients, produits, etc.) | Hub de données de référence |
| Cycle de vie des données | Gérer tout le processus, de la création à l'archivage et la destruction | Politiques de rétention, règles d'archivage |

::: tip Le modèle de maturité de la gouvernance des données
- **Niveau 1 - Initial** : Pas de standards unifiés, chaque équipe travaille en silo
- **Niveau 2 - Répétable** : Des documents de normes existent, mais l'application est incohérente
- **Niveau 3 - Défini** : Des processus et outils de gouvernance unifiés, la majorité des équipes les respectent
- **Niveau 4 - Géré** : Des indicateurs qualité quantitatifs et un monitoring automatisé existent
- **Niveau 5 - Optimisé** : Amélioration continue, la gouvernance des données est intégrée au processus de développement quotidien
:::

---

## 3. Lignage des données : D'où viennent-elles, où vont-elles

Le lignage des données (Data Lineage) enregistre le chemin complet de transformation des données, de leur source jusqu'à leur consommation finale. C'est comme l'« arbre généalogique » des données, qui vous permet de retracer l'origine et les transformations de chaque donnée.

<DataLineageDemo />

Le lignage des données a trois cas d'usage centraux en pratique :

| Scénario | Problème | Comment le lignage aide |
|------|------|------------|
| Analyse d'impact | Si je modifie un champ de la table utilisateurs, quels rapports en aval seront affectés ? | Suivre toutes les dépendances vers l'aval |
| Recherche de cause racine | Le rapport GMV d'aujourd'hui présente des données anormales — à quelle étape est le problème ? | Remonter chaque étape du lignage |
| Audit de conformité | Par quels systèmes est passé le numéro de téléphone de l'utilisateur ? Tous sont-ils masqués ? | Suivre le parcours complet des champs sensibles |

::: tip Deux méthodes de collecte du lignage
- **Collecte active** : Analyser les requêtes SQL et les configurations ETL pour extraire automatiquement les relations de lignage au niveau table/champ
- **Collecte passive** : Intercepter les plans d'exécution des moteurs de requête (ex : Hive, Spark) via des Hooks pour enregistrer le lignage en temps réel

Les outils mainstream comme Apache Atlas, DataHub et OpenLineage supportent tous la collecte automatisée du lignage.
:::

---

## 4. Gestion des métadonnées : « Les données qui décrivent les données »

Les métadonnées (Metadata) sont des données sur les données. Si les données sont le contenu d'un livre, les métadonnées en sont la table des matières, l'auteur, la date de publication et le numéro ISBN. Sans métadonnées, les données ne sont qu'un ensemble incompréhensible de chiffres et de chaînes de caractères.

| Type de métadonnées | Description | Exemple |
|-----------|------|------|
| Métadonnées techniques | Informations sur le stockage physique des données | Nom de table, type de champ, partitionnement, emplacement de stockage |
| Métadonnées métier | La signification métier des données | Nom français du champ, définition métier, formule de calcul |
| Métadonnées opérationnelles | L'état de fonctionnement des données | Durée d'exécution ETL, volume de données, fréquence de mise à jour |

::: tip L'importance du dictionnaire de données
Le dictionnaire de données est la production la plus fondamentale de la gestion des métadonnées. Un bon dictionnaire de données doit contenir :
- **Nom du champ** : Nom en anglais et en français
- **Type de données** : VARCHAR(50), INT, DATETIME, etc.
- **Définition métier** : Que représente ce champ ? Comment est-il calculé ?
- **Plage de valeurs** : Quelles sont les valeurs valides ? Les valeurs nulles sont-elles autorisées ?
- **Responsable** : Qui maintient ce champ ? Qui contacter en cas de problème ?

Sans dictionnaire de données, un nouvel arrivant peut mettre une semaine à comprendre le sens d'une table ; avec un dictionnaire de données, 10 minutes suffisent.
:::

---

## 5. Architecture en couches des données : ODS → DWD → DWS → ADS

Un entrepôt de données n'empile pas toutes les données en un tas, il les stocke par couches selon leur **degré de transformation**. Chaque couche a des responsabilités claires ; les couches supérieures dépendent des inférieures et transforment progressivement les données brutes en données exploitables par le métier.

| Couche | Nom complet | Responsabilité | Caractéristiques des données |
|------|------|------|---------|
| ODS | Operational Data Store | Synchronisation à l'identique de la base de données métier | Les plus brutes, non transformées |
| DWD | Data Warehouse Detail | Nettoyage, standardisation, dédoublonnage | Enregistrements détaillés propres |
| DWS | Data Warehouse Summary | Agrégation thématique (jour/semaine/mois) | Indicateurs agrégés pré-calculés |
| ADS | Application Data Service | Orienté rapports/API spécifiques | Données résultats directement utilisables |

::: tip Pourquoi adopter une architecture en couches ?
- **Réutilisabilité** : La couche DWD est nettoyée une fois, toutes les couches supérieures en profitent — évite le nettoyage redondant
- **Découplage** : Les modifications de structure des tables métier n'affectent que la couche ODS, sans impact sur les rapports
- **Performance** : La couche DWS est pré-agrégée ; les requêtes de rapports lisent directement, sans calcul en temps réel
- **Traçabilité** : Chaque couche est conservée ; en cas de problème, on peut investiguer couche par couche
:::

---

## 6. Outils et pratiques de gouvernance

| Outil | Positionnement | Capacités clés | Scénarios d'utilisation |
|------|------|---------|---------|
| Great Expectations | Qualité des données | Règles de validation déclaratives, génération automatique de rapports de qualité | Pipelines de données Python |
| dbt | Transformation des données | Développement basé sur des modèles SQL, tests intégrés et génération de documentation | Modélisation DWH |
| DataHub | Gestion des métadonnées | Catalogue de données, suivi du lignage, data discovery | Gouvernance des données d'entreprise |
| Apache Atlas | Gestion des métadonnées | Suivi du lignage dans l'écosystème Hadoop | Plateformes Big Data |
| OpenMetadata | Gestion des métadonnées | Catalogue de données open source, support de multiples sources de données | Petites et moyennes équipes |
| Amundsen | Découverte de données | Plateforme de découverte de données par recherche | Démocratisation des données |

::: tips Parcours de gouvernance à partir de zéro
Si votre équipe n'a pas encore de gouvernance des données, nous recommandons de procéder dans cet ordre :
1. **D'abord créer un dictionnaire de données** : Documenter le sens des tables et champs existants (même dans Excel)
2. **Ajouter des contrôles qualité** : Intégrer des vérifications de base (valeurs nulles, plages) dans les pipelines de données clés
3. **Unifier les définitions d'indicateurs** : Harmoniser les formules de calcul des indicateurs clés comme « DAU », « MAU », « GMV »
4. **Introduire des outils** : Quand le coût de la gestion manuelle devient trop élevé, adopter des outils comme DataHub ou dbt
5. **Établir des processus** : Les modifications de données nécessitent une revue ; les problèmes de qualité ont des SLA et des alertes
:::

---

## Résumé

La gouvernance des données est l'ingénierie systématique qui fait passer les données de « utilisables » à « faciles à utiliser, fiables et traçables ». Ce n'est pas un projet ponctuel, mais un processus d'exploitation continu.

Les points clés de ce chapitre en résumé :

1. **Six dimensions de qualité** : Complétude, exactitude, cohérence, actualité, unicité, validité
2. **Quatre piliers de la gouvernance** : Organisation, processus, technologie, culture — aucun ne doit manquer
3. **Lignage des données** : Suivre l'origine et les flux des données pour soutenir l'analyse d'impact et la recherche de causes
4. **Gestion des métadonnées** : Le dictionnaire de données est la production de gouvernance la plus fondamentale et la plus importante
5. **Architecture en couches** : ODS → DWD → DWS → ADS, la valeur des données est raffinée couche par couche
6. **Déploiement progressif** : Commencer par le dictionnaire de données, puis introduire progressivement outils et processus

## Pour aller plus loin

- [DAMA-DMBOK](https://www.dama.org/cpages/body-of-knowledge) - Data Management Body of Knowledge, la « bible » de la gouvernance des données
- [DataHub](https://datahubproject.io/) - Plateforme open source de gestion des métadonnées par LinkedIn
- [Great Expectations](https://greatexpectations.io/) - Framework Python pour la qualité des données
- [dbt](https://www.getdbt.com/) - Outil de transformation de données avec tests et documentation intégrés
- [Apache Atlas](https://atlas.apache.org/) - Framework de gouvernance des métadonnées pour l'écosystème Hadoop
- [The Data Warehouse Toolkit](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/) - Le classique de Kimball sur la modélisation DWH
