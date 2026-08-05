# Principes : Gestion des identités et accès cloud
> **Guide d'apprentissage** : L'ingénierie des prompts résout le problème de « comment s'exprimer clairement », tandis que la gestion des permissions des comptes cloud résout le problème de « qui peut faire quoi ». Ce chapitre s'articule autour d'une question centrale : **dans le monde du cloud, comment autoriser facilement sans donner les clés à la mauvaise personne ?**

Avant de commencer, nous vous recommandons de consolider deux prérequis :

- **Qu'est-ce qu'un Token** : Vous pouvez d'abord lire la section « Tokenisation & Tokens » de [Introduction aux grands modèles de langage](../8-artificial-intelligence/llm-principles.md).
- **Qu'est-ce qu'un Prompt** : Si vous n'êtes pas encore familier avec la structure de base System / User / Assistant, consultez d'abord [Ingénierie des prompts](../8-artificial-intelligence/prompt-engineering/).

---

## 0. Introduction : pourquoi tombe-t-on dans les pièges dès le début du cloud

<IamRamComparisonDemo />

Beaucoup de gens rencontrent des situations similaires lorsqu'ils commencent à utiliser les services cloud :

- Pour gagner du temps, ils codent en dur l'AccessKey dans le code et le poussent sur GitHub ;
- Ils donnent des « permissions d'administrateur » à tous les employés, et quelqu'un supprime accidentellement la base de données de production ;
- Après la passation d'un projet, personne ne sait qui possède encore les identifiants des anciens employés ;
- Ils ont entendu parler du MFA, mais trouvent cela « fastidieux » et ne l'activent jamais.

Intuitivement, on pourrait penser : **« Ces employés manquent de sensibilisation à la sécurité »**.

Mais la plupart du temps, le problème ne vient pas des personnes, mais de l'**absence d'un système de gestion des permissions adéquat**.

<IntroProblemReasonSolution />

Face à ces défis, se contenter de « faire attention » ne suffit plus. Nous avons besoin d'une méthodologie systématique de gestion des permissions — c'est précisément ce que tente de résoudre **IAM (Identity and Access Management, gestion des identités et des accès)**.

---

## 1. Qu'est-ce que IAM/RAM En partant du « système de contrôle d'accès »

### 1.1 Analogie : le système de contrôle d'accès intelligent d'une entreprise

Imaginez que votre entreprise emménage dans un nouvel immeuble de bureaux :

| Scénario | Sans IAM | Avec IAM |
| :--------- | :----------------------------- | :------------------------------------------- |
| Nouvel employé | Lui donner une passe-partout qui ouvre toutes les portes | Lui donner un badge d'accès qui ne fonctionne que pour son étage |
| Départ d'un employé | La clé est perdue, on ne sait pas qui l'a | Désactiver immédiatement son badge — plus aucune porte ne s'ouvre |
| Prestataire | Lui prêter la clé pour quelques jours | Émettre un badge temporaire qui expire automatiquement au bout de 3 jours |
| Visiteur | La réception lui donne une clé | Émettre un code visiteur à usage unique, valable uniquement pour la salle de réunion |

**IAM (Identity and Access Management, gestion des identités et des accès)** est comme ce « système de contrôle d'accès intelligent » :

- **Identité (Identity)** : Qui ? Employé, prestataire, visiteur, application
- **Accès (Access)** : Quelles portes peut-on franchir ? Quelles actions peut-on effectuer ?
- **Gestion (Management)** : Comment distribuer les clés, comment les récupérer, comment consulter les logs

### 1.2 AWS IAM vs Alibaba Cloud RAM

<IamRamComparisonDemo />

Chaque fournisseur cloud possède sa propre implémentation IAM :

| Fournisseur cloud | Nom du service | Concepts clés |
| :--------- | :----------------------------------- | :------------------------ |
| **AWS** | IAM (Identity and Access Management) | User, Group, Role, Policy |
| **Alibaba Cloud** | RAM (Resource Access Management) | Utilisateur, Groupe, Rôle, Stratégie |
| **Tencent Cloud** | CAM (Cloud Access Management) | Utilisateur, Groupe, Rôle, Stratégie |
| **Huawei Cloud** | IAM | Utilisateur, Groupe, Délégation, Stratégie |
| **Azure** | Azure AD + RBAC | User, Group, Role, RBAC |

Bien que les noms diffèrent, **les concepts fondamentaux sont identiques** :

- **Utilisateur (User)** : représente une personne spécifique ou une application
- **Groupe (Group)** : gère les permissions d'un ensemble d'utilisateurs par lot
- **Rôle (Role)** : définit un ensemble de permissions qui peut être « endossé »
- **Stratégie (Policy)** : les règles de permissions spécifiques (autoriser/refuser quelle action)

---

## 2. Utilisateurs, groupes, rôles : lequel utiliser

### 2.1 Différences entre les trois types d'« identités »

<IdentityProviderDemo />

Voici une analogie avec un environnement de bureau :

| Concept | Analogie | Cas d'utilisation | Caractéristiques |
| :------------------ | :----------------------------- | :------------------- | :--------------------------------- |
| **Utilisateur (User)** | Employé permanent, avec son propre bureau et badge | Membres de l'équipe à long terme | Possède des identifiants permanents (mot de passe, AK/SK) |
| **Groupe (Group)** | Département, comme « Tech » ou « Commercial » | Gestion par lot des permissions | Ne peut pas se connecter, c'est un conteneur de permissions |
| **Rôle (Role)** | Badge visiteur temporaire, carte de prestataire | Autorisation temporaire, accès inter-comptes | Pas d'identifiants permanents, obtient des identifiants temporaires en « endossant » le rôle |

### 2.2 Cas réel : l'évolution des permissions dans une startup

**Phase 1 : L'équipe fondatrice (2-3 personnes)**

```
Problème : Utiliser directement le compte root (Root Account) pour se connecter à la console, « parce que c'est plus simple »
Risque : Le compte root possède toutes les permissions — s'il est compromis, tout le compte est perdu
```

**Phase 2 : Expansion de l'équipe (5-10 personnes)**

```
Amélioration : Créer un IAM User pour chaque personne, avec des permissions différentes
Problèmes :
- Xiao Wang, l'ops, est parti — où sont ses AK/SK sur les serveurs ?
- Le nouveau développeur front-end a besoin d'un accès en lecture seule à S3, le back-end a besoin d'un accès RDS — configuration manuelle trop fastidieuse
```

**Phase 3 : Standardisation (10-30 personnes)**

```
Améliorations :
1. Créer des IAM Groups par rôle :
   - Developers (développement) : lecture/écriture S3, EC2, RDS
   - DevOps (ops) : toutes les permissions, mais MFA obligatoire
   - ReadOnly (lecture seule) : visualisation de toutes les ressources, aucune modification
   - QAs (test) : accès aux ressources de l'environnement de test

2. Utiliser les IAM Roles :
   - Les instances EC2 utilisent des Instance Profiles — plus d'AK/SK sur les serveurs
   - L'accès inter-comptes utilise le Role Assume — pas de partage d'AK/SK
   - Le CI/CD utilise OIDC Federation — pas de stockage d'identifiants à long terme
```

**Phase 4 : Multi-comptes / Niveau entreprise (30+ personnes)**

```
Architecture :
- Master Account (compte principal) : uniquement pour la gestion de la facturation et de la structure organisationnelle
- Audit Account (compte d'audit) : collecte des journaux de tous les comptes
- Dev Account (compte de développement) : environnement de développement
- Staging Account (compte de pré-production) : environnement de test
- Prod Account (compte de production) : environnement en ligne, permissions les plus strictes

Flux des permissions :
- Les développeurs n'ont par défaut qu'un accès en lecture seule au compte Dev
- Pour modifier l'environnement de production, soumettre un ticket pour Assumer un Rôle temporaire sur Prod
- Toutes les opérations d'Assume sont enregistrées par CloudTrail, avec des audits réguliers
```

---

## 3. Rôles et stratégies : l'« âme » de la gestion des permissions

### 3.1 L'essence d'un rôle : confiance + permissions

<RolePolicyDemo />

Un IAM Role comporte deux composants essentiels :

1. **Stratégie de confiance (Trust Policy)** : Qui peut endosser ce rôle ?
2. **Stratégie de permissions (Permission Policy)** : Que peut-on faire une fois le rôle endossé ?

Voici une analogie avec le théâtre :

| Concept | Analogie | Explication |
| :-------------------- | :--------------------- | :----------------------------------------------------------------------------------------- |
| **Role (Rôle)** | Le personnage d'« Hamlet » dans la pièce | Définit le rôle à jouer (permissions) |
| **Trust Policy** | Le metteur en scène dit « qui peut jouer Hamlet » | Peut être « les acteurs de cette troupe » (utilisateurs du compte), « un acteur prêté par une autre troupe » (inter-comptes), « un invité spécial » (IdP externe) |
| **Permission Policy** | Le contenu de la pièce | Ce qu'Hamlet peut faire : dire ses répliques, se battre en duel, devenir fou (permissions spécifiques) |
| **Assume Role** | L'acteur monte sur scène | Xiao Li est choisi par le metteur en scène pour jouer Hamlet — une fois sur scène, il possède toutes les permissions définies dans la pièce |
| **Identifiants temporaires** | Le badge de représentation | Xiao Li reçoit un « badge de représentation temporaire » qui expire à la fin de la représentation |

### 3.2 Stratégie (Policy) : la « syntaxe » des permissions

<PermissionHierarchyDemo />

Un IAM Policy est un document JSON qui définit « qui peut faire quelle action sur quelle ressource ».

**Exemple de Policy complet** :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadWrite",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::my-app-bucket/*",
      "Condition": {
        "StringEquals": {
          "aws:RequestedRegion": "ap-northeast-1"
        },
        "Bool": {
          "aws:MultiFactorAuthPresent": "true"
        }
      }
    },
    {
      "Sid": "DenySensitiveData",
      "Effect": "Deny",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::my-app-bucket/sensitive/*"
    }
  ]
}
```

**Explication des champs clés** :

| Champ | Signification | Exemple |
| :------------ | :--------------------------------- | :----------------------- |
| **Version** | Version de la syntaxe Policy | "2012-10-17" |
| **Statement** | Tableau de déclarations de permissions, peut contenir plusieurs règles | [...] |
| **Sid** | ID de déclaration, facultatif, pour identifier cette règle | "AllowS3ReadWrite" |
| **Effect** | Effet : Allow (autoriser) ou Deny (refuser) | "Allow" |
| **Action** | Actions autorisées/refusées, supporte les caractères génériques | "s3:GetObject", "s3:\*" |
| **Resource** | Ressources concernées, identifiées par ARN | "arn:aws:s3:::bucket/\*" |
| **Condition** | Facultatif, ne s'applique que si certaines conditions sont remplies | Restriction de région, exigence MFA, etc. |

### 3.3 Priorité des permissions : Deny > Allow > Refus par défaut

La logique d'évaluation des permissions IAM se résume en une phrase : **un Deny explicite l'emporte toujours, sans Allow c'est refusé**.

Le flux d'évaluation est le suivant :

```
1. D'abord, vérifier s'il y a une stratégie Deny
   ├─ S'il y a un Deny → Refusé (peu importe la présence d'un Allow)
   └─ Pas de Deny → Continuer

2. Ensuite, vérifier s'il y a une stratégie Allow
   ├─ S'il y a un Allow → Autorisé
   └─ Pas d'Allow → Refusé (principe du refus par défaut)
```

**Cas pratique : Protection des données sensibles**

```json
// Stratégie 1 : permissions normales pour les développeurs
{
  "Effect": "Allow",
  "Action": ["s3:*"],
  "Resource": "arn:aws:s3:::company-data/*"
}

// Stratégie 2 : Protection du répertoire sensible (même avec s3:*, les développeurs ne peuvent pas y accéder)
{
  "Effect": "Deny",
  "Action": ["s3:*"],
  "Resource": "arn:aws:s3:::company-data/sensitive/*"
}
```

**Points clés** :

- Bien que les développeurs aient une permission Allow pour `s3:*`
- Le répertoire sensible possède une règle Deny explicite
- Deny a une priorité plus élevée, donc les développeurs ne peuvent pas accéder aux données sensibles
- Même si le développeur est administrateur, ce Deny s'applique (sauf pour le compte root)

---

## 4. Clés d'accès (AK/SK) : une « clé » à conserver avec précaution

### 4.1 Qu'est-ce qu'AK/SK

<AccessKeyManagementDemo />

Une clé d'accès (Access Key) est un identifiant à long terme fourni par les services cloud pour les appels API programmatiques. Elle se compose de deux éléments :

| Composant | Nom | Fonction | Analogie |
| :-------------------- | :----------- | :------------------------- | :--------- |
| **Access Key ID** | ID de clé d'accès | Identifie qui vous êtes (similaire à un nom d'utilisateur) | Numéro de carte bancaire |
| **Secret Access Key** | Clé d'accès secrète | Prouve que c'est bien vous (similaire à un mot de passe) | Code PIN de la carte bancaire |

### 4.2 Pourquoi AK/SK est-il un « article à haut risque »

**Histoire vraie : la leçon d'une startup**

Xiao Li est un nouvel ingénieur backend dans une startup. Sa première semaine, sa tâche est de déboguer une fonctionnalité de téléversement de fichiers.

```python
# Code écrit par Xiao Li (problème de sécurité grave !)
import boto3

# Pour faciliter le débogage, AK/SK est codé en dur dans le code
s3 = boto3.client(
    's3',
    aws_access_key_id='AKIAIOSFODNN7EXAMPLE',
    aws_secret_access_key='wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    region_name='ap-northeast-1'
)

def upload_file(file_path, bucket_name, object_name):
    s3.upload_file(file_path, bucket_name, object_name)
    print(f"Fichier téléversé vers s3://{bucket_name}/{object_name}")

# Test de téléversement
upload_file('./test.jpg', 'my-company-bucket', 'uploads/test.jpg')
```

**Ce qui s'est passé une semaine plus tard** :

1. Xiao Li pousse le code sur GitHub (y compris AK/SK)
2. Le code sur GitHub est scanné par des robots, AK/SK sont extraits
3. L'attaquant utilise ces identifiants pour créer de nombreuses instances EC2 pour miner des cryptomonnaies sur le compte de l'entreprise
4. Fin du mois, la facture arrive : dépense supplémentaire de 12 000 $
5. L'audit révèle la fuite d'AK/SK, Xiao Li est convoqué...

**Que nous apprend ce cas ?**

| Mauvaise pratique | Bonne pratique |
| :-------------------------- | :----------------------------------------------- |
| Coder AK/SK en dur dans le code | Utiliser IAM Role pour que le programme obtienne automatiquement des identifiants temporaires |
| Pousser AK/SK dans un dépôt Git | Utiliser `.gitignore` pour exclure les fichiers de configuration, utiliser un service de gestion des secrets |
| Utiliser le même AK/SK sans rotation pendant longtemps | Rotation régulière des AK/SK, utiliser des identifiants temporaires plutôt que permanents |
| Attribuer des permissions trop larges aux AK/SK | Suivre le principe du moindre privilège, n'accorder que les permissions nécessaires |

### 4.3 Guide d'utilisation sécurisée d'AK/SK

**Scénario 1 : Développement local**

```bash
# Bonne pratique : utiliser AWS CLI pour configurer les identifiants, ne pas les écrire dans le code
aws configure
# Puis saisir Access Key ID et Secret Access Key lorsque demandé
# Ces informations sont sauvegardées dans ~/.aws/credentials avec des permissions 600

# Le code n'a besoin d'aucune configuration d'identifiants
import boto3
s3 = boto3.client('s3')  # Lit automatiquement depuis ~/.aws/credentials
```

**Scénario 2 : Serveur / EC2**

```python
# Bonne pratique : utiliser IAM Instance Profile
# 1. Créer un IAM Role, attacher les permissions nécessaires (par ex. S3ReadOnly)
# 2. Créer un Instance Profile, associer ce Role
# 3. Au lancement de l'EC2, sélectionner cet Instance Profile

# Le code ne nécessite aucun identifiant
import boto3
s3 = boto3.client('s3')  # Obtient automatiquement des identifiants temporaires depuis le service de métadonnées EC2

# Les identifiants temporaires sont automatiquement renouvelés, pas de souci d'expiration
```

**Scénario 3 : Pipeline CI/CD**

```yaml
# Bonne pratique : utiliser OIDC Federation (OpenID Connect)
# Exemple avec GitHub Actions :

# 1. Dans AWS, créer un OIDC Identity Provider qui fait confiance à GitHub
# 2. Créer un IAM Role dont la stratégie de confiance autorise le dépôt GitHub spécifique à endosser le rôle
# 3. Configurer dans GitHub Actions

name: Deploy
on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write # Clé : autoriser la demande de jeton OIDC
      contents: read
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsRole
          aws-region: ap-northeast-1
          # Note : pas d'Access Key ici ! Utilisation exclusive d'identifiants temporaires

      - name: Deploy
        run: aws s3 sync ./build s3://my-bucket/
```

**Résumé : Niveaux de sécurité pour l'utilisation d'AK/SK**

| Niveau de sécurité | Approche | Scénario d'utilisation | Niveau de risque |
| :------- | :-------------------------- | :------------------------ | :------- |
| Maximum | Utiliser IAM Role (pas d'identifiants à long terme) | EC2, Lambda, ECS, CI/CD | Très faible |
| Élevé | Utiliser OIDC Federation | GitHub Actions, GitLab CI | Faible |
| Moyen | Utiliser un service de gestion des secrets | Développement local, petites équipes | Moyen |
| Faible | Utiliser des variables d'environnement | Prototypage rapide, projets personnels | Élevé |
| Très faible | Codé en dur dans le code | Déconseillé dans tous les scénarios | Très élevé |

---

## 5. Authentification multi-facteurs (MFA) : ajouter un « cadenas » à votre compte

### 5.1 Qu'est-ce que le MFA

<MfaSecurityDemo />

Le MFA (Multi-Factor Authentication, authentification multi-facteurs), aussi appelé 2FA (Two-Factor Authentication, authentification à deux facteurs), est un mécanisme de sécurité qui exige que l'utilisateur fournisse **deux facteurs d'authentification ou plus** de types différents lors de la connexion :

| Type de facteur | Définition | Exemples |
| :------------------------- | :----------------- | :------------- |
| **Facteur de connaissance** (ce que vous savez) | Information connue uniquement de l'utilisateur | Mot de passe, code PIN |
| **Facteur de possession** (ce que vous possédez) | Dispositif physique détenu par l'utilisateur | Téléphone, clé matérielle |
| **Facteur biométrique** (ce que vous êtes) | Caractéristique biométrique de l'utilisateur | Empreinte digitale, reconnaissance faciale |

### 5.2 Pourquoi le MFA est-il si important

**Les données parlent d'elles-mêmes** :

| Type d'attaque | Taux de succès sans MFA | Taux de succès avec MFA |
| :----------------------- | :------------------ | :------------------------------ |
| Deviner le mot de passe / attaque par force brute | Élevé | Très faible (nécessite un second facteur) |
| Hameçonnage pour obtenir le mot de passe | Élevé | Très faible (la page de phishing ne peut pas obtenir le code MFA) |
| Fuite de mot de passe (fuite depuis un autre site) | Élevé | Très faible (le second facteur est inconnu) |

**Rapport de sécurité Microsoft (2020)** : activer le MFA bloque **99,9 %** des attaques automatisées.

### 5.3 MFA en pratique : activer le MFA pour le compte root AWS

**Étape 1 : Se connecter à la console AWS**

1. Se connecter avec l'e-mail et le mot de passe du compte root
2. En haut à droite, cliquer sur le nom du compte, sélectionner « Security Credentials »

**Étape 2 : Activer le MFA**

1. Trouver la section « Multi-factor authentication (MFA) »
2. Cliquer sur « Assign MFA device »
3. Choisir le type de dispositif MFA (recommandé : « Authenticator app »)

**Étape 3 : Configurer le MFA virtuel**

1. Installer Google Authenticator ou Microsoft Authenticator sur votre téléphone
2. Scanner le QR code ou saisir la clé manuellement
3. Saisir le code à 6 chiffres affiché par l'application (saisir deux codes consécutifs, car le code se renouvelle toutes les 30 secondes)

**Terminé !** Votre compte root est maintenant protégé par MFA.

---

## 6. Accès inter-comptes : comment « rendre visite » en toute sécurité

### 6.1 Pourquoi l'accès inter-comptes est-il nécessaire

<CrossAccountAccessDemo />

Avec la croissance de l'entreprise, beaucoup d'entreprises adoptent une **architecture multi-comptes** pour isoler les différents environnements :

| Type de compte | Usage | Exigences de permissions |
| :------------------ | :--------------------- | :----------------- |
| **Master Account** | Gestion organisationnelle, facturation | Quasiment jamais utilisé |
| **Security Audit** | Collecte centralisée des journaux de tous les comptes | Accès en lecture seule aux autres comptes |
| **Shared Services** | Ressources partagées (registre d'images, etc.) | Accès en lecture seule depuis les autres comptes |
| **Development** | Environnement de développement | Permissions complètes pour les développeurs |
| **Staging** | Environnement de test / pré-production | Permissions pour l'équipe de test |
| **Production** | Environnement de production | Accès strictement limité, approbation requise |

**Problème : comment l'EC2 du compte Production peut-il tirer les images du compte Shared Services ?**

- Option A : Écrire AK/SK dans les données utilisateur de Production (dangereux ! Risque de fuite d'AK/SK)
- Option B : Utiliser le Role Assume inter-comptes (recommandé ! Identifiants temporaires, renouvellement automatique)

### 6.2 Principe du Role Assume inter-comptes

```
Compte A (Production)                    Compte B (Shared Services)
    |                                           |
    |  1. Demande de Assume Role                |
    |  "Je veux endosser le ECRReadRole du compte B" |
    |------------------------------------------>|
    |                                           |
    |                    2. Vérification de la stratégie de confiance |
    |                    "Le compte A peut-il m'endosser ?" |
    |                                           |
    |  3. Retour des identifiants temporaires   |
    |  AccessKeyId, SecretKey, SessionToken     |
    |<------------------------------------------|
    |                                           |
    |  4. Utilisation des identifiants temporaires pour accéder à ECR |
    |  docker pull compteB.dkr.ecr...           |
```

**Points clés** :

- Les identifiants temporaires sont valables 1 heure par défaut, configurables jusqu'à 12 heures maximum
- Aucun identifiant à long terme à stocker dans le code
- La stratégie de confiance peut limiter qui peut endosser le rôle (par ex. compte spécifié, ID externe spécifié)

### 6.3 Pratique : Configurer l'accès ECR inter-comptes

**Scénario** : L'EC2 du compte Production doit tirer les images Docker du compte Shared Services.

**Étape 1 : Créer un IAM Role dans le compte Shared Services**

1. Se connecter à la console AWS du compte Shared Services
2. Aller dans IAM -> Roles -> Create role
3. Sélectionner « Another AWS account »
4. Saisir l'Account ID du compte Production
5. Optionnel : cocher « Require external ID » et saisir une chaîne aléatoire (sécurité renforcée)
6. Attacher la permission : AmazonEC2ContainerRegistryReadOnly
7. Nommer le Role : CrossAccountECRReadRole

**Étape 2 : Obtenir l'ARN du Role**

Après création, copier l'ARN du Role :

```
arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole
```

**Étape 3 : Configurer l'instance EC2 dans le compte Production**

Option A : Utiliser un Instance Profile (recommandé)

1. Créer un IAM Role dans le compte Production (pour EC2)
2. Stratégie de confiance : faire confiance au service EC2
3. Stratégie de permissions : autoriser le Assume du Role inter-comptes

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole"
    }
  ]
}
```

4. Créer un Instance Profile, associer ce Role
5. Au lancement de l'EC2, sélectionner cet Instance Profile

Option B : Assume Role dynamique dans les données utilisateur EC2

```bash
#!/bin/bash
# Installer AWS CLI
yum install -y aws-cli

# Assumer le Role inter-comptes
CREDS=$(aws sts assume-role \
  --role-arn arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole \
  --role-session-name EC2PullSession)

# Extraire les identifiants temporaires
export AWS_ACCESS_KEY_ID=$(echo $CREDS | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo $CREDS | jq -r '.Credentials.SessionToken')

# Se connecter à ECR
aws ecr get-login-password --region ap-northeast-1 | \
  docker login --username AWS --password-stdin SHARED_SERVICES_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com

# Tirer l'image
docker pull SHARED_SERVICES_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com/my-app:latest
```

**Étape 4 : Tester l'accès inter-comptes**

Sur l'EC2 de Production, exécuter :

```bash
# Tester si le Assume Role fonctionne
aws sts get-caller-identity
# Devrait afficher : arn:aws:sts::PRODUCTION_ACCOUNT_ID:assumed-role/CrossAccountECRReadRole/EC2PullSession

# Tester si l'on peut lister les dépôts ECR de Shared Services
aws ecr describe-repositories --registry-id SHARED_SERVICES_ACCOUNT_ID
```

**Terminé !** L'EC2 de Production peut maintenant tirer en toute sécurité les images de Shared Services, sans partager d'identifiants à long terme.

---

## 7. Pratique : construire un système de permissions sécurisé

### 7.1 Concevoir l'architecture des permissions depuis zéro

<BestPracticesDemo />

Supposons que vous êtes le responsable technique d'une startup de 10 personnes et que vous devez concevoir l'architecture de permissions AWS depuis zéro. Voici les étapes de mise en œuvre recommandées :

**Phase 1 : Protection du compte root (Jour 1)**

```
Objectif : Protéger le compte root, le compte le plus important

1. Activer le MFA sur le compte root (obligatoire)
   - Recommandation : MFA matériel (YubiKey) ou Google Authenticator

2. Créer un compte administrateur IAM
   - Nom d'utilisateur : admin (ou votre nom)
   - Permissions : AdministratorAccess (sera restreint ultérieurement)
   - Activer le MFA

3. Supprimer l'Access Key du compte root (s'il en a été créé un)
   - Le compte root ne devrait jamais avoir d'AK/SK

4. Configurer les alertes d'utilisation du compte root
   - Utiliser CloudWatch + SNS pour envoyer un e-mail/SMS dès que le compte root se connecte
```

**Phase 2 : Groupement des permissions d'équipe (Semaine 1)**

```
Objectif : Regrouper les membres de l'équipe, gérer les permissions par lot

1. Analyser les rôles dans l'équipe :
   - Développeurs backend (2 personnes)
   - Développeurs frontend (1 personne)
   - Développeurs mobile (1 personne)
   - Chef de produit (1 personne)
   - Designer (1 personne)
   - Fondateurs / administrateurs (3 personnes)

2. Créer des IAM Groups :

   Group: Developers
   ├── Membres : tous les développeurs (backend, frontend, mobile)
   ├── Permissions :
   │   ├── EC2 : lancer, arrêter, visualiser (mais pas supprimer les instances d'autres personnes)
   │   ├── S3 : lecture/écriture sur les buckets de l'environnement de développement
   │   ├── RDS : lecture seule (ne peut pas modifier la base de données de production)
   │   └── CloudWatch : visualiser les journaux
   └── Restriction : peut uniquement opérer dans la région ap-northeast-1

   Group: ProductTeam
   ├── Membres : chef de produit, designer
   ├── Permissions :
   │   ├── S3 : lecture seule (visualiser les fichiers de données)
   │   ├── CloudWatch Dashboard : visualiser les graphiques de surveillance
   │   └── Cost Explorer : visualiser la facturation (mais pas modifier)
   └── Restriction : lecture seule, ne peut modifier aucune ressource

   Group: Administrators
   ├── Membres : fondateurs, responsable technique
   ├── Permissions : AdministratorAccess
   └── Exigence : MFA obligatoire pour toute opération

3. Créer un IAM User pour chaque personne, l'ajouter au Group correspondant
   - Ne pas attacher de permissions directement aux individus — tout gérer via les Groups
   - Activer le MFA (obligatoire)
```

**Phase 3 : Optimisation des permissions au niveau applicatif (Semaines 2-4)**

```
Objectif : Permettre aux applications d'accéder sécuritairement aux ressources AWS

1. Les instances EC2 utilisent des Instance Profiles
   - Plus besoin de configurer AK/SK sur les serveurs
   - Créer un IAM Role, attacher les permissions nécessaires (par ex. lecture/écriture S3)
   - Créer un Instance Profile, associer ce Role
   - Au lancement de l'EC2, sélectionner cet Instance Profile
   - Le code applicatif utilise directement boto3, sans configuration d'identifiants

2. Si l'utilisation d'AK/SK est obligatoire (intégration tierce)
   - Utiliser AWS Secrets Manager pour stocker AK/SK
   - L'application les lit depuis Secrets Manager au démarrage
   - Configurer une rotation régulière (90 jours)
   - Surveiller l'utilisation des AK/SK

3. Configurer CloudTrail pour enregistrer tous les appels API
   - Créer un bucket S3 dédié pour stocker les journaux
   - Activer la validation des fichiers journaux (prévention contre la falsification)
   - Configurer les notifications SNS pour les événements critiques (utilisation du compte root, modification de stratégie)
```

**Phase 4 : Durcissement de la sécurité (continu)**

```
Objectif : Établir une surveillance et une amélioration continue de la sécurité

1. Activer AWS Config
   - Surveiller les modifications de configuration des ressources
   - Vérifier la conformité (par ex. si un security group a ouvert 0.0.0.0/0)

2. Activer IAM Access Analyzer
   - Analyser en continu les stratégies de ressources
   - Identifier les accès externes (par ex. bucket S3 public)

3. Auditer régulièrement la configuration IAM
   - Vérifier chaque mois les IAM Users et Roles inutilisés
   - Vérifier l'utilisation des Access Keys
   - Valider que les membres des Groups sont appropriés

4. Établir un processus de réponse aux incidents de sécurité
   - Si fuite d'AK/SK découverte : suppression immédiate, rotation, audit de l'impact
   - Si appels API anormaux détectés : enquête immédiate, restriction des permissions
```

---

## 8. Pièges courants et guide de prévention

### 8.1 Les dix anti-patterns IAM

| # | Anti-pattern | Pourquoi c'est problématique | Bonne pratique |
| :-- | :--------------------------- | :--------------------------------------------- | :----------------------------------------------- |
| 1 | Utiliser le compte root pour les opérations quotidiennes | Le compte root possède toutes les permissions — en cas de compromission, impossible de limiter les dégâts | Créer un compte administrateur IAM, n'utiliser le compte root qu'en cas de nécessité absolue |
| 2 | Donner AdministratorAccess à tout le monde | Violation du principe du moindre privilège, augmentation des risques d'erreur et de menace interne | Regrouper par rôle, n'accorder que les permissions nécessaires |
| 3 | Coder AK/SK en dur dans le code | Les AK/SK fuient facilement via GitHub, et la rotation est difficile | Utiliser IAM Role, variables d'environnement ou service de gestion des secrets |
| 4 | Ne jamais faire tourner les AK/SK | Augmente la fenêtre de risque en cas de fuite d'identifiants | Configurer une rotation tous les 90 jours — ou mieux, utiliser des identifiants temporaires |
| 5 | Ignorer le MFA | En cas de fuite de mot de passe, le compte est immédiatement compromis | Activer MFA pour tous les utilisateurs IAM, en particulier les plus privilégiés |
| 6 | Ne pas utiliser CloudTrail | Impossible d'auditer qui a fait quoi — pas de traçabilité en cas d'incident | Activer CloudTrail, stocker les journaux dans un compte d'audit séparé |
| 7 | IAM Policy trop permissive | Par ex. `Resource: "*"`, `Action: "*"` — augmente la surface d'attaque | Spécifier explicitement les ARN de ressources et les Actions concrètes |
| 8 | Ne pas nettoyer les IAM Users des employés partis | Les comptes zombies peuvent devenir des portes dérobées | Établir un processus de départ — désactiver et supprimer immédiatement les IAM Users |
| 9 | Ne pas utiliser IAM Access Analyzer | Impossible de détecter les stratégies de ressources trop permissives (par ex. bucket S3 public) | Activer IAM Access Analyzer, vérifier régulièrement les accès externes |
| 10 | Ne pas tester les Policies en environnement de test | Appliquer une Policy directement en production peut causer une interruption de service | Utiliser IAM Policy Simulator pour tester, valider d'abord en environnement de test |

---

## 9. Glossaire

| Terme anglais | Traduction française | Explication |
| :--------------------------------------- | :-------------- | :----------------------------------------- |
| **IAM (Identity and Access Management)** | Gestion des identités et des accès | Service de gestion des identités et des permissions dans le cloud |
| **RAM (Resource Access Management)** | Gestion des accès aux ressources | Nom du service IAM d'Alibaba Cloud |
| **Root Account** | Compte root | Le compte propriétaire créé lors de l'inscription au cloud, avec les permissions les plus élevées |
| **IAM User** | Utilisateur IAM / sous-compte | Identité secondaire créée par le compte root, pour les opérations quotidiennes |
| **IAM Role** | Rôle IAM | Support de permissions temporaire, sans identifiants à long terme, doit être « endossé » |
| **IAM Policy** | Stratégie IAM | Définition de règles de permissions au format JSON |
| **ARN** | Nom de ressource Amazon | Identifiant de ressource globalement unique |
| **AK/SK** | Clé d'accès / clé secrète | Identifiants pour l'accès programmatique aux API cloud |
| **STS** | Service de jetons de sécurité | Service fournissant des identifiants de sécurité temporaires |
| **MFA** | Authentification multi-facteurs | Méthode d'authentification nécessitant deux facteurs ou plus |
| **SSO** | Authentification unique | Méthode d'authentification permettant d'accéder à plusieurs systèmes avec une seule connexion |
| **ExternalId** | ID externe | Identifiant de sécurité utilisé pour prévenir les attaques par proxy confus |
| **CloudTrail** | Service d'audit cloud | Service de journalisation de tous les appels API et opérations dans un compte cloud |

---

## Résumé : principes fondamentaux de la gestion des permissions dans le cloud

La gestion des permissions des comptes cloud ne se fait pas en un jour — elle doit évoluer en fonction de la taille de l'équipe et des besoins métier :

1. **Phase de démarrage** (1-10 personnes) :
   - Protéger le compte root (MFA + ne pas l'utiliser pour les opérations quotidiennes)
   - Créer un compte administrateur IAM
   - Regroupement de base (Developers, Admins)

2. **Phase de croissance** (10-50 personnes) :
   - Regroupement fin des permissions (front-end, back-end, ops, produit, etc.)
   - Utiliser les IAM Roles plutôt que AK/SK
   - Activer l'audit CloudTrail
   - Audits réguliers des permissions

3. **Phase de maturité** (50+ personnes / multi-comptes) :
   - Architecture multi-comptes (Dev, Staging, Prod séparés)
   - Compte d'audit centralisé pour les journaux
   - Audits et alertes automatisés des permissions
   - Processus complet de demande et d'approbation des permissions

**Trois principes fondamentaux à retenir** :

1. **Principe du moindre privilège** : n'accorder que les permissions nécessaires, ne pas donner AdministratorAccess
2. **Éviter les identifiants à long terme** : privilégier les IAM Roles et les identifiants temporaires pour éviter les fuites d'AK/SK
3. **Activer le MFA** : en particulier pour le compte root et les comptes à privilèges élevés — c'est la mesure de sécurité la plus efficace

---

> **Pour aller plus loin** :
>
> - [Documentation officielle AWS IAM](https://docs.aws.amazon.com/iam/)
> - [Documentation officielle Alibaba Cloud RAM](https://www.aliyun.com/product/ram)
> - [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
