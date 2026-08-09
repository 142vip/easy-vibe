---
title: 'AI 應用場景參考（B 端與 C 端）'
description: '本文件彙總了 LLM 大模型在 B 端企業場景與 C 端消費場景中的應用方向。B 端涵蓋工業製造、智慧客服、教育、醫療、金融等 19 個行業的落地應用；C 端涵蓋生活方式、情感陪伴、娛樂休閒、個人成長等 16 個消費場景的創意靈感，為 AI 應用開發者提供全面參考。'
---

<script setup>
import { computed, ref } from 'vue'

const duration = '約 <strong>6 小時</strong>'

const interestPoint = ref('')
const purpose = ref('')

// 每個行業的主題池
const topicPool = {
  'manufacturing': [
    { title: '新能源客車外觀 AI 輔助設計平臺', desc: '基於圖片生成模型進行外觀概念設計' },
    { title: '智慧圖紙設計與審查助手', desc: '利用 RAG 技術構建企業設計規範知識庫' },
    { title: '技術文件自動生成與管理', desc: '基於 LLM 自動生成產品規格書和操作手冊' },
    { title: '生產裝置巡檢報告自動生成助手', desc: '語音描述裝置狀態，結構化生成巡檢報告' },
    { title: '工業裝置故障診斷知識問答助手', desc: '基於歷史故障案例構建向量知識庫' }
  ],
  'customer-service': [
    { title: '多渠道智慧客服自動回覆與工單生成系統', desc: '接入多渠道訊息，LLM 理解意圖後生成回覆' },
    { title: '潛在客戶挖掘與跟進建議助手', desc: '分析歷史對話記錄，識別高意向客戶' },
    { title: '企業內部知識智慧檢索與問答管家', desc: '基於內部文件構建向量知識庫' },
    { title: '客服對話智慧小結與工單生成工具', desc: '自動生成會話小結並提取關鍵資訊' },
    { title: '客服金牌話術推薦知識庫系統', desc: '分析優秀案例，提煉金牌話術模板' }
  ],
  'education': [
    { title: '個性化語言學習路徑規劃與智慧導學系統', desc: '評估學習者水平，規劃每日學習任務' },
    { title: '教案自動化編寫與教學資源推送平臺', desc: '根據課程大綱生成教案框架' },
    { title: '作業自動化批閱與學情診斷分析系統', desc: '自動批改主觀題並生成批改建議' },
    { title: '人才崗位勝任力模型構建與學習地圖', desc: '分析崗位 JD 提取能力要求' },
    { title: '外語口語一對一情景化實戰演練', desc: 'LLM 扮演不同角色進行口語對話' }
  ],
  'programming': [
    { title: '智慧程式碼補全與 Bug 自動修復助手', desc: 'IDE 外掛實時提供程式碼補全建議' },
    { title: '低程式碼應用構建與流程自動化平臺', desc: '自然語言描述需求，轉換為低程式碼配置' },
    { title: '單元測試用例生成系統', desc: 'AST 解析原始碼，生成邊界條件測試用例' },
    { title: '程式碼智慧分析與語言遷移工具', desc: '分析程式碼質量並提供最佳化建議' },
    { title: '前端介面（UI）程式碼自動生成工具', desc: '設計稿圖片識別，生成響應式 CSS' }
  ],
  'healthcare': [
    { title: '醫學檢驗報告智慧解讀助手', desc: 'OCR 識別關鍵指標，解讀異常值' },
    { title: '基於知識檢索技術的健康諮詢專家', desc: '構建醫學知識圖譜，RAG 檢索生成回答' },
    { title: '臨床科研資料決策分析平臺', desc: '整合 EMR 資料，輔助生成統計分析程式碼' },
    { title: '醫學影像報告自動生成工具', desc: '描述影像特徵，自動生成結構化報告' },
    { title: '慢病管理用藥提醒智慧助手', desc: '生成個性化用藥提醒，支援用藥禁忌檢查' }
  ],
  'security': [
    { title: '程式碼安全漏洞檢測與修復引擎', desc: 'SAST 掃描程式碼，分析漏洞原理' },
    { title: 'AI 生成式釣魚郵件智慧識別與攔截系統', desc: '分析郵件內容，識別 AI 生成的釣魚郵件' },
    { title: '安全運營日報自動生成助手', desc: '日誌彙總，自動提取關鍵事件' },
    { title: '滲透測試報告智慧生成助手', desc: '根據漏洞描述自動生成報告' },
    { title: '威脅情報智慧查詢與分析助手', desc: '對接多源威脅情報，解讀情報內容' }
  ],
  'finance': [
    { title: '信貸盡調報告智慧生成助手', desc: '輸入財務資料，自動生成信貸盡調報告' },
    { title: '私人銀行財富管理智慧顧問', desc: '分析客戶風險偏好，生成資產配置建議' },
    { title: 'IPO 招股書智慧生成與合規校驗助手', desc: '模組化模板，自動填充業務描述' },
    { title: '企業財務報告自動生成與經營異常預警系統', desc: '自動生成財務分析和管理層討論' },
    { title: '保險代理人智慧話術陪練', desc: '模擬對話，評估話術合規性和說服力' }
  ],
  'enterprise': [
    { title: '企業合同全生命週期合規性審查與修改建議平臺', desc: '條款比對法規庫，生成合規性審查報告' },
    { title: '銷售會話語音轉寫與話術推薦', desc: 'ASR 轉寫，分析會話並推薦金牌話術' },
    { title: '營銷內容智慧生成與設計系統', desc: '生成營銷文案和賣點提煉' },
    { title: '競品廣告投放分析平臺', desc: '採集競品廣告，分析投放策略' },
    { title: '全網熱點選題智慧分析與內容推薦系統', desc: '分析熱點趨勢並推薦選題角度' }
  ],
  'content': [
    { title: '影視與小說內容創作輔助平臺', desc: '提供故事大綱、角色設定、對白生成' },
    { title: '企業品牌故事與公關軟文智慧撰寫助手', desc: '輸入品牌關鍵詞，生成多風格文案' },
    { title: '虛擬數字人直播互動與推流管理系統', desc: '數字人形象 + TTS 語音 + LLM 對話' },
    { title: '短影片指令碼生成與智慧剪輯', desc: '生成短影片指令碼和分鏡' },
    { title: '營銷內容智慧生成與設計系統', desc: '生成營銷文案和賣點提煉' }
  ],
  'government': [
    { title: '12345 政務熱線智慧語音導航與自動分派系統', desc: '語音識別，理解訴求並智慧分派' },
    { title: '政務服務大廳智慧導辦與政策問答機器人', desc: '政務知識庫 RAG 檢索' },
    { title: '惠企政策智慧匹配與精準推送平臺', desc: '企業畫像自動匹配適用政策' },
    { title: '行政審批材料智慧預審與合規校驗助手', desc: 'OCR 識別和關鍵資訊提取' },
    { title: '城市網格化事件智慧識別與排程管理平臺', desc: '識別事件型別並分派' }
  ],
  'legal': [
    { title: '合同風險漏洞一鍵"找茬"Agent', desc: '對照風險清單識別潛在問題' },
    { title: '類似案件勝訴率 AI 智慧評估顧問', desc: '案件特徵提取，類案檢索匹配' },
    { title: '法律法規變更實時監測與業務影響分析雷達', desc: '解析變更內容並評估業務影響' },
    { title: '律師函 AIGC 自動起草工具', desc: '事實陳述輸入，生成規範律師函' },
    { title: '複雜法律條款"翻譯"為大白話的解釋外掛', desc: '生成通俗易懂的解釋' }
  ],
  'travel': [
    { title: '基於 AIGC 的懶人路書生成器', desc: '生成每日行程安排' },
    { title: '全網機票酒店價格趨勢預測與低價自動鎖定機器人', desc: 'ML 模型預測價格趨勢' },
    { title: '簽證材料智慧預審與自動化填表輔助系統', desc: 'OCR 識別資訊完整性檢查' },
    { title: '出境遊實時語音翻譯與選單視覺漢化管家', desc: '離線語音翻譯，選單圖片 OCR' },
    { title: '旅行足跡自動生成精美遊記與社交文案助手', desc: '照片資訊提取，生成遊記文案' }
  ],
  'emotion': [
    { title: '基於 LLM 大模型的 24 小時深度陪伴虛擬伴侶', desc: '記憶系統儲存對話歷史' },
    { title: '多模態情感識別與心理疏導 AI 顧問', desc: '語音語調分析 + 文字情感識別' },
    { title: '阿爾茨海默症老人 AI 認知訓練與記憶喚醒數字人', desc: '認知遊戲訓練，老照片觸發記憶' },
    { title: '社恐人士的 AIGC 模擬社交演練教練', desc: '虛擬社交場景模擬' },
    { title: '全天候心情監測與 AI 正向情緒激勵助手', desc: '分析心情趨勢並生成激勵內容' }
  ],
  'entertainment': [
    { title: '基於 LLM 驅動的開放世界遊戲 NPC 自主決策引擎', desc: 'NPC 行為樹融合 LLM 決策' },
    { title: '沉浸式劇本殺 AIGC 劇情推演與 DM 控場輔助工具', desc: '玩家選擇觸發劇情分支' },
    { title: '互動小說結局生成式修改器', desc: '讀者選擇影響劇情走向' },
    { title: '電競戰局 CV 視覺分析與 AI 智慧解說員', desc: '遊戲畫面實時分析' },
    { title: '多角色 TTS 語音合成有聲書自動生成系統', desc: '文字角色分配，個性化音色生成' }
  ],
  'ecommerce': [
    { title: '高轉化率 AIGC 商品詳情頁批次生產工具', desc: '生成賣點文案和場景描述' },
    { title: '服裝虛擬模特 AI 智慧試穿與展示影片生成工廠', desc: '虛擬模特試穿效果生成' },
    { title: '跨境電商多語言 LLM 本地化翻譯與潤色助手', desc: '商品描述多語言翻譯' },
    { title: '24 小時全天候 AIGC 數字人直播帶貨系統', desc: '數字人形象 + 實時話術生成' },
    { title: '市場流行趨勢 AI 洞察與爆款預測引擎', desc: '洞察趨勢熱點，選品建議' }
  ],
  'energy': [
    { title: '家庭用電行為 AI 分析與節能策略顧問', desc: '用電模式分析，生成節能建議' },
    { title: '光伏元件缺陷無人機 CV 視覺識別系統', desc: '無人機巡檢拍攝，熱紅外影象分析' },
    { title: '電力現貨交易價格 AI 趨勢預測與自動獲利策略 Agent', desc: '價格預測模型，策略生成' },
    { title: '企業全鏈路碳排放 AI 自動核算與 ESG 報告生成助手', desc: '碳排放因子計算，ESG 報告生成' },
    { title: '電網極端天氣負荷 AI 預測與應急排程指揮系統', desc: '負荷預測模型，排程策略生成' }
  ],
  'av-media': [
    { title: '長影片精彩片段 AI 識別與短影片自動剪輯工具', desc: '影片內容分析，關鍵幀識別' },
    { title: '影片背景噪音 AI 智慧分離與人聲增強助手', desc: '音訊分離模型，去除背景噪音' },
    { title: '老舊影像 4K 超分修復與 AI 智慧上色工作臺', desc: '影片超解析度模型，AI 自動上色' },
    { title: '文字轉真人級 TTS 配音與情感控制系統', desc: '多音色 TTS 模型，情感控制' },
    { title: '會議錄音 AI 智慧轉寫與核心待辦提取助手', desc: '多人會議語音分離轉寫' }
  ],
  'ai-marketing': [
    { title: '小紅書爆款文案 AIGC 自動撰寫引擎', desc: '生成種草文案，emoji 最佳化' },
    { title: '營銷海報 AI 智慧排版與多尺寸適配工具', desc: '海報模板智慧匹配' },
    { title: '品牌 LOGO 創意 AIGC 生成與 VI 體系構建平臺', desc: 'LOGO 創意生成，VI 規範生成' },
    { title: '全網熱點 AI 追蹤與借勢營銷創意生成助手', desc: '分析營銷角度，創意方案生成' },
    { title: '短影片指令碼創意 AIGC 生成與分鏡指導助手', desc: '指令碼和分鏡生成，拍攝建議' }
  ],
  'data-intelligence': [
    { title: '自然語言轉 SQL 語句自動生成工具', desc: '自然語言查詢轉換為 SQL' },
    { title: '企業資料資產目錄智慧盤點與分類系統', desc: '後設資料採集，自動分類' },
    { title: '資料質量異常自動檢測與修復建議引擎', desc: '規則引擎 + ML 模型檢測異常' },
    { title: '智慧報表生成與視覺化配置助手', desc: '對話式生成報表配置' },
    { title: '資料指標口徑智慧問答助手', desc: '基於指標定義文件構建知識庫' }
  ]
}

// 預定義的推薦鏈路對映表
const recommendationMap = {
  // 興趣點: 創意內容
  'creative-content': {
    'increase-efficiency': ['content', 'av-media', 'ai-marketing', 'entertainment'],
    'reduce-cost': ['content', 'ecommerce', 'ai-marketing'],
    'improve-experience': ['entertainment', 'emotion', 'travel', 'content'],
    'innovate-business': ['ai-marketing', 'content', 'av-media', 'entertainment']
  },
  // 興趣點: 技術服務
  'tech-service': {
    'increase-efficiency': ['programming', 'enterprise', 'data-intelligence', 'customer-service'],
    'reduce-cost': ['programming', 'enterprise', 'manufacturing'],
    'improve-experience': ['customer-service', 'enterprise', 'programming'],
    'innovate-business': ['data-intelligence', 'programming', 'security', 'enterprise']
  },
  // 興趣點: 資料智慧
  'data-intel': {
    'increase-efficiency': ['data-intelligence', 'finance', 'enterprise', 'manufacturing'],
    'reduce-cost': ['data-intelligence', 'manufacturing', 'energy'],
    'improve-experience': ['data-intelligence', 'customer-service', 'ecommerce'],
    'innovate-business': ['data-intelligence', 'finance', 'security', 'ai-marketing']
  },
  // 興趣點: 使用者服務
  'user-service': {
    'increase-efficiency': ['customer-service', 'ecommerce', 'travel', 'enterprise'],
    'reduce-cost': ['customer-service', 'ecommerce', 'enterprise'],
    'improve-experience': ['customer-service', 'emotion', 'travel', 'ecommerce', 'entertainment'],
    'innovate-business': ['ecommerce', 'travel', 'emotion', 'entertainment']
  },
  // 興趣點: 行業解決方案
  'industry-solution': {
    'increase-efficiency': ['manufacturing', 'healthcare', 'finance', 'government'],
    'reduce-cost': ['manufacturing', 'energy', 'enterprise', 'finance'],
    'improve-experience': ['healthcare', 'education', 'government', 'travel'],
    'innovate-business': ['finance', 'security', 'legal', 'healthcare', 'government']
  }
}

const interestOptions = [
  { label: '創意內容生成', value: 'creative-content', desc: '文案、圖片、影片等創意內容' },
  { label: '技術服務工具', value: 'tech-service', desc: '開發工具、自動化、程式碼輔助' },
  { label: '資料智慧分析', value: 'data-intel', desc: '資料分析、預測、智慧決策' },
  { label: '使用者服務體驗', value: 'user-service', desc: '客服、營銷、使用者體驗' },
  { label: '行業解決方案', value: 'industry-solution', desc: '特定行業的深度應用' }
]

const purposeOptions = [
  { label: '提升效率', value: 'increase-efficiency', desc: '自動化、加速流程' },
  { label: '降低成本', value: 'reduce-cost', desc: '減少人力、最佳化資源' },
  { label: '改善體驗', value: 'improve-experience', desc: '使用者滿意度、服務質量' },
  { label: '業務創新', value: 'innovate-business', desc: '新產品、新模式' }
]

const industries = [
  { key: 'manufacturing', name: '工業製造業', anchor: '#_1-工業製造業' },
  { key: 'customer-service', name: '智慧客服', anchor: '#_2-智慧客服' },
  { key: 'education', name: '教育行業', anchor: '#_3-教育行業' },
  { key: 'programming', name: '智慧程式設計', anchor: '#_4-智慧程式設計' },
  { key: 'healthcare', name: '醫療方向', anchor: '#_5-醫療方向' },
  { key: 'security', name: '網路安全', anchor: '#_6-網路安全' },
  { key: 'finance', name: '金融管理、保險銀行業', anchor: '#_7-金融管理、保險銀行業' },
  { key: 'enterprise', name: '企業服務', anchor: '#_8-企業服務' },
  { key: 'content', name: '內容生產與運營', anchor: '#_9-內容生產與運營' },
  { key: 'government', name: '智慧政務管理', anchor: '#_10-智慧政務管理' },
  { key: 'legal', name: '法律事務與合同管理', anchor: '#_11-法律事務與合同管理' },
  { key: 'travel', name: '旅遊與出行服務', anchor: '#_12-旅遊與出行服務' },
  { key: 'emotion', name: '情感陪伴', anchor: '#_13-情感陪伴' },
  { key: 'entertainment', name: '休閒娛樂', anchor: '#_14-休閒娛樂' },
  { key: 'ecommerce', name: '電商服務', anchor: '#_15-電商服務' },
  { key: 'energy', name: '能源', anchor: '#_16-能源' },
  { key: 'av-media', name: '音影片', anchor: '#_17-音影片' },
  { key: 'ai-marketing', name: 'AI 營銷', anchor: '#_18-ai-營銷' },
  { key: 'data-intelligence', name: '資料智慧', anchor: '#_19-資料智慧' }
]

// 計算推薦結果 - 從主題池中隨機抽取
const recommendationTopics = computed(() => {
  if (!interestPoint.value || !purpose.value) return []
  
  const keys = recommendationMap[interestPoint.value]?.[purpose.value] || []
  const topics = []
  
  // 從每個推薦行業中隨機抽取 1-2 個主題
  keys.forEach(key => {
    const industry = industries.find(item => item.key === key)
    const industryTopics = topicPool[key] || []
    
    if (industry && industryTopics.length > 0) {
      // 隨機抽取 1-2 個主題
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
  
  // 隨機排序並限制總數
  return topics.sort(() => Math.random() - 0.5).slice(0, 8)
})

// 獲取當前選擇的描述
const currentSelection = computed(() => {
  const interest = interestOptions.find(i => i.value === interestPoint.value)
  const pur = purposeOptions.find(p => p.value === purpose.value)
  return {
    interest: interest?.label || '',
    purpose: pur?.label || ''
  }
})

const scrollToAnchor = (anchor) => {
  // 延遲滾動確保DOM更新完成
  setTimeout(() => {
    // 嘗試透過ID查詢（支援多種格式）
    let element = document.querySelector(anchor)
    
    // 如果找不到，嘗試其他可能的ID格式
    if (!element) {
      // 嘗試去掉下劃線字首
      const altAnchor = anchor.replace('#_', '#')
      element = document.querySelector(altAnchor)
    }
    
    // 如果還是找不到，透過標題文字查詢
    if (!element) {
      // 從錨點提取行業名稱
      const anchorText = decodeURIComponent(anchor.replace('#', '').replace(/^_/, ''))
      const headings = document.querySelectorAll('h2, h3')
      
      for (let heading of headings) {
        const headingText = heading.textContent.trim()
        // 完全匹配或包含匹配
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
      // 高亮顯示目標段落
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
const cDuration = '約 <strong>4 小時</strong>'

const vibePoint = ref('')
const feeling = ref('')

// 每個場景的主題池 - 強調感覺、氛圍、心理暗示
const cTopicPool = {
  'lifestyle': [
    { title: '晨間儀式感喚醒助手', desc: '根據天氣、日程、心情生成專屬晨間儀式，讓每一天從美好開始' },
    { title: '獨居生活氛圍營造師', desc: '為獨居者設計居家氛圍方案，燈光、音樂、香薰的智慧搭配建議' },
    { title: '週末宅家治癒計劃生成器', desc: '根據當下心情推薦完美的宅家組合：電影+零食+氛圍佈置' },
    { title: '睡前心靈安撫電臺', desc: '生成溫柔的故事、冥想引導，陪伴入睡的私人電臺' },
    { title: '生活美學靈感捕手', desc: '從日常小事中發現美，生成生活美學建議和儀式感指南' }
  ],
  'emotion': [
    { title: '深夜樹洞傾聽者', desc: '24 小時線上的情緒垃圾桶，無評判地接納所有心事' },
    { title: '失戀療愈陪伴師', desc: '在失戀低谷期提供溫柔的陪伴、療愈建議和情緒出口' },
    { title: '焦慮緩解呼吸教練', desc: '感知焦慮情緒，引導呼吸練習和正念冥想' },
    { title: '自信心重建導師', desc: '透過積極對話和心理暗示，幫助重建自我認同和價值感' },
    { title: '情緒日記智慧解讀', desc: '分析情緒日記，發現情緒規律，給出溫暖的洞察和建議' }
  ],
  'entertainment': [
    { title: '沉浸式劇本殺 DM', desc: '扮演劇本殺主持人，營造懸疑氛圍，推動劇情發展' },
    { title: '開放世界遊戲靈魂 NPC', desc: '有血有肉的 NPC，記住玩家故事，產生真實的情感羈絆' },
    { title: '個性化播客內容生成', desc: '根據興趣生成專屬播客，像朋友聊天一樣自然' },
    { title: '虛擬演唱會氛圍組', desc: '為線上演唱會營造現場感，實時互動、應援、氛圍渲染' },
    { title: '互動小說共創夥伴', desc: '與讀者共同創作故事，每個選擇都影響世界走向' }
  ],
  'growth': [
    { title: '個人成長見證者', desc: '記錄成長軌跡，在重要節點給予鼓勵和回顧' },
    { title: '習慣養成遊戲化教練', desc: '將枯燥的習慣養成變成有趣的冒險遊戲' },
    { title: '技能學習搭子匹配', desc: '找到志同道合的學習夥伴，互相督促、分享進步' },
    { title: '每日小確幸發現者', desc: '幫助發現生活中的小美好，培養感恩和積極心態' },
    { title: '人生模擬體驗器', desc: '模擬不同人生選擇，體驗平行時空的另一種可能' }
  ],
  'social': [
    { title: '破冰話題生成器', desc: '在社交場合提供有趣的話題，化解尷尬、拉近距離' },
    { title: '朋友圈文案氛圍師', desc: '根據照片和心情，生成有格調的朋友圈文案' },
    { title: '約會氛圍策劃師', desc: '為約會設計完整的氛圍方案，從地點到話題到驚喜' },
    { title: '遠端聚會氣氛擔當', desc: '線上上聚會中活躍氣氛，組織遊戲、引導互動' },
    { title: '社交能量管理助手', desc: '幫助內曏者管理社交能量，找到舒適的社交節奏' }
  ],
  'creative': [
    { title: '靈感枯竭急救包', desc: '在創意瓶頸時提供意想不到的靈感火花' },
    { title: '個人風格探索嚮導', desc: '幫助發現獨特的個人風格，從穿搭到表達' },
    { title: '手賬與日記美學顧問', desc: '提供手賬排版、配色、內容創意的美學建議' },
    { title: '攝影構圖氛圍指南', desc: '根據場景和想要的感覺，提供攝影和修圖建議' },
    { title: '音樂心情匹配師', desc: '根據當下心情和場景，推薦完美的音樂組合' }
  ],
  'travel': [
    { title: '城市漫步探索嚮導', desc: '像本地人一樣探索城市，發現隱藏的寶藏地點' },
    { title: '旅行心情日記生成', desc: '將旅行照片和心情轉化為優美的遊記和回憶' },
    { title: '獨自旅行陪伴助手', desc: '為獨自旅行者提供陪伴、建議和安全感' },
    { title: '目的地氛圍預覽', desc: '在出發前沉浸式體驗目的地氛圍，提前進入狀態' },
    { title: '旅行攝影氛圍指導', desc: '根據場景和光線，指導拍出有故事感的旅行照片' }
  ],
  'health': [
    { title: '運動動力喚醒師', desc: '在不想動的時候給予恰到好處的鼓勵和動力' },
    { title: '健康飲食靈感廚房', desc: '根據心情和食材，生成治癒系的健康食譜' },
    { title: '睡眠質量最佳化氛圍師', desc: '從環境到心理，全方位營造優質睡眠氛圍' },
    { title: '身體感知引導師', desc: '引導關注身體訊號，建立身心連線' },
    { title: '自我關愛提醒助手', desc: '在忙碌中提醒你停下來，關愛自己' }
  ],
  'learning': [
    { title: '知識探索遊戲化嚮導', desc: '將枯燥的知識學習變成有趣的探索冒險' },
    { title: '語言學習情景夥伴', desc: '扮演不同角色，在情景對話中自然習得語言' },
    { title: '好奇心滿足助手', desc: '回答各種奇思妙想，滿足對世界的好奇心' },
    { title: '讀書筆記靈感激發', desc: '幫助整理讀書心得，發現新的思考角度' },
    { title: '知識分享氛圍營造', desc: '將學到的知識轉化為有趣的分享內容' }
  ],
  'relationship': [
    { title: '親密關係溝通教練', desc: '幫助表達難以啟齒的情感，改善親密關係' },
    { title: '家人關懷提醒助手', desc: '提醒你關心家人，提供溫馨的互動建議' },
    { title: '友誼維護氛圍師', desc: '幫助維護遠距離友誼，創造共同話題' },
    { title: '表白與驚喜策劃師', desc: '為重要的人策劃難忘的驚喜和浪漫時刻' },
    { title: '衝突緩和氛圍引導', desc: '在關係緊張時提供緩和氛圍的建議和話術' }
  ],
  'pet': [
    { title: '寵物擬人化日記', desc: '以寵物的視角生成日記，記錄與主人的溫馨日常' },
    { title: '寵物行為解讀師', desc: '解讀寵物的行為語言，加深與寵物的連線' },
    { title: '寵物陪伴時光策劃', desc: '設計與寵物互動的創意活動，增進感情' },
    { title: '寵物紀念故事生成', desc: '將寵物的照片和回憶轉化為溫馨的故事' },
    { title: '新手鏟屎官安心指南', desc: '為新手寵物主人提供溫暖的陪伴和指導' }
  ],
  'finance': [
    { title: '消費情緒覺察助手', desc: '覺察衝動消費背後的情緒，建立健康的消費觀' },
    { title: '儲蓄目標視覺化激勵', desc: '將儲蓄目標轉化為視覺化的夢想進度' },
    { title: '理財知識輕鬆學', desc: '用輕鬆有趣的方式學習理財知識' },
    { title: '財務焦慮舒緩師', desc: '在面對財務壓力時提供情緒支援和實用建議' },
    { title: '小額投資體驗遊戲', desc: '透過遊戲化方式體驗投資，降低入門門檻' }
  ],
  'career': [
    { title: '職業迷茫陪伴者', desc: '在職業迷茫期提供傾聽、探索和方向建議' },
    { title: '工作成就感喚醒師', desc: '幫助發現工作中的價值和意義，重燃熱情' },
    { title: '職場社交氛圍助手', desc: '提供職場社交的輕鬆話題和互動建議' },
    { title: '副業靈感激發器', desc: '根據個人興趣和技能，激發副業創意' },
    { title: '面試前信心加油站', desc: '在面試前提供心理建設和信心鼓勵' }
  ],
  'home': [
    { title: '居家空間氛圍設計師', desc: '根據心情和季節，設計居家氛圍方案' },
    { title: '四季家居變換指南', desc: '隨季節變換家居佈置，保持新鮮感' },
    { title: '小戶型空間魔法', desc: '讓小空間也能有舒適溫馨的氛圍' },
    { title: '居家儀式感創造者', desc: '為日常居家活動創造儀式感' },
    { title: '斷舍離心理陪伴', desc: '在整理物品時提供心理支援和決策建議' }
  ],
  'food': [
    { title: '一人食治癒料理', desc: '為獨居者設計簡單治癒的料理方案' },
    { title: '節日餐桌氛圍設計', desc: '為特殊日子設計有儀式感的餐桌布置' },
    { title: '料理心情匹配師', desc: '根據當下心情推薦適合的食物和做法' },
    { title: '廚房小白信心建立', desc: '為零基礎烹飪者提供溫暖鼓勵和簡單食譜' },
    { title: '美食攝影氛圍指南', desc: '讓家常料理也能拍出誘人的氛圍感' }
  ],
  'fashion': [
    { title: '今日穿搭心情板', desc: '根據天氣、場合、心情生成穿搭靈感' },
    { title: '膠囊衣櫥搭配師', desc: '用有限的單品創造無限的搭配可能' },
    { title: '個人風格探索之旅', desc: '幫助發現和建立獨特的個人風格' },
    { title: '舊衣新穿創意師', desc: '為舊衣服提供新的搭配靈感' },
    { title: '特殊場合造型顧問', desc: '為重要場合設計令人自信的造型' }
  ]
}

// 預定義的推薦鏈路對映表 - 基於氛圍和感覺
const cRecommendationMap = {
  // 氛圍點: 治癒系
  'healing': {
    'relax': ['emotion', 'lifestyle', 'health', 'home'],
    'inspire': ['creative', 'growth', 'learning', 'entertainment'],
    'connect': ['relationship', 'social', 'pet', 'emotion'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // 氛圍點: 成長系
  'growth': {
    'relax': ['growth', 'learning', 'creative', 'health'],
    'inspire': ['career', 'learning', 'creative', 'growth'],
    'connect': ['social', 'relationship', 'career', 'learning'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // 氛圍點: 社交系
  'social': {
    'relax': ['social', 'pet', 'food', 'home'],
    'inspire': ['social', 'creative', 'entertainment', 'travel'],
    'connect': ['relationship', 'social', 'pet', 'travel'],
    'escape': ['social', 'travel', 'entertainment', 'creative']
  },
  // 氛圍點: 探索系
  'explore': {
    'relax': ['travel', 'creative', 'lifestyle', 'food'],
    'inspire': ['travel', 'creative', 'learning', 'entertainment'],
    'connect': ['travel', 'social', 'relationship', 'pet'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // 氛圍點: 日常系
  'daily': {
    'relax': ['lifestyle', 'home', 'health', 'emotion'],
    'inspire': ['creative', 'food', 'fashion', 'home'],
    'connect': ['relationship', 'social', 'pet', 'lifestyle'],
    'escape': ['entertainment', 'creative', 'travel', 'lifestyle']
  }
}

const vibeOptions = [
  { label: '治癒系', value: 'healing', desc: '溫暖、安撫、療愈' },
  { label: '成長系', value: 'growth', desc: '進步、突破、蛻變' },
  { label: '社交系', value: 'social', desc: '連線、分享、互動' },
  { label: '探索系', value: 'explore', desc: '好奇、冒險、發現' },
  { label: '日常系', value: 'daily', desc: '平凡、真實、當下' }
]

const feelingOptions = [
  { label: '想要放鬆', value: 'relax', desc: '舒緩壓力、放空自己' },
  { label: '尋找靈感', value: 'inspire', desc: '激發創意、獲得啟發' },
  { label: '渴望連線', value: 'connect', desc: '與人連線、情感共鳴' },
  { label: '暫時逃離', value: 'escape', desc: '逃離現實、沉浸體驗' }
]

const scenarios = [
  { key: 'lifestyle', name: '生活方式', anchor: '#_1-生活方式' },
  { key: 'emotion', name: '情感陪伴', anchor: '#_2-情感陪伴' },
  { key: 'entertainment', name: '娛樂休閒', anchor: '#_3-娛樂休閒' },
  { key: 'growth', name: '個人成長', anchor: '#_4-個人成長' },
  { key: 'social', name: '社互動動', anchor: '#_5-社互動動' },
  { key: 'creative', name: '創意表達', anchor: '#_6-創意表達' },
  { key: 'travel', name: '旅行探索', anchor: '#_7-旅行探索' },
  { key: 'health', name: '身心健康', anchor: '#_8-身心健康' },
  { key: 'learning', name: '知識探索', anchor: '#_9-知識探索' },
  { key: 'relationship', name: '關係經營', anchor: '#_10-關係經營' },
  { key: 'pet', name: '寵物陪伴', anchor: '#_11-寵物陪伴' },
  { key: 'finance', name: '財務健康', anchor: '#_12-財務健康' },
  { key: 'career', name: '職業發展', anchor: '#_13-職業發展' },
  { key: 'home', name: '居家空間', anchor: '#_14-居家空間' },
  { key: 'food', name: '美食料理', anchor: '#_15-美食料理' },
  { key: 'fashion', name: '穿搭風格', anchor: '#_16-穿搭風格' }
]

// 計算推薦結果 - 從主題池中隨機抽取
const cRecommendationTopics = computed(() => {
  if (!vibePoint.value || !feeling.value) return []
  
  const keys = cRecommendationMap[vibePoint.value]?.[feeling.value] || []
  const topics = []
  
  // 從每個推薦場景中隨機抽取 1-2 個主題
  keys.forEach(key => {
    const scenario = scenarios.find(item => item.key === key)
    const scenarioTopics = cTopicPool[key] || []
    
    if (scenario && scenarioTopics.length > 0) {
      // 隨機抽取 1-2 個主題
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
  
  // 隨機排序並限制總數
  return topics.sort(() => Math.random() - 0.5).slice(0, 8)
})

// 獲取當前選擇的描述
const cCurrentSelection = computed(() => {
  const vibe = vibeOptions.find(i => i.value === vibePoint.value)
  const feel = feelingOptions.find(p => p.value === feeling.value)
  return {
    vibe: vibe?.label || '',
    feeling: feel?.label || ''
  }
})

const cScrollToAnchor = (anchor) => {
  // 延遲滾動確保DOM更新完成
  setTimeout(() => {
    // 嘗試透過ID查詢（支援多種格式）
    let element = document.querySelector(anchor)
    
    // 如果找不到，嘗試其他可能的ID格式
    if (!element) {
      // 嘗試去掉下劃線字首
      const altAnchor = anchor.replace('#_', '#')
      element = document.querySelector(altAnchor)
    }
    
    // 如果還是找不到，透過標題文字查詢
    if (!element) {
      // 從錨點提取場景名稱
      const anchorText = decodeURIComponent(anchor.replace('#', '').replace(/^_/, ''))
      const headings = document.querySelectorAll('h2, h3')
      
      for (let heading of headings) {
        const headingText = heading.textContent.trim()
        // 完全匹配或包含匹配
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
      // 高亮顯示目標段落
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

# AI 應用場景參考（B 端與 C 端）

<Tabs>
<TabItem label="B 端產業應用">

## 章節導讀

<ChapterIntroduction :duration="duration" :tags="['B 端應用', '產業應用', 'AI 場景', '落地參考', '行業方案']" coreOutput="瞭解 15+ B 端行業應用場景" expectedOutput="找到適合企業客戶的專案方向">

本文件彙總了 <strong>LLM 大模型在 B 端企業場景中的落地應用</strong>。與 C 端關注使用者體驗和情感不同，B 端產品更注重<strong>解決實際業務需求、提升效率、降低成本</strong>。每個場景都具備<strong>實際落地的可行性</strong>，涵蓋從<strong>需求分析到技術實現</strong>的完整思路，適合面向企業客戶的 AI 應用開發者參考。

</ChapterIntroduction>

## 行業方向快速選擇

<el-card shadow="hover" style="margin-top: 16px; margin-bottom: 24px; border-left: 5px solid #409EFF;">
  <div style="font-weight: 600; margin-bottom: 8px;">找到適合你的應用場景</div>
  <div style="color: #606266; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
    選擇你的興趣方向和想要實現的目的，系統會推薦相關的行業場景，點選標籤即可跳轉到對應章節。
  </div>
  <el-row :gutter="16">
    <el-col :span="12">
      <el-select v-model="interestPoint" placeholder="選擇興趣方向" style="width: 100%;">
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
      <el-select v-model="purpose" placeholder="選擇實現目的" style="width: 100%;">
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
  
  <!-- 推薦結果展示 - 表格形式 -->
  <div v-if="recommendationTopics.length > 0" style="margin-top: 16px;">
    <div style="font-weight: 600; margin-bottom: 10px; color: #409EFF;">
      為你推薦 {{ recommendationTopics.length }} 個應用場景
      <span style="font-weight: normal; color: #909399; font-size: 13px; margin-left: 8px;">
        ({{ currentSelection.interest }} + {{ currentSelection.purpose }})
      </span>
    </div>
    <el-table 
      :data="recommendationTopics" 
      style="width: 100%; cursor: pointer;"
      @row-click="(row) => scrollToAnchor(row.industryAnchor)"
      highlight-current-row>
      <el-table-column prop="title" label="應用場景" min-width="300">
        <template #default="scope">
          <div style="font-weight: 500; color: #303133;">{{ scope.row.title }}</div>
          <div style="font-size: 12px; color: #909399; margin-top: 4px;">{{ scope.row.desc }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="industryName" label="所屬行業" width="180" align="center">
        <template #default="scope">
          <el-tag type="info" effect="light" size="small">{{ scope.row.industryName }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px; font-size: 12px; color: #909399;">
      💡 點選表格任意行即可跳轉到對應行業章節
    </div>
  </div>
  
  <!-- 未完全選擇時的提示 -->
  <div v-else-if="!interestPoint || !purpose" style="margin-top: 14px; color: #909399; font-size: 13px;">
    <span v-if="!interestPoint && !purpose">💡 請選擇興趣方向和實現目的</span>
    <span v-else-if="!interestPoint">💡 請選擇興趣方向</span>
    <span v-else>💡 請選擇實現目的</span>
  </div>
  
  <!-- 重置按鈕 -->
  <div v-if="interestPoint || purpose" style="margin-top: 12px;">
    <el-button size="small" @click="resetSelection">重新選擇</el-button>
  </div>
</el-card>

## 行業快速介紹

### 主流技術選型

在 AI 應用開發中，常見的技術方向包括：

1. **LLM（大語言模型）**：擅長處理自然語言任務，如對話、文字生成、摘要、翻譯等，適合構建智慧客服、內容創作、知識問答類應用。
2. **VLM（視覺語言模型）**：結合視覺理解與語言能力，可實現影象描述、視覺問答、多模態內容生成等功能，適用於醫療影像分析、工業質檢、創意設計等場景。
3. **GenAI（生成式 AI）**：包括文字生成、影象生成（如 Stable Diffusion、DALL·E）、影片生成等技術，能夠快速生成創意內容，適用於設計輔助、營銷素材製作、教育培訓等領域。

### 選擇策略

學習者可以根據以下維度選擇適合自己的應用方向：

1. **興趣導向**：優先選擇自己感興趣的行業或技術方向，保持學習動力。例如：
   - 對創意設計感興趣：可嘗試內容生產、工業設計類應用
   - 對技術挑戰感興趣：可嘗試網路安全、醫療方向的應用
   - 對社會價值感興趣：可嘗試智慧政務、教育行業的應用

2. **行業適配**：結合自身行業背景或資源優勢選擇場景：
   - 製造業從業者：可優先考慮工業製造、企業服務類應用
   - 教育工作者：可優先關注教育行業、內容生產類應用
   - 醫療從業者：可探索醫療方向、健康管理類應用

3. **技術難度**：根據自身技術基礎選擇合適的複雜度：
   - 入門級：智慧客服、內容創作、簡單問答系統
   - 進階級：工業質檢、醫療影像分析、程式碼智慧助手
   - 專業級：金融風控、網路安全、多模態複雜應用

## 1. 工業製造業 

工業製造業場景主要圍繞設計輔助、生產最佳化、智慧運維三大方向展開。常見應用包括利用 AI 輔助產品外觀設計、自動化圖紙審查、技術文件智慧生成、工業裝置故障診斷等，能夠顯著提升設計效率和降低運維成本。

| 序號 | 應用場景名稱                   | 實現參考                                                                                                        |
| :--: | ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
|  1   | 新能源客車外觀 AI 輔助設計平臺 | 基於圖片生成模型進行外觀概念設計，結合 LLM 進行設計規範檢查和創意迭代；整合 Three.js 3D 渲染服務                 |
|  2   | 智慧圖紙設計與審查助手         | 利用 RAG 技術構建企業設計規範知識庫，DALL·E 生成參考圖輔助理解；整合 CAD API 實現圖紙自動化解析                  |
|  3   | 技術文件自動生成與管理         | 基於 LLM 從產品資料庫自動生成產品規格書和操作手冊，ChromaDB 向量庫儲存歷史文件支援智慧檢索                       |
|  4   | 生產裝置巡檢報告自動生成助手   | 巡檢人員語音描述裝置狀態，LLM 結構化生成巡檢報告；自動關聯歷史故障記錄                                           |
|  5   | 工廠叉車智慧排程與路徑規劃系統 | LLM 解析訂單任務和倉庫位置，結合地圖 API 生成最優排程方案                                                        |
|  6   | 基於 LLM 資訊檢索的資料倉儲    | 採用 Text-to-SQL 技術將自然語言轉換為資料庫查詢，Superset 視覺化展示查詢結果；Doris 或 ClickHouse 作為 OLAP 引擎 |
|  7   | 工業裝置故障診斷知識問答助手   | 基於歷史故障案例構建向量知識庫，LLM 根據故障描述提供診斷建議和解決方案                                           |
|  8   | 生產質檢報告智慧生成與缺陷分類 | OCR 識別質檢照片中的缺陷，LLM 生成結構化質檢報告；自動分類缺陷型別和嚴重程度                                     |
|  9   | 庫存檔點智慧助手與盤點報告生成 | 盤點資料錄入，LLM 自動比對系統庫存並生成差異報告；異常庫存預警                                                   |
|  10  | 工藝流程最佳化建議智慧問答系統   | 基於生產工藝文件構建 RAG 知識庫，LLM 根據生產問題提供最佳化建議                                                    |

## 2. 智慧客服

智慧客服場景聚焦於客戶服務效率提升和使用者體驗最佳化。典型應用涵蓋多渠道客服整合、智慧回覆生成、客戶情緒分析、工單自動化處理等，幫助企業實現 7×24 小時客戶服務。

| 序號 | 應用場景名稱                         | 實現參考                                                                                                               |
| :--: | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
|  1   | 多渠道智慧客服自動回覆與工單生成系統 | 接入微信、APP、官網等多渠道訊息，LLM 理解意圖後生成回覆並自動建立工單；使用 LangChain 構建對話流程，MySQL 儲存工單資料 |
|  2   | 潛在客戶挖掘與跟進建議助手           | LLM 分析歷史客服對話記錄，識別高意向客戶特徵並打分；推薦系統結合協同過濾演算法                                           |
|  3   | 企業內部知識智慧檢索與問答管家       | 基於 Confluence 和內部文件構建向量知識庫，LLM 結合 RAG 技術生成答案                                                    |
|  4   | 客戶滿意度調查與服務改進管理系統     | LLM 自動分析客服對話內容進行情感分類和滿意度評分；BI 報表展示分析結果                                                  |
|  5   | 客服對話智慧小結與工單生成工具       | 客服結束對話後，LLM 自動生成會話小結並提取關鍵資訊；自動填充工單欄位                                                   |
|  6   | 客服話術合規性自動檢測助手           | 客服輸入回覆內容，LLM 實時檢測話術合規性和敏感詞；給出修改建議                                                         |
|  7   | 客服工單自動摘要與分類生成工具       | LLM 對長對話記錄進行摘要生成和自動分類打標；Elasticsearch 支援工單全文檢索                                             |
|  8   | 客戶情緒監測與異常預警工具           | 實時分析語音語調特徵和文字情感，LLM 識別異常情緒並觸發預警；WebSocket 推送預警訊息                                     |
|  9   | 客服金牌話術推薦知識庫系統           | LLM 分析優秀客服對話案例，提煉金牌話術模板；推薦系統根據對話上下文實時推薦話術                                         |
|  10  | 智慧外呼對話內容分析與質檢助手       | 外呼錄音轉寫後，LLM 分析對話內容提取關鍵資訊；自動生成質檢報告和改進建議                                               |

## 3. 教育行業

教育行業場景致力於實現個性化教學和智慧教育管理。核心應用包括智慧學習路徑規劃、作業自動批改、教案生成、學情分析等，推動教育資源的最佳化配置和因材施教的實現。

| 序號 | 應用場景名稱                             | 實現參考                                                                                   |
| :--: | ---------------------------------------- | ------------------------------------------------------------------------------------------ |
|  1   | 個性化語言學習路徑規劃與智慧導學系統     | LLM 評估學習者當前水平，根據學習目標規劃每日學習任務；推薦演算法結合知識圖譜推薦學習資源     |
|  2   | 教案自動化編寫與教學資源推送平臺         | LLM 根據課程大綱生成教案框架和教學設計；向量庫儲存優質教案和課件，支援關鍵詞檢索和相似推薦 |
|  3   | 作業自動化批閱與學情診斷分析系統         | LLM 自動批改主觀題並生成批改建議，知識圖譜定位學生薄弱知識點                               |
|  4   | 人才崗位勝任力模型構建與學習地圖         | LLM 分析崗位 JD 提取能力要求，構建崗位能力畫像；根據差距生成個性化學習地圖                 |
|  5   | 校本課程體系構建與課件製作工具           | LLM 分析學校特色和學生需求，生成校本課程框架；整合 PPT 生成介面自動製作課件                |
|  6   | 外語口語一對一情景化實戰演練             | LLM 扮演不同角色進行口語對話，ASR 識別發音並評分；TTS 生成標準發音示範                     |
|  7   | 高考志願大資料推薦與生涯規劃指導平臺     | LLM 分析考生分數、位次、興趣等資訊，結合招錄資料推薦院校和專業                             |
|  8   | 少兒程式設計程式碼助手                         | LLM 解釋程式碼邏輯和提供程式設計指導，支援塊語言和 Python 切換                                   |
|  9   | 知識點思維導圖自動生成與學習路徑推薦工具 | 輸入課程主題，LLM 自動生成知識點思維導圖；根據學習進度推薦下一步學習內容                   |
|  10  | 中英文作文自動化評分與批改引擎           | LLM 從立意、結構、語言、多樣性等多維度評分並生成批註；比對優秀範文                         |

## 4. 智慧程式設計

智慧程式設計場景旨在提升開發效率和程式碼質量。典型應用有智慧程式碼補全、Bug 自動修復、自動化測試生成、程式碼轉換等，讓開發者能夠專注於業務邏輯而非重複性編碼工作。

| 序號 | 應用場景名稱                     | 實現參考                                                                                             |
| :--: | -------------------------------- | ---------------------------------------------------------------------------------------------------- |
|  1   | 智慧程式碼補全與 Bug 自動修復助手  | 基於 CodeLlama 微調程式碼模型，IDE 外掛實時提供程式碼補全建議；LLM 分析錯誤棧自動定位 Bug 並生成修復程式碼 |
|  2   | 低程式碼應用構建與流程自動化平臺   | 使用者透過自然語言描述需求，LLM 轉換為低程式碼配置或程式碼框架                                             |
|  3   | 單元測試用例生成系統             | AST 解析原始碼提取函式邏輯，LLM 生成邊界條件和異常場景的測試用例；整合 Jest/Pytest 執行測試          |
|  4   | 程式碼智慧分析與語言遷移工具       | 基於 Tree-sitter 解析程式碼結構，LLM 分析程式碼質量並提供最佳化建議；結合規則引擎實現語言轉換              |
|  5   | 自然語言轉 SQL 語句自動生成工具  | LLM 將自然語言查詢轉換為 SQL，支援複雜多表關聯和聚合查詢                                             |
|  6   | API 介面自動化測試與文件生成平臺 | LLM 分析程式碼註釋和介面定義，自動生成測試用例和 API 文件；Postman 整合測試執行                        |
|  7   | UI 測試指令碼智慧錄製與維護工具    | 瀏覽器外掛錄製使用者操作軌跡，LLM 分析操作意圖生成測試指令碼；AI 修復失效的定位器                        |
|  8   | 系統日誌分析與故障定位           | ELK Stack 採集日誌資料，LLM 分析異常日誌提取關鍵資訊並定位根因；推薦修復方案                         |
|  9   | 前端介面（UI）程式碼自動生成工具   | 設計稿圖片經 OCR 識別佈局結構，LLM 生成響應式 CSS 和元件程式碼；整合 TailwindCSS 支援多種樣式框架      |
|  10  | 資料庫結構智慧設計與建模助手     | 業務需求文件輸入給 LLM，自動生成 ER 圖和資料表結構；支援匯出 MySQL/PostgreSQL 建表指令碼               |

## 5. 醫療方向

醫療方向場景致力於提升診療效率和醫療服務質量。常見應用包括病歷自動生成、醫學知識問答、影像分析輔助、藥物研發支援等，推動醫療行業的智慧化轉型。

| 序號 | 應用場景名稱                       | 實現參考                                                                              |
| :--: | ---------------------------------- | ------------------------------------------------------------------------------------- |
|  1   | 醫學檢驗報告智慧解讀助手           | 上傳檢驗報告圖片，OCR 識別關鍵指標，LLM 解讀異常值並生成通俗解釋                      |
|  2   | 基於知識檢索技術的健康諮詢專家     | 構建醫學知識圖譜（ICD-10、藥品說明書、診療指南），RAG 檢索生成回答                    |
|  3   | 臨床科研資料決策分析平臺           | 整合 EMR 資料和檢驗結果，LLM 輔助生成統計分析程式碼和視覺化圖表；支援佇列研究和生存分析 |
|  4   | 醫學考題智慧生成與錯題解析系統     | 輸入教材章節和知識點，LLM 生成練習題和解析；自動收錄錯題並生成薄弱點分析              |
|  5   | 藥物研發全流程知識圖譜智慧問答專家 | 構建藥物-靶點-疾病知識圖譜，LLM 解答研發相關問題；支援文獻檢索和實驗方案推薦          |
|  6   | 藥品說明書智慧問答助手             | 上傳藥品說明書圖片或輸入藥名，LLM 解答用法用量、不良反應、注意事項等問題              |
|  7   | 疾病知識科普文章生成助手           | 輸入疾病名稱和受眾，LLM 生成通俗易懂的科普文章；支援多版本（患者版/家屬版）           |
|  8   | 醫學影像報告自動生成工具           | 影像科醫生描述影像特徵，LLM 自動生成結構化報告；支援常見檢查型別模板                  |
|  9   | 手術記錄智慧生成與歸檔助手         | 手術過程中語音錄入關鍵步驟，LLM 結構化生成手術記錄；自動關聯手術編碼                  |
|  10  | 慢病管理用藥提醒智慧助手           | 患者輸入用藥清單，LLM 生成個性化用藥提醒；支援用藥禁忌檢查和互動問答                  |

## 6. 網路安全

網路安全場景聚焦於安全防護和風險管控。核心應用涵蓋漏洞檢測、威脅情報分析、釣魚郵件識別、安全事件響應等，為企業構建全方位的智慧安全防護體系。

| 序號 | 應用場景名稱                        | 實現參考                                                                               |
| :--: | ----------------------------------- | -------------------------------------------------------------------------------------- |
|  1   | 程式碼安全漏洞檢測與修復引擎          | 靜態程式碼分析工具（SAST）掃描程式碼，LLM 分析漏洞原理並生成修復建議；整合 CI/CD 流水線    |
|  2   | AI 生成式釣魚郵件智慧識別與攔截系統 | LLM 分析郵件內容、傳送者特徵和連結安全性，識別 AI 生成的釣魚郵件；對接郵件閘道器實時攔截 |
|  3   | 安全運營日報自動生成助手            | 安全裝置日誌彙總，LLM 自動提取關鍵事件並生成日報；異常事件highlight標記                |
|  4   | 安全知識庫智慧問答助手              | 基於安全文件、CVE 庫構建向量知識庫，LLM 解答安全技術和處置建議問題                     |
|  5   | 滲透測試報告智慧生成助手            | 滲透測試完成後，LLM 根據漏洞描述自動生成報告；漏洞修復建議批次生成                     |
|  6   | 惡意程式碼防護與隱私合規監控          | 沙箱分析可疑檔案行為，LLM 識別惡意特徵並生成簽名；隱私資料識別掃描                     |
|  7   | 安全配置合規性檢查清單生成工具      | 輸入目標系統型別，LLM 生成安全配置檢查清單；支援等保 2.0、CIS 等標準                   |
|  8   | 威脅情報智慧查詢與分析助手          | 對接多源威脅情報（開源、商業），LLM 解讀情報並關聯企業資產；推薦防護策略               |
|  9   | 安全事件覆盤報告生成助手            | 安全事件發生後，LLM 根據時間線自動生成覆盤報告；根因分析和改進建議                     |
|  10  | 全球威脅情報監測與預警中心          | 爬蟲採集全球安全資訊和漏洞披露，LLM 提取關鍵資訊並評估影響；郵件/簡訊預警通知          |

## 7. 金融管理、保險銀行業

金融領域場景圍繞風險控制和業務智慧化展開。典型應用包括信貸風控評估、財富管理顧問、財務報告生成、反洗錢監測等，提升金融機構的運營效率和風險管控能力。

| 序號 | 應用場景名稱                           | 實現參考                                                                             |
| :--: | -------------------------------------- | ------------------------------------------------------------------------------------ |
|  1   | 信貸盡調報告智慧生成助手               | 輸入企業基本資訊和財務資料，LLM 自動生成信貸盡調報告；風險點自動標註                 |
|  2   | 私人銀行財富管理智慧顧問               | LLM 分析客戶風險偏好和財務目標，生成資產配置建議；對接理財產品和基金庫               |
|  3   | IPO 招股書智慧生成與合規校驗助手       | 招股說明書模組化模板，LLM 自動填充業務描述和風險因素；合規校驗規則引擎檢查前後一致性 |
|  4   | 企業財務報告自動生成與經營異常預警系統 | 財務系統資料自動採集，LLM 生成財務分析和管理層討論部分；異常指標預警規則             |
|  5   | 財務票據資訊提取與問答助手             | 上傳發票圖片，OCR 識別資訊，LLM 解答票據相關問題；支援增值稅發票、火車票等           |
|  6   | 合規案例智慧檢索與問答助手             | 基於監管處罰案例構建知識庫，LLM 解答合規問題並提供案例參考                           |
|  7   | 保險代理人智慧話術陪練                 | LLM 扮演不同型別客戶進行模擬對話，評估代理人話術合規性和說服力；錄音轉寫分析         |
|  8   | 保險產品條款分析與競品對比平臺         | 條款結構化解析，LLM 生成亮點摘要和注意事項                                           |
|  9   | 客戶話術情緒識別服務                   | 語音情緒識別結合話術合規檢測，實時反饋代理人改進建議                                 |
|  10  | 保險理賠進度智慧查詢與對話助手         | 使用者輸入保單號或報案號，LLM 查詢理賠進度並解答理賠相關問題                           |

## 8. 企業服務

企業服務場景致力於提升組織運營效率和管理水平。常見應用包括客戶關係管理、銷售預測、輿情監測、HR 智慧管理等，幫助企業實現數字化轉型升級。

| 序號 | 應用場景名稱                       | 實現參考                                                                       |
| :--: | ---------------------------------- | ------------------------------------------------------------------------------ |
|  1   | 客戶留存分析與流失預警平臺         | 行為資料埋點採集使用者操作，ML 模型預測流失機率，LLM 生成挽留建議                |
|  2   | B2B 潛在客戶觸達與營銷郵件平臺     | 企業工商資料篩選目標客戶，LLM 生成個性化營銷內容；郵件群發平臺對接             |
|  3   | 銷售管線監測與業績預測平臺         | CRM 資料自動採集，LLM 分析銷售漏斗並預測業績達成；異常預警推送管理者           |
|  4   | 品牌輿情監測與危機預警雷達         | 全網輿情資料採集（社交媒體、新聞、論壇），LLM 分析情感和傳播趨勢；危機預警推送 |
|  5   | 職場郵件智慧撰寫與溝通情緒管理助手 | 郵件上下文理解，LLM 生成專業郵件草稿；情緒分析反饋改進建議                     |
|  6   | 簡歷智慧解析與崗位匹配系統         | 簡歷 PDF 解析提取關鍵資訊，LLM 匹配合適崗位並生成面試建議；ATS 系統對接        |
|  7   | 企業員工入職指引與問答助手         | 入職文件知識庫 RAG 檢索，LLM 解答新員工常見問題                                |
|  8   | 員工績效反饋與 OKR 目標管理平臺    | OKR 系統資料採集，LLM 分析目標完成情況並生成反饋建議；360 反饋收集             |
|  9   | 智慧會議記錄與待辦管理             | 會議錄音轉寫，LLM 提取關鍵討論點和待辦事項；任務系統自動建立待辦               |
|  10  | 發票識別與費用報銷自動處理         | OCR 識別發票資訊，自動校驗發票真偽和報銷合規性；對接財務系統                   |

## 9. 內容生產與運營

內容生產與運營場景聚焦於創意生成和流量運營。核心應用包括文案創作、短影片製作、數字人直播、SEO 最佳化等，幫助企業提升內容產出效率和營銷轉化率。

| 序號 | 應用場景名稱                              | 實現參考                                                                   |
| :--: | ----------------------------------------- | -------------------------------------------------------------------------- |
|  1   | 影視與小說內容創作輔助平臺                | LLM 提供故事大綱、角色設定、對白生成等創作輔助；思維導圖視覺化故事結構     |
|  2   | 企業品牌故事與公關軟文智慧撰寫助手        | 輸入品牌關鍵詞和產品資訊，LLM 生成多風格文案版本；A/B 測試介面對接         |
|  3   | 虛擬數字人直播互動與推流管理系統          | 數字人形象建模 + TTS 語音 + LLM 對話，實時響應觀眾彈幕；OBS 推流整合       |
|  4   | 短影片指令碼生成與智慧剪輯                  | LLM 生成短影片指令碼和分鏡，Sora/Runway 生成影片片段；剪輯工具自動拼接       |
|  5   | 銷售會話語音轉寫與話術推薦                | 電話錄音 ASR 轉寫，LLM 分析會話並推薦金牌話術；CRM 系統整合                |
|  6   | 營銷內容智慧生成與設計系統                | 產品資訊輸入，LLM 生成營銷文案和賣點提煉；整合 Canava/稿定設計模板         |
|  7   | 多平臺廣告投放 ROI 實時監控與策略調優系統 | 廣告平臺 API 對接採集資料，LLM 分析投放效果並生成最佳化建議；異常預警推送    |
|  8   | 搜尋引擎關鍵詞與流量分析                  | 百度指數、5118 資料採集，LLM 分析關鍵詞趨勢和競爭度；內容選題推薦          |
|  9   | 競品廣告投放分析平臺                      | 第三方資料平臺 API 採集競品廣告，LLM 分析投放策略和創意特點                |
|  10  | 全網熱點選題智慧分析與內容推薦系統        | 微博熱搜、抖音熱榜資料採集，LLM 分析熱點趨勢並推薦選題角度；日曆化內容排期 |

## 10. 智慧政務管理

智慧政務場景致力於提升政府服務效能和治理能力。典型應用包括政務熱線智慧導航、政策智慧問答、行政審批最佳化、城市事件管理等，推動數字政府建設。

| 序號 | 應用場景名稱                               | 實現參考                                                             |
| :--: | ------------------------------------------ | -------------------------------------------------------------------- |
|  1   | 12345 政務熱線智慧語音導航與自動分派系統   | 市民來電語音識別，LLM 理解訴求並智慧分派到對應部門；工單系統自動流轉 |
|  2   | 政務服務大廳智慧導辦與政策問答機器人       | 政務知識庫 RAG 檢索，LLM 解答辦事流程和政策問題；取號系統對接        |
|  3   | 惠企政策智慧匹配與精準推送平臺             | 政策結構化解析，企業畫像自動匹配適用政策；簡訊/郵件推送提醒          |
|  4   | 行政審批材料智慧預審與合規校驗助手         | 材料 OCR 識別和關鍵資訊提取，LLM 校驗材料完整性和合規性              |
|  5   | 公共安全影片監控異常行為檢測系統           | 影片流實時分析，CV 模型檢測異常行為（打架、跌倒等）；告警推送        |
|  6   | 城市網格化事件智慧識別與排程管理平臺       | 城市感知資料（IoT、攝像頭）採集，LLM 識別事件型別並分派              |
|  7   | 社情民意大資料分析與風險預警系統           | 政務熱線、網路輿情、社情走訪等多源資料融合分析；LLM 識別風險熱點     |
|  8   | 政務檔案數字化識別與智慧歸檔管理平臺       | OCR 識別檔案文字內容，LLM 提取關鍵資訊並自動分類；全文檢索支援       |
|  9   | 突發公共事件應急指揮與救援資源智慧排程平臺 | 事件資訊採集，LLM 生成應急響應方案；資源排程最佳化演算法                 |
|  10  | 大氣環境汙染網格化監測與精準溯源系統       | 空氣質量感測器資料採集，CV 模型識別汙染源；LLM 分析汙染趨勢並溯源    |

## 11. 法律事務與合同管理

法律事務場景聚焦於法律服務效率提升和合規管理。常見應用包括合同審查、案件分析、法規監測、法律文書生成等，為法律從業者提供智慧化工具支援。

| 序號 | 應用場景名稱                                             | 實現參考                                                         |
| :--: | -------------------------------------------------------- | ---------------------------------------------------------------- |
|  1   | 合同風險漏洞一鍵"找茬"Agent                              | 合同文字結構化解析，LLM 對照風險清單識別潛在問題；標註高風險條款 |
|  2   | 企業合同全生命週期合規性審查與修改建議平臺               | 合同條款比對法規庫，LLM 生成合規性審查報告；修改建議跟蹤         |
|  3   | 類似案件勝訴率 AI 智慧評估顧問                           | 案件特徵提取，類案檢索匹配；LLM 分析影響勝訴因素                 |
|  4   | 法律法規變更實時監測與業務影響分析雷達                   | 法律法規資料庫實時更新，LLM 解析變更內容並評估業務影響；預警推送 |
|  5   | 律師函 AIGC 自動起草工具                                 | 事實陳述輸入，LLM 生成規範律師函模板；要素檢查和合規校驗         |
|  6   | 庭審錄音實時轉寫與爭議焦點自動化提取記錄儀               | 法庭錄音 ASR 轉寫，LLM 提取爭議焦點和關鍵論點；時間戳標註        |
|  7   | 全網智慧財產權侵權線索自動監測與區塊鏈取證系統             | 電商平臺、社交媒體侵權監測；侵權證據自動採集存證                 |
|  8   | 基於 LLM 的 IPO 招股書關鍵資料一致性核查與風險預警 Agent | 招股書多章節資料比對，LLM 識別不一致和資料異常；風險標註         |
|  9   | 複雜法律條款"翻譯"為大白話的解釋外掛                     | 選中法律條文，LLM 生成通俗易懂的解釋                             |
|  10  | 案件證據鏈智慧梳理與視覺化展示系統                       | 證據材料上傳，LLM 分析證據關係和時間線                           |

## 12. 旅遊與出行服務

旅遊出行場景致力於提升旅行體驗和服務便捷性。核心應用包括智慧行程規劃、價格預測、虛擬導覽、翻譯服務等，讓旅行更加輕鬆愉快。

| 序號 | 應用場景名稱                                 | 實現參考                                                                            |
| :--: | -------------------------------------------- | ----------------------------------------------------------------------------------- |
|  1   | 基於 AIGC 的懶人路書生成器                   | 使用者偏好輸入（天數、預算、興趣），LLM 生成每日行程安排；景點 API 獲取開放時間和門票 |
|  2   | 全網機票酒店價格趨勢預測與低價自動鎖定機器人 | 採集 OTA 價格資料，ML 模型預測價格趨勢；價格監控提醒                                |
|  3   | 航班取消後的跨航司行程重組與應急方案推薦顧問 | 航班狀態監控，LLM 分析替代行程方案；多航司比價                                      |
|  4   | 簽證材料智慧預審與自動化填表輔助系統         | 材料拍照上傳，OCR 識別資訊完整性檢查；表格自動填充                                  |
|  5   | 出境遊實時語音翻譯與選單視覺漢化管家         | 離線語音翻譯模型，選單圖片 OCR 識別並翻譯                                           |
|  6   | 基於大資料真實評價的酒店"避雷"指南分析儀     | 酒店評論資料採集，LLM 提取正負面評價關鍵詞                                          |
|  7   | 目的地沉浸式 VR 預覽與虛擬選房互動平臺       | 360°全景圖採集，VR 技術實現沉浸式預覽；房間虛擬遊覽                                 |
|  8   | 旅行足跡自動生成精美遊記與社交文案助手       | 照片時間地點資訊提取，LLM 生成遊記文案；模板排版生成                                |
|  9   | 企業差旅發票自動歸集與合規報銷管理平臺       | 差旅平臺 API 對接，發票資訊自動採集；合規校驗                                       |
|  10  | 景區客流擁堵實時預測與錯峰遊覽路線規劃導航   | 景區客流資料採集，ML 模型預測擁堵時段；錯峰推薦                                     |

## 13. 情感陪伴

情感陪伴場景聚焦於心理健康和情感慰藉。典型應用包括虛擬伴侶、情感諮詢、認知訓練、心理疏導等，為使用者提供全天候的陪伴和支援。

| 序號 | 應用場景名稱                                 | 實現參考                                                    |
| :--: | -------------------------------------------- | ----------------------------------------------------------- |
|  1   | 基於 LLM 大模型的 24 小時深度陪伴虛擬伴侶    | 記憶系統儲存對話歷史，LLM 生成個性化回覆；情感支援模組      |
|  2   | 多模態情感識別與心理疏導 AI 顧問             | 語音語調分析 + 文字情感識別，LLM 生成疏導建議；危機干預預警 |
|  3   | 阿爾茨海默症老人 AI 認知訓練與記憶喚醒數字人 | 認知遊戲（記憶、計算、語言）訓練；老照片/老歌觸發記憶回憶   |
|  4   | 社恐人士的 AIGC 模擬社交演練教練             | 虛擬社交場景模擬，LLM 扮演不同角色；社交技巧建議            |
|  5   | 生成式 AI 兒童睡前故事定製機                 | 家長輸入主題和偏好，LLM 生成定製故事；背景音樂生成          |
|  6   | 逝者數字生命復原與 LLM 跨時空對話系統        | 生前資料（語音、文字）訓練個性化模型；記憶對話生成          |
|  7   | 基於 MBTI 資料的 AI 性格映象與共情聊天機器人 | MBTI 測試結果輸入，LLM 生成性格分析和共情回覆；性格匹配推薦 |
|  8   | 全天候心情監測與 AI 正向情緒激勵助手         | 日常記錄心情狀態，LLM 分析趨勢並生成激勵內容；正向提醒推送  |
|  9   | 隱私保護級青少年 AI 傾訴樹洞                 | 匿名傾訴入口，LLM 提供傾聽和建議；敏感詞預警                |
|  10  | 具備自主進化能力的 AI 虛擬寵物養成系統       | 寵物性格模型訓練，對話互動成長進化；虛擬裝扮系統            |

## 14. 休閒娛樂

休閒娛樂場景致力於提供豐富的數字化娛樂體驗。常見應用包括遊戲 NPC 智慧決策、劇本殺輔助、內容創作、音影片處理等，滿足使用者的多元化娛樂需求。

| 序號 | 應用場景名稱                                 | 實現參考                                                  |
| :--: | -------------------------------------------- | --------------------------------------------------------- |
|  1   | 基於 LLM 驅動的開放世界遊戲 NPC 自主決策引擎 | NPC 行為樹融合 LLM 決策，對話系統生成個性化互動；行為引擎 |
|  2   | 沉浸式劇本殺 AIGC 劇情推演與 DM 控場輔助工具 | 玩家選擇觸發劇情分支，LLM 生成推理邏輯；線索卡自動生成    |
|  3   | 互動小說結局生成式修改器                     | 讀者選擇影響劇情走向，LLM 生成多種結局分支                |
|  4   | 二次元角色 3D 建模 AIGC 自動生成工作臺       | 描述文字生成角色草圖，3D 建模工具自動建模；材質貼圖渲染   |
|  5   | 電競戰局 CV 視覺分析與 AI 智慧解說員         | 遊戲畫面實時分析，關鍵時刻識別；LLM 生成解說文案          |
|  6   | 個性化幽默內容推薦演算法引擎                   | 使用者興趣畫像，幽默內容匹配推薦                            |
|  7   | AI 智慧修音與 KTV 人聲美化軟體               | 音訊降噪和人聲增強處理；AI 修音演算法                       |
|  8   | 影視劇角色專屬劇情 AI 提取與剪輯工具         | 影片內容分析，角色相關片段提取；自動剪輯生成              |
|  9   | 多角色 TTS 語音合成有聲書自動生成系統        | 文字角色分配，個性化音色生成；背景音樂和音效新增          |
|  10  | 棋牌類遊戲強化學習對弈覆盤教練               | 棋局分析，AI 對手模擬對弈；覆盤建議生成                   |

## 15. 電商服務

電商服務場景聚焦於運營效率和轉化提升。核心應用包括商品內容生成、直播帶貨、客戶服務、價格分析等，幫助商家實現智慧化運營。

| 序號 | 應用場景名稱                                  | 實現參考                                                   |
| :--: | --------------------------------------------- | ---------------------------------------------------------- |
|  1   | 高轉化率 AIGC 商品詳情頁批次生產工具          | 商品資訊輸入，LLM 生成賣點文案和場景描述；背景圖生成       |
|  2   | 服裝虛擬模特 AI 智慧試穿與展示影片生成工廠    | 服裝平鋪圖處理，虛擬模特試穿效果生成；多角度展示影片       |
|  3   | 跨境電商多語言 LLM 本地化翻譯與潤色助手       | 商品描述多語言翻譯，文化適配潤色；多平臺釋出介面           |
|  4   | 基於 NLP 的客戶情感分析與智慧回覆機器人       | 諮詢對話情感分析，自動生成安撫回覆；好評差評分類           |
|  5   | 24 小時全天候 AIGC 數字人直播帶貨系統         | 數字人形象 + 實時話術生成，商品資訊實時呼叫；彈幕互動回覆  |
|  6   | 全網同款商品 AI 比價與趨勢預測外掛            | 電商平臺價格爬取，比價圖表展示；價格趨勢預測               |
|  7   | 買家秀圖片 AI 智慧篩選與短影片合成平臺        | 買家秀圖片質量評分，優質內容自動推薦；短影片模板合成       |
|  8   | 基於 LLM 的實時銷售對話語音分析與金牌話術推薦 | 通話 ASR 轉寫，實時話術合規檢測；話術推薦                  |
|  9   | 市場流行趨勢 AI 洞察與爆款預測引擎            | 社交媒體和電商資料採集分析，LLM 洞察趨勢熱點；選品建議推薦 |
|  10  | 私域流量使用者畫像 AI 聚類與精細化運營系統      | 使用者行為資料聚類分析，畫像標籤生成；自動化營銷觸發         |

## 16. 能源

能源場景致力於實現能源行業的智慧化管理和綠色轉型。典型應用包括用電分析、裝置檢測、碳排放核算、排程最佳化等，推動能源系統的高效執行。

| 序號 | 應用場景名稱                                     | 實現參考                                               |
| :--: | ------------------------------------------------ | ------------------------------------------------------ |
|  1   | 家庭用電行為 AI 分析與節能策略顧問               | 智慧電錶資料採集，用電模式分析；LLM 生成節能建議       |
|  2   | 光伏元件缺陷無人機 CV 視覺識別系統               | 無人機巡檢拍攝，熱紅外影象分析；缺陷檢測標註           |
|  3   | 電力現貨交易價格 AI 趨勢預測與自動獲利策略 Agent | 電力市場資料採集，價格預測模型；策略生成和交易執行     |
|  4   | 儲能電池健康度 AI 無損檢測與熱失控風險預警系統   | 電池執行資料監測，健康度評估模型；風險預警推送         |
|  5   | 企業全鏈路碳排放 AI 自動核算與 ESG 報告生成助手  | 能源消耗資料採集，碳排放因子計算；ESG 報告自動生成     |
|  6   | 電網極端天氣負荷 AI 預測與應急排程指揮系統       | 氣象資料對接，負荷預測模型；排程策略生成               |
|  7   | 加油站違規行為 AI 影片識別與報警衛士             | 影片監控分析，違規行為檢測（打電話、抽菸等）；告警推送 |
|  8   | 長輸油氣管道洩漏聲波 AI 監測與精準定位系統       | 聲波感測器資料採集，洩漏檢測模型；定位演算法計算         |
|  9   | 虛擬電廠資源聚合與 AI 電力交易決策系統           | 分散式資源接入，聚合最佳化排程；交易策略執行             |
|  10  | 礦井人員位置 AI 追蹤與危險區域入侵報警           | UWB/藍芽定位，人員軌跡追蹤；危險區域電子圍欄           |

## 17. 音影片

音影片場景聚焦於內容生產和媒體處理。常見應用包括影片剪輯、語音合成、字幕生成、影片修復等，提升音影片內容的生產效率和質量。

| 序號 | 應用場景名稱                                 | 實現參考                                           |
| :--: | -------------------------------------------- | -------------------------------------------------- |
|  1   | 長影片精彩片段 AI 識別與短影片自動剪輯工具   | 影片內容分析，關鍵幀識別；精彩片段自動剪輯         |
|  2   | 影片背景噪音 AI 智慧分離與人聲增強助手       | 音訊分離模型，去除背景噪音；人聲增強處理           |
|  3   | 老舊影像 4K 超分修復與 AI 智慧上色工作臺     | 影片超解析度模型，修復老舊畫質；AI 自動上色        |
|  4   | 文字轉真人級 TTS 配音與情感控制系統          | 多音色 TTS 模型，情感控制生成；音訊匯出            |
|  5   | 影片語音 ASR 自動識別與雙語字幕生成工具      | 語音識別生成字幕，多語言翻譯；雙語字幕疊加         |
|  6   | 影片畫面多餘物體 AI 智慧擦除引擎             | 影片目標追蹤，物體移除修復；幀間一致性處理         |
|  7   | 無版權背景音樂 AIGC 自動作曲機               | 音樂生成模型，情緒風格可控；版權檢測               |
|  8   | 特定人物音色 AI 克隆與變聲轉換軟體           | 少量語音樣本訓練音色模型；變聲處理                 |
|  9   | 劇本一鍵轉分鏡指令碼與 AI 動態預演影片生成平臺 | 劇本解析生成分鏡，AI 生成預演影片                  |
|  10  | 會議錄音 AI 智慧轉寫與核心待辦提取助手       | 多人會議語音分離轉寫，LLM 提取待辦事項；時間戳標註 |

## 18. AI 營銷

AI 營銷場景致力於提升營銷效率和創意產出。核心應用包括文案生成、海報設計、熱點追蹤、競品分析等，幫助企業實現精準營銷和品牌傳播。

| 序號 | 應用場景名稱                               | 實現參考                                         |
| :--: | ------------------------------------------ | ------------------------------------------------ |
|  1   | 小紅書爆款文案 AIGC 自動撰寫引擎           | 話題輸入，LLM 生成種草文案；emoji 和話題標籤最佳化 |
|  2   | 營銷海報 AI 智慧排版與多尺寸適配工具       | 文案輸入，海報模板智慧匹配與多尺寸匯出           |
|  3   | 品牌 LOGO 創意 AIGC 生成與 VI 體系構建平臺 | 品牌關鍵詞輸入，LOGO 創意生成；VI 規範生成       |
|  4   | 全網熱點 AI 追蹤與借勢營銷創意生成助手     | 熱點資料採集，LLM 分析營銷角度；創意方案生成     |
|  5   | 廣告投放 ROI 實時監控與 AI 預算競價管家    | 廣告平臺資料對接，效果分析模型；競價策略最佳化     |
|  6   | 競品營銷策略深度解析與 AI 週報生成器       | 競品內容採集分析，策略提取；週報自動生成         |
|  7   | 搜尋引擎關鍵詞 AI 佈局與引流文章批次寫作   | 關鍵詞分析，文章批次生成；SEO 最佳化建議           |
|  8   | 千人千面個性化營銷郵件 AI 撰寫專家         | 使用者畫像資料，個性化內容生成；A/B 測試           |
|  9   | 品牌聲譽全網監測與輿情危機 AI 預警雷達     | 全網輿情資料採集，情感分析；危機預警推送         |
|  10  | 短影片指令碼創意 AIGC 生成與分鏡指導助手     | 主題輸入，指令碼和分鏡生成；拍攝建議指導           |

## 19. 資料智慧

資料智慧場景聚焦於資料分析和價值挖掘。典型應用包括自然語言查詢、視覺化生成、資料治理、知識圖譜構建等，幫助企業實現資料驅動的決策支援。

| 序號 | 應用場景名稱                           | 實現參考                                                     |
| :--: | -------------------------------------- | ------------------------------------------------------------ |
|  1   | 基於 Text-to-SQL 的自然語言查數引擎    | 自然語言轉換為 SQL 查詢，結果視覺化展示                      |
|  2   | 對話式 BI：一句話生成視覺化圖表        | 資料需求描述，圖表自動生成；支援多圖表型別切換               |
|  3   | 截圖一鍵轉 Excel 表格識別工具          | 截圖上傳後，VLM 識別表格結構和資料；匯出為 Excel 檔案        |
|  4   | 圖片及截圖轉 Excel 表格 AI 識別神器    | 圖片 OCR 識別表格結構，資料匯出為 Excel                      |
|  5   | 多源異構資料知識圖譜自動化構建         | 多資料來源接入，實體和關係抽取；圖資料庫儲存                   |
|  6   | 資料包表智慧解讀與趨勢分析助手         | 上傳資料包表圖片或輸入資料，VLM 解讀圖表內容並分析趨勢       |
|  7   | 資料庫表結構智慧解讀與查詢示例生成助手 | 輸入表名或欄位描述，LLM 生成建表說明和示例查詢 SQL           |
|  8   | 企業主資料智慧對齊與 AI 去重治理       | 多源主資料匹配，重複記錄識別；合併規則配置                   |
|  9   | 資料需求文件智慧轉測試用例工具         | 輸入資料需求描述，LLM 生成測試場景和驗證用例                 |
|  10  | 資料指標口徑智慧問答助手               | 基於指標定義文件構建知識庫，LLM 解答指標口徑、計算邏輯等問題 |

</TabItem>
<TabItem label="C 端消費靈感">

## 章節導讀

<ChapterIntroduction :duration="cDuration" :tags="['C 端應用', '生活方式', '情感體驗', '氛圍營造']" coreOutput="發現 15+ 生活場景靈感" expectedOutput="找到打動使用者的產品方向">

本文件彙總了 <strong>LLM 大模型在 C 端消費場景中的創意應用方向</strong>。與 B 端關注效率和痛點不同，C 端產品更注重<strong>營造感覺、心理暗示和氛圍</strong>，讓使用者在使用過程中獲得情感共鳴和美好體驗。

</ChapterIntroduction>

## 場景氛圍快速選擇

<el-card shadow="hover" style="margin-top: 16px; margin-bottom: 24px; border-left: 5px solid #ec4899;">
  <div style="font-weight: 600; margin-bottom: 8px;">找到觸動你的場景靈感</div>
  <div style="color: #606266; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
    選擇你想要的氛圍和當下的感覺，系統會推薦相關的場景方向，點選標籤即可跳轉到對應章節。
  </div>
  <el-row :gutter="16">
    <el-col :span="12">
      <el-select v-model="vibePoint" placeholder="選擇氛圍型別" style="width: 100%;">
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
      <el-select v-model="feeling" placeholder="選擇當下感覺" style="width: 100%;">
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
      為你推薦的 {{ cCurrentSelection.vibe }} × {{ cCurrentSelection.feeling }} 場景：
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
      重新選擇
    </el-button>
  </div>
</el-card>

---

## 1. 生活方式

> 💡 **核心理念**：讓平凡的日常變得有儀式感，在細節中創造美好

| 序號 | 應用場景名稱 | 應用場景功能 |
| :--: | ------------ | ------------ |
| 1 | 晨間儀式感喚醒助手 | 整合天氣 API、日曆資料，LLM 生成個性化晨間方案；配合智慧音響播放定製音樂，智慧燈光漸亮 |
| 2 | 獨居生活氛圍營造師 | 接入智慧家居裝置（燈光、音響、香薰機），LLM 根據時間/心情自動調節引數；學習使用者偏好持續最佳化 |
| 3 | 週末宅家治癒計劃生成器 | 對接流媒體平臺 API 獲取片單，結合使用者歷史偏好生成電影+美食+佈置的組合方案 |
| 4 | 睡前心靈安撫電臺 | TTS 語音合成生成溫柔故事，白噪音混合演算法，智慧音量漸弱；根據睡眠資料調整內容 |
| 5 | 生活美學靈感捕手 | 影象識別分析使用者環境照片，LLM 生成美學建議；Pinterest/小紅書風格內容推薦 |

---

## 2. 情感陪伴

> 💡 **核心理念**：無條件的接納和陪伴，成為情緒的溫柔容器

| 序號 | 應用場景名稱 | 應用場景功能 |
| :--: | ------------ | ------------ |
| 1 | 深夜樹洞傾聽者 | 端到端加密確保隱私，LLM 情感分析理解情緒，長期記憶儲存使用者故事，多輪對話持續陪伴 |
| 2 | 失戀療愈陪伴師 | 情感階段識別演算法，分階段提供不同支援（傾訴期→宣洩期→重建期）；心理學知識庫 RAG 檢索 |
| 3 | 焦慮緩解呼吸教練 | 生物感測器資料接入（心率/呼吸），實時監測焦慮水平；語音引導呼吸節奏，漸進式肌肉放鬆指導 |
| 4 | 自信心重建導師 | 積極心理學對話方塊架，記錄並反饋使用者的小成就；認知重構技術幫助改變負面自我對話 |
| 5 | 情緒日記智慧解讀 | 情緒識別 NLP 模型，時間序列分析發現情緒規律；視覺化情緒圖譜，預測性情緒預警 |

---

## 3. 娛樂休閒

> 💡 **核心理念**：創造沉浸式的體驗，讓娛樂成為心靈的棲息地

| 序號 | 應用場景名稱 | 應用場景功能 |
| :--: | ------------ | ------------ |
| 1 | 沉浸式劇本殺 DM | LLM 實時生成劇情分支，語音合成扮演 NPC，根據玩家反應動態調整難度和節奏；AR/VR 場景渲染 |
| 2 | 開放世界遊戲靈魂 NPC | 長期記憶資料庫儲存玩家互動歷史，LLM 生成個性化對話；情感計算讓 NPC 有真實情緒反應 |
| 3 | 個性化播客內容生成 | 根據使用者興趣圖譜生成專屬內容，TTS 克隆使用者喜歡的聲音；實時互動回答聽眾問題 |
| 4 | 虛擬演唱會氛圍組 | 虛擬形象渲染，實時彈幕互動，虛擬熒光棒/應援道具；空間音訊技術營造現場感 |
| 5 | 互動小說共創夥伴 | LLM 實時生成劇情，使用者選擇影響故事走向；多結局設計，角色關係動態發展 |

---

## 4. 個人成長

> 💡 **核心理念**：成長不是苦行，而是一場有趣的自我發現之旅

| 序號 | 應用場景名稱 | 應用場景功能 |
| :--: | ------------ | ------------ |
| 1 | 個人成長見證者 | 時間軸視覺化展示成長軌跡，里程碑自動標記；對比圖展示"過去的我"vs"現在的我" |
| 2 | 習慣養成遊戲化教練 | 遊戲化機制（經驗值、等級、徽章），社交排行榜，AI 教練角色扮演（如"冒險導師"） |
| 3 | 技能學習搭子匹配 | 基於興趣和學習目標的匹配演算法，學習小組社羣，互相監督打卡機制 |
| 4 | 每日小確幸發現者 | 影象識別發現生活中的美好瞬間， gratitude journal 引導，每週美好瞬間回顧 |
| 5 | 人生模擬體驗器 | 多分支劇情模擬不同選擇的結果，平行人生對比；決策後果的視覺化呈現 |

---

## 5. 社互動動

> 💡 **核心理念**：讓社交變得輕鬆自然，找到舒適的連線方式

| 序號 | 應用場景名稱 | 應用場景功能 |
| :--: | ------------ | ------------ |
| 1 | 破冰話題生成器 | 基於場合和參與者的智慧話題推薦，實時對話分析提供延續話題建議；尷尬時刻救場提示 |
| 2 | 朋友圈文案氛圍師 | 影象內容分析，LLM 生成多風格文案（文藝/幽默/深沉）；emoji 和排版智慧推薦 |
| 3 | 約會氛圍策劃師 | 基於雙方興趣的約會方案生成，餐廳/活動推薦，對話話題建議；實時天氣和交通提醒 |
| 4 | 遠端聚會氣氛擔當 | 線上遊戲庫，破冰活動生成器，話題輪盤；虛擬背景和濾鏡增強氛圍 |
| 5 | 社交能量管理助手 | 社交活動後的能量消耗評估，恢復建議（獨處活動推薦）；社交日曆智慧規劃 |

---

## 6. 創意表達

> 💡 **核心理念**：每個人都有創造力，只是需要被喚醒

| 序號 | 應用場景名稱 | 應用場景功能 |
| :--: | ------------ | ------------ |
| 1 | 靈感枯竭急救包 | 跨領域聯想演算法，隨機刺激詞生成，創意 prompt 庫；腦圖式靈感發散工具 |
| 2 | 個人風格探索嚮導 | 影象分析識別使用者現有風格，風格趨勢推薦，虛擬試衣/試妝；風格進化時間軸 |
| 3 | 手賬與日記美學顧問 | 排版模板推薦，配色方案生成，裝飾元素建議；手寫體識別和內容美化 |
| 4 | 攝影構圖氛圍指南 | 場景識別和構圖建議，濾鏡風格推薦，修圖引數智慧調整；攝影技巧學習路徑 |
| 5 | 音樂心情匹配師 | 音樂情感分析演算法，使用者心情識別，個性化歌單生成；音樂故事和背景介紹 |

---

## 7. 旅行探索

> 💡 **核心理念**：旅行不僅是看風景，更是感受不同的生活方式

| 序號 | 應用場景名稱 | 應用場景功能 |
| :--: | ------------ | ------------ |
| 1 | 城市漫步探索嚮導 | 本地達人內容聚合，小眾地點推薦，AR 導航指引；實時翻譯和語音講解 |
| 2 | 旅行心情日記生成 | 照片自動分類和精選，LLM 生成優美遊記，地理位置標記時間軸；一鍵生成旅行影片 |
| 3 | 獨自旅行陪伴助手 | 實時位置共享和安全提醒，當地緊急聯絡人，AI 導遊語音陪伴；獨行社羣交流 |
| 4 | 目的地氛圍預覽 | VR/360° 全景預覽，當地聲音和氣味模擬，文化背景介紹；虛擬"試住"體驗 |
| 5 | 旅行攝影氛圍指導 | 黃金時刻提醒，構圖輔助線，當地特色拍攝點推薦；後期調色風格建議 |

---

## 8. 身心健康

> 💡 **核心理念**：健康不是目標，而是一種溫柔的自我關愛

| 序號 | 應用場景名稱 | 應用場景功能 |
| :--: | ------------ | ------------ |
| 1 | 運動動力喚醒師 | 根據使用者狀態智慧推薦運動型別，微運動（5分鐘）選項，遊戲化運動挑戰；社交運動打卡 |
| 2 | 健康飲食靈感廚房 | 冰箱食材識別，個性化食譜推薦，營養搭配分析； step-by-step 烹飪指導 |
| 3 | 睡眠質量最佳化氛圍師 | 睡眠監測資料分析，睡前儀式生成，環境最佳化建議（溫度/溼度/光線）；智慧喚醒 |
| 4 | 身體感知引導師 | 身體掃描冥想引導，身體部位情緒關聯，身心連線練習；生物反饋視覺化 |
| 5 | 自我關愛提醒助手 | 工作強度監測，定期提醒休息，微關愛活動建議（喝水/伸展/深呼吸）；自我關愛記錄 |

---

## 9. 知識探索

> 💡 **核心理念**：學習是一場永無止境的冒險，好奇是最好的老師

| 序號 | 應用場景名稱 | 應用場景功能 |
| :--: | ------------ | ------------ |
| 1 | 知識探索遊戲化嚮導 | 知識點地圖視覺化，闖關式學習路徑，成就徽章系統；AI 導師角色扮演 |
| 2 | 語言學習情景夥伴 | LLM 扮演不同角色進行對話，發音糾正，文化背景介紹；沉浸式情景模擬 |
| 3 | 好奇心滿足助手 | 維基百科/知識圖譜接入，複雜概念通俗化解釋，相關知識推薦；好奇心記錄 |
| 4 | 讀書筆記靈感激發 | 書籍內容分析，觀點提取和關聯，思考角度推薦；讀書筆記模板和美化 |
| 5 | 知識分享氛圍營造 | 知識卡片自動生成，分享文案最佳化，視覺美化；社交分享資料反饋 |

---

## 10. 關係經營

> 💡 **核心理念**：好的關係需要用心經營，而用心不需要很複雜

| 序號 | 應用場景名稱 | 應用場景功能 |
| :--: | ------------ | ------------ |
| 1 | 親密關係溝通教練 | 情感表達模板生成，非暴力溝通技巧指導，衝突化解話術；關係健康度評估 |
| 2 | 家人關懷提醒助手 | 重要日期提醒（生日/紀念日），關懷話術建議，家庭活動推薦；家庭相簿生成 |
| 3 | 友誼維護氛圍師 | 朋友互動記錄，共同話題推薦，遠端聚會組織；友誼時間軸和回憶生成 |
| 4 | 表白與驚喜策劃師 | 個性化驚喜方案生成，禮物推薦，浪漫話術建議；執行時間表和提醒 |
| 5 | 衝突緩和氛圍引導 | 情緒降溫話術，換位思考引導，和解步驟建議；關係修復跟蹤 |

---

## 11. 寵物陪伴

> 💡 **核心理念**：寵物是家人，它們的陪伴值得被記錄和珍惜

| 序號 | 應用場景名稱 | 應用場景功能 |
| :--: | ------------ | ------------ |
| 1 | 寵物擬人化日記 | 寵物行為分析，第一人稱日記生成，照片自動配圖；寵物"朋友圈" |
| 2 | 寵物行為解讀師 | 寵物行為影片分析，健康預警，訓練建議；品種特性知識庫 |
| 3 | 寵物陪伴時光策劃 | 寵物活動推薦，DIY 玩具教程，寵物友好地點推薦；寵物社交匹配 |
| 4 | 寵物紀念故事生成 | 照片和影片精選，時間軸故事生成，音樂配搭；紀念冊/影片自動生成 |
| 5 | 新手鏟屎官安心指南 | 分階段養護指南，常見問題解答，緊急情況處理；新手社羣支援 |

---

## 12. 財務健康

> 💡 **核心理念**：財務自由不是目標，財務健康纔是

| 序號 | 應用場景名稱 | 應用場景功能 |
| :--: | ------------ | ------------ |
| 1 | 消費情緒覺察助手 | 消費記錄分析，情緒-消費關聯分析，衝動消費預警；替代性滿足建議 |
| 2 | 儲蓄目標視覺化激勵 | 目標進度視覺化，夢想場景渲染，里程碑慶祝；儲蓄習慣養成遊戲 |
| 3 | 理財知識輕鬆學 | 碎片化知識推送，場景化案例教學，互動問答；知識檢測和證書 |
| 4 | 財務焦慮舒緩師 | 財務狀況健康評估，壓力管理技巧，小步行動計劃；財務心理諮詢 |
| 5 | 小額投資體驗遊戲 | 虛擬投資模擬，風險教育，投資組合遊戲；真實小額投資引導 |

---

## 13. 職業發展

> 💡 **核心理念**：職業不是軌道，而是可以探索的曠野

| 序號 | 應用場景名稱 | 應用場景功能 |
| :--: | ------------ | ------------ |
| 1 | 職業迷茫陪伴者 | 職業興趣測評，能力盤點，行業資訊推薦；職業導師對話 |
| 2 | 工作成就感喚醒師 | 工作成果記錄，價值提煉，成就視覺化；同事/客戶正向反饋收集 |
| 3 | 職場社交氛圍助手 | 職場話題推薦， networking 技巧，行業活動推薦；LinkedIn 內容最佳化 |
| 4 | 副業靈感激發器 | 技能-興趣-市場需求匹配，副業案例庫，啟動指南；副業社羣交流 |
| 5 | 面試前信心加油站 | 模擬面試，常見問題準備，自信提升技巧；形象建議 |

---

## 14. 居家空間

> 💡 **核心理念**：家不只是居住的地方，更是心靈的棲息地

| 序號 | 應用場景名稱 | 應用場景功能 |
| :--: | ------------ | ------------ |
| 1 | 居家空間氛圍設計師 | 空間照片分析，風格推薦，傢俱/裝飾推薦；AR 預覽效果 |
| 2 | 四季家居變換指南 | 季節主題推薦，收納和展示建議，節日裝飾方案；購物清單生成 |
| 3 | 小戶型空間魔法 | 空間最佳化演算法，多功能傢俱推薦，收納技巧；視覺擴容技巧 |
| 4 | 居家儀式感創造者 | 日常儀式設計（晨間/晚間/週末），儀式執行提醒；儀式效果反饋 |
| 5 | 斷舍離心理陪伴 | 物品情感價值評估，斷舍離步驟指導，心理支援；捐贈/回收渠道推薦 |

---

## 15. 美食料理

> 💡 **核心理念**：食物是愛的語言，烹飪是表達愛的方式

| 序號 | 應用場景名稱 | 應用場景功能 |
| :--: | ------------ | ------------ |
| 1 | 一人食治癒料理 | 冰箱食材識別，簡單食譜推薦， step-by-step 指導；一人食擺盤美學 |
| 2 | 節日餐桌氛圍設計 | 節日主題選單，餐桌布置方案，氛圍營造技巧；賓客體驗最佳化 |
| 3 | 料理心情匹配師 | 心情-食物關聯演算法，情緒調節食譜， comfort food 推薦；烹飪療愈引導 |
| 4 | 廚房小白信心建立 | 超簡單食譜，失敗挽救技巧，信心建設話術；漸進式難度提升 |
| 5 | 美食攝影氛圍指南 | 食物擺盤建議，自然光利用，拍攝角度指導；濾鏡和後期建議 |

---

## 16. 穿搭風格

> 💡 **核心理念**：穿搭是自我表達，風格是內在的外顯

| 序號 | 應用場景名稱 | 應用場景功能 |
| :--: | ------------ | ------------ |
| 1 | 今日穿搭心情板 | 天氣/場合/心情綜合推薦，虛擬試衣，搭配靈感；衣櫥管理 |
| 2 | 膠囊衣櫥搭配師 | 衣櫥盤點，單品搭配組合，一衣多穿方案；購物建議（填補空缺） |
| 3 | 個人風格探索之旅 | 風格測試，參考 icon 推薦，風格進化路徑；自信建設 |
| 4 | 舊衣新穿創意師 | 舊衣改造靈感，新搭配方式，配飾點綴技巧；可持續時尚理念 |
| 5 | 特殊場合造型顧問 | 場合 dress code 解讀，造型方案生成，妝容髮型建議；整體造型協調 |

---

## 設計 C 端產品的核心心法

### 1. 從"功能"到"感受"

B 端產品關注"這個功能能解決什麼問題"，C 端產品關注"這個功能能帶來什麼感覺"。

| B 端思維 | C 端思維 |
|---------|---------|
| 提高效率 | 節省時間去做喜歡的事 |
| 降低成本 | 讓每一分錢花得值得 |
| 解決痛點 | 創造美好體驗 |
| 功能完備 | 感覺到位 |

### 2. 營造氛圍的三個層次

**感官層**：視覺、聽覺、觸覺的設計
- 溫暖的顏色
- 舒緩的聲音
- 流暢的動效

**情感層**：情緒的共鳴和引導
- 理解使用者的心情
- 提供情感支援
- 創造正向情緒

**意義層**：價值的認同和歸屬
- 讓使用者感到被理解
- 創造歸屬感
- 賦予行動意義

### 3. 心理暗示的力量

C 端產品的文案和設計都在傳遞心理暗示：

- **正向暗示**："你已經做得很好了"、"慢慢來，沒關係"
- **歸屬暗示**："很多人和你一樣"、"你並不孤單"
- **成長暗示**："每一次嘗試都是進步"、"你在變得更好"

### 4. 讓使用者成為更好的自己

最好的 C 端產品不是改變使用者，而是幫助使用者成為他們想成為的自己。

- 不是"你應該..."，而是"你可以..."
- 不是"你必須..."，而是"如果你想要..."
- 不是"你還不夠..."，而是"你已經..."

---

> 🌟 **記住**：C 端使用者買的不是功能，是感覺；不是工具，是陪伴；不是服務，是理解。

</TabItem>
</Tabs>
