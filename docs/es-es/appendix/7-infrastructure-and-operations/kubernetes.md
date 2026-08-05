# Principios de orquestación con Kubernetes

::: tip Prólogo
**Docker resolvió el problema de "empaquetar", Kubernetes resuelve el problema de "gestionar".** Cuando tienes decenas o cientos de contenedores que desplegar, escalar y recuperar ante fallos, la gestión manual es inviable. Kubernetes (K8s) es el "sistema operativo" de los contenedores: automatiza el despliegue, escalado y operación de aplicaciones contenerizadas.
:::

**¿Qué aprenderás en este artículo?**

Al terminar este capítulo, habrás aprendido:

- **Comprensión de la arquitectura**: dominarás la composición del plano de control y los nodos de trabajo de K8s
- **Recursos principales**: te familiarizarás con conceptos clave como Pod, Deployment, Service
- **Gestión declarativa**: entenderás la filosofía de "declarar el estado deseado, el sistema converge automáticamente"
- **Capacidad operativa**: conocerás mecanismos como rolling update, autoescalado y health checks
- **Introducción práctica**: podrás desplegar una aplicación completa con kubectl y YAML

| Capítulo | Contenido | Conceptos clave |
|-----|------|---------|
| **Capítulo 1** | Por qué necesitas K8s | Los desafíos de la orquestación de contenedores |
| **Capítulo 2** | Arquitectura de K8s | Plano de control, nodos de trabajo, etcd |
| **Capítulo 3** | Recursos principales | Pod, Deployment, Service, Ingress |
| **Capítulo 4** | Gestión declarativa | YAML, kubectl, bucle de reconciliación |
| **Capítulo 5** | Prácticas operativas | Rolling update, HPA, health checks |

---

## 1. Motivación de Kubernetes

Docker facilita el empaquetado y ejecución de contenedores individuales, pero cuando te enfrentas a los siguientes escenarios, la gestión manual resulta insuficiente:

| Desafío | Descripción | Solución de K8s |
|------|------|---------------|
| Despliegue multi-instancia | Un servicio necesita ejecutar 10 réplicas | Deployment gestiona automáticamente el número de réplicas |
| Recuperación ante fallos | Un contenedor se cae y necesita reiniciarse | El controlador detecta y recrea el Pod automáticamente |
| Descubrimiento de servicios | Las IPs de los contenedores cambian, ¿cómo encontrarlos? | Service proporciona DNS e IP estables |
| Rolling update | Actualizar la versión sin interrumpir el servicio | Reemplazo gradual de Pods antiguos, cero downtime |
| Escalado elástico | Autoescalar en picos de tráfico | HPA ajusta automáticamente las réplicas según CPU/memoria |
| Planificación de recursos | Colocar contenedores en las máquinas más adecuadas | Scheduler con planificación inteligente |

::: tip La idea central de K8s: declarativo
No necesitas decirle a K8s "inicia 3 contenedores" (imperativo), sino "quiero 3 réplicas en ejecución" (declarativo). K8s monitoriza continuamente para asegurar que el estado real coincida con el estado deseado que declaraste. Si un Pod se cae, automáticamente crea uno nuevo para reemplazarlo.
:::

---

## 2. Arquitectura de Kubernetes

Un clúster de K8s está compuesto por el plano de control (Control Plane) y los nodos de trabajo (Worker Node).

<K8sArchitectureDemo />

### Ruta completa de una petición

```
Petición del usuario → Ingress Controller → Service → kube-proxy → Pod (contenedor)
                                              ↑
                                    Lista de Endpoints (mantenida por Service)
```

---

## 3. Objetos de recursos principales

K8s describe el estado deseado del clúster mediante diversos "objetos de recursos".

<K8sWorkloadsDemo />

### Clasificación de objetos de recursos

| Categoría | Recurso | Propósito |
|------|------|------|
| Carga de trabajo | Pod, Deployment, StatefulSet, DaemonSet, Job | Ejecutar aplicaciones |
| Red | Service, Ingress, NetworkPolicy | Descubrimiento de servicios y gestión de tráfico |
| Configuración | ConfigMap, Secret | Gestión de configuración y datos sensibles |
| Almacenamiento | PersistentVolume, PersistentVolumeClaim | Almacenamiento persistente |
| Planificación | Node, Namespace, ResourceQuota | Aislamiento y límites de recursos |

---

## 4. Gestión declarativa y kubectl

### Bucle de reconciliación (Reconciliation Loop)

El mecanismo de trabajo central de K8s es el bucle de reconciliación:

```
Observar (Observe) → Comparar (Diff) → Actuar (Act) → Observar...
     ↓                ↓              ↓
  Leer estado real  Comparar con    Ejecutar acción
                    estado deseado  correctiva
```

Declaras `replicas: 3`, el controlador detecta que solo hay 2 Pods en ejecución y crea 1 nuevo. Este bucle se ejecuta cada pocos segundos, asegurando que el sistema siempre converja hacia el estado deseado.

### Comandos comunes de kubectl

| Comando | Función | Ejemplo |
|------|------|------|
| `kubectl apply -f` | Aplicar configuración YAML | `kubectl apply -f deployment.yaml` |
| `kubectl get` | Ver lista de recursos | `kubectl get pods -o wide` |
| `kubectl describe` | Ver detalles de un recurso | `kubectl describe pod my-app-xxx` |
| `kubectl logs` | Ver logs de un Pod | `kubectl logs -f my-app-xxx` |
| `kubectl exec` | Entrar en la terminal de un Pod | `kubectl exec -it my-app-xxx -- sh` |
| `kubectl delete` | Eliminar recurso | `kubectl delete -f deployment.yaml` |
| `kubectl scale` | Escalar manualmente | `kubectl scale deploy my-app --replicas=5` |

::: tip apply vs create
`kubectl create` es imperativo: "crea este recurso", si ya existe da error. `kubectl apply` es declarativo: "asegura que el recurso tenga este estado", si no existe lo crea, si ya existe lo actualiza. En entornos de producción siempre debes usar `apply`.
:::

---

## 5. Prácticas operativas

### 5.1 Rolling update y rollback

Deployment usa por defecto la estrategia de rolling update: crea gradualmente Pods de la nueva versión mientras termina gradualmente los Pods de la versión antigua.

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Máximo 1 Pod adicional
      maxUnavailable: 0   # No se permite ningún Pod no disponible
```

| Operación | Comando |
|------|------|
| Actualizar imagen | `kubectl set image deploy/my-app app=my-app:2.0` |
| Ver estado de actualización | `kubectl rollout status deploy/my-app` |
| Ver historial de versiones | `kubectl rollout history deploy/my-app` |
| Revertir a versión anterior | `kubectl rollout undo deploy/my-app` |

### 5.2 Autoescalado (HPA)

HPA (Horizontal Pod Autoscaler) ajusta automáticamente el número de réplicas de Pod según CPU, memoria o métricas personalizadas.

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

### 5.3 Health checks (Probes)

K8s monitoriza el estado de salud de los Pods mediante tres tipos de sondas:

| Sonda | Función | Consecuencia del fallo |
|------|------|---------|
| livenessProbe | Detecta si el contenedor está vivo | Reinicia el contenedor |
| readinessProbe | Detecta si el contenedor está listo | Lo retira del Service, no recibe tráfico |
| startupProbe | Detecta si el contenedor ha terminado de iniciar | Durante el inicio no se ejecutan otras sondas |

::: tip Importancia de las sondas
Sin health checks configurados, K8s solo puede juzgar la salud de un Pod por si el proceso existe. Pero muchas veces el proceso sigue corriendo aunque el servicio ya no responda (por ejemplo, deadlock, al borde de OOM). Configurar livenessProbe permite a K8s reiniciar automáticamente estos contenedores "zombi".
:::

---

## Resumen

Kubernetes es el estándar de facto para la orquestación de contenedores. Comprender sus conceptos fundamentales es la base del desarrollo cloud native.

Puntos clave de este capítulo:

1. **Gestión declarativa**: dile a K8s "qué quiero", no "cómo hacerlo", el bucle de reconciliación converge automáticamente
2. **Arquitectura en capas**: el plano de control toma decisiones, los nodos de trabajo ejecutan, etcd almacena el estado
3. **Recursos principales**: Pod (unidad mínima), Deployment (gestión de réplicas), Service (descubrimiento de servicios), Ingress (entrada externa)
4. **Automatización operativa**: rolling update sin downtime, HPA para escalado elástico, sondas para recuperación automática ante fallos
5. **Separación de configuración**: ConfigMap y Secret desacoplan la configuración de la imagen

## Lecturas adicionales

- [Documentación oficial de Kubernetes](https://kubernetes.io/docs/) - La referencia más autorizada
- [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) - Montar un clúster K8s desde cero manualmente
- [The Illustrated Children's Guide to Kubernetes](https://www.cncf.io/phippy/) - Introducción divertida de la CNCF
- [Kubernetes Patterns](https://www.oreilly.com/library/view/kubernetes-patterns-2nd/9781098131678/) - Patrones de diseño de K8s