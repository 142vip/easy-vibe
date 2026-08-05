# API 設計：REST・GraphQL・エラーハンドリング


::: tip 🎯 核心問題
**フロントエンドとバックエンドはどう効率的に対話するか？** これは、「レストランのメニューをどうデザインすれば、お客様が一目で理解できるか？」「ウェイターはどう注文を取ればミスがないか？」「料理をどう提供すればお客様が満足するか？」という問いに似ている。API 設計が解決するのはまさにこの「対話のルール」の問題である。
:::

---

## 0. まず問おう：こんな悪夢を見たことはないか

**シーン1：API の命名がバラバラ**

```
GET /getUserData
GET /fetchUserInfo
GET /queryUserById
GET /users/query
```

4つの API、機能は同じなのに命名スタイルがまったく違う。新人は困惑する——どれを使えばいいんだ？

**シーン2：エラーハンドリングが千差万別**

```json
// HTTP ステータスコードを返すもの
HTTP/1.1 404 Not Found

// 200 + code を返すもの
HTTP/1.1 200 OK
{ "code": 404, "message": "ユーザーが存在しません" }

// 例外を直接投げるもの
HTTP/1.1 200 OK
{ "error": "エラーが発生しました" }
```

フロントエンドはリクエストが成功したかどうか判断できない。

**シーン3：レスポンス構造が人それぞれ**

```json
// API A
{ "data": { ... } }

// API B
{ "result": { ... } }

// API C
{ "content": { ... } }
```

APIごとにレスポンス形式が異なり、フロントエンドはAPIごとに個別対応を強いられる。

---

**優れた API 設計はレストランの注文システムのようなもの**——メニューは明確、フローは標準化され、エラー時にはヒントがある。

---

## 1. APIの概要

**API**（Application Programming Interface、アプリケーションプログラミングインターフェース）とは、「プログラム間の対話の取り決め」である。

### 1.1 レストランに例えると

| レストランの役割 | 対応する概念 | 説明 |
| :--- | :--- | :--- |
| メニュー | API ドキュメント | どんな「料理」が注文できるかを示す |
| ウェイター | HTTP プロトコル | 標準化された「対話方法」 |
| 厨房 | サーバーサイド | 「注文」に従って処理する |
| 料理の提供 | レスポンス | 結果を「お客様」に返す |

### 1.2 完全な API リクエスト

👇 **実際に試してみよう**：下のボタンをクリックして、API リクエスト〜レスポンスの完全な流れを観察しよう：

<ApiRequestDemo />

---

## 2. API 設計哲学：RPC / REST / GraphQL / gRPC

具体的な RESTful 設計に入る前に、まず4つの主要な API 設計スタイルを理解しよう：

<ApiStyleCompare />

### 2.1 REST と RESTful：どう違う

この2つの概念を混同する人は多い：

| 概念 | 意味 | 説明 |
| :--- | :--- | :--- |
| **REST** | アーキテクチャスタイル | Roy Fielding が提唱した設計理念で、一連の制約条件を含む |
| **RESTful** | REST スタイルに準拠した | 形容詞で、API 設計が REST 原則に従っていることを表す |

**例え**：
- REST は「ミニマリズム」のようなもの——一つの設計理念
- RESTful API は「ミニマルスタイルの部屋」のようなもの——その理念を適用した具体的な実装

**REST の6つの制約**：

| 制約 | 説明 |
| :--- | :--- |
| **クライアント-サーバー分離** | フロントエンドとバックエンドを独立して開発し、インターフェースを疎結合にする |
| **ステートレス** | 各リクエストに必要な情報をすべて含め、サーバーはセッション状態を保持しない |
| **キャッシュ可能** | レスポンスはキャッシュ可能かどうかを明示し、パフォーマンスを向上させる |
| **統一インターフェース** | 標準の HTTP メソッドとステータスコードを使用する |
| **階層化システム** | クライアントはどの階層のサーバーに接続しているかを知る必要がない |
| **オンデマンドコード**（オプション） | サーバーがクライアントの機能を拡張できる |

::: tip 💡 なぜ REST が最もよく使われるのか？
1. **学習コストが低い**：HTTP プロトコル自体が REST の思想を体現している
2. **エコシステムが成熟**：ツール、フレームワーク、ドキュメントが豊富
3. **汎用性が高い**：どんな言語、どんなプラットフォームからも呼び出せる
4. **キャッシュしやすい**：GET リクエストは自然にキャッシュ可能で、CDN とも相性が良い
:::

---

## 3. RESTful 設計：URL に語らせる

**REST**（Representational State Transfer）はアーキテクチャスタイルであり、その核心思想は：

- ネットワーク上の事物を「リソース」（Resource）として抽象化する
- URL でリソースを識別する
- HTTP メソッドでリソースを操作する

### 3.1 倉庫に例えると

| 倉庫の概念 | REST での対応 | 例 |
| :--- | :--- | :--- |
| 棚の住所 | URL | `/users`、`/orders` |
| 操作方法 | HTTP メソッド | GET（確認）、POST（入庫） |
| 貨物 | リソース | ユーザーデータ、注文データ |

**重要な原則**：URL は名詞であり、動詞ではない。

### 3.2 URL 設計ルール

| ルール | 悪い例 | 良い例 | 説明 |
| :--- | :--- | :--- | :--- |
| 動詞でなく名詞を使う | `/getUsers` | `/users` | URL はリソースを表し、HTTP メソッドが操作を表す |
| 複数形を使う | `/user` | `/users` | 複数形スタイルに統一する |
| 小文字+ハイフン | `/UserProfiles` | `/user-profiles` | URL は大文字小文字を区別する |
| 深すぎる階層を避ける | `/a/b/c/d/e` | `/a/b/c` | 最大3階層まで |
| フィルタはクエリパラメータで | `/products/phone/5000` | `/products?cat=phone` | フィルタ条件は `?` パラメータで |

::: tip 💡 URL の大文字小文字の区別
小文字 + ハイフン（-）に統一するのが最も安全な方法で、大文字小文字の混乱やアンダースコアスタイルの不一致を防げる。
:::

### 3.3 HTTP メソッドの選択

| メソッド | 用途 | 冪等性 | 安全性 | 典型的なシーン |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | リソースの取得 | あり | あり | リスト検索、詳細確認 |
| **POST** | リソースの作成 | なし | なし | ユーザー追加、注文送信 |
| **PUT** | 全量更新 | あり | なし | ユーザー情報全体の置き換え |
| **PATCH** | 部分更新 | なし | なし | ニックネームのみ変更 |
| **DELETE** | リソースの削除 | あり | なし | ユーザー削除、注文キャンセル |

::: tip 💡 冪等性とは？
**冪等性**：複数回実行しても結果が同じであること。

- **冪等な操作**（GET/PUT/DELETE）：10回クリックしても1回クリックしても結果は同じ
- **冪等でない操作**（POST）：10回クリックすると、10個の注文が作成される可能性がある

**解決策**：POST 操作には一意の ID による検証を入れ、重複処理を防ぐ。
:::

---

## 4. ステータスコード：エラーに「語らせる」

HTTP ステータスコードは、サーバーがクライアントに「何が起きたか」を伝える標準的な方法である。

### 4.1 ステータスコードの分類

| 分類 | 意味 | 代表的なステータスコード |
| :--- | :--- | :--- |
| **2xx** | 成功 | 200 OK、201 Created、204 No Content |
| **3xx** | リダイレクト | 301 恒久的移動、304 未変更 |
| **4xx** | クライアントエラー | 400 パラメータエラー、401 認証未完了、404 存在しない |
| **5xx** | サーバーエラー | 500 内部エラー、503 サービス利用不可 |

### 4.2 よく使うステータスコードのデモ

👇 **実際に試してみよう**：下のボタンをクリックして、よく使うステータスコードの意味を理解しよう：

<StatusCodeDemo />

---

## 5. エラーハンドリング：エレガントに「拒否する」

優れたエラーハンドリングは、クライアントが「ステータスコードを見れば何が起きたかわかる」ようにし、推測させるべきではない。

### 4.1 エラーハンドリングの「ケーススタディ」

**落とし穴1：すべてのエラーで 200 を返す**

```json
// ❌ 悪いやり方
HTTP/1.1 200 OK
{ "error": "エラーが発生しました" }
```

問題点：キャッシュ層がこの「成功」レスポンスをキャッシュしてしまい、監視システムが問題を発見できない。

**落とし穴2：エラーメッセージが曖昧すぎる**

```json
// ❌ 悪いやり方
HTTP/1.1 400 Bad Request
{ "message": "パラメータエラー" }
```

問題点：クライアントはどのパラメータが間違っているのか、なぜ間違っているのかがわからない。

**落とし穴3：機密情報の露出**

```json
// ❌ 危険なやり方
HTTP/1.1 500 Internal Server Error
{ "stack": "at UserService.login...", "sql": "SELECT * FROM..." }
```

危険性：コード構造やデータベースクエリが露出し、攻撃者に悪用される可能性がある。

### 5.2 正しいエラーハンドリングのデモ

👇 **実際に試してみよう**：「良い」エラーレスポンスと「悪い」エラーレスポンスの設計を比較しよう：

<ErrorHandlingDemo />

---

## 6. バージョン管理：API の「後方互換性」

### 6.1 バージョン管理の動機

シナリオ：あなたのアプリに100万人のユーザーがいる。注文 API を変更する必要がある。

**バージョン管理をしない場合**：
- 新しいアプリが新しい API を呼ぶ → 正常
- 古いアプリが新しい API を呼ぶ → フィールド不足でクラッシュ！

**正しいやり方**：
- `/v1/orders` - 古い API、引き続き古いアプリにサービス提供
- `/v2/orders` - 新しい API、新機能はここに

### 6.2 バージョン管理戦略

| 戦略 | 例 | 長所 | 短所 |
| :--- | :--- | :--- | :--- |
| **URL パス** | `/v1/users` | 直感的、キャッシュしやすい | URL が長くなる |
| **リクエストヘッダー** | `Accept: vnd.api.v2+json` | URL がクリーン | デバッグが不便 |
| **クエリパラメータ** | `/users?version=2` | シンプル | 標準的でない |

### 6.3 バージョン進化の例

ユーザー API を例に、v1 から v2 への進化を示す：

| API | v1（旧版） | v2（新版） | 変更点 |
| :--- | :--- | :--- | :--- |
| **ユーザー取得** | `GET /v1/users`<br>戻り値：`name, email` | `GET /v2/users`<br>戻り値：`name, email, avatar, phone` | アバター、電話番号フィールドを追加 |
| **注文作成** | `POST /v1/orders`<br>受信：`items[]` | `POST /v2/orders`<br>受信：`items[], coupons[]` | クーポン対応を追加 |
| **バッチ操作** | なし | `POST /v2/orders/batch` | バッチ作成 API を新規追加 |

::: tip 💡 バージョン管理のベストプラクティス
- **後方互換性を維持**：v1 API は最低6〜12ヶ月間メンテナンスし、クライアントにアップグレードの時間を与える
- **ドキュメントを同期更新**：バージョンごとに独立した API ドキュメントを用意する
- **廃止予告**：v1 がいつ停止されるかを事前に通知し、移行を促す
- **利用状況を監視**：v1 の呼び出し量を統計し、安全に停止できることを確認してからサービスを終了する
:::

---

## 7. レスポンス構造設計

レスポンス構造はフロントエンドとバックエンドの協業における「データ契約」であり、統一フォーマットによってコミュニケーションコストを大幅に削減できる。

<ResponseStructureDemo />

### 7.1 大手企業の実践リファレンス

::: details Google API 設計ガイド
[Google API Design Guide](https://cloud.google.com/apis/design/errors) を参照。Google はすべての API エラーレスポンスに `google.rpc.Status` メッセージ構造を含めることを要求している：

```json
{
  "error": {
    "code": 429,
    "message": "リソース不足です。しばらくしてから再試行してください",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.ErrorInfo",
        "reason": "RESOURCE_AVAILABILITY",
        "domain": "compute.googleapis.com",
        "metadata": {
          "zone": "us-east1-a",
          "service": "compute"
        }
      }
    ]
  }
}
```

**核心要件**：
- `ErrorInfo` を含め、機械可読なエラー識別子を提供する必要がある
- `message` は開発者向けで、問題と解決策を簡潔に記述する
- `details` 配列には `LocalizedMessage`（ローカライズメッセージ）や `Help`（ヘルプリンク）などを含められる
:::

::: details Microsoft REST API ガイドライン
[Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md) を参照。Microsoft はレスポンスの一貫性を重視している：

**エラーと障害の分類**：
- **エラー（Error）**：クライアントが無効なデータを送信したことによるもので、4xx を返す。API の可用性には影響しない
- **障害（Fault）**：サーバーが有効なリクエストに正しく応答できない場合で、5xx を返す。API の可用性に影響する

**レスポンスヘッダー仕様**：
- `Date`：必須、RFC 5322 形式（GMT タイムゾーン）を使用
- `Content-Type`：必須
- `ETag`：楽観的並行性制御をサポートするリソースでは必須
:::

::: details アリババ Java 開発マニュアル
[アリババ Java 開発マニュアル](https://developer.aliyun.com/special/tech-java) を参照。アリババは API レスポンスについて以下の仕様を定めている：

**統一返却オブジェクト**：
```java
public class Result<T> {
    private Integer code;
    private String message;
    private T data;
    private String requestId;
}
```

**エラーコードのセグメント設計**：
| 範囲 | 種類 | 例 |
| :--- | :--- | :--- |
| 0 | 成功 | 0 |
| 1xxxx | パラメータエラー | 10001 必須パラメータ不足 |
| 2xxxx | ビジネスエラー | 20001 残高不足 |
| 3xxxx | 認証エラー | 30001 未ログイン |
| 5xxxx | システムエラー | 50001 データベース異常 |
:::

::: details Stripe API レスポンス設計
[Stripe API Documentation](https://docs.stripe.com/api/errors) を参照。Stripe のエラーレスポンス設計は非常に精巧である：

```json
{
  "error": {
    "type": "card_error",
    "code": "card_declined",
    "message": "Your card was declined.",
    "param": "number",
    "decline_code": "insufficient_funds",
    "doc_url": "https://stripe.com/docs/error-codes/card-declined"
  }
}
```

**設計のハイライト**：
- `type` でエラータイプを区別：`api_error`、`card_error`、`invalid_request_error`
- `param` で具体的にどのパラメータがエラーかを指し示し、フロントエンドが直接フォームフィールドを特定できる
- `doc_url` でドキュメントリンクを提供し、開発者が詳細を理解できる
- `decline_code` でより細かいエラー原因を提供
:::

::: details JSON:API 仕様
[JSON:API Specification](https://jsonapi.org/format/) を参照。これは業界で広く採用されている JSON API レスポンス仕様である：

```json
{
  "data": {
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "JSON:API 仕様詳解"
    },
    "relationships": {
      "author": {
        "data": { "type": "users", "id": "9" }
      }
    }
  },
  "included": [
    {
      "type": "users",
      "id": "9",
      "attributes": {
        "name": "張三"
      }
    }
  ]
}
```

**核心設計**：
- `data` はプライマリリソースを含み、`type` と `id` が必須
- `attributes` にリソース属性を格納
- `relationships` でリソースの関連を記述
- `included` で重複リクエストを避け、関連データを一度に返す
:::

::: details GitHub REST API レスポンス設計
[GitHub REST API Documentation](https://docs.github.com/en/rest) を参照。GitHub のレスポンス設計は開発者体験を重視している：

**成功レスポンス**：
```json
{
  "id": 1296269,
  "node_id": "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
  "name": "Hello-World",
  "full_name": "octocat/Hello-World",
  "owner": {
    "login": "octocat",
    "id": 1,
    "avatar_url": "https://github.com/images/error/octocat_happy.gif"
  },
  "private": false,
  "html_url": "https://github.com/octocat/Hello-World"
}
```

**エラーレスポンス**：
```json
{
  "message": "Bad credentials",
  "documentation_url": "https://docs.github.com/rest"
}
```

**設計のハイライト**：
- レスポンスには複数の URL 形式（`html_url`、`url`）が含まれ、異なるシーンで使いやすい
- エラーレスポンスには `documentation_url` が含まれ、ドキュメントを指す
- `Link` レスポンスヘッダーでページネーションナビゲーションを実装
:::

::: details Twitter/X API v2 レスポンス設計
[Twitter API v2 Documentation](https://developer.twitter.com/en/docs/twitter-api) を参照。Twitter API v2 はシンプルなレスポンス形式を採用している：

```json
{
  "data": {
    "id": "1460323737035677698",
    "text": "Hello, Twitter!"
  },
  "includes": {
    "users": [
      {
        "id": "2244994945",
        "name": "Twitter Dev",
        "username": "TwitterDev"
      }
    ]
  }
}
```

**設計のハイライト**：
- `data` がメインデータを含み、`includes` が関連データを含む（JSON:API に類似）
- フィールド選択をサポート：`?tweet.fields=created_at,public_metrics`
- ページネーションに `next_token` と `previous_token` を使用
:::

### 7.2 ベストプラクティスまとめ

上記の仕様を総合すると、レスポンス構造設計は以下の原則に従うべきである：

1. **一貫性を最優先**：すべての API で同じレスポンス構造を使用し、フロントエンドがリクエスト層を統一してラップできるようにする
2. **機械可読**：エラーコード + エラー原因（reason）でプログラムが自動処理できる
3. **人間に優しい**：message は明確に記述し、解決策の提案を含める
4. **追跡可能**：request_id がリクエストの全リンクを貫通し、問題の特定を容易にする
5. **国際化対応**：details を通じてローカライズメッセージを拡張

### 7.3 data フィールド設計仕様

`data` はレスポンスの核心であり、その設計はフロントエンドの開発効率に直接影響する。

<DataFieldDesignDemo />

### 7.4 エラーレスポンス設計の応用

<ErrorResponseDesignDemo />

::: tip 参考リンク
- [Google API Design Guide - Errors](https://cloud.google.com/apis/design/errors)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)
- [アリババ Java 開発マニュアル](https://developer.aliyun.com/special/tech-java)
- [Heroku HTTP API Design Guide](https://github.com/interagent/http-api-design)
- [Stripe API - Errors](https://docs.stripe.com/api/errors)
- [JSON:API Specification](https://jsonapi.org/format/)
:::

---

## 8. 実践：EC システム API 設計例

```
# ユーザーモジュール
GET    /v1/users                    # ユーザー一覧の取得
POST   /v1/users                    # 新規ユーザーの作成
GET    /v1/users/{id}               # ユーザー詳細の取得
PUT    /v1/users/{id}               # ユーザーの全量更新
PATCH  /v1/users/{id}               # ユーザーの部分更新
DELETE /v1/users/{id}               # ユーザーの削除

# 注文モジュール
GET    /v1/users/{id}/orders        # 特定ユーザーの注文取得
POST   /v1/orders                   # 注文の作成
GET    /v1/orders/{id}              # 注文詳細の取得
PATCH  /v1/orders/{id}/status       # 注文ステータスの更新

# 商品モジュール（複雑なフィルタはクエリパラメータで）
GET    /v1/products?category=phone&price_max=5000&sort=price_desc&page=1
```

---

## 9. AI を活用した API 設計

AI は仕様に準拠した API 設計を素早く生成するのに役立つ。鍵は明確なコンテキストと制約条件を提供することである。

### 9.1 プロンプトテンプレート

```
あなたはシニアバックエンドアーキテクトで、RESTful API 設計に精通しています。API インターフェースの設計を手伝ってください。

## 業務背景
[あなたの業務シナリオを記述してください。例：ECシステム、ブログプラットフォーム、タスク管理など]

## 機能要件
[必要な機能モジュールを列挙してください。例：
- ユーザー管理：登録、ログイン、個人情報
- 注文管理：注文作成、注文検索、注文キャンセル
- 商品管理：商品一覧、商品詳細、検索]

## 設計要件
1. RESTful 仕様に従う
2. URL は名詞の複数形、小文字+ハイフンを使用
3. HTTP メソッド（GET/POST/PUT/PATCH/DELETE）を正しく使用
4. 統一レスポンス形式：{ code, message, data, request_id }
5. 適切なステータスコードの使用
6. バージョン管理：URL パス方式（/v1/）

## 出力形式
以下の形式で出力してください：

### API 一覧
| メソッド | URL | 説明 | リクエストボディ | レスポンスボディ |
|------|-----|------|--------|--------|

### リクエスト/レスポンス例
[主要 API の詳細な例]

### ステータスコード説明
[使用するステータスコードとその意味]
```

### 9.2 実践例：EC 注文 API

**入力プロンプト：**

```
あなたはシニアバックエンドアーキテクトで、RESTful API 設計に精通しています。EC 注文システムの API インターフェースの設計を手伝ってください。

## 業務背景
B2C EC プラットフォームで、ユーザーは商品を閲覧し、注文し、注文ステータスを確認できます。

## 機能要件
- 注文モジュール：注文作成、注文一覧検索、注文詳細検索、注文キャンセル、注文支払い
- ショッピングカートモジュール：商品追加、数量変更、商品削除、カート確認

## 設計要件
1. RESTful 仕様に従う
2. URL は名詞の複数形、小文字+ハイフンを使用
3. HTTP メソッドを正しく使用
4. 統一レスポンス形式
5. バージョン管理：/v1/
```

**AI 出力例：**

| メソッド | URL | 説明 |
| :--- | :--- | :--- |
| `POST` | `/v1/orders` | 注文作成 |
| `GET` | `/v1/orders` | 注文一覧検索 |
| `GET` | `/v1/orders/{id}` | 注文詳細検索 |
| `PATCH` | `/v1/orders/{id}/status` | 注文ステータス更新（キャンセル/支払い） |
| `GET` | `/v1/users/{id}/cart` | カート取得 |
| `POST` | `/v1/users/{id}/cart/items` | カートに商品追加 |
| `PATCH` | `/v1/users/{id}/cart/items/{itemId}` | カート商品数量変更 |
| `DELETE` | `/v1/users/{id}/cart/items/{itemId}` | カート商品削除 |

### 9.3 AI 支援設計の注意点

| 注意点 | 説明 |
| :--- | :--- |
| **完全なコンテキストを提供** | 業務背景、ユーザーロール、データ関係をすべて明確に伝える |
| **制約条件を明示** | 命名規則、バージョン戦略、レスポンス形式などを事前に定義する |
| **反復最適化** | 最初の出力は完璧でない可能性があるため、詳細を追问し修正を要求する |
| **人手によるレビュー** | AI が生成した内容は業務要件に合致するか人手でチェックする必要がある |
| **エッジケースを補完** | AI にエラーハンドリング、権限制御、ページネーションなどのエッジケースを考慮させる |

::: tip 💡 追问のコツ
- 「各 API のエラーレスポンス例を補足してください」
- 「ページネーション、ソート、フィルタパラメータを考慮してください」
- 「API の権限制御の説明を追加してください」
- 「RESTful ベストプラクティスに準拠しているか確認してください」
:::

---

## 用語早見表

| 用語 | 英語 | 説明 |
| :--- | :--- | :--- |
| **API** | Application Programming Interface | プログラム間の対話の取り決め |
| **REST** | Representational State Transfer | アーキテクチャスタイル、URL でリソースを識別 |
| **リソース** | Resource | REST アーキテクチャの核心概念、一意の識別子（URL）を持つ |
| **冪等性** | Idempotency | 複数回実行しても結果が同じであること |
| **ステータスコード** | Status Code | HTTP プロトコルが定義するレスポンス状態 |
| **バージョン管理** | Versioning | 新旧 API を共存させ、スムーズにアップグレード |
| **リクエストボディ** | Request Body | POST/PUT/PATCH リクエストで送信されるデータ |
| **レスポンスボディ** | Response Body | サーバーが返すデータ |
| **ヘッダー** | Header | リクエスト/レスポンスのメタデータ（Content-Type など） |
| **認証** | Authentication | 「あなたが誰か」を検証する（ログイン、トークン） |
| **認可** | Authorization | 「あなたが何をできるか」を検証する（権限） |