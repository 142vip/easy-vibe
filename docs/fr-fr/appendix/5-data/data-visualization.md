# Principes : Visualisation de données

::: tip Avant-propos
**Un bon graphique vaut mieux que mille lignes de données.** La visualisation de données consiste à transformer des chiffres abstraits en expressions visuelles intuitives, permettant de comprendre l'histoire derrière les données en quelques secondes. Des graphiques Excel aux écrans de supervision Grafana, la visualisation est omniprésente.
:::

**Que allez-vous apprendre dans cet article ?**

À l'issue de ce chapitre, vous serez capable de :

- **Choisir les bons graphiques** : sélectionner le type de graphique le plus adapté à l'objectif des données
- **Principes de visualisation** : maîtriser les principes fondamentaux de la conception de visualisations de données
- **Conception de tableaux de bord** : comprendre les modèles de disposition des différents types de tableaux de bord
- **Écosystème d'outils** : connaître le positionnement et la sélection des principaux outils de visualisation
- **Pièges courants** : éviter les graphiques trompeurs et les erreurs de visualisation fréquentes

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Choix du type de graphique | Comparaison, tendance, proportion, distribution, relation |
| **Chapitre 2** | Principes de conception visuelle | Ratio données-encre, cohérence, lisibilité |
| **Chapitre 3** | Disposition des tableaux de bord | Vue d'ensemble, comparaison, exploration, temps réel |
| **Chapitre 4** | Sélection des outils | ECharts, D3, Grafana, Metabase |
| **Chapitre 5** | Pièges courants | Axe tronqué, graphique en camembert 3D, mauvais usage des couleurs |

---

## 0. Vue d'ensemble : Pourquoi la visualisation

Le cerveau humain traite l'information visuelle beaucoup plus rapidement que le texte. Un graphique en courbes vous permet de voir rapidement que « les ventes du mois dernier ont baissé », alors que la même information présentée dans un tableau nécessiterait une comparaison ligne par ligne pour tirer cette conclusion.

La valeur essentielle de la visualisation :

- **Détecter des modèles** : tendances, cycles, valeurs aberrantes sont immédiatement visibles dans un graphique
- **Aider à la décision** : permettre même aux non-techniciens de comprendre les données et de participer aux décisions
- **Efficacité de communication** : un graphique vaut mille mots, réduisant les ambiguïtés dans l'interprétation des données

::: tip Visualisation ≠ Beau
L'objectif de la visualisation est de **transmettre l'information**, pas de faire de l'esbroufe. Un diagramme en barres sobre mais précis est bien plus précieux qu'un graphique 3D voyant mais difficile à comprendre.
:::

---

## 1. Choix du type de graphique : le bon graphique pour raconter la bonne histoire

La première étape pour choisir un graphique n'est pas « quel graphime j'aime », mais « quelle information je veux transmettre ». Différents objectifs de données correspondent à différents types de graphiques optimaux.

<ChartTypeSelectorDemo />

### Tableau de référence pour le choix des graphiques

| Objectif des données | Graphique recommandé | Déconseillé | Raison |
|---------|---------|--------|------|
| Comparer des valeurs | Diagramme en barres, diagramme en barres horizontales | Camembert | L'œil humain est plus sensible aux différences de longueur qu'aux différences d'angle |
| Montrer une tendance | Graphique en courbes, graphique en aires | Diagramme en barres | La continuité de la ligne suggère la continuité temporelle |
| Montrer une proportion | Camembert (≤5 catégories), barres empilées | Camembert 3D | La perspective 3D déforme les proportions de surface |
| Montrer une distribution | Histogramme, boîte à moustaches | Graphique en courbes | La distribution nécessite de voir la fréquence, pas la tendance |
| Montrer une relation | Nuage de points, graphique à bulles | Diagramme en barres | La relation entre deux variables continues nécessite un espace bidimensionnel |

::: tip Une règle de décision simple
- **Une variable** → Histogramme (distribution) ou carte de chiffres (KPI)
- **Deux variables** → Graphique en courbes (temps vs valeur) ou nuage de points (valeur vs valeur)
- **Plusieurs catégories** → Diagramme en barres (comparaison) ou camembert (proportion, ≤5 catégories)
- **Multidimensionnel** → Radar ou coordonnées parallèles
:::

---

## 2. Principes de conception visuelle : laisser les données communication

Une bonne visualisation n'est pas « belle », mais « compréhensible ». Plusieurs principes classiques formulés par Edward Tufte dans *The Visual Display of Quantitative Information* restent une référence importante en conception de visualisation.

| Principe | Description | Contre-exemple |
|------|------|---------|
| Ratio données-encre | La proportion d'« encre » utilisée pour afficher les données dans le graphique doit être aussi élevée que possible | Trop de lignes de grille, éléments décoratifs |
| Minimiser les éléments non liés aux données | Supprimer les éléments visuels qui ne transmettent pas d'information | Effets 3D, ombres, arrière-plans en dégradé |
| Échelle cohérente | Les axes partent de zéro, les graduations sont uniformes ; si l'axe est tronqué, il faut l'indiquer explicitement | L'axe Y commence à 95 sans indication |
| Usage raisonnable des couleurs | Utiliser les couleurs pour coder l'information, pas pour décorer | Arc-en-ciel pour des données ordinales |
| Annotations claires | Titre, étiquettes d'axes, légende, unités — aucun ne doit manquer | Pas d'unité, pas de plage temporelle |

### 2.1 Le ratio données-encre (Data-Ink Ratio)

> La proportion d'« encre » utilisée pour exprimer les données dans un graphique par rapport à l'« encre » totale doit être aussi élevée que possible.

En termes simples : **supprimez tout élément qui ne transmet pas d'information**.

| À supprimer | À conserver |
|-----------|-----------|
| Effets 3D, ombres, dégradés | Points de données, étiquettes d'axes |
| Lignes de grille superflues | Lignes de référence clés (ex. valeur cible) |
| Icônes décoratives | Légende (lorsqu'il y a plusieurs séries) |
| Couleurs d'arrière-plan voyantes | Titre et unités clairs |

### 2.2 Principe de cohérence

- **Couleurs cohérentes** : une même dimension utilise la même couleur dans tous les graphiques, par exemple « revenus » toujours en bleu
- **Échelles cohérentes** : les axes doivent si possible commencer à 0, sauf raison valable et annotation explicite
- **Temps cohérent** : les intervalles de l'axe temporel doivent être uniformes, ne pas représenter des points temporels inégaux comme s'ils étaient équidistants

### 2.3 Principe de lisibilité

- **Le titre doit exprimer une conclusion** : pas « Ventes mensuelles », mais « Les ventes baissent depuis 3 mois consécutifs »
- **Annoter les points clés** : ajouter des annotations aux valeurs aberrantes et aux points d'inflexion pour guider l'attention du lecteur
- **Maîtriser la densité d'information** : un graphique doit transmettre 1 à 2 messages essentiels, ne pas tout surcharger

::: tip Trois règles pour l'utilisation des couleurs
1. **Même indicateur, même couleur** : les revenus sont toujours en bleu dans tous les graphiques, ne pas alterner entre bleu et vert
2. **Données ordinales en dégradé** : température du froid au chaud en dégradé bleu → rouge, ne pas utiliser des couleurs discrètes
3. **Penser à l'accessibilité daltonienne** : environ 8 % des hommes ont un daltonisme rouge-vert, éviter de distinguer les informations clés uniquement par rouge et vert
:::

---

## 3. Disposition des tableaux de bord : différents scénarios, différents modèles

Un tableau de bord (Dashboard) est une combinaison organique de plusieurs graphiques. Un bon tableau de bord ne se contente pas d'empiler des graphiques, il choisit un modèle de disposition adapté au contexte d'utilisation.

<DashboardLayoutDemo />

### Quatre modèles de disposition courants

| Modèle de disposition | Structure essentielle | Scénario d'utilisation | Points de conception |
|---------|---------|---------|---------|
| Vue d'ensemble globale | Cartes KPI + graphique de tendance + tableau détaillé | Rapports quotidiens pour la direction, tableau de bord des opérations | Indicateurs clés tout en haut, visibles en un coup d'œil |
| Analyse comparative | Disposition symétrique gauche-droite | Tests A/B, analyse année sur année | Garder les dimensions de comparaison cohérentes, mettre en évidence les différences |
| Analyse exploratoire | Déploiement progressif du résumé au détail | Analyse des ventes, analyse du comportement utilisateur | Supporter l'interaction au clic, exploration par niveaux |
| Supervision en temps réel | Grands chiffres + courbe temps réel + état des alertes | Écran du 11 novembre, supervision de serveurs | Rafraîchissement automatique, fond sombre, adapté à la projection |

### 5 principes de conception de tableaux de bord

1. **D'abord demander « qui regarde »** : le PDG voit les indicateurs stratégiques, les opérations voient les indicateurs de processus, les ingénieurs voient les indicateurs techniques
2. **Règle des 5 secondes** : l'utilisateur doit comprendre l'information essentielle du tableau de bord en 5 secondes
3. **Hiérarchie de l'information** : le plus important en haut à gauche, le secondaire en bas
4. **Réduire le défilement** : afficher le contenu essentiel sur un seul écran, éviter que l'utilisateur doive faire défiler pour voir les données clés
5. **Espace blanc** : ne pas remplir chaque centimètre, un espacement adéquat rend la lecture plus confortable

::: tip Tableau de bord vs Rapport
- **Tableau de bord** : temps réel/quasi temps réel, interactif, orienté supervision et décision rapide
- **Rapport** : généré périodiquement (journalier/hebdomadaire/mensuel), statique, orienté analyse détaillée et archivage

Les deux ne se substituent pas, ils se complètent. Le tableau de bord détecte les problèmes, le rapport les analyse en profondeur.
:::

---

## 4. Sélection des outils : des bibliothèques de code aux plateformes BI

Les outils de visualisation peuvent être classés en trois niveaux : bibliothèques de graphiques au niveau du code, bibliothèques de graphiques pour l'analyse de données, plateformes BI. Le choix dépend de la complexité des besoins, des exigences d'interactivité et des compétences techniques de l'équipe.

### 4.1 Bibliothèques de graphiques au niveau du code

| Outil | Langage/Plateforme | Caractéristiques | Scénario d'utilisation |
|------|----------|------|---------|
| ECharts | JavaScript | Prêt à l'emploi, types de graphiques riches, documentation en chinois complète | Graphiques intégrés dans les systèmes métier |
| D3.js | JavaScript | Bas niveau flexible, personnalisable pour tout effet de visualisation | Visualisation de données hautement personnalisée |
| Chart.js | JavaScript | Léger et simple, prise en main rapide | Besoins simples en graphiques |
| Matplotlib | Python | Bibliothèque standard de calcul scientifique, graphiques statiques | Analyse de données, graphiques pour publications |
| Plotly | Python/JS | Graphiques interactifs, support 3D | Exploration de données, Jupyter Notebook |

### 4.2 Plateformes BI (sans code/low-code)

| Outil | Positionnement | Avantage principal | Équipe cible |
|------|------|---------|---------|
| Grafana | Visualisation de supervision | Bon support des séries temporelles, intégration d'alertes | Équipes Ops/SRE |
| Metabase | BI léger | Open source et gratuit, graphiques à partir de SQL | Création rapide pour PME |
| Apache Superset | BI entreprise | Open source, support de sources Big Data | Entreprises avec une équipe data |
| Tableau | BI commercial | Opération par glisser-déposer, excellents résultats visuels | Analystes métier |
| Power BI | BI commercial | Bonne intégration avec l'écosystème Microsoft | Entreprises utilisant la stack Microsoft |

::: tip Conseils de sélection
- **Développeurs intégrant des graphiques dans un produit** → ECharts (bon écosystème chinois) ou Chart.js (scénarios simples)
- **Analystes de données en exploration** → Plotly + Jupyter ou Metabase
- **Écran de supervision Ops** → Grafana (standard de fait)
- **Équipes métier en auto-analyse** → Metabase (open source) ou Tableau (commercial)
- **Besoin de personnalisation avancée** → D3.js (courbe d'apprentissage raide, mais la plus malléable)
:::

---

## 5. Pièges courants : ces graphiques vous mentent

La visualisation de données est un outil à double tranchant : bien utilisée, elle révèle la vérité ; mal utilisée, elle crée des illusions. Voici les pièges de visualisation les plus courants que tout professionnel des données devrait savoir identifier.

### 5.1 Axe tronqué

Changer le point de départ de l'axe Y de 0 à un nombre élevé rend les petites différences ressemblant à des variations énormes.

| Scénario | Différence réelle | Perception visuelle |
|------|---------|---------|
| Axe Y à partir de 0 | Produit A : 98, Produit B : 95 | Différence minime |
| Axe Y à partir de 90 | Mêmes données | A semble plusieurs fois supérieur à B |

**Quand est-il acceptable de tronquer ?** Lorsque la valeur absolue des données est grande mais les variations faibles (ex. cours de bourse passant de 100 à 105), la troncation est raisonnable, mais elle doit être explicitement annotée.

### 5.2 Le piège de la perspective des camemberts 3D

La perspective 3D rend les secteurs proches de l'observateur plus grands. Un secteur de 25 % peut sembler représenter 35 % en vue 3D.

**Solution** : ne jamais utiliser de camembert 3D. Utilisez un camembert classique ou un graphique en anneau, ou simplement un diagramme en barres.

### 5.3 Mauvais usage des couleurs

| Mauvaise pratique | Bonne pratique |
|---------|---------|
| Utiliser rouge et vert pour les données | Utiliser des palettes daltoniennes comme bleu-orange |
| Couleur différente pour chaque catégorie | Même série avec des nuances d'une même couleur |
| Coder des données continues en couleur sans légende | Toujours fournir une légende des couleurs et des annotations de valeurs |
| Contraste insuffisant entre fond et couleurs de données | Assurer un contraste de niveau WCAG AA |

### 5.4 Autres erreurs courantes

| Piège | Problème | Correction |
|------|------|------|
| Double axe Y | Deux indicateurs sans relation partagent l'axe X, suggérant une causalité | Séparer en deux graphiques, ou indiquer clairement l'absence de causalité |
| Surface trompeuse | Utiliser le rayon du cercle et non la surface pour représenter une valeur | Quand la valeur double, la surface doit doubler, pas le rayon |
| Axe temporel non uniforme | Janvier, mars, décembre sont espacés de manière identique | Disposer selon les proportions temporelles réelles |
| Trop de catégories | Camembert avec 15 secteurs | Au-delà de 5 catégories, utiliser un diagramme en barres ou regrouper dans « Autres » |

::: tip Éthique de la visualisation
L'objectif de la visualisation est d'**aider à comprendre**, pas de **manipuler la perception**. À chaque fois que vous créez un graphique, demandez-vous :

- Si j'étais le lecteur, ce graphique me ferait-il tirer une conclusion erronée ?
- Suis-je en train de cacher des données défavorables ?
- Les axes, les proportions et les couleurs représentent-ils les données de manière équitable ?
:::

---

## Résumé

La visualisation de données est le « dernier kilomètre » de la transmission de la valeur des données. La meilleure des analyses, si elle n'est pas correctement comprise, équivaut à aucune analyse.

Retour sur les points clés de ce chapitre :

1. **Choisir le bon graphique** : sélectionner le type de graphique selon l'objectif des données (comparaison, tendance, proportion, distribution, relation)
2. **Principes de conception** : ratio données-encre élevé, cohérence et lisibilité sont les trois principes fondamentaux
3. **Disposition des tableaux de bord** : les quatre modèles — vue d'ensemble, comparaison, exploration, temps réel — couvrent la plupart des scénarios
4. **Sélection des outils** : d'ECharts à Grafana, choisir selon les capacités de l'équipe et la complexité des besoins
5. **Éviter les pièges** : axe tronqué, camembert 3D, mauvais usage des couleurs sont les moyens trompeurs les plus courants

## Lectures complémentaires

- [The Visual Display of Quantitative Information](https://www.edwardtufte.com/tufte/books_vdqi) - Le classique de la visualisation par Edward Tufte
- [Documentation officielle ECharts](https://echarts.apache.org/zh/index.html) - La bibliothèque de graphiques en chinois la plus populaire
- [D3.js](https://d3js.org/) - Bibliothèque de visualisation bas niveau puissante
- [Grafana](https://grafana.com/) - Standard de fait pour la visualisation de supervision
- [From Data to Viz](https://www.data-to-viz.com/) - Arbre de décision pour le choix des types de graphiques
- [ColorBrewer](https://colorbrewer2.org/) - Outil de palettes de couleurs adaptées au daltonisme
