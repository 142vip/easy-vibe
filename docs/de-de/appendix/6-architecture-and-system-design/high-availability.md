# Hochverfügbarkeit: Ausfallsicherheit

::: tip Einleitung
**Ein Systemausfall von nur einer Minute kann Verluste in Hunderttausenden bedeuten.** Hochverfügbarkeit (High Availability) bezeichnet die Fähigkeit eines Systems, bei Hardwareausfällen, Software-Bugs, Netzwerkproblemen und anderen Störungen weiterhin Dienste bereitzustellen. Katastrophenwiederherstellung (Disaster Recovery) umfasst die Fähigkeit, den Dienst nach großräumigen Katastrophen wiederherzustellen.
:::

**Was werden Sie in diesem Artikel lernen?**

Nach Abschluss dieses Kapitels werden Sie Folgendes beherrschen:

- **Verfügbarkeitsmetriken**: Die Bedeutung von „wie viele Neuner" und die entsprechenden Ausfallzeiten verstehen
- **Failover**: Active-Standby, Active-Active und Multi-Site-Hochverfügbarkeitsarchitekturen beherrschen
- **Katastrophenwiederherstellungsstrategien**: Die Konzepte RPO und RTO sowie Entwurfsmethoden kennenlernen
- **Fehlererkennung**: Mechanismen wie Heartbeat, Probes und Circuit Breaker zur Fehlerentdeckung verstehen
- **Chaos Engineering**: Verstehen, wie man aktiv Fehler injiziert, um die Systemresilienz zu verifizieren

| Kapitel | Inhalt | Kernkonzepte |
|---------|--------|--------------|
| **Kapitel 1** | Verfügbarkeitsmetriken | SLA, Neuner-Grade, Ausfallzeiten |
| **Kapitel 2** | Failover-Architektur | Active-Standby, Active-Active, Multi-AZ, Multi-Region Active-Active |
| **Kapitel 3** | Disaster-Recovery-Design | RPO, RTO, Backup-Strategien |
| **Kapitel 4** | Fehlererkennung und -wiederherstellung | Heartbeat, Circuit Breaker, automatische Skalierung |
| **Kapitel 5** | Chaos Engineering | Fehlerinjektion, Resilienzvalidierung |

---

## 1. Verfügbarkeitsmetriken: Überblick über bedeuten die „Neuner"

Verfügbarkeit wird üblicherweise in „Neunern" gemessen. Die Berechnungsformel lautet:

**Verfügbarkeit = Betriebszeit / Gesamtzeit x 100 %**

Beispiel: Bei einer Ausfallzeit von 43 Minuten in einem Monat (30 Tage = 43.200 Minuten) beträgt die Verfügbarkeit (43.200 - 43) / 43.200 ≈ 99,9 %. Mit jedem zusätzlichen Neuner verringert sich die erlaubte Ausfallzeit um eine Größenordnung, während Implementierungsaufwand und Kosten exponentiell steigen.

| Verfügbarkeitsstufe | Prozent | Erlaubte monatliche Ausfallzeit | Erlaubte jährliche Ausfallzeit | Typische Anforderung |
|---------------------|---------|--------------------------------|-------------------------------|---------------------|
| 2 Neuner | 99 % | 7,3 Stunden | 3,65 Tage | Interne Werkzeuge |
| 3 Neuner | 99,9 % | 43 Minuten | 8,76 Stunden | Normale Geschäftssysteme |
| 4 Neuner | 99,99 % | 4,3 Minuten | 52,6 Minuten | E-Commerce, SaaS |
| 5 Neuner | 99,999 % | 26 Sekunden | 5,26 Minuten | Finanzen, Zahlungen |

<AvailabilityCalculatorDemo />

::: tip Was ist eine SLA?
Eine **SLA (Service Level Agreement, Service-Vereinbarung)** ist die formelle Zusage des Dienstanbieters gegenüber dem Kunden. Zum Beispiel garantiert AWS S3 eine Verfügbarkeit von 99,99 % — wird dieser Wert nicht erreicht, erfolgt eine anteilige Rückerstattung. Eine SLA ist nicht nur eine technische Kennzahl, sondern ein kommerzieller Vertrag — eine SLA-Verletzung bedeutet Geldverlust.
:::

::: tip Die Kluft zwischen 3 und 4 Neunern
3 Neuner (99,9 %) bedeuten eine erlaubte monatliche Ausfallzeit von 43 Minuten — ein Deployment-Problem und ein Rollback verbrauchen diese Zeit bereits.
4 Neuner (99,99 %) bedeuten nur noch 4 Minuten Ausfallzeit pro Monat — dies erfordert ein vollständiges Hochverfügbarkeitssystem mit automatischem Failover, Rolling Deployments und Health Checks.
:::

---

## 2. Failover-Architektur

Failover ist der Kernmechanismus der Hochverfügbarkeit: Fällt der primäre Knoten aus, wird automatisch auf einen Ersatzknoten umgeschaltet, um den Dienst fortzusetzen.

### Active-Standby-Modus

Die häufigste Hochverfügbarkeitsarchitektur. Der primäre Knoten verarbeitet alle Anfragen, der Standby-Knoten synchronisiert Daten in Echtzeit, verarbeitet aber keine Anfragen. Fällt der primäre Knoten aus, übernimmt der Standby-Knoten automatisch.

```
Normalbetrieb:
  Client → Primärer Knoten (verarbeitet Anfragen)
            Standby-Knoten (synchronisiert Daten, Bereitschaft)

Failover:
  Client → Standby-Knoten (übernimmt als neuer Primärer)
            Ursprünglicher Primärer (ausgefallen, wartet auf Reparatur)
```

Das kritische Problem ist **Split-Brain**: Bei einer Netzwerkpartition denken beide Knoten, dass der andere ausgefallen ist, und bieten gleichzeitig Dienste an, was zu Dateninkonsistenzen führt. Die Lösung ist die Einführung eines **Quorum-Knotens** — mindestens 3 Knoten stimmen darüber ab, wer der Primäre ist.

### Multi-AZ (Mehrere Verfügbarkeitszonen)

Der Dienst wird in mehreren Rechenzentren (Verfügbarkeitszonen) derselben Region bereitgestellt. Ein einzelner Rechenzentrumsausfall durch Strom- oder Netzwerkausfall beeinträchtigt den Gesamtdienst nicht. Die Verfügbarkeitszonen der Cloud-Anbieter sind in der Regel über Niedriglatenz-Verbindungen (< 2 ms) verbunden.

### Multi-Region Active-Active

Vollständige Dienstreplikas werden in verschiedenen Städten oder sogar verschiedenen Ländern bereitgestellt, wobei jeder Standort Anfragen unabhängig verarbeiten kann. Dies ist die höchste Stufe der Hochverfügbarkeitsarchitektur, aber auch die komplexeste — die zentrale Herausforderung ist die Latenz und Konsistenz der **regionsübergreifenden Datensynchronisation**.

<FailoverStrategyDemo />

| Architektur | Verfügbarkeitsstufe | Kosten | Komplexität | Anwendungsbereich |
|-------------|-------------------|--------|-------------|-------------------|
| Einzelplatz | 99 % ~ 99,9 % | Niedrig | Niedrig | Entwicklung/Test, interne Werkzeuge |
| Active-Standby | 99,9 % ~ 99,99 % | Mittel | Mittel | Kleine bis mittlere Geschäftssysteme |
| Multi-AZ | 99,99 % | Hoch | Hoch | E-Commerce, SaaS-Plattformen |
| Multi-Region Active-Active | 99,999 % | Sehr hoch | Sehr hoch | Finanzen, großes Internet |

---

## 3. Disaster-Recovery-Design: RPO und RTO

Das Katastrophenwiederherstellungs-Design basiert auf zwei Kernmetriken:

| Metrik | Vollständige Bezeichnung | Bedeutung | Beispiel |
|--------|-------------------------|-----------|---------|
| RPO | Recovery Point Objective | Wie viel Datenverlust toleriert werden kann | RPO=0 bedeutet, dass keine Daten verloren gehen dürfen |
| RTO | Recovery Time Objective | Wie lange eine Ausfallzeit toleriert werden kann | RTO=5 Min bedeutet Wiederherstellung innerhalb von 5 Minuten |

### Zusammenhang zwischen Backup-Strategie und RPO

| Backup-Methode | RPO | Kosten | Beschreibung |
|---------------|-----|--------|-------------|
| Tägliche Vollsicherung | 24 Stunden | Niedrig | Maximal ein Tag Datenverlust |
| Kontinuierliche inkrementelle Sicherung | Minutenbereich | Mittel | Fortlaufende binlog/WAL-Synchronisation |
| Synchrone Replikation | 0 | Hoch | Schreibvorgang muss auf Replika bestätigt werden |

::: tip Nicht alle Daten benötigen RPO=0
Ein verlorenes Benutzerprofilbild kann neu hochgeladen werden (RPO=24 h reicht), aber ein Zahlungsdatensatz darf auf keinen Fall verloren gehen (RPO=0). Die Backup-Strategie sollte sich nach dem geschäftlichen Wert der Daten richten, nicht nach dem Gießkannenprinzip.
:::

---

## 4. Fehlererkennung und -wiederherstellung

### 4.1 Fehlererkennungsmechanismen

| Mechanismus | Prinzip | Erkennungsgeschwindigkeit | Anwendungsbereich |
|------------|---------|--------------------------|-------------------|
| Heartbeat-Erkennung | Regelmäßiges Senden von Heartbeat-Paketen, Zeitüberschreitung signalisiert Fehler | Sekundenbereich | Knoten-Lebendigkeitserkennung |
| Health Check | HTTP/TCP-Probe prüft Dienststatus | Sekundenbereich | Backend-Erkennung durch Load Balancer |
| Business-Probe | Simuliert echte Anfragen zur Prüfung der Geschäftslogik | Sekunden bis Minuten | End-to-End-Verfügbarkeitsüberwachung |

**Funktionsweise der Heartbeat-Erkennung**: Knoten A sendet in regelmäßigen Abständen (z. B. alle 5 Sekunden) ein „Ich lebe noch"-Signal an den Monitor. Wenn N-mal (z. B. 3-mal) hintereinander kein Heartbeat empfangen wird, wird Knoten A als ausgefallen markiert. Die kritischen Parameter sind **Heartbeat-Intervall** und **Zeitschwellenwert** — ein zu kurzes Intervall erhöht den Netzwerk-Overhead, ein zu langes verzögert die Fehlererkennung.

**Drei Stufen von Health Checks**:
- **Liveness Probe**: Läuft der Prozess noch? Wenn nicht, Neustart
- **Readiness Probe**: Kann der Dienst Anfragen annehmen? Wenn nicht, aus dem Load Balancer entfernen
- **Startup Probe**: Ist der Dienst vollständig gestartet? Wenn nicht, warten und nicht fälschlicherweise als Fehler bewerten

### 4.2 Automatische Wiederherstellungsmechanismen

| Mechanismus | Beschreibung | Typische Werkzeuge |
|------------|-------------|-------------------|
| Automatischer Neustart | Abgestürzte Prozesse automatisch wieder starten | systemd, PM2, K8s |
| Automatische Skalierung | Bei steigender Last automatisch Instanzen hinzufügen | K8s HPA, Cloud Auto Scaling |
| Circuit Breaker / Degradation | Bei Downstream-Fehlern schnelles Versagen, Kaskadenausfälle verhindern | Hystrix, Sentinel, Resilience4j |
| Rate Limiting | Anfragen oberhalb der Kapazität direkt ablehnen | Nginx limit_req, Gateway Rate Limiting |

**Circuit-Breaker-Muster (Leistungsschalter) im Detail**:

Der Circuit Breaker ist inspiriert von Sicherungen in elektrischen Schaltkreisen — bei Überstrom wird automatisch unterbrochen, um den gesamten Stromkreis vor dem Durchbrennen zu schützen. In Microservices „öffnet" der Circuit Breaker, wenn ein Downstream-Dienst ausfällt, sodass Anfragen schnell fehlschlagen, anstatt auf Timeouts zu warten.

```
Drei Zustände des Circuit Breakers:

  Geschlossen (normal) ──→ Fehlerrate über Schwellenwert ──→ Geöffnet (unterbrochen)
       ↑                                                    │
       │                                              Abkühlzeit warten
       │                                                    ↓
       └── Testanfrage erfolgreich ←── Halboffen (Testphase)
```

- **Geschlossen**: Anfragen werden normal weitergeleitet, gleichzeitig wird die Fehlerrate statistisch erfasst
- **Geöffnet**: Alle Anfragen kehren sofort mit einem Fehler zurück (schnelles Versagen), Downstream wird nicht mehr aufgerufen
- **Halboffen**: Nach Ablauf der Abkühlzeit werden wenige Testanfragen durchgelassen. Bei Erfolg Rückkehr zu „Geschlossen"; bei Fehler weiterhin „Geöffnet"

**Fallback (Degradation)** ist die Begleitstrategie zum Circuit Breaker: Nach Auslösung des Circuit Breakers wird nicht einfach ein Fehler zurückgegeben, sondern ein „Notfall"-Ergebnis. Zum Beispiel: Ist der Empfehlungsdienst ausgefallen, wird eine Liste beliebter Produkte zurückgegeben; schlägt das Laden des Benutzerprofilbildes fehl, wird ein Standardbild angezeigt.

---

## 5. Chaos Engineering: Proaktiv Probleme finden

Die Kernidee des Chaos Engineerings ist: **Anstatt auf Fehler zu warten, diese aktiv zu erzeugen** und die Systemresilienz in einer kontrollierten Umgebung zu verifizieren.

| Werkzeug | Urheber | Kernfähigkeit |
|----------|---------|--------------|
| Chaos Monkey | Netflix | Zufälliges Beenden von Instanzen in der Produktionsumgebung |
| Chaos Mesh | PingCAP | Fehlerinjektion in K8s-Umgebungen |
| Litmus | CNCF | Cloud-natives Chaos-Engineering-Framework |
| ChaosBlade | Alibaba | Fehlerinjektionswerkzeug für verschiedene Szenarien |

::: tip Implementierungsschritte für Chaos Engineering
1. **Steady State definieren**: Die Metriken des normalen Systembetriebs klar definieren (z. B. P99-Latenz < 200 ms)
2. **Hypothese aufstellen**: Wenn ein Knoten ausfällt, sollte sich das System innerhalb von 30 Sekunden automatisch erholen
3. **Fehler injizieren**: In kontrolliertem Rahmen Fehler erzeugen (zuerst in der Testumgebung, dann in der Produktion)
4. **Ergebnisse beobachten**: Erholt sich das System wie erwartet? Gibt es Kaskadenausfälle?
5. **Schwachstellen beheben**: Nach der Entdeckung von Problemen Architektur und Prozesse verbessern
:::

---

## Zusammenfassung

Hochverfügbarkeit ist kein Feature, sondern eine Architekturfähigkeit. Sie muss in jeder Phase — Design, Entwicklung, Bereitstellung und Betrieb — abgesichert werden.

Rückblick auf die wichtigsten Punkte dieses Kapitels:

1. **Neuner-Grade**: Jeder zusätzliche Neuner verringert die erlaubte Ausfallzeit um eine Größenordnung, Kosten und Komplexität steigen exponentiell
2. **Failover**: Von Active-Standby bis Multi-Region Active-Active — die geeignete Architektur nach Geschäftsanforderungen wählen
3. **RPO und RTO**: Backup- und Wiederherstellungsstrategien nach Datenwert und geschäftlicher Toleranz entwerfen
4. **Automatisierung**: Fehlererkennung, automatische Neustarts, Circuit Breaker und Degradation sind die Infrastruktur der Hochverfügbarkeit
5. **Chaos Engineering**: Aktive Fehlerinjektion zur Validierung der Systemresilienz in einer kontrollierten Umgebung

## Weiterführende Literatur

- [Site Reliability Engineering](https://sre.google/sre-book/table-of-contents/) - Google SRE Klassiker
- [Chaos Monkey](https://netflix.github.io/chaosmonkey/) - Netflix Chaos Engineering Werkzeug
- [Release It!](https://pragprog.com/titles/mnee2/release-it-second-edition/) - Entwurfsmuster für Produktionsumgebungen
- [Chaos Mesh](https://chaos-mesh.org/) - K8s Chaos-Engineering-Plattform
