# 패키지 매니저 원리

> 💡 **학습 가이드**: 코드를 작성할 때 바퀴를 처음부터 만들 필요가 없습니다 — 99%의 기능은 이미 누군가가 작성하여 인터넷에 공개되어 있습니다. **패키지 관리자**는 이러한 "기성 부품"을 찾고, 다운로드하고, 관리하는 도구입니다. 이 장은 하나의 핵심 질문을 중심으로 전개됩니다: **코드 의존성을 재현 가능하고, 협업 가능하며, 유지보수 가능하게 만드는 방법은?**

---

## 0. 패키지 관리자를 반드시 사용하게 원인 분석

HTTP 요청을 보낼 수 있는 Node.js 프로그램을 작성한다고 상상해 보세요. 두 가지 방법이 있습니다:

- **방법 A (수동)**: TCP 연결, HTTP 프로토콜 파싱, 리디렉션 처리, 타임아웃 메커니즘을 직접 구현... 수천 줄의 코드를 작성하고 몇 달간 디버깅해야 할 것입니다.
- **방법 B (패키지 관리자)**: `npm install axios`, 10초 만에 한 줄의 코드로 완료.

패키지 관리자는 본질적으로 **코드의 "앱 스토어"**입니다. 다음을 도와줍니다:

1. 중앙 저장소(Registry)에서 다른 사람이 공개한 라이브러리 찾기
2. 프로젝트에 자동으로 다운로드 및 설치
3. 그 라이브러리가 의존하는 다른 라이브러리(의존성의 의존성) 처리
4. 사용 중인 정확한 버전을 기록하여 팀 협업 시 문제 방지

---

## 1. 각 언어/시스템 생태계의 패키지 관리자 개요

다양한 프로그래밍 언어와 운영 체제에는 각자의 생태계 도구 체인이 있지만, 기본 논리는 완전히 동일합니다.

👇 **직접 해보기**: 익숙한 생태계를 선택하여 주류 패키지 관리 도구를 탐색해 보세요.

<PackageManagerOverviewDemo />

### 1.1 패키지는 어디서 다운로드하나요 — Registry (등록소)

각 생태계 배후에는 다운로드 가능한 모든 패키지를 저장하는 중앙 저장소가 있습니다:

| 생태계 | 등록소 | 패키지 수 |
| :--- | :--- | :--- |
| JavaScript | [npmjs.com](https://npmjs.com) | 200만+ |
| Python | [pypi.org](https://pypi.org) | 50만+ |
| Rust | [crates.io](https://crates.io) | 15만+ |
| Go | [pkg.go.dev](https://pkg.go.dev) | 50만+ |
| macOS/Linux 도구 | [formulae.brew.sh](https://formulae.brew.sh) | 7000+ |
| Windows 소프트웨어 | [winget.run](https://winget.run) / [chocolatey.org](https://chocolatey.org) | 수만 개 |

### 1.2 JavaScript 3대 비교: npm vs yarn vs pnpm

기능은 비슷하지만, 주요 차이는 **속도와 디스크 사용량**에 있습니다:

```text
디스크 사용량: pnpm(하드 링크 공유) < yarn PnP(제로 node_modules) < npm(전체 복사)
설치 속도: pnpm ≈ yarn > npm
사용 편의성: npm(가장 범용) > pnpm(신규 프로젝트 권장) > yarn(일부 팀)
```

**권장**: 새 프로젝트는 `pnpm`을 사용하고, 기존 프로젝트는 기존 도구를 유지하며, 자유롭게 전환하지 마세요.

### 1.3 Windows 3대 비교: winget vs Chocolatey vs Scoop

| | winget | Chocolatey | Scoop |
| :--- | :--- | :--- | :--- |
| **공식 지원** | Microsoft 공식 | 서드파티 | 서드파티 |
| **관리자 권한 필요** | 일부 필요 | 예 | **불필요** |
| **적합한 시나리오** | 일상 소프트웨어 설치 | 기업 대량 배포 | 개발 도구 관리 |
| **패키지 수** | 많고 빠르게 증가 | 가장 많음(10000+)| 개발 도구에 집중 |

**권장**: 일상적으로는 `winget`, 개발 도구는 `scoop`, 기업 자동화는 `Chocolatey`.

---

## 2. 패키지 설치 — 내부 작동 원리

`npm install axios`를 입력하면 명령줄이 몇 초간 조용해졌다가 완료됩니다. 그 몇 초 동안 과연 무슨 일이 일어났을까요?

👇 **직접 해보기**: 패키지를 선택하고 "실행"을 클릭하여 설치의 전체 과정을 관찰하세요.

<PackageInstallDemo />

### 2.1 네 단계 상세 설명

**① 의존성 해결 (Resolve)**

패키지 관리자가 먼저 설치할 것을 "이해"합니다. `axios`를 예로 들면, 이것 자체가 `follow-redirects`, `form-data` 등의 패키지에 의존하며, 이것들도 모두 설치되어야 합니다. 이 과정을 **의존성 트리 구성**이라고 합니다.

**② 다운로드 (Fetch)**

Registry에서 필요한 모든 패키지(`.tgz` 형식의 압축 파일)를 다운로드합니다. 똑똑한 패키지 관리자는:
- 여러 패키지를 병렬로 다운로드하며 하나씩 기다리지 않습니다
- 먼저 로컬 캐시를 확인하여, 적중하면 네트워크를 사용하지 않습니다

**③ 연결 (Link)**

다운로드한 패키지의 압축을 풀어 `node_modules/` 디렉토리에 배치하고 참조 관계를 설정합니다.

**④ 락 파일 작성 (Lockfile)**

이번 설치의 **정확한 버전 번호**를 `package-lock.json`(또는 `yarn.lock` / `pnpm-lock.yaml`)에 기록합니다.

### 2.2 가장 많이 사용하는 명령어 빠른 참조

```bash
# ── JavaScript (npm) ──────────────────────────────────
npm install              # package.json에 따라 모든 의존성 설치
npm install axios        # 새 패키지 설치 (프로덕션 의존성)
npm install -D jest      # 개발 의존성 설치 (개발 시에만 사용)
npm install -g tsx       # 전역 설치 (어느 디렉토리에서도 사용 가능)
npm uninstall axios      # 패키지 제거
npm update               # 모든 패키지를 호환되는 최신 버전으로 업그레이드
npm run build            # package.json scripts의 스크립트 실행
npx create-react-app .   # 임시 실행, 프로젝트에 설치하지 않음

# ── Python (pip) ──────────────────────────────────────
pip install requests           # 패키지 설치
pip install requests==2.28.0   # 지정 버전 설치
pip freeze > requirements.txt  # 현재 의존성 목록 내보내기
pip install -r requirements.txt # 목록에 따라 설치

# ── Rust (cargo) ──────────────────────────────────────
cargo add serde    # 의존성 추가 (Cargo.toml 자동 업데이트)
cargo build        # 프로젝트 빌드
cargo test         # 테스트 실행
cargo run          # 프로젝트 실행

# ── Go (go mod) ───────────────────────────────────────
go get github.com/gin-gonic/gin  # 의존성 추가
go mod tidy                      # 의존성 정리 (불필요한 것 삭제, 누락된 것 보충)
go build ./...                   # 빌드

# ── Windows (winget) ──────────────────────────────────
winget install Git.Git           # 소프트웨어 설치
winget upgrade --all             # 설치된 모든 소프트웨어 업데이트
```

### 2.3 npm scripts 개요
`package.json`에는 `scripts` 필드가 있으며, 이것은 npm에 내장된 **작업 실행기**입니다:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "jest",
    "lint": "eslint src/"
  }
}
```

실행 방법: `npm run dev`, `npm run build`. 이렇게 하면:
- **통합 진입점**: 팀원이 하위 도구의 구체적인 명령어를 기억할 필요 없음
- **자동 환경 설정**: 실행 시 `node_modules/.bin`이 자동으로 PATH에 추가되어 로컬 설치된 도구를 직접 사용 가능

---

## 3. 전역 설치 vs 로컬 설치

초보자가 가장 혼란스러워하는 개념 중 하나입니다.

### 3.1 두 가지의 차이

```bash
npm install axios        # 로컬 설치: ./node_modules/에 설치, 현재 프로젝트만 사용 가능
npm install -g typescript  # 전역 설치: 시스템 디렉토리에 설치, 모든 프로젝트/디렉토리에서 사용 가능
```

| | 로컬 설치 | 전역 설치 |
| :--- | :--- | :--- |
| **저장 위치** | `./node_modules/` | 시스템 수준 디렉토리 (예: `/usr/local/lib/`) |
| **적합한 것** | 프로젝트 의존 라이브러리 (axios, vue, react) | 명령줄 도구 (tsc, eslint, create-react-app) |
| **버전 격리** | 각 프로젝트 독립 버전 ✅ | 전체 시스템에서 하나의 버전 공유 ⚠️ |
| **팀 일관성** | 락 파일이 일관성 보장 ✅ | 개인마다 버전 다를 수 있음 ⚠️ |

### 3.2 황금 규칙

> **라이브러리 의존성(axios, lodash, vue)은 항상 로컬 설치;
> 명령줄 도구(tsc, eslint)는 로컬 설치를 우선하고 `npx`로 호출.**

**왜 명령줄 도구도 로컬 설치를 권장하나요?**

`eslint@8`을 전역에 설치했는데, 프로젝트 A에서는 `eslint@9`의 새로운 규칙이 필요하다고 가정해 봅시다. 전역과 프로젝트 간에 반복적으로 전환해야 합니다. `eslint`를 로컬에 설치하고 `npx eslint .`로 호출하면, 각 프로젝트가 자체 버전을 독립적으로 설정할 수 있습니다.

### 3.3 npx — 임시 실행, 환경 오염 없이

`npx`는 npm에 내장된 도구 실행기로, 패키지를 **설치하지 않고 직접 실행**할 수 있게 합니다:

```bash
# create-vue를 설치하지 않고 직접 실행하여 프로젝트 초기화
npx create-vue my-project

# prettier를 설치하지 않고 직접 파일 포매팅
npx prettier --write src/

# 지정 버전 강제 사용 (이미 설치된 것 무시)
npx typescript@5.4 tsc --version
```

Python의 `uvx`, Rust의 `cargo run`도 비슷한 "임시 실행" 기능을 제공합니다:

```bash
uvx ruff check .       # Python: ruff 검사기 임시 실행
cargo install ripgrep  # Rust: 전역에 설치하여 시스템 명령어 rg로 변환
```

---

## 4. 버전 번호의 비밀 — 시맨틱 버전닝

`package.json`에서 다음과 같은 내용을 볼 수 있습니다:

```json
{
  "dependencies": {
    "axios": "^1.6.8",
    "typescript": "~5.4.0"
  }
}
```

여기서 `^`와 `~`는 무엇을 의미할까요?

👇 **직접 해보기**: 버전 번호의 각 부분에 마우스를 올려 의미를 이해하고, 범위 기호를 클릭하여 어떤 버전이 수용되는지 확인하세요.

<DependencyTreeDemo />

### 4.1 버전을 완전히 고정 제한 사유

| 방식 | 장점 | 단점 |
| :--- | :--- | :--- |
| `"axios": "1.6.8"` (정확히 고정) | 완전히 예측 가능 | 보안 패치가 자동 업데이트 불가 |
| `"axios": "^1.6.8"` (호환 범위, 권장) | 자동으로 버그 수정과 새 기능 획득 | 극히 드문 경우 약간의 비호환성 유발 가능 |
| `"axios": "*"` (임의 버전) | 항상 최신 | 메이저 버전 업그레이드가 코드를 완전히 손상시킬 수 있음 |

**모범 사례**: `^`로 범위를 선언하고 락 파일으로 실제 버전을 고정하는 것, 두 가지를 함께 사용하세요.

### 4.2 의존성 지옥이 개요
50개 패키지에 의존하고, 각 패키지가 또 여러 패키지에 의존하면 "의존성 트리"는 수백 개의 노드를 가질 수 있습니다. 의존하는 두 패키지가 **같은 라이브러리의 호환되지 않는 버전**을 필요로 하면 "의존성 충돌"이 발생합니다.

각 생태계의 해결책:
- **npm v3+**: 같은 메이저 버전은 최상위로 끌어올려 공유, 다른 메이저 버전은 각각 설치
- **pnpm**: 하드 링크 + 엄격한 격리로 "유령 의존성"(선언하지 않았지만 사용할 수 있는 패키지)을 근본적으로 방지
- **cargo (Rust)**: 언어 수준에서 각 패키지가 같은 버전에만 의존하도록 강제, 충돌 완전 차단
- **go mod (Go)**: 최소 버전 선택(MVS) 전략, 모든 제약을 만족하는 가장 낮은 버전 선택

---

## 5. 락 파일 — 팀 협업의 초석

### 5.1 락 파일 도입 동기
`package.json`에 `"axios": "^1.6.0"`이라고 적혀 있다고 가정해 봅시다:

- 오늘 설치 → `1.6.8`이 설치됨
- 팀원이 내일 설치 → `1.7.0`이 설치될 수 있음 (어젯밧에 방금 공개)
- CI 서버가 다음 주에 → `1.7.1`이 설치될 수 있음

같은 코드인데 세 사람이 다른 결과를 얻습니다. **락 파일**은 각 패키지의 정확한 버전을 기록하여, 모든 사람이 이에 따라 설치하면 결과가 완전히 동일해집니다.

| 시나리오 | 명령어 | 동작 |
| :--- | :--- | :--- |
| 개발 환경 동기화 | `npm install` | 락 파일을 참조하여 설치, 버전 업그레이드 안 함 |
| CI / 프로덕션 배포 | `npm ci` | 락 파일에 **엄격히** 따라 설치, 차이가 있으면 바로 오류 발생 |
| 적극적 버전 업그레이드 | `npm update` | 허용 범위 내에서 업그레이드, 락 파일도 업데이트 |

### 5.2 락 파일 커밋 여부 기준

**애플리케이션은 반드시 커밋, npm에 공개하는 라이브러리는 커밋하지 않아도 됩니다.**

- ✅ **웹 앱, 백엔드 서비스**: 반드시 커밋, 배포 환경과 개발 환경이 완전히 동일하게 보장
- ❌ **npm에 공개하는 라이브러리**: 보통 커밋하지 않음, 라이브러리 사용자에게 자체 락 파일이 있음
- ✅ **Python 프로젝트**: `requirements.txt` 자체가 락 파일 역할, 커밋해야 함
- ✅ **Go 프로젝트**: `go.sum`은 반드시 커밋, 무결성 검증에 사용

---

## 6. Python 가상 환경

Python에는 특별히 주의해야 할 개념이 있습니다: **가상 환경(venv)**.

**왜 필요한가?**

Python은 기본적으로 **전역**에 패키지를 설치합니다. 프로젝트 A에서는 `requests==2.28`이 필요하고, 프로젝트 B에서는 `requests==2.31`이 필요하면 둘이 충돌합니다.

**해결책**: 각 프로젝트마다 독립적인 가상 환경을 만들어 서로 간섭하지 않게 합니다.

```bash
# 1. 가상 환경 생성 (프로젝트 루트에서 실행)
python -m venv .venv

# 2. 가상 환경 활성화
source .venv/bin/activate        # macOS / Linux
.venv\Scripts\activate           # Windows (명령 프롬프트 CMD)
.venv\Scripts\Activate.ps1       # Windows (PowerShell)

# 3. 활성화 후, pip install은 현재 가상 환경에만 영향, 전역 오염 없음
pip install requests

# 4. 가상 환경 종료
deactivate
```

> ⚠️ **Windows 일반적인 문제**: PowerShell은 기본적으로 스크립트 실행을 금지하므로 먼저 다음을 실행해야 합니다:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

**현대적 대안**:
- `conda create -n myproject python=3.11` — Python 버전까지 함께 관리
- `uv venv && source .venv/bin/activate` — Rust로 작성되어 생성 속도가 매우 빠름

**`.venv`를 Git에 커밋해야 하나요?**

하지 마세요! `.venv`는 로컬에서 생성된 것으로 `.gitignore`에 추가해야 합니다. `requirements.txt`나 `pyproject.toml`로 의존성을 기술하세요.

---

## 7. 자주 묻는 질문 빠른 참조

**Q: `node_modules`를 Git에 커밋해야 하나요?**

하지 마세요! 보통 수백 MB이며 `.gitignore`에 추가해야 합니다. `package-lock.json`이 있으면 누구나 `npm install`로 빠르게 재구성할 수 있습니다.

**Q: 설치 실패 / 이상한 오류가 나오면?**

```bash
# 캐시 비우기, 이전 설치 삭제, 다시 시작
npm cache clean --force
rm -rf node_modules package-lock.json   # macOS/Linux
rmdir /s /q node_modules && del package-lock.json  # Windows CMD
npm install
```

**Q: 설치 속도가 너무 느린가요?**

```bash
# 국내 미러로 전환 (.npmrc 파일에 작성 권장, 전역 오염 방지)
echo "registry=https://registry.npmmirror.com" > .npmrc

# pip도 미러 설정 가능
pip install requests -i https://pypi.tuna.tsinghua.edu.cn/simple
```

**Q: 패키지에 보안 취약점이 있으면?**

```bash
npm audit          # 알려진 취약점 스캔
npm audit fix      # 호환되는 취약점 자동 수정
npm audit fix --force  # 강제 업그레이드 (파괴적일 수 있으니 신중하게 사용)
```

**Q: 어떤 패키지가 신뢰할 만한지 어떻게 알 수 있나요?**

[npmjs.com](https://npmjs.com) 또는 [bundlephobia.com](https://bundlephobia.com)에서 확인:
- 주간 다운로드 수 (높을수록 신뢰 가능)
- 마지막 업데이트 날짜 (2년 이상 업데이트 없으면 주의)
- 의존성 수 (많을수록 문제 발생 가능성 증가)
- GitHub Stars 및 Issues 활동도

**Q: Windows에서 winget으로 설치한 소프트웨어는 어디에 있나요?**

winget은 기본적으로 시스템 디렉토리(관리자 권한 필요) 또는 `%LOCALAPPDATA%\Microsoft\WindowsApps`에 설치합니다. Scoop으로 설치한 소프트웨어는 `%USERPROFILE%\scoop\apps\`에 통합되어 관리와 마이그레이션이 편리합니다.

---

## 8. 용어 대조표

| 영문 용어 | 한국어 대조 | 설명 |
| :--- | :--- | :--- |
| **Package** | 패키지 / 라이브러리 | 다른 사람이 작성하여 공개한 코드 모듈 |
| **Registry** | 등록소 / 저장소 | 모든 패키지의 중앙 저장 서버 (예: npmjs.com) |
| **Dependency** | 의존성 | 프로젝트 실행에 필요한 다른 패키지 |
| **devDependency** | 개발 의존성 | 개발 단계에서만 필요한 패키지 (테스트 프레임워크, 빌드 도구 등) |
| **Lockfile** | 락 파일 | 정확한 버전 번호를 기록하여 환경 일관성 보장 |
| **SemVer** | 시맨틱 버전닝 | MAJOR.MINOR.PATCH 버전 명명 규칙 |
| **node_modules** | 모듈 디렉토리 | npm이 설치한 패키지가 실제로 저장되는 디렉토리 |
| **venv** | 가상 환경 | Python 프로젝트의 독립적인 패키지 격리 샌드박스 |
| **tarball** | 압축 파일 | 패키지의 배포 형식, 보통 `.tgz` 파일 |
| **Hoisting** | 끌어올리기 | npm이 하위 의존성을 최상위로 끌어올려 중복 설치 방지 |
| **Phantom Dependency** | 유령 의존성 | 설정 파일에 선언하지 않았지만 사용할 수 있는 패키지 (pnpm으로 방지 가능) |
| **npx** | — | npm에 내장된 패키지 실행기, 설치 없이 패키지를 임시로 실행 |
| **go.sum** | — | Go 모듈의 해시 검증 파일, 의존성 변조 방지 |
| **Crate** | — | Rust 생태계에서 "패키지" 단위 명칭 |
| **winget** | — | Windows 공식 패키지 관리자 (Windows 10/11 내장) |

---

## 요약: 패키지 관리자의 본질

네 문장으로 핵심을 기억하세요:

1. **패키지 관리자 = 앱 스토어**: 코드 부품을 찾고, 설치하고, 관리하여 바퀴를 다시 만들 필요 없게 함.
2. **락 파일 = 팀 계약**: 정확한 버전을 고정하여 "내 컴퓨터에서는 잘 되는데"를 역사로 만듦.
3. **시맨틱 버전닝 = 소통 언어**: `^`로 안전하게 업데이트를 얻고, MAJOR가 바뀌면 주의.
4. **로컬 > 전역**: 프로젝트 의존성은 가능한 로컬에 설치하고, `npx` / `uvx`로 도구를 임시 실행하여 환경을 깔끔하게 유지.
