# 並行処理：プロセス・スレッド・コルーチンの比較

> 💡 **学習ガイド**：並行プログラミングは多くのバックエンドエンジニアにとって「アキレス腱」です——面接で詰まる、本番環境でバグる、パフォーマンスチューニングの糸口が見つからない。本章では、一つの核心的な問いを中心に展開します：**10万人のユーザーが同時にあなたのサービスにリクエストを送ったとき、あなたのコードはクラッシュしますか？**

始める前に、まず以下の「基礎ブロック」を補強することをお勧めします：

- **CPU、メモリ、I/O とは何か**：これらの基本概念が曖昧な場合は、まずオペレーティングシステムの基礎知識を復習してください。
- **ブロッキング/ノンブロッキングとは**：同期/非同期の概念にまだ慣れていない場合は、実際のプログラミング体験を通じて感覚を掴んでみてください。

---

## 0. はじめに：なぜあなたのサービスはピーク時に「フリーズ」するのか

<ProcessThreadCoroutineDemo />

多くの人が実際の開発で似たような状況に遭遇します：

- ローカルテストでは応答が速いのに、本番環境にデプロイすると「PPTのようにカクカク」になる；
- 明らかに高性能なサーバーを購入したのに、CPU使用率が一向に上がらない；
- セールのピーク時になると、サービスが「雪崩」を起こし、デグレードやサーキットブレーカーを余儀なくされる。

直感的には、「**サーバーが十分に強力ではない**」と考えがちです。
しかし多くの場合、問題はハードウェアが「十分に速くない」ことではなく、**並行モデルを適切に設計していない**ことにあります。

**核心的な矛盾**：
- 並行処理しない場合：ユーザーリクエストが順番待ちになり、体験が極めて悪い；
- マルチスレッドを乱用する場合：ロック競合やコンテキストスイッチのオーバーヘッドにより、パフォーマンスがかえって低下する。

これらの課題に直面すると、単純に「マシンを追加する」だけでは対応しきれません。高並行シナリオでパフォーマンスを確保しつつ、安定性も保証する体系的な並行設計手法が必要です。これこそが本章で解決しようとする問題です。

---

## 1. 核心概念：プロセス、スレッド、コルーチン、結局何が違うのか

### 1.1 レストランに例えると

あなたがレストランを経営していて、多くの顧客に同時にサービスを提供する必要があると想像してください：

| 概念 | レストランの例え | 技術的な意味 |
| :--- | :--- | :--- |
| **プロセス (Process)** | **独立したレストランの支店** | 独立したメモリ空間とリソース割り当てを持ち、OSのリソース割り当ての基本単位。一つのプロセスがクラッシュしても他のプロセスには影響しない。 |
| **スレッド (Thread)** | **支店内のシェフ** | CPUスケジューリングの基本単位で、プロセス内のメモリ空間を共有する。同一プロセス内のスレッドはデータを共有できるが、一つのスレッドのクラッシュがプロセス全体のクラッシュを引き起こす可能性がある。 |
| **コルーチン (Coroutine)** | **シェフの「分身術」** | ユーザー空間の軽量スレッドで、OSではなくプログラム自身がスケジューリングする。切り替えオーバーヘッドが極めて小さく、数百万個作成できる。 |

### 1.2 詳細比較：三者の本質的な違い

<ProcessIsolationDemo />

#### プロセス：リソース分離の「コンテナ」

**核心的特徴**：
- **強い分離性**：各プロセスは独立した仮想アドレス空間を持つ
- **大きなオーバーヘッド**：作成/切り替えにOSの介入が必要で、約1〜10msかかる
- **複雑な通信**：プロセス間通信(IPC)には特別な機構（パイプ、メッセージキュー、共有メモリなど）が必要

**適用シーン**：
- 強力な分離が必要なサービス（ブラウザのタブ、サンドボックスプログラムなど）
- 複数言語を混在デプロイするサービス
- 独立した再起動/アップグレードが必要なサービスユニット

#### スレッド：共有メモリの「軽騎兵」

<ThreadSchedulingDemo />

**核心的特徴**：
- **共有メモリ**：同一プロセス内のスレッドはコードセグメント、データセグメント、ヒープを共有
- **独立したスタック空間**：各スレッドは独自のスタック（通常約1MB）を持つ
- **高速な切り替え**：スレッド切り替えは約1〜10μsで、プロセスより1000倍速い
- **同期が必要**：共有データはロックによる保護が必要

**適用シーン**：
- CPUバウンドなタスク（計算、画像処理）
- 大量のデータを共有する必要がある並行タスク
- レイテンシに敏感なバックグラウンドタスク

#### コルーチン：ユーザー空間の「グリーンスレッド」

<CoroutineLightweightDemo />

**核心的特徴**：
- **ユーザー空間スケジューリング**：プログラム/ランタイムライブラリがスケジューリングし、OSを経由しない
- **極めて軽量**：コルーチンスタックは通常数KBで、数百万個作成可能
- **極めて高速な切り替え**：コルーチン切り替えは約100nsで、スレッドより100倍速い
- **非プリエンプティブ**：コルーチンが自発的にCPUを譲る（協調的マルチタスク）

**適用シーン**：
- I/Oバウンドな高並行サービス（Webサーバー、ゲートウェイ）
- 大量の長期間接続を維持する必要があるシーン（IM、ゲームサーバー）
- ストリーミングデータ処理、パイプライン処理

---

## 2. ケーススタディ：あるECサイトのセールで起きた「並行処理の苦悩」

### 2.1 血と涙の教訓：「単一マシン」から「分散」への進化

実際のECシステムの進化ストーリーを見てみましょう：

#### フェーズ1：単一マシン時代（DAU 1,000）

```python
# シンプルな Flask アプリケーション
from flask import Flask

app = Flask(__name__)

@app.route('/order')
def create_order():
    # 在庫照会
    stock = db.query("SELECT stock FROM products WHERE id=1")
    if stock > 0:
        # 在庫減算
        db.execute("UPDATE products SET stock = stock - 1 WHERE id=1")
        # 注文作成
        db.execute("INSERT INTO orders ...")
        return "Order created!"
    return "Out of stock!"

# 起動：flask run
```

**問題点**：
- シングルプロセス・シングルスレッドで、一度に一つのリクエストしか処理できない
- 在庫減算にロックがなく、並行時に過剰販売が発生する
- データベース接続数に制限があり、接続プールがすぐに枯渇する

#### フェーズ2：マルチプロセス時代（DAU 1万）

```python
# Gunicorn マルチプロセスデプロイ
gunicorn -w 4 -k sync app:app

# 4つのワーカープロセス、各プロセスが独立してリクエストを処理
```

**新たな問題**：
- 4つのプロセスが同時に在庫を照会し、すべて stock=1 を確認し、すべて減算に成功、3つの過剰販売が発生！
- 分散ロックの導入が必要

```python
import redis

# Redis 分散ロックを使用
lock = redis_client.lock("stock_lock", timeout=10)
if lock.acquire():
    try:
        stock = db.query("SELECT stock FROM products WHERE id=1")
        if stock > 0:
            db.execute("UPDATE products SET stock = stock - 1 WHERE id=1")
    finally:
        lock.release()
```

#### フェーズ3：コルーチン時代（DAU 10万）

```python
# FastAPI + asyncio を使用
from fastapi import FastAPI
import asyncio

app = FastAPI()

async def check_stock(product_id: int) -> int:
    # 非同期でデータベースを照会、ブロッキングしない
    result = await db.fetch_one(
        "SELECT stock FROM products WHERE id = :id",
        {"id": product_id}
    )
    return result["stock"]

@app.get("/order")
async def create_order(product_id: int):
    # 在庫チェックとユーザー情報を並行取得
    stock_task = check_stock(product_id)
    user_task = get_user_info(request.user_id)

    stock, user = await asyncio.gather(stock_task, user_task)

    if stock > 0:
        # 非同期で在庫減算
        await db.execute(
            "UPDATE products SET stock = stock - 1 WHERE id = :id",
            {"id": product_id}
        )
        return {"status": "success"}

    return {"status": "out_of_stock"}

# 起動：uvicorn main:app --workers 4
# 各ワーカー内で数千の並行コルーチンを処理可能
```

**利点**：
- シングルスレッド内で数千の並行接続を処理可能
- I/O操作時に自発的にCPUを譲り、他のリクエストをブロッキングしない
- メモリ使用量が極めて低く、高並行・長期間接続のシーンに適している

### 2.2 並行モデル進化の比較表

| フェーズ | 並行モデル | サポートDAU | 核心的問題 | 解決策 |
| :--- | :--- | :--- | :--- | :--- |
| **モノリス** | シングルプロセス・シングルスレッド | 1K | 並行処理不可 | マルチプロセス導入 |
| **マルチプロセス** | マルチプロセス同期 | 10K | データ競合、過剰販売 | 分散ロック |
| **マルチスレッド** | マルチスレッド+ロック | 50K | コンテキストスイッチオーバーヘッド、デッドロック | スレッドプール、ロックフリーキュー |
| **コルーチン** | 非同期 I/O | 100K+ | コードの複雑さ、デバッグ困難 | フレームワークによるカプセル化、分散トレーシング |
| **ハイブリッド** | マルチプロセス+コルーチン | 1000K+ | アーキテクチャの複雑さ | サービスガバナンス、エラスティックスケーリング |

---

## 3. 原理の深掘り：各種並行モデルの動作原理

### 3.1 プロセスモデル：分離性と通信

#### メモリ分離機構

<ProcessIsolationDemo />

各プロセスは独立した仮想アドレス空間を持ちます：

```
プロセスAの仮想メモリ           プロセスBの仮想メモリ
+----------------+        +----------------+
|  カーネル空間   |        |  カーネル空間   |  <-- 共有（読み取り専用）
|  (共有)        |        |  (共有)        |
+----------------+        +----------------+
|  スタック空間   |        |  スタック空間   |  <-- 独立
|  (下方向に成長) |        |  (下方向に成長) |
+----------------+        +----------------+
|  ヒープ空間     |        |  ヒープ空間     |  <-- 独立
|  (上方向に成長) |        |  (上方向に成長) |
+----------------+        +----------------+
|  データセグメント|        |  データセグメント|  <-- 独立
|  (.bss/.data)  |        |  (.bss/.data)  |
+----------------+        +----------------+
|  コードセグメント|        |  コードセグメント|  <-- 独立
|  (.text)       |        |  (.text)       |
+----------------+        +----------------+
```

#### プロセス間通信(IPC)方式

| 方式 | 原理 | 速度 | 適用シーン |
| :--- | :--- | :--- | :--- |
| **パイプ (Pipe)** | カーネルバッファ、単方向ストリーム | 中程度 | 親子プロセス間通信 |
| **メッセージキュー** | カーネルメッセージリンクリスト | 中程度 | 非同期メッセージ伝達 |
| **共有メモリ** | 同一物理メモリをマッピング | 最速 | 大量データ共有 |
| **セマフォ** | カーネルカウンタ | - | 同期と排他制御 |
| **ソケット** | ネットワークプロトコルスタック | やや遅い | クロスマシン通信 |
| **シグナル (Signal)** | ソフトウェア割り込み | - | イベント通知 |

### 3.2 スレッドモデル：スケジューリングと同期

#### スレッドスケジューリングの原理

<ThreadSchedulingDemo />

OSのスレッドスケジューラの基本的な動作：

```
実行可能キュー                 実行中                    待機キュー
+--------+                +--------+               +--------+
| スレッドB |  <-- タイムスライス切れ | スレッドA |  <-- I/O要求  | スレッドC |
| スレッドD |                | (実行中) |               | スレッドE |
| スレッドF |                +--------+               | (ブロック) |
+--------+                                         +--------+
    |                                                  |
    v                                                  v
スケジューラが優先度に基づいて次を選択      I/O完了時に実行可能キューに戻す
```

#### 一般的なスレッド同期機構

| 機構 | 原理 | 利点 | 欠点 |
| :--- | :--- | :--- | :--- |
| **ミューテックス (Mutex)** | 二値状態、排他アクセス | 実装が簡単 | 競合が激しいと性能が悪い |
| **読み書きロック (RWLock)** | 読み共有、書き排他 | 読みが多いシーンで効率的 | 実装が複雑、書き込み飢餓のリスク |
| **スピンロック (Spinlock)** | ビジーウェイト、CPUを解放しない | 待ち時間が短い場合に効率的 | 待ち時間が長いとCPUを浪費 |
| **条件変数** | 特定条件の成立を待機 | ビジーウェイトを回避 | ロックとの併用が必要 |
| **セマフォ (Semaphore)** | カウンタでアクセス数を制御 | 並行数を制御可能 | 使い方を誤るとエラーになりやすい |
| **アトミック操作** | CPU命令レベルの原子性 | ロックフリー、最高性能 | 単純なデータ型のみ操作可能 |
| **ロックフリーキュー** | CAS操作で実装 | 高並行下で優れた性能 | 実装が複雑、ABA問題 |

### 3.3 コルーチンモデル：ユーザー空間スケジューリング

<CoroutineLightweightDemo />

#### コルーチンの核心的利点

```
従来のマルチスレッド              vs              コルーチンモデル

+------------+                       +------------+
|  スレッド1  |                       |  イベントループ |
| (1MBスタック)|                       |  (スケジューラ) |
+------------+                       +------------+
     |                                     |
     v                                     v
+------------+                       +------------+
|  スレッド2  |                       |  コルーチンA  |
| (1MBスタック)|                       | (数KBスタック) |
+------------+                       +------------+
     |                                     |
     v                                     v
+------------+                       +------------+
|  スレッド3  |                       |  コルーチンB  |
| (1MBスタック)|                       | (数KBスタック) |
+------------+                       +------------+

オーバーヘッド：N MB               オーバーヘッド：N KB
作成：〜10μs                       作成：〜100ns
切り替え：〜1μs                    切り替え：〜100ns
```

#### async/await の動作機構

<AsyncAwaitDemo />

```python
import asyncio

async def fetch_data(url):
    # await に遭遇すると、コルーチンはサスペンドされ、CPUを譲る
    response = await aiohttp.get(url)
    # I/O 完了後、イベントループがコルーチンを起こし、ここから実行を再開
    return response.json()

async def main():
    # 3つのコルーチンタスクを作成
    tasks = [
        fetch_data("https://api1.example.com"),
        fetch_data("https://api2.example.com"),
        fetch_data("https://api3.example.com")
    ]
    # 並行実行、合計時間 ≒ 最も遅いリクエスト
    results = await asyncio.gather(*tasks)
    return results

# イベントループを起動
asyncio.run(main())
```

**実行フロー**：

```
タイムライン ---------------------------------------------------------------->

コルーチンA: [リクエスト準備]--[await サスペンド]=======[レスポンス受信]--[データ処理]
                     |
コルーチンB:          [リクエスト準備]--[await サスペンド]=======[レスポンス受信]--[データ処理]
                                  |
コルーチンC:                       [リクエスト準備]--[await サスペンド]=======[レスポンス受信]
                                               |
                                               ↓
                                         すべてのI/O完了

凡例：[ ] はCPU実行, === はI/O待機, | はコルーチン切り替え
```

### 3.4 イベントループ：コルーチンの「心臓」

<EventLoopDemo />

イベントループはコルーチンスケジューリングの核心的な機構です：

```python
import selectors
import heapq

class EventLoop:
    def __init__(self):
        self.selector = selectors.DefaultSelector()
        self.ready = []  # 実行可能キュー
        self.scheduled = []  # タイマータスクキュー
        self.current = None

    def run(self):
        while True:
            # 1. タイマータスクを処理
            now = time.time()
            while self.scheduled and self.scheduled[0][0] <= now:
                _, callback = heapq.heappop(self.scheduled)
                self.ready.append(callback)

            # 2. I/O イベントを待機
            timeout = 0 if self.ready else 0.1
            events = self.selector.select(timeout)

            for key, mask in events:
                callback = key.data
                self.ready.append(callback)

            # 3. 実行可能なコールバックを実行
            while self.ready:
                callback = self.ready.popleft()
                callback()
```

### 3.5 並行 vs 並列：同じものではない

<ConcurrentVsParallelDemo />

| 概念 | 英語 | 意味 | 例え | 必要な条件 |
| :--- | :--- | :--- | :--- | :--- |
| **並行** | Concurrency | 複数のタスクが交互に実行され、マクロ的に同時に進行 | 一人で複数の料理を順番に作る | シングルコアCPUで十分 |
| **並列** | Parallelism | 複数のタスクが真に同時に実行される | 複数人で同時に異なる料理を作る | マルチコアCPUまたは複数マシン |

**図解**：

```
シングルコアCPU - 並行（Concurrent）
時間 →  1    2    3    4    5    6    7    8
タスクA: [実行][実行]      [実行][実行]
タスクB:      [実行][実行]      [実行][実行]

二つのタスクが交互に実行され、マクロ的に「同時」に進行

========================================

マルチコアCPU - 並列（Parallel）
時間 →  1    2    3    4    5    6    7    8
コア1: [タスクA][タスクA][タスクA][タスクA]
コア2: [タスクB][タスクB][タスクB][タスクB]

二つのタスクが真に「同時」に実行

========================================

現実には往々にして：並行 + 並列
時間 →  1    2    3    4    5    6    7    8
コア1: [A1][A1][B1][B1][C1][C1][D1][D1]
コア2: [A2][A2][B2][B2][C2][C2][D2][D2]

複数のタスクがまず並行で異なるコアにスケジューリングされ、その後コア上で並列実行される
```

---

## 4. 実践：Go コルーチンとグリーンスレッド

### 4.1 Go の並行哲学

<GoroutineGreenThreadDemo />

Go 言語の並行設計哲学：**共有メモリで通信するのではなく、通信で共有メモリを実現せよ**。

```go
package main

import (
    "fmt"
    "time"
)

// プロデューサー
func producer(ch chan<- int, id int) {
    for i := 0; i < 5; i++ {
        fmt.Printf("Producer %d sending: %d\n", id, i)
        ch <- i  // チャネルにデータを送信
        time.Sleep(100 * time.Millisecond)
    }
}

// コンシューマー
func consumer(ch <-chan int, id int) {
    for val := range ch {  // チャネルからデータを受信
        fmt.Printf("Consumer %d received: %d\n", id, val)
    }
}

func main() {
    // バッファ付きチャネルを作成
    ch := make(chan int, 10)

    // 2つのプロデューサー goroutine を起動
    for i := 0; i < 2; i++ {
        go producer(ch, i)
    }

    // 2つのコンシューマー goroutine を起動
    for i := 0; i < 2; i++ {
        go consumer(ch, i)
    }

    // しばらく待機
    time.Sleep(3 * time.Second)
    close(ch)
}
```

### 4.2 Goroutine スケジューラ：GMP モデル

Go のスケジューラは GMP モデルを採用しています：

| コンポーネント | 意味 | 役割 |
| :--- | :--- | :--- |
| **G (Goroutine)** | コルーチン | 実行待ちのタスク、軽量（2KBスタック、動的伸縮可能） |
| **M (Machine)** | システムスレッド | G を実際に実行する担い手、カーネルスレッドと1:1対応 |
| **P (Processor)** | 論理プロセッサ | スケジューリングコンテキスト、実行可能な G キューを含み、数はデフォルトでCPUコア数と等しい |

**スケジューリングフロー**：

```
グローバルキュー
+----------------+
|  G1  |  G2  |  G3  |
+----------------+

P0 のローカルキュー    P1 のローカルキュー    P2 のローカルキュー    P3 のローカルキュー
+----------+       +----------+       +----------+       +----------+
| G4 | G5  |       | G6 | G7  |       | G8 | G9  |       | G10| G11 |
+----------+       +----------+       +----------+       +----------+
    |                     |                     |                     |
    v                     v                     v                     v
+----------+       +----------+       +----------+       +----------+
|    M0    |       |    M1    |       |    M2    |       |    M3    |
| (OSスレッド)|       | (OSスレッド)|       | (OSスレッド)|       | (OSスレッド)|
+----------+       +----------+       +----------+       +----------+

スケジューリング戦略：
1. 各 P はローカル G キューを維持し、ロック競合を低減
2. P はローカルキューから G を取得し M に渡して実行
3. ローカルキューが空の場合、他の P から半分の G を「盗む」（Work Stealing）
4. グローバルキューは最終手段として、定期的にチェック
```

---

## 5. 実践コードテンプレート

### 5.1 Python asyncio 高並行テンプレート

```python
import asyncio
import aiohttp
from typing import List, Dict
import time

class AsyncHTTPClient:
    """asyncio ベースの高性能 HTTP クライアント"""

    def __init__(self, max_connections: int = 100, timeout: int = 30):
        self.timeout = aiohttp.ClientTimeout(total=timeout)
        # 並行接続数を制限し、相手のサービスを過負荷にしない
        connector = aiohttp.TCPConnector(
            limit=max_connections,
            limit_per_host=10,  # 単一ドメインあたりの接続制限
            enable_cleanup_closed=True,
            force_close=True,
        )
        self.session = aiohttp.ClientSession(
            connector=connector,
            timeout=self.timeout,
        )

    async def fetch(self, url: str, method: str = 'GET', **kwargs) -> Dict:
        """単一リクエストを送信"""
        try:
            async with self.session.request(method, url, **kwargs) as response:
                return {
                    'url': url,
                    'status': response.status,
                    'data': await response.text(),
                    'error': None
                }
        except asyncio.TimeoutError:
            return {'url': url, 'status': None, 'data': None, 'error': 'Timeout'}
        except Exception as e:
            return {'url': url, 'status': None, 'data': None, 'error': str(e)}

    async def fetch_many(self, urls: List[str], concurrency: int = 10) -> List[Dict]:
        """複数のURLを並行取得、並行数を制限"""
        semaphore = asyncio.Semaphore(concurrency)

        async def fetch_with_limit(url):
            async with semaphore:
                return await self.fetch(url)

        # すべてのリクエストを並行実行
        tasks = [fetch_with_limit(url) for url in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)

    async def close(self):
        await self.session.close()


# 使用例
async def main():
    client = AsyncHTTPClient(max_connections=50)

    # 取得するURLリスト
    urls = [
        "https://api.github.com/users/github",
        "https://api.github.com/users/google",
        "https://api.github.com/users/microsoft",
        # ... さらにURL
    ] * 10  # 300リクエストをシミュレート

    start = time.time()
    results = await client.fetch_many(urls, concurrency=20)
    elapsed = time.time() - start

    # 結果を集計
    success = sum(1 for r in results if r.get('status') == 200)
    failed = len(results) - success

    print(f"総リクエスト数: {len(results)}")
    print(f"成功: {success}, 失敗: {failed}")
    print(f"所要時間: {elapsed:.2f}s")
    print(f"QPS: {len(results)/elapsed:.1f}")

    await client.close()

if __name__ == "__main__":
    asyncio.run(main())
```

### 5.2 Go 高並行サービステンプレート

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"runtime"
	"time"

	"golang.org/x/sync/errgroup"
)

// Request/Response 構造体
type OrderRequest struct {
	UserID    int64   `json:"user_id"`
	ProductID int64   `json:"product_id"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
}

type OrderResponse struct {
	OrderID   int64   `json:"order_id"`
	Status    string  `json:"status"`
	Total     float64 `json:"total"`
	CreatedAt string  `json:"created_at"`
}

// データベース操作をシミュレート
type Database struct {
	orders map[int64]*OrderResponse
	mutex  chan struct{}
}

func NewDatabase() *Database {
	db := &Database{
		orders: make(map[int64]*OrderResponse),
		mutex:  make(chan struct{}, 1), // ミューテックスをシミュレート
	}
	return db
}

func (db *Database) CreateOrder(ctx context.Context, req *OrderRequest) (*OrderResponse, error) {
	// ロックを取得
	select {
	case db.mutex <- struct{}{}:
		defer func() { <-db.mutex }()
	case <-ctx.Done():
		return nil, ctx.Err()
	}

	// データベース操作の遅延をシミュレート
	select {
	case <-time.After(50 * time.Millisecond):
	case <-ctx.Done():
		return nil, ctx.Err()
	}

	order := &OrderResponse{
		OrderID:   time.Now().UnixNano(),
		Status:    "created",
		Total:     req.Price * float64(req.Quantity),
		CreatedAt: time.Now().Format(time.RFC3339),
	}
	db.orders[order.OrderID] = order
	return order, nil
}

// HTTP ハンドラ
type Handler struct {
	db *Database
}

func NewHandler(db *Database) *Handler {
	return &Handler{db: db}
}

func (h *Handler) CreateOrder(w http.ResponseWriter, r *http.Request) {
	// リクエストタイムアウトを設定
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()

	var req OrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	order, err := h.db.CreateOrder(ctx, &req)
	if err != nil {
		if err == context.DeadlineExceeded {
			http.Error(w, "Request timeout", http.StatusGatewayTimeout)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(order)
}

func (h *Handler) Health(w http.ResponseWriter, r *http.Request) {
	info := map[string]interface{}{
		"status":    "ok",
		"goroutine": runtime.NumGoroutine(),
		"cpu":       runtime.NumCPU(),
		"version":   runtime.Version(),
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(info)
}

// バッチ処理の例
func BatchProcess(ctx context.Context, items []int) ([]int, error) {
	g, ctx := errgroup.WithContext(ctx)
	g.SetLimit(10) // 並行数を10に制限

	results := make([]int, len(items))

	for i, item := range items {
		i, item := i, item // クロージャの罠を回避
		g.Go(func() error {
			select {
			case <-ctx.Done():
				return ctx.Err()
			default:
				// 処理をシミュレート
				time.Sleep(100 * time.Millisecond)
				results[i] = item * 2
				return nil
			}
		})
	}

	if err := g.Wait(); err != nil {
		return nil, err
	}
	return results, nil
}

func main() {
	// データベースを初期化
	db := NewDatabase()

	// ハンドラを作成
	handler := NewHandler(db)

	// ルーティングを設定
	mux := http.NewServeMux()
	mux.HandleFunc("/order", handler.CreateOrder)
	mux.HandleFunc("/health", handler.Health)

	// サーバーを作成
	server := &http.Server{
		Addr:         ":8080",
		Handler:      mux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	fmt.Println("Server starting on :8080")
	fmt.Printf("Go version: %s\n", runtime.Version())
	fmt.Printf("CPU cores: %d\n", runtime.NumCPU())

	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
```

---

## 6. まとめ比較表

### 6.1 核心概念の比較

| 特性 | プロセス | スレッド | コルーチン |
| :--- | :--- | :--- | :--- |
| **スケジューラ** | OS | OS | ユーザープログラム/ランタイム |
| **切り替えオーバーヘッド** | 〜1-10ms | 〜1-10μs | 〜100ns |
| **メモリ使用量** | 〜10MB+ | 〜1MB | 〜2KB |
| **通信方式** | IPC | 共有メモリ | 共有メモリ/Channel |
| **同期の必要性** | 不要 | ロックが必要 | ロックが必要/協調的 |
| **クラッシュの影響** | 当該プロセスのみ | プロセス全体 | 制御可能 |
| **適用シーン** | 強分離、マルチテナント | CPUバウンド | I/Oバウンド |
| **代表的な言語** | すべての言語 | すべての言語 | Go、Python、JS、Rust |

### 6.2 並行モデル選定ガイド

| シーン | 推奨モデル | 理由 |
| :--- | :--- | :--- |
| Webサービスゲートウェイ | コルーチン + 非同期I/O | 高並行接続、低メモリ使用量 |
| リアルタイム通信サービス | コルーチン + 長期間接続 | 大量のWebSocket接続を維持 |
| データ処理パイプライン | マルチプロセス + コルーチン | マルチコア活用、I/O非ブロッキング |
| 科学計算 | マルチスレッド/マルチプロセス | CPUバウンド、並列計算が必要 |
| マイクロサービスアーキテクチャ | マルチプロセス + コルーチン | サービス間分離、内部高並行 |
| 組み込みシステム | コルーチン/シングルスレッド | リソース制約、決定論的スケジューリング |

### 6.3 用語対照表

| 英語用語 | 日本語対照 | 説明 |
| :--- | :--- | :--- |
| **Process** | プロセス | OSリソース割り当ての基本単位、独立したメモリ空間を持つ |
| **Thread** | スレッド | CPUスケジューリングの基本単位、プロセスのメモリ空間を共有 |
| **Coroutine** | コルーチン | ユーザー空間の軽量スレッド、プログラムが自律的にスケジューリング |
| **Concurrency** | 並行 | 複数のタスクが交互に実行され、マクロ的に同時に進行 |
| **Parallelism** | 並列 | 複数のタスクが真に同時に実行され、マルチコアのサポートが必要 |
| **Context Switch** | コンテキストスイッチ | CPUがあるタスクから別のタスクに切り替わるプロセス |
| **Blocking I/O** | ブロッキングI/O | I/Oリクエスト発行後に完了を待機し、その間スレッドがサスペンドされる |
| **Non-blocking I/O** | ノンブロッキングI/O | I/Oリクエスト発行後に即座に戻り、結果を待たない |
| **Async I/O** | 非同期I/O | I/O完了時にコールバックまたは通知機構で呼び出し元に通知 |
| **Event Loop** | イベントループ | コルーチンスケジューリング機構、継続的にイベントを監視し振り分け処理 |
| **Goroutine** | Goroutine | Go言語の軽量スレッド実装 |
| **Channel** | チャネル | Go言語におけるコルーチン間通信の機構 |
| **Mutex** | ミューテックス | 共有リソースを保護するための同期プリミティブ |
| **Semaphore** | セマフォ | あるリソースに同時にアクセスするスレッド数を制御 |
| **Deadlock** | デッドロック | 複数のスレッドが互いに相手のリソース解放を待ち、永久にブロックされる |
| **Race Condition** | 競合状態 | 複数のスレッドが同時に共有データにアクセスし、結果が不確定になる |
| **Thread Pool** | スレッドプール | あらかじめスレッド群を作成し、再利用して作成/破棄のオーバーヘッドを削減 |
| **Work Stealing** | ワークスティーリング | アイドル状態のスレッドがビジー状態のスレッドのキューからタスクを「盗んで」実行 |
| **Zero-copy** | ゼロコピー | データがカーネル空間とユーザー空間間で転送される際にCPUコピーを経由しない |
| **C10K Problem** | C10K問題 | 単一マシンで1万接続を同時に処理する課題 |
| **C10M Problem** | C10M問題 | 単一マシンで1000万接続を同時に処理する究極の課題 |

---

## 7. 最後に

### 7.1 並行プログラミングの黄金律

1. **过早な最適化をしない**：まずコードを正しく動作させ、それからパフォーマンス最適化を考える
2. **共有状態を避ける**：「共有メモリで通信するのではなく、通信で共有メモリを実現せよ」
3. **エラーを早期に顕在化させる**：並行バグは再現が難しいことが多いため、テスト段階で可能な限り顕在化させる
4. **並行数を制限する**：無制限の並行は保護がないのと同じ、セマフォや接続プールで制限する
5. **監視と可観測性**：並行システムには必ず充実した監視が必要で、迅速な問題特定が可能になる

### 7.2 学習ロードマップ

```
フェーズ1: 基礎理解
    ├── プロセス/スレッドの基本概念を理解
    ├── 同期プリミティブ（ロック、セマフォ、条件変数）を学習
    └── 簡単なマルチスレッドプログラムを作成

フェーズ2: 原理の深掘り
    ├── メモリモデルと可視性を理解
    ├── ロックフリープログラミングとアトミック操作を学習
    ├── スレッドプールとワークスティーリングを理解
    └── デッドロックと競合状態を分析

フェーズ3: 高度な応用
    ├── コルーチンと非同期プログラミングを習得
    ├── Go/Python/Rust の並行モデルを学習
    ├── 分散システムにおける並行を理解
    └── パフォーマンスチューニングとキャパシティプランニング

フェーズ4: エキスパートレベル
    ├── 高並行システムアーキテクチャを設計
    ├── 複雑な並行バグを解決
    ├── 並行プログラミングフレームワークを開発
    └── 並行知識を共有・普及
```

このガイドが並行プログラミングに対する体系的な理解を築く助けとなることを願っています。覚えておいてください、**並行は目的ではなく手段です**——真の目標は高性能で高可用なサービスを構築することです。原理を理解し、適切なモデルを選び、良いコードを書けば、あなたは並行の道をますます遠くまで進んでいけるでしょう。