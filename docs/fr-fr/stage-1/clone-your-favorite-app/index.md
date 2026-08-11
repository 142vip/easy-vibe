---
title: 'Reproduire une capture : votre premier exercice d’imitation'
description: 'Suivez le cours pas à pas pour transformer une capture de produit en une page ou un mini-jeu qui s’ouvre et réagit.'
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'

const duration = 'Environ <strong>2 heures</strong>'
</script>

# Reproduire une capture : votre premier exercice d’imitation

Dans la leçon précédente, nous avons demandé à l’IA d’écrire un programme à partir d’une phrase. Cette fois, nous partirons de quelque chose de plus facile à observer : <strong>choisissez une capture qui vous plaît et demandez à l’IA de construire à partir d’elle.</strong>

C’est un peu comme monter des briques en regardant une photo. Vous n’avez pas besoin de décrire à l’avance chaque couleur, chaque espace et la position de chaque bouton : la capture communique déjà une grande partie de ces informations.

<div style="text-align: center;">
<div style="display: inline-block; padding: 8px 20px; border-radius: 8px; border: 1px dashed #FFB6C1; background: linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 100%); margin: 12px 0;">
  <span style="font-size: 15px; font-weight: 500; color: #666;">Commencez par reproduire, puis transformez peu à peu le résultat en votre propre création 🧱</span>
</div>
</div>

## À quoi sert cette leçon ?

<ChapterIntroduction :duration="duration" :tags="['Reproduction de capture', 'Programmation avec l’IA', 'Exercice débutant']" coreOutput="Un petit projet" expectedOutput="Une page ou un mini-jeu qui s’ouvre et réagit à une action">

Nous partirons de la capture d’un produit réel pour créer un petit projet utilisable dans le navigateur. Vous pouvez choisir une page d’accueil, un tableau de bord ou un jeu simple.

Cette leçon entraîne une seule chose : <strong>trouver une capture qui vous plaît, la donner à l’IA et expliquer avec vos mots ce que vous voulez réaliser.</strong>

Vous n’avez pas besoin de savoir programmer ni de préparer un cahier des charges complet. Laissez l’IA produire une première version, regardez le résultat, puis décrivez ce qui doit changer.

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'Choisir une image', description: 'Trouvez une page qui vous plaît' },
      { title: 'La donner à l’IA', description: 'Glissez-la dans le chat' },
      { title: 'Formuler une phrase', description: 'Demandez à l’IA de la construire' },
      { title: 'Améliorer', description: 'Corrigez une différence à la fois' }
    ]" />
  </ClientOnly>
</div>

## 1. Choisissez le type de création

Avant d’ouvrir l’outil, décidez du petit résultat que vous voulez obtenir aujourd’hui.

Le but n’est pas de produire un logiciel complet avec toutes ses fonctions. Il suffit d’avoir <strong>un écran qui s’ouvre, se comprend et propose une interaction simple</strong>. Un périmètre réduit augmente les chances de réussir dès le premier essai.

Choisissez l’une de ces possibilités :

- <strong>Page d’accueil d’un produit :</strong> titre, présentation, image et bouton.
- <strong>Tableau de bord SaaS :</strong> barre latérale, cartes de données et graphiques.
- <strong>Jeu simple :</strong> déplacement, clic ou petit objectif.

Avant de retenir une référence, posez-vous trois questions :

1. Le contenu principal est-il compréhensible avec une seule capture ?
2. Y a-t-il dans cette page un élément qui vous plaît vraiment ?
3. Après l’avoir construite, pourrez-vous rapidement juger si le résultat lui ressemble ?

Si vous aimez le grand titre et les couleurs d’une page d’accueil, capturez son premier écran. Si vous préférez l’univers en blocs d’un jeu, enregistrez une image qui le montre clairement.

::: tip Jusqu’où faut-il aller dans la ressemblance ?
Plus le résultat est proche, plus vous aurez appris à observer les détails et à expliquer les différences à l’IA. Placez à la fin la référence et votre version côte à côte : vous semblent-elles similaires à 50 %, 70 % ou 90 % ?
:::

::: tip Ne réalisez qu’un écran
Ne commencez pas par ajouter connexion, paiement, chat, administration et application mobile. L’exercice consiste à reproduire l’écran placé devant vous.
:::

## 2. Construisez une page avec le professeur

Observez d’abord le processus complet. Lorsqu’il est clair, vous pourrez le refaire avec votre propre capture.

Le professeur a créé un dossier vide et l’a ouvert dans Trae. Le projet s’appelait `trae-screenshot-demo` et ne contenait encore ni page ni code.

### 2.1 Donnez l’image de référence à Trae

La référence vient d’une page de démonstration Framer. Le grand titre, la navigation, le paysage violet et les petits contrôles sont visibles sur une seule image.

![Capture de la page placée dans Trae](../../../zh-cn/stage-1/clone-your-favorite-app/images/framer-official-interface.jpg)

_Source de la capture : [Framer Website Builder](https://www.framer.com/solutions/website-builder/)_

Après avoir glissé l’image dans le chat de Trae, le professeur a écrit une demande très courte :

```text
Crée une page web qui ressemble à cette image. Ouvre-la pour moi lorsqu’elle est prête.
```

L’image indique à Trae l’aspect général de la page ; la phrase précise qu’il doit la transformer en page web.

Après l’envoi, attendez que Trae termine de créer les fichiers. N’envoyez pas plusieurs nouvelles demandes avant la fin de la première.

### 2.2 Regardez la première version

Trae a créé `index.html`, `styles.css` et `script.js`, puis a ouvert la page dans le navigateur. Cette animation montre le résultat obtenu pendant la leçon :

![Page Wishlabs générée et exécutée à partir de la capture](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-wishlabs.gif)

N’étudiez pas encore le code. Regardez la page et comparez-la à la référence :

- L’ambiance du ciel et des montagnes violettes est conservée.
- Un grand titre occupe toujours le centre.
- La navigation se trouve en haut et les commandes en bas.
- Texte, boutons et images composent un premier écran complet.

Ce n’est pas une copie exacte, mais la structure et l’ambiance les plus visibles sont là. C’est une bonne première version.

### 2.3 La première version doit surtout être visible

Ne recommencez pas tout simplement parce que la police ou la position d’un bouton diffère légèrement. Vérifiez d’abord que la page s’ouvre, puis choisissez le problème le plus évident.

Si le titre est trop petit, dites :

```text
Agrandis le titre situé au centre.
```

Rouvrez la page après la modification. Si elle se rapproche de ce que vous vouliez, l’itération a été utile.

::: tip Des mots ordinaires suffisent
Vous construisez quelque chose avec Trae ; vous ne passez pas un examen de rédaction de prompts. Décrivez ce que vous voyez avec vos mots habituels.
:::

## 3. Essayez avec votre propre image

Ouvrez Trae, créez un dossier vide, puis ouvrez ce dossier dans l’éditeur. Un nom simple comme `my-first-page` suffit.

Suivez ensuite ces étapes :

1. Trouvez une capture de site ou de jeu qui vous plaît.
2. Cliquez sur le bouton d’image près du chat et choisissez la capture.
3. Vérifiez que l’image apparaît dans le message.
4. Écrivez une courte demande et envoyez-la.

```text
Crée une page web qui ressemble à cette image.
Ouvre-la pour moi lorsqu’elle est prête.
```

Pour ce premier exercice, inutile de préciser le framework, l’organisation des dossiers ou les noms de fichiers. Laissez Trae les choisir.

Si vous voulez seulement garder le style, et non le nom et les textes d’origine, ajoutez :

```text
Utilise le style de cette image, mais remplace le nom et le contenu par quelque chose de nouveau.
```

Attendez la fin. Si Trae demande l’autorisation de créer des fichiers ou d’exécuter le projet, acceptez. Si la page ne s’ouvre pas automatiquement, dites :

```text
Démarre ce projet. Je veux voir le résultat.
```

Lorsque la page apparaît, prenez dix secondes pour vérifier qu’elle s’ouvre, que le contenu principal est présent et que le bouton principal réagit. Ne commencez pas par modifier cinq choses en même temps.

## 4. La même méthode fonctionne pour d’autres produits

La méthode de la capture ne se limite pas aux pages d’accueil. Pour le vérifier, le professeur a créé deux autres projets vides : un tableau de données et un jeu de blocs.

### Exemple 1 : un tableau de bord SaaS

Les produits SaaS utilisent souvent des tableaux de bord pour suivre projets, ventes ou utilisateurs. Dans cette capture de Linear, la navigation est à gauche et le contenu à droite.

![Interface officielle du tableau de bord Linear](../../../zh-cn/stage-1/clone-your-favorite-app/images/linear-official-dashboard.png)

_Référence du cours : [Linear Dashboards](https://linear.app/docs/dashboards)_

Le professeur a placé l’image dans Trae et écrit :

```text
Crée un tableau de données semblable à celui-ci.
Utilise des données d’exemple pour le moment.
```

Trae a produit une barre latérale, des cartes et des graphiques. Voici la page ouverte dans le navigateur :

![Tableau de bord généré et exécuté à partir de la capture](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-linear-dashboard.gif)

Les chiffres ne sont pas encore de vraies données d’entreprise, et ce n’est pas grave. Le premier exercice sert à construire la structure du tableau. Vous changerez les libellés et les valeurs une fois la page stable.

### Exemple 2 : un jeu de blocs

Si une page ordinaire ne vous intéresse pas, partez d’une capture de jeu. Le professeur a choisi une image de l’univers en blocs de Minecraft.

![Interface du mode Créatif de Minecraft](../../../zh-cn/stage-1/clone-your-favorite-app/images/minecraft-official-creative-mode.png)

_Référence du cours : [exemple Minecraft sur Microsoft Learn](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/108)_

La demande reste courte :

```text
Crée un jeu de blocs semblable à celui-ci.
Le personnage doit pouvoir se déplacer et poser des blocs.
```

Trae a créé un jeu jouable dans le navigateur, où le personnage peut se déplacer, poser et retirer des blocs :

![Jeu de blocs 2D généré et exécuté à partir de la capture](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-block-game.gif)

Ce résultat est un <strong>jeu 2D vu de côté</strong>. Le personnage se déplace sur un plan, sans profondeur vers l’avant ou l’arrière. Comme la demande disait seulement « jeu de blocs », Trae a choisi l’interprétation la plus simple.

Ouvrez la page, utilisez les flèches et cliquez dans la scène. Si le personnage bouge et que vous pouvez poser des blocs, cette première version 2D fonctionne.

### Réalisez aussi une version 3D

Si vous voulez une vue à la première personne, plus proche de Minecraft, ajoutez clairement « 3D » dans la demande. Le professeur a ouvert un nouveau projet vide, ajouté la même capture et écrit :

```text
Crée un jeu de blocs 3D semblable à celui-ci.
Le joueur doit pouvoir marcher, tourner la caméra et poser des blocs.
```

Cette fois, Trae a créé un véritable monde de blocs en trois dimensions :

![Jeu de blocs 3D généré et exécuté à partir de la capture](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-3d-block-game.gif)

Après avoir choisi « Start Game », utilisez `WASD` pour marcher et la souris pour tourner. Le bouton gauche retire un bloc, le bouton droit en pose un et les touches numériques changent de type de bloc.

La 2D n’est pas toujours meilleure que la 3D, ni l’inverse. Pour un premier jeu, la 2D est plus simple. Si votre idée exige de se déplacer en profondeur dans le monde, précisez que vous voulez de la 3D.

::: tip Rendez le résultat différent
La référence n’est qu’un point de départ. Changez les couleurs, le thème, les textes, les images ou l’interaction pour en faire progressivement votre propre création.
:::

## 5. Que faire si la première version n’est pas satisfaisante ?

Il est normal que la première version soit différente ou qu’un bouton ne réponde pas. Un projet se termine rarement en une phrase. Regardez, modifiez un peu, puis regardez à nouveau.

Une erreur fréquente chez les débutants consiste à réunir tous les problèmes dans un même message. Lorsque trop de choses changent à la fois, vous ne savez plus quelle modification a produit le résultat.

Suivez une règle simple : <strong>choisissez le problème le plus évident à chaque tour.</strong>

### La page ne ressemble pas à la référence

Si une carte est trop haute :

```text
La carte du haut est trop haute. Réduis sa hauteur.
```

Si l’image principale est trop petite :

```text
L’image au centre est trop petite. Agrandis-la.
```

Si le fond est trop sombre :

```text
Le fond est trop sombre. Utilise une couleur plus claire.
```

### La page réagit mal

Si un bouton ne fait rien :

```text
Ce bouton ne réagit pas quand je clique dessus. Corrige-le.
```

Si le personnage ne se déplace pas :

```text
Les touches fléchées ne font rien. Corrige le déplacement.
```

### Vous ne savez pas décrire le problème

Prenez une capture du résultat actuel et dites :

```text
Voici le résultat actuel. Compare-le à la référence et corrige la différence la plus importante.
```

Vous n’avez pas besoin de connaître des termes comme « marge » ou « mise en page adaptative ». « La page paraît trop chargée », « le texte est difficile à lire » ou « la version mobile est désordonnée » sont déjà des descriptions utiles. Corrigez un problème, puis passez au suivant.

## 6. Vérification en classe

Ne regardez pas uniquement une image fixe. Ouvrez le résultat et cliquez ou jouez vous-même.

Vérifiez quatre points :

- <strong>Il s’ouvre :</strong> actualiser la page ne produit ni écran blanc ni erreur.
- <strong>Il se comprend :</strong> une autre personne voit s’il s’agit d’une page d’accueil, d’un tableau de bord ou d’un jeu.
- <strong>Il réagit :</strong> le bouton principal ou les commandes de base fonctionnent.
- <strong>Il reste lisible :</strong> réduire la fenêtre ne fait pas se chevaucher fortement textes et images.

Si l’un de ces points échoue, expliquez précisément à Trae ce que vous avez observé et demandez-lui de ne corriger que ce problème. Lorsque les quatre vérifications réussissent, l’exercice est terminé.

::: tip Terminez une petite création
Connexion, paiement, groupe de discussion et multijoueur ne font pas partie de cette leçon. Une petite page terminée vaut mieux que dix débuts inachevés.
:::

## 📚 Travail à rendre

<StageAssignmentCard title="Construisez votre page à partir d’une capture">

  <p>Choisissez l’image d’un site ou d’un jeu qui vous plaît, donnez-la à l’IA et ne reproduisez qu’un seul écran.</p>

  <ol>
    <li>Conservez la capture de référence.</li>
    <li>Générez la page et améliorez un élément qui ne vous plaît pas.</li>
    <li>Enregistrez une capture de la version corrigée.</li>
  </ol>

  <p>Pour la présentation, placez la référence et votre création côte à côte et expliquez la modification demandée.</p>
</StageAssignmentCard>

## Ce qu’il faut retenir

Nous n’avons pas commencé par du code, mais par une capture. L’exercice tient en quatre étapes :

1. Prenez ou enregistrez une capture.
2. Donnez-la à l’IA.
3. Décrivez la création en une phrase.
4. Corrigez une différence visible à la fois.

L’image indique à l’IA à quoi le produit doit ressembler. Vos mots lui indiquent ce qu’il doit faire. Une fois la première version visible, cliquer, observer et reprendre des captures vous aide à décrire l’amélioration suivante.

Un prompt n’a pas besoin de ressembler à un manuel technique. Demandez une chose simple, faites fonctionner la création, puis poursuivez la conversation à partir de ce que vous avez devant vous. Construire un projet vous semblera déjà beaucoup moins lointain.
