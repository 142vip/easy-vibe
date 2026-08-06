# Prinzipien von Rate Limiting und Backpressure

::: tip Vorwort
**Am Black Friday um Mitternacht stürzen sich Hunderte Millionen Nutzer gleichzeitig auf die Seite — halten die Server das aus?** Jedes System hat eine maximale Verarbeitungskapazität. Wenn die Anzahl der Anfragen die Systemkapazität überschreitet und nicht kontrolliert wird, ist das Ergebnis, dass niemand mehr den Dienst nutzen kann. Rate-Limiting und Backpressure sind die zwei Verteidigungslinien, die das System davor schützen, "überlastet" zu werden.
:::

**Was wirst du in diesem Artikel lernen?**

Nach Abschluss dieses Kapitels wirst du Folgendes erhalten:

- **Notwendigkeit des Rate-Limiting**: Verstehen, warum man einen Teil der Anfragen aktiv ablehnen muss, um das System zu schützen
- **Rate-Limiting-Algorithmen**: Die Prinzipien und Unterschiede der drei Kernalgorithmen Token Bucket, Leaky Bucket und Sliding Window beherrschen
- **Backpressure-Mechanismen**: Verstehen, wie vorgegangen wird, wenn die Upstream-Geschwindigkeit die Downstream-Geschwindigkeit übersteigt
- **Mehrstufiges Rate-Limiting**: Die mehrstufige Rate-Limiting-Architektur vom Client über das Gateway bis zum Service kennenlernen
- **Praktische Fähigkeiten**: Wissen, welche Rate-Limiting-Strategie in welchem Szenario gewählt werden sollte

| Kapitel | Inhalt | Kernkonzept |
|-----|------|---------|
| **Kapitel 1** | Warum Rate-Limiting nötig ist | Lawineneffekt, Dienstschutz |
| **Kapitel 2** | Rate-Limiting-Algorithmen | Token Bucket, Leaky Bucket, Sliding Window |
| **Kapitel 3** | Backpressure-Steuerung | Puffer, Verwerfungsstrategien, elastische Skalierung |
| **Kapitel 4** | Mehrstufige Rate-Limiting-Architektur | Client, Gateway, Server |
| **Kapitel 5** | Praxis und Auswahl | Nginx, Redis, Sentinel |

---

## 0. Übersicht: Motivation von muss man Nutzer "ablehnen"

Das klingt kontraintuitiv — sollten wir nicht jeden Nutzer bestmöglich bedienen? Die Realität ist: **Wenn man einen Teil der Anfragen nicht ablehnt, werden alle Anfragen fehlschlagen.**

Stell dir ein Restaurant vor, das nur 100 Personen fassen kann, in das plötzlich 1000 Personen strömen. Ohne Rate-Limiting ist das Ergebnis nicht, dass alle 1000 Personen essen können, sondern dass die Küche zusammenbricht, das Personal paralysiert wird und niemand von den 1000 Personen etwas bekommt. Die richtige Vorgehensweise ist Rate-Limiting am Eingang: 100 Personen hineinlassen, den Rest warten lassen.

::: tip Kernziele des Rate-Limiting
- **Systemschutz**: Verhindern, dass Überlastung zu vollständigem Dienstausfall führt
- **Faire Zuteilung**: Sicherstellen, dass akzeptierte Anfragen normal verarbeitet werden können
- **Graceful Degradation**: Abgewiesene Anfragen erhalten den klaren Statuscode 429 anstelle von Timeouts oder 500-Fehlern
:::

---

## 1. Rate-Limiting-Algorithmen: Drei klassische Ansätze

Die Kernfrage des Rate-Limiting lautet: **Wie viele Anfragen dürfen pro Zeiteinheit maximal passieren?** Die verschiedenen Algorithmen haben jeweils unterschiedliche Kompromisse bei Genauigkeit, Burst-Traffic-Behandlung und Implementierungskomplexität.

<RateLimitAlgorithmDemo />

| Algorithmus | Prinzip | Burst-Traffic | Genauigkeit | Implementierungskomplexität |
|------|------|---------|--------|-----------|
| Token Bucket | Token mit fester Rate generieren, Anfragen verbrauchen Token | Erlaubt (Token-Vorrat im Bucket) | Hoch | Mittel |
| Leaky Bucket | Anfragen reihen sich ein, feste Verarbeitungsrate | Nicht erlaubt (vollständige Glättung) | Hoch | Mittel |
| Sliding Window | Anfragen im Zeitfenster zählen | Teilweise erlaubt | Ziemlich hoch | Niedrig |
| Fixed Window | Zählung nach festen Zeitfenstern | Burst an Fenstergrenzen möglich | Niedrig | Am niedrigsten |

::: tip Welchen Algorithmus wählen?
- **API-Rate-Limiting**: Token Bucket am häufigsten, erlaubt vernünftigen Burst-Traffic
- **Traffic Shaping**: Leaky Bucket eignet sich für Szenarien mit konstanter Ausgangsrate
- **Einfache Zählung**: Sliding Window einfach zu implementieren, geeignet für die meisten Web-Anwendungen
:::

---

## 2. Backpressure-Steuerung: Wenn der Upstream schneller ist als der Downstream

Rate-Limiting löst das Problem "zu viele externe Anfragen", während **Backpressure** das Problem löst, dass "interne Komponenten unterschiedliche Geschwindigkeiten haben".

Wenn der Produzent Daten schneller erzeugt, als der Konsument sie verarbeiten kann, schwillt der dazwischenliegende Puffer kontinuierlich an, was schließlich zu Speicherüberlauf oder Datenverlust führt. Der Backpressure-Mechanismus ermöglicht es dem Konsumenten, den Produzenten "rückwärts zu benachrichtigen", langsamer zu werden.

<BackpressureDemo />

::: tip Vier Backpressure-Strategien
1. **Verwerfen (Drop)**: Bei vollem Puffer neue oder alte Daten verwerfen, geeignet für Szenarien mit hoher Echtzeitanforderung, bei denen Datenverlust tolerierbar ist
2. **Blockieren (Block)**: Den Produzenten anhalten, bis der Konsument aufgeholt hat, geeignet für Szenarien, in denen keine Daten verloren gehen dürfen
3. **Sampling**: Nur einen Teil der Daten verarbeiten, geeignet für hochfrequente Datenströme
4. **Elastische Skalierung (Scale)**: Dynamisch die Anzahl der Konsumenten erhöhen, geeignet für Cloud-Native-Umgebungen
:::

---

## 3. Mehrstufige Rate-Limiting-Architektur

In Produktionsumgebungen reicht Rate-Limiting an einem einzigen Punkt nicht aus — es bedarf einer **mehrstufigen Verteidigung**, wobei jede Ebene Probleme unterschiedlicher Granularität löst.

| Ebene | Position | Rate-Limiting-Granularität | Tools |
|------|------|---------|------|
| Client | Frontend/App | Button-Debouncing, Request-Throttling | lodash.throttle, debounce |
| CDN/WAF | Edge-Knoten | IP-Ebene, Region-Ebene | Cloudflare Rate Limiting |
| API-Gateway | Eingangs-Gateway | Route-Ebene, Benutzer-Ebene | Nginx limit_req, Kong |
| Server | Anwendungsintern | Interface-Ebene, Ressourcen-Ebene | Sentinel, Resilience4j |
| Datenbank | Speicherschicht | Verbindungszahl, QPS | Connection-Pool-Konfiguration, Slow-Query-Circuit-Breaker |

::: tip HTTP-Spezifikation für Rate-Limiting
Abgewiesene Anfragen sollten den Statuscode `429 Too Many Requests` zurückgeben und folgende Response-Header enthalten:
- `Retry-After`: Empfehlung, wie lange der Client warten soll, bevor er es erneut versucht (Sekunden oder Datum)
- `X-RateLimit-Limit`: Rate-Limiting-Obergrenze
- `X-RateLimit-Remaining`: Verbleibendes Kontingent
- `X-RateLimit-Reset`: Zeitpunkt der Kontingent-Zurücksetzung
:::

---

## 4. Praxis und Auswahl

| Szenario | Empfohlene Lösung | Beschreibung |
|------|---------|------|
| Nginx-Eingangs-Rate-Limiting | `limit_req_zone` | Basierend auf dem Leaky-Bucket-Algorithmus, einfache Konfiguration |
| Verteiltes Rate-Limiting | Redis + Lua-Skripte | Token Bucket oder Sliding Window, zählerübergreifend über mehrere Instanzen |
| Java-Microservices | Sentinel / Resilience4j | Unterstützt Circuit-Breaking, Degradation, Hotspot-Rate-Limiting |
| Node.js-API | express-rate-limit | Einfach zu verwenden, unterstützt Redis-Speicher |
| Go-Services | golang.org/x/time/rate | Standardbibliothek-Token-Bucket-Implementierung |

---

## Zusammenfassung

Rate-Limiting und Backpressure sind zwei kritische Verteidigungslinien zum Schutz der Systemstabilität. Rate-Limiting kontrolliert die Geschwindigkeit des einströmenden externen Traffics, Backpressure koordiniert die Verarbeitungsgeschwindigkeit interner Komponenten.

Wichtige Erkenntnisse dieses Kapitels:

1. **Notwendigkeit des Rate-Limiting**: Ohne Ablehnung eines Teils der Anfragen werden alle Anfragen fehlschlagen
2. **Drei Kernalgorithmen**: Token Bucket (erlaubt Burst), Leaky Bucket (vollständige Glättung), Sliding Window (einfach und präzise)
3. **Backpressure-Mechanismen**: Verwerfen, Blockieren, Sampling, Skalierung — vier Strategien
4. **Mehrstufige Verteidigung**: Vom Client bis zur Datenbank löst jede Ebene Probleme unterschiedlicher Granularität
5. **429-Spezifikation**: Bei Rate-Limiting Standard-Statuscode und Rate-Limiting-Header-Informationen zurückgeben

## Weiterführende Literatur

- [Stripes Rate-Limiting-Praxis](https://stripe.com/blog/rate-limiters) - Rate-Limiting-Design in Zahlungssystemen
- [Nginx limit_req Dokumentation](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html) - Nginx Rate-Limiting-Modul
- [Alibaba Sentinel](https://sentinelguard.io/) - Traffic-Control-Komponente für verteilte Services
- [Resilience4j](https://resilience4j.readme.io/) - Leichtgewichtige Fehlertoleranz-Bibliothek für Java
- [Token Bucket Algorithmus erklärt](https://en.wikipedia.org/wiki/Token_bucket) - Die mathematischen Grundlagen des Token-Bucket-Algorithmus
