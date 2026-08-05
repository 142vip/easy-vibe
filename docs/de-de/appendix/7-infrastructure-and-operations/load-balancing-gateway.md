# Load Balancing und Gateway: Verkehrsverteilung
::: tip Kernfrage
**Wenn ein einzelner Server die Last nicht mehr tragen kann, wie verteilt man Traffic "intelligent" auf mehrere Server-Instanzen?** Load Balancing ist der "Verteiler" moderner verteilter Systeme. Dieser Artikel verwendet reale Beispiele (Milchtee-Kassen, Paketsortierung, Verkehrssteuerung), um die Designphilosophie und Engineering-Praxis von Load Balancing zu erklaeren.
:::

---

## 1. Warum "Load Balancing"

### 1.1 Ein reales Beispiel: Die Architektur-Evolution einer Website

Ein Startup hatte bei schnell wachsenden Nutzerzahlen ernsthafte Performance-Probleme:

**Szenario-Rekonstruktion:**

```
Phase 1: Einzelner Server
Nutzer -> Server (1 Kern, 2 GB)
         |
   1000 DAU -> 1000 gleichzeitige Besucher zu Spitzenzeiten
         |
Problem: CPU 100%, langsame Antwort, haeufige Abstuerze
```

::: warning ⚠️ Fatale Probleme eines einzelnen Servers

- **Performance-Engpass**: CPU 100%, Antwortzeit > 5 Sekunden
- **Single Point of Failure**: Server faellt aus -> gesamte Website nicht erreichbar
- **Schwierige Skalierung**: Nur vertikales Upgrade moeglich (CPU, Speicher hinzufuegen) - teuer und begrenzt
  :::

**Verbesserte Architektur (mit Load Balancing):**

```
Phase 2: Mehrere Server + Load Balancer
Nutzer -> Load Balancer (Nginx)
         |
       ├-> Server 1 (1 Kern, 2 GB)
       ├-> Server 2 (1 Kern, 2 GB)
       └-> Server 3 (1 Kern, 2 GB)
```

::: tip ✨ Verbesserte Ergebnisse

- **Hoehere Performance**: 3 Server verarbeiten parallel, Antwortzeit < 1 Sekunde
- **Hohe Verfuegbarkeit**: Ein Server faellt aus, die anderen weiter im Dienst
- **Horizontale Skalierung**: Mehr Performance? Einfach Server hinzufuegen
  :::

### 1.2 Alltags-Analogie fuer Load Balancing

**Die Milchtee-Kassen**

Stell dir vor, du betreibst einen trendigen Milchtee-Laden:

- **1 Kasse**: Kunden warten, die hinteren werden ungeduldig - schlechte Bewertungen
- **3 Kassen**: Mitarbeiter weisen Kunden verschiedenen Kassen zu - 3x effizienter

**Load Balancer ist der "Kassenzuteiler"**:

- **Nutzer** (Kunden) -> Service anfragen
- **Load Balancer** (Zuteiler) -> Anfragen auf verschiedene Server verteilen
- **Server** (Kassen) -> Anfragen verarbeiten

<LoadBalancerTypesDemo />

---

## 2. Was ist Load Balancing

### 2.1 Layer-4-Load-Balancing (L4): Nur die Hausnummer betrachten

**Arbeitet auf der Transportschicht (TCP/UDP)**, wie ein Paketbote, der nur deine **Hausnummer (IP-Adresse + Port)** ansieht, sich nicht dafuer interessiert, was in deinem Haus passiert.

**Eigenschaften:**

- **Extrem schnell**: Nur einfache Adress-Weiterleitung, keine Paketinhaltsanalyse
- **Anwendungsfaelle**: Datenbankverbindungen, Redis-Cache, Long-Polling-Game-Server
- **Repraesentative Produkte**: LVS (Linux Virtual Server), AWS NLB, Azure Load Balancer

### 2.2 Layer-7-Load-Balancing (L7): Den Build-Artefaktinhalt pruefen

**Arbeitet auf der Anwendungsschicht (HTTP/HTTPS)**, wie ein Paketbote, der nicht nur die Hausnummer prueft, sondern auch **das Paket oeffnet und den Inhalt untersucht**, um basierend auf dem Inhalt zu entscheiden, wie es zugestellt wird.

**Eigenschaften:**

- **Intelligentes Routing**: Kann basierend auf URL-Pfaden, HTTP-Headern, Cookies usw. praezise routen
- **Erweiterte Funktionen**: SSL-Offloading, Inhalts-Caching, Komprimierung, WAF-Sicherheit
- **Anwendungsfaelle**: Web-Anwendungen, API-Gateways, Microservice-Architektur
- **Repraesentative Produkte**: Nginx, HAProxy, AWS ALB, Envoy

### 2.3 L4 vs L7 im Vergleich

| Dimension | Layer-4 (L4) | Layer-7 (L7) |
| :------------- | :------------------- | :------------------------ |
| **Schicht** | Transportschicht (TCP/UDP) | Anwendungsschicht (HTTP/HTTPS) |
| **Entscheidungsgrundlage** | IP-Adresse + Port | URL, Header, Cookie, Body |
| **Verarbeitungsgeschwindigkeit** | Extrem schnell (Kernel-Mode) | Schnell (User-Mode-Analyse) |
| **Funktionsumfang** | Grundlegende Weiterleitung | SSL-Offloading, Caching, Komprimierung, WAF |
| **Typische Szenarien** | Datenbank, Gaming, Long-Polling | Web-Anwendungen, API-Gateway, Microservices |
| **Repraesentative Produkte** | LVS, AWS NLB | Nginx, HAProxy, AWS ALB |

---

## 3. Kernproblem 1: Ansatz für verhindert man, dass "kaputte" Server weiter Anfragen bekommen

### 3.1 Health Checks: "Kranke" Server nicht das System belasten lassen

Stell dir vor, eine deiner Kassen ist ploetzlich defekt, aber der Zuteiler weiss es nicht und schickt weiterhin Kunden dorthin. Die Schlange wird immer laenger, die Kunden sind unzufrieden.

**Health Checks (Gesundheitspruefungen)** sind der "Wachposten", der dieses Problem verhindert. Sie fuehren regelmaessig "Gesundheitsuntersuchungen" bei jedem Server durch, entdecken "kranke" sofort und entfernen sie aus der Rotation. Wenn sie "genesen" sind, werden sie wieder aufgenommen.

<!-- <HealthCheckDemo /> -->

### 3.2 Aktive vs. Passive Health Checks

**Aktive Health Checks**: Der Load Balancer klopft aktiv an und fragt "Bist du noch da?"

- Regelmassig Pruef-Anfragen senden (z. B. HTTP /health, TCP ping)
| Bei Zeitueberschreitung oder Fehler-Response als ungesund eingestuft
- **Vorteil**: Genaue und zuverlaessige Ergebnisse
- **Nachteil**: Erzeugt zusaetzlichen Probe-Traffic

**Passive Health Checks**: Der Load Balancer "beobachtet" die Antworten des echten Business-Traffics

| Antwortzeit und Fehlerrate tatsaechlicher Anfragen statistisch erfassen
- Bei mehrfachen aufeinanderfolgenden Fehlern als ungesund eingestuft
- **Vorteil**: Kein zusaetzlicher Traffic
- **Nachteil**: Benoetigt ausreichend Traffic-Samples fuer eine zuverlaessige Bewertung

::: tip Haeufige Falle: Zu "empfindliche" Schwellenwerte
Ein Team hat den Schwellenwert fuer die Antwortzeit beim Health Check auf 100 ms gesetzt, waehrend die durchschnittliche Antwortzeit der Anwendung zwischen 80-120 ms schwankte. Das Ergebnis: Server wurden haeufig als "ungesund" markiert, was dazu fuehrte, dass der Traffic zwischen "gesund" und "ungesund" hin und her sprang - die Gesamtverfuegbarkeit des Systems sank tatsaechlich.

**Richtige Vorgehensweise**: Der Schwellenwert sollte auf das **2-3fache der P99-Antwortzeit** gesetzt werden, um genuegend Puffer fuer normale Schwankungen zu lassen.
:::

---

## 4. Kernproblem 2: Ansatz für gewaehrleistet man, dass "Stammkunden" immer denselben "Backend-Instanz" finden

### 4.1 Session-Persistenz: "Stammkunden" immer denselben "Backend-Instanz" bedienen lassen

Stell dir vor, du bist Stammkunde in einem Milchtee-Laden und wirst jedes Mal von derselben Bedienung bedient. Sie kennt deine Vorlieben (halber Zucker, kein Eis), der Service ist schnell und persoenlich. Aber wenn du jedes Mal jemand Neues bekommst, musst du deine Wuensche immer wieder wiederholen - ineffizient.

**Session-Persistenz (Session Persistence / Sticky Session)** loest genau dieses Problem: Es stellt sicher, dass Anfragen desselben Benutzers immer an denselben Backend-Server geroutet werden.

<SessionPersistenceDemo />

### 4.2 Drei Mechanismen der Session-Persistenz im Vergleich

| Mechanismus | Implementierung | Vorteile | Nachteile | Anwendungsfall |
| :------------- | :---------------------------------------- | :------------------------------ | :---------------------------- | :---------------------- |
| **Cookie-Einfuegung** | LB fuegt Cookie in Response ein, nachfolgende Anfragen tragen dieses Cookie | Unabhaengig von IP-Aenderungen, ab der ersten Anfrage persistent | Client muss Cookies unterstuetzen, koennten deaktiviert sein | Einkaufswagen, Login-Status |
| **IP-Hash** | Hash-Berechnung der Client-IP, Zuordnung zu einem bestimmten Server | Keine Client-Unterstuetzung erforderlich, zustandslos | Bei IP-Aenderung geht die Session verloren, schwer gleichmaessig zu verteilen | Ohne Cookies, WebSocket |
| **Sticky-Session-Tabelle** | LB verwaltet eine Zuordnungstabelle Session -> Server | Unterstuetzt Session-Replikation und Failover | Verbraucht LB-Speicher, erfordert zusaetzliche Synchronisation | Hochverfuegbarkeits-Anforderungen |

---

## 5. Kernproblem 3: Ansatz für realisiert man Zero-Downtime-Deployments

### 5.1 Blue-Green Deployment: Zero-Downtime-Release durch "Umschalten per Knopfdruck"

**Kerngedanke**: Gleichzeitig zwei identische Produktionsumgebungen unterhalten (Blaue und Gruene Umgebung), aber nur eine Umgebung ist nach aussen hin aktiv.

<BlueGreenDeploymentDemo />

**Workflow:**

1. **Initialzustand**: Blaue Umgebung laeuft mit v1.0 (Produktion), Gruene Umgebung steht bereit.
2. **Neue Version bereitstellen**: Auf der Gruenen Umgebung v1.1 deployen und internen Smoketest durchfuehren.
3. **Traffic umschalten**: Den Load Balancer auf die Gruene Umgebung umleiten - Traffic schaltet sofort auf v1.1 um.
4. **Ueberwachen und beobachten**: Die Gruene Umgebung beobachten und sicherstellen, dass keine Anomalien auftreten.
5. **Alte Version behalten**: Die Blaue Umgebung bleibt mit v1.0 fuer einige Zeit (z. B. 24 Stunden) als Versicherung fuer schnelles Rollback.

### 5.2 Canary Release: "Kleine Schritte" als schrittweise Rollout-Strategie

Der Name stammt von den historischen "Bergbau-Kanarienvoegeln" - Bergarbeiter nahmen einen Kanarienvogel mit in die Mine. Zeigte der Vogel Anomalien, bedeutete das Giftgas und die Bergarbeiter evakuierten sofort. Beim Software-Release bedeutet Canary Release: Zunaechst einen kleinen Teil der Nutzer die neue Version testen lassen und nach Beobachtung schrittweise den Anteil erhoehen.

<CanaryReleaseDemo />

**Kerngedanke:**

1. **Kleiner Traffic zuerst**: Zunaechst 1% des Traffic auf die neue Version leiten.
2. **Metriken beobachten**: Kontinuierlich Fehlerrate, Latenz und geschaeftliche Kennzahlen ueberwachen.
3. **Schrittweise erhoehen**: Wenn alles normal, den Anteil schrittweise auf 5%, 10%, 25%, 50%, 100% erhoehen.
4. **Schnelles Rollback**: Sobald Anomalien entdeckt werden, sofort den gesamten Traffic zurueck auf die alte Version schalten.

---

## 6. Kernproblem 4: Ansatz für bringt man das System dazu, selbst zu "atmen"

### 6.1 Auto-Scaling: Das System wie ein Restaurant "flexibel besetzen" lassen

Stell dir vor, du betreibst ein Restaurant:

- **Mittagsspitze**: 10 Kellner benoetigt, aber um 15 Uhr braucht man nur 2
- Wenn immer 10 Kellner da sind: Personalkosten explodieren
- Wenn immer nur 2 da sind: Zur Spitze warten die Kunden zu lange und gehen

**Auto-Scaling** laesst das System wie ein Restaurant "flexibel besetzen" - bei viel Traffic automatisch Server hinzufuegen, bei wenig Traffic automatisch abbauen.

<AutoScalingDemo />

### 6.2 Wahl der Skalierungsmetriken

Der Kern des Auto-Scaling ist die Beantwortung einer Frage: **Wann sollte man Server hinzufuegen? Wann sollte man sie abbauen?**

| Metrik | Hochskalieren bei | Herunterskalieren bei | Anwendungsfall |
| :------------------ | :--------- | :--------- | :--------------- |
| **CPU-Auslastung** | > 70% | < 30% | Rechenintensive Anwendungen |
| **Speicherauslastung** | > 75% | < 40% | Speicherintensive Anwendungen |
| **QPS (Anfragen pro Sekunde)** | > 1000/s | < 400/s | API-Gateway, Web-Services |
| **Verbindungszahl** | > 5000 | < 1000 | Datenbank, Message-Queue |
| **Benutzerdefinierte Metrik** | Je nach Geschaeft | Je nach Geschaeft | Spezifische Geschaeftsszenarien |

::: tip Haeufige Fallen und Loesungen

**Falle 1: Skalierung reagiert zu langsam, die Traffic-Spitze hat das System bereits gelaehmt**

Loesung:
- **Praeventiv skalieren**: Basierend auf historischen Daten Traffic-Spitzen vorhersagen und 30 Minuten frueher skalieren
- **Mehrstufige Schwellenwerte**: 60% Warnung (neue Instanz vorwaermen), 70% offiziell skalieren, 80% Notfall-Skalierung
- **Schnelles Hochskalieren**: Containerisierung nutzen, neue Instanzen in 30 Sekunden starten (vs. 3-5 Minuten bei VMs)

**Falle 2: Zu aggressives Skalieren, Kosten explodieren**

Loesung:
- **Cooldown-Zeit nach Skalierung**: Nach einer Skalierung mindestens 5 Minuten warten, bevor erneut skaliert wird
- **Maximale Instanzanzahl festlegen**: max = aktuelle Instanzen x 2, um unkontrolliertes Wachstum zu verhindern
- **Spitzen von Trends unterscheiden**: Nur wenn 3 aufeinanderfolgende Perioden ueber dem Schwellenwert liegen, skalieren

**Falle 3: Zu schnelles Herunterskalieren, gerade hochskalierte Instanzen sofort wieder abgebaut**

Loesung:
- **Konservativeres Herunterskalieren**: Hochskalierung bei 70%, Herunterskalierung bei 25%, ausreichender Puffer dazwischen
- **Laengere Cooldown-Zeit fuer Herunterskalierung**: Nach Hochskalierung mindestens 10 Minuten warten, bevor herunterskaliert wird
- **Schrittweises Herunterskalieren**: Immer nur 1 Instanz abbauen, beobachten, dann entscheiden
  :::

---

## 7. Praxis: Welchen Load Balancer waehlen

### 7.1 Vergleich der wichtigsten Load Balancer

| Eigenschaft | Nginx | HAProxy | Envoy | Cloud Load Balancer |
| -------------- | ------------------------------- | --------------------- | -------------- | -------------- |
| **Positionierung** | Hochleistungs-Reverse-Proxy/Load-Balancer | Open-Source-Load-Balancer | Cloud-Native-Proxy | Managed Load Balancer |
| **Performance** | Sehr hoch (C, Event-Driven) | Hoch (Event-Driven) | Hoch (C++/Rust) | Sehr hoch |
| **Funktionsumfang** | Grundlegendes LB, statische Dateien, Caching | Umfangreiche LB-Algorithmen | Erweitertes Routing, Observability | Vollumfaenglich |
| **Konfiguration** | Konfigurationsdatei (nginx.conf) | Konfigurationsdatei (haproxy.cfg) | API/Konfigurationsdatei | UI-Konsole |
| **Erweiterbarkeit** | C-Module/Lua-Skripte | Lua-Skripte | WASM/Filter | Plugins |
| **Anwendungsfall** | Statische Ressourcen, L7-LB, SSL-Terminierung | L7-LB, Hochverfuegbarkeit | Service Mesh, Multi-Cloud | Schneller Start |

::: tip Auswahl-Empfehlung
**Entscheidungsbaum:**

```
Load Balancer auswaehlen:
|
├─ Nur grundlegendes L4-Load-Balancing noetig?
│  ├─ Ja -> LVS (Open Source) oder Cloud NLB
│  └─ Nein -> Weiter
│
├─ Service Mesh, Multi-Cloud noetig?
│  ├─ Ja -> Envoy
│  └─ Nein -> Weiter
│
├─ Extrem komplexe Konfiguration und Plugins noetig?
│  ├─ Ja -> HAProxy
│  └─ Nein -> Weiter
│
├─ Hohe Performance + einfache Konfiguration?
│  ├─ Ja -> Nginx (erste Wahl)
│  └─ Weiter
│
├─ Managed Betrieb gewuenscht?
│  ├─ Ja -> Cloud Load Balancer (AWS ALB, Alibaba SLB)
│  └─ Nginx selbst betreiben
```

:::

---

## 8. Zusammenfassung: Die Kerngedanken des Load Balancing

### 8.1 Zusammenfassung der Kernprinzipien

| Prinzip | Bedeutung | Praktische Hinweise |
| -------- | -------------------------- | ------------------------------ |
| **Schichten** | L4 fuer "Paketsortierung" (schnell aber einfach) | L4 fuer Datenbank, Gaming; L7 fuer Web, API |
| **Redundanz** | Single Points of Failure sind der Feind der Architektur | Mehrere Instanzen, Multi-Region-Deployments erhoehen Verfuegbarkeit |
| **Schrittweise** | Neue Versionen nicht "mit einem Schlag" ausrollen | Blue-Green fuer Zero Downtime; Canary fuer kontrolliertes Risiko |
| **Elastizitaet** | Das System sollte wie ein Lebewesen "atmen" | Bei hohem Traffic automatisch hochskalieren, bei wenig automatisch herunter |

### 8.2 Design-Checkliste

Vor der Einfuehrung von Load Balancing folgende Fragen stellen:

- [ ] Wird Load Balancing wirklich benoetigt? (Reicht die Einzelleistung wirklich nicht aus?)
- [ ] L4 oder L7? (Nach Geschaeftsszenario entscheiden)
- [ ] Wie wird Session-Persistenz behandelt? (Cookie, IP-Hash, Session-Tabelle)
- [ ] Wie werden Health Checks implementiert? (Aktiv, Passiv, Schwellenwerte)
- [ ] Wie wird Zero Downtime erreicht? (Blue-Green Deployment, Canary Release)
- [ ] Wie wird Elastizitaet erreicht? (Skalierungsmetriken, Cooldown-Zeit, maximale Instanzen)

---

## 9. Glossar

| Begriff | Englisch | Erklaerung |
| -------- | ----------------------------------------- | -------------------------------------------------------------------- |
| **Load Balancer** | Load Balancer | Geraet oder Software, das Traffic auf mehrere Backend-Server verteilt |
| **L4-Load-Balancing** | L4 Load Balancing | Load Balancing basierend auf der Transportschicht (TCP/UDP) |
| **L7-Load-Balancing** | L7 Load Balancing | Load Balancing basierend auf der Anwendungsschicht (HTTP/HTTPS) |
| **Health Check** | Health Check | Mechanismus zur regelmaessigen Pruefung der Gesundheit von Backend-Servern |
| **Session-Persistenz** | Session Persistence | Stellt sicher, dass Anfragen desselben Benutzers immer an denselben Server geroutet werden |
| **Sticky Session** | Sticky Session | Alternative Bezeichnung fuer Session Persistence |
| **Blue-Green-Deployment** | Blue-Green Deployment | Zero-Downtime-Release-Strategie mit zwei Umgebungen |
| **Canary-Release** | Canary Release | Schrittweise Rollout-Strategie mit kleinem Traffic-Anteil zuerst |
| **Auto-Scaling** | Auto Scaling | Automatische Anpassung der Server-Anzahl basierend auf der Last |
| **Horizontale Skalierung** | Horizontal Scaling | Verarbeitungskapazitaet durch Hinzufuegen weiterer Server erhoehen |
| **Vertikale Skalierung** | Vertical Scaling | Leistung durch Erhoehung der Einzelkonfiguration (CPU, Speicher) steigern |
| **Multi-Region** | Multi-Region | Services in mehreren geografischen Regionen bereitstellen |
| **Active-Active** | Active-Active | Mehrere Regionen gleichzeitig im aktiven Betrieb |
| **Active-Standby** | Active-Standby | Nur eine Region aktiv, die anderen stehen bereit |
| **RTO** | Recovery Time Objective | Maximal zulaessige Wiederherstellungszeit nach einem Ausfall |
| **RPO** | Recovery Point Objective | Maximal akzeptabler Datenverlust bei einem Ausfall |
