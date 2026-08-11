---
title: 'Pensée produit et conception de solutions'
description: "Apprenez à passer de la construction d'outils IA au fait de penser, juger et peaufiner une application IA qui a du sens. Maîtrisez les concepts essentiels et les méthodes pratiques de la pensée produit."
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'
const duration = 'Environ <strong>6 heures</strong>'
</script>

# Pensée produit et conception de solutions

## Guide du chapitre

<ChapterIntroduction :duration="duration" :tags="['pensée produit', 'analyse des besoins', 'conception de solution', 'insight utilisateur']" coreOutput="1 solution produit complète" expectedOutput="idées de conception produit applicables">

Dans les chapitres précédents, vous avez appris à construire différents petits outils dans z.ai et dans un IDE IA local, et vous avez aussi essayé de gérer des sujets d'ingénierie comme la configuration d'environnement et l'installation de dépendances avec Trae. Vous avez désormais la capacité de faire passer une idée du navigateur vers un projet local.

Nous allons maintenant déplacer notre attention de <strong>« peut-on le construire ? »</strong> vers <strong>« qu'est-ce qu'il vaut vraiment la peine de construire ? »</strong>.

Cette leçon abordera de façon systématique :
- ce qu'est une « idée » et ce qui fait une « bonne idée »
- comment juger si une direction produit mérite d'être investie
- comment utiliser un processus reproductible pour transformer une inspiration vague en solution d'application claire

<strong>Objectif principal :</strong> passer de la capacité à construire des outils à la capacité de créer de vraies applications IA que les gens utilisent et qui génèrent de la valeur réelle.

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Sources d’idées', description: 'Trouver des idées produit fiables' },
      { title: 'Découpage de solution', description: 'Transformer une idée en application concrète' },
      { title: 'Affinage et jugement', description: 'Du fonctionnel vers l’agréable à utiliser' },
      { title: 'Amplification par l’IA', description: 'Utiliser l’IA pour créer de la valeur' }
    ]" />
  </ClientOnly>
</div>

## Ce que vous allez apprendre

En résumé, vous allez apprendre les bases de la construction d’une application : d’où viennent les idées → comment une idée devient une application → comment une application passe de utilisable à excellente → comment utiliser l’IA dans une application → comment trouver des utilisateurs après le lancement.

1. Je veux construire une application, d’où viennent des idées fiables ?
2. Une fois l’idée trouvée, comment la découper en quelque chose de réalisable ?
3. Après l’avoir construite, comment la juger et la peaufiner pour en faire une « bonne application » ?
4. À quelle étape, et comment, utiliser raisonnablement l’IA pour amplifier la valeur ?
5. Une fois l’application prête, comment trouver les premiers vrais utilisateurs à partir de zéro ?

# 1. Je veux construire une application, d’où viennent des idées fiables ?

Quand on parle de construire une application, beaucoup de gens réagissent d’abord en pensant qu’il faut trouver une idée créative suffisamment marquante. Alors ils regardent les classements tous les jours, lisent des rapports, étudient les produits à la mode, et fixent les histoires de réussite des autres en espérant tomber un jour sur une idée vraiment différente.

Mais la réalité est plus simple et plus dure : beaucoup de gens n’ont en fait aucune idée, ils sont simplement anxieux parce qu’ils n’en ont pas. D’autres se fixent dès le départ une barre beaucoup trop haute : si ce n’est pas assez intéressant, ils ne commencent pas, comme si le banal équivalait à l’échec. Pourtant, quand on avance réellement sur le terrain, on découvre que les applications qui tiennent dans le temps et avancent régulièrement ne sont pas, pour la plupart, sorties d’un brainstorming nocturne, mais ont grandi petit à petit dans des situations de vie très concrètes, autour de problèmes réels.

Le but de ce chapitre est donc de résoudre une question de départ : **comment avoir une idée ? Est-ce que cette idée est fiable ? Vaut-elle votre temps et votre énergie pour la transformer en vraie application ?**

## 1.1 Qu’est-ce qu’une idée

Commençons par une question très basique, mais souvent négligée : qu’est-ce qui compte exactement comme une idée ?

Dans la conversation courante, ce que les gens appellent une idée est souvent une excitation très subjective. Vous voyez peut-être une vidéo dans la rue, vous trouvez immédiatement que cette direction est géniale, et une phrase vous vient à l’esprit : « je pourrais faire quelque chose de similaire ». Ou bien, lors d’une discussion, tout le monde se plaint qu’un produit est difficile à utiliser, et vous ajoutez au passage : « s’il existait un outil qui faisait tout ça automatiquement pour moi… ». À ce moment-là, vous avez bien une pensée floue, mais on est encore loin de quelque chose qui peut réellement être construit.

Ici, fixons-nous un standard un peu plus rigoureux. Nous n’appelons une pensée une idée que lorsqu’elle satisfait au moins les points suivants :

Premièrement, **elle doit viser un type d’utilisateur clair**. Il ne s’agit pas de dire vaguement « tout le monde », mais de pouvoir expliquer clairement à qui cela s’adresse principalement. Est-ce pour les étudiants, les nouveaux arrivants dans le monde du travail, les parents qui ont des enfants, ou bien les développeurs indépendants, les vendeurs e-commerce, les petits entrepreneurs ? Des personnes différentes accordent de l’importance à des choses totalement différentes pour une même activité. Si vous n’avez même pas défini la cible, tous les jugements qui suivent vont flotter dans le vide.

Deuxièmement, **elle doit être ancrée dans un scénario concret**. À quel moment cette application est-elle utilisée ? Dans le métro du matin, pendant une pause au travail, avant de dormir, ou le week-end lorsqu’il faut organiser des documents ? Même des outils qui paraissent abstraits, comme les notes ou la gestion de tâches, quand on les observe attentivement, ont toujours une partie qui est utilisée fréquemment et qui est fortement liée à certains contextes.

Troisièmement, **elle doit aider l’utilisateur à accomplir une tâche claire**. La tâche n’a pas besoin d’être énorme, mais elle doit pouvoir être formulée. Par exemple : organiser la liste des choses à faire de la journée, condenser un long article en quelques points clés, générer un compte rendu de réunion structuré, ou produire un itinéraire réaliste pour une sortie du week-end dans une ville. Plus vous pouvez formuler la tâche précisément, plus il sera facile ensuite de concevoir les fonctionnalités et d’évaluer la valeur.

Quatrièmement, **elle doit proposer une méthode ou un outil meilleur que l’existant**. Comment l’utilisateur faisait-il cette tâche auparavant ? En mémoire, sur papier, dans Excel, avec des captures d’écran, ou en jonglant entre différentes applications ? Si vous apportez quelque chose de manifestement plus simple, plus stable et plus agréable, alors l’idée commence vraiment à avoir de la valeur.

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image1.png)

Si vous n’arrivez pas à formuler clairement ce qui précède, ce n’est pas grave. Nous sommes à l’ère de l’IA : vous pouvez transformer tout cela en un prompt complet, y ajouter votre idée, vos utilisateurs cibles et votre scénario d’usage, puis laisser un grand modèle vous aider à compléter et à affiner. Considérez le modèle comme un partenaire produit toujours disponible : dialoguez avec lui, questionnez-le, modifiez, et vous pourrez rendre concret un concept encore flou.

## 1.2 Idées et besoins utilisateurs : la première ligne de défense contre l’auto-satisfaction

Quand on construit une application pour la première fois, le piège le plus facile est celui de l’auto-satisfaction. C’est-à-dire que vous vous enthousiasme tellement pour votre idée que vous la trouvez révolutionnaire, mais quand vous l’expliquez à des utilisateurs ordinaires, leur réaction reste calme, parfois un peu perdue. Ils hochent poliment la tête et disent seulement : « c’est pas mal ». Ensuite, une fois le produit lancé, ils ne le téléchargent pas et ne l’utilisent pas dans la durée.

Pour éviter cela, il faut séparer l’idée et le besoin utilisateur.

Commençons par ce qu’est un **besoin utilisateur**. On peut le résumer simplement : dans un scénario concret, ce sont les coûts que l’utilisateur souhaite réduire, ou les valeurs qu’il souhaite augmenter, pour atteindre un objectif donné. Ces coûts ne sont pas seulement financiers ; ils comprennent aussi le temps, l’énergie, la charge mentale, le risque d’erreur et même la pression sociale. Par exemple, un nouveau venu dans le monde du travail peut être prêt à payer pour un jeu de modèles simplement pour être moins nerveux lors de son premier compte rendu ; un parent peut accepter de payer un peu plus si cela lui garantit une demi-heure rien qu’à lui chaque jour.

Quand on comprend cela, on voit que **le simple « cool » ne suffit pas à créer un besoin**. Beaucoup d’idées sont effectivement assez nouvelles, mais si elles ne rendent pas l’utilisateur plus efficace, plus serein ou plus confiant dans un objectif précis, il sera difficile de bâtir une application vraiment durable.

Il existe un fossé souvent négligé entre l’idée et le besoin. **L’idée représente votre jugement subjectif, pas une preuve appuyée par des données.** Le besoin, lui, représente ce que les utilisateurs vivent réellement et ce qui les préoccupe. Vous pouvez trouver qu’une fonctionnalité de génération automatique de poèmes est très cool, mais pour la plupart des utilisateurs, un outil qui leur fait gagner dix minutes par jour sur des tâches répétitives de tri et d’organisation sera sans doute bien plus attractif. À moins d’être Steve Jobs ou de posséder un sens du design exceptionnel, faire croire à tout le monde qu’une fonctionnalité de génération de poèmes est « forcément cool » et qu’ils devraient spontanément vous suivre, ce n’est pas simple.

Pour juger une idée, il existe une manière simple de distinguer ce qui ressemble à un **vrai besoin** ou à un **faux besoin**. Un vrai besoin se reconnaît au fait que, même sans votre application, les gens essaient déjà activement de résoudre ce problème. Même si la méthode actuelle est maladroite, ils sont prêts à y consacrer du temps, de l’énergie, voire de l’argent. Par exemple, certaines personnes écrivent leurs propres scripts juste pour alléger un peu leur travail répétitif. Dans ce genre de cas, si vous pouvez proposer une solution plus conviviale et plus généralisable, vous avez souvent une vraie chance de vous installer.

Le faux besoin, au contraire, fonctionne dans l’autre sens. Si vous ne le soulevez pas vous-même, la plupart des gens ne verront même pas que c’est un problème, et encore moins quelque chose d’absolument nécessaire à résoudre. Les scénarios que vous décrivez existent davantage dans votre imagination que dans la vie quotidienne des utilisateurs. Après votre présentation, ils trouveront l’idée sympathique, intéressante, mais n’achèteront pas, et risquent même d’oublier aussitôt. De telles idées peuvent servir pour des histoires, mais elles sont dangereuses pour un produit.

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image2.png)

Donc, **la première ligne de défense contre l’auto-satisfaction est de comprendre les besoins utilisateurs.** Dès le départ, vous devez vous forcer à répondre à une question apparemment simple mais très importante : à part moi, qui d’autre se plaint vraiment de ce problème ? Vous pouvez aller voir les forums, les communautés, les commentaires, ou demander directement à quelques personnes autour de vous qui pourraient devenir des utilisateurs. Si vous entendez rarement des plaintes émotionnellement fortes du type « je suis bloqué dessus à chaque fois » ou « la méthode actuelle est vraiment trop pénible », cela veut dire que cette idée reste encore assez éloignée d’un vrai besoin.

## 1.3 Pourquoi les bonnes idées sont de bonnes idées

Toutes les idées n’ont pas le même destin. Certaines, même si vous ne passez que quelques jours à en faire une version grossière mais fonctionnelle, attirent naturellement un petit groupe de vrais utilisateurs prêts à rester et à vous faire des retours avec patience. D’autres, même si vous empilez les fonctionnalités, dépensez de l’argent en publicité et faites beaucoup de promotion sur différentes plateformes, ne parviennent qu’à gonfler temporairement quelques chiffres grâce à une force externe, puis retombent vite dans le silence.

La différence fondamentale derrière cela est de savoir si l’idée touche vraiment un point de problème essentiel.

**Une bonne idée accueille naturellement la croissance** : même sous une forme très rudimentaire, avec seulement quelques boutons simples, si elle résout un petit problème précis de l’utilisateur, elle peut déclencher un certain niveau de croissance organique. Par exemple, un petit outil qui convertit rapidement la parole en texte peut, au début, n’être qu’une page web avec quelques boutons, mais si la qualité de reconnaissance est bonne et que l’usage est naturel, beaucoup de gens seront prêts à partager le lien à leurs proches, parce que cela leur fait simplement gagner du temps.

**Une mauvaise idée dépend souvent dès le départ d’une force externe pour fonctionner**. Même si l’interface est jolie et le cœur du produit très “haut de gamme”, vous devez pousser sans cesse, faire du bruit, expliquer encore et encore ; et dès que votre effort commercial ralentit, les chiffres d’usage chutent brutalement. Vous continuez à injecter des ressources, à nouer des partenariats, à organiser des opérations, mais vous avez toujours l’impression de ramer à contre-courant. Le problème n’est pas que vous exécutez mal, c’est que le point de départ ne touche pas une douleur suffisamment réelle.

Bien sûr, les situations ci-dessus ne sont pas absolues. Par exemple, sur un marché en phase initiale, il peut y avoir un délai avant que les utilisateurs perçoivent la valeur ; et lorsqu’il existe des concurrents, il faut aussi prendre en compte le design, la difficulté d’utilisation, la marque, etc. Mais ce sont des sujets plus profonds, que nous ne traiterons pas ici.

Quand on se demande s’il faut continuer à investir dans une idée, ce qui compte vraiment n’est pas à quel point l’idée paraît brillante, mais si elle peut naturellement faire naître un chemin allant du problème à la solution. On ne cherche pas à prouver qu’on est créatif ; on cherche un point de départ utile, à partir duquel on pourra peu à peu polir un petit outil jusqu’à en faire une vraie application utile.

Le choix compte plus que l’effort.

## 1.4 D’où viennent les bonnes idées : quatre sources et des exemples concrets

Quand beaucoup de gens pensent à trouver une idée, ils s’imaginent un individu assis à son bureau, le regard fixé sur le plafond, en espérant qu’un éclair d’inspiration tombe du ciel. En réalité, les bonnes idées viennent rarement comme ça. Elles naissent plutôt de petites observations de la vie quotidienne, de questions répétées dans des communautés, de tonnes de plaintes en ligne, ou encore d’un tri progressif à partir de produits déjà existants.

Si vous prenez vraiment au sérieux les quatre sources suivantes, vous pourrez facilement y dénicher des directions de départ.

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image3.png)

### Aimer sa propre vie

Il existe un principe très simple mais très efficace : **plus vous participez activement à votre propre vie, plus vous découvrez facilement les problèmes, et plus vous êtes capable de juger quels problèmes méritent d’être résolus.** Participer signifie ici que vous ne regardez pas la vie des autres à travers un écran, mais que vous la vivez, l’essayez et vous y trompez vous-même. Plus vous prenez vos centres d’intérêt au sérieux, plus ils ont de chances de devenir un terrain fertile pour faire naître des idées.

Par exemple, si vous aimez particulièrement vivre avec des chats, une journée passée avec votre propre chat vous donnera souvent plus d’informations que la lecture de cent conseils “comment s’occuper d’un chat”. Vous saurez où les chats font tomber les objets, vous saurez à quelle heure ils sont les plus actifs, dans quelles situations ils se stressent le plus, et vous vivrez personnellement les détails du nettoyage de la litière, du brossage, de la coupe des griffes et des visites chez le vétérinaire. **Chaque expérience un peu pénible est en réalité un indice potentiel de produit.**

Prenons la photo de votre chat : beaucoup ont déjà connu cette scène, le téléphone levé, mais le chat refuse obstinément de regarder l’objectif, baisse la tête pour se lécher les pattes ou fixe un autre coin de la pièce. Ne pourrait-on pas imaginer un petit outil qui afficherait sur l’écran du téléphone ou de la tablette un point rouge, une plume ou un petit insecte en mouvement, juste pour attirer l’attention du chat ? Lorsque vous appuyez sur le bouton photo, l’outil bougerait automatiquement près de la caméra avant pour “tromper” le regard du chat et le faire regarder vers l’objectif, tout en prenant plusieurs photos d’affilée pour vous aider à choisir celle qui est nette et jolie. En allant un peu plus loin, l’application pourrait même enregistrer quelles couleurs et quels trajectoires de mouvement attirent le plus chaque chat, et utiliser la prochaine fois un mode de jeu “exclusif” pour ce chat afin d’augmenter le taux de réussite.

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image4.png)

Si vous aimez le maquillage ou les soins de la peau, chaque produit sur l’étagère de votre salle de bain représente énormément d’essais, d’erreurs et de décisions. Vous avez peut-être déjà l’habitude de prendre une photo de chaque maquillage avec votre album photo, mais à chaque fois que vous revenez dessus, il faut vous rappeler quel rouge à lèvres et quelle palette vous aviez utilisés ce jour-là. Ne pourrait-on pas enregistrer tout cela de manière systématique pour créer votre propre catalogue de looks ? L’application pourrait même vous aider à voir quels looks sont les plus fréquents selon les contextes, quelles combinaisons rendent le mieux en photo, afin que vous n’ayez plus à repartir de zéro à chaque fois que vous choisissez votre maquillage.

Plus concrètement, beaucoup de gens vivent ce genre de situation : le matin, le temps presse, vous ouvrez votre album pour retrouver “ce maquillage de trajet qui avait si bien marché”, mais après avoir fait défiler pendant longtemps, vous ne savez toujours plus quels produits vous aviez vraiment utilisés. Ne pourrait-on pas imaginer une petite fonction qui, après la prise d’une photo de maquillage, vous laisse simplement dire à votre téléphone : “Aujourd’hui c’est un maquillage d’entretien, j’ai utilisé la palette orange-brun n°01 et un rouge à lèvres couleur pâte de haricot rouge”, et l’application reconnaît automatiquement cela pour générer une “recette de maquillage” liée à la photo ? La prochaine fois, il suffirait de chercher “entretien”, “ombre à paupières orange-brun”, “pâte de haricot” pour voir instantanément tous les looks associés, voire générer automatiquement une liste “aujourd’hui uniquement des maquillages adaptés au trajet, réalisables en cinq minutes”. Les quelques minutes gagnées chaque matin sont un problème très concret qui a été résolu.

Si vous aimez les city walks ou les formes de slow travel, vous utilisez peut-être déjà plusieurs outils pour reconstruire votre expérience : l’application de carte enregistre les itinéraires, les notes listent les cafés à visiter, l’album photo rassemble des images et des impressions le long du parcours. Alors, pourquoi ne pas imaginer une application qui relie itinéraires, lieux visités, photos et texte dans un journal de marche avec une timeline et une vraie histoire ? Mieux encore, vous pourriez partager l’itinéraire en un clic avec vos amis, afin qu’ils puissent vivre une autre version de la même ville.

On peut aussi aller chercher un détail encore plus quotidien : beaucoup de gens, lors d’un city walk, ressentent cette frustration très simple, “ce coin était magnifique sur le moment, mais une fois rentré, impossible de le retrouver sur la carte”. Ne pourrait-on pas créer une fonction ultra légère : quand vous arrivez dans un endroit qui vous plaît, vous maintenez le bouton des écouteurs et dites “marque cet endroit, c’est un bon trajet pour une promenade en amoureux”, et l’application place instantanément un marqueur vocal à l’endroit où vous êtes, en enregistrant automatiquement l’heure, la météo et le niveau sonore ? Plus tard, vous ou vos amis, en ouvrant la carte de la ville, pourriez voir ces “points d’ambiance testés sur le terrain” : les coins où l’on peut rêver seul, ceux qui sont beaux la nuit, ceux qui sont parfaits pour parler en marchant. Les petits carrefours qui seraient sinon “oubliés juste après être passés” deviendraient ainsi peu à peu une base de données d’expériences urbaines pleine de relief.

Ces exemples veulent en fait montrer une seule chose : **vous devez aimer votre vie, car votre vie est votre meilleure source d’idées.** Les petites contrariétés quotidiennes, les solutions de fortune improvisées, les endroits qui vous semblent un peu pénibles mais que vous continuez à supporter : si vous acceptez de les regarder un peu mieux et de vous demander si un petit outil pourrait les améliorer, ils peuvent tous devenir des prototypes de produits futurs.

### Explorer votre propre audience

Ce qu’on appelle “vos assets d’audience”, ce sont simplement des personnes que vous pouvez déjà toucher. Cela peut être vos lecteurs, une communauté que vous animez, un groupe interne dans votre entreprise, ou une communauté d’intérêt à laquelle vous participez depuis longtemps. Tant que vous avez un canal vous permettant d’entendre de façon régulière ce que certaines personnes disent, craignent et espèrent au quotidien, vous avez un avantage énorme sur quelqu’un qui part de zéro.

Prenons un exemple très simple. Si vous organisez une communauté de designers, ce que vous voyez chaque jour dans le groupe est en fait un trésor de besoins. Quelqu’un se plaint que les clients modifient toujours les maquettes, quelqu’un n’aime pas le modèle de facturation de certains sites de ressources, quelqu’un trouve que jongler avec plusieurs tailles de formats fait perdre beaucoup de temps. Derrière chaque plainte se cache un indice potentiel de produit. Par exemple, vous pourriez créer un outil simple d’adaptation de tailles qui génère en un clic un design dans les formats courants de chaque plateforme ; ou un petit outil qui enregistre et réutilise des composants fréquents pour aider les designers à faire plus vite leur travail répétitif.

Si vous êtes dans une communauté de préparation aux examens, le groupe peut être rempli en permanence de sujets similaires : “je n’ai pas la forme aujourd’hui”, “mon planning a encore pris du retard”, “quels documents étudier pour être plus efficace”, “comment tenir mes check-ins”. Vous n’avez pas besoin d’imaginer tout cela de toutes pièces. Il suffit d’observer un moment, d’organiser les difficultés que tout le monde répète, et vous pouvez déjà esquisser la direction fonctionnelle initiale d’une application d’apprentissage : objectifs mieux découpés, retour de check-in plus humain, visualisation de progression plus réaliste.

Dans ces cas-là, vous n’avez pas besoin de construire dès le départ un grand produit pour tout le monde. Il suffit d’admettre une chose : ce petit cercle de personnes que vous avez sous la main est votre meilleur point de départ. Plus vous les comprenez profondément, plus vous percevez leurs petits tracas, dits ou tus, et plus vous avez de chances de construire quelque chose qui sera réellement utilisé.

### Explorer les besoins dans l’espace public

Même si vous n’avez pas encore votre propre communauté ou votre propre groupe de lecteurs, ce n’est absolument pas un problème. Chaque jour, d’innombrables personnes racontent bruyamment leurs difficultés et leurs frustrations sur différentes plateformes du web. Ces voix publiques sont une immense réserve d’or, simplement la plupart des gens ne les écoutent jamais sérieusement.

Vous pouvez choisir quelques plateformes liées à des secteurs qui vous intéressent, puis rechercher régulièrement des mots-clés chargés d’émotion. Par exemple : **“c’est pénible”, “des recommandations ?”, “comment résoudre ça”, “vraiment trop compliqué”, “il n’y a pas mieux ?”** Ensuite, parcourez patiemment les publications et les commentaires, en vous concentrant sur deux types d’informations.

Le premier type, ce sont les problèmes qui reviennent sans cesse depuis longtemps. Par exemple, dans les espaces liés à la recherche d’emploi, on voit régulièrement des gens demander comment écrire un CV, préparer sa présentation, ou relancer après un entretien ; dans les groupes de parents, les questions reviennent sans cesse autour des repas de bébé, de l’organisation des horaires ou de la communication avec les enfants ; dans les communautés de petits commerçants, tout le monde s’inquiète en permanence de la gestion des stocks, des flux de trésorerie ou des plannings du personnel. Ces problèmes répétés de longue date sont des douleurs systémiques qu’un secteur expose encore et encore.

Le second type, ce sont les situations où les utilisateurs s’en sortent avec des moyens très maladroits. Par exemple, certaines personnes écrivent toutes leurs tâches sur papier puis prennent une photo pour l’envoyer dans le cloud ; d’autres copient-colle sans cesse d’une application à l’autre juste pour transformer un contenu d’un format à un autre ; d’autres encore rassemblent manuellement les données de plusieurs canaux dans un seul tableau. Dans ces cas-là, si vous observez bien, vous trouverez beaucoup de petites failles susceptibles d’être rendues plus systématiques, plus outillées et plus simples.

Explorer les besoins dans l’espace public, c’est en fait entraîner une capacité : passer du rôle de simple observateur à celui de capteur. Quand vous vous habituez à chercher ces mots-clés, à noter les cas, votre cerveau accumule peu à peu une sensibilité aux vrais problèmes, et cette sensibilité vous aide ensuite à chaque étape de la conception produit.

### Se tenir sur les épaules des géants

Une autre source d’idées souvent négligée, ce sont les produits et projets existants. Le monde a déjà produit énormément de personnes très compétentes qui ont exploré des chemins pour nous. Vous n’êtes pas obligé de repartir de zéro à chaque fois ; vous pouvez vous placer à l’endroit où d’autres sont déjà arrivés, puis faire un pas de plus.

Les **hackathons, concours d’innovation produit et startup demo days** font souvent apparaître beaucoup de petits projets intéressants. Ils ont généralement deux caractéristiques : peu de temps et peu de ressources. Cela ressemble justement à votre situation si vous voulez lancer une petite application. Quand vous regardez ces projets récompensés, posez-vous deux questions : si ce produit ne servait qu’un segment encore plus étroit, serait-il plus facile à faire décoller ? Si on coupait la moitié, voire les deux tiers des fonctionnalités pour ne garder que la boucle essentielle, le produit ne deviendrait-il pas au contraire plus clair ?

De la même manière, les outils listés sur les **classements produits, les projets open source et les sites de collecte d’outils** peuvent tous servir de point de départ. Choisissez-en quelques-uns qui vous intéressent et démontez-les un par un : à qui ils rendent service, quel problème ils résolvent, quelles sont les lacunes évidentes de leur forme actuelle, et ce qui changerait s’ils étaient déplacés dans un autre contexte ou un autre pays. Il ne s’agit pas de copier, mais de vous entraîner à comprendre la relation entre problème et solution.

Le monde hors ligne fonctionne de la même manière. Quand vous faites la queue pour vous inscrire à l’hôpital, attendez un table au restaurant, remplissez plusieurs fois les mêmes champs dans une administration, ou réécrivez encore et encore les mêmes informations sur des formulaires papier, arrêtez-vous un instant et demandez-vous : y a-t-il ici de la place pour **la systématisation, la numérisation et l’automatisation** ? Les situations chaotiques, répétitives et peu efficaces sont souvent le terreau où poussent les outils de demain.

Si vous continuez longtemps à miner ces quatre sources, vous découvrirez que les idées ne sont pas des miracles qui tombent du ciel. Ce sont des sous-produits d’une interaction de longue durée avec la vie, avec les autres et avec le monde de l’information.

## 1.5 Résumer une bonne idée en une phrase : l’art du moins pour plus

Une fois que vous savez d’où viennent les idées, l’exercice suivant est **d’essayer d’expliquer votre idée en une seule phrase**. Cela paraît simple, mais c’est en réalité très strict, car cela vous oblige à affronter une vérité : **votre idée a-t-elle réellement un noyau clair ?**

Les gens retiennent rarement quelqu’un parce qu’il sait tout faire. Ils retiennent plutôt une caractéristique nette : un style reconnaissable, une manière de parler stable, ou une phrase clé dans les discussions. Les produits fonctionnent pareil. **Mieux vaut qu’une personne garde une impression simple et claire de vous que d’essayer de lui faire retenir dix fonctionnalités.**

Une erreur fréquente quand on écrit cette phrase est d’être trop large. Par exemple : “C’est une application qui aide les utilisateurs à améliorer leur anglais.” C’est juste, mais cela ne dit presque rien. Pour qui : débutants, étudiants, professionnels ? Comment : vocabulaire, compréhension orale, expression, correction écrite ? Quel effort faut-il fournir et quel changement peut-on attendre ? L’information essentielle se dilue.

Une meilleure version est beaucoup plus précise. Par exemple : “Une application de vocabulaire qui aide les personnes qui prennent le métro à mémoriser 100 mots essentiels en un mois avec 10 minutes par jour.” Là, on dit déjà trois choses importantes : le coût d’utilisation est contrôlable (10 minutes par jour), le résultat attendu est visible (100 mots en un mois) et le scénario est clair (le temps de trajet). L’utilisateur peut rapidement juger si cela lui convient.

Cet exercice de la phrase unique vous oblige en réalité à répondre sans cesse à trois questions : **qui vous aidez exactement, dans quel scénario vous voulez qu’on pense à vous, et quel résultat vous apportez dans quel délai.** Ce n’est qu’en acceptant de combiner ces détails, même au prix d’un style moins spectaculaire, que votre idée devient compréhensible et partageable.

Vous pouvez aussi appliquer cet entraînement à votre propre avenir. Essayez d’écrire une seule phrase sur vos trois prochaines années : qui vous servez principalement, quel type de problème vous résolvez, et quels résultats visibles vous avez produits. Cela aide à prendre de meilleures décisions : ce qu’il faut absolument garder, et ce qu’il est possible de lâcher. Savoir renoncer est souvent plus difficile, mais aussi plus juste, que savoir ajouter.

Si vous ne savez pas où apprendre ce style, c’est très simple : lisez les textes qui se battent chaque jour pour capter l’attention des utilisateurs. Regardez les **descriptions d’une ligne dans les stores, les gros titres des pages d’accueil d’outils ou de jeux, et le texte principal des landing pages**. Recopiez-les, analysez leur structure, puis demandez à l’IA de rédiger une version pour votre propre idée.

## 1.6 Utiliser l’IA pour faire diverger la réflexion et trouver une différenciation

Autrefois, l’idéation reposait surtout sur la réflexion personnelle. Avec l’IA, vous disposez en pratique d’un partenaire de brainstorming disponible à la demande. Bien utilisée, elle peut élargir énormément votre espace d’idées.

Quand vous êtes bloqué et que vous tournez toujours autour des mêmes quelques pensées, décrivez votre idée actuelle à l’IA le plus clairement possible, puis demandez-lui de vous aider sur des tâches précises. Par exemple : **pour la même tâche centrale, listez 20 groupes d’utilisateurs différents** ; ou bien reformulez le cas d’usage pour des étudiants, des freelances, des parents et des petits commerçants ; ou encore demandez à l’IA de répondre depuis les points de vue produit, opérations, marketing et technique.

Vous verrez apparaître des scénarios auxquels vous n’auriez pas pensé seul. Votre tâche n’est pas d’accepter tout cela, mais de choisir **la petite zone sur laquelle vous avez une meilleure compréhension et un meilleur avantage de ressources**. Par exemple, l’IA peut lister beaucoup de secteurs, mais si vous vous sentez le plus proche des contextes éducation et création de contenu, alors vous devez approfondir en priorité dans ces directions.

Autre principe important : **une idée commune n’est pas forcément une idée invalide.** Beaucoup de débutants essaient d’éviter tout ce qui est “déjà connu”, en pensant que si d’autres l’ont fait, il n’y a plus de chance. En réalité, c’est plus subtil. Les outils de vocabulaire, les applications de tâches, la comptabilité légère et le suivi d’habitudes restent populaires parce que les problèmes de fond sont réels et persistants. Dans ces espaces-là, la compétition n’est souvent pas de trouver “une idée complètement neuve”, mais **de mieux comprendre un sous-groupe précis et d’exécuter les détails plus proches de sa vraie vie**.

Vous pouvez d’abord lister des idées de débutant classiques, comme un aide-vocabulaire, une application de check-in quotidien, un assistant de prise de notes de lecture, un générateur de CV et un outil d’habitude. Puis, pour chacune, faites un découpage avec l’IA et posez-vous trois questions :

- Si je ne m’adresse qu’à un groupe très précis (par exemple des designers, des juristes, des jeunes mères, des étudiants de master), à quoi cette idée ressemblera-t-elle différemment ?
- Si je ne cible qu’un scénario fixe (trajet, pause déjeuner de 10 minutes, 30 minutes avant de dormir), est-ce que la fonction et la présentation peuvent devenir plus focalisées ?
- Si j’optimise à l’extrême la manière dont le résultat est livré (plus facile à partager, à imprimer, ou à importer dans d’autres systèmes), est-ce que cela suffit déjà à créer une différenciation ?

La valeur de l’IA ici n’est pas de remplacer votre décision, mais de transformer un chemin étroit en carte plus large. Vous pouvez voir rapidement là où d’autres sont déjà fortement installés, et quels coins restent relativement ouverts. Mais le choix final revient toujours à une vieille question : où vous vous sentez vraiment concerné, vraiment compétent, et prêt à investir sur le long terme ?

Rappel essentiel : toute discussion sur les idées et la créativité doit finir par revenir aux besoins utilisateurs. L’IA peut accélérer la génération de variations, mais après autant de tours de brainstorming que nécessaire, le critère final reste le même : est-ce que cette idée répond vraiment à une douleur réelle pour un groupe précis, et est-ce qu’elle fait avancer d’un pas un problème qu’ils essaient déjà de résoudre en boucle ?

## Résumé

Utilisez des dimensions simples pour vérifier si une idée est suffisamment claire. Distinguez ce que vous trouvez cool de ce dont les utilisateurs ont réellement besoin. Comprenez que les bonnes idées le sont parce qu’elles touchent très tôt une vraie douleur. Apprenez à creuser en continu dans votre vie, dans les groupes que vous pouvez atteindre, dans l’espace public et dans les produits existants. Entraînez-vous à résumer votre idée en une phrase. Faites de l’IA un partenaire pour élargir la réflexion, pas un outil pour remplacer le jugement.

Quand vous avez déjà une à trois idées de ce type et que vous pouvez **les décrire chacune en une phrase** (qui elle sert, dans quel contexte, avec quel résultat attendu), arrêtez de courir après de nouvelles idées et concentrez-vous sur l’étape suivante : comment en découper une pour en faire un produit réellement constructible et réellement utilisable par de vrais utilisateurs.

Et si l’idée est encore brute ? C’est parfaitement normal. **Être brouillon au début, c’est normal.** L’important, c’est de commencer. Un projet n’a pas besoin d’être parfait pour exister.

## 📚 Assignments

<StageAssignmentCard title="Trouver trois idées qui méritent d’être explorées">

Veuillez réaliser les exercices suivants à partir du contenu ci-dessus :

1. En partant de vos centres d’intérêt, utilisez l’IA pour générer plusieurs « idées » d’application.
2. Demandez à l’IA d’évaluer, pour chacune de vos idées, s’il s’agit d’un vrai besoin ou d’un faux besoin, puis de donner des insights et des suggestions sur les besoins utilisateurs.
3. Choisissez une ou deux sources parmi les quatre grandes sources, ou demandez à l’IA de générer plusieurs idées d’application.
4. Parmi toutes ces Idea, choisissez vos trois idées préférées et essayez de les résumer chacune en une phrase riche en information.

# 2. Une fois l’idée trouvée, comment la découper en application réalisable ?

Dans le chapitre précédent, nous avons résolu une question de départ : quel type d’idée mérite vraiment d’être pris au sérieux.

Le vrai défi commence ici. Beaucoup de gens tombent précisément à cette étape : dans leur tête, ils ont un plan qui semble complet, mais dès qu’il faut passer à l’action, tout paraît trop complexe pour commencer. Trop de fonctionnalités, trop de pages, une technologie qui semble intimidante ; on repousse alors sans cesse, jusqu’à transformer le projet en une phrase d’**auto-réconfort** :

> « Ce n’est pas grave, je le ferai peut-être plus tard... »

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image5.png)

N’y pensez plus : c’est maintenant qu’il faut commencer. Ce chapitre va vous aider à apprendre une méthode pour passer d’une idée à une version réalisable. Vous verrez que créer quelque chose à partir de rien ne dépend pas du génie, mais d’une série d’actions concrètes que l’on peut pratiquer encore et encore : **diverger, converger, découper, affiner, s’inspirer, questionner**. En suivant cet ordre, même sans équipe et sans beaucoup de temps, vous pouvez transformer une idée en demo d’application qui fonctionne.

</StageAssignmentCard>

## 2.1 De l’idée à la solution : le modèle du double diamant, de la divergence à la convergence

Une fois que vous avez appris à dessiner des pages et à proposer des idées, vous allez vite rencontrer un autre problème courant : les idées deviennent de plus en plus nombreuses. Vous écrivez sur un tableau blanc toutes sortes de scénarios et de fonctionnalités, vous remplissez le papier de versions différentes de pages ; cela donne une impression d’avancement, mais au moment de construire réellement, cela devient plus difficile. Tout semble important, tout semble mériter un essai.

C’est là qu’un cadre de réflexion classique et très facile à comprendre devient utile : le modèle du double diamant. Son sens est assez simple : dans beaucoup d’étapes de la vie comme du produit, il faut d’abord diverger, puis converger, au lieu de vouloir tout terminer d’un seul coup dès le début.

### Qu’est-ce que le modèle du double diamant ?

Le double diamant est un cadre de processus d’innovation et de design proposé par le Design Council britannique. Il décrit l’ensemble du processus comme deux losanges reliés : le premier diamant va de la « découverte du problème » à la « définition claire du problème ». Il insiste sur l’exploration large, la recherche et la compréhension des utilisateurs, puis sur la convergence vers le vrai problème central à résoudre. Le second diamant va du « développement de solutions » à la « livraison de la solution finale ». Il commence par l’exploration audacieuse de pistes possibles et de prototypes, puis converge par sélection, filtrage et affinage vers l’option la plus faisable.

Le cœur du modèle est que les deux phases, problème et solution, doivent passer par un mouvement **divergence -> convergence**. Cela évite de sauter trop vite vers une solution et augmente la qualité ainsi que les chances de réussite de l’innovation.

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image6.png)

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image7.png)

### Premier diamant : comprendre le problème, diverger d’un point vers l’ensemble puis converger

**Dans le modèle du double diamant, le premier diamant porte sur le problème lui-même.** Vous partez d’une perception floue, vous faites émerger progressivement davantage de situations et de possibilités liées, puis vous convergeez une première fois pour trouver le point de problème qui mérite réellement d’être résolu.

Pour votre application, cela se traduit par quelques actions.

**Dans la phase de divergence, listez autant que possible les scénarios d’usage, les obstacles et les résultats attendus par les utilisateurs.** Ne jugez pas trop tôt ; étalez d’abord tout ce qui vous vient à l’esprit. Pour une application de traitement de documents, vous pouvez par exemple lister des usages dans les transports, avant une réunion, avant de rédiger un rapport ou pendant une rétrospective. Vous pouvez lister les peurs : un résumé inexact, une structure désordonnée, des points clés manqués. Vous pouvez aussi lister les attentes : comprendre plus vite ce qu’un article veut dire, trouver rapidement les parties qui concernent l’utilisateur.

**Dans la phase de convergence, forcez-vous à choisir seulement les une ou deux situations les plus fréquentes et les plus douloureuses.** Supposons que, parmi de nombreux scénarios, vous découvriez que le problème le plus souvent mentionné est celui-ci : lorsqu’un utilisateur reçoit un long document de travail, il veut d’abord comprendre ce que ce document essaie de dire et quelles en sont les conclusions principales. Dans ce cas, l’objectif de la première version peut devenir : aider l’utilisateur à comprendre en cinq minutes le sens central d’un long texte, au lieu de résoudre tous les problèmes liés aux documents.

À la fin du premier diamant, vous devez être beaucoup plus clair qu’au départ : **quel problème vous voulez vraiment résoudre, et pourquoi sa priorité est plus élevée que celle des problèmes voisins.**

### Second diamant : concevoir la solution, de l’idée brute au plan exécutable

**La deuxième partie du double diamant concerne la naissance de la solution.** Vous savez déjà à peu près quel problème résoudre ; l’étape suivante consiste à imaginer autant de façons que possible de le résoudre, puis à choisir celle qui convient le mieux à la première version.

Dans cette phase de divergence, il s’agit d’ajouter des idées : fonctionnalités, scénarios plus précis, formes d’interaction possibles. Pour un outil de résumé de longs textes, vous pouvez imaginer plusieurs niveaux de résumé, différentes formes de restitution, une lecture audio, la possibilité de marquer des passages importants, ou plusieurs styles de résumé. À ce stade, il n’est pas nécessaire de décider ; il faut surtout ouvrir le champ des possibles.

Dans la phase de convergence, utilisez un outil d’évaluation simple mais très pratique : valeur utilisateur × faisabilité × coût en temps. Donnez à chaque idée une note approximative sur ces trois dimensions, par exemple de 1 à 5, puis choisissez en priorité les idées qui ont un bon score global et un coût temporel contrôlable pour composer le MVP, c’est-à-dire la version minimale viable.

Par exemple, la lecture audio peut avoir une valeur utilisateur correcte, mais son intégration technique et front-end peut coûter plus cher en temps. Un résumé texte simple et l’extraction des points clés offrent une valeur tout aussi visible, avec une faisabilité plus élevée et un coût plus faible : c’est donc plus adapté à une première version.

Pendant tout ce processus, rappelez-vous une chose : **l’objectif de la première version n’est pas de créer une application parfaite, mais une version réelle que quelqu’un peut vraiment utiliser.** Elle n’a pas besoin de tout couvrir ; il suffit qu’elle fonctionne correctement sur une tâche précise.

Vous pouvez aussi fixer une limite temporelle au second diamant. Par exemple : livrer une version utilisable en un mois. Dans toutes les idées divergentes, celles qui demandent plusieurs mois peuvent alors être placées dans une liste « plus tard ». Ainsi, vous évitez d’être bloqué dès le début par l’envie de trop faire.

Quand vous prenez l’habitude d’utiliser le double diamant pour organiser vos idées, beaucoup de situations confuses deviennent plus nettes. Vous savez à quel moment il faut penser large, et à quel moment il faut couper avec décision. Vous arrêtez de vouloir tout résoudre d’un coup et vous apprenez à alterner entre divergence et convergence.

## 2.2 Obtenir des étapes exécutables : apprendre à passer de l’abstrait au concret

Après avoir fait diverger les idées, obtenir des idées est relativement simple ; obtenir des étapes exécutables est beaucoup plus difficile. Dire « je veux faire un outil qui améliore l’efficacité » ou « je veux faire une application pour les créateurs » semble ambitieux, mais cela aide très peu au moment d’agir. Au quotidien, vous faites face à des questions très concrètes : **quelle petite partie faut-il construire en premier, quelles pages sont nécessaires**, faut-il prendre en charge l’inscription, faut-il intégrer le paiement.

La capacité nécessaire ici s’appelle **découper et affiner pour transformer l’abstrait en concret**. Il s’agit de transformer un objectif vaste et flou, étape par étape, en éléments d’action minimaux que l’on peut exécuter immédiatement. Cette capacité est importante pour construire un produit, mais elle l’est aussi dans la vie.

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image8.png)

### Commencer par un exemple de vie : que signifie vraiment « j’ai envie de manger un burger » ?

Ne parlons pas encore d’application. Revenons à une phrase très simple de la vie quotidienne : « j’ai envie de manger un burger ». À première vue, ce n’est pas compliqué. Mais si vous la découpez sérieusement, vous découvrirez beaucoup de branches concrètes.

D’abord, il y a **la motivation et le besoin intérieur central**. Avez-vous vraiment envie du goût d’un burger ? Voulez-vous simplement régler rapidement un repas ? Voulez-vous passer un moment avec des amis ? Ou réagissez-vous seulement à une belle photo vue en ligne ? Cela semble anodin, mais cela influence directement les choix suivants. Si l’objectif est de voir des amis, l’environnement et l’expérience comptent. Si vous êtes pressé, la vitesse peut compter davantage que le goût.

Ensuite vient **le périmètre de l’action**. Quel type de burger voulez-vous ? À quelle heure ? Voulez-vous seulement le burger, ou un menu avec boisson, frites et dessert ? Si vous avez quelque chose à faire plus tard et que vous ne voulez pas trop manger, le choix change. Vous pouvez même vous demander s’il faut résoudre en même temps le petit-déjeuner de demain, par exemple en emportant un burger simple en plus.

Puis vient **la manière de réaliser cela**. Est-ce que le burger doit être mangé sur place, peut-il être livré, ou êtes-vous prêt à le faire vous-même à la maison ? Chaque choix correspond à une chaîne d’actions totalement différente. Manger sur place implique de chercher un lieu, vérifier les horaires, organiser le trajet. Commander implique de regarder la plateforme, comparer prix et délais. Le faire soi-même implique des ingrédients, des outils et une recette.

Une fois tout cela clarifié, la phrase floue « j’ai envie de manger un burger » devient une suite d’actions concrètes : ouvrir une application de livraison, chercher un restaurant déjà apprécié, choisir un menu, enlever la boisson, garder burger et frites, ajouter une note sans sauce, puis passer commande. Ces actions sont petites, mais immédiatement exécutables ; elles peuvent même être transformées par une IA en plan procédural.

**C’est le sens du découpage et de l’affinage : passer d’un souhait vaste et abstrait à une liste que l’on peut exécuter concrètement.**

### Exemple d’application : par où commencer pour améliorer l’efficacité du traitement de documents ?

Prenons maintenant un exemple plus complexe. Supposons que vous ayez un souhait qui semble raisonnable : « je veux faire une application qui améliore l’efficacité du traitement de documents ». La direction est bonne, mais si vous vous arrêtez à cette demi-phrase, vous ne savez presque pas par où commencer. Vous ne savez pas quelle page dessiner en premier, jusqu’où doit aller la première version, ni comment expliquer l’idée à quelqu’un.

Vous pouvez alors reprendre la méthode de découpage précédente et la rendre plus concrète étape par étape. Pour des raisons de temps, nous ne montrons ici que deux niveaux de découpage.

#### Premier niveau de découpage et d’affinage

**D’abord, vous devez définir ce qu’est un « document ».** Le mot est très large : il peut désigner un tableur, un rapport Word, un fichier PDF, un texte Markdown avec des notes de code, un fichier TXT, voire un document scanné sous forme d’image ou un article académique avec graphiques et formules. Chaque type de document implique des différences d’implémentation. Si le document est une image, il faudra peut-être d’abord ajouter de l’OCR. Si c’est un tableur, le besoin central sera plutôt l’extraction et l’analyse de données, et non une simple réduction de texte.

**Ensuite, vous devez définir ce que signifie « traiter ». Traiter en quoi, et avec quelle méthode ?** Pour certains, traiter signifie réduire un rapport de 50 pages en un résumé lisible de 5 pages. Pour d’autres, cela signifie normaliser des fichiers Word, PDF et Markdown désordonnés dans un modèle commun. D’autres encore s’intéressent à la traduction, à la réécriture et au polissage pour transformer un brouillon passable en version publiable. Posez-vous directement la question : dans mon cas, « traiter » veut-il dire « lire plus vite », « mieux modifier » ou « transmettre plus facilement » ? Selon la réponse, la page d’entrée et la page d’opération seront totalement différentes.

**Le mot « application » doit aussi être défini.** Est-ce un petit outil pour vous seul, ou un produit destiné à un groupe d’utilisateurs ? Une application web, une application mobile, ou une fonction intégrée dans un système existant ? Si vous voulez seulement l’utiliser sur votre ordinateur, une page web rudimentaire ou un script en ligne de commande peut coûter beaucoup moins cher. Si vous voulez que des collègues l’utilisent ensemble, il faudra peut-être réfléchir aux comptes, aux permissions et à la collaboration. À ce stade, il suffit de répondre à une phrase simple : sur quel appareil, et dans quel scénario, vais-je utiliser cela ?

Revenons ensuite à la phrase elle-même : « améliorer l’efficacité du traitement de documents ». Il faut aussi découper les mots clés. **« Avec quoi améliorer » ?** Faut-il forcément utiliser l’IA ? Pas nécessairement. Certaines améliorations d’efficacité peuvent être résolues par des règles, des modèles ou des raccourcis : générer en un clic une couverture de rapport standard, insérer automatiquement une mention légale, appliquer une structure fixe. Ces besoins n’ont peut-être pas besoin de modèle. En revanche, si vous faites face à beaucoup de textes longs non structurés qu’il faut comprendre, résumer ou réécrire, l’IA devient naturellement pertinente.

Le mot « efficacité » mérite lui aussi d’être découpé. **L’efficacité signifie-t-elle seulement la vitesse, ou inclut-elle aussi la qualité, le taux d’erreur et la difficulté de compréhension ?** Lire les points clés d’un document de 20 pages en 5 minutes au lieu de 30, c’est de la vitesse. Repérer rapidement une contradiction logique ou un conflit de données, c’est de la qualité. Aider quelqu’un qui ne connaît pas le jargon professionnel à comprendre un rapport grâce à des annotations, c’est abaisser le seuil cognitif. Demandez-vous : si cette application réussit très bien, quel est le plus grand changement pour l’utilisateur ? « Il passe deux fois moins de temps sur les documents » ou « il se sent moins épuisé lorsqu’il travaille avec des documents » ? Une réponse claire donne une base aux priorités de fonctionnalités.

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image9.png)

#### Deuxième niveau de découpage et d’affinage

Supposons que le premier niveau nous donne ce résultat : « je veux faire une application web qui utilise l’IA pour améliorer la vitesse et la qualité de conversion de PDF en texte ». C’est déjà beaucoup plus précis que « améliorer l’efficacité du traitement de documents » : le type de document est défini (PDF), la méthode de traitement aussi (conversion en texte), la direction d’optimisation également (vitesse et qualité), ainsi que la voie technique (IA) et le support (application web).

Mais cette phrase reste un objectif intermédiaire, pas encore un vrai plan produit exécutable. Beaucoup d’informations clés restent générales : **quelle IA utiliser, quel niveau d’amélioration viser, quels scénarios adapter, quels utilisateurs servir**. Il faut donc continuer à descendre et transformer cette phrase en décisions de design et en choix techniques plus fins.

Commençons par « IA ». S’agit-il d’un modèle OCR léger uniquement chargé de reconnaître le texte, ou faut-il introduire un LLM, voire un modèle multimodal, pour corriger les erreurs, reconstruire la mise en page, réorganiser le contenu et comprendre la structure ? Ces choix produisent des conséquences très différentes :

- Coût : calcul, appels API, latence d’inférence, investissement ponctuel ou coût continu.
- Difficulté de développement : simple intégration d’une API OCR ou conception de prompts, gestion du contexte, voire système d’entraînement et d’évaluation.
- Forme produit et stratégie de lancement : petit outil d’extraction rapide de texte ou plateforme intelligente capable de restituer plans, tableaux et hiérarchies de titres.

Vient ensuite **le découpage du « document PDF ». Quel type de PDF voulez-vous vraiment prendre en charge ?** Si vous limitez le périmètre aux PDF textuels, principalement composés de texte copiable, vous n’avez pas besoin de traiter dès le départ les scans, les graphiques complexes, les formules ou les mises en page extrêmes. À l’inverse, si vous promettez que « n’importe quel PDF » peut être envoyé, vous devez résoudre dès le début l’OCR des PDF image, la reconstruction de mise en page, l’extraction de tableaux et la gestion texte-image, ce qui multiplie la complexité.

À ce niveau, faites volontairement un rétrécissement et écrivez clairement les compromis. Par exemple : la version actuelle sert principalement les rapports et documents explicatifs PDF à structure claire et majoritairement textuels ; elle ne garantit pas le résultat pour les scans et les documents très mixtes en images et texte. Ainsi, tous les objectifs de vitesse et de qualité reposent sur des conditions contrôlables et explicables, et vous pouvez mieux gérer les attentes des utilisateurs.

Puis regardons « convertir en texte de haute qualité ». Ici, la qualité peut se diviser au moins en trois dimensions :

1. **La reconnaissance est-elle globalement correcte ?** Quel est le taux d’erreur sur les mots, la ponctuation et les symboles spéciaux ? Y a-t-il des blocs de texte illisibles ?
2. **Les paragraphes et la structure des titres sont-ils conservés ?** Les niveaux de chapitres, séparations de paragraphes, listes et citations sont-ils autant que possible restitués en texte brut ?
3. **Le résultat est-il facile à modifier et à réutiliser ?** Le texte généré est-il propre, le format régulier, et l’utilisateur doit-il faire beaucoup de nettoyage manuel avant de copier dans Word, Notion ou un éditeur de code ?

**Choisissez d’abord les deux ou trois éléments qui comptent le plus pour vous comme direction principale de la qualité.** Par exemple : garantir en priorité une structure de paragraphes claire et une hiérarchie de titres de base, tout en acceptant quelques erreurs de reconnaissance que l’utilisateur peut corriger en quelques minutes. Ainsi, « haute qualité » cesse d’être un adjectif vide et devient un standard que l’on peut écrire et mesurer.

Regardons enfin la « vitesse ». Si votre objectif parle d’améliorer la vitesse et la qualité, alors « rapide » doit être défini par **un ordre de grandeur perceptible**, et non seulement par une impression. Le compromis caché est important :

- voulez-vous prendre en charge de très longs documents, quitte à faire attendre l’utilisateur ?
- ou voulez-vous cibler les documents courts et moyens, avec une limite de pages, et livrer le résultat en quelques secondes ou dizaines de secondes ?

Si le scénario typique est de convertir rapidement un rapport, une proposition ou un résumé de recherche d’une dizaine de pages avant une réunion, le choix naturel est :

- fixer une limite raisonnable par document, par exemple « PDF textuel de moins de 20 pages » ;
- donner un indicateur de délai, par exemple « traitement généralement terminé en environ 10 secondes ».

Une fois ces deux points écrits, les choix techniques (traitement parallèle, file asynchrone), la microcopie d’interface (temps estimé, message d’expiration) et la gestion des attentes peuvent tous s’optimiser autour de l’expérience « documents courts à moyens + retour rapide ».

**Enfin, l’« application web » elle-même doit être resserrée.** Ce n’est pas seulement un choix de support. Demandez-vous : est-ce plutôt un outil temporaire pour vous et un petit groupe interne, ou dès le départ un service en ligne stable pour des utilisateurs réels ?

Si c’est le premier cas, vous pouvez couper beaucoup de complexité : pas besoin d’un système complet de comptes et de permissions, pas besoin d’historique de tâches, de gestion de projets ou de collaboration d’équipe dans la première version. Concentrez-vous sur un flux minimal :

**ouvrir la page -> téléverser le PDF -> attendre le traitement -> afficher le texte modifiable -> copier ou télécharger en un clic**.

Si l’objectif est un service public stable, les versions suivantes devront progressivement considérer la concurrence, les files de traitement, les quotas, la récupération d’erreurs, les logs, la supervision, la sécurité et les permissions. Mais à ce stade de découpage, vous pouvez le définir comme un « petit outil dans le navigateur, utilisable sans connexion » et concentrer toute l’interaction sur le chemin le plus simple.

Lorsque les compromis derrière les mots clés « IA », « PDF », « conversion de haute qualité », « vitesse » et « application web » sont exprimés plus concrètement, la phrase initiale peut se resserrer en une description plus claire et plus exécutable :

> Fournir aux utilisateurs un petit outil basé sur le navigateur, qui prend en charge en priorité les rapports PDF à structure claire et majoritairement textuels. Grâce à un flux d’analyse adapté et à un nettoyage IA léger, il produit en environ 10 secondes un texte modifiable, avec paragraphes clairs, hiérarchie de titres globalement préservée et taux d’erreur acceptable, sans connexion requise.

Après simplification, cela peut devenir :

> Fournir un outil web où l’utilisateur téléverse un PDF textuel de moins de 20 pages et reçoit en environ 10 secondes un texte modifiable avec structure de paragraphes claire, titres préservés, copie en un clic et téléchargement en `.txt`.

Ce type de description n’est plus un slogan vide. Il peut devenir directement un prompt, une instruction de plan pour une IA de développement, un brief pour designer ou un document d’évaluation rapide pour un ingénieur.

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image10.png)

À ce stade, deux changements très concrets apparaissent. Premièrement, vous n’êtes plus écrasé par la phrase « je veux faire une application d’efficacité » ; vous avez des étapes sur lesquelles agir immédiatement. Deuxièmement, le coût de communication avec les autres baisse fortement, car vous disposez d’une première solution déjà assez précise.

Passer de l’abstrait au concret, c’est transformer un grand souhait en une liste de tâches que n’importe qui, y compris une IA, peut comprendre et commencer à exécuter. Une fois les problèmes décomposés jusqu’à un niveau atomique, il ne reste en pratique que deux options pour chaque sous-problème :

1. Je résous et j’exécute ce sous-problème.
2. Une IA ou un autre expert résout et exécute ce sous-problème.

## 2.3 Imaginer votre application sur un tableau blanc : dessiner la première application

Quand beaucoup de gens pensent à commencer une application, les premiers mots qui surgissent sont code, backend, base de données, API et framework. Ce n’est pas surprenant : on nous a longtemps inculqué que construire une application est d’abord un problème technique. Mais si vous mettez toute votre attention sur la technologie dès le départ, vous risquez d’oublier l’essentiel : **qu’est-ce que l’utilisateur vient vraiment faire chez vous ?**

Une pratique très simple, mais souvent négligée, consiste à dessiner d’abord. Vous n’avez pas besoin d’un logiciel professionnel : un tableau blanc, une feuille de papier ou une application de notes suffisent. L’important est de dessiner le parcours complet de l’utilisateur, de son arrivée à sa sortie, avec quelques croquis de pages simples, au lieu d’ouvrir directement l’éditeur pour coder.

Vous pouvez d’abord diviser l’application en trois types de pages : page d’entrée, page d’opération, page de résultat.

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image11.png)

### Page d’entrée : par où l’utilisateur arrive et ce qu’il voit au premier regard

La page d’entrée est le premier contact entre l’utilisateur et votre application. Beaucoup de gens conçoivent au début une page d’accueil générique remplie de boutons, de modules et d’espaces de promotion, comme si cela rendait le produit plus riche et plus impressionnant. Mais si vous dessinez cette page sur papier, que vous l’accrochez au mur et que vous faites semblant d’être un visiteur pour la première fois, une question très réelle apparaît : **où dois-je cliquer d’abord ?**

Quand vous dessinez la page d’entrée, pensez comme un guide. Posez des questions concrètes : comment l’utilisateur arrive-t-il ici ? En cliquant sur un lien partagé, en cherchant dans un store, en scannant un QR code ? Chaque source crée des attentes différentes. Un utilisateur qui vient par un lien envoyé par un ami sait peut-être déjà à peu près ce que vous faites ; la page peut alors aller directement à l’essai de la fonction centrale. Un utilisateur venu du store ne sait peut-être rien ; la page doit donc l’aider, en une phrase, à comprendre à quoi sert l’application et comment commencer.

Concrètement, dessinez un cadre de téléphone sur papier, écrivez le titre en haut, puis la zone principale au centre. Notez clairement : qu’est-ce que cette page doit dire à l’utilisateur, et quel choix souhaitez-vous qu’il fasse ici ? Cliquer sur un gros bouton de démarrage, regarder un exemple de résultat, ou remplir une information de base ?

Plus la page de départ est simple et concrète, plus l’utilisateur qui arrive a de chances de ne pas se perdre et de commencer rapidement.

### Page d’opération : ce que l’utilisateur doit saisir, cliquer ou choisir

Une fois que l’utilisateur décide de continuer, il arrive sur la page d’opération, c’est-à-dire la zone de travail de l’application. C’est là que l’interaction réelle se produit, et c’est aussi l’endroit le plus souvent surchargé.

Un exercice très efficace consiste à **n’autoriser l’utilisateur à faire qu’une seule chose**. Écrivez cette chose sur papier dans sa forme la plus simple : soumettre un texte, enregistrer une idée par la voix, choisir un modèle, configurer un paramètre. Puis construisez autour en réduisant au maximum les entrées et les boutons.

Pour une application de résumé automatique de longs textes, la page d’opération la plus grossière mais fonctionnelle peut se limiter à quelques éléments : un champ pour coller le texte, une option de longueur de résumé, un bouton de génération. Vous pouvez ignorer d’abord les détails visuels comme les polices, couleurs et icônes, pour vous concentrer sur : **l’utilisateur sait-il immédiatement quoi faire, de quoi a-t-il besoin, et risque-t-il de se perdre au milieu ?**

Le bénéfice du croquis papier est de pouvoir tester plusieurs versions à coût très faible. Vous pouvez dessiner une version avec toutes les entrées sur une seule page, puis une version en deux petites étapes, et les rejouer mentalement : laquelle bloque le moins ? Par rapport à modifier un flux déjà codé, ce type d’ajustement sur papier coûte presque rien.

### Page de résultat : ce que l’utilisateur obtient et comment l’afficher

Beaucoup d’applications traitent la page de résultat comme un détail. Le développeur pense souvent : le résultat n’est qu’un texte, une image ou une suite de données, il suffit de l’afficher. Pour l’utilisateur, c’est l’inverse. S’il a accepté de saisir, d’attendre et d’essayer, c’est précisément parce qu’il espère voir sur cette page quelque chose de clair et utile.

Quand vous dessinez la page de résultat, partez de ces questions : **quelle est l’information centrale que l’utilisateur veut vraiment voir, et doit-elle être placée à l’endroit le plus visible ?** Quels résultats doivent pouvoir être exportés, sauvegardés ou partagés, et où se trouvent ces entrées ? Faut-il ajouter une explication simple pour que l’utilisateur comprenne ce que le résultat signifie ?

Avec l’exemple du résumé de longs textes, une page de résultat plutôt agréable peut afficher en haut quelques points clés concis, puis un résumé plus détaillé, et garder en bas le lien vers le texte d’origine. À côté, deux boutons bien visibles : copier les points clés et exporter en document. Sur papier, essayez de placer ces zones et d’annoter l’action prévue pour chaque bouton.

Quand les pages d’entrée, d’opération et de résultat sont dessinées, reliez-les par des flèches et parcourez le chemin complet, de la première visite jusqu’à la fin. **Ce processus révèle beaucoup de problèmes que vous n’aviez pas vus**, par exemple : si l’utilisateur veut modifier un détail depuis la page de résultat, comment revient-il à la page d’opération ? S’il hésite sur la page d’opération, existe-t-il une sortie claire ou un brouillon sauvegardé ?

Le cœur de cette section tient en une phrase : dessinez d’abord le processus d’usage, puis seulement ensuite pensez à l’implémentation technique. Même sans savoir coder, vous pouvez **transformer une idée abstraite en prototype visible avec quelques croquis simples**. Plus cette étape est claire, plus la suite sera facile, que vous construisiez vous-même ou avec d’autres.

## 2.4 S’inspirer des applications existantes : copier intelligemment les devoirs

Quand on construit sa première application, on ressent souvent une pression psychologique : il faudrait partir de zéro, inventer soi-même la structure des pages, les interactions et la mise en page visuelle, comme si cela seul comptait comme un vrai produit. En réalité, si vous insistez trop sur ce principe, vous risquez de dépenser énormément d’énergie sur des détails peu importants.

En design d’application, une attitude plus efficace et plus mature consiste à **copier intelligemment les devoirs**. Il ne s’agit pas d’imiter aveuglément, mais d’emprunter de manière sélective des solutions déjà validées, afin de garder votre énergie pour la valeur qui vous est propre.

Il existe sur Internet beaucoup de sites qui collectent des captures d’interfaces, ainsi que de nombreuses pages de présentation dans les stores. Ces endroits sont comme un immense atlas de références. Choisissez plusieurs applications proches de votre direction, par exemple des outils similaires ou des produits destinés au même public, et analysez-les page par page.

Ce qu’il faut observer en priorité n’est pas la beauté des couleurs, mais la manière dont elles traitent plusieurs zones clés :

- comment la navigation est conçue : en bas ou en haut, plusieurs entrées centrales fixes ou un seul bouton principal ;
- comment les formulaires sont organisés : tout remplir sur une même page ou découper en petites étapes ;
- lors de l’affichage du résultat, l’information la plus importante est-elle bien mise en évidence, et les informations secondaires sont-elles bien rangées ;
- quand un nouvel utilisateur arrive pour la première fois, existe-t-il un guide court qui lui montre quoi faire ensuite ?

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image12.png)

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image13.png)

Vous pouvez consulter ces sites de captures et de références :

- [https://www.uisources.com/](https://www.uisources.com/)
- [https://screenlane.com/](https://screenlane.com/)
- [https://pagecollective.com/](https://pagecollective.com/)
- [https://patttterns.net/](https://patttterns.net/)
- [https://mobbin.com/](https://mobbin.com/)
- [https://refero.design/](https://refero.design/)
- [https://scrnshts.club/](https://scrnshts.club/)
- [https://godly.website](https://godly.website/)

En plus des applications existantes, les projets gagnants de hackathons peuvent aussi inspirer. Un hackathon est une activité de développement collaborative, limitée dans le temps et très intense, où l’on doit produire un prototype ou une solution en peu de temps. Ces projets sont des solutions livrées par des praticiens sous forte contrainte ; ils sont souvent bruts, mais montrent précisément comment compresser le passage d’une idée à un produit qui tourne. Vous pouvez les utiliser pour comprendre ce qu’est un prototype minimal. Mais comme un hackathon reste une compétition courte, la créativité peut y dépasser l’utilité réelle ; les projets gagnants ne conviennent pas toujours comme référence pour un produit de long terme. Il faut juger selon votre situation.

Vous pouvez aussi vous inspirer de sites d’outils : météo, traduction multilingue, encyclopédie de Pokémon, guides de jeux, classements de voitures populaires, annuaires d’outils IA. Ces sites ont souvent des fonctions très simples, mais ils peuvent être d’excellentes « applications » pour certaines personnes. Une idée n’a pas besoin d’être complexe ; elle doit être utile. En observant différents types d’applications, vous comprendrez mieux ce qu’est une vraie demande de marché.

## 2.5 Ne pas attendre que tout soit prêt pour enquêter sur les besoins utilisateurs

Beaucoup de gens disent vouloir faire un produit guidé par les utilisateurs, mais dans la pratique ils préfèrent s’enfermer, construire d’abord la version complète qu’ils imaginent, puis seulement trouver le courage de la montrer. **Cela semble plus présentable, au moins on ne montre pas un brouillon. Mais du point de vue produit, c’est une habitude dangereuse.**

La raison est simple : plus vous contactez les utilisateurs tard, plus vous avez déjà investi dans les détails ; si la direction est mauvaise, la perte est plus grande. Vous avez peut-être écrit beaucoup de code pour une fonction peu importante, dessiné beaucoup d’écrans pour un détail qui intéresse peu de gens, pour découvrir finalement que le vrai blocage des utilisateurs se trouve ailleurs.

Pour éviter cela, gardez en tête un principe simple : demander pendant que l’on dessine, **demander pendant que l’on construit, ne pas attendre la fin pour demander**.

### Demander pendant le dessin : commencer à collecter du feedback dès l’étape papier

Quand vous venez de dessiner, sur tableau blanc ou papier, la page d’entrée, la page d’opération et la page de résultat, vous avez déjà de quoi dialoguer avec les utilisateurs. À ce stade, trouvez deux ou trois personnes qui pourraient devenir des utilisateurs cibles, montrez-leur les croquis et écoutez leur première réaction.

Vous n’avez pas besoin d’entretien compliqué. Observez quelques détails : quand elles voient la page d’entrée, disent-elles spontanément ce que vous espériez, par exemple « ça ressemble à un outil de résumé de longs textes » ? Sur la page d’opération, suivent-elles naturellement l’ordre attendu, par exemple coller le texte puis choisir une longueur de résumé ? Sur la page de résultat, leur regard va-t-il immédiatement vers la partie que vous voulez mettre en avant, ou se perd-il dans un coin peu important ?

Ces observations révèlent les grands problèmes de design avant la première ligne de code. Vous pouvez corriger une fois le prototype papier, puis continuer, au lieu d’attendre que toute l’application soit construite pour changer la structure.

### Demander pendant la construction : inviter des personnes à tester dès la version semi-finie

Quand vous avez une version semi-finie qui permet de traverser le flux de base, il n’y a plus de raison de rester seul à l’utiliser. Même si l’interface est brute, même si beaucoup de fonctions ne sont pas encore présentes, **dès qu’elle accomplit la tâche minimale que vous avez définie, elle peut être testée par de vrais utilisateurs**.

Commencez par des personnes autour de vous, puis par celles que vous avez rencontrées via vos audiences, communautés ou espaces publics. Choisissez des gens prêts à essayer de nouveaux outils. Envoyez-leur un lien, expliquez simplement ce que la version actuelle peut faire, puis demandez-leur de parcourir le chemin de l’entrée au résultat sans trop d’explications de votre part.

**Votre rôle n’est pas de vous défendre, mais d’observer.** Où hésitent-ils ? À quelle étape s’arrêtent-ils ? Quel bouton regardent-ils longtemps sans oser cliquer ? Vous pouvez ensuite poser quelques questions précises : quelle étape a été la plus pénible, quel résultat vous a le plus satisfait, qu’est-ce que vous pensiez trouver mais que vous n’avez pas vu ?

Tester à ce stade a un avantage énorme : vous n’êtes pas encore trop attaché émotionnellement à une solution. Il devient plus facile d’accepter de couper des fonctions qui semblent cool mais que les utilisateurs ne remarquent pas, et d’améliorer de petits détails discrets mais fréquents dans l’usage réel.

### Ne pas avoir peur de montrer quelque chose de brut

Beaucoup de gens ne veulent pas montrer une version précoce par peur de paraître non professionnels. Pourtant, les personnes produit les plus mûres ont rarement honte de leurs premières versions, parce qu’elles savent qu’exposer tôt les problèmes coûte le moins cher.

Changez de perspective : vous ne montrez pas un produit inachevé, vous invitez quelqu’un à participer à son amélioration. Si vous dites clairement qu’il s’agit d’une version très précoce, et que vous cherchez des retours directs plutôt que des compliments, la plupart des personnes concernées par le problème accepteront d’aider.

À ce stade, vous avez appris à transformer une idée abstraite en parcours utilisateur concret avec un tableau blanc ou du papier ; vous savez découper un souhait large en actions minimales que l’on peut commencer demain ; vous savez qu’il ne faut pas tout mettre dans la première version, mais utiliser le double diamant pour alterner divergence et convergence jusqu’au MVP le plus pertinent ; vous savez vous inspirer intelligemment des applications existantes pour la navigation, les formulaires et les résultats ; et surtout, vous savez qu’il ne faut pas attendre que tout soit prêt pour faire entrer les utilisateurs.

Grâce à ces outils et à ces étapes, vous pouvez déjà transformer une idée en application utilisable. Mais vous verrez aussi qu’entre une application utilisable et une application vraiment agréable, il reste encore une couche à franchir.

Parlons donc maintenant de ce qu’est une bonne application, et de la manière de faire avancer votre application après une première version utilisable.

## 📚 Assignments

<StageAssignmentCard title="Transformer une idée en plan réalisable">

Veuillez réaliser les exercices suivants à partir du contenu ci-dessus :

1. Utilisez le LLM de votre choix pour demander, à partir de votre idée précédente, une divergence selon le modèle du double diamant ; sélectionnez ensuite une solution réalisable à partir des résultats.
2. À partir de l’idée précédente, utilisez la méthode de découpage et d’affinage pour obtenir une description plus exécutable, par exemple : « Fournir un outil web où l’utilisateur téléverse un PDF textuel de moins de 20 pages et reçoit en 10 secondes un texte modifiable avec structure de paragraphes claire, titres préservés, copie en un clic et téléchargement en `.txt`. »
3. À partir de l’idée affinée, essayez de dessiner votre application sur un tableau blanc. L’application doit se concentrer sur deux parties : la conception UI et les fonctionnalités nécessaires, en indiquant où se trouve chaque fonction.

# 3. Après l’avoir construite, comment juger et peaufiner une bonne application

Quand vous avez enfin construit la première version et que vous la mettez dans le monde réel entre les mains d’utilisateurs, vous entrez dans une étape totalement différente. Tout ce qui précédait restait au niveau des idées et du design ; maintenant, le produit est testé pour la première fois par de vrais scénarios d’usage. Vous verrez où les utilisateurs cliquent mal, où ils hésitent, où ils restent bloqués, mais aussi les étapes où ils avancent de manière étonnamment fluide, ou les zones où ils s’arrêtent quelques secondes de plus que prévu. Ces détails sont beaucoup plus honnêtes que toutes les idées que vous vous faites du produit.

La question centrale de ce chapitre est donc : lorsque l’application existe déjà, et qu’un premier groupe d’utilisateurs l’utilise, comment juger à quelle distance elle se trouve d’une bonne application, et comment utiliser les informations issues de l’usage réel pour la peaufiner progressivement ?

</StageAssignmentCard>

## 3.1 Qu’est-ce qu’une bonne application : 4 caractéristiques essentielles

Pour juger si une application est bonne, il ne suffit pas de regarder à quel point vous l’aimez vous-même, ni le nombre de téléchargements ou les usages sur un ou deux jours. Il faut regarder si elle possède des caractéristiques plus profondes et plus stables. On peut commencer par les points suivants.

### Une bonne application apporte une valeur concrète

La caractéristique la plus directe d’une bonne application est qu’elle apporte un bénéfice réel dans un scénario précis. Ce bénéfice n’a pas besoin d’être grandiose ni emballé dans de grands mots, mais il doit être suffisamment concret pour que vous puissiez dire clairement : **qu’a-t-elle évité à l’utilisateur, combien de temps lui a-t-elle fait gagner, ou quelle erreur rend-elle moins probable ?**

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image14.png)

Prenons un outil simple de compte rendu de réunion. S’il permet de téléverser un enregistrement, ou d’enregistrer directement pendant la réunion, puis de générer automatiquement un compte rendu structuré avec les actions à faire, les responsables et les dates limites, il ne fait pas seulement gagner du temps de frappe. Il économise l’effort mental de prise de notes, d’organisation, de filtrage et de mise en forme. Vous pouvez dire très concrètement que cet outil économise environ vingt minutes par réunion à une personne. Si toute l’équipe a dix réunions de ce type par semaine, le gain total devient considérable.

Autre exemple : un outil de compression d’images en apparence banal. S’il réduit un lot d’images au tiers de leur taille d’origine tout en gardant une différence presque invisible à l’œil nu, avec export en un clic, structure de dossiers préservée et noms de fichiers uniformisés, sa valeur ne se limite pas à économiser de l’espace disque. Il rend aussi le transfert plus rapide, l’envoi plus fluide et l’intégration avec d’autres systèmes moins sujette aux erreurs. Cette valeur concrète, même ordinaire, est souvent beaucoup plus fiable qu’un vague « gain d’efficacité ».

Donc, lorsque vous dites que votre application a de la valeur, il vaut mieux découper cette valeur en un ou deux scénarios concrets et l’expliquer avec des mots simples : combien de temps, de travail manuel ou de risque votre application enlève-t-elle à l’utilisateur ?

### L’utilisateur la prend en main facilement, presque sans lire de mode d’emploi

Une autre caractéristique sous-estimée mais extrêmement importante est que **les bonnes applications n’ont généralement pas besoin de beaucoup d’explications**. Quand un utilisateur les ouvre pour la première fois, il comprend intuitivement par où commencer, ce qui se passera s’il clique sur tel élément, et quel bouton sert à l’action principale. L’entrée importante se trouve à un endroit vraiment visible, pas dans le troisième niveau d’un menu.

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image15.png)

Imaginez un utilisateur qui vient de télécharger votre application. Il l’ouvre peut-être dans une file d’attente, dans un bus ou dans un café. Le réseau n’est pas forcément stable, et il n’a aucune patience pour lire une longue explication. Le temps de confusion qu’il accepte se compte souvent en secondes. Si, pendant ces quelques secondes, il ne voit aucun guidage clair et ne sait pas quoi faire ensuite, il risque de fermer l’application et de ne jamais revenir.

Ainsi, quand vous trouvez votre logique produit fluide, trouvez quelqu’un qui n’a jamais vu votre application et laissez-le l’explorer depuis zéro sans que vous parliez. Observez seulement où il s’arrête, où il hésite, à quel moment son visage dit « qu’est-ce que c’est ? ». Si l’utilisateur est bloqué dès l’entrée par des popups, des options complexes ou une obligation de lier un compte, il aura du mal à ressentir la valeur que vous vouliez vraiment offrir.

**La facilité de prise en main est au fond une forme de respect du coût utilisateur.** Vous reconnaissez que personne n’a l’obligation de passer du temps à étudier votre application.

### Dans les scénarios fréquents ou critiques, l’utilisateur pense naturellement à vous

Une bonne application possède souvent un rythme d’usage stable : soit fréquent, soit critique. **Fréquent** signifie qu’elle s’intègre dans la vie quotidienne, comme une messagerie ouverte plusieurs fois par jour, un outil de trajet utilisé tous les jours, ou une application de suivi que l’on renseigne régulièrement. **Critique** signifie que, même si l’application n’est pas utilisée chaque jour, l’utilisateur pense à elle en premier lorsqu’un certain scénario arrive : déclaration fiscale, calcul de budget travaux, gestion de questions d’entretien, checklist de documents de visa.

Demandez-vous : à quel moment et dans quelle situation l’utilisateur utilisera-t-il vraiment votre application ? S’il ne l’a pas, ressentira-t-il une gêne réelle ? Dans ce type de scénario, comment fait-il aujourd’hui ? S’il existe une solution de remplacement, même pénible mais déjà habituelle, vous devez non seulement aligner les fonctionnalités, mais aussi lui faire sentir que passer chez vous vaut vraiment le coup.

Une erreur fréquente consiste à lier directement la fréquence d’usage à la qualité. Ce n’est pas nécessaire. Faire un rapport annuel, gérer un dossier administratif ou effectuer un gros virement n’est pas fréquent, mais quand cela arrive, c’est important. **Si votre application traite ce type de scénario critique avec stabilité, rapidité et clarté, elle peut tout à fait être une bonne application.**

**Ce qui doit vraiment vous alerter, c’est une application que l’utilisateur n’utilise ni souvent, ni dans un moment important**, et dont la disparition de son téléphone ne lui manquerait qu’au moment de faire du nettoyage plusieurs mois plus tard. Cela signifie souvent que l’application n’est liée à aucun scénario réel, et qu’elle ne fait qu’empiler des fonctionnalités à faible présence.

### L’esprit d’aide

Quand beaucoup de gens commencent un produit, ils pensent en même temps à la facturation, aux hausses de prix, aux limites qui forcent à payer, ou aux moyens de verrouiller les données pour éviter que l’utilisateur parte. Le calcul commercial n’est pas un problème en soi. Mais si toute la réflexion tourne autour de cela dès le départ, on crée facilement une application qui inspire la méfiance : trop de permissions dès l’entrée, trop de points de paiement, des fonctionnalités conçues moins pour aider l’utilisateur à terminer sa tâche que pour l’amener vers un bouton payant.

À l’inverse, les vraies bonnes applications portent souvent une forme d’aide simple. Elles réfléchissent bien sûr à leur survie et à leur modèle économique, mais dans le parcours et l’expérience, la priorité reste : **comment aider l’utilisateur à accomplir cette tâche plus facilement, et non comment ajouter une étape pour créer une friction artificielle**. On le voit dans de petits choix : des indications claires aux moments clés, peu de barrières à l’export ou à la migration, une vraie valeur expérimentable avant de demander un paiement.

Cet esprit d’aide apparaît souvent dans des détails minuscules. Le formulaire ne demande pas une série d’informations sans lien avec la tâche juste pour collecter plus de données. Le tutoriel suit l’objectif utilisateur au lieu de l’ordre interne des modules. On sent que l’application aide sincèrement à réussir une chose, et ne traite pas l’utilisateur comme une ressource à extraire.

Un point important : **une bonne application n’a pas besoin d’être grande**. Elle peut être petite, servir un type de personne, un scénario et une tâche, mais le faire très bien. Par exemple, aider spécifiquement des designers à exporter des fichiers au format demandé par une imprimerie, ou aider des freelances à organiser leurs cas projets. Le périmètre est restreint, mais la valeur peut être réelle.

## 3.2 Comprendre les besoins : **la pyramide de Maslow**

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image16.png)

Avant de construire une application, beaucoup de gens sautent directement aux fonctionnalités : peut-on ajouter quelque chose ici, faut-il mettre un bouton là ? Mais ce qui décide réellement si une application peut survivre, c’est le niveau de besoin humain qu’elle touche, et avec quelle précision.

La pyramide des besoins de Maslow est souvent citée dans de nombreux domaines, non pas parce qu’elle serait parfaitement rigoureuse, mais parce qu’elle offre un cadre d’observation suffisamment utile. Vous n’avez pas besoin de la traiter comme une vérité psychologique stricte. Servez-vous-en comme d’un cadre simple pour rattacher les motivations des utilisateurs à quelques niveaux clairs, afin de juger quel type de besoin votre application satisfait. Plus vous pouvez satisfaire de besoins pertinents, meilleure l’application peut devenir.

On divise généralement la pyramide en cinq niveaux, de bas en haut : besoins physiologiques, sécurité, appartenance et amour, estime, accomplissement de soi.

### Les besoins physiologiques et liés à la survie

Ce niveau est le plus fondamental : manger, dormir, maintenir son état de survie. Cela semble éloigné d’Internet, mais beaucoup d’applications agissent à ce niveau.

La livraison de repas, les courses, les services de proximité, la réservation d’hôtel ou les VTC aident essentiellement à résoudre, avec moins de coût temporel, des besoins de base : manger, se déplacer, se reposer. Le suivi sportif, le sommeil ou l’alimentation relèvent davantage de la santé, mais pour beaucoup de gens, ils servent à maintenir un corps qui ne part pas complètement hors de contrôle ; on peut donc les voir comme une extension de ce niveau.

Si votre application agit ici, les utilisateurs seront **très sensibles à la stabilité, à la fiabilité et à la prévisibilité**. Une livraison qui n’arrive pas, une voiture introuvable, une réservation d’hôtel erronée créent de fortes réactions, parce que ces problèmes interrompent directement le rythme de base de la vie.

### Les besoins de sécurité et de certitude

La sécurité inclut la sécurité physique, mais aussi la sécurité économique, informationnelle et psychologique.

Beaucoup d’outils travaillent en réalité à ce niveau : gestion de budget, gestion d’actifs, assistants d’assurance, modèles de contrats, gestionnaires de mots de passe, sauvegarde, protection de la vie privée, synchronisation cloud, récupération de données. Leur promesse centrale est souvent : réduire les erreurs, fournir une solution de secours quand quelque chose se passe mal, ou au moins donner un sentiment de contrôle.

Une catégorie typique est celle des petits outils anti-perte, anti-oubli, anti-erreur : rappels d’agenda, rappels de prise de médicaments, alertes d’expiration de documents importants, mémos sur des échéances clés. Même s’ils ne vous rappellent que quelques fois par jour, s’ils vous sauvent une ou deux fois dans un moment critique, vous les rangez vite parmi les outils indispensables.

Quand vous concevez ce type de produit, demandez-vous : **quel risque précis réduisez-vous pour l’utilisateur : argent, temps, relation, conformité ou droit ?** Si vous-même ne pouvez pas le dire clairement, l’utilisateur aura du mal à vous faire confiance.

### Appartenance, connexion et sentiment d’être vu

Le niveau suivant est celui de l’appartenance et de l’amour. En termes simples : je ne veux pas être seul, je veux être relié à certaines personnes. C’est le territoire naturel des applications sociales, communautaires et de groupes d’intérêt.

Fil d’actualité, groupes de discussion, forums, communautés de passionnés, clubs de lecture en ligne, guildes dans les jeux, groupes de jeunes parents, entraide d’étudiants internationaux, plateformes anonymes de discussion professionnelle : tout cela offre une forme d’appartenance. Il y a des gens qui me ressemblent, qui regardent les mêmes sujets, se plaignent des mêmes difficultés, partagent des expériences proches.

Certaines applications semblent fonctionnelles, mais ce qui retient vraiment les utilisateurs se trouve à ce niveau. Dans une application de budget, les gens partagent leurs progrès d’épargne ; dans une application de course, ils se comparent et pointent leur présence ; dans une application d’apprentissage, ils se surveillent mutuellement. Ces modules sociaux, en apparence additionnels, lient l’application à une identité de groupe.

Si votre application veut se placer à ce niveau, le contenu ne suffit pas. Il faut comprendre **pourquoi l’utilisateur sentirait qu’il est “entre les siens”, s’il accepte d’y laisser des traces et d’interagir légèrement mais réellement avec d’autres**. Sinon, vous ne construisez qu’un outil de diffusion à sens unique.

### Respect, valeur personnelle et accomplissement

Le niveau suivant est celui de l’estime et de l’estime de soi. L’être humain ne veut pas seulement être accepté ; il commence aussi à se demander : suis-je quelqu’un de valable ici ? Suis-je vu, reconnu ? Ce que j’ai accompli est-il remarqué ?

Les check-ins, badges, classements, titres et systèmes de réussite jouent souvent à ce niveau. Une application d’apprentissage donne un titre après un certain nombre d’heures, une application sportive délivre un certificat, une plateforme de création attribue des statuts aux auteurs, une communauté met en avant les contributions de qualité.

L’erreur fréquente est de croire qu’ajouter beaucoup de badges, points et titres suffit à motiver. L’utilisateur ne cherche pas une décoration voyante ; il veut que son effort réel soit enregistré et pris au sérieux. Si votre système de réussite est déconnecté de l’investissement réel, par exemple un titre « expert » obtenu après quelques clics, l’effet disparaît vite et peut même paraître bon marché.

La question clé n’est donc pas d’avoir ou non un système d’incitation, mais : **votre application offre-t-elle une scène d’accumulation où l’utilisateur peut voir clairement son passage de débutant à plus compétent**, et marque-t-elle les étapes importantes avec une forme de rituel ?

### Accomplissement de soi et dépassement de soi

Le sommet de la pyramide renvoie à la personne que je veux devenir et à ce que je veux apporter. Cela semble abstrait, mais dans les scénarios concrets, les manifestations sont très pratiques.

Les outils de création, comme l’écriture, le dessin, la production musicale, le montage vidéo ou la gestion de projets de programmation, fournissent en surface des capacités techniques ; en profondeur, ils portent le désir de créer quelque chose qui nous appartient. Les plateformes d’apprentissage long terme, les outils de planification de carrière et les outils d’habitudes répondent eux aussi à un objectif de croissance personnelle plus long.

Il existe aussi le besoin d’aider les autres. Beaucoup utilisent des plateformes de partage de connaissances, des communautés de questions-réponses, des applications d’intérêt public ou des outils de création collaborative, non seulement pour gagner des points ou du trafic, mais parce qu’aider quelqu’un ou faire avancer un projet donne le sentiment de faire quelque chose de significatif. Cela appartient aussi à l’accomplissement de soi.

Quand votre application touche vraiment ce niveau, elle peut devenir très collante : même si l’interface n’est pas la plus belle et que les fonctions ne sont pas les plus complètes, l’utilisateur reste, parce que **l’application établit un lien plus profond avec ce qu’il est et ce qu’il fait**.

Utiliser la pyramide de Maslow comme perspective produit aide à éviter deux biais.

**Premier biais : s’accrocher au mauvais niveau.** Si vous construisez un outil de stockage sécurisé, il se situe au niveau de la sécurité. Si vous imitez aveuglément les produits sociaux avec likes, commentaires et classements, vous risquez de ne pas gagner l’attention sociale, tout en donnant aux personnes qui cherchent seulement un stockage fiable l’impression que vous perdez votre objectif.

**Deuxième biais : oublier l’ordre entre les niveaux.** Si l’expérience de base n’est pas stable, il est difficile pour l’utilisateur de poursuivre un accomplissement de soi chez vous. Une application qui plante souvent ou perd parfois des données ne sera pas sauvée par des badges ou des courbes de progression. En revanche, si la base est solide, vous pouvez ajouter progressivement des valeurs de niveau supérieur.

Dans la pratique, vous pouvez vous auto-vérifier ainsi :

- demandez d’abord : quel niveau de besoin mon application satisfait-elle principalement ? Choisissez-en un seul ;
- demandez ensuite : au-dessus de ce niveau central, puis-je naturellement étendre vers le niveau supérieur, sans coller un concept artificiel ;
- enfin, regardez les niveaux plus bas : ai-je des faiblesses évidentes qui freinent l’utilisateur ?

Quand vous pouvez répondre clairement, votre compréhension de ce que les utilisateurs veulent vraiment ne reste plus au niveau flou de « ils devraient aimer », et cela vous aide à construire une meilleure application.

## 3.3 Classer par type d’utilisateur : différences entre applications C-end et B-end

Après avoir construit l’application, vous découvrirez vite une autre chose importante : s’adresser à des particuliers et s’adresser à des entreprises ou organisations sont deux jeux totalement différents. Les deux s’appellent des utilisateurs, mais leurs priorités ne sont pas les mêmes.

- C-end (Consumer End) : côté consommateur, avec pour cœur les utilisateurs individuels ordinaires. Par exemple WeChat, Douyin ou Meituan sont utilisés par des individus ; les scénarios qui servent directement des personnes relèvent du C-end.
- B-end (Business End) : côté entreprise, avec pour cœur les entreprises, institutions ou organisations. Par exemple DingTalk, des logiciels financiers comme Yonyou ou Kingdee, ou les systèmes de caisse de magasins. Les utilisateurs sont des employés, équipes ou organisations, et le produit sert l’exploitation, la gestion ou la production.

### Applications C-end : vie, émotions et habitudes des particuliers

Les applications C-end s’adressent aux individus et s’insèrent dans leur vie quotidienne. Les types courants incluent contenu, outils, divertissement, social, apprentissage, etc.

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image17.png)

Les applications de contenu, comme les lectures d’actualité, plateformes de vidéos courtes ou outils de podcast, aident l’utilisateur à extraire ce qui l’intéresse d’une masse d’informations en temps limité, tout en lui donnant régulièrement de nouvelles raisons de revenir.

Les outils, comme la gestion de budget, les tâches, les fichiers ou le calendrier, fournissent souvent une solution plus pratique qu’une méthode brute pour une tâche précise. Ils deviennent une partie de l’infrastructure quotidienne.

Les applications de divertissement, jeux, interactions légères et petits outils amusants, offrent une détente émotionnelle. Leur qualité se mesure davantage à la volonté des utilisateurs d’y passer du temps de manière continue.

Les applications sociales tournent autour de la connexion et de l’interaction entre personnes ; les applications d’apprentissage autour de l’amélioration d’une compétence, comme mémoriser du vocabulaire, faire des exercices, suivre des lectures ou gérer des cours.

Malgré leurs différences, ces applications partagent plusieurs préoccupations.

**Premièrement, la croissance utilisateur.** Comment faire essayer l’application à plus de gens pour la première fois ? Cela implique canaux, messages de diffusion et incitations, mais la condition reste d’avoir un scénario d’usage clair. Sinon, les meilleures méthodes de croissance n’amènent qu’une curiosité de courte durée.

**Deuxièmement, la rétention et le retour.** Le point n’est pas seulement que quelqu’un soit venu, mais qu’il veuille rester et revenir. Une application de contenu sans contenu durablement intéressant sera vite remplacée. Un outil qui n’aide pas l’utilisateur à accomplir sa tâche lors des premiers usages clés aura du mal à créer une habitude. Observez la rétention au jour 1, au jour 7 et au jour 30 pour savoir combien de personnes vous intègrent réellement à leur rythme de vie.

**Troisièmement, la conversion et le paiement.** L’utilisateur paie rarement parce que la version gratuite est mauvaise ; il paie plutôt parce qu’après avoir déjà reçu une partie de la valeur, il voit que les fonctions payantes offrent une commodité supérieure : quota plus élevé, collaboration plus forte, modèles plus professionnels, performance plus stable.

**Quatrièmement, le partage.** Beaucoup de produits C-end se diffusent vite parce qu’ils contiennent naturellement du partage. Si l’utilisateur génère une image, une vidéo ou un texte, il doit souvent envoyer le résultat à quelqu’un pour atteindre son objectif. Si votre marque apparaît de manière naturelle et non gênante, vous pouvez gagner une diffusion par bouche-à-oreille.

Une manière simple de juger si un besoin C-end est réel consiste à voir si l’utilisateur accepte de former une petite habitude autour de lui : ouvrir l’application chaque jour, la lier à son rythme de vie, l’utiliser pour enregistrer des moments importants. À l’inverse, si l’utilisateur vient seulement par publicité ou opération, l’utilise une fois puis disparaît, vous répondez probablement à une curiosité temporaire, pas à un besoin long terme.

### Applications B-end : efficacité, coûts et contrôle du risque pour les organisations

Les applications B-end servent des entreprises, équipes, institutions ou départements. Les catégories courantes incluent ERP, CRM, outils de collaboration, SaaS et systèmes internes de gestion métier.

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image18.png)

La grande différence avec le C-end est qu’elles doivent satisfaire plusieurs rôles en même temps. L’utilisateur direct peut être un employé de première ligne, le décideur un manager ou patron, les données appartiennent à l’organisation, et les validations impliquent plusieurs départements. Il faut que l’utilisateur trouve le produit pratique, **que le décideur voie le retour sur investissement**, et que l’organisation se sente en sécurité côté risque et conformité.

Les applications B-end ont plusieurs points d’attention essentiels.

**Premièrement, améliorer l’efficacité.** Il ne s’agit pas seulement de réduire le temps d’une personne, mais de réduire le temps total de processus, les coûts de collaboration et les échanges inutiles. Si une commande devait passer par cinq systèmes avant l’expédition, et qu’elle circule maintenant via une entrée unifiée, la valeur est très concrète pour l’entreprise.

**Deuxièmement, réduire les coûts.** Cela inclut les coûts humains, de formation et de maintenance. Un système puissant mais lourd à former et maintenir paraît peu rentable à beaucoup de PME. À l’inverse, des outils SaaS plus légers, faciles à apprendre et rapides à rentabiliser, survivent souvent mieux.

**Troisièmement, contrôler les risques et garantir la conformité.** En finance, santé, fabrication ou administration, conformité et traçabilité sont centrales. Une bonne application B-end sacrifie parfois un peu de liberté d’usage pour obtenir des permissions plus nettes, des logs plus stricts et des chaînes d’approbation plus claires. Pour un individu, cela semble moins flexible ; pour l’organisation, c’est précisément la valeur.

**Quatrièmement, gérer les permissions et les responsabilités.** Qui peut voir quoi, qui peut modifier quoi, qui répond de quel résultat ? Ces questions sont cruciales. Si elles sont mal conçues, l’audit, les litiges et la responsabilisation deviennent coûteux. Juger une bonne application B-end ne consiste donc pas seulement à regarder si l’interface est agréable, mais aussi si son modèle de permissions est rigoureux, compréhensible et maintenable.

Pour passer d’un secteur à une application, vous pouvez procéder ainsi : **choisissez un secteur que vous comprenez un peu, comme l’éducation, l’e-commerce, la fabrication, la finance ou la santé**, puis analysez ses opérations quotidiennes. Quels processus dépendent encore fortement du travail manuel ? Quelles informations sont dispersées dans plusieurs systèmes ou discussions privées ? Quels maillons ont un taux d’erreur élevé mais difficile à détecter rapidement ? Autour de ces zones, vous pouvez souvent concevoir de petits outils très ciblés.

Dans l’éducation, un angle concret est l’optimisation des plannings de cours et de l’utilisation des salles. Il n’a pas besoin de remplacer tout le système académique ; s’il aide seulement les responsables à organiser enseignants, salles et horaires, éviter les conflits, proposer de meilleures combinaisons et exporter un planning lisible, il économise déjà beaucoup de communication et de modifications.

Dans l’e-commerce, le besoin fréquent est la gestion de commandes multicanal. Un marchand peut avoir des boutiques sur plusieurs plateformes et des commandes dispersées. Un outil qui agrège ces commandes, puis centralise après-vente et logistique, résout déjà une douleur quotidienne importante.

Dans la fabrication, beaucoup d’entreprises suivent encore la production avec papier ou Excel. Un simple outil de suivi d’ordres de travail peut aider les responsables de terrain à voir l’état de chaque étape, au lieu de passer la journée à demander et appeler.

Dans la finance ou la santé, l’entrée n’a pas forcément besoin d’être le front-office. Cela peut être un assistant de vérification de conformité, un générateur de modèles de documents ou une checklist de pièces d’approbation. Tant que vous pouvez dire clairement quelle tâche, pour quel rôle, dans quel processus, devient plus contrôlable grâce à votre outil, la direction mérite d’être essayée.

Les secteurs ci-dessus ont souvent déjà des produits de sociétés mûres. C’est une bonne source de référence : cherchez des mots clés comme « secteur + besoin central + produit », par exemple « système de planning éducation » ou « outil de gestion multicanal e-commerce ». Vous trouverez des sites, fonctions, avis, cas clients et vidéos de démonstration. Ces informations vous aident à comprendre comment les produits mûrs résolvent les mêmes problèmes et à éviter trop d’essais à partir de zéro.

## 3.4 Peaufiner avec les données utilisateurs : de « je trouve ça bien » à « les utilisateurs trouvent ça bien »

Après avoir construit l’application, une illusion apparaît facilement : plus vous l’utilisez, plus elle vous semble fluide, et vous supposez que les utilisateurs ressentent la même chose. En réalité, plus un produit est le vôtre, plus vous êtes aveugle aux problèmes des autres. Pour faire passer une application d’un projet qui vous satisfait à un vrai bon produit, vous devez intégrer les retours utilisateurs réels dans la boucle.

### Concevoir un mécanisme de feedback simple pour donner la parole aux utilisateurs

Vous n’avez pas besoin de construire immédiatement un système complexe de support client ou de data. Commencez par des moyens simples.

**Le groupe de discussion est le plus direct.** Si vous avez déjà un petit groupe d’utilisateurs, invitez-les à poster leurs problèmes et idées issus de l’usage quotidien. Votre rôle est de répondre sérieusement, noter et résumer régulièrement, pas de vous défendre. Plus vous créez une atmosphère où l’on peut parler franchement, plus le feedback devient précieux.

Les questionnaires conviennent lorsque vous devez **collecter une quantité relativement structurée d’informations en une fois**, par exemple après une itération de version. Pour obtenir un bon taux de réponse, gardez le questionnaire court et posez des questions concrètes : quelle fonction avez-vous le plus utilisée récemment ? À quelle étape êtes-vous le plus souvent bloqué ? Évitez les questions trop générales comme « que pensez-vous de l’application ? ».

Les popups après usage sont aussi courants. Après une tâche terminée, vous pouvez afficher une note très courte et une zone de suggestion : « cette expérience était-elle fluide ? ». Parfois, une simple note chiffrée suffit à repérer un problème évident dans un flux.

Les entretiens un à un coûtent plus cher, mais rapportent souvent plus. **Choisissez quelques utilisateurs de types différents et demandez-leur 20 à 40 minutes** pour parler de leurs habitudes. Laissez-les utiliser le produit en décrivant ce qu’ils voient et ressentent. Passer du temps à comprendre les besoins utilisateurs n’est jamais une perte.

### Extraire trois types d’information d’un feedback désordonné

Les retours utilisateurs sont généralement mélangés. Vous pouvez les classer en trois catégories : **bugs, problèmes d’expérience, nouveaux besoins**.

**Un bug signifie qu’un comportement annoncé ne se produit pas dans certaines conditions, ou se produit mal.** Par exemple : échec de téléversement, crash, bouton sans réponse, résultat manifestement incorrect. Pour ces problèmes, reproduisez vite, corrigez, puis informez les utilisateurs affectés afin qu’ils voient que vous prenez cela au sérieux.

**Un problème d’expérience signifie que le parcours, la position d’une action ou la formulation ne suit pas le chemin le plus fluide.** Par exemple : les utilisateurs hésitent toujours devant un bouton parce qu’ils ne savent pas si l’action est irréversible ; une fonction importante est cachée dans un coin ; un réglage par défaut va contre l’habitude majoritaire et impose une correction à chaque fois. Ce type de retour doit être jugé avec les données et l’observation pour décider quoi modifier et jusqu’où.

**Un nouveau besoin apparaît quand les utilisateurs proposent des fonctions ou scénarios que vous n’aviez pas prévus.** Certains méritent réflexion : plusieurs formats d’export, collaboration d’équipe, intégration avec d’autres outils. Mais vous n’avez pas à faire tout ce que les utilisateurs demandent. Il faut surtout déterminer s’il existe un problème commun derrière ces demandes, et si elles correspondent toujours au groupe et à la tâche centrale que vous vouliez servir. Sinon, vous serez tiré dans toutes les directions et finirez avec un produit qui veut tout faire sans rien faire profondément.

Prenez l’habitude d’étiqueter chaque retour : bug, problème d’expérience ou nouveau besoin. Résumez régulièrement ces étiquettes pour voir quels problèmes se concentrent sur quelles fonctions ou quels flux. Vous ne réparez plus seulement de manière passive ; vous organisez vos itérations autour des problèmes fréquents.

### Utiliser trois indicateurs simples pour décider s’il faut continuer à investir

Avec des ressources limitées, vous avez besoin d’indicateurs simples mais efficaces pour juger si l’application mérite un investissement long terme.

**Le premier est la rétention.** La rétention ne consiste pas à voir combien de personnes ont ouvert l’application un jour donné, mais **combien continuent à l’utiliser sur une période**. Même une mesure grossière suffit : combien de personnes l’utilisent encore au moins une fois dans la semaine suivant le téléchargement, combien reviennent dans le mois. Si la majorité l’essaie une ou deux fois puis disparaît, l’application n’a pas montré assez de valeur au départ, ou son seuil d’usage est trop élevé.

**Le deuxième est la fréquence de retour.** Parmi les personnes qui ne l’ont pas désinstallée, à quelle fréquence reviennent-elles ? Un outil quotidien et une application utilisée une fois par trimestre n’ont pas le même positionnement, donc pas le même étalon. Mais vous devez avoir une hypothèse raisonnable de rythme d’usage et la comparer aux données. Une fréquence plus élevée que prévu peut signaler une valeur plus forte ; une fréquence beaucoup plus basse oblige à vérifier si le scénario est mal choisi ou si l’expérience fatigue l’utilisateur.

**Le troisième est la volonté de recommandation.** Des utilisateurs recommandent-ils spontanément votre application ? Vous pouvez l’observer de plusieurs façons : proposer une entrée de partage naturelle après une tâche réussie et voir combien l’utilisent ; regarder si quelqu’un recommande spontanément le produit dans un groupe ; demander en entretien : si quelqu’un autour de vous rencontrait le même problème, lui conseilleriez-vous cet outil ? La recommandation est souvent plus parlante qu’une note de satisfaction, car elle engage la crédibilité personnelle de l’utilisateur.

En combinant ces trois indicateurs avec les retours précédents, vous pouvez juger l’état actuel de l’application. Même si les fonctions sont incomplètes, s’il existe déjà des personnes qui restent et reviennent dans un scénario précis, le produit mérite probablement d’être investi et poli. À l’inverse, si vous avez corrigé beaucoup de bugs, ajouté des fonctions, mais que rétention et retour ne progressent pas, et que presque personne ne recommande l’application, il faut réfléchir calmement : faut-il réduire le périmètre, revenir au scénario central initial, voire changer de direction ?

# 4. À quelle étape, et comment, utiliser raisonnablement l’IA pour amplifier la valeur ?

Dès que vous commencez sérieusement à construire une application, une tentation très commune apparaît : peut-on ajouter un peu plus d’IA ? Cette tentation est forte parce que vous voyez chaque jour des messages du type « l’IA renforce tel secteur », « l’IA reconstruit complètement tel processus », « l’IA règle tout en un clic ». À force, il devient facile de transformer un problème simple en slogan séduisant, d’empiler des appels à des modèles dans la stack technique et de voir les coûts augmenter sans contrôle.

Même si ce tutoriel porte sur le développement d’applications AI-native, il faut dire clairement qu’à l’échelle d’une petite application ou d’un produit qui démarre, **le plus dangereux n’est pas de ne pas utiliser l’IA, mais d’utiliser l’IA pour l’IA**. Vous pourriez d’abord construire un outil simple et fiable, mais vous êtes attiré par les nouvelles capacités et vous ajoutez sans cesse des fonctions qui paraissent intelligentes. Au final, une direction qui pouvait atterrir devient chère, complexe, et sans gain de valeur évident. La question centrale de ce chapitre est donc : à quel stade, dans quels maillons, et sous quelle forme l’IA peut-elle vraiment amplifier la valeur de votre application ?

## 4.1 Ne pas faire de l’IA pour l’IA

Une méthode très pratique pour vérifier si vous tombez dans ce piège consiste, avant chaque ajout de fonction IA, à vous forcer à répondre sérieusement à deux questions.

**Première question : sans IA, cette application tient-elle encore debout ?** Autrement dit, si l’on retire temporairement toutes les capacités IA, ce que vous faites reste-t-il utile en soi ? Les utilisateurs ont-ils un besoin réel ? Sont-ils prêts à y consacrer du temps chaque jour, chaque semaine ou chaque mois ?

Cette phrase paraît un peu à contre-courant, parce que presque toutes les pages produit mettent aujourd’hui l’IA au premier plan, comme si un outil sans IA n’était pas moderne. Mais si votre application s’effondre complètement sans IA, le problème n’est souvent pas que votre technologie manque d’avancement. Le problème est plus profond : le besoin que vous avez choisi n’est peut-être pas douloureux, voire pas vraiment réel.

Imaginez un outil d’organisation de tâches. Si votre différence principale consiste à ajouter dans la liste des tâches des suggestions générées par un modèle, comme des titres automatiques, une classification automatique ou des descriptions complétées, mais que les utilisateurs ne souffrent pas du tout de devoir écrire un titre et veulent seulement noter une tâche rapidement, ces capacités intelligentes auront beau être impressionnantes, elles auront du mal à créer une valeur durable. À l’inverse, si vous prenez du recul et vous demandez quelle est la valeur la plus simple sans IA, vous trouverez peut-être une direction plus solide : rassembler les tâches dispersées entre plusieurs canaux, aider l’utilisateur à voir ce qu’il peut réellement terminer dans la journée, faire apparaître les risques avant la fin de l’agenda pour l’aider à prioriser et à renoncer. Construire ces bases vaut souvent mieux que d’ajouter des étiquettes intelligentes dès le départ.

**Deuxième question : avec l’IA, qu’est-ce qui s’améliore concrètement ?** Les formules larges comme « amélioration de l’efficacité », « expérience réinventée » ou « montée en intelligence » ne suffisent pas. Il faut descendre à une ou deux dimensions que l’utilisateur lui-même peut percevoir clairement.

Vous pouvez vous interroger ainsi :

- la vitesse d’exécution de la tâche a-t-elle nettement augmenté ? Par exemple, une page de texte qui devait être écrite de zéro ne demande plus que cinq minutes de relecture et de modification ;
- la qualité du résultat a-t-elle clairement progressé ? Par exemple, l’utilisateur produit dans le même temps un contenu plus structuré, plus professionnel et plus adapté à son public ;
- le processus d’usage est-il devenu plus fluide ou plus léger ? Par exemple, un formulaire ennuyeux devient une conversation de questions-réponses ;
- le coût réel a-t-il diminué ? Par exemple, moins d’externalisation, moins d’heures de support humain, une formation plus courte ou une décision plus rapide.

Si votre réponse reste au niveau de « ça semble un peu plus pratique » ou « ça a l’air plus cool », il y a de fortes chances que cette fonction IA n’ait pas encore trouvé son vrai point d’appui.

Ces deux questions ont un ordre clair : d’abord vérifier que l’application a du sens sans IA, puis demander précisément ce que l’IA améliore.

## 4.2 Réfléchir au rôle que joue l’IA

Quand vous avez confirmé que l’application tient même sans IA, et que vous avez trouvé un point d’amélioration clair, l’étape suivante consiste à répondre plus précisément : **dans votre application, que fait exactement l’IA ?** Beaucoup de produits se trompent ici parce qu’ils traitent l’IA comme une énergie abstraite, et non comme un rôle avec des responsabilités claires. Le résultat est un empilement de fonctions : tout semble un peu intelligent, mais l’utilisateur ne voit pas quelle partie est vraiment indispensable.

Une approche plus claire consiste à voir l’IA comme plusieurs composants possibles : **elle peut être le cerveau, les yeux ou les mains**. Selon l’objectif produit, choisissez la partie qu’elle doit prendre en charge. Si possible, commencez par un ou deux rôles bien faits, plutôt que de tout ajouter d’un coup.

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image19.png)

**Quand l’IA joue le rôle du cerveau, elle comprend et génère surtout du texte, ou raisonne entre des informations complexes.** Par exemple, dans un assistant de compte rendu de réunion, elle doit extraire les points vraiment importants d’un long enregistrement, et non simplement lister tout dans l’ordre chronologique. Dans une application d’apprentissage, elle doit distinguer si l’utilisateur n’a pas compris un concept ou s’il a seulement fait une erreur d’inattention, puis donner un retour différent. Dans ces scénarios, la valeur de l’IA vient de sa capacité à lire les paroles de l’utilisateur, comprendre les matériaux fournis et produire une sortie structurée et logique. Votre travail consiste à aider l’utilisateur à poser clairement le problème et à fournir un contexte assez précis.

**Quand l’IA joue le rôle des yeux, elle traite surtout des contenus non textuels comme les images et les vidéos**, pour les transformer en descriptions compréhensibles par la machine, puis agir à partir de ces descriptions. Un outil d’organisation de documents papier peut reconnaître, à partir de photos, des factures, contrats ou notices en texte recherchable. Une application d’apprentissage du dessin peut comprendre le croquis de l’utilisateur et signaler des problèmes de composition ou de ligne. Un outil de conseil pour aménager une pièce peut analyser une photo, reconnaître la disposition et les objets, puis proposer des améliorations simples. Ici, l’IA agit comme une paire d’yeux analytiques : votre application ne se limite plus au texte saisi au clavier, elle touche le monde physique de l’utilisateur.

**Quand l’IA joue le rôle des mains, elle exécute une suite d’actions concrètes**, au lieu de se limiter à une suggestion ou à un texte. Certaines plateformes d’automatisation permettent par exemple de créer un workflow : lire une pièce jointe dans un mail, en résumer les points clés, envoyer le résumé dans un groupe, stocker l’original dans le cloud, puis créer automatiquement une tâche de suivi. Ici, l’IA décide dynamiquement de l’étape suivante selon le contexte : reconnaître si un mail est une plainte, vérifier si un formulaire est complet, et déclencher la suite appropriée.

Dans les produits réels, les rôles de l’IA peuvent être encore plus précis.

Dans le traitement du texte, elle peut traduire, résumer, répondre à des questions, continuer un texte ou analyser le sentiment : classer automatiquement les demandes clients, extraire des clauses dans un assistant juridique, corriger une rédaction dans une application éducative.

- La base technique est principalement celle des **Large Language Models (LLM)**, qui apprennent des régularités du langage et des connaissances générales à partir de corpus massifs. Ils peuvent comprendre de longs contextes et générer des textes cohérents.
- Côté compréhension, un LLM peut reconnaître l’intention, extraire les informations clés et juger une tonalité émotionnelle. Côté génération, il peut résumer, répondre, réécrire, continuer ou traduire, ce qui automatise ou semi-automatise beaucoup de tâches de lecture, synthèse et rédaction.
- Dans un **robot de service client**, le système peut d’abord classer une phrase en demande, plainte ou après-vente, extraire commande, date et nom de produit, puis laisser le LLM générer une réponse naturelle et complète avec le contexte et la base de connaissances de l’entreprise.

Dans le traitement d’image, elle peut reconnaître, classer, générer, restaurer ou améliorer : marquer des lésions dans l’imagerie médicale, détourer automatiquement un produit e-commerce, générer une illustration à partir d’un texte.

- La compréhension d’image s’appuie souvent sur des modèles visuels de deep learning comme les **Convolutional Neural Networks (CNN)**, qui apprennent bords, textures et structures pour la détection, la segmentation et la classification fine.
- La génération et la restauration reposent sur des modèles génératifs comme les **modèles de diffusion** et les **GAN**, capables de créer de nouvelles images à partir d’un texte ou d’une référence, ou d’améliorer des images floues, incomplètes ou de faible résolution.
- Beaucoup de systèmes combinent aussi des LLM : le texte utilisateur est d’abord compris en langage naturel, puis transformé en prompts, styles et contraintes de composition adaptés au modèle visuel.
- Dans une fonction e-commerce de **génération intelligente d’image principale**, le système détoure d’abord le produit, utilise ensuite un LLM pour interpréter la demande du marchand, par exemple « salon nordique minimaliste, lumière naturelle douce », puis génère un fond et une lumière cohérents avant de filtrer les résultats moins bons.

Dans l’audio et la vidéo, elle peut générer, transcrire, réduire le bruit, monter ou créer des sous-titres : intro et outro automatiques pour podcast, vidéo explicative générée depuis un script, transcription et traduction en temps réel dans une réunion.

- Côté compréhension, le système utilise des **modèles de reconnaissance vocale** pour convertir la parole en texte et analyser locuteur, langue, vitesse et émotion approximative ; des modèles visuels comprennent les scènes, personnes et objets.
- Côté génération, un LLM comprend et réécrit scripts, réunions ou instructions, puis pilote la **synthèse vocale (TTS)** et des modèles de génération ou montage vidéo pour composer les images, remplacer des fonds, insérer des plans et aligner les sous-titres. Des modèles audio peuvent aussi produire musique d’ambiance et sons, avec réduction de bruit et amélioration de qualité.
- Dans un produit de **texte vers courte vidéo**, l’utilisateur saisit un paragraphe ; le système le découpe en segments et scènes, génère une narration et un storyboard simple, produit la voix avec TTS, choisit ou génère les images, aligne sous-titres et audio, puis exporte une vidéo prête à publier.

Dans l’interaction vocale, elle peut reconnaître, synthétiser, détecter l’émotion ou gérer le dialogue : comprendre des commandes dans une enceinte connectée, annoncer un itinéraire, corriger une prononciation.

- Le front-end convertit la voix en texte avec un **modèle de reconnaissance vocale** et extrait ton, volume et vitesse comme indices d’état.
- Le back-end utilise la **synthèse vocale (TTS)** pour produire une réponse naturelle. Les modèles de reconnaissance émotionnelle peuvent ajuster le ton et la vitesse de la réponse pour rendre l’échange plus proche d’une conversation réelle.
- Avec une **enceinte connectée**, quand l’utilisateur dit « je suis un peu fatigué aujourd’hui, mets une musique relaxante », le système transcrit, utilise un LLM et l’historique d’écoute pour comprendre ce que « relaxant » signifie pour lui, choisit une playlist plus douce, puis adoucit la voix de réponse si un état de fatigue est détecté.

Tout cela n’est qu’une introduction aux grands domaines d’application de l’IA. Dans un vrai contexte métier, vous devrez souvent intégrer plusieurs AI API récentes et les tester sur différentes tâches. Il faut aussi comprendre progressivement la vraie capacité actuelle de l’IA, ce qu’elle peut résoudre, où elle échoue facilement et où sont ses limites. Sans cela, vous risquez de concevoir des fonctions et des parcours sur une mauvaise estimation de capacité.

## 4.3 Se familiariser avec les capacités et les limites de l’IA

Quand vous intégrez réellement l’IA dans une application, vous découvrez vite un écart : la promesse « toute-puissante » des discours marketing et les contraintes d’une fonction précise sont parfois très éloignées. Pour éviter de trop promettre et de décevoir, **vous devez avoir une compréhension de base des grandes capacités actuelles de l’IA, mais aussi connaître leurs frontières. Il faut beaucoup tester, analyser les Bad Case, éviter les situations où l’IA est très susceptible de se tromper, ou ajouter des avertissements clairs.**

Les modèles actuels hallucinent encore dans beaucoup de scénarios, surtout quand on les laisse improviser librement ou qu’on ne leur donne pas de références fiables. Ils peuvent produire des réponses confiantes mais fausses, inventer des fichiers, données ou événements inexistants. Ainsi, dès que les résultats ont des conséquences sérieuses, comme des états financiers, documents juridiques ou conseils médicaux, vous devez ajouter dans le design une relecture humaine ou des contrôles multiples. Ne traitez pas la sortie du modèle comme une instruction directement exécutable.

La confidentialité et la sécurité des données doivent aussi être prises de front. Vous devez savoir quelles données peuvent être envoyées au modèle, lesquelles doivent être anonymisées, et lesquelles ne doivent jamais entrer dans un système tiers. Pour des contrats, dossiers médicaux ou informations d’identité, expliquez clairement le traitement dans l’interface et les conditions, et choisissez si possible un mode de déploiement plus sûr et contrôlable.

Pour rendre cela plus concret, prenons l’exemple d’un Agent. Il ne s’agit pas ici d’enseigner comment construire un Agent de zéro, ni de courir après une architecture à la mode. L’objectif est de montrer une façon de penser : certains parlent d’Agent comme d’un nouveau mot à la mode ; d’autres s’en servent pour découper clairement les tâches et les frontières.

Barret Li Jing, auteur et praticien de longue date des applications IA, a donné un résumé que je trouve très juste. Il montre une méthode mûre : découper d’abord le problème, puis seulement discuter de la place de l’IA.

> Un Agent a deux variables : le workflow, qui contrôle la direction de la tâche, et le context, qui contrôle la génération du contenu.
>
> 1) Si le workflow et le context sont tous deux très déterministes, la tâche est facile à automatiser, comme du RPA classique. Pour le traitement de factures ou le remplissage de formulaires, l’IA sert surtout de colle et a un espace limité.
>
> 2) Si le workflow est déterministe mais le context incertain, c’est-à-dire un processus fixe avec des entrées variables, l’Agent doit compléter par compréhension sémantique. Par exemple pour le service client ou l’analyse de contrats, il faut parfois utiliser recherche externe, graphe de connaissances ou outils pour combler les manques d’information.
>
> 3) Si le workflow est incertain mais le context déterminé, l’entrée est claire mais les chemins possibles sont nombreux. L’Agent doit planifier de manière autonome, par exemple pour générer un rapport d’analyse de marché ou une recommandation personnalisée.
>
> 4) Si workflow et context sont tous deux incertains, c’est le cas le plus complexe. Il faut raisonner et explorer, comme pour concevoir une solution innovante ou collecter des informations entre départements. Ce type tend vers des Agents plus généraux, dont l’efficacité dépend de la richesse des outils, notamment de la capacité à programmer.
>
> Donc, pour bien construire un Agent, il faut d’abord clarifier le scénario. Au fond, l’automatisation résout les problèmes de « déterminisme », tandis que l’intelligence résout les problèmes d’« incertitude ».

La valeur de ce découpage est de transformer l’idée floue « faire un Agent » en questions que l’on peut juger : où sont le déterminisme et l’incertitude dans la tâche ? Quand processus et informations sont déterminés, un programme traditionnel suffit souvent. Quand l’incertitude apparaît, la compréhension sémantique, la reconnaissance de motifs et la planification de l’IA deviennent utiles. Mais plus l’incertitude est forte, plus les risques nouveaux introduits par l’IA sont élevés. C’est pourquoi beaucoup d’équipes commencent par le deuxième cas : workflow fixe, context incertain. Elles utilisent la compréhension de l’IA tout en bornant le risque par un processus fixe.

Revenons à la question de départ : que signifie vraiment comprendre les limites de l’IA ?

D’abord, comprendre que les scénarios n’ont pas tous le même besoin d’IA. Comme le montre l’exemple workflow/context : quand tout est déterminé, l’IA a peu d’espace ; quand le flux est fixe mais l’information variable, l’IA sert à comprendre et compléter ; quand le flux est incertain, elle doit planifier et explorer. Le fond de cette méthode consiste à identifier la source et le degré d’incertitude. La force centrale de l’IA est de trouver des motifs et relations dans l’incertitude. Cela vaut aussi pour la reconnaissance d’image, la génération de contenu ou les systèmes de recommandation.

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image20.png)

Mais l’IA, en résolvant une incertitude, en introduit aussi une nouvelle. Ses sorties sont probabilistes : elle peut mal comprendre, raisonner de travers ou halluciner. Les tolérances varient énormément selon les scénarios et les utilisateurs. Il faut donc demander :

**Les utilisateurs et le système peuvent-ils supporter l’incertitude ajoutée par l’IA ?** Dans le service client, si l’IA comprend mal l’intention, l’utilisateur peut souvent corriger immédiatement. Dans une approbation financière automatisée, une erreur peut avoir des conséquences graves. Dans la génération d’avatar, un résultat mauvais peut être régénéré ; dans un plan de construction, une erreur de détail peut créer un risque réel.

**La précision de l’IA atteint-elle la ligne minimale du scénario ? Cette ligne dépend de l’usage.** Pour classer des photos personnelles par visage, 80 % de précision peut suffire, car l’utilisateur peut corriger quelques cas. Pour la sécurité, manquer 20 % de cibles suspectes est inacceptable. Pour du contenu social, une créativité de 60/100 peut suffire si l’utilisateur retouche. Pour une clause juridique, même 95/100 peut être insuffisant. Il faut connaître la marge d’erreur acceptable de votre scénario.

**Quand l’IA se trompe, existe-t-il un moyen de réparation ?** Dans un workflow fixe, vous pouvez mettre une validation humaine aux points clés pour localiser l’incertitude. Si le workflow lui-même est incertain, chaque étape peut dériver et il devient difficile de savoir quand intervenir. En restauration de photo ancienne, un résultat peu réaliste peut être rejeté ; en aide au diagnostic médical, une anomalie mal localisée peut être beaucoup plus grave.

**Pouvez-vous mesurer et optimiser la performance de l’IA ?** Si la tâche n’a pas de critère clair de vrai ou faux, comment savoir si l’IA réussit ? Si le feedback arrive très tard, comment itérer ? Sans mesure, l’incertitude devient une boîte noire. Un système de recommandation peut suivre clics et durée de consultation ; une publicité créative ne révèle parfois sa qualité qu’après la campagne.

Le jugement mûr n’est pas « il y a de l’incertitude, donc on peut utiliser l’IA », mais « cette incertitude peut être traitée par l’IA, et je peux gérer la nouvelle incertitude qu’elle introduit ». Il faut développer cette capacité de jugement : **sur ce point de fonction, jusqu’où l’IA aide-t-elle, cela vaut-il l’investissement, et quelle manière d’investir offre le meilleur rapport coût-valeur ?** Cette capacité vous évitera beaucoup de détours lors de vos futurs choix produit.

# 5. Une fois l’application prête, comment trouver les premiers vrais utilisateurs à partir de zéro ?

Quand vous avez enfin construit une application, le problème suivant devient : comment faire apparaître les premiers vrais utilisateurs ?

À ce stade, beaucoup d’équipes ont une illusion : puisque le produit existe, il suffit maintenant de le promouvoir, d’acheter de la visibilité ou de chercher de l’exposition ; plus de gens le verront, et tout démarrera naturellement. Mais si vous poursuivez trop vite une exposition massive, vous tombez facilement dans un piège classique : vous brûlez du temps et du budget précieux, les données montrent que des gens sont venus, mais vous ne savez toujours pas si quelqu’un veut vraiment l’utiliser dans la durée.

La chose la plus importante à cette étape tient en une phrase : **prouver au coût le plus faible possible que certaines personnes veulent réellement utiliser cette application, et qu’elles acceptent de revenir après l’avoir utilisée**. Dans le langage produit et croissance, on appelle généralement cette étape le « cold start ».

Le cold start consiste à faire démarrer un produit tout neuf alors que presque tout est à zéro. Vous n’avez pas de base utilisateurs, pas de bouche-à-oreille, pas de volume de recherche, pas de reconnaissance de marque, et presque tous les indicateurs sont à 0. Dans cet environnement froid, vous devez faire apparaître les premières personnes réellement prêtes à utiliser le produit, puis construire autour d’elles une première boucle d’usage.

Ce travail est très différent de l’optimisation d’un produit qui possède déjà utilisateurs et données. On peut avancer en quatre étapes simples :

1. Comprendre d’abord que la croissance se divise en 0–1 et 1–N, et savoir ce qu’il faut résoudre maintenant.
2. Clarifier qui vous devez vraiment aller chercher, sans regarder seulement l’utilisateur final.
3. Une fois les cibles clarifiées, choisir une ou deux voies de cold start adaptées à vos ressources.
4. Dans une réalité de ressources limitées, apprendre à choisir et concentrer l’effort sur la partie la plus critique.

## 5.1 Distinguer d’abord deux étapes : 0–1 et 1–N

Avant de parler de trouver des utilisateurs, clarifiez une chose : **la croissance se fait par étapes**. Si vous mélangez toutes les tâches de croissance, vous ne saurez pas où concentrer votre énergie. La distinction la plus simple et la plus pratique est : 0–1 et 1–N.

### 0–1 : comment démarrer quand personne n’utilise encore

0–1 désigne le passage de zéro utilisateur à un petit groupe de personnes réellement prêtes à utiliser. Le « froid » du cold start vient du fait qu’au début, presque tous les indicateurs sont nuls : pas de téléchargements, pas de recherches, pas de bouche-à-oreille ; votre application n’existe presque pas dans le monde.

À ce moment, vous ne pouvez pas compter sur le trafic naturel ou la chance. Vous devez agir et construire les premières fondations.

**Trouver un petit groupe de seed users réellement prêts à utiliser**, pas simplement des connaissances qui ouvrent l’application par politesse ou curiosité. Ces personnes doivent avoir un vrai besoin lié au problème que vous résolvez.

**Préparer la première expérience d’usage et l’offre initiale**, pour que l’utilisateur qui entre ne voie pas une coquille vide. Même si les fonctions ne sont pas complètes, il doit pouvoir accomplir une opération centrale complète et ressentir la valeur.

**Expliquer simplement ce que fait le produit et quel problème il résout.** Sans marque connue, l’utilisateur ne vous accorde que quelques secondes d’attention. Il doit comprendre très vite « en quoi cela m’aide ».

**Obtenir un premier canal de contact**, pour mettre ce message devant des utilisateurs potentiels. Cela peut être une petite communauté, un forum, un cercle d’amis. La taille compte moins que la précision avec laquelle vous atteignez les personnes qui en ont vraiment besoin.

En 0–1, l’essentiel est de faire entrer les premières personnes avec un vrai besoin et de leur faire traverser une boucle complète : arrivée, usage, feedback. Quand cette boucle fonctionne, vous prouvez que l’application n’est pas un concept suspendu dans l’air, mais quelque chose que des gens veulent et utilisent.

### 1–N : comment passer à l’échelle quand des gens veulent déjà utiliser

Quand vous accumulez progressivement un groupe d’utilisateurs qui reviennent, la question devient : comment passer de dizaines ou centaines de personnes à des milliers, dizaines de milliers, voire plus. C’est ce que l’on appelle généralement croissance, expansion ou mise à l’échelle.

En 1–N, vous commencez à vous préoccuper de sujets plus complexes : mécanismes, organisation, monétisation, marque, équipe. Par exemple :

**Avez-vous trouvé des canaux d’acquisition relativement stables**, et savez-vous à peu près combien de nouveaux utilisateurs apporte une unité de budget ou de temps ? À ce stade, il ne s’agit plus de chance, mais de chemins de croissance répétables et prévisibles.

**Avez-vous commencé à construire des mécanismes de service**, comme support client, opérations, éducation utilisateur ? Avec plus d’utilisateurs, vous ne pouvez plus accompagner tout le monde un par un comme au début ; il faut des systèmes standardisés.

**Comment ce produit gagnera-t-il de l’argent ?** Abonnement, paiement unique, services à valeur ajoutée ou autre ? Le modèle économique n’a pas besoin d’être parfaitement clair dès le premier jour, mais en 1–N, il faut penser sérieusement à la durabilité.

**Quelle impression de marque voulez-vous laisser ?** Au début, vous diffusez peut-être dans un petit cercle ; avec l’échelle, vous devez réfléchir à la manière dont davantage de personnes se souviennent de vous, vous font confiance et vous recommandent.

**Quelles capacités manquent encore à l’équipe, et quels maillons doivent être suivis durablement ?** Une personne ou une petite équipe peut porter 0–1, mais 1–N demande souvent plus de rôles.

Ces sujets sont importants, mais si vous les abordez trop tôt, vous risquez de tourner à vide. Tant que vous ne savez pas si des gens veulent vraiment utiliser et rester, parler modèle économique et marque détourne l’attention du point le plus urgent.

### Pourquoi se concentrer d’abord sur 0–1 ?

Pour un développeur indépendant ou une petite équipe, **0–1 est la priorité réelle**. La raison est simple : si vous ne trouvez pas les premiers vrais utilisateurs, toutes les discussions sur l’échelle, la monétisation et la marque restent vides.

Le 0–1 est le moment le plus fragile et le plus critique du cycle de vie du produit. Il décide si vous pouvez prouver la valeur, établir la confiance initiale et poser la base de la croissance future. Ce n’est qu’après avoir réellement traversé 0–1 que vous pouvez parler sérieusement de 1–N.

Ensuite, concentrons-nous sur 0–1 : clarifier d’abord **qui chercher**, puis discuter des chemins concrets de cold start.

## 5.2 Les cibles du cold start : seed users, offre, trafic et canaux

Selon le type d’application, on rencontre souvent plusieurs cibles clés : seed users, côté offre, côté trafic et côté canal.

### Première catégorie : les seed users

**Les seed users sont les premiers utilisateurs que vous atteignez.** Ils sont peu nombreux, mais très proches de votre profil cible. Ce que vous devez obtenir d’eux n’est pas seulement des inscriptions et données d’usage, mais aussi un feedback de première main sur la direction et l’expérience.

- Pour un outil personnel, les seed users peuvent être les personnes qui souffrent depuis longtemps d’un problème précis : créateurs de contenu qui organisent souvent de longs textes, professionnels qui préparent souvent des rapports, étudiants qui manipulent beaucoup de documents.
- Pour une application éducative, ce peut être un petit groupe de candidats préparant le même examen, ou des parents d’un même niveau scolaire.

Au cold start, fixez-vous un objectif clair : par exemple, trouver d’abord 20 à 50 utilisateurs prêts à coopérer, puis passer une ou deux semaines à utiliser le produit et discuter avec eux. L’important n’est pas la quantité, mais la densité d’échange qui clarifie la logique produit.

### Deuxième catégorie : le côté offre

**Dans certains produits de plateforme à deux ou plusieurs côtés**, avoir seulement des utilisateurs finaux ne suffit pas. Sans assez d’offre, les utilisateurs entrent puis repartent vite, parce qu’ils ne trouvent rien à utiliser.

**Le côté offre peut être composé de créateurs, enseignants, prestataires, marchands, chauffeurs, propriétaires**, etc. Il détermine la richesse et l’attractivité de la plateforme.

- Pour une plateforme de ressources pour designers, il faut d’abord convaincre des designers de téléverser des travaux, même seulement une petite partie gratuite. Sinon, les utilisateurs ne voient que quelques exemples et ne restent pas.
- Pour un outil de réservation en ligne, sans marchands ou institutions prêts à accepter des réservations, les utilisateurs ne trouvent aucune cible réelle.

Au cold start, soyez clair : résolvez-vous d’abord le côté demande, le côté offre, ou les deux en même temps ? Beaucoup de plateformes ont traversé ce choix. Le simple fait de reconnaître ce problème structurel vous place déjà devant ceux qui ne pensent qu’à attirer des utilisateurs finaux.

### Troisième catégorie : le côté trafic

Le côté trafic regroupe les personnes ou organisations capables de **diriger en peu de temps une quantité significative d’attention vers vous**. Il peut s’agir de créateurs, comptes verticaux, médias, gestionnaires de communautés ou plateformes d’outils avec beaucoup d’utilisateurs.

- Pour un outil professionnel, convaincre quelques créateurs spécialisés carrière de présenter naturellement l’application peut attirer rapidement des personnes sensibles aux outils d’efficacité.
- Pour un assistant de sujets destiné aux créateurs Xiaohongshu, coopérer avec plusieurs créateurs de taille moyenne et leur faire montrer l’usage en situation peut transformer leur audience en seed users potentiels.

Au cold start, ne cherchez pas forcément les plus gros comptes. Des sources de trafic plus petites, mais dont l’audience recoupe fortement votre cible, sont souvent plus ouvertes à des essais personnalisés. Votre tâche est de les trouver, puis de proposer une collaboration claire : ce que vous faites et ce que l’autre y gagne.

### Quatrième catégorie : le côté canal

Les canaux sont les organisations ou entrées qui vous aident à **atteindre de manière stable des utilisateurs cibles dans un scénario donné**. La différence avec le trafic est que le trafic apporte plutôt une attention ponctuelle, tandis qu’un canal crée une connexion plus longue et structurée.

- Écoles, organismes de formation, entreprises, associations professionnelles et fournisseurs de logiciels sont des canaux typiques.
- Si votre application aide vraiment une institution à gagner en efficacité, réduire ses coûts ou améliorer son service, elle a une raison de la recommander à de nombreux utilisateurs dans son système.

Au cold start, ne rêvez pas de signer un grand canal d’un coup. Commencez par un petit pilote : une ou deux classes, une petite entreprise, une communauté locale. Laissez-les utiliser le produit en interne, puis décidez d’élargir selon les retours.

Découper les cibles du cold start évite de mettre toute l’énergie sur l’acquisition d’utilisateurs finaux et d’ignorer les autres maillons importants. Selon votre produit, dessinez une carte simple des rôles : qui est chaque cible, combien y en a-t-il maintenant, quels sont les objectifs à court terme. Une fois cette carte claire, vous pouvez parler des chemins.

## 5.3 Méthodes de cold start : trois chemins principaux selon les cibles

Quand vous savez qui chercher, la question suivante est : par quel chemin les trouver et les servir ?

En pratique, vous n’avez pas à vous limiter à une seule méthode. Choisissez selon vos ressources et les caractéristiques du produit. La plupart du temps, vous aurez un chemin principal et un ou deux compléments.

### Chemin 1 : ouvrir la brèche avec les seed users, utiliser d’abord votre portée privée

Ce chemin vise surtout les seed users et une partie du côté offre.

Pour la plupart des développeurs indépendants, petites équipes et startups en démarrage, le moyen le plus réaliste, le moins coûteux et le plus facile à contrôler consiste à partir de sa portée privée existante.

La portée privée n’est pas un concept d’opérations compliqué. Ce sont simplement les personnes que vous pouvez déjà contacter activement : votre cercle d’amis, des communautés métier auxquelles vous participez, des groupes d’intérêt où vous avez une voix, les lecteurs d’un compte que vous entretenez.

Dans ce chemin, il y a trois actions clés :

1. **Inviter activement un petit nombre d’utilisateurs très ciblés à essayer**
   L’important n’est pas le volume, mais la correspondance avec le profil cible. Si vous construisez un outil de CV pour les jeunes actifs, cherchez d’abord des diplômés récents ou étudiants en recherche de stage, pas des connaissances avec dix ans d’expérience.
   Dans l’invitation, dites clairement :
   1. pour quelle personne et quel problème l’application est faite ;
   2. combien de temps vous espérez que l’essai prendra ;
   3. comment vous traiterez leur feedback.
2. **Collecter consciemment les retours et améliorer vite**
   La valeur des seed users n’est pas de gonfler les chiffres, mais de révéler les angles morts. Utilisez des discussions un à un ou de petits questionnaires pour comprendre dans quel scénario ils pensent au produit, où ils bloquent, ce qui est utile ou inutile.
3. **Faire produire aux seed users les premiers contenus ou cas**
   Les traces d’usage réelles sont déjà du contenu : avis, captures comparatives, histoires d’utilisation. Elles serviront plus tard à présenter le produit.

Pendant ce processus, résistez à l’envie de diffusion massive. Si vous ne servez pas bien ces quelques dizaines de personnes, exposer davantage le produit ne fera qu’amplifier les problèmes.

### Chemin 2 : utiliser contenu ou bénéfices pour donner une première raison claire

Ce chemin vise surtout seed users et côté trafic, et il est fréquent dans les marchés compétitifs.

Quand l’utilisateur a beaucoup d’alternatives, « venez essayer ce nouveau produit » suffit rarement. Il faut une raison plus claire et plus attirante pour qu’il accepte de faire le premier pas.

Deux approches courantes :

1. Utiliser des **bénéfices concrets** comme accroche.
   1. Une nouvelle plateforme de cours peut proposer au début quelques cours gratuits de qualité, ou des places limitées en promotion.
   2. Une application e-commerce peut utiliser coupons, réductions ou offres groupées pour rendre le premier essai peu risqué.
2. **Attirer durablement par du contenu vertical**
   Sur Douyin, Xiaohongshu, un compte public, un podcast ou autre, publiez régulièrement du contenu utile autour d’un thème vertical qui intéresse votre cible : conseils de carrière, programmation, gestion émotionnelle, cuisine, méthodes d’apprentissage.
   Les personnes attirées par le contenu ne deviennent pas toujours immédiatement utilisatrices, mais elles vous accordent déjà une base de confiance. Quand vous présentez l’outil au bon moment, elles l’examinent plus sérieusement.

Si vous choisissez le contenu, acceptez que ce soit plus lent au départ mais plus durable. Il faut produire du contenu solide et ne pas se laisser guider uniquement par les vues ou lectures. **Ce qui aide vraiment le cold start, c’est le petit groupe qui trouve une résonance dans votre contenu, pas le trafic bref qui arrive puis disparaît.** Dans tous les cas, il faut guider les personnes vers l’application et leur faire vivre une expérience complète.

### Chemin 3 : s’appuyer sur de grandes plateformes et trouver une brèche dans un écosystème existant

Ce chemin vise surtout le côté offre, le côté trafic et les canaux.

Dans beaucoup de domaines, créer son propre écosystème de zéro coûte très cher. Mais si vous vous considérez d’abord comme une nouvelle boutique, un nouveau compte ou un nouveau plugin dans une grande plateforme, la difficulté de cold start baisse fortement.

- En e-commerce, entrer sur Taobao, Pinduoduo, JD ou d’autres plateformes évite de construire paiement, logistique et système d’avis à partir de zéro. Les méthodes courantes incluent ventes par créateurs, promotion interne, emplacements d’activité et live.
- Les outils et applications de contenu peuvent créer des plugins ou mini-outils pour des plateformes mûres et publier leurs services dans des marketplaces ouvertes, afin que les utilisateurs avec un besoin explicite les trouvent plus facilement.

La logique est **d’admettre que les grandes plateformes ont déjà concentré les utilisateurs dans certains scénarios, et que votre travail consiste à trouver le petit coin qui correspond à votre produit**. S’appuyer sur elles ne veut pas dire renoncer à l’indépendance ; c’est une façon plus réaliste d’ouvrir la situation au cold start.

## 5.4 Choisir quand les ressources sont limitées : au stade 0–1, ne faire que la partie la plus critique

Vous avez confirmé être encore en 0–1, clarifié les cibles, choisi à peu près un chemin de cold start, puis vous découvrez que les ressources manquent.

Les ressources ne sont pas seulement l’argent : temps, énergie, personnes, attention, relations et canaux comptent aussi. Au cold start, si vous voulez « essayer plusieurs voies à la fois », le résultat est souvent le même : beaucoup d’activité, peu de profondeur, aucun résultat convaincant et une mauvaise compréhension des utilisateurs.

À cette étape, il faut réduire volontairement. L’objectif n’est pas de faire beaucoup, mais de faire solidement la petite partie la plus importante. Vous pouvez reconstruire votre action depuis trois angles.

### Du but à la tâche concrète

Beaucoup de gens se fixent des objectifs comme « voir la réaction du marché », « commencer à faire des utilisateurs » ou « attirer une vague d’essais ». C’est trop vague pour savoir si vos actions quotidiennes avancent vraiment.

Une méthode plus réaliste consiste à resserrer l’objectif en une petite tâche : dans les quatre prochaines semaines, faire utiliser plusieurs fois l’application en situation réelle par vingt utilisateurs correspondant au profil cible, et obtenir d’eux des retours assez concrets.

**Un segment n’est pas “toute personne pouvant utiliser ce type d’outil”, mais un groupe que vous pouvez décrire avec une étiquette précise.** Si votre outil génère des rapports de travail, la cible peut être « professionnels des opérations Internet avec 1 à 3 ans d’expérience », et non « salariés ». Ces personnes ont un problème concret et continu : elles doivent faire des rapports, ont peu de temps et veulent un rendu professionnel.

**Une tâche d’usage complète doit aussi être explicite.** Pour cet outil de rapport, elle peut être : l’utilisateur rassemble les données et matériaux de la semaine, les importe, génère un brouillon, le révise deux ou trois fois selon la structure proposée, exporte en PPT ou document, puis l’utilise vraiment en réunion. S’il clique deux fois par curiosité puis ferme, ce n’est pas une utilisation complète.

Les retours doivent être précis :

- lors de l’import des données, y a-t-il une étape incompréhensible, une entrée introuvable ou des erreurs de clic fréquentes ;
- la structure générée correspond-elle aux habitudes de rapport de son entreprise, par exemple « contexte–objectif–processus–résultat » ;
- quelles pages sont vraiment utilisées, lesquelles sont supprimées à chaque fois ;
- après usage, sent-il clairement que la préparation passe de trois heures à une heure, ou seulement que « c’est un peu plus pratique » sans pouvoir le dire.

### Ne pas tout essayer une fois

Une fois le petit objectif défini, la question suivante est : comment trouver ces vingt utilisateurs et les accompagner dans leur scénario réel ?

Les méthodes sont nombreuses : contenu, communauté, publicité, créateurs, institutions, plateformes. Mais avec des ressources limitées, vous n’avez pas besoin de connaître toutes les méthodes ; vous devez choisir **celle qui est la plus naturelle pour vous maintenant et la plus facile à poursuivre**.

Si vous écrivez déjà des articles longs et avez des lecteurs attentifs, commencez par le contenu. Rédigez par exemple un récit très concret de préparation d’un vrai rapport mensuel avec votre outil : données brutes, structure, brouillon, corrections, présentation finale. Ajoutez des captures avant/après pour montrer le gain de temps, de clarté et de qualité. À la fin, ne mettez pas seulement un lien froid : dites clairement que si le lecteur fait aussi des rapports opérationnels et veut vous aider à améliorer l’outil, il peut vous contacter ou remplir un formulaire ; vous sélectionnerez vingt personnes pour un suivi un à un.

Si vous avez plusieurs communautés stables, comme un groupe d’opérations ou un groupe d’anciens élèves, partez plutôt de cette portée privée. Dites franchement : « je construis un outil de génération de rapports ; il fonctionne déjà mais reste brut ; je cherche des personnes qui ont vraiment ce besoin pour le tester avec moi ». Parmi les volontaires, choisissez les plus proches du profil, créez un petit groupe, demandez-leur de tester, d’envoyer captures, critiques et idées, puis suivez chaque jour.

Si vous avez des contacts dans un secteur vertical, par exemple des enseignants en formation ou un responsable de petite entreprise, faites un pilote dans une classe ou une petite équipe. Proposez un plan clair : pendant un mois, tous les rapports hebdomadaires de cette équipe seront générés avec votre outil ; vous fournissez support et ajustements ; en échange, ils vous accordent dix minutes par semaine pour dire ce qui est fluide et ce qui est pénible.

### Ne peaufiner que la partie la plus critique

Quand vous avez un petit objectif et un chemin principal, imposez-vous une contrainte : ne travailler que cette petite partie.

Les équipes en cold start partagent souvent une émotion : l’anxiété. Avec l’anxiété, on cherche vite de nouvelles actions : créer un compte vidéo court, tourner des tutoriels, dépenser un petit budget publicitaire, contacter des médias. **Chaque action paraît raisonnable seule, mais ensemble elles vous font changer de direction chaque jour sans approfondir aucune voie.**

Vous pouvez définir une contrainte très concrète : pendant les quatre prochaines semaines, ne faire que deux choses. Premièrement, autour de ces vingt utilisateurs, améliorer encore et encore l’expérience en situation réelle pour passer de « à peine utilisable » à « globalement fluide ». Deuxièmement, le long du chemin principal choisi, trouver quelques nouveaux utilisateurs, enregistrer leurs comportements et retours, puis comparer leurs points communs et différences avec le premier groupe.

Pendant ces quatre semaines, face à toute nouvelle idée ou opportunité, demandez-vous : est-ce que cela améliore clairement l’usage de ces vingt utilisateurs, ou m’aide vraiment à trouver le prochain groupe similaire ?

Cette méthode reconnaît une réalité du cold start : vous avez peu d’informations et ne pouvez pas juger correctement dix directions à la fois. Mieux vaut faire des améliorations vérifiables dans un scénario concret et auprès d’un groupe précis. Par exemple, vous pouvez voir clairement que chez ces jeunes profils d’opérations, l’outil réduit vraiment le temps de préparation des rapports et aide vraiment à clarifier les points clés.

Vous devez faire tourner une boucle : **trouver des utilisateurs -> guider l’usage -> collecter le feedback -> améliorer l’expérience -> obtenir une utilisation continue**. Ce n’est qu’après avoir fait tourner cette boucle que vous saurez quels utilisateurs chercher, avec quels mots leur parler, où le parcours casse le plus souvent et quels ajustements les ramènent. Ajouter un nouveau canal ou tester un autre partenariat n’a de sens qu’après cela.

# Résumé

Revenons à la question initiale : si je veux construire une application, par où commencer de manière fiable ?

Tout cet article suit une ligne principale : **clarifier d’abord ce qu’est une idée, comprendre sa relation avec les besoins utilisateurs, puis la découper progressivement en un chemin complet qui peut être construit, utilisé, amélioré, amplifié par l’IA et relié à des utilisateurs.**

Dans le premier chapitre, nous sommes partis de l’idée elle-même. Une idée n’est plus seulement « ça a l’air cool » dans votre tête ; elle doit viser un groupe clair d’utilisateurs, **être ancrée dans un scénario concret, aider à accomplir une tâche précise et proposer une meilleure méthode que l’existant**. Vous avez appris à examiner vos idées à travers le jeu, le parcours utilisateur, la tâche et le problème résolu. Vous avez aussi vu le fossé entre idée et besoin utilisateur, contenu l’auto-satisfaction, distingué vrai besoin et faux besoin, et compris que les bonnes et mauvaises idées divergent très tôt. Vous avez appris à ne plus attendre passivement l’inspiration, mais à chercher dans votre vie, votre audience, les espaces publics et les produits existants ; puis à résumer une idée en une phrase, utiliser l’IA pour brainstormer et trouver une différenciation par groupe et scénario.

Dans le deuxième chapitre, vous êtes passé de la réflexion à l’action. Vous avez appris à alterner divergence et convergence, à ouvrir les idées avec le double diamant puis à les resserrer selon valeur utilisateur, faisabilité et coût en temps. Vous avez pratiqué le passage de l’abstrait au concret, en transformant des souhaits vagues comme « je veux faire une application d’efficacité » en actions minimales exécutables. Vous avez dessiné avant de construire, séparé l’application en page d’entrée, page d’opération et page de résultat, et cartographié le chemin de l’utilisateur. Vous avez aussi cessé de voir les références comme une copie, pour analyser navigation, formulaires, résultats et guidage afin d’emprunter l’expérience mûre. Surtout, vous n’attendez plus que le produit soit fini pour parler aux utilisateurs : vous demandez dès le prototype et la version semi-finie.

Dans le troisième chapitre, vous avez construit vos critères pour distinguer ce qui est simplement utilisable de ce qui est vraiment bon. Vous ne dites plus vaguement « cette application est pas mal » ; vous regardez si elle économise du temps, réduit les erreurs, diminue le coût de communication et allège la charge mentale. Vous savez qu’une bonne application doit être presque auto-explicative, apparaître naturellement dans les scénarios clés et porter un vrai esprit d’aide. Vous avez aussi compris la différence entre C-end et B-end : le premier se concentre davantage sur l’émotion et la diffusion, le second sur efficacité, coût, risque et conformité. Vous ne vous fiez plus seulement à votre préférence ; vous utilisez feedback, rétention, fréquence de retour et recommandation pour décider si l’investissement vaut la peine.

Dans le quatrième chapitre, vous avez élargi la perspective du produit aux capacités IA. Vous avez appris à résister à l’impulsion de faire de l’IA pour l’IA, et à poser deux questions : l’application tient-elle sans IA, et qu’est-ce que l’IA améliore concrètement ? Vous avez vu les capacités et limites de l’IA dans le texte, l’image, la vidéo et l’automatisation, et compris où déléguer au modèle et où garder une validation humaine. Vous avez aussi appris à regarder des indicateurs plus profonds : temps de tâche réduit, qualité de résultat améliorée, fréquence d’usage plus élevée, volonté de payer pour des fonctions IA.

Dans le cinquième chapitre, tout revient à une réalité : même avec une bonne application et de l’IA, sans utilisateurs, la valeur reste zéro. Vous avez distingué 0–1 et 1–N, mis de côté temporairement les grands sujets de marque, organisation et échelle, et concentré l’attention sur une chose : faire utiliser le produit à vingt vrais utilisateurs et les faire revenir. Vous avez appris à cold-starter par trois lignes : seed users proches de vous, contenu ou bénéfices limités, plateformes et canaux existants. Vous avez aussi séparé les objets : seed users, côté offre, côté trafic et côté canal. Quand les ressources sont limitées, vous choisissez la voie la plus naturelle et la plus facile à lancer, puis vous l’approfondissez au lieu d’ouvrir dix canaux à moitié faits.

En réunissant tout cela, la méthode n’a rien de mystérieux : **partir d’une idée fiable enracinée dans un vrai besoin ; utiliser dessin, écriture et découpage pour la faire converger vers une application minimale viable ; utiliser de vrais utilisateurs et des indicateurs explicites pour la polir ; introduire raisonnablement l’IA aux points clés ; enfin, avec des ressources limitées, utiliser le bon cold start pour trouver les premières personnes prêtes à payer.**

La suite consiste simplement à abandonner trop d’imagination, choisir une direction, la construire et la lancer pour qu’elle soit testée par le monde réel. **Toutes les discussions sur les idées, les méthodes, l’IA et la croissance doivent finir sur une personne concrète, un scénario concret et une tâche concrète.**

C’est pourquoi un début brut n’est pas grave. Fonctions incomplètes, flux rigides, interface simple, peu importe. Même si personne ne répond au lancement, même si personne ne veut s’inscrire ou payer, ce n’est pas une conclusion finale. Ce sont des états de processus qui indiquent seulement quoi modifier ensuite. Ce qui compte est de progresser, de faire des rétrospectives, de résumer, de relever vos limites et de rencontrer davantage de personnes prêtes à donner des conseils utiles.

À ce stade, l’auteur pense qu’il suffit de profiter du processus. Comme le dit le jeu narratif bien connu *To the Moon* :

**_"The ending isn't any more important than any of the moments leading to it."_**

**_La fin n’est jamais plus importante que le chemin qui y mène._**

![](../../../zh-cn/stage-1/appendix-a-product-thinking/images/image21.png)
