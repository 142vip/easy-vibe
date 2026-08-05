# Echtzeitkommunikation: Netzwerkprotokolle

::: tip Kernleitfaden
**Wie realisiert der Browser Echtzeit-Updates von Daten?**
Das traditionelle HTTP-Protokoll basiert auf einem „Anfrage-Antwort"-Modell, bei dem der Client aktiv eine Anfrage initiieren muss, bevor der Server Daten zuruckgeben kann. Wenn wir Echtzeit-Szenarien wie Chatraume oder Aktienkurs-Pushes realisieren mussen, stoesst dieses Modell an seine Grenzen.

Dieses Kapitel stellt die drei wichtigsten Frontend-Technologien fur Echtzeit-Datenkommunikation vor: Kurz-Polling (Polling), Server-Sent Events (SSE) und Full-Duplex WebSocket, und erortert deren Prinzipien und Anwendungsszenarien.
:::

---

## 1. Die Beschrankungen des traditionellen HTTP

Das HTTP-Protokoll wurde ursprunglich fur den Dokumentenabruf entwickelt und zeichnet sich durch **Zustandlosigkeit (Stateless)** und **einseitige Client-Initiierung** aus:
1. Der Client initiiert eine HTTP-Anfrage.
2. Der Server verarbeitet die Anfrage und sendet eine Antwort.
3. Nach Abschluss der Aufgabe wird die entsprechende logische Anfrage normalerweise freigegeben (HTTP/1.1 unterstutzt zwar Wiederverwendung von Persistent Connections, aber das Anfrage-Antwort-Modell auf Geschaftsebene hat sich nicht geandert).

In diesem Modus kann der Server wartende Clients nicht aktiv uber Statusanderungen informieren. Um die aktuellsten Daten zu erhalten, mussen andere technologische Architekturlösungen gesucht werden.

---

## 2. Kurz-Polling (Polling)

Die direkteste Losung ist **Kurz-Polling**. Der Client nutzt einen Timer (z.B. `setInterval`), um in festen Zeitabstanden automatisch HTTP-Anfragen an den Server zu senden und zu prufen, ob neue Daten eingegangen sind.

<PollingDemo />

**Technische Merkmale und Beschrankungen:**
- **Vorteile**: Der Implementierungsmechanismus ist extrem einfach und basiert vollstandig auf Standard-HTTP-Protokollen und AJAX/Fetch-Technologie.
- **Nachteile**: Kann zu enormem Netzwerk-Overhead und Ressourcenverschwendung fuhren. In den meisten Fallen lautet die Antwort des Servers „keine neuen Daten". Unabhangig davon, ob Daten vorhanden sind oder nicht, muss bei jeder Anfrage der vollstandige HTTP-Header (Headers, Cookies usw.) mitgefuhrt werden, was in Szenarien mit hoher Nebenlaufigkeit dazu fuhrt, dass Netzwerkressourcen von einer grossen Anzahl bedeutungsloser Abfragen belegt werden.

---

## 3. Server-Sent Events (SSE)

Um den Overhead haufig hergestellter HTTP-Verbindungen zu reduzieren, bieten **Server-Sent Events (SSE)** eine leichtgewichtige, unidirektionale Datenstrom-Push-Architektur.

SSE baut auf dem HTTP-Protokoll auf. Nachdem der Client eine HTTP-Anfrage mit einem speziellen Anfrage-Header (`Accept: text/event-stream`) initiiert hat, halt der Server die zugrunde liegende TCP-Verbindung beim Senden der Antwort offen. Anschliessend kann der Server uber diesen permanenten Kanal kontinuierlich Textdaten im Event-Stream-Format an den Client pushen.

<SSEDemo />

**Technische Merkmale und Beschrankungen:**
- **Vorteile**: Dauerhafte Verbindung mit geringem Netzwerk-Overhead; der Browser unterstutzt nativ automatische Wiederverbindung bei Verbindungsabbruch; sehr gut geeignet fur die **unidirektionale** Ubertragung von Streaming-Daten vom Server zum Client (z.B. zeichenweise Textausgabe grosser Sprachmodelle, Echtzeit-Handelskurs-Pushes).
- **Nachteile**: Der Kommunikationskanal ist unidirektional. Wenn der Client Kontrollbefehle an den Server senden oder neue Daten ubertragen mochte, muss eine separate normale HTTP-Anfrage eingerichtet werden.

---

## 4. WebSocket: Full-Duplex-Kommunikationsprotokoll

Wenn einwendungsszenarien hochfrequente bidirektionale Interaktionen erfordern (z.B. Multiplayer-Online-Actionspiele, prazise kollaborative Dokumentbearbeitung), bentigen wir eine Technologie, die sowohl die Kommunikationskosten senken als auch echte Duplex-Kommunikation realisieren kann — **WebSocket**.

WebSocket ist ein unabhangiges Netzwerkkommunikationsprotokoll. Es nutzt geschickt das HTTP-Protokoll fur den anfanglichen Verbindungsaufbau:
1. **Handshake-Phase**: Der Client sendet eine spezielle HTTP-Anfrage und erklart, dass er auf ein neues Protokoll aktualisieren mochte (mit `Upgrade: websocket`-Header).
2. **Verbumlungswandel**: Wenn der Server dies unterstutzt und zustimmt, antwortet er mit dem Statuscode `101 Switching Protocols`.
3. **Volstandige Freiheit**: An diesem Punkt endet die normative Mission von HTTP, und die zugrunde liegende TCP-Verbindung wird an das WebSocket-Protokoll ubertragen. Danach geniessen Client und Server gleiche Full-Duplex-Kommunikationsrechte und konnen jederzeit minimalistische Datenrahmen senden und empfangen.

<WebSocketDemo />

**Technische Merkmale und Beschrankungen:**
- **Vorteile**: Unterstutzt echte bidirektionale Echtzeit-Kommunikation; die Header-Informationen von Datenrahmen sind extrem klein, was zu niedriger Kommunikationslatenz und hohem Durchsatz fuhrt; unterstutzt die Ubertragung nativer Binardaten (ArrayBuffer).
- **Nachteile**: Hohere Architektur- und Entwicklungskomplexitat; da permanente Verbindungen aufrechterhalten werden, stellt dies strengere Engineering-Anforderungen an die serverseitige Systemarchitektur, Lastenausgleichsstrategien und Heartbeat-Überwachungsdesigns.

---

## 5. Zusammenfassung: Technologieauswahl im Vergleich

| Dimension | Kurz-Polling (Polling) | Server-Sent Events (SSE) | WebSocket |
| :--- | :--- | :--- | :--- |
| **Kommunikationsrichtung** | Client fragt aktiv ab (unidirektional) | Server pusht kontinuierlich aktiv (unidirektional) | Client und Server haben gleiche Sende-/Empfangsrechte (bidirektional Full-Duplex) |
| **Zugrundeliegendes Protokoll** | Standard-HTTP | Standard-HTTP | Unabhangiges WebSocket-Protokoll (TCP-basiert) |
| **Daten-Overhead** | Sehr hoch (enthaelt vollstandige HTTP-Header) | Niedrig | Extrem niedrig (minimale Datenrahmen-Header) |
| **Typische Anwendungsszenarien** | Regelmassige Uberprufung des Abschlusses von Backend-Asynchronaufgaben | Unidirektionaler Stream-Output bei LLM-Dialogen, News- oder Systembenachrichtigungs-Pushes | Echtzeit-Audio/Video-Signalisierung, Multiplayer-Online-Spiele, kollaborative Whiteboards und Editoren |

In der praktischen Ingenieurarbeit sollten Entwickler basierend auf den spezifischen Anforderungen des Geschäftsszenarios an Echtzeitfahigkeit und bidirektionaler Interaktionsfrequenz ein Gleichgewicht zwischen Wartungskomplexitat und Kommunikationseffizienz des Systems finden und den am besten geeigneten Technologie-Stack auswahlen.
