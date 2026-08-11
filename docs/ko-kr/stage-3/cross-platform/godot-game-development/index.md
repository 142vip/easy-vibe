---
title: 'Godot로 횡스크롤·픽셀·3D 게임 만들기'
description: '출시된 작품과 실제 실행한 세 가지 작은 프로토타입으로 Godot의 기본을 배웁니다.'
---

# Godot로 횡스크롤·픽셀·3D 게임 만들기

Godot는 무료 오픈 소스 게임 엔진입니다. 장면, 물리, 애니메이션, 오디오, 입력, 스크립트, 내보내기를 한 도구에서 다룹니다. 여기서는 완성작인 척하지 않고 2D 플랫폼, 픽셀 수집, 3D 그레이박스를 실제로 실행합니다.

## 1. 네 가지 기본 용어

노드는 스프라이트·카메라·충돌·조명처럼 한 가지 일을 하는 객체, 장면은 재사용 가능한 노드 트리, 스크립트는 행동, GDScript는 Godot의 기본 스크립트 언어입니다.

![Godot 편집기의 장면 트리](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-editor-platformer.png)

## 2. 2D 플랫폼 게임

Primal Light는 플랫폼과 위험, 목적지를 명확한 실루엣으로 보여 주는 출시작입니다.

![Primal Light 공식 이미지](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-primal-light.webp)

> 플레이어, 바닥, 플랫폼 세 개, 눈에 띄는 목표가 있는 2D 레벨을 단순 도형으로 만들어 주세요.

> 좌우 이동과 점프를 추가하고 공중에서 다시 점프하지 못하게 해 주세요.

![실제로 실행한 Skyline Courier](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-platformer.png)

## 3. 픽셀 수집 게임

Dome Keeper는 작은 화면에서 자원과 목표를 읽기 쉽게 배치합니다.

![Dome Keeper 공식 이미지](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-dome-keeper.webp)

> 320 × 180 픽셀 장면에 플레이어, 숲, 수집물 세 개, 카운터를 추가해 주세요.

![실제로 실행한 Lantern Woods](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-pixel.png)

정수 배율을 사용해 창과 전체 화면에서 픽셀이 흐려지지 않는지 확인합니다.

## 4. 3D 그레이박스

Wrought Flesh는 공간 윤곽, 조명, 목표 안내를 참고할 수 있는 Godot 출시작입니다. 그레이박스는 정식 모델 전에 상자와 평면으로 규모와 이동을 시험하는 단계입니다.

![Wrought Flesh 공식 이미지](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-wrought-flesh.webp)

> 바닥, 벽, 플레이어, 카메라, 빛나는 출구가 있는 작은 3D 그레이박스를 만들어 주세요.

![실제로 실행한 Signal Garden](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-3d.png)

## 5. 한 번에 한 가지씩 수정한다

> 플레이어 이동만 추가하고 레벨은 바꾸지 마세요.

> 이 오류만 고쳐 주세요: 【오류 붙여넣기】. 다시 확인하는 방법도 알려 주세요.

게임 루프가 작동한 뒤 이미지, 모델, 소리를 하나씩 교체하고 출처와 라이선스를 기록합니다.

## 6. 내보내기는 별도 작업이다

편집기 실행은 개발판 확인입니다. 같은 버전의 Export Template을 설치하고 대상 프리셋을 만듭니다. 데스크톱은 Godot가 없는 깨끗한 PC, Web은 로컬 서버나 HTTPS, Android·iOS는 SDK·서명·권한·실기기에서 시험합니다.

세 임시 프로젝트는 macOS의 Godot 4.7.1에서 실제로 실행했습니다. Windows, Linux, Web, Android, iOS, 콘솔 내보내기는 완료로 표시하지 않았습니다.
