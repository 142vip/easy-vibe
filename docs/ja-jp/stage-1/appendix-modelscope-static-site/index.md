---
title: Vibe Codingの成果物をModelScopeで公開する
description: 純粋なHTMLからVue、React、Viteのビルド成果物まで、公式SkillとStatic Studioを使って公開する完全ガイド
---

# Vibe Codingの成果物をModelScopeで公開する

ローカルで動くWebページができたら、友人や利用者が直接開ける場所へ公開します。

自分でサーバー、ドメイン、HTTPS、デプロイを設定する方法もありますが、ここでは運用作業を減らすため、**ModelScope Studio**へ公開します。

ModelScopeはAlibabaとCCFオープンソース発展委員会が共同で立ち上げたコミュニティです。20万を超えるオープンソースモデルと3万を超えるデータセットに加え、アプリを展示する **Studio** も提供しています。Studioを使えば、サーバー運用を先に学ばなくても無料で共有URLを用意できます。

> 本文は現在のStudio画面、公式Skill、コマンド資料を基に **2026年8月11日** に確認しました。ボタンの位置が変わっても、「Static Studioを作成 → ビルド成果物をアップロード → デプロイ → URLを確認」という流れは同じです。

StudioはGradio、Streamlit、Dockerに加え、すでにビルド済みのWebサイト向けに`static`形式を用意しています。最終成果物が`index.html`、CSS、JavaScript、画像なら、この形式を使えます。

公開後のURLは次のようになります。

```text
https://modelscope.cn/studios/ユーザー名/Studio名
```

## 公開方法を正しく選ぶ

| プロジェクト | Studio形式 | 公開前の準備 |
| --- | --- | --- |
| HTML / CSS / JavaScript | **Static** | ビルドせずWebファイルを用意する |
| Vue、React、Vite、Svelte | **Static** | ローカルでビルドし、`dist`または`build`の中身だけを公開する |
| Gradio | Gradio | `app.py`と`requirements.txt`を用意する |
| Streamlit | Streamlit | 入口ファイルと依存関係を用意する |
| 独自バックエンドやシステム依存がある | Docker | Dockerfileを書き、指定ポートでサービスを起動する |

この章で扱うのは上の二つです。**VueやReactのソースをそのままStaticへ置かないでください。** 閲覧者のブラウザーは`npm install`や`npm run build`を実行できません。

## 推奨：公式Skillで公開する

ModelScopeは[公式Skills](https://github.com/modelscope/modelscope-skills)を公開しています。

| Skill | 役割 | 使用場面 |
| --- | --- | --- |
| `ms-hub` | リポジトリ、モデル、データセット、Studio、MCP、Skills Centerの共通入口 | 初めてModelScopeへ接続するときや一般操作 |
| `ms-studio-deploy` | プロジェクト判定、Studio作成、Git同期、デプロイ、ログ確認、診断 | **ローカルWebサイトの公開と更新に優先して使う** |

`ms-studio-deploy`はルートの`index.html`を見て`static`と判断します。ただしStatic Studioは`npm run build`を実行しないため、フレームワークのビルドはローカルで済ませます。

### Skillをインストールする

```bash
python -m pip install -U modelscope
modelscope skills add @ModelScope/ms-hub @ModelScope/ms-studio-deploy
```

`modelscope`に`skills`サブコマンドがない場合は公式スクリプトを使います。

```bash
curl -fsSL https://modelscope.cn/skills/install.sh | bash -s -- @ModelScope/ms-hub
curl -fsSL https://modelscope.cn/skills/install.sh | bash -s -- @ModelScope/ms-studio-deploy
```

Skillは既定で`~/.agents/skills/`へ入ります。インストール後にCodex、Cursor、Claude Codeなどのセッションを開き直し、Skill一覧を更新してください。

### Skillで公開する

公式[`ms-studio-deploy`ガイド](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md)に従い、次の三点を準備します。

1. Skillをインストールし、Agentのセッションを開き直す。
2. 公開するディレクトリを開き、ルートに`index.html`を置く。
3. ModelScope Access Tokenをローカルに設定する。

[Access Tokenページ](https://modelscope.cn/my/myaccesstoken)でトークンを取得し、ターミナルへ設定します。

```bash
export MODELSCOPE_API_KEY="あなたのトークン"
```

純粋なHTMLならWebディレクトリを直接開きます。Vue、React、Viteなら先にビルドします。

```bash
npm run build
cd dist
```

Viteは通常`dist`、別のツールが`build`を作る場合はそちらへ移動します。そのディレクトリをAgent Skills対応ツールで開きます。

#### 最短の指示

```text
ms-studio-deploy Skillを使い、このWebサイトをModelScopeのStatic Studioへ公開してください。動作したらURLを教えてください。
```

Skillは`index.html`とログイン情報を確認します。新しいStudioが必要なら名前と公開範囲を尋ねます。初回は非公開が安全です。

条件を先に伝える場合は次のようにします。

```text
ms-studio-deploy Skillを使い、このディレクトリをModelScope中国サイトのStatic Studioへ公開してください。
Studio名はmy-portfolio、最初は非公開にします。デプロイ後に状態とログを確認してください。
失敗したらログから原因を直して再デプロイし、動作するURLを返してください。
```

#### AIが行う処理

```text
プロジェクト形式を判定 → 中国サイトか国際サイトか確認 → アカウント情報を取得
→ Studioを作成または再利用 → 機密ファイルを確認 → masterへ同期
→ デプロイ開始 → 状態とログを確認 → 診断と修正 → URLを返す
```

初回は非公開で確認し、問題がなければ公開へ変えます。Staticサイトに有料ハードウェアは不要です。他形式で有料資源が必要な場合、Skillは先に明確な許可を求めます。

トークンはAPI認証とGit pushに使われます。Webソース、README、指示文、共有画像へ書かないでください。

## 手動操作：第0段階 — 公開できるサイトを用意する

Skillを使わない手順も、画面を理解したいときやAgentが使えないときに役立ちます。

### A：純粋なHTML

`index.html`を公開内容のルートに置きます。

```text
my-site/
├── index.html
├── styles.css
├── app.js
└── images/
    └── cover.jpg
```

公開前にHTTPサーバーで確認します。

```bash
cd my-site
python3 -m http.server 8000
```

`http://localhost:8000`を開きます。`index.html`をダブルクリックするだけでは不十分です。`file://`とHTTPではモジュール、CORS、パスの動作が違います。

### B：Vue、React、Viteなど

```bash
npm install
npm run build
```

| ツール | 一般的な出力先 |
| --- | --- |
| Vite / Vue + Vite / React + Vite | `dist/` |
| Create React App | `build/` |
| Vue CLI | `dist/` |

出力ディレクトリの**中身**を公開し、Studioのルートに`index.html`が直接現れるようにします。

```text
正しい：index.html
誤り：  dist/index.html
```

CSS、JavaScript、画像が404になる場合は、Viteの基準パスを相対にします。

```js
// vite.config.js / vite.config.ts
export default {
  base: './'
}
```

変更後に再ビルドします。静的ホストは全パスを`index.html`へ戻さない場合があるため、SPAでは`/#/about`のようなHashルーターも選べます。

## 手動操作：第1段階 — Studioを開いてログインする

[ModelScope Studio](https://modelscope.cn/studios)を開きます。上部に「作成 → 構築 → 公開 → 共有」の流れが表示されます。

![作成から共有までを示すModelScope Studioのホーム](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/01-studios-home.jpg)

作成ボタンまたは[Studio作成ページ](https://modelscope.cn/studios/create)を開きます。中国サイト`modelscope.cn`と国際サイト`modelscope.ai`のアカウント、トークン、内容は共有されません。

## 手動操作：第2段階 — Studioの基本情報を入力する

![所有者、名前、ライセンス、公開範囲、説明を入力する画面](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/02-create-studio.jpg)

1. **所有者または組織**：URLの所有者部分を決めます。
2. **Studio名**：`my-portfolio`のように小文字、数字、ハイフンを使います。
3. **表示名と説明**：訪問者に分かる言葉で書きます。
4. **公開範囲**：初回は非公開、確認後に公開します。
5. **ライセンス**：プロジェクトに合わせて選びます。

内容を確認して作成し、詳細ページが開くまで待ちます。

## 手動操作：第3段階 — Webファイルをアップロードする

稼働中のStatic Studioでは、`index.html`と`README.md`がリポジトリのルートにあります。

![ルートにindex.htmlとREADME.mdがあるStatic Studioのファイル画面](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/04-studio-files.jpg)

**Files**ページへ`index.html`、CSS、JavaScript、画像をアップロードします。`dist`、`build`、プロジェクトフォルダーをもう一階層置かないでください。

少数ファイルなら手動で構いません。ファイルや更新が多い場合は`ms-studio-deploy`でGit同期します。

## 手動操作：第4段階 — デプロイ設定でStaticを選ぶ

ファイルをアップロードしたら、Studioのデプロイ設定を開き、SDK形式に **Static** を選びます。Staticは準備済みのHTMLサイト向けです。同じ画面にはGradio、Streamlit、Dockerも表示されます。

![デプロイ設定のSDK欄でStaticを選ぶ画面](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/03-select-static.jpg)

リポジトリのルートに`index.html`があることをもう一度確認し、デプロイ設定を保存します。

> データベース、秘密のAPIキー、サーバー計算が必要なら純粋な静的サイトではありません。Gradio、Streamlit、Docker、または別のバックエンドを使います。フロントエンドJavaScriptに置いたキーは秘密になりません。

## 手動操作：第5段階 — デプロイを待って確認する

デプロイ設定を保存すると通常は自動でデプロイされます。始まらない場合はデプロイ、再起動、再実行を選びます。実行中になったら次の形式のURLを開きます。

```text
https://modelscope.cn/studios/ユーザー名/Studio名
```

- トップページが開くか
- CSS、JavaScript、画像が読み込まれるか
- コンソールに404、CORS、JavaScriptエラーがないか
- モバイル幅でも使えるか
- 公開Studioをログアウトしたウィンドウでも開けるか

非公開Studioは動作確認後に公開へ変更し、ログアウト状態でも再確認します。

## 手動操作：第6段階 — 公開済みサイトを更新する

ソース変更後はローカルテストと再ビルドを行い、**Files**ページで古い成果物を新しい`dist`または`build`の中身へ置き換え、再デプロイします。

```text
ソース変更 → ローカルテスト → 再ビルド → Studioのファイルを置換
→ 再デプロイ → 最終URLを確認
```

`node_modules`、開発設定、完全なソースプロジェクトは公開しません。更新が増えたらSkill方式へ移ります。

## トラブル対応にもSkillを使う

<ModelScopeTroubleshooter />

## 資料

- [ModelScope Studio](https://modelscope.cn/studios)（画面と画像は2026-08-11確認）
- [ModelScopeコア開発者交流会](https://community.modelscope.cn/683562c6870cef7360622f7f.html)
- [公式`ms-hub`手順](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-hub/SKILL.md)
- [公式`ms-studio-deploy` Skill](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md)
- [ModelScope Hubクライアント](https://github.com/modelscope/modelscope_hub)
- [公開Static Studio例](https://modelscope.cn/studios/studio-demo-station/funasr-demo-static-multiple/summary)
