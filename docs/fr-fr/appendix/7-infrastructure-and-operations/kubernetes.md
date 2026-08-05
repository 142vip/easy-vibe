# Principes : Orchestration de conteneurs avec Kubernetes

::: tip Avant-propos
**Docker résout le problème de « l'empaquetage », Kubernetes résout le problème de « la gestion ».** Lorsque vous avez des dizaines, voire des centaines de conteneurs à déployer, mettre à l'échelle et restaurer en cas de panne, la gestion manuelle est irréaliste. Kubernetes (K8s) est le « système d'exploitation » des conteneurs : il automatise le déploiement, la mise à l'échelle et l'exploitation des applications conteneurisées.
:::

**Que allez-vous apprendre dans cet article ?**

À l'issue de ce chapitre, vous maîtriserez :

- **Compréhension de l'architecture** : connaître la composition du plan de contrôle et des nœuds de travail K8s
- **Ressources fondamentales** : vous familiariser avec les concepts clés : Pod, Deployment, Service, etc.
- **Gestion déclarative** : comprendre la philosophie « déclarer l'état souhaité, le système converge automatiquement »
- **Capacités opérationnelles** : connaître les mises à jour progressives, la mise à l'échelle automatique et les sondes de santé
- **Premiers pas pratiques** : savoir déployer une application complète avec kubectl et YAML

| Chapitre | Contenu | Concepts clés |
|-----|------|---------|
| **Chapitre 1** | Pourquoi Kubernetes | Les défis de l'orchestration de conteneurs |
| **Chapitre 2** | Architecture K8s | Plan de contrôle, nœuds de travail, etcd |
| **Chapitre 3** | Ressources fondamentales | Pod, Deployment, Service, Ingress |
| **Chapitre 4** | Gestion déclarative | YAML, kubectl, boucle de contrôle |
| **Chapitre 5** | Pratiques opérationnelles | Mise à jour progressive, HPA, sondes de santé |

---

## 1. Motivation et justification : Kubernetes

Docker simplifie l'empaquetage et l'exécution d'un conteneur individuel, mais face aux scénarios suivants, la gestion manuelle atteint vite ses limites :

| Défi | Description | Solution K8s |
|------|------|---------------|
| Déploiement multi-instances | Un service nécessite 10 réplicas | Le Deployment gère automatiquement le nombre de réplicas |
| Restauration après panne | Un conteneur est tombé en panne, il faut le redémarrer automatiquement | Le contrôleur détecte et recrée le Pod automatiquement |
| Découverte de services | Les IP des conteneurs changent, comment se retrouver ? | Le Service fournit un DNS et une IP stables |
| Mise à jour progressive | La mise à jour de version ne doit pas interrompre le service | Remplacement progressif des anciens Pods, sans interruption |
| Mise à l'échelle élastique | Extension automatique lors des pics de trafic | Le HPA ajuste automatiquement le nombre de réplicas selon CPU/mémoire |
| Ordonnancement des ressources | Placer les conteneurs sur les machines les plus adaptées | Le Scheduler effectue un ordonnancement intelligent |

::: tip L'idée fondamentale de K8s : la démarche déclarative
Vous n'avez pas besoin de dire à K8s « démarre 3 conteneurs » (impératif), mais plutôt « je veux 3 réplicas en cours d'exécution » (déclaratif). K8s surveille en permanence et s'assure que l'état réel correspond à l'état souhaité que vous avez déclaré. Si un Pod tombe en panne, il en crée automatiquement un nouveau pour le remplacer.
:::

---

## 2. Architecture Kubernetes

Un cluster K8s est composé d'un plan de contrôle (Control Plane) et de nœuds de travail (Worker Node).

<K8sArchitectureDemo />

### Le parcours complet d'une requête

```
Requête utilisateur → Ingress Controller → Service → kube-proxy → Pod (conteneur)
                                              ↑
                                    Liste des Endpoints (maintenue par le Service)
```

---

## 3. Objets de ressources fondamentaux

K8s décrit l'état souhaité du cluster via divers « objets de ressource ».

<K8sWorkloadsDemo />

### Classification des objets de ressource

| Catégorie | Ressources | Usage |
|------|------|------|
| Charges de travail | Pod, Deployment, StatefulSet, DaemonSet, Job | Exécuter des applications |
| Réseau | Service, Ingress, NetworkPolicy | Découverte de services et gestion du trafic |
| Configuration | ConfigMap, Secret | Gestion de la configuration et des données sensibles |
| Stockage | PersistentVolume, PersistentVolumeClaim | Stockage persistant |
| Ordonnancement | Node, Namespace, ResourceQuota | Isolation et limitation des ressources |

---

## 4. Gestion déclarative et kubectl

### La boucle de réconciliation (Reconciliation Loop)

Le mécanisme fondamental de K8s est la boucle de contrôle :

```
Observer (Observe) → Comparer (Diff) → Agir (Act) → Observer...
     ↓                ↓              ↓
  Lire l'état réel    Comparer avec l'état souhaité    Exécuter les corrections
```

Vous déclarez `replicas: 3`, le contrôleur détecte que seuls 2 Pods sont en cours d'exécution et en crée un nouveau. Cette boucle s'exécute toutes les quelques secondes, garantissant que le système converge toujours vers l'état souhaité.

### Commandes kubectl courantes

| Commande | Rôle | Exemple |
|------|------|------|
| `kubectl apply -f` | Appliquer une configuration YAML | `kubectl apply -f deployment.yaml` |
| `kubectl get` | Lister les ressources | `kubectl get pods -o wide` |
| `kubectl describe` | Afficher les détails d'une ressource | `kubectl describe pod my-app-xxx` |
| `kubectl logs` | Consulter les logs d'un Pod | `kubectl logs -f my-app-xxx` |
| `kubectl exec` | Accéder au terminal d'un Pod | `kubectl exec -it my-app-xxx -- sh` |
| `kubectl delete` | Supprimer une ressource | `kubectl delete -f deployment.yaml` |
| `kubectl scale` | Mise à l'échelle manuelle | `kubectl scale deploy my-app --replicas=5` |

::: tip apply vs create
`kubectl create` est impératif — « crée cette ressource », et renvoie une erreur si elle existe déjà. `kubectl apply` est déclaratif — « assure-toi que la ressource est dans cet état », la crée si elle n'existe pas, la met à jour sinon. En production, utilisez toujours `apply`.
:::

---

## 5. Pratiques opérationnelles

### 5.1 Mise à jour progressive et rollback

Le Deployment utilise par défaut la stratégie de mise à jour progressive (Rolling Update) : créer progressivement les Pods de la nouvelle version tout en terminant progressivement les Pods de l'ancienne version.

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Créer au maximum 1 Pod supplémentaire
      maxUnavailable: 0   # Aucun Pod ne doit être indisponible
```

| Opération | Commande |
|------|------|
| Mettre à jour l'image | `kubectl set image deploy/my-app app=my-app:2.0` |
| Suivre l'état de la mise à jour | `kubectl rollout status deploy/my-app` |
| Consulter l'historique des versions | `kubectl rollout history deploy/my-app` |
| Revenir à la version précédente | `kubectl rollout undo deploy/my-app` |

### 5.2 Mise à l'échelle automatique (HPA)

Le HPA (Horizontal Pod Autoscaler) ajuste automatiquement le nombre de réplicas de Pods en fonction du CPU, de la mémoire ou de métriques personnalisées.

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

### 5.3 Sondes de santé (Probe)

K8s surveille la santé des Pods via trois types de sondes :

| Sonde | Rôle | Conséquence d'un échec |
|------|------|---------|
| livenessProbe | Vérifier si le conteneur est en vie | Redémarrer le conteneur |
| readinessProbe | Vérifier si le conteneur est prêt | Retirer du Service, ne plus recevoir de trafic |
| startupProbe | Vérifier si le conteneur a fini de démarrer | Les autres sondes ne s'exécutent pas pendant le démarrage |

::: tip L'importance des sondes
Sans sonde de santé configurée, K8s ne peut juger de l'état de santé du Pod que par la présence du processus. Mais bien souvent le processus est toujours actif alors que le service ne répond plus (par exemple, interblocage, mémoire presque épuisée). Configurer une livenessProbe permet à K8s de redémarrer automatiquement ces conteneurs en « état de mort apparente ».
:::

---

## Résumé

Kubernetes est le standard de facto de l'orchestration de conteneurs. Comprendre ses concepts fondamentaux est la base du développement cloud-native.

Passons en revue les points clés de ce chapitre :

1. **Gestion déclarative** : dire à K8s « ce que je veux » et non « comment le faire », la boucle de contrôle converge automatiquement
2. **Architecture en couches** : le plan de contrôle prend les décisions, les nœuds de travail exécutent, etcd stocke l'état
3. **Ressources fondamentales** : Pod (unité minimale), Deployment (gestion des réplicas), Service (découverte de services), Ingress (point d'entrée externe)
4. **Automatisation opérationnelle** : mise à jour progressive sans interruption, mise à l'échelle élastique avec le HPA, restauration automatique des pannes via les sondes
5. **Séparation de la configuration** : ConfigMap et Secret découplent la configuration de l'image

## Pour aller plus loin

- [Documentation officielle Kubernetes](https://kubernetes.io/fr/docs/) - La référence française la plus complète
- [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) - Construire un cluster K8s manuellement depuis zéro
- [The Illustrated Children's Guide to Kubernetes](https://www.cncf.io/phippy/) - Introduction ludique éditée par la CNCF
- [Kubernetes Patterns](https://www.oreilly.com/library/view/kubernetes-patterns-2nd/9781098131678/) - Patrons de conception K8s
