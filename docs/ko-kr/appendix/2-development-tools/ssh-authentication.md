# SSH 인증 입문

> 💡 **학습 가이드**: `git push` 할 때마다 비밀번호를 입력하시나요? 서버 연결 시 "Permission denied" 오류가 뜨나요? 이 장에서는 5분 만에 SSH 키 인증의 원리와 GitHub 및 서버에 비밀번호 없이 로그인하는 방법을 알아봅니다.

---

## 0. 여러분도 이런 상황을 겪어보셨을 겁니다

- `git push` 할 때마다 비밀번호 입력창이 반복적으로 뜨는 불편함
- SSH 서버 연결 실패 시 `id_rsa`와 `id_ed25519`가 무엇인지 몰라 당황
- "공개키"와 "비공개키"라는 말은 들어봤지만 어떤 것을 공유하고 어떤 것을 보관해야 하는지 헷갈림

**핵심 문제**: 비밀번호는 안전하지도 않고 번거롭기까지 합니다. SSH 키는 보안성과 편리함을 동시에 해결하는 방안입니다.

---

## 1. 비밀번호 vs 키: 왜 키가 더 나은가 비교
👇 클릭해서 비교해 보세요: 비밀번호 로그인과 키 로그인의 차이

<SSHAuthDemo />

::: tip 💡 한 줄 요약
비밀번호 로그인 = 매번 비밀번호를 전송해서 상대방이 확인 (비밀번호가 도청될 수 있음)
키 로그인 = "열쇠를 가지고 있다"는 것을 증명하지만 열쇠 자체를 보여주지는 않음 (비공개키는 절대 전송되지 않음)
:::

---

## 2. 비대칭 암호화: 공개키와 비공개키

SSH 키는 **비대칭 암호화**를 기반으로 하며, 한 번 생성 시 두 개의 키가 만들어집니다:

| | 비공개키 (Private Key) | 공개키 (Public Key) |
|---|---|---|
| **보관 위치** | 내 컴퓨터 `~/.ssh/id_ed25519` | 서버/GitHub |
| **공유해도 될까?** | ❌ 절대 안 됨 | ✅ 자유롭게 공유 가능 |
| **기능** | 서명 (신원 증명) | 서명 검증 (신원 확인) |
| **비유** | 열쇠 | 자물쇠 |

### 주요 키 유형

| 유형 | 명령어 | 추천도 | 설명 |
|---|---|---|---|
| **Ed25519** | `ssh-keygen -t ed25519` | ⭐⭐⭐ | 최신, 가장 빠르고 안전함 |
| **RSA** | `ssh-keygen -t rsa -b 4096` | ⭐⭐ | 호환성 우수, 하지만 속도가 느림 |
| **ECDSA** | `ssh-keygen -t ecdsa` | ⭐ | 일반적으로 권장하지 않음 |

---

## 3. 실전: SSH 키 생성 및 설정

### 3.1 키 페어 생성

```bash
ssh-keygen -t ed25519 -C "your@email.com"
```

실행 후 다음과 같은 프롬프트가 표시됩니다:
- **파일 경로**: Enter를 눌러 기본 경로 `~/.ssh/id_ed25519` 사용
- **암호문**: 추가 보호를 위한 암호 설정 가능 (비워둘 수도 있음)

### 3.2 GitHub에 공개키 추가

```bash
# 1. 공개키 내용 복사
cat ~/.ssh/id_ed25519.pub | pbcopy  # macOS
cat ~/.ssh/id_ed25519.pub | xclip   # Linux

# 2. GitHub → Settings → SSH and GPG keys → New SSH key 열기
# 3. 공개키 붙여넣기 후 저장

# 4. 연결 테스트
ssh -T git@github.com
# 성공 시: Hi username! You've been authenticated... 확인
```

### 3.3 서버에 공개키 추가

```bash
# 방법 1: ssh-copy-id (권장)
ssh-copy-id user@your-server

# 방법 2: 수동 복사
cat ~/.ssh/id_ed25519.pub | ssh user@server "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

---

## 4. SSH Config: 긴 명령어 작별

`~/.ssh/config`에 별칭을 설정하면 한 번의 설정으로 계속 편리하게 사용할 수 있습니다:

```
Host dev
  HostName 192.168.1.100
  User deploy
  IdentityFile ~/.ssh/id_ed25519

Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
```

설정 후 효과:

| 이전 | 이후 |
|---|---|
| `ssh -i ~/.ssh/id_ed25519 deploy@192.168.1.100` | `ssh dev` |
| 매번 IP와 사용자 이름을 기억해야 함 | 별칭 하나만 기억하면 됨 |

---

## 5. 자주 발생하는 문제 해결

| 문제 | 원인 | 해결책 |
|---|---|---|
| `Permission denied (publickey)` | 공개키가 서버에 추가되지 않음 | `ssh-copy-id user@server` |
| `WARNING: UNPROTECTED PRIVATE KEY FILE` | 비공개키 파일 권한이 너무 넓음 | `chmod 600 ~/.ssh/id_ed25519` |
| `Could not resolve hostname` | SSH Config 설정 오류 | `~/.ssh/config` 형식 확인 |
| GitHub에서 계속 비밀번호 요구 | SSH 대신 HTTPS 사용 중 | `git@github.com:user/repo.git` 형식으로 변경 |

---

## 6. 요약

::: tip 📚 핵심 포인트
1. **키 > 비밀번호**: 비공개키는 전송되지 않으므로 비밀번호보다 훨씬 안전합니다
2. **Ed25519 권장**: 가장 현대적인 키 알고리즘, 빠르고 높은 보안성
3. **공개키는 자유롭게 공유, 비공개키는 절대 유출 금지**: 이 철칙을 기억하세요
4. **SSH Config**: 별칭을 한 번 설정하면 이후 `ssh 별칭`으로 한 번에 연결
5. **GitHub/GitLab**: 공개키 추가 후 `git push/pull` 시 더 이상 비밀번호 불필요
:::

**다음 학습**:
- [포트와 localhost](./ports-localhost) - 네트워크 연결의 기초 이해
- [환경 변수와 PATH](./environment-path) - 시스템 설정 이해