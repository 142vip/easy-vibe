# 동시성과 비동기 전체상
> 💡 **학습 가이드**：동시성 프로그래밍은 많은 백엔드 엔지니어의 "아킬레스건"입니다 — 면접에서 막히고, 운영 환경에서 버그가 발생하고, 성능 튜닝 아이디어가 떠오르지 않습니다. 이 장에서는 하나의 핵심 질문을 중심으로 전개합니다：**10만 명의 사용자가 동시에 서비스를 요청할 때, 당신의 코드는 버틸 수 있을까요?**

시작하기 전에, 두 가지 "기초 벽돌"을 먼저 쌓는 것을 추천합니다：

- **CPU, 메모리, I/O란 무엇인가**：이러한 기본 개념이 명확하지 않다면, 먼저 운영체제의 기본 지식을 복습하세요.
- **블로킹/논블로킹이란 무엇인가**：동기/비동기 개념에 아직 익숙하지 않다면, 먼저 실제 프로그래밍 경험을 통해 감을 잡아보세요.

---

## 0. 서론：당신의 서비스는 피크 시간만 되면 "먹통"이 원인 분석

<ProcessThreadCoroutineDemo />

많은 사람들이 실제 개발 중에 비슷한 상황을 겪습니다：

- 로컬 테스트에서는 서비스 응답이 빠르지만, 운영 환경에 배포하면 "PPT처럼 버벅"입니다；
- 분명 높은 서버 사양을 구매했는데, CPU 사용률은 항상 낮습니다；
- 프로모션 피크 시간만 되면 서비스가 "눈사태"처럼 무너져, 강제로 디그레이드하거나 서킷 브레이커를 발동해야 합니다.

직관적으로 우리는 이렇게 생각하기 쉽습니다：**"서버가 충분히 강력하지 않다"**.
하지만 대부분의 경우, 문제는 하드웨어가 "충분히 빠르지 않아서"가 아니라, 우리가 **동시성 모델을 제대로 설계하지 않았기 때문**입니다.

**핵심 모순**：
- 동시 처리를 하지 않으면：사용자 요청이 줄 서서 기다려야 하므로 사용자 경험이 극도로 나빠집니다；
- 멀티스레딩을 남용하면：락 경합, 컨텍스트 스위칭 오버헤드로 인해 오히려 성능이 저하됩니다.

이러한 도전에 직면했을 때, 단순히 "서버 증설"에 의존하는 것은 이미 한계에 부딪혔습니다. 우리는 체계적인 동시성 설계 방법이 필요하며, 높은 동시성 시나리오에서 성능과 안정성을 모두 보장해야 합니다. 이것이 바로 이 장에서 해결하려는 문제입니다.

---

## 1. 핵심 개념：프로세스, 스레드, 코루틴, 도대체 뭐가 다를까

### 1.1 레스토랑 비유

당신이 레스토랑을 열어 많은 손님을 동시에 서비스해야 한다고 상상해 보세요：

| 개념 | 레스토랑 비유 | 기술적 의미 |
| :--- | :--- | :--- |
| **프로세스 (Process)** | **독립된 레스토랑 지점** | 독립된 메모리 공간과 리소스 할당을 가지며, 운영체제 리소스 할당의 기본 단위입니다. 하나의 프로세스가 충돌해도 다른 프로세스에 영향을 주지 않습니다. |
| **스레드 (Thread)** | **지점 내의 요리사** | CPU 스케줄링의 기본 단위로, 프로세스 내의 메모리 공간을 공유합니다. 같은 프로세스 내의 스레드는 데이터를 공유할 수 있지만, 하나의 스레드 충돌이 전체 프로세스 충돌로 이어질 수 있습니다. |
| **코루틴 (Coroutine)** | **요리사의 "분신술"** | 사용자 공간의 경량 스레드로, 운영체제가 아닌 프로그램 자체가 스케줄링합니다. 전환 오버헤드가 극히 작아 수백만 개를 생성할 수 있습니다. |

### 1.2 심층 비교：세 가지의 본질적 차이

<ProcessIsolationDemo />

#### 프로세스：리소스 격리의 "컨테이너"

**핵심 특징**：
- **강한 격리성**：각 프로세스는 독립된 가상 주소 공간을 가집니다
- **큰 오버헤드**：생성/전환 시 운영체제 개입이 필요하며, 약 1-10ms 소요
- **복잡한 통신**：프로세스 간 통신(IPC)에는 특별한 메커니즘(파이프, 메시지 큐, 공유 메모리 등)이 필요합니다

**적용 시나리오**：
- 강한 격리가 필요한 서비스(브라우저 탭, 샌드박스 프로그램 등)
- 다중 언어 혼합 배포 서비스
- 독립적인 재시작/업그레이드가 필요한 서비스 유닛

#### 스레드：공유 메모리의 "경기병"

<ThreadSchedulingDemo />

**핵심 특징**：
- **공유 메모리**：같은 프로세스 내의 스레드는 코드 세그먼트, 데이터 세그먼트, 힙을 공유합니다
- **독립된 스택 공간**：각 스레드는 자체 스택(보통 1MB 정도)을 가집니다
- **빠른 전환**：스레드 전환은 약 1-10μs로, 프로세스보다 1000배 빠릅니다
- **동기화 필요**：공유 데이터는 락으로 보호해야 합니다

**적용 시나리오**：
- CPU 집약적 작업(연산, 이미지 처리)
- 대량의 데이터를 공유해야 하는 동시 작업
- 지연 시간에 민감한 백그라운드 작업

#### 코루틴：사용자 공간의 "그린 스레드"

<CoroutineLightweightDemo />

**핵심 특징**：
- **사용자 공간 스케줄링**：프로그램/런타임 라이브러리가 스케줄링하며, 운영체제를 거치지 않습니다
- **극도로 경량**：코루틴 스택은 보통 몇 KB에 불과하며, 수백만 개를 생성할 수 있습니다
- **극도로 빠른 전환**：코루틴 전환은 약 100ns로, 스레드보다 100배 빠릅니다
- **비선점형**：코루틴이 능동적으로 CPU를 양보합니다(협력적 멀티태스킹)

**적용 시나리오**：
- I/O 집약적 고동시성 서비스(웹 서버, 게이트웨이)
- 대량의 긴 연결을 유지해야 하는 시나리오(IM, 게임 서버)
- 스트리밍 데이터 처리, 파이프라인 작업

---

## 2. 사례 분석：한 이커머스 대규모 프로모션의 "동시성의 고통"

### 2.1 피의 교훈："단일 머신"에서 "분산"으로의 진화

실제 이커머스 시스템의 진화 이야기를 살펴봅시다：

#### 1 단계：단일 머신 시대 (DAU 1,000)

```python
# 간단한 Flask 애플리케이션
from flask import Flask

app = Flask(__name__)

@app.route('/order')
def create_order():
    # 재고 조회
    stock = db.query("SELECT stock FROM products WHERE id=1")
    if stock > 0:
        # 재고 차감
        db.execute("UPDATE products SET stock = stock - 1 WHERE id=1")
        # 주문 생성
        db.execute("INSERT INTO orders ...")
        return "Order created!"
    return "Out of stock!"

# 실행: flask run
```

**문제점**：
- 단일 프로세스 단일 스레드로, 한 번에 하나의 요청만 처리 가능
- 재고 차감에 락이 없어, 동시 접근 시 초과 판매 발생
- 데이터베이스 연결 수가 제한적이며, 커넥션 풀이 빠르게 고갈됨

#### 2 단계：멀티프로세스 시대 (DAU 1만)

```python
# Gunicorn 멀티프로세스 배포
gunicorn -w 4 -k sync app:app

# 4개의 worker 프로세스, 각 프로세스가 독립적으로 요청 처리
```

**새로운 문제**：
- 4개의 프로세스가 동시에 재고를 조회하여 모두 stock=1을 확인하고, 모두 차감에 성공하여 3개 초과 판매 발생!
- 분산 락 도입 필요

```python
import redis

# Redis 분산 락 사용
lock = redis_client.lock("stock_lock", timeout=10)
if lock.acquire():
    try:
        stock = db.query("SELECT stock FROM products WHERE id=1")
        if stock > 0:
            db.execute("UPDATE products SET stock = stock - 1 WHERE id=1")
    finally:
        lock.release()
```

#### 3 단계：코루틴 시대 (DAU 10만)

```python
# FastAPI + asyncio 사용
from fastapi import FastAPI
import asyncio

app = FastAPI()

async def check_stock(product_id: int) -> int:
    # 비동기로 데이터베이스 조회, 블로킹되지 않음
    result = await db.fetch_one(
        "SELECT stock FROM products WHERE id = :id",
        {"id": product_id}
    )
    return result["stock"]

@app.get("/order")
async def create_order(product_id: int):
    # 재고 확인과 사용자 정보를 동시에 조회
    stock_task = check_stock(product_id)
    user_task = get_user_info(request.user_id)

    stock, user = await asyncio.gather(stock_task, user_task)

    if stock > 0:
        # 비동기로 재고 차감
        await db.execute(
            "UPDATE products SET stock = stock - 1 WHERE id = :id",
            {"id": product_id}
        )
        return {"status": "success"}

    return {"status": "out_of_stock"}

# 실행: uvicorn main:app --workers 4
# 각 worker 내에서 수천 개의 동시 코루틴 처리 가능
```

**장점**：
- 단일 스레드 내에서 수천 개의 동시 연결 처리 가능
- I/O 작업 시 능동적으로 CPU를 양보하여 다른 요청을 블로킹하지 않음
- 메모리 사용량이 극히 낮아, 고동시성 긴 연결 시나리오에 적합

### 2.2 동시성 모델 진화 비교표

| 단계 | 동시성 모델 | 지원 DAU | 핵심 문제 | 해결책 |
| :--- | :--- | :--- | :--- | :--- |
| **모놀리스** | 단일 프로세스 단일 스레드 | 1K | 동시 처리 불가 | 멀티프로세스 도입 |
| **멀티프로세스** | 멀티프로세스 동기 | 10K | 데이터 경합, 초과 판매 | 분산 락 |
| **멀티스레드** | 멀티스레드+락 | 50K | 컨텍스트 스위칭 오버헤드, 데드락 | 스레드 풀, 무락 큐 |
| **코루틴** | 비동기 I/O | 100K+ | 코드 복잡성, 디버깅 어려움 | 프레임워크 캡슐화, 분산 추적 |
| **하이브리드** | 멀티프로세스+코루틴 | 1000K+ | 아키텍처 복잡성 | 서비스 거버넌스, 탄력적 스케일링 |

---

## 3. 원리 심층 분석：다양한 동시성 모델의 작동 원리

### 3.1 프로세스 모델：격리성과 통신

#### 메모리 격리 메커니즘

<ProcessIsolationDemo />

각 프로세스는 독립된 가상 주소 공간을 가집니다：

```
프로세스 A의 가상 메모리           프로세스 B의 가상 메모리
+----------------+        +----------------+
|  커널 공간      |        |  커널 공간      |  <-- 공유 (읽기 전용)
|  (공유)        |        |  (공유)        |
+----------------+        +----------------+
|  스택 공간      |        |  스택 공간      |  <-- 독립
|  (아래로 성장)  |        |  (아래로 성장)  |
+----------------+        +----------------+
|  힙 공간        |        |  힙 공간        |  <-- 독립
|  (위로 성장)    |        |  (위로 성장)    |
+----------------+        +----------------+
|  데이터 세그먼트 |        |  데이터 세그먼트 |  <-- 독립
|  (.bss/.data)  |        |  (.bss/.data)  |
+----------------+        +----------------+
|  코드 세그먼트   |        |  코드 세그먼트   |  <-- 독립
|  (.text)       |        |  (.text)       |
+----------------+        +----------------+
```

#### 프로세스 간 통신(IPC) 방식

| 방식 | 원리 | 속도 | 적용 시나리오 |
| :--- | :--- | :--- | :--- |
| **파이프 (Pipe)** | 커널 버퍼, 단방향 스트림 | 중간 | 부모-자식 프로세스 간 통신 |
| **메시지 큐** | 커널 메시지 연결 리스트 | 중간 | 비동기 메시지 전달 |
| **공유 메모리** | 동일한 물리 메모리 매핑 | 가장 빠름 | 대량 데이터 공유 |
| **세마포어** | 커널 카운터 | - | 동기화와 상호 배제 |
| **소켓 (Socket)** | 네트워크 프로토콜 스택 | 비교적 느림 | 크로스 머신 통신 |
| **시그널 (Signal)** | 소프트 인터럽트 | - | 이벤트 알림 |

### 3.2 스레드 모델：스케줄링과 동기화

#### 스레드 스케줄링 원리

<ThreadSchedulingDemo />

운영체제 스레드 스케줄러의 기본 동작：

```
준비 큐                       실행 중                     대기 큐
+--------+                +--------+               +--------+
| 스레드 B |  <-- 타임슬라이스   | 스레드 A |  <-- I/O 요청  | 스레드 C |
| 스레드 D |       만료       | (실행) |               | 스레드 E |
| 스레드 F |                +--------+               | (블로킹) |
+--------+                                         +--------+
    |                                                  |
    v                                                  v
스케줄러가 우선순위에 따라 다음 실행 선택      I/O 완료 시 준비 큐로 이동
```

#### 일반적인 스레드 동기화 메커니즘

| 메커니즘 | 원리 | 장점 | 단점 |
| :--- | :--- | :--- | :--- |
| **뮤텍스 (Mutex)** | 이진 상태, 독점 접근 | 구현이 간단함 | 경합이 심할 때 성능 저하 |
| **읽기-쓰기 락 (RWLock)** | 읽기 공유, 쓰기 독점 | 읽기 많고 쓰기 적은 시나리오에서 효율적 | 구현이 복잡하고, 쓰기 기아 위험 존재 |
| **스핀락 (Spinlock)** | 바쁜 대기, CPU를 해제하지 않음 | 대기 시간이 짧을 때 효율적 | 대기 시간이 길면 CPU 낭비 |
| **조건 변수** | 특정 조건 충족 대기 | 바쁜 대기 방지 | 락과 함께 사용해야 함 |
| **세마포어 (Semaphore)** | 카운터로 접근 수 제어 | 동시성 수 제어 가능 | 잘못 사용하면 오류 발생 가능 |
| **원자적 연산** | CPU 명령어 수준의 원자성 | 무락, 최고 성능 | 단순 데이터 타입만 조작 가능 |
| **무락 큐** | CAS 연산으로 구현 | 높은 동시성에서 우수한 성능 | 구현이 복잡하고, ABA 문제 발생 |

### 3.3 코루틴 모델：사용자 공간 스케줄링

<CoroutineLightweightDemo />

#### 코루틴의 핵심 장점

```
전통적인 멀티스레딩                vs              코루틴 모델

+------------+                       +------------+
|  스레드 1   |                       |  이벤트 루프  |
| (1MB 스택) |                       |  (스케줄러)  |
+------------+                       +------------+
     |                                     |
     v                                     v
+------------+                       +------------+
|  스레드 2   |                       |  코루틴 A   |
| (1MB 스택) |                       | (몇 KB 스택) |
+------------+                       +------------+
     |                                     |
     v                                     v
+------------+                       +------------+
|  스레드 3   |                       |  코루틴 B   |
| (1MB 스택) |                       | (몇 KB 스택) |
+------------+                       +------------+

오버헤드：N MB                       오버헤드：N KB
생성：~10μs                        생성：~100ns
전환：~1μs                         전환：~100ns
```

#### async/await의 작동 메커니즘

<AsyncAwaitDemo />

```python
import asyncio

async def fetch_data(url):
    # await를 만나면 코루틴이 일시 중단되고 CPU를 양보합니다
    response = await aiohttp.get(url)
    # I/O 완료 후, 이벤트 루프가 코루틴을 깨워 여기서부터 계속 실행합니다
    return response.json()

async def main():
    # 3개의 코루틴 작업 생성
    tasks = [
        fetch_data("https://api1.example.com"),
        fetch_data("https://api2.example.com"),
        fetch_data("https://api3.example.com")
    ]
    # 동시 실행, 총 소요 시간 ≈ 가장 느린 요청 시간
    results = await asyncio.gather(*tasks)
    return results

# 이벤트 루프 시작
asyncio.run(main())
```

**실행 흐름**：

```
타임라인 -------------------------------------------------------------------->

코루틴 A: [요청 준비]--[await 일시 중단]=======[응답 수신]--[데이터 처리]
                     |
코루틴 B:              [요청 준비]--[await 일시 중단]=======[응답 수신]--[데이터 처리]
                                  |
코루틴 C:                           [요청 준비]--[await 일시 중단]=======[응답 수신]
                                               |
                                               ↓
                                         모든 I/O 완료

설명：[ ] 는 CPU 실행, === 는 I/O 대기, | 는 코루틴 전환
```

### 3.4 이벤트 루프：코루틴의 "심장"

<EventLoopDemo />

이벤트 루프는 코루틴 스케줄링의 핵심 메커니즘입니다：

```python
import selectors
import heapq

class EventLoop:
    def __init__(self):
        self.selector = selectors.DefaultSelector()
        self.ready = []  # 준비 큐
        self.scheduled = []  # 타이머 작업 큐
        self.current = None

    def run(self):
        while True:
            # 1. 타이머 작업 처리
            now = time.time()
            while self.scheduled and self.scheduled[0][0] <= now:
                _, callback = heapq.heappop(self.scheduled)
                self.ready.append(callback)

            # 2. I/O 이벤트 대기
            timeout = 0 if self.ready else 0.1
            events = self.selector.select(timeout)

            for key, mask in events:
                callback = key.data
                self.ready.append(callback)

            # 3. 준비된 콜백 실행
            while self.ready:
                callback = self.ready.popleft()
                callback()
```

### 3.5 동시성 vs 병렬성：같은 것이 아닙니다

<ConcurrentVsParallelDemo />

| 개념 | 영문 | 의미 | 비유 | 필요 조건 |
| :--- | :--- | :--- | :--- | :--- |
| **동시성** | Concurrency | 여러 작업이 교대로 실행되며, 거시적으로 동시에 진행됨 | 한 사람이 번갈아 여러 요리를 함 | 단일 코어 CPU로 가능 |
| **병렬성** | Parallelism | 여러 작업이 진정으로 동시에 실행됨 | 여러 사람이 동시에 다른 요리를 함 | 멀티 코어 CPU 또는 멀티 머신 |

**그림 설명**：

```
단일 코어 CPU - 동시성 (Concurrent)
시간 →  1    2    3    4    5    6    7    8
작업 A: [실행][실행]      [실행][실행]
작업 B:      [실행][실행]      [실행][실행]

두 작업이 교대로 실행되며, 거시적으로 "동시에" 진행

========================================

멀티 코어 CPU - 병렬성 (Parallel)
시간 →  1    2    3    4    5    6    7    8
코어 1: [작업A][작업A][작업A][작업A]
코어 2: [작업B][작업B][작업B][작업B]

두 작업이 진정으로 "동시에" 실행

========================================

현실에서는 대개：동시성 + 병렬성
시간 →  1    2    3    4    5    6    7    8
코어 1: [A1][A1][B1][B1][C1][C1][D1][D1]
코어 2: [A2][A2][B2][B2][C2][C2][D2][D2]

여러 작업이 먼저 동시적으로 여러 코어에 스케줄링된 후, 각 코어에서 병렬 실행됨
```

---

## 4. 실전：Go 코루틴과 그린 스레드

### 4.1 Go의 동시성 철학

<GoroutineGreenThreadDemo />

Go 언어의 동시성 설계 철학：**공유 메모리로 통신하지 말고, 통신으로 메모리를 공유하라**.

```go
package main

import (
    "fmt"
    "time"
)

// 생산자
func producer(ch chan<- int, id int) {
    for i := 0; i < 5; i++ {
        fmt.Printf("Producer %d sending: %d\n", id, i)
        ch <- i  // 채널에 데이터 전송
        time.Sleep(100 * time.Millisecond)
    }
}

// 소비자
func consumer(ch <-chan int, id int) {
    for val := range ch {  // 채널에서 데이터 수신
        fmt.Printf("Consumer %d received: %d\n", id, val)
    }
}

func main() {
    // 버퍼 있는 채널 생성
    ch := make(chan int, 10)

    // 2개의 생산자 고루틴 시작
    for i := 0; i < 2; i++ {
        go producer(ch, i)
    }

    // 2개의 소비자 고루틴 시작
    for i := 0; i < 2; i++ {
        go consumer(ch, i)
    }

    // 잠시 대기
    time.Sleep(3 * time.Second)
    close(ch)
}
```

### 4.2 고루틴 스케줄러：GMP 모델

Go의 스케줄러는 GMP 모델을 채택했습니다：

| 구성 요소 | 의미 | 역할 |
| :--- | :--- | :--- |
| **G (Goroutine)** | 코루틴 | 실행 대기 중인 작업, 경량(2KB 스택, 동적 확장 가능) |
| **M (Machine)** | 시스템 스레드 | 실제로 G를 실행하는 캐리어, 커널 스레드와 1:1 대응 |
| **P (Processor)** | 논리 프로세서 | 스케줄링 컨텍스트, 실행 가능한 G 큐를 포함, 기본 수량은 CPU 코어 수와 동일 |

**스케줄링 흐름**：

```
전역 큐
+----------------+
|  G1  |  G2  |  G3  |
+----------------+

P0의 로컬 큐         P1의 로컬 큐         P2의 로컬 큐         P3의 로컬 큐
+----------+       +----------+       +----------+       +----------+
| G4 | G5  |       | G6 | G7  |       | G8 | G9  |       | G10| G11 |
+----------+       +----------+       +----------+       +----------+
    |                     |                     |                     |
    v                     v                     v                     v
+----------+       +----------+       +----------+       +----------+
|    M0    |       |    M1    |       |    M2    |       |    M3    |
| (OS 스레드)|       | (OS 스레드)|       | (OS 스레드)|       | (OS 스레드)|
+----------+       +----------+       +----------+       +----------+

스케줄링 전략：
1. 각 P는 로컬 G 큐를 유지하여 락 경합을 줄입니다
2. P는 로컬 큐에서 G를 가져와 M에 할당하여 실행합니다
3. 로컬 큐가 비었을 때, 다른 P로부터 G의 절반을 "훔쳐"옵니다 (Work Stealing)
4. 전역 큐는 최후의 수단으로, 일정 시간마다 확인합니다
```

---

## 5. 실전 코드 템플릿

### 5.1 Python asyncio 고동시성 템플릿

```python
import asyncio
import aiohttp
from typing import List, Dict
import time

class AsyncHTTPClient:
    """asyncio 기반의 고성능 HTTP 클라이언트"""

    def __init__(self, max_connections: int = 100, timeout: int = 30):
        self.timeout = aiohttp.ClientTimeout(total=timeout)
        # 동시 연결 수를 제한하여 상대방 서비스가 다운되지 않도록 방지
        connector = aiohttp.TCPConnector(
            limit=max_connections,
            limit_per_host=10,  # 단일 도메인에 대한 연결 제한
            enable_cleanup_closed=True,
            force_close=True,
        )
        self.session = aiohttp.ClientSession(
            connector=connector,
            timeout=self.timeout,
        )

    async def fetch(self, url: str, method: str = 'GET', **kwargs) -> Dict:
        """단일 요청 전송"""
        try:
            async with self.session.request(method, url, **kwargs) as response:
                return {
                    'url': url,
                    'status': response.status,
                    'data': await response.text(),
                    'error': None
                }
        except asyncio.TimeoutError:
            return {'url': url, 'status': None, 'data': None, 'error': 'Timeout'}
        except Exception as e:
            return {'url': url, 'status': None, 'data': None, 'error': str(e)}

    async def fetch_many(self, urls: List[str], concurrency: int = 10) -> List[Dict]:
        """여러 URL을 동시에 가져오기, 동시성 수 제한"""
        semaphore = asyncio.Semaphore(concurrency)

        async def fetch_with_limit(url):
            async with semaphore:
                return await self.fetch(url)

        # 모든 요청을 동시 실행
        tasks = [fetch_with_limit(url) for url in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)

    async def close(self):
        await self.session.close()


# 사용 예시
async def main():
    client = AsyncHTTPClient(max_connections=50)

    # 가져올 URL 목록
    urls = [
        "https://api.github.com/users/github",
        "https://api.github.com/users/google",
        "https://api.github.com/users/microsoft",
        # ... 더 많은 URL
    ] * 10  # 300개의 요청 시뮬레이션

    start = time.time()
    results = await client.fetch_many(urls, concurrency=20)
    elapsed = time.time() - start

    # 결과 집계
    success = sum(1 for r in results if r.get('status') == 200)
    failed = len(results) - success

    print(f"총 요청 수: {len(results)}")
    print(f"성공: {success}, 실패: {failed}")
    print(f"소요 시간: {elapsed:.2f}s")
    print(f"QPS: {len(results)/elapsed:.1f}")

    await client.close()

if __name__ == "__main__":
    asyncio.run(main())
```

### 5.2 Go 고동시성 서비스 템플릿

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"runtime"
	"time"

	"golang.org/x/sync/errgroup"
)

// Request/Response 구조체
type OrderRequest struct {
	UserID    int64   `json:"user_id"`
	ProductID int64   `json:"product_id"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
}

type OrderResponse struct {
	OrderID   int64   `json:"order_id"`
	Status    string  `json:"status"`
	Total     float64 `json:"total"`
	CreatedAt string  `json:"created_at"`
}

// 데이터베이스 작업 시뮬레이션
type Database struct {
	orders map[int64]*OrderResponse
	mutex  chan struct{}
}

func NewDatabase() *Database {
	db := &Database{
		orders: make(map[int64]*OrderResponse),
		mutex:  make(chan struct{}, 1), // 뮤텍스 시뮬레이션
	}
	return db
}

func (db *Database) CreateOrder(ctx context.Context, req *OrderRequest) (*OrderResponse, error) {
	// 락 획득
	select {
	case db.mutex <- struct{}{}:
		defer func() { <-db.mutex }()
	case <-ctx.Done():
		return nil, ctx.Err()
	}

	// 데이터베이스 작업 지연 시뮬레이션
	select {
	case <-time.After(50 * time.Millisecond):
	case <-ctx.Done():
		return nil, ctx.Err()
	}

	order := &OrderResponse{
		OrderID:   time.Now().UnixNano(),
		Status:    "created",
		Total:     req.Price * float64(req.Quantity),
		CreatedAt: time.Now().Format(time.RFC3339),
	}
	db.orders[order.OrderID] = order
	return order, nil
}

// HTTP 핸들러
type Handler struct {
	db *Database
}

func NewHandler(db *Database) *Handler {
	return &Handler{db: db}
}

func (h *Handler) CreateOrder(w http.ResponseWriter, r *http.Request) {
	// 요청 타임아웃 설정
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()

	var req OrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	order, err := h.db.CreateOrder(ctx, &req)
	if err != nil {
		if err == context.DeadlineExceeded {
			http.Error(w, "Request timeout", http.StatusGatewayTimeout)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(order)
}

func (h *Handler) Health(w http.ResponseWriter, r *http.Request) {
	info := map[string]interface{}{
		"status":    "ok",
		"goroutine": runtime.NumGoroutine(),
		"cpu":       runtime.NumCPU(),
		"version":   runtime.Version(),
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(info)
}

// 배치 처리 예시
func BatchProcess(ctx context.Context, items []int) ([]int, error) {
	g, ctx := errgroup.WithContext(ctx)
	g.SetLimit(10) // 동시성 수를 10으로 제한

	results := make([]int, len(items))

	for i, item := range items {
		i, item := i, item // 클로저 함정 방지
		g.Go(func() error {
			select {
			case <-ctx.Done():
				return ctx.Err()
			default:
				// 처리 시뮬레이션
				time.Sleep(100 * time.Millisecond)
				results[i] = item * 2
				return nil
			}
		})
	}

	if err := g.Wait(); err != nil {
		return nil, err
	}
	return results, nil
}

func main() {
	// 데이터베이스 초기화
	db := NewDatabase()

	// 핸들러 생성
	handler := NewHandler(db)

	// 라우트 설정
	mux := http.NewServeMux()
	mux.HandleFunc("/order", handler.CreateOrder)
	mux.HandleFunc("/health", handler.Health)

	// 서버 생성
	server := &http.Server{
		Addr:         ":8080",
		Handler:      mux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	fmt.Println("Server starting on :8080")
	fmt.Printf("Go version: %s\n", runtime.Version())
	fmt.Printf("CPU cores: %d\n", runtime.NumCPU())

	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
```

---

## 6. 요약 비교표

### 6.1 핵심 개념 비교

| 특성 | 프로세스 | 스레드 | 코루틴 |
| :--- | :--- | :--- | :--- |
| **스케줄러** | 운영체제 | 운영체제 | 사용자 프로그램/런타임 |
| **전환 오버헤드** | ~1-10ms | ~1-10μs | ~100ns |
| **메모리 사용량** | ~10MB+ | ~1MB | ~2KB |
| **통신 방식** | IPC | 공유 메모리 | 공유 메모리/채널 |
| **동기화 필요** | 불필요 | 락 필요 | 락/협력적 필요 |
| **충돌 영향** | 해당 프로세스만 | 전체 프로세스 | 제어 가능 |
| **적용 시나리오** | 강한 격리, 멀티테넌시 | CPU 집약적 | I/O 집약적 |
| **대표 언어** | 모든 언어 | 모든 언어 | Go, Python, JS, Rust |

### 6.2 동시성 모델 선택 가이드

| 시나리오 | 추천 모델 | 이유 |
| :--- | :--- | :--- |
| 웹 서비스 게이트웨이 | 코루틴 + 비동기 I/O | 높은 동시 연결, 낮은 메모리 사용량 |
| 실시간 통신 서비스 | 코루틴 + 긴 연결 | 대량의 WebSocket 연결 유지 |
| 데이터 처리 파이프라인 | 멀티프로세스 + 코루틴 | 멀티코어 활용, I/O가 블로킹되지 않음 |
| 과학 계산 | 멀티스레드/멀티프로세스 | CPU 집약적, 병렬 계산 필요 |
| 마이크로서비스 아키텍처 | 멀티프로세스 + 코루틴 | 서비스 간 격리, 내부 고동시성 |
| 임베디드 시스템 | 코루틴/단일 스레드 | 리소스 제한, 결정적 스케줄링 |

### 6.3 용어 대조표

| 영문 용어 | 한국어 대조 | 설명 |
| :--- | :--- | :--- |
| **Process** | 프로세스 | 운영체제 리소스 할당의 기본 단위, 독립된 메모리 공간 보유 |
| **Thread** | 스레드 | CPU 스케줄링의 기본 단위, 프로세스 메모리 공간 공유 |
| **Coroutine** | 코루틴 | 사용자 공간 경량 스레드, 프로그램이 자체적으로 스케줄링 |
| **Concurrency** | 동시성 | 여러 작업이 교대로 실행되며, 거시적으로 동시에 진행 |
| **Parallelism** | 병렬성 | 여러 작업이 진정으로 동시에 실행, 멀티코어 지원 필요 |
| **Context Switch** | 컨텍스트 스위칭 | CPU가 한 작업에서 다른 작업으로 전환하는 과정 |
| **Blocking I/O** | 블로킹 I/O | I/O 요청 후 완료까지 대기하며, 대기 중 스레드 일시 중단 |
| **Non-blocking I/O** | 논블로킹 I/O | I/O 요청 후 즉시 반환, 결과를 기다리지 않음 |
| **Async I/O** | 비동기 I/O | I/O 완료 시 콜백 또는 알림 메커니즘으로 호출자에게 통지 |
| **Event Loop** | 이벤트 루프 | 코루틴 스케줄링 메커니즘, 지속적으로 이벤트를 감시하고 분배 처리 |
| **Goroutine** | 고루틴 | Go 언어의 경량 스레드 구현 |
| **Channel** | 채널 | Go 언어에서 코루틴 간 통신을 위한 메커니즘 |
| **Mutex** | 뮤텍스 | 공유 리소스를 보호하기 위한 동기화 프리미티브 |
| **Semaphore** | 세마포어 | 특정 리소스에 동시에 접근하는 스레드 수를 제어 |
| **Deadlock** | 데드락 | 여러 스레드가 서로 리소스 해제를 기다리며 영구적으로 블로킹됨 |
| **Race Condition** | 경합 조건 | 여러 스레드가 동시에 공유 데이터에 접근하여 결과가 불확정적임 |
| **Thread Pool** | 스레드 풀 | 스레드 그룹을 미리 생성하여 재사용함으로써 생성/소멸 오버헤드 감소 |
| **Work Stealing** | 작업 훔치기 | 유휴 스레드가 바쁜 스레드의 큐에서 작업을 "훔쳐" 실행 |
| **Zero-copy** | 제로 카피 | 데이터가 커널 공간과 사용자 공간 간 전송 시 CPU 복사를 거치지 않음 |
| **C10K Problem** | C10K 문제 | 단일 머신에서 1만 개의 연결을 동시에 처리하는 도전 과제 |
| **C10M Problem** | C10M 문제 | 단일 머신에서 1000만 개의 연결을 동시에 처리하는 궁극의 도전 과제 |

---

## 7. 마치며

### 7.1 동시성 프로그래밍의 황금률

1. **성급한 최적화를 하지 마세요**：먼저 코드가 올바르게 동작하게 한 후, 성능 최적화를 고려하세요
2. **공유 상태를 피하세요**："공유 메모리로 통신하지 말고, 통신으로 메모리를 공유하라"
3. **오류를 최대한 빨리 노출시키세요**：동시성 버그는 재현하기 어려운 경우가 많으므로, 테스트 단계에서 가능한 한 많이 노출시켜야 합니다
4. **동시성 수를 제한하세요**：무제한 동시성은 보호 장치가 없는 것과 같습니다. 세마포어나 커넥션 풀로 제한해야 합니다
5. **모니터링과 가시성을 확보하세요**：동시성 시스템은 완벽한 모니터링이 있어야 문제를 빠르게 찾을 수 있습니다

### 7.2 학습 로드맵

```
1단계: 기초 이해
    ├── 프로세스/스레드의 기본 개념 이해
    ├── 동기화 프리미티브 학습 (락, 세마포어, 조건 변수)
    └── 간단한 멀티스레드 프로그램 작성

2단계: 원리 심화
    ├── 메모리 모델과 가시성 이해
    ├── 무락 프로그래밍과 원자적 연산 학습
    ├── 스레드 풀과 작업 훔치기 이해
    └── 데드락과 경합 조건 분석

3단계: 고급 응용
    ├── 코루틴과 비동기 프로그래밍 마스터
    ├── Go/Python/Rust의 동시성 모델 학습
    ├── 분산 시스템에서의 동시성 이해
    └── 성능 튜닝과 용량 계획

4단계: 전문가 수준
    ├── 고동시성 시스템 아키텍처 설계
    ├── 복잡한 동시성 버그 해결
    ├── 동시성 프로그래밍 프레임워크 개발
    └── 동시성 지식 공유와 전파
```

이 가이드가 동시성 프로그래밍에 대한 체계적인 인식을 구축하는 데 도움이 되길 바랍니다. 기억하세요, **동시성은 목적이 아니라 수단입니다** — 진정한 목표는 고성능, 고가용성 서비스를 구축하는 것입니다. 원리를 이해하고, 올바른 모델을 선택하고, 좋은 코드를 작성한다면, 당신은 동시성의 길에서 점점 더 멀리 나아갈 수 있을 것입니다.