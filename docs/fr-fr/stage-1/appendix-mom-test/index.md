---
title: "The Mom Test : comment valider les besoins par les entretiens utilisateurs"
description: "Article d'introduction à The Mom Test pour les lecteurs débutants. Apprenez à éviter les retours de politesse, à mener des entretiens utilisateurs axés sur les comportements réels, les faits concrets et les problèmes existants, et à transformer les « ça a l'air pas mal » en jugements de besoins plus fiables."
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'
const duration = 'Environ <strong>1,5 heure</strong>'
</script>

# The Mom Test : comment valider les besoins par les entretiens utilisateurs

<a id="top-mom"></a>

## Introduction du chapitre

<ChapterIntroduction
  :duration="duration"
  :tags="['Entretien utilisateur', 'Validation des besoins', 'Recherche utilisateur', 'Étude de marché']"
  coreOutput="1 ensemble de questions d'entretien plus à même de révéler des informations réelles"
  expectedOutput="Ne plus prendre les encouragements de politesse pour une validation, et savoir juger la direction à partir de comportements réels"
>

Beaucoup de gens, lorsqu'ils font leur première étude de marché, pensent que le plus important est de « discuter avec des gens ». Alors ils vont demander à leurs amis, collègues, voire leur famille :

- Tu penses quoi de mon idée ?
- S'il y avait un produit comme ça, tu l'utiliserais ?
- Cette fonctionnalité, ça a l'air pas mal, non ?

L'autre personne donne souvent un retour très encourageant :

- C'est pas mal
- Ça a l'air utile
- Je pense que tu devrais essayer

Le problème, c'est que ces réponses ne vous aident généralement pas à prendre une décision. Elles ressemblent davantage à de la politesse, du soutien, ou une réaction naturelle pour ne pas vous décevoir sur le moment. Vous pensez avoir obtenu une « validation de marché », mais en réalité vous n'avez collecté qu'un ensemble de réconforts difficilement exploitables pour la prise de décision.

La méthode The Mom Test a été conçue précisément pour résoudre ce problème. Elle nous rappelle : **ce n'est pas que les utilisateurs essaient de vous mentir, c'est que votre façon de poser les questions oriente naturellement l'autre personne vers des réponses flatteuses mais inutiles.**

</ChapterIntroduction>

::: info SOP minimale
**Objectif** : après avoir lu, vous saurez mieux comment discuter avec les utilisateurs pour ne pas entendre uniquement « ça a l'air pas mal », mais vraiment obtenir des informations qui vous aident à juger la direction.

**Actions** : réécrivez vos 5 questions initiales, en privilégiant « quand est la dernière fois que ça s'est produit » et « comment avez-vous géré ça à ce moment-là ».

**Résultat** : vous saurez plus facilement distinguer ce qui est une opinion de ce qui constitue une véritable preuve pour étayer vos décisions.

**Navigation rapide** : [Qu'est-ce que The Mom Test](#mom-what) · [Trois principes fondamentaux](#mom-principles) · [Comment l'IA peut vous aider](#mom-ai)
:::

## Ce que vous apprendrez

1. Quel problème The Mom Test résout réellement, et pourquoi beaucoup de « recherches utilisateurs » ne capturent en fait pas d'informations réelles
2. Les principes fondamentaux de cette méthode : moins demander des opinions, plus demander des comportements ; moins demander des hypothèses, plus demander des faits
3. Comment transformer une question qui génère facilement des faux positifs en une question d'entretien plus précieuse
4. Comment combiner The Mom Test avec JTBD, la validation des besoins et l'évaluation du MVP

<a id="mom-what"></a>
## [1. Qu'est-ce que The Mom Test vraiment](#top-mom)

The Mom Test vient du livre du même nom de Rob Fitzpatrick. Son nom ressemble à une blague, mais il touche juste :

**Même votre maman aurait du mal à vous dire directement « c'est une mauvaise idée ».**

La raison n'est pas qu'elle est malhonnête, mais :

- Elle ne veut pas vous blesser
- Elle va instinctivement vous encourager
- Elle a facilement tendance à répondre dans le sens de ce que vous exprimez

Et ce n'est pas seulement votre maman — les amis, collègues, anciens camarades de classe, et même beaucoup d'inconnus, face à votre idée de produit, donnent souvent des « retours positifs » similaires. Cela ne signifie pas que le besoin est réel, seulement que vous avez formulé votre question d'une manière qui génère facilement des réponses flatteuses.

Donc, l'essentiel de The Mom Test n'a jamais été « ne demandez pas à votre maman », mais :

**Ne formulez pas vos questions de façon à ce que n'importe qui soit enclin à vous donner une réponse qui vous va droit au cœur.**

Ce que cette méthode veut vraiment vous apprendre, c'est comment obtenir, par la conversation, des informations plus proches des besoins réels, plutôt que de collecter un ensemble de commentaires qui vous font simplement vous sentir bien.

## 2. Quel est le problème fondamental qu'elle résout

The Mom Test résout principalement une illusion cognitive très courante :

**Prendre les retours positifs de politesse pour des besoins réels.**

Par exemple, si vous demandez :

- Tu penses quoi de cette idée d'application ?
- Si je faisais un outil AI pour t'aider à écrire ton CV, tu l'utiliserais ?
- Cette fonctionnalité, est-ce qu'elle a de la valeur ?

Ces questions ont en commun :

- Elles demandent toutes des « opinions »
- Elles portent toutes une pointe de suggestion
- Elles parlent toutes d'un futur qui n'est pas encore arrivé

Or, les réponses des gens aux « opinions » et aux « hypothèses futures » sont généralement instables. Beaucoup de gens surestiment leur intérêt, leur capacité d'exécution, et leur volonté future de payer.

The Mom Test vous rappelle donc :

- Ne croyez pas trop les évaluations des autres sur vos idées
- Ne croyez pas trop les prédictions des autres sur leurs comportements futurs
- Revenez autant que possible aux comportements réels déjà observés chez les utilisateurs

Parce que comparé à « est-ce que tu utiliserais ça », « comment as-tu géré ce problème la dernière fois » est souvent bien plus proche de la vérité.

<a id="mom-principles"></a>
## [3. Les trois principes fondamentaux](#top-mom)

Si vous ne deviez retenir que la partie la plus importante, commencez par ces trois principes.

### 3.1 Parlez moins de votre idée, parlez plus des expériences réelles passées de l'utilisateur

Beaucoup d'entretiens inefficaces commencent par exposer sa propre solution, à quel point on est enthousiaste, quel produit on prépare. Le problème, c'est qu'une fois que vous avez trop parlé, l'autre personne passe facilement en mode « vous accompagner » et « vous encourager ».

Une meilleure approche consiste à se concentrer sur l'expérience de l'autre :

- Quand est la dernière fois que vous avez rencontré ce problème ?
- Que faisiez-vous à ce moment-là ?
- Comment avez-vous fini par le résoudre ?
- Quelle étape était la plus pénible ?

Ce type de questions ramène naturellement la conversation vers la réalité, au lieu de rester sur des préférences imaginaires.

### 3.2 Demandez moins d'opinions abstraites, demandez plus de faits concrets

« Je trouve cette fonctionnalité pas mal », « ça a l'air bien », « ça semble utile » — toutes ces expressions sont trop abstraites pour guider les décisions produit.

Les informations plus précieuses ressemblent plutôt à ça :

- La semaine dernière, j'ai passé 2 heures à me débattre avec ce problème
- Actuellement, je me débrouille avec Excel et WeChat
- Le mois dernier, j'ai déjà payé pour un outil similaire
- Ma plus grande crainte est de me tromper, pas d'être lent

Ce sont ces informations qui vous aident vraiment à juger l'intensité du problème, sa fréquence et la probabilité de paiement.

### 3.3 Demandez moins aux utilisateurs quelle solution ils veulent, observez davantage comment ils résolvent le problème actuellement

Les utilisateurs sont très doués pour décrire leurs frustrations, mais pas nécessairement pour concevoir des solutions.

Si vous demandez :

- Voudriez-vous un AI qui fait ça automatiquement pour vous ?
- Pensez-vous qu'ajouter une fonctionnalité intelligente serait utile ?

Vous n'obtiendrez généralement qu'une attitude vague envers une solution, pas le besoin lui-même.

Les meilleures questions sont :

- Comment gérez-vous ce problème actuellement ?
- Pourquoi avez-vous choisi cette méthode ?
- Qu'est-ce qui ne va pas avec cette méthode ?

Comprendre les alternatives actuelles est souvent plus important que de demander directement « que voulez-vous ».

## 4. Pourquoi les gens vous donnent toujours des réponses flatteuses mais inutiles

Si vous comprenez cela, vous ferez beaucoup moins d'erreurs de jugement lors des entretiens.

### 4.1 Les gens sont instinctivement polis

Surtout quand votre interlocuteur a une relation avec vous, il aura du mal à dire directement :

- Cette direction ne me semble pas viable
- Je n'utiliserais pas ça du tout
- Ce problème n'est pas si important pour moi

Il dira plus probablement « c'est pas mal » ou « ça vaut le coup d'essayer ».

### 4.2 Les gens surestiment leur futur moi

Beaucoup de gens croient sincèrement qu'ils seront à l'avenir :

- Plus disciplinés
- Plus disposés à apprendre
- Plus disposés à payer
- Plus ouverts aux nouveaux outils

Donc la phrase « si ça existait, je l'utiliserais probablement » ne signifie souvent pas que la personne l'utilisera vraiment.

### 4.3 Votre façon de poser les questions oriente les réponses

Quand vous demandez :

- Mon idée est pas mal, non ?
- Cette fonctionnalité vous serait très utile, n'est-ce pas ?

Vous avez subtilement glissé la « bonne réponse » dans la question.

C'est pourquoi The Mom Test insiste particulièrement : **ne transformez pas vos entretiens en quête de validation.**

## 5. Comparaison directe : quelles questions sont inutiles, lesquelles sont plus précieuses

Ces comparaisons sont utiles pour presque tous les débutants.

| Questions inutiles | Questions plus précieuses |
| --- | --- |
| Tu penses quoi de mon idée ? | Quand est la dernière fois que tu as rencontré ce problème ? |
| S'il y avait ce produit, tu l'utiliserais ? | Comment gérez-vous ce problème actuellement ? |
| Serais-tu prêt à payer pour cette fonctionnalité ? | As-tu déjà dépensé de l'argent pour ce problème ? Pour quoi ? |
| Trouves-tu cette fonctionnalité importante ? | Dans ce processus, quelle étape est la plus pénible, la plus lente, la plus angoissante ? |
| Voudrais-tu un AI qui fait ça automatiquement ? | Pourquoi n'as-tu pas encore trouvé de meilleure solution ? |

Ce qui est le plus important dans ce tableau, ce ne sont pas les phrases exactes, mais la direction sous-jacente :

- Des opinions vers les faits
- Du futur vers le passé
- De votre solution vers le problème de l'utilisateur

## 6. Un rythme d'entretien que même un débutant peut utiliser immédiatement

Si vous voulez aller parler à des gens dès maintenant, vous pouvez suivre cet ordre.

### 6.1 Ouverture : expliquez que vous apprenez, pas que vous vendez

Par exemple :

> Je fais des recherches sur la façon dont les gens gèrent ce type de problème, je veux d'abord comprendre la situation réelle, je ne viens pas vous vendre quelque chose.

Cette formulation permet à l'autre personne de relâcher plus facilement le fardeau psychologique de « devoir vous donner un retour positif ».

### 6.2 Commencez par la dernière expérience réelle

Vous pouvez commencer par ce type de questions :

- Quand est la dernière fois que vous avez rencontré ce problème ?
- Que s'est-il passé à ce moment-là ?
- Quelle a été votre première réaction pour le gérer ?

Une fois que la conversation entre dans des événements précis, la qualité des informations s'améliore généralement de manière significative.

### 6.3 Approfondissez sur les comportements, les coûts et les alternatives

Continuez à demander :

- Comment résolvez-vous ce problème actuellement ?
- Qu'est-ce qui est le plus désagréable dans cette méthode ?
- Combien de temps, d'argent ou d'énergie y consacrez-vous ?
- Avez-vous essayé d'autres méthodes ? Pourquoi ne les avez-vous pas poursuivies ?

### 6.4 Enfin, évaluez la douleur et la priorité

Vous n'avez pas besoin de demander directement « est-ce douloureux ? », vous pouvez juger à partir des détails :

- Est-ce que ça arrive souvent
- Est-ce qu'il cherche activement des solutions de secours
- Est-ce qu'il est déjà prêt à payer pour ça
- Est-ce qu'il montre des émotions évidentes quand il en parle

Tout cela est plus utile qu'une simple « est-ce que c'est votre point de douleur ».

## 7. Un exemple plus complet

Supposons que vous voulez créer un produit « AI qui aide les étudiants à améliorer leur CV ».

### Mauvaise approche

Vous allez demander à des camarades :

> Je veux créer un outil d'optimisation de CV par AI, tu en penses quoi ?
> S'il pouvait adapter automatiquement le CV selon le poste, tu l'utiliserais ?

À ce moment, l'autre personne dira probablement :

- Ça a l'air pas mal
- Je pense que ça pourrait être utile
> Si c'est gratuit, j'essaierais

Ces réponses ne vous aident pratiquement pas à déterminer si le besoin est fort ou non.

### Meilleure approche

Vous pourriez reformuler :

> Quand est la dernière fois que tu as modifié ton CV ?
> Pourquoi devais-tu le modifier à ce moment-là ?
> Comment t'y es-tu pris ?
> Quelle étape t'a le plus bloqué ?
> As-tu demandé à quelqu'un de t'aider à le relire ?
> As-tu déjà passé beaucoup de temps ou dépensé de l'argent pour ton CV ?

Grâce à ces questions, les informations que vous pourriez obtenir sont :

- Beaucoup de gens ne savent pas écrire, mais ne savent pas comment adapter leur CV pour différents postes
- Leur plus grande difficulté n'est pas la mise en page, mais « ne pas savoir quelles expériences valent la peine d'être mentionnées »
- Ils procrastinent, pas parce qu'ils sont paresseux, mais parce que chaque modification de CV est épuisante
- Ils utilisent déjà les conseils de leurs aînés, les sites de modèles, les outils AI et les relectures par des amis pour s'en sortir

À ce stade, vous êtes bien plus proche du problème réel.

## 8. Comment combiner The Mom Test avec JTBD

Si JTBD vous aide à voir « ce que l'utilisateur veut accomplir », The Mom Test vous apprend plutôt :

**Comment vérifier, par des entretiens, si ce job existe vraiment.**

Vous pouvez tout à fait les utiliser ensemble :

1. D'abord, utilisez JTBD pour formuler une hypothèse de job
2. Puis utilisez les techniques de The Mom Test pour interroger les utilisateurs sur leur dernière expérience réelle
3. Vérifiez si ce job est vraiment fréquent, réel et prioritaire

Par exemple, votre hypothèse JTBD pourrait être :

> Quand je prépare ma candidature pour un stage, je veux rapidement adapter mon ancien CV en une version adaptée au poste, pour pouvoir soumettre ma candidature dès que possible.

Vous pouvez alors vérifier avec des questions de style The Mom Test :

- Quand est la dernière fois que tu as postulé ?
- Comment as-tu modifié ton CV à ce moment-là ?
- Quelle partie a été la plus difficile à écrire ?
- Après modification, comment jugerais-tu si c'est assez bon ?

Ainsi, les méthodes se connectent :

- JTBD vous aide à définir l'hypothèse de besoin
- The Mom Test vous aide à vérifier l'hypothèse par entretien

## 9. Erreurs les plus courantes des débutants lors des entretiens utilisateurs

### 9.1 Transformer l'entretien en présentation produit

Plus vous parlez de vos propres idées, plus l'autre personne aura tendance à vous suivre, au lieu de vous dire la réalité.

### 9.2 N'interroger que des connaissances

Les connaissances ne sont pas interdites, mais elles sont plus enclines à vous encourager. Vous devez au moins mélanger des personnes plus proches des utilisateurs réels, pas seulement des gens qui vous soutiennent.

### 9.3 Poser des questions sur les fonctionnalités trop tôt

Si vous n'avez pas encore compris le problème, commencer à poser des questions sur les boutons, l'interface et les détails des fonctionnalités, c'est généralement entrer trop tôt dans la solution.

### 9.4 Prendre un « je l'utiliserais » pour un résultat de validation

L'entretien vous aide au mieux à juger la direction, il ne remplace pas la validation. La vraie validation, c'est de voir si les utilisateurs sont prêts à payer un coût réel — temps, coût de changement, essai, voire paiement.

### 9.5 Ne pas organiser les notes après l'entretien

Si vous laissez les informations de côté après avoir discuté, elles deviennent vite des impressions floues. Il vaut mieux les organiser rapidement :

- Les problèmes les plus fréquents
- Les mots émotionnels dans les propos originaux des utilisateurs
- Les solutions alternatives actuelles
- Les coûts déjà engagés
- Vos propres nouveaux jugements

## 10. Liste de questions prêtes à l'emploi

Si vous voulez commencer rapidement, voici un ensemble de questions suffisamment polyvalentes.

### Questions d'ouverture

- Quand est la dernière fois que vous avez rencontré ce problème ?
- Que s'est-il passé exactement à ce moment-là ?

### Questions sur les comportements

- Comment avez-vous géré la situation à ce moment-là ?
- Pourquoi avez-vous choisi cette méthode ?

### Questions sur les coûts

- Combien de temps ou d'énergie cette tâche vous prend-elle généralement ?
- Avez-vous déjà dépensé de l'argent pour la résoudre ?

### Questions sur les alternatives

- Avez-vous essayé d'autres outils ou méthodes ?
- Pourquoi ne les avez-vous pas continués ?

### Questions de clôture

- Si vous rencontrez le même problème à l'avenir, à quoi ressemblerait la solution idéale ?

Notez que cette question de clôture peut être posée, mais il vaut mieux la garder pour la fin. Parce que vous avez d'abord besoin de recueillir des faits, pas des souhaits.

## 11. Résumé

La contribution la plus importante de The Mom Test n'est pas de vous donner une technique pour « mieux discuter », mais de vous aider à construire un mode de jugement plus lucide :

- Ne croyez pas trop vite aux compliments des autres sur vos idées
- Ne prenez pas « si ça existait, je l'utiliserais » pour un besoin réel
- Ne transformez pas vos entretiens en quête de validation

Un entretien véritablement précieux devrait revenir autant que possible à ces éléments :

- La dernière expérience réelle de l'utilisateur
- Comment il gère le problème actuellement
- Ce qu'il a déjà payé
- Où il est visiblement mal à l'aise

Quand vous commencez à poser les questions de cette façon, les informations que vous obtiendrez seront parfois moins flatteuses, mais généralement plus utiles.
Et quand on crée un produit, **une vérité utile est toujours plus importante qu'un encouragement flatteur.**

<a id="mom-ai"></a>
## [12. Comment utiliser l'IA pour vos entretiens utilisateurs](#top-mom)

The Mom Test est fondamentalement une méthode pour « discuter avec de vraies personnes », l'IA ne peut donc pas remplacer les entretiens réels. Mais l'IA est très utile comme assistante avant, pendant et après les entretiens, surtout pour réduire la barrière d'entrée des débutants.

### 12.1 Laissez l'IA réécrire vos questions « faciles à rater »

Beaucoup de gens savent qu'ils ne devraient pas demander « tu penses quoi de mon idée », mais à la première occasion, ils reviennent à ce type de phrase. Vous pouvez d'abord confier vos questions préparées à l'IA pour qu'elle les réécrive :

```text
Voici les questions que je prépare pour des entretiens utilisateurs :
[insérez vos questions]

Merci de les réécrire selon les principes de The Mom Test :
1. Supprimez les questions d'opinion
2. Supprimez les questions qui supposent l'avenir
3. Reformulez-les autant que possible autour des comportements passés réels, des alternatives existantes et des coûts déjà engagés
4. Organisez le tout en une liste de 8 à 10 questions prêtes pour l'entretien
```

Même une entrée très basique fonctionne :

```text
Je veux demander aux utilisateurs :
1. Tu penses quoi de mon idée d'outil AI pour améliorer les CV ?
2. Tu l'utiliserais ?
3. Serais-tu prêt à payer ?

Aide-moi à reformuler ces questions.
```

L'IA pourrait produire quelque chose comme :

```text
Questions réécrites :

1. Quand est la dernière fois que tu as modifié ton CV ?
2. Pourquoi devais-tu le modifier ?
3. Comment t'y es-tu pris ?
4. Quelle étape t'a pris le plus de temps ?
5. As-tu demandé à quelqu'un de t'aider à le relire ?
6. As-tu déjà passé beaucoup de temps ou dépensé de l'argent pour modifier ton CV ?
```

Ce type de résultat est très utile parce qu'il transforme directement vos questions « demandant des opinions » en questions « demandant des comportements réels ».

### 12.2 Laissez l'IA générer des guides d'entretien pour différents profils

Pour un même domaine, face à différents publics, l'accent de l'entretien sera différent. Par exemple, les étudiants, les RH, les travailleurs indépendants ont des préoccupations complètement différentes. Vous pouvez demander à l'IA de générer une version de guide pour chaque type d'interlocuteur :

- Pour les utilisateurs débutants, concentrez-vous sur la dernière expérience réelle
- Pour les utilisateurs intensifs, concentrez-vous sur les alternatives et la douleur
- Pour les utilisateurs payants, concentrez-vous sur les coûts déjà engagés

Ainsi, vous aurez un meilleur rythme lors des vraies conversations, au lieu de poser les mêmes questions à tout le monde.

Par exemple, vous pouvez saisir directement :

```text
Je vais discuter avec deux types de personnes :
1. Étudiants qui cherchent leur premier stage
2. Étudiants plus avancés qui ont déjà relu beaucoup de CV

Donnez-moi un guide d'entretien pour chacun, 6 questions par guide.
```

L'IA pourrait générer :

```text
Pour les étudiants :
1. Quand est la dernière fois que tu as postulé pour un stage ?
2. Quelle étape t'a le plus bloqué ?
3. Comment sais-tu si ton CV est prêt à être envoyé ?
...

Pour les étudiants avancés :
1. Quand est la dernière fois que tu as aidé quelqu'un à relire son CV ?
2. Quels problèmes évidents vois-tu le plus souvent ?
3. À quelle étape les plus jeunes bloquent-ils le plus ?
...
```

Ainsi, vous n'avez pas besoin d'inventer les questions à partir de zéro, la préparation de l'entretien sera beaucoup plus facile.

### 12.3 Laissez l'IA organiser vos notes d'entretien

Après les entretiens, le problème le plus fréquent n'est pas « manquer d'informations », mais « les informations sont trop dispersées ». L'IA est très adaptée pour vous aider à organiser des conversations fragmentées en notes structurées :

```text
Voici les notes de mes entretiens avec 3 utilisateurs.
Merci de les organiser selon la perspective de The Mom Test :
1. Quels contenus sont des faits, lesquels sont juste des opinions
2. Quel est le dernier comportement réel de l'utilisateur
3. Quelle est la solution alternative actuelle
4. Quels sont les coûts en temps, argent ou énergie déjà engagés par l'utilisateur
5. Quels problèmes ont été mentionnés à plusieurs reprises
6. Quelles déclarations semblent positives mais manquent de preuves
```

Cette étape est particulièrement précieuse car elle vous aide à séparer le contenu « qui a l'air pas mal » du contenu « qui peut vraiment étayer vos décisions ».

Une entrée simple pourrait être :

```text
Voici les notes après une conversation avec un utilisateur :

- Elle a dit que si un outil existait, elle essaierait probablement
- La semaine dernière, elle a passé une soirée entière à modifier son CV
- Actuellement, elle demande principalement à des amis de l'aider à relire
- Elle a dit que le plus difficile est de savoir quand un CV est « prêt à être envoyé »

Aidez-moi à distinguer ce qui est opinion et ce qui est fait.
```

L'IA pourrait répondre :

```text
Opinions :
- Si un outil existait, elle essaierait probablement

Faits :
- La semaine dernière, elle a passé une soirée à modifier son CV
- La solution alternative actuelle est de demander à des amis de relire
- Le point le plus difficile est de savoir quand on peut considérer le CV « prêt à envoyer »

Points clés pour évaluer le besoin :
- Ce problème est survenu récemment
- L'utilisateur a déjà investi un temps significatif
- La solution actuelle dépend d'autres personnes, elle n'est pas stable
```

Ce résultat montre très intuitivement aux débutants : quelles phrases peuvent servir à prendre des décisions, et lesquelles ne sont que des commentaires.

### 12.4 Laissez l'IA faire une première recherche en ligne légère

Si vous n'avez pas encore commencé vos entretiens, vous pouvez d'abord demander à l'IA de faire une recherche externe très légère, comme :

- Dans les communautés publiques, comment les gens se plaignent-ils de ce problème récemment
- Qu'est-ce qui est le plus critiqué dans les outils existants
- Les utilisateurs ont-ils déjà payé pour des problèmes similaires
- Quelles alternatives existent déjà sur le marché

Ce type d'information ne remplace pas les entretiens avec de vraies personnes, mais peut vous aider à entrer plus rapidement dans le sujet et à savoir par où commencer les questions.

Par exemple, une entrée simple pourrait être :

```text
Merci de rechercher :
« Ce dont les étudiants se plaignent le plus quand ils modifient leur CV »
Organisez les 5 plaintes les plus fréquentes, dans un langage très simple.
```

L'IA pourrait répondre :

```text
Plaintes fréquentes :

1. Ne sait pas ce qu'il faut mettre dans le CV
2. Devoir le modifier pour chaque poste, c'est fatigant
3. Après de nombreuses modifications, on n'est toujours pas sûr que c'est bien
4. Personne ne peut donner un retour fiable
5. On a toujours l'impression de ne pas être prêt, donc on remet à plus tard
```

La valeur de ce type de résultat est qu'il vous permet de trouver plus facilement un angle d'attaque pour vos entretiens.

### 12.5 Laissez l'IA jouer le rôle de « coach de débriefing d'entretien »

Vous pouvez aussi confier les notes d'un entretien que vous venez de terminer à l'IA, et lui demander de vous faire des critiques :

```text
Voici les notes d'un entretien utilisateur que je viens de faire.
Merci de m'aider à débriefé depuis la perspective de The Mom Test :
1. Quelles questions ressemblaient trop à une recherche de validation
2. Quelles questions étaient trop orientées
3. Où aurais-je pu approfondir sur les faits
4. Si je pouvais recommencer, comment pourrais-je mieux poser les questions dans cette conversation
```

C'est particulièrement utile pour les débutants, car vous développerez plus rapidement une sensibilité à « est-ce que je collecte des preuves ou des encouragements ».

## 📚 Exercices

<StageAssignmentCard title="Mener un entretien sans chercher à vendre votre idée">

En vous basant sur le contenu ci-dessus, veuillez réaliser les exercices suivants :

1. Choisissez un produit que vous voulez créer récemment, et écrivez d'abord 5 questions « faciles à rater » que vous auriez posées
2. Réécrivez ces 5 questions dans un style plus conforme à The Mom Test
3. Trouvez 3 utilisateurs potentiels, et posez au moins une fois « quand est la dernière fois que vous avez rencontré ce problème »
4. Après l'entretien, organisez 4 types d'informations : comportements réels, alternatives, coûts engagés, difficultés récurrentes

</StageAssignmentCard>

## Lectures complémentaires

- [Site officiel de The Mom Test](https://momtestbook.com/)
- [Rob Fitzpatrick : The Mom Test](https://www.robfitz.com/the-mom-test/)
