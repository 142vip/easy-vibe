---
title: "Jobs to Be Done : trouver ce que les utilisateurs veulent vraiment accomplir"
description: "Article d'introduction à Jobs to Be Done pour les lecteurs débutants. Comprendre que les utilisateurs n'achètent pas des fonctionnalités mais « emploient » votre produit pour accomplir une progression dans un contexte spécifique, et apprendre à utiliser JTBD pour décomposer la direction produit, les questions d'entretien et les prompts AI."
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'
</script>

# Jobs to Be Done : trouver ce que les utilisateurs veulent vraiment accomplir

<a id="top-jtbd"></a>

<!-- Introduction du chapitre -->

<ChapterIntroduction
  :duration="duration"
  :tags="['JTBD', 'Besoins utilisateurs', 'Réflexion produit', 'Découverte de besoins']"
  coreOutput="1 phrase JTBD qui ressemble davantage à un vrai besoin"
  expectedOutput="Transformer une idée vague en un scénario utilisateur et une direction MVP plus concrets"
>

Beaucoup de gens, quand ils commencent à créer un produit, font l'erreur la plus courante de concentrer toute leur attention sur « quelles fonctionnalités je vais créer ». Ils voient que d'autres ont une classification intelligente, ils veulent aussi l'ajouter ; ils voient que d'autres ont un résumé automatique, ils veulent aussi l'intégrer ; ils voient que d'autres ont fait des Agents, du multimodal, des workflows, ils se sentent obligés d'en faire autant.

Mais dans la réalité, les utilisateurs décident rarement d'utiliser un produit parce que « le nom de la fonctionnalité est cool ». Ils sont plutôt dans un moment précis, voulant faire avancer une tâche, et « embauchent » temporairement un outil, un service, voire une personne pour les aider à franchir cette étape.

C'est exactement ce que la méthode **Jobs to Be Done (JTBD)** nous rappelle : **les utilisateurs n'achètent pas des fonctionnalités en soi, ils emploient une certaine solution pour les aider à accomplir une progression.**

Cet article vous guidera, dans un langage aussi simple que possible, pour comprendre JTBD depuis zéro et en faire un outil d'analyse directement utilisable pour vos applications AI.

</ChapterIntroduction>

::: info SOP minimale
**Objectif** : après avoir lu, vous saurez mieux comment transformer une idée vague en un besoin avec un vrai scénario utilisateur, au lieu de n'avoir en tête qu'une liste de noms de fonctionnalités.

**Actions** : écrivez 1 idée vague, trouvez 3 utilisateurs potentiels et demandez-leur « comment avez-vous géré ça la dernière fois », puis organisez le tout en 1 phrase JTBD.

**Résultat** : vous obtiendrez une hypothèse de besoin plus claire, sachant ce que la première version doit résoudre en priorité.

**Navigation rapide** : [Qu'est-ce que JTBD](#jtbd-what) · [La formule en une phrase](#jtbd-formula) · [Comment l'IA peut vous aider](#jtbd-ai)
:::

<!-- Ce que vous apprendrez -->

1. Qu'est-ce que Jobs to Be Done, et pourquoi c'est plus proche des besoins réels que le « brainstorming de fonctionnalités »
2. Comment distinguer « les fonctionnalités que les utilisateurs disent vouloir » de « ce qu'ils veulent vraiment accomplir »
3. Comment utiliser un modèle simple pour décomposer une idée vague en contexte, déclencheur, obstacle et critère de succès
4. Comment utiliser JTBD pour les produits AI, les questions d'entretien et l'organisation des prompts

<a id="jtbd-what"></a>
## [1. Passer des fonctionnalités aux tâches à accomplir](#top-jtbd)

Jobs to Be Done est souvent abrégé en **JTBD**. L'idée centrale derrière cette méthode est liée à l'expression classique popularisée par l'équipe de Clayton Christensen : **les utilisateurs vont « employer » un certain produit pour accomplir une tâche.**

La « tâche » ici n'est pas une action superficielle de liste de choses à faire, mais une **progression** que l'utilisateur souhaite voir dans son état. Par exemple :

- Pas « je veux un outil AI de compte rendu », mais « je veux organiser les points clés, les tâches et les responsables en moins de 10 minutes après la réunion, sans dépendre de ma mémoire pour compléter les notes »
- Pas « je veux une app de comptabilité », mais « je veux savoir où va mon argent, pour ne plus être anxieux en fin de mois »
- Pas « je veux un optimiseur de CV », mais « je veux soumettre un CV décent avec plus de confiance, sans douter de la qualité de ce que j'ai écrit à chaque candidature »

Donc, **JTBD ne s'intéresse pas à l'apparence du produit, mais à la raison pour laquelle l'utilisateur en a besoin à ce moment précis.**

C'est aussi pourquoi de nombreux produits apparemment différents sont en réalité en concurrence pour le même job. L'utilisateur qui veut « ne pas s'ennuyer sur le chemin du travail » peut embaucher des vidéos courtes, des podcasts, des jeux, des chats, ou même la sieste. L'utilisateur qui veut « comprendre rapidement un PDF très long » peut embaucher un outil de résumé AI, un stagiaire, un collègue, lire lui-même en serrant les dents, ou simplement ne pas lire pour l'instant.

Une fois que vous regardez le problème sous cet angle, vous découvrirez que vos véritables concurrents ne sont souvent pas « une autre app qui vous ressemble », mais **toutes les alternatives actuellement acceptables pour l'utilisateur**.

<figure class="field-figure"><a href="https://commons.wikimedia.org/wiki/File:Mapa_de_viaje_de_clientes.png" target="_blank" rel="noreferrer"><img src="/images/product-discovery/jtbd/customer-journey-map.png" alt="Carte du parcours client recensant besoins, activités, objets utilisés, ressentis et opportunités produit" loading="lazy" /></a><figcaption><strong>Un job s'inscrit dans un parcours.</strong> La carte rend visibles les étapes, les objets déjà utilisés et les changements d'état, au lieu de commencer par une liste de fonctionnalités. Source : <a href="https://commons.wikimedia.org/wiki/File:Mapa_de_viaje_de_clientes.png" target="_blank" rel="noreferrer">Wikimedia Commons</a>.</figcaption></figure>

## 2. Quelle est la différence entre JTBD, les personas et les listes de fonctionnalités

Beaucoup de débutants, quand ils commencent l'analyse des besoins, écrivent d'abord un persona : 25 ans, femme, ville de premier rang, cadre, aime les outils d'efficacité, prête à essayer de nouveaux produits. Ce type d'information n'est pas totalement inutile, mais il est généralement **insuffisant pour expliquer pourquoi une personne agirait à ce moment précis**.

JTBD s'intéresse davantage aux questions suivantes :

- Dans quel contexte a-t-il décidé de chercher une solution
- Qu'est-ce qui le bloquait exactement à ce moment-là
- Quelle tâche veut-il faire passer à l'étape suivante
- Quelle méthode de fortune utilise-t-il actuellement
- Si les choses sont bien résolues, quel résultat lui ferait dire « ça valait le coup »

Autrement dit, **le persona ressemble davantage à « qui est cette personne en gros », tandis que JTBD ressemble davantage à « que veut-elle vraiment accomplir maintenant »**.

De même, les listes de fonctionnalités peuvent facilement vous égarer. Les utilisateurs disent « je veux exporter en Word », « je veux une réécriture AI », « je veux une saisie vocale » — tout cela n'est qu'expression de surface. JTBD continue de creuser :

- Pourquoi avez-vous besoin d'exporter en Word maintenant, et pas en PDF ?
- Vous voulez réécrire, est-ce parce que le style est mauvais, ou parce qu'il faut adapter à différents publics ?
- Vous voulez la saisie vocale, est-ce parce que vous êtes paresseux pour taper, ou parce que vous êtes souvent en marchant, en conduisant, ou juste après une réunion pour prendre des notes immédiatement ?

Très souvent, **les fonctionnalités ne sont qu'une traduction temporaire du job**. Si vous ne collectez que des fonctionnalités, vous risquez de construire un produit « qui empile tout ce que les utilisateurs disent » ; si vous pouvez voir le job derrière, vous avez plus de chances de créer une solution vraiment fluide et véritablement compétitive.

## 3. Un exemple compréhensible même par un débutant

Ne vous précipitez pas pour penser à des produits AI complexes, commençons par un exemple de la vie quotidienne.

Supposons que quelqu'un n'a jamais le temps de prendre le petit-déjeuner avant de sortir le matin, alors il achète souvent un sandwich et un café à l'entrée du métro. En surface, il « achète » un petit-déjeuner ; mais vu par JTBD, ce qu'il veut vraiment accomplir pourrait être :

- Résoudre un repas le matin pressé, avec le moins d'effort mental possible
- Ne pas avoir faim avant d'arriver au bureau
- Ne pas retarder son trajet à cause du petit-déjeuner

Ici, l'utilisateur n'embauche pas « un sandwich d'une marque spécifique », mais une solution qui l'aide à faire avancer sa matinée sans encombre. Si le convenience store d'à côté est plus rapide, plus proche et plus fiable, il pourrait changer immédiatement.

Transposons cette logique aux produits AI et cela devient encore plus évident.

Par exemple, vous voulez créer un « outil AI de compte rendu de réunion ». Si vous vous arrêtez au niveau des fonctionnalités, vous commencerez facilement à penser :

- Faut-il supporter l'upload audio
- Faut-il intégrer la séparation des locuteurs
- Faut-il exporter en Markdown
- Faut-il générer automatiquement les tâches

Tout cela n'est pas faux, mais ce n'est pas suffisant. Avec JTBD, on demande une couche de plus : ce que l'utilisateur veut vraiment accomplir pourrait être :

- Je veux, dans les 10 minutes après la réunion, synchroniser les résultats de la discussion avec les absents
- Je veux extraire proprement les tâches, les responsables et les délais, pour que l'équipe ne collabore plus à base de mémoire
- Je veux réduire le temps passé à organiser le contenu des réunions, pour consacrer mon énergie aux décisions et à l'avancement

Une fois le job clairement énoncé, beaucoup de priorités de fonctionnalités émergent naturellement. La chose la plus importante pour la première version n'est peut-être pas « supporter 12 formats d'exportation », mais :

- La structure du compte rendu doit être suffisamment claire
- L'extraction des tâches doit être fiable
- Le lien de partage doit être pratique
- Le résultat doit être assez fiable pour être directement transféré à l'équipe

C'est la valeur de JTBD : **il vous aide à passer de « quelles capacités dois-je empiler » à « quelle progression je dois aider l'utilisateur à accomplir ».**

<figure class="field-figure"><a href="https://commons.wikimedia.org/wiki/File:Taking_Notes.JPG" target="_blank" rel="noreferrer"><img src="/images/product-discovery/jtbd/meeting-note-taking.jpg" alt="Lors d'une vraie réunion, des participants prennent des notes sur ordinateur et sur papier" loading="lazy" /></a><figcaption><strong>Le job existe avant le produit.</strong> Ordinateur, papier, mémoire et partage oral constituent déjà un système de remplacement. Photo : <a href="https://commons.wikimedia.org/wiki/File:Taking_Notes.JPG" target="_blank" rel="noreferrer">Wikimedia Commons</a>.</figcaption></figure>

<JtbdProgressLab />

## 4. Un modèle JTBD pratique

Si vous êtes débutant, ne cherchez pas à rendre JTBD trop académique. Saisissez les 5 éléments les plus utiles pour commencer.

### 4.1 Contexte

À quel moment, dans quel environnement l'utilisateur pense-t-il à ce produit ?

- Juste après une réunion
- Quand le patron demande soudainement un document
- Le soir en préparant une candidature
- En fin de mois quand on réalise que l'argent manque à nouveau

**Un besoin sans contexte n'est généralement pas encore assez réel.**

### 4.2 Déclencheur

Qu'est-ce qui le pousse à chercher immédiatement une solution ?

- Être submergé par un long document, sans savoir par où commencer
- Devoir rendre un document demain, et découvrir aujourd'hui que le format est chaotique
- Venir d'être rappelé par le manager sur l'avancement, et réaliser qu'on n'a pas organisé clairement
- Vouloir tenir un journal, mais l'écriture manuelle, le copier-coller et l'organisation sont trop pénibles

Le déclencheur porte souvent une émotion. Cette émotion est importante, car elle détermine pourquoi l'utilisateur passe à l'action à ce moment précis.

### 4.3 La progression souhaitée

Il ne veut pas seulement « faire une action », mais se propulser vers quel nouvel état ?

- Du chaos à la clarté
- De l'anxiété à la tranquillité
- De la procrastination au démarrage
- De l'inefficacité à la fluidité
- De l'incapacité à expliquer à la capacité de livrer directement

À cette étape, le mot « progression » est crucial. Parce que beaucoup de gens n'achètent pas vraiment un outil, mais un **changement d'état**.

### 4.4 L'alternative actuelle

Sans votre produit, comment fait-il ?

- Copier-coller manuel
- Se débrouiller avec Excel ou Notes
- Demander de l'aide à un collègue
- Remettre à plus tard
- Naviguer entre plusieurs outils

Qui est l'alternative, qui est votre véritable environnement concurrentiel.

<figure class="field-figure field-figure--narrow"><a href="https://commons.wikimedia.org/wiki/File:Scrum_task_board.jpg" target="_blank" rel="noreferrer"><img src="/images/product-discovery/jtbd/physical-task-board.jpg" alt="Tableau de tâches physique où des notes adhésives circulent entre les colonnes à faire, en cours et test" loading="lazy" /></a><figcaption><strong>L'alternative n'est pas nécessairement une autre application.</strong> Ce tableau physique accomplit déjà le job « rendre l'avancement visible ». Photo : Logan Ingalls, <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">CC BY 2.0</a>.</figcaption></figure>

### 4.5 Critère de succès

Quand peut-on dire que le problème est vraiment résolu ?

- Obtenir un résultat partageable en 10 minutes
- Pouvoir envoyer aux autres sans révision majeure
- Ne pas facilement oublier, se tromper ou manquer quelque chose
- Savoir quoi faire dès la première utilisation

Si vous ne savez même pas « comment l'utilisateur juge si ça valait le coup », cette direction n'est probablement pas encore assez aboutie.

<a id="jtbd-formula"></a>
## [5. La formule en une phrase, prête à l'emploi](#top-jtbd)

Quand vous voulez clarifier une direction produit, vous pouvez d'abord utiliser cette formule très pratique :

> Quand __________, je veux __________, afin de __________.
> Actuellement, je ne peux accomplir cette tâche qu'en __________.

Par exemple :

> Quand je sors d'une réunion de projet chargée en informations, je veux obtenir rapidement un compte rendu structuré avec les tâches, les responsables et les délais, afin de pouvoir synchroniser immédiatement l'équipe et faire avancer l'exécution.
> Actuellement, je ne peux m'en sortir qu'en me remémorant, en fouillant dans l'historique de chat et en organisant manuellement.

Autre exemple :

> Quand je prépare une candidature pour un nouveau poste, je veux rapidement adapter mes expériences existantes en une version plus ciblée sur le poste, afin de soumettre un CV décent avec plus de confiance.
> Actuellement, je ne fais que copier-coller l'ancien CV, modifier les formulations à la main, et à la fin, je suis de moins en moins sûr de moi.

Si vous pouvez écrire une phrase avec ce niveau de clarté, la conception des pages, des prompts et la hiérératisation des fonctionnalités deviendront beaucoup plus faciles.

## 6. Pour les produits AI, trois couches de job à examiner particulièrement

Beaucoup de produits AI semblent impressionnants en démonstration, mais ne parviennent pas à fidéliser les utilisateurs une fois en ligne. La raison courante est qu'ils ne résolvent que l'action de surface, pas le job plus profond.

Vous pouvez grossièrement diviser un job en trois couches :

### 6.1 Couche fonctionnelle

Quelle est la tâche la plus en surface ?

- Résumer un document
- Réécrire un texte
- Extraire les tâches
- Générer une image

C'est la couche que les utilisateurs expriment le plus facilement.

### 6.2 Couche émotionnelle

Quel inconfort l'utilisateur veut-il réduire, ou quel ressenti veut-il obtenir ?

- Ne plus paniquer
- Ne plus paraître non professionnel
- Ne plus recommencer de zéro à chaque fois
- Avoir plus de sentiment de contrôle

Beaucoup de volontés de paiement sont en réalité liées à la couche émotionnelle.

### 6.3 Couche sociale

Comment l'utilisateur veut-il être perçu par les autres ?

- Avoir l'air plus fiable
- Avoir l'air plus organisé dans l'équipe
- Avoir l'air plus professionnel face aux clients
- Avoir l'air plus expressif sur les réseaux sociaux

Si vous ne faites que la couche fonctionnelle, le produit sera facilement remplaçable ; si vous comprenez aussi les couches émotionnelle et sociale, vous trouverez plus facilement une valeur vraiment engageante.

## 7. Utiliser JTBD pour filtrer les directions produit en sens inverse

Parfois, ce n'est pas que vous avez déjà un produit, mais que vous avez 3 à 5 idées et ne savez pas laquelle réaliser. JTBD est alors idéal pour le filtrage.

Vous pouvez prendre chaque idée et vous poser 5 questions :

1. Le contexte correspondant à cette idée est-il suffisamment spécifique ?
2. Les utilisateurs utilisent-ils déjà une méthode de fortune pour s'en sortir ?
3. La douleur de ce job est-elle suffisamment forte, ou suffisamment fréquente ?
4. Si je le fais bien, l'utilisateur sentira-t-il clairement que « son état s'est amélioré » ?
5. La première version peut-elle se concentrer uniquement sur l'étape clé de ce job, pour produire une version petite mais utile ?

Si une direction, après réflexion, ne peut toujours être décrite que par « ça a l'air intéressant », sans pouvoir préciser le déclencheur, l'alternative et le critère de succès, c'est probablement encore une inspiration vague, pas une direction aboutie.

## 8. Des questions prêtes à l'emploi pour interroger les utilisateurs

Beaucoup de gens, quand ils font une étude, demandent : « Quelle fonctionnalité voulez-vous ? » Ce type de question génère facilement des réponses superficielles.

JTBD est plus adapté pour poser les questions suivantes :

- Quand est la dernière fois que vous avez rencontré ce problème ?
- Que faisiez-vous à ce moment-là, pourquoi étiez-vous bloqué ?
- Comment l'avez-vous finalement résolu ?
- Dans ce processus, qu'est-ce qui était le plus pénible, le plus lent, le plus angoissant ?
- S'il y avait un outil pour vous aider, quel résultat vous ferait dire qu'il est vraiment utile ?
- Quelles alternatives avez-vous essayées ? Pourquoi n'étaient-elles pas assez bonnes ?

L'avantage de cette approche est qu'elle ramène la conversation vers les expériences réelles, au lieu de rester sur des préférences imaginaires.

<figure class="field-figure"><a href="https://commons.wikimedia.org/wiki/File:Touch_on_Clamshell_Devices.jpg" target="_blank" rel="noreferrer"><img src="/images/product-discovery/jtbd/intel-context-observation.jpg" alt="Dans une étude d'Intel, une participante touche directement l'écran d'un ordinateur portable" loading="lazy" /></a><figcaption><strong>Le comportement est parfois plus précis que la réponse.</strong> Ces gestes observés en situation sont difficiles à faire apparaître avec la seule question « quelle fonctionnalité voulez-vous ? ». Photo : <a href="https://commons.wikimedia.org/wiki/File:Touch_on_Clamshell_Devices.jpg" target="_blank" rel="noreferrer">Intel Free Press / Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">CC BY 2.0</a>.</figcaption></figure>

## 9. Utiliser l'IA pour vous aider dans la décomposition JTBD

JTBD n'a pas été inventé par l'IA, mais l'IA est très bien adaptée pour vous aider à organiser et affiner les analyses JTBD.

Par exemple, si vous avez collecté 5 à 10 retours utilisateurs, vous pouvez les confier au modèle et lui demander de les synthétiser selon la structure suivante :

```text
Merci de jouer le rôle d'assistant de recherche produit.
Je vais vous donner des citations d'utilisateurs, ne donnez pas d'abord de suggestions de fonctionnalités,
mais organisez-les d'abord selon le framework Jobs to Be Done :

1. Dans quel contexte se trouve l'utilisateur
2. Quel est l'événement déclencheur de son action
3. Quelle progression veut-il vraiment accomplir
4. Quelle est l'alternative actuelle
5. Quel critère de succès est le plus important pour lui
6. Quels mots émotionnels reviennent dans ces retours

Enfin, organisez tout cela en 3 hypothèses JTBD les plus dignes d'être validées en priorité.
```

Si vous avez déjà une idée, vous pouvez aussi demander à l'IA de faire une première convergence :

```text
Je veux créer un [votre idée produit].
Ne me donnez pas directement une liste de fonctionnalités, mais analysez avec la méthode Jobs to Be Done :

1. Quels contextes spécifiques ce produit pourrait-il servir
2. Quel est le job central que l'utilisateur veut accomplir dans chaque contexte
3. Quelles sont les alternatives existantes
4. Quel job est le plus adapté comme point de départ MVP, et pourquoi
5. Écrivez le job final recommandé en une phrase JTBD claire
```

L'avantage de cette approche est que vous ne vous faites pas immédiatement emporter par l'IA vers « 50 idées de fonctionnalités », mais vous clarifiez d'abord la direction.

## 10. Les 4 erreurs les plus courantes chez les débutants

### 10.1 Écrire le job comme un nom de fonctionnalité

« Résumé AI », « Classification intelligente », « Génération automatique » — ce ne sont pas des jobs, ce sont seulement des modes de réalisation possibles.

### 10.2 Écrire un public beaucoup trop large

« Tous les professionnels », « tous les étudiants », « tous les entrepreneurs » — tout cela est généralement trop vague. Plus c'est vague, plus il est difficile de voir les scénarios réels.

### 10.3 Écouter seulement ce que les utilisateurs disent, sans observer ce qu'ils font

Les utilisateurs peuvent décrire ce qu'ils veulent, mais leurs véritables priorités sont souvent cachées dans la façon dont ils se débrouillent actuellement.

### 10.4 Vouloir construire une plateforme complète dès le début

La bonne approche de JTBD n'est généralement pas « je vais construire une grande plateforme qui fait tout », mais cibler d'abord l'étape la plus critique dans un scénario, et la rendre extrêmement fluide.

<a id="jtbd-ai"></a>
## [11. Comment utiliser l'IA pour mettre en pratique JTBD](#top-jtbd)

JTBD n'a pas été inventé par l'IA, mais l'IA est très bien adaptée pour servir d'assistante de recherche, d'assistante d'organisation et de miroir dans cette méthode. L'essentiel est : **laissez l'IA vous aider à organiser et à élargir, pas à deviner les utilisateurs à votre place.**

Voici comment l'utiliser :

### 11.1 Laissez l'IA réécrire vos idées vagues en hypothèses JTBD

Quand vous n'avez qu'une description vague en tête, comme « je veux créer un outil pour aider les étudiants à trouver un stage », vous pouvez d'abord demander à l'IA de la décomposer en plusieurs jobs possibles :

```text
J'ai une idée produit vague : [votre idée]
Ne me donnez pas directement une liste de fonctionnalités, mais analysez avec la méthode Jobs to Be Done :
1. Quels contextes spécifiques cela pourrait-il correspondre
2. Quelle progression l'utilisateur veut vraiment accomplir dans chaque contexte
3. Quelles pourraient être les alternatives actuelles
4. Quel job est le plus adapté pour un MVP en premier
Écrivez chaque job en une phrase JTBD claire.
```

Vous pouvez même écrire une entrée très basique :

```text
Je veux créer un truc pour aider les étudiants à trouver un stage.
Je ne sais pas encore exactement quoi faire, aidez-moi à réfléchir à ce que les utilisateurs veulent vraiment accomplir.
```

L'IA pourrait répondre quelque chose comme :

```text
Directions JTBD possibles :

1. Quand je prépare ma première candidature de stage, je veux savoir rapidement quels documents préparer en priorité,
pour ne pas reporter ma candidature à cause de la confusion.

2. Quand je vois une offre de stage, je veux juger rapidement si ça vaut le coup de postuler,
pour ne pas perdre trop de temps sur des postes inadaptés.

3. Quand je commence à postuler, je veux adapter mon CV existant en une version plus ciblée sur le poste,
pour pouvoir postuler plus vite et améliorer mon taux de réussite.
```

La valeur de ce type de résultat est qu'il décompose votre pensée vague en plusieurs directions plus proches de scénarios réels.

### 11.2 Laissez l'IA organiser les citations d'utilisateurs

Si vous avez déjà fait quelques entretiens, vous pouvez confier les notes à l'IA pour qu'elle en extraie les contextes, déclencheurs, alternatives et critères de succès qui reviennent :

```text
Voici les citations de 5 utilisateurs.
Ne donnez pas d'abord de solution, mais organisez selon le framework JTBD :
1. Dans quel contexte se trouve l'utilisateur
2. Quel est l'événement déclencheur de son action
3. Quelle progression veut-il vraiment accomplir
4. Quelle est l'alternative actuelle
5. Quel critère de succès est le plus important pour lui
6. Quelles informations reviennent chez plusieurs utilisateurs
Enfin, organisez en 3 hypothèses JTBD prioritaires pour validation.
```

Une entrée très simple pourrait être :

```text
J'ai demandé à 3 personnes, ils m'ont dit à peu près ceci :

1. Chaque fois que je dois postuler, je dois refaire mon CV, c'est vraiment pénible.
2. En fait, ce que je crains le plus, c'est de ne pas savoir si ce que j'écris est correct.
3. Actuellement, je demande aux anciens de m'aider à relire, mais je n'ose pas toujours les déranger.

Organisez-moi ça : que veulent-ils vraiment accomplir ?
```

L'IA pourrait répondre :

```text
Résultat de l'organisation :

- Contexte commun : préparer une candidature de stage, besoin de traiter le CV
- Difficulté commune : ne pas savoir comment modifier pour que ce soit « assez bon »
- Alternative actuelle : demander aux anciens de relire, modifier soi-même en boucle
- JTBD possible :
  Quand je prépare ma candidature de stage, je veux juger plus vite si mon CV a atteint le niveau pour être envoyé,
  pour ne pas rester bloqué à « encore un peu de modification » et ne jamais l'envoyer.
```

Ce type de résultat est utile parce qu'il vous aide à extraire des notes dispersées quelque chose qui ressemble davantage à un « besoin ».

### 11.3 Laissez l'IA faire une recherche en ligne légère

Avant de vous lancer dans des entretiens à grande échelle, vous pouvez demander à l'IA de faire un scan externe très léger, comme :

- Dans les forums ou communautés publics, comment les gens se plaignent-ils de ce problème
- Les produits existants résolvent-ils principalement quelle couche du problème
- Quelle est l'alternative la plus courante des utilisateurs
- Dans les avis fréquents, qu'est-ce que les gens apprécient le plus et le moins

Ce type de recherche ne remplace pas les entretiens avec de vrais utilisateurs, mais il est idéal comme échauffement en phase Discover, pour construire d'abord une carte des problèmes.

Une entrée simple pourrait être :

```text
Merci de rechercher :
« Quelles sont les douleurs les plus fréquentes quand les étudiants modifient leur CV et postulent pour des stages ? »
Priorisez les forums publics, les posts d'expérience et les communautés de recherche d'emploi.
Organisez en 5 problèmes les plus fréquents.
```

L'IA pourrait répondre :

```text
Douleurs fréquentes :

1. Ne sait pas quoi mettre dans le CV, trop peu d'expériences
2. Ne sait pas comment adapter pour différents postes
3. A modifié beaucoup de versions, mais n'est toujours pas sûr que c'est assez bon
4. Ne trouve personne de fiable pour relire
5. Le processus de candidature est complexe, tendance à procrastiner
```

Ce type de résultat ne peut pas être considéré comme conclusion finale, mais il est idéal pour décider quel type de problème interviewer en priorité.

### 11.4 Laissez l'IA jouer le rôle de « contre-partie »

Très souvent, nous sommes trop attachés à nos propres idées. Vous pouvez demander à l'IA de jouer un rôle de critique pour vous forcer à clarifier vos questions :

```text
Merci de jouer le rôle d'un consultant en recherche produit très strict.
Voici mon hypothèse JTBD : [votre hypothèse]
Critiquez-la sous les angles suivants :
1. Le contexte est-il trop large
2. Le job est-il écrit comme une fonctionnalité plutôt qu'une vraie progression
3. L'alternative est-elle trop faible
4. Le critère de succès n'est-il pas assez clair
5. Quel est le risque principal qui nécessite une validation pour cette hypothèse
```

L'avantage de cette approche est que vous découvrirez plus vite si vous regardez un besoin ou seulement une solution que vous aimez.

## 12. Résumé

La valeur la plus importante de Jobs to Be Done n'est pas de vous donner un nouveau terme, mais de vous aider à changer de perspective : **ne vous fixez pas uniquement sur les fonctionnalités du produit, mais sur ce que l'utilisateur veut faire avancer à l'étape suivante.**

Quand vous commencerez à vous poser répétitivement ces questions :

- Dans quel contexte l'utilisateur embauche-t-il ce produit
- Où est-il exactement bloqué
- Quelle méthode de fortune utilise-t-il actuellement
- Une fois le problème résolu, quel sera le changement d'état

Vous découvrirez que beaucoup d'idées floues deviennent soudainement claires, et que beaucoup de fonctionnalités tape-à-l'œil deviennent soudainement moins importantes.

Créer un produit, surtout un produit AI, le plus grand risque est de se laisser absorber par la démonstration de capacités dès le début. JTBD vous aide à ramener l'attention sur ce qui compte vraiment : **pourquoi l'utilisateur a besoin de vous, et quelle progression vous l'aidez à accomplir.**

## 13. Exercices

<StageAssignmentCard title="Décrire ce que l’utilisateur cherche réellement à accomplir">

En vous basant sur le contenu ci-dessus, veuillez réaliser les exercices suivants :

1. Choisissez une idée produit que vous avez récemment, et écrivez-la clairement avec une phrase JTBD
2. Complétez les 5 éléments pour cette idée : contexte, déclencheur, progression, alternative, critère de succès
3. Trouvez 3 utilisateurs potentiels, et demandez au moins une fois « quand est la dernière fois que vous avez rencontré ce problème »
4. Confiez les notes d'entretien à l'IA et organisez-les en 3 hypothèses JTBD prioritaires pour validation

</StageAssignmentCard>

## Lectures complémentaires

- [Christensen Institute : Jobs to Be Done](https://www.christenseninstitute.org/theory/jobs-to-be-done/)
- [Harvard Business School Online : What Is Jobs to Be Done?](https://online.hbs.edu/blog/post/jobs-to-be-done)
- [Intercom : Jobs-to-be-Done : A framework for customer needs](https://www.intercom.com/blog/jobs-to-be-done-framework/)
- [Mural : Jobs to Be Done framework guide](https://www.mural.co/blog/jobs-to-be-done-framework)

<style scoped>
.field-figure { margin: 24px 0 32px; overflow: hidden; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg-soft); }
.field-figure > a { display: block; background: #f4f4f1; }
.field-figure img { display: block; width: 100%; max-height: 520px; object-fit: contain; }
.field-figure--narrow img { max-height: 720px; }
.field-figure figcaption { padding: 13px 16px 15px; border-top: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); font-size: 13px; line-height: 1.75; }
.field-figure figcaption strong { color: var(--vp-c-text-1); }
@media (max-width: 640px) { .field-figure { margin: 20px 0 28px; } }
</style>
