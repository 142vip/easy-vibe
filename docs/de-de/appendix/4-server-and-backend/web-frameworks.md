# Web-Frameworks: Anwendungsgerüste
::: tip 🎯 Kernfrage
**Der Code ist geschrieben – wie machst du ihn für die ganze Welt zugänglich?** Das ist, als würdest du dich fragen: Willst du einen kleinen Imbissstand eröffnen oder eine internationale Restaurantkette betreiben? Die Wahl der Backend-Architektur entscheidet darüber, wie viele Kunden dein „Restaurant" bedienen kann.
:::

---

## 1. Warum sollte man die Architekturentwicklung verstehen

Stell dir vor, du planst eine lange Reise. Du kannst mit dem Fahrrad fahren, das Auto nehmen, den Hochgeschwindigkeitszug oder das Flugzeug. Jedes Verkehrsmittel hat seinen passenden Anwendungsfall: Das Fahrrad eignet sich für kurze Strecken, wenn du dich bewegen willst, das Flugzeug für Langstrecken über Kontinente hinweg.

**Genauso verhält es sich mit der Wahl der Backend-Architektur.**

Seit den Anfängen des Internets hat die Backend-Architektur mehrere tiefgreifende Veränderungen durchlaufen. Jede dieser Veränderungen diente nicht dem „Trend-Hopping", sondern der Lösung spezifischer Probleme jener Zeit:

| Zeitraum | Kernproblem                                              | Architekturentwicklung            |
| -------- | -------------------------------------------------------- | --------------------------------- |
| 1990er   | Wie bringt man eine Website überhaupt zum Laufen?        | Physische Server                  |
| 2000er   | Wie wartet man immer chaotischer werdenden Code?         | Monolithische Architektur + MVC   |
| 2010er   | Wie skaliert und kollaboriert man bei riesigen Systemen? | Microservices + Containerisierung |
| 2020er   | Wie senkt man Betriebskosten und Komplexität?            | Serverless + Cloud Native         |

::: tip 📊 Was kannst du aus dieser Tabelle ablesen?
Lass uns die Tabelle Zeile für Zeile interpretieren:

**1990er → 2000er**: Von „Hauptsache, es läuft" zu „Es muss wartbar sein". Websites entwickelten sich von statischen Seiten zu dynamischen Anwendungen, die Codebasis explodierte – eine bessere Organisation wurde nötig.

**2000er → 2010er**: Von „Einzelrechner" zu „Verteilte Systeme". Die Nutzerzahlen wuchsen explosionsartig, ein einzelner Server reichte nicht mehr aus. Systeme mussten aufgeteilt und horizontal skaliert werden.

**2010er → 2020er**: Von „Selber betreiben" zu „Cloud-Dienste". Container und Microservices waren zwar mächtig, aber die Betriebskosten zu hoch. Serverless erlaubt Entwicklern, sich nur noch auf die Geschäftslogik zu konzentrieren.

**Kernerkenntnis**: Architekturentwicklung ist kein Spiel mit Technologie-Entscheidungen, sondern ein Prozess zur **Lösung realer Probleme**. Jede Phase hat ihren passenden Anwendungsfall. Es gibt nicht „die beste Architektur", sondern nur „die am besten passende Architektur".
:::

**Die Bedeutung des Verständnisses der Architekturentwicklung:**

1. **Das Rad nicht neu erfinden**: Viele „neue" Konzepte existierten in Grundzügen schon vor Jahrzehnten. Das Verständnis der Geschichte lässt dich auf den Schultern von Giganten stehen.
2. **Fundierte Technologie-Entscheidungen treffen**: Es gibt nicht die beste Architektur, sondern nur die, die am besten zur aktuellen Phase passt.
3. **Die Abwägungen hinter Technologien verstehen**: Jede Architekturentwicklung ist ein Kompromiss zwischen **Entwicklungseffizienz**, **Systemleistung** und **Betriebskomplexität**.
4. **Technologietrends antizipieren**: Geschichte reimt sich immer. Die Muster der Vergangenheit zu verstehen, hilft, die zukünftige Richtung zu erfassen.

<EvolutionIntroDemo />

---

## 2. Die Ära der physischen Server (1990er)

### 2.1 Was ist ein physischer Server

In den Anfängen des Internets war das Backend ein **physischer Server** (ein echter Computer), der in einem Rechenzentrum stand.

::: tip 💡 Einfache Erklärung
Ein **physischer Server** ist wie dein Desktop-PC zu Hause, aber er:

- läuft 24/7 ohne Unterbrechung
- steht in einem speziellen Rechenzentrum (mit Klimaanlage, USV, Brandschutzsystemen)
- hat eine schnellere Netzwerkanbindung (Glasfaser auf Enterprise-Niveau)
- hat eine feste öffentliche IP-Adresse (weltweit erreichbar)

Das ist wie der Unterschied zwischen deiner Küche und einem Restaurant: Zu Hause kochst du gelegentlich, ein Restaurant ist eine professionelle Küche, rund um die Uhr geöffnet, mit professioneller Ausstattung.
:::

### 2.2 Kernmerkmale

- **Einzelrechner-Deployment**: Alle Anwendungen laufen auf einer einzigen physischen Maschine
- **Manueller Betrieb**: Hardware muss von Hand eingebaut, verkabelt und das System installiert werden
- **Vertikale Skalierung**: Bei Leistungsengpässen kann nur eine stärkere Maschine gekauft werden

::: details 🔧 Vertikale Skalierung vs. Horizontale Skalierung
**Vertikale Skalierung** (Scale Up): Die Konfiguration eines einzelnen Servers aufrüsten (mehr CPU, mehr RAM, schnellere Festplatten).

**Horizontale Skalierung** (Scale Out): Mehr Server hinzufügen und sie zusammenarbeiten lassen.

**Metapher**:

- Vertikale Skalierung: Ein kleines Restaurant in ein großes umbauen, luxuriöser einrichten – aber es gibt immer noch nur einen Koch
- Horizontale Skalierung: Eine Kette eröffnen, jedes Lokal ist klein, aber es gibt 100 Filialen

**Vor- und Nachteile**:

- Vertikale Skalierung ist einfach, hat aber eine Obergrenze (High-End-Server sind teuer und physikalisch begrenzt)
- Horizontale Skalierung ist theoretisch unbegrenzt, erfordert aber Lösungen für Datenkonsistenz
:::

### 2.3 Schmerzpunkte

- **Langsam**: Jede Code-Änderung musste manuell hochgeladen und der Server neu gestartet werden
- **Teuer**: Skalierung bedeutete, eine größere Maschine zu kaufen (vertikale Skalierung)
- **Schwer skalierbar**: Eine Maschine musste alle Anfragen bewältigen. War die CPU ausgelastet, hieß es: anstellen.

<PhysicalServerDemo />

### 2.4 Vor- und Nachteile der physischen Server-Ära

| Dimension               | Bewertung                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Vorteile**            | Volle Hardware-Kontrolle, vorhersagbare Leistung; kein Virtualisierungs-Overhead; physische Datenisolation, hohe Sicherheit           |
| **Nachteile**           | Lange Beschaffungszyklen (Wochen); hohe Vorabinvestitionen (CapEx); geringe Ressourcenauslastung; schwierige Erweiterung              |
| **Geeignete Szenarien** | Finanzkernsysteme, sensible Regierungssysteme, Szenarien mit strengen Anforderungen an Datenhoheit                                    |

::: tip 💡 CapEx vs. OpEx
**CapEx** (Capital Expenditure): Investitionsausgaben – einmalige hohe Ausgaben für Hardware-Kauf.

**OpEx** (Operating Expenditure): Betriebsausgaben – nutzungsabhängige Zahlung (z.B. Cloud-Server).

**Metapher**:

- CapEx: Eine Immobilie kaufen, einmalig Hunderttausende zahlen, danach nur noch Nebenkosten
- OpEx: Mieten, monatlich Miete zahlen, keine große Einmalzahlung

**Bedeutung im Cloud-Zeitalter**: Serverless und Cloud-Dienste ermöglichen immer mehr Unternehmen den Wechsel von CapEx zu OpEx und senken die Hürde für Gründungen.
:::

---

## 3. Die Ära der monolithischen Architektur (2000er)

### 3.1 Was ist eine monolithische Architektur

Mit dem Aufkommen von Frameworks (Rails / Django / Spring) packte man alle Funktionen in eine einzige Anwendung.

::: tip 💡 Einfache Erklärung
**Monolithische Architektur** (Monolith) ist wie ein großes Einkaufszentrum:

- Kleidungs-, Lebensmittel- und Elektronikabteilung sind alle im selben Gebäude
- Alle Mitarbeiter arbeiten im selben Verwaltungssystem
- Fällt der Strom im ganzen Gebäude aus, schließen alle Bereiche

Microservices hingegen sind wie eine Einkaufsstraße: Jedes Geschäft arbeitet unabhängig. Schließt eines, bleiben die anderen geöffnet.
:::

<MonolithDemo />

### 3.2 Kernmerkmale

- **Einheitliche Codebasis**: Alle Funktionsmodule befinden sich im selben Projekt
- **Gemeinsame Datenbank**: Alle Module nutzen dieselbe Datenbank
- **Einheitliches Deployment**: Die gesamte Anwendung wird als Ganzes paketiert und deployed

### 3.3 Vorteile

- **Einfache Entwicklung**: Ein Projekt für alle Funktionen
- **Einfaches Deployment**: Ein großes Paket auf den Server werfen – fertig
- **Einfaches Debugging**: Lokal starten und alle Funktionen debuggen

### 3.4 Schmerzpunkt: Der Dominoeffekt

Stell dir vor, der Koch, der das Gemüse schneidet, schneidet sich versehentlich in den Finger (ein Bug im Code). Die gesamte Küche muss anhalten, um die Wunde zu versorgen – alle Gäste warten vergeblich auf ihr Essen.

Das ist das größte Risiko einer monolithischen Architektur: **schlechte Isolation**.

::: details 🚨 Ein realer Dominoeffekt-Fall
Ein E-Commerce-Unternehmen am Singles' Day (11.11.):

- Der Bestellservice wirft eine Exception wegen eines Preisfehlers bei einem Produkt
- Die Exception wird nicht richtig abgefangen, der Thread-Pool erschöpft sich
- Alle nachfolgenden Anfragen (Produktansicht, Suche, Benutzer-Login) werden blockiert
- Die gesamte Website ist für eine Stunde komplett lahmgelegt

**Mit Microservices hingegen**:

- Der Bestellservice fällt aus, aber Produktansicht, Suche und Login funktionieren weiter
- Nutzer können zumindest weiter stöbern, der Schaden wird minimiert
:::

### 3.5 Vor- und Nachteile sowie geeignete Szenarien des Monolithen

| Dimension                    | Bewertung                                                                                                                                                                                    |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vorteile**                 | Einfache Entwicklung ohne verteilte Komplexität; einfaches Debugging, lokal alles testbar; einfaches Deployment, ein Paket genügt; einfaches Transaktionsmanagement, ACID mit einer Datenbank |
| **Nachteile**                | Hohe Code-Kopplung, Code-Blähung mit wachsendem Geschäft; einheitlicher Tech-Stack, schwer lokal upzugraden; schwere Skalierung, nur als Ganzes; schlechte Fehlerisolation; geringe Team-Effizienz, viele arbeiten an derselben Codebasis |
| **Geeignete Szenarien**      | MVP-Validierung in Startups, kleine Teams (<10 Personen), einfache Geschäftslogik, wenn Liefergeschwindigkeit wichtiger als Skalierbarkeit ist                                                |
| **Ungeeignete Szenarien**    | Große Teams mit paralleler Entwicklung, häufige Releases verschiedener Module, wenn bestimmte Module unabhängig skaliert werden müssen                                                        |

::: tip 🎯 Empfehlung für Einsteiger
Wenn du Backend-Entwicklung lernst, **beginne unbedingt mit einer monolithischen Architektur**:

1. **Erst laufen lernen**: Verstehe HTTP, Datenbanken und die grundlegende MVC-Architektur
2. **Dann ans Rennen denken**: Wenn das Projekt wirklich auf Skalierungsprobleme stößt, ziehe Microservices in Betracht
3. **Over-Engineering vermeiden**: Die „Microservices" vieler Unternehmen sind in Wahrheit „verteilte Monolithen" – noch schwerer zu warten

**Lernpfad**:

- Phase 1: Eine vollständige monolithische Anwendung mit Spring Boot / Django / Rails schreiben
- Phase 2: Bei Performance-Engpässen 1–2 Services herauslösen
- Phase 3: Wenn das Team >50 Personen umfasst und das System wirklich komplex ist, vollständig auf Microservices umstellen
:::

### 3.6 Technologie-Stack der monolithischen Architektur

| Sprache/Framework               | Eigenschaften                                    | Beispielunternehmen              |
| ------------------------------- | ------------------------------------------------ | -------------------------------- |
| **Java + Spring**               | Enterprise-Entwicklung erster Wahl, reifes Ökosystem | Alibaba, JD.com                  |
| **PHP + Laravel/ThinkPHP**      | Schnelle Entwicklung, geeignet für kleine/mittlere Projekte | Facebook (früh), Weibo           |
| **Python + Django/Flask**       | Hohe Entwicklungseffizienz, ideal für schnelle Prototypen | Instagram, Pinterest             |
| **Ruby on Rails**               | Convention over Configuration, Startup-Favorit   | GitHub, Twitter (früh)           |
| **Node.js + Express**           | Einheitliche Sprache für Frontend und Backend, I/O-intensive Szenarien | Netflix, Uber                    |

---

## 4. Containerisierung und Microservices (2010er)

### 4.1 Warum braucht man Microservices

Die Schmerzpunkte der monolithischen Architektur brachen in den 2010er Jahren geballt aus:

- **Zu große Codebasis**: Ein Projekt mit Millionen Zeilen Code – neue Mitarbeiter brauchten einen Monat, um es zu verstehen
- **Zu langsame Deployments**: Ein Build dauerte 30 Minuten, jedes Release war eine Zitterpartie
- **Zu schwierige Zusammenarbeit**: 100 Entwickler am selben Projekt, tägliche Code-Konflikte
- **Zu teure Skalierung**: Nur der „Chat-Service" musste skaliert werden, aber die ganze Anwendung musste kopiert werden

**Der Kerngedanke von Microservices**: Eine große Anwendung in viele kleine Services aufteilen. Jeder Service:

- wird unabhängig entwickelt und deployed
- hat seine eigene Datenbank
- kommuniziert über APIs

<ContainerDockerDemo />

::: tip 💡 Was ist Docker?
**Docker** ist wie ein „Schiffscontainer":

- Jeder Container enthält eigenständige Ware (Code + Abhängigkeiten + Laufzeitumgebung)
- Egal wohin er transportiert wird (welcher Server), den Container öffnen und direkt loslegen
- Keine Sorge mehr: „Auf dieser Maschine fehlt Python 3.9" oder „Auf jenem Rechner fehlt eine Bibliothek"

**Metapher**:

- Ohne Docker: Bei jedem Umzug Möbel, Elektrogeräte und Kleidung einzeln auf den Lkw laden und im neuen Zuhause wieder einzeln einrichten
- Mit Docker: Alles ist im Container verpackt, der Lkw transportiert ihn direkt, am Ziel abstellen und nutzen

**Kernwert**: „Einmal bauen, überall ausführen."
:::

### 4.2 Technologie-Stack-Zeitstrahl

<TechStackTimelineDemo />

### 4.3 Microservices-Architektur

Um die Probleme des Monolithen zu lösen, teilen wir die große Küche in viele kleine Küchen (Services) auf:

- Ein Service nur für Benutzer
- Ein Service nur für Bestellungen
- Ein Service nur für Zahlungen

<MicroservicesDemo />

### 4.4 Kubernetes-Orchestrierung

Wenn die Zahl der Container Hunderte oder Tausende erreicht, braucht man ein „Hafenleitsystem":

- **Kubernetes (K8s)**: Ordnet Container den passenden Maschinen zu (Scheduling, Skalierung, Rolling Updates)
- **Service Mesh**: Regelt den Verkehr zwischen den Services (Circuit Breaking, Rate Limiting, Retries, Observability)

<KubernetesDemo />

::: tip 💡 Was bedeutet „Orchestrierung"?
**Orchestrierung** (Orchestration) bezeichnet das System zur automatischen Verwaltung großer Container-Mengen.

**Metapher**:

- Ohne K8s: Du verwaltest 100 Container manuell, startest abgestürzte neu, fügst bei hoher Last Maschinen hinzu
- Mit K8s: Du sagst ihm: „Dieser Service soll immer 10 Instanzen haben", und es erledigt automatisch:
  - Container auf Server mit ausreichenden Ressourcen verteilen
  - Abgestürzte Container automatisch neu starten
  - Bei hoher Last automatisch auf 20 Instanzen skalieren
  - Bei Code-Updates: Rolling Update (eine alte Instanz stoppen, eine neue starten, eine nach der anderen ersetzen)

**Kernpunkt**: Microservices sind nicht einfach „aufteilen und fertig" – die wahre Herausforderung liegt in **Governance und Betrieb**.
:::

### 4.5 Vor- und Nachteile von Microservices und Containerisierung

| Dimension                    | Bewertung                                                                                                                                                                                                                          |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vorteile**                 | Unabhängiges Deployment, heterogene Tech-Stacks möglich; Fehlerisolation, ein Service-Absturz betrifft nicht das Gesamtsystem; bedarfsgerechte Skalierung, Hotspot-Services separat skalieren; teamfreundlich, verschiedene Teams für verschiedene Services; kleinere Codebasis, leichter verständlich und wartbar |
| **Nachteile**                | Hohe Komplexität verteilter Systeme (Netzwerk-Latenz, verteilte Transaktionen, Service Discovery); hohe Betriebskosten, erfordert professionelles DevOps-Team; schwieriges Debugging, Probleme müssen über mehrere Services hinweg verfolgt werden; Datenkonsistenz schwer zu garantieren; komplexe Anforderungen an Deployment- und Monitoring-Infrastruktur |
| **Geeignete Szenarien**      | Große Teams (>50 Personen), komplexe Geschäftslogik mit unabhängiger Modul-Evolution, wenn bestimmte Module unabhängig skaliert werden müssen, mehrsprachige Tech-Stacks nötig, Systeme mit hohen Verfügbarkeitsanforderungen        |
| **Ungeeignete Szenarien**    | Kleine Teams, einfache Geschäftslogik, geringes und stabiles Traffic-Volumen, kein professionelles Betriebsteam                                                                                                                     |

::: details ⚠️ Fallstricke bei Microservices
**Fallstrick 1: Der verteilte Monolith**

10 Microservices herausgelöst, aber sie sind eng gekoppelt:

- Service A ruft Service B, Service B ruft Service C, Service C ruft wieder Service A
- Eine Funktionsänderung erfordert Änderungen an 5 Services gleichzeitig
- Beim Deployment müssen sie in bestimmter Reihenfolge deployed werden, sonst schlägt das System fehl

**Das ist schlimmer als ein Monolith**: Du hast die Komplexität eines Monolithen, ohne die Vorteile unabhängiger Deployments von Microservices zu genießen.

**Fallstrick 2: Übermäßige Aufteilung**

Eine Funktion mit nur 100 Zeilen Code wird als eigener Service ausgegliedert:

- 10 Services, jeder nur 100 Zeilen Code
- Der Overhead der Service-Kommunikation (Netzwerk-Serialisierung/Deserialisierung) ist schwerer als die eigentliche Geschäftslogik
- Betriebskosten explodieren: 10 Services müssen deployed, überwacht und mit Logs versehen werden

**Richtiger Ansatz**: Nach funktionaler Kohäsion aufteilen. Ein Microservice sollte eine vollständige Geschäftsfähigkeit repräsentieren (z.B. „Bestellservice", nicht „Bestellung-erstellen-Service" und „Bestellung-abfragen-Service").
:::

### 4.6 Microservices-Technologie-Stack

| Kategorie                  | Technologie/Tool                        | Funktion                                  |
| -------------------------- | --------------------------------------- | ----------------------------------------- |
| **Containerisierung**      | Docker, containerd                      | Anwendungsverpackung und -isolierung      |
| **Orchestrierung**         | Kubernetes, Docker Swarm                | Container-Verwaltung und automatische Skalierung |
| **Service Discovery**      | Consul, etcd, ZooKeeper                 | Service-Registrierung und -Erkennung      |
| **API-Gateway**            | Kong, Zuul, Envoy                       | Einheitlicher Eingang, Routing, Rate Limiting |
| **Konfigurationszentrale** | Apollo, Nacos, Spring Cloud Config      | Zentrale Konfigurationsverwaltung         |
| **Monitoring & Alerting**  | Prometheus, Grafana, ELK                | Metrik-Überwachung und Log-Analyse        |
| **Distributed Tracing**    | Jaeger, Zipkin, SkyWalking              | Verteilte Anfrageverfolgung               |
| **Service Mesh**           | Istio, Linkerd                          | Traffic-Governance und Sicherheit         |

---

## 5. Die Ära von Serverless und Cloud Native (2020er+)

### 5.1 Warum braucht man Serverless

Microservices sind gut, aber Dutzende kleiner Küchen zu unterhalten, ist immer noch anstrengend. Du musst dich fragen:

- Ist die Küche groß genug? (Server-Skalierung)
- Was tun bei Stromausfall? (Hochverfügbarkeit)
- Wie verwaltet man zu viele Container? (Betriebskosten)

<ServerlessDemo />

::: tip 💡 Serverless bedeutet nicht wirklich „keine Server"
**Serverless** bedeutet: „Du musst keine Server verwalten" – nicht, dass es wirklich keine Server gibt.

**Metapher**:

- **Physische Server-Ära**: Du kaufst Land, baust ein Haus, richtest es ein, stellst Köche ein, kaufst Zutaten … alles selbst
- **Cloud-Server-Ära**: Du mietest ein bereits eingerichtetes Restaurant, stellst aber selbst Köche ein und führst den Betrieb
- **Serverless-Ära**: Du entwirfst nur das Menü. In der Cloud gibt es eine Gemeinschaftsküche mit Profiköchen. Du gibst die Bestellung auf, sie kochen, du zahlst pro Nutzung.

**Kernveränderung**:

- Früher: Server kaufen → Umgebung einrichten → Code deployen → Überwachen → Skalieren → Warten
- Heute: Code schreiben → Hochladen → Nach Nutzung bezahlen

**Wie ein Lieferservice**: Du brauchst keine Küche, nur ein Menü – jemand anderes kocht für dich.
:::

### 5.2 Was ist Serverless

**Serverless = FaaS + BaaS**

**FaaS** (Function as a Service):

- Du schreibst nur Funktionen (z.B. „Sende Willkommens-E-Mail bei Benutzerregistrierung")
- Der Cloud-Anbieter führt die Funktion aus und skaliert automatisch
- Typische Vertreter: AWS Lambda, Alibaba Cloud Function Compute

**BaaS** (Backend as a Service):

- Login → Auth0 / Supabase Auth
- Zahlungen → Stripe
- Datenbank → Supabase / Firebase / DynamoDB
- Nachrichten → Kafka / SQS

::: tip 🎯 Geeignete Serverless-Szenarien
**Beste Szenarien**:

1. **Gezeiten-Traffic**: Essensliefer-App – mittags hohes Traffic-Aufkommen, nachts niemand. Serverless stellt mittags automatisch 1000 Maschinen bereit und reduziert sie nachts auf null
2. **Event-gesteuert**: „Nach dem Hochladen eines Bildes automatisch komprimieren"
3. **Schnelle Validierung**: Kleine Teams, MVP, Hackathon-Projekte

**Ungeeignete Szenarien**:

1. **Lange laufende Aufgaben**: Video-Transkodierung (kann 1 Stunde laufen, maximale Ausführungszeit von Funktionen meist 15 Minuten)
2. **Anwendungen mit niedrigen Latenzanforderungen**: Hochfrequenzhandel (Kaltstart-Latenz von Dutzenden Millisekunden bis zu mehreren Sekunden)
3. **Feinjustierte Low-Level-Kontrolle**: Betriebssystem-Kernel-Tuning, direkter GPU-Zugriff
:::

### 5.3 Vor- und Nachteile von Serverless und Cloud Native

| Dimension                    | Bewertung                                                                                                                                                                                                                             |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vorteile**                 | Keine Betriebskosten, Entwickler konzentrieren sich nur auf Geschäftslogik; automatische Skalierung, perfekt für Traffic-Spitzen; Pay-per-Use, Kosten nahe null ohne Traffic; schnelle Markteinführung, globales Deployment in Minuten; integrierte Hochverfügbarkeit, Cloud-Dienste behandeln Failover automatisch |
| **Nachteile**                | Kaltstart-Latenz (Hunderte Millisekunden bis mehrere Sekunden); begrenzte Ausführungsdauer (typisch 5–15 Minuten); schwieriges Debugging, lokale Cloud-Simulation kaum möglich; Vendor-Lock-in-Risiko; ungeeignet für lange laufende oder rechenintensive Aufgaben; Kosten können bei dauerhaft hohem Traffic höher sein als bei traditionellen Lösungen |
| **Geeignete Szenarien**      | Event-gesteuerte Verarbeitung (Bildbearbeitung, Benachrichtigungen); Gezeiten-Traffic-Anwendungen (Kampagnenseiten, Aktionen); schnelle Prototypen-Validierung und MVP; selten genutzte APIs oder Hintergrundjobs; kleine Teams ohne dediziertes Betriebsteam |
| **Ungeeignete Szenarien**    | Anwendungen mit dauerhaft niedrigen Latenzanforderungen; lange Berechnungsaufgaben; kaltstart-empfindliche Szenarien (Hochfrequenzhandel); Szenarien mit feinjustierten Infrastrukturanforderungen |

::: details 💰 Kostenvergleich: Wann ist Serverless teurer?
**Szenario 1: Geringe Zugriffsfrequenz**

- Traditioneller Server: $20/Monat (egal ob jemand zugreift)
- Serverless: 1 Mio. Anfragen × $0,0002/Anfrage = $20 (nur bei Traffic bezahlen)
- **Fazit**: Bei geringer Frequenz spart Serverless Geld

**Szenario 2: Dauerhaft hohe Zugriffsfrequenz**

- Traditioneller Server: $20/Monat
- Serverless: 100 Mio. Anfragen × $0,0002/Anfrage = $20.000
- **Fazit**: Bei dauerhaft hohem Traffic ist der traditionelle Server günstiger

**Szenario 3: Gezeiten-Traffic**

- Traditioneller Server: Für Spitzenlast wird ein $100/Monat-Server benötigt (durchschnittliche Auslastung nur 10%)
- Serverless: In Spitzenzeiten $20, sonst fast $0
- **Fazit**: Bei Gezeiten-Traffic spart Serverless Kosten

**Erkenntnis**: Nicht blind Serverless einführen – Kostenkalkulation basierend auf dem tatsächlichen Traffic-Profil durchführen.
:::

### 5.4 Serverless-Technologie-Stack und Plattformen

| Kategorie          | Technologie/Plattform     | Eigenschaften                                      |
| ------------------ | ------------------------- | -------------------------------------------------- |
| **FaaS-Plattform** | AWS Lambda                | Ältester FaaS-Dienst, ausgereiftestes Ökosystem    |
|                    | Azure Functions           | Hohe Microsoft-Cloud-Integration, .NET-freundlich  |
|                    | Google Cloud Functions    | Tiefe Integration mit GCP-Diensten                 |
|                    | Alibaba Cloud Function Compute | Reifes Ökosystem in China, gute Kaltstart-Optimierung |
|                    | Tencent Cloud SCF         | Integration mit WeChat-Ökosystem                   |
|                    | Vercel/Netlify Functions  | Frontend-Entwickler-freundlich, Edge-Deployment    |
| **BaaS-Dienste**   | Firebase                  | Googles Backend-Lösung für Mobile                  |
|                    | Supabase                  | Open-Source-Alternative zu Firebase mit PostgreSQL |
|                    | AWS Amplify               | AWS-Entwicklungsplattform für Mobile und Web       |
| **Deployment-Tools** | Serverless Framework     | Multi-Cloud-Deployment, aktive Community           |
|                    | Terraform                 | Infrastructure as Code                             |
|                    | Pulumi                    | Infrastruktur mit Programmiersprachen definieren   |

---

## 6. Vergleich der Architekturphasen und Auswahlleitfaden

### 6.1 Gesamtvergleich der Architekturentwicklung

<ArchitectureComparisonDemo />

| Dimension                   | Physische Server            | Monolithische Architektur | Microservices + Container        | Serverless           |
| --------------------------- | --------------------------- | ------------------------- | -------------------------------- | -------------------- |
| **Teamgröße**               | 1–5 Personen                | 5–50 Personen             | 50–500 Personen                  | 1–20 Personen        |
| **Deployment-Komplexität**  | Extrem hoch                 | Niedrig                   | Extrem hoch                      | Extrem niedrig       |
| **Betriebskosten**          | Hoch                        | Mittel                    | Sehr hoch                        | Niedrig              |
| **Skalierbarkeit**          | Schlecht                    | Vertikal begrenzt         | Hervorragend horizontal          | Automatisch          |
| **Tech-Stack-Flexibilität** | Keine                       | Einheitlich               | Vielfältig                       | Eingeschränkt        |
| **Kaltstart**               | Keiner                      | Keiner                    | Container-Startzeit              | Mit Latenz           |
| **Geeignete Szenarien**     | Legacy-Systeme, spezielle Compliance-Anforderungen | Startups, einfache Geschäftslogik | Große Internetunternehmen, komplexe Geschäftslogik | Schnelle Validierung, Event-gesteuert |

### 6.2 Entscheidungsbaum für die Technologiewahl

```
Start der Auswahl
    │
    ├─ Hat das Team professionelle Betriebsmitarbeiter?
    │   ├─ Ja → Microservices oder physische Server in Betracht ziehen
    │   └─ Nein → Weiter beurteilen
    │
    ├─ Muss eine Idee schnell validiert werden?
    │   ├─ Ja → Serverless oder Monolith
    │   └─ Nein → Weiter beurteilen
    │
    ├─ Teamgröße > 50 Personen?
    │   ├─ Ja → Microservices in Betracht ziehen
    │   └─ Nein → Weiter beurteilen
    │
    ├─ Deutliche Spitzen und Täler im Traffic?
    │   ├─ Ja → Serverless
    │   └─ Nein → Monolithische Architektur (empfohlen für Startups)
    │
    └─ Spezielle Anforderungen (Compliance, Legacy-Systeme)?
        └─ Ja → Physische Server
```

::: tip 🎯 Auswahl-Empfehlung für Einsteiger
**Wenn du ein Einzelentwickler oder ein kleines Team bist:**

1. **Phase 0 (Lernen)**: Monolithische Anwendung lokal ausführen, HTTP, Datenbanken und grundlegende Architektur verstehen
2. **Phase 1 (MVP)**: Monolithische Anwendung auf einem Cloud-Server deployen (z.B. Alibaba Cloud ECS, AWS EC2)
3. **Phase 2 (Wachstum)**: Wenn das Team >10 Personen umfasst und die Geschäftslogik komplexer wird, 1–2 Microservices herauslösen
4. **Phase 3 (Reife)**: Wenn das Team >50 Personen umfasst und Millionen von Anfragen eingehen, vollständig auf Microservices umstellen

**Kernprinzip**: Nicht von Anfang an auf Microservices setzen – das ist „vorzeitige Optimierung". Lass die Architektur mit dem Geschäftswachstum reifen.
:::

### 6.3 Empfohlene Architekturen für verschiedene Szenarien

#### Szenario 1: Einzelentwickler/Nebenprojekt

- **Empfohlene Architektur**: Serverless (Vercel/Netlify) oder Monolith
- **Begründung**: Nahezu keine Betriebskosten, Pay-per-Use, schnelle Markteinführung
- **Beispiel-Technologie-Stack**: Next.js + Vercel + Supabase

#### Szenario 2: Startup-MVP-Validierung

- **Empfohlene Architektur**: Monolith + Cloud-Server
- **Begründung**: Schnelle Entwicklung, Team kann sich auf Geschäftslogik statt auf Infrastruktur konzentrieren
- **Beispiel-Technologie-Stack**: Spring Boot / Django / Rails + RDS + ECS

#### Szenario 3: Wachsendes Unternehmen (10–50 Personen)

- **Empfohlene Architektur**: Modularer Monolith oder leichtgewichtige Microservices
- **Begründung**: Code-Kopplung wird zum Problem, aber volle Microservices-Komplexität noch nicht nötig
- **Beispiel-Technologie-Stack**: Spring Cloud / Go Micro + Kubernetes

#### Szenario 4: Großes Internetunternehmen

- **Empfohlene Architektur**: Microservices + Service Mesh + Middle-Platform-Architektur
- **Begründung**: Große Teams, komplexe Geschäftslogik, unabhängige Release-Zyklen und Tech-Stacks nötig
- **Beispiel-Technologie-Stack**: Eigenes RPC-Framework + Istio + eigene PaaS-Plattform

#### Szenario 5: Event-gesteuerte / Gezeiten-Traffic-Anwendungen

- **Empfohlene Architektur**: Serverless + Event-Bus
- **Begründung**: Starke Traffic-Schwankungen, extreme Kostenoptimierung und automatische Skalierung nötig
- **Beispiel-Technologie-Stack**: AWS Lambda + API Gateway + EventBridge

---

## 7. Zusammenfassung und Lernpfad

### 7.1 Kernpunkte

Die Evolution der Backend-Architektur ist im Wesentlichen ein Spiel von **Addition** und **Subtraktion**:

| Ära              | Architektur | Was Entwickler tun müssen           | Was der Betrieb tun muss                  |
| :--------------- | :---------- | :---------------------------------- | :---------------------------------------- |
| **Physische Ära** | Einzelrechner | Skripte schreiben, manuell deployen | Rechenzentrum und Hardware warten         |
| **Monolith-Ära** | Ein Ganzes  | Alle Geschäftslogik schreiben       | Ein paar große Server warten              |
| **Microservices** | Aufgeteilt  | Auf einzelne Geschäftslogik fokussieren | K8s-Cluster warten (sehr anstrengend!) |
| **Serverless**   | Funktionen  | Nur Kernfunktionen schreiben        | Tee trinken (Cloud-Anbieter übernimmt alles) |

**Kernerkenntnis**:

- Architekturentwicklung bedeutet nicht „neue Technologie ersetzt alte", sondern **Veränderung der Anwendungsszenarien**
- Es gibt keine Silver Bullet – jede Architektur hat ihre Grenzen
- Bei der Architekturwahl sind zu berücksichtigen: Teamgröße, Geschäftskomplexität, Traffic-Profile, Betriebskompetenz

### 7.2 Empfehlungen für den Lernpfad

Je nach Karrierestufe empfehlen sich folgende Lernpfade:

#### Phase 1: Fundament aufbauen (0–1 Jahr)

**Ziel**: Backend-Kernkonzepte verstehen, eigenständig monolithische Anwendungen entwickeln können

- Eine Backend-Sprache beherrschen (Java/Python/Go – eine davon wählen)
- HTTP-Protokoll und RESTful API-Design lernen
- Relationale Datenbanken beherrschen (MySQL/PostgreSQL)
- Caching-Grundlagen verstehen (Redis)
- Git und grundlegende Linux-Befehle lernen
- **Praxisprojekt**: Eine CRUD-Anwendung mit monolithischer Architektur erstellen (z.B. Blog-System, To-Do-App)

#### Phase 2: Fähigkeiten erweitern (1–3 Jahre)

**Ziel**: Verteilte Systeme verstehen, an Microservices-Entwicklung mitwirken können

- Microservices-Architektur und Aufteilungsstrategien vertiefen
- Docker- und Kubernetes-Grundlagen beherrschen
- Message Queues lernen (Kafka/RabbitMQ)
- Verteilte Transaktionen und Konsistenz verstehen
- Monitoring und Logging beherrschen (Prometheus/ELK)
- **Praxisprojekt**: Eine monolithische Anwendung in 3–5 Microservices aufteilen und mit Docker deployen

#### Phase 3: Professionelle Vertiefung (3–5 Jahre)

**Ziel**: Große Systeme entwerfen können, Technologie-Entscheidungskompetenz besitzen

- Cloud-Native-Architektur tiefgehend verstehen (Service Mesh, Serverless)
- Kapazitätsplanung und Performance-Tuning beherrschen
- Multi-Active-Architektur und Disaster-Recovery-Design verstehen
- DDD (Domain-Driven Design) lernen
- Technisches Urteilsvermögen und architektonisches Denken entwickeln
- **Praxisprojekt**: Eine Systemarchitektur für Millionen von Nutzern entwerfen, mit Hochverfügbarkeit, elastischer Skalierung usw.

### 7.3 Empfohlene Ressourcen für kontinuierliches Lernen

**Bücher**:

- „Designing Data-Intensive Applications" (DDIA) – Pflichtlektüre für verteilte Systeme
- „Cloud Native Patterns"
- „Building Microservices"
- „Domain-Driven Design"

**Online-Ressourcen**:

- Offizielle Architekturdokumentationen von AWS/Azure/Alibaba Cloud
- CNCF (Cloud Native Computing Foundation) Projektdokumentation
- Technologie-Blogs großer Unternehmen (Netflix Tech Blog, Alibaba Tech u.a.)

---

## 8. Glossar

| Begriff           | Vollständige Bezeichnung           | Erklärung                                                                                       |
| :---------------- | :--------------------------------- | :---------------------------------------------------------------------------------------------- |
| **Backend**       | -                                  | Serverseitiges System zur Verarbeitung von Geschäftslogik, Datenspeicherung und externen Schnittstellen |
| **CGI**           | Common Gateway Interface           | Frühe dynamische Web-Technologie, verarbeitet Anfragen per Skript und gibt Ergebnisse zurück    |
| **Monolith**      | -                                  | Monolithische Architektur, gesamte Geschäftslogik in einer Anwendung gebündelt                  |
| **Microservices** | -                                  | Microservices-Architektur, Geschäftslogik in mehrere unabhängige Services aufgeteilt            |
| **Container**     | -                                  | Containerisierungstechnologie, verpackt Anwendung und Abhängigkeiten in portable Einheiten      |
| **K8s**           | Kubernetes                         | Container-Orchestrierungsplattform für Scheduling, Skalierung und Governance von Containern     |
| **Service Mesh**  | -                                  | Service Mesh, zuständig für Kommunikations-Governance, Observability und Sicherheit zwischen Microservices |
| **Serverless**    | -                                  | Serverless Computing, Entwickler schreiben nur Funktionen, Plattform führt sie automatisch aus und skaliert |
| **BaaS**          | Backend as a Service               | Plug-and-Play-Backend-Cloud-Dienste (Authentifizierung, Datenbank, Zahlungen usw.)              |
| **CI/CD**         | Continuous Integration / Delivery  | Kontinuierliche Integration und Auslieferung, automatisierte Test- und Deployment-Prozesse      |
| **Observability** | -                                  | Observability, Systemzustand anhand von Logs/Metriken/Traces verstehen                          |