# Fondamentaux : Pensée sécuritaire et attaque/défense

::: tip Avant-propos
**Votre site web est-il securise ?** Beaucoup de developpeurs pensent que « la securite est l'affaire de l'equipe de securite », jusqu'a ce que leur propre projet soit attaque et que les donnees utilisateur soient compromisees. La securite n'est pas une option, c'est une competence fondamentale de chaque developpeur.

Ce chapitre vous aide a etablir une pensee securitaire et a comprendre les menaces de securite web les plus courantes et les methodes de defense.
:::

**Que allez-vous apprendre dans cet article ?**

| Chapitre | Contenu | Concept cle |
|-----|------|---------|
| **Chapitre 1** | Modele de pensee securitaire | Penser comme un attaquant |
| **Chapitre 2** | Attaques web courantes | XSS, injection SQL, CSRF |
| **Chapitre 3** | Strategies de defense | Validation des entrees, encodage des sorties, controle des acces |
| **Chapitre 4** | Checklist de securite | Auto-controle de securite avant le lancement |

Apres ce chapitre, vous aurez une sensibilite basique a la securite et serez capable d'identifier et de defendre contre les menaces de securite web les plus courantes.

---

## 0. Vue d'ensemble : Pourquoi les developpeurs doivent-ils comprendre la securite

Imaginez que vous avez construit une maison — fonctionnelle et bien decoree, mais vous avez oublie d'installer des serrures. Les vulnerabilites de securite sont les « serrures oubliees » dans le monde du code.

::: tip Principes fondamentaux de la securite
- **Priviliege minimum** : N'accorder que les permissions necessaires, pas un dixieme de plus
- **Defense en profondeur** : Ne pas dependre d'une seule ligne de defense, securiser a plusieurs niveaux
- **Ne jamais faire confiance aux entrees** : Toutes les donnees provenant de l'exterieur peuvent etre malveillantes
- **Securite par defaut** : La configuration par defaut devrait etre securisee, pas pratique
:::

---

## 1. Attaques web courantes

Comprenez les principes des trois attaques web les plus courantes avec le composant interactif ci-dessous (a des fins educatives uniquement) :

<WebSecurityDemo />

### 1.1 XSS (Cross-Site Scripting)

Un attaquant injecte un script malveillant dans une page web. Lorsque d'autres utilisateurs visitent la page, le script s'execute dans leur navigateur.

```javascript
// Dangereux : inserer directement l'entree utilisateur dans le HTML
element.innerHTML = userInput
// Si userInput est <script>codeMalveillant</script>, il sera execute

// Sur : utiliser textContent ou echapper
element.textContent = userInput
// Ou utiliser l'echappement automatique du framework ({{ }} de Vue, JSX de React)
```

**Points de defense** :
- Echapper les caracteres speciaux HTML lors de la sortie (`<`, `>`, `&`, `"`, `'`)
- Utiliser les mecanismes d'echappement automatique des frameworks modernes
- Definir l'en-tete HTTP `Content-Security-Policy`

### 1.2 Injection SQL

Un attaquant construit une entree speciale pour modifier la logique d'une requete SQL.

```javascript
// Dangereux : concatenation de chaines SQL
const query = `SELECT * FROM users WHERE name = '${userInput}'`
// Si userInput est ' OR '1'='1, tous les utilisateurs seront renvoyes

// Sur : utiliser des requetes parametrees
const query = 'SELECT * FROM users WHERE name = ?'
db.execute(query, [userInput])
```

**Points de defense** :
- Toujours utiliser des requetes parametrees / prepared statements
- Utiliser un framework ORM (ex : Prisma, Sequelize)
- Limiter les permissions du compte de base de donnees

### 1.3 CSRF (Cross-Site Request Forgery)

Un attaquant attire un utilisateur connecte vers une page malveillante et utilise son etat de connexion pour envoyer des requetes.

**Points de defense** :
- Utiliser un jeton CSRF
- Verifier l'en-tete `Referer` / `Origin`
- Utiliser POST au lieu de GET pour les operations critiques
- Definir l'attribut `SameSite` sur les cookies

---

## 2. Strategies de defense

### 2.1 Validation des entrees

```javascript
// Validation par liste blanche : n'autoriser que les formats attendus
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Limitation de longueur
function isValidUsername(name) {
  return name.length >= 2 && name.length <= 50
}
```

### 2.2 Protection des donnees sensibles

| Type de donnees | Mesure de protection |
|---------|---------|
| Mots de passe | Hachage bcrypt/argon2, jamais de stockage en clair |
| Cles API | Variables d'environnement, ne pas commiter dans le depot de code |
| Donnees utilisateur | Transmission HTTPS, stockage chiffre |
| Jetons de session | Cookies HttpOnly + Secure + SameSite |

### 2.3 En-tetes HTTP de securite

```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000
```

---

## 3. Checklist de securite

Verifiez l'etat de securite de votre projet avec le composant interactif ci-dessous :

<SecurityChecklistDemo />

### 3.1 Phase de developpement

- [ ] Toutes les entrees utilisateur sont validees et echappees
- [ ] Requetes parametrees utilisees, pas de concatenation SQL
- [ ] Les mots de passe sont haches avec bcrypt ou similaire
- [ ] Les configurations sensibles sont gerees via des variables d'environnement
- [ ] Le fichier `.env` est ajoute au `.gitignore`

### 3.2 Phase de deploiement

- [ ] HTTPS active
- [ ] En-tetes HTTP de securite configures
- [ ] Mode debug et messages d'erreur detailles desactives
- [ ] La base de donnees utilise un compte a privileges minimaux
- [ ] Mise a jour reguliere des dependances (`npm audit`)

---

## 4. Support de l'IA : Ameliorer la defense securitaire avec les grands modeles linguistiques

Les grands modeles linguistiques peuvent servir de « consultant en securite » et vous aider a auditer les vulnerabilites du code et a generer des solutions de securite.

### 4.1 Audit de securite du code

> **Prompt** :
> ```
> Veuillez effectuer un audit de securite sur le code suivant, en verifiant :
> - Vulnerabilites XSS (entrees utilisateur non echappees)
> - Injection SQL (requetes par concatenation de chaines)
> - Risques CSRF (absence de verification de jeton)
> - Fuites de donnees sensibles (cles en dur, mots de passe en clair)
> Pour chaque probleme, indiquez le niveau de risque, l'emplacement exact et la solution.
>
> [Collez votre code ici]
> ```

### 4.2 Generation de configuration de securite

> **Prompt** :
> ```
> Mon projet utilise Express.js + PostgreSQL et est sur le point d'etre deploye.
> Veuillez generer une checklist complete de configuration de securite incluant :
> - Code de configuration des en-tetes HTTP de securite
> - Configuration CORS
> - Parametres de connexion securisee a la base de donnees
> - Solution de gestion des variables d'environnement
> Fournissez des extraits de code directement utilisables.
> ```

### 4.3 Explication des principes des vulnerabilites

> **Prompt** :
> ```
> Expliquez avec un exemple concret le deroulement complet d'une attaque CSRF :
> 1. Comment l'attaquant construit une page malveillante
> 2. Pourquoi le navigateur envoie automatiquement les cookies
> 3. Comment le serveur se defend avec un jeton CSRF
> Demontrez le processus complet d'attaque et de defense avec du code.
> ```

::: tip Conseil d'utilisation de l'IA
L'audit de securite de l'IA ne peut pas remplacer les tests de securite professionnels. Utilisez-la comme premier filtre — les systemes critiques necessitent toujours un audit par une equipe de securite professionnelle.
:::

---

## 5. Resume

1. **Pensee securitaire** : Ne jamais faire confiance aux entrees externes, privilege minimum, defense en profondeur
2. **Attaques courantes** : XSS, injection SQL, CSRF sont les menaces de securite web les plus frequentes
3. **Strategies de defense** : Validation des entrees, encodage des sorties, requetes parametrees, en-tetes HTTP de securite
4. **Habitudes de securite** : Passer la checklist de securite avant le lancement, auditer regulierement les dependances

::: tip Reflexion finale
La securite n'est pas un travail ponctuel, mais une habitude qui parcourt tout le processus de developpement. Comme attacher sa ceinture de securite en voiture — non pas parce qu'on s'attend a un accident, mais par conscience securitaire de base. **Pour chaque ligne de code, demandez-vous : que se passerait-il si cette entree etait malveillante ?**
:::

---

## Lectures complementaires

- **OWASP Top 10** : La liste des dix principaux risques de securite des applications web, que chaque developpeur devrait connaitre.
- **Outils pratiques** : Utilisez `npm audit` pour verifier les vulnerabilites des dependances et les plugins de securite ESLint pour inspecter le code.
- **Approfondissement** : Comprendre les principes du HTTPS, les pratiques de securite JWT et les considerations de securite OAuth 2.0.
- **Communaute de securite** : Suivez les annonces de securite et corrigez rapidement les vulnerabilites connues.
