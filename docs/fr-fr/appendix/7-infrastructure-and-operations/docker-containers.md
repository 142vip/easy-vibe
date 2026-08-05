# Introduction : Conteneurisation avec Docker

::: tip Avant-propos
**« Ça marche sur ma machine » est l'excuse la plus classique des développeurs. Docker fait disparaître cette excuse pour de bon.** La technologie de conteneurisation empaquette une application et toutes ses dépendances dans une unité standardisée, garantissant un fonctionnement cohérent dans tout environnement. C'est la pierre angulaire de la livraison logicielle moderne.
:::

**Que allez-vous apprendre dans cet article ?**

À l'issue de ce chapitre, vous maîtriserez :

- **Concepts fondamentaux** : comprendre les trois concepts clés : image, conteneur et registre
- **Comparaison d'architectures** : comprendre la différence essentielle entre conteneurs et machines virtuelles
- **Compétences pratiques** : maîtriser l'écriture de Dockerfiles et les commandes courantes
- **Bases de l'orchestration** : apprendre à gérer des applications multi-services avec Docker Compose
- **Bonnes pratiques** : connaître l'optimisation d'images, le durcissement de sécurité et autres pratiques de production

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Pourquoi les conteneurs | Cohérence d'environnement, efficacité des ressources, livraison standardisée |
| **Chapitre 2** | Concepts fondamentaux | Image, conteneur, registre, Dockerfile |
| **Chapitre 3** | Cycle de vie Docker | Écrire, construire, pousser, exécuter, gérer |
| **Chapitre 4** | Docker Compose | Orchestration multi-services, réseau, volumes de données |
| **Chapitre 5** | Bonnes pratiques | Optimisation d'images, sécurité, construction multi-étapes |

---

## 1. Motivation et justification : les conteneurs

Avant l'apparition des conteneurs, déployer une application nécessitait d'installer manuellement l'environnement d'exécution sur le serveur, de configurer les variables d'environnement et de gérer les conflits de dépendances. Les différences entre environnements (développement, test, production) étaient un terreau fertile pour les bugs.

<DockerArchitectureDemo />

### Présentation : problèmes les conteneurs résolvent-ils

| Problème | Approche traditionnelle | Approche conteneurisée |
|------|---------|---------|
| Incohérence d'environnement | « Ça marche chez moi » | Empaquetage de toutes les dépendances, cohérence partout |
| Conflits de dépendances | L'App A nécessite Node 14, l'App B Node 18 | Chaque conteneur dispose d'un environnement isolé |
| Gaspillage de ressources | Chaque VM nécessite un OS complet | Partage du noyau, surcoût de l'ordre du Mo |
| Déploiement lent | Installation et configuration manuelles | Une seule commande `docker run` |
| Mise à l'échelle difficile | Créer une VM, installer l'environnement, déployer | Démarrage de nouveaux conteneurs en quelques secondes |

::: tip La nature d'un conteneur
Un conteneur n'est pas une machine virtuelle légère. Sa nature est celle d'un **processus isolé**. Le noyau Linux réalise la conteneurisation via deux mécanismes :
- **Namespaces** : isolent la visibilité des processus (PID, réseau, système de fichiers, etc.)
- **Cgroups** : limitent l'utilisation des ressources des processus (CPU, mémoire, E/S)

Les processus dans un conteneur ne sont fondamentalement pas différents des processus ordinaires sur la machine hôte — ils sont simplement « enfermés dans une pièce sans vue sur l'extérieur ».
:::

---

## 2. Concepts fondamentaux

L'univers de Docker s'articule autour de trois concepts clés : l'image (Image), le conteneur (Container) et le registre (Registry).

| Concept | Analogie | Description |
|------|------|------|
| Image (Image) | Classe / Modèle | Modèle d'application en lecture seule, contenant le code, l'environnement d'exécution, les bibliothèques et la configuration |
| Conteneur (Container) | Instance / Objet | Instance d'exécution d'une image, en lecture-écriture, dotée d'un cycle de vie indépendant |
| Registre (Registry) | App Store | Service de stockage et de distribution d'images (Docker Hub, ACR, ECR) |
| Dockerfile | Recette / Plan | Fichier texte définissant comment construire une image |
| Volume de données (Volume) | Disque dur externe | Persistance des données, qui survivent à la suppression du conteneur |

### Structure en couches d'une image

Les images Docker sont composées de plusieurs couches en lecture seule (Layer), chaque instruction du Dockerfile créant une couche :

```
┌─────────────────────────┐
│  CMD ["node", "app.js"] │  ← Couche de commande de démarrage
├─────────────────────────┤
│  COPY . /app            │  ← Couche de code applicatif (change souvent)
├─────────────────────────┤
│  RUN npm install        │  ← Couche d'installation des dépendances (change occasionnellement)
├─────────────────────────┤
│  FROM node:18-alpine    │  ← Couche d'image de base (change rarement)
└─────────────────────────┘
```

::: tip Pourquoi la structure en couches est-elle importante ?
Docker met en cache chaque couche. Si une couche n'a pas changé, la construction réutilise directement le cache. C'est pourquoi il convient de placer les **instructions à faible fréquence de changement en premier** (comme l'installation des dépendances) et celles à **haute fréquence de changement en dernier** (comme la copie du code). Ainsi, la plupart des constructions bénéficient du cache et sont beaucoup plus rapides.
:::

---

## 3. Cycle de vie Docker

De l'écriture du Dockerfile à l'exécution du conteneur, le flux de travail de Docker est un pipeline clair et bien défini.

<DockerLifecycleDemo />

### Aide-mémoire des instructions Dockerfile courantes

| Instruction | Rôle | Exemple |
|------|------|------|
| `FROM` | Spécifier l'image de base | `FROM node:18-alpine` |
| `WORKDIR` | Définir le répertoire de travail | `WORKDIR /app` |
| `COPY` | Copier des fichiers dans l'image | `COPY package.json ./` |
| `RUN` | Exécuter des commandes lors de la construction | `RUN npm install` |
| `ENV` | Définir des variables d'environnement | `ENV NODE_ENV=production` |
| `EXPOSE` | Déclarer un port (uniquement documentaire) | `EXPOSE 3000` |
| `CMD` | Commande de démarrage du conteneur | `CMD ["node", "app.js"]` |
| `ENTRYPOINT` | Point d'entrée du conteneur (difficile à surcharger) | `ENTRYPOINT ["nginx"]` |

---

## 4. Docker Compose : orchestration multi-services

Un projet réel comporte généralement plusieurs conteneurs. Une application web peut nécessiter : un serveur d'application + une base de données + Redis + Nginx. Docker Compose permet de définir et gérer plusieurs conteneurs dans un seul fichier YAML.

### Exemple de docker-compose.yml

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db
      - REDIS_HOST=redis
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=secret

  redis:
    image: redis:7-alpine

volumes:
  db-data:
```

### Concepts clés de Compose

| Concept | Description | Exemple |
|------|------|------|
| services | Définit chaque service de conteneur | app, db, redis |
| volumes | Volumes de données persistants | db-data conserve les fichiers de la base de données |
| networks | Réseau personnalisé (créé automatiquement par défaut) | Les services communiquent entre eux via le nom du service |
| depends_on | Dépendances d'ordre de démarrage | app dépend de db et redis |
| environment | Variables d'environnement | Mot de passe de la base de données, adresse de connexion |

::: tip Découverte de services
Dans Docker Compose, le nom du service est le nom d'hôte. Le conteneur app peut accéder directement à la base de données via `db:5432` et à Redis via `redis:6379`, sans avoir besoin de connaître les adresses IP. C'est grâce au DNS intégré de Docker.
:::

---

## 5. Bonnes pratiques

### 5.1 Construction multi-étapes (Multi-stage Build)

La construction multi-étapes est un outil puissant pour optimiser la taille des images. L'étape de construction installe tous les outils et dépendances, l'étape finale ne conserve que les fichiers nécessaires à l'exécution.

```dockerfile
# Étape de construction
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape d'exécution
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### 5.2 Liste de contrôle pour l'optimisation des images

| Élément d'optimisation | Approche | Effet |
|--------|------|------|
| Choisir une image de base légère | Utiliser `alpine` plutôt que `ubuntu` | Image réduite de ~200 Mo à ~50 Mo |
| Fusionner les instructions RUN | Connecter plusieurs commandes avec `&&` | Réduire le nombre de couches |
| Utiliser .dockerignore | Exclure node_modules, .git, etc. | Accélérer la construction, réduire le contexte |
| Construction multi-étapes | Séparer les environnements de construction et d'exécution | L'image finale ne contient pas les outils de construction |
| Fixer les numéros de version | `node:18.17-alpine` plutôt que `node:latest` | Constructions reproductibles |

### 5.3 Pratiques de sécurité

| Pratique | Description |
|------|------|
| Ne pas exécuter en root | `USER node` pour spécifier un utilisateur non-root |
| Scanner les vulnérabilités | `docker scout` ou Trivy pour scanner les images |
| Privilèges minimaux | N'installer que les paquets nécessaires, pas d'outils de débogage |
| Ne pas coder les secrets en dur | Utiliser des variables d'environnement ou Docker Secrets |
| Mettre à jour régulièrement les images de base | Corriger les vulnérabilités de sécurité rapidement |

---

## Résumé

La conteneurisation Docker est l'infrastructure de la livraison logicielle moderne. La comprendre est essentielle pour tout développeur.

Passons en revue les points clés de ce chapitre :

1. **Conteneurs vs machines virtuelles** : les conteneurs partagent le noyau hôte, ils sont plus légers et plus rapides, mais l'isolation est légèrement inférieure à celle des VM
2. **Les trois éléments fondamentaux** : image (modèle), conteneur (instance), registre (distribution)
3. **Dockerfile** : construction en couches, tirer parti du cache, instructions peu changeantes en premier
4. **Docker Compose** : définir des applications multi-services en YAML, le nom du service est le nom d'hôte
5. **Pratiques de production** : construction multi-étapes pour réduire la taille de l'image, image de base alpine, exécution en non-root

## Pour aller plus loin

- [Documentation officielle Docker](https://docs.docker.com/) - La référence la plus complète
- [Docker Getting Started](https://docs.docker.com/get-started/) - Tutoriel officiel de prise en main
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/) - Guide officiel des bonnes pratiques
- [Documentation Docker Compose](https://docs.docker.com/compose/) - Référence complète de Compose
