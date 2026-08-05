# Gateway und Proxy: Verkehrslenkung
::: tip Kernfrage
**Wie leitet man in einer hochparallelen Internetarchitektur Traffic sicher und effizient an die richtigen Dienste weiter?** Reverse Proxy loest das Problem der "Traffic-Verteilung", API-Gateway das Problem der "Anfrageverarbeitung". Dieser Artikel verwendet reale Beispiele (Empfang, Sicherheitsysteme, intelligentes Routing), um die Designphilosophie und Engineering-Praxis von Gateways zu erklaeren.
:::

---

## 1. Warum braucht man ein "Gateway"

### 1.1 Ein reales Beispiel: Die Architektur-Evolution eines E-Commerce-Unternehmens

Ein E-Commerce-Unternehmen stiess bei schnellem Geschaeftswachstum auf ernsthafte Architekturprobleme:

**Szenario-Rekonstruktion:**

```
Phase 1: Dienste direkt exposen
Client -> direkte Aufrufe an Nutzer-Service, Bestell-Service, Zahlungs-Service...
         |
Problem 1: Service-IPs exponiert, Sicherheitsrisiko
Problem 2: Keine einheitliche Authentifizierung, kein Rate-Limiting
Problem 3: Neuer Service erfordert Aenderung der Client-Konfiguration
```

::: warning ⚠️ Fatale Probleme bei direkter Exposition

- **Sicherheitsrisiko**: Alle Service-IPs sind oeffentlich sichtbar und leicht angreifbar
- **Duplizierte Funktionalitaet**: Jeder Service muss Authentifizierung, Rate-Limiting und Logging selbst implementieren
- **Schwierige Erweiterung**: Neuer Service erfordert Aenderungen bei allen Clients
- **Protokoll-Chaos**: Einige nutzen HTTP, andere gRPC - der Client muss sich anpassen
  :::

**Verbesserte Architektur (mit Gateway):**

```
Client -> API-Gateway (Nginx/Kong) -> Interne Dienste
         |
      Einheitliche Authentifizierung, Rate-Limiting, Routing
         |
      Client kennt nur die Gateway-Adresse
```

::: tip ✨ Verbesserte Ergebnisse

- **Sicherheit**: Echte Service-IPs verborgen, nur das Gateway ist extern sichtbar
- **Funktionskonsolidierung**: Authentifizierung, Rate-Limiting und Logging zentral im Gateway
- **Einfache Erweiterung**: Neuer Service erfordert nur eine neue Route im Gateway
- **Einheitliches Protokoll**: Extern HTTP, intern kann gRPC verwendet werden
  :::

### 1.2 Alltags-Analogie fuer Gateways

**Der Empfang**

Stell dir vor, du besuchst ein grosses Unternehmen:

- **Ohne Empfang**: Besucher gehen direkt zu den Abteilungen, wissen nicht wohin, das Unternehmen ist im Chaos
- **Mit Empfang**: Besucher kommen zunaechst zum Empfang, der Empfraegt nach dem Anliegen und leitet sie an die richtige Abteilung weiter

**Das API-Gateway ist der "Empfang" des Systems**:

- **Reverse Proxy**: Der Empfang, der Besucher zur richtigen Abteilung leitet
- **API-Gateway**: Ein intelligenter Empfang, der auch die Identitaet der Besucher prueft (Authentifizierung) und die Besucherzahl begrenzt (Rate-Limiting)

<ReverseProxyDemo />

---

## 2. Was ist ein Reverse Proxy

### 2.1 Forward Proxy vs. Reverse Proxy

::: tip Begriffserklaerung
**Forward Proxy (Vorwaerts-Proxy)**:

- Auf der Client-Seite bereitgestellt
- Vertritt den Client beim Zugriff auf externe Ressourcen
- Typische Anwendungen: VPN, Proxy-Tools
- Beispiel: Unternehmensnetzwerk - du greifst ueber einen Proxy auf externe Ressourcen zu

**Reverse Proxy (Reverse Proxy)**:

- Auf der Server-Seite bereitgestellt
- Empfängt Client-Anfragen und leitet sie an interne Dienste weiter
- Der Client kennt nur den Proxy, nicht die echten Server
- Beispiele: Nginx, HAProxy
  :::

**Vergleichstabelle:**

| Dimension | Forward Proxy | Reverse Proxy |
| ------------ | ------------------------ | ------------------------ |
| **Bereitstellungsposition** | Client-Seite | Server-Seite |
| **Dient** | Dem Client | Dem Server |
| **Typische Anwendungen** | VPN, Proxy | Load Balancing, Gateway |
| **Transparenz** | Server sieht die Proxy-IP | Client sieht die Proxy-IP |
| **Zweck** | Echten Client verbergen, Zugriff beschleunigen | Echten Server verbergen, Load Balancing |

### 2.2 Kernwert von Reverse Proxy

::: details Wert 1: Load Balancing
Verteilt Traffic auf mehrere Backend-Server und verhindert Ueberlastung einzelner Server.

```
Client
  |
Nginx (Reverse Proxy)
  |
┌─────────┬─────────┬─────────┐
│ Server 1 │ Server 2 │ Server 3 │
└─────────┴─────────┴─────────┘
```

:::

::: details Wert 2: Sicherheitsabschirmung
Verbirgt die echten Server-IPs und verhindert direkte Angriffe. Einheitliche Sicherheitsmassnahmen auf Proxy-Ebene.

```
Client -> sieht nur die Nginx-IP
Echte Server -> Nur im internen Netzwerk, von aussen nicht direkt erreichbar
```

:::

::: details Wert 3: SSL-Terminierung
HTTPS-Verschluesselung/Entschluesselung auf Proxy-Ebene. Backend-Dienste nutzen HTTP, was die Backend-Rechenlast reduziert.

```
HTTPS-Client -> Nginx (Verschluesselung/Entschluesselung) -> HTTP-Backend-Dienst
                   |
              SSL-Terminierungspunkt
```

:::

---

## 3. Nginx: Motivation von kann es Millionen parallele Verbindungen bewaeltigen

### 3.1 Master-Worker-Prozessmodell

Nginx verwendet eine **Multi-Prozess-Architektur** statt Multi-Threading:

**Master-Prozess (Verwalter)**:

- Liest und validiert Konfigurationsdateien
- Verwaltet Worker-Prozesse (Start, Stopp, Neuladen)
- Verarbeitet keine konkreten Anfragen

**Worker-Prozesse (Arbeiter)**:

- Verarbeiten tatsaechlich HTTP-Anfragen
- Jeder Worker ist ein unabhaengiger Prozess, voneinander isoliert
- Die Anzahl wird ueblicherweise auf die Anzahl der CPU-Kerne gesetzt, um Kontextwechsel-Overhead zu vermeiden

::: tip Vorteile

- **Gute Isolierung**: Ein Worker-Absturz betrifft nicht die anderen Worker
- **Volle Mehrkern-Ausnutzung**: Jeder Worker laeuft unabhaengig
- **Keine Multi-Threading-Komplexitaet**: Keine Notwendigkeit fuer Locks, Race Conditions etc.
  :::

### 3.2 Event-Driven + Asynchron Nicht-Blockierend

Das ist das Kerngeheimnis von Nginx's hoeher Performance:

**Traditionelles Apache (Multi-Prozess/Thread-Modell)**:

- Eine Verbindung = ein Prozess/Thread
- Paralleilitaet durch System-Prozess/Thread-Anzahl begrenzt
- Bei vielen Verbindungen enormer Prozesswechsel-Overhead

**Nginx (Event-Driven-Modell)**:

- Verwendet epoll (Linux)/kqueue (macOS) fuer effizientes I/O-Multiplexing
- Ein Worker-Prozess kann gleichzeitig Zehntausende Verbindungen verarbeiten
| Verbindungen ohne Daten belegen keine CPU, bei neuen Daten erfolgt eine Event-Benachrichtigung

::: tip Alltags-Analogie

- **Apache**: Im Restaurant bekommt jeder Kunde einen eigenen Kellner (Prozess), viele Kunden erfordern viele Kellner
- **Nginx**: Ein Super-Kellner, der alle Kunden gleichzeitig bedient, dorthin geht, wer Service braucht, anstatt bei einem Kunden zu stehen
  :::

<NginxArchitectureDemo />

---

## 4. Was ist ein API-Gateway

### 4.1 Warum braucht man ein API-Gateway

**Stell dir ein System ohne Gateway vor:**

- Der Client muss die Adressen mehrerer Dienste kennen (Nutzer-Service, Bestell-Service, Zahlungs-Service...)
- Jeder Service muss selbst Authentifizierung, Rate-Limiting und Logging implementieren
- Protokolle sind nicht einheitlich, einige nutzen HTTP, andere gRPC
- Bei Service-Upgrades muss auch der Client geaendert werden

**Mit einem API-Gateway:**

- Der Client kennt nur die Gateway-Adresse, das Gateway leitet an den richtigen Service weiter
- Querschnittsthemen wie Authentifizierung, Rate-Limiting und Logging werden zentral im Gateway behandelt
- Das Gateway kann Protokollkonvertierung durchfuehren und nach aussen einheitlich HTTP exposen
| Backend-Service-Upgrades erfordern nur Aenderungen in der Gateway-Konfiguration - der Client merkt nichts davon

<ApiGatewayDemo />

### 4.2 Kernfunktionen eines API-Gateways

| Funktion | Beschreibung | Typische Szenarien |
| :----------- | :----------------------------------------- | :----------------------------------------------- |
| **Routing** | Anfragen basierend auf URL, Headern etc. an verschiedene Dienste weiterleiten | `/api/users` -> Nutzer-Service, `/api/orders` -> Bestell-Service |
| **Load Balancing** | Bei mehreren Instanzen desselben Service: Traffic verteilen | Nutzer-Service hat 3 Instanzen, Round-Robin-Verteilung |
| **Authentifizierung** | Einheitliche JWT- und OAuth-Token-Validierung | Nicht eingeloggte Nutzer koennen `/api/admin` nicht aufrufen |
| **Rate-Limiting und Circuit-Breaking** | Traffic-Obergrenzen steuern, Ueberlastung verhindern | Max. 1000 Anfragen pro Sekunde, darueber 429 zurueckgeben |
| **Protokollkonvertierung** | Extern HTTP, intern kann gRPC verwendet werden | Client nutzt HTTP, Gateway konvertiert zu gRPC fuer interne Dienste |
| **Canary Release** | Nach Headern oder Proportionen Teile des Traffic an die neue Version leiten | 5% der Nutzer sehen die neue Version, 95% die alte |
| **Logging und Monitoring** | Einheitliche Anfrage-Protokollierung fuer Analyse und Fehlerbehebung | Protokolliert Dauer, Statuscode und Antwortgroesse jeder Anfrage |

---

## 5. Gateway-Praxis: Eine vollstaendige Gateway-Architektur aufbauen

### 5.1 Routing und Load Balancing

::: details Routing-Regeln: Von der URL zum Service

**Nginx-Konfigurationsbeispiel:**

```nginx
server {
    listen 80;
    server_name api.example.com;

    # Nutzer-Service
    location /api/users/ {
        proxy_pass http://user-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Bestell-Service
    location /api/orders/ {
        proxy_pass http://order-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Zahlungs-Service (hoehere Sicherheitsanforderungen)
    location /api/pay/ {
        allow 10.0.0.0/8;
        deny all;

        proxy_pass http://payment-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

:::

::: details Load Balancing: Vier Strategien im Vergleich

| Strategie | Prinzip | Anwendungsfall | Vorteile | Nachteile |
| :----------- | :------------------------------------------------ | :----------------- | :------------------- | :--------------------------- |
| **Round-Robin** | Sequentielle Zuteilung an jeden Server | Aehnliche Serverleistung | Einfach und fair | Beruecksichtigt nicht aktuelle Serverlast |
| **Weighted Round-Robin** | Zuteilung nach Gewichtung, leistungsstaerkere Server bekommen mehr | Unterschiedliche Serverleistung | Hochleistungs-Server besser genutzt | Gewichtung muss sinnvoll konfiguriert werden |
| **Least Connections** | Zuteilung an den Server mit den wenigsten Verbindungen | Long-Polling, Video-Streaming | Dynamische Anpassung an Lastaenderungen | Erfordert Echtzeit-Verbindungsstatistik |
| **IP-Hash** | Hash basierend auf Client-IP, dieselbe IP immer zum selben Server | Session-Persistenz erforderlich | Garantiert Session-Konsistenz | Einzelne IP mit viel Traffic erzeugt Hotspot |

:::

<LoadBalancingDemo />

---

## 6. Gateway-Sicherheit: Ansatz für bewacht man das System-Tor

### 6.1 Authentifizierung und Autorisierung

::: tip Kernidee
**Authentifizierung im Gateway, Autorisierung im Service**:

- **Authentifizierung**: Wer bist du? (Token validieren, Benutzeridentitaet abrufen)
- **Autorisierung**: Was darfst du tun? (Basierend auf Benutzerrolle Berechtigungen pruefen)

Wie im Unternehmen: Der Empfang authentifiziert deine Identitaet (Ausweis), aber die konkreten Berechtigungen werden von den Abteilungen geprueft.
:::

<AuthMiddlewareDemo />

### 6.2 HTTPS und SSL-Terminierung

**Warum HTTPS?**

1. **Sicherheit**: Verhindert Datenabfang waehrend der Uebertragung
2. **Compliance**: Moderne Browser zeigen "Nicht sicher"-Warnung bei HTTP-Websites
3. **SEO**: Suchmaschinen bevorzugen HTTPS-Websites

**SSL-Terminierung:**

- HTTPS und Zertifikate nur auf Gateway-Ebene konfigurieren
- Das Gateway uebernimmt TLS-Handshake und Ver-/Entschluesselung
| Zwischen Gateway und Backend-Diensten wird HTTP im Klartext verwendet (internes Netzwerk als vertrauenswuerdig)
- Backend-Dienste konzentrieren sich auf Geschaeftslogik, muessen TLS nicht behandeln

<SslTerminationDemo />

---

## 7. Rate-Limiting und Circuit-Breaking: Ansatz für verhindert man, dass das System von einer "Traffic-Flut" weggespuelt wird

### 7.1 Vergleich von Rate-Limiting-Algorithmen

| Algorithmus | Kernidee | Burst-Traffic | Anwendungsfall | Komplexitaet |
| :----------- | :------------------------ | :-------------------------- | :----------------------------- | :--------- |
| **Token Bucket** | Tokens im Bucket, nur mit Token wird durchgelassen | Begrenzter Burst erlaubt | API-Rate-Limiting, Bandbreitenkontrolle | Mittel |
| **Leaky Bucket** | Anfragen fließen in den Bucket, werden gleichmaessig abgearbeitet | Erzwungene Glättung, Burst wird gepuffert oder abgelehnt | Szenarien mit streng gleichmaessiger Verarbeitung | Mittel |
| **Sliding Window** | Zaehlt Anfragen innerhalb eines Zeitfensters | Streng nach Fenster, Ueberschuss wird abgelehnt | Praezise Zaehlung (z. B. "max. 100 pro Minute") | Hoeher |

### 7.2 Nginx Rate-Limiting-Konfiguration

```nginx
# Rate-Limiting-Zone definieren (im http-Block)

# 1. IP-basiertes Rate-Limiting (Leaky-Bucket-Algorithmus)
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

# 2. IP-basierte Verbindungsbegrenzung
limit_conn_zone $binary_remote_addr zone=addr:10m;

server {
    listen 80;
    server_name api.example.com;

    # Nutzer-Service - normales Rate-Limiting
    location /api/users/ {
        limit_req zone=mylimit burst=20 nodelay;
        limit_conn addr 10;

        proxy_pass http://user-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Bestell-Service - strengeres Rate-Limiting
    location /api/orders/ {
        limit_req_zone $binary_remote_addr zone=order_limit:10m rate=5r/s;
        limit_req zone=order_limit burst=10 nodelay;

        proxy_pass http://order-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Behandlung bei Rate-Limiting
    error_page 429 /429.html;
    location = /429.html {
        internal;
        return 429 '{"error": "Too Many Requests", "message": "Rate limit exceeded. Please try again later."}';
        add_header Content-Type application/json;
    }
}
```

<RateLimitingDemo />

### 7.3 Circuit-Breaking: Fehlerausbreitung verhindern

**Funktionsweise des Circuit-Breakers:**

1. **Geschlossen**: Anfragen werden normal weitergeleitet, gleichzeitig wird die Fehlerrate erfasst
2. **Geoeffnet**: Wenn die Fehlerrate den Schwellenwert ueberschreitet, oeffnet sich der Breaker und gibt direkt einen Fehler zurueck, ohne Anfragen weiterzuleiten
3. **Halb-geoeffnet**: Nach einer gewissen Zeit werden wenige Anfragen zum Testen durchgelassen - bei Erfolg wird der Breaker geschlossen

::: tip Kernidee
**Circuit-Breaking ist wie eine elektrische Sicherung**: Bei Ueberstrom schmilzt die Sicherung automatisch und schuetzt den gesamten Stromkreis vor dem Durchbrennen.

Aehnlich: Wenn der Backend-Dienst viele Fehler produziert, "loest" der Breaker aus und schlaegt schnell fehl, um eine Fehlerausbreitung im gesamten System zu verhindern.
:::

---

## 8. Zusammenfassung: Kerngedanken des Gateway-Designs

### 8.1 Zusammenfassung der Kernprinzipien

| Prinzip | Bedeutung | Praktische Hinweise |
| ------------ | -------------------- | ------------------------------ |
| **Routing** | Anfragen an den richtigen Ort leiten | Pfad-Routing, Domain-Routing, Header-Routing |
| **Load Balancing** | Traffic auf mehrere Server verteilen | Round-Robin, Gewichtet, Least Connections, IP-Hash |
| **Sicherheit** | Das System-Tor bewachen | Authentifizierung, HTTPS, WAF |
| **Rate-Limiting** | Vor Ueberflutung schuetzen | Token Bucket, Leaky Bucket, Sliding Window |
| **Circuit-Breaking** | Fehlerausbreitung verhindern | Schnelles Fehlschlagen, Degradierung |
| **Observability** | Monitoring und Fehlerbehebung | Logs, Metriken, Tracing |

### 8.2 Technologieauswahl

::: tip Entscheidungsbaum

```
Gateway auswaehlen:
|
├─ Nur Reverse Proxy und Load Balancing noetig?
│  ├─ Ja -> Nginx (erste Wahl)
│  └─ Nein -> Weiter
│
├─ Reichhaltiges Plugin-Oekosystem noetig?
│  ├─ Ja -> Kong (basiert auf Nginx)
│  └─ Nein -> Weiter
│
├─ Spring Cloud Full-Stack?
│  ├─ Ja -> Spring Cloud Gateway
│  └─ Nein -> Nginx
```

:::

---

## 9. Glossar

| Begriff | Englisch | Erklaerung |
| ------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **Reverse Proxy** | Reverse Proxy | Auf der Server-Seite bereitgestellter Proxy, der Client-Anfragen empfängt und an interne Dienste weiterleitet. |
| **Forward Proxy** | Forward Proxy | Auf der Client-Seite bereitgestellter Proxy, der den Client beim Zugriff auf externe Ressourcen vertritt. |
| **API-Gateway** | API Gateway | Zwischenschicht zwischen Client und Backend-Diensten, bietet Routing, Authentifizierung, Rate-Limiting und weitere Funktionen. |
| **Load Balancing** | Load Balancing | Verteilt Anfragen-Traffic auf mehrere Server, verhindert Ueberlastung einzelner Server. |
| **SSL-Terminierung** | SSL Termination | HTTPS-Verschluesselung/Entschluesselung auf Gateway-Ebene, Backend nutzt HTTP. |
| **Rate-Limiting** | Rate Limiting | Beschraenkt die Anzahl der Anfragen pro Zeiteinheit. Algorithmen: Token Bucket, Leaky Bucket, Sliding Window. |
| **Circuit-Breaking** | Circuit Breaking | Automatische Unterbrechung von Aufrufen bei Dienstausfaellen, verhindert Fehlerkaskaden. |
| **Session-Persistenz** | Session Persistence | Stellt sicher, dass Anfragen desselben Clients immer an denselben Backend-Server geroutet werden. |
| **Health Check** | Health Check | Regelmässige Pruefung der Gesundheit von Backend-Servern, automatisches Entfernen ausgefallener Knoten. |
| **Canary Release** | Canary Release | Leitet einen kleinen Teil des Traffic zur neuen Version, um die Stabilitaet schrittweise zu validieren. |
| **WAF** | Web Application Firewall | Web-Applikations-Firewall zum Schutz vor SQL-Injection, XSS, CC-Angriffen. |
| **CDN** | Content Delivery Network | Content Delivery Network mit weltweiten Edge-Knoten zur Beschleunigung statischer Ressourcen. |
