# 프론트엔드 프로젝트 구조 원리

::: tip 🎯 핵심 문제
**단순한 HTML 페이지부터 복잡한 엔터프라이즈 애플리케이션까지, 프로젝트 규모에 맞는 아키텍처를 어떻게 선택할까요?** 이는 마치 원룸부터 대형 쇼핑몰까지, 요구사항에 따라 다른 공간 레이아웃을 설계하는 것과 같습니다. 좋은 아키텍처는 프로젝트가 성장함에 따라 발전해야 하며, 처음부터 과도하게 설계해서는 안 됩니다.
:::

---

## 1. 아키텍처 진화: 단순함에서 복잡함으로

### 1.1 세 가지 복잡도 수준 개요

프론트엔드 프로젝트의 아키텍처는 프로젝트 복잡도와 일치해야 합니다. **기술 복잡도**와 **사용자 규모** 두 가지 차원으로 프로젝트를 세 가지 수준으로 분류합니다:

| 수준 | 기술 스택 | 사용자 규모 | 전형적 시나리오 | 핵심 관심사 |
|------|-----------|-------------|----------------|-------------|
| **입문급** | HTML/CSS/JS | 개인/소규모 팀 | 개인 블로그, 홍보 페이지, 간단한 도구 | 빠른 출시, 간단한 유지보수 |
| **중급** | Vue/React + 빌드 도구 | 중소기업 | 관리 시스템, 이커머스 프론트, SaaS | 컴포넌트 재사용, 상태 관리 |
| **엔터프라이즈급** | 프레임워크 + 마이크로 프론트엔드/SSR | 대형 애플리케이션 | 대형 플랫폼, 복잡한 비즈니스 시스템 | 성능 최적화, 팀 협업, 확장성 |

::: tip 💡 어떻게 선택할까요?
**과도한 설계를 피하세요!** 많은 프로젝트가 단순한 HTML로 시작하여, 요구사항이 증가함에 따라 점진적으로 프레임워크와 도구를 도입합니다.

- 개인 프로젝트 → 입문급
- 스타트업 MVP → 입문급 또는 중급
- 기업 관리 시스템 → 중급
- 대형 인터넷 플랫폼 → 엔터프라이즈급
:::

---

## 2. 입문급: HTML/CSS/JS 프로젝트

### 2.1 적용 시나리오

- 개인 블로그, 이력서 페이지
- 제품 홍보 페이지 (Landing Page)
- 간단한 도구 페이지 (계산기, 변환기 등)
- 프로토타입 검증, 빠른 데모

### 2.2 추천 디렉토리 구조

```
my-simple-project/
├── index.html              # 홈페이지
├── about.html              # 소개 페이지 (필요한 경우)
├── css/
│   ├── reset.css           # 스타일 초기화
│   ├── variables.css       # CSS 변수 (색상, 폰트 등)
│   ├── components.css      # 컴포넌트 스타일 (버튼, 카드 등)
│   └── main.css            # 메인 스타일 파일
├── js/
│   ├── utils.js            # 유틸리티 함수
│   ├── api.js              # 간단한 API 호출
│   └── main.js             # 메인 로직
├── assets/
│   ├── images/             # 이미지 리소스
│   └── fonts/              # 폰트 파일
└── README.md               # 프로젝트 설명
```

### 2.3 코드 구성 원칙

**HTML**: 시맨틱 태그, 명확한 구조

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>내 개인 블로그</title>
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <header class="site-header">
    <nav class="main-nav">
      <a href="index.html">홈</a>
      <a href="about.html">소개</a>
    </nav>
  </header>

  <main class="content">
    <article class="blog-post">
      <h1>글 제목</h1>
      <p>글 내용...</p>
    </article>
  </main>

  <footer class="site-footer">
    <p>&copy; 2024 내 블로그</p>
  </footer>

  <script src="js/utils.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

**CSS**: CSS 변수로 테마 관리

```css
/* variables.css */
:root {
  --primary-color: #3498db;
  --text-color: #333;
  --bg-color: #fff;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --font-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* components.css - 재사용 가능한 컴포넌트 스타일 */
.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: 4px;
  background: var(--primary-color);
  color: white;
  cursor: pointer;
}

.card {
  padding: var(--spacing-md);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

**JavaScript**: 모듈화된 구성 (ES6 모듈 또는 간단한 분할 사용)

```javascript
// utils.js
const utils = {
  // DOM 조작 단순화
  $(selector) {
    return document.querySelector(selector);
  },

  // 간단한 디바운스
  debounce(fn, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  // 로컬 스토리지 래핑
  storage: {
    get(key) {
      return JSON.parse(localStorage.getItem(key) || 'null');
    },
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
};

// main.js
document.addEventListener('DOMContentLoaded', () => {
  // 페이지 초기화 로직
  initNavigation();
  loadBlogPosts();
});
```

### 2.4 모범 사례

✅ **해야 할 것**:
- 시맨틱 HTML 태그 사용
- CSS 변수로 색상과 간격 관리
- 이미지 압축 및 지연 로딩
- 기본적인 SEO 메타 태그 추가

❌ **피해야 할 것**:
- 인라인 스타일 (`style="..."`)
- 전역 변수 오염
- 중복 코드 (복사 붙여넣기)

---

## 3. 중급: Vue/React 프레임워크 프로젝트

### 3.1 적용 시나리오

- 기업 관리 시스템 (ERP, CRM, OA)
- 이커머스 프론트/백오피스
- SaaS 애플리케이션
- 복잡한 인터랙션이 필요한 웹 애플리케이션

### 3.2 Vue 프로젝트 추천 구조

```
my-vue-project/
├── public/                     # 정적 리소스
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/                 # 스타일, 이미지, 폰트
│   │   ├── styles/
│   │   │   ├── variables.scss
│   │   │   ├── mixins.scss
│   │   │   └── global.scss
│   │   └── images/
│   ├── components/             # 공통 컴포넌트
│   │   ├── common/             # 전역 공통 (Button, Modal 등)
│   │   │   ├── Button/
│   │   │   │   ├── index.vue
│   │   │   │   └── Button.scss
│   │   │   └── Modal/
│   │   └── business/           # 비즈니스 컴포넌트 (UserCard 등)
│   ├── views/                  # 페이지 컴포넌트
│   │   ├── Home/
│   │   ├── User/
│   │   │   ├── List.vue
│   │   │   └── Detail.vue
│   │   └── Product/
│   ├── router/                 # 라우터 설정
│   │   └── index.js
│   ├── stores/                 # Pinia/Vuex 상태 관리
│   │   ├── user.js
│   │   └── app.js
│   ├── services/               # API 서비스
│   │   ├── request.js          # axios 래핑
│   │   ├── user.js
│   │   └── product.js
│   ├── utils/                  # 유틸리티 함수
│   │   ├── format.js
│   │   ├── validate.js
│   │   └── storage.js
│   ├── composables/            # 컴포저블 함수
│   │   ├── useAuth.js
│   │   └── useLoading.js
│   ├── constants/              # 상수 정의
│   │   └── index.js
│   ├── App.vue
│   └── main.js
├── tests/                      # 테스트 파일
├── .env                        # 환경 변수
├── vite.config.js
├── package.json
└── README.md
```

### 3.3 React 프로젝트 추천 구조

```
my-react-project/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/             # 공통 컴포넌트
│   │   │   ├── Button/
│   │   │   │   ├── index.jsx
│   │   │   │   └── Button.module.css
│   │   │   └── Modal/
│   │   └── business/           # 비즈니스 컴포넌트
│   ├── pages/                  # 페이지 컴포넌트
│   │   ├── Home/
│   │   ├── User/
│   │   └── Product/
│   ├── hooks/                  # 커스텀 Hooks
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   ├── services/               # API 서비스
│   │   ├── api.js
│   │   └── userService.js
│   ├── store/                  # Redux/Zustand 상태 관리
│   │   ├── slices/
│   │   └── index.js
│   ├── utils/
│   ├── constants/
│   ├── App.jsx
│   └── main.jsx
├── tests/
└── package.json
```

### 3.4 핵심 개념 상세 설명

#### 컴포넌트 설계 원칙

**단일 책임**: 하나의 컴포넌트는 한 가지 일만 한다

```vue
<!-- ❌ 나쁜 예: 컴포넌트가 너무 많은 일을 함 -->
<template>
  <div>
    <form @submit="handleSubmit">
      <!-- 폼 내용 -->
    </form>
    <table>
      <!-- 데이터 테이블 -->
    </table>
    <div class="charts">
      <!-- 통계 차트 -->
    </div>
  </div>
</template>

<!-- ✅ 좋은 예: 독립적인 컴포넌트로 분리 -->
<template>
  <div>
    <UserForm @submit="fetchData" />
    <UserTable :data="users" />
    <UserStats :data="users" />
  </div>
</template>
```

#### 상태 관리 전략

| 상태 유형 | 저장 위치 | 예시 |
|-----------|-----------|------|
| **전역 상태** | Pinia/Redux | 사용자 정보, 로그인 상태, 테마 설정 |
| **페이지 상태** | 페이지 컴포넌트 | 목록 조회 조건, 페이지네이션 정보 |
| **컴포넌트 상태** | 컴포넌트 내부 | 폼 입력, 모달 표시/숨김 |
| **서버 상태** | TanStack Query/SWR | 서버 데이터, 캐시 |

#### 디렉토리 구성 방식 선택

**방식 1: 유형별 구성 (소규모 프로젝트에 적합)**

```
src/
├── components/     # 모든 컴포넌트
├── views/          # 모든 페이지
├── stores/         # 모든 상태
└── services/       # 모든 서비스
```

**방식 2: 기능별 구성 (중대규모 프로젝트에 적합)**

```
src/
├── features/
│   ├── auth/       # 인증 기능의 모든 코드
│   ├── user/       # 사용자 기능의 모든 코드
│   └── product/    # 상품 기능의 모든 코드
├── shared/         # 공유 리소스
└── App.vue
```

::: tip 💡 어떻게 선택할까요?
- 프로젝트 페이지 < 10개 → 유형별 구성
- 프로젝트 페이지 > 20개 → 기능별 구성
- 팀원 > 5명 → 기능별 구성, 병렬 개발에 용이
:::

---

## 4. 엔터프라이즈급: 대형 애플리케이션 아키텍처

### 4.1 적용 시나리오

- 대형 인터넷 플랫폼 (이커머스, 소셜, 콘텐츠 플랫폼)
- 복잡한 엔터프라이즈 애플리케이션
- 다중 팀 협업이 필요한 프로젝트
- 성능과 유지보수성 요구사항이 매우 높은 프로젝트

### 4.2 마이크로 프론트엔드 아키텍처

프로젝트 규모가 일정 수준 이상 커져 단일 코드베이스로 유지보수가 어려워지면 **마이크로 프론트엔드** 아키텍처를 고려할 수 있습니다.

```
대형 이커머스 플랫폼/
├── 베이스 애플리케이션 (메인 프레임)
│   ├── 상단 네비게이션
│   ├── 사이드 메뉴
│   ├── 사용자 센터 진입점
│   └── 서브 애플리케이션 컨테이너
├── 상품 서브 애플리케이션 (독립 배포)
│   ├── 상품 목록
│   ├── 상품 상세
│   └── 상품 관리
├── 주문 서브 애플리케이션 (독립 배포)
│   ├── 장바구니
│   ├── 주문 목록
│   └── 결제 프로세스
├── 사용자 서브 애플리케이션 (독립 배포)
│   ├── 개인 센터
│   ├── 배송지
│   └── 쿠폰
└── 마케팅 서브 애플리케이션 (독립 배포)
    ├── 이벤트 페이지
    ├── 쿠폰 발급
    └── 포인트 몰
```

**마이크로 프론트엔드의 장점**:
- 팀 자율성: 각 서브 애플리케이션이 독립적으로 개발, 배포
- 기술 스택 독립: 다른 팀이 다른 프레임워크를 사용할 수 있음
- 점진적 업그레이드: 기존 시스템을 점진적으로 리팩토링 가능

### 4.3 엔터프라이즈급 디렉토리 구조

```
enterprise-project/
├── apps/                       # 마이크로 프론트엔드 서브 애플리케이션
│   ├── main/                   # 베이스 애플리케이션
│   ├── product/
│   ├── order/
│   └── user/
├── packages/                   # 공유 패키지 (Monorepo)
│   ├── ui-components/          # 공통 컴포넌트 라이브러리
│   ├── utils/                  # 유틸리티 함수
│   ├── constants/              # 상수 정의
│   └── types/                  # TypeScript 타입
├── shared/                     # 공유 설정
│   ├── eslint-config/
│   ├── ts-config/
│   └── vite-config/
├── docs/                       # 프로젝트 문서
├── scripts/                    # 빌드 스크립트
└── package.json
```

### 4.4 성능 최적화 아키텍처

대형 애플리케이션은 성능 최적화에 주의를 기울여야 합니다:

```
성능 최적화 전략/
├── 빌드 타임 최적화
│   ├── 코드 분할 (Code Splitting)
│   ├── 라우트 지연 로딩
│   ├── Tree Shaking
│   └── 리소스 압축
├── 런타임 최적화
│   ├── 가상 스크롤 (긴 목록)
│   ├── 이미지 지연 로딩
│   ├── 컴포넌트 필요시 렌더링
│   └── 캐시 전략
└── 네트워크 최적화
    ├── CDN 가속
    ├── HTTP 캐시
    ├── 리소스 사전 로딩
    └── Service Worker
```

### 4.5 SSR/SSG 아키텍처

SEO 또는 첫 화면 성능이 필요한 시나리오:

| 방안 | 적용 시나리오 | 대표 프레임워크 |
|------|-------------|----------------|
| **SSR** | SEO 필요, 첫 화면 렌더링 빠름 | Next.js, Nuxt.js |
| **SSG** | 콘텐츠가 정적, 업데이트가 잦지 않음 | Astro, VitePress |
| **하이브리드** | 일부 정적, 일부 동적 | Next.js (ISR) |

---

## 5. 사용자 규모별 아키텍처 선택

### 5.1 개인/소규모 팀 (일일 활성 사용자 < 1,000)

**특징**: 빠른 반복, 제한된 리소스, 요구사항 변화가 빠름

**추천 아키텍처**:
- 기술 스택: Vue 3 + Vite 또는 React + Vite
- 상태 관리: Pinia 또는 Zustand (경량급)
- UI 라이브러리: Element Plus / Ant Design
- 배포: Vercel / Netlify / 클라우드 서버

**디렉토리 구조**: 유형별로 간단하게 구성

### 5.2 중견 기업 (일일 활성 사용자 1k-100k)

**특징**: 비즈니스 복잡, 팀 협업, 안정성 필요

**추천 아키텍처**:
- 기술 스택: Vue 3 + TypeScript 또는 React + TypeScript
- 상태 관리: Pinia + 컴포저블 함수 또는 Redux Toolkit
- UI 라이브러리: 자체 컴포넌트 라이브러리 + 비즈니스 컴포넌트 라이브러리
- 테스트: 단위 테스트 + E2E 테스트
- 배포: CI/CD 파이프라인 + Docker

**디렉토리 구조**: 기능별 구성, 규범 확립

### 5.3 대형 플랫폼 (일일 활성 사용자 > 100k)

**특징**: 고동시성, 다중 팀 협업, 장기 유지보수

**추천 아키텍처**:
- 기술 스택: React/Vue + TypeScript (엄격 모드)
- 아키텍처: 마이크로 프론트엔드 + Monorepo
- 상태 관리: 세밀한 상태 관리 + 서버 상태 캐시
- 성능: SSR/SSG + CDN + 엣지 컴퓨팅
- 모니터링: 프론트엔드 모니터링 + 에러 추적 + 성능 분석

**디렉토리 구조**: Monorepo + 마이크로 프론트엔드

---

## 6. 아키텍처 진화 로드맵

### 6.1 진화 예시: 블로그에서 플랫폼으로

```
1단계: 개인 블로그 (HTML/CSS/JS)
    ↓ 요구사항: 관리 백오피스 필요
2단계: 관리 백오피스 추가 (Vue/React + 간단한 구조)
    ↓ 요구사항: 사용자 시스템, 댓글 기능
3단계: 기능 모듈화 (기능별 구성)
    ↓ 요구사항: 다중 팀 협업, 독립 배포
4단계: 마이크로 프론트엔드 아키텍처 (Monorepo)
```

### 6.2 아키텍처 업그레이드 적용 시점

| 신호 | 설명 | 제안 |
|------|------|------|
| 빌드 시간 > 5분 | 프로젝트가 너무 큼 | 코드 분할, 마이크로 프론트엔드 |
| 여러 명이 잦은 충돌 | 협업이 어려움 | 기능별 구성, 모듈 분리 |
| 한 곳을 고치면 다른 곳이 망가짐 | 결합도가 심각 | 리팩토링, 테스트 강화 |
| 첫 화면 로딩 > 3초 | 성능 문제 | 지연 로딩, SSR, 최적화 |
| 신규 팀원 온보딩이 느림 | 구조가 혼란스러움 | 문서화, 규범, 리팩토링 |

---

## 7. 요약

::: tip 💡 핵심 사상
**아키텍처에 은탄환은 없습니다. 적합한 것이 최고입니다.**

- **소규모 프로젝트**는 과도하게 설계하지 말고, HTML/CSS/JS면 충분
- **중규모 프로젝트**는 규범을 세우고, 컴포넌트화, 모듈화
- **대규모 프로젝트**는 마이크로 프론트엔드, 성능 최적화, 팀 협업 고려

**이 점들을 기억하세요**:
1. **점진적 진화**: 단순하게 시작하여, 요구사항에 따라 성장
2. **통일된 규약**: 네이밍, 구조, 코드 스타일의 일관성 유지
3. **문서 우선**: 아키텍처 결정을 기록하여 계승에 용이
4. **정기적 리팩토링**: 기술 부채를 제때 상환

**최종 목표**: 코드가 잘 정리된 공간처럼, 크든 작든 효율적으로 작동하게 만드는 것입니다.
:::

---

## 참고 자료

- [Vue 스타일 가이드](https://vuejs.org/style-guide/)
- [React 프로젝트 구조 제안](https://react.dev/learn/thinking-in-react)
- [Bulletproof React - 아키텍처 가이드](https://github.com/alan2207/bulletproof-react)
- [Feature Sliced Design](https://feature-sliced.design/)
- [마이크로 프론트엔드 아키텍처](https://micro-frontends.org/)
