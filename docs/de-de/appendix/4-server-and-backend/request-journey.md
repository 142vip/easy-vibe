# Anfragereise: Panorama

::: tip Vorwort
**Wenn du im Browser eine URL eingibst und Enter drückst — was passiert eigentlich, bis die Seite angezeigt wird?** Diese Frage ist ein Klassiker in Vorstellungsgesprächen und gleichzeitig der Schlüssel zum Verständnis der gesamten Web-Architektur. Wenn du diese Kette verstehst, begreifst du, wie Frontend, Backend, Netzwerk und Datenbank zusammenarbeiten.
:::

**Was wirst du in diesem Artikel lernen?**

Nach Abschluss dieses Kapitels wirst du Folgendes erhalten:

- **Ganzheitliche Perspektive**: Den vollständigen Prozess einer HTTP-Anfrage vom Absenden bis zur Rückgabe verstehen
- **Verständnis der Verantwortlichkeiten jeder Schicht**: DNS, TCP, Load Balancer, Web-Server, App-Server, Datenbank — wer macht was
- **Problemlösungsfähigkeit**: Bei langsamen oder fehlerhaften Anfragen wissen, wo man mit der Analyse beginnt
- **Performance-Optimierungsansätze**: Jede Schicht bietet Optimierungspotenzial — wissen, wo die Ansatzpunkte liegen

| Kapitel | Inhalt | Kernkonzept |
|-----|------|---------|
| **Kapitel 1** | Browser sendet Anfrage | DNS-Auflösung, TCP-Verbindung, HTTP-Anfrage |
| **Kapitel 2** | Netzwerkübertragung | Routing, CDN, Lastverteilung |
| **Kapitel 3** | Serververarbeitung | Web-Server, Anwendungslogik, Datenbankabfrage |
| **Kapitel 4** | Antwortrückgabe | Serialisierung, Kompression, Rendering |
| **Kapitel 5** | End-to-End-Optimierung | Caching, Wiederverwendung von Verbindungen, asynchrone Verarbeitung |

---

## 0. Übersicht: Überblick über durchlebt eine Anfrage

Eine Analogie zum Verständnis: Du bestellst online ein Buch. Dieser Prozess ist erstaunlich ähnlich zu einer HTTP-Anfrage.

| Anfrage-Phase | Buch-Bestellung-Analogie | Technische Entsprechung |
|---------|---------|---------|
| URL eingeben | Du sagst "Ich möchte zu Buchhandlung X" | Browser parst die URL |
| DNS-Auflösung | Im Stadtplan die Adresse der Buchhandlung suchen | Domainname → IP-Adresse |
| TCP-Verbindung | Zum Eingang der Buchhandlung gehen, die Tür öffnen | Drei-Wege-Handshake stellt Verbindung her |
| Anfrage senden | Dem Verkäufer sagen "Ich möchte das Buch X" | HTTP-Anfrage-Nachricht |
| Serververarbeitung | Verkäufer geht ins Lager, prüft Bestand, berechnet Preis | Anwendungslogik + Datenbankabfrage |
| Antwort zurückgeben | Verkäufer übergibt das Buch | HTTP-Antwort-Nachricht |
| Browser-Rendering | Du öffnest das Buch und liest | HTML/CSS/JS Parsing und Rendering |

<RequestJourneyFlow />

---

## 1. Der Browser sendet die Anfrage

### 1.1 URL-Parsing

Wenn du `https://api.example.com/books?id=123` eingibst, zerlegt der Browser die Adresse in mehrere Teile:

| Teil | Wert | Bedeutung |
|-----|-----|------|
| Protokoll | `https` | Verschlüsselte Kommunikation |
| Domainname | `api.example.com` | Der "Name" des Servers |
| Pfad | `/books` | Die angeforderte Ressource |
| Query-Parameter | `id=123` | Zusätzliche Bedingungen |

### 1.2 DNS-Auflösung: Domainname → IP-Adresse

Computer verstehen keine Domainnamen, sondern nur IP-Adressen (wie `93.184.216.34`). DNS ist das "Telefonbuch" des Internets.

```
Browser-Cache → System-Cache → Router-Cache → ISP-DNS → Root-Nameserver
     ↓ Bei Treffer direkt verwenden, bei Fehlschlag auf der nächsten Ebene suchen
```

::: tip Die Bedeutung des DNS-Caching
Wenn jede Anfrage beim Root-Nameserver beginnen müsste, würde das globale Internet unter DNS-Abfragen zusammenbrechen. Deshalb gibt es auf jeder Ebene Caches, und die meisten Anfragen können bereits im Browser oder auf Systemebene aufgelöst werden.
:::

### 1.3 TCP-Drei-Wege-Handshake

Nachdem die IP-Adresse gefunden wurde, muss der Browser eine Verbindung zum Server "aufbauen". TCP verwendet einen Drei-Wege-Handshake, um sicherzustellen, dass beide Seiten bereit sind:

```
Client → Server: Hallo, ich möchte mich verbinden (SYN)
Server → Client: Gut, ich bin bereit (SYN + ACK)
Client → Server: Verstanden, Kommunikation beginnen (ACK)
```

Bei HTTPS ist ein zusätzlicher TLS-Handshake zur Aushandlung der Verschlüsselungsmethode erforderlich.

### 1.4 HTTP-Anfrage senden

Nach Verbindungsaufbau sendet der Browser die HTTP-Anfrage-Nachricht:

```http
GET /books?id=123 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbGci...
User-Agent: Chrome/120.0
```

| Bestandteil | Inhalt |
|---------|------|
| Anfragezeile | Methode (GET) + Pfad + Protokollversion |
| Anfrage-Header | Metainformationen: Authentifizierung, erwartetes Datenformat usw. |
| Anfragetext | Nur bei POST/PUT-Anfragen, enthält die zu übermittelnden Daten |

---

## 2. Netzwerkübertragung: Die Anfrage ist unterwegs

### 2.1 Routing und Weiterleitung

Nach dem Verlassen deines Computers durchläuft die Anfrage mehrere Router, ähnlich wie ein Paket mehrere Verteilzentren passiert:

```
Dein Computer → Heimrouter → Provider-Netzwerk → Backbone → Zielrechenzentrum
```

Jeder Router entscheidet anhand der IP-Adresse, wohin der nächste "Hop" geht. Mit dem Befehl `traceroute` kann man anzeigen, welche Knoten die Anfrage passiert.

### 2.2 CDN-Beschleunigung

Wenn die Zielwebsite ein CDN (Content Delivery Network) verwendet, muss die Anfrage möglicherweise nicht den Ursprungsserver erreichen:

| Szenario | Richtung |
|-----|------|
| Statische Ressourcen (Bilder, CSS, JS) | CDN-Edge-Knoten antwortet direkt |
| Dynamische Daten (API) | Durchdringt das CDN, erreicht den Ursprungsserver |

CDN bedeutet im Kern: "Inhalte im Voraus dorthin bringen, wo die Nutzer am nächsten sind."

### 2.3 Lastverteilung

Große Websites haben nie nur einen Server. Der Load Balancer verteilt Anfragen auf mehrere Server:

```
Benutzeranfrage → Load Balancer → Server A (30% Traffic)
                      → Server B (30% Traffic)
                      → Server C (40% Traffic)
```

Häufige Verteilungsstrategien:

| Strategie | Prinzip | Anwendungsszenario |
|-----|------|---------|
| Round-Robin | Reihenverteilen | Gleiche Serverkonfiguration |
| Weighted Round-Robin | Nach Gewichten verteilen | Unterschiedliche Serverkonfiguration |
| IP-Hash | Gleicher Nutzer immer auf denselben Server | Session-Persistenz erforderlich |
| Least Connections | An den Server mit den wenigsten Verbindungen | Unterschiedliche Anfrageverarbeitungsdauern |

---

## 3. Serververarbeitung: Überblick über passiert in der "Küche"

Nach dem Eintreffen auf dem Server durchläuft die Anfrage mehrere Verarbeitungsschichten.

### 3.1 Web-Server (Nginx / Apache)

Der erste Empfänger der Anfrage ist in der Regel der Web-Server. Er ist verantwortlich für:

| Aufgabe | Beschreibung |
|-----|------|
| Statische Dateien | HTML, CSS, JS, Bilder direkt ausliefern |
| Reverse Proxy | API-Anfragen an das Backend weiterleiten |
| SSL-Terminierung | HTTPS-Ver-/Entschlüsselung übernehmen |
| Anfrage-Filterung | Bösartige Anfragen blockieren, Rate-Limiting |

### 3.2 App-Server-Verarbeitung

Der Web-Server leitet die Anfrage an den App-Server (Node.js, Spring, Django usw.) weiter. Der Verarbeitungsablauf:

```
Anfrage eingegangen → Middleware-Kette → Routing-Matching → Controller → Service-Schicht → Datenzugriffsschicht
```

**Middleware** erledigt folgende Aufgaben:

1. Anfragetext parsen (JSON, Formulardaten)
2. Identität verifizieren (Token prüfen)
3. Berechtigungen prüfen (Darf dieser Nutzer auf dieses Interface zugreifen?)
4. Logging (Wer hat wann worauf zugegriffen)

### 3.3 Datenbankabfrage

Die meisten Anfragen müssen letztendlich mit der Datenbank kommunizieren:

```
Anwendungscode: SELECT * FROM books WHERE id = 123
    ↓
Datenbank-Engine: SQL parsen → Abfrageoptimierung → Ausführungsplan → Daten lesen
    ↓
Rückgabe: { id: 123, title: "xxx", price: 59.9 }
```

::: tip Die Datenbank ist der häufigste Performance-Engpass
Netzwerkübertragung liegt typischerweise im Millisekundenbereich, die Anwendungslogik ist ebenfalls schnell. Aber eine Datenbankabfrage ohne Index kann mehrere Sekunden oder gar Zehntelsekunden dauern. Deshalb sind "langsame Anfragen" meistens langsame Datenbankabfragen.
:::

---

## 4. Antwortrückgabe: Der Rückweg der Daten

### 4.1 HTTP-Antwort konstruieren

Nach Abschluss der Verarbeitung konstruiert der Server die Antwort-Nachricht:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Encoding: gzip
Cache-Control: max-age=3600

{"id": 123, "title": "xxx", "price": 59.9}
```

| Bestandteil | Inhalt |
|---------|------|
| Statuszeile | Protokollversion + Statuscode (200 Erfolg, 404 Nicht gefunden, 500 Serverfehler) |
| Antwort-Header | Datenformat, Cache-Strategie, Kompressionsmethode usw. |
| Antworttext | Die tatsächlichen Daten (JSON, HTML usw.) |

### 4.2 Datenkompression

Der Server komprimiert den Antworttext in der Regel mit gzip oder Brotli, um die Übertragungsmenge zu reduzieren:

| Kompressionsalgorithmus | Kompressionsrate | Geschwindigkeit |
|---------|--------|------|
| gzip | ca. 70% | Schnell |
| Brotli | ca. 80% | Etwas langsamer, aber bessere Kompression |

Ein 100KB großes JSON kann nach der Kompression nur noch 20-30KB groß sein.

### 4.3 Browser-Rendering

Nach Empfang der Antwort führt der Browser folgende Schritte aus:

1. **HTML parsen** → DOM-Baum aufbauen
2. **CSS parsen** → Style-Baum aufbauen
3. **Kombinieren** → Render-Baum generieren
4. **Layout** → Position und Größe jedes Elements berechnen
5. **Painting** → Pixel auf den Bildschirm zeichnen

<RequestTimeline />

---

## 5. End-to-End-Optimierung: Jede Schicht kann schneller werden

### 5.1 Optimierungsmaßnahmen auf jeder Ebene

| Ebene | Optimierungsmaßnahme | Wirkung |
|-----|---------|------|
| DNS | DNS-Prefetching, schnellen DNS-Dienst nutzen | DNS-Abfragezeit reduzieren |
| Netzwerk | CDN, HTTP/2, Wiederverbindung | Übertragungslatenz reduzieren |
| Server | Caching (Redis), asynchrone Verarbeitung | Verarbeitungszeit reduzieren |
| Datenbank | Indizes, Abfrageoptimierung, Read/Write-Splitting | Abfragezeit reduzieren |
| Frontend | Lazy Loading, Code-Splitting, Ressourcenkompression | Rendering-Zeit reduzieren |

### 5.2 Caching: Die wirksamste Optimierung

Caching existiert auf jeder Ebene der Anfragekette:

```
Browser-Cache → CDN-Cache → Reverse-Proxy-Cache → Anwendungs-Cache (Redis) → Datenbank-Cache
```

::: tip Die Essenz des Caching
Raum gegen Zeit eintauschen. Berechnete Ergebnisse speichern und beim nächsten Mal direkt wiederverwenden, ohne sie neu zu berechnen. Eine Steigerung der Cache-Hit-Rate um 10% kann die Systemleistung um ein Vielfaches steigern.
:::

### 5.3 Vorgehen bei fehlgeschlagenen Anfragen

| Symptom | Mögliche Problemschicht | Analyse-Methode |
|-----|------------|---------|
| Keine Antwort | DNS / Netzwerk | ping, nslookup |
| Verbindungs-Timeout | Netzwerk / Server down | telnet, curl |
| 4xx-Antwort | Client-Anfrage fehlerhaft | URL, Parameter, Token prüfen |
| 5xx-Antwort | Interner Serverfehler | Server-Logs prüfen |
| Sehr langsame Antwort | Datenbank / Anwendungslogik | Slow-Query-Logs, APM-Tools |

---

## 6. Zusammenfassung

Die vollständige Reise einer HTTP-Anfrage:

1. **Browser**: URL parsen → DNS-Abfrage → TCP-Verbindung → Anfrage senden
2. **Netzwerk**: Routing → CDN-Prüfung → Load-Balancer-Verteilung
3. **Server**: Web-Server empfängt → Middleware-Verarbeitung → Geschäftslogik → Datenbankabfrage
4. **Rückgabe**: Antwort konstruieren → Kompression → Netzwerkübertragung → Browser-Rendering

::: tip Der Wert der ganzheitlichen Perspektive
Wenn du die vollständige Anfragekette im Kopf visualisieren kannst, kannst du bei jedem Problem schnell identifizieren, auf welcher Ebene es liegt. Das ist der entscheidende Schritt vom "Junior-Entwickler" zum "selbstständigen Problemlöser".
:::

---

## Weiterführende Literatur

- [HTTP Referenzhandbuch](https://developer.mozilla.org/de/docs/Web/HTTP) — MDN HTTP-Dokumentation
- [High Performance Browser Networking](https://hpbn.co/) — Browser-Netzwerk-Performance-Optimierung
- [What happens when...](https://github.com/alex/what-happens-when) — Der Klassiker "Was passiert, wenn man eine URL eingibt"
