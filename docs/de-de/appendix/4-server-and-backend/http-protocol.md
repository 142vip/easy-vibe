# HTTP-Protokoll: Kommunikationsgrundlagen

::: tip Kernfrage
**Wie funktioniert HTTP?** Das ist wie die Frage: Wie kommunizieren zwei Personen? Man braucht eine vereinbarte Sprache, Grammatik und Gesprächsregeln. HTTP ist das "Gesprächsprotokoll" zwischen Frontend und Backend.
:::

---

## 0. Die Essenz von HTTP

**HTTP** (HyperText Transfer Protocol, Hypertext-Übertragungsprotokoll) ist das Basisprotokoll für die Kommunikation zwischen Frontend und Backend.

### 0.1 Analogie mit einem Gespräch

| Gesprächselement | HTTP-Entsprechung | Beschreibung |
| :--- | :--- | :--- |
| Sprache | HTTP-Protokoll | Eine Sprache, die beide Seiten verstehen |
| Grammatik | Anfrage-/Antwortformat | Wie man "spricht" |
| Ablauf | Anfrage-Antwort-Modus | Frage und Antwort |
| Beendigung | Auflegen | TCP-Verbindung wird geschlossen |

---

## 1. Die Entwicklung von HTTP

HTTP wurde 1991 eingeführt und hat seitdem mehrere bedeutende Upgrades durchlaufen.

<HttpProtocolDemo />

### 1.1 Versionsvergleich

| Version | Jahr | Kernverbesserung | Typisches Merkmal |
| :--- | :--- | :--- | :--- |
| **HTTP/0.9** | 1991 | Nur GET unterstützt | Nur Text, nur Anfragen, keine Response-Header |
| **HTTP/1.0** | 1996 | POST/HEAD hinzugefügt | Jede Anfrage benötigt eine eigene TCP-Verbindung |
| **HTTP/1.1** | 1997 | Persistente Verbindungen | Keep-Alive, mehrere Anfragen über eine Verbindung |
| **HTTP/2** | 2015 | Multiplexing | Binäre Frames, Header-Kompression |
| **HTTP/3** | 2022 | Basierend auf QUIC | UDP-Transport, löst Head-of-Line-Blocking |

::: tip Warum braucht man HTTP/2?
HTTP/1.1 unterstützt zwar persistente Verbindungen, aber Anfragen müssen seriell gesendet werden (die nächste Anfrage kann erst gesendet werden, wenn die Antwort auf die vorherige vorliegt). HTTP/2 löst dieses Problem durch Multiplexing — mehrere Anfragen können gleichzeitig gesendet werden.
:::

---

## 2. Die Struktur einer HTTP-Anfrage

### 2.1 Anfragezeile

```http
GET /api/users/123 HTTP/1.1
```

Besteht aus drei Teilen:
- **Methode**: GET, POST, PUT, DELETE usw.
- **URL**: Der Ressourcenpfad der Anfrage
- **Version**: HTTP/1.1 oder HTTP/2

### 2.2 Anfrage-Header

```http
Host: api.example.com
User-Agent: Mozilla/5.0
Accept: application/json
Authorization: Bearer xxx
Content-Type: application/json
Content-Length: 45
```

Häufige Anfrage-Header:
| Header | Beschreibung | Beispiel |
| :--- | :--- | :--- |
| **Host** | Server-Domainname | `api.example.com` |
| **User-Agent** | Client-Informationen | `Mozilla/5.0` |
| **Accept** | Akzeptierter Antworttyp | `application/json` |
| **Authorization** | Authentifizierungsinformationen | `Bearer token` |
| **Content-Type** | Anfragetext-Typ | `application/json` |

### 2.3 Anfragetext

```json
{
  "name": "Max Müller",
  "email": "max@example.com"
}
```

Nur POST, PUT, PATCH und andere Methoden haben einen Anfragetext.

---

## 3. Die Struktur einer HTTP-Antwort

### 3.1 Statuszeile

```http
HTTP/1.1 200 OK
```

Besteht aus drei Teilen:
- **Version**: HTTP/1.1
- **Statuscode**: 200, 404, 500 usw.
- **Statustext**: OK, Not Found usw.

### 3.2 Antwort-Header

```http
Content-Type: application/json
Content-Length: 156
Cache-Control: max-age=3600
Set-Cookie: session=xxx; HttpOnly
```

Häufige Antwort-Header:
| Header | Beschreibung | Beispiel |
| :--- | :--- | :--- |
| **Content-Type** | Antworttext-Typ | `application/json` |
| **Content-Length** | Antworttext-Größe | `156` |
| **Cache-Control** | Cache-Strategie | `max-age=3600` |
| **Set-Cookie** | Cookie setzen | `session=xxx` |

### 3.3 Antworttext

```json
{
  "code": 0,
  "data": {
    "id": 123,
    "name": "Max Müller"
  }
}
```

---

## 4. HTTP-Methoden im Detail

| Methode | Zweck | Anfragetext | Idempotenz | Sicherheit |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | Ressource abrufen | Keiner | Ja | Ja |
| **POST** | Ressource erstellen | Ja | Nein | Nein |
| **PUT** | Vollständige Aktualisierung | Ja | Ja | Nein |
| **PATCH** | Teilaktualisierung | Ja | Nein | Nein |
| **DELETE** | Ressource löschen | Keiner | Ja | Nein |
| **HEAD** | Nur Header abrufen | Keiner | Ja | Ja |
| **OPTIONS** | Unterstützte Methoden abfragen | Keiner | Ja | Ja |

### 4.1 GET vs. POST

| Eigenschaft | GET | POST |
| :--- | :--- | :--- |
| **Parameterposition** | URL-Query-Parameter | Anfragetext |
| **Caching** | Cachebar | Standardmäßig nicht cachebar |
| **Lesezeichen** | Als Lesezeichen speicherbar | Nicht speicherbar |
| **Verlauf** | Im Browserverlauf gespeichert | Nicht gespeichert |
| **Datenlänge** | Begrenzt (URL-Länge) | Unbegrenzt |
| **Sicherheit** | Parameter sichtbar in der URL | Parameter im Anfragetext |

::: tip Wann GET/POST verwenden?
- **GET**: Abfragen, Daten abrufen
- **POST**: Erstellen, Daten übermitteln
- **PUT**: Vollständige Aktualisierung (gesamte Ressource ersetzen)
- **PATCH**: Teilaktualisierung (nur bestimmte Felder ändern)
- **DELETE**: Ressource löschen
:::

---

## 5. HTTP-Statuscodes

### 5.1 Statuscode-Kategorien

| Kategorie | Beschreibung | Typische Statuscodes |
| :--- | :--- | :--- |
| **2xx** | Erfolg | 200 OK, 201 Created, 204 No Content |
| **3xx** | Umleitung | 301 Permanent, 302 Temporär, 304 Nicht geändert |
| **4xx** | Client-Fehler | 400 Parameterfehler, 401 Nicht authentifiziert, 404 Nicht gefunden |
| **5xx** | Server-Fehler | 500 Interner Fehler, 503 Nicht verfügbar |

### 5.2 Häufige Statuscodes

| Statuscode | Beschreibung | Verwendungsszenario |
| :--- | :--- | :--- |
| **200 OK** | Anfrage erfolgreich | GET, PUT-Anfrage erfolgreich |
| **201 Created** | Erstellt | POST hat Ressource erfolgreich erstellt |
| **204 No Content** | Kein Inhalt | DELETE erfolgreich durchgeführt |
| **301 Moved Permanently** | Permanente Umleitung | URL dauerhaft geändert |
| **302 Found** | Temporäre Umleitung | URL vorübergehend geändert |
| **304 Not Modified** | Nicht geändert | Cache noch gültig |
| **400 Bad Request** | Parameterfehler | Anfrageparameter im falschen Format |
| **401 Unauthorized** | Nicht authentifiziert | Anmeldung erforderlich |
| **403 Forbidden** | Keine Berechtigung | Angemeldet, aber unzureichende Rechte |
| **404 Not Found** | Nicht vorhanden | Ressource existiert nicht |
| **500 Internal Server Error** | Interner Fehler | Server-Ausnahme |
| **503 Service Unavailable** | Nicht verfügbar | Server-Wartung oder Überlastung |

---

## 6. HTTPS: Sicheres HTTP

### 6.1 HTTP vs. HTTPS

| Eigenschaft | HTTP | HTTPS |
| :--- | :--- | :--- |
| **Protokoll** | TCP | TCP + SSL/TLS |
| **Port** | 80 | 443 |
| **Daten** | Klartextübertragung | Verschlüsselte Übertragung |
| **Zertifikat** | Nicht erforderlich | SSL-Zertifikat erforderlich |
| **Performance** | Etwas schneller | Etwas langsamer (Handshake-Overhead) |
| **SEO** | Kein Einfluss | Bevorzugt von Suchmaschinen indexiert |

### 6.2 Der Ablauf von HTTPS

1. **Client Hello**: Client sendet unterstützte Cipher Suites
2. **Server Hello**: Server gibt Zertifikat und gewähltes Cipher Suite zurück
3. **Zertifikatsüberprüfung**: Client verifiziert die Gültigkeit des Serverzertifikats
4. **Schlüsselaustausch**: Asymmetrische Verschlüsselung zum Austausch des Session-Schlüssels
5. **Verschlüsselte Kommunikation**: Symmetrische Verschlüsselung mit dem Session-Schlüssel

::: tip Vorteile von HTTPS
- **Abhöhschutz**: Daten sind verschlüsselt, Dritte können sie nicht lesen
- **Manipulationsschutz**: Datenintegritätsprüfung
- **Identitätsprüfung**: SSL-Zertifikat verifiziert die Serveridentität
:::

---

## 7. HTTP-Caching-Mechanismen

### 7.1 Cache-Header

| Header | Beschreibung | Beispiel |
| :--- | :--- | :--- |
| **Cache-Control** | Cache-Strategie | `max-age=3600` |
| **ETag** | Ressourcen-Versionsnummer | `"33a64df551425fcc"` |
| **Last-Modified** | Letzte Änderung | `Wed, 21 Oct 2015 07:28:00 GMT` |

### 7.2 Cache-Strategien

**Strong Cache**:
```http
Cache-Control: max-age=3600
```
Innerhalb von 3600 Sekunden verwendet der Browser direkt den Cache, ohne eine Anfrage zu senden.

**Negotiated Cache**:
```http
ETag: "33a64df551425fcc"
```
Der Browser sendet `If-None-Match`, der Server gibt 304 (nicht geändert) oder 200 (geändert) zurück.

---

## 8. Häufige Fragen

### 8.1 Der wesentliche Unterschied zwischen GET und POST

**Missverständnis**: Der Unterschied zwischen GET und POST liegt nur in der Position der Parameter.

**Die Wahrheit**:
- GET ist idempotent, mehrfache Anfragen liefern dasselbe Ergebnis
- POST ist nicht idempotent, mehrfache Anfragen können mehrere Ressourcen erstellen
- GET kann gecacht werden, POST standardmäßig nicht
- GET kann als Lesezeichen gespeichert werden, POST nicht

### 8.2 Head-of-Line-Blocking bei HTTP/1.1

**Problem**: HTTP/1.1 unterstützt zwar persistente Verbindungen, aber Anfragen müssen seriell gesendet werden. Wenn die Antwort auf eine vorherige Anfrage langsam ist, müssen alle nachfolgenden Anfragen warten.

**Lösungen**:
- HTTP/2 Multiplexing
- Domain-Sharding (mehrere Domains für mehrere Verbindungen)
- Connection-Pooling (Begrenzung der gleichzeitigen Verbindungen)

### 8.3 Die Vorteile von HTTP/2

| Eigenschaft | HTTP/1.1 | HTTP/2 |
| :--- | :--- | :--- |
| **Übertragungsformat** | Text | Binäre Frames |
| **Multiplexing** | Nicht unterstützt | Unterstützt |
| **Header-Kompression** | Keine | HPACK-Algorithmus |
| **Server-Push** | Nicht unterstützt | Unterstützt |

---

## Glossar

| Begriff | Englisch | Erklärung |
| :--- | :--- | :--- |
| **HTTP** | HyperText Transfer Protocol | Hypertext-Übertragungsprotokoll |
| **HTTPS** | HTTP Secure | HTTP + SSL/TLS |
| **TCP** | Transmission Control Protocol | Transmissionssteuerungsprotokoll |
| **SSL/TLS** | Secure Sockets Layer | Secure Sockets Layer / Transport Layer Security |
| **Idempotenz** | Idempotent | Mehrfache Anfragen liefern dasselbe Ergebnis |
| **Persistente Verbindung** | Keep-Alive | Mehrere Anfragen über eine TCP-Verbindung |
| **Multiplexing** | Multiplexing | Gleichzeitiges Senden mehrerer Anfragen |
| **Head-of-Line-Blocking** | Head-of-Line Blocking | Vordere Anfragen blockieren hintere Anfragen |
