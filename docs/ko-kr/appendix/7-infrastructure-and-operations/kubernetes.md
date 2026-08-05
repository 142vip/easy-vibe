# Kubernetes 오케스트레이션 원리

::: tip 서론
**Docker는 "패키징" 문제를 해결했고, Kubernetes는 "관리" 문제를 해결했습니다.** 수십~수백 개의 컨테이너를 배포, 확장, 장애 복구해야 할 때 수동 관리는 현실적이지 않습니다. Kubernetes(K8s)는 컨테이너의 "운영체제"로, 컨테이너화된 애플리케이션의 배포, 확장, 운영을 자동화합니다.
:::

**이 글에서 무엇을 배우게 될까요?**

이 장을 마치면 다음을 얻게 됩니다:

- **아키텍처 이해**: K8s 컨트롤 플레인과 워커 노드의 구성 파악
- **핵심 리소스**: Pod, Deployment, Service 등 핵심 개념 숙지
- **선언형 관리**: "원하는 상태를 선언하면 시스템이 자동으로 수렴"하는 사상 이해
- **운영 능력**: 롤링 업데이트, 자동 스케일링, 헬스 체크 등 메커니즘 이해
- **실전 입문**: kubectl과 YAML로 완전한 애플리케이션을 배포할 수 있는 능력

| 장 | 내용 | 핵심 개념 |
|-----|------|---------|
| **제1장** | K8s가 필요한 이유 | 컨테이너 오케스트레이션의 도전 |
| **제2장** | K8s 아키텍처 | 컨트롤 플레인, 워커 노드, etcd |
| **제3장** | 핵심 리소스 | Pod, Deployment, Service, Ingress |
| **제4장** | 선언형 관리 | YAML, kubectl, 제어 루프 |
| **제5장** | 운영 실무 | 롤링 업데이트, HPA, 헬스 체크 |

---

## 1. Kubernetes 도입 동기
Docker는 단일 컨테이너의 패키징과 실행을 간단하게 만들었지만, 다음 시나리오에 직면하면 수동 관리가 한계에 도달합니다:

| 도전 | 설명 | K8s의 해결책 |
|------|------|---------------|
| 다중 인스턴스 배포 | 하나의 서비스에 10개의 복제본 실행 필요 | Deployment가 복제본 수를 자동 관리 |
| 장애 복구 | 특정 컨테이너가 다운되면 자동 재시작 필요 | 컨트롤러가 자동 감지하여 Pod 재생성 |
| 서비스 디스커버리 | 컨테이너 IP가 변경되는데, 서로 어떻게 찾는가? | Service가 안정적인 DNS와 IP 제공 |
| 롤링 업데이트 | 버전 업데이트 시 서비스 중단 불가 | 기존 Pod를 점진적으로 교체하여 제로 다운타임 |
| 탄력적 확장 | 트래픽 피크 시 자동 확장 | HPA가 CPU/메모리에 따라 복제본 수를 자동 조정 |
| 리소스 스케줄링 | 컨테이너를 가장 적합한 머신에 배치 | Scheduler가 지능적으로 스케줄링 |

::: tip K8s의 핵심 사상: 선언형
K8s에게 "컨테이너 3개를 시작해"(명령형)라고 말할 필요 없이, "복제본 3개를 실행하고 싶어"(선언형)라고 말합니다. K8s는 지속적으로 모니터링하여 실제 상태가 선언한 원하는 상태와 일치하도록 보장합니다. 하나의 Pod가 다운되면 자동으로 새로운 것을 만들어 보충합니다.
:::

---

## 2. Kubernetes 아키텍처

K8s 클러스터는 컨트롤 플레인(Control Plane)과 워커 노드(Worker Node)로 구성됩니다.

<K8sArchitectureDemo />

### 한 번의 요청이 거치는 전체 경로

```
사용자 요청 → Ingress Controller → Service → kube-proxy → Pod(컨테이너)
                                              ↑
                                    Endpoint 목록(Service가 유지)
```

---

## 3. 핵심 리소스 객체

K8s는 다양한 "리소스 객체"를 통해 클러스터의 원하는 상태를 설명합니다.

<K8sWorkloadsDemo />

### 리소스 객체 분류

| 카테고리 | 리소스 | 용도 |
|------|------|------|
| 워크로드 | Pod, Deployment, StatefulSet, DaemonSet, Job | 애플리케이션 실행 |
| 네트워크 | Service, Ingress, NetworkPolicy | 서비스 디스커버리와 트래픽 관리 |
| 설정 | ConfigMap, Secret | 설정 및 민감 데이터 관리 |
| 스토리지 | PersistentVolume, PersistentVolumeClaim | 영속 스토리지 |
| 스케줄링 | Node, Namespace, ResourceQuota | 리소스 격리 및 제한 |

---

## 4. 선언형 관리와 kubectl

### 제어 루프(Reconciliation Loop)

K8s의 핵심 작동 메커니즘은 제어 루프입니다:

```
관찰(Observe)→ 비교(Diff)→ 행동(Act)→ 관찰...
     ↓                ↓              ↓
  실제 상태 읽기    원하는 상태와 비교    수정 작업 실행
```

`replicas: 3`을 선언하면, 컨트롤러가 실행 중인 Pod가 2개뿐임을 발견하면 1개를 새로 만듭니다. 이 루프는 몇 초마다 실행되어 시스템이 항상 원하는 상태로 수렴하도록 보장합니다.

### kubectl 일반 명령어

| 명령어 | 역할 | 예시 |
|------|------|------|
| `kubectl apply -f` | YAML 설정 적용 | `kubectl apply -f deployment.yaml` |
| `kubectl get` | 리소스 목록 보기 | `kubectl get pods -o wide` |
| `kubectl describe` | 리소스 상세 정보 보기 | `kubectl describe pod my-app-xxx` |
| `kubectl logs` | Pod 로그 보기 | `kubectl logs -f my-app-xxx` |
| `kubectl exec` | Pod 터미널 진입 | `kubectl exec -it my-app-xxx -- sh` |
| `kubectl delete` | 리소스 삭제 | `kubectl delete -f deployment.yaml` |
| `kubectl scale` | 수동 확장/축소 | `kubectl scale deploy my-app --replicas=5` |

::: tip apply vs create
`kubectl create`는 명령형입니다 — "이 리소스를 만들어"라고 하며, 이미 존재하면 에러가 발생합니다. `kubectl apply`는 선언형입니다 — "리소스가 이 상태이도록 보장"하며, 존재하지 않으면 만들고, 이미 존재하면 업데이트합니다. 프로덕션 환경에서는 항상 `apply`를 사용해야 합니다.
:::

---

## 5. 운영 실무

### 5.1 롤링 업데이트와 롤백

Deployment는 기본적으로 롤링 업데이트 전략을 사용합니다: 새 버전의 Pod를 점진적으로 만들고, 동시에 기존 버전의 Pod를 점진적으로 종료합니다.

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # 최대 1개의 Pod를 추가로 생성
      maxUnavailable: 0   # 사용 불가능한 Pod를 허용하지 않음
```

### 5.2 자동 스케일링(HPA)

HPA(Horizontal Pod Autoscaler)는 CPU, 메모리 또는 커스텀 메트릭에 따라 Pod 복제본 수를 자동으로 조정합니다.

```yaml
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

### 5.3 헬스 체크(Probe)

K8s는 세 가지 프로브를 통해 Pod의 건강 상태를 모니터링합니다:

| 프로브 | 역할 | 실패 시 결과 |
|------|------|---------|
| livenessProbe | 컨테이너가 살아 있는지 감지 | 컨테이너 재시작 |
| readinessProbe | 컨테이너가 준비되었는지 감지 | Service에서 제거하여 트래픽 수신 중단 |
| startupProbe | 컨테이너 시작이 완료되었는지 감지 | 시작 기간 동안 다른 프로브 실행하지 않음 |

::: tip 프로브의 중요성
헬스 체크를 설정하지 않은 Pod는 K8s가 프로세스 존재 여부로만 건강 상태를 판단할 수 있습니다. 하지만 프로세스는 살아 있어도 서비스가 응답하지 않는 경우(예: 데드락, OOM 임계)가 많습니다. livenessProbe를 설정하면 K8s가 이러한 "가짜 죽음" 상태의 컨테이너를 자동으로 재시작할 수 있습니다.
:::

---

## 요약

Kubernetes는 컨테이너 오케스트레이션의 사실상 표준이며, 핵심 개념을 이해하는 것이 클라우드 네이티브 개발의 기초입니다.

핵심 포인트 복습:

1. **선언형 관리**: K8s에게 "무엇을 원하는지"를 말하고, "어떻게 할 것인지"가 아니라, 제어 루프가 자동으로 수렴
2. **아키텍처 계층**: 컨트롤 플레인이 의사결정을 담당하고, 워커 노드가 실행을 담당하며, etcd가 상태를 저장
3. **핵심 리소스**: Pod(최소 단위), Deployment(복제본 관리), Service(서비스 디스커버리), Ingress(외부 진입점)
4. **운영 자동화**: 롤링 업데이트 제로 다운타임, HPA 탄력적 스케일링, 프로브 자동 장애 복구
5. **설정 분리**: ConfigMap과 Secret으로 설정과 이미지를 분리

## 더 읽어보기

- [Kubernetes 공식 문서](https://kubernetes.io/ko/docs/) - 가장 권위 있는 한국어 참조
- [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) - 처음부터 수동으로 K8s 클러스터 구축
- [The Illustrated Children's Guide to Kubernetes](https://www.cncf.io/phippy/) - CNCF의 재미있는 입문서
- [Kubernetes Patterns](https://www.oreilly.com/library/view/kubernetes-patterns-2nd/9781098131678/) - K8s 설계 패턴
