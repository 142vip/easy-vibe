# HTML/CSS 레이아웃 기초
::: tip 🎯 핵심 질문
**웹페이지는 어떻게 만들어질까요? 왜 어떤 웹페이지는 텍스트만 있고, 어떤 웹페이지는 앱처럼 상호작용할 수 있을까요?** 이 질문은 웹 개발의 3대 기초를 이해하게 해주며, 모든 웹페이지 뒤에 있는 구조를 이해할 수 있게 합니다.
:::

---

## 1. HTML, CSS, JavaScript는 각각 개요
### 1.1 정적 웹페이지에서 동적 애플리케이션으로

거리에서 보는 **포스터**를 상상해 보세요. 보고만 있을 수 있고, 상호작용할 수 없습니다. 포스터는 당신이 봤다고 해서 내용이 바뀌지도 않고, 어딘가를 클릭했다고 해서 더 많은 정보가 나타나지도 않습니다.

초기 웹페이지는 바로 이런 "전자 포스터"였습니다. 볼 수만 있고, 바꿀 수 없고, 내용이 고정되어 있었죠.

하지만 현대 웹페이지는 완전히 다릅니다. 마치 **데스크톱 애플리케이션**처럼 작동합니다.

- 클릭, 드래그, 입력, 업로드할 수 있습니다
- 페이지가 사용자의 조작에 따라 실시간으로 변화합니다
- 소프트웨어처럼 복잡한 작업(예: 온라인 영상 편집)을 완료할 수 있습니다

**이러한 변화의 핵심 원인은 바로 웹 기술의 3대 기초: HTML + CSS + JavaScript입니다**.

### 1.2 비유: 집 짓기

| 기술           | 🏠 집 비유              | 실제 역할             | 구체적인 예시                             |
| -------------- | ------------------------ | -------------------- | ------------------------------------ |
| **HTML**       | 집의 **구조와 재료**     | 웹페이지의 콘텐츠와 계층 정의 | 이것은 벽, 이것은 창문, 이것은 방 |
| **CSS**        | 집의 **인테리어와 외관**     | 웹페이지의 스타일과 레이아웃 제어 | 벽을 파란색으로 칠하기, 창문을 동쪽에 배치하기, 바닥에 타일 깔기 |
| **JavaScript** | 집의 **전기와 스마트 시스템** | 웹페이지에 상호작용과 로직 부여 | 스위치를 누르면 불이 켜지고, 문을 열면 커튼이 자동으로 열림       |

::: tip 💡 세 가지의 관계

**HTML → CSS**: 먼저 집이 있어야 인테리어를 할 수 있습니다. HTML은 기초, CSS는 꾸밈입니다.

**HTML + CSS → JavaScript**: 먼저 집과 인테리어가 있어야 스마트 시스템을 설치할 수 있습니다. JavaScript는 "죽은" 페이지를 "살아있는" 페이지로 만듭니다.

**핵심 개념**: 세 가지는 각자 역할이 있고, 하나라도 빠지면 안 됩니다. HTML만 있는 페이지는 못생겼고, HTML+CSS만 있는 페이지는 상호작용할 수 없으며, 세 가지가 모두 갖춰져야 위챗 웹버전, 타오바오 같은 "웹 애플리케이션"을 만들 수 있습니다.
:::

### 1.3 직접 해보기

👇 아래 데모는 HTML/CSS/JavaScript 세 가지가 어떻게 협력하는지 보여줍니다:

<WebTechTriad />

---

## 2. HTML: 웹페이지의 뼈대

### 2.1 HTML 도입 동기

HTML이 등장하기 전, 인터넷상의 콘텐츠는 그저 **일반 텍스트**였습니다. 지금 읽고 있는 이 글처럼, 서식도 없고, 계층도 없고, 링크도 없었습니다.

일반 텍스트의 문제는 무엇일까요?

- ❌ **계층을 표현할 수 없음**: 무엇이 제목이고, 본문이고, 주석인지 구분할 수 없음
- ❌ **기계가 이해할 수 없음**: 검색 엔진, 스크린 리더(시각 장애인용)가 콘텐츠를 이해할 수 없음
- ❌ **상호작용할 수 없음**: 링크도, 버튼도, 입력창도 없음

**HTML (HyperText Markup Language)**은 바로 이 문제를 해결하기 위해 탄생했습니다. "태그(tag)"를 사용하여 콘텐츠의 의미를 표시하고, 브라우저가 "이것이 무엇인지" 알 수 있게 합니다.

### 2.2 HTML 코드 구조 개요

HTML의 기본 단위는 "태그(tag)"입니다. 태그는 꺾쇠 괄호 `< >`로 감싸고, 쌍으로 나타납니다:

```html
<h1>이것은 제목</h1>
<p>이것은 단락</p>
<a href="url">이것은 링크</a>
```

**핵심 개념**:

| 개념 | 설명 | 예시 |
|------|------|------|
| **태그** | 꺾쇠 괄호로 감싼 표시 | `<h1>`, `</h1>` |
| **요소** | 태그 + 콘텐츠 전체 | `<h1>제목</h1>` |
| **속성** | 태그의 추가 정보 | `href="url"`, `class="card"` |
| **중첩** | 태그 안에 다시 태그 넣기 | `<div><p>텍스트</p></div>` |

### 2.3 HTML 코드 해독 방법

::: tip 🎯 초보자 필독: 코드 읽는 방법

많은 초보자는 `<xxx>` 같은 것들을 보면 어지러워집니다. 사실 HTML 코드를 읽는 데는 **정해진 패턴**이 있습니다:

**첫 번째 단계: "가장 바깥쪽" 찾기**

```html
<div class="card">        ← 이것은 컨테이너, 안에 콘텐츠가 들어 있음
  <h2>제목</h2>
  <p>설명 텍스트</p>
</div>
```

**두 번째 단계: 태그 이름으로 의미 추측하기**

| 태그명 | 한눈에 기억하기 | 안에 무엇을 넣나 |
|--------|----------|------------|
| `<div>` | 큰 상자 | 모든 콘텐츠, 그룹화용 |
| `<span>` | 작은 상자 | 텍스트 조각, 표시용 |
| `<p>` | 단락 | 한 단락의 텍스트 |
| `<h1>`-`<h6>` | 제목 | 제목 텍스트, 숫자가 작을수록 중요 |
| `<a>` | 앵커/링크 | 클릭하여 이동할 수 있는 콘텐츠 |
| `<img>` | 이미지 | 콘텐츠를 넣지 않고 src로 이미지 지정 |
| `<button>` | 버튼 | 클릭 가능한 텍스트/아이콘 |
| `<input>` | 입력창 | 콘텐츠를 넣지 않고 사용자가 입력하는 곳 |

**세 번째 단계: class와 id 보기**

```html
<div class="user-card" id="user-123">
```

- `class="user-card"` → 이 요소의 "유형", CSS로 일괄 선택 가능
- `id="user-123"` → 이 요소의 "주민등록번호", 고유 식별자

**네 번째 단계: 들여쓰기는 계층을 나타냄**

```html
<body>
  <header>           ← 들여쓰기는 header가 body의 자식임을 나타냄
    <nav>            ← nav는 header의 자식
      <a>홈</a>    ← a는 nav의 자식
    </nav>
  </header>
</body>
```
:::

### 2.4 자주 사용하는 HTML 태그 빠른 참조

**구조 태그** (페이지 뼈대 정의):

```html
<h1>이것은 1단계 제목</h1>
<h2>이것은 2단계 제목</h2>
<p>이것은 하나의 단락</p>
<div>이것은 컨테이너 (그룹화용)</div>
<span>이것은 인라인 컨테이너 (텍스트 표시용)</span>
```

**링크와 미디어** (페이지를 풍부하게):

```html
<a href="https://example.com">여기를 클릭하여 이동</a>
<img src="photo.jpg" alt="사진 설명" />
<video src="movie.mp4" controls></video>
```

**폼** (사용자 입력 수집):

```html
<form>
  <input type="text" placeholder="사용자 이름을 입력하세요" />
  <input type="password" placeholder="비밀번호를 입력하세요" />
  <button type="submit">로그인</button>
</form>
```

**시맨틱 태그** (HTML5에서 추가, 페이지 의미를 더 명확하게):

```html
<header>페이지 헤더</header>
<nav>내비게이션 바</nav>
<main>주요 콘텐츠 영역</main>
<article>하나의 기사</article>
<aside>사이드바</aside>
<footer>푸터</footer>
```

::: tip 💡 왜 시맨틱 태그를 사용해야 할까?

`<div class="header">`와 `<header>`는 효과가 같아 보이는데, 왜 후자를 사용해야 할까?

1. **SEO 친화적**: 검색 엔진이 페이지 구조를 더 잘 이해할 수 있음
2. **접근성**: 스크린 리더가 "내비게이션", "주요 콘텐츠" 등 영역을 빠르게 찾을 수 있음
3. **코드 가독성**: `<header>`를 보면 한눈에 헤더임을 알 수 있음

**언제 div를 사용할까?** 적절한 시맨틱 태그가 없을 때입니다. 예를 들어 순수한 장식용 컨테이너 같은 경우입니다.
:::

### 2.5 수많은 HTML 태그 학습 전략

::: tip 🎯 초보자의 고민

"HTML 태그는 100개가 넘는데, 어떻게 다 외우나요?"

**답은: 전부 외울 필요는 없습니다.** 실제 개발에서는 90%의 경우 20개 정도의 태그만 사용합니다.
:::

#### 용도별 분류로 기억하기

**1. 페이지 구조류 (뼈대 그리기)**

| 태그 | 기억 팁 | 용도 |
|------|----------|------|
| `<header>` | 머리 | 페이지 또는 섹션의 헤더 |
| `<nav>` | 내비게이션 | 내비게이션 링크 영역 |
| `<main>` | 메인 | 페이지 주요 콘텐츠 (페이지당 하나만) |
| `<article>` | 기사 | 독립적인 콘텐츠 블록 (따로 떼어내도 의미가 있음) |
| `<section>` | 섹션 | 주제가 있는 콘텐츠 그룹 |
| `<aside>` | 옆 | 사이드바, 보충 콘텐츠 |
| `<footer>` | 발 | 페이지 또는 섹션의 하단 |

**기억 방법**: 신문을 상상해 보세요 - 제호(header), 목차(nav), 본문(main/article), 칼럼(aside), 발행 정보(footer).

**2. 콘텐츠 마크업류 (무엇인지 명확히 하기)**

| 태그 | 기억 팁 | 용도 |
|------|----------|------|
| `<h1>`-`<h6>` | 제목1-6 | 제목 계층, h1이 가장 크고 중요 |
| `<p>` | 단락 | 한 단락의 텍스트 |
| `<ul>`/`<ol>`/`<li>` | 순서 없음/순서 있음/목록 항목 | 목록 |
| `<a>` | 앵커 | 링크, 이동용 |
| `<img>` | 이미지 | 이미지 |
| `<video>`/`<audio>` | 비디오/오디오 | 멀티미디어 |
| `<strong>`/`<em>` | 강조/기울임 강조 | 시맨틱한 강조 |

**기억 방법**: `<a>`는 anchor(닻)의 약자입니다. 배가 닻을 내려 한 곳에 정박하는 것처럼, 링크는 다른 페이지에 "정박"하는 것입니다.

**3. 폼 상호작용류 (사용자 입력 수집)**

| 태그 | 기억 팁 | 용도 |
|------|----------|------|
| `<form>` | 폼 | 폼 컨테이너 |
| `<input>` | 입력 | 다양한 입력창 (type이 유형 결정) |
| `<textarea>` | 텍스트 영역 | 여러 줄 텍스트 입력 |
| `<select>`/`<option>` | 선택/옵션 | 드롭다운 선택 |
| `<button>` | 버튼 | 버튼 |
| `<label>` | 레이블 | 입력창의 설명 텍스트 |

**기억 방법**: `<input>`의 type 속성이 어떤 모양인지 결정합니다:
- `type="text"` → 텍스트 상자
- `type="password"` → 비밀번호 입력창
- `type="email"` → 이메일 입력창
- `type="checkbox"` → 체크박스
- `type="radio"` → 라디오 버튼

**4. 컨테이너류 (그룹화용)**

| 태그 | 기억 팁 | 용도 |
|------|----------|------|
| `<div>` | 큰 상자 | 블록 레벨 컨테이너, 한 줄을 독차지 |
| `<span>` | 작은 상자 | 인라인 컨테이너, 콘텐츠 너비만 차지 |

**기억 방법**: div = division(구역), span = span(범위). div는 큰 영역을 나누는 데, span은 텍스트 조각을 표시하는 데 사용합니다.

#### 태그 예외 처리 방법

**방법 1: 영어 단어 추측하기**

많은 태그는 영어 단어의 약자입니다:
- `<abbr>` = abbreviation(약어)
- `<blockquote>` = block quote(블록 인용)
- `<caption>` = caption(제목/설명)
- `<figcaption>` = figure caption(그림 설명)

**방법 2: MDN 검색하기**

[MDN HTML 요소 참조](https://developer.mozilla.org/ko/docs/Web/HTML/Element)에서 모든 태그의 상세한 설명을 볼 수 있습니다.

**방법 3: AI에게 물어보기**

> "HTML에서 `<dl>` 태그는 무슨 뜻인가요? 언제 사용하나요?"

#### 태그를 억지로 외울 필요는 없습니다

**실제 작업 흐름은 이렇습니다**:

1. "컨테이너"가 필요하다는 것을 앎 → `<div>` 작성
2. 나중에 이것이 "내비게이션 영역"임을 발견 → `<nav>`로 변경
3. 나중에 이것이 "독립적인 기사"임을 발견 → `<article>`로 변경

**먼저 작성하고, 나중에 시맨틱을 최적화하세요**. 태그는 언제든지 바꿀 수 있으니, 처음부터 어떤 태그를 쓸지 고민하지 마세요.

---

## 3. CSS: 웹페이지의 스킨

### 3.1 CSS 도입 동기

**기본 건물**에 입주했다고 상상해 보세요: 벽도 있고, 창문도 있고, 문도 있어서 살 수는 있지만:

- 벽은 회색 콘크리트라 예쁘지 않음
- 콘센트와 스위치가 아무렇게나 설치되어 있어 보기 좋지 않음
- 가구가 없어 생활이 불편함

HTML만 있는 웹페이지가 바로 이런 상태입니다: 콘텐츠도 있고 구조도 있지만, **못생겼고**, **지저분하고**, **사용자 친화적이지 않습니다**.

CSS (Cascading Style Sheets)는 웹페이지의 "인테리어 팀"입니다. HTML의 구조를 바꾸지 않고(벽을 허물거나 문을 바꾸지 않음), 오직 다음을 담당합니다:

- 🎨 **벽 칠하기**: 색상, 배경 변경
- 🖼️ **그림 걸기**: 테두리, 그림자, 둥근 모서리 추가
- 🪑 **가구 배치**: 레이아웃, 간격, 정렬 조정

### 3.2 CSS 코드 구조 개요

CSS 코드는 정해진 형식이 있습니다:

```css
선택자 {
  속성명: 속성값;
  속성명: 속성값;
}
```

**세 가지 작성 방식**:

```html
<!-- 방식 1: 인라인 스타일 (임시 테스트용) -->
<div style="color: red;">빨간색 텍스트</div>

<!-- 방식 2: 내부 스타일 (HTML 파일 안에 작성) -->
<style>
  .red-text { color: red; }
</style>

<!-- 방식 3: 외부 스타일 (독립 CSS 파일, 권장) -->
<link rel="stylesheet" href="styles.css" />
```

### 3.3 CSS 코드 해독 방법

::: tip 🎯 초보자 필독: CSS 읽는 방법

**첫 번째 단계: 선택자 보기 — "누구를 꾸밀까?"**

| 선택자 | 작성법 | 의미 |
|--------|------|------|
| 태그 선택자 | `p { }` | 모든 `<p>` 태그 |
| 클래스 선택자 | `.card { }` | 모든 `class="card"` 요소 |
| ID 선택자 | `#header { }` | 유일한 `id="header"` 요소 |
| 자손 선택자 | `.card h2 { }` | `.card` 안의 모든 `<h2>` |
| 그룹 선택자 | `.card, .box { }` | `.card` 또는 `.box` 모두 선택 |

**두 번째 단계: 속성 보기 — "무엇을 꾸밀까?"**

| 속성 분류 | 주요 속성 | 역할 |
|----------|----------|------|
| 텍스트 | `color`, `font-size`, `font-weight` | 색상, 크기, 굵기 |
| 배경 | `background`, `background-color` | 배경색, 배경 이미지 |
| 테두리 | `border`, `border-radius` | 테두리 선, 둥근 모서리 |
| 간격 | `margin`, `padding` | 바깥 여백, 안쪽 여백 |
| 레이아웃 | `display`, `flex`, `grid` | 배치 방식 |

**세 번째 단계: 값 보기 — "어떻게 꾸밀까?"**

```css
.card {
  width: 300px;        /* 고정 너비 */
  padding: 16px;       /* 안쪽 여백 16픽셀 */
  border-radius: 8px;  /* 둥근 모서리 8픽셀 */
  background: #fff;    /* 흰색 배경 */
}
```

**주요 단위**:
- `px`: 픽셀, 고정 크기
- `%`: 백분율, 부모 요소 기준
- `rem`: 루트 요소 글꼴 크기 기준
- `vw/vh`: 뷰포트 너비/높이 기준
:::

### 3.4 선택자 우선순위

한 요소가 여러 선택자에 동시에 선택되면, 누구의 말을 따를까?

```html
<p class="highlight" id="special">이 텍스트는 무슨 색일까?</p>
```

```css
p { color: red; }             /* 우선순위: 1 */
.highlight { color: yellow; } /* 우선순위: 10 */
#special { color: blue; }     /* 우선순위: 100 */
```

**답**: 파란색. ID 선택자 우선순위가 가장 높고, 클래스 선택자가 그 다음, 태그 선택자가 가장 낮습니다.

**인라인 스타일**(style 속성에 직접 작성)은 우선순위가 1000으로 가장 높습니다!

### 3.5 박스 모델:너비 불일치 원인

::: tip 🎯 실제 상황

웹페이지를 만들면서 세 개의 카드를 가로로 나란히 배치해야 합니다. 각 카드 너비 300px, 컨테이너 총 너비 900px. 다음과 같이 작성했습니다:

```css
.card { width: 300px; }
```

결과: **세 번째 카드가 다음 줄로 내려갔습니다!**

**왜 그럴까?** `width: 300px`는 콘텐츠 너비일 뿐, padding과 border를 계산하지 않았기 때문입니다. 카드에 `padding: 20px`과 `border: 1px`이 있다면 실제 너비는 342px, 세 카드 합치면 1026px로 컨테이너를 초과합니다!
:::

모든 HTML 요소는 CSS에서 "상자"로 간주되며, 네 겹으로 구성됩니다. **택배 포장**을 상상해 보세요: 콘텐츠는 상품, padding은 뽁뽁이, border는 상자, margin은 상자 간의 간격입니다.

👇 **직접 해보기**: 슬라이더를 드래그하여 각 레이어 크기를 조절하고 박스 모델의 변화를 관찰해 보세요:

<CssBoxModel />

**해결 방법**:

```css
.box {
  box-sizing: border-box;  /* width가 padding과 border를 포함하도록 함 */
  width: 200px;
  padding: 10px;
  border: 5px;
}
```

이렇게 하면 `width: 200px`가 최종 너비가 되고, padding과 border는 그 안으로 "들어갑니다".

### 3.6 Flexbox: 요소를자동 정렬 접근법

Flexbox는 현대 CSS에서 가장 많이 사용되는 레이아웃 방식입니다. 책장의 책이 자동으로 정렬되듯이 요소를 자동으로 배열하고 정렬합니다.

👇 **직접 해보기**: 방향, 정렬 방식을 전환하며 상자가 어떻게 배열되는지 관찰해 보세요:

<CssFlexbox />

**Flex 핵심 개념**:

| 속성 | 역할 | 주요 값 |
|------|------|--------|
| `display: flex` | Flex 레이아웃 활성화 | - |
| `flex-direction` | 주축 방향 | `row`(수평), `column`(수직) |
| `justify-content` | 주축 정렬 | `flex-start`, `center`, `space-between` |
| `align-items` | 교차축 정렬 | `stretch`, `center`, `flex-start` |
| `flex-wrap` | 줄바꿈 여부 | `nowrap`, `wrap` |
| `gap` | 요소 간격 | `10px`, `1rem` |

### 3.7 CSS 전처리기: SCSS/SASS와 LESS

::: tip 🎯 실제 상황

프로젝트를 작성했는데 CSS 파일이 2000줄입니다. 나중에 테마 색상을 바꾸려고 보니:

- 주 색상 `#3b82f6`이 50번 등장함
- 색상 하나 바꾸려면 전체 검색해서 바꾸고, 빠뜨릴까 봐 걱정됨
- 선택자가 `.nav .nav-list .nav-item .nav-link`처럼 길어서 유지보수가 어려움

**CSS 전처리기**는 바로 이러한 문제를 해결하기 위해 만들어졌습니다. CSS도 "프로그래밍"할 수 있게 해줍니다: 변수, 중첩, 코드 재사용이 가능해집니다.
:::

#### 3.7.1 CSS 전처리기 개요
**쉽게 설명하면**: 전처리기는 "더 똑똑한 CSS"입니다. 더 강력한 문법으로 스타일을 작성하면, 그것을 일반 CSS로 **컴파일**해 주고, 브라우저는 정상적으로 인식할 수 있습니다.

**왜 사용할까?**

| 문제점 | 순수 CSS | 전처리기 |
|------|----------|----------|
| 색상이 반복 등장 | 여기저기 복사 붙여넣기 | 변수 정의, 한 곳 수정으로 전체 적용 |
| 선택자 계층이 너무 깊음 | 길게 나열해서 작성 | 중첩 문법, 계층을 한눈에 파악 |
| 같은 스타일 반복 작성 | 복사 붙여넣기 | 믹스인(Mixin), 함수처럼 재사용 |

#### 3.7.2 3대 전처리기 비교

| 특성 | 순수 CSS | **SCSS/SASS** | **LESS** |
|------|----------|---------------|----------|
| **변수 작성법** | `--primary` | `$primary` | `@primary` |
| **중첩 문법** | ❌ 지원 안 함 | ✅ 지원 | ✅ 지원 |
| **믹스인(코드 재사용)** | ❌ 지원 안 함 | ✅ `@mixin` | ✅ `.mixin()` |
| **학습 난이도** | 쉬움 | 보통 | 보통 |
| **인기** | - | ⭐⭐⭐ 가장 인기 | ⭐⭐ 비교적 인기 |

**간단히 기억하기**:
- **SCSS**: `$` 기호 사용, Bootstrap 5에서 사용, 생태계가 가장 좋음
- **LESS**: `@` 기호 사용, CSS의 `@media` 작성법과 일치하여 배우기 쉬움

#### 3.7.3 핵심 기능 비교 예시

##### 1. 변수: 한 곳 수정, 전체 적용

**상황**: 테마 색상 `#3b82f6`이 20곳에서 사용되고 있는데, 빨간색으로 바꿔야 함.

<Tabs>
<TabItem label="순수 CSS">

```css
/* 20곳을 바꿔야 하고, 빠뜨리기 쉬움 */
.button { background: #3b82f6; }
.link { color: #3b82f6; }
.border { border-color: #3b82f6; }
```

</TabItem>
<TabItem label="SCSS">

```scss
$primary: #3b82f6;

.button { background: $primary; }
.link { color: $primary; }
.border { border-color: $primary; }
/* $primary 한 곳만 바꾸면 됨 */
```

</TabItem>
<TabItem label="LESS">

```less
@primary: #3b82f6;

.button { background: @primary; }
.link { color: @primary; }
.border { border-color: @primary; }
/* @primary 한 곳만 바꾸면 됨 */
```

</TabItem>
</Tabs>

##### 2. 중첩: 계층 관계를 한눈에

**상황**: 내비게이션 바에 여러 계층 구조가 있음.

<Tabs>
<TabItem label="순수 CSS">

```css
/* 길게 나열되어 계층 관계 파악이 어려움 */
.navbar .nav-list .nav-item .nav-link { }
.navbar .nav-list .nav-item .nav-link:hover { }
```

</TabItem>
<TabItem label="SCSS">

```scss
.navbar {
  .nav-list {
    .nav-item {
      .nav-link {
        &:hover { }  /* &는 부모 선택자를 나타냄 */
      }
    }
  }
}
```

</TabItem>
<TabItem label="LESS">

```less
.navbar {
  .nav-list {
    .nav-item {
      .nav-link {
        &:hover { }
      }
    }
  }
}
```

</TabItem>
</Tabs>

##### 3. 믹스인(Mixin): 코드 조각 재사용

**상황**: 여러 버튼에 "가운데 정렬" 스타일이 필요함.

<Tabs>
<TabItem label="순수 CSS">

```css
/* 3번 복사 붙여넣기 */
.btn-primary {
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-secondary {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

</TabItem>
<TabItem label="SCSS">

```scss
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-primary { @include center; }
.btn-secondary { @include center; }
```

</TabItem>
<TabItem label="LESS">

```less
.center() {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-primary { .center(); }
.btn-secondary { .center(); }
```

</TabItem>
</Tabs>

#### 3.7.4 선택 기준
| 상황 | 권장 선택 |
|------|----------|
| 이제 막 배우기 시작, 작은 프로젝트 | **순수 CSS** (먼저 기초를 다지기) |
| 프로젝트에서 Bootstrap 5 사용 | **SCSS** (Bootstrap 소스 코드가 SCSS) |
| 팀이 `@` 기호에 익숙함 | **LESS** (CSS의 `@media` 작성법과 일치) |
| 복잡한 로직(반복, 조건) 필요 | **SCSS** (기능이 더 강력함) |

#### 3.7.5 프로젝트에서 사용하기

**Vite 프로젝트 (가장 간단)**:

```bash
# sass 설치
npm install -D sass

# .scss 또는 .less 파일 직접 사용
```

::: tip 💡 초보자 조언

1. **먼저 순수 CSS를 잘 배우세요**: 전처리기는 "문법 설탕"일 뿐, CSS 기초를 모르면 사용할수록 더 혼란스러워집니다
2. **작은 프로젝트는 억지로 도입하지 마세요**: CSS가 200줄도 안 되면 그냥 CSS를 직접 쓰는 게 더 간단합니다
3. **SCSS부터 시작하세요**: 문법이 CSS와 거의 같고, `$` 변수만 추가된 정도입니다
4. **너무 깊게 중첩하지 마세요**: 3단계를 넘으면 코드 유지보수가 어려워집니다
:::

#### 3.7.6 다양한 기술 스택의 파일 구성 비교

**같은 프로젝트를 다른 기술 스택으로 만들면, 파일 구조가 어떻게 다를까?**

<Tabs>
<TabItem label="순수 HTML + CSS">

```
my-website/
├── index.html              # 페이지 구조
├── about.html
├── css/
│   ├── reset.css           # 초기화 스타일
│   ├── layout.css          # 레이아웃 스타일
│   ├── components.css      # 컴포넌트 스타일
│   └── style.css           # 메인 스타일 (수천 줄에 이를 수 있음)
├── js/
│   └── main.js
└── images/
    └── logo.png
```

**특징**:
- CSS가 하나 또는 몇 개의 파일에 집중됨
- 스타일을 바꾸려면 HTML과 CSS 파일을 오가야 함
- 스타일이 서로 충돌하기 쉬움

</TabItem>
<TabItem label="Vue + 순수 CSS">

```
src/
├── components/             # 컴포넌트 폴더
│   ├── Button/
│   │   ├── Button.vue      # 템플릿 + 스타일 + 로직
│   │   └── Button.test.js
│   ├── Header/
│   │   └── Header.vue
│   └── Footer/
│       └── Footer.vue
├── views/                  # 페이지 폴더
│   ├── Home.vue
│   └── About.vue
├── App.vue                 # 루트 컴포넌트
└── main.js                 # 진입점 파일
```

**Button.vue 내부 구조**:
```vue
<template>
  <button class="btn">클릭</button>
</template>

<script>
export default { name: 'Button' }
</script>

<style scoped>              <!-- scoped 스타일은 현재 컴포넌트에만 영향 -->
.btn { background: #3b82f6; }
</style>
```

</TabItem>
<TabItem label="Vue + SCSS">

```
src/
├── assets/
│   └── styles/
│       ├── _variables.scss     # 변수: 색상, 간격 등
│       ├── _mixins.scss        # 믹스인: 코드 블록 재사용
│       ├── _functions.scss     # 함수: 색상 계산 등
│       └── global.scss         # 전역 스타일 진입점
├── components/
│   ├── Button/
│   │   └── Button.vue          # 컴포넌트 내에서 @import로 변수 가져오기
│   └── Card/
│       └── Card.vue
├── views/
│   ├── Home.vue
│   └── About.vue
├── App.vue
└── main.js
```

**_variables.scss**:
```scss
$primary: #3b82f6;
$secondary: #64748b;
$spacing-sm: 8px;
$spacing-md: 16px;
```

**Button.vue**:
```vue
<style scoped lang="scss">
@import '@/assets/styles/variables';

.btn {
  background: $primary;      // 변수 사용
  padding: $spacing-md;
}
</style>
```

</TabItem>
<TabItem label="Vue + Tailwind CSS">

```
src/
├── components/
│   ├── Button.vue          # style 블록 불필요
│   ├── Card.vue
│   └── Header.vue
├── views/
│   ├── Home.vue
│   └── About.vue
├── App.vue
└── main.js

# 설정 파일 (루트 디렉터리)
tailwind.config.js          # 테마 설정
tailwind.css                # 기본 스타일 진입점
```

**Button.vue** (style 블록 없음):
```vue
<template>
  <button class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
    클릭
  </button>
</template>
```

**특징**:
- 별도의 스타일 파일이 없음
- 클래스명이 곧 스타일 (`bg-blue-500` = 파란색 배경)
- 설정이 `tailwind.config.js`에 집중됨

</TabItem>
</Tabs>

**핵심 차이점 요약**:

| 기술 스택 | 스타일 파일 위치 | 테마 관리 | 코드 재사용 |
|--------|-------------|----------|----------|
| 순수 HTML+CSS | 집중식 `css/` 폴더 | 검색 후 바꾸기 | 복사 붙여넣기 |
| Vue + CSS | `.vue` 컴포넌트 내에 분산 | 검색 후 바꾸기 | 복사 붙여넣기 |
| Vue + SCSS | 컴포넌트 내 + `styles/` 공통 파일 | 변수 통합 관리 | 믹스인 재사용 |
| Vue + Tailwind | 없음 (클래스명 안에) | `tailwind.config.js` | 클래스명 조합 |

### 3.8 수많은 CSS 속성 학습 전략

::: tip 🎯 초보자의 고민

"CSS 속성이 수백 개나 되는데, 어떻게 다 외우나요?"

**답은: 용도별로 분류하고, 핵심 속성만 기억하고, 나머지는 필요할 때 찾아보세요.**
:::

#### 용도별 분류로 기억하기

**1. 텍스트 타이포그래피류 (텍스트 모양 관리)**

| 속성 | 기억 팁 | 주요 값 |
|------|----------|--------|
| `color` | 색상 | `red`, `#fff`, `rgb(0,0,0)` |
| `font-size` | 글자 크기 | `16px`, `1rem`, `1.5em` |
| `font-weight` | 글자 굵기 | `normal`, `bold`, `100`-`900` |
| `font-family` | 글꼴 | `"맑은 고딕"`, `sans-serif` |
| `line-height` | 줄 높이 | `1.5`, `24px` |
| `text-align` | 텍스트 정렬 | `left`, `center`, `right` |
| `text-decoration` | 텍스트 장식 | `none`, `underline`, `line-through` |

**기억 방법**: 워드에서 문서 편집하는 것을 상상해 보세요 - 색상 변경, 크기 변경, 굵게, 글꼴 변경, 줄 간격 조정, 정렬, 밑줄 추가.

**2. 박스 모델류 (요소가 차지하는 공간 관리)**

| 속성 | 기억 팁 | 주요 값 |
|------|----------|--------|
| `width`/`height` | 너비/높이 | `100px`, `50%`, `100vw` |
| `padding` | 안쪽 여백 | `10px`, `10px 20px` |
| `margin` | 바깥 여백 | `10px`, `auto`(중앙 정렬용) |
| `border` | 테두리 | `1px solid #ccc` |
| `border-radius` | 둥근 모서리 | `4px`, `50%`(원형) |
| `box-sizing` | 박스 모델 | `border-box`(권장) |

**기억 방법**: padding은 "안" 여백(콘텐츠에서 테두리까지의 거리), margin은 "바깥" 여백(테두리에서 다른 요소까지의 거리).

**축약 규칙**:
```css
/* 네 개의 값: 위 오른쪽 아래 왼쪽 (시계 방향) */
padding: 10px 20px 15px 25px;

/* 두 개의 값: 위아래 좌우 */
padding: 10px 20px;

/* 하나의 값: 네 방향 모두 같음 */
padding: 10px;
```

**3. 배경과 테두리류 (요소의 모양 관리)**

| 속성 | 기억 팁 | 주요 값 |
|------|----------|--------|
| `background` | 배경 | `#fff`, `url(bg.jpg)`, `linear-gradient(...)` |
| `background-color` | 배경색 | `#fff`, `rgba(0,0,0,0.5)` |
| `background-image` | 배경 이미지 | `url(photo.jpg)` |
| `background-size` | 배경 크기 | `cover`, `contain`, `100%` |
| `background-position` | 배경 위치 | `center`, `top left` |
| `box-shadow` | 상자 그림자 | `0 2px 10px rgba(0,0,0,0.1)` |
| `opacity` | 투명도 | `0`-`1` (0은 완전 투명) |

**기억 방법**: `background`는 축약형으로, 여러 값을 한 번에 설정할 수 있습니다:
```css
background: #fff url(bg.jpg) no-repeat center/cover;
/*          색상  이미지      반복 여부    위치/크기 */
```

**4. 레이아웃류 (요소 배열 방법 관리)**

| 속성 | 기억 팁 | 주요 값 |
|------|----------|--------|
| `display` | 표시 방식 | `block`, `inline`, `flex`, `grid`, `none` |
| `position` | 위치 지정 | `static`, `relative`, `absolute`, `fixed`, `sticky` |
| `top`/`right`/`bottom`/`left` | 네 방향 | `10px`, `50%` (position과 함께 사용) |
| `z-index` | 층위 | 숫자가 클수록 위에 표시 |
| `float` | 플로트 | `left`, `right` (옛날 방식, 권장하지 않음) |
| `overflow` | 넘침 처리 | `visible`, `hidden`, `scroll`, `auto` |

**position 기억 방법**:
- `static`: 기본값, 일반 흐름
- `relative`: 자신의 원래 위치를 기준으로 오프셋
- `absolute`: 가장 가까운 position 지정 조상 요소를 기준으로 배치
- `fixed`: 뷰포트를 기준으로 배치 (스크롤해도 움직이지 않음)
- `sticky`: 특정 위치까지 스크롤되면 고정

**5. Flexbox 레이아웃류 (1차원 레이아웃의 신)**

| 속성 | 기억 팁 | 역할 |
|------|----------|------|
| `display: flex` | Flex 활성화 | 컨테이너를 Flex 컨테이너로 변환 |
| `flex-direction` | 방향 | `row`(가로), `column`(세로) |
| `justify-content` | 주축 정렬 | 요소가 주축에서 어떻게 배열될지 |
| `align-items` | 교차축 정렬 | 요소가 교차축에서 어떻게 정렬될지 |
| `flex-wrap` | 줄바꿈 | `nowrap`, `wrap` |
| `gap` | 간격 | 요소 사이의 간격 |
| `flex` | 유연성 | 자식 요소의 확장/축소 비율 |

**기억 방법**:
- `justify` = 정당화/정렬 → 주축 정렬
- `align` = 배열/정렬 → 교차축 정렬

**6. 애니메이션 전환류 (요소가 어떻게 움직일지 관리)**

| 속성 | 기억 팁 | 주요 값 |
|------|----------|--------|
| `transition` | 전환 | `all 0.3s ease` |
| `transform` | 변환 | `translate(10px)`, `rotate(45deg)`, `scale(1.1)` |
| `animation` | 애니메이션 | `fadeIn 1s ease forwards` |

**축약 규칙**:
```css
/* transition: 속성 지속시간 이징함수 지연 */
transition: all 0.3s ease 0s;

/* transform은 여러 변환을 조합할 수 있음 */
transform: translateX(10px) rotate(45deg) scale(1.1);
```

#### 속성 예외 처리 방법

**방법 1: 영어 단어 추측하기**

많은 속성은 영어 단어나 약자입니다:
- `margin` = 가장자리, 여유
- `padding` = 채우기
- `border` = 경계
- `visibility` = 가시성
- `cursor` = 커서

**방법 2: 상황별 연상하기**

어떤 효과를 구현하고 싶을 때, "키워드"를 떠올려 보세요:

| 하고 싶은 것... | 관련 속성 |
|---------|------------|
| 색상 변경 | `color`, `background-color`, `border-color` |
| 크기 변경 | `width`, `height`, `font-size` |
| 위치 변경 | `margin`, `position`, `top/left` |
| 간격 변경 | `padding`, `margin`, `gap` |
| 요소 숨기기 | `display: none`, `visibility: hidden`, `opacity: 0` |
| 가운데 정렬 | `margin: auto`, `text-align: center`, `justify-content: center` |
| 둥근 모서리 | `border-radius` |
| 그림자 추가 | `box-shadow`, `text-shadow` |
| 애니메이션 추가 | `transition`, `animation` |

**방법 3: MDN 검색 또는 AI에게 물어보기**

[MDN CSS 속성 참조](https://developer.mozilla.org/ko/docs/Web/CSS/Reference)에서 모든 속성의 상세한 설명을 볼 수 있습니다.

> "CSS에서 텍스트를 한 줄만 표시하고, 넘치는 부분을 말줄임표로 처리하는 방법은?"

**방법 4: 개발자 도구로 "배우기"**

마음에 드는 웹페이지 효과를 발견하면:
1. 오른쪽 클릭 → "검사"
2. 요소 선택, Styles 패널 확인
3. CSS 속성 직접 복사

#### 속성을 억지로 외울 필요는 없습니다

**실제 작업 흐름은 이렇습니다**:

1. "가운데 정렬"이 필요함을 앎 → "CSS 가운데 정렬" 검색
2. 코드 복사, 값 조정
3. 자주 사용하다 보면 자연스럽게 외워짐

**권장 학습 경로**:

1. **먼저 박스 모델 마스터**: `width`, `height`, `padding`, `margin`, `border`
2. **그다음 Flexbox 마스터**: `display: flex`, `justify-content`, `align-items`
3. **그리고 position 마스터**: `position`, `top/left`, `z-index`
4. **마지막으로 애니메이션 배우기**: `transition`, `transform`, `animation`

기타 속성은 필요할 때 찾아보고, 자주 사용하면 자연스럽게 기억됩니다.

---

## 4. JavaScript: 웹페이지의 두뇌

### 4.1 JavaScript 도입 동기

HTML + CSS만 있는 웹페이지는 마치 **상점 쇼윈도의 마네킹**과 같습니다:

- ✅ 보기에는 예쁨 (CSS)
- ✅ 구조가 명확함 (HTML)
- ❌ 하지만 말을 걸어도 대답하지 않음
- ❌ 버튼을 눌러도 아무 일도 일어나지 않음

**JavaScript**는 웹페이지를 "쇼윈도 마네킹"에서 "실제 사람"으로 바꿔줍니다:

- ✅ 버튼을 클릭하면 알림이 뜸
- ✅ 텍스트를 입력하면 실시간으로 형식 검사
- ✅ 페이지를 스크롤하면 더 많은 콘텐츠 로드
- ✅ 폼을 제출하면 "제출 중..." 표시

### 4.2 JavaScript 코드 구조 개요

**능력 1: 데이터 기억하기** (변수)

```javascript
let userName = '홍길동'
let isLoggedIn = true
let cartCount = 5
```

**능력 2: 반복 작업하기** (함수)

```javascript
function sayHello(name) {
  return '안녕하세요, ' + name + '님!'
}

console.log(sayHello('홍길동'))  // 출력: 안녕하세요, 홍길동님!
```

**능력 3: 이벤트 응답하기** (이벤트 리스너)

```javascript
button.addEventListener('click', function() {
  alert('버튼이 클릭되었습니다!')
})
```

**능력 4: 페이지 수정하기** (DOM 조작)

```javascript
document.getElementById('title').textContent = '새 제목'
document.getElementById('box').style.background = 'red'
```

### 4.3 JavaScript 코드 해독 방법

::: tip 🎯 초보자 필독: JS 코드 읽는 방법

**첫 번째 단계: 변수 찾기 — "무엇을 기억했나?"**

```javascript
const API_URL = 'https://api.example.com'  // 상수, 변하지 않음
let count = 0                                // 변수, 변할 수 있음
const user = { name: '홍길동', age: 25 }       // 객체, 여러 데이터
const items = ['사과', '바나나', '오렌지']        // 배열, 목록 데이터
```

**두 번째 단계: 함수 찾기 — "무엇을 할 수 있나?"**

```javascript
// 함수명으로 보통 용도를 추측할 수 있음
function handleClick() { }      // 클릭 처리
function fetchData() { }        // 데이터 가져오기
function validateForm() { }     // 폼 유효성 검사
```

**세 번째 단계: 이벤트 찾기 — "언제 실행되나?"**

```javascript
button.addEventListener('click', handleClick)     // 클릭할 때
input.addEventListener('input', validateForm)     // 입력할 때
window.addEventListener('scroll', loadMore)       // 스크롤할 때
```

**네 번째 단계: DOM 조작 찾기 — "무엇을 바꿨나?"**

```javascript
element.textContent = '새 내용'     // 텍스트 변경
element.classList.add('active')    // 스타일 클래스 추가
element.style.display = 'none'     // 요소 숨기기
parent.appendChild(child)          // 요소 추가
```
:::

### 4.4 DOM: JavaScript가 페이지를조작 접근법

브라우저는 HTML 코드를 읽은 후, 그것들을 단순한 문자열 덩어리로 취급하지 않고 메모리 안에 "트리"로 그려냅니다:

```
Document (문서)
    ↓
<html>
    ├─<head>
    │   └─<title>내 웹페이지</title>
    └─<body>
        ├─<h1>환영합니다</h1>
        └─<div class="card">
            ├─<img src="photo.jpg">
            └─<p>텍스트 한 줄</p>
```

이 트리를 **DOM 트리**라고 합니다. 모든 HTML 태그는 이 트리 위의 "노드"입니다.

**노드를 어떻게 찾을까?**

```javascript
// ID로 찾기 (가장 빠름, 유일함)
const element = document.getElementById('header')

// 선택자로 찾기 (가장 많이 사용)
const element = document.querySelector('.card h2')    // 첫 번째 찾기
const elements = document.querySelectorAll('button')  // 모두 찾기

// 관계로 찾기
element.parentNode           // 부모 노드 찾기
element.children             // 자식 노드 찾기
element.nextElementSibling   // 다음 형제 찾기
```

**성능 경고**: DOM 조작은 매우 **비용이 많이 듭니다**. DOM을 수정할 때마다 브라우저는 레이아웃을 다시 계산하고, 다시 그려야 합니다.

```javascript
// ❌ 비효율: 1000번 반복, 매번 DOM 조작
for (let i = 0; i < 1000; i++) {
  document.body.appendChild(createDiv())
}

// ✅ 효율: 먼저 조립하고, 한 번에 삽입
const fragment = document.createDocumentFragment()
for (let i = 0; i < 1000; i++) {
  fragment.appendChild(createDiv())
}
document.body.appendChild(fragment)
```

이것이 바로 **Vue / React** 같은 현대 프레임워크가 탄생한 이유입니다: 메모리 안에서 "가상 DOM"을 조작하며, 최소한의 수정량을 계산한 후에야 실제 DOM을 건드립니다.

👇 **직접 해보기**: DOM 조작의 기본 방법:

<DomManipulator />

### 4.5 ECMAScript: JavaScript의 버전 발전

**ECMAScript**는 JavaScript의 "표준 명세서"입니다. 브라우저 제조사는 이 표준에 따라 JavaScript 엔진을 구현합니다.

#### 왜 버전 번호 도입 동기
JavaScript는 고정된 언어가 아닙니다. 매년 새로운 기능이 추가되고 문제가 수정됩니다. 버전 번호는 "이 브라우저가 어떤 기능을 지원하는지" 알려줍니다.

#### 주요 버전 살펴보기

| 버전 | 연도 | 핵심 기능 | 해결한 문제 |
|------|------|----------|----------------|
| **ES5** | 2009 | 엄격 모드, `forEach`/`map`/`filter` | 언어 규범화, 배열 메서드 추가 |
| **ES6/ES2015** | 2015 | `let/const`, 화살표 함수, `class`, `Promise`, 모듈화 | 가장 큰 업데이트, 현대 JS의 시작점 |
| **ES2016** | 2016 | `includes()`, `**` 거듭제곱 연산 | 작은 업데이트 |
| **ES2017** | 2017 | `async/await`, `Object.entries()` | 비동기 코드 가독성 향상 |
| **ES2018** | 2018 | `...` 스프레드 연산자, `Promise.finally()` | 객체와 비동기 강화 |
| **ES2020** | 2020 | 옵셔널 체이닝 `?.`, 널 병합 `??`, `BigInt` | 중첩 속성 안전하게 접근 |
| **ES2021** | 2021 | `replaceAll()`, 논리 할당 `??=` | 문자열과 할당 강화 |
| **ES2022** | 2022 | 최상위 `await`, `.at()` 인덱싱 | 모듈 비동기 로딩 편의성 향상 |

#### ES6+ 가장 많이 사용하는 새 문법

**1. `let`과 `const`로 `var` 대체하기**

```javascript
// ❌ 옛날 방식: var는 호이스팅이 있어 버그 발생하기 쉬움
var name = '홍길동'
if (true) {
  var name = '김철수'  // 바깥의 name을 덮어씀
}
console.log(name)  // '김철수', 예상과 다른 결과

// ✅ 새 방식: let은 블록 스코프
let name = '홍길동'
if (true) {
  let name = '김철수'  // 이 if 안에서만 유효
}
console.log(name)  // '홍길동', 예상과 일치

// ✅ const: 선언 후 재할당 불가
const PI = 3.14159
PI = 3  // 오류 발생! 의도치 않은 수정 방지
```

**2. 화살표 함수: 더 간결한 함수 작성법**

```javascript
// ❌ 옛날 방식
const add = function(a, b) {
  return a + b
}

// ✅ 새 방식
const add = (a, b) => a + b

// 화살표 함수의 this는 외부 스코프에 바인딩됨
const obj = {
  name: '홍길동',
  // ❌ 일반 함수: this는 호출자를 가리킴
  oldWay: function() {
    setTimeout(function() {
      console.log(this.name)  // undefined
    }, 100)
  },
  // ✅ 화살표 함수: this는 obj에서 상속됨
  newWay: function() {
    setTimeout(() => {
      console.log(this.name)  // '홍길동'
    }, 100)
  }
}
```

**3. 구조 분해 할당: 객체/배열에서 데이터 추출**

```javascript
// 객체 구조 분해
const user = { name: '홍길동', age: 25, city: '서울' }
const { name, age } = user  // 직접 추출
console.log(name)  // '홍길동'

// 배열 구조 분해
const colors = ['red', 'green', 'blue']
const [first, second] = colors
console.log(first)  // 'red'

// 함수 매개변수 구조 분해
function greet({ name, age }) {
  console.log(`${name}님은 올해 ${age}세`)
}
greet(user)  // '홍길동님은 올해 25세'
```

**4. 템플릿 문자열: 문자열 연결이 더 이상 고통스럽지 않음**

```javascript
// ❌ 옛날 방식: 따옴표와 더하기 기호 투성이
const msg = '사용자 ' + name + '의 나이는 ' + age + '세'

// ✅ 새 방식: 백틱 + ${}
const msg = `사용자 ${name}의 나이는 ${age}세`

// 여러 줄도 지원
const html = `
  <div class="card">
    <h2>${name}</h2>
    <p>나이: ${age}</p>
  </div>
`
```

**5. `async/await`: 비동기 코드를 동기처럼 작성**

```javascript
// ❌ 콜백 지옥
fetchUser(function(user) {
  fetchOrders(user.id, function(orders) {
    fetchDetails(orders[0].id, function(details) {
      console.log(details)
    })
  })
})

// ✅ async/await
async function getUserData() {
  const user = await fetchUser()
  const orders = await fetchOrders(user.id)
  const details = await fetchDetails(orders[0].id)
  console.log(details)
}
```

**6. 옵셔널 체이닝 `?.`과 널 병합 `??`**

```javascript
const user = {
  name: '홍길동',
  address: {
    city: '서울'
  }
}

// ❌ 옛날 방식: 계층마다 확인
const street = user && user.address && user.address.street
const streetName = street !== undefined ? street : '알 수 없음'

// ✅ 새 방식: 옵셔널 체이닝 + 널 병합
const streetName = user?.address?.street ?? '알 수 없음'
```

::: tip 💡 브라우저가 어떤 기능을 지원하는지 어떻게 알 수 있을까?

1. **호환성 표 확인**: [caniuse.com](https://caniuse.com/)에서 기능명 입력
2. **빌드 도구 사용**: Babel이 새 문법을 구형 브라우저 지원 코드로 변환
3. **대상 사용자 확인**: 최신 브라우저만 지원한다면 대부분 ES6+ 기능을 바로 사용 가능
:::

### 4.6 TypeScript: JavaScript에 타입 제약 추가하기

#### TypeScript가필요 원인 분석

**상황 1: 함수 매개변수 타입이 불확실함**

```javascript
// JavaScript
function calculateTotal(price, quantity) {
  return price * quantity
}

calculateTotal(100, 5)      // 500 ✅
calculateTotal('100', 5)    // '1005' ❌ 문자열 연결, 곱셈이 아님
calculateTotal(100, '5')    // 500 ✅ 하지만 운이 좋았을 뿐
```

JavaScript는 런타임이 되어서야 매개변수 타입이 잘못되었다는 것을 알려줍니다.

**상황 2: 객체 속성 철자 오류**

```javascript
// JavaScript
const user = {
  name: '홍길동',
  age: 25
}

console.log(user.nmae)  // undefined, 철자 오류지만 오류가 발생하지 않음
```

**TypeScript가 이러한 문제를 해결합니다**:

```typescript
// TypeScript
interface User {
  name: string
  age: number
}

function greet(user: User) {
  console.log(`안녕하세요, ${user.name}`)
  console.log(user.nmae)  // ❌ 컴파일 시 오류: 'nmae' 속성이 존재하지 않음
}

greet({ name: '홍길동', age: 25 })        // ✅
greet({ name: '홍길동', age: '25' })      // ❌ 컴파일 시 오류: age는 number여야 함
greet({ name: '홍길동' })                 // ❌ 컴파일 시 오류: age가 누락됨
```

#### TypeScript의 핵심 개념

**1. 기본 타입**

```typescript
let name: string = '홍길동'
let age: number = 25
let isActive: boolean = true
let anyValue: any = '어떤 타입이든 가능'  // 권장하지 않음, 타입 검사의 의미를 잃음
```

**2. 인터페이스(Interface): 객체 구조 정의**

```typescript
interface Product {
  id: number
  name: string
  price: number
  discount?: number  // 선택적 속성
  readonly createdAt: Date  // 읽기 전용 속성
}

const product: Product = {
  id: 1,
  name: 'iPhone 15',
  price: 6999,
  createdAt: new Date()
}
```

**3. 타입 별칭(Type)**

```typescript
type ID = string | number  // 유니언 타입
type Status = 'pending' | 'approved' | 'rejected'  // 리터럴 타입

function updateStatus(id: ID, status: Status) {
  // ...
}

updateStatus(1, 'approved')      // ✅
updateStatus('abc', 'pending')   // ✅
updateStatus(1, 'processing')    // ❌ 'processing'은 유효한 Status가 아님
```

**4. 제네릭: 재사용 가능한 타입**

```typescript
// 제네릭 사용 안 함: 각 타입마다 함수 작성
function getFirstNumber(arr: number[]): number {
  return arr[0]
}
function getFirstString(arr: string[]): string {
  return arr[0]
}

// 제네릭 사용: 하나의 함수로 해결
function getFirst<T>(arr: T[]): T {
  return arr[0]
}

getFirst([1, 2, 3])        // number 반환
getFirst(['a', 'b', 'c'])  // string 반환
```

#### TypeScript vs JavaScript 비교

| 특성 | JavaScript | TypeScript |
|------|------------|------------|
| 타입 검사 | 런타임에 오류 발견 | 컴파일 시 오류 발견 |
| IDE 지원 | 기본 힌트 | 지능형 자동완성, 리팩터링, 정의로 이동 |
| 학습 곡선 | 쉬움 | 타입 시스템 학습 필요 |
| 적용 시나리오 | 작은 프로젝트, 프로토타입 | 대형 프로젝트, 팀 협업 |
| 실행 방식 | 브라우저에서 직접 실행 | JavaScript로 컴파일 필요 |

#### 실제 개발에서의 TypeScript

```typescript
// API 응답 타입 정의
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface User {
  id: number
  name: string
  email: string
}

// 타입이 있는 API 요청
async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// 사용 시 IDE가 모든 속성을 제안함
fetchUser(1).then(res => {
  console.log(res.data.name)   // ✅ IDE 자동 완성
  console.log(res.data.nmae)   // ❌ 컴파일 시 오류
})
```

::: tip 💡 초보자 조언

1. **먼저 JavaScript를 잘 배우세요**: TypeScript는 JS의 상위 집합입니다. JS를 모르면 TS를 배우는 것이 매우 고통스럽습니다
2. **작은 프로젝트는 억지로 TS를 도입하지 마세요**: 타입 정의가 코드량을 증가시키고, 간단한 프로젝트는 오히려 복잡해집니다
3. **JSDoc부터 시작해서 전환하세요**: JS 파일에 `/** @type {User} */` 주석을 작성하여 타입 힌트를 경험해 보세요
4. **`any`는 타협이지 해결책이 아닙니다**: 타입 문제를 만나면 먼저 해결을 시도하고, 바로 `any`를 쓰지 마세요
:::

### 4.7 현대 JavaScript 개발 도구 체인

::: tip 🎯 왜 도구 체인이 필요할까?

브라우저는 HTML/CSS/JS만 인식합니다. 하지만 현대 개발에서는 다음과 같은 것을 사용합니다:

- **TypeScript**: 브라우저가 인식하지 못함, JS로 컴파일 필요
- **SCSS/Less**: 브라우저가 인식하지 못함, CSS로 컴파일 필요
- **모듈화**: `import/export`를 하나의 파일로 번들링 필요
- **새 문법**: ES6+를 구형 브라우저 지원 코드로 트랜스파일 필요

도구 체인은 이러한 "개발 시 사용하는 코드"를 "브라우저가 실행할 수 있는 코드"로 변환하는 것입니다.
:::

**핵심 도구**:

| 도구 | 역할 | 비유 |
|------|------|------|
| **Node.js** | JavaScript 실행 환경 | JS가 브라우저를 벗어나 실행될 수 있게 함 |
| **npm/yarn/pnpm** | 패키지 관리자 | 다른 사람이 작성한 코드 라이브러리 다운로드 |
| **Vite/Webpack** | 빌드 도구 | 소스 코드를 브라우저가 실행할 수 있는 코드로 패키징 |
| **Babel** | 컴파일러 | 새 문법을 옛날 문법으로 변환 |
| **ESLint** | 코드 검사 | 코드 문제와 스타일 불일치 발견 |

**일반적인 개발 흐름**:

```bash
# 1. 프로젝트 초기화
npm create vite@latest my-app -- --template vue-ts

# 2. 의존성 설치
cd my-app
npm install

# 3. 개발 모드 (핫 리로드)
npm run dev

# 4. 프로덕션 빌드
npm run build
```

---

## 5. 세 가지의 협력 관계

### 5.1 역할 분담 비교

| 역할 | 담당하는 것 | 하지 않는 것 | 대표 예시 |
|------|----------|----------|----------|
| **HTML** | 구조와 의미 정의 | 스타일/상호작용 담당 안 함 | `<section><h1>제목</h1></section>` |
| **CSS** | 외관과 레이아웃 제어 | 로직/데이터 담당 안 함 | `.card { background: white; }` |
| **JavaScript** | 상호작용과 로직 처리 | 구조 정의 담당 안 함 | `button.onclick = () => alert()` |

### 5.2 완전한 협력 예시

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* CSS: 카드를 예쁘게 */
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      max-width: 300px;
    }
    .card button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <!-- HTML: 카드 구조 정의 -->
  <div class="card">
    <h2 id="title">버튼을 클릭하세요</h2>
    <button id="btn">클릭</button>
  </div>

  <script>
    // JavaScript: 버튼을 클릭할 수 있게
    const btn = document.getElementById('btn')
    const title = document.getElementById('title')

    btn.addEventListener('click', function() {
      title.textContent = '클릭됨!'
      alert('제목이 변경되었습니다')
    })
  </script>
</body>
</html>
```

---

## 6. 모르는 코드를 만나면 어떻게 할까 접근법

### 6.1 AI에게 물어보기

> "HTML에서 `<aside>` 태그는 무슨 뜻인가요? 언제 사용하나요?"
>
> "CSS에서 `position: sticky`는 어떤 효과인가요?"

### 6.2 MDN 검색하기

[MDN Web Docs](https://developer.mozilla.org/)는 가장 권위 있는 웹 기술 문서입니다. 모르는 태그, 속성, 메서드를 만나면 바로 검색하세요.

### 6.3 브라우저 개발자 도구

1. 페이지 요소 오른쪽 클릭 → "검사"
2. **Elements** 패널에서 HTML 구조 확인
3. **Styles** 패널에서 CSS 스타일 확인
4. **Console** 패널에서 JS 코드 실행 가능

### 6.4 주요 CSS 속성 빠른 참조

| 이걸 보면 | 무슨 역할인가 |
|----------|------------|
| `display: flex` | 플렉스 레이아웃 활성화 |
| `position: absolute` | 절대 위치 지정 |
| `z-index: 100` | 층위, 숫자가 클수록 위에 표시 |
| `overflow: hidden` | 넘치는 부분 숨기기 |
| `cursor: pointer` | 마우스 커서를 손 모양으로 |
| `transition: all 0.3s` | 애니메이션 전환 효과 |
| `box-sizing: border-box` | width가 padding과 border를 포함하도록 |

---

## 7. 용어 빠른 참조

| 용어 | 영문 | 쉬운 설명 |
|------|------|------------|
| **HTML** | HyperText Markup Language | 하이퍼텍스트 마크업 언어, 태그로 웹페이지 구조 설명 |
| **CSS** | Cascading Style Sheets | 캐스케이딩 스타일 시트, 색상, 레이아웃, 애니메이션 제어 |
| **JavaScript** | JavaScript | 웹페이지의 프로그래밍 언어, 상호작용과 로직 담당 |
| **DOM** | Document Object Model | 문서 객체 모델, 객체 트리로 페이지 표현 |
| **Flexbox** | Flexible Box Layout | 1차원 레이아웃 방식, 정렬과 분배가 쉬움 |
| **박스 모델** | CSS Box Model | 콘텐츠에서 바깥 여백까지의 겹겹이 상자 |
| **SCSS** | Sassy CSS | CSS 전처리기, 변수, 중첩, 믹스인 지원 |
| **TypeScript** | TypeScript | JavaScript의 상위 집합, 타입 시스템 추가 |
| **ES6** | ECMAScript 2015 | JavaScript의 중요한 버전, 많은 새 문법 추가 |
| **시맨틱** | Semantic HTML | div 대신 의미 있는 태그(예: header) 사용 |
| **반응형** | Responsive Design | 다양한 화면 크기에 자동으로 적응하는 디자인 |

---

## 정리

이제 여러분은 알게 되었습니다: **HTML은 뼈대를 정의하고, CSS는 외관을 담당하며, JavaScript는 영혼을 부여합니다**.

이 세 가지는 웹 개발의 기초입니다. 이것들을 이해하면 다음을 할 수 있습니다:

- 모든 웹페이지의 소스 코드 이해하기 (오른쪽 클릭 → "페이지 소스 보기")
- 다른 사람의 웹페이지 수정하기 (브라우저 DevTools → Elements)
- 프론트엔드 프레임워크(Vue/React) 학습 시작하기, 이들은 모두 이 세 가지를 기반으로 합니다

**다음 단계 권장**:

- 빠르게 웹페이지를 만들고 싶다면 **Vue** 또는 **React** 프레임워크를 배우세요
- CSS를 깊이 이해하고 싶다면 **Flexbox**와 **Grid** 레이아웃을 배우세요
- 코드 품질을 높이고 싶다면 **TypeScript**를 배우세요