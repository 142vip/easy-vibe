# Kubernetes: Orchestrierung

::: tip Vorwort
**Docker loest das "Verpackungsproblem", Kubernetes loest das "Verwaltungsproblem".** Wenn du dutzende oder hunderte Container bereitstellen, skalieren und bei Ausfaellen wiederherstellen musst, ist manuelle Verwaltung unpraktikabel. Kubernetes (K8s) ist das "Betriebssystem" fuer Container - es automatisiert Bereitstellung, Skalierung und Betrieb containerisierter Anwendungen.
:::

**Was wirst du in diesem Artikel lernen?**

Nach diesem Kapitel wirst du Folgendes koennen:

- **Architektur-Verstaendnis**: Die Komponenten der K8s-Control-Plane und Worker-Nodes beherrschen
- **Kern-Ressourcen**: Pod, Deployment, Service und andere Kernkonzepte kennenlernen
- **Deklaratives Management**: Die Philosophie "gewuenschten Zustand deklarieren, System konvergiert automatisch" verstehen
- **Betriebs-Kompetenz**: Rolling Updates, Auto-Scaling, Health Checks und weitere Mechanismen verstehen
- **Praktischer Einstieg**: Eine vollstaendige Anwendung mit kubectl und YAML bereitstellen koennen

| Kapitel | Inhalt | Kernkonzepte |
|-----|------|---------|
| **Kapitel 1** | Warum K8s? | Herausforderungen der Container-Orchestrierung |
| **Kapitel 2** | K8s-Architektur | Control Plane, Worker Nodes, etcd |
| **Kapitel 3** | Kern-Ressourcen | Pod, Deployment, Service, Ingress |
| **Kapitel 4** | Deklaratives Management | YAML, kubectl, Kontrollschleife |
| **Kapitel 5** | Betriebspraxis | Rolling Updates, HPA, Health Checks |

---

## 1. Warum Kubernetes

Docker macht das Verpacken und Ausfuehren einzelner Container einfach. Aber wenn du vor folgenden Szenarien stehst, reicht manuelle Verwaltung nicht mehr aus:

| Herausforderung | Beschreibung | K8s-Loesung |
|------|------|---------------|
| Multi-Instanz-Deployment | Ein Service muss mit 10 Replikas laufen | Deployment verwaltet automatisch die Replika-Anzahl |
| Ausfall-Wiederherstellung | Ein abgestuerzter Container muss automatisch neu starten | Der Controller erkennt Ausfaelle und erstellt den Pod neu |
| Service Discovery | Container-IPs aendern sich, wie finden sich die Services? | Service bietet stabilen DNS und IP |
| Rolling Updates | Bei Versionsupdates darf der Service nicht ausfallen | Alte Pods schrittweise ersetzen, Zero Downtime |
| Elastische Skalierung | Bei Traffic-Spitzen automatisch hochskalieren | HPA passt Replika-Anzahl basierend auf CPU/Speicher automatisch an |
| Ressourcen-Scheduling | Container auf dem optimalen Server platzieren | Intelligentes Scheduling durch den Scheduler |

::: tip Kerngedanke von K8s: Deklarativ
Man sagt K8s nicht "starte 3 Container" (imperativ), sondern "ich moechte 3 laufende Replikas" (deklarativ). K8s ueberwacht kontinuierlich und stellt sicher, dass der tatsaechliche Zustand mit dem deklarierten Soll-Zustand uebereinstimmt. Faellt ein Pod aus, wird automatisch ein neuer erstellt.
:::

---

## 2. Kubernetes-Architektur

Ein K8s-Cluster besteht aus der Control Plane (Steuerungsebene) und Worker Nodes (Arbeitsknoten).

<K8sArchitectureDemo />

### Der komplette Pfad einer Anfrage

```
Nutzer-Anfrage -> Ingress Controller -> Service -> kube-proxy -> Pod (Container)
                                              |
                                    Endpoint-Liste (vom Service verwaltet)
```

---

## 3. Kern-Ressourcen-Objekte

K8s beschreibt den gewuenschten Zustand des Clusters ueber verschiedene "Ressourcen-Objekte".

<K8sWorkloadsDemo />

### Ressourcen-Objekt-Kategorien

| Kategorie | Ressourcen | Zweck |
|------|------|------|
| Workloads | Pod, Deployment, StatefulSet, DaemonSet, Job | Anwendungen ausfuehren |
| Netzwerk | Service, Ingress, NetworkPolicy | Service Discovery und Traffic-Management |
| Konfiguration | ConfigMap, Secret | Konfiguration und vertrauliche Daten verwalten |
| Speicher | PersistentVolume, PersistentVolumeClaim | Persistente Datenspeicherung |
| Scheduling | Node, Namespace, ResourceQuota | Ressourcen-Isolierung und Beschraenkung |

---

## 4. Deklaratives Management und kubectl

### Die Kontrollschleife (Reconciliation Loop)

Der Kernmechanismus von K8s ist die Kontrollschleife:

```
Beobachten (Observe) -> Vergleichen (Diff) -> Handeln (Act) -> Beobachten...
      |                    |                  |
   Tatsaechlichen      Mit Soll-Zustand   Korrekturoperation
   Zustand lesen       vergleichen        ausfuehren
```

Du deklarierst `replicas: 3`, der Controller stellt fest, dass nur 2 Pods laufen, und erstellt einen neuen. Diese Schleife wird alle paar Sekunden ausgefuehrt und stellt sicher, dass das System immer zum Soll-Zustand konvergiert.

### haeufige kubectl-Befehle

| Befehl | Funktion | Beispiel |
|------|------|------|
| `kubectl apply -f` | YAML-Konfiguration anwenden | `kubectl apply -f deployment.yaml` |
| `kubectl get` | Ressourcenliste anzeigen | `kubectl get pods -o wide` |
| `kubectl describe` | Ressourcendetails anzeigen | `kubectl describe pod my-app-xxx` |
| `kubectl logs` | Pod-Logs anzeigen | `kubectl logs -f my-app-xxx` |
| `kubectl exec` | Pod-Terminal oeffnen | `kubectl exec -it my-app-xxx -- sh` |
| `kubectl delete` | Ressource loeschen | `kubectl delete -f deployment.yaml` |
| `kubectl scale` | Manuell skalieren | `kubectl scale deploy my-app --replicas=5` |

::: tip apply vs create
`kubectl create` ist imperativ - "erstelle diese Ressource", fehlerhaft wenn bereits vorhanden. `kubectl apply` ist deklarativ - "stelle sicher, dass die Ressource diesen Zustand hat", erstellt wenn nicht vorhanden, aktualisiert wenn bereits existent. In Produktionsumgebungen sollte immer `apply` verwendet werden.
:::

---

## 5. Betriebspraxis

### 5.1 Rolling Updates und Rollbacks

Deployment verwendet standardmaessig die Rolling-Update-Strategie: Neue Version-Pods werden schrittweise erstellt, waehrend alte Version-Pods schrittweise beendet werden.

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Maximal 1 zusaetzlichen Pod erstellen
      maxUnavailable: 0   # Keine Pods duerfen nicht verfuegbar sein
```

| Operation | Befehl |
|------|------|
| Image aktualisieren | `kubectl set image deploy/my-app app=my-app:2.0` |
| Update-Status anzeigen | `kubectl rollout status deploy/my-app` |
| Versionshistorie anzeigen | `kubectl rollout history deploy/my-app` |
| Zur vorherigen Version zurueckkehren | `kubectl rollout undo deploy/my-app` |

### 5.2 Auto-Scaling (HPA)

HPA (Horizontal Pod Autoscaler) passt die Pod-Replika-Anzahl automatisch basierend auf CPU, Speicher oder benutzerdefinierten Metriken an.

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

K8s ueberwacht die Gesundheit von Pods ueber drei Probe-Typen:

| Probe | Funktion | Konsequenz bei Fehlschlag |
|------|------|---------|
| livenessProbe | Prueft, ob der Container noch lebt | Container wird neu gestartet |
| readinessProbe | Prueft, ob der Container bereit ist | Vom Service entfernt, erhaelt keinen Traffic |
| startupProbe | Prueft, ob der Container erfolgreich gestartet ist | Waehrend der Startphase werden andere Probes nicht ausgefuehrt |

::: tip Warum Probes wichtig sind
Ohne konfigurierte Health Checks kann K8s nur pruefen, ob der Prozess noch laeuft. Oft ist der Prozess aber noch aktiv, waehrend der Service nicht mehr reagiert (z. B. Deadlock, OOM-Schwelle). Mit livenessProbe kann K8s diese "scheintoten" Container automatisch neu starten.
:::

---

## Zusammenfassung

Kubernetes ist der De-facto-Standard fuer Container-Orchestrierung. Seine Kernkonzepte zu verstehen ist die Grundlage fuer Cloud-Native-Entwicklung.

Die wichtigsten Punkte dieses Kapitels:

1. **Deklaratives Management**: K8s sagen "was ich will", nicht "wie" - die Kontrollschleife konvergiert automatisch
2. **Schichtenarchitektur**: Control Plane fuer Entscheidungen, Worker Nodes fuer Ausfuehrung, etcd fuer State-Speicherung
3. **Kern-Ressourcen**: Pod (kleinste Einheit), Deployment (Replika-Verwaltung), Service (Service Discovery), Ingress (externer Zugang)
4. **Betriebs-Automatisierung**: Rolling Updates fuer Zero Downtime, HPA fuer elastische Skalierung, Probes fuer automatische Ausfall-Wiederherstellung
5. **Konfigurationstrennung**: ConfigMap und Secret entkoppeln Konfiguration vom Image

## Weiterfuehrende Literatur

- [Kubernetes Offizielle Dokumentation](https://kubernetes.io/de/docs/) - Die autoritativste Referenz
- [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) - K8s-Cluster manuell von Grund auf aufbauen
- [The Illustrated Children's Guide to Kubernetes](https://www.cncf.io/phippy/) - CNCF's unterhaltsamer Einstieg
- [Kubernetes Patterns](https://www.oreilly.com/library/view/kubernetes-patterns-2nd/9781098131678/) - K8s-Designmuster
