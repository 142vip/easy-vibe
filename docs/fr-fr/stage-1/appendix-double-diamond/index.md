---
title: "Le modèle Double Diamond : faire d'abord les bonnes choses, puis faire les choses correctement"
description: "Article d'introduction au Double Diamond pour les lecteurs débutants. Comprendre les quatre phases Discover, Define, Develop, Deliver, et éviter de se précipiter dans les prototypes avant d'avoir compris le problème."
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'
const duration = 'Environ <strong>1,5 heure</strong>'
</script>

# Le modèle Double Diamond : faire d'abord les bonnes choses, puis faire les choses correctement

<a id="top-dd"></a>

## Introduction du chapitre

<ChapterIntroduction
  :duration="duration"
  :tags="['Double Diamond', 'Design Thinking', 'Analyse des besoins', 'Conception de solutions']"
  coreOutput="1 définition de problème plus claire et 1 point d'entrée de validation plus raisonnable"
  expectedOutput="Ne plus se précipiter pour dessiner des prototypes, mais savoir d'abord clarifier le problème avant de comparer les solutions"
>

Beaucoup de gens, lorsqu'ils créent un produit pour la première fois, le piège le plus courant n'est pas « ne pas travailler assez dur », mais de passer trop vite à la solution.

À peine une direction a-t-elle germé dans leur esprit qu'ils commencent à penser : comment dessiner les pages, où placer les boutons, faut-il intégrer l'IA, faut-il faire un système de connexion, quel outil utiliser pour les prototypes. Après s'être agité un moment, ils se rendent compte que le problème fondamental n'a jamais été vraiment clarifié : les utilisateurs ont-ils vraiment ce point de douleur ? Ce problème mérite-t-il d'être résolu maintenant ? Vous pensiez faire avancer le projet, mais en réalité vous accélérez juste dans la mauvaise direction.

Le modèle Double Diamond est conçu pour éviter ce genre de situation.

Son rappel le plus précieux est : **« faire les bonnes choses » et « faire les choses correctement » sont deux étapes complètement différentes.** Si vous n'avez pas encore compris le problème et que vous vous précipitez pour faire un prototype, vous ne ferez généralement que rendre la mauvaise direction plus complète.

</ChapterIntroduction>

::: info SOP minimale
**Objectif** : après avoir lu, vous saurez mieux quand réfléchir d'abord au problème et quand commencer à penser aux solutions et aux prototypes, évitant ainsi de travailler dur dans la mauvaise direction dès le début.

**Actions** : suivez les quatre étapes `Discover → Define → Develop → Deliver`, en ne faisant à chaque étape que ce qui est nécessaire.

**Résultat** : vous obtiendrez une définition de problème plus claire, plusieurs solutions comparables, et une version minimale validable.

**Navigation rapide** : [Qu'est-ce que le Double Diamond](#dd-what) · [Le premier diamant](#dd-first) · [Comment l'IA peut vous aider](#dd-ai)
:::

## Ce que vous apprendrez

1. Qu'est-ce que le modèle Double Diamond, et pourquoi il est adapté aux débutants en création de produit
2. Ce que font les quatre phases Discover, Define, Develop, Deliver
3. Comment distinguer « je devrais continuer à diverger » de « je devrais commencer à converger »
4. Comment appliquer le modèle Double Diamond aux produits AI, à la conception de prototypes et à la validation des besoins

<a id="dd-what"></a>
## [1. Qu'est-ce que le modèle Double Diamond](#top-dd)

Le modèle Double Diamond est un cadre de processus de design classique promu par le **Design Council** britannique. Il représente un processus complet de design et d'innovation sous la forme de deux diamants consécutifs.

La raison pour laquelle c'est des « diamants » est que chaque diamant comprend deux actions opposées mais toutes deux importantes :

- **Divergence** : élargir d'abord la vision, voir plus de possibilités
- **Convergence** : réduire ensuite le périmètre, prendre des décisions et faire des compromis

Le processus complet se déroule en quatre étapes :

1. **Discover** : comprendre largement les utilisateurs, les problèmes, l'environnement et le marché
2. **Define** : extraire des masses d'informations le problème central véritablement digne d'être résolu
3. **Develop** : diverger autour du problème central pour trouver plusieurs solutions
4. **Deliver** : filtrer, prototyper, tester et livrer la solution la plus appropriée

Si l'on compresse ces quatre étapes en une seule phrase facile à retenir :

- **Le premier diamant** : comprendre d'abord quel problème résoudre exactement
- **Le deuxième diamant** : décider ensuite quelle solution utiliser pour le résoudre

C'est aussi la phrase que vous avez prononcée avec justesse :

- **Le premier diamant : faire les bonnes choses**
- **Le deuxième diamant : faire les choses correctement**

## 2. Pourquoi le modèle Double Diamond est particulièrement adapté aux débutants

Le rythme le plus courant chez les débutants en création de produit ressemble souvent à ça :

- Avoir une idée
- Trouver la direction cool
- Commencer immédiatement à dessiner des prototypes
- En construisant, découvrir que les fonctionnalités se multiplient
- Finalement, ne plus savoir quel problème on résout

La valeur du modèle Double Diamond n'est pas de rendre le processus plus complexe, mais de **vous forcer à séparer « comprendre le problème » et « concevoir la solution »**.

Cela semble banal, mais c'est en réalité très important. Parce que beaucoup de produits qui échouent ne le font pas par manque d'effort, mais parce que :

- Ils ont choisi le mauvais problème
- Ils ont mal compris les utilisateurs
- Ils ont verrouillé une solution trop tôt
- Ils ont passé beaucoup de temps à peaufiner les détails sans valider la direction

Le modèle Double Diamond vous rappelle constamment :

- Ne présumez pas que le problème est établi juste parce que l'idée semble bonne
- Ne présumez pas que la solution mérite d'être réalisée juste parce qu'elle est réalisable
- Ne présumez pas que les utilisateurs en auront vraiment besoin juste parce que le prototype paraît complet

<a id="dd-first"></a>
## [3. Le premier diamant : faire les bonnes choses](#top-dd)

Le premier diamant se concentre sur **le problème lui-même**, pas sur la solution.

Vous pouvez le résumer en une phrase : **ne vous précipitez pas, déterminez d'abord si ça vaut la peine d'être fait.**

### 3.1 Discover : ouvrir d'abord l'espace du problème

La tâche centrale de la phase Discover est de **faire une recherche large, pas de tirer des conclusions rapides**.

Les activités typiques de cette étape incluent :

- Observer comment les utilisateurs se comportent dans des scénarios réels
- Interviewer des utilisateurs potentiels pour comprendre quand ils ont rencontré le problème pour la dernière fois
- Observer comment ils se débrouillent actuellement
- Examiner comment les concurrents et les alternatives gèrent la situation
- Collecter des informations sur le marché, les processus, les contraintes, la chaîne de valeur

Beaucoup de gens pensent à tort que Discover consiste à « lire plus de documentation ». En réalité, ce qui est plus crucial, c'est : **vous devez comprendre les personnes et les contextes, pas juste accumuler des informations.**

Par exemple, si vous voulez créer un outil « AI qui aide à organiser les comptes rendus de réunion », en phase Discover, il serait plus pertinent de se concentrer sur :

- Où les utilisateurs souffrent-ils le plus après une réunion
- Est-ce la prise de notes, l'organisation, ou la synchronisation qui est difficile
- Est-ce qu'ils écrivent eux-mêmes, demandent à des stagiaires, réécoutent les enregistrements, ou ne font simplement pas de compte rendu
- Quels types de réunions nécessitent le plus un compte rendu, lesquels n'en ont pas besoin du tout

L'objectif le plus important de cette étape n'est pas d'obtenir une réponse, mais de **ne pas supposer trop tôt que vous connaissez déjà la réponse.**

### 3.2 Define : extraire le problème central de la masse d'informations

Si Discover est l'ouverture, Define est le recentrage.

La phase Define ne consiste pas à conserver toutes les observations, mais à se demander :

- Quel est le problème véritablement prioritaire à résoudre
- Quel problème est le plus fréquent, le plus douloureux, le plus porteur de valeur
- Quelle est la seule scène à cibler pour la première version

L'essence de cette étape est de transformer un sujet large en une définition de problème claire.

Par exemple, au début vous disiez :

> Je veux créer un outil AI pour améliorer l'efficacité des réunions.

En phase Define, une meilleure formulation pourrait devenir :

> Nous allons d'abord résoudre le problème des équipes projet qui, après des réunions collaboratives de 30 à 60 minutes, ne parviennent pas à produire en 10 minutes un compte rendu incluant les tâches, les responsables et les délais.

À ce stade, le problème commence à devenir clair :

- Qui est l'utilisateur
- Quel est le contexte
- Quel est le blocage
- Quel est le critère de succès

L'essence de Define est de **passer de « beaucoup de problèmes » à « quel problème résoudre en premier cette fois-ci ».**

## 4. Le deuxième diamant : faire les choses correctement

Ce n'est qu'après avoir terminé le premier diamant qu'il est vraiment approprié d'entrer dans le deuxième. Parce qu'à ce stade, vous ne résolvez pas une direction vague, mais un problème spécifique qui a été cerné.

### 4.1 Develop : diverger les solutions autour du problème central

L'accent de la phase Develop est de **plorer plusieurs solutions possibles pour le même problème**.

Notez que cette divergence est différente de celle de la phase Discover.

- La divergence de Discover explore l'espace des problèmes
- La divergence de Develop explore l'espace des solutions

Par exemple, pour le cas du compte rendu de réunion, en phase Develop, vous pouvez commencer à penser :

- Faire un outil web ou un plugin de réunion
- Traiter après upload de l'enregistrement ou faire une prise de notes en temps réel
- Ne faire que des résumés ou se concentrer sur l'extraction des tâches
- Mettre l'accent sur l'efficacité individuelle ou la synchronisation d'équipe
- Donner aux utilisateurs la liberté d'éditer ou produire directement un modèle structuré

Cette étape se prête bien au brainstorming, et aussi à l'élargissement des solutions avec l'équipe.

Mais il y a un prérequis : **toutes les solutions doivent servir le même problème déjà défini.**
Si le problème n'est pas clairement défini, Develop risque de redevenir une dispersion de fonctionnalités.

### 4.2 Deliver : choisir la solution, faire le prototype, tester et livrer

La phase Deliver est l'étape de convergence du deuxième diamant.

Ce qu'il faut faire ici n'est pas de continuer à imaginer plus, mais de commencer à juger :

- Quelle solution est la plus adaptée à la phase actuelle
- Quelle version est la plus petite mais la plus utile
- Quelles fonctionnalités sont essentielles d'abord, lesquelles peuvent attendre
- Comment prototyper, tester et valider à petite échelle

Beaucoup de gens pensent que Deliver équivaut à « mise en ligne ». En réalité, son sens plus précis est : **transformer une solution en quelque chose de testable, de validable et d'itérable.**

Cela peut être :

- Un flux basse fidélité
- Un prototype Figma
- Un MVP fonctionnel
- Un test utilisateur à petite échelle
- Une version itérée après des retours réels

L'essentiel de Deliver n'est pas la « livraison parfaite », mais de **mettre la solution dans un environnement réel pour validation aussi rapidement que possible.**

## 5. Un tableau comparatif facile à retenir

Si vous n'arrivez jamais à distinguer les quatre phases, retenez simplement cette version :

| Phase | Ce que vous faites | Mots-clés | Produits courants |
| --- | --- | --- | --- |
| Discover | Comprendre le problème | Recherche, observation, entretiens, collecte d'informations | Insights utilisateurs, notes de contexte, liste de problèmes |
| Define | Définir le problème | Synthèse, focalisation, compromis, reformulation | Définition du problème, priorités, point d'entrée MVP |
| Develop | Explorer les solutions | Brainstorming, comparaison, co-création, hypothèses de prototype | Liste de solutions, schémas de flux, direction de prototype |
| Deliver | Valider les solutions | Prototypage, tests, itération, livraison | Prototype, retours de test, version optimisée |

Compressé encore plus, cela donne :

- **Discover / Define** : résoudre « faire les bonnes choses »
- **Develop / Deliver** : résoudre « faire les choses correctement »

## 6. Les malentendus les plus courants sur le modèle Double Diamond

### 6.1 Passer directement à Deliver sans Discover

C'est le cas le plus fréquent. Beaucoup de gens, à peine ont-ils une idée, se mettent à dessiner des prototypes, rédiger des PRD, intégrer des modèles, créer des pages.

Le problème n'est pas que vous ne travaillez pas sérieusement, mais que vous n'avez peut-être même pas confirmé si le problème mérite d'être résolu.

### 6.2 Faire beaucoup de Discover, mais jamais Define

L'autre extrême est de toujours faire des recherches, lire des documents, interviewer, sans jamais oser converger.

Le Double Diamond ne vous demande pas de diverger indéfiniment, mais vous rappelle : après la divergence, il faut entrer dans le jugement et les compromis.

### 6.3 Après Define, modifier subrepticement le problème

Beaucoup d'équipes, en phase Develop, modifient la définition du problème pour l'adapter à une solution plus facile à réaliser.

C'est dangereux. Vous n'êtes peut-être plus en train de résoudre le problème, mais en train de trouver des justifications pour la solution que vous préférez.

### 6.4 Confondre Deliver avec « mise en ligne complète »

Deliver ne signifie pas qu'il faut terminer le produit complet. Très souvent, un prototype testable ou un essai utilisateur réel constitue déjà un bon deliver.

## 7. Comment utiliser le modèle Double Diamond dans les produits AI

Les produits AI tombent particulièrement facilement dans le piège du « capacités d'abord », parce que les capacités des modèles semblent très alléchantes. Vous aurez envie de penser directement :

- Faut-il intégrer le multimodal
- Faut-il faire un Agent
- Faut-il ajouter des workflows
- Faut-il intégrer la voix, l'image, la recherche en ligne

Mais le modèle Double Diamond vous oblige à demander d'abord :

- Où les utilisateurs sont-ils vraiment bloqués
- Ce blocage nécessite-t-il absolument l'IA
- Sans IA, qu'est-ce qui manque le plus dans les méthodes actuelles
- Une fois l'IA ajoutée, quel est le progrès le plus essentiel

Cela vous aide à éviter une situation courante : **capacités puissantes, valeur faible.**

Un ordre pratique serait :

1. En phase Discover, observer comment les utilisateurs gèrent les tâches actuellement
2. En phase Define, écrire le scénario le plus douloureux en une définition de problème claire
3. En phase Develop, comparer quelles capacités AI sont les plus adaptées à ce problème
4. En phase Deliver, construire une version minimale et la faire tester par de vrais utilisateurs

## 8. Un modèle Double Diamond prêt à l'emploi

Si vous êtes en train de créer votre propre produit, vous pouvez suivre cet ordre :

### Discover

- Qui sont les utilisateurs que j'ai observés ?
- Quand est la dernière fois qu'ils ont rencontré ce problème ?
- Comment le résolvent-ils actuellement ?
- Où est-ce le plus pénible, le plus lent, le plus angoissant ?

### Define

- Parmi tous ces problèmes, lequel mérite le plus d'être résolu en priorité ?
- Quel scénario est le plus fréquent ou le plus crucial ?
- Qui et quoi servirons-nous uniquement dans la première version ?
- Une fois le problème résolu, quel sera le changement d'état de l'utilisateur ?

### Develop

- Pour ce problème, quelles solutions sont possibles ?
- Quelles sont les plus légères, les plus rapides, les plus faciles à valider ?
- Qu'est-ce qui est indispensable, qu'est-ce qui peut attendre ?

### Deliver

- Que pouvons-nous livrer au minimum pour valider cette direction ?
- Un flux, un prototype, ou un MVP ?
- Qui devons-nous trouver pour tester ?
- Après le test, comment décider : continuer, modifier ou abandonner ?

## 9. Un exemple compréhensible même par un débutant

Supposons que vous voulez créer un outil AI pour « aider les étudiants à préparer leur CV de candidature ».

Beaucoup de gens entreraient directement dans le deuxième diamant, commençant à penser :

- Faut-il embellir en un clic
- Faut-il faire de la réécriture intelligente
- Faut-il faire correspondre automatiquement avec l'offre d'emploi
- Faut-il générer une lettre de motivation

Mais selon le modèle Double Diamond, un meilleur processus serait :

### Premier diamant

**Discover**

- Aller parler aux diplômés récents pour savoir quand ils ont modifié leur CV pour la dernière fois
- Voir comment ils transforment l'ancien CV en nouvelle version
- Comprendre s'ils sont surtout gênés par « ne pas savoir écrire », « ne pas savoir modifier », ou « ne pas savoir juger si c'est bien »

**Define**

- Converger vers un problème plus spécifique :
- Ce n'est pas « les étudiants ne savent pas faire de CV »
- Mais « les étudiants qui postulent pour la première fois à un stage ont du mal à reformuler leurs expériences existantes en formulations adaptées au poste, ce qui les pousse à retarder leur candidature »

### Deuxième diamant

**Develop**

- Imaginer plusieurs solutions : bibliothèque de modèles, réécriture AI, comparaison avec l'offre, notation du CV, exemples de référence

**Deliver**

- La première version ne fait que « reformuler les points d'expérience en fonction de la description du poste »
- La faire tester par 5 étudiants, pour voir s'ils soumettent leur première version de CV plus rapidement

Vous constaterez que, une fois le premier diamant bien fait, le deuxième devient beaucoup plus clair.

## 10. Résumé

La force du modèle Double Diamond réside dans le fait qu'il vous aide à décomposer un ensemble chaotique en quatre actions plus claires :

- D'abord, diverger pour comprendre le problème
- Puis, converger pour définir le problème
- Ensuite, diverger pour explorer les solutions
- Enfin, converger pour livrer la solution

Il ne vous ralentit pas, il vous fait **gagner les détours qui donnent l'impression d'être occupé mais vont dans la mauvaise direction.**

Surtout à l'ère de l'IA, où créer des choses devient de plus en plus rapide, le modèle Double Diamond devient encore plus important. Parce que quand « produire » devient de plus en plus facile, la capacité vraiment rare sera : **êtes-vous en train de résoudre un problème qui mérite d'être résolu, et le faites-vous de la bonne manière.**

Retenez juste cette phrase :

**Faites d'abord les bonnes choses, puis faites les choses correctement.**

<a id="dd-ai"></a>
## [11. Comment utiliser l'IA pour piloter votre processus Double Diamond](#top-dd)

Le modèle Double Diamond n'est pas un outil AI en soi, mais l'IA est très bien adaptée pour servir d'« accélérateur » dans les quatre phases. L'essentiel n'est pas de laisser l'IA décider à votre place, mais de l'utiliser pour élargir votre vision, organiser les informations, comparer les solutions et générer du matériel de validation.

### 11.1 En phase Discover, utilisez l'IA pour préparer le terrain

Avant les entretiens et la recherche formels, vous pouvez demander à l'IA de faire un balayage léger des problèmes, comme :

- Quelles alternatives existent sur le marché
- De quoi les utilisateurs se plaignent-ils le plus dans les communautés publiques
- Dans quels contextes et pour quels publics ce problème est-il courant
- Que les produits existants négligent-ils souvent

Cette étape ne remplace pas la recherche terrain, mais elle est idéale pour construire rapidement une carte des problèmes.

Une entrée très simple pour un débutant pourrait être :

```text
Je veux créer un outil pour aider les étudiants à modifier leur CV.
Ne me proposez pas de fonctionnalités, aidez-moi d'abord à voir quels problèmes les gens rencontrent le plus souvent.
```

L'IA pourrait répondre :

```text
Carte préliminaire des problèmes :

1. Ne sait pas quelles expériences mentionner
2. Ne sait pas comment adapter le CV pour chaque poste
3. Après de nombreuses modifications, on n'est toujours pas sûr que c'est bien
4. On a besoin de quelqu'un pour relire, mais on ne veut pas déranger
5. Parce qu'on n'est pas sûr, on retarde l'envoi
```

Ce type de résultat ne remplace pas vos conclusions, mais vous permet d'entrer plus vite dans le Discover.

### 11.2 En phase Define, laissez l'IA vous aider à converger vers une définition du problème

Beaucoup de gens, après avoir collecté beaucoup de matériel, trouvent la partie la plus difficile de condenser le problème en une phrase vraiment claire. Vous pouvez confier vos notes de recherche à l'IA et lui demander de les compresser en plusieurs définitions candidates :

```text
Voici les retours utilisateurs et les notes de recherche que j'ai collectés en phase Discover :
[insérez le contenu]

Merci de m'aider à faire trois choses :
1. Identifier les modèles de problèmes les plus fréquents
2. Classer 3 problèmes prioritaires par fréquence, intensité de douleur et validabilité
3. Écrire chaque problème en une définition spécifique
```

Vous pouvez même écrire une entrée très simple :

```text
Les problèmes que j'ai collectés sont :
1. Les gens ne savent pas quoi mettre dans leur CV
2. Les gens ne savent pas comment le modifier
3. Les gens trouvent toujours que ce n'est pas assez bien et n'osent pas l'envoyer

Lequel est le plus adapté pour une première version ?
```

L'IA pourrait répondre :

```text
Problème recommandé en priorité :

« Les étudiants qui postulent pour la première fois à un stage ne sont pas sûrs que leur CV est au niveau requis pour être envoyé, ce qui les pousse à modifier sans cesse et à retarder leur candidature. »

Raisons :
1. Ce problème est plus spécifique
2. Il explique le comportement de procrastination
3. Il est plus facile de concevoir une petite version pour le valider
```

Ce type de résultat est utile parce qu'il vous aide à passer d'un ensemble de problèmes flous à une définition plus proche d'un point de départ MVP.

### 11.3 En phase Develop, utilisez l'IA pour diverger sur plusieurs solutions

Beaucoup de gens, une fois le problème défini, ne se concentrent que sur la première solution qui leur vient à l'esprit. L'IA est idéale ici pour vous forcer à diverger :

```text
J'ai défini un problème central : [votre définition du problème]
Ne me donnez pas une seule réponse finale, mais proposez 2-3 directions de solution pour chacun des angles suivants :
1. Le MVP le plus léger
2. La solution la plus adaptée pour valider le besoin
3. La solution la plus adaptée pour améliorer l'expérience
4. Une solution sans IA
5. Une solution avec IA
Enfin, comparez les avantages, les risques et les coûts de validation de chaque solution.
```

Ainsi, vous ne vous enfermerez pas trop tôt dans une seule solution.

Une entrée simple pourrait être :

```text
Ma définition du problème est :
« Les étudiants ne sont pas sûrs que leur CV est prêt à être envoyé, donc ils retardent. »

Proposez-moi 4 solutions différentes, pas une seule.
```

L'IA pourrait répondre :

```text
Solution 1 : Checklist de validation du CV
Solution 2 : Réécriture ciblée en fonction de la description du poste
Solution 3 : Upload du CV avec indicateurs de risque
Solution 4 : Comparaison avec des exemples de qualité pour aider à évaluer l'écart
```

Vous êtes alors plus en mesure d'entrer dans la « comparaison de solutions » au lieu de ne vous concentrer que sur la réécriture AI.

### 11.4 En phase Deliver, utilisez l'IA pour générer des textes de prototype et du matériel de test

Quand vous entrez en phase Deliver, l'IA est très adaptée pour accélérer ces tâches :

- Générer les textes de pages pour un prototype basse fidélité
- Organiser un script de test utilisateur
- Générer plusieurs versions comparables de titres, boutons, descriptions
- Synthétiser les retours post-test en liste de problèmes

Par exemple, vous pouvez demander à l'IA de générer un script de test utilisateur de 20 minutes, ou de classer les retours de 5 utilisateurs en « continuer / changer de direction / mettre en pause ».

Une entrée minimale pourrait être :

```text
J'ai fait un prototype très simple :
l'utilisateur uploade son CV, le système lui indique quels éléments ne sont pas encore prêts pour l'envoi.

Générez-moi un script de test utilisateur de 15 minutes.
```

L'IA pourrait répondre :

```text
Script de test de 15 minutes :

1. D'abord, demandez à l'utilisateur de décrire sa dernière expérience de candidature
2. Laissez l'utilisateur uploader son CV de manière autonome
3. Observez s'il comprend les résultats du retour
4. Demandez : parmi ces indications, lesquelles sont les plus utiles, lesquelles sont confuses
5. Demandez : avant la prochaine candidature, aimeriez-vous réutiliser cet outil
```

Ce type de résultat est pratique parce qu'il vous fait passer de « j'ai fini mon prototype » à « comment je le teste ensuite ».

### 11.5 Laissez l'IA jouer le rôle de « gardien des phases »

Le problème le plus courant du modèle Double Diamond est que les gens sautent les étapes. Vous pouvez demander à l'IA de jouer un gardien, pour vous rappeler où vous êtes vraiment :

```text
Merci de jouer le rôle de coach en processus produit.
Voici l'état actuel de mon projet : [votre description]
Déterminez si je suis plutôt en Discover, Define, Develop ou Deliver.
Et dites-moi :
1. Est-ce que j'ai sauté une étape trop tôt
2. Quelle est l'action la plus importante à compléter à l'étape actuelle
3. Quelles choses je ne dois pas faire pour l'instant
```

C'est particulièrement utile pour les débutants, car il est facile de « commencer à dessiner des prototypes avant d'avoir clarifié le problème ».

## 📚 Exercices

<StageAssignmentCard title="Organiser votre idée avec le Double Diamant">

En vous basant sur le contenu ci-dessus, veuillez réaliser les exercices suivants :

1. Choisissez une idée produit que vous avez récemment, et rédigez le brouillon des quatre étapes Discover, Define, Develop, Deliver
2. En phase Define, forcez-vous à réduire le problème à une phrase spécifique
3. En phase Develop, listez au moins 3 solutions différentes, au lieu de ne vous concentrer que sur la première idée venue
4. En phase Deliver, écrivez une version minimale validable livrable en une semaine

</StageAssignmentCard>

## Lectures complémentaires

Cet article s'inspire principalement des ressources officielles du Design Council sur le Double Diamond, idéales pour approfondir :

- [Design Council : The Double Diamond](https://www.designcouncil.org.uk/our-resources/the-double-diamond/)
- [Design Council : Framework for Innovation](https://www.designcouncil.org.uk/our-work/skills-learning/tools-frameworks/framework-for-innovation-design-councils-evolved-double-diamond/)
- [Design Council : History of the Double Diamond](https://www.designcouncil.org.uk/our-resources/the-double-diamond/history-of-the-double-diamond/)
