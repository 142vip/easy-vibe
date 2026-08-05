# シリアライズ：データ形式の翻訳と変換


::: tip 🎯 核心問題
**データはどのようにネットワーク上で転送されるのか？** これは「ある人が話した言葉を、どうやって別の人に理解させるか？」と尋ねるようなものです。シリアライズが解決するのは「データ翻訳」の問題です——メモリ上のオブジェクトを転送可能な形式に翻訳すること。
:::

---

## シリアライズデータの必要性

フロントエンドとバックエンドのやり取りにおいて、データはサーバーからクライアントに届くまでに何度も「変形」する必要があります。

**シーン1：フロントエンドが受け取ったデータが「変わった」**

```javascript
// バックエンドが送信
Date birth = new Date(1990, 5, 15)

// フロントエンドが受信
{ "birth": "1990-06-15T00:00:00Z" }  // 文字列！
```

フロントエンドで `.getFullYear()` を使おうとしたら、エラーになった——これは Date オブジェクトではなく、文字列だからです。

**シーン2：中国語の文字化け**

```json
// 期待
{ "name": "田中" }

// 実際に受信
{ "name": "å¼ ä¸" }
```

文字エンコーディングの問題で中国語が文字化けしました。

**シーン3：パフォーマンスのボトルネック**

```json
// 10000件の商品リストを含むレスポンス
{
  "products": [
    { "id": 1, "name": "...", "description": "...", ... },
    // ... 9999 more
  ]
}
// サイズ：5.2 MB、転送時間：3.5 秒
```

JSON 形式の冗長性によりデータパケットが大きすぎ、パフォーマンスに深刻な影響を与えます。

---

**シリアライズは「翻訳」のようなもの**——メモリオブジェクトを転送可能な形式に「翻訳」し、受信側が「翻訳し直す」。

---

## 1. シリアライズ/デシリアライズの概要

**シリアライズ**（Serialization）とは、オブジェクトを転送可能な形式に変換するプロセスです。

**デシリアライズ**（Deserialization）とは、転送形式をオブジェクトに戻すプロセスです。

### 1.1 宅配便に例える

| 宅配便 | シリアライズ | 説明 |
| :--- | :--- | :--- |
| 荷物を梱包 | シリアライズ | 物品を箱に入れ、ラベルを貼る |
| 輸送 | ネットワーク転送 | 配送車で目的地まで運ぶ |
| 開梱して取り出す | デシリアライズ | 受取人が箱を開け、物品を取り出す |

### 1.2 なぜシリアライズが必要か

| 理由 | 説明 | 例 |
| :--- | :--- | :--- |
| **ネットワーク転送** | ネットワークはバイトストリームしか転送できない | API 呼び出し、RPC 通信 |
| **永続化保存** | ディスクはバイトしか保存できない | オブジェクトをファイル、データベースに保存 |
| **言語間連携** | 異なる言語のデータ構造が異なる | Java オブジェクト → Python 辞書 |
| **分散キャッシュ** | Redis/Memcached はバイトを保存 | ユーザー情報のキャッシュ |

---

## 2. 一般的なシリアライズ形式

👇 **実際に試してみよう**：下のボタンをクリックして、異なる言語のシリアライズプロセスを観察してください：

<SerializationDemo />

### 2.1 JSON：最も汎用的

**長所**：
- 可読性が高く、デバッグが容易
- すべての言語がサポート
- ブラウザがネイティブサポート（`JSON.parse` / `JSON.stringify`）

**短所**：
- サイズが大きい（大量の `{}` `""` マークがある）
- 豊富なデータ型をサポートしない（Date、Map、Set は文字列に変換される）

**適したシーン**：
- 公開 API
- フロントエンド・バックエンド通信
- 設定ファイル

### 2.2 XML：かつての主流

```xml
<?xml version="1.0" encoding="UTF-8"?>
<user>
  <id>123</id>
  <name>田中</name>
  <email>tanaka@example.com</email>
  <age>28</age>
</user>
```

**長所**：
- 構造が明確、コメントをサポート
- 複雑なネスト構造をサポート
- Schema 検証（XSD）がある

**短所**：
- サイズが大きく、解析が遅い
- タグが冗長（`<open></close>`）

**適したシーン**：
- 設定ファイル（Spring、MyBatis）
- SOAP プロトコル
- 複雑なデータ交換

### 2.3 Protobuf：最も効率的

```protobuf
// user.proto
syntax = "proto3";
message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
  int32 age = 4;
}
```

**長所**：
- サイズが小さい（JSON より 30-50% 小さい）
- 速度が速い（解析速度が 5-10 倍速い）
- 後方互換性（新しいフィールドを追加しても古いバージョンに影響しない）

**短所**：
- 可読性がない（バイナリ形式）
- .proto ファイルの定義が必要
- 動的型をサポートしない

**適したシーン**：
- マイクロサービス内部通信
- 高性能シーン（ゲーム、リアルタイム通信）
- モバイルアプリ（トラフィック節約）

### 2.4 MessagePack：可読性とパフォーマンスの両立

```json
// MessagePack は JSON のバイナリバージョン
// 同じデータで、MessagePack は JSON より約 30% 小さい
```

**長所**：
- JSON より小さく、JSON より速い
- JSON のデータモデルを保持
- すべての JSON 型をサポート

**短所**：
- 可読性がない
- Protobuf ほど効率的ではない

**適したシーン**：
- パフォーマンスが必要だが Protobuf を使いたくない場合
- Redis キャッシュ
- WebSocket メッセージ

---

## 3. 各言語のシリアライズ方式比較

| 言語 | JSON ライブラリ | Protobuf ライブラリ | XML ライブラリ |
| :--- | :--- | :--- | :--- |
| **JavaScript** | `JSON.stringify()` | `protobuf.js` | `fast-xml-parser` |
| **Python** | `json.dumps()` | `protobuf` | `xmltodict` |
| **Java** | `Jackson` / `Gson` | `protobuf-java` | `JAXB` |
| **Go** | `encoding/json` | `proto` | `encoding/xml` |
| **C++** | `nlohmann/json` | `protobuf` | `tinyxml2` |
| **C#** | `System.Text.Json` | `Google.Protobuf` | `System.Xml` |

::: tip 💡 選択アドバイス
- **フロントエンド・バックエンド通信**：JSON（デバッグが容易）
- **マイクロサービス内部**：Protobuf（パフォーマンス最適）
- **設定ファイル**：JSON または YAML
- **レガシーシステム連携**：XML（選択肢がない場合も）
:::

---

## 4. パフォーマンス比較

### 4.1 サイズ比較（ユーザーオブジェクトを例に）

| 形式 | サイズ | JSON 比 |
| :--- | :--- | :--- |
| JSON | 68 bytes | 100% |
| XML | 142 bytes | 209% |
| Protobuf | 38 bytes | 56% |
| MessagePack | 52 bytes | 76% |

### 4.2 速度比較（10000 回シリアライズ）

| 形式 | 所要時間 | JSON 比 |
| :--- | :--- | :--- |
| JSON | 45 ms | 100% |
| XML | 120 ms | 267% |
| Protobuf | 8 ms | 18% |
| MessagePack | 28 ms | 62% |

::: tip 💡 パフォーマンステストの結論
- **Protobuf が最速**：高性能シーンに最適
- **MessagePack が次点**：JSON より約 40% 速い
- **JSON が最も遅い**：しかしほとんどのシーンで十分
:::

---

## 5. よくある問題

### 5.1 日付シリアライズ問題

**問題**：Date オブジェクトがシリアライズ後に文字列になる

```javascript
// シリアライズ前
const date = new Date('2024-01-01')

// シリアライズ後
JSON.stringify(date)  // "2024-01-01T00:00:00.000Z"
```

**解決策**：
```javascript
// 案1：タイムスタンプに変換
{ createdAt: date.getTime() }  // 1704067200000

// 案2：ISO 文字列に変換
{ createdAt: date.toISOString() }  // "2024-01-01T00:00:00.000Z"

// 案3：カスタムシリアライズ
JSON.stringify(obj, (key, value) => {
  if (value instanceof Date) {
    return { __type: 'Date', value: value.toISOString() }
  }
  return value
})
```

### 5.2 循環参照問題

**問題**：オブジェクトの循環参照がエラーになる

```javascript
const obj = { name: 'test' }
obj.self = obj
JSON.stringify(obj)  // TypeError: Converting circular structure to JSON
```

**解決策**：
```javascript
// 案1：循環参照をフィルタリング
const seen = new WeakSet()
JSON.stringify(obj, (key, value) => {
  if (typeof value === 'object' && value !== null) {
    if (seen.has(value)) return
    seen.add(value)
  }
  return value
})

// 案2：flatted ライブラリを使用
import { parse, stringify } from 'flatted'
stringify(obj)  // 循環参照を自動処理
```

### 5.3 中国語文字化け問題

**問題**：中国語がシリアライズ後に文字化け

**原因**：
- 文字エンコーディングの不一致（UTF-8 vs GBK）
- BOM マーク

**解決策**：
```python
# Python で UTF-8 の使用を確保
import json
json.dumps(data, ensure_ascii=False)  # 中国語をエスケープしない
```

```javascript
// Node.js でレスポンスヘッダーを設定
res.setHeader('Content-Type', 'application/json; charset=utf-8')
```

---

## 6. 実践：EC システムのシリアライズ方式

### 6.1 シーン分析

| シーン | 形式選択 | 理由 |
| :--- | :--- | :--- |
| **アプリ → バックエンド API** | JSON | デバッグが容易、フロントエンドとバックエンドで統一 |
| **バックエンド → バックエンド RPC** | Protobuf | パフォーマンス最適、トラフィック節約 |
| **Redis キャッシュ** | MessagePack | JSON より小さく、複雑なオブジェクトをシリアライズ可能 |
| **ログ記録** | JSON | ログ分析ツールでの解析が容易 |

### 6.2 コード例

```javascript
// API レスポンス（JSON）
app.get('/api/products/:id', async (req, res) => {
  const product = await db.getProduct(req.params.id)
  res.json({
    code: 0,
    data: product
  })
})

// マイクロサービス通信（Protobuf）
// product.proto
syntax = "proto3";
message Product {
  int32 id = 1;
  string name = 2;
  int32 price = 3;
}

// サーバー
const proto = require('./product.proto')
const message = proto.Product.create(product)
const buffer = proto.Product.encode(message).finish()

// クライアント
const decoded = proto.Product.decode(buffer)

// Redis キャッシュ（MessagePack）
const msgpack = require('msgpack-lite')
await redis.set(
  `product:${id}`,
  msgpack.encode(product)
)
const cached = msgpack.decode(await redis.get(`product:${id}`))
```

---

## 7. AI を活用したシリアライズ方式の選択

AI はシーンに応じて適切なシリアライズ形式を選択するのに役立ちます。

### 7.1 プロンプトテンプレート

```
あなたは経験豊富なシステムアーキテクトで、データシリアライズ技術に精通しています。適切なシリアライズ方式の選択を手伝ってください。

## ビジネスシーン
[あなたのシーンを説明してください。例：EC アプリ、ゲームバックエンド、マイクロサービスなど]

## 技術要件
[制約条件を列挙してください。例：
- フロントエンド・バックエンド分離（Vue + Node.js）
- 高いパフォーマンス要件（QPS > 10000）
- トラフィック重視（モバイル端末、トラフィック節約が必要）
- 言語間連携が必要（Java + Python + Go）]

## データ特性
[データの特徴を説明してください。例：
- データ量が多い（単一レスポンス > 1MB）
- 構造が複雑（多層ネスト）
- 日付、バイナリデータなどの特殊な型を含む]

## 出力形式
以下の形式で出力してください：
1. 推奨ソリューション（JSON/Protobuf/MessagePack/XML）
2. 理由の説明
3. パフォーマンス比較（サイズと速度の推定）
4. コード例
```

### 7.2 実践例

**入力プロンプト**：

```
あなたは経験豊富なシステムアーキテクトです。当社の EC アプリの商品リストインターフェースのパフォーマンスを最適化する必要があります。

## ビジネスシーン
- EC アプリの商品リストインターフェース
- 1回のレスポンスで 100 件の商品を返す
- 各商品は id, name, price, image, description など 20 個のフィールドを含む
- 現在 JSON を使用中、レスポンスサイズ約 200KB、所要時間 800ms

## 技術要件
- フロントエンドは Vue.js
- バックエンドは Node.js + Go マイクロサービス
- パフォーマンスと開発効率の両立が必要

## 最適化目標
- 応答時間を 300ms 以内に
- データパケットサイズを 30% 削減
```

**AI 出力**：

```
推奨ソリューション：ハイブリッド方式

1. **API 層**：JSON を継続使用（フロントエンドに優しい）
2. **マイクロサービス通信**：Protobuf に切り替え（パフォーマンス向上）
3. **静的データ**：gzip 圧縮を有効化

### 理由の説明
- JSON はフロントエンドに最も優しく、追加の解析が不要
- バックエンドマイクロサービスで Protobuf を使用すると、データ量を 40% 削減可能
- gzip 圧縮はテキストに対して効果が顕著（JSON は 70% 圧縮可能）

### パフォーマンス比較
| 方式 | サイズ | 所要時間 |
|------|------|------|
| 現在 (JSON) | 200 KB | 800 ms |
| + gzip | 60 KB | 350 ms |
| + Protobuf | 50 KB | 280 ms |

### コード例
[具体的な実装コード...]
```

---

## 用語早見表

| 用語 | 英語 | 説明 |
| :--- | :--- | :--- |
| **シリアライズ** | Serialization | オブジェクト → バイトストリーム |
| **デシリアライズ** | Deserialization | バイトストリーム → オブジェクト |
| **JSON** | JavaScript Object Notation | 最もよく使われるテキスト形式 |
| **XML** | Extensible Markup Language | マークアップ言語、かつて主流 |
| **Protobuf** | Protocol Buffers | Google オープンソースの高効率形式 |
| **MessagePack** | - | JSON のバイナリバージョン |
| **エンコード** | Encoding | 文字 → バイト |
| **デコード** | Decoding | バイト → 文字 |