# Principes : Infrastructure as Code (IaC)

::: tip Avant-propos
**Avez-vous déjà vécu ce cauchemar : le serveur de production est en panne, mais personne ne se souvient comment il a été configuré à l'origine ?** Se connecter manuellement au serveur, taper des commandes de mémoire, prier pour ne pas se tromper — c'est le quotidien de l'exploitation traditionnelle. L'Infrastructure as Code (IaC) a radicalement changé tout cela : définir et gérer l'infrastructure par du code, rendre la configuration des serveurs aussi traçable, reproductible et auditable que du logiciel.
:::

**Que allez-vous apprendre dans cet article ?**

À l'issue de ce chapitre, vous maîtriserez :

- **Concepts fondamentaux** : comprendre ce qu'est l'IaC et pourquoi c'est la pierre angulaire de l'exploitation moderne
- **Compréhension du flux de travail** : maîtriser les quatre étapes de Terraform : Write → Plan → Apply → Destroy
- **Choix des outils** : connaître les forces et faiblesses des outils majeurs comme Terraform, Pulumi et CloudFormation
- **Conscience des risques** : comprendre les dangers de la dérive de configuration et les méthodes de détection
- **Bonnes pratiques** : maîtriser les méthodes de gestion ingénierique des projets IaC

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Concepts de l'IaC | Exploitation manuelle vs gestion par code |
| **Chapitre 2** | Flux de travail Terraform | Write → Plan → Apply |
| **Chapitre 3** | Comparaison des outils | Terraform, Pulumi, CDK |
| **Chapitre 4** | Dérive de configuration | Détection, prévention, correction |
| **Chapitre 5** | Bonnes pratiques | Modularisation, gestion d'état, CI/CD |

---

## 0. Vue d'ensemble : pourquoi l'infrastructure a-t-elle aussi besoin de « code source »

Imaginez que vous êtes un chef. Si chaque plat est préparé au feeling — une cuillère de sel aujourd'hui, deux demain — le goût ne sera jamais constant. Mais si vous notez la recette — en précisant chaque ingrédient au gramme près — n'importe qui pourra reproduire le même résultat.

La gestion de l'infrastructure pose le même problème. La configuration d'un serveur peut impliquer le système d'exploitation, les règles réseau, les groupes de sécurité, les volumes de stockage, les variables d'environnement et des dizaines d'autres paramètres. La configuration manuelle est non seulement sujette aux erreurs, mais elle est aussi **non reproductible, non auditable et non réversible**.

::: tip La valeur fondamentale de l'IaC
- **Reproductible** : un même code, exécuté autant de fois que nécessaire, produit toujours le même résultat (idempotence)
- **Contrôlable par version** : les modifications d'infrastructure sont gérées via Git — qui a changé quoi et pourquoi est parfaitement clair
- **Auditable** : toutes les modifications sont enregistrées, satisfaisant aux exigences de conformité
- **Automatisable** : déploiement automatique via les pipelines CI/CD, éliminant les risques d'erreur humaine
- **Collaboratif** : les membres de l'équipe examinent les modifications d'infrastructure via des Pull Requests, comme pour du code applicatif
:::

---

## 1. Concepts de l'IaC : des « clics manuels » à la « déclaration par code »

L'exploitation traditionnelle fonctionnait ainsi : se connecter à la console du fournisseur cloud, créer manuellement des serveurs par clics, configurer le réseau, définir les groupes de sécurité. Cette approche reste gérable pour quelques serveurs, mais devient un cauchemar à l'échelle de dizaines, voire de centaines de machines.

L'idée fondamentale de l'IaC est : **décrire l'état souhaité de votre infrastructure avec du code déclaratif, et laisser les outils le réaliser automatiquement**. Vous n'avez pas besoin de dire à l'outil « crée d'abord un VPC, puis un sous-réseau, puis un groupe de sécurité » (impératif), il suffit de déclarer « je veux un environnement réseau de ce type » (déclaratif), et l'outil calcule automatiquement les étapes à exécuter.

<IaCConceptDemo />

| Dimension | Exploitation manuelle | Infrastructure as Code |
|------|---------|--------------|
| Mode opératoire | Se connecter à la console et cliquer | Écrire des fichiers de code |
| Reproductibilité | Dépend de la documentation et de la mémoire | Le code est la documentation, 100 % reproductible |
| Suivi des modifications | Pas d'enregistrement ou enregistrement incomplet | Contrôle de version Git, historique complet |
| Mode de collaboration | Communication orale, transmission de documents | Revue par Pull Request |
| Capacité de rollback | Opérations manuelles inverses | git revert + apply |
| Cohérence | Fortes différences entre environnements | Développement/test/production parfaitement identiques |

::: tip Déclaratif vs Impératif
- **Déclaratif (Declarative)** : décrit « ce que je veux », l'outil calcule automatiquement « comment le faire ». Terraform et CloudFormation adoptent cette approche. Avantage : bonne idempotence. Inconvénient : flexibilité limitée.
- **Impératif (Imperative)** : décrit « comment faire », exécution étape par étape. Ansible et les scripts Shell adoptent cette approche. Avantage : flexibilité. Inconvénient : difficulté à garantir l'idempotence.
- **Hybride** : Pulumi et AWS CDK s'écrivent dans des langages de programmation généraux, combinant la gestion d'état déclarative et la flexibilité impérative.
:::

---

## 2. Flux de travail Terraform : Write → Plan → Apply

Terraform est l'outil IaC le plus populaire, développé par HashiCorp. Son flux de travail est clair et intuitif, divisé en quatre phases, comme le cycle « coder → réviser → déployer → nettoyer » du développement logiciel.

<TerraformWorkflowDemo />

::: tip Le flux de travail en quatre phases
1. **Write (Écrire)** : rédiger les fichiers de définition d'infrastructure en HCL (HashiCorp Configuration Language) avec l'extension `.tf`. Déclarer les ressources nécessaires : serveurs, bases de données, réseaux, etc.
2. **Plan (Planifier)** : exécuter `terraform plan`. Terraform compare l'état actuel avec l'état cible et génère un « plan d'exécution » — vous indiquant quelles ressources il prévoit de créer, modifier ou supprimer. C'est un filet de sécurité vous permettant de valider les changements avant leur exécution réelle.
3. **Apply (Appliquer)** : une fois le plan validé, exécuter `terraform apply`. Terraform crée ou modifie les ressources selon le plan. Une fois l'exécution terminée, l'état courant est sauvegardé dans le fichier d'état (terraform.tfstate).
4. **Destroy (Détruire)** : lorsque les ressources ne sont plus nécessaires, exécuter `terraform destroy` pour nettoyer toutes les ressources et éviter les coûts inutiles.
:::

| Commande | Rôle | Modifie l'infrastructure | Cas d'utilisation |
|------|------|----------------|---------|
| `terraform init` | Initialiser le projet, télécharger les providers | Non | Première utilisation ou ajout d'un nouveau provider |
| `terraform plan` | Prévisualiser les changements, générer un plan d'exécution | Non | Obligatoire avant chaque modification |
| `terraform apply` | Exécuter les changements, créer/modifier les ressources | Oui | Exécuter après validation du plan |
| `terraform destroy` | Détruire toutes les ressources | Oui | Nettoyage d'environnements de test, mise hors service |
| `terraform state` | Consulter/gérer le fichier d'état | Selon l'opération | Migration d'état, import de ressources |

---

## 3. Comparaison des outils : choisir l'outil IaC adapté

Le domaine de l'IaC propose plusieurs outils, chacun avec ses spécificités. Le choix doit tenir compte de la stack technique de l'équipe, de la plateforme cloud et de l'échelle du projet. Il n'y a pas d'outil « meilleur » en absolu, seulement l'outil le plus adapté à votre contexte.

<IaCToolComparisonDemo />

| Outil | Langage | Support cloud | Courbe d'apprentissage | Cas d'utilisation |
|------|------|-----------|---------|---------|
| Terraform | HCL | Multi-cloud (AWS/Azure/GCP) | Moyen | Environnements multi-cloud, collaboration d'équipe |
| Pulumi | Python/TS/Go | Multi-cloud | Faible (si maîtrise du langage) | Convivial pour les développeurs, logique complexe |
| AWS CloudFormation | JSON/YAML | AWS uniquement | Moyen | Environnement 100 % AWS |
| AWS CDK | Python/TS/Java | AWS uniquement | Faible | AWS avec préférence pour les langages de programmation |
| Ansible | YAML | Multi-cloud + serveurs physiques | Faible | Gestion de configuration, environnements hybrides |

::: tip Comment choisir ?
- **Startup / Cloud unique** : CloudFormation (AWS) ou l'outil natif du cloud, pour une meilleure intégration écosystémique
- **Multi-cloud / Équipe moyenne à grande** : Terraform, la communauté la plus importante, les providers les plus nombreux et le plus grand bassin de recrutement
- **Équipe pilotée par les développeurs** : Pulumi ou CDK, écrire l'infrastructure dans un langage familier, avec un bon support IDE
- **Besoin de gestion de configuration** : Ansible, spécialisé dans la configuration interne des serveurs (installation de logiciels, modification de fichiers de configuration)
:::

---

## 4. Dérive de configuration : une bombe à retardement silencieuse

La dérive de configuration (Configuration Drift) est l'ennemi le plus insidieux des pratiques IaC. Elle désigne **l'écart progressif entre l'état réel de l'infrastructure et l'état défini dans le code**.

Comment cet écart se produit-il couramment ? Quelqu'un, pour corriger « rapidement » un problème en production, modifie directement les règles d'un groupe de sécurité depuis la console ; quelqu'un, pour déboguer, augmente temporairement la configuration d'un serveur mais oublie de la restaurer. Ces « petites modifications » s'accumulent et finissent par créer un décalage majeur entre le code et l'environnement réel.

<ConfigDriftDemo />

::: tip Les dangers de la dérive de configuration
1. **Non reproductible** : l'environnement décrit par le code ne correspond pas à l'environnement réel, la création d'un nouvel environnement pose problème
2. **Échec du rollback** : on croit qu'un retour à la version précédente suffit, mais l'environnement réel a été modifié manuellement
3. **Risques de sécurité** : les ports ouverts manuellement et les permissions élargies peuvent être oubliés et devenir des points d'entrée pour les attaques
4. **Audit caduc** : l'audit de conformité se base sur le code, mais le code ne reflète pas l'état réel
:::

| Mesure préventive | Description |
|---------|------|
| Interdire les modifications manuelles | Restreindre les permissions de la console via les politiques IAM |
| Détection périodique de dérive | Exécuter régulièrement `terraform plan` pour vérifier les écarts |
| Correction automatique | Exécuter automatiquement apply pour restaurer la cohérence lors de la détection d'une dérive |
| Audit des modifications | Activer les journaux d'audit comme CloudTrail pour tracer l'origine de toutes les modifications |

---

## 5. Bonnes pratiques : faire évoluer durablement les projets IaC

Le code IaC, tout comme le code applicatif, nécessite de bonnes pratiques d'ingénierie pour garantir sa maintenabilité. À mesure que l'infrastructure s'étend, un code IaC désorganisé se transforme en une autre forme de « dette technique ».

<IaCBestPracticeDemo />

::: tip Les six bonnes pratiques fondamentales
1. **Modularisation** : abstraire l'infrastructure réutilisable en modules (module VPC, module de base de données, etc.), éviter les copier-coller. Comme l'écriture de fonctions : défini une fois, appelé plusieurs fois.
2. **Isolation des environnements** : les environnements de développement, test et production utilisent des fichiers d'état et de variables distincts, isolés via les workspaces ou la structure de répertoires.
3. **Gestion d'état distant** : les fichiers d'état (tfstate) sont stockés sur un backend distant (S3 + DynamoDB), prenant en charge la collaboration d'équipe et le verrouillage d'état pour éviter les conflits concurrents.
4. **Gestion des informations sensibles** : les mots de passe, clés et autres données sensibles ne doivent pas être écrits dans le code. Utiliser des outils comme Vault ou AWS Secrets Manager.
5. **Intégration CI/CD** : intégrer `terraform plan` dans le flux des PR, exécuter apply automatiquement via le pipeline, éliminer les opérations manuelles locales.
6. **Revue de code** : les modifications d'infrastructure nécessitent une revue de code au même titre que le code applicatif, en particulier lorsqu'elles impliquent des groupes de sécurité ou des politiques IAM.
:::

---

## Résumé

L'Infrastructure as Code est la pierre angulaire de l'exploitation cloud-native moderne. Elle transforme les « opérations manuelles indescriptibles » en « code contrôlable par version », faisant passer la gestion de l'infrastructure de « l'art » à « l'ingénierie ».

Passons en revue les points clés de ce chapitre :

1. **L'essence de l'IaC** : déclarer l'état souhaité de l'infrastructure par du code, laisser les outils le réaliser automatiquement
2. **Le flux de travail Terraform** : trois étapes — Write → Plan → Apply, Plan est le filet de sécurité
3. **Choix des outils** : multi-cloud → Terraform, cloud unique → outils natifs, équipe de développeurs → Pulumi
4. **Dérive de configuration** : le risque le plus insidieux, à prévenir conjointement par les processus et les outils
5. **Gestion ingénierique** : modularisation, isolation des environnements, état distant, intégration CI/CD — aucun de ces éléments n'est optionnel

## Pour aller plus loin

- [Tutoriel officiel Terraform](https://developer.hashicorp.com/terraform/tutorials) - Apprendre Terraform à partir de zéro
- [Documentation Pulumi](https://www.pulumi.com/docs/) - Écrire l'infrastructure dans un langage de programmation
- [AWS CDK Workshop](https://cdkworkshop.com/) - Tutoriel pratique AWS CDK
- [Infrastructure as Code (O'Reilly)](https://www.oreilly.com/library/view/infrastructure-as-code/9781098114664/) - L'ouvrage de référence dans le domaine de l'IaC
- [Blog Spacelift](https://spacelift.io/blog) - Bonnes pratiques IaC et tendances du secteur
