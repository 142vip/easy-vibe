# Introduction : Évolution monolithe vers microservices

::: tip Avant-propos
**Aucune architecture n'est « la meilleure », il n'y a que « la plus adaptée à l'étape actuelle ».** Passer du monolithe aux microservices n'est pas un bond effectué en une seule étape, mais un processus d'évolution progressive à mesure que la taille de l'entreprise et de l'équipe augmente. Décomposer en microservices trop tôt est tout aussi dangereux que trop tard.
:::

**Que allez-vous apprendre dans cet article ?**

À l'issue de ce chapitre, vous aurez acquis :

- **Parcours d'évolution** : comprendre les quatre étapes, du monolithe aux microservices
- **Quand décomposer** : savoir quand il faut décomposer et quand il ne faut pas
- **Stratégies de décomposition** : maîtriser la méthodologie de décomposition par domaine métier
- **Patterns de communication** : connaître les choix entre communication synchrone et asynchrone entre services
- **Décomposition des données** : comprendre les défis et les solutions liés à la décomposition des bases de données

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Parcours d'évolution architecturale | Monolithe → monolithe modulaire → SOA → microservices |
| **Chapitre 2** | Quand et pourquoi décomposer | Loi de Conway, autonomie des équipes |
| **Chapitre 3** | Stratégies de décomposition | Contextes bornés du DDD, pattern de l'étouffoir |
| **Chapitre 4** | Communication inter-services | REST, gRPC, files de messages |
| **Chapitre 5** | Décomposition des données | Décomposition de base de données, synchronisation des données |

---

## 1. Parcours d'évolution architecturale

L'évolution architecturale n'est pas pilotée par la technologie, mais par la **taille de l'organisation**. Lorsqu'une équipe passe de 5 à 500 personnes, l'efficacité de collaboration en architecture monolithique chute drastiquement.

| Étape | Architecture | Taille de l'équipe | Caractéristiques |
|------|------|---------|------|
| Démarrage | Application monolithique | 1 à 10 personnes | Tout le code dans un seul projet, déploiement simple |
| Croissance | Monolithe modulaire | 10 à 50 personnes | Code organisé en modules, mais toujours déployé ensemble |
| Expansion | SOA (Architecture Orientée Services) | 50 à 200 personnes | Décomposition en services à gros grain par ligne métier |
| Maturité | Microservices | 200+ personnes | Services à grain fin, chaque équipe développe et déploie de manière indépendante |

<ArchEvolutionDemo />

::: tip Loi de Conway
« Les organisations qui conçoivent des systèmes produisent des architectures qui reflètent leurs structures de communication. » — Melvin Conway

En d'autres termes : 3 équipes construisant un système finiront par créer 3 services. L'essence de la décomposition architecturale est une **décomposition organisationnelle**.

**La loi inversée de Conway** : puisque la structure organisationnelle détermine l'architecture du système, pour obtenir une architecture donnée, il suffit d'ajuster d'abord la structure organisationnelle en conséquence. Par exemple, si vous souhaitez un service de paiement indépendant, commencez par constituer une équipe paiement indépendante. Beaucoup d'entreprises échouent dans leur décomposition en microservices non pas pour des raisons techniques, mais parce que l'organisation n'a pas évolué en parallèle.
:::

---

## 2. Quand passer aux microservices

Tous les systèmes n'ont pas besoin de microservices. Une décomposition prématurée apporte une complexité inutile.

| Signal | Description | Recommandation |
|------|------|------|
| Conflits de déploiement fréquents | Plusieurs équipes modifient le même code source, conflits réguliers | Envisager la décomposition |
| Un module nécessite une mise à l'échelle indépendante | Le module de recherche nécessite 10 fois plus de ressources que les autres | Envisager la décomposition |
| Besoin de diversifier les stacks technologiques | Le module IA utilise Python, le site principal utilise Java | Envisager la décomposition |
| Équipe < 10 personnes | Faible coût de communication, le monolithe suffit | Ne pas décomposer |
| Le métier est encore en phase d'exploration | Les besoins changent rapidement, les frontières ne sont pas claires | Ne pas décomposer |
| Pas de capacité DevOps | Pas de CI/CD, de conteneurisation, de système de surveillance | Ne pas décomposer |

---

## 3. Stratégies de décomposition

### 3.1 Décomposition par domaine métier (Contextes bornés du DDD)

Les contextes bornés (_Bounded Context_) du DDD (_Domain-Driven Design_) sont le meilleur guide pour décomposer les microservices. Chaque contexte borné correspond à un domaine métier indépendant, avec son propre modèle de données et ses propres règles métier.

**Qu'est-ce qu'un contexte borné ?** Un même mot peut avoir des significations différentes selon le domaine métier. Par exemple, « utilisateur » dans le domaine utilisateur désigne les informations d'inscription (nom, e-mail), dans le domaine des commandes désigne l'acheteur (adresse de livraison, mode de paiement), et dans le domaine de la recommandation désigne le profil comportemental (historique de navigation, tags de préférence). Le contexte borné délimite une frontière à l'intérieur de laquelle les termes et les modèles ont une signification univoque et cohérente.

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Domaine      │  │ Domaine      │  │ Domaine      │
│ utilisateur │  │ commande     │  │ paiement     │
│             │  │             │  │             │
│ User        │  │ Order       │  │ Payment     │
│ Profile     │  │ OrderItem   │  │ Refund      │
│ Address     │  │ Cart        │  │ Transaction │
│             │  │             │  │             │
│ Service     │  │ Service     │  │ Service     │
│ utilisateur │  │ commande    │  │ paiement    │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       └────── Appels API / Communication événementielle ───────┘
```

| Contexte borné | Entités principales | Service correspondant |
|-----------|---------|---------|
| Domaine utilisateur | User, Profile, Address | Service utilisateur |
| Domaine produit | Product, Category, SKU | Service produit |
| Domaine commande | Order, OrderItem | Service commande |
| Domaine paiement | Payment, Refund | Service paiement |
| Domaine logistique | Shipment, Tracking | Service logistique |

### 3.2 Le pattern de l'étouffoir (Strangler Fig Pattern)

Ne réécrivez pas tout le monolithe d'un coup, mais procédez comme le figuier étouffoir : remplacez progressivement les anciens modules par de nouveaux services :

1. Créer un nouveau service en dehors du monolithe
2. Via une couche proxy, router une partie du trafic vers le nouveau service
3. Après avoir vérifié la stabilité du nouveau service, migrer progressivement davantage de trafic
4. Remplacer finalement complètement l'ancien module

---

## 4. Patterns de communication inter-services

| Méthode | Protocole | Caractéristiques | Cas d'usage |
|------|------|------|---------|
| REST | HTTP/JSON | Simple, universel, écosystème riche | API externes, opérations CRUD |
| gRPC | HTTP/2 + Protobuf | Haute performance, typage fort | Appels inter-services fréquents en interne |
| File de messages | AMQP/Kafka | Asynchrone, découplage, lissage des pics | Notifications événementielles, tâches asynchrones |
| GraphQL | HTTP/JSON | Requêtes à la demande par le client | Couche BFF, applications mobiles |

::: tip Choisir entre synchrone et asynchrone
- **Besoin d'un résultat immédiat** → synchrone (REST/gRPC)
- **Pas besoin d'un résultat immédiat** → asynchrone (file de messages)
- **Un événement déclenche plusieurs actions** → asynchrone (publication-abonnement)

Règle empirique : privilégier l'asynchrone dans la mesure du possible. Plus la chaîne d'appels synchrones est longue, plus le système est fragile.
:::

---

## 5. Décomposition des données : la partie la plus difficile

Dans la décomposition en microservices, ce n'est pas la décomposition du code qui est la plus douloureuse, mais celle de la base de données. Chaque service devrait posséder sa propre base de données, mais cela signifie que les requêtes inter-services deviennent difficiles.

| Défi | Description | Solution |
|------|------|---------|
| JOIN inter-services | Impossible de faire un JOIN direct entre les tables de deux services | Requête composite par API, redondance de données |
| Transactions distribuées | Les transactions inter-bases ne peuvent pas utiliser les transactions locales | Saga, table de messages locale |
| Cohérence des données | Les données de plusieurs services peuvent être temporairement incohérentes | Cohérence à terme, pilotage événementiel |
| Migration des données | D'une base partagée vers des bases indépendantes | Transition par double écriture, outils de synchronisation de données |

---

## Résumé

Passer du monolithe aux microservices est un processus progressif, pas une révolution effectuée en un jour.

Rappel des points clés de ce chapitre :

1. **Parcours d'évolution** : monolithe → monolithe modulaire → SOA → microservices, chaque étape a un moteur clair
2. **Quand décomposer** : la taille de l'équipe, les conflits de déploiement et les besoins de mise à l'échelle sont des signaux de décomposition
3. **Stratégies de décomposition** : utiliser les contextes bornés du DDD pour guider la décomposition, et le pattern de l'étouffoir pour une migration progressive
4. **Choix de communication** : privilégier l'asynchrone, garder la chaîne d'appels synchrones la plus courte possible
5. **Décomposition des données** : la partie la plus difficile mais la plus importante ; accepter la cohérence à terme est le changement d'état d'esprit clé

## Pour aller plus loin

- [Building Microservices](https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/) - L'ouvrage classique de Sam Newman sur les microservices
- [Monolith to Microservices](https://www.oreilly.com/library/view/monolith-to-microservices/9781492047834/) - Guide de migration progressive
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/) - L'ouvrage classique du DDD par Eric Evans
- [The Strangler Fig Pattern](https://martinfowler.com/bliki/StranglerFigApplication.html) - Le pattern de l'étouffoir par Martin Fowler
