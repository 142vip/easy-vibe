---
title: 'プロトタイプに AI 機能を組み込む'
description: 'プロンプト設計、公式ドキュメント、サービスコンソールの確認から始め、Web プロトタイプにテキスト・画像・音声・動画の AI 機能を組み込みます。'
---

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'
import AiCapabilityGuide from '../../../zh-cn/stage-1/integrating-ai-capabilities/AiCapabilityGuide.vue'
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'

const duration = '約 <strong>1〜2 日</strong>'
const relatedArticles =
  relatedArticlesMap['ja-jp/stage-1/integrating-ai-capabilities'] ?? []
</script>

# プロトタイプに AI 機能を組み込む


## この章で学ぶこと

<ChapterIntroduction :duration="duration" :tags="['プロンプト', 'API ドキュメント', 'サービスコンソール', 'マルチモーダル']" coreOutput="プロトタイプに 1〜2 種類の実際の AI 機能を組み込む" expectedOutput="テキスト・画像・音声・動画サービスを呼び出せる Web プロトタイプ">

前章で作ったプロトタイプは、画面構成と操作の流れを確認できるようになりました。ただし、生成結果はまだダミーデータです。この章では、その中の中心的な操作を実際の AI サービスにつなぎます。

AI の組み込みは、API コードをコピーするだけでは終わりません。**仕事をどう説明するか、公式ドキュメントをどう読むか、呼び出しを製品の流れにどう安全に置くか**を同時に考えます。

まず共通の進め方を身につけ、その後でテキスト、画像理解、画像生成、音声、動画を順に見ます。モデル名やコンソール画面は更新されるため、ここでの例は構造を理解するためのものです。実際に接続するときは、各サービスの最新公式ドキュメントからモデル ID とパラメータを確認してください。

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: '仕事を明確にする', description: '業務用プロンプトを用意する' },
      { title: 'ドキュメントを読む', description: 'API とパラメータを見つける' },
      { title: '接続する', description: '安全な呼び出しを動かす' },
      { title: '種類を広げる', description: '画像・音声・動画へ進む' }
    ]" />
  </ClientOnly>
</div>

## 1. どの機能を接続するか決める

前章の EC コンテンツ作業画面には、商品情報と「商品文を生成」ボタンがあります。しかし結果はまだダミーです。まず、このボタンを本当に動かします。

流れは単純です。利用者が商品名、素材、特徴を入力してボタンを押すと、商品紹介文が返ります。入力も結果も文字なので、必要なのはテキストを生成できるモデルです。

画面の機能が違えば、必要な AI も変わります。たとえば次のように考えます。

- 商品写真から色や形を読み取るなら画像理解。
- 商品情報からポスターを作るなら画像生成。
- 録音を議事録にするなら、最初に音声を文字へ変換し、その後にテキストモデルで整理。
- 記事を聞ける音声にするならテキスト読み上げ。
- 商品写真を動かすなら画像から動画を生成する機能。

接続前に画面を見直し、「利用者は何を渡し、最後に何を見たいのか」を確認します。この二つが分かれば、テキスト・画像・音声・動画のどれを探せばよいか判断できます。

<AiCapabilityGuide />

### 1.1 一つの機能を数段階に分けることもある

すべての機能を一つのモデルで一度に終えられるわけではありません。「商品写真をアップロードして特徴を書く」なら、最初に写真の商品を読み取り、その結果から文章を作ります。「社内資料をもとに質問へ答える」場合も、関連資料を探してから回答を組み立てます。

分解するときはモデル名から考えません。利用者の操作を追い、既存の内容を理解する段階、新しい内容を作る段階、資料を探すだけの段階に分けます。必要なら二つ、三つの機能を順につなぎます。

AI に任せるのは、AI が得意な部分だけです。ログイン、決済、ファイル保存、画面遷移のようにルールが決まっている処理は、通常のプログラムで実装します。

![商品画像を理解してから商品説明を生成する実際の画面](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-35-41.webp)

*このプロトタイプでは、商品画像を読み取って情報を表示し、利用者が確認した後に編集可能な説明と特徴を生成します。*

### 1.2 サービスコンソールで探すもの

テキスト生成を使うと決めたら、DeepSeek、SiliconFlow、火山方舟、MiniMax などのサービスを開きます。サービス側はアカウント、課金、呼び出し口を提供し、選択したモデルが要求を処理します。

初回から全メニューを読む必要はありません。次の四つを見つけます。

1. API 呼び出しに使う **API Key** を作る。
2. 使用する **Model ID** を控える。
3. 公式ドキュメントから最小の curl または JavaScript 例を探す。
4. 利用枠、料金、呼び出し制限を確認する。

アプリは **API** を通じて商品情報をモデルへ送ります。JavaScript や Python の **SDK** があれば、それを使ってもかまいません。SDK はリクエスト処理を使いやすくまとめたものです。リクエスト内の「商品情報からタイトルと特徴を書いてください」という文章が、モデルへ渡すプロンプトです。

サービス名、Model ID、API アドレスは別物です。コードには公式例に記載されたアドレスと Model ID を使い、オンライン体験画面の URL を貼らないでください。

### 1.3 今は分からない API を後回しにする

コンソールには Embedding、Rerank、Function Calling、OCR、コンテンツ審査なども並びます。Embedding と Rerank は知識ベース、OCR は PDF や伝票の読み取り、Function Calling は検索やデータベースなど外部ツールの利用で使います。

今すべてを覚える必要はありません。画面の機能に直接必要な API を一つ接続し、必要になった時点で該当ドキュメントへ戻ります。

## 2. まず生成結果を試す

API コードを書く前に、サービスのオンライン体験画面で試します。「文章を書けるか」だけでなく、画面が必要とする形式で結果を返せるか確認するためです。

### 2.1 利用者は目的を自然に伝えればよい

オンライン画面では、実際の利用者と同じように入力します。

```text
軽量な通勤用リュックを販売したいです。黒いナイロン製で、
主に日常の通勤に使います。
短い商品名と、三つの特徴を書いてください。
```

画面に組み込んだ後は、この文章を利用者が毎回作る必要はありません。商品名、素材、色を入力して「商品文を生成」を押せば、プログラムが固定ルールを追加します。価格や売上を作らない、タイトルを長くしない、指定形式で返す、といったルールです。

タイトル、概要、特徴を別々に表示するなら、プログラムから `title`、`summary`、`selling_points` の JSON を返すよう指定できます。利用者の入力は自然なまま、画面は結果を安定して読み取れます。

最初は商品情報を数種類試し、わざと一項目抜いてみます。モデルが不足情報を勝手に作らないか確認します。形式が安定しない場合は、利用者にプロンプトの書き方を覚えさせるのではなく、プログラム側の固定指示を直します。

### 2.2 API を画面へつなぐ

公式ドキュメントには、多くの場合 curl、JavaScript、Python の例があります。その例と実現したい機能を AI IDE に渡し、現在の画面へ接続してもらいます。

```text
商品詳細ページに「商品文を生成」ボタンを追加してください。

クリックしたら、現在の商品情報を下の API へ送り、
返ってきた文章をページに表示してください。

API Key はブラウザに置かないでください。待機中と失敗時の表示も付けてください。
完成したら、必要な設定と起動・確認方法を教えてください。

公式 API の例：
<実際の Key を含まない curl または SDK の例を貼る>
```

画面の場所と公式例があれば、AI IDE が API 形式を推測せずに済みます。まず一回のリクエストが正常に返ることを確認します。画像、音声、動画を追加するときは、機能説明と公式例を差し替えます。

## 3. 公式例から最初のリクエストを送る

プロンプトを試したら、次はコードから送ります。公式ドキュメントの Quick Start または API Reference を開き、送信先、API Key の場所、`model` の値、最小例の四点を確認します。

公式の curl、JavaScript、Python 例をコピーし、Model ID とテスト内容だけを変えます。まず端末で正常な応答を一回得てから、プロジェクトへ入れます。画面へつないだ後で失敗しても、アカウント、Key、モデルが使えることは切り分けられます。

返り値も確認します。テキストは JSON 内のフィールド、画像は URL、音声はバイナリ、動画は最初にタスク番号を返す場合があります。画面の実装は、実際の返り値に合わせます。

### 3.1 長いドキュメントは AI と読む

長い API ドキュメントを最初から最後まで読む必要はありません。今見ているリンクを AI IDE に渡し、初回呼び出しに必要な箇所を探してもらいます。

```text
この API ドキュメントを読んでください：<ドキュメントの URL>

JavaScript から呼び出したいです。最も簡単な例、
API Key と model を書く場所、生成結果の取得方法を教えてください。
このページに書かれているパラメータだけを使ってください。
```

## 4. 初めてサービスコンソールを開く

Key の作成、モデルの選択、使用量の確認は通常コンソールで行います。メニュー名が違っても、作業内容はほぼ同じです。

### 4.1 Key を作り、リクエストが届いたか確認する

API Key は、アプリがモデルを呼び出すための認証情報です。作成後はローカルの環境変数に保存し、スクリーンショット、チャット、フロントエンドコードへ貼りません。漏れた可能性があれば、すぐに失効させて作り直します。

初回リクエスト後に Usage または Billing を開き、新しい記録があるか確認します。残高や Quota もここで分かります。失敗時は、コードから送られていないのか、サービスに拒否されたのか、利用枠がないのかを分けて調べます。

![残高、月間支出、呼び出し傾向を表示する DeepSeek の Usage 画面](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-13-57-41.webp)

*DeepSeek の Usage 画面では、呼び出し量、消費額、残高を確認できます。*

エラーに Request ID または Trace ID があれば控えます。同時に多くのリクエストがあっても、この番号で失敗した一件をログから探せます。

### 4.2 モデルを選び、正確な呼び出し名をコピーする

モデル一覧では、現在使えるテキスト、画像、音声、動画モデルを確認できます。詳細画面で、コードに使う Model ID をコピーします。画面上の表示名と異なることがあります。

![テキスト、画像、動画、音声で絞り込める SiliconFlow のモデル一覧](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-05-04.webp)

*SiliconFlow のモデル一覧は、テキスト、画像、動画、音声の種類で絞り込めます。*

Region を選び、Deployment を作ってから Base URL と Endpoint が発行されるサービスもあります。その場合はクイックスタートに従います。コンソール画面の URL を API アドレスとして使わないでください。

![API Key 作成、モデル選択、テスト手順をまとめた火山方舟のクイック接続画面](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-23-13-01.webp)

*火山方舟では、Key 作成、モデル選択、実行例を一つの流れで確認できます。*

### 4.3 使用制限と時間のかかる処理

テキスト API の RPM と TPM は、1 分間に許可されるリクエスト数とトークン数です。画像、音声、動画では Concurrency、つまり同時に実行できる件数も制限されます。上限を超えると通常は `429` が返るため、連打せず時間を置いて再試行します。

動画のような長い処理は、すぐにファイルを返さず Task ID を返します。プログラムから進行状況を照会するか、Callback や Webhook で完了をサーバーへ通知させます。File ID や一時 URL は期限切れになることがあるため、公開前に自分のストレージへ保存するか決めます。

`max_tokens`、`temperature`、`stream` などの値は、最初は公式例のままにします。出力が途中で切れたら `max_tokens`、逐次表示が必要なら `stream` を調整します。必要になるまで、すべてを一度に変更しません。

## 5. 公式例をページへ組み込む

端末の最小例が動いたら、次の順にプロトタイプへ接続します。

1. Key を `.env.local` など Git に入れない環境ファイルへ書く。
2. サーバーまたは Serverless Function からモデルを呼び出す。
3. 画面からは第三者の Key を持たず、自分の `/api/...` を呼ぶ。
4. ボタンに待機、成功、失敗の状態を追加する。
5. Usage へ戻り、実際の呼び出しが記録されたか確認する。

```text
ブラウザ画面
    │ 業務入力だけを送る
    ▼
自分の /api ── サーバー環境変数から API Key を読む
    │
    ▼
AI サービス ── 文字、JSON、ファイル、task_id を返す
```

::: warning API Key を守る
Vue、React、通常の HTML のフロントエンドコードへ API Key を書かないでください。名前に `VITE_` や `NEXT_PUBLIC_` が付いていても、ブラウザ用ファイルへ含まれる可能性があります。公開時はバックエンド、Serverless Function、保護されたゲートウェイからモデルを呼び出します。
:::

### 5.1 すぐに結果が返らない API もある

短いテキスト、画像理解、短い音声認識は一回のリクエストで返ることが多く、画面には「生成中」と表示できます。会話やリアルタイム音声はストリーミングで少しずつ届くため、受信しながら表示できます。

画像・動画生成は非同期処理が多く、最初は `task_id` だけを返します。その後、待機中、処理中、成功、失敗を照会します。数十秒かかることもあるため、変化しないローディング表示のままにしません。

## 6. まずテキスト生成を接続する

[DeepSeek API ドキュメント](https://api-docs.deepseek.com/)には、一般的な SDK と互換性のあるテキスト API があります。モデルは更新されるため、接続前に[モデル一覧](https://api-docs.deepseek.com/api/list-models)から現在の ID をコピーします。

最初は curl で一回送ります。オンライン体験と同じ商品情報を使うと結果を比べやすくなります。

```bash
curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${DEEPSEEK_API_KEY}" \
  -d '{
    "model": "deepseek-v4-flash",
    "messages": [
      {"role": "system", "content": "title、summary、selling_points を含む JSON を返してください。selling_points は 3 件とし、価格、売上、効果を作らないでください。"},
      {"role": "user", "content": "黒いナイロン製の通勤リュックを販売します。短いタイトル、紹介文、三つの特徴を書いてください。"}
    ],
    "stream": false
  }'
```

環境変数に Key を設定してから端末で実行します。正常な結果を得たら、同じ公式例と第 2 節の依頼文を AI IDE へ渡します。最初はボタン一つと固定の商品情報だけにし、ページで結果を確認してから完全な入力フォームへつなぎます。

### 二種類の商品で試す

商品名、素材、色を変えてもう一度生成します。二つの結果がそれぞれの入力に合い、画面で正しく表示されれば最小接続は成功です。次に項目を一つ消し、価格、効果、売上を作らないか確認します。わざと誤った Key を設定し、失敗表示も確認できます。

最後に Usage 画面で呼び出し記録を確認します。ページに文章が出ただけでは API の証明になりません。古いダミーデータでも似た表示になるからです。

## 7. 画像理解：Qwen3-VL の例

視覚モデルには画像と質問を渡します。画面で必要な情報を直接尋ねます。「この画像には何がありますか」だけでは、用途の広すぎる説明が返りがちです。

```text
この商品写真を見て、商品名の種類、主な色、見える素材と構造、
画像内の文字を教えてください。

分からない箇所は分からないと答え、ブランド、価格、売上を推測しないでください。
ページに表示できるよう JSON で返してください。
```

[SiliconFlow のモデル一覧](https://cloud.siliconflow.cn/models)で現在の視覚モデルを絞り込めます。ここでは入力構造の例として `Qwen/Qwen3-VL-8B-Instruct` を使いますが、実行前に現行の Model ID を確認します。

```python
import base64
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SILICONFLOW_API_KEY"],
    base_url="https://api.siliconflow.cn/v1"
)

with open("product.jpg", "rb") as image_file:
    image_data = base64.b64encode(image_file.read()).decode("utf-8")

response = client.chat.completions.create(
    model="Qwen/Qwen3-VL-8B-Instruct",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "この商品写真から、種類、色、見える素材と構造、画像内の文字を JSON で返してください。分からない内容は推測しないでください。"},
            {"type": "image_url", "image_url": {
                "url": f"data:image/jpeg;base64,{image_data}"
            }}
        ]
    }]
)
```

![AI IDE で画像理解 API を接続する](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-34-36.webp)

*写真からすぐ最終文章を作るより、認識した商品情報を利用者が確認してから文章を生成する方が、間違いを見つけやすくなります。*

## 8. 商品画像を生成・修正する

[Seedream](https://seed.bytedance.com/en/blog/deeper-thinking-more-accurate-generation-introducing-seedream-5-0-lite)は、文章からの画像生成と、参照画像を使った修正に対応します。商品画像では「きれいだが商品自体が変わった」という失敗を避けるため、背景、構図、光だけでなく、変えてはいけない部分も明記します。

```text
参照画像の黒いリュックを、縦長の商品ポスターにしてください。
薄いグレーの台の中央に置き、柔らかい光にして、上部にタイトル用の余白を残します。
文字、Logo、価格を追加せず、ファスナー、肩ひも、ポケットを変えないでください。
```

用途、位置、見た目、保持する構造が伝わる指示です。最初の画像では背景より先にリュックの変形を確認します。初めから多くのスタイル語を重ねません。

[火山方舟コンソール](https://www.volcengine.com/experience/ark?launch=seedream)から現在の画像 Model ID と最小リクエストをコピーします。古いチュートリアルの番号をそのまま使い続けないでください。

```bash
curl -X POST https://ark.cn-beijing.volces.com/api/v3/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ARK_API_KEY}" \
  -d '{
    "model": "<コンソールから現在の画像 Model ID をコピー>",
    "prompt": "参照画像の黒いリュックを簡潔な縦長の商品ポスターにしてください。文字、Logo、価格を追加せず、リュックの構造を変えないでください。",
    "image": ["https://example.com/product-reference.png"],
    "response_format": "url",
    "stream": false,
    "watermark": false
  }'
```

![商品に組み込んだ画像生成の結果](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-23-21-13.webp)

画像 URL には有効期限がある場合があります。プロトタイプでは直接表示できますが、公開時は利用規約を確認して自分のストレージへ保存するか決め、プロンプト、モデル版、生成時刻も記録します。

## 9. 音声認識と音声合成は別の API

「音声を追加する」には少なくとも二つの方向があります。

- **ASR / STT**：利用者の発話や音声ファイルを文字にする。
- **TTS**：文章を再生できる音声にする。

入力、出力、画面操作が異なるため、曖昧な「音声 API」ボタン一つにまとめません。

### 9.1 音声から文字へ：ファイルをアップロードして文章を返す

[SiliconFlow の音声認識ドキュメント](https://docs.siliconflow.cn/cn/api-reference/audio/create-audio-transcriptions)では、前節の JSON と違い、`multipart/form-data` でファイルを送ります。

```bash
curl --request POST \
  --url https://api.siliconflow.cn/v1/audio/transcriptions \
  -H "Authorization: Bearer ${SILICONFLOW_API_KEY}" \
  -F "file=@meeting.mp3" \
  -F "model=FunAudioLLM/SenseVoiceSmall"
```

公式例を AI IDE に渡すときは、画面の機能も伝えます。

```text
現在のページに「録音をアップロードして文字にする」ボタンを追加してください。

mp3、m4a、wav をアップロードしたら、サーバーから下の API を呼び、
返った文章を編集できる入力欄に表示してください。
API Key は環境変数へ置き、アップロードや認識に失敗したら再試行できるようにしてください。

公式例：
<上の curl 例を貼る>
```

### 9.2 テキスト読み上げは JSON ではなく音声を返すことがある

[MiniMax T2A HTTP ドキュメント](https://platform.minimax.io/docs/api-reference/speech-t2a-http)には同期音声合成 API があります。現在の例は `speech-2.8-hd` ですが、モデルと声はサービス画面で確認します。

音声合成では、読み上げ文と音声設定がプロンプトに相当します。数字、英語略語、間を読みやすく直してから、声、速度、音量、感情、形式を選びます。Markdown、URL、ボタン文言を含むページ全体をそのまま読ませません。

```bash
curl --request POST \
  --url https://api.minimax.io/v1/t2a_v2 \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "speech-2.8-hd",
    "text": "これは商品紹介の試聴用音声です。",
    "stream": false,
    "output_format": "hex",
    "language_boost": "auto",
    "voice_setting": {
      "voice_id": "<音声一覧から voice_id をコピー>",
      "speed": 1,
      "vol": 1,
      "pitch": 0
    },
    "audio_setting": {
      "sample_rate": 32000,
      "bitrate": 128000,
      "format": "mp3",
      "channel": 1
    }
  }'
```

音声画面には試聴、停止、再生成、ダウンロードも必要です。ストリーミング TTS は WebSocket またはストリーミング HTTP で受け取りながら再生します。

::: warning 音声とプライバシー
録音を送る前に、用途、保存期間、削除方法を伝えます。音声クローンには声の所有者の明確な許可が必要です。出所の分からない著名人や他人の録音を使わないでください。
:::

## 10. 動画生成：タスクを作成して結果を待つ

動画生成は通常、非同期 API です。[MiniMax の動画生成ドキュメント](https://platform.minimax.io/docs/guides/video-generation)では、`task_id` を受け取る、状態から `file_id` を得る、ダウンロード URL を取得する、という三段階になっています。

### 10.1 画面がどう変化するかも書く

画像は一場面ですが、動画では数秒間に何が起きるかも必要です。商品の初期位置、動きの順序、カメラ方向、長さを伝えます。

```text
黒いリュックを薄いグレーの展示台で 6 秒間見せてください。
カメラは正面から右へゆっくり回り、最後に少し近づきます。縦長の画面にします。
リュックの形を変えず、人物、文字、Logo を追加しないでください。
```

動作が多い場合は、一つのショットと一つの主な動きから始めます。短い動画で回転、開閉、ズーム、場面転換を同時に求めると、商品の形を保つのが難しくなります。

### 10.2 作成と状態確認は別のリクエスト

```bash
# 手順 1：タスクを作成
curl --request POST \
  --url https://api.minimax.io/v1/video_generation \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "MiniMax-Hailuo-2.3",
    "prompt": "黒いリュックを薄いグレーの展示台で見せます。カメラは正面から右へゆっくり回り、最後に少し近づきます。リュックの形を変えず、人物、文字、Logo を追加しないでください。",
    "duration": 6,
    "resolution": "1080P"
  }'

# 手順 2：返された task_id で状態を確認
curl --request GET \
  --url "https://api.minimax.io/v1/query/video_generation?task_id=<TASK_ID>" \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}"
```

画面には少なくとも `Preparing`、`Queueing`、`Processing`、`Success`、`Fail` を表示します。一定間隔で確認し、停止条件も決めます。公開サービスでは `callback_url` を使い、状態が変わったときにサーバーへ通知できます。

::: warning 動画と実在人物の素材
実在人物の写真や声、商標、著作物から動画を作る場合は、許可範囲とサービスの規則を確認します。顔認証、素材登録、コンテンツ審査が必要なサービスもあります。ブラウザから回避してよい手順ではありません。
:::

## 11. よくある問題を切り分ける

| 症状 | 最初に確認すること |
| --- | --- |
| `401 / 403` | Key が正しいか、権限があるか、正しいヘッダーに入っているか |
| `404` | Base URL、Endpoint、Model ID が変わっていないか |
| `429` | RPM、TPM、同時実行数、アカウントの利用段階 |
| `400` | 必須値、ファイル形式、JSON 構造、サイズ制限 |
| `5xx / timeout` | サービス状態、タイムアウト、再試行方法 |
| 待機中のまま | 同時実行数、タスク照会、利用枠、混雑状況 |
| 成功表示だが内容がない | 応答フィールド、バイナリ処理、一時 URL の期限 |
| ローカルでは動くが公開先で失敗 | 環境変数、CORS、Serverless の時間制限、地域ネットワーク |

調査時は発生時刻、リクエストの種類、HTTP ステータス、Request ID または Trace ID を残します。API Key、利用者の完全な音声、機密業務データはログへ書きません。

## 12. 📚 この章の課題

<StageAssignmentCard title="プロトタイプに一つの AI 機能を組み込む">

  <p>画面から、本当に AI が必要なボタンを一つ選びます。最初は一種類だけでよく、テキスト、画像、音声、動画をすべて完成させる必要はありません。</p>

  <ol>
    <li>公式ドキュメントで現在の Model ID と最小例を探す。</li>
    <li>例を AI IDE に渡し、画面のボタンへ接続する。</li>
    <li>API Key をサーバー環境変数へ置き、待機と失敗の表示を付ける。</li>
    <li>実際に一回呼び出し、Usage またはログでサービスに届いたことを確認する。</li>
  </ol>

  <p>完成したら実行画面を一枚保存し、AI がこのページで何を手伝うか一文で説明します。他人の画像、声、実在人物の素材を使う前に、利用できることを確認してください。</p>
</StageAssignmentCard>

## 次のステップ

次章では、これらの機能を製品全体の流れへ戻します。データ、状態、利用者への反応を加え、一回の API 呼び出しを繰り返し使える製品プロトタイプへ育てます。

<RelatedArticlesSection
  title="関連記事"
  description="一つの AI 機能から、製品全体の流れへ進みます。"
  :items="relatedArticles"
/>
