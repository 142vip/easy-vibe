# Systemdesign-Methodik: Entwurfsprinzipien

::: tip Einleitung
**Systemdesign ist kein Bauchgefühl beim Zeichnen von Architekturdiagrammen, sondern eine systematische Methodik.** Egal ob es sich um eine Systemdesign-Aufgabe in einem Vorstellungsgespräch oder um eine echte Architekturplanung in der Praxis handelt — es gilt ein ähnlicher Denkrahmen: Zunächst das Problem verstehen, dann den Umfang abschätzen, anschließend einen Entwurf erstellen und schließlich vertiefend optimieren.
:::

**Was werden Sie in diesem Artikel lernen?**

Nach Abschluss dieses Kapitels werden Sie Folgendes beherrschen:

- **Design-Prozess**: Den Vier-Schritte-Rahmen des Systemdesigns beherrschen
- **Kapazitätsschätzung**: Die Technik der „Umschlag-Rückseite-Schätzung" erlernen
- **Gängige Muster**: Kernmuster wie Caching, Sharding, Nachrichtenwarteschlangen kennen
- **Abwägungsdenken**: Das Trade-off-Denken im Architekturdesign verstehen
- **Praktische Fälle**: Den Designprozess anhand von URL-Shortener, Feed-Stream und anderen Beispielen nachvollziehen

| Kapitel | Inhalt | Kernkonzepte |
|---------|--------|--------------|
| **Kapitel 1** | Vier-Schritte-Design | Anforderungsklärung, Kapazitätsschätzung, Architekturentwurf, vertiefende Optimierung |
| **Kapitel 2** | Kapazitätsschätzung | QPS, Speicher, Bandbreite, Umschlag-Rückseite-Schätzung |
| **Kapitel 3** | Kern-Entwurfsmuster | Caching, Sharding, Nachrichtenwarteschlangen, CDN |
| **Kapitel 4** | Abwägungsdenken | Konsistenz vs. Verfügbarkeit, Leistung vs. Kosten |
| **Kapitel 5** | Klassische Fälle | URL-Shortener, Feed-Stream, Flash-Sale-System |

---

## 1. Vier-Schritte-Systemdesign

Systemdesign bedeutet nicht, sofort ein Architekturdiagramm zu zeichnen. Egal ob Vorstellungsgespräch oder Praxis — ein strukturierter Prozess sollte befolgt werden.

<SystemDesignStepsDemo />

::: tip Warum zuerst die Anforderungen klären?
Viele fangen sofort an zu zeichnen und entwerfen ein System, das zwar „korrekt", aber nicht das ist, „das der Prüfer haben möchte". 5 Minuten für die Klärung der Anforderungen sparen 30 Minuten Nacharbeit.

Typische Klärungsfragen:
- Was sind die Kernfunktionen des Systems? (Nicht alle Funktionen entwerfen)
- Wie groß ist die Nutzerbasis? (Entscheidet über die Notwendigkeit verteilter Architektur)
- Lese-/Schreibverhältnis? (Bestimmt die Caching-Strategie)
- Wie lange müssen Daten aufbewahrt werden? (Bestimmt die Speicherlösung)
:::

---

## 2. Kapazitätsschätzung: Die Kunst der Umschlag-Rückseite

Die „Back-of-Envelope-Schätzung" ist eine Kernkompetenz im Systemdesign. Keine exakten Berechnungen nötig — nur die Größenordnung muss bekannt sein.

<CapacityEstimationDemo />

### Gängige Umrechnungshilfen

| Größenordnung | Umrechnung | Eselsbrücke |
|--------------|-----------|------------|
| 1 Tag | 86.400 Sekunden | ≈ 100.000 Sekunden |
| 100 Mio. Anfragen/Tag | ≈ 1.200 QPS | Geteilt durch 100.000 |
| 1 KB × 100 Mio. | ≈ 100 GB | 100 Mio. kleine Datensätze |
| 1 MB × 1 Mio. | ≈ 1 TB | 1 Mio. Bilder |

### Die 80/20-Regel in der Schätzung

Die meisten Systeme folgen der 80/20-Regel: 20 % der Daten tragen 80 % der Anfragen. Das bedeutet:

- **Cache-Größe** ≈ Gesamtdatenmenge × 20 %
- **Hot-Spot QPS** ≈ Gesamt-QPS × 80 % konzentrieren sich auf 20 % der Schlüssel
- **Cache-Trefferrate** Ziel ≈ 80 %+ (darunter liegt ein Problem mit der Caching-Strategie vor)

---

## 3. Kern-Entwurfsmuster

Im Systemdesign tauchen wiederholt bestimmte Muster auf. Wer diese beherrscht, kann die meisten Szenarien bewältigen.

### 3.1 Caching-Muster

| Muster | Lesepfad | Schreibpfad | Anwendungsbereich |
|--------|----------|------------|-------------------|
| Cache-Aside | Erst Cache prüfen, bei Miss DB abfragen und Cache befüllen | Erst DB schreiben, dann Cache invalidieren | Universell, am häufigsten verwendet |
| Read-Through | Cache-Schicht lädt automatisch aus DB | Wie Cache-Aside | Erfordert Cache-Framework-Unterstützung |
| Write-Behind | Wie Cache-Aside | Erst in Cache schreiben, asynchron in DB | Schreibintensiv, Datenverlust tolerierbar |

::: tip Warum „Cache löschen" statt „Cache aktualisieren"?
Das Aktualisieren des Caches führt in并发-Szenarien leicht zu Dateninkonsistenzen: Thread A und B aktualisieren gleichzeitig, A schreibt zuerst in die DB, aber B aktualisiert zuerst den Cache — der Cache enthält nun Bs alten Wert. Das Löschen des Caches zwingt die nächste Leseanfrage, die Daten erneut aus der DB zu laden, was dieses Problem natürlicherweise vermeidet.
:::

### 3.2 Sharding (Datenbank- und Tabellenaufspaltung)

Wenn eine einzelne Tabelle mehr als zehn Millionen Datensätze enthält oder das QPS einer einzelnen Datenbank ihren Flaschenhals erreicht, sollte eine Sharding-Strategie in Betracht gezogen werden.

| Strategie | Vorgehen | Vorteile | Nachteile |
|-----------|---------|----------|----------|
| Vertikale Datenbankaufspaltung | Datenbanken nach Geschäftsdomäne aufteilen | Geschäftsentkopplung, unabhängige Skalierung | Datenbankübergreifende JOINs schwierig |
| Horizontale Tabellenaufspaltung | Gleiche Tabelle nach Regel in mehrere aufteilen | Datenmenge pro Tabelle kontrollierbar | Wahl des Shard-Schlüssels kritisch |
| Vertikale Tabellenaufspaltung | Große Felder in separate Tabelle auslagern | Weniger I/O, höhere Abfrageleistung | Zusätzliche JOINs erforderlich |

**Prinzipien der Shard-Schlüsselwahl**:
- Das am häufigsten abgefragte Feld wählen (z. B. user_id)
- Gleichmäßige Datenverteilung sicherstellen, Hot-Spots vermeiden
- Daten desselben Benutzers möglichst im selben Shard (shardübergreifende Abfragen reduzieren)

### 3.3 Nachrichtenwarteschlangen

Nachrichtenwarteschlangen sind die „Stoßdämpfer" verteilter Systeme. Ihre Kernfunktionen sind Entkopplung, Asynchronität und Lastspitzenabflachung.

| Szenario | Ohne Warteschlange | Mit Warteschlange |
|----------|-------------------|-------------------|
| Benachrichtigung nach Bestellung | Bestell-API ruft synchron den Benachrichtigungsdienst auf; Benachrichtigungsfehler führt zu Bestellfehler | Nach erfolgreicher Bestellung Nachricht senden; Benachrichtigungsdienst verarbeitet asynchron |
| Flash-Sale | Spontaner Traffic überlastet die Datenbank | Anfragen zuerst in die Warteschlange; Backend verarbeitet nach Kapazität |
| Datensynchronisation | Service A ruft direkt die API von Service B auf | Service A sendet Ereignis; Service B abonniert und verarbeitet |

---

## 4. Abwägungsdenken: Es gibt keine Silberkugel

Die Essenz des Architekturdesigns ist der Trade-off (Abwägung). Jede Entscheidung hat ihren Preis. Der Schlüssel liegt darin, die Kosten zu verstehen und die für die aktuelle Phase passende Wahl zu treffen.

| Abwägungsdimension | Option A | Option B | Entscheidungsgrundlage |
|---------------------|----------|----------|----------------------|
| Konsistenz vs. Verfügbarkeit | Stark konsistent (CP) | Hoch verfügbar (AP) | Kann das Geschäft kurzfristige Inkonsistenz tolerieren? |
| Leistung vs. Kosten | Vollständiges Caching | Bedarfsgesteuertes Caching | Datenmenge und Budget |
| Einfachheit vs. Flexibilität | Monolithische Architektur | Microservices | Teamgröße und Geschäftskomplexität |
| Echtzeit vs. Batch | Stream-Verarbeitung | Batch-Verarbeitung | Anforderungen an Datenaktualität |
| Self-Hosted vs. Managed | Eigenes MySQL | Cloud-Datenbank RDS | Betriebsfähigkeiten und Kosten |

::: tip Architecture Decision Records (ADR)
Jede wichtige Architekturentscheidung sollte dokumentiert werden: **Was war der Hintergrund, welche Optionen wurden erwogen, warum wurde diese gewählt, welche Kosten entstehen**. Dies dient nicht der Schuldzuweisung, sondern ermöglicht es späteren Teams zu verstehen, „warum damals so entschieden wurde".

Das Format ist einfach:
- **Titel**: XXX durch YYY ersetzen
- **Hintergrund**: Welches Problem lag vor
- **Entscheidung**: Welche Option wurde gewählt
- **Begründung**: Warum diese Option
- **Kosten**: Nachteile und Risiken dieser Entscheidung
:::

### Häufige Abwägungsfehler

| Fehler | Ausprägung | Richtige Vorgehensweise |
|--------|-----------|------------------------|
| Frühzeitige Optimierung | Bei 1.000 DAU bereits Sharding betreiben | Zuerst Einzel-DB nutzen; bei Engpässen aufspalten |
| Technologiegetrieben | „Ich will Kafka nutzen" statt „Ich brauche Asynchronität" | Vom Problem ausgehen, nicht von der Technologie |
| Betriebskosten ignorieren | Optimale Lösung gewählt, aber Team kann sie nicht warten | Lösung muss zur Teamfähigkeiten passen |
| Perfekte Konsistenz erzwingen | Verteilte Transaktionen in allen Szenarien | Eventuale Konsistenz reicht für die meisten Szenarien |

---

## 5. Klassische Fälle

Drei klassische Fälle, die die zuvor gelernte Methodik verknüpfen.

### 5.1 URL-Shortener (TinyURL)

Der URL-Shortener ist eine klassische Systemdesign-Aufgabe — klein, aber mit allen wichtigen Aspekten.

**Anforderungsklärung**:
- Kernfunktion: Lange URL → kurze URL (Schreiben), kurze URL → Weiterleitung (Lesen)
- Lese-/Schreibverhältnis: ca. 100:1 (Lesen deutlich mehr als Schreiben)
- Tägliche Weiterleitungen: 100 Millionen
- Kurze URLs verfallen nie

**Kapazitätsschätzung**:

| Metrik | Berechnung | Ergebnis |
|--------|-----------|---------|
| Schreib-QPS | 100 Mio. / 100 / 86.400 | ≈ 12 QPS |
| Lese-QPS | 100 Mio. / 86.400 | ≈ 1.200 QPS |
| Spitzen-Lese-QPS | 1.200 × 3 | ≈ 3.600 QPS |
| 5 Jahre Speicher | 1 Mio./Tag × 365 × 5 × 100 B | ≈ 18 GB |
| Cache (20 %) | 18 GB × 20 % | ≈ 3,6 GB |

**Architekturdesign**:

```
Schreibpfad: Client → API Server → ID-Generator → Base62-Kodierung → MySQL + Redis schreiben
Lesepfad: Client → CDN → API Server → Redis-Abfrage → 302-Weiterleitung
                                   ↓ (Cache Miss)
                                 MySQL-Abfrage → Redis befüllen
```

**Schlüsseldesignentscheidungen**:
- Kurzcode-Generierung: Snowflake verteilte ID + Base62-Kodierung, vermeidet Hash-Kollisionen
- Caching-Strategie: Cache-Aside, Hot-Spot-URLs über CDN beschleunigt
- Datenbank: Einzelne Tabelle ausreichend (18 GB ist klein), Index auf Kurzcode

### 5.2 Feed-Stream-System

Der Feed-Stream sozialer Plattformen (Momente, Startseite von Sozials) ist eine weitere klassische Aufgabe.

**Zentrale Herausforderung**: Ein Nutzer veröffentlicht einen Beitrag — wie sehen ihn alle Follower?

| Ansatz | Vorgehen | Vorteile | Nachteile |
|--------|---------|----------|----------|
| Pull-Modell | Beim Lesen Echtzeit-Aggregation der Beiträge der Gefolgten | Einfaches Schreiben, weniger Speicher | Langsames Lesen, hohe Latenz bei vielen Abonnements |
| Push-Modell | Beim Veröffentlichen in alle Follower-Postfächer geschrieben | Sehr schnelles Lesen | Starke Schreibverteilung bei großen Accounts |
| Push-Pull-Hybrid | Normale Nutzer Push, große Accounts Pull | Balance zwischen Lese- und Schreibleistung | Komplexe Implementierung |

**Push-Pull-Hybrid-Ansatz**:
- Follower < 10.000: Beim Veröffentlichen in alle Follower-Feed-Caches pushen (Push-Modell)
- Follower > 10.000: Kein Push; Follower lesen Echtzeit-Pull (Pull-Modell)
- Beim Öffnen des Feeds: Push-Inhalte + Echtzeit-Pull großer Accounts zusammenführen und chronologisch sortieren

### 5.3 Flash-Sale-System

Die zentrale Herausforderung bei Flash-Sales: extrem hohe gleichzeitige Zugriffe + Bestand darf nicht überverkauft werden.

**Traffic-Charakteristik**:
- Vor Aktionsbeginn: Viele Nutzer aktualisieren die Seite und warten
- Bei Aktionsbeginn: QPS kann 100x über dem Normalwert liegen
- Nach Aktionsende: Traffic fällt schnell ab

**Mehrstufige Lastspitzenabflachung**:

```
Nutzer-Anfrage → CDN (statische Seiten) → Gateway (Rate Limiting) → Nachrichtenwarteschlange (Peak Shaving) → Bestands-Service (Abzug)
```

| Stufe | Strategie | Wirkung |
|-------|----------|---------|
| Frontend | Button deaktivieren + zufällige Verzögerung + CAPTCHA | Bots filtern, Anfragen streuen |
| CDN | Statische Ressourcen cachen | 90 % der Seitenanfragen reduzieren |
| Gateway | Token-Bucket Rate Limiting | Nur Traffic durchlassen, den das System bewältigen kann |
| Nachrichtenwarteschlange | Anfragen einreihen, asynchron verarbeiten | Peak Shaving, Datenbank schützen |
| Bestands-Service | Redis-Vorabzug + Lua-Atomoperationen | Überverkauf verhindern, Antwort im Millisekundenbereich |

::: tip Kernprinzipien von Flash-Sales
1. **Möglichst upstream filtern**: Was am CDN abgefangen werden kann, sollte nicht zur Anwendungsschicht gelangen
2. **Lesen/Schreiben trennen**: Produktdetailseite über Cache, nur die Bestellung geht über die Datenbank
3. **Asynchrone Verarbeitung**: Nach dem Klick auf „Kaufen" sofort „In der Warteschlange" zurückgeben; Hintergrund verarbeitet asynchron
4. **Fallback-Pläne**: Rate Limiting, Circuit Breaker, Degradation — für jede Stufe gibt es einen Plan B
:::

---

## Zusammenfassung

Systemdesign ist eine sehr praxisorientierte Fähigkeit. Der Kern liegt im strukturierten Denken und im Treffen von Abwägungen.

Rückblick auf die wichtigsten Punkte dieses Kapitels:

1. **Vier-Schritte-Rahmen**: Anforderungsklärung → Kapazitätsschätzung → Architekturentwurf → vertiefende Optimierung — kein Schritt darf übersprungen werden
2. **Umschlag-Rückseite-Schätzung**: Keine Präzision nötig, nur die Größenordnung muss bekannt sein, um Architekturentscheidungen zu leiten
3. **Kernmuster**: Caching, Sharding, Nachrichtenwarteschlangen, CDN, Rate Limiting/Circuit Breaker — dies sind die „Bausteine" des Systemdesigns
4. **Abwägungsdenken**: Es gibt keine perfekte Lösung, nur die für die aktuelle Phase passende — den Grund und die Kosten jeder Entscheidung dokumentieren
5. **Klassische Fälle**: URL-Shortener für Grundlagen, Feed-Stream für Push-Pull-Modelle, Flash-Sale für hohe Nebenläufigkeit — wer diese drei beherrscht, kann vieles ableiten

## Weiterführende Literatur

- [System Design Interview](https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF) - Alex Xus Klassiker für Systemdesign-Interviews
- [Designing Data-Intensive Applications](https://dataintensive.net/) - Martin Kleppmanns Design datenintensiver Anwendungen
- [The System Design Primer](https://github.com/donnemartin/system-design-primer) - Umfassendste Systemdesign-Lernressource auf GitHub
- [ByteByteGo](https://bytebytego.com/) - Alex Xus visualisierter Systemdesign-Blog
