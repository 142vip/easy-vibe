# API-Design: Schnittstellenprinzipien

::: tip 🎯 Kernfrage
**Wie kommunizieren Frontend und Backend effizient miteinander?** Das ist wie die Frage: Wie sollte die Speisekarte eines Restaurants gestaltet sein, damit die Gäste sie sofort verstehen? Wie merkt sich der Kellner die Bestellungen, ohne Fehler zu machen? Wie wird das Servieren standardisiert, damit die Gäste zufrieden sind? API-Design löst das Problem der "Kommunikationsregeln".
:::

---

## Typische Szenarien und Schmerzpunkte

**Szenario 1: Beliebige Benennung von Schnittstellen**

```
GET /getUserData
GET /fetchUserInfo
GET /queryUserById
GET /users/query
```

Vier Schnittstellen, gleiche Funktion, völlig unterschiedliche Benennungsstile. Neue Mitarbeiter stehen vor einem Rätsel: Welche soll ich verwenden?

**Szenario 2: Fehlerbehandlung ist chaotisch**

```json
// Manche geben den HTTP-Statuscode zurück
HTTP/1.1 404 Not Found

// Manche geben 200 + code zurück
HTTP/1.1 200 OK
{ "code": 404, "message": "Benutzer nicht gefunden" }

// Manche werfen einfach eine Ausnahme
HTTP/1.1 200 OK
{ "error": "Ein Fehler ist aufgetreten" }
```

Das Frontend weiß nicht, wie es feststellen soll, ob die Anfrage erfolgreich war.

**Szenario 3: Die Antwortstruktur ist bei jedem unterschiedlich**

```json
// Schnittstelle A
{ "data": { ... } }

// Schnittstelle B
{ "result": { ... } }

// Schnittstelle C
{ "content": { ... } }
```

Jede Schnittstelle hat ein anderes Rückgabeformat. Das Frontend muss jede Schnittstelle einzeln behandeln.

---

**Gutes API-Design ist wie das Bestellsystem eines Restaurants** — klare Speisekarte, standardisierte Abläufe, hilfreiche Fehlermeldungen.

---

## 1. Was ist eine API

**API** (Application Programming Interface, Schnittstelle zur Anwendungsprogrammierung) ist die "Vereinbarung für die Kommunikation zwischen Programmen".

### 1.1 Analogie mit einem Restaurant

| Restaurant-Rolle | Entsprechendes Konzept | Beschreibung |
| :--- | :--- | :--- |
| Speisekarte | API-Dokumentation | Sagt dir, welche "Gerichte" bestellt werden können |
| Kellner | HTTP-Protokoll | Standardisierte "Kommunikationsweise" |
| Küche | Server | Verarbeitet "Bestellungen" |
| Servieren | Antwort | Liefert das Ergebnis an den "Gast" |

### 1.2 Eine vollständige API-Anfrage

👇 **Probier es aus**: Klicke auf die Schaltfläche unten und beobachte den vollständigen Ablauf einer API-Anfrage-Antwort:

<ApiRequestDemo />

---

## 2. API-Design-Philosophie: RPC / REST / GraphQL / gRPC

Bevor wir uns mit dem konkreten RESTful-Design befassen, lassen Sie uns vier vorherrschende API-Designstile kennenlernen:

<ApiStyleCompare />

### 2.1 REST vs RESTful: Überblick über ist der Unterschied

Viele verwechseln diese beiden Konzepte:

| Konzept | Bedeutung | Beschreibung |
| :--- | :--- | :--- |
| **REST** | Ein Architekturstil | Ein von Roy Fielding vorgeschlagenes Designkonzept mit einer Reihe von Einschränkungen |
| **RESTful** | Entspricht dem REST-Stil | Adjektiv, bedeutet, dass das API-Design den REST-Prinzipien folgt |

**Analogie**:
- REST ist wie "Minimalismus" — ein Designkonzept
- Eine RESTful-API ist wie ein " minimalistisch eingerichteter Raum" — eine konkrete Umsetzung dieses Konzepts

**Die sechs Einschränkungen von REST**:

| Einschränkung | Beschreibung |
| :--- | :--- |
| **Client-Server-Trennung** | Frontend und Backend werden unabhängig voneinander entwickelt, Schnittstellen sind entkoppelt |
| **Zustandslosigkeit** | Jede Anfrage enthält alle notwendigen Informationen, der Server speichert keinen Sitzungsstatus |
| **Cachebarkeit** | Antworten sollten angeben, ob sie zwischengespeichert werden können, um die Leistung zu verbessern |
| **Einheitliche Schnittstelle** | Verwendung standardmäßiger HTTP-Methoden und Statuscodes |
| **Schichtensystem** | Der Client muss nicht wissen, mit welcher Server-Schicht er verbunden ist |
| **Code on Demand** (optional) | Der Server kann die Client-Funktionalität erweitern |

::: tip 💡 Warum ist REST am weitesten verbreitet?
1. **Niedrige Lernkurve**: Das HTTP-Protokoll selbst verkörpert bereits das REST-Konzept
2. **Ausgereiftes Ökosystem**: Reichhaltige Tools, Frameworks und Dokumentation
3. **Hohe Universalität**: Jede Sprache, jede Plattform kann es aufrufen
4. **Einfaches Caching**: GET-Anfragen sind von Natur aus cachebar, CDN-freundlich
:::

---

## 3. RESTful-Design: URLs zum Sprechen bringen

**REST** (Representational State Transfer) ist ein Architekturstil mit folgenden Kernideen:

- Dinge im Netzwerk als "Ressourcen" (Resource) abstrahieren
- Ressourcen durch URLs identifizieren
- Ressourcen durch HTTP-Methoden bearbeiten

### 3.1 Analogie mit einem Lagerhaus

| Lagerhaus-Konzept | REST-Entsprechung | Beispiel |
| :--- | :--- | :--- |
| Regaladresse | URL | `/users`, `/orders` |
| Bearbeitungsweise | HTTP-Methode | GET (ansehen), POST (einlagern) |
| Ware | Ressource | Benutzerdaten, Bestelldaten |

**Schlüsselprinzip**: URLs sind Substantive, keine Verben.

### 3.2 URL-Designregeln

| Regel | Falsches Beispiel | Richtiges Beispiel | Beschreibung |
| :--- | :--- | :--- | :--- |
| Substantive statt Verben | `/getUsers` | `/users` | URL repräsentiert Ressourcen, HTTP-Methoden repräsentieren Aktionen |
| Pluralform verwenden | `/user` | `/users` | Einheitlicher Pluralstil |
| Kleinschreibung + Bindestriche | `/UserProfiles` | `/user-profiles` | URLs sind case-sensitive |
| Zu tiefe Hierarchien vermeiden | `/a/b/c/d/e` | `/a/b/c` | Maximal 3 Ebenen |
| Filter mit Abfrageparametern | `/products/phone/5000` | `/products?cat=phone` | Filterbedingungen mit `?`-Parametern |

::: tip 💡 URLs sind case-sensitive
Kleinschreibung + Bindestriche (-) ist die sicherste Methode, um Verwirrung bei Groß-/Kleinschreibung und Inkonsistenzen beim Unterstrich-Stil zu vermeiden.
:::

### 3.3 HTTP-Methoden-Auswahl

| Methode | Zweck | Idempotenz | Sicherheit | Typische Szenarien |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | Ressource abrufen | Ja | Ja | Listen abfragen, Details anzeigen |
| **POST** | Ressource erstellen | Nein | Nein | Neuen Benutzer anlegen, Bestellung aufgeben |
| **PUT** | Vollständige Aktualisierung | Ja | Nein | Gesamte Benutzerdaten ersetzen |
| **PATCH** | Teilaktualisierung | Nein | Nein | Nur den Spitznamen ändern |
| **DELETE** | Ressource löschen | Ja | Nein | Benutzer löschen, Bestellung stornieren |

::: tip 💡 Was ist Idempotenz?
**Idempotenz**: Mehrmalige Ausführung führt zum gleichen Ergebnis.

- **Idempotente Operationen** (GET/PUT/DELETE): 10 Mal klicken hat das gleiche Ergebnis wie 1 Mal
- **Nicht-idempotente Operationen** (POST): 10 Mal klicken kann 10 Bestellungen erstellen

**Lösung**: POST-Operationen mit eindeutiger ID überprüfen, um doppelte Verarbeitung zu vermeiden.
:::

---

## 4. Statuscodes: Fehler zum "Sprechen" bringen

HTTP-Statuscodes sind die Standardmethode des Servers, dem Client mitzuteilen, "was passiert ist".

### 4.1 Statuscode-Kategorien

| Kategorie | Bedeutung | Typische Statuscodes |
| :--- | :--- | :--- |
| **2xx** | Erfolg | 200 OK, 201 Created, 204 No Content |
| **3xx** | Umleitung | 301 Permanent verschoben, 304 Nicht geändert |
| **4xx** | Client-Fehler | 400 Parameterfehler, 401 Nicht authentifiziert, 404 Nicht gefunden |
| **5xx** | Server-Fehler | 500 Interner Fehler, 503 Dienst nicht verfügbar |

### 4.2 Demo der häufigsten Statuscodes

👇 **Probier es aus**: Klicke auf die Schaltfläche unten, um die Bedeutung häufiger Statuscodes zu verstehen:

<StatusCodeDemo />

---

## 5. Fehlerbehandlung: Elegant "ablehnen"

Gute Fehlerbehandlung ermöglicht es dem Client, "den Statuscode zu sehen und zu wissen, was los ist", anstatt raten zu müssen.

### 4.1 "Fallen" bei der Fehlerbehandlung

**Falle 1: Alle Fehler geben 200 zurück**

```json
// ❌ Falsche Vorgehensweise
HTTP/1.1 200 OK
{ "error": "Ein Fehler ist aufgetreten" }
```

Problem: Die Caching-Schicht wird diese "erfolgreiche" Antwort zwischenspeichern, und das Überwachungssystem kann das Problem nicht erkennen.

**Falle 2: Fehlermeldungen sind zu vage**

```json
// ❌ Falsche Vorgehensweise
HTTP/1.1 400 Bad Request
{ "message": "Parameterfehler" }
```

Problem: Der Client weiß nicht, welcher Parameter falsch ist und warum.

**Falle 3: Vertrauliche Informationen preisgeben**

```json
// ❌ Gefährliche Vorgehensweise
HTTP/1.1 500 Internal Server Error
{ "stack": "at UserService.login...", "sql": "SELECT * FROM..." }
```

Gefahr: Die Codestruktur und Datenbankabfragen werden offengelegt, was Angreifer ausnutzen können.

### 5.2 Demo der richtigen Fehlerbehandlung

👇 **Probier es aus**: Vergleiche "gute" und "schlechte" Fehlerantwort-Designs:

<ErrorHandlingDemo />

---

## 6. Versionsverwaltung: "Abwärtskompatibilität" der API

### 6.1 Warum Versionsverwaltung

Szenario: Deine App hat 1 Million Benutzer und du musst die Bestellschnittstelle ändern.

**Ohne Versionsverwaltung**:
- Neue App ruft neue Schnittstelle auf → normal
- Alte App ruft neue Schnittstelle auf → fehlende Felder, Absturz!

**Richtige Vorgehensweise**:
- `/v1/orders` — alte Schnittstelle, bedient weiterhin die alte App
- `/v2/orders` — neue Schnittstelle, neue Funktionen hier

### 6.2 Strategien für die Versionsverwaltung

| Strategie | Beispiel | Vorteile | Nachteile |
| :--- | :--- | :--- | :--- |
| **URL-Pfad** | `/v1/users` | Intuitiv, einfach zu cachen | URL wird länger |
| **Anfrage-Header** | `Accept: vnd.api.v2+json` | Saubere URL | Schwerer zu debuggen |
| **Abfrageparameter** | `/users?version=2` | Einfach | Weniger standardisiert |

### 6.3 Beispiel für die Versionsentwicklung

Am Beispiel der Benutzerschnittstelle wird die Entwicklung von v1 zu v2 gezeigt:

| Schnittstelle | v1 (alte Version) | v2 (neue Version) | Änderungsbeschreibung |
| :--- | :--- | :--- | :--- |
| **Benutzer abrufen** | `GET /v1/users`<br>Rückgabe: `name, email` | `GET /v2/users`<br>Rückgabe: `name, email, avatar, phone` | Neue Felder für Avatar und Telefonnummer |
| **Bestellung erstellen** | `POST /v1/orders`<br>Akzeptiert: `items[]` | `POST /v2/orders`<br>Akzeptiert: `items[], coupons[]` | Unterstützung für Gutscheine hinzugefügt |
| **Stapelverarbeitung** | Keine | `POST /v2/orders/batch` | Neue Schnittstelle für Stapelerstellung |

::: tip 💡 Best Practices für die Versionsverwaltung
- **Abwärtskompatibilität beibehalten**: v1-Schnittstellen mindestens 6-12 Monate pflegen, um dem Client Zeit für Upgrades zu geben
- **Dokumentation synchron aktualisieren**: Jede Version hat eine eigene API-Dokumentation
- **Verfallsankündigung**: Vorab mitteilen, wann v1 abgeschaltet wird, und zur Migration auffordern
- **Nutzung überwachen**: v1-Aufrufstatistiken erfassen und erst sicher abschalten, wenn bestätigt ist, dass es sicher ist
:::

---

## 7. Antwortstruktur-Design

Die Antwortstruktur ist der "Datenvertrag" der Frontend-Backend-Zusammenarbeit. Ein einheitliches Format kann die Kommunikationskosten erheblich senken.

<ResponseStructureDemo />

### 7.1 Referenz: Best Practices großer Unternehmen

::: details Google API-Designrichtlinien
Gemäß [Google API Design Guide](https://cloud.google.com/apis/design/errors) verlangt Google, dass alle API-Fehlerantworten eine `google.rpc.Status`-Nachrichtenstruktur enthalten:

```json
{
  "error": {
    "code": 429,
    "message": "Ressourcen knapp, bitte versuchen Sie es später erneut",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.ErrorInfo",
        "reason": "RESOURCE_AVAILABILITY",
        "domain": "compute.googleapis.com",
        "metadata": {
          "zone": "us-east1-a",
          "service": "compute"
        }
      }
    ]
  }
}
```

**Kernanforderungen**:
- Muss `ErrorInfo` enthalten, um maschinenlesbare Fehlerkennungen bereitzustellen
- `message` richtet sich an Entwickler und beschreibt das Problem und die Lösung in knapper Sprache
- Das `details`-Array kann `LocalizedMessage` (lokalisierte Nachrichten), `Help` (Hilfelinks) usw. enthalten
:::

::: details Microsoft REST-API-Richtlinien
Gemäß [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md) betont Microsoft die Konsistenz von Antworten:

**Klassifizierung von Fehlern und Störungen**:
- **Fehler (Error)**: Client sendet ungültige Daten, gibt 4xx zurück, beeinträchtigt nicht die API-Verfügbarkeit
- **Störung (Fault)**: Server kann gültige Anfrage nicht korrekt beantworten, gibt 5xx zurück, beeinträchtigt die API-Verfügbarkeit

**Antwort-Header-Spezifikation**:
- `Date`: Muss zurückgegeben werden, RFC 5322-Format (GMT-Zeitzone)
- `Content-Type`: Muss zurückgegeben werden
- `ETag`: Muss für Ressourcen zurückgegeben werden, die optimistische Nebenläufigkeitssteuerung unterstützen
:::

::: details Alibaba Java-Entwicklungshandbuch
Gemäß [Alibaba Java Development Manual](https://developer.aliyun.com/special/tech-java) hat Alibaba folgende Spezifikationen für API-Antworten:

**Einheitliches Rückgabeobjekt**:
```java
public class Result<T> {
    private Integer code;
    private String message;
    private T data;
    private String requestId;
}
```

**Fehlercode-Segmentdesign**:
| Bereich | Typ | Beispiel |
| :--- | :--- | :--- |
| 0 | Erfolg | 0 |
| 1xxxx | Parameterfehler | 10001 Pflichtparameter fehlt |
| 2xxxx | Geschäftsfehler | 20001 Guthaben nicht ausreichend |
| 3xxxx | Authentifizierungsfehler | 30001 Nicht angemeldet |
| 5xxxx | Systemfehler | 50001 Datenbankausnahme |
:::

::: details Stripe API-Antwort-Design
Gemäß [Stripe API Documentation](https://docs.stripe.com/api/errors) ist das Stripe-Fehlerantwort-Design sehr detailliert:

```json
{
  "error": {
    "type": "card_error",
    "code": "card_declined",
    "message": "Your card was declined.",
    "param": "number",
    "decline_code": "insufficient_funds",
    "doc_url": "https://stripe.com/docs/error-codes/card-declined"
  }
}
```

**Design-Highlights**:
- `type` unterscheidet Fehlertypen: `api_error`, `card_error`, `invalid_request_error`
- `param` gibt an, welcher Parameter genau falsch ist, das Frontend kann das Formularfeld direkt lokalisieren
- `doc_url` bietet einen Dokumentationslink, Entwickler können sich tiefer informieren
- `decline_code` bietet feingranularere Fehlerursachen
:::

::: details JSON:API-Spezifikation
Gemäß [JSON:API Specification](https://jsonapi.org/format/) ist dies eine weithin akzeptierte JSON-API-Antwort-Spezifikation:

```json
{
  "data": {
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "JSON:API-Spezifikation im Detail"
    },
    "relationships": {
      "author": {
        "data": { "type": "users", "id": "9" }
      }
    }
  },
  "included": [
    {
      "type": "users",
      "id": "9",
      "attributes": {
        "name": "Max Mustermann"
      }
    }
  ]
}
```

**Kern-Design**:
- `data` enthält die Hauptressource, muss `type` und `id` haben
- `attributes` speichert Ressourcenattribute
- `relationships` beschreibt Ressourcenverknüpfungen
- `included` vermeidet doppelte Anfragen und liefert verknüpfte Daten auf einmal
:::

::: details GitHub REST-API-Antwort-Design
Gemäß [GitHub REST API Documentation](https://docs.github.com/en/rest) legt das GitHub-Antwort-Design Wert auf Entwicklererfahrung:

**Erfolgsantwort**:
```json
{
  "id": 1296269,
  "node_id": "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
  "name": "Hello-World",
  "full_name": "octocat/Hello-World",
  "owner": {
    "login": "octocat",
    "id": 1,
    "avatar_url": "https://github.com/images/error/octocat_happy.gif"
  },
  "private": false,
  "html_url": "https://github.com/octocat/Hello-World"
}
```

**Fehlerantwort**:
```json
{
  "message": "Bad credentials",
  "documentation_url": "https://docs.github.com/rest"
}
```

**Design-Highlights**:
- Antwort enthält verschiedene URL-Formate (`html_url`, `url`) für unterschiedliche Verwendungszwecke
- Fehlerantwort enthält `documentation_url`, das auf die Dokumentation verweist
- Verwendet `Link`-Antwort-Header für die Paginierungsnavigation
:::

::: details Twitter/X API v2-Antwort-Design
Gemäß [Twitter API v2 Documentation](https://developer.twitter.com/en/docs/twitter-api) verwendet die Twitter API v2 ein schlankes Antwortformat:

```json
{
  "data": {
    "id": "1460323737035677698",
    "text": "Hello, Twitter!"
  },
  "includes": {
    "users": [
      {
        "id": "2244994945",
        "name": "Twitter Dev",
        "username": "TwitterDev"
      }
    ]
  }
}
```

**Design-Highlights**:
- `data` enthält die Hauptdaten, `includes` enthält verknüpfte Daten (ähnlich wie JSON:API)
- Unterstützt Feldauswahl: `?tweet.fields=created_at,public_metrics`
- Paginierung verwendet `next_token` und `previous_token`
:::

### 7.2 Zusammenfassung der Best Practices

Unter Berücksichtigung der obigen Spezifikationen sollte das Antwortstruktur-Design folgenden Prinzipien folgen:

1. **Konsistenz zuerst**: Alle Schnittstellen verwenden die gleiche Antwortstruktur, das Frontend kann eine einheitliche Anfrageschicht kapseln
2. **Maschinenlesbar**: Fehlercode + Fehlerursache (reason) ermöglichen es Programmen, automatisch zu reagieren
3. **Menschenfreundlich**: message beschreibt klar und enthält Lösungsvorschläge
4. **Nachverfolgbar**: request_id durchläuft die gesamte Anfragekette, erleichtert die Problemlokalisierung
5. **Internationalisierungsunterstützung**: Durch details-Erweiterung lokalisierte Nachrichten bereitstellen

### 7.3 Datenfeld-Design-Spezifikation

`data` ist der Kern der Antwort, sein Design beeinflusst direkt die Frontend-Entwicklungseffizienz.

<DataFieldDesignDemo />

### 7.4 Erweitertes Fehlerantwort-Design

<ErrorResponseDesignDemo />

::: tip Referenzlinks
- [Google API Design Guide - Errors](https://cloud.google.com/apis/design/errors)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)
- [Alibaba Java-Entwicklungshandbuch](https://developer.aliyun.com/special/tech-java)
- [Heroku HTTP API Design Guide](https://github.com/interagent/http-api-design)
- [Stripe API - Errors](https://docs.stripe.com/api/errors)
- [JSON:API Specification](https://jsonapi.org/format/)
:::

---

## 8. Praxis: E-Commerce-System API-Design-Beispiel

```
# Benutzermodul
GET    /v1/users                    # Benutzerliste abrufen
POST   /v1/users                    # Neuen Benutzer erstellen
GET    /v1/users/{id}               # Benutzerdetails abrufen
PUT    /v1/users/{id}               # Benutzer vollständig aktualisieren
PATCH  /v1/users/{id}               # Benutzer teilweise aktualisieren
DELETE /v1/users/{id}               # Benutzer löschen

# Bestellmodul
GET    /v1/users/{id}/orders        # Bestellungen eines Benutzers abrufen
POST   /v1/orders                   # Bestellung erstellen
GET    /v1/orders/{id}              # Bestelldetails abrufen
PATCH  /v1/orders/{id}/status       # Bestellstatus aktualisieren

# Produktmodul (komplexe Filter mit Abfrageparametern)
GET    /v1/products?category=phone&price_max=5000&sort=price_desc&page=1
```

---

## 9. API-Design mit KI-Unterstützung

KI kann helfen, schnell ein normkonformes API-Design zu erstellen. Der Schlüssel liegt darin, klaren Kontext und Einschränkungen bereitzustellen.

### 9.1 Prompt-Vorlage

```
Du bist ein erfahrener Backend-Architekt mit Expertise in RESTful-API-Design. Bitte entwerfe eine Reihe von API-Schnittstellen für mich.

## Geschäftshintergrund
[Beschreibe dein Geschäftsszenario, z.B.: E-Commerce-System, Blog-Plattform, Aufgabenverwaltung etc.]

## Funktionale Anforderungen
[Liste die benötigten Funktionsmodule auf, z.B.:
- Benutzerverwaltung: Registrierung, Anmeldung, persönliche Informationen
- Bestellverwaltung: Bestellung erstellen, Bestellungen abfragen, Bestellung stornieren
- Produktverwaltung: Produktliste, Produktdetails, Suche]

## Designanforderungen
1. Befolge die RESTful-Spezifikation
2. URLs verwenden Substantive im Plural, Kleinschreibung + Bindestriche
3. Korrekte Verwendung von HTTP-Methoden (GET/POST/PUT/PATCH/DELETE)
4. Einheitliches Antwortformat: { code, message, data, request_id }
5. Angemessene Verwendung von Statuscodes
6. Versionsverwaltung: URL-Pfad-Methode (/v1/)

## Ausgabeformat
Bitte im folgenden Format ausgeben:

### Schnittstellenliste
| Methode | URL | Beschreibung | Anfragekörper | Antwortkörper |
|------|-----|------|--------|--------|

### Anfrage-/Antwortbeispiele
[Detailbeispiele für wichtige Schnittstellen]

### Statuscode-Erklärung
[Verwendete Statuscodes und ihre Bedeutung]
```

### 9.2 Praxisbeispiel: E-Commerce-Bestell-API

**Eingabe-Prompt**:

```
Du bist ein erfahrener Backend-Architekt mit Expertise in RESTful-API-Design. Bitte entwerfe eine Reihe von API-Schnittstellen für ein E-Commerce-Bestellsystem.

## Geschäftshintergrund
Eine B2C-E-Commerce-Plattform, auf der Benutzer Produkte durchsuchen, kaufen und den Bestellstatus einsehen können.

## Funktionale Anforderungen
- Bestellmodul: Bestellung erstellen, Bestellliste abfragen, Bestelldetails abfragen, Bestellung stornieren, Bestellung bezahlen
- Warenkorbmodul: Produkt hinzufügen, Menge ändern, Produkt entfernen, Warenkorb anzeigen

## Designanforderungen
1. Befolge die RESTful-Spezifikation
2. URLs verwenden Substantive im Plural, Kleinschreibung + Bindestriche
3. Korrekte Verwendung von HTTP-Methoden
4. Einheitliches Antwortformat
5. Versionsverwaltung: /v1/
```

**KI-Ausgabebeispiel**:

| Methode | URL | Beschreibung |
| :--- | :--- | :--- |
| `POST` | `/v1/orders` | Bestellung erstellen |
| `GET` | `/v1/orders` | Bestellliste abfragen |
| `GET` | `/v1/orders/{id}` | Bestelldetails abfragen |
| `PATCH` | `/v1/orders/{id}/status` | Bestellstatus aktualisieren (stornieren/bezahlen) |
| `GET` | `/v1/users/{id}/cart` | Warenkorb abrufen |
| `POST` | `/v1/users/{id}/cart/items` | Produkt zum Warenkorb hinzufügen |
| `PATCH` | `/v1/users/{id}/cart/items/{itemId}` | Menge des Warenkorbprodukts ändern |
| `DELETE` | `/v1/users/{id}/cart/items/{itemId}` | Produkt aus dem Warenkorb entfernen |

### 9.3 Hinweise zum KI-gestützten Design

| Hinweis | Beschreibung |
| :--- | :--- |
| **Vollständigen Kontext bereitstellen** | Geschäftshintergrund, Benutzerrollen, Datenbeziehungen müssen klar beschrieben werden |
| **Einschränkungen klar definieren** | Benennungskonventionen, Versionsstrategie, Antwortformat im Voraus festlegen |
| **Iterativ optimieren** | Der erste Output ist möglicherweise nicht perfekt, Details nachfragen, Änderungen verlangen |
| **Manuelle Überprüfung** | KI-generierte Inhalte müssen manuell auf Übereinstimmung mit den Geschäftsanforderungen geprüft werden |
| **Randfälle ergänzen** | Die KI auffordern, Fehlerbehandlung, Berechtigungskontrolle, Paginierung und andere Randfälle zu berücksichtigen |

::: tip 💡 Nachfragetechniken
- "Bitte ergänze Fehlerantwortbeispiele für jede Schnittstelle"
- "Bitte berücksichtige Paginierung, Sortierung und Filterparameter"
- "Bitte füge eine Beschreibung der Berechtigungskontrolle für die Schnittstellen hinzu"
- "Bitte überprüfe, ob die Best Practices für RESTful eingehalten werden"
:::

---

## Glossar

| Begriff | Englisch | Erklärung |
| :--- | :--- | :--- |
| **API** | Application Programming Interface | Vereinbarung für die Kommunikation zwischen Programmen |
| **REST** | Representational State Transfer | Ein Architekturstil, der URLs zur Identifizierung von Ressourcen verwendet |
| **Ressource** | Resource | Kernkonzept der REST-Architektur, hat eine eindeutige Kennung (URL) |
| **Idempotenz** | Idempotency | Mehrmalige Ausführung führt zum gleichen Ergebnis |
| **Statuscode** | Status Code | Der im HTTP-Protokoll definierte Antwortstatus |
| **Versionsverwaltung** | Versioning | Alte und neue APIs koexistieren lassen, reibungslose Upgrades ermöglichen |
| **Anfragekörper** | Request Body | Daten, die von POST/PUT/PATCH-Anfragen übertragen werden |
| **Antwortkörper** | Response Body | Vom Server zurückgegebene Daten |
| **Header** | Header | Metadaten der Anfrage/Antwort (z.B. Content-Type) |
| **Authentifizierung** | Authentication | Überprüfen "wer du bist" (Anmeldung, Token) |
| **Autorisierung** | Authorization | Überprüfen "was du tun darfst" (Berechtigungen) |
