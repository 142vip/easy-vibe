# Principes : Art et méthodologie du débogage

::: tip Preface
**Le code est termine, mais une erreur se produit a l'execution — et maintenant ?** Beaucoup de debutants restent bloques a cette etape, fixant l'ecran sans savoir quoi faire. Le debogage (Debug) est l'une des competences les plus fondamentales en programmation, encore plus importante que l'ecriture du code lui-meme. Car l'ecriture du code ne represente que 30 % du temps de developpement ; les 70 % restants sont consacres a la comprehension des problemes, a la localisation des bugs et a la verification des corrections.
:::

**Que allez-vous apprendre dans cet article ?**

A la fin de ce chapitre, vous aurez acquis :

- **Une mentalite de debogage** : une methode systematique de localisation des problemes, sans plus "deviner au hasard"
- **Une capacite de lecture des erreurs** : comprendre les messages d'erreur et localiser rapidement les problemes dans la pile d'appels
- **Des methodes de debogage classiques** : maitriser la recherche binaire, la methode du canard en caoutchouc, la reproduction minimale et autres techniques classiques
- **Une maitrise des outils** : comprendre les scenarios d'utilisation du debogage par points d'arret, par journaux et par reseau
- **Le debogage assiste par l'IA** : apprendre a accelerer le processus de debogage avec l'IA, sans en dependre

| Chapitre | Contenu | Concept cle |
|-----|------|---------|
| **Chapitre 1** | Lire les messages d'erreur | Types d'erreurs, traces d'appels |
| **Chapitre 2** | Methodes de debogage classiques | Recherche binaire, canard en caoutchouc, reproduction minimale |
| **Chapitre 3** | Boite a outils de debogage | Points d'arret, journaux, capture reseau |
| **Chapitre 4** | Le debogage a l'ere de l'IA | Assistance IA + jugement humain |
| **Chapitre 5** | Mentalite et habitudes de debogage | Programmation defensive, journaux de debogage |

---

## 0. Vue d'ensemble : Le debogage est une methode scientifique

Le debogage n'est pas une question de "chance", mais un processus scientifique rigoureux. La methodologie qu'utilisent les physiciens pour leurs experiences s'applique parfaitement au debogage :

1. **Observer le phenomene** : Quel est le probleme dans le programme ? Quelle erreur est signalee ?
2. **Formuler une hypothese** : Quelle pourrait etre la cause ?
3. **Concevoir une experience** : Comment verifier cette hypothese ?
4. **Verifier la conclusion** : Si l'hypothese est correcte, corriger ; si non, formuler une nouvelle hypothese

::: tip La regle d'or du debogage
- **Reproduire d'abord, corriger ensuite** : Un bug qui ne peut pas etre reproduit de maniere stable ne peut pas etre verifie comme reellement corrige
- **Ne modifier qu'une seule variable a la fois** : Si vous modifiez plusieurs endroits en meme temps, vous ne saurez pas quelle modification a resolu le probleme
- **Croyez les preuves, pas l'intuition** : L'endroit dont vous pensez "ca ne peut pas etre le probleme" est souvent precisement l'endroit du probleme
- **Qu'avez-vous modifie recemment ?** : 80 % des bugs sont introduits par les modifications recentes
:::

---

## 1. Lire les messages d'erreur : Les erreurs ne sont pas des ennemis, ce sont des indices

L'erreur la plus courante des debutants : paniquer en voyant une erreur et la fermer ou l'ignorer immediatement. En realite, **le message d'erreur indique ou se trouve le probleme** — c'est votre meilleur ami.

### 1.1 Les trois grands types d'erreurs

| Type | Quand il apparait | Exemple | Difficulte |
|-----|------------|------|---------|
| **Erreur de syntaxe** | Erreur avant meme l'execution du code | Parenthese manquante, mot-cle mal orthographie | La plus facile a corriger |
| **Erreur d'execution** | Le code plante a une certaine ligne | Acces a une variable inexistante, division par zero | Difficulte moyenne |
| **Erreur logique** | Le code s'execute mais le resultat est faux | Formule de calcul erronee, condition inversee | La plus difficile a detecter |

### 1.2 Comment lire une pile d'appels d'erreur

En JavaScript, un message d'erreur typique :

```
TypeError: Cannot read properties of undefined (reading 'name')
    at getUserName (app.js:15:23)
    at handleClick (app.js:42:10)
    at HTMLButtonElement.<anonymous> (app.js:58:5)
```

**Lire de haut en bas** :

1. **Premiere ligne** : Type d'erreur + description → `TypeError`, tentative de lecture de la propriete `name` de `undefined`
2. **Deuxieme ligne** : Fonction et localisation de l'erreur → fonction `getUserName`, fichier `app.js`, ligne 15, colonne 23
3. **Lignes suivantes** : Chaine d'appels → Qui a appele cette fonction ? `handleClick` → evenement de clic sur un bouton

::: tip Astuce pour lire la pile
**De haut en bas pour la cause, de bas en haut pour l'origine.** La premiere ligne vous dit "quelle est l'erreur", la derniere ligne vous dit "ou cela a commence".
:::

### 1.3 Reference rapide des types d'erreurs courants

| Nom de l'erreur | Signification | Causes courantes |
|---------|------|---------|
| `SyntaxError` | Erreur de syntaxe | Parentheses non appariees, virgule manquante |
| `TypeError` | Erreur de type | Operation sur `undefined`/`null` |
| `ReferenceError` | Erreur de reference | Utilisation d'une variable non declaree |
| `RangeError` | Erreur de plage | Index hors limites, recursion trop profonde |
| `NetworkError` | Erreur reseau | Echec de requete API, probleme CORS |
| `404 Not Found` | Ressource inexistante | URL incorrecte, fichier supprime |
| `500 Internal Server Error` | Erreur interne du serveur | Crash du code backend |

### 1.4 Comparaison avec les messages d'erreur Python

La pile de Python se lit dans le sens inverse de JavaScript — **de bas en haut** :

```python
Traceback (most recent call last):
  File "main.py", line 10, in <module>
    result = calculate(data)
  File "main.py", line 5, in calculate
    return data["price"] * data["quantity"]
KeyError: 'quantity'
```

**La derniere ligne** est la cause de l'erreur : `KeyError: 'quantity'`, le dictionnaire n'a pas la cle `quantity`.

::: tip Langages differents, meme approche
Quel que soit le langage, les messages d'erreur contiennent trois informations cles : **quoi** (type d'erreur), **ou** (fichier et numero de ligne), **pourquoi** (description de l'erreur). Apprendre a extraire ces trois informations permet de lire les messages d'erreur de n'importe quel langage.
:::

---

## 2. Methodes de debogage classiques : La sagesse des anciens

Ces methodes ne necessitent aucun outil, seulement votre cerveau. Elles sont le fondement de toutes les techniques avancees de debogage.

### 2.1 Debogage par recherche binaire

**Idee centrale** : Reduire de moitie la zone du probleme, encore de moitie, jusqu'a trouver la source.

**Scenario** : Le code est long et vous ne savez pas quel passage pose probleme.

**Etapes** :

1. Ajouter un `console.log` (ou `print`) au milieu du code
2. Si l'erreur survient avant le point median → le probleme est dans la moitie superieure
3. Si l'erreur survient apres le point median → le probleme est dans la moitie inferieure
4. Repeter le processus pour la moitie concernee

```
100 lignes de code avec un bug
    ↓ Log a la ligne 50
Probleme dans les lignes 50-100
    ↓ Log a la ligne 75
Probleme dans les lignes 50-75
    ↓ Log a la ligne 62
Probleme dans les lignes 60-62 !
```

::: tip La puissance de la recherche binaire
Pour 100 lignes de code, 7 iterations suffisent (log₂100 ≈ 7) pour localiser la ligne exacte. Pour 1000 lignes, 10 iterations suffisent.
:::

### 2.2 Methode du canard en caoutchouc

**Idee centrale** : Expliquer le probleme ligne par ligne a quelqu'un (ou a un canard en caoutchouc) — en expliquant, vous decouvrez souvent le probleme vous-meme.

**Pourquoi ca marche ?** Parce que "ecrire du code" et "expliquer du code" utilisent des regions differentes du cerveau. Quand vous etes oblige de decrire chaque etape logiquement, les hypotheses que vous "croyiez correctes" sont mises a nu.

**Mise en pratique** :

1. Ouvrir le code pose probleme
2. Expliquer ligne par ligne : "Que fait cette ligne ? Pourquoi est-elle ecrite ainsi ?"
3. Quand vous dites "Hmm, ici ca devrait... attendez une minute" — le bug est probablement la

### 2.3 Reproduction minimale

**Idee centrale** : Simplifier un probleme complexe au maximum, en ne gardant que le code minimal capable de declencher le bug.

**Pourquoi c'est important ?**

- Dans un systeme complexe, un bug peut etre "masque" par d'autre code
- La reproduction minimale elimine les facteurs parasites et rend le probleme evident
- C'est aussi plus pratique pour demander de l'aide — personne ne veut lire 500 lignes de code

**Etapes** :

1. Creer un nouveau fichier vide
2. Copier uniquement le code lie au probleme
3. Reduire progressivement, jusqu'a ce que la suppression d'une ligne fasse disparaitre le bug
4. Ce qui reste est la source du bug

### 2.4 Methode de retour en arriere (Git Bisect)

**Idee centrale** : Si le code "fonctionnait avant et est maintenant casse", trouver quel commit a introduit le probleme.

```bash
# Outil de recherche binaire integre a Git
git bisect start
git bisect bad          # Marquer la version actuelle comme buguee
git bisect good abc123  # Marquer une ancienne version fonctionnelle
# Git bascule automatiquement sur le commit du milieu ; vous testez et indiquez good ou bad
# Apres quelques iterations, vous trouverez le commit ayant introduit le bug
```

::: tip Guide de choix de methode de debogage
| Situation | Methode recommandee |
|-----|---------|
| On ne sait pas quel passage du code est en cause | Recherche binaire |
| La logique semble correcte mais le resultat est faux | Canard en caoutchouc |
| Bug dans un systeme complexe | Reproduction minimale |
| "Ca marchait avant, soudainement ca ne marche plus" | Retour en arriere / Git Bisect |
:::

---

## 3. Boite a outils de debogage : Les bons outils font gagner du temps

La methodologie est la base, mais de bons outils peuvent doubler l'efficacite du debogage.

### 3.1 console.log / print : Le plus simple et le plus pratique

**Scenario d'utilisation** : Verifier rapidement les valeurs des variables, confirmer jusqu'ou le code s'est execute.

```javascript
// JavaScript
console.log('Fonction appelee, parametres :', data)
console.log('Resultat du calcul :', result)
console.table(arrayData)  // Afficher les tableaux/objets sous forme de tableau
```

```python
# Python
print(f"Valeur actuelle : {value}")
print(f"Type : {type(data)}")  # Verifier le type de donnees
```

**Techniques avancees** :

| Methode | Utilisation |
|-----|------|
| `console.log()` | Sortie standard |
| `console.warn()` | Avertissement jaune, facile a reperer parmi de nombreux journaux |
| `console.error()` | Erreur rouge |
| `console.table()` | Afficher tableaux et objets sous forme de tableau |
| `console.time()` / `console.timeEnd()` | Mesurer le temps d'execution du code |
| `console.trace()` | Afficher la pile d'appels |

### 3.2 Debogage par points d'arret : Executer ligne par ligne, voir chaque etape

**Scenario d'utilisation** : Logique complexe necessitant un suivi pas a pas de l'execution du code.

**Dans le navigateur** (Chrome DevTools) :

1. Ouvrir les outils de developpement (F12) → Panneau Sources
2. Trouver le fichier source, cliquer sur le numero de ligne pour definir un point d'arret
3. Declencher l'action correspondante, le code s'arrete au point d'arret
4. Executer pas a pas avec les boutons de controle :
   - **Continuer** (F8) : Executer jusqu'au prochain point d'arret
   - **Step Over** (F10) : Executer la ligne courante sans entrer dans la fonction
   - **Step Into** (F11) : Entrer dans la fonction
   - **Step Out** (Shift+F11) : Sortir de la fonction courante

**Dans VS Code** :

1. Cliquer a gauche du numero de ligne pour definir un point d'arret (point rouge)
2. Appuyer sur F5 pour lancer le debogage
3. Consulter les valeurs actuelles de toutes les variables dans le panneau "Variables"
4. Ajouter les expressions qui vous interessent dans le panneau "Espions"

::: tip Points d'arret vs console.log
**console.log** est adapte pour des verifications rapides, a supprimer apres usage. **Le debogage par points d'arret** est adapte pour l'analyse approfondie de logiques complexes. Ils ne se substituent pas l'un a l'autre, mais se completent.
:::

### 3.3 Debogage reseau : Problemes entre frontend et backend

**Scenario d'utilisation** : L'affichage de la page est incorrect, mais on ne sait pas si c'est un probleme frontend ou si les donnees retournees par le backend sont erronees.

**Chrome DevTools → Panneau Network** :

| Contenu a verifier | Problemes detectables |
|---------|--------------|
| **Code de statut** | 404 (adresse erronee), 500 (serveur crash), 403 (pas de permission) |
| **Parametres de requete** | Les donnees envoyees par le frontend sont-elles correctes |
| **Donnees de reponse** | Le format des donnees retournees par le backend est-il correct |
| **Temps de requete** | Quelle API est trop lente et ralentit la page |
| **En-tetes de requete** | Le Token est-il present, le Content-Type est-il correct |

**Astuce de debogage** : D'abord verifier le code de statut, puis les parametres de requete, enfin les donnees de reponse.

### 3.4 Reference rapide des outils de debogage

| Type de probleme | Outil recommande |
|---------|---------|
| Valeur de variable incorrecte | console.log / point d'arret |
| Ordre d'execution logique incorrect | Debogage par points d'arret |
| Echec de requete API | Panneau Network |
| Style de page incorrect | Panneau Elements (verifier le CSS) |
| Probleme de performance | Panneau Performance / console.time |
| Fuite memoire | Panneau Memory |

---

## 4. Le debogage a l'ere de l'IA : L'IA comme assistant

Les outils d'IA (ChatGPT, Claude, Cursor, etc.) peuvent accelerer considerablement le processus de debogage, a condition de savoir les utiliser.

### 4.1 Que fait bien l'IA — et que fait-elle mal

| L'IA fait bien | L'IA fait moins bien |
|--------|----------|
| Expliquer la signification des messages d'erreur | Comprendre votre logique metier |
| Proposer des solutions pour les problemes courants | Juger quelle solution est la mieux adaptee a votre projet |
| Generer des extraits de code de debogage | Reproduire des bugs qui n'apparaissent que dans certains environnements |
| Analyser les problemes potentiels dans le code | Comprendre le contexte complexe du systeme |

### 4.2 La bonne facon de poser des questions a l'IA

**Mauvaise question** :
> "Mon code a une erreur, pouvez-vous regarder ?"

**Bonne question** :
> "J'ecris un composant de formulaire en React et j'obtiens l'erreur `TypeError: Cannot read properties of undefined (reading 'email')` lors de la soumission. Voici le code concerne : [coller le code]. J'ai confirme que le format des donnees renvoyees par l'API est correct. Le probleme est probablement dans le traitement des donnees cote frontend."

**Template de question** :

```
1. Ce que je fais : [contexte]
2. Comportement attendu : [ce qui devrait se passer]
3. Comportement reel : [ce qui se passe reellement]
4. Message d'erreur : [erreur complete]
5. Code concerne : [coller le code]
6. Ce que j'ai deja essaye : [ce que j'ai exclu]
```

### 4.3 Les pieges du debogage par IA

::: warning Trois pieges du debogage par IA
1. **L'IA peut "parler avec assurance a tort et a travers"** : La solution proposee par l'IA peut sembler raisonnable mais etre totalement fausse. Verifiez toujours vous-meme.
2. **L'IA ne connait pas votre contexte** : Elle ne sait rien de la structure de votre projet, des versions de dependances ou de l'environnement d'execution. Vous devez fournir suffisamment de contexte.
3. **Une dependance excessive a l'IA atrophie vos competences de debogage** : Si vous transmettez chaque erreur a l'IA, vous n'apprendrez jamais a deboguer par vous-meme. Analysez d'abord pendant 5 minutes avant de demander l'aide de l'IA.
:::

### 4.4 La combinaison optimale : IA + humain

```
Bug detecte
  ↓
Etape 1 : Lire le message d'erreur soi-meme (1 minute)
  ↓
Etape 2 : Formuler une hypothese (2 minutes)
  ↓
Etape 3 : Verifier rapidement l'hypothese (2 minutes)
  ↓
Bloque ? → Envoyer le message d'erreur + le code + votre analyse a l'IA
  ↓
L'IA fait une suggestion → Vous jugez si elle est raisonnable → Verification
```

---

## 5. Mentalite et habitudes de debogage : De "l'extinction des incendies" a la "prevention des incendies"

Le meilleur debogage est celui qui n'est pas necessaire. De bonnes habitudes reduisent les bugs a la source.

### 5.1 Programmation defensive

**Idee centrale** : En ecrivant le code, supposer que "tout peut mal se passer" et prendre des mesures de protection a l'avance.

```javascript
// Mauvais : supposer que data existe toujours
const name = data.user.name

// Bon : ecriture defensive
const name = data?.user?.name ?? 'Utilisateur inconnu'
```

```python
# Mauvais : supposer que le fichier peut toujours etre ouvert
content = open('config.json').read()

# Bon : ecriture defensive
try:
    content = open('config.json').read()
except FileNotFoundError:
    print("Le fichier de configuration n'existe pas, utilisation de la configuration par defaut")
    content = '{}'
```

### 5.2 Ecrire de bons journaux

Les journaux sont essentiels pour le "debogage a posteriori". En production, on ne peut pas placer de points d'arret — on ne peut compter que sur les journaux.

| Niveau de journal | Utilisation | Exemple |
|---------|------|------|
| **DEBUG** | Informations detaillees en developpement | Valeurs de variables, parametres de fonctions |
| **INFO** | Flux normal de l'activite | "Connexion utilisateur reussie", "Commande creee" |
| **WARN** | N'affecte pas la fonction mais merite attention | "Cache non trouve", "2e tentative" |
| **ERROR** | Erreur survenue, traitement necessaire | "Echec de connexion a la base de donnees", "Timeout de l'API" |

::: tip Criteres d'un bon journal
Un bon journal devrait repondre : **Quand**, **Ou**, **Que s'est-il passe**, **Quelles sont les donnees cles**.
```
[2025-01-15 14:30:22] [ERROR] [OrderService] Echec de creation de commande
  ID utilisateur : 12345, ID produit : 67890, Cause : stock insuffisant
```
:::

### 5.3 Checklist de debogage

En cas de bug, proceder dans cet ordre :

1. **Lire le message d'erreur** : Type d'erreur, fichier, numero de ligne
2. **Qu'avez-vous modifie recemment ?** : Utiliser `git diff` pour voir les changements recents
3. **Reproductible ?** : Trouver des etapes de reproduction stables
4. **Reduire le champ** : Localiser avec la recherche binaire ou la reproduction minimale
5. **Formuler et verifier une hypothese** : Ne modifier qu'une seule variable a la fois
6. **Tests de regression apres correction** : S'assurer que le correctif n'introduit pas de nouveaux problemes

### 5.4 Pieges de debogage frequents chez les debutants

| Piege | Bonne pratique |
|-----|---------|
| Modifier le code sans lire l'erreur | D'abord lire le message d'erreur en entier |
| Modifier plusieurs endroits a la fois | Modifier un seul endroit, verifier, puis passer au suivant |
| Committer sans tester apres modification | Executer les tests apres chaque modification |
| Tester uniquement sur son ordinateur | Considerer differents environnements (navigateur, systeme, reseau) |
| Ne pas nettoyer les console.log apres debogage | Supprimer tout le code de debogage avant le commit |
| Redemarrer/reinstaller en cas de probleme | D'abord comprendre la cause ; le redemarrage n'est qu'une solution temporaire |

---

## 6. Resume

Le debogage est un artisanat qui necessite une pratique deliberee. Les points cles de ce chapitre :

1. **Le debogage est une methode scientifique** : Observer → Formuler une hypothese → Experimenter → Verifier, ce n'est pas de la chance
2. **Les messages d'erreur sont des amis** : Apprendre a extraire "quoi, ou, pourquoi" des erreurs
3. **Les methodes classiques ne vieillissent jamais** : Recherche binaire, canard en caoutchouc, reproduction minimale sont les fondations de tout debogage
4. **Utiliser les outils dans le bon contexte** : console.log pour des verifications rapides, points d'arret pour des analyses approfondies, Network pour les problemes d'API
5. **L'IA est un assistant, pas une bequille** : D'abord analyser soi-meme, puis demander l'assistance de l'IA, enfin verifier soi-meme
6. **Prevenir les incendies vaut mieux que les eteindre** : La programmation defensive et de bonnes habitudes de journalisation reduisent les bugs a la source

::: tip Retenez cette phrase
**Chaque bug est une opportunite d'apprentissage.** Chaque bug que vous corrigez contribue a batir votre capacite de "reconnaissance de motifs" — la prochaine fois que vous rencontrerez un probleme similaire, vous en localiserez la cause plus rapidement.
:::

---

## Lectures complementaires

- [Documentation officielle Chrome DevTools](https://developer.chrome.com/docs/devtools/) — Guide complet des outils de debogage du navigateur
- [VS Code Debugging](https://code.visualstudio.com/docs/editor/debugging) — Tutoriel de debogage par points d'arret dans VS Code
- [How to Debug Anything](https://www.debuggingbook.org/) — Methodologie systematique de debogage
