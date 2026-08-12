---
title: '実際の仕事の流れから AI の用途を探す'
description: '60 件を超える調査報告と製品事例から、企業や生活の中ですでに使われている AI の場面を読み解きます。'
---

# 実際の仕事の流れから AI の用途を探す

「業界別 AI 活用集」には、金融、医療、教育、製造と多くの案が並びます。しかし作り始めようとすると、誰に話を聞き、どのデータをつなぎ、どの作業を置き換え、誰がお金を払うのかが分かりません。

原因は、**業界そのものは利用場面ではない**からです。「AI × 医療」は範囲にすぎません。「診察後に医師が十分かけて記録を補う。システムが会話から下書きを作り、医師が確認する」なら、調査・設計・検証できる仕事の流れになります。

この付録では、60 件を超えるコンサルティング、業界調査、製品の一次事例を読み、網羅ではなく、すでに使われ価値の置き場所が見える企業向けと個人向けの場面を選びました。これはインタビューする問題を探す地図であり、完成済みの起業案ではありません。

<div class="research-note">
  <div>
    <span class="research-note__eyebrow">最初に覚えること</span>
    <strong>企業向けでは仕事の詰まりを、個人向けでは一日の中で繰り返す瞬間を探す。</strong>
  </div>
  <p>前者では担当者、システム、引き継ぎ、責任者を説明します。後者では利用者が戻る理由と、検索・テンプレート・人のサービスより AI が一手減らす場所を説明します。</p>
</div>

## まず企業向けと個人向けを区別する

### 企業向け：会社は結果に対して支払う

企業は「会話できること」だけを買いません。処理時間、手戻り、コンプライアンス品質、成約などの結果を買います。調査できる場面には、毎日誰が作業し、資料がどこから来て、結果をどのシステムへ戻し、失敗時に誰が責任を持つかが必要です。

Deloitte が 2,773 人の経営者を調査したところ、規模拡大できた生成 AI 実験はまだ少数でした。Accenture が 2,000 件以上の案件を振り返っても、企業全体の価値を生んだ組織は少数です。難所はモデルの回答力より、完全な業務へ入っているかどうかです。[Deloitte: State of Generative AI in the Enterprise](https://www2.deloitte.com/us/en/pages/about-deloitte/articles/press-releases/state-of-generative-ai.html) · [Accenture: Making Reinvention Real with Gen AI](https://www.accenture.com/us-en/insights/consulting/making-reinvention-real-with-gen-ai)

### 個人向け：利用者は少し楽になる瞬間に支払う

個人向け製品は十個の社内システムをつなぐ必要はありませんが、利用者はすぐにアプリを閉じられます。旅行準備、商品比較、会話練習、ポスター作成、請求整理のような明確な瞬間で一つの仕事を終え、少しずつ好みを覚える製品が強くなります。

Capgemini が 12,000 人を調べると、生成 AI は商品発見と比較へ入っていました。QuestMobile の中国データでも、AI は単独のチャットから検索、仕事、画像、音楽へ広がっています。機会は新しい会話欄だけでなく、会話を次の行動へつなぐことにあります。[Capgemini: What Matters to Today's Consumer 2025](https://www.capgemini.com/insights/research-library/top-consumer-trends-in-2025/) · [QuestMobile: 2025 中国モバイルインターネット春季報告](https://www.questmobile.cn/research/report/1919961024158601218/)

## 企業向け：すでに起きている八つの仕事

各節は具体的な担当者から始まります。製品名をまねる前に、なぜ遅かったのか、AI がどの一手を受け、何を人に残したかを見てください。

### 1. 顧客対応は質問への返事ではなく、案件を終わらせる仕事

<figure class="product-shot">
  <a href="https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/klarna.webp" alt="Klarna AI Assistant の支払延長、多言語対応、返金説明画面" loading="lazy" />
  </a>
  <figcaption><strong>Klarna AI Assistant：</strong>「担当者へ連絡」だけでなく、支払延長の操作を開き、返金額を項目別に示します。役立つ顧客対応 AI は注文を見つけ、次の操作へ進みます。</figcaption>
</figure>

**担当者：** 一次対応、チーム責任者、アフターサービス運営。

「返金が届かない」という相談では、本人確認、注文、支払、配送の確認、規則説明、必要ならチケット作成が続きます。礼儀正しい一文より、複数システムから状況を集める方が時間を使います。

Klarna は返金、返品、多言語対応を扱い、ResultsCX は音声振り分け、口座照会、バックエンド API を結びます。価値は FAQ ではなく、**状態確認→規則に沿う処理→記録→必要時に人へ引き継ぐ**流れです。[Klarna の事例](https://openai.com/index/klarna/) · [ResultsCX の事例](https://aws.amazon.com/solutions/case-studies/resultscx/) · [Salesforce: State of Service 2025](https://www.salesforce.com/news/stories/state-of-service-report-announcement-2025/)

最初は人の応対後だけを扱えます。会話要約、意図、関連規則、次の操作を作り、担当者の確認後にチケットへ書きます。返金権限をモデルへ渡さず、時間短縮を測れます。

<div class="scene-check">
  <span>聞くべきこと</span>
  <p>担当者はどの画面を頻繁に行き来するか。同じ質問でも注文状態で処理が変わるものは何か。引き継ぎ後に同じ説明を最初から求めていないか。</p>
</div>

### 2. 営業に足りないのは文章ではなく、次に誰と何を話すか

<figure class="product-shot">
  <a href="https://openai.com/index/morgan-stanley/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/morgan-stanley.webp" alt="Morgan Stanley AI@MS Assistant の社内画面" loading="lazy" />
  </a>
  <figcaption><strong>Morgan Stanley AI@MS Assistant：</strong>アドバイザーは口座開設資料や案件状態を検索できます。「社内利用のみ」と人の検証も表示され、判断を代行するチャットではなく業務画面内の検索入口です。</figcaption>
</figure>

**担当者：** B2B 営業、顧客担当、プリセールス、営業責任者。

商談後には CRM 更新、意思決定者と反論の整理、事例検索、メール作成、次の連絡時期の判断があります。録音、チャット、メール、個人メモに散らばるため CRM は古くなりがちです。

McKinsey は見込み客、商談準備、会話、提案、成約、更新までを整理しています。Morgan Stanley の道具も投資判断ではなく、社内知識の検索と会議からのメモ・タスク作成を助けます。[McKinsey: Unlocking Gen AI in B2B Sales](https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/unlocking-profitable-b2b-growth-through-gen-ai) · [Morgan Stanley の事例](https://openai.com/index/morgan-stanley/)

初版は「会議後の十五分」に絞れます。目標、反論、約束、次の一手を抽出し、編集可能なメールと CRM 項目を作ります。文字数ではなく CRM の完全さと連絡の速さを測ります。

### 3. 社内知識は「今回どの規則を使うか」に答える

<figure class="product-shot">
  <a href="https://www.notion.com/help/guides/find-answers-and-generate-reports-with-enterprise-search" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/notion-enterprise-search.png" alt="Notion Enterprise Search の画面" loading="lazy" />
  </a>
  <figcaption><strong>Notion Enterprise Search：</strong>一つの質問で Notion と Slack を検索し、Ask、Research、Build を切り替えます。企業向け支援は一つの PDF より、既存資料と権限につながることが重要です。</figcaption>
</figure>

**担当者：** コンサルタント、運営、人事、財務、IT 支援、新入社員。

答えは制度、手順書、古いメール、研修動画、過去案件に散らばっています。「この顧客は返金できるか」には、返金を含む文書ではなく、現行規則、適用条件、出典が必要です。

Sun Life の社内支援は週一万件以上を処理し、Morgan Stanley は約十万件の資料を検索対象にしました。Notion は企業検索、会議記録、実行を一つの空間へ置きます。中核は権限、版、出典、改善の循環です。[Sun Life Asks](https://aws.amazon.com/solutions/case-studies/sun-life-case-study/) · [Notion AI の説明](https://www.notion.com/help/notion-ai-faqs)

全社から始めず、返品規則や IT 窓口など資料範囲が明確な一部署を選びます。回答は原文を示し、見つからなければそう伝えて不足資料の一覧へ入れます。

### 4. 財務・法務・コンプライアンス：読んで下書きし、署名はしない

<figure class="product-shot">
  <a href="https://mena.thomsonreuters.com/en/products-services/legal/cocounsel.html" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/cocounsel.jpg" alt="Thomson Reuters CoCounsel の契約作成と調査画面" loading="lazy" />
  </a>
  <figcaption><strong>Thomson Reuters CoCounsel：</strong>作成と調査の進行を示し、完成後に Word で開きます。AI が資料を読み、根拠を探して下書きし、専門家が慣れた文書で確認します。</figcaption>
</figure>

**担当者：** 財務分析、税務、法務、調達、コンプライアンス。

契約、請求書、報告書、規則、監査資料、デューデリジェンスは形式が似ても内容が違います。AI は抽出、比較、分類、検索、下書きに向きますが、最終判断は原文へ戻れ、担当者が責任を持つ必要があります。

Thomson Reuters の 2025 年調査では、法務、税務、リスクで調査、要約、契約作成、申告準備が増えています。Moderna は契約要約、OpenAI と PwC は照合、リスク通知、システム横断の財務エージェントを扱います。[Thomson Reuters: 2025 Generative AI in Professional Services](https://www.thomsonreuters.com/en-us/posts/technology/genai-professional-services-report-2025/) · [Moderna の事例](https://openai.com/index/moderna/) · [OpenAI × PwC: CFO の流れ](https://openai.com/index/openai-pwc-finance-collaboration/)

小さく始めるなら、仕入先契約の支払、更新、補償、データ条項を原文引用つきで調べます。「AI 法務」を名乗る前に見逃し率、確認時間、引用精度を証明します。

### 5. ソフトウェア開発：価値は別の会話欄でなくリポジトリに現れる

<figure class="product-shot">
  <a href="https://github.blog/changelog/2024-10-29-github-copilot-code-review-in-github-com-private-preview/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/github-copilot-review.webp" alt="Pull Request でコードを確認する GitHub Copilot" loading="lazy" />
  </a>
  <figcaption><strong>GitHub Copilot Code Review：</strong>指摘は具体的な行につき、変更案も出ます。開発者は差分を読み、まとめるか拒否できます。価値は Pull Request の中にあります。</figcaption>
</figure>

**担当者：** 開発、テスト、運用、セキュリティのエンジニア。

時間は古いコードの理解、テスト追加、ログ調査、レビュー、知らないリポジトリの学習に使われます。GitHub の統制実験では Copilot 利用者が指定課題を速く終えましたが、実際の組織では文脈、規則、テスト合格の方がコード生成力より重要です。[GitHub Copilot 生産性調査](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/) · [GitHub の追加報告](https://github.blog/wp-content/uploads/2023/06/Sea-Change-in-Software-Dev.pdf)

社内道具は失敗した CI から始められます。エラーと変更を読み、原因候補と修正案を示し、確認用の差分を作ります。テストを実行し、差分を見せ、レビューを受け、直接本番へ送らないことが必要です。

### 6. 製造と現場サービス：設備、手順書、作業票を同じ文脈に置く

<figure class="product-shot">
  <a href="https://blog.siemens.com/2026/02/the-digital-enterprise-and-the-synthesis-of-industrial-ai-digital-twin-and-data/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/siemens-industrial-copilot.jpg" alt="TIA Portal と並ぶ Siemens Engineering Copilot" loading="lazy" />
  </a>
  <figcaption><strong>Siemens Engineering Copilot：</strong>TIA Portal と Copilot が並びます。支援側は現在の自動化案件、設備構造、技術文書を見ており、文脈なしに「機械はなぜ壊れたか」と答えるものではありません。</figcaption>
</figure>

**担当者：** 設備操作、保守、現場サービス、工程の各エンジニア。

機械が止まると、操作員に見えるのはエラーコードだけかもしれません。答えは何百ページもの手順書、部品表、修理履歴に散らばり、損失は分単位で増えます。修理後には顧客向けで社内保存できる報告も必要です。

Siemens Industrial Copilot は設備説明、保守根拠の検索、自動化プログラミングに使われます。別の試験は年間 140 万件超の作業票から一貫した顧客報告を作ります。Deloitte もデータ品質と設備文脈を壁として挙げます。[Siemens Industrial Copilot](https://news.microsoft.com/source/emea/features/how-ai-is-helping-siemens-and-thyssenkrupp-bridge-skilling-gaps-in-manufacturing/) · [Siemens 現場報告の事例](https://www.microsoft.com/en/customers/story/19736-siemens-ag-germany-dynamics-365-field-service) · [Deloitte: 2025 Smart Manufacturing Survey](https://www2.deloitte.com/us/en/insights/industry/manufacturing/2025-smart-manufacturing-survey.html)

「工場全体を予測」ではなく一種類の設備から始めます。エラーコードから手順書と過去作業票を探し、確認順を示し、修理後は記録を報告へ変えます。すべてに根拠を示し、技術者が「役に立たない」と記録できるようにします。

### 7. 医療では診断デモより、文書と調整から始める

<figure class="product-shot">
  <a href="https://www.abridge.com/product" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/abridge-note.webp" alt="診療記録と医師・患者の会話を結びつける Abridge" loading="lazy" />
  </a>
  <figcaption><strong>Abridge：</strong>生成した診療記録から元の会話へ戻れます。重要なのは自動作成の速さより、医師が各記録を追跡、修正、確認できることです。</figcaption>
</figure>

**担当者：** 医師、看護師、診療情報、保険審査、患者支援。

医療の負担には、診断以外の記録、紹介、承認、請求、患者連絡があります。McKinsey の近い用途も、記録要約、保険給付、拒否理由、退院説明、事務へ集中し、モデル単独診断ではありません。[McKinsey: Tackling Healthcare's Biggest Burdens with Generative AI](https://www.mckinsey.com/industries/healthcare/our-insights/tackling-healthcares-biggest-burdens-with-generative-ai)

Abridge のような環境記録は会話から構造化下書きを作り、医師が確認します。「下書き→確認→記録へ戻す」という境界は文書時間を減らし、臨床責任を変えません。[Abridge の医療機関事例](https://www.abridge.com/press-release/abridge-hartford-healthcare) · [McKinsey: Generative AI in Healthcare](https://www.mckinsey.com/industries/healthcare/our-insights/generative-ai-in-healthcare-current-trends-and-future-outlook)

医療パートナー、データ、規制知識がなければ診断から始めません。受診準備を手順一覧へ直す、電話内容を整理するなど低リスクの患者支援を機関の確認つきで研究できます。

### 8. 小売とコンテンツ運営：一つの素材を多くの販路へ届ける

<figure class="product-shot">
  <a href="https://www.canva.com/newsroom/news/magic-studio/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/canva-magic-switch.png" alt="サイズ変更、翻訳、文書変換を行う Canva Magic Switch" loading="lazy" />
  </a>
  <figcaption><strong>Canva Magic Switch：</strong>確認済みのデザインを別寸法、別言語、文書へ変えられます。一つの素材から多販路版を作る高頻度の仕事です。</figcaption>
</figure>

**担当者：** EC 運営、ブランドマーケティング、デザイン、商品、ローカライズ。

新商品公開では、資料理解、販路別のタイトル、画像処理、寸法変更、翻訳、禁止表現確認、反応後の更新が続きます。多くの時間は移し替えと一貫性確認に使われます。

Deloitte は個別化、商品運営、供給網、マーケティングを AI の領域に挙げます。Canva は寸法と言語を変え、Adobe Firefly は生成、編集、制作素材を一つの流れに置きます。AI はブランド判断を置き換えず、版を作る機械作業を減らします。[Deloitte: 2025 Retail Industry Outlook](https://www.deloitte.com/us/en/insights/industry/retail-distribution/retail-distribution-industry-outlook-2025.html) · [Canva Magic Studio](https://www.canva.com/newsroom/news/magic-studio/) · [Adobe Firefly](https://news.adobe.com/news/2025/04/adobe-revolutionizes-ai-assisted-creativity-firefly)

初版は一販路・一商品種でよいでしょう。構造化資料から詳細ページを下書きし、必須項目、寸法、禁止表現を検査して運営者が公開します。「万能マーケティング支援」より具体的な反応を得られます。

## 個人向け：利用者が自分から開く七つの瞬間

同じ会話欄に七種類のプロンプトを置くのは典型的な失敗です。以下の製品では会話の後ろに商品、講座、旅程、キャンバス、音楽、財務データがあり、利用者が仕事を続けられます。

### 1. 「選択肢を減らして」：検索、比較、購入

<figure class="product-shot product-shot--mobile">
  <a href="https://www.aboutamazon.com/news/retail/amazon-rufus" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/amazon-rufus.webp" alt="Amazon Rufus の買い物支援画面" loading="lazy" />
  </a>
  <figcaption><strong>Amazon Rufus：</strong>入口は検索欄の下にあり、質問は商品比較や Prime Day、睡眠計測の時計など買い物に直結します。一般的な助言で終わらず、実商品へ進めます。</figcaption>
</figure>

カメラ、ベビーカー、雨天通勤の靴を買う人に足りないのは商品ページではなく、曖昧な条件を比較可能にすることです。Rufus は商品一覧、評価、Q&A を合わせ、Capgemini と Adobe も AI による発見、比較、購入前相談を報告します。[Amazon Rufus](https://www.aboutamazon.com/news/retail/amazon-rufus) · [Adobe: 2025 AI and Digital Trends](https://business.adobe.com/content/dam/dx/us/en/resources/digital-trends-report-2025/2025_Digital_Trends_Report.pdf)

「AI 買い物支援」ではなく選びにくい商品を研究します。賃貸住宅のプロジェクターなら投射距離、昼の明るさ、騒音、予算が同時に必要です。根拠、不足情報、実商品を示し、専門家らしい結論を作りません。

### 2. 「二十個のページを開きたくない」：旅行計画と現地変更

<figure class="product-shot">
  <a href="https://www.expedia.com/newsroom/expedia-launches-conversational-trip-planning-powered-by-chatgpt-to-inspire-members-to-dream-about-travel-in-new-ways/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/expedia-chatgpt.jpg" alt="Expedia の会話型旅行計画画面" loading="lazy" />
  </a>
  <figcaption><strong>Expedia の会話型旅行計画：</strong>新婚旅行で Maui と Kauai を比べ、ホテル案を Trips へ直接保存します。会話が保存、旅程、予約へ入ることで製品の循環が閉じます。</figcaption>
</figure>

旅行では目的地、日付、交通、営業時間、予算、同行者の希望を何度も調整します。Expedia は会話をホテル保存、価格、予約へつなぎます。価値は美しい旅行記ではなく、保存、確認、購入できる旅程です。[Expedia の会話型計画](https://www.expedia.com/newsroom/expedia-launches-conversational-trip-planning-powered-by-chatgpt-to-inspire-members-to-dream-about-travel-in-new-ways/) · [Expedia AI サービス事例](https://www.expedia.com/newsroom/expedia-group-sets-the-standard-with-ai-powered-service-agent/)

「子どもと半日」や「公演後の夜間経路」まで絞れます。天気、料金、営業時間は信頼できる API から取り、更新時刻を示します。

### 3. 「聞くだけでなく一度練習したい」：学習とフィードバック

<figure class="product-shot product-shot--portrait">
  <a href="https://blog.duolingo.com/duolingo-max/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/duolingo-roleplay.webp" alt="パリのカフェで注文する Duolingo Max の練習" loading="lazy" />
  </a>
  <figcaption><strong>Duolingo Max Roleplay：</strong>「フランス語で話す」ではなく、パリのカフェで注文する課題です。場面、役、目標、報酬が用意され、すぐ一回練習できます。</figcaption>
</figure>

生成 AI は、いつでも練習して今回の出来へ助言を得るという、以前は高価だった部分を補えます。Duolingo Max は役割練習と映像会話を使い、Khanmigo は答えを渡すより質問とヒントで導きます。[Duolingo Max](https://blog.duolingo.com/duolingo-max/) · [Khan Academy: Khanmigo](https://2023-2024.annualreport.khanacademy.org/khanmigo)

面接回答、英会話、営業の反論対応、発表練習など一動作に絞れます。フィードバックは実際の発言を引用し、次回実行できる一つの改善を示します。

### 4. 「直せる下書きがほしい」：個人の制作

<figure class="product-shot">
  <a href="https://firefly.adobe.com/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/adobe-firefly.webp" alt="Adobe Firefly の画像生成画面" loading="lazy" />
  </a>
  <figcaption><strong>Adobe Firefly：</strong>プロンプト欄だけでなく、モデル、比率、内容種別、強度、参照画像、複数結果があります。制作製品には「もう一度生成」以外の編集手段が必要です。</figcaption>
</figure>

誕生日招待、中古商品写真、短編動画表紙、サークルのポスターでは、空白のキャンバスと複雑なソフトが壁になります。Canva は生成、背景除去、拡張、寸法変更、翻訳をキャンバスに置き、Firefly は画像、動画、音声、ベクターを続けて編集できます。[Canva Magic Studio](https://www.canva.com/newsroom/news/magic-studio/) · [Adobe Firefly 発表](https://news.adobe.com/news/2025/04/adobe-revolutionizes-ai-assisted-creativity-firefly)

「もう一度」だけでなく操作を渡します。物件写真、ポッドキャスト表紙、三寸法の催事ポスターなど完成物を決め、文字、人物、ブランド色を固定して一部だけ変えます。

### 5. 「今回はどこを間違えた？」：個別の説明

<figure class="product-shot">
  <a href="https://blog.duolingo.com/duolingo-max/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/duolingo-explain.jpg" alt="Duolingo Max Explain My Answer の説明画面" loading="lazy" />
  </a>
  <figcaption><strong>Explain My Answer：</strong>直前の回答を引用し、複数形 vestidos に gustan が必要な理由を説明して追加例へ進めます。一般文法ではなく「今の間違い」に答えます。</figcaption>
</figure>

同じ答えでも初心者と熟練者には別の説明が必要です。Explain My Answer は直前の誤答から始まるので、問題、回答、進度を知らない一般 Q&A より自然です。[Duolingo: Explain My Answer](https://blog.duolingo.com/explain-my-answer-now-free/)

運動姿勢、撮影設定、棋譜、楽器練習にも使えます。実際の一回を入力し、一番直す価値のある点を示します。個人データのない「個別助言」は名前だけを変えた一般論です。

### 6. 「推薦だけでなく覚えて」：音楽と継続体験

<figure class="product-shot product-shot--mobile">
  <a href="https://newsroom.spotify.com/2023-02-22/spotify-debuts-a-new-ai-dj-right-in-your-pocket/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/spotify-ai-dj.jpg" alt="Spotify AI DJ の再生画面" loading="lazy" />
  </a>
  <figcaption><strong>Spotify AI DJ：</strong>ホームに継続的な再生入口があり、曲と操作へ直結します。長期の聴取履歴、楽曲庫、次の再生操作に支えられ、司会の一文だけではありません。</figcaption>
</figure>

Spotify AI DJ は紹介文だけでなく長期履歴から選曲し、継続する声で体験をつなぎます。複製しにくいのは口調より好みデータ、権利、再生操作です。[Spotify AI DJ](https://newsroom.spotify.com/2023-02-22/spotify-debuts-a-new-ai-dj-right-in-your-pocket/) · [Deloitte: 2025 Digital Media Trends](https://www.deloitte.com/us/en/insights/industry/technology/digital-media-trends-consumption-habits-survey/2025.html)

ランニング、料理、就寝前読書にも継続体験があります。過去の選択から次回を変え、利用者が簡単に修正できるようにします。本人以上に理解したふりは不要です。

### 7. 「複雑な規則を次の一手へ」：個人財務と生活手続き

<figure class="product-shot product-shot--portrait">
  <a href="https://turbotax.intuit.com/personal-taxes/mobile-apps/turbotax/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/intuit-assist.jpg" alt="TurboTax で二年の税額控除を比べる Intuit Assist" loading="lazy" />
  </a>
  <figcaption><strong>TurboTax の Intuit Assist：</strong>今年と前年の控除額を比べ、「他に申請できる控除」などの次の質問を出します。個人財務支援の土台は本人のデータと現在の仕事です。</figcaption>
</figure>

税、信用、保険、請求は規則が複雑で資料が散らばり、次の行動が人ごとに違います。Intuit Assist は TurboTax、Credit Karma、QuickBooks の既存財務データを説明と行動へつなぎます。[Intuit Assist](https://www.intuit.com/intuitassist/)

リスクも高い領域です。初版は資料一覧、用語説明、請求分類、手続き通知に向き、事実、推定、提案を区別します。税申告、投資取引、保険選択では本人の確認と専門家への入口が必要です。

## 自分の企業向け・個人向け方向を探す場所

上の事例は「場面の形」を学ぶもので、業界名を交換する型ではありません。自分の方向は、接触できる人、資料、習慣の中にあります。企業向けと個人向けでは探し方が違います。

### 企業向け：一つの職種を最後まで追う

企業資料に「起業機会」とは書かれません。求人、調達文書、作業手順、ソフト評価、導入事例として現れます。貿易担当、物件窓口、診療所受付、保守技術者など一職種を選び、仕事を追います。

<div class="idea-routes">
  <div class="idea-route idea-route--b">
    <span>企業向けを探す場所</span>
    <ul>
      <li><strong>求人サイト：</strong>毎日の責任、使用システム、提出表、報告を読む。</li>
      <li><strong>入札と調達：</strong>企業がお金を払う問題、受入基準、システム境界を見る。</li>
      <li><strong>ソフト評価：</strong>G2、Capterra、アプリ市場、論壇の低評価から「Excel へ出す」「毎回手で補う」を探す。</li>
      <li><strong>企業事例と年次報告：</strong>会社名とデジタル化、効率、顧客対応を検索して予算のある案件を見る。</li>
      <li><strong>実作業の資料：</strong>古い作業票、見積書、検査表、助けを求める会話、研修文書は製品入口に近い。</li>
    </ul>
  </div>
  <div class="idea-route idea-route--c">
    <span>そのまま使える検索語</span>
    <p><code>設備保守 担当者 日常 業務フロー</code></p>
    <p><code>物件 顧客対応 入札 自動化 filetype:pdf</code></p>
    <p><code>site:g2.com field service software reviews</code></p>
    <p><code>customer support workflow pain points report</code></p>
    <p><code>業界 デジタル変革 事例 年次報告</code></p>
  </div>
</div>

貿易に関心があっても「AI × 貿易」だけを探しません。求人から問い合わせ返信、見積、仕様確認、納期催促、通関資料を記録し、実際の見積と低評価を見ます。万能支援より「英語問い合わせ後、過去価格と製品情報から確認用見積を作る」方が強いかもしれません。

### 個人向け：一日を追い、繰り返す面倒を探す

個人向けは、いつ人が携帯を取り出すかから始めます。検索、比較、記録、練習、待ち、共有のうち毎週起きるものは何か。スクリーンショット、メモ、お気に入り、グループ会話で無理に終えているものは何かを探します。

<div class="idea-routes">
  <div class="idea-route idea-route--c">
    <span>個人向けを探す場所</span>
    <ul>
      <li><strong>App Store と Android 市場：</strong>一〜三星評価から不足機能、課金での離脱、利用中止理由を見る。</li>
      <li><strong>SNS と Reddit：</strong>「やり方」「道具はあるか」「おすすめ」を検索し、コメントの制約を読む。</li>
      <li><strong>Product Hunt とランキング：</strong>新製品が解いた小さな動作と、利用者が次に望むことを見る。</li>
      <li><strong>傾向・流量報告：</strong>Google Trends、QuestMobile、iResearch、年次報告で長期行動か確認する。</li>
      <li><strong>自分の写真とお気に入り：</strong>大量の画像、再読しない案内、繰り返しコピーする文は未接続の流れ。</li>
    </ul>
  </div>
  <div class="idea-route idea-route--b">
    <span>そのまま使える検索語</span>
    <p><code>site:reddit.com "I wish there was an app"</code></p>
    <p><code>子どもと旅行 計画 大変</code></p>
    <p><code>家計簿 App 使いにくい 評価</code></p>
    <p><code>Product Hunt AI language learning</code></p>
    <p><code>AI アプリ 利用者規模 報告</code></p>
  </div>
</div>

旅行が好きでもすぐ「AI 旅程」を作りません。なぜ案内を十件保存するかを見ます。店の臨時休業、年長者の歩行、公演後の安全な帰路など、繰り返す一瞬を選ぶと生成記事ではなく開かれる道具になります。

### 資料を見つけても、すぐコードを書かない

方向には三種類の証拠を残します。流れが分かる一資料、三人が繰り返す面倒、すでにお金または時間を払う代替手段です。その後六十分で具体化します。

<div class="fieldwork">
  <div class="fieldwork__step"><b>01</b><span>一人を決める</span><p>企業向けは職種、個人向けは生活状態まで書く。「企業利用者」「若者」だけにしない。</p></div>
  <div class="fieldwork__step"><b>02</b><span>一回の発生を見る</span><p>表、画面録画、低評価、実操作から、具体的に止まる場所を探す。</p></div>
  <div class="fieldwork__step"><b>03</b><span>三回交差確認する</span><p>同じ問題を三人または三資料で確認し、一つの面白い不満だけで進まない。</p></div>
  <div class="fieldwork__step"><b>04</b><span>一手だけ受ける</span><p>入力、出力、確認者、指標を決め、AI が本当に合うか判断する。</p></div>
</div>

最後に、他人が想像できる一文へします。

> **誰**が**どの瞬間**に、今は**どの資料・方法**で**何を完了**しているか。まず AI に**一手**を任せ、**誰**が確認し、**どの変化**で価値を判断するか。

企業向けの例：

> 包装ライン操作員が E37 を見ると、紙の手順書と古い作業票を探す。システムは設備型式から該当節と三つの確認手順を出し、保守技術者が確認する。試験では平均停止時間を測る。

個人向けの例：

> 親が週末に子どもと博物館へ行くとき、投稿、地図、評価から旅程を組む。製品は年齢と時間から三時間の経路を作り、営業時間と料金の出典を残し、親の確認後に予定へ追加する。

ここまで具体的なら、インタビュー、試作、小規模試用へ進める idea です。

## 参考資料

以下には **67 件の情報源**があります。本文は調査方法の明確な報告と一次事例を優先し、中国の証券会社資料は商用化の関心を観察するために使い、投資判断を需要の証明にしません。販売側の事例はインタビューと実データで交差確認してください。

<details class="source-group">
<summary>一、全体的な導入と企業価値（15）</summary>

1. [McKinsey：The Economic Potential of Generative AI](https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier)
2. [McKinsey：The State of AI 2025](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai)
3. [PwC：2025 Global AI Jobs Barometer](https://www.pwc.com/gx/en/issues/c-suite-insights/the-leadership-agenda/AI-jobs-barometer.html)
4. [PwC：Global Workforce Hopes and Fears Survey 2025](https://www.pwc.com/gr/en/publications/specific-to-all-industries-index/hopes-and-fears-2025.html)
5. [Deloitte：State of Generative AI in the Enterprise](https://www2.deloitte.com/us/en/pages/about-deloitte/articles/press-releases/state-of-generative-ai.html)
6. [Microsoft：2025 Work Trend Index](https://www.microsoft.com/en-us/worklab/work-trend-index/2025-the-year-the-frontier-firm-is-born)
7. [IBM：5 Trends for 2025](https://www.ibm.com/thought-leadership/institute-business-value/en-us/report/business-trends-2025)
8. [IBM：2025 CDO Study](https://www.ibm.com/thought-leadership/institute-business-value/en-us/report/2025-cdo)
9. [Cisco：2025 AI Readiness Index](https://www.cisco.com/c/m/en_us/solutions/ai/readiness-index/realizing-the-value-of-ai.html)
10. [EY：2025 AI Pulse Survey](https://www.ey.com/en_us/insights/emerging-technologies/pulse-ai-survey)
11. [Accenture：Reinventing Enterprise Models in the Age of Gen AI](https://www.accenture.com/us-en/insights/artificial-intelligence/ai-investments)
12. [Accenture：Making Reinvention Real with Gen AI](https://www.accenture.com/us-en/insights/consulting/making-reinvention-real-with-gen-ai)
13. [OpenAI：The State of Enterprise AI 2025](https://openai.com/business/guides-and-resources/the-state-of-enterprise-ai-2025-report/)
14. [中国信通院：《人工智能发展报告（2024 年）》](https://hrssit.cn/Uploads/file/20241217/1734400434600250.pdf)
15. [CNNIC：《生成式人工智能应用发展报告（2025）》](https://www3.cnnic.cn/n4/2025/1021/c88-11391.html)

</details>

<details class="source-group">
<summary>二、企業向けの業界・職種・業務フロー（24）</summary>

16. [McKinsey：Unlocking Profitable B2B Growth Through Gen AI](https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/unlocking-profitable-b2b-growth-through-gen-ai)
17. [McKinsey：Capturing the Full Value of Generative AI in Banking](https://www.mckinsey.com/industries/financial-services/our-insights/capturing-the-full-value-of-generative-ai-in-banking)
18. [McKinsey：The AI-powered Bank—Customer Care](https://www.mckinsey.com/industries/financial-services/our-insights/the-ai-powered-bank-rewiring-for-excellence-in-customer-care)
19. [McKinsey：The Future of AI in Insurance](https://www.mckinsey.com/industries/financial-services/our-insights/the-future-of-ai-in-the-insurance-industry)
20. [McKinsey：Tackling Healthcare’s Biggest Burdens with Generative AI](https://www.mckinsey.com/industries/healthcare/our-insights/tackling-healthcares-biggest-burdens-with-generative-ai)
21. [McKinsey：Generative AI in Healthcare](https://www.mckinsey.com/industries/healthcare/our-insights/generative-ai-in-healthcare-current-trends-and-future-outlook)
22. [Deloitte：2025 Manufacturing Industry Outlook](https://www.deloitte.com/us/en/insights/industry/manufacturing-industrial-products/manufacturing-industry-outlook/2025.html)
23. [Deloitte：2025 Smart Manufacturing Survey](https://www2.deloitte.com/us/en/insights/industry/manufacturing/2025-smart-manufacturing-survey.html)
24. [Deloitte：2025 Retail Industry Outlook](https://www.deloitte.com/us/en/insights/industry/retail-distribution/retail-distribution-industry-outlook-2025.html)
25. [Deloitte：2025 Global Health Care Outlook](https://www.deloitte.com/content/dam/assets-zone1/tw/en/docs/industries/life-sciences-health-care/2025/2025-healthcare-outlook-en.pdf)
26. [Accenture：Commercial Banking Trends 2024](https://www.accenture.com/content/dam/accenture/final/accenture-com/document-2/Accenture-Commercial-Banking-Trends-2024.pdf)
27. [Accenture：Banking Trends 2026](https://www.accenture.com/us-en/insights/banking/accenture-banking-trends-2026)
28. [Thomson Reuters：2025 Generative AI in Professional Services](https://www.thomsonreuters.com/en-us/posts/technology/genai-professional-services-report-2025/)
29. [Salesforce：State of Service 2025](https://www.salesforce.com/news/stories/state-of-service-report-announcement-2025/)
30. [Salesforce：State of Sales 2026](https://www.salesforce.com/en/wp-content/uploads/sites/4/documents/reports/sales/salesforce-state-of-sales-report-2026.pdf)
31. [Adobe：2025 AI and Digital Trends](https://business.adobe.com/content/dam/dx/us/en/resources/digital-trends-report-2025/2025_Digital_Trends_Report.pdf)
32. [Adobe：2025 Content Creation and Management](https://business.adobe.com/content/dam/dx/us/en/resources/reports/content-management-digital-trends/2025-ai-and-digital-trends-content-creation-and-management.pdf)
33. [艾瑞咨询：《2025 年中国企业级 AI 应用行业研究报告》](https://www.bsia.org.cn/site/content/31686.html)
34. [GitHub：Quantifying Copilot’s Impact on Developer Productivity](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/)
35. [Siemens × Microsoft：Industrial Copilot](https://news.microsoft.com/source/2024/10/24/siemens-and-microsoft-scale-industrial-ai/)
36. [Abridge：Hartford HealthCare Ambient AI 案例](https://www.abridge.com/press-release/abridge-hartford-healthcare)
37. [AWS：Sun Life 内部知识助手](https://aws.amazon.com/solutions/case-studies/sun-life-case-study/)
38. [AWS：ResultsCX 客服自动化](https://aws.amazon.com/solutions/case-studies/resultscx/)
39. [AWS：Sanofi 企业 AI 助手](https://aws.amazon.com/solutions/case-studies/sanofi-bedrock-case-study/)

</details>

<details class="source-group">
<summary>三、導入製品と企業事例（10）</summary>

40. [OpenAI：Morgan Stanley](https://openai.com/index/morgan-stanley/)
41. [OpenAI：Klarna](https://openai.com/index/klarna/)
42. [OpenAI：Moderna](https://openai.com/index/moderna/)
43. [OpenAI：BBVA](https://openai.com/index/bbva-2025/)
44. [OpenAI × PwC：Reimagining the Office of the CFO](https://openai.com/index/openai-pwc-finance-collaboration/)
45. [Microsoft：Siemens 现场服务报告](https://www.microsoft.com/en/customers/story/19736-siemens-ag-germany-dynamics-365-field-service)
46. [AWS：Legal & General 文档处理](https://aws.amazon.com/solutions/case-studies/aws-innovator-legal-and-general/)
47. [AWS × Infosys：医疗保险客服助手](https://aws.amazon.com/blogs/apn/how-infosys-built-aws-generative-ai-based-assistant-for-a-healthcare-payer-company/)
48. [Notion：Notion AI 功能说明](https://www.notion.com/help/notion-ai-faqs)
49. [Canva：Magic Studio](https://www.canva.com/newsroom/news/magic-studio/)

</details>

<details class="source-group">
<summary>四、個人向け利用者と製品（13）</summary>

50. [Capgemini：What Matters to Today’s Consumer 2025](https://www.capgemini.com/insights/research-library/top-consumer-trends-in-2025/)
51. [Accenture：Me, My Brand and AI](https://www.accenture.com/us-en/insights/consulting/me-my-brand-ai-new-world-consumer-engagement)
52. [Deloitte：2025 Digital Media Trends](https://www.deloitte.com/us/en/insights/industry/technology/digital-media-trends-consumption-habits-survey/2025.html)
53. [QuestMobile：2025 中国移动互联网春季报告](https://www.questmobile.cn/research/report/1919961024158601218/)
54. [QuestMobile：2025 年 8 月 AI 应用行业报告](https://www.questmobile.com.cn/research/report/1967853261412208641/)
55. [艾瑞咨询：《2025 年中国 AI 类 App 流量分析报告》](https://www.etc.org.cn/UserFiles/Article/file/6388341575962762472758248.pdf)
56. [Amazon：Rufus 购物助手](https://www.aboutamazon.com/news/retail/amazon-rufus)
57. [Expedia：对话式旅行规划](https://www.expedia.com/newsroom/expedia-launches-conversational-trip-planning-powered-by-chatgpt-to-inspire-members-to-dream-about-travel-in-new-ways/)
58. [Duolingo：Duolingo Max](https://blog.duolingo.com/duolingo-max/)
59. [Khan Academy：Khanmigo](https://2023-2024.annualreport.khanacademy.org/khanmigo)
60. [Spotify：AI DJ](https://newsroom.spotify.com/2023-02-22/spotify-debuts-a-new-ai-dj-right-in-your-pocket/)
61. [Intuit：Intuit Assist](https://www.intuit.com/intuitassist/)
62. [Adobe：Firefly](https://news.adobe.com/news/2025/04/adobe-revolutionizes-ai-assisted-creativity-firefly)

</details>

<details class="source-group">
<summary>五、中国証券会社の視点（5）</summary>

63. [华鑫证券：WAIC 大会强供给，AI 应用商业化如何解](https://pdf.dfcfw.com/pdf/H3_AP202507291717868704_1.pdf)
64. [国信证券：人工智能专题——AI Agent](https://pdf.dfcfw.com/pdf/H3_AP202503121644302597_1.pdf)
65. [东吴证券：2025 年 AI 应用渗透趋势](https://pdf.dfcfw.com/pdf/H301_AP202501021641518997_1.pdf)
66. [中银证券：“人工智能+”应用与平台](https://pdf.dfcfw.com/pdf/H3_AP202510201765533690_1.pdf)
67. [AIGC 行业深度：算力、模型与应用的创新融合](https://pdf.dfcfw.com/pdf/H3_AP202411151640914780_1.pdf)

</details>

<p class="source-footnote">資料の検索・整理時期：2026 年 8 月。報告の比率は標本、地域、提供企業の定義に左右されるため、対象利用者へのインタビューと試用データの代わりにはなりません。</p>

<style scoped>
.research-note {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 24px;
  margin: 32px 0 42px;
  padding: 28px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background:
    radial-gradient(circle at 8% 12%, color-mix(in srgb, var(--vp-c-brand-1) 16%, transparent), transparent 34%),
    var(--vp-c-bg-soft);
}

.research-note__eyebrow {
  display: block;
  margin-bottom: 10px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .12em;
}

.research-note strong {
  display: block;
  font-size: 21px;
  line-height: 1.5;
}

.research-note p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.8;
}

.scene-check {
  margin: 24px 0 38px;
  padding: 18px 20px;
  border-left: 3px solid var(--vp-c-brand-1);
  border-radius: 0 12px 12px 0;
  background: var(--vp-c-bg-soft);
}

.scene-check span {
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 700;
}

.scene-check p {
  margin: 6px 0 0;
}

.product-shot {
  margin: 20px 0 30px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 14px 38px color-mix(in srgb, var(--vp-c-text-1) 8%, transparent);
}

.product-shot a {
  display: block;
  background: #f5f5f3;
}

.product-shot img {
  display: block;
  width: 100%;
  max-height: 520px;
  object-fit: contain;
}

.product-shot--portrait img {
  max-height: 560px;
}

.product-shot--mobile img {
  max-height: 520px;
}

.product-shot figcaption {
  padding: 14px 17px 16px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.75;
}

.product-shot figcaption strong {
  color: var(--vp-c-text-1);
}

.idea-routes {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(240px, .75fr);
  gap: 14px;
  margin: 24px 0 28px;
}

.idea-route {
  padding: 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
}

.idea-route--b {
  background: color-mix(in srgb, var(--vp-c-brand-soft) 58%, var(--vp-c-bg));
}

.idea-route--c {
  background: var(--vp-c-bg-soft);
}

.idea-route > span {
  display: block;
  margin-bottom: 12px;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 700;
}

.idea-route ul {
  margin: 0;
  padding-left: 20px;
}

.idea-route li {
  margin: 10px 0;
}

.idea-route p {
  margin: 8px 0;
}

.idea-route code {
  white-space: normal;
  word-break: break-word;
}

.fieldwork {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin: 28px 0 34px;
}

.fieldwork__step {
  min-height: 150px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.fieldwork__step b {
  display: block;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  letter-spacing: .1em;
}

.fieldwork__step span {
  display: block;
  margin-top: 12px;
  font-size: 18px;
  font-weight: 700;
}

.fieldwork__step p {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
}

.source-group {
  margin: 12px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.source-group summary {
  padding: 16px 18px;
  cursor: pointer;
  font-weight: 700;
}

.source-group ol {
  margin: 0;
  padding: 0 22px 18px 44px;
}

.source-group li {
  margin: 8px 0;
}

.source-footnote {
  margin-top: 18px;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

@media (max-width: 720px) {
  .research-note,
  .idea-routes,
  .fieldwork {
    grid-template-columns: 1fr;
  }

  .research-note {
    padding: 22px;
  }

  .fieldwork__step {
    min-height: auto;
  }
}
</style>
