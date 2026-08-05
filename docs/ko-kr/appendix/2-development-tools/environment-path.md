# 환경 변수와 경로 원리

> 💡 **학습 가이드**: 터미널에 `git`이나 `python`을 입력할 때마다 시스템은 이 프로그램이 어디 있는지 찾아야 합니다. 코드에서 대형 언어 모델 API를 호출할 때 프로그램은 어떤 키를 사용할지 알아야 합니다. 이 두 가지 일의 배경에는 같은 메커니즘이 있습니다 — **환경 변수**.

---

## 0. 모든 프로그램 옆에는 설정 묶음이 있습니다

실행 중인 각 프로그램은 '키=값' 형태의 설정 묶음을 가지고 있으며, 이를 **환경 변수**라고 합니다. 프로그램은 언제든지 이 설정을 읽어 현재 실행 환경을 파악할 수 있습니다.

아래 목록의 아무 변수나 클릭하여 터미널에서 그 값을 "확인"해 보세요:

<EnvVarOverviewDemo />

---

## 1. PATH: Shell이 입력한 명령어를 찾는 방법

`PATH`는 특수한 환경 변수로, 콜론으로 구분된 디렉토리 경로 목록을 저장합니다. `git`을 입력하면 Shell은 이 디렉토리 목록을 순서대로 따라가며 `git`이라는 실행 파일을 찾습니다 — 첫 번째로 찾으면 즉시 중단합니다.

```bash
$ echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

명령어를 선택하고 Shell이 디렉토리를 순서대로 검색하는 과정을 관찰하세요:

<PathSearchDemo />

**세 가지 핵심 규칙**:
- PATH에서 앞에 있는 디렉토리일수록 우선순위가 높습니다
- 첫 번째로 찾으면 중단하고 계속 검색하지 않습니다
- 모든 디렉토리에 없으면 → `command not found`

---

## 2. 도구를 설치한 후 왜 터미널을 재시작 도입 동기

nvm, Homebrew, conda 같은 도구를 설치할 때, 설치 스크립트가 자동으로 `~/.zshrc`에 한 줄을 추가하여 자신의 디렉토리를 PATH에 넣습니다:

```bash
# 설치 스크립트가 자동으로 작성한 내용 (예시)
export PATH="/usr/local/opt/python@3.12/bin:$PATH"
```

이 코드는 **새 Shell이 시작될 때만** 실행됩니다. 이미 열려 있는 터미널 창에는 영향을 주지 않으므로:

```bash
# 재시작하지 않고도 바로 적용 가능
source ~/.zshrc
```

**AI 개발 도구에서 자주 발생하는 상황**:

```bash
# Ollama / pipx 설치 후 command not found 오류
which ollama          # 실제 설치 위치 확인

# pip으로 설치한 CLI 도구 경로 (PATH에 추가)
# macOS: ~/Library/Python/3.x/bin
# Linux: ~/.local/bin
export PATH="$PATH:$HOME/.local/bin"

# 명령줄 도구는 pipx로 설치 권장, PATH 자동 관리
pipx install aider-chat
```

---

## 3. 변수의 유효 범위: 누가 이 변수를 볼 수 있는가

환경 변수는 모든 프로그램에 방송되는 것이 아닙니다 — 각 프로세스는 부모 프로세스로부터 상속받은 **자신만의 사본**을 가지고 있으며, 자신의 사본을 수정해도 부모 프로세스에는 영향을 주지 않습니다.

아래 다이어그램은 세 가지 수준을 보여줍니다. '사용자 수준'에서 새로운 변수를 export하고, 그것이 '프로세스 수준'에 나타나는지 확인해 보세요:

<EnvScopeDemo />

---

## 4. export: 자식 프로세스가 이 변수를 읽을 수 있는지 결정

변수를 설정할 때 `export`를 붙이느냐 안 붙이느냐는 완전히 다른 두 가지 동작입니다:

<EnvExportDemo />

변수가 세션 간에 영구적으로 존재하게 하려면 `export`를 설정 파일에 작성합니다:

```bash
# macOS (zsh)
echo 'export MY_VAR="value"' >> ~/.zshrc
source ~/.zshrc       # 바로 적용, 터미널 재시작 불필요

# Linux (bash)
echo 'export MY_VAR="value"' >> ~/.bashrc
source ~/.bashrc
```

---

## 5. API 키: 절대 코드에 작성하면 안 됩니다

OpenAI, Anthropic, DeepSeek 등의 API를 호출할 때, 키는 여러분의 '신분증 + 신용카드'입니다. 유출되면 다른 사람이 여러분의 할당량을 사용할 수 있고, 비용은 여러분이 부담합니다.

가장 흔한 실수는 키를 코드에 직접 작성하는 것입니다:

<ApiKeyDangerDemo />

---

## 6. 로컬 개발: .env 파일로 키 관리

로컬 개발 시에는 프로젝트 루트 디렉토리의 `.env` 파일에 키를 저장하고, 코드는 dotenv 라이브러리를 통해 읽어옵니다. `.env`는 반드시 `.gitignore`에 추가하여 Git에 커밋하지 않아야 합니다.

왼쪽에 설정을 작성하고, 오른쪽에서 읽어오세요 — 언어를 전환하여 두 가지 작성 방법을 확인하세요:

<DotEnvDemo />

---

## 7. 프로덕션 환경: 실행 플랫폼이 키를 주입하게 하기

`.env`는 개발 단계의 편의 도구입니다. 서버와 클라우드 플랫폼에서는 **실행 환경**이 키를 주입하도록 해야 하며, 코드 자체는 키가 어디에 저장되어 있는지 전혀 인식하지 못해야 합니다:

<ServerSecretDemo />

---

## 8. 실전 문제 해결

### `command not found`

```bash
# 첫 번째: PATH에 있는지 확인
which python3         # 출력이 있으면 찾은 것

# 두 번째: 프로그램의 실제 위치 찾기 (macOS)
brew list python | grep bin

# 세 번째: 디렉토리를 PATH에 추가
export PATH="/찾은경로:$PATH"
source ~/.zshrc       # 설정 파일에 기록한 후 source 실행
```

### 두 버전이 설치되어 있는데 원하는 버전이 사용되지 않음

```bash
which python
# /usr/bin/python ← 시스템 구버전, PATH 앞쪽에 위치

# 새 버전 디렉토리를 PATH 맨 앞으로
export PATH="/usr/local/bin:$PATH"

which python
# /usr/local/bin/python ← 새 버전, 이제 우선순위
```

### 변수를 분명히 설정했는데 프로그램이 읽지 못함

| 원인 | 해결 방법 |
|:---|:---|
| `export`를 잊음 | `export` 추가 후 재시도 |
| `~/.zshrc`를 수정했지만 적용 안 됨 | `source ~/.zshrc` |
| `.env`를 사용하지만 dotenv 미설치 | `pip install python-dotenv` / `npm install dotenv` |
| 서버에서 SSH 세션에서만 유효 | systemd `EnvironmentFile` 사용 |

---

## 용어 빠른 참조

| 용어 | 의미 |
|:---|:---|
| **PATH** | Shell이 실행 파일을 검색하는 디렉토리 목록을 저장, 콜론으로 구분, 순서가 우선순위 결정 |
| **export** | 변수를 상속 가능으로 표시, 자식 프로세스 시작 시 자동으로 사본 획득 |
| **source** | 현재 Shell에서 설정 파일을 다시 실행하여 수정 사항을 즉시 적용 |
| **which** | 특정 명령어에 해당하는 실행 파일 경로 표시 (PATH 검색 결과) |
| **.env** | 프로젝트 로컬 설정 파일, 개발용 키 저장, 반드시 `.gitignore`에 추가 |
| **.env.example** | 변수명은 완전하고 값은 비워둔 템플릿, Git에 안전하게 커밋 가능 |
| **chmod 600** | 파일 권한: 소유자만 읽기/쓰기 가능, 키 파일 보호에 적합 |
| **Secret Scanner** | GitHub 등 플랫폼이 키 유출을 자동 스캔, 발견 시 벤더에 통지하여 키 폐기 |
