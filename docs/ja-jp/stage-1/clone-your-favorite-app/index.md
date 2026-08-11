---
title: 'スクリーンショットから複製：初めての模倣練習'
description: '製品のスクリーンショット1枚から、実際に開いて操作できるWebページやミニゲームを作ります。'
---

# スクリーンショットから複製：初めての模倣練習

前の授業では、一文でAIにプログラムを書かせました。今回は、もっと目で追いやすい方法を使います。**好きなスクリーンショットを1枚選び、AIにその画像を見せて作ってもらいます。**

画像には色、余白、ボタン、配置がすでに写っています。私たちは、それをどんな動く作品にしたいかを伝えます。

## 1. 小さな題材を一つ選ぶ

最初は一画面だけにします。製品のトップページ、SaaSのダッシュボード、または操作が一つだけのミニゲームから選んでください。完成後に比較できるよう、元の画像も保存します。

## 2. 最初のWebページを一緒に作る

授業ではFramerの画面を使いました。ナビゲーション、大きな見出し、紫色の山、操作ボタンが一枚で確認できます。

![Framerの参考画面](../../../zh-cn/stage-1/clone-your-favorite-app/images/framer-official-interface.jpg)

_出典：[Framer Website Builder](https://www.framer.com/solutions/website-builder/)_

空のフォルダーを作ってTraeで開き、画像をチャットへドラッグします。次の一文を送ります。

```text
この画像を参考にWebページを作ってください。完成したら開いて見せてください。
```

Traeがファイルを作成して起動するまで待ちます。授業で実際に生成した結果はこちらです。

![参考画像から生成して実行したWebページ](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-wishlabs.gif)

まだコードは読みません。ページが開くか、主要な内容が見えるか、元の構成に近いかを確認します。

見出しが小さければ、一つだけ直します。

```text
中央の見出しをもう少し大きくしてください。
```

## 3. 自分の画像で作る

別の空フォルダーを作り、自分の画像を入れて次のように頼みます。

```text
この画像を参考にWebページを作り、完成したら開いてください。
```

見た目だけを参考にしたい場合は、次の一文を加えます。

```text
デザインは画像を参考にし、名前と内容は新しいものに変えてください。
```

最初の版が表示されたら、主要なボタンをクリックし、ウィンドウを狭くして崩れないか確認します。

## 4. ダッシュボードやゲームでも試す

Linearの画面は、左にナビゲーション、右にカードとグラフがあり、構造を練習しやすい例です。

![Linear Dashboardの参考画像](../../../zh-cn/stage-1/clone-your-favorite-app/images/linear-official-dashboard.png)

_出典：[Linear Dashboards](https://linear.app/docs/dashboards)_

```text
このようなダッシュボードを作ってください。データは仮のもので構いません。
```

![授業で生成して動かしたダッシュボード](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-linear-dashboard.gif)

Minecraftの画面からミニゲームを作ることもできます。

![Minecraft Creative Modeの参考画像](../../../zh-cn/stage-1/clone-your-favorite-app/images/minecraft-official-creative-mode.png)

_出典：[Microsoft LearnのMinecraft例](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/108)_

```text
このようなブロックゲームを作ってください。キャラクターを動かし、ブロックを置けるようにしてください。
```

![授業で生成した2Dブロックゲーム](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-block-game.gif)

一人称視点の世界が欲しい場合は、「3D」と明確に書きます。

```text
このような3Dブロックゲームを作ってください。歩く、視点を回す、ブロックを置く操作を入れてください。
```

![授業で生成した3Dブロックゲーム](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-3d-block-game.gif)

## 5. 一度に一つだけ直す

最初の版が不完全でも問題ありません。いちばん目立つ問題を普段の言葉で伝えます。

```text
上のカードが高すぎます。少し低くしてください。
```

```text
このボタンを押しても反応しません。直してください。
```

変更のたびにページを開き直し、自分で操作します。一つのメッセージに関係のない修正を何個も詰め込まないようにします。

## 6. 提出前の確認

- 再読み込みしても開く
- 見た人がWebサイト、ダッシュボード、ゲームのどれか分かる
- 主要なボタンやゲーム操作が使える
- 画面幅を狭くしても文字と画像が大きく重ならない

最後に参考画像と作品を並べ、どこを自分で直したか一つ説明してください。手順は「画像を選ぶ、AIに渡す、一文で頼む、見えた問題を少しずつ直す」です。
