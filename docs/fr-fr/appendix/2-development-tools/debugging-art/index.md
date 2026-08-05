# Principes : Fondamentaux des outils de développement navigateur (DevTools)

::: tip 💡 Role cle
Les outils de developpement du navigateur (DevTools) sont le "scanner a rayons X" et la "table d'operation" du developpement frontend. Ils vous permettent de voir a travers l'ossature (HTML), la peau (CSS) et le systeme nerveux (JavaScript) d'une page Web, et de les modifier et deboguer en temps reel.
:::

## 1. Que sont les DevTools

**DevTools** est un ensemble d'outils de developpement et de debogage Web integres aux navigateurs modernes (Chrome, Edge, Firefox, Safari, etc.). Pour les developpeurs, ils sont plus pres de la "verite" que l'editeur de code, car **ils montrent comment le code s'execute reellement dans le navigateur**.

**Comment ouvrir les DevTools ?**

- **Raccourci** : `F12` ou `Ctrl + Shift + I` (Mac : `Cmd + Option + I`)
- **Souris** : **Clic droit** sur n'importe quel element de la page Web, puis selectionnez **"Inspecter (Inspect)"**.
- **Menu** : Menu en haut a droite du navigateur -> Plus d'outils -> Outils de developpement.

---

## 2. Demonstration interactive : Simulateur DevTools

Pour que vous puissiez prendre en main rapidement, nous avons cree un panneau DevTools simulant l'interface de debogage de Chrome.
**Cliquez sur le bouton "▶ Demarrer la visite guidee" ci-dessous et suivez le curseur pour decouvrir les fonctionnalites de chaque zone.**

<ClientOnly>
  <BrowserDevToolsDemo />
</ClientOnly>

### 2.1 Demonstration avancee : Modification en direct d'une page Web (Live Edit)

L'une des fonctionnalites les plus puissantes des DevTools est la **modification en temps reel**. La demonstration ci-dessous contient une "page Web virtuelle" (en haut) et des "DevTools" (en bas).

**Essayez ceci :**

1.  Cliquez sur un element `h1` ou `button` dans l'arbre DOM du panneau Elements en bas.
2.  Modifiez une valeur de propriete dans `element.style` dans le panneau Styles a droite (par exemple, changer `color` en `red`).
3.  Observez comment la page Web virtuelle en haut **change en temps reel**.

<ClientOnly>
  <BrowserDevToolsLiveDemo />
</ClientOnly>

### 2.2 Defi pratique : Modifier le texte d'une vraie page Web

Maintenant que vous maitrisez la modification des styles, faisons quelque chose de plus excitant — **modifier directement la page Web que vous consultez actuellement !**

1.  **Ouvrir les vrais DevTools** : Appuyez sur `F12` (ou faites un clic droit sur cette ligne de texte -> selectionnez "Inspecter").
2.  **Localiser l'element** : Dans le panneau Elements, vous verrez une ligne de code mise en surbrillance — c'est exactement le texte que vous venez de cliquer.
3.  **Modifier le contenu** : **Double-cliquez** sur la partie du texte noir de cette ligne, modifiez-la en "**Je suis un hacker !**", puis appuyez sur Entree.
4.  **Voir la magie** : Regardez ! Le texte sur la page Web a change ?

::: info 🤔 Pourquoi les modifications disparaissent-elles apres actualisation ?
Vous remarquerez peut-etre qu'apres avoir actualise la page, toutes les modifications ont disparu et la page Web est revenue a son etat original.

C'est parce que les modifications des DevTools se produisent uniquement dans la **memoire locale de votre navigateur**.

- Lorsque vous visitez une page Web, le navigateur telecharge le code HTML depuis un **serveur distant** et le rend localement.
- Vous modifiez uniquement la **copie locale** et n'avez pas la permission de modifier le **code source** sur le serveur.
- Par consequent, a chaque actualisation, le navigateur recupere le code le plus recent (non modifie) depuis le serveur, et tout est restaure.
  :::

---

## 3. Detail des panneaux cles

### 3.1 Elements (Panneau des elements)

<ClientOnly>
  <DevToolsElementsDemo />
</ClientOnly>

**Role** : Consulter et modifier en temps reel le HTML et le CSS de la page.

- **Gauche (Arbre DOM)** : Affiche la structure HTML de la page Web. Vous pouvez double-cliquer sur les balises ou le texte pour les modifier, ou faire glisser les noeuds pour changer leur position.
- **Droite (Styles)** : Affiche les styles CSS de l'element selectionne. Vous pouvez cocher/decocher les styles pour voir les changements, ou modifier directement les valeurs (couleurs, marges, etc.).
- **Scenarios d'utilisation** :
  - "Pourquoi ce bouton n'est-il pas aligne ?" -> Verifier les styles CSS.
  - "Je veux essayer si ce titre serait mieux en rouge." -> Modifier directement `color: red` dans Styles.

### 3.2 Console (Panneau de console)

<ClientOnly>
  <DevToolsConsoleDemo />
</ClientOnly>

**Role** : Consulter les journaux, executer du code JavaScript.

- **Sortie des journaux** : Les messages `console.log()`, les avertissements (jaune) et les erreurs (rouge) de la page Web s'affichent ici.
- **Environnement interactif** : Vous pouvez saisir n'importe quel code JS ici et l'executer immediatement. Par exemple, saisir `alert('Hello')` affiche une popup, et `document.body.style.background = 'red'` change le fond en rouge.
- **Scenarios d'utilisation** :
  - "Pourquoi le clic sur le bouton ne fait rien ?" -> Verifier s'il y a des messages d'erreur en rouge.
  - "Verifier la valeur de retour d'une fonction JS." -> Executer directement le test dans la console.

### 3.3 Network (Panneau reseau)

<ClientOnly>
  <DevToolsNetworkDemo />
</ClientOnly>

**Role** : Surveiller toutes les requetes reseau.

- **Vue en liste** : Affiche toutes les ressources chargees (HTML, CSS, JS, images, requetes API).
- **Details des requetes** : Cliquez sur n'importe quelle ligne de requete pour ouvrir le panneau de details a droite :
  - **Headers (En-tetes)** : Consulter les en-tetes de requete et de reponse (par ex. `Content-Type`).
  - **Response (Reponse)** : Voir les donnees brutes retournees par le serveur (JSON, code HTML, etc.).
  - **Preview (Apercu)** : Previsualiser le contenu de la reponse dans un format plus lisible.
- **Indicateurs cles** :
  - **Status** : Code de statut (200 succes, 404 non trouve, 500 erreur serveur).
  - **Type** : Type de ressource (fetch/xhr designe une requete API).
  - **Time** : Temps de chargement.
- **Scenarios d'utilisation** :
  - "L'API est-elle en panne ?" -> Verifier si la requete API est en rouge 500.
  - "Pourquoi la page charge-t-elle si lentement ?" -> Trouver quelle image ou fichier a le temps de chargement le plus long.

### 3.4 Sources (Panneau des sources)

<ClientOnly>
  <DevToolsSourcesDemo />
</ClientOnly>

**Role** : Consulter le code source, deboguer le JavaScript.

- **Debogage par points d'arret** : Cliquez sur le numero de ligne pour definir un "point d'arret (Breakpoint)". Lorsque le code atteint cette ligne, il **s'arrete** pour vous permettre de consulter les valeurs actuelles des variables et d'executer le code pas a pas.
- **Scenarios d'utilisation** :
  - "Ou est la logique de code incorrecte ?" -> Definir un point d'arret, observer le code pas a pas et verifier si les valeurs des variables correspondent aux attentes.

### 3.5 Application (Panneau d'application)

<ClientOnly>
  <DevToolsApplicationDemo />
</ClientOnly>

**Role** : Consulter et gerer le stockage du navigateur.

- **Storage** :
  - **Local Storage** : Donnees stockees de maniere persistante.
  - **Session Storage** : Stockage au niveau de la session (disparait a la fermeture de l'onglet).
  - **Cookies** : Petites donnees textuelles pour l'authentification, etc.
- **Scenarios d'utilisation** :
  - "Reinitialiser l'etat de connexion" -> Supprimer les Cookies ou le token dans le Local Storage.
  - "Consulter les donnees en cache" -> Verifier ce qui est stocke dans le Local Storage.

---

## 4. Astuces pratiques

1.  **Debogage en mode mobile** : Cliquez sur l'"icone de telephone" 📱 en haut a gauche des DevTools pour simuler la taille d'ecran de differents modeles de telephones (iPhone, Pixel, etc.) et tester le comportement responsif de la page Web.
2.  **Forcer les etats** : Dans le panneau Elements, faites un clic droit sur un element, selectionnez `Force state` -> `:hover` pour forcer l'element a rester dans l'etat survol, facilitant ainsi le debogage des styles au survol de la souris.
3.  **Capture d'ecran de noeud** : Selectionnez un noeud dans le panneau Elements, appuyez sur `Ctrl + Shift + P` (Mac : `Cmd + Shift + P`) pour ouvrir le menu de commandes, tapez `screenshot` et selectionnez `Capture node screenshot` pour capturer directement le noeud DOM en tant qu'image.

::: warning ⚠️ Attention
Toutes les modifications dans les DevTools (modification du HTML, CSS, JS) sont **temporaires** et ne prennent effet que dans la page actuelle du navigateur. Des que vous actualisez la page, toutes les modifications sont perdues. Pour des modifications permanentes, vous devez modifier vos fichiers de code source.
:::
