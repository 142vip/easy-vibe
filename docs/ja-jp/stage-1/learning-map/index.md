---
title: 'このコースの学び方'
description: '問題発見、需要検証、AI 製品の構築、実際の利用者への提供をゼロから学び、製品の結果に責任を持つプロダクトエンジニアを目指します。'
---

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'

const relatedArticles = relatedArticlesMap['ja-jp/stage-1/learning-map'] ?? []
</script>

# このコースの学び方

::: info 謝辞
この教材の中心的な貢献者とテスターは、**清華大学深圳国際大学院**の学生です。実際の学習と操作を通じて問題を見つけ、提案し、修正に参加してくださった皆さんに感謝します。その協力により、教材はより明確で信頼でき、初心者の実際のニーズに近づきました。[**👉 貢献者一覧を見る**](https://github.com/datawhalechina/easy-vibe#-contributing--contributors)
:::

以前、ソフトウェアを作るには高い壁がありました。アイデアを動くプログラムにする前に、プログラミング言語、開発ツール、多くの技術知識を学ぶ必要がありました。大規模言語モデルと AI コーディングツールはこの状況を変えました。人は自然言語で意図を説明し、AI にコード生成、画面作成、機能修正を手伝ってもらえるようになりました。

## Vibe Coding から製品づくりへ

**[Vibe Coding](https://www.merriam-webster.com/dictionary/vibe%20coding) という言葉は 2025 年2月2日に現れました。** AI 研究者 Andrej Karpathy は、人が自然言語で希望を伝え、動作結果を見ながら会話と修正を続け、最初からすべてのコードを手書き・理解・管理しなくてもよい新しいプログラミング方法をこう表現しました。

> **Vibe Coding とは？**
> 簡単に言えば「話してプログラミングする」ことです。アイデアを説明し、AI にプログラムを作らせ、動かして確認し、会話で少しずつ調整します。

最初の大きな変化は、「コードを書けないから始められない」という壁を多くの人が越えられるようになったことです。プログラミング経験がなくても、数分で小さなゲーム、ウェブページ、デモできるプロトタイプを作れます。

<figure class="concept-illustration">
  <img src="../../../zh-cn/stage-1/learning-map/images/vibe-coding-to-product.webp" alt="制作者が AI を使い、自然言語のアイデアを製品プロトタイプにして実際の利用者へ渡し、フィードバックから改善する様子" loading="lazy">
  <figcaption>Vibe Coding は「作る」壁を越える助けになります。製品づくりは、さらに実際の利用者、反応、価値へ進むことです。</figcaption>
</figure>

これは大きな変化です。**人とコンピューターのやり取りが、厳密な構文から自然言語へ広がっています。**

しかし動くデモが簡単に作れるほど、別の問いが重要になります。

- 作れるものではなく、何を作るべきか。
- 誰の問題を解決し、その人は本当に必要としているか。
- AI が作った初版を、安定し、分かりやすく、修正し続けられる製品にするにはどうするか。
- 自分のパソコンだけでなく、利用者へどう届けるか。
- 利用、反応、支払いから、本当に価値があるとどう判断するか。

Vibe Coding は学びを不要にしたのではなく、**学ぶ内容を変え、求められる水準を上げました。**

Coding だけを見るなら、目標はコードを動かすことです。製品を作るなら、問題から結果までの全体に責任を持ちます。

> **Coding：作れるか？**<br>
> **Build Product：作る価値があるか、誰が使うか、どう届けるか、役立ったとどう判断するか？**

Vibe Coding はこのコースの出発点ですが、終点ではありません。まず素早く作り、その後に問題選び、需要検証、解決案、構築、利用者との接触、結果からの改善を学びます。

::: tip このコースが本当に育てたい力
AI コーディングツールの使い方だけを教えるコースではありません。問題を見つけ、需要を確かめ、自分で製品を作り、実際の利用者へ届け、結果から改善できる初歩的な **プロダクトエンジニア（Product Engineer）**を目指します。
:::

## なぜ今、プロダクトエンジニアが必要なのか

プロダクトエンジニアは 2026 年に突然生まれた職業ではありません。

Intercom は 2018 年に、製品の所有意識を持つエンジニアを Product Engineer と説明しました。ほかの人が設計した機能を実装するだけでなく、顧客を理解し、製品判断に参加し、自分が届けた製品を改善し続ける人です。

AI は「作る」費用を大きく下げ、以前は複数の役割に分かれていた仕事をエンジニアが担いやすくしました。大規模モデルとコーディングエージェントがあれば、一人でもプロトタイプ、画面、フロントエンドとバックエンド、AI 接続、テスト、デプロイまで扱えます。仕事は「コードを完成する」だけでなく、利用者を直接理解し、案を検証し、利用を広げ、事業結果に責任を持つ方向へ進んでいます。

### 「製品に参加する」から「結果に責任を持つ」へ

いくつかの実際の時点から、この変化を見てみましょう。

| 時期 | 会社と職種 | その職種が示すこと |
| --- | --- | --- |
| 2018年5月 | [Intercom: Product Engineer](https://www.intercom.com/blog/making-the-transition-from-consultant-to-product-engineer/) | エンジニアも製品を考える人として顧客を理解し、製品の進み方を決める |
| 2026年2月 | [Hamilton AI: Product Engineer](https://jobs.ashbyhq.com/hamilton-ai/78c69fe9-828d-44b3-abe6-af56a2badf76/) | 顧客と直接話し、一回の会話を使える製品に変え、実際の利用者へ渡す |
| 2026年6月 | [Alma: Product Engineer - AI](https://jobs.ashbyhq.com/tryalma/8021fb35-fc1e-4950-a078-afc0e89d9856) | 一人がエージェント、バックエンド、画面を作り、法律家と顧客の利用を観察する |
| 2026年7月 | [Harper: Product Engineer](https://jobs.ashbyhq.com/harperinsure/7d678dba-885a-4432-94c7-a9c20852db35) | 営業、サポート、引受の現場へ入り、機能公開だけでなく転換率などの指標に責任を持つ |
| 2026年8月 | [Paradigm: Product Engineer, Applied AI](https://jobs.ashbyhq.com/Paradigm/b85b9094-2467-4f49-9a36-ca93da34a3f5) | 投資、調査、業務チームで問題を見つけ、社内・公開製品を作る |
| 2026年8月時点 | [OpenAI: Forward Deployed Engineer](https://openai.com/careers/forward-deployed-engineer-%28fde%29-seattle-seattle/) | 問題発見、技術計画、構築、本番導入まで担当し、利用率と業務への影響で成功を測る |

<details>
<summary><strong>異なる業界の実際の職種をさらに見る</strong></summary>

以下は航空、法律、保険、金融コンプライアンス、生命科学、産業、企業サービス、AI 基盤などの例です。

| 公開時期 | 会社と職種 | 完成させる一連の仕事 |
| --- | --- | --- |
| 2026年2月 | [Sphinx: Product Engineer](https://jobs.ashbyhq.com/Sphinx/08bdb9eb-4b6c-44ab-9615-3bb6b908d008) | 顧客との会話から機会を選び、素早く試作・検証し、結果を製品計画へ反映する |
| 2026年3月 | [Hyperscale: Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/hyperscale/950c982f-5fb9-481b-a6ad-808feba76757) | 技術調査、PoC、現場導入、企業営業に参加する |
| 2026年4月 | [Sphere: Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/sphere/7b5f39b0-6f3f-4bc4-9469-74ae9722d85a) | 顧客発見から導入まで行い、顧客の要望を共通製品機能に変える |
| 2026年5月 | [Avent: Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/avent-industrial-inc/bf8337c2-00cf-4ca7-aa43-b4c29e4b8083) | 顧客業務を理解し、コードを書き、システムを接続し、導入成功に責任を持つ |
| 2026年5月 | [Tamarind Bio: Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/tamarindbio/be678c9b-984e-4a0a-aedc-a87187e18748/) | 最初の技術対話、試験導入、本番、拡大、デモ、営業まで扱う |
| 2026年6月 | [Protege: Forward Deployed Engineer, New Verticals](https://jobs.ashbyhq.com/protege/b62ebf3e-e07f-4f67-bc9c-4787f23fe449/) | 初期顧客の要望から新事業を作り、成功した方法をプラットフォームへ残す |
| 2026年6月 | [Dataleap: Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/dataleap/6afe756f-fea9-42fc-82ed-621c72a99387/) | 企業現場で重要な流れを見つけ、エージェントを作り、接続し、顧客へ使い方を教える |
| 2026年6月 | [Collinear AI: Product Engineer](https://jobs.ashbyhq.com/collinear-ai/4d4af6b1-bfc7-4a28-9d86-5bab73e6e396) | バックエンド、フロントエンド、API、体験、テスト、本番品質を横断する |
| 2026年7月 | [Restate: Forward Deployed Engineer](https://jobs.ashbyhq.com/restate/c9419551-7f51-4691-8ba9-d80a27f1e284) | PoC、本番準備、導入に責任を持ち、一回の提供を再利用できる方法へ変える |
| 2026年8月時点 | [Scale AI: Forward Deployed Engineer, GenAI](https://scale.com/careers/4593571005) | 技術顧客と直接働き、端から端まで開発・実験し、製品計画へ影響する |

</details>

::: details 調査時期について
このページは **2026年8月9日** に整理しました。Ashby の具体的な公開日は公開採用データの `publishedAt` を使用し、日付のない会社ページは本ページの確認日を基準にしています。募集終了後にページが消える場合があります。

これは複数の実在職種を観察したもので、雇用市場全体の統計ではありません。AI ネイティブ企業や小さな製品チームに現れている方向を示すもので、すべての会社が製品、デザイン、開発、営業の専門分業をなくすという意味ではありません。
:::

### これらの変化は何を意味するか

これは企業がエンジニアにより多くを求めるというだけではありません。コードを書ける人の役割が変わる一方、コードを書けない人にも新しい入口が生まれています。

#### コードを書ける人へ：エンジニアの役割が再定義される

- **仕事の出発点：** 書かれた要件を待たず、利用者と業務の現場へ入って問題を見つける。
- **プロトタイプの役割：** 技術を見せるだけでなく、すぐ利用者へ渡して判断を確かめる。
- **開発の範囲：** 一つの技術部分から、画面、バックエンド、AI、デプロイ、体験へ広がる。
- **成功の基準：** 機能公開から、利用、時間短縮、転換率、収入、実際の影響へ変わる。
- **営業との関係：** 一部のプロダクトエンジニアはデモ、PoC、顧客導入に加わり、技術で価値を証明する。

ここでいう「営業ができる」は、全員が営業職になることではありません。製品を必要としそうな人を見つけ、問題を理解し、解決案を見せ、使ってもらい、継続利用や支払いの意思を確かめることです。

#### コード未経験の人へ：新しい入口が開かれた

AI は製品を作るための障壁も大きく下げました。

- **何年もプログラミングを学んでから始める必要はありません。** 自然言語で AI に依頼し、コードや画面を作り、エラーを解決しながら動くものを作れます。
- **業界知識はコード力より希少な場合があります。** 教師、医師、弁護士、営業、運用担当者が持つ利用者や業務への理解は、良い製品の土台です。
- **アイデアから製品までの距離を数週間、時には数日に縮められます。** 身近な問題を小さなツールにして、実際の利用者に価値を確かめられます。

このコースは、能力の範囲を広げたいエンジニアと、アイデアや業界知識を持つ未経験者の両方を対象としています。

### Product Engineer、FDE、OPC の関係

三つは同じ能力のつながりにありますが、同じものではありません。

| 概念 | 何か | 主な場面 | 責任の範囲 |
| --- | --- | --- | --- |
| **Product Engineer** | 製品と開発を組み合わせた職種 | 製品チーム内 | 問題と案から公開、利用者の反応、事業指標まで |
| **FDE（Forward Deployed Engineer）** | プロダクトエンジニアリングを顧客現場へ広げた職種 | 企業顧客、実業務、本番環境 | 顧客発見、PoC、接続、導入、利用、拡大、時に営業過程まで |
| **OPC（One-Person Company）** | 一人が中心となって経営する会社の方法で、職名ではない | AI エージェント、自動化、外部サービスで一人が製品を運営 | 市場、製品、宣伝、営業、提供、サポート、資金まで |

<div class="role-path-figure" role="img" aria-label="製品を作ることから顧客現場と事業全体へ責任範囲が広がる">
  <div class="role-path-node">
    <strong>Product Engineer</strong>
    <span>正しい製品を作る</span>
  </div>
  <div class="role-path-arrow" aria-hidden="true"></div>
  <div class="role-path-node">
    <strong>FDE</strong>
    <span>顧客の現場へ製品を入れる</span>
  </div>
  <div class="role-path-arrow" aria-hidden="true"></div>
  <div class="role-path-node">
    <strong>OPC</strong>
    <span>一つの事業全体を運営する</span>
  </div>
</div>
<p class="role-path-caption">順番に昇進すべき職業階段ではなく、同じプロダクトエンジニアリング能力が扱える範囲の違いです。</p>

三つの広がる円として考えられます。

> **Product Engineer：正しい製品を実際に作る**<br>
> **FDE：製品を顧客現場へ入れ、結果を生む**<br>
> **OPC：同じ能力で一つの事業全体を営む**

#### FDE：エンジニアが顧客の現場へ入る

FDE はソフトウェアを設置するだけの担当者でも、デモだけをするプリセールスでもありません。AI 企業の FDE は通常、四つを同時に行います。

1. 顧客とともに、最も解く価値のある問題を見つける。
2. 素早くプロトタイプや PoC を作り、技術と事業の価値を示す。
3. 本番コードを書き、顧客の実データと業務の流れへ接続する。
4. 利用状況を観察し、繰り返す要望を共通製品機能へ変える。

2026年8月時点で OpenAI は複数の国と都市で FDE を募集し、本番利用率、測定可能な業務影響、製品やモデル計画を変える現場の反応を成功基準としていました。FDE は一部の企業ソフトウェア会社の特別な方法から、AI 導入の重要な職種へ広がっています。

#### OPC：一人でも「デジタルチーム」を持てる

ここでの OPC は法的な一人会社だけを指しません。**One-Person Company：一人が中心となり、ソフトウェア、AI エージェント、外部基盤を使って、以前は複数人が必要だった仕事を行う経営方法**です。

AI だけで動く「無人会社」ではありません。創業者は市場を判断し、責任を負い、利用者と会い、重要な意思決定を行います。AI は仕事を割り当てられるデジタルチームに近い存在です。

この流れは AI から始まったものではありません。独立開発者 Pieter Levels は Nomads.com、Remote OK、Photo AI、Interior AI などを長く一人で作り、運営してきたと紹介しています。AI はデザイン、開発、コンテンツ、分析、サポートまで広げますが、最後は実際の市場で価値を確かめる必要があります。[Pieter Levels のプロジェクト記録](https://levels.io/projects/)

2025年、Microsoft の Work Trend Index は、AI エージェントを作り、仕事を割り当て、管理する人を **Agent Boss** と呼びました。31か国31,000人の調査で、81%のリーダーが今後12〜18か月にエージェントを AI 戦略へ中程度または深く組み込むと予想しています。[Microsoft 2025 Work Trend Index](https://www.microsoft.com/en-us/worklab/work-trend-index/2025-the-year-the-frontier-firm-is-born)

2025年6月、Wix は自然言語アプリ開発サービス Base44 を約8,000万ドルで買収しました。Base44 は厳密には OPC ではありませんが、データベース、認証、デプロイなど複数の専門職が必要だった仕事が、会話型製品としてまとめられ自動化されていることを示します。[Wix の買収発表](https://www.wix.com/press-room/home/post/wix-further-expands-into-vibe-coding-with-acquisition-of-base44-a-hyper-growth-startup-that-simplif)

「最初の一人ユニコーン企業がいつ現れるか」はまだ予測であり、実現した事実ではありません。初心者にとって重要なのは、**一人でも少ない資金と小さなチームで素早く製品を検証し、小さくても本当に利益を生む事業を運営できるようになった**という現実です。

::: tip なぜ三つの道を同時に扱うのか
製品チームへ入る、FDE になる、自分の OPC を試す。どの道でも出発点は同じです。実際の問題を見つけ、最小の製品を作り、利用者へ渡し、価値を説明し、利用と支払いの結果から改善します。
:::

このコースが訓練するのは別々の職名ではなく、製品の一連の循環です。

> **問題発見 → 需要検証 → 解決案設計 → 製品構築 → 利用者へ提供 → 価値を説明 → 結果を観察 → 改善を続ける**

AI にコードを書かせるのは最初の一歩です。実際に使える製品には、さらに問いがあります。

- AI に整理され、保守しやすいコードを書かせるには？
- ばらばらのコードを動くアプリにまとめるには？
- アプリを公開し、実際に使ってもらうには？
- テキスト生成や画像理解などの AI 機能をどう組み込むか？
- 利用者が本当に必要とし、支払う可能性までどう確かめるか？

これらはコース内で順に学びます。

学生、教師、医師、作業員、技術をまったく知らない人でも、最初の製品プロトタイプを始める前に何年もプログラミングを学ぶ必要はありません。

| あなたの立場 | このコースが助けること |
| --- | --- |
| 学生 | 課題、コンテスト、起業のプロジェクトを自分で作る |
| 会社員 | 繰り返し作業を自動化し、効率を上げ、副業も試す |
| プロダクトマネージャー / デザイナー | アイデアをデモにして実際の利用者へ渡す |
| 起業家 / 中小企業経営者 | 大きなチームを作る前に、低い費用で MVP を検証する |
| 教師 / 教育者 | 教材、授業ツール、自動問題を作る |
| 医師 / 法律家 / 専門職 | 専門業務を自動化し、自分の効率化ツールを作る |
| すべての人 | AI で生活や仕事の具体的な問題を解く |

AI は実装費用を下げますが、製品の価値を決めるのは、実際の問題を見つけ、解決案を利用者へ届けられるかどうかです。

## 成長の道：AI を使う人からプロダクトエンジニアへ

<div class="stage-intro">
  <div class="stage-card">
    <div class="stage-icon">🎮</div>
    <h3>最初の体験</h3>
    <p class="stage-role">AI コーディングを試す</p>
    <div class="stage-tags">
      <span>スネークゲーム</span>
      <span>ゼロから始める</span>
      <span>Vibe Coding 初体験</span>
      <span>数分で生成</span>
    </div>
  </div>
</div>

<div class="stage-grid">
  <div class="stage-card">
    <div class="stage-icon">🛠️</div>
    <h3>Stage 1</h3>
    <p class="stage-role">プロダクトエンジニア入門</p>
    <div class="stage-tags">
      <span>AI IDE (Cursor/Claude)</span>
      <span>需要検証 & プロトタイプ</span>
      <span>AI 機能の接続</span>
      <span>実際の利用者へ提供</span>
    </div>
  </div>
  <div class="stage-card">
    <div class="stage-icon">💻</div>
    <h3>Stage 2</h3>
    <p class="stage-role">フルスタック・プロダクトエンジニア</p>
    <div class="stage-tags">
      <span>Figma からコードへ</span>
      <span>Supabase データベース</span>
      <span>Stripe 決済接続</span>
      <span>Dify ナレッジベース</span>
    </div>
  </div>
  <div class="stage-card">
    <div class="stage-icon">🚀</div>
    <h3>Stage 3</h3>
    <p class="stage-role">AI プロダクトエンジニア / 技術責任者</p>
    <div class="stage-tags">
      <span>Web / ミニプログラム / マルチプラットフォーム</span>
      <span>高度な MCP ツール</span>
      <span>RAG & LangGraph</span>
      <span>高度なエンジニアリング思考</span>
    </div>
  </div>
</div>

<style>
.concept-illustration {
  margin: 24px 0 12px;
}

.concept-illustration img {
  display: block;
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.concept-illustration figcaption,
.role-path-caption {
  margin: 8px 12px 0;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  line-height: 1.6;
  text-align: center;
}

.role-path-figure {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  margin: 24px 0 0;
}

.role-path-node {
  display: flex;
  min-height: 112px;
  padding: 18px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: linear-gradient(145deg, var(--vp-c-bg-soft), var(--vp-c-bg));
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.role-path-node strong {
  color: var(--vp-c-brand-1);
  font-size: 1rem;
}

.role-path-node span {
  margin-top: 8px;
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
}

.role-path-arrow::before {
  color: var(--vp-c-brand-1);
  content: '→';
  font-size: 1.25rem;
  font-weight: 700;
}

.stage-intro {
  margin: 20px auto;
  max-width: 400px;
}

.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin: 16px 0;
}

.stage-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 12px;
  background-color: var(--vp-c-bg-soft);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
}

.stage-card:hover {
  transform: translateY(-2px);
  background-color: var(--vp-c-bg-mute);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border-color: var(--vp-c-brand);
}

.stage-icon {
  font-size: 2rem;
  margin-bottom: 8px;
  line-height: 1;
}

.stage-card h3 {
  margin: 0 0 4px 0 !important;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
}

.stage-role {
  margin: 0 0 8px 0 !important;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.stage-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
}

.stage-tags span {
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 3px;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.stage-card:hover .stage-tags span {
  background-color: var(--vp-c-bg);
  border-color: var(--vp-c-brand-dimm);
  color: var(--vp-c-brand-dark);
}

@media (max-width: 720px) {
  .role-path-figure {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .role-path-node {
    min-height: 88px;
  }

  .role-path-arrow {
    text-align: center;
  }

  .role-path-arrow::before {
    content: '↓';
  }
}
</style>

この学習の道を通ると、次の力が身につきます。

- **Vibe Coding の開発力：** AI コーディングツールを使い、構文を暗記する前に AI を導いて品質のよいコードを作る。
- **フルスタック開発：** UI、フロントエンド、データベース、API、ローカル開発、クラウド公開まで扱う。
- **AI 機能の接続：** テキスト、画像、音声のマルチモーダル API を使い、後には RAG などで知的な製品を作る。
- **製品と運営の考え方：** 利用者調査、需要分解、MVP、改善、支払い、利用者管理までの流れを学ぶ。

# 学び終えたら何ができる？

## Stage 1：最初の製品プロトタイプを作る

プログラミング経験がない人、少し知っていても自信がない人に向いた段階です。大量の理論から始めず、作りながら AI にコードを書かせ、エラーを直す方法を学びます。

**この段階でできること：**

- AI コーディングツールでウェブアプリを一人で完成する。
- 製品アイデアをクリック・操作できるプロトタイプにする。
- 画像生成や知的な対話などの AI 機能を加える。
- エラーが出ても原因を調べ、解決できる。

簡単に言えば、動き、ほかの人に見せられるものを作れます。

最初は小さなゲームで AI コーディングを体験し、次にツールでコード作成とエラー修正を学びます。単純なページから複数ページのアプリへ進み、AI 機能を加え、最後に独立したプロジェクトを完成させます。

# なぜプロジェクト形式で訓練するのか

> **現実の仕事の難しさ**
>
> 実際の職場では、目標だけが与えられ、完成した資料、既存の枠組み、詳細な要件がないことがよくあります。

> 上司や顧客：xxx を作り、yyy の効果を出してください。
>
> 資料？完成した枠組み？詳細な仕様？多くの場合ありません。

実際の仕事では、不確実な状況で初めて見る問題を解きます。要件は曖昧で、範囲は変わり、標準の答えはありません。資料を探し、実験し、試作し、改善し、最後に動き、使え、公開できる解決策を届けます。

このコースは安全な環境で、その経験を先に与えます。

- 少し難しい課題で、問題分解、解決設計、資料探しを練習する。
- 過度に単純化していないコードから、中規模コードベースの読み方と修正を学ぶ。
- アイデアから公開までを通じ、実際の製品のゼロから一を経験する。

短期的には大変ですが、責任を持つ力、不確実な場面で道を見つける力、AI をデモではなく実際の製品にする力が身につきます。

# 質問する技術：AI 時代の基本能力

質問は基本能力です。同じコードとエラーでも、**どう聞くかで答えが大きく変わります**。曖昧な説明になるか、実行できる手順になるかを左右します。

**習慣にする：** AI への質問を開発の一部にしてください。分からない、止まったと感じたら、すぐ聞きます。

## なぜ必須の能力なのか

- **現実には完全な資料が少ない：** 曖昧な要件、途中のコード、ばらばらのエラーを扱う。
- **AI はいつでもいる先生と同僚になる：** よい質問は質の高いペアプログラミングを作る。
- **伝え方が能力の上限を決める：** 関係する情報と出力条件が多いほど、答えは使いやすい。

**よくある誤り：** 「なぜエラー？」だけでは推測が増えます。背景をそろえると実行できる案が得られます。

## AI に情報を渡す方法：画像かコピーか

どちらも使えますが、用途が違います。

| 方法 | 向いている場面 | 大切なこと |
| --- | --- | --- |
| **コピー＆ペースト** | エラー、ログ、コード、設定、API 応答 | 関係する内容をまとめて渡し、一行だけにしない |
| **スクリーンショット** | UI 配置、操作異常、ツールのボタンが見つからない | 周囲も含めて撮り、重要部分を示し、一文を添える |

::: danger ⚠️ 重要な条件
**すべての AI が画像を読めるわけではありません。** 画像で話すには、画像を理解できるマルチモーダルモデルが必要です。Claude、GPT-4V/GPT-4o、Gemini、Qwen、ERNIE Bot などがあります。

**利用中の AI が画像入力に対応しない場合**、画像は認識されません。文字をコピーして渡してください。
:::

## AI に分かりやすく説明させるプロンプト

答えだけでなく理解したいときは、次のような指示が役立ちます。

> **学習向けの例**
>
> - 「この概念をまず5文で説明し、その後、理解を確認する質問をしてください。」
> - 「このエラーがなぜ起きたのか、詳しく説明してください。」

# 長く頑張っても解決できず、やめたくなった

続け方を変える必要があるのかもしれません。一人で抱えず、作者やティーチングアシスタントに、試した方法、具体的なつまずき、今の気持ちを話してください。方向を少し変える、足りない知識を一つ補うだけで、また進めることがあります。

# 教材の設計に納得できない部分がある

作者への連絡、Issue の作成、授業やコミュニティでの意見を歓迎します。分かりにくい所、体験がよくない所、時間を無駄にした所を具体的に教えてください。率直な反応は、次の学習者の失敗を減らします。

# 参考資料

- [南京大学 コンピューターシステム基礎 実験教材](https://nju-projectn.github.io/ics-pa-gitbook/ics2025/)

<RelatedArticlesSection
  title="次に学べること"
  description="AI を使うところから製品を作るところへ、続けて進みましょう。"
  :items="relatedArticles"
/>
