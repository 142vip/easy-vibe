# 클라우드 IAM 입문
> **학습 가이드**: 프롬프트 엔지니어링이 "말을 어떻게 명확히 할 것인가"를 해결한다면, 클라우드 계정 권한 관리는 "누가 무엇을 할 수 있는가"를 해결합니다. 이 장에서는 하나의 핵심 질문을 다룹니다: **클라우드 세계에서 편리하게 권한을 부여하면서도, 열쇠를 주면 안 되는 사람에게 주지 않으려면 어떻게 해야 할까요?**

시작하기 전에 두 가지 "기본 지식"을 먼저 보충하는 것을 권장합니다:

- **Token이란**: [대형 언어 모델 입문](../8-artificial-intelligence/llm-principles.md)의 '토큰화 & Token' 부분을 먼저 읽어보세요.
- **Prompt란**: System / User / Assistant의 기본 구조에 익숙하지 않다면 [프롬프트 엔지니어링](../8-artificial-intelligence/prompt-engineering/)을 먼저 읽어보세요.

---

## 0. 서론: 클라우드에 올라오자마자 "지뢰"를 밟은 이유

<IamRamComparisonDemo />

많은 사람이 클라우드 서비스를 처음 사용할 때 비슷한 상황을 겪습니다:

- 귀찮아서 AccessKey를 코드에 직접 작성하여 GitHub에 푸시
- 모든 직원에게 "관리자 권한"을 부여했더니 누군가 프로덕션 데이터베이스를 실수로 삭제
- 프로젝트 인수인계 후 누가 퇴사한 직원의 계정 비밀번호를 가지고 있는지 모름
- MFA를 켜야 한다는 말을 들었지만 "귀찮다"며 계속 미룸

직관적으로 **"이 직원들의 보안 의식이 부족해서"**라고 생각할 수 있습니다.

하지만 대부분의 경우, 문제는 사람이 아니라 **올바른 권한 관리 체계가 없다는 데** 있습니다.

<IntroProblemReasonSolution />

이러한 도전에 직면하여 단순히 "조심해서操作하세요"에 의존하는 것은 더 이상 통하지 않습니다. 체계적인 권한 관리 방법론이 필요합니다. 바로 이것이 **IAM(Identity and Access Management, 신원 및 접근 관리)**가 해결하려는 문제입니다.

---

## 1. IAM/RAM이란 "출입 통제 시스템"에서 시작하기

### 1.1 비유: 회사의 스마트 출입 통제

회사가 새로운 오피스 빌딩으로 이사했다고 상상해 보세요:

| 상황       | IAM가 없는 방식                  | IAM가 있는 방식                              |
| :--------- | :------------------------------- | :------------------------------------------- |
| 신규 직원 입사 | 모든 문을 열 수 있는 마스터 키 제공 | 출입카드를 발급하여 본인 부서 구역의 문만 열 수 있게 함 |
| 직원 퇴사   | 키를 잃어버려도 누가 가지고 있는지 모름 | 시스템에서 즉시 출입카드를 무효화하여 모든 문이 열리지 않음 |
| 외부 인력   | 며칠 동안 키를 빌려줌            | 임시 출입카드를 발급하여 3일 후 자동 만료되도록 설정 |
| 방문객     | 안내 데스크에서 키를 하나 제공    | 일회용 방문 코드를 발급하여 회의실만 들어갈 수 있게 함 |

**IAM(Identity and Access Management, 신원 및 접근 관리)**는 이 "스마트 출입 통제 시스템"과 같습니다:

- **신원(Identity)**: 누구인가? 직원, 외부 인력, 방문객, 애플리케이션
- **접근(Access)**: 어떤 문에 들어갈 수 있는가? 어떤 작업을 할 수 있는가?
- **관리(Management)**: 열쇠를 어떻게 발급하고, 어떻게 회수하고, 어떻게 기록을 조회하는가

### 1.2 AWS IAM vs 알리바바 클라우드 RAM

<IamRamComparisonDemo />

각 클라우드 서비스 제공자마다 자체적인 IAM 구현이 있습니다:

| 클라우드 서비스 | 서비스 이름                             | 핵심 개념                  |
| :--------- | :----------------------------------- | :------------------------ |
| **AWS**    | IAM (Identity and Access Management) | User, Group, Role, Policy |
| **알리바바 클라우드** | RAM (Resource Access Management)     | 사용자, 사용자 그룹, 역할, 정책  |
| **텐센트 클라우드** | CAM (Cloud Access Management)        | 사용자, 사용자 그룹, 역할, 정책  |
| **화웨이 클라우드** | IAM                                  | 사용자, 사용자 그룹, 위임, 정책  |
| **Azure**  | Azure AD + RBAC                      | User, Group, Role, RBAC   |

이름은 다르지만 **핵심 개념은 모두 동일**합니다:

- **사용자(User)**: 구체적인 사람이나 애플리케이션을 대표
- **사용자 그룹(Group)**: 여러 사용자의 권한을 일괄 관리
- **역할(Role)**: 권한 집합을 정의하며 "맡을 수 있음"
- **정책(Policy)**: 구체적인 권한 규칙 (허용/거부할 작업)

---

## 2. 사용자, 그룹, 역할: 무엇을 사용해야 할까 개요

### 2.1 세 가지 "신원"의 차이

<IdentityProviderDemo />

사무실 시나리오로 비유해 보겠습니다:

| 개념                | 비유                           | 적용 시나리오             | 특징                               |
| :------------------ | :----------------------------- | :------------------- | :--------------------------------- |
| **사용자(User)**    | 정식 직원, 자신의 자리와 출입카드가 있음 | 장기적이고 안정적인 팀 구성원 | 영구 자격 증명(비밀번호, AK/SK)이 있음 |
| **사용자 그룹(Group)** | 부서, 예: "개발팀", "영업팀"     | 권한 일괄 관리         | 로그인할 수 없음, 권한 컨테이너일 뿐 |
| **역할(Role)**    | 임시 방문증, 외주 임시 카드       | 임시 권한 부여, 교차 계정 접근 | 영구 자격 증명이 없음, "맡음"을 통해 임시 자격 증명 획득 |

### 2.2 실제 사례: 한 스타트업의 권한 진화

**1단계: 창립 팀 (2-3명)**

```
문제: Root 계정으로 콘솔에 직접 로그인, "편하니까"
위험: Root 계정은 모든 권한을 가지며, 한 번 유출되면 전체 계정이 무용지물
```

**2단계: 팀 확장 (5-10명)**

```
개선: 각자에게 IAM User를 만들고 다른 권한을 할당
문제:
- 운영자 왕씨가 퇴사했는데, 그의 AK/SK가 어떤 서버에 흩어져 있는가?
- 새로 온 프론트엔드 개발자는 S3 읽기 전용 권한이, 백엔드 개발자는 RDS 권한이 필요한데 하나씩 수동으로 설정하기 너무 번거로움
```

**3단계: 표준화 (10-30명)**

```
개선:
1. 역할별로 IAM Group 생성:
   - Developers(개발): S3, EC2, RDS 읽기/쓰기
   - DevOps(운영): 전체 권한, 단 MFA 필요
   - ReadOnly(읽기 전용): 모든 리소스 조회, 수정 불가
   - QAs(테스트): 테스트 환경 리소스 접근

2. IAM Role 사용:
   - EC2 인스턴스는 Instance Profile을 사용하여 서버에 AK/SK를 두지 않음
   - 교차 계정 접근은 Role Assume을 사용하여 AK/SK 공유하지 않음
   - CI/CD는 OIDC Federation을 사용하여 장기 자격 증명을 저장하지 않음
```

**4단계: 다중 계정/기업급 (30명+)**

```
아키텍처:
- Master Account(마스터 계정): 청구서 및 조직 구조 관리에만 사용, 리소스를 두지 않음
- Audit Account(감사 계정): 모든 계정의 로그 수집
- Dev Account(개발 계정): 개발 환경
- Staging Account(스테이징 계정): 테스트 환경
- Prod Account(프로덕션 계정): 프로덕션 환경, 권한이 가장 엄격

권한 흐름:
- 개발자는 기본적으로 Dev 계정의 읽기 전용 권한만 가짐
- 프로덕션 환경을 수정해야 할 때는 Prod의 임시 Role로 Assume하기 위해 티켓을 제출
- 모든 Assume 작업은 CloudTrail에 기록되어 정기적으로 감사
```

---

## 3. 역할과 정책: 권한 관리의 "영혼"

### 3.1 역할의 본질: 신뢰 + 권한

<RolePolicyDemo />

IAM Role은 두 가지 핵심 구성 요소를 가집니다:

1. **신뢰 정책(Trust Policy)**: 누가 이 역할을 맡을 수 있는가?
2. **권한 정책(Permission Policy)**: 역할을 맡은 후 무엇을 할 수 있는가?

연극 공연에 비유해 보겠습니다:

| 개념                  | 비유                   | 설명                                                                                       |
| :-------------------- | :--------------------- | :----------------------------------------------------------------------------------------- |
| **Role(역할)**      | 대본 속 "햄릿"     | 어떤 역할을 할지 정의(권한)                                                                   |
| **Trust Policy**      | 감독이 "누가 햄릿을 연기할 수 있는지" 결정 | "이 극단의 배우"(동일 계정 사용자), "옆 극단에서 빌려온 배우"(교차 계정), "특별 초대 손님"(외부 IdP)일 수 있음 |
| **Permission Policy** | 대본 내용               | 햄릿이 할 수 있는 것: 대사하기, 결투하기, 발광하기(구체적인 권한)                                           |
| **Assume Role**       | 배우가 무대에 올라 공연 | 이씨가 감독에 의해 햄릿 역으로 선택되어 무대에 오르면 대본에 정의된 모든 권한을 가짐                             |
| **임시 자격 증명**          | 공연 증명서             | 이씨가 "임시 공연 증명서"를 받으며 공연이 끝나면 무효가 됨                                               |

### 3.2 정책(Policy): 권한의 "문법"

<PermissionHierarchyDemo />

IAM Policy는 JSON 문서로, "누가 어떤 리소스에 대해 무엇을 할 수 있는가"를 정의합니다.

**완전한 Policy 예시**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadWrite",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::my-app-bucket/*",
      "Condition": {
        "StringEquals": {
          "aws:RequestedRegion": "ap-northeast-1"
        },
        "Bool": {
          "aws:MultiFactorAuthPresent": "true"
        }
      }
    },
    {
      "Sid": "DenySensitiveData",
      "Effect": "Deny",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::my-app-bucket/sensitive/*"
    }
  ]
}
```

**주요 필드 설명**:

| 필드          | 의미                               | 예시                     |
| :------------ | :--------------------------------- | :----------------------- |
| **Version**   | Policy 문법 버전                    | "2012-10-17"             |
| **Statement** | 권한 선언 배열, 여러 규칙을 포함할 수 있음       | [...]                    |
| **Sid**       | 선언 ID, 선택 사항, 이 규칙을 식별하는 데 사용    | "AllowS3ReadWrite"       |
| **Effect**    | 효과: Allow(허용) 또는 Deny(거부) | "Allow"                  |
| **Action**    | 허용/거부할 작업, 와일드카드 지원        | "s3:GetObject", "s3:\*"  |
| **Resource**  | 작용하는 리소스, ARN으로 식별            | "arn:aws:s3:::bucket/\*" |
| **Condition** | 선택 사항, 특정 조건을 만족할 때만 적용         | 리전 제한, MFA 요구 등     |

### 3.3 권한의 우선순위: Deny > Allow > 기본 거부

IAM의 권한 평가 로직은 한 문장으로 요약할 수 있습니다: **명시적 Deny는 항상 이기고, Allow가 없으면 거부**입니다.

평가 흐름은 다음과 같습니다:

```
1. 먼저 Deny 정책이 있는지 확인
   ├─ Deny가 있음 → 거부 (Allow가 있어도 상관없음)
   └─ Deny가 없음 → 계속 확인

2. 다음으로 Allow 정책이 있는지 확인
   ├─ Allow가 있음 → 허용
   └─ Allow가 없음 → 거부 (기본 거부 원칙)
```

**실전 사례: 민감 데이터 보호**

```json
// 정책 1: 개발자에게 부여된 일반 권한
{
  "Effect": "Allow",
  "Action": ["s3:*"],
  "Resource": "arn:aws:s3:::company-data/*"
}

// 정책 2: 민감 디렉토리 보호 (개발자가 s3:*를 가지고 있어도 접근 불가)
{
  "Effect": "Deny",
  "Action": ["s3:*"],
  "Resource": "arn:aws:s3:::company-data/sensitive/*"
}
```

**핵심 포인트**:

- 개발자가 `s3:*`의 Allow 권한을 가지고 있더라도
- 민감 디렉토리에 명시적 Deny 규칙이 있음
- Deny의 우선순위가 더 높으므로 개발자는 민감 데이터에 접근할 수 없음
- 개발자가 관리자여도 이 Deny는 유효함 (Root 계정은 제외)

---

## 4. 액세스 키(AK/SK): 주의해서 보관해야 할 "열쇠"

### 4.1 AK/SK란 개요
<AccessKeyManagementDemo />

Access Key(액세스 키)는 클라우드 서비스가 제공하는 장기 자격 증명으로, 프로그래밍 방식의 API 호출에 사용됩니다. 두 부분으로 구성됩니다:

| 구성 요소              | 이름         | 역할                       | 비유       |
| :-------------------- | :----------- | :------------------------- | :--------- |
| **Access Key ID**     | 액세스 키 ID  | 누구인지 식별 (사용자 이름과 유사) | 은행 카드 번호   |
| **Secret Access Key** | 비밀 액세스 키 | 본인임을 증명 (비밀번호와 유사)   | 은행 카드 비밀번호 |

### 4.2 AK/SK는 "고위험 물품" 동기
**실제 사례: 한 스타트업의 교훈**

이씨는 한 스타트업의 신입 백엔드 엔지니어입니다. 입사 첫 주, 그의 임무는 파일 업로드 기능을 디버깅하는 것이었습니다.

```python
# 이씨가 작성한 코드 (심각한 보안 문제 있음!)
import boto3

# 디버깅을 편하게 하기 위해 AK/SK를 코드에 직접 작성
s3 = boto3.client(
    's3',
    aws_access_key_id='AKIAIOSFODNN7EXAMPLE',
    aws_secret_access_key='wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    region_name='ap-northeast-1'
)

def upload_file(file_path, bucket_name, object_name):
    s3.upload_file(file_path, bucket_name, object_name)
    print(f"파일이 s3://{bucket_name}/{object_name}에 업로드되었습니다")

# 테스트 업로드
upload_file('./test.jpg', 'my-company-bucket', 'uploads/test.jpg')
```

**일주일 후 발생한 일**:

1. 이씨가 AK/SK를 포함하여 코드를 GitHub에 푸시
2. GitHub의 코드가 크롤러에 의해 스캔되어 AK/SK가 추출됨
3. 공격자가 이 자격 증명을 사용하여 회사 계정에 대량의 EC2 인스턴스를 생성하여 마이닝
4. 월말에 청구서 도착: 추가 비용 12,000달러
5. 감사 결과 AK/SK 유출이 발견되어 이씨가 면담을 받음...

**이 사례가 우리에게 알려주는 것**

| 잘못된 방법                    | 올바른 방법                                         |
| :-------------------------- | :----------------------------------------------- |
| AK/SK를 코드에 하드코딩     | IAM Role을 사용하여 프로그램이 자동으로 임시 자격 증명 획득            |
| AK/SK를 Git 저장소에 푸시    | `.gitignore`로 설정 파일을 무시하고, 비밀 관리 서비스 사용 |
| AK/SK를 장기간 교체하지 않고 사용 | 정기적으로 AK/SK를 교체하고, 장기 자격 증명 대신 임시 자격 증명 사용         |
| AK/SK에 과도한 권한 부여       | 최소 권한 원칙을 따르고 필요한 권한만 부여               |

### 4.3 AK/SK 안전 사용 가이드

**시나리오 1: 로컬 개발**

```bash
# 올바른 방법: AWS CLI를 사용하여 자격 증명 설정, 코드에 작성하지 않음
aws configure
# 그런 다음 안내에 따라 Access Key ID와 Secret Access Key 입력
# 이 정보는 ~/.aws/credentials에 저장되며 권한은 600으로 설정

# 코드에는 자격 증명 설정이 필요 없음
import boto3
s3 = boto3.client('s3')  # ~/.aws/credentials에서 자동 읽기
```

**시나리오 2: 서버/EC2**

```python
# 올바른 방법: IAM Instance Profile 사용
# 1. IAM Role을 생성하고 필요한 권한(예: S3ReadOnly)을 연결
# 2. Instance Profile을 생성하고 이 Role을 연결
# 3. EC2를 시작할 때 이 Instance Profile을 선택

# 코드에는 자격 증명이 완전히 필요 없음
import boto3
s3 = boto3.client('s3')  # EC2 메타데이터 서비스에서 임시 자격 증명을 자동으로 가져옴

# 임시 자격 증명은 자동으로 교체되므로 만료를 걱정할 필요 없음
```

**시나리오 3: CI/CD 파이프라인**

```yaml
# 올바른 방법: OIDC Federation(OpenID Connect) 사용
# GitHub Actions를 예로 들면:

# 1. AWS에서 OIDC Identity Provider를 생성하여 GitHub를 신뢰
# 2. IAM Role을 생성하여 신뢰 정책이 GitHub의 특정 저장소를 맡을 수 있도록 허용
# 3. GitHub Actions에서 설정

name: Deploy
on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write # 핵심: OIDC 토큰 요청 허용
      contents: read
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsRole
          aws-region: ap-northeast-1
          # 참고: 여기에는 Access Key가 없음! 완전히 임시 자격 증명 사용

      - name: Deploy
        run: aws s3 sync ./build s3://my-bucket/
```

**요약: AK/SK 사용의 보안 수준**

| 보안 등급 | 방법                        | 적용 시나리오                  | 위험 등급 |
| :------- | :-------------------------- | :------------------------ | :------- |
| 최고     | IAM Role 사용 (장기 자격 증명 없음) | EC2, Lambda, ECS, CI/CD   | 매우 낮음     |
| 높음       | OIDC Federation 사용        | GitHub Actions, GitLab CI | 낮음 |
| 중간       | 비밀 관리 서비스 사용            | 로컬 개발, 소규모 팀          | 중간 |
| 낮음       | 환경 변수 사용                | 빠른 프로토타입, 개인 프로젝트        | 높음 |
| 매우 낮음     | 코드에 하드코딩              | 어떤 시나리오에서도 권장하지 않음          | 매우 높음 |

---

## 5. 다중 인증(MFA): 계정에 "자물쇠" 추가하기

### 5.1 MFA란 개요
<MfaSecurityDemo />

MFA(Multi-Factor Authentication, 다중 인증)는 2FA(Two-Factor Authentication, 이중 인증)라고도 하며, 사용자가 로그인할 때 **두 가지 이상**의 다른 유형의 인증 요소를 제공해야 하는 보안 메커니즘입니다:

| 요소 유형                   | 무엇인가             | 예시           |
| :------------------------- | :----------------- | :------------- |
| **지식 요소**(알고 있는 것) | 사용자만 아는 정보 | 비밀번호, PIN 코드   |
| **소지 요소**(가지고 있는 것)   | 사용자가 소유한 물리적 기기 | 휴대폰, 하드웨어 키 |
| **생체 요소**(본인인 것)   | 사용자의 생체 특징     | 지문, 얼굴 인식 |

### 5.2 MFA 중요성
**실제 데이터가 답을 알려줍니다**:

| 공격 방식                 | MFA가 없을 때 성공률 | MFA가 있을 때 성공률               |
| :----------------------- | :------------------ | :------------------------------ |
| 비밀번호 추측/무차별 대입 공격        | 높음                | 매우 낮음 (두 번째 요소도 필요)          |
| 피싱 공격으로 비밀번호 획득         | 높음                | 매우 낮음 (피싱 페이지에서 MFA 코드를 얻을 수 없음) |
| 비밀번호 유출 (다른 웹사이트에서 유출) | 높음                | 매우 낮음 (두 번째 요소를 모름)          |

**Microsoft 보안 보고서(2020)**: MFA를 활성화하면 자동화된 공격의 **99.9%**를 차단할 수 있습니다.

### 5.3 MFA 실전: AWS Root 계정에 MFA 활성화

**1단계: AWS 콘솔에 로그인**

1. Root 계정 이메일과 비밀번호로 로그인
2. 오른쪽 상단에서 계정 이름을 클릭하고 "Security Credentials"를 선택

**2단계: MFA 활성화**

1. "Multi-factor authentication (MFA)" 영역을 찾음
2. "Assign MFA device"를 클릭
3. MFA 장치 유형을 선택 ("Authenticator app" 권장)

**3단계: 가상 MFA 설정**

1. 휴대폰에 Google Authenticator 또는 Microsoft Authenticator 설치
2. QR 코드를 스캔하거나 키를 수동으로 입력
3. 앱에 표시된 6자리 인증 코드를 입력 (인증 코드가 30초마다 갱신되므로 연속으로 두 개를 입력)

**완료!** 이제 Root 계정에 MFA 보호가 설정되었습니다.

---

## 6. 교차 계정 접근: 안전하게 "이웃집 방문" 접근법
### 6.1 교차 계정 접근 도입 동기
<CrossAccountAccessDemo />

비즈니스가 성장하면서 많은 회사가 **다중 계정 아키텍처**를 사용하여 다양한 환경을 격리합니다:

| 계정 유형            | 용도                   | 권한 요구           |
| :------------------ | :--------------------- | :----------------- |
| **Master Account**  | 조직 관리, 청구서 정산     | 거의 사용하지 않음         |
| **Security Audit**  | 모든 계정의 로그를 중앙에서 수집 | 다른 계정에 읽기 전용 접근   |
| **Shared Services** | 공유 리소스(이미지 저장소 등) | 다른 계정이 읽기 전용 접근   |
| **Development**     | 개발 환경               | 개발자에게 전체 권한     |
| **Staging**         | 테스트/스테이징 환경        | 테스트 담당자 권한       |
| **Production**      | 프로덕션 환경               | 엄격한 제한, 승인 필요 |

**문제: Shared Services 계정의 이미지를 Production 계정의 EC2가 어떻게 가져올 수 있는가?**

- 방안 A: AK/SK를 Production의 사용자 데이터에 작성 (위험! AK/SK 유출 가능)
- 방안 B: 교차 계정 Role Assume 사용 (권장! 임시 자격 증명, 자동 교체)

### 6.2 교차 계정 Role Assume의 원리

```
계정 A(Production)                    계정 B(Shared Services)
    |                                           |
    |  1. Assume Role 요청                      |
    |  "계정 B의 ECRReadRole을 맡고 싶습니다"          |
    |------------------------------------------>|
    |                                           |
    |                    2. 신뢰 정책 확인         |
    |                    "계정 A가 나를 맡을 수 있는가?" |
    |                                           |
    |  3. 임시 자격 증명 반환                          |
    |  AccessKeyId, SecretKey, SessionToken    |
    |<------------------------------------------|
    |                                           |
    |  4. 임시 자격 증명으로 ECR 접근                  |
    |  docker pull 계정B.dkr.ecr...            |
```

**핵심 포인트**:

- 임시 자격 증명의 기본 유효기간은 1시간이며, 최대 12시간까지 설정 가능
- 코드에 장기 자격 증명을 저장할 필요 없음
- 신뢰 정책으로 누가 이 역할을 맡을 수 있는지 제한 가능 (예: 특정 계정, 특정 외부 ID)

### 6.3 실전: 교차 계정 ECR 접근 설정

**시나리오**: Production 계정의 EC2가 Shared Services 계정의 Docker 이미지를 가져와야 함.

**1단계: Shared Services 계정에 IAM Role 생성**

1. Shared Services 계정의 AWS 콘솔에 로그인
2. IAM -> Roles -> Create role으로 이동
3. "Another AWS account"를 선택
4. Production 계정의 Account ID를 입력
5. 선택 사항: "Require external ID"를 체크하고 무작위 문자열을 입력 (보안 강화)
6. 권한 연결: AmazonEC2ContainerRegistryReadOnly
7. Role 이름 지정: CrossAccountECRReadRole

**2단계: Role ARN 가져오기**

생성 완료 후 Role의 ARN을 복사:

```
arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole
```

**3단계: Production 계정에서 EC2 인스턴스 설정**

방법 A: Instance Profile 사용 (권장)

1. Production 계정에서 IAM Role(EC2용)을 생성
2. 신뢰 정책: EC2 서비스를 신뢰
3. 권한 정책: 교차 계정 Role을 Assume할 수 있도록 허용

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole"
    }
  ]
}
```

4. Instance Profile을 생성하고 이 Role을 연결
5. EC2를 시작할 때 이 Instance Profile을 선택

방법 B: EC2 사용자 데이터에서 동적으로 Assume Role

```bash
#!/bin/bash
# AWS CLI 설치
yum install -y aws-cli

# 교차 계정 Role Assume
CREDS=$(aws sts assume-role \
  --role-arn arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole \
  --role-session-name EC2PullSession)

# 임시 자격 증명 추출
export AWS_ACCESS_KEY_ID=$(echo $CREDS | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo $CREDS | jq -r '.Credentials.SessionToken')

# ECR 로그인
aws ecr get-login-password --region ap-northeast-1 | \
  docker login --username AWS --password-stdin SHARED_SERVICES_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com

# 이미지 풀
docker pull SHARED_SERVICES_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com/my-app:latest
```

**4단계: 교차 계정 접근 테스트**

Production의 EC2에서 실행:

```bash
# Assume Role이 가능한지 테스트
aws sts get-caller-identity
# 다음과 같이 표시되어야 함: arn:aws:sts::PRODUCTION_ACCOUNT_ID:assumed-role/CrossAccountECRReadRole/EC2PullSession

# Shared Services의 ECR 저장소를 나열할 수 있는지 테스트
aws ecr describe-repositories --registry-id SHARED_SERVICES_ACCOUNT_ID
```

**완료!** 이제 Production의 EC2가 Shared Services의 이미지를 안전하게 가져올 수 있으며, 장기 자격 증명을 공유할 필요가 없습니다.

---

## 7. 실전: 안전한 권한 체계 구축

### 7.1 권한 아키텍처를 처음부터 구축

<BestPracticesDemo />

10명 규모 스타트업의 기술 책임자이며 AWS 권한 아키텍처를 처음부터 설계해야 한다고 가정해 보겠습니다. 다음은 권장하는 구현 단계입니다:

**1단계: Root 계정 보호 (첫날)**

```
목표: Root 계정 보호, 가장 중요한 계정

1. Root 계정 MFA 활성화 (필수)
   - 하드웨어 MFA(YubiKey) 권장, 또는 Google Authenticator

2. IAM 관리자 계정 생성
   - 사용자 이름: admin (또는 본인 이름)
   - 권한: AdministratorAccess (하지만 나중에 축소할 것)
   - MFA 활성화

3. Root 계정의 Access Key 삭제 (생성한 경우)
   - Root 계정에는 절대 AK/SK가 있어서는 안 됨

4. Root 계정 사용 경고 설정
   - CloudWatch + SNS를 사용하여 Root 계정이 로그인하면 즉시 이메일/SMS 발송
```

**2단계: 팀 권한 그룹화 (첫 주)**

```
목표: 팀 구성원을 그룹화하여 권한을 일괄 관리

1. 팀 역할 분석:
   - 백엔드 개발 (2명)
   - 프론트엔드 개발 (1명)
   - 모바일 개발 (1명)
   - 프로덕트 매니저 (1명)
   - 디자이너 (1명)
   - 창립자/관리자 (3명)

2. IAM Groups 생성:

   Group: Developers
   ├── 구성원: 모든 개발자 (백엔드, 프론트엔드, 모바일)
   ├── 권한:
   │   ├── EC2: 시작, 중지, 조회 (단, 다른 사람의 인스턴스는 삭제 불가)
   │   ├── S3: 개발 환경 버킷 읽기/쓰기
   │   ├── RDS: 읽기 전용 권한 (프로덕션 데이터베이스 수정 불가)
   │   └── CloudWatch: 로그 조회
   └── 제한: ap-northeast-1 리전만 조작 가능

   Group: ProductTeam
   ├── 구성원: 프로덕트 매니저, 디자이너
   ├── 권한:
   │   ├── S3: 읽기 전용 (데이터 파일 조회)
   │   ├── CloudWatch Dashboard: 모니터링 차트 조회
   │   └── Cost Explorer: 청구서 조회 (단, 수정 불가)
   └── 제한: 읽기 전용 권한, 어떤 리소스도 수정 불가

   Group: Administrators
   ├── 구성원: 창립자, 기술 책임자
   ├── 권한: AdministratorAccess
   └── 요구 사항: 반드시 MFA를 사용해야 조작 가능

3. 각자에게 IAM User를 만들고 해당 Group에 추가
   - 개인에게 직접 권한을 부여하지 말고, 모두 Group을 통해 관리
   - MFA 활성화 (필수 요구)
```

**3단계: 애플리케이션 계층 권한 최적화 (2-4주)**

```
목표: 애플리케이션이 안전하게 AWS 리소스에 접근할 수 있도록 함

1. EC2 인스턴스는 Instance Profile 사용
   - 서버에 AK/SK를 설정하지 않음
   - 필요한 권한(예: S3 읽기/쓰기)을 연결한 IAM Role 생성
   - Instance Profile을 생성하고 이 Role을 연결
   - EC2를 시작할 때 이 Instance Profile을 선택
   - 애플리케이션 코드에서 자격 증명 설정 없이 boto3를 직접 사용

2. AK/SK를 반드시 사용해야 하는 경우(서드파티 통합)
   - AWS Secrets Manager를 사용하여 AK/SK 저장
   - 애플리케이션 시작 시 Secrets Manager에서 읽기
   - 정기적 교체 설정 (90일)
   - AK/SK 사용 현황 모니터링

3. CloudTrail을 설정하여 모든 API 호출 기록
   - 로그 저장을 위한 전용 S3 버킷 생성
   - 로그 파일 무결성 검증 설정 (변조 방지)
   - 중요 이벤트(Root 계정 사용, 정책 변경 등)에 대해 SNS 알림 설정
```

**4단계: 보안 강화 (지속적)**

```
목표: 지속적인 보안 모니터링 및 개선 메커니즘 구축

1. AWS Config 활성화
   - 리소스 설정 변경 모니터링
   - 컴플라이언스 검사 (예: 보안 그룹이 0.0.0.0/0에 열려 있는지)

2. IAM Access Analyzer 활성화
   - 리소스 정책을 지속적으로 분석
   - 외부 접근 식별 (예: S3 버킷이 공개되어 있는지)

3. IAM 설정 정기 검토
   - 매월 한 번씩 사용하지 않는 IAM User, Role 확인
   - Access Key 사용 현황 확인
   - Group 구성원이 적절한지 검증

4. 보안 사건 대응 프로세스 구축
   - AK/SK 유출 발견 시: 즉시 삭제, 교체, 영향 범위 감사
   - 비정상 API 호출 발견 시: 즉시 조사, 권한 제한
```

---

## 8. 일반적인 오해와 주의사항

### 8.1 10대 IAM 안티 패턴

| #   | 안티 패턴                       | 왜 나쁜가                                     | 올바른 방법                                         |
| :-- | :--------------------------- | :--------------------------------------------- | :----------------------------------------------- |
| 1   | Root 계정으로 일상 작업 수행       | Root 계정은 모든 권한을 가지며 유출되면 피해를 제한할 수 없음       | IAM 관리자 계정을 생성하고 Root 계정은 필요할 때만 사용        |
| 2   | 모든 사람에게 AdministratorAccess 부여 | 최소 권한 원칙 위반, 오작업 및 내부 위협 위험 증가     | 역할별로 그룹화하고 필요한 권한만 부여                     |
| 3   | 코드에 AK/SK 하드코딩         | AK/SK가 GitHub를 통해 유출되기 쉬우며 교체도 어려움         | IAM Role, 환경 변수 또는 비밀 관리 서비스 사용            |
| 4   | AK/SK를 장기간 교체하지 않음             | 자격 증명 유출 시 위험 노출 기간 증가                   | 90일 교체 정책을 설정하거나, 더 나은 방법은 임시 자격 증명 사용       |
| 5   | MFA 무시                     | 비밀번호 유출 시 계정이 즉시 탈취                         | 모든 IAM 사용자에게 MFA를 활성화하며, 특히 고권한 사용자        |
| 6   | CloudTrail 미사용            | 누가 무엇을 했는지 감사할 수 없으며, 사건 발생 후 추적 불가         | CloudTrail을 활성화하고 로그를 독립적인 감사 계정에 저장    |
| 7   | IAM Policy가 너무 느슨          | `Resource: "*"`, `Action: "*"`와 같이 공격 표면 증가  | 리소스 ARN과 구체적인 Action을 명확히 지정                   |
| 8   | 퇴사한 직원의 IAM User를 정리하지 않음    | 좀비 계정이 백도어가 될 수 있음                           | 퇴사 프로세스를 구축하여 즉시 IAM User를 비활성화하고 삭제 |
| 9   | IAM Access Analyzer 미사용   | 과도하게 느슨한 리소스 정책(예: 공개 S3 버킷)을 발견할 수 없음 | IAM Access Analyzer를 활성화하고 외부 접근을 정기적으로 확인       |
| 10  | 테스트 환경에서 Policy를 검증하지 않음      | 프로덕션 환경에 Policy를 직접 적용하여 서비스 중단 발생 가능    | IAM Policy Simulator를 사용하여 테스트하고 먼저 테스트 환경에서 검증 |

---

## 9. 용어 대조표

| 영문 용어                                 | 한국어        | 설명                                       |
| :--------------------------------------- | :-------------- | :----------------------------------------- |
| **IAM (Identity and Access Management)** | 신원 및 접근 관리  | 클라우드 서비스에서 사용자 신원과 접근 권한을 관리하는 서비스       |
| **RAM (Resource Access Management)**     | 리소스 접근 관리    | 알리바바 클라우드의 IAM 서비스명                      |
| **Root Account**                         | Root 계정          | 클라우드 계정을 등록할 때 생성된 소유자 계정으로 최고 권한을 가짐 |
| **IAM User**                             | IAM 사용자/하위 계정 | Root 계정이 생성한 하위 신원으로 일상 작업에 사용         |
| **IAM Role**                             | IAM 역할        | 임시 권한 담체로 장기 자격 증명이 없으며 "맡아야" 함   |
| **IAM Policy**                           | IAM 정책        | JSON 형식의 권한 규칙 정의                    |
| **ARN**                                  | Amazon 리소스 이름  | 전역적으로 유일한 리소스 식별자                       |
| **AK/SK**                                | 액세스 키/비밀 키 | 프로그램이 클라우드 API에 접근하는 자격 증명                      |
| **STS**                                  | 보안 토큰 서비스    | 임시 보안 자격 증명을 제공하는 서비스                     |
| **MFA**                                  | 다중 인증      | 두 가지 이상의 요소가 필요한 인증 방식               |
| **SSO**                                  | 싱글 사인온        | 사용자가 한 번 로그인하면 여러 시스템에 접근할 수 있는 인증 방식     |
| **ExternalId**                           | 외부 ID         | 혼란스러운 대리인 공격을 방지하는 보안 식별자           |
| **CloudTrail**                           | 클라우드 감사 서비스      | 클라우드 계정의 모든 API 호출과 작업을 기록하는 로그 서비스  |

---

## 요약: 클라우드 계정 권한 관리의 핵심 원칙

클라우드 계정 권한 관리는 한 번에 완성되는 것이 아니라 팀 규모와 비즈니스 요구에 따라 지속적으로 진화해야 합니다:

1. **시작 단계** (1-10명):
   - Root 계정 보호 (MFA + Root 계정으로 일상 작업하지 않음)
   - IAM 관리자 계정 생성
   - 기본 그룹화 (Developers, Admins)

2. **성장 단계** (10-50명):
   - 세분화된 권한 그룹화 (프론트엔드, 백엔드, 운영, 프로덕트 등)
   - AK/SK 대신 IAM Role 사용
   - CloudTrail 감사 활성화
   - 정기적인 권한 검토

3. **성숙 단계** (50명 이상 / 다중 계정):
   - 다중 계정 아키텍처 (Dev, Staging, Prod 분리)
   - 중앙 집중식 로그 감사 계정
   - 자동화된 권한 검토 및 알림
   - 완전한 권한 신청 및 승인 프로세스

**핵심 원칙 세 가지를 기억하세요**:

1. **최소 권한 원칙**: 필요한 권한만 부여하고, AdministratorAccess를 주지 마세요
2. **장기 자격 증명 사용하지 않기**: IAM Role과 임시 자격 증명을 우선 사용하고 AK/SK 유출을 피하세요
3. **MFA 활성화**: 특히 Root 계정과 고권한 계정에 대해 가장 효과적인 보안 조치입니다

---

> **더 읽어보기**:
>
> - [AWS IAM 공식 문서](https://docs.aws.amazon.com/iam/)
> - [알리바바 클라우드 RAM 공식 문서](https://www.aliyun.com/product/ram)
> - [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
