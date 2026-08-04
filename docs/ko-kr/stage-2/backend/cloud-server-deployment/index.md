<script setup>
import RelatedArticlesSection from '../../../../.vitepress/theme/components/RelatedArticlesSection.vue'
import { relatedArticlesMap } from '../../../../.vitepress/theme/data/relatedArticles'
</script>

# 웹사이트 공개하기 (고급): 직접 VPS 서버를 준비해서 배포하기

> 💡 **"웹사이트를 인터넷에 공개한다"는 무슨 뜻인가요?** "라이브(live) 전환" 또는 "배포/퍼블리싱"이라고도 합니다. 내 컴퓨터에서 만든 웹사이트는 나만 열어볼 수 있습니다. **인터넷에 공개한다는 것은 24시간 실행되는 서버에 웹사이트를 올려서, 누구나 브라우저에 URL을 입력하면 접속할 수 있게 만드는 것**을 뜻합니다. 마치 나만 읽을 수 있는 Word 문서를 블로그에 올리면 모두가 볼 수 있게 되는 것과 같습니다. 차이점은 이번에는 완전한 웹사이트를 공개한다는 것입니다.

지난 장에서는 Vercel이나 Zeabur 같은 원클릭 PaaS 플랫폼을 이용하는 가장 쉬운 공개 방법을 배웠습니다. 이번 장에서는 더 유연하고 직접 하는 방법을 다룹니다. **클라우드 서버를 직접 구매하고, 처음부터 모든 것을 설정해서 직접 배포하는 방법**입니다. 서버 고르는 법, 서버에 연결하는 법, 환경 설치, Nginx 설정, 도메인 연결, HTTPS 활성화까지 배우게 됩니다. 이 과정을 이해하면 어떤 플랫폼도 나를 제한할 수 없습니다. 원하는 서비스를 마음껏 실행할 수 있습니다.

---

# 0. 현명하게 선택하기: 배포 플랫폼 결정 트리

플랫폼을 선택하기 전에 세 가지 질문에 먼저 답해 보세요.

1. **프로젝트가 24시간 실행되어야 하나요?**
   - 아니요 (접속할 때만 응답, 예: 문서, 블로그, 정적 사이트) → **정적 호스팅 / PaaS**
   - 예 (cron 작업, 크롤러, Telegram/Discord 봇, WebSocket 서비스) → **상시 실행 PaaS 또는 VPS**

2. **GPU가 필요한가요?**
   - 아니요 (OpenAI/Anthropic API만 호출) → 일반 플랫폼으로 충분
   - 예 (오픈소스 모델 실행, 이미지/동영상 생성) → **GPU 클라우드 플랫폼** (Modal, Replicate, Lambda Labs)

3. **사용자는 주로 어디에 있나요?**
   - 글로벌 / 미국·유럽 → Vercel / Railway / Fly.io / AWS
   - 중국 본토 → 중국 클라우드 (알리클라우드 / 텐센트 클라우드) 또는 Cloudflare (중국에서 속도가 빠름)
   - 둘 다 → CDN을 사용하고, 중국 대상 자산은 중국 클라우드에, 글로벌은 AWS에 배포하되 GeoDNS 사용

```
어떤 유형의 프로젝트를 배포하나요?
│
├─ 순수 프론트엔드 정적 사이트 (Vite/React/Vue 빌드 결과물)
│   ├─ 완전 무료로 → Cloudflare Pages (무제한 대역폭) / GitHub Pages
│   ├─ Next.js 프로젝트 → Vercel (공식 플랫폼, 개발 경험 최고)
│   └─ 중국 사용자 위주 → Cloudflare Pages 또는 국내 OSS+CDN
│
├─ 백엔드 API, 상시 실행 불필요 (요청 시 트리거)
│   ├─ Node.js/Python API → Vercel Functions / Cloudflare Workers
│   └─ 풀스택 프레임워크 (Next.js/Nuxt/SvelteKit) → Vercel
│
├─ 상시 실행 프로세스 필요 (봇, cron, WebSocket)
│   ├─ 서버 관리를 원하지 않는다면 → Railway / Render / Fly.io
│   ├─ 완전한 제어와 비용 절감 → VPS 구매 (DigitalOcean / Vultr / Hetzner / AWS EC2)
│   └─ 중국 대상 프로젝트 → 텐센트 클라우드 라이트하우스 / 알리클라우드 ECS
│
├─ AI 모델 / GPU 실행 필요
│   ├─ 추론 API → Modal / Replicate / Hugging Face Inference
│   ├─ 학습/파인튜닝 → Modal / Lambda Labs
│   └─ 중국 GPU → AutoDL / 알리클라우드 PAI
│
└─ 규모가 큰 운영 프로젝트
    └─ AWS/GCP + Kubernetes (DevOps를 고용하거나 AI에게 Terraform 작성을 맡기세요)
```

---

# 1. 무료/저비용 배포 플랫폼 자세히 보기 (서버 불필요)

대부분의 개인 프로젝트, 데모, 포트폴리오에는 **서버를 아예 구매할 필요가 없습니다.** 이 절에서는 가장 인기 있는 무료/저비용 플랫폼의 가입 방법, 사용 방법, 주의할 점을 자세히 소개합니다.

## 1.1 Vercel — Next.js/프론트엔드의 첫 번째 선택

**웹사이트:** https://vercel.com

**적합한 대상:** Next.js 프로젝트, React/Vue 프론트엔드, Serverless Functions를 사용하는 풀스택 앱, AI 챗봇 (응답 속도가 빠름)

**사용 방법:**
1. GitHub 계정으로 가입
2. "Add New..." → "Project" 클릭
3. GitHub 저장소 선택
4. Vercel이 프레임워크를 자동 감지 (Next.js/Vite/React 등), 환경 변수 입력
5. "Deploy" 클릭 — 1~2분 안에 `xxx.vercel.app` 주소로 사이트가 공개됩니다

**무료 티어 (Hobby 플랜):**
- 월 100GB 대역폭
- 월 100시간 빌드 시간
- Serverless Function 실행 시간 **10초** (가장 중요한 제한!)
- 자동 HTTPS, 글로벌 CDN, PR 미리보기 링크

**유료 (Pro, 월 $20):**
- 함수 타임아웃 60~300초로 확장
- 1TB 대역폭
- 팀 협업 기능

**⚠️ 초보자가 부딪히는 주요 제한 사항:**
- **무료 티어의 10초 함수 타임아웃**: 10초가 넘는 AI API 호출은 연결이 끊깁니다. Pro 티어($20/월)는 60초로, 300초는 추가 비용
- **상시 실행 프로세스 불가**: cron도, WebSocket 롱폴링도, 영구 실행 봇도 불가능
- **콜드 스타트**: 한동안 사용하지 않은 함수는 첫 요청 시 느릴 수 있음
- **AI 프로젝트 비용**: 스트리밍 AI 응답은 대역폭을 소모하며, 트래픽이 많으면 Pro 요금이 월 $200까지 오를 수 있음

**평가:** Vercel은 프론트엔드 페이지, 문서, 빠른 데모 배포에 가장 매끄러운 경험을 제공합니다. 하지만 상시 실행 에이전트나 오래 걸리는 AI 호출에는 Vercel을 쓰지 마세요.

## 1.2 Cloudflare Pages — 무제한 대역폭, 전 세계에서 빠름

**웹사이트:** https://pages.cloudflare.com

**적합한 대상:** 정적 사이트, 대역폭 사용이 많은 프로젝트, 글로벌 사용자, Edge Functions

**무료 티어:**
- **무제한 대역폭** (가장 큰 장점!)
- 월 500회 빌드
- 무제한 요청
- Cloudflare Workers: 하루 100,000회 요청
- 전 세계 300개 이상의 엣지(edge) 지역, 중국에서도 괜찮은 속도

**사용 방법:**
1. Cloudflare 무료 계정 가입
2. Workers & Pages → Create → Pages → Connect to Git 이동
3. 저장소 선택, 빌드 명령 설정 (Vite: `npm run build`, 출력 디렉터리: `dist`)
4. Save and Deploy 클릭

**보너스: Workers AI:** Cloudflare는 엣지 노드에서 오픈소스 AI 모델(Llama 3, Mistral, Stable Diffusion)도 실행할 수 있게 해주며, 하루 10,000 뉴런(neuron)을 무료로 제공합니다. OpenAI API에 의존하지 않고 작은 모델을 실행하기에 좋습니다.

**평가:** 정적 사이트, 특히 글로벌 사용자를 대상으로 하는 프로젝트에 최고의 선택입니다. 무제한 대역폭은 정말 매력적인 기능입니다.

## 1.3 Railway — 백엔드 서비스에 최적의 경험 (상시 실행)

**웹사이트:** https://railway.app

**적합한 대상:** 상시 실행 백엔드 서비스, Node.js/Python/Go API, Discord/Telegram 봇, 데이터베이스가 필요한 풀스택 프로젝트

**사용 방법:**
1. GitHub로 가입
2. New Project → Deploy from GitHub repo (또는 템플릿 선택)
3. Railway가 프로젝트 유형을 자동 감지해 의존성 설치, 빌드, 시작을 처리
4. 원클릭으로 PostgreSQL/Redis/MySQL/MongoDB 데이터베이스 추가
5. 자동 생성된 도메인 또는 커스텀 도메인 연결

**요금:**
- 신규 사용자는 **$5 체험 크레딧** 제공 (영구 무료 아님)
- 이후 사용량 기반 과금, 대략 월 $5부터 시작 (최소 사양 상시 서비스 + DB)
- 5분 유휴 시 절전 (무료 체험 중); 결제 후에는 절전 없음

**평가:** Railway는 백엔드 API, 봇, 데이터베이스가 필요한 풀스택 앱 배포에 최고의 경험을 제공합니다. GitHub 자동 배포, 내장 데이터베이스, 로그와 모니터링이 모두 포함되어 있습니다.

## 1.4 Fly.io — 진짜 24시간 무료 컨테이너

**웹사이트:** https://fly.io

**적합한 대상:** 지연 시간이 낮은 글로벌 분산 서비스, **진짜 무료 24시간** 컨테이너를 원하는 분, 어느 정도 학습 곡선을 감수할 수 있는 분

**무료 티어:**
- 마이크로 공유 VM 3개 (micro-1x, 256MB RAM)
- **실행 시간 제한 없음** (Render처럼 절전 없음)
- 월 160GB 아웃바운드 트래픽
- 3GB 영구 볼륨
- 전 세계 30개 이상 데이터센터 리전
- GPU 지원 (A100/H100)

**사용 방법:**
1. 가입 시 신용카드 필요 (청구되지는 않음, 본인 확인용)
2. flyctl CLI 설치
3. 프로젝트에 `fly.toml` 설정 파일 작성 (AI가 생성해 줄 수 있음)
4. `fly launch` → Docker 이미지 자동 빌드, IP 할당, 배포
5. 업데이트는 `fly deploy`, 로그 확인은 `fly logs`

**평가:** 봇/API/cron 작업을 위한 **진짜 24시간 무료 컨테이너**가 필요하다면 Fly.io가 최고의 무료 옵션입니다. 대신 flyctl 명령어와 Docker 기초를 배워야 합니다.

## 1.5 Render — 750시간 무료지만 절전 있음

**웹사이트:** https://render.com

**적합한 대상:** 학습 단계, 개인 프로젝트, 콜드 스타트를 신경 쓰지 않는 프로젝트

**무료 티어:**
- Web Service: 월 750시간 (인스턴스 1개 연속 실행)
- PostgreSQL: 90일 무료 (⚠️ 이후 DB가 삭제됩니다!)
- 정적 사이트: 완전 무료, 100GB 대역폭

**⚠️ 핵심 문제:**
- **15분 유휴 후 절전**, 콜드 스타트에 10~30초 소요 (UX 좋지 않음)
- 무료 데이터베이스는 90일 후 삭제 — 백업을 꼭 해 두세요!

**평가:** 개발/테스트/학교 프로젝트에는 좋지만, 실사용자가 있는 운영 프로젝트를 무료 티어에 올리지 마세요. 절전을 해제하려면 월 $7부터 결제가 필요합니다.

## 1.6 기타 주목할 만한 플랫폼

| 플랫폼 | 유형 | 무료 티어 | 특징 |
|----------|------|-----------|------------|
| **GitHub Pages** | 정적 호스팅 | 무제한 (100GB 소프트 제한) | 가장 쉬움: GitHub에 푸시하면 바로 공개 |
| **Hugging Face Spaces** | AI 앱 | 무료 CPU 소형 인스턴스 | AI 데모 전용 (Gradio/Streamlit) |
| **Modal** | AI/서버리스 GPU | 월 $30 크레딧 | Python 함수형 서비스, GPU 콜드 스타트 <4초 |
| **Replicate** | AI 모델 호스팅 | 호출당 과금 | 인프라 관리 없이 모델을 API로 변환 |
| **Denoland Deploy** | Deno/Edge | 하루 10만 건 요청 무료 | Deno 공식 플랫폼, 네이티브 TypeScript |
| **Netlify** | 정적 호스팅 | 월 100GB 대역폭 | 풍부한 플러그인 생태계 |
| **Supabase** | BaaS | DB 500MB 무료 | 오픈소스 Firebase 대안, Postgres+Auth+Storage |
| **Neon** | 서버리스 Postgres | 500MB 무료 | 서버리스용 브랜치 가능 데이터베이스 |
| **Upstash** | 서버리스 Redis | 하루 1만 명령어 무료 | 서버리스용 요청 기반 Redis |

---

# 2. 클라우드 VPS 구매하기: AWS 실습

서버 환경을 완전히 제어해야 하거나, 커스텀 서비스를 실행해야 하거나, PaaS로 부족하다면 직접 클라우드 서버를 구매할 때입니다. 이 절에서는 가장 널리 사용되는 글로벌 클라우드 플랫폼인 AWS를 실습하고, DigitalOcean, Vultr, Hetzner 같은 대안도 소개합니다.

## 2.1 AWS 무료 티어 — 12개월 무료

AWS는 신규 사용자에게 12개월 무료 티어(Free Tier)를 제공합니다. 학습과 개인 프로젝트에 딱 좋습니다. 포함 내용은 다음과 같습니다.

| 서비스 | 무료 티어 할당량 |
|---------|---------------------|
| **EC2** | 월 750시간의 t2.micro 또는 t3.micro (인스턴스 1개 24시간 실행) |
| **S3** | 5GB 표준 스토리지 |
| **RDS** | 월 750시간 db.t2.micro/db.t3.micro + 20GB 스토리지 |
| **Lambda** | 월 100만 건 요청 + 320만 초 컴퓨팅 |
| **CloudFront** | 50GB 이그레스(egress) + 월 200만 건 요청 |
| **CloudWatch** | 커스텀 지표 10개 + 1GB 로그 수집 |
| **DynamoDB** | 25GB 스토리지 + 250만 읽기/쓰기 용량 유닛 |

**⚠️ 중요:** 무료 티어는 가입 후 12개월이 지나면 만료되며, 이후에는 일반 요금이 부과됩니다. 예상치 못한 요금을 피하려면 반드시 청구 알림(Billing Dashboard → Budgets)을 설정하세요. 사용하지 않는 리소스는 파괴(destroy)하세요!

### EC2 인스턴스 생성 방법 (AWS VPS):

1. https://aws.amazon.com/ 에서 이메일과 신용카드로 **가입**
2. **EC2 대시보드** → **Launch Instances(인스턴스 시작)** 이동
3. **1단계: Amazon 머신 이미지(AMI) 선택**
   - **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type** (64비트 x86) 선택 — 초보자에게 가장 친숙한 옵션
4. **2단계: 인스턴스 유형 선택**
   - **t2.micro** 선택 (무료 티어 대상, 1 vCPU, 1GB RAM)
5. **3단계: 인스턴스 세부 정보 구성**
   - 기본값 유지 (인스턴스 1개, 기본 VPC)
6. **4단계: 스토리지 추가**
   - 기본 8GB gp2 루트 볼륨이면 초보자에게 충분
7. **5단계: 태그 추가** (선택, 관리용)
8. **6단계: 보안 그룹 구성** (⚠️ 중요 — 이것이 방화벽입니다)
   - 새 보안 그룹 생성
   - 규칙 추가:
     - 유형: **SSH**, 포트: 22, 소스: **내 IP(My IP)** (내 IP에서만 SSH 가능)
     - 유형: **HTTP**, 포트: 80, 소스: **Anywhere (0.0.0.0/0)**
     - 유형: **HTTPS**, 포트: 443, 소스: **Anywhere**
9. **7단계: 검토 및 시작(Review and Launch)**
10. **키 페어**: 요청이 나오면 새 키 페어 생성(예: `my-aws-key.pem`), 다운로드 후 안전하게 보관. **다시 다운로드할 수 없습니다!**
11. **Launch Instances** 클릭 → 시작까지 2~5분 대기

### EC2 인스턴스에 연결하기:

```bash
# 로컬 Mac/Linux 터미널에서
chmod 400 my-aws-key.pem  # 올바른 권한 설정 (필수!)
ssh -i my-aws-key.pem ubuntu@YOUR_PUBLIC_IP
# 예: ssh -i my-aws-key.pem ubuntu@54.123.45.67

# Windows에서는 PuTTY(.pem을 .ppk로 변환) 또는 OpenSSH가 있는 Windows 터미널 사용
```

**공인 IP 확인 방법:** EC2 대시보드 → Instances → 인스턴스 선택 → 세부 정보에서 "Public IPv4 address" 확인.

## 2.2 DigitalOcean — 초보자를 위한 훌륭한 문서

**웹사이트:** https://www.digitalocean.com

**요금:** Droplet 월 $4부터 (512MB RAM, 10GB SSD, 500GB 대역폭)

**선택 이유:** 문서화("community tutorials"라고 함)가 전설적입니다. 거의 모든 Linux/서버 질문에 잘 정리된 DO 튜토리얼이 있습니다. 인터페이스도 깔끔하고 초보자 친화적입니다.

**사용 방법:**
1. 가입 (신용카드 또는 PayPal, PayPal은 최소 $2 입금)
2. "Create" → "Droplets" 클릭
3. Ubuntu 22.04, $4/월 기본 플랜 선택, 사용자와 가까운 데이터센터 선택 (NYC, SFO, London, Singapore 등)
4. SSH 공개 키 추가 (권장) 또는 루트 비밀번호 설정
5. "Create Droplet" 클릭 — 약 1분이면 준비 완료
6. `ssh root@YOUR_DROPLET_IP`로 연결

## 2.3 Vultr — 시간 단위 과금, 리전 다양

**웹사이트:** https://www.vultr.com

**요금:** 일반 Cloud Compute 월 $5부터 (1 vCPU, 1GB RAM, 25GB SSD, 1TB 대역폭)

**선택 이유:** 시간 단위로 과금됩니다 (테스트용으로 10분만 서버를 띄웠다가 파괴하면 몇 센트만 지불), 30개 이상 글로벌 리전, 나중에 필요하면 저렴한 GPU 인스턴스도 있습니다.

## 2.4 Hetzner — 장기 프로젝트 최고의 가성비

**웹사이트:** https://www.hetzner.com/cloud

**요금:** CX11 월 €3.49부터 (1 vCPU, 2GB RAM, 20GB SSD, 20TB 트래픽!)

**선택 이유:** 유럽 최고의 가격대비성능, 매우 안정적인 네트워크. 장기 운영 프로젝트에 최적입니다. 단점은 데이터센터가 독일/핀란드/미국에 있다는 점입니다 (아시아 리전 없음).

## 2.5 VPS 제공업체 빠른 비교

| 제공업체 | 시작 가격 | 최적 대상 | 무료 체험 |
|----------|---------------|----------|-----------|
| **AWS EC2** | 12개월 무료, 이후 약 $10/월 | AWS 학습, 기업 통합 | 12개월 무료 티어 |
| **DigitalOcean** | $4/월 | 초보자, 문서가 훌륭함 | $200 크레딧 60일 (신규 사용자) |
| **Vultr** | $5/월 (IPv6 전용 $2.50) | 시간 단위 테스트, 리전 다양 | $100 크레딧 30일 |
| **Hetzner** | €3.49/월 | 장기 프로젝트 가성비 | €20 크레딧 |
| **Linode (Akamai)** | $5/월 | 오래된 안정적인 업체 | $100 크레딧 60일 |

---

# 3. 서버 초기 설정 (Ubuntu 22.04)

서버에 SSH로 접속한 후 첫 번째로 할 일은 시스템 업데이트와 기본 도구 설치입니다. **아래 프롬프트를 AI 어시스턴트에게 복사해서** 필요한 정확한 명령어를 생성하게 할 수 있습니다:

> "방금 새 Ubuntu 22.04 서버를 설정했고 [Node.js/Python/...] 프로젝트를 배포하려고 합니다. 시스템 업데이트, 루트가 아닌 sudo 사용자 생성, SSH 키 인증 설정, Node.js 20 설치, Nginx 설치, Docker 설치, 기본 ufw 방화벽 설정을 포함한 완전한 초기화 명령어를 알려주세요."

전형적인 초기 설정:

```bash
# 1. 시스템 업데이트 및 기본 도구 설치
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git vim ufw build-essential

# 2. 일반 사용자 생성 (항상 root를 쓰지 마세요!)
sudo adduser yourname
sudo usermod -aG sudo yourname

# 3. Node.js 설치 (nvm 사용, apt 아님)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 20
node -v  # 확인

# 4. Nginx 설치
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
# 브라우저에서 http://YOUR-IP 접속 시 Nginx 환영 페이지 확인

# 5. Docker 설치 (컨테이너를 사용한다면)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker yourname  # sudo 없이 Docker 실행
# 로그아웃 후 다시 로그인해야 적용됨
docker --version

# 6. 방화벽 설정
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo ufw status
```

## 3.1 보안 그룹/방화벽 설정 (매우 중요!)

AWS에서는 **보안 그룹(Security Groups)**으로 (EC2 콘솔에서), DigitalOcean/Vultr에서는 대시보드의 방화벽 설정으로, Ubuntu에서는 `ufw`로 처리합니다.

**최소한 다음 포트를 열어야 합니다:**

| 포트 | 용도 | 권장 사항 |
|------|---------|---------------|
| **22** | SSH | 필수; 가능하면 내 IP로 제한 |
| **80** | HTTP | 웹에 필수 |
| **443** | HTTPS | 보안 웹에 필수 |
| **3000-3999** | Node.js 개발 포트 | 디버깅용으로 임시 개방, 배포 후 닫기 |

> ⚠️ **초보자 1순위 실수:** 앱은 실행 중인데 접속이 안 됩니다. 90%는 보안 그룹/방화벽에서 해당 포트를 열어주지 않았기 때문입니다.

---

# 4. 세 가지 전형적인 배포 시나리오

## 4.1 시나리오 1: 정적 프론트엔드 배포 (Vite/React/Vue)

`npm run build` 후 순수 HTML/CSS/JS 파일로 이루어진 `dist/` 폴더가 생깁니다.

**코드를 서버로 보내기:**

```bash
# 방법 A: 로컬에서 rsync로 전송
rsync -avz --exclude=node_modules ./dist/ yourname@YOUR-IP:/var/www/myapp/

# 방법 B: 서버에서 git clone (권장, 업데이트가 쉬움)
cd /var/www
sudo git clone https://github.com/YOUR_USER/YOUR_REPO.git myapp
cd myapp
npm install
npm run build
```

**Nginx 설정:**

```bash
sudo vim /etc/nginx/sites-available/myapp
```

```nginx
server {
    listen 80;
    server_name YOUR-IP-OR-DOMAIN;

    root /var/www/myapp/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;  # SPA 라우팅 폴백
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

사이트 활성화:

```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 4.2 시나리오 2: Node.js 백엔드 배포 (Express/Fastify/NestJS)

**PM2**를 사용해 앱을 백그라운드에서 계속 실행합니다:

```bash
npm install -g pm2
cd /path/to/your/app
npm install
npm run build  # TypeScript라면
pm2 start dist/main.js --name "myapp"
pm2 startup && pm2 save  # 부팅 시 자동 시작
pm2 logs myapp  # 로그 보기
```

**Nginx 리버스 프록시:**

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 4.3 시나리오 3: Docker Compose 풀스택 배포

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:pass@db:5432/myapp
    depends_on: [db, redis]
    restart: always

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:7-alpine
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./frontend/dist:/usr/share/nginx/html
    depends_on: [app]
    restart: always

volumes:
  postgres_data:
```

실행: `docker compose up -d`

---

# 5. 도메인 & HTTPS

## 5.1 도메인 구매 & DNS 설정

Namecheap, Cloudflare Registrar, GoDaddy 또는 AWS Route 53에서 도메인을 등록하세요. 도메인의 DNS 설정에서 **A 레코드**를 추가합니다:

| 유형 | 호스트 | 값 |
|------|------|-------|
| A | @ | 서버 IP |
| A | www | 서버 IP |
| A | api | 서버 IP (백엔드용) |

## 5.2 Let's Encrypt 원클릭 HTTPS

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
# 옵션 2 (Redirect)를 선택해 HTTP를 HTTPS로 자동 리다이렉트
sudo certbot renew --dry-run  # 자동 갱신 테스트
```

---

# 6. 클라우드 제공업체 서비스 심층 분석 (VPS를 넘어서)

AWS 콘솔(또는 어떤 클라우드 대시보드)에 로그인하면 EC2, S3, RDS, ELB, VPC 등 이름만 봐서는 알 수 없는 수십 가지 서비스가 보입니다. 이 절에서는 가장 흔한 서비스와 각각 언제 사용하는지 설명합니다. **AWS를 주된 예시로 사용**합니다 (개념은 다른 클라우드에도 그대로 적용됩니다).

## 6.1 클라우드 아키텍처 개요

클라우드에서 실행되는 전형적인 웹 애플리케이션은 이렇게 생겼습니다:

```
사용자 → CloudFront (CDN) → ALB (로드 밸런서) → EC2 (앱 서버)
                              │                     │
                              │                     ├── S3 (이미지/파일)
                              │                     ├── RDS (데이터베이스)
                              │                     └── ElastiCache (Redis)
                              │
                              └── ECS/EKS (컨테이너, 고급)
                              
         └── Route 53 (DNS) → 도메인을 CloudFront/ALB에 연결
             + ACM (SSL 인증서) → HTTPS 암호화
```

각 서비스를 하나씩 살펴봅시다.

## 6.2 컴퓨팅: 코드가 실행되는 곳

### EC2 (Elastic Compute Cloud) — VPS

지금까지 사용해 온 "클라우드 서버"입니다. SSH로 접속해 무엇이든 설치하고 원하는 대로 설정할 수 있는 가상 머신입니다.

- **알리클라우드:** ECS
- **텐센트 클라우드:** CVM / 라이트하우스
- **DigitalOcean:** Droplet
- **Hetzner:** Cloud Server

**언제 사용하나요:** 완전한 제어, 커스텀 소프트웨어, 상시 실행 프로세스가 필요할 때.

### Lambda — 서버리스 함수

서버를 관리하지 않고 코드 조각만 업로드합니다. 호출 횟수와 실행 시간만큼 과금됩니다. 트리거되었을 때만 실행됩니다.

- **알리클라우드:** Function Compute
- **텐센트 클라우드:** SCF (Serverless Cloud Function)
- **GCP:** Cloud Functions

**언제 사용하나요:** 간헐적인 작업 (웹훅 처리, 이미지 처리, 예약 작업), 트래픽이 들쭉날쭉한 API. WebSocket 봇처럼 상시 실행되는 프로세스에는 **부적합**.

### ECS/EKS — 컨테이너 오케스트레이션

프로젝트가 Docker를 사용하고 여러 컨테이너/서비스로 커지면 Kubernetes로 오케스트레이션합니다.

- **AWS ECS:** 아마존의 더 간단한 컨테이너 서비스
- **AWS EKS:** 관리형 Kubernetes
- **알리클라우드:** ACK
- **텐센트 클라우드:** TKE
- **Google Cloud:** GKE

**언제 사용하나요:** 다중 서비스 마이크로서비스 아키텍처, 자동 확장, 팀 프로젝트. 대부분의 개인 프로젝트에는 필요 없습니다 — VPS + Docker Compose로 충분합니다.

## 6.3 스토리지: 파일과 데이터가 저장되는 곳

### S3 (Simple Storage Service) ⭐ 가장 많이 사용됨

**서버 다음으로 가장 흔한 서비스입니다.** 이미지, 동영상, PDF, 정적 사이트 자산, 백업 등을 저장하는 데 사용합니다. **사용자가 업로드한 파일을 서버의 로컬 디스크에 절대 저장하지 마세요!** 서버를 재구축/마이그레이션/리사이즈하면 파일이 사라집니다.

- **알리클라우드:** OSS (Object Storage Service)
- **텐센트 클라우드:** COS (Cloud Object Storage)
- **Google Cloud:** GCS (Google Cloud Storage)
- **대안:** Cloudflare R2 (이그레스 요금 0원 — 정말 좋은 조건!)

**무료 티어:** AWS S3는 무료 티어로 12개월간 5GB 표준 스토리지를 제공합니다. 알리클라우드 OSS는 신규 사용자에게 6개월간 5GB를 제공합니다. Cloudflare R2는 10GB 스토리지의 영구 무료 티어가 있습니다.

**S3로 할 수 있는 일:**
- 사용자 업로드 저장 (아바타, 이미지, 첨부 파일, 상품 사진)
- 정적 웹사이트 호스팅 (`dist/` 폴더 업로드 후 "Static website hosting" 활성화)
- 데이터베이스 내보내기 백업
- CloudFront CDN과 결합해 전 세계에서 빠른 다운로드 제공
- 사전 서명 URL(Pre-signed URL)로 비공개 파일 공유

**S3 사용 방법 (AWS 콘솔 실습):**

1. **S3 대시보드** → **Create bucket(버킷 생성)**
2. **전 세계에서 고유한** 버킷 이름 입력 (예: `myapp-images`)
3. AWS 리전 선택 (예: 미국 동부 us-east-1)
4. **Object Ownership:** "ACLs enabled" → "Bucket owner preferred" 선택 (공개 접근에 더 간단)
5. 공개 이미지를 원한다면 "Block all public access" **체크 해제** (경고문을 읽고, 공개 콘텐츠에만 해제)
6. 나머지 설정은 기본값 → **Create bucket** 클릭
7. 버킷 클릭 → **Upload** → 파일 선택
8. 업로드 후 각 파일은 `https://myapp-images.s3.us-east-1.amazonaws.com/avatar.jpg` 같은 URL을 얻습니다
9. 그 URL을 프론트엔드에서 `<img src="...">`로 바로 사용

**코드로 S3 사용하기 (Node.js 예시, 전체 로직은 AI에게 물어보세요):**

```javascript
// npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-east-1" });

async function uploadFile(buffer, filename, contentType) {
  await s3.send(new PutObjectCommand({
    Bucket: "myapp-images",
    Key: filename,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read" // 파일을 공개 접근 가능하게 설정
  }));
  return `https://myapp-images.s3.us-east-1.amazonaws.com/${filename}`;
}
```

> ⚠️ **중요한 보안 사항:** AWS Access Key는 S3의 비밀번호와 같습니다. **프론트엔드 코드에 하드코딩하거나 Git에 커밋하지 마세요!** 환경 변수나 IAM 역할로 저장하세요. 키가 유출되면 IAM 콘솔에서 즉시 비활성화하세요.

### EBS (Elastic Block Store) — 가상 하드 디스크

EC2 인스턴스에 연결되는 블록 스토리지 볼륨 (내 컴퓨터의 하드 디스크와 같음). EC2 인스턴스는 루트 볼륨(보통 8~60GB)이 함께 제공되며, 공간이 더 필요하면 EBS 볼륨을 추가 구매합니다.

- **알리클라우드:** Cloud Disk (ESSD/SSD)
- **텐센트 클라우드:** CBS (Cloud Block Storage)

**언제 사용하나요:** 서버용 추가 디스크 공간, EC2 인스턴스 수명 주기와 무관하게 보존해야 하는 데이터.

### EFS (Elastic File System) — 공유 파일 스토리지

여러 EC2 인스턴스가 동시에 마운트할 수 있는 네트워크 파일 시스템입니다. 여러 웹 서버가 업로드된 파일을 공유할 때 좋습니다.

- **알리클라우드:** NAS
- **텐센트 클라우드:** CFS

대부분의 소규모 프로젝트에는 필요 없습니다 — 단일 서버 + S3로 충분합니다.

## 6.4 데이터베이스: 구조화된 데이터 저장

### RDS (Relational Database Service) ⭐ 자주 사용됨

**운영 데이터베이스를 VPS에 직접 설치해 실행하지 마세요!** 기술적으로는 가능하지만(앞서 Docker Compose 예시에서 했던 것처럼), 운영 환경에서는 관리형 데이터베이스를 사용하세요: 자동 백업, 고가용성, 모니터링, 원클릭 확장.

- **알리클라우드:** RDS
- **텐센트 클라우드:** TDSQL-C / CDB
- **Google Cloud:** Cloud SQL

**지원 엔진:** MySQL, PostgreSQL, MariaDB, SQL Server, Oracle, Amazon Aurora (MySQL/PostgreSQL 호환, 클라우드 최적화).

**무료 티어:** AWS RDS는 12개월간 월 750시간의 db.t2.micro 또는 db.t3.micro + 20GB 스토리지를 제공합니다.

**RDS 설정 방법 (AWS):**

1. **RDS** → **Create database** 이동
2. **Standard create** 선택 → 엔진: **MySQL 8.0** 또는 PostgreSQL
3. 템플릿: **Free tier** (무료 할당량 안에서)
4. DB 인스턴스 식별자, 마스터 사용자 이름, 마스터 비밀번호 설정
5. 인스턴스 구성: **db.t3.micro** (무료 티어)
6. 스토리지: 20GB gp2 (무료 티어 대상)
7. 연결: EC2 인스턴스와 **동일한 VPC** 선택
8. **Public access:** No (VPC 내부에서만 접근 허용)
9. VPC 보안 그룹: 새로 만들거나, EC2 보안 그룹의 5432/3306 포트를 허용하는 기존 보안 그룹 선택
10. **Create database** 클릭 → 약 5~10분 대기
11. 준비되면 **엔드포인트** 확인 (`mydb.xxxxx.us-east-1.rds.amazonaws.com:3306` 형태)
12. 앱의 `DATABASE_URL`을 이 엔드포인트로 변경하고, RDS 보안 그룹의 인바운드 규칙에 EC2 보안 그룹을 추가

> 💡 **vibecoding 팁:** AI에게 "[엔드포인트]에 AWS RDS PostgreSQL 인스턴스가 있고, 사용자는 [사용자 이름]입니다. [내 프로젝트]를 위한 연결 코드와 마이그레이션 스크립트를 작성해 주세요."라고 말해 보세요.

### ElastiCache — 관리형 Redis/Memcached

핫 데이터의 인메모리 캐싱(DB 쿼리 감소), 세션/토큰 저장, 메시지 큐, 리더보드 등에 사용합니다.

- **알리클라우드:** ApsaraDB for Redis
- **텐센트 클라우드:** TencentDB for Redis
- **대안:** Upstash (Serverless Redis, 무료 티어 있음)

소규모 프로젝트는 VPS에서 `sudo apt install redis-server`로 바로 실행해도 됩니다. 운영 환경/고가용성이 필요하면 관리형 Redis를 사용하세요.

## 6.5 네트워킹: 더 빠르고 안전한 접근

### CloudFront — CDN (콘텐츠 전송 네트워크) ⭐ 자주 사용됨

정적 자산(이미지, CSS, JS, 동영상)을 전 세계 엣지 위치에 캐시해 사용자가 가장 가까운 노드에서 콘텐츠를 받도록 합니다.

- **알리클라우드:** CDN / DCDN
- **텐센트 클라우드:** CDN / EdgeOne
- **Google Cloud:** Cloud CDN
- **무료 대안:** Cloudflare CDN (무료 플랜에 무제한 대역폭 포함)

**언제 사용하나요:**
- 이미지/동영상/대용량 파일이 있는 사이트
- 여러 지역에 퍼져 있는 사용자
- 오리진 서버의 대역폭 비용 절감
- Cloudflare Pages는 사실상 CDN + 정적 호스팅

**CloudFront 구성 방법:**
1. CloudFront 콘솔 → **Create distribution**
2. Origin domain: S3 버킷 또는 EC2 ALB 선택
3. 기본 캐시 동작: HTTP를 HTTPS로 리다이렉트
4. 배포 생성 → 배포에 5~15분 대기
5. 도메인의 DNS를 CNAME 레코드로 CloudFront 배포 도메인(예: `dxxx.cloudfront.net`)에 연결

### ELB (Elastic Load Balancing)

들어오는 트래픽을 여러 EC2 인스턴스에 분산하고, 비정상 인스턴스를 자동으로 제거합니다.

- **ALB (Application Load Balancer):** 7계층 (HTTP/HTTPS), 경로 기반 라우팅, 웹 앱에 가장 일반적
- **NLB (Network Load Balancer):** 4계층 (TCP/UDP), 초저지연
- **GLB (Gateway Load Balancer):** 네트워크 가상 어플라이언스용
- **알리클라우드:** SLB / ALB
- **텐센트 클라우드:** CLB

단일 서버 프로젝트에는 필요 없습니다. 백엔드 서버가 여러 대로 확장할 때 사용하세요.

### Route 53 — DNS 서비스

도메인 이름을 IP 주소로 변환합니다. 대부분의 도메인 등록업체에 무료 DNS가 포함되지만, Route 53은 AWS와 깊게 통합되어 있습니다.

- **알리클라우드:** Alibaba Cloud DNS
- **텐센트 클라우드:** DNSPod
- **무료 대안:** Cloudflare DNS (전 세계에서 가장 빠른 편, 완전 무료)

**흔한 DNS 레코드 유형:**

| 유형 | 용도 | 예시 |
|------|---------|---------|
| **A** | 도메인 → IPv4 주소 | `@ → 54.123.45.67` |
| **AAAA** | 도메인 → IPv6 주소 | `@ → 2600:xxxx::` |
| **CNAME** | 도메인 → 다른 도메인 (CDN에 사용) | `static → dxxx.cloudfront.net` |
| **MX** | 메일 서버 (비즈니스 메일 필요) | - |
| **TXT** | 임의 텍스트 (도메인 검증, SPF/DKIM) | - |

### ACM (AWS Certificate Manager) — 무료 SSL 인증서

AWS는 CloudFront나 ALB와 함께 사용하면 자동 갱신되는 무료 SSL/TLS 인증서를 제공합니다. 인증서를 요청하고 DNS 또는 이메일로 검증한 후 배포/로드 밸런서에 연결하면 됩니다.

- **알리클라우드:** 무료 SSL 인증서
- **텐센트 클라우드:** 무료 SSL 인증서
- **보편적인 무료 옵션:** Certbot + Let's Encrypt (5절에서 소개한 방법, 90일 자동 갱신)

### VPC (Virtual Private Cloud)

AWS에서 EC2, RDS 등 리소스가 사는 격리된 가상 네트워크입니다. 신규 계정에는 기본 VPC가 제공됩니다. 고급 사용법(공개/비공개 서브넷 분리, NAT 게이트웨이)은 더 깊은 학습이 필요합니다.

## 6.6 기타 흔한 서비스

### 도메인 등록

- **글로벌:** Namecheap, Cloudflare Registrar (무료 WHOIS 프라이버시), GoDaddy
- **AWS:** Route 53 (등록도 가능)
- **중국:** 알리클라우드 완왕, 텐센트 클라우드 DNSPod (ICP 비안 필요)

### SES (Simple Email Service) — 이메일 발송

직접 메일 서버를 운영하지 마세요 (스팸으로 분류될 가능성이 높습니다). 전문 이메일 서비스를 사용하세요.

- **AWS SES**, SendGrid, Mailgun, Resend
- **중국:** 알리클라우드 Direct Mail, 텐센트 SES
- 용도: 인증 이메일, 알림, 마케팅 이메일

### SNS (Simple Notification Service) — SMS/푸시 알림

SMS, 모바일 푸시 알림용입니다. SMS에는 Twilio가 대중적인 글로벌 대안입니다.

### CloudWatch — 모니터링 & 로깅

EC2의 CPU/메모리/디스크 모니터링, 애플리케이션 로그 확인, 알림 설정 (CPU 높음, 서비스 다운).

- **알리클라우드:** Cloud Monitor + SLS (Log Service)
- **텐센트 클라우드:** Cloud Monitor + CLS
- **초보자 대안:** PM2 내장 모니터링 + Uptime Kuma (오픈소스, Docker 컨테이너 1개로 실행)

### S3 고급: 이미지 처리 / Lambda 트리거

S3는 파일 업로드 시 Lambda 함수를 자동으로 트리거할 수 있습니다. 예를 들어 사용자가 큰 사진을 업로드하면 Lambda 함수가 자동으로 썸네일 크기로 리사이즈합니다. 중국에서는 알리클라우드 OSS에 내장 이미지 처리가 있고 (URL에 `?x-oss-process=image/resize,w_300` 추가), 텐센트 COS에는 Cloud Infinite(CI)가 비슷한 기능을 제공합니다.

## 6.7 클라우드 서비스 매핑: AWS ↔ 중국 클라우드 ↔ 대안

동등한 서비스를 찾는 빠른 참조표입니다:

| 카테고리 | AWS | 알리클라우드 | 텐센트 클라우드 | 무료/저예산 대안 |
|----------|-----|--------------|---------------|------------------------|
| 클라우드 서버 | EC2 | ECS | CVM / 라이트하우스 | DigitalOcean / Vultr / Hetzner |
| 객체 스토리지 | S3 | OSS | COS | Cloudflare R2 (이그레스 0원) |
| 관계형 DB | RDS | RDS | TDSQL-C/CDB | Supabase / Neon |
| Redis 캐시 | ElastiCache | ApsaraDB Redis | TencentDB Redis | Upstash |
| CDN | CloudFront | CDN/DCDN | CDN/EdgeOne | Cloudflare CDN (무료) |
| 로드 밸런서 | ALB/NLB | SLB/ALB | CLB | Nginx 자체 호스팅 / Caddy |
| 서버리스 | Lambda | Function Compute | SCF | Cloudflare Workers |
| 컨테이너/K8s | ECS/EKS | ACK | TKE | Fly.io / Railway |
| DNS | Route 53 | Alibaba Cloud DNS | DNSPod | Cloudflare DNS (무료) |
| SSL 인증서 | ACM (무료) | 무료 인증서 | 무료 인증서 | Let's Encrypt (무료) |
| 이메일 | SES | Direct Mail | SES | Resend / SendGrid 무료 티어 |
| SMS | SNS | SMS | SMS | Twilio |
| 모니터링 | CloudWatch | Cloud Monitor | Cloud Monitor | Uptime Kuma (자체 호스팅) |
| AI/ML API | Bedrock | 통이첸원/바이리안 | Hunyuan/TI | OpenAI / Anthropic API |
| 도메인 등록 | Route 53 | 완왕 | DNSPod | Namecheap / Cloudflare |

## 6.8 초보자 자주 묻는 질문

**Q: 클라우드 관리형 서비스를 쓸까, 아니면 VPS에 전부 직접 호스팅할까?**

- **개인 프로젝트 / 학습:** VPS에 직접 호스팅 (전부 Docker Compose로) — 더 저렴하고 더 많이 배울 수 있습니다.
- **실사용자가 있는 운영:** 데이터베이스와 객체 스토리지는 관리형 서비스 사용 (자동 백업, 안정성), 앱은 VPS에 유지
- **자금이 넉넉한/팀 프로젝트:** 가능한 한 클라우드 관리형 서비스 사용 — 운영이 아닌 비즈니스 로직에 시간을 투자하세요.

**Q: 요금이 부과되지 않게 AWS 무료 티어를 사용하려면?**

1. 항상 **t2.micro/t3.micro** 인스턴스만 시작 ("Free tier eligible" 표시)
2. $0 또는 $1로 **청구 알림(Billing Alarm)** 설정 (Billing Dashboard → Budgets → Create budget)
3. 사용이 끝나면 리소스 **종료/삭제**: EC2 인스턴스, RDS 데이터베이스, S3 버킷, EBS 볼륨, 탄력적 IP
4. EBS 볼륨과 탄력적 IP는 인스턴스를 **중지해도** 삭제하지 않으면 계속 과금됩니다
5. 매달 Billing Dashboard 확인

**Q: AWS vs 다른 VPS 제공업체?**

- AWS 생태계 학습 / 클라우드 취업 준비 → AWS 무료 티어 사용
- 빠른 배포, 단순한 프로젝트, 최저 비용 → DigitalOcean ($4/월) 또는 Hetzner (€3.49/월)
- 시간 단위 테스트 → Vultr (시간 단위 과금, 언제든 파괴)
- AI/GPU 워크로드 → Modal 또는 Lambda Labs
- 완전 무료 24시간 컨테이너 → Fly.io 무료 티어

---

# 7. AI 에이전트 전용 배포 플랫폼

AI 에이전트(일반 웹 앱이 아닌)를 배포한다면 AI 워크로드에 특화된 플랫폼이 있습니다:

## 7.1 Modal — Python AI/ML용 서버리스 GPU

**웹사이트:** https://modal.com

**적합한 대상:** GPU 추론이 필요한 Python AI 프로젝트, 예약 작업, 배치 데이터 처리

**특징:**
- Python 데코레이터로 함수 정의, `modal deploy`로 원클릭 배포
- GPU 컨테이너 콜드 스타트 약 1초, 밀리초 단위 과금
- 내장 스케줄링, 시크릿 관리, 공유 스토리지
- 무료 플랜에 월 $30 크레딧 포함 (대부분의 개인 프로젝트에 충분)
- Python만 지원

```python
import modal
app = modal.App("my-ai-agent")

@app.function(gpu="A10G", timeout=300)
def run_agent(prompt: str):
    # AI 모델/에이전트를 여기서 실행
    return result
```

## 7.2 Hugging Face Spaces — AI 데모 첫 번째 선택

**웹사이트:** https://huggingface.co/spaces

**적합한 대상:** AI 데모를 빠르게 선보이기 (Gradio/Streamlit UI), 오픈소스 모델 전시

**특징:**
- 무료 소형 CPU 인스턴스; GPU는 유료
- Gradio, Streamlit, Docker 지원
- 활발한 커뮤니티; 모든 Space에 공개 코드와 토론 존재
- 다른 사람의 Space를 원클릭 포크해 수정 가능

## 7.3 Replicate — 모델을 API로 변환

**웹사이트:** https://replicate.com

**적합한 대상:** 서버 관리 없이 AI 모델을 호출 가능한 HTTP API로 변환

모델을 올리면 Replicate가 HTTP API로 패키징하고, 호출당 과금됩니다. 파인튜닝한 모델을 공개하기에 좋습니다.

## 7.4 Lambda Labs — 주문형 GPU 인스턴스

**웹사이트:** https://lambdalabs.com

**적합한 대상:** AWS/GCP GPU 인스턴스보다 저렴한 GPU 집중 학습과 추론. A100, H100, A10을 주문형으로 사용 가능.

---

# 8. 🎯 Vibe 코딩 배포 워크플로우: AI를 나의 DevOps로

이것이 vibe 코딩 시대 배포에서 가장 중요한 마인드셋입니다: **모든 명령어를 외울 필요가 없습니다 — AI가 바로 나의 DevOps 조수입니다.**

## 8.1 두 가지 AI 협업 모드

**모드 1: 로컬에서 스크립트 생성, 수동 실행**

AI 코딩 어시스턴트(Claude Code, Trae Solo, Cursor)에게 말하세요:

> "[프로젝트 설명]을 [플랫폼/서버]에 배포하려고 합니다. 다음을 생성해 주세요:
> 1. 완전한 단계별 배포 체크리스트
> 2. 필요한 모든 설정 파일 (Nginx, PM2, Dockerfile, docker-compose)
> 3. deploy.sh 배포 스크립트
> 4. 환경 변수 체크리스트"

그런 다음 AI가 생성한 것을 그대로 실행하면 됩니다.

**모드 2: AI가 서버에 직접 SSH 접속 (더 쉬움)**

Claude Code는 원격 SSH 작업을 지원합니다:

```bash
claude
# 이렇게 말하세요:
# "root@MY-IP에 SSH로 접속해 /root/myapp을 배포하고, Nginx + HTTPS + PM2를 구성해 주세요"
```

AI가 환경을 자동으로 확인하고, 누락된 의존성을 설치하고, 코드를 가져오고, 빌드하고, 구성하고, 검증까지 처리합니다 — 직접 명령어를 입력할 필요가 전혀 없습니다.

> ⚠️ **안전 수칙:**
> - 먼저 테스트 서버에서 연습해 AI가 파괴적인 변경을 하지 않는지 확인
> - 중요한 데이터는 정기적으로 백업
> - AI에게 최소 권한 사용자를 부여 (root를 주지 말고, sudo 사용자는 괜찮지만 명령어를 눈여겨보세요)
> - AI가 위험한 명령을 실행하기 전에 무엇을 하려는지 검토

## 8.2 범용 배포 프롬프트 템플릿

어떤 플랫폼/서버를 선택하든 이 템플릿을 채워 AI에게 보내면 실행 가능한 완전한 계획을 받을 수 있습니다:

```
다음 정보로 프로젝트 배포를 도와주세요:

[배포 대상]
- 플랫폼/서버: [Vercel / Railway / Fly.io / Ubuntu 22.04 VPS / AWS EC2 / ...]
- 서버 IP (VPS라면): xxx.xxx.xxx.xxx
- 이미 구성됨: [SSH 키 로그인 / Docker 설치됨 / Nginx 설치됨 / ...]

[프로젝트 정보]
- 프로젝트 유형: [Next.js 14 / Vite+React / Node.js Express / Python FastAPI / ...]
- 코드 위치: GitHub 저장소 https://github.com/xxx/xxx
- 기술 스택: Node.js 20 + PostgreSQL 16 + Redis 7
- 시작 명령어: npm run start
- 리슨 포트: 3000
- 환경 변수: DATABASE_URL=xxx, JWT_SECRET=xxx, OPENAI_API_KEY=xxx

[도메인]
- 도메인: mydomain.com
- DNS가 이미 서버를 가리킴: 예/아니요
- HTTPS 필요: 예/아니요

[요구 사항]
1. 완전한 단계 (로컬 작업과 서버 작업을 나눠서)
2. 모든 설정 파일 제공
3. 배포 성공을 어떻게 검증할지 알려주세요
4. 흔한 함정과 트러블슈팅 방법 나열
```

## 8.3 AI 지원 트러블슈팅 워크플로우

문제가 생겼을 때:

1. **먼저 로그 확인:**
   - Nginx: `sudo tail -50 /var/log/nginx/error.log`
   - PM2: `pm2 logs myapp`
   - Docker: `docker compose logs app`
   - systemd: `sudo journalctl -u myapp -n 50`

2. **전체 오류를 AI에 복사** + 맥락 포함:
   > "Node.js를 Ubuntu에 배포하는데 502 Bad Gateway가 발생합니다. Nginx 오류 로그: [붙여넣기]. 설정: [붙여넣기]. PM2 상태: [붙여넣기]. 디버깅을 도와주세요."

3. **흔한 문제 빠른 참조:**
   - **502 Bad Gateway:** 백엔드 미실행, 잘못된 포트, 잘못된 proxy_pass
   - **IP 접속 불가:** 보안 그룹이 포트를 허용하지 않음, ufw 차단, Nginx 미시작
   - **새로고침 시 404:** Nginx에 SPA 라우팅용 `try_files` 누락
   - **정적 자산 404:** 잘못된 root 경로, 파일 권한
   - **HTTPS 인증서 실패:** 도메인이 서버를 가리키지 않음, 80 포트 차단
   - **PM2 계속 재시작:** 코드 버그로 크래시, `pm2 logs` 확인
   - **Vercel 함수 타임아웃:** 10초 제한 초과 — 장시간 작업은 Fly.io/Railway/VPS로 전환
   - **Railway/Render 503:** 서비스 절전 또는 크레딧 소진
   - **AWS EC2 연결 거부:** 보안 그룹에 SSH 규칙 없음 또는 잘못된 포트

---

# 9. 배포 후 팁

## 9.1 파일 전송

```bash
# 로컬 → 서버
scp ./file.zip yourname@IP:/home/yourname/
scp -r ./dir yourname@IP:/home/yourname/

# 서버 → 로컬
scp yourname@IP:/home/yourname/file.zip ./

# rsync (증분 동기화, 배포에 권장)
rsync -avz --exclude=node_modules --exclude=.git ./project/ yourname@IP:/var/www/project/
```

## 9.2 원클릭 업데이트 스크립트

서버에 `deploy.sh` 생성:

```bash
#!/bin/bash
set -e
cd /path/to/project
git pull origin main
npm install
npm run build
pm2 restart myapp
echo "✅ 배포 완료!"
```

업데이트는 그냥 `bash deploy.sh`만 실행하면 됩니다. 완전한 자동화를 원하면 GitHub Actions를 설정해 (CI/CD 설정은 AI에게 물어보세요) main 브랜치에 코드를 푸시하면 자동으로 배포되게 할 수 있습니다.

## 9.3 보안 강화 체크리스트

AI에게 완전한 강화 스크립트 생성을 요청하세요. 보통 다음을 포함합니다:
- 비밀번호 로그인 비활성화, SSH 키만 사용
- 기본 SSH 포트 변경 (22 → 다른 포트)
- fail2ban 설치 (무차별 대입 IP 자동 차단)
- 자동 보안 업데이트 활성화: `sudo apt install unattended-upgrades`
- 시크릿/.env를 Git에 커밋하지 않기
- 정기적으로 데이터베이스 백업을 S3로 스케줄

---

# 10. 장 요약

**배포 옵션 요약:**

| 시나리오 | 권장 | 비용 | 난이도 |
|----------|------------|------|-----------|
| 순수 프론트엔드/문서 | Cloudflare Pages / Vercel / GitHub Pages | 무료 | ⭐ |
| Next.js 풀스택 (빠른 응답) | Vercel | 무료 / 월 $20 | ⭐ |
| 백엔드 API / 봇 (상시 실행) | Railway / Fly.io (무료) / VPS | 월 $0~10 | ⭐⭐ |
| 풀스택 (완전 제어) | DigitalOcean / Vultr / AWS EC2 + Docker | 월 $4~10 | ⭐⭐⭐ |
| AI 에이전트 데모 | Hugging Face Spaces | 무료 | ⭐ |
| AI GPU 추론 | Modal (글로벌) | 월 $0~30 크레딧 | ⭐⭐ |
| 실사용자 운영 | AWS/Azure/GCP 관리형 서비스 | 다양 | ⭐⭐⭐ |

**핵심 5단계를 기억하세요:**
1. **플랫폼 선택** → 프로젝트 유형에 따라 (위 표 참고)
2. **코드 옮기기** → git push / rsync / GitHub 자동 배포
3. **환경 설정** → Node.js/Nginx/Docker 설치 (또는 플랫폼이 처리)
4. **계속 실행** → PM2 / Docker / systemd
5. **도메인 + HTTPS** → DNS 레코드 + Certbot / ACM

**Vibe 코딩 마인드셋:**
1. 모든 명령어가 아니라 *무엇을* 해야 하는지 이해하기
2. 요구 사항을 AI에게 명확히 설명 — 완전한 해결책을 제공합니다
3. AI가 무엇을 하는지 이해하고 핵심 단계 확인
4. 오류가 나면 로그를 AI에게 붙여넣기 — 문제의 90%를 진단합니다
5. 중요한 데이터 백업, 최소 권한 사용

한 번 배포하고 나면 깨닫게 될 것입니다 — 인터넷에 공개하는 것이 그렇게 어렵지 않다는 것을. 🎯

---

<RelatedArticlesSection
  :articles="relatedArticlesMap['ko-kr/stage-2/backend/cloud-server-deployment']"
  title="관련 글"
  description="배포 전후의 엔지니어링 스킬을 계속 학습해 보세요."
/>