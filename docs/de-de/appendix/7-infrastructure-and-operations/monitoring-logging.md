# Grundlagen von Monitoring, Logging und Alerting
> **Lernleitfaden**: Dieses Kapitel erfordert keine Programmierkenntnisse. Durch interaktive Demonstrationen fuehrt es dich in das vollstaendige Wissenssystem des Betriebs ein - von Monitoring und Alerting ueber Fehlerbehebung und Kapazitaetsplanung bis hin zu automatisiertem Betrieb.

## 0. Einleitung: Systemstart ist erst der Anfang

Viele Anfaenger glauben: "Der Code ist deployt, die Aufgabe ist erledigt."

**Weit gefehlt!**

Der Systemstart ist nur der **Beginn der Betriebsarbeit**. Wie beim Kauf eines neuen Autos sind die darauf folgenden Wartung, Reparaturen und Tanken der Normalzustand.

Die Ziele des Betriebs sind:

1. **Stabilitaet (Stability)**: Das System faellt nicht aus, der Service ist immer verfuegbar
2. **Performance**: Schnelle Antwortzeiten, gute Nutzererfahrung
3. **Sicherheit (Security)**: Keine Datenlecks, Schutz vor Angriffen

---

## 1. Monitoringsystem (Monitoring)

Monitoring sind die "Augen" des Betriebs. Ein System ohne Monitoring ist wie ein Blinder, der Auto faehrt - man merkt nicht einmal, wenn etwas schiefgeht.

### 1.1 Die drei Ebenen des Monitorings

<MonitoringDashboardDemo />

**Infrastruktur-Monitoring**: Fokus auf Hardware-Ressourcen des Servers

- CPU-Auslastung
- Speicherverbrauch
- Festplattenplatz und I/O
- Netzwerkbandbreite

**Anwendungs-Monitoring**: Fokus auf den Software-Status

- QPS (Anfragen pro Sekunde)
- Antwortzeit (Latenz)
- Fehlerrate
| Abhaengigkeits-Aufrufe

**Geschaefts-Monitoring**: Fokus auf die Gesundheit des Geschaefts

- DAU/MAU (Tagesaktive/Monatsaktive Nutzer)
| Bestellvolumen
| Zahlungs-Erfolgsrate
| Nutzungsretention

### 1.2 Monitoring-Tool-Stack

| Tool | Zweck | Eigenschaften |
| :------------- | :------------- | :----------------------- |
| **Prometheus** | Metrik-Erfassung und -Speicherung | Zeitreihen-Datenbank, ideal fuer Monitoring-Daten |
| **Grafana** | Visualisierungs-Dashboard | Leistungsfaehige Diagramme und Dashboards |
| **Zabbix** | Umfassendes Monitoring | Etabliertes Tool, vollstaendiger Funktionsumfang |
| **Datadog** | SaaS-Monitoring-Plattform | All-in-One-Loesung, kostenpflichtig |

**Kernpunkt**: Monitoring muss mehrschichtig sein, von der Infrastruktur bis zum Geschaeft vollstaendig abgedeckt, um "blinde Flecken" zu vermeiden.

---

## 2. Alerting-System (Alerting)

Wenn Monitoring ein Problem entdeckt, muss das Betriebsteam rechtzeitig benachrichtigt werden - das ist **Alerting**.

### 2.1 Alerting-Prozess

<AlertFlowDemo />

### 2.2 Alerting-Level-Design

Eine sinnvolle Alarmstufung verhindert "Alarmmuedigkeit":

| Level | Reaktionszeit | Typische Szenarien | Benachrichtigungskanal |
| :----- | :-------------- | :------------------------- | :----------------- |
| **P0** | Sofort (innerhalb von 5 Minuten) | Kern-Service ausgefallen, Zahlung fehlgeschlagen | Anruf + SMS + Messenger |
| **P1** | Innerhalb von 30 Minuten | Einzelne Funktionen gestört, drastischer Leistungsabfall | SMS + Messenger + E-Mail |
| **P2** | Am selben Tag bearbeiten | Ressourcenauslastung erhoeht, gelegentliche Fehler | Messenger + E-Mail |
| **P3** | Diese Woche bearbeiten | Nicht-kritische Probleme, Optimierungsvorschlaege | E-Mail |

### 2.3 Alarm-Konsolidierung und Rauschunterdrueckung

**Schmerzpunkt**: Ein kleines Problem kann hunderte Alarme ausloesen und den Bereitschaftsdienst abgestumpft machen.

**Loesungen**:

1. **Alarm-Gruppierung**: Aehnliche Alarme zusammenfassen (z. B. mehrere Probleme auf demselben Server zu einem einzigen Alarm)
2. **Alarm-Unterdrueckung**: Wenn das uebergeordnete Problem bereits alarmiert wurde, werden untergeordnete Probleme nicht erneut gemeldet
3. **Stiller-Regeln**: Waehrend Wartungsfenstern Alarme automatisch pausieren
4. **Frequenzbegrenzung**: Derselbe Alarm wird innerhalb kurzer Zeit nicht wiederholt gemeldet

**Kernpunkt**: Alarme sollten "wenig aber praegnant" sein - jeder einzelne muss es wert sein, bearbeitet zu werden.

---

## 3. Log-Management (Logging)

Logs sind die "Blackbox" fuer die Fehlerbehebung.

### 3.1 Log-Level

```javascript
console.debug('Detaillierte Debug-Informationen') // Waehrend der Entwicklung verwenden
console.info('Allgemeine Informationen') // Normaler Prozess-Log
console.warn('Warnhinweise') // Potenzielle Probleme
console.error('Fehlerinformationen') // Fehler, die Aufmerksamkeit erfordern
```

### 3.2 Strukturierte Logs

Traditionelle Logs (schlecht):

```
2024-01-15 10:23:45 ERROR User john failed to login, attempts=3, ip=192.168.1.100
```

Strukturierte Logs (empfohlen):

```json
{
  "timestamp": "2024-01-15T10:23:45Z",
  "level": "ERROR",
  "message": "User login failed",
  "user": "john",
  "attempts": 3,
  "ip": "192.168.1.100",
  "service": "auth-service"
}
```

### 3.3 ELK-Log-Stack

**ELK = Elasticsearch + Logstash + Kibana**

- **Logstash**: Log-Erfassung und Filterung
- **Elasticsearch**: Log-Speicherung und Suche
- **Kibana**: Log-Visualisierung und Abfrage

**Best Practices**:

- Sensible Informationen (Passwoerter, Token) nicht in Logs aufnehmen
- Kritische Operationen (Login, Zahlung, Berechtigungsaeenderungen) muessen geloggt werden
- Logs sollten Kontext enthalten (Benutzer-ID, Anfrage-ID, Zeitstempel)
- Abgelaufene Logs regelmaessig bereinigen, um Speicherueberlauf zu verhindern

---

## 4. Distributed Tracing

In einer Microservice-Architektur kann eine Anfrage dutzende Services durchlaufen. Wie verfolgt man ihren kompletten Pfad?

**Trace ID und Span ID**

- **Trace ID**: Die eindeutige ID der gesamten Anfragekette (wie eine Sendungsnummer)
- **Span ID**: Die ID eines einzelnen Service-Aufrufs (wie jede Zwischenstation)

### 4.1 Distributed Tracing Demo

<TraceVisualizationDemo />

### 4.2 OpenTelemetry-Standard

OpenTelemetry (OTel) ist der **Industriestandard** fuer Distributed Tracing und bietet eine einheitliche API und SDKs.

```javascript
// Beispiel: Span mit OpenTelemetry aufzeichnen
import { trace } from '@opentelemetry/api'

const tracer = trace.getTracer('my-service')

async function processOrder(orderId) {
  // Span erstellen
  const span = tracer.startSpan('processOrder')

  try {
    // Attribute setzen
    span.setAttribute('order.id', orderId)

    // Geschaeftslogik...
    await validateOrder(orderId)
    await saveToDatabase(orderId)

    span.setStatus({ code: SpanStatusCode.OK })
  } catch (error) {
    span.recordException(error)
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message })
  } finally {
    span.end() // Span beenden
  }
}
```

**Kernpunkt**: Distributed Tracing kann schnell Performance-Bottlenecks und Fehlerquellen lokalisieren - ein unverzichtbares Werkzeug fuer Microservices.

---

## 5. Fehlerbehebungs-Prozess

Produktionsausfaelle sind unausweichlich. Entscheidend ist **schnelle Reaktion, schnelle Wiederherstellung**.

### 5.1 Incident-Handling-Prozess

<IncidentResponseDemo />

### 5.2 Haeufige Diagnose-Werkzeuge

| Tool | Zweck | Typische Szenarien |
| :----------- | :----------- | :----------------------- |
| **tcpdump** | Paket-Erfassung und Analyse | Netzwerk nicht erreichbar, Paketverlust |
| **strace** | Systemaufrufe verfolgen | Prozess haengt, Dateiberechtigungsprobleme |
| **Arthas** | Java-Diagnose | CPU-Spitze, Speicherleck, Deadlock |
| **top/htop** | Systemressourcen-Monitoring | Hohe CPU/Speicher-Auslastung |
| **netstat** | Netzwerkverbindungen anzeigen | Port belegt, ungewoehnliche Verbindungszahl |
| **lsof** | Offene Dateien anzeigen | Datei gesperrt, Festplatte voll |

### 5.3 Postmortem (Post-mortem)

**Ein Postmortem ist keine Schuldzuweisung!**

Ziel des Postmortems:

1. Die Zeitlinie des Vorfalls rekonstruieren
2. Die Grundursache finden (Root Cause Analysis)
3. Lessons Learned zusammenfassen
4. Verbesserungsmassnahmen festlegen

**Die Fuenf-Warum-Methode**:

Mindestens 5 Mal "Warum" fragen, bis die Grundursache gefunden ist:

- Warum ist der Service ausgefallen?
  - Wegen Speicherueberlauf
- Warum gab es einen Speicherueberlauf?
  - Wegen zu vieler Cache-Daten
- Warum waren die Cache-Daten zu umfangreich?
  - Weil keine Ablaufzeit konfiguriert war
- Warum war keine Ablaufzeit konfiguriert?
  - Weil sie bei der Entwicklung vergessen wurde
- **Grundursache**: Fehlende Code-Reviews und Testfaelle

**Kernpunkt**: Eine Blameless-Kultur aufbauen, Fokus auf Prozessverbesserung statt individueller Schuldzuweisung.

---

## 6. Performance-Optimierung

### 6.1 Analyse von Performance-Bottlenecks

**Top-Down-Optimierungsansatz**:

```
Nutzerwahrnehmung
  |
Frontend-Optimierung (weniger Anfragen, CDN, Lazy Loading)
  |
Netzwerkoptimierung (HTTP/2, Komprimierung, Keep-Alive)
  |
Backend-Optimierung (Caching, Asynchronitaet, Batch-Verarbeitung)
  |
Datenbankoptimierung (Indexierung, Query-Optimierung, Sharding)
  |
Systemoptimierung (Kernel-Parameter, JVM-Tuning)
```

### 6.2 Datenbankoptimierung

**Index-Optimierung**:

```sql
-- Langsame Abfrage (ohne Index)
SELECT * FROM orders WHERE user_id = 12345;

-- Nach Index-Erstellung 100x schneller
CREATE INDEX idx_user_id ON orders(user_id);
```

**Query-Optimierung**:

```sql
-- Vermeiden: SELECT *
SELECT * FROM users WHERE id = 123;

-- Besser: Nur benoetigte Spalten abfragen
SELECT id, name, email FROM users WHERE id = 123;

-- Vermeiden: Zu grosse IN-Klauseln
SELECT * FROM orders WHERE user_id IN (1, 2, 3, ..., 10000);

-- Besser: JOIN oder Batch-Abfragen verwenden
SELECT * FROM orders o JOIN user_ids u ON o.user_id = u.id;
```

### 6.3 Cache-Optimierung

**Multi-Level-Cache-Architektur**:

```
Browser-Cache (CDN)
  |
Lokaler Cache (In-Memory/Guava)
  |
Verteilter Cache (Redis/Memcached)
  |
Datenbank (MySQL/PostgreSQL)
```

**Cache-Update-Strategien**:

| Strategie | Vorteile | Nachteile | Anwendungsfall |
| :---------------- | :----------- | :----------- | :----------------------- |
| **Cache-Aside** | Einfach, zuverlaessig | Erste Abfrage langsam | Viel Lesen, wenig Schreiben |
| **Write-Through** | Gute Datenkonsistenz | Langsames Schreiben | Ausgewogenes Lesen/Schreiben |
| **Write-Behind** | Extrem schnelles Schreiben | Moeglicher Datenverlust | Viel Schreiben, wenig Lesen |

---

## 7. Kapazitaetsplanung

### 7.1 Kapazitaetsbewertung

<CapacityPlanningDemo />

### 7.2 Lasttests

**Tool-Auswahl**:

| Tool | Eigenschaften | Anwendungsfall |
| :--------- | :------------------ | :------------ |
| **JMeter** | Leistungsfaehig, grafische Oberflaeche | HTTP-Interface-Lasttests |
| **wrk/ab** | Leichtgewichtig, Kommandozeile | Schnelle Benchmarks |
| **Locust** | Python-Skripte, verteilt | Komplexe Lasttest-Szenarien |
| **K6** | Modern, JS-Skripte | CI/CD-Integration |

**wrk-Beispiel**:

```bash
# wrk installieren
$ brew install wrk  # macOS
$ apt install wrk   # Ubuntu

# HTTP-Interface lasttesten (10 Threads, 30 Sekunden)
$ wrk -t10 -c100 -d30s http://example.com/api/users

# Ausgabe:
# Running 30s test @ http://example.com/api/users
#   10 threads and 100 connections
#   Thread Stats   Avg      Stdev     Max   +/- Stdev
#     Latency    45.32ms   12.45ms 120.50ms   87.56%
#     Req/Sec     2.12k   123.45    3.45k    89.01%
#   632450 requests in 30.00s, 1.23GB read
# Requests/sec:  21081.67
```

### 7.3 Elastische Skalierung

**Auto-Scaling im Cloud-Native-Zeitalter**:

```yaml
# Kubernetes HPA (Horizontal Pod Autoscaler)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

**Wenn die CPU-Auslastung 70% ueberschreitet, wird automatisch hochskaliert (max. 10 Pods)**

**Kernpunkt**: In Kombination mit geschaeftlichen Vorhersagen (z. B. Black Friday) fruehzeitig skalieren, um nicht zu spaet zu kommen.

---

## 8. Sicherheitsbetrieb

### 8.1 Zugriffskontrolle

**Prinzip der minimalen Berechtigungen**:

- Entwickler duerfen nur auf die Entwicklungsumgebung zugreifen
- Betriebspersonal darf nur auf die Produktionsumgebung zugreifen und braucht Genehmigung
- Sensible Datenbankoperationen erfordern eine Zweitbestaetigung

**Jump Server (Bastion Host)**:

Alle Betriebsoperationen werden ueber einen Jump Server durchgefuehrt, der vollstaendige Operations-Logs aufzeichnet.

### 8.2 Daten-Backup

**Die 3-2-1-Backup-Regel**:

- **3** Datenkopien (1 Original + 2 Backups)
- **2** verschiedene Speichermedien (lokale Festplatte + Cloud-Speicher)
- **1** Offsite-Backup (Schutz vor lokalen Katastrophen)

**Backup-Strategie**:

| Typ | Haeufigkeit | Aufbewahrungsdauer | RTO | RPO |
| :----------- | :--- | :------- | :----- | :------ |
| **Voll-Backup** | Woechentlich | 1 Monat | 4 Stunden | 24 Stunden |
| **Inkrementelles Backup** | Taeglich | 1 Woche | 2 Stunden | 1 Stunde |
| **Echtzeit-Backup** | Sekunden | 7 Tage | Minuten | Sekunden |

**RTO (Recovery Time Objective)**: Maximal zulaessige Wiederherstellungszeit
**RPO (Recovery Point Objective)**: Maximal akzeptabler Datenverlust

### 8.3 Schwachstellen-Scans

**Regelmaessige Scans**:

- **Code-Scanning**: SonarQube, ESLint (potenzielle Schwachstellen entdecken)
- **Abhaengigkeits-Scanning**: npm audit, Snyk (Schwachstellen in Drittanbieter-Bibliotheken erkennen)
- **Container-Scanning**: Trivy, Clair (Image-Schwachstellen erkennen)

```bash
# npm audit Beispiel
$ npm audit

found 3 vulnerabilities (1 moderate, 2 high)

Package         Severity  Vulnerable versions
lodash          high      <4.17.21
express         moderate  4.0.0 - 4.18.2

# Automatische Reparatur
$ npm audit fix
```

---

## 9. Automatisierter Betrieb (DevOps)

### 9.1 CI/CD-Pipeline

```yaml
# .gitlab-ci.yml Beispiel
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - npm install
    - npm test
  tags:
    - docker

build:
  stage: build
  script:
    - docker build -t myapp:$CI_COMMIT_SHA .
    - docker push registry.example.com/myapp:$CI_COMMIT_SHA
  only:
    - main

deploy:
  stage: deploy
  script:
    - kubectl set image deployment/myapp myapp=registry.example.com/myapp:$CI_COMMIT_SHA
  environment:
    name: production
  when: manual # Deployment manuell ausloesen
```

### 9.2 Infrastructure as Code (IaC)

**Terraform-Beispiel** (Cloud-Ressourcen verwalten):

```hcl
# main.tf
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "WebServer"
    Env  = "production"
  }
}

resource "aws_security_group" "web" {
  name = "web-sg"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

**Vorteile**:

- Versionskontrolle: Alle Konfigurationen in Git
- Reproduzierbar: Einheitliche Umgebungen
- Auditierbar: Klare Aenderungshistorie
- Rollbar: Schnelle Wiederherstellung auf vorherige Versionen

### 9.3 GitOps-Praxis

**GitOps = Git + IaC + Automatisierung**

Kernidee: **Das Git-Repository ist die einzige Quelle der Wahrheit fuer die Infrastruktur**

Workflow:

```
1. Konfigurationsdatei aendern (push zu Git)
   |
2. Git-Repository-Aenderung loest CI/CD aus
   |
3. Automatisch terraform apply/kubectl apply ausfuehren
   |
4. Infrastruktur wird automatisch aktualisiert
   |
5. Monitoring vergleicht Ist-Zustand mit Soll-Zustand
```

**Tools**: ArgoCD, Flux (fuer Kubernetes-Deployments)

---

## 10. Zusammenfassung und Best Practices

Betrieb ist ein umfangreiches System, dessen Kern sich wie folgt zusammenfassen laesst:

### 10.1 Betriebs-Reifegradmodell

| Level | Merkmale | Praktiken |
| :------- | :----------------- | :----------------------------- |
| **Einsteiger** | Reaktiv, manuelle Operationen | Erst bei Problemen handeln, manuelles Deployment |
| **Mittel** | Automatisiert, standardisiert | CI/CD, Monitoring/Alerting, dokumentiert |
| **Fortgeschritten** | Praeventiv, Selbstheilung | Kapazitaetsplanung, Chaos-Engineering, Auto-Scaling |
| **Experte** | Intelligent, unbemannt | AIOps, Chaos-Engineering, Serverless |

### 10.2 Ein Tag als Betriebsingenieur

```
09:00 - Naechtliche Alarme pruefen, Systemstatus bestaetigen
10:00 - Gemeldete Nutzerprobleme bearbeiten
11:00 - An Dev-Besprechung teilnehmen, Betriebsrisiken neuer Features bewerten
14:00 - Langsame Queries optimieren, Performance verbessern
15:00 - Code-Review (Code Review)
16:00 - Deployment-Dokumentation schreiben, Monitoring-Regeln aktualisieren
17:00 - Fehleruebung (Chaos Engineering)
18:00 - Bereitschaftsuebergabe
```

### 10.3 Lernpfad

**Einsteiger-Phase** (1-3 Monate):

- Haeufige Linux-Befehle erlernen
| Monitoringsystem kennenlernen (Prometheus + Grafana)
- Log-Abfragen beherrschen (ELK)

**Aufbaustufe** (3-6 Monate):

- Container-Technologie vertiefen (Docker + K8s)
- Ein Diagnose-Tool beherrschen (Arthas, tcpdump)
- CI/CD-Pipeline praktisch umsetzen

**Fortgeschrittenen-Phase** (6-12 Monate):

- Performance-Tuning (Datenbank, JVM, Netzwerk)
- Kapazitaetsplanung und Kostenoptimierung
| Postmortems und Prozessverbesserung

**Experten-Phase** (ueber 1 Jahr):

- Architekturdesign (Hochverfuegbarkeit, Disaster Recovery)
- Chaos Engineering (aktives Fehler-Injizieren)
- AIOps (intelligenter Betrieb)

---

## 11. Glossar

| Begriff | Vollstaendiger Name | Erklaerung |
| :-------------- | :-------------------------------- | :--------------------------------------------- |
| **Monitoring** | - | Ueberwachung, Echtzeit-Beobachtung des Systemstatus |
| **Alerting** | - | Alarmierung, Benachrichtigung bei Anomalien |
| **Logging** | - | Protokollierung, Aufzeichnung von Ereignissen waehrend des Systembetriebs |
| **Tracing** | - | Distributed Tracing, Verfolgung des kompletten Pfads einer Anfrage in verteilten Systemen |
| **QPS** | Queries Per Second | Anfragen pro Sekunde, Mass fuer den Systemdurchsatz |
| **Latenz** | - | Verzoegerung, Zeit vom Absenden der Anfrage bis zur Antwort |
| **RTO** | Recovery Time Objective | Wiederherstellungszeit-Ziel, maximale Service-Unterbrechungsdauer |
| **RPO** | Recovery Point Objective | Wiederherstellungspunkt-Ziel, maximal akzeptabler Datenverlust |
| **Postmortem** | - | Fehleranalyse, Untersuchung der Ursachen und Verbesserungsmassnahmen |
| **CI/CD** | Continuous Integration/Delivery | Kontinuierliche Integration und Bereitstellung, automatisiertes Testen und Deployment |
| **IaC** | Infrastructure as Code | Infrastructure as Code, Verwaltung von Servern, Netzwerken etc. mit Code |
| **GitOps** | - | Git-Betrieb, das Git-Repository ist die einzige Quelle der Wahrheit fuer die Infrastruktur |
| **ELK** | Elasticsearch + Logstash + Kibana | Drei-Komponenten-Set fuer Log-Erfassung, -Speicherung und -Visualisierung |
| **SLA** | Service Level Agreement | Service-Level-Vereinbarung, zugesagte Service-Verfuegbarkeit (z. B. 99,9%) |
| **Blameless** | - | Schuldfreie Kultur, Postmortems fokussieren auf Prozessverbesserung statt individueller Schuld |

---

## 12. Weiterfuehrende Literatur

- **[System-Cache-Design](/de-de/appendix/4-server-and-backend/caching)** - Cache-Prinzipien, Muster und Best Practices
- **[Message-Queue-Design](/de-de/appendix/4-server-and-backend/message-queues)** - Peak-Shaving, asynchrone Entkopplung
- **[Auth-Design und Praxis](/de-de/appendix/4-server-and-backend/auth-authorization)** - Authentifizierung, Autorisierung, Sicherheitsverstaerkung
- **[Backend-Evolutionsgeschichte](/de-de/appendix/4-server-and-backend/backend-layered-architecture)** - Vom Monolithen zu Microservices und Serverless
- **[Deployment und Going Live](/de-de/appendix/7-infrastructure-and-operations/ci-cd)** - Die letzte Meile von der Entwicklung zur Produktion
