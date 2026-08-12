---
title: 'ダブルダイヤモンドモデル：正しいことをして、正しくやる'
description: 'ゼロベースの読者向け Double Diamond 入門記事。Discover、Define、Develop、Deliver の4つの段階を理解し、問題が明確になる前にプロトタイプを作り始めるのを防ぐ。'
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'
</script>

# ダブルダイヤモンドモデル

<a id="top-dd"></a>

要件分析とユーザーインタビューを終えると、さまざまなユーザーの経験、既存ツールの問題、改善できそうな方向など、多くの材料が集まります。材料が増えた後に生じる新しい課題は、何を残し、何を見送るかです。

「問題を理解すること」と「解決策を設計すること」を分けなければ、インタビューをしながら、自分が好む機能を正当化する根拠を探してしまいがちです。ダブルダイヤモンド（Double Diamond）は、二度の発散と収束によって、この二つの作業を分離します。

本章では Discover、Define、Develop、Deliver の四段階を取り上げ、それぞれの入力、成果物、よくある誤りを説明します。

<a id="dd-what"></a>
## [1. 二度の発散と収束](#top-dd)

ダブルダイヤモンドモデルは、英国の**Design Council**が提唱した古典的なデザインプロセスフレームワークです。完全なデザイン・イノベーションプロセスを、2つの連続したダイヤモンド形で表します。

「ダイヤモンド」の形になっているのは、各ダイヤモンドが相反するがどちらも重要な2つのアクションを含んでいるからです：

- **発散**：まず視野を広げ、より多くの可能性を見る
- **収束**：次に範囲を絞り、判断と取捨選択を行う

全プロセスは4つのステップからなります：

1. **Discover**：ユーザー、問題、環境、市場を広く理解する
2. **Define**：大量の情報から、本当に解決すべき核心問題を抽出する
3. **Develop**：核心問題を中心に複数のソリューションを発散させる
4. **Deliver**：スクリーニング、プロトタイプ、テスト、そしてより適切なソリューションを納品する

前半の二段階は問題空間を、後半の二段階は解決策空間を扱います。

<figure class="field-figure field-figure--diagram">
  <a href="https://www.designcouncil.org.uk/resources/framework-for-innovation/" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/design-council-double-diamond-wide.png" alt="Discover、Define、Develop、Deliver からなる Design Council 公式のダブルダイヤモンド図" loading="lazy" />
  </a>
  <figcaption><strong>まず原図を見てみましょう。</strong>左のダイヤモンドは Discover で発散し、Define で収束します。右側は Develop で再び発散し、Deliver で収束します。Design Council は、これが一方向に一度だけ進む直線的な工程ではなく、テストで問題が見つかれば前の段階に戻れることも示しています。出典：<a href="https://www.designcouncil.org.uk/resources/framework-for-innovation/" target="_blank" rel="noreferrer">Design Council</a>、<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>。</figcaption>
</figure>

## 2. 問題と解決策を分ける理由

初心者がプロダクトを作るとき、最もよくあるリズムは次のようになります：

- アイデアを思いつく
- この方向性がかっこいいと思う
- すぐにプロトタイプを作り始める
- 作っているうちに機能が増えていく
- 最終的に自分が何を解決しているのか分からなくなる

ダブルダイヤモンドモデルの価値は、プロセスを複雑にすることではなく、**「問題を理解する」と「ソリューションを設計する」を切り離す**ことにあります。

これはシンプルに聞こえますが、実は非常に重要です。なぜなら、多くの失敗したプロダクトは、実行が不真面目だったのではなく：

- 間違った問題を選んだ
- ユーザーを誤解した
- ソリューションを早すぎるとロックした
- 大量の時間を細部の磨き上げに費やし、方向性を検証しなかった

ダブルダイヤモンドモデルは常に次のように提醒します：

- 思いつきやすいからといって、問題が成立していると早とちりしない
- ソリューションを作れるからといって、それが作る価値があるとは限らない
- プロトタイプが完全に見えるからといって、ユーザーが本当に必要とするとは限らない

<a id="dd-first"></a>
## [3. 最初のダイヤモンド：問題空間](#top-dd)

最初のダイヤモンドが焦点を当てるのは**問題そのもの**であり、ソリューションではありません。

このダイヤモンドの成果物は問題定義であり、プロダクトのプロトタイプではありません。

### 3.1 Discover：まず問題空間を広げる

Discover段階の核心的なタスクは、**広く調査することであり、早急に結論を出すことではありません。**

このステップで通常行うことには以下が含まれます：

- ユーザーが実際のシナリオでどう行動しているかを見る
- 潜在ユーザーにインタビューし、最後に問題に遭遇したのがいつかを理解する
- 現在どうやって代替手段で対処しているかを見る
- 競合や代替ソリューションの対応方法を確認する
- 市场、プロセス、制約、サプライチェーンの情報を収集する

多くの人はDiscoverを「資料をたくさん見ること」と誤解しがちです。実はもっと重要なのは：**情報とデータではなく、人とシナリオを理解することです。**

例えば「AIで議事録を整理するツール」を作りたい場合、Discover段階では以下に注目すべきです：

- ユーザーが会議後に最も苦痛に感じるのはどこか
- 議事録か、整理か、それとも共有か
- 現在は自分で書いているのか、インターンに頼んでいるのか、録音を聞き直しているのか、それとも整理していないのか
- どの会議シナリオで議事録が最も必要で、どのシナリオでは不要なのか

このステップの最も重要な目標は答えを出すことではなく、**早すぎる段階で答えが分かったと思い込まないことです。**

<figure class="field-figure">
  <a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/creative-commons-design-workshop.jpg" alt="インタビュー項目ごとに多数の付箋を整理した Creative Commons のユーザビリティ調査ワークショップ" loading="lazy" />
  </a>
  <figcaption><strong>実際の Discover で集まる材料は雑多です。</strong>Creative Commons は 2018 年のユーザビリティ調査で 81 件のインタビューを行い、さらに既存の 36 件も整理しました。写真では、紙ごとに質問を分け、付箋に回答を記録し、丸印で比較しています。この段階では違いを残し、一つの答えへ急いでまとめていません。写真と事例：<a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">Creative Commons</a>、<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>。</figcaption>
</figure>

### 3.2 Define：大量の情報から核心問題を抽出する

Discoverが視野を広げることだとすれば、Defineは収束を始めることです。

Define段階でやるべきことは、すべての観察を残すことではなく、次の問いに答えることです：

- 本当に最優先で解決すべき問題はどれか
- どの問題が最も頻繁に発生し、最も痛みが強く、最も価値があるか
- 第1版ではどのシナリオに絞るべきか

このステップの核心は、幅広いトピックを明確な問題定義に収束させることです。

例えば最初はこう言っていたかもしれません：

> 会議の効率を高めるAIツールを作りたい。

Define段階に到達すると、より良い表現は次のようになるかもしれません：

> プロジェクト型チームが30〜60分の協働会議を終えた後、10分以内にToDo、担当者、期限付きの議事録を出力できない問題を、まず解決する。

ここで問題が明確になり始めます：

- ユーザーは誰か
- シナリオは何か
- ボトルネックは何か
- 成功基準は何か

Defineの本質は、**「問題がたくさんある」状態から「今回はどの問題を先に解決するか」への収束です。**

<figure class="field-figure">
  <a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/creative-commons-research-synthesis.jpg" alt="Creative Commons チームがインタビューの付箋を並べ、分類し、テーマを付けた調査整理の壁" loading="lazy" />
  </a>
  <figcaption><strong>Define は、耳ざわりのよい一文を選ぶ作業ではありません。</strong>同じ事例では、117 件のインタビューを集約して分類し、繰り返し現れるパターンから 9 件の洞察を導きました。図に見える余白、まとまり、色の違いは、生の回答からテーマと優先順位へ進む中間工程です。写真と事例：<a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">Creative Commons</a>、<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>。</figcaption>
</figure>

## 4. 二つ目のダイヤモンド：解決策空間

最初のダイヤモンドを完了して初めて、2つ目のダイヤモンドに進むのが適切です。なぜなら、この時点で解決しているのは曖昧な方向ではなく、収束された具体的な問題だからです。

### 4.1 Develop：核心問題を中心にソリューションを発散させる

Develop段階の重点は、**同じ問題に対して、複数の可能なソリューションを探索することです。**

なお、ここの発散はDiscover段階のものとは異なります：

- Discoverの発散は、問題空間を探索すること
- Developの発散は、ソリューション空間を探索すること

議事録の例で言えば、Develop段階では以下のことを考え始めることができます：

- Webツールにするのか、会議プラグインにするのか
- 録音をアップロードしてから処理するのか、リアルタイムで記録するのか
- 要約だけにするのか、ToDo抽出をメインにするのか
- 個人効率を強調するのか、チーム共有を強調するのか
- ユーザーに自由に編集させるのか、構造化テンプレートとして直接出力するのか

このステップはブレインストーミングに適しており、チームと一緒にソリューションを広げるのにも適しています。

ただし、ここには一つの前提があります：**すべてのソリューションは、定義済みの同じ問題にサービスする必要があります。**
問題が明確に定義されていないと、Developは再び機能の乱れに戻ってしまいます。

<figure class="field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_WMDE_1.jpg" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/develop-idea-board.jpg" alt="複数の候補方向に色分けした付箋を広げた Wikimedia Deutschland のデザイン思考ワークショップのボード" loading="lazy" />
  </a>
  <figcaption><strong>Develop では、まず複数の答えを残します。</strong>このボードは Wikimedia Deutschland のデザイン思考ワークショップで使われたものです。候補となるアイデアをテーマごとに広げ、まだ一つの機能一覧にはまとめていません。発散の価値は付箋の枚数ではなく、選択する前に異なる経路を比較できることにあります。写真：<a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_WMDE_1.jpg" target="_blank" rel="noreferrer">Corinna Schuster（WMDE）/ Wikimedia Commons</a>、<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>。</figcaption>
</figure>

### 4.2 Deliver：ソリューションの選択、プロトタイプ、テスト、納品

Deliver段階は2つ目のダイヤモンドの収束段階です。

このときやるべきことは、さらに多くのアイデアを考えることではなく、判断を始めることです：

- 現在の段階に最も適したソリューションはどれか
- 最小で最も有用なバージョンはどれか
- どの機能を先に作る必要があり、どれは後回しでいいか
- プロトタイプ、テスト、小規模検証をどう進めるか

多くの人はDeliver＝「公開」と誤解しがちです。実際のより正確な意味は：**ソリューションをテスト可能、検証可能、反復可能なものに変えることです。**

それは次のようなものかもしれません：

- 低 fidelity のフロー図
- Figma プロトタイプ
- 動作するMVP
- 小規模なユーザーテスト
- 実際のフィードバック後の反復バージョン

Deliverのポイントは「完璧な納品」ではなく、**できるだけ早くソリューションを実際の環境で検証することです。**

<figure class="field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:TestingPaperPrototype.jpg" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/paper-prototype-test.jpg" alt="未実装の画面との操作を再現するため、紙のプロトタイプの入力欄に書き込む手" loading="lazy" />
  </a>
  <figcaption><strong>テスト可能であることは、コードが完成していることと同じではありません。</strong>紙に画面を描き、参加者がクリックや入力を行うたびに、調査者が次の紙へ差し替えます。フロー、文言、操作順を確かめながら、誤った方向を数週間かけて実装することを避けられます。写真：<a href="https://commons.wikimedia.org/wiki/File:TestingPaperPrototype.jpg" target="_blank" rel="noreferrer">d_jan / Wikimedia Commons</a>、<a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">CC BY 2.0</a>。</figcaption>
</figure>

## 5. 四つの段階の違い

ここまで、四つの段階をそれぞれ説明しました。次の図は、それらを一つの流れに並べたものです。段階を一つ選び、そこで行う作業、成果物、まだ行わないことを比較してみましょう。

<DoubleDiamondNavigator />

## 6. ダブルダイヤモンドモデルの最もよくある誤解

### 6.1 Discover前にいきなりDeliver

これが最もよくあるパターンです。アイデアを思いついた瞬間にプロトタイプを書き始め、PRDを書き、モデルを統合し、ページを作る。

問題は真面目にやっていないのではなく、問題が解決する価値があるかどうかをまだ確認していない可能性があることです。

### 6.2 Discoverを長くやりすぎて、Defineに入らない

もう一つの極端な例は、ずっと調査し、ずっと資料を見続け、ずっとインタビューしているのに、収束するのを恐れることです。

ダブルダイヤモンドは無限の発散を促すものではなく、発散の後には必ず判断と取捨選択に入る必要があることを提醒します。

### 6.3 Defineの後、こっそり問題を変える

多くのチームはDevelop段階で、あるソリューションが作りやすいからといって、逆に問題定義を変更して既存のソリューションに適合させようとします。

これは非常に危険です。なぜなら、問題を解決しているのではなく、自分の好きなソリューションに理由を見つけているだけかもしれないからです。

### 6.4 Deliverを「すべて盛りで公開」と誤解する

Deliverは完全なプロダクトをすべて作り終えて初めて終わりという意味ではありません。多くの場合、テスト可能なプロトタイプ、1回の実際のユーザートライアルが、すでに良いdeliverです。

## 7. AIプロダクトで、ダブルダイヤモンドモデルをどう使うか

AIプロダクトは特に「能力先行」の罠に陥りやすいです。なぜならモデルの能力があまりにも魅力的に見えるからです。以下のことを考え始めたくなります：

- マルチモーダルを統合するかどうか
- Agentにするかどうか
- ワークフローを追加するかどうか
- 音声、画像、インターネット検索を統合するかどうか

しかし、ダブルダイヤモンドモデルはまず以下の問いを強制します：

- ユーザーはどのステップで本当に詰まっているのか
- このボトルネックは本当にAIでなければ解決できないのか
- AIを使わない場合、既存の方法はどこが最も悪いのか
- AIを加えた後、最も核心的な進展は何か

これはよくある状況を回避するのに役立ちます：**能力は強いが、価値は弱い。**

実用的な順序は次の通りです：

1. Discover段階でユーザーが現在タスクをどう処理しているかを観察する
2. Define段階で最も痛みの強いシナリオを一文の明確な問題定義にする
3. Develop段階でどのAI能力がこの問題に最も適しているかを比較する
4. Deliver段階で最小バージョンを作り、実際のユーザーにテストしてもらう

## 8. そのまま使えるダブルダイヤモンドテンプレート

自分のプロダクトを作っている場合は、まずこの順序に従って書いてみてください：

### Discover

- 観察したユーザーは誰ですか？
- そのユーザーが最後にこの問題に遭遇したのはいつですか？
- 現在どうやって解決していますか？
- 最も煩わしい、最も遅い、最も不安な部分はどこですか？

### Define

- この山積みの問題の中で、最も優先して解決すべきものはどれですか？
- どのシナリオが最も頻度が高い、または最も重要ですか？
- 第1版ではまず誰にサービスし、何だけを解決しますか？
- 問題が解決された後、ユーザーの状態はどう変わりますか？

### Develop

- この問題に対して、どのような可能なソリューションがありますか？
- どのソリューションが最も軽く、最も速く、最も検証しやすいですか？
- 何を必ずやる必要があり、何は後回しにできますか？

### Deliver

- この方向を検証するために、最小で何を納品できますか？
- フロー図、プロトタイプ、それともMVPですか？
- 誰にテストを依頼しますか？
- テスト後、継続、修正、中止をどう判断しますか？

<figure class="field-figure field-figure--portrait">
  <a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_WMDE_Gruppenarbeit_2.jpg" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/wmde-group-workshop.jpg" alt="Wikimedia Deutschland のデザイン思考ワークショップで参加者がテーブルを囲み、案を形にしている様子" loading="lazy" />
  </a>
  <figcaption><strong>Develop は、座ってよいアイデアを待つ段階ではありません。</strong>案を早く目に見える形にすると、比較、組み合わせ、見送りが容易になります。写真：Corinna Schuster（WMDE）、<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>。</figcaption>
</figure>

## 9. ゼロベースでも理解できる例

「大学生の就職活動用レジュメ作成を支援する」AIツールを作りたいと仮定します。

多くの人は最初から2つ目のダイヤモンドに入り、次のことを考え始めます：

- ワンクリックで美しくするかどうか
- AIで書き直すかどうか
- JDと自動マッチングするかどうか
- 自己紹介を生成するかどうか

しかし、ダブルダイヤモンドモデルに従えば、より良いプロセスは次のようになります：

### 最初のダイヤモンド

**Discover**

- 新卒学生が最後にレジュメを修正したのがいつかを聞きに行く
- 古いレジュメをどうやって新しいバージョンに変えたかを見る
- 最も苦痛なのが「書き方が分からない」「修正の仕方が分からない」なのか、「良し悪しの判断ができない」なのかを理解する

**Define**

- 最終的により具体的な問題に収束する：
- 「大学生がレジュメを作れない」ではなく
- 「初めてインターンに応募する学生が、既存の経験をポジションに合った表現に書き直せず、応募を先延ばしにしている」

### 2つ目のダイヤモンド

**Develop**

- いくつかのソリューションを考える：テンプレートライブラリ、AI書き直し、ポジション比較、レジュメスコアリング、ケース参考

**Deliver**

- 第1版は「ポジション記述に基づいて経験のbullet pointsを書き直す」機能のみ
- 5人の学生に試用してもらい、最初の版のレジュメをより早く提出できるかどうかを確認する

最初のダイヤモンドをしっかりやれば、2つ目のダイヤモンドはずっと明確になることが分かるでしょう。

<figure class="field-figure field-figure--artifact">
  <a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_Prototyp_Mitmach-O-Mat.png" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/wmde-workshop-prototype.png" alt="Wikimedia Deutschland のデザイン思考ワークショップで制作された Mitmach-O-Mat の手描き画面" loading="lazy" />
  </a>
  <figcaption><strong>プロトタイプは、一つの問いに答えられれば十分です。</strong>完全なビジュアルシステムがなくても、参加者が次の操作を理解できるか観察できます。Deliver の目的は完成品らしく見せることではなく、フィードバックを得ることです。プロトタイプ：Corinna Schuster / WMDE、<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>。</figcaption>
</figure>

<a id="dd-ai"></a>
## [10. ダブルダイヤモンドの工程で AI を使う](#top-dd)

ダブルダイヤモンドモデル自体はAIツールではありませんが、AIは4つの段階で「アクセラレーター」として非常に適しています。重要なのは、AIに意思決定を任せるのではなく、視野の拡大、情報の整理、ソリューションの比較、検証資料の生成を支援させることです。

### 11.1 Discover段階で、AIを使ってまず情報の基盤を作る

正式なインタビューや調査の前に、AIに軽量な問題スキャンをさせると良いでしょう：

- 市場にある一般的な代替ソリューションは何か
- ユーザーが公開コミュニティで最もよく不満を言っているのは何か
- この問題はどのようなシナリオとユーザー層に多いか
- 既存のプロダクトが通常見落としているのは何か

このステップは実際の調査に代わるものではありませんが、問題マップを素早く構築するのに非常に適しています。

シンプルな初心者入力は次のようなものです：

```text
大学生のレジュメ添削を支援するツールを作りたい。
まず機能を考える前に、この問題で皆が最もよく遭遇するトラブルを見てほしい。
```

AIは次のような出力をするかもしれません：

```text
初期問題マップ：

1. どんな経験を書けばいいか分からない
2. ポジションに合わせてどう修正すればいいか分からない
3. 何度修正しても十分良いかどうか確信が持てない
4. 誰かに見てもらいたいが、毎回頼むのは気が引ける
5. 確信がないため、提出を先延ばしにしてしまう
```

この出力の目的は、あなたに代わって結論を出すことではなく、Discoverにより早く入るためのものです。

### 11.2 Define段階で、AIに問題定義の収束を支援させる

多くの人は資料をたくさん集めた後、問題を本当に明確な一文に圧縮するのが最も難しいと感じます。調査ノートをAIに渡して、複数の候補問題定義に圧縮してもらうことができます：

```text
以下はDiscover段階で収集したユーザーフィードバックと調査ノートです：
[内容を貼り付ける]

次の3つのことをしてください：
1. 最も頻繁に出現する問題パターンを分類・整理する
2. 問題の頻度、痛みの強さ、検証可能性に基づいて、優先的に解決すべき3つの問題を整理する
3. 各問題を具体的な問題定義の一文に書く
```

これにより、Defineによりスムーズに入れるようになります。「問題がたくさんある」状態に留まり続けることがなくなります。

入力を非常にシンプルに書くこともできます：

```text
現在収集した問題は以下の通りです：
1. 皆はレジュメに何を書けばいいか分からない
2. 皆はどう修正すればいいか分からない
3. 皆はいつもまだ十分に修正できていないと感じ、提出をためらう

第1版ではどの問題を先に解決するのが最も適切か見てほしい。
```

AIは次のような出力をするかもしれません：

```text
優先的に解決すべき問題：

「初めてインターンに応募する学生が、レジュメが提出可能なレベルに達しているか確信が持てず、何度も修正を繰り返して提出を先延ばしにしている。」

理由：
1. この問題はより具体的である
2. 先延ばし行動を説明できる
3. 小さなバージョンで検証しやすい
```

このような出力は非常に有用です。なぜなら、曖昧な問題の山からMVPの出発点により近い定義へと収束させてくれるからです。

### 11.3 Develop段階で、AIに複数のソリューションを発散させる

問題を定義した直後、頭に浮かんだ最初のソリューションだけに固執しがちです。AIはこのステップで強制的に発散させるのに非常に適しています：

```text
私はすでに核心問題を定義しました：[あなたの問題定義]
最終的な回答を直接出すのではなく、以下の角度からそれぞれ2〜3種類の解決方向を提案してください：
1. 最も軽量なMVP
2. ニーズ検証に最も適したソリューション
3. 体験向上に最も適したソリューション
4. AIに依存しないソリューション
5. AIに依存するソリューション
最後に各ソリューションのメリット、リスク、検証コストを比較してください。
```

これにより、一つのソリューションに早すぎる段階で縛られなくなります。

シンプルな入力は次のように書けます：

```text
私の現在の問題定義は：
「大学生はレジュメが提出可能かどうか確信が持てず、ずっと先延ばしにしている。」

4つの異なるソリューションを考えてほしい、1つだけでいいのにしないでほしい。
```

AIは次のような出力をするかもしれません：

```text
ソリューション1：レジュメ提出チェックリスト
ソリューション2：ポジション記述に基づく针对性のある書き直し
ソリューション3：ユーザーがレジュメをアップロードした後にリスク警告を提示
ソリューション4：優秀なケースとの照合を提供し、ユーザーがギャップを判断できるようにする
```

これにより、「ソリューションの比較」に入りやすくなり、最初からAI書き直しという一つの方向だけに固執しなくなります。

### 11.4 Deliver段階で、AIにプロトタイプのテキストとテスト資料の生成を支援させる

Deliver段階に入ると、AIは次の作業を加速するのに非常に適しています：

- 低 fidelity プロトタイプのページテキストの生成
- ユーザーテストスクリプトの整理
- 比較可能な複数バージョンのタイトル、ボタン、説明文の生成
- テスト後のフィードバックと問題リストの整理

例えば、AIに20分間のユーザーテストスクリプトを生成させたり、5人のユーザーフィードバックを「継続／方向修正／一時停止」の判断基準に整理させたりすることができます。

例えば、最もシンプルな入力は次のように書けます：

```text
非常にシンプルなプロトタイプを作った：
ユーザーがレジュメをアップロードすると、システムがどこがまだ提出に適していないかを教える。

15分間のユーザーテストスクリプトを生成してほしい。
```

AIは次のような出力をするかもしれません：

```text
15分間テストスクリプト：

1. まずユーザーに最近のレジュメ提出経験を説明してもらう
2. ユーザーに自力でレジュメのアップロードを完了してもらう
3. フィードバック結果を理解できるか観察する
4. 質問する：これらのヒントのうち、どれが最も役立ち、どれが混乱を招いたか
5. 質問する：次回提出前に、もう一度使いたいと思うか
```

このような出力は非常に実用的です。なぜなら、「プロトタイプが完成した」から「次にどうテストするか」まで導いてくれるからです。

### 11.5 AIに「段階ゲートキーパー」を演じさせる

ダブルダイヤモンドモデルで最もよくある問題は、ステップを飛ばすことです。AIに直接ゲートキーパーを務めさせ、今がどのステップにいるのかをリマインドさせることができます：

```text
あなたはプロダクトプロセスコーチとして行動してください。
以下は私の現在のプロジェクトの状態です：[あなたの説明]
私が現在Discover、Define、Develop、Deliverのどれにいるかを判断してください。
そして以下を教えてください：
1. 早すぎる次の段階へのジャンプをしていないか
2. 現在の段階で最も補うべきアクションは何か
3. 今はまだやるべきでないことは何か
```

これは初心者にとって特に役立ちます。なぜなら、「問題がまだ明確になっていないのにプロトタイプを作り始める」ことが非常に起こりやすいからです。

## 11. まとめ

- Discover と Define は問題定義を、Develop と Deliver は解決策の形成と検証を扱います。
- 発散は候補を増やし、収束は証拠に基づいて選択します。
- Deliver の目的は学習に使えるテスト結果であり、完成品の公開とは限りません。

## 12. 練習

<StageAssignmentCard title="ダブルダイヤモンドでアイデアを整理する">

上記の内容に基づいて、次の課題を完了してください：

1. 最近作りたいプロダクトのアイデアを1つ選び、Discover、Define、Develop、Deliverの4ステップのドラフトを書く
2. Define段階で、問題を強制的に一文に圧縮する
3. Develop段階で、少なくとも3種類の異なるソリューションをリストアップし、最初に思いついた方法だけに固執しない
4. Deliver段階で、1週間以内に納品可能な最小検証バージョンを書き出す

</StageAssignmentCard>

## 参考文献

この記事は主にDesign CouncilのDouble Diamondに関する公式資料を参照しており、さらに深く読むのに適しています：

- [Design Council: The Double Diamond](https://www.designcouncil.org.uk/our-resources/the-double-diamond/)
- [Design Council: Framework for Innovation](https://www.designcouncil.org.uk/our-work/skills-learning/tools-frameworks/framework-for-innovation-design-councils-evolved-double-diamond/)
- [Design Council: History of the Double Diamond](https://www.designcouncil.org.uk/our-resources/the-double-diamond/history-of-the-double-diamond/)

<style scoped>
.field-figure { margin: 24px 0 32px; overflow: hidden; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg-soft); }
.field-figure > a { display: block; background: #f4f4f1; }
.field-figure img { display: block; width: 100%; max-height: 520px; object-fit: contain; }
.field-figure figcaption { padding: 13px 16px 15px; border-top: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); font-size: 13px; line-height: 1.75; }
.field-figure figcaption strong { color: var(--vp-c-text-1); }
@media (max-width: 640px) { .field-figure { margin: 20px 0 28px; } }
</style>
