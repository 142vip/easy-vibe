# Kubernetes 原理

::: tip 前言
**Docker 解決了「打包」問題，Kubernetes 解決了「管理」問題。** 當你有幾十上百個容器需要部署、擴縮容、故障恢復時，手動管理是不現實的。Kubernetes（K8s）就是容器的「作業系統」，它自動化了容器化應用的部署、擴展和維運。
:::

**這篇文章會帶你學什麼？**

學完這章後，你將獲得：

- **架構理解**：掌握 K8s 控制平面和工作節點的組成
- **核心資源**：熟悉 Pod、Deployment、Service 等核心概念
- **宣告式管理**：理解「宣告期望狀態，系統自動收斂」的思想
- **維運能力**：了解滾動更新、自動擴縮容、健康檢查等機制
- **實戰入門**：能用 kubectl 和 YAML 部署一個完整應用

| 章節 | 內容 | 核心概念 |
|-----|------|---------|
| **第 1 章** | 為什麼需要 K8s | 容器編排的挑戰 |
| **第 2 章** | K8s 架構 | 控制平面、工作節點、etcd |
| **第 3 章** | 核心資源 | Pod、Deployment、Service、Ingress |
| **第 4 章** | 宣告式管理 | YAML、kubectl、控制迴圈 |
| **第 5 章** | 維運實踐 | 滾動更新、HPA、健康檢查 |

---

## 1. 需要 Kubernetes 的動機

Docker 讓單個容器的打包和執行變得簡單，但當你面對以下場景時，手動管理就力不從心了：

| 挑戰 | 描述 | K8s 的解決方案 |
|------|------|---------------|
| 多實例部署 | 一個服務需要執行 10 個副本 | Deployment 自動管理副本數 |
| 故障恢復 | 某個容器掛了需要自動重啟 | 控制器自動偵測並重建 Pod |
| 服務發現 | 容器 IP 會變，怎麼找到對方？ | Service 提供穩定的 DNS 和 IP |
| 滾動更新 | 更新版本時不能停服 | 逐步替換舊 Pod，零停機 |
| 彈性伸縮 | 流量高峰自動擴容 | HPA 根據 CPU/記憶體自動調整副本數 |
| 資源調度 | 把容器放到最合適的機器上 | Scheduler 智慧調度 |

::: tip K8s 的核心思想：宣告式
你不需要告訴 K8s「啟動 3 個容器」（命令式），而是告訴它「我要 3 個副本在執行」（宣告式）。K8s 會持續監控，確保實際狀態與你宣告的期望狀態一致。如果一個 Pod 掛了，它會自動建立新的來補上。
:::

---

## 2. Kubernetes 架構

K8s 叢集由控制平面（Control Plane）和工作節點（Worker Node）組成。

<K8sArchitectureDemo />

### 一次請求的完整路徑

```
使用者請求 → Ingress Controller → Service → kube-proxy → Pod（容器）
                                              ↑
                                    Endpoint 清單（由 Service 維護）
```

---

## 3. 核心資源物件

K8s 透過各種「資源物件」來描述叢集的期望狀態。

<K8sWorkloadsDemo />

### 資源物件分類

| 類別 | 資源 | 用途 |
|------|------|------|
| 工作負載 | Pod、Deployment、StatefulSet、DaemonSet、Job | 執行應用 |
| 網路 | Service、Ingress、NetworkPolicy | 服務發現和流量管理 |
| 設定 | ConfigMap、Secret | 設定和敏感資料管理 |
| 儲存 | PersistentVolume、PersistentVolumeClaim | 持久化儲存 |
| 調度 | Node、Namespace、ResourceQuota | 資源隔離和限制 |

---

## 4. 宣告式管理與 kubectl

### 控制迴圈（Reconciliation Loop）

K8s 的核心工作機制是控制迴圈：

```
觀察（Observe）→ 比較（Diff）→ 行動（Act）→ 觀察...
     ↓                ↓              ↓
  讀取實際狀態    與期望狀態對比    執行修正操作
```

你宣告 `replicas: 3`，控制器發現只有 2 個 Pod 在執行，就會建立 1 個新的。這個迴圈每隔幾秒執行一次，確保系統始終向期望狀態收斂。

### kubectl 常用指令

| 指令 | 作用 | 範例 |
|------|------|------|
| `kubectl apply -f` | 應用 YAML 設定 | `kubectl apply -f deployment.yaml` |
| `kubectl get` | 查看資源清單 | `kubectl get pods -o wide` |
| `kubectl describe` | 查看資源詳情 | `kubectl describe pod my-app-xxx` |
| `kubectl logs` | 查看 Pod 日誌 | `kubectl logs -f my-app-xxx` |
| `kubectl exec` | 進入 Pod 終端 | `kubectl exec -it my-app-xxx -- sh` |
| `kubectl delete` | 刪除資源 | `kubectl delete -f deployment.yaml` |
| `kubectl scale` | 手動擴縮容 | `kubectl scale deploy my-app --replicas=5` |

::: tip apply vs create
`kubectl create` 是命令式的——「建立這個資源」，如果已存在會報錯。`kubectl apply` 是宣告式的——「確保資源是這個狀態」，不存在就建立，已存在就更新。正式環境中應該始終使用 `apply`。
:::

---

## 5. 維運實踐

### 5.1 滾動更新與回滾

Deployment 預設使用滾動更新策略：逐步建立新版本 Pod，同時逐步終止舊版本 Pod。

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # 最多多建立 1 個 Pod
      maxUnavailable: 0   # 不允許有 Pod 不可用
```

| 操作 | 指令 |
|------|------|
| 更新映像 | `kubectl set image deploy/my-app app=my-app:2.0` |
| 查看更新狀態 | `kubectl rollout status deploy/my-app` |
| 查看歷史版本 | `kubectl rollout history deploy/my-app` |
| 回滾到上一版本 | `kubectl rollout undo deploy/my-app` |

### 5.2 自動擴縮容（HPA）

HPA（Horizontal Pod Autoscaler）根據 CPU、記憶體或自訂指標自動調整 Pod 副本數。

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

### 5.3 健康檢查（Probe）

K8s 透過三種探針監控 Pod 的健康狀態：

| 探針 | 作用 | 失敗後果 |
|------|------|---------|
| livenessProbe | 偵測容器是否存活 | 重啟容器 |
| readinessProbe | 偵測容器是否就緒 | 從 Service 摘除，不接收流量 |
| startupProbe | 偵測容器是否啟動完成 | 啟動期間不執行其他探針 |

::: tip 探針的重要性
沒有設定健康檢查的 Pod，K8s 只能透過程序是否存在來判斷健康狀態。但很多時候程序還在，服務已經不回應了（比如死鎖、OOM 邊緣）。設定 livenessProbe 可以讓 K8s 自動重啟這些「假死」的容器。
:::

---

## 總結

Kubernetes 是容器編排的事實標準，理解它的核心概念是雲原生開發的基礎。

回顧本章的關鍵要點：

1. **宣告式管理**：告訴 K8s「我要什麼」，而不是「怎麼做」，控制迴圈自動收斂
2. **架構分層**：控制平面負責決策，工作節點負責執行，etcd 儲存狀態
3. **核心資源**：Pod（最小單元）、Deployment（副本管理）、Service（服務發現）、Ingress（外部入口）
4. **維運自動化**：滾動更新零停機、HPA 彈性伸縮、探針自動故障恢復
5. **設定分離**：ConfigMap 和 Secret 讓設定與映像解耦

## 延伸閱讀

- [Kubernetes 官方文件](https://kubernetes.io/zh-cn/docs/) - 最權威的中文參考
- [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) - 從零手動搭建 K8s 叢集
- [The Illustrated Children's Guide to Kubernetes](https://www.cncf.io/phippy/) - CNCF 出品的趣味入門
- [Kubernetes Patterns](https://www.oreilly.com/library/view/kubernetes-patterns-2nd/9781098131678/) - K8s 設計模式
