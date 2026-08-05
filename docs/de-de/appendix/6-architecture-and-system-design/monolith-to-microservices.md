# Monolith zu Microservices: Architektur-Evolution

::: tip Einleitung
**Keine Architektur ist „die beste" — es gibt nur die Architektur, die am besten zur aktuellen Phase passt.** Der Übergang vom Monolithen zu Microservices ist kein Sprung, der in einem Schritt vollzogen wird, sondern ein schrittweiser Evolutionsprozess, der mit dem Wachstum des Geschäftsumfangs und der Teamgröße einhergeht. Eine zu frühe Aufspaltung in Microservices ist genauso gefährlich wie eine zu späte.
:::

**Was werden Sie in diesem Artikel lernen?**

Nach Abschluss dieses Kapitels werden Sie Folgendes beherrschen:

- **Evolutionärer Pfad**: Vier Phasen vom Monolithen zu Microservices verstehen
- **Zeitpunkt der Aufspaltung**: Wissen, wann aufgespalten werden sollte und wann nicht
- **Aufspaltungsstrategien**: Methodik der domänenbasierten Aufspaltung beherrschen
- **Kommunikationsmuster**: Synchron und asynchrone Kommunikation zwischen Services kennenlernen
- **Datenaufspaltung**: Herausforderungen und Lösungen der Datenbankaufspaltung verstehen

| Kapitel | Inhalt | Kernkonzepte |
|---------|--------|--------------|
| **Kapitel 1** | Architekturevolution | Monolith → Modularer Monolith → SOA → Microservices |
| **Kapitel 2** | Zeitpunkt und Prinzipien der Aufspaltung | Conway's Law, Team-Autonomie |
| **Kapitel 3** | Aufspaltungsstrategien | DDD Bounded Context, Strangler Fig Pattern |
| **Kapitel 4** | Service-Kommunikation | REST, gRPC, Nachrichtenwarteschlangen |
| **Kapitel 5** | Datenaufspaltung | Datenbankaufspaltung, Datensynchronisation |

---

## 1. Architekturevolution

Die Architekturevolution wird nicht von der Technologie, sondern von der **Organisationsgröße** angetrieben. Wenn ein Team von 5 auf 500 Personen wächst, sinkt die Zusammenarbeitseffizienz in einer monolithischen Architektur drastisch.

| Phase | Architektur | Teamgröße | Merkmale |
|-------|------------|-----------|----------|
| Startphase | Monolithische Anwendung | 1–10 Personen | Gesamter Code in einem Projekt, einfaches Deployment |
| Wachstumsphase | Modularer Monolith | 10–50 Personen | Code nach Modulen gegliedert, aber weiterhin gemeinsam bereitgestellt |
| Expansionsphase | SOA (Serviceorientiert) | 50–200 Personen | Grobe Services nach Geschäftsbereichen aufgeteilt |
| Skalierungsphase | Microservices | 200+ Personen | Feingranulare Services, jedes Team entwickelt und deployt unabhängig |

<ArchEvolutionDemo />

::: tip Conway's Law
„Organisationen, die Systeme entwerfen, produzieren Architekturen, die ihrer Kommunikationsstruktur entsprechen." — Melvin Conway

Einfach gesagt: 3 Teams, die ein System bauen, werden am Ende 3 Services haben. Die Essenz der Architekturaufspaltung ist die **Organisationsaufspaltung**.

**Inverse Conway's Law**: Da die Organisationsstruktur die Systemarchitektur bestimmt, sollte man zuerst die Organisationsstruktur anpassen, um die gewünschte Architektur zu erhalten. Wenn Sie beispielsweise einen unabhängigen Zahlungsservice aufspalten möchten, bilden Sie zuerst ein unabhängiges Zahlungsteam. Bei vielen Unternehmen scheitert die Microservice-Aufspaltung nicht aus technischen Gründen, sondern weil die Organisation sich nicht angepasst hat.
:::

---

## 2. Wann sollte man zu Microservices aufspalten

Nicht jedes System benötigt Microservices. Eine zu frühe Aufspaltung bringt unnötige Komplexität mit sich.

| Signal | Beschreibung | Empfehlung |
|--------|-------------|-----------|
| Häufige Deployment-Konflikte | Mehrere Teams arbeiten an derselben Codebasis mit häufigen Konflikten | Aufspaltung erwägen |
| Ein Modul benötigt unabhängige Skalierung | Das Suchmodul benötigt 10x mehr Ressourcen als andere Module | Aufspaltung erwägen |
| Differenzierte Technologie-Stacks | KI-Modul in Python, Hauptseite in Java | Aufspaltung erwägen |
| Team < 10 Personen | Geringe Kommunikationskosten, Monolith reicht aus | Nicht aufspalten |
| Geschäft in der Explorationsphase | Häufig wechselnde Anforderungen, unklare Grenzen | Nicht aufspalten |
| Keine DevOps-Fähigkeiten | Kein CI/CD, Containerisierung oder Monitoring-System | Nicht aufspalten |

---

## 3. Aufspaltungsstrategien

### 3.1 Domänenbasierte Aufspaltung (DDD Bounded Context)

Der Bounded Context (begrenzter Kontext) aus DDD (Domain-Driven Design) ist das beste Leitprinzip für die Aufspaltung von Microservices. Jeder Bounded Context entspricht einer unabhängigen Geschäftsdomäne mit eigenem Datenmodell und eigenen Geschäftsregeln.

**Was ist ein Bounded Context?** Dasselbe Wort hat in verschiedenen Geschäftsdomänen unterschiedliche Bedeutungen. Zum Beispiel bedeutet „Benutzer" in der Benutzerdomäne Registrierungsinformationen (Name, E-Mail), in der Bestellungsdomäne den Besteller (Lieferadresse, Zahlungsmethode) und in der Empfehlungsdomäne das Verhaltensprofil (Browserverlauf, Präferenz-Tags). Der Bounded Context zieht eine Grenze, innerhalb derer Begriffe und Modelle eine eindeutige und einheitliche Bedeutung haben.

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Benutzer-   │  │  Bestellungs-│  │  Zahlungs-   │
│  domäne      │  │  domäne      │  │  domäne      │
│              │  │              │  │              │
│ User         │  │ Order        │  │ Payment      │
│ Profile      │  │ OrderItem    │  │ Refund       │
│ Address      │  │ Cart         │  │ Transaction  │
│              │  │              │  │              │
│ Benutzer-    │  │ Bestellungs- │  │ Zahlungs-    │
│ dienst       │  │ dienst       │  │ dienst       │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                  │                  │
       └──── API-Aufrufe / Ereigniskommunikation ────┘
```

| Bounded Context | Kernentitäten | Entsprechender Service |
|----------------|--------------|----------------------|
| Benutzerdomäne | User, Profile, Address | Benutzer-Service |
| Produktdomäne | Product, Category, SKU | Produkt-Service |
| Bestellungsdomäne | Order, OrderItem | Bestellungs-Service |
| Zahlungsdomäne | Payment, Refund | Zahlungs-Service |
| Logistikdomäne | Shipment, Tracking | Logistik-Service |

### 3.2 Strangler Fig Pattern (Würgefeigen-Muster)

Den gesamten Monolithen nicht auf einmal neu schreiben, sondern wie eine Würgefeige schrittweise alte Module durch neue Services ersetzen:

1. Neuen Service außerhalb des Monolithen erstellen
2. Über eine Proxyschicht einen Teil des Datenverkehrs zum neuen Service routen
3. Nach Validierung der Stabilität des neuen Services schrittweise mehr Verkehr migrieren
4. Schließlich das alte Modul vollständig ersetzen

---

## 4. Service-Kommunikationsmuster

| Methode | Protokoll | Merkmale | Anwendungsbereich |
|---------|----------|----------|-------------------|
| REST | HTTP/JSON | Einfach, universell, gutes Ökosystem | Externe APIs, CRUD-Operationen |
| gRPC | HTTP/2 + Protobuf | Hohe Leistung, starke Typisierung | Interne hochfrequente Service-Aufrufe |
| Nachrichtenwarteschlange | AMQP/Kafka | Asynchrone Entkopplung, Lastspitzenabflachung | Ereignisbenachrichtigungen, asynchrone Aufgaben |
| GraphQL | HTTP/JSON | Client-seitige bedarfsgerechte Abfragen | BFF-Schicht, mobile Clients |

::: tip Wahl zwischen synchron und asynchron
- **Sofortiges Ergebnis benötigt** → Synchron (REST/gRPC)
- **Kein sofortiges Ergebnis benötigt** → Asynchron (Nachrichtenwarteschlange)
- **Ein Ereignis löst mehrere Aktionen aus** → Asynchron (Publish-Subscribe)

Faustregel: So viel Asynchronität wie möglich. Je länger die synchrone Aufrufkette, desto fragiler das System.
:::

---

## 5. Datenaufspaltung: Der schwierigste Teil

Der schmerzhafteste Teil der Microservice-Aufspaltung ist nicht die Codeaufspaltung, sondern die Datenbankaufspaltung. Jeder Service sollte seine eigene Datenbank besitzen, was jedoch bedeutet, dass serviceübergreifende Abfragen schwierig werden.

| Herausforderung | Beschreibung | Lösung |
|----------------|-------------|--------|
| Serviceübergreifende JOINs | Tabellen zweier Services können nicht direkt gejoint werden | API-Kompositionsabfragen, Datenredundanz |
| Verteilte Transaktionen | Datenbankübergreifende Transaktionen können keine lokalen Transaktionen nutzen | Saga, lokale Nachrichtentabelle |
| Datenkonsistenz | Daten mehrerer Services können vorübergehend inkonsistent sein | Eventuale Konsistenz, ereignisgesteuert |
| Datenmigration | Migration von gemeinsam genutzter zu eigenständiger Datenbank | Dual-Write-Übergang, Datensynchronisationstools |

---

## Zusammenfassung

Der Übergang vom Monolithen zu Microservices ist ein schrittweiser Prozess, keine Revolution über Nacht.

Rückblick auf die wichtigsten Punkte dieses Kapitels:

1. **Evolutionärer Pfad**: Monolith → Modularer Monolith → SOA → Microservices, jede Stufe hat einen klaren Treiber
2. **Zeitpunkt der Aufspaltung**: Teamgröße, Deployment-Konflikte, Skalierungsanforderungen sind Signale für die Aufspaltung
3. **Aufspaltungsstrategien**: DDD Bounded Context zur Leitplanke, Strangler Fig Pattern für schrittweise Migration
4. **Kommunikationswahl**: So asynchron wie möglich, synchrone Aufrufketten so kurz wie möglich
5. **Datenaufspaltung**: Am schwierigsten, aber am wichtigsten — die Akzeptanz der eventualen Konsistenz ist der entscheidende Denkansatz

## Weiterführende Literatur

- [Building Microservices](https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/) - Sam Newmans Microservices-Klassiker
- [Monolith to Microservices](https://www.oreilly.com/library/view/monolith-to-microservices/9781492047834/) - Leitfaden für schrittweise Migration
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/) - Eric Evans' DDD-Klassiker
- [The Strangler Fig Pattern](https://martinfowler.com/bliki/StranglerFigApplication.html) - Martin Fowlers Strangler Fig Pattern
