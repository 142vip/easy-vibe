# Serialisierung: Datenformatkonvertierung

::: tip Kernfrage
**Wie werden Daten über das Netzwerk übertragen?** Das ist wie die Frage: Wie kann eine Person so sprechen, dass eine andere sie versteht? Serialisierung löst das Problem der "Datenübersetzung" — Objekte im Arbeitsspeicher in ein übertragbares Format zu übersetzen.
:::

---

## Die Notwendigkeit der Serialisierung

Bei der Kommunikation zwischen Frontend und Backend müssen Daten mehrere "Verwandlungen" durchlaufen, um vom Server zum Client zu gelangen.

**Szenario 1: Die empfangenen Daten haben sich "verändert"**

```javascript
// Backend sendet
Date birth = new Date(1990, 5, 15)

// Frontend empfängt
{ "birth": "1990-06-15T00:00:00Z" }  // Ein String!
```

Das Frontend möchte `.getFullYear()` verwenden, erhält aber einen Fehler — da dies kein Date-Objekt, sondern ein String ist.

**Szenario 2: Chinesische Zeichen werden unleserlich**

```json
// Erwartet
{ "name": "Max Müller" }

// Tatsächlich empfangen
{ "name": "å¼ ä¸" }
```

Zeichenkodierungsprobleme führen zu unleserlichen Zeichen.

**Szenario 3: Performance-Engpass**

```json
// Eine Antwort mit 10000 Artikeln
{
  "products": [
    { "id": 1, "name": "...", "description": "...", ... },
    // ... 9999 weitere
  ]
}
// Größe: 5,2 MB, Übertragungszeit: 3,5 Sekunden
```

Die Redundanz des JSON-Formats führt zu großen Datenpaketen, was die Performance stark beeinträchtigt.

---

**Serialisierung ist wie "Übersetzung"** — Objekte im Arbeitsspeicher werden in ein übertragbares Format "übersetzt", und der Empfänger "übersetzt" sie zurück.

---

## 1. Was ist Serialisierung/Deserialisierung

**Serialisierung** (Serialization) ist der Prozess der Umwandlung von Objekten in ein übertragbares Format.

**Deserialisierung** (Deserialization) ist der Prozess der Rückwandlung des Übertragungsformats in Objekte.

### 1.1 Analogie mit dem Build-Artefaktversand

| Paketversand | Serialisierung | Beschreibung |
| :--- | :--- | :--- |
| Artikel verpacken | Serialisierung | Gegenstände in eine Kiste packen und etikettieren |
| Transport | Netzwerkübertragung | Paketwagen transportiert zum Ziel |
| Auspacken | Deserialisierung | Empfänger öffnet die Kiste und entnimmt die Gegenstände |

### 1.2 Warum ist Serialisierung nötig

| Grund | Beschreibung | Beispiel |
| :--- | :--- | :--- |
| **Netzwerkübertragung** | Das Netzwerk kann nur Byteströme übertragen | API-Aufrufe, RPC-Kommunikation |
| **Persistente Speicherung** | Festplatten können nur Bytes speichern | Objekte in Dateien/Datenbanken speichern |
| **Sprachübergreifend** | Unterschiedliche Sprachen haben unterschiedliche Datenstrukturen | Java-Objekt → Python-Dictionary |
| **Verteilter Cache** | Redis/Memcached speichert Bytes | Benutzerinformationen cachen |

---

## 2. Gängige Serialisierungsformate

Probiere es aus: Klicke auf die Schaltfläche unten und beobachte den Serialisierungsprozess in verschiedenen Sprachen:

<SerializationDemo />

### 2.1 JSON: Das Universellste

**Vorteile**:
- Gute Lesbarkeit, einfach zu debuggen
- Von allen Sprachen unterstützt
- Browser-native Unterstützung (`JSON.parse` / `JSON.stringify`)

**Nachteile**:
- Großes Volumen (viele `{}` `""`-Markierungen)
- Keine Unterstützung für komplexe Datentypen (Date, Map, Set werden in Strings umgewandelt)

**Anwendungsszenarien**:
- Öffentliche APIs
- Frontend-Backend-Kommunikation
- Konfigurationsdateien

### 2.2 XML: Einstals der Standard

```xml
<?xml version="1.0" encoding="UTF-8"?>
<user>
  <id>123</id>
  <name>Max Müller</name>
  <email>max@example.com</email>
  <age>28</age>
</user>
```

**Vorteile**:
- Klare Struktur, unterstützt Kommentare
- Unterstützt komplexe Verschachtelungen
- Schema-Validierung (XSD)

**Nachteile**:
- Großes Volumen, langsames Parsen
- Redundante Tags (`<open></close>`)

**Anwendungsszenarien**:
- Konfigurationsdateien (Spring, MyBatis)
- SOAP-Protokoll
- Komplexer Datenaustausch

### 2.3 Protobuf: Das Effizienteste

```protobuf
// user.proto
syntax = "proto3";
message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
  int32 age = 4;
}
```

**Vorteile**:
- Kleines Volumen (30-50% kleiner als JSON)
- Schnell (5-10x schnellere Parsing-Geschwindigkeit)
- Abwärtskompatibel (neue Felder beeinträchtigen alte Versionen nicht)

**Nachteile**:
- Nicht lesbar (Binärformat)
- Erfordert .proto-Definitionsdatei
- Keine Unterstützung für dynamische Typen

**Anwendungsszenarien**:
- Interne Mikrodienst-Kommunikation
- Hochperformance-Szenarien (Spiele, Echtzeitkommunikation)
- Mobile Apps (spart Datenvolumen)

### 2.4 MessagePack: Balance zwischen Lesbarkeit und Performance

```json
// MessagePack ist eine Binärversion von JSON
// Dieselben Daten sind mit MessagePack ca. 30% kleiner als mit JSON
```

**Vorteile**:
- Kleiner als JSON, schneller als JSON
- Behält das JSON-Datenmodell bei
- Unterstützt alle JSON-Typen

**Nachteile**:
- Nicht lesbar
- Nicht so effizient wie Protobuf

**Anwendungsszenarien**:
- Wenn Performance benötigt wird, aber Protobuf nicht verwendet werden soll
- Redis-Caching
- WebSocket-Nachrichten

---

## 3. Vergleich der Serialisierungsmethoden verschiedener Sprachen

| Sprache | JSON-Bibliothek | Protobuf-Bibliothek | XML-Bibliothek |
| :--- | :--- | :--- | :--- |
| **JavaScript** | `JSON.stringify()` | `protobuf.js` | `fast-xml-parser` |
| **Python** | `json.dumps()` | `protobuf` | `xmltodict` |
| **Java** | `Jackson` / `Gson` | `protobuf-java` | `JAXB` |
| **Go** | `encoding/json` | `proto` | `encoding/xml` |
| **C++** | `nlohmann/json` | `protobuf` | `tinyxml2` |
| **C#** | `System.Text.Json` | `Google.Protobuf` | `System.Xml` |

::: tip Auswahl-Empfehlungen
- **Frontend-Backend-Kommunikation**: JSON (einfach zu debuggen)
- **Interne Mikrodienste**: Protobuf (beste Performance)
- **Konfigurationsdateien**: JSON oder YAML
- **Anbindung an Altsysteme**: XML (möglicherweise keine Alternative)
:::

---

## 4. Performance-Vergleich

### 4.1 Größenvergleich (am Beispiel eines Benutzerobjekts)

| Format | Größe | Relativ zu JSON |
| :--- | :--- | :--- |
| JSON | 68 Bytes | 100% |
| XML | 142 Bytes | 209% |
| Protobuf | 38 Bytes | 56% |
| MessagePack | 52 Bytes | 76% |

### 4.2 Geschwindigkeitsvergleich (10000-fache Serialisierung)

| Format | Dauer | Relativ zu JSON |
| :--- | :--- | :--- |
| JSON | 45 ms | 100% |
| XML | 120 ms | 267% |
| Protobuf | 8 ms | 18% |
| MessagePack | 28 ms | 62% |

::: tip Leistungstest-Ergebnisse
- **Protobuf am schnellsten**: Geeignet für Hochleistungs-Szenarien
- **MessagePack an zweiter Stelle**: Etwa 40% schneller als JSON
- **JSON am langsamsten**: Für die meisten Szenarien jedoch ausreichend
:::

---

## 5. Häufige Probleme

### 5.1 Datums-Serialisierungsproblem

**Problem**: Date-Objekte werden nach der Serialisierung zu Strings

```javascript
// Vor der Serialisierung
const date = new Date('2024-01-01')

// Nach der Serialisierung
JSON.stringify(date)  // "2024-01-01T00:00:00.000Z"
```

**Lösungen**:
```javascript
// Option 1: In Zeitstempel umwandeln
{ createdAt: date.getTime() }  // 1704067200000

// Option 2: In ISO-String umwandeln
{ createdAt: date.toISOString() }  // "2024-01-01T00:00:00.000Z"

// Option 3: Benutzerdefinierte Serialisierung
JSON.stringify(obj, (key, value) => {
  if (value instanceof Date) {
    return { __type: 'Date', value: value.toISOString() }
  }
  return value
})
```

### 5.2 Zirkelbezug-Problem

**Problem**: Zirkelbezüge in Objekten verursachen Fehler

```javascript
const obj = { name: 'test' }
obj.self = obj
JSON.stringify(obj)  // TypeError: Converting circular structure to JSON
```

**Lösungen**:
```javascript
// Option 1: Zirkelbezüge herausfiltern
const seen = new WeakSet()
JSON.stringify(obj, (key, value) => {
  if (typeof value === 'object' && value !== null) {
    if (seen.has(value)) return
    seen.add(value)
  }
  return value
})

// Option 2: flatted-Bibliothek verwenden
import { parse, stringify } from 'flatted'
stringify(obj)  // Verarbeitet Zirkelbezüge automatisch
```

### 5.3 Problem mit unleserlichen Zeichen

**Problem**: Chinesische Zeichen werden nach der Serialisierung unleserlich

**Ursache**:
- Inkonsistente Zeichenkodierung (UTF-8 vs. GBK)
- BOM-Markierung

**Lösungen**:
```python
# Python: Sicherstellen, dass UTF-8 verwendet wird
import json
json.dumps(data, ensure_ascii=False)  # Chinesische Zeichen nicht escapen
```

```javascript
// Node.js: Response-Header setzen
res.setHeader('Content-Type', 'application/json; charset=utf-8')
```

---

## 6. Praxis: Serialisierungsstrategie für ein E-Commerce-System

### 6.1 Szenarioanalyse

| Szenario | Formatwahl | Begründung |
| :--- | :--- | :--- |
| **App → Backend-API** | JSON | Einfach zu debuggen, einheitlich zwischen Frontend und Backend |
| **Backend → Backend-RPC** | Protobuf | Beste Performance, spart Datenvolumen |
| **Caching in Redis** | MessagePack | Kleiner als JSON, kann komplexe Objekte serialisieren |
| **Protokollierung** | JSON | Einfach von Log-Analyse-Tools zu parsen |

### 6.2 Codebeispiel

```javascript
// API-Antwort (JSON)
app.get('/api/products/:id', async (req, res) => {
  const product = await db.getProduct(req.params.id)
  res.json({
    code: 0,
    data: product
  })
})

// Mikrodienst-Kommunikation (Protobuf)
// product.proto
syntax = "proto3";
message Product {
  int32 id = 1;
  string name = 2;
  int32 price = 3;
}

// Server
const proto = require('./product.proto')
const message = proto.Product.create(product)
const buffer = proto.Product.encode(message).finish()

// Client
const decoded = proto.Product.decode(buffer)

// Redis-Cache (MessagePack)
const msgpack = require('msgpack-lite')
await redis.set(
  `product:${id}`,
  msgpack.encode(product)
)
const cached = msgpack.decode(await redis.get(`product:${id}`))
```

---

## 7. KI-gestützte Auswahl der Serialisierungsstrategie

KI kann bei der Auswahl des geeigneten Serialisierungsformats für ein bestimmtes Szenario helfen.

### 7.1 Prompt-Vorlage

```
Du bist ein erfahrener Systemarchitekt mit Expertise in Daten-Serialisierungstechnologien. Bitte hilf mir bei der Wahl der passenden Serialisierungsstrategie.

## Geschäftsszenario
[Beschreibe dein Szenario, z. B.: E-Commerce-App, Spiele-Backend, Mikrodienste usw.]

## Technische Anforderungen
[Liste die Randbedingungen auf, z. B.:
- Frontend-Backend-Trennung (Vue + Node.js)
- Hohe Performance-Anforderungen (QPS > 10000)
- Datenvolumen-sensitiv (Mobile, Datenvolumen sparen)
- Sprachübergreifend (Java + Python + Go)]

## Datenmerkmale
[Beschreibe die Datenmerkmale, z. B.:
- Große Datenmengen (einzelne Antwort > 1MB)
- Komplexe Struktur (mehrstufig verschachtelt)
- Enthält besondere Typen wie Datum, Binärdaten usw.]

## Ausgabeformat
Bitte in folgendem Format ausgeben:
1. Empfohlene Lösung (JSON/Protobuf/MessagePack/XML)
2. Begründung
3. Performance-Vergleich (geschätzte Größe und Geschwindigkeit)
4. Codebeispiel
```

### 7.2 Praktisches Beispiel

**Eingabe-Prompt**:

```
Du bist ein erfahrener Systemarchitekt. Unsere E-Commerce-App muss die Performance der Artikellisten-Schnittstelle optimieren.

## Geschäftsszenario
- Artikellisten-Schnittstelle einer E-Commerce-App
- Einzelne Rückgabe von 100 Artikeln
- Jeder Artikel enthält: id, name, price, image, description und 20 weitere Felder
- Aktuell JSON, Antwortgröße ca. 200KB, Dauer 800ms

## Technische Anforderungen
- Frontend ist Vue.js
- Backend ist Node.js + Go-Mikrodienste
- Performance und Entwicklungseffizenz ausbalancieren

## Optimierungsziel
- Antwortzeit auf unter 300ms senken
- Datenpaketgröße um 30% reduzieren
```

**KI-Ausgabe**:

```
Empfohlene Lösung: Hybrid-Ansatz

1. **API-Ebene**: Weiterhin JSON (frontend-freundlich)
2. **Mikrodienst-Kommunikation**: Wechsel zu Protobuf (Performance-Steigerung)
3. **Statische Daten**: gzip-Komprimierung aktivieren

### Begründung
- JSON ist am frontend-freundlichsten, kein zusätzliches Parsing erforderlich
- Backend-Mikrodienste mit Protobuf können das Datenvolumen um 40% reduzieren
- gzip-Komprimierung ist bei Text effektiv (JSON kann um 70% komprimiert werden)

### Performance-Vergleich
| Lösung | Größe | Dauer |
|--------|-------|-------|
| Aktuell (JSON) | 200 KB | 800 ms |
| + gzip | 60 KB | 350 ms |
| + Protobuf | 50 KB | 280 ms |

### Codebeispiel
[Spezifischer Implementierungscode...]
```

---

## Glossar

| Begriff | Englisch | Erklärung |
| :--- | :--- | :--- |
| **Serialisierung** | Serialization | Objekt → Bytestrom |
| **Deserialisierung** | Deserialization | Bytestrom → Objekt |
| **JSON** | JavaScript Object Notation | Das am häufigsten verwendete Textformat |
| **XML** | Extensible Markup Language | Auszeichnungssprache, früher der Standard |
| **Protobuf** | Protocol Buffers | Hochentwickeltes Format von Google |
| **MessagePack** | - | Binärversion von JSON |
| **Kodierung** | Encoding | Zeichen → Bytes |
| **Dekodierung** | Decoding | Bytes → Zeichen |
