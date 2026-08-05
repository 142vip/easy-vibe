# Fondamentaux : Expressions régulières

> 💡 **Guide d'apprentissage** : Les expressions régulières ressemblent à du charabia ? En réalité, c'est simplement un mini-langage pour « décrire des motifs de texte ». Ce chapitre vous guide depuis zéro pour comprendre les idées fondamentales des regex et apprendre à résoudre 80 % des problèmes de recherche et de validation de texte avec quelques symboles clés.

---

## 0. Motivation et justification : avez-vous besoin des expressions régulières

Imaginez les scénarios suivants :
- Extraire toutes les adresses IP d'un gros fichier de logs
- Valider si le format d'une adresse email saisie par un utilisateur est correct
- Remplacer tous les formats de date `2024/01/15` par `2024-01-15` dans un texte
- Extraire tous les liens du code source d'une page web

**Avec une recherche par chaîne classique ?** Vous devrez écrire une montagne de conditions `if-else`.
**Avec une expression régulière ?** Un seul motif suffit.

---

## 1. Introduction aux regex : prise en main en trois minutes

👇 Essayez par vous-même : saisissez une expression régulière et visualisez les correspondances en temps réel

<RegexDemo />

::: tip 💡 En une phrase
Une expression régulière = **utiliser des symboles spéciaux pour décrire « quel type de texte vous voulez trouver »**. `\d` représente un chiffre, `+` signifie un ou plusieurs, donc `\d+` veut dire « un ou plusieurs chiffres ».
:::

---

## 2. Concepts fondamentaux : assembler comme des briques

L'essence des regex est de construire le motif souhaité avec **trois types de briques** :

### 2.1 Brique 1 : classes de caractères (quel caractère correspondre)

| Syntaxe | Signification | Exemple |
|---|---|---|
| `.` | N'importe quel caractère | `a.c` → abc, a1c, a c |
| `\d` | Chiffre [0-9] | `\d\d` → 42, 99 |
| `\w` | Lettre/chiffre/tiret bas | `\w+` → hello, user_1 |
| `\s` | Caractère d'espacement | Correspond aux espaces, tabulations |
| `[abc]` | Un caractère parmi l'ensemble | `[aeiou]` → voyelles |
| `[^abc]` | Tout caractère hors ensemble | `[^0-9]` → caractères non numériques |

### 2.2 Brique 2 : quantificateurs (combien de fois)

| Syntaxe | Signification | Exemple |
|---|---|---|
| `*` | 0 ou plusieurs fois | `ab*` → a, ab, abbb |
| `+` | 1 ou plusieurs fois | `ab+` → ab, abbb (ne correspond pas à a) |
| `?` | 0 ou 1 fois | `colou?r` → color, colour |
| `{3}` | Exactement 3 fois | `\d{3}` → 123 |
| `{2,4}` | 2 à 4 fois | `\d{2,4}` → 12, 1234 |

### 2.3 Brique 3 : positions et groupes

| Syntaxe | Signification | Exemple |
|---|---|---|
| `^` | Début de ligne | `^Bonjour` → lignes commençant par Bonjour |
| `$` | Fin de ligne | `fin$` → lignes se terminant par fin |
| `\b` | Limite de mot | `\bchat\b` → chat (pas château) |
| `(...)` | Groupe de capture | `(\d+)-(\d+)` → capture séparée |
| `a\|b` | Ou | `chat\|chien` → chat ou chien |

---

## 3. Mise en pratique : motifs de validation courants

### 3.1 Validation d'email

```
[\w.+-]+@[\w-]+\.[\w.]+
```

Décomposition :
- `[\w.+-]+` — partie nom d'utilisateur (lettres, chiffres, point, plus, tiret)
- `@` — littéral @
- `[\w-]+` — partie nom de domaine
- `\.` — point échappé
- `[\w.]+` — domaine de premier niveau

### 3.2 Validation de numéro de téléphone (Chine)

```
1[3-9]\d{9}
```

Décomposition :
- `1` — commence par 1
- `[3-9]` — deuxième chiffre entre 3 et 9
- `\d{9}` — suivi de 9 chiffres

### 3.3 Vérification de la force du mot de passe

```
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$
```

Décomposition :
- `(?=.*[a-z])` — au moins une minuscule (assertion anticipée)
- `(?=.*[A-Z])` — au moins une majuscule
- `(?=.*\d)` — au moins un chiffre
- `.{8,}` — longueur totale d'au moins 8 caractères

---

## 4. Utiliser les regex dans le code

### JavaScript

```javascript
const text = 'Contact : 13812345678 ou 15099887766'
const regex = /1[3-9]\d{9}/g
const phones = text.match(regex)
// ['13812345678', '15099887766']

// Remplacer
text.replace(/\d{4}(?=\d{4}$)/, '****')
// Masquer les quatre chiffres du milieu du numéro

// Valider
/^[\w.+-]+@[\w-]+\.[\w.]+$/.test('utilisateur@exemple.com')
// true
```

### Python

```python
import re

text = 'Le prix est de 99 yuans, réduction de 20 yuans'
numbers = re.findall(r'\d+', text)
# ['99', '20']

# Remplacer
re.sub(r'\d+', 'X', text)
# 'Le prix est de X yuans, réduction de X yuans'

# Capture de groupe
match = re.search(r'(\d+)-(\d+)', '2024-01-15')
match.group(1)  # '2024'
match.group(2)  # '01'
```

---

## 5. Avidité vs Paresse : une distinction cruciale

```
Texte : <b>bonjour</b> et <b>monde</b>
```

| Motif | Résultat | Description |
|---|---|---|
| `<b>.*</b>` | `<b>bonjour</b> et <b>monde</b>` | Avide : correspond au maximum possible |
| `<b>.*?</b>` | `<b>bonjour</b>` | Paresseux : correspond au minimum possible |

::: tip 💡 À retenir
Le mode par défaut est avide. Ajoutez `?` après le quantificateur pour passer en mode paresseux. Dans la plupart des cas, c'est le mode paresseux dont vous avez besoin.
:::

---

## 6. Résumé

::: tip 📚 Points essentiels
1. **Regex = mini-langage de description de motifs textuels**, pour la recherche, la correspondance et le remplacement
2. **Trois types de briques** : classes de caractères (quoi) + quantificateurs (combien de fois) + positions/groupes
3. **\d \w \s** sont les trois classes de caractères les plus utilisées, couvrant chiffres, mots et espaces
4. **Pas besoin de partir de zéro** : des motifs regex éprouvés existent pour la plupart des scénarios courants
5. **Avide vs Paresseux** : avide par défaut (correspondance maximale), ajoutez `?` pour passer en paresseux (correspondance minimale)
:::

**Prochaines étapes d'apprentissage** :
- [Variables d'environnement et PATH](./environment-path) - Comprendre la configuration système
- [SSH et authentification par clé](./ssh-authentication) - Connexion sécurisée aux serveurs distants