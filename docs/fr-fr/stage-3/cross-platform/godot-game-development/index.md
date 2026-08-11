---
title: 'Créer des jeux de plateforme, pixel art et 3D avec Godot'
description: 'Apprendre Godot avec trois prototypes réellement exécutés et des références de jeux publiés.'
---

# Créer des jeux de plateforme, pixel art et 3D avec Godot

Godot est un moteur libre et open source réunissant scènes, physique, animation, audio, scripts et export. Nous ne prétendons pas finir trois jeux : nous exécutons un platformer 2D, une collecte pixel art et un greybox 3D.

## 1. Quatre mots essentiels

Un nœud remplit une tâche, une scène est un arbre réutilisable, un script donne le comportement et GDScript est le langage principal de Godot.

![Éditeur Godot](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-editor-platformer.png)

## 2. Plateforme 2D

Primal Light montre des plateformes, dangers et objectifs faciles à lire.

![Primal Light](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-primal-light.webp)

> Crée un niveau 2D avec joueur, sol, trois plateformes et une arrivée visible, en formes simples.

> Ajoute déplacement horizontal et saut, sans second saut en l'air.

![Skyline Courier exécuté](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-platformer.png)

## 3. Boucle pixel art

Dome Keeper organise clairement ressources et objectif sur un petit écran.

![Dome Keeper](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-dome-keeper.webp)

> Crée une scène 320 × 180 avec joueur, forêt, trois objets et compteur.

![Lantern Woods exécuté](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-pixel.png)

Utilisez une mise à l'échelle entière pour éviter le flou.

## 4. Greybox 3D

Wrought Flesh permet d'observer silhouette, lumière et direction. Un greybox teste proportions et mouvement avec des boîtes avant les modèles définitifs.

![Wrought Flesh](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-wrought-flesh.webp)

> Crée un greybox 3D avec sol, murs, joueur, caméra et sortie lumineuse.

![Signal Garden exécuté](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-3d.png)

## 5. Une modification à la fois

> Ajoute seulement le mouvement, sans changer le niveau.

> Corrige uniquement cette erreur : 【colle l'erreur】, puis indique comment refaire le test.

## 6. L'export est une phase distincte

Installez les Export Templates de la même version et créez un preset. Testez le bureau sur une machine sans Godot, le Web via serveur ou HTTPS, et Android/iOS avec SDK, signature et appareil.

Les trois prototypes ont été exécutés dans Godot 4.7.1 sur macOS. Les exports Windows, Linux, Web, Android, iOS et console ne sont pas déclarés terminés.
