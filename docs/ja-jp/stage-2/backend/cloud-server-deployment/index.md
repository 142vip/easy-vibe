<script setup>
import RelatedArticlesSection from '../../../../.vitepress/theme/components/RelatedArticlesSection.vue'
import { relatedArticlesMap } from '../../../../.vitepress/theme/data/relatedArticles'
</script>

# ウェブサイトを公開する（上級編）：VPS サーバーを自分で用意して公開

> 💡 **「ウェブサイトを公開する」とは何か？** 「公開（ゴーライブ）」や「デプロイ（展開・公開）」とも呼ばれます。自分のパソコンで作ったウェブサイトは、自分にしか開くことができません。**公開するとは、24時間365日稼働するサーバーにサイトを配置し、誰でもブラウザで URL を入力すればアクセスできるようにすることです**——まるで、自分にしか読めなかった Word 文書をブログに投稿すると誰でも見られるようになるのと同じです。違うのは、今回はサイト全体を公開するという点です。

前の章では、Vercel や Zeabur のようなワンクリック PaaS プラットフォームを使う、最も簡単な公開方法を学びました。この章では、より柔軟で「自分でやる」スタイルの方法を解説します：**クラウドサーバーを自分で購入し、ゼロから環境を整えて、サイトを自分で公開します**。サーバーの選び方、接続方法、環境のインストール、Nginx の設定、ドメインの接続、HTTPS の有効化までを学びます。これを理解すれば、どのプラットフォームにも縛られることなく、好きなサービスを自由に動かせるようになります。

---

# 0. 賢く選ぶ：デプロイプラットフォームの選び方

プラットフォームを選ぶ前に、次の3つの質問に答えましょう：

1. **プロジェクトは24時間365日稼働する必要がありますか？**
   - いいえ（アクセスされたときだけ応答すればよい。例：ドキュメント、ブログ、静的サイト）→ **静的ホスティング / PaaS**
   - はい（cron ジョブ、クローラー、Telegram/Discord ボット、WebSocket サービス）→ **常時稼働 PaaS または VPS**

2. **GPU は必要ですか？**
   - いいえ（OpenAI/Anthropic の API を呼ぶだけ）→ 通常のプラットフォームで十分
   - はい（オープンソースモデルの実行、画像・動画の生成）→ **GPU クラウドプラットフォーム**（Modal、Replicate、Lambda Labs）

3. **ユーザーは主にどこにいますか？**
   - グローバル / 米国・欧州 → Vercel / Railway / Fly.io / AWS
   - 中国本土 → 中国のクラウド（Alibaba Cloud / Tencent Cloud）または Cloudflare（中国でも高速）
   - 両方 → CDN を活用し、中国向けアセットは中国クラウドへ、グローバル向けは AWS へ、GeoDNS で振り分ける

```
What type of project are you deploying?
│
├─ Pure frontend static site (Vite/React/Vue build output)
│   ├─ Completely free → Cloudflare Pages (unlimited bandwidth) / GitHub Pages
│   ├─ Next.js project → Vercel (official platform, best DX)
│   └─ China users primarily → Cloudflare Pages or domestic OSS+CDN
│
├─ Backend API, doesn't need to be always-on (request-triggered)
│   ├─ Node.js/Python API → Vercel Functions / Cloudflare Workers
│   └─ Full-stack frameworks (Next.js/Nuxt/SvelteKit) → Vercel
│
├─ Needs always-on process (Bot, cron, WebSocket)
│   ├─ Don't want to manage servers → Railway / Render / Fly.io
│   ├─ Full control & cost savings → Buy a VPS (DigitalOcean / Vultr / Hetzner / AWS EC2)
│   └─ China-facing projects → Tencent Cloud Lighthouse / Alibaba Cloud ECS
│
├─ Need to run AI models / GPU
│   ├─ Inference API → Modal / Replicate / Hugging Face Inference
│   ├─ Training/Fine-tuning → Modal / Lambda Labs
│   └─ China GPU → AutoDL / Alibaba Cloud PAI
│
└─ Large production projects
    └─ AWS/GCP + Kubernetes (hire DevOps or let AI write Terraform)
```

---

# 1. 無料・格安デプロイプラットフォーム詳解（サーバー不要）

ほとんどの個人プロジェクト、デモ、ポートフォリオでは、**サーバーを買う必要はまったくありません**。このセクションでは、人気の無料・格安プラットフォームについて、登録方法、使い方、注意点（ハマりどころ）を詳しく解説します。

## 1.1 Vercel — Next.js / フロントエンドの第一候補

**ウェブサイト：** https://vercel.com

**こんな人におすすめ：** Next.js プロジェクト、React/Vue フロントエンド、Serverless Functions を使うフルスタックアプリ、AI チャットボット（応答が速い）

**使い方：**
1. GitHub アカウントでサインアップ
2. 「Add New...」→「Project」をクリック
3. GitHub リポジトリを選択
4. Vercel がフレームワーク（Next.js/Vite/React など）を自動検出。環境変数を入力
5. 「Deploy」をクリック——1〜2分で `xxx.vercel.app` にサイトが公開される

**無料枠（Hobby プラン）：**
- 帯域幅 月100GB
- ビルド時間 月100時間
- Serverless Function の実行時間 **10秒**（最も重要な制限！）
- 自動 HTTPS、グローバル CDN、PR プレビューリンク

**有料プラン（Pro、月額20ドル）：**
- 関数のタイムアウトが 60〜300秒に延長
- 帯域幅 1TB
- チームコラボレーション機能

**⚠️ 初心者がぶつかる主な制限：**
- **無料枠の関数タイムアウト10秒**：10秒を超える AI API 呼び出しは切断される。Pro プラン（月20ドル）なら60秒、300秒にするには追加費用
- **常時稼働プロセス不可**：cron、WebSocket ロングポーリング、常駐ボットは動かせない
- **コールドスタート**：しばらく使われていない関数は、最初のリクエストが遅くなる
- **AI プロジェクトのコスト**：ストリーミング形式の AI 応答は帯域幅を消費し、トラフィックが多いと Pro の請求が月200ドルになることも

**総評：** Vercel はフロントエンドのページ、ドキュメント、クイックデモのデプロイに最もスムーズな体験を提供します。ただし、常時稼働のエージェントや長時間実行する AI 呼び出しには——Vercel は使わないでください。

## 1.2 Cloudflare Pages — 帯域幅無制限、世界中で高速

**ウェブサイト：** https://pages.cloudflare.com

**こんな人におすすめ：** 静的サイト、帯域幅を大量に使うプロジェクト、グローバルなユーザー、Edge Functions

**無料枠：**
- **帯域幅無制限**（最大の売り！）
- ビルド 月500回
- リクエスト数無制限
- Cloudflare Workers：1日10万リクエスト
- 世界中に300以上のエッジ拠点、中国でも比較的快適

**使い方：**
1. 無料の Cloudflare アカウントに登録
2. Workers & Pages → Create → Pages → Connect to Git に進む
3. リポジトリを選択し、ビルドコマンドを設定（Vite：`npm run build`、出力ディレクトリ：`dist`）
4. Save and Deploy をクリック

**おまけ：Workers AI：** Cloudflare はオープンソースの AI モデル（Llama 3、Mistral、Stable Diffusion）をエッジノードで実行するサービスも提供しており、1日1万ニューロンまで無料。OpenAI の API に頼らずに小規模モデルを動かすのに最適です。

**総評：** 静的サイトに最適な選択肢。特にグローバルなユーザーがいるプロジェクトで、帯域幅無制限は破壊的な強みです。

## 1.3 Railway — バックエンドサービスに最適な体験（常時稼働）

**ウェブサイト：** https://railway.app

**こんな人におすすめ：** 常時稼働のバックエンドサービス、Node.js/Python/Go の API、Discord/Telegram ボット、データベースが必要なフルスタックプロジェクト

**使い方：**
1. GitHub でサインアップ
2. New Project → GitHub リポジトリからデプロイ（またはテンプレートを選択）
3. Railway がプロジェクトの種類を自動検出し、依存関係のインストール、ビルド、起動まで実施
4. PostgreSQL/Redis/MySQL/MongoDB データベースをワンクリックで追加
5. 自動生成のドメイン、または独自ドメインをバインド

**料金：**
- 新規ユーザーには **5ドルの試用クレジット**（永久的な無料ではない）
- 以降は従量課金。最低構成（常時稼働サービス + DB）で月約5ドルから
- アイドル5分でスリープ（無料トライアル中のみ）。有料化後はスリープなし

**総評：** Railway はバックエンド API、ボット、データベースが必要なフルスタックアプリのデプロイに最良の体験を提供します——GitHub からの自動デプロイ、組み込みデータベース、ログとモニタリングまで全部そろっています。

## 1.4 Fly.io — 本当に24時間365日無料のコンテナ

**ウェブサイト：** https://fly.io

**こんな人におすすめ：** 低遅延でグローバル分散するサービス、**本当に24時間365日無料**のコンテナが欲しい人、多少の学習コストを受け入れられる人

**無料枠：**
- マイクロシェア VM 3台（micro-1x、256MB RAM）
- **実行時間の制限なし**（Render のようなスリープなし）
- 外向きトラフィック 月160GB
- 永続ボリューム 3GB
- 30以上のグローバルデータセンター拠点
- GPU 対応（A100/H100）

**使い方：**
1. サインアップにクレジットカードが必要（課金はされない、本人確認のため）
2. flyctl CLI をインストール
3. プロジェクトに `fly.toml` 設定ファイルを書く（AI に生成してもらえる）
4. `fly launch` → Docker イメージを自動ビルドし、IP を割り当ててデプロイ
5. 更新は `fly deploy`、ログ確認は `fly logs`

**総評：** ボット/API/cron ジョブ用に**本当に24時間365日無料のコンテナ**が必要なら、Fly.io が最高の無料オプションです。トレードオフは flyctl コマンドと Docker の基本を学ぶことです。

## 1.5 Render — 750時間無料だがスリープする

**ウェブサイト：** https://render.com

**こんな人におすすめ：** 学習段階、個人プロジェクト、コールドスタートを気にしないプロジェクト

**無料枠：**
- Web Service：月750時間（1インスタンスが継続稼働）
- PostgreSQL：90日間無料（⚠️ その後データベースは削除される！）
- 静的サイト：完全無料、帯域幅100GB

**⚠️ 主な問題点：**
- **15分間アクセスがないとスリープ**し、コールドスタートに10〜30秒かかる（UX が悪い）
- 無料データベースは90日で削除される——必ずバックアップを！

**総評：** 開発・テスト・学校のプロジェクトには最適ですが、本番のユーザー向けプロジェクトを無料枠に載せるのはやめましょう。スリープを無効にする有料プランは月7ドルからです。

## 1.6 その他の注目プラットフォーム

| プラットフォーム | 種類 | 無料枠 | 特長 |
|----------|------|-----------|------------|
| **GitHub Pages** | 静的ホスティング | 無制限（100GB のソフト制限） | 一番簡単：GitHub に push するだけで公開 |
| **Hugging Face Spaces** | AI アプリ | 無料の小型 CPU インスタンス | AI デモ（Gradio/Streamlit）専用 |
| **Modal** | AI/サーバーレス GPU | 月30ドルのクレジット | Python の関数即サービス、GPU コールドスタート <4秒 |
| **Replicate** | AI モデルホスティング | 呼び出しごとに課金 | インフラ管理なしでモデルを API に変換 |
| **Denoland Deploy** | Deno/エッジ | 1日10万リクエスト無料 | Deno 公式プラットフォーム、TypeScript ネイティブ |
| **Netlify** | 静的ホスティング | 帯域幅 月100GB | 豊富なプラグインエコシステム |
| **Supabase** | BaaS | DB 500MB 無料 | オープンソースの Firebase 代替、Postgres+Auth+Storage |
| **Neon** | サーバーレス Postgres | 500MB 無料 | Serverless 向けブランチ可能データベース |
| **Upstash** | サーバーレス Redis | 1日1万コマンド無料 | Serverless 向けリクエストベース Redis |

---

# 2. クラウド VPS の購入：AWS を例に

サーバー環境を完全に制御したい、カスタムサービスを動かしたい、あるいは PaaS では要件を満たせない——そんなときは、クラウドサーバーを自分で購入しましょう。このセクションでは、世界で最も広く使われているクラウドプラットフォーム AWS を例に解説し、DigitalOcean、Vultr、Hetzner などの代替案も紹介します。

## 2.1 AWS フリーティア — 12ヶ月無料

AWS は新規ユーザーに12ヶ月間のフリーティアを提供しており、学習や個人プロジェクトにぴったりです。含まれる内容は以下の通りです：

| サービス | フリーティア枠 |
|---------|---------------------|
| **EC2** | t2.micro または t3.micro を月750時間（1インスタンスを24時間365日稼働） |
| **S3** | 標準ストレージ 5GB |
| **RDS** | db.t2.micro/db.t3.micro を月750時間 + ストレージ20GB |
| **Lambda** | 月100万リクエスト + コンピュート時間320万秒 |
| **CloudFront** | 外向きトラフィック50GB + 月200万リクエスト |
| **CloudWatch** | カスタムメトリクス10個 + ログ取り込み1GB |
| **DynamoDB** | ストレージ25GB + 読み書きキャパシティユニット250万 |

**⚠️ 重要：** フリーティアは登録から12ヶ月で終了し、以降は標準料金がかかります。想定外の請求を避けるため、必ず請求アラート（Billing Dashboard → Budgets）を設定しましょう。使っていないリソースは削除してください！

### EC2 インスタンスの作成方法（AWS VPS）：

1. https://aws.amazon.com/ でメールアドレスとクレジットカードを使って**サインアップ**
2. **EC2 Dashboard** → **Launch Instances** に進む
3. **ステップ1：Amazon Machine Image（AMI）を選択**
   - **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type**（64ビット x86）を選択——これが最も初心者に優しい選択肢
4. **ステップ2：インスタンスタイプを選択**
   - **t2.micro** を選択（フリーティア対象、1 vCPU、1GB RAM）
5. **ステップ3：インスタンス詳細の設定**
   - デフォルトのまま（1インスタンス、デフォルト VPC）
6. **ステップ4：ストレージの追加**
   - デフォルトの 8GB gp2 ルートボリュームで初心者には十分
7. **ステップ5：タグの追加**（任意、整理用）
8. **ステップ6：セキュリティグループの設定**（⚠️ 超重要——これがファイアウォールです）
   - 新しいセキュリティグループを作成
   - ルールを追加：
     - タイプ：**SSH**、ポート：22、ソース：**My IP**（自分の IP だけが SSH できる）
     - タイプ：**HTTP**、ポート：80、ソース：**Anywhere (0.0.0.0/0)**
     - タイプ：**HTTPS**、ポート：443、ソース：**Anywhere**
9. **ステップ7：確認と起動**
10. **キーペア**：プロンプトが表示されたら、新しいキーペア（例：`my-aws-key.pem`）を作成し、ダウンロードして安全に保管。**二度とダウンロードできません！**
11. **Launch Instances** をクリック → 起動まで2〜5分待つ

### EC2 インスタンスへの接続：

```bash
# ローカルの Mac/Linux ターミナルで
chmod 400 my-aws-key.pem  # 正しいパーミッションを設定（必須！）
ssh -i my-aws-key.pem ubuntu@YOUR_PUBLIC_IP
# 例：ssh -i my-aws-key.pem ubuntu@54.123.45.67

# Windows では PuTTY（.pem を .ppk に変換）または OpenSSH 付きの Windows Terminal を使う
```

**パブリック IP の取得方法：** EC2 Dashboard → Instances → 自分のインスタンスを選択 → 詳細情報の中の「Public IPv4 address」を確認。

## 2.2 DigitalOcean — 初心者に優しい充実のドキュメント

**ウェブサイト：** https://www.digitalocean.com

**料金：** Droplet は月4ドルから（512MB RAM、10GB SSD、帯域幅500GB）

**DigitalOcean を選ぶ理由：** 彼らのドキュメント（「community tutorials」と呼ばれる）は伝説的です——Linux/サーバーに関するほぼすべての疑問に、良質な DO チュートリアルが存在します。インターフェースもすっきりしていて初心者に優しい。

**使い方：**
1. サインアップ（クレジットカードまたは PayPal。PayPal は最低2ドルの入金）
2. 「Create」→「Droplets」をクリック
3. Ubuntu 22.04、月4ドルのベーシックプランを選び、ユーザーに近いデータセンター（NYC、SFO、ロンドン、シンガポールなど）を選択
4. SSH 公開鍵を追加（推奨）または root パスワードを設定
5. 「Create Droplet」をクリック——約1分で準備完了
6. `ssh root@YOUR_DROPLET_IP` で接続

## 2.3 Vultr — 時間単位課金、拠点数も豊富

**ウェブサイト：** https://www.vultr.com

**料金：** 通常の Cloud Compute は月5ドルから（1 vCPU、1GB RAM、25GB SSD、帯域幅1TB）

**Vultr を選ぶ理由：** 時間単位で課金される（テスト用にサーバーを10分だけ立ち上げて、破棄すれば数セントで済む）、世界30以上の拠点、さらに後で必要になれば手頃な GPU インスタンスもあります。

## 2.4 Hetzner — 長期プロジェクトに最高のコスパ

**ウェブサイト：** https://www.hetzner.com/cloud

**料金：** CX11 は月3.49ユーロから（1 vCPU、2GB RAM、20GB SSD、トラフィック20TB！）

**Hetzner を選ぶ理由：** 欧州で最高のコストパフォーマンス、非常に安定したネットワーク。長期運用する本番プロジェクトに最適です。トレードオフはデータセンターがドイツ/フィンランド/米国にしかないこと（アジア拠点なし）。

## 2.5 VPS プロバイダー比較一覧

| プロバイダー | 開始価格 | こんな人におすすめ | 無料トライアル |
|----------|---------------|----------|-----------|
| **AWS EC2** | 12ヶ月無料、その後月約10ドル | AWS の学習、エンタープライズ連携 | 12ヶ月フリーティア |
| **DigitalOcean** | 月4ドル | 初心者、優れたドキュメント | 60日間 200ドルクレジット（新規ユーザー） |
| **Vultr** | 月5ドル（IPv6 のみは2.50ドル） | 時間単位のテスト、拠点多数 | 30日間 100ドルクレジット |
| **Hetzner** | 月3.49ユーロ | 長期プロジェクトで最高のコスパ | 20ユーロクレジット |
| **Linode (Akamai)** | 月5ドル | 老舗で信頼性が高い | 60日間 100ドルクレジット |

---

# 3. サーバーの初期設定（Ubuntu 22.04）

サーバーに SSH でログインしたら、まずシステムを更新し、基本ツールをインストールします。**下記のプロンプトをそのまま AI アシスタントにコピーして**、必要なコマンドを正確に生成してもらいましょう：

> 「Ubuntu 22.04 の新しいサーバーをセットアップして、[Node.js/Python/...] プロジェクトをデプロイしたい。次の内容を含む完全な初期化コマンドを教えて：システム更新、root 以外の sudo ユーザー作成、SSH 鍵認証の設定、Node.js 20 のインストール、Nginx のインストール、Docker のインストール、基本的な ufw ファイアウォールの設定。」

一般的な初期設定の例：

```bash
# 1. システムの更新と基本ツールのインストール
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git vim ufw build-essential

# 2. 通常ユーザーを作成（常に root で使わない！）
sudo adduser yourname
sudo usermod -aG sudo yourname

# 3. Node.js のインストール（apt ではなく nvm を使う）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 20
node -v  # 確認

# 4. Nginx のインストール
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
# ブラウザで http://YOUR-IP にアクセスすると Nginx のウェルカムページが見える

# 5. Docker のインストール（コンテナを使う場合）
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker yourname  # sudo なしで Docker を実行
# 反映には一度ログアウトして再ログインする
docker --version

# 6. ファイアウォールの設定
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo ufw status
```

## 3.1 セキュリティグループ / ファイアウォールの設定（超重要！）

AWS では **セキュリティグループ**（EC2 コンソール内）で行います。DigitalOcean/Vultr ではダッシュボードのファイアウォール設定です。Ubuntu 側でも `ufw` が必要です。

**最低限、次のポートを開放しましょう：**

| ポート | 用途 | 推奨設定 |
|------|---------|---------------|
| **22** | SSH | 必須。可能なら自分の IP に制限 |
| **80** | HTTP | Web に必須 |
| **443** | HTTPS | セキュアな Web に必須 |
| **3000-3999** | Node.js 開発用ポート | デバッグ時のみ一時的に開放し、デプロイ後に閉じる |

> ⚠️ **初心者ミス No.1：** アプリは動いているのにアクセスできない。90% はセキュリティグループ/ファイアウォールでそのポートが許可されていないことが原因です。

---

# 4. 代表的なデプロイシナリオ3選

## 4.1 シナリオ1：静的フロントエンドのデプロイ（Vite/React/Vue）

`npm run build` を実行すると、純粋な HTML/CSS/JS ファイルの `dist/` フォルダが生成されます。

**コードをサーバーに送る：**

```bash
# 方法A：ローカルから rsync で送る
rsync -avz --exclude=node_modules ./dist/ yourname@YOUR-IP:/var/www/myapp/

# 方法B：サーバー上で git clone（推奨。更新が楽）
cd /var/www
sudo git clone https://github.com/YOUR_USER/YOUR_REPO.git myapp
cd myapp
npm install
npm run build
```

**Nginx の設定：**

```bash
sudo vim /etc/nginx/sites-available/myapp
```

```nginx
server {
    listen 80;
    server_name YOUR-IP-OR-DOMAIN;

    root /var/www/myapp/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;  # SPA ルーティングのフォールバック
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

サイトを有効化：

```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 4.2 シナリオ2：Node.js バックエンドのデプロイ（Express/Fastify/NestJS）

**PM2** を使ってアプリをバックグラウンドで常駐させます：

```bash
npm install -g pm2
cd /path/to/your/app
npm install
npm run build  # TypeScript の場合
pm2 start dist/main.js --name "myapp"
pm2 startup && pm2 save  # 起動時に自動起動
pm2 logs myapp  # ログ確認
```

**Nginx リバースプロキシ：**

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 4.3 シナリオ3：Docker Compose でのフルスタックデプロイ

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:pass@db:5432/myapp
    depends_on: [db, redis]
    restart: always

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:7-alpine
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./frontend/dist:/usr/share/nginx/html
    depends_on: [app]
    restart: always

volumes:
  postgres_data:
```

起動コマンド：`docker compose up -d`

---

# 5. ドメインと HTTPS

## 5.1 ドメインの購入と DNS の設定

Namecheap、Cloudflare Registrar、GoDaddy、AWS Route 53 などでドメインを登録します。ドメインの DNS 設定で **A レコード**を追加します：

| タイプ | ホスト | 値 |
|------|------|-------|
| A | @ | サーバーの IP |
| A | www | サーバーの IP |
| A | api | サーバーの IP（バックエンド用） |

## 5.2 Let's Encrypt でワンクリック HTTPS

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
# オプション2（Redirect）を選ぶと HTTP から HTTPS へ自動リダイレクトされる
sudo certbot renew --dry-run  # 自動更新の動作テスト
```

---

# 6. クラウドプロバイダーサービスの深掘り（VPS の先へ）

AWS コンソール（またはどのクラウドのダッシュボード）にログインすると、謎の名前のサービス（EC2、S3、RDS、ELB、VPC…）がずらりと並んでいます。このセクションでは、**AWS を主な例として**、よく使われるサービスとその使いどころを解説します（概念は他のクラウドにもそのまま当てはまります）。

## 6.1 クラウドアーキテクチャの全体像

クラウド上で動く典型的な Web アプリケーションは次のような構成です：

```
User → CloudFront (CDN) → ALB (Load Balancer) → EC2 (Your App Server)
                              │                     │
                              │                     ├── S3 (images/files)
                              │                     ├── RDS (database)
                              │                     └── ElastiCache (Redis)
                              │
                              └── ECS/EKS (containers, advanced)
                              
         └── Route 53 (DNS) → maps your domain to CloudFront/ALB
             + ACM (SSL certs) → HTTPS encryption
```

それぞれのサービスを順に見ていきましょう。

## 6.2 コンピュート：コードが実行される場所

### EC2（Elastic Compute Cloud）— いわゆる VPS

これまで使ってきた「クラウドサーバー」のことです。SSH でログインして何でもインストールでき、自由に設定できる仮想マシンです。

- **Alibaba Cloud：** ECS
- **Tencent Cloud：** CVM / Lighthouse
- **DigitalOcean：** Droplet
- **Hetzner：** Cloud Server

**使うべき場面：** 完全な制御、カスタムソフトウェア、常時稼働プロセスが必要なとき。

### Lambda — サーバーレス関数

サーバー管理なしでコードの断片をアップロード。呼び出し回数と実行時間で課金されます。トリガーされたときだけ実行されます。

- **Alibaba Cloud：** Function Compute
- **Tencent Cloud：** SCF（Serverless Cloud Function）
- **GCP：** Cloud Functions

**使うべき場面：** 不定期のタスク（Webhook ハンドラー、画像処理、スケジュールジョブ）、トラフィックが急増する API。WebSocket ボットのような常時稼働プロセスには**向きません**。

### ECS/EKS — コンテナオーケストレーション

プロジェクトが Docker を使い、複数のコンテナ/サービスに成長したら、Kubernetes でオーケストレーションします。

- **AWS ECS：** Amazon のシンプルなコンテナサービス
- **AWS EKS：** マネージド Kubernetes
- **Alibaba Cloud：** ACK
- **Tencent Cloud：** TKE
- **Google Cloud：** GKE

**使うべき場面：** 複数サービスのマイクロサービスアーキテクチャ、オートスケーリング、チームプロジェクト。ほとんどの個人プロジェクトでは不要です——VPS + Docker Compose で十分。

## 6.3 ストレージ：ファイルとデータの置き場所

### S3（Simple Storage Service）⭐ 最もよく使う

**サーバー以外で最もよく使うサービスです**。画像、動画、PDF、静的サイトのアセット、バックアップなどを保存します。**ユーザーがアップロードしたファイルをサーバーのローカルディスクに保存してはいけません！** サーバーを再構築・移行・リサイズするとファイルが失われます。

- **Alibaba Cloud：** OSS（Object Storage Service）
- **Tencent Cloud：** COS（Cloud Object Storage）
- **Google Cloud：** GCS（Google Cloud Storage）
- **代替案：** Cloudflare R2（エグレス料金ゼロ——お得！）

**無料枠：** AWS S3 はフリーティアで12ヶ月間、標準ストレージ5GB。Alibaba Cloud OSS は新規ユーザーに6ヶ月間5GB。Cloudflare R2 は10GB の永久無料枠があります。

**S3 でできること：**
- ユーザーアップロードの保存（アバター、画像、添付ファイル、商品写真）
- 静的ウェブサイトのホスティング（`dist/` フォルダをアップロードして「Static website hosting」を有効化）
- データベースエクスポートのバックアップ
- CloudFront CDN と組み合わせて世界中で高速ダウンロード
- 署名付き URL（プリサインド URL）を生成してプライベートファイルを共有

**S3 の使い方（AWS コンソールでの手順）：**

1. **S3 Dashboard** → **Create bucket** に進む
2. **グローバルで一意**なバケット名を入力（例：`myapp-images`）
3. AWS リージョンを選択（米国東部なら us-east-1）
4. **Object Ownership：** 「ACLs enabled」→「Bucket owner preferred」を選択（公開アクセスがシンプルになる）
5. 公開画像が必要なら**「Block all public access」のチェックを外す**（警告を読んで、公開してよいコンテンツのときだけ外す）
6. 他の設定はデフォルトのまま → **Create bucket** をクリック
7. バケットをクリック → **Upload** → ファイルを選択
8. アップロード後、各ファイルに `https://myapp-images.s3.us-east-1.amazonaws.com/avatar.jpg` のような URL が付く
9. その URL をフロントエンドの `<img src="...">` に直接使う

**コードから S3 を使う（Node.js の例。完全なロジックは AI に書いてもらいましょう）：**

```javascript
// npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-east-1" });

async function uploadFile(buffer, filename, contentType) {
  await s3.send(new PutObjectCommand({
    Bucket: "myapp-images",
    Key: filename,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read" // ファイルを公開アクセス可能にする
  }));
  return `https://myapp-images.s3.us-east-1.amazonaws.com/${filename}`;
}
```

> ⚠️ **重大なセキュリティ上の注意：** AWS アクセスキーは S3 のパスワードのようなものです。**フロントエンドのコードにハードコードしたり、Git にコミットしたりしてはいけません！** 環境変数に保存するか IAM ロールを使いましょう。キーが漏れたら、すぐに IAM コンソールで無効化してください。

### EBS（Elastic Block Store）— 仮想ハードディスク

EC2 インスタンスに接続するブロックストレージボリューム（パソコンのハードディスクのようなもの）です。EC2 インスタンスにはルートボリューム（通常8〜60GB）が付属しており、容量が足りなくなったら追加の EBS ボリュームを購入します。

- **Alibaba Cloud：** Cloud Disk（ESSD/SSD）
- **Tencent Cloud：** CBS（Cloud Block Storage）

**使うべき場面：** サーバー用の追加ディスク領域、EC2 インスタンスのライフサイクルとは独立して永続化したいデータ。

### EFS（Elastic File System）— 共有ファイルストレージ

複数の EC2 インスタンスが同時にマウントできるネットワークファイルシステムです。複数の Web サーバー間でアップロードファイルを共有するのに適しています。

- **Alibaba Cloud：** NAS
- **Tencent Cloud：** CFS

ほとんどの小規模プロジェクトでは不要です——サーバー1台 + S3 で十分。

## 6.4 データベース：構造化データの保存

### RDS（Relational Database Service）⭐ よく使う

**本番データベースを VPS と同じマシンで動かしてはいけません！** 技術的には可能ですが（先ほど Docker Compose の例でやりました）、本番環境ではマネージドデータベースを使いましょう：自動バックアップ、高可用性、モニタリング、ワンクリックスケーリングが揃っています。

- **Alibaba Cloud：** RDS
- **Tencent Cloud：** TDSQL-C / CDB
- **Google Cloud：** Cloud SQL

**対応エンジン：** MySQL、PostgreSQL、MariaDB、SQL Server、Oracle、Amazon Aurora（MySQL/PostgreSQL 互換でクラウド最適化）。

**無料枠：** AWS RDS は12ヶ月間、db.t2.micro または db.t3.micro を月750時間 + ストレージ20GB。

**RDS のセットアップ方法（AWS）：**

1. **RDS** → **Create database** に進む
2. **Standard create** を選択 → エンジン：**MySQL 8.0** または PostgreSQL
3. テンプレート：**Free tier**（無料枠内に収めるため）
4. DB インスタンス識別子、マスターユーザー名、マスターパスワードを設定
5. インスタンス構成：**db.t3.micro**（フリーティア対象）
6. ストレージ：20GB gp2（フリーティア対象）
7. 接続設定：EC2 インスタンスと**同じ VPC** を選択
8. **パブリックアクセス：** なし（VPC 内からのみアクセスを許可）
9. VPC セキュリティグループ：新規作成するか、EC2 セキュリティグループからポート 5432/3306 を許可した既存のものを選択
10. **Create database** をクリック → 約5〜10分待つ
11. 利用可能になったら **Endpoint** を取得（`mydb.xxxxx.us-east-1.rds.amazonaws.com:3306` のような形式）
12. アプリの `DATABASE_URL` をこのエンドポイントに向けて更新し、EC2 セキュリティグループを RDS セキュリティグループのインバウンドルールに追加

> 💡 **バイブコーディングのコツ：** AI にこう伝えましょう：「[エンドポイント] の AWS RDS PostgreSQL インスタンスと、ユーザー [ユーザー名] がある。接続コードとマイグレーションスクリプトを [私のプロジェクト] 向けに書いて。」

### ElastiCache — マネージド Redis / Memcached

ホットデータのインメモリキャッシュ（DB クエリ削減）、セッション/トークン保存、メッセージキュー、ランキングなどに使います。

- **Alibaba Cloud：** ApsaraDB for Redis
- **Tencent Cloud：** TencentDB for Redis
- **代替案：** Upstash（サーバーレス Redis、無料枠あり）

小規模プロジェクトなら VPS 上で `sudo apt install redis-server` を実行するだけで OK。本番・高可用性が必要ならマネージド Redis を使いましょう。

## 6.5 ネットワーク：より速く、より安全なアクセス

### CloudFront — CDN（コンテンツ配信ネットワーク）⭐ よく使う

静的アセット（画像、CSS、JS、動画）を世界中のエッジ拠点にキャッシュし、ユーザーは最寄りのノードからコンテンツを受け取れます。

- **Alibaba Cloud：** CDN / DCDN
- **Tencent Cloud：** CDN / EdgeOne
- **Google Cloud：** Cloud CDN
- **無料の代替案：** Cloudflare CDN（無料プランに帯域幅無制限を含む）

**使うべき場面：**
- 画像/動画/大容量ファイルを扱うサイト
- ユーザーが複数の地域に分散している
- オリジンサーバーの帯域幅コストを削減したい
- Cloudflare Pages は実質 CDN + 静的ホスティング

**CloudFront の設定方法：**
1. CloudFront コンソール → **Create distribution**
2. Origin domain：S3 バケットまたは EC2 の ALB を選択
3. デフォルトのキャッシュ動作：HTTP を HTTPS にリダイレクト
4. Create distribution → デプロイに約5〜15分待つ
5. ドメインの DNS を CloudFront のディストリビューションドメイン名（例：`dxxx.cloudfront.net`）に CNAME レコードで向ける

### ELB（Elastic Load Balancing）

複数の EC2 インスタンスにトラフィックを分散し、異常なインスタンスを自動的に切り離します。

- **ALB（Application Load Balancer）：** レイヤー7（HTTP/HTTPS）、パスベースルーティング、Web アプリで最も一般的
- **NLB（Network Load Balancer）：** レイヤー4（TCP/UDP）、超低遅延
- **GLB（Gateway Load Balancer）：** ネットワーク仮想アプライアンス用
- **Alibaba Cloud：** SLB / ALB
- **Tencent Cloud：** CLB

サーバー1台のプロジェクトでは不要です。バックエンドサーバーを複数台にスケールするときに使いましょう。

### Route 53 — DNS サービス

ドメイン名を IP アドレスに変換します。ほとんどのドメインレジストラは無料 DNS を提供していますが、Route 53 は AWS と深く統合されています。

- **Alibaba Cloud：** Alibaba Cloud DNS
- **Tencent Cloud：** DNSPod
- **無料の代替案：** Cloudflare DNS（世界最速クラスで完全無料）

**よく使う DNS レコードの種類：**

| タイプ | 用途 | 例 |
|------|---------|---------|
| **A** | ドメイン → IPv4 アドレス | `@ → 54.123.45.67` |
| **AAAA** | ドメイン → IPv6 アドレス | `@ → 2600:xxxx::` |
| **CNAME** | ドメイン → 別のドメイン（CDN で使用） | `static → dxxx.cloudfront.net` |
| **MX** | メールサーバー（ビジネスメールに必要） | - |
| **TXT** | 任意のテキスト（ドメイン検証、SPF/DKIM） | - |

### ACM（AWS Certificate Manager）— 無料の SSL 証明書

AWS は無料の SSL/TLS 証明書を提供し、CloudFront や ALB と組み合わせると自動更新されます。証明書をリクエストし、DNS またはメールで検証し、ディストリビューション/ロードバランサーにアタッチするだけです。

- **Alibaba Cloud：** 無料 SSL 証明書
- **Tencent Cloud：** 無料 SSL 証明書
- **誰でも使える無料の方法：** Certbot + Let's Encrypt（第5章で紹介した方法。90日ごとに自動更新）

### VPC（Virtual Private Cloud）

AWS 上の隔離された仮想ネットワークで、EC2、RDS などのリソースが配置されます。新規アカウントにはデフォルト VPC が用意されています。高度な使い方（パブリック/プライベートサブネットの分離、NAT ゲートウェイ）はより深い学習が必要です。

## 6.6 その他のよく使うサービス

### ドメイン登録

- **グローバル：** Namecheap、Cloudflare Registrar（WHOIS プライバシー無料）、GoDaddy
- **AWS：** Route 53（ドメイン登録も可能）
- **中国：** Alibaba Cloud 万網（Wanwang）、Tencent Cloud DNSPod（ICP 备案が必要）

### SES（Simple Email Service）— メール送信

自分でメールサーバーを立ててはいけません（スパム扱いされやすい）。プロのメールサービスを使いましょう。

- **AWS SES**、SendGrid、Mailgun、Resend
- **中国：** Alibaba Cloud Direct Mail、Tencent SES
- 用途：認証メール、通知、マーケティングメール

### SNS（Simple Notification Service）— SMS / プッシュ通知

SMS やモバイルプッシュ通知に使います。SMS のグローバルな定番代替は Twilio です。

### CloudWatch — モニタリングとログ

EC2 の CPU/メモリ/ディスク監視、アプリケーションログの確認、アラート設定（高 CPU、サービス停止）。

- **Alibaba Cloud：** Cloud Monitor + SLS（Log Service）
- **Tencent Cloud：** Cloud Monitor + CLS
- **初心者向け代替：** PM2 の組み込みモニタリング + Uptime Kuma（オープンソース、Docker コンテナ1つで起動）

### S3 応用：画像処理 / Lambda トリガー

S3 はファイルがアップロードされると自動的に Lambda 関数をトリガーできます。例えばユーザーが大きな写真をアップロードすると、Lambda が自動的にサムネイルにリサイズします。中国では Alibaba OSS が組み込みの画像処理機能（URL に `?x-oss-process=image/resize,w_300` を付ける）を持ち、Tencent COS は Cloud Infinite（CI）で同様の機能を提供します。

## 6.7 クラウドサービス対応表：AWS ↔ 中国クラウド ↔ 代替サービス

同等のサービスを探すための早見表です：

| カテゴリ | AWS | Alibaba Cloud | Tencent Cloud | 無料・格安の代替 |
|----------|-----|--------------|---------------|------------------------|
| クラウドサーバー | EC2 | ECS | CVM / Lighthouse | DigitalOcean / Vultr / Hetzner |
| オブジェクトストレージ | S3 | OSS | COS | Cloudflare R2（エグレス料金ゼロ） |
| リレーショナル DB | RDS | RDS | TDSQL-C/CDB | Supabase / Neon |
| Redis キャッシュ | ElastiCache | ApsaraDB Redis | TencentDB Redis | Upstash |
| CDN | CloudFront | CDN/DCDN | CDN/EdgeOne | Cloudflare CDN（無料） |
| ロードバランサー | ALB/NLB | SLB/ALB | CLB | Nginx 自前ホスティング / Caddy |
| サーバーレス | Lambda | Function Compute | SCF | Cloudflare Workers |
| コンテナ/K8s | ECS/EKS | ACK | TKE | Fly.io / Railway |
| DNS | Route 53 | Alibaba Cloud DNS | DNSPod | Cloudflare DNS（無料） |
| SSL 証明書 | ACM（無料） | 無料証明書 | 無料証明書 | Let's Encrypt（無料） |
| メール | SES | Direct Mail | SES | Resend / SendGrid 無料枠 |
| SMS | SNS | SMS | SMS | Twilio |
| モニタリング | CloudWatch | Cloud Monitor | Cloud Monitor | Uptime Kuma（自己ホスティング） |
| AI/ML API | Bedrock | 通義千問（Tongyi Qianwen）/百錬（Bailian） | 混元（Hunyuan）/TI | OpenAI / Anthropic API |
| ドメイン登録 | Route 53 | 万網（Wanwang） | DNSPod | Namecheap / Cloudflare |

## 6.8 初心者がよく聞く質問

**Q：クラウドのマネージドサービスを使うべきか、VPS で全部自己ホストすべきか？**

- **個人プロジェクト / 学習：** VPS で自己ホスト（全部 Docker Compose）——安く済み、学びも多い。
- **実ユーザーがいる本番：** データベースとオブジェクトストレージはマネージドサービスを使う（自動バックアップ、安定性）。アプリ本体は VPS で OK。
- **資金がある / チームプロジェクト：** 可能な限りクラウドのマネージドサービスを使う——運用ではなくビジネスロジックに時間を使う。

**Q：AWS フリーティアを課金されずに使うには？**

1. 常に **t2.micro/t3.micro** インスタンスを起動（「Free tier eligible」と表示されている）
2. **請求アラーム（Billing Alarm）** を0ドルまたは1ドルで設定（Billing Dashboard → Budgets → Create budget）
3. 使い終わったらリソースを**停止・削除**：EC2 インスタンス、RDS データベース、S3 バケット、EBS ボリューム、Elastic IP
4. EBS ボリュームと Elastic IP は**インスタンス停止中も削除しなければ課金が続く**ことに注意
5. Billing Dashboard を毎月確認

**Q：AWS と他の VPS プロバイダーはどう使い分ける？**

- AWS エコシステムの学習 / クラウド関連の仕事を目指す → AWS フリーティアを使う
- とにかく早くデプロイ、シンプルなプロジェクト、最安コスト → DigitalOcean（月4ドル）または Hetzner（月3.49ユーロ）
- 時間単位のテスト → Vultr（時間課金、いつでも削除）
- AI/GPU ワークロード → Modal または Lambda Labs
- 完全無料で24時間365日のコンテナ → Fly.io 無料枠

---

# 7. AI エージェント向けデプロイプラットフォーム

AI エージェント（通常の Web アプリではなく）をデプロイするなら、AI ワークロード専用に設計されたプラットフォームがあります：

## 7.1 Modal — Python AI/ML 向けサーバーレス GPU

**ウェブサイト：** https://modal.com

**こんな人におすすめ：** GPU 推論が必要な Python AI プロジェクト、スケジュールジョブ、バッチデータ処理

**特徴：**
- Python デコレータで関数を定義し、`modal deploy` でワンコマンドデプロイ
- GPU コンテナのコールドスタート約1秒、ミリ秒単位で課金
- スケジューリング、シークレット管理、共有ストレージが組み込み
- 無料プランに月30ドルのクレジット（ほとんどの個人プロジェクトで十分）
- Python のみ対応

```python
import modal
app = modal.App("my-ai-agent")

@app.function(gpu="A10G", timeout=300)
def run_agent(prompt: str):
    # ここで AI モデル/エージェントを実行
    return result
```

## 7.2 Hugging Face Spaces — AI デモの第一候補

**ウェブサイト：** https://huggingface.co/spaces

**こんな人におすすめ：** AI デモ（Gradio/Streamlit UI）の公開、オープンソースモデルの展示

**特徴：**
- 無料の小型 CPU インスタンス。GPU は有料
- Gradio、Streamlit、Docker に対応
- 活発なコミュニティ。すべての Space はコードとディスカッションが公開
- 他人の Space をワンクリックでフォークして改変可能

## 7.3 Replicate — モデルを API に変える

**ウェブサイト：** https://replicate.com

**こんな人におすすめ：** サーバー管理なしで AI モデルを呼び出し可能な HTTP API にしたい

モデルをプッシュすると、Replicate が HTTP API にパッケージ化し、呼び出しごとに課金します。ファインチューニングしたモデルを公開するのに最適です。

## 7.4 Lambda Labs — オンデマンド GPU インスタンス

**ウェブサイト：** https://lambdalabs.com

**こんな人におすすめ：** AWS/GCP の GPU インスタンスより低コストで GPU を多用するトレーニングと推論を実行。A100、H100、A10 をオンデマンドで利用可能。

---

# 8. 🎯 Vibecoding デプロイワークフロー：AI を DevOps にしよう

これはバイブコーディング時代のデプロイで最も重要な考え方です：**すべてのコマンドを暗記する必要はない——AI があなたの DevOps 担当です。**

## 8.1 AI との2つの連携モード

**モード1：ローカルでスクリプトを生成し、手動で実行**

AI コーディングアシスタント（Claude Code、Trae Solo、Cursor）にこう伝えましょう：

> 「[プロジェクトの説明] を [プラットフォーム/サーバー] にデプロイしたい。以下を生成して：
> 1. ステップバイステップのデプロイチェックリスト
> 2. 必要な設定ファイルを全部（Nginx、PM2、Dockerfile、docker-compose）
> 3. deploy.sh デプロイスクリプト
> 4. 環境変数のチェックリスト」

あとは AI が生成したものを実行するだけです。

**モード2：AI が直接サーバーに SSH 接続（さらに簡単）**

Claude Code はリモート SSH 操作に対応しています：

```bash
claude
# こう伝えます：
# 「root@MY-IP に SSH 接続して /root/myapp をデプロイし、Nginx + HTTPS + PM2 を設定して」
```

AI が環境を自動チェックし、不足している依存関係をインストールし、コードを取得してビルド、設定、検証まで行います——自分でコマンドを打つ必要は一切ありません。

> ⚠️ **安全上の注意：**
> - まずテストサーバーで練習し、AI が破壊的な変更をしないことを確認する
> - 重要なデータは定期的にバックアップする
> - AI には最小権限のユーザーを与える（root は渡さない。sudo ユーザーでよいが、コマンドは確認する）
> - AI が危険なコマンドを実行する前に、何をしようとしているかレビューする

## 8.2 汎用デプロイプロンプトテンプレート

どのプラットフォーム/サーバーを選んでも、これを埋めて AI に送れば、実行可能な完全なプランが返ってきます：

```
Help me deploy a project with the following info:

[DEPLOYMENT TARGET]
- Platform/Server: [Vercel / Railway / Fly.io / Ubuntu 22.04 VPS / AWS EC2 / ...]
- Server IP (if VPS): xxx.xxx.xxx.xxx
- Already configured: [SSH key login / Docker installed / Nginx installed / ...]

[PROJECT INFO]
- Project type: [Next.js 14 / Vite+React / Node.js Express / Python FastAPI / ...]
- Code location: GitHub repo https://github.com/xxx/xxx
- Tech stack: Node.js 20 + PostgreSQL 16 + Redis 7
- Start command: npm run start
- Listens on port: 3000
- Environment variables: DATABASE_URL=xxx, JWT_SECRET=xxx, OPENAI_API_KEY=xxx

[DOMAIN]
- Domain: mydomain.com
- DNS already pointing to server: Yes/No
- Need HTTPS: Yes/No

[REQUIREMENTS]
1. Complete steps (list local vs server operations separately)
2. Provide all config files
3. Tell me how to verify successful deployment
4. List common gotchas and troubleshooting steps
```

## 8.3 AI を活用したトラブルシューティングの流れ

問題が発生したときは：

1. **まずログを確認：**
   - Nginx：`sudo tail -50 /var/log/nginx/error.log`
   - PM2：`pm2 logs myapp`
   - Docker：`docker compose logs app`
   - systemd：`sudo journalctl -u myapp -n 50`

2. **エラー全文をコンテキスト付きで AI にコピー：**
   > 「Node.js を Ubuntu にデプロイしていて 502 Bad Gateway が出ます。Nginx のエラーログ：[貼り付け]。設定：[貼り付け]。PM2 のステータス：[貼り付け]。デバッグを手伝ってください。」

3. **よくある問題の早見表：**
   - **502 Bad Gateway：** バックエンドが起動していない、ポートが間違っている、proxy_pass が誤っている
   - **IP にアクセスできない：** セキュリティグループでポートが許可されていない、ufw がブロックしている、Nginx が起動していない
   - **リフレッシュすると404：** Nginx に SPA ルーティング用の `try_files` がない
   - **静的アセットが404：** root パスが間違い、ファイルパーミッションの問題
   - **HTTPS 証明書が失敗：** ドメインがサーバーを向いていない、ポート80がブロックされている
   - **PM2 が再起動を繰り返す：** コードのバグでクラッシュ。`pm2 logs` で確認
   - **Vercel 関数のタイムアウト：** 10秒制限を超過——長時間タスクは Fly.io/Railway/VPS に切り替え
   - **Railway/Render の503：** サービスがスリープ中か、クレジット切れ
   - **AWS EC2 接続拒否：** セキュリティグループに SSH ルールがない、またはポートが間違い

---

# 9. デプロイ後のテクニック

## 9.1 ファイル転送

```bash
# ローカル → サーバー
scp ./file.zip yourname@IP:/home/yourname/
scp -r ./dir yourname@IP:/home/yourname/

# サーバー → ローカル
scp yourname@IP:/home/yourname/file.zip ./

# rsync（差分同期。デプロイにおすすめ）
rsync -avz --exclude=node_modules --exclude=.git ./project/ yourname@IP:/var/www/project/
```

## 9.2 ワンコマンド更新スクリプト

サーバー上に `deploy.sh` を作成します：

```bash
#!/bin/bash
set -e
cd /path/to/project
git pull origin main
npm install
npm run build
pm2 restart myapp
echo "✅ Deployment complete!"
```

更新は `bash deploy.sh` を実行するだけです。完全自動化するなら GitHub Actions を設定しましょう（CI/CD 設定は AI に書いてもらえます）。main へのコードプッシュで自動デプロイできます。

## 9.3 セキュリティ強化チェックリスト

AI に完全な強化スクリプトを生成してもらいましょう。通常は次の内容を含みます：
- パスワードログインを無効化し、SSH 鍵のみを使用
- デフォルトの SSH ポートを変更（22 → 別の番号）
- fail2ban をインストール（ブルートフォース攻撃の IP を自動で遮断）
- 自動セキュリティ更新を有効化：`sudo apt install unattended-upgrades`
- シークレットや .env を Git にコミットしない
- データベースの定期的なバックアップを S3 にスケジュール

---

# 10. 章のまとめ

**デプロイ方法のまとめ：**

| シナリオ | おすすめ | コスト | 難易度 |
|----------|------------|------|-----------|
| 純粋なフロントエンド/ドキュメント | Cloudflare Pages / Vercel / GitHub Pages | 無料 | ⭐ |
| Next.js フルスタック（高速応答） | Vercel | 無料 / 月20ドル | ⭐ |
| バックエンド API / ボット（常時稼働） | Railway / Fly.io（無料）/ VPS | 月0〜10ドル | ⭐⭐ |
| フルスタック（完全制御） | DigitalOcean / Vultr / AWS EC2 + Docker | 月4〜10ドル | ⭐⭐⭐ |
| AI エージェントのデモ | Hugging Face Spaces | 無料 | ⭐ |
| AI の GPU 推論 | Modal（グローバル） | 月0〜30ドルクレジット | ⭐⭐ |
| ユーザーがいる本番 | AWS/Azure/GCP マネージドサービス | 状況による | ⭐⭐⭐ |

**核となる5ステップを覚えましょう：**
1. **プラットフォームを選ぶ** → プロジェクトの種類に応じて（上の表を使う）
2. **コードをそこに運ぶ** → git push / rsync / GitHub 自動デプロイ
3. **環境を整える** → Node.js/Nginx/Docker をインストール（またはプラットフォームが処理）
4. **動かし続ける** → PM2 / Docker / systemd
5. **ドメイン + HTTPS** → DNS レコード + Certbot / ACM

**バイブコーディングの考え方：**
1. すべてのコマンドではなく、*何を*すべきかを理解する
2. 要件を明確に AI に伝える——AI が完全な解決策を出してくれる
3. AI が何をしているか理解し、重要なステップを確認する
4. エラーが起きたらログを AI に貼り付ける——90% の問題を診断してくれる
5. 重要なデータをバックアップし、最小権限を使う

一度デプロイすれば分かるはずです——公開はそんなに難しくない。🎯

---

<RelatedArticlesSection
  :articles="relatedArticlesMap['ja-jp/stage-2/backend/cloud-server-deployment']"
  title="関連記事"
  description="デプロイ前後のエンジニアリングスキルをさらに学びましょう。"
/>
