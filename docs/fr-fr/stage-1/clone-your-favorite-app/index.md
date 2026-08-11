---
title: "Reproduire à partir d'une capture : premier exercice d'imitation"
description: "Transformez une capture de produit en page web ou mini-jeu réellement exécutable."
---

# Reproduire à partir d'une capture : premier exercice d'imitation

Dans la leçon précédente, nous avons demandé à l'IA d'écrire un programme à partir d'une phrase. Cette fois, nous partons de quelque chose de plus visuel : **choisissez une capture qui vous plaît et demandez à l'IA de construire à partir de celle-ci**.

L'image montre déjà les couleurs, les espacements, les boutons et la disposition. Il reste à préciser le résultat interactif que vous souhaitez obtenir.

## 1. Choisir un petit objectif

Pour un premier exercice, un seul écran suffit : une page d'accueil, un tableau de bord SaaS ou un mini-jeu avec une action simple. Conservez l'image d'origine afin de la comparer au résultat.

## 2. Construire le premier exemple

En cours, nous avons utilisé cet écran de Framer. La navigation, le grand titre, le paysage violet et les commandes tiennent dans une seule image.

![Écran Framer utilisé comme référence](../../../zh-cn/stage-1/clone-your-favorite-app/images/framer-official-interface.jpg)

_Référence : [Framer Website Builder](https://www.framer.com/solutions/website-builder/)_

Créez un dossier vide, ouvrez-le dans Trae, puis déposez l'image dans la conversation. Écrivez :

```text
Crée une page web qui ressemble à cette image. Ouvre-la quand elle est prête.
```

Attendez que Trae crée et lance les fichiers. Voici le résultat réellement obtenu pendant le cours :

![Page générée et exécutée à partir de la référence](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-wishlabs.gif)

Ne lisez pas encore tout le code. Vérifiez simplement que la page s'ouvre, que le contenu principal apparaît et que la structure rappelle la référence.

Si le titre est trop petit, ne modifiez qu'un point :

```text
Agrandis un peu le titre au centre.
```

## 3. Recommencer avec votre image

Ouvrez un autre dossier vide, ajoutez votre capture, puis demandez :

```text
Crée une page web à partir de cette image et ouvre-la quand elle est prête.
```

Si vous voulez seulement reprendre le style :

```text
Garde le style de l'image, mais remplace le nom et le contenu.
```

Quand la première version apparaît, cliquez sur l'action principale et réduisez la largeur de la fenêtre pour vérifier la mise en page.

## 4. Essayer un tableau de bord ou un jeu

Le tableau de bord de Linear présente une navigation à gauche et des cartes avec des graphiques à droite.

![Tableau de bord Linear](../../../zh-cn/stage-1/clone-your-favorite-app/images/linear-official-dashboard.png)

_Référence : [Linear Dashboards](https://linear.app/docs/dashboards)_

```text
Crée un tableau de bord comme celui-ci. Utilise des données d'exemple pour le moment.
```

![Tableau de bord généré et testé en cours](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-linear-dashboard.gif)

Vous pouvez aussi partir d'une scène de Minecraft.

![Référence Minecraft Creative Mode](../../../zh-cn/stage-1/clone-your-favorite-app/images/minecraft-official-creative-mode.png)

_Référence : [Exemple Minecraft sur Microsoft Learn](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/108)_

```text
Crée un jeu de blocs comme celui-ci. Le personnage doit pouvoir se déplacer et poser des blocs.
```

![Jeu de blocs 2D généré en cours](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-block-game.gif)

Pour une vue à la première personne, précisez « 3D » :

```text
Crée un jeu de blocs 3D comme celui-ci. Je veux marcher, tourner la vue et poser des blocs.
```

![Jeu de blocs 3D généré en cours](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-3d-block-game.gif)

## 5. Corriger un seul problème à la fois

La première version n'a pas besoin d'être parfaite. Décrivez le problème le plus visible avec des mots simples :

```text
La carte du haut est trop haute. Réduis sa hauteur.
```

```text
Ce bouton ne réagit pas. Corrige-le.
```

Après chaque modification, rouvrez la page et testez-la. Évitez de mélanger plusieurs demandes sans rapport dans un même message.

## 6. Vérifier avant de rendre le travail

- la page s'ouvre encore après actualisation ;
- une autre personne comprend s'il s'agit d'un site, d'un tableau de bord ou d'un jeu ;
- le bouton ou la commande principale fonctionne ;
- le texte et les images ne se chevauchent pas quand la fenêtre rétrécit.

Pour terminer, placez la référence et votre résultat côte à côte et expliquez une correction que vous avez demandée. La méthode tient en quatre étapes : choisir l'image, la donner à l'IA, demander une première version, puis corriger une différence à la fois.
