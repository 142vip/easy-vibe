---
title: ModelScopeでウェブサイトを公開する
description: ModelScope Studioと公式デプロイSkillを使い、HTML、Vue、React、Viteの静的サイトを公開します。
---

# ModelScopeでウェブサイトを公開する

ローカルで動くページができたら、次は他の人が開けるURLを用意します。この付録では、サーバーを一から設定せず、**ModelScope Studio**にサイトを公開します。

## 1. 公開する内容を確認する

| プロジェクト | Studioの種類 | 用意するもの |
| --- | --- | --- |
| HTML、CSS、JavaScript | Static | ルートに`index.html`があるWebファイル |
| Vue、React、Vite、Svelte | Static | ビルド後の`dist`または`build`の中身 |
| Gradio、Streamlit | 対応する種類 | Pythonの入口と依存関係 |
| バックエンドや独自のシステム依存がある | Docker | Dockerfileと起動できるサービス |

フレームワークを使う場合、ソースフォルダーではなく**ビルド結果**を公開します。

## 2. 公式デプロイSkillを使う

ModelScopeの[公式Skills](https://github.com/modelscope/modelscope-skills)にある`ms-studio-deploy`は、プロジェクト判定、Studio作成、ファイル同期、デプロイ、ログ確認を行います。

```bash
python -m pip install -U modelscope
modelscope skills add @ModelScope/ms-hub @ModelScope/ms-studio-deploy
```

[Access Tokenページ](https://modelscope.cn/my/myaccesstoken)でトークンを取得し、ローカルで設定します。Webサイト、README、共有画像には書かないでください。

Viteなら、先に次を実行します。

```bash
npm run build
cd dist
```

出力フォルダーをAIツールで開き、次のように頼みます。

```text
ms-studio-deploy Skillを使って、このフォルダーをModelScopeのStatic Studioに公開してください。成功したらURLを教えてください。
```

## 3. Web画面から手動で公開する

[ModelScope Studio](https://modelscope.cn/studios)を開いてログインします。

![ModelScope Studioのホーム画面](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/01-studios-home.jpg)

[Studio作成画面](https://modelscope.cn/studios/create)で所有者、名前、説明、公開範囲を入力します。

![Studio作成フォーム](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/02-create-studio.jpg)

SDKの種類は **Static** を選びます。

![Staticを選ぶ画面](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/03-select-static.jpg)

作成後に「ファイル」ページを開き、`index.html`、CSS、JavaScript、画像をアップロードします。`index.html`はルートに直接置き、`dist`フォルダーの中に残さないでください。

![Static Studioのファイル画面](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/04-studio-files.jpg)

保存してデプロイを待ちます。最終URLで、トップページ、スタイル、画像、モバイル幅、ブラウザーコンソールを確認します。公開Studioはログアウトしたウィンドウからも開いてください。

## 4. 更新とトラブル対応

ソースを変更したら、ローカルテスト、再ビルド、公開ファイルの置換、再デプロイの順で進めます。

- スタイルや画像がない：パスとViteの`base`を確認する
- 子ページの再読み込みで404：静的サイトではHashルーターも検討する
- ファイル一覧だけ表示される：ルートの`index.html`を確認する
- 秘密のAPIキーが必要：フロントエンドに置かず、バックエンドを使う

公式資料：[ModelScope Studio](https://modelscope.cn/studios)、[ModelScope Skills](https://github.com/modelscope/modelscope-skills)、[`ms-studio-deploy`](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md)。
