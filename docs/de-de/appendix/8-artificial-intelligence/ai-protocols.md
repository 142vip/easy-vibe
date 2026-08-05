# AI-Protokolle: Kommunikationsstandards

::: tip Kernfrage
**Wie „kommuniziert" ein KI-Agent mit der Außenwelt?** Genau wie das Internet das HTTP-Protokoll benötigt, brauchen KI-Agenten standardisierte Kommunikationsprotokolle. Dieses Kapitel stellt die beiden wichtigsten Agent-Protokolle vor: MCP und A2A, die jeweils die Kommunikation zwischen KI und Werkzeugen sowie zwischen Agent und Agent regeln.
:::

---

## 0. Was ist ein Protokoll

Im Bereich der Informatik ist ein **Protokoll (Protocol)** ein Satz standardisierter Regeln und Konventionen, die es verschiedenen Systemen und Programmen ermöglichen, sich gegenseitig zu „verstehen" und zu „kommunizieren".

### 0.1 Warum braucht man Protokolle

Stell dir folgendes Szenario vor: Du verschickst ein Paket an einen Freund und musst die Adresse ausfüllen. Wenn jeder ein anderes Adressformat verwendet, kann der Zusteller nicht zustellen. Ein Protokoll legt den Standard fest, „wie die Adresse zu schreiben ist" – Provinz, Stadt, Bezirk, Straße, Hausnummer – wer in diesem Format schreibt, wird von allen verstanden.

Genauso ist es bei Computern. Zwei Programme, die kommunizieren wollen, müssen sich einigen auf:
- Welches Datenformat? (JSON? Binär?)
- Wie baut man die Verbindung auf? (Handshake-Ablauf)
- Was passiert bei Fehlern? (Fehlerbehandlung)

### 0.2 Gängige Protokolle in der Informatik

| Protokoll | Funktion | Du nutzt es täglich |
|------|------|-------------|
| **HTTP** | Webseitenübertragung | Browser öffnet Webseiten |
| **HTTPS** | Verschlüsseltes HTTP | Online-Banking, Zahlungsseiten |
| **TCP/IP** | Internet-Basisprotokoll | Alle Netzwerkkommunikation |
| **DNS** | Domain-Namensauflösung | `google.com` in IP-Adresse umwandeln |
| **SMTP** | E-Mail-Versand | E-Mails senden |
| **WebSocket** | Bidirektionale Echtzeit-Kommunikation | Chat-Software, Online-Spiele |
| **SSH** | Sichere Remote-Anmeldung | Verbindung zu Servern |
| **FTP** | Dateiübertragungsprotokoll | Dateien hoch-/herunterladen |

Diese Protokolle bilden das Fundament des Internets. Ohne sie könntest du keine Webseiten durchsuchen, E-Mails senden oder Videos ansehen.

### 0.3 Der Wert von Protokollen

Der Kernwert von Protokollen liegt in **Standardisierung** und **Interoperabilität**:

- **Standardisierung**: Alle handeln nach denselben Regeln, was Kommunikationskosten senkt
- **Interoperabilität**: Systeme verschiedener Hersteller und Technologie-Stacks können nahtlos zusammenarbeiten

Zum Beispiel ermöglicht das HTTP-Protokoll, dass der Chrome-Browser auf einen Nginx-Server zugreifen kann und ein Python-Crawler Daten von einer Java-Website extrahieren kann. Chrome und Nginx müssen sich nicht gegenseitig „kennen" – sie müssen nur beide HTTP einhalten.

### 0.4 Auch KI-Agenten brauchen Protokolle

Damit ein KI-Agent wirklich „arbeiten" kann, muss er:
- Externe Werkzeuge aufrufen (Wetter prüfen, E-Mails senden, Datenbanken bedienen)
- Mit anderen Agenten zusammenarbeiten (Aufgaben verteilen und komplexe Aufträge gemeinsam erledigen)

Dafür braucht es standardisierte Protokolle, die festlegen, „wie KI Werkzeuge aufruft" und „wie Agenten miteinander sprechen". Genau dafür wurden **MCP** und **A2A** entwickelt.

---

## 1. Die Hierarchie der Agent-Protokolle

Bevor wir in die spezifischen Protokolle eintauchen, betrachten wir die Kommunikationsebenen im Agenten-Ökosystem:

| Ebene | Protokoll | Was es löst | Analogie |
|------|------|-----------|------|
| **1** | Function Call | Wie KI lokale Funktionen aufruft | Das Gehirn gibt Befehle |
| **2** | **MCP** | Wie KI sich mit externen Werkzeugen und Datenquellen verbindet | USB-C-Anschluss |
| **3** | **A2A** | Wie Agenten kollaborieren und kommunizieren | Unternehmens-Messenger |

::: tip Interpretation dieser Tabelle
**Ebene 1 (Function Call)**: Die grundlegendste Fähigkeit großer Modelle – durch Ausgabe strukturierter Daten (JSON) die Ausführung von Funktionen auslösen. Es ist die Grundlage des „Protokolls", aber eher eine Fähigkeit als ein Standardprotokoll.

**Ebene 2 (MCP)**: Model Context Protocol, veröffentlicht von Anthropic im November 2024. Es standardisiert die Verbindung von KI mit externen Werkzeugen und Datenquellen, ähnlich wie USB-C die Ladeanschlüsse verschiedener Geräte vereinheitlicht hat.

**Ebene 3 (A2A)**: Agent-to-Agent Protocol, veröffentlicht von Google im April 2025. Es ermöglicht verschiedenen Agenten, sich gegenseitig zu entdecken, zu kommunizieren und zusammenzuarbeiten, ähnlich wie ein Unternehmens-Messenger es Kollegen ermöglicht, Aufgaben zu senden und zu chatten.
:::

Dieses Kapitel konzentriert sich auf die beiden formalen Protokolle der Ebenen 2 und 3: MCP und A2A.

---

## 2. MCP (Model Context Protocol)

### 2.1 Grundlegende Protokollinformationen

| Element | Inhalt |
|------|------|
| **Vollständiger Name** | Model Context Protocol |
| **Initiator** | Anthropic |
| **Veröffentlichungsdatum** | 25. November 2024 |
| **Offizielle Dokumentation** | [modelcontextprotocol.io](https://modelcontextprotocol.io) |
| **Open-Source-Lizenz** | MIT License |
| **GitHub** | [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol) |

::: tip Warum „Context Protocol"?
**Context (Kontext)** ist der Schlüssel, mit dem große Modelle Aufgaben verstehen. Der Kerngedanke von MCP ist: **KI soll die benötigten Kontextinformationen dynamisch abrufen können**, statt alle Informationen in den Prompt zu stopfen.

Wenn die KI z. B. eine Datei lesen muss, muss der Benutzer den Dateiinhalt nicht kopieren und einfügen, sondern die KI greift über MCP direkt auf das Dateisystem zu.
:::

### 2.2 Hintergrund der Veröffentlichung

Im Jahr 2024, mit der Veröffentlichung von Claude 3.5 Sonnet, stellte Anthropic ein Problem fest: **Jedes Werkzeug musste einzeln integriert werden**.

Stell dir vor:
- KI soll ein GitHub-Repository lesen -> GitHub-Integrationscode schreiben
- KI soll eine Datenbank abfragen -> Datenbank-Integrationscode schreiben
- KI soll das Dateisystem bedienen -> Dateisystem-Integrationscode schreiben

Jede Integration erfordert ähnlichen Code: Authentifizierung, Fehlerbehandlung, Datenkonvertierung ...

Anthropic schrieb im offiziellen Blog:
> "We're introducing the Model Context Protocol (MCP), an open protocol that standardizes how applications provide context to LLMs."

**Kernziel**: Werkzeugentwickler schreiben ihren Code einmal, und alle MCP-unterstützenden KI-Anwendungen können ihn nutzen.

### 2.3 Was ist MCP

<McpVisualDemo />

**Drei Kernfähigkeiten**:

| Fähigkeit | Englisch | Funktion | Beispiel |
|------|------|------|------|
| **Werkzeuge** | Tools | Funktionen, die die KI aufrufen kann | Wetter abfragen, E-Mails senden |
| **Ressourcen** | Resources | Daten, die die KI lesen kann | Dateiinhalte, Datenbankeinträge |
| **Prompts** | Prompts | Vordefinierte Prompt-Vorlagen | Code-Review-Vorlage, Schreibvorlage |

### 2.4 Interne Implementierung von MCP

<McpDetailedDemo />

### 2.5 Analogie: USB-C-Anschluss

MCP ist wie ein **USB-C-Anschluss**:

- **Früher**: Jedes Gerät hatte seinen eigenen Ladeanschluss (rund, flach, magnetisch ...)
- **Heute**: USB-C vereinheitlicht das Laden und die Datenübertragung aller Geräte
- **MCP**: Vereinheitlicht die Verbindung von KI mit allen Werkzeugen

Werkzeugentwickler müssen nur einmal einen MCP-Server implementieren, und alle MCP-unterstützenden KI-Anwendungen (Claude, Cursor, Windsurf etc.) können ihn direkt nutzen.

### 2.6 Typische Anwendungsszenarien von MCP

| Szenario | Beschreibung | Beispiel |
|------|------|------|
| **Lokale Dateioperationen** | KI liest/ändert lokale Dateien | Codebasis lesen, Logdateien analysieren |
| **Datenbankabfragen** | KI fragt Datenbanken direkt ab | SQL-Abfragen, Datenanalyse |
| **API-Aufrufe** | KI ruft Drittanbieterdienste auf | GitHub API, Slack, E-Mail |
| **Entwicklungswerkzeug-Integration** | KI nutzt Entwicklungswerkzeuge | Git-Operationen, Terminalbefehle |

**Praktische Beispiele**:
- **Cursor/Windsurf**: Verbindung mit Dateisystem, Git, Terminal über MCP
- **Claude Desktop**: Verbindung mit Notizsoftware, E-Mail-Client über MCP
- **Automatisierungsskripte**: KI führt automatisierte Aufgaben aus (Backup, Deployment, Datensynchronisation)

---

## 3. A2A (Agent-to-Agent Protocol)

### 3.1 Grundlegende Protokollinformationen

| Element | Inhalt |
|------|------|
| **Vollständiger Name** | Agent-to-Agent Protocol |
| **Initiator** | Google |
| **Veröffentlichungsdatum** | 9. April 2025 |
| **Offizielle Dokumentation** | [google.github.io/A2A](https://google.github.io/A2A) |
| **Open-Source-Lizenz** | Apache 2.0 |
| **GitHub** | [github.com/google/A2A](https://github.com/google/A2A) |

::: tip Warum wurde es von Google initiiert?
Google veröffentlichte A2A auf der Cloud Next 2025-Konferenz, eng verbunden mit seiner Enterprise-KI-Strategie.

Google ist der Ansicht: Die Unternehmens-KI der Zukunft ist kein einzelner Super-Agent, sondern **mehrere spezialisierte Agenten, die zusammenarbeiten** – einer für Datenanalyse, einer für Codegenerierung, einer für Dokumentenverarbeitung.

Diese Agenten brauchen eine standardisierte Art der Kommunikation untereinander – daher A2A.
:::

### 3.2 Hintergrund der Veröffentlichung

MCP löste das Problem „Wie verbindet sich KI mit Werkzeugen?", aber eine Frage blieb: **Wie arbeiten mehrere Agenten zusammen?**

Stell dir folgendes Szenario vor:
- Agent A ist ein „Anforderungsanalyse-Experte"
- Agent B ist ein „Codegenerierungs-Experte"
- Agent C ist ein „Test-Experte"

Der Benutzer sagt: „Entwickle eine Login-Funktion für mich"

Agent A analysiert die Anforderungen und muss die Aufgabe an Agent B delegieren; Agent B schreibt den Code und muss ihn von Agent C testen lassen. Wie kommunizieren sie untereinander?

Google schrieb im offiziellen Blog:
> "A2A is an open protocol that enables AI agents to communicate with each other, facilitating collaboration across different frameworks and vendors."

**Kernziel**: Agenten verschiedener Hersteller und Frameworks sollen nahtlos zusammenarbeiten können.

### 3.3 Was ist A2A

<A2AVisualDemo />

**Drei Kernkonzepte**:

| Konzept | Englisch | Funktion | Analogie |
|------|------|------|------|
| **Agent Card** | Agent-Karte | Beschreibt die Fähigkeiten eines Agenten | Mitarbeiterausweis |
| **Task** | Aufgabe | Die auszuführende Arbeitseinheit | Arbeitsauftrag |
| **Message** | Nachricht | Kommunikationsinhalt zwischen Agenten | Chatverlauf |

### 3.4 Interne Implementierung von A2A

<A2ADetailedDemo />

### 3.5 Analogie: Unternehmens-Messenger

A2A ist wie ein **Unternehmens-Messenger**:

- **Agent Card**: Die Visitenkarte jedes Mitarbeiters – Name, Abteilung, Aufgaben
- **Aufgabe senden**: @Jemand, eine Aufgabe zuweisen
- **Chat-Kommunikation**: Während der Aufgabenausführung kann jederzeit kommuniziert werden
- **Aufgabenverfolgung**: Fortschritt und Status der Aufgabe sind einsehbar

Verschiedene Agenten sind wie verschiedene Kollegen, A2A ermöglicht ihnen, komplexe Projekte gemeinsam zu bearbeiten.

### 3.6 Typische Anwendungsszenarien von A2A

| Szenario | Beschreibung | Beispiel |
|------|------|------|
| **Softwareentwicklung** | Multi-Agent-Kollaboration für Entwicklungsaufgaben | Anforderungsanalyse -> Code -> Test -> Deployment |
| **Unternehmensworkflows** | Agenten verschiedener Abteilungen arbeiten zusammen | HR-Agent + Finanz-Agent + Rechts-Agent |
| **Intelligenter Kundenservice** | Mehrere Fachagenten mit Arbeitsteilung | Empfang -> Beantwortung -> Weiterleitung -> Aufzeichnung |
| **Datenanalyse** | Mehrere Agenten analysieren Daten gemeinsam | Sammlung -> Bereinigung -> Analyse -> Visualisierung -> Bericht |

**Praktische Beispiele**:
- **Google Agent Space**: Unternehmensinterne Multi-Agent-Kollaboration für Dokumente, E-Mails, Kalender
- **Softwareentwicklungsteam**: Anforderungs-Agent -> Code-Agent -> Test-Agent -> Deployment-Agent
- **Intelligentes Kundenservice-System**: Empfangs-Agent -> Fachantwort-Agent -> Weiterleitungs-Agent

---

## 4. MCP vs. A2A: Vergleich und Beziehung

### 4.1 Kernunterschiede

| Dimension | MCP | A2A |
|------|-----|-----|
| **Initiator** | Anthropic (Nov. 2024) | Google (Apr. 2025) |
| **Positionierung** | KI-Werkzeug-Verbindung | Agent-Agent-Kollaboration |
| **Kommunikationsbereich** | Client-Server | Peer-to-Peer |
| **Datenformat** | JSON-RPC 2.0 | HTTP + JSON |
| **Analogie** | USB-C-Anschluss | Unternehmens-Messenger |

### 4.2 Beziehung zwischen beiden

MCP und A2A sind **keine Konkurrenten, sondern ergänzen sich**:

<ProtocolComparisonDemo />

### 4.3 Wie wählt man

| Szenario | Wahl |
|------|------|
| KI soll lokale Funktionen oder Werkzeuge aufrufen | Function Call |
| Drittanbieter-Werkzeuge nutzen (Datenbank, API, Dateisystem) | MCP |
| Multi-Agent-Kollaborationssystem aufbauen | A2A |
| Sowohl Werkzeugintegration als auch Multi-Agent-Kollaboration benötigt | MCP + A2A |

---

## 5. Zukunftstrends der Protokolle

### 5.1 Ökosystem-Entwicklung

**MCP-Ökosystem** (Stand: Anfang 2025):
- Offizielle Server: Dateisystem, SQLite, Git, PostgreSQL u. a.
- Community-Server: Slack, Notion, Figma, Stripe u. a.
- MCP-unterstützende Anwendungen: Claude Desktop, Cursor, Windsurf, Zed u. a.

**A2A-Ökosystem** (gerade veröffentlicht):
- Googles eigene Agent-Produkte unterstützen es zuerst
- Die Open-Source-Community entwickelt SDKs in verschiedenen Sprachen
- Unternehmensanwendungen werden noch erkundet

### 5.2 Standardisierungsprozess

Derzeit befinden sich die Agent-Protokolle noch in der „Zeit der kämpfenden Reiche":
- MCP und A2A sind die beiden wichtigsten
- Es gibt weitere aufkommende Protokolle wie ANP, AGP u. a.
- In Zukunft könnten sie fusionieren oder vereinheitlicht werden

Analog zur Entwicklung des Internets:
- Frühphase: Verschiedene LAN-Protokolle existierten nebeneinander
- Später: TCP/IP wurde zum Standard
- Heute: Agent-Protokolle könnten ebenfalls zu einer Vereinheitlichung führen

---

## 6. Zusammenfassung

::: tip Kernpunkte
| Protokoll | In einem Satz | Veröffentlicht | Initiator | Einsatzszenario |
|------|-----------|---------|--------|---------|
| **MCP** | Der „USB-C" für KI-Werkzeug-Verbindungen | Nov. 2024 | Anthropic | Werkzeugintegration, Datenquellenanbindung |
| **A2A** | Der „Unternehmens-Messenger" für Agent-Kollaboration | Apr. 2025 | Google | Multi-Agent-Kollaboration, Aufgabendelegation |

**Kernerkenntnisse**:
1. MCP löst das Problem „Wie erlangt KI externe Fähigkeiten?"
2. A2A löst das Problem „Wie arbeiten mehrere KIs zusammen?"
3. Beide ergänzen sich und könnten in Zukunft fusioniert eingesetzt werden
4. Die Protokollwahl hängt vom konkreten Szenario ab – es gibt keine universelle Lösung
:::

---

## Referenzen

1. **MCP Offizielle Dokumentation**: [modelcontextprotocol.io](https://modelcontextprotocol.io)
2. **MCP GitHub**: [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)
3. **Anthropic Veröffentlichungs-Blog**: "Introducing the Model Context Protocol" (25.11.2024)
4. **A2A Offizielle Dokumentation**: [google.github.io/A2A](https://google.github.io/A2A)
5. **A2A GitHub**: [github.com/google/A2A](https://github.com/google/A2A)
6. **Google Cloud Blog**: "Announcing the Agent-to-Agent Protocol" (09.04.2025)