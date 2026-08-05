# Principes : Tests A/B et décision par les données

::: tip 🎯 Question centrale
**Comment vérifier scientifiquement l'effet d'un changement produit ?**
Vous avez peut-être vécu cette situation : l'équipe a passé un mois à développer une nouvelle fonctionnalité, et après le lancement, les données explosent ! Tout le monde jubile, mais trois semaines plus tard, les données retombent mystérieusement à leur niveau initial. Était-ce parce que la nouvelle fonctionnalité était vraiment bonne, ou parce que cela tombait pendant une période de forte affluence ? Les tests A/B résolvent précisément ce problème : éliminer le bruit externe et laisser les données révéler la vérité.
:::

---

## 0. Vue d'ensemble : L'arme scientifique contre les décisions « au doigt mouillé »

Avant d'aborder les techniques spécifiques, réfléchissons à la façon dont les humains prennent des décisions.

Face à deux couleurs de boutons : un bleu sobre et un rouge voyant. Généralement, le décideur s'appuie sur son expérience, son intuition, voire la préférence de la direction (dans le jargon du secteur, on appelle cela le **HiPPO** — Highest Paid Person's Opinion, l'opinion de la personne la mieux payée).

Mais les retours réels des utilisateurs dépassent souvent largement notre imagination. Le rouge peut être trop agressif et faire chuter le taux de conversion, ou le bleu peut ne pas être assez visible... Comment pouvons-nous être certains qu'un changement donné est réellement meilleur ?

La réponse vient d'une règle scientifique classique, la même que celle utilisée par la médecine moderne pour valider de nouveaux médicaments : l'**expérience contrôlée**.

::: tip 💡 L'essence du test A/B
**Test A/B = Comparaison + Observation**
C'est comme l'« essai en double aveugle » de la recherche médicale :
- **Groupe contrôle (groupe A)** : prend un placebo ressemblant à un médicament (voit l'ancienne version de la page).
- **Groupe expérimental (groupe B)** : prend le nouveau médicament en développement (voit la nouvelle version de la page).
Ce n'est que lorsque le taux de guérison (taux de conversion) du groupe expérimental est de manière extrêmement stable et significativement supérieur à celui du groupe contrôle que nous pouvons déclarer que le nouveau médicament (le changement) est réellement efficace.
:::

---

## 1. Répartition du trafic : Créer des univers parallèles

La première règle d'or du test A/B est : **simultanément, au hasard, de manière isolée**.

Vous ne pouvez absolument pas dire : « Pendant la première quinzaine, tous les utilisateurs voient le bouton bleu, et pendant la seconde quinzaine, tous voient le bouton rouge. » Car la période temporelle introduit d'innombrables variables — vous ne pouvez pas savoir si la hausse du taux de conversion pendant la seconde quinzaine est due au bouton rouge ou au fait que c'était la période des soldes.

Ce que nous devons faire, c'est créer des « univers parallèles » au même instant. Pour chaque utilisateur qui entre sur le site, le système lance immédiatement une pièce numérique en arrière-plan et décide s'il est affecté à l'univers A ou à l'univers B.

Vous pouvez observer intuitivement comment le système répartit le trafic grâce à la démo ci-dessous :

<ABTestingDemo tab="traffic" />

### 1.1 Pourquoi la répartition aléatoire est-elle si importante

Ce n'est qu'avec un « aléatoire » à 100 % que l'on peut lisser au maximum les différences apportées par toutes les autres caractéristiques. Avec un échantillon suffisamment grand et une division parfaitement aléatoire, la proportion de jeunes utilisateurs, le niveau de revenus et la répartition géographique des groupes A et B seront en principe remarquablement identiques.

Dès lors, si les performances des données des deux groupes diffèrent, toutes les autres variables confondantes et tous les autres arguments sont éliminés. La seule différence ne peut être que le changement vers le bouton rouge.

---

## 2. Échantillon et test : La logique mathématique qui vainc les illusions

Maintenant que nous avons divisé les groupes, ne suffit-il pas de tester 10 utilisateurs chacun ? C'est ici qu'intervient la loi mathématique la plus impitoyable des tests A/B : la **loi des grands nombres et la taille de l'échantillon (Sample Size)**.

Imaginez que vous lanciez une pièce 10 fois et obteniez 7 fois pile et 3 fois face. Cela prouve-t-il que la pièce est truquée ? Évidemment non, car la base est trop petite ; 7:3 n'est que de la fluctuation, du hasard. Mais si vous lancez la pièce 100 000 fois et obtenez 70 000 fois pile, vous pouvez affirmer avec certitude : la pièce est biaisée.

De même, avec seulement 100 personnes testées, un clic de plus ou de moins fait bondir ou chuter le taux de 1 %. C'est pourquoi nous devons calculer à l'avance, par formule, le trafic minimum nécessaire avant de lancer l'expérience.

<ABTestingDemo tab="calculator" />

### 2.1 Les deux gardiens de la statistique

Une fois ces conditions de trafic remplies, la statistique poste deux gardiens sur notre chemin vers la vérité :

- **Puissance statistique (Power, généralement exigée à 80 %)** : elle représente la certitude avec laquelle vous pouvez détecter un effet réel de votre changement, plutôt que de le considérer comme du bruit. (Évite les faux négatifs : conclure « inefficace » alors que c'est « efficace »)
- **Seuil de significativité (P-Value, généralement exigé inférieur à 0,05)** : c'est le fameux « P<0,05 ». Cela signifie : si la différence observée entre les deux groupes était due uniquement au hasard, cette probabilité serait-elle inférieure à 5 % ? Si la part du hasard est même inférieure à 5 %, nous reconnaissons qu'il s'agit d'un résultat **statistiquement significatif** (Significant) et que ce changement a réellement eu un effet remarquable. (Évite les faux positifs : conclure « efficace » alors que c'est juste de la chance)

## 3. Confrontation des résultats : Le jugement de la vérité

Après avoir collecté suffisamment de données, nous devons évaluer précisément les résultats via le modèle professionnel d'entonnoir ci-dessous. La comparaison des résultats n'est pas une simple addition ou soustraction, mais un exercice complexe impliquant des intervalles de confiance et des calculs de distribution normale :

<ABTestingDemo tab="results" />

Lorsque la page affiche un **« Significatif ✅ »** clair, nous pouvons annoncer fièrement à toute l'entreprise : laissons de côté nos débats subjectifs et naïfs, et déployons immédiatement la variante B à 100 % ! Tout est soutenu par des principes mathématiques solides.

---

## 4. Les pièges sombres : Les erreurs dans l'analyse

Bien que le test A/B lui-même soit rationnel et scientifique, les personnes qui le mettent en œuvre sont soumises aux faiblesses humaines. On a souvent tendance à ne voir que les résultats que l'on espère, ce qui peut facilement fausser l'ensemble du test et entraîner de terribles conséquences inverses :

<ABTestingDemo tab="pitfalls" />

### 4.1 Attention à « l'effet de nouveauté »

Lorsque quelque chose vient d'apparaître, les utilisateurs peuvent cliquer sur votre nouveau bouton en apparence chaotique par pure curiosité, ce qui fait grimper le taux de conversion en flèche pendant les trois premiers jours.

Beaucoup de chefs de produit arrêtent l'expérience au troisième jour avec des données parfaites et publient un rapport de victoire. Mais si vous avez la patience d'attendre deux semaines, vous constaterez qu'une fois l'effet de nouveauté dissipé, les données retombent sous le seuil de l'ancienne version. C'est pourquoi la durée de l'expérience est cruciale — ne vous laissez pas aveugler par des hausses artificielles à court terme.

---

## 5. Résumé : Cultiver le courage de s'incliner devant les données

En résumé, passer de la « conjecture intuitive » au « test A/B » représente pour toute équipe une transformation mentale considérable.

1. **Formuler une hypothèse prudente** : Sur la base d'une observation rigoureuse des utilisateurs, établir une hypothèse quantifiable.
2. **Diviser en mondes parallèles** : Répartir le trafic par un pur tirage aléatoire pour éliminer le bruit externe.
3. **Accepter l'épreuve de l'échantillon** : Attendre que la loi des grands nombres s'applique et réduire la variance avec suffisamment de temps et d'échantillon.
4. **Rendre un jugement mathématique** : Laisser la valeur P décider de la qualité des variantes et se soumettre strictement aux faits de significativité.

En tant que créateurs de logiciels, la plus grande sagesse est d'**apprendre le courage de s'incliner devant les faits. Nous n'avons plus besoin de passer des heures en salle de réunion à nous disputer sur le bleu et le rouge ; il suffit d'attendre deux semaines, et le taux de clics nous prouvera quelle variante est réellement la préférée des utilisateurs.**
