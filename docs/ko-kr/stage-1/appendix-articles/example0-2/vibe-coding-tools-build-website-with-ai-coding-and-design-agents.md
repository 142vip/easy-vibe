# 디자인 Agent와 코딩 Agent로 웹사이트 설계하기

## 이 장의 가이드

이 장에서는 디자인과 개발이 AI를 통해 어떻게 완벽하게 협업할 수 있는지 보여 줍니다. 당신은 제품 관리자의 역할을 맡아 "디자인 Agent"에게 로고 디자인, 색상 구성, 페이지 레이아웃을 지휘하고, 이어서 "코딩 Agent"와 협업해 시각 디자인을 실행 가능한 코드로 바꿉니다. 창의적인 구상부터 웹사이트 공개까지, 전 과정에서 AI가 개발을 지원하는 흐름을 경험하고 한 사람이 하나의 팀이 되는 방식을 체험합니다.

---

# 1. 입문 가이드

## 1. 튜토리얼 소개

AI 디자인 Agent와 코딩 Agent를 사용하여 제로에서 완전한 웹사이트를 구축해 봅시다.

- **디자인 Agent**: 로고 생성, 웹 페이지 레이아웃, 색상 구성 및 기타 시각적 요소의 생성을 담당합니다
- **코딩 Agent**: 프롬프트에서 제시한 요구사항과 레이아웃에 따라 HTML/CSS/JS 등의 실제 코드를 작성하여 실행 가능한 웹사이트를 구축합니다

## 2. 디자인 Agent와 코딩 Agent

- **디자인 Agent**: 제공한 프롬프트에 따라 이미지, 페이지 모형 또는 디자인 스타일을 생성하는 AI입니다.
- Mastergo
- Lovart
- Figma MCP
- **코딩 Agent**: 프롬프트에서 요청한 기능과 레이아웃에 따라 실제 코드(HTML/CSS/JS 등)를 작성하는 AI입니다.
- Z.AI
- Trae
- Cursor
- Lovable

---

# 2. 디자인 Agent를 사용하여 로고 만들기

## 1. 로고 디자인 시 고려해야 할 핵심 요소

로고는 웹사이트의 첫인상을 결정하는 핵심 요소 중 하나입니다. AI 디자인 Agent에서 만족스러운 결과를 얻으려면 프롬프트에서 원하는 로고 유형을 명확하게 설명해야 합니다.

1. **브랜드 이름 / 텍스트**

- 로고에 반드시 포함되어야 하는 텍스트(예: 웹사이트 제목, 브랜드 이름 등).

2. **스타일(분위기 / 느낌)**

- 로고가 전달하고자 하는 전반적인 느낌이나 분위기.
- _예시: 미니멀, 귀여움, 간결, 모던, 레트로, 미래지향적 등._

3. **색상 구성**(선택)

- 로고의 색상을 웹사이트 전체의 기본 톤과 일치시키는 것이 좋습니다.
- 구체적인 hex 컬러 코드나 대략적인 색조(차가운 색, 따뜻한 색 등)를 지정할 수 있습니다.
- _예시: **`#171721`**(검정), **`#FF7130`**(오렌지)._

4. **형태(모양 / 구조)**

- 로고에 특정한 모양이나 구도가 필요한지 명확히 합니다.
- _예시: 원형 안에 텍스트, 아이콘 + 텍스트 조합, 아이콘 중심의 로고 등._

5. **아이콘 / 심볼 요소**(선택)

- 로고에 나타내고 싶은 그래픽이나 기호.
- _예시: 책 아이콘, 번개 심볼, AI 관련 그래픽, 추상적인 기하학적 형태 등._

## 2. 로고 디자인 프롬프트 작성

**프롬프트 예시**

```
"미니멀 스타일의 로고를 디자인해 주세요. 브랜드 이름은 'My First Website'입니다.
검정색(#171721)과 오렌지색(#FF7130)을 사용하고, 텍스트를 원형 안에 배치해 주세요."
```

```
"'AIID'를 브랜드명으로 하는 로고를 디자인해 주세요.
전체적인 스타일은 미래지향적이고 깔끔하게, 메인 컬러는 파란색과 흰색으로 해 주세요.
AI를 상징하는 추상 그래픽과 텍스트를 결합하고, 투명 배경의 PNG로 내보내 주세요."
```

## 3. Agent에게 디자인 요청하기

- 위 프롬프트 입력 -> Agent가 생성한 여러 디자인 시안 비교

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image1.png)![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image2.webp)

## 4. 최종 로고 확정

- 시안 중 가장 마음에 드는 버전을 선택하여 다운로드합니다.

---

# 3. 웹사이트 구조 기획하기

## 1. 기본 섹션 이해하기

웹사이트 제작을 본격적으로 시작하기 전에 어떤 메뉴(섹션)를 포함할지 기획하는 것이 중요합니다. 메뉴 디자인은 방문자에게 무엇을 보여줄지, 그리고 어떤 행동을 유도할지에 따라 결정됩니다.
일반적으로 웹사이트는 **Home / About / Contact** 등의 기본 섹션으로 구성됩니다.

## 2. 직접 구조 스케치하기(선택)

웹사이트의 목표에 따라 간단한 메뉴 구조를 먼저 작성해 볼 수 있습니다.

### 기본 메뉴

1. **Home**
   1. 방문자가 웹사이트에 들어온 후 처음으로 보는 메인 페이지
   2. 보통 로고, 메인 비주얼 영역과 짧은 슬로건 또는 소개 포함
2. **About**
   1. 당신이 누구인지, 또는 프로젝트/서비스의 목적 소개
   2. 개인 포트폴리오: 자기소개 + 간단한 이력
   3. 서비스형 웹사이트: 비전, 목표 및 핵심 기능
3. **Contact**
   1. 이메일, 전화번호, 소셜 미디어 링크 등 연락처 정보
   2. 간단한 문의 양식을 추가할 수도 있음

### 선택 메뉴

4. **Services / Projects**
   1. 제공하는 서비스나 프로젝트/포트폴리오 전시
   2. 보통 목록이나 카드 형태로 전시

5. **Gallery**
   1. 이미지, 사진 또는 디자인 작품 전시용

6. **Blog / News**
   1. 글, 업데이트 또는 로그 게시용

7. **FAQ**
   1. 방문자가 자주 묻는 질문과 답변 정리

## 3. 색상 구성 선택(선택)

이미 로고가 있거나, 특정 색상 조합으로 웹사이트를 디자인하고 싶다면 프롬프트에 사용할 색상 코드를 직접 적을 수 있습니다.

**예시:** `#171721, #872B97, #FF7130, #FF3C68`

당장 색상 구성이 떠오르지 않는다면, 색상 웹사이트나 키워드 검색으로 영감을 찾을 수 있습니다.

- **색상 참고 웹사이트**
  - https://colorhunt.co/
  - https://coolors.co/

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image3.png)![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image4.png)

- **Google에서 키워드로 색상 구성 검색**

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image5.webp)

## 4. 웹사이트 디자인 프롬프트 작성

**프롬프트 예시**

```
"Home, About, Contact 세 개의 섹션으로 구성된 싱글 페이지 웹사이트를 디자인해 주세요.
색상은 #171721, #FF7130, #FF3C68을 사용해 주세요.
전체적인 스타일은 모던하고 간결하게 해 주세요."
```

---

# 4. 디자인 Agent로 웹사이트 디자인하기

## 1. 프롬프트 입력 -> 디자인 시안 생성

- 프롬프트에 기획한 구조와 선택한 색상을 작성합니다.

**Mastergo 프롬프트 예시**

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image6.webp)![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image7.webp)

## 2. 디자인 시안 검토 및 수정 요청

필요에 따라 Agent에게 피드백을 제출할 수 있습니다. 예를 들어:

- "너무 화려해요. 전체적인 스타일을 더 간결하게 바꿔 주세요."
- "폰트를 바꿔 주세요."
- "색상 조합을 조정해 주세요."
- "여기 이 부분을 삭제해 주세요."

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image8.png)

## 3. 최종 디자인 확정

디자인 시안을 여러 차례 수정하고 만족한 후에는 이 디자인을 코드로 변환하여 코딩 Agent가 이해하고 작업을 이어갈 수 있게 합니다.

디자인을 코드로 변환하는 방법은 플랫폼마다 다르지만, 보통 디자인 플랫폼에서 특정 플러그인을 설치하여 사용합니다.

**Mastergo 예시**

1. [Mastergo 플러그인 웹사이트](https://mastergo.com/community/plugin)를 열고 **seal**을 검색합니다.

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image9.webp)

2. 디자인 페이지로 돌아가서 **블록 아이콘(플러그인)**을 클릭합니다.

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image10.png)

3. 코드로 변환하고 싶은 디자인 영역을 선택하고 **Generate** 버튼을 클릭하여 코드를 생성합니다.

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image11.webp)

---

# 5. 코딩 Agent로 웹사이트 구축하기

## 1. HTML/CSS/JS의 기본 개념 이해하기

웹사이트는 본질적으로 세 가지 언어로 구성됩니다:

- **HTML(HyperText Markup Language)** -> 구조(뼈대)
- **CSS(Cascading Style Sheets)** -> 스타일(외관)
- **JavaScript(JS)** -> 기능(상호작용)

이 세 가지가 함께 작동하여 우리가 보는 완전한 웹페이지를 구성합니다.

1. **🏗️ HTML(구조)**

- 페이지에 "무엇을 표시할지"를 정의
- 텍스트, 이미지, 버튼, 링크 등의 요소를 배치
- 건물의 **벽과 뼈대**와 유사

**예시**

```html
<h1>Hello!</h1>
<p>This is my first website.</p>
<a href="contact.html">Contact</a>
```

2. **🎨 CSS(스타일)**

- "콘텐츠를 어떻게 표시할지"를 결정
- 글자 크기, 색상, 간격, 배경, 버튼 모양 등을 제어
- HTML에 "옷"과 시각적 스타일을 부여

**예시**

```css
h1 {
  color: #FF7130;   /* Text color */
  font-size: 36px;  /* Font size */
  text-align: center; /* Center alignment */
}

body {
  background-color: #171721; /* Background color */
  color: white; /* Default text color */
}
```

3. **⚙️ JavaScript(JS)(기능)**

- 웹페이지가 사용자와 상호작용할 수 있게 함
- 버튼 클릭, 메뉴 펼치기, 이미지 슬라이드, 양식 제출 등의 동적 효과를 구현
- HTML/CSS가 정적인 뼈대와 외관이라면, JS는 웹페이지를 "살아있게" 만드는 **두뇌**

**예시**

```javascript
function showAlert() {
  alert("The button has been clicked!");
}
```

```html
<button onclick="showAlert()">Click me</button>
```

## 2. 코딩 Agent로 코드 생성하기

**프롬프트 예시**

```
"Home, About, Contact 섹션이 포함된 싱글 페이지 웹사이트의 HTML과 CSS를 작성해 주세요.
색상은 #171721, #FF7130, #FF3C68을 사용해 주세요.
배경은 검은색, 텍스트는 흰색으로 해 주세요."
```

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image12.png)

## 3. 웹사이트 실행하기

초안 코드가 생성되면, Agent가 보통 프로젝트를 자동으로 시작하고 완성된 웹사이트 페이지를 보여 줍니다.

Agent를 다시 시작했거나 웹사이트 화면이 나타나지 않는다면, 다음과 같은 프롬프트를 입력해 보세요:

```
"Please activate the project"
```

Agent가 프로젝트를 다시 시작하고 미리 보기 페이지를 열어, 현재 효과를 확인할 수 있게 해 줍니다.

## 4. 간단한 수정하기

자연어로 초안을 계속 미세 조정할 수 있습니다. 예를 들어:

- "버튼을 좀 더 크게 만들어 주세요."
- "폰트를 좀 더 굵게 해 주세요."

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image13.png)![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image14.png)

## 5. 웹사이트 카피 콘텐츠 수정하기

Agent가 생성한 초안 웹사이트에는 보통 자동으로 생성된 임시 텍스트가 포함되어 있습니다. 실제 시나리오에 더 가깝게 만들려면, 실제 콘텐츠를 미리 준비한 다음 Agent가 교체하도록 할 수 있습니다.

**적용 예시**: AIID 웹사이트의 About 페이지 업데이트

1. About 페이지에 표시하고 싶은 콘텐츠를 먼저 작성합니다. Agent가 이해하기 쉽도록 Markdown 형식으로 저장할 수 있습니다.

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image15.webp)

2. 대화에서 Agent에게 해당 파일의 콘텐츠를 지정된 페이지에 적용하라고 알려 줍니다.

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image16.png)

3. 콘텐츠 적용 후 업데이트된 버전을 확인합니다.

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image17.webp)

## 6. 이미지 삽입하기

특정 이미지(예: 로고, 배경 이미지 등)를 추가하고 싶다면, 먼저 이미지를 프로젝트 폴더에 업로드한 다음 프롬프트에서 페이지의 어느 위치에 이 이미지를 사용할지 설명합니다.

- **예시:**

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image18.png)![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image19.png)![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image20.png)

- **결과:**

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image21.webp)

---

# 6. 디자인과 코드 통합하기

## 1. 디자인 파일과 웹사이트 코드 통합(선택)

디자인 Agent에서 코드 파일을 다운로드한 후, 이를 현재 프로젝트 디렉터리로 이동한 다음 코딩 Agent에게 이 디자인 코드를 기존 프로젝트와 병합하도록 요청할 수 있습니다.

- **예시:**

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image22.png)

- **결과:**

![](../../../../zh-cn/stage-1/appendix-articles/example0-2/images/image23.webp)
---
title: 'Build A Website With Design + Coding Agents'
description: 'From idea to launch: coordinate a design agent to produce visuals, then use a coding agent to turn it into a working website with a reusable workflow.'
---
