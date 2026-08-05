# Principios de concurrencia, asincronía y multihilo
> 💡 **Guía de estudio**: La programación concurrente es el "talón de Aquiles" de muchos ingenieros de backend: tropiezan en entrevistas, generan bugs en producción y no saben por dónde empezar a optimizar el rendimiento. Este capítulo gira en torno a una pregunta central: **cuando 100 000 usuarios solicitan tu servicio al mismo tiempo, ¿tu código colapsará?**

Antes de empezar, te recomendamos repasar dos "bloques fundamentales":

- **Qué son CPU, memoria y E/S**: si no tienes claros estos conceptos básicos, puedes revisar primero los fundamentos del sistema operativo.
- **Qué es bloqueante/no bloqueante**: si aún no estás familiarizado con los conceptos de síncrono/asíncrono, puedes experimentarlo primero mediante práctica de programación.

---

## 0. Introducción: Motivación de tu servicio se "congela" en horas pico

<ProcessThreadCoroutineDemo />

Muchos desarrolladores se encuentran con situaciones similares en el desarrollo real:

- En pruebas locales el servicio responde rapidísimo, pero en producción va "a trompicones";
- Has comprado servidores de alta configuración, pero el uso de CPU nunca llega a niveles altos;
- En temporada de rebajas, el servicio entra en "avalancha" y te ves obligado a degradar o aplicar circuit breakers.

Intuitivamente, pensamos: **"el servidor no es suficientemente potente"**.
Pero la mayoría de las veces, el problema no está en que el hardware "no sea rápido", sino en que **no hemos diseñado bien el modelo de concurrencia**.

**La contradicción central**:
- Si no hay procesamiento concurrente: las peticiones de los usuarios esperan en cola, la experiencia es pésima;
- Si se abusa del multihilo: contención de locks, sobrecarga por cambio de contexto, y el rendimiento en realidad empeora.

Ante estos desafíos, limitarse a "añadir más máquinas" ya no es suficiente. Necesitamos un enfoque sistemático de diseño de concurrencia que garantice tanto rendimiento como estabilidad en escenarios de alta concurrencia. Eso es precisamente lo que este capítulo pretende resolver.

---

## 1. Conceptos clave: qué diferencia hay entre proceso, hilo y corrutina

### 1.1 La metáfora del restaurante

Imagina que tienes un restaurante y debes atender a muchos clientes a la vez:

| Concepto | Metáfora del restaurante | Significado técnico |
| :--- | :--- | :--- |
| **Proceso (Process)** | **Sucursal independiente del restaurante** | Tiene espacio de memoria independiente y asignación de recursos propia; es la unidad básica de asignación de recursos del sistema operativo. Si un proceso falla, no afecta a los demás. |
| **Hilo (Thread)** | **Cocinero dentro de una sucursal** | Es la unidad básica de planificación de CPU; comparte el espacio de memoria del proceso. Los hilos de un mismo proceso pueden compartir datos, pero si un hilo falla puede tumbar todo el proceso. |
| **Corrutina (Coroutine)** | **El "don de la ubicuidad" del cocinero** | Hilo ligero en espacio de usuario, planificado por el propio programa y no por el sistema operativo. El coste de cambio es mínimo; se pueden crear millones de ellas. |

### 1.2 Comparación en profundidad: diferencias esenciales entre los tres

<ProcessIsolationDemo />

#### Proceso: el "contenedor" de aislamiento de recursos

**Características principales**:
- **Aislamiento fuerte**: cada proceso tiene su propio espacio de direcciones virtuales independiente
- **Coste elevado**: la creación/cambio requiere intervención del sistema operativo, tarda entre 1 y 10 ms
- **Comunicación compleja**: la comunicación entre procesos (IPC) necesita mecanismos especiales (pipes, colas de mensajes, memoria compartida, etc.)

**Casos de uso**:
- Servicios que requieren aislamiento fuerte (pestañas de navegador, programas en sandbox)
- Servicios con despliegue multilenguaje
- Unidades de servicio que necesitan reinicio/actualización independiente

#### Hilo: la "caballería ligera" de memoria compartida

<ThreadSchedulingDemo />

**Características principales**:
- **Memoria compartida**: los hilos de un mismo proceso comparten segmento de código, segmento de datos y heap
- **Pila independiente**: cada hilo tiene su propia pila (normalmente alrededor de 1 MB)
- **Cambio relativamente rápido**: el cambio de hilo tarda entre 1 y 10 μs, unas 1000 veces más rápido que el de proceso
- **Necesita sincronización**: los datos compartidos requieren protección con locks

**Casos de uso**:
- Tareas intensivas en CPU (cálculo, procesamiento de imágenes)
- Tareas concurrentes que necesitan compartir muchos datos
- Tareas en segundo plano sensibles a la latencia

#### Corrutina: el "hilo verde" en espacio de usuario

<CoroutineLightweightDemo />

**Características principales**:
- **Planificación en espacio de usuario**: planificada por el programa o la biblioteca de runtime, sin pasar por el sistema operativo
- **Extremadamente ligera**: la pila de una corrutina suele ser de solo unos KB; se pueden crear millones
- **Cambio ultrarrápido**: el cambio de corrutina tarda unos 100 ns, 100 veces más rápido que el de hilo
- **No expropiativa**: la corrutina cede la CPU voluntariamente (multitarea cooperativa)

**Casos de uso**:
- Servicios de alta concurrencia intensivos en E/S (servidores web, gateways)
- Escenarios que requieren mantener muchas conexiones de larga duración (IM, servidores de juegos)
- Procesamiento de datos en streaming, trabajos en cadena

---

## 2. Caso de estudio: el "dolor de la concurrencia" en las rebajas de un ecommerce

### 2.1 Lecciones aprendidas con sangre: evolución de "monolítico" a "distribuido"

Veamos una historia real de evolución de un sistema de ecommerce:

#### Fase 1: era monolítica (1000 DAU)

```python
# Aplicación Flask sencilla
from flask import Flask

app = Flask(__name__)

@app.route('/order')
def create_order():
    # Consultar inventario
    stock = db.query("SELECT stock FROM products WHERE id=1")
    if stock > 0:
        # Reducir inventario
        db.execute("UPDATE products SET stock = stock - 1 WHERE id=1")
        # Crear pedido
        db.execute("INSERT INTO orders ...")
        return "Order created!"
    return "Out of stock!"

# Arranque: flask run
```

**Problemas**:
- Un solo proceso con un solo hilo, solo puede manejar una petición a la vez
- La reducción de inventario no tiene lock, lo que provoca sobreventa en concurrencia
- El número de conexiones a la base de datos es limitado, el pool de conexiones se agota rápidamente

#### Fase 2: era multiproceso (10 000 DAU)

```python
# Despliegue multiproceso con Gunicorn
gunicorn -w 4 -k sync app:app

# 4 procesos worker, cada uno maneja peticiones independientemente
```

**Nuevos problemas**:
- ¡Los 4 procesos consultan el inventario a la vez, todos ven stock=1, todos reducen con éxito, 3 sobreventas!
- Hay que introducir un lock distribuido

```python
import redis

# Usar lock distribuido de Redis
lock = redis_client.lock("stock_lock", timeout=10)
if lock.acquire():
    try:
        stock = db.query("SELECT stock FROM products WHERE id=1")
        if stock > 0:
            db.execute("UPDATE products SET stock = stock - 1 WHERE id=1")
    finally:
        lock.release()
```

#### Fase 3: era de corrutinas (100 000 DAU)

```python
# Usar FastAPI + asyncio
from fastapi import FastAPI
import asyncio

app = FastAPI()

async def check_stock(product_id: int) -> int:
    # Consulta asíncrona a la base de datos, no bloquea
    result = await db.fetch_one(
        "SELECT stock FROM products WHERE id = :id",
        {"id": product_id}
    )
    return result["stock"]

@app.get("/order")
async def create_order(product_id: int):
    # Verificar inventario e información de usuario concurrentemente
    stock_task = check_stock(product_id)
    user_task = get_user_info(request.user_id)

    stock, user = await asyncio.gather(stock_task, user_task)

    if stock > 0:
        # Reducir inventario de forma asíncrona
        await db.execute(
            "UPDATE products SET stock = stock - 1 WHERE id = :id",
            {"id": product_id}
        )
        return {"status": "success"}

    return {"status": "out_of_stock"}

# Arranque: uvicorn main:app --workers 4
# Cada worker puede manejar miles de corrutinas concurrentes
```

**Ventajas**:
- Un solo hilo puede manejar miles de conexiones concurrentes
- En operaciones de E/S, la CPU se cede activamente, sin bloquear otras peticiones
- Uso de memoria extremadamente bajo, ideal para escenarios de alta concurrencia con conexiones largas

### 2.2 Tabla comparativa de evolución del modelo de concurrencia

| Fase | Modelo de concurrencia | DAU soportados | Problema central | Solución |
| :--- | :--- | :--- | :--- | :--- |
| **Monolito** | Un proceso, un hilo | 1K | Sin concurrencia | Introducir multiproceso |
| **Multiproceso** | Multiproceso síncrono | 10K | Condición de carrera, sobreventa | Lock distribuido |
| **Multihilo** | Multihilo + locks | 50K | Coste de cambio de contexto, deadlocks | Pool de hilos, colas sin lock |
| **Corrutinas** | E/S asíncrona | 100K+ | Complejidad de código, depuración difícil | Encapsulación en framework, trazabilidad |
| **Híbrido** | Multiproceso + corrutinas | 1000K+ | Complejidad arquitectónica | Gobierno de servicios, elastic scaling |

---

## 3. Principios en profundidad: cómo funcionan los distintos modelos de concurrencia

### 3.1 Modelo de procesos: aislamiento y comunicación

#### Mecanismo de aislamiento de memoria

<ProcessIsolationDemo />

Cada proceso tiene un espacio de direcciones virtuales independiente:

```
Memoria virtual del proceso A    Memoria virtual del proceso B
+----------------+               +----------------+
|  Espacio kernel |               |  Espacio kernel |  <-- compartido (solo lectura)
|  (compartido)   |               |  (compartido)   |
+----------------+               +----------------+
|  Pila (stack)   |               |  Pila (stack)   |  <-- independiente
|  (crece abajo)  |               |  (crece abajo)  |
+----------------+               +----------------+
|  Heap           |               |  Heap           |  <-- independiente
|  (crece arriba) |               |  (crece arriba) |
+----------------+               +----------------+
|  Segmento datos |               |  Segmento datos |  <-- independiente
|  (.bss/.data)   |               |  (.bss/.data)   |
+----------------+               +----------------+
|  Segmento código|               |  Segmento código|  <-- independiente
|  (.text)        |               |  (.text)        |
+----------------+               +----------------+
```

#### Métodos de comunicación entre procesos (IPC)

| Método | Principio | Velocidad | Caso de uso |
| :--- | :--- | :--- | :--- |
| **Pipe (tubería)** | Búfer del kernel, flujo unidireccional | Media | Comunicación entre proceso padre e hijo |
| **Cola de mensajes** | Lista enlazada de mensajes del kernel | Media | Paso de mensajes asíncronos |
| **Memoria compartida** | Misma memoria física mapeada | La más rápida | Compartición de grandes volúmenes de datos |
| **Semáforo** | Contador del kernel | - | Sincronización y exclusión mutua |
| **Socket** | Pila de protocolos de red | Más lenta | Comunicación entre máquinas |
| **Señal (Signal)** | Interrupción por software | - | Notificación de eventos |

### 3.2 Modelo de hilos: planificación y sincronización

#### Principio de planificación de hilos

<ThreadSchedulingDemo />

Funcionamiento básico del planificador de hilos del sistema operativo:

```
Cola de listos                    En ejecución                   Cola de espera
+--------+                       +--------+                     +--------+
| Hilo B |  <-- fin de quantum   | Hilo A |  <-- solicitud E/S  | Hilo C |
| Hilo D |                       | (ejec.)|                     | Hilo E |
| Hilo F |                       +--------+                     | (bloq.) |
+--------+                                                      +--------+
    |                                                                |
    v                                                                v
El planificador elige el siguiente     Al completar E/S, vuelve a la cola de listos
según prioridad
```

#### Mecanismos comunes de sincronización de hilos

| Mecanismo | Principio | Ventajas | Desventajas |
| :--- | :--- | :--- | :--- |
| **Mutex (exclusión mutua)** | Estado binario, acceso exclusivo | Implementación simple | Bajo rendimiento con alta contención |
| **RWLock (lectura/escritura)** | Lectura compartida, escritura exclusiva | Eficiente con muchas lecturas y pocas escrituras | Implementación compleja, riesgo de inanición de escritura |
| **Spinlock** | Espera activa, no libera CPU | Eficiente cuando la espera es corta | Desperdicia CPU si la espera es larga |
| **Variable de condición** | Espera hasta que se cumpla una condición | Evita la espera activa | Debe usarse junto con un lock |
| **Semáforo (Semaphore)** | Contador que controla el número de accesos | Permite limitar la concurrencia | Fácil de usar mal |
| **Operaciones atómicas** | Atomicidad a nivel de instrucción CPU | Sin locks, máximo rendimiento | Solo para tipos de datos simples |
| **Cola sin lock** | Implementada con operaciones CAS | Rendimiento excelente en alta concurrencia | Implementación compleja, problema ABA |

### 3.3 Modelo de corrutinas: planificación en espacio de usuario

<CoroutineLightweightDemo />

#### Ventajas principales de las corrutinas

```
Multihilo tradicional           vs              Modelo de corrutinas

+------------+                                  +------------+
|  Hilo 1     |                                  |  Bucle de   |
| (pila 1MB)  |                                  |  eventos    |
+------------+                                  | (planificador)|
     |                                           +------------+
     v                                                |
+------------+                                        v
|  Hilo 2     |                                  +------------+
| (pila 1MB)  |                                  | Corrutina A |
+------------+                                  | (pila ~KB)  |
     |                                           +------------+
     v                                                |
+------------+                                        v
|  Hilo 3     |                                  +------------+
| (pila 1MB)  |                                  | Corrutina B |
+------------+                                  | (pila ~KB)  |
                                                +------------+

Coste: N MB                                      Coste: N KB
Creación: ~10 μs                                 Creación: ~100 ns
Cambio: ~1 μs                                    Cambio: ~100 ns
```

#### Mecanismo de funcionamiento de async/await

<AsyncAwaitDemo />

```python
import asyncio

async def fetch_data(url):
    # Al encontrar await, la corrutina se suspende y cede la CPU
    response = await aiohttp.get(url)
    # Al completar la E/S, el bucle de eventos despierta la corrutina, continúa desde aquí
    return response.json()

async def main():
    # Crear 3 tareas de corrutina
    tasks = [
        fetch_data("https://api1.example.com"),
        fetch_data("https://api2.example.com"),
        fetch_data("https://api3.example.com")
    ]
    # Ejecución concurrente, tiempo total ≈ la petición más lenta
    results = await asyncio.gather(*tasks)
    return results

# Iniciar el bucle de eventos
asyncio.run(main())
```

**Flujo de ejecución**:

```
Línea de tiempo --------------------------------------------------------->

Corrutina A: [Preparar petición]--[await suspende]=======[Recibir respuesta]--[Procesar datos]
                                  |
Corrutina B:                      [Preparar petición]--[await suspende]=======[Recibir respuesta]--[Procesar datos]
                                                       |
Corrutina C:                                            [Preparar petición]--[await suspende]=======[Recibir respuesta]
                                                                             |
                                                                             v
                                                                     Todas las E/S completadas

Leyenda: [ ] ejecución de CPU, === espera de E/S, | cambio de corrutina
```

### 3.4 Bucle de eventos: el "corazón" de las corrutinas

<EventLoopDemo />

El bucle de eventos es el mecanismo central de planificación de corrutinas:

```python
import selectors
import heapq

class EventLoop:
    def __init__(self):
        self.selector = selectors.DefaultSelector()
        self.ready = []  # Cola de listos
        self.scheduled = []  # Cola de tareas programadas
        self.current = None

    def run(self):
        while True:
            # 1. Procesar tareas programadas
            now = time.time()
            while self.scheduled and self.scheduled[0][0] <= now:
                _, callback = heapq.heappop(self.scheduled)
                self.ready.append(callback)

            # 2. Esperar eventos de E/S
            timeout = 0 if self.ready else 0.1
            events = self.selector.select(timeout)

            for key, mask in events:
                callback = key.data
                self.ready.append(callback)

            # 3. Ejecutar callbacks listos
            while self.ready:
                callback = self.ready.popleft()
                callback()
```

### 3.5 Concurrencia vs paralelismo: no son lo mismo

<ConcurrentVsParallelDemo />

| Concepto | Inglés | Significado | Metáfora | Requisito |
| :--- | :--- | :--- | :--- | :--- |
| **Concurrencia** | Concurrency | Múltiples tareas se ejecutan alternadamente, avanzando simultáneamente a nivel macro | Una persona cocinando varios platos por turnos | CPU de un solo núcleo |
| **Paralelismo** | Parallelism | Múltiples tareas se ejecutan realmente al mismo tiempo | Varias personas cocinando platos distintos simultáneamente | CPU multinúcleo o múltiples máquinas |

**Ilustración**:

```
CPU mononúcleo - Concurrencia (Concurrent)
Tiempo →  1    2    3    4    5    6    7    8
Tarea A: [ejec][ejec]      [ejec][ejec]
Tarea B:      [ejec][ejec]      [ejec][ejec]

Dos tareas se ejecutan alternadamente, a nivel macro avanzan "a la vez"

========================================

CPU multinúcleo - Paralelismo (Parallel)
Tiempo →  1    2    3    4    5    6    7    8
Núcleo 1: [TareaA][TareaA][TareaA][TareaA]
Núcleo 2: [TareaB][TareaB][TareaB][TareaB]

Dos tareas se ejecutan realmente "al mismo tiempo"

========================================

En la realidad suele ser: concurrencia + paralelismo
Tiempo →  1    2    3    4    5    6    7    8
Núcleo 1: [A1][A1][B1][B1][C1][C1][D1][D1]
Núcleo 2: [A2][A2][B2][B2][C2][C2][D2][D2]

Múltiples tareas se planifican concurrentemente a distintos núcleos, y luego se ejecutan en paralelo en ellos
```

---

## 4. Práctica: Goroutines de Go e hilos verdes

### 4.1 La filosofía de concurrencia de Go

<GoroutineGreenThreadDemo />

La filosofía de diseño de concurrencia de Go: **no te comuniques compartiendo memoria; comparte memoria comunicándote**.

```go
package main

import (
    "fmt"
    "time"
)

// Productor
func producer(ch chan<- int, id int) {
    for i := 0; i < 5; i++ {
        fmt.Printf("Producer %d sending: %d\n", id, i)
        ch <- i  // Enviar datos al channel
        time.Sleep(100 * time.Millisecond)
    }
}

// Consumidor
func consumer(ch <-chan int, id int) {
    for val := range ch {  // Recibir datos del channel
        fmt.Printf("Consumer %d received: %d\n", id, val)
    }
}

func main() {
    // Crear un channel con búfer
    ch := make(chan int, 10)

    // Iniciar 2 goroutines productoras
    for i := 0; i < 2; i++ {
        go producer(ch, i)
    }

    // Iniciar 2 goroutines consumidoras
    for i := 0; i < 2; i++ {
        go consumer(ch, i)
    }

    // Esperar un tiempo
    time.Sleep(3 * time.Second)
    close(ch)
}
```

### 4.2 El planificador de Goroutines: modelo GMP

El planificador de Go usa el modelo GMP:

| Componente | Significado | Función |
| :--- | :--- | :--- |
| **G (Goroutine)** | Corrutina | Tarea a ejecutar, ligera (pila de 2 KB, escalable dinámicamente) |
| **M (Machine)** | Hilo del sistema | Soporte real de ejecución de G, correspondencia 1:1 con hilo del kernel |
| **P (Processor)** | Procesador lógico | Contexto de planificación, contiene la cola de G ejecutables; cantidad por defecto igual al número de núcleos CPU |

**Flujo de planificación**:

```
Cola global
+----------------+
|  G1  |  G2  |  G3  |
+----------------+

Cola local de P0     Cola local de P1     Cola local de P2     Cola local de P3
+----------+         +----------+         +----------+         +----------+
| G4 | G5  |         | G6 | G7  |         | G8 | G9  |         | G10| G11 |
+----------+         +----------+         +----------+         +----------+
    |                     |                     |                     |
    v                     v                     v                     v
+----------+         +----------+         +----------+         +----------+
|    M0    |         |    M1    |         |    M2    |         |    M3    |
| (hilo OS)|         | (hilo OS)|         | (hilo OS)|         | (hilo OS)|
+----------+         +----------+         +----------+         +----------+

Estrategia de planificación:
1. Cada P mantiene una cola local de G, reduciendo la contención de locks
2. P toma G de su cola local y la asigna a M para ejecución
3. Cuando la cola local está vacía, "roba" la mitad de las G de otro P (Work Stealing)
4. La cola global actúa como respaldo, se revisa periódicamente
```

---

## 5. Plantillas de código práctico

### 5.1 Plantilla de alta concurrencia con Python asyncio

```python
import asyncio
import aiohttp
from typing import List, Dict
import time

class AsyncHTTPClient:
    """Cliente HTTP de alto rendimiento basado en asyncio"""

    def __init__(self, max_connections: int = 100, timeout: int = 30):
        self.timeout = aiohttp.ClientTimeout(total=timeout)
        # Limitar conexiones concurrentes para no tumbar el servicio remoto
        connector = aiohttp.TCPConnector(
            limit=max_connections,
            limit_per_host=10,  # Límite de conexiones por dominio
            enable_cleanup_closed=True,
            force_close=True,
        )
        self.session = aiohttp.ClientSession(
            connector=connector,
            timeout=self.timeout,
        )

    async def fetch(self, url: str, method: str = 'GET', **kwargs) -> Dict:
        """Enviar una sola petición"""
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
        """Obtener múltiples URLs concurrentemente, limitando la concurrencia"""
        semaphore = asyncio.Semaphore(concurrency)

        async def fetch_with_limit(url):
            async with semaphore:
                return await self.fetch(url)

        # Ejecutar todas las peticiones concurrentemente
        tasks = [fetch_with_limit(url) for url in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)

    async def close(self):
        await self.session.close()


# Ejemplo de uso
async def main():
    client = AsyncHTTPClient(max_connections=50)

    # Lista de URLs a obtener
    urls = [
        "https://api.github.com/users/github",
        "https://api.github.com/users/google",
        "https://api.github.com/users/microsoft",
        # ... más URLs
    ] * 10  # Simular 300 peticiones

    start = time.time()
    results = await client.fetch_many(urls, concurrency=20)
    elapsed = time.time() - start

    # Estadísticas
    success = sum(1 for r in results if r.get('status') == 200)
    failed = len(results) - success

    print(f"Total peticiones: {len(results)}")
    print(f"Éxito: {success}, Fallos: {failed}")
    print(f"Tiempo: {elapsed:.2f}s")
    print(f"QPS: {len(results)/elapsed:.1f}")

    await client.close()

if __name__ == "__main__":
    asyncio.run(main())
```

### 5.2 Plantilla de servicio de alta concurrencia con Go

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

// Estructuras Request/Response
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

// Simulación de operaciones de base de datos
type Database struct {
	orders map[int64]*OrderResponse
	mutex  chan struct{}
}

func NewDatabase() *Database {
	db := &Database{
		orders: make(map[int64]*OrderResponse),
		mutex:  make(chan struct{}, 1), // Simular mutex
	}
	return db
}

func (db *Database) CreateOrder(ctx context.Context, req *OrderRequest) (*OrderResponse, error) {
	// Adquirir lock
	select {
	case db.mutex <- struct{}{}:
		defer func() { <-db.mutex }()
	case <-ctx.Done():
		return nil, ctx.Err()
	}

	// Simular latencia de operación de base de datos
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

// Manejador HTTP
type Handler struct {
	db *Database
}

func NewHandler(db *Database) *Handler {
	return &Handler{db: db}
}

func (h *Handler) CreateOrder(w http.ResponseWriter, r *http.Request) {
	// Establecer timeout de petición
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

// Ejemplo de procesamiento por lotes
func BatchProcess(ctx context.Context, items []int) ([]int, error) {
	g, ctx := errgroup.WithContext(ctx)
	g.SetLimit(10) // Limitar concurrencia a 10

	results := make([]int, len(items))

	for i, item := range items {
		i, item := i, item // Evitar la trampa de closure
		g.Go(func() error {
			select {
			case <-ctx.Done():
				return ctx.Err()
			default:
				// Simular procesamiento
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
	// Inicializar base de datos
	db := NewDatabase()

	// Crear manejador
	handler := NewHandler(db)

	// Configurar rutas
	mux := http.NewServeMux()
	mux.HandleFunc("/order", handler.CreateOrder)
	mux.HandleFunc("/health", handler.Health)

	// Crear servidor
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

## 6. Tablas resumen

### 6.1 Comparativa de conceptos clave

| Característica | Proceso | Hilo | Corrutina |
| :--- | :--- | :--- | :--- |
| **Planificador** | Sistema operativo | Sistema operativo | Programa/runtime de usuario |
| **Coste de cambio** | ~1-10 ms | ~1-10 μs | ~100 ns |
| **Uso de memoria** | ~10 MB+ | ~1 MB | ~2 KB |
| **Comunicación** | IPC | Memoria compartida | Memoria compartida/Channel |
| **Necesidad de sincronización** | No | Requiere locks | Requiere locks/cooperativa |
| **Impacto de fallo** | Solo el propio proceso | Todo el proceso | Controlable |
| **Caso de uso** | Aislamiento fuerte, multi-tenancy | Intensivo en CPU | Intensivo en E/S |
| **Lenguajes típicos** | Todos | Todos | Go, Python, JS, Rust |

### 6.2 Guía de selección del modelo de concurrencia

| Escenario | Modelo recomendado | Razón |
| :--- | :--- | :--- |
| Gateway de servicios web | Corrutinas + E/S asíncrona | Alta concurrencia de conexiones, bajo uso de memoria |
| Servicio de comunicación en tiempo real | Corrutinas + conexiones largas | Mantener muchas conexiones WebSocket |
| Pipeline de procesamiento de datos | Multiproceso + corrutinas | Aprovecha multinúcleo, E/S no bloqueante |
| Computación científica | Multihilo/multiproceso | Intensivo en CPU, necesita computación paralela |
| Arquitectura de microservicios | Multiproceso + corrutinas | Aislamiento entre servicios, alta concurrencia interna |
| Sistemas embebidos | Corrutinas/monohilo | Recursos limitados, planificación determinista |

### 6.3 Glosario de términos

| Término inglés | Traducción | Explicación |
| :--- | :--- | :--- |
| **Process** | Proceso | Unidad básica de asignación de recursos del SO, con espacio de memoria independiente |
| **Thread** | Hilo | Unidad básica de planificación de CPU, comparte el espacio de memoria del proceso |
| **Coroutine** | Corrutina | Hilo ligero en espacio de usuario, planificado autónomamente por el programa |
| **Concurrency** | Concurrencia | Múltiples tareas se ejecutan alternadamente, avanzando simultáneamente a nivel macro |
| **Parallelism** | Paralelismo | Múltiples tareas se ejecutan realmente al mismo tiempo, requiere soporte multinúcleo |
| **Context Switch** | Cambio de contexto | Proceso por el cual la CPU pasa de una tarea a otra |
| **Blocking I/O** | E/S bloqueante | Al iniciar una petición de E/S se espera a que termine, el hilo se suspende mientras tanto |
| **Non-blocking I/O** | E/S no bloqueante | Al iniciar una petición de E/S se retorna inmediatamente, sin esperar el resultado |
| **Async I/O** | E/S asíncrona | Al completar la E/S se notifica al llamante mediante callback o mecanismo de notificación |
| **Event Loop** | Bucle de eventos | Mecanismo de planificación de corrutinas, escucha eventos continuamente y los despacha |
| **Goroutine** | Goroutine | Implementación de hilo ligero de Go |
| **Channel** | Canal | Mecanismo de comunicación entre corrutinas en Go |
| **Mutex** | Mutex | Primitiva de sincronización para proteger recursos compartidos |
| **Semaphore** | Semáforo | Controla el número de hilos que acceden simultáneamente a un recurso |
| **Deadlock** | Interbloqueo | Varios hilos se esperan mutuamente para liberar recursos, causando bloqueo permanente |
| **Race Condition** | Condición de carrera | Varios hilos acceden simultáneamente a datos compartidos, produciendo resultados indeterminados |
| **Thread Pool** | Pool de hilos | Grupo de hilos creados de antemano y reutilizados para reducir el coste de creación/destrucción |
| **Work Stealing** | Robo de trabajo | Hilos ociosos "roban" tareas de la cola de hilos ocupados para ejecutarlas |
| **Zero-copy** | Copia cero | Los datos se transfieren entre espacio kernel y espacio usuario sin copia de CPU |
| **C10K Problem** | Problema C10K | El desafío de manejar 10 000 conexiones simultáneas en una sola máquina |
| **C10M Problem** | Problema C10M | El desafío definitivo de manejar 10 millones de conexiones simultáneas en una sola máquina |

---

## 7. Para terminar

### 7.1 Las reglas de oro de la programación concurrente

1. **No optimices prematuramente**: primero haz que el código funcione correctamente, luego piensa en optimizar el rendimiento
2. **Evita el estado compartido**: "no te comuniques compartiendo memoria; comparte memoria comunicándote"
3. **Haz que los errores se expongan cuanto antes**: los bugs de concurrencia suelen ser difíciles de reproducir, exponlos lo máximo posible en la fase de pruebas
4. **Limita la concurrencia**: concurrencia ilimitada equivale a ninguna protección; usa semáforos o pools de conexiones para limitarla
5. **Monitorización y observabilidad**: un sistema concurrente debe tener monitorización completa para localizar problemas rápidamente

### 7.2 Hoja de ruta de aprendizaje

```
Fase 1: Comprensión básica
    ├── Entender los conceptos básicos de proceso/hilo
    ├── Aprender primitivas de sincronización (locks, semáforos, variables de condición)
    └── Escribir programas multihilo sencillos

Fase 2: Profundizar en los principios
    ├── Entender el modelo de memoria y la visibilidad
    ├── Aprender programación sin locks y operaciones atómicas
    ├── Entender pools de hilos y work stealing
    └── Analizar deadlocks y condiciones de carrera

Fase 3: Aplicaciones avanzadas
    ├── Dominar corrutinas y programación asíncrona
    ├── Aprender los modelos de concurrencia de Go/Python/Rust
    ├── Entender la concurrencia en sistemas distribuidos
    └── Optimización de rendimiento y planificación de capacidad

Fase 4: Nivel experto
    ├── Diseñar arquitecturas de sistemas de alta concurrencia
    ├── Resolver bugs complejos de concurrencia
    ├── Desarrollar frameworks de programación concurrente
    └── Compartir y difundir conocimiento sobre concurrencia
```

Esperamos que esta guía te ayude a construir un conocimiento sistemático de la programación concurrente. Recuerda: **la concurrencia no es un fin, sino un medio**; el verdadero objetivo es construir servicios de alto rendimiento y alta disponibilidad. Comprende los principios, elige el modelo adecuado, escribe buen código, y llegarás lejos en el camino de la concurrencia.