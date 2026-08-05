# Principes : Méthodologie d'analyse de données

::: tip 🎯 Question centrale
**Comment extraire des données éparses la « certitude » capable de guider le business ?**
Dans les produits internet, chaque seconde génère des masses d'enregistrements de comportements utilisateurs. Se contenter de regarder les totaux (comme le nombre total de visites) masque souvent la vérité. Ce chapitre vous guidera, des indicateurs statistiques de base aux modèles d'analyse business avancés, pour maîtriser la logique fondamentale de l'analyse de données.
:::

---

## 0. Vue d'ensemble : L'essence de l'analyse de données

> Beaucoup pensent que jeter un coup d'œil à un rapport, c'est faire de l'analyse de données. Si vous ne comprenez pas la logique de transformation entre « données, information, insight », vous resterez prisonnier des détails numériques. Ce chapitre vise à vous donner une vision globale et à comprendre que le but ultime de l'analyse de données n'est pas de « rapporter », mais de « décider ».

L'analyse de données n'est pas une simple « agrégation de rapports », mais un processus de **réduction dimensionnelle de l'information** et d'**extraction de caractéristiques**.

- **Données brutes (Raw Data)** : Ce sont des enregistrements épars et désordonnés (ex : l'utilisateur A a cliqué sur le bouton B à 10h01).
- **Information (Information)** : Ce sont des données transformées (ex : aujourd'hui, 30 % des utilisateurs ont cliqué sur le bouton B).
- **Insight (Insight)** : C'est la découverte de schémas cachés dans les données (ex : le taux de clic sur le bouton B est bien plus élevé sur mobile que sur PC, ce qui indique que les utilisateurs mobile dépendent davantage de cette fonctionnalité).

Notre objectif est de construire un cadre d'analyse systématique qui pilote la croissance du business par le cycle « observer -> décomposer -> localiser -> décider ».

---

## 1. Statistiques descriptives : Comment résumer l'ensemble en une phrase

> Face à 100 000 lignes de données, impossible de les examiner une par une. Vous avez besoin d'une capacité de « compression d'information » pour saisir l'essentiel avec très peu d'indicateurs. Si vous ne connaissez pas les pièges statistiques de la moyenne et de la médiane, vous serez induit en erreur par les valeurs extrêmes lors de l'analyse de performances (comme la dépense moyenne par utilisateur) et aboutirez à des conclusions absurdes.

Lorsqu'un jeu de données compte des dizaines de milliers d'enregistrements, nous devons décrire son apparence globale avec très peu d'« indicateurs représentatifs ».

<DescriptiveStatsDemo />

### 1.1 La moyenne (Mean) : Le repère du niveau global
La moyenne (arithmétique) est l'indicateur le plus intuitif.
- **Logique de calcul** : Somme de toutes les valeurs divisée par le nombre total de données.
- **Limite** : Elle est extrêmement sensible aux **valeurs aberrantes extrêmes (Outliers)**.
- **Exemple** : Si 9 employés gagnent 5k par mois et le patron 100k, le salaire moyen s'élève à 14,5k. La moyenne ne reflète pas fidèlement le niveau de revenu de la majorité des employés.

### 1.2 La médiane (Median) et le mode (Mode)
- **Médiane** : On trie les données du plus petit au plus grand et on prend la valeur du milieu. Elle résiste efficacement aux valeurs aberrantes et reflète fidèlement le niveau typique de la « classe moyenne ».
- **Mode** : La valeur la plus fréquente dans le jeu de données. Pour analyser « le produit préféré des utilisateurs » ou « le code d'erreur le plus fréquent », le mode indique le plus directement la tendance du groupe.

### 1.3 L'écart-type (Standard Deviation) : La « largeur » de la distribution
Il décrit l'amplitude de dispersion des points de données autour de la moyenne.
- **Faible écart-type** : Les données sont très concentrées, la représentativité de la moyenne est forte (ex : les dimensions des pièces sur une ligne de production).
- **Fort écart-type** : La distribution des données est dispersée, les différences individuelles sont très importantes.
- **Signification** : Dans le monitoring de performances, un écart-type élevé signifie souvent que la stabilité du système est insuffisante, avec de nombreuses « requêtes à queue longue » à temps de réponse très lent.

---

## 2. Agrégation de données : Explorer les micro-patternes de groupe

> « Le taux de conversion moyen de tous les utilisateurs est de 5 % » est souvent une vérité dénuée de sens. Vous devez apprendre à « découper » les données pour découvrir les énormes différences entre les utilisateurs de différentes régions, canaux et appareils. L'analyse par agrégation vous permet de percer les moyennes globales et d'atteindre les véritables points de douleur cachés du business.

Le comportement individuel est souvent soumis au hasard, mais le comportement de groupe suit des régularités statistiques. Le cœur de l'**agrégation de données (Aggregation)** est de « découper » les populations selon des dimensions spécifiques.

<DataAggregationDemo />

### 2.1 Logique fondamentale de l'agrégation : Diviser-Calculer-Combiner
1. **Diviser (Split)** : Grouper selon un attribut (ex : ville, canal d'inscription, nouveaux/anciens utilisateurs).
2. **Calculer (Apply)** : Exécuter des fonctions d'agrégation dans chaque groupe, comme `COUNT()` pour compter, `SUM()` pour sommer, `AVG()` pour calculer la moyenne.
3. **Combiner (Combine)** : Comparer les résultats des différents groupes et identifier les différences.

### 2.2 Pourquoi faut-il obligatoirement faire un GROUP BY
Les données agrégées masquent souvent les problèmes. Par exemple, le taux de conversion global monte, mais en décomposant on s'aperçoit que c'est la région « Paris » qui a explosé et tire la moyenne vers le haut, tandis que toutes les autres régions baissent. L'analyse par agrégation permet de localiser précisément la meilleure ou la pire branche dans la « masse globale ».

---

## 3. Modèle d'entonnoir : Localiser les « points de saignement » de la chaîne de valeur

> Vous avez investi massivement pour attirer des utilisateurs, et au final très peu achètent — l'argent était-il dépensé en vain ? Le modèle d'entonnoir (Funnel) peut vous dire à quelle étape les utilisateurs trébuchent. En maîtrisant cette section, vous transformerez « l'optimisation métier » d'une devinette aveugle en un développement ciblé, en allouant les ressources là où le taux de conversion est le plus élevé.

Le parcours de l'utilisateur, de l'entrée jusqu'à l'objectif final (ex : le paiement), est un processus de filtrage par étapes. Le modèle d'entonnoir ne sert pas seulement à voir le taux de conversion final, mais surtout à comprendre **où l'on perd des utilisateurs**.

<FunnelAnalysisDemo />

### 3.1 Indicateurs clés de conversion
- **Taux de conversion global** : Nombre de personnes ayant atteint l'objectif final / Nombre de personnes entrées au point de départ.
- **Taux de conversion par étape** : Personnes à l'étape actuelle / Personnes à l'étape précédente (reflète l'efficacité de passage de cette étape).
- **Taux d'abandon** : 1 - Taux de conversion par étape.

### 3.2 Approche d'analyse approfondie
Si le taux d'abandon à une étape est anormalement élevé, cela indique une **friction d'expérience** à cet endroit. Par exemple :
- Abandon important sur la page d'inscription : Le formulaire est trop complexe ou le code de vérification n'arrive pas.
- Abandon au choix du mode de paiement : Trop peu de moyens de paiement ou redirection trop lente.
Investir les efforts d'optimisation à l'endroit où l'entonnoir est le plus étroit apporte généralement le meilleur retour.

---

## 4. Analyse de rétention : Le bilan de santé « hardcore » du produit

> La rétention est le premier critère d'évaluation de la valeur d'un produit. Si l'acquisition consiste à remplir un seau d'eau, la rétention montre si le seau fuit. Si vous ne savez regarder que le trafic total et non analyser la rétention (fidélisation), vous ne pouvez pas déterminer si le produit grandit sainement ou s'il s'agit d'un jeu de chiffres voué à l'effondrement.

La croissance des utilisateurs ne signifie pas le succès ; savoir les fidéliser est la valeur fondamentale. Le taux de rétention (Retention) mesure la proportion d'utilisateurs qui reviennent après une période donnée.

<RetentionAnalysisDemo />

### 4.1 Fenêtres temporelles clés
- **Rétention J+1 (Day 1)** : Évalue la « première impression ». L'utilisateur a-t-il perçu la valeur centrale dans les 24 heures suivant sa première visite ?
- **Rétention J+7 (Day 7)** : Évalue la « formation d'habitude ». L'utilisateur a-t-il développé un usage régulier pendant la première semaine ?
- **Rétention J+30 (Day 30)** : Évalue la « fidélité à long terme ». Elle détermine le plafond de survie du produit.

### 4.2 Forme de la courbe de rétention : Déterminer le PMF
- **Chute continue vers zéro** : Le produit ne résout pas le problème des utilisateurs ou la mauvaise cible a été acquise.
- **Stabilisation (longue traîne)** : Le produit a atteint le **PMF (Product-Market Fit)**, possède une base d'utilisateurs fidèles et engagés, et a les fondations pour une mise à l'échelle.

---

## 5. Conclusion : Construire une intuition scientifique des données

Un excellent analyste doit faire preuve d'esprit critique et ne pas se laisser induire en erreur par les apparences :
1. **Regarder la distribution, pas seulement la moyenne** : Réfléchir à la variance et aux valeurs aberrantes derrière les données.
2. **Regarder les sous-groupes, pas seulement les totaux** : Reconstituer la réalité par des agrégations multidimensionnelles (Group By).
3. **Regarder les tendances, pas seulement les instantanés** : Observer la santé à long terme du produit via les courbes de rétention.
4. **Chercher les ruptures plutôt qu'optimiser à l'aveugle** : Localiser les véritables goulots d'étranglement métier via l'entonnoir.

L'objectif de l'analyse de données n'est pas de produire de beaux rapports, mais de minimiser « l'incertitude » pour prendre des décisions éclairées fondées sur les faits.
test
