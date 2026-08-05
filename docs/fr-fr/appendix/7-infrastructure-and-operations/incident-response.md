# Introduction : Résolution d'incidents et réponse d'urgence

::: tip Avant-propos
**Trois heures du matin, votre téléphone vibre frénétiquement, le service en production est totalement en panne — que faites-vous ?** Pour toute équipe Internet, la question n'est pas de savoir « si » un incident se produira, mais « quand » il se produira. Les meilleures équipes ne sont pas celles qui n'ont jamais d'incidents, mais celles qui, lorsqu'un incident survient, savent répondre rapidement, restaurer efficacement et en tirer des leçons pour éviter de répéter les mêmes erreurs.
:::

**Que allez-vous apprendre dans cet article ?**

À l'issue de ce chapitre, vous maîtriserez :

- **Sens de la gradation** : connaître les critères de classification de gravité P0 à P4
- **Processus de réponse** : comprendre la chronologie complète d'un incident, de la détection à la restauration
- **Collaboration organisationnelle** : connaître les rôles et les mécanismes de collaboration dans le système de commandement d'incident
- **Système d'alertes** : maîtriser les stratégies d'escalade des alertes pour s'assurer qu'aucun problème critique n'est oublié
- **Méthode de rétrospective** : apprendre à utiliser la méthode des « cinq pourquoi » pour identifier les causes racines et rédiger un rapport de rétrospective utile

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Classification de gravité | P0 à P4, évaluation de l'impact |
| **Chapitre 2** | Chronologie de réponse | Détection → Réponse → Restauration → Rétrospective |
| **Chapitre 3** | Système de commandement | IC, officier communication, responsable technique |
| **Chapitre 4** | Escalade des alertes | Alertes graduées, escalade par niveaux |
| **Chapitre 5** | Rétrospective post-incident | Cinq pourquoi, culture sans blâme |

---

## 0. Vue d'ensemble : les incidents sont les meilleurs professeurs

Netflix possède un outil célèbre appelé Chaos Monkey — il arrête aléatoirement des serveurs en production. Cela peut sembler insensé, mais la logique sous-jacente est très claire : **mieux vaut provoquer délibérément des incidents pour renforcer la capacité de réponse de l'équipe que d'attendre que les incidents surviennent**.

La réponse d'urgence ne repose pas sur l'improvisation, mais sur un système reposant sur **trois piliers : processus, rôles et outils**. Tout comme les pompiers ne se constituent pas au moment où l'incendie éclate — ils s'entraînent, font des exercices et maintiennent leur matériel en permanence.

::: tip Les quatre éléments fondamentaux de la réponse d'urgence
- **Détection rapide** : un système de surveillance et d'alerte exhaustif pour détecter les problèmes avant que les utilisateurs ne les perçoivent
- **Collaboration efficace** : une répartition claire des rôles et des mécanismes de communication pour éviter les efforts redondants dans le chaos
- **Restauration rapide** : prioriser la restauration du service plutôt que la recherche de la cause racine. D'abord stopper l'hémorragie, ensuite soigner
- **Amélioration continue** : chaque incident est une opportunité d'apprentissage, perfectionner les systèmes et les processus grâce aux rétrospectives
:::

---

## 1. Classification de gravité : tous les incidents ne nécessitent pas une « mobilisation générale »

Un bouton dont la couleur s'affiche incorrectement et un système de paiement entièrement paralysé ne relèvent manifestement pas du même niveau de gravité. La **classification des incidents** vise à permettre à l'équipe de répondre avec l'intensité appropriée au niveau du problème — sans surréaction gaspillant des ressources, ni sous-estimation aggravant les pertes.

<SeverityLevelDemo />

| Niveau | Nom | Impact | Exigence de réponse | Exemple |
|------|------|---------|---------|------|
| P0 | Critique | L'activité principale est totalement indisponible | Réponse immédiate, toute l'équipe en alerte | Paralysie du système de paiement, fuite de données |
| P1 | Grave | Dégradation sévère des fonctionnalités principales | Réponse dans les 15 minutes | Taux d'échec de connexion > 50 %, timeouts généralisés de l'API |
| P2 | Important | Dysfonctionnement de certaines fonctionnalités | Réponse dans l'heure | Résultats de recherche inexacts, erreurs 500 sur certaines pages |
| P3 | Mineur | Anomalie de fonctionnalités non essentielles | Traitement pendant les heures ouvrées | Échec du chargement des avatars, retard de notifications non critiques |
| P4 | Négligeable | Problème d'expérience utilisateur | Intégré au planning d'itération | Décalage d'interface, erreur de texte |

::: tip Principes clés de la classification
- **Nombre d'utilisateurs affectés** : un P2 affectant 100 % des utilisateurs peut être plus urgent qu'un P1 n'affectant que 1 % des utilisateurs
- **Pertes commerciales** : les problèmes impactant directement les revenus (paiement, commandes) ont une priorité plus élevée
- **Dégradation possible** : s'il existe une solution de contournement temporaire pour atténuer l'impact, le niveau peut être revu à la baisse
- **Ajustement dynamique** : à mesure que l'investigation progresse, le niveau peut être rehaussé ou abaissé
:::

---

## 2. Chronologie de réponse : le processus complet de la détection à la rétrospective

La réponse à un incident est comme une course de relais : chaque étape a des objectifs clairs et des points de passage. Une chronologie bien définie permet à l'équipe de rester organisée même dans le chaos.

<IncidentTimelineDemo />

::: tip Les cinq phases de la réponse à un incident
1. **Détection** : découverte de l'anomalie via les alertes de surveillance, les retours utilisateurs ou les inspections internes. Objectif : détecter le plus tôt possible, réduire le MTTD (temps moyen de détection).
2. **Réponse** : confirmation de l'incident, évaluation de la gravité, convocation de l'équipe de réponse, établissement d'un canal de communication. Objectif : organiser rapidement une réponse efficace.
3. **Atténuation** : prise de mesures temporaires pour restaurer le service, telles qu'un rollback de déploiement, la bascule vers un nœud de secours ou la limitation de trafic. Objectif : stopper d'abord l'hémorragie, restaurer l'expérience utilisateur.
4. **Résolution** : identification de la cause racine et correction définitive. Objectif : éliminer le problème sous-jacent, prévenir la récidive.
5. **Rétrospective (Postmortem)** : revue de l'ensemble du processus, analyse des causes racines, élaboration de mesures d'amélioration. Objectif : apprendre de l'incident, renforcer le système.
:::

| Indicateur | Signification | Axe d'optimisation |
|------|------|---------|
| MTTD | Temps moyen de détection | Améliorer la couverture de surveillance, abaisser les seuils d'alerte |
| MTTR | Temps moyen de restauration | Automatiser la restauration, exercer les plans de contingence |
| MTBF | Temps moyen entre incidents | Améliorer la fiabilité du système, éliminer les points uniques de défaillance |

---

## 3. Système de commandement : qui dirige cette « incident »

Lors d'un incident majeur, le danger le plus redoutable n'est pas le défi technique, mais le **chaos** — une dizaine de personnes enquêtant simultanément sans savoir ce que font les autres, les informations clés se fragmentant dans différents groupes de discussion. Le système de commandement d'incident (Incident Command System) a précisément été conçu pour résoudre ce problème.

<IncidentCommandDemo />

::: tip Les trois rôles clés
1. **Commandant d'incident (Incident Commander, IC)** : le responsable global de la réponse à l'incident. Prend les décisions, coordonne les ressources et contrôle le rythme. L'IC n'est pas forcément la personne la plus compétente techniquement, mais il doit être la plus calme et avoir la meilleure vision d'ensemble.
2. **Officier communication (Communication Lead)** : responsable de la communication externe — mise à jour de la page de statut, notification aux clients, synchronisation avec la direction. Permet à l'IC et aux techniciens de se concentrer sur la résolution du problème sans être interrompus par les tâches de communication.
3. **Responsable technique (Tech Lead)** : responsable de l'investigation et de la réparation sur le plan technique. Organise la répartition des tâches entre les techniciens et fait rapport à l'IC sur les avancées et les solutions.
:::

---

## 4. Escalade des alertes : s'assurer qu'aucun problème critique n'est oublié

Le système d'alertes est le « regard » de la réponse aux incidents. Mais trop peu d'alertes entraîne des non-détections, tandis que trop d'alertes provoque une « fatigue d'alertes » — lorsque vous recevez des centaines d'alertes par jour, la seule vraiment importante risque d'être noyée dans la masse. La **stratégie d'escalade des alertes** est la clé pour résoudre ce problème.

<AlertEscalationDemo />

::: tip Le mécanisme d'escalade à trois niveaux
1. **Réponse de premier niveau (L1)** : lors du déclenchement d'une alerte, l'ingénieur de garde est d'abord notifié. Si l'alerte n'est pas acquittée dans les 15 minutes, escalade automatique.
2. **Escalade au deuxième niveau (L2)** : notification du responsable d'équipe et des experts du domaine concerné. Si le problème n'est pas atténué dans les 30 minutes, escalade supplémentaire.
3. **Escalade au troisième niveau (L3)** : notification du directeur technique et de la direction, lancement de la réponse d'urgence complète.
:::

| Niveau d'alerte | Moyen de notification | Délai de réponse | Condition d'escalade |
|---------|---------|---------|---------|
| Warning | Message IM | Traitement pendant les heures ouvrées | Persistance pendant 30 minutes sans résolution |
| Critical | Téléphone + IM | Acquittement dans les 15 minutes | Non acquitté ou non atténué |
| Fatal | Rafale d'appels + SMS | Réponse dans les 5 minutes | Escalade automatique vers la direction |

---

## 5. Rétrospective post-incident : apprendre des incidents

Après la restauration du service, l'étape la plus importante est la **rétrospective (Postmortem)**. La rétrospective n'a pas vocation à rechercher des responsables, mais à identifier les opportunités d'amélioration systémique. Google, Meta et d'autres entreprises appliquent une culture de « rétrospective sans blâme » — ils se concentrent sur « pourquoi le système a permis cette erreur » et non sur « qui a commis cette erreur ».

<PostmortemDemo />

::: tip La méthode des « cinq pourquoi »
En partant du symptôme apparent, posez successivement la question « pourquoi » jusqu'à atteindre la cause racine :
1. **Pourquoi le service est-il tombé ?** → Le pool de connexions à la base de données était épuisé
2. **Pourquoi le pool était-il épuisé ?** → Des requêtes lentes monopolisaient les connexions sans les libérer
3. **Pourquoi y avait-il des requêtes lentes ?** → Absence d'index, entraînant des scans complets de table
4. **Pourquoi les index manquaient-ils ?** → Pas de revue DBA lors de la mise en production de la nouvelle table
5. **Pourquoi aucune revue n'a été effectuée ?** → Absence de processus obligatoire de revue SQL

La cause racine n'est pas « quelqu'un a oublié d'ajouter un index », mais « il manque un processus de revue SQL ». Ce n'est qu'en corrigeant la cause racine que l'on peut prévenir la récidive.
:::

---

## Résumé

La résolution d'incidents et la réponse d'urgence sont des compétences indispensables pour toute équipe technique. Elles ne reposent pas sur l'héroïsme individuel, mais sur des processus systématiques, une répartition claire des rôles et une amélioration continue grâce aux rétrospectives.

Passons en revue les points clés de ce chapitre :

1. **Réponse graduée** : la classification P0 à P4 garantit une intensité de réponse adaptée au niveau du problème
2. **Chronologie claire** : détection → réponse → atténuation → résolution → rétrospective, chaque phase a des objectifs précis
3. **Système de commandement** : IC + officier communication + responsable technique, division du travail et collaboration pour éviter le chaos
4. **Escalade des alertes** : alertes graduées + escalade automatique, pour s'assurer qu'aucun problème critique n'est oublié
5. **Rétrospective sans blâme** : utiliser les « cinq pourquoi » pour creuser jusqu'à la cause racine, se concentrer sur l'amélioration du système plutôt que sur la recherche de responsables individuels

## Pour aller plus loin

- [Google SRE Book - Incident Response](https://sre.google/sre-book/managing-incidents/) - Pratiques de gestion des incidents chez Google
- [PagerDuty Incident Response Guide](https://response.pagerduty.com/) - Guide de réponse d'urgence open source de PagerDuty
- [Atlassian Incident Management](https://www.atlassian.com/incident-management) - Bonnes pratiques de gestion des incidents chez Atlassian
- [Learning from Incidents](https://www.learningfromincidents.io/) - Ressources communautaires pour apprendre des incidents
- [Chaos Engineering (O'Reilly)](https://www.oreilly.com/library/view/chaos-engineering/9781492043850/) - Principes et pratiques du Chaos Engineering
