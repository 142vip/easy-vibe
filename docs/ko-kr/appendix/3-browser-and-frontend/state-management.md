# 상태 관리 원리
::: tip 🎯 핵심 질문
**애플리케이션이 점점 커질수록, 컴포넌트 간에 데이터를 어떻게 우아하게 공유하고 동기화할 수 있을까?** 이런 딜레마에 빠질 수 있다: 사용자가 상품 페이지에서 장바구니에 추가했지만, 헤더의 장바구니 개수가 업데이트되지 않는다. 서로 관련 없는 두 컴포넌트가 동일한 데이터를 필요로 하지만, 어떻게 전달해야 할지 모른다. 이 장에서는 "혼란스러운 데이터 전달"에서 "명확한 상태 관리"로 진화하는 과정을 안내한다.
:::

---

## 1. 컴포넌트화와 상태 관리 도입 동기
### 1.1 작은 작업장에서 공장으로: 프론트엔드 개발의 진화

본격적으로 시작하기 전에, 한 가지 질문을 던져보겠다: **주방에서 큰 요리를 해본 적이 있는가?**

혼자서 라면 하나를 끓이는 건 아주 간단하다——냄비 하나, 면 하나, 양념 조금이면 10초면 끝이다. 하지만 레스토랑을 열어 매일 수백 명의 손님을 서빙해야 한다면, 더 이상 "하고 싶은 대로" 할 수 없다. 표준화된 레시피, 명확한 역할 분담, 통일된 구매 프로세스가 필요하다. 그래야 각 요리의 품질이 안정적이고, 서빙 효율이 높아진다.

프론트엔드 개발도 마찬가지다. 혼자서 작은 프로젝트를 할 때는 코드를 아무 데나 작성해도 된다. 하지만 팀이 커지고 프로젝트가 복잡해지면, 코드를 체계적으로 구성하고 데이터를 관리할 방법이 필요하다. 이것이 바로 **컴포넌트화와 상태 관리**가 해결하려는 문제다.

::: tip 🤔 "컴포넌트"와 "상태"란 무엇인가?
계속하기 전에, 두 가지 핵심 용어를 먼저 설명하겠다:

**컴포넌트(Component)**: 레고 블록과 같다. 각 블록은 독립적인 부분으로, 자신만의 모양, 색상, 기능을 가진다. 여러 블록을 조립하면 복잡한 성을 만들 수 있다. 프론트엔드 개발에서 버튼, 폼, 내비게이션 바는 모두 컴포넌트가 될 수 있다.

**상태(State)**: 컴포넌트의 "기억"이다. 예를 들어 버튼은 자신이 "비활성화"인지 "활성화"인지 "기억"하고, 장바구니 컴포넌트는 어떤 상품이 담겨 있는지 "기억"한다. 상태는 변할 수 있으며, 상태 변화는 UI 업데이트를 트리거한다.

**컴포넌트화 + 상태 관리 = 체계적인 코드 + 명확한 데이터 흐름**
:::

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🏠 작은 작업장 모드**
- 코드가 하나의 파일에 작성되어, 마치 하나의 냄비에 모든 요리를 넣는 것과 같다
- 데이터가 여기저기 전달되어, 웨이터가 접시를 들고 레스토랑을 마구 뛰어다니는 것과 같다
- 한 곳을 수정하면 다른 곳에 영향을 미칠 수 있어, 소금을 너무 많이 넣으면 요리 전체가 망가지는 것과 같다

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🏭 공장 모드**
- 코드가 컴포넌트로 분리되어, 레스토랑이 홀, 주방, 구매부로 나뉘는 것과 같다
- 데이터가 중앙 집중식으로 관리되어, 통합 창고와 배송 시스템이 있는 것과 같다
- 수정의 영향 범위가 명확하여, 요리 하나를 바꾼다고 레스토랑 전체가 영향을 받지 않는 것과 같다

</div>
</div>

### 1.2 실제 삽질 스토리:상태 관리를 이해 필요성
이렇게 말할 수도 있다: "저는 Vue/React를 사용하고 있는데, 이미 상태 관리 기능이 있는 거 아닌가요?" 실제 이야기를 하나 들려주겠다. 그러면 왜 컴포넌트화와 상태 관리를 체계적으로 이해하는 것이 그토록 중요한지 알게 될 것이다.

::: warning 샤오메이의 삽질기
샤오메이는 어느 전자상거래 회사의 PM에서 프론트엔드 개발자로 전향한 사람으로, 막 회사의 장바구니 기능 리팩토링을 맡게 되었다. 그녀는 이전에 jQuery 시대의 레거시 프로젝트를 사용했고, 이제 Vue 3로 마이그레이션해야 했다.

샤오메이는 생각했다: "장바구니 로직은 간단해, 배열 하나만 저장하면 되겠네." 그래서 그녀는 코드를 작성하기 시작했다:
- 상품 상세 페이지 컴포넌트에서 `cart` 배열로 장바구니 데이터를 저장
- 장바구니 페이지 컴포넌트에서 또 `cartItems` 배열을 정의
- 헤더 내비게이션 바 컴포넌트에서 또 `cartCount` 변수를 정의

문제는 곧 드러났다:
1. **데이터 불일치**: 사용자가 상품 상세 페이지에서 상품을 추가했지만, 장바구니 페이지의 데이터는 업데이트되지 않았다
2. **중복 코드**: 샤오메이는 여러 개의 "장바구니에 추가" 함수를 각각 다른 컴포넌트에 작성해야 했다
3. **유지보수 어려움**: 운영팀에서 "장바구니 비우기" 기능을 추가하라고 했을 때, 샤오메이는 세 곳을 수정해야 한다는 것을 발견했다

나중에 그녀는 프론트엔드 아키텍트 아창에게 조언을 구했다. 아창은 코드를 한 번 보고 이렇게 말했다: "상태 관리의 가장 큰 금기를 범했군요——같은 데이터를 여러 곳에 저장하고 있어요."

해결책은 간단했다: Pinia를 사용해 전역 장바구니 상태 관리를 만들고, 모든 컴포넌트가 동일한 곳에서 데이터를 읽고 쓰게 하는 것이다. 이렇게 수정한 후, 모든 문제가 말끔히 해결되었다.

샤오메이는 그때부터 한 가지 원칙을 깨달았다: **컴포넌트화와 상태 관리를 이해하지 못하면, 유지보수가 불가능한 "스파게티 코드"를 작성하게 된다.**
:::

::: info 💡 핵심 교훈
컴포넌트화와 상태 관리는 프레임워크의 "부가 기능"이 아니라, 현대 프론트엔드 개발의 기초다. 이를 이해해야만 명확한 아키텍처를 설계하고, 유지보수 가능한 코드를 작성하며, 팀 협업에서 능숙하게 대처할 수 있다.
:::

---

## 2. 핵심 개념: 컴포넌트화의 본질 이해하기

::: tip 🤔 "컴포넌트 사고방식"이란?
컴포넌트 사고방식은 복잡한 UI를 독립적이고, 재사용 가능하며, 단일 책임을 가진 코드 단위로 분해하는 방법이다.

비유하자면: 컴퓨터를 조립한다고 상상해보자. CPU, 메모리, 하드디스크, 그래픽 카드 같은 부품을 각각 구매한 다음 함께 조립한다. 각 부품은 명확한 기능을 가지며, 다른 부품에 영향을 주지 않고 언제든지 특정 부품을 교체할 수 있다.

컴포넌트화는 프론트엔드 코드도 이렇게 "모듈화"할 수 있게 한다——각 컴포넌트는 자신의 일을 책임지고, 명확한 인터페이스를 통해 다른 컴포넌트와 협업한다.
:::

### 2.1 레스토랑 비유로 컴포넌트화 이해하기

레스토랑 비유로 컴포넌트화의 핵심 개념을 이해해보자:

| 개념 | 🍽️ 레스토랑 비유 | 실제 역할 | 구체적인 예시 |
|------|-------------|----------|----------|
| **컴포넌트** | 레스토랑의 각 부서(홀, 주방, 구매부) | 각 부서는 자신의 일을 책임진다 | 버튼 컴포넌트는 클릭을, 폼 컴포넌트는 입력을 담당 |
| **Props(속성)** | 손님이 웨이터에게 주는 메뉴판 | 부모 컴포넌트가 자식 컴포넌트에 데이터를 전달 | 부모 컴포넌트가 "사용자 이름"을 아바타 컴포넌트에 전달 |
| **Events(이벤트)** | 웨이터가 주방에 "새 주문"을 알림 | 자식 컴포넌트가 부모 컴포넌트에 무슨 일이 일어났는지 알림 | 버튼 컴포넌트가 부모 컴포넌트에 "클릭되었습니다"라고 알림 |
| **State(상태)** | 주방의 "현재 주문 목록" | 컴포넌트 내부에 저장된 데이터 | 장바구니 컴포넌트가 어떤 상품이 담겨 있는지 기억 |

::: tip 📊 이 표에서 무엇을 알 수 있는가?
각 행을 하나씩 해석해보자:

**컴포넌트**: 레스토랑에 다양한 부서가 있듯이, 프론트엔드 페이지도 다양한 컴포넌트로 구성된다. 각 컴포넌트는 독립적인 부분으로, 자신만의 책임을 가진다.

**Props**: 이것은 부모 컴포넌트가 자식 컴포넌트에 "데이터를 전달"하는 방식이다. 손님이 주문할 때 웨이터에게 무엇을 먹을지 말하는 것처럼, 부모 컴포넌트도 props를 통해 데이터(예: 사용자 이름, 상품 정보)를 자식 컴포넌트에 전달할 수 있다. 참고: props는 "단방향"이며, 부모에서 자식으로만 전달 가능하고, 역방향은 불가능하다.

**Events**: 자식 컴포넌트가 부모 컴포넌트에 알려야 할 때(예: 버튼 클릭, 폼 제출), 이벤트를 트리거한다. 웨이터가 주문을 받은 후 주방에 "요리 시작"을 알리는 것과 같다. 이렇게 하면 데이터 흐름의 단방향성이 유지된다——자식 컴포넌트는 부모 컴포넌트의 데이터를 직접 수정할 수 없고, "메시지를 보내는" 것만 가능하다.

**State**: 이것은 컴포넌트 내부의 "기억"이다. 주방이 현재 어떤 주문이 있는지 기억해야 하듯이, 컴포넌트도 자신의 상태(예: 장바구니에 어떤 상품이 있는지, 버튼이 비활성화되었는지)를 기억해야 한다. 상태가 변경되면, 컴포넌트는 자동으로 UI를 업데이트한다.
:::

<ComponentHierarchyDemo />

### 2.2 Props와 Events: 부모-자식 컴포넌트의 "공식 채널"

프론트엔드 프레임워크(Vue, React)에서 **Props와 Events는 부모-자식 컴포넌트 통신의 표준 방식**이다.

**Vue 예시:**

```vue
<!-- Parent.vue - 부모 컴포넌트 -->
<template>
  <div>
    <!-- 웨이터에게 메뉴판을 건네듯, props를 통해 데이터를 전달한다 -->
    <Child
      :user-name="currentUser.name"
      :is-admin="currentUser.isAdmin"
      @delete-user="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Child from './Child.vue'

const currentUser = ref({
  name: '장삼',
  isAdmin: true
})

const handleDelete = (userId) => {
  console.log('사용자 삭제:', userId)
  // 삭제 로직 처리
}
</script>
```

```vue
<!-- Child.vue - 자식 컴포넌트 -->
<template>
  <div class="user-card">
    <h3>{{ userName }}</h3>
    <span v-if="isAdmin" class="badge">관리자</span>
    <button @click="requestDelete">사용자 삭제</button>
  </div>
</template>

<script setup>
// 부모 컴포넌트로부터 전달된 데이터 받기
const props = defineProps({
  userName: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
})

// 트리거 가능한 이벤트 정의
const emit = defineEmits(['delete-user'])

const requestDelete = () => {
  // 이벤트를 통해 부모 컴포넌트에 알림
  emit('delete-user', props.userName)
}
</script>
```

::: tip 💡 핵심 원칙
**Props는 아래로, Events는 위로**——이것이 컴포넌트 통신의 황금률이다.

- 부모 컴포넌트는 **props**를 통해 데이터를 자식 컴포넌트에 전달한다(상사가 부하에게 업무를 할당하는 것처럼)
- 자식 컴포넌트는 **events**를 통해 부모 컴포넌트에 무슨 일이 일어났는지 알린다(부하가 상사에게 보고하는 것처럼)

이렇게 하면 데이터 흐름의 명확성과 단방향성이 유지되어, "누구나 데이터를 수정할 수 있는" 혼란스러운 상황을 피할 수 있다.
:::

<PropsFlowDemo />

### 2.3 단방향 데이터 흐름: 왜 props를 직접 수정하면 안 되는가 동기

많은 초보자들이 하는 실수: 자식 컴포넌트에서 props의 값을 직접 수정하는 것이다.

```vue
<!-- ❌ 잘못된 방법 -->
<script setup>
const props = defineProps({
  count: { type: Number, default: 0 }
})

// props 직접 수정 - 금지되어 있다!
props.count = 10  // 에러 발생
</script>
```

**왜 props를 직접 수정할 수 없을까?**

상상해보자: 도서관에서 책(props)을 빌렸는데, 그 책에 낙서를 했다(props 수정). 이 책을 빌리는 다른 사람들(다른 컴포넌트)도 당신의 낙서를 보게 되어 혼란이 생긴다. 올바른 방법은: 데이터를 수정해야 한다면, 부모 컴포넌트가 수정하도록 하고, 자식 컴포넌트는 "수정 요청"만 하는 것이다.

```vue
<!-- ✅ 올바른 방법 -->
<script setup>
const props = defineProps({
  count: { type: Number, default: 0 }
})

const emit = defineEmits(['update-count'])

// 이벤트를 통해 부모 컴포넌트에 수정 요청
const increment = () => {
  emit('update-count', props.count + 1)
}
</script>
```

---

## 3. "혼돈"에서 "질서"로: 컴포넌트 통신의 진화 과정

::: tip 🤔 왜 진화가 필요한가?
프로젝트가 커질수록 컴포넌트 간 통신은 점점 더 복잡해진다. 실제 팀이 어떻게 단계적으로 명확한 상태 관리 솔루션을 진화시켜 나가는지 살펴보자.

이것은 단순한 "도구 업그레이드"가 아니라 **전체 사고방식의 변화**다——"데이터를 마음대로 전달하는 것"에서 "명확한 데이터 흐름을 설계하는 것"으로.
:::

### 3.1 진화의 전체 그림

아래 표는 컴포넌트 통신 방식이 진화하는 네 단계를 보여준다. 문제가 어떻게 하나씩 해결되어 왔는지 확인할 수 있다:

| 단계 | 통신 방식 | 전형적인 문제 | 핵심 변화 |
|------|---------|----------|----------|
| **1단계: 자유 전달** | 직접 수정, 전역 변수 | 데이터 불일치, 디버깅 어려움 | 규범 없음, 아무렇게나 전달 |
| **2단계: Props/Events** | 부모-자식 표준 통신 | Props Drilling(계층별 전달) | 규범 생김, 하지만 깊은 중첩이 번거로움 |
| **3단계: 상태 관리 라이브러리** | Vuex/Redux/Pinia | 학습 비용, 보일러플레이트 코드 | 데이터 중앙 관리, 디버깅 편리 |
| **4단계: 현대적 솔루션** | 컴포저블 함수/원자화 | 새로운 개념 이해 필요 | 더 유연하고, 더 간결함 |

<EventBusDemo />

::: tip 📊 이 표에서 무엇을 알 수 있는가?
각 행을 하나씩 해석해보자:

**1단계 → 2단계**: "규범 없음"에서 "규범 있음"으로. 이것은 질적 도약이다——표준 props/events로 통신하기 시작하면서 데이터 흐름이 명확해진다. 하지만 컴포넌트 계층이 깊을 때 데이터를 한 계층씩 전달해야 하는 번거로움이 생긴다(이것이 Props Drilling이다).

**2단계 → 3단계**: "분산 관리"에서 "중앙 집중 관리"로. Vuex/Redux 같은 상태 관리 라이브러리를 사용하기 시작하여, 공유 데이터를 전역 "저장소"에 두고 모든 컴포넌트가 여기서 데이터를 읽고 쓴다. 이렇게 하면 Props Drilling이 해결되지만, 학습 비용이 높아진다.

**3단계 → 4단계**: "무거운 방식"에서 "가벼운 방식"으로. 새로운 솔루션(예: Vue 3의 Composition API, React의 Hooks)은 상태 관리를 더 유연하고 간결하게 만든다. 더 이상 반드시 전역 store를 사용할 필요 없이, 필요에 따라 작은 상태 단위를 조합할 수 있다.

**요약하자면**: 진화는 단순히 "더 나은 도구로 바꾸는 것"이 아니라, **전체 사고방식의 업그레이드**다——데이터를 마음대로 전달하는 것에서 명확한 데이터 흐름을 설계하는 것으로.
:::

### 3.2 1단계: 자유 전달——혼란의 시작

왜 "자유 전달"이라고 부를까? 이 단계에서는 아무런 규범도 없이, 데이터를 전역 변수, 직접 수정, 이벤트 버스 등 아무렇게나 전달하기 때문이다.

**전형적인 시나리오: 장바구니 데이터가 여기저기 흩어져 있음**

```javascript
// 상품 상세 페이지 컴포넌트
export default {
  data() {
    return {
      localCart: []  // 자체적으로 장바구니 데이터를 유지
    }
  },
  methods: {
    addToCart(product) {
      this.localCart.push(product)
      // 다른 컴포넌트와 동기화 시도
      window.cart = this.localCart  // ❌ 전역 변수!
    }
  }
}

// 장바구니 페이지 컴포넌트
export default {
  data() {
    return {
      cartItems: []  // 또 하나의 장바구니 데이터
    }
  },
  mounted() {
    // 전역 변수에서 읽기 시도
    this.cartItems = window.cart || []  // ❌ 신뢰할 수 없다!
  }
}

// 헤더 내비게이션 컴포넌트
export default {
  data() {
    return {
      cartCount: 0  // 세 번째 데이터!
    }
  },
  mounted() {
    // 폴링으로 변경 확인 (얼마나 터무니없는가)
    setInterval(() => {
      this.cartCount = window.cart?.length || 0
    }, 1000)  // ❌ 성능 저하!
  }
}
```

**이 단계의 특징:**
- ✅ **장점**: 간단하고 직관적이며, 학습 비용이 전혀 없다
- ❌ **단점**: 데이터 분산, 동기화 어려움, 디버깅 곤란, 엉망진창

### 3.3 2단계: Props/Events——규범의 확립

자유 전달의 혼란은 팀이 깨닫게 했다: **규범이 필요하다**. 그래서 프레임워크가 제공하는 표준 통신 방식인 props와 events를 사용하기 시작했다.

**전형적인 시나리오: Props Drilling(속성 드릴링)**

```vue
<!-- 조상 컴포넌트: App.vue -->
<template>
  <div class="app">
    <!-- 사용자 정보를 계층별로 전달 -->
    <Layout :user-name="userName" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Layout from './Layout.vue'

const userName = ref('장삼')
</script>
```

```vue
<!-- 중간 계층: Layout.vue -->
<template>
  <div class="layout">
    <Header :user-name="userName" />  <!-- 그냥 전달만, 사용하지 않음 -->
    <Main>
      <Page :user-name="userName" />  <!-- 그냥 전달만, 사용하지 않음 -->
    </Main>
  </div>
</template>

<script setup>
const props = defineProps({
  userName: String
})
</script>
```

```vue
<!-- 실제로 필요한 곳: Header.vue -->
<template>
  <header>
    <span>{{ userName }}</span>  <!-- 드디어 사용된다 -->
  </header>
</template>

<script setup>
const props = defineProps({
  userName: String
})
</script>
```

**이 단계의 특징:**
- ✅ **장점**: 데이터 흐름이 명확하고, 단방향이며, 이해하기 쉽다
- ❌ **단점**: Props Drilling(계층별 전달이 번거로움), 크로스 컴포넌트 통신이 어려움

::: tip 🤔 Props Drilling이란?
Props Drilling이란: **데이터가 여러 중간 컴포넌트를 거쳐 한 계층씩 아래로 전달되어야 하지만, 이러한 중간 컴포넌트들은 실제로 이 데이터를 사용하지 않는 것**을 말한다.

마치 5층에 사는 사람에게 택배를 배달해야 하는데, 규칙상 모든 층에서 한 번씩 서명을 받아야 하는 것과 같다. 1,2,3,4층 사람들은 그냥 "택배를 전달"만 할 뿐, 그 택배가 필요하지 않지만 반드시 참여해야 한다. 이는 분명히 매우 번거로운 일이다.
:::

### 3.4 3단계: 상태 관리 라이브러리——중앙 집중식 관리

Props Drilling의 고통이 상태 관리 라이브러리(Vuex, Redux, Pinia)를 탄생시켰다. 이들의 핵심 아이디어는: **공유 데이터를 전역 "저장소"에 두고, 모든 컴포넌트가 여기서 데이터를 읽고 쓰는 것**이다.

**전형적인 시나리오: Pinia로 장바구니 관리하기**

```javascript
// stores/cart.js - 전역 장바구니 상태
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // 모든 장바구니 데이터가 여기에 집중된다
  const items = ref([])

  // 계산 속성: 상품 개수
  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  // 메서드: 상품 추가
  const addItem = (product) => {
    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  return {
    items,
    itemCount,
    addItem
  }
})
```

```vue
<!-- 상품 상세 페이지 컴포넌트 -->
<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

const addToCart = (product) => {
  cart.addItem(product)  // 직접 호출, 계층별 전달 불필요
}
</script>
```

```vue
<!-- 헤더 내비게이션 컴포넌트 -->
<template>
  <header>
    <span>장바구니 ({{ cart.itemCount }})</span>
  </header>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()  // 직접 읽기, 자동 동기화
</script>
```

**이 단계의 특징:**
- ✅ **장점**: 데이터 중앙 관리, Props Drilling 해결, 강력한 디버깅 도구
- ❌ **단점**: 학습 비용, 추가 코드 필요(보일러플레이트), 간단한 프로젝트에는 과도한 설계일 수 있음

### 3.5 4단계: 현대적 솔루션——유연함과 간결함

상태 관리 라이브러리는 강력하지만, "대포로 참새를 쏘는" 문제도 있다. 중소규모 프로젝트를 위해 더 유연하고 가벼운 솔루션이 등장했다.

**전형적인 시나리오: Composable/Hooks로 상태 로직 재사용하기**

```javascript
// composables/useCart.js - 재사용 가능한 장바구니 로직
import { ref, computed } from 'vue'

export function useCart() {
  const items = ref([])

  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const addItem = (product) => {
    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  return {
    items,
    itemCount,
    addItem
  }
}
```

```vue
<!-- 어떤 컴포넌트에서든 사용 가능 -->
<script setup>
import { useCart } from '@/composables/useCart'

// 호출할 때마다 새로운 상태 인스턴스가 생성된다
// 컴포넌트 내부의 로컬 상태에 적합
const { items, itemCount, addItem } = useCart()
</script>
```

**이 단계의 특징:**
- ✅ **장점**: 유연하고, 가볍고, 조합 가능하며, 필요에 따라 사용
- ❌ **단점**: 조합적 사고방식 이해 필요, 크로스 컴포넌트 공유에는 추가 처리가 필요

---

## 4. 상태 관리 라이브러리 상세: Vuex vs Pinia vs Redux: :: tip 🤔 상태 관리 라이브러리를 어떻게 선택할까 비교
다양한 상태 관리 라이브러리를 마주하면 혼란스러울 수 있다: 도대체 어떤 것을 선택해야 할까?

사실 "최고의" 라이브러리는 없고, "가장 적합한" 라이브러리만 있을 뿐이다. 선택 시 다음 요소를 고려하라:
- **어떤 프레임워크를 사용하는가?** Vue는 Pinia, React는 Redux/Zustand
- **프로젝트 규모는?** 작은 프로젝트는 Composable, 큰 프로젝트는 상태 관리 라이브러리
- **팀 경험은?** 팀이 익숙한 것을 선택하거나, 학습 비용이 낮은 것을 선택

이어지는 내용에서는 주요 상태 관리 라이브러리의 특징과 사용 시나리오를 자세히 소개한다.
:::

### 4.1 주요 상태 관리 라이브러리 비교

| 특성 | Redux | Vuex | Pinia | Zustand |
| :--- | :--- | :--- | :--- | :--- |
| **대상 프레임워크** | React | Vue | Vue | React |
| **학습 곡선** | 가파름 | 중간 | 완만함 | 완만함 |
| **보일러플레이트 코드** | 많음 | 중간 | 적음 | 매우 적음 |
| **TypeScript** | 양호 | 양호 | 우수 | 우수 |
| **디버깅 도구** | 강력 | 양호 | 우수 | 양호 |
| **적합한 시나리오** | 대규모 프로젝트 | Vue 2/3 중대규모 프로젝트 | Vue 3 신규 프로젝트 | React 중소규모 프로젝트 |

::: tip 📊 이 표에서 무엇을 알 수 있는가?
각 행을 하나씩 해석해보자:

**Redux**: React 생태계의 베테랑 상태 관리 라이브러리. 엄격한 규범과 강력한 디버깅 도구가 장점이지만, 보일러플레이트 코드가 많고 학습 곡선이 가파르다. 대규모 프로젝트와 엄격한 규범이 필요한 팀에 적합하다.

**Vuex**: Vue 2 시대의 공식 상태 관리 라이브러리. 설계 철학은 Redux와 유사하지만, Vue의 반응형 시스템에 더 잘 맞는다. 지금도 사용할 수 있지만, 신규 프로젝트는 Pinia를 권장한다.

**Pinia**: Vue 3 공식 권장 차세대 상태 관리 라이브러리. 문법이 간결하고, TypeScript 지원이 좋으며, 학습 비용이 낮다. **이것이 Vue 3 프로젝트의 첫 번째 선택이다.**

**Zustand**: React 생태계의 경량 상태 관리 라이브러리. API가 극도로 간결하고, 보일러플레이트 코드가 거의 없다. 중소규모 React 프로젝트에 적합하다.
:::

<StateManagementComparisonDemo />

### 4.2 Pinia 실전: Vue 3의 권장 선택

Pinia는 Vue 팀이 공식적으로 권장하는 상태 관리 라이브러리로, Vue 3를 위해 설계되었다. Vuex보다 더 간결하고 사용하기 쉽다.

**왜 Pinia라고 부를까?**

Pinia는 스페인어로 "파인애플"을 의미한다. 파인애플은 여러 개의 작은 꽃이 모여 하나의 과일을 이루는데, 각 작은 꽃은 독립적이지만 전체적으로는 하나의 통일된 전체를 이룬다. 이것이 바로 Pinia의 설계 철학을 비유한다——**각 store는 독립적이지만, 조합하여 사용할 수 있다**.

**핵심 개념:**

::: details 전체 코드 예시 보기
```javascript
// stores/user.js - 사용자 상태 관리
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 1. State: 데이터 저장
  const userInfo = ref(null)
  const isLoggedIn = computed(() => !!userInfo.value)

  // 2. Actions: 데이터 수정 메서드
  const login = async (username, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
    const user = await response.json()
    userInfo.value = user  // 직접 수정, Pinia가 반응형을 처리
  }

  const logout = () => {
    userInfo.value = null
  }

  // 3. Getters: 계산 속성
  const displayName = computed(() => {
    return userInfo.value?.name || '방문객'
  })

  return {
    userInfo,
    isLoggedIn,
    login,
    logout,
    displayName
  }
})
```
:::

**컴포넌트에서 사용하기:**

```vue
<template>
  <div class="user-panel">
    <span v-if="user.isLoggedIn">환영합니다, {{ user.displayName }}</span>
    <button v-if="user.isLoggedIn" @click="user.logout">로그아웃</button>
    <button v-else @click="showLoginDialog">로그인</button>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

// store를 직접 가져오면, 모든 내용이 반응형이다
const user = useUserStore()

const showLoginDialog = () => {
  // 로그인 대화상자 표시...
}
</script>
```

**Pinia의 장점:**

| 장점 | 설명 | Vuex와 비교 |
|------|------|----------|
| **간결한 API** | mutations 불필요, state 직접 수정 | Vuex는 mutations와 actions를 분리해야 함 |
| **TypeScript 친화적** | 네이티브 타입 추론, 추가 설정 불필요 | Vuex는 복잡한 타입 정의 필요 |
| **자동 모듈화** | 각 store 파일이 자동으로 모듈이 됨 | Vuex는 namespaced를 수동 설정해야 함 |
| **더 작은 크기** | 번들 후 약 1KB | Vuex는 약 3KB |

<VuexPiniaDemo />

### 4.3 Redux 실전: React의 클래식한 선택

Redux는 React 생태계에서 가장 클래식한 상태 관리 라이브러리로, 엄격한 단방향 데이터 흐름으로 유명하다.

**왜 Redux라고 부를까?**

Redux는 "Reduced Flux"의 약자다. Flux는 Facebook이 초기에 제안한 애플리케이션 아키텍처 패턴이며, Redux는 Flux의 개념을 단순화했기 때문에 "Reduced Flux"라고 부른다.

**핵심 원칙:**

1. **단일 데이터 소스**: 전체 애플리케이션의 state가 하나의 객체 트리에 저장된다
2. **State는 읽기 전용**: state를 변경하는 유일한 방법은 action을 트리거하는 것이다
3. **순수 함수로 수정**: Reducer는 반드시 순수 함수여야 한다

::: details 전체 코드 예시 보기
```javascript
// 1. Action Types 정의
const ADD_TODO = 'ADD_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'

// 2. Action Creators 정의
const addTodo = (text) => ({
  type: ADD_TODO,
  payload: { id: Date.now(), text, completed: false }
})

const toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  payload: { id }
})

// 3. Reducer 정의 (순수 함수)
const initialState = {
  todos: []
}

const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, action.payload]
      }
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      }
    default:
      return state
  }
}

// 4. Store 생성
import { createStore } from 'redux'
const store = createStore(todoReducer)
```
:::

**React에서 사용하기:**

```jsx
import { useSelector, useDispatch } from 'react-redux'

function TodoList() {
  // state 읽기
  const todos = useSelector(state => state.todos)

  // dispatch 함수 가져오기
  const dispatch = useDispatch()

  return (
    <ul>
      {todos.map(todo => (
        <li
          key={todo.id}
          onClick={() => dispatch(toggleTodo(todo.id))}
          style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
        >
          {todo.text}
        </li>
      ))}
    </ul>
  )
}
```

**Redux의 장단점:**

| 장점 | 단점 |
| :--- | :--- |
| 엄격한 데이터 흐름, 디버깅 용이 | 보일러플레이트 코드 많음, 학습 곡선 가파름 |
| 시간 여행 디버깅(Time Travel) | 간단한 상태에도 많은 코드 작성 필요 |
| 풍부한 미들웨어 생태계 | 소규모 프로젝트에 부적합 |
| 예측 가능한 상태 업데이트 | 함수형 프로그래밍 개념 이해 필요 |

<ReduxFlowDemo />

<MobxReactivityDemo />

<ZustandJotaiDemo />

---

## 5. 실전 가이드: 상태 관리를설계 접근법

::: tip 🤔 언제 상태 관리 라이브러리가 필요할까?
모든 프로젝트에 상태 관리 라이브러리가 필요한 것은 아니다. 도입하기 전에 스스로에게 몇 가지 질문을 던져보자:

1. **얼마나 많은 컴포넌트가 이 데이터를 공유해야 하는가?**
   - 2-3개 컴포넌트뿐이라면, props/events로 충분하다
   - 5개 이상의 컴포넌트라면, 상태 관리 라이브러리를 고려하라

2. **이 데이터가 자주 변경되는가?**
   - 거의 변하지 않는다면(예: 사용자 정보), Provide/Inject 사용
   - 자주 변경된다면(예: 장바구니), 상태 관리 라이브러리 사용

3. **팀 규모는 어느 정도인가?**
   - 개인 또는 소규모 팀: 간단한 솔루션으로 충분
   - 대규모 팀: 엄격한 규범과 강력한 디버깅 도구 필요

**기억하라: 간단하게 시작하고, 필요에 따라 업그레이드하라.**
:::

### 5.1 상태 설계의 원칙

어떤 상태 관리 솔루션을 선택하든, 다음 원칙을 따라야 한다:

**원칙 1: 단일 데이터 소스**

동일한 데이터는 한 곳에만 저장해야 한다. 여러 컴포넌트에서 동일한 데이터를 중복 정의하지 마라.

```javascript
// ❌ 잘못된 방법: 데이터가 여기저기 분산됨
const ProductDetail = { cart: [] }
const CartPage = { items: [] }
const Header = { count: 0 }

// ✅ 올바른 방법: 데이터 중앙 관리
const cartStore = { items: [] }  // 유일한 데이터 소스
```

**원칙 2: 불변성**

상태를 수정할 때는 원본 객체를 직접 수정하지 말고, 새 객체를 생성해야 한다.

```javascript
// ❌ 잘못된 방법: 직접 수정
state.items.push(newItem)

// ✅ 올바른 방법: 새 객체 생성
state.items = [...state.items, newItem]
```

**원칙 3: 상태는 위로 올리고, 이벤트는 아래로 전달**

공유 상태는 가장 가까운 공통 조상 컴포넌트나 전역 store에 두어야 하며, 각 자식 컴포넌트에 분산시키지 않아야 한다.

```vue
<!-- ❌ 잘못된 방법: 상태가 자식 컴포넌트에 있음 -->
<Parent>
  <Child :data="childData" @update="childData = $event" />
</Parent>

<!-- ✅ 올바른 방법: 상태가 부모 컴포넌트에 있음 -->
<Parent>
  <Child :data="parentData" @update="parentData = $event" />
</Parent>
```

### 5.2 실전 사례: 전자상거래 장바구니 상태 설계

지금까지 배운 지식을 종합하여, 전자상거래 장바구니의 상태 관리 솔루션을 설계해보자.

**요구사항 분석:**

- 상품 목록 페이지에서 장바구니에 상품 추가 가능
- 장바구니 페이지에서 상품 조회, 수량 수정, 삭제 가능
- 헤더 내비게이션에 장바구니 상품 개수 표시
- 상품 선택/선택 해제 지원, 선택된 상품 총액 계산
- localStorage에 데이터 영속화

**상태 설계 (Pinia):**

```javascript
// stores/cart.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // ============ State(상태) ============
  const items = ref([])  // 장바구니 상품 목록
  const selectedIds = ref([])  // 선택된 상품 ID

  // localStorage에서 데이터 복원
  const initFromStorage = () => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        items.value = data.items || []
        selectedIds.value = data.selectedIds || []
      } catch (e) {
        console.error('장바구니 데이터 읽기 실패:', e)
      }
    }
  }

  // localStorage에 영속화
  const persist = () => {
    localStorage.setItem('cart', JSON.stringify({
      items: items.value,
      selectedIds: selectedIds.value
    }))
  }

  // ============ Getters(계산 속성) ============
  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const selectedItems = computed(() =>
    items.value.filter(item => selectedIds.value.includes(item.id))
  )

  const selectedTotalPrice = computed(() =>
    selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  // ============ Actions(메서드) ============
  const addItem = (product) => {
    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity += product.quantity || 1
    } else {
      items.value.push({
        ...product,
        quantity: product.quantity || 1
      })
    }
    persist()
  }

  const updateQuantity = (productId, quantity) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        item.quantity = quantity
        persist()
      }
    }
  }

  const removeItem = (productId) => {
    items.value = items.value.filter(item => item.id !== productId)
    selectedIds.value = selectedIds.value.filter(id => id !== productId)
    persist()
  }

  const toggleSelection = (productId) => {
    const index = selectedIds.value.indexOf(productId)
    if (index > -1) {
      selectedIds.value.splice(index, 1)
    } else {
      selectedIds.value.push(productId)
    }
    persist()
  }

  // 초기화
  initFromStorage()

  return {
    // State
    items,
    selectedIds,
    // Getters
    itemCount,
    totalPrice,
    selectedItems,
    selectedTotalPrice,
    // Actions
    addItem,
    updateQuantity,
    removeItem,
    toggleSelection
  }
})
```

**컴포넌트에서 사용하기:**

```vue
<!-- 상품 상세 페이지: ProductDetail.vue -->
<template>
  <div class="product-detail">
    <h2>{{ product.name }}</h2>
    <p class="price">¥{{ product.price }}</p>
    <button @click="addToCart">장바구니에 추가</button>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  product: Object
})

const cart = useCartStore()

const addToCart = () => {
  cart.addItem({
    id: props.product.id,
    name: props.product.name,
    price: props.product.price
  })
}
</script>
```

```vue
<!-- 헤더 내비게이션: Header.vue -->
<template>
  <header class="header">
    <div class="logo">나의 상점</div>
    <nav>
      <RouterLink to="/">홈</RouterLink>
      <RouterLink to="/cart">
        장바구니 ({{ cart.itemCount }})
      </RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()  // 직접 사용, 자동으로 변경에 반응
</script>
```

---

## 6. 흔한 함정과 피하는 가이드

::: warning ⚠️ 이 함정들, 90%의 초보자가 빠진다
상태 관리 실전에서 특히 흔한 실수들이 있다. 가장 흔한 함정과 이를 피하는 방법을 정리해보겠다.
:::

### 6.1 함정 1: Props나 State 직접 수정하기

**잘못된 코드:**

```javascript
// ❌ props 직접 수정
props.user.name = '이사'

// ❌ Vuex의 state 직접 수정
store.state.user.name = '이사'

// ❌ 배열 요소 직접 수정
state.items[0].name = '새 이름'
```

**왜 안 되는가?**

프론트엔드 프레임워크(Vue/React)는 데이터의 변화를 "추적"해야 자동으로 UI를 업데이트할 수 있다. 객체나 배열을 직접 수정하면, 프레임워크가 변화를 감지하지 못해 UI가 업데이트되지 않을 수 있다.

**올바른 방법:**

```javascript
// ✅ Vue 3 / Pinia: 최상위 속성 직접 수정
store.user.name = '이사'  // Pinia가 자동으로 반응형 처리

// ✅ Vue 2 / Vuex: mutation을 통해
mutations: {
  UPDATE_USER_NAME(state, newName) {
    state.user.name = newName
  }
}

// ✅ 배열 수정: 새 배열 생성
state.items = state.items.map((item, index) =>
  index === 0 ? { ...item, name: '새 이름' } : item
)
```

### 6.2 함정 2: Getter에서 상태 수정하기

**잘못된 코드:**

```javascript
// ❌ getter에서 상태 수정
getters: {
  doubleCount(state) {
    state.count *= 2  // 부작용!
    return state.count
  }
}
```

**왜 안 되는가?**

Getter는 "순수 함수"여야 하며, 계산과 값 반환만 담당하고 어떠한 부작용(상태 수정)도 없어야 한다. getter에서 상태를 수정하면 무한 루프나 디버깅이 어려운 문제가 발생할 수 있다.

**올바른 방법:**

```javascript
// ✅ Getter는 계산만, 수정하지 않음
getters: {
  doubleCount(state) {
    return state.count * 2
  }
}

// ✅ 수정이 필요하면 action 사용
actions: {
  doubleCountAndSave({ commit }) {
    commit('SET_DOUBLE_COUNT')
  }
}
```

### 6.3 함정 3: 이벤트 리스너 정리를 잊음

**잘못된 코드:**

```javascript
// ❌ 구독 취소를 잊음
export default {
  created() {
    EventBus.$on('cart-updated', this.handleCartUpdate)
  }
  // 컴포넌트는 소멸되었지만, 리스너는 여전히 살아있다!
}
```

**왜 안 되는가?**

컴포넌트가 소멸되었는데 이벤트 리스너가 남아있으면, 메모리 누수(점유된 메모리를 해제할 수 없음)가 발생한다. SPA에서 사용자가 계속 페이지를 전환하면, 정리되지 않은 리스너가 점점 쌓여 결국 페이지가 버벅거리게 된다.

**올바른 방법:**

```javascript
// ✅ 적시에 구독 취소
export default {
  created() {
    EventBus.$on('cart-updated', this.handleCartUpdate)
  },
  beforeUnmount() {  // Vue 3는 beforeUnmount, Vue 2는 beforeDestroy
    EventBus.$off('cart-updated', this.handleCartUpdate)
  }
}
```

### 6.4 함정 4: 상태 관리 과도하게 사용하기

**잘못된 코드:**

```javascript
// ❌ 모든 상태를 store에 넣음
const store = useStore()
store.inputValue = '사용자 입력'
store.isModalOpen = true
store.currentTab = 'profile'
```

**왜 안 되는가?**

모든 상태를 전역 store에 넣을 필요는 없다. 하나의 컴포넌트에서만 사용되는 상태(예: 입력 필드 값, 모달 창의 열림/닫힘)는 컴포넌트 내부에 두면 된다. 상태 관리를 과도하게 사용하면 코드가 오히려 복잡해진다.

**올바른 방법:**

```javascript
// ✅ 로컬 상태는 컴포넌트 내부에서 관리
const inputValue = ref('')

// ✅ 공유가 필요한 상태만 store에 저장
const userInfo = useUserStore()  // 여러 컴포넌트가 사용자 정보 필요
const cart = useCartStore()  // 여러 컴포넌트가 장바구니 데이터 필요
```

---

## 7. 정리 및 제안

### 7.1 핵심 지식 포인트 복습

컴포넌트화와 상태 관리의 핵심 개념을 표로 정리해보자:

| 개념 | 한 문장 설명 | 해결하는 문제 | 대표 도구 |
|------|-----------|-----------|----------|
| **컴포넌트화** | UI를 독립적이고 재사용 가능한 부분으로 분해 | 코드 재사용, 책임 분리 | Vue/React 컴포넌트 |
| **Props** | 부모 컴포넌트가 자식 컴포넌트에 데이터 전달 | 부모-자식 통신 | Vue/React 내장 |
| **Events** | 자식 컴포넌트가 부모 컴포넌트에 무슨 일이 일어났는지 알림 | 자식-부모 통신 | Vue/React 내장 |
| **State** | 컴포넌트 내부에 저장된 데이터 | 컴포넌트의 상태 기억 | Vue/React 내장 |
| **상태 관리 라이브러리** | 전역 공유 상태를 중앙 집중식으로 관리 | 크로스 컴포넌트 통신, Props Drilling | Pinia, Redux, Zustand |
| **단일 데이터 소스** | 동일한 데이터는 한 곳에만 저장 | 데이터 불일치, 동기화 어려움 | 상태 관리 라이브러리의 핵심 원칙 |

### 7.2 다양한 시나리오별 선택 제안

| 시나리오 | 권장 솔루션 | 이유 |
| :--- | :--- | :--- |
| **부모-자식 컴포넌트 통신** | Props + Events | 프레임워크 내장, 간단하고 직관적 |
| **계층 간 데이터 전달** | Provide / Inject | 계층별 전달 회피 |
| **컴포넌트 내 로컬 상태** | ref / useState | 간단, 추가 도구 불필요 |
| **중간 규모 Vue 프로젝트** | Pinia | 공식 권장, 학습 비용 낮음 |
| **중간 규모 React 프로젝트** | Zustand | 극도로 간결, 보일러플레이트 없음 |
| **대규모 Vue 프로젝트** | Pinia + 규범 | 유연하고 확장 가능 |
| **대규모 React 프로젝트** | Redux Toolkit | 엄격한 규범, 풍부한 생태계 |
| **크로스 컴포넌트 로직 재사용** | Composable / Hooks | 유연하고 조합 가능 |

### 7.3 학습 제안

**초보자에게:**

1. **기초를 먼저 마스터하라**: props, events, state 같은 기본 개념을 이해하라
2. **작은 프로젝트부터 시작하라**: 처음부터 상태 관리 라이브러리를 도입하지 마라
3. **코드를 많이 작성하라**: 이론을 아무리 많이 배워도, 직접 실습하는 것만 못하다

**중급자에게:**

1. **소스 코드를 읽어라**: Pinia/Redux의 작동 원리를 이해하라
2. **패턴을 배워라**: 일반적인 디자인 패턴(옵저버 패턴, 발행-구독 패턴 등)을 이해하라
3. **생태계에 주목하라**: 관련 도구(DevTools, 미들웨어 등)를 학습하라

**이 핵심 원칙을 기억하라:**

1. **간단하게 시작하라**: 복잡한 상태 관리 라이브러리를 너무 일찍 도입하지 마라
2. **단일 데이터 소스**: 동일한 데이터를 여러 곳에 저장하지 마라
3. **불변성**: 상태를 수정할 때는 직접 수정하지 말고 새 객체를 생성하라
4. **필요에 따라 선택하라**: 프로젝트 규모와 팀 상황에 맞는 솔루션을 선택하라

이 글이 컴포넌트화와 상태 관리에 대한 전체적인 인식을 구축하는 데 도움이 되길 바란다. 실제 프로젝트에서 복잡한 데이터 흐름 문제를 마주했을 때, 어디서부터 시작하고, 어떻게 설계하고, 어떻게 구현해야 할지 알 수 있기를 바란다.