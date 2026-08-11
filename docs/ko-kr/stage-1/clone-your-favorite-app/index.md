---
title: '스크린샷으로 복제하기: 첫 모방 연습'
description: '제품 스크린샷 한 장을 실제로 열고 조작할 수 있는 웹페이지나 미니게임으로 만드는 수업입니다.'
---

# 스크린샷으로 복제하기: 첫 모방 연습

지난 수업에서는 한 문장으로 AI에게 프로그램을 부탁했습니다. 이번에는 더 눈에 잘 보이는 출발점을 사용합니다. **마음에 드는 스크린샷을 고르고, AI가 그 화면을 참고해 만들게 합니다.**

이미지에는 색상, 간격, 버튼, 배치가 이미 보입니다. 우리는 어떤 동작이 있는 결과물을 원하는지만 설명하면 됩니다.

## 1. 작은 목표 하나 고르기

처음에는 화면 하나만 만듭니다. 제품 소개 페이지, SaaS 대시보드, 또는 한 가지 조작만 있는 미니게임 중에서 고르세요. 나중에 비교할 수 있도록 원본 이미지도 보관합니다.

## 2. 첫 웹페이지를 함께 만들기

수업에서는 Framer 화면을 참고했습니다. 내비게이션, 큰 제목, 보라색 산, 버튼이 한 장에 잘 보입니다.

![Framer 참고 화면](../../../zh-cn/stage-1/clone-your-favorite-app/images/framer-official-interface.jpg)

_출처: [Framer Website Builder](https://www.framer.com/solutions/website-builder/)_

빈 폴더를 만들고 Trae에서 연 뒤, 이미지를 채팅창에 끌어다 놓습니다. 다음처럼 말합니다.

```text
이 이미지를 참고해서 웹페이지를 만들어 주세요. 완성되면 열어 주세요.
```

Trae가 파일을 만들고 실행할 때까지 기다립니다. 아래는 수업에서 실제로 생성한 결과입니다.

![참고 이미지로 생성해 실행한 웹페이지](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-wishlabs.gif)

아직 코드를 읽지 않아도 됩니다. 페이지가 열리는지, 주요 내용이 보이는지, 원본 구조와 비슷한지만 확인합니다.

제목이 작다면 한 가지만 고칩니다.

```text
가운데 제목을 조금 더 크게 해 주세요.
```

## 3. 내 이미지로 다시 만들기

새 빈 폴더에 직접 고른 이미지를 넣고 다음처럼 요청합니다.

```text
이 이미지를 참고해서 웹페이지를 만들고, 완성되면 열어 주세요.
```

스타일만 참고하려면 한 문장을 더합니다.

```text
디자인은 참고하되 이름과 내용은 새롭게 바꿔 주세요.
```

첫 화면이 나오면 주요 버튼을 눌러 보고, 창을 좁혀도 레이아웃이 무너지지 않는지 확인합니다.

## 4. 대시보드와 게임도 같은 방식으로 만들기

Linear 대시보드는 왼쪽 내비게이션과 오른쪽 카드·차트가 분명해 구조 연습에 좋습니다.

![Linear Dashboard 참고 화면](../../../zh-cn/stage-1/clone-your-favorite-app/images/linear-official-dashboard.png)

_출처: [Linear Dashboards](https://linear.app/docs/dashboards)_

```text
이런 대시보드를 만들어 주세요. 데이터는 예시로 넣어도 됩니다.
```

![수업에서 생성해 실행한 대시보드](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-linear-dashboard.gif)

Minecraft 화면으로 미니게임도 만들 수 있습니다.

![Minecraft Creative Mode 참고 화면](../../../zh-cn/stage-1/clone-your-favorite-app/images/minecraft-official-creative-mode.png)

_출처: [Microsoft Learn의 Minecraft 예시](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/108)_

```text
이런 블록 게임을 만들어 주세요. 캐릭터가 움직이고 블록을 놓을 수 있게 해 주세요.
```

![수업에서 생성한 2D 블록 게임](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-block-game.gif)

1인칭 공간을 원한다면 “3D”라고 분명히 적습니다.

```text
이런 3D 블록 게임을 만들어 주세요. 걷기, 시점 회전, 블록 놓기를 넣어 주세요.
```

![수업에서 생성한 3D 블록 게임](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-3d-block-game.gif)

## 5. 한 번에 한 문제만 고치기

첫 버전이 완벽하지 않아도 괜찮습니다. 가장 눈에 띄는 문제 하나를 평범한 말로 설명합니다.

```text
위쪽 카드가 너무 높아요. 조금 낮춰 주세요.
```

```text
이 버튼을 눌러도 반응이 없어요. 고쳐 주세요.
```

수정할 때마다 페이지를 다시 열고 직접 조작합니다. 관련 없는 요구를 한 메시지에 여러 개 넣지 않습니다.

## 6. 제출 전 확인

- 새로고침해도 페이지가 열린다.
- 다른 사람이 웹사이트, 대시보드, 게임 중 무엇인지 알 수 있다.
- 주요 버튼이나 게임 조작이 동작한다.
- 창을 좁혀도 글과 이미지가 심하게 겹치지 않는다.

마지막으로 참고 화면과 결과 화면을 나란히 놓고, 직접 고친 부분 하나를 설명하세요. 순서는 간단합니다. 이미지 선택, AI에게 전달, 한 문장으로 요청, 눈에 보이는 문제를 하나씩 수정합니다.
