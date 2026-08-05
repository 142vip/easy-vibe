# 브라우저 렌더링 전체상
::: tip 🎯 핵심 질문
**왜 어떤 웹 페이지는 실크처럼 부드럽고, 어떤 웹 페이지는 PPT처럼 끊길까요?** 브라우저는 어떻게 HTML, CSS, JavaScript 코드 덩어리를 눈앞에 보이는 웹 페이지로 바꾸는 걸까요? 이 장에서는 브라우저의 "작업장" 내부를 깊이 들여다보고, 그 작동 방식을 이해하여 더 나은 성능의 웹 페이지를 작성하는 방법을 알려드립니다.
:::

**이 글에서 무엇을 배우나요?**

| 장 | 내용 | 배우고 나면 할 수 있는 것 |
|-----|------|-----------|
| **제 1 장** | 렌더링 파이프라인을 이해해야 하는 이유 | 성능 최적화의 필요성 이해 |
| **제 2 장** | 렌더링 파이프라인의 다섯 단계 | 브라우저 렌더링의 기본 흐름 파악 |
| **제 3 장** | DOM 트리와 CSSOM 트리 구축 | HTML과 CSS가 어떻게 파싱되는지 이해 |
| **제 4 장** | 렌더 트리 구축 | 어떤 요소가 렌더링되는지 파악 |
| **제 5 장** | 레이아웃과 리플로우 | 비용이 큰 레이아웃 계산을 피하는 방법 |
| **제 6 장** | 페인트와 리페인트 | 불필요한 페인트 작업 줄이기 |
| **제 7 장** | 컴포지트와 GPU 가속 | GPU를 활용한 애니메이션 성능 향상 |
| **제 8 장** | 이벤트 루프 | JavaScript 실행 메커니즘 이해 |
| **제 9 장** | 성능 최적화 실전 | 자주 사용하는 성능 최적화 기법 습득 |

각 장은 "원리 이해"부터 시작합니다. 최적화 코드를 직접 작성할 필요는 없습니다. 성능 문제가 발생했을 때 언제든지 다시 찾아보세요.

---

## 1. 렌더링 파이프라인을 이해해야 하는 이유

### 1.1 "동작한다"에서 "빠르게 동작한다"로: 프론트엔드 개발의 진화

프론트엔드를 처음 배울 때는 코드가 "동작하는지"만 신경 씁니다 — 페이지가 표시되고, 버튼이 클릭되면 성공이라고 생각하죠. 하지만 프로젝트가 커지고 사용자가 늘어나면서 곧 냉혹한 현실을 마주하게 됩니다: **같은 기능이라도, 어떤 사람이 작성한 페이지는 비단처럼 부드럽고, 어떤 사람이 작성한 페이지는 사용자가 마우스를 집어던지고 싶을 정도로 끊깁니다.**

이것은 마치 운전을 배우는 것과 같습니다. 초보자는 "차가 움직이기만 하면 된다"고 생각하지만, 베테랑 운전자는 "언제 기어를 바꾸고, 언제 브레이크를 밟고, 어떻게 하면 연비가 좋은지"를 고민합니다. 브라우저는 바로 당신이 운전하는 "차"입니다. 그 "작동 습성"을 이해해야 더 빠르고 안정적으로 운전할 수 있습니다.

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🐢 초보자 사고방식 (기능만 신경 씀)**
- 페이지가 표시되기만 하면 된다
- 끊김 현상은 브라우저 문제다
- 성능 최적화는 나중에 고려할 일이다

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 진화된 사고방식 (사용자 경험을 신경 씀)**
- 부드러움은 사용자 경험의 핵심이다
- 브라우저의 작동 방식을 이해한다
- 코드를 작성할 때부터 성능을 고려한다

</div>
</div>

**렌더링 파이프라인을 이해하는 것은, "동작한다"에서 "빠르게 동작한다"로 나아가는 핵심 단계입니다.**

### 1.2 실제 경험담: 최적화 적용 후 성능 저하 원인

::: warning 샤오장의 성능 최적화 실패기
샤오장은 이커머스 회사의 프론트엔드 엔지니어로, 상품 상세 페이지 최적화를 담당했습니다. 이 페이지는 상품 정보를 표시할 때 심하게 끊겨서 사용자 불만이 끊이지 않았습니다.

샤오장은 이렇게 생각했습니다: "페이지가 느린 건 DOM이 너무 많기 때문일 거야. `display:none`으로 숨겨놓고, 수정이 끝난 다음에 다시 표시하면 브라우저가 중복 렌더링하지 않겠지?"

그래서 그는 다음과 같은 코드를 작성했습니다:

```javascript
// 당신이 생각하는 "최적화"
const container = document.getElementById('list')
container.style.display = 'none'  // 먼저 숨기면 렌더링이 발생하지 않겠지?

for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'  // 랜덤 너비
  container.appendChild(item)
}

container.style.display = 'block'  // 마지막에 표시, 한 번에 렌더링
```

그런데 테스트 결과, 페이지가 **더 느려졌습니다**! 샤오장은 당황했습니다: 분명히 "최적화"했는데, 왜 오히려 더 느려진 걸까?

나중에 프론트엔드 리드가 코드를 보고 문제점을 지적했습니다: **요소가 숨겨져 있더라도, `style.width`를 수정할 때마다 브라우저의 스타일 계산과 레이아웃 마킹이 여전히 발생하며, 브라우저는 백그라운드에서 쓸데없는 작업을 대량으로 수행하고 있었던 것입니다.**

올바른 방법은 `DocumentFragment`를 사용해 메모리에서 배치 작업을 수행하고, 마지막에 한 번에 DOM에 삽입하여 렌더링을 한 번만 트리거하는 것입니다.
:::

::: info 💡 핵심 교훈
브라우저의 작동 방식을 이해하지 못하면, "똑똑한 척"하며 최적화 코드를 잔뜩 작성했지만 결과적으로 성능을 더 악화시킬 수 있습니다. **렌더링 파이프라인을 이해해야만 어떤 작업이 비싸고 어떤 작업이 저렴한지 알 수 있으며, 엉뚱한 곳에서 힘을 낭비하지 않을 수 있습니다.**
:::

---

## 2. 핵심 개념: "렌더링 파이프라인"이 개요
::: tip 🤔 "렌더링"이란 무엇인가요?
**렌더링(Rendering)** 은 간단히 말해 브라우저가 코드를 당신이 보는 웹 페이지로 "그려내는" 과정입니다.

이것을 **인쇄소에서 책을 찍는 과정**에 비유할 수 있습니다:
- **HTML** = 원고 내용 (텍스트, 이미지, 장)
- **CSS** = 조판 요구사항 (글꼴 크기, 색상, 간격)
- **JavaScript** = 동적 수정 (저자의 실시간 수정, 조판 조정)

브라우저는 이 "재료들"을 받아 여러 "공정"을 거쳐 최종적으로 당신이 보는 웹 페이지를 "인쇄"합니다. 이 일련의 공정이 바로 **렌더링 파이프라인(Rendering Pipeline)** 입니다.
:::

더 잘 이해할 수 있도록, **제과점**에 비유하여 브라우저의 렌더링 프로세스를 설명해 보겠습니다.

### 2.1 제과점 비유로 렌더링 파이프라인 이해하기

당신이 제과점을 운영하며 매일 다양한 빵을 만들어야 한다고 상상해 보세요. 이 과정에서 관련된 단계들은 브라우저의 렌더링 프로세스와 놀라울 정도로 유사합니다:

| 단계 | 🥖 제과점 비유 | 브라우저의 실제 작업 | 구체적인 예시 |
|------|-------------|--------------|----------|
| **1. 재료 준비** | 재료 목록 정리 (밀가루, 계란, 크림...) | **DOM 트리 구축**: HTML을 트리 구조로 파싱 | `<div><p>Hello</p></div>`를 작성하면, 브라우저는 `div→p→"Hello"` 트리로 파싱 |
| **2. 레시피 준비** | 레시피 카드 정리 (각 빵의 재료 비율) | **CSSOM 트리 구축**: CSS를 규칙 트리로 파싱 | `.title { color: red }`를 작성하면, 브라우저는 "`.title`의 텍스트는 빨간색"이라고 기록 |
| **3. 계획 수립** | 재료와 레시피에 따라 오늘 만들 빵 결정 | **렌더 트리 구축**: DOM과 CSSOM을 병합, 보이는 요소만 유지 | `<script>` 태그는 표시되지 않으므로 렌더 트리에 없음 |
| **4. 위치 배치** | 빵을 진열장에 배치, 각 빵의 위치 결정 | **레이아웃(Layout)**: 각 요소의 크기와 위치 계산 | "이 div는 너비 200px, 높이 100px, 화면의 (50, 50) 위치에 있다"라고 계산 |
| **5. 색칠 및 장식** | 빵에 계란물 바르기, 참깨 뿌리기, 크림 짜기 | **페인트(Paint)**: 요소의 색상, 테두리, 그림자 등을 "그리기" | "빨간색 텍스트"를 실제로 화면에 그리기 |
| **6. 조립 완성** | 모든 빵을 겹쳐서 아름답게 배치 | **컴포지트(Composite)**: 여러 레이어를 병합하여 최종 화면 생성 | GPU가 배경 레이어, 텍스트 레이어, 이미지 레이어를 하나의 완전한 화면으로 병합 |

::: tip 📊 이 표에서 무엇을 알 수 있나요?
한 줄씩 이 표를 해석하며 렌더링 파이프라인의 각 단계를 이해해 봅시다:

**단계 1-2 (준비 단계)**: 브라우저는 먼저 코드를 "이해"합니다. HTML과 CSS는 각자의 역할이 다르기 때문에 별도로 파싱됩니다 — HTML은 "무엇이 있는지"를 결정하고, CSS는 "어떻게 보이는지"를 결정합니다.

**단계 3 (병합 단계)**: 왜 "병합"해야 할까요? 모든 HTML 요소가 표시되는 것은 아니기 때문입니다(예: `<head>`, `<script>`). 브라우저는 "보이는 요소"와 "그들의 스타일"을 결합하여 하나의 "시공 도면"을 만듭니다.

**단계 4-5 (그리기 단계)**: 레이아웃은 "위치 계산"이고, 페인트는 "색칠하기"입니다. 레이아웃 변경(예: 너비 변경)은 페인트를 유발하지만, 페인트 변경(예: 색상 변경)은 레이아웃을 유발하지 않습니다.

**단계 6 (컴포지트 단계)**: 현대 브라우저의 "마법"입니다. 전통적인 방식은 "한 번에 다 그리는 것"(CPU, 느림)이고, 현대적인 방식은 "레이어별로 그리기 + GPU 합성"(빠름)입니다. 이것이 바로 `transform` 애니메이션이 `width` 애니메이션보다 부드러운 이유입니다.
:::

### 2.2 렌더링 파이프라인의 다섯 단계

<RenderingPipelineDemo />

---

## 3. 첫 번째 단계: DOM 트리와 CSSOM 트리 구축

### 3.1 왜 "트리"로 만들어야 도입 동기

::: tip 🤔 DOM이란 무엇인가요?
**DOM(Document Object Model, 문서 객체 모델)** 은 브라우저가 HTML 문서를 변환한 트리 구조로, JavaScript가 페이지 요소를 쉽게 조작할 수 있도록 합니다.

이것을 **가계도**에 비유할 수 있습니다:
- 가장 위는 "조상" (`<html>`)
- 그 아래는 "자식" (`<body>`, `<head>`)
- 더 아래는 "손자" (`<div>`, `<p>`, `<span>`)

**왜 트리로 변환할까요?** 트리 구조는 "검색"과 "수정"에 매우 편리하기 때문입니다. 예를 들어 "class가 `title`인 모든 요소"를 찾으려면, 브라우저는 트리에서 빠르게 검색할 수 있으며, 뒤죽박죽된 텍스트에서 천천히 찾을 필요가 없습니다.
:::

브라우저는 HTML을 받은 후 바로 표시하지 않고, 먼저 "이해"합니다. 이 과정은 세 단계로 나뉩니다:

**첫 번째 단계: 어휘 분석 — 코드를 "단어"로 분해**

```html
<div class="container">
  <p>Hello World</p>
</div>
```

브라우저는 이 코드를 보고 먼저 "단어 분해"를 합니다:
- `<div>` → "시작 태그 div"
- `class="container"` → "속성 class, 값 container"
- `<p>` → "시작 태그 p"
- `Hello World` → "텍스트 내용"
- `</p>` → "종료 태그 p"
- `</div>` → "종료 태그 div"

**두 번째 단계: 구문 분석 — "단어"를 "노드"로 조립**

브라우저는 HTML 규칙에 따라 이 "단어들"을 "노드"로 조립합니다:
- 요소 노드: `<div>`, `<p>`
- 속성 노드: `class="container"`
- 텍스트 노드: `"Hello World"`

**세 번째 단계: 트리 구축 — "부모-자식 관계" 수립**

마지막으로, 브라우저는 태그의 중첩 관계에 따라 트리 구조를 구축합니다:

```
Document(문서 루트 노드)
└── html
    └── body
        └── div.class = "container"
            └── p
                └── "Hello World"
```

### 3.2 CSSOM 트리: 스타일의 "규칙 매뉴얼"

::: tip 🤔 CSSOM이란 무엇인가요?
**CSSOM(CSS Object Model, CSS 객체 모델)** 은 브라우저가 CSS 규칙을 변환한 트리 구조로, 각 요소의 최종 스타일을 계산하는 데 사용됩니다.

이것을 **의상 코디 가이드**에 비유할 수 있습니다:
- 상위 규칙(body의 글꼴)은 하위(모든 자식 요소)에 영향을 미칩니다
- 충돌이 있는 경우(예: 같은 요소에 여러 규칙이 다른 색상을 지정), "우선순위"에 따라 어떤 것을 사용할지 결정합니다
- 최종적으로 각 요소가 어떤 "옷"을 입어야 하는지 계산합니다
:::

CSSOM의 구축 과정은 DOM과 유사하지만, 한 가지 중요한 차이점이 있습니다: **CSS는 "상속"과 "캐스케이딩"이 적용됩니다**.

::: details CSSOM 구축 과정 보기
**원본 CSS:**
```css
body {
  font-size: 16px;
  color: #333;
}

.container {
  width: 100%;
  color: red;  /* body의 color를 덮어씀 */
}

.container p {
  font-weight: bold;
}
```

**구축된 CSSOM 트리:**
```
StyleSheet
├── body
│   ├── font-size: 16px
│   └── color: #333
└── .container
    ├── width: 100%
    ├── color: red  (우선순위가 더 높아 body의 color를 덮어씀)
    └── p
        └── font-weight: bold
```
:::

### 3.3 사례: CSS 적용되지 않을까 예외 원인

**함정 1: CSS 선택자 우선순위 충돌**

::: details 일반적인 실수 보기
```css
/* 당신이 작성한 CSS */
#header { color: red; }      /* id 선택자, 가중치 100 */
.title { color: blue; }     /* class 선택자, 가중치 10 */

/* HTML */
<div id="header" class="title">이 텍스트는 무슨 색일까요?</div>
```

파란색이라고 생각했지만, 결과는 **빨간색**입니다. id 선택자의 가중치(100)가 class 선택자(10)보다 높기 때문입니다.
:::

**함정 2: HTML 태그가 닫히지 않음, 브라우저의 "자동 수정"**

::: details 브라우저가 잘못된 HTML을 수정하는 방법 보기
```html
<!-- 당신이 작성한 HTML -->
<div>
  <p>이것은 텍스트입니다
</div>

<!-- 브라우저가 수정한 후 -->
<div>
  <p>이것은 텍스트입니다</p>  <!-- 브라우저가 자동으로 태그를 닫아줌 -->
</div>
```

브라우저는 매우 "관대"해서 자동으로 오류를 수정합니다. 하지만 이런 관대함에는 대가가 따릅니다 — 브라우저는 당신의 의도를 추측하기 위해 추가 계산이 필요하며, **성능에 영향을 미칩니다**.
:::

<DomToRenderTreeDemo />

---

## 4. 두 번째 단계: 렌더 트리 구축

### 4.1 왜 "렌더 트리"가 필요한가요 동기

이렇게 물을 수 있습니다: **"이미 DOM 트리와 CSSOM 트리가 있는데, 왜 렌더 트리를 또 만들어야 하나요? DOM을 바로 사용하면 안 되나요?"**

답은: **DOM 트리에는 "쓸모없는" 정보가 너무 많이 포함되어 있기 때문입니다**.

예를 들어 다음 HTML을 보세요:

```html
<html>
<head>
  <title>페이지 제목</title>
  <style>/* CSS 코드 */</style>
  <script>/* JavaScript 코드 */</script>
</head>
<body>
  <div class="container">
    <p>보이는 내용</p>
  </div>
  <div style="display: none">
    <p>숨겨진 내용 (display:none)</p>
  </div>
</body>
</html>
```

**DOM 트리는 모든 요소를 포함합니다**:
- `<head>`, `<title>`, `<style>`, `<script>` (이것들은 표시되지 않음)
- `display: none`인 div (역시 표시되지 않음)

하지만 **렌더 트리는 "화면에 그려야 할" 요소만 포함합니다**:
- `<head>` 및 그 자식 요소 제거
- `display: none`인 div 제거

### 4.2 렌더 트리 구축 규칙

브라우저는 렌더 트리를 구축할 때 일련의 규칙을 따릅니다:

| 상황 | 처리 방식 | 예시 | 성능 영향 |
|------|---------|------|----------|
| `display: none` | 렌더 트리에서 **완전히 제외** | 요소 및 그 자식 요소가 모두 보이지 않음 | ✅ 렌더링 작업량 감소 |
| `visibility: hidden` | 렌더 트리에 **포함되지만**, 그리지 않음 | 공간을 차지하지만 완전히 투명 | ⚠️ 레이아웃 계산 필요 |
| `opacity: 0` | 렌더 트리에 **포함되지만**, 투명 | 상호작용 가능(클릭 가능), 보이지 않음 | ⚠️ 레이아웃 계산 필요 |
| 뷰포트 밖 | 렌더 트리에 **포함되지만**, 당장 그리지 않음 | 뷰포트로 스크롤될 때 그림 | ⚠️ 하지만 여전히 렌더 트리에 있음 |

::: tip 📊 이 표에서 무엇을 알 수 있나요?
**핵심 발견**: `display: none`은 유일하게 "진정으로 성능을 절약하는" 숨김 방식입니다. 요소가 렌더 트리에 완전히 없기 때문에, 브라우저는 해당 요소에 대해 어떤 레이아웃이나 페인트 작업도 수행하지 않습니다.

반면 `visibility: hidden`과 `opacity: 0`은 "보이지 않지만" 여전히 렌더 트리에 있으며, 브라우저는 여전히 레이아웃을 계산해야 합니다(공간을 차지함). "숨기되 레이아웃에 영향을 주지 않으려면"(예: 페이드 인/아웃 애니메이션) `opacity`를 사용하고, "완전히 숨기고 공간도 차지하지 않으려면" `display: none`을 사용하세요.
:::

### 4.3 실전 경험담: display:none을 설정했는데도 페이지가 왜 느릴까 동기

::: danger ❌ 일반적인 오해: display:none인 요소는 "존재하지 않는다"고 생각하기
많은 사람들이 `display: none`을 설정하면 요소가 "사라져서" 어떻게 조작해도 성능에 영향을 주지 않는다고 생각합니다. 이것은 **틀린** 생각입니다!

`display: none`인 요소는 렌더 트리에 없지만, JavaScript로 그 속성을 수정할 때 브라우저는 여전히 다음을 수행해야 합니다:
1. **스타일 재계산** (CSS 규칙 매칭)
2. **변경 사항 추적** (향후 표시를 위한 준비)

다음 "최적화" 예시를 보세요:
:::

::: details "무효한 최적화" 코드 보기
```javascript
// ❌ 당신이 생각하는 "최적화": 먼저 숨기고, 수정 후 다시 표시
const container = document.getElementById('list')
container.style.display = 'none'

// DOM을 미친 듯이 조작
for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'  // 너비 변경!
  item.textContent = `Item ${i}`
  container.appendChild(item)
}

container.style.display = 'block'

// 문제: style.width를 수정할 때마다 브라우저는 스타일을 재계산해야 함,
// 요소가 display:none이어도 마찬가지!
```

**✅ 올바른 최적화 방법:**
```javascript
// DocumentFragment를 사용한 배치 작업
const container = document.getElementById('list')
const fragment = document.createDocumentFragment()  // 가상 컨테이너

// 모든 작업을 메모리상의 fragment에서 수행
for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'
  item.textContent = `Item ${i}`
  fragment.appendChild(item)  // 실제 DOM에 영향 없음
}

// 한 번에 실제 DOM에 삽입, 렌더링 한 번만 트리거
container.appendChild(fragment)
```
:::

---

## 5. 세 번째 단계: 레이아웃과 리플로우

### 5.1 "레이아웃 개요

::: tip 🤔 레이아웃(Layout)이란 무엇인가요?
**레이아웃**은 **리플로우(Reflow)** 라고도 하며, 브라우저가 렌더 트리의 각 요소에 대해 "어디에 위치하고, 얼마나 많은 공간을 차지하는지" 계산하는 과정입니다.

이것을 **인테리어 디자이너가 방을 측정하는 것**에 비유할 수 있습니다:
- 먼저 각 방의 가로세로를 측정합니다
- 가구를 어디에 둘지 결정합니다
- 각 가구의 좌표를 계산합니다

**왜 레이아웃이 "비쌀까요"?** 하나의 요소 변화가 다른 요소에 영향을 미칠 수 있기 때문입니다. 예를 들어 하나의 div를 넓히면, 옆에 있는 div가 밀려 내려가서 전체 페이지가 다시 계산될 수 있습니다.
:::

### 5.2 리플로우를 유발하는 "지뢰밭"

다음은 리플로우를 자주 유발하는 작업들입니다. **즐겨찾기에 저장하고 암기하는 것을 추천합니다**:

| 카테고리 | 속성/작업 | 성능 영향 | 대체 방안 |
|------|----------|----------|----------|
| **크기** | `width`, `height`, `min/max-width/height` | 💀💀💀 | `transform: scale()` 사용 |
| **위치** | `top`, `right`, `bottom`, `left` | 💀💀💀 | `transform: translate()` 사용 |
| **여백** | `margin`, `padding` | 💀💀 | `transform` 또는 `gap` 사용 |
| **테두리** | `border-width` | 💀💀 | 빈번한 수정 피하기 |
| **내용** | 텍스트 내용 변경, 이미지 로딩 | 💀💀 | 공간 미리 확보, 레이아웃 시프트 방지 |
| **글꼴** | `font-size`, `line-height` | 💀💀💀 | 빈번한 수정 피하기 |
| **표시** | `display` 값 변경 | 💀💀💀 | `visibility` 또는 `opacity` 사용 (완전히 숨길 필요가 없다면) |
| **조회** | `offsetWidth`, `offsetHeight` 등 | 💀💀💀💀💀 | **배치 읽기, 레이아웃 스래싱 방지** |

::: tip 📊 이 표에서 무엇을 알 수 있나요?
**핵심 발견**:
1. **기하 속성(너비, 높이, 위치)이 가장 비쌉니다**: 완전한 레이아웃 계산을 유발합니다
2. **조회 속성이 수정보다 더 위험합니다**: `offsetWidth`를 읽으면 **강제 동기 레이아웃**이 발생합니다 (5.4절 참조)
3. **transform과 opacity가 성능이 가장 좋습니다**: 리플로우를 유발하지 않고 컴포지트만 유발합니다
:::

### 5.3 실전 경험담:내 애니메이션이 PPT처럼 원인 분석

**함정: width로 애니메이션 만들기**

::: details 성능이 나쁜 애니메이션 코드 보기
```css
/* ❌ 나쁜 애니메이션: 리플로우 유발 */
.box {
  width: 100px;
  transition: width 0.3s;
}

.box:hover {
  width: 200px;  /* 너비 변경이 리플로우를 유발! */
}
```

매 프레임마다 애니메이션이 리플로우를 유발하여, 브라우저는 다음을 수행해야 합니다:
1. 너비 재계산
2. 위치 재계산 (다른 요소에 영향 가능)
3. 다시 그리기

**✅ 좋은 애니메이션: transform 사용**
```css
/* ✅ 좋은 애니메이션: 컴포지트만 유발 */
.box {
  width: 100px;
  transform: scaleX(1);
  transition: transform 0.3s;
}

.box:hover {
  transform: scaleX(2);  /* 크기 조정은 리플로우를 유발하지 않음! */
}
```

`transform`은 GPU에서 직접 처리되므로, 리플로우와 리페인트를 유발하지 않아 애니메이션이 비단처럼 부드럽습니다.
:::

### 5.4 성능 킬러: 강제 동기 레이아웃

::: danger 💀 가장 위험한 성능 문제: 레이아웃 스래싱
**강제 동기 레이아웃(Forced Synchronous Layout)** 은 **레이아웃 스래싱(Layout Thrashing)** 이라고도 하며, 가장 흔하면서도 가장 심각한 성능 문제입니다.

그 원인은: **JavaScript가 레이아웃 속성(예: `offsetWidth`)을 읽을 때, 브라우저는 정확한 값을 반환하기 위해 즉시 레이아웃 계산을 실행해야 합니다.**

"읽기와 쓰기를 번갈아" 하면, 브라우저가 "레이아웃 → 읽기 → 레이아웃 → 읽기"를 반복하게 되어 악순환이 발생합니다.
:::

::: details 레이아웃 스래싱 코드 보기
```javascript
// ❌ 매우 나쁨: 읽기/쓰기 번갈아 하기, 레이아웃 스래싱 유발
const elements = document.querySelectorAll('.item')

for (let i = 0; i < elements.length; i++) {
  const height = elements[i].offsetHeight  // 읽기 → 강제 레이아웃
  elements[i].style.width = (height * 2) + 'px'  // 쓰기 → 리플로우 필요 마킹
  // 다음 루프의 읽기가 또 강제 레이아웃... 악순환!
}

// 100개의 요소가 있으면, 100번의 레이아웃 계산이 발생!
```

**✅ 올바른 최적화 방법: 읽기와 쓰기 분리**
```javascript
const elements = document.querySelectorAll('.item')

// 첫 번째 단계: 배치 읽기 (먼저 모두 읽기)
const heights = []
for (let i = 0; i < elements.length; i++) {
  heights.push(elements[i].offsetHeight)  // 레이아웃 한 번만 트리거
}

// 두 번째 단계: 배치 쓰기 (그 다음 모두 쓰기)
requestAnimationFrame(() => {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.width = (heights[i] * 2) + 'px'  // 리플로우 한 번만 트리거
  }
})
```
:::

<LayoutReflowDemo />

---

## 6. 네 번째 단계: 페인트와 리페인트

### 6.1 "페인트 개요

::: tip 🤔 페인트(Paint)란 무엇인가요?
**페인트**는 브라우저가 "레이아웃 계산이 완료된" 요소를 실제로 화면에 "그리는" 과정입니다.

이것을 **방에 페인트 칠하기**에 비유할 수 있습니다:
- 레이아웃 단계 = 치수 재기, 선 긋기
- 페인트 단계 = 실제로 페인트 칠하기, 벽지 바르기

**페인트는 레이아웃만큼 비싸지 않지만, 저렴하지도 않습니다.** 빈번한 페인트는 여전히 성능에 영향을 미치며, 특히 복잡한 요소(그림자, 그라데이션 등)의 경우 더욱 그렇습니다.
:::

### 6.2 리페인트를 유발하는 신호

리플로우와 달리, 리페인트는 "외관"의 변경만 포함하며 "기하"의 변경은 포함하지 않습니다:

| 카테고리 | 속성 | 성능 영향 | 비고 |
|------|------|----------|------|
| **색상** | `color`, `background-color` | 💀 | 가장 흔한 리페인트 유발자 |
| **배경** | `background-image`, `background-position` | 💀💀 | 이미지가 단색보다 느림 |
| **테두리** | `border-color`, `border-style` | 💀 | 테두리 색상/스타일 변경 |
| **텍스트** | `text-decoration`, `text-shadow` | 💀💀 | 그림자가 일반 텍스트보다 느림 |
| **박스 그림자** | `box-shadow` | 💀💀💀 | 복잡한 그림자는 매우 느림 |
| **둥근 모서리** | `border-radius` | 💀 | 둥근 모서리 크기 변경 |
| **투명도** | `opacity` | ✅ | **특별: 리페인트를 유발하지 않고 컴포지트만 유발** |

::: tip 📊 이 표에서 무엇을 알 수 있나요?
**핵심 발견**: `opacity`는 특별합니다! `transform`과 마찬가지로 리페인트를 유발하지 않고, 직접 컴포지트 단계를 유발합니다. 이것이 `opacity`로 페이드 인/아웃 애니메이션을 만들 때 성능이 가장 좋은 이유입니다.

또한, **그림자와 그라데이션은 리페인트보다 더 비쌉니다**. 복잡한 픽셀 계산이 필요하기 때문입니다. 페이지에 `box-shadow`가 많다면, 가상 요소나 이미지로 대체하는 것을 고려하세요.
:::

### 6.3 실전 경험담:내 hover 효과가 원인 분석

**함정: box-shadow로 hover 애니메이션 만들기**

::: details 성능이 나쁜 hover 효과 보기
```css
/* ❌ 나쁜 hover 효과: box-shadow 애니메이션은 매우 느림 */
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);  /* 그림자는 매우 느림! */
}
```

`box-shadow`는 픽셀 단위로 계산해야 하므로, 애니메이션 시 끊김이 발생합니다.

**✅ 좋은 방법: transform 또는 가상 요소 사용**
```css
/* ✅ 좋은 hover 효과: transform 사용 */
.card {
  transform: translateY(0);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-4px);  /* hover 시에만 그림자 변경, 애니메이션은 transform으로 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
```
:::

<PaintLayerDemo />

---

## 7. 다섯 번째 단계: 컴포지트와 GPU 가속

### 7.1 "컴포지트 개요

::: tip 🤔 컴포지트(Composite)란 무엇인가요?
**컴포지트**는 현대 브라우저의 "마법"으로, 페이지의 서로 다른 부분을 여러 개의 **레이어(Layer)** 로 나눈 다음, **GPU(그래픽 처리 장치)** 를 활용하여 최종 화면을 병렬로 합성하는 것입니다.

이것을 **포토샵의 레이어**에 비유할 수 있습니다:
- 전통적인 방식 = 모든 것을 한 레이어에 그리기 (CPU 직렬, 느림)
- 컴포지트 방식 = 레이어별로 그리고 마지막에 병합 (GPU 병렬, 빠름)

**왜 컴포지트가 빠를까요?** GPU는 "이미지 합성"과 같은 병렬 작업에 특화되어 있어 CPU보다 수십 배 빠르기 때문입니다.
:::

### 7.2 어떤 컴포지트 레이어 승격 기준

브라우저는 자동으로 특정 요소를 독립적인 컴포지트 레이어로 승격시킵니다. 다음은 일반적인 트리거 조건입니다:

| 트리거 조건 | CSS 속성/값 | 성능 영향 | 주의사항 |
|---------|-----------|----------|----------|
| **3D 변환** | `transform: translate3d()`, `rotate3d()` | ✅✅✅ | 애니메이션 성능 최고 |
| **하드웨어 가속 핵** | `transform: translateZ(0)` | ✅✅ | 흔히 "강제 GPU 가속"이라고 함 |
| **투명도 애니메이션** | `opacity` 변경 (애니메이션과 함께) | ✅✅✅ | 리페인트 유발 안 함 |
| **고정 위치** | `position: fixed` | ✅ | 스크롤 시 반복 레이아웃 방지 |
| **Will-Change** | `will-change: transform, opacity` | ✅✅ | 미리 레이어 생성, 메모리 주의 |
| **Canvas/WebGL** | `<canvas>`, WebGL 콘텐츠 | ✅✅ | 기본적으로 독립 레이어 |
| **Video** | `<video>` | ✅✅ | 독립 레이어, 상호 영향 방지 |

::: tip 📊 이 표에서 무엇을 알 수 있나요?
**핵심 발견**: `transform`과 `opacity`는 성능이 가장 좋은 애니메이션 속성입니다. 리플로우와 리페인트를 유발하지 않고, 직접 컴포지트를 유발하기 때문입니다. 이것이 성능 최적화 가이드에서 항상 "transform과 opacity로 애니메이션을 만들라"고 말하는 이유입니다.

하지만 주의하세요: **각 컴포지트 레이어는 GPU 메모리를 차지합니다**. `translateZ(0)`를 남용하면 메모리가 폭발할 수 있습니다 (7.4절 참조).
:::

### 7.3 사례: 컴포지트 레이어 과다 사용 시 성능 영향

::: danger 💀 과도한 최적화의 함정
어떤 사람들은 "GPU 가속이 빠르다"는 말을 듣고 모든 요소에 `transform: translateZ(0)`를 추가했는데, 결과적으로 페이지가 오히려 더 느려졌습니다.

**문제 원인**:
각 컴포지트 레이어는 GPU에 "텍스처"(비트맵) 복사본을 저장해야 하며, 이는 메모리를 차지합니다. 페이지에 100개의 컴포지트 레이어가 있다면, GPU 메모리가 가득 차서 저사양 기기에서 충돌하거나 CPU 렌더링으로 강등될 수 있습니다.
:::

::: details "과도한 최적화" 코드 보기
```css
/* ❌ 잘못된 방법: 모든 요소에 GPU 가속 활성화 */
.card { transform: translateZ(0); }
.button { transform: translateZ(0); }
.icon { transform: translateZ(0); }
/* ... 100개의 요소 모두에 추가 ... */

/* 결과: GPU 메모리 폭발, 페이지 멈춤 */
```

**✅ 올바른 방법: 필요에 따라 사용**
```css
/* 전략 1: 실제로 애니메이션이 필요한 요소에만 활성화 */
.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);  /* 자동으로 컴포지트 레이어 생성 */
}

/* 전략 2: will-change로 브라우저에 힌트 제공 */
.card {
  will-change: transform;  /* 미리 레이어 생성 */
}

/* 전략 3: 애니메이션 종료 후 제거 */
.card:not(:hover) {
  will-change: auto;  /* GPU 메모리 해제 */
}
```
:::

<CompositeDemo />

---

## 8. 이벤트 루프: JavaScript의 "분신술"

::: tip 🤔 이벤트 루프란 무엇인가요?
**이벤트 루프(Event Loop)** 는 JavaScript가 "비동기"를 구현하는 메커니즘입니다. JavaScript는 **싱글 스레드**이기 때문에(한 번에 한 가지 일만 할 수 있음), 사용자 클릭, 네트워크 요청, 타이머 등 다양한 작업을 처리하려면 이 작업들을 관리할 "스케줄링 시스템"이 필요합니다.

이것을 **택배 분류 센터**에 비유할 수 있습니다:
- **Call Stack(호출 스택)** = 현재 처리 중인 택배
- **Web APIs** = 외부 협력 창고 (타이머, 네트워크 요청 등)
- **Callback Queue(콜백 큐)** = 처리 대기 중인 택배 선반
- **Event Loop(이벤트 루프)** = 분류 로봇 ("다음 작업을 처리할 수 있는지" 계속 확인)
:::

### 8.1 매크로 태스크와 마이크로 태스크

초기 JavaScript에는 하나의 태스크 큐만 있었습니다. 하지만 비동기 프로그래밍이 복잡해지면서, 브라우저는 두 가지 유형의 태스크를 도입했습니다:

| 유형 | 일반적인 출처 | 우선순위 | 실행 시점 |
|------|---------|--------|----------|
| **매크로 태스크** | `setTimeout`/`setInterval`, I/O 작업, UI 렌더링 | 낮음 | 각 이벤트 루프 주기마다 하나씩 실행 |
| **마이크로 태스크** | `Promise.then`, `MutationObserver` | 높음 | 현재 매크로 태스크 종료 후, 모든 마이크로 태스크 즉시 비우기 |

**실행 순서 "암기 비법"**:

```
1. 현재 매크로 태스크 실행 (예: <script> 전체)
2. 실행 과정에서 생성된 모든 마이크로 태스크 (Promise.then 등)
   ↳ 마이크로 태스크는 새로운 마이크로 태스크를 생성할 수 있으며, 모두 비워질 때까지 계속
3. 필요하다면 UI 렌더링 (리플로우/리페인트)
4. 다음 이벤트 루프 주기 시작, 다음 매크로 태스크 실행
```

### 8.2 사례: Promise vs setTimeout 성능 비교

::: danger ❌ 일반적인 오해: setTimeout(fn, 0)은 "즉시" 실행된다
많은 사람들이 `setTimeout(fn, 0)`이 "0밀리초 후 즉시 실행"된다고 생각합니다. 이것은 **틀린** 이해입니다.

실제로 `setTimeout(fn, 0)`의 의미는: **"최소 0밀리초 대기 후, 콜백을 매크로 태스크 큐에 추가"** 입니다. 하지만 현재 호출 스택이 비워지고, 마이크로 태스크 큐가 비워지고, 가능한 UI 렌더링이 완료된 후에야 실행될 수 있습니다.
:::

::: details 실행 순서 보기
```javascript
console.log('1. Start')

setTimeout(() => {
  console.log('2. setTimeout callback')
}, 0)

Promise.resolve().then(() => {
  console.log('3. Promise.then')
})

console.log('4. End')

// 예상했던 출력 순서:
// 1. Start
// 4. End
// 2. setTimeout callback  ← setTimeout(0)은 즉시 아닌가?
// 3. Promise.then

// 실제 출력 순서:
// 1. Start
// 4. End
// 3. Promise.then         ← Promise.then이 setTimeout보다 먼저 실행!
// 2. setTimeout callback
```

**실행 흐름도:**
```
호출 스택(Call Stack)           매크로 태스크 큐                 마이크로 태스크 큐
                                [setTimeout callback]           [Promise.then callback]

1. console.log('1. Start')
   → 출력: 1. Start

2. setTimeout(fn, 0)
   → 콜백을 매크로 태스크 큐에 추가   ← [setTimeout callback]

3. Promise.resolve().then()
   → 콜백을 마이크로 태스크 큐에 추가                                ← [Promise.then callback]

4. console.log('4. End')
   → 출력: 4. End

5. 호출 스택 비워짐, 마이크로 태스크 큐 확인
   → Promise.then 콜백 발견
   → 실행: console.log('3. Promise.then')
   → 출력: 3. Promise.then

6. 마이크로 태스크 큐 비워짐
   → UI 렌더링 필요할 수 있음 (변경 사항이 있다면)

7. 매크로 태스크 큐 확인
   → setTimeout 콜백 발견
   → 실행: console.log('2. setTimeout callback')
   → 출력: 2. setTimeout callback
```
:::

::: tip 💡 핵심 교훈
**마이크로 태스크가 매크로 태스크보다 "더 급합니다"**. 어떤 작업을 "현재 코드 블록 종료 후, 하지만 UI 업데이트 전에" 가능한 한 빨리 실행하고 싶다면, `Promise.then` 또는 `queueMicrotask`를 사용하세요.

`setTimeout(0)`은 즉시 실행을 보장하지 않으며, 최소한 현재 호출 스택이 비워지고 마이크로 태스크 큐가 비워진 후에야 실행됩니다.
:::

<JSEventLoopDemo />

<MacroMicroTaskDemo />

---

## 9. 성능 최적화 실전: 웹 페이지를 "날아다니게" 만들기

렌더링 파이프라인의 작동 방식을 이해했으니, 이제 최적화 방법을 살펴보겠습니다. 다음은 가장 실용적인 다섯 가지 최적화 팁입니다.

### 9.1 황금률: 강제 동기 레이아웃 피하기

**문제**: 레이아웃 속성을 번갈아 읽고 쓰면 레이아웃 스래싱이 발생합니다.

::: details 최적화 전후 비교 보기
```javascript
// ❌ 매우 나쁨: 읽기/쓰기 번갈아 하기, 레이아웃 스래싱 유발
for (let i = 0; i < elements.length; i++) {
  const height = elements[i].offsetHeight  // 읽기 → 강제 레이아웃
  elements[i].style.height = (height * 2) + 'px'  // 쓰기 → 리플로우 필요 마킹
  // 다음 루프의 읽기가 또 강제 레이아웃... 악순환!
}

// ✅ 매우 좋음: 먼저 모두 읽고, 그 다음 모두 쓰기
// 첫 번째 단계: 배치 읽기
const heights = []
for (let i = 0; i < elements.length; i++) {
  heights.push(elements[i].offsetHeight)
}

// 두 번째 단계: 배치 쓰기
requestAnimationFrame(() => {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.height = (heights[i] * 2) + 'px'
  }
})
```
:::

### 9.2 transform과 opacity로 애니메이션 만들기

**문제**: `width`, `height`, `left`, `top`으로 애니메이션을 만들면 리플로우가 발생합니다.

::: details 최적화 전후 비교 보기
```css
/* ❌ 나쁜 애니메이션: 리플로우 유발 */
.box {
  transition: width 0.3s, left 0.3s;
}
.box.moving {
  width: 200px;
  left: 100px;
}

/* ✅ 좋은 애니메이션: 컴포지트만 유발 */
.box {
  transition: transform 0.3s;
}
.box.moving {
  transform: translateX(100px) scaleX(2);
}
```
:::

### 9.3 가상 스크롤: 대용량 리스트 문제 해결

**문제**: 리스트 항목이 수천 개에 달할 때, DOM 노드 수가 너무 많아 성능 문제가 발생합니다.

**핵심 아이디어**: 뷰포트 내에 보이는 리스트 항목만 렌더링하고(약간의 버퍼 추가), DOM 노드 수는 고정되어 데이터 총량과 무관합니다.

<RenderingPerformanceDemo />

::: details 가상 스크롤 구현 보기
```vue
<template>
  <div class="virtual-list" @scroll="handleScroll">
    <!-- 플레이스홀더 요소, 스크롤바 높이 확보 -->
    <div class="phantom" :style="{ height: totalHeight + 'px' }"></div>

    <!-- 실제 렌더링되는 리스트 항목 -->
    <div class="content" :style="{ transform: `translateY(${offsetY}px)` }">
      <div
        v-for="item in visibleItems"
        :key="item.id"
        class="item"
        :style="{ height: itemHeight + 'px' }"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  items: Array,
  itemHeight: { type: Number, default: 50 }
})

const scrollTop = ref(0)
const buffer = 5  // 버퍼 수량

// 뷰포트에 표시 가능한 항목 수
const visibleCount = computed(() => 10)

// 시작 인덱스
const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - buffer)
)

// 종료 인덱스
const endIndex = computed(() =>
  Math.min(props.items.length, startIndex.value + visibleCount.value + buffer * 2)
)

// 현재 보이는 데이터
const visibleItems = computed(() =>
  props.items.slice(startIndex.value, endIndex.value)
)

// 총 높이
const totalHeight = computed(() => props.items.length * props.itemHeight)

// 오프셋
const offsetY = computed(() => startIndex.value * props.itemHeight)

const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop
}
</script>
```
:::

### 9.4 디바운스와 스로틀: 이벤트 발생 빈도 줄이기

**문제**: 빈번하게 발생하는 이벤트(예: scroll, resize)가 성능 문제를 일으킵니다.

::: details 디바운스와 스로틀 구현 보기
```javascript
// 디바운스(Debounce): 지연 실행, 지연 시간 내에 다시 트리거되면 타이머 재설정
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// 스로틀(Throttle): 고정 시간 간격으로 실행
function throttle(fn, interval) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

// 사용 예시
window.addEventListener('scroll', debounce(handleScroll, 200))
window.addEventListener('resize', throttle(handleResize, 100))
```
:::

### 9.5 지연 로딩: 중요하지 않은 리소스 지연 로딩

**문제**: 첫 화면에 너무 많은 리소스가 로딩되어 페이지 열림 속도가 느려집니다.

::: details 지연 로딩 구현 보기
```javascript
// 이미지 지연 로딩
const lazyImages = document.querySelectorAll('img[data-src]')

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src  // 실제 이미지 로딩
      img.removeAttribute('data-src')
      observer.unobserve(img)  // 관찰 중지
    }
  })
})

lazyImages.forEach(img => imageObserver.observe(img))
```
:::

---

## 10. 이제 식별할 수 있어야 할 성능 문제들

브라우저의 렌더링 파이프라인을 이해했다면, 다음과 같은 일반적인 성능 문제를 식별할 수 있어야 합니다:

| 문제 코드 | 문제점 | AI에게 설명하는 방법 |
|---------|---------|-------------|
| `element.style.width = ...` | 루프에서 빈번하게 너비 수정 | "여기서 여러 번 리플로우가 발생합니다. transform으로 바꾸거나 배치 처리해 주세요" |
| `height = element.offsetHeight` | 쓰기 후 즉시 레이아웃 속성 읽기 | "이것은 강제 동기 레이아웃입니다. 읽기와 쓰기 작업을 분리해 주세요" |
| `element.className = ...` | 빈번한 class 수정으로 스타일 재계산 유발 | "classList.add/remove로 대체하여 스타일 계산을 줄여 주세요" |
| 애니메이션에 `width`/`left` 사용 | 리플로우와 리페인트 유발, 성능 저하 | "transform과 opacity로 애니메이션을 바꿔 주세요" |
| 모든 요소에 `translateZ(0)` 추가 | GPU 가속 남용으로 메모리 폭발 | "애니메이션이 필요한 요소에만 GPU 가속을 활성화해 주세요" |
| 리스트 항목 10000개 전부 렌더링 | DOM 노드 과다로 끊김 현상 | "가상 스크롤을 구현하여 보이는 영역만 렌더링해 주세요" |
| scroll 이벤트에서 직접 DOM 조작 | 트리거 빈도가 너무 높아 끊김 현상 | "requestAnimationFrame 또는 스로틀로 최적화해 주세요" |
| `box-shadow`로 hover 애니메이션 | 복잡한 그림자 계산이 매우 느림 | "transform 또는 가상 요소로 변경하고, 애니메이션 그림자를 피해 주세요" |

**각 장의 "실전 경험담"을 꼼꼼히 읽었다면, 다음과 같은 핵심 개념도 마스터했을 것입니다:**

- **렌더링 파이프라인 5단계**: DOM/CSSOM → 렌더 트리 → 레이아웃 → 페인트 → 컴포지트
- **리플로우 vs 리페인트**: 리플로우가 가장 비쌈(기하 변경), 리페인트가 그 다음(외관 변경)
- **강제 동기 레이아웃**: 읽기/쓰기 번갈아 하면 레이아웃 스래싱 발생, 반드시 분리
- **GPU 가속**: transform과 opacity는 GPU에서 처리, 성능 최고
- **이벤트 루프**: JavaScript는 싱글 스레드, 태스크 큐를 통해 비동기 구현

이 개념들은 성능 병목을 빠르게 찾는 데 도움이 될 것입니다.

::: info 💡 성능 문제가 발생했을 때 AI에게 이렇게 말하세요
- "애니메이션이 끊깁니다. 리플로우나 리페인트가 발생하는지 확인해 주세요"
- "스크롤 성능이 나쁩니다. 스로틀이나 requestAnimationFrame이 필요할 수 있습니다"
- "리스트 데이터가 많을 때 끊깁니다. 가상 스크롤이 필요합니다"
- "빈번한 스타일 수정으로 성능 문제가 발생합니다. transform으로 최적화해 주세요"
:::

---

## 11. 정리: 렌더링 파이프라인 최적화의 본질

이 글을 통해 다음과 같은 핵심 결론을 도출할 수 있습니다:

**실천적 관점에서**: 최적화는 많을수록 좋은 것이 아니라, "적절한 곳에" 하는 것이 좋습니다. 브라우저의 렌더링 파이프라인을 이해해야만 어디에 힘을 쏟고 어디에 힘을 뺄지 알 수 있습니다.

**비용 관점에서 보면**:
- 대부분의 성능 낭비는 레이아웃 속성의 **빈번한 읽기/쓰기 번갈아 하기**에서 비롯되며, 읽기/쓰기 분리와 배치 처리를 통해 해결해야 합니다
- 복잡한 애니메이션 효과가 리플로우와 리페인트를 유발한다면, 대개 "잘못된 속성"을 사용했기 때문이며, `transform`과 `opacity`로 해결해야 합니다
- 대용량 데이터의 리스트 렌더링에서는 가상 DOM만으로는 부족하며, 반드시 **가상 스크롤** 등의 기술을 결합해야 합니다

**목표는: 주어진 브라우저와 하드웨어 조건에서, 모든 렌더링 단계의 투자가 명확한 성능 이점을 가져오도록 하는 것입니다.**

---

## 12. 용어 대조표

| 영문 용어 | 한국어 대조 | 설명 |
| :--- | :--- | :--- |
| **DOM** | 문서 객체 모델 | 브라우저가 HTML 문서를 파싱하여 형성한 트리 구조, JavaScript는 DOM API를 통해 페이지 요소를 조작할 수 있음 |
| **CSSOM** | CSS 객체 모델 | 브라우저가 CSS를 파싱하여 형성한 트리 구조, DOM과 결합하여 최종 스타일 계산에 사용 |
| **Render Tree** | 렌더 트리 | DOM 트리와 CSSOM 트리를 병합하여 구성, 보이는 노드만 포함, 후속 레이아웃 계산과 페인트에 사용 |
| **Layout** | 레이아웃 | 렌더 트리의 각 노드에 대한 기하 정보(위치, 크기)를 계산하는 과정, Reflow(리플로우)라고도 함 |
| **Reflow** | 리플로우/재배치 | 요소의 크기, 위치 등 기하 속성이 변경될 때, 브라우저가 레이아웃을 다시 계산해야 하는 과정 |
| **Paint** | 페인트/그리기 | 레이아웃 계산 후 요소의 스타일(색상, 배경, 테두리 등)을 화면에 그리는 과정 |
| **Repaint** | 리페인트/다시 그리기 | 요소의 외관 속성(예: 색상, 배경)이 변경되었지만 기하 속성에 영향을 주지 않을 때 발생하는 페인트 업데이트 |
| **Composite** | 컴포지트/합성 | 여러 페인트 레이어(Layer)를 최종 화면 이미지로 병합하는 과정, 일반적으로 GPU에서 실행 |
| **Layer** | 레이어/합성 레이어 | 브라우저가 렌더링 최적화를 위해 생성하는 독립적인 그리기 표면, 개별적으로 변환 및 합성 가능 |
| **Event Loop** | 이벤트 루프 | JavaScript의 비동기 실행 메커니즘, 매크로 태스크와 마이크로 태스크의 실행을 스케줄링 |
| **Call Stack** | 호출 스택 | 현재 실행 중인 JavaScript 함수를 기록하는 데이터 구조 |
| **Macro Task** | 매크로 태스크 | 이벤트 루프에서 우선순위가 낮은 태스크 유형, setTimeout, setInterval, I/O 작업 등 |
| **Micro Task** | 마이크로 태스크 | 이벤트 루프에서 우선순위가 높은 태스크 유형, Promise.then, MutationObserver 등 |
| **Forced Synchronous Layout** | 강제 동기 레이아웃 | JavaScript에서 레이아웃 속성을 번갈아 읽고 쓰면, 브라우저가 즉시 레이아웃 계산을 강제로 실행하게 되는 성능 문제 |
| **Layout Thrashing** | 레이아웃 스래싱 | 빈번한 강제 동기 레이아웃으로 인해 성능이 급격히 저하되는 현상 |
| **Virtual Scrolling** | 가상 스크롤 | 뷰포트 내에 보이는 리스트 항목만 렌더링하는 기술, 대용량 리스트의 성능 최적화에 사용 |
| **RAF** | requestAnimationFrame | 브라우저가 제공하는 API, 다음 리페인트 전에 애니메이션 관련 JavaScript 코드를 실행하는 데 사용 |