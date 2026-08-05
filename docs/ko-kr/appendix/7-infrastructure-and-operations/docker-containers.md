# Docker 컨테이너 기초

::: tip 서론
**"내 컴퓨터에서는 잘 돌아가"는 개발자의 가장 고전적인 변명이며, Docker는 이 변명을 완전히 없애버립니다.** 컨테이너화 기술은 애플리케이션과 모든 의존성을 표준화된 단위로 패키징하여, 어떤 환경에서든 일관되게 실행되도록 보장합니다. 이것은 현대 소프트웨어 전달의 초석입니다.
:::

**이 글에서 무엇을 배우게 될까요?**

이 장을 마치면 다음을 얻게 됩니다:

- **핵심 개념**: 이미지, 컨테이너, 레지스트리 3대 핵심 개념 이해
- **아키텍처 비교**: 컨테이너와 가상 머신의 본질적 차이 파악
- **실무 능력**: Dockerfile 작성 및 일반적인 명령어 숙지
- **오케스트레이션 기초**: Docker Compose로 다중 서비스 애플리케이션 관리
- **모범 사례**: 이미지 최적화, 보안 강화 등 프로덕션급 실무 이해

| 장 | 내용 | 핵심 개념 |
|-----|------|---------|
| **제1장** | 컨테이너가 필요한 이유 | 환경 일관성, 리소스 효율, 표준화된 전달 |
| **제2장** | 핵심 개념 | 이미지, 컨테이너, 레지스트리, Dockerfile |
| **제3장** | Docker 수명 주기 | 작성, 빌드, 푸시, 실행, 관리 |
| **제4장** | Docker Compose | 다중 서비스 오케스트레이션, 네트워크, 데이터 볼륨 |
| **제5장** | 모범 사례 | 이미지 최적화, 보안, 멀티 스테이지 빌드 |

---

## 1. 컨테이너가 필요한 이유는 개요
컨테이너가 등장하기 전에는 애플리케이션을 배포하려면 서버에서 런타임을 수동으로 설치하고, 환경 변수를 설정하고, 의존성 충돌을 해결해야 했습니다. 서로 다른 환경(개발, 테스트, 프로덕션) 간의 차이는 버그의 온상이었습니다.

<DockerArchitectureDemo />

### 컨테이너가 해결하는 문제

| 문제 | 전통적 방식 | 컨테이너 방식 |
|------|---------|---------|
| 환경 불일치 | "내 로컬에서는 돌아가" | 모든 의존성을 패키징하여 어디서든 일관됨 |
| 의존성 충돌 | App A는 Node 14, App B는 Node 18 필요 | 각 컨테이너가 독립된 환경 |
| 리소스 낭비 | 각 VM마다 완전한 OS | 커널 공유, MB 단위 오버헤드 |
| 배포 속도 | 수동 설치 및 설정 | docker run 명령 하나로 완료 |
| 확장 어려움 | 새 VM 생성, 환경 설치, 배포 | 초 단위로 새 컨테이너 시작 |

::: tip 컨테이너의 본질
컨테이너는 경량 가상 머신이 아닙니다. 그 본질은 **격리된 프로세스**입니다. Linux 커널은 두 가지 메커니즘을 통해 컨테이너를 구현합니다:
- **Namespace**: 프로세스의 시야를 격리(PID, 네트워크, 파일 시스템 등)
- **Cgroups**: 프로세스의 리소스 사용을 제한(CPU, 메모리, IO)

컨테이너 안의 프로세스와 호스트의 일반 프로세스는 본질적으로 같지만, "바깥을 볼 수 없는 방"에 갇혀 있을 뿐입니다.
:::

---

## 2. 핵심 개념

Docker의 세계는 이미지(Image), 컨테이너(Container), 레지스트리(Registry)라는 세 가지 핵심 개념을 중심으로 돌아갑니다.

| 개념 | 비유 | 설명 |
|------|------|------|
| 이미지(Image) | 클래스 / 템플릿 | 읽기 전용 애플리케이션 템플릿으로 코드, 런타임, 라이브러리, 설정을 포함 |
| 컨테이너(Container) | 인스턴스 / 객체 | 이미지의 실행 인스턴스로 읽기/쓰기가 가능하며 독립적인 수명 주기를 가짐 |
| 레지스트리(Registry) | 앱 스토어 | 이미지를 저장하고 배포하는 서비스(Docker Hub, ACR, ECR) |
| Dockerfile | 레시피 / 청사진 | 이미지를 구축하는 방법을 정의하는 텍스트 파일 |
| 데이터 볼륨(Volume) | 외장 하드 | 데이터를 영속화하며 컨테이너가 삭제되어도 데이터가 유지됨 |

### 이미지의 계층 구조

Docker 이미지는 여러 개의 읽기 전용 계층(Layer)으로 겹겹이 쌓여 있으며, 각 Dockerfile 명령어가 하나의 계층을 만듭니다:

```
┌─────────────────────────┐
│  CMD ["node", "app.js"] │  ← 시작 명령 계층
├─────────────────────────┤
│  COPY . /app            │  ← 애플리케이션 코드 계층 (자주 변경)
├─────────────────────────┤
│  RUN npm install        │  ← 의존성 설치 계층 (가끔 변경)
├─────────────────────────┤
│  FROM node:18-alpine    │  ← 기본 이미지 계층 (거의 변경 안 됨)
└─────────────────────────┘
```

::: tip 왜 계층화가 중요한가?
Docker는 각 계층을 캐싱합니다. 특정 계층에 변화가 없으면 빌드 시 캐시를 직접 재사용합니다. 따라서 Dockerfile에서 **변경 빈도가 낮은 명령은 앞에**(예: 의존성 설치), **변경 빈도가 높은 명령은 뒤에**(예: 코드 복사) 배치해야 합니다. 이렇게 하면 대부분의 빌드에서 캐시를 적중하여 속도가 훨씬 빨라집니다.
:::

---

## 3. Docker 수명 주기

Dockerfile 작성부터 컨테이너 실행까지, Docker의 작업 흐름은 명확한 파이프라인입니다.

<DockerLifecycleDemo />

### Dockerfile 일반 명령어 빠른 참조

| 명령어 | 역할 | 예시 |
|------|------|------|
| `FROM` | 기본 이미지 지정 | `FROM node:18-alpine` |
| `WORKDIR` | 작업 디렉토리 설정 | `WORKDIR /app` |
| `COPY` | 파일을 이미지로 복사 | `COPY package.json ./` |
| `RUN` | 빌드 시 명령 실행 | `RUN npm install` |
| `ENV` | 환경 변수 설정 | `ENV NODE_ENV=production` |
| `EXPOSE` | 포트 선언(문서 목적으로만) | `EXPOSE 3000` |
| `CMD` | 컨테이너 시작 명령 | `CMD ["node", "app.js"]` |
| `ENTRYPOINT` | 컨테이너 진입점(덮어쓰기 어려움) | `ENTRYPOINT ["nginx"]` |

---

## 4. Docker Compose: 다중 서비스 오케스트레이션

실제 프로젝트는 보통 컨테이너 하나가 아닙니다. 하나의 웹 애플리케이션에 애플리케이션 서버 + 데이터베이스 + Redis + Nginx가 필요할 수 있습니다. Docker Compose는 하나의 YAML 파일로 여러 컨테이너를 정의하고 관리합니다.

### docker-compose.yml 예시

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db
      - REDIS_HOST=redis
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=secret

  redis:
    image: redis:7-alpine

volumes:
  db-data:
```

::: tip 서비스 디스커버리
Docker Compose에서 서비스 이름이 호스트 이름입니다. app 컨테이너에서 `db:5432`로 데이터베이스에 직접 접속하고, `redis:6379`로 Redis에 접속할 수 있으며, IP 주소를 알 필요가 없습니다. 이것은 Docker에 내장된 DNS 덕분입니다.
:::

---

## 5. 모범 사례

### 5.1 멀티 스테이지 빌드(Multi-stage Build)

멀티 스테이지 빌드는 이미지 크기를 최적화하는 강력한 도구입니다. 빌드 단계에서는 모든 도구와 의존성을 설치하고, 최종 단계에서는 런타임에 필요한 파일만 유지합니다.

```dockerfile
# 빌드 단계
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 실행 단계
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### 5.2 이미지 최적화 체크리스트

| 최적화 항목 | 방법 | 효과 |
|--------|------|------|
| 작은 기본 이미지 선택 | `ubuntu` 대신 `alpine` 사용 | 이미지 크기 ~200MB → ~50MB |
| RUN 명령어 병합 | 여러 명령을 `&&`로 연결 | 이미지 계층 수 감소 |
| .dockerignore 사용 | node_modules, .git 등 제외 | 빌드 속도 향상, 컨텍스트 크기 감소 |
| 멀티 스테이지 빌드 | 빌드 환경과 실행 환경 분리 | 최종 이미지에 빌드 도구 미포함 |
| 버전 번호 고정 | `node:latest` 대신 `node:18.17-alpine` | 빌드 재현성 보장 |

### 5.3 보안 실무

| 실무 | 설명 |
|------|------|
| root로 실행하지 않기 | `USER node`로 비 root 사용자 지정 |
| 취약점 스캔 | `docker scout` 또는 Trivy로 이미지 스캔 |
| 최소 권한 | 필요한 패키지만 설치, 디버그 도구 미설치 |
| 비밀번호 하드코딩 금지 | 환경 변수 또는 Docker Secrets 사용 |
| 기본 이미지 정기 업데이트 | 보안 취약점 적시 수정 |

---

## 요약

Docker 컨테이너화는 현대 소프트웨어 전달의 인프라로, 모든 개발자에게 이해가 필수적입니다.

핵심 포인트 복습:

1. **컨테이너 vs 가상 머신**: 컨테이너는 호스트 커널을 공유하여 더 가볍고 빠르지만, 격리성은 VM보다 약간 낮음
2. **핵심 3대 요소**: 이미지(템플릿), 컨테이너(인스턴스), 레지스트리(배포)
3. **Dockerfile**: 계층 빌드, 캐시 활용, 변경이 적은 명령을 앞에 배치
4. **Docker Compose**: YAML로 다중 서비스 애플리케이션을 정의하고, 서비스 이름이 호스트 이름
5. **프로덕션 실무**: 멀티 스테이지 빌드로 이미지 축소, alpine 기본 이미지, 비 root 실행

## 더 읽어보기

- [Docker 공식 문서](https://docs.docker.com/) - 가장 권위 있는 참고 자료
- [Docker Getting Started](https://docs.docker.com/get-started/) - 공식 초보자 튜토리얼
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/) - 공식 모범 사례 가이드
- [Docker Compose 문서](https://docs.docker.com/compose/) - Compose 완전 참조
