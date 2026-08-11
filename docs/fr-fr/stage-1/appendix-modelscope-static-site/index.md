---
title: Publier votre site web sur ModelScope
description: Publiez un site statique HTML, Vue, React ou Vite avec ModelScope Studio et son Skill officiel.
---

# Publier votre site web sur ModelScope

Lorsque la page fonctionne sur votre ordinateur, il faut une adresse que d'autres personnes puissent ouvrir. Dans cette annexe, nous utilisons **ModelScope Studio** au lieu de configurer un serveur de zéro.

## 1. Déterminer ce qui sera publié

| Projet | Type de Studio | Contenu à préparer |
| --- | --- | --- |
| HTML, CSS et JavaScript | Static | Fichiers web avec `index.html` à la racine |
| Vue, React, Vite ou Svelte | Static | Contenu de `dist` ou `build` après compilation |
| Gradio ou Streamlit | Type correspondant | Entrée Python et dépendances |
| Backend ou dépendances système particulières | Docker | Dockerfile et service exécutable |

Pour un framework, publiez le **résultat de la compilation**, pas le dossier du code source.

## 2. Utiliser le Skill officiel de déploiement

Les [Skills officiels de ModelScope](https://github.com/modelscope/modelscope-skills) comprennent `ms-studio-deploy`. Il identifie le projet, crée le Studio, synchronise les fichiers, déploie et vérifie les journaux.

```bash
python -m pip install -U modelscope
modelscope skills add @ModelScope/ms-hub @ModelScope/ms-studio-deploy
```

Obtenez un jeton sur la page [Access Tokens](https://modelscope.cn/my/myaccesstoken) et conservez-le uniquement en local. Ne l'inscrivez ni dans le site, ni dans le README, ni dans une capture.

Pour Vite, compilez d'abord :

```bash
npm run build
cd dist
```

Ouvrez le dossier de sortie dans votre outil d'IA et demandez :

```text
Utilise le Skill ms-studio-deploy pour publier ce dossier dans un Static Studio ModelScope. Envoie-moi le lien quand il fonctionne.
```

## 3. Publier manuellement depuis le site

Ouvrez [ModelScope Studio](https://modelscope.cn/studios) et connectez-vous.

![Accueil de ModelScope Studio](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/01-studios-home.jpg)

Dans [Créer un Studio](https://modelscope.cn/studios/create), renseignez le propriétaire, le nom, la description et la visibilité.

![Formulaire de création d'un Studio](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/02-create-studio.jpg)

Choisissez **Static** comme type de SDK.

![Sélection du type Static](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/03-select-static.jpg)

Ouvrez ensuite la page des fichiers et importez `index.html`, le CSS, le JavaScript et les images. `index.html` doit se trouver directement à la racine, et non dans un dossier `dist` supplémentaire.

![Fichiers d'un Static Studio](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/04-studio-files.jpg)

Enregistrez et attendez le déploiement. Sur le lien final, vérifiez l'accueil, les styles, les images, la largeur mobile et la console du navigateur. Pour un Studio public, testez aussi sans être connecté.

## 4. Mettre à jour et dépanner

Après une modification, testez en local, recompilez, remplacez les fichiers publiés, puis redéployez.

- styles ou images absents : vérifiez les chemins et `base` dans Vite ;
- erreur 404 après actualisation d'une route : envisagez un routeur avec hash ;
- seule une liste de fichiers apparaît : vérifiez `index.html` à la racine ;
- une clé secrète est nécessaire : ne la placez pas dans le frontend, utilisez un backend.

Sources officielles : [ModelScope Studio](https://modelscope.cn/studios), [ModelScope Skills](https://github.com/modelscope/modelscope-skills) et [`ms-studio-deploy`](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md).
