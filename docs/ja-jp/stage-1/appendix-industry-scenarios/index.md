---
title: 'AIアプリケーションシーン参考（Bエンド・Cエンド）'
description: '本文書は、LLM大規模言語モデルのBエンド企業シーンとCエンド消費シーンにおける応用方向をまとめています。Bエンドは製造業、スマートカスタマーサポート、教育、医療、金融など19業界の実装アプリケーションを網羅し、Cエンドはライフスタイル、感情コンパニオン、エンターテイメント、自己成長など16の消費シーンのインスピレーションをカバーし、AIアプリ開発者に包括的な参考を提供します。'
---

<script setup>
import { computed, ref } from 'vue'

const duration = '約 <strong>6 時間</strong>'

const interestPoint = ref('')
const purpose = ref('')

// 各業界のトピックプール
const topicPool = {
  'manufacturing': [
    { title: '新エネルギーバス外観AI補助設計プラットフォーム', desc: '画像生成モデルによる外観コンセプト設計' },
    { title: 'スマート図面設計・審査アシスタント', desc: 'RAG技術で企業設計規範ナレッジベースを構築' },
    { title: '技術文書自動生成・管理', desc: 'LLMに基づく製品仕様書と操作マニュアルの自動生成' },
    { title: '生産設備巡回点検レポート自動生成アシスタント', desc: '音声による設備状態記述、構造化巡回点検レポートの自動生成' },
    { title: '工業設備故障診断ナレッジQAアシスタント', desc: '過去の故障ケースに基づくベクトルナレッジベースの構築' }
  ],
  'customer-service': [
    { title: 'マルチチャネルスマートカスタマーサポート自動応答・チケット生成システム', desc: 'マルチチャネルメッセージ受信、LLMによる意図理解後の応答生成' },
    { title: '見込み客発掘・フォローアップ提案アシスタント', desc: '過去の対話記録を分析し、高意向顧客を識別' },
    { title: '企業内部ナレッジスマート検索・QAマネージャー', desc: '内部文書に基づくベクトルナレッジベースの構築' },
    { title: 'カスタマーサポート対話スマートサマリー・チケット生成ツール', desc: '会話終了後の自動サマリー生成とキー情報抽出' },
    { title: 'カスタマーサポート金牌トーク推薦ナレッジシステム', desc: '優秀な事例を分析し、金牌トークテンプレートを抽出' }
  ],
  'education': [
    { title: 'パーソナライズ言語学習パス計画・スマート導学システム', desc: '学習者レベルを評価し、毎日の学習タスクを計画' },
    { title: '授業案自動作成・教育リソース配信プラットフォーム', desc: 'カリキュラムに基づく授業案フレームワークの自動生成' },
    { title: '宿題自動採点・学習状況診断分析システム', desc: '記述式問題の自動採点と添削アドバイスの自動生成' },
    { title: '人材ポジションコンピテンシーモデル構築・学習マップ', desc: '求人JDを分析して能力要件を抽出' },
    { title: '外国語スピーキング1対1シチュエーション実践演習', desc: 'LLMが異なる役割を演じ、スピーキング会話を実施' }
  ],
  'programming': [
    { title: 'スマートコード補完・Bug自動修正アシスタント', desc: 'IDEプラグインによるリアルタイムコード補完提案' },
    { title: 'ローコードアプリ構築・プロセス自動化プラットフォーム', desc: '自然言語による要件記述をローコード設定に変換' },
    { title: 'ユニットテストケース生成システム', desc: 'AST解析によるソースコード解析、境界条件テストケースの生成' },
    { title: 'コードスマート分析・言語移行ツール', desc: 'コード品質の分析と最適化提案' },
    { title: 'フロントエンドUIコード自動生成ツール', desc: 'デザイン画像認識によるレスポンシブCSSの生成' }
  ],
  'healthcare': [
    { title: '医学検査レポートスマート解読アシスタント', desc: 'OCRによる主要指標の認識、異常値の解読' },
    { title: 'ナレッジ検索技術ベースの健康相談エキスパート', desc: '医学ナレッジグラフの構築、RAG検索による回答生成' },
    { title: '臨床研究データ意思決定分析プラットフォーム', desc: 'EMRデータの統合、統計分析コードの補助生成' },
    { title: '医学画像レポート自動生成ツール', desc: '画像特徴の記述による構造化レポートの自動生成' },
    { title: '慢性疾患管理服薬リマインダースマートアシスタント', desc: 'パーソナライズ服薬リマインダの生成、服薬禁忌チェック対応' }
  ],
  'security': [
    { title: 'コードセキュリティ脆弱性検出・修正エンジン', desc: 'SASTによるコードスキャン、脆弱性原理の分析' },
    { title: 'AI生成フィッシングメールスマート識別・ブロックシステム', desc: 'メール内容の分析によるAI生成フィッシングメールの識別' },
    { title: 'セキュリティ運用日報自動生成アシスタント', desc: 'ログ集約、キーイベントの自動抽出' },
    { title: 'ペネトレーションテストレポートスマート生成アシスタント', desc: '脆弱性記述に基づくレポートの自動生成' },
    { title: '脅威インテリジェンススマート検索・分析アシスタント', desc: 'マルチソース脅威インテリジェンスの照会、コンテンツの解読' }
  ],
  'finance': [
    { title: '与信審査レポートスマート生成アシスタント', desc: '財務データ入力による与信審査レポートの自動生成' },
    { title: 'プライベートバンクウェルスマートコンサルタント', desc: '顧客リスク許容度の分析による資産配分提案の生成' },
    { title: 'IPO目論見書スマート生成・コンプライアンス検証アシスタント', desc: 'モジュール化テンプレートによる事業記述の自動入力' },
    { title: '企業財務レポート自動生成・経営異常早期警戒システム', desc: '財務分析と経営層討論の自動生成' },
    { title: '保険代理店スマートトーク練習', desc: 'シミュレーション対話によるトークのコンプライアンス性と説得力の評価' }
  ],
  'enterprise': [
    { title: '企業契約ライフサイクルコンプライアンス審査・修正提案プラットフォーム', desc: '条項の法規データベースとの照合、コンプライアンス審査レポートの生成' },
    { title: '営業通話音声書き起こし・トーク推薦', desc: 'ASR書き起こし、会話分析と金牌トークの推薦' },
    { title: 'マーケティングコンテンツスマート生成・デザインシステム', desc: 'マーケティングコピーとセールスポイントの抽出' },
    { title: '競合広告出稿分析プラットフォーム', desc: '競合広告の収集、出稿戦略の分析' },
    { title: '全网トレンドトピックスマート分析・コンテンツ推薦システム', desc: 'トレンド分析とトピック提案の推薦' }
  ],
  'content': [
    { title: '映像・小説コンテンツ制作補助プラットフォーム', desc: 'ストーリー概要、キャラクター設定、セリフ生成の提供' },
    { title: '企業ブランドストーリー・PR記事スマート執筆アシスタント', desc: 'ブランドキーワード入力による複数スタイルコピーの生成' },
    { title: 'バーチャルデジタルヒューマンライブ配信・配信管理システム', desc: 'デジタルヒューマン像 + TTS音声 + LLM対話' },
    { title: 'ショートビデオスクリプト生成・スマート編集', desc: 'ショートビデオスクリプトと絵コンテの生成' },
    { title: 'マーケティングコンテンツスマート生成・デザインシステム', desc: 'マーケティングコピーとセールスポイントの抽出' }
  ],
  'government': [
    { title: '12345行政窓口スマート音声ナビ・自動振り分けシステム', desc: '音声認識による要望の理解とスマート振り分け' },
    { title: '行政サービスホールスマート案内・政策QAロボット', desc: '行政ナレッジベースのRAG検索' },
    { title: '企業支援政策スマートマッチング・精密配信プラットフォーム', desc: '企業プロファイルによる適用政策の自動マッチング' },
    { title: '行政審査書類スマート事前審査・コンプライアンス検証アシスタント', desc: 'OCR認識とキー情報抽出' },
    { title: '都市グリッドイベントスマート識別・配車管理プラットフォーム', desc: 'イベントタイプの識別と振り分け' }
  ],
  'legal': [
    { title: '契約リスク脆弱性ワンクリック「間違い探し」Agent', desc: 'リスクチェックリストとの照合による潜在的問題の識別' },
    { title: '類似案件勝訴率AIスマート評価コンサルタント', desc: '案件特徴抽出、類似案件の検索マッチング' },
    { title: '法規変更リアルタイム監視・業務影響分析レーダー', desc: '変更内容の解析と業務影響の評価' },
    { title: '弁護士レターAIGC自動起案ツール', desc: '事実陳述入力による規範的な弁護士レターの生成' },
    { title: '複雑な法律条項「翻訳」を平易な言葉にする解説プラグイン', desc: '分かりやすい解説の生成' }
  ],
  'travel': [
    { title: 'AIGCベースのラク旅ガイドジェネレーター', desc: '毎日の旅程スケジュールの自動生成' },
    { title: '全网航空券・ホテル価格トレンド予測・低価格自動ロックボット', desc: 'MLモデルによる価格トレンド予測' },
    { title: 'ビザ書類スマート事前審査・自動フォーム記入補助システム', desc: 'OCR認識による情報完全性チェック' },
    { title: '海外旅行リアルタイム音声翻訳・メニュー視覚中国語化マネージャー', desc: 'オフライン音声翻訳、メニュー画像OCR' },
    { title: '旅行足迹自動生成精美旅行記・SNS投稿アシスタント', desc: '写真情報抽出による旅行記文案の生成' }
  ],
  'emotion': [
    { title: 'LLMベースの24時間深層コンパニオン仮想パートナー', desc: '記憶システムによる対話履歴の保存' },
    { title: 'マルチモーダル感情認識・心理カウンセリングAIコンサルタント', desc: '音声トーン分析 + テキスト感情認識' },
    { title: 'アルツハイマー老人AI認知訓練・記憶想起デジタルヒューマン', desc: '認知ゲーム訓練、古い写真による記憶トリガー' },
    { title: '社交不安のAIGCシミュレーション社交練習コーチ', desc: 'バーチャル社交シーンのシミュレーション' },
    { title: '全天候気分監視・AIポジティブ感情モチベーションアシスタント', desc: '気分トレンドの分析とモチベーションコンテンツの生成' }
  ],
  'entertainment': [
    { title: 'LLM駆動のオープンワールドゲームNPC自律意思決定エンジン', desc: 'NPC行動木とLLM意思決定の融合' },
    { title: '没入型マーダーミステリーAIGCストーリー推演・DMコントロール補助ツール', desc: 'プレイヤーの選択によるストーリー分岐のトリガー' },
    { title: 'インタラクティブ小説エンディング生成式修飾器', desc: '読者の選択がストーリーの方向性に影響' },
    { title: 'eスポーツ戦局CVビジュアル分析・AIスマート実況アナウンサー', desc: 'ゲーム画面のリアルタイム分析' },
    { title: 'マルチキャラTTS音声合成オーディオブック自動生成システム', desc: 'テキストのキャラクター割り当て、パーソナライズ音色の生成' }
  ],
  'ecommerce': [
    { title: '高コンバージョンAIGC商品詳細ページ一括生産ツール', desc: 'セールスポイントコピーとシーン記述の生成' },
    { title: 'アパレルバーチャルモデルAIスマート試着・展示動画生成ファクトリー', desc: 'バーチャルモデル試着効果の生成' },
    { title: '越境EC多言語LLMローカライズ翻訳・ブラッシュアップアシスタント', desc: '商品説明の多言語翻訳' },
    { title: '24時間全天候AIGCデジタルヒューマンライブ配信システム', desc: 'デジタルヒューマン像 + リアルタイムトーク生成' },
    { title: '市場トレンドAIインサイト・爆売り予測エンジン', desc: 'トレンドホットスポットの洞察、品揃え提案' }
  ],
  'energy': [
    { title: '家庭電力使用行動AI分析・省エネ戦略コンサルタント', desc: '電力使用パターンの分析、省エネ提案の生成' },
    { title: '太陽光パネル欠陥ドローンCVビジュアル識別システム', desc: 'ドローン巡回撮影、熱赤外画像分析' },
    { title: '電力スポット取引価格AIトレンド予測・自動利益戦略Agent', desc: '価格予測モデル、戦略生成' },
    { title: '企業全チェーンカーボン排出AI自動算定・ESGレポート生成アシスタント', desc: 'カーボン排出因子の計算、ESGレポートの自動生成' },
    { title: '電網異常気象負荷AI予測・緊急配車指揮システム', desc: '気象データ連携、負荷予測モデル、配車戦略生成' }
  ],
  'av-media': [
    { title: '長編動画ハイライトAI識別・ショートビデオ自動編集ツール', desc: 'ビデオコンテンツ分析、キーフレーム識別' },
    { title: 'ビデオ背景ノイズAIスマート分離・音声強調アシスタント', desc: 'オーディオ分離モデル、背景ノイズ除去' },
    { title: '古い映像4Kアップスケーリング修復・AIスマート着色ワークベンチ', desc: 'ビデオ超解像度モデル、AI自動着色' },
    { title: 'テキストからリアルレベルTTS吹き替え・感情制御システム', desc: 'マルチ音色TTSモデル、感情制御生成' },
    { title: '会議録音AIスマート書き起こし・コアToDo抽出アシスタント', desc: '複数人会議の音声分離書き起こし' }
  ],
  'ai-marketing': [
    { title: 'RED爆売りコピーAIGC自動執筆エンジン', desc: '種草コピーの生成、emoji最適化' },
    { title: 'マーケティングポスターAIスマートレイアウト・マルチサイズ適応ツール', desc: 'ポスターテンプレートのスマートマッチング' },
    { title: 'ブランドLOGOクリエイティブAIGC生成・VI体系構築プラットフォーム', desc: 'LOGOクリエイティブ生成、VI規範生成' },
    { title: '全网ホットAI追跡・トレンドマーケティングクリエイティブ生成アシスタント', desc: 'マーケティング角度の分析、クリエイティブプランの生成' },
    { title: 'ショートビデオスクリプトクリエイティブAIGC生成・絵コンテガイダンスアシスタント', desc: 'スクリプトと絵コンテの生成、撮影アドバイス' }
  ],
  'data-intelligence': [
    { title: '自然言語からSQL文への自動生成ツール', desc: '自然言語クエリのSQLへの変換' },
    { title: '企業データアセットカタログスマート棚卸・分類システム', desc: 'メタデータ収集、自動分類' },
    { title: 'データ品質異常自動検出・修正提案エンジン', desc: 'ルールエンジン + MLモデルによる異常検出' },
    { title: 'スマートレポート生成・ビジュアル設定アシスタント', desc: '対話式レポート設定の生成' },
    { title: 'データ指標定義スマートQAアシスタント', desc: '指標定義ドキュメントに基づくナレッジベースの構築' }
  ]
}

// 推薦リンクマッピングテーブル
const recommendationMap = {
  'creative-content': {
    'increase-efficiency': ['content', 'av-media', 'ai-marketing', 'entertainment'],
    'reduce-cost': ['content', 'ecommerce', 'ai-marketing'],
    'improve-experience': ['entertainment', 'emotion', 'travel', 'content'],
    'innovate-business': ['ai-marketing', 'content', 'av-media', 'entertainment']
  },
  'tech-service': {
    'increase-efficiency': ['programming', 'enterprise', 'data-intelligence', 'customer-service'],
    'reduce-cost': ['programming', 'enterprise', 'manufacturing'],
    'improve-experience': ['customer-service', 'enterprise', 'programming'],
    'innovate-business': ['data-intelligence', 'programming', 'security', 'enterprise']
  },
  'data-intel': {
    'increase-efficiency': ['data-intelligence', 'finance', 'enterprise', 'manufacturing'],
    'reduce-cost': ['data-intelligence', 'manufacturing', 'energy'],
    'improve-experience': ['data-intelligence', 'customer-service', 'ecommerce'],
    'innovate-business': ['data-intelligence', 'finance', 'security', 'ai-marketing']
  },
  'user-service': {
    'increase-efficiency': ['customer-service', 'ecommerce', 'travel', 'enterprise'],
    'reduce-cost': ['customer-service', 'ecommerce', 'enterprise'],
    'improve-experience': ['customer-service', 'emotion', 'travel', 'ecommerce', 'entertainment'],
    'innovate-business': ['ecommerce', 'travel', 'emotion', 'entertainment']
  },
  'industry-solution': {
    'increase-efficiency': ['manufacturing', 'healthcare', 'finance', 'government'],
    'reduce-cost': ['manufacturing', 'energy', 'enterprise', 'finance'],
    'improve-experience': ['healthcare', 'education', 'government', 'travel'],
    'innovate-business': ['finance', 'security', 'legal', 'healthcare', 'government']
  }
}

const interestOptions = [
  { label: 'クリエイティブコンテンツ生成', value: 'creative-content', desc: 'コピー、画像、動画などのクリエイティブコンテンツ' },
  { label: 'テクニカルサービスツール', value: 'tech-service', desc: '開発ツール、自動化、コード補助' },
  { label: 'データインテリジェンス分析', value: 'data-intel', desc: 'データ分析、予測、スマート意思決定' },
  { label: 'ユーザーサービス体験', value: 'user-service', desc: 'カスタマーサポート、マーケティング、ユーザー体験' },
  { label: '業界ソリューション', value: 'industry-solution', desc: '特定業界のディープアプリケーション' }
]

const purposeOptions = [
  { label: '効率向上', value: 'increase-efficiency', desc: '自動化、プロセス高速化' },
  { label: 'コスト削減', value: 'reduce-cost', desc: '人件費削減、リソース最適化' },
  { label: '体験改善', value: 'improve-experience', desc: 'ユーザー満足度、サービス品質' },
  { label: 'ビジネスイノベーション', value: 'innovate-business', desc: '新製品、新モデル' }
]

const industries = [
  { key: 'manufacturing', name: '工業製造業', anchor: '#_1-工業製造業' },
  { key: 'customer-service', name: 'スマートカスタマーサポート', anchor: '#_2-スマートカスタマーサポート' },
  { key: 'education', name: '教育業界', anchor: '#_3-教育業界' },
  { key: 'programming', name: 'スマートプログラミング', anchor: '#_4-スマートプログラミング' },
  { key: 'healthcare', name: '医療方向', anchor: '#_5-医療方向' },
  { key: 'security', name: 'ネットワークセキュリティ', anchor: '#_6-ネットワークセキュリティ' },
  { key: 'finance', name: '金融管理・保険銀行業', anchor: '#_7-金融管理・保険銀行業' },
  { key: 'enterprise', name: '企業サービス', anchor: '#_8-企業サービス' },
  { key: 'content', name: 'コンテンツ制作・運営', anchor: '#_9-コンテンツ制作・運営' },
  { key: 'government', name: 'スマート行政', anchor: '#_10-スマート行政' },
  { key: 'legal', name: '法律事務・契約管理', anchor: '#_11-法律事務・契約管理' },
  { key: 'travel', name: '旅行・外出サービス', anchor: '#_12-旅行・外出サービス' },
  { key: 'emotion', name: 'エモーショナルコンパニオン', anchor: '#_13-エモーショナルコンパニオン' },
  { key: 'entertainment', name: 'レジャー・エンターテインメント', anchor: '#_14-レジャー・エンターテインメント' },
  { key: 'ecommerce', name: 'ECサービス', anchor: '#_15-ECサービス' },
  { key: 'energy', name: 'エネルギー', anchor: '#_16-エネルギー' },
  { key: 'av-media', name: '音声・動画', anchor: '#_17-音声・動画' },
  { key: 'ai-marketing', name: 'AIマーケティング', anchor: '#_18-AIマーケティング' },
  { key: 'data-intelligence', name: 'データインテリジェンス', anchor: '#_19-データインテリジェンス' }
]

// 推薦結果を計算
const recommendationTopics = computed(() => {
  if (!interestPoint.value || !purpose.value) return []
  
  const keys = recommendationMap[interestPoint.value]?.[purpose.value] || []
  const topics = []
  
  keys.forEach(key => {
    const industry = industries.find(item => item.key === key)
    const industryTopics = topicPool[key] || []
    
    if (industry && industryTopics.length > 0) {
      const count = Math.floor(Math.random() * 2) + 1
      const shuffled = [...industryTopics].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, Math.min(count, shuffled.length))
      
      selected.forEach(topic => {
        topics.push({
          ...topic,
          industryKey: key,
          industryName: industry.name,
          industryAnchor: industry.anchor
        })
      })
    }
  })
  
  return topics.sort(() => Math.random() - 0.5).slice(0, 8)
})

const currentSelection = computed(() => {
  const interest = interestOptions.find(i => i.value === interestPoint.value)
  const pur = purposeOptions.find(p => p.value === purpose.value)
  return {
    interest: interest?.label || '',
    purpose: pur?.label || ''
  }
})

const scrollToAnchor = (anchor) => {
  setTimeout(() => {
    let element = document.querySelector(anchor)
    
    if (!element) {
      const altAnchor = anchor.replace('#_', '#')
      element = document.querySelector(altAnchor)
    }
    
    if (!element) {
      const anchorText = decodeURIComponent(anchor.replace('#', '').replace(/^_/, ''))
      const headings = document.querySelectorAll('h2, h3')
      
      for (let heading of headings) {
        const headingText = heading.textContent.trim()
        const cleanHeading = headingText.replace(/^\d+\.\s*/, '')
        if (cleanHeading === anchorText || headingText.includes(anchorText)) {
          element = heading
          break
        }
      }
    }
    
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
      element.style.backgroundColor = '#f0f9ff'
      element.style.transition = 'background-color 0.3s'
      element.style.padding = '8px'
      element.style.borderRadius = '4px'
      setTimeout(() => {
        element.style.backgroundColor = ''
        element.style.padding = ''
      }, 2000)
    }
  }, 100)
}

const resetSelection = () => {
  interestPoint.value = ''
  purpose.value = ''
}

// ---- C 端场景变量 ----
const cDuration = '約 <strong>4 時間</strong>'

const vibePoint = ref('')
const feeling = ref('')

// 各シーンのトピックプール - 雰囲気、感覚、心理的暗示を強調
const cTopicPool = {
  'lifestyle': [
    { title: '朝の儀式感アラームアシスタント', desc: '天気、スケジュール、気分に基づいて専用の朝の儀式を生成し、毎日を素晴らしいスタートから始める' },
    { title: '一人暮らしの雰囲気クリエイター', desc: '一人暮らしの方に居家の雰囲気プランを設計、照明、音楽、アロマのスマートな組み合わせアドバイス' },
    { title: '週末のおうちデート回復プランジェネレーター', desc: '今の気分に基づいて完璧なおうちコンボを推奨：映画＋おやつ＋雰囲気コーディネート' },
    { title: '就寝前の心の癒しラジオ', desc: '優しい物語、瞑想ガイドを生成し、眠りをサポートするプライベートラジオ' },
    { title: '暮らしの美学インスピレーションキャッチャー', desc: '日常の小さなことから美を発見し、暮らしの美学提案と儀式感ガイドを生成' }
  ],
  'emotion': [
    { title: '深夜のツリーくり聞き手', desc: '24 時間オンラインの感情のゴミ箱、判断せずにすべての悩みを受け止める' },
    { title: '失恋回復コンパニオン', desc: '失恋のどん底期に優しい寄り添い、回復アドバイスと感情の出口を提供' },
    { title: '不安緩和呼吸コーチ', desc: '不安感情を感知し、呼吸練習とマインドフルネス瞑想をガイド' },
    { title: '自信再構築メンター', desc: 'ポジティブな対話と心理的暗示を通じて、自己肯定感と価値観の再構築をサポート' },
    { title: '感情日記スマート分析', desc: '感情日記を分析し、感情パターンを発見、温かいインサイトとアドバイスを提供' }
  ],
  'entertainment': [
    { title: '没入型マーダーミステリー DM', desc: 'マーダーミステリーのゲームマスターを演じ、サスペンスの雰囲気を作り出し、ストーリーを進行' },
    { title: 'オープンワールドゲームの魂の NPC', desc: '血の通った NPC がプレイヤーのストーリーを記憶し、リアルな感情的絆を生み出す' },
    { title: 'パーソナライズドポッドキャスト生成', desc: '興味に基づいて専用ポッドキャストを生成、友達とのおしゃべりのように自然' },
    { title: 'バーチャルコンサートの盛り上げ役', desc: 'オンラインコンサートにライブ感を演出、リアルタイムインタラクション、応援、雰囲気レンダリング' },
    { title: 'インタラクティブ小説共創パートナー', desc: '読者と一緒にストーリーを共創、すべての選択が世界の行方に影響' }
  ],
  'growth': [
    { title: '個人の成長の証人', desc: '成長の軌跡を記録し、重要な節目で励ましと振り返りを提供' },
    { title: '習慣形成ゲーム化コーチ', desc: '退屈な習慣形成を面白い冒険ゲームに変える' },
    { title: 'スキル学習パートナーマッチング', desc: '志を同じくする学習仲間を見つけ、お互いに励まし合い、進歩を共有' },
    { title: '毎日の小さな幸せ発見者', desc: '生活の中の小さな美しい瞬間を見つける手助け、感謝とポジティブなマインドを育む' },
    { title: '人生シミュレーション体験器', desc: '異なる人生の選択肢をシミュレートし、パラレルワールドのもう一つの可能性を体験' }
  ],
  'social': [
    { title: 'アイスブレイクトピックジェネレーター', desc: 'ソーシャルシーンで面白いトピックを提供し、気まずさを解消、距離を縮める' },
    { title: 'SNS投稿文雰囲気クリエイター', desc: '写真と気分に基づいて、おしゃれな SNS 投稿文を生成' },
    { title: 'デート雰囲気プランナー', desc: 'デートに完全な雰囲気プランを設計、場所からトピック、サプライズまで' },
    { title: 'オンライン飲み会の盛り上げ役', desc: 'オンラインパーティーで盛り上げ、ゲームの企画、インタラクションをガイド' },
    { title: 'ソーシャルエネルギー管理アシスタント', desc: '内向的な方のソーシャルエネルギー管理をサポート、快適なソーシャルペースを見つける' }
  ],
  'creative': [
    { title: 'インスピレーション枯渇応急キット', desc: 'クリエイティブの行き詰まり時に予想外のインスピレーションスパークを提供' },
    { title: '個人スタイル探索ガイド', desc: 'ユニークな個人スタイルの発見をサポート、ファッションから表現まで' },
    { title: '手帳＆日記美学アドバイザー', desc: '手帳のレイアウト、配色、コンテンツアイデアの美学アドバイスを提供' },
    { title: '写真構図雰囲気ガイド', desc: 'シーンと表現したい感覚に基づいて、写真とレタッチのアドバイスを提供' },
    { title: '音楽気分マッチング', desc: '今の気分とシーンに基づいて、完璧な音楽コンボを推奨' }
  ],
  'travel': [
    { title: '街歩き探索ガイド', desc: '地元の人のように街を探索し、隠れた宝スポットを発見' },
    { title: '旅行気分日記生成', desc: '旅行の写真と気分を美しい旅行記と思い出に変換' },
    { title: '一人旅コンパニオンアシスタント', desc: '一人旅の方に寄り添い、アドバイスと安心感を提供' },
    { title: '目的地雰囲気プレビュー', desc: '出発前に目的地の雰囲気を没入的に体験、事前に入り込める' },
    { title: '旅行写真雰囲気ガイド', desc: 'シーンと光に基づいて、ストーリー性のある旅行写真の撮り方をガイド' }
  ],
  'health': [
    { title: '運動モチベーション覚醒師', desc: '動きたくない時にちょうどいい励ましとモチベーションを与える' },
    { title: 'ヘルシー食インスピレーションキッチン', desc: '気分と食材に基づいて、癒されるヘルシーレシピを生成' },
    { title: '睡眠の質向上雰囲気クリエイター', desc: '環境から心理まで、全方位に質の高い睡眠雰囲気を作り出す' },
    { title: 'ボディセンシングガイド', desc: '体のシグナルに注意を向け、心身のつながりを構築' },
    { title: 'セルフケアリマインダー', desc: '忙しい中で立ち止まり、自分を大切にするようリマインド' }
  ],
  'learning': [
    { title: '知識探索ゲーム化ガイド', desc: '退屈な知識学習を面白い探検アドベンチャーに変える' },
    { title: '語学学習シーンパートナー', desc: '異なる役を演じ、シチュエーション会話の中で自然に言語を習得' },
    { title: '好奇心満足アシスタント', desc: 'あらゆる奇想天外な疑問に答え、世界への好奇心を満たす' },
    { title: '読書ノートインスピレーション', desc: '読書感想の整理をサポート、新しい思考の角度を発見' },
    { title: '知識共有雰囲気クリエイター', desc: '学んだ知識を面白い共有コンテンツに変換' }
  ],
  'relationship': [
    { title: '親密な関係コミュニケーションコーチ', desc: '言いにくい感情の表現をサポートし、親密な関係を改善' },
    { title: '家族ケアリマインダー', desc: '家族を気遣うことをリマインド、温かいインタラクションのアイデアを提供' },
    { title: '友情維持雰囲気クリエイター', desc: '遠距離の友情の維持をサポート、共通の話題を創造' },
    { title: '告白＆サプライズプランナー', desc: '大切な人に忘れられないサプライズとロマンチックな瞬間を企画' },
    { title: '対立緩和雰囲気ガイド', desc: '関係が緊張した時に雰囲気を和らげるアドバイスと話術を提供' }
  ],
  'pet': [
    { title: 'ペット擬人化日記', desc: 'ペットの視点で日記を生成、飼い主との温かい日常を記録' },
    { title: 'ペット行動分析師', desc: 'ペットの行動言語を読み解き、ペットとの絆を深める' },
    { title: 'ペットとの時間企画', desc: 'ペットとインタラクションするクリエイティブな活動をデザイン、絆を深める' },
    { title: 'ペット記念ストーリー生成', desc: 'ペットの写真と思い出を温かいストーリーに変換' },
    { title: '初心者ペット飼い主安心ガイド', desc: '初心者のペットオーナーに温かい寄り添いと指導を提供' }
  ],
  'finance': [
    { title: '消費感情覺察アシスタント', desc: '衝動買いの背後にある感情に気づき、健全な消費観を確立' },
    { title: '貯蓄目標ビジュアルモチベーション', desc: '貯蓄目標をビジュアル化された夢の進捗に変換' },
    { title: '資産管理知識カジュアル学習', desc: '気軽で面白い方法で資産管理の知識を学ぶ' },
    { title: '財務不安緩和師', desc: '財務ストレスに直面した時に感情サポートと実用的アドバイスを提供' },
    { title: '少額投資体験ゲーム', desc: 'ゲーム化された方法で投資を体験し、参入のハードルを下げる' }
  ],
  'career': [
    { title: 'キャリア迷いコンパニオン', desc: 'キャリアの迷い期に傾聴、探索、方向性のアドバイスを提供' },
    { title: '仕事の達成感覚醒師', desc: '仕事の中の価値と意義を見つけ、情熱を再燃させる' },
    { title: '職場ソーシャル雰囲気アシスタント', desc: '職場ソーシャルの気軽なトピックとインタラクションアイデアを提供' },
    { title: '副業インスピレーション発掘器', desc: '個人の興味とスキルに基づいて、副業のアイデアを刺激' },
    { title: '面接前の自信加油站', desc: '面接前に心理的な準備と自信の励ましを提供' }
  ],
  'home': [
    { title: '居家空間雰囲気デザイナー', desc: '気分と季節に基づいて居家の雰囲気プランを設計' },
    { title: '四季インテリアチェンジガイド', desc: '季節に合わせてインテリアを変え、新鮮さを保つ' },
    { title: '小スペース空間マジック', desc: '小さなスペースでも快適で温かい雰囲気を作り出す' },
    { title: '居家儀式感クリエイター', desc: '日常の居家活動に儀式感を創造' },
    { title: '断捨離心理コンパニオン', desc: '片付け時に心理的サポートと意思決定アドバイスを提供' }
  ],
  'food': [
    { title: '一人飯癒しレシピ', desc: '一人暮らしの方にシンプルで癒される料理プランを設計' },
    { title: 'イベント食卓雰囲気デザイン', desc: '特別な日に儀式感のある食卓コーディネートを設計' },
    { title: '料理気分マッチング', desc: '今の気分に基づいて適した食べ物と作り方を推奨' },
    { title: '料理初心者自信ビルダー', desc: 'ゼロベースの料理初心者に温かい励ましとシンプルなレシピを提供' },
    { title: 'フードフォトグラフィー雰囲気ガイド', desc: '家庭料理でも魅力的な雰囲気写真に撮る方法をガイド' }
  ],
  'fashion': [
    { title: '今日のコーデ気分ボード', desc: '天気、シーン、気分に基づいてコーデインスピレーションを生成' },
    { title: 'カプセルワードローブコーディネーター', desc: '限られたアイテムで無限のコーデの可能性を創造' },
    { title: '個人スタイル探索の旅', desc: 'ユニークな個人スタイルの発見と確立をサポート' },
    { title: '古着の新しい着こなしクリエイター', desc: '古い服に新しいコーデインスピレーションを提供' },
    { title: '特別シーンスタイリングアドバイザー', desc: '重要なシーンに自信を持てるスタイリングをデザイン' }
  ]
}

// 事前定義の推薦ルートマッピングテーブル - 雰囲気と感覚に基づく
const cRecommendationMap = {
  // 雰囲気: 癒し系
  'healing': {
    'relax': ['emotion', 'lifestyle', 'health', 'home'],
    'inspire': ['creative', 'growth', 'learning', 'entertainment'],
    'connect': ['relationship', 'social', 'pet', 'emotion'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // 雰囲気: 成長系
  'growth': {
    'relax': ['growth', 'learning', 'creative', 'health'],
    'inspire': ['career', 'learning', 'creative', 'growth'],
    'connect': ['social', 'relationship', 'career', 'learning'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // 雰囲気: ソーシャル系
  'social': {
    'relax': ['social', 'pet', 'food', 'home'],
    'inspire': ['social', 'creative', 'entertainment', 'travel'],
    'connect': ['relationship', 'social', 'pet', 'travel'],
    'escape': ['social', 'travel', 'entertainment', 'creative']
  },
  // 雰囲気: 探索系
  'explore': {
    'relax': ['travel', 'creative', 'lifestyle', 'food'],
    'inspire': ['travel', 'creative', 'learning', 'entertainment'],
    'connect': ['travel', 'social', 'relationship', 'pet'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // 雰囲気: 日常系
  'daily': {
    'relax': ['lifestyle', 'home', 'health', 'emotion'],
    'inspire': ['creative', 'food', 'fashion', 'home'],
    'connect': ['relationship', 'social', 'pet', 'lifestyle'],
    'escape': ['entertainment', 'creative', 'travel', 'lifestyle']
  }
}

const vibeOptions = [
  { label: '癒し系', value: 'healing', desc: '温かい、安らぎ、癒し' },
  { label: '成長系', value: 'growth', desc: '進歩、ブレイクスルー、変容' },
  { label: 'ソーシャル系', value: 'social', desc: 'つながり、シェア、インタラクション' },
  { label: '探索系', value: 'explore', desc: '好奇心、冒険、発見' },
  { label: '日常系', value: 'daily', desc: '日常、リアル、今この瞬間' }
]

const feelingOptions = [
  { label: 'リラックスしたい', value: 'relax', desc: 'ストレス解消、頭を空っぽに' },
  { label: 'インスピレーションを得たい', value: 'inspire', desc: 'クリエイティブの刺激、気づき' },
  { label: 'つながりが欲しい', value: 'connect', desc: '人とのつながり、感情の共鳴' },
  { label: '現実から逃れたい', value: 'escape', desc: '現実逃避、没入体験' }
]

const scenarios = [
  { key: 'lifestyle', name: 'ライフスタイル', anchor: '#_1-ライフスタイル' },
  { key: 'emotion', name: '感情コンパニオン', anchor: '#_2-感情コンパニオン' },
  { key: 'entertainment', name: 'エンターテインメント', anchor: '#_3-エンターテインメント' },
  { key: 'growth', name: '自己成長', anchor: '#_4-自己成長' },
  { key: 'social', name: 'ソーシャルインタラクション', anchor: '#_5-ソーシャルインタラクション' },
  { key: 'creative', name: 'クリエイティブ表現', anchor: '#_6-クリエイティブ表現' },
  { key: 'travel', name: '旅行探索', anchor: '#_7-旅行探索' },
  { key: 'health', name: '心身の健康', anchor: '#_8-心身の健康' },
  { key: 'learning', name: '知識探索', anchor: '#_9-知識探索' },
  { key: 'relationship', name: '関係マネジメント', anchor: '#_10-関係マネジメント' },
  { key: 'pet', name: 'ペットコンパニオン', anchor: '#_11-ペットコンパニオン' },
  { key: 'finance', name: '財務の健康', anchor: '#_12-財務の健康' },
  { key: 'career', name: 'キャリア開発', anchor: '#_13-キャリア開発' },
  { key: 'home', name: '居家空間', anchor: '#_14-居家空間' },
  { key: 'food', name: 'グルメ料理', anchor: '#_15-グルメ料理' },
  { key: 'fashion', name: 'ファッションスタイル', anchor: '#_16-ファッションスタイル' }
]

// 推薦結果の計算 - トピックプールからランダムに抽出
const cRecommendationTopics = computed(() => {
  if (!vibePoint.value || !feeling.value) return []
  
  const keys = cRecommendationMap[vibePoint.value]?.[feeling.value] || []
  const topics = []
  
  // 各推薦シーンから 1〜2 トピックをランダムに抽出
  keys.forEach(key => {
    const scenario = scenarios.find(item => item.key === key)
    const scenarioTopics = cTopicPool[key] || []
    
    if (scenario && scenarioTopics.length > 0) {
      const count = Math.floor(Math.random() * 2) + 1
      const shuffled = [...scenarioTopics].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, Math.min(count, shuffled.length))
      
      selected.forEach(topic => {
        topics.push({
          ...topic,
          scenarioKey: key,
          scenarioName: scenario.name,
          scenarioAnchor: scenario.anchor
        })
      })
    }
  })
  
  // ランダムソートして総数を制限
  return topics.sort(() => Math.random() - 0.5).slice(0, 8)
})

// 現在の選択の説明を取得
const cCurrentSelection = computed(() => {
  const vibe = vibeOptions.find(i => i.value === vibePoint.value)
  const feel = feelingOptions.find(p => p.value === feeling.value)
  return {
    vibe: vibe?.label || '',
    feeling: feel?.label || ''
  }
})

const cScrollToAnchor = (anchor) => {
  setTimeout(() => {
    let element = document.querySelector(anchor)
    
    if (!element) {
      const altAnchor = anchor.replace('#_', '#')
      element = document.querySelector(altAnchor)
    }
    
    if (!element) {
      const anchorText = decodeURIComponent(anchor.replace('#', '').replace(/^_/, ''))
      const headings = document.querySelectorAll('h2, h3')
      
      for (let heading of headings) {
        const headingText = heading.textContent.trim()
        const cleanHeading = headingText.replace(/^\d+\.\s*/, '')
        if (cleanHeading === anchorText || headingText.includes(anchorText)) {
          element = heading
          break
        }
      }
    }
    
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
      element.style.backgroundColor = '#fdf2f8'
      element.style.transition = 'background-color 0.3s'
      element.style.padding = '8px'
      element.style.borderRadius = '4px'
      setTimeout(() => {
        element.style.backgroundColor = ''
        element.style.padding = ''
      }, 2000)
    }
  }, 100)
}

const cResetSelection = () => {
  vibePoint.value = ''
  feeling.value = ''
}
</script>

# AIアプリケーションシーン参考（Bエンド・Cエンド）

<Tabs>
<TabItem label="Bエンド産業">

## 章節のガイド

<ChapterIntroduction :duration="duration" :tags="['Bエンドアプリ', '産業アプリケーション', 'AIシーン', '実装参考', '業界ソリューション']" coreOutput="15以上のBエンド業界アプリケーションシーンを理解" expectedOutput="企業顧客に適したプロジェクト方向を見つける">

本ドキュメントは <strong>LLM大規模言語モデルのBエンド企業シーンにおける実装アプリケーション</strong>をまとめたものです。Cエンドがユーザー体験と感情に注目するのとは異なり、Bエンドプロダクトは<strong>実際のビジネスニーズの解決、効率向上、コスト削減</strong>を重視します。各シーンは<strong>実際の実装の可能性</strong>を持ち、<strong>ニーズ分析から技術実装</strong>までの完全なアプローチをカバーしています。

</ChapterIntroduction>

## 業界方向クイック選択

<el-card shadow="hover" style="margin-top: 16px; margin-bottom: 24px; border-left: 5px solid #409EFF;">
  <div style="font-weight: 600; margin-bottom: 8px;">あなたに合ったアプリケーションシーンを見つける</div>
  <div style="color: #606266; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
    興味の方向と実現したい目的を選択すると、システムが関連する業界シーンを推薦します。タグをクリックすると対応する章にジャンプします。
  </div>
  <el-row :gutter="16">
    <el-col :span="12">
      <el-select v-model="interestPoint" placeholder="興味方向を選択" style="width: 100%;">
        <el-option 
          v-for="item in interestOptions" 
          :key="item.value" 
          :label="item.label" 
          :value="item.value">
          <div style="display: flex; flex-direction: column;">
            <span>{{ item.label }}</span>
            <span style="font-size: 12px; color: #909399;">{{ item.desc }}</span>
          </div>
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="12">
      <el-select v-model="purpose" placeholder="実現目的を選択" style="width: 100%;">
        <el-option 
          v-for="item in purposeOptions" 
          :key="item.value" 
          :label="item.label" 
          :value="item.value">
          <div style="display: flex; flex-direction: column;">
            <span>{{ item.label }}</span>
            <span style="font-size: 12px; color: #909399;">{{ item.desc }}</span>
          </div>
        </el-option>
      </el-select>
    </el-col>
  </el-row>
  
  <div v-if="recommendationTopics.length > 0" style="margin-top: 16px;">
    <div style="font-weight: 600; margin-bottom: 10px; color: #409EFF;">
      おすすめ {{ recommendationTopics.length }} 個のアプリケーションシーン
      <span style="font-weight: normal; color: #909399; font-size: 13px; margin-left: 8px;">
        ({{ currentSelection.interest }} + {{ currentSelection.purpose }})
      </span>
    </div>
    <el-table 
      :data="recommendationTopics" 
      style="width: 100%; cursor: pointer;"
      @row-click="(row) => scrollToAnchor(row.industryAnchor)"
      highlight-current-row>
      <el-table-column prop="title" label="アプリケーションシーン" min-width="300">
        <template #default="scope">
          <div style="font-weight: 500; color: #303133;">{{ scope.row.title }}</div>
          <div style="font-size: 12px; color: #909399; margin-top: 4px;">{{ scope.row.desc }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="industryName" label="所属業界" width="180" align="center">
        <template #default="scope">
          <el-tag type="info" effect="light" size="small">{{ scope.row.industryName }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px; font-size: 12px; color: #909399;">
      テーブルの任意の行をクリックすると対応する業界の章にジャンプします
    </div>
  </div>
  
  <div v-else-if="!interestPoint || !purpose" style="margin-top: 14px; color: #909399; font-size: 13px;">
    <span v-if="!interestPoint && !purpose">興味方向と実現目的を選択してください</span>
    <span v-else-if="!interestPoint">興味方向を選択してください</span>
    <span v-else>実現目的を選択してください</span>
  </div>
  
  <div v-if="interestPoint || purpose" style="margin-top: 12px;">
    <el-button size="small" @click="resetSelection">再選択</el-button>
  </div>
</el-card>

## 業界クイック紹介

### 主要技術選択

AIアプリ開発では、一般的な技術方向として以下があります：

1. **LLM（大規模言語モデル）**：自然言語タスクの処理に得意。対話、テキスト生成、要約、翻訳などに適用。
2. **VLM（視覚言語モデル）**：視覚理解と言語能力を組み合わせ、画像記述、視覚QA、マルチモーダルコンテンツ生成を実現。
3. **GenAI（生成式AI）**：テキスト生成、画像生成、動画生成などを含む。

### 選択戦略

1. **興味志向**：自分が興味のある業界や技術方向を優先選択。
2. **業界適合**：自身の業界背景やリソースの優位性に合わせてシーンを選択。
3. **技術難易度**：自身の技術基盤に合わせて適切な複雑さを選択。

## 1. 工業製造業

工業製造業シーンは主に設計補助、生産最適化、スマートメンテナンスの3つの方向に展開します。

| 番号 | アプリケーションシーン名 | 実装参考 |
| :--: | --- | --- |
| 1 | 新エネルギーバス外観AI補助設計プラットフォーム | 画像生成モデルによる外観コンセプト設計、LLMによる設計規範チェック |
| 2 | スマート図面設計・審査アシスタント | RAG技術による企業設計規範ナレッジベース構築 |
| 3 | 技術文書自動生成・管理 | LLMによる製品仕様書と操作マニュアルの自動生成 |
| 4 | 生産設備巡回点検レポート自動生成アシスタント | 音声による設備状態記述、構造化巡回点検レポートの自動生成 |
| 5 | 工場フォークリフトスマート配車・経路計画システム | LLMによる注文タスクと倉庫位置の解析、地図APIによる最適配車方案 |
| 6 | LLM情報検索ベースのデータウェアハウス | Text-to-SQL技術による自然言語からデータベースクエリへの変換 |
| 7 | 工業設備故障診断ナレッジQAアシスタント | 過去の故障ケースに基づくベクトルナレッジベース構築 |
| 8 | 生産品質検査レポートスマート生成・欠陥分類 | OCRによる検査写真の欠陥認識、LLMによる構造化品質検査レポートの生成 |
| 9 | 在庫棚卸スマートアシスタント・棚卸レポート生成 | 棚卸データ入力、LLMによるシステム在庫との自動照合・差異レポート生成 |
| 10 | 工芸プロセス最適化提案スマートQAシステム | 生産工芸ドキュメントに基づくRAGナレッジベースの構築 |

## 2. スマートカスタマーサポート

| 番号 | アプリケーションシーン名 | 実装参考 |
| :--: | --- | --- |
| 1 | マルチチャネルスマートカスタマーサポート自動応答・チケット生成システム | マルチチャネルメッセージ受信、LLMによる意図理解後の応答生成とチケット自動作成 |
| 2 | 見込み客発掘・フォローアップ提案アシスタント | LLMによる過去のカスタマーサポート対話記録の分析、高意向顧客の識別 |
| 3 | 企業内部ナレッジスマート検索・QAマネージャー | Confluenceと内部文書に基づくベクトルナレッジベース構築 |
| 4 | カスタマー満足度調査・サービス改善管理システム | LLMによるカスタマーサポート対話の自動感情分類と満足度スコアリング |
| 5 | カスタマーサポート対話スマートサマリー・チケット生成ツール | 会話終了後の自動サマリー生成とキー情報抽出 |
| 6 | カスタマーサポートトークコンプライアンス自動検出アシスタント | カスタマーサポートの返信内容のリアルタイムコンプライアンス性検出 |
| 7 | カスタマーサポートチケット自動要約・分類生成ツール | 長い対話記録の要約生成と自動分類タグ付け |
| 8 | カスタマー感情監視・異常早期警告ツール | リアルタイムでの音声トーン特徴とテキスト感情の分析 |
| 9 | カスタマーサポート金牌トーク推薦ナレッジシステム | 優秀なカスタマーサポート対話事例の分析、金牌トークテンプレートの抽出 |
| 10 | スマート外線通話対話内容分析・品質検査アシスタント | 外線通話録音の書き起こし、LLMによる対話内容の分析 |

## 3. 教育業界

| 番号 | アプリケーションシーン名 | 実装参考 |
| :--: | --- | --- |
| 1 | パーソナライズ言語学習パス計画・スマート導学システム | LLMによる学習者レベル評価、毎日の学習タスクの計画 |
| 2 | 授業案自動作成・教育リソース配信プラットフォーム | LLMによるカリキュラムに基づく授業案フレームワークの生成 |
| 3 | 宿題自動採点・学習状況診断分析システム | LLMによる記述式問題の自動採点と学習弱点の特定 |
| 4 | 人材ポジションコンピテンシーモデル構築・学習マップ | LLMによる求人JDの分析、ポジション能力プロファイリングの構築 |
| 5 | 校本カリキュラム体系構築・スライド制作ツール | LLMによる学校特色と学生ニーズの分析、校本カリキュラムフレームワークの生成 |
| 6 | 外国語スピーキング1対1シチュエーション実践演習 | LLMが異なる役割を演じるスピーキング会話、ASRによる発音の認識と採点 |
| 7 | 大学受験大数据推薦・キャリアプランニング指導プラットフォーム | LLMによる受験生のスコア・順位・興味情報の分析 |
| 8 | 児童プログラミングコードアシスタント | LLMによるコードロジックの解説とプログラミング指導 |
| 9 | 知識ポイントマインドマップ自動生成・学習パス推薦ツール | コーストピック入力によるLLMの知識ポイントマインドマップの自動生成 |
| 10 | 中英作文自動採点・添削エンジン | LLMによる立意、構造、言語、多様性などの多次元採点 |

## 4. スマートプログラミング

| 番号 | アプリケーションシーン名 | 実装参考 |
| :--: | --- | --- |
| 1 | スマートコード補完・Bug自動修正アシスタント | CodeLlama微調整コードモデル、IDEプラグインによるリアルタイムコード補完提案 |
| 2 | ローコードアプリ構築・プロセス自動化プラットフォーム | 自然言語による要件記述のLLMによるローコード設定への変換 |
| 3 | ユニットテストケース生成システム | AST解析による関数ロジックの抽出、LLMによる境界条件テストケースの生成 |
| 4 | コードスマート分析・言語移行ツール | Tree-sitterによるコード構造の解析、LLMによるコード品質分析と最適化提案 |
| 5 | 自然言語からSQL文への自動生成ツール | LLMによる自然言語クエリのSQLへの変換 |
| 6 | APIインターフェース自動テスト・ドキュメント生成プラットフォーム | LLMによるコードコメントとインターフェース定義の分析 |
| 7 | UIテストスクリプトスマート録画・保守ツール | ブラウザプラグインによるユーザー操作軌跡の録画 |
| 8 | システムログ分析・故障特定 | ELK Stackによるログデータの収集、LLMによる異常ログの分析 |
| 9 | フロントエンドUIコード自動生成ツール | デザイン画像OCR認識によるレスポンシブCSSとコンポーネントコードの生成 |
| 10 | データベース構造スマート設計・モデリングアシスタント | 業務要件ドキュメント入力によるER図とデータテーブル構造の自動生成 |

## 5. 医療方向

| 番号 | アプリケーションシーン名 | 実装参考 |
| :--: | --- | --- |
| 1 | 医学検査レポートスマート解読アシスタント | 検査レポート画像のアップロード、OCRによる主要指標の認識、LLMによる異常値の解読 |
| 2 | ナレッジ検索技術ベースの健康相談エキスパート | 医学ナレッジグラフ（ICD-10、薬品説明書、診療ガイドライン）の構築 |
| 3 | 臨床研究データ意思決定分析プラットフォーム | EMRデータと検査結果の統合、LLMによる統計分析コードの補助生成 |
| 4 | 医学試験問題スマート生成・間違い解析システム | 教材の章と知識ポイントの入力による練習問題と解説の生成 |
| 5 | 薬物研究全プロセスナレッジグラフスマートQAエキスパート | 薬物-ターゲット-疾患ナレッジグラフの構築 |
| 6 | 薬品説明書スマートQAアシスタント | 薬品説明書画像のアップロードまたは薬名入力による用法用量等のQA |
| 7 | 疾病知識科普記事生成アシスタント | 疾病名と受診者の入力による分かりやすい科普記事の生成 |
| 8 | 医学画像レポート自動生成ツール | 放射線科医師の画像特徴記述による構造化レポートの自動生成 |
| 9 | 手術記録スマート生成・アーカイブアシスタント | 手術中の音声入力による構造化手術記録の生成 |
| 10 | 慢性疾患管理服薬リマインダースマートアシスタント | 患者の服薬リスト入力によるパーソナライズ服薬リマインダの生成 |

## 6. ネットワークセキュリティ

| 番号 | アプリケーションシーン名 | 実装参考 |
| :--: | --- | --- |
| 1 | コードセキュリティ脆弱性検出・修正エンジン | SASTツールによるコードスキャン、LLMによる脆弱性原理の分析 |
| 2 | AI生成フィッシングメールスマート識別・ブロックシステム | LLMによるメール内容・送信者特徴・リンク安全性の分析 |
| 3 | セキュリティ運用日報自動生成アシスタント | セキュリティデバイスログの集約、キーイベントの自動抽出 |
| 4 | セキュリティナレッジベーススマートQAアシスタント | セキュリティドキュメント、CVEライブラリに基づくベクトルナレッジベースの構築 |
| 5 | ペネトレーションテストレポートスマート生成アシスタント | ペネトレーションテスト完了後の脆弱性記述に基づくレポートの自動生成 |
| 6 | 悪意コード防护・プライバシーコンプライアンス監視 | サンドボックスによる不審査ファイルの動作分析、LLMによる悪意特徴の識別 |
| 7 | セキュリティ設定コンプライアンスチェックリスト生成ツール | 対象システムタイプの入力によるセキュリティ設定チェックリストの生成 |
| 8 | 脅威インテリジェンススマート検索・分析アシスタント | マルチソース脅威インテリジェンスの照会、LLMによるインテリジェンスの解読 |
| 9 | セキュリティインシデント振り返りレポート生成アシスタント | セキュリティインシデント発生後のタイムラインに基づく振り返りレポートの自動生成 |
| 10 | グローバル脅威インテリジェンス監視・早期警戒センター | グローバルセキュリティニュースと脆弱性開示のクローリング |

## 7. 金融管理・保険銀行業

| 番号 | アプリケーションシーン名 | 実装参考 |
| :--: | --- | --- |
| 1 | 与信審査レポートスマート生成アシスタント | 企業基本情報と財務データの入力による与信審査レポートの自動生成 |
| 2 | プライベートバンクウェルスマートコンサルタント | 顧客リスク許容度と財務目標の分析による資産配分提案の生成 |
| 3 | IPO目論見書スマート生成・コンプライアンス検証アシスタント | 目論見書のモジュール化テンプレート、LLMによる事業記述の自動入力 |
| 4 | 企業財務レポート自動生成・経営異常早期警戒システム | 財務システムデータの自動収集、LLMによる財務分析の生成 |
| 5 | 財務票券情報抽出・QAアシスタント | 請求書画像のアップロード、OCR認識、LLMによる関連QA |
| 6 | コンプライアンスケーススマート検索・QAアシスタント | 規制処罰ケースに基づくナレッジベースの構築 |
| 7 | 保険代理店スマートトーク練習 | LLMが異なるタイプの顧客を演じるシミュレーション対話 |
| 8 | 保険商品条項分析・競合比較プラットフォーム | 条項の構造化解析、LLMによるハイライトサマリーと注意事項の生成 |
| 9 | 顧客トーク感情識別サービス | 音声感情認識とトークコンプライアンス検出のリアルタイムフィードバック |
| 10 | 保険理赔進捗スマート照会・対話アシスタント | ユーザーの保険証番号または案件番号の入力による理赔進捗の照会 |

## 8. 企業サービス

| 番号 | アプリケーションシーン名 | 実装参考 |
| :--: | --- | --- |
| 1 | 顧客維持分析・解約早期警戒プラットフォーム | 行動データのトラッキング収集、MLモデルによる解約確率の予測 |
| 2 | B2B見込み客アプローチ・マーケティングメールプラットフォーム | 企業工商データによるターゲット顧客のフィルタリング、LLMによるパーソナライズマーケティングコンテンツの生成 |
| 3 | 営業パイプライン監視・業績予測プラットフォーム | CRMデータの自動収集、LLMによる営業ファネルの分析と業績達成の予測 |
| 4 | ブランドレピュテーション監視・危機早期警戒レーダー | 全网レピュテーションデータの収集（ソーシャルメディア、ニュース、フォーラム）、LLMによる感情と伝播トレンドの分析 |
| 5 | 職場メールスマート執筆・コミュニケーション感情管理アシスタント | メールコンテキストの理解、LLMによるプロフェッショナルメール草案の生成 |
| 6 | 履歴書スマート解析・ポジションマッチングシステム | 履歴書PDFの解析によるキー情報の抽出、LLMによる適合ポジションのマッチング |
| 7 | 企業従業員入社ガイド・QAアシスタント | 入社ドキュメントナレッジベースのRAG検索、新入社員のよくある質問への回答 |
| 8 | 従業員パフォーマンスフィードバック・OKR目標管理プラットフォーム | OKRシステムデータの収集、LLMによる目標達成状況の分析 |
| 9 | スマート会議記録・ToDo管理 | 会議録音の書き起こし、LLMによる主要議論点とToDo項目の抽出 |
| 10 | 請求書識別・経費精算自動処理 | OCRによる請求書情報の認識、請求書の真贋検証と精算コンプライアンスの自動確認 |

## 9. コンテンツ制作・運営

| 番号 | アプリケーションシーン名 | 実装参考 |
| :--: | --- | --- |
| 1 | 映像・小説コンテンツ制作補助プラットフォーム | LLMによるストーリー概要、キャラクター設定、セリフ生成 |
| 2 | 企業ブランドストーリー・PR記事スマート執筆アシスタント | ブランドキーワードと製品情報の入力による複数スタイルコピーの生成 |
| 3 | バーチャルデジタルヒューマンライブ配信・配信管理システム | デジタルヒューマン像モデリング + TTS音声 + LLM対話 |
| 4 | ショートビデオスクリプト生成・スマート編集 | LLMによるショートビデオスクリプトと絵コンテの生成 |
| 5 | 営業会話音声書き起こし・トーク推薦 | 通話ASR書き起こし、LLMによる会話分析と金牌トークの推薦 |
| 6 | マーケティングコンテンツスマート生成・デザインシステム | 製品情報入力によるマーケティングコピーとセールスポイントの抽出 |
| 7 | マルチプラットフォーム広告出稿ROIリアルタイム監視・戦略最適化システム | 広告プラットフォームAPI連携によるデータ収集、LLMによる出稿効果の分析 |
| 8 | 検索エンジンキーワード・トラフィック分析 | Baidu指数、5118データ収集、LLMによるキーワードトレンドと競合度の分析 |
| 9 | 競合広告出稿分析プラットフォーム | サードパーティデータプラットフォームAPIによる競合広告の収集 |
| 10 | 全网ホットトピックスマート分析・コンテンツ推薦システム | Weiboホット検索、抖音トレンドデータ収集、LLMによるトレンド分析 |

## 10. スマート行政

| 番号 | アプリケーションシーン名 | 実装参考 |
| :--: | --- | --- |
| 1 | 12345行政窓口スマート音声ナビ・自動振り分けシステム | 市民からの通話音声認識、LLMによる要望の理解と対応部門へのスマート振り分け |
| 2 | 行政サービスホールスマート案内・政策QAロボット | 行政ナレッジベースのRAG検索、LLMによる手続きと政策問題への回答 |
| 3 | 企業支援政策スマートマッチング・精密配信プラットフォーム | 政策の構造化解析、企業プロファイルによる適用政策の自動マッチング |
| 4 | 行政審査書類スマート事前審査・コンプライアンス検証アシスタント | 書類OCR認識とキー情報抽出、LLMによる完全性とコンプライアンスの検証 |
| 5 | 公共安全ビデオ監視異常行動検出システム | ビデオストリームのリアルタイム分析、CVモデルによる異常行動（喧嘩、転倒など）の検出 |
| 6 | 都市グリッドイベントスマート識別・配車管理プラットフォーム | 都市センシングデータ（IoT、カメラ）の収集、LLMによるイベントタイプの識別と配車 |
| 7 | 世論民意大数据分析・リスク早期警戒システム | 行政窓口、ネットレピュテーション、世論訪問等多ソースデータの融合分析 |
| 8 | 行政アーカイブデジタル化識別・スマート分類管理プラットフォーム | OCRによるアーカイブ文字内容の認識、LLMによるキー情報の抽出と自動分類 |
| 9 | 突発公共イベント緊急指揮・救援資源スマート配車プラットフォーム | イベント情報の収集、LLMによる緊急対応策の生成 |
| 10 | 大気環境汚染グリッド化監視・精密発生源特定システム | 空気質量センサーデーデータの収集、CVモデルによる汚染源の識別 |

## 11. 法律事務・契約管理

| 番号 | アプリケーションシーン名 | 実装参考 |
| :--: | --- | --- |
| 1 | 契約リスク脆弱性ワンクリック「間違い探し」Agent | 契約テキストの構造化解析、リスクチェックリストとの照合による潜在的問題の識別 |
| 2 | 企業契約ライフサイクルコンプライアンス審査・修正提案プラットフォーム | 契約条項と法規データベースの照合、コンプライアンス審査レポートの生成 |
| 3 | 類似案件勝訴率AIスマート評価コンサルタント | 案件特徴抽出、類似案件の検索マッチング |
| 4 | 法規変更リアルタイム監視・業務影響分析レーダー | 法規データベースのリアルタイム更新、変更内容の解析と業務影響の評価 |
| 5 | 弁護士レターAIGC自動起案ツール | 事実陳述入力による規範的な弁護士レターの生成 |
| 6 | 法廷録音リアルタイム書き起こし・争点焦点自動抽出記録儀 | 法廷録音ASR書き起こし、LLMによる争点焦点とキー論点の抽出 |
| 7 | 全网知的財産権侵害手がかり自動監視・ブロックチェーン証拠システム | ECプラットフォーム、ソーシャルメディアの侵害監視 |
| 8 | LLMベースのIPO目論見書キーデータ一貫性チェック・リスク早期警戒Agent | 目論見書複数章節のデータ照合、不一致とデータ異常の識別 |
| 9 | 複雑な法律条項「翻訳」を平易な言葉にする解説プラグイン | 選択した法律条文に対する分かりやすい解説の生成 |
| 10 | 案件証拠チェーンスマート整理・ビジュアル表示システム | 証拠資料のアップロード、LLMによる証拠関係とタイムラインの分析 |

## 12. 旅行・外出サービス

| 番号 | アプリケーションシーン名 | 実装参考 |
| :--: | --- | --- |
| 1 | AIGCベースのラク旅ガイドジェネレーター | ユーザー設定（日数、予算、興味）の入力、毎日の旅程スケジュールの生成 |
| 2 | 全网航空券・ホテル価格トレンド予測・低価格自動ロックボット | OTA価格データの収集、MLモデルによる価格トレンド予測 |
| 3 | 航班欠航後のクロス航空会社旅程再構成・緊急方案推薦コンサルタント | 航班ステータス監視、LLMによる代替旅程方案の分析 |
| 4 | ビザ書類スマート事前審査・自動フォーム記入補助システム | 書類写真のアップロード、OCR認識による情報完全性チェック |
| 5 | 海外旅行リアルタイム音声翻訳・メニュー視覚中国語化マネージャー | オフライン音声翻訳モデル、メニュー画像OCR認識と翻訳 |
| 6 | 大データ実評価に基づくホテル「避雷」ガイド分析儀 | ホテルレビューデータの収集、LLMによるポジネガティブ評価キーワードの抽出 |
| 7 | 目的地没入型VRプレビュー・バーチャル部屋選択インタラクティブプラットフォーム | 360度パノラマ写真の収集、VR技術による没入型プレビュー |
| 8 | 旅行足迹自動生成精美旅行記・SNS投稿アシスタント | 写真の時間・場所情報の抽出、LLMによる旅行記文案の生成 |
| 9 | 企業出張請求書自動集約・コンプライアンス精算管理プラットフォーム | 出張プラットフォームAPI連携、請求書情報の自動収集 |
| 10 | 景区混雑リアルタイム予測・時間差観光ルート計画ナビ | 景区混雑データの収集、MLモデルによる混雑時間帯の予測 |

## 13. エモーショナルコンパニオン

| 番号 | アプリケーションシーン名 | 実装参考 |
| :--: | --- | --- |
| 1 | LLMベースの24時間深層コンパニオン仮想パートナー | 記憶システムによる対話履歴の保存、LLMによるパーソナライズ返信の生成 |
| 2 | マルチモーダル感情認識・心理カウンセリングAIコンサルタント | 音声トーン分析 + テキスト感情認識、LLMによるカウンセリング提案の生成 |
| 3 | アルツハイマー老人AI認知訓練・記憶想起デジタルヒューマン | 認知ゲーム（記憶、計算、言語）訓練；古い写真/古い曲による記憶想起 |
| 4 | 社交不安のAIGCシミュレーション社交練習コーチ | バーチャル社交シーンのシミュレーション、LLMが異なる役割を演じる |
| 5 | 生成式AI児童就寝前物語カスタマイズ機 | 親のテーマと好みの入力によるカスタマイズ物語の生成 |
| 6 | 逝者デジタルライフ復元・LLM時空間対話システム | 生前の資料（音声、テキスト）によるパーソナライズモデルの訓練 |
| 7 | MBTIデータベースのAI性格ミラー・共感チャットボット | MBTIテスト結果入力、LLMによる性格分析と共感返信の生成 |
| 8 | 全天候気分監視・AIポジティブ感情モチベーションアシスタント | 日常の気分状態の記録、LLMによるトレンドの分析とモチベーションコンテンツの生成 |
| 9 | プライバシー保護級青少年AI悩みポスト | 匿名で悩みを吐き出す入口、LLMによる傾聴とアドバイス |
| 10 | 自律進化能力を持つAI仮想ペット育成システム | ペット性格モデルの訓練、対話インタラクションによる成長進化 |

## 14. レジャー・エンターテインメント

| 番号 | アプリケーションシーン名 | 実装参考 |
| :--: | --- | --- |
| 1 | LLM駆動のオープンワールドゲームNPC自律意思決定エンジン | NPC行動木とLLM意思決定の融合、対話システムによるパーソナライズインタラクション |
| 2 | 没入型マーダーミステリーAIGCストーリー推演・DMコントロール補助ツール | プレイヤーの選択によるストーリー分岐のトリガー、LLMによる推理ロジックの生成 |
| 3 | インタラクティブ小説エンディング生成式修飾器 | 読者の選択がストーリーの方向性に影響 |
| 4 | 二次元キャラクター3DモデリングAIGC自動生成ワークベンチ | テキスト記述によるキャラクターのスケッチ生成、3Dモデリングツールによる自動モデリング |
| 5 | eスポーツ戦局CVビジュアル分析・AIスマート実況アナウンサー | ゲーム画面のリアルタイム分析、キーモメントの識別 |
| 6 | パーソナライズユーモアコンテンツ推薦アルゴリズムエンジン | ユーザー興味プロファイリング、ユーモアコンテンツのマッチング推薦 |
| 7 | AIスマート音調・KTV人声美化ソフトウェア | オーディオノイズ除去と人声強調処理 |
| 8 | 映画ドラマキャラクター専用ストーリーAI抽出・編集ツール | ビデオコンテンツ分析、キャラクター関連シーンの抽出 |
| 9 | マルチキャラTTS音声合成オーディオブック自動生成システム | テキストのキャラクター割り当て、パーソナライズ音色の生成 |
| 10 | ボードゲーム強化学習対局リプレイコーチ | 棋局分析、AI対手によるシミレーション対局 |

## 15. ECサービス

| 番号 | アプリケーションシーン名 | 実装参考 |
| :--: | --- | --- |
| 1 | 高コンバージョンAIGC商品詳細ページ一括生産ツール | 商品情報入力によるセールスポイントコピーとシーン記述の生成 |
| 2 | アパレルバーチャルモデルAIスマート試着・展示動画生成ファクトリー | アパレル平置き画像処理、バーチャルモデル試着効果の生成 |
| 3 | 越境EC多言語LLMローカライズ翻訳・ブラッシュアップアシスタント | 商品説明の多言語翻訳、文化的適応ブラッシュアップ |
| 4 | NLPベースの顧客感情分析・スマート返信ロボット | コンサルティング対話の感情分析、自動返信の生成 |
| 5 | 24時間全天候AIGCデジタルヒューマンライブ配信システム | デジタルヒューマン像 + リアルタイムトーク生成 |
| 6 | 全网同種商品AI比価・トレンド予測プラグイン | ECプラットフォーム価格クローリング、比価チャート表示 |
| 7 | 買い者レビュー画像AIスマート選別・ショートビデオ合成プラットフォーム | 買い者レビュー画像の品質スコアリング |
| 8 | LLMベースのリアルタイム販売対話音声分析・金牌トーク推薦 | 通話ASR書き起こし、リアルタイムトークコンプライアンス検出 |
| 9 | 市場トレンドAIインサイト・爆売り予測エンジン | ソーシャルメディアとECデータの収集分析、LLMによるトレンドホットの洞察 |
| 10 | 私域トラフィックユーザープロファイルAIクラスタリング・精密運営システム | ユーザー行動データクラスタリング分析、プロファイルタグの生成 |

## 16. エネルギー

| 番号 | アプリケーションシーン名 | 実装参考 |
| :--: | --- | --- |
| 1 | 家庭電力使用行動AI分析・省エネ戦略コンサルタント | スマート電力メーターデータの収集、電力使用パターンの分析 |
| 2 | 太陽光パネル欠陥ドローンCVビジュアル識別システム | ドローン巡回撮影、熱赤外画像分析 |
| 3 | 電力スポット取引価格AIトレンド予測・自動利益戦略Agent | 電力市場データ収集、価格予測モデル |
| 4 | 蓄電池健康度AI非破壊検出・熱暴走リスク早期警戒システム | バッテリー運行データの監視、健康度評価モデル |
| 5 | 企業全チェーンカーボン排出AI自動算定・ESGレポート生成アシスタント | エネルギー消費データの収集、カーボン排出因子の計算 |
| 6 | 電網異常気象負荷AI予測・緊急配車指揮システム | 気象データ連携、負荷予測モデル |
| 7 | ガソリンスタンド違反行為AIビデオ識別・アラームガードマン | ビデオ監視分析、違反行為（電話、喫煙など）の検出 |
| 8 | 長距離石油ガスパイプライン漏洩音波AI監視・精密位置特定システム | 音波センサーデーデータの収集、漏洩検出モデル |
| 9 | バーチャル発電所リソース統合・AI電力取引意思決定システム | 分散型リソースの接続、統合最適化配車 |
| 10 | 鉱山人员位置AI追跡・危険エリア侵入アラーム | UWB/Bluetooth位置測定、人员軌跡の追跡 |

## 17. 音声・動画

| 番号 | アプリケーションシーン名 | 実装参考 |
| :--: | --- | --- |
| 1 | 長編動画ハイライトAI識別・ショートビデオ自動編集ツール | ビデオコンテンツ分析、キーフレーム識別 |
| 2 | ビデオ背景ノイズAIスマート分離・音声強調アシスタント | オーディオ分離モデル、背景ノイズ除去 |
| 3 | 古い映像4Kアップスケーリング修復・AIスマート着色ワークベンチ | ビデオ超解像度モデル、古い画質の修復 |
| 4 | テキストからリアルレベルTTS吹き替え・感情制御システム | マルチ音色TTSモデル、感情制御生成 |
| 5 | ビデオ音声ASR自動認識・バイリンガル字幕生成ツール | 音声認識による字幕生成、多言語翻訳 |
| 6 | ビデオ画面余分物体AIスマート消去エンジン | ビデオターゲット追跡、物体除去修復 |
| 7 | 著作権フリーバックグラウンドAIGC自動作曲機 | 音楽生成モデル、感情スタイル制御可能 |
| 8 | 特定人物音色AIクローン・変声変換ソフトウェア | 少量音声サンプルによる音色モデルの訓練 |
| 9 | 脚本ワンクリック絵コンテスクリプト・AI動的プレビデオ生成プラットフォーム | 脚本解析による絵コンテ生成、AIプレビデオの生成 |
| 10 | 会議録音AIスマート書き起こし・コアToDo抽出アシスタント | 複数人会議の音声分離書き起こし |

## 18. AIマーケティング

| 番号 | アプリケーションシーン名 | 実装参考 |
| :--: | --- | --- |
| 1 | RED爆売りコピーAIGC自動執筆エンジン | トピック入力、LLMによる種草コピーの生成 |
| 2 | マーケティングポスターAIスマートレイアウト・マルチサイズ適応ツール | コピー入力、ポスターテンプレートのスマートマッチング |
| 3 | ブランドLOGOクリエイティブAIGC生成・VI体系構築プラットフォーム | ブランドキーワード入力、LOGOクリエイティブ生成 |
| 4 | 全网ホットAI追跡・トレンドマーケティングクリエイティブ生成アシスタント | ホットデータ収集、LLMによるマーケティング角度の分析 |
| 5 | 広告出稿ROIリアルタイム監視・AI予算入札マネージャー | 広告プラットフォームデータ連携、効果分析モデル |
| 6 | 競合マーケティング戦略深層解析・AI週報生成器 | 競合コンテンツ収集分析、戦略の抽出 |
| 7 | 検索エンジンキーワードAI配置・集客記事一括執筆 | キーワード分析、記事の一括生成 |
| 8 | 千人千面パーソナライズマーケティングメールAI執筆エキスパート | ユーザープロファイルデータ、パーソナライズコンテンツ生成 |
| 9 | ブランド評判全网監視・レピュテーション危機AI早期警戒レーダー | 全网レピュテーションデータ収集、感情分析 |
| 10 | ショートビデオスクリプトクリエイティブAIGC生成・絵コンテガイダンスアシスタント | テーマ入力、スクリプトと絵コンテの生成 |

## 19. データインテリジェンス

| 番号 | アプリケーションシーン名 | 実装参考 |
| :--: | --- | --- |
| 1 | Text-to-SQLベースの自然言語データ検索エンジン | 自然言語のSQLクエリへの変換、結果のビジュアル表示 |
| 2 | 対話式BI：一言でビジュアルチャートを生成 | データ要件の記述、チャートの自動生成 |
| 3 | スクリーンショットワンクリックExcelテーブル識別ツール | スクリーンショットのアップロード後、VLMによるテーブル構造とデータの認識 |
| 4 | 画像・スクリーンショットからExcelテーブルAI識別ツール | 画像OCRによるテーブル構造の認識、データのExcel出力 |
| 5 | マルチソース異種構造データナレッジグラフ自動構築 | マルチデータソースの接続、エンティティと関係の抽出 |
| 6 | データレポートスマート解読・トレンド分析アシスタント | データレポート画像またはデータ入力、VLMによるチャート内容の解読とトレンド分析 |
| 7 | データベーステーブル構造スマート解読・クエリ例生成アシスタント | テーブル名またはフィールド記述の入力、建テーブル説明とサンプルクエリSQLの生成 |
| 8 | 企業マスターデータスマート対合・AI重複排除ガバナンス | マルチソースマスターデータのマッチング、重複レコードの識別 |
| 9 | データ要件ドキュメントスマートテストケース変換ツール | データ要件記述の入力、LLMによるテストシナリオと検証ケースの生成 |
| 10 | データ指標定義スマートQAアシスタント | 指標定義ドキュメントに基づくナレッジベース構築 |

</TabItem>
<TabItem label="Cエンド消費">

## 本章のガイド

<ChapterIntroduction :duration="cDuration" :tags="['C 誌アプリ', 'ライフスタイル', '感情体験', '雰囲気演出']" coreOutput="15+ の生活シーンインスピレーションの発見" expectedOutput="ユーザーの心を打つプロダクト方向を見つける">

本文書は <strong>LLM 大規模モデルの C 誌消費シーンにおけるクリエイティブな応用方向</strong>をまとめています。B 誌が効率やペインポイントに関心を持つのとは異なり、C 誌プロダクトは<strong>感覚の演出、心理的暗示、雰囲気</strong>を重視し、ユーザーが使用プロセスで感情の共鳴と素晴らしい体験を得るようにします。

</ChapterIntroduction>

## シーン雰囲気クイック選択

<el-card shadow="hover" style="margin-top: 16px; margin-bottom: 24px; border-left: 5px solid #ec4899;">
  <div style="font-weight: 600; margin-bottom: 8px;">あなたの心を打つシーンインスピレーションを見つける</div>
  <div style="color: #606266; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
    求める雰囲気と今の感覚を選択すると、システムが関連するシーン方向を推奨します。タグをクリックすると該当セクションにジャンプします。
  </div>
  <el-row :gutter="16">
    <el-col :span="12">
      <el-select v-model="vibePoint" placeholder="雰囲気タイプを選択" style="width: 100%;">
        <el-option
          v-for="item in vibeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <div style="font-weight: 500;">{{ item.label }}</div>
          <div style="font-size: 12px; color: #909399;">{{ item.desc }}</div>
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="12">
      <el-select v-model="feeling" placeholder="今の感覚を選択" style="width: 100%;">
        <el-option
          v-for="item in feelingOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <div style="font-weight: 500;">{{ item.label }}</div>
          <div style="font-size: 12px; color: #909399;">{{ item.desc }}</div>
        </el-option>
      </el-select>
    </el-col>
  </el-row>
  
  <div v-if="cRecommendationTopics.length > 0" style="margin-top: 16px;">
    <div style="font-weight: 600; margin-bottom: 12px; color: #ec4899;">
      おすすめの {{ cCurrentSelection.vibe }} × {{ cCurrentSelection.feeling }} シーン：
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
      <el-tag
        v-for="topic in cRecommendationTopics"
        :key="topic.title"
        type="danger"
        effect="light"
        style="cursor: pointer; margin-bottom: 4px;"
        @click="cScrollToAnchor(topic.scenarioAnchor)"
      >
        {{ topic.title }}
      </el-tag>
    </div>
    <el-button type="text" size="small" @click="cResetSelection" style="margin-top: 8px;">
      選び直す
    </el-button>
  </div>
</el-card>

---

## 1. ライフスタイル

> 💡 **コアコンセプト**：平凡な日常に儀式感を与え、ディテールの中に美しさを創造

| 番号 | アプリケーションシーン名 | アプリケーションシーン機能 |
| :--: | ------------ | ------------ |
| 1 | 朝の儀式感アラームアシスタント | 天気 API、カレンダーデータを統合し、LLM がパーソナライズされた朝のプランを生成；スマートスピーカーでカスタム音楽を再生、スマート照明の段階的点灯 |
| 2 | 一人暮らしの雰囲気クリエイター | スマートホームデバイス（照明、スピーカー、アロマディフューザー）に接続し、LLM が時間/気分に応じて自動的にパラメータ調整；ユーザーの好みを学習し継続的に最適化 |
| 3 | 週末のおうちデート回復プランジェネレーター | 動画配信プラットフォーム API と連携して作品リストを取得し、ユーザーの視聴履歴の好みに基づいて映画＋グルメ＋コーディネートのコンボプランを生成 |
| 4 | 就寝前の心の癒しラジオ | TTS 音声合成で優しい物語を生成、ホワイトノイズミックスアルゴリズム、スマート音量フェードアウト；睡眠データに基づいてコンテンツを調整 |
| 5 | 暮らしの美学インスピレーションキャッチャー | 画像認識でユーザーの環境写真を分析し、LLM が美学提案を生成；Pinterest/Instagram スタイルのコンテンツ推奨 |

---

## 2. 感情コンパニオン

> 💡 **コアコンセプト**：無条件の受容と寄り添い、感情の優しい器になる

| 番号 | アプリケーションシーン名 | アプリケーションシーン機能 |
| :--: | ------------ | ------------ |
| 1 | 深夜のツリー聞き手 | エンドツーエンド暗号化でプライバシーを確保、LLM 感情分析で感情を理解、長期記憶でユーザーのストーリーを保存、複数ターンの対話で継続的なサポート |
| 2 | 失恋回復コンパニオン | 感情段階認識アルゴリズム、段階ごとに異なるサポート（吐露期→発散期→再構築期）；心理学ナレッジベース RAG 検索 |
| 3 | 不安緩和呼吸コーチ | 生体センサーデータ入力（心拍数/呼吸）、リアルタイムで不安レベルをモニタリング；音声ガイドで呼吸リズム、漸進的筋弛緩法の指導 |
| 4 | 自信再構築メンター | ポジティブ心理学対話フレームワーク、ユーザーの小さな達成を記録してフィードバック；認知再構築技術でネガティブな自己対話の変革をサポート |
| 5 | 感情日記スマート分析 | 感情認識 NLP モデル、時系列分析で感情パターンを発見；感情グラフの可視化、予測的アラート |

---

## 3. エンターテインメント

> 💡 **コアコンセプト**：没入型体験の創造、エンターテインメントを心の居場所に

| 番号 | アプリケーションシーン名 | アプリケーションシーン機能 |
| :--: | ------------ | ------------ |
| 1 | 没入型マーダーミステリー DM | LLM がリアルタイムでストーリー分岐を生成、音声合成で NPC を演じ、プレイヤーの反応に応じて難易度とテンポを動的に調整；AR/VR シーンレンダリング |
| 2 | オープンワールドゲームの魂の NPC | 長期記憶データベースがプレイヤーとのインタラクション履歴を保存、LLM がパーソナライズされた対話を生成；感情コンピューティングで NPC にリアルな感情反応を持たせる |
| 3 | パーソナライズドポッドキャスト生成 | ユーザーの興味グラフに基づいて専用コンテンツを生成、TTS でユーザーの好きな声をクローン；リアルタイムインタラクションでリスナーの質問に回答 |
| 4 | バーチャルコンサート盛り上げ役 | バーチャルアバターレンダリング、リアルタイムコメントインタラクション、バーチャルペンライト/応援アイテム；空間オーディオ技術でライブ感を演出 |
| 5 | インタラクティブ小説共創パートナー | LLM がリアルタイムでストーリーを生成、ユーザーの選択が物語の行方に影響；マルチエンディング設計、キャラクター関係の動的発展 |

---

## 4. 自己成長

> 💡 **コアコンセプト**：成長は苦行ではなく、楽しい自己発見の旅

| 番号 | アプリケーションシーン名 | アプリケーションシーン機能 |
| :--: | ------------ | ------------ |
| 1 | 個人の成長の証人 | タイムライン可視化で成長軌跡を表示、マイルストーンの自動マーク；「過去の私」vs「今の私」の比較表示 |
| 2 | 習慣形成ゲーム化コーチ | ゲーム化メカニズム（経験値、レベル、バッジ）、ソーシャルランキング、AI コーチのキャラクター演じ（例：「冒険メンター」） |
| 3 | スキル学習パートナーマッチング | 興味と学習目標に基づくマッチングアルゴリズム、学習グループコミュニティ、お互いのチェックインメカニズム |
| 4 | 毎日の小さな幸せ発見者 | 画像認識で生活の中の素敵な瞬間を発見、感謝ジャーナルのガイド、毎週の素敵な瞬間の振り返り |
| 5 | 人生シミュレーション体験器 | マルチブランチストーリーで異なる選択の結果をシミュレート、パラレル人生の比較；意思決定の結果の可視化表示 |

---

## 5. ソーシャルインタラクション

> 💡 **コアコンセプト**：ソーシャルを気軽で自然に、快適なつながりを見つける

| 番号 | アプリケーションシーン名 | アプリケーションシーン機能 |
| :--: | ------------ | ------------ |
| 1 | アイスブレイクトピックジェネレーター | 場面と参加者に基づくスマートトピック推奨、リアルタイム会話分析で話題継続の提案；気まずい瞬間のフォローアップヒント |
| 2 | SNS投稿文雰囲気クリエイター | 画像コンテンツ分析、LLM が複数スタイルの文案を生成（文芸/ユーモア/シリアス）；emoji とレイアウトのスマート推奨 |
| 3 | デート雰囲気プランナー | 双方の興味に基づくデートプラン生成、レストラン/アクティビティ推奨、会話トピック提案；リアルタイム天気と交通情報 |
| 4 | オンライン飲み会盛り上げ役 | オンラインゲームライブラリ、アイスブレイクアクティビティジェネレーター、トピックルーレット；バーチャル背景とフィルターで雰囲気を強化 |
| 5 | ソーシャルエネルギー管理アシスタント | ソーシャル活動後のエネルギー消費評価、回復アドバイス（一人の時間のアクティビティ推奨）；ソーシャルカレンダーのスマートプランニング |

---

## 6. クリエイティブ表現

> 💡 **コアコンセプト**：誰にでも创造力がある、ただ目覚める必要があるだけ

| 番号 | アプリケーションシーン名 | アプリケーションシーン機能 |
| :--: | ------------ | ------------ |
| 1 | インスピレーション枯渇応急キット | クロスドメイン連想アルゴリズム、ランダム刺激語生成、クリエイティブプロンプトライブラリ；マインドマップ式インスピレーション発散ツール |
| 2 | 個人スタイル探索ガイド | 画像分析でユーザーの既存スタイルを識別、スタイルトレンド推奨、バーチャル試着/メイク；スタイル進化タイムライン |
| 3 | 手帳＆日記美学アドバイザー | レイアウトテンプレート推奨、カラースキーム生成、装飾エレメント提案；手書き文字認識とコンテンツ美化 |
| 4 | 写真構図雰囲気ガイド | シーン認識と構図アドバイス、フィルタースタイル推奨、レタッチパラメータのスマート調整；写真技法の学習パス |
| 5 | 音楽気分マッチング | 音楽感情分析アルゴリズム、ユーザーの気分認識、パーソナライズドプレイリスト生成；音楽ストーリーと背景紹介 |

---

## 7. 旅行探索

> 💡 **コアコンセプト**：旅行は景色を見るだけでなく、異なるライフスタイルを感じること

| 番号 | アプリケーションシーン名 | アプリケーションシーン機能 |
| :--: | ------------ | ------------ |
| 1 | 街歩き探索ガイド | 地元通コンテンツの集約、穴場スポット推奨、AR ナビゲーション；リアルタイム翻訳と音声ガイド |
| 2 | 旅行気分日記生成 | 写真の自動分類と厳選、LLM が美しい旅行記を生成、位置情報マーク付きタイムライン；ワンクリックで旅行動画生成 |
| 3 | 一人旅コンパニオンアシスタント | リアルタイム位置共有と安全リマインド、現地の緊急連絡先、AI ガイドの音声コンパニオン；一人旅コミュニティ交流 |
| 4 | 目的地雰囲気プレビュー | VR/360° パノラマプレビュー、現地の音と香りのシミュレーション、文化背景紹介；バーチャル「試住」体験 |
| 5 | 旅行写真雰囲気ガイド | ゴールデンアワー通知、構図補助線、現地名所撮影スポット推奨；後処理カラースタイル提案 |

---

## 8. 心身の健康

> 💡 **コアコンセプト**：健康は目標ではなく、優しいセルフケア

| 番号 | アプリケーションシーン名 | アプリケーションシーン機能 |
| :--: | ------------ | ------------ |
| 1 | 運動モチベーション覚醒師 | ユーザーの状態に応じて運動タイプをスマート推奨、マイクロエクササイズ（5分）オプション、ゲーム化運動チャレンジ；ソーシャル運動チェックイン |
| 2 | ヘルシー食インスピレーションキッチン | 冷蔵庫の食材認識、パーソナライズドレシピ推奨、栄養バランス分析；ステップバイステップの料理ガイド |
| 3 | 睡眠の質向上雰囲気クリエイター | 睡眠モニタリングデータ分析、就寝前儀式生成、環境最適化提案（温度/湿度/照明）；スマートウェイクアップ |
| 4 | ボディセンシングガイド | ボディスキャン瞑想ガイド、身体部位と感情の関連付け、心身接続エクササイズ；バイオフィードバック可視化 |
| 5 | セルフケアリマインダー | 仕事の強度モニタリング、定期的な休憩リマインド、マイクロケアアクティビティ提案（水分補給/ストレッチ/深呼吸）；セルフケア記録 |

---

## 9. 知識探索

> 💡 **コアコンセプト**：学習は終わりのない冒険、好奇心が最良の教師

| 番号 | アプリケーションシーン名 | アプリケーションシーン機能 |
| :--: | ------------ | ------------ |
| 1 | 知識探索ゲーム化ガイド | 知識ポイントマップ可視化、クリア形式の学習パス、アチーブメントバッジシステム；AI メンターのキャラクター演じ |
| 2 | 語学学習シーンパートナー | LLM が異なるキャラクターを演じて会話、発音矯正、文化背景紹介；没入型シチュエーションシミュレーション |
| 3 | 好奇心満足アシスタント | Wikipedia/ナレッジグラフ接続、複雑な概念のわかりやすい説明、関連知識推奨；好奇心記録 |
| 4 | 読書ノートインスピレーション | 書籍内容分析、観点の抽出と関連付け、思考の角度の推奨；読書ノートテンプレートと美化 |
| 5 | 知識共有雰囲気クリエイター | 知識カード自動生成、共有文案の最適化、ビジュアル美化；ソーシャル共有データフィードバック |

---

## 10. 関係マネジメント

> 💡 **コアコンセプト**：良い関係には心を込めたお手入れが必要、でも心を込めるのは複雑じゃなくていい

| 番号 | アプリケーションシーン名 | アプリケーションシーン機能 |
| :--: | ------------ | ------------ |
| 1 | 親密な関係コミュニケーションコーチ | 感情表現テンプレート生成、非暴力コミュニケーション技法指導、対立解決話術；関係健康度評価 |
| 2 | 家族ケアリマインダー | 重要日付のリマインド（誕生日/記念日）、ケアの話術提案、家族アクティビティ推奨；家族アルバム生成 |
| 3 | 友情維持雰囲気クリエイター | 友人とのインタラクション記録、共通話題推奨、遠隔集会企画；友情タイムラインと思い出生成 |
| 4 | 告白＆サプライズプランナー | パーソナライズドサプライズプラン生成、ギフト推奨、ロマンチック話術提案；実行スケジュールとリマインド |
| 5 | 対立緩和雰囲気ガイド | 感情冷却話術、相手の立場に立つ思考のガイド、和解ステップ提案；関係修復トラッキング |

---

## 11. ペットコンパニオン

> 💡 **コアコンセプト**：ペットは家族、彼らの寄り添いは記録し大切にする価値がある

| 番号 | アプリケーションシーン名 | アプリケーションシーン機能 |
| :--: | ------------ | ------------ |
| 1 | ペット擬人化日記 | ペット行動分析、一人称日記生成、写真自動添付；ペットの「SNS」 |
| 2 | ペット行動分析師 | ペット行動動画分析、健康アラート、トレーニング提案；品種特性ナレッジベース |
| 3 | ペットとの時間企画 | ペットアクティビティ推奨、DIY おもちゃチュートリアル、ペットフレンドリースポット推奨；ペットソーシャルマッチング |
| 4 | ペット記念ストーリー生成 | 写真と動画の厳選、タイムラインストーリー生成、音楽コーディネート；記念アルバム/動画の自動生成 |
| 5 | 初心者ペット飼い主安心ガイド | 段階別ケアガイド、よくある質問への回答、緊急時の対応；初心者コミュニティサポート |

---

## 12. 財務の健康

> 💡 **コアコンセプト**：財務的自由は目標ではない、財務の健康こそが目標

| 番号 | アプリケーションシーン名 | アプリケーションシーン機能 |
| :--: | ------------ | ------------ |
| 1 | 消費感情覺察アシスタント | 消費記録分析、感情-消費関連分析、衝動買いアラート；代替的満足感の提案 |
| 2 | 貯蓄目標ビジュアルモチベーション | 目標進捗の可視化、夢シーンレンダリング、マイルストーンのお祝い；貯蓄習慣形成ゲーム |
| 3 | 資産管理知識カジュアル学習 | 断片的な知識プッシュ、シチュエーション型ケーススタディ、インタラクティブクイズ；知識テストと証明書 |
| 4 | 財務不安緩和師 | 財務状況の健康評価、ストレスマネジメントスキル、小さなステップのアクションプラン；財務心理カウンセリング |
| 5 | 少額投資体験ゲーム | バーチャル投資シミュレーション、リスク教育、投資ポートフォリオゲーム；リアル少額投資のガイド |

---

## 13. キャリア開発

> 💡 **コアコンセプト**：キャリアはレールではなく、探索できる荒野

| 番号 | アプリケーションシーン名 | アプリケーションシーン機能 |
| :--: | ------------ | ------------ |
| 1 | キャリア迷いコンパニオン | キャリア興味診断、スキル棚卸し、業界情報推奨；キャリアメンターとの対話 |
| 2 | 仕事の達成感覚醒師 | 業績記録、価値の抽出、達成の可視化；同僚/顧客からのポジティブフィードバック収集 |
| 3 | 職場ソーシャル雰囲気アシスタント | 職場トピック推奨、ネットワーキングスキル、業界イベント推奨；LinkedIn コンテンツ最適化 |
| 4 | 副業インスピレーション発掘器 | スキル-興味-市場ニーズのマッチング、副業事例集、スタートアップガイド；副業コミュニティ交流 |
| 5 | 面接前自信加油站 | 模擬面接、よくある質問の準備、自信向上テクニック；身だしなみアドバイス |

---

## 14. 居家空間

> 💡 **コアコンセプト**：家は住む場所ではなく、心の居場所

| 番号 | アプリケーションシーン名 | アプリケーションシーン機能 |
| :--: | ------------ | ------------ |
| 1 | 居家空間雰囲気デザイナー | 空間写真分析、スタイル推奨、家具/インテリア推奨；AR プレビュー効果 |
| 2 | 四季インテリアチェンジガイド | 季節テーマ推奨、収納とディスプレイの提案、イベントデコレーションプラン；買い物リスト生成 |
| 3 | 小スペース空間マジック | 空間最適化アルゴリズム、多機能家具推奨、収納テクニック；視覚的広がりのテクニック |
| 4 | 居家儀式感クリエイター | 日常儀式のデザイン（朝/夜/週末）、儀式実行リマインド；儀式効果フィードバック |
| 5 | 断捨離心理コンパニオン | アイテムの感情価値評価、断捨離ステップガイド、心理的サポート；寄付/リサイクルルート推奨 |

---

## 15. グルメ料理

> 💡 **コアコンセプト**：食べ物は愛の言語、料理は愛を表現する方法

| 番号 | アプリケーションシーン名 | アプリケーションシーン機能 |
| :--: | ------------ | ------------ |
| 1 | 一人飯癒しレシピ | 冷蔵庫の食材認識、シンプルレシピ推奨、ステップバイステップガイド；一人飯の盛り付け美学 |
| 2 | イベント食卓雰囲気デザイン | イベントテーマメニュー、食卓コーディネートプラン、雰囲気演出テクニック；ゲスト体験最適化 |
| 3 | 料理気分マッチング | 気分-食べ物関連アルゴリズム、感情調整レシピ、コンフォートフード推奨；料理セラピーガイド |
| 4 | 料理初心者自信ビルダー | 超シンプルレシピ、失敗挽回テクニック、自信構築の声かけ；段階的難易度アップ |
| 5 | フードフォトグラフィー雰囲気ガイド | 料理の盛り付け提案、自然光の活用、撮影アングルのガイド；フィルターと後処理の提案 |

---

## 16. ファッションスタイル

> 💡 **コアコンセプト**：ファッションは自己表現、スタイルは内面の外在表現

| 番号 | アプリケーションシーン名 | アプリケーションシーン機能 |
| :--: | ------------ | ------------ |
| 1 | 今日のコーデ気分ボード | 天気/シーン/気分の総合推奨、バーチャル試着、コーデインスピレーション；ワードローブ管理 |
| 2 | カプセルワードローブコーディネーター | ワードローブ棚卸し、アイテム別コーデ組み合わせ、1着多コーデプラン；買い物アドバイス（空欄を補完） |
| 3 | 個人スタイル探索の旅 | スタイルテスト、参考アイコン推奨、スタイル進化パス；自信構築 |
| 4 | 古着の新しい着こなしクリエイター | 古着リメイクインスピレーション、新しいコーデ方法、アクセサリーのポイントテクニック；サステナブルファッションの理念 |
| 5 | 特別シーンスタイリングアドバイザー | シーンのドレスコード読み解き、スタイリングプラン生成、メイク・ヘアアドバイス；全体スタイリングの調和 |

---

## C 誌プロダクトを設計するコアの心得

### 1. 「機能」から「感覚」へ

B 誌プロダクトは「この機能がどんな問題を解決できるか」に関心を持ち、C 誌プロダクトは「この機能がどんな感覚をもたらせるか」に関心を持ちます。

| B 誌の考え方 | C 誌の考え方 |
|---------|---------|
| 効率向上 | 好きなことにもっと時間を使える |
| コスト削減 | 使うお金の価値を最大化 |
| ペインポイント解決 | 素晴らしい体験の創造 |
| 機能の充実 | 感覚が届いているか |

### 2. 雰囲気を演出する 3 つのレイヤー

**感覚レイヤー**：視覚、聴覚、触覚のデザイン
- 温かい色調
- リラックスできる音
- スムーズなアニメーション

**感情レイヤー**：感情の共鳴とガイド
- ユーザーの気持ちを理解する
- 感情的サポートを提供する
- ポジティブな感情を創造する

**意味レイヤー**：価値の共感と帰属感
- ユーザーが理解されていると感じる
- 帰属感を創造する
- 行動に意味を与える

### 3. 心理的暗示の力

C 誌プロダクトの文案とデザインはすべて心理的暗示を伝えています：

- **ポジティブ暗示**：「あなたはもう十分頑張っています」「ゆっくりでいいんです」
- **帰属暗示**：「あなたと同じ人がたくさんいます」「一人じゃないんです」
- **成長暗示**：「毎回の試みは進歩です」「あなたはもっと良くなっています」

### 4. ユーザーをより良い自分にする

最高の C 誌プロダクトはユーザーを変えるものではなく、ユーザーがなりたい自分をサポートするものです。

- 「〜すべき」ではなく、「〜できます」
- 「〜しなければ」ではなく、「〜したいなら」
- 「まだ足りない」ではなく、「あなたはもう〜」

---

> 🌟 **覚えておいてください**：C 誌ユーザーが買っているのは機能ではなく、感覚です。ツールではなく、寄り添いです。サービスではなく、理解です。

</TabItem>
</Tabs>
