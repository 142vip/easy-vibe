---
title: 'Godot で横スクロール・ピクセル・3D ゲームを作る'
description: '三つの小さな実行可能プロトタイプと発売済み作品を通して、Godot の基本を学びます。'
---

# Godot で横スクロール・ピクセル・3D ゲームを作る

Godot は無料でオープンソースのゲームエンジンです。シーン編集、物理、アニメーション、音、入力、スクリプト、エクスポートを一つの環境で扱えます。この章では完成作品を装うのではなく、2D 横スクロール、ピクセル収集、3D グレーボックスを実際に動かします。

## 1. 最初に覚える四つの言葉

**ノード**は画像、カメラ、衝突、ライトなど一つの役割を持つ物体です。**シーン**は再利用できるノードの木です。**スクリプト**がノードの動作を作り、**GDScript** が Godot の標準的なスクリプト言語です。

![Godot エディターのシーンツリーと 2D 作業領域](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-editor-platformer.png)

## 2. 横スクロールの最小ルート

Primal Light は Godot Showcase の商用 2D アクションです。プラットフォーム、危険、目的地の輪郭が読みやすい点を参考にします。

![Primal Light 公式画像](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-primal-light.webp)

> プレイヤー、床、三つの足場、目立つゴールを持つ 2D ステージを作ってください。素材は単純な図形で構いません。

> 左右移動とジャンプを追加し、空中で二度ジャンプできないようにしてください。

![Godot 4.7.1 で動く Skyline Courier](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-platformer.png)

## 3. ピクセル画面の収集ループ

Dome Keeper は小さな画面の中で資源数と次の目的を明確に見せます。ゲーム内容ではなく情報の置き方を参考にします。

![Dome Keeper 公式画像](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-dome-keeper.webp)

> 320 × 180 のピクセルシーンに、プレイヤー、森、三つの収集物、カウンターを追加してください。

> 接触した収集物を消し、カウンターを一度だけ増やしてください。

![Godot 4.7.1 で動く Lantern Woods](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-pixel.png)

整数倍率で拡大し、ウィンドウと全画面の両方でぼやけないことを確認します。

## 4. 3D はグレーボックスから始める

Wrought Flesh は Godot 製の一人称ゲームです。空間の輪郭、照明、目的地の見せ方を観察できます。

![Wrought Flesh 公式画像](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-wrought-flesh.webp)

グレーボックスは正式なモデルを入れる前に、箱と平面で広さ、移動、視線を試すステージです。

> 床、壁、操作できるプレイヤー、カメラ、光る出口を持つ小さな 3D グレーボックスを作ってください。

> 方向光、環境光、影を追加し、出口までの道を読みやすくしてください。

![Godot 4.7.1 で動く Signal Garden](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-3d.png)

## 5. AI には一度に一件だけ頼む

> プレイヤー移動だけを追加し、ステージは変更しないでください。

> このエラーだけを修正してください：【エラーを貼る】。確認方法も教えてください。

動くループを先に作り、画像、モデル、音を一つずつ置き換えます。素材の出典とライセンスも残してください。

## 6. エクスポートは別の工程

エディターで動くことは開発版の確認にすぎません。**Editor → Manage Export Templates** で同じバージョンのテンプレートを入れ、**Project → Export** で対象プリセットを作ります。

デスクトップ版は Godot のない PC、Web 版はローカルサーバーまたは HTTPS、Android・iOS は SDK、署名、権限、実機で確認します。

三つの一時プロジェクトは macOS の Godot 4.7.1 で読み込みと実行を確認しました。Windows、Linux、Web、Android、iOS、コンソールへのエクスポートは完了とはしていません。

最も作りたい形に近い一つを選び、まず五分間の遊びをもう一度試したくなるところまで磨いてください。
