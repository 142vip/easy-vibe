---
title: 'Double Diamond: 올바른 일을 먼저 하고, 그 일을 제대로 하기'
description: '제로 베이스 독자를 위한 Double Diamond 입문 글입니다. Discover, Define, Develop, Deliver 네 단계를 이해하고, 문제가 명확해지기 전에 서둘러 프로토타입을 만드는 일을 피합니다.'
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'
</script>

# Double Diamond: 올바른 일을 먼저 하고, 그 일을 제대로 하기

<a id="top-dd"></a>

요구 분석과 사용자 인터뷰를 마치면 서로 다른 사용자의 경험, 기존 도구의 문제, 여러 개선 방향처럼 많은 자료가 쌓입니다. 자료가 늘어난 다음의 어려움은 무엇을 남기고 무엇을 버릴지 정하는 일입니다.

‘문제 이해’와 ‘해결책 설계’를 구분하지 않으면 인터뷰를 하면서도 자신이 선호하는 기능을 뒷받침할 이유를 찾기 쉽습니다. Double Diamond는 두 번의 발산과 수렴으로 이 두 종류의 일을 분리합니다.

이 장에서는 Discover, Define, Develop, Deliver 네 단계와 각 단계의 입력, 산출물, 흔한 오류를 설명합니다.

<a id="dd-what"></a>
## [1. 두 번의 발산과 수렴](#top-dd)

Double Diamond 모델은 영국 **Design Council**이 보급한 고전적인 디자인 프로세스 프레임워크입니다. 완전한 디자인과 혁신 과정을 두 개의 연속된 다이아몬드 모양으로 표현합니다.

"다이아몬드"인 이유는, 각 다이아몬드가 서로 반대되지만 모두 중요한 두 가지 동작을 포함하기 때문입니다:

- **발산**: 먼저 시야를 넓혀 더 많은 가능성을 봅니다
- **수렴**: 그런 다음 범위를 좁혀 판단하고 선택합니다

전체 과정은 총 4단계입니다:

1. **Discover**: 사용자, 문제, 환경, 시장을 폭넓게 이해
2. **Define**: 대량의 정보에서 정말로 해결할 가치가 있는 핵심 문제를 추출
3. **Develop**: 핵심 문제를 중심으로 다양한 솔루션을 발산
4. **Deliver**: 선별, 프로토타입, 테스트 및 더 적합한 솔루션 전달

앞의 두 단계는 문제 공간을, 뒤의 두 단계는 해결책 공간을 다룹니다.

<figure class="field-figure field-figure--diagram"><a href="https://www.designcouncil.org.uk/resources/framework-for-innovation/" target="_blank" rel="noreferrer"><img src="/images/product-discovery/double-diamond/design-council-double-diamond-wide.png" alt="Discover, Define, Develop, Deliver가 두 개의 연결된 다이아몬드를 이루는 Design Council 공식 도표" loading="lazy" /></a><figcaption><strong>먼저 원본 도표를 봅니다.</strong> 왼쪽은 Discover에서 발산하고 Define에서 수렴하며, 오른쪽은 Develop에서 다시 발산하고 Deliver에서 수렴합니다. 테스트에서 문제가 발견되면 앞 단계로 돌아갈 수 있습니다. 출처: <a href="https://www.designcouncil.org.uk/resources/framework-for-innovation/" target="_blank" rel="noreferrer">Design Council</a>, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>.</figcaption></figure>

이 네 단계를 가장 기억하기 쉬운 한 문장으로 압축하면:

- **첫 번째 다이아몬드**: 먼저 무엇을 해결해야 하는지 명확히 파악하기
- **두 번째 다이아몬드**: 그 문제를 어떤 솔루션으로 해결할지 결정하기

이것은 아까 정확하게 말씀하신 그 문장이기도 합니다:

- **첫 번째 다이아몬드: 올바른 일을 하기**
- **두 번째 다이아몬드: 일을 올바르게 하기**

## 2. 문제와 해결책을 분리해야 하는 이유

초보자가 제품을 만들 때 가장 흔한 리듬은 보통 이렇습니다:

- 아이디어가 하나 떠오름
- 이 방향이 멋지다고 느낌
- 바로 프로토타입을 그리기 시작함
- 하다 보니 기능이 점점 많아짐
- 결국 자신이 무슨 문제를 해결하고 있는지 모르게 됨

Double Diamond 모델의 가치는 프로세스를 복잡하게 만드는 것이 아니라, **"문제 이해"와 "솔루션 설계"를 분리하도록 강제**하는 데 있습니다.

이것은 평범하게 들리지만, 실제로는 매우 중요합니다. 왜냐하면 많은 실패한 제품이 실행이 성실하지 않아서가 아니라:

- 잘못된 문제를 선택했기 때문
- 사용자를 오해했기 때문
- 너무 일찍 솔루션에 고정되었기 때문
- 방향을 검증하지 않고 세부 사항을 다듬는 데 많은 시간을 썼기 때문

Double Diamond 모델은 계속해서 다음을 상기시킵니다:

- 아이디어가 편해서 문제가 이미 성립했다고 가정하지 마세요
- 솔루션을 만들 수 있다고 해서 그것이 가치 있다고 가정하지 마세요
- 프로토타입이 완성되어 보인다고 해서 사용자가 정말로 필요로 할 것이라고 가정하지 마세요

<a id="dd-first"></a>
## [3. 첫 번째 다이아몬드: 문제 공간](#top-dd)

첫 번째 다이아몬드가 주목하는 것은 **문제 자체**이며, 솔루션이 아닙니다.

한 문장으로 이해하자면: **서둘러 하지 말고, 먼저 할 가치가 있는지 확인하세요.**

### 3.1 Discover: 먼저 문제 공간을 열기

Discover 단계의 핵심 작업은 **폭넓은 조사이며, 빠른 결론을 내리는 것이 아닙니다.**

이 단계에서 보통 하는 일은:

- 사용자가 실제 시나리오에서 어떻게 행동하는지 관찰
- 잠재 사용자를 인터뷰하여, 최근에 문제를 만난 것이 언제였는지 파악
- 현재 어떻게 대충 해결하는지 관찰
- 경쟁 제품과 대체 솔루션이 어떻게 처리하는지 확인
- 시장, 프로세스, 제약 조건, 업스트림/다운스트림 정보 수집

많은 사람이 Discover를 "자료를 많이 보는 것"으로 오해합니다. 사실 더 중요한 것은: **정보를 한 무더기 검색하는 것이 아니라, 사람과 시나리오를 이해하는 것입니다.**

예를 들어 "AI로 회의록 정리 도구"를 만들고 싶다면, Discover 단계에서 더 주목해야 할 것은:

- 사용자가 회의 후 어디서 가장 고통스러워하는지
- 기록이 어려운지, 정리가 어려운지, 아니면 공유가 어려운지
- 현재 직접 작성하는지, 인턴에게 맡기는지, 녹음을 다시 듣는지, 아니면 아예 정리하지 않는지
- 어떤 회의 시나리오에서 회의록이 가장 필요한지, 어떤 시나리오에서는 전혀 필요 없는지

이 단계의 가장 중요한 목표는 답을 얻는 것이 아니라, **너무 일찍 답을 알고 있다고 생각하지 않는 것입니다.**

### 3.2 Define: 정보 더미에서 핵심 문제 추출

<figure class="field-figure"><a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer"><img src="/images/product-discovery/double-diamond/creative-commons-design-workshop.jpg" alt="질문별 인터뷰 자료가 벽에 정리된 Creative Commons 워크숍" loading="lazy" /></a><figcaption><strong>Discover의 실제 자료는 복잡합니다.</strong> 81회의 인터뷰와 기존 인터뷰 36회의 차이를 보존한 채 비교하는 현장입니다. 사례: <a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">Creative Commons</a>, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>.</figcaption></figure>

Discover가 시야를 넓히는 것이라면, Define은 수렴을 시작하는 것입니다.

Define 단계에서 해야 할 것은 모든 관찰을 보존하는 것이 아니라, 다음을 묻는 것입니다:

- 정말로 우선적으로 해결할 가치가 있는 문제는 무엇인가
- 어떤 문제가 가장 자주 나타나고, 가장 아프고, 가장 가치가 있는가
- 우리 첫 번째 버전은 어떤 시나리오에만 집중할 것인가

이 단계의 핵심은 넓은 주제를 명확한 문제 정의로 수렴하는 것입니다.

예를 들어 처음에 이렇게 말했다면:

> 회의 효율을 높이는 AI 도구를 만들고 싶습니다.

Define 단계에 이르면, 더 나은 표현은 이렇게 될 수 있습니다:

> 프로젝트형 팀이 30~60분 협업 회의가 끝난 후, 10분 이내에 할 일, 담당자, 마감일이 포함된 회의록을 출력하지 못하는 문제를 먼저 해결하겠습니다.

이때 문제가 명확해지기 시작합니다:

- 사용자가 누구인지
- 시나리오가 무엇인지
- 막힌 곳이 어디인지
- 성공 기준이 무엇인지

Define의 본질은 **"문제가 많다"에서 "이번에 어떤 문제를 먼저 해결할 것인가"로 수렴하는 것입니다.**

<figure class="field-figure"><a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer"><img src="/images/product-discovery/double-diamond/creative-commons-research-synthesis.jpg" alt="인터뷰 메모를 배열하고 군집화해 주제를 찾는 Creative Commons 팀" loading="lazy" /></a><figcaption><strong>Define은 듣기 좋은 한 문장을 고르는 일이 아닙니다.</strong> 팀은 117회의 인터뷰를 모아 반복 패턴을 찾고 9가지 통찰로 정리했습니다. 사례: <a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">Creative Commons</a>, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>.</figcaption></figure>

## 4. 두 번째 다이아몬드: 해결책 공간

첫 번째 다이아몬드를 완료한 후에야 비로소 두 번째 다이아몬드에 진입하는 것이 적절합니다. 왜냐하면 이때 해결하는 것은 모호한 방향이 아니라, 수렴된 구체적인 문제이기 때문입니다.

### 4.1 Develop: 핵심 문제를 중심으로 솔루션 발산

Develop 단계의 핵심은 **같은 문제를 중심으로 여러 가능한 솔루션을 탐색하는 것입니다.**

주의할 점은, 여기서의 발산은 Discover 단계의 발산과 다릅니다.

- Discover의 발산은 문제 공간을 탐색하는 것
- Develop의 발산은 솔루션 공간을 탐색하는 것

회의록 예시를 계속하면, Develop 단계에서는 이런 것들을 생각할 수 있습니다:

- 웹 도구로 할지, 회의 플러그인으로 할지
- 녹음을 업로드한 후 처리할지, 실시간 기록으로 할지
- 요약만 할지, 할 일 추출을 중심으로 할지
- 개인 효율을 강조할지, 팀 동기화를 강조할지
- 사용자에게 자유로운 편집을 제공할지, 구조화된 템플릿을 직접 출력할지

이 단계는 브레인스토밍에 매우 적합하며, 팀과 함께 솔루션을 펼쳐보는 데도 좋습니다.

하지만 여기에는 전제가 있습니다: **모든 솔루션은 동일하게 정의된 문제에 봉사해야 합니다.**
문제가 명확하게 정의되지 않으면, Develop은 쉽게 다시 기능이 난무하는 상황이 됩니다.

### 4.2 Deliver: 솔루션 선택, 프로토타입, 테스트 및 전달

<figure class="field-figure"><a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_WMDE_1.jpg" target="_blank" rel="noreferrer"><img src="/images/product-discovery/double-diamond/develop-idea-board.jpg" alt="여러 후보 방향에 색색의 메모지가 놓인 해결책 보드" loading="lazy" /></a><figcaption><strong>Develop에서는 여러 답을 남겨 둡니다.</strong> 선택 전에 서로 다른 경로를 실제로 비교하는 것이 발산의 목적입니다. 사진: <a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_WMDE_1.jpg" target="_blank" rel="noreferrer">Corinna Schuster (WMDE)</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.</figcaption></figure>

Deliver 단계는 두 번째 다이아몬드의 수렴 단계입니다.

이때 해야 할 것은 계속 더 많은 것을 생각하는 것이 아니라, 판단을 시작하는 것입니다:

- 현재 단계에 가장 적합한 솔루션은 무엇인가
- 가장 작지만 가장 유용한 버전은 무엇인가
- 어떤 기능을 먼저 해야 하고, 어떤 것은 나중에 해도 되는가
- 프로토타입, 테스트, 소규모 검증은 어떻게 할 것인가

많은 사람이 Deliver를 "출시"와 같다고 생각합니다. 사실 더 정확한 의미는: **솔루션을 테스트 가능하고, 검증 가능하고, 반복 가능한 것으로 만드는 것입니다.**

그것은 다음과 같을 수 있습니다:

- 저해상도 흐름도
- Figma 프로토타입
- 실행 가능한 MVP
- 소규모 사용자 테스트
- 실제 피드백 후 반복 버전

Deliver의 핵심은 "완벽한 전달"이 아니라, **최대한 빨리 솔루션을 실제 환경에서 검증하는 것입니다.**

<figure class="field-figure"><a href="https://commons.wikimedia.org/wiki/File:TestingPaperPrototype.jpg" target="_blank" rel="noreferrer"><img src="/images/product-discovery/double-diamond/paper-prototype-test.jpg" alt="종이 인터페이스의 입력 칸에 글을 쓰는 프로토타입 테스트" loading="lazy" /></a><figcaption><strong>테스트할 수 있다는 말이 코드를 모두 썼다는 뜻은 아닙니다.</strong> 종이 프로토타입만으로도 흐름과 문구, 작업 순서를 확인할 수 있습니다. 사진: <a href="https://commons.wikimedia.org/wiki/File:TestingPaperPrototype.jpg" target="_blank" rel="noreferrer">d_jan / Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">CC BY 2.0</a>.</figcaption></figure>

## 5. 네 단계의 차이

<DoubleDiamondNavigator />

네 단계를 항상 헷갈린다면, 아래 버전을 바로 기억하세요:

| 단계 | 하는 일 | 키워드 | 일반적 산출물 |
| --- | --- | --- | --- |
| Discover | 문제 이해 | 조사, 관찰, 인터뷰, 정보 수집 | 사용자 인사이트, 시나리오 노트, 문제 목록 |
| Define | 문제 정의 | 추출, 집중, 선택, 문제 재작성 | 문제 정의, 우선순위, MVP 진입점 |
| Develop | 솔루션 탐색 | 브레인스토밍, 비교, 공동 창작, 프로토타입 구상 | 솔루션 목록, 흐름 스케치, 프로토타입 방향 |
| Deliver | 솔루션 검증 | 프로토타입, 테스트, 반복, 전달 | 프로토타입, 테스트 피드백, 최적화 버전 |

더 압축하면 이렇습니다:

- **Discover / Define**: "올바른 일을 하기" 해결
- **Develop / Deliver**: "일을 올바르게 하기" 해결

## 6. Double Diamond 모델의 가장 흔한 오해

### 6.1 Discover도 안 했는데 바로 Deliver

이것이 가장 흔한 경우입니다. 많은 사람이 아이디어가 떠오르자마자 프로토타입을 그리고, PRD를 쓰고, 모델을 연동하고, 페이지를 만듭니다.

문제는 성실하지 않다는 것이 아니라, 문제가 해결할 가치가 있는지 확인조차 하지 않았을 수 있다는 것입니다.

### 6.2 Discover을 오래 하지만, Define을 계속하지 않음

또 다른 극단은 계속 조사하고, 계속 자료를 보고, 계속 인터뷰하지만, 수렴하지 못하는 것입니다.

Double Diamond는 무한한 발산을 요구하는 것이 아니라, 발산 후에는 반드시 판단과 선택으로 진입해야 한다는 것을 상기시킵니다.

### 6.3 Define 후, 몰래 문제를 바꿈

많은 팀이 Develop 단계에서 어떤 솔루션이 더 쉽게 만들 수 있다는 이유로, 문제 정의를 역으로 수정하여 기존 솔루션에 맞춥니다.

이것은 위험합니다. 왜냐하면 문제를 해결하는 것이 아니라, 자신이 좋아하는 솔루션을 위해 이유를 찾고 있을 수 있기 때문입니다.

### 6.4 Deliver을 "크고 완전한 출시"로 오해

Deliver이 반드시 완전한 제품을 모두 완성해야 끝나는 것은 아닙니다. 많은 경우, 테스트 가능한 프로토타입이나 한 차례의 실제 사용자 테스트만으로도 이미 훌륭한 deliver입니다.

## 7. AI 제품에서 Double Diamond 모델을 어떻게 사용할까

AI 제품은 특히 "기능 우선" 함정에 빠지기 쉽습니다. 왜냐하면 모델의 능력이 너무 매력적으로 보이기 때문입니다. 바로 이런 것들을 생각하고 싶어집니다:

- 멀티모달을 연동할지 말지
- Agent를 만들지 말지
- 워크플로를 추가할지 말지
- 음성, 이미지, 인터넷 검색을 연동할지 말지

하지만 Double Diamond 모델은 먼저 이것을 묻도록 합니다:

- 사용자가 정확히 어느 단계에서 막혀 있는지
- 이 막힌 곳이 반드시 AI가 필요한 것인지
- AI를 사용하지 않는다면, 기존 방법이 정확히 어디서 가장 나쁜지
- AI를 넣은 후, 가장 핵심적인 진전은 무엇인지

이것은 흔한 상황을 피하는 데 도움이 됩니다: **능력은 강하지만, 가치는 약함.**

실용적인 순서는:

1. Discover 단계에서 사용자가 현재 작업을 어떻게 처리하는지 관찰
2. Define 단계에서 가장 아픈 시나리오를 명확한 문제 정의 한 문장으로 작성
3. Develop 단계에서 어떤 AI 능력이 이 문제에 가장 적합한지 비교
4. Deliver 단계에서 최소 버전을 만들어 실제 사용자에게 테스트

## 8. 바로 사용할 수 있는 Double Diamond 템플릿

자신의 제품을 만들고 있다면, 다음 순서대로 작성해 보세요:

### Discover

- 내가 관찰한 사용자는 누구인가?
- 그들이 최근에 이 문제를 만난 것은 언제인가?
- 지금 어떻게 해결하고 있는가?
- 가장 번거롭고, 가장 느리고, 가장 불안한 부분은 무엇인가?

### Define

- 이 문제들 중, 가장 먼저 해결할 가치가 있는 것은 무엇인가?
- 어떤 시나리오가 가장 빈도가 높거나, 가장 핵심적인가?
- 첫 번째 버전에서는 누구만 서비스하고, 무엇만 해결할 것인가?
- 성공적으로 해결된 후, 사용자의 상태는 어떻게 변할 것인가?

### Develop

- 이 문제에 대해, 어떤 가능한 솔루션이 있는가?
- 어떤 솔루션이 가장 가볍고, 가장 빠르고, 가장 검증하기 쉬운가?
- 반드시 해야 할 것은 무엇이고, 나중에 해도 되는 것은 무엇인가?

### Deliver

- 이 방향을 검증하기 위해 최소한 무엇을 전달할 수 있는가?
- 흐름도인가, 프로토타입인가, MVP인가?
- 누구에게 테스트를 맡겨야 하는가?
- 테스트 후 계속할지, 수정할지, 포기할지 어떻게 판단할 것인가?

<figure class="field-figure field-figure--portrait">
  <a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_WMDE_Gruppenarbeit_2.jpg" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/wmde-group-workshop.jpg" alt="Wikimedia Deutschland 디자인 사고 워크숍에서 참가자들이 함께 해결책을 만드는 모습" loading="lazy" />
  </a>
  <figcaption><strong>Develop는 좋은 아이디어가 떠오르기를 기다리는 단계가 아닙니다.</strong> 생각을 빠르게 눈에 보이는 형태로 만들면 서로 비교하고 조합하고 버리기가 쉬워집니다. 사진: Corinna Schuster (WMDE), <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.</figcaption>
</figure>

## 9. 제로 베이스도 이해할 수 있는 예시

"대학생의 구직 이력서를 준비해 주는" AI 도구를 만들고 싶다고 가정해 봅시다.

많은 사람이 처음부터 두 번째 다이아몬드에 진입하여 이런 것들을 생각합니다:

- 원클릭 미화를 할지 말지
- 지능형 재작성을 할지 말지
- 자동 JD 매칭을 할지 말지
- 자기소개서를 생성할지 말지

하지만 Double Diamond 모델에 따르면, 더 나은 과정은 이렇습니다:

### 첫 번째 다이아몬드

**Discover**

- 최근 졸업생에게 마지막으로 이력서를 수정한 것이 언제였는지 물어보기
- 그들이 기존 이력서에서 새 버전으로 어떻게 수정하는지 보기
- 가장 고민인 것이 "작성 방법을 모름", "수정 방법을 모름", "좋은지 판단 방법을 모름" 중 어느 것인지 파악

**Define**

- 마지막으로 더 구체적인 문제로 수렴:
- "대학생이 이력서를 못 만드는 것이 아니라"
- "처음으로 인턴십에 지원하는 학생이 기존 경험을 공고에 맞는 표현으로 재작성하기 어려워, 지원을 미루는 것"

### 두 번째 다이아몬드

**Develop**

- 여러 솔루션 생각: 템플릿 라이브러리, AI 재작성, 공고 대조, 이력서 평가, 사례 참고

**Deliver**

- 첫 번째 버전은 "공고 설명에 따라 경험 bullet points를 재작성"만 하기
- 5명의 학생에게 사용해 보고, 더 빨리 첫 번째 버전의 이력서를 제출하는지 확인

첫 번째 다이아몬드를 탄탄하게 하면, 두 번째 다이아몬드가 훨씬 명확해지는 것을 발견할 것입니다.

<figure class="field-figure field-figure--artifact">
  <a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_Prototyp_Mitmach-O-Mat.png" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/wmde-workshop-prototype.png" alt="Wikimedia Deutschland 워크숍에서 만든 Mitmach-O-Mat 손그림 프로토타입" loading="lazy" />
  </a>
  <figcaption><strong>프로토타입은 우선 하나의 질문에 답할 수 있으면 됩니다.</strong> 완성된 시각 체계가 없어도 참가자가 다음 행동을 이해하는지 관찰할 수 있습니다. 프로토타입: Corinna Schuster / WMDE, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.</figcaption>
</figure>

<a id="dd-ai"></a>
## [10. AI를 활용해 Double Diamond 프로세스를 실행하는 방법](#top-dd)

Double Diamond 모델 자체는 AI 도구가 아니지만, AI는 네 단계에서 "가속기" 역할을 하기에 매우 적합합니다. 핵심은 AI가 대신 결정하게 하는 것이 아니라, 시야를 넓히고, 정보를 정리하고, 솔루션을 비교하고, 검증 자료를 생성하는 것을 돕게 하는 것입니다.

### 10.1 Discover 단계: AI로 먼저 정보 기반 마련

공식 인터뷰와 조사 전에 AI에게 가벼운 문제 스캔을 먼저 맡길 수 있습니다. 예를 들어:

- 시장에서 흔한 대체 솔루션은 무엇인지
- 사용자가 공개 커뮤니티에서 가장 많이 불만을 제기하는 것이 무엇인지
- 이 문제가 어떤 시나리오와 사용자군에서 흔한지
- 기존 제품이 보통 무엇을 간과하는지

이 단계는 실제 조사를 대체할 수 없지만, 빠르게 문제 지도를 구축하는 데 매우 적합합니다.

아주 간단한 초보자 입력은 다음과 같을 수 있습니다:

```text
대학생의 이력서를 수정하는 도구를 만들고 싶습니다.
먼저 기능을 생각하지 말고, 이 문제에서 사람들이 가장 많이 겪는 어려움이 무엇인지 먼저 봐 주세요.
```

AI의 출력은 다음과 같을 수 있습니다:

```text
초기 문제 지도:

1. 어떤 경험을 써야 할지 모름
2. 공고에 맞게 어떻게 수정해야 할지 모름
3. 여러 번 수정해도 충분히 좋은지 확신이 안 됨
4. 다른 사람에게 검토를 부탁해야 하지만, 매번 부탁하기가 불편함
5. 확신이 없어서, 계속 지원을 미룸
```

이런 출력의 역할은 대신 결론을 내리는 것이 아니라, 더 빨리 Discover에 진입하도록 돕는 것입니다.

### 10.2 Define 단계: AI가 문제 정의를 수렴하도록 돕기

많은 사람이 자료를 많이 수집한 후, 가장 어려운 것은 문제를 정말로 명확한 한 문장으로 수렴하는 것입니다. 조사 노트를 AI에게 전달하여, 몇 가지 후보 문제 정의로 압축하도록 할 수 있습니다:

```text
다음은 Discover 단계에서 수집한 사용자 피드백과 조사 노트입니다:
[내용 붙여넣기]

세 가지 일을 해 주세요:
1. 가장 자주 나타나는 문제 패턴을 정리
2. 문제 빈도, 고통 정도, 검증 가능성에 따라, 우선적으로 해결할 가치가 있는 문제 3개를 정리
3. 각 문제를 구체적인 문제 정의 한 문장으로 작성
```

이렇게 하면 "문제가 많다"는 상태에 머물지 않고 Define에 더 쉽게 진입할 수 있습니다.

입력을 아주 간단하게 쓸 수도 있습니다:

```text
내가 지금 수집한 문제는 다음과 같습니다:
1. 다들 이력서에 뭘 써야 할지 모름
2. 다들 어떻게 수정해야 할지 모름
3. 다들 수정이 안 된 것 같아서, 지원을 못 함

첫 번째 버전에서 가장 먼저 해결할 문제가 무엇인지 봐 주세요.
```

AI의 출력은 다음과 같을 수 있습니다:

```text
우선적으로 해결할 것을 권장하는 문제:

"처음으로 인턴십에 지원하는 학생이, 이력서가 이미 지원 가능한 수준에 도달했는지 확신하지 못해, 반복적으로 수정하며 지원을 미룸."

이유:
1. 이 문제가 더 구체적임
2. 지연 행동을 설명할 수 있음
3. 작은 버전을 설계하여 검증하기 더 쉬움
```

이런 출력은 매우 유용합니다. 왜냐하면 많은 모호한 문제에서 MVP 출발점에 더 가까운 정의를 수렴해 주기 때문입니다.

### 10.3 Develop 단계: AI로 여러 솔루션 발산

많은 사람이 문제를 정의한 후, 머릿속에 가장 먼저 떠오른 솔루션만 바라봅니다. AI는 이 단계에서 강제 발산을 도와주기에 매우 적합합니다:

```text
핵심 문제를 정의했습니다: [문제 정의]
최종 답을 바로 주지 말고, 다음 관점에서 각각 2~3가지 해결 방향을 제시해 주세요:
1. 가장 가벼운 MVP
2. 수요를 검증하기에 가장 적합한 솔루션
3. 경험을 개선하는 데 가장 적합한 솔루션
4. AI에 의존하지 않는 솔루션
5. AI에 의존하는 솔루션
마지막으로 각 솔루션의 장점, 위험, 검증 비용을 비교해 주세요.
```

이렇게 하면 너무 일찍 단일 솔루션에 갇히지 않습니다.

간단한 입력은 다음과 같을 수 있습니다:

```text
내 문제 정의는 다음과 같습니다:
"대학생이 이력서가 이미 지원할 수 있는지 확신하지 못해, 계속 지원을 미룸."

4가지 다른 솔루션을 생각해 주세요. 한 가지만 주지 마세요.
```

AI의 출력은 다음과 같을 수 있습니다:

```text
솔루션 1: 이력서 지원 가능 체크리스트
솔루션 2: 공고 설명에 따른 맞춤형 재작성
솔루션 3: 사용자가 이력서를 업로드하면 위험 신호를 제시
솔루션 4: 우수 사례 대조를 제공하여 사용자가 격차를 판단하도록 도움
```

이때 "솔루션 비교"에 더 쉽게 진입할 수 있으며, 처음부터 AI 재작성이라는 한 방향만 바라보지 않게 됩니다.

### 10.4 Deliver 단계: AI로 프로토타입 카피와 테스트 자료 생성

Deliver 단계에 진입하면, AI는 다음 작업을 가속화하는 데 매우 적합합니다:

- 저해상도 프로토타입의 페이지 카피 생성
- 사용자 테스트 스크립트 정리
- 비교 가능한 여러 버전의 제목, 버튼, 설명어 생성
- 테스트 후 피드백과 문제 목록 정리

예를 들어 AI에게 20분 사용자 테스트 스크립트를 생성하거나, 5명의 사용자 피드백을 "계속 진행/방향 수정/일시 중지"의 판단 근거로 정리하도록 할 수 있습니다.

최소 입력은 다음과 같을 수 있습니다:

```text
아주 간단한 프로토타입을 만들었어요:
사용자가 이력서를 업로드하면, 어느 부분이 아직 지원에 부적합한지 알려줘요.

15분 사용자 테스트 스크립트를 생성해 주세요.
```

AI의 출력은 다음과 같을 수 있습니다:

```text
15분 테스트 스크립트:

1. 먼저 사용자에게 최근 이력서 제출 경험을 설명해 달라고 요청
2. 사용자가 독립적으로 이력서 업로드를 완료하게 함
3. 피드백 결과를 이해할 수 있는지 관찰
4. 질문: 이 안내 중 어떤 것이 가장 도움이 되었고, 어떤 것이 혼란스러웠는지
5. 질문: 다음에 제출하기 전에 다시 사용하고 싶은지
```

이런 출력은 매우 실용적입니다. 왜냐하면 "프로토타입을 완성했다"에서 "다음에 어떻게 테스트할지"까지 나아갈 수 있게 해주기 때문입니다.

### 10.5 AI를 "단계 수문원"으로 활용

Double Diamond 모델의 가장 흔한 문제는 단계를 건너뛰는 것입니다. AI에게 직접 수문원 역할을 맡겨, 지금 정확히 어느 단계에 있는지 상기시키도록 할 수 있습니다:

```text
제품 프로세스 코치 역할을 해 주세요.
다음은 내 현재 프로젝트 상태입니다: [설명]
지금 내가 Discover, Define, Develop, Deliver 중 어느 단계에 더 가까운지 판단해 주세요.
그리고 알려 주세요:
1. 내가 너무 일찍 다음 단계로 건너뛰었는지
2. 현재 단계에서 가장 보완해야 할 행동은 무엇인지
3. 지금 하지 말아야 할 일은 무엇인지
```

이것은 초보자에게 특히 도움이 됩니다. 왜냐하면 "문제를 아직 명확히 생각하지 않았는데 프로토타입을 그리기 시작하는" 경우가 매우 흔하기 때문입니다.

## 11. 요약

Double Diamond 모델의 가장 강력한 점은, 한 무더기의 혼란을 네 개의 더 명확한 동작으로 나누어 준다는 것입니다:

- 먼저 발산하여 문제를 이해
- 다시 수렴하여 문제를 정의
- 다시 발산하여 솔루션을 탐색
- 마지막으로 수렴하여 솔루션을 전달

이것은 여러분을 느리게 만드는 것이 아니라, **바쁘게 보이지만 실제로 방향이 잘못된 많은 우회를 덜 하게 해줍니다.**

특히 AI 시대에는 것을 만드는 것이 점점 빨라지고 있어, Double Diamond 모델이 오히려 더 중요해집니다. 왜냐하면 "만들어 내는 것"이 점점 쉬워질수록, 진정으로 희귀한 능력은 다음이 되기 때문입니다: **해결할 가치가 있는 문제를 해결하고 있는지, 그리고 적절한 방식으로 해결하고 있는지.**

이 한 문장만 기억하면 됩니다:

**먼저 올바른 일을 하고, 그 다음에 일을 올바르게 하세요.**

## 12. 과제

<StageAssignmentCard title="더블 다이아몬드로 아이디어 정리하기">

위 내용을 바탕으로 다음 과제를 완료해 주세요:

1. 최근에 만들고 싶은 제품 아이디어를 하나 골라, Discover, Define, Develop, Deliver 4단계의 초안을 작성하세요
2. Define 단계에서, 문제를 구체적인 한 문장으로 줄이도록 강제하세요
3. Develop 단계에서, 최소 3가지 다른 솔루션을 나열하고, 가장 먼저 떠오른 방법만 바라보지 마세요
4. Deliver 단계에서, 1주일 이내에 전달할 수 있는 최소 검증 버전을 하나 작성하세요

</StageAssignmentCard>

## 더 읽어볼 만한 자료

이 글은 주로 Design Council의 Double Diamond 공식 자료를 참고했습니다. 계속 읽어보세요:

- [Design Council: The Double Diamond](https://www.designcouncil.org.uk/our-resources/the-double-diamond/)
- [Design Council: Framework for Innovation](https://www.designcouncil.org.uk/our-work/skills-learning/tools-frameworks/framework-for-innovation-design-councils-evolved-double-diamond/)
- [Design Council: History of the Double Diamond](https://www.designcouncil.org.uk/our-resources/the-double-diamond/history-of-the-double-diamond/)

<style scoped>
.field-figure { margin: 24px 0 32px; overflow: hidden; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg-soft); }
.field-figure > a { display: block; background: #f4f4f1; }
.field-figure img { display: block; width: 100%; max-height: 520px; object-fit: contain; }
.field-figure--diagram img { max-height: 580px; padding: 18px; }
.field-figure figcaption { padding: 13px 16px 15px; border-top: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); font-size: 13px; line-height: 1.75; }
.field-figure figcaption strong { color: var(--vp-c-text-1); }
@media (max-width: 640px) { .field-figure { margin: 20px 0 28px; } .field-figure--diagram img { padding: 8px; } }
</style>
