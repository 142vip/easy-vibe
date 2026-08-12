---
title: Vibe Coding 결과물을 ModelScope에 게시하기
description: 순수 HTML부터 Vue, React, Vite 빌드 결과물까지 공식 Skill과 Static Studio로 게시하는 전체 수업
---

# Vibe Coding 결과물을 ModelScope에 게시하기

웹페이지가 로컬에서 잘 열리면, 친구나 실제 사용자가 직접 접속할 수 있는 주소를 만들 차례입니다.

서버를 빌리고 도메인, HTTPS, 배포를 직접 설정할 수도 있습니다. 이 수업에서는 운영 부담을 줄이고 페이지에 집중하기 위해 **ModelScope Studio**에 게시합니다.

ModelScope는 Alibaba와 CCF 오픈소스 발전위원회가 함께 시작한 오픈소스 커뮤니티입니다. 20만 개 이상의 오픈소스 모델과 3만 개 이상의 데이터셋뿐 아니라 앱을 보여 주는 **Studio**도 제공합니다. Studio를 사용하면 서버 운영을 먼저 익히지 않아도 무료 공유 주소를 만들 수 있습니다.

> 이 글은 현재 Studio 화면, 공식 Skill, 명령줄 자료를 기준으로 **2026년 8월 11일** 확인했습니다. 버튼 위치는 달라질 수 있지만 “Static Studio 만들기 → 빌드 결과 업로드 → 배포 → Studio 링크 확인” 흐름은 같습니다.

Studio는 Gradio, Streamlit, Docker 외에도 이미 빌드된 웹사이트를 위한 `static` 유형을 지원합니다. 최종 결과가 `index.html`, CSS, JavaScript, 이미지라면 이 유형을 선택합니다.

게시 후 주소는 다음과 비슷합니다.

```text
https://modelscope.cn/studios/사용자이름/Studio이름
```

## 프로젝트에 맞는 게시 방식 고르기

| 프로젝트 | Studio 유형 | 게시 전 준비 |
| --- | --- | --- |
| HTML / CSS / JavaScript | **Static** | 빌드 없이 웹 파일을 준비한다 |
| Vue, React, Vite, Svelte | **Static** | 로컬에서 빌드하고 `dist` 또는 `build`의 내용만 게시한다 |
| Gradio | Gradio | `app.py`와 `requirements.txt`를 준비한다 |
| Streamlit | Streamlit | 진입 파일과 의존성을 준비한다 |
| 사용자 정의 백엔드나 시스템 패키지 필요 | Docker | Dockerfile을 만들고 지정 포트에서 서비스를 실행한다 |

이 장은 앞의 두 가지를 다룹니다. **Vue나 React 소스를 Static 사이트로 그대로 올리지 마세요.** 방문자의 브라우저는 `npm install`과 `npm run build`를 대신 실행할 수 없습니다.

## 권장 방법: 공식 Skill로 게시하기

ModelScope는 [공식 Skills](https://github.com/modelscope/modelscope-skills)를 관리합니다.

| Skill | 역할 | 사용할 때 |
| --- | --- | --- |
| `ms-hub` | 저장소, 모델, 데이터셋, Studio, MCP, Skills Center의 공통 입구 | 처음 연결하거나 일반 Studio 작업을 할 때 |
| `ms-studio-deploy` | 프로젝트 판별, Studio 생성, Git 동기화, 배포, 로그 확인, 장애 진단 | **로컬 웹사이트를 게시하거나 업데이트할 때 우선 사용** |

`ms-studio-deploy`는 루트의 `index.html`을 보고 `static`으로 판별합니다. Static Studio는 `npm run build`를 실행하지 않으므로 프레임워크 프로젝트는 로컬에서 먼저 빌드해야 합니다.

### Skill 설치하기

```bash
python -m pip install -U modelscope
modelscope skills add @ModelScope/ms-hub @ModelScope/ms-studio-deploy
```

`modelscope` 명령에 `skills` 하위 명령이 없다면 공식 설치 스크립트를 사용합니다.

```bash
curl -fsSL https://modelscope.cn/skills/install.sh | bash -s -- @ModelScope/ms-hub
curl -fsSL https://modelscope.cn/skills/install.sh | bash -s -- @ModelScope/ms-studio-deploy
```

Skill은 기본적으로 `~/.agents/skills/`에 설치됩니다. 설치 후 Codex, Cursor, Claude Code 같은 Agent Skills 지원 도구에서 새 세션을 열어 목록을 갱신하세요.

### Skill로 게시하기

공식 [`ms-studio-deploy` 안내](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md)에 따라 세 가지를 준비합니다.

1. `ms-studio-deploy`를 설치하고 Agent 세션을 다시 연다.
2. 게시할 디렉터리를 열고 루트에 `index.html`을 둔다.
3. 컴퓨터에 ModelScope Access Token을 설정한다.

[Access Token 페이지](https://modelscope.cn/my/myaccesstoken)에서 토큰을 받은 뒤 터미널에 설정합니다.

```bash
export MODELSCOPE_API_KEY="내-토큰"
```

순수 HTML은 웹 디렉터리를 바로 엽니다. Vue, React, Vite는 먼저 빌드한 뒤 결과 디렉터리로 이동합니다.

```bash
npm run build
cd dist
```

Vite는 보통 `dist`를 만들고, 다른 도구가 `build`를 만들면 그 폴더를 엽니다. 이제 이 폴더를 Agent Skills 지원 도구에서 엽니다.

#### 가장 짧은 요청

```text
ms-studio-deploy Skill을 사용해서 이 웹사이트를 ModelScope의 Static Studio에 게시해 주세요. 실행되면 주소를 알려 주세요.
```

Skill은 먼저 `index.html`과 로그인 설정을 확인합니다. 새 Studio가 필요하면 이름과 공개 범위를 묻습니다. 첫 게시에서는 비공개가 안전합니다.

조건을 한 번에 전달하려면 다음처럼 말합니다.

```text
ms-studio-deploy Skill을 사용해서 이 디렉터리를 ModelScope 중국 사이트의 Static Studio에 게시해 주세요.
Studio 이름은 my-portfolio로 하고 처음에는 비공개로 설정해 주세요. 배포 후 상태와 로그도 확인해 주세요.
실패하면 로그를 보고 수정한 뒤 다시 배포하고, 동작하는 주소를 보내 주세요.
```

#### AI가 이어서 하는 일

```text
프로젝트 유형 판별 → 중국 사이트 또는 국제 사이트 확인 → 계정 정보 읽기
→ Studio 생성 또는 재사용 → 민감한 파일 검사 → master에 동기화
→ 배포 실행 → 상태와 로그 확인 → 진단과 수정 → 주소 반환
```

처음에는 비공개로 확인하고 정상일 때 공개로 바꿉니다. Static 사이트에는 유료 하드웨어가 필요하지 않습니다. 다른 유형에서 유료 자원이 필요하면 Skill은 먼저 명시적인 동의를 받아야 합니다.

토큰은 API 인증과 Git push에 사용됩니다. 프런트엔드 소스, README, 요청문, 공유 화면에 넣지 마세요.

## 수동 방법: 0단계 — 게시할 사이트 준비하기

Skill 방식이 더 간단하지만, 아래 수동 과정은 Studio 화면을 이해하거나 Agent 도구를 쓸 수 없을 때 도움이 됩니다.

### 경우 A: 순수 HTML

`index.html`은 게시할 내용의 루트에 있어야 합니다.

```text
my-site/
├── index.html
├── styles.css
├── app.js
└── images/
    └── cover.jpg
```

게시 전에 로컬 HTTP 서버로 확인합니다.

```bash
cd my-site
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000`을 엽니다. `index.html`을 더블클릭하는 것만으로는 부족합니다. `file://`과 HTTP는 모듈, CORS, 경로를 다르게 처리합니다.

### 경우 B: Vue, React, Vite 등

```bash
npm install
npm run build
```

| 도구 | 일반적인 결과 디렉터리 |
| --- | --- |
| Vite / Vue + Vite / React + Vite | `dist/` |
| Create React App | `build/` |
| Vue CLI | `dist/` |

결과 디렉터리의 **내용**을 게시해 Studio 루트에 `index.html`이 바로 나타나게 합니다.

```text
맞음: index.html
틀림: dist/index.html
```

배포 후 CSS, JavaScript, 이미지가 404라면 Vite 자원 기준 경로를 상대 경로로 바꿉니다.

```js
// vite.config.js / vite.config.ts
export default {
  base: './'
}
```

다시 빌드하세요. 정적 호스트가 모든 경로를 `index.html`로 되돌리지 않을 수 있으므로 SPA에서는 `/#/about` 같은 Hash 라우터도 사용할 수 있습니다.

## 수동 방법: 1단계 — Studio 열고 로그인하기

[ModelScope Studio](https://modelscope.cn/studios)를 엽니다. 페이지 위쪽에 생성, 구축, 게시, 공유 순서가 보입니다.

![생성부터 공유까지 표시한 ModelScope Studio 홈](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/01-studios-home.jpg)

생성 버튼이나 [Studio 생성 페이지](https://modelscope.cn/studios/create)를 엽니다. 중국 사이트 `modelscope.cn`과 국제 사이트 `modelscope.ai`는 계정, 토큰, 콘텐츠를 공유하지 않습니다.

## 수동 방법: 2단계 — Studio 기본 정보 입력하기

![소유자, 이름, 라이선스, 공개 범위, 설명을 입력하는 Studio 생성 화면](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/02-create-studio.jpg)

1. **소유자 또는 조직:** 주소의 소유자 부분을 정한다.
2. **Studio 이름:** `my-portfolio`처럼 소문자, 숫자, 하이픈을 쓴다.
3. **표시 이름과 설명:** 방문자가 이해할 수 있게 쓴다.
4. **공개 범위:** 처음에는 비공개, 검사 후 공개로 바꾼다.
5. **라이선스:** 프로젝트에 맞게 고른다.

내용을 확인해 생성하고 상세 페이지가 열릴 때까지 기다립니다.

## 수동 방법: 3단계 — 웹 파일 올리기

실행 중인 Static Studio에서는 `index.html`과 `README.md`가 저장소 루트에 보입니다.

![루트에 index.html과 README.md가 있는 Static Studio 파일 화면](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/04-studio-files.jpg)

**Files** 페이지에 `index.html`, CSS, JavaScript, 이미지를 올립니다. 파일을 `dist`, `build`, 프로젝트 폴더 안에 한 번 더 감싸지 마세요.

파일이 적으면 수동 업로드로 충분합니다. 파일이나 업데이트가 많다면 `ms-studio-deploy`로 Git 동기화를 수행합니다.

## 수동 방법: 4단계 — 배포 설정에서 Static 선택하기

파일 업로드를 마치면 Studio의 배포 설정을 열고 SDK 유형으로 **Static**을 선택합니다. Static은 준비된 HTML 사이트에 적합하며, 같은 영역에서 Gradio, Streamlit, Docker도 선택할 수 있습니다.

![배포 설정의 SDK 항목에서 Static을 선택하는 화면](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/03-select-static.jpg)

저장소 루트에 `index.html`이 있는지 다시 확인하고 배포 설정을 저장합니다.

> 데이터베이스, 비밀 API 키, 서버 계산이 필요하면 순수 정적 사이트가 아닙니다. Gradio, Streamlit, Docker 또는 별도 백엔드를 사용하세요. 프런트엔드 JavaScript에 쓴 키는 비밀로 남지 않습니다.

## 수동 방법: 5단계 — 배포를 기다리고 검사하기

배포 설정을 저장하면 보통 자동으로 배포됩니다. 시작하지 않으면 배포, 재시작, 다시 실행을 선택합니다. 실행 중 상태가 되면 다음 형태의 주소를 엽니다.

```text
https://modelscope.cn/studios/사용자이름/Studio이름
```

- 홈이 열리는가?
- CSS, JavaScript, 이미지가 보이는가?
- 콘솔에 404, CORS, JavaScript 오류가 없는가?
- 모바일 너비에서도 사용할 수 있는가?
- 공개 Studio를 로그아웃한 창에서도 열 수 있는가?

비공개 Studio는 정상 동작을 확인한 뒤 공개로 변경하고 로그아웃 상태에서 다시 검사합니다.

## 수동 방법: 6단계 — 게시한 사이트 업데이트하기

소스를 수정하면 로컬 테스트와 재빌드를 수행합니다. **Files** 페이지에서 이전 파일을 새로운 `dist` 또는 `build` 내용으로 바꾼 뒤 다시 배포합니다.

```text
소스 수정 → 로컬 테스트 → 다시 빌드 → Studio 파일 교체
→ 다시 배포 → 최종 주소 검사
```

`node_modules`, 개발 설정, 전체 소스 프로젝트는 올리지 않습니다. 업데이트가 잦아지면 Skill 방식으로 바꾸세요.

## 문제 해결에도 Skill 사용하기

<ModelScopeTroubleshooter />

## 자료

- [ModelScope Studio](https://modelscope.cn/studios) (화면과 이미지는 2026-08-11 확인)
- [ModelScope 핵심 개발자 모임](https://community.modelscope.cn/683562c6870cef7360622f7f.html)
- [공식 `ms-hub` 안내](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-hub/SKILL.md)
- [공식 `ms-studio-deploy` Skill](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md)
- [ModelScope Hub 클라이언트](https://github.com/modelscope/modelscope_hub)
- [공개 Static Studio 예시](https://modelscope.cn/studios/studio-demo-station/funasr-demo-static-multiple/summary)
