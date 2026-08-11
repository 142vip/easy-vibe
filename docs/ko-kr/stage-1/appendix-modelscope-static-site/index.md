---
title: ModelScope에 웹사이트 게시하기
description: ModelScope Studio와 공식 배포 Skill로 HTML, Vue, React, Vite 정적 사이트를 게시합니다.
---

# ModelScope에 웹사이트 게시하기

로컬에서 페이지가 잘 열리면, 이제 다른 사람이 접속할 수 있는 링크가 필요합니다. 이 부록에서는 서버를 직접 설정하는 대신 **ModelScope Studio**에 사이트를 게시합니다.

## 1. 무엇을 게시할지 확인하기

| 프로젝트 | Studio 유형 | 준비할 내용 |
| --- | --- | --- |
| HTML, CSS, JavaScript | Static | 루트에 `index.html`이 있는 웹 파일 |
| Vue, React, Vite, Svelte | Static | 빌드 후 `dist` 또는 `build` 안의 파일 |
| Gradio, Streamlit | 해당 유형 | Python 진입 파일과 의존성 |
| 백엔드나 별도 시스템 패키지 필요 | Docker | Dockerfile과 실행 가능한 서비스 |

프레임워크 프로젝트는 소스 폴더가 아니라 **빌드 결과물**을 게시합니다.

## 2. 공식 배포 Skill 사용하기

ModelScope의 [공식 Skills](https://github.com/modelscope/modelscope-skills)에 있는 `ms-studio-deploy`는 프로젝트 확인, Studio 생성, 파일 동기화, 배포, 로그 확인을 맡습니다.

```bash
python -m pip install -U modelscope
modelscope skills add @ModelScope/ms-hub @ModelScope/ms-studio-deploy
```

[Access Token 페이지](https://modelscope.cn/my/myaccesstoken)에서 토큰을 받아 로컬에만 보관합니다. 웹 코드, README, 공유 이미지에는 넣지 않습니다.

Vite 프로젝트라면 먼저 빌드합니다.

```bash
npm run build
cd dist
```

출력 폴더를 AI 도구에서 열고 다음처럼 요청합니다.

```text
ms-studio-deploy Skill을 사용해서 이 폴더를 ModelScope의 Static Studio에 게시해 주세요. 성공하면 링크를 알려 주세요.
```

## 3. 웹 화면에서 직접 게시하기

[ModelScope Studio](https://modelscope.cn/studios)를 열고 로그인합니다.

![ModelScope Studio 홈 화면](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/01-studios-home.jpg)

[Studio 만들기](https://modelscope.cn/studios/create)에서 소유자, 이름, 설명, 공개 범위를 입력합니다.

![Studio 생성 양식](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/02-create-studio.jpg)

SDK 유형은 **Static**을 선택합니다.

![Static 유형 선택](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/03-select-static.jpg)

생성 후 파일 페이지에서 `index.html`, CSS, JavaScript, 이미지를 올립니다. `index.html`은 저장소 루트에 바로 있어야 하며 `dist` 폴더 안에 남겨 두면 안 됩니다.

![Static Studio 파일 화면](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/04-studio-files.jpg)

저장하고 배포가 끝날 때까지 기다립니다. 최종 링크에서 홈페이지, 스타일, 이미지, 모바일 너비, 브라우저 콘솔을 확인합니다. 공개 Studio는 로그아웃한 창에서도 열어 봅니다.

## 4. 업데이트와 문제 해결

소스를 수정하면 로컬 테스트, 재빌드, 게시 파일 교체, 재배포 순서로 진행합니다.

- 스타일이나 이미지가 없다: 경로와 Vite의 `base`를 확인한다.
- 하위 경로 새로고침이 404다: 정적 사이트에서는 Hash 라우터를 고려한다.
- 파일 목록만 보인다: 루트의 `index.html`을 확인한다.
- 비밀 API 키가 필요하다: 프런트엔드에 넣지 말고 백엔드를 사용한다.

공식 자료: [ModelScope Studio](https://modelscope.cn/studios), [ModelScope Skills](https://github.com/modelscope/modelscope-skills), [`ms-studio-deploy`](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md).
