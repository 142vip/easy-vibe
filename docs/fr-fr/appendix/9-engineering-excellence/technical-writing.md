# Introduction : Rédaction technique pour ingénieurs

::: tip Avant-propos
**Quelqu'un lit-il votre documentation ?** Beaucoup de developpeurs pensent que « tant que le code fonctionne, la documentation peut attendre ». Le resultat : les nouveaux employes ne comprennent pas le projet, l'integration d'API se fait uniquement par communication orale, et apres six mois, vous avez vous-meme oublie pourquoi vous avez concu les choses ainsi.

Ce chapitre vous aide a maitriser les methodes cles de la redaction technique, pour que votre documentation soit reellement lue, comprise et utilisee.
:::

**Que allez-vous apprendre dans cet article ?**

| Chapitre | Contenu | Concept cle |
|-----|------|---------|
| **Chapitre 1** | Types et structures de documentation | Comment ecrire differents types de documents |
| **Chapitre 2** | Principes de redaction | Clair, precis, concis |
| **Chapitre 3** | Comparaison pratique | Bonne vs mauvaise documentation |
| **Chapitre 4** | Maintenance de la documentation | Garder la documentation a jour |

Apres ce chapitre, vous serez capable de rediger une documentation technique bien structuree, precise et facile a maintenir.

---

## 0. Vue d'ensemble : Pourquoi la documentation technique est-elle importante

Le code dit a l'ordinateur « comment », la documentation dit aux humains « pourquoi ». Un projet sans documentation est comme un appareil electro-menager sans mode d'emploi — on peut l'utiliser, mais il faut tout deviner.

::: tip La valeur d'une bonne documentation
- **Reduire les couts de communication** : Les nouveaux arrivants peuvent se former seuls, moins de questions repetees
- **Preserver le contexte des decisions** : Enregistrer le « pourquoi », pas seulement le « quoi »
- **Ameliorer la credibilite du projet** : Une bonne documentation est la vitrine d'un projet open source
- **Accelerer la collaboration** : La documentation API permet le developpement parallele frontend/backend
:::

---

## 1. Types et structures de documentation

Comprenez la structure standard des differents types de documentation avec le composant interactif ci-dessous :

<DocStructureDemo />

### 1.1 Types de documentation courants

| Type de document | Public cible | Contenu principal |
|---------|---------|---------|
| **README** | Tout le monde | Qu'est-ce que le projet, comment l'utiliser, comment contribuer |
| **Documentation API** | Consommateurs d'API | Points de terminaison, parametres, reponses, codes d'erreur |
| **Documentation d'architecture** | Equipe de developpement | Conception du systeme, choix technologiques, flux de donnees |
| **Journal des modifications** | Utilisateurs/developpeurs | Evolutions par version, ajouts/corrections/changes cassants |
| **Guide de contribution** | Contributeurs | Environnement de developpement, normes de code, processus PR |

### 1.2 La structure doree du README

Un bon README devrait contenir :

1. **Nom du projet + description en une phrase** : Comprendre de quoi il s'agit en 3 secondes
2. **Demarrage rapide** : Fonctionner en un minimum d'etapes
3. **Fonctionnalites cles** : Les points forts principaux
4. **Installation** : Prerequis detailles et etapes d'installation
5. **Exemples d'utilisation** : Code copiable et collable
6. **Guide de contribution** : Comment participer
7. **Licence** : Informations legales

---

## 2. Principes de redaction

### 2.1 Clarte avant tout

```markdown
<!-- Mauvais : vague -->
Cette fonction traite les donnees.

<!-- Bon : concret et precis -->
Convertit les donnees de commandes brutes au format facture, incluant le calcul des taxes et la conversion de devises.
```

### 2.2 Orientation lecteur

Avant de rediger, posez-vous la question : **Qui va lire ce document ? De quelles informations ont-ils besoin ?**

- Pour les debutants : Expliquer les termes, fournir des exemples complets
- Pour les developpeurs experimentes : Aller droit au but, fournir une reference API
- Pour les non-techniciens : Utiliser des analogies, eviter le jargon

### 2.3 Les exemples de code sont la meilleure documentation

```markdown
<!-- Mauvais : description textuelle uniquement -->
Appelez la fonction createUser en passant le nom d'utilisateur et l'email.

<!-- Bon : fournir un exemple executable -->
const user = await createUser({
  name: 'Jean Dupont',
  email: 'jean@example.com'
})
// Retourne : { id: 'u_123', name: 'Jean Dupont', createdAt: '2025-01-15' }
```

---

## 3. Comparaison pratique

Comparez la bonne et la mauvaise redaction technique avec le composant interactif ci-dessous :

<TechWritingPracticeDemo />

### 3.1 Convention des messages de commit

```
# Mauvais
fix bug
update code

# Bon (Commits Conventionnels)
fix: corrige l'ecran blanc de la page de connexion dans Safari
feat: prend en charge l'export par lot de rapports au format PDF
docs: met a jour l'exemple de code dans la section authentification API
```

### 3.2 L'art des commentaires

```javascript
// Mauvais : decrit « quoi » (le code le dit deja)
// Parcourir le tableau
for (const item of items) { ... }

// Bon : explique « pourquoi »
// Parcours en ordre inverse car la suppression en avant fait sauter l'element suivant
for (let i = items.length - 1; i >= 0; i--) { ... }
```

---

## 4. Maintenance de la documentation

### 4.1 Documentation en tant que code

Gerer la documentation et le code dans le meme depot, avec le meme flux de travail :

- Soumettre les modifications de documentation avec le code dans un PR
- CI verifie le format de la documentation et la validite des liens
- Mettre a jour la documentation lors de chaque release

### 4.2 Eviter la pourriture de la documentation

| Probleme | Solution |
|------|---------|
| Documentation obsolette | Forcer la mise a jour de la documentation lors des modifications de code (verifications PR) |
| Personne ne maintient | Designer des responsables de documentation |
| Contenu duplique | Source unique de verite, les autres endroits renvoient par lien |

---

## 5. Support de l'IA : Ameliorer la qualite de la documentation avec les grands modeles linguistiques

Les grands modeles linguistiques sont pratiquement « doues » dans le domaine de la redaction technique — generer de la documentation, ameliorer les formulations, traduire du contenu sont tous des points forts.

### 5.1 Generer de la documentation API

> **Prompt** :
> ```
> Generez une documentation API complete a partir du code de route Express suivant :
> - Chemin et methode du point de terminaison
> - Parametres de requete (parametres de chemin, query params, corps de requete) et types
> - Exemples de reponses en succes et en erreur
> - Exemple d'appel avec curl
>
> [Collez votre code de route ici]
> ```

### 5.2 Ameliorer la redaction technique

> **Prompt** :
> ```
> Ameliorez les formulations de la documentation technique suivante :
> 1. Langage clair et concis, eliminer les redondances
> 2. Remplacer la voix passive par la voix active
> 3. Maintenir la precision des termes techniques
> 4. Ajouter des exemples de code si necessaire
> Conservez le sens original, n'ameliorez que la qualite de l'expression.
>
> [Collez le contenu de votre documentation ici]
> ```

### 5.3 Generer un README

> **Prompt** :
> ```
> Generez un README.md de qualite a partir des informations de projet suivantes :
> - Nom du projet : [nom]
> - Description en une phrase : [description]
> - Stack technologique : [lister]
> - Fonctionnalites cles : [lister]
>
> Inclure : presentation du projet, demarrage rapide, fonctionnalites,
> etapes d'installation (avec code), exemples d'utilisation, guide de contribution, licence.
> ```

::: tip Conseil d'utilisation de l'IA
La documentation generee par l'IA doit etre verifiee pour l'exactitude technique — elle peut inventer des parametres API inexistants ou des valeurs de retour incorrectes. Verifiez toujours par rapport au code reel.
:::

---

## 6. Resume

1. **Correspondance des types** : differents documents ont des structures et des approches de redaction differentes
2. **Clarte avant tout** : concret, precis, oriente lecteur
3. **Pilote par les exemples** : un bon exemple de code vaut mieux que mille mots
4. **Maintenance continue** : documentation en tant que code, evoluer avec le projet

::: tip Reflexion finale
Ecrire de la documentation n'est pas une perte de temps, c'est **investir dans le futur**. 30 minutes de documentation aujourd'hui peuvent faire economiser 1 heure a 10 personnes. Une bonne documentation est le meilleur investissement pour votre equipe.
:::

---

## Lectures complementaires

- **Guide de redaction** : Le cours de redaction technique (Technical Writing) de Google est gratuit et pratique.
- **Outils de documentation** : Des frameworks modernes comme VitePress, Docusaurus, GitBook.
- **Documentation API** : La specification OpenAPI/Swagger est le standard de l'industrie pour la documentation d'API.
- **Conseil pratique** : Commencez par ecrire un bon README pour votre propre projet.
