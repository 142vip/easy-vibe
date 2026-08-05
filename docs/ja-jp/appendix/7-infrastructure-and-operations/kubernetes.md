# Kubernetes 原理：オーケストレーションの核心概念


::: tip はじめに
**Docker は「パッケージング」の問題を解決し、Kubernetes は「管理」の問題を解決します。** 数十から数百のコンテナのデプロイ、スケーリング、障害復旧が必要な場合、手動管理は現実的ではありません。Kubernetes（K8s）はコンテナの「オペレーティングシステム」であり、コンテナ化されたアプリケーションのデプロイ、スケーリング、運用を自動化します。
:::

**この記事で学べること**

この章を終えると、次のことが身につきます：

- **アーキテクチャの理解**：K8s コントロールプレーンとワーカーノードの構成を習得
- **コアリソース**：Pod、Deployment、Service などのコア概念に精通
- **宣言型管理**：「望む状態を宣言し、システムが自動的に収束する」という考え方を理解
- **運用能力**：ローリングアップデート、オートスケーリング、ヘルスチェックなどの仕組みを理解
- **実践入門**：kubectl と YAML を使って完全なアプリケーションをデプロイできる

| 章 | 内容 | コア概念 |
|---|------|---------|
| **第1章** | なぜ K8s が必要か | コンテナオーケストレーションの課題 |
| **第2章** | K8s アーキテクチャ | コントロールプレーン、ワーカーノード、etcd |
| **第3章** | コアリソース | Pod、Deployment、Service、Ingress |
| **第4章** | 宣言型管理 | YAML、kubectl、制御ループ |
| **第5章** | 運用プラクティス | ローリングアップデート、HPA、ヘルスチェック |

---

## 1. Kubernetesの動機

Docker は単一コンテナのパッケージングと実行をシンプルにしましたが、次のようなシナリオに直面すると、手動管理では対応しきれません：

| 課題 | 説明 | K8s のソリューション |
|------|------|-------------------|
| マルチインスタンスデプロイ | 1つのサービスで10レプリカを実行する必要がある | Deployment がレプリカ数を自動管理 |
| 障害復旧 | コンテナがクラッシュした際の自動再起動が必要 | コントローラが自動検出して Pod を再作成 |
| サービスディスカバリー | コンテナの IP は変動する。どうやって見つける？ | Service が安定した DNS と IP を提供 |
| ローリングアップデート | バージョン更新時にサービス停止不可 | 古い Pod を段階的に置き換え、ゼロダウンタイム |
| 弾力スケーリング | トラフィックピーク時の自動スケールアウト | HPA が CPU/メモリに基づいてレプリカ数を自動調整 |
| リソーススケジューリング | コンテナを最適なマシンに配置 | Scheduler がインテリジェントにスケジュール |

::: tip K8s のコア思想：宣言型
K8s に「3つのコンテナを起動して」と指示するのではなく（命令型）、「3つのレプリカを実行させたい」と宣言します（宣言型）。K8s は継続的に監視し、実際の状態が宣言された望ましい状態と一致することを確認します。Pod がクラッシュすると、新しいものを自動的に作成して置き換えます。
:::

---

## 2. Kubernetes アーキテクチャ

K8s クラスタはコントロールプレーン（Control Plane）とワーカーノード（Worker Node）で構成されます。

<K8sArchitectureDemo />

### リクエストの完全なパス

```
ユーザーリクエスト → Ingress Controller → Service → kube-proxy → Pod（コンテナ）
                                                  ↑
                                        エンドポイントリスト（Service が維持）
```

---

## 3. コアリソースオブジェクト

K8s は様々な「リソースオブジェクト」を通じてクラスタの望ましい状態を記述します。

<K8sWorkloadsDemo />

### リソースオブジェクトのカテゴリ

| カテゴリ | リソース | 用途 |
|---------|---------|------|
| ワークロード | Pod、Deployment、StatefulSet、DaemonSet、Job | アプリケーションの実行 |
| ネットワーク | Service、Ingress、NetworkPolicy | サービスディスカバリーとトラフィック管理 |
| 設定 | ConfigMap、Secret | 設定と機密データの管理 |
| ストレージ | PersistentVolume、PersistentVolumeClaim | 永続ストレージ |
| スケジューリング | Node、Namespace、ResourceQuota | リソースの分離と制限 |

---

## 4. 宣言型管理と kubectl

### 調整ループ（Reconciliation Loop）

K8s のコアとなる仕組みは調整ループです：

```
観察（Observe）→ 比較（Diff）→ 行動（Act）→ 観察...
     ↓              ↓            ↓
  実際の状態を    望ましい状態    修正操作を
  読み取る      と比較する      実行する
```

`replicas: 3` と宣言すると、コントローラは実行中の Pod が2つしかないことを発見し、新しいものを1つ作成します。このループは数秒ごとに実行され、システムが常に望ましい状態に収束することを確保します。

### よく使う kubectl コマンド

| コマンド | 目的 | 例 |
|---------|------|-----|
| `kubectl apply -f` | YAML 設定を適用 | `kubectl apply -f deployment.yaml` |
| `kubectl get` | リソース一覧を表示 | `kubectl get pods -o wide` |
| `kubectl describe` | リソースの詳細を表示 | `kubectl describe pod my-app-xxx` |
| `kubectl logs` | Pod のログを表示 | `kubectl logs -f my-app-xxx` |
| `kubectl exec` | Pod のターミナルに入る | `kubectl exec -it my-app-xxx -- sh` |
| `kubectl delete` | リソースを削除 | `kubectl delete -f deployment.yaml` |
| `kubectl scale` | 手動スケーリング | `kubectl scale deploy my-app --replicas=5` |

::: tip apply vs create
`kubectl create` は命令型——「このリソースを作成する」。既に存在する場合はエラーになります。`kubectl apply` は宣言型——「リソースがこの状態であることを確認する」。存在しなければ作成し、存在すれば更新します。本番環境では常に `apply` を使用すべきです。
:::

---

## 5. 運用プラクティス

### 5.1 ローリングアップデートとロールバック

Deployment はデフォルトでローリングアップデート戦略を使用します：新しいバージョンの Pod を段階的に作成しながら、古いバージョンの Pod を段階的に終了します。

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # 最大で1つの追加 Pod を作成
      maxUnavailable: 0   # 利用不可の Pod を許可しない
```

| 操作 | コマンド |
|------|---------|
| イメージの更新 | `kubectl set image deploy/my-app app=my-app:2.0` |
| 更新状態の確認 | `kubectl rollout status deploy/my-app` |
| リビジョン履歴の確認 | `kubectl rollout history deploy/my-app` |
| 前のバージョンにロールバック | `kubectl rollout undo deploy/my-app` |

### 5.2 オートスケーリング（HPA）

HPA（Horizontal Pod Autoscaler）は、CPU、メモリ、またはカスタムメトリクスに基づいて Pod レプリカ数を自動的に調整します。

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

### 5.3 ヘルスチェック（Probe）

K8s は3種類のプローブを通じて Pod のヘルス状態を監視します：

| プローブ | 目的 | 失敗時の結果 |
|---------|------|------------|
| livenessProbe | コンテナが生存しているかを検出 | コンテナを再起動 |
| readinessProbe | コンテナが準備完了かを検出 | Service から除外、トラフィックを受信しない |
| startupProbe | コンテナの起動が完了したかを検出 | 起動中は他のプローブを実行しない |

::: tip プローブの重要性
ヘルスチェックプローブが設定されていない Pod では、K8s はプロセスが存在するかどうかでしかヘルス状態を判断できません。しかし、プロセスはまだ実行されているのにサービスが応答していない（デッドロック、OOM の境界など）ことがよくあります。livenessProbe を設定することで、K8s はこれらの「ゾンビ」コンテナを自動的に再起動できます。
:::

---

## まとめ

Kubernetes はコンテナオーケストレーションの事実上の標準であり、そのコア概念を理解することはクラウドネイティブ開発の基盤です。

この章の重要ポイントを振り返ります：

1. **宣言型管理**：K8s に「何が欲しいか」を伝え、「どうやるか」は伝えない——制御ループが自動的に収束
2. **階層型アーキテクチャ**：コントロールプレーンが意思決定、ワーカーノードが実行、etcd が状態を保存
3. **コアリソース**：Pod（最小単位）、Deployment（レプリカ管理）、Service（サービスディスカバリー）、Ingress（外部エントリポイント）
4. **運用の自動化**：ローリングアップデートでゼロダウンタイム、HPA で弾力的スケーリング、プローブで自動障害復旧
5. **設定の分離**：ConfigMap と Secret が設定とイメージの結合を解消

## 参考文献

- [Kubernetes 公式ドキュメント](https://kubernetes.io/docs/) - 最も権威あるリファレンス
- [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) - ゼロから手動で K8s クラスタを構築
- [The Illustrated Children's Guide to Kubernetes](https://www.cncf.io/phippy/) - CNCF の楽しい入門ガイド
- [Kubernetes Patterns](https://www.oreilly.com/library/view/kubernetes-patterns-2nd/9781098131678/) - K8s デザインパターン
