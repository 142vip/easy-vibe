# Principles of Kubernetes Orchestration

::: tip Foreword
**Docker solved the "packaging" problem, and Kubernetes solves the "management" problem.** When you have dozens or hundreds of containers that need deployment, scaling, and fault recovery, manual management is impractical. Kubernetes (K8s) is the "operating system" for containers, automating the deployment, scaling, and operations of containerized applications.
:::

**What will you learn from this article?**

After completing this chapter, you will gain:

- **Architecture understanding**: Master the composition of the K8s control plane and worker nodes
- **Core resources**: Become familiar with core concepts like Pod, Deployment, and Service
- **Declarative management**: Understand the philosophy of "declare desired state, system automatically converges"
- **Operations capabilities**: Learn about rolling updates, auto-scaling, health checks, and other mechanisms
- **Hands-on introduction**: Deploy a complete application using kubectl and YAML

| Chapter | Content | Core Concepts |
|---------|---------|---------------|
| **Chapter 1** | Why K8s is Needed | Challenges of container orchestration |
| **Chapter 2** | K8s Architecture | Control plane, worker nodes, etcd |
| **Chapter 3** | Core Resources | Pod, Deployment, Service, Ingress |
| **Chapter 4** | Declarative Management | YAML, kubectl, control loops |
| **Chapter 5** | Operations Practices | Rolling updates, HPA, health checks |

---

## 1. Motivation for Kubernetesing

Docker makes packaging and running individual containers simple, but when you face the following scenarios, manual management becomes inadequate:

| Challenge | Description | K8s Solution |
|-----------|-------------|-------------|
| Multi-instance deployment | A service needs 10 replicas running | Deployment automatically manages replica counts |
| Fault recovery | A container crashes and needs automatic restart | Controllers automatically detect and recreate Pods |
| Service discovery | Container IPs change; how to find each other? | Service provides stable DNS and IP |
| Rolling updates | Can't stop service when updating versions | Gradually replace old Pods with zero downtime |
| Elastic scaling | Auto-scale during traffic peaks | HPA automatically adjusts replica count based on CPU/memory |
| Resource scheduling | Place containers on the most suitable machines | Scheduler intelligently schedules |

::: tip K8s Core Philosophy: Declarative
You don't tell K8s "start 3 containers" (imperative). Instead, you tell it "I want 3 replicas running" (declarative). K8s continuously monitors to ensure the actual state matches your declared desired state. If a Pod crashes, it automatically creates a new one to replace it.
:::

---

## 2. Kubernetes Architecture

A K8s cluster consists of a Control Plane and Worker Nodes.

<K8sArchitectureDemo />

### Complete Path of a Request

```
User Request → Ingress Controller → Service → kube-proxy → Pod (Container)
                                              ↑
                                    Endpoint list (maintained by Service)
```

---

## 3. Core Resource Objects

K8s describes the cluster's desired state through various "resource objects."

<K8sWorkloadsDemo />

### Resource Object Categories

| Category | Resources | Purpose |
|----------|-----------|---------|
| Workloads | Pod, Deployment, StatefulSet, DaemonSet, Job | Run applications |
| Networking | Service, Ingress, NetworkPolicy | Service discovery and traffic management |
| Configuration | ConfigMap, Secret | Configuration and sensitive data management |
| Storage | PersistentVolume, PersistentVolumeClaim | Persistent storage |
| Scheduling | Node, Namespace, ResourceQuota | Resource isolation and limits |

---

## 4. Declarative Management and kubectl

### Reconciliation Loop

K8s's core working mechanism is the reconciliation loop:

```
Observe → Diff → Act → Observe...
     ↓          ↓        ↓
  Read actual   Compare   Execute
  state         with      corrective
                desired   actions
                state
```

You declare `replicas: 3`. The controller discovers only 2 Pods running and creates 1 new one. This loop executes every few seconds, ensuring the system always converges toward the desired state.

### Common kubectl Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `kubectl apply -f` | Apply YAML configuration | `kubectl apply -f deployment.yaml` |
| `kubectl get` | List resources | `kubectl get pods -o wide` |
| `kubectl describe` | View resource details | `kubectl describe pod my-app-xxx` |
| `kubectl logs` | View Pod logs | `kubectl logs -f my-app-xxx` |
| `kubectl exec` | Enter Pod terminal | `kubectl exec -it my-app-xxx -- sh` |
| `kubectl delete` | Delete resources | `kubectl delete -f deployment.yaml` |
| `kubectl scale` | Manual scaling | `kubectl scale deploy my-app --replicas=5` |

::: tip apply vs create
`kubectl create` is imperative — "create this resource," and will error if it already exists. `kubectl apply` is declarative — "ensure the resource is in this state," creating if it doesn't exist or updating if it does. In production, you should always use `apply`.
:::

---

## 5. Operations Practices

### 5.1 Rolling Updates and Rollbacks

Deployment uses a rolling update strategy by default: gradually creating new version Pods while gradually terminating old version Pods.

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # At most create 1 extra Pod
      maxUnavailable: 0   # No Pods allowed to be unavailable
```

| Operation | Command |
|-----------|---------|
| Update image | `kubectl set image deploy/my-app app=my-app:2.0` |
| View update status | `kubectl rollout status deploy/my-app` |
| View revision history | `kubectl rollout history deploy/my-app` |
| Rollback to previous version | `kubectl rollout undo deploy/my-app` |

### 5.2 Auto Scaling (HPA)

HPA (Horizontal Pod Autoscaler) automatically adjusts the number of Pod replicas based on CPU, memory, or custom metrics.

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

### 5.3 Health Checks (Probes)

K8s monitors Pod health through three types of probes:

| Probe | Purpose | Failure Consequence |
|-------|---------|-------------------|
| livenessProbe | Detect if container is alive | Restart container |
| readinessProbe | Detect if container is ready | Remove from Service, don't receive traffic |
| startupProbe | Detect if container has finished starting | Don't run other probes during startup |

::: tip Importance of Probes
Without health check probes configured, K8s can only determine health by whether the process exists. But often the process is still running while the service is no longer responding (like deadlocks, edge of OOM). Configuring livenessProbe allows K8s to automatically restart these "zombie" containers.
:::

---

## Summary

Kubernetes is the de facto standard for container orchestration, and understanding its core concepts is the foundation of cloud-native development.

Key takeaways from this chapter:

1. **Declarative management**: Tell K8s "what I want," not "how to do it" — the control loop automatically converges
2. **Layered architecture**: Control plane makes decisions, worker nodes execute, etcd stores state
3. **Core resources**: Pod (smallest unit), Deployment (replica management), Service (service discovery), Ingress (external entry point)
4. **Operations automation**: Rolling updates with zero downtime, HPA elastic scaling, automatic fault recovery with probes
5. **Configuration separation**: ConfigMap and Secret decouple configuration from images

## Further Reading

- [Kubernetes Official Documentation](https://kubernetes.io/docs/) - The most authoritative reference
- [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) - Build a K8s cluster from scratch manually
- [The Illustrated Children's Guide to Kubernetes](https://www.cncf.io/phippy/) - CNCF's fun beginner's guide
- [Kubernetes Patterns](https://www.oreilly.com/library/view/kubernetes-patterns-2nd/9781098131678/) - K8s design patterns
