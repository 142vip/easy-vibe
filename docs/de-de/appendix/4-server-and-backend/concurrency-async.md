# Nebenläufigkeit und Asynchronität
> 💡 **Lernleitfaden**: Nebenläufige Programmierung ist die „Achillesferse" vieler Backend-Ingenieure – sie scheitern im Vorstellungsgespräch, produzieren Bugs in der Produktion und haben keine Ideen für Performance-Optimierungen. Dieses Kapitel dreht sich um eine zentrale Frage: **Wenn 100.000 Benutzer gleichzeitig auf deinen Dienst zugreifen, stürzt dein Code dann ab?**

Bevor wir beginnen, solltest du zwei „Grundbausteine" auffrischen:

- **Was sind CPU, Arbeitsspeicher und I/O**: Wenn du mit diesen Grundkonzepten nicht vertraut bist, kannst du zunächst die Grundlagen der Betriebssysteme wiederholen.
- **Was ist blockierend/nicht-blockierend**: Wenn du noch nicht mit synchronen/asynchronen Konzepten vertraut bist, kannst du sie zunächst durch praktische Programmiererfahrung kennenlernen.

---

## 0. Einleitung: Motivation von „hängt" dein Dienst in Spitzenzeiten

<ProcessThreadCoroutineDemo />

Viele Entwickler erleben in der Praxis ähnliche Situationen:

- Lokal antwortet der Dienst blitzschnell, aber in der Produktion wird er zur „Diashow";
- Man hat teure Server mit hoher Konfiguration gekauft, aber die CPU-Auslastung steigt einfach nicht;
- In Aktionsspitzenzeiten kommt es zur „Lawine" von Ausfällen, und man muss Degradation oder Circuit Breaker einsetzen.

Intuitiv denken wir: **„Der Server ist nicht stark genug."**
Aber meistens liegt das Problem nicht daran, dass die Hardware „nicht schnell genug" ist, sondern daran, dass wir **das Nebenläufigkeitsmodell nicht gut durchdacht haben**.

**Der Kernkonflikt**:
- Ohne nebenläufige Verarbeitung: Benutzeranfragen stehen in der Warteschlange, die Benutzererfahrung ist miserabel;
- Bei falschem Einsatz von Multithreading: Lock-Contention und Context-Switch-Overhead verschlechtern die Performance sogar.

Angesichts dieser Herausforderungen reicht es nicht aus, einfach „mehr Maschinen hinzuzufügen". Wir brauchen einen systematischen Ansatz für nebenläufiges Design, der in Szenarien mit hoher Nebenläufigkeit sowohl Performance als auch Stabilität gewährleistet. Genau das versucht dieses Kapitel zu lösen.

---

## 1. Kernkonzepte: Prozesse, Threads, Coroutinen – was ist der Unterschied

### 1.1 Eine Restaurant-Analogie

Stell dir vor, du betreibst ein Restaurant und musst viele Gäste gleichzeitig bedienen:

| Konzept | Restaurant-Analogie | Technische Bedeutung |
| :--- | :--- | :--- |
| **Prozess (Process)** | **Eine eigenständige Restaurant-Filiale** | Besitzt eigenen Speicherbereich und eigene Ressourcenzuweisung. Die grundlegende Einheit der Ressourcenzuweisung des Betriebssystems. Ein Prozessabsturz beeinträchtigt andere Prozesse nicht. |
| **Thread (Thread)** | **Ein Koch in der Filiale** | Die grundlegende Einheit der CPU-Scheduling. Teilt sich den Speicherbereich innerhalb des Prozesses. Threads innerhalb desselben Prozesses können Daten teilen, aber ein Thread-Absturz kann zum Absturz des gesamten Prozesses führen. |
| **Coroutine (Coroutine)** | **Die „Vervielfältigungskunst" des Kochs** | Ein leichtgewichtiger Thread im User-Space, der vom Programm selbst und nicht vom Betriebssystem verwaltet wird. Der Wechsel-Overhead ist extrem gering, man kann Millionen davon erstellen. |

### 1.2 Tiefergehender Vergleich: Die wesentlichen Unterschiede der drei

<ProcessIsolationDemo />

#### Prozess: Der „Container" der Ressourcenisolierung

**Kernmerkmale**:
- **Starke Isolierung**: Jeder Prozess hat einen eigenen virtuellen Adressraum
- **Hoher Overhead**: Erstellung/Wechsel erfordern Eingriffe des Betriebssystems, Dauer ca. 1–10 ms
- **Komplexe Kommunikation**: Interprozesskommunikation (IPC) erfordert spezielle Mechanismen (Pipes, Message Queues, Shared Memory usw.)

**Einsatzszenarien**:
- Dienste, die starke Isolierung benötigen (z. B. Browser-Tabs, Sandbox-Programme)
- Dienste mit gemischten Sprachumgebungen
- Service-Einheiten, die unabhängig neu gestartet/aktualisiert werden müssen

#### Thread: Die „leichte Kavallerie" mit gemeinsamem Speicher

<ThreadSchedulingDemo />

**Kernmerkmale**:
- **Gemeinsamer Speicher**: Threads innerhalb desselben Prozesses teilen sich Code-, Datensegment und Heap
- **Unabhängiger Stack-Speicher**: Jeder Thread hat seinen eigenen Stack (normalerweise ca. 1 MB)
- **Schnellere Wechsel**: Thread-Wechsel dauern ca. 1–10 μs, etwa 1000-mal schneller als Prozesswechsel
- **Synchronisation erforderlich**: Gemeinsame Daten müssen durch Locks geschützt werden

**Einsatzszenarien**:
- CPU-intensive Aufgaben (Berechnungen, Bildverarbeitung)
- Nebenläufige Aufgaben, die viele Daten teilen müssen
- Latenzempfindliche Hintergrundaufgaben

#### Coroutine: Der „grüne Thread" im User-Space

<CoroutineLightweightDemo />

**Kernmerkmale**:
- **User-Space-Scheduling**: Verwaltet durch Programm/Laufzeitbibliothek, nicht durch das Betriebssystem
- **Extrem leichtgewichtig**: Der Coroutine-Stack ist normalerweise nur wenige KB groß, Millionen können erstellt werden
- **Extrem schnelle Wechsel**: Coroutine-Wechsel dauern ca. 100 ns, etwa 100-mal schneller als Thread-Wechsel
- **Nicht-präemptiv**: Coroutinen geben die CPU freiwillig ab (kooperatives Multitasking)

**Einsatzszenarien**:
- I/O-intensive, hoch nebenläufige Dienste (Webserver, Gateways)
- Szenarien mit vielen langlebigen Verbindungen (Instant Messaging, Gameserver)
- Streaming-Datenverarbeitung, Pipeline-Jobs

---

## 2. Fallstudie: Die „Nebenläufigkeits-Schmerzen" eines E-Commerce-Aktionstags

### 2.1 Lehrreiche Erfahrungen: Die Entwicklung von „Einzelmaschine" zu „Verteilt"

Sehen wir uns eine realistische Geschichte der Entwicklung eines E-Commerce-Systems an:

#### Phase 1: Die Einzelmaschinen-Ära (1.000 DAU)

```python
# Einfache Flask-Anwendung
from flask import Flask

app = Flask(__name__)

@app.route('/order')
def create_order():
    # Bestand abfragen
    stock = db.query("SELECT stock FROM products WHERE id=1")
    if stock > 0:
        # Bestand reduzieren
        db.execute("UPDATE products SET stock = stock - 1 WHERE id=1")
        # Bestellung anlegen
        db.execute("INSERT INTO orders ...")
        return "Order created!"
    return "Out of stock!"

# Start: flask run
```

**Probleme**:
- Einzelner Prozess, einzelner Thread – kann nur eine Anfrage gleichzeitig bearbeiten
- Bestandsreduzierung ohne Lock – Überverkauf bei Nebenläufigkeit
- Begrenzte Datenbankverbindungen – der Connection-Pool ist schnell erschöpft

#### Phase 2: Die Multiprozess-Ära (10.000 DAU)

```python
# Deployment mit Gunicorn Multiprozess
gunicorn -w 4 -k sync app:app

# 4 Worker-Prozesse, jeder verarbeitet Anfragen unabhängig
```

**Neue Probleme**:
- 4 Prozesse fragen gleichzeitig den Bestand ab, alle sehen stock=1, alle reduzieren erfolgreich – 3 Überverkäufe!
- Eine verteilte Sperre (Distributed Lock) muss eingeführt werden

```python
import redis

# Verteilte Sperre mit Redis
lock = redis_client.lock("stock_lock", timeout=10)
if lock.acquire():
    try:
        stock = db.query("SELECT stock FROM products WHERE id=1")
        if stock > 0:
            db.execute("UPDATE products SET stock = stock - 1 WHERE id=1")
    finally:
        lock.release()
```

#### Phase 3: Die Coroutine-Ära (100.000 DAU)

```python
# Verwendung von FastAPI + asyncio
from fastapi import FastAPI
import asyncio

app = FastAPI()

async def check_stock(product_id: int) -> int:
    # Asynchrone Datenbankabfrage, nicht blockierend
    result = await db.fetch_one(
        "SELECT stock FROM products WHERE id = :id",
        {"id": product_id}
    )
    return result["stock"]

@app.get("/order")
async def create_order(product_id: int):
    # Gleichzeitige Prüfung von Bestand und Benutzerinfo
    stock_task = check_stock(product_id)
    user_task = get_user_info(request.user_id)

    stock, user = await asyncio.gather(stock_task, user_task)

    if stock > 0:
        # Asynchrone Bestandsreduzierung
        await db.execute(
            "UPDATE products SET stock = stock - 1 WHERE id = :id",
            {"id": product_id}
        )
        return {"status": "success"}

    return {"status": "out_of_stock"}

# Start: uvicorn main:app --workers 4
# Jeder Worker kann Tausende nebenläufiger Coroutinen verarbeiten
```

**Vorteile**:
- Tausende nebenläufige Verbindungen innerhalb eines einzelnen Threads
- Freiwillige CPU-Freigabe bei I/O-Operationen, blockiert keine anderen Anfragen
- Extrem geringer Speicherverbrauch, geeignet für hoch nebenläufige Szenarien mit langlebigen Verbindungen

### 2.2 Vergleichstabelle der Nebenläufigkeitsmodell-Entwicklung

| Phase | Nebenläufigkeitsmodell | Unterstützte DAU | Kernproblem | Lösung |
| :--- | :--- | :--- | :--- | :--- |
| **Monolith** | Einzelprozess, einzelner Thread | 1K | Keine nebenläufige Verarbeitung | Einführung von Multiprozess |
| **Multiprozess** | Multiprozess synchron | 10K | Datenwettlauf, Überverkauf | Verteilte Sperre |
| **Multithreading** | Multithreading + Locks | 50K | Context-Switch-Overhead, Deadlocks | Thread-Pool, lock-freie Queues |
| **Coroutine** | Asynchrone I/O | 100K+ | Code-Komplexität, schwieriges Debugging | Framework-Abstraktion, verteiltes Tracing |
| **Hybrid** | Multiprozess + Coroutine | 1000K+ | Architekturkomplexität | Service-Governance, elastische Skalierung |

---

## 3. Prinzipien vertieft: Funktionsweise verschiedener Nebenläufigkeitsmodelle

### 3.1 Prozessmodell: Isolierung und Kommunikation

#### Speicherisolierungsmechanismus

<ProcessIsolationDemo />

Jeder Prozess besitzt einen eigenen virtuellen Adressraum:

```
Virtueller Speicher Prozess A    Virtueller Speicher Prozess B
+----------------+        +----------------+
|  Kernel-Space   |        |  Kernel-Space   |  <-- gemeinsam (nur lesen)
|  (gemeinsam)    |        |  (gemeinsam)    |
+----------------+        +----------------+
|  Stack-Space    |        |  Stack-Space    |  <-- unabhängig
|  (wächst nach   |        |  (wächst nach   |
|   unten)        |        |   unten)        |
+----------------+        +----------------+
|  Heap-Space     |        |  Heap-Space     |  <-- unabhängig
|  (wächst nach   |        |  (wächst nach   |
|   oben)         |        |   oben)         |
+----------------+        +----------------+
|  Datensegment   |        |  Datensegment   |  <-- unabhängig
|  (.bss/.data)   |        |  (.bss/.data)   |
+----------------+        +----------------+
|  Codesegment    |        |  Codesegment    |  <-- unabhängig
|  (.text)        |        |  (.text)        |
+----------------+        +----------------+
```

#### Methoden der Interprozesskommunikation (IPC)

| Methode | Prinzip | Geschwindigkeit | Einsatzszenario |
| :--- | :--- | :--- | :--- |
| **Pipe** | Kernel-Puffer, unidirektionaler Strom | Mittel | Kommunikation zwischen Eltern- und Kindprozessen |
| **Message Queue** | Kernel-Nachrichtenliste | Mittel | Asynchrone Nachrichtenübermittlung |
| **Shared Memory** | Gleicher physischer Speicher, gemappt | Am schnellsten | Umfangreicher Datenaustausch |
| **Semaphore** | Kernel-Zähler | - | Synchronisation und gegenseitiger Ausschluss |
| **Socket** | Netzwerkprotokoll-Stack | Langsamer | Maschinenübergreifende Kommunikation |
| **Signal** | Software-Interrupt | - | Ereignisbenachrichtigung |

### 3.2 Thread-Modell: Scheduling und Synchronisation

#### Thread-Scheduling-Prinzip

<ThreadSchedulingDemo />

Grundlegende Arbeitsweise des Betriebssystem-Thread-Schedulers:

```
Bereit-Warteschlange              In Ausführung              Warteschlange
+--------+                +--------+               +--------+
| Thread B|  <-- Zeitscheibe  | Thread A|  <-- I/O-Anfrage | Thread C|
| Thread D|        abgelaufen  | (aktiv) |               | Thread E|
| Thread F|                +--------+               | (blockiert)|
+--------+                                         +--------+
    |                                                  |
    v                                                  v
Scheduler wählt nächsten nach                Bei I/O-Abschluss zurück
Priorität zur Ausführung                     in die Bereit-Warteschlange
```

#### Gängige Thread-Synchronisationsmechanismen

| Mechanismus | Prinzip | Vorteile | Nachteile |
| :--- | :--- | :--- | :--- |
| **Mutex** | Binärer Zustand, exklusiver Zugriff | Einfach zu implementieren | Schlechte Performance bei starker Konkurrenz |
| **RWLock** | Lesen gemeinsam, Schreiben exklusiv | Effizient bei vielen Lese-/wenigen Schreibzugriffen | Komplexe Implementierung, Risiko von Schreib-Hunger |
| **Spinlock** | Aktives Warten, gibt CPU nicht frei | Effizient bei kurzen Wartezeiten | Verschwendet CPU bei langen Wartezeiten |
| **Bedingungsvariable** | Wartet auf bestimmte Bedingung | Vermeidet aktives Warten | Muss mit Lock kombiniert werden |
| **Semaphore** | Zähler steuert Zugriffsanzahl | Kontrolliert Nebenläufigkeitsgrad | Bei falscher Verwendung fehleranfällig |
| **Atomare Operation** | Atomarität auf CPU-Befehlsebene | Lock-frei, höchste Performance | Nur für einfache Datentypen |
| **Lock-freie Queue** | Implementiert mit CAS-Operationen | Hervorragende Performance bei hoher Nebenläufigkeit | Komplexe Implementierung, ABA-Problem |

### 3.3 Coroutine-Modell: User-Space-Scheduling

<CoroutineLightweightDemo />

#### Kernvorteile von Coroutinen

```
Traditionelles Multithreading     vs              Coroutine-Modell

+------------+                       +------------+
|  Thread 1   |                       |  Event-Loop  |
| (1MB Stack) |                       |  (Scheduler)  |
+------------+                       +------------+
     |                                     |
     v                                     v
+------------+                       +------------+
|  Thread 2   |                       | Coroutine A |
| (1MB Stack) |                       | (wenige KB  |
+------------+                       |  Stack)     |
     |                              +------------+
     v                                     |
+------------+                             v
|  Thread 3   |                       +------------+
| (1MB Stack) |                       | Coroutine B |
+------------+                       | (wenige KB  |
                                     |  Stack)     |
Overhead: N MB                       +------------+
Erstellung: ~10 μs
Wechsel: ~1 μs                       Overhead: N KB
                                     Erstellung: ~100 ns
                                     Wechsel: ~100 ns
```

#### Funktionsweise von async/await

<AsyncAwaitDemo />

```python
import asyncio

async def fetch_data(url):
    # Bei await wird die Coroutine angehalten und gibt die CPU frei
    response = await aiohttp.get(url)
    # Nach Abschluss der I/O weckt die Event-Loop die Coroutine,
    # die Ausführung wird hier fortgesetzt
    return response.json()

async def main():
    # 3 Coroutine-Tasks erstellen
    tasks = [
        fetch_data("https://api1.example.com"),
        fetch_data("https://api2.example.com"),
        fetch_data("https://api3.example.com")
    ]
    # Nebenläufige Ausführung, Gesamtzeit ≈ die langsamste Anfrage
    results = await asyncio.gather(*tasks)
    return results

# Event-Loop starten
asyncio.run(main())
```

**Ausführungsablauf**:

```
Zeitachse ---------------------------------------------------------------->

Coroutine A: [Anfrage vorbereiten]--[await angehalten]=======[Antwort erhalten]--[Daten verarbeiten]
                               |
Coroutine B:                    [Anfrage vorbereiten]--[await angehalten]=======[Antwort erhalten]--[Daten verarbeiten]
                                                        |
Coroutine C:                                             [Anfrage vorbereiten]--[await angehalten]=======[Antwort erhalten]
                                                                             |
                                                                             ↓
                                                                    Alle I/O abgeschlossen

Legende: [ ] = CPU-Ausführung, === = I/O-Warten, | = Coroutine-Wechsel
```

### 3.4 Event-Loop: Das „Herz" der Coroutinen

<EventLoopDemo />

Die Event-Loop ist der Kernmechanismus des Coroutine-Schedulings:

```python
import selectors
import heapq

class EventLoop:
    def __init__(self):
        self.selector = selectors.DefaultSelector()
        self.ready = []  # Bereit-Warteschlange
        self.scheduled = []  # Warteschlange für zeitgesteuerte Tasks
        self.current = None

    def run(self):
        while True:
            # 1. Zeitgesteuerte Tasks verarbeiten
            now = time.time()
            while self.scheduled and self.scheduled[0][0] <= now:
                _, callback = heapq.heappop(self.scheduled)
                self.ready.append(callback)

            # 2. Auf I/O-Ereignisse warten
            timeout = 0 if self.ready else 0.1
            events = self.selector.select(timeout)

            for key, mask in events:
                callback = key.data
                self.ready.append(callback)

            # 3. Bereite Callbacks ausführen
            while self.ready:
                callback = self.ready.popleft()
                callback()
```

### 3.5 Nebenläufigkeit vs. Parallelität: Nicht dasselbe

<ConcurrentVsParallelDemo />

| Konzept | Englisch | Bedeutung | Analogie | Voraussetzung |
| :--- | :--- | :--- | :--- | :--- |
| **Nebenläufigkeit** | Concurrency | Mehrere Tasks werden abwechselnd ausgeführt, makroskopisch gleichzeitiger Fortschritt | Eine Person kocht abwechselnd mehrere Gerichte | Einzelkern-CPU ausreichend |
| **Parallelität** | Parallelism | Mehrere Tasks werden tatsächlich gleichzeitig ausgeführt | Mehrere Personen kochen gleichzeitig verschiedene Gerichte | Mehrkern-CPU oder mehrere Maschinen |

**Grafische Darstellung**:

```
Einzelkern-CPU – Nebenläufig (Concurrent)
Zeit →   1    2    3    4    5    6    7    8
Task A: [Ausf][Ausf]      [Ausf][Ausf]
Task B:      [Ausf][Ausf]      [Ausf][Ausf]

Zwei Tasks werden abwechselnd ausgeführt, makroskopisch „gleichzeitiger" Fortschritt

========================================

Mehrkern-CPU – Parallel (Parallel)
Zeit →   1    2    3    4    5    6    7    8
Kern 1: [Task A][Task A][Task A][Task A]
Kern 2: [Task B][Task B][Task B][Task B]

Zwei Tasks werden tatsächlich „gleichzeitig" ausgeführt

========================================

In der Realität oft: Nebenläufigkeit + Parallelität
Zeit →   1    2    3    4    5    6    7    8
Kern 1: [A1][A1][B1][B1][C1][C1][D1][D1]
Kern 2: [A2][A2][B2][B2][C2][C2][D2][D2]

Mehrere Tasks werden zuerst nebenläufig auf verschiedene Kerne verteilt,
dann parallel auf den Kernen ausgeführt
```

---

## 4. Praxis: Go-Coroutinen und grüne Threads

### 4.1 Gos Nebenläufigkeitsphilosophie

<GoroutineGreenThreadDemo />

Gos Nebenläufigkeits-Designphilosophie: **Kommuniziere nicht durch gemeinsamen Speicher, sondern teile Speicher durch Kommunikation**.

```go
package main

import (
    "fmt"
    "time"
)

// Producer
func producer(ch chan<- int, id int) {
    for i := 0; i < 5; i++ {
        fmt.Printf("Producer %d sending: %d\n", id, i)
        ch <- i  // Daten an Channel senden
        time.Sleep(100 * time.Millisecond)
    }
}

// Consumer
func consumer(ch <-chan int, id int) {
    for val := range ch {  // Daten von Channel empfangen
        fmt.Printf("Consumer %d received: %d\n", id, val)
    }
}

func main() {
    // Gepufferten Channel erstellen
    ch := make(chan int, 10)

    // 2 Producer-Goroutinen starten
    for i := 0; i < 2; i++ {
        go producer(ch, i)
    }

    // 2 Consumer-Goroutinen starten
    for i := 0; i < 2; i++ {
        go consumer(ch, i)
    }

    // Eine Weile warten
    time.Sleep(3 * time.Second)
    close(ch)
}
```

### 4.2 Goroutine-Scheduler: Das GMP-Modell

Gos Scheduler verwendet das GMP-Modell:

| Komponente | Bedeutung | Funktion |
| :--- | :--- | :--- |
| **G (Goroutine)** | Coroutine | Auszuführende Task, leichtgewichtig (2 KB Stack, dynamisch skalierbar) |
| **M (Machine)** | System-Thread | Träger zur tatsächlichen Ausführung von G, 1:1-Entsprechung mit Kernel-Thread |
| **P (Processor)** | Logischer Prozessor | Scheduling-Kontext, enthält Warteschlange ausführbarer Gs, Anzahl standardmäßig gleich CPU-Kernanzahl |

**Scheduling-Ablauf**:

```
Globale Warteschlange
+----------------+
|  G1  |  G2  |  G3  |
+----------------+

P0 lokale Warteschlange  P1 lokale Warteschlange  P2 lokale Warteschlange  P3 lokale Warteschlange
+----------+       +----------+       +----------+       +----------+
| G4 | G5  |       | G6 | G7  |       | G8 | G9  |       | G10| G11 |
+----------+       +----------+       +----------+       +----------+
    |                     |                     |                     |
    v                     v                     v                     v
+----------+       +----------+       +----------+       +----------+
|    M0    |       |    M1    |       |    M2    |       |    M3    |
| (OS-Thrd)|       | (OS-Thrd)|       | (OS-Thrd)|       | (OS-Thrd)|
+----------+       +----------+       +----------+       +----------+

Scheduling-Strategie:
1. Jedes P verwaltet eine lokale G-Warteschlange, reduziert Lock-Contention
2. P entnimmt G aus der lokalen Warteschlange und übergibt es an M zur Ausführung
3. Bei leerer lokaler Warteschlange: „Work Stealing" – die Hälfte der Gs von einem anderen P stehlen
4. Die globale Warteschlange dient als Fallback, wird regelmäßig überprüft
```

---

## 5. Praktische Code-Vorlagen

### 5.1 Python asyncio – Vorlage für hohe Nebenläufigkeit

```python
import asyncio
import aiohttp
from typing import List, Dict
import time

class AsyncHTTPClient:
    """Hochleistungs-HTTP-Client auf Basis von asyncio"""

    def __init__(self, max_connections: int = 100, timeout: int = 30):
        self.timeout = aiohttp.ClientTimeout(total=timeout)
        # Nebenläufige Verbindungen begrenzen, um den Zielserver nicht zu überlasten
        connector = aiohttp.TCPConnector(
            limit=max_connections,
            limit_per_host=10,  # Verbindungslimit pro einzelner Domain
            enable_cleanup_closed=True,
            force_close=True,
        )
        self.session = aiohttp.ClientSession(
            connector=connector,
            timeout=self.timeout,
        )

    async def fetch(self, url: str, method: str = 'GET', **kwargs) -> Dict:
        """Einzelne Anfrage senden"""
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
        """Mehrere URLs nebenläufig abrufen, mit Begrenzung der Nebenläufigkeit"""
        semaphore = asyncio.Semaphore(concurrency)

        async def fetch_with_limit(url):
            async with semaphore:
                return await self.fetch(url)

        # Alle Anfragen nebenläufig ausführen
        tasks = [fetch_with_limit(url) for url in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)

    async def close(self):
        await self.session.close()


# Verwendungsbeispiel
async def main():
    client = AsyncHTTPClient(max_connections=50)

    # Liste der abzurufenden URLs
    urls = [
        "https://api.github.com/users/github",
        "https://api.github.com/users/google",
        "https://api.github.com/users/microsoft",
        # ... weitere URLs
    ] * 10  # Simuliert 300 Anfragen

    start = time.time()
    results = await client.fetch_many(urls, concurrency=20)
    elapsed = time.time() - start

    # Ergebnisse auswerten
    success = sum(1 for r in results if r.get('status') == 200)
    failed = len(results) - success

    print(f"Gesamtzahl Anfragen: {len(results)}")
    print(f"Erfolgreich: {success}, Fehlgeschlagen: {failed}")
    print(f"Dauer: {elapsed:.2f}s")
    print(f"QPS: {len(results)/elapsed:.1f}")

    await client.close()

if __name__ == "__main__":
    asyncio.run(main())
```

### 5.2 Go – Vorlage für hoch nebenläufige Dienste

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

// Request/Response-Strukturen
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

// Simulierte Datenbankoperation
type Database struct {
	orders map[int64]*OrderResponse
	mutex  chan struct{}
}

func NewDatabase() *Database {
	db := &Database{
		orders: make(map[int64]*OrderResponse),
		mutex:  make(chan struct{}, 1), // Simuliert einen Mutex
	}
	return db
}

func (db *Database) CreateOrder(ctx context.Context, req *OrderRequest) (*OrderResponse, error) {
	// Lock anfordern
	select {
	case db.mutex <- struct{}{}:
		defer func() { <-db.mutex }()
	case <-ctx.Done():
		return nil, ctx.Err()
	}

	// Datenbanklatenz simulieren
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

// HTTP-Handler
type Handler struct {
	db *Database
}

func NewHandler(db *Database) *Handler {
	return &Handler{db: db}
}

func (h *Handler) CreateOrder(w http.ResponseWriter, r *http.Request) {
	// Request-Timeout setzen
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

// Beispiel für Batch-Verarbeitung
func BatchProcess(ctx context.Context, items []int) ([]int, error) {
	g, ctx := errgroup.WithContext(ctx)
	g.SetLimit(10) // Nebenläufigkeit auf 10 begrenzen

	results := make([]int, len(items))

	for i, item := range items {
		i, item := i, item // Closure-Falle vermeiden
		g.Go(func() error {
			select {
			case <-ctx.Done():
				return ctx.Err()
			default:
				// Verarbeitung simulieren
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
	// Datenbank initialisieren
	db := NewDatabase()

	// Handler erstellen
	handler := NewHandler(db)

	// Routen einrichten
	mux := http.NewServeMux()
	mux.HandleFunc("/order", handler.CreateOrder)
	mux.HandleFunc("/health", handler.Health)

	// Server erstellen
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

## 6. Zusammenfassende Vergleichstabellen

### 6.1 Vergleich der Kernkonzepte

| Eigenschaft | Prozess | Thread | Coroutine |
| :--- | :--- | :--- | :--- |
| **Scheduler** | Betriebssystem | Betriebssystem | Benutzerprogramm/Laufzeit |
| **Wechsel-Overhead** | ~1–10 ms | ~1–10 μs | ~100 ns |
| **Speicherverbrauch** | ~10 MB+ | ~1 MB | ~2 KB |
| **Kommunikation** | IPC | Shared Memory | Shared Memory/Channel |
| **Synchronisationsbedarf** | Nicht erforderlich | Locks erforderlich | Locks erforderlich/kooperativ |
| **Absturz-Auswirkung** | Nur eigener Prozess | Gesamter Prozess | Kontrollierbar |
| **Einsatzszenario** | Starke Isolierung, Multi-Tenant | CPU-intensiv | I/O-intensiv |
| **Typische Sprachen** | Alle Sprachen | Alle Sprachen | Go, Python, JS, Rust |

### 6.2 Auswahlleitfaden für Nebenläufigkeitsmodelle

| Szenario | Empfohlenes Modell | Begründung |
| :--- | :--- | :--- |
| Web-Service-Gateway | Coroutine + asynchrone I/O | Hohe nebenläufige Verbindungen, geringer Speicherverbrauch |
| Echtzeit-Kommunikationsdienst | Coroutine + langlebige Verbindungen | Verwaltung vieler WebSocket-Verbindungen |
| Datenverarbeitungs-Pipeline | Multiprozess + Coroutine | Mehrkernnutzung, I/O nicht blockierend |
| Wissenschaftliches Rechnen | Multithreading/Multiprozess | CPU-intensiv, parallele Berechnung erforderlich |
| Microservice-Architektur | Multiprozess + Coroutine | Isolierung zwischen Diensten, hohe interne Nebenläufigkeit |
| Embedded Systems | Coroutine/Einzelthread | Ressourcenbeschränkt, deterministisches Scheduling |

### 6.3 Glossar

| Englischer Begriff | Deutsche Übersetzung | Erklärung |
| :--- | :--- | :--- |
| **Process** | Prozess | Grundlegende Einheit der Ressourcenzuweisung des Betriebssystems, mit eigenem Speicherbereich |
| **Thread** | Thread | Grundlegende Einheit des CPU-Scheduling, teilt den Speicherbereich des Prozesses |
| **Coroutine** | Coroutine | Leichtgewichtiger Thread im User-Space, vom Programm selbst verwaltet |
| **Concurrency** | Nebenläufigkeit | Mehrere Tasks werden abwechselnd ausgeführt, makroskopisch gleichzeitiger Fortschritt |
| **Parallelism** | Parallelität | Mehrere Tasks werden tatsächlich gleichzeitig ausgeführt, erfordert Mehrkernunterstützung |
| **Context Switch** | Kontextwechsel | Der Vorgang, bei dem die CPU von einem Task zu einem anderen wechselt |
| **Blocking I/O** | Blockierende I/O | Nach einer I/O-Anfrage wird auf Abschluss gewartet, der Thread wird währenddessen angehalten |
| **Non-blocking I/O** | Nicht-blockierende I/O | Nach einer I/O-Anfrage wird sofort zurückgekehrt, ohne auf das Ergebnis zu warten |
| **Async I/O** | Asynchrone I/O | Bei I/O-Abschluss wird der Aufrufer per Callback oder Benachrichtigung informiert |
| **Event Loop** | Event-Loop | Coroutine-Scheduling-Mechanismus, der kontinuierlich Ereignisse überwacht und verteilt |
| **Goroutine** | Goroutine | Go's Implementierung von leichtgewichtigen Threads |
| **Channel** | Channel | Mechanismus zur Kommunikation zwischen Goroutinen in Go |
| **Mutex** | Mutex | Synchronisationsprimitive zum Schutz gemeinsamer Ressourcen |
| **Semaphore** | Semaphore | Steuert die Anzahl der Threads, die gleichzeitig auf eine Ressource zugreifen |
| **Deadlock** | Deadlock (Verklemmung) | Mehrere Threads warten gegenseitig auf die Freigabe von Ressourcen, was zu dauerhafter Blockierung führt |
| **Race Condition** | Race Condition (Wettlaufsituation) | Mehrere Threads greifen gleichzeitig auf gemeinsame Daten zu, was zu unbestimmten Ergebnissen führt |
| **Thread Pool** | Thread-Pool | Eine Gruppe vorab erstellter Threads, die wiederverwendet werden, um Erstellungs-/Zerstörungs-Overhead zu reduzieren |
| **Work Stealing** | Work Stealing (Arbeitsdiebstahl) | Ein inaktiver Thread „stiehlt" Tasks aus der Warteschlange eines ausgelasteten Threads |
| **Zero-copy** | Zero-Copy (Nullkopie) | Daten werden zwischen Kernel-Space und User-Space ohne CPU-Kopie übertragen |
| **C10K Problem** | C10K-Problem | Die Herausforderung, 10.000 Verbindungen gleichzeitig auf einer einzelnen Maschine zu verarbeiten |
| **C10M Problem** | C10M-Problem | Die ultimative Herausforderung, 10 Millionen Verbindungen gleichzeitig auf einer einzelnen Maschine zu verarbeiten |

---

## 7. Zum Abschluss

### 7.1 Die goldenen Regeln der nebenläufigen Programmierung

1. **Optimiere nicht zu früh**: Lass den Code zuerst korrekt laufen, bevor du über Performance-Optimierung nachdenkst
2. **Vermeide gemeinsam genutzten Zustand**: „Kommuniziere nicht durch gemeinsamen Speicher, sondern teile Speicher durch Kommunikation"
3. **Lass Fehler so früh wie möglich sichtbar werden**: Nebenläufigkeits-Bugs sind oft schwer zu reproduzieren, decke sie so weit wie möglich in der Testphase auf
4. **Begrenze die Nebenläufigkeit**: Unbegrenzte Nebenläufigkeit ist wie kein Schutz – verwende Semaphoren oder Connection-Pools zur Begrenzung
5. **Monitoring und Observability**: Ein nebenläufiges System muss umfassendes Monitoring haben, um Probleme schnell lokalisieren zu können

### 7.2 Lern-Roadmap

```
Phase 1: Grundverständnis
    ├── Grundkonzepte von Prozessen/Threads verstehen
    ├── Synchronisationsprimitive lernen (Locks, Semaphoren, Bedingungsvariablen)
    └── Einfache Multithreading-Programme schreiben

Phase 2: Prinzipien vertiefen
    ├── Speichermodell und Sichtbarkeit verstehen
    ├── Lock-freie Programmierung und atomare Operationen lernen
    ├── Thread-Pools und Work Stealing verstehen
    └── Deadlocks und Race Conditions analysieren

Phase 3: Fortgeschrittene Anwendung
    ├── Coroutinen und asynchrone Programmierung beherrschen
    ├── Nebenläufigkeitsmodelle von Go/Python/Rust lernen
    ├── Nebenläufigkeit in verteilten Systemen verstehen
    └── Performance-Tuning und Kapazitätsplanung

Phase 4: Expertenniveau
    ├── Hoch-nebenläufige Systemarchitekturen entwerfen
    ├── Komplexe Nebenläufigkeits-Bugs lösen
    ├── Frameworks für nebenläufige Programmierung entwickeln
    └── Wissen über Nebenläufigkeit teilen und verbreiten
```

Ich hoffe, dieser Leitfaden hilft dir, ein systematisches Verständnis der nebenläufigen Programmierung aufzubauen. Denk daran: **Nebenläufigkeit ist nicht das Ziel, sondern das Mittel** – das wahre Ziel ist es, hochperformante und hochverfügbare Dienste zu entwickeln. Verstehe die Prinzipien, wähle das richtige Modell und schreibe guten Code – dann wirst du auf dem Weg der Nebenläufigkeit immer weiter vorankommen.