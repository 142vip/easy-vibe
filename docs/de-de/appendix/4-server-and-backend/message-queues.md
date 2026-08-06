# Nachrichtenwarteschlangen: Systemkommunikation
::: tip 🎯 Kernfrage
**Wie kann die Stabilität der Kernprozesse sichergestellt werden, wenn das System stark gekoppelt ist und der Datenverkehr plötzlich ansteigt?** Message Queues sind der „Puffer" und „Entkoppler" moderner verteilter Systeme. Dieser Artikel vertieft das Verständnis der Designphilosophie und Ingenieurspraxis von Message Queues anhand realer Beispiele (Restaurant-Wartesystem, Paketsortierung, Flash-Sale-Systeme).
:::

---

## 1. Warum „Message Queues"

### 1.1 Ein realer Fall: Die Entwicklung des Taobao-Bestellsystems

Im Jahr 2012 erlitt das Bestellsystem von Taobao einen schwerwiegenden Ausfall. Um Mitternacht am Singles' Day (11.11.) strömte der Datenverkehr schlagartig herein. Der Bestellservice rief direkt den Bestandsservice, den Zahlungsservice, den Logistikservice auf … die gesamte Kette brach wie Dominosteine nacheinander zusammen.

**Die damalige Architektur (enge Kopplung):**

```
Benutzerbestellung → Bestellservice → synchroner Aufruf Bestandsservice → synchroner Aufruf Zahlungsservice → synchroner Aufruf Logistikservice
                    ↓                    ↓                    ↓
                 Antwort 200ms      Antwort 500ms      Antwort 300ms
```

::: warning ⚠️ Fatale Probleme enger Kopplung

- **Gesamtantwortzeit** = 200 + 500 + 300 = 1000ms (Benutzer wartet 1 Sekunde)
- **Bestandsservice fällt aus** → Bestellservice fällt ebenfalls aus (Thread-Pool erschöpft)
- **Zahlungsservice wird langsam** → die gesamte Kette wird ausgebremst
- **Keine horizontale Skalierung** → nur vertikale Skalierung möglich (teuer und begrenzt)
  :::

**Verbesserte Architektur (mit Message Queue):**

```
Benutzerbestellung → Bestellservice → sendet „Bestellung erstellt"-Nachricht → sofortige Antwort (50ms)
                              ↓
                        Message Queue (Kafka)
                              ↓
        ┌─────────────┬─────────────┬─────────────┐
        ▼             ▼             ▼             ▼
   Bestandsservice  Zahlungsservice  Logistikservice  Benachrichtigungsservice
   (asynchroner     (asynchrone     (asynchrone       (asynchroner
    Abzug)           Verarbeitung)   Erstellung)       Versand)
```

::: tip ✨ Verbesserte Ergebnisse

- **Benutzerantwortzeit** = 50ms (20-fache Verbesserung der Benutzererfahrung)
- **Bestandsservice fällt aus** → Nachrichten werden in der Queue zwischengespeichert, Verarbeitung nach Wiederherstellung
- **Zahlungsservice wird langsam** → beeinträchtigt die Bestellungserstellung nicht
- **Horizontale Skalierung möglich** → einfach weitere Consumer-Instanzen hinzufügen
  :::

### 1.2 Message Queues mit Alltagsbeispielen erklärt

**Das Restaurant-Wartesystem**

Stell dir ein beliebtes Restaurant vor:

- **Ohne Wartesystem**: Kunden müssen am Schalter stehen und warten, begrenzte Schalter, lange Schlangen, hoher Druck auf das Restaurant
- **Mit Wartesystem**: Nach der Bestellung erhältst du eine Nummer, du kannst dich setzen und holst dein Essen, wenn deine Nummer aufgerufen wird

**Eine Message Queue ist das „Wartesystem" der Softwarewelt**:

- **Producer** (Person, die bestellt) → sendet Nachricht (Bestellung) an die Queue
- **Queue** (Aufrufanzeige) → speichert Nachrichten zwischen
- **Consumer** (Koch) → verarbeitet Nachrichten im eigenen Tempo

<PeakShavingDemo />

---

## 2. Überblick über Message Queue (Definition + drei Kernelemente)


### 2.1 Was ist eine „Message Queue"

::: tip 🤔 Begriffserklärung
**Message Queue (MQ)** ist ein Container zum Speichern von Nachrichten. Producer legen Nachrichten hinein, Consumer entnehmen und verarbeiten sie. Sie ermöglicht „asynchrone Kommunikation" – der Sender muss nicht auf die Verarbeitung durch den Empfänger warten.

**Synchron vs. Asynchron**:

- **Synchron**: Wie ein Telefonanruf – der Gesprächspartner muss abheben, damit kommuniziert werden kann
- **Asynchron**: Wie eine WeChat-Nachricht – einfach abschicken, der Empfänger liest sie, wenn er Zeit hat

Es ist wie der Unterschied zwischen einem Anruf (synchron) und einer Textnachricht (asynchron).
:::

### 2.2 Die drei Kernelemente einer Message Queue

#### Element 1: Producer

**Aufgabe**: Nachrichten erstellen und an die Queue senden.

**Alltagsvergleich**: Der Producer ist wie ein „Absender", der einen Brief (Nachricht) zur Post (Queue) bringt.

::: details Wichtige Designaspekte

- **Sendemodus**: Synchroner Versand (zuverlässig, aber blockierend) vs. asynchroner Versand (hohe Leistung, aber Callback-Behandlung erforderlich)
- **Nachrichtenbestätigung**: Auf Broker-Bestätigung warten (At Least Once) vs. Fire-and-Forget (At Most Once)
- **Fehlerbehandlung**: Wiederholungsstrategie, lokales Log-Backup, Dead Letter Queue
  :::

#### Element 2: Consumer

**Aufgabe**: Nachrichten aus der Queue abrufen und verarbeiten.

**Alltagsvergleich**: Der Consumer ist wie ein „Empfänger", der einen Brief (Nachricht) aus dem Postfach (Queue) holt und bearbeitet.

::: details Wichtige Designaspekte

- **Konsummuster**: Push-Modell (Broker sendet aktiv) vs. Pull-Modell (Consumer holt aktiv)
- **Konsumbestätigung**: Automatisches ACK (effizient, aber möglicher Nachrichtenverlust) vs. manuelles ACK (zuverlässig, aber Timeout-Behandlung nötig)
- **Nebenläufigkeitssteuerung**: sequenzielle Einzelthread-Verarbeitung vs. parallele Multithread-Verarbeitung
- **Fehlerbehandlung**: Wiederholungsstrategie, Dead Letter Queue, Kompensationsmechanismus
  :::

#### Element 3: Broker

**Aufgabe**: Nachrichten empfangen, speichern und weiterleiten.

**Alltagsvergleich**: Der Broker ist wie ein „Postamt" oder „Paketverteilzentrum", das für Empfang, Sortierung und Zustellung zuständig ist.

::: details Wichtige Designaspekte

- **Speichermodell**: In-Memory-Speicherung (niedrige Latenz) vs. Festplattenspeicherung (hohe Zuverlässigkeit)
- **Replikationsstrategie**: Master-Slave-Replikation, synchrone Multi-Replica
- **Hochverfügbarkeitsmechanismus**: Cluster-Deployment, automatisches Failover
- **Skalierbarkeit**: Partitionierung, Sharding
  :::

---

## 3. Kernfrage 1: Ansatz für entkoppelt man Systeme, um „Kettenreaktionen" zu vermeiden

### 3.1 Die Tragödie enger Kopplung: Ein Service fällt aus, alles bricht zusammen

**Szenario**: Frühe Architektur einer E-Commerce-Plattform

```
Bestellservice ruft nachgelagerte Services direkt auf:
┌─────────────┐
│ Bestellservice │
└──────┬──────┘
       │
       ├───────────┬───────────┬───────────┐
       ▼           ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│Bestands- │ │Zahlungs- │ │Logistik- │ │SMS-      │
│service   │ │service   │ │service   │ │service   │
│  200ms   │ │  500ms   │ │  300ms   │ │  100ms   │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

::: tip 📊 Problemanalyse-Tabelle
| Problem | Konkrete Auswirkung | Folge |
|------|----------|------|
| **Kaskadierender Ausfall** | Bestandsservice fällt aus, Bestellservice hat synchronen Timeout | Thread-Pool des Bestellservice erschöpft, keine neuen Anfragen möglich |
| **Antwortlatenz** | Muss auf Antwort aller nachgelagerten Services warten | Benutzer wartet über 1 Sekunde, extrem schlechte UX |
| **Erweiterbarkeit** | Neuer Punkteservice erfordert Codeänderung im Bestellservice | Längere Release-Zyklen, erhöhtes Risiko |
| **Ressourcenverschwendung** | Bestellservice muss auf SMS-Service warten | Datenbankverbindungen werden lange blockiert |
:::

### 3.2 Entkopplungslösung: Message Queue als „Zwischenschicht"

**Architektur nach der Entkopplung:**

```
Bestellservice sendet nur Nachrichten, ohne Kenntnis der Consumer:

┌─────────────┐
│ Bestellservice │ ──sendet „Bestellung erstellt"-Nachricht──┐
└─────────────┘                       │
                                      ▼
                            ┌───────────────────┐
                            │   Message Queue    │
                            │  (Kafka/RabbitMQ) │
                            │   - zuverlässiger  │
                            │     Speicher       │
                            │   - Multi-Replica  │
                            │   - Reihenfolge-   │
                            │     garantie       │
                            └─────────┬─────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
              ▼                       ▼                       ▼
       ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
       │ Bestands-    │      │ Zahlungs-    │      │ Logistik-    │
       │ service      │      │ service      │      │ service      │
       │ abonniert    │      │ abonniert    │      │ abonniert    │
       │ Bestellereig.│      │ Bestellereig.│      │ Bestellereig.│
       └──────────────┘      └──────────────┘      └──────────────┘
```

<DecouplingDemo />

::: tip ✨ Vorteile der Entkopplung
| Dimension | Vor der Entkopplung | Nach der Entkopplung |
|------|--------|--------|
| **Fehlerisolierung** | Bestandsausfall = Bestellausfall | Bestandsausfall, Nachrichten in Queue zwischengespeichert, Konsum nach Wiederherstellung |
| **Antwortzeit** | 1000ms (synchrones Warten) | 50ms (Rückkehr nach Nachrichtenversand) |
| **Erweiterbarkeit** | Neuer Service erfordert Codeänderung | Neuer Service muss nur Topic abonnieren |
| **Systemkomplexität** | Bestellservice stark abhängig von nachgelagerten Services | Bestellservice nur von Message Queue abhängig |
:::

### 3.3 Das Wesen der Entkopplung: Von „direktem Aufruf" zu „ereignisgesteuerter Architektur"

**Paradigmenwechsel:**

```
Traditionelles Denken (imperativ):
"Der Bestellservice befiehlt dem Bestandsservice: Ziehe Bestand ab!"
  ↓ Direkter Aufruf
  ↓ Hohe Kopplung, aufgerufene Partei muss online sein
  ↓ Aufrufer muss die Schnittstelle des Aufgerufenen kennen

Ereignisgesteuertes Denken (deklarativ):
"Der Bestellservice deklariert: Bestellung wurde erstellt. Wer interessiert ist, verarbeitet sie."
  ↓ Ereignis an Message Queue senden
  ↓ Entkopplung, Consumer können offline sein
  ↓ Producer muss nicht wissen, dass Consumer existieren
```

---

## 4. Kernfrage 2: Ansatz für glättet man Lastspitzen bei plötzlichem Traffic-Anstieg

### 4.1 Flash-Sale-Szenario: Ansatz für verarbeitet man 100.000 QPS stabil

**Szenario**: Flash-Sale am Singles' Day einer E-Commerce-Plattform, erwarteter Spitzenwert 100.000 QPS, aber die Datenbank verträgt nur 1.000 QPS.

**Folgen des direkten Ansturms:**

```
Benutzeranfragen ──→ Anwendungsserver ──→ Datenbank
  100.000/s           100.000/s            1.000/s (Limit)
                                           ↓
                                   Verbindungspool erschöpft
                                   Antwort-Timeout
                                   Datenbankabsturz
                                           ↓
                                   Lawineneffekt (alle datenbankabhängigen Services fallen aus)
```

::: tip 🌊 Begriffserklärung
**QPS (Queries Per Second)**: Anzahl der Abfragen pro Sekunde, eine Kennzahl für den Systemdurchsatz.

**100.000 QPS** bedeutet 100.000 Anfragen pro Sekunde – als würden 100.000 Menschen gleichzeitig in ein Geschäft stürmen.
:::

### 4.2 Lösung zur Lastspitzenglättung: Message Queue als „Pufferspeicher"

**Architekturdesign:**

```
┌───────────────────────────────────────────────────────────────────────┐
│                        Flash-Sale-Systemarchitektur                    │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Schicht 1: Gateway-Schicht (harte Ratenbegrenzung)                   │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │  - Token Bucket Rate Limiting: 100.000/s → 10.000/s            │    │
│  │    (90% der Anfragen verwerfen)                                │    │
│  │  - CDN-Caching statischer Ressourcen (Produktdetailseite)      │    │
│  │  - CAPTCHA/Warteseite (erste Schicht der Lastglättung)         │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                            │                                          │
│                            ▼                                          │
│  Schicht 2: Serviceschicht (weiche Ratenbegrenzung)                   │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │  - Nginx Rate Limiting: 10.000/s → 5.000/s                    │    │
│  │  - Redis-Bestandsabzug (atomare Operation):                    │    │
│  │    * Lua-Skripte für Atomarität                                │    │
│  │    * Bei unzureichendem Bestand: direkt „Ausverkauft"          │    │
│  │  - Bestell-Token generieren (Warteschlangen-Credential)        │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                            │                                          │
│                            ▼                                          │
│  Schicht 3: Message-Queue-Schicht (Kern der Lastglättung)             │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │  Kafka/RocketMQ:                                              │    │
│  │  - Batch-Schreiben: 5.000/s → 1.000/s (Datenbankkapazität)    │    │
│  │  - Nachrichtenpersistenz: Festplatte für keine Nachrichten-    │    │
│  │    verluste                                                    │    │
│  │  - Multi-Partition paralleler Konsum: Durchsatzsteigerung      │    │
│  │  - Consumer-Offset-Management: Failover-Unterstützung          │    │
│  │                                                                │    │
│  │  Wichtige Metriken:                                            │    │
│  │  - Produktionsrate (Produce Rate)                              │    │
│  │  - Konsumrate (Consume Rate)                                   │    │
│  │  - Nachrichtenstau (Lag)                                       │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                            │                                          │
│                            ▼                                          │
│  Schicht 4: Konsumschicht (asynchrone Verarbeitung)                   │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │  Bestellverarbeitungs-Consumer (mehrere Instanzen):            │    │
│  │  - Nachrichten von Kafka abrufen (1.000/s, passend zur DB)     │    │
│  │  - Datenbanktransaktion: Bestellung anlegen + Bestand abziehen │    │
│  │  - Bestellstatus auf „Erstellt" aktualisieren                  │    │
│  │  - Benachrichtigung über erfolgreiche Bestellung senden        │    │
│  │    (E-Mail/SMS/Push)                                           │    │
│  │  - Nachrichtenkonsum bestätigen (ACK)                          │    │
│  │                                                                │    │
│  │  Consumer-Skalierungsstrategie:                                │    │
│  │  - Wenn Lag > 10.000: automatisch Consumer-Instanzen erhöhen   │    │
│  │  - Wenn Lag < 1.000: Consumer-Instanzen reduzieren (Kosten)    │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

<PeakShavingDemo />

### 4.3 Mathematische Grundlagen der Lastspitzenglättung

**Effekt der Traffic-Glättung:**

```
Ursprünglicher Traffic (Spitze):                 Geglätteter Traffic:

100.000/s │    ╱╲                  1000/s │████████████████
          │   ╱  ╲                        │
          │  ╱    ╲                       │
  1000/s  │╱        ╲                0/s  │
          └───────────────                └────────────────
           0s   1s   2s                    0s              20s

Ursprünglich: 100.000/s Spitze, 1 Sekunde Dauer
Geglättet: 1.000/s konstante Rate, 100 Sekunden Dauer
```

**Wichtige Formel:**

```
Queue-Länge = Producer-Rate × Dauer - Consumer-Rate × Dauer
            = 100.000 × 1 - 1.000 × 1
            = 99.000 Nachrichten (Queue-Rückstau zu Spitzenzeiten)

Zeit zum vollständigen Konsum = Queue-Länge / Consumer-Rate
                              = 99.000 / 1.000
                              = 99 Sekunden
```

---

## 5. Kernfrage 3: Ansatz für stellt man sicher, dass Nachrichten nicht verloren gehen, nicht dupliziert werden und in richtiger Reihenfolge bleiben

### 5.1 Nachrichtenzuverlässigkeit: Drei Verteidigungslinien

Nachrichten können in drei Phasen verloren gehen: beim Senden durch den Producer, bei der Speicherung im Broker und bei der Verarbeitung durch den Consumer.

::: warning 🛡️ Drei Verteidigungslinien
**Linie 1: Producer-Bestätigung (Producer ACK)**

- Beim Senden auf Broker-Bestätigung warten, dass die Nachricht empfangen wurde
- Wenn keine Bestätigung: Wiederholung oder lokales Logging

**Linie 2: Broker-Persistenz**

- Nachrichten auf Festplatte schreiben, nicht nur im Arbeitsspeicher
- Multi-Replica-Synchronisation, um Datenverlust zu verhindern

**Linie 3: Consumer-Bestätigung (Consumer ACK)**

- Nach Verarbeitung der Nachricht manuell bestätigen (ACK)
- Bei Verarbeitungsfehler: nicht bestätigen, Broker liefert erneut zu
  :::

<ReliabilityDemo />

### 5.2 Umgang mit doppelten Nachrichten

**Nachrichtenduplizierung kann in folgenden Szenarien auftreten:**

1. **Producer-Wiederholung**: Producer sendet Nachricht, erhält kein ACK, wiederholt den Versand derselben Nachricht
2. **Consumer-ACK-Timeout**: Consumer hat verarbeitet, aber ACK läuft in Timeout, Broker liefert erneut zu
3. **Netzwerk-Jitter**: Consumer-ACK erreicht Broker nicht, Broker geht von nicht konsumiert aus
4. **Consumer-Neustart**: Consumer startet neu und konsumiert dieselbe Nachrichtencharge erneut

::: tip 💡 Idempotenz
**Idempotenz**: Dieselbe Operation mehrfach ausgeführt hat denselben Effekt wie eine einmalige Ausführung.

**Idempotenz im Alltag**:

- **Idempotent**: Aufzugknopf drücken (10-mal oder 1-mal drücken – der Aufzug kommt in beiden Fällen)
- **Nicht idempotent**: Überweisung (10 Yuan überweisen, zweimal ausgeführt = 20 Yuan überwiesen)

**Technische Lösung**: Jeder Nachricht eine eindeutige ID zuweisen und vor der Verarbeitung prüfen, ob sie bereits verarbeitet wurde.
:::

<IdempotenceDemo />

---

## 6. Praxis: Ansatz für wählt man die richtige Message Queue

### 6.1 Vergleich der vier wichtigsten Message Queues

| Eigenschaft         | RabbitMQ     | Kafka        | RocketMQ       | Redis Stream |
| ------------------- | ------------ | ------------ | -------------- | ------------ |
| **Positionierung**  | Klassische MQ | Verteilter Log-Stream | E-Commerce-MQ | Leichtgewichtige Queue |
| **Durchsatz**       | ~10.000/s    | ~1.000.000/s | ~100.000/s     | ~50.000/s    |
| **Latenz**          | Mikrosekunden | Millisekunden | Millisekunden | Millisekunden |
| **Zuverlässigkeit** | Hoch (Persistenz) | Hoch (Multi-Replica) | Hoch (synchroner Flush) | Mittel (AOF) |
| **Nachrichten-Replay** | Nicht unterstützt | Unterstützt | Unterstützt | Unterstützt |
| **Transaktionale Nachrichten** | Unterstützt (schwach) | Nicht unterstützt | Unterstützt (stark) | Nicht unterstützt |
| **Verzögerte Nachrichten** | Unterstützt | Nicht unterstützt | Unterstützt | Nicht unterstützt |
| **Einsatzszenarien** | Traditionelle Unternehmensanwendungen | Logging, Big Data | E-Commerce, Finanzen | Kleine Anwendungen |

::: tip 💡 Auswahlempfehlung
**Entscheidungsbaum:**

```
Message Queue auswählen:
│
├─ Transaktionale Nachrichten nötig (verteilte Transaktionen)?
│  ├─ Ja → RocketMQ (bevorzugt) oder RabbitMQ
│  └─ Nein → weiter
│
├─ Massenhaftes Logging/Real-Time-Streaming nötig?
│  ├─ Ja → Kafka (bevorzugt)
│  └─ Nein → weiter
│
├─ QPS > 10.000/s?
│  ├─ Ja → RocketMQ oder Kafka
│  └─ Nein → weiter
│
├─ Komplexes Routing nötig (z. B. Headers-Matching)?
│  ├─ Ja → RabbitMQ
│  └─ Nein → weiter
│
├─ Redis-Infrastruktur bereits vorhanden?
│  ├─ Ja → Redis Stream (schneller Einstieg)
│  └─ Nein → RabbitMQ (umfassende Funktionen, moderate Lernkurve)
```

:::

---

## 7. Zusammenfassung: Design-Denkanstöße für Message Queues

### 7.1 Kernprinzipien im Überblick

| Prinzip       | Bedeutung                        | Praxishinweise                                            |
| ------------- | -------------------------------- | --------------------------------------------------------- |
| **Entkopplung** | Services hängen nicht direkt voneinander ab | Kommunikation über Message Queue, Consumer-Ausfälle beeinträchtigen Producer nicht |
| **Lastglättung** | Traffic-Schwankungen ausgleichen | Message Queue als Pufferspeicher, Consumer mit konstanter Rate |
| **Zuverlässigkeit** | Keine verlorenen Nachrichten | Producer-ACK + Broker-Persistenz + Consumer-ACK           |
| **Idempotenz** | Doppelte Verarbeitung ohne Auswirkung | Idempotenz auf Geschäftsebene sicherstellen (Unique Key, Zustandsmaschine) |
| **Reihenfolge** | Garantierte Nachrichtenreihenfolge | Einzelpartition-Reihenfolge oder Consumer-seitige Sortierung |

### 7.2 Design-Checkliste

Vor der Einführung einer Message Queue folgende Fragen stellen:

- [ ] Wird überhaupt eine Message Queue benötigt? (Einfache Asynchronität kann mit Thread-Pools erreicht werden)
- [ ] Ist Nachrichtenverlust akzeptabel? (Bestimmt das Zuverlässigkeitsniveau)
- [ ] Beeinträchtigen doppelte Nachrichten das Geschäft? (Bestimmt den Idempotenz-Aufwand)
- [ ] Ist die Nachrichtenreihenfolge wichtig? (Bestimmt die Partitionierungsstrategie)
- [ ] Wie ist die Verarbeitungskapazität der Consumer? (Bestimmt Queue-Größe und Alarm-Schwellenwerte)
- [ ] Wie geht man mit fehlgeschlagenem Konsum um? (Bestimmt Wiederholungs- und Dead-Letter-Strategie)

---

## 8. Glossar

| Begriff                 | Vollform          | Erklärung                                                                                  |
| ----------------------- | ----------------- | ------------------------------------------------------------------------------------------ |
| **MQ**                  | Message Queue     | **Message Queue**. Middleware für asynchrone Kommunikation, entkoppelt Producer und Consumer. |
| **Producer**            | -                 | **Producer**. Die Partei, die Nachrichten sendet.                                           |
| **Consumer**            | -                 | **Consumer**. Die Partei, die Nachrichten empfängt und verarbeitet.                          |
| **Broker**              | -                 | **Broker**. Das Serverprogramm, das Nachrichten speichert und weiterleitet.                   |
| **Topic**               | -                 | **Topic**. Logische Kategorisierung von Nachrichten (z. B. „orders").                        |
| **Queue**               | -                 | **Queue**. Physischer Container zum Speichern von Nachrichten.                               |
| **Partition**           | -                 | **Partition**. Kafka-Konzept, ein Topic kann in mehrere Partitionen aufgeteilt werden, um die Parallelität zu erhöhen. |
| **ACK**                 | Acknowledgment    | **Acknowledgment**. Consumer bestätigt dem Broker die Verarbeitung einer Nachricht.          |
| **Pub/Sub**             | Publish/Subscribe | **Publish/Subscribe**. Ein Nachrichtenmuster, bei dem eine Nachricht von mehreren Consumern empfangen werden kann. |
| **P2P**                 | Point-to-Point    | **Point-to-Point**. Ein Nachrichtenmuster, bei dem eine Nachricht nur von einem Consumer empfangen werden kann. |
| **DLQ**                 | Dead Letter Queue | **Dead Letter Queue**. Speichert Nachrichten, die nicht konsumiert werden können.            |
| **Idempotence**         | -                 | **Idempotenz**. Mehrfache Ausführung führt zum gleichen Ergebnis.                            |
| **Throughput**          | -                 | **Durchsatz**. Anzahl der pro Zeiteinheit verarbeiteten Nachrichten.                         |
| **Latency**             | -                 | **Latenz**. Zeitspanne vom Senden bis zum Empfang einer Nachricht.                           |
| **Persistence**         | -                 | **Persistenz**. Nachrichten werden auf Festplatte geschrieben, nicht nur im Arbeitsspeicher.  |
| **Replication**         | -                 | **Replikation**. Für Hochverfügbarkeit werden Nachrichten auf mehrere Knoten repliziert.      |
| **Transaction Message** | -                 | **Transaktionale Nachricht**. Stellt die Konsistenz zwischen lokaler Transaktion und Nachrichtenversand sicher. |
| **Backpressure**        | -                 | **Backpressure**. Consumer signalisiert Producer, langsamer zu senden, wenn die Verarbeitung nicht hinterherkommt. |
| **Offset**              | -                 | **Offset**. Die Konsumposition eines Consumers innerhalb einer Partition.                    |
| **Rebalance**           | -                 | **Rebalance**. Neuverteilung der Partitionen bei Änderungen in der Consumer-Gruppe.          |

