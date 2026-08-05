# 라우팅과 내비게이션 원리
::: tip 🎯 핵심 질문
**왜 어떤 웹사이트는 페이지를 전환할 때 화면이 깜빡이지 않고 앱처럼 매끄럽게 동작할까요?** 이것이 바로 프론트엔드 라우팅의 마법입니다. 이 장에서는 전통적인 웹사이트의 "책 넘기기식 이동"에서 싱글 페이지 애플리케이션의 "슬라이드 전환" 세계로 들어가, 프론트엔드 라우팅이 어떻게 사용자 경험을 한 단계 끌어올리는지 이해하게 됩니다.
:::

---

## 1. 프론트엔드 라우팅 도입 동기
### 1.1 전통적인 웹사이트에서 싱글 페이지 애플리케이션으로: 사용자 경험의 질적 도약

초기 웹사이트 탐색 경험을 떠올려 보면, 링크를 클릭할 때마다 "완전한 페이지 넘김" 과정이 발생했습니다. 페이지가 하얗게 깜빡이고, 로딩 스피너가 돌고, 전체 페이지가 다시 렌더링되었습니다. 네트워크가 느리면 로딩 스피너를 몇 초 동안 멍하니 바라봐야 했죠. 이런 경험은 오늘날 기준으로는 구식이지만, 당시에는 이것이 표준 방식이었습니다.

현대 프론트엔드 개발은 이러한 패턴을 완전히 바꿔 놓았습니다. 우리는 프론트엔드 라우팅 기술을 사용해 페이지 전환이 모바일 앱처럼 매끄럽게 이루어지도록 합니다. 하얀 화면도, 로딩 스피너도 없고, 사용자는 "이동" 과정을 거의 느끼지 못합니다. 이러한 경험 향상은 마법이 아니라 프론트엔드 라우팅 시스템의 공로입니다.

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📖 전통적인 웹사이트 (MPA)**
- 링크 클릭 → 전체 페이지 새로고침
- 각 페이지는 독립적인 HTML 파일
- 브라우저가 모든 리소스를 다시 다운로드
- "책 넘기기" 같은 경험, 명확한 페이지 전환 과정

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📱 싱글 페이지 애플리케이션 (SPA)**
- 링크 클릭 → 새로고침 없는 전환
- 하나의 HTML 진입 파일만 존재
- 필요한 데이터만 다운로드
- "슬라이드 쇼" 같은 경험, 매끄럽고 자연스러움

</div>
</div>

**이것이 바로 "프론트엔드 라우팅"이 해결하려는 핵심 문제입니다: 페이지를 새로고침하지 않으면서도 뷰를 전환하고 URL을 동기화하는 것.**

<RouteMatchingDemo />

### 1.2 실제 발 담근 이야기:라우팅 모드를 이해 필요성
이렇게 말할 수도 있겠죠: "Vue Router나 React Router를 쓰면 설정만 하면 되는데, 왜 이런 저수준 원리를 알아야 하나요?" 실제 이야기를 하나 들려드리면, 이 지식이 왜 그렇게 중요한지 이해하게 될 것입니다.

::: warning 샤오리의 배포 실수기
샤오리는 프론트엔드 신입 개발자로, 입사하자마자 Vue 기반의 싱글 페이지 애플리케이션 개발을 맡았습니다. 로컬 개발 환경에서는 모든 것이 정상이었고, 라우팅 전환도 매끄러웠습니다. 그런데 프로젝트를 테스트 서버에 배포한 후 문제가 발생했습니다. 사용자가 특정 라우트(예: `example.com/user/123`)를 직접 방문하거나 상세 페이지에서 새로고침하면 **404 Not Found** 오류가 발생했습니다.

샤오리는 당황했습니다. 분명히 로컬에서는 정상적으로 접근이 되는데, 왜 배포 후에는 404가 뜰까? 그는 오랫동안 문제를 찾았고, 서버 설정 문제인지조차 의심했습니다.

나중에 선배에게 물어보니, 선배는 한눈에 문제를 알아봤습니다. 샤오리는 History 모드를 사용하고 있었지만, 서버에 fallback이 설정되어 있지 않았던 것입니다. 사용자가 `/user/123`에 직접 접근하면, 서버는 이 경로에 해당하는 파일을 찾으려 하지만, SPA의 모든 라우트는 사실 동일한 `index.html`을 가리킵니다. 해결책은 간단합니다: 서버에서 모든 라우트를 `index.html`로 폴백하도록 설정하여 프론트엔드 라우터가 후속 처리를 담당하게 하는 것입니다.

샤오리는 그때부터 한 가지 진리를 깨달았습니다: **라우팅 모드의 원리와 서버 설정 요구사항을 이해하지 못하면, 왜 오류가 발생하는지조차 알 수 없고, 문제 해결은 더더욱 불가능하다는 것을.**
:::

::: info 💡 핵심 교훈
프론트엔드 라우팅은 "블랙 매직"이 아닙니다. 그 작동 원리를 이해하면 배포, 성능, SEO 문제가 발생했을 때 빠르게 원인을 파악하고 정확하게 해결할 수 있습니다. 더 중요한 것은, 프로젝트 아키텍처 설계 시 더 현명한 선택을 할 수 있게 해줍니다 — 언제 Hash 모드를 써야 하는지, 언제 History 모드를 써야 하는지, 그리고 어떻게 흔한 함정을 피할 수 있는지 말이죠.
:::

---

## 2. 핵심 개념: 라우트, 모드, 내비게이션

구체적인 구현에 들어가기 전에, 먼저 몇 가지 핵심 개념을 명확히 해야 합니다. 더 잘 이해할 수 있도록, 도서관 비유를 통해 이들 간의 관계를 설명하겠습니다.

::: tip 🤔 이 개념들이 라우팅과 무슨 관계가 있나요?
라우트, 모드, 내비게이션은 프론트엔드 라우팅 시스템의 세 가지 기둥입니다.

Vue Router나 React Router를 사용할 때, 프레임워크는 다음을 처리합니다:
1. **라우트 매핑** → URL과 컴포넌트의 대응 관계 정의
2. **모드 선택** → Hash 모드와 History 모드 중 선택
3. **내비게이션 제어** → 페이지 이동, 브라우저 앞으로/뒤로 가기 처리

따라서, **이 세 가지 개념을 이해해야 라우팅 시스템이 실제로 무엇을 하는지, 왜 때때로 특별한 설정이 필요한지, 왜 배포 시 문제가 발생하는지 알 수 있습니다.**
:::

### 2.1 도서관 비유로 이해하는 라우팅 시스템

도서관에서 책을 찾는 과정을 상상해 보세요. 이 과정은 프론트엔드 라우팅의 작동 원리와 놀라울 정도로 유사합니다:

| 개념 | 📚 도서관 비유 | 실제 역할 | 구체적인 예시 |
|------|-------------|----------|----------|
| **라우트 (Route)** | 책장 번호와 책의 대응 관계 | URL과 페이지 컴포넌트의 매핑 관계 정의 | `/user/123` 경로는 `UserDetail.vue` 컴포넌트에 대응 |
| **라우터 (Router)** | 도서관 안내 시스템과 위치 찾기 서비스 | 모든 라우트를 관리하고 내비게이션 동작을 처리하는 핵심 모듈 | Vue Router, React Router가 바로 라우터 |
| **라우팅 모드** | 색인 방식 (카드 목록 vs 전자 시스템) | URL의 형태와 저수준 구현 방식을 결정 | Hash 모드는 `#` 사용, History 모드는 일반 경로 사용 |
| **내비게이션** | 한 책장에서 다른 책장으로 이동 | 서로 다른 페이지 간 전환 행위 | 링크 클릭, 프로그래밍 방식 이동, 브라우저 앞으로/뒤로 가기 |

::: tip 📊 이 표에서 무엇을 알 수 있나요?
각 행을 하나씩 해석해 보겠습니다:

**라우트**: 단순한 "설정"으로, "어떤 URL이 어떤 페이지에 대응하는지"를 시스템에 알려줍니다. 도서관의 책 번호가 책의 위치에 대응하는 것과 같습니다.

**라우터**: "관리자"로, 현재 URL에 따라 해당하는 컴포넌트를 찾아 렌더링합니다. 사서가 당신이 제공한 책 번호를 바탕으로 책을 찾아주는 것과 같습니다.

**라우팅 모드**: "구현 방식"으로, URL이 어떻게 생겼는지, 저수준에서 어떤 기술로 구현되는지를 결정합니다. 도서관이 종이 목록을 사용할 수도 있고, 전자 검색 시스템을 사용할 수도 있는 것과 같습니다.

**내비게이션**: "행위"로, 사용자가 페이지 전환을 트리거하는 동작입니다. 도서관에서 A 구역에서 B 구역으로 걸어가는 것과 같습니다.

이 네 가지의 차이를 이해하는 것이 매우 중요합니다: **라우트는 정적 설정, 라우터는 동적 관리자, 모드는 기술 선택, 내비게이션은 사용자 행위입니다.**
:::

### 2.2 라우트 (Route): URL과 컴포넌트의 매핑 계약

라우트는 본질적으로 하나의 "계약"으로, 특정 URL에 접근했을 때 어떤 내용을 표시할지 규정합니다. Vue Router에서 일반적인 라우트 설정은 다음과 같습니다:

```javascript
const routes = [
  {
    path: '/',           // URL 경로
    component: Home      // 대응하는 컴포넌트
  },
  {
    path: '/user/:id',   // 매개변수가 있는 동적 라우트
    component: UserDetail,
    children: [          // 중첩 라우트
      { path: 'profile', component: UserProfile },
      { path: 'posts', component: UserPosts }
    ]
  }
]
```

**의문이 들 수 있습니다: 왜 `<a>` 태그로 바로 이동하지 않고 라우팅을 사용해야 하나요?**

답은 "싱글 페이지 애플리케이션"의 본질에 있습니다: SPA는 하나의 HTML 페이지만 가지고 있으며, 모든 페이지 전환은 사실 동일한 페이지 내에서 컴포넌트를 교체하는 것입니다. 전통적인 `<a href="/user/123">`을 사용하면, 브라우저는 실제로 `/user/123` 경로를 요청하여 페이지 새로고침이나 404 오류가 발생합니다. 라우팅의 역할은 이러한 이동 동작을 가로채서 JavaScript로 컴포넌트를 동적으로 교체하여 새로고침 없는 전환을 실현하는 것입니다.

::: details 🔧 라우트 설정의 몇 가지 일반적인 패턴
**정적 라우트** (가장 간단함):
```javascript
{ path: '/home', component: Home }
{ path: '/about', component: About }
```

**동적 라우트** (매개변수 포함):
```javascript
{ path: '/user/:id', component: UserDetail }
// /user/123, /user/abc 등과 매칭 가능
// 컴포넌트 내에서 route.params.id로 매개변수 획득
```

**중첩 라우트** (부모-자식 관계):
```javascript
{
  path: '/user/:id',
  component: UserLayout,    // 부모 컴포넌트
  children: [
    { path: 'profile', component: UserProfile },   // 실제 경로 /user/:id/profile
    { path: 'posts', component: UserPosts }        // 실제 경로 /user/:id/posts
  ]
}
```

**와일드카드 라우트** (404 페이지):
```javascript
{ path: '/:pathMatch(.*)*', component: NotFound }
// 정의되지 않은 모든 라우트와 매칭
```
:::

### 2.3 라우팅 모드: Hash vs History의 본질적 차이

프론트엔드 라우팅에는 두 가지 주류 구현 모드가 있습니다: Hash 모드와 History 모드. 이들은 URL 표현 방식, 저수준 구현, 호환성 등에서 본질적인 차이가 있습니다.

::: tip 🤔 왜 두 가지 모드가 필요한가요?
이는 사실 역사적 이유와 기술적 트레이드오프의 결과입니다.

**Hash 모드**는 가장 초기의 프론트엔드 라우팅 구현 방식으로, URL의 hash 부분(즉 `#` 뒤의 내용)을 활용합니다. hash의 변화는 페이지 새로고침을 트리거하지 않으며, 호환성이 매우 뛰어납니다(IE8도 지원).

**History 모드**는 HTML5 등장 이후의 "표준 방식"으로, History API가 제공하는 `pushState`와 `replaceState` 메서드를 활용하여 URL을 더 "정상적으로"( `#` 없이) 만들 수 있지만, 서버 측의 협력 설정이 필요합니다.

비유하자면: Hash 모드는 "방 문에 포스트잇을 붙이는 것"(방 구조에 영향을 주지 않음)이고, History 모드는 "방 번호를 다시 매기는 것"(문패 시스템 업데이트 필요)입니다.
:::

| 특성 | Hash 모드 | History 모드 |
|------|-----------|--------------|
| **URL 예시** | `https://example.com/#/user/123` | `https://example.com/user/123` |
| **구현 원리** | `hashchange` 이벤트 감지 | History API 사용 (`pushState`, `replaceState`) |
| **서버 설정** | 불필요 (hash는 서버로 전송되지 않음) | **반드시 index.html로 폴백 설정 필요** |
| **브라우저 호환성** | IE8+ (거의 모든 브라우저) | IE10+ (현대 브라우저) |
| **SEO 친화도** | 낮음 (검색 엔진이 hash를 무시할 수 있음) | 좋음 (URL 구조가 명확함) |
| **사용자 경험** | URL에 `#`이 있어 "앵커 이동"처럼 보임 | URL이 깔끔하고 전통적인 웹사이트에 가까움 |
| **배포 난이도** | 낮음, 특별한 설정 불필요 | 높음, 올바른 서버 설정 필요 |

<HashVsHistoryDemo />

::: tip 📊 이 표에서 무엇을 알 수 있나요?
각 행을 하나씩 해석해 보겠습니다:

**URL 예시**: Hash 모드의 URL에는 뚜렷한 `#`이 있어 사용자가 이것이 "싱글 페이지 애플리케이션"임을 한눈에 알 수 있습니다. History 모드의 URL은 전통적인 웹사이트와 같아 더 "전문적"으로 보입니다.

**구현 원리**: Hash 모드는 `hashchange` 이벤트(hash 변경 시 트리거)를 감지합니다. History 모드는 HTML5의 History API를 사용하여 페이지가 이동한 것처럼 "가장"할 수 있지만 실제로는 새로고침되지 않습니다.

**서버 설정**: 이것이 가장 실수하기 쉬운 부분입니다! Hash 모드의 `#` 뒤의 내용은 서버로 전송되지 않으므로, 서버는 라우트의 존재를 알 필요가 없습니다. 하지만 History 모드의 전체 경로는 서버로 전송되므로, 서버가 올바르게 설정되지 않으면 404를 반환합니다.

**SEO 친화도**: 검색 엔진 크롤러는 일반적으로 JavaScript를 실행하지 않으므로, Hash 모드의 URL은 무시될 수 있습니다. History 모드의 URL 구조는 명확하여 더 쉽게 색인됩니다.

**배포 난이도**: Hash 모드는 "바로 사용 가능"하고, History 모드는 운영 지식(Nginx, Apache 등)이 필요합니다. 이것이 많은 개인 프로젝트가 기본적으로 Hash 모드를 사용하는 이유이기도 합니다.
:::

---

## 3. 진화의 길: 전통적인 웹사이트에서 현대적 라우팅까지

개념을 많이 설명했으니, 이제 실제 사례를 살펴보겠습니다. 어떤 이커머스 웹사이트가 어떻게 "전통적인 멀티 페이지"에서 "현대적인 싱글 페이지 애플리케이션 라우팅"으로 단계적으로 진화했는지 보여드리겠습니다. 이 사례를 통해 프론트엔드 라우팅이 어떤 문제를 해결했는지 더 직관적으로 이해할 수 있을 것입니다.

::: tip 📖 배경 지식: MPA, SPA, SSR이란?
사례를 시작하기 전에, 이 용어들을 간단히 소개합니다:

- **MPA (Multi-Page Application)**: **멀티 페이지 애플리케이션**, 전통적인 웹사이트 개발 방식. 각 페이지는 독립적인 HTML 파일이며, 페이지 이동 시 전체 페이지가 새로고침됩니다.
- **SPA (Single-Page Application)**: **싱글 페이지 애플리케이션**, 현대 프론트엔드의 주류 방식. 하나의 HTML 진입점만 있으며, 페이지 전환은 JavaScript로 컴포넌트를 동적으로 교체하여 새로고침 없이 이루어집니다.
- **SSR (Server-Side Rendering)**: **서버 사이드 렌더링**, 서버에서 완전한 HTML을 생성합니다. SPA와 MPA의 장점을 결합하여, 첫 화면 렌더링이 빠르고 SEO가 좋습니다.

**간단히 이해하기**: MPA는 "매번 페이지를 넘길 때마다 새로 그리는 것", SPA는 "같은 종이에 지우고 다시 그리는 것", SSR은 "미리 종이에 그려서 당신에게 주는 것"입니다.
:::

### 3.1 진화의 전체 그림

아래 표는 프론트엔드 애플리케이션의 네 가지 진화 단계를 보여줍니다. 라우팅 기술이 어떻게 단계적으로 발전해 왔는지 확인할 수 있습니다:

| 단계 | 애플리케이션 유형 | 라우팅 구현 | 핵심 특징 | 사용자 경험 |
|------|---------|---------|---------|---------|
| **1단계: 전통적 멀티 페이지** | MPA | 서버 사이드 라우팅 | 각 페이지는 독립적인 HTML 파일 | 매번 이동 시 새로고침 |
| **2단계: 초기 SPA** | SPA (Hash 모드) | Hash 라우팅 | URL에 `#` 포함, 호환성 좋음 | 새로고침 없음, 그러나 URL이 깔끔하지 않음 |
| **3단계: 현대 SPA** | SPA (History 모드) | History 라우팅 | URL이 깔끔함, 서버 설정 필요 | 매끄러움, URL이 전통적 웹사이트에 가까움 |
| **4단계: 하이브리드 렌더링** | SPA + SSR | 아이소모픽 라우팅 | 첫 화면은 서버 렌더링, 이후는 프론트엔드 라우팅 | 첫 화면 빠름, SEO 좋음, 경험 매끄러움 |

::: tip 📊 이 표에서 무엇을 알 수 있나요?
각 행을 하나씩 해석해 보겠습니다:

**1단계 → 2단계**: "새로고침 있음"에서 "새로고침 없음"으로, 이것은 질적 도약입니다. 사용자는 처음으로 "앱과 같은" 매끄러움을 경험했지만, URL에 `#`이 포함되어 다소 전문적이지 않아 보이는 대가가 따랐습니다.

**2단계 → 3단계**: "작동함"에서 "잘 작동함"으로. History 모드는 URL을 깔끔하게 만들어 전통적인 웹사이트에 더 가까워졌지만, 배포 복잡도가 증가하는 대가(서버 설정 필요)가 따랐습니다.

**3단계 → 4단계**: "경험 좋음"에서 "경험 좋음 + SEO 좋음"으로. SSR은 SPA의 SEO 문제를 해결했고, 첫 화면 렌더링 속도도 더 빨라졌지만, 구현 복잡도가 크게 증가했습니다.

**정리하자면**: 프론트엔드 라우팅의 진화는 단순히 "전환이 빨라졌다"가 아니라, **전체 애플리케이션 아키텍처의 업그레이드**입니다 — 서버 주도에서 프론트엔드 주도로, 그리고 다시 프론트엔드와 백엔드의 결합으로. 각 단계마다 사용자 경험, 개발 비용, SEO 등 여러 차원의 균형을 맞추고 있습니다.
:::

### 3.2 1단계: 전통적 멀티 페이지 애플리케이션 — 매번 새로고침

왜 "전통적 멀티 페이지 애플리케이션"이라고 부를까요? 이 단계에서는 각 페이지가 독립적인 HTML 파일이고, 페이지 이동 시 브라우저가 모든 리소스(HTML, CSS, JS)를 다시 다운로드하기 때문입니다. 이것은 가장 초기의 웹 개발 방식이며, 현재도 많은 전통적인 웹사이트가 이렇게 운영되고 있습니다.

이 단계에서 이커머스 웹사이트 "바이더다오"는 전형적인 MPA 아키텍처를 사용했습니다:

**개발 방식**:
- **라우팅 구현**: 서버 사이드 라우팅, 각 페이지는 서버의 HTML 파일에 대응
- **페이지 이동**: `<a href="/products/123">` 사용, 완전한 페이지 새로고침 트리거
- **상태 관리**: 매번 이동 시 이전 페이지 상태(스크롤 위치, 폼 내용 등)가 손실됨

**이 단계의 특징**:
- ✅ **장점**: 구현이 간단하고, 검색 엔진에 친화적(SEO 좋음), 브라우저 앞으로/뒤로 가기가 바로 사용 가능
- ❌ **단점**: 매번 이동 시 새로고침되어 사용자 경험이 나쁘고, 서버 부담이 큼(동일한 리소스를 반복 로드)

::: details 당시 프로젝트 구조와 접근 흐름 보기
**프로젝트 구조** (서버 사이드 렌더링의 전형적 구조):
```
server/
├── views/              # HTML 템플릿
│   ├── index.html      # 홈페이지 템플릿
│   ├── products.html   # 상품 목록 페이지 템플릿
│   └── product.html    # 상품 상세 페이지 템플릿
├── public/             # 정적 리소스
│   ├── css/
│   ├── js/
│   └── images/
└── server.js           # 서버 진입점
```

**페이지 이동 흐름**:
```
1. 사용자가 링크 클릭 <a href="/products/123">
       ↓
2. 브라우저가 서버로 GET 요청 전송
       ↓
3. 서버가 product.html을 렌더링하고 데이터 삽입
       ↓
4. 완전한 HTML 페이지 반환
       ↓
5. 브라우저가 HTML 파싱, CSS/JS 다운로드, 페이지 렌더링
       ↓
6. 사용자가 페이지 확인 (이 과정은 보통 1~3초 소요)
```

**사용자의 불편 사항**:
- 링크 클릭 후 페이지가 하얗게 되고 대기 시간이 김
- 매번 이동 시 동일한 CSS/JS 파일을 다시 다운로드
- 브라우저 앞으로/뒤로 가기 시 페이지가 다시 로드됨
- 복잡한 페이지 상태(필터 조건, 스크롤 위치 등)를 저장할 수 없음
:::

이런 개발 방식은 작은 웹사이트에서는 받아들일 수 있었지만, 웹사이트 규모가 커지고 사용자의 경험 기대치가 높아지면서 이러한 문제들은 사용자 유지율과 전환율에 심각한 영향을 미치기 시작했습니다.

### 3.3 2단계: 초기 싱글 페이지 애플리케이션 — Hash 라우팅의 시대

전통적 멀티 페이지 애플리케이션의 문제가 어느 정도 쌓이자, "바이더다오" 팀은 프론트엔드 라우팅을 도입하여 싱글 페이지 애플리케이션 아키텍처로 업그레이드하기로 결정했습니다. 이것은 중요한 전환점입니다 — "서버 주도"에서 "프론트엔드 주도"로 진입하는 것입니다.

하지만 이 단계에도 대가가 따랐습니다: URL에 `#`이 포함되어 전문적으로 보이지 않고, 검색 엔진 색인에도 문제가 있었습니다.

**개발 방식**:
- **라우팅 구현**: Hash 라우팅, URL의 `#` 부분 활용
- **페이지 이동**: JavaScript가 링크 클릭을 가로채고 동적으로 컴포넌트 교체
- **상태 관리**: 페이지 상태가 클라이언트 측에서 유지되어 다시 로드할 필요 없음

**이 단계의 특징**:
- ✅ **장점**: 새로고침 없는 전환, 사용자 경험이 매끄러움, 서버 부담 감소
- ❌ **단점**: URL에 `#` 포함, SEO에 불리, 첫 로딩이 비교적 느림

::: details Hash 라우팅 구현 방식 보기
**프로젝트 구조** (초기 SPA의 전형적 구조):
```
project/
├── index.html          # 유일한 HTML 진입 파일
├── css/
│   └── app.css         # 모든 스타일이 하나의 파일로 번들링
├── js/
│   ├── router.js       # 간단한 라우팅 구현
│   ├── views/          # 페이지 컴포넌트
│   │   ├── Home.js
│   │   ├── ProductList.js
│   │   └── ProductDetail.js
│   └── app.js          # 애플리케이션 진입점
└── server.js           # 간단한 정적 파일 서버
```

**Hash 라우팅 핵심 코드**:
```javascript
// router.js - 간소화된 Hash 라우팅 구현
class HashRouter {
  constructor(routes) {
    this.routes = routes
    this.currentPath = null

    // hash 변경 감지
    window.addEventListener('hashchange', () => {
      this.matchRoute()
    })

    // 초기화
    this.matchRoute()
  }

  matchRoute() {
    // 현재 hash 가져오기 (# 제거)
    const hash = window.location.hash.slice(1) || '/'
    const route = this.routes.find(r => r.path === hash)

    if (route) {
      this.render(route.component)
    } else {
      this.render(NotFoundComponent)
    }
  }

  render(component) {
    const app = document.getElementById('app')
    app.innerHTML = component.template()
    component.mount?.(app)
  }

  navigate(path) {
    window.location.hash = path
  }
}

// 사용
const router = new HashRouter([
  { path: '/', component: Home },
  { path: '/products', component: ProductList },
  { path: '/products/:id', component: ProductDetail }
])

// 내비게이션
router.navigate('/products/123')
```

**URL 형식**:
- 홈페이지: `https://example.com/#/`
- 상품 목록: `https://example.com/#/products`
- 상품 상세: `https://example.com/#/products/123`

**가져온 개선 사항**:
1. **사용자 경험 향상**: 페이지 전환이 새로고침 없이 매끄럽고 자연스러움
2. **서버 부담 감소**: HTML/CSS/JS를 한 번만 로드하고 이후에는 데이터만 요청
3. **상태 유지**: 스크롤 위치, 폼 내용 등의 상태를 페이지 전환 시 유지 가능
4. **오프라인 친화적**: Service Worker와 함께 사용하면 오프라인 접근 가능

**새로운 불편 사항**:
1. **URL이 깔끔하지 않음**: `#`이 URL을 "앵커 이동"처럼 보이게 하여 전문적이지 않음
2. **SEO 문제**: 검색 엔진 크롤러가 hash 뒤의 내용을 무시할 수 있어 페이지가 색인되지 않을 수 있음
3. **첫 로딩이 느림**: 모든 JavaScript를 한 번에 로드해야 하므로 첫 화면 시간이 비교적 김
:::

### 3.4 3단계: 현대 싱글 페이지 애플리케이션 — History 라우팅이 주류로

Hash 라우팅의 불편 사항(URL이 깔끔하지 않음, SEO가 나쁨)은 개발자들을 오랫동안 괴롭혔습니다. HTML5의 보급과 브라우저 호환성 향상에 따라, History 라우팅이 점차 주류가 되었습니다.

History 라우팅은 HTML5 History API를 활용하여 URL을 "정상적으로"( `#` 없이) 만들 수 있지만, 서버 측의 협력 설정이 필요합니다.

**개발 방식**:
- **라우팅 구현**: History 라우팅, `pushState`와 `replaceState` 사용
- **라우팅 라이브러리**: Vue Router, React Router 등 성숙한 라우팅 라이브러리
- **서버 설정**: 모든 라우트를 `index.html`로 폴백하도록 서버 설정 필요

**이 단계의 특징**:
- ✅ **장점**: URL이 깔끔함, SEO 친화적, 사용자 경험이 매끄러움
- ❌ **단점**: 배포에 특별한 설정 필요, 서버 측 협력 필수

::: details History 라우팅 구현과 배포 설정
**프로젝트 구조** (현대 SPA의 전형적 구조):
```
project/
├── public/
│   └── index.html          # 유일한 HTML 진입점
├── src/
│   ├── router/
│   │   └── index.js        # 라우팅 설정
│   ├── views/              # 페이지 컴포넌트
│   │   ├── Home.vue
│   │   ├── ProductList.vue
│   │   └── ProductDetail.vue
│   ├── App.vue
│   └── main.js
├── package.json
└── vite.config.js          # 빌드 설정
```

**Vue Router 설정 예시**:
```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),  // History 모드
  routes: [
    { path: '/', component: () => import('@/views/Home.vue') },
    { path: '/products', component: () => import('@/views/ProductList.vue') },
    { path: '/products/:id', component: () => import('@/views/ProductDetail.vue') },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFound.vue') }
  ]
})

export default router
```

**URL 형식**:
- 홈페이지: `https://example.com/`
- 상품 목록: `https://example.com/products`
- 상품 상세: `https://example.com/products/123`

**핵심: Nginx 설정** (배포 시 반드시 설정):
```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/app;
    index index.html;

    # 핵심 설정: 모든 라우트를 index.html로 지정
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**왜 이 설정이 필요한가?**

```
시나리오: 사용자가 https://example.com/products/123에 직접 접근

❌ 설정되지 않은 경우:
1. 브라우저가 서버에 /products/123 요청
2. Nginx가 파일 시스템에서 /products/123 검색
3. 파일을 찾을 수 없음, 404 반환

✅ try_files가 설정된 경우:
1. 브라우저가 서버에 /products/123 요청
2. Nginx가 파일 찾기 시도 → 존재하지 않음
3. /index.html로 폴백 (try_files 규칙에 따라)
4. 브라우저가 index.html 로드
5. Vue Router가 제어권을 넘겨받아 /products/123 파싱
6. ProductDetail 컴포넌트 렌더링
7. 페이지가 정상적으로 표시됨!
```

**Hash 모드와의 차이점 비교**:
| 비교 항목 | Hash 모드 | History 모드 |
|--------|----------|-------------|
| URL | `/#/products/123` | `/products/123` |
| 서버 설정 | 불필요 | **반드시 설정** |
| 직접 접근 | ✅ 정상 작동 | ❌ 서버 지원 필요 |
| SEO | ⚠️ 낮음 | ✅ 좋음 |
:::

### 3.5 4단계: 하이브리드 렌더링 — SPA + SSR의 궁극적 솔루션

History 라우팅이 성숙해진 후, 팀은 더 깊은 문제에 집중하기 시작했습니다: SPA의 매끄러운 경험을 유지하면서도 SEO와 첫 화면 로딩 속도 문제를 어떻게 해결할 것인가?

이 단계의 핵심은 "아이소모픽 렌더링"입니다 — 첫 화면은 서버에서 렌더링하고(SEO 좋음, 로딩 빠름), 이후의 상호작용은 프론트엔드 라우팅이 처리합니다(경험 매끄러움).

**개발 방식**:
- **프레임워크 선택**: Next.js (React), Nuxt.js (Vue)
- **렌더링 전략**: 서버 사이드 렌더링 + 클라이언트 하이드레이션(Hydration)
- **라우팅 모드**: History 모드 (서버에 이미 설정됨)

**이 단계의 특징**:
- ✅ **장점**: 첫 화면이 빠르고, SEO가 좋으며, 이후의 상호작용이 매끄러움
- ❌ **단점**: 구현 복잡도가 높고, 서버 실행 환경이 필요함

::: details 하이브리드 렌더링의 작동 원리
**페이지 로딩 흐름**:
```
1. 사용자가 /products/123 접근
       ↓
2. 서버가 요청 수신
       ↓
3. 서버에서 ProductDetail 컴포넌트 렌더링 → 완전한 HTML 생성
       ↓
4. HTML을 브라우저로 반환 (완전한 콘텐츠 포함)
       ↓
5. 브라우저가 콘텐츠를 빠르게 표시 (첫 화면 렌더링 빠름)
       ↓
6. JavaScript 로드, "하이드레이션(Hydration)" 실행
       ↓
7. 이후의 페이지 전환은 프론트엔드 라우팅이 담당 (새로고침 없음)
```

**전통적 SPA vs SSR의 첫 화면 비교**:

| 비교 항목 | 전통적 SPA | SSR |
|--------|---------|-----|
| 첫 화면 콘텐츠 | 흰 화면 → JS 로드 → 렌더링 | 즉시 콘텐츠 표시 |
| SEO | 크롤러가 콘텐츠를 보지 못할 수 있음 | 크롤러가 완전한 HTML을 볼 수 있음 |
| 첫 화면 시간 | 비교적 느림 (JS 로드 필요) | 비교적 빠름 (HTML에 이미 콘텐츠 포함) |
| 이후의 상호작용 | 매끄러움 (프론트엔드 라우팅) | 매끄러움 (프론트엔드 라우팅) |
:::

---

## 4. 원리 깊이 이해하기: 라우팅 작동 원리
실제 사례를 살펴보았으니, 이제 프론트엔드 라우팅의 작동 원리를 깊이 들여다보고 Hash와 History 두 모드가 정확히 무엇이 다른지 이해해 보겠습니다.

<RouterArchitectureDemo />

### 4.1 Hash 모드의 작동 원리

Hash 모드의 핵심은 URL의 `hash` 부분(즉 `#` 뒤의 내용)을 활용하는 것입니다. hash에는 두 가지 중요한 특성이 있습니다:

1. **hash의 변화는 페이지 새로고침을 트리거하지 않는다**
2. **hash의 변화는 브라우저 히스토리 스택에 기록된다**

이는 페이지를 새로고침하지 않고도 URL을 변경할 수 있으며, 동시에 브라우저의 앞으로/뒤로 가기 버튼도 정상적으로 작동한다는 것을 의미합니다.

**작업 흐름**:

```
사용자가 링크 클릭 <a href="#/user/123">
       ↓
브라우저가 URL 업데이트 (페이지 새로고침 안 함)
https://example.com/#/user/123
       ↓
hashchange 이벤트 트리거
       ↓
라우팅 리스너가 이벤트 캡처
       ↓
hash 값 파싱 → /user/123
       ↓
라우트 설정과 매칭 → UserDetail 컴포넌트 찾음
       ↓
컴포넌트를 페이지에 렌더링
```

**핵심 코드 구현**:

```javascript
class HashRouter {
  constructor(routes) {
    this.routes = routes

    // hash 변경 감지
    window.addEventListener('hashchange', () => {
      this.loadRoute()
    })

    // 초기 로드
    this.loadRoute()
  }

  loadRoute() {
    // 현재 hash 가져오기, 앞의 # 제거
    const hash = window.location.hash.slice(1) || '/'
    const route = this.matchRoute(hash)

    if (route) {
      this.render(route.component)
    }
  }

  matchRoute(path) {
    return this.routes.find(r => r.path === path)
  }

  render(component) {
    document.getElementById('app').innerHTML = component.template()
  }

  push(path) {
    window.location.hash = path
  }
}
```

::: tip 💡 Hash 모드의 장점
- **호환성 좋음**: IE8+ 모두 지원, 거의 모든 브라우저에서 사용 가능
- **배포 간단**: 서버 설정 불필요, 바로 사용 가능
- **구현 간단**: `hashchange` 이벤트만 감지하면 됨
:::

### 4.2 History 모드의 작동 원리

History 모드는 HTML5 History API를 활용하여 `pushState`, `replaceState` 등의 메서드를 제공하며, 페이지를 새로고침하지 않고 URL을 변경할 수 있습니다.

**핵심 API**:

```javascript
// 새로운 히스토리 레코드 추가
history.pushState(state, title, url)
// 예시: history.pushState({id: 123}, '사용자 상세', '/user/123')

// 현재 히스토리 레코드 교체
history.replaceState(state, title, url)

// 히스토리 레코드 변경 감지 (앞으로/뒤로 가기 버튼)
window.addEventListener('popstate', (event) => {
  // event.state는 pushState 시 전달된 state를 포함
})
```

**작업 흐름**:

```
사용자가 링크 클릭 <a href="/user/123">
       ↓
JavaScript가 클릭 이벤트 가로채기
event.preventDefault()
       ↓
history.pushState 호출
history.pushState({id: 123}, '사용자 상세', '/user/123')
       ↓
URL 업데이트 (페이지 새로고침 안 함)
https://example.com/user/123
       ↓
라우트 매칭 및 컴포넌트 렌더링
       ↓
사용자가 브라우저 뒤로 가기 버튼 클릭
       ↓
popstate 이벤트 트리거
       ↓
라우팅 리스너가 이벤트 캡처
       ↓
새 URL에 따라 해당 컴포넌트 렌더링
```

**핵심 코드 구현**:

```javascript
class HistoryRouter {
  constructor(routes) {
    this.routes = routes

    // 모든 링크 클릭 가로채기
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a')
      if (link && link.getAttribute('href').startsWith('/')) {
        e.preventDefault()
        this.push(link.getAttribute('href'))
      }
    })

    // 브라우저 앞으로/뒤로 가기 감지
    window.addEventListener('popstate', () => {
      this.loadRoute()
    })

    // 초기 로드
    this.loadRoute()
  }

  loadRoute() {
    const path = window.location.pathname
    const route = this.matchRoute(path)

    if (route) {
      this.render(route.component)
    }
  }

  push(path) {
    history.pushState({}, '', path)
    this.loadRoute()
  }

  render(component) {
    document.getElementById('app').innerHTML = component.template()
  }
}
```

::: warning ⚠️ History 모드의 함정
History 모드의 가장 큰 문제는: **사용자가 특정 URL에 직접 접근하거나 페이지를 새로고침할 때, 브라우저가 서버로 요청을 보낸다는 것입니다**.

서버가 올바르게 설정되지 않으면 404를 반환합니다. 해결책은 서버에서 모든 라우트를 `index.html`로 폴백하도록 설정하여 프론트엔드 라우터가 후속 처리를 담당하게 하는 것입니다.
:::

---

## 5. 라우팅 설정 실전 가이드

이론은 충분히 설명했으니, 이제 실제 프로젝트에서 자주 사용되는 라우팅 설정 패턴과 모범 사례를 살펴보겠습니다.

### 5.1 기본 라우팅 설정

::: details Vue Router 완전한 설정 예시

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/user/:id',
      name: 'UserDetail',
      component: () => import('@/views/UserDetail.vue'),
      props: true  // 라우트 매개변수를 props로 전달
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // 스크롤 동작: 돌아갈 때는 스크롤 위치 유지, 그 외에는 맨 위로 스크롤
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
```

:::

### 5.2 라우트 지연 로딩: 첫 화면 성능 향상

라우트 지연 로딩은 특정 라우트에 접근할 때만 해당 컴포넌트를 로드하고, 모든 컴포넌트를 한 번에 로드하지 않는 것을 말합니다. 이는 첫 화면 로딩 시간을 크게 줄일 수 있습니다.

```javascript
// ❌ 모든 컴포넌트를 한 번에 로드 (첫 화면이 느림)
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import User from '@/views/User.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/user', component: User }
]

// ✅ 지연 로딩 (첫 화면이 빠름)
const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  { path: '/about', component: () => import('@/views/About.vue') },
  { path: '/user', component: () => import('@/views/User.vue') }
]
```

<CodeSplittingDemo />

::: tip 💡 지연 로딩의 원리
`import('@/views/Home.vue')`를 사용하면, Webpack/Vite는 이 컴포넌트를 별도의 파일로 패키징합니다. 사용자가 이 라우트에 접근할 때만 해당 파일을 다운로드합니다.

비유하자면: 지연 로딩은 "필요할 때마다 요리하기"와 같으며, 모든 요리를 한 번에 내오는 것이 아닙니다. 이렇게 하면 첫 화면 로딩 시간을 줄이고 사용자 경험을 향상시킬 수 있습니다.
:::

### 5.3 라우트 가드: 권한 제어와 내비게이션 차단

라우트 가드는 라우트 이동 전후에 로직을 실행할 수 있으며, 권한 검증, 페이지 제목 설정, 데이터 사전 로딩 등의 시나리오에서 자주 사용됩니다.

```javascript
// 글로벌 사전 가드
router.beforeEach(async (to, from, next) => {
  // 페이지 제목 설정
  document.title = to.meta.title || 'My App'

  // 권한 검증
  if (to.meta.requiresAuth) {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      next('/login')
      return
    }
  }

  next()
})

// 글로벌 사후 훅
router.afterEach((to, from) => {
  // 페이지 방문 통계
  analytics.trackPageView(to.path)
})

// 라우트 레벨 가드
const routes = [
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true, roles: ['admin'] },
    beforeEnter: (to, from, next) => {
      // 이 라우트 전용 로직
      if (hasPermission()) {
        next()
      } else {
        next('/403')
      }
    }
  }
]
```

::: tip 💡 라우트 가드의 일반적인 용도
- **권한 검증**: 사용자가 특정 페이지에 접근할 권한이 있는지 확인
- **페이지 제목**: document.title 동적 설정
- **데이터 사전 로딩**: 페이지 진입 전에 미리 데이터 가져오기
- **진행 표시줄**: 페이지 전환 진행 표시줄 표시
- **방문 통계**: 페이지 방문 상황 기록
:::

---

## 6. 자주 묻는 문제와 해결책

### 6.1 배포 후 새로고침 시 404

**문제**: 로컬 개발에서는 정상인데, 서버에 배포한 후 특정 라우트에 직접 접근하거나 페이지를 새로고침하면 404가 표시됩니다.

**원인**: History 모드에서 서버는 URL을 파일 경로로 간주하여 찾으려 하지만, SPA의 모든 라우트는 사실 `index.html`을 가리킵니다.

**해결책**: 서버 폴백 설정.

```nginx
# Nginx 설정
location / {
    try_files $uri $uri/ /index.html;
}
```

```apache
# Apache 설정 (.htaccess)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 6.2 라우트 매개변수 손실

**문제**: 페이지 새로고침 후 라우트 매개변수 `$route.params`가 손실됩니다.

**원인**: 라우트 매개변수는 라우트 이동 시에만 존재하며, 새로고침 후에는 URL에서 다시 파싱해야 합니다.

**해결책**:

```javascript
// ❌ 잘못된 방법: created 시에만 매개변수 가져오기
created() {
  const userId = this.$route.params.id
  this.fetchUser(userId)
}

// ✅ 올바른 방법: 라우트 변화 감지
watch: {
  '$route.params.id': {
    immediate: true,
    handler(newId) {
      this.fetchUser(newId)
    }
  }
}
```

### 6.3 페이지 전환 시 스크롤 위치 이상

**문제**: 페이지 전환 후 스크롤 위치가 초기화되지 않거나, 돌아갈 때 이전 위치가 유지되지 않습니다.

**해결책**: 라우트의 `scrollBehavior` 설정.

```javascript
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // 돌아갈 때 스크롤 위치 유지
    if (savedPosition) {
      return savedPosition
    }
    // 앵커로 이동
    if (to.hash) {
      return { el: to.hash }
    }
    // 그 외에는 맨 위로 스크롤
    return { top: 0 }
  }
})
```

---

## 7. 정리

프론트엔드 라우팅의 핵심 개념을 표로 정리해 보겠습니다:

| 개념 | 한 줄 설명 | 해결하는 문제 | 대표 솔루션 |
|------|-----------|-----------|----------|
| **라우트** | URL과 컴포넌트의 매핑 관계 | 다른 URL 접근 시 다른 콘텐츠 표시 | Vue Router, React Router |
| **Hash 모드** | URL hash를 활용한 라우팅 구현 | 호환성 좋음, 배포 간단 | Vue Router Hash 모드 |
| **History 모드** | History API를 활용한 라우팅 구현 | URL이 깔끔함, SEO 좋음 | Vue Router History 모드 |
| **라우트 지연 로딩** | 필요할 때 라우트 컴포넌트 로드 | 첫 화면 로딩 시간 단축 | `() => import('./Page.vue')` |
| **라우트 가드** | 라우트 이동 전후의 훅 함수 | 권한 제어, 데이터 사전 로딩 | `beforeEach`, `beforeEnter` |
| **동적 라우트** | 매개변수가 있는 라우트 | 단일 경로가 아닌 유형별 경로 매칭 | `/user/:id` |

::: info 마지막으로
프론트엔드 라우팅은 현대 싱글 페이지 애플리케이션의 핵심 기술 중 하나입니다. 초기 Hash 모드부터 현재 주류인 History 모드까지, 라우팅 기술은 계속 진화하며 사용자에게 더 매끄러운 탐색 경험을 제공하고 있습니다.

라우팅의 원리와 모드를 이해하면, 배포, 성능, SEO 문제가 발생했을 때 빠르게 원인을 파악하고 정확하게 해결할 수 있습니다. 더 중요한 것은, 프로젝트 아키텍처 설계 시 더 현명한 선택을 할 수 있게 해줍니다 — 언제 Hash를 써야 하는지, 언제 History를 써야 하는지, 그리고 어떻게 흔한 함정을 피할 수 있는지 말이죠.

이 글이 프론트엔드 라우팅에 대한 전체적인 이해를 구축하는 데 도움이 되길 바랍니다. 실제 프로젝트에서 라우팅 관련 문제를 만났을 때, 어디서부터 시작해야 하는지, 어떻게 원인을 파악하고 해결해야 하는지 알 수 있기를 바랍니다.
:::