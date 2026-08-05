# 모니터링과 로깅 원리
> 💡 **학습 가이드**: 이 장은 프로그래밍 기초가 필요하지 않으며, 인터랙티브 데모를 통해 운영의 완전한 지식 체계를 이해합니다. 모니터링 알림부터 장애 조사, 용량 계획부터 자동화 운영까지 온라인 시스템 운영 기술을 포괄적으로 습득합니다.

## 0. 서론: 시스템 온라인은 시작일 뿐

많은 초보자가 "코드를 배포하여 온라인하면 작업이 끝났다"고 생각합니다.

**큰 오해입니다!**

시스템 온라인은 **운영 작업의 시작점**일 뿐입니다. 새 차를 산 것과 같아서, 이후의 정비, 수리, 주유이 일상입니다.

운영의 목표는 세 가지입니다:

1. **안정성 (Stability)**: 시스템이 다운되지 않고 서비스가 항상 이용 가능
2. **성능 (Performance)**: 빠른 응답, 좋은 사용자 경험
3. **보안 (Security)**: 데이터 유출 없고 공격 방지

---

## 1. 모니터링 체계 (Monitoring)

모니터링은 운영의 "눈"입니다. 모니터링이 없는 시스템은 시각장애인이 운전하는 것과 같아, 문제가 발생해도 모릅니다.

### 1.1 모니터링의 세 가지 계층

<MonitoringDashboardDemo />

**인프라 모니터링**: 서버 하드웨어 리소스에 집중

- CPU 사용률
- 메모리 사용률
- 디스크 공간과 I/O
- 네트워크 대역폭

**애플리케이션 모니터링**: 소프트웨어 실행 상태에 집중

- QPS(초당 요청 수)
- 응답 시간(지연)
- 에러율
- 의존 서비스 호출 상황

**비즈니스 모니터링**: 비즈니스 건전성에 집중

- DAU/MAU(일간/월간 활성 사용자)
- 주문량
- 결제 성공률
- 사용자 유지율

### 1.2 모니터링 도구 스택

| 도구           | 용도           | 특징                     |
| :------------- | :------------- | :----------------------- |
| **Prometheus** | 메트릭 수집 및 저장 | 시계열 데이터베이스, 모니터링 데이터에 적합 |
| **Grafana**    | 시각화 대시보드     | 강력한 차트와 대시보드   |
| **Zabbix**     | 종합 모니터링       | 전통적 도구, 기능 포괄적       |
| **Datadog**    | SaaS 모니터링 플랫폼  | 올인원 솔루션, 유료     |

---

## 2. 알림 시스템 (Alerting)

모니터링이 문제를 발견한 후, 운영 담당자에게 제때 알려야 하며, 이것이 바로 **알림**입니다.

### 2.1 알림 흐름

<AlertFlowDemo />

### 2.2 알림 레벨 설계

합리적인 알림 등급 분류는 "알림 피로"를 방지할 수 있습니다:

| 레벨   | 응답 시간        | 대표적 시나리오                   | 알림 채널           |
| :----- | :-------------- | :------------------------- | :----------------- |
| **P0** | 즉시(5분 내) | 핵심 서비스 다운, 결제 실패     | 전화 + SMS + Slack |
| **P1** | 30분 내        | 일부 기능 비정상, 성능 심각 저하 | SMS + Slack + 이메일 |
| **P2** | 당일 처리        | 리소스 사용률 높음, 간헐적 에러   | Slack + 이메일        |
| **P3** | 이번 주 내 처리        | 비핵심 문제, 최적화 제안       | 이메일               |

### 2.3 알림 통합과 노이즈 감소

**문제점**: 작은 문제 하나가 수백~수천 개의 알림을 유발하여 당직자가 둔감해질 수 있습니다.

**해결책**:

1. **알림 그룹화**: 유사한 알림을 병합(예: 같은 서버의 여러 문제를 하나로 병합)
2. **알림 억제**: 부모 문제가 이미 트리거되면, 자식 문제는 반복 알림하지 않음
3. **사일런스 규칙**: 유지보수 기간 동안 알림 자동 일시 정지
4. **빈도 제한**: 같은 알림이 짧은 시간 내에 반복 통지하지 않음

---

## 3. 로그 관리 (Logging)

로그는 문제 조사의 "블랙박스"입니다.

### 3.1 로그 레벨 분류

```javascript
console.debug('상세 디버그 정보') // 개발 시 사용
console.info('일반 정보') // 정상 흐름 기록
console.warn('경고 정보') // 잠재적 문제
console.error('에러 정보') // 주의가 필요한 에러
```

### 3.2 구조화된 로그

전통적 로그(좋지 않음):

```
2024-01-15 10:23:45 ERROR User john failed to login, attempts=3, ip=192.168.1.100
```

구조화된 로그(권장):

```json
{
  "timestamp": "2024-01-15T10:23:45Z",
  "level": "ERROR",
  "message": "User login failed",
  "user": "john",
  "attempts": 3,
  "ip": "192.168.1.100",
  "service": "auth-service"
}
```

### 3.3 ELK 로그 스택

**ELK = Elasticsearch + Logstash + Kibana**

- **Logstash**: 로그 수집 및 필터링
- **Elasticsearch**: 로그 저장 및 검색
- **Kibana**: 로그 시각화 조회

**모범 사례**:

- 민감 정보(비밀번호, 토큰)는 로그에 기록하지 않기
- 핵심 작업(로그인, 결제, 권한 변경)은 반드시 기록
- 로그에 컨텍스트 포함(사용자 ID, 요청 ID, 타임스탬프)
- 만료된 로그를 정기적으로 정리하여 디스크 가득 참 방지

---

## 4. 분산 추적 (Tracing)

마이크로서비스 아키텍처에서 하나의 요청이 10개 이상의 서비스를 거칠 수 있으며, 전체 경로를 어떻게 추적할까요?

**Trace ID와 Span ID**

- **Trace ID**: 전체 요청 체인의 유일한 식별자(택배 번호와 같음)
- **Span ID**: 개별 서비스 호출의 식별자(각 중계소와 같음)

### 4.1 분산 추적 데모

<TraceVisualizationDemo />

### 4.2 OpenTelemetry 표준

OpenTelemetry(OTel)는 분산 추적의 **업계 표준**으로, 통일된 API와 SDK를 제공합니다.

---

## 5. 장애 조사 프로세스

온라인 장애는 피할 수 없으며, 핵심은 **빠른 대응, 빠른 복구**입니다.

### 5.1 장애 처리 프로세스

<IncidentResponseDemo />

### 5.2 일반적인 조사 도구

| 도구         | 용도         | 대표적 시나리오                 |
| :----------- | :----------- | :----------------------- |
| **tcpdump**  | 패킷 캡처 분석     | 네트워크 연결 불가, 패킷 유실     |
| **strace**   | 시스템 호출 추적 | 프로세스 멈춤, 파일 권한 문제   |
| **Arthas**   | Java 진단    | CPU 급증, 메모리 누수, 데드락 |
| **top/htop** | 시스템 리소스 모니터링 | CPU/메모리 점유율 높음           |
| **netstat**  | 네트워크 연결 보기 | 포트 점유, 연결 수 비정상     |
| **lsof**     | 열린 파일 보기 | 파일이 점유됨, 디스크 가득 참       |

### 5.3 장애 포스트모템 (Post-mortem)

**포스트모템은 책임 추궁 회의가 아닙니다!**

포스트모템의 목적:

1. 장애 타임라인 정리
2. 근본 원인 분석(Root Cause Analysis)
3. 교훈 정리
4. 개선 조치 수립

**5 왜(5 Whys) 분석법**:

"왜"를 적어도 5번 물어서 근본 원인을 찾습니다:

- 왜 서비스가 다운되었는가?
  - 메모리 오버플로우 때문에
- 왜 메모리 오버플로우가 발생했는가?
  - 캐시 데이터가 너무 많아서
- 왜 캐시 데이터가 너무 많은가?
  - 만료 시간을 설정하지 않아서
- 왜 만료 시간을 설정하지 않았는가?
  - 개발 시 누락되어서
- **근본 원인**: 코드 리뷰와 테스트 케이스 부족

**핵심 포인트**: 비난 없는(blameless) 문화를 구축하고, 개인의 책임이 아닌 프로세스 개선에 집중.

---

## 6. 성능 최적화

### 6.1 성능 병목 분석

**위에서 아래로의 최적화 사고**:

```
사용자 체감
  ↓
프론트엔드 최적화(요청 감소, CDN, 지연 로딩)
  ↓
네트워크 최적화(HTTP/2, 압축, 긴 연결)
  ↓
백엔드 최적화(캐싱, 비동기, 배치 처리)
  ↓
데이터베이스 최적화(인덱스, 쿼리 최적화, 샤딩)
  ↓
시스템 최적화(커널 매개변수, JVM 튜닝)
```

### 6.2 캐시 최적화

**다계층 캐시 아키텍처**:

```
브라우저 캐시 (CDN)
  ↓
로컬 캐시 (메모리/Guava)
  ↓
분산 캐시 (Redis/Memcached)
  ↓
데이터베이스 (MySQL/PostgreSQL)
```

---

## 7. 용량 계획

### 7.1 용량 평가

<CapacityPlanningDemo />

### 7.2 부하 테스트

| 도구       | 특징                | 적용 시나리오      |
| :--------- | :------------------ | :------------ |
| **JMeter** | 기능이 강력하고 시각적    | HTTP 인터페이스 부하 테스트 |
| **wrk/ab** | 경량, 명령줄        | 빠른 벤치마크  |
| **Locust** | Python 스크립트, 분산 | 복잡한 시나리오 부하 테스트  |
| **K6**     | 최신, JS 스크립트       | CI/CD 통합    |

### 7.3 탄력적 자동 스케일링

**클라우드 네이티브 시대의 자동 스케일링**:

```yaml
# Kubernetes HPA (Horizontal Pod Autoscaler)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

**CPU 사용률이 70%를 초과하면 자동으로 Pod를 확장(최대 10개)**

---

## 8. 보안 운영

### 8.1 접근 제어

**최소 권한 원칙**:

- 개발자는 개발 환경에만 접근 가능
- 운영 담당자는 프로덕션 환경에만 접근 가능하며, 승인 필요
- 데이터베이스 민감 작업은 이중 확인 필요

**점프 서버 (Bastion Host)**:

모든 운영 작업은 점프 서버를 거치며, 완전한 작업 로그를 기록.

### 8.2 데이터 백업

**3-2-1 백업 원칙**:

- **3**개의 데이터 복사본(원본 1개 + 백업 2개)
- **2**가지 다른 저장 매체(로컬 디스크 + 클라우드 스토리지)
- **1**개의 오프사이트 백업(단일 재해 방지)

**백업 전략**:

| 유형         | 빈도 | 보유 기간 | RTO    | RPO     |
| :----------- | :--- | :------- | :----- | :------ |
| **전체 백업** | 매주 | 1개월   | 4시간 | 24시간 |
| **증분 백업** | 매일 | 1주일     | 2시간 | 1시간  |
| **실시간 백업** | 초 단위 | 7일     | 분 단위 | 초 단위    |

---

## 9. 자동화 운영 (DevOps)

### 9.1 CI/CD 파이프라인

```yaml
# .gitlab-ci.yml 예시
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - npm install
    - npm test
  tags:
    - docker

build:
  stage: build
  script:
    - docker build -t myapp:$CI_COMMIT_SHA .
    - docker push registry.example.com/myapp:$CI_COMMIT_SHA
  only:
    - main

deploy:
  stage: deploy
  script:
    - kubectl set image deployment/myapp myapp=registry.example.com/myapp:$CI_COMMIT_SHA
  environment:
    name: production
  when: manual # 수동으로 배포 트리거
```

### 9.2 Infrastructure as Code (IaC)

**Terraform 예시**(클라우드 리소스 관리):

```hcl
# main.tf
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "WebServer"
    Env  = "production"
  }
}

resource "aws_security_group" "web" {
  name = "web-sg"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

### 9.3 GitOps 실천

**GitOps = Git + IaC + Automation**

핵심 이념: **Git 저장소가 인프라의 유일한 진실 공급원**

---

## 10. 요약과 모범 사례

### 10.1 운영 성숙도 모델

| 등급     | 특징               | 실천                           |
| :------- | :----------------- | :----------------------------- |
| **초급** | 수동 대응, 인적 조작 | 문제가 생기면 처리, 수동 배포         |
| **중급** | 자동화, 표준화     | CI/CD, 모니터링 알림, 문서화        |
| **고급** | 예방 위주, 자가 복구     | 용량 계획, 장애 훈련, 자동 스케일링 |
| **전문가** | 지능화, 무인 운영   | AIOps, 카오스 엔지니어링, Serverless    |

### 10.2 학습 로드맵

**입문 단계** (1~3개월):

- Linux 일반 명령어 학습
- 모니터링 시스템 이해(Prometheus + Grafana)
- 로그 조회 숙지(ELK)

**심화 단계** (3~6개월):

- 컨테이너 기술 심층 이해(Docker + K8s)
- 진단 도구 하나 마스터(Arthas, tcpdump)
- CI/CD 파이프라인 실천

**고급 단계** (6~12개월):

- 성능 튜닝(데이터베이스, JVM, 네트워크)
- 용량 계획과 비용 최적화
- 장애 포스트모템과 프로세스 개선

**전문가 단계** (1년 이상):

- 아키텍처 설계(고가용성, 재해 복구)
- 카오스 엔지니어링(적극적인 장애 주입)
- AIOps(지능형 운영)

---

## 11. 용어 빠른 참조표 (Glossary)

| 용어            | 약칭                              | 설명                                           |
| :-------------- | :-------------------------------- | :--------------------------------------------- |
| **Monitoring**  | -                                 | 모니터링, 시스템 실행 상태를 실시간으로 관측.                   |
| **Alerting**    | -                                 | 알림, 비정상 시 관련 담당자에게 통지.                     |
| **Logging**     | -                                 | 로깅, 시스템 실행 중 이벤트를 기록.               |
| **Tracing**     | -                                 | 분산 추적, 분산 시스템에서 요청의 전체 경로를 추적.   |
| **QPS**         | Queries Per Second                | 초당 요청 수, 시스템 처리량 측정.                   |
| **Latency**     | -                                 | 지연, 요청이 발생하여 응답까지의 시간.           |
| **RTO**         | Recovery Time Objective           | 복구 시간 목표, 서비스가 최대 중단 가능 시간.               |
| **RPO**         | Recovery Point Objective          | 복구 지점 목표, 최대 손실 가능한 데이터 양.                 |
| **Post-mortem** | -                                 | 장애 포스트모템, 장애 원인과 개선 조치 분석.             |
| **CI/CD**       | Continuous Integration/Delivery   | 지속적 통합과 지속적 전달, 자동화 테스트와 배포.         |
| **IaC**         | Infrastructure as Code            | Infrastructure as Code, 코드로 서버, 네트워크 등 리소스를 관리. |
| **GitOps**      | -                                 | Git 운영, Git 저장소가 인프라의 유일한 진실 공급원.   |
| **ELK**         | Elasticsearch + Logstash + Kibana | 로그 수집, 저장, 시각화 3종 세트.                 |
| **SLA**         | Service Level Agreement           | 서비스 수준 협약, 약속된 서비스 가용성(예: 99.9%).   |
| **Blameless**   | -                                 | 비난 없는 문화, 포스트모템에서 개인 책임이 아닌 프로세스 개선에 집중.     |

---

## 12. 더 읽어보기

- **[시스템 캐시 설계](/ko-kr/appendix/4-server-and-backend/caching)** - 캐시 원리, 패턴과 모범 사례
- **[메시지 큐 설계](/ko-kr/appendix/4-server-and-backend/message-queues)** - 피크 쉐이빙, 비동기 디커플링
- **[인증 원리와 실전](/ko-kr/appendix/4-server-and-backend/auth-authorization)** - 인증 및 권한 부여, 보안 강화
- **[백엔드 진화사](/ko-kr/appendix/4-server-and-backend/backend-layered-architecture)** - 모놀리식에서 마이크로서비스, 그리고 Serverless까지
- **[배포와 온라인](/ko-kr/appendix/7-infrastructure-and-operations/ci-cd)** - 개발에서 프로덕션까지의 마지막 마일
