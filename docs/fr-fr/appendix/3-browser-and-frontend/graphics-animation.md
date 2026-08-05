# Fondamentaux : Graphiques et animation avec Canvas

::: tip 🎯 Question principale
Les pages Web d'autrefois ne pouvaient afficher que du texte et des images ternes. Mais si vous souhaitez creer un casse-briques, des effets dynamiques eblouissants ou des rapports de donnees librement glissables, les simples `<div>` sont loin de suffire. C'est la raison pour laquelle **Canvas (canevas)** est ne.

Ce guide vous accompagnera depuis le trace de votre premiere ligne jusqu'a la creation hands-on d'un moteur de particules fonctionnant de maniere fluide a 60 images par seconde dans le navigateur.
:::

---

## 1. Qu'est-ce que Canvas

Si les pages Web d'autrefois etaient des modeles statiques assembles avec des **briques Lego** (balises HTML), alors la balise HTML5 `<canvas>` est comme si l'on vous tendait une enorme **feuille blanche numerique** et un **pinceau** controle par du code, puis que l'on vous laissait libre de creer.

Les dessins qui s'y trouvent n'ont aucune structure de balises. Ce que vous peignez avec le pinceau, une fois trace, devient de la pure **`` peinture de pixels ''**.

### 1.1 Canvas vs SVG : deux ecoles artistiques differentes

Dans le monde du dessin frontend, Canvas a un rival de toujours appele **SVG**. Ils representent deux conceptions artistiques completement differentes :

- **Canvas (planche de dessin bitmap) :**
  - **Principe** : comme peindre reellement sur papier, quelques coups de pinceau se transforment en une masse de couleur (pixels).
  - **Avantage** : l'ordinateur se contente de `` repandre de la peinture '' sur l'ecran — les performances decollent ! Capable de dessiner simultanement des milliers de particules scintillantes bondissantes.
  - **Inconvenient** : une fois peint, impossible d'annuler individuellement (pas de selection par noeud DOM), et le zoom agrandi produit un effet mosaique flou.
- **SVG (assemblage de graphiques vectoriels) :**
  - **Principe** : comme faire un diaporama. Vous dessinez un cercle, il genere une `` entite cercle '' avec sa propre balise independante sur la surface.
  - **Avantage** : que ce soit un agrandissement x100 ou x100 000, toujours extremement net. Chaque forme est un noeud DOM independant dont vous pouvez modifier la couleur avec CSS et JS ou lier des evenements de clic a tout moment.
  - **Inconvenient** : si vous essayez de faire voler des dizaines de milliers d'objets, le lourdarbre DOM et le moteur de mise en page geleront directement le navigateur.

**🎮 Resume simple : utilisez Canvas pour les jeux dynamiques et les effets de particules spectaculaires ; utilisez SVG pour les logos de precision et les petits graphiques avec des interactions claires.**

---

## 2. Premier trace : comprendre le systeme de coordonnees contre-intuitif

### 2.1 Pourquoi le haut et le bas de cette feuille sont-ils inverses

Lorsque vous vous appretez a tracer, vous devez d'abord comprendre que la regle dans Canvas est a l'envers. Dans le systeme de coordonnees traditionnel des cours de mathematiques, le point zero central est au milieu et les valeurs augmentent vers le haut. Mais dans le domaine de l'affichage sur ecran d'ordinateur, sur presque tous les appareils, `` l'origine (0, 0) '' est situee dans le **coin superieur gauche de l'ecran**. Vers la droite, l'axe X augmente sans probleme, mais **vers le bas, l'axe Y augmente**.

**Principes fondamentaux du systeme de coordonnees Canvas :**
- **Unite native :** pixel (px), correspondance 1:1 avec les pixels physiques de l'ecran.
- **Axe X :** la droite est la direction positive, de `0` a `canvas.width`.
- **Axe Y :** le bas est la direction positive, de `0` a `canvas.height`.

👇 Faites glisser le petit point ci-dessous pour ressentir intuitivement l'origine et la direction des coordonnees en infographie :

<CoordinateSystemDemo />

### 2.2 Assaisonner votre pinceau magique

Avec le systeme de coordonnees en place, nous pouvons invoquer le pinceau (appele `Context` dans le code, ou `ctx` en abrege). Tout comme peindre avec une vraie palette, la conception de l'API Canvas suit parfaitement les trois etapes de la peiture physique :

1. **Melanger les couleurs (State)** : definir la couleur de remplissage avec `fillStyle`, la couleur de contour avec `strokeStyle`.
2. **Construire la forme (Path)** : concevoir si vous tracez une ligne (`lineTo`), un cercle (`arc`) ou un rectangle (`rect`).
3. **Tracer minimaliste (Render)** : decider s'il faut remplir l'interieur (`fill()`) ou dessiner les contours (`stroke()`).

Canvas etant une toile bitmap pure, `` ce qui est trace est definitif '' — une fois que vous avez peint, cela seche immediatement en pixels et ne peut plus etre annule en tant qu'objet independant.

👇 Essayez de selectionner differentes formes et couleurs dans la demonstration ci-dessous pour voir comment le code sous-jacent execute les `` trois etapes '' :

<CanvasBasicsDemo />

---

## 3. Le livre d'animation a feuilleter : comment rendre l'animation ultra-fluide

Puisque Canvas, une fois rempli, devient des pixels permanents, comment sont crees les personnages qui courent partout dans les jeux de navigateur HTML5 ?

La reponse est : **`` tromper vos yeux ''**. Le principe est exactement le meme que celui des livres d'animation a feuilleter ou des pellicules de cinema.

1. **Effacer le tableau (Clear)** : utiliser `clearRect()` pour effacer impitoyablement tout le contenu du canevas.
2. **Calculer la nouvelle position (Update)** : faire avancer secretement la coordonnee X du personnage de 2 pixels.
3. **Redessiner (Render)** : dessiner a nouveau le personnage a la nouvelle position.
4. **Boucle frenetique (Loop)** : combiner avec le metronome extremement precis integre au navigateur `requestAnimationFrame`. Il repete ces trois actions a la frequence de rafraichissement de l'ecran (generalement 60 fois par seconde, soit 60 FPS).

Grace a la `` persistance retinienne '' naturelle de l'oeil humain, dans le cycle [Effacer -> Mettre a jour -> Redessiner] a 60 fois par seconde, vous ne voyez pas un tableau noir clignotant mais une animation d'une fluidite comparable a la soie.

👇 Ajustez la vitesse de lecture dans la demonstration ci-dessous et observez comment le deplacement de chaque image s'enchaine en un mouvement fluide :

<AnimationLoopDemo />

---

## 4. L'aveugle qui tate l'elephant : comment gerer les clics interactifs dans Canvas

Parce que la toile Canvas n'est aux yeux du navigateur qu'un `` tissu de peinture '' sans aucune structure. Supposons que vous dessiniez un monstre avec `arc()` sur la toile et que vous souhaitiez implimenter `` cliquer sur le monstre reduit les points de vie '' — vous ne pouvez **absolument pas** utiliser le `document.getElementById` traditionnel pour obtenir ce monstre. Car dans la structure HTML, il n'y a que la balise `<canvas>` rigide de 600 pixels de large.

C'est le probleme le plus classique de la programmation graphique : **la detection de collision (Collision Detection) et la delegation d'evenements**.

Le navigateur sait seulement que votre souris a clique sur les coordonnees d'ecran `(x, y)` du Canvas — vous devez faire le calcul inverse vous-meme avec les mathematiques geometriques du college :
- **Pour les cercles :** calculer la distance entre le `` point de clic de la souris '' et la `` position du centre du cercle '' avec le theoreme de Pythagore — si la distance est inferieure au rayon, cela signifie `` touche ''.
- **Pour les rectangles :** verifier si le `x` clique est dans les limites gauche et droite du rectangle et si le `y` est dans les limites superieure et inferieure.

Quel que soit le nombre d'elements sur votre toile, les evenements de survol ou de clic de la souris sont toujours lies au seul conteneur Canvas — c'est la `` delegation d'evenements '' ultime.

👇 Essayez ci-dessous d'utiliser la souris (clic, glisser, survol) ou le clavier (touches flechees pour deplacer) pour experimenter cette logique d'interaction de bas niveau de `` calcul manuel de distance '' :

<EventHandlingDemo />

---

## 5. Liberer la puissance de calcul : systeme de particules et magie visuelle

A ce stade, lorsque nous fusionnons le `` systeme de coordonnees '', la `` boucle d'animation '' et `` couleur et forme '', et que nous multiplions leur nombre a des centaines voire des milliers de minuscules fragments, vous maitrisez l'arme ultime pour faire exploser le visuel : le **systeme de particules (Particle System)**.

Son principe fondamental est extremement brut et efficace :
1. Creer un enorme tableau rempli de centaines d'`` objets particules '' independants.
2. Chaque objet possede son propre cycle de vie (`life`), acceleration (`vx/vy`) et amortissement gravitationnel (`gravity`).
3. A chaque declenchement de `requestAnimationFrame`, parcourir et mettre a jour ces centaines de particules, puis les rendre, et enfin nettoyer discretement les particules `` mortes '' (duree de vie epuisee / sorties de l'ecran).

Votre navigateur peut en un instant devenir une usine produisant des feux d'artifice, des tempetes de neige et des explosions.

👇 Cliquez sur differents effets, ajustez la gravite et le nombre de particules, et observez comment les formules mathematiques et physiques les plus simples produisent des effets visuels collectifs complexes :

<ParticleSystemDemo />

---

## 6. Preserver la gloire du FPS : comment faire face a un CPU surchauffe

Faire calculer et redessiner des milliers d'objets 60 fois par seconde est extremement gourmand en performances. Sans methode, le ventilateur de votre ordinateur sera bientot a plein regime.

Voici les `` techniques de protection '' que les vrais experts de moteur utilisent pour sauver la frequence d'images :

1. **Effacement partiel du tableau (rectangle sale / Dirty Rect) :**
   Un personnage court dans une vaste prairie — n'utilisez surtout pas `clearRect` sur toute la prairie a chaque image ! Seul le petit carre par lequel le personnage est passe doit etre `` efface avec une petite brosse '' et recouvert — les performances decollent exponentiellement.

2. **Magie du double en arriere-plan (Canvas hors ecran) :**
   Si l'arriere-plan est un ciel etoile avec diverses montagnes complexes et magnifiques, le rendre en temps reel a chaque fois est stupide. Nous creons generalement secretement un `<canvas>` invisible dans la memoire et y dessinons exquisement une seule fois. Lors de chaque rafraichissement d'image subsequent, il suffit de coller ce `` negatif statique '' synthetise via `drawImage()`, evitant ainsi des calculs de base massifs.

3. **Lavage en lot du pinceau (Batching) :**
   Passer du rouge au bleu dans la palette est couteux au niveau inferieur. Si 1000 cercles rouges et 1000 cercles bleus sont disperses en croix sur la toile, la methode la plus rapide est : preparer d'abord la peinture rouge, parcourir et dessiner tous les cercles rouges, puis changer pour la peinture bleue et dessiner tous les cercles bleus. C'est le celebre concept de rendu par lots (Batch Rendering).

👇 Montez le nombre d'objets au-dela de 3000, regardez la page web plonger dans les abysses des saccades, puis activez un par un les commutateurs `` techniques d'optimisation '' en bas a droite pour voir de vos propres yeux le veritable sauvetage du debit d'images :

<PerformanceDemo />

---

## 7. Glossaire technique

| Terme | Explication vulgarisee |
| --- | --- |
| **Canvas** | Le canevas 2D fourni par HTML5. Dessin extremement rapide, mais une fois termine, le resultat devient des pixels de peinture et ne peut pas etre manipule via le DOM. |
| **SVG** | Graphiques vectoriels. Jamais flou en zoom, et chaque forme est un element de balise independant auquel on peut facilement lier des styles CSS et des interactions. |
| **Context (ctx)** | Le `` pinceau magique 2D '' que vous demandez, utilise pour melanger les couleurs, definir les formes et dessiner divers effets speciaux. |
| **requestAnimationFrame** | Le metronome divin integre au navigateur, qui execute les callbacks en respectant scrupuleusement la frequence de rafraichissement de l'ecran — le choix incontournable pour les animations fluides. |
| **FPS (Frequence d'images)** | Frequence d'images. 60 FPS signifie que le navigateur efface et redessine le canevas 60 fois par seconde de maniere fluide. |
| **Rectangle sale (Dirty Rect)** | Effacer et redessiner avec precision uniquement dans la petite zone ou un changement s'est produit, preservant ainsi fortement les performances. |
| **Canvas hors ecran** | Le `` canevas fantome '' cache dans la memoire. Les arriere-plans extremement complexes mais immobiles sont pre-dessines, puis reutilises comme des textures statiques. |

> D'un simple segment de ligne a un grandiose et eblouissant systeme de particules ; tous les effets qui semblent magiques ne sont rien d'autre qu'un cycle de calcul de coordonnees et de redessin a 60 fois par seconde.
