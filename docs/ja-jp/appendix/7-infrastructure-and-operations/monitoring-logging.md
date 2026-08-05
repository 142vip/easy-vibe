# モニタリング：メトリクス・ログ・アラート設計

> 💡 **学習ガイド**：この章ではプログラミングの基礎知識は不要です。インタラクティブなデモを通じて、運用の完全な知識体系を学びます。監視・アラートから障害対応、キャパシティプランニングから自動化運用まで、オンラインシステムの運用スキルを包括的に習得します。

## 0. はじめに：システムリリースは始まりに過ぎない

多くの初心者は「コードをデプロイしてリリースすれば、作業は完了だ」と考えます。

**それは大きな間違いです！**

システムのリリースは**運用業務のスタート地点**に過ぎません。新車を購入した後のメンテナンス、修理、給油が日常であるのと同じです。

運用には3つの目標があります：

1. **安定性 (Stability)**：システムをダウンさせず、サービスを常に利用可能に保つ
2. **パフォーマンス (Performance)**：高速なレスポンスと良好なユーザー体験を提供する
3. **セキュリティ (Security)**：データ漏洩を防ぎ、攻撃からシステムを守る

---

## 1. 監視体系 (Monitoring)

監視は運用の「目」です。監視のないシステムは、目隠しをして運転するようなもので、問題が発生しても気づきません。

### 1.1 監視の3つの階層

<MonitoringDashboardDemo />

**インフラ監視**：サーバーのハードウェアリソースに注目

- CPU使用率
- メモリ使用率
- ディスク容量とI/O
- ネットワーク帯域幅

**アプリケーション監視**：ソフトウェアの実行状態に注目

- QPS（1秒あたりのリクエスト数）
- レスポンスタイム（レイテンシ）
- エラー率
- 依存サービスの呼び出し状況

**ビジネス監視**：ビジネスの健全性に注目

- DAU/MAU（デイリー/マンスリーアクティブユーザー）
- 注文数
- 決済成功率
- ユーザー定着率

### 1.2 監視ツールスタック

| ツール           | 用途                 | 特徴                           |
| :--------------- | :------------------- | :----------------------------- |
| **Prometheus**   | メトリクス収集と保存 | 時系列データベース、監視データに最適 |
| **Grafana**      | 可視化ダッシュボード | 強力なグラフとダッシュボード機能   |
| **Zabbix**       | 総合監視             | 老舗ツール、機能が充実           |
| **Datadog**      | SaaS監視プラットフォーム | ワンストップソリューション、有料 |

**ポイント**：監視は階層化し、インフラからビジネスまで全方位をカバーして「死角」をなくしましょう。

---

## 2. アラートシステム (Alerting)

監視が問題を発見したら、速やかに運用担当者に通知する必要があります。これが**アラート**です。

### 2.1 アラートフロー

<AlertFlowDemo />

### 2.2 アラートレベルの設計

適切なアラートレベル分けは「アラート疲れ」を防ぎます：

| レベル | 応答時間              | 典型的なシナリオ                   | 通知チャネル               |
| :----- | :-------------------- | :--------------------------------- | :------------------------- |
| **P0** | 即時（5分以内）       | コアサービスダウン、決済失敗       | 電話 + SMS + DingTalk      |
| **P1** | 30分以内              | 一部機能の異常、深刻なパフォーマンス低下 | SMS + DingTalk + メール    |
| **P2** | 当日中に対応          | リソース使用率が高め、散発的なエラー   | DingTalk + メール          |
| **P3** | 今週中に対応          | 非コア問題、最適化提案             | メール                     |

### 2.3 アラートの集約とノイズ低減

**課題**：小さな問題が何百、何千ものアラートを引き起こし、当番担当者が麻痺してしまう。

**解決策**：

1. **アラートグルーピング**：類似アラートを統合（例：同一サーバーの複数の問題を1つにまとめる）
2. **アラート抑制**：親の問題がすでにトリガーされている場合、子の問題は重複して通知しない
3. **サイレンスルール**：メンテナンス期間中はアラートを自動的に一時停止
4. **頻度制限**：同一アラートを短時間に繰り返し通知しない

**ポイント**：アラートは「少なく、的確に」。すべてのアラートが対応に値するものでなければなりません。

---

## 3. ログ管理 (Logging)

ログは問題を調査するための「ブラックボックス」です。

### 3.1 ログレベル

```javascript
console.debug('詳細なデバッグ情報') // 開発時に使用
console.info('一般情報') // 通常フローの記録
console.warn('警告情報') // 潜在的な問題
console.error('エラー情報') // 対応が必要なエラー
```

### 3.2 構造化ログ

従来のログ（非推奨）：

```
2024-01-15 10:23:45 ERROR User john failed to login, attempts=3, ip=192.168.1.100
```

構造化ログ（推奨）：

```json
{
  "timestamp": "2024-01-15T10:23:45Z",
  "level": "ERROR",
  "message": "User login failed",
  "user": "john",
  "attempts": 3,
  "ip": "192.168.1.100",
  "service": "auth-service"
}
```

### 3.3 ELKログスタック

**ELK = Elasticsearch + Logstash + Kibana**

- **Logstash**：ログの収集とフィルタリング
- **Elasticsearch**：ログの保存と検索
- **Kibana**：ログの可視化クエリ

**ベストプラクティス**：

- ✅ 機密情報（パスワード、トークン）はログに記録しない
- ✅ 重要な操作（ログイン、決済、権限変更）は必ず記録する
- ✅ ログにはコンテキストを含める（ユーザーID、リクエストID、タイムスタンプ）
- ✅ 期限切れのログを定期的にクリーンアップし、ディスク容量不足を防ぐ

---

## 4. 分散トレーシング (Tracing)

マイクロサービスアーキテクチャでは、1つのリクエストが十数個のサービスを経由する可能性があります。その完全な経路をどのように追跡すればよいでしょうか？

**Trace ID と Span ID**

- **Trace ID**：リクエスト全体のチェーンを一意に識別するID（配送伝票番号のようなもの）
- **Span ID**：個々のサービス呼び出しを識別するID（各中継拠点のようなもの）

### 4.1 分散トレーシングのデモ

<TraceVisualizationDemo />

### 4.2 OpenTelemetry 標準

OpenTelemetry (OTel) は分散トレーシングの**業界標準**であり、統一されたAPIとSDKを提供します。

```javascript
// 例：OpenTelemetry を使用した Span の記録
import { trace } from '@opentelemetry/api'

const tracer = trace.getTracer('my-service')

async function processOrder(orderId) {
  // Span を作成
  const span = tracer.startSpan('processOrder')

  try {
    // 属性を設定
    span.setAttribute('order.id', orderId)

    // ビジネスロジック...
    await validateOrder(orderId)
    await saveToDatabase(orderId)

    span.setStatus({ code: SpanStatusCode.OK })
  } catch (error) {
    span.recordException(error)
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message })
  } finally {
    span.end() // Span を終了
  }
}
```

**ポイント**：分散トレーシングにより、パフォーマンスのボトルネックや障害ポイントを迅速に特定できます。マイクロサービスには必須のツールです。

---

## 5. 障害対応フロー

オンライン障害は避けられません。重要なのは**迅速な対応と迅速な復旧**です。

### 5.1 障害対応プロセス

<IncidentResponseDemo />

### 5.2 よく使う調査ツール

| ツール         | 用途                 | 典型的なシナリオ                   |
| :------------- | :------------------- | :--------------------------------- |
| **tcpdump**    | パケットキャプチャ分析 | ネットワーク不通、パケットロス     |
| **strace**     | システムコール追跡   | プロセスが固まる、ファイル権限問題 |
| **Arthas**     | Java診断             | CPU高騰、メモリリーク、デッドロック |
| **top/htop**   | システムリソース監視 | CPU/メモリ使用率が高い             |
| **netstat**    | ネットワーク接続確認 | ポート占有、接続数異常             |
| **lsof**       | 開いているファイル確認 | ファイル使用中、ディスク満杯       |

**Arthas の例**（AlibabaオープンソースのJava診断ツール）：

```bash
# CPU使用率が高い上位5スレッドを表示
$ top -H -p 12345

# 特定メソッドの呼び出し時間を確認
$ trace com.example.OrderService createOrder

# クラスの静的フィールドを確認
$ getstatic com.example.Config MAX_CONNECTIONS

# コードのホットデプロイ（再起動不要）
$ mc /tmp/Test.java
$ redefine /tmp/Test.class
```

### 5.3 ポストモーテム (Post-mortem)

**ポストモーテムは責任追及の場ではありません！**

ポストモーテムの目的は：

1. 障害のタイムラインを整理する
2. 根本原因を特定する (Root Cause Analysis)
3. 教訓をまとめる
4. 改善策を策定する

**5 Whys 分析手法**：

「なぜ」を少なくとも5回問いかけ、根本原因を見つけます：

- なぜサービスがダウンしたのか？
  - メモリオーバーフローが発生したため
- なぜメモリオーバーフローが発生したのか？
  - キャッシュデータが多すぎたため
- なぜキャッシュデータが多すぎたのか？
  - 有効期限が設定されていなかったため
- なぜ有効期限が設定されていなかったのか？
  - 開発時に見落としていたため
- **根本原因**：コードレビューとテストケースが不足していた

**ポイント**：Blameless（非難しない）文化を確立し、個人の責任ではなくプロセスの改善に焦点を当てましょう。

---

## 6. パフォーマンス最適化

### 6.1 パフォーマンスボトルネック分析

**トップダウンの最適化アプローチ**：

```
ユーザー体感
  ↓
フロントエンド最適化（リクエスト削減、CDN、遅延読み込み）
  ↓
ネットワーク最適化（HTTP/2、圧縮、持続的接続）
  ↓
バックエンド最適化（キャッシュ、非同期、バッチ処理）
  ↓
データベース最適化（インデックス、クエリ最適化、シャーディング）
  ↓
システム最適化（カーネルパラメータ、JVMチューニング）
```

### 6.2 データベース最適化

**インデックス最適化**：

```sql
-- 遅いクエリ（インデックスなし）
SELECT * FROM orders WHERE user_id = 12345;

-- インデックス作成後は100倍高速に
CREATE INDEX idx_user_id ON orders(user_id);
```

**クエリ最適化**：

```sql
-- ❌ SELECT * を避ける
SELECT * FROM users WHERE id = 123;

-- ✅ 必要なフィールドだけを取得
SELECT id, name, email FROM users WHERE id = 123;

-- ❌ 多すぎる IN 句を避ける
SELECT * FROM orders WHERE user_id IN (1, 2, 3, ..., 10000);

-- ✅ JOIN またはバッチクエリを使用
SELECT * FROM orders o JOIN user_ids u ON o.user_id = u.id;
```

### 6.3 キャッシュ最適化

**多層キャッシュアーキテクチャ**：

```
ブラウザキャッシュ (CDN)
  ↓
ローカルキャッシュ (メモリ/Guava)
  ↓
分散キャッシュ (Redis/Memcached)
  ↓
データベース (MySQL/PostgreSQL)
```

**キャッシュ更新戦略**：

| 戦略                | 利点             | 欠点             | 適したシナリオ                 |
| :------------------ | :--------------- | :--------------- | :----------------------------- |
| **Cache-Aside**     | シンプル、信頼性高い | 初回クエリが遅い | 読み取り多め、書き込み少なめ   |
| **Write-Through**   | データ一貫性が高い | 書き込みが遅い   | 読み書きバランス               |
| **Write-Behind**    | 書き込みが非常に高速 | データ損失の可能性 | 書き込み多め、読み取り少なめ、短時間の不整合許容 |

**ポイント**：キャッシュは銀の弾丸ではありません。一貫性、雪崩、貫通などの問題を考慮する必要があります（「システムキャッシュ設計」の章を参照）。

---

## 7. キャパシティプランニング

### 7.1 キャパシティ評価

<CapacityPlanningDemo />

### 7.2 負荷テスト

**ツールの選択**：

| ツール       | 特徴                     | 適したシナリオ    |
| :----------- | :----------------------- | :---------------- |
| **JMeter**   | 高機能、可視化           | HTTPインターフェース負荷テスト |
| **wrk/ab**   | 軽量、コマンドライン     | クイックベンチマーク |
| **Locust**   | Pythonスクリプト、分散   | 複雑なシナリオの負荷テスト |
| **K6**       | モダン、JSスクリプト     | CI/CD統合         |

**wrk の例**：

```bash
# wrk のインストール
$ brew install wrk  # macOS
$ apt install wrk   # Ubuntu

# HTTPインターフェースの負荷テスト（10スレッド、30秒間）
$ wrk -t10 -c100 -d30s http://example.com/api/users

# 出力：
# Running 30s test @ http://example.com/api/users
#   10 threads and 100 connections
#   Thread Stats   Avg      Stdev     Max   +/- Stdev
#     Latency    45.32ms   12.45ms 120.50ms   87.56%
#     Req/Sec     2.12k   123.45    3.45k    89.01%
#   632450 requests in 30.00s, 1.23GB read
# Requests/sec:  21081.67
```

### 7.3 弾力的なスケーリング

**クラウドネイティブ時代の自動スケーリング**：

```yaml
# Kubernetes HPA (Horizontal Pod Autoscaler)
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

**CPU使用率が70%を超えると、自動的にPodをスケールアウト（最大10個）**

**ポイント**：ビジネス予測（例：大型セールイベント）と組み合わせて事前にスケーリングし、対応が遅れないようにしましょう。

---

## 8. セキュリティ運用

### 8.1 アクセス制御

**最小権限の原則**：

- 開発者は開発環境のみアクセス可能
- 運用担当者は本番環境のみアクセス可能、かつ承認が必要
- データベースの危険な操作は二重確認が必要

**踏み台サーバー (Jump Server)**：

すべての運用操作は踏み台サーバー経由で行い、完全な操作ログを記録します。

### 8.2 データバックアップ

**3-2-1 バックアップ原則**：

- **3**部のデータコピー（1部のオリジナル + 2部のバックアップ）
- **2**種類の異なるストレージメディア（ローカルディスク + クラウドストレージ）
- **1**部のオフサイトバックアップ（単一障害点の災害を防止）

**バックアップ戦略**：

| 種類             | 頻度 | 保持期間 | RTO      | RPO       |
| :--------------- | :--- | :------- | :------- | :-------- |
| **フルバックアップ** | 毎週 | 1ヶ月    | 4時間    | 24時間    |
| **増分バックアップ** | 毎日 | 1週間    | 2時間    | 1時間     |
| **リアルタイムバックアップ** | 秒単位 | 7日間    | 分単位   | 秒単位    |

**RTO (Recovery Time Objective)**：復旧時間目標（サービスが最大でどのくらい中断してもよいか）
**RPO (Recovery Point Objective)**：復旧ポイント目標（最大でどのくらいのデータを失ってもよいか）

### 8.3 脆弱性スキャン

**定期スキャン**：

- **コードスキャン**：SonarQube、ESLint（潜在的な脆弱性を発見）
- **依存関係スキャン**：npm audit、Snyk（サードパーティライブラリの脆弱性を検出）
- **コンテナスキャン**：Trivy、Clair（イメージの脆弱性を検出）

```bash
# npm audit の例
$ npm audit

found 3 vulnerabilities (1 moderate, 2 high)

Package         Severity  Vulnerable versions
lodash          high      <4.17.21
express         moderate  4.0.0 - 4.18.2

# 自動修正
$ npm audit fix
```

---

## 9. 自動化運用 (DevOps)

### 9.1 CI/CDパイプライン

```yaml
# .gitlab-ci.yml の例
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - npm install
    - npm test
  tags:
    - docker

build:
  stage: build
  script:
    - docker build -t myapp:$CI_COMMIT_SHA .
    - docker push registry.example.com/myapp:$CI_COMMIT_SHA
  only:
    - main

deploy:
  stage: deploy
  script:
    - kubectl set image deployment/myapp myapp=registry.example.com/myapp:$CI_COMMIT_SHA
  environment:
    name: production
  when: manual # 手動でデプロイをトリガー
```

### 9.2 Infrastructure as Code (IaC)

**Terraform の例**（クラウドリソースの管理）：

```hcl
# main.tf
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "WebServer"
    Env  = "production"
  }
}

resource "aws_security_group" "web" {
  name = "web-sg"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

**利点**：

- ✅ バージョン管理：すべての設定をGitで管理
- ✅ 再現性：環境の一貫性を確保
- ✅ 監査可能性：変更履歴が明確
- ✅ ロールバック可能：以前のバージョンに迅速に復旧

### 9.3 GitOps プラクティス

**GitOps = Git + IaC + Automation**

核心理念：**Gitリポジトリがインフラの唯一の信頼できる情報源 (Single Source of Truth)**

ワークフロー：

```
1. 設定ファイルを変更（Gitにpush）
   ↓
2. Gitリポジトリの変更がCI/CDをトリガー
   ↓
3. terraform apply/kubectl apply を自動実行
   ↓
4. インフラが自動更新
   ↓
5. 実際の状態と期待する状態を監視・比較
```

**ツール**：ArgoCD、Flux（Kubernetesデプロイメント）

---

## 10. まとめとベストプラクティス

運用は広大な体系ですが、核心は以下のようにまとめられます：

### 10.1 運用成熟度モデル

| レベル     | 特徴                       | プラクティス                           |
| :--------- | :------------------------- | :------------------------------------- |
| **初級**   | 受動的対応、手動操作       | 問題が起きてから対応、手動デプロイ     |
| **中級**   | 自動化、標準化             | CI/CD、監視アラート、ドキュメント化    |
| **上級**   | 予防中心、自己修復         | キャパシティプランニング、障害訓練、自動スケーリング |
| **エキスパート** | インテリジェント、無人運用 | AIOps、カオスエンジニアリング、Serverless |

### 10.2 運用エンジニアの1日

```
09:00 - 夜間アラートの確認、システム状態の確認
10:00 - ユーザーから報告された問題の対応
11:00 - 開発週次ミーティングに参加、新計画の運用リスク評価
14:00 - スロークエリの最適化、パフォーマンス向上
15:00 - コードレビュー (Code Review)
16:00 - デプロイメントドキュメントの作成、監視ルールの更新
17:00 - 障害訓練 (Chaos Engineering)
18:00 - 当番引継ぎ
```

### 10.3 学習ロードマップ

**入門段階**（1〜3ヶ月）：

- Linuxの基本コマンドを習得
- 監視システムを理解する（Prometheus + Grafana）
- ログ検索をマスターする（ELK）

**応用段階**（3〜6ヶ月）：

- コンテナ技術を深く理解する（Docker + K8s）
- 診断ツールを1つ習得する（Arthas、tcpdump）
- CI/CDパイプラインを実践する

**上級段階**（6〜12ヶ月）：

- パフォーマンスチューニング（データベース、JVM、ネットワーク）
- キャパシティプランニングとコスト最適化
- ポストモーテムとプロセス改善

**エキスパート段階**（1年以上）：

- アーキテクチャ設計（高可用性、ディザスタリカバリ）
- カオスエンジニアリング（能動的な障害注入）
- AIOps（インテリジェント運用）

---

## 11. 用語集 (Glossary)

| 用語            | 正式名称                            | 説明                                                   |
| :-------------- | :---------------------------------- | :----------------------------------------------------- |
| **Monitoring**  | -                                   | 監視。システムの稼働状態をリアルタイムで観測すること。 |
| **Alerting**    | -                                   | アラート。異常時に担当者へ通知すること。               |
| **Logging**     | -                                   | ログ。システム実行中のイベントを記録すること。         |
| **Tracing**     | -                                   | 分散トレーシング。分散システムにおけるリクエストの完全な経路を追跡すること。 |
| **QPS**         | Queries Per Second                  | 1秒あたりのリクエスト数。システムのスループットを測定する指標。 |
| **Latency**     | -                                   | レイテンシ。リクエスト送信からレスポンス受信までの時間。 |
| **RTO**         | Recovery Time Objective             | 復旧時間目標。サービスが最大でどのくらい中断しても許容できるか。 |
| **RPO**         | Recovery Point Objective            | 復旧ポイント目標。最大でどのくらいのデータを失っても許容できるか。 |
| **Post-mortem** | -                                   | ポストモーテム。障害原因と改善策を分析すること。       |
| **CI/CD**       | Continuous Integration/Delivery     | 継続的インテグレーション/継続的デリバリー。テストとデプロイの自動化。 |
| **IaC**         | Infrastructure as Code              | Infrastructure as Code。コードでサーバーやネットワークなどのリソースを管理すること。 |
| **GitOps**      | -                                   | GitOps。Gitリポジトリをインフラの唯一の信頼できる情報源とすること。 |
| **ELK**         | Elasticsearch + Logstash + Kibana   | ログ収集・保存・可視化の3点セット。                    |
| **SLA**         | Service Level Agreement             | サービスレベル契約。約束されたサービス可用性（例：99.9%）。 |
| **Blameless**   | -                                   | 非難しない文化。ポストモーテムでは個人の責任ではなくプロセス改善に焦点を当てること。 |

---

## 12. 参考資料

- **[システムキャッシュ設計](/zh-cn/appendix/4-server-and-backend/caching)** - キャッシュの原理、パターンとベストプラクティス
- **[メッセージキュー設計](/zh-cn/appendix/4-server-and-backend/message-queues)** - ピークカット、非同期デカップリング
- **[認証認可の原理と実践](/zh-cn/appendix/4-server-and-backend/auth-authorization)** - 認証・認可、セキュリティ強化
- **[バックエンド進化史](/zh-cn/appendix/4-server-and-backend/backend-layered-architecture)** - モノリスからマイクロサービス、Serverlessまで
- **[デプロイとリリース](/zh-cn/appendix/7-infrastructure-and-operations/ci-cd)** - 開発から本番までのラストワンマイル