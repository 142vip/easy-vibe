---
title: 'AI 애플리케이션 시나리오 참고 (B2B & B2C)'
description: '이 문서는 LLM 대형 모델의 B2B 기업 시나리오와 B2C 소비 시나리오에서의 적용 방향을 정리합니다. B2B는 제조, 지능형 고객지원, 교육, 의료, 금융 등 19개 산업의 실제 적용 사례를 다루며, B2C는 라이프스타일, 감정적 동행, 엔터테인먼트, 개인 성장 등 16개 소비 시나리오의 영감을 포함하여 AI 앱 개발자에게 포괄적인 참고 자료를 제공합니다.'
---

<script setup>
import { computed, ref } from 'vue'

const duration = '약 <strong>6시간</strong>'

const interestPoint = ref('')
const purpose = ref('')

// 각 업계의 주제 풀
const topicPool = {
  'manufacturing': [
    { title: '신에너지 버스 외관 AI 보조 설계 플랫폼', desc: '이미지 생성 모델을 바탕으로 외관 콘셉트 설계를 수행합니다' },
    { title: '지능형 도면 설계와 검토 도우미', desc: 'RAG 기술로 기업 설계 규범 지식베이스를 구축합니다' },
    { title: '기술 문서 자동 생성과 관리', desc: 'LLM 기반으로 제품 사양서와 조작 매뉴얼을 자동 생성합니다' },
    { title: '생산 설비 점검 보고서 자동 생성 도우미', desc: '음성으로 설비 상태를 설명하면 구조화된 점검 보고서를 생성합니다' },
    { title: '산업 설비 고장 진단 지식 질의응답 도우미', desc: '과거 고장 사례를 바탕으로 벡터 지식베이스를 구축합니다' }
  ],
  'customer-service': [
    { title: '다채널 지능형 고객지원 자동 답변과 티켓 생성 시스템', desc: '여러 채널 메시지를 연결하고 LLM이 의도를 이해한 뒤 답변을 생성합니다' },
    { title: '잠재 고객 발굴과 후속 제안 도우미', desc: '과거 대화 기록을 분석해 구매 의향이 높은 고객을 식별합니다' },
    { title: '기업 내부 지식 지능형 검색과 질의응답 매니저', desc: '내부 문서를 바탕으로 벡터 지식베이스를 구축합니다' },
    { title: '고객지원 대화 지능형 요약과 티켓 생성 도구', desc: '대화 요약을 자동 생성하고 핵심 정보를 추출합니다' },
    { title: '고객지원 우수 화법 추천 지식베이스 시스템', desc: '우수 사례를 분석해 베스트 화법 템플릿을 정제합니다' }
  ],
  'education': [
    { title: '개인화 언어 학습 경로 계획과 지능형 학습 안내 시스템', desc: '학습자 수준을 평가하고 매일의 학습 작업을 계획합니다' },
    { title: '수업안 자동 작성과 교육 자료 추천 플랫폼', desc: '교과 과정 개요에 따라 수업안 프레임워크를 생성합니다' },
    { title: '과제 자동 채점과 학습 상태 진단 분석 시스템', desc: '서술형 문제를 자동 채점하고 채점 제안을 생성합니다' },
    { title: '인재 직무 역량 모델 구축과 학습 지도', desc: '직무 설명을 분석해 역량 요구를 추출합니다' },
    { title: '외국어 말하기 일대일 상황형 실전 연습', desc: 'LLM이 서로 다른 역할을 맡아 말하기 대화를 진행합니다' }
  ],
  'programming': [
    { title: '지능형 코드 완성과 버그 자동 수정 도우미', desc: 'IDE 플러그인이 실시간으로 코드 완성 제안을 제공합니다' },
    { title: '로우코드 앱 구축과 프로세스 자동화 플랫폼', desc: '자연어 요구 설명을 로우코드 설정으로 변환합니다' },
    { title: '단위 테스트 케이스 생성 시스템', desc: 'AST로 소스 코드를 파싱해 경계 조건 테스트 케이스를 생성합니다' },
    { title: '코드 지능형 분석과 언어 마이그레이션 도구', desc: '코드 품질을 분석하고 최적화 제안을 제공합니다' },
    { title: '프론트엔드 인터페이스(UI) 코드 자동 생성 도구', desc: '디자인 시안 이미지를 인식해 반응형 CSS를 생성합니다' }
  ],
  'healthcare': [
    { title: '의학 검사 보고서 지능형 해석 도우미', desc: 'OCR로 핵심 지표를 인식하고 이상값을 해석합니다' },
    { title: '지식 검색 기술 기반 건강 상담 전문가', desc: '의학 지식 그래프를 구축하고 RAG 검색으로 답변을 생성합니다' },
    { title: '임상 연구 데이터 의사결정 분석 플랫폼', desc: 'EMR 데이터를 통합하고 통계 분석 코드 생성을 보조합니다' },
    { title: '의학 영상 보고서 자동 생성 도구', desc: '영상 특징을 설명하면 구조화된 보고서를 자동 생성합니다' },
    { title: '만성질환 관리 복약 알림 지능형 도우미', desc: '개인화 복약 알림을 생성하고 복약 금기 검사를 지원합니다' }
  ],
  'security': [
    { title: '코드 보안 취약점 탐지와 수정 엔진', desc: 'SAST로 코드를 스캔하고 취약점 원리를 분석합니다' },
    { title: 'AI 생성형 피싱 메일 지능형 식별과 차단 시스템', desc: '메일 내용을 분석해 AI가 생성한 피싱 메일을 식별합니다' },
    { title: '보안 운영 일일 보고서 자동 생성 도우미', desc: '로그를 모아 핵심 이벤트를 자동 추출합니다' },
    { title: '침투 테스트 보고서 지능형 생성 도우미', desc: '취약점 설명에 따라 보고서를 자동 생성합니다' },
    { title: '위협 인텔리전스 지능형 조회와 분석 도우미', desc: '여러 출처의 위협 인텔리전스를 연결하고 내용을 해석합니다' }
  ],
  'finance': [
    { title: '신용 실사 보고서 지능형 생성 도우미', desc: '재무 데이터를 입력하면 신용 실사 보고서를 자동 생성합니다' },
    { title: '프라이빗 뱅킹 자산관리 지능형 고문', desc: '고객 위험 선호를 분석하고 자산 배분 제안을 생성합니다' },
    { title: 'IPO 투자설명서 지능형 생성과 컴플라이언스 검증 도우미', desc: '모듈형 템플릿으로 사업 설명을 자동 채웁니다' },
    { title: '기업 재무 보고서 자동 생성과 경영 이상 경고 시스템', desc: '재무 분석과 경영진 논의를 자동 생성합니다' },
    { title: '보험 설계사 지능형 화법 연습', desc: '모의 대화를 통해 화법의 규정 준수와 설득력을 평가합니다' }
  ],
  'enterprise': [
    { title: '기업 계약 전 생명주기 컴플라이언스 검토와 수정 제안 플랫폼', desc: '조항을 법규 라이브러리와 비교해 컴플라이언스 검토 보고서를 생성합니다' },
    { title: '영업 대화 음성 전사와 화법 추천', desc: 'ASR로 전사하고 대화를 분석해 베스트 화법을 추천합니다' },
    { title: '마케팅 콘텐츠 지능형 생성과 디자인 시스템', desc: '마케팅 문안과 판매 포인트를 생성합니다' },
    { title: '경쟁사 광고 집행 분석 플랫폼', desc: '경쟁사 광고를 수집하고 집행 전략을 분석합니다' },
    { title: '전 웹 핫이슈 주제 지능형 분석과 콘텐츠 추천 시스템', desc: '핫이슈 추세를 분석하고 주제 각도를 추천합니다' }
  ],
  'content': [
    { title: '영상과 소설 콘텐츠 창작 보조 플랫폼', desc: '스토리 개요, 인물 설정, 대사 생성을 제공합니다' },
    { title: '기업 브랜드 스토리와 PR 기사 지능형 작성 도우미', desc: '브랜드 키워드를 입력하면 여러 스타일의 문안을 생성합니다' },
    { title: '가상 디지털 휴먼 라이브 상호작용과 송출 관리 시스템', desc: '디지털 휴먼 이미지 + TTS 음성 + LLM 대화를 결합합니다' },
    { title: '짧은 영상 스크립트 생성과 지능형 편집', desc: '짧은 영상 스크립트와 콘티를 생성합니다' },
    { title: '마케팅 콘텐츠 지능형 생성과 디자인 시스템', desc: '마케팅 문안과 판매 포인트를 생성합니다' }
  ],
  'government': [
    { title: '12345 공공 민원 핫라인 지능형 음성 안내와 자동 배정 시스템', desc: '음성 인식으로 요구를 이해하고 지능적으로 배정합니다' },
    { title: '공공 서비스 센터 지능형 안내와 정책 질의응답 봇', desc: '공공 행정 지식베이스 RAG 검색을 사용합니다' },
    { title: '기업 지원 정책 지능형 매칭과 정밀 푸시 플랫폼', desc: '기업 프로필과 적용 가능한 정책을 자동 매칭합니다' },
    { title: '행정 승인 자료 지능형 사전 검토와 컴플라이언스 검증 도우미', desc: 'OCR 인식과 핵심 정보 추출을 수행합니다' },
    { title: '도시 그리드 사건 지능형 식별과 dispatch 관리 플랫폼', desc: '사건 유형을 식별하고 배정합니다' }
  ],
  'legal': [
    { title: '계약 위험 구멍 원클릭 점검 Agent', desc: '위험 체크리스트와 대조해 잠재 문제를 식별합니다' },
    { title: '유사 사건 승소율 AI 지능형 평가 고문', desc: '사건 특징을 추출하고 유사 판례를 검색해 매칭합니다' },
    { title: '법규 변경 실시간 모니터링과 업무 영향 분석 레이더', desc: '변경 내용을 해석하고 업무 영향을 평가합니다' },
    { title: '변호사 내용증명 AIGC 자동 초안 도구', desc: '사실 진술을 입력하면 표준 변호사 서한을 생성합니다' },
    { title: '복잡한 법률 조항을 쉬운 말로 바꾸는 설명 플러그인', desc: '쉽게 이해할 수 있는 설명을 생성합니다' }
  ],
  'travel': [
    { title: 'AIGC 기반 게으른 여행 일정 생성기', desc: '매일의 여행 일정을 생성합니다' },
    { title: '전 웹 항공권 호텔 가격 추세 예측과 저가 자동 잠금 봇', desc: 'ML 모델로 가격 추세를 예측합니다' },
    { title: '비자 자료 지능형 사전 검토와 자동 양식 작성 보조 시스템', desc: 'OCR로 정보 완전성을 검사합니다' },
    { title: '해외여행 실시간 음성 번역과 메뉴 시각 번역 매니저', desc: '오프라인 음성 번역과 메뉴 이미지 OCR을 제공합니다' },
    { title: '여행 발자취 자동 여행기와 소셜 문안 생성 도우미', desc: '사진 정보를 추출해 여행기 문안을 생성합니다' }
  ],
  'emotion': [
    { title: 'LLM 대형 모델 기반 24시간 깊은 동행 가상 파트너', desc: '기억 시스템에 대화 기록을 저장합니다' },
    { title: '멀티모달 감정 인식과 심리 상담 AI 고문', desc: '음성 억양 분석 + 문자 감정 인식을 결합합니다' },
    { title: '알츠하이머 노인 AI 인지 훈련과 기억 깨우기 디지털 휴먼', desc: '인지 게임 훈련과 오래된 사진으로 기억을 불러옵니다' },
    { title: '사회불안인을 위한 AIGC 모의 소셜 연습 코치', desc: '가상 소셜 장면을 시뮬레이션합니다' },
    { title: '상시 기분 모니터링과 AI 긍정 감정 격려 도우미', desc: '기분 추세를 분석하고 격려 콘텐츠를 생성합니다' }
  ],
  'entertainment': [
    { title: 'LLM 구동 오픈월드 게임 NPC 자율 의사결정 엔진', desc: 'NPC 행동 트리와 LLM 의사결정을 융합합니다' },
    { title: '몰입형 추리 게임 AIGC 이야기 추론과 DM 진행 보조 도구', desc: '플레이어 선택이 이야기 분기를 트리거합니다' },
    { title: '인터랙티브 소설 결말 생성식 수정기', desc: '독자 선택이 이야기 방향에 영향을 줍니다' },
    { title: 'e스포츠 전황 CV 시각 분석과 AI 지능형 해설자', desc: '게임 화면을 실시간 분석합니다' },
    { title: '다중 역할 TTS 음성 합성 오디오북 자동 생성 시스템', desc: '텍스트 역할을 배분하고 개인화 음색을 생성합니다' }
  ],
  'ecommerce': [
    { title: '고전환율 AIGC 상품 상세 페이지 대량 생산 도구', desc: '판매 포인트 문안과 장면 설명을 생성합니다' },
    { title: '의류 가상 모델 AI 지능형 착용과 전시 영상 생성 공장', desc: '가상 모델 착용 효과를 생성합니다' },
    { title: '크로스보더 이커머스 다국어 LLM 현지화 번역과 윤문 도우미', desc: '상품 설명을 여러 언어로 번역합니다' },
    { title: '24시간 상시 AIGC 디지털 휴먼 라이브 커머스 시스템', desc: '디지털 휴먼 이미지 + 실시간 화법 생성을 결합합니다' },
    { title: '시장 유행 추세 AI 통찰과 히트 상품 예측 엔진', desc: '추세와 핫이슈를 통찰하고 상품 선정 제안을 제공합니다' }
  ],
  'energy': [
    { title: '가정 전력 사용 행동 AI 분석과 절전 전략 고문', desc: '전력 사용 패턴을 분석하고 절전 제안을 생성합니다' },
    { title: '태양광 모듈 결함 드론 CV 시각 식별 시스템', desc: '드론 점검 촬영과 열적외선 이미지 분석을 수행합니다' },
    { title: '전력 현물 거래 가격 AI 추세 예측과 자동 수익 전략 Agent', desc: '가격 예측 모델과 전략 생성을 제공합니다' },
    { title: '기업 전 링크 탄소 배출 AI 자동 산정과 ESG 보고서 생성 도우미', desc: '탄소 배출 계수를 계산하고 ESG 보고서를 생성합니다' },
    { title: '전력망 극단 기상 부하 AI 예측과 비상 dispatch 지휘 시스템', desc: '부하 예측 모델과 dispatch 전략을 생성합니다' }
  ],
  'av-media': [
    { title: '장편 영상 하이라이트 AI 식별과 짧은 영상 자동 편집 도구', desc: '영상 내용을 분석하고 키프레임을 식별합니다' },
    { title: '영상 배경 소음 AI 지능형 분리와 음성 강화 도우미', desc: '오디오 분리 모델로 배경 소음을 제거합니다' },
    { title: '오래된 영상 4K 초해상 복원과 AI 지능형 색 입히기 워크벤치', desc: '영상 초해상도 모델과 AI 자동 색 입히기를 사용합니다' },
    { title: '텍스트를 실제 사람 수준 TTS 더빙으로 바꾸는 감정 제어 시스템', desc: '다중 음색 TTS 모델과 감정 제어를 제공합니다' },
    { title: '회의 녹음 AI 지능형 전사와 핵심 할 일 추출 도우미', desc: '여러 사람 회의 음성을 분리 전사합니다' }
  ],
  'ai-marketing': [
    { title: 'Xiaohongshu 히트 문안 AIGC 자동 작성 엔진', desc: '추천형 문안을 생성하고 이모지를 최적화합니다' },
    { title: '마케팅 포스터 AI 지능형 레이아웃과 다중 사이즈 적응 도구', desc: '포스터 템플릿을 지능적으로 매칭합니다' },
    { title: '브랜드 LOGO 창의 AIGC 생성과 VI 체계 구축 플랫폼', desc: 'LOGO 아이디어를 생성하고 VI 규범을 생성합니다' },
    { title: '전 웹 핫이슈 AI 추적과 트렌드 활용 마케팅 아이디어 생성 도우미', desc: '마케팅 각도를 분석하고 창의 방안을 생성합니다' },
    { title: '짧은 영상 스크립트 아이디어 AIGC 생성과 콘티 지도 도우미', desc: '스크립트와 콘티를 생성하고 촬영 제안을 제공합니다' }
  ],
  'data-intelligence': [
    { title: '자연어를 SQL 문으로 자동 생성하는 도구', desc: '자연어 질의를 SQL로 변환합니다' },
    { title: '기업 데이터 자산 목록 지능형 점검과 분류 시스템', desc: '메타데이터를 수집하고 자동 분류합니다' },
    { title: '데이터 품질 이상 자동 탐지와 수정 제안 엔진', desc: '규칙 엔진 + ML 모델로 이상을 탐지합니다' },
    { title: '지능형 보고서 생성과 시각화 설정 도우미', desc: '대화형으로 보고서 설정을 생성합니다' },
    { title: '데이터 지표 정의 지능형 질의응답 도우미', desc: '지표 정의 문서를 바탕으로 지식베이스를 구축합니다' }
  ]
}

// 미리 정의한 추천 경로 매핑 테이블
const recommendationMap = {
  // 관심 지점: 창의 콘텐츠
  'creative-content': {
    'increase-efficiency': ['content', 'av-media', 'ai-marketing', 'entertainment'],
    'reduce-cost': ['content', 'ecommerce', 'ai-marketing'],
    'improve-experience': ['entertainment', 'emotion', 'travel', 'content'],
    'innovate-business': ['ai-marketing', 'content', 'av-media', 'entertainment']
  },
  // 관심 지점: 기술 서비스
  'tech-service': {
    'increase-efficiency': ['programming', 'enterprise', 'data-intelligence', 'customer-service'],
    'reduce-cost': ['programming', 'enterprise', 'manufacturing'],
    'improve-experience': ['customer-service', 'enterprise', 'programming'],
    'innovate-business': ['data-intelligence', 'programming', 'security', 'enterprise']
  },
  // 관심 지점: 데이터 지능
  'data-intel': {
    'increase-efficiency': ['data-intelligence', 'finance', 'enterprise', 'manufacturing'],
    'reduce-cost': ['data-intelligence', 'manufacturing', 'energy'],
    'improve-experience': ['data-intelligence', 'customer-service', 'ecommerce'],
    'innovate-business': ['data-intelligence', 'finance', 'security', 'ai-marketing']
  },
  // 관심 지점: 사용자 서비스
  'user-service': {
    'increase-efficiency': ['customer-service', 'ecommerce', 'travel', 'enterprise'],
    'reduce-cost': ['customer-service', 'ecommerce', 'enterprise'],
    'improve-experience': ['customer-service', 'emotion', 'travel', 'ecommerce', 'entertainment'],
    'innovate-business': ['ecommerce', 'travel', 'emotion', 'entertainment']
  },
  // 관심 지점: 업계 솔루션
  'industry-solution': {
    'increase-efficiency': ['manufacturing', 'healthcare', 'finance', 'government'],
    'reduce-cost': ['manufacturing', 'energy', 'enterprise', 'finance'],
    'improve-experience': ['healthcare', 'education', 'government', 'travel'],
    'innovate-business': ['finance', 'security', 'legal', 'healthcare', 'government']
  }
}

const interestOptions = [
  { label: '창의 콘텐츠 생성', value: 'creative-content', desc: '문안, 이미지, 영상 등 창의 콘텐츠' },
  { label: '기술 서비스 도구', value: 'tech-service', desc: '개발 도구, 자동화, 코드 보조' },
  { label: '데이터 지능 분석', value: 'data-intel', desc: '데이터 분석, 예측, 지능형 의사결정' },
  { label: '사용자 서비스 경험', value: 'user-service', desc: '고객지원, 마케팅, 사용자 경험' },
  { label: '업계 솔루션', value: 'industry-solution', desc: '특정 업계의 깊은 적용' }
]

const purposeOptions = [
  { label: '효율 향상', value: 'increase-efficiency', desc: '자동화, 프로세스 가속' },
  { label: '비용 절감', value: 'reduce-cost', desc: '인력 감소, 자원 최적화' },
  { label: '경험 개선', value: 'improve-experience', desc: '사용자 만족도, 서비스 품질' },
  { label: '비즈니스 혁신', value: 'innovate-business', desc: '새 제품, 새 모델' }
]

const industries = [
  { key: 'manufacturing', name: '산업 제조업', anchor: '#_1-산업-제조업' },
  { key: 'customer-service', name: '지능형 고객지원', anchor: '#_2-지능형-고객지원' },
  { key: 'education', name: '교육 업계', anchor: '#_3-교육-업계' },
  { key: 'programming', name: '지능형 프로그래밍', anchor: '#_4-지능형-프로그래밍' },
  { key: 'healthcare', name: '의료 방향', anchor: '#_5-의료-방향' },
  { key: 'security', name: '네트워크 보안', anchor: '#_6-네트워크-보안' },
  { key: 'finance', name: '금융 관리와 보험 은행업', anchor: '#_7-금융-관리와-보험-은행업' },
  { key: 'enterprise', name: '기업 서비스', anchor: '#_8-기업-서비스' },
  { key: 'content', name: '콘텐츠 생산과 운영', anchor: '#_9-콘텐츠-생산과-운영' },
  { key: 'government', name: '스마트 행정 관리', anchor: '#_10-스마트-행정-관리' },
  { key: 'legal', name: '법무와 계약 관리', anchor: '#_11-법무와-계약-관리' },
  { key: 'travel', name: '여행과 이동 서비스', anchor: '#_12-여행과-이동-서비스' },
  { key: 'emotion', name: '감정적 동행', anchor: '#_13-감정적-동행' },
  { key: 'entertainment', name: '휴식과 엔터테인먼트', anchor: '#_14-휴식과-엔터테인먼트' },
  { key: 'ecommerce', name: '이커머스 서비스', anchor: '#_15-이커머스-서비스' },
  { key: 'energy', name: '에너지', anchor: '#_16-에너지' },
  { key: 'av-media', name: '오디오와 비디오', anchor: '#_17-오디오와-비디오' },
  { key: 'ai-marketing', name: 'AI 마케팅', anchor: '#_18-ai-마케팅' },
  { key: 'data-intelligence', name: '데이터 지능', anchor: '#_19-데이터-지능' }
]

// 추천 결과 계산 - 주제 풀에서 무작위 추출
const recommendationTopics = computed(() => {
  if (!interestPoint.value || !purpose.value) return []
  
  const keys = recommendationMap[interestPoint.value]?.[purpose.value] || []
  const topics = []
  
  // 각 추천 업계에서 주제 1-2개를 무작위로 추출
  keys.forEach(key => {
    const industry = industries.find(item => item.key === key)
    const industryTopics = topicPool[key] || []
    
    if (industry && industryTopics.length > 0) {
      // 주제 1-2개를 무작위로 추출
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
  
  // 무작위 정렬 후 총개수 제한
  return topics.sort(() => Math.random() - 0.5).slice(0, 8)
})

// 현재 선택의 설명 가져오기
const currentSelection = computed(() => {
  const interest = interestOptions.find(i => i.value === interestPoint.value)
  const pur = purposeOptions.find(p => p.value === purpose.value)
  return {
    interest: interest?.label || '',
    purpose: pur?.label || ''
  }
})

const scrollToAnchor = (anchor) => {
  // DOM 업데이트 완료를 보장하기 위해 지연 스크롤
  setTimeout(() => {
    // ID로 찾기 시도(여러 형식 지원)
    let element = document.querySelector(anchor)
    
    // 찾지 못하면 다른 가능한 ID 형식 시도
    if (!element) {
      // 밑줄 접두사 제거 시도
      const altAnchor = anchor.replace('#_', '#')
      element = document.querySelector(altAnchor)
    }
    
    // 그래도 찾지 못하면 제목 텍스트로 찾기
    if (!element) {
      // 앵커에서 업계 이름 추출
      const anchorText = decodeURIComponent(anchor.replace('#', '').replace(/^_/, ''))
      const headings = document.querySelectorAll('h2, h3')
      
      for (let heading of headings) {
        const headingText = heading.textContent.trim()
        // 완전 일치 또는 포함 일치
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
      // 목표 문단 강조 표시
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
const cDuration = '약 <strong>4시간</strong>'

const vibePoint = ref('')
const feeling = ref('')

// 각 장면의 주제 풀 - 느낌, 분위기, 심리적 암시를 강조
const cTopicPool = {
  'lifestyle': [
    { title: '아침 의식감 깨우기 도우미', desc: '날씨, 일정, 기분에 따라 전용 아침 의식을 생성해 하루를 기분 좋게 시작하게 합니다' },
    { title: '혼자 사는 생활 분위기 연출가', desc: '혼자 사는 사람을 위해 조명, 음악, 향의 스마트 조합을 포함한 집 안 분위기 방안을 설계합니다' },
    { title: '주말 집콕 치유 계획 생성기', desc: '현재 기분에 따라 영화+간식+분위기 꾸미기의 완벽한 집콕 조합을 추천합니다' },
    { title: '잠들기 전 마음 위로 라디오', desc: '부드러운 이야기와 명상 안내를 생성해 잠들 때 함께하는 개인 라디오가 됩니다' },
    { title: '생활 미학 영감 포착기', desc: '일상의 작은 일에서 아름다움을 발견하고, 생활 미학 제안과 의식감 가이드를 생성합니다' }
  ],
  'emotion': [
    { title: '깊은 밤의 마음 구멍 청취자', desc: '24시간 온라인 감정 쓰레기통처럼, 판단 없이 모든 마음속 일을 받아들입니다' },
    { title: '이별 치유 동행자', desc: '이별의 저점에서 부드러운 동행, 치유 제안, 감정의 출구를 제공합니다' },
    { title: '불안 완화 호흡 코치', desc: '불안 감정을 감지하고 호흡 연습과 마음챙김 명상을 안내합니다' },
    { title: '자신감 재건 멘토', desc: '긍정적 대화와 심리적 암시를 통해 자기 인정과 가치감을 다시 세우도록 돕습니다' },
    { title: '감정 일기 지능형 해석', desc: '감정 일기를 분석해 감정 패턴을 발견하고 따뜻한 통찰과 제안을 제공합니다' }
  ],
  'entertainment': [
    { title: '몰입형 추리 게임 DM', desc: '추리 게임 진행자 역할을 맡아 미스터리 분위기를 만들고 이야기 전개를 밀어 줍니다' },
    { title: '오픈월드 게임의 영혼 있는 NPC', desc: '살아 있는 듯한 NPC가 플레이어의 이야기를 기억하고 진짜 감정적 유대를 만듭니다' },
    { title: '개인화 팟캐스트 콘텐츠 생성', desc: '관심사에 따라 전용 팟캐스트를 생성해 친구와 대화하듯 자연스럽게 들려줍니다' },
    { title: '가상 콘서트 분위기 팀', desc: '온라인 콘서트에 현장감을 만들고, 실시간 상호작용, 응원, 분위기 연출을 제공합니다' },
    { title: '인터랙티브 소설 공동 창작 파트너', desc: '독자와 함께 이야기를 만들며, 모든 선택이 세계의 방향에 영향을 줍니다' }
  ],
  'growth': [
    { title: '개인 성장 목격자', desc: '성장 궤적을 기록하고 중요한 지점에서 격려와 회고를 제공합니다' },
    { title: '습관 형성 게임화 코치', desc: '지루한 습관 형성을 재미있는 모험 게임으로 바꿉니다' },
    { title: '기술 학습 메이트 매칭', desc: '뜻이 맞는 학습 파트너를 찾아 서로 독려하고 진전을 나누게 합니다' },
    { title: '매일의 작은 행복 발견자', desc: '생활 속 작은 아름다움을 발견하도록 돕고 감사와 긍정의 태도를 기릅니다' },
    { title: '인생 시뮬레이션 체험기', desc: '서로 다른 인생 선택을 시뮬레이션해 평행 시공간의 다른 가능성을 경험하게 합니다' }
  ],
  'social': [
    { title: '아이스브레이킹 대화 주제 생성기', desc: '소셜 상황에서 재미있는 주제를 제공해 어색함을 풀고 거리를 좁힙니다' },
    { title: '친구 피드 문구 분위기 연출가', desc: '사진과 기분에 따라 감각 있는 친구 피드 문구를 생성합니다' },
    { title: '데이트 분위기 기획자', desc: '장소부터 대화 주제와 작은 놀라움까지, 데이트를 위한 완전한 분위기 방안을 설계합니다' },
    { title: '원격 모임 분위기 담당', desc: '온라인 모임에서 분위기를 띄우고 게임을 조직하며 상호작용을 안내합니다' },
    { title: '소셜 에너지 관리 도우미', desc: '내향적인 사람이 소셜 에너지를 관리하고 편안한 소셜 리듬을 찾도록 돕습니다' }
  ],
  'creative': [
    { title: '영감 고갈 응급 키트', desc: '창의적 병목에 있을 때 예상치 못한 영감의 불꽃을 제공합니다' },
    { title: '개인 스타일 탐색 가이드', desc: '옷차림부터 표현 방식까지 독특한 개인 스타일을 발견하도록 돕습니다' },
    { title: '다이어리와 일기 미학 컨설턴트', desc: '다이어리 레이아웃, 색 조합, 콘텐츠 아이디어에 대한 미학 제안을 제공합니다' },
    { title: '사진 구도 분위기 가이드', desc: '장면과 원하는 느낌에 따라 촬영과 보정 제안을 제공합니다' },
    { title: '음악 기분 매칭 전문가', desc: '현재 기분과 장면에 따라 완벽한 음악 조합을 추천합니다' }
  ],
  'travel': [
    { title: '도시 산책 탐색 가이드', desc: '현지인처럼 도시를 탐색하고 숨겨진 보물 같은 장소를 발견합니다' },
    { title: '여행 기분 일기 생성', desc: '여행 사진과 기분을 아름다운 여행기와 추억으로 바꿉니다' },
    { title: '혼자 여행 동행 도우미', desc: '혼자 여행하는 사람에게 동행감, 제안, 안전감을 제공합니다' },
    { title: '목적지 분위기 미리보기', desc: '출발 전 목적지 분위기를 몰입감 있게 경험하고 미리 상태에 들어가게 합니다' },
    { title: '여행 사진 분위기 지도', desc: '장면과 빛에 따라 이야기가 있는 여행 사진을 찍도록 안내합니다' }
  ],
  'health': [
    { title: '운동 동기 깨우기 코치', desc: '움직이기 싫을 때 딱 맞는 격려와 동기를 제공합니다' },
    { title: '건강 식단 영감 주방', desc: '기분과 식재료에 따라 치유감 있는 건강 레시피를 생성합니다' },
    { title: '수면 품질 최적화 분위기 연출가', desc: '환경부터 심리까지, 좋은 수면 분위기를 전방위로 만듭니다' },
    { title: '몸 감각 안내자', desc: '몸의 신호에 주의를 기울이고 몸과 마음의 연결을 세우도록 안내합니다' },
    { title: '자기 돌봄 알림 도우미', desc: '바쁜 중에도 잠시 멈춰 자신을 돌보라고 알려 줍니다' }
  ],
  'learning': [
    { title: '지식 탐색 게임화 가이드', desc: '지루한 지식 학습을 재미있는 탐험 모험으로 바꿉니다' },
    { title: '언어 학습 상황 파트너', desc: '서로 다른 역할을 맡아 상황 대화 속에서 자연스럽게 언어를 익히게 합니다' },
    { title: '호기심 충족 도우미', desc: '온갖 기발한 질문에 답하며 세계에 대한 호기심을 채워 줍니다' },
    { title: '독서 노트 영감 자극', desc: '독서 감상을 정리하고 새로운 사고 각도를 발견하도록 돕습니다' },
    { title: '지식 공유 분위기 조성', desc: '배운 지식을 재미있는 공유 콘텐츠로 바꿉니다' }
  ],
  'relationship': [
    { title: '친밀한 관계 소통 코치', desc: '말하기 어려운 감정을 표현하도록 돕고 친밀한 관계를 개선합니다' },
    { title: '가족 돌봄 알림 도우미', desc: '가족을 챙기도록 알려 주고 따뜻한 상호작용 제안을 제공합니다' },
    { title: '우정 유지 분위기 연출가', desc: '멀리 떨어진 우정을 유지하고 공통 대화 주제를 만듭니다' },
    { title: '고백과 서프라이즈 기획자', desc: '소중한 사람을 위해 잊기 어려운 놀라움과 로맨틱한 순간을 기획합니다' },
    { title: '갈등 완화 분위기 안내', desc: '관계가 긴장될 때 분위기를 누그러뜨리는 제안과 말투를 제공합니다' }
  ],
  'pet': [
    { title: '반려동물 의인화 일기', desc: '반려동물의 시점으로 일기를 생성해 보호자와의 따뜻한 일상을 기록합니다' },
    { title: '반려동물 행동 해석가', desc: '반려동물의 행동 언어를 해석해 반려동물과의 연결을 깊게 합니다' },
    { title: '반려동물 동행 시간 기획', desc: '반려동물과 상호작용하는 창의적 활동을 설계해 애정을 키웁니다' },
    { title: '반려동물 추억 이야기 생성', desc: '반려동물의 사진과 추억을 따뜻한 이야기로 바꿉니다' },
    { title: '초보 반려인 안심 가이드', desc: '초보 반려동물 보호자에게 따뜻한 동행과 안내를 제공합니다' }
  ],
  'finance': [
    { title: '소비 감정 알아차림 도우미', desc: '충동 소비 뒤의 감정을 알아차리고 건강한 소비관을 세웁니다' },
    { title: '저축 목표 시각화 동기부여', desc: '저축 목표를 눈에 보이는 꿈의 진척도로 바꿉니다' },
    { title: '재테크 지식 쉽게 배우기', desc: '가볍고 재미있는 방식으로 재테크 지식을 배웁니다' },
    { title: '재무 불안 완화 코치', desc: '재무 압박을 마주할 때 감정 지원과 실용적인 제안을 제공합니다' },
    { title: '소액 투자 체험 게임', desc: '게임화 방식으로 투자를 경험해 진입 문턱을 낮춥니다' }
  ],
  'career': [
    { title: '커리어 방황 동행자', desc: '커리어가 막막할 때 경청, 탐색, 방향 제안을 제공합니다' },
    { title: '일의 성취감 깨우기 코치', desc: '일 속의 가치와 의미를 발견하게 해 열정을 다시 살립니다' },
    { title: '직장 소셜 분위기 도우미', desc: '직장 소셜을 위한 가벼운 대화 주제와 상호작용 제안을 제공합니다' },
    { title: '사이드 프로젝트 영감 자극기', desc: '개인 관심사와 기술을 바탕으로 부업 아이디어를 자극합니다' },
    { title: '면접 전 자신감 충전소', desc: '면접 전에 심리적 준비와 자신감 격려를 제공합니다' }
  ],
  'home': [
    { title: '집 공간 분위기 디자이너', desc: '기분과 계절에 따라 집 안 분위기 방안을 설계합니다' },
    { title: '사계절 집 꾸미기 변화 가이드', desc: '계절 변화에 맞춰 집 배치를 바꾸어 신선함을 유지합니다' },
    { title: '작은 집 공간 마법', desc: '작은 공간도 편안하고 따뜻한 분위기를 갖게 합니다' },
    { title: '집 생활 의식감 창조자', desc: '일상의 집 활동에 의식감을 만듭니다' },
    { title: '정리와 비움 심리 동행', desc: '물건을 정리할 때 심리적 지원과 의사결정 제안을 제공합니다' }
  ],
  'food': [
    { title: '혼밥 치유 요리', desc: '혼자 사는 사람을 위해 간단하고 치유감 있는 요리 방안을 설계합니다' },
    { title: '명절 식탁 분위기 설계', desc: '특별한 날을 위해 의식감 있는 식탁 구성을 설계합니다' },
    { title: '요리 기분 매칭 전문가', desc: '현재 기분에 따라 어울리는 음식과 조리법을 추천합니다' },
    { title: '요리 초보 자신감 세우기', desc: '요리 입문자에게 따뜻한 격려와 간단한 레시피를 제공합니다' },
    { title: '음식 사진 분위기 가이드', desc: '집밥도 먹음직스러운 분위기로 찍을 수 있게 합니다' }
  ],
  'fashion': [
    { title: '오늘의 착장 무드보드', desc: '날씨, 상황, 기분에 따라 착장 영감을 생성합니다' },
    { title: '캡슐 옷장 코디 전문가', desc: '한정된 아이템으로 무한한 코디 가능성을 만듭니다' },
    { title: '개인 스타일 탐색 여행', desc: '독특한 개인 스타일을 발견하고 세우도록 돕습니다' },
    { title: '헌 옷 새롭게 입기 크리에이터', desc: '오래된 옷에 새로운 코디 영감을 제공합니다' },
    { title: '특별한 자리 스타일링 컨설턴트', desc: '중요한 자리에 자신감을 주는 스타일링을 설계합니다' }
  ]
}

// 미리 정의한 추천 경로 매핑 테이블 - 분위기와 느낌 기반
const cRecommendationMap = {
  // 분위기 지점: 치유 계열
  'healing': {
    'relax': ['emotion', 'lifestyle', 'health', 'home'],
    'inspire': ['creative', 'growth', 'learning', 'entertainment'],
    'connect': ['relationship', 'social', 'pet', 'emotion'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // 분위기 지점: 성장 계열
  'growth': {
    'relax': ['growth', 'learning', 'creative', 'health'],
    'inspire': ['career', 'learning', 'creative', 'growth'],
    'connect': ['social', 'relationship', 'career', 'learning'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // 분위기 지점: 소셜 계열
  'social': {
    'relax': ['social', 'pet', 'food', 'home'],
    'inspire': ['social', 'creative', 'entertainment', 'travel'],
    'connect': ['relationship', 'social', 'pet', 'travel'],
    'escape': ['social', 'travel', 'entertainment', 'creative']
  },
  // 분위기 지점: 탐색 계열
  'explore': {
    'relax': ['travel', 'creative', 'lifestyle', 'food'],
    'inspire': ['travel', 'creative', 'learning', 'entertainment'],
    'connect': ['travel', 'social', 'relationship', 'pet'],
    'escape': ['travel', 'entertainment', 'creative', 'lifestyle']
  },
  // 분위기 지점: 일상 계열
  'daily': {
    'relax': ['lifestyle', 'home', 'health', 'emotion'],
    'inspire': ['creative', 'food', 'fashion', 'home'],
    'connect': ['relationship', 'social', 'pet', 'lifestyle'],
    'escape': ['entertainment', 'creative', 'travel', 'lifestyle']
  }
}

const vibeOptions = [
  { label: '치유 계열', value: 'healing', desc: '따뜻함, 안정, 치유' },
  { label: '성장 계열', value: 'growth', desc: '진전, 돌파, 변화' },
  { label: '소셜 계열', value: 'social', desc: '연결, 공유, 상호작용' },
  { label: '탐색 계열', value: 'explore', desc: '호기심, 모험, 발견' },
  { label: '일상 계열', value: 'daily', desc: '평범함, 진실함, 지금 이 순간' }
]

const feelingOptions = [
  { label: '쉬고 싶다', value: 'relax', desc: '압박을 풀고 자신을 비우기' },
  { label: '영감을 찾고 싶다', value: 'inspire', desc: '창의성을 자극하고 깨달음 얻기' },
  { label: '연결을 갈망한다', value: 'connect', desc: '사람과 연결되고 감정적으로 공명하기' },
  { label: '잠시 벗어나고 싶다', value: 'escape', desc: '현실에서 벗어나 몰입 경험하기' }
]

const scenarios = [
  { key: 'lifestyle', name: '생활 방식', anchor: '#_1-생활-방식' },
  { key: 'emotion', name: '감정적 동행', anchor: '#_2-감정적-동행' },
  { key: 'entertainment', name: '엔터테인먼트와 휴식', anchor: '#_3-엔터테인먼트와-휴식' },
  { key: 'growth', name: '개인 성장', anchor: '#_4-개인-성장' },
  { key: 'social', name: '소셜 상호작용', anchor: '#_5-소셜-상호작용' },
  { key: 'creative', name: '창의적 표현', anchor: '#_6-창의적-표현' },
  { key: 'travel', name: '여행 탐색', anchor: '#_7-여행-탐색' },
  { key: 'health', name: '몸과 마음의 건강', anchor: '#_8-몸과-마음의-건강' },
  { key: 'learning', name: '지식 탐색', anchor: '#_9-지식-탐색' },
  { key: 'relationship', name: '관계 운영', anchor: '#_10-관계-운영' },
  { key: 'pet', name: '반려동물 동행', anchor: '#_11-반려동물-동행' },
  { key: 'finance', name: '재무 건강', anchor: '#_12-재무-건강' },
  { key: 'career', name: '커리어 발전', anchor: '#_13-커리어-발전' },
  { key: 'home', name: '집 공간', anchor: '#_14-집-공간' },
  { key: 'food', name: '음식과 요리', anchor: '#_15-음식과-요리' },
  { key: 'fashion', name: '착장과 스타일', anchor: '#_16-착장과-스타일' }
]

// 추천 결과 계산 - 주제 풀에서 무작위 추출
const cRecommendationTopics = computed(() => {
  if (!vibePoint.value || !feeling.value) return []
  
  const keys = cRecommendationMap[vibePoint.value]?.[feeling.value] || []
  const topics = []
  
  // 각 추천 장면에서 주제 1-2개를 무작위로 추출
  keys.forEach(key => {
    const scenario = scenarios.find(item => item.key === key)
    const scenarioTopics = cTopicPool[key] || []
    
    if (scenario && scenarioTopics.length > 0) {
      // 주제 1-2개를 무작위로 추출
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
  
  // 무작위로 정렬하고 총개수 제한
  return topics.sort(() => Math.random() - 0.5).slice(0, 8)
})

// 현재 선택의 설명 가져오기
const cCurrentSelection = computed(() => {
  const vibe = vibeOptions.find(i => i.value === vibePoint.value)
  const feel = feelingOptions.find(p => p.value === feeling.value)
  return {
    vibe: vibe?.label || '',
    feeling: feel?.label || ''
  }
})

const cScrollToAnchor = (anchor) => {
  // DOM 업데이트 완료를 보장하기 위해 지연 스크롤
  setTimeout(() => {
    // ID로 찾기 시도(여러 형식 지원)
    let element = document.querySelector(anchor)
    
    // 찾지 못하면 다른 가능한 ID 형식 시도
    if (!element) {
      // 밑줄 접두사 제거 시도
      const altAnchor = anchor.replace('#_', '#')
      element = document.querySelector(altAnchor)
    }
    
    // 그래도 찾지 못하면 제목 텍스트로 찾기
    if (!element) {
      // 앵커에서 장면 이름 추출
      const anchorText = decodeURIComponent(anchor.replace('#', '').replace(/^_/, ''))
      const headings = document.querySelectorAll('h2, h3')
      
      for (let heading of headings) {
        const headingText = heading.textContent.trim()
        // 완전 일치 또는 포함 일치
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
      // 목표 문단 강조 표시
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

# AI 애플리케이션 시나리오 참고 (B2B & B2C)

<Tabs>
<TabItem label="B2B 산업">

## 장 안내

<ChapterIntroduction :duration="duration" :tags="['B 사이드 앱', '산업 앱', 'AI 장면', '적용 참고', '업계 방안']" coreOutput="B 사이드 업계 앱 장면 15개 이상 이해" expectedOutput="기업 고객에 맞는 프로젝트 방향 찾기">

이 문서는 <strong>LLM 대형 모델이 B 사이드 기업 장면에서 실제로 적용되는 앱</strong>을 정리합니다. 사용자 경험과 감정에 관심을 두는 C 사이드와 달리, B 사이드 제품은 <strong>실제 비즈니스 요구 해결, 효율 향상, 비용 절감</strong>을 더 중시합니다. 각 장면은 모두 <strong>실제로 구현 가능한 가능성</strong>을 갖추고 있으며, <strong>요구 분석부터 기술 구현까지</strong>의 완전한 사고를 포함하므로, 기업 고객을 향한 AI 앱 개발자가 참고하기에 적합합니다.

</ChapterIntroduction>

## 업계 방향 빠른 선택

<el-card shadow="hover" style="margin-top: 16px; margin-bottom: 24px; border-left: 5px solid #409EFF;">
  <div style="font-weight: 600; margin-bottom: 8px;">당신에게 맞는 앱 장면 찾기</div>
  <div style="color: #606266; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
    관심 방향과 달성하고 싶은 목적을 선택하면, 시스템이 관련 업계 장면을 추천합니다. 태그를 클릭하면 해당 절로 이동합니다.
  </div>
  <el-row :gutter="16">
    <el-col :span="12">
      <el-select v-model="interestPoint" placeholder="관심 방향 선택" style="width: 100%;">
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
      <el-select v-model="purpose" placeholder="실현 목적 선택" style="width: 100%;">
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
  
  <!-- 추천 결과 표시 - 표 형식 -->
  <div v-if="recommendationTopics.length > 0" style="margin-top: 16px;">
    <div style="font-weight: 600; margin-bottom: 10px; color: #409EFF;">
      당신을 위해 앱 장면 {{ recommendationTopics.length }}개 추천
      <span style="font-weight: normal; color: #909399; font-size: 13px; margin-left: 8px;">
        ({{ currentSelection.interest }} + {{ currentSelection.purpose }})
      </span>
    </div>
    <el-table 
      :data="recommendationTopics" 
      style="width: 100%; cursor: pointer;"
      @row-click="(row) => scrollToAnchor(row.industryAnchor)"
      highlight-current-row>
      <el-table-column prop="title" label="앱 장면" min-width="300">
        <template #default="scope">
          <div style="font-weight: 500; color: #303133;">{{ scope.row.title }}</div>
          <div style="font-size: 12px; color: #909399; margin-top: 4px;">{{ scope.row.desc }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="industryName" label="소속 업계" width="180" align="center">
        <template #default="scope">
          <el-tag type="info" effect="light" size="small">{{ scope.row.industryName }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px; font-size: 12px; color: #909399;">
      💡 표의 아무 행이나 클릭하면 해당 업계 절로 이동합니다.
    </div>
  </div>
  
  <!-- 선택이 완료되지 않았을 때의 안내 -->
  <div v-else-if="!interestPoint || !purpose" style="margin-top: 14px; color: #909399; font-size: 13px;">
    <span v-if="!interestPoint && !purpose">💡 관심 방향과 실현 목적을 선택하세요</span>
    <span v-else-if="!interestPoint">💡 관심 방향을 선택하세요</span>
    <span v-else>💡 실현 목적을 선택하세요</span>
  </div>
  
  <!-- 초기화 버튼 -->
  <div v-if="interestPoint || purpose" style="margin-top: 12px;">
    <el-button size="small" @click="resetSelection">다시 선택</el-button>
  </div>
</el-card>

## 업계 빠른 소개

### 주요 기술 선택

AI 앱 개발에서 흔히 쓰는 기술 방향은 다음과 같습니다.

1. **LLM(대형 언어 모델)**: 대화, 텍스트 생성, 요약, 번역 같은 자연어 작업에 강하며, 지능형 고객지원, 콘텐츠 창작, 지식 질의응답 앱을 만들기에 적합합니다.
2. **VLM(시각 언어 모델)**: 시각 이해와 언어 능력을 결합해 이미지 설명, 시각 질의응답, 멀티모달 콘텐츠 생성 등을 구현할 수 있으며, 의료 영상 분석, 산업 품질 검사, 창의 설계 같은 장면에 적합합니다.
3. **GenAI(생성형 AI)**: 텍스트 생성, 이미지 생성(예: Stable Diffusion, DALL·E), 영상 생성 등 기술을 포함하며, 창의 콘텐츠를 빠르게 만들 수 있어 설계 보조, 마케팅 소재 제작, 교육훈련 등 영역에 적합합니다.

### 선택 전략

학습자는 다음 차원에 따라 자신에게 맞는 앱 방향을 선택할 수 있습니다.

1. **관심 지향**: 자신이 관심 있는 업계나 기술 방향을 우선 선택해 학습 동력을 유지합니다. 예:
   - 창의 설계에 관심이 있다면 콘텐츠 생산, 산업 디자인 앱을 시도할 수 있습니다.
   - 기술 도전에 관심이 있다면 네트워크 보안, 의료 방향의 앱을 시도할 수 있습니다.
   - 사회적 가치에 관심이 있다면 스마트 행정, 교육 업계 앱을 시도할 수 있습니다.

2. **업계 적합성**: 자신의 업계 배경이나 자원 우위를 결합해 장면을 선택합니다.
   - 제조업 종사자: 산업 제조, 기업 서비스형 앱을 우선 고려할 수 있습니다.
   - 교육 종사자: 교육 업계, 콘텐츠 생산형 앱에 우선 관심을 둘 수 있습니다.
   - 의료 종사자: 의료 방향, 건강 관리형 앱을 탐색할 수 있습니다.

3. **기술 난이도**: 자신의 기술 기초에 따라 적합한 복잡도를 선택합니다.
   - 입문급: 지능형 고객지원, 콘텐츠 창작, 간단한 질의응답 시스템
   - 발전급: 산업 품질 검사, 의료 영상 분석, 코드 지능형 도우미
   - 전문급: 금융 리스크 관리, 네트워크 보안, 멀티모달 복합 앱

## 1. 산업 제조업

산업 제조업 장면은 주로 설계 보조, 생산 최적화, 지능형 운영 유지보수라는 세 방향을 중심으로 전개됩니다. 흔한 앱에는 AI 보조 제품 외관 설계, 자동화 도면 검토, 기술 문서 지능형 생성, 산업 설비 고장 진단 등이 있으며, 설계 효율을 크게 높이고 운영 유지 비용을 낮출 수 있습니다.

| 번호 | 앱 장면 이름 | 구현 참고 |
| :--: | ------------ | -------- |
| 1 | 신에너지 버스 외관 AI 보조 설계 플랫폼 | 이미지 생성 모델 기반으로 외관 콘셉트 설계를 수행하고, LLM으로 설계 규범 검사와 아이디어 반복을 진행합니다. Three.js 3D 렌더링 서비스를 통합합니다 |
| 2 | 지능형 도면 설계와 검토 도우미 | RAG 기술로 기업 설계 규범 지식베이스를 구축하고, DALL·E가 참고 이미지를 생성해 이해를 돕습니다. CAD API를 통합해 도면 자동 파싱을 구현합니다 |
| 3 | 기술 문서 자동 생성과 관리 | LLM을 기반으로 제품 데이터베이스에서 제품 사양서와 조작 매뉴얼을 자동 생성하고, ChromaDB 벡터 저장소에 과거 문서를 저장해 지능형 검색을 지원합니다 |
| 4 | 생산 설비 점검 보고서 자동 생성 도우미 | 점검 인력이 음성으로 설비 상태를 설명하면 LLM이 구조화된 점검 보고서를 생성합니다. 과거 고장 기록을 자동 연결합니다 |
| 5 | 공장 지게차 지능형 dispatch와 경로 계획 시스템 | LLM이 주문 작업과 창고 위치를 해석하고 지도 API와 결합해 최적 dispatch 방안을 생성합니다 |
| 6 | LLM 정보 검색 기반 데이터 웨어하우스 | Text-to-SQL 기술로 자연어를 데이터베이스 질의로 변환하고, Superset으로 질의 결과를 시각화합니다. Doris 또는 ClickHouse를 OLAP 엔진으로 사용합니다 |
| 7 | 산업 설비 고장 진단 지식 질의응답 도우미 | 과거 고장 사례 기반 벡터 지식베이스를 구축하고, LLM이 고장 설명에 따라 진단 제안과 해결 방안을 제공합니다 |
| 8 | 생산 품질 검사 보고서 지능형 생성과 결함 분류 | OCR로 품질 검사 사진 속 결함을 인식하고 LLM이 구조화된 품질 검사 보고서를 생성합니다. 결함 유형과 심각도를 자동 분류합니다 |
| 9 | 재고 실사 지능형 도우미와 실사 보고서 생성 | 실사 데이터를 입력하면 LLM이 시스템 재고와 자동 비교하고 차이 보고서를 생성합니다. 이상 재고 경고를 제공합니다 |
| 10 | 공정 프로세스 최적화 제안 지능형 질의응답 시스템 | 생산 공정 문서를 바탕으로 RAG 지식베이스를 구축하고, LLM이 생산 문제에 따라 최적화 제안을 제공합니다 |

## 2. 지능형 고객지원

지능형 고객지원 장면은 고객 서비스 효율 향상과 사용자 경험 최적화에 집중합니다. 대표 앱에는 다채널 고객지원 통합, 지능형 답변 생성, 고객 감정 분석, 티켓 자동 처리 등이 있으며, 기업이 7×24시간 고객 서비스를 구현하도록 돕습니다.

| 번호 | 앱 장면 이름 | 구현 참고 |
| :--: | ------------ | -------- |
| 1 | 다채널 지능형 고객지원 자동 답변과 티켓 생성 시스템 | WeChat, APP, 공식 웹사이트 등 다채널 메시지를 연결하고, LLM이 의도를 이해한 뒤 답변을 생성하고 티켓을 자동 생성합니다. LangChain으로 대화 흐름을 만들고 MySQL에 티켓 데이터를 저장합니다 |
| 2 | 잠재 고객 발굴과 후속 제안 도우미 | LLM이 과거 고객지원 대화 기록을 분석해 구매 의향이 높은 고객 특징을 식별하고 점수를 매깁니다. 추천 시스템은 협업 필터링 알고리즘을 결합합니다 |
| 3 | 기업 내부 지식 지능형 검색과 질의응답 매니저 | Confluence와 내부 문서를 바탕으로 벡터 지식베이스를 만들고, LLM이 RAG 기술과 결합해 답변을 생성합니다 |
| 4 | 고객 만족도 조사와 서비스 개선 관리 시스템 | LLM이 고객지원 대화 내용을 자동 분석해 감정 분류와 만족도 점수를 수행합니다. BI 보고서로 분석 결과를 표시합니다 |
| 5 | 고객지원 대화 지능형 요약과 티켓 생성 도구 | 고객지원 대화 종료 후 LLM이 대화 요약을 자동 생성하고 핵심 정보를 추출합니다. 티켓 필드를 자동 채웁니다 |
| 6 | 고객지원 화법 컴플라이언스 자동 검사 도우미 | 고객지원 담당자가 입력한 답변 내용을 LLM이 실시간 검사해 화법 컴플라이언스와 민감어를 확인하고 수정 제안을 제공합니다 |
| 7 | 고객지원 티켓 자동 요약과 분류 생성 도구 | LLM이 긴 대화 기록을 요약하고 자동 분류 태그를 생성합니다. Elasticsearch가 티켓 전문 검색을 지원합니다 |
| 8 | 고객 감정 모니터링과 이상 경고 도구 | 음성 억양 특징과 문자 감정을 실시간 분석하고 LLM이 이상 감정을 식별해 경고를 트리거합니다. WebSocket으로 경고 메시지를 푸시합니다 |
| 9 | 고객지원 베스트 화법 추천 지식베이스 시스템 | LLM이 우수 고객지원 대화 사례를 분석해 베스트 화법 템플릿을 정제합니다. 추천 시스템은 대화 컨텍스트에 따라 실시간으로 화법을 추천합니다 |
| 10 | 지능형 아웃바운드 콜 대화 내용 분석과 품질 검사 도우미 | 아웃바운드 콜 녹음을 전사한 뒤, LLM이 대화 내용을 분석해 핵심 정보를 추출합니다. 품질 검사 보고서와 개선 제안을 자동 생성합니다 |

## 3. 교육 업계

교육 업계 장면은 개인화 교육과 스마트 교육 관리를 구현하는 데 힘씁니다. 핵심 앱에는 지능형 학습 경로 계획, 과제 자동 채점, 수업안 생성, 학습 상태 분석 등이 있으며, 교육 자원의 최적 배치와 맞춤형 교육을 추진합니다.

| 번호 | 앱 장면 이름 | 구현 참고 |
| :--: | ------------ | -------- |
| 1 | 개인화 언어 학습 경로 계획과 지능형 학습 안내 시스템 | LLM이 학습자의 현재 수준을 평가하고 학습 목표에 따라 매일의 학습 작업을 계획합니다. 추천 알고리즘과 지식 그래프를 결합해 학습 자원을 추천합니다 |
| 2 | 수업안 자동 작성과 교육 자료 추천 플랫폼 | LLM이 교과 과정 개요에 따라 수업안 프레임워크와 교수 설계를 생성합니다. 벡터 저장소에 우수 수업안과 수업 자료를 저장해 키워드 검색과 유사 추천을 지원합니다 |
| 3 | 과제 자동 채점과 학습 상태 진단 분석 시스템 | LLM이 서술형 문제를 자동 채점하고 채점 제안을 생성하며, 지식 그래프가 학생의 취약 지식 포인트를 찾아냅니다 |
| 4 | 인재 직무 역량 모델 구축과 학습 지도 | LLM이 직무 설명을 분석해 역량 요구를 추출하고 직무 역량 프로필을 구축합니다. 격차에 따라 개인화 학습 지도를 생성합니다 |
| 5 | 학교 기반 교육과정 체계 구축과 수업 자료 제작 도구 | LLM이 학교 특성과 학생 요구를 분석해 학교 기반 교육과정 프레임워크를 생성합니다. PPT 생성 인터페이스를 통합해 수업 자료를 자동 제작합니다 |
| 6 | 외국어 말하기 일대일 상황형 실전 연습 | LLM이 서로 다른 역할을 맡아 말하기 대화를 진행하고, ASR이 발음을 인식해 점수를 매깁니다. TTS가 표준 발음 시범을 생성합니다 |
| 7 | 대학 입시 지원 빅데이터 추천과 진로 계획 지도 플랫폼 | LLM이 수험생 점수, 등수, 관심사 등을 분석하고 입학 데이터를 결합해 학교와 전공을 추천합니다 |
| 8 | 어린이 코딩 코드 도우미 | LLM이 코드 로직을 설명하고 프로그래밍 지도를 제공하며, 블록 언어와 Python 전환을 지원합니다 |
| 9 | 지식 포인트 마인드맵 자동 생성과 학습 경로 추천 도구 | 수업 주제를 입력하면 LLM이 지식 포인트 마인드맵을 자동 생성합니다. 학습 진도에 따라 다음 학습 내용을 추천합니다 |
| 10 | 한국어와 영어 작문 자동 채점과 첨삭 엔진 | LLM이 주제 의식, 구조, 언어, 다양성 등 여러 차원에서 점수를 매기고 주석을 생성합니다. 우수 예시 글과 비교합니다 |

## 4. 지능형 프로그래밍

지능형 프로그래밍 장면은 개발 효율과 코드 품질을 높이는 것을 목표로 합니다. 대표 앱에는 지능형 코드 완성, 버그 자동 수정, 자동화 테스트 생성, 코드 변환 등이 있으며, 개발자가 반복적인 코딩 작업이 아니라 비즈니스 로직에 집중하게 합니다.

| 번호 | 앱 장면 이름 | 구현 참고 |
| :--: | ------------ | -------- |
| 1 | 지능형 코드 완성과 버그 자동 수정 도우미 | CodeLlama로 코드 모델을 미세조정하고, IDE 플러그인이 실시간 코드 완성 제안을 제공합니다. LLM이 오류 스택을 분석해 버그를 자동 위치 지정하고 수정 코드를 생성합니다 |
| 2 | 로우코드 앱 구축과 프로세스 자동화 플랫폼 | 사용자가 자연어로 요구를 설명하면 LLM이 로우코드 설정이나 코드 프레임워크로 변환합니다 |
| 3 | 단위 테스트 케이스 생성 시스템 | AST가 소스 코드를 파싱해 함수 로직을 추출하고, LLM이 경계 조건과 예외 장면의 테스트 케이스를 생성합니다. Jest/Pytest를 통합해 테스트를 실행합니다 |
| 4 | 코드 지능형 분석과 언어 마이그레이션 도구 | Tree-sitter 기반으로 코드 구조를 파싱하고, LLM이 코드 품질을 분석해 최적화 제안을 제공합니다. 규칙 엔진과 결합해 언어 변환을 구현합니다 |
| 5 | 자연어를 SQL 문으로 자동 생성하는 도구 | LLM이 자연어 질의를 SQL로 변환하며, 복잡한 다중 테이블 조인과 집계 질의를 지원합니다 |
| 6 | API 인터페이스 자동화 테스트와 문서 생성 플랫폼 | LLM이 코드 주석과 인터페이스 정의를 분석해 테스트 케이스와 API 문서를 자동 생성합니다. Postman 통합 테스트 실행을 지원합니다 |
| 7 | UI 테스트 스크립트 지능형 녹화와 유지보수 도구 | 브라우저 플러그인이 사용자 조작 궤적을 녹화하고, LLM이 조작 의도를 분석해 테스트 스크립트를 생성합니다. AI가 실패한 locator를 수정합니다 |
| 8 | 시스템 로그 분석과 장애 위치 지정 | ELK Stack이 로그 데이터를 수집하고, LLM이 이상 로그를 분석해 핵심 정보를 추출하며 근본 원인을 찾습니다. 수정 방안을 추천합니다 |
| 9 | 프론트엔드 인터페이스(UI) 코드 자동 생성 도구 | 디자인 시안 이미지를 OCR로 인식해 레이아웃 구조를 파악하고, LLM이 반응형 CSS와 컴포넌트 코드를 생성합니다. TailwindCSS를 통합해 여러 스타일 프레임워크를 지원합니다 |
| 10 | 데이터베이스 구조 지능형 설계와 모델링 도우미 | 비즈니스 요구 문서를 LLM에 입력하면 ER 다이어그램과 데이터 테이블 구조를 자동 생성합니다. MySQL/PostgreSQL 테이블 생성 스크립트 내보내기를 지원합니다 |

## 5. 의료 방향

의료 방향 장면은 진료 효율과 의료 서비스 품질을 높이는 데 힘씁니다. 흔한 앱에는 진료 기록 자동 생성, 의학 지식 질의응답, 영상 분석 보조, 신약 개발 지원 등이 있으며, 의료 업계의 지능화 전환을 추진합니다.

| 번호 | 앱 장면 이름 | 구현 참고 |
| :--: | ------------ | -------- |
| 1 | 의학 검사 보고서 지능형 해석 도우미 | 검사 보고서 이미지를 업로드하면 OCR이 핵심 지표를 인식하고, LLM이 이상값을 해석해 쉬운 설명을 생성합니다 |
| 2 | 지식 검색 기술 기반 건강 상담 전문가 | 의학 지식 그래프(ICD-10, 약품 설명서, 진료 지침)를 구축하고 RAG 검색으로 답변을 생성합니다 |
| 3 | 임상 연구 데이터 의사결정 분석 플랫폼 | EMR 데이터와 검사 결과를 통합하고, LLM이 통계 분석 코드와 시각화 차트 생성을 보조합니다. 코호트 연구와 생존 분석을 지원합니다 |
| 4 | 의학 시험 문제 지능형 생성과 오답 해설 시스템 | 교재 장과 지식 포인트를 입력하면 LLM이 연습 문제와 해설을 생성합니다. 오답을 자동 수집하고 취약점 분석을 생성합니다 |
| 5 | 신약 개발 전 과정 지식 그래프 지능형 질의응답 전문가 | 약물-표적-질병 지식 그래프를 구축하고 LLM이 연구개발 관련 질문에 답합니다. 문헌 검색과 실험 방안 추천을 지원합니다 |
| 6 | 의약품 설명서 지능형 질의응답 도우미 | 의약품 설명서 이미지를 업로드하거나 약명을 입력하면 LLM이 용법·용량, 이상 반응, 주의사항 등 질문에 답합니다 |
| 7 | 질병 지식 대중화 글 생성 도우미 | 질병명과 독자를 입력하면 LLM이 쉽고 이해하기 쉬운 대중화 글을 생성합니다. 여러 버전(환자용/가족용)을 지원합니다 |
| 8 | 의학 영상 보고서 자동 생성 도구 | 영상의학과 의사가 영상 특징을 설명하면 LLM이 구조화된 보고서를 자동 생성합니다. 흔한 검사 유형 템플릿을 지원합니다 |
| 9 | 수술 기록 지능형 생성과 보관 도우미 | 수술 과정에서 핵심 단계를 음성으로 입력하면 LLM이 구조화된 수술 기록을 생성합니다. 수술 코드를 자동 연결합니다 |
| 10 | 만성질환 관리 복약 알림 지능형 도우미 | 환자가 복약 목록을 입력하면 LLM이 개인화 복약 알림을 생성합니다. 복약 금기 검사와 인터랙티브 질의응답을 지원합니다 |

## 6. 네트워크 보안

네트워크 보안 장면은 보안 방어와 위험 통제에 집중합니다. 핵심 앱은 취약점 탐지, 위협 인텔리전스 분석, 피싱 메일 식별, 보안 사건 대응 등을 포함하며, 기업을 위해 전방위 지능형 보안 방어 체계를 구축합니다.

| 번호 | 앱 장면 이름 | 구현 참고 |
| :--: | ------------ | -------- |
| 1 | 코드 보안 취약점 탐지와 수정 엔진 | 정적 코드 분석 도구(SAST)가 코드를 스캔하고, LLM이 취약점 원리를 분석해 수정 제안을 생성합니다. CI/CD 파이프라인을 통합합니다 |
| 2 | AI 생성형 피싱 메일 지능형 식별과 차단 시스템 | LLM이 메일 내용, 발신자 특징, 링크 안전성을 분석해 AI가 생성한 피싱 메일을 식별합니다. 메일 게이트웨이와 연결해 실시간 차단합니다 |
| 3 | 보안 운영 일일 보고서 자동 생성 도우미 | 보안 장비 로그를 모으고 LLM이 핵심 이벤트를 자동 추출해 일일 보고서를 생성합니다. 이상 이벤트를 highlight 표시합니다 |
| 4 | 보안 지식베이스 지능형 질의응답 도우미 | 보안 문서와 CVE 라이브러리 기반 벡터 지식베이스를 구축하고, LLM이 보안 기술과 처치 제안 질문에 답합니다 |
| 5 | 침투 테스트 보고서 지능형 생성 도우미 | 침투 테스트 완료 후 LLM이 취약점 설명에 따라 보고서를 자동 생성합니다. 취약점 수정 제안을 일괄 생성합니다 |
| 6 | 악성 코드 방어와 개인정보 컴플라이언스 모니터링 | 샌드박스로 의심 파일 행동을 분석하고, LLM이 악성 특징을 식별해 시그니처를 생성합니다. 개인정보 식별 스캔을 수행합니다 |
| 7 | 보안 설정 컴플라이언스 체크리스트 생성 도구 | 목표 시스템 유형을 입력하면 LLM이 보안 설정 체크리스트를 생성합니다. Multi-Level Protection 2.0, CIS 등 표준을 지원합니다 |
| 8 | 위협 인텔리전스 지능형 조회와 분석 도우미 | 여러 출처의 위협 인텔리전스(오픈소스, 상용)를 연결하고, LLM이 정보를 해석해 기업 자산과 연관 짓습니다. 방어 전략을 추천합니다 |
| 9 | 보안 사건 회고 보고서 생성 도우미 | 보안 사건 발생 후 LLM이 타임라인에 따라 회고 보고서를 자동 생성합니다. 근본 원인 분석과 개선 제안을 제공합니다 |
| 10 | 글로벌 위협 인텔리전스 모니터링과 경고 센터 | 크롤러가 전 세계 보안 뉴스와 취약점 공개를 수집하고, LLM이 핵심 정보를 추출해 영향을 평가합니다. 메일/문자 경고 알림을 제공합니다 |

## 7. 금융 관리와 보험 은행업

금융 영역 장면은 위험 통제와 비즈니스 지능화를 중심으로 전개됩니다. 대표 앱에는 신용 리스크 평가, 자산관리 고문, 재무 보고서 생성, 자금세탁 방지 모니터링 등이 있으며, 금융기관의 운영 효율과 위험 통제 능력을 높입니다.

| 번호 | 앱 장면 이름 | 구현 참고 |
| :--: | ------------ | -------- |
| 1 | 신용 실사 보고서 지능형 생성 도우미 | 기업 기본 정보와 재무 데이터를 입력하면 LLM이 신용 실사 보고서를 자동 생성합니다. 위험 지점을 자동 표시합니다 |
| 2 | 프라이빗 뱅킹 자산관리 지능형 고문 | LLM이 고객 위험 선호와 재무 목표를 분석하고 자산 배분 제안을 생성합니다. 자산관리 상품과 펀드 라이브러리를 연결합니다 |
| 3 | IPO 투자설명서 지능형 생성과 컴플라이언스 검증 도우미 | 투자설명서 모듈형 템플릿에 LLM이 사업 설명과 위험 요인을 자동 채웁니다. 컴플라이언스 검증 규칙 엔진이 앞뒤 일관성을 검사합니다 |
| 4 | 기업 재무 보고서 자동 생성과 경영 이상 경고 시스템 | 재무 시스템 데이터를 자동 수집하고 LLM이 재무 분석과 경영진 논의 부분을 생성합니다. 이상 지표 경고 규칙을 제공합니다 |
| 5 | 재무 증빙 정보 추출과 질의응답 도우미 | 청구서 이미지를 업로드하면 OCR이 정보를 인식하고, LLM이 증빙 관련 질문에 답합니다. 부가가치세 청구서, 기차표 등을 지원합니다 |
| 6 | 컴플라이언스 사례 지능형 검색과 질의응답 도우미 | 감독기관 처벌 사례를 바탕으로 지식베이스를 구축하고, LLM이 컴플라이언스 질문에 답하며 사례 참고를 제공합니다 |
| 7 | 보험 설계사 지능형 화법 연습 | LLM이 서로 다른 유형의 고객을 연기해 모의 대화를 진행하고, 설계사 화법의 규정 준수와 설득력을 평가합니다. 녹음 전사 분석을 제공합니다 |
| 8 | 보험 상품 조항 분석과 경쟁 상품 비교 플랫폼 | 조항을 구조화해 파싱하고 LLM이 장점 요약과 주의사항을 생성합니다 |
| 9 | 고객 화법 감정 인식 서비스 | 음성 감정 인식과 화법 컴플라이언스 검사를 결합해 설계사에게 실시간 개선 제안을 피드백합니다 |
| 10 | 보험금 청구 진행 상황 지능형 조회와 대화 도우미 | 사용자가 보험증권 번호나 접수 번호를 입력하면 LLM이 청구 진행 상황을 조회하고 청구 관련 질문에 답합니다 |

## 8. 기업 서비스

기업 서비스 장면은 조직 운영 효율과 관리 수준을 높이는 데 힘씁니다. 흔한 앱에는 고객 관계 관리, 영업 예측, 여론 모니터링, HR 지능형 관리 등이 있으며, 기업의 디지털 전환 업그레이드를 돕습니다.

| 번호 | 앱 장면 이름 | 구현 참고 |
| :--: | ------------ | -------- |
| 1 | 고객 유지 분석과 이탈 경고 플랫폼 | 행동 데이터 추적으로 사용자 조작을 수집하고, ML 모델이 이탈 확률을 예측하며, LLM이 유지 제안을 생성합니다 |
| 2 | B2B 잠재 고객 도달과 마케팅 메일 플랫폼 | 기업 상공 데이터를 선별해 목표 고객을 찾고, LLM이 개인화 마케팅 콘텐츠를 생성합니다. 메일 대량 발송 플랫폼을 연결합니다 |
| 3 | 영업 파이프라인 모니터링과 성과 예측 플랫폼 | CRM 데이터를 자동 수집하고 LLM이 영업 퍼널을 분석해 성과 달성을 예측합니다. 이상 경고를 관리자에게 푸시합니다 |
| 4 | 브랜드 여론 모니터링과 위기 경고 레이더 | 전 웹 여론 데이터(소셜 미디어, 뉴스, 포럼)를 수집하고, LLM이 감정과 전파 추세를 분석합니다. 위기 경고를 푸시합니다 |
| 5 | 직장 메일 지능형 작성과 커뮤니케이션 감정 관리 도우미 | 메일 컨텍스트를 이해하고 LLM이 전문적인 메일 초안을 생성합니다. 감정 분석으로 개선 제안을 피드백합니다 |
| 6 | 이력서 지능형 파싱과 직무 매칭 시스템 | PDF 이력서를 파싱해 핵심 정보를 추출하고, LLM이 적합한 직무를 매칭하며 면접 제안을 생성합니다. ATS 시스템을 연결합니다 |
| 7 | 기업 직원 온보딩 안내와 질의응답 도우미 | 온보딩 문서 지식베이스 RAG 검색을 통해 LLM이 신입 직원의 자주 묻는 질문에 답합니다 |
| 8 | 직원 성과 피드백과 OKR 목표 관리 플랫폼 | OKR 시스템 데이터를 수집하고 LLM이 목표 완료 상황을 분석해 피드백 제안을 생성합니다. 360도 피드백을 수집합니다 |
| 9 | 지능형 회의 기록과 할 일 관리 | 회의 녹음을 전사하고 LLM이 핵심 논의점과 할 일을 추출합니다. 작업 시스템에 할 일을 자동 생성합니다 |
| 10 | 청구서 인식과 비용 정산 자동 처리 | OCR이 청구서 정보를 인식하고, 청구서 진위와 비용 정산 컴플라이언스를 자동 검증합니다. 재무 시스템을 연결합니다 |

## 9. 콘텐츠 생산과 운영

콘텐츠 생산과 운영 장면은 창의 생성과 트래픽 운영에 집중합니다. 핵심 앱에는 문안 창작, 짧은 영상 제작, 디지털 휴먼 라이브, SEO 최적화 등이 있으며, 기업의 콘텐츠 생산 효율과 마케팅 전환율을 높입니다.

| 번호 | 앱 장면 이름 | 구현 참고 |
| :--: | ------------ | -------- |
| 1 | 영상과 소설 콘텐츠 창작 보조 플랫폼 | LLM이 스토리 개요, 인물 설정, 대사 생성 등 창작 보조를 제공합니다. 마인드맵으로 이야기 구조를 시각화합니다 |
| 2 | 기업 브랜드 스토리와 PR 기사 지능형 작성 도우미 | 브랜드 키워드와 제품 정보를 입력하면 LLM이 여러 스타일의 문안 버전을 생성합니다. A/B 테스트 인터페이스를 연결합니다 |
| 3 | 가상 디지털 휴먼 라이브 상호작용과 송출 관리 시스템 | 디지털 휴먼 모델링 + TTS 음성 + LLM 대화로 시청자 댓글에 실시간 응답합니다. OBS 송출을 통합합니다 |
| 4 | 짧은 영상 스크립트 생성과 지능형 편집 | LLM이 짧은 영상 스크립트와 콘티를 생성하고, Sora/Runway가 영상 클립을 생성합니다. 편집 도구가 자동으로 이어 붙입니다 |
| 5 | 영업 대화 음성 전사와 화법 추천 | 전화 녹음 ASR 전사 후 LLM이 대화를 분석하고 베스트 화법을 추천합니다. CRM 시스템을 통합합니다 |
| 6 | 마케팅 콘텐츠 지능형 생성과 디자인 시스템 | 제품 정보를 입력하면 LLM이 마케팅 문안과 판매 포인트를 추출합니다. Canva/Gaoding Design 템플릿을 통합합니다 |
| 7 | 다중 플랫폼 광고 집행 ROI 실시간 모니터링과 전략 조정 시스템 | 광고 플랫폼 API를 연결해 데이터를 수집하고, LLM이 집행 효과를 분석해 최적화 제안을 생성합니다. 이상 경고를 푸시합니다 |
| 8 | 검색엔진 키워드와 트래픽 분석 | Baidu Index, 5118 데이터를 수집하고, LLM이 키워드 추세와 경쟁도를 분석합니다. 콘텐츠 주제를 추천합니다 |
| 9 | 경쟁사 광고 집행 분석 플랫폼 | 제3자 데이터 플랫폼 API로 경쟁사 광고를 수집하고, LLM이 집행 전략과 창의 특징을 분석합니다 |
| 10 | 전 웹 핫이슈 주제 지능형 분석과 콘텐츠 추천 시스템 | Weibo 핫검색어, Douyin 인기 순위 데이터를 수집하고, LLM이 핫이슈 추세를 분석해 주제 각도를 추천합니다. 캘린더형 콘텐츠 일정을 제공합니다 |

## 10. 스마트 행정 관리

스마트 행정 장면은 정부 서비스 효율과 거버넌스 능력을 높이는 데 힘씁니다. 대표 앱에는 공공 민원 핫라인 지능형 안내, 정책 지능형 질의응답, 행정 승인 최적화, 도시 사건 관리 등이 있으며, 디지털 정부 구축을 추진합니다.

| 번호 | 앱 장면 이름 | 구현 참고 |
| :--: | ------------ | -------- |
| 1 | 12345 공공 민원 핫라인 지능형 음성 안내와 자동 배정 시스템 | 시민 전화 음성을 인식하고, LLM이 요구를 이해해 해당 부서로 지능적으로 배정합니다. 티켓 시스템이 자동으로 흐름을 이어갑니다 |
| 2 | 공공 서비스 센터 지능형 안내와 정책 질의응답 봇 | 공공 행정 지식베이스 RAG 검색으로 LLM이 업무 처리 흐름과 정책 질문에 답합니다. 번호표 시스템을 연결합니다 |
| 3 | 기업 지원 정책 지능형 매칭과 정밀 푸시 플랫폼 | 정책을 구조화해 파싱하고 기업 프로필과 적용 가능한 정책을 자동 매칭합니다. 문자/메일 푸시 알림을 제공합니다 |
| 4 | 행정 승인 자료 지능형 사전 검토와 컴플라이언스 검증 도우미 | 자료 OCR 인식과 핵심 정보 추출을 수행하고, LLM이 자료 완전성과 컴플라이언스를 검증합니다 |
| 5 | 공공 안전 영상 감시 이상 행동 탐지 시스템 | 영상 스트림을 실시간 분석하고, CV 모델이 이상 행동(싸움, 넘어짐 등)을 탐지합니다. 경고를 푸시합니다 |
| 6 | 도시 그리드 사건 지능형 식별과 dispatch 관리 플랫폼 | 도시 감지 데이터(IoT, 카메라)를 수집하고, LLM이 사건 유형을 식별해 배정합니다 |
| 7 | 사회 여론 빅데이터 분석과 위험 경고 시스템 | 공공 민원 핫라인, 온라인 여론, 현장 방문 등 다중 출처 데이터를 융합 분석합니다. LLM이 위험 핫스팟을 식별합니다 |
| 8 | 공공 기록 디지털화 인식과 지능형 보관 관리 플랫폼 | OCR이 기록 문자를 인식하고, LLM이 핵심 정보를 추출해 자동 분류합니다. 전문 검색을 지원합니다 |
| 9 | 돌발 공공 사건 비상 지휘와 구조 자원 지능형 dispatch 플랫폼 | 사건 정보를 수집하고, LLM이 비상 대응 방안을 생성합니다. 자원 dispatch 최적화 알고리즘을 사용합니다 |
| 10 | 대기 환경 오염 그리드 모니터링과 정밀 원인 추적 시스템 | 공기질 센서 데이터를 수집하고, CV 모델이 오염원을 식별합니다. LLM이 오염 추세를 분석하고 원인을 추적합니다 |

## 11. 법무와 계약 관리

법무 장면은 법률 서비스 효율 향상과 컴플라이언스 관리에 집중합니다. 흔한 앱에는 계약 검토, 사건 분석, 법규 모니터링, 법률 문서 생성 등이 있으며, 법률 종사자에게 지능형 도구 지원을 제공합니다.

| 번호 | 앱 장면 이름 | 구현 참고 |
| :--: | ------------ | -------- |
| 1 | 계약 위험 구멍 원클릭 점검 Agent | 계약 텍스트를 구조화해 파싱하고, LLM이 위험 체크리스트와 대조해 잠재 문제를 식별합니다. 고위험 조항을 표시합니다 |
| 2 | 기업 계약 전 생명주기 컴플라이언스 검토와 수정 제안 플랫폼 | 계약 조항을 법규 라이브러리와 비교하고, LLM이 컴플라이언스 검토 보고서를 생성합니다. 수정 제안을 추적합니다 |
| 3 | 유사 사건 승소율 AI 지능형 평가 고문 | 사건 특징을 추출하고 유사 판례를 검색해 매칭합니다. LLM이 승소에 영향을 주는 요인을 분석합니다 |
| 4 | 법규 변경 실시간 모니터링과 업무 영향 분석 레이더 | 법규 데이터베이스를 실시간 업데이트하고, LLM이 변경 내용을 해석해 업무 영향을 평가합니다. 경고를 푸시합니다 |
| 5 | 변호사 내용증명 AIGC 자동 초안 도구 | 사실 진술을 입력하면 LLM이 표준 변호사 서한 템플릿을 생성합니다. 요소 검사와 컴플라이언스 검증을 제공합니다 |
| 6 | 재판 녹음 실시간 전사와 쟁점 자동 추출 기록기 | 법정 녹음을 ASR로 전사하고, LLM이 쟁점과 핵심 논점을 추출합니다. 타임스탬프를 표시합니다 |
| 7 | 전 웹 지식재산권 침해 단서 자동 모니터링과 블록체인 증거 보전 시스템 | 이커머스 플랫폼, 소셜 미디어 침해를 모니터링합니다. 침해 증거를 자동 수집하고 보전합니다 |
| 8 | LLM 기반 IPO 투자설명서 핵심 데이터 일관성 검토와 위험 경고 Agent | 투자설명서 여러 장의 데이터를 비교하고, LLM이 불일치와 데이터 이상을 식별합니다. 위험을 표시합니다 |
| 9 | 복잡한 법률 조항을 쉬운 말로 바꾸는 설명 플러그인 | 선택한 법률 조문에 대해 LLM이 쉽고 이해하기 쉬운 설명을 생성합니다 |
| 10 | 사건 증거 사슬 지능형 정리와 시각화 표시 시스템 | 증거 자료를 업로드하면 LLM이 증거 관계와 타임라인을 분석합니다 |

## 12. 여행과 이동 서비스

여행과 이동 장면은 여행 경험과 서비스 편의성을 높이는 데 힘씁니다. 핵심 앱에는 지능형 일정 계획, 가격 예측, 가상 안내, 번역 서비스 등이 있으며, 여행을 더 쉽고 즐겁게 만듭니다.

| 번호 | 앱 장면 이름 | 구현 참고 |
| :--: | ------------ | -------- |
| 1 | AIGC 기반 게으른 여행 일정 생성기 | 사용자 선호(일수, 예산, 관심사)를 입력하면 LLM이 매일의 일정을 생성합니다. 관광지 API로 운영 시간과 티켓 정보를 가져옵니다 |
| 2 | 전 웹 항공권 호텔 가격 추세 예측과 저가 자동 잠금 봇 | OTA 가격 데이터를 수집하고 ML 모델이 가격 추세를 예측합니다. 가격 모니터링 알림을 제공합니다 |
| 3 | 항공편 취소 후 여러 항공사 일정 재구성과 비상 방안 추천 고문 | 항공편 상태를 모니터링하고, LLM이 대체 일정 방안을 분석합니다. 여러 항공사 가격 비교를 제공합니다 |
| 4 | 비자 자료 지능형 사전 검토와 자동 양식 작성 보조 시스템 | 자료 사진을 업로드하면 OCR이 정보 완전성을 검사합니다. 양식을 자동으로 채웁니다 |
| 5 | 해외여행 실시간 음성 번역과 메뉴 시각 번역 매니저 | 오프라인 음성 번역 모델과 메뉴 이미지 OCR 인식 및 번역을 제공합니다 |
| 6 | 빅데이터 실제 평가 기반 호텔 위험 회피 가이드 분석기 | 호텔 리뷰 데이터를 수집하고 LLM이 긍정·부정 평가 키워드를 추출합니다 |
| 7 | 목적지 몰입형 VR 미리보기와 가상 객실 선택 상호작용 플랫폼 | 360도 파노라마 이미지를 수집하고 VR 기술로 몰입형 미리보기를 구현합니다. 객실 가상 투어를 제공합니다 |
| 8 | 여행 발자취 자동 여행기와 소셜 문안 생성 도우미 | 사진의 시간과 장소 정보를 추출하고, LLM이 여행기 문안을 생성합니다. 템플릿 레이아웃을 생성합니다 |
| 9 | 기업 출장 청구서 자동 수집과 컴플라이언스 정산 관리 플랫폼 | 출장 플랫폼 API를 연결하고 청구서 정보를 자동 수집합니다. 컴플라이언스 검증을 수행합니다 |
| 10 | 관광지 혼잡 실시간 예측과 분산 관람 경로 계획 내비게이션 | 관광지 방문객 데이터를 수집하고 ML 모델이 혼잡 시간대를 예측합니다. 분산 관람을 추천합니다 |

## 13. 감정적 동행

감정적 동행 장면은 정신 건강과 감정적 위로에 집중합니다. 대표 앱에는 가상 파트너, 감정 상담, 인지 훈련, 심리 상담 등이 있으며, 사용자에게 상시 동행과 지원을 제공합니다.

| 번호 | 앱 장면 이름 | 구현 참고 |
| :--: | ------------ | -------- |
| 1 | LLM 대형 모델 기반 24시간 깊은 동행 가상 파트너 | 기억 시스템이 대화 기록을 저장하고, LLM이 개인화 답변을 생성합니다. 감정 지원 모듈을 제공합니다 |
| 2 | 멀티모달 감정 인식과 심리 상담 AI 고문 | 음성 억양 분석 + 문자 감정 인식으로 LLM이 상담 제안을 생성합니다. 위기 개입 경고를 제공합니다 |
| 3 | 알츠하이머 노인 AI 인지 훈련과 기억 깨우기 디지털 휴먼 | 인지 게임(기억, 계산, 언어) 훈련을 제공하고, 오래된 사진/노래가 기억 회상을 트리거합니다 |
| 4 | 사회불안인을 위한 AIGC 모의 소셜 연습 코치 | 가상 소셜 장면을 시뮬레이션하고, LLM이 서로 다른 역할을 맡습니다. 소셜 기술 제안을 제공합니다 |
| 5 | 생성형 AI 어린이 잠자리 이야기 맞춤 생성기 | 보호자가 주제와 선호를 입력하면 LLM이 맞춤 이야기를 생성합니다. 배경음악 생성을 제공합니다 |
| 6 | 고인의 디지털 생명 복원과 LLM 시공간 대화 시스템 | 생전 자료(음성, 문자)로 개인화 모델을 학습하고, 기억 대화를 생성합니다 |
| 7 | MBTI 데이터 기반 AI 성격 거울과 공감형 챗봇 | MBTI 테스트 결과를 입력하면 LLM이 성격 분석과 공감 답변을 생성합니다. 성격 매칭 추천을 제공합니다 |
| 8 | 상시 기분 모니터링과 AI 긍정 감정 격려 도우미 | 일상 기분 상태를 기록하고, LLM이 추세를 분석해 격려 콘텐츠를 생성합니다. 긍정 알림을 푸시합니다 |
| 9 | 개인정보 보호 등급 청소년 AI 고민 털어놓기 공간 | 익명 털어놓기 입구를 제공하고 LLM이 경청과 제안을 제공합니다. 민감어 경고를 제공합니다 |
| 10 | 자율 진화 능력을 갖춘 AI 가상 반려동물 키우기 시스템 | 반려동물 성격 모델을 학습하고, 대화 상호작용으로 성장·진화합니다. 가상 꾸미기 시스템을 제공합니다 |

## 14. 휴식과 엔터테인먼트

휴식과 엔터테인먼트 장면은 풍부한 디지털 엔터테인먼트 경험을 제공하는 데 힘씁니다. 흔한 앱에는 게임 NPC 지능형 의사결정, 추리 게임 보조, 콘텐츠 창작, 오디오·비디오 처리 등이 있으며, 사용자의 다양한 엔터테인먼트 요구를 만족시킵니다.

| 번호 | 앱 장면 이름 | 구현 참고 |
| :--: | ------------ | -------- |
| 1 | LLM 구동 오픈월드 게임 NPC 자율 의사결정 엔진 | NPC 행동 트리에 LLM 의사결정을 융합하고, 대화 시스템이 개인화 상호작용을 생성합니다. 행동 엔진을 사용합니다 |
| 2 | 몰입형 추리 게임 AIGC 이야기 추론과 DM 진행 보조 도구 | 플레이어 선택이 이야기 분기를 트리거하고, LLM이 추리 로직을 생성합니다. 단서 카드를 자동 생성합니다 |
| 3 | 인터랙티브 소설 결말 생성식 수정기 | 독자 선택이 이야기 방향에 영향을 주고, LLM이 여러 결말 분기를 생성합니다 |
| 4 | 2D 캐릭터 3D 모델링 AIGC 자동 생성 워크벤치 | 설명 텍스트로 캐릭터 스케치를 생성하고, 3D 모델링 도구가 자동 모델링합니다. 재질 텍스처를 렌더링합니다 |
| 5 | e스포츠 전황 CV 시각 분석과 AI 지능형 해설자 | 게임 화면을 실시간 분석하고 핵심 순간을 식별합니다. LLM이 해설 문안을 생성합니다 |
| 6 | 개인화 유머 콘텐츠 추천 알고리즘 엔진 | 사용자 관심 프로필을 만들고 유머 콘텐츠를 매칭해 추천합니다 |
| 7 | AI 지능형 음정 보정과 KTV 보컬 미화 소프트웨어 | 오디오 노이즈 제거와 보컬 강화 처리를 수행합니다. AI 음정 보정 알고리즘을 사용합니다 |
| 8 | 영상 드라마 캐릭터 전용 이야기 AI 추출과 편집 도구 | 영상 내용을 분석하고 캐릭터 관련 장면을 추출합니다. 자동 편집으로 생성합니다 |
| 9 | 다중 역할 TTS 음성 합성 오디오북 자동 생성 시스템 | 텍스트 역할을 배분하고 개인화 음색을 생성합니다. 배경음악과 효과음을 추가합니다 |
| 10 | 보드게임·카드게임 강화학습 대국 회고 코치 | 게임 국면을 분석하고 AI 상대가 모의 대국을 진행합니다. 회고 제안을 생성합니다 |

## 15. 이커머스 서비스

이커머스 서비스 장면은 운영 효율과 전환 향상에 집중합니다. 핵심 앱에는 상품 콘텐츠 생성, 라이브 커머스, 고객 서비스, 가격 분석 등이 있으며, 판매자가 지능형 운영을 구현하도록 돕습니다.

| 번호 | 앱 장면 이름 | 구현 참고 |
| :--: | ------------ | -------- |
| 1 | 고전환율 AIGC 상품 상세 페이지 대량 생산 도구 | 상품 정보를 입력하면 LLM이 판매 포인트 문안과 장면 설명을 생성합니다. 배경 이미지를 생성합니다 |
| 2 | 의류 가상 모델 AI 지능형 착용과 전시 영상 생성 공장 | 의류 평면 이미지를 처리하고 가상 모델 착용 효과를 생성합니다. 여러 각도 전시 영상을 만듭니다 |
| 3 | 크로스보더 이커머스 다국어 LLM 현지화 번역과 윤문 도우미 | 상품 설명을 여러 언어로 번역하고 문화에 맞게 다듬습니다. 여러 플랫폼 게시 인터페이스를 제공합니다 |
| 4 | NLP 기반 고객 감정 분석과 지능형 답변 봇 | 문의 대화 감정을 분석하고, 위로 답변을 자동 생성합니다. 긍정·부정 리뷰를 분류합니다 |
| 5 | 24시간 상시 AIGC 디지털 휴먼 라이브 커머스 시스템 | 디지털 휴먼 이미지 + 실시간 화법 생성으로 상품 정보를 실시간 호출합니다. 댓글 상호작용 답변을 제공합니다 |
| 6 | 전 웹 동일 상품 AI 가격 비교와 추세 예측 플러그인 | 이커머스 플랫폼 가격을 크롤링하고 가격 비교 차트를 표시합니다. 가격 추세를 예측합니다 |
| 7 | 구매자 후기 이미지 AI 지능형 선별과 짧은 영상 합성 플랫폼 | 구매자 후기 이미지 품질을 점수화하고 우수 콘텐츠를 자동 추천합니다. 짧은 영상 템플릿 합성을 제공합니다 |
| 8 | LLM 기반 실시간 영업 대화 음성 분석과 베스트 화법 추천 | 통화 ASR 전사를 수행하고 실시간 화법 컴플라이언스 검사를 제공합니다. 화법을 추천합니다 |
| 9 | 시장 유행 추세 AI 통찰과 히트 상품 예측 엔진 | 소셜 미디어와 이커머스 데이터를 수집·분석하고 LLM이 추세 핫이슈를 통찰합니다. 상품 선정 제안을 추천합니다 |
| 10 | 사적 트래픽 사용자 프로필 AI 군집화와 정밀 운영 시스템 | 사용자 행동 데이터를 군집 분석하고 프로필 태그를 생성합니다. 자동화 마케팅을 트리거합니다 |

## 16. 에너지

에너지 장면은 에너지 업계의 지능형 관리와 녹색 전환을 구현하는 데 힘씁니다. 대표 앱에는 전력 사용 분석, 설비 검사, 탄소 배출 산정, dispatch 최적화 등이 있으며, 에너지 시스템의 효율적 운영을 추진합니다.

| 번호 | 앱 장면 이름 | 구현 참고 |
| :--: | ------------ | -------- |
| 1 | 가정 전력 사용 행동 AI 분석과 절전 전략 고문 | 스마트 전력계 데이터를 수집하고 전력 사용 패턴을 분석합니다. LLM이 절전 제안을 생성합니다 |
| 2 | 태양광 모듈 결함 드론 CV 시각 식별 시스템 | 드론 점검 촬영과 열적외선 이미지 분석을 수행합니다. 결함 탐지 표시를 제공합니다 |
| 3 | 전력 현물 거래 가격 AI 추세 예측과 자동 수익 전략 Agent | 전력 시장 데이터를 수집하고 가격 예측 모델을 사용합니다. 전략 생성과 거래 실행을 제공합니다 |
| 4 | 에너지 저장 배터리 건강도 AI 비파괴 검사와 열폭주 위험 경고 시스템 | 배터리 운전 데이터를 모니터링하고 건강도 평가 모델을 사용합니다. 위험 경고를 푸시합니다 |
| 5 | 기업 전 링크 탄소 배출 AI 자동 산정과 ESG 보고서 생성 도우미 | 에너지 소비 데이터를 수집하고 탄소 배출 계수를 계산합니다. ESG 보고서를 자동 생성합니다 |
| 6 | 전력망 극단 기상 부하 AI 예측과 비상 dispatch 지휘 시스템 | 기상 데이터를 연결하고 부하 예측 모델을 사용합니다. dispatch 전략을 생성합니다 |
| 7 | 주유소 위반 행동 AI 영상 식별과 경보 감시자 | 영상 감시를 분석하고 위반 행동(전화, 흡연 등)을 탐지합니다. 경고를 푸시합니다 |
| 8 | 장거리 송유·가스관 누출 음파 AI 모니터링과 정밀 위치 지정 시스템 | 음파 센서 데이터를 수집하고 누출 탐지 모델을 사용합니다. 위치 지정 알고리즘으로 계산합니다 |
| 9 | 가상 발전소 자원 집합과 AI 전력 거래 의사결정 시스템 | 분산 자원을 연결하고 집합 최적 dispatch를 수행합니다. 거래 전략을 실행합니다 |
| 10 | 광산 인원 위치 AI 추적과 위험 구역 침입 경보 | UWB/블루투스 위치 지정으로 인원 궤적을 추적합니다. 위험 구역 전자 펜스를 제공합니다 |

## 17. 오디오와 비디오

오디오와 비디오 장면은 콘텐츠 생산과 미디어 처리에 집중합니다. 흔한 앱에는 영상 편집, 음성 합성, 자막 생성, 영상 복원 등이 있으며, 오디오·비디오 콘텐츠의 생산 효율과 품질을 높입니다.

| 번호 | 앱 장면 이름 | 구현 참고 |
| :--: | ------------ | -------- |
| 1 | 장편 영상 하이라이트 AI 식별과 짧은 영상 자동 편집 도구 | 영상 내용을 분석하고 키프레임을 식별합니다. 하이라이트 장면을 자동 편집합니다 |
| 2 | 영상 배경 소음 AI 지능형 분리와 음성 강화 도우미 | 오디오 분리 모델로 배경 소음을 제거합니다. 음성을 강화 처리합니다 |
| 3 | 오래된 영상 4K 초해상 복원과 AI 지능형 색 입히기 워크벤치 | 영상 초해상도 모델로 오래된 화질을 복원합니다. AI가 자동으로 색을 입힙니다 |
| 4 | 텍스트를 실제 사람 수준 TTS 더빙으로 바꾸는 감정 제어 시스템 | 다중 음색 TTS 모델과 감정 제어 생성을 제공합니다. 오디오 내보내기를 지원합니다 |
| 5 | 영상 음성 ASR 자동 인식과 이중 언어 자막 생성 도구 | 음성 인식으로 자막을 생성하고 여러 언어로 번역합니다. 이중 언어 자막을 겹쳐 표시합니다 |
| 6 | 영상 화면 불필요 객체 AI 지능형 지우기 엔진 | 영상 객체 추적, 객체 제거 복원, 프레임 간 일관성 처리를 수행합니다 |
| 7 | 저작권 없는 배경음악 AIGC 자동 작곡기 | 음악 생성 모델을 사용하고 감정 스타일을 제어할 수 있습니다. 저작권 검사를 제공합니다 |
| 8 | 특정 인물 음색 AI 클론과 변성 변환 소프트웨어 | 소량의 음성 샘플로 음색 모델을 학습합니다. 변성 처리를 제공합니다 |
| 9 | 대본 원클릭 콘티 스크립트 변환과 AI 동적 프리비즈 영상 생성 플랫폼 | 대본을 파싱해 콘티를 생성하고, AI가 프리비즈 영상을 생성합니다 |
| 10 | 회의 녹음 AI 지능형 전사와 핵심 할 일 추출 도우미 | 여러 사람 회의 음성을 분리 전사하고, LLM이 할 일을 추출합니다. 타임스탬프를 표시합니다 |

## 18. AI 마케팅

AI 마케팅 장면은 마케팅 효율과 창의 산출을 높이는 데 힘씁니다. 핵심 앱에는 문안 생성, 포스터 설계, 핫이슈 추적, 경쟁사 분석 등이 있으며, 기업이 정밀 마케팅과 브랜드 전파를 구현하도록 돕습니다.

| 번호 | 앱 장면 이름 | 구현 참고 |
| :--: | ------------ | -------- |
| 1 | Xiaohongshu 히트 문안 AIGC 자동 작성 엔진 | 주제를 입력하면 LLM이 추천형 문안을 생성합니다. 이모지와 주제 태그를 최적화합니다 |
| 2 | 마케팅 포스터 AI 지능형 레이아웃과 다중 사이즈 적응 도구 | 문안을 입력하면 포스터 템플릿을 지능적으로 매칭하고 여러 사이즈로 내보냅니다 |
| 3 | 브랜드 LOGO 창의 AIGC 생성과 VI 체계 구축 플랫폼 | 브랜드 키워드를 입력하면 LOGO 아이디어를 생성합니다. VI 규범을 생성합니다 |
| 4 | 전 웹 핫이슈 AI 추적과 트렌드 활용 마케팅 아이디어 생성 도우미 | 핫이슈 데이터를 수집하고 LLM이 마케팅 각도를 분석합니다. 창의 방안을 생성합니다 |
| 5 | 광고 집행 ROI 실시간 모니터링과 AI 예산 입찰 매니저 | 광고 플랫폼 데이터를 연결하고 효과 분석 모델을 사용합니다. 입찰 전략을 최적화합니다 |
| 6 | 경쟁사 마케팅 전략 심층 해석과 AI 주간 보고서 생성기 | 경쟁사 콘텐츠를 수집 분석하고 전략을 추출합니다. 주간 보고서를 자동 생성합니다 |
| 7 | 검색엔진 키워드 AI 배치와 유입 글 대량 작성 | 키워드를 분석하고 글을 대량 생성합니다. SEO 최적화 제안을 제공합니다 |
| 8 | 천인천면 개인화 마케팅 메일 AI 작성 전문가 | 사용자 프로필 데이터로 개인화 콘텐츠를 생성합니다. A/B 테스트를 지원합니다 |
| 9 | 브랜드 평판 전 웹 모니터링과 여론 위기 AI 경고 레이더 | 전 웹 여론 데이터를 수집하고 감정을 분석합니다. 위기 경고를 푸시합니다 |
| 10 | 짧은 영상 스크립트 아이디어 AIGC 생성과 콘티 지도 도우미 | 주제를 입력하면 스크립트와 콘티를 생성합니다. 촬영 제안을 안내합니다 |

## 19. 데이터 지능

데이터 지능 장면은 데이터 분석과 가치 발굴에 집중합니다. 대표 앱에는 자연어 질의, 시각화 생성, 데이터 거버넌스, 지식 그래프 구축 등이 있으며, 기업이 데이터 기반 의사결정 지원을 구현하도록 돕습니다.

| 번호 | 앱 장면 이름 | 구현 참고 |
| :--: | ------------ | -------- |
| 1 | Text-to-SQL 기반 자연어 데이터 조회 엔진 | 자연어를 SQL 질의로 변환하고 결과를 시각화해 표시합니다 |
| 2 | 대화형 BI: 한 문장으로 시각화 차트 생성 | 데이터 요구를 설명하면 차트를 자동 생성합니다. 여러 차트 유형 전환을 지원합니다 |
| 3 | 스크린샷 원클릭 Excel 표 인식 도구 | 스크린샷 업로드 후 VLM이 표 구조와 데이터를 인식합니다. Excel 파일로 내보냅니다 |
| 4 | 이미지와 스크린샷을 Excel 표로 바꾸는 AI 인식 도구 | 이미지 OCR이 표 구조를 인식하고 데이터를 Excel로 내보냅니다 |
| 5 | 다중 출처 이기종 데이터 지식 그래프 자동 구축 | 여러 데이터 소스를 연결하고 엔티티와 관계를 추출합니다. 그래프 데이터베이스에 저장합니다 |
| 6 | 데이터 보고서 지능형 해석과 추세 분석 도우미 | 데이터 보고서 이미지를 업로드하거나 데이터를 입력하면 VLM이 차트 내용을 해석하고 추세를 분석합니다 |
| 7 | 데이터베이스 테이블 구조 지능형 해석과 질의 예시 생성 도우미 | 테이블명이나 필드 설명을 입력하면 LLM이 테이블 생성 설명과 예시 SQL 질의를 생성합니다 |
| 8 | 기업 마스터 데이터 지능형 정렬과 AI 중복 제거 거버넌스 | 다중 출처 마스터 데이터를 매칭하고 중복 기록을 식별합니다. 병합 규칙 설정을 제공합니다 |
| 9 | 데이터 요구 문서 지능형 테스트 케이스 변환 도구 | 데이터 요구 설명을 입력하면 LLM이 테스트 장면과 검증 케이스를 생성합니다 |
| 10 | 데이터 지표 정의 지능형 질의응답 도우미 | 지표 정의 문서를 바탕으로 지식베이스를 구축하고, LLM이 지표 정의와 계산 로직 등 질문에 답합니다 |

</TabItem>
<TabItem label="B2C 소비">

## 장 안내

<ChapterIntroduction :duration="cDuration" :tags="['C 사이드 앱', '생활 방식', '감정 경험', '분위기 조성']" coreOutput="생활 장면 영감 15개 이상 발견" expectedOutput="사용자를 움직이는 제품 방향 찾기">

이 문서는 <strong>LLM 대형 모델이 C 사이드 소비 장면에서 창의적으로 적용될 수 있는 방향</strong>을 정리합니다. 효율과 고통 지점에 관심을 두는 B 사이드와 달리, C 사이드 제품은 <strong>느낌, 심리적 암시, 분위기 조성</strong>을 더 중시하며, 사용자가 사용 과정에서 감정적 공명과 좋은 경험을 얻도록 합니다.

</ChapterIntroduction>

## 장면 분위기 빠른 선택

<el-card shadow="hover" style="margin-top: 16px; margin-bottom: 24px; border-left: 5px solid #ec4899;">
  <div style="font-weight: 600; margin-bottom: 8px;">당신을 건드리는 장면 영감 찾기</div>
  <div style="color: #606266; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
    원하는 분위기와 지금의 느낌을 선택하면, 시스템이 관련 장면 방향을 추천합니다. 태그를 클릭하면 해당 절로 이동합니다.
  </div>
  <el-row :gutter="16">
    <el-col :span="12">
      <el-select v-model="vibePoint" placeholder="분위기 유형 선택" style="width: 100%;">
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
      <el-select v-model="feeling" placeholder="현재 느낌 선택" style="width: 100%;">
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
      당신을 위한 {{ cCurrentSelection.vibe }} × {{ cCurrentSelection.feeling }} 장면 추천:
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
      다시 선택
    </el-button>
  </div>
</el-card>

---

## 1. 생활 방식

> 💡 **핵심 관념**: 평범한 일상을 의식감 있게 만들고, 세부 속에서 아름다움을 창조합니다.

| 번호 | 앱 장면 이름 | 앱 장면 기능 |
| :--: | ------------ | ------------ |
| 1 | 아침 의식감 깨우기 도우미 | 날씨 API와 캘린더 데이터를 통합하고 LLM이 개인화된 아침 방안을 생성합니다. 스마트 스피커로 맞춤 음악을 재생하고 스마트 조명을 서서히 밝힙니다 |
| 2 | 혼자 사는 생활 분위기 연출가 | 스마트홈 기기(조명, 스피커, 디퓨저)를 연결하고, LLM이 시간/기분에 따라 매개변수를 자동 조절합니다. 사용자 선호를 학습해 계속 최적화합니다 |
| 3 | 주말 집콕 치유 계획 생성기 | 스트리밍 플랫폼 API와 연결해 영화 목록을 가져오고, 사용자 과거 선호를 결합해 영화+음식+공간 꾸미기의 조합 방안을 생성합니다 |
| 4 | 잠들기 전 마음 위로 라디오 | TTS 음성 합성으로 부드러운 이야기를 만들고, 백색소음 혼합 알고리즘과 스마트 볼륨 페이드아웃을 적용합니다. 수면 데이터에 따라 내용을 조정합니다 |
| 5 | 생활 미학 영감 포착기 | 이미지 인식으로 사용자 환경 사진을 분석하고 LLM이 미학 제안을 생성합니다. Pinterest/Xiaohongshu 스타일 콘텐츠를 추천합니다 |

---

## 2. 감정적 동행

> 💡 **핵심 관념**: 무조건적인 수용과 동행으로 감정을 담아 주는 부드러운 그릇이 됩니다.

| 번호 | 앱 장면 이름 | 앱 장면 기능 |
| :--: | ------------ | ------------ |
| 1 | 깊은 밤의 마음 구멍 청취자 | 종단 간 암호화로 개인정보를 보장하고, LLM 감정 분석으로 감정을 이해하며, 장기 기억에 사용자 이야기를 저장하고 다회차 대화로 계속 동행합니다 |
| 2 | 이별 치유 동행자 | 감정 단계 인식 알고리즘으로 단계별 지원을 제공합니다(털어놓기 단계 -> 쏟아내기 단계 -> 재건 단계). 심리학 지식베이스 RAG 검색을 사용합니다 |
| 3 | 불안 완화 호흡 코치 | 생체 센서 데이터(심박/호흡)를 연결하고 불안 수준을 실시간으로 감지합니다. 음성으로 호흡 리듬과 점진적 근육 이완을 안내합니다 |
| 4 | 자신감 재건 멘토 | 긍정심리학 대화 프레임워크로 사용자의 작은 성취를 기록하고 피드백합니다. 인지 재구성 기술로 부정적 자기 대화를 바꾸도록 돕습니다 |
| 5 | 감정 일기 지능형 해석 | 감정 인식 NLP 모델과 시계열 분석으로 감정 패턴을 발견합니다. 감정 그래프를 시각화하고 예측성 감정 경고를 제공합니다 |

---

## 3. 엔터테인먼트와 휴식

> 💡 **핵심 관념**: 몰입형 경험을 만들어 엔터테인먼트가 마음의 쉴 곳이 되게 합니다.

| 번호 | 앱 장면 이름 | 앱 장면 기능 |
| :--: | ------------ | ------------ |
| 1 | 몰입형 추리 게임 DM | LLM이 실시간으로 이야기 분기를 생성하고, 음성 합성으로 NPC를 연기하며, 플레이어 반응에 따라 난이도와 리듬을 동적으로 조정합니다. AR/VR 장면을 렌더링합니다 |
| 2 | 오픈월드 게임의 영혼 있는 NPC | 장기 기억 데이터베이스에 플레이어 상호작용 기록을 저장하고, LLM이 개인화 대화를 생성합니다. 감정 컴퓨팅으로 NPC가 실제 감정 반응을 갖게 합니다 |
| 3 | 개인화 팟캐스트 콘텐츠 생성 | 사용자 관심 그래프에 따라 전용 콘텐츠를 생성하고, TTS로 사용자가 좋아하는 목소리를 복제합니다. 실시간 상호작용으로 청취자 질문에 답합니다 |
| 4 | 가상 콘서트 분위기 팀 | 가상 아바타 렌더링, 실시간 댓글 상호작용, 가상 응원봉/응원 도구를 제공합니다. 공간 음향 기술로 현장감을 만듭니다 |
| 5 | 인터랙티브 소설 공동 창작 파트너 | LLM이 실시간으로 이야기를 생성하고, 사용자 선택이 이야기 방향에 영향을 줍니다. 다중 엔딩을 설계하고 인물 관계를 동적으로 발전시킵니다 |

---

## 4. 개인 성장

> 💡 **핵심 관념**: 성장은 고행이 아니라 재미있는 자기 발견의 여정입니다.

| 번호 | 앱 장면 이름 | 앱 장면 기능 |
| :--: | ------------ | ------------ |
| 1 | 개인 성장 목격자 | 타임라인 시각화로 성장 궤적을 보여 주고, 이정표를 자동 표시합니다. "과거의 나"와 "지금의 나"를 비교 이미지로 보여 줍니다 |
| 2 | 습관 형성 게임화 코치 | 게임화 메커니즘(경험치, 레벨, 배지), 소셜 순위표, AI 코치 역할극(예: "모험 멘토")을 제공합니다 |
| 3 | 기술 학습 메이트 매칭 | 관심사와 학습 목표 기반 매칭 알고리즘, 학습 그룹 커뮤니티, 서로 감독하는 체크인 메커니즘을 제공합니다 |
| 4 | 매일의 작은 행복 발견자 | 이미지 인식으로 생활 속 아름다운 순간을 발견하고, 감사 일기 안내와 매주 좋은 순간 회고를 제공합니다 |
| 5 | 인생 시뮬레이션 체험기 | 다중 분기 이야기로 서로 다른 선택의 결과를 시뮬레이션하고, 평행 인생을 비교합니다. 의사결정 결과를 시각화합니다 |

---

## 5. 소셜 상호작용

> 💡 **핵심 관념**: 소셜을 가볍고 자연스럽게 만들고, 편안한 연결 방식을 찾습니다.

| 번호 | 앱 장면 이름 | 앱 장면 기능 |
| :--: | ------------ | ------------ |
| 1 | 아이스브레이킹 대화 주제 생성기 | 장소와 참여자 기반의 지능형 주제 추천, 실시간 대화 분석을 통한 후속 주제 제안, 어색한 순간의 구원 힌트를 제공합니다 |
| 2 | 친구 피드 문구 분위기 연출가 | 이미지 콘텐츠를 분석하고 LLM이 여러 스타일의 문구(문학적/유머러스/깊은 톤)를 생성합니다. 이모지와 레이아웃을 지능적으로 추천합니다 |
| 3 | 데이트 분위기 기획자 | 양쪽 관심사를 바탕으로 데이트 방안을 생성하고, 식당/활동 추천과 대화 주제 제안을 제공합니다. 실시간 날씨와 교통 알림을 포함합니다 |
| 4 | 원격 모임 분위기 담당 | 온라인 게임 라이브러리, 아이스브레이킹 활동 생성기, 주제 룰렛을 제공합니다. 가상 배경과 필터로 분위기를 강화합니다 |
| 5 | 소셜 에너지 관리 도우미 | 소셜 활동 후 에너지 소모를 평가하고 회복 제안(혼자 하는 활동 추천)을 제공합니다. 소셜 캘린더를 지능적으로 계획합니다 |

---

## 6. 창의적 표현

> 💡 **핵심 관념**: 모든 사람에게는 창의력이 있고, 다만 깨워질 필요가 있습니다.

| 번호 | 앱 장면 이름 | 앱 장면 기능 |
| :--: | ------------ | ------------ |
| 1 | 영감 고갈 응급 키트 | 분야 간 연상 알고리즘, 무작위 자극어 생성, 창의적 프롬프트 라이브러리, 마인드맵식 영감 발산 도구를 제공합니다 |
| 2 | 개인 스타일 탐색 가이드 | 이미지 분석으로 사용자의 기존 스타일을 식별하고, 스타일 트렌드를 추천하며, 가상 착장/메이크업을 제공합니다. 스타일 진화 타임라인을 보여 줍니다 |
| 3 | 다이어리와 일기 미학 컨설턴트 | 레이아웃 템플릿 추천, 색 조합 방안 생성, 장식 요소 제안을 제공합니다. 손글씨 인식과 콘텐츠 미화를 지원합니다 |
| 4 | 사진 구도 분위기 가이드 | 장면 인식과 구도 제안, 필터 스타일 추천, 보정 매개변수 지능 조정을 제공합니다. 촬영 기술 학습 경로를 제시합니다 |
| 5 | 음악 기분 매칭 전문가 | 음악 감정 분석 알고리즘, 사용자 기분 인식, 개인화 재생목록 생성을 제공합니다. 음악 이야기와 배경 소개도 제공합니다 |

---

## 7. 여행 탐색

> 💡 **핵심 관념**: 여행은 풍경을 보는 것뿐 아니라 서로 다른 생활 방식을 느끼는 일입니다.

| 번호 | 앱 장면 이름 | 앱 장면 기능 |
| :--: | ------------ | ------------ |
| 1 | 도시 산책 탐색 가이드 | 현지 고수 콘텐츠를 모으고, 덜 알려진 장소를 추천하며, AR 내비게이션 안내를 제공합니다. 실시간 번역과 음성 해설을 지원합니다 |
| 2 | 여행 기분 일기 생성 | 사진을 자동 분류하고 선별하며, LLM이 아름다운 여행기를 생성하고 위치 표시 타임라인을 만듭니다. 여행 영상을 한 번에 생성합니다 |
| 3 | 혼자 여행 동행 도우미 | 실시간 위치 공유와 안전 알림, 현지 긴급 연락처, AI 가이드 음성 동행을 제공합니다. 혼자 여행 커뮤니티 교류를 지원합니다 |
| 4 | 목적지 분위기 미리보기 | VR/360도 파노라마 미리보기, 현지 소리와 향기 시뮬레이션, 문화 배경 소개를 제공합니다. 가상 "미리 살아보기" 경험을 제공합니다 |
| 5 | 여행 사진 분위기 지도 | 골든아워 알림, 구도 보조선, 현지 특색 촬영 지점 추천을 제공합니다. 후보정 색감 스타일 제안을 제공합니다 |

---

## 8. 몸과 마음의 건강

> 💡 **핵심 관념**: 건강은 목표가 아니라 부드러운 자기 돌봄의 방식입니다.

| 번호 | 앱 장면 이름 | 앱 장면 기능 |
| :--: | ------------ | ------------ |
| 1 | 운동 동기 깨우기 코치 | 사용자 상태에 따라 운동 유형을 지능적으로 추천하고, 5분짜리 미니 운동 옵션과 게임화 운동 챌린지를 제공합니다. 소셜 운동 체크인을 지원합니다 |
| 2 | 건강 식단 영감 주방 | 냉장고 식재료를 인식하고, 개인화 레시피 추천과 영양 조합 분석을 제공합니다. 단계별 조리 안내를 지원합니다 |
| 3 | 수면 품질 최적화 분위기 연출가 | 수면 모니터링 데이터를 분석하고, 잠들기 전 의식을 생성하며, 환경 최적화 제안(온도/습도/빛)을 제공합니다. 스마트 기상을 지원합니다 |
| 4 | 몸 감각 안내자 | 바디 스캔 명상 안내, 신체 부위와 감정의 연결, 몸과 마음 연결 연습을 제공합니다. 생체 피드백을 시각화합니다 |
| 5 | 자기 돌봄 알림 도우미 | 업무 강도를 모니터링하고, 정기 휴식 알림과 작은 돌봄 활동 제안(물 마시기/스트레칭/깊은 호흡)을 제공합니다. 자기 돌봄을 기록합니다 |

---

## 9. 지식 탐색

> 💡 **핵심 관념**: 학습은 끝없는 모험이고, 호기심은 최고의 선생님입니다.

| 번호 | 앱 장면 이름 | 앱 장면 기능 |
| :--: | ------------ | ------------ |
| 1 | 지식 탐색 게임화 가이드 | 지식 지도를 시각화하고, 스테이지형 학습 경로와 성취 배지 시스템을 제공합니다. AI 멘토 역할극을 지원합니다 |
| 2 | 언어 학습 상황 파트너 | LLM이 서로 다른 역할을 맡아 대화하고, 발음 교정과 문화 배경 소개를 제공합니다. 몰입형 상황 시뮬레이션을 지원합니다 |
| 3 | 호기심 충족 도우미 | 위키백과/지식 그래프를 연결하고, 복잡한 개념을 쉽게 설명하며, 관련 지식을 추천합니다. 호기심 기록을 제공합니다 |
| 4 | 독서 노트 영감 자극 | 책 내용을 분석하고, 관점 추출과 연결, 사고 각도 추천을 제공합니다. 독서 노트 템플릿과 미화를 지원합니다 |
| 5 | 지식 공유 분위기 조성 | 지식 카드를 자동 생성하고, 공유 문구를 최적화하며, 시각적으로 미화합니다. 소셜 공유 데이터 피드백을 제공합니다 |

---

## 10. 관계 운영

> 💡 **핵심 관념**: 좋은 관계는 정성껏 운영해야 하지만, 정성이 꼭 복잡할 필요는 없습니다.

| 번호 | 앱 장면 이름 | 앱 장면 기능 |
| :--: | ------------ | ------------ |
| 1 | 친밀한 관계 소통 코치 | 감정 표현 템플릿 생성, 비폭력 대화 기술 안내, 갈등 해소 말투를 제공합니다. 관계 건강도를 평가합니다 |
| 2 | 가족 돌봄 알림 도우미 | 중요한 날짜(생일/기념일)를 알려 주고, 돌봄 표현 제안과 가족 활동 추천을 제공합니다. 가족 앨범을 생성합니다 |
| 3 | 우정 유지 분위기 연출가 | 친구 상호작용 기록, 공통 주제 추천, 원격 모임 조직을 제공합니다. 우정 타임라인과 추억을 생성합니다 |
| 4 | 고백과 서프라이즈 기획자 | 개인화된 서프라이즈 방안, 선물 추천, 로맨틱한 말투 제안을 제공합니다. 실행 일정표와 알림을 제공합니다 |
| 5 | 갈등 완화 분위기 안내 | 감정 냉각 말투, 입장 바꿔 생각하기 안내, 화해 단계 제안을 제공합니다. 관계 회복을 추적합니다 |

---

## 11. 반려동물 동행

> 💡 **핵심 관념**: 반려동물은 가족이고, 그들의 동행은 기록되고 소중히 여겨질 가치가 있습니다.

| 번호 | 앱 장면 이름 | 앱 장면 기능 |
| :--: | ------------ | ------------ |
| 1 | 반려동물 의인화 일기 | 반려동물 행동을 분석하고, 1인칭 일기를 생성하며, 사진을 자동으로 매칭합니다. 반려동물 "친구 피드"를 제공합니다 |
| 2 | 반려동물 행동 해석가 | 반려동물 행동 영상을 분석하고, 건강 경고와 훈련 제안을 제공합니다. 품종 특성 지식베이스를 제공합니다 |
| 3 | 반려동물 동행 시간 기획 | 반려동물 활동 추천, DIY 장난감 튜토리얼, 반려동물 친화 장소 추천을 제공합니다. 반려동물 소셜 매칭을 지원합니다 |
| 4 | 반려동물 추억 이야기 생성 | 사진과 영상을 선별하고, 타임라인 이야기를 생성하며, 음악을 매칭합니다. 추억책/영상을 자동 생성합니다 |
| 5 | 초보 반려인 안심 가이드 | 단계별 돌봄 가이드, 자주 묻는 질문 답변, 긴급 상황 처리를 제공합니다. 초보자 커뮤니티 지원을 제공합니다 |

---

## 12. 재무 건강

> 💡 **핵심 관념**: 재무 자유가 목표가 아니라, 재무 건강이 핵심입니다.

| 번호 | 앱 장면 이름 | 앱 장면 기능 |
| :--: | ------------ | ------------ |
| 1 | 소비 감정 알아차림 도우미 | 소비 기록을 분석하고, 감정-소비 연관 분석과 충동 소비 경고를 제공합니다. 대체 만족 제안을 제공합니다 |
| 2 | 저축 목표 시각화 동기부여 | 목표 진척도를 시각화하고, 꿈의 장면을 렌더링하며, 이정표를 축하합니다. 저축 습관 형성 게임을 제공합니다 |
| 3 | 재테크 지식 쉽게 배우기 | 자투리 지식 푸시, 장면화 사례 교육, 인터랙티브 질의응답을 제공합니다. 지식 검사와 인증서를 제공합니다 |
| 4 | 재무 불안 완화 코치 | 재무 상태 건강 평가, 스트레스 관리 기술, 작은 행동 계획을 제공합니다. 재무 심리 상담을 지원합니다 |
| 5 | 소액 투자 체험 게임 | 가상 투자 시뮬레이션, 위험 교육, 투자 포트폴리오 게임을 제공합니다. 실제 소액 투자 안내를 제공합니다 |

---

## 13. 커리어 발전

> 💡 **핵심 관념**: 커리어는 정해진 궤도가 아니라 탐색할 수 있는 들판입니다.

| 번호 | 앱 장면 이름 | 앱 장면 기능 |
| :--: | ------------ | ------------ |
| 1 | 커리어 방황 동행자 | 직업 관심사 평가, 역량 점검, 업계 정보 추천을 제공합니다. 커리어 멘토 대화를 지원합니다 |
| 2 | 일의 성취감 깨우기 코치 | 업무 성과를 기록하고, 가치를 추출하며, 성취를 시각화합니다. 동료/고객의 긍정 피드백을 수집합니다 |
| 3 | 직장 소셜 분위기 도우미 | 직장 대화 주제 추천, 네트워킹 기술, 업계 행사 추천을 제공합니다. LinkedIn 콘텐츠 최적화를 지원합니다 |
| 4 | 사이드 프로젝트 영감 자극기 | 기술-관심사-시장 요구를 매칭하고, 부업 사례 라이브러리와 시작 가이드를 제공합니다. 부업 커뮤니티 교류를 지원합니다 |
| 5 | 면접 전 자신감 충전소 | 모의 면접, 자주 나오는 질문 준비, 자신감 향상 기술을 제공합니다. 이미지 제안을 제공합니다 |

---

## 14. 집 공간

> 💡 **핵심 관념**: 집은 단지 거주하는 곳이 아니라, 마음이 머무는 곳입니다.

| 번호 | 앱 장면 이름 | 앱 장면 기능 |
| :--: | ------------ | ------------ |
| 1 | 집 공간 분위기 디자이너 | 공간 사진을 분석하고, 스타일과 가구/장식을 추천합니다. AR 미리보기를 제공합니다 |
| 2 | 사계절 집 꾸미기 변화 가이드 | 계절 테마 추천, 수납과 전시 제안, 명절 장식 방안을 제공합니다. 쇼핑 목록을 생성합니다 |
| 3 | 작은 집 공간 마법 | 공간 최적화 알고리즘, 다기능 가구 추천, 수납 팁을 제공합니다. 시각적 확장 팁을 제공합니다 |
| 4 | 집 생활 의식감 창조자 | 일상 의식(아침/저녁/주말)을 설계하고, 의식 실행 알림을 제공합니다. 의식 효과 피드백을 제공합니다 |
| 5 | 정리와 비움 심리 동행 | 물건의 감정적 가치를 평가하고, 정리와 비움 단계를 안내하며, 심리적 지원을 제공합니다. 기부/재활용 채널을 추천합니다 |

---

## 15. 음식과 요리

> 💡 **핵심 관념**: 음식은 사랑의 언어이고, 요리는 사랑을 표현하는 방식입니다.

| 번호 | 앱 장면 이름 | 앱 장면 기능 |
| :--: | ------------ | ------------ |
| 1 | 혼밥 치유 요리 | 냉장고 식재료를 인식하고 간단한 레시피를 추천하며 단계별 안내를 제공합니다. 혼밥 플레이팅 미학을 제안합니다 |
| 2 | 명절 식탁 분위기 설계 | 명절 테마 메뉴, 식탁 배치 방안, 분위기 조성 팁을 제공합니다. 손님 경험을 최적화합니다 |
| 3 | 요리 기분 매칭 전문가 | 기분-음식 연관 알고리즘, 감정 조절 레시피, 위로 음식 추천을 제공합니다. 요리 치유 안내를 제공합니다 |
| 4 | 요리 초보 자신감 세우기 | 아주 간단한 레시피, 실패 수습 팁, 자신감 세우기 말투를 제공합니다. 점진적 난이도 향상을 지원합니다 |
| 5 | 음식 사진 분위기 가이드 | 음식 플레이팅 제안, 자연광 활용, 촬영 각도 안내를 제공합니다. 필터와 후보정 제안을 제공합니다 |

---

## 16. 착장과 스타일

> 💡 **핵심 관념**: 착장은 자기표현이고, 스타일은 내면의 외적 표현입니다.

| 번호 | 앱 장면 이름 | 앱 장면 기능 |
| :--: | ------------ | ------------ |
| 1 | 오늘의 착장 무드보드 | 날씨/상황/기분을 종합해 추천하고, 가상 착장을 제공하며, 코디 영감을 제공합니다. 옷장 관리를 지원합니다 |
| 2 | 캡슐 옷장 코디 전문가 | 옷장을 점검하고, 아이템 코디 조합과 한 옷 여러 번 입기 방안을 제공합니다. 쇼핑 제안(빈틈 채우기)을 제공합니다 |
| 3 | 개인 스타일 탐색 여행 | 스타일 테스트, 참고 아이콘 추천, 스타일 진화 경로를 제공합니다. 자신감 구축을 돕습니다 |
| 4 | 헌 옷 새롭게 입기 크리에이터 | 헌 옷 리폼 영감, 새로운 코디 방식, 액세서리 포인트 팁을 제공합니다. 지속 가능한 패션 관념을 제시합니다 |
| 5 | 특별한 자리 스타일링 컨설턴트 | 자리별 드레스 코드 해석, 스타일링 방안 생성, 메이크업과 헤어 제안을 제공합니다. 전체 스타일링 조화를 돕습니다 |

---

## C 사이드 제품을 설계하는 핵심 마음가짐

### 1. "기능"에서 "감정"으로

B 사이드 제품은 "이 기능이 어떤 문제를 해결하는가"에 관심을 두고, C 사이드 제품은 "이 기능이 어떤 느낌을 가져오는가"에 관심을 둡니다.

| B 사이드 사고 | C 사이드 사고 |
|---------|---------|
| 효율 향상 | 좋아하는 일을 할 시간을 아껴 줌 |
| 비용 절감 | 돈 하나하나가 아깝지 않게 함 |
| 고통 지점 해결 | 좋은 경험 창조 |
| 기능 완비 | 느낌이 제대로 닿음 |

### 2. 분위기를 만드는 세 층위

**감각층**: 시각, 청각, 촉각의 설계
- 따뜻한 색
- 편안한 소리
- 매끄러운 모션

**감정층**: 감정의 공명과 안내
- 사용자의 마음 이해하기
- 감정적 지원 제공하기
- 긍정적 감정 만들기

**의미층**: 가치의 인정과 소속
- 사용자가 이해받고 있다고 느끼게 하기
- 소속감 만들기
- 행동에 의미 부여하기

### 3. 심리적 암시의 힘

C 사이드 제품의 문구와 설계는 모두 심리적 암시를 전달합니다.

- **긍정 암시**: "이미 충분히 잘하고 있어요", "천천히 해도 괜찮아요"
- **소속 암시**: "많은 사람이 당신과 같아요", "당신은 혼자가 아니에요"
- **성장 암시**: "모든 시도는 진전이에요", "당신은 더 좋아지고 있어요"

### 4. 사용자가 더 나은 자신이 되게 하기

최고의 C 사이드 제품은 사용자를 바꾸는 것이 아니라, 사용자가 되고 싶은 자신이 되도록 돕습니다.

- "당신은 ...해야 한다"가 아니라 "당신은 ...할 수 있다"
- "반드시 ...해야 한다"가 아니라 "원한다면 ..."
- "아직 부족하다"가 아니라 "이미 ..."

---

> 🌟 **기억하세요**: C 사이드 사용자가 사는 것은 기능이 아니라 느낌이고, 도구가 아니라 동행이며, 서비스가 아니라 이해입니다.

</TabItem>
</Tabs>
